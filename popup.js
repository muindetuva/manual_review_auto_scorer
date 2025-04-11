// popup.js
document.getElementById('setScore').addEventListener('click', function() {
  let percentage = document.getElementById('percentage').value;
  document.getElementById('status').textContent = 'Sending message...';
  chrome.runtime.sendMessage({action: "setScore", percentage: percentage}, function(response) {
    if (chrome.runtime.lastError) {
      document.getElementById('status').textContent = 'Error: ' + chrome.runtime.lastError.message;
    } else {
      document.getElementById('status').textContent = 'Message sent. Response: ' + JSON.stringify(response);
    }
  });
});
