import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { 
    getDatabase, 
    ref, 
    push, 
    onValue,
    update,
    remove } 
    from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = { 
    databaseURL: "https://realtime-database-e961b-default-rtdb.europe-west1.firebasedatabase.app/"
}
 
let currentDate = new Date().toDateString()
console.log(currentDate)

const app = initializeApp(appSettings)
const database = getDatabase(app)
const postsInDB = ref(database, "posts")

const inputFieldEl = document.getElementById("text-input")
const btnEl = document.getElementById("publish-button")
const listEl = document.getElementById("post-lists")
const fromInputFieldEl = document.getElementById("from-input")
const toInputFieldEl = document.getElementById("to-input")

const mainCardEl = document.getElementById("mainCardDiv")

onValue(postsInDB, function(snapshot){
    let postArray = Object.entries(snapshot.val())
    
    clearListEl()
    displayArrayAsPosts(postArray)
})

function displayArrayAsPosts(postArray){
    for (let i = 0; i < postArray.length; i++) {
        let currentPost = postArray[i]
    
        appendToList(currentPost)
    }
}

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

        alert("Error: Please fill in the fields to submit")
    }
})

function pushToDb(item){
    push(postsInDB, item)
}

function appendToList(value) {
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
    let removeBtnEl = document.createElement("button")
    let likeCountEl = document.createElement("p")
    let fromEl = document.createElement("h3")

    // tagging id to the respective elements using .setAttribute - "id"
    let newListId = newListEl.setAttribute("id", "post-cards")
    let likeBtnId = likeBtnEl.setAttribute("id", "like-btn")
    let mainDivId = mainDivEl.setAttribute("id", "mainCardDiv")


    // Assigning value to elements
    fromEl.textContent = `From ${postFrom}`
    toEl.textContent = `To ${postTo}`
    textEl.textContent = postText
    likeBtnEl.textContent = `❤️ ${likeData}`
    removeBtnEl.textContent = "X"
    // likeCountEl.textContent = `❤️ ${likeData}`

    // Appending / Nesting Elements
    newListEl.appendChild(mainDivEl)
    mainDivEl.appendChild(toEl)
    mainDivEl.appendChild(textEl)
    mainDivEl.appendChild(fromEl)
    mainDivEl.appendChild(likeBtnEl)
    mainDivEl.appendChild(removeBtnEl)
    // mainDivEl.appendChild(likeCountEl)

    listEl.append(newListEl)
    updateLikes(likeBtnEl, likeData, postId)
    deletePosts(removeBtnEl, postId)
}


function clearListEl(){
    listEl.innerHTML = ""
}

function clearFieldEl(){
    inputFieldEl.value = ""
    fromInputFieldEl.value = "" 
    toInputFieldEl.value = "" 
}

function updateLikes(likeBtnEl, likeData, postId){
    likeBtnEl.addEventListener("click", function(){
        likeData += 1 
        let exactLocationInDb = ref(database, `posts/${postId}`)
        update(exactLocationInDb, {
            3: likeData,
        })
    })

    // likeBtnEl.addEventListener("mousedown", function() {
    //     setTimeout(function() {
    //         likeData -= 1 
    //         let exactLocationInDb = ref(database, `posts/${postId}`)
    //         update(exactLocationInDb, {
    //             3: likeData,
    //         })
    //     }, 400)
    // })
}

function deletePosts(removeBtnEl, postId){
    removeBtnEl.addEventListener("click", function() {
        if (confirm('Are you sure you want to remove this post from the database?')) {
            let exactLocationInDb = ref(database, `posts/${postId}`)
            remove(exactLocationInDb)
        } else {
            alert("has been cancelled")
        } 
    })
}