const express = require('express');
const Comment = require('../models/comment.model');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const totalEntries = await Comment.find({ post_id: req.params.post_id }).count().lean().exec();

        const comments = await Comment.find({ post_id: req.params.post_id }).limit(10).lean().exec();

        return res.status(200).json({ totalEntries, comments });
    }
    catch (err) {
        return res.status(400).json({ status: "failed", message: err.message })
    }
})

router.post('/', async (req, res) => {
    try {
        req.body.user_id = req?.headers?.user_id;
        req.body.post_id = req?.headers?.post_id;
        const comment = await Comment.create(req.body); 

        return res.status(201).json({ comment: comment })
    }
    catch (err) {
        return res.status(400).json({ status: "failed", message: err.message })
    }
})

router.patch('/:id', async (req, res) => {
    try {
        const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true });

        return res.status(200).json({ comment })
    }
    catch (err) {
        return res.status(400).json({ status: "failed", message: err.message })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.id);
    }
    catch (err) {
        return res.status(400).json({ status: "failed", message: err.message })
    }
})