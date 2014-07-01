(function() {

  var endpoint, lastHeartbeat = Date.now(), intervalId;

  function checkForRecentHeartbeat() {
    if (lastHeartbeat < Date.now() - 5000) {
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

      // This must be the endpoint.
      if (message !== 'ba-bump') {
        endpoint = message;
        this.postMessage('yo!');
        return;
      }

      lastHeartbeat = Date.now();

      if (!intervalId) {
        intervalId = setInterval(checkForRecentHeartbeat, 1000);
      }
    };
  }

  this.FreezeAlert = {
    monitor: function monitor(endpoint) {
      var worker = new Worker('freezeAlert.js');

      // Notify the worker of the endpoint.
      worker.postMessage(endpoint);

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
