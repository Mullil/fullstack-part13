const Blog = require('./blog')
const User = require('./user')
const Readinglists = require('./readinglist')
const Session = require('./session')

User.hasMany(Blog)
Blog.belongsTo(User)

User.hasOne(Session)
Session.belongsTo(User)

User.belongsToMany(Blog, {
  through: { model: Readinglists, as: 'readinglist' },
  as: 'readings'
})

Blog.belongsToMany(User, { through: Readinglists, as: 'usersMarked' })

module.exports = {
  Blog, User, Readinglists, Session
}