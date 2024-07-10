class Books < Grape::API
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
    desc 'Return a list of books'
    get do
      books = Book.all

      {
        data: serialize_books(books),
        error: nil
      }
    end
  end
end
