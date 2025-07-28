const router = require("express").Router();
const { authenticate } = require('../middlewares/authMiddleware');
 const { postContent , getPosts , UpdateContent ,DeleteContent } = require('../controllers/postController')
router.post('/', authenticate, postContent);
router.get('/', authenticate, getPosts);
router.put('/:id', authenticate, UpdateContent);
router.delete('/:id', authenticate, DeleteContent);
module.exports = router;