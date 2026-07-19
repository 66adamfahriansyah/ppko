/**
 * Utility module for Multi-Node Fuzzy Logic Data Fusion (4 Nodes)
 * E-BIO PENS IoT Monitoring System
 */

/**
 * Deret keanggotaan (Membership functions) untuk Sensor Hujan (0 - 100%)
 */
export function getRainMembership(x) {
  const kering = Math.max(0, Math.min(1, (30 - x) / 30));
  let lembap = 0;
  if (x >= 10 && x <= 35) {
    lembap = (x - 10) / 25;
  } else if (x > 35 && x <= 60) {
    lembap = (60 - x) / 25;
  }
  const hujan = Math.max(0, Math.min(1, (x - 40) / 30));

  return { kering, lembap, hujan };
}

/**
 * Konversi input kondisi/bacaan sensor hujan per-node menjadi nilai intensitas (0-100%)
 */
export function normalizeRainInput(val) {
  if (typeof val === 'number') {
    return Math.min(100, Math.max(0, val));
  }
  if (typeof val === 'string') {
    const s = val.toUpperCase();
    if (s.includes('HUJAN') || s.includes('BASAH') || s.includes('RAIN')) return 80;
    if (s.includes('GERIMIS') || s.includes('LEMBAP') || s.includes('MOIST')) return 45;
    if (s.includes('KERING') || s.includes('TIDAK') || s.includes('NO')) return 0;
  }
  return 0;
}

/**
 * Logika Fuzzy Fusion untuk Sensor Hujan dari 4 Node
 */
export function fuseRainSensors(nodes) {
  let totalWeight = 0;
  let weightedIntensitySum = 0;
  let validNodeCount = 0;

  nodes.forEach((node) => {
    const rawVal = node.rain ?? node.rainIntensity ?? node.rain_val ?? node.rainCondition ?? 0;
    const intensity = normalizeRainInput(rawVal);
    const isOnline = node.online !== false;

    if (isOnline) {
      const nodeWeight = 1.0;
      weightedIntensitySum += intensity * nodeWeight;
      totalWeight += nodeWeight;
      validNodeCount++;
    }
  });

  const fusedIntensity = totalWeight > 0 ? Math.round(weightedIntensitySum / totalWeight) : 0;
  const systemMem = getRainMembership(fusedIntensity);

  let status = 'KERING';
  let detection = 'TIDAK HUJAN';

  if (fusedIntensity >= 50 || systemMem.hujan > 0.5) {
    status = 'BASAH';
    detection = 'HUJAN';
  } else if (fusedIntensity >= 25 || systemMem.lembap > 0.4) {
    status = 'GERIMIS/LEMBAP';
    detection = 'HUJAN';
  } else {
    status = 'KERING';
    detection = 'TIDAK HUJAN';
  }

  return {
    status,
    detection,
    intensity: fusedIntensity,
    validNodeCount
  };
}

/**
 * Logika Fuzzy Fusion untuk Status Relay ON/OFF (Light Trap) dari 4 Node
 */
export function fuseRelaySensors(nodes) {
  let activeCount = 0;
  let totalOnline = 0;

  nodes.forEach((node) => {
    const isOnline = node.online !== false;
    if (isOnline) {
      totalOnline++;
      const relayState = node.relay ?? node.relayState ?? node.lightTrap ?? 0;
      const isActive = relayState === 1 || relayState === true || String(relayState).toUpperCase() === 'ON';
      if (isActive) {
        activeCount++;
      }
    }
  });

  // Skor Fuzzy Konsensus Relay untuk 4 Node:
  // 0 node active -> 0.0 (OFF)
  // 1 node active -> 0.25 (Noise -> OFF)
  // 2 node active -> 0.60 (Konsensus Cukup -> ON)
  // 3 node active -> 0.85 (Konsensus Kuat -> ON)
  // 4 node active -> 1.00 (Konsensus Mutlak -> ON)
  let fuzzyScore = 0.0;
  if (activeCount === 1) fuzzyScore = 0.25;
  else if (activeCount === 2) fuzzyScore = 0.60;
  else if (activeCount === 3) fuzzyScore = 0.85;
  else if (activeCount >= 4) fuzzyScore = 1.00;

  const active = fuzzyScore >= 0.5;

  return {
    active,
    activeCount,
    totalOnline,
    fuzzyScore
  };
}

/**
 * Utama: Olah data payload MQTT dari 4 Node dengan Logika Fuzzy untuk Rain & Relay
 * @param {Object|Array} payload Payload telemetry dari MQTT
 */
export function processFuzzy4Nodes(payload) {
  let nodes = [];

  if (Array.isArray(payload)) {
    nodes = payload;
  } else if (Array.isArray(payload.nodes)) {
    nodes = payload.nodes;
  } else if (payload.node1 || payload.node2 || payload.node3 || payload.node4) {
    nodes = [
      payload.node1 || {},
      payload.node2 || {},
      payload.node3 || {},
      payload.node4 || {}
    ];
  } else if (payload.aggregate) {
    nodes = [
      payload.aggregate,
      payload.aggregate,
      payload.aggregate,
      payload.aggregate
    ];
  } else {
    nodes = [payload, payload, payload, payload];
  }

  // Pastikan 4 slot node terisi
  while (nodes.length < 4) {
    nodes.push({ id: nodes.length + 1, online: false, rain: 0, relay: 0 });
  }

  const node4List = nodes.slice(0, 4);

  const rainResult = fuseRainSensors(node4List);
  const relayResult = fuseRelaySensors(node4List);

  return {
    rain: {
      status: rainResult.status,
      detection: rainResult.detection,
      intensity: rainResult.intensity
    },
    lightTrap: {
      active: relayResult.active,
      triggerMode: 'Otomatis',
      duration: 4
    },
    fuzzyDetails: {
      rainValidNodes: rainResult.validNodeCount,
      relayActiveCount: relayResult.activeCount,
      relayFuzzyScore: relayResult.fuzzyScore
    }
  };
}
