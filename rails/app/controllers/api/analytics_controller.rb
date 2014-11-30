class Api::AnalyticsController < ApplicationController

  def index
    google_analytics = GoogleAnalytics.new
    render json: google_analytics.visitors(params[:startDate], params[:endDate])
  end

end
