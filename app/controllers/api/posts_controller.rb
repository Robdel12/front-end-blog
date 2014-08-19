class Api::PostsController < ApplicationController
  def index
    render json: Posts.all
  end

  def show
    render json: Posts.find_by_post_slug(params[:id]) || Posts.find(params[:id])
  end

  def create
    puts params
    post = Posts.new(user_params)

    if post.save
      render json: post
    else
      render json: post, status: 422
    end
  end

private

  def user_params
    params.require(:post).permit(:post_slug, :title, :excerpt, :body, :published_date)
  end

end
