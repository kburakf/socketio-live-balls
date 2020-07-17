app.controller("indexController", ["$scope", "indexFactory", ($scope, indexFactory) => {

    $scope.messages = []
    $scope.players = {}

    $scope.init = () => {
        const username = prompt("Please enter username")

        if (username)
            initSocket(username)
        else
            return false
    }

    function showBubble(id, message) {
        $("#" + id).find(".message").show().html(message)

        setTimeout(() => {
            $("#" + id).find(".message").hide()
        }, 2000)
    }

    function scrollTop() {
        setTimeout(() => {
            const element = document.getElementById("chat-area")
            element.scrollTop = element.scrollHeight
        })
    }

    async function initSocket(username) {
        const connectionOptions = {
            reconnectionAttempts: 3,
            reconnectionDelay: 600
        }

        try {
            const url = "http://localhost:3500"
            const socket = await indexFactory.connectSocket(url, connectionOptions)

            socket.emit("newUser", {
                username
            })

            socket.on("initPlayers", players => {
                $scope.players = players
                $scope.$apply()
            })

            socket.on("newUser", data => {
                const messageData = {
                    type: {
                        code: 0,
                        message: 1
                    },
                    username: data.username
                }
                $scope.messages.push(messageData)
                $scope.players[data.id] = data
                scrollTop()
                $scope.$apply()
            })
            socket.on("disUser", data => {
                const messageData = {
                    type: {
                        code: 0,
                        message: 0
                    },
                    username: data.username
                }
                $scope.messages.push(messageData)
                delete $scope.players[data.id]
                scrollTop()
                $scope.$apply()
            })

            socket.on("animate", data => {
                $("#" + data.socketId).animate({
                    "left": data.x,
                    "top": data.y
                }, () => {
                    animate = false
                })
            })

            socket.on('newMessage', message => {
                $scope.messages.push(message);
                $scope.$apply();
                showBubble(message.socketId, message.text)
                scrollTop();
            });

            let animate = false
            $scope.onClickPlayer = $event => {
                if (!animate) {
                    let x = $event.offsetX
                    let y = $event.offsetY

                    socket.emit("animate", {
                        x,
                        y
                    })

                    animate = true
                    $("#" + socket.id).animate({
                        "left": x,
                        "top": y
                    }, () => {
                        animate = false
                    })
                }
            }
            $scope.newMessage = () => {
                let message = $scope.message
                const messageData = {
                    type: {
                        code: 1,
                    },
                    username: username,
                    text: message
                }
                $scope.messages.push(messageData)
                $scope.message = ""

                socket.emit("newMessage", messageData)

                showBubble(socket.id, message)
                scrollTop()
            }
        } catch (e) {
            console.log("ehehe patladı")
        }
    }
}])