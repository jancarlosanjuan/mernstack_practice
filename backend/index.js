import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"

import restaurantsDAO from "./dao/restaurantsDAO.js"
import RestaurantsDAO from "./dao/restaurantsDAO.js"

//setup
dotenv.config()
const MongoClient = mongodb.MongoClient
const port = process.env.PORT || 8000 //access .env using process.env.<variablename>

//connect to db
//URI, options{}
MongoClient.connect(
    process.env.RESTREVIEWS_DB_URI,
    {
        maxPoolSize : 50, //only 50 people can connect at a time
        wtimeoutMS : 2500, //every 2500 ms request will timeout
        useNewUrlParser : true
    }
    )

    .catch(
        err => {
            console.log(err.stack)
            process.exit(1)
        }
    )

    .then(
        async client => {
            await RestaurantsDAO.injectDB(client)
            app.listen(port, () => { //how we start webserver
                console.log('listening on port ${port}')
            })
        }
    )
