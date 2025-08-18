import express from "express"
const router = express.Router();

import fileController from "../controllers/fileController"
router.post('/', fileController.createFile);

router.get('/', fileController.getFile);
router.get('/:id', fileController.getFile);

router.put('/:id', fileController.updateFile);

router.delete('/:id', fileController.deleteFile);

module.exports = router;
