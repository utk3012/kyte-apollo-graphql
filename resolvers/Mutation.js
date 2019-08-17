import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

import User from '../models/user'
import Post from '../models/post'
import isAuthenticated from '../middleware/isAuth'

export default {
    async registerUser(parent, { registerUserInput }, ctx, info) {
        const email = registerUserInput.email
        // const username = registerUserInput.username
        const existingUser = await User.findOne({ email: email })
        if (existingUser) {
            const error = new Error('User exists already')
            throw error
        }
        const hashpw = await bcryptjs.hash(registerUserInput.password, 12)
        const user = new User({
            name: registerUserInput.name,
            email: registerUserInput.email,
            username: registerUserInput.username,
            password: hashpw,
            birthday: registerUserInput.birthday,
            image: registerUserInput.image,
            gender: registerUserInput.gender
        })
        await user.save()
        return {
            message: 'User registered',
            success: 1
        }
    },
    async loginUser(parent, args, ctx, info) {
        const email = args.email
        const user = await User.findOne({ email: email })
        if (!user) {
            const error = new Error('User does not exist')
            throw error
        }
        const isValid = await bcryptjs.compare(args.password, user.password)
        if (!isValid) {
            const error = new Error('Invalid password')
            error.code = 401
            throw error
        }
        const token = jwt.sign({
            email: args.email,
            userId: user._id
        }, process.env.JWT_SECRET, { expiresIn: '12h' })
        return {
            token: token,
            message: 'logged in'
        }
    },
    async createPost(parent, args, { req }, info) {
        const userId = await isAuthenticated(req)
        if (!userId) {
            const error = new Error('Not authenticated')
            error.code = 401
            throw error
        }
        const post = new Post({
            creator: userId,
            post: args.post,
            public: args.public
        })
        await post.save()
        return {
            message: 'post created',
            success: 1
        }
    },
    async sendRequest(parent, args, { req }, info) {
        const userId = await isAuthenticated(req)
        if (!userId) {
            const error = new Error('Not authenticated')
            error.code = 401
            throw error
        }
        if (userId === args.userId) {
            const error = new Error('Same user')
            error.code = 403
            throw error
        }
        const userExists = await User.findById(args.userId)
        if (!userExists) {
            const error = new Error('User not found')
            error.code = 422
            throw error
        }
        const user1 = await User.findOne({_id: userId, "relation.userId": args.userId}, 'relation')
        if (user1) {
            const error = new Error('Cannot send request')
            error.code = 422
            throw error
        }
        await User.updateOne({ _id: userId }, {$push: {relation: { userId: args.userId, status: 2 }}})
        await User.updateOne({ _id: args.userId }, {$push: {relation: { userId: userId, status: 3 }}})
        return {
            message: 'request sent',
            success: 1
        }
    },
    async acceptRequest(parent, args, { req }, info) {
        const userId = await isAuthenticated(req)
        if (!userId) {
            const error = new Error('Not authenticated')
            error.code = 401
            throw error
        }
        if (userId === args.userId) {
            const error = new Error('Same user')
            error.code = 403
            throw error
        }
        const user1 = await User.findOne({_id: userId, relation: {$elemMatch: { userId: args.userId, status: 3 }}}, 'relation')
        if (!user1) {
            const error = new Error('friend req not found')
            error.code = 422
            throw error
        }
        await User.updateOne({_id: userId, relation: {$elemMatch: { userId: args.userId, status: 3 }}}, {$set: {"relation.$.status": 1 }})
        await User.updateOne({_id: args.userId, relation: {$elemMatch: { userId: userId, status: 2 }}}, {$set: {"relation.$.status": 1 }})
        return {
            message: 'request accepted',
            success: 1
        }
    }
}