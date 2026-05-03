import prisma from '../config/prisma.js';

const toIntOrNull = (value) => {
  if (value === undefined || value === null || value === '') return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : null;
};

const movementEventSelect = {
  id: true,
  asset_id: true,
  gate_id: true,
  zone_from_id: true,
  zone_to_id: true,
  event_type: true,
  event_time: true,
  trigger_source: true,
  signal_strength: true,
  created_at: true,
  asset: {
    select: {
      id: true,
      asset_tag_uid: true,
      asset_type: true,
      status: true,
      last_seen_zone_id: true,
      last_seen_time: true,
    },
  },
  gate: {
    select: {
      id: true,
      gate_name: true,
      zone_id: true,
      direction: true,
    },
  },
  zone_from: {
    select: {
      id: true,
      zone_name: true,
      zone_type: true,
    },
  },
  zone_to: {
    select: {
      id: true,
      zone_name: true,
      zone_type: true,
    },
  },
};

export const recordMovementEvent = async (organizationId, normalizedEvent) => {
  if (!normalizedEvent || !normalizedEvent.assetTagUid) {
    const error = new Error('Invalid event payload: missing assetTagUid');
    error.statusCode = 400;
    throw error;
  }

  const orgId = toIntOrNull(organizationId);

  // Find asset by tag uid within organization
  const asset = await prisma.asset.findFirst({
    where: { asset_tag_uid: normalizedEvent.assetTagUid, organization_id: orgId },
    select: { id: true, last_seen_zone_id: true, status: true },
  });

  if (!asset) {
    const error = new Error('Asset not found');
    error.statusCode = 404;
    throw error;
  }

  if (asset.status !== 'ACTIVE') {
    const error = new Error('Asset is not ACTIVE');
    error.statusCode = 400;
    throw error;
  }

  // Gate lookup - gate id may be numeric or string
  const gateId = toIntOrNull(normalizedEvent.gateId) || normalizedEvent.gateId;

  const gate = await prisma.gate.findFirst({ where: { id: gateId }, select: { id: true, zone_id: true, is_active: true } });

  if (!gate) {
    const error = new Error('Gate not found');
    error.statusCode = 404;
    throw error;
  }

  if (!gate.is_active) {
    const error = new Error('Gate is not active');
    error.statusCode = 400;
    throw error;
  }

  const zoneToId = gate.zone_id;
  const zoneFromId = asset.last_seen_zone_id || null;

  const eventTime = normalizedEvent.eventTime || new Date();
  const eventType = normalizedEvent.eventType || 'ENTER';

  // Create movement event and update asset in a transaction
  const [movementEvent] = await prisma.$transaction([
    prisma.movementEvent.create({
      data: {
        asset_id: asset.id,
        gate_id: gate.id,
        zone_from_id: zoneFromId,
        zone_to_id: zoneToId,
        event_type: eventType,
        event_time: eventTime,
        trigger_source: normalizedEvent.triggerSource || 'RFID',
        signal_strength: normalizedEvent.signalStrength || null,
      },
      select: movementEventSelect,
    }),
    prisma.asset.update({
      where: { id: asset.id },
      data: { last_seen_zone_id: zoneToId, last_seen_time: eventTime },
    }),
  ]);

  return movementEvent;
};

export const listMovementEvents = async (organizationId, filters = {}) => {
  const orgId = toIntOrNull(organizationId);

  const where = {
    asset: { organization_id: orgId },
  };

  if (filters.asset_id) where.asset_id = toIntOrNull(filters.asset_id);
  if (filters.gate_id) where.gate_id = toIntOrNull(filters.gate_id);
  if (filters.event_type) where.event_type = filters.event_type;
  if (filters.trigger_source) where.trigger_source = filters.trigger_source;

  if (filters.from_date || filters.to_date) {
    where.event_time = {};
    if (filters.from_date) where.event_time.gte = new Date(filters.from_date);
    if (filters.to_date) where.event_time.lte = new Date(filters.to_date);
  }

  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || 25;
  const skip = (page - 1) * limit;

  const events = await prisma.movementEvent.findMany({
    where,
    orderBy: { event_time: 'desc' },
    take: limit,
    skip,
    select: movementEventSelect,
  });

  const total = await prisma.movementEvent.count({ where });

  return {
    data: events,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const getMovementEventById = async (id, organizationId) => {
  const normalizedId = toIntOrNull(id);
  const orgId = toIntOrNull(organizationId);

  if (normalizedId === null) return null;

  const event = await prisma.movementEvent.findFirst({
    where: { id: normalizedId, asset: { organization_id: orgId } },
    select: movementEventSelect,
  });

  return event;
};

export const getAssetLocation = async (assetId, organizationId) => {
  const normalizedAssetId = toIntOrNull(assetId);
  const orgId = toIntOrNull(organizationId);

  if (normalizedAssetId === null) return null;

  const asset = await prisma.asset.findFirst({
    where: { id: normalizedAssetId, organization_id: orgId },
    select: {
      id: true,
      asset_tag_uid: true,
      last_seen_zone_id: true,
      last_seen_time: true,
      last_seen_zone: { select: { id: true, zone_name: true, zone_type: true } },
    },
  });

  return asset;
};

export default {
  recordMovementEvent,
  listMovementEvents,
  getMovementEventById,
  getAssetLocation,
};
