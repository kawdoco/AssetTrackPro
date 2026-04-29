import prisma from '../config/prisma.js';

/**
 * Create a new branch
 * @param {Object} branchData - Branch data
 * @param {number} branchData.organization_id - Organization ID
 * @param {string} branchData.name - Branch name
 * @param {string} branchData.city - City location
 * @returns {Object} Created branch
 */
export const createBranch = async (branchData) => {
  const { organization_id, name, city } = branchData;

  if (!organization_id || !name || !city) {
    throw new Error('Organization ID, branch name, and city are required');
  }

  if (name.trim() === '' || city.trim() === '') {
    throw new Error('Branch name and city cannot be empty');
  }

  // Verify organization exists
  const organization = await prisma.organization.findUnique({
    where: { id: parseInt(organization_id) },
  });

  if (!organization) {
    throw new Error('Organization not found');
  }

  // Check if branch already exists for this organization
  const existingBranch = await prisma.branch.findUnique({
    where: {
      organization_id_name: {
        organization_id: parseInt(organization_id),
        name: name.trim(),
      },
    },
  });

  if (existingBranch) {
    throw new Error('Branch with this name already exists in this organization');
  }

  const branch = await prisma.branch.create({
    data: {
      organization_id: parseInt(organization_id),
      name: name.trim(),
      city: city.trim(),
      status: 'ACTIVE',
    },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          buildings: true,
        },
      },
    },
  });

  return {
    success: true,
    data: branch,
    message: 'Branch created successfully',
  };
};

/**
 * Get all branches with optional filtering
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Records per page (default: 10)
 * @param {string} params.search - Search term for branch name
 * @param {number} params.organization_id - Filter by organization ID
 * @param {boolean} params.includeInactive - Whether to include inactive branches (default: false)
 * @returns {Object} Paginated branches list
 */
export const getBranches = async (params = {}) => {
  const { page = 1, limit = 10, search = '', organization_id = null, includeInactive = false } = params;
  const skip = (page - 1) * limit;

  const whereClause = {
    ...(includeInactive ? {} : { status: 'ACTIVE' }),
    ...(organization_id ? { organization_id: parseInt(organization_id) } : {}),
    ...(search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              city: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        }
      : {}),
  };

  const [branches, total] = await Promise.all([
    prisma.branch.findMany({
      where: whereClause,
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            buildings: true,
          },
        },
      },
      skip,
      take: parseInt(limit),
      orderBy: {
        created_at: 'desc',
      },
    }),
    prisma.branch.count({ where: whereClause }),
  ]);

  return {
    success: true,
    data: branches,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get branch by ID with related data
 * @param {number} branchId - Branch ID
 * @returns {Object} Branch with related data
 */
export const getBranchById = async (branchId) => {
  const branch = await prisma.branch.findUnique({
    where: { id: parseInt(branchId) },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
        },
      },
      buildings: {
        include: {
          _count: {
            select: {
              zones: true,
            },
          },
        },
      },
      _count: {
        select: {
          buildings: true,
        },
      },
    },
  });

  if (!branch) {
    throw new Error('Branch not found');
  }

  return {
    success: true,
    data: branch,
  };
};

/**
 * Update branch
 * @param {number} branchId - Branch ID
 * @param {Object} updateData - Data to update
 * @returns {Object} Updated branch
 */
export const updateBranch = async (branchId, updateData) => {
  const { name, city, status } = updateData;

  const branch = await prisma.branch.findUnique({
    where: { id: parseInt(branchId) },
  });

  if (!branch) {
    throw new Error('Branch not found');
  }

  // Check if new name already exists in the same organization (if name is being changed)
  if (name && name !== branch.name) {
    const existingBranch = await prisma.branch.findUnique({
      where: {
        organization_id_name: {
          organization_id: branch.organization_id,
          name: name.trim(),
        },
      },
    });

    if (existingBranch) {
      throw new Error('Branch with this name already exists in this organization');
    }
  }

  const updatedBranch = await prisma.branch.update({
    where: { id: parseInt(branchId) },
    data: {
      ...(name ? { name: name.trim() } : {}),
      ...(city ? { city: city.trim() } : {}),
      ...(status ? { status } : {}),
    },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          buildings: true,
        },
      },
    },
  });

  return {
    success: true,
    data: updatedBranch,
    message: 'Branch updated successfully',
  };
};

/**
 * Deactivate (soft delete) branch
 * @param {number} branchId - Branch ID
 * @returns {Object} Deactivated branch
 */
export const deactivateBranch = async (branchId) => {
  const branch = await prisma.branch.findUnique({
    where: { id: parseInt(branchId) },
  });

  if (!branch) {
    throw new Error('Branch not found');
  }

  if (branch.status === 'INACTIVE') {
    throw new Error('Branch is already inactive');
  }

  const deactivated = await prisma.branch.update({
    where: { id: parseInt(branchId) },
    data: { status: 'INACTIVE' },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          buildings: true,
        },
      },
    },
  });

  return {
    success: true,
    data: deactivated,
    message: 'Branch deactivated successfully',
  };
};

/**
 * Reactivate (undo soft delete) branch
 * @param {number} branchId - Branch ID
 * @returns {Object} Reactivated branch
 */
export const reactivateBranch = async (branchId) => {
  const branch = await prisma.branch.findUnique({
    where: { id: parseInt(branchId) },
  });

  if (!branch) {
    throw new Error('Branch not found');
  }

  if (branch.status === 'ACTIVE') {
    throw new Error('Branch is already active');
  }

  const reactivated = await prisma.branch.update({
    where: { id: parseInt(branchId) },
    data: { status: 'ACTIVE' },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          buildings: true,
        },
      },
    },
  });

  return {
    success: true,
    data: reactivated,
    message: 'Branch reactivated successfully',
  };
};
