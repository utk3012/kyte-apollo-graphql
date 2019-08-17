const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ObjectId = mongoose.Schema.Types.ObjectId

const userModel = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    image: String,
    birthday: { type: Date, required: true },
    gender: { type: String, required: true },
    joined: { type: Date, default: Date.now() },
    relation: [{
        userId: { type: ObjectId, ref: 'User', required: true },
        status: { type: Number, required: true },
        createdAt: { type: Date, default: Date.now() },
        updatedAt: { type: Date, default: Date.now() }
    }]
})

/*
0: unknown
1: friends
2: requested
3: received request
4: blocked
5: blocked by
*/


module.exports = mongoose.model('User', userModel)