require 'google/api_client'
require 'date'
class GoogleAnalytics
  def initialize
    @client  = Google::APIClient.new(:application_name => ENV["GA_APP_NAME"], :application_version => '1.0')
    key_file = File.join('config', 'analytic_cert.p12')
    scope    = "https://www.googleapis.com/auth/analytics.readonly"
    key      = Google::APIClient::PKCS12.load_key(key_file, "notasecret")
    service_account = Google::APIClient::JWTAsserter.new(ENV["GA_EMAIL"], scope, key)
    @client.authorization = service_account.authorize
    @analytics = @client.discovered_api('analytics', 'v3')
  end

  def visitors(startDate, endDate)
    results = @client.execute(:api_method => @analytics.data.ga.get, :parameters => {
      'ids'         => ENV['GA_ID'],
      'start-date'  => startDate,
      'end-date'    => endDate,
      'metrics'     => "ga:visits",
      'dimensions'  => "ga:year,ga:month,ga:day",
      'sort'        => "ga:year,ga:month,ga:day"
    })
    if results.error?
      puts results.error_message
      return {}
    else
      hash = {}
      # some internal googles object magic :)
      results.data.rows.each do |r|
        hash["#{r[0]}-#{r[1]}-#{r[2]}"] = r[3].to_i
      end
      return hash
    end
  end
end
