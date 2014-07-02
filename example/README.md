# freeze-alert example

All you need to run this example is the Sinatra gem.

    gem install sinatra
    ruby example.rb

This will start a server running and listening on port 4567. Now visit http://localhost:4567 in a web browser, click on the button (which freezes up the UI by starting a `while` loop), and watch the terminal. After a few seconds you should see a notification that the UI froze.
