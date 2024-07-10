ERROR_LIST = {
  "ActiveRecord::RecordNotFound" => {
    code: "10404",
    message: "Record not found"
  },
  "ActiveRecord::RecordInvalid"  => {
    code: "10422",
    message: "Validation errors",
    transform: lambda do |message|
      hash = {}
      message.gsub("Validation failed: ", "").split(',').each do |pair|
        key, value = pair.split(' ', 2)
        hash[key.downcase.strip.to_sym] = value.strip
      end
      hash
    end
  },
  "Default" => {
    code: "10500",
    message: "Internal server error"
  }
}.freeze

class Books < Grape::API
  format :json
  prefix :api

  rescue_from Exception do |e|
    Rails.logger.error(e)
    error = ERROR_LIST[e.class.name] || ERROR_LIST["Default"]
    error!({
      data: nil,
      error: build_error(error[:code], error[:message], error[:transform]&.call(e.message))
    }, 200)
  end

  helpers do
    def serialize_books(books)
      books.map do |book|
        serialize_book(book)
      end
    end
  
    def serialize_book(book)
      {
        id: book.id,
        title: book.title,
        author: book.author,
        genre: book.genre,
        year: book.year
      }
    end

    def build_error(code, message, details = nil)
      { code:, message:, details: }
    end
  end

  resource :books do
    desc 'return a list of books'
    get do
      books = Book.all

      {
        data: serialize_books(books),
        error: nil
      }
    end

    desc 'return a book'
    route_param :id do
      get do
        book = Book.find(params[:id])

        {
          data: serialize_book(book),
          error: nil
        }
      end
    end

    desc 'create a book'
    post do
      params do
        optinal :title, type: String
        optinal :author, type: String
        optinal :genre, type: String
        optinal :year, type: Integer
      end

      book = Book.create!(params)

      status 200
      {
        data: serialize_book(book),
        error: nil
      }
    end

    desc 'update a book'
    route_param :id do
      put do
        params do
          optinal :title, type: String
          optinal :author, type: String
          optinal :genre, type: String
          optinal :year, type: Integer
        end

        book = Book.update!(params[:id], params)
  
        status 200
        {
          data: serialize_book(book),
          error: nil
        }
      end
    end

    desc 'delete a book'
    route_param :id do
      delete do
        book = Book.find(params[:id])
        book.destroy!

        status 200
        {
          data: nil,
          error: nil
        }
      end
    end
  end
end
