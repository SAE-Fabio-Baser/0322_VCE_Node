const express = require("express")
const { MongoClient } = require("mongodb")

const url = "mongodb://root:root@mongo:27017/"

const app = express()
const dbClient = new MongoClient(url)

app.get("/", (req, res) => {
    res.sendStatus(200)
})

app.listen(3000, () => {
    console.log("Server started")

    dbClient
        .connect()
        .catch(console.error)
        .then(async () => {
            console.log("Connected to DB")
            const db = dbClient.db("sae")
            const users = db.collection("users")

            const allUsersCursor = users.find({})

            console.log(await allUsersCursor.toArray())
        })
})