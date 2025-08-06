const router = require('express').Router()
const { Op } = require('sequelize')
const { Blog, User, Readinglists } = require('../models')
const { tokenExtractor } = require('../util/middleware')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.get('/', async (req, res) => {
  let where = {}

  if (req.query.search) {
    where = {
      [Op.or]: [
        { title: {
            [Op.substring]: req.query.search} },
        { author: {
            [Op.substring]: req.query.search }}
      ]
    }
  }
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name', 'id', 'username']
    },
    order: [
      ['likes', 'Desc']
    ],
    where
  })
  res.json(blogs)
})

router.delete('/:id', blogFinder, tokenExtractor, async (req, res) => {
  if (!req.blog) {
    return res.status(404).json({ error: 'blog not found' })
  }

  if (req.user.id !== req.blog.userId) {
    return res.status(403).json({ error: 'forbidden: not the blog owner' })
  }
  await Readinglists.destroy({ where: { blog_id: req.blog.id } })
  await req.blog.destroy()
  return res.status(204).end()
})

router.post('/', tokenExtractor, async (req, res) => {
    console.log(req.body.blogObject)
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({...req.body.blogObject, userId: user.id, date: new Date()})
    res.json({
      ...blog.toJSON(),
      user: {
        id: user.id,
        username: user.username,
        name: user.name
      }
    })
  }
)

router.put('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    req.blog.likes = req.body.likes
    await req.blog.save()
    const updatedBlog = await Blog.findByPk(req.blog.id, {
      include: {
        model: User,
        attributes: ['name', 'id', 'username']
      }
    })
    res.json(updatedBlog)
  } else {
    res.status(404).end()
  }
})

module.exports = router