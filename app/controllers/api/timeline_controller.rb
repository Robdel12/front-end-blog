class Api::TimelineController < ApplicationController
  before_filter :authorize_user, only: [:create, :update, :destroy]

  def index
    render json: Timeline.order("event_date DESC").all
  end

  def show
    render json: Timeline.find(params[:id])
  end

  def update
    timeline = Timeline.find(params[:id])

    if timeline.update_attributes(update_event_params)
      render json: timeline
    else
      render json: timeline, status: 422
    end
  end

  def destroy
    timeline = Timeline.find(params[:id])
    if timeline.destroy
      render json: timeline, status: 204
    else
      render json: timeline
    end
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

  def update_event_params
    params.require(:timeline).permit(:title, :event_date, :description, :is_published)
  end

end
