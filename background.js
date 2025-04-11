// background.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "setScore") {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, request, function(response) {
        sendResponse(response);
      });
    });
    return true;  // Indicates that sendResponse will be called asynchronously
  }
});

