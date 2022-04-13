import express from "express"
import cors from "cors"
import restaurants from "./api/restaurants.route.js"

const app = express()

//apply middleware (cors)
app.use(cors())
app.use(express.json()) //server can accept json in the body of a request (get, fetch etc....)

app.use("/api/v1/restaurants", restaurants) //api directory, route
app.use("*", (req, res) => res.status(404).json({error: "not found"})) //* is a wildcard, if someone goes to other routes that does not exist, return something

export default app