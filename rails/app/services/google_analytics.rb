require 'google/api_client'
require 'date'
class GoogleAnalytics
  def initialize
    @client  = Google::APIClient.new(:application_name => "RobertBlog", :application_version => '1.0')
    key_file = File.join('config', Settings.key_file)
    scope    = "https://www.googleapis.com/auth/analytics.readonly"
    key      = Google::APIClient::PKCS12.load_key(key_file, Settings.key_file_password)
    service_account = Google::APIClient::JWTAsserter.new(Settings.analytics_email, scope, key)
    @client.authorization = service_account.authorize
    @analytics = @client.discovered_api('analytics', 'v3')
  end

  def visitors(startDate, endDate)
    results = @client.execute(:api_method => @analytics.data.ga.get, :parameters => {
      'ids'         => Settings.google_analytics_profile_id,
      'start-date'  => startDate,
      'end-date'    => endDate,
      'metrics'     => "ga:visitors",
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
