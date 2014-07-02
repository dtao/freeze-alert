(function() {

  var endpoint, timeout, lastHeartbeat = Date.now(), intervalId;

  function parseOptions(optionsMessage) {
    var options = JSON.parse(optionsMessage);
    endpoint = options.url;
    timeout = options.timeout || 5000;
  }

  function checkForRecentHeartbeat() {
    if (lastHeartbeat < Date.now() - timeout) {
      alertEndpoint();

      // Once we've already alerted the endpoint, there's no need to keep
      // checking for another heartbeat.
      clearInterval(intervalId);

      // If we receive another heartbeat, we'll start listening again.
      intervalId = null;
    }
  }

  function alertEndpoint() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', endpoint);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send('currentTime=' + Date.now() + '&lastHeartbeat=' + lastHeartbeat);
  }

  if (typeof WorkerGlobalScope !== 'undefined' && this instanceof WorkerGlobalScope) {
    this.onmessage = function(e) {
      var message = e.data;

      // If it looks like '{...' it must be the options message.
      if (message.charAt(0) === '{') {
        parseOptions(message);
        this.postMessage('options RECEIVED');
        return;
      }

      // Otherwise it's just a humble little heartbeat.
      lastHeartbeat = Date.now();

      if (!intervalId) {
        intervalId = setInterval(checkForRecentHeartbeat, 1000);
      }
    };
  }

  this.FreezeAlert = {
    monitor: function monitor(options) {
      options || (options = {});

      var fileName = options.fileName || 'freezeAlert.js',
          worker = new Worker(fileName);

      // Notify the worker of endpoint, timeout, etc..
      worker.postMessage(JSON.stringify(options));

      // After first response, start sending heartbeat.
      worker.addEventListener('message', function(e) {
        function sendHeartbeat() {
          worker.postMessage('ba-bump');
        }

        setInterval(sendHeartbeat, 1000);
      });
    }
  };

}).call(this);
