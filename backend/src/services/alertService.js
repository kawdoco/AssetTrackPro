import prisma from '../config/prisma.js';

export const createAlert = async (alertData) => {
  const {
    asset_id,
    event_id,
    alert_type,
    severity,
    message,
    resolution_notes,
  } = alertData;

  if (!asset_id) {
    throw new Error('Asset ID is required');
  }

  if (!alert_type || alert_type.trim() === '') {
    throw new Error('Alert type is required');
  }

  if (!severity || severity.trim() === '') {
    throw new Error('Severity is required');
  }

  if (!message || message.trim() === '') {
    throw new Error('Message is required');
  }

  const asset = await prisma.asset.findUnique({ where: { id: Number(asset_id) } });

  if (!asset) {
    throw new Error('Asset not found');
  }

  const alert = await prisma.alert.create({
    data: {
      asset_id: Number(asset_id),
      event_id: event_id ? Number(event_id) : null,
      alert_type: alert_type.trim(),
      severity: severity.trim(),
      status: 'Open',
      message: message.trim(),
      resolution_notes: resolution_notes || null,
    },
  });

  return {
    success: true,
    data: alert,
    message: 'Alert created successfully',
  };
};

export const getAlerts = async (params = {}) => {
  const {
    page = 1,
    limit = 20,
    search = '',
    status,
    severity,
    assetId,
  } = params;

  const skip = (Number(page) - 1) * Number(limit);

  const whereClause = {
    ...(search
      ? {
          OR: [
            { message: { contains: search, mode: 'insensitive' } },
            { alert_type: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}),
    ...(status && status !== 'All' ? { status } : {}),
    ...(severity && severity !== 'All' ? { severity } : {}),
    ...(assetId ? { asset_id: Number(assetId) } : {}),
  };

  const [alerts, total] = await Promise.all([
    prisma.alert.findMany({
      where: whereClause,
      include: {
        asset: {
          select: {
            id: true,
            asset_tag_uid: true,
            asset_type: true,
            status: true,
          },
        },
        movement_event: {
          select: {
            id: true,
            event_type: true,
            event_time: true,
            zone_from_id: true,
            zone_to_id: true,
          },
        },
      },
      skip,
      take: Number(limit),
      orderBy: {
        created_at: 'desc',
      },
    }),
    prisma.alert.count({ where: whereClause }),
  ]);

  return {
    success: true,
    data: alerts,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

export const getAlertById = async (alertId) => {
  const id = Number(alertId);
  if (!Number.isInteger(id)) {
    throw new Error('Invalid alert ID');
  }

  const alert = await prisma.alert.findUnique({
    where: { id },
    include: {
      asset: {
        select: {
          id: true,
          asset_tag_uid: true,
          asset_type: true,
          status: true,
        },
      },
      movement_event: {
        select: {
          id: true,
          event_type: true,
          event_time: true,
          zone_from_id: true,
          zone_to_id: true,
        },
      },
    },
  });

  if (!alert) {
    throw new Error('Alert not found');
  }

  return {
    success: true,
    data: alert,
  };
};

export const updateAlertStatus = async (alertId, status, resolution_notes) => {
  const id = Number(alertId);
  if (!Number.isInteger(id)) {
    throw new Error('Invalid alert ID');
  }

  const existingAlert = await prisma.alert.findUnique({ where: { id } });
  if (!existingAlert) {
    throw new Error('Alert not found');
  }

  const updateData = {
    status,
    updated_at: new Date(),
  };

  if (status === 'Resolved') {
    updateData.resolution_notes = resolution_notes || existingAlert.resolution_notes || null;
    updateData.resolved_at = new Date();
  }

  const alert = await prisma.alert.update({
    where: { id },
    data: updateData,
  });

  return {
    success: true,
    data: alert,
    message: `Alert marked as ${status}`,
  };
};
