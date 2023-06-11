const router = require('express').Router();
const userRoutes = require('./users');
const timeLoggerMiddleware = require('../middlewares/timeLogger');


router.get('/', (req, res) => {
    res.send('hello world!');
})

router.use('/users', userRoutes);
router.use('/profiles', timeLoggerMiddleware);
router.use('/profiles', userRoutes);


// router.use(cardRoutes);

module.exports = router;