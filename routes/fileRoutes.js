import express from "express"
const router = express.Router();
import authMiddleware  from "../middleware/authMiddleware.js";
import {createFile , getFile , updateFile , deleteFile} from "../controllers/fileController.js"

router.post('/',authMiddleware ,createFile);
router.get('/', authMiddleware, getFile);
router.get('/:id', authMiddleware, getFile);
router.put('/:id', authMiddleware, updateFile);
router.delete('/:id', authMiddleware, deleteFile);

export default router;
