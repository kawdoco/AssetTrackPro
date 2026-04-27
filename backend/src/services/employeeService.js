import prisma from '../config/prisma.js';

const toIntOrNull = (value) => {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : null;
};

const employeeSelect = {
  id: true,
  organization_id: true,
  employee_code: true,
  name: true,
  email: true,
  status: true,
  created_at: true,
  updated_at: true,
  organization: {
    select: {
      id: true,
      name: true,
    },
  },
};

const scopedOrganizationId = (user) => {
  if (user?.role === 'ADMIN') {
    return null;
  }

  return toIntOrNull(user?.organization_id);
};

export const listEmployeeOrganizations = async (user) => {
  const scopeOrgId = scopedOrganizationId(user);

  if (scopeOrgId === null) {
    return prisma.organization.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  const org = await prisma.organization.findFirst({
    where: {
      id: scopeOrgId,
    },
    select: {
      id: true,
      name: true,
    },
  });

  return org ? [org] : [];
};

export const listEmployees = async (user, query = {}) => {
  const scopeOrgId = scopedOrganizationId(user);

  const where = {};

  if (scopeOrgId !== null) {
    where.organization_id = scopeOrgId;
  } else if (query.organization_id) {
    const requestedOrgId = toIntOrNull(query.organization_id);
    if (requestedOrgId !== null) {
      where.organization_id = requestedOrgId;
    }
  }

  if (query.search) {
    where.OR = [
      { name: { contains: query.search } },
      { employee_code: { contains: query.search } },
      { email: { contains: query.search } },
    ];
  }

  return prisma.employee.findMany({
    where,
    select: employeeSelect,
    orderBy: {
      created_at: 'desc',
    },
  });
};

export const createEmployee = async (user, payload) => {
  const scopeOrgId = scopedOrganizationId(user);
  const requestedOrgId = toIntOrNull(payload.organization_id);
  const organizationId = scopeOrgId ?? requestedOrgId;

  if (organizationId === null) {
    throw new Error('organization_id is required');
  }

  return prisma.employee.create({
    data: {
      organization_id: organizationId,
      employee_code: payload.employee_code,
      name: payload.name,
      email: payload.email || null,
      status: payload.status || 'ACTIVE',
    },
    select: employeeSelect,
  });
};
