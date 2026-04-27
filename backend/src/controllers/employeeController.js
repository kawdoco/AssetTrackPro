import * as employeeService from '../services/employeeService.js';

export const getEmployeeOrganizations = async (req, res) => {
  try {
    const organizations = await employeeService.listEmployeeOrganizations(req.user);

    res.status(200).json({
      success: true,
      data: organizations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch organizations',
    });
  }
};

export const getEmployees = async (req, res) => {
  try {
    const employees = await employeeService.listEmployees(req.user, req.query);

    res.status(200).json({
      success: true,
      data: employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch employees',
    });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const { employee_code, name } = req.body;

    if (!employee_code || !name) {
      return res.status(400).json({
        success: false,
        message: 'employee_code and name are required',
      });
    }

    const employee = await employeeService.createEmployee(req.user, req.body);

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee,
    });
  } catch (error) {
    const duplicateCode = error.code === 'P2002';

    res.status(duplicateCode ? 409 : 400).json({
      success: false,
      message: duplicateCode
        ? 'employee_code already exists for this organization'
        : error.message || 'Failed to create employee',
    });
  }
};
