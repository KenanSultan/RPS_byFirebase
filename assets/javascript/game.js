// Initialize Firebase
$(document).ready(function () {

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

        database.ref("room/" + player).update({
            name: "",
            wins: 0,
            loses: 0,
            choise: ""
        })

        localStorage.removeItem("player")
    }

    window.onbeforeunload = closingCode
    function closingCode() {
        if (localStorage.getItem("player")) {
            var player = localStorage.getItem("player")
            database.ref("room/" + player).update({
                name: "",
                wins: 0,
                loses: 0,
                choise: ""
            })
        }
        return null;
    }



    database.ref("room").on("value", function (snap) {
        if (snap.val().player1.name) {
            $("#wins1").text(snap.val().player1.wins)
            $("#loses1").text(snap.val().player1.loses)
            $("#p1-name h3").text(snap.val().player1.name)
            $("#p-1").hide()
            $("#win-los1").removeClass("d-none")
        } else {

            $("#wins1").text(snap.val().player1.wins)
            $("#loses1").text(snap.val().player1.loses)
            $("#p1-name h3").text("")
            $("#p-1").show()
            $("#win-los1").addClass("d-none")
            database.ref("room").update({
                turn: 0
            })
            $("#left-div").removeClass("border border-warning")
        }

        if (snap.val().player2.name) {
            $("#wins2").text(snap.val().player2.wins)
            $("#loses2").text(snap.val().player2.loses)
            $("#p2-name h3").text(snap.val().player2.name)
            $("#p-2").hide()
            $("#win-los2").removeClass("d-none")
        } else {
            $("#wins2").text(snap.val().player1.wins)
            $("#loses2").text(snap.val().player1.loses)
            $("#p2-name h3").text("")
            $("#p-2").show()
            $("#win-los2").addClass("d-none")
            database.ref("room").update({
                turn: 0
            })
            $("#right-div").removeClass("border border-warning")
        }

        if (snap.val().player1.name && snap.val().player2.name && !snap.val().turn) {
            database.ref("room").update({
                messages: ""
            })
            $("#chat-div").removeClass("d-none")
            database.ref("room").update({
                turn: 1
            })
        }

        if (snap.val().turn == 1) {
            $("#current1 h2").text("")
            $("#current2 h2").text("")
            $("#center-div h2").text("")
            $("#left-div").addClass("border border-warning")
            if (pl == 1) {
                $("#p1-choises").removeClass("d-none")
            }

        } else if (snap.val().turn == 2) {
            $("#left-div").removeClass("border border-warning")
            $("#right-div").addClass("border border-warning")
            if (pl == 1) {
                $("#p1-choises").addClass("d-none")
            } else if (pl == 2) {
                $("#p2-choises").removeClass("d-none")
            }

        } else if (snap.val().turn == 3) {
            giveResult()
        }
    })

    function giveResult() {
        $("#right-div").removeClass("border border-warning")
        $("#p2-choises").addClass("d-none")
        database.ref("room").once("value", function (snap) {

            var p1 = snap.val().player1.choise
            var p2 = snap.val().player2.choise
            var name1 = snap.val().player1.name
            var name2 = snap.val().player2.name
            var p1wins = snap.val().player1.wins + 1
            var p1loses = snap.val().player1.loses + 1
            var p2wins = snap.val().player2.wins + 1
            var p2loses = snap.val().player2.loses + 1

            $("#current1 h2").text(p1)
            $("#current2 h2").text(p2)

            if (p1 == "Rock" && p2 == "Scissors" || p1 == "Scissors" && p2 == "Paper" || p1 == "Paper" && p2 == "Rock") {
                $("#center-div h2").text(name1 + " Wins!")
                database.ref("room/player1").update({
                    wins: p1wins,
                    choise: ""
                })
                database.ref("room/player2").update({
                    loses: p2loses,
                    choise: ""
                })
            } else if (p2 == "Rock" && p1 == "Scissors" || p2 == "Scissors" && p1 == "Paper" || p2 == "Paper" && p1 == "Rock") {
                $("#center-div h2").text(name2 + " Wins!")
                database.ref("room/player1").update({
                    loses: p1loses,
                    choise: ""
                })
                database.ref("room/player2").update({
                    wins: p2wins,
                    choise: ""
                })
            } else if (p1 == "Rock" || p1 == "Paper" || p1 == "Scissors") {
                $("#center-div h2").text("Tie Game!")
            }

            setTimeout(function () {
                database.ref('room').update({
                    turn: 1
                })
            }, 3000)

        })
    }

    database.ref("room/messages").on("value", function (snap) {
        var arr = snap.val()
        $(".chat").empty()
        for (i in arr) {
            if (arr[i].p1) {
                let p = $("<p>").text(arr[i].p1)
                p.addClass("text-left mb-0")
                $(".chat").append(p)
            } else if (arr[i].p2) {
                let p = $("<p>").text(arr[i].p2)
                p.addClass("text-primary text-right mb-0")
                $(".chat").append(p)
            }


        }
    })

    $("#name-btn").on("click", function () {
        database.ref("room").once("value", function (snap) {
            name = $("#name-input").val()
            $("#name-input").val("")
            if (!snap.val().player1.name) {
                database.ref("room/player1").update({
                    name
                })
                localStorage.setItem("player", "player1")
                pl = 1
                $("#input-nm").addClass("d-none")
                $("#own-name").text(name)
                $("#own-player").text(1)
                $("#info-div").removeClass("d-none")
            } else if (!snap.val().player2.name) {
                database.ref("room/player2").update({
                    name
                })
                localStorage.setItem("player", "player2")
                pl = 2
                $("#input-nm").addClass("d-none")
                $("#own-name").text(name)
                $("#own-player").text(2)
                $("#info-div").removeClass("d-none")
            }

        })

    })

    $(".p1-ch").on("click", function () {
        database.ref('room').update({
            turn: 2
        })
        var choise = $(this).text()
        if (pl == 1) {
            $("#current1 h2").text(choise)
        }


        database.ref("room/player1").update({
            choise
        })
    })

    $(".p2-ch").on("click", function () {
        var choise = $(this).text()

        database.ref("room/player2").update({
            choise
        })

        database.ref('room').update({
            turn: 3
        })

    })

    $("#send-msg").on("click", function () {
        var msg = $("#msg").val()
        $("#msg").val("")
        if (pl == 1) {
            database.ref("room/messages").push({
                p1: msg
            })
        } else if (pl == 2) {
            database.ref("room/messages").push({
                p2: msg
            })
        }

    })

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
