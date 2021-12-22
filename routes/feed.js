const express = require('express');

const feedController = require('../controllers/feed');

const router = express.Router();
const auth=require('../middleware/is-auth');
// GET /feed/posts
router.get('/posts', auth,feedController.getPosts);

// POST /feed/post
router.post('/post',auth,feedController.createPost);

router.get('/post/:postId',auth,feedController.getPost);

router.delete('/post/:postId',auth,feedController.deletePost);
module.exports = router;
