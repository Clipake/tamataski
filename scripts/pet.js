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

    const randomNumBetween = function(from, to){
         const between = to - from
         return Math.floor(Math.random() * between) - Math.abs(from)
    }

    
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
    const scaledImageSize = 80;
    const spritesWidth = 11
    const spritesHeight = 53

   
    let frameNumber = 0
    let frameX = (frameNumber+1)%11 - 1
    let frameY = Math.floor((frameNumber+1)/11)

    const context = canvas.getContext("2d")
    context.imageSmoothingEnabled = false

    let image = new Image()
    image.src = chrome.runtime.getURL("/assets/cat 1.png")


    let currentAnimation = [1, 1]
    const walk_right = [66, 73]
    const walk_left = [77, 84]
    const sit_front = [0, 0]
    
    let currentPetState = 0;
    let petVelocity = 0;
    let petPosition = 0;

    const setAnimation = function(animation){
        currentAnimation = animation
        frameNumber = animation[0]
    }

    const petStates = [
        {
            set: function(){
                setAnimation(sit_front)
            },
            run: function(){}
        },
        {
            set: function(){
                petVelocity = Math.random() > 0.5 ? -1 : 1
                setAnimation(petVelocity == -1 ? walk_left : walk_right)
            },

            run: function(){
                petPosition += petVelocity
            }
        }
    ]

    const petStateEnum = {
        "Idle": 0,
        "Walk": 1,
    }   


    
    
    image.onload = function(){
        currentAnimation = walk_right
        frameNumber = currentAnimation[0]

        const animateLoop = setInterval(async function(){
            
            if (frameNumber >= currentAnimation[1]){
                frameNumber = currentAnimation[0]
            }else{
                frameNumber += 1
            }
        
            frameX = (frameNumber+1)%11 - 1
            frameY = Math.floor((frameNumber+1)/11)
        }, 200)
        
        const fastLoop = setInterval(async function(){
            context.clearRect(0, 0, canvas.width, canvas.height)
            context.drawImage(image, frameX*imageSize, frameY*imageSize, 32, 32, petPosition, canvas.height-scaledImageSize+10, scaledImageSize, scaledImageSize)
        
            petStates[currentPetState].run()

            if (petPosition < 0 ||  petPosition > canvas.width-scaledImageSize){
                petVelocity = -petVelocity
                setAnimation(petVelocity == -1 ? walk_left : walk_right)
            }

        }, 30)

        const doLoop = function(){
            currentPetState = randomNumBetween(0, Object.keys(petStateEnum).length)
            petStates[currentPetState].set()
            console.log(currentPetState)
            let timeout = (Math.floor(Math.random() * 5) + 2)*1000 //0-3 seconds
            setTimeout(doLoop, timeout)
        }

        doLoop();

        
    }
    //loop();
    
}

renderPet()






