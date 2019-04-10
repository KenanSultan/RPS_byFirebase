// Initialize Firebase
var config = {
    apiKey: "AIzaSyCZxBqSVUwrLKe1Rko-6PAqUT38DKCFbBc",
    authDomain: "https://rsp-game-5dfd7.firebaseapp.com/",
    databaseURL: "https://rsp-game-5dfd7.firebaseio.com/",
    projectId: "rsp-game-5dfd7"
}
firebase.initializeApp(config)

var database = firebase.database()
var initial = true

class Player {
    constructor(name) {
        this.name = name
        this.wins = 0
        this.loses = 0
        this.choise = ""
    }

    change_wins() {
        this.wins += 1
    }

    change_loses() {
        this.loses += 1
    }

    set_choise(choise) {
        this.choise = choise
    }
}




database.ref().on("value", function (snap) {
    if (localStorage.getItem("name") && snap.val()) {
        local_name = JSON.parse(localStorage.getItem("name"))
        if (snap.val()[local_name] && initial === true) {
            initial === false
            database.ref().child("/" + local_name + "/").remove()
        }
    }
    console.log(snap.val())

    if (!snap.val()) {
        $("#name-btn").on("click", function () {
            name = $("#name-input").val()
            player = new Player(name)
            $("#head-div").empty()
            database.ref("/" + player.name + "/").set(
                player
            )
            console.log(snap.val())
            localStorage.setItem("name", JSON.stringify(player.name))

            $("#p-1").addClass("d-none")

            

        })


    } else if (Object.keys(snap.val()).length == 1) {
        be_second()
    } else if (Object.keys(snap.val()).length == 2) {
        no_place()
    }
})

function be_first() {

}

function be_second() {
    $("#name-btn").on("click", function () {
        players = 1
        name = $("#name-input").val()
        player = new Player(name)
        $("#head-div").empty()

        database.ref("/" + player.name + "/").set(
            player
        )
        database.ref().set({
            players: players + 1
        })

        localStorage.setItem("name", JSON.stringify(player.name))
    })
}

function no_place() {
    console.log("no place")
}