let restaurants

export default class RestaurantsDAO { 
    static async injectDB(conn){//indectDB - initially connect to DB, will get called as soon as the server starts
        if(restaurants){
            return
        }

        try{
            restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection("restaurants")
        }
        catch(e){
            console.error(
                'unable to establish connection handle in restaurantsDAO: ${e}'
            )
        }
    }

    static async getRestaurants({
        filters = null, //get what we want exactly when called
        page = 0, //lotsa pages so get what we only need
        restaurantsPerPage = 20,
    } = {}) {
        let query
        if(filters){
            if("name" in filters){//search for name// this doesnt work, you have to add index in mongodb atlas so that any name you search with "$text" (like "food") will pop up ("all about food", "Food NY")
                query = {$text: {$search: filters["name"]}} //theres no database field here
            }
            else if ("cuisine" in filters){
                query = {"cuisine": {$eq: filters["cuisine"]}} //
            }
            else if ("zipcode" in filters){
                query = {"address.zipcode": {$eq: filters["zipcode"]}} //"address.zipcode" is a database field. $eq means that there is a field exactly like that
            }
        }

        let cursor
        try{
            cursor = await restaurants
            .find(query)
        }
        catch(e){
            console.error('Unable to issue find command, ${e}')
            return { restaurantsList: [], totalNumRestaurants: 0}
        }

        const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page)

        try{
            const restaurantsList = await displayCursor.toArray()
            const totalNumRestaurants = await restaurants.countDocuments(query)

            return {restaurantsList, totalNumRestaurants}
        }
        catch(e){
            console.error('Unable to convert cursor to array or problem counting documents, ${e}',)
            return {restaurantsList: [], totalNumRestaurants: 0}
        }

    }

}