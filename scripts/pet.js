const speed = 5



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



const canvas = document.createElement("canvas")
canvas.height = container.offsetHeight
canvas.width = container.offsetWidth
container.appendChild(canvas)

canvas.className = "tamataski_canvas"


const imageSize = 32
let scaledImageSize = 80;
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
const sleep = [176, 177]
const sad = [451, 452]

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
            petVelocity = 0
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
    },

    {
        set: function(){
            setAnimation(sleep)
            petVelocity = 0
        },
        run: function(){}
    },

    {
        set: function(){
            setAnimation(sad)
            petVelocity = 0
        },
        run: function(){}
    }
]

const petStateEnum = {
    "Idle": 0,
    "Walk": 1,
    "Sleep": 2,
    "Sad": 3
}   


const response = chrome.runtime.sendMessage({canvas_width: canvas.width, scaledImageSize: scaledImageSize});
currentPetState = response.currentPetState | 0
petPosition = response.petPosition | 0
petVelocity = response.petVelocity | 0
if (response.petMood == "sad"){
    currentPetState = 3
}else{
    currentPetState = 1
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

    chrome.runtime.onMessage.addListener(function(message){
        currentPetState = message.currentPetState
        petPosition = message.petPosition
        petVelocity = message.petVelocity
        
        petStates[message.currentPetState].set()
        console.log("state", currentPetState)
        console.log('mood', message.petMood)
    })


    
}

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace == 'local' && changes.petMood?.newValue) {
        const val = String(changes.petMood.newValue)
        if (val == "sad"){
            currentPetState = 3
            petStates[currentPetState].set()
            scaledImageSize = 400

        }else{
            currentPetState = 1
            petStates[currentPetState].set()
            scaledImageSize = 80
        }
        console.log('petMood', val)
    }
    // for (let [key, {oldVal, newVal}] of Object.entries(changes)){
    //     if (key == "petMood"){
    //         if (newVal == "sad"){
    //             currentPetState = 3
    //         }else{
    //             currentPetState = 1
    //         }
    //         console.log("petmood", newVal)
    //     }
    // }
})
//loop();









