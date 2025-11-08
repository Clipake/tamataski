function renderPet(){
    // const cssConnector = document.createElement("link")
    // cssConnector.rel = "stylesheet"
    // cssConnector.href = chrome.runtime.getURL('/assets/test.css')
    // document.head.appendChild(cssConnector)

    const wrapper = document.createElement('div')
    wrapper.className = "tamataski_pet"
    document.body.appendChild(wrapper)

    
    const image_element = document.createElement("img")
    image_element.src = chrome.runtime.getURL('/assets/smile_0.png')
    image_element.className = "test_image"
    wrapper.appendChild(image_element)
    
    
}

renderPet()

