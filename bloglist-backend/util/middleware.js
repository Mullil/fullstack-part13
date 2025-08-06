const { User, Session } = require('../models')
const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const token = authorization.substring(7)
      req.decodedToken = jwt.verify(token, SECRET)
      const session = await Session.findOne({ where: { token } })
      if (!session) {
        return res.status(401).json({ error: 'session not found' })
      }
      const user = await User.findByPk(req.decodedToken.id)
      if (user.disabled) {
        await Session.destroy({ where: { user_id: user.id } })
        return res.status(403).json({ error: 'account is disabled' })
      }
      req.user = user
    } catch (error){
      console.log(error)
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

module.exports = { tokenExtractor }