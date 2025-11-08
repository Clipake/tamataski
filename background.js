
setInterval(getCurrentTab, 500)
console.log("if you didn't see this line, the program didn't work oh no")

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
//=== strict equality