module ExceptionHandler
  def self.included(base)
    base.rescue_from Exception do |e|
      Rails.logger.error(e)
      error = ERROR_LIST[e.class.name] || ERROR_LIST["Default"]
      error!({
        data: nil,
        error: build_error(error[:code], error[:message], error[:transform] ? transform_error_message(e.message) : nil)
      }, 200)
    end
  end
end
