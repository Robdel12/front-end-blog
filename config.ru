# This file is used by Rack-based servers to start the application.

require ::File.expandpath('../config/environment', _FILE__) use Rack::Deflater
run Rails.application
