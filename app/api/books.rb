ERROR_LIST = {
  "ActiveRecord::RecordNotFound" => {
    code: "10404",
    message: "Record not found"
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
    error = ERROR_LIST[e.class.name] || ERROR_LIST["Default"]
    error!({
      data: nil,
      error: build_error(error[:code], error[:message])
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
    desc 'Return a list of books'
    get do
      books = Book.all

      {
        data: serialize_books(books),
        error: nil
      }
    end

    desc 'return a book'
    params do
      requires :id, type: Integer, desc: 'Book ID'
    end
    route_param :id do
      get do
        book = Book.find(params[:id])

        {
          data: serialize_book(book),
          error: nil
        }
      end
    end  
  end
end
