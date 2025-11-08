const speed = 5

function renderPet(){

    // const cssConnector = document.createElement("link")
    // cssConnector.rel = "stylesheet"
    // cssConnector.href = chrome.runtime.getURL('/assets/test.css')
    // document.head.appendChild(cssConnector)

    const container = document.createElement('div')
    container.className = "tamataski_container"
    
    document.body.appendChild(container)

    // const pet = document.createElement("img")
    // pet.src = chrome.runtime.getURL('/assets/smile_0.png')
    // pet.className = "tamataski_pet"
    // container.appendChild(pet)

    // const randomNumBetween = function(from, to){
    //     const between = to - from
    //     return Math.floor(Math.random() * between) - Math.abs(from)
    // }

    
    // let petPosition = 0

    // const loop = async function(){
    //     const spaceLeft = Math.min(15, petPosition-5)
    //     const spaceRight = Math.min(15, 95-petPosition)
    //     console.log({spaceLeft, spaceRight})
        
    //     const distance = randomNumBetween(-spaceLeft, spaceRight)
    //     const movementTime = (Math.abs(distance)/speed)*1000
    //     petPosition += distance
    //     petPosition = Math.min(Math.max(petPosition, 5),  95)
    //     console.log('position: ', petPosition)

    //     const move = [
    //         {transform: `translateX(${petPosition}vw)`}
    //     ]
    //     const timing = {
    //         duration: movementTime,
    //         iterations: 1,
    //         fill: "forwards"
    //     }
    //     console.log('distance: ', distance)

    //     animation = pet.animate(move, timing);
    //     await animation.finished;
    //     animation.commitStyles();
    //     animation.cancel();
    
    //     let timeout = (Math.floor(Math.random() * 3) + 0)*1000 + movementTime //1-3+movement time seconds
    //     setTimeout(loop, timeout)
    // }

    const canvas = document.createElement("canvas")
    canvas.height = container.offsetHeight
    canvas.width = container.offsetWidth
    container.appendChild(canvas)

    canvas.className = "tamataski_canvas"
    

    const imageSize = 32
    const spritesWidth = 11
    const spritesHeight = 53

    let frameX = 0
    let frameY = 0
    
    const context = canvas.getContext("2d")
    let image = new Image()
    image.src = chrome.runtime.getURL("/assets/cat 1.png")
    image.onload = function(){
        setInterval(function(){
            const webimge = new WebImage('');
            WebImage.width = 32
            WebImage.height = 32
            WebImage.setPosition()
            context.clearRect(0, 0, canvas.height, canvas.width)
            context.drawImage(image, frameX*imageSize, frameY*imageSize, 32, 32, 0, canvas.height-25, 64, 64)

            frameX += 1
            if (frameX >= spritesWidth){
                frameX = 0
                frameY += 1
                if (frameY >= spritesHeight){
                    frameY = 0
                }
            }
        }, 500)
        
    }
    //loop();
    
}

renderPet()






