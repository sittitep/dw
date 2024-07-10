require 'rails_helper'

RSpec.describe "Api::BooksControllers", type: :request do
  before(:each) do
    Book.create(title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Fiction', year: 1925)
    Book.create(title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Fiction', year: 1960)
    Book.create(title: '1984', author: 'George Orwell', genre: 'Fiction', year: 1949)
  end

  describe "GET /api/books_controllers" do
    it "returns books" do
      get "/api/books"

      prased_response = JSON.parse(response.body)

      expect(response).to have_http_status(200)
      expect(prased_response['data'].size).to eq(3)

      expect(prased_response['data'][0]['title']).to eq('The Great Gatsby')
      expect(prased_response['data'][0]['author']).to eq('F. Scott Fitzgerald')
      expect(prased_response['data'][0]['genre']).to eq('Fiction')
      expect(prased_response['data'][0]['year']).to eq(1925)

      expect(prased_response['data'][1]['title']).to eq('To Kill a Mockingbird')
      expect(prased_response['data'][1]['author']).to eq('Harper Lee')
      expect(prased_response['data'][1]['genre']).to eq('Fiction')
      expect(prased_response['data'][1]['year']).to eq(1960)

      expect(prased_response['data'][2]['title']).to eq('1984')
      expect(prased_response['data'][2]['author']).to eq('George Orwell')
      expect(prased_response['data'][2]['genre']).to eq('Fiction')
      expect(prased_response['data'][2]['year']).to eq(1949)
    end
  end
end
