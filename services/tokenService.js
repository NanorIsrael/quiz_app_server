

function generateToken(userId, expires, type) {
    const secret = process.env.JWT_SECRET
    const payload ={
        accountId: userId,
        iat: DateTime.now().toSeconds(),
        exp: expires.toSeconds(),
        type
    }
    return jwt.sign(payload, secret);
}