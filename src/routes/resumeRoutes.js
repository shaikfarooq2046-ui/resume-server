const router = require('express').Router();
const {resumeCreate, resumelist, resumeView, resumeEdit}  = require('../controllers/resumeController');

router.post('/create', resumeCreate);
router.get('/list/:user_id', resumelist);
router.get('/list/user/view/:id', resumeView);
router.get('/list/user/edit/:id', resumeEdit);


module.exports = router;