import React, {useEffect, useState} from "react"
import {createRoot} from "react-dom/client.js";
import {io} from "socket.io-client"
import {Card, Input, Button, Feed} from "semantic-ui-react";

const App = () => {

    const [socket, setSocket] = useState(null)

    const [isJoined, setIsJoined] = useState(false)
    const [username, setUsername] = useState("")
    const [newMessage, setNewMessage] = useState("")
    const [sentMessages, setSentMessages] = useState([])

    useEffect(() => {
        const newSocket = io("http://localhost:3000")
        newSocket.connect()
        window.sock = newSocket
        setSocket(newSocket)

        newSocket.on("playerJoined", console.log)
        newSocket.on("newMessage", setSentMessages)
    }, [])

    const join = () => {
        socket.emit("join", {username})
        setIsJoined(true)
    }

    const sendMessage = () => {
        socket.emit("message", {
            sender: { username },
            content: newMessage})
        setNewMessage("")
    }

    return (
        <>
            <Card style={{margin: "2rem"}}>
                <Input
                    placeholder={"Username"}
                    value={username}
                    onChange={(e, props) => setUsername(props.value)}
                    action={{content: "Join", onClick: join}}/>
            </Card>
            {isJoined && (<Card style={{margin: "2rem", padding: "1rem"}}>
                <Feed>
                    {sentMessages.map(message => (
                        <Feed.Event key={message.id}>
                            <Feed.Label image={`https://avatar.tobi.sh/${message.sender.username}.svg?text=${message.sender.username.substring(0, 2).toUpperCase()}`}/>
                            <Feed.Content>
                                <Feed.Date>{message.sender.username}</Feed.Date>
                                {message.content}
                            </Feed.Content>
                        </Feed.Event>)
                    )}
                </Feed>
                <Input
                    value={newMessage}
                    onChange={(e, props) => setNewMessage(props.value)}
                    placeholder="new message"
                    action={{icon: "send", onClick: sendMessage}}/>
            </Card>)}
        </>
    )
}


const root = createRoot(document.querySelector("#app"))
root.render(<App/>)