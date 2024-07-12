class Books < Grape::API
  include ExceptionHandler

  helpers ApiBase
  helpers AuthMiddleware

  before { authenticate! }

  format :json
  prefix :api

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

        success!(serialize_book(book))
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

      success!(serialize_book(book))
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
        
        success!(serialize_book(book))
      end
    end

    desc 'delete a book'
    route_param :id do
      delete do
        book = Book.find(params[:id])
        book.destroy!

        success!
      end
    end
  end
end
