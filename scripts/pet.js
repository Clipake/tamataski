function renderPet(){
    // const cssConnector = document.createElement("link")
    // cssConnector.rel = "stylesheet"
    // cssConnector.href = chrome.runtime.getURL('/assets/test.css')
    // document.head.appendChild(cssConnector)

    const pet = document.createElement('div')
    pet.className = "tamataski_pet"
    
    document.body.appendChild(pet)

    
    const image_element = document.createElement("img")
    image_element.src = chrome.runtime.getURL('/assets/smile_0.png')
    image_element.className = "test_image"
    pet.appendChild(image_element)

    
    let petPosition = 0
    const loopContents = async function(){
        console.log("move element")
        petPosition -= 100
        const move = [
            {transform: `translateX(${petPosition}px)`}
        ]
        const timing = {
            duration: 2000,
            iterations: 1,
            fill: "forwards"
        }
        animation = pet.animate(move, timing);
        await animation.finished;
        animation.commitStyles();
        animation.cancel();
    }

    const loop = function(){
        loopContents()
    
        let timeout = (Math.floor(Math.random() * 5) + 2)*1000
        setTimeout(loop, timeout)
    }

    loop();
    
}

renderPet()

