class Api::AnalyticsController < ApplicationController

  def index
    google_analytics = GoogleAnalytics.new
    google_analytics.visitors("2014-01-01", "2014-03-04")
  end

end
