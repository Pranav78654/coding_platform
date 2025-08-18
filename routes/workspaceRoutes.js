import  express from "express"
const router = express.Router();

import  workspaceController from "../controllers/workspaceController";


router.post('/', workspaceController.createWorkspace);
router.get('/:id', workspaceController.getWorkspace);
router.put('/:id', workspaceController.updateWorkspace);
router.delete('/:id', workspaceController.deleteWorkspace);

module.exports = router;
