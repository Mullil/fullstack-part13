const { Session } = require('../models')
const router = require('express').Router()

router.delete('/', async (req, res) => {
    console.log(req.body)
    await Session.destroy({ where: { token: req.body.token } })
    return res.status(204).end()
})

module.exports = router