// Initialize Firebase
$(document).ready(function() {

    var config = {
        apiKey: "AIzaSyCZxBqSVUwrLKe1Rko-6PAqUT38DKCFbBc",
        authDomain: "https://rsp-game-5dfd7.firebaseapp.com/",
        databaseURL: "https://rsp-game-5dfd7.firebaseio.com/",
        projectId: "rsp-game-5dfd7"
    }
    firebase.initializeApp(config)
    
    var database = firebase.database()

    if (localStorage.getItem("player")) {
        var player = localStorage.getItem("player")

        database.ref("room/"+player).update({
            name : ""
        })

        localStorage.removeItem("player")
    }
    
    
    
    database.ref("room").on("value", function (snap) {
        if (!snap.val().player1.name) {
            add_player1()
        } else if (!snap.val().player2.name) {
            add_player2()
        } else {
            places_full()
        }
    })
    
    function add_player1() {
        $(".input-group").removeClass("d-none")
        $("#name-btn").on("click", function() {
            name = $("#name-input").val()
            database.ref("room/player1").update({
                name
            })
            localStorage.setItem("player", "player1")
            $(".input-group").addClass("d-none")
            $("#own-name").text(name)
            $("#own-player").text(1)
            $("#info-div").removeClass("d-none")
        })
    }
    
    function add_player2() {
        $(".input-group").removeClass("d-none")
        $("#name-btn").on("click", function() {
            name = $("#name-input").val()
            database.ref("room/player2").update({
                name
            })
            localStorage.setItem("player", "player2")
            $(".input-group").addClass("d-none")
            $("#own-name").text(name)
            $("#own-player").text(2)
            $("#info-div").removeClass("d-none")
        })
    }
    
    function places_full() {
    
    }
})


/*class Player {
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
    if (snap.val().step==0) {
        create_player1()
    } else if (snap.val().step==1) {
        create_player2()
    } else if (snap.val().step==2) {
        player1_turn()
    } else if (snap.val().step==3) {
        player2_turn()
    }

    function create_player1() {
        $("#name-btn").on("click", function () {
            name = $("#name-input").val()
            player = new Player(name)
            $("#head-div").empty()
            database.ref("/players/0").set({
                name: player.name,
                choises : "",
                wins: 0,
                loses: 0
            })
            $("#p-1").addClass("d-none")
            $("#p1-name").removeClass("d-none")
            $("#p1-name h3").text(snap.val().player.name)
            $("#win-los").removeClass("d-none")
            $("#wins1").text(snap.val().player.wins)
            $("#loses1").text(snap.val().player.loses)
        })
    }

    function create_player2() {

    }

    function player1_turn() {

    }

    function player2_turn() {

    }
})

    if (localStorage.getItem("name") && snap.val()) {
        local_name = JSON.parse(localStorage.getItem("name"))
        if (snap.val()[local_name] && initial === true) {
            database.ref().child("/" + local_name + "/").remove()
        }
    }

    console.log(snap.val())

    if (!snap.val()) {
        new_player()
    } else if (Object.keys(snap.val()).length == 1) {
        be_second()
    } else if (Object.keys(snap.val()).length == 2) {
        no_place()
    }

    function new_player() {
        $("#name-btn").on("click", function () {
            name = $("#name-input").val()
            player = new Player(name)
            $("#head-div").empty()
            database.ref("/" + player.name + "/").set(
                player
            )
            console.log("test"+snap.val())
            localStorage.setItem("name", JSON.stringify(player.name))

            $("#p-1").addClass("d-none")
        })
    }*/
