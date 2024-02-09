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
    let postArray = Object.values(snapshot.val())
    
    clearListEl()

    for (let i = 0; i < postArray.length; i++) {
        let currentPost = postArray[i]
    
        pushToList(currentPost)
    }
    let fromValueSnapshot = JSON.stringify(snapshot.val().from)
    console.log(fromValueSnapshot)
})



btnEl.addEventListener("click", function(){
    let inputValue = inputFieldEl.value
    // postEntries.message = inputFieldEl.value
    // postEntries.to = toInputFieldEl.value
    // postEntries.from = fromInputFieldEl.value
    let arr = [inputValue, inputValue]

    push(postsInDB, arr)

    // push(postsInDB, {
    //     to : postEntries.to,
    //     from : postEntries.from,
    //     message : postEntries.message
    // })
    
    console.log(`${inputValue} has been pushed to the database`)
    
    clearFieldEl()
})

function pushToList(value) {
    listEl.innerHTML += `<li>${value}</li>`
}

function clearListEl(){
    listEl.innerHTML = ""
}

function clearFieldEl(){
    inputFieldEl.value = ""
}