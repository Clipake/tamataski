setInterval(getAllCurrentTabs, 500);
setInterval(updateTimer, 1000);
console.log("background service worker starting");

// 安装 / 点击 事件
chrome.runtime.onInstalled.addListener(() => {
  console.log("TamaTaski extension installed");
});
chrome.action.onClicked.addListener(() => {
  chrome.action.openPopup();
});

// Safe sendMessage：避免未处理的 promise rejection / lastError
function sendMessageSafe(tabId, message) {
  return new Promise((resolve) => {
    try {
      chrome.tabs.sendMessage(tabId, message, (response) => {
        const err = chrome.runtime.lastError;
        if (err) {
          console.warn('sendMessage failed for tab', tabId, err.message);
          resolve(null);
          return;
        }
        resolve(response);
      });
    } catch (e) {
      console.warn('sendMessage exception', e);
      resolve(null);
    }
  });
}

// Timer & pet 状态全域变量（一次声明，供后面使用）
let totalFocusTime = 0;
let totalTime = 0;
let previousTime = null;
let timerRunning = false;
let petMood = "happy";

let currentPetState = 0;
const petStateEnum = { Idle: 0, Walk: 1, Sleep: 2 };

const randomNumBetween = function (from, to) {
  // 返回 [from, to) 的整数
  return Math.floor(Math.random() * (to - from)) + from;
};

// petStateLoop：只向可注入的页面发送消息（过滤 chrome:// 等）
const petStateLoop = function () {
  currentPetState = randomNumBetween(0, Object.keys(petStateEnum).length);
  chrome.tabs.query({}, function (tabs) {
    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      if (!tab || !tab.id || !tab.url) continue;
      const url = tab.url;
      if (!(url.startsWith('http://') || url.startsWith('https://'))) continue;
      // 使用 safe wrapper，避免未处理的异常
      sendMessageSafe(tab.id, { currentPetState }).then(() => { /* optional */ });
    }
  });
  console.log('pet state', currentPetState);
  const timeout = (Math.floor(Math.random() * 5) + 2) * 1000;
  setTimeout(petStateLoop, timeout);
};
petStateLoop();

// 处理来自 popup 的注入请求（如果需要注入到当前活动 tab）
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message && message.action === "injectShopScript") {
    if (!chrome.scripting || !chrome.scripting.executeScript) {
      console.error('scripting API not available');
      sendResponse({ success: false, error: 'scripting API not available' });
      return;
    }
    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const tab = tabs[0];
      if (!tab || !tab.id) {
        sendResponse({ success: false, error: 'no active tab' });
        return;
      }
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['shop/shop.js']
      });
      sendResponse({ success: true });
    } catch (err) {
      console.error('inject error', err);
      sendResponse({ success: false, error: err && err.message ? err.message : String(err) });
    }
    return true;
  }
});

// Helper: get all current tab urls (used by updateTimer)
async function getAllCurrentTabs() {
  const queryOptions = { highlighted: true };
  return new Promise((resolve) => {
    chrome.tabs.query(queryOptions, (tabs) => {
      const urls = [];
      for (const i in tabs) {
        if (tabs[i] && tabs[i].url) urls.push(tabs[i].url);
      }
      // 返回数组（可能为空）
      resolve(urls);
    });
  });
}

function getCurrentTabURL() {
  return new Promise((resolve) => {
    const queryOptions = { active: true };
    chrome.tabs.query(queryOptions, ([tab]) => {
      if (!tab || !tab.url) {
        resolve(null);
        return;
      }
      resolve(tab.url);
    });
  });
}

// 定时更新计时/金币状态（保留你原有逻辑并尽量稳健）
async function updateTimer() {
  const urls = await getAllCurrentTabs();
  if (!urls) return;
  const blockedSites = ["youtube.com", "instagram.com"];
  const isBlocked = urls.some(u => blockedSites.some(site => u.includes(site)));
  const now = Date.now();
  if (!previousTime) {
    previousTime = now;
    return;
  }
  const delta = (now - previousTime) / 1000;
  previousTime = now;
  totalTime += delta;

  // 更新 totalFocusTime、coins、petMood（保持你原逻辑，但更防护）
  if (!isBlocked) {
    petMood = "happy";
    chrome.storage.local.get(["totalFocusTime"]).then((result) => {
      let serverTotalFocusTime = (result && typeof result.totalFocusTime === 'number') ? result.totalFocusTime : 0;
      serverTotalFocusTime += delta;
      chrome.storage.local.set({ "totalFocusTime": serverTotalFocusTime }).then(() => {
        console.log("updated total focus time to: " + serverTotalFocusTime);
      });
    });
    timerRunning = true;
    chrome.storage.local.get(["coins"]).then((result) => {
      let coins = (result && typeof result.coins === 'number') ? result.coins : 0;
      coins += delta / 10;
      chrome.storage.local.set({ "coins": coins }).then(() => {
        console.log(`Coins updated: ${coins}`);
      });
    });
  } else {
    timerRunning = false;
    petMood = "sad";
  }

  chrome.storage.local.set({ "petMood": petMood }).then(() => {
    console.log("updated petMood to: " + petMood);
  });

  console.log(`Current tabs: ${urls}`);
  console.log(`Timer running: ${timerRunning}`);
}

