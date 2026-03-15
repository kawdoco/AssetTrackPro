import prisma from '../config/prisma.js';

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

export const listAssets = async (organizationId, filters = {}) => {
  const where = {
    organization_id: organizationId,
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
  return prisma.asset.findFirst({
    where: {
      id,
      organization_id: organizationId,
    },
    select: assetSelect,
  });
};

export const createAsset = async (organizationId, assetData) => {
  const data = {
    organization_id: organizationId,
    asset_tag_uid: assetData.asset_tag_uid,
    asset_type: assetData.asset_type,
    model: assetData.model || null,
    serial_number: assetData.serial_number || null,
    status: assetData.status || 'ACTIVE',
    last_seen_zone_id: assetData.last_seen_zone_id || null,
    last_seen_time: assetData.last_seen_time ? new Date(assetData.last_seen_time) : null,
  };

  return prisma.asset.create({
    data,
    select: assetSelect,
  });
};

export const updateAsset = async (id, organizationId, assetData) => {
  const existingAsset = await prisma.asset.findFirst({
    where: {
      id,
      organization_id: organizationId,
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
  if (assetData.last_seen_zone_id !== undefined) data.last_seen_zone_id = assetData.last_seen_zone_id || null;
  if (assetData.last_seen_time !== undefined) {
    data.last_seen_time = assetData.last_seen_time ? new Date(assetData.last_seen_time) : null;
  }

  return prisma.asset.update({
    where: { id },
    data,
    select: assetSelect,
  });
};

export const deleteAsset = async (id, organizationId) => {
  const existingAsset = await prisma.asset.findFirst({
    where: {
      id,
      organization_id: organizationId,
    },
    select: { id: true },
  });

  if (!existingAsset) {
    return null;
  }

  await prisma.asset.delete({
    where: { id },
  });

  return { success: true, message: 'Asset deleted successfully' };
};