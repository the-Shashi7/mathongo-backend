const mongoose = require("mongoose");
const { Schema } = mongoose;

const urlSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
  },
  UserId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },
},{timestamps:true },);
module.exports = mongoose.model("Url", urlSchema);
