class Api::PostsController < ApplicationController
  def index
    render json: Posts.all
  end

  def show
    render json: Posts.find_by_post_slug(params[:id]) || Posts.find(params[:id])
  end
end
