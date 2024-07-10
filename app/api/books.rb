class Books < Grape::API
  format :json
  prefix :api

  resource :books do
    desc 'Return a list of books'
    get do
      status 200
    end
  end
end
