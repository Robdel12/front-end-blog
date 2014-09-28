class Api::PostsController < ApplicationController

  def index
    if params[:dashboard]
      render json: Posts.all
    else
      render json: Posts.where(is_published: true)
    end
  end

  def show
    render json: Posts.find_by_post_slug(params[:id]) || Posts.find(params[:id])
  end

  def create
    post = Posts.new(new_post_params)

    if post.save
      render json: post
    else
      render json: post, status: 422
    end
  end

  def update
    post = Posts.find(params[:id])
    if post.update_attributes(update_post_params)
      render json: post
    else
      render json: post, status: 422
    end
  end

  def destroy
    post = Posts.find(params[:id])
    if post.destroy
      render json: post, status: 204
    else
      render json: post
    end
  end

private

  def new_post_params
    params.require(:post).permit(:post_slug, :title, :excerpt, :body, :published_date, :is_published)
  end

  def update_post_params
    params.require(:post).permit(:post_slug, :title, :excerpt, :body, :published_date, :id, :is_published)
  end

end
