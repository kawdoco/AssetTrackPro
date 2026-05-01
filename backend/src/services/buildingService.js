import { prisma } from '../config/db.js';
// Change this path to match where your PrismaClient is created in your project

// GET ALL BUILDINGS  (with optional branch_id filter + search + pagination)
export const getAllBuildings = async ({ branch_id, search, page, limit }) => {
  const where = {
    ...(branch_id && { branch_id }),
    ...(search    && { name: { contains: search, mode: 'insensitive' } }),
  };

  const skip = (page - 1) * limit;

  const [buildings, total] = await Promise.all([
    prisma.building.findMany({
      where,
      skip,
      take    : limit,
      orderBy : { created_at: 'desc' },
      include : {
        branch : { select: { id: true, name: true } },
        zones  : { select: { id: true, name: true } },
      },
    }),
    prisma.building.count({ where }),
  ]);

  return {
    buildings,
    pagination: {
      currentPage  : page,
      totalPages   : Math.ceil(total / limit),
      totalItems   : total,
      itemsPerPage : limit,
    },
  };
};

// GET ONE BUILDING BY ID
export const getBuildingById = async (id) => {
  return prisma.building.findUnique({
    where   : { id },
    include : {
      branch : { select: { id: true, name: true } },
      zones  : true,
    },
  });
};

// CREATE BUILDING
// Schema: branch_id (Int, FK), name (String)
// @@unique([branch_id, name]) → Prisma throws P2002 if duplicate
// onDelete: Cascade on branch → Prisma throws P2003 if branch missing
export const createBuilding = async ({ branch_id, name }) => {
  return prisma.building.create({
    data    : { branch_id, name },
    include : {
      branch : { select: { id: true, name: true } },
    },
  });
};

// UPDATE BUILDING
export const updateBuilding = async (id, data) => {
  return prisma.building.update({
    where   : { id },
    data,
    include : {
      branch : { select: { id: true, name: true } },
      zones  : { select: { id: true, name: true } },
    },
  });
};

// DELETE BUILDING
// zones are automatically deleted because of onDelete: Cascade in schema
export const deleteBuilding = async (id) => {
  return prisma.building.delete({ where: { id } });
};

// GET ALL ZONES OF A BUILDING
export const getBuildingZones = async (buildingId) => {
  return prisma.zone.findMany({
    where   : { building_id: buildingId },
    orderBy : { created_at: 'asc' },
  });
};