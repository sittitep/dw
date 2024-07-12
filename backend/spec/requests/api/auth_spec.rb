require 'rails_helper'

RSpec.describe "Api::Auth", type: :request do
  before(:each) do
    @user = User.create(username: "test", password: "test")
  end

  describe "POST /api/auth/login" do
    it "returns a token" do
      post '/api/auth/login', params: { username: "test", password: "test" }

      parsed_body = response.parsed_body

      expect(response).to have_http_status(200)
      expect(parsed_body.dig(:data, :access_token)).to be_present
    end

    context "when the user does not exist" do
      it "returns an error" do
        post '/api/auth/login', params: { username: "not_a_user", password: "test" }

        parsed_body = response.parsed_body

        expect(response).to have_http_status(200)
        expect(parsed_body.dig(:error, :code)).to eq("10900")
      end
    end
  end
end
