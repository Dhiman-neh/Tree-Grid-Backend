const express = require('express');
var router = express.Router();
const handler = require('../controllers/handler');
router.post('/add/headerdata',handler.addHeaderData);
router.delete('/removeHeader/:id',handler.removeHeader);
router.get('/get/headers',handler.getHeaders);
router.get('/get/headerData/:id',handler.getHeaderData);
router.put('/edit/headerData/:id',handler.editHeaderData);
router.get('/get/tasks',handler.getTasks);
router.get('/get/task/:id',handler.getTask);
router.post('/add/task',handler.createTask);
router.post('/add/subTask/:taskid',handler.createSubTask);
router.post('/add/taskproperty/:id',handler.addProperty);
router.post('/add/subtaskproperty/:taskid/:subtaskid',handler.addSubtaskProperty);
router.put('/update/task/:id',handler.updateTask);
router.put('/update/subtask/:taskid/:subtaskid',handler.updateSubTask);
router.delete('/delete/task/:id', handler.deleteTask);
router.delete('/delete/task/:id/:propertyName', handler.deleteTaskProperty);
router.delete('/delete/subtask/:taskid/:subtaskid', handler.deleteSubTask);
router.delete('/delete/subtask/:taskid/:subtaskid/:propertyName', handler.deleteSubTaskProperty);
router.put('/update/subtask/:taskid/:subtaskid',handler.updateSubTask);
module.exports = router;





