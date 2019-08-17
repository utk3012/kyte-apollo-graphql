import jwt from 'jsonwebtoken'

async function isAuthenticated(req) {
    const authHeader = req.get('Authorization')
    if (!authHeader) {
        return false
    }
    const token = authHeader.split(' ')[1]
    let decodedToken
    try {
        decodedToken = await jwt.verify(token, process.env.JWT_SECRET)
        if (!decodedToken) {
            req.isAuth = false
        }
    }
    catch (error) {
        error.status = 401
        return false
    }
    return decodedToken.userId
}

export default isAuthenticated