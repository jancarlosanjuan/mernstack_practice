import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let reviews

export default class ReviewsDAO {
  static async injectDB(conn) {
    if (reviews) {
      return
    }
    try {
      reviews = await conn.db(process.env.RESTREVIEWS_NS).collection("reviews")
    } catch (e) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`)
    }
  }

  static async addReview(restaurantId, user, review, date) {
    try {
      const reviewDoc = { name: user.name,
          user_id: user._id,
          date: date,
          text: review,
          restaurant_id: ObjectId(restaurantId), }

      return await reviews.insertOne(reviewDoc)
    } catch (e) {
      console.error(`Unable to post review: ${e}`)
      return { error: e }
    }
  }

  static async updateReview(reviewId, userId, text, date) {
    try {
      const updateResponse = await reviews.updateOne(
        { user_id: userId, _id: ObjectId(reviewId)}, //get the correct userid and objectid
        { $set: { text: text, date: date  } }, //set the new text or the new date
      )

      return updateResponse
    } catch (e) {
      console.error(`Unable to update review: ${e}`)
      return { error: e }
    }
  }

  static async deleteReview(reviewId, userId) {

    try {
      const deleteResponse = await reviews.deleteOne({
        _id: ObjectId(reviewId),
        user_id: userId,
      })

      return deleteResponse
    } catch (e) {
      console.error(`Unable to delete review: ${e}`)
      return { error: e }
    }
  }

  static async getAllReviews({
      filters = null,
    } = {}) {
        
        let query
        
        if(filters){ //if there are filters
            if("name" in filters){
                query = {"name" : {$eq : filters["name"]}}
            }
        }


        let cursor
        try{
            cursor = await reviews.find()
        }
        catch(e){
            console.error('Unable to establish connection at reviews: ${e}', )
            return {}
        }

        const displayCursor = cursor.limit(10)

        try{
            const revs = await displayCursor.toArray()
            return {revs}
        }
        catch(e){
            console.error('Unable to establish connection at reviews: ${e}', )
            return {}
        }

  }

}