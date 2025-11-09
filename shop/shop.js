chrome.storage.local.set({"coins" : coins}).then(() => {
    console.log(`Coins updated: ${coins}`);
});



async function getCoins() {
    const result = await chrome.storage.local.get(["coins"]);
    return result.coins || 0;
}


async function buyItem(cost) {
    const result = await chrome.storage.local.get(["coins"]);
    let coins = result.coins || 0;


    if (coins >= cost) {
        coins -= cost;
        await chrome.storage.local.set({ coins });
        console.log(`Purchase successful! Remaining coins: ${coins}`);
        return true;
    } else {
        console.log("Not enough coins!");
        return false;
    }
}


await chrome.storage.local.set({ coins: 100 });


const currentCoins = await getCoins();
console.log("Current coins:", currentCoins);


const success = await buyItem(30);
console.log("Purchase result:", success);


console.log("Coins after purchase:", await getCoins());
