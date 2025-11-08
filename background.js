
setInterval(getAllCurrentTabs, 500)
console.log("if you didn't see this line, the program didn't work oh no")

async function getAllCurrentTabs() {
    let queryOptions = {highlighted: true};
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let y = ''
    chrome.tabs.query(queryOptions, (tabs) => {
        for(const i in tabs){
            y += tabs.url + "\n"
        }
        console.log(y)
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
async function updateTimer() {
    const tab = await getCurrentTab();
    if (!tab || !tab.url) return;

    const url = tab.url;
    const blockedSites = ["youtube.com", "instagram.com"];
    const isBlocked = blockedSites.some(site => url.includes(site));

    const now = new Date();
    const currentTime = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

    if (!previousTime) {
        previousTime = currentTime;
        return;
    }

    const delta = currentTime - previousTime;
    previousTime = currentTime;

    if(!isBlocked) {
        totalTime += delta;
        timerRunning = true;
    } else {
        timerRunning = false;
    }

    console.log(`Current tab: ${url}`);
    console.log(`Total active time: ${totalTime}s`);
    console.log(`Timer running: ${timerRunning}`);

}

setInterval(updateTimer, 1000);
