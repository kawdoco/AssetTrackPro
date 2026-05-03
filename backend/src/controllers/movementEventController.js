import * as movementService from '../services/movementEventService.js';
import { normalizePayload } from '../utils/rfidEventProcessor.js';

export const handleRfidWebhook = async (req, res) => {
  try {
    const raw = req.body;

    // Accept arrays of reads or single object
    const records = Array.isArray(raw) ? raw : [raw];

    const results = [];

    for (const rec of records) {
      const normalized = normalizePayload(rec);

      if (!normalized || !normalized.assetTagUid) {
        // skip invalid record but report
        results.push({ success: false, message: 'Invalid payload or missing tag id', raw: rec });
        continue;
      }

      if (normalized.gateId === undefined || normalized.gateId === null || normalized.gateId === '') {
        results.push({ success: false, message: 'gate_id is required for webhook', raw: rec });
        continue;
      }

      // For webhook, organization context may not exist; require org_id in payload
      const orgId = req.body.organization_id || rec.organization_id || req.query.organization_id;

      if (!orgId) {
        results.push({ success: false, message: 'organization_id is required for webhook', raw: rec });
        continue;
      }

      try {
        const event = await movementService.recordMovementEvent(orgId, normalized);
        results.push({ success: true, data: event });
      } catch (err) {
        results.push({ success: false, message: err.message });
      }
    }

    res.status(201).json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Webhook processing failed' });
  }
};

export const getAllMovementEvents = async (req, res) => {
  try {
    const data = await movementService.listMovementEvents(req.organization_id, req.query);
    res.status(200).json({ success: true, data: data.data, pagination: data.pagination });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Failed to fetch movement events' });
  }
};

export const getMovementEventById = async (req, res) => {
  try {
    const event = await movementService.getMovementEventById(req.params.id, req.organization_id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Movement event not found' });
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Failed to fetch movement event' });
  }
};

export const simulateMovementEvent = async (req, res) => {
  try {
    const { asset_tag_uid, gate_id, event_type, signal_strength } = req.body;

    if (!asset_tag_uid || !gate_id) {
      return res.status(400).json({
        success: false,
        message: 'asset_tag_uid and gate_id are required'
      });
    }

    // Build a simulated RFID payload
    const simulatedPayload = {
      assetTagUid: asset_tag_uid,
      gateId: gate_id,
      eventTime: new Date(),
      signalStrength: signal_strength || -50,
      eventType: event_type || 'ENTER',
      triggerSource: 'SIMULATED'
    };

    // Record the simulated movement event
    const event = await movementService.recordMovementEvent(req.organization_id, simulatedPayload);

    res.status(201).json({
      success: true,
      message: 'Simulated movement event created',
      data: event
    });
  } catch (error) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to create simulated movement event'
    });
  }
};

export default {
  handleRfidWebhook,
  getAllMovementEvents,
  getMovementEventById,
  simulateMovementEvent,
};
