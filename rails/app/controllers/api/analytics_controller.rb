class Api::AnalyticsController < ApplicationController

  def index
    params[:startDate] || params[:startDate] = "2015-01-01"
    params[:endDate] || params[:endDate] = "2015-01-16"
    google_analytics = GoogleAnalytics.new
    keyArray = ["date"]
    valueArray = ["Pageviews"]
    finalArray = []

    data = google_analytics.visitors(params[:startDate], params[:endDate])

    data.each do |key, value|
      keyArray.push("#{key}")
      valueArray.push(value)
    end
    finalArray.push(keyArray, valueArray)

    render json: finalArray
  end

end
