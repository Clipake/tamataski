setInterval(getAllCurrentTabs, 500)
setInterval(updateTimer, 1000);
console.log("if you didn't see this line, the program didn't work oh no")
/*
async function getAllCurrentTabs() {
    let queryOptions = {highlighted: true};
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let y = ''
    chrome.tabs.query(queryOptions, (tabs) => {
        for(const i in tabs){
            y += tabs[i].url + "\n"
        }
        console.log(y)
    })
}

function getCurrentTabURL() {
    return new Promise((resolve) => {
        let queryOptions = {active: true};
        chrome.tabs.query(queryOptions, ([tab]) => {
            if (!tab || !tab.url) {
                resolve(null);
                return;
            }
            resolve(tab.url);
        });
    });
}
*/

async function getAllCurrentTabs() {
    let queryOptions = {highlighted: true};
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let y = []
    return new Promise((resolve) => {
        chrome.tabs.query(queryOptions, (tabs) => {
        for(const i in tabs){
            y.push(tabs[i].url)
        }
        console.log(y)
        resolve(y)
    })
    })
    
}
async function getCurrentTab() {
    let queryOptions = {active: true, lastFocusedWindow: true};
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    chrome.tabs.query(queryOptions, ([tab]) => {
            if (!tab) {
            console.warn('No active tab found. Are you on the console perchance???');
            return;
        }
        console.log(tab.url)
    })

    //if anyone DELETES DELETES this documentation below, I will NOT NOT be HAPPY
    //this is a callback function
    //chrome.tabs.query takes in queryOptions as a variable and returns the value as tabs
    //the second parameter is a lambda [function] that uses tabs (returned from the function running with 1st parameter)
    //hence, the second parameter is a function that runs after function finishes with the actual input (1st parameter)
    //we MUST MUST MUST do this because otherwise JS might try return tabs.url BEFORE the query is actually complete
        //lambda inside the function MAKES MAKES MAKES sure that we KNOW what tabs is before returning it
}

//= is assignment
//== loose equality

// Timer globals
let totalFocusTime = 0;
let totalTime = 0;
let previousTime = null;
let timerRunning = false;

// Helper to wrap your callback-style query in a Promise
function getCurrentTabURL() {
    return new Promise((resolve) => {
        let queryOptions = {active: true};
        chrome.tabs.query(queryOptions, ([tab]) => {
            if (!tab || !tab.url) {
                resolve(null);
                return;
            }
            resolve(tab.url);
        });
    });
}

// Timer update function
async function updateTimer() {
    const url = await getAllCurrentTabs();
    console.log(url)
    if (!url) return;

    const blockedSites = ["youtube.com", "instagram.com"];
    const isBlocked = url.some(url =>
    blockedSites.some(site => url.includes(site)) //black box, works, return bool
    );
    const now = Date.now();
    if (!previousTime) {
        previousTime = now;
        console.log("no url detected")
        return;
    }

    const delta = (now - previousTime) / 1000; // seconds
    console.log("delta "+delta)
    previousTime = now
    totalTime += delta
    //adds time to storage
    chrome.storage.local.get(["totalTime"]).then((result) => {
        let serverTotalTime = 0
        result.totalTime === undefined ? serverTotalTime = result.totalTime : serverTotalTime = 0
        serverTotalTime += + delta
        chrome.storage.local.set({"totalFocusTime" : serverTotalTime}).then(() => {
            console.log("updated total time to: " + totalTime)
        });
    });


    //adds coins and totalFocusTime to storage
    if (!isBlocked) {
        chrome.storage.local.get(["totalFocusTime"]).then((result) => {
            let serverTotalFocusTime
            result.totalFocusTime === undefined ? serverTotalFocusTime = result.totalFocusTime : serverTotalFocusTime = 0
            serverTotalFocusTime += delta
            chrome.storage.local.set({"totalFocusTime" : serverTotalFocusTime}).then(() => {
                console.log("updated total focus time to: " + totalFocusTime)
            });
        });
        totalFocusTime += delta;
        timerRunning = true;
        let coins = 0
        chrome.storage.local.get(["coins"]).then((result) => {
        coins = result.coins
        console.log("total coins "+result.coins)
        if (coins === undefined){
            console.log("coins is now undefined")
            coins = 0
        }

         console.log("Value is " + coins);
        coins += delta/10;
        console.log("Value after flooring " + coins);
        chrome.storage.local.set({"coins" : coins}).then(() => {
            console.log(`Coins updated: ${coins}`);
        });
        });
        
       
    } else {
        timerRunning = false;

    }

    console.log(`Current tab: ${url}`);
    //console.log(`Total active time: ${Math.floor(totalFocusTime)}s`);
    console.log(`Timer running: ${timerRunning}`);
}
