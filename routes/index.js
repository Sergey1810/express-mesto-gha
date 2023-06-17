const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');



router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
route.use('*', function(req, res) {
        return res.status(404).send({ message: "Не корректный путь" });
} )





module.exports = router;