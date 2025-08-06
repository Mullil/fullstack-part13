const { tokenExtractor } = require('../util/middleware')
const { Session } = require('../models')
const router = require('express').Router()

router.delete('/', tokenExtractor, async (req, res) => {
    await Session.destroy({ where: { user_id: req.user.id } })
})

module.exports = router