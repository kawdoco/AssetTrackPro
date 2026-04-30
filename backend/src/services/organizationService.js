import prisma from '../config/prisma.js';

/**
 * Create a new organization
 * @param {Object} organizationData - Organization data
 * @param {string} organizationData.name - Organization name (unique)
 * @param {string} organizationData.industry_type - Industry type
 * @returns {Object} Created organization
 */
export const createOrganization = async (organizationData) => {
  const { name, industry_type } = organizationData;

  if (!name || name.trim() === '') {
    throw new Error('Organization name is required');
  }

  // Check if organization already exists
  const existingOrg = await prisma.organization.findUnique({
    where: { name },
  });

  if (existingOrg) {
    throw new Error('Organization with this name already exists');
  }

  const organization = await prisma.organization.create({
    data: {
      name: name.trim(),
      industry_type: industry_type || null,
    },
  });

  return {
    success: true,
    data: organization,
    message: 'Organization created successfully',
  };
};

/**
 * Get all organizations with optional filtering
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Records per page (default: 10)
 * @param {string} params.search - Search term for organization name
 * @param {boolean} params.includeInactive - Whether to include inactive organizations (default: false)
 * @returns {Object} Paginated organizations list
 */
export const getOrganizations = async (params = {}) => {
  const { page = 1, limit = 10, search = '', includeInactive = false } = params;
  const skip = (page - 1) * limit;

  const whereClause = {
    ...(includeInactive ? {} : { is_active: true }),
    ...(search
      ? {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        }
      : {}),
  };

  const [organizations, total] = await Promise.all([
    prisma.organization.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            branches: true,
            employees: true,
            assets: true,
          },
        },
      },
      skip,
      take: parseInt(limit),
      orderBy: {
        created_at: 'desc',
      },
    }),
    prisma.organization.count({ where: whereClause }),
  ]);

  return {
    success: true,
    data: organizations,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get organization by ID with related data
 * @param {number} organizationId - Organization ID
 * @returns {Object} Organization with related branches, employees, and assets count
 */
export const getOrganizationById = async (organizationId) => {
  const id = parseInt(organizationId);

  if (!Number.isInteger(id)) {
    throw new Error('Invalid organization ID');
  }

  const organization = await prisma.organization.findUnique({
    where: { id },
    include: {
      branches: {
        select: {
          id: true,
          name: true,
          city: true,
          status: true,
          created_at: true,
        },
      },
      _count: {
        select: {
          branches: true,
          employees: true,
          assets: true,
        },
      },
    },
  });

  if (!organization) {
    throw new Error('Organization not found');
  }

  return {
    success: true,
    data: organization,
  };
};

/**
 * Update organization details
 * @param {number} organizationId - Organization ID
 * @param {Object} updateData - Data to update
 * @param {string} updateData.name - Organization name
 * @param {string} updateData.industry_type - Industry type
 * @returns {Object} Updated organization
 */
export const updateOrganization = async (organizationId, updateData) => {
  const id = parseInt(organizationId);

  if (!Number.isInteger(id)) {
    throw new Error('Invalid organization ID');
  }

  // Check if organization exists
  const existingOrg = await prisma.organization.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existingOrg) {
    throw new Error('Organization not found');
  }

  // If name is being updated, check for uniqueness
  if (updateData.name) {
    const duplicateOrg = await prisma.organization.findUnique({
      where: { name: updateData.name },
      select: { id: true },
    });

    if (duplicateOrg && duplicateOrg.id !== id) {
      throw new Error('Organization with this name already exists');
    }
  }

  const organization = await prisma.organization.update({
    where: { id },
    data: {
      name: updateData.name ? updateData.name.trim() : undefined,
      industry_type: updateData.industry_type || null,
      updated_at: new Date(),
    },
  });

  return {
    success: true,
    data: organization,
    message: 'Organization updated successfully',
  };
};

/**
 * Deactivate organization (soft delete)
 * @param {number} organizationId - Organization ID
 * @returns {Object} Success response
 */
export const deactivateOrganization = async (organizationId) => {
  const id = parseInt(organizationId);

  if (!Number.isInteger(id)) {
    throw new Error('Invalid organization ID');
  }

  const existingOrg = await prisma.organization.findUnique({
    where: { id },
    select: { id: true, name: true, is_active: true },
  });

  if (!existingOrg) {
    throw new Error('Organization not found');
  }

  if (!existingOrg.is_active) {
    return {
      success: true,
      message: `Organization "${existingOrg.name}" is already inactive`,
    };
  }

  const organization = await prisma.organization.update({
    where: { id },
    data: {
      is_active: false,
      updated_at: new Date(),
    },
  });

  return {
    success: true,
    data: organization,
    message: `Organization "${existingOrg.name}" has been deactivated`,
  };
};

/**
 * Reactivate organization (change status from inactive to active)
 * @param {number} organizationId - Organization ID
 * @returns {Object} Success response
 */
export const reactivateOrganization = async (organizationId) => {
  const id = parseInt(organizationId);

  if (!Number.isInteger(id)) {
    throw new Error('Invalid organization ID');
  }

  // Check if organization exists
  const existingOrg = await prisma.organization.findUnique({
    where: { id },
    select: { id: true, name: true, is_active: true },
  });

  if (!existingOrg) {
    throw new Error('Organization not found');
  }

  if (existingOrg.is_active) {
    return {
      success: true,
      message: `Organization "${existingOrg.name}" is already active`,
    };
  }

  const organization = await prisma.organization.update({
    where: { id },
    data: {
      is_active: true,
      updated_at: new Date(),
    },
  });

  return {
    success: true,
    data: organization,
    message: `Organization "${existingOrg.name}" has been reactivated`,
  };
};
