const s = document.createElement('script');
s.src = chrome.runtime.getURL('script/blocker.js');
s.onLoad = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);