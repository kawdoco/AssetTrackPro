import express from 'express';
import * as employeeController from '../controllers/employeeController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/organizations', employeeController.getEmployeeOrganizations);
router.get('/', employeeController.getEmployees);
router.post('/create', authorize('ADMIN', 'MANAGER'), employeeController.createEmployee);
router.put('/:id', authorize('ADMIN', 'MANAGER'), employeeController.updateEmployee);
router.delete('/:id', authorize('ADMIN', 'MANAGER'), employeeController.deleteEmployee);

export default router;
