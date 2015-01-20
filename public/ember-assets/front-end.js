define("front-end/adapters/application", 
  ["ember","ember-data","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var DS = __dependency2__["default"];

    var AppAdapter = DS.ActiveModelAdapter.extend({
      namespace: "api"
    });

    var inflector = Ember.Inflector.inflector;
    inflector.uncountable("timeline"); //only makes call to /timeline

    __exports__["default"] = AppAdapter;
  });
define("front-end/app", 
  ["ember","ember/resolver","ember/load-initializers","front-end/config/environment","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var Resolver = __dependency2__["default"];
    var loadInitializers = __dependency3__["default"];
    var config = __dependency4__["default"];

    Ember.MODEL_FACTORY_INJECTIONS = true;

    var App = Ember.Application.extend({
      modulePrefix: config.modulePrefix,
      podModulePrefix: config.podModulePrefix,
      Resolver: Resolver
    });

    loadInitializers(App, config.modulePrefix);

    __exports__["default"] = App;
  });
define("front-end/components/c-disqus", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    var CDisqusComponent = Ember.Component.extend({
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
          this.set("timer", Ember.run.debounce(this, this.loadNewPostComments, 100));
        }
      }).on("willInsertElement"),

      reset: function () {
        var controller = this.get("parentView.controller");
        var postIdentifier = controller.get("urlString");
        var postUrl = window.location.href;

        Ember.run.scheduleOnce("afterRender", function () {
          window.DISQUS.reset({
            reload: true,
            config: function () {
              this.page.identifier = postIdentifier;
              this.page.url = postUrl;
            }
          });
        });
      } });

    __exports__["default"] = CDisqusComponent;
  });
define("front-end/components/date-picker", 
  ["ember","ember-cli-datepicker/components/date-picker","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Em = __dependency1__["default"];
    var Datepicker = __dependency2__["default"];

    __exports__["default"] = Datepicker;
  });
define("front-end/components/flash-message", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Component.extend({
      classNames: ["alert"],
      classNameBindings: ["alertType"],

      alertType: Ember.computed("flash.type", function () {
        return "alert-" + Ember.get(this, "flash.type");
      })
    });
  });
define("front-end/components/page-numbers", 
  ["ember","ember-cli-pagination/util","ember-cli-pagination/lib/page-items","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var Util = __dependency2__["default"];
    var PageItems = __dependency3__["default"];

    __exports__["default"] = Ember.Component.extend({
      currentPageBinding: "content.page",
      totalPagesBinding: "content.totalPages",

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
      numPagesToShowBefore: 5,
      numPagesToShowAfter: 5,

      pageItemsObj: (function () {
        return PageItems.create({
          parent: this,
          currentPageBinding: "parent.currentPage",
          totalPagesBinding: "parent.totalPages",
          truncatePagesBinding: "parent.truncatePages",
          numPagesToShowBeforeBinding: "parent.numPagesToShowBefore",
          numPagesToShowAfterBinding: "parent.numPagesToShowAfter"
        });
      }).property(),

      pageItemsBinding: "pageItemsObj.pageItems",

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
          Util.log("PageNumbers#pageClicked number " + number);
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
define("front-end/controllers/about/edit", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    var EditController = Ember.ObjectController.extend({
      published: [false, true],

      init: function () {
        this.autoSave();
      },

      autoSave: function () {
        this.timer = Ember.run.later(this, function () {
          if (this.get("isDirty")) {
            var alert = Ember.$(".alert");
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
      },

      stopAutoSave: function () {
        Ember.run.cancel(this.timer);
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
        },

        save: function () {
          return this.model.save().then((function (_this) {
            return function () {
              return _this.transitionToRoute("about.index");
            };
          })(this));
        }

      }

    });

    __exports__["default"] = EditController;
  });
define("front-end/controllers/about/index", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.ArrayController.extend({
      sortProperties: ["event_date"],
      sortAscending: false
    });
  });
define("front-end/controllers/about/new", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    var NewTimelineController = Ember.ObjectController.extend({
      published: [false, true],
      selectedState: null,
      openPreview: false,

      init: function () {
        this.set("timeline", Ember.Object.create());
        this._super();
      },

      actions: {

        saveEvent: function () {
          var timelineData = {
            title: this.get("timeline.title"),
            event_date: this.get("timeline.event_date"),
            description: this.get("timeline.description"),
            is_published: this.get("selectedState")
          }, newEvent;

          newEvent = this.store.createRecord("timeline", timelineData);

          newEvent.save()["catch"](function (reason) {
            if (reason.status === 500) {
              this.get("flashes").danger("There was a server error.");
            }
          });

          this.setProperties({
            "timeline.title": "",
            "timeline.date": "",
            "timeline.description": ""
          });

          this.transitionToRoute("about");
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

    __exports__["default"] = NewTimelineController;
  });
define("front-end/controllers/contact", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.ObjectController.extend({
      modalClosed: true,
      thankYou: true,

      init: function () {
        this.set("contact", Ember.Object.create());
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
          Ember.$("body").addClass("modal-backing");
          window.scrollTo(0, 0);
        },

        closeModal: function () {
          this.set("modalClosed", true);
          Ember.$("body").removeClass("modal-backing");
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
define("front-end/controllers/dashboard", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    var DashboardController = Ember.ArrayController.extend({
      sortProperties: ["created_at"],
      sortAscending: false
    });

    __exports__["default"] = DashboardController;
  });
define("front-end/controllers/login", 
  ["ember","simple-auth/mixins/login-controller-mixin","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var LoginControllerMixin = __dependency2__["default"];

    __exports__["default"] = Ember.Controller.extend(LoginControllerMixin, {
      authenticator: "simple-auth-authenticator:devise",
      error: false
    });
  });
define("front-end/controllers/posts/edit", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    var EditController = Ember.ObjectController.extend({
      published: [false, true],

      init: function () {
        this.autoSave();
        this._super();
      },

      autoSave: function () {
        this.timer = Ember.run.later(this, function () {
          if (this.get("isDirty")) {
            var notificationMessage = "Your post \"" + this.get("title") + "\" was auto saved";

            this.model.save()["catch"](function (reason) {
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
      },

      stopAutoSave: function () {
        Ember.run.cancel(this.timer);
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
                Ember.get(_this, "flashes").info("Your post was saved.");
              }
            };
          })(this));
        },

        cancel: function () {
          if (this.model.isDirty) {
            this.model.rollback();
          }
          return this.transitionTo("posts.index");
        },

        togglePreview: function () {
          Ember.$(".preview").toggleClass("hide");
        }

      }

    });

    __exports__["default"] = EditController;
  });
define("front-end/controllers/posts/index", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    var PostsController = Ember.ArrayController.extend({
      queryParams: ["page"],
      pageBinding: "content.page",
      totalPagesBinding: "content.totalPages"
    });

    __exports__["default"] = PostsController;
  });
define("front-end/controllers/posts/new", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    var NewController = Ember.ObjectController.extend({
      published: [false, true],
      selectedState: null,
      settings: {
        mobile: true
      },

      init: function () {
        this.set("post", Ember.Object.create());
      },

      actions: {

        savePost: function () {
          var postData = {
            title: this.get("post.title"),
            excerpt: this.get("post.excerpt"),
            body: this.get("post.body"),
            post_slug: this.get("post.title").replace(/\W/g, "-").replace(/-{1,}/g, "-").replace(/^-|-$/g, "").toLowerCase(),
            is_published: this.get("selectedState")
          }, newPost;

          newPost = this.store.createRecord("post", postData);

          newPost.save()["catch"](function (reason) {
            if (reason.status === 500) {
              Ember.$(".alert").text("There was a server error.");
            }
          });

          this.setProperties({
            "post.title": "",
            "post.excerpt": "",
            "post.body": ""
          });

          if (postData.is_published === true) {
            this.transitionToRoute("posts.show", postData.post_slug);
          } else {
            this.transitionToRoute("posts.edit", postData.post_slug);
          }
        },

        togglePreview: function () {
          Ember.$(".preview").toggleClass("hide");
        }

      }

    });

    __exports__["default"] = NewController;
  });
define("front-end/helpers/format-copyrightdate", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Handlebars.makeBoundHelper(function () {
      return new Date().getFullYear();
    });
  });
define("front-end/helpers/format-markdown", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Handlebars.makeBoundHelper(function (value, options) {
      if (!value || !options) {
        return;
      }
      return window.marked(value);
    });
  });
define("front-end/helpers/head-title", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Handlebars.makeBoundHelper(function (title) {
      Ember.$("head").find("title").text("Robert DeLuca - " + title);
    }, "title");
  });
define("front-end/initializers/export-application-global", 
  ["ember","front-end/config/environment","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var config = __dependency2__["default"];

    function initialize(container, application) {
      var classifiedName = Ember.String.classify(config.modulePrefix);

      if (config.exportApplicationGlobal) {
        window[classifiedName] = application;
      }
    };
    __exports__.initialize = initialize;
    __exports__["default"] = {
      name: "export-application-global",

      initialize: initialize
    };
  });
define("front-end/initializers/flashes", 
  ["front-end/services/flash-service","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var flashMessagesService = __dependency1__["default"];

    __exports__["default"] = {
      name: "flash-messages",
      initialize: function (container, application) {
        application.register("service:flash-messages", flashMessagesService, { singleton: true });
        application.inject("controller", "flashes", "service:flash-messages");
      }
    };
  });
define("front-end/initializers/simple-auth-devise", 
  ["simple-auth-devise/configuration","simple-auth-devise/authenticators/devise","simple-auth-devise/authorizers/devise","front-end/config/environment","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var Configuration = __dependency1__["default"];
    var Authenticator = __dependency2__["default"];
    var Authorizer = __dependency3__["default"];
    var ENV = __dependency4__["default"];

    __exports__["default"] = {
      name: "simple-auth-devise",
      before: "simple-auth",
      initialize: function (container, application) {
        Configuration.load(container, ENV["simple-auth-devise"] || {});
        container.register("simple-auth-authorizer:devise", Authorizer);
        container.register("simple-auth-authenticator:devise", Authenticator);
      }
    };
  });
define("front-end/initializers/simple-auth", 
  ["simple-auth/configuration","simple-auth/setup","front-end/config/environment","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var Configuration = __dependency1__["default"];
    var setup = __dependency2__["default"];
    var ENV = __dependency3__["default"];

    __exports__["default"] = {
      name: "simple-auth",
      initialize: function (container, application) {
        Configuration.load(container, ENV["simple-auth"] || {});
        setup(container, application);
      }
    };
  });
define("front-end/models/contact", 
  ["ember-data","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var DS = __dependency1__["default"];

    __exports__["default"] = DS.Model.extend({
      name: DS.attr("string"),
      email: DS.attr("string"),
      reason: DS.attr("string"),
      comments: DS.attr("string"),
      honeypot: DS.attr("string") });
  });
define("front-end/models/flash", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Object.extend({
      isSuccess: Ember.computed.equal("type", "success"),
      isInfo: Ember.computed.equal("type", "info"),
      isWarning: Ember.computed.equal("type", "warning"),
      isDanger: Ember.computed.equal("type", "danger"),

      init: function () {
        Ember.run.later(this, function () {
          this.destroy();
        }, Ember.get(this, "timeout"));
      }
    });
  });
define("front-end/models/post", 
  ["ember-data","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var DS = __dependency1__["default"];

    __exports__["default"] = DS.Model.extend({
      post_slug: DS.attr("string"),
      title: DS.attr("string"),
      created_at: DS.attr("date"),
      excerpt: DS.attr("string"),
      body: DS.attr("string"),
      is_published: DS.attr("boolean"),
      formatted_date: (function () {
        return moment(this.get("created_at")).format("MMM Do");
      }).property("created_at")
    });
  });
define("front-end/models/timeline", 
  ["ember-data","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var DS = __dependency1__["default"];

    __exports__["default"] = DS.Model.extend({
      title: DS.attr("string"),
      description: DS.attr("string"),
      event_date: DS.attr("string"),
      created_at: DS.attr("date"),
      is_published: DS.attr("boolean"),
      formattedDate: (function () {
        return moment(this.get("event_date")).format("MMMM Do, YYYY");
      }).property("event_date")
    });
  });
define("front-end/router", 
  ["ember","front-end/config/environment","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var config = __dependency2__["default"];

    var Router = Ember.Router.extend({
      location: config.locationType
    });

    Router.map(function () {
      this.route("portfolio");
      this.route("login");
      this.route("dashboard");
      this.route("contact");

      this.resource("posts", function () {
        this.route("show", { path: "/:post_slug" });
        this.route("edit", { path: "/:post_id/edit" });
        this.route("new");
      });

      this.resource("about", function () {
        this.route("new");
        this.route("edit", { path: "/:timeline_id/edit" });
      });
      this.route("error404", { path: "/*path" }); //404s son
    });

    if (config.environment === "production") {
      Router.reopen({
        notifyGoogleAnalytics: (function () {
          return window.ga("send", "pageview", {
            page: this.get("url"),
            title: this.get("url")
          });
        }).on("didTransition")
      });
    }

    __exports__["default"] = Router;
  });
define("front-end/routes/about/edit", 
  ["ember","simple-auth/mixins/authenticated-route-mixin","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var AuthenticatedRouteMixin = __dependency2__["default"];

    __exports__["default"] = Ember.Route.extend(AuthenticatedRouteMixin);
  });
define("front-end/routes/about/index", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      model: function () {
        return this.store.find("timeline");
      }
    });
  });
define("front-end/routes/about/new", 
  ["ember","simple-auth/mixins/authenticated-route-mixin","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var AuthenticatedRouteMixin = __dependency2__["default"];

    __exports__["default"] = Ember.Route.extend(AuthenticatedRouteMixin);
  });
define("front-end/routes/application", 
  ["ember","simple-auth/mixins/application-route-mixin","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var ApplicationRouteMixin = __dependency2__["default"];

    __exports__["default"] = Ember.Route.extend(ApplicationRouteMixin);
  });
define("front-end/routes/contact", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({});
  });
define("front-end/routes/create", 
  ["ember","simple-auth/mixins/authenticated-route-mixin","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var AuthenticatedRouteMixin = __dependency2__["default"];

    __exports__["default"] = Ember.Route.extend(AuthenticatedRouteMixin);
  });
define("front-end/routes/dashboard", 
  ["ember","simple-auth/mixins/authenticated-route-mixin","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var AuthenticatedRouteMixin = __dependency2__["default"];

    __exports__["default"] = Ember.Route.extend(AuthenticatedRouteMixin, {
      model: function () {
        return this.store.find("post", { dashboard: true });
      },

      setupController: function (controller) {
        this._super.apply(this, arguments);

        controller.set("contacts", this.store.find("contact"));
      }
    });
  });
define("front-end/routes/index", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    var IndexRoute = Ember.Route.extend({
      redirect: function () {
        this.replaceWith("posts");
      }
    });

    __exports__["default"] = IndexRoute;
  });
define("front-end/routes/posts/edit", 
  ["ember","simple-auth/mixins/authenticated-route-mixin","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var AuthenticatedRouteMixin = __dependency2__["default"];

    var PostsRoute = Ember.Route.extend(AuthenticatedRouteMixin, {

      model: function (params) {
        return this.store.find("post", params.post_id);
      },

      deactivate: function () {
        this.controllerFor(this.routeName).stopAutoSave();
      }

    });

    __exports__["default"] = PostsRoute;
  });
define("front-end/routes/posts/index", 
  ["ember","ember-cli-pagination/remote/route-mixin","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var RouteMixin = __dependency2__["default"];

    __exports__["default"] = Ember.Route.extend(RouteMixin, {

      model: function (params) {
        return this.findPaged("post", params);
      }

    });
  });
define("front-end/routes/posts/new", 
  ["ember","simple-auth/mixins/authenticated-route-mixin","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var AuthenticatedRouteMixin = __dependency2__["default"];

    __exports__["default"] = Ember.Route.extend(AuthenticatedRouteMixin);
  });
define("front-end/routes/posts/show", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    var PostsRoute = Ember.Route.extend({
      model: function (params) {
        return this.store.find("post", params.post_slug).then(function (slug) {
          return slug;
        });
      }
    });

    __exports__["default"] = PostsRoute;
  });
define("front-end/routes/protected", 
  ["ember","simple-auth/mixins/authenticated-route-mixin","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var AuthenticatedRouteMixin = __dependency2__["default"];

    __exports__["default"] = Ember.Route.extend(AuthenticatedRouteMixin);
  });
define("front-end/services/flash-service", 
  ["ember","front-end/models/flash","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var FlashMessage = __dependency2__["default"];

    __exports__["default"] = Ember.Object.extend({
      queue: Ember.A([]),
      content: Ember.computed.alias("queue"),
      isEmpty: Ember.computed.equal("queue.length", 0),
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
        flashes = Ember.get(this, "queue");
        flash = this._newFlashMessage(msg, type);
        flashes.pushObject(flash);
      },

      _newFlashMessage: function (msg, type) {
        var timeout;
        Ember.assert("Must pass a valid flash message", msg);
        type = typeof type === "undefined" ? "info" : type;
        timeout = Ember.get(this, "timeout");

        return FlashMessage.create({
          type: type,
          message: msg,
          timeout: timeout
        });
      },

      _queueDidChange: Ember.observer("queue.@each.isDestroyed", function () {
        var flashes, destroyed, timeout;
        flashes = Ember.get(this, "queue");
        timeout = Ember.get(this, "timeout");

        Ember.run.later(this, function () {
          destroyed = flashes.filterBy("isDestroyed", true);
          return flashes.removeObjects(destroyed);
        }, timeout);
      })
    });
  });
define("front-end/templates/about/edit", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
      var stack1, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = '';
      data.buffer.push("<h2>Edit ");
      stack1 = helpers._triageMustache.call(depth0, "title", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("</h2>\n<div class=\"timeline\">\n  <div class=\"new-about-inner\">\n    <form ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "save", {"name":"action","hash":{
        'on': ("submit")
      },"hashTypes":{'on': "STRING"},"hashContexts":{'on': depth0},"types":["STRING"],"contexts":[depth0],"data":data})));
      data.buffer.push(">\n      <p>");
      data.buffer.push(escapeExpression(((helpers.input || (depth0 && depth0.input) || helperMissing).call(depth0, {"name":"input","hash":{
        'placeholder': ("Title"),
        'value': ("title")
      },"hashTypes":{'placeholder': "STRING",'value': "ID"},"hashContexts":{'placeholder': depth0,'value': depth0},"types":[],"contexts":[],"data":data}))));
      data.buffer.push("</p>\n      <p>");
      data.buffer.push(escapeExpression(((helpers['date-picker'] || (depth0 && depth0['date-picker']) || helperMissing).call(depth0, {"name":"date-picker","hash":{
        'valueFormat': ("YYYY-MM-DD"),
        'format': ("MMMM Do YYYY"),
        'date': ("event_date")
      },"hashTypes":{'valueFormat': "STRING",'format': "STRING",'date': "ID"},"hashContexts":{'valueFormat': depth0,'format': depth0,'date': depth0},"types":[],"contexts":[],"data":data}))));
      data.buffer.push("</p>\n      <p>");
      data.buffer.push(escapeExpression(((helpers.textarea || (depth0 && depth0.textarea) || helperMissing).call(depth0, {"name":"textarea","hash":{
        'class': ("timeline-text-area"),
        'placeholder': ("Body"),
        'value': ("description")
      },"hashTypes":{'class': "STRING",'placeholder': "STRING",'value': "ID"},"hashContexts":{'class': depth0,'placeholder': depth0,'value': depth0},"types":[],"contexts":[],"data":data}))));
      data.buffer.push("</p>\n      <label for=\"is_published\">Published:</label>\n      ");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Select", {"name":"view","hash":{
        'value': ("is_published"),
        'id': ("is_published"),
        'selectionBinding': ("selectedState"),
        'content': ("published")
      },"hashTypes":{'value': "ID",'id': "STRING",'selectionBinding': "STRING",'content': "ID"},"hashContexts":{'value': depth0,'id': depth0,'selectionBinding': depth0,'content': depth0},"types":["ID"],"contexts":[depth0],"data":data})));
      data.buffer.push("\n      <ul class=\"edit-posts-list\">\n        <li><a href=\"#\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "destroy", {"name":"action","hash":{},"hashTypes":{},"hashContexts":{},"types":["STRING"],"contexts":[depth0],"data":data})));
      data.buffer.push(">Delete</a></li>\n      </ul>\n      <button type=\"submit\" class=\"btn\">Save</button>\n    </form>\n  </div>\n  <div ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {"name":"bind-attr","hash":{
        'class': (":timeline-preview :preview")
      },"hashTypes":{'class': "STRING"},"hashContexts":{'class': depth0},"types":[],"contexts":[],"data":data})));
      data.buffer.push(">\n    <div class=\"timeline-card\">\n      <h4>");
      stack1 = helpers._triageMustache.call(depth0, "title", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("</h4>\n      ");
      stack1 = ((helpers['format-markdown'] || (depth0 && depth0['format-markdown']) || helperMissing).call(depth0, "description", {"name":"format-markdown","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data}));
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("\n      <span class=\"date\">");
      stack1 = helpers._triageMustache.call(depth0, "formattedDate", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("</span>\n    </div>\n  </div>\n</div>\n");
      return buffer;
    },"useData":true})
  });
define("front-end/templates/about/index", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Handlebars.template({"1":function(depth0,helpers,partials,data) {
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
      stack1 = helpers._triageMustache.call(depth0, "timeline.is_published", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
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
      stack1 = helpers['if'].call(depth0, "timeline.is_published", {"name":"if","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(8, data),"inverse":this.noop,"types":["ID"],"contexts":[depth0],"data":data});
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
define("front-end/templates/about/new", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
      var stack1, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = '';
      data.buffer.push("<h2>New Timeline Event</h2>\n<form ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "saveEvent", {"name":"action","hash":{
        'on': ("submit")
      },"hashTypes":{'on': "STRING"},"hashContexts":{'on': depth0},"types":["STRING"],"contexts":[depth0],"data":data})));
      data.buffer.push(" class=\"form\">\n  <p>");
      data.buffer.push(escapeExpression(((helpers.input || (depth0 && depth0.input) || helperMissing).call(depth0, {"name":"input","hash":{
        'placeholder': ("Title"),
        'value': ("timeline.title")
      },"hashTypes":{'placeholder': "STRING",'value': "ID"},"hashContexts":{'placeholder': depth0,'value': depth0},"types":[],"contexts":[],"data":data}))));
      data.buffer.push("</p>\n  <p>");
      data.buffer.push(escapeExpression(((helpers['date-picker'] || (depth0 && depth0['date-picker']) || helperMissing).call(depth0, {"name":"date-picker","hash":{
        'valueFormat': ("YYYY-MM-DD"),
        'format': ("MMMM Do YYYY"),
        'date': ("timeline.event_date")
      },"hashTypes":{'valueFormat': "STRING",'format': "STRING",'date': "ID"},"hashContexts":{'valueFormat': depth0,'format': depth0,'date': depth0},"types":[],"contexts":[],"data":data}))));
      data.buffer.push("</p>\n  <p>");
      data.buffer.push(escapeExpression(((helpers.textarea || (depth0 && depth0.textarea) || helperMissing).call(depth0, {"name":"textarea","hash":{
        'class': ("timeline-text-area"),
        'placeholder': ("Body"),
        'value': ("timeline.description")
      },"hashTypes":{'class': "STRING",'placeholder': "STRING",'value': "ID"},"hashContexts":{'class': depth0,'placeholder': depth0,'value': depth0},"types":[],"contexts":[],"data":data}))));
      data.buffer.push("</p>\n  <p><a href=\"#\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "togglePreview", {"name":"action","hash":{},"hashTypes":{},"hashContexts":{},"types":["STRING"],"contexts":[depth0],"data":data})));
      data.buffer.push(">Toggle Preview</a></p>\n  <label for=\"is_published\">Published:</label>\n  ");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Select", {"name":"view","hash":{
        'id': ("is_published"),
        'selectionBinding': ("selectedState"),
        'content': ("published")
      },"hashTypes":{'id': "STRING",'selectionBinding': "STRING",'content': "ID"},"hashContexts":{'id': depth0,'selectionBinding': depth0,'content': depth0},"types":["ID"],"contexts":[depth0],"data":data})));
      data.buffer.push("\n  <p><button type=\"submit\" class=\"btn\">Save</button></p>\n</form>\n<div ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {"name":"bind-attr","hash":{
        'class': (":timeline-preview openPreview:show:hide")
      },"hashTypes":{'class': "STRING"},"hashContexts":{'class': depth0},"types":[],"contexts":[],"data":data})));
      data.buffer.push(">\n  <h1>");
      stack1 = helpers._triageMustache.call(depth0, "timeline.title", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("</h1>\n\n  ");
      stack1 = ((helpers['format-markdown'] || (depth0 && depth0['format-markdown']) || helperMissing).call(depth0, "timeline.description", {"name":"format-markdown","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data}));
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("\n</div>\n");
      return buffer;
    },"useData":true})
  });
define("front-end/templates/application", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Handlebars.template({"1":function(depth0,helpers,partials,data) {
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
      data.buffer.push("Blog");
      },"10":function(depth0,helpers,partials,data) {
      data.buffer.push("About");
      },"12":function(depth0,helpers,partials,data) {
      data.buffer.push("Portfolio");
      },"14":function(depth0,helpers,partials,data) {
      data.buffer.push("Contact");
      },"16":function(depth0,helpers,partials,data) {
      data.buffer.push("    <section class=\"hero\">\n      <header>\n        <h1>Hi, I'm Robert.</h1>\n        <p>And I create online awesome.</p>\n      </header>\n    </section>\n");
      },"18":function(depth0,helpers,partials,data) {
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
      stack1 = ((helpers['link-to'] || (depth0 && depth0['link-to']) || helperMissing).call(depth0, "posts", {"name":"link-to","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(8, data),"inverse":this.noop,"types":["STRING"],"contexts":[depth0],"data":data}));
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n      <li>");
      stack1 = ((helpers['link-to'] || (depth0 && depth0['link-to']) || helperMissing).call(depth0, "about", {"name":"link-to","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(10, data),"inverse":this.noop,"types":["STRING"],"contexts":[depth0],"data":data}));
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n      <li>");
      stack1 = ((helpers['link-to'] || (depth0 && depth0['link-to']) || helperMissing).call(depth0, "portfolio", {"name":"link-to","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(12, data),"inverse":this.noop,"types":["STRING"],"contexts":[depth0],"data":data}));
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n      <li>");
      stack1 = ((helpers['link-to'] || (depth0 && depth0['link-to']) || helperMissing).call(depth0, "contact", {"name":"link-to","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(14, data),"inverse":this.noop,"types":["STRING"],"contexts":[depth0],"data":data}));
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n    </ul>\n  </nav>\n");
      stack1 = helpers.unless.call(depth0, "session.isAuthenticated", {"name":"unless","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(16, data),"inverse":this.noop,"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("  <div class=\"inner-container\">\n");
      stack1 = helpers.each.call(depth0, "flash", "in", "flashes.content", {"name":"each","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(18, data),"inverse":this.noop,"types":["ID","ID","ID"],"contexts":[depth0,depth0,depth0],"data":data});
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
define("front-end/templates/components/c-disqus", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
      data.buffer.push("<div id=\"disqus_thread\"></div>\n");
      },"useData":true})
  });
define("front-end/templates/components/flash-message", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
      var stack1, buffer = '';
      stack1 = helpers._triageMustache.call(depth0, "flash.message", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
    },"useData":true})
  });
define("front-end/templates/components/page-numbers", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Handlebars.template({"1":function(depth0,helpers,partials,data) {
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
define("front-end/templates/contact", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
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
define("front-end/templates/dashboard", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Handlebars.template({"1":function(depth0,helpers,partials,data) {
      var stack1, buffer = '';
      stack1 = helpers['if'].call(depth0, "post.is_published", {"name":"if","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(2, data),"inverse":this.program(4, data),"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      return buffer;
    },"2":function(depth0,helpers,partials,data) {
      return "";
    },"4":function(depth0,helpers,partials,data) {
      var helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = '';
      data.buffer.push("        <div class=\"dashboard-posts-list\">\n          <h3 class=\"posts-title\">");
      data.buffer.push(escapeExpression(((helpers['link-to'] || (depth0 && depth0['link-to']) || helperMissing).call(depth0, "post.title", "posts.edit", "post", {"name":"link-to","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID","STRING","ID"],"contexts":[depth0,depth0,depth0],"data":data}))));
      data.buffer.push("</h3>\n        </div>\n");
      return buffer;
    },"6":function(depth0,helpers,partials,data) {
      var stack1, buffer = '';
      stack1 = helpers['if'].call(depth0, "post.is_published", {"name":"if","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(4, data),"inverse":this.noop,"types":["ID"],"contexts":[depth0],"data":data});
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
define("front-end/templates/error404", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
      data.buffer.push("<h1 style=\"text-align: center;\">404</h1>\n<p style=\"text-align: center;\">Whoops.. Nothing here.</p>\n");
      },"useData":true})
  });
define("front-end/templates/login", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
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
define("front-end/templates/portfolio", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
      var helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = '';
      data.buffer.push(escapeExpression(((helpers['head-title'] || (depth0 && depth0['head-title']) || helperMissing).call(depth0, "Portfolio", {"name":"head-title","hash":{},"hashTypes":{},"hashContexts":{},"types":["STRING"],"contexts":[depth0],"data":data}))));
      data.buffer.push("\n<h1>Portfolio</h1>\n<div class=\"portfolio-gird\">\n  <div class=\"one-third port-grid\">\n    <div class=\"imgcontain\">\n      <img src=\"https://s3.amazonaws.com/robert-blog-assets/portfolio/izea.jpg\" alt=\"IZEA website project\" />\n      <div class=\"hoverdiv\">\n        <p>Ruby On Rails App</p>\n      </div><!-- End Hover Div -->\n    </div><!-- End img Contain -->\n    <h2><a href=\"http://izea.com\">IZEA.com</a></h2>\n  </div><!-- End One Third -->\n  <div class=\"one-third port-grid\">\n    <div class=\"imgcontain\">\n      <img src=\"https://s3.amazonaws.com/robert-blog-assets/portfolio/aspg.jpg\" alt=\"Advanced Software Products Groups webstite\" />\n      <div class=\"hoverdiv\">\n        <p>Wordpress</p>\n      </div><!-- End Hover Div -->\n    </div><!-- End img Contain -->\n    <h2><a href=\"http://aspg.com\">ASPG</a></h2>\n  </div><!-- End One Third -->\n  <div class=\"one-third port-grid last\">\n    <div class=\"imgcontain\">\n      <img src=\"https://s3.amazonaws.com/robert-blog-assets/portfolio/goldberg.jpg\" alt=\"Goldberg Laws website\" />\n      <div class=\"hoverdiv\">\n        <p>Wordpress</p>\n      </div><!-- End Hover Div -->\n    </div><!-- End img Contain -->\n    <h2><a href=\"http://www.goldberg-law.com/\">Goldberg Law</a></h2>\n  </div><!-- End One Third -->\n</div>\n<div class=\"portfolio-gird\">\n  <div class=\"one-third port-grid\">\n    <div class=\"imgcontain\">\n      <img src=\"https://s3.amazonaws.com/robert-blog-assets/portfolio/srma.jpg\" alt=\"South West Florida Regional Manufactures Associations website\" />\n      <div class=\"hoverdiv\">\n        <p>Wordpress</p>\n      </div><!-- End Hover Div -->\n    </div><!-- End img Contain -->\n    <h2><a href=\"http://srma.net\">SRMA</a></h2>\n  </div><!-- End One Third -->\n  <div class=\"one-third port-grid\">\n    <div class=\"imgcontain\">\n      <img src=\"https://s3.amazonaws.com/robert-blog-assets/portfolio/summit.jpg\" alt=\"Summit Churches website\" />\n      <div class=\"hoverdiv\">\n        <p>Wordpress</p>\n      </div><!-- End Hover Div -->\n    </div><!-- End img Contain -->\n    <h2><a href=\"http://summitlife.com\">Summit Church</a></h2>\n  </div><!-- End One Third -->\n  <div class=\"one-third port-grid last\">\n    <div class=\"imgcontain\">\n      <img src=\"https://s3.amazonaws.com/robert-blog-assets/portfolio/physiofit.jpg\" alt=\"Physio Fit Coachings website\" />\n      <div class=\"hoverdiv\">\n        <p>Wordpress</p>\n      </div><!-- End Hover Div -->\n    </div><!-- End img Contain -->\n    <h2><a href=\"http://physiofitcoaching.com\">PhysioFit</a></h2>\n  </div><!-- End One Third -->\n</div>\n<div class=\"portfolio-gird\">\n  <div class=\"one-third port-grid\">\n    <div class=\"imgcontain\">\n      <img src=\"https://s3.amazonaws.com/robert-blog-assets/portfolio/moh.jpg\" alt=\"Mission Of Hope Haitis website\" />\n      <div class=\"hoverdiv\">\n        <p>Ruby On Rails App</p>\n      </div><!-- End Hover Div -->\n    </div><!-- End img Contain -->\n    <h2><a href=\"http://mohhaiti.org\">Mission Of Hope Haiti</a></h2>\n  </div><!-- End One Third -->\n  <div class=\"one-third port-grid\">\n    <div class=\"imgcontain\">\n      <img src=\"https://s3.amazonaws.com/robert-blog-assets/portfolio/threetwelve.jpg\" alt=\"ThreeTwelve Creatives website\" />\n      <div class=\"hoverdiv\">\n        <p>Hubspot</p>\n      </div><!-- End Hover Div -->\n    </div><!-- End img Contain -->\n    <h2><a href=\"http://threetwelvecreative.com\">ThreeTwelve Creative</a></h2>\n  </div><!-- End One Third -->\n  <div class=\"one-third port-grid last\">\n    <div class=\"imgcontain\">\n      <img src=\"https://s3.amazonaws.com/robert-blog-assets/portfolio/cocad.jpg\" alt=\"COCAD Haitis website\" />\n      <div class=\"hoverdiv\">\n        <p>Wordpress</p>\n      </div><!-- End Hover Div -->\n    </div><!-- End img Contain -->\n    <h2><a href=\"http://cocad-haiti.org\">COCAD Haiti</a></h2>\n  </div><!-- End One Third -->\n</div>\n<div class=\"portfolio-gird\">\n  <div class=\"one-third port-grid\">\n    <div class=\"imgcontain\">\n      <img src=\"https://s3.amazonaws.com/robert-blog-assets/portfolio/reflective.jpg\" alt=\"Reflective Traffic Systems website\" />\n      <div class=\"hoverdiv\">\n        <p>Wordpress</p>\n      </div><!-- End Hover Div -->\n    </div><!-- End img Contain -->\n    <h2><a href=\"http://reflectivetrafficsystems.com\">Reflective Traffic Systems</a></h2>\n  </div><!-- End One Third -->\n  <div class=\"one-third port-grid last\">\n    <div class=\"imgcontain\">\n      <img src=\"https://s3.amazonaws.com/robert-blog-assets/portfolio/risingstar.jpg\" alt=\"Rising Star apps website\" />\n      <div class=\"hoverdiv\">\n        <p>Wordpress</p>\n      </div><!-- End Hover Div -->\n    </div><!-- End img Contain -->\n    <h2>Rising Star</h2>\n  </div><!-- End One Third -->\n  <div class=\"one-third port-grid\">\n    <div class=\"imgcontain\">\n      <img src=\"https://s3.amazonaws.com/robert-blog-assets/portfolio/pegs-list.jpg\" alt=\"Name of site\" />\n      <div class=\"hoverdiv\">\n        <p>Ruby On Rails App</p>\n      </div><!-- End Hover Div -->\n    </div><!-- End img Contain -->\n    <h2><a href=\"http://www.swflresourcelink.com/\">SWFL Resource Link</a></h2>\n  </div><!-- End One Third -->\n</div>\n<div class=\"portfolio-gird\">\n  <div class=\"one-third port-grid\">\n    <div class=\"imgcontain\">\n      <img src=\"https://s3.amazonaws.com/robert-blog-assets/portfolio/michael-jackson.jpg\" alt=\"Michael Jackson Realtors Website\" />\n      <div class=\"hoverdiv\">\n        <p>Wordpress</p>\n      </div><!-- End Hover Div -->\n    </div><!-- End img Contain -->\n    <h2><a href=\"http://michaeljacksonflhomes.com\">Michael Jackson Realtor</a></h2>\n  </div><!-- End One Third -->\n  <div class=\"one-third port-grid\">\n    <!-- More to come? -->\n  </div><!-- End One Third -->\n  <div class=\"one-third port-grid\">\n\n  </div><!-- End One Third -->\n</div><!-- End Portfolio -->\n");
      return buffer;
    },"useData":true})
  });
define("front-end/templates/posts/edit", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
      var stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = '';
      data.buffer.push(escapeExpression(((helpers['head-title'] || (depth0 && depth0['head-title']) || helperMissing).call(depth0, "title", {"name":"head-title","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data}))));
      data.buffer.push("\n<div class=\"alert hide\"></div>\n<h2>Edit: <span class=\"post-edit-title\">");
      stack1 = helpers._triageMustache.call(depth0, "title", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("</span></h2>\n<div class=\"new-post\">\n  <div class=\"new-post-inner\">\n    <form ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "save", {"name":"action","hash":{
        'on': ("submit")
      },"hashTypes":{'on': "STRING"},"hashContexts":{'on': depth0},"types":["STRING"],"contexts":[depth0],"data":data})));
      data.buffer.push(">\n      <label for=\"post_title\">Title:</label>\n      <p>");
      data.buffer.push(escapeExpression(((helpers.input || (depth0 && depth0.input) || helperMissing).call(depth0, {"name":"input","hash":{
        'id': ("post_title"),
        'placeholder': ("Title"),
        'value': ("title")
      },"hashTypes":{'id': "STRING",'placeholder': "STRING",'value': "ID"},"hashContexts":{'id': depth0,'placeholder': depth0,'value': depth0},"types":[],"contexts":[],"data":data}))));
      data.buffer.push("</p>\n      <label for=\"excerpt\">Excerpt:</label>\n      <p>");
      data.buffer.push(escapeExpression(((helpers.input || (depth0 && depth0.input) || helperMissing).call(depth0, {"name":"input","hash":{
        'id': ("excerpt"),
        'placeholder': ("Little excerpt"),
        'value': ("excerpt")
      },"hashTypes":{'id': "STRING",'placeholder': "STRING",'value': "ID"},"hashContexts":{'id': depth0,'placeholder': depth0,'value': depth0},"types":[],"contexts":[],"data":data}))));
      data.buffer.push("</p>\n      <label for=\"post_slug\">Post Slug:</label>\n      <p>");
      data.buffer.push(escapeExpression(((helpers.input || (depth0 && depth0.input) || helperMissing).call(depth0, {"name":"input","hash":{
        'id': ("post_slug"),
        'placeholder': ("Post Slug"),
        'value': ("post_slug")
      },"hashTypes":{'id': "STRING",'placeholder': "STRING",'value': "ID"},"hashContexts":{'id': depth0,'placeholder': depth0,'value': depth0},"types":[],"contexts":[],"data":data}))));
      data.buffer.push("</p>\n      <p>");
      data.buffer.push(escapeExpression(((helpers.textarea || (depth0 && depth0.textarea) || helperMissing).call(depth0, {"name":"textarea","hash":{
        'class': ("post-text-area"),
        'placeholder': ("Body"),
        'value': ("body")
      },"hashTypes":{'class': "STRING",'placeholder': "STRING",'value': "ID"},"hashContexts":{'class': depth0,'placeholder': depth0,'value': depth0},"types":[],"contexts":[],"data":data}))));
      data.buffer.push("</p>\n      <label for=\"is_published\">Published:</label>\n      ");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Select", {"name":"view","hash":{
        'id': ("is_published"),
        'value': ("is_published"),
        'selectionBinding': ("selectedState"),
        'content': ("published")
      },"hashTypes":{'id': "STRING",'value': "ID",'selectionBinding': "STRING",'content': "ID"},"hashContexts":{'id': depth0,'value': depth0,'selectionBinding': depth0,'content': depth0},"types":["ID"],"contexts":[depth0],"data":data})));
      data.buffer.push("\n      <ul class=\"edit-posts-list\">\n        <li><a href=\"#\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "togglePreview", {"name":"action","hash":{},"hashTypes":{},"hashContexts":{},"types":["STRING"],"contexts":[depth0],"data":data})));
      data.buffer.push(">Toggle Preview</a></li>\n        <li><a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "cancel", {"name":"action","hash":{},"hashTypes":{},"hashContexts":{},"types":["STRING"],"contexts":[depth0],"data":data})));
      data.buffer.push(" href=\"#\">Cancel</a></li>\n        <li><a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "destroy", {"name":"action","hash":{},"hashTypes":{},"hashContexts":{},"types":["STRING"],"contexts":[depth0],"data":data})));
      data.buffer.push(" href=\"#\">Delete</a></li>\n      </ul>\n      <p><button type=\"submit\" class=\"btn\">Edit post</button></p>\n    </form>\n  </div>\n  <div class=\"preview hide\">\n    <h1>");
      stack1 = helpers._triageMustache.call(depth0, "title", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("</h1>\n\n    ");
      stack1 = ((helpers['format-markdown'] || (depth0 && depth0['format-markdown']) || helperMissing).call(depth0, "body", {"name":"format-markdown","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data}));
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("\n  </div>\n</div>\n");
      return buffer;
    },"useData":true})
  });
define("front-end/templates/posts/index", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Handlebars.template({"1":function(depth0,helpers,partials,data) {
      var stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = '';
      data.buffer.push("  <div class=\"posts\">\n    <div class=\"blog-left\">\n      <span class=\"post-date\">\n        <span class=\"inner-date\">");
      stack1 = helpers._triageMustache.call(depth0, "formatted_date", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("</span>\n      </span>\n    </div>\n    <div class=\"blog-right\">\n      <h3 class=\"posts-title\">");
      data.buffer.push(escapeExpression(((helpers['link-to'] || (depth0 && depth0['link-to']) || helperMissing).call(depth0, "title", "posts.show", "", {"name":"link-to","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID","STRING","ID"],"contexts":[depth0,depth0,depth0],"data":data}))));
      data.buffer.push("</h3>\n      <span class=\"posts-excerpt\">");
      stack1 = helpers._triageMustache.call(depth0, "excerpt", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push(" ");
      stack1 = ((helpers['link-to'] || (depth0 && depth0['link-to']) || helperMissing).call(depth0, "posts.show", "", {"name":"link-to","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(2, data),"inverse":this.noop,"types":["STRING","ID"],"contexts":[depth0,depth0],"data":data}));
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("</span>\n    </div>\n  </div>\n");
      return buffer;
    },"2":function(depth0,helpers,partials,data) {
      data.buffer.push(" [Read More] ");
      },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
      var stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = '';
      data.buffer.push(escapeExpression(((helpers['head-title'] || (depth0 && depth0['head-title']) || helperMissing).call(depth0, "Blog", {"name":"head-title","hash":{},"hashTypes":{},"hashContexts":{},"types":["STRING"],"contexts":[depth0],"data":data}))));
      data.buffer.push("\n");
      stack1 = helpers.each.call(depth0, {"name":"each","hash":{},"hashTypes":{},"hashContexts":{},"fn":this.program(1, data),"inverse":this.noop,"types":[],"contexts":[],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push(escapeExpression(((helpers['page-numbers'] || (depth0 && depth0['page-numbers']) || helperMissing).call(depth0, {"name":"page-numbers","hash":{
        'content': ("content")
      },"hashTypes":{'content': "ID"},"hashContexts":{'content': depth0},"types":[],"contexts":[],"data":data}))));
      data.buffer.push("\n");
      return buffer;
    },"useData":true})
  });
define("front-end/templates/posts/new", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
      var stack1, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = '';
      data.buffer.push("<div class=\"alert hide\"></div>\n<div class=\"new-post\">\n  <div class=\"new-post-inner\">\n    <h2>New Post</h2>\n    <a href=\"#\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "togglePreview", {"name":"action","hash":{},"hashTypes":{},"hashContexts":{},"types":["STRING"],"contexts":[depth0],"data":data})));
      data.buffer.push(">Toggle Preview</a>\n    <form ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "savePost", {"name":"action","hash":{
        'on': ("submit")
      },"hashTypes":{'on': "STRING"},"hashContexts":{'on': depth0},"types":["STRING"],"contexts":[depth0],"data":data})));
      data.buffer.push(">\n      <p>");
      data.buffer.push(escapeExpression(((helpers.input || (depth0 && depth0.input) || helperMissing).call(depth0, {"name":"input","hash":{
        'placeholder': ("Title"),
        'value': ("post.title")
      },"hashTypes":{'placeholder': "STRING",'value': "ID"},"hashContexts":{'placeholder': depth0,'value': depth0},"types":[],"contexts":[],"data":data}))));
      data.buffer.push("</p>\n      <p>");
      data.buffer.push(escapeExpression(((helpers.input || (depth0 && depth0.input) || helperMissing).call(depth0, {"name":"input","hash":{
        'placeholder': ("Little excerpt"),
        'value': ("post.excerpt")
      },"hashTypes":{'placeholder': "STRING",'value': "ID"},"hashContexts":{'placeholder': depth0,'value': depth0},"types":[],"contexts":[],"data":data}))));
      data.buffer.push("</p>\n      <p>");
      data.buffer.push(escapeExpression(((helpers.textarea || (depth0 && depth0.textarea) || helperMissing).call(depth0, {"name":"textarea","hash":{
        'class': ("post-text-area"),
        'placeholder': ("Body"),
        'value': ("post.body")
      },"hashTypes":{'class': "STRING",'placeholder': "STRING",'value': "ID"},"hashContexts":{'class': depth0,'placeholder': depth0,'value': depth0},"types":[],"contexts":[],"data":data}))));
      data.buffer.push("</p>\n      <label for=\"is_published\">Published:</label>\n      ");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "dk-select", {"name":"view","hash":{
        'id': ("is_published"),
        'selectionBinding': ("selectedState"),
        'settings': ("settings"),
        'content': ("published")
      },"hashTypes":{'id': "STRING",'selectionBinding': "ID",'settings': "ID",'content': "ID"},"hashContexts":{'id': depth0,'selectionBinding': depth0,'settings': depth0,'content': depth0},"types":["STRING"],"contexts":[depth0],"data":data})));
      data.buffer.push("\n      <p><button type=\"submit\" class=\"btn\">Save</button></p>\n    </form>\n  </div>\n  <div class=\"preview hide\">\n    <h1>");
      stack1 = helpers._triageMustache.call(depth0, "post.title", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("</h1>\n\n    ");
      data.buffer.push(escapeExpression(((helpers['format-markdown'] || (depth0 && depth0['format-markdown']) || helperMissing).call(depth0, "post.body", {"name":"format-markdown","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data}))));
      data.buffer.push("\n  </div>\n</div>\n");
      return buffer;
    },"useData":true})
  });
define("front-end/templates/posts/show", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
      var stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = '';
      data.buffer.push(escapeExpression(((helpers['head-title'] || (depth0 && depth0['head-title']) || helperMissing).call(depth0, "title", {"name":"head-title","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data}))));
      data.buffer.push("\n<div class=\"post\">\n  <h1 class=\"post-title\">");
      stack1 = helpers._triageMustache.call(depth0, "title", {"name":"_triageMustache","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data});
      if (stack1 != null) { data.buffer.push(stack1); }
      data.buffer.push("</h1>\n\n  ");
      stack1 = ((helpers['format-markdown'] || (depth0 && depth0['format-markdown']) || helperMissing).call(depth0, "body", {"name":"format-markdown","hash":{},"hashTypes":{},"hashContexts":{},"types":["ID"],"contexts":[depth0],"data":data}));
      if (stack1 != null) { data.buffer.push(stack1); }
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
define("front-end/tests/adapters/application.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - adapters');
    test('adapters/application.js should pass jshint', function() { 
      ok(true, 'adapters/application.js should pass jshint.'); 
    });
  });
define("front-end/tests/app.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - .');
    test('app.js should pass jshint', function() { 
      ok(true, 'app.js should pass jshint.'); 
    });
  });
define("front-end/tests/components/c-disqus.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - components');
    test('components/c-disqus.js should pass jshint', function() { 
      ok(true, 'components/c-disqus.js should pass jshint.'); 
    });
  });
define("front-end/tests/components/flash-message.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - components');
    test('components/flash-message.js should pass jshint', function() { 
      ok(true, 'components/flash-message.js should pass jshint.'); 
    });
  });
define("front-end/tests/controllers/about/edit.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers/about');
    test('controllers/about/edit.js should pass jshint', function() { 
      ok(true, 'controllers/about/edit.js should pass jshint.'); 
    });
  });
define("front-end/tests/controllers/about/index.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers/about');
    test('controllers/about/index.js should pass jshint', function() { 
      ok(true, 'controllers/about/index.js should pass jshint.'); 
    });
  });
define("front-end/tests/controllers/about/new.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers/about');
    test('controllers/about/new.js should pass jshint', function() { 
      ok(true, 'controllers/about/new.js should pass jshint.'); 
    });
  });
define("front-end/tests/controllers/contact.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/contact.js should pass jshint', function() { 
      ok(true, 'controllers/contact.js should pass jshint.'); 
    });
  });
define("front-end/tests/controllers/dashboard.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/dashboard.js should pass jshint', function() { 
      ok(true, 'controllers/dashboard.js should pass jshint.'); 
    });
  });
define("front-end/tests/controllers/login.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/login.js should pass jshint', function() { 
      ok(true, 'controllers/login.js should pass jshint.'); 
    });
  });
define("front-end/tests/controllers/posts/edit.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers/posts');
    test('controllers/posts/edit.js should pass jshint', function() { 
      ok(true, 'controllers/posts/edit.js should pass jshint.'); 
    });
  });
define("front-end/tests/controllers/posts/index.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers/posts');
    test('controllers/posts/index.js should pass jshint', function() { 
      ok(true, 'controllers/posts/index.js should pass jshint.'); 
    });
  });
define("front-end/tests/controllers/posts/new.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers/posts');
    test('controllers/posts/new.js should pass jshint', function() { 
      ok(true, 'controllers/posts/new.js should pass jshint.'); 
    });
  });
define("front-end/tests/front-end/tests/helpers/resolver.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - front-end/tests/helpers');
    test('front-end/tests/helpers/resolver.js should pass jshint', function() { 
      ok(true, 'front-end/tests/helpers/resolver.js should pass jshint.'); 
    });
  });
define("front-end/tests/front-end/tests/helpers/start-app.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - front-end/tests/helpers');
    test('front-end/tests/helpers/start-app.js should pass jshint', function() { 
      ok(true, 'front-end/tests/helpers/start-app.js should pass jshint.'); 
    });
  });
define("front-end/tests/front-end/tests/test-helper.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - front-end/tests');
    test('front-end/tests/test-helper.js should pass jshint', function() { 
      ok(true, 'front-end/tests/test-helper.js should pass jshint.'); 
    });
  });
define("front-end/tests/front-end/tests/unit/controllers/about/index-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - front-end/tests/unit/controllers/about');
    test('front-end/tests/unit/controllers/about/index-test.js should pass jshint', function() { 
      ok(true, 'front-end/tests/unit/controllers/about/index-test.js should pass jshint.'); 
    });
  });
define("front-end/tests/front-end/tests/unit/controllers/contact-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - front-end/tests/unit/controllers');
    test('front-end/tests/unit/controllers/contact-test.js should pass jshint', function() { 
      ok(true, 'front-end/tests/unit/controllers/contact-test.js should pass jshint.'); 
    });
  });
define("front-end/tests/front-end/tests/unit/controllers/dashboard-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - front-end/tests/unit/controllers');
    test('front-end/tests/unit/controllers/dashboard-test.js should pass jshint', function() { 
      ok(true, 'front-end/tests/unit/controllers/dashboard-test.js should pass jshint.'); 
    });
  });
define("front-end/tests/front-end/tests/unit/models/contact-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - front-end/tests/unit/models');
    test('front-end/tests/unit/models/contact-test.js should pass jshint', function() { 
      ok(true, 'front-end/tests/unit/models/contact-test.js should pass jshint.'); 
    });
  });
define("front-end/tests/front-end/tests/unit/models/dashboard-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - front-end/tests/unit/models');
    test('front-end/tests/unit/models/dashboard-test.js should pass jshint', function() { 
      ok(true, 'front-end/tests/unit/models/dashboard-test.js should pass jshint.'); 
    });
  });
define("front-end/tests/front-end/tests/unit/models/posts-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - front-end/tests/unit/models');
    test('front-end/tests/unit/models/posts-test.js should pass jshint', function() { 
      ok(true, 'front-end/tests/unit/models/posts-test.js should pass jshint.'); 
    });
  });
define("front-end/tests/front-end/tests/unit/models/timeline-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - front-end/tests/unit/models');
    test('front-end/tests/unit/models/timeline-test.js should pass jshint', function() { 
      ok(true, 'front-end/tests/unit/models/timeline-test.js should pass jshint.'); 
    });
  });
define("front-end/tests/front-end/tests/unit/routes/about-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - front-end/tests/unit/routes');
    test('front-end/tests/unit/routes/about-test.js should pass jshint', function() { 
      ok(true, 'front-end/tests/unit/routes/about-test.js should pass jshint.'); 
    });
  });
define("front-end/tests/front-end/tests/unit/routes/contact-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - front-end/tests/unit/routes');
    test('front-end/tests/unit/routes/contact-test.js should pass jshint', function() { 
      ok(true, 'front-end/tests/unit/routes/contact-test.js should pass jshint.'); 
    });
  });
define("front-end/tests/front-end/tests/unit/routes/dashboard-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - front-end/tests/unit/routes');
    test('front-end/tests/unit/routes/dashboard-test.js should pass jshint', function() { 
      ok(true, 'front-end/tests/unit/routes/dashboard-test.js should pass jshint.'); 
    });
  });
define("front-end/tests/front-end/tests/unit/services/flash-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - front-end/tests/unit/services');
    test('front-end/tests/unit/services/flash-test.js should pass jshint', function() { 
      ok(true, 'front-end/tests/unit/services/flash-test.js should pass jshint.'); 
    });
  });
define("front-end/tests/helpers/format-copyrightdate.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - helpers');
    test('helpers/format-copyrightdate.js should pass jshint', function() { 
      ok(true, 'helpers/format-copyrightdate.js should pass jshint.'); 
    });
  });
define("front-end/tests/helpers/format-markdown.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - helpers');
    test('helpers/format-markdown.js should pass jshint', function() { 
      ok(true, 'helpers/format-markdown.js should pass jshint.'); 
    });
  });
define("front-end/tests/helpers/head-title.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - helpers');
    test('helpers/head-title.js should pass jshint', function() { 
      ok(true, 'helpers/head-title.js should pass jshint.'); 
    });
  });
define("front-end/tests/helpers/resolver", 
  ["ember/resolver","front-end/config/environment","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Resolver = __dependency1__["default"];
    var config = __dependency2__["default"];

    var resolver = Resolver.create();

    resolver.namespace = {
      modulePrefix: config.modulePrefix,
      podModulePrefix: config.podModulePrefix
    };

    __exports__["default"] = resolver;
  });
define("front-end/tests/helpers/start-app", 
  ["ember","front-end/app","front-end/router","front-end/config/environment","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var Application = __dependency2__["default"];
    var Router = __dependency3__["default"];
    var config = __dependency4__["default"];

    __exports__["default"] = function startApp(attrs) {
      var App;

      var attributes = Ember.merge({}, config.APP);
      attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

      Ember.run(function () {
        App = Application.create(attributes);
        App.setupForTesting();
        App.injectTestHelpers();
      });

      return App;
    }
  });
define("front-end/tests/initializers/flashes.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - initializers');
    test('initializers/flashes.js should pass jshint', function() { 
      ok(true, 'initializers/flashes.js should pass jshint.'); 
    });
  });
define("front-end/tests/models/contact.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - models');
    test('models/contact.js should pass jshint', function() { 
      ok(true, 'models/contact.js should pass jshint.'); 
    });
  });
define("front-end/tests/models/flash.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - models');
    test('models/flash.js should pass jshint', function() { 
      ok(true, 'models/flash.js should pass jshint.'); 
    });
  });
define("front-end/tests/models/post.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - models');
    test('models/post.js should pass jshint', function() { 
      ok(true, 'models/post.js should pass jshint.'); 
    });
  });
define("front-end/tests/models/timeline.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - models');
    test('models/timeline.js should pass jshint', function() { 
      ok(true, 'models/timeline.js should pass jshint.'); 
    });
  });
define("front-end/tests/router.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - .');
    test('router.js should pass jshint', function() { 
      ok(true, 'router.js should pass jshint.'); 
    });
  });
define("front-end/tests/routes/about/edit.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes/about');
    test('routes/about/edit.js should pass jshint', function() { 
      ok(true, 'routes/about/edit.js should pass jshint.'); 
    });
  });
define("front-end/tests/routes/about/index.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes/about');
    test('routes/about/index.js should pass jshint', function() { 
      ok(true, 'routes/about/index.js should pass jshint.'); 
    });
  });
define("front-end/tests/routes/about/new.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes/about');
    test('routes/about/new.js should pass jshint', function() { 
      ok(true, 'routes/about/new.js should pass jshint.'); 
    });
  });
define("front-end/tests/routes/application.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/application.js should pass jshint', function() { 
      ok(true, 'routes/application.js should pass jshint.'); 
    });
  });
define("front-end/tests/routes/contact.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/contact.js should pass jshint', function() { 
      ok(true, 'routes/contact.js should pass jshint.'); 
    });
  });
define("front-end/tests/routes/create.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/create.js should pass jshint', function() { 
      ok(true, 'routes/create.js should pass jshint.'); 
    });
  });
define("front-end/tests/routes/dashboard.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/dashboard.js should pass jshint', function() { 
      ok(true, 'routes/dashboard.js should pass jshint.'); 
    });
  });
define("front-end/tests/routes/index.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/index.js should pass jshint', function() { 
      ok(true, 'routes/index.js should pass jshint.'); 
    });
  });
define("front-end/tests/routes/posts/edit.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes/posts');
    test('routes/posts/edit.js should pass jshint', function() { 
      ok(true, 'routes/posts/edit.js should pass jshint.'); 
    });
  });
define("front-end/tests/routes/posts/index.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes/posts');
    test('routes/posts/index.js should pass jshint', function() { 
      ok(true, 'routes/posts/index.js should pass jshint.'); 
    });
  });
define("front-end/tests/routes/posts/new.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes/posts');
    test('routes/posts/new.js should pass jshint', function() { 
      ok(true, 'routes/posts/new.js should pass jshint.'); 
    });
  });
define("front-end/tests/routes/posts/show.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes/posts');
    test('routes/posts/show.js should pass jshint', function() { 
      ok(true, 'routes/posts/show.js should pass jshint.'); 
    });
  });
define("front-end/tests/routes/protected.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/protected.js should pass jshint', function() { 
      ok(true, 'routes/protected.js should pass jshint.'); 
    });
  });
define("front-end/tests/services/flash-service.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - services');
    test('services/flash-service.js should pass jshint', function() { 
      ok(true, 'services/flash-service.js should pass jshint.'); 
    });
  });
define("front-end/tests/test-helper", 
  ["front-end/tests/helpers/resolver","ember-qunit"],
  function(__dependency1__, __dependency2__) {
    "use strict";
    var resolver = __dependency1__["default"];
    var setResolver = __dependency2__.setResolver;

    setResolver(resolver);

    document.write("<div id=\"ember-testing-container\"><div id=\"ember-testing\"></div></div>");

    QUnit.config.urlConfig.push({ id: "nocontainer", label: "Hide container" });
    var containerVisibility = QUnit.urlParams.nocontainer ? "hidden" : "visible";
    document.getElementById("ember-testing-container").style.visibility = containerVisibility;
  });
define("front-end/tests/unit/controllers/about/index-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:about/index", "AboutIndexController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("front-end/tests/unit/controllers/contact-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:contact", "ContactController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("front-end/tests/unit/controllers/dashboard-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var test = __dependency1__.test;
    var moduleFor = __dependency1__.moduleFor;

    moduleFor("controller:dashboard", "DashboardController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("front-end/tests/unit/models/contact-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForModel = __dependency1__.moduleForModel;
    var test = __dependency1__.test;

    moduleForModel("contact", "Contact", {
      // Specify the other units that are required for this test.
      needs: []
    });

    test("it exists", function () {
      var model = this.subject();
      // var store = this.store();
      ok(!!model);
    });
  });
define("front-end/tests/unit/models/dashboard-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var test = __dependency1__.test;
    var moduleForModel = __dependency1__.moduleForModel;

    moduleForModel("dashboard", "Dashboard", {
      // Specify the other units that are required for this test.
      needs: []
    });

    test("it exists", function () {
      var model = this.subject();
      // var store = this.store();
      ok(model);
    });
  });
define("front-end/tests/unit/models/posts-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var test = __dependency1__.test;
    var moduleForModel = __dependency1__.moduleForModel;

    moduleForModel("posts", "Posts", {
      // Specify the other units that are required for this test.
      needs: []
    });

    test("it exists", function () {
      var model = this.subject();
      // var store = this.store();
      ok(model);
    });
  });
define("front-end/tests/unit/models/timeline-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForModel = __dependency1__.moduleForModel;
    var test = __dependency1__.test;

    moduleForModel("timeline", "Timeline", {
      // Specify the other units that are required for this test.
      needs: []
    });

    test("it exists", function () {
      var model = this.subject();
      // var store = this.store();
      ok(model);
    });
  });
define("front-end/tests/unit/routes/about-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:about", "AboutRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("front-end/tests/unit/routes/contact-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:contact", "ContactRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("front-end/tests/unit/routes/dashboard-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var test = __dependency1__.test;
    var moduleFor = __dependency1__.moduleFor;

    moduleFor("route:dashboard", "DashboardRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("front-end/tests/unit/services/flash-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("service:flash", "FlashService", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var service = this.subject();
      ok(service);
    });
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });
define("front-end/views/dk-select", 
  ["ember","ember-dropkick/views/dk-select","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var DropKick = __dependency2__["default"];

    __exports__["default"] = DropKick;
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
  require("front-end/app")["default"].create({"LOG_ACTIVE_GENERATION":true,"LOG_VIEW_LOOKUPS":true});
}

/* jshint ignore:end */
//# sourceMappingURL=front-end.map