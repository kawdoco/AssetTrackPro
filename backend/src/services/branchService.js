import prisma from '../config/prisma.js';

const branchInclude = {
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
};

const branchMapSelect = {
  id: true,
  organization_id: true,
  name: true,
  city: true,
  status: true,
  map_center_lat: true,
  map_center_lng: true,
  map_zoom: true,
  boundary_points: true,
  gate_markers: true,
  map_updated_at: true,
  created_at: true,
  updated_at: true,
  organization: {
    select: {
      id: true,
      name: true,
    },
  },
};

const normalizeCoordinate = (value) => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const normalizeZoom = (value, fallback = 17) => {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) ? parsed : fallback;
};

const clampGateRadius = (value) => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 5;
  }

  return Math.max(1, Math.min(100, parsed));
};

const normalizePolygonPoints = (points) => {
  if (!Array.isArray(points) || points.length === 0) {
    return null;
  }

  const normalizedPoints = points
    .map((point) => ({
      lat: normalizeCoordinate(point?.lat),
      lng: normalizeCoordinate(point?.lng),
    }))
    .filter((point) => point.lat !== null && point.lng !== null);

  return normalizedPoints.length >= 3 ? normalizedPoints : null;
};

const normalizeBoundaryPayload = (payload) => {
  if (!payload) {
    return null;
  }

  if (Array.isArray(payload)) {
    const points = normalizePolygonPoints(payload);
    return points ? { type: 'polygon', points } : null;
  }

  if (payload.type === 'polygon') {
    const points = normalizePolygonPoints(payload.points);
    return points ? { type: 'polygon', points } : null;
  }

  if (payload.type === 'rectangle') {
    const north = normalizeCoordinate(payload?.bounds?.north);
    const south = normalizeCoordinate(payload?.bounds?.south);
    const east = normalizeCoordinate(payload?.bounds?.east);
    const west = normalizeCoordinate(payload?.bounds?.west);

    if ([north, south, east, west].some((value) => value === null)) {
      return null;
    }

    if (north <= south || east <= west) {
      return null;
    }

    return {
      type: 'rectangle',
      bounds: { north, south, east, west },
    };
  }

  if (payload.type === 'circle') {
    const lat = normalizeCoordinate(payload?.center?.lat);
    const lng = normalizeCoordinate(payload?.center?.lng);
    const radius_m = Math.max(1, Number(payload?.radius_m) || 0);

    if (lat === null || lng === null || !Number.isFinite(radius_m)) {
      return null;
    }

    return {
      type: 'circle',
      center: { lat, lng },
      radius_m,
    };
  }

  return null;
};

const normalizeGateMarkers = (markers) => {
  if (!Array.isArray(markers) || markers.length === 0) {
    return [];
  }

  return markers
    .map((marker, index) => {
      const lat = normalizeCoordinate(marker?.lat);
      const lng = normalizeCoordinate(marker?.lng);

      if (lat === null || lng === null) {
        return null;
      }

      const name = typeof marker?.name === 'string' && marker.name.trim()
        ? marker.name.trim()
        : `Gate ${index + 1}`;

      return {
        id: typeof marker?.id === 'string' && marker.id.trim() ? marker.id.trim() : `gate-${Date.now()}-${index}`,
        name,
        type: typeof marker?.type === 'string' && marker.type.trim() ? marker.type.trim() : 'BOTH',
        lat,
        lng,
        radius_m: clampGateRadius(marker?.radius_m),
      };
    })
    .filter(Boolean);
};

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
      map_zoom: 17,
    },
    include: branchInclude,
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
      include: branchInclude,
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
      organization: branchInclude.organization,
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
    include: branchInclude,
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
    include: branchInclude,
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
    include: branchInclude,
  });

  return {
    success: true,
    data: reactivated,
    message: 'Branch reactivated successfully',
  };
};

/**
 * Get branch map data
 * @param {number} branchId - Branch ID
 * @returns {Object} Branch map payload
 */
export const getBranchMap = async (branchId) => {
  const branch = await prisma.branch.findUnique({
    where: { id: parseInt(branchId) },
    select: branchMapSelect,
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
 * Update branch map data
 * @param {number} branchId - Branch ID
 * @param {Object} mapData - Map editor payload
 * @returns {Object} Updated branch map payload
 */
export const updateBranchMap = async (branchId, mapData) => {
  const existingBranch = await prisma.branch.findUnique({
    where: { id: parseInt(branchId) },
    select: { id: true, map_zoom: true },
  });

  if (!existingBranch) {
    throw new Error('Branch not found');
  }

  const boundaryPoints = normalizeBoundaryPayload(mapData.boundary_points);
  const gateMarkers = normalizeGateMarkers(mapData.gate_markers);
  const centerLat = normalizeCoordinate(mapData.map_center_lat);
  const centerLng = normalizeCoordinate(mapData.map_center_lng);

  const updatedBranch = await prisma.branch.update({
    where: { id: parseInt(branchId) },
    data: {
      map_center_lat: centerLat,
      map_center_lng: centerLng,
      map_zoom: normalizeZoom(mapData.map_zoom, existingBranch.map_zoom ?? 17),
      boundary_points: boundaryPoints,
      gate_markers: gateMarkers,
      map_updated_at: new Date(),
    },
    select: branchMapSelect,
  });

  return {
    success: true,
    data: updatedBranch,
    message: 'Branch map updated successfully',
  };
};
