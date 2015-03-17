require 'rails_helper'

describe Posts, type: :model do
  describe "when published for the very first time" do
    let(:post) {
      Posts.create(
        title: "Title 1",
        post_slug: "title-1",
        created_at: Time.now - 4.days,
        excerpt: Faker::Lorem.sentences(1)[0],
        body: Faker::Lorem.paragraphs(15)[0],
        is_published: false
      )
    }

    before do
      allow(Rails).to receive(:env) { env }
      allow(Rails.application.twitter).to receive(:update)
      post.update_attributes(is_published: true)
    end

    describe "In development" do
      let(:env) { "development" }

      it "does not tweet" do
        expect(Rails.application.twitter).to_not have_received(:update)
      end
    end

    describe "In production" do
      let(:env) { "production" }

      it "twoots automagically" do
        expect(Rails.application.twitter).to have_received(:update).with("I just published: Title 1 http://robert-deluca.com/posts/title-1")
      end

      describe ".If it is saved again" do
        before do
          post.update_attributes(excerpt: "This is the new excerpt! Yay!")
        end

        it "keeps silent on the twitterverse" do
          expect(Rails.application.twitter).to have_received(:update).once
        end
      end
    end
  end
end

