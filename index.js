import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { 
    getDatabase, 
    ref, 
    push, 
    onValue,
    update } 
    from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = { 
    databaseURL: "https://realtime-database-e961b-default-rtdb.europe-west1.firebasedatabase.app/"
}
 
const app = initializeApp(appSettings)
const database = getDatabase(app)
const postsInDB = ref(database, "posts")

const inputFieldEl = document.getElementById("text-input")
const btnEl = document.getElementById("publish-button")
const listEl = document.getElementById("post-lists")
const fromInputFieldEl = document.getElementById("from-input")
const toInputFieldEl = document.getElementById("to-input")

onValue(postsInDB, function(snapshot){
    let postArray = Object.entries(snapshot.val())
    
    clearListEl()

    for (let i = 0; i < postArray.length; i++) {
        let currentPost = postArray[i]
    
        pushToList(currentPost)
    }
})

btnEl.addEventListener("click", function(){
    const inputValue = inputFieldEl.value
    const fromValue = fromInputFieldEl.value
    const toValue = toInputFieldEl.value

    if (inputValue && fromValue && toValue) {
        let arr = [inputValue, fromValue, toValue, 0]
        pushToDb(arr)

        clearFieldEl()

    } else {
        inputFieldEl.style.borderColor = "red"
        fromInputFieldEl.style.borderColor = "red"
        toInputFieldEl.style.borderColor = "red"

        alert("Fill in the damn thing")
    }
})

function pushToDb(item){
    push(postsInDB, item)
}

function pushToList(value) {
    let postId = value[0]
    let postData = value[1]
    let postText = postData[0]
    let postFrom = postData[1]
    let postTo = postData[2]
    let likeData = postData[3]

    console.log(likeData)

    // dynamic creation of HTML elements
    let newListEl = document.createElement("li")
    let mainDivEl = document.createElement("div")
    let toEl = document.createElement("h3")
    let textEl = document.createElement("p")
    let likeBtnEl = document.createElement("button")
    let likeCountEl = document.createElement("p")
    let fromEl = document.createElement("h3")

    // tagging id to the respective elements using .setAttribute - "id"
    let newListId = newListEl.setAttribute("id", "post-cards")
    let likeBtnId = likeBtnEl.setAttribute("id", "like-btn")
    
    // Assigning value to elements
    fromEl.textContent = `From ${postFrom}`
    toEl.textContent = `To ${postTo}`
    textEl.textContent = postText
    likeBtnEl.textContent = "Like"
    likeCountEl.textContent = likeData

    // Appending / Nesting Elements
    newListEl.appendChild(mainDivEl)
    mainDivEl.appendChild(toEl)
    mainDivEl.appendChild(textEl)
    mainDivEl.appendChild(likeBtnEl)
    mainDivEl.appendChild(fromEl)

    listEl.append(newListEl)


    likeBtnEl.addEventListener("click", function(){
        likeData += 1 
        let exactLocationInDb = ref(database, `posts/${postId}`)
        update(exactLocationInDb, {
            3: likeData,
        })
        console.log(likeData)

    })
    console.log(newListEl)

}


function clearListEl(){
    listEl.innerHTML = ""
}

function clearFieldEl(){
    inputFieldEl.value = ""
    fromInputFieldEl.value = "" 
    toInputFieldEl.value = "" 
}
