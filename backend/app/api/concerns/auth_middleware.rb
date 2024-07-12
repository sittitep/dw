module AuthMiddleware
  def authenticate!
    access_token = headers['Authorization']&.split(' ')&.last
    user = User.find_by(access_token: access_token)

    raise Unauthorized unless user

    @current_user = user
    true
  end

  def current_user
    @current_user
  end
end

class Unauthorized < StandardError; end
