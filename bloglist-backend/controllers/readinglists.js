const router = require('express').Router()
const { Readinglists } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.post('/', async (req, res) => {
    const readingListEntry = await Readinglists.create({
        userId: req.body.user_id,
        blogId: req.body.blog_id,
        read: false,
    })
    res.json(readingListEntry)
})

router.put('/:id', tokenExtractor, async (req, res) => {
    const id = req.params.id
    const readingListEntry = await Readinglists.findByPk(id)
    console.log(readingListEntry)
    
    if (readingListEntry) {
        readingListEntry.read = req.body.read
        readingListEntry.save()
        res.json(readingListEntry)
    } else {
        res.status(404).end()
    }
})

module.exports = router
