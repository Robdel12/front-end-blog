class Api::TimelineController < ApplicationController
  before_filter :authorize_user, only: [:create]

  def index
    render json: Timeline.order("created_at DESC").all
  end

  def create
    event = Timeline.new(new_event_params)

    if event.save
      render json: event
    else
      render json: event, status: 422
    end
  end

private

  def new_event_params
    params.require(:timeline).permit(:title, :event_date, :description, :is_published)
  end

end
