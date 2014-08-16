class Api::PostsController < ApplicationController
  def index
    render json: Posts.all
  end

  def show
    render json: Posts.find(params[:id])
  end
end
