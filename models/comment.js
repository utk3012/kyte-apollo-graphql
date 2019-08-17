const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ObjectId = mongoose.Schema.Types.ObjectId

const commentModel = new Schema({
    comment: { type: String, required: true },
    creator: { type: ObjectId, ref: 'User', require: true },
    onPost: { type: ObjectId, ref: 'Post', require: true },
    createdAt: { type: Date, default: Date.now() },
    likes: [{ type: ObjectId, ref: 'User', require: true }]
})

module.exports = mongoose.model('Comment', commentModel)