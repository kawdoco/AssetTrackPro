import * as alertService from '../services/alertService.js';

export const createAlert = async (req, res) => {
  try {
    const {
      asset_id,
      event_id,
      alert_type,
      severity,
      message,
      resolution_notes,
    } = req.body;

    const result = await alertService.createAlert({
      asset_id,
      event_id,
      alert_type,
      severity,
      message,
      resolution_notes,
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Create alert error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create alert',
    });
  }
};

export const getAlerts = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', status = 'All', severity = 'All', assetId } = req.query;

    const result = await alertService.getAlerts({
      page,
      limit,
      search,
      status,
      severity,
      assetId,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch alerts',
    });
  }
};

export const getAlertById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await alertService.getAlertById(id);

    res.status(200).json(result);
  } catch (error) {
    console.error('Get alert error:', error);
    if (error.message === 'Alert not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch alert',
    });
  }
};

export const acknowledgeAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await alertService.updateAlertStatus(id, 'Acknowledged');

    res.status(200).json(result);
  } catch (error) {
    console.error('Acknowledge alert error:', error);
    if (error.message === 'Alert not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(400).json({
      success: false,
      message: error.message || 'Failed to acknowledge alert',
    });
  }
};

export const resolveAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolution_notes } = req.body;

    const result = await alertService.updateAlertStatus(id, 'Resolved', resolution_notes);

    res.status(200).json(result);
  } catch (error) {
    console.error('Resolve alert error:', error);
    if (error.message === 'Alert not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(400).json({
      success: false,
      message: error.message || 'Failed to resolve alert',
    });
  }
};
