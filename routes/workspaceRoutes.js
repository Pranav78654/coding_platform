import  express from "express"
const router = express.Router();

import  {createWorkspace , getWorkspace , updateWorkspace , deleteWorkspace} from "../controllers/workspaceController.js";


router.post('/', createWorkspace);
router.get('/:id', getWorkspace);
router.put('/:id', updateWorkspace);
router.delete('/:id', deleteWorkspace);

export default router;
