import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { 
    getDatabase, 
    ref, 
    push, 
    onValue } 
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

    let arr = [inputValue, fromValue, toValue]
    
    pushToDb(arr)

    clearFieldEl()
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

    let newListEl = document.createElement("li")
    let newListId = newListEl.setAttribute("id", "post-cards")

    let mainDivEl = document.createElement("div")
    let toEl = document.createElement("h3")
    let textEl = document.createElement("p")
    let fromEl = document.createElement("h3")

    fromEl.textContent = `From ${postFrom}`
    toEl.textContent = `To ${postTo}`
    textEl.textContent = postText

    newListEl.appendChild(mainDivEl)
    mainDivEl.appendChild(toEl)
    mainDivEl.appendChild(textEl)
    mainDivEl.appendChild(fromEl)

    listEl.append(newListEl)

    console.log(newListEl)

    // listEl.innerHTML += `<li>
    // <div>
    // To ${postTo}
    // <br>
    // ${postText}
    // <br>
    // From ${postFrom}
    // </div>
    // <button>Like</button>
    // </li>`
}

function clearListEl(){
    listEl.innerHTML = ""
}

function clearFieldEl(){
    inputFieldEl.value = ""
    fromInputFieldEl.value = "" 
    toInputFieldEl.value = "" 
}
