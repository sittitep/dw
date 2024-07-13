class Rack::Attack
  if !ENV['REDIS_URL'] || Rails.env.test?
    cache.store = ActiveSupport::Cache::MemoryStore.new
  end
  # Throttle all requests by IP (10 requests per second)
  throttle('req/ip', limit: 300, period: 1.minute) do |req|
    req.ip
  end

  # Return custom response for throttled requests
  self.throttled_responder = lambda do |env|
    [429, {'Content-Type' => 'application/json'}, [{data: nil, error: {
      code: ERROR_LIST["Throttled"][:code],
      message: ERROR_LIST["Throttled"][:message]
    }}.to_json]]
  end
end
