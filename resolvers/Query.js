import User from '../models/user'
import isAuthenticated from '../middleware/isAuth'

export default {
    async getUser(parent, args, { req }, info) {
        const userId = await isAuthenticated(req)
        if (!userId) {
            const error = new Error('Not authenticated')
            error.code = 401
            throw error
        }
        const user = await User.findOne({ _id: args.userId })
        if (!user) {
            const error = new Error('user not found')
            error.code = 422
            throw error
        }
        return {
            _id: args.userId,
            name: user.name,
            username: user.username,
            email: user.email,
            birthday: user.birthday,
            image: user.image,
            gender: user.image,
            joined: user.joined
        }
    }
}