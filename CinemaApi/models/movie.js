const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema

const movieSchema = new mongoose.Schema({
    title:{
        type:String,
        minlength:4,
        maxlength:40,
        required:true
    },
    runtime:{
       type:String,
   },
   director:{
       type:String,
   },
   type:{
       type:String,
   }
   ,
   releaseYear:{
       type:String,
   },
   releaseMonth:{
       type:String,
   },
   releaseDay:{
       type:String,
   },
   description:{
   type:String,
   required:true
   },
   postedBy:{
       type: ObjectId,
       ref:"Cinema"
   },
   photo:{
       data:Buffer,
       contentType: String
   }
})

module.exports = mongoose.model('Movie', movieSchema)

/* {
    "title": "movie tile",
    "runtime": " movie runtime",
    "director": "lahceneESI@dergham.com",
    "type": "movie director",
    "releaseYear": "movie releaseYear",
    "releaseMonth": "movie releaseMonth",
    "releaseDay": "movie releaseDay",
   "description": "movie description"
}
*/