$(document).ready(function () {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCZxBqSVUwrLKe1Rko-6PAqUT38DKCFbBc",
        authDomain: "https://rsp-game-5dfd7.firebaseapp.com/",
        databaseURL: "https://rsp-game-5dfd7.firebaseio.com/",
        projectId: "rsp-game-5dfd7"
    }
    firebase.initializeApp(config)

    var database = firebase.database()

    // Player cixish eliyende de sehife guncellenende de oyuncu silinsin
    window.onbeforeunload = closingCode
    function closingCode() {
        if (localStorage.getItem("player")) {
            database.ref("room").update({
                turn: 0
            })
            var player = localStorage.getItem("player")
            database.ref("room/" + player).update({
                name: "",
                wins: 0,
                loses: 0,
                choise: ""
            })
            localStorage.removeItem("player")
        }
        return null;
    }
    var player_order = 0
    // oyuncularin melumatlarini display elemek ucun
    database.ref("room").on("value", function (snap) {
        // For third user
        if (snap.val().player1.name && snap.val().player2.name) {
            $("#input-nm").addClass("d-none")
        } else if (player_order == 0) {
            $("#input-nm").removeClass("d-none")
        }

        $("#wins1").text(snap.val().player1.wins)
        $("#loses1").text(snap.val().player1.loses)
        $("#wins2").text(snap.val().player2.wins)
        $("#loses2").text(snap.val().player2.loses)

        if (snap.val().player1.name) {
            $("#p1-name h3").text(snap.val().player1.name)
            $("#p1-waiting").hide()
            $("#win-los1").removeClass("d-none")
        } else {
            $("#p1-name h3").text("")
            $("#p1-waiting").show()
            $("#win-los1").addClass("d-none")
        }

        if (snap.val().player2.name) {
            $("#p2-name h3").text(snap.val().player2.name)
            $("#p2-waiting").hide()
            $("#win-los2").removeClass("d-none")
        } else {
            $("#p2-name h3").text("")
            $("#p2-waiting").show()
            $("#win-los2").addClass("d-none")
        }

        if (snap.val().turn == 1) {
            // For message privacy
            if (player_order == 1 || player_order == 2) {
                $("#chat-div").removeClass("d-none")
            }
            $("#current1 h2").text("")
            $("#current2 h2").text("")
            $("#center-div h2").text("")
            $("#left-div").addClass("border border-warning")
            if (player_order == 1) {
                $("#p1-choises").removeClass("d-none")
                $("#top-info").text("It is your turn!")
            } else if (player_order == 2) {
                $("#top-info").text("Waiting for " + snap.val().player1.name + " to choose.")
            }

        } else if (snap.val().turn == 2) {
            $("#left-div").removeClass("border border-warning")
            $("#right-div").addClass("border border-warning")
            if (player_order == 1) {
                $("#p1-choises").addClass("d-none")
                $("#top-info").text("Waiting for " + snap.val().player2.name + " to choose.")
            } else if (player_order == 2) {
                $("#p2-choises").removeClass("d-none")
                $("#top-info").text("It is your turn!")
            }

        } else if (snap.val().turn == 3) {
            $("#top-info").text("")
            giveResult()
        } else if (snap.val().turn == 0) {
            $("#top-info").text("")
            $("#left-div").removeClass("border border-warning")
            $("#right-div").removeClass("border border-warning")

            $("#p1-choises").addClass("d-none")
            $("#p2-choises").addClass("d-none")
        }
    })

    // neticeni gosteren funcsiya
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

            if (p1 == "Rock" && p2 == "Scissors" || p1 == "Scissors" && p2 == "Paper" || p1 == "Paper" && p2 == "Rock") {
                $("#center-div h2").text(name1 + " Wins!")
                $("#current1 h2").text(p1)
                $("#current2 h2").text(p2)
                database.ref("room/player1").update({
                    wins: p1wins,
                    choise: ""
                })
                database.ref("room/player2").update({
                    loses: p2loses,
                    choise: ""
                })
                setTimeout(turn, 2000)
            } else if (p2 == "Rock" && p1 == "Scissors" || p2 == "Scissors" && p1 == "Paper" || p2 == "Paper" && p1 == "Rock") {
                $("#center-div h2").text(name2 + " Wins!")
                $("#current1 h2").text(p1)
                $("#current2 h2").text(p2)
                database.ref("room/player1").update({
                    loses: p1loses,
                    choise: ""
                })
                database.ref("room/player2").update({
                    wins: p2wins,
                    choise: ""
                })
                setTimeout(turn, 2000)
            } else if (p1 == "Rock" || p1 == "Paper" || p1 == "Scissors") {
                $("#center-div h2").text("Tie Game!")
                $("#current1 h2").text(p1)
                $("#current2 h2").text(p2)
                setTimeout(turn, 2000)
            }

            function turn() {
                database.ref('room').update({
                    turn: 1
                })
            }
        })
    }

    // Mesajlari ekrana yazdiran funksiya
    database.ref("room/messages").on("value", function (snap) {
        var arr = snap.val()
        $(".chat").empty()
        var height = 0
        for (i in arr) {
            if (arr[i].p1) {
                let p = $("<p>").text(arr[i].p1)
                p.addClass("text-left mb-0")
                $(".chat").append(p)
                height += 30
            } else if (arr[i].p2) {
                let p = $("<p>").text(arr[i].p2)
                p.addClass("text-primary text-right mb-0")
                $(".chat").append(p)
                height += 30
            }
            $(".chat").scrollTop(height)
        }
    })

    // Oyuna girish elemekcin ad daxil etmek
    $("#name-btn").on("click", function () {
        database.ref("room").once("value", function (snap) {
            name = $("#name-input").val()
            $("#name-input").val("")
            if (!snap.val().player1.name) {
                player_order = 1
                database.ref("room/player1").update({
                    name
                })
                localStorage.setItem("player", "player1")
                $("#input-nm").addClass("d-none")
                $("#own-name").text(name)
                $("#own-player").text(1)
                $("#info-div").removeClass("d-none")
                if (snap.val().player2.name) {
                    database.ref("room").update({
                        turn: 1,
                        messages: ""
                    })
                }
            } else if (!snap.val().player2.name) {
                player_order = 2
                database.ref("room/player2").update({
                    name
                })
                database.ref("room").update({
                    turn: 1,
                    messages: ""
                })
                localStorage.setItem("player", "player2")
                $("#input-nm").addClass("d-none")
                $("#own-name").text(name)
                $("#own-player").text(2)
                $("#info-div").removeClass("d-none")
            }
        })
    })

    // Player1'in oyunda secimi
    $(".p1-ch").on("click", function () {
        database.ref('room').update({
            turn: 2
        })

        var choise = $(this).text()
        if (player_order == 1) {
            $("#current1 h2").text(choise)
        }

        database.ref("room/player1").update({
            choise
        })
    })

    // Player2'nin oyunda secimi
    $(".p2-ch").on("click", function () {
        var choise = $(this).text()

        database.ref("room/player2").update({
            choise
        })

        database.ref('room').update({
            turn: 3
        })

    })

    // Mesaj yazmaq ucun
    $("form").on("submit", function (event) {
        event.preventDefault()
        var msg = $("#msg").val()
        $("#msg").val("")
        if (player_order == 1) {
            database.ref("room/messages").push({
                p1: msg
            })
        } else if (player_order == 2) {
            database.ref("room/messages").push({
                p2: msg
            })
        }
    })
})