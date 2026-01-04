/* ASCII-only JS */
"use strict";

const APP_TITLE = "W&B for Ultralight Version 2.04 by Egill Ibsen";
const ADD_AIRCRAFT_OPTION = "Add Aircraft type...";
const CUSTOM_TYPES_KEY = "wb_ultralight_custom_aircraft_types_v2_02";
const DISCLAIMER_SHORT = "DISCLAIMER: Use at your own risk. Verify results against approved aircraft documentation.";

function loadCustomAircraftTypes() {
  try {
    const raw = localStorage.getItem(CUSTOM_TYPES_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    const out = [];
    const seen = {};
    for (const x of arr) {
      let s = String(x || "").trim();
      if (!s) continue;
      // ASCII only
      s = s.replace(/[^ -~]/g, "");
      s = s.trim();
      if (!s) continue;
      if (s === ADD_AIRCRAFT_OPTION) continue;
      if (s.length > 40) s = s.slice(0, 40).trim();
      const key = s.toLowerCase();
      if (seen[key]) continue;
      seen[key] = true;
      out.push(s);
    }
    return out;
  } catch (e) {
    return [];
  }
}

function saveCustomAircraftTypes(list) {
  try {
    localStorage.setItem(CUSTOM_TYPES_KEY, JSON.stringify(list || []));
  } catch (e) {
    // ignore
  }
}

function addAircraftTypePrompt() {
  const name0 = prompt("Enter aircraft type name (ASCII only):", "");
  if (name0 === null) return null;
  let name = String(name0 || "").trim();
  name = name.replace(/[^ -~]/g, "").trim();
  if (!name) return null;
  if (name.length > 40) name = name.slice(0, 40).trim();
  const builtIn = Object.keys(AIRCRAFT_PROFILES);
  const lower = (s) => String(s || "").toLowerCase();
  const allLower = {};
  for (const b of builtIn) allLower[lower(b)] = true;
  for (const c of loadCustomAircraftTypes()) allLower[lower(c)] = true;
  if (allLower[lower(name)]) return name; // already exists
  const custom = loadCustomAircraftTypes();
  custom.push(name);
  saveCustomAircraftTypes(custom);
  return name;
}


const AIRCRAFT_PROFILES = {
  "Skyranger Nynja 600": {
    "preset": true,
    "config": {
      "aircraft_name": "SkyRanger Nynja LS 600",
      "units": {
        "weight": "kg",
        "arm": "m"
      },
      "mtow_kg": 600.0,
      "datum_description": "Main wheel axle center (FoD positive, AoD negative)",
      "cg_limits_m_forward_of_datum": {
        "aft_limit": 0.21,
        "forward_limit": 0.367
      },
      "arms_m": {
        "nose_wheel": 1.45,
        "left_main_wheel": 0.0,
        "right_main_wheel": 0.0,
        "pilot_seat": {
          "aft_most": 0.15,
          "fwd_most": 0.15
        },
        "passenger_seat": {
          "aft_most": 0.15,
          "fwd_most": 0.15
        },
        "fuel": -0.29,
        "baggage": -0.29
      },
      "limits": {
        "seat_min_kg": 55.0,
        "seat_max_kg": 120.0,
        "total_seat_min_kg": 172.0,
        "baggage_max_kg": 10.0
      },
      "fuel": {
        "capacity_l": 73.0,
        "density_kg_per_l": 0.742
      },
      "index": {
        "moment_index_divisor": 1.0
      },
      "fixed_items": [
        {
          "name": "Aluminium fuel tank (empty) 7.5 kg (include only if not already in baseline)",
          "weight_kg": 7.5,
          "arm_m": -0.29
        }
      ]
    }
  },
  "Skyranger Nynja 450": {
    "preset": false
  },
  "Skyranger Swift": {
    "preset": false
  },
  "Zenith CH750 Cruzer": {
    "preset": true,
    "config": {
      "aircraft_name": "Zenith CH750 Cruzer",
      "units": {
        "weight": "kg",
        "arm": "m"
      },
      "mtow_kg": 655.0,
      "datum_description": "Plumb line from wing leading edge (FoD positive, AoD negative)",
      "cg_limits_m_forward_of_datum": {
        "aft_limit": -0.480,
        "forward_limit": -0.270
      },
      "arms_m": {
        "nose_wheel": -0.760,
        "left_main_wheel": 0.700,
        "right_main_wheel": 0.700,
        "pilot_seat": {
          "aft_most": -0.650,
          "fwd_most": -0.650
        },
        "passenger_seat": {
          "aft_most": -0.650,
          "fwd_most": -0.650
        },
        "fuel": 0.630,
        "baggage": 1.600
      },
      "limits": {
        "seat_min_kg": 0.0,
        "seat_max_kg": 0.0,
        "total_seat_min_kg": 0.0,
        "baggage_max_kg": 0.0
      },
      "fuel": {
        "capacity_l": 0.0,
        "density_kg_per_l": 0.742
      },
      "index": {
        "moment_index_divisor": 1.0
      },
      "fixed_items": []
    }
  },
  "ICP Savannah": {
    "preset": false
  },
  "Zenith 701": {
    "preset": false
  },
  "Zenith 750": {
    "preset": false
  },
  "Eurofox": {
    "preset": false
  }
};

const STORAGE_KEY = "wb_ultralight_state_v2_02_web";

function el(id) {
  return document.getElementById(id);
}

function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function fmt0(x) { if (!isFinite(x)) return "nan"; return String(Math.round(x)); }
function fmt1(x) { if (!isFinite(x)) return "nan"; return x.toFixed(1); }
function fmt2(x) { if (!isFinite(x)) return "nan"; return x.toFixed(2); }
function fmt3(x) { if (!isFinite(x)) return "nan"; return x.toFixed(3); }

function safeNum(v, defVal=null) {
  const s = String(v === undefined || v === null ? "" : v).trim();
  if (!s) return defVal;
  const n = Number(s);
  if (!isFinite(n)) throw new Error("Invalid number: " + s);
  return n;
}

function clampText(v, maxLen) {
  const s = String(v || "").trim();
  return s.length <= maxLen ? s : s.slice(0, maxLen);
}

function nowStamp() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,"0");
  const da = String(d.getDate()).padStart(2,"0");
  const hh = String(d.getHours()).padStart(2,"0");
  const mm = String(d.getMinutes()).padStart(2,"0");
  return y + "-" + m + "-" + da + " " + hh + ":" + mm;
}

function escapeHtml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const state = {
  tailwheelArmEdited: false,
  moreItems: [],
  lastEmptyComputed: null,
  currentPresetName: "Skyranger Nynja 600"
};

function defaultState() {
  return {
    isTailwheel: false,
    isTandem: false,
    tailwheelArmEdited: false,
    acType: "Skyranger Nynja 600",
fuelType: "mogas_e10_95",
    // Top fields
    fuelCap: "",
    mtow: "",
    cgAft: "",
    cgFwd: "",
    // Aircraft data
    armNose: "",
    armMainL: "",
    armMainR: "",
    idxDiv: "",
    armPilot: "",
    armPax: "",
    armFuel: "",
    armBag: "",
    fuelDens: "",
    seatMin: "",
    seatMax: "",
    seatTotalMin: "",
    bagMax: "",
    // Baseline
    noseLoad: "",
    leftLoad: "",
    rightLoad: "",
    emptyWt: "",
    emptyMoment: "",
    includeFixed: false,
    // Loading
    pilotKg: "",
    paxKg: "",
    fuelL: "",
    baggageKg: "",
    pilotSeat: "aft",
    paxSeat: "aft",
    // Extras
    exName1: "", exWt1: "", exArm1: "",
    exName2: "", exWt2: "", exArm2: "",
    exName3: "", exWt3: "", exArm3: "",
    moreItems: []
  };
}

function loadState() {
  const d = defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return d;
    const obj = JSON.parse(raw);
    
    try { obj.reg = ""; } catch (e) {}
return Object.assign(d, obj || {});
  } catch (e) {
    return d;
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collectState()));
  } catch (e) {
    // ignore
  }
}

function collectState() {
  return {
    acType: el("acType").value,
    isTailwheel: el("isTailwheel").checked,
    isTandem: el("isTandem").checked,
    tailwheelArmEdited: !!state.tailwheelArmEdited,
    fuelType: (el("fuelType") ? el("fuelType").value : "mogas_e10_95"),
    fuelCap: el("fuelCap").value,
    mtow: el("mtow").value,
    cgAft: el("cgAft").value,
    cgFwd: el("cgFwd").value,

    armNose: el("armNose").value,
    armMainL: el("armMainL").value,
    armMainR: el("armMainR").value,
    idxDiv: el("idxDiv").value,
    armPilot: el("armPilot").value,
    armPax: el("armPax").value,
    armFuel: el("armFuel").value,
    armBag: el("armBag").value,
    fuelDens: el("fuelDens").value,
    seatMin: el("seatMin").value,
    seatMax: el("seatMax").value,
    seatTotalMin: el("seatTotalMin").value,
    bagMax: el("bagMax").value,

    noseLoad: el("noseLoad").value,
    leftLoad: el("leftLoad").value,
    rightLoad: el("rightLoad").value,
    emptyWt: el("emptyWt").value,
    emptyMoment: el("emptyMoment").value,
    includeFixed: el("includeFixed").checked,

    pilotKg: el("pilotKg").value,
    paxKg: el("paxKg").value,
    fuelL: el("fuelL").value,
    baggageKg: el("baggageKg").value,
    pilotSeat: el("pilotSeat").value,
    paxSeat: el("paxSeat").value,

    exName1: el("exName1").value, exWt1: el("exWt1").value, exArm1: el("exArm1").value,
    exName2: el("exName2").value, exWt2: el("exWt2").value, exArm2: el("exArm2").value,
    exName3: el("exName3").value, exWt3: el("exWt3").value, exArm3: el("exArm3").value,

    moreItems: state.moreItems
  };
}

function setWarn(node, isWarn) {
  if (!node) return;
  try { node.classList.remove("warn"); } catch (e) {}
}


function populateAircraftDropdown() {
  const sel = el("acType");
  const prev = String(sel.value || "");
  sel.innerHTML = "";

  // Keep a stable order for built-in types
  const built = ["Skyranger Nynja 600", "Skyranger Nynja 450", "Skyranger Swift", "Zenith CH750 Cruzer", "ICP Savannah", "Zenith 701", "Zenith 750", "Eurofox"];
  for (const name of built) {
    if (!AIRCRAFT_PROFILES[name]) continue;
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    sel.appendChild(opt);
  }

  // Add custom types after built-ins
  for (const name of loadCustomAircraftTypes()) {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    sel.appendChild(opt);
  }

  // Add the special entry at the end
  const optAdd = document.createElement("option");
  optAdd.value = ADD_AIRCRAFT_OPTION;
  optAdd.textContent = ADD_AIRCRAFT_OPTION;
  sel.appendChild(optAdd);

  // Restore selection if possible
  if (prev) {
    const ok = Array.from(sel.options).some(o => o.value === prev);
    if (ok) sel.value = prev;
  }
}


function applyState(st) {
  el("acType").value = st.acType || "Skyranger Nynja 600";
  el("reg").value = st.reg || "";
  if (el("fuelType")) el("fuelType").value = st.fuelType || "mogas_e10_95";


  el("isTailwheel").checked = !!st.isTailwheel;
  el("isTandem").checked = !!st.isTandem;
  state.tailwheelArmEdited = !!st.tailwheelArmEdited;
  el("fuelCap").value = st.fuelCap || "";
  el("mtow").value = st.mtow || "";
  el("cgAft").value = st.cgAft || "";
  el("cgFwd").value = st.cgFwd || "";

  el("armNose").value = st.armNose || "";
  el("armMainL").value = st.armMainL || "";
  el("armMainR").value = st.armMainR || "";
  el("idxDiv").value = st.idxDiv || "";
  el("armPilot").value = st.armPilot || "";
  el("armPax").value = st.armPax || "";
  el("armFuel").value = st.armFuel || "";
  el("armBag").value = st.armBag || "";
  el("fuelDens").value = st.fuelDens || "";
  el("seatMin").value = st.seatMin || "";
  el("seatMax").value = st.seatMax || "";
  el("seatTotalMin").value = st.seatTotalMin || "";
  el("bagMax").value = st.bagMax || "";

  el("noseLoad").value = st.noseLoad || "";
  el("leftLoad").value = st.leftLoad || "";
  el("rightLoad").value = st.rightLoad || "";
  el("emptyWt").value = st.emptyWt || "";
  el("emptyMoment").value = st.emptyMoment || "";
  el("includeFixed").checked = !!st.includeFixed;

  el("pilotKg").value = st.pilotKg || "";
  el("paxKg").value = st.paxKg || "";
  el("fuelL").value = st.fuelL || "";
  el("baggageKg").value = st.baggageKg || "";
  el("pilotSeat").value = st.pilotSeat || "aft";
  el("paxSeat").value = st.paxSeat || "aft";

  el("exName1").value = st.exName1 || ""; el("exWt1").value = st.exWt1 || ""; el("exArm1").value = st.exArm1 || "";
  el("exName2").value = st.exName2 || ""; el("exWt2").value = st.exWt2 || ""; el("exArm2").value = st.exArm2 || "";
  el("exName3").value = st.exName3 || ""; el("exWt3").value = st.exWt3 || ""; el("exArm3").value = st.exArm3 || "";

  state.moreItems = Array.isArray(st.moreItems) ? st.moreItems : [];
  updateMoreCount();
}

function fillFromPreset(presetName) {
  try { el("reg").value = ""; } catch (e) {}
  const prof = AIRCRAFT_PROFILES[presetName];
  const isPreset = !!(prof && prof.preset && prof.config);
  state.currentPresetName = presetName;

  if (!isPreset) {
    // Clear all aircraft fields for manual entry
    el("fuelCap").value = "";
    el("mtow").value = "";
    el("cgAft").value = "";
    el("cgFwd").value = "";
    el("armNose").value = "";
    el("armMainL").value = "";
    el("armMainR").value = "";
    el("idxDiv").value = "";
    el("armPilot").value = "";
    el("armPax").value = "";
    el("armFuel").value = "";
    el("armBag").value = "";
    el("fuelDens").value = "";
    el("seatMin").value = "";
    el("seatMax").value = "";
    el("seatTotalMin").value = "";
    el("bagMax").value = "";
    el("includeFixed").checked = false;
    updateAll();
    return;
  }

  const cfg = deepCopy(prof.config);

  el("fuelCap").value = (cfg.fuel && Number(cfg.fuel.capacity_l) > 0) ? String(cfg.fuel.capacity_l) : "";
  el("mtow").value = String(cfg.mtow_kg);
  el("cgAft").value = String(cfg.cg_limits_m_forward_of_datum.aft_limit);
  el("cgFwd").value = String(cfg.cg_limits_m_forward_of_datum.forward_limit);

  el("armNose").value = String(cfg.arms_m.nose_wheel);
  el("armMainL").value = String(cfg.arms_m.left_main_wheel);
  el("armMainR").value = String(cfg.arms_m.right_main_wheel);
  el("idxDiv").value = String(cfg.index.moment_index_divisor);

  el("armPilot").value = String(cfg.arms_m.pilot_seat.aft_most);
  el("armPax").value = String(cfg.arms_m.passenger_seat.aft_most);
  el("armFuel").value = String(cfg.arms_m.fuel);
  el("armBag").value = String(cfg.arms_m.baggage);

  el("fuelDens").value = String(cfg.fuel.density_kg_per_l);
  el("seatMin").value = String(cfg.limits.seat_min_kg);
  el("seatMax").value = String(cfg.limits.seat_max_kg);
  el("seatTotalMin").value = String(cfg.limits.total_seat_min_kg);
  el("bagMax").value = String(cfg.limits.baggage_max_kg);

  updateAll();
}

function getConfigFromInputs() {
  // If the selected aircraft has a preset, it is used as "defaults" for warnings,
  // but computations always use the current input values.
  const acName = el("acType").value || "Custom";

  const mtow = safeNum(el("mtow").value, null);
  const aft = safeNum(el("cgAft").value, null);
  const fwd = safeNum(el("cgFwd").value, null);
  const fuelCap = safeNum(el("fuelCap").value, null);

  const armNose = safeNum(el("armNose").value, null);
  const armMainL = safeNum(el("armMainL").value, null);
  const armMainR = safeNum(el("armMainR").value, null);
  const idxDiv = safeNum(el("idxDiv").value, null);

  const armPilot = safeNum(el("armPilot").value, null);
  const armPax = safeNum(el("armPax").value, null);
  const armFuel = safeNum(el("armFuel").value, null);
  const armBag = safeNum(el("armBag").value, null);

  const fuelDens = safeNum(el("fuelDens").value, null);

  const seatMin = safeNum(el("seatMin").value, null);
  const seatMax = safeNum(el("seatMax").value, null);
  const seatTotalMin = safeNum(el("seatTotalMin").value, null);
  const bagMax = safeNum(el("bagMax").value, null);

  return {
    aircraft_name: acName,
    datum_description: "Main wheel axle center (FoD positive, AoD negative)",
    mtow_kg: mtow,
    cg_limits_m_forward_of_datum: { aft_limit: aft, forward_limit: fwd },
    arms_m: {
      nose_wheel: armNose,
      left_main_wheel: armMainL,
      right_main_wheel: armMainR,
      pilot_seat: { aft_most: armPilot, fwd_most: armPilot },
      passenger_seat: { aft_most: armPax, fwd_most: armPax },
      fuel: armFuel,
      baggage: armBag
    },
    fuel: { capacity_l: fuelCap, density_kg_per_l: fuelDens },
    limits: {
      seat_min_kg: seatMin,
      seat_max_kg: seatMax,
      total_seat_min_kg: seatTotalMin,
      baggage_max_kg: bagMax
    },
    index: { moment_index_divisor: idxDiv },
    fixed_items: (AIRCRAFT_PROFILES["Skyranger Nynja 600"] && acName === "Skyranger Nynja 600") ? deepCopy(AIRCRAFT_PROFILES["Skyranger Nynja 600"].config.fixed_items) : []
  };
}

function validateConfig(cfg) {
  const missing = [];
  function req(val, name) {
    if (val === null || val === undefined || !isFinite(val)) missing.push(name);
  }
  req(cfg.mtow_kg, "MTOW");
  req(cfg.cg_limits_m_forward_of_datum.aft_limit, "CG aft limit");
  req(cfg.cg_limits_m_forward_of_datum.forward_limit, "CG fwd limit");
  req(cfg.fuel.capacity_l, "Fuel capacity");
  req(cfg.fuel.density_kg_per_l, "Fuel density");
  req(cfg.index.moment_index_divisor, "Moment index divisor");

  req(cfg.arms_m.nose_wheel, "Nose wheel arm");
  req(cfg.arms_m.left_main_wheel, "Left main arm");
  req(cfg.arms_m.right_main_wheel, "Right main arm");
  req(cfg.arms_m.pilot_seat.aft_most, "Pilot seat arm");
  req(cfg.arms_m.passenger_seat.aft_most, "Passenger seat arm");
  req(cfg.arms_m.fuel, "Fuel arm");
  req(cfg.arms_m.baggage, "Baggage arm");

  req(cfg.limits.seat_min_kg, "Seat min");
  req(cfg.limits.seat_max_kg, "Seat max");
  req(cfg.limits.total_seat_min_kg, "Total seat min");
  req(cfg.limits.baggage_max_kg, "Baggage max");

  return missing;
}

function getLimits(cfg) {
  const a = Number(cfg.cg_limits_m_forward_of_datum.aft_limit);
  const f = Number(cfg.cg_limits_m_forward_of_datum.forward_limit);
  return [Math.min(a,f), Math.max(a,f)];
}

function getIndexDivisor(cfg) {
  const d = Number(cfg.index.moment_index_divisor);
  return (d === 0) ? 1 : d;
}

function fixedItemsTotals(cfg) {
  const items = Array.isArray(cfg.fixed_items) ? cfg.fixed_items : [];
  let tw = 0;
  let tm = 0;
  const lines = [];
  for (const it of items) {
    const name = String(it.name || "item");
    const w = Number(it.weight_kg || 0);
    const arm = Number(it.arm_m || 0);
    if (!isFinite(w) || !isFinite(arm) || Math.abs(w) < 1e-12) continue;
    tw += w;
    tm += w * arm;
    lines.push("  + " + name + ": " + fmt3(w) + " kg at " + fmt3(arm) + " m -> " + fmt3(w*arm) + " kg*m");
  }
  return {
    tw: tw,
    tm: tm,
    lines: lines.length ? lines.join("\n") : "  (none)"
  };
}

function calcFromWheels(cfg, nose, left, right) {
  const arms = cfg.arms_m;
  const totalWt = nose + left + right;
  const totalMom = nose * Number(arms.nose_wheel) + left * Number(arms.left_main_wheel) + right * Number(arms.right_main_wheel);
  const cg = totalWt ? totalMom / totalWt : NaN;
  const idx = totalMom / getIndexDivisor(cfg);
  return {
    weight_kg: totalWt,
    moment_kgm: totalMom,
    cg_m: cg,
    index: idx
  };
}

function currentEmptyPoint(cfg) {
  const wt = safeNum(el("emptyWt").value, null);
  const mom = safeNum(el("emptyMoment").value, null);
  if (wt !== null && mom !== null && wt > 0) {
    return {
      weight_kg: wt,
      moment_kgm: mom,
      cg_m: mom / wt,
      index: mom / getIndexDivisor(cfg)
    };
  }

  const nose = safeNum(el("noseLoad").value, null);
  const left = safeNum(el("leftLoad").value, null);
  const right = safeNum(el("rightLoad").value, null);
  if (nose === null || left === null || right === null) return null;
  if (nose + left + right <= 0) return null;
  return calcFromWheels(cfg, nose, left, right);
}

function readExtraItems() {
  const out = [];
  function addOne(nameId, wtId, armId) {
    const name = String(el(nameId).value || "").trim();
    if (!name) return;
    const w = safeNum(el(wtId).value, 0);
    const arm = safeNum(el(armId).value, 0);
    if (!isFinite(w) || !isFinite(arm) || Math.abs(w) < 1e-12) return;
    out.push([name, w, arm]);
  }
  addOne("exName1","exWt1","exArm1");
  addOne("exName2","exWt2","exArm2");
  addOne("exName3","exWt3","exArm3");

  for (const it of state.moreItems) {
    const name = String(it.name || "").trim();
    if (!name) continue;
    const w = Number(it.weight || 0);
    const arm = Number(it.arm || 0);
    if (!isFinite(w) || !isFinite(arm) || Math.abs(w) < 1e-12) continue;
    out.push([name, w, arm]);
  }
  return out;
}

function calcLoaded(cfg, emptyWt, emptyMom) {
  const dens = Number(cfg.fuel.density_kg_per_l);
  const cap = Number(cfg.fuel.capacity_l);

  const pilot = safeNum(el("pilotKg").value, 0) || 0;
  const pax = safeNum(el("paxKg").value, 0) || 0;
  const fuelL = safeNum(el("fuelL").value, 0) || 0;
  const baggage = safeNum(el("baggageKg").value, 0) || 0;

  if (fuelL < 0) throw new Error("Fuel litres cannot be negative.");
  if (cap > 0 && fuelL > cap) throw new Error("Fuel litres exceed capacity (" + fmt1(cap) + " L).");

  let wt = emptyWt;
  let mom = emptyMom;

  let fixedWt = 0;
  let fixedMom = 0;
  let fixedDetail = "  (none)";
  if (el("includeFixed").checked) {
    const fx = fixedItemsTotals(cfg);
    fixedWt = fx.tw;
    fixedMom = fx.tm;
    fixedDetail = fx.lines;
    wt += fixedWt;
    mom += fixedMom;
  }

  if (pilot) {
    wt += pilot;
    mom += pilot * Number(cfg.arms_m.pilot_seat.aft_most);
  }
  if (pax) {
    wt += pax;
    mom += pax * Number(cfg.arms_m.passenger_seat.aft_most);
  }

  const fuelKg = fuelL * dens;
  if (fuelKg) {
    wt += fuelKg;
    mom += fuelKg * Number(cfg.arms_m.fuel);
  }
  if (baggage) {
    wt += baggage;
    mom += baggage * Number(cfg.arms_m.baggage);
  }

  const extra = readExtraItems();
  const extraLines = [];
  for (const [name, w, arm] of extra) {
    wt += w;
    mom += w * arm;
    extraLines.push("  + " + name + ": " + fmt3(w) + " kg at " + fmt3(arm) + " m -> " + fmt3(w*arm) + " kg*m");
  }

  const cg = wt ? mom / wt : NaN;
  const idx = mom / getIndexDivisor(cfg);

  return {
    weight_kg: wt,
    moment_kgm: mom,
    cg_m: cg,
    index: idx,
    fuel_kg: fuelKg,
    fixed_wt: fixedWt,
    fixed_mom: fixedMom,
    fixed_detail: fixedDetail,
    extra_detail: extraLines.length ? extraLines.join("\n") : "  (none)",
    pilot: pilot,
    pax: pax,
    baggage: baggage,
    fuel_l: fuelL
  };
}

function statusLines(cfg, totalWt, cg, pilot, pax, baggage) {
  const mtow = Number(cfg.mtow_kg);
  const [lo, hi] = getLimits(cfg);

  const withinW = totalWt <= mtow + 1e-9;
  const withinCg = (cg >= lo - 1e-12) && (cg <= hi + 1e-12);

  const lim = cfg.limits;
  const seatMin = Number(lim.seat_min_kg);
  const seatMax = Number(lim.seat_max_kg);
  const totalSeatMin = Number(lim.total_seat_min_kg);
  const bagMax = Number(lim.baggage_max_kg);

  const seatW = pilot + pax;

  let seatNote = "Seat limits: OK";
  if (pilot && (pilot < seatMin || pilot > seatMax)) seatNote = "Seat limits: PILOT outside " + fmt0(seatMin) + ".." + fmt0(seatMax) + " kg";
  if (pax && (pax < seatMin || pax > seatMax)) {
    if (seatNote === "Seat limits: OK") seatNote = "Seat limits: PAX outside " + fmt0(seatMin) + ".." + fmt0(seatMax) + " kg";
    else seatNote += " AND PAX outside " + fmt0(seatMin) + ".." + fmt0(seatMax) + " kg";
  }

  let totalNote = "Total seat weight: OK";
  if (seatW && seatW < totalSeatMin) totalNote = "Total seat weight: " + fmt1(seatW) + " kg is below " + fmt1(totalSeatMin) + " kg (placard if used)";

  let bagNote = "Baggage limit: OK";
  if (baggage > bagMax + 1e-9) bagNote = "Baggage limit: OVER (" + fmt1(baggage) + " kg > " + fmt1(bagMax) + " kg)";

  return [
    "MTOW check: " + fmt2(totalWt) + " kg <= " + fmt1(mtow) + " kg -> " + (withinW ? "OK" : "OVER"),
    "CG check: " + fmt3(cg) + " m in [" + fmt3(lo) + ".." + fmt3(hi) + "] -> " + (withinCg ? "OK" : "OUT OF LIMITS"),
    seatNote,
    totalNote,
    bagNote
  ];
}

function computeEmptyFromWheels(showError=true) {
  try {
    const cfg = getConfigFromInputs();
    const missing = validateConfig(cfg);
    if (missing.length) throw new Error("Missing aircraft data: " + missing.join(", "));

    const nose = safeNum(el("noseLoad").value, null);
    const left = safeNum(el("leftLoad").value, null);
    const right = safeNum(el("rightLoad").value, null);
    if (nose === null || left === null || right === null) throw new Error("Enter all 3 wheel loads.");
    const res = calcFromWheels(cfg, nose, left, right);
    state.lastEmptyComputed = res;
    el("emptyFromWheelsSummary").textContent =
      "Computed EMPTY: weight " + fmt2(res.weight_kg) + " kg, moment " + fmt3(res.moment_kgm) + " kg*m, CG " + fmt3(res.cg_m) + " m FoD, index " + fmt3(res.index);
    return res;
  } catch (e) {
    state.lastEmptyComputed = null;
    el("emptyFromWheelsSummary").textContent = "";
    if (showError) alert(e.message || String(e));
    return null;
  }
}

function copyComputedEmpty() {
  if (!state.lastEmptyComputed) {
    const res = computeEmptyFromWheels(false);
    if (!res) {
      alert("Compute EMPTY from wheel loads first.");
      return;
    }
  }
  el("emptyWt").value = fmt3(state.lastEmptyComputed.weight_kg);
  el("emptyMoment").value = fmt3(state.lastEmptyComputed.moment_kgm);
  updateAll();
}

function computeLoaded(showError=true) {
  try {
    const cfg = getConfigFromInputs();
    const missing = validateConfig(cfg);
    if (missing.length) throw new Error("Missing aircraft data: " + missing.join(", "));

    const empty = currentEmptyPoint(cfg);
    if (!empty) throw new Error("Enter baseline (weight + moment) or fill all 3 wheel loads.");

    const res = calcLoaded(cfg, empty.weight_kg, empty.moment_kgm);
    return { cfg: cfg, empty: empty, loaded: res };
  } catch (e) {
    if (showError) alert(e.message || String(e));
    return null;
  }
}

function updateHighlights(cfg) {
  // highlight fuel capacity if not 73 L
  const cap = safeNum(el("fuelCap").value, null);
  if (cap !== null) setWarn(el("fuelCap"), Math.abs(cap - 73.0) > 1e-9);
  else setWarn(el("fuelCap"), false);
}

function updateFixedInfo(cfg) {
  const fx = fixedItemsTotals(cfg);
  const cap = cfg.fuel.capacity_l;
  const dens = cfg.fuel.density_kg_per_l;
  const cnt = Array.isArray(cfg.fixed_items) ? cfg.fixed_items.length : 0;
  el("fixedItemsInfo").textContent = "Fuel density: " + fmt3(dens) + " kg/L | Fuel cap: " + fmt1(cap) + " L | Fixed items: " + String(cnt) + (cnt ? (" | Totals: " + fmt3(fx.tw) + " kg, " + fmt3(fx.tm) + " kg*m") : "");
}

function updateBanner(cfg) {
  const reg = String(el("reg").value || "").trim().toUpperCase();
  const mtow = cfg.mtow_kg;
  const [lo, hi] = (isFinite(cfg.cg_limits_m_forward_of_datum.aft_limit) && isFinite(cfg.cg_limits_m_forward_of_datum.forward_limit)) ? getLimits(cfg) : [NaN, NaN];
  const cap = cfg.fuel.capacity_l;

  let regTxt = reg ? (" | Reg: " + reg) : "";
  el("banner").textContent =
    "A/C: " + cfg.aircraft_name + regTxt +
    " | MTOW: " + (isFinite(mtow) ? fmt1(mtow) : "n/a") + " kg" +
    " | CG limits: " + (isFinite(lo) ? fmt3(lo) : "n/a") + ".." + (isFinite(hi) ? fmt3(hi) : "n/a") + " m FoD" +
    " | Fuel cap: " + (isFinite(cap) ? fmt1(cap) : "n/a") + " L";
}

function buildResultsText(bundle) {
  const lines = [];
  if (!bundle || !bundle.cfg) {
    lines.push(APP_TITLE + " (Web)");
    lines.push(DISCLAIMER_SHORT);
    lines.push("");
    lines.push("Date/time: " + nowStamp());
    lines.push("");
    lines.push("Select A/C Type and enter aircraft data to compute.");
    return lines.join("\n");
  }

  const cfg = bundle.cfg;
  const [lo, hi] = getLimits(cfg);

  lines.push(APP_TITLE + " (Web)");
  lines.push(DISCLAIMER_SHORT);
  lines.push("");
  lines.push("Date/time: " + nowStamp());
  lines.push("A/C type: " + cfg.aircraft_name);
  lines.push("Datum: " + cfg.datum_description);
  lines.push("Fuel capacity: " + fmt1(cfg.fuel.capacity_l) + " L");
  lines.push("MTOW: " + fmt1(cfg.mtow_kg) + " kg");
  lines.push("CG limits (m FoD): " + fmt3(lo) + " .. " + fmt3(hi));
  lines.push("");

  if (bundle.empty) {
    const e = bundle.empty;
    lines.push("EMPTY");
    lines.push("  Weight: " + fmt2(e.weight_kg) + " kg");
    lines.push("  Moment: " + fmt3(e.moment_kgm) + " kg*m");
    lines.push("  CG:     " + fmt3(e.cg_m) + " m FoD");
    lines.push("  Index:  " + fmt3(e.index));
  } else {
    lines.push("EMPTY: (not available)");
  }
  lines.push("");

  lines.push("LOAD INPUTS");
  lines.push("  Pilot:     " + fmt1(safeNum(el("pilotKg").value, 0) || 0) + " kg");
  lines.push("  Passenger: " + fmt1(safeNum(el("paxKg").value, 0) || 0) + " kg");
  lines.push("  Fuel:      " + fmt1(safeNum(el("fuelL").value, 0) || 0) + " L");
  lines.push("  Baggage:   " + fmt1(safeNum(el("baggageKg").value, 0) || 0) + " kg");
  lines.push("  Include fixed items: " + (el("includeFixed").checked ? "YES" : "NO"));
  lines.push("");

  if (bundle.loaded) {
    const r = bundle.loaded;
    lines.push("LOADED");
    lines.push("  Weight: " + fmt2(r.weight_kg) + " kg");
    lines.push("  Moment: " + fmt3(r.moment_kgm) + " kg*m");
    lines.push("  CG:     " + fmt3(r.cg_m) + " m FoD");
    lines.push("  Index:  " + fmt3(r.index));
    lines.push("");
    lines.push("Checks:");
    for (const ln of statusLines(cfg, r.weight_kg, r.cg_m, r.pilot, r.pax, r.baggage)) lines.push("  " + ln);
    lines.push("");
    if (el("includeFixed").checked) {
      lines.push("Fixed items included:");
      lines.push(r.fixed_detail);
      lines.push("Fixed items total: " + fmt3(r.fixed_wt) + " kg, " + fmt3(r.fixed_mom) + " kg*m");
      lines.push("");
    }
    lines.push("Extra items:");
    lines.push(r.extra_detail);
  } else {
    lines.push("LOADED: (not available)");
  }

  return lines.join("\n");
}

function updateMoreCount() {
  el("moreCount").textContent = "More items: " + state.moreItems.length;
}

function drawCharts(bundle) {
  const show = el("chartCard").style.display !== "none";
  if (show) drawChartToCanvas(el("chart"), bundle);
}

function drawChartToCanvas(canvas, bundle) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Clear
  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0,0,W,H);

  if (!bundle || !bundle.cfg || !bundle.loaded) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0,0,W,H);
    ctx.fillStyle = "#000000";
    ctx.font = "14px Arial";
    ctx.fillText("Enter aircraft data and compute LOADED to show chart.", 20, 40);
    return;
  }

  const cfg = bundle.cfg;
  const mtow = Number(cfg.mtow_kg);
  const [lo, hi] = getLimits(cfg);

  const empty = bundle.empty || null;
  const loaded = bundle.loaded || null;

  const xPad = 0.05;
  const xMin = Math.min(lo, hi) - xPad;
  const xMax = Math.max(lo, hi) + xPad;

  let yMax = mtow;
  if (empty) yMax = Math.max(yMax, empty.weight_kg);
  if (loaded) yMax = Math.max(yMax, loaded.weight_kg);
  yMax = yMax * 1.10;
  if (yMax < 10) yMax = 10;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0,0,W,H);

  const marginL = 60;
  const marginR = 20;
  const marginT = 30;
  const marginB = 50;

  const plotW = W - marginL - marginR;
  const plotH = H - marginT - marginB;

  function xToPx(x) { return marginL + (x - xMin) * plotW / (xMax - xMin); }
  function yToPx(y) { return marginT + (yMax - y) * plotH / (yMax); }

  // grid
  ctx.strokeStyle = "#d0d0d0";
  ctx.lineWidth = 1;
  for (let i=0;i<=10;i++) {
    const y = (yMax * i / 10);
    const py = yToPx(y);
    ctx.beginPath();
    ctx.moveTo(marginL, py);
    ctx.lineTo(marginL+plotW, py);
    ctx.stroke();
  }
  for (let i=0;i<=10;i++) {
    const x = xMin + (xMax-xMin) * i / 10;
    const px = xToPx(x);
    ctx.beginPath();
    ctx.moveTo(px, marginT);
    ctx.lineTo(px, marginT+plotH);
    ctx.stroke();
  }

  // envelope
  ctx.fillStyle = "rgba(37,99,235,0.12)";
  const x1 = xToPx(lo);
  const x2 = xToPx(hi);
  ctx.fillRect(Math.min(x1,x2), marginT, Math.abs(x2-x1), plotH);

  // axes
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(marginL, marginT);
  ctx.lineTo(marginL, marginT+plotH);
  ctx.lineTo(marginL+plotW, marginT+plotH);
  ctx.stroke();

  // limit lines
  ctx.setLineDash([6,4]);
  ctx.strokeStyle = "#000000";
  ctx.beginPath();
  ctx.moveTo(xToPx(lo), marginT);
  ctx.lineTo(xToPx(lo), marginT+plotH);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(xToPx(hi), marginT);
  ctx.lineTo(xToPx(hi), marginT+plotH);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(marginL, yToPx(mtow));
  ctx.lineTo(marginL+plotW, yToPx(mtow));
  ctx.stroke();
  ctx.setLineDash([]);

  // labels
  ctx.fillStyle = "#000000";
  ctx.font = "12px Arial";
  ctx.fillText("CG (m FoD)", Math.floor(marginL + plotW/2 - 35), H-18);
  ctx.save();
  ctx.translate(18, Math.floor(marginT + plotH/2 + 35));
  ctx.rotate(-Math.PI/2);
  ctx.fillText("Weight (kg)", 0, 0);
  ctx.restore();

  ctx.font = "11px Arial";
  ctx.fillText("lo " + fmt3(lo), xToPx(lo) + 4, marginT + 12);
  ctx.fillText("hi " + fmt3(hi), xToPx(hi) + 4, marginT + 24);
  ctx.fillText("MTOW " + fmt1(mtow), marginL + 4, yToPx(mtow) - 6);

  // ticks
  ctx.fillStyle = "#000000";
  ctx.font = "10px Arial";
  for (let i=0;i<=5;i++) {
    const y = yMax * i / 5;
    const py = yToPx(y);
    ctx.fillText(fmt0(y), 8, py+3);
  }
  for (let i=0;i<=5;i++) {
    const x = xMin + (xMax-xMin) * i / 5;
    const px = xToPx(x);
    ctx.fillText(fmt3(x), px-12, H-34);
  }

  function plotPoint(pt, label) {
    const px = xToPx(pt.cg_m);
    const py = yToPx(pt.weight_kg);
    ctx.fillStyle = "#111827";
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = "#000000";
    ctx.font = "12px Arial";
    ctx.fillText(label, px + 8, py - 8);
    ctx.font = "11px Arial";
    ctx.fillText("W " + fmt1(pt.weight_kg) + "  CG " + fmt3(pt.cg_m), px + 8, py + 8);
  }

  if (empty) plotPoint(empty, "EMPTY");
  if (loaded) plotPoint(loaded, "LOADED");

  ctx.fillStyle = "#000000";
  ctx.font = "14px Arial";
  ctx.fillText("W&B chart (updated " + (new Date()).toLocaleTimeString() + ")", marginL, 20);
}

function toggleChart() {
  const card = el("chartCard");
  if (card.style.display === "none") {
    card.style.display = "block";
    el("btnToggleChart").textContent = "Hide W&B chart";
  } else {
    card.style.display = "none";
    el("btnToggleChart").textContent = "Show W&B chart";
  }
  updateAll();
}

function resetToPreset() {
  const name = el("acType").value;
  fillFromPreset(name);
}

function clearAircraftData() {
  // Keep selection; clear aircraft data inputs and top fields (except reg)
  el("fuelCap").value = "";
  el("mtow").value = "";
  el("cgAft").value = "";
  el("cgFwd").value = "";
  el("armNose").value = "";
  el("armMainL").value = "";
  el("armMainR").value = "";
  el("idxDiv").value = "";
  el("armPilot").value = "";
  el("armPax").value = "";
  el("armFuel").value = "";
  el("armBag").value = "";
  el("fuelDens").value = "";
  el("seatMin").value = "";
  el("seatMax").value = "";
  el("seatTotalMin").value = "";
  el("bagMax").value = "";
  el("includeFixed").checked = false;
  updateAll();
}

function openMoreModal() {
  el("modalBackdrop").style.display = "block";
  el("moreModal").style.display = "block";
  buildMoreTable();
}

function closeMoreModal() {
  el("modalBackdrop").style.display = "none";
  el("moreModal").style.display = "none";
}

function openHelp() {
  el("modalBackdrop").style.display = "block";
  el("helpModal").style.display = "block";
  el("helpText").textContent = buildHelpText();
}

function closeHelp() {
  el("modalBackdrop").style.display = "none";
  el("helpModal").style.display = "none";
}

function buildMoreTable() {
  const host = el("moreTable");
  host.innerHTML = "";

  function addCell(node) { host.appendChild(node); }

  const h1 = document.createElement("div"); h1.className = "h"; h1.textContent = "Name";
  const h2 = document.createElement("div"); h2.className = "h"; h2.textContent = "Weight (kg)";
  const h3 = document.createElement("div"); h3.className = "h"; h3.textContent = "Arm (m)";
  const h4 = document.createElement("div"); h4.className = "h"; h4.textContent = "";
  addCell(h1); addCell(h2); addCell(h3); addCell(h4);

  for (let i=0;i<state.moreItems.length;i++) {
    const it = state.moreItems[i];

    const name = document.createElement("input");
    name.type = "text";
    name.maxLength = 80;
    name.value = it.name || "";
    name.addEventListener("input", () => it.name = name.value);

    const wt = document.createElement("input");
    wt.type = "number";
    wt.step = "0.1";
    wt.value = (it.weight !== undefined) ? it.weight : "";
    wt.addEventListener("input", () => it.weight = wt.value);

    const arm = document.createElement("input");
    arm.type = "number";
    arm.step = "0.001";
    arm.value = (it.arm !== undefined) ? it.arm : "";
    arm.addEventListener("input", () => it.arm = arm.value);

    const del = document.createElement("button");
    del.className = "btn secondary";
    del.textContent = "Remove";
    del.addEventListener("click", () => {
      state.moreItems.splice(i,1);
      buildMoreTable();
      updateMoreCount();
    });

    addCell(name); addCell(wt); addCell(arm); addCell(del);
  }
}

function addMoreRow() {
  state.moreItems.push({ name: "", weight: "", arm: "" });
  buildMoreTable();
  updateMoreCount();
}

function moreOK() {
  const cleaned = [];
  for (const it of state.moreItems) {
    const name = String(it.name || "").trim();
    if (!name) continue;
    const w = Number(String(it.weight || "").trim());
    const arm = Number(String(it.arm || "").trim());
    if (!isFinite(w) || !isFinite(arm) || Math.abs(w) < 1e-12) continue;
    cleaned.push({ name: name, weight: w, arm: arm });
  }
  state.moreItems = cleaned;
  updateMoreCount();
  closeMoreModal();
  updateAll();
}

function clearExtras() {
  el("exName1").value = ""; el("exWt1").value = ""; el("exArm1").value = "";
  el("exName2").value = ""; el("exWt2").value = ""; el("exArm2").value = "";
  el("exName3").value = ""; el("exWt3").value = ""; el("exArm3").value = "";
  state.moreItems = [];
  updateMoreCount();
  updateAll();
}

function doPrint() {
  const bundle = computeLoaded(false);
  if (!bundle) return;

  const reg = String(el("reg").value || "").trim().toUpperCase();
  const title = "Loadsheet - " + APP_TITLE;
  const text = buildResultsText(bundle);

  // Render chart to an offscreen canvas
  const off = document.createElement("canvas");
  off.width = 900;
  off.height = 650;
  drawChartToCanvas(off, bundle);
  const imgData = off.toDataURL("image/png");

  const w = window.open("", "_blank");
  if (!w) {
    alert("Popup blocked. Please allow popups to print.");
    return;
  }

  const css = `
    body { font-family: Arial, sans-serif; margin: 14mm; color: #000; }
    .reg { text-align: center; font-weight: 800; font-size: 18px; margin-bottom: 4mm; }
    .title { font-weight: 800; font-size: 14px; margin-bottom: 2mm; }
    .meta { font-size: 11px; margin-bottom: 4mm; }
    pre { white-space: pre-wrap; border: 1px solid #999; padding: 8px; font-size: 10px; }
    img { width: 100%; border: 1px solid #999; margin-top: 6mm; }
  `;

  const html = `
    <!doctype html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>${title}</title>
      <style>${css}</style>
    </head>
    <body>
      <div class="reg">${reg ? reg : ""}</div>
      <div class="title">Loadsheet</div>
      <div class="meta">${bundle.cfg.aircraft_name} | ${nowStamp()}</div>
      <pre>${escapeHtml(text)}</pre>
      <img src="${imgData}" alt="W&B chart">
      <script>
        window.onload = function() {
          setTimeout(function(){ window.print(); }, 150);
        };
      </script>
    </body>
    </html>
  `;
  w.document.open();
  w.document.write(html);
  w.document.close();
}

function buildHelpText() {
  const lines = [];
  lines.push(APP_TITLE + " (Web) - Help");
  lines.push("");
  lines.push("DISCLAIMER");
  lines.push("  Use at your own risk. Verify all results against approved aircraft documentation.");
  lines.push("  The author accepts no liability for errors or misuse.");
  lines.push("");
  lines.push("A/C Type:");
  lines.push("  - Skyranger Nynja 600: preset values are loaded automatically.");
  lines.push("  - Other aircraft: aircraft data fields are cleared. Enter all required aircraft data.");
  lines.push("");
  lines.push("How to use:");
  lines.push("  1) Select A/C Type and make sure aircraft data is filled.");
  lines.push("  2) Enter wheel loads and compute EMPTY, or enter empty weight + empty moment.");
  lines.push("  3) Enter pilot/pax/fuel/baggage and compute LOADED.");
  lines.push("  4) Show chart if desired. Print/Export creates a one-page loadsheet.");
  lines.push("");
  lines.push("Datum convention:");
  lines.push("  - Datum is main wheel axles (arm 0).");
  lines.push("  - FoD (forward of datum) is positive. AoD (aft of datum) is negative.");
  lines.push("");
  lines.push("Offline:");
  lines.push("  - Offline install (Add to Home Screen) works best when hosted on HTTPS.");
  return lines.join("\n");
}


function updateTailwheelUI(userToggled=false) {
  const cb = el("isTailwheel");
  if (!cb) return;
  const isTw = !!cb.checked;

  // Wheel load label
  const lb = el("noseLoadLabel") || document.querySelector('label[for="noseLoad"]');
  if (lb) lb.textContent = isTw ? "Tail wheel wt (kg)" : "Nose wheel wt (kg)";

  // Arm label inside Aircraft data
  const armLb = el("armNoseLabel") || document.querySelector('label[for="armNose"]');
  if (armLb) armLb.textContent = isTw ? "Arm tail wheel (m FoD)" : "Arm nose wheel (m FoD)";

  // Warning text
  const hint = el("tailwheelHint");
  if (hint) {
    hint.textContent = isTw ? "WARNING: Tailwheel mode only changes labels. Set wheel arm in Aircraft data." : "";
  }

  // Auto-open Aircraft data when tailwheel selected
  const det = el("acData");
  if (det && isTw) {
    det.setAttribute("open", "");
    det.open = true;
    try { det.scrollIntoView({ behavior: "smooth", block: "start" }); } catch (e) {}
    // iOS sometimes needs a second tick
    setTimeout(() => {
      try { det.scrollIntoView({ behavior: "smooth", block: "start" }); } catch (e) {}
    }, 80);
  }

  // Mark wheel arm field as needing review until edited
  if (userToggled && isTw) {
    state.tailwheelArmEdited = false;
  }

  const armIn = el("armNose");
  if (armIn) {
    if (isTw && !state.tailwheelArmEdited) armIn.classList.add("danger");
    else armIn.classList.remove("danger");
  }
}

function updateFuelTypeUI() {
  const sel = el("fuelType") ? String(el("fuelType").value || "") : "mogas_e10_95";
  let dens = null;
  if (sel === "mogas_e10_95") dens = 0.742;
  else if (sel === "avgas_100ll") dens = 0.710;
  else if (sel === "mogas_e5_95") dens = 0.751;
  else dens = null;

  const densEl = el("fuelDens");
  if (!densEl) return;

  if (dens !== null) {
    densEl.value = String(dens.toFixed(3));
    densEl.readOnly = true;
  } else {
    densEl.readOnly = false;
    if (!String(densEl.value || "").trim()) densEl.value = "0.742";
  }
}



function updateTandemUI() {
  const cb = el("isTandem");
  if (!cb) return;
  const isTan = !!cb.checked;

  const p = el("pilotSeatField");
  const q = el("paxSeatField");
  if (p) p.style.display = isTan ? "none" : "";
  if (q) q.style.display = isTan ? "none" : "";

  const hint = el("tandemHint");
  if (hint) {
    hint.textContent = isTan ? "Tandem: seat arms come from Aircraft data (pilot/passenger arms). Fwd/aft selectors hidden." :
                               "Tandem: OFF. Fwd/aft seat selectors are available.";
  }
}

function updateAll() {
  try { updateTailwheelUI();
  updateFuelTypeUI(); } catch (e) {}
  try { updateTandemUI(); } catch (e) {}
  try { updateTandemUI(); } catch (e) {}
  // Hide JS warning if JS runs
  try {
    const w = el("jsWarning");
    if (w) w.style.display = "none";
  } catch (e) {}

  const cfg = getConfigFromInputs();
  updateHighlights(cfg);
  updateFixedInfo(cfg);
  updateBanner(cfg);

  // Update empty-from-wheels summary live if possible
  try {
    const n = String(el("noseLoad").value || "").trim();
    const l = String(el("leftLoad").value || "").trim();
    const r = String(el("rightLoad").value || "").trim();
    if (n && l && r && validateConfig(cfg).length === 0) computeEmptyFromWheels(false);
    else el("emptyFromWheelsSummary").textContent = "";
  } catch (e) {
    el("emptyFromWheelsSummary").textContent = "";
  }

  const bundle = computeLoaded(false);
  el("results").textContent = buildResultsText(bundle);
  drawCharts(bundle);

  saveState();
}

function setup() {
  // Populate dropdown
  populateAircraftDropdown();

  // Load saved state
  const st = loadState();
  applyState(st);
  updateFuelTypeUI();
  try { updateTailwheelUI(); } catch (e) {}

  // If Skyranger Nynja 600 is selected, always load the preset aircraft data
  // (this also corrects older saved values, e.g. CG fwd limit 0.38 -> 0.367)
  if (el("acType").value === "Skyranger Nynja 600") {
    fillFromPreset("Skyranger Nynja 600");
  }


  // Listeners
  el("acType").addEventListener("change", () => {
    const v = el("acType").value;
    if (v === ADD_AIRCRAFT_OPTION) {
      const name = addAircraftTypePrompt();
      populateAircraftDropdown();
      if (name) {
        el("acType").value = name;
        fillFromPreset(name);
      } else {
        // restore previous selection
        const st = loadState();
        const prev = st.acType || "Skyranger Nynja 600";
        el("acType").value = prev;
        fillFromPreset(prev);
      }
      return;
    }
    fillFromPreset(v);
  });

  
  el("isTailwheel").addEventListener("change", () => { updateTailwheelUI(true); updateAll(); });
el("resetLimits").addEventListener("click", resetToPreset);
  el("btnClearAircraftData").addEventListener("click", clearAircraftData);

  el("btnEmptyFromWheels").addEventListener("click", () => { computeEmptyFromWheels(true); updateAll(); });
  el("btnCopyEmpty").addEventListener("click", copyComputedEmpty);
  el("btnComputeLoaded").addEventListener("click", () => { const b = computeLoaded(true); if (b) updateAll(); });
  el("btnToggleChart").addEventListener("click", toggleChart);

  el("btnMoreItems").addEventListener("click", openMoreModal);
  el("btnClearExtras").addEventListener("click", clearExtras);
  el("btnAddMoreRow").addEventListener("click", addMoreRow);
  el("btnMoreOK").addEventListener("click", moreOK);
  el("btnCloseMore").addEventListener("click", closeMoreModal);

  el("btnHelp").addEventListener("click", openHelp);
  el("btnCloseHelp").addEventListener("click", closeHelp);

  el("modalBackdrop").addEventListener("click", () => {
    closeMoreModal();
    closeHelp();
  });

  el("btnPrint").addEventListener("click", doPrint);

  // Input listeners -> updateAll
  const ids = [
    "reg","fuelType","fuelCap","mtow","cgAft","cgFwd",
    "armNose","armMainL","armMainR","idxDiv","armPilot","armPax","armFuel","armBag",
    "fuelDens","seatMin","seatMax","seatTotalMin","bagMax",
    "noseLoad","leftLoad","rightLoad","emptyWt","emptyMoment",
    "pilotKg","paxKg","fuelL","baggageKg",
    "pilotSeat","paxSeat",
    "exName1","exWt1","exArm1",
    "exName2","exWt2","exArm2",
    "exName3","exWt3","exArm3",
    "includeFixed"
    ,"isTailwheel"
    ,"isTandem"
  ];
  for (const id of ids) {
    const node = el(id);
    if (!node) continue;
    const ev = (node.tagName === "SELECT" || node.type === "checkbox") ? "change" : "input";
    node.addEventListener(ev, () => updateAll());
    if (ev === "change") node.addEventListener("input", () => updateAll());
  }

  // Tailwheel: mark wheel arm as edited when user changes it
  const armIn = el("armNose");
  if (armIn) {
    armIn.addEventListener("input", () => {
      if (el("isTailwheel") && el("isTailwheel").checked) {
        state.tailwheelArmEdited = true;
      }
    });
  }

  el("btnToggleChart").textContent = "Show W&B chart";
  updateAll();
}

setup();
