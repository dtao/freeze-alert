require 'sinatra'

get '/' do
  send_file File.join(settings.public_folder, 'index.html')
end

post '/' do
  puts "Oh no! The UI froze! #{params.inspect}"
end
