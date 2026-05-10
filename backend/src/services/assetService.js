import prisma from '../config/prisma.js';

const toIntOrNull = (value) => {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : null;
};

const assetSelect = {
  id: true,
  organization_id: true,
  asset_tag_uid: true,
  asset_type: true,
  model: true,
  serial_number: true,
  status: true,
  last_seen_zone_id: true,
  last_seen_time: true,
  created_at: true,
  updated_at: true,
  last_seen_zone: {
    select: {
      id: true,
      zone_name: true,
      zone_type: true,
    },
  },
};

const assetAssignmentSelect = {
  id: true,
  asset_id: true,
  employee_id: true,
  assigned_at: true,
  returned_at: true,
  notes: true,
  created_at: true,
  updated_at: true,
  asset: {
    select: {
      id: true,
      asset_tag_uid: true,
      asset_type: true,
      model: true,
      serial_number: true,
      status: true,
    },
  },
  employee: {
    select: {
      id: true,
      employee_code: true,
      name: true,
      email: true,
      status: true,
      is_active: true,
    },
  },
};

export const listAssets = async (organizationId, filters = {}) => {
  const normalizedOrganizationId = toIntOrNull(organizationId);

  if (normalizedOrganizationId === null) {
    return [];
  }

  const where = {
    organization_id: normalizedOrganizationId,
  };

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.asset_type) {
    where.asset_type = filters.asset_type;
  }

  if (filters.search) {
    where.OR = [
      { asset_tag_uid: { contains: filters.search } },
      { serial_number: { contains: filters.search } },
      { model: { contains: filters.search } },
    ];
  }

  return prisma.asset.findMany({
    where,
    select: assetSelect,
    orderBy: {
      created_at: 'desc',
    },
  });
};

export const getAssetById = async (id, organizationId) => {
  const normalizedId = toIntOrNull(id);
  const normalizedOrganizationId = toIntOrNull(organizationId);

  if (normalizedId === null || normalizedOrganizationId === null) {
    return null;
  }

  return prisma.asset.findFirst({
    where: {
      id: normalizedId,
      organization_id: normalizedOrganizationId,
    },
    select: assetSelect,
  });
};

export const createAsset = async (organizationId, assetData) => {
  const normalizedOrganizationId = toIntOrNull(organizationId);

  if (normalizedOrganizationId === null) {
    throw new Error('Invalid organization_id');
  }

  const data = {
    organization_id: normalizedOrganizationId,
    asset_tag_uid: assetData.asset_tag_uid,
    asset_type: assetData.asset_type,
    model: assetData.model || null,
    serial_number: assetData.serial_number || null,
    status: assetData.status || 'ACTIVE',
    last_seen_zone_id: toIntOrNull(assetData.last_seen_zone_id),
    last_seen_time: assetData.last_seen_time ? new Date(assetData.last_seen_time) : null,
  };

  return prisma.asset.create({
    data,
    select: assetSelect,
  });
};

export const updateAsset = async (id, organizationId, assetData) => {
  const normalizedId = toIntOrNull(id);
  const normalizedOrganizationId = toIntOrNull(organizationId);

  if (normalizedId === null || normalizedOrganizationId === null) {
    return null;
  }

  const existingAsset = await prisma.asset.findFirst({
    where: {
      id: normalizedId,
      organization_id: normalizedOrganizationId,
    },
    select: { id: true },
  });

  if (!existingAsset) {
    return null;
  }

  const data = {};

  if (assetData.asset_tag_uid !== undefined) data.asset_tag_uid = assetData.asset_tag_uid;
  if (assetData.asset_type !== undefined) data.asset_type = assetData.asset_type;
  if (assetData.model !== undefined) data.model = assetData.model || null;
  if (assetData.serial_number !== undefined) data.serial_number = assetData.serial_number || null;
  if (assetData.status !== undefined) data.status = assetData.status;
  if (assetData.last_seen_zone_id !== undefined) {
    data.last_seen_zone_id = toIntOrNull(assetData.last_seen_zone_id);
  }
  if (assetData.last_seen_time !== undefined) {
    data.last_seen_time = assetData.last_seen_time ? new Date(assetData.last_seen_time) : null;
  }

  return prisma.asset.update({
    where: { id: normalizedId },
    data,
    select: assetSelect,
  });
};

export const deleteAsset = async (id, organizationId) => {
  const normalizedId = toIntOrNull(id);
  const normalizedOrganizationId = toIntOrNull(organizationId);

  if (normalizedId === null || normalizedOrganizationId === null) {
    return null;
  }

  const existingAsset = await prisma.asset.findFirst({
    where: {
      id: normalizedId,
      organization_id: normalizedOrganizationId,
    },
    select: { id: true },
  });

  if (!existingAsset) {
    return null;
  }

  await prisma.asset.delete({
    where: { id: normalizedId },
  });

  return { success: true, message: 'Asset deleted successfully' };
};

export const listAssetAssignments = async (assetId, organizationId, filters = {}) => {
  const normalizedAssetId = toIntOrNull(assetId);
  const normalizedOrganizationId = toIntOrNull(organizationId);

  if (normalizedAssetId === null || normalizedOrganizationId === null) {
    return null;
  }

  const asset = await prisma.asset.findFirst({
    where: {
      id: normalizedAssetId,
      organization_id: normalizedOrganizationId,
    },
    select: { id: true },
  });

  if (!asset) {
    return null;
  }

  const where = {
    asset_id: normalizedAssetId,
  };

  if (String(filters.active).toLowerCase() === 'true') {
    where.returned_at = null;
  }

  return prisma.assetAssignment.findMany({
    where,
    select: assetAssignmentSelect,
    orderBy: {
      assigned_at: 'desc',
    },
  });
};

export const assignAssetToEmployee = async (assetId, organizationId, assignmentData) => {
  const normalizedAssetId = toIntOrNull(assetId);
  const normalizedOrganizationId = toIntOrNull(organizationId);
  const normalizedEmployeeId = toIntOrNull(assignmentData.employee_id);

  if (normalizedAssetId === null || normalizedOrganizationId === null) {
    throw new Error('Invalid asset_id');
  }

  if (normalizedEmployeeId === null) {
    throw new Error('employee_id is required');
  }

  const asset = await prisma.asset.findFirst({
    where: {
      id: normalizedAssetId,
      organization_id: normalizedOrganizationId,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!asset) {
    const error = new Error('Asset not found');
    error.statusCode = 404;
    throw error;
  }

  if (asset.status !== 'ACTIVE') {
    const error = new Error('Only ACTIVE assets can be assigned');
    error.statusCode = 400;
    throw error;
  }

  const employee = await prisma.employee.findFirst({
    where: {
      id: normalizedEmployeeId,
      organization_id: normalizedOrganizationId,
    },
    select: {
      id: true,
      is_active: true,
      status: true,
    },
  });

  if (!employee) {
    const error = new Error('Employee not found');
    error.statusCode = 404;
    throw error;
  }

  if (!employee.is_active || employee.status !== 'ACTIVE') {
    const error = new Error('Only active employees can receive asset assignments');
    error.statusCode = 400;
    throw error;
  }

  const activeAssignment = await prisma.assetAssignment.findFirst({
    where: {
      asset_id: normalizedAssetId,
      returned_at: null,
    },
    select: {
      id: true,
    },
  });

  if (activeAssignment) {
    const error = new Error('Asset already has an active assignment');
    error.statusCode = 409;
    throw error;
  }

  return prisma.assetAssignment.create({
    data: {
      asset_id: normalizedAssetId,
      employee_id: normalizedEmployeeId,
      assigned_at: assignmentData.assigned_at ? new Date(assignmentData.assigned_at) : new Date(),
      notes: assignmentData.notes || null,
    },
    select: assetAssignmentSelect,
  });
};

export const returnAssetAssignment = async (assetId, assignmentId, organizationId, returnData = {}) => {
  const normalizedAssetId = toIntOrNull(assetId);
  const normalizedAssignmentId = toIntOrNull(assignmentId);
  const normalizedOrganizationId = toIntOrNull(organizationId);

  if (
    normalizedAssetId === null ||
    normalizedAssignmentId === null ||
    normalizedOrganizationId === null
  ) {
    return null;
  }

  const assignment = await prisma.assetAssignment.findFirst({
    where: {
      id: normalizedAssignmentId,
      asset_id: normalizedAssetId,
      asset: {
        organization_id: normalizedOrganizationId,
      },
    },
    select: {
      id: true,
      returned_at: true,
    },
  });

  if (!assignment) {
    return null;
  }

  if (assignment.returned_at) {
    const error = new Error('Asset assignment has already been returned');
    error.statusCode = 409;
    throw error;
  }

  const data = {
    returned_at: returnData.returned_at ? new Date(returnData.returned_at) : new Date(),
  };

  if (returnData.notes !== undefined) {
    data.notes = returnData.notes || null;
  }

  return prisma.assetAssignment.update({
    where: {
      id: normalizedAssignmentId,
    },
    data,
    select: assetAssignmentSelect,
  });
};
