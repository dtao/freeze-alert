# freeze-alert

Want to know if/when the UI freezes in your web app?

Simple! Just write some JavaScript to detect if the JavaScript isn't responding, and then...

Oh wait. Tricky problem, ain't it?

*Well*, here's a hacky way to do it: create a web worker, and then have your main thread use `setInterval` to periodically let the worker know the UI is still responding. When the worker stops receiving messages from the main thread, it notifies your server.

## Usage

```javascript
FreezeAlert.monitor({
  // required: where you want a POST request when the UI becomes unresponsive
  url: 'http://yoursite.com/unresponsive',

  // optional: how long (in ms) to give the UI before reporting a freeze
  timeout: 5000,

  // where freezeAlert.js resides (defaults to 'freezeAlert.js')
  fileName: 'freezeAlert.js'
});
```
