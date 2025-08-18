import express from "express"
const router = express.Router();

import {createFile , getFile , updateFile , deleteFile} from "../controllers/fileController.js"
router.post('/', createFile);

router.get('/', getFile);
router.get('/:id', getFile);

router.put('/:id', updateFile);

router.delete('/:id', deleteFile);

export default router;
