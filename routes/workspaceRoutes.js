import  express from "express"
const router = express.Router();
import authMiddleware  from "../middleware/authMiddleware.js";
import  {createWorkspace , getWorkspace , updateWorkspace , deleteWorkspace} from "../controllers/workspaceController.js";


router.post('/', authMiddleware,createWorkspace);
router.get('/:id', authMiddleware,getWorkspace);
router.put('/:id', authMiddleware,updateWorkspace);
router.delete('/:id', authMiddleware,deleteWorkspace);

export default router;
