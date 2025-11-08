function renderPet(){
    const element = document.createElement('p')
    element.textContent = "hello world!"

    const body = document.querySelector("body")
    
    document.insertBefore(element, body)
    const img = document.createElement('')
}

renderPet()

