const router = require('express').Router()
const { Op } = require('sequelize')
const { User, Blog, Readlists } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
        model: Blog,
        attributes: ['title', 'author', 'id', 'url']
    }
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  const user = await User.create(req.body)
  res.json(user)
})

router.put('/:username', async (req, res) => {
  const username = req.params.username
  const user = await User.findOne({
    where: {
      username: username
    }
  })
  if (user) {
    user.username = req.body.username
    await user.save()
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.get('/:id', async (req, res) => {
  let where = {}
  console.log(req.query.read)
  if (req.query.read) {
    const val = req.query.read === 'true'
    where = {
      read: { [Op.is]: val },
    }
  }
  const userId = req.params.id
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['id', 'createdAt', 'updatedAt'] },
    include: {
      model: Blog,
      as: 'readings',
      attributes: {
        exclude: ['userId']
      },
      through: {
        model: Readlists,
        as: 'readinglists',
        attributes: ['read', 'id'],
        where
      },
    },
  })

  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router