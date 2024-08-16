const initngc = () => {
  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, request, function(response) {
          sendResponse(response);
          return true;
        });
    });
    }
  )
  
  chrome.runtime.onInstalled.addListener(async () => {
      chrome.contextMenus.create({
        id: 'bili-bb',
        title: '视频分片重播',
        type: 'normal',
        contexts: ["page"],
        onclick: () => {
          chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            // 获取tab的url
            if(tabs[0].url.includes('bilibili.com')) {
              chrome.tabs.sendMessage(tabs[0].id, {
                type: 'active',
              })
            }
          });
        }
      });
    
  });
}

initngc()
export {}
