const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ObjectId = mongoose.Schema.Types.ObjectId

const postModel = new Schema({
    post: { type: String, required: true },
    creator: { type: ObjectId, ref: 'User', require: true },
    public: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now() },
    likes: [{ type: ObjectId, ref: 'User', require: true }]
})

module.exports = mongoose.model('Post', postModel)