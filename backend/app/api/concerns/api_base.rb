module ApiBase
  def build_error(code, message, details = nil)
    { code:, message:, details: }
  end

  def transform_error_message(message)
    hash = {}
    message.gsub("Validation failed: ", "").split(',').each do |pair|
      key, value = pair.split(' ', 2)
      hash[key.downcase.strip.to_sym] = value.strip
    end
    hash
  end

  def success!(data = nil)
    status 200
    {
      data: data,
      error: nil
    }
  end
end
