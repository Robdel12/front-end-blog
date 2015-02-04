define('front-end/adapters/application', ['exports', 'ember', 'ember-data'], function (exports, Ember, DS) {

  'use strict';

  var AppAdapter = DS['default'].ActiveModelAdapter.extend({
    namespace: "api"
  });

  var inflector = Ember['default'].Inflector.inflector;
  inflector.uncountable("timeline"); //only makes call to /timeline

  exports['default'] = AppAdapter;

});
define('front-end/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', './config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  var App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

});
define('front-end/components/c-disqus', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var CDisqusComponent = Ember['default'].Component.extend({
    elementId: "disqus_thread",
    classNames: ["comments"],
    timer: null,

    setupDisqus: (function () {
      var controller = this.get("parentView.controller");
      var title = controller.get("title");

      window.disqus_title = title;

      if (!window.DISQUS) {
        var disqusShortname = "robertdeluca";

        window.disqus_shortname = disqusShortname;

        var dsq = document.createElement("script");dsq.type = "text/javascript";dsq.async = true;
        dsq.src = "//" + disqusShortname + ".disqus.com/embed.js";
        (document.getElementsByTagName("head")[0] || document.getElementsByTagName("body")[0]).appendChild(dsq);
      }
    }).on("didInsertElement"),

    loadNewPostComments: (function () {
      if (window.DISQUS) {
        this.reset();
      } else {
        this.set("timer", Ember['default'].run.debounce(this, this.loadNewPostComments, 100));
      }
    }).on("willInsertElement"),

    reset: function () {
      var controller = this.get("parentView.controller");
      var postIdentifier = controller.get("urlString");
      var postUrl = window.location.href;

      Ember['default'].run.scheduleOnce("afterRender", function () {
        window.DISQUS.reset({
          reload: true,
          config: function () {
            this.page.identifier = postIdentifier;
            this.page.url = postUrl;
          }
        });
      });
    } });

  exports['default'] = CDisqusComponent;

});
define('front-end/components/date-picker', ['exports', 'ember', 'ember-cli-datepicker/components/date-picker'], function (exports, Em, Datepicker) {

	'use strict';

	exports['default'] = Datepicker['default'];

});
define('front-end/components/flash-message', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    classNames: ["alert"],
    classNameBindings: ["alertType"],

    alertType: Ember['default'].computed("flash.type", function () {
      return "alert-" + Ember['default'].get(this, "flash.type");
    })
  });

});
define('front-end/components/page-numbers', ['exports', 'ember', 'ember-cli-pagination/util', 'ember-cli-pagination/lib/page-items', 'ember-cli-pagination/validate'], function (exports, Ember, Util, PageItems, Validate) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    currentPageBinding: "content.page",
    totalPagesBinding: "content.totalPages",

    hasPages: Ember['default'].computed.gt("totalPages", 1),

    watchInvalidPage: (function () {
      var me = this;
      var c = this.get("content");
      if (c && c.on) {
        c.on("invalidPage", function (e) {
          me.sendAction("invalidPageAction", e);
        });
      }
    }).observes("content"),

    truncatePages: true,
    numPagesToShow: 10,

    validate: function () {
      if (Util['default'].isBlank(this.get("currentPage"))) {
        Validate['default'].internalError("no currentPage for page-numbers");
      }
      if (Util['default'].isBlank(this.get("totalPages"))) {
        Validate['default'].internalError("no totalPages for page-numbers");
      }
    },

    pageItemsObj: (function () {
      return PageItems['default'].create({
        parent: this,
        currentPageBinding: "parent.currentPage",
        totalPagesBinding: "parent.totalPages",
        truncatePagesBinding: "parent.truncatePages",
        numPagesToShowBinding: "parent.numPagesToShow",
        showFLBinding: "parent.showFL"
      });
    }).property(),

    //pageItemsBinding: "pageItemsObj.pageItems",

    pageItems: (function () {
      this.validate();
      return this.get("pageItemsObj.pageItems");
    }).property("pageItemsObj.pageItems", "pageItemsObj"),

    canStepForward: (function () {
      var page = Number(this.get("currentPage"));
      var totalPages = Number(this.get("totalPages"));
      return page < totalPages;
    }).property("currentPage", "totalPages"),

    canStepBackward: (function () {
      var page = Number(this.get("currentPage"));
      return page > 1;
    }).property("currentPage"),

    actions: {
      pageClicked: function (number) {
        Util['default'].log("PageNumbers#pageClicked number " + number);
        this.set("currentPage", number);
        this.sendAction("action", number);
      },
      incrementPage: function (num) {
        var currentPage = Number(this.get("currentPage")),
            totalPages = Number(this.get("totalPages"));

        if (currentPage === totalPages && num === 1) {
          return false;
        }
        if (currentPage <= 1 && num === -1) {
          return false;
        }
        this.incrementProperty("currentPage", num);

        var newPage = this.get("currentPage");
        this.sendAction("action", newPage);
      }
    }
  });

});
define('front-end/controllers/about/base', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    published: [false, true],
    selectedState: null,
    openPreview: true,

    actions: {

      save: function () {
        this.get("model").save()["catch"](function (reason) {
          if (reason.status === 500) {
            this.get("flashes").danger("There was a server error.");
          }
        });
        this.transitionToRoute("about.index");
      },

      togglePreview: function () {
        if (this.get("openPreview") === false) {
          this.set("openPreview", true);
        } else {
          this.set("openPreview", false);
        }
      }

    }

  });

});
define('front-end/controllers/about/edit', ['exports', 'ember', './base'], function (exports, Ember, TimelineBaseController) {

  'use strict';

  exports['default'] = TimelineBaseController['default'].extend({

    autoSave: (function () {
      this.timer = Ember['default'].run.later(this, function () {
        if (this.get("model").get("isDirty")) {
          var alert = Ember['default'].$(".alert");
          var notificationMessage = "Your timeline \"" + this.get("title") + "\" was auto saved";

          this.model.save()["catch"](function (reason) {
            if (reason.status === 500) {
              this.get("flashes").danger("Server error. Couldn't auto save.");
            }
          });

          alert.text(notificationMessage).show();
          if (document.hidden) {
            this.desktopNotifcation(notificationMessage);
          }
        }
        this.autoSave();
      }, 60000); //60000 = 1 min
    }).on("init"),

    stopAutoSave: function () {
      Ember['default'].run.cancel(this.timer);
    },

    desktopNotifcation: function (message) {
      if (window.Notification.permission === "granted") {
        new window.Notification(message);
      } else if (window.Notification.permission !== "denied") {
        window.Notification.requestPermission(function (permission) {
          if (permission === "granted") {
            new window.Notification(message);
          }
        });
      }
    },

    actions: {

      destroy: function () {
        var prompt = window.confirm("Are you sure you want to delete this?");
        if (prompt) {
          this.store.find("timeline", this.model.id).then(function (event) {
            event.destroyRecord();
          });
          return this.transitionTo("about.index");
        }
      }
    }

  });

});
define('front-end/controllers/about/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].ArrayController.extend({
    sortProperties: ["eventDate"],
    sortAscending: false
  });

});
define('front-end/controllers/about/new', ['exports', './base'], function (exports, TimelineBaseController) {

	'use strict';

	exports['default'] = TimelineBaseController['default'].extend({});

});
define('front-end/controllers/analytics', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    controllerData: null,
    loadingData: false,
    graphStartDate: moment().subtract(1, "weeks").startOf("isoWeek").format("YYYY-MM-DD"),
    graphEndDate: moment().format("YYYY-MM-DD"),
    maxDate: moment().toDate(),

    axis: {
      x: {
        type: "timeseries",
        tick: {
          format: "%b %d, %Y"
        }
      }
    },

    setDateAndData: (function (startDate, endDate) {
      startDate = this.get("graphStartDate") || startDate;
      endDate = this.get("graphEndDate") || endDate;
      var self = this;

      this.set("loadingData", true);

      return this.store.find("analytic", { startDate: startDate, endDate: endDate }).then(function (data) {
        var graphData = data.content[0]._data;
        self.set("loadingData", false);

        return self.set("controllerData", {
          x: "date",
          columns: [graphData.date, graphData.pageview],
          type: "bar"
        });
      });
    }).on("init"),

    actions: {
      updateData: function () {
        this.setDateAndData(this.get("startDate"), this.get("endDate"));
      }
    }
  });

});
define('front-end/controllers/contact', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].ObjectController.extend({
    modalClosed: true,
    thankYou: true,

    init: function () {
      this.set("contact", Ember['default'].Object.create());
      this._super();
    },

    actions: {

      submitContact: function () {
        var newContact;
        var contactData = {
          name: this.get("contact.name"),
          email: this.get("contact.email"),
          reason: this.get("contact.reason"),
          comments: this.get("contact.comments"),
          honeypot: this.get("contact.honeypot")
        };

        if (!this.contactIsValid()) {
          this.get("flashes").danger("Make sure all of the required fields are filled out");
          return false;
        }

        //No spam!
        if (contactData.honeypot !== undefined) {
          this.get("flashes").danger("Uh oh, seems like you're a bot.");
          return false;
        }

        newContact = this.store.createRecord("contact", contactData);

        newContact.save()["catch"](function (reason) {
          if (reason.status === 500) {
            this.get("flashes").danger("There was a server error. If it happens more than once contact me on twitter: @robdel12");
          }
        });

        //Clear the form
        this.setProperties({
          "contact.name": "",
          "contact.email": "",
          "contact.reason": "",
          "contact.comments": ""
        });

        this.set("modalClosed", false);
        Ember['default'].$("body").addClass("modal-backing");
        window.scrollTo(0, 0);
      },

      closeModal: function () {
        this.set("modalClosed", true);
        Ember['default'].$("body").removeClass("modal-backing");
      }

    },

    contactIsValid: function () {
      var isValid = true;
      ["contact.name", "contact.email", "contact.reason"].forEach(function (field) {
        if (this.get(field) === "" || this.get(field) === undefined) {
          isValid = false;
        }
      }, this);
      return isValid;
    }

  });

});
define('front-end/controllers/dashboard', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var DashboardController = Ember['default'].ArrayController.extend({
    sortProperties: ["created_at"],
    sortAscending: false
  });

  exports['default'] = DashboardController;

});
define('front-end/controllers/login', ['exports', 'ember', 'simple-auth/mixins/login-controller-mixin'], function (exports, Ember, LoginControllerMixin) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend(LoginControllerMixin['default'], {
    authenticator: "simple-auth-authenticator:devise",
    error: false
  });

});
define('front-end/controllers/posts/base', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    published: [false, true],
    selectedState: null,
    preview: false,
    settings: {
      mobile: true
    },

    setUrl: (function () {
      if (!this.get("model.title")) {
        return false;
      }

      var currentPostSlug = this.get("model.title").replace(/\W/g, "-").replace(/-{1,}/g, "-").replace(/^-|-$/g, "").toLowerCase();

      return this.set("model.postSlug", currentPostSlug);
    }).observes("model.title"),

    actions: {
      save: function () {
        this.get("model").save()["catch"](function (reason) {
          if (reason.status === 500) {
            this.get("flashes").danger("There was a server error.");
          }
        });

        if (this.get("model.isPublished") === true) {
          this.transitionToRoute("posts.show", this.get("model.postSlug"));
        } else {
          this.transitionToRoute("posts.edit", this.get("model.postSlug"));
        }
        return false;
      },

      togglePreview: function () {
        if (this.get("preview") === false) {
          this.set("preview", true);
        } else {
          this.set("preview", false);
        }
      }
    }
  });

});
define('front-end/controllers/posts/edit', ['exports', 'ember', './base'], function (exports, Ember, PostsBaseController) {

  'use strict';

  var EditController = PostsBaseController['default'].extend({

    autoSave: (function () {
      this.timer = Ember['default'].run.later(this, function () {
        if (this.get("model").get("isDirty")) {
          var notificationMessage = "Your post \"" + this.get("model.title") + "\" was auto saved";

          this.get("model").save()["catch"](function (reason) {
            if (reason.status === 500) {
              this.get("flashes").danger("Server error. Couldn't auto save.");
            }
          });

          this.get("flashes").info(notificationMessage);

          if (document.hidden) {
            this.desktopNotifcation(notificationMessage);
          }
        }
        this.autoSave();
      }, 60000); //60000 = 1 min
    }).on("init"),

    stopAutoSave: function () {
      Ember['default'].run.cancel(this.timer);
    },

    desktopNotifcation: function (message) {
      if (window.Notification.permission === "granted") {
        new window.Notification(message);
      } else if (window.Notification.permission !== "denied") {
        window.Notification.requestPermission(function (permission) {
          if (permission === "granted") {
            new window.Notification(message);
          }
        });
      }
    },

    actions: {

      destroy: function () {
        var prompt = window.confirm("Are you sure you want to delete this?");
        if (prompt) {
          this.store.find("post", this.model.id).then(function (post) {
            post.destroyRecord();
          });
          return this.transitionTo("dashboard");
        }
      },

      save: function () {
        return this.model.save().then((function (_this) {
          return function () {
            if (_this.model._data.is_published === true) {
              return _this.transitionToRoute("posts.show", _this.model);
            } else {
              Ember['default'].get(_this, "flashes").info("Your post was saved.");
            }
          };
        })(this));
      }
    }

  });

  exports['default'] = EditController;

});
define('front-end/controllers/posts/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var PostsController = Ember['default'].ArrayController.extend({
    queryParams: ["page", "perPage"],
    pageBinding: "content.page",
    totalPagesBinding: "content.totalPages",
    page: 1,
    perPage: 10
  });

  exports['default'] = PostsController;

});
define('front-end/controllers/posts/new', ['exports', './base'], function (exports, PostsBaseController) {

	'use strict';

	exports['default'] = PostsBaseController['default'].extend({});

});
define('front-end/helpers/format-copyrightdate', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.makeBoundHelper(function () {
    return new Date().getFullYear();
  });

});
define('front-end/helpers/format-markdown', ['exports', 'ember', 'markdown-code-highlighting/helpers/format-markdown'], function (exports, Ember, FormatMarkdown) {

	'use strict';

	exports['default'] = FormatMarkdown['default'];

});
define('front-end/helpers/head-title', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.makeBoundHelper(function (title) {
    Ember['default'].$("head").find("title").text("Robert DeLuca - " + title);
  }, "title");

});
define('front-end/initializers/export-application-global', ['exports', 'ember', '../config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    var classifiedName = Ember['default'].String.classify(config['default'].modulePrefix);

    if (config['default'].exportApplicationGlobal) {
      window[classifiedName] = application;
    }
  };

  exports['default'] = {
    name: "export-application-global",

    initialize: initialize
  };

});
define('front-end/initializers/flashes', ['exports', 'front-end/services/flash-service'], function (exports, flashMessagesService) {

  'use strict';

  exports['default'] = {
    name: "flash-messages",
    initialize: function (container, application) {
      application.register("service:flash-messages", flashMessagesService['default'], { singleton: true });
      application.inject("controller", "flashes", "service:flash-messages");
    }
  };

});
define('front-end/initializers/simple-auth-devise', ['exports', 'simple-auth-devise/configuration', 'simple-auth-devise/authenticators/devise', 'simple-auth-devise/authorizers/devise', '../config/environment'], function (exports, Configuration, Authenticator, Authorizer, ENV) {

  'use strict';

  exports['default'] = {
    name: "simple-auth-devise",
    before: "simple-auth",
    initialize: function (container, application) {
      Configuration['default'].load(container, ENV['default']["simple-auth-devise"] || {});
      container.register("simple-auth-authorizer:devise", Authorizer['default']);
      container.register("simple-auth-authenticator:devise", Authenticator['default']);
    }
  };

});
define('front-end/initializers/simple-auth', ['exports', 'simple-auth/configuration', 'simple-auth/setup', '../config/environment'], function (exports, Configuration, setup, ENV) {

  'use strict';

  exports['default'] = {
    name: "simple-auth",
    initialize: function (container, application) {
      Configuration['default'].load(container, ENV['default']["simple-auth"] || {});
      setup['default'](container, application);
    }
  };

});
define('front-end/models/analytic', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    date: DS['default'].attr(),
    pageview: DS['default'].attr()
  });

});
define('front-end/models/contact', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    name: DS['default'].attr("string"),
    email: DS['default'].attr("string"),
    reason: DS['default'].attr("string"),
    comments: DS['default'].attr("string"),
    honeypot: DS['default'].attr("string") });

});
define('front-end/models/flash', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Object.extend({
    isSuccess: Ember['default'].computed.equal("type", "success"),
    isInfo: Ember['default'].computed.equal("type", "info"),
    isWarning: Ember['default'].computed.equal("type", "warning"),
    isDanger: Ember['default'].computed.equal("type", "danger"),

    init: function () {
      Ember['default'].run.later(this, function () {
        this.destroy();
      }, Ember['default'].get(this, "timeout"));
    }
  });

});
define('front-end/models/post', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    postSlug: DS['default'].attr("string"),
    title: DS['default'].attr("string"),
    createdAt: DS['default'].attr("date"),
    excerpt: DS['default'].attr("string"),
    body: DS['default'].attr("string"),
    isPublished: DS['default'].attr("boolean"),
    formattedDate: (function () {
      return moment(this.get("createdAt")).format("MMM Do");
    }).property("createdAt"),
    fullFormattedDate: (function () {
      return moment(this.get("createdAt")).format("MMMM Do YYYY, h:mm a");
    }).property("createdAt")
  });

});
define('front-end/models/timeline', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    title: DS['default'].attr("string"),
    description: DS['default'].attr("string"),
    eventDate: DS['default'].attr("string"),
    createdAt: DS['default'].attr("date"),
    isPublished: DS['default'].attr("boolean"),
    formattedDate: (function () {
      return moment(this.get("createdAt")).format("MMMM Do, YYYY");
    }).property("createdAt")
  });

});
define('front-end/router', ['exports', 'ember', './config/environment'], function (exports, Ember, config) {

  'use strict';

  var Router = Ember['default'].Router.extend({
    location: config['default'].locationType
  });

  Router.map(function () {
    this.route("portfolio");
    this.route("login");
    this.route("dashboard");
    this.route("contact");

    this.resource("posts", function () {
      this.route("show", { path: "/:postSlug" });
      this.route("edit", { path: "/:post_id/edit" });
      this.route("new");
    });

    this.resource("about", function () {
      this.route("new");
      this.route("edit", { path: "/:timeline_id/edit" });
    });
    this.route("error404", { path: "/*path" }); //404s son
    this.route("analytics");
  });

  if (config['default'].environment === "production") {
    Router.reopen({
      notifyGoogleAnalytics: (function () {
        return window.ga("send", "pageview", {
          page: this.get("url"),
          title: this.get("url")
        });
      }).on("didTransition")
    });
  }

  exports['default'] = Router;

});
define('front-end/routes/about/edit', ['exports', 'ember', 'simple-auth/mixins/authenticated-route-mixin'], function (exports, Ember, AuthenticatedRouteMixin) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend(AuthenticatedRouteMixin['default'], {
    model: function (params) {
      return this.store.find("timeline", params.timeline_id);
    }
  });

});
define('front-end/routes/about/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function () {
      return this.store.find("timeline");
    }
  });

});
define('front-end/routes/about/new', ['exports', 'ember', 'simple-auth/mixins/authenticated-route-mixin'], function (exports, Ember, AuthenticatedRouteMixin) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend(AuthenticatedRouteMixin['default'], {
    model: function () {
      return this.store.createRecord("timeline");
    }
  });

});
define('front-end/routes/analytics', ['exports', 'ember', 'simple-auth/mixins/authenticated-route-mixin'], function (exports, Ember, AuthenticatedRouteMixin) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend(AuthenticatedRouteMixin['default']);

});
define('front-end/routes/application', ['exports', 'ember', 'simple-auth/mixins/application-route-mixin'], function (exports, Ember, ApplicationRouteMixin) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend(ApplicationRouteMixin['default']);

});
define('front-end/routes/contact', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('front-end/routes/create', ['exports', 'ember', 'simple-auth/mixins/authenticated-route-mixin'], function (exports, Ember, AuthenticatedRouteMixin) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend(AuthenticatedRouteMixin['default']);

});
define('front-end/routes/dashboard', ['exports', 'ember', 'simple-auth/mixins/authenticated-route-mixin'], function (exports, Ember, AuthenticatedRouteMixin) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend(AuthenticatedRouteMixin['default'], {
    model: function () {
      return this.store.find("post", { dashboard: true });
    },

    setupController: function (controller) {
      this._super.apply(this, arguments);

      controller.set("contacts", this.store.find("contact"));
    }
  });

});
define('front-end/routes/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var IndexRoute = Ember['default'].Route.extend({
    redirect: function () {
      this.replaceWith("posts");
    }
  });

  exports['default'] = IndexRoute;

});
define('front-end/routes/posts/edit', ['exports', 'ember', 'simple-auth/mixins/authenticated-route-mixin'], function (exports, Ember, AuthenticatedRouteMixin) {

  'use strict';

  var PostsRoute = Ember['default'].Route.extend(AuthenticatedRouteMixin['default'], {

    model: function (params) {
      return this.store.find("post", params.post_id);
    },

    deactivate: function () {
      this.controllerFor(this.routeName).stopAutoSave();
    }

  });

  exports['default'] = PostsRoute;

});
define('front-end/routes/posts/index', ['exports', 'ember', 'ember-cli-pagination/remote/route-mixin'], function (exports, Ember, RouteMixin) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend(RouteMixin['default'], {

    model: function (params) {
      return this.findPaged("post", params);
    }

  });

});
define('front-end/routes/posts/new', ['exports', 'ember', 'simple-auth/mixins/authenticated-route-mixin'], function (exports, Ember, AuthenticatedRouteMixin) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend(AuthenticatedRouteMixin['default'], {
    model: function () {
      return this.store.createRecord("post");
    }
  });

});
define('front-end/routes/posts/show', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var PostsRoute = Ember['default'].Route.extend({
    model: function (params) {
      return this.store.find("post", params.postSlug).then(function (slug) {
        return slug;
      });
    }
  });

  exports['default'] = PostsRoute;

});
define('front-end/routes/protected', ['exports', 'ember', 'simple-auth/mixins/authenticated-route-mixin'], function (exports, Ember, AuthenticatedRouteMixin) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend(AuthenticatedRouteMixin['default']);

});
define('front-end/services/flash-service', ['exports', 'ember', 'front-end/models/flash'], function (exports, Ember, FlashMessage) {

  'use strict';

  exports['default'] = Ember['default'].Object.extend({
    queue: Ember['default'].A([]),
    content: Ember['default'].computed.alias("queue"),
    isEmpty: Ember['default'].computed.equal("queue.length", 0),
    timeout: 30000,

    success: function (msg) {
      this._add(msg, "success");
    },

    info: function (msg) {
      this._add(msg, "info");
    },

    warning: function (msg) {
      this._add(msg, "warning");
    },

    danger: function (msg) {
      this._add(msg, "danger");
    },

    // private
    _add: function (msg, type) {
      var flashes, flash;
      flashes = Ember['default'].get(this, "queue");
      flash = this._newFlashMessage(msg, type);
      flashes.pushObject(flash);
    },

    _newFlashMessage: function (msg, type) {
      var timeout;
      Ember['default'].assert("Must pass a valid flash message", msg);
      type = typeof type === "undefined" ? "info" : type;
      timeout = Ember['default'].get(this, "timeout");

      return FlashMessage['default'].create({
        type: type,
        message: msg,
        timeout: timeout
      });
    },

    _queueDidChange: Ember['default'].observer("queue.@each.isDestroyed", function () {
      var flashes, destroyed, timeout;
      flashes = Ember['default'].get(this, "queue");
      timeout = Ember['default'].get(this, "timeout");

      Ember['default'].run.later(this, function () {
        destroyed = flashes.filterBy("isDestroyed", true);
        return flashes.removeObjects(destroyed);
      }, timeout);
    })
  });

});
define('front-end/templates/about/-form', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = '';
    data.buffer.push("<h2>Timeline: ");
    stack1 = helpers._triageMustache.call(depth0, "model.title", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
    if (stack1 != null) { data.buffer.push(stack1); }
    data.buffer.push("</h2>\n<div class=\"timeline\">\n  <div class=\"new-about-inner\">\n    <form ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "save", {"name":"action","hash":{
      'on': ("submit")
    },"hashTypes":{'on': "STRING"},"hashContexts":{'on': depth0},"types":["STRING"],"contexts":[depth0],"data":data})));
    data.buffer.push(">\n      <p>");
    data.buffer.push(escapeExpression(((helpers.input || (depth0 && depth0.input) || helperMissing).call(depth0, {"name":"input","hash":{
      'placeholder': ("Title"),
      'value': ("model.title")
    },"hashTypes":{'placeholder': "STRING",'value': "ID"},"hashContexts":{'placeholder': depth0,'value': depth0},"types":[],"contexts":[],"data":data}))));
    data.buffer.push("</p>\n      <p>");
    data.buffer.push(escapeExpression(((helpers['date-picker'] || (depth0 && depth0['date-picker']) || helperMissing).call(depth0, {"name":"date-picker","hash":{
      'valueFormat': ("YYYY-MM-DD"),
      'format': ("MMMM Do YYYY"),
      'date': ("model.eventDate")
    },"hashTypes":{'valueFormat': "STRING",'format': "STRING",'date': "ID"},"hashContexts":{'valueFormat': depth0,'format': depth0,'date': depth0},"types":[],"contexts":[],"data":data}))));
    data.buffer.push("</p>\n      <p>");
    data.buffer.push(escapeExpression(((helpers.textarea || (depth0 && depth0.textarea) || helperMissing).call(depth0, {"name":"textarea","hash":{
      'class': ("timeline-text-area"),
      'placeholder': ("Body"),
      'value': ("model.description")
    },"hashTypes":{'class': "STRING",'placeholder': "STRING",'value': "ID"},"hashContexts":{'class': depth0,'placeholder': depth0,'value': depth0},"types":[],"contexts":[],"data":data}))));
    data.buffer.push("</p>\n      <p><a href=\"#\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "togglePreview", {"name":"action","hash":{},"hashTypes":{},"hashContexts":{},"types":["STRING"],"contexts":[depth0],"data":data})));
    data.buffer.push(">Toggle Preview</a></p>\n\n      <label for=\"is_published\">Published:</label>\n      ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Select", {"name":"view","hash":{
      'value': ("model.is_published"),
      'id': ("isPublished"),
      'selectionBinding': ("selectedState"),
      'content': ("published")
    },"hashTypes":{'value': "ID",'id': "STRING",'selectionBinding': "STRING",'content': "ID"},"hashContexts":{'value': depth0,'id': depth0,'selectionBinding': depth0,'content': depth0},"types":["ID"],"contexts":[depth0],"data":data})));
    data.buffer.push("\n      <ul class=\"edit-posts-list\">\n        <li><a href=\"#\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "destroy", {"name":"action","hash":{},"hashTypes":{},"hashContexts":{},"types":["STRING"],"contexts":[depth0],"data":data})));
    data.buffer.push(">Delete</a></li>\n      </ul>\n      <button type=\"submit\" class=\"btn\">Save</button>\n    </form>\n  </div>\n  <div ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {"name":"bind-attr","hash":{
      'class': (":timeline-preview :preview openPreview:show:hide")
    },"hashTypes":{'class': "STRING"},"hashContexts":{'class': depth0},"types":[],"contexts":[],"data":data})));
    data.buffer.push(">\n    <div class=\"timeline-card\">\n      <h4>");
    stack1 = helpers._triageMustache.call(depth0, "model.title", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
    if (stack1 != null) { data.buffer.push(stack1); }
    data.buffer.push("</h4>\n      ");
    stack1 = ((helpers['format-markdown'] || (depth0 && depth0['format-markdown']) || helperMissing).call(depth0, "model.description", {"name":"format-markdown","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data}));
    if (stack1 != null) { data.buffer.push(stack1); }
    data.buffer.push("\n      <span class=\"date\">");
    stack1 = helpers._triageMustache.call(depth0, "model.formattedDate", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
    if (stack1 != null) { data.buffer.push(stack1); }
    data.buffer.push("</span>\n    </div>\n  </div>\n</div>\n");
    return buffer;
  },"useData":true})

});
define('front-end/templates/about/edit', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = '';
    data.buffer.push(escapeExpression(((helpers.partial || (depth0 && depth0.partial) || helperMissing).call(depth0, "about/form", {"name":"partial","hash":{},"hashTypes":{},"hashContexts":{},"types":["STRING"],"contexts":[depth0],"data":data}))));
    data.buffer.push("\n");
    return buffer;
  },"useData":true})

});
define('front-end/templates/about/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.Handlebars.template({"1":function(depth0,helpers,partials,data) {
    data.buffer.push("here.");
    },"3":function(depth0,helpers,partials,data) {
    var stack1, buffer = '';
    stack1 = helpers.each.call(depth0, "timeline", "in", "model", {"name":"each","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(4, data),"inverse":this.noop,"types":["ID","ID","ID"],"contexts":[depth0,depth0,depth0],"data":data});
    if (stack1 != null) { data.buffer.push(stack1); }
    return buffer;
  },"4":function(depth0,helpers,partials,data) {
    var stack1, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = '';
    data.buffer.push("      <div class=\"timeline-card\">\n        <h4>");
    stack1 = helpers._triageMustache.call(depth0, "timeline.title", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
    if (stack1 != null) { data.buffer.push(stack1); }
    data.buffer.push("</h4>\n        <p>");
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "timeline.description", {"name":"_triageMustache","hash":{
      'unescaped': ("true")
    },"hashTypes":{'unescaped': "STRING"},"hashContexts":{'unescaped': depth0},"types":["ID"],"contexts":[depth0],"data":data})));
    data.buffer.push("</p>\n        <span class=\"date\">");
    stack1 = helpers._triageMustache.call(depth0, "timeline.formattedDate", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
    if (stack1 != null) { data.buffer.push(stack1); }
    data.buffer.push("</span>\n        ");
    data.buffer.push(escapeExpression(((helpers['link-to'] || (depth0 && depth0['link-to']) || helperMissing).call(depth0, "Edit", "about.edit", "timeline", {"name":"link-to","hash":{},"hashTypes":{},"hashContexts":{},"types":["STRING","STRING","ID"],"contexts":[depth0,depth0,depth0],"data":data}))));
    data.buffer.push("\n        Published: ");
    stack1 = helpers._triageMustache.call(depth0, "timeline.isPublished", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
    if (stack1 != null) { data.buffer.push(stack1); }
    data.buffer.push("\n      </div>\n");
    return buffer;
  },"6":function(depth0,helpers,partials,data) {
    var stack1, buffer = '';
    stack1 = helpers.each.call(depth0, "timeline", "in", "model", {"name":"each","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(7, data),"inverse":this.noop,"types":["ID","ID","ID"],"contexts":[depth0,depth0,depth0],"data":data});
    if (stack1 != null) { data.buffer.push(stack1); }
    return buffer;
  },"7":function(depth0,helpers,partials,data) {
    var stack1, buffer = '';
    stack1 = helpers['if'].call(depth0, "timeline.isPublished", {"name":"if","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(8, data),"inverse":this.noop,"types":["ID"],"contexts":[depth0],"data":data});
    if (stack1 != null) { data.buffer.push(stack1); }
    return buffer;
  },"8":function(depth0,helpers,partials,data) {
    var stack1, escapeExpression=this.escapeExpression, buffer = '';
    data.buffer.push("        <div class=\"timeline-card\">\n          <h4>");
    stack1 = helpers._triageMustache.call(depth0, "timeline.title", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
    if (stack1 != null) { data.buffer.push(stack1); }
    data.buffer.push("</h4>\n          <p>");
    data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "timeline.description", {"name":"_triageMustache","hash":{
      'unescaped': ("true")
    },"hashTypes":{'unescaped': "STRING"},"hashContexts":{'unescaped': depth0},"types":["ID"],"contexts":[depth0],"data":data})));
    data.buffer.push("</p>\n          <span class=\"date\">");
    stack1 = helpers._triageMustache.call(depth0, "timeline.formattedDate", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
    if (stack1 != null) { data.buffer.push(stack1); }
    data.buffer.push("</span>\n        </div>\n");
    return buffer;
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = '';
    data.buffer.push(escapeExpression(((helpers['head-title'] || (depth0 && depth0['head-title']) || helperMissing).call(depth0, "About", {"name":"head-title","hash":{},"hashTypes":{},"hashContexts":{},"types":["STRING"],"contexts":[depth0],"data":data}))));
    data.buffer.push("\n<div class=\"contentPage\">\n  <h1>About Robert DeLuca</h1>\n  <div class=\"about-page\">\n    <div class=\"two-sixth\">\n      <img src=\"https://s3.amazonaws.com/robert-blog-assets/IMG_0852.jpg\" alt=\"Robert and his girlfriend Kaylie\">\n    </div>\n    <div class=\"four-sixth\">\n      <p>Robert DeLuca is a young but highly motivated Front End Developer. He loves to write in languages like CSS (Scss), JavaScript, and Ruby. Lately he has been totally infatuated with Ember.js and started building things <a href=\"http://github.com/robdel12/blog\">like this blog</a> in it.</p>\n      <p>Robert has a passion for building things that gives users the best user experience as possible. His mom is totally blind so that drives him to create sites that work for those who have disability. He takes it personally when his mom can't use a site because of accessibility issues.</p>\n      <p>He's a friendly guy so you can reach out to him on <a href=\"http://twitter.com/robdel12\">Twitter</a>, <a href=\"http://github.com/robdel12\">GitHub</a>, or by contacting him ");
    stack1 = ((helpers['link-to'] || (depth0 && depth0['link-to']) || helperMissing).call(depth0, "contact", {"name":"link-to","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(1, data),"inverse":this.noop,"types":["STRING"],"contexts":[depth0],"data":data}));
    if (stack1 != null) { data.buffer.push(stack1); }
    data.buffer.push("</p>\n    </div>\n  </div>\n</div>\n<div class=\"timelinewrap\">\n  <h2>Personal Timeline</h2>\n");
    stack1 = helpers['if'].call(depth0, "session.isAuthenticated", {"name":"if","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(3, data),"inverse":this.program(6, data),"types":["ID"],"contexts":[depth0],"data":data});
    if (stack1 != null) { data.buffer.push(stack1); }
    data.buffer.push("</div>\n");
    return buffer;
  },"useData":true})

});
define('front-end/templates/about/new', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = '';
    data.buffer.push(escapeExpression(((helpers.partial || (depth0 && depth0.partial) || helperMissing).call(depth0, "about/form", {"name":"partial","hash":{},"hashTypes":{},"hashContexts":{},"types":["STRING"],"contexts":[depth0],"data":data}))));
    data.buffer.push("\n");
    return buffer;
  },"useData":true})

});
define('front-end/templates/analytics', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = '';
    data.buffer.push("<form ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "updateData", {"name":"action","hash":{
      'on': ("submit")
    },"hashTypes":{'on': "STRING"},"hashContexts":{'on': depth0},"types":["STRING"],"contexts":[depth0],"data":data})));
    data.buffer.push(">\n  From: ");
    data.buffer.push(escapeExpression(((helpers['date-picker'] || (depth0 && depth0['date-picker']) || helperMissing).call(depth0, {"name":"date-picker","hash":{
      'placeholder': ("Start Date"),
      'maxDate': ("maxDate"),
      'valueFormat': ("YYYY-MM-DD"),
      'format': ("MMMM Do YYYY"),
      'date': ("graphStartDate")
    },"hashTypes":{'placeholder': "STRING",'maxDate': "ID",'valueFormat': "STRING",'format': "STRING",'date': "ID"},"hashContexts":{'placeholder': depth0,'maxDate': depth0,'valueFormat': depth0,'format': depth0,'date': depth0},"types":[],"contexts":[],"data":data}))));
    data.buffer.push("\n  To: ");
    data.buffer.push(escapeExpression(((helpers['date-picker'] || (depth0 && depth0['date-picker']) || helperMissing).call(depth0, {"name":"date-picker","hash":{
      'placeholder': ("End Date"),
      'maxDate': ("maxDate"),
      'valueFormat': ("YYYY-MM-DD"),
      'format': ("MMMM Do YYYY"),
      'date': ("graphEndDate")
    },"hashTypes":{'placeholder': "STRING",'maxDate': "ID",'valueFormat': "STRING",'format': "STRING",'date': "ID"},"hashContexts":{'placeholder': depth0,'maxDate': depth0,'valueFormat': depth0,'format': depth0,'date': depth0},"types":[],"contexts":[],"data":data}))));
    data.buffer.push("\n  <button type=\"submit\" class=\"btn\">Save</button>\n</form>\n\n<div ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {"name":"bind-attr","hash":{
      'class': (":chart-container loadingData:loading:loaded")
    },"hashTypes":{'class': "STRING"},"hashContexts":{'class': depth0},"types":[],"contexts":[],"data":data})));
    data.buffer.push(">\n  ");
    data.buffer.push(escapeExpression(((helpers['c3-chart'] || (depth0 && depth0['c3-chart']) || helperMissing).call(depth0, {"name":"c3-chart","hash":{
      'bar': ("bar"),
      'axis': ("axis"),
      'data': ("controllerData")
    },"hashTypes":{'bar': "ID",'axis': "ID",'data': "ID"},"hashContexts":{'bar': depth0,'axis': depth0,'data': depth0},"types":[],"contexts":[],"data":data}))));
    data.buffer.push("\n\n  <div ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {"name":"bind-attr","hash":{
      'class': (":loading-spinner loadingData:show:hide")
    },"hashTypes":{'class': "STRING"},"hashContexts":{'class': depth0},"types":[],"contexts":[],"data":data})));
    data.buffer.push(">\n    <div class=\"double-bounce1\"></div>\n    <div class=\"double-bounce2\"></div>\n  </div>\n</div>\n\n");
    return buffer;
  },"useData":true})

});
define('front-end/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = '';
    data.buffer.push("    <nav class=\"admin-bar\">\n      <ul>\n        <li>");
    stack1 = ((helpers['link-to'] || (depth0 && depth0['link-to']) || helperMissing).call(depth0, "dashboard", {"name":"link-to","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(2, data),"inverse":this.noop,"types":["STRING"],"contexts":[depth0],"data":data}));
    if (stack1 != null) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n        <li>");
    stack1 = ((helpers['link-to'] || (depth0 && depth0['link-to']) || helperMissing).call(depth0, "posts.new", {"name":"link-to","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(4, data),"inverse":this.noop,"types":["STRING"],"contexts":[depth0],"data":data}));
    if (stack1 != null) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n        <li>");
    stack1 = ((helpers['link-to'] || (depth0 && depth0['link-to']) || helperMissing).call(depth0, "about.new", {"name":"link-to","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(6, data),"inverse":this.noop,"types":["STRING"],"contexts":[depth0],"data":data}));
    if (stack1 != null) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n        <li>");
    stack1 = ((helpers['link-to'] || (depth0 && depth0['link-to']) || helperMissing).call(depth0, "analytics", {"name":"link-to","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(8, data),"inverse":this.noop,"types":["STRING"],"contexts":[depth0],"data":data}));
    if (stack1 != null) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n        <li><a ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "invalidateSession", {"name":"action","hash":{},"hashTypes":{},"hashContexts":{},"types":["STRING"],"contexts":[depth0],"data":data})));
    data.buffer.push(" href=\"#\">Logout</a></li>\n      </ul>\n    </nav>\n");
    return buffer;
  },"2":function(depth0,helpers,partials,data) {
    data.buffer.push("Dashboard");
    },"4":function(depth0,helpers,partials,data) {
    data.buffer.push("New post");
    },"6":function(depth0,helpers,partials,data) {
    data.buffer.push("New about");
    },"8":function(depth0,helpers,partials,data) {
    data.buffer.push("Analytics");
    },"10":function(depth0,helpers,partials,data) {
    data.buffer.push("Blog");
    },"12":function(depth0,helpers,partials,data) {
    data.buffer.push("About");
    },"14":function(depth0,helpers,partials,data) {
    data.buffer.push("Portfolio");
    },"16":function(depth0,helpers,partials,data) {
    data.buffer.push("Contact");
    },"18":function(depth0,helpers,partials,data) {
    data.buffer.push("    <section class=\"hero\">\n      <header>\n        <h1>Hi, I'm Robert.</h1>\n        <p>And I create online awesome.</p>\n      </header>\n    </section>\n");
    },"20":function(depth0,helpers,partials,data) {
    var helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = '';
    data.buffer.push("      ");
    data.buffer.push(escapeExpression(((helpers['flash-message'] || (depth0 && depth0['flash-message']) || helperMissing).call(depth0, {"name":"flash-message","hash":{
      'flash': ("flash")
    },"hashTypes":{'flash': "ID"},"hashContexts":{'flash': depth0},"types":[],"contexts":[],"data":data}))));
    data.buffer.push("\n");
    return buffer;
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helperMissing=helpers.helperMissing, buffer = '';
    data.buffer.push("<div class=\"main-container\">\n");
    stack1 = helpers['if'].call(depth0, "session.isAuthenticated", {"name":"if","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(1, data),"inverse":this.noop,"types":["ID"],"contexts":[depth0],"data":data});
    if (stack1 != null) { data.buffer.push(stack1); }
    data.buffer.push("  <nav>\n    <ul>\n      <li>");
    stack1 = ((helpers['link-to'] || (depth0 && depth0['link-to']) || helperMissing).call(depth0, "posts", {"name":"link-to","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(10, data),"inverse":this.noop,"types":["STRING"],"contexts":[depth0],"data":data}));
    if (stack1 != null) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n      <li>");
    stack1 = ((helpers['link-to'] || (depth0 && depth0['link-to']) || helperMissing).call(depth0, "about", {"name":"link-to","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(12, data),"inverse":this.noop,"types":["STRING"],"contexts":[depth0],"data":data}));
    if (stack1 != null) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n      <li>");
    stack1 = ((helpers['link-to'] || (depth0 && depth0['link-to']) || helperMissing).call(depth0, "portfolio", {"name":"link-to","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(14, data),"inverse":this.noop,"types":["STRING"],"contexts":[depth0],"data":data}));
    if (stack1 != null) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n      <li>");
    stack1 = ((helpers['link-to'] || (depth0 && depth0['link-to']) || helperMissing).call(depth0, "contact", {"name":"link-to","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(16, data),"inverse":this.noop,"types":["STRING"],"contexts":[depth0],"data":data}));
    if (stack1 != null) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n    </ul>\n  </nav>\n");
    stack1 = helpers.unless.call(depth0, "session.isAuthenticated", {"name":"unless","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(18, data),"inverse":this.noop,"types":["ID"],"contexts":[depth0],"data":data});
    if (stack1 != null) { data.buffer.push(stack1); }
    data.buffer.push("  <div class=\"inner-container\">\n");
    stack1 = helpers.each.call(depth0, "flash", "in", "flashes.content", {"name":"each","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(20, data),"inverse":this.noop,"types":["ID","ID","ID"],"contexts":[depth0,depth0,depth0],"data":data});
    if (stack1 != null) { data.buffer.push(stack1); }
    data.buffer.push("    ");
    stack1 = helpers._triageMustache.call(depth0, "outlet", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
    if (stack1 != null) { data.buffer.push(stack1); }
    data.buffer.push("\n  </div>\n  <footer>\n    <div class=\"footer-content\">\n      <p>&copy; ");
    stack1 = helpers._triageMustache.call(depth0, "format-copyrightdate", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
    if (stack1 != null) { data.buffer.push(stack1); }
    data.buffer.push(" - <a href=\"https://github.com/Robdel12\">Check out my Github</a></p>\n    </div>\n  </footer>\n</div>\n");
    return buffer;
  },"useData":true})

});
define('front-end/templates/components/c-disqus', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    data.buffer.push("<div id=\"disqus_thread\"></div>\n");
    },"useData":true})

});
define('front-end/templates/components/flash-message', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, buffer = '';
    stack1 = helpers._triageMustache.call(depth0, "flash.message", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
    if (stack1 != null) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
  },"useData":true})

});
define('front-end/templates/components/page-numbers', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var escapeExpression=this.escapeExpression, buffer = '';
    data.buffer.push("      <li class=\"arrow prev enabled-arrow\">\n        <a ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "incrementPage", -1, {"name":"action","hash":{},"hashTypes":{},"hashContexts":{},"types":["STRING","NUMBER"],"contexts":[depth0,depth0],"data":data})));
    data.buffer.push(">&laquo;</a>\n      </li>\n");
    return buffer;
  },"3":function(depth0,helpers,partials,data) {
    var escapeExpression=this.escapeExpression, buffer = '';
    data.buffer.push("      <li class=\"arrow prev disabled\">\n        <a ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "incrementPage", -1, {"name":"action","hash":{},"hashTypes":{},"hashContexts":{},"types":["STRING","NUMBER"],"contexts":[depth0,depth0],"data":data})));
    data.buffer.push(">&laquo;</a>\n      </li>\n");
    return buffer;
  },"5":function(depth0,helpers,partials,data) {
    var stack1, buffer = '';
    stack1 = helpers['if'].call(depth0, "item.current", {"name":"if","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(6, data),"inverse":this.program(8, data),"types":["ID"],"contexts":[depth0],"data":data});
    if (stack1 != null) { data.buffer.push(stack1); }
    return buffer;
  },"6":function(depth0,helpers,partials,data) {
    var stack1, buffer = '';
    data.buffer.push("        <li class=\"active page-number\">\n          <a>");
    stack1 = helpers._triageMustache.call(depth0, "item.page", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
    if (stack1 != null) { data.buffer.push(stack1); }
    data.buffer.push("</a>\n        </li>\n");
    return buffer;
  },"8":function(depth0,helpers,partials,data) {
    var stack1, escapeExpression=this.escapeExpression, buffer = '';
    data.buffer.push("        <li class=\"page-number\">\n          <a ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "pageClicked", "item.page", {"name":"action","hash":{},"hashTypes":{},"hashContexts":{},"types":["STRING","ID"],"contexts":[depth0,depth0],"data":data})));
    data.buffer.push(">");
    stack1 = helpers._triageMustache.call(depth0, "item.page", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
    if (stack1 != null) { data.buffer.push(stack1); }
    data.buffer.push("</a>\n        </li>\n");
    return buffer;
  },"10":function(depth0,helpers,partials,data) {
    var escapeExpression=this.escapeExpression, buffer = '';
    data.buffer.push("      <li class=\"arrow next enabled-arrow\">\n        <a ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "incrementPage", 1, {"name":"action","hash":{},"hashTypes":{},"hashContexts":{},"types":["STRING","NUMBER"],"contexts":[depth0,depth0],"data":data})));
    data.buffer.push(">&raquo;</a>\n      </li>\n");
    return buffer;
  },"12":function(depth0,helpers,partials,data) {
    var escapeExpression=this.escapeExpression, buffer = '';
    data.buffer.push("      <li class=\"arrow next disabled\">\n        <a ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "incrementPage", 1, {"name":"action","hash":{},"hashTypes":{},"hashContexts":{},"types":["STRING","NUMBER"],"contexts":[depth0,depth0],"data":data})));
    data.buffer.push(">&raquo;</a>\n      </li>\n");
    return buffer;
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, buffer = '';
    data.buffer.push("<div class=\"pagination-centered\">\n  <ul class=\"pagination\">\n");
    stack1 = helpers['if'].call(depth0, "canStepBackward", {"name":"if","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(1, data),"inverse":this.program(3, data),"types":["ID"],"contexts":[depth0],"data":data});
    if (stack1 != null) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    stack1 = helpers.each.call(depth0, "item", "in", "pageItems", {"name":"each","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(5, data),"inverse":this.noop,"types":["ID","ID","ID"],"contexts":[depth0,depth0,depth0],"data":data});
    if (stack1 != null) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    stack1 = helpers['if'].call(depth0, "canStepForward", {"name":"if","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(10, data),"inverse":this.program(12, data),"types":["ID"],"contexts":[depth0],"data":data});
    if (stack1 != null) { data.buffer.push(stack1); }
    data.buffer.push("  </ul>\n</div>\n");
    return buffer;
  },"useData":true})

});
define('front-end/templates/contact', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = '';
    data.buffer.push("<h1>Contact</h1>\n<form accept-charset=\"UTF-8\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "submitContact", {"name":"action","hash":{
      'on': ("submit")
    },"hashTypes":{'on': "STRING"},"hashContexts":{'on': depth0},"types":["STRING"],"contexts":[depth0],"data":data})));
    data.buffer.push(" method=\"POST\" class=\"form\">\n  <input type=\"hidden\" name=\"utf8\" value=\"✓\">\n\n  <label for=\"name\">Name:*</label>\n  ");
    data.buffer.push(escapeExpression(((helpers.input || (depth0 && depth0.input) || helperMissing).call(depth0, {"name":"input","hash":{
      'required': ("true"),
      'id': ("name"),
      'placeholder': ("Name"),
      'value': ("contact.name"),
      'type': ("text")
    },"hashTypes":{'required': "STRING",'id': "STRING",'placeholder': "STRING",'value': "ID",'type': "STRING"},"hashContexts":{'required': depth0,'id': depth0,'placeholder': depth0,'value': depth0,'type': depth0},"types":[],"contexts":[],"data":data}))));
    data.buffer.push("\n\n  <label for=\"email\">Email:*</label>\n  ");
    data.buffer.push(escapeExpression(((helpers.input || (depth0 && depth0.input) || helperMissing).call(depth0, {"name":"input","hash":{
      'required': ("true"),
      'id': ("email"),
      'placeholder': ("Email address"),
      'value': ("contact.email"),
      'type': ("email")
    },"hashTypes":{'required': "STRING",'id': "STRING",'placeholder': "STRING",'value': "ID",'type': "STRING"},"hashContexts":{'required': depth0,'id': depth0,'placeholder': depth0,'value': depth0,'type': depth0},"types":[],"contexts":[],"data":data}))));
    data.buffer.push("\n\n  <label for=\"reason_for_contact\">Reason for contact:*</label>\n  ");
    data.buffer.push(escapeExpression(((helpers.input || (depth0 && depth0.input) || helperMissing).call(depth0, {"name":"input","hash":{
      'required': ("true"),
      'id': ("reason_for_contact"),
      'placeholder': ("Reason for contact"),
      'value': ("contact.reason"),
      'type': ("text")
    },"hashTypes":{'required': "STRING",'id': "STRING",'placeholder': "STRING",'value': "ID",'type': "STRING"},"hashContexts":{'required': depth0,'id': depth0,'placeholder': depth0,'value': depth0,'type': depth0},"types":[],"contexts":[],"data":data}))));
    data.buffer.push("\n\n  <label for=\"comments\">Comments:</label>\n  <p>");
    data.buffer.push(escapeExpression(((helpers.textarea || (depth0 && depth0.textarea) || helperMissing).call(depth0, {"name":"textarea","hash":{
      'class': ("post-text-area"),
      'value': ("contact.comments")
    },"hashTypes":{'class': "STRING",'value': "ID"},"hashContexts":{'class': depth0,'value': depth0},"types":[],"contexts":[],"data":data}))));
    data.buffer.push("</p>\n\n  ");
    data.buffer.push(escapeExpression(((helpers.input || (depth0 && depth0.input) || helperMissing).call(depth0, {"name":"input","hash":{
      'class': ("honey-pot"),
      'placeholder': ("Anything else?"),
      'value': ("contact.honeypot"),
      'type': ("text")
    },"hashTypes":{'class': "STRING",'placeholder': "STRING",'value': "ID",'type': "STRING"},"hashContexts":{'class': depth0,'placeholder': depth0,'value': depth0,'type': depth0},"types":[],"contexts":[],"data":data}))));
    data.buffer.push("\n\n  <p><button type=\"submit\" class=\"btn\">Send me an email!</button></p>\n</form>\n\n<div ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {"name":"bind-attr","hash":{
      'class': ("thankYou modalClosed")
    },"hashTypes":{'class': "STRING"},"hashContexts":{'class': depth0},"types":[],"contexts":[],"data":data})));
    data.buffer.push(">\n  <h1>Thank you!</h1>\n  <p>Your email has been sent. I should be in contact shortly :)</p>\n  <a href=\"#\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "closeModal", {"name":"action","hash":{},"hashTypes":{},"hashContexts":{},"types":["STRING"],"contexts":[depth0],"data":data})));
    data.buffer.push(" class=\"btn modal-btn\">Got it!</a>\n</div>\n");
    return buffer;
  },"useData":true})

});
define('front-end/templates/dashboard', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1, buffer = '';
    stack1 = helpers['if'].call(depth0, "post.isPublished", {"name":"if","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(2, data),"inverse":this.program(4, data),"types":["ID"],"contexts":[depth0],"data":data});
    if (stack1 != null) { data.buffer.push(stack1); }
    return buffer;
  },"2":function(depth0,helpers,partials,data) {
    return "";
  },"4":function(depth0,helpers,partials,data) {
    var stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = '';
    data.buffer.push("        <div class=\"dashboard-posts-list\">\n          <h3 class=\"posts-title\">");
    data.buffer.push(escapeExpression(((helpers['link-to'] || (depth0 && depth0['link-to']) || helperMissing).call(depth0, "post.title", "posts.edit", "post", {"name":"link-to","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID","STRING","ID"],"contexts":[depth0,depth0,depth0],"data":data}))));
    data.buffer.push("</h3>\n          <span class=\"dashboatd-date\">");
    stack1 = helpers._triageMustache.call(depth0, "post.formattedDate", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
    if (stack1 != null) { data.buffer.push(stack1); }
    data.buffer.push("</span>\n        </div>\n");
    return buffer;
  },"6":function(depth0,helpers,partials,data) {
    var stack1, buffer = '';
    stack1 = helpers['if'].call(depth0, "post.isPublished", {"name":"if","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(4, data),"inverse":this.noop,"types":["ID"],"contexts":[depth0],"data":data});
    if (stack1 != null) { data.buffer.push(stack1); }
    return buffer;
  },"8":function(depth0,helpers,partials,data) {
    var stack1, buffer = '';
    data.buffer.push("      <div class=\"recent-contact\">\n        <p><strong>Name:</strong> ");
    stack1 = helpers._triageMustache.call(depth0, "contact.name", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
    if (stack1 != null) { data.buffer.push(stack1); }
    data.buffer.push("</p>\n        <p><strong>Reason:</strong> ");
    stack1 = helpers._triageMustache.call(depth0, "contact.reason", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
    if (stack1 != null) { data.buffer.push(stack1); }
    data.buffer.push("</p>\n      </div>\n");
    return buffer;
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, buffer = '';
    data.buffer.push("<div class=\"dashboard-container\">\n  <div class=\"dashboard-main\">\n    <h2>Drafts</h2>\n");
    stack1 = helpers.each.call(depth0, "post", "in", "model", {"name":"each","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(1, data),"inverse":this.noop,"types":["ID","ID","ID"],"contexts":[depth0,depth0,depth0],"data":data});
    if (stack1 != null) { data.buffer.push(stack1); }
    data.buffer.push("\n    <h2>Published</h2>\n");
    stack1 = helpers.each.call(depth0, "post", "in", "model", {"name":"each","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(6, data),"inverse":this.noop,"types":["ID","ID","ID"],"contexts":[depth0,depth0,depth0],"data":data});
    if (stack1 != null) { data.buffer.push(stack1); }
    data.buffer.push("  </div>\n  <div class=\"dashboard-sidebar\">\n    <h4>Recent Contacts</h4>\n");
    stack1 = helpers.each.call(depth0, "contact", "in", "contacts", {"name":"each","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(8, data),"inverse":this.noop,"types":["ID","ID","ID"],"contexts":[depth0,depth0,depth0],"data":data});
    if (stack1 != null) { data.buffer.push(stack1); }
    data.buffer.push("  </div>\n</div>\n");
    return buffer;
  },"useData":true})

});
define('front-end/templates/error404', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    data.buffer.push("<h1 style=\"text-align: center;\">404</h1>\n<p style=\"text-align: center;\">Whoops.. Nothing here.</p>\n");
    },"useData":true})

});
define('front-end/templates/login', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = '';
    data.buffer.push("<h1>Login</h1>\n<form ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "authenticate", {"name":"action","hash":{
      'on': ("submit")
    },"hashTypes":{'on': "STRING"},"hashContexts":{'on': depth0},"types":["STRING"],"contexts":[depth0],"data":data})));
    data.buffer.push(">\n  <p>");
    data.buffer.push(escapeExpression(((helpers.input || (depth0 && depth0.input) || helperMissing).call(depth0, {"name":"input","hash":{
      'value': ("identification"),
      'placeholder': ("Email"),
      'id': ("identification")
    },"hashTypes":{'value': "ID",'placeholder': "STRING",'id': "STRING"},"hashContexts":{'value': depth0,'placeholder': depth0,'id': depth0},"types":[],"contexts":[],"data":data}))));
    data.buffer.push("</p>\n  <p>");
    data.buffer.push(escapeExpression(((helpers.input || (depth0 && depth0.input) || helperMissing).call(depth0, {"name":"input","hash":{
      'value': ("password"),
      'type': ("password"),
      'placeholder': ("Password"),
      'id': ("password")
    },"hashTypes":{'value': "ID",'type': "STRING",'placeholder': "STRING",'id': "STRING"},"hashContexts":{'value': depth0,'type': depth0,'placeholder': depth0,'id': depth0},"types":[],"contexts":[],"data":data}))));
    data.buffer.push("</p>\n  <button type=\"submit\" class=\"btn\">Login</button>\n</form>\n");
    return buffer;
  },"useData":true})

});
define('front-end/templates/portfolio', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = '';
    data.buffer.push(escapeExpression(((helpers['head-title'] || (depth0 && depth0['head-title']) || helperMissing).call(depth0, "Portfolio", {"name":"head-title","hash":{},"hashTypes":{},"hashContexts":{},"types":["STRING"],"contexts":[depth0],"data":data}))));
    data.buffer.push("\n<h1>Portfolio</h1>\n<div class=\"portfolio-gird\">\n  <div class=\"one-third port-grid\">\n    <div class=\"imgcontain\">\n      <img src=\"https://s3.amazonaws.com/robert-blog-assets/portfolio/izea.jpg\" alt=\"IZEA website project\" />\n      <div class=\"hoverdiv\">\n        <p>Ruby On Rails App</p>\n      </div><!-- End Hover Div -->\n    </div><!-- End img Contain -->\n    <h2><a href=\"http://izea.com\">IZEA.com</a></h2>\n  </div><!-- End One Third -->\n  <div class=\"one-third port-grid\">\n    <div class=\"imgcontain\">\n      <img src=\"https://s3.amazonaws.com/robert-blog-assets/portfolio/aspg.jpg\" alt=\"Advanced Software Products Groups webstite\" />\n      <div class=\"hoverdiv\">\n        <p>Wordpress</p>\n      </div><!-- End Hover Div -->\n    </div><!-- End img Contain -->\n    <h2><a href=\"http://aspg.com\">ASPG</a></h2>\n  </div><!-- End One Third -->\n  <div class=\"one-third port-grid last\">\n    <div class=\"imgcontain\">\n      <img src=\"https://s3.amazonaws.com/robert-blog-assets/portfolio/goldberg.jpg\" alt=\"Goldberg Laws website\" />\n      <div class=\"hoverdiv\">\n        <p>Wordpress</p>\n      </div><!-- End Hover Div -->\n    </div><!-- End img Contain -->\n    <h2><a href=\"http://www.goldberg-law.com/\">Goldberg Law</a></h2>\n  </div><!-- End One Third -->\n</div>\n<div class=\"portfolio-gird\">\n  <div class=\"one-third port-grid\">\n    <div class=\"imgcontain\">\n      <img src=\"https://s3.amazonaws.com/robert-blog-assets/portfolio/srma.jpg\" alt=\"South West Florida Regional Manufactures Associations website\" />\n      <div class=\"hoverdiv\">\n        <p>Wordpress</p>\n      </div><!-- End Hover Div -->\n    </div><!-- End img Contain -->\n    <h2><a href=\"http://srma.net\">SRMA</a></h2>\n  </div><!-- End One Third -->\n  <div class=\"one-third port-grid\">\n    <div class=\"imgcontain\">\n      <img src=\"https://s3.amazonaws.com/robert-blog-assets/portfolio/summit.jpg\" alt=\"Summit Churches website\" />\n      <div class=\"hoverdiv\">\n        <p>Wordpress</p>\n      </div><!-- End Hover Div -->\n    </div><!-- End img Contain -->\n    <h2><a href=\"http://summitlife.com\">Summit Church</a></h2>\n  </div><!-- End One Third -->\n  <div class=\"one-third port-grid last\">\n    <div class=\"imgcontain\">\n      <img src=\"https://s3.amazonaws.com/robert-blog-assets/portfolio/physiofit.jpg\" alt=\"Physio Fit Coachings website\" />\n      <div class=\"hoverdiv\">\n        <p>Wordpress</p>\n      </div><!-- End Hover Div -->\n    </div><!-- End img Contain -->\n    <h2><a href=\"http://physiofitcoaching.com\">PhysioFit</a></h2>\n  </div><!-- End One Third -->\n</div>\n<div class=\"portfolio-gird\">\n  <div class=\"one-third port-grid\">\n    <div class=\"imgcontain\">\n      <img src=\"https://s3.amazonaws.com/robert-blog-assets/portfolio/moh.jpg\" alt=\"Mission Of Hope Haitis website\" />\n      <div class=\"hoverdiv\">\n        <p>Ruby On Rails App</p>\n      </div><!-- End Hover Div -->\n    </div><!-- End img Contain -->\n    <h2><a href=\"http://mohhaiti.org\">Mission Of Hope Haiti</a></h2>\n  </div><!-- End One Third -->\n  <div class=\"one-third port-grid\">\n    <div class=\"imgcontain\">\n      <img src=\"https://s3.amazonaws.com/robert-blog-assets/portfolio/threetwelve.jpg\" alt=\"ThreeTwelve Creatives website\" />\n      <div class=\"hoverdiv\">\n        <p>Hubspot</p>\n      </div><!-- End Hover Div -->\n    </div><!-- End img Contain -->\n    <h2><a href=\"http://threetwelvecreative.com\">ThreeTwelve Creative</a></h2>\n  </div><!-- End One Third -->\n  <div class=\"one-third port-grid last\">\n    <div class=\"imgcontain\">\n      <img src=\"https://s3.amazonaws.com/robert-blog-assets/portfolio/cocad.jpg\" alt=\"COCAD Haitis website\" />\n      <div class=\"hoverdiv\">\n        <p>Wordpress</p>\n      </div><!-- End Hover Div -->\n    </div><!-- End img Contain -->\n    <h2><a href=\"http://cocad-haiti.org\">COCAD Haiti</a></h2>\n  </div><!-- End One Third -->\n</div>\n<div class=\"portfolio-gird\">\n  <div class=\"one-third port-grid\">\n    <div class=\"imgcontain\">\n      <img src=\"https://s3.amazonaws.com/robert-blog-assets/portfolio/reflective.jpg\" alt=\"Reflective Traffic Systems website\" />\n      <div class=\"hoverdiv\">\n        <p>Wordpress</p>\n      </div><!-- End Hover Div -->\n    </div><!-- End img Contain -->\n    <h2><a href=\"http://reflectivetrafficsystems.com\">Reflective Traffic Systems</a></h2>\n  </div><!-- End One Third -->\n  <div class=\"one-third port-grid last\">\n    <div class=\"imgcontain\">\n      <img src=\"https://s3.amazonaws.com/robert-blog-assets/portfolio/risingstar.jpg\" alt=\"Rising Star apps website\" />\n      <div class=\"hoverdiv\">\n        <p>Wordpress</p>\n      </div><!-- End Hover Div -->\n    </div><!-- End img Contain -->\n    <h2>Rising Star</h2>\n  </div><!-- End One Third -->\n  <div class=\"one-third port-grid\">\n    <div class=\"imgcontain\">\n      <img src=\"https://s3.amazonaws.com/robert-blog-assets/portfolio/pegs-list.jpg\" alt=\"Name of site\" />\n      <div class=\"hoverdiv\">\n        <p>Ruby On Rails App</p>\n      </div><!-- End Hover Div -->\n    </div><!-- End img Contain -->\n    <h2><a href=\"http://www.swflresourcelink.com/\">SWFL Resource Link</a></h2>\n  </div><!-- End One Third -->\n</div>\n<div class=\"portfolio-gird\">\n  <div class=\"one-third port-grid\">\n    <div class=\"imgcontain\">\n      <img src=\"https://s3.amazonaws.com/robert-blog-assets/portfolio/michael-jackson.jpg\" alt=\"Michael Jackson Realtors Website\" />\n      <div class=\"hoverdiv\">\n        <p>Wordpress</p>\n      </div><!-- End Hover Div -->\n    </div><!-- End img Contain -->\n    <h2><a href=\"http://michaeljacksonflhomes.com\">Michael Jackson Realtor</a></h2>\n  </div><!-- End One Third -->\n  <div class=\"one-third port-grid\">\n    <!-- More to come? -->\n  </div><!-- End One Third -->\n  <div class=\"one-third port-grid\">\n\n  </div><!-- End One Third -->\n</div><!-- End Portfolio -->\n");
    return buffer;
  },"useData":true})

});
define('front-end/templates/posts/-form', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = '';
    data.buffer.push(escapeExpression(((helpers['head-title'] || (depth0 && depth0['head-title']) || helperMissing).call(depth0, "model.title", {"name":"head-title","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data}))));
    data.buffer.push("\n<h2>Edit: <span class=\"post-edit-title\">");
    stack1 = helpers._triageMustache.call(depth0, "model.title", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
    if (stack1 != null) { data.buffer.push(stack1); }
    data.buffer.push("</span></h2>\n<div class=\"new-post\">\n  <div class=\"new-post-inner\">\n    <form ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "save", {"name":"action","hash":{
      'on': ("submit")
    },"hashTypes":{'on': "STRING"},"hashContexts":{'on': depth0},"types":["STRING"],"contexts":[depth0],"data":data})));
    data.buffer.push(">\n      <label for=\"post_title\">Title:</label>\n      <p>");
    data.buffer.push(escapeExpression(((helpers.input || (depth0 && depth0.input) || helperMissing).call(depth0, {"name":"input","hash":{
      'id': ("post_title"),
      'placeholder': ("Title"),
      'value': ("model.title")
    },"hashTypes":{'id': "STRING",'placeholder': "STRING",'value': "ID"},"hashContexts":{'id': depth0,'placeholder': depth0,'value': depth0},"types":[],"contexts":[],"data":data}))));
    data.buffer.push("</p>\n\n      <label for=\"excerpt\">Excerpt:</label>\n      <p>");
    data.buffer.push(escapeExpression(((helpers.input || (depth0 && depth0.input) || helperMissing).call(depth0, {"name":"input","hash":{
      'id': ("excerpt"),
      'placeholder': ("Little excerpt"),
      'value': ("model.excerpt")
    },"hashTypes":{'id': "STRING",'placeholder': "STRING",'value': "ID"},"hashContexts":{'id': depth0,'placeholder': depth0,'value': depth0},"types":[],"contexts":[],"data":data}))));
    data.buffer.push("</p>\n\n      <label for=\"post_slug\">Post Slug:</label>\n      <p>");
    data.buffer.push(escapeExpression(((helpers.input || (depth0 && depth0.input) || helperMissing).call(depth0, {"name":"input","hash":{
      'id': ("post_slug"),
      'placeholder': ("Post Slug"),
      'value': ("model.postSlug")
    },"hashTypes":{'id': "STRING",'placeholder': "STRING",'value': "ID"},"hashContexts":{'id': depth0,'placeholder': depth0,'value': depth0},"types":[],"contexts":[],"data":data}))));
    data.buffer.push("</p>\n\n      <p>");
    data.buffer.push(escapeExpression(((helpers.textarea || (depth0 && depth0.textarea) || helperMissing).call(depth0, {"name":"textarea","hash":{
      'class': ("post-text-area"),
      'placeholder': ("Body"),
      'value': ("model.body")
    },"hashTypes":{'class': "STRING",'placeholder': "STRING",'value': "ID"},"hashContexts":{'class': depth0,'placeholder': depth0,'value': depth0},"types":[],"contexts":[],"data":data}))));
    data.buffer.push("</p>\n\n      <label for=\"is_published\">Published:</label>\n      ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "dk-select", {"name":"view","hash":{
      'id': ("is_published"),
      'selectionBinding': ("model.isPublished"),
      'settings': ("settings"),
      'content': ("published")
    },"hashTypes":{'id': "STRING",'selectionBinding': "STRING",'settings': "ID",'content': "ID"},"hashContexts":{'id': depth0,'selectionBinding': depth0,'settings': depth0,'content': depth0},"types":["STRING"],"contexts":[depth0],"data":data})));
    data.buffer.push("\n\n      <ul class=\"edit-posts-list\">\n        <li><a href=\"#\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "togglePreview", {"name":"action","hash":{},"hashTypes":{},"hashContexts":{},"types":["STRING"],"contexts":[depth0],"data":data})));
    data.buffer.push(">Toggle Preview</a></li>\n        <li><a ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "destroy", {"name":"action","hash":{},"hashTypes":{},"hashContexts":{},"types":["STRING"],"contexts":[depth0],"data":data})));
    data.buffer.push(" href=\"#\">Delete</a></li>\n      </ul>\n      <p><button type=\"submit\" class=\"btn\">Edit post</button></p>\n    </form>\n  </div>\n  <div ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {"name":"bind-attr","hash":{
      'class': (":preview preview:show:hide")
    },"hashTypes":{'class': "STRING"},"hashContexts":{'class': depth0},"types":[],"contexts":[],"data":data})));
    data.buffer.push(">\n    <h1>");
    stack1 = helpers._triageMustache.call(depth0, "model.title", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
    if (stack1 != null) { data.buffer.push(stack1); }
    data.buffer.push("</h1>\n\n    ");
    data.buffer.push(escapeExpression(((helpers['format-markdown'] || (depth0 && depth0['format-markdown']) || helperMissing).call(depth0, "model.body", {"name":"format-markdown","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data}))));
    data.buffer.push("\n  </div>\n</div>\n");
    return buffer;
  },"useData":true})

});
define('front-end/templates/posts/edit', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = '';
    data.buffer.push(escapeExpression(((helpers.partial || (depth0 && depth0.partial) || helperMissing).call(depth0, "posts/form", {"name":"partial","hash":{},"hashTypes":{},"hashContexts":{},"types":["STRING"],"contexts":[depth0],"data":data}))));
    data.buffer.push("\n");
    return buffer;
  },"useData":true})

});
define('front-end/templates/posts/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = '';
    data.buffer.push("  <div class=\"posts\">\n    <div class=\"blog-left\">\n      <span class=\"post-date\">\n        <span class=\"inner-date\">");
    stack1 = helpers._triageMustache.call(depth0, "post.formattedDate", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
    if (stack1 != null) { data.buffer.push(stack1); }
    data.buffer.push("</span>\n      </span>\n    </div>\n    <div class=\"blog-right\">\n      <h3 class=\"posts-title\">");
    data.buffer.push(escapeExpression(((helpers['link-to'] || (depth0 && depth0['link-to']) || helperMissing).call(depth0, "post.title", "posts.show", "post.postSlug", {"name":"link-to","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID","STRING","ID"],"contexts":[depth0,depth0,depth0],"data":data}))));
    data.buffer.push("</h3>\n      <span class=\"posts-excerpt\">");
    stack1 = helpers._triageMustache.call(depth0, "post.excerpt", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
    if (stack1 != null) { data.buffer.push(stack1); }
    data.buffer.push(" ");
    stack1 = ((helpers['link-to'] || (depth0 && depth0['link-to']) || helperMissing).call(depth0, "posts.show", "post.postSlug", {"name":"link-to","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(2, data),"inverse":this.noop,"types":["STRING","ID"],"contexts":[depth0,depth0],"data":data}));
    if (stack1 != null) { data.buffer.push(stack1); }
    data.buffer.push("</span>\n    </div>\n  </div>\n");
    return buffer;
  },"2":function(depth0,helpers,partials,data) {
    data.buffer.push(" [Read More] ");
    },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = '';
    data.buffer.push(escapeExpression(((helpers['head-title'] || (depth0 && depth0['head-title']) || helperMissing).call(depth0, "Blog", {"name":"head-title","hash":{},"hashTypes":{},"hashContexts":{},"types":["STRING"],"contexts":[depth0],"data":data}))));
    data.buffer.push("\n");
    stack1 = helpers.each.call(depth0, "post", "in", "model", {"name":"each","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(1, data),"inverse":this.noop,"types":["ID","ID","ID"],"contexts":[depth0,depth0,depth0],"data":data});
    if (stack1 != null) { data.buffer.push(stack1); }
    data.buffer.push(escapeExpression(((helpers['page-numbers'] || (depth0 && depth0['page-numbers']) || helperMissing).call(depth0, {"name":"page-numbers","hash":{
      'content': ("content")
    },"hashTypes":{'content': "ID"},"hashContexts":{'content': depth0},"types":[],"contexts":[],"data":data}))));
    data.buffer.push("\n");
    return buffer;
  },"useData":true})

});
define('front-end/templates/posts/new', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = '';
    data.buffer.push(escapeExpression(((helpers.partial || (depth0 && depth0.partial) || helperMissing).call(depth0, "posts/form", {"name":"partial","hash":{},"hashTypes":{},"hashContexts":{},"types":["STRING"],"contexts":[depth0],"data":data}))));
    data.buffer.push("\n");
    return buffer;
  },"useData":true})

});
define('front-end/templates/posts/show', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = '';
    data.buffer.push(escapeExpression(((helpers['head-title'] || (depth0 && depth0['head-title']) || helperMissing).call(depth0, "title", {"name":"head-title","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data}))));
    data.buffer.push("\n<div class=\"post\">\n  <h1 class=\"post-title\">");
    stack1 = helpers._triageMustache.call(depth0, "title", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
    if (stack1 != null) { data.buffer.push(stack1); }
    data.buffer.push("</h1>\n  <div class=\"title-sub-heading\">Posted: ");
    stack1 = helpers._triageMustache.call(depth0, "fullFormattedDate", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
    if (stack1 != null) { data.buffer.push(stack1); }
    data.buffer.push("</div>\n\n  ");
    data.buffer.push(escapeExpression(((helpers['format-markdown'] || (depth0 && depth0['format-markdown']) || helperMissing).call(depth0, "body", {"name":"format-markdown","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data}))));
    data.buffer.push("\n\n  ");
    stack1 = helpers._triageMustache.call(depth0, "c-disqus", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
    if (stack1 != null) { data.buffer.push(stack1); }
    data.buffer.push("\n</div>\n\n<meta name=\"title\" ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {"name":"bind-attr","hash":{
      'content': ("title")
    },"hashTypes":{'content': "ID"},"hashContexts":{'content': depth0},"types":[],"contexts":[],"data":data})));
    data.buffer.push(" />\n<meta name=\"description\" ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {"name":"bind-attr","hash":{
      'content': ("excerpt")
    },"hashTypes":{'content': "ID"},"hashContexts":{'content': depth0},"types":[],"contexts":[],"data":data})));
    data.buffer.push(" />\n\n<meta property=\"og:title\" ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {"name":"bind-attr","hash":{
      'content': ("title")
    },"hashTypes":{'content': "ID"},"hashContexts":{'content': depth0},"types":[],"contexts":[],"data":data})));
    data.buffer.push(" />\n<meta property=\"og:site_name\" content=\"Robert DeLuca\" />\n<meta property=\"og:description\" ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {"name":"bind-attr","hash":{
      'content': ("excerpt")
    },"hashTypes":{'content': "ID"},"hashContexts":{'content': depth0},"types":[],"contexts":[],"data":data})));
    data.buffer.push(" />\n");
    return buffer;
  },"useData":true})

});
define('front-end/views/dk-select', ['exports', 'ember', 'ember-dropkick/views/dk-select'], function (exports, Ember, DropKick) {

	'use strict';

	exports['default'] = DropKick['default'];

});
/* jshint ignore:start */

define('front-end/config/environment', ['ember'], function(Ember) {
  var prefix = 'front-end';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("front-end/tests/test-helper");
} else {
  require("front-end/app")["default"].create({});
}

/* jshint ignore:end */
