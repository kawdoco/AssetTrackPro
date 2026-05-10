import prisma from '../config/prisma.js';

/**
 * Create a new zone
 * @param {Object} zoneData - Zone data
 * @param {number} zoneData.building_id - Building ID
 * @param {string} zoneData.zone_name - Zone name
 * @param {string} zoneData.zone_type - Zone type (STORAGE, OFFICE, EXIT, SECURE)
 * @param {string} zoneData.description - Zone description (optional)
 * @returns {Object} Created zone
 */
export const createZone = async (zoneData) => {
  const { building_id, zone_name, zone_type, description } = zoneData;

  if (!building_id || !zone_name || !zone_type) {
    throw new Error('Building ID, zone name, and zone type are required');
  }

  if (zone_name.trim() === '' || zone_type.trim() === '') {
    throw new Error('Zone name and type cannot be empty');
  }

  // Validate zone type
  const validZoneTypes = ['STORAGE', 'OFFICE', 'EXIT', 'SECURE'];
  if (!validZoneTypes.includes(zone_type.toUpperCase())) {
    throw new Error('Invalid zone type. Must be one of: STORAGE, OFFICE, EXIT, SECURE');
  }

  // Verify building exists
  const building = await prisma.building.findUnique({
    where: { id: parseInt(building_id) },
  });

  if (!building) {
    throw new Error('Building not found');
  }

  // Check if zone already exists in this building
  const existingZone = await prisma.zone.findUnique({
    where: {
      building_id_zone_name: {
        building_id: parseInt(building_id),
        zone_name: zone_name.trim(),
      },
    },
  });

  if (existingZone) {
    throw new Error('Zone with this name already exists in this building');
  }

  const zone = await prisma.zone.create({
    data: {
      building_id: parseInt(building_id),
      zone_name: zone_name.trim(),
      zone_type: zone_type.toUpperCase(),
      description: description ? description.trim() : null,
    },
    include: {
      building: {
        select: {
          id: true,
          name: true,
          branch: {
            select: {
              id: true,
              name: true,
              organization: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
      _count: {
        select: {
          gates: true,
        },
      },
    },
  });

  return {
    success: true,
    data: zone,
    message: 'Zone created successfully',
  };
};

/**
 * Get all zones with optional filtering
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Records per page (default: 10)
 * @param {string} params.search - Search term for zone name
 * @param {number} params.building_id - Filter by building ID
 * @param {string} params.zone_type - Filter by zone type
 * @returns {Object} Paginated zones list
 */
export const getZones = async (params = {}) => {
  const { page = 1, limit = 10, search = '', building_id = null, zone_type = null } = params;
  const skip = (page - 1) * limit;

  const whereClause = {
    ...(building_id ? { building_id: parseInt(building_id) } : {}),
    ...(zone_type ? { zone_type: zone_type.toUpperCase() } : {}),
    ...(search
      ? {
          OR: [
            {
              zone_name: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        }
      : {}),
  };

  const [zones, total] = await Promise.all([
    prisma.zone.findMany({
      where: whereClause,
      include: {
        building: {
          select: {
            id: true,
            name: true,
            branch: {
              select: {
                id: true,
                name: true,
                organization: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            gates: true,
          },
        },
      },
      skip,
      take: parseInt(limit),
      orderBy: {
        created_at: 'desc',
      },
    }),
    prisma.zone.count({ where: whereClause }),
  ]);

  return {
    success: true,
    data: zones,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get zone by ID with related data
 * @param {number} zoneId - Zone ID
 * @returns {Object} Zone with related data
 */
export const getZoneById = async (zoneId) => {
  const zone = await prisma.zone.findUnique({
    where: { id: parseInt(zoneId) },
    include: {
      building: {
        select: {
          id: true,
          name: true,
          branch: {
            select: {
              id: true,
              name: true,
              organization: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
      gates: {
        select: {
          id: true,
          gate_name: true,
          direction: true,
          reader_model: true,
        },
      },
      _count: {
        select: {
          gates: true,
        },
      },
    },
  });

  if (!zone) {
    throw new Error('Zone not found');
  }

  return {
    success: true,
    data: zone,
  };
};

/**
 * Update zone
 * @param {number} zoneId - Zone ID
 * @param {Object} updateData - Data to update
 * @returns {Object} Updated zone
 */
export const updateZone = async (zoneId, updateData) => {
  const { zone_name, zone_type, description } = updateData;

  const zone = await prisma.zone.findUnique({
    where: { id: parseInt(zoneId) },
  });

  if (!zone) {
    throw new Error('Zone not found');
  }

  // Validate zone type if provided
  if (zone_type) {
    const validZoneTypes = ['STORAGE', 'OFFICE', 'EXIT', 'SECURE'];
    if (!validZoneTypes.includes(zone_type.toUpperCase())) {
      throw new Error('Invalid zone type. Must be one of: STORAGE, OFFICE, EXIT, SECURE');
    }
  }

  // Check if new name already exists in the same building (if name is being changed)
  if (zone_name && zone_name !== zone.zone_name) {
    const existingZone = await prisma.zone.findUnique({
      where: {
        building_id_zone_name: {
          building_id: zone.building_id,
          zone_name: zone_name.trim(),
        },
      },
    });

    if (existingZone) {
      throw new Error('Zone with this name already exists in this building');
    }
  }

  const updatedZone = await prisma.zone.update({
    where: { id: parseInt(zoneId) },
    data: {
      ...(zone_name ? { zone_name: zone_name.trim() } : {}),
      ...(zone_type ? { zone_type: zone_type.toUpperCase() } : {}),
      ...(description !== undefined ? { description: description ? description.trim() : null } : {}),
    },
    include: {
      building: {
        select: {
          id: true,
          name: true,
          branch: {
            select: {
              id: true,
              name: true,
              organization: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
      _count: {
        select: {
          gates: true,
        },
      },
    },
  });

  return {
    success: true,
    data: updatedZone,
    message: 'Zone updated successfully',
  };
};

/**
 * Delete zone
 * @param {number} zoneId - Zone ID
 * @returns {Object} Deletion result
 */
export const deleteZone = async (zoneId) => {
  const zone = await prisma.zone.findUnique({
    where: { id: parseInt(zoneId) },
  });

  if (!zone) {
    throw new Error('Zone not found');
  }

  await prisma.zone.delete({
    where: { id: parseInt(zoneId) },
  });

  return {
    success: true,
    message: 'Zone deleted successfully',
  };
};