
setInterval(getCurrentTab, 10)
console.log("if you didn't see this line, the program didn't work oh no")

async function getCurrentTab() {
    let queryOptions = { active: true};
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let tab = await chrome.tabs.query(queryOptions);
    console.log("this is what tab return: " + tab)
    return tab.toString()
}