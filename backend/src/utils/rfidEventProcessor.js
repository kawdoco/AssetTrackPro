// Normalize various RFID reader payloads into a standard internal format

export const normalizePayload = (raw) => {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  // tag id (EPC) - common keys
  const assetTagUid = raw.tag_epc || raw.epc || raw.asset_tag_uid || raw.tag || raw.tagId || raw.tagIdHex || null;

  // gate / reader identification
  const gateId = raw.gate_id || raw.gateId || raw.reader_id || raw.readerId || raw.reader_mac || raw.reader_mac_address || null;

  // rssi / signal strength
  const signalStrength = raw.rssi || raw.signal_strength || raw.signalStrength || null;

  // timestamp
  let eventTime = null;
  if (raw.timestamp) {
    eventTime = new Date(raw.timestamp);
  } else if (raw.event_time) {
    eventTime = new Date(raw.event_time);
  } else if (raw.time) {
    eventTime = new Date(raw.time);
  }

  // event type (ENTER/EXIT) sometimes provided by middleware
  const eventType = raw.event_type || raw.eventType || null;

  const triggerSource = raw.trigger_source || raw.triggerSource || raw.source || 'RFID';

  return {
    assetTagUid: assetTagUid ? String(assetTagUid) : null,
    gateId: gateId !== undefined && gateId !== null ? gateId : null,
    signalStrength: signalStrength !== undefined && signalStrength !== null ? Number(signalStrength) : null,
    eventTime: eventTime instanceof Date && !isNaN(eventTime) ? eventTime : null,
    eventType: eventType ? String(eventType) : null,
    triggerSource: triggerSource ? String(triggerSource) : 'RFID',
    raw,
  };
};

export default { normalizePayload };