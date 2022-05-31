const express = require('express');
const router = express.Router();
const DepartmentController = require('../controllers/departmments.controller');

router.get('/departments', DepartmentController.getAll);
router.get('/departments/random', DepartmentController.getRandom);
router.get('/departments/:id', DepartmentController.getById);

router.post('/departments', DepartmentController.addData);

router.put('/departments/:id', DepartmentController.updateData);

router.delete('/departments/:id', DepartmentController.deleteData);

module.exports = router;
