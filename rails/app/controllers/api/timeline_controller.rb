class Api::TimelineController < ApplicationController

  def index
    render json: Timeline.all
  end

end
