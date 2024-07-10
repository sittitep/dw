require 'rails_helper'

RSpec.describe "Api::BooksControllers", type: :request do
  describe "GET /api/books_controllers" do
    it "returns books" do
      get "/api/books"

      expect(response).to have_http_status(200)
    end
  end
end
