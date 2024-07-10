require 'rails_helper'

RSpec.describe "Api::BooksControllers", type: :request do
  before(:each) do
    Book.create(title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Fiction', year: 1925)
    Book.create(title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Fiction', year: 1960)
    Book.create(title: '1984', author: 'George Orwell', genre: 'Fiction', year: 1949)
  end

  describe "GET /api/books" do
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

  describe "GET /api/books/:id" do
    it "returns a book" do
      get "/api/books/1"

      prased_response = JSON.parse(response.body)

      expect(response).to have_http_status(200)

      expect(prased_response['data']['title']).to eq('The Great Gatsby')
      expect(prased_response['data']['author']).to eq('F. Scott Fitzgerald')
      expect(prased_response['data']['genre']).to eq('Fiction')
      expect(prased_response['data']['year']).to eq(1925)
    end

    context "when the book does not exist" do
      it "returns an error" do
        get "/api/books/100"

        prased_response = JSON.parse(response.body)

        expect(response).to have_http_status(200)
        expect(prased_response['error']['code']).to eq("10404")
        expect(prased_response['error']['message']).to eq('Record not found')
      end
    end
  end

  describe "POST /api/books" do
    it "creates a book" do
      post "/api/books", params: {
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        genre: 'Fiction',
        year: 1951
      }

      prased_response = JSON.parse(response.body)

      expect(response).to have_http_status(200)
      expect(Book.count).to eq(4)

      expect(prased_response['data']['title']).to eq('The Catcher in the Rye')
      expect(prased_response['data']['author']).to eq('J.D. Salinger')
      expect(prased_response['data']['genre']).to eq('Fiction')
      expect(prased_response['data']['year']).to eq(1951)
    end

    context "when required parameters are missing" do
      it "returns an error" do
        post "/api/books", params: {
          genre: 'Fiction',
          year: 1951
        }

        prased_response = JSON.parse(response.body)
        expect(response).to have_http_status(200)
        expect(prased_response['error']['code']).to eq("10422")

        error_details = prased_response['error']['details']

        expect(error_details.count).to eq(2)
        expect(error_details["title"]).to eq("can\'t be blank")
        expect(error_details["author"]).to eq("can\'t be blank")
      end
    end

    context "when the book already exists" do
      it "returns an error" do
        post "/api/books", params: {
          title: 'The Great Gatsby',
          author: 'F. Scott Fitzgerald',
          genre: 'Fiction',
          year: 1925
        }

        prased_response = JSON.parse(response.body)
        expect(response).to have_http_status(200)
        expect(prased_response['error']['code']).to eq("10422")

        error_details = prased_response['error']['details']

        expect(error_details.count).to eq(1)
        expect(error_details["title"]).to eq("has already been taken")
      end
    end

    context "when the year is not valid" do
      it "returns an error" do
        post "/api/books", params: {
          title: 'The Catcher in the Rye',
          author: 'J.D. Salinger',
          genre: 'Fiction',
          year: 'nineteen fifty-one'
        }

        prased_response = JSON.parse(response.body)
        expect(response).to have_http_status(200)

        expect(prased_response['error']['code']).to eq("10422")

        error_details = prased_response['error']['details']

        expect(error_details.count).to eq(1)
        expect(error_details["year"]).to eq("is invalid")
      end
    end
  end
end
