const express = require('express');
const router = express.Router();
const validation = require('../Middleware/validation');
const userController = require('../Controller/userController');

router.get('/deptList', userController.deptList); // dept dropdown api
router.get('/roleList', userController.roleList);
router.get('/priorityList', userController.tskPriorityList);
router.get('/statusList', userController.tskStatusList);
router.get('/clientList', userController.clientList);
router.get('/showEmpDetails', userController.showEmpDetails);
router.get('/tskCategoryList', userController.tskCategoryList);
router.get('/getReport', userController.getReport);

router.post('/orgApi', userController.orgRegistration);
router.post('/registerUserApi', validation.validate('signup'), userController.registerUserApi);
router.post('/userLogin', userController.userLogin);
router.post('/updateUserApi', userController.updateUser);
router.post('/deleteUserApi', userController.deleteUser);
router.post('/deptApi', userController.deptApi);
router.post('/roleApi', userController.roleApi);
router.post('/userDetail', userController.getUserDetail);
router.post('/updateProfilePic', userController.updateProfilePic);
router.post('/orgList', userController.orgList);
router.post('/searchUser', validation.validate('searchUser'), userController.searchUser);
router.post('/forgotPassword', userController.forgotPassword);
router.post('/resetPassword', userController.resetPassword);
router.post('/changePassword', userController.changePassword);
router.post('/createTask', userController.createTaskApi);
router.post('/tskCategoryApi', userController.tskCategoryApi);
router.post('/tskPriorityApi', userController.tskPriorityApi);
router.post('/tskStatusApi', userController.tskStatusApi);
router.post('/createNotes', userController.createNotes);
router.post('/updateNotes', userController.updateNotes);
router.post('/deleteNotes', userController.deleteNotes);
router.post('/createProject', userController.projectApi);
router.post('/deleteProject', userController.deleteProject);
router.post('/updateProject', userController.updateProject);
router.post('/getProject', userController.getProject);
router.post('/getTask', userController.getTask);
router.post('/upsertReport', userController.upsertReport);
router.post('/pieTask', userController.pieTask);


router.post('/addClient', userController.addClientApi);
router.post('/userDropDownList', userController.userDropDownList);
router.post('/proAssignUserList', userController.proAssignUserList);

module.exports = router;