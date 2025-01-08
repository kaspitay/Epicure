const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const requireAuth = async (req, res, next) => {
    //verify authorization header
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ error: 'You must be logged in' });
    }
    const token = authorization.split(' ')[1];
    try{
        const {_id} = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById({_id}).select('_id');
        next();
    } catch (err) {
        return res.status(401).json({ error: 'You must be logged in' });
    }}

module.exports = requireAuth;