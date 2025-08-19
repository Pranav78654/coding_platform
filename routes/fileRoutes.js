import express from "express"
const router = express.Router();
import {protect}  from "../middleware/authMiddleware.js";
import {createFile , getFile , updateFile , deleteFile} from "../controllers/fileController.js"

router.post('/',protect ,createFile);
router.get('/', protect, getFile);
router.get('/:id', protect, getFile);
router.put('/:id', protect, updateFile);
router.delete('/:id', protect, deleteFile);

export default router;
