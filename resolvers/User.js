import User from '../models/user'
import Post from '../models/post'
import isAuthenticated from '../middleware/isAuth'

export default {
    async friends(parent, args, { req }, info) {
        const userId = await isAuthenticated(req)
        if (userId !== parent._id)
            return []
        const user = await User.findOne({ _id: parent._id }).select('relation -_id').populate('relation.userId', '-relation -password -__v')
        const res = []
        for (const i of user.relation)
            if (i.status === 1)
                res.push(i.userId)
        return res
    },
    async requests(parent, args, { req }, info) {
        const userId = await isAuthenticated(req)
        if (userId !== parent._id)
            return []
        const user = await User.findOne({ _id: parent._id }).select('relation -_id').populate('relation.userId', '-relation -password -__v')
        const res = []
        for (const i of user.relation)
            if (i.status === 3)
                res.push(i.userId)
        return res
    },
    async requested(parent, args, { req }, info) {
        const userId = await isAuthenticated(req)
        if (userId !== parent._id)
            return []
        const user = await User.findOne({ _id: parent._id }).select('relation -_id').populate('relation.userId', '-relation -password -__v')
        const res = []
        for (const i of user.relation)
            if (i.status === 2)
                res.push(i.userId)
        return res
    },
    async blocked(parent, args, { req }, info) {
        const userId = await isAuthenticated(req)
        if (userId !== parent._id)
            return []
        const user = await User.findOne({ _id: parent._id }).select('relation -_id').populate('relation.userId', '-relation -password -__v')
        const res = []
        for (const i of user.relation)
            if (i.status === 4)
                res.push(i.userId)
        return res
    },
    async posts(parent, args, { req }, info) {
        let obj = { creator: parent._id }
        const userId = await isAuthenticated(req)
        if (userId !== parent._id) {
            obj['public'] = true
            const users = await User.findOne({ _id: userId }).select('relation -_id')
            for (const val of users.relation)
                if (val.userId.toString() === parent._id) {
                    obj['public'] = false
                    break
                }
        }
        const posts = await Post.find(obj).select('-__v').populate('creator likes', '-relation -password -__v')
        return posts
    },
    async friendPosts(parent, args, { req }, info) {
        const userId = await isAuthenticated(req)
        if (userId !== parent._id)
            return []
        const users = await User.findOne({ _id: parent._id }).select('relation -_id')
        const friendIds = []
        for (const val of users.relation) {
            if (val.status === 1)
                friendIds.push(val.userId)
        }
        const posts = await Post.find({ creator: {$in: friendIds} }).select('-__v').populate('creator likes', '-relation -password -__v')
        return posts
    }
}