class Auth < Grape::API
  helpers ApiBase
  include ExceptionHandler

  format :json
  prefix :api

  resource :auth do
    post :login do
      user = User.find_by(username: params[:username])
      if user&.authenticate(params[:password])
        access_token = SecureRandom.hex(10)
        user.update({
          access_token: access_token
        })

        success!({ access_token: access_token })
      else
        raise AuthenticationFailed
      end
    end
  end
end

class AuthenticationFailed < StandardError; end
