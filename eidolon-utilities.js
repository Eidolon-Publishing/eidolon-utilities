var xr = Object.defineProperty;
var pa = Object.getPrototypeOf;
var ya = Reflect.get;
var Br = (e) => {
  throw TypeError(e);
};
var Ta = (e, t, i) => t in e ? xr(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i;
var s = (e, t) => xr(e, "name", { value: t, configurable: !0 });
var Ze = (e, t, i) => Ta(e, typeof t != "symbol" ? t + "" : t, i), Sn = (e, t, i) => t.has(e) || Br("Cannot " + i);
var g = (e, t, i) => (Sn(e, t, "read from private field"), i ? i.call(e) : t.get(e)), I = (e, t, i) => t.has(e) ? Br("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), A = (e, t, i, n) => (Sn(e, t, "write to private field"), n ? n.call(e, i) : t.set(e, i), i), C = (e, t, i) => (Sn(e, t, "access private method"), i);
var yt = (e, t, i) => ya(pa(e), i, t);
const O = "eidolon-utilities", Di = "timeTriggerActive", Rn = "timeTriggerHideWindow", _n = "timeTriggerShowPlayerWindow", Fn = "timeTriggerAllowRealTime", fo = "timeTriggers", bi = "timeTriggerHistory", Hn = "debug", $n = "timeFormat", kn = "manageTime", qn = "secondsPerRound";
const ba = [-30, -15, -5, 5, 15, 30], Lt = 1440 * 60, Ei = "playSound", li = 6;
function f(e, t) {
  var i, n;
  return (n = (i = game.i18n) == null ? void 0 : i.has) != null && n.call(i, e) ? game.i18n.localize(e) : t;
}
s(f, "localize");
function Ri(e) {
  return typeof e != "string" ? "" : e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
s(Ri, "escapeHtml");
function Ue(e) {
  var t;
  return e == null ? e : (t = foundry == null ? void 0 : foundry.utils) != null && t.duplicate ? foundry.utils.duplicate(e) : JSON.parse(JSON.stringify(e));
}
s(Ue, "duplicateData");
function Ea() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
s(Ea, "generateTriggerId");
function go(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  if (!t) return null;
  const i = t.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (!i) return null;
  const n = Number(i[1]), r = Number(i[2]), o = i[3] !== void 0 ? Number(i[3]) : 0;
  return !Number.isInteger(n) || !Number.isInteger(r) || !Number.isInteger(o) || n < 0 || n > 23 || r < 0 || r > 59 || o < 0 || o > 59 ? null : n * 3600 + r * 60 + o;
}
s(go, "parseTriggerTimeToSeconds");
function xt() {
  var e, t;
  return ((e = game.scenes) == null ? void 0 : e.current) ?? ((t = game.scenes) == null ? void 0 : t.active) ?? null;
}
s(xt, "getActiveScene");
function Fe(e) {
  return (e == null ? void 0 : e.object) ?? (e == null ? void 0 : e.document) ?? null;
}
s(Fe, "getSceneFromApplication");
function pe(e) {
  return e && typeof e.getFlag == "function" && typeof e.setFlag == "function";
}
s(pe, "hasSceneDocument");
const Pn = /* @__PURE__ */ new Set(), xn = /* @__PURE__ */ new Set(), Bn = /* @__PURE__ */ new Set(), Un = /* @__PURE__ */ new Set();
let ft = !1, Gt = !1, _i = li, Fi = "12h", Ur = !1;
function On(e) {
  ft = !!e;
  for (const t of Pn)
    try {
      t(ft);
    } catch (i) {
      console.error(`${O} | Debug change handler failed`, i);
    }
}
s(On, "notifyDebugChange");
function wn(e) {
  Gt = !!e;
  for (const t of xn)
    try {
      t(Gt);
    } catch (i) {
      console.error(`${O} | Manage time change handler failed`, i);
    }
}
s(wn, "notifyManageTimeChange");
function mo(e) {
  return e === "24h" ? "24h" : "12h";
}
s(mo, "normalizeTimeFormatValue");
function Er(e) {
  const t = Number(e);
  return !Number.isFinite(t) || t <= 0 ? li : t;
}
s(Er, "normalizeSecondsPerRoundValue");
function vn(e) {
  const t = Er(e);
  _i = t;
  for (const i of Bn)
    try {
      i(t);
    } catch (n) {
      console.error(`${O} | Seconds-per-round change handler failed`, n);
    }
}
s(vn, "notifySecondsPerRoundChange");
function In(e) {
  const t = mo(e);
  Fi = t;
  for (const i of Un)
    try {
      i(t);
    } catch (n) {
      console.error(`${O} | Time format change handler failed`, n);
    }
}
s(In, "notifyTimeFormatChange");
function La() {
  var t;
  if (Ur) return;
  if (Ur = !0, !((t = game == null ? void 0 : game.settings) != null && t.register)) {
    console.warn(
      `${O} | game.settings.register is unavailable. Module settings could not be registered.`
    );
    return;
  }
  const e = typeof game.settings.registerChange == "function";
  game.settings.register(O, Hn, {
    name: f("EIDOLON.TimeTrigger.DebugSettingName", "Enable debug logging"),
    hint: f(
      "EIDOLON.TimeTrigger.DebugSettingHint",
      "Write detailed time-trigger diagnostics to the browser console."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: e ? void 0 : On
  }), e && game.settings.registerChange(O, Hn, On), ft = Lr(), On(ft), game.settings.register(O, kn, {
    name: f("EIDOLON.TimeTrigger.ManageTimeSettingName", "Manage Game Time"),
    hint: f(
      "EIDOLON.TimeTrigger.ManageTimeSettingHint",
      "Allow Eidolon Utilities to advance world time automatically while the game is unpaused. Warning: This may conflict with other time-management modules."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: e ? void 0 : wn
  }), e && game.settings.registerChange(O, kn, wn), Gt = Sa(), wn(Gt), game.settings.register(O, qn, {
    name: f(
      "EIDOLON.TimeTrigger.SecondsPerRoundSettingName",
      "Seconds Per Combat Round"
    ),
    hint: f(
      "EIDOLON.TimeTrigger.SecondsPerRoundSettingHint",
      "Amount of world seconds to add whenever a combat round ends while time management is active."
    ),
    scope: "world",
    config: !0,
    type: Number,
    default: li,
    range: { min: 1, max: 3600, step: 1 },
    onChange: e ? void 0 : vn
  }), e && game.settings.registerChange(
    O,
    qn,
    vn
  ), _i = Er(Oa()), vn(_i), game.settings.register(O, $n, {
    name: f("EIDOLON.TimeTrigger.TimeFormatSettingName", "Trigger Time Format"),
    hint: f(
      "EIDOLON.TimeTrigger.TimeFormatSettingHint",
      "Control whether trigger times use a 12-hour or 24-hour clock."
    ),
    scope: "world",
    config: !0,
    type: String,
    choices: {
      "12h": f(
        "EIDOLON.TimeTrigger.TimeFormatSettingChoice12Hour",
        "12-hour (e.g. 2:30 PM)"
      ),
      "24h": f(
        "EIDOLON.TimeTrigger.TimeFormatSettingChoice24Hour",
        "24-hour (e.g. 14:30)"
      )
    },
    default: "12h",
    onChange: e ? void 0 : In
  }), e && game.settings.registerChange(O, $n, In), Fi = mo(ho()), In(Fi);
}
s(La, "registerTimeTriggerSettings");
function Lr() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get)
      return !!game.settings.get(O, Hn);
  } catch (t) {
    console.error(`${O} | Failed to read debug setting`, t);
  }
  return !1;
}
s(Lr, "getDebugSetting");
function Ca() {
  return ft = Lr(), ft;
}
s(Ca, "refreshDebugSettingCache");
function Sa() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get)
      return !!game.settings.get(O, kn);
  } catch (t) {
    console.error(`${O} | Failed to read manage time setting`, t);
  }
  return !1;
}
s(Sa, "getManageTimeSetting");
function ho() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get)
      return game.settings.get(O, $n) === "24h" ? "24h" : "12h";
  } catch (t) {
    console.error(`${O} | Failed to read time format setting`, t);
  }
  return "12h";
}
s(ho, "getTimeFormatSetting");
function Oa() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get) {
      const t = game.settings.get(O, qn);
      return Er(t);
    }
  } catch (t) {
    console.error(`${O} | Failed to read seconds-per-round setting`, t);
  }
  return li;
}
s(Oa, "getSecondsPerRoundSetting");
function wa(e) {
  if (typeof e != "function")
    return () => {
    };
  Pn.add(e);
  try {
    e(ft);
  } catch (t) {
    console.error(`${O} | Debug change handler failed`, t);
  }
  return () => {
    Pn.delete(e);
  };
}
s(wa, "onDebugSettingChange");
function po(e) {
  if (typeof e != "function")
    return () => {
    };
  xn.add(e);
  try {
    e(Gt);
  } catch (t) {
    console.error(`${O} | Manage time change handler failed`, t);
  }
  return () => {
    xn.delete(e);
  };
}
s(po, "onManageTimeSettingChange");
function Cr(e) {
  if (typeof e != "function")
    return () => {
    };
  Un.add(e);
  try {
    e(Fi);
  } catch (t) {
    console.error(`${O} | Time format change handler failed`, t);
  }
  return () => {
    Un.delete(e);
  };
}
s(Cr, "onTimeFormatSettingChange");
function va(e) {
  if (typeof e != "function")
    return () => {
    };
  Bn.add(e);
  try {
    e(_i);
  } catch (t) {
    console.error(`${O} | Seconds-per-round change handler failed`, t);
  }
  return () => {
    Bn.delete(e);
  };
}
s(va, "onSecondsPerRoundSettingChange");
let pn = !1, Vn = !1;
function jn(e) {
  pn = !!e;
}
s(jn, "updateDebugState");
function yo() {
  Vn || (Vn = !0, jn(Lr()), wa((e) => {
    jn(e), console.info(`${O} | Debug ${pn ? "enabled" : "disabled"}`);
  }));
}
s(yo, "ensureInitialized");
function Sr() {
  return Vn || yo(), pn;
}
s(Sr, "shouldLog");
function To(e) {
  if (!e.length)
    return [`${O} |`];
  const [t, ...i] = e;
  return typeof t == "string" ? [`${O} | ${t}`, ...i] : [`${O} |`, t, ...i];
}
s(To, "formatArgs");
function Ia() {
  yo();
}
s(Ia, "initializeDebug");
function Ma() {
  return jn(Ca()), pn;
}
s(Ma, "syncDebugState");
function E(...e) {
  Sr() && console.debug(...To(e));
}
s(E, "debugLog");
function Mt(...e) {
  Sr() && console.group(...To(e));
}
s(Mt, "debugGroup");
function Ye() {
  Sr() && console.groupEnd();
}
s(Ye, "debugGroupEnd");
function Ct(e) {
  var r;
  const t = (r = e == null ? void 0 : e.getFlag) == null ? void 0 : r.call(e, O, fo);
  if (!t) return [];
  const i = Ue(t), n = Array.isArray(i) ? i : [];
  return E("Loaded time triggers", {
    sceneId: (e == null ? void 0 : e.id) ?? null,
    count: n.length
  }), n;
}
s(Ct, "getTimeTriggers");
async function bo(e, t) {
  e != null && e.setFlag && (E("Persisting time triggers", {
    sceneId: e.id,
    count: Array.isArray(t) ? t.length : 0
  }), await e.setFlag(O, fo, t));
}
s(bo, "setTimeTriggers");
function Aa(e) {
  var r;
  const t = (r = e == null ? void 0 : e.getFlag) == null ? void 0 : r.call(e, O, bi);
  if (!t) return {};
  const i = Ue(t);
  if (!i || typeof i != "object") return {};
  const n = {};
  for (const [o, a] of Object.entries(i))
    typeof a == "number" && Number.isFinite(a) && (n[o] = a);
  return E("Loaded time trigger history", {
    sceneId: (e == null ? void 0 : e.id) ?? null,
    keys: Object.keys(n)
  }), n;
}
s(Aa, "getTimeTriggerHistory");
async function Mn(e, t) {
  var c, d, u, m;
  if (!e) return;
  const i = {};
  if (t && typeof t == "object")
    for (const [h, p] of Object.entries(t))
      typeof p == "number" && Number.isFinite(p) && (i[h] = p);
  const n = ((c = e.getFlag) == null ? void 0 : c.call(e, O, bi)) ?? {}, r = {};
  if (n && typeof n == "object")
    for (const [h, p] of Object.entries(n))
      typeof p == "number" && Number.isFinite(p) && (r[h] = p);
  const o = Object.keys(i), a = Object.keys(r);
  if (typeof ((d = foundry == null ? void 0 : foundry.utils) == null ? void 0 : d.deepEqual) == "function" ? foundry.utils.deepEqual(r, i) : JSON.stringify(r) === JSON.stringify(i)) {
    E("Skip history update because state is unchanged", {
      sceneId: (e == null ? void 0 : e.id) ?? null
    });
    return;
  }
  E("Updating time trigger history", {
    sceneId: (e == null ? void 0 : e.id) ?? null,
    keys: o,
    removedKeys: a.filter((h) => !o.includes(h))
  });
  try {
    a.length && typeof e.unsetFlag == "function" && await e.unsetFlag(O, bi), o.length && await e.setFlag(O, bi, i);
  } catch (h) {
    console.error(`${O} | Failed to persist time trigger history`, h), (m = (u = ui.notifications) == null ? void 0 : u.error) == null || m.call(
      u,
      f(
        "EIDOLON.TimeTrigger.HistoryPersistError",
        "Failed to persist the scene's time trigger history."
      )
    );
  }
}
s(Mn, "updateTimeTriggerHistory");
const Hi = /* @__PURE__ */ new Map(), Vr = /* @__PURE__ */ new Set();
function Na(e) {
  if (!(e != null && e.id))
    throw new Error(`${O} | Action definitions require an id.`);
  if (Hi.has(e.id))
    throw new Error(`${O} | Duplicate time trigger action id: ${e.id}`);
  Hi.set(e.id, {
    ...e
  }), E("Registered time trigger action", { actionId: e.id });
}
s(Na, "registerAction");
function ci(e) {
  return Hi.get(e) ?? null;
}
s(ci, "getAction");
function Da(e) {
  const t = ci(e);
  return t ? typeof t.label == "function" ? t.label() : t.label : e;
}
s(Da, "getActionLabel");
function jr() {
  return Array.from(Hi.values());
}
s(jr, "listActions");
async function Eo(e, t) {
  var n, r;
  const i = ci(t == null ? void 0 : t.action);
  if (!i || typeof i.execute != "function") {
    const o = f(
      "EIDOLON.TimeTrigger.UnknownAction",
      "Encountered an unknown time trigger action and skipped it."
    );
    (r = (n = ui.notifications) == null ? void 0 : n.warn) == null || r.call(n, o), console.warn(`${O} | Unknown time trigger action`, t), E("Encountered unknown time trigger action", {
      triggerId: (t == null ? void 0 : t.id) ?? null,
      actionId: (t == null ? void 0 : t.action) ?? null
    });
    return;
  }
  E("Executing action handler", {
    actionId: i.id,
    triggerId: (t == null ? void 0 : t.id) ?? null,
    sceneId: (e == null ? void 0 : e.id) ?? null
  }), await i.execute({ scene: e, trigger: t });
}
s(Eo, "executeTriggerAction");
function Ra(e) {
  const t = ci(e == null ? void 0 : e.action);
  return !t || typeof t.buildSummaryParts != "function" ? [] : t.buildSummaryParts({ trigger: e, escapeHtml: Ri, localize: f }) ?? [];
}
s(Ra, "buildActionSummaryParts");
function _a(e) {
  const t = ci(e == null ? void 0 : e.action);
  return !t || typeof t.buildFormContent != "function" ? "" : t.buildFormContent({ trigger: e, escapeHtml: Ri, localize: f }) ?? "";
}
s(_a, "buildActionFormSection");
function Fa(e, t) {
  const i = ci(e == null ? void 0 : e.action);
  !i || typeof i.prepareFormData != "function" || i.prepareFormData({ trigger: e, formData: t });
}
s(Fa, "applyActionFormData");
function Ha(e, t, i) {
  var o, a;
  const n = `${(e == null ? void 0 : e.id) ?? "unknown"}:${(t == null ? void 0 : t.id) ?? (t == null ? void 0 : t.action) ?? "unknown"}:${i}`;
  if (Vr.has(n)) return;
  Vr.add(n);
  const r = f(
    "EIDOLON.TimeTrigger.MissingDataWarning",
    "A scene time trigger is missing required data and was skipped."
  );
  (a = (o = ui.notifications) == null ? void 0 : o.warn) == null || a.call(o, r), console.warn(`${O} | Missing trigger data (${i})`, { scene: e == null ? void 0 : e.id, trigger: t });
}
s(Ha, "warnMissingTriggerData");
async function $a({ scene: e, trigger: t }) {
  var o, a, l, c, d;
  const i = (l = (a = (o = t == null ? void 0 : t.data) == null ? void 0 : o.path) == null ? void 0 : a.trim) == null ? void 0 : l.call(a);
  if (!i) {
    Ha(e, t, "missing-audio-path");
    return;
  }
  const n = {
    src: i,
    autoplay: !0,
    loop: !1
  }, r = (() => {
    var u, m, h, p, y;
    return typeof ((m = (u = foundry == null ? void 0 : foundry.audio) == null ? void 0 : u.AudioHelper) == null ? void 0 : m.play) == "function" ? foundry.audio.AudioHelper.play(n, !0) : typeof ((p = (h = game == null ? void 0 : game.audio) == null ? void 0 : h.constructor) == null ? void 0 : p.play) == "function" ? game.audio.constructor.play(n, !0) : typeof ((y = game == null ? void 0 : game.audio) == null ? void 0 : y.play) == "function" ? game.audio.play(n, !0) : null;
  })();
  if (!r) {
    console.error(`${O} | Foundry audio helper is unavailable`), (d = (c = ui.notifications) == null ? void 0 : c.error) == null || d.call(
      c,
      f(
        "EIDOLON.TimeTrigger.AudioHelperUnavailable",
        "Unable to play audio for a time trigger because the Foundry audio helper is unavailable."
      )
    );
    return;
  }
  await r;
}
s($a, "executePlaySoundAction");
Na({
  id: Ei,
  label: /* @__PURE__ */ s(() => f("EIDOLON.TimeTrigger.ActionPlaySound", "Play Sound"), "label"),
  execute: $a,
  buildSummaryParts: /* @__PURE__ */ s(({ trigger: e, escapeHtml: t, localize: i }) => {
    var r;
    return (r = e == null ? void 0 : e.data) != null && r.path ? [`${t(i("EIDOLON.TimeTrigger.TriggerSound", "Sound File"))}: ${t(e.data.path)}`] : [];
  }, "buildSummaryParts"),
  buildFormContent: /* @__PURE__ */ s(({ trigger: e, escapeHtml: t, localize: i }) => {
    var l;
    const n = t(i("EIDOLON.TimeTrigger.TriggerSound", "Sound File")), r = t(
      i("EIDOLON.TimeTrigger.TriggerChooseFile", "Select File")
    ), o = t(
      i(
        "EIDOLON.TimeTrigger.TriggerSoundNotes",
        "Select or upload the audio file that should play when this trigger fires."
      )
    ), a = t(((l = e == null ? void 0 : e.data) == null ? void 0 : l.path) ?? "");
    return `
      <label>${n}</label>
      <div class="form-fields">
        <input type="text" name="playSoundPath" value="${a}" data-dtype="String">
        <button
          type="button"
          class="file-picker icon-only"
          data-action-file-picker
          data-type="audio"
          data-target="playSoundPath"
          aria-label="${r}"
          title="${r}"
        >
          <i class="fa-solid fa-folder-open" aria-hidden="true"></i>
        </button>
      </div>
      <p class="hint">${o}</p>
    `;
  }, "buildFormContent"),
  prepareFormData: /* @__PURE__ */ s(({ trigger: e, formData: t }) => {
    var i, n;
    e.data.path = ((n = (i = t.playSoundPath) == null ? void 0 : i.trim) == null ? void 0 : n.call(i)) ?? "";
  }, "prepareFormData")
});
var lo;
const { ApplicationV2: yn, HandlebarsApplicationMixin: Tn } = ((lo = foundry.applications) == null ? void 0 : lo.api) ?? {};
if (!yn || !Tn)
  throw new Error(
    `${O} | ApplicationV2 API unavailable. Update Foundry VTT to v13 or newer.`
  );
const Xe = "AM", gt = "PM";
function Qe() {
  return ho();
}
s(Qe, "getConfiguredTimeFormat");
function bn(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  if (!t) return null;
  const i = t.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (!i) return null;
  const n = Number(i[1]), r = Number(i[2]), o = i[3] !== void 0 ? Number(i[3]) : null;
  return !Number.isInteger(n) || !Number.isInteger(r) || n < 0 || n > 23 || r < 0 || r > 59 || o !== null && (!Number.isInteger(o) || o < 0 || o > 59) ? null : {
    hours: n,
    minutes: r,
    seconds: o
  };
}
s(bn, "parseCanonicalTimeString");
function _e({ hours: e, minutes: t, seconds: i }) {
  if (!Number.isInteger(e) || !Number.isInteger(t) || e < 0 || e > 23 || t < 0 || t > 59) return null;
  const n = String(e).padStart(2, "0"), r = String(t).padStart(2, "0");
  if (Number.isInteger(i)) {
    if (i < 0 || i > 59) return null;
    const o = String(i).padStart(2, "0");
    return `${n}:${r}:${o}`;
  }
  return `${n}:${r}`;
}
s(_e, "formatCanonicalTime");
function ka(e, { format: t } = {}) {
  if (!e || typeof e != "object") return null;
  const i = Number(e.hour), n = Number(e.minute), r = e.second !== void 0 && e.second !== null, o = r ? Number(e.second) : null, a = r && Number.isFinite(o) ? Math.floor(Math.max(0, Math.min(59, o))) : null;
  if (!Number.isFinite(i) || !Number.isFinite(n)) return null;
  const l = t ?? Qe();
  return $i(
    {
      hours: i,
      minutes: n,
      seconds: a
    },
    l
  );
}
s(ka, "formatTimeComponentsForDisplay");
function qa(e, { format: t } = {}) {
  const i = bn(e);
  if (!i) return "";
  const n = t ?? Qe();
  return $i(i, n);
}
s(qa, "formatTriggerTimeForDisplay");
function $i(e, t = "12h") {
  if (!e) return "";
  const { hours: i, minutes: n, seconds: r = null } = e;
  if (!Number.isInteger(i) || !Number.isInteger(n)) return "";
  const o = Number.isInteger(r);
  if (t === "24h") {
    const h = `${String(i).padStart(2, "0")}:${String(n).padStart(2, "0")}`;
    return o ? `${h}:${String(r).padStart(2, "0")}` : h;
  }
  const a = i >= 12 ? gt : Xe, l = i % 12 === 0 ? 12 : i % 12, c = String(l), d = String(n).padStart(2, "0"), u = `${c}:${d}`, m = a === Xe ? f("EIDOLON.TimeTrigger.TimePeriodAM", Xe) : f("EIDOLON.TimeTrigger.TimePeriodPM", gt);
  if (o) {
    const h = String(r).padStart(2, "0");
    return `${u}:${h} ${m}`;
  }
  return `${u} ${m}`;
}
s($i, "formatTimeParts");
function Gr(e, t = Qe()) {
  const i = bn(e);
  if (t === "24h")
    return {
      format: t,
      canonical: i ? _e(i) ?? "" : "",
      hour: i ? String(i.hours).padStart(2, "0") : "",
      minute: i ? String(i.minutes).padStart(2, "0") : ""
    };
  if (!i)
    return {
      format: t,
      canonical: "",
      hour: "",
      minute: "",
      period: Xe
    };
  const n = i.hours >= 12 ? gt : Xe, r = i.hours % 12 === 0 ? 12 : i.hours % 12;
  return {
    format: t,
    canonical: _e(i) ?? "",
    hour: String(r),
    minute: String(i.minutes).padStart(2, "0"),
    period: n
  };
}
s(Gr, "getTimeFormValues");
function Pa({ hour: e, minute: t, period: i, time: n }, r = Qe()) {
  if (r === "24h") {
    const p = typeof e == "string" ? e.trim() : "", y = typeof t == "string" ? t.trim() : "", T = typeof n == "string" ? n.trim() : "";
    if (!p && !y && T) {
      const N = bn(T);
      return N ? { canonical: _e(N) ?? "", error: null } : {
        canonical: "",
        error: f(
          "EIDOLON.TimeTrigger.TimeFormatInvalid24",
          "Enter a valid time in HH:MM format."
        )
      };
    }
    if (!p || !y)
      return {
        canonical: "",
        error: f("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.")
      };
    const S = Number(p), b = Number(y);
    return !Number.isInteger(S) || S < 0 || S > 23 ? {
      canonical: "",
      error: f(
        "EIDOLON.TimeTrigger.TimeFormatInvalid24",
        "Enter a valid time in HH:MM format."
      )
    } : !Number.isInteger(b) || b < 0 || b > 59 ? {
      canonical: "",
      error: f(
        "EIDOLON.TimeTrigger.TimeFormatInvalid24",
        "Enter a valid time in HH:MM format."
      )
    } : { canonical: _e({
      hours: S,
      minutes: b
    }) ?? "", error: null };
  }
  const o = typeof e == "string" ? e.trim() : "", a = typeof t == "string" ? t.trim() : "", l = typeof i == "string" ? i.trim().toUpperCase() : "";
  if (!o || !a || !l)
    return { canonical: "", error: f("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.") };
  if (l !== Xe && l !== gt)
    return { canonical: "", error: f("EIDOLON.TimeTrigger.TimeFormatInvalidPeriod", "Select AM or PM.") };
  const c = Number(o), d = Number(a);
  if (!Number.isInteger(c) || c < 1 || c > 12)
    return {
      canonical: "",
      error: f("EIDOLON.TimeTrigger.TimeFormatInvalidHour", "Hours must be between 1 and 12.")
    };
  if (!Number.isInteger(d) || d < 0 || d > 59)
    return {
      canonical: "",
      error: f("EIDOLON.TimeTrigger.TimeFormatInvalidMinute", "Minutes must be between 00 and 59.")
    };
  const u = c % 12, h = {
    hours: l === gt ? u + 12 : u,
    minutes: d
  };
  return {
    canonical: _e(h) ?? "",
    error: null
  };
}
s(Pa, "normalizeFormTimeInput");
function xa() {
  return [
    {
      value: Xe,
      label: f("EIDOLON.TimeTrigger.TimePeriodAM", Xe)
    },
    {
      value: gt,
      label: f("EIDOLON.TimeTrigger.TimePeriodPM", gt)
    }
  ];
}
s(xa, "getPeriodOptions");
var rt, ot, K, Lo, Vi, ji, Co, zn, Wn, Gi, zi, So, Oo, wo, Kn, Jn, Yn, Wi, Ki, Qn, Ji, vo, Io;
const nt = class nt extends Tn(yn) {
  constructor(i = {}) {
    var a;
    const { scene: n, showControls: r, ...o } = i ?? {};
    super(o);
    I(this, K);
    I(this, rt, null);
    I(this, ot, null);
    I(this, Vi, /* @__PURE__ */ s((i) => {
      var r, o;
      i.preventDefault();
      const n = Number((o = (r = i.currentTarget) == null ? void 0 : r.dataset) == null ? void 0 : o.delta);
      Number.isFinite(n) && (E("Time delta button clicked", { delta: n }), this._advanceTime(n));
    }, "#onDeltaClick"));
    I(this, ji, /* @__PURE__ */ s((i) => {
      var n, r;
      i.preventDefault(), !(!this.showControls || !((n = game.user) != null && n.isGM)) && (E("Time value double clicked", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null }), C(this, K, Co).call(this));
    }, "#onTimeDoubleClick"));
    I(this, Gi, /* @__PURE__ */ s((i) => {
      if (this.isEditingTime && !this._commitTimeInProgress)
        if (i.key === "Enter") {
          i.preventDefault();
          const n = i.currentTarget, r = typeof (n == null ? void 0 : n.value) == "string" ? n.value : "";
          C(this, K, Wn).call(this, r);
        } else i.key === "Escape" && (i.preventDefault(), C(this, K, zn).call(this));
    }, "#onTimeInputKeydown"));
    I(this, zi, /* @__PURE__ */ s((i) => {
      if (!this.isEditingTime || this._commitTimeInProgress || this._suppressBlurCommit) return;
      const n = i.currentTarget, r = typeof (n == null ? void 0 : n.value) == "string" ? n.value : "";
      C(this, K, Wn).call(this, r);
    }, "#onTimeInputBlur"));
    I(this, Wi, /* @__PURE__ */ s((i) => {
      const n = !!i;
      if (this.manageTimeEnabled === n) return;
      this.manageTimeEnabled = n, (this.rendered ?? this.isRendered ?? !1) && this.render({ force: !0 });
    }, "#handleManageTimeChange"));
    I(this, Ki, /* @__PURE__ */ s(async (i) => {
      var o, a, l, c, d, u, m, h, p;
      if (i.preventDefault(), !this.showControls || !((o = game.user) != null && o.isGM)) return;
      if (!this.manageTimeEnabled) {
        (l = (a = ui.notifications) == null ? void 0 : a.error) == null || l.call(
          a,
          f(
            "EIDOLON.TimeTrigger.SceneRealTimeManageDisabled",
            "Enable Manage Time in module settings to allow automatic real-time flow."
          )
        );
        return;
      }
      const n = this.scene;
      if (!n || typeof n.setFlag != "function") {
        (d = (c = ui.notifications) == null ? void 0 : c.error) == null || d.call(
          c,
          f(
            "EIDOLON.TimeTrigger.SceneUnavailable",
            "The active scene is unavailable. Try again after reloading the world."
          )
        );
        return;
      }
      const r = !this.sceneAllowsRealTime;
      try {
        await n.setFlag(O, Fn, r), this.sceneAllowsRealTime = r;
        const y = r ? f(
          "EIDOLON.TimeTrigger.SceneRealTimeEnabled",
          "Automatic real-time flow enabled for this scene."
        ) : f(
          "EIDOLON.TimeTrigger.SceneRealTimeDisabled",
          "Automatic real-time flow disabled for this scene."
        );
        (m = (u = ui.notifications) == null ? void 0 : u.info) == null || m.call(u, y);
      } catch (y) {
        console.error(`${O} | Failed to toggle scene real-time flow`, y), (p = (h = ui.notifications) == null ? void 0 : h.error) == null || p.call(
          h,
          f(
            "EIDOLON.TimeTrigger.SceneRealTimeToggleError",
            "Failed to update the scene's real-time flow setting."
          )
        );
      } finally {
        this.render({ force: !0 });
      }
    }, "#onRealTimeToggleClick"));
    I(this, Ji, /* @__PURE__ */ s(() => {
      (this.rendered ?? this.isRendered ?? !1) && (this.isEditingTime && (this.editValue = C(this, K, Kn).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    this.scene = n ?? null, this.showControls = typeof r == "boolean" ? r : !!((a = game.user) != null && a.isGM), this.isEditingTime = !1, this.editValue = "", this._commitTimeInProgress = !1, this._suppressBlurCommit = !1, this.manageTimeEnabled = !1, this.sceneAllowsRealTime = C(this, K, Qn).call(this), A(this, rt, Cr(g(this, Ji))), A(this, ot, po(g(this, Wi)));
  }
  async _prepareContext() {
    var b, v;
    const i = ((b = game.time) == null ? void 0 : b.components) ?? {}, r = ((i == null ? void 0 : i.second) !== void 0 && (i == null ? void 0 : i.second) !== null ? ka(i) : null) ?? C(this, K, Lo).call(this), o = Qe(), a = o === "24h", l = a ? f("EIDOLON.TimeTrigger.EditTimePlaceholder24", "HH:MM") : f("EIDOLON.TimeTrigger.EditTimePlaceholder12", "HH:MM AM/PM"), c = this.showControls ? f(
      "EIDOLON.TimeTrigger.EditTimeHint",
      "Double-click to set a specific time."
    ) : "", d = this.showControls ? f(
      "EIDOLON.TimeTrigger.EditTimeLabel",
      "New time (HH:MM or HH:MM AM/PM)"
    ) : "", u = ba.map((N) => ({
      minutes: N,
      label: N > 0 ? `+${N}` : `${N}`
    })), m = !!this.manageTimeEnabled, h = C(this, K, Qn).call(this);
    this.sceneAllowsRealTime = h;
    const p = f(
      "EIDOLON.TimeTrigger.SceneRealTimeEnable",
      "Enable automatic real-time flow for this scene."
    ), y = f(
      "EIDOLON.TimeTrigger.SceneRealTimeDisable",
      "Disable automatic real-time flow for this scene."
    ), T = f(
      "EIDOLON.TimeTrigger.SceneRealTimeManageDisabled",
      "Enable Manage Time in module settings to allow automatic real-time flow."
    );
    return {
      formattedTime: r,
      deltas: u,
      manageTimeEnabled: m,
      sceneAllowsRealTime: h,
      realTimeButtonLabel: m ? h ? y : p : T,
      isGM: ((v = game.user) == null ? void 0 : v.isGM) ?? !1,
      showControls: !!this.showControls,
      editHint: c,
      editLabel: d,
      editPlaceholder: l,
      timeFormat: o,
      is24Hour: a,
      isEditingTime: !!this.isEditingTime,
      editValue: this.isEditingTime ? this.editValue ?? "" : ""
    };
  }
  async close(i = {}) {
    var r, o;
    if (!i.force)
      return (this.rendered ?? this.isRendered ?? !1) || (E("TimeTriggerWindow close request rerendering", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null
      }), this.render({ force: !0 })), this;
    E("Closing time trigger window", { sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null, force: !0 });
    const n = await super.close(i);
    return C(this, K, vo).call(this), C(this, K, Io).call(this), n;
  }
  async _advanceTime(i) {
    var r, o, a, l, c, d, u;
    const n = i * 60;
    if (E("Advancing world time", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null, minutes: i, seconds: n }), !((o = game.user) != null && o.isGM)) {
      (l = (a = ui.notifications) == null ? void 0 : a.warn) == null || l.call(a, f("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time."));
      return;
    }
    try {
      await game.time.advance(n);
    } catch (m) {
      console.error(`${O} | Failed to advance time`, m), (d = (c = ui.notifications) == null ? void 0 : c.error) == null || d.call(
        c,
        f("EIDOLON.TimeTrigger.Error", "Failed to update the world time.")
      ), E("Failed to advance time from window", {
        sceneId: ((u = this.scene) == null ? void 0 : u.id) ?? null,
        minutes: i,
        message: (m == null ? void 0 : m.message) ?? String(m)
      });
    }
  }
  _onRender(i, n) {
    var o;
    super._onRender(i, n);
    const r = this.element;
    if (r) {
      if (this.showControls) {
        E("Binding time trigger interactions", {
          sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
          buttonCount: r.querySelectorAll("[data-delta]").length
        }), r.querySelectorAll("[data-delta]").forEach((d) => {
          d.addEventListener("click", g(this, Vi));
        });
        const a = r.querySelector('.time-trigger-window__time-value[data-editable="true"]');
        a && a.addEventListener("dblclick", g(this, ji), { once: !1 });
        const l = r.querySelector(".time-trigger-window__time-input");
        l && (l.addEventListener("keydown", g(this, Gi)), l.addEventListener("blur", g(this, zi)), typeof l.focus == "function" && (l.focus(), typeof l.select == "function" && l.select()));
        const c = r.querySelector('[data-action="toggle-real-time"]');
        c && c.addEventListener("click", g(this, Ki));
      }
      this._suppressBlurCommit = !1;
    }
  }
};
rt = new WeakMap(), ot = new WeakMap(), K = new WeakSet(), Lo = /* @__PURE__ */ s(function() {
  var c;
  const i = (c = game.time) == null ? void 0 : c.worldTime;
  if (typeof i != "number" || !Number.isFinite(i)) return "";
  const n = 1440 * 60, r = (Math.floor(i) % n + n) % n, o = Math.floor(r / 3600), a = Math.floor(r % 3600 / 60), l = r % 60;
  return $i({ hours: o, minutes: a, seconds: l }, Qe());
}, "#formatFallbackTime"), Vi = new WeakMap(), ji = new WeakMap(), Co = /* @__PURE__ */ s(function() {
  var i;
  (i = game.user) != null && i.isGM && (this.isEditingTime = !0, this._suppressBlurCommit = !1, this.editValue = C(this, K, Kn).call(this), this.render({ force: !0 }));
}, "#enterTimeEditMode"), zn = /* @__PURE__ */ s(function() {
  this.isEditingTime = !1, this.editValue = "", this._suppressBlurCommit = !1, this.render({ force: !0 });
}, "#cancelTimeEdit"), Wn = /* @__PURE__ */ s(async function(i) {
  var o, a, l;
  if (!((o = game.user) != null && o.isGM) || !this.isEditingTime || this._commitTimeInProgress) return;
  this._commitTimeInProgress = !0;
  const n = typeof i == "string" ? i.trim() : "";
  if (!n) {
    C(this, K, zn).call(this), this._commitTimeInProgress = !1;
    return;
  }
  const r = C(this, K, wo).call(this, n);
  if (r.error) {
    (l = (a = ui.notifications) == null ? void 0 : a.error) == null || l.call(a, r.error), this._suppressBlurCommit = !0, this.editValue = n, this.render({ force: !0 }), this._commitTimeInProgress = !1;
    return;
  }
  try {
    await C(this, K, Oo).call(this, r.seconds, r.includeSeconds) ? (this.isEditingTime = !1, this.editValue = "", this.render({ force: !0 })) : (this.editValue = n, this.render({ force: !0 }));
  } finally {
    this._commitTimeInProgress = !1;
  }
}, "#commitTimeInput"), Gi = new WeakMap(), zi = new WeakMap(), So = /* @__PURE__ */ s(function() {
  var d, u;
  const i = (d = game.time) == null ? void 0 : d.worldTime;
  if (typeof i != "number" || !Number.isFinite(i))
    return "";
  const n = ((u = game.time) == null ? void 0 : u.components) ?? {}, r = Number(n.hour), o = Number(n.minute), a = n.second !== void 0 ? Number(n.second) : null, l = Number.isInteger(a);
  return (Number.isFinite(r) && Number.isFinite(o) ? _e({
    hours: Math.max(0, Math.min(23, Number(r))),
    minutes: Math.max(0, Math.min(59, Number(o))),
    seconds: l && Number.isFinite(a) ? Math.max(0, Math.min(59, Number(a))) : void 0
  }) ?? "" : "") ?? "";
}, "#getCurrentCanonicalTime"), Oo = /* @__PURE__ */ s(async function(i, n) {
  var h, p, y, T, S, b, v, N, q, B;
  const r = (h = game.time) == null ? void 0 : h.worldTime;
  if (typeof r != "number" || !Number.isFinite(r))
    return (y = (p = ui.notifications) == null ? void 0 : p.error) == null || y.call(
      p,
      f(
        "EIDOLON.TimeTrigger.EditTimeUnavailable",
        "The world time is unavailable, so it can't be updated."
      )
    ), !1;
  if (!Number.isInteger(i) || i < 0 || i >= Lt)
    return (S = (T = ui.notifications) == null ? void 0 : T.error) == null || S.call(
      T,
      f(
        "EIDOLON.TimeTrigger.EditTimeInvalidRange",
        "Enter a time within the current day."
      )
    ), !1;
  const l = Math.floor(r / Lt) * Lt + i - r;
  if (!Number.isFinite(l) || l === 0)
    return !0;
  const c = Math.floor(i / 3600), d = Math.floor(i % 3600 / 60), u = i % 60, m = _e({
    hours: c,
    minutes: d,
    seconds: n ? u : void 0
  });
  try {
    E("Updating world time directly", {
      sceneId: ((b = this.scene) == null ? void 0 : b.id) ?? null,
      targetCanonical: m ?? null,
      diff: l
    }), await game.time.advance(l);
    const U = $i(
      {
        hours: c,
        minutes: d,
        seconds: n ? u : null
      },
      Qe()
    );
    (N = (v = ui.notifications) == null ? void 0 : v.info) == null || N.call(
      v,
      f(
        "EIDOLON.TimeTrigger.EditTimeSuccess",
        "World time updated."
      ) + (U ? ` ${U}` : "")
    );
  } catch (U) {
    return console.error(`${O} | Failed to set world time`, U), (B = (q = ui.notifications) == null ? void 0 : q.error) == null || B.call(
      q,
      f(
        "EIDOLON.TimeTrigger.EditTimeError",
        "Failed to update the world time."
      )
    ), !1;
  }
  return !0;
}, "#applyTargetSeconds"), wo = /* @__PURE__ */ s(function(i) {
  var m;
  const n = f(
    "EIDOLON.TimeTrigger.EditTimeInvalid",
    "Enter a valid time like 14:30 or 2:30 PM."
  );
  if (typeof i != "string")
    return { error: n };
  const r = i.trim();
  if (!r)
    return { error: n };
  const o = r.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (o) {
    const h = Number(o[1]), p = Number(o[2]), y = o[3] !== void 0 ? Number(o[3]) : void 0;
    if (Number.isInteger(h) && h >= 0 && h <= 23 && Number.isInteger(p) && p >= 0 && p <= 59 && (y === void 0 || Number.isInteger(y) && y >= 0 && y <= 59)) {
      const T = h * 3600 + p * 60 + (y ?? 0);
      return {
        canonical: _e({ hours: h, minutes: p, seconds: y }),
        seconds: T,
        includeSeconds: y !== void 0,
        error: null
      };
    }
    return { error: n };
  }
  const { amLower: a, pmLower: l, periodPattern: c } = C(this, K, Jn).call(this), d = r.match(
    new RegExp(
      `^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?\\s*(${c})$`,
      "i"
    )
  );
  if (d) {
    let h = Number(d[1]);
    const p = Number(d[2]), y = d[3] !== void 0 ? Number(d[3]) : void 0, T = d[4] ?? "", S = typeof T == "string" ? ((m = T.toLocaleLowerCase) == null ? void 0 : m.call(T)) ?? T.toLowerCase() : "";
    if (Number.isInteger(h) && h >= 1 && h <= 12 && Number.isInteger(p) && p >= 0 && p <= 59 && (y === void 0 || Number.isInteger(y) && y >= 0 && y <= 59) && (S === a || S === l || S === "am" || S === "pm")) {
      h = h % 12, (S === l || S === "pm") && (h += 12);
      const v = h * 3600 + p * 60 + (y ?? 0);
      return {
        canonical: _e({ hours: h, minutes: p, seconds: y }),
        seconds: v,
        includeSeconds: y !== void 0,
        error: null
      };
    }
    return { error: n };
  }
  const u = go(r);
  if (u !== null) {
    const h = Math.floor(u / 3600), p = Math.floor(u % 3600 / 60), y = u % 60, T = y !== 0;
    return {
      canonical: _e({
        hours: h,
        minutes: p,
        seconds: T ? y : void 0
      }),
      seconds: u,
      includeSeconds: T,
      error: null
    };
  }
  return { error: n };
}, "#parseInputTime"), Kn = /* @__PURE__ */ s(function() {
  const i = C(this, K, So).call(this);
  if (!i) return "";
  if (Qe() === "24h")
    return i;
  const r = bn(i);
  if (!r) return i;
  const o = Number(r.hours), a = Number(r.minutes), l = r.seconds !== null && r.seconds !== void 0 ? Number(r.seconds) : void 0;
  if (!Number.isFinite(o) || !Number.isFinite(a)) return i;
  const c = Number.isFinite(l), d = o % 12 === 0 ? 12 : o % 12, u = String(a).padStart(2, "0"), m = c ? `:${String(l).padStart(2, "0")}` : "", { amLabel: h, pmLabel: p } = C(this, K, Jn).call(this), y = o >= 12 ? p : h;
  return `${d}:${u}${m} ${y}`.trim();
}, "#getInitialEditValue"), Jn = /* @__PURE__ */ s(function() {
  var d, u;
  const i = f("EIDOLON.TimeTrigger.TimePeriodAM", "AM"), n = f("EIDOLON.TimeTrigger.TimePeriodPM", "PM"), r = ((d = i.toLocaleLowerCase) == null ? void 0 : d.call(i)) ?? i.toLowerCase(), o = ((u = n.toLocaleLowerCase) == null ? void 0 : u.call(n)) ?? n.toLowerCase(), a = C(this, K, Yn).call(this, i), l = C(this, K, Yn).call(this, n), c = `${a}|${l}|AM|PM`;
  return {
    amLabel: i,
    pmLabel: n,
    amLower: r,
    pmLower: o,
    periodPattern: c
  };
}, "#getPeriodMatchData"), Yn = /* @__PURE__ */ s(function(i) {
  return typeof i != "string" ? "" : i.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}, "#escapeForRegex"), Wi = new WeakMap(), Ki = new WeakMap(), Qn = /* @__PURE__ */ s(function() {
  const i = this.scene;
  if (!i || typeof i.getFlag != "function") return !1;
  try {
    return !!i.getFlag(O, Fn);
  } catch (n) {
    E("TimeTriggerWindow | Failed to read scene real-time flag", {
      sceneId: (i == null ? void 0 : i.id) ?? null,
      message: (n == null ? void 0 : n.message) ?? String(n)
    });
  }
  return !1;
}, "#readSceneRealTimeFlag"), Ji = new WeakMap(), vo = /* @__PURE__ */ s(function() {
  if (typeof g(this, rt) == "function")
    try {
      g(this, rt).call(this);
    } catch (i) {
      console.error(`${O} | Failed to dispose time format subscription`, i);
    }
  A(this, rt, null);
}, "#disposeTimeFormatSubscription"), Io = /* @__PURE__ */ s(function() {
  if (typeof g(this, ot) == "function")
    try {
      g(this, ot).call(this);
    } catch (i) {
      console.error(`${O} | Failed to dispose manage time subscription`, i);
    }
  A(this, ot, null);
}, "#disposeManageTimeSubscription"), s(nt, "TimeTriggerWindow"), Ze(nt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  yt(nt, nt, "DEFAULT_OPTIONS"),
  {
    id: `${O}-time-trigger`,
    window: {
      title: f("EIDOLON.TimeTrigger.Title", "Time Trigger"),
      resizable: !1
    },
    position: {
      width: "auto",
      height: "auto"
    }
  },
  { inplace: !1 }
)), Ze(nt, "PARTS", {
  content: {
    template: `modules/${O}/templates/time-trigger.html`
  }
});
let Gn = nt;
function Or(e, t = {}) {
  if (typeof e != "function")
    throw new TypeError("createApplicationFactory requires a constructor function.");
  const i = /* @__PURE__ */ s(function(r = {}) {
    const o = foundry.utils.mergeObject(
      t ?? {},
      r ?? {},
      { inplace: !1 }
    );
    return new e(o);
  }, "applicationFactory");
  return i.__eidolonFactorySignature = "options", i.__eidolonFactoryTarget = e, i;
}
s(Or, "createApplicationFactory");
const zr = /* @__PURE__ */ new Set();
var le, be, at, Nt, Mo, Ao;
const Rr = class Rr {
  constructor({ windowFactory: t } = {}) {
    I(this, Nt);
    I(this, le, null);
    I(this, be, null);
    I(this, at);
    const i = Or(Gn);
    typeof t == "function" ? t.__eidolonFactorySignature === "options" ? A(this, at, (r, o = {}) => t({ scene: r, ...o ?? {} })) : A(this, at, t) : A(this, at, /* @__PURE__ */ s((r, o = {}) => i({ scene: r, ...o ?? {} }), "fallbackFactory"));
  }
  onReady() {
    var i;
    const t = typeof ((i = game.time) == null ? void 0 : i.worldTime) == "number" && Number.isFinite(game.time.worldTime) ? game.time.worldTime : null;
    E("TimeTriggerManager#onReady", { worldTime: t }), t !== null && A(this, be, t);
  }
  onCanvasReady(t) {
    const i = (t == null ? void 0 : t.scene) ?? xt();
    E("TimeTriggerManager#onCanvasReady", { sceneId: (i == null ? void 0 : i.id) ?? null }), this.refreshTimeTriggerWindow(i), this.handleTimeTriggerEvaluation(i);
  }
  onUpdateScene(t) {
    const i = xt();
    E("TimeTriggerManager#onUpdateScene", {
      sceneId: (t == null ? void 0 : t.id) ?? null,
      activeSceneId: (i == null ? void 0 : i.id) ?? null
    }), !(!i || t.id !== i.id) && (this.refreshTimeTriggerWindow(t), this.handleTimeTriggerEvaluation(t));
  }
  onUpdateWorldTime(t, i) {
    E("TimeTriggerManager#onUpdateWorldTime", {
      worldTime: t,
      diff: i,
      hasWindow: !!g(this, le)
    }), g(this, le) && g(this, le).render();
    const n = xt(), r = C(this, Nt, Mo).call(this, t, i);
    this.handleTimeTriggerEvaluation(n, t, r);
  }
  refreshTimeTriggerWindow(t) {
    var c, d, u;
    if (!t) return;
    const i = !!((c = game.user) != null && c.isGM), n = !!t.getFlag(O, Di), r = !!t.getFlag(O, Rn), o = !!t.getFlag(O, _n);
    if (E("TimeTriggerManager#refreshTimeTriggerWindow", {
      sceneId: t.id,
      isGM: i,
      isActive: n,
      hideWindow: r,
      showPlayerWindow: o
    }), !(n && !r && (i || o))) {
      g(this, le) && (E("Closing time trigger window", { reason: "not-visible" }), g(this, le).close({ force: !0 }), A(this, le, null));
      return;
    }
    const l = !!i;
    if (g(this, le) && ((d = g(this, le).scene) == null ? void 0 : d.id) === t.id) {
      E("Refreshing existing time trigger window", { sceneId: t.id }), g(this, le).showControls = l, g(this, le).render();
      return;
    }
    g(this, le) && (E("Closing existing window before creating new instance", {
      previousSceneId: ((u = g(this, le).scene) == null ? void 0 : u.id) ?? null
    }), g(this, le).close({ force: !0 })), A(this, le, g(this, at).call(this, t, { showControls: l })), E("Rendering new time trigger window", { sceneId: t.id }), g(this, le).render({ force: !0 });
  }
  async handleTimeTriggerEvaluation(t, i, n) {
    var c;
    const r = t ?? xt();
    if (!r) {
      E("handleTimeTriggerEvaluation skipped", {
        reason: "no-active-scene",
        providedSceneId: (t == null ? void 0 : t.id) ?? null,
        currentWorldTime: i
      }), typeof i == "number" && Number.isFinite(i) && A(this, be, i);
      return;
    }
    const o = typeof i == "number" && Number.isFinite(i) ? i : typeof ((c = game.time) == null ? void 0 : c.worldTime) == "number" ? game.time.worldTime : null;
    if (o === null) return;
    const a = typeof n == "number" && Number.isFinite(n) ? n : null, l = a !== null ? a : typeof g(this, be) == "number" && Number.isFinite(g(this, be)) ? g(this, be) : o;
    Mt("handleTimeTriggerEvaluation", {
      sceneId: r.id,
      previousWorldTime: l,
      currentWorldTime: o,
      overrideProvided: a !== null
    });
    try {
      await C(this, Nt, Ao).call(this, r, l, o);
    } catch (d) {
      console.error(`${O} | Unexpected error while evaluating time triggers`, d), E("handleTimeTriggerEvaluation error", { message: (d == null ? void 0 : d.message) ?? String(d) });
    } finally {
      A(this, be, o), Ye();
    }
  }
};
le = new WeakMap(), be = new WeakMap(), at = new WeakMap(), Nt = new WeakSet(), Mo = /* @__PURE__ */ s(function(t, i) {
  return typeof g(this, be) == "number" && Number.isFinite(g(this, be)) ? (E("Resolved previous world time from cache", {
    previousWorldTime: g(this, be)
  }), g(this, be)) : typeof t == "number" && Number.isFinite(t) && typeof i == "number" && Number.isFinite(i) ? (E("Resolved previous world time using diff", {
    worldTime: t,
    diff: i,
    resolved: t - i
  }), t - i) : typeof t == "number" && Number.isFinite(t) ? t : null;
}, "#resolvePreviousWorldTime"), Ao = /* @__PURE__ */ s(async function(t, i, n) {
  var y, T, S;
  if (!((y = game.user) != null && y.isGM)) {
    E("Skipping trigger evaluation because user is not a GM");
    return;
  }
  if (!(t != null && t.id)) {
    E("Skipping trigger evaluation because the scene is missing an id");
    return;
  }
  if (!!!t.getFlag(O, Di)) {
    E("Skipping trigger evaluation because scene is inactive", { sceneId: t.id });
    return;
  }
  if (typeof n != "number" || !Number.isFinite(n)) return;
  (typeof i != "number" || !Number.isFinite(i)) && (i = n);
  const o = Ct(t);
  if (!o.length) {
    E("No time triggers configured for scene", { sceneId: t.id });
    return;
  }
  const a = Aa(t), l = /* @__PURE__ */ new Set();
  for (const b of o)
    b != null && b.id && l.add(b.id);
  let c = !1;
  for (const b of Object.keys(a))
    l.has(b) || (delete a[b], c = !0);
  if (Mt("Evaluating scene time triggers", {
    sceneId: t.id,
    previousWorldTime: i,
    currentWorldTime: n,
    triggerCount: o.length
  }), n <= i) {
    E("Detected world time rewind", {
      previousWorldTime: i,
      currentWorldTime: n
    });
    for (const b of o) {
      if (!(b != null && b.id) || !b.allowReplayOnRewind) continue;
      const v = a[b.id];
      typeof v == "number" ? n < v ? (E("Clearing trigger history due to rewind", {
        triggerId: b.id,
        lastFired: v,
        currentWorldTime: n
      }), delete a[b.id], c = !0) : E("Preserving trigger history after rewind", {
        triggerId: b.id,
        lastFired: v,
        currentWorldTime: n
      }) : E("No history stored for rewind-enabled trigger", {
        triggerId: b.id
      });
    }
    c && (E("Persisting history cleanup after rewind", {
      sceneId: t.id
    }), await Mn(t, a)), Ye();
    return;
  }
  const d = i, u = n, m = [], h = Math.floor(d / Lt), p = Math.floor(u / Lt);
  for (const b of o) {
    if (!(b != null && b.id)) continue;
    const v = go(b.time);
    if (v === null) {
      Ba(t, b), E("Skipping trigger with invalid time", {
        triggerId: b.id,
        time: b.time
      });
      continue;
    }
    for (let N = h; N <= p; N++) {
      const q = N * Lt + v;
      if (q < d || q > u) continue;
      const U = a[b.id];
      if (typeof U == "number" && U >= q) {
        E("Skipping trigger because it already fired within window", {
          triggerId: b.id,
          lastFired: U,
          absoluteTime: q
        });
        continue;
      }
      m.push({ trigger: b, absoluteTime: q });
    }
  }
  if (!m.length) {
    c && await Mn(t, a), E("No triggers scheduled to fire within evaluation window", {
      sceneId: t.id
    }), Ye();
    return;
  }
  m.sort((b, v) => b.absoluteTime - v.absoluteTime), E("Queued triggers for execution", {
    entries: m.map((b) => ({
      triggerId: b.trigger.id,
      absoluteTime: b.absoluteTime
    }))
  });
  for (const b of m)
    try {
      E("Executing time trigger action", {
        triggerId: b.trigger.id,
        absoluteTime: b.absoluteTime
      }), await Eo(t, b.trigger);
    } catch (v) {
      console.error(`${O} | Failed to execute time trigger action`, v), (S = (T = ui.notifications) == null ? void 0 : T.error) == null || S.call(
        T,
        f(
          "EIDOLON.TimeTrigger.TriggerActionError",
          "Failed to execute a scene time trigger action. Check the console for details."
        )
      ), E("Trigger execution failed", {
        triggerId: b.trigger.id,
        message: (v == null ? void 0 : v.message) ?? String(v)
      });
    } finally {
      a[b.trigger.id] = b.absoluteTime, c = !0, E("Recorded trigger execution", {
        triggerId: b.trigger.id,
        absoluteTime: b.absoluteTime
      });
    }
  c && (E("Persisting trigger history updates", { sceneId: t.id }), await Mn(t, a)), Ye();
}, "#evaluateSceneTimeTriggers"), s(Rr, "TimeTriggerManager");
let Xn = Rr;
function Ba(e, t) {
  var r, o;
  const i = `${(e == null ? void 0 : e.id) ?? "unknown"}:${(t == null ? void 0 : t.id) ?? (t == null ? void 0 : t.time) ?? "unknown"}`;
  if (zr.has(i)) return;
  zr.add(i);
  const n = f(
    "EIDOLON.TimeTrigger.InvalidTimeWarning",
    "A scene time trigger has an invalid time value and was skipped."
  );
  (o = (r = ui.notifications) == null ? void 0 : r.warn) == null || o.call(r, n), console.warn(`${O} | Invalid time for trigger`, { scene: e == null ? void 0 : e.id, trigger: t });
}
s(Ba, "warnInvalidTriggerTime");
var Oe, zt, we, Ge, st, De, vt, Yi, Qi, Wt, Kt, lt, Re, D, er, Tt, Li, tr, Ci, ir, Ne, No, nr, Do, rr, Ro, Xi, Zi, en, tn, nn, rn, or, _o, Si, on, an;
const _r = class _r {
  constructor() {
    I(this, D);
    I(this, Oe, !1);
    I(this, zt, li);
    I(this, we, /* @__PURE__ */ new Map());
    I(this, Ge, null);
    I(this, st, null);
    I(this, De, 0);
    I(this, vt, null);
    I(this, Yi, null);
    I(this, Qi, null);
    I(this, Wt, !1);
    I(this, Kt, !1);
    I(this, lt, !1);
    I(this, Re, !1);
    I(this, Xi, /* @__PURE__ */ s((t, i = {}) => {
      E("GameTimeAutomation | Pause state changed", {
        paused: t,
        userId: (i == null ? void 0 : i.userId) ?? null,
        broadcast: (i == null ? void 0 : i.broadcast) ?? null
      }), C(this, D, Ne).call(this, { pausedOverride: t });
    }, "#handlePause"));
    I(this, Zi, /* @__PURE__ */ s((t) => {
      t != null && t.id && (g(this, we).set(t.id, Math.max(t.round ?? 0, 1)), E("GameTimeAutomation | Combat started", { combatId: t.id, round: t.round ?? 0 }), C(this, D, Ne).call(this));
    }, "#handleCombatStart"));
    I(this, en, /* @__PURE__ */ s((t, i) => {
      if (!(t != null && t.id)) return;
      const n = typeof i == "number" && Number.isFinite(i) ? i : typeof t.round == "number" && Number.isFinite(t.round) ? t.round : 0, r = n > 0 ? n : 1, o = g(this, we).get(t.id), a = o ? Math.max(o, 1) : 1, l = r > 1 ? Math.max(r - a, 0) : 0;
      if (E("GameTimeAutomation | Combat round change detected", {
        combatId: t.id,
        effectiveRound: r,
        completedRounds: l,
        enabled: g(this, Oe),
        paused: (game == null ? void 0 : game.paused) ?? null
      }), l > 0 && g(this, Oe) && g(this, Re) && !(game != null && game.paused) && C(this, D, Tt).call(this) && C(this, D, Li).call(this, t)) {
        const c = l * g(this, zt);
        c > 0 && (E("GameTimeAutomation | Advancing time for completed combat rounds", {
          combatId: t.id,
          completedRounds: l,
          delta: c
        }), C(this, D, rr).call(this, c));
      }
      g(this, we).set(t.id, Math.max(r, 1));
    }, "#handleCombatRound"));
    I(this, tn, /* @__PURE__ */ s((t) => {
      t != null && t.id && (g(this, we).delete(t.id), E("GameTimeAutomation | Combat ended", { combatId: t.id }), C(this, D, Ne).call(this));
    }, "#handleCombatEnd"));
    I(this, nn, /* @__PURE__ */ s((t) => {
      t != null && t.id && (g(this, we).delete(t.id), E("GameTimeAutomation | Combat deleted", { combatId: t.id }), C(this, D, Ne).call(this));
    }, "#handleCombatDelete"));
    I(this, rn, /* @__PURE__ */ s((t, i) => {
      if (t != null && t.id) {
        if (typeof (i == null ? void 0 : i.round) == "number" && Number.isFinite(i.round)) {
          const n = Math.max(i.round, 1);
          g(this, we).set(t.id, n), E("GameTimeAutomation | Combat round manually updated", {
            combatId: t.id,
            round: n
          });
        }
        (Object.prototype.hasOwnProperty.call(i ?? {}, "active") || (i == null ? void 0 : i.round) !== void 0) && C(this, D, Ne).call(this);
      }
    }, "#handleCombatUpdate"));
    I(this, on, /* @__PURE__ */ s((t) => {
      C(this, D, Si).call(this, t == null ? void 0 : t.scene), C(this, D, Ne).call(this);
    }, "#handleCanvasReady"));
    I(this, an, /* @__PURE__ */ s((t) => {
      if (!pe(t)) return;
      const i = C(this, D, or).call(this);
      if (!i || i.id !== t.id) return;
      C(this, D, Si).call(this, t) && C(this, D, Ne).call(this);
    }, "#handleSceneUpdate"));
  }
  registerHooks() {
    g(this, Wt) || (A(this, Wt, !0), Hooks.on("pauseGame", g(this, Xi)), Hooks.on("combatStart", g(this, Zi)), Hooks.on("combatRound", g(this, en)), Hooks.on("combatEnd", g(this, tn)), Hooks.on("deleteCombat", g(this, nn)), Hooks.on("updateCombat", g(this, rn)), Hooks.on("canvasReady", g(this, on)), Hooks.on("updateScene", g(this, an)));
  }
  initialize() {
    g(this, Kt) || (A(this, Kt, !0), A(this, Yi, po((t) => {
      const i = !!t, n = i !== g(this, Oe);
      A(this, Oe, i), E("GameTimeAutomation | Manage time toggled", { enabled: i }), n && i && C(this, D, ir).call(this), C(this, D, Ne).call(this);
    })), A(this, Qi, va((t) => {
      A(this, zt, t), E("GameTimeAutomation | Seconds per round updated", { value: t });
    })), C(this, D, ir).call(this), C(this, D, Si).call(this), C(this, D, Ne).call(this));
  }
};
Oe = new WeakMap(), zt = new WeakMap(), we = new WeakMap(), Ge = new WeakMap(), st = new WeakMap(), De = new WeakMap(), vt = new WeakMap(), Yi = new WeakMap(), Qi = new WeakMap(), Wt = new WeakMap(), Kt = new WeakMap(), lt = new WeakMap(), Re = new WeakMap(), D = new WeakSet(), er = /* @__PURE__ */ s(function() {
  var t;
  try {
    if (typeof ((t = globalThis.performance) == null ? void 0 : t.now) == "function")
      return globalThis.performance.now();
  } catch (i) {
    E("GameTimeAutomation | Failed to read high-resolution timestamp", {
      message: (i == null ? void 0 : i.message) ?? String(i)
    });
  }
  return Date.now();
}, "#currentTimestamp"), Tt = /* @__PURE__ */ s(function() {
  var t;
  return !!((t = game == null ? void 0 : game.user) != null && t.isGM && game.user.active !== !1);
}, "#canControlTime"), Li = /* @__PURE__ */ s(function(t) {
  var n, r;
  if (!t) return !1;
  if (t.active === !0) return !0;
  if (t.active === !1) return !1;
  const i = (n = game == null ? void 0 : game.combats) == null ? void 0 : n.active;
  return (i == null ? void 0 : i.id) === t.id ? !0 : ((r = game == null ? void 0 : game.combat) == null ? void 0 : r.id) === t.id ? game.combat.active ?? !0 : !1;
}, "#isCombatDocumentActive"), tr = /* @__PURE__ */ s(function(t) {
  return t ? typeof t.started == "boolean" ? t.started : (t.round ?? 0) > 0 : !1;
}, "#hasCombatStarted"), Ci = /* @__PURE__ */ s(function() {
  var n;
  const t = Array.isArray((n = game == null ? void 0 : game.combats) == null ? void 0 : n.contents) ? game.combats.contents : [];
  for (const r of t)
    if (C(this, D, Li).call(this, r) && C(this, D, tr).call(this, r))
      return !0;
  const i = game == null ? void 0 : game.combat;
  return !!(i && C(this, D, Li).call(this, i) && C(this, D, tr).call(this, i));
}, "#isCombatRunning"), ir = /* @__PURE__ */ s(function() {
  var i;
  g(this, we).clear();
  const t = Array.isArray((i = game == null ? void 0 : game.combats) == null ? void 0 : i.contents) ? game.combats.contents : [];
  for (const n of t)
    n != null && n.id && g(this, we).set(n.id, Math.max(n.round ?? 0, 1));
}, "#hydrateRoundTracking"), Ne = /* @__PURE__ */ s(function({ pausedOverride: t } = {}) {
  const i = typeof t == "boolean" ? t : !!(game != null && game.paused), n = g(this, Oe), r = g(this, Re), o = n && r, a = {
    manageTimeEnabled: n,
    sceneAllowsRealTime: r,
    effectiveEnabled: o,
    paused: i,
    canControl: C(this, D, Tt).call(this),
    combatRunning: C(this, D, Ci).call(this),
    overrideApplied: typeof t == "boolean"
  };
  if (E("GameTimeAutomation | Sync running state", a), !o || !C(this, D, Tt).call(this)) {
    C(this, D, nr).call(this);
    return;
  }
  C(this, D, No).call(this);
}, "#syncRunningState"), No = /* @__PURE__ */ s(function() {
  g(this, Ge) === null && (A(this, st, C(this, D, er).call(this)), A(this, Ge, globalThis.setInterval(() => C(this, D, Do).call(this), 1e3)), E("GameTimeAutomation | Started real-time ticker"));
}, "#startRealTimeTicker"), nr = /* @__PURE__ */ s(function() {
  g(this, Ge) !== null && (globalThis.clearInterval(g(this, Ge)), A(this, Ge, null), E("GameTimeAutomation | Stopped real-time ticker")), A(this, st, null), A(this, De, 0), A(this, lt, !1);
}, "#stopRealTimeTicker"), Do = /* @__PURE__ */ s(function() {
  if (!g(this, Oe) || !g(this, Re) || !C(this, D, Tt).call(this)) {
    C(this, D, nr).call(this);
    return;
  }
  const t = C(this, D, er).call(this);
  if (typeof t != "number" || !Number.isFinite(t)) return;
  const i = g(this, st) ?? t, n = (t - i) / 1e3;
  if (A(this, st, t), !Number.isFinite(n) || n <= 0) return;
  const r = !!(game != null && game.paused), o = C(this, D, Ci).call(this);
  if (r || o) {
    g(this, lt) || E("GameTimeAutomation | Tick skipped", { paused: r, combatRunning: o }), A(this, lt, !0), A(this, De, 0);
    return;
  }
  A(this, lt, !1), E("GameTimeAutomation | Real-time tick", { deltaSeconds: n }), C(this, D, rr).call(this, n);
}, "#tickRealTime"), rr = /* @__PURE__ */ s(function(t) {
  if (!g(this, Oe) || !g(this, Re)) return;
  const i = Number(t);
  !Number.isFinite(i) || i <= 0 || (A(this, De, g(this, De) + i), !g(this, vt) && A(this, vt, C(this, D, Ro).call(this)));
}, "#queueAdvance"), Ro = /* @__PURE__ */ s(async function() {
  var t, i;
  for (; g(this, De) > 0; ) {
    if (!g(this, Oe) || !g(this, Re) || game != null && game.paused || !C(this, D, Tt).call(this) || C(this, D, Ci).call(this)) {
      A(this, De, 0);
      break;
    }
    const n = g(this, De);
    A(this, De, 0);
    try {
      if (typeof ((t = game == null ? void 0 : game.time) == null ? void 0 : t.advance) == "function")
        E("GameTimeAutomation | Advancing world time", { delta: n }), await game.time.advance(n), E("GameTimeAutomation | World time advanced", {
          worldTime: ((i = game.time) == null ? void 0 : i.worldTime) ?? null
        });
      else {
        console.warn(`${O} | game.time.advance is unavailable; cannot manage world time.`);
        break;
      }
    } catch (r) {
      console.error(`${O} | Failed to advance world time`, r);
      break;
    }
  }
  A(this, vt, null);
}, "#flushAdvanceQueue"), Xi = new WeakMap(), Zi = new WeakMap(), en = new WeakMap(), tn = new WeakMap(), nn = new WeakMap(), rn = new WeakMap(), or = /* @__PURE__ */ s(function() {
  const t = xt();
  return pe(t) ? t : null;
}, "#getActiveSceneDocument"), _o = /* @__PURE__ */ s(function(t) {
  if (!pe(t)) return !1;
  try {
    return !!t.getFlag(O, Fn);
  } catch (i) {
    return E("GameTimeAutomation | Failed to read scene real-time flag", {
      sceneId: (t == null ? void 0 : t.id) ?? null,
      message: (i == null ? void 0 : i.message) ?? String(i)
    }), !1;
  }
}, "#isSceneRealTimeAllowed"), Si = /* @__PURE__ */ s(function(t) {
  const i = pe(t) ? t : C(this, D, or).call(this), n = C(this, D, _o).call(this, i), r = g(this, Re);
  return A(this, Re, n), r !== n ? (E("GameTimeAutomation | Scene real-time allowance changed", {
    sceneId: (i == null ? void 0 : i.id) ?? null,
    allows: n
  }), !0) : !1;
}, "#refreshSceneAutomationState"), on = new WeakMap(), an = new WeakMap(), s(_r, "GameTimeAutomation");
let Zn = _r;
var co, ze, me, ct, xe, sn, se, Fo, Ho, $o, ko, ln, sr, cn, qo, un, Po, xo;
const qe = class qe extends Tn(yn) {
  constructor(i = {}) {
    const { scene: n, trigger: r, triggerIndex: o, onSave: a, ...l } = i ?? {};
    super(l);
    I(this, se);
    I(this, ze, null);
    I(this, me, null);
    I(this, ct, null);
    I(this, xe, null);
    I(this, sn, /* @__PURE__ */ s(() => {
      (this.rendered ?? this.isRendered ?? !1) && (A(this, xe, C(this, se, Fo).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    I(this, ln, /* @__PURE__ */ s((i) => {
      var o, a;
      const n = i.currentTarget, r = n == null ? void 0 : n.closest("form");
      r && (E("Trigger action selection changed", {
        sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
        triggerId: ((a = this.trigger) == null ? void 0 : a.id) ?? null,
        actionId: (n == null ? void 0 : n.value) ?? null
      }), C(this, se, sr).call(this, n.value, r));
    }, "#onActionSelectChange"));
    I(this, cn, /* @__PURE__ */ s((i) => {
      var d, u, m, h;
      i.preventDefault();
      const n = i.currentTarget, r = n == null ? void 0 : n.closest("form");
      if (!r) return;
      const o = (d = n.dataset) == null ? void 0 : d.target;
      if (!o) return;
      const a = typeof (CSS == null ? void 0 : CSS.escape) == "function" ? CSS.escape : (p) => p, l = r.querySelector(`[name="${a(o)}"]`);
      if (!l) return;
      E("Opening file picker for trigger", {
        sceneId: ((u = this.scene) == null ? void 0 : u.id) ?? null,
        triggerId: ((m = this.trigger) == null ? void 0 : m.id) ?? null,
        target: o
      }), new FilePicker({
        type: ((h = n.dataset) == null ? void 0 : h.type) || "audio",
        current: l.value,
        callback: /* @__PURE__ */ s((p) => {
          var y, T;
          l.value = p, l.dispatchEvent(new Event("change")), E("Trigger form file selected", {
            sceneId: ((y = this.scene) == null ? void 0 : y.id) ?? null,
            triggerId: ((T = this.trigger) == null ? void 0 : T.id) ?? null,
            target: o,
            path: p
          });
        }, "callback")
      }).render({ force: !0 });
    }, "#onFilePicker"));
    I(this, un, /* @__PURE__ */ s(async (i) => {
      var r, o;
      i.preventDefault();
      const n = i.currentTarget;
      n instanceof HTMLFormElement && (E("Trigger form submitted", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null,
        triggerId: ((o = this.trigger) == null ? void 0 : o.id) ?? null
      }), await C(this, se, Po).call(this, n));
    }, "#onSubmit"));
    this.scene = n ?? null, this.trigger = r ?? null, this.triggerIndex = Number.isInteger(o) ? Number(o) : null, this.onSave = typeof a == "function" ? a : null, A(this, ct, Cr(g(this, sn)));
  }
  async _prepareContext() {
    var i, n;
    Mt("TriggerFormApplication#_prepareContext", {
      sceneId: ((i = this.scene) == null ? void 0 : i.id) ?? null,
      triggerId: ((n = this.trigger) == null ? void 0 : n.id) ?? null,
      triggerIndex: this.triggerIndex
    });
    try {
      const r = this.trigger ?? { action: Ei, data: {} }, o = r.action ?? Ei, a = Gr(r.time), l = a.format ?? "12h", c = l === "12h" ? xa() : [], d = a.period ?? (c.length > 0 ? c[0].value : null), u = l === "12h" ? c.map((p) => ({
        ...p,
        selected: p.value === d
      })) : [], m = jr().map((p) => ({
        id: p.id,
        label: typeof p.label == "function" ? p.label() : p.label,
        selected: p.id === o
      })), h = jr().map((p) => {
        const y = p.id === r.action ? r : { ...r, action: p.id }, T = _a(y);
        return T ? {
          id: p.id,
          visible: p.id === o,
          content: T
        } : null;
      }).filter(Boolean);
      return {
        timeValue: a.canonical ?? "",
        timeHourValue: a.hour ?? "",
        timeMinuteValue: a.minute ?? "",
        timePeriodValue: d ?? "",
        timeFormat: l,
        is12HourFormat: l === "12h",
        is24HourFormat: l === "24h",
        timePeriodOptions: u,
        actions: m,
        actionSections: h,
        allowReplayOnRewind: !!r.allowReplayOnRewind,
        labels: {
          time: f("EIDOLON.TimeTrigger.TriggerTime", "Trigger Time"),
          hour: f("EIDOLON.TimeTrigger.TriggerTimeHour", "Hour"),
          minute: f("EIDOLON.TimeTrigger.TriggerTimeMinute", "Minute"),
          period: f("EIDOLON.TimeTrigger.TriggerTimePeriod", "AM / PM"),
          action: f("EIDOLON.TimeTrigger.TriggerAction", "Action"),
          allowReplayOnRewind: f(
            "EIDOLON.TimeTrigger.AllowReplayOnRewind",
            "Allow replay after rewinding time"
          ),
          allowReplayOnRewindHint: f(
            "EIDOLON.TimeTrigger.AllowReplayOnRewindHint",
            "When enabled, this trigger can fire again if world time moves backward."
          ),
          save: f("EIDOLON.TimeTrigger.TriggerSave", "Save Trigger")
        }
      };
    } finally {
      Ye();
    }
  }
  _onRender(i, n) {
    var c, d, u;
    super._onRender(i, n);
    const r = this.element;
    if (!r) return;
    E("Trigger form rendered", {
      sceneId: ((c = this.scene) == null ? void 0 : c.id) ?? null,
      triggerId: ((d = this.trigger) == null ? void 0 : d.id) ?? null
    });
    const o = Array.from(((u = document == null ? void 0 : document.body) == null ? void 0 : u.classList) ?? []).find(
      (m) => m.startsWith("theme-")
    );
    o && r.classList.add(o);
    const a = r.querySelector("form");
    if (!a) return;
    C(this, se, qo).call(this, a), C(this, se, Ho).call(this, a), a.addEventListener("submit", g(this, un));
    const l = a.querySelector("[data-action-select]");
    l && (l.addEventListener("change", g(this, ln)), C(this, se, sr).call(this, l.value, a)), a.querySelectorAll("[data-action-file-picker]").forEach((m) => {
      m.addEventListener("click", g(this, cn));
    });
  }
  async close(i = {}) {
    var n;
    if ((n = g(this, ze)) == null || n.call(this), A(this, ze, null), A(this, me, null), A(this, xe, null), typeof g(this, ct) == "function")
      try {
        g(this, ct).call(this);
      } catch (r) {
        console.error(`${O} | Failed to dispose trigger form time format subscription`, r);
      }
    return A(this, ct, null), super.close(i);
  }
};
ze = new WeakMap(), me = new WeakMap(), ct = new WeakMap(), xe = new WeakMap(), sn = new WeakMap(), se = new WeakSet(), Fo = /* @__PURE__ */ s(function() {
  var l, c, d, u, m, h, p;
  const i = (c = (l = this.element) == null ? void 0 : l.querySelector) == null ? void 0 : c.call(l, "form");
  if (!(i instanceof HTMLFormElement)) return null;
  const n = Array.from(i.elements ?? []), r = [];
  for (const y of n)
    if ((y instanceof HTMLInputElement || y instanceof HTMLSelectElement || y instanceof HTMLTextAreaElement) && y.name && !(((d = y.dataset) == null ? void 0 : d.timeHidden) !== void 0 || ((u = y.dataset) == null ? void 0 : u.timeHour) !== void 0 || ((m = y.dataset) == null ? void 0 : m.timeMinute) !== void 0 || ((h = y.dataset) == null ? void 0 : h.timePeriod) !== void 0)) {
      if (y instanceof HTMLInputElement) {
        if (y.type === "checkbox" || y.type === "radio") {
          r.push({
            kind: y.type,
            name: y.name,
            value: y.value,
            checked: y.checked
          });
          continue;
        }
        r.push({
          kind: "value",
          name: y.name,
          value: y.value
        });
        continue;
      }
      if (y instanceof HTMLSelectElement) {
        y.multiple ? r.push({
          kind: "select-multiple",
          name: y.name,
          values: Array.from(y.selectedOptions ?? []).map((T) => T.value)
        }) : r.push({
          kind: "value",
          name: y.name,
          value: y.value
        });
        continue;
      }
      r.push({
        kind: "value",
        name: y.name,
        value: y.value
      });
    }
  const o = i.querySelector("[data-time-format]");
  let a = null;
  if (o instanceof HTMLElement) {
    const y = o.querySelector("[data-time-hidden]"), T = o.querySelector("[data-time-hour]"), S = o.querySelector("[data-time-minute]"), b = o.querySelector("[data-time-period]");
    a = {
      format: ((p = o.dataset) == null ? void 0 : p.timeFormat) ?? null,
      canonical: y instanceof HTMLInputElement ? y.value : "",
      hour: T instanceof HTMLInputElement ? T.value : "",
      minute: S instanceof HTMLInputElement ? S.value : "",
      period: b instanceof HTMLSelectElement ? b.value : ""
    };
  }
  return {
    fields: r,
    time: a
  };
}, "#captureFormState"), Ho = /* @__PURE__ */ s(function(i) {
  if (!g(this, xe)) return;
  if (!(i instanceof HTMLFormElement)) {
    A(this, xe, null);
    return;
  }
  const { fields: n = [], time: r = null } = g(this, xe) ?? {};
  A(this, xe, null), C(this, se, $o).call(this, i, n), C(this, se, ko).call(this, i, r);
}, "#restorePendingFormState"), $o = /* @__PURE__ */ s(function(i, n) {
  if (!Array.isArray(n) || n.length === 0) return;
  const r = typeof (CSS == null ? void 0 : CSS.escape) == "function" ? CSS.escape : (o) => o;
  for (const o of n) {
    if (!o || typeof o.name != "string") continue;
    const a = r(o.name);
    if (o.kind === "checkbox" || o.kind === "radio") {
      const c = `input[type="${o.kind}"][name="${a}"]`, d = i.querySelectorAll(c);
      d.forEach((u) => {
        u instanceof HTMLInputElement && (d.length === 1 || u.value === o.value) && (u.checked = !!o.checked);
      });
      continue;
    }
    if (o.kind === "select-multiple") {
      const c = i.querySelector(`select[name="${a}"]`);
      if (!(c instanceof HTMLSelectElement)) continue;
      const d = new Set(Array.isArray(o.values) ? o.values : []);
      Array.from(c.options ?? []).forEach((u) => {
        u.selected = d.has(u.value);
      });
      continue;
    }
    const l = i.querySelector(`[name="${a}"]`);
    (l instanceof HTMLInputElement || l instanceof HTMLSelectElement || l instanceof HTMLTextAreaElement) && (l.value = o.value ?? "");
  }
}, "#restoreFieldValues"), ko = /* @__PURE__ */ s(function(i, n) {
  var v, N, q;
  const r = i.querySelector("[data-time-format]");
  if (!(r instanceof HTMLElement)) {
    typeof g(this, me) == "function" && g(this, me).call(this);
    return;
  }
  const o = ((v = r.dataset) == null ? void 0 : v.timeFormat) === "24h" ? "24h" : "12h", a = r.querySelector("[data-time-hour]"), l = r.querySelector("[data-time-minute]"), c = r.querySelector("[data-time-period]"), d = r.querySelector("[data-time-hidden]");
  if (!n) {
    if (a instanceof HTMLInputElement && (a.value = ""), l instanceof HTMLInputElement && (l.value = ""), c instanceof HTMLSelectElement) {
      const B = ((q = (N = c.options) == null ? void 0 : N[0]) == null ? void 0 : q.value) ?? "";
      c.value = B;
    }
    d instanceof HTMLInputElement && (d.value = ""), typeof g(this, me) == "function" && g(this, me).call(this);
    return;
  }
  const u = typeof n.canonical == "string" ? n.canonical : "", m = typeof n.period == "string" ? n.period : "", h = typeof n.hour == "string" ? n.hour : "", p = typeof n.minute == "string" ? n.minute : "";
  let y = "", T = "", S = m, b = u;
  if (u) {
    const B = Gr(u, o);
    y = B.hour ?? "", T = B.minute ?? "", b = B.canonical ?? u, o === "12h" ? S = B.period ?? m : S = "";
  } else
    y = h, T = p, o !== "12h" && (S = "");
  if (a instanceof HTMLInputElement && (a.value = y ?? ""), l instanceof HTMLInputElement && (l.value = T ?? ""), c instanceof HTMLSelectElement)
    if (o === "12h") {
      const B = Array.from(c.options ?? []);
      B.find((R) => R.value === S) ? c.value = S : B.length > 0 ? c.value = B[0].value : c.value = "";
    } else
      c.value = "";
  d instanceof HTMLInputElement && (d.value = b ?? ""), typeof g(this, me) == "function" && g(this, me).call(this);
}, "#restoreTimeInputs"), ln = new WeakMap(), sr = /* @__PURE__ */ s(function(i, n) {
  n && n.querySelectorAll("[data-action-config]").forEach((r) => {
    const o = r.dataset.actionConfig === i;
    r.style.display = o ? "" : "none";
  });
}, "#updateActionSections"), cn = new WeakMap(), qo = /* @__PURE__ */ s(function(i) {
  var m, h, p, y;
  if ((m = g(this, ze)) == null || m.call(this), A(this, ze, null), A(this, me, null), !(i instanceof HTMLFormElement)) return;
  const n = i.querySelector("[data-time-format]"), r = ((h = n == null ? void 0 : n.dataset) == null ? void 0 : h.timeFormat) ?? null;
  if (r !== "12h" && r !== "24h")
    return;
  const o = n.querySelector("[data-time-hidden]"), a = n.querySelector("[data-time-hour]"), l = n.querySelector("[data-time-minute]"), c = r === "12h" ? n.querySelector("[data-time-period]") : null;
  if (!o || !a || !l || r === "12h" && !c) {
    E("Trigger form time inputs missing elements", {
      format: r,
      hasHidden: !!o,
      hasHour: !!a,
      hasMinute: !!l,
      hasPeriod: !!c
    });
    return;
  }
  const d = [a, l, ...c ? [c] : []], u = /* @__PURE__ */ s(() => {
    const { canonical: T, error: S } = Pa(
      {
        hour: a.value,
        minute: l.value,
        period: (c == null ? void 0 : c.value) ?? null,
        time: o.value
      },
      r
    );
    o.value = T ?? "";
    const b = S ?? "";
    o.setCustomValidity(b), d.forEach((v) => {
      v.setCustomValidity(b);
    });
  }, "update");
  d.forEach((T) => {
    T.addEventListener("input", u), T.addEventListener("change", u);
  }), u(), A(this, ze, () => {
    d.forEach((T) => {
      T.removeEventListener("input", u), T.removeEventListener("change", u);
    });
  }), A(this, me, u), E("Trigger form configured for time input", {
    format: r,
    sceneId: ((p = this.scene) == null ? void 0 : p.id) ?? null,
    triggerId: ((y = this.trigger) == null ? void 0 : y.id) ?? null
  });
}, "#setupTimeInput"), un = new WeakMap(), Po = /* @__PURE__ */ s(async function(i) {
  var o, a, l, c, d;
  if (typeof g(this, me) == "function" && g(this, me).call(this), typeof i.checkValidity == "function" && !i.checkValidity()) {
    typeof i.reportValidity == "function" && i.reportValidity(), E("Trigger form submission blocked by validity check", {
      sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
      triggerId: ((a = this.trigger) == null ? void 0 : a.id) ?? null
    });
    return;
  }
  const n = new FormData(i), r = Object.fromEntries(n.entries());
  delete r.timeHour, delete r.timeMinute, delete r.timePeriod, r.allowReplayOnRewind = ((l = i.querySelector('input[name="allowReplayOnRewind"]')) == null ? void 0 : l.checked) ?? !1, E("Processing trigger form submission", {
    sceneId: ((c = this.scene) == null ? void 0 : c.id) ?? null,
    triggerId: ((d = this.trigger) == null ? void 0 : d.id) ?? null,
    allowReplayOnRewind: r.allowReplayOnRewind
  }), await C(this, se, xo).call(this, r), await this.close();
}, "#handleSubmit"), xo = /* @__PURE__ */ s(async function(i) {
  var o, a, l, c, d, u;
  const n = {
    id: ((o = this.trigger) == null ? void 0 : o.id) ?? Ea(),
    time: i.time ?? "",
    action: i.action ?? Ei,
    allowReplayOnRewind: !!i.allowReplayOnRewind,
    data: {}
  };
  E("Persisting trigger from form", {
    sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
    triggerId: n.id,
    existingIndex: this.triggerIndex
  }), Fa(n, i);
  const r = Ct(this.scene);
  this.triggerIndex !== null && r[this.triggerIndex] ? r[this.triggerIndex] = n : r.push(n);
  try {
    await bo(this.scene, r), E("Trigger list saved", {
      sceneId: ((l = this.scene) == null ? void 0 : l.id) ?? null,
      triggerCount: r.length
    });
  } catch (m) {
    throw console.error(`${O} | Failed to save time trigger`, m), (d = (c = ui.notifications) == null ? void 0 : c.error) == null || d.call(
      c,
      f(
        "EIDOLON.TimeTrigger.TriggerSaveError",
        "Failed to save the scene's time triggers."
      )
    ), m;
  }
  if (this.onSave)
    try {
      this.onSave(r);
    } catch (m) {
      console.error(`${O} | Trigger onSave callback failed`, m), E("Trigger onSave callback failed", {
        sceneId: ((u = this.scene) == null ? void 0 : u.id) ?? null,
        message: (m == null ? void 0 : m.message) ?? String(m)
      });
    }
}, "#persistTrigger"), s(qe, "TriggerFormApplication"), Ze(qe, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  yt(qe, qe, "DEFAULT_OPTIONS"),
  {
    id: `${O}-trigger-form`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((co = yt(qe, qe, "DEFAULT_OPTIONS")) == null ? void 0 : co.classes) ?? [], "standard-form", "themed"])
    ),
    window: {
      title: f("EIDOLON.TimeTrigger.TriggerFormTitle", "Configure Time Trigger"),
      resizable: !1
    },
    position: {
      width: 400,
      height: "auto"
    }
  },
  { inplace: !1 }
)), Ze(qe, "PARTS", {
  content: {
    template: `modules/${O}/templates/time-trigger-form.html`
  }
});
let ar = qe;
function At(e) {
  return e instanceof HTMLElement ? e : (e == null ? void 0 : e[0]) instanceof HTMLElement ? e[0] : null;
}
s(At, "asHTMLElement");
function Oi(e) {
  return typeof (e == null ? void 0 : e.changeTab) == "function";
}
s(Oi, "isAppV2");
function Ua(e, t, i, n = {}) {
  if (Oi(e)) {
    e.changeTab(t, i, n);
    return;
  }
  if (typeof (e == null ? void 0 : e.activateTab) == "function") {
    const r = { ...n };
    i != null && (r.group = i), r.triggerCallback == null && (r.triggerCallback = !0), e.activateTab(t, r);
  }
}
s(Ua, "setActiveTab");
function Va(e) {
  var i, n;
  if (!(e instanceof HTMLFormElement)) return {};
  const t = ((n = (i = foundry == null ? void 0 : foundry.applications) == null ? void 0 : i.ux) == null ? void 0 : n.FormDataExtended) ?? globalThis.FormDataExtended ?? null;
  if (!t) return {};
  try {
    const r = new t(e), o = typeof r.object == "object" ? r.object : {};
    return foundry.utils.expandObject(o);
  } catch {
    return {};
  }
}
s(Va, "readFormData");
const Wr = Symbol.for("eidolon.sceneConfig.v13PatchedTabs");
function Bo(e = {}) {
  const {
    tabId: t,
    tabLabel: i,
    getScene: n,
    isApplicable: r,
    renderContent: o,
    debugNamespace: a = "SceneConfigTab",
    onButtonCreate: l,
    onTabCreate: c,
    onAfterRender: d,
    logger: u = {},
    moduleId: m = "eidolon-utilities",
    tabIcon: h = "fa-solid fa-puzzle-piece"
  } = e ?? {};
  if (!t)
    throw new Error("createSceneConfigTabFactory requires a tabId.");
  if (typeof o != "function")
    throw new TypeError("createSceneConfigTabFactory requires a renderContent callback.");
  const p = typeof u.log == "function" ? u.log.bind(u) : (...w) => {
    var z;
    return (z = console.debug) == null ? void 0 : z.call(console, `${a}`, ...w);
  }, y = typeof u.group == "function" ? u.group.bind(u) : (...w) => {
    var z;
    return (z = console.groupCollapsed) == null ? void 0 : z.call(console, `${a}`, ...w);
  }, T = typeof u.groupEnd == "function" ? u.groupEnd.bind(u) : () => {
    var w;
    return (w = console.groupEnd) == null ? void 0 : w.call(console);
  }, S = Symbol(`EIDOLON_SCENE_CONFIG_TAB_CLEANUP_${t}`), b = typeof n == "function" ? n : () => null, v = typeof r == "function" ? r : () => !0, N = typeof i == "function" ? i : () => typeof i == "string" ? i : t;
  function q() {
    var H, _, P, W, te;
    const w = ((_ = (H = foundry == null ? void 0 : foundry.applications) == null ? void 0 : H.sheets) == null ? void 0 : _.SceneConfig) ?? ((P = CONFIG == null ? void 0 : CONFIG.Scene) == null ? void 0 : P.sheetClass);
    if (!w || !Oi({ changeTab: (W = w.prototype) == null ? void 0 : W.changeTab })) return;
    const z = w[Wr] ?? /* @__PURE__ */ new Set();
    if (z.has(t)) return;
    z.add(t), w[Wr] = z;
    const $ = (te = w.TABS) == null ? void 0 : te.sheet;
    if ($ && Array.isArray($.tabs) && !$.tabs.some((j) => j.id === t)) {
      const j = N({ app: null, scene: null }) ?? t;
      $.tabs.push({
        id: t,
        icon: h,
        label: j
      });
    }
    w.PARTS && !w.PARTS[t] && (w.PARTS[t] = {
      template: `modules/${m}/templates/scene-config-tab-mount.hbs`,
      scrollable: [`.tab[data-tab="${t}"]`]
    }), p("Patched v13 SceneConfig TABS/PARTS", { tabId: t });
  }
  s(q, "patchV13SceneConfig");
  function B(w, z) {
    var H, _;
    const $ = b(w);
    if (!v(w, $)) {
      p("Skipped render", {
        tabId: t,
        reason: "inapplicable",
        constructor: ((H = w == null ? void 0 : w.constructor) == null ? void 0 : H.name) ?? null
      });
      return;
    }
    y("render", {
      tabId: t,
      sceneId: ($ == null ? void 0 : $.id) ?? null,
      constructor: ((_ = w == null ? void 0 : w.constructor) == null ? void 0 : _.name) ?? null
    });
    try {
      const P = At(z) ?? At(w.element);
      if (!P) {
        p("Missing root element", { tabId: t });
        return;
      }
      Oi(w) ? Z(w, P, $) : R(w, P, $);
    } finally {
      T();
    }
  }
  s(B, "handleRender");
  function U(w, z, $) {
    var P;
    if (!h) {
      w.textContent = z;
      return;
    }
    const H = (P = w.querySelector("i")) == null ? void 0 : P.cloneNode(!0);
    w.textContent = "";
    const _ = H ?? document.createElement("i");
    if (H || (_.className = h, $ && (_.inert = !0)), w.append(_, " "), $) {
      const W = document.createElement("span");
      W.textContent = z, w.append(W);
    } else
      w.append(document.createTextNode(z));
  }
  s(U, "setButtonContent");
  function R(w, z, $) {
    var _t, He, Ft, M, k, G, J, X, ee, ne, ue, Le, de, Ce, ie, Se;
    const _ = [
      "nav.sheet-tabs[data-group]",
      "nav.tabs[data-group]",
      "nav.sheet-tabs",
      "nav.tabs"
    ].map((re) => z.querySelector(re)).find((re) => re instanceof HTMLElement), W = [
      (_t = z.querySelector(".tab[data-tab]")) == null ? void 0 : _t.parentElement,
      z.querySelector(".sheet-body"),
      (Ft = (He = _ == null ? void 0 : _.parentElement) == null ? void 0 : He.querySelector) == null ? void 0 : Ft.call(He, ":scope > .sheet-body"),
      _ == null ? void 0 : _.parentElement
    ].find((re) => re instanceof HTMLElement), te = ((M = _ == null ? void 0 : _.dataset) == null ? void 0 : M.group) ?? ((J = (G = (k = _ == null ? void 0 : _.querySelector) == null ? void 0 : k.call(_, "a[data-group]")) == null ? void 0 : G.dataset) == null ? void 0 : J.group) ?? ((ne = (ee = (X = _ == null ? void 0 : _.querySelector) == null ? void 0 : X.call(_, "[data-group]")) == null ? void 0 : ee.dataset) == null ? void 0 : ne.group) ?? ((de = (Le = (ue = W == null ? void 0 : W.querySelector) == null ? void 0 : ue.call(W, ".tab[data-group]")) == null ? void 0 : Le.dataset) == null ? void 0 : de.group) ?? "main";
    if (!_ || !W) {
      p("Missing navigation elements", {
        tabId: t,
        hasNav: !!_,
        hasBody: !!W
      });
      return;
    }
    let j = _.querySelector(`[data-tab="${t}"]`);
    if (!j) {
      j = document.createElement("a"), j.dataset.action = "tab", j.dataset.group = te, j.dataset.tab = t;
      const re = _.querySelector("a[data-tab]");
      (Ce = re == null ? void 0 : re.classList) != null && Ce.contains("item") && j.classList.add("item"), _.appendChild(j), typeof l == "function" && l({ app: w, button: j, nav: _, scene: $ }), p("Created tab button", { tabId: t, group: te });
    }
    U(j, N({ app: w, scene: $ }) ?? t, Oi(w));
    let L = W.querySelector(`.tab[data-tab="${t}"]`);
    if (!L) {
      L = document.createElement("div"), L.classList.add("tab"), L.dataset.tab = t, L.dataset.group = te;
      const re = ja(W);
      W.insertBefore(L, re ?? null), typeof c == "function" && c({ app: w, tab: L, body: W, scene: $ }), p("Created tab container", { tabId: t, group: te });
    }
    ((ie = j.classList) == null ? void 0 : ie.contains("active")) || L.classList.contains("active") ? (j.classList.add("active"), L.classList.add("active"), L.removeAttribute("hidden")) : (j.classList.remove("active"), L.classList.remove("active"), L.setAttribute("hidden", "true"));
    const x = /* @__PURE__ */ s(() => {
      var ye, Me;
      ((ye = j.classList) != null && ye.contains("active") || L.classList.contains("active")) && ((Me = j.classList) == null || Me.add("active"), L.classList.add("active"), L.removeAttribute("hidden"), L.removeAttribute("aria-hidden"), L.style.display === "none" && (L.style.display = ""));
    }, "ensureTabVisible"), Rt = /* @__PURE__ */ s(() => {
      x(), requestAnimationFrame(x);
    }, "scheduleEnsureTabVisible");
    j.dataset.eidolonEnsureSceneTabVisibility || (j.addEventListener("click", () => {
      Ua(w, t, te), requestAnimationFrame(x);
    }), j.dataset.eidolonEnsureSceneTabVisibility = "true"), An(w, S, p);
    const gi = o({
      app: w,
      scene: $,
      tab: L,
      tabButton: j,
      ensureTabVisible: x,
      scheduleEnsureTabVisible: Rt
    });
    typeof gi == "function" && Kr(w, S, gi), typeof d == "function" && d({
      app: w,
      scene: $,
      tab: L,
      tabButton: j,
      ensureTabVisible: x,
      scheduleEnsureTabVisible: Rt
    }), (Se = w.setPosition) == null || Se.call(w, { height: "auto" });
  }
  s(R, "handleRenderV1");
  function Z(w, z, $) {
    const H = z.querySelector(`.tab[data-tab="${t}"]`), _ = z.querySelector(`nav [data-tab="${t}"]`);
    if (!H || !_) {
      p("v2 mount not found, falling back to v1 injection", { tabId: t }), R(w, z, $);
      return;
    }
    U(_, N({ app: w, scene: $ }) ?? t, !0);
    const P = /* @__PURE__ */ s(() => {
      var j;
      !((j = _.classList) != null && j.contains("active")) && !H.classList.contains("active") || (H.classList.add("active"), H.removeAttribute("hidden"), H.removeAttribute("aria-hidden"), H.style.display === "none" && (H.style.display = ""));
    }, "ensureTabVisible"), W = /* @__PURE__ */ s(() => {
      P(), requestAnimationFrame(P);
    }, "scheduleEnsureTabVisible");
    An(w, S, p);
    const te = o({
      app: w,
      scene: $,
      tab: H,
      tabButton: _,
      ensureTabVisible: P,
      scheduleEnsureTabVisible: W
    });
    typeof te == "function" && Kr(w, S, te), typeof d == "function" && d({
      app: w,
      scene: $,
      tab: H,
      tabButton: _,
      ensureTabVisible: P,
      scheduleEnsureTabVisible: W
    });
  }
  s(Z, "handleRenderV2");
  function Y(w) {
    An(w, S, p);
  }
  s(Y, "handleClose");
  function F() {
    return Hooks.once("init", () => {
      q();
    }), Hooks.on("renderSceneConfig", B), Hooks.on("closeSceneConfig", Y), () => V();
  }
  s(F, "register");
  function V() {
    Hooks.off("renderSceneConfig", B), Hooks.off("closeSceneConfig", Y);
  }
  return s(V, "unregister"), { register: F, unregister: V };
}
s(Bo, "createSceneConfigTabFactory");
function Kr(e, t, i) {
  if (!e || typeof i != "function") return;
  const n = e == null ? void 0 : e[t];
  Array.isArray(n) || (e[t] = []), e[t].push(i);
}
s(Kr, "registerCleanup");
function An(e, t, i) {
  if (!e) return;
  const n = e == null ? void 0 : e[t];
  if (Array.isArray(n))
    for (; n.length > 0; ) {
      const r = n.pop();
      if (typeof r == "function")
        try {
          r();
        } catch (o) {
          i("Cleanup failed", { message: (o == null ? void 0 : o.message) ?? String(o) });
        }
    }
}
s(An, "invokeCleanup");
function ja(e) {
  if (!(e instanceof HTMLElement)) return null;
  const t = [
    ":scope > footer.sheet-footer",
    ":scope > footer.form-footer",
    ":scope > .sheet-footer",
    ":scope > .form-footer",
    ":scope > footer"
  ];
  for (const i of t) {
    const n = e.querySelector(i);
    if (n instanceof HTMLElement) return n;
  }
  return null;
}
s(ja, "findFooterElement");
const Ga = Or(ar), za = `modules/${O}/templates/time-trigger-scene-tab.html`, Wa = Bo({
  tabId: "time-triggers",
  tabLabel: /* @__PURE__ */ s(() => f("EIDOLON.TimeTrigger.Tab", "Time Triggers"), "tabLabel"),
  getScene: Fe,
  isApplicable: Qa,
  renderContent: /* @__PURE__ */ s(({ app: e, scene: t, tab: i }) => Ja(e, i, t), "renderContent"),
  logger: {
    log: E,
    group: Mt,
    groupEnd: Ye
  }
});
function Ka() {
  return E("Registering SceneConfig render hook"), Wa.register();
}
s(Ka, "registerSceneConfigHook");
function Ja(e, t, i) {
  if (!(t instanceof HTMLElement)) return;
  const n = pe(i) ? i : Fe(e);
  ki(e, t, n);
  const r = Cr(() => {
    ki(e, t, n);
  });
  return () => {
    if (typeof r == "function")
      try {
        r();
      } catch (o) {
        console.error(
          `${O} | Failed to dispose scene config time format subscription`,
          o
        );
      }
  };
}
s(Ja, "renderTimeTriggerTab");
async function ki(e, t, i) {
  var r, o;
  const n = i ?? Fe(e);
  Mt("renderTimeTriggersTabContent", { sceneId: (n == null ? void 0 : n.id) ?? null });
  try {
    if (!pe(n)) {
      const H = f(
        "EIDOLON.TimeTrigger.Unavailable",
        "Time triggers are unavailable for this configuration sheet."
      );
      t.innerHTML = `<p class="notes">${H}</p>`, E("Scene lacks document for time triggers", { sceneId: (n == null ? void 0 : n.id) ?? null });
      return;
    }
    const a = `flags.${O}.${Di}`, l = `flags.${O}.${Rn}`, c = `flags.${O}.${_n}`, d = !!n.getFlag(O, Di), u = !!n.getFlag(O, Rn), m = !!n.getFlag(O, _n), h = Ct(n);
    E("Rendering time trigger list", {
      sceneId: n.id,
      isActive: d,
      shouldHideWindow: u,
      shouldShowPlayerWindow: m,
      triggerCount: h.length
    });
    const p = f("EIDOLON.TimeTrigger.Activate", "Activate Time Trigger"), y = f(
      "EIDOLON.TimeTrigger.Description",
      "Enable scene time triggers so scheduled actions can run automatically."
    ), T = f(
      "EIDOLON.TimeTrigger.HideWindowLabel",
      "Hide Floating Time Window"
    ), S = f(
      "EIDOLON.TimeTrigger.HideWindowDescription",
      "Keep the floating time control window hidden while leaving time triggers active."
    ), b = f(
      "EIDOLON.TimeTrigger.ShowPlayerWindowLabel",
      "Share Floating Time Window with Players"
    ), v = f(
      "EIDOLON.TimeTrigger.ShowPlayerWindowDescription",
      "Let non-GM players see the floating time window (without time controls)."
    ), N = f(
      "EIDOLON.TimeTrigger.TriggerListLabel",
      "Scene Time Triggers"
    ), q = f(
      "EIDOLON.TimeTrigger.TriggerListEmpty",
      "No time triggers configured for this scene."
    ), B = f("EIDOLON.TimeTrigger.AddTrigger", "Add Trigger"), U = f("EIDOLON.TimeTrigger.EditTrigger", "Edit"), R = f("EIDOLON.TimeTrigger.DeleteTrigger", "Remove"), Z = f("EIDOLON.TimeTrigger.TriggerNow", "Trigger Now"), Y = f("EIDOLON.TimeTrigger.AtLabel", "At"), F = f("EIDOLON.TimeTrigger.DoLabel", "Do"), V = f("EIDOLON.TimeTrigger.MissingTime", "(No time set)"), w = h.map((H, _) => {
      const te = (H.time ? qa(H.time) : "") || H.time || "" || V, j = Da(H.action), L = [
        `${Y} ${te}`,
        `${F} ${j}`,
        ...Ra(H)
      ];
      return {
        index: _,
        summaryParts: L,
        tooltips: {
          triggerNow: Z,
          edit: U,
          delete: R
        }
      };
    }), z = ((o = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : o.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof z != "function") {
      console.error(`${O} | renderTemplate is unavailable; cannot render scene tab.`), t.innerHTML = `<p class="notes">${q}</p>`;
      return;
    }
    let $ = "";
    try {
      $ = await z(za, {
        flags: {
          active: a,
          hideWindow: l,
          showPlayerWindow: c
        },
        states: {
          isActive: d,
          hideWindow: u,
          showPlayerWindow: m
        },
        labels: {
          activate: p,
          hideWindow: T,
          showPlayerWindow: b,
          triggerList: N,
          empty: q,
          add: B
        },
        hints: {
          activate: y,
          hideWindow: S,
          showPlayerWindow: v
        },
        triggers: w,
        hasTriggers: w.length > 0
      });
    } catch (H) {
      console.error(`${O} | Failed to render time trigger scene tab template`, H), t.innerHTML = `<p class="notes">${q}</p>`;
      return;
    }
    t.innerHTML = $, Ya(e, t, n);
  } finally {
    Ye();
  }
}
s(ki, "renderTimeTriggersTabContent");
function Ya(e, t, i) {
  const n = i ?? Fe(e);
  if (!pe(n)) return;
  const r = t.querySelector('[data-action="add-trigger"]');
  r && r.addEventListener("click", () => {
    E("Add trigger button clicked", { sceneId: n.id }), Jr(e, { scene: n });
  }), t.querySelectorAll('[data-action="edit-trigger"]').forEach((o) => {
    o.addEventListener("click", () => {
      const a = Number(o.dataset.index);
      if (!Number.isInteger(a)) return;
      const c = Ct(n)[a];
      c && (E("Edit trigger button clicked", { sceneId: n.id, triggerId: c.id, index: a }), Jr(e, { trigger: c, triggerIndex: a, scene: n }));
    });
  }), t.querySelectorAll('[data-action="delete-trigger"]').forEach((o) => {
    o.addEventListener("click", async () => {
      var d, u;
      const a = Number(o.dataset.index);
      if (!Number.isInteger(a)) return;
      const l = Ct(n), c = l[a];
      if (c) {
        l.splice(a, 1);
        try {
          E("Deleting trigger", {
            sceneId: n.id,
            index: a,
            triggerId: (c == null ? void 0 : c.id) ?? null
          }), await bo(n, l), await ki(e, t, n);
        } catch (m) {
          console.error(`${O} | Failed to delete time trigger`, m), (u = (d = ui.notifications) == null ? void 0 : d.error) == null || u.call(
            d,
            f(
              "EIDOLON.TimeTrigger.TriggerDeleteError",
              "Failed to remove the selected time trigger."
            )
          );
        }
      }
    });
  }), t.querySelectorAll('[data-action="fire-trigger"]').forEach((o) => {
    o.addEventListener("click", async () => {
      var d, u, m, h, p, y, T;
      const a = Number(o.dataset.index);
      if (!Number.isInteger(a)) return;
      const c = Ct(n)[a];
      if (c) {
        if (!((d = game.user) != null && d.isGM)) {
          (m = (u = ui.notifications) == null ? void 0 : u.warn) == null || m.call(
            u,
            f("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time.")
          );
          return;
        }
        try {
          E("Manually firing trigger", { sceneId: n.id, triggerId: c.id, index: a }), await Eo(n, c), (p = (h = ui.notifications) == null ? void 0 : h.info) == null || p.call(
            h,
            f(
              "EIDOLON.TimeTrigger.TriggerNowSuccess",
              "Triggered the selected time trigger."
            )
          );
        } catch (S) {
          console.error(`${O} | Failed to execute time trigger manually`, S), (T = (y = ui.notifications) == null ? void 0 : y.error) == null || T.call(
            y,
            f(
              "EIDOLON.TimeTrigger.TriggerNowError",
              "Failed to execute the selected time trigger."
            )
          ), E("Manual trigger execution failed", {
            sceneId: n.id,
            triggerId: c.id,
            index: a,
            message: (S == null ? void 0 : S.message) ?? String(S)
          });
        }
      }
    });
  });
}
s(Ya, "bindTimeTriggerTabEvents");
function Jr(e, t = {}) {
  var a;
  const i = t.scene ?? null, n = i && pe(i) ? i : Fe(e);
  if (!pe(n)) {
    console.warn(`${O} | Unable to open trigger form because no scene document is available.`);
    return;
  }
  E("Opening trigger form", {
    sceneId: n.id,
    triggerId: ((a = t.trigger) == null ? void 0 : a.id) ?? null,
    index: Number.isInteger(t.triggerIndex) ? Number(t.triggerIndex) : null
  }), Ga({
    scene: n,
    trigger: t.trigger ?? null,
    triggerIndex: t.triggerIndex ?? null,
    onSave: /* @__PURE__ */ s(() => {
      var c, d;
      const l = (d = (c = e.element) == null ? void 0 : c[0]) == null ? void 0 : d.querySelector('.tab[data-tab="time-triggers"]');
      l && ki(e, l, n);
    }, "onSave")
  }).render({ force: !0 });
}
s(Jr, "openTriggerForm");
function Qa(e, t) {
  var o, a, l, c, d;
  if (!e) return !1;
  const i = ((a = (o = foundry == null ? void 0 : foundry.applications) == null ? void 0 : o.sheets) == null ? void 0 : a.SceneConfig) ?? (globalThis == null ? void 0 : globalThis.SceneConfig);
  if (i && e instanceof i) return !0;
  const n = (l = e == null ? void 0 : e.constructor) == null ? void 0 : l.name;
  if (typeof n == "string" && n.includes("SceneConfig")) return !0;
  if (t) {
    const u = globalThis == null ? void 0 : globalThis.Scene;
    if (u && t instanceof u || (t == null ? void 0 : t.documentName) === "Scene" || (t == null ? void 0 : t.documentName) === "scenes" || (t == null ? void 0 : t.collection) === "scenes") return !0;
  }
  const r = ((c = e == null ? void 0 : e.options) == null ? void 0 : c.baseApplication) ?? ((d = e == null ? void 0 : e.options) == null ? void 0 : d.id);
  return !!(typeof r == "string" && r.includes("SceneConfig"));
}
s(Qa, "isRecognizedSceneConfig");
const pi = new Xn(), Yr = new Zn();
function Xa() {
  E("Registering time trigger hooks"), Hooks.once("init", () => {
    La(), Ia(), E("Time trigger settings registered during init");
  }), Ka(), E("Scene config hook registered"), Yr.registerHooks(), E("Time automation hooks registered"), Hooks.once("ready", () => {
    Ma(), E("Ready hook fired"), pi.onReady(), Yr.initialize();
  }), Hooks.on("canvasReady", (e) => {
    var t;
    E("canvasReady hook received", { scene: ((t = e == null ? void 0 : e.scene) == null ? void 0 : t.id) ?? null }), pi.onCanvasReady(e);
  }), Hooks.on("updateScene", (e) => {
    E("updateScene hook received", { scene: (e == null ? void 0 : e.id) ?? null }), pi.onUpdateScene(e);
  }), Hooks.on("updateWorldTime", (e, t) => {
    E("updateWorldTime hook received", { worldTime: e, diff: t }), pi.onUpdateWorldTime(e, t);
  });
}
s(Xa, "registerTimeTriggerHooks");
Xa();
const ce = O, Uo = "criteria", Vo = "state", Za = "criteriaVersion", es = 1, jo = "showSceneCriteriaTab";
let Qr = !1;
function ts() {
  var e;
  if (!Qr) {
    if (Qr = !0, !((e = game == null ? void 0 : game.settings) != null && e.register)) {
      console.warn(`${ce} | game.settings.register unavailable; scene criteria setting skipped.`);
      return;
    }
    game.settings.register(ce, jo, {
      name: f("EIDOLON.SceneCriteria.ShowTabSettingName", "Show Scene Criteria Tab"),
      hint: f(
        "EIDOLON.SceneCriteria.ShowTabSettingHint",
        "Enable the Scene Config > Criteria tab for scene criteria authoring."
      ),
      scope: "world",
      config: !0,
      type: Boolean,
      default: !1,
      onChange: /* @__PURE__ */ s(() => {
        is();
      }, "onChange")
    });
  }
}
s(ts, "registerSceneCriteriaSettings");
function Go() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get)
      return !!game.settings.get(ce, jo);
  } catch (t) {
    console.error(`${ce} | Failed to read Scene Criteria tab setting`, t);
  }
  return !1;
}
s(Go, "getShowSceneCriteriaTabSetting");
function is() {
  var o, a, l, c, d;
  const e = f("EIDOLON.SceneCriteria.ReloadPromptTitle", "Reload Required"), t = `<p>${f(
    "EIDOLON.SceneCriteria.ReloadPromptBody",
    "Changes to the Scene Criteria tab visibility require a reload. Reload now?"
  )}</p>`, i = typeof ((o = foundry == null ? void 0 : foundry.utils) == null ? void 0 : o.debouncedReload) == "function", n = /* @__PURE__ */ s(() => {
    i ? foundry.utils.debouncedReload() : window.location.reload();
  }, "reload"), r = (l = (a = foundry == null ? void 0 : foundry.applications) == null ? void 0 : a.api) == null ? void 0 : l.DialogV2;
  if (typeof (r == null ? void 0 : r.confirm) == "function") {
    r.confirm({
      window: { title: e },
      content: t
    }).then((u) => {
      u && n();
    });
    return;
  }
  if (typeof (Dialog == null ? void 0 : Dialog.confirm) == "function") {
    Dialog.confirm({
      title: e,
      content: t,
      yes: /* @__PURE__ */ s(() => n(), "yes"),
      no: /* @__PURE__ */ s(() => {
      }, "no")
    });
    return;
  }
  (d = (c = ui.notifications) == null ? void 0 : c.info) == null || d.call(
    c,
    f(
      "EIDOLON.SceneCriteria.ReloadNotice",
      "Please reload the world to apply Scene Criteria tab visibility changes."
    )
  );
}
s(is, "promptReloadForSceneCriteriaTab");
const qi = "Standard";
function Dt(e) {
  var i;
  const t = (i = e == null ? void 0 : e.getFlag) == null ? void 0 : i.call(e, ce, Uo);
  return t ? Jo(t) : [];
}
s(Dt, "getSceneCriteria");
async function zo(e, t) {
  if (!(e != null && e.setFlag)) return;
  const i = Jo(t);
  await e.setFlag(ce, Uo, i), await e.setFlag(ce, Za, es);
  const n = Wo(e, i);
  await e.setFlag(ce, Vo, n);
}
s(zo, "setSceneCriteria");
function Wo(e, t = null) {
  var r;
  const i = Array.isArray(t) ? t : Dt(e), n = Ue(((r = e == null ? void 0 : e.getFlag) == null ? void 0 : r.call(e, ce, Vo)) ?? {});
  return ns(n, i);
}
s(Wo, "getSceneCriteriaState");
function Ko(e = "") {
  const t = typeof e == "string" ? e.trim() : "", i = Yo(cr(t || "criterion"), /* @__PURE__ */ new Set());
  return {
    id: Qo(),
    key: i,
    label: t,
    values: [qi],
    default: qi,
    order: 0
  };
}
s(Ko, "createSceneCriterion");
function Jo(e) {
  const t = Array.isArray(e) ? Ue(e) : [], i = [], n = /* @__PURE__ */ new Set();
  return t.forEach((r, o) => {
    const a = lr(r, o, n);
    a && (i.push(a), n.add(a.key));
  }), i;
}
s(Jo, "sanitizeCriteria");
function lr(e, t = 0, i = /* @__PURE__ */ new Set()) {
  if (!e || typeof e != "object") return null;
  const n = typeof e.id == "string" && e.id.trim() ? e.id.trim() : Qo(), o = (typeof e.label == "string" ? e.label : typeof e.name == "string" ? e.name : "").trim(), a = typeof e.key == "string" && e.key.trim() ? cr(e.key) : cr(o || `criterion-${Number(t) + 1}`), l = Yo(a, i), c = os(e.values);
  let d = typeof e.default == "string" ? e.default.trim() : "";
  d || (d = c[0] ?? qi), c.includes(d) || c.unshift(d);
  const u = Number.isFinite(e.order) ? Number(e.order) : Number(t);
  return {
    id: n,
    key: l,
    label: o,
    values: c,
    default: d,
    order: u
  };
}
s(lr, "sanitizeCriterion");
function ns(e, t = []) {
  const i = e && typeof e == "object" ? Ue(e) : {}, n = {};
  for (const r of t) {
    const o = i == null ? void 0 : i[r.key], a = typeof o == "string" ? o.trim() : "";
    a && r.values.includes(a) ? n[r.key] = a : n[r.key] = r.default;
  }
  return n;
}
s(ns, "sanitizeSceneCriteriaState");
function rs(e) {
  return Dt(e).map((i) => ({
    id: i.id,
    name: i.label,
    values: [...i.values]
  }));
}
s(rs, "getSceneCriteriaCategories");
function os(e) {
  const t = Array.isArray(e) ? e : [], i = [];
  for (const n of t) {
    if (typeof n != "string") continue;
    const r = n.trim();
    !r || i.includes(r) || i.push(r);
  }
  return i.length || i.push(qi), i;
}
s(os, "sanitizeCriterionValues");
function cr(e) {
  return String(e ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
s(cr, "slugifyCriterionKey");
function Yo(e, t) {
  if (!t.has(e)) return e;
  let i = 2;
  for (; t.has(`${e}-${i}`); )
    i += 1;
  return `${e}-${i}`;
}
s(Yo, "ensureUniqueCriterionKey");
function Qo() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 11);
}
s(Qo, "generateCriterionId");
function Xo(e) {
  var t, i;
  console.error(`${ce} | Failed to persist scene criteria`, e), (i = (t = ui.notifications) == null ? void 0 : t.error) == null || i.call(
    t,
    f(
      "EIDOLON.SceneCriteria.PersistError",
      "Failed to persist the scene criteria."
    )
  );
}
s(Xo, "notifyPersistError");
var uo, oe, Be, fe, Zo, dn, fn, gn, mn, wi, hn, Jt, Yt, Bt, ea;
const Pe = class Pe extends Tn(yn) {
  constructor(i = {}) {
    const { scene: n, criterion: r, isNew: o, onSave: a, ...l } = i ?? {};
    super(l);
    I(this, fe);
    I(this, oe, null);
    I(this, Be, !1);
    I(this, dn, /* @__PURE__ */ s(async (i) => {
      i.preventDefault();
      const n = i.currentTarget;
      if (!(n instanceof HTMLFormElement)) return;
      const r = new FormData(n), o = String(r.get("criterionLabel") ?? "").trim(), a = String(r.get("criterionKey") ?? "").trim(), l = Array.from(n.querySelectorAll('[name="criterionValues"]')).map((m) => m instanceof HTMLInputElement ? m.value.trim() : "").filter((m, h, p) => m && p.indexOf(m) === h), d = String(r.get("criterionDefault") ?? "").trim() || l[0] || "Standard", u = lr(
        {
          id: g(this, oe).id,
          key: a,
          label: o,
          values: l,
          default: d,
          order: Number(g(this, oe).order ?? 0)
        },
        0,
        /* @__PURE__ */ new Set()
      );
      u && (A(this, oe, u), await C(this, fe, ea).call(this), this.close());
    }, "#onSubmit"));
    I(this, fn, /* @__PURE__ */ s((i) => {
      var a;
      if (g(this, Be)) return;
      const n = i.currentTarget, r = (n == null ? void 0 : n.form) ?? ((a = this.element) == null ? void 0 : a.querySelector("form"));
      if (!(r instanceof HTMLFormElement)) return;
      const o = r.querySelector('input[name="criterionKey"]');
      o instanceof HTMLInputElement && (o.value = kt(n.value));
    }, "#onLabelInput"));
    I(this, gn, /* @__PURE__ */ s((i) => {
      var c;
      const n = i.currentTarget, r = (n == null ? void 0 : n.form) ?? ((c = this.element) == null ? void 0 : c.querySelector("form"));
      if (!(r instanceof HTMLFormElement) || !(n instanceof HTMLInputElement)) return;
      const o = r.querySelector('input[name="criterionLabel"]'), a = kt(o instanceof HTMLInputElement ? o.value : ""), l = kt(n.value);
      A(this, Be, l !== a), n.value = l, C(this, fe, wi).call(this, r);
    }, "#onKeyInput"));
    I(this, mn, /* @__PURE__ */ s((i) => {
      var a, l;
      i.preventDefault();
      const n = ((a = i.currentTarget) == null ? void 0 : a.form) ?? ((l = this.element) == null ? void 0 : l.querySelector("form"));
      if (!(n instanceof HTMLFormElement)) return;
      const r = n.querySelector('input[name="criterionLabel"]'), o = n.querySelector('input[name="criterionKey"]');
      o instanceof HTMLInputElement && (o.value = kt(r instanceof HTMLInputElement ? r.value : ""), A(this, Be, !1), C(this, fe, wi).call(this, n));
    }, "#onResetAutoKey"));
    I(this, hn, /* @__PURE__ */ s((i) => {
      var c, d, u, m, h, p;
      i.preventDefault();
      const n = ((c = i.currentTarget) == null ? void 0 : c.form) ?? ((d = this.element) == null ? void 0 : d.querySelector("form"));
      if (!(n instanceof HTMLFormElement)) return;
      const r = n.querySelector(".scene-criterion-editor__values");
      if (!(r instanceof HTMLElement)) return;
      (u = r.querySelector(".scene-criterion-editor__empty")) == null || u.remove();
      const o = document.createElement("div");
      o.classList.add("scene-criterion-editor__value");
      const a = Ri(f("EIDOLON.SceneCriteria.ValuePlaceholder", "Allowed value")), l = Ri(f("EIDOLON.SceneCriteria.RemoveValue", "Remove Value"));
      o.innerHTML = `
      <input type="text" name="criterionValues" value="" placeholder="${a}" class="form-control">
      <button type="button" class="icon" data-action="remove-value" aria-label="${l}" title="${l}">
        <i class="fa-solid fa-trash"></i>
      </button>
    `, r.appendChild(o), (m = o.querySelector('[data-action="remove-value"]')) == null || m.addEventListener("click", g(this, Jt)), (h = o.querySelector('input[name="criterionValues"]')) == null || h.addEventListener("input", g(this, Yt)), C(this, fe, Bt).call(this, n), (p = o.querySelector('input[name="criterionValues"]')) == null || p.focus();
    }, "#onAddValue"));
    I(this, Jt, /* @__PURE__ */ s((i) => {
      var o, a, l, c;
      i.preventDefault(), (a = (o = i.currentTarget) == null ? void 0 : o.closest(".scene-criterion-editor__value")) == null || a.remove();
      const n = ((l = i.currentTarget) == null ? void 0 : l.form) ?? ((c = this.element) == null ? void 0 : c.querySelector("form"));
      if (!(n instanceof HTMLFormElement)) return;
      const r = n.querySelector(".scene-criterion-editor__values");
      if (r instanceof HTMLElement) {
        if (!r.querySelector(".scene-criterion-editor__value")) {
          const d = document.createElement("p");
          d.classList.add("notes", "scene-criterion-editor__empty"), d.textContent = f(
            "EIDOLON.SceneCriteria.ValueListEmpty",
            "No values have been added to this criterion."
          ), r.appendChild(d);
        }
        C(this, fe, Bt).call(this, n);
      }
    }, "#onRemoveValue"));
    I(this, Yt, /* @__PURE__ */ s((i) => {
      var r, o;
      const n = ((r = i.currentTarget) == null ? void 0 : r.form) ?? ((o = this.element) == null ? void 0 : o.querySelector("form"));
      n instanceof HTMLFormElement && C(this, fe, Bt).call(this, n);
    }, "#onValuesChanged"));
    this.scene = n ?? null, this.criterion = r ?? null, this.onSave = typeof a == "function" ? a : null, this.isNew = !!o, A(this, oe, C(this, fe, Zo).call(this)), A(this, Be, g(this, oe).key !== kt(g(this, oe).label));
  }
  async _prepareContext() {
    var n, r, o, a;
    const i = Array.isArray((n = g(this, oe)) == null ? void 0 : n.values) ? g(this, oe).values : [];
    return {
      isNew: this.isNew,
      key: ((r = g(this, oe)) == null ? void 0 : r.key) ?? "",
      label: ((o = g(this, oe)) == null ? void 0 : o.label) ?? "",
      defaultValue: ((a = g(this, oe)) == null ? void 0 : a.default) ?? "",
      values: i.map((l, c) => {
        var d;
        return {
          index: c,
          value: l,
          selected: l === ((d = g(this, oe)) == null ? void 0 : d.default)
        };
      }),
      hasValues: i.length > 0,
      labels: {
        label: f("EIDOLON.SceneCriteria.CategoryNameLabel", "Criterion Label"),
        key: f("EIDOLON.SceneCriteria.CriteriaKey", "Key"),
        values: f("EIDOLON.SceneCriteria.ValuesLabel", "Allowed Values"),
        default: f("EIDOLON.SceneCriteria.DefaultValue", "Default Value"),
        empty: f(
          "EIDOLON.SceneCriteria.ValueListEmpty",
          "No values have been added to this criterion."
        ),
        addValue: f("EIDOLON.SceneCriteria.AddValue", "Add Value"),
        removeValue: f("EIDOLON.SceneCriteria.RemoveValue", "Remove Value"),
        valuePlaceholder: f("EIDOLON.SceneCriteria.ValuePlaceholder", "Allowed value"),
        resetAutoKey: f("EIDOLON.SceneCriteria.ResetAutoKey", "Reset to Auto"),
        save: this.isNew ? f("EIDOLON.SceneCriteria.CreateCategory", "Add Criterion") : f("EIDOLON.SceneCriteria.SaveCategory", "Save Criterion"),
        cancel: f("EIDOLON.SceneCriteria.CancelEdit", "Cancel")
      },
      keyIsCustom: g(this, Be)
    };
  }
  _onRender(i, n) {
    var o, a, l, c, d, u;
    super._onRender(i, n);
    const r = (o = this.element) == null ? void 0 : o.querySelector("form");
    r && (r.addEventListener("submit", g(this, dn)), (a = r.querySelector('[data-action="add-value"]')) == null || a.addEventListener("click", g(this, hn)), (l = r.querySelector('input[name="criterionLabel"]')) == null || l.addEventListener("input", g(this, fn)), (c = r.querySelector('input[name="criterionKey"]')) == null || c.addEventListener("input", g(this, gn)), (d = r.querySelector('[data-action="reset-auto-key"]')) == null || d.addEventListener("click", g(this, mn)), r.querySelectorAll('[data-action="remove-value"]').forEach((m) => {
      m.addEventListener("click", g(this, Jt));
    }), r.querySelectorAll('input[name="criterionValues"]').forEach((m) => {
      m.addEventListener("input", g(this, Yt));
    }), (u = r.querySelector('[data-action="cancel"]')) == null || u.addEventListener("click", (m) => {
      m.preventDefault(), this.close();
    }), C(this, fe, wi).call(this, r), C(this, fe, Bt).call(this, r));
  }
};
oe = new WeakMap(), Be = new WeakMap(), fe = new WeakSet(), Zo = /* @__PURE__ */ s(function() {
  const i = lr(this.criterion, 0, /* @__PURE__ */ new Set()) ?? Ko(f("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion"));
  return {
    id: i.id,
    key: i.key,
    label: i.label ?? "",
    values: Array.isArray(i.values) ? [...i.values] : [],
    default: i.default
  };
}, "#initializeState"), dn = new WeakMap(), fn = new WeakMap(), gn = new WeakMap(), mn = new WeakMap(), wi = /* @__PURE__ */ s(function(i) {
  const n = i.querySelector('[data-action="reset-auto-key"]');
  n instanceof HTMLButtonElement && (n.disabled = !g(this, Be));
}, "#syncAutoKeyButton"), hn = new WeakMap(), Jt = new WeakMap(), Yt = new WeakMap(), Bt = /* @__PURE__ */ s(function(i) {
  var c, d;
  const n = i.querySelector('select[name="criterionDefault"]');
  if (!(n instanceof HTMLSelectElement)) return;
  const r = ((d = (c = n.value) == null ? void 0 : c.trim) == null ? void 0 : d.call(c)) ?? "", o = Array.from(i.querySelectorAll('input[name="criterionValues"]')).map((u) => u instanceof HTMLInputElement ? u.value.trim() : "").filter((u, m, h) => u && h.indexOf(u) === m), a = n.dataset.emptyLabel || f("EIDOLON.SceneCriteria.ValueListEmpty", "No values have been added to this criterion.");
  if (n.innerHTML = "", !o.length) {
    const u = document.createElement("option");
    u.value = "", u.textContent = a, u.selected = !0, n.appendChild(u);
    return;
  }
  const l = o.includes(r) ? r : o[0];
  for (const u of o) {
    const m = document.createElement("option");
    m.value = u, m.textContent = u, m.selected = u === l, n.appendChild(m);
  }
}, "#syncDefaultOptions"), ea = /* @__PURE__ */ s(async function() {
  if (!this.scene) return;
  const i = Dt(this.scene).sort((r, o) => r.order - o.order), n = i.findIndex((r) => r.id === g(this, oe).id);
  n < 0 ? (g(this, oe).order = i.length, i.push(g(this, oe))) : (g(this, oe).order = i[n].order, i.splice(n, 1, g(this, oe)));
  try {
    await zo(this.scene, i), this.onSave && await this.onSave(g(this, oe));
  } catch (r) {
    Xo(r);
  }
}, "#persist"), s(Pe, "CategoryEditorApplication"), Ze(Pe, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  yt(Pe, Pe, "DEFAULT_OPTIONS"),
  {
    id: `${ce}-criterion-editor`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((uo = yt(Pe, Pe, "DEFAULT_OPTIONS")) == null ? void 0 : uo.classes) ?? [], "standard-form", "themed"])
    ),
    window: {
      title: f("EIDOLON.SceneCriteria.EditCategory", "Edit Criterion"),
      resizable: !1
    },
    position: {
      width: 460,
      height: "auto"
    }
  },
  { inplace: !1 }
)), Ze(Pe, "PARTS", {
  content: {
    template: `modules/${ce}/templates/scene-criteria-editor.html`
  }
});
let ur = Pe;
function kt(e) {
  return String(e ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
s(kt, "slugifyKey");
const as = `modules/${ce}/templates/scene-criteria-tab.html`, dr = {
  log: /* @__PURE__ */ s((...e) => {
    var t;
    return (t = console.debug) == null ? void 0 : t.call(console, `${ce} | Criteria`, ...e);
  }, "log"),
  group: /* @__PURE__ */ s((...e) => {
    var t;
    return (t = console.groupCollapsed) == null ? void 0 : t.call(console, `${ce} | Criteria`, ...e);
  }, "group"),
  groupEnd: /* @__PURE__ */ s(() => {
    var e;
    return (e = console.groupEnd) == null ? void 0 : e.call(console);
  }, "groupEnd")
}, ss = Or(ur), ls = Bo({
  tabId: "criteria",
  tabLabel: /* @__PURE__ */ s(() => f("EIDOLON.SceneCriteria.TabLabel", "Criteria"), "tabLabel"),
  getScene: Fe,
  isApplicable: /* @__PURE__ */ s(() => Go(), "isApplicable"),
  renderContent: /* @__PURE__ */ s(({ app: e, tab: t, scene: i }) => us(e, t, i), "renderContent"),
  logger: dr
});
function cs() {
  return ls.register();
}
s(cs, "registerSceneCriteriaConfigHook");
function us(e, t, i) {
  if (!(t instanceof HTMLElement)) return;
  const n = pe(i) ? i : Fe(e);
  bt(e, t, n);
}
s(us, "renderCriteriaTab");
async function bt(e, t, i) {
  var r, o;
  const n = i ?? Fe(e);
  dr.group("renderCriteriaTabContent", { sceneId: (n == null ? void 0 : n.id) ?? null });
  try {
    if (!pe(n)) {
      const u = f(
        "EIDOLON.SceneCriteria.Unavailable",
        "Scene criteria are unavailable for this configuration sheet."
      );
      t.innerHTML = `<p class="notes">${u}</p>`;
      return;
    }
    const a = Dt(n).sort((u, m) => u.order - m.order), l = Wo(n, a), c = ((o = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : o.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof c != "function") {
      t.innerHTML = `<p class="notes">${f("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
      return;
    }
    const d = await c(as, {
      description: f(
        "EIDOLON.SceneCriteria.Description",
        "Define scene criteria dimensions and allowed values used by matching rules."
      ),
      labels: {
        list: f("EIDOLON.SceneCriteria.CategoryListLabel", "Scene Criteria"),
        empty: f(
          "EIDOLON.SceneCriteria.CategoryListEmpty",
          "No criteria configured for this scene."
        ),
        add: f("EIDOLON.SceneCriteria.AddCategory", "Add Criterion"),
        edit: f("EIDOLON.SceneCriteria.EditCategory", "Edit Criterion"),
        remove: f("EIDOLON.SceneCriteria.RemoveCategory", "Remove Criterion"),
        moveUp: f("EIDOLON.SceneCriteria.MoveUp", "Move Up"),
        moveDown: f("EIDOLON.SceneCriteria.MoveDown", "Move Down"),
        values: f("EIDOLON.SceneCriteria.ValuesLabel", "Allowed Values"),
        unnamed: f("EIDOLON.SceneCriteria.UnnamedCategory", "Unnamed Criterion")
      },
      summary: {
        criteriaCount: a.length,
        valueCount: a.reduce((u, m) => u + m.values.length, 0)
      },
      criteria: a.map((u, m) => {
        var h, p;
        return {
          id: u.id,
          label: u.label,
          displayName: ((p = (h = u.label) == null ? void 0 : h.trim) == null ? void 0 : p.call(h)) || f("EIDOLON.SceneCriteria.UnnamedCategory", "Unnamed Criterion"),
          hasValues: u.values.length > 0,
          values: u.values.map((y) => ({
            value: y,
            isCurrent: (l[u.key] ?? u.default) === y
          })),
          valueCountLabel: fs(u.values.length),
          canMoveUp: m > 0,
          canMoveDown: m < a.length - 1
        };
      }),
      hasCriteria: a.length > 0
    });
    t.innerHTML = d, ds(e, t, n);
  } catch (a) {
    console.error(`${ce} | Failed to render criteria tab`, a), t.innerHTML = `<p class="notes">${f("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
  } finally {
    dr.groupEnd();
  }
}
s(bt, "renderCriteriaTabContent");
function ds(e, t, i) {
  const n = i ?? Fe(e);
  if (!pe(n)) return;
  const r = t.querySelector('[data-criteria-action="add"]');
  r && r.addEventListener("click", () => {
    Xr(e, {
      scene: n,
      criterion: Ko(
        f("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion")
      ),
      isNew: !0,
      onSave: /* @__PURE__ */ s(() => bt(e, t, n), "onSave")
    });
  }), t.querySelectorAll('[data-criteria-action="edit"]').forEach((o) => {
    const a = o.dataset.criterionId;
    a && o.addEventListener("click", () => {
      const l = Dt(n).find((c) => c.id === a);
      l && Xr(e, {
        scene: n,
        criterion: l,
        onSave: /* @__PURE__ */ s(() => bt(e, t, n), "onSave")
      });
    });
  }), t.querySelectorAll('[data-criteria-action="remove"]').forEach((o) => {
    const a = o.dataset.criterionId;
    a && o.addEventListener("click", async () => {
      await Nn(n, (c) => {
        const d = c.findIndex((u) => u.id === a);
        return d < 0 ? !1 : (c.splice(d, 1), Dn(c), !0);
      }) && await bt(e, t, n);
    });
  }), t.querySelectorAll('[data-criteria-action="move-up"]').forEach((o) => {
    const a = o.dataset.criterionId;
    a && o.addEventListener("click", async () => {
      await Nn(n, (c) => {
        const d = c.findIndex((m) => m.id === a);
        if (d <= 0) return !1;
        const [u] = c.splice(d, 1);
        return c.splice(d - 1, 0, u), Dn(c), !0;
      }) && await bt(e, t, n);
    });
  }), t.querySelectorAll('[data-criteria-action="move-down"]').forEach((o) => {
    const a = o.dataset.criterionId;
    a && o.addEventListener("click", async () => {
      await Nn(n, (c) => {
        const d = c.findIndex((m) => m.id === a);
        if (d < 0 || d >= c.length - 1) return !1;
        const [u] = c.splice(d, 1);
        return c.splice(d + 1, 0, u), Dn(c), !0;
      }) && await bt(e, t, n);
    });
  });
}
s(ds, "bindCriteriaTabEvents");
async function Nn(e, t) {
  const i = Dt(e).sort((r, o) => r.order - o.order);
  if (t(i) === !1) return !1;
  try {
    return await zo(e, i), !0;
  } catch (r) {
    return Xo(r), !1;
  }
}
s(Nn, "mutateCriteria");
function Xr(e, t = {}) {
  const i = t.scene ?? null, n = i && pe(i) ? i : Fe(e);
  if (!pe(n))
    return;
  ss({
    scene: n,
    criterion: t.criterion ?? null,
    isNew: !!t.isNew,
    onSave: typeof t.onSave == "function" ? t.onSave : null
  }).render({ force: !0 });
}
s(Xr, "openCriterionEditor");
function Dn(e) {
  e.forEach((t, i) => {
    t.order = i;
  });
}
s(Dn, "reindexCriteriaOrder");
function fs(e) {
  var t, i;
  if ((i = (t = game.i18n) == null ? void 0 : t.has) != null && i.call(t, "EIDOLON.SceneCriteria.ValueCountLabel"))
    try {
      return game.i18n.format("EIDOLON.SceneCriteria.ValueCountLabel", { count: e });
    } catch (n) {
      console.error(`${ce} | Failed to format value count label`, n);
    }
  return e === 0 ? "No values configured" : e === 1 ? "1 value" : `${e} values`;
}
s(fs, "formatValueCount");
let Zr = !1;
function gs() {
  Hooks.once("init", () => {
    ts();
  }), Hooks.once("ready", () => {
    Go() && (Zr || (cs(), Zr = !0));
  });
}
s(gs, "registerSceneCriteriaHooks");
gs();
const dt = O, St = "lightCriteria", wr = Object.freeze({
  base: null,
  mappings: [],
  current: null
});
function ta(e) {
  var i;
  const t = ((i = e == null ? void 0 : e.getFlag) == null ? void 0 : i.call(e, dt, St)) ?? wr;
  return ia(t);
}
s(ta, "getLightCriteriaState");
async function ms(e, t) {
  const i = ia(t);
  if (!(e != null && e.setFlag))
    return i;
  const n = i.base !== null, r = i.mappings.length > 0, o = i.current !== null;
  return !n && !r && !o ? (typeof e.unsetFlag == "function" ? await e.unsetFlag(dt, St) : await e.setFlag(dt, St, null), wr) : (await e.setFlag(dt, St, i), i);
}
s(ms, "setLightCriteriaState");
async function di(e, t) {
  if (typeof t != "function")
    throw new TypeError("updateLightCriteriaState requires an updater function.");
  const i = Ue(ta(e)), n = await t(i);
  return ms(e, n);
}
s(di, "updateLightCriteriaState");
async function eo(e, t) {
  const i = mt(t);
  if (!i)
    throw new Error("Invalid light configuration payload.");
  return di(e, (n) => ({
    ...n,
    base: i
  }));
}
s(eo, "storeBaseLighting");
async function to(e, t, i, { label: n } = {}) {
  const r = En(t);
  if (!r)
    throw new Error("Cannot create a mapping without at least one category selection.");
  const o = mt(i);
  if (!o)
    throw new Error("Invalid light configuration payload.");
  return di(e, (a) => {
    const l = fi(r), c = Array.isArray(a == null ? void 0 : a.mappings) ? [...a.mappings] : [], d = c.findIndex((p) => (p == null ? void 0 : p.key) === l), u = d >= 0 ? c[d] : null, m = typeof (u == null ? void 0 : u.id) == "string" && u.id.trim() ? u.id.trim() : ra(), h = vr({
      id: m,
      categories: r,
      config: o,
      label: typeof n == "string" ? n : (u == null ? void 0 : u.label) ?? null,
      updatedAt: Date.now()
    });
    if (!h)
      throw new Error("Failed to sanitize criteria mapping entry.");
    return d >= 0 ? c[d] = h : c.push(h), {
      ...a,
      mappings: c
    };
  });
}
s(to, "upsertLightCriteriaMapping");
async function hs(e, t, i, n, { replaceExisting: r = !1 } = {}) {
  const o = typeof t == "string" ? t.trim() : "";
  if (!o)
    throw new Error("A mapping id is required to retarget criteria.");
  const a = En(i);
  if (!a)
    throw new Error("Cannot retarget mapping without at least one category selection.");
  const l = mt(n);
  if (!l)
    throw new Error("Invalid light configuration payload.");
  return di(e, (c) => {
    const d = Array.isArray(c == null ? void 0 : c.mappings) ? [...c.mappings] : [], u = d.findIndex((b) => (b == null ? void 0 : b.id) === o);
    if (u < 0)
      throw new Error("The selected mapping no longer exists.");
    const m = fi(a), h = d.findIndex(
      (b, v) => v !== u && (b == null ? void 0 : b.key) === m
    );
    if (h >= 0 && !r)
      throw new Error("A mapping already exists for the selected criteria.");
    const p = d[u], y = vr({
      ...p,
      id: o,
      categories: a,
      config: l,
      updatedAt: Date.now()
    });
    if (!y)
      throw new Error("Failed to sanitize updated mapping.");
    d[u] = y;
    let T = null;
    if (h >= 0) {
      const [b] = d.splice(h, 1);
      T = (b == null ? void 0 : b.id) ?? null;
    }
    let S = (c == null ? void 0 : c.current) ?? null;
    return S && typeof S == "object" && (S.mappingId === o ? S = {
      ...S,
      mappingId: o,
      categories: a,
      updatedAt: Date.now()
    } : T && S.mappingId === T && (S = {
      ...S,
      mappingId: o,
      categories: a,
      updatedAt: Date.now()
    })), {
      ...c,
      mappings: d,
      current: S
    };
  });
}
s(hs, "retargetLightCriteriaMapping");
async function ps(e, t) {
  const i = typeof t == "string" ? t.trim() : "";
  if (!i)
    throw new Error("A mapping id is required to remove a mapping.");
  return di(e, (n) => {
    const r = Array.isArray(n == null ? void 0 : n.mappings) ? [...n.mappings] : [], o = r.findIndex((l) => (l == null ? void 0 : l.id) === i);
    if (o < 0) return n;
    r.splice(o, 1);
    let a = (n == null ? void 0 : n.current) ?? null;
    return (a == null ? void 0 : a.mappingId) === i && (a = null), {
      ...n,
      mappings: r,
      current: a
    };
  });
}
s(ps, "removeLightCriteriaMapping");
async function Vt(e, t) {
  const i = na(t);
  return di(e, (n) => ({
    ...n,
    current: i
  }));
}
s(Vt, "storeCurrentCriteriaSelection");
function ia(e) {
  var c;
  const t = Ue(e);
  if (!t || typeof t != "object")
    return Ue(wr);
  const i = mt(t.base), n = Array.isArray(t.mappings) ? t.mappings : [], r = /* @__PURE__ */ new Map();
  for (const d of n) {
    const u = vr(d);
    u && r.set(u.key, u);
  }
  const o = Array.from(r.values()), a = new Map(o.map((d) => [d.id, d]));
  let l = na(t.current);
  if (l) {
    const d = l.categories && Object.keys(l.categories).length > 0;
    if (l.mappingId && !a.has(l.mappingId)) {
      const u = d ? ((c = o.find((m) => m.key === fi(l.categories))) == null ? void 0 : c.id) ?? null : null;
      u ? l = {
        ...l,
        mappingId: u
      } : d && (l = {
        mappingId: null,
        categories: l.categories,
        updatedAt: l.updatedAt
      });
    }
  }
  return {
    base: i ?? null,
    mappings: o,
    current: l
  };
}
s(ia, "sanitizeLightCriteriaState");
function mt(e) {
  const t = Ue(e);
  if (!t || typeof t != "object") return null;
  "_id" in t && delete t._id, "id" in t && delete t.id;
  const i = t.flags;
  if (i && typeof i == "object") {
    const n = i[dt];
    n && typeof n == "object" && (delete n[St], Object.keys(n).length === 0 && delete i[dt]), Object.keys(i).length === 0 && delete t.flags;
  }
  return t;
}
s(mt, "sanitizeLightConfigPayload");
function vr(e) {
  if (!e || typeof e != "object") return null;
  const t = En(e.categories);
  if (!t) return null;
  const i = mt(e.config);
  if (!i) return null;
  const n = typeof e.id == "string" && e.id.trim() ? e.id.trim() : ra(), r = fi(t), o = {
    id: n,
    key: r,
    categories: t,
    config: i,
    updatedAt: Number.isFinite(e.updatedAt) ? Number(e.updatedAt) : Date.now()
  };
  return typeof e.label == "string" && e.label.trim() && (o.label = e.label.trim()), o;
}
s(vr, "sanitizeCriteriaMappingEntry");
function na(e) {
  if (!e || typeof e != "object") return null;
  const t = typeof e.mappingId == "string" && e.mappingId.trim() ? e.mappingId.trim() : null, i = En(e.categories);
  return !t && !i ? null : {
    mappingId: t,
    categories: i,
    updatedAt: Number.isFinite(e.updatedAt) ? Number(e.updatedAt) : Date.now()
  };
}
s(na, "sanitizeCurrentSelection");
function En(e) {
  const t = {};
  if (Array.isArray(e))
    for (const i of e) {
      const n = io((i == null ? void 0 : i.id) ?? (i == null ? void 0 : i.categoryId) ?? (i == null ? void 0 : i.category)), r = no((i == null ? void 0 : i.value) ?? (i == null ? void 0 : i.selection) ?? (i == null ? void 0 : i.label));
      !n || !r || (t[n] = r);
    }
  else if (e && typeof e == "object")
    for (const [i, n] of Object.entries(e)) {
      const r = io(i), o = no(n);
      !r || !o || (t[r] = o);
    }
  return Object.keys(t).length > 0 ? t : null;
}
s(En, "sanitizeCriteriaCategories");
function fi(e) {
  if (!e || typeof e != "object") return "";
  const t = Object.entries(e).filter(([, i]) => typeof i == "string" && i).map(([i, n]) => `${i}:${n}`);
  return t.sort((i, n) => i < n ? -1 : i > n ? 1 : 0), t.join("|");
}
s(fi, "computeCriteriaMappingKey");
function ra() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
s(ra, "generateLightMappingId");
function io(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  return t || null;
}
s(io, "normalizeCategoryId");
function no(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  return t || null;
}
s(no, "normalizeCategoryValue");
const vi = /* @__PURE__ */ new WeakMap(), yi = /* @__PURE__ */ new WeakMap(), ae = "__eidolon_default__";
function ys() {
  Hooks.on("renderAmbientLightConfig", Ts), E("LightCriteria | AmbientLightConfig controls registered");
}
s(ys, "registerAmbientLightCriteriaControls");
function Ts(e, t) {
  var i;
  Mt("LightCriteria | renderAmbientLightConfig", {
    appId: (e == null ? void 0 : e.id) ?? null,
    constructor: ((i = e == null ? void 0 : e.constructor) == null ? void 0 : i.name) ?? null,
    isRendered: (e == null ? void 0 : e.rendered) ?? !1
  });
  try {
    const n = At(t);
    if (!n) return;
    bs(e, n);
  } catch (n) {
    console.error("eidolon-utilities | Failed to enhance AmbientLightConfig UI", n);
  } finally {
    Ye();
  }
}
s(Ts, "handleAmbientLightConfigRender");
function bs(e, t) {
  var _t, He, Ft;
  const i = (e == null ? void 0 : e.form) instanceof HTMLFormElement ? e.form : t instanceof HTMLFormElement ? t : (_t = t == null ? void 0 : t.closest) == null ? void 0 : _t.call(t, "form");
  if (!(i instanceof HTMLFormElement)) return;
  const n = i.querySelector(".window-content");
  if (!(n instanceof HTMLElement)) return;
  const r = aa(e);
  if (!r) return;
  const o = ks(r);
  E("LightCriteria | Resolved ambient light", {
    sheetId: (r == null ? void 0 : r.id) ?? null,
    persistedId: (o == null ? void 0 : o.id) ?? null,
    sameRef: r === o
  });
  const a = (o == null ? void 0 : o.parent) ?? r.parent ?? null, l = a ? rs(a) : [], c = l.filter(
    (M) => Array.isArray(M == null ? void 0 : M.values) && M.values.length > 0
  ), d = Ds(l), u = ta(o ?? r);
  E("LightCriteria | Loaded mapping state", {
    hasBase: !!(u != null && u.base),
    mappingCount: Array.isArray(u == null ? void 0 : u.mappings) ? u.mappings.length : 0,
    mappings: Array.isArray(u == null ? void 0 : u.mappings) ? u.mappings.map((M) => {
      var k, G;
      return {
        id: M.id,
        key: M.key,
        hasColor: !!((G = (k = M.config) == null ? void 0 : k.config) != null && G.color)
      };
    }) : []
  });
  const m = n.querySelector(".eidolon-light-criteria");
  m && m.remove(), n.querySelectorAll(".eidolon-light-criteria-main-switcher").forEach((M) => M.remove());
  const h = document.createElement("fieldset");
  h.classList.add("eidolon-light-criteria");
  const p = document.createElement("legend");
  p.textContent = f("EIDOLON.LightCriteria.Legend", "Scene Criteria Lighting"), h.appendChild(p);
  const y = document.createElement("p");
  y.classList.add("notes"), y.textContent = f(
    "EIDOLON.LightCriteria.Description",
    "Capture a base lighting state, then map criteria values to lighting configurations."
  ), h.appendChild(y);
  const T = document.createElement("div");
  T.classList.add("eidolon-light-criteria__controls");
  const S = document.createElement("button");
  S.type = "button", S.dataset.action = "make-default", S.classList.add("eidolon-light-criteria__button"), S.textContent = f(
    "EIDOLON.LightCriteria.SetBase",
    "Set Base"
  ), T.appendChild(S);
  const b = document.createElement("button");
  b.type = "button", b.dataset.action = "create-mapping", b.classList.add("eidolon-light-criteria__button"), b.textContent = f(
    "EIDOLON.LightCriteria.CreateMapping",
    "Add Criteria Mapping"
  ), b.setAttribute("aria-expanded", "false"), T.appendChild(b), h.appendChild(T);
  const v = document.createElement("p");
  v.classList.add("notes", "eidolon-light-criteria__status"), h.appendChild(v);
  const N = document.createElement("div");
  N.classList.add("eidolon-light-criteria__switcher");
  const q = document.createElement("label");
  q.classList.add("eidolon-light-criteria__switcher-label");
  const B = `${(e == null ? void 0 : e.id) ?? (r == null ? void 0 : r.id) ?? "eidolon-light"}-mapping-select`;
  q.htmlFor = B, q.textContent = f("EIDOLON.LightCriteria.SelectLabel", "Criteria Mapping"), N.appendChild(q);
  const U = document.createElement("div");
  U.classList.add("eidolon-light-criteria__switcher-controls"), N.appendChild(U);
  const R = document.createElement("select");
  R.id = B, R.classList.add("eidolon-light-criteria__select"), R.dataset.action = "select-mapping", U.appendChild(R);
  const Z = document.createElement("div");
  Z.classList.add("eidolon-light-criteria__action-stack"), U.appendChild(Z);
  const Y = document.createElement("button");
  Y.type = "button", Y.dataset.action = "apply-selected-mapping", Y.classList.add("eidolon-light-criteria__button", "secondary", "icon-only"), Y.dataset.tooltip = f("EIDOLON.LightCriteria.ApplyButton", "Apply"), Y.setAttribute("aria-label", f("EIDOLON.LightCriteria.ApplyButton", "Apply")), Y.innerHTML = '<i class="fa-solid fa-play" inert=""></i>', Z.appendChild(Y);
  const F = document.createElement("button");
  F.type = "button", F.dataset.action = "update-selected-mapping", F.classList.add("eidolon-light-criteria__button", "secondary", "icon-only"), F.dataset.tooltip = f("EIDOLON.LightCriteria.UpdateButton", "Save Changes"), F.setAttribute(
    "aria-label",
    f("EIDOLON.LightCriteria.UpdateButton", "Save Changes")
  ), F.innerHTML = '<i class="fa-solid fa-floppy-disk" inert=""></i>', Z.appendChild(F);
  const V = document.createElement("button");
  V.type = "button", V.dataset.action = "edit-selected-mapping-criteria", V.classList.add("eidolon-light-criteria__button", "secondary", "icon-only"), V.dataset.tooltip = f("EIDOLON.LightCriteria.EditCriteriaButton", "Edit Criteria"), V.setAttribute(
    "aria-label",
    f("EIDOLON.LightCriteria.EditCriteriaButton", "Edit Criteria")
  ), V.innerHTML = '<i class="fa-solid fa-sliders" inert=""></i>', Z.appendChild(V);
  const w = document.createElement("button");
  w.type = "button", w.dataset.action = "remove-selected-mapping", w.classList.add("eidolon-light-criteria__button", "secondary", "icon-only", "danger"), w.dataset.tooltip = f("EIDOLON.LightCriteria.RemoveMapping", "Remove Mapping"), w.setAttribute(
    "aria-label",
    f("EIDOLON.LightCriteria.RemoveMapping", "Remove Mapping")
  ), w.innerHTML = '<i class="fa-solid fa-trash" inert=""></i>', Z.appendChild(w);
  const z = document.createElement("div");
  z.classList.add("eidolon-light-criteria-main-switcher"), z.appendChild(N);
  const $ = document.createElement("p");
  if ($.classList.add("notes", "eidolon-light-criteria-main-switcher__empty"), $.textContent = f(
    "EIDOLON.LightCriteria.ActiveRequiresBase",
    "Set Base Lighting to enable mapping selection and actions."
  ), z.appendChild($), l.length === 0) {
    const M = document.createElement("p");
    M.classList.add("notification", "warning", "eidolon-light-criteria__warning"), M.textContent = f(
      "EIDOLON.LightCriteria.NoCategoriesWarning",
      "This scene has no criteria configured. Add criteria under Scene -> Criteria to enable criteria-driven lighting."
    ), h.appendChild(M);
  } else if (c.length === 0) {
    const M = document.createElement("p");
    M.classList.add("notification", "warning", "eidolon-light-criteria__warning"), M.textContent = f(
      "EIDOLON.LightCriteria.NoValuesWarning",
      "Criteria exist, but none define selectable values. Add values in Scene -> Criteria."
    ), h.appendChild(M);
  }
  const H = document.createElement("div");
  H.classList.add("eidolon-light-criteria__creation"), H.dataset.section = "creation", H.hidden = !0;
  const _ = document.createElement("p");
  _.classList.add("notes"), _.textContent = f(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ), H.appendChild(_);
  const P = document.createElement("div");
  P.classList.add("eidolon-light-criteria__category-list"), H.appendChild(P);
  for (const M of c) {
    const k = document.createElement("label");
    k.classList.add("eidolon-light-criteria__category");
    const G = document.createElement("span");
    G.classList.add("eidolon-light-criteria__category-name"), G.textContent = (Ft = (He = M.name) == null ? void 0 : He.trim) != null && Ft.call(He) ? M.name.trim() : f("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), k.appendChild(G);
    const J = document.createElement("select");
    J.dataset.categoryId = M.id, J.classList.add("eidolon-light-criteria__category-select");
    const X = document.createElement("option");
    X.value = "", X.textContent = f(
      "EIDOLON.LightCriteria.IgnoreCategory",
      "Ignore"
    ), J.appendChild(X);
    for (const ee of M.values) {
      const ne = document.createElement("option");
      ne.value = ee, ne.textContent = ee, J.appendChild(ne);
    }
    k.appendChild(J), P.appendChild(k);
  }
  const W = document.createElement("div");
  W.classList.add("eidolon-light-criteria__creation-actions");
  const te = document.createElement("button");
  te.type = "button", te.dataset.action = "save-mapping", te.classList.add("eidolon-light-criteria__button", "primary"), te.textContent = f(
    "EIDOLON.LightCriteria.SaveMapping",
    "Save Mapping"
  ), W.appendChild(te);
  const j = document.createElement("button");
  j.type = "button", j.dataset.action = "cancel-create", j.classList.add("eidolon-light-criteria__button", "secondary"), j.textContent = f(
    "EIDOLON.LightCriteria.Cancel",
    "Cancel"
  ), W.appendChild(j), H.appendChild(W), h.appendChild(H), n.prepend(z), n.appendChild(h), h.hidden = !0, Cs(e, {
    fieldset: h,
    homeContainer: n
  }), requestAnimationFrame(() => {
    var M;
    (M = e.setPosition) == null || M.call(e, { height: "auto" });
  });
  let L = u;
  tt({ switcher: N, emptyState: $, state: L }), et(v, L), qt(b, {
    state: L,
    hasCategories: c.length > 0
  }), E("LightCriteria | Controls injected", {
    sceneId: (a == null ? void 0 : a.id) ?? null,
    lightId: (r == null ? void 0 : r.id) ?? null,
    hasBase: !!(L != null && L.base),
    mappingCount: Array.isArray(L == null ? void 0 : L.mappings) ? L.mappings.length : 0,
    categories: c.length
  });
  const kr = Rs(L), x = {
    restoreConfig: null,
    app: e,
    selectedMapping: kr,
    editorMode: "create",
    editingMappingId: null
  };
  vi.set(h, x), R.addEventListener("change", () => {
    x.selectedMapping = R.value ?? "", Ae({
      mappingSelect: R,
      applyMappingButton: Y,
      updateMappingButton: F,
      editCriteriaButton: V,
      removeMappingButton: w,
      state: L
    }), $s(
      o ?? r,
      L,
      x.selectedMapping
    ).then((M) => {
      M && (L = M);
    });
  });
  const Rt = /* @__PURE__ */ s(async () => {
    var J, X, ee, ne, ue, Le, de, Ce, ie, Se, re, ye, Me, Ht;
    const M = R.value ?? "";
    if (!M) {
      (X = (J = ui.notifications) == null ? void 0 : J.warn) == null || X.call(
        J,
        f(
          "EIDOLON.LightCriteria.SelectMappingWarning",
          "Choose a criteria mapping before applying."
        )
      ), Ae({
        mappingSelect: R,
        applyMappingButton: Y,
        updateMappingButton: F,
        editCriteriaButton: V,
        removeMappingButton: w,
        state: L
      });
      return;
    }
    if (M === ae) {
      if (!(L != null && L.base)) {
        (ne = (ee = ui.notifications) == null ? void 0 : ee.warn) == null || ne.call(
          ee,
          f(
            "EIDOLON.LightCriteria.BaseUnavailable",
            "Set a base lighting state before applying it."
          )
        );
        return;
      }
      Ti(h, H, b), Mi(e, i, L.base), L = await Vt(o ?? r, {
        mappingId: ae,
        categories: null,
        updatedAt: Date.now()
      }), x.selectedMapping = ae, $e(R, L, d, x.selectedMapping), x.selectedMapping = R.value ?? ae, et(v, L), tt({ switcher: N, emptyState: $, state: L }), qt(b, {
        state: L,
        hasCategories: c.length > 0
      }), oo(i, {
        mappingId: ae,
        color: ((Le = (ue = L.base) == null ? void 0 : ue.config) == null ? void 0 : Le.color) ?? null
      }), (Ce = (de = ui.notifications) == null ? void 0 : de.info) == null || Ce.call(
        de,
        f(
          "EIDOLON.LightCriteria.BaseApplied",
          "Applied the base lighting state to the form."
        )
      ), Ae({
        mappingSelect: R,
        applyMappingButton: Y,
        updateMappingButton: F,
        editCriteriaButton: V,
        removeMappingButton: w,
        state: L
      });
      return;
    }
    const k = Array.isArray(L == null ? void 0 : L.mappings) && L.mappings.length ? L.mappings.find((ht) => (ht == null ? void 0 : ht.id) === M) : null;
    if (!k) {
      (Se = (ie = ui.notifications) == null ? void 0 : ie.warn) == null || Se.call(
        ie,
        f(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      ), $e(R, L, d, ""), x.selectedMapping = R.value ?? "", Ae({
        mappingSelect: R,
        applyMappingButton: Y,
        updateMappingButton: F,
        editCriteriaButton: V,
        removeMappingButton: w,
        state: L
      });
      return;
    }
    Ti(h, H, b), Mi(e, i, k.config), L = await Vt(o ?? r, {
      mappingId: k.id,
      categories: k.categories,
      updatedAt: Date.now()
    }), x.selectedMapping = k.id, $e(R, L, d, x.selectedMapping), x.selectedMapping = R.value ?? k.id, et(v, L), tt({ switcher: N, emptyState: $, state: L }), qt(b, {
      state: L,
      hasCategories: c.length > 0
    }), oo(i, {
      mappingId: k.id,
      color: ((ye = (re = k.config) == null ? void 0 : re.config) == null ? void 0 : ye.color) ?? null
    });
    const G = Ot(k, d);
    (Ht = (Me = ui.notifications) == null ? void 0 : Me.info) == null || Ht.call(
      Me,
      f(
        "EIDOLON.LightCriteria.MappingApplied",
        "Applied mapping: {label}"
      ).replace("{label}", G)
    ), Ae({
      mappingSelect: R,
      applyMappingButton: Y,
      updateMappingButton: F,
      editCriteriaButton: V,
      removeMappingButton: w,
      state: L
    });
  }, "applySelectedMapping");
  Y.addEventListener("click", () => {
    Rt();
  }), R.addEventListener("keydown", (M) => {
    M.key === "Enter" && (M.preventDefault(), Rt());
  });
  const gi = /* @__PURE__ */ s(async () => {
    var k, G, J, X, ee, ne, ue, Le, de, Ce, ie, Se, re, ye, Me, Ht, ht, mi, qr, hi, Pr;
    const M = x.selectedMapping;
    if (!M) {
      (G = (k = ui.notifications) == null ? void 0 : k.warn) == null || G.call(
        k,
        f(
          "EIDOLON.LightCriteria.SelectMappingWarning",
          "Choose a criteria mapping before applying."
        )
      );
      return;
    }
    F.disabled = !0;
    try {
      const Te = Ii(e, o);
      if (M === ae)
        L = await eo(o ?? r, Te), E("LightCriteria | Base lighting updated", {
          lightId: ((J = o ?? r) == null ? void 0 : J.id) ?? null,
          configColor: ((X = Te == null ? void 0 : Te.config) == null ? void 0 : X.color) ?? null
        }), (ne = (ee = ui.notifications) == null ? void 0 : ee.info) == null || ne.call(
          ee,
          f(
            "EIDOLON.LightCriteria.BaseUpdated",
            "Updated the base lighting state with the current configuration."
          )
        ), x.selectedMapping = ae;
      else {
        const pt = jt(L, M);
        if (!pt) {
          (Le = (ue = ui.notifications) == null ? void 0 : ue.warn) == null || Le.call(
            ue,
            f(
              "EIDOLON.LightCriteria.MappingUnavailable",
              "The selected criteria mapping is no longer available."
            )
          ), $e(R, L, d, ""), x.selectedMapping = R.value ?? "";
          return;
        }
        L = await to(
          o ?? r,
          pt.categories,
          Te,
          { label: pt.label ?? null }
        ), E("LightCriteria | Mapping updated", {
          mappingId: M,
          hasColor: !!((de = Te == null ? void 0 : Te.config) != null && de.color),
          stored: Array.isArray(L == null ? void 0 : L.mappings) ? ((Ce = L.mappings.find((Cn) => (Cn == null ? void 0 : Cn.id) === M)) == null ? void 0 : Ce.config) ?? null : null,
          persisted: (Se = (ie = o ?? r) == null ? void 0 : ie.getFlag) == null ? void 0 : Se.call(ie, dt, St)
        });
        const $t = jt(L, M), ha = Ot($t || pt, d);
        E("LightCriteria | Mapping updated", {
          mappingId: M,
          categories: pt.categories,
          updatedColor: ((re = Te == null ? void 0 : Te.config) == null ? void 0 : re.color) ?? null,
          storedColor: ((Me = (ye = $t == null ? void 0 : $t.config) == null ? void 0 : ye.config) == null ? void 0 : Me.color) ?? ((ht = (Ht = pt.config) == null ? void 0 : Ht.config) == null ? void 0 : ht.color) ?? null
        }), (qr = (mi = ui.notifications) == null ? void 0 : mi.info) == null || qr.call(
          mi,
          f(
            "EIDOLON.LightCriteria.MappingUpdated",
            "Saved changes to mapping: {label}"
          ).replace("{label}", ha)
        ), x.selectedMapping = M;
      }
      et(v, L), tt({ switcher: N, emptyState: $, state: L }), qt(b, {
        state: L,
        hasCategories: c.length > 0
      }), $e(R, L, d, x.selectedMapping), x.selectedMapping = R.value ?? "";
    } catch (Te) {
      console.error("eidolon-utilities | Failed to update light criteria mapping", Te), (Pr = (hi = ui.notifications) == null ? void 0 : hi.error) == null || Pr.call(
        hi,
        f(
          "EIDOLON.LightCriteria.MappingUpdateError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      F.disabled = !1, Ae({
        mappingSelect: R,
        applyMappingButton: Y,
        updateMappingButton: F,
        editCriteriaButton: V,
        removeMappingButton: w,
        state: L
      });
    }
  }, "updateSelectedMapping");
  F.addEventListener("click", () => {
    gi();
  }), $e(R, L, d, x.selectedMapping), x.selectedMapping = R.value ?? x.selectedMapping ?? "", Ae({
    mappingSelect: R,
    applyMappingButton: Y,
    updateMappingButton: F,
    editCriteriaButton: V,
    removeMappingButton: w,
    state: L
  }), S.addEventListener("click", async () => {
    var M, k, G, J, X, ee;
    S.disabled = !0;
    try {
      const ne = Ii(e, o);
      L = await eo(o ?? r, ne), E("LightCriteria | Base lighting stored", {
        lightId: ((M = o ?? r) == null ? void 0 : M.id) ?? null,
        configColor: ((k = ne == null ? void 0 : ne.config) == null ? void 0 : k.color) ?? null
      }), (J = (G = ui.notifications) == null ? void 0 : G.info) == null || J.call(
        G,
        f(
          "EIDOLON.LightCriteria.BaseStored",
          "Saved the current configuration as the base lighting state."
        )
      ), et(v, L), tt({ switcher: N, emptyState: $, state: L }), qt(b, {
        state: L,
        hasCategories: c.length > 0
      }), x.selectedMapping = ae, $e(R, L, d, x.selectedMapping), x.selectedMapping = R.value ?? "", Ae({
        mappingSelect: R,
        applyMappingButton: Y,
        updateMappingButton: F,
        editCriteriaButton: V,
        removeMappingButton: w,
        state: L
      });
    } catch (ne) {
      console.error("eidolon-utilities | Failed to store base light criteria state", ne), (ee = (X = ui.notifications) == null ? void 0 : X.error) == null || ee.call(
        X,
        f(
          "EIDOLON.LightCriteria.BaseError",
          "Failed to save the base lighting state. Check the console for details."
        )
      );
    } finally {
      S.disabled = !1;
    }
  }), b.addEventListener("click", () => {
    var k, G, J, X;
    if (!(L != null && L.base)) {
      (G = (k = ui.notifications) == null ? void 0 : k.warn) == null || G.call(
        k,
        f(
          "EIDOLON.LightCriteria.RequiresBase",
          "Set a base lighting state before adding criteria mappings."
        )
      );
      return;
    }
    if (c.length === 0) {
      (X = (J = ui.notifications) == null ? void 0 : J.warn) == null || X.call(
        J,
        f(
          "EIDOLON.LightCriteria.NoCategoriesAvailable",
          "Add scene criteria with values in the Scene configuration before creating mappings."
        )
      );
      return;
    }
    const M = vi.get(h);
    ro({
      app: e,
      fieldset: h,
      createButton: b,
      creationSection: H,
      categoryList: P,
      form: i,
      persistedLight: o,
      stateEntry: M,
      mode: "create",
      mapping: null,
      preloadConfig: L.base
    });
  }), V.addEventListener("click", () => {
    var G, J, X, ee;
    const M = x.selectedMapping;
    if (!M || M === ae) {
      (J = (G = ui.notifications) == null ? void 0 : G.warn) == null || J.call(
        G,
        f(
          "EIDOLON.LightCriteria.SelectMappingForCriteriaEdit",
          "Select a mapping before editing criteria."
        )
      );
      return;
    }
    const k = jt(L, M);
    if (!k) {
      (ee = (X = ui.notifications) == null ? void 0 : X.warn) == null || ee.call(
        X,
        f(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      );
      return;
    }
    oa(e, { fieldset: h, homeContainer: n }), ro({
      app: e,
      fieldset: h,
      createButton: b,
      creationSection: H,
      categoryList: P,
      form: i,
      persistedLight: o,
      stateEntry: x,
      mode: "retarget",
      mapping: k,
      preloadConfig: k.config
    });
  }), te.addEventListener("click", async () => {
    var k, G, J, X, ee, ne, ue, Le, de, Ce;
    const M = Hs(P);
    if (!M) {
      (G = (k = ui.notifications) == null ? void 0 : k.warn) == null || G.call(
        k,
        f(
          "EIDOLON.LightCriteria.SelectionRequired",
          "Select at least one criteria value to identify the mapping."
        )
      );
      return;
    }
    te.disabled = !0;
    try {
      const ie = Ii(e, o);
      if (x.editorMode === "retarget" && x.editingMappingId) {
        const re = fr(L, M);
        let ye = !1;
        if (re && re !== x.editingMappingId && (ye = await Es(), !ye)) {
          te.disabled = !1;
          return;
        }
        L = await hs(
          o ?? r,
          x.editingMappingId,
          M,
          ie,
          { replaceExisting: ye }
        ), E("LightCriteria | Mapping criteria retargeted", {
          mappingId: x.editingMappingId,
          categories: M,
          replaced: ye,
          configColor: ((J = ie == null ? void 0 : ie.config) == null ? void 0 : J.color) ?? null
        }), (ee = (X = ui.notifications) == null ? void 0 : X.info) == null || ee.call(
          X,
          f(
            "EIDOLON.LightCriteria.MappingCriteriaUpdated",
            "Updated mapping criteria for the selected mapping."
          )
        );
      } else
        L = await to(
          o ?? r,
          M,
          ie,
          {}
        ), E("LightCriteria | Mapping saved from editor", {
          categories: M,
          configColor: ((ne = ie == null ? void 0 : ie.config) == null ? void 0 : ne.color) ?? null
        }), (Le = (ue = ui.notifications) == null ? void 0 : ue.info) == null || Le.call(
          ue,
          f(
            "EIDOLON.LightCriteria.MappingSaved",
            "Updated lighting mapping for the selected scene criteria."
          )
        );
      et(v, L), tt({ switcher: N, emptyState: $, state: L });
      const Se = fr(L, M);
      Se && (x.selectedMapping = Se), $e(R, L, d, x.selectedMapping), x.selectedMapping = R.value ?? "", Ae({
        mappingSelect: R,
        applyMappingButton: Y,
        updateMappingButton: F,
        editCriteriaButton: V,
        removeMappingButton: w,
        state: L
      }), Ti(h, H, b);
    } catch (ie) {
      console.error("eidolon-utilities | Failed to persist light criteria mapping", ie), (Ce = (de = ui.notifications) == null ? void 0 : de.error) == null || Ce.call(
        de,
        f(
          "EIDOLON.LightCriteria.MappingError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      te.disabled = !1;
    }
  }), j.addEventListener("click", () => {
    const M = vi.get(h);
    M != null && M.restoreConfig && Mi(e, i, M.restoreConfig), Ti(h, H, b);
  }), w.addEventListener("click", async () => {
    var G, J;
    const M = x.selectedMapping;
    !M || M === ae || !await Ls() || (L = await ps(o ?? r, M), x.selectedMapping = "", et(v, L), tt({ switcher: N, emptyState: $, state: L }), $e(R, L, d, ""), Ae({
      mappingSelect: R,
      applyMappingButton: Y,
      updateMappingButton: F,
      editCriteriaButton: V,
      removeMappingButton: w,
      state: L
    }), (J = (G = ui.notifications) == null ? void 0 : G.info) == null || J.call(
      G,
      f("EIDOLON.LightCriteria.MappingRemoved", "Removed selected mapping.")
    ));
  });
}
s(bs, "enhanceAmbientLightConfig");
function ro({
  app: e,
  fieldset: t,
  createButton: i,
  creationSection: n,
  categoryList: r,
  form: o,
  persistedLight: a,
  stateEntry: l,
  mode: c,
  mapping: d,
  preloadConfig: u
}) {
  l && (l.restoreConfig = Ii(e, a), l.editorMode = c, l.editingMappingId = c === "retarget" ? (d == null ? void 0 : d.id) ?? null : null), u && Mi(e, o, u), c === "retarget" && (d != null && d.categories) ? Fs(r, d.categories) : _s(r);
  const m = n.querySelector("p.notes");
  m instanceof HTMLElement && (m.textContent = c === "retarget" ? f(
    "EIDOLON.LightCriteria.EditCriteriaDescription",
    "Adjust criteria values for the selected mapping."
  ) : f(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const h = n.querySelector('button[data-action="save-mapping"]');
  h instanceof HTMLButtonElement && (h.textContent = c === "retarget" ? f("EIDOLON.LightCriteria.SaveCriteriaChanges", "Save Criteria Changes") : f("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), n.hidden = !1, i.setAttribute("aria-expanded", "true"), Ir(t, n), requestAnimationFrame(() => {
    var p;
    (p = e.setPosition) == null || p.call(e, { height: "auto" });
  });
}
s(ro, "openMappingEditor");
async function Es() {
  var i, n;
  const e = (n = (i = foundry == null ? void 0 : foundry.applications) == null ? void 0 : i.api) == null ? void 0 : n.DialogV2;
  if (typeof (e == null ? void 0 : e.confirm) == "function")
    return e.confirm({
      window: { title: f("EIDOLON.LightCriteria.ConflictTitle", "Replace Existing Mapping?") },
      content: `<p>${f(
        "EIDOLON.LightCriteria.ConflictBody",
        "A mapping already exists for this criteria combination. Replace it with the edited mapping?"
      )}</p>`,
      rejectClose: !1
    });
  const t = globalThis.Dialog;
  return typeof (t == null ? void 0 : t.confirm) != "function" ? !1 : t.confirm({
    title: f("EIDOLON.LightCriteria.ConflictTitle", "Replace Existing Mapping?"),
    content: `<p>${f(
      "EIDOLON.LightCriteria.ConflictBody",
      "A mapping already exists for this criteria combination. Replace it with the edited mapping?"
    )}</p>`,
    yes: /* @__PURE__ */ s(() => !0, "yes"),
    no: /* @__PURE__ */ s(() => !1, "no"),
    defaultYes: !1
  });
}
s(Es, "confirmCriteriaConflict");
async function Ls() {
  var i, n;
  const e = (n = (i = foundry == null ? void 0 : foundry.applications) == null ? void 0 : i.api) == null ? void 0 : n.DialogV2;
  if (typeof (e == null ? void 0 : e.confirm) == "function")
    return e.confirm({
      window: { title: f("EIDOLON.LightCriteria.RemoveTitle", "Remove Mapping?") },
      content: `<p>${f(
        "EIDOLON.LightCriteria.RemoveBody",
        "Remove the currently selected mapping? This cannot be undone."
      )}</p>`,
      rejectClose: !1
    });
  const t = globalThis.Dialog;
  return typeof (t == null ? void 0 : t.confirm) != "function" ? !1 : t.confirm({
    title: f("EIDOLON.LightCriteria.RemoveTitle", "Remove Mapping?"),
    content: `<p>${f(
      "EIDOLON.LightCriteria.RemoveBody",
      "Remove the currently selected mapping? This cannot be undone."
    )}</p>`,
    yes: /* @__PURE__ */ s(() => !0, "yes"),
    no: /* @__PURE__ */ s(() => !1, "no"),
    defaultYes: !1
  });
}
s(Ls, "confirmRemoveMapping");
function Cs(e, { fieldset: t, homeContainer: i }) {
  const n = ws(e, i);
  if (!(n instanceof HTMLElement)) return;
  const r = n.querySelector(".window-header");
  if (!(r instanceof HTMLElement)) return;
  let o = r.querySelector('[data-eidolon-action="open-light-criteria-manager"]');
  if (!(o instanceof HTMLButtonElement)) {
    o = document.createElement("button"), o.type = "button", o.classList.add("header-control", "icon"), o.dataset.eidolonAction = "open-light-criteria-manager", o.dataset.tooltip = f("EIDOLON.LightCriteria.OpenManager", "Open Scene Criteria Lighting"), o.setAttribute("aria-label", f("EIDOLON.LightCriteria.OpenManager", "Open Scene Criteria Lighting")), o.innerHTML = '<i class="fa-solid fa-sliders" inert=""></i>';
    const a = r.querySelector(".window-controls") ?? r, l = a.querySelector('[data-action="toggleControls"]');
    if ((l == null ? void 0 : l.parentElement) === a)
      a.insertBefore(o, l);
    else {
      const c = a.querySelector('[data-action="close"]');
      (c == null ? void 0 : c.parentElement) === a ? a.insertBefore(o, c) : a.appendChild(o);
    }
  }
  o.onclick = (a) => {
    a.preventDefault(), oa(e, { fieldset: t, homeContainer: i });
  };
}
s(Cs, "ensureManagerHeaderButton");
function oa(e, { fieldset: t, homeContainer: i }) {
  var h, p, y;
  const n = yi.get(e);
  if (n != null && n.rendered) {
    (h = n.bringToTop) == null || h.call(n);
    return;
  }
  const r = /* @__PURE__ */ s((...T) => {
    var v;
    const S = Ss(T), b = (v = S == null ? void 0 : S.querySelector) == null ? void 0 : v.call(S, ".eidolon-light-criteria-manager-host");
    b instanceof HTMLElement && (Os(t), t.hidden = !1, b.appendChild(t));
  }, "onRender"), o = /* @__PURE__ */ s(() => {
    i instanceof HTMLElement && i.appendChild(t), t.hidden = !0, yi.delete(e), requestAnimationFrame(() => {
      var T;
      (T = e.setPosition) == null || T.call(e, { height: "auto" });
    });
  }, "onClose"), a = f("EIDOLON.LightCriteria.ManagerTitle", "Scene Criteria Lighting"), l = '<div class="eidolon-light-criteria-manager-host"></div>', c = f("EIDOLON.LightCriteria.Close", "Close"), d = (y = (p = foundry == null ? void 0 : foundry.applications) == null ? void 0 : p.api) == null ? void 0 : y.DialogV2;
  if (typeof (d == null ? void 0 : d.wait) == "function")
    try {
      let T = !1;
      const S = /* @__PURE__ */ s(() => {
        T || (T = !0, o());
      }, "closeOnce");
      yi.set(e, {
        rendered: !0,
        bringToTop: /* @__PURE__ */ s(() => {
        }, "bringToTop")
      }), d.wait({
        window: { title: a },
        content: l,
        buttons: [{ action: "close", label: c, default: !0 }],
        render: /* @__PURE__ */ s((...b) => r(...b), "render"),
        close: S,
        rejectClose: !1
      }).catch((b) => {
        console.warn("eidolon-utilities | DialogV2 manager failed, falling back to Dialog", b), S();
      });
      return;
    } catch (T) {
      console.warn("eidolon-utilities | DialogV2 manager failed, falling back to Dialog", T), o();
    }
  const u = globalThis.Dialog;
  if (typeof u != "function") return;
  const m = new u(
    {
      title: a,
      content: l,
      buttons: {
        close: {
          label: c
        }
      },
      render: /* @__PURE__ */ s((...T) => r(...T), "render"),
      close: o
    },
    {
      width: 640,
      resizable: !0
    }
  );
  yi.set(e, m), m.render(!0);
}
s(oa, "openManagerDialog");
function Ss(e) {
  for (const t of e) {
    const i = At(t);
    if (i) return i;
    const n = At(t == null ? void 0 : t.element);
    if (n) return n;
  }
  return null;
}
s(Ss, "findDialogRoot");
function Os(e) {
  if (!(e instanceof HTMLElement) || e.dataset.managerLayout === "true") return;
  e.dataset.managerLayout = "true", e.classList.add("is-manager");
  const t = e.querySelector("legend"), i = e.querySelector("p.notes:not(.eidolon-light-criteria__status)"), n = e.querySelector(".eidolon-light-criteria__controls"), r = e.querySelector(".eidolon-light-criteria__status"), o = e.querySelector(".eidolon-light-criteria__creation"), a = Array.from(e.querySelectorAll(".eidolon-light-criteria__warning")), l = document.createElement("div");
  l.classList.add("eidolon-light-criteria-manager");
  const c = document.createElement("section");
  c.classList.add("eidolon-light-criteria-manager__section", "is-top"), l.appendChild(c);
  const d = document.createElement("section");
  d.classList.add("eidolon-light-criteria-manager__section", "is-bottom"), l.appendChild(d);
  const u = document.createElement("div");
  if (u.classList.add("eidolon-light-criteria-manager__header"), u.textContent = f("EIDOLON.LightCriteria.ManagerHeader", "Base State"), c.appendChild(u), r && c.appendChild(r), n && c.appendChild(n), a.length) {
    const h = document.createElement("div");
    h.classList.add("eidolon-light-criteria-manager__warnings");
    for (const p of a) h.appendChild(p);
    c.appendChild(h);
  }
  const m = document.createElement("div");
  m.classList.add("eidolon-light-criteria-manager__header"), m.textContent = f("EIDOLON.LightCriteria.ManagerAuthoring", "Create or Update Mapping"), d.appendChild(m), o && d.appendChild(o), e.innerHTML = "", t && e.appendChild(t), i && e.appendChild(i), e.appendChild(l), Ir(e, o);
}
s(Os, "applyManagerLayout");
function ws(e, t) {
  var n;
  const i = At(e == null ? void 0 : e.element);
  return i || (((n = t == null ? void 0 : t.closest) == null ? void 0 : n.call(t, ".application")) ?? null);
}
s(ws, "resolveApplicationRoot");
function Ti(e, t, i) {
  const n = vi.get(e);
  n && (n.restoreConfig = null, n.editorMode = "create", n.editingMappingId = null), t.hidden = !0, i.setAttribute("aria-expanded", "false");
  const r = t.querySelector("p.notes");
  r instanceof HTMLElement && (r.textContent = f(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const o = t.querySelector('button[data-action="save-mapping"]');
  o instanceof HTMLButtonElement && (o.textContent = f("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), Ir(e, t), requestAnimationFrame(() => {
    var a, l;
    (l = (a = n == null ? void 0 : n.app) == null ? void 0 : a.setPosition) == null || l.call(a, { height: "auto" });
  });
}
s(Ti, "hideCreationSection");
function et(e, t) {
  if (!e) return;
  const i = !!(t != null && t.base), n = Array.isArray(t == null ? void 0 : t.mappings) ? t.mappings.length : 0, r = [];
  r.push(
    i ? f(
      "EIDOLON.LightCriteria.StatusBaseSaved",
      "Base lighting saved."
    ) : f(
      "EIDOLON.LightCriteria.StatusBaseMissing",
      "Base lighting not yet saved."
    )
  ), r.push(
    f(
      "EIDOLON.LightCriteria.StatusMappingCount",
      "Mappings: {count}"
    ).replace("{count}", String(n))
  ), e.textContent = r.join(" ");
}
s(et, "updateStatusLine");
function qt(e, { state: t, hasCategories: i }) {
  if (!e) return;
  const n = !!(t != null && t.base), r = n && i;
  e.disabled = !r, e.title = r ? "" : n ? f(
    "EIDOLON.LightCriteria.CreateDisabledNoCategories",
    "Add scene criteria with values before creating mappings."
  ) : f(
    "EIDOLON.LightCriteria.CreateDisabledNoBase",
    "Save a base lighting state before creating criteria mappings."
  );
}
s(qt, "updateCreateButtonState");
function Ii(e, t) {
  var c, d, u;
  const i = t ?? aa(e);
  if (!i)
    throw new Error("Ambient light document unavailable.");
  const n = mt(((c = i.toObject) == null ? void 0 : c.call(i)) ?? {});
  if (!n)
    throw new Error("Unable to duplicate ambient light data.");
  const r = (e == null ? void 0 : e.form) instanceof HTMLFormElement ? e.form : null, o = r ? Va(r) : {}, a = foundry.utils.mergeObject(n, o, {
    inplace: !1,
    performDeletions: !0
  });
  r && (r.querySelectorAll("color-picker[name]").forEach((m) => {
    var b, v;
    const h = m.getAttribute("name");
    if (!h) return;
    const p = typeof m.value == "string" ? m.value : "", y = ((b = m.ui) == null ? void 0 : b.input) ?? ((v = m.querySelector) == null ? void 0 : v.call(m, 'input[type="color"]')), T = (y == null ? void 0 : y.value) ?? "", S = p || T;
    typeof S != "string" || !S || (foundry.utils.setProperty(a, h, S), E("LightCriteria | Captured color-picker value", {
      path: h,
      pickerValue: p,
      swatchValue: T,
      chosenValue: S
    }));
  }), r.querySelectorAll("range-picker[name]").forEach((m) => {
    var B, U;
    const h = m.getAttribute("name");
    if (!h) return;
    const p = m.value !== void 0 && m.value !== null ? String(m.value) : "", y = (B = m.querySelector) == null ? void 0 : B.call(m, 'input[type="range"]'), T = (U = m.querySelector) == null ? void 0 : U.call(m, 'input[type="number"]'), S = y instanceof HTMLInputElement ? y.value : "", b = T instanceof HTMLInputElement ? T.value : "", v = p || b || S;
    if (typeof v != "string" || !v.length) return;
    const N = Number(v), q = Number.isFinite(N) ? N : v;
    foundry.utils.setProperty(a, h, q), E("LightCriteria | Captured range-picker value", {
      path: h,
      elementValue: p,
      numberValue: b,
      rangeValue: S,
      chosenValue: q
    });
  }));
  const l = mt(a);
  return E("LightCriteria | Captured form config", {
    lightId: (i == null ? void 0 : i.id) ?? null,
    hasColor: !!((d = l == null ? void 0 : l.config) != null && d.color),
    color: ((u = l == null ? void 0 : l.config) == null ? void 0 : u.color) ?? null
  }), l;
}
s(Ii, "captureAmbientLightFormConfig");
function Mi(e, t, i) {
  if (!i || typeof i != "object") return;
  const n = foundry.utils.flattenObject(i, { safe: !0 });
  for (const [r, o] of Object.entries(n)) {
    const a = t.querySelectorAll(`[name="${r}"]`);
    if (a.length) {
      E("LightCriteria | Applying field", {
        path: r,
        value: o,
        elementCount: a.length
      });
      for (const l of a)
        l instanceof HTMLElement && l.tagName === "COLOR-PICKER" ? Is(l, o) : l instanceof HTMLElement && l.tagName === "RANGE-PICKER" ? Ms(l, o) : l instanceof HTMLInputElement ? vs(l, o) : l instanceof HTMLSelectElement ? As(l, o) : l instanceof HTMLTextAreaElement && Ns(l, o);
    }
  }
  requestAnimationFrame(() => {
    var r;
    return (r = e._previewChanges) == null ? void 0 : r.call(e);
  });
}
s(Mi, "applyConfigToForm");
function vs(e, t, i) {
  const n = e.type;
  if (n === "checkbox") {
    const a = !!t;
    e.checked !== a && (e.checked = a, Ie(e));
    return;
  }
  if (n === "radio") {
    const a = t == null ? "" : String(t), l = e.value === a;
    e.checked !== l && (e.checked = l, l && Ie(e));
    return;
  }
  const r = t == null ? "" : String(t);
  let o = !1;
  e.value !== r && (e.value = r, o = !0), o && Ie(e);
}
s(vs, "applyValueToInput");
function Is(e, t, i) {
  var l, c, d, u, m, h;
  const n = t == null ? "" : String(t);
  let r = !1;
  e.value !== n && (e.value = n, e.setAttribute("value", n), (l = e.ui) != null && l.setValue && e.ui.setValue(n), r = !0);
  const o = ((c = e.ui) == null ? void 0 : c.input) ?? ((d = e.querySelector) == null ? void 0 : d.call(e, 'input[type="color"]'));
  o instanceof HTMLInputElement && o.value !== n && (o.value = n, Ie(o));
  const a = ((u = e.ui) == null ? void 0 : u.text) ?? ((m = e.querySelector) == null ? void 0 : m.call(e, 'input[type="text"]'));
  a instanceof HTMLInputElement && a.value !== n && (a.value = n, Ie(a)), (h = e.ui) != null && h.commit ? e.ui.commit() : (e.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }))), E("LightCriteria | Color picker applied", {
    value: n,
    pickerValue: e.value ?? null,
    swatchValue: (o == null ? void 0 : o.value) ?? null,
    textValue: (a == null ? void 0 : a.value) ?? null
  }), r && Ie(e);
}
s(Is, "applyValueToColorPicker");
function Ms(e, t, i) {
  var d, u;
  const n = t == null ? "" : String(t), r = Number(n), o = Number.isFinite(r) ? r : n;
  let a = !1;
  e.value !== void 0 && e.value !== o && (e.value = o, a = !0), e.getAttribute("value") !== n && (e.setAttribute("value", n), a = !0);
  const l = (d = e.querySelector) == null ? void 0 : d.call(e, 'input[type="range"]');
  l instanceof HTMLInputElement && l.value !== n && (l.value = n, Ie(l));
  const c = (u = e.querySelector) == null ? void 0 : u.call(e, 'input[type="number"]');
  if (c instanceof HTMLInputElement && c.value !== n && (c.value = n, Ie(c)), typeof e.commit == "function")
    try {
      e.commit();
    } catch (m) {
      console.error("eidolon-utilities | range-picker commit failed", m);
    }
  E("LightCriteria | Range picker applied", {
    value: n,
    resolvedValue: o,
    rangeValue: (l == null ? void 0 : l.value) ?? null,
    numberValue: (c == null ? void 0 : c.value) ?? null
  }), a && Ie(e);
}
s(Ms, "applyValueToRangePicker");
function As(e, t, i) {
  const n = t == null ? "" : String(t);
  e.value !== n && (e.value = n, Ie(e));
}
s(As, "applyValueToSelect");
function Ns(e, t, i) {
  const n = t == null ? "" : String(t);
  e.value !== n && (e.value = n, Ie(e));
}
s(Ns, "applyValueToTextarea");
function Ie(e) {
  e.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }));
}
s(Ie, "triggerInputChange");
function Ae({
  mappingSelect: e,
  applyMappingButton: t,
  updateMappingButton: i,
  editCriteriaButton: n,
  removeMappingButton: r,
  state: o
}) {
  const a = (e == null ? void 0 : e.value) ?? "", l = !!(o != null && o.base), c = a && a !== ae ? !!jt(o, a) : !1;
  t instanceof HTMLButtonElement && (a ? a === ae ? t.disabled = !l : t.disabled = !c : t.disabled = !0), i instanceof HTMLButtonElement && (a ? a === ae ? i.disabled = !1 : i.disabled = !c : i.disabled = !0), n instanceof HTMLButtonElement && (n.disabled = !a || a === ae || !c), r instanceof HTMLButtonElement && (r.disabled = !a || a === ae || !c);
}
s(Ae, "syncMappingSwitcherState");
function Ds(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e) {
    if (!i) continue;
    const n = typeof i.id == "string" ? i.id : null;
    if (!n) continue;
    const r = typeof i.name == "string" && i.name.trim() ? i.name.trim() : f("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category");
    t.has(n) || t.set(n, r);
  }
  return t;
}
s(Ds, "buildCategoryNameLookup");
function $e(e, t, i, n) {
  if (!(e instanceof HTMLSelectElement)) return;
  const r = typeof n == "string" ? n : "", o = !!(t != null && t.base), a = Array.isArray(t == null ? void 0 : t.mappings) ? [...t.mappings] : [], l = e.value;
  e.innerHTML = "";
  const c = document.createElement("option");
  c.value = "", c.textContent = f(
    "EIDOLON.LightCriteria.SelectPlaceholder",
    "Select a mapping"
  ), c.disabled = o, e.appendChild(c);
  const d = document.createElement("option");
  d.value = ae, d.textContent = f(
    "EIDOLON.LightCriteria.BaseOption",
    "Base Lighting"
  ), d.disabled = !o, e.appendChild(d), a.slice().sort((p, y) => {
    var b;
    const T = Ot(p, i), S = Ot(y, i);
    return T.localeCompare(S, ((b = game.i18n) == null ? void 0 : b.lang) ?? void 0, {
      sensitivity: "base"
    });
  }).forEach((p) => {
    if (!(p != null && p.id)) return;
    const y = document.createElement("option");
    y.value = p.id, y.textContent = Ot(p, i), e.appendChild(y);
  });
  const u = new Set(
    Array.from(e.options).filter((p) => !p.disabled).map((p) => p.value)
  ), m = o && l === "" ? "" : l, h = r || (u.has(m) ? m : "");
  h && u.has(h) ? e.value = h : o ? e.value = ae : e.value = "";
}
s($e, "populateMappingSelector");
function Ot(e, t) {
  if (!e || typeof e != "object")
    return f("EIDOLON.LightCriteria.UnnamedMapping", "Unnamed Mapping");
  if (typeof e.label == "string" && e.label.trim())
    return e.label.trim();
  const i = e.categories ?? {}, n = Object.entries(i).filter(([, r]) => typeof r == "string" && r.trim()).map(([r, o]) => {
    const a = o.trim();
    return `${t.get(r) ?? f("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category")}: ${a}`;
  });
  return n.length === 0 ? f("EIDOLON.LightCriteria.UnnamedMapping", "Unnamed Mapping") : n.join(" • ");
}
s(Ot, "formatMappingOptionLabel");
function fr(e, t) {
  if (!e || typeof e != "object" || !Array.isArray(e.mappings)) return null;
  const i = fi(t);
  if (!i) return null;
  const n = e.mappings.find((r) => (r == null ? void 0 : r.key) === i);
  return (n == null ? void 0 : n.id) ?? null;
}
s(fr, "findMappingIdByCategories");
function jt(e, t) {
  return !t || !e || typeof e != "object" || !Array.isArray(e.mappings) ? null : e.mappings.find((i) => (i == null ? void 0 : i.id) === t) ?? null;
}
s(jt, "getMappingById");
function Rs(e) {
  if (!e || typeof e != "object") return "";
  const t = e.current;
  if (t != null && t.mappingId) {
    if (t.mappingId === ae)
      return e != null && e.base ? ae : "";
    if (Array.isArray(e.mappings) && e.mappings.some((i) => i.id === t.mappingId))
      return t.mappingId;
  }
  if (t != null && t.categories) {
    const i = fr(e, t.categories);
    if (i) return i;
  }
  return "";
}
s(Rs, "resolveInitialMappingSelection");
function oo(e, t = {}) {
  var a, l, c, d;
  if (!(e instanceof HTMLFormElement)) return;
  const i = e.querySelector('color-picker[name="config.color"]'), n = (i == null ? void 0 : i.value) ?? null, r = ((a = i == null ? void 0 : i.ui) == null ? void 0 : a.text) ?? ((l = i == null ? void 0 : i.querySelector) == null ? void 0 : l.call(i, 'input[type="text"]')), o = ((c = i == null ? void 0 : i.ui) == null ? void 0 : c.input) ?? ((d = i == null ? void 0 : i.querySelector) == null ? void 0 : d.call(i, 'input[type="color"]'));
  E("LightCriteria | Color state after apply", {
    ...t,
    textValue: (r == null ? void 0 : r.value) ?? null,
    pickerValue: n,
    swatchValue: (o == null ? void 0 : o.value) ?? null
  });
}
s(oo, "logAppliedColorState");
function _s(e) {
  e.querySelectorAll("select[data-category-id]").forEach((t) => {
    t.value = "";
  });
}
s(_s, "resetCategorySelections");
function Fs(e, t) {
  const i = t && typeof t == "object" ? t : {};
  e.querySelectorAll("select[data-category-id]").forEach((n) => {
    const r = n.dataset.categoryId;
    if (!r) return;
    const o = i[r];
    n.value = typeof o == "string" ? o : "";
  });
}
s(Fs, "setCategorySelections");
function Hs(e) {
  const t = {};
  return e.querySelectorAll("select[data-category-id]").forEach((i) => {
    var o, a;
    const n = i.dataset.categoryId, r = (a = (o = i.value) == null ? void 0 : o.trim) == null ? void 0 : a.call(o);
    !n || !r || (t[n] = r);
  }), Object.keys(t).length > 0 ? t : null;
}
s(Hs, "readCategorySelections");
async function $s(e, t, i) {
  if (!e) return null;
  try {
    if (!i)
      return await Vt(e, {});
    if (i === ae)
      return await Vt(e, {
        mappingId: ae,
        categories: null,
        updatedAt: Date.now()
      });
    const n = jt(t, i);
    return n ? await Vt(e, {
      mappingId: n.id,
      categories: n.categories,
      updatedAt: Date.now()
    }) : null;
  } catch (n) {
    return console.warn("eidolon-utilities | Failed to persist mapping selection", n), null;
  }
}
s($s, "persistCurrentSelection");
function Ir(e, t) {
  if (!(e instanceof HTMLElement)) return;
  const i = e.querySelector(".eidolon-light-criteria-manager__section.is-bottom");
  i instanceof HTMLElement && (i.hidden = !!(t != null && t.hidden));
}
s(Ir, "updateManagerSectionVisibility");
function tt({ switcher: e, emptyState: t, state: i }) {
  const n = !!(i != null && i.base);
  e instanceof HTMLElement && (e.hidden = !n), t instanceof HTMLElement && (t.hidden = n);
}
s(tt, "updateActiveMappingVisibility");
function aa(e) {
  const t = (e == null ? void 0 : e.object) ?? (e == null ? void 0 : e.document) ?? null;
  return !(t != null && t.isEmbedded) || t.documentName !== "AmbientLight" ? null : t;
}
s(aa, "getAmbientLightDocument");
function ks(e) {
  if (!(e != null && e.isEmbedded)) return null;
  const t = e.parent ?? null;
  if (!t) return e;
  if (typeof t.getEmbeddedDocument == "function") {
    const n = t.getEmbeddedDocument(e.documentName, e.id);
    if (n) return n;
  }
  const i = t.lights;
  if (i != null && i.get) {
    const n = i.get(e.id);
    if (n) return n;
  }
  return e;
}
s(ks, "getPersistedAmbientLightDocument");
function qs() {
  ys();
}
s(qs, "registerLightCriteriaHooks");
qs();
const gr = /* @__PURE__ */ new Map();
let mr = !1;
function Mr(e, t) {
  gr.has(e) && console.warn(`[${O}] Socket handler for type "${e}" already registered, overwriting.`), gr.set(e, t);
}
s(Mr, "registerSocketHandler");
function Ai(e, t) {
  if (!mr) {
    console.error(`[${O}] Socket not initialized. Call initializeSocket() first.`);
    return;
  }
  game.socket.emit(`module.${O}`, { type: e, payload: t });
}
s(Ai, "emitSocket");
function Ps() {
  mr || (game.socket.on(`module.${O}`, (e) => {
    const { type: t, payload: i } = e ?? {}, n = gr.get(t);
    n ? n(i) : console.warn(`[${O}] No socket handler for type "${t}"`);
  }), mr = !0, console.log(`[${O}] Socket initialized on channel module.${O}`));
}
s(Ps, "initializeSocket");
const sa = "tween", la = "tween-sequence", hr = "tween-sequence-cancel", ge = Object.freeze({
  ABORT: "abort",
  CONTINUE: "continue"
}), Pt = Object.freeze({
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  FAILED: "failed"
}), Ve = Object.freeze({
  BEFORE_ALL: "beforeAll",
  BEFORE_STEP: "before",
  ENTRY: "entry",
  AFTER_STEP: "after",
  RUNTIME: "runtime",
  VALIDATION: "validation"
}), Pi = /* @__PURE__ */ new Map();
function Ar({ type: e, execute: t, validate: i }) {
  Pi.has(e) && console.warn(`[tween-registry] Type "${e}" already registered, overwriting.`), Pi.set(e, { type: e, execute: t, validate: i ?? (() => {
  }) });
}
s(Ar, "registerTweenType");
function Ln(e) {
  return Pi.get(e);
}
s(Ln, "getTweenType");
function xs(e, t = {}) {
  const i = Ln(e);
  if (!i)
    throw new Error(`Unknown tween type: "${e}".`);
  return i.validate(t ?? {}), i;
}
s(xs, "validateTweenEntry");
function pr() {
  return [...Pi.keys()];
}
s(pr, "listTweenTypes");
function ca(e) {
  const t = foundry.canvas.animation.CanvasAnimation;
  return {
    linear: t.easeLinear,
    easeInOutCosine: t.easeInOutCosine
  }[e] ?? t.easeInOutCosine;
}
s(ca, "resolveEasing");
function xi(e) {
  return e <= 0.04045 ? e / 12.92 : ((e + 0.055) / 1.055) ** 2.4;
}
s(xi, "srgbToLinear");
function wt(e) {
  return e <= 31308e-7 ? 12.92 * e : 1.055 * e ** (1 / 2.4) - 0.055;
}
s(wt, "linearToSrgb");
function ao(e, t, i) {
  const n = 0.4122214708 * e + 0.5363325363 * t + 0.0514459929 * i, r = 0.2119034982 * e + 0.6806995451 * t + 0.1073969566 * i, o = 0.0883024619 * e + 0.2817188376 * t + 0.6299787005 * i, a = Math.cbrt(n), l = Math.cbrt(r), c = Math.cbrt(o);
  return [
    0.2104542553 * a + 0.793617785 * l - 0.0040720468 * c,
    1.9779984951 * a - 2.428592205 * l + 0.4505937099 * c,
    0.0259040371 * a + 0.7827717662 * l - 0.808675766 * c
  ];
}
s(ao, "linearRgbToOklab");
function Bs(e, t, i) {
  const n = (e + 0.3963377774 * t + 0.2158037573 * i) ** 3, r = (e - 0.1055613458 * t - 0.0638541728 * i) ** 3, o = (e - 0.0894841775 * t - 1.291485548 * i) ** 3;
  return [
    4.0767416621 * n - 3.3077115913 * r + 0.2309699292 * o,
    -1.2684380046 * n + 2.6097574011 * r - 0.3413193965 * o,
    -0.0041960863 * n - 0.7034186147 * r + 1.707614701 * o
  ];
}
s(Bs, "oklabToLinearRgb");
function Bi(e) {
  return [e.r, e.g, e.b];
}
s(Bi, "colorToRgb");
function ua(e, t, i) {
  const n = /* @__PURE__ */ s((o) => Math.max(0, Math.min(1, o)), "clamp"), r = /* @__PURE__ */ s((o) => Math.round(n(o) * 255).toString(16).padStart(2, "0"), "toHex");
  return `#${r(e)}${r(t)}${r(i)}`;
}
s(ua, "rgbToHex");
function Us(e, t, i) {
  if (i <= 0) return e.toHTML();
  if (i >= 1) return t.toHTML();
  const n = foundry.utils.Color, [r, o, a] = e.hsl, [l, c, d] = t.hsl, u = (l - r + 0.5) % 1 - 0.5, m = (r + u * i + 1) % 1, h = o + (c - o) * i, p = a + (d - a) * i;
  return n.fromHSL([m, h, p]).toHTML();
}
s(Us, "interpolateHsl");
function Vs(e, t, i) {
  if (i <= 0) return e.toHTML();
  if (i >= 1) return t.toHTML();
  const [n, r, o] = Bi(e).map(xi), [a, l, c] = Bi(t).map(xi), d = wt(n + (a - n) * i), u = wt(r + (l - r) * i), m = wt(o + (c - o) * i);
  return ua(d, u, m);
}
s(Vs, "interpolateRgb");
function js(e, t, i) {
  if (i <= 0) return e.toHTML();
  if (i >= 1) return t.toHTML();
  const [n, r, o] = Bi(e).map(xi), [a, l, c] = Bi(t).map(xi), [d, u, m] = ao(n, r, o), [h, p, y] = ao(a, l, c), T = 0.02, S = Math.sqrt(u * u + m * m), b = Math.sqrt(p * p + y * y);
  let v, N, q;
  if (S < T || b < T)
    v = d + (h - d) * i, N = u + (p - u) * i, q = m + (y - m) * i;
  else {
    const Z = Math.atan2(m, u);
    let F = Math.atan2(y, p) - Z;
    F > Math.PI && (F -= 2 * Math.PI), F < -Math.PI && (F += 2 * Math.PI), v = d + (h - d) * i;
    const V = S + (b - S) * i, w = Z + F * i;
    N = V * Math.cos(w), q = V * Math.sin(w);
  }
  const [B, U, R] = Bs(v, N, q);
  return ua(wt(B), wt(U), wt(R));
}
s(js, "interpolateOklch");
const yr = {
  hsl: Us,
  rgb: Vs,
  oklch: js
};
function Gs(e = "hsl") {
  return yr[e] ?? yr.hsl;
}
s(Gs, "getInterpolator");
function so() {
  return Object.keys(yr);
}
s(so, "listInterpolationModes");
function zs(e) {
  if ((Array.isArray(e.uuid) ? e.uuid : [e.uuid]).some((i) => !i || typeof i != "string"))
    throw new Error("light-color tween: 'uuid' is required (string or array of AmbientLight document UUIDs).");
  if (e.toColor == null && e.toAlpha == null)
    throw new Error("light-color tween: at least one of 'toColor' or 'toAlpha' is required.");
  if (e.toColor != null) {
    if (typeof e.toColor != "string")
      throw new Error("light-color tween: 'toColor' must be a CSS color string.");
    if (!foundry.utils.Color.fromString(e.toColor).valid)
      throw new Error(`light-color tween: invalid target color "${e.toColor}".`);
  }
  if (e.toAlpha != null && (typeof e.toAlpha != "number" || e.toAlpha < 0 || e.toAlpha > 1))
    throw new Error("light-color tween: 'toAlpha' must be a number between 0 and 1.");
  if (e.mode && !so().includes(e.mode))
    throw new Error(
      `light-color tween: unknown mode "${e.mode}". Available: ${so().join(", ")}`
    );
}
s(zs, "validate$2");
async function Ws(e, t = {}) {
  const { CanvasAnimation: i } = foundry.canvas.animation, { Color: n } = foundry.utils, { uuid: r, toColor: o, toAlpha: a, mode: l = "oklch" } = e, c = Array.isArray(r) ? r : [r];
  if (c.length === 0)
    return console.warn("light-color tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: d = 2e3,
    easing: u = "easeInOutCosine",
    commit: m = !0,
    startEpochMS: h = null,
    signal: p = null
  } = t, y = ca(u), T = o != null, S = a != null, b = T ? Gs(l) : null, v = T ? n.fromString(o) : null;
  if (T && !v.valid) throw new Error(`light-color tween: invalid target color "${o}".`);
  async function N(B) {
    var H, _;
    if (p != null && p.aborted) return !1;
    const U = await fromUuid(B);
    if (!U) return !1;
    const R = U.object;
    if (!R) return !1;
    let Z;
    if (T) {
      const P = (H = U.config) == null ? void 0 : H.color;
      P != null && P.valid || console.warn(`light-color tween: source color invalid on ${B}, using white.`), Z = P != null && P.valid ? P : n.fromString("#ffffff");
    }
    const Y = S ? ((_ = U._source.config) == null ? void 0 : _.alpha) ?? 0.5 : null, F = { t: 0 }, V = `ambient-hue-tween:${B}`;
    i.terminateAnimation(V), p && p.addEventListener("abort", () => {
      i.terminateAnimation(V);
    }, { once: !0 });
    const w = typeof h == "number" ? Math.max(0, Math.min(d, Date.now() - h)) : 0, z = /* @__PURE__ */ s((P) => {
      const W = {};
      T && (W.color = b(Z, v, P)), S && (W.alpha = Y + (a - Y) * P), U.updateSource({ config: W }), R.initializeLightSource();
    }, "applyFrame");
    w > 0 && (F.t = w / d, z(F.t));
    const $ = await i.animate(
      [{ parent: F, attribute: "t", to: 1 }],
      {
        name: V,
        duration: d,
        easing: y,
        time: w,
        ontick: /* @__PURE__ */ s(() => z(F.t), "ontick")
      }
    );
    if ($ !== !1) {
      if (p != null && p.aborted) return !1;
      const P = {};
      T && (P.color = v.toHTML()), S && (P.alpha = a), U.updateSource({ config: P }), R.initializeLightSource();
    }
    if (m && $ !== !1 && U.canUserModify(game.user, "update")) {
      if (p != null && p.aborted) return !1;
      const P = {}, W = {};
      T && (P.color = Z.toHTML(), W["config.color"] = v.toHTML()), S && (P.alpha = Y, W["config.alpha"] = a), U.updateSource({ config: P }), await U.update(W);
    }
    return $ !== !1;
  }
  return s(N, "animateOne"), (await Promise.all(c.map(N))).every(Boolean);
}
s(Ws, "execute$2");
function Ks() {
  Ar({ type: "light-color", execute: Ws, validate: zs });
}
s(Ks, "registerLightColorTween");
const je = /* @__PURE__ */ new WeakMap();
function Js(e) {
  if ((Array.isArray(e.uuid) ? e.uuid : [e.uuid]).some((i) => !i || typeof i != "string"))
    throw new Error("light-state tween: 'uuid' is required (string or array of AmbientLight document UUIDs).");
  if (typeof e.enabled != "boolean")
    throw new Error("light-state tween: 'enabled' (boolean) is required.");
}
s(Js, "validate$1");
async function Ys(e, t = {}) {
  const { CanvasAnimation: i } = foundry.canvas.animation, { uuid: n, enabled: r } = e, o = Array.isArray(n) ? n : [n];
  if (o.length === 0)
    return console.warn("light-state tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: a = 2e3,
    easing: l = "easeInOutCosine",
    commit: c = !0,
    startEpochMS: d = null,
    signal: u = null
  } = t, m = ca(l);
  async function h(y) {
    var U, R, Z, Y;
    if (u != null && u.aborted) return !1;
    const T = await fromUuid(y);
    if (!T) return !1;
    const S = T.object;
    if (!S) return !1;
    const b = `ambient-state-tween:${y}`;
    i.terminateAnimation(b), u && u.addEventListener("abort", () => {
      i.terminateAnimation(b);
    }, { once: !0 });
    const v = je.get(T) ?? {
      hidden: T._source.hidden,
      alpha: ((U = T._source.config) == null ? void 0 : U.alpha) ?? 0.5
    };
    if (je.set(T, v), E(`light-state START ${r ? "ON" : "OFF"} | snap: ${JSON.stringify(v)} | _source.hidden=${T._source.hidden}, _source.config.alpha=${(R = T._source.config) == null ? void 0 : R.alpha}`), r && !v.hidden || !r && v.hidden)
      return je.delete(T), !0;
    const N = v.alpha, q = typeof d == "number" ? Math.max(0, Math.min(a, Date.now() - d)) : 0, B = /* @__PURE__ */ s((F) => {
      T.updateSource({ config: { alpha: F } }), S.initializeLightSource();
    }, "applyAlpha");
    if (r) {
      T.updateSource({ hidden: !1, config: { alpha: 0 } }), S.initializeLightSource(), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
      const F = { t: 0 };
      q > 0 && (F.t = q / a, B(N * F.t));
      const V = await i.animate(
        [{ parent: F, attribute: "t", to: 1 }],
        {
          name: b,
          duration: a,
          easing: m,
          time: q,
          ontick: /* @__PURE__ */ s(() => B(N * F.t), "ontick")
        }
      );
      return V !== !1 && !(u != null && u.aborted) && c && T.canUserModify(game.user, "update") ? (T.updateSource({ hidden: !0, config: { alpha: N } }), await T.update({ hidden: !1 }), E(`light-state FADE-IN committed. _source.hidden=${T._source.hidden}, _source.config.alpha=${(Z = T._source.config) == null ? void 0 : Z.alpha}`), je.delete(T)) : V === !1 || je.delete(T), V !== !1;
    } else {
      T.updateSource({ hidden: !1, config: { alpha: v.alpha } }), S.initializeLightSource();
      const F = { t: 0 };
      q > 0 && (F.t = q / a, B(N * (1 - F.t)));
      const V = await i.animate(
        [{ parent: F, attribute: "t", to: 1 }],
        {
          name: b,
          duration: a,
          easing: m,
          time: q,
          ontick: /* @__PURE__ */ s(() => B(N * (1 - F.t)), "ontick")
        }
      );
      return V !== !1 && !(u != null && u.aborted) && c && T.canUserModify(game.user, "update") ? (await T.update({ hidden: !0 }), T.updateSource({ config: { alpha: N } }), S.initializeLightSource(), E(`light-state FADE-OUT committed+restored. _source.hidden=${T._source.hidden}, _source.config.alpha=${(Y = T._source.config) == null ? void 0 : Y.alpha}`), je.delete(T)) : V === !1 || (T.updateSource({ hidden: !0, config: { alpha: N } }), S.initializeLightSource(), je.delete(T)), V !== !1;
    }
  }
  return s(h, "animateOne"), (await Promise.all(o.map(h))).every(Boolean);
}
s(Ys, "execute$1");
function Qs() {
  Ar({ type: "light-state", execute: Ys, validate: Js });
}
s(Qs, "registerLightStateTween");
var We, Qt, Xt, Zt, ei, ti, It;
const Fr = class Fr {
  /**
   * @param {AbortController} controller
   */
  constructor(t) {
    I(this, We);
    I(this, Qt);
    I(this, Xt);
    I(this, Zt);
    I(this, ei);
    I(this, ti, !1);
    I(this, It, null);
    A(this, We, t), A(this, Zt, new Promise((i) => {
      A(this, Qt, i);
    })), A(this, ei, new Promise((i) => {
      A(this, Xt, i);
    }));
  }
  /** @returns {Promise<boolean>} Resolves true (completed) or false (cancelled/failed). */
  get finished() {
    return g(this, Zt);
  }
  /** @returns {Promise<{status: string, [k: string]: unknown}>} */
  get result() {
    return g(this, ei);
  }
  /** @returns {boolean} */
  get cancelled() {
    return g(this, We).signal.aborted;
  }
  /** @returns {AbortSignal} */
  get signal() {
    return g(this, We).signal;
  }
  /** @returns {string} */
  get status() {
    return g(this, It) ? g(this, It).status : this.cancelled ? "cancelled" : "running";
  }
  /** Abort the timeline, triggering onCancel callbacks. */
  cancel(t = "cancelled") {
    g(this, We).signal.aborted || g(this, We).abort(t);
  }
  /**
   * Called internally by the execution engine when the timeline finishes.
   * @param {boolean} completed - true if all steps ran, false if cancelled
   */
  _resolve(t) {
    if (g(this, ti)) return;
    A(this, ti, !0);
    const i = typeof t == "boolean" ? { status: t ? "completed" : "cancelled" } : t ?? { status: "cancelled" };
    A(this, It, i), g(this, Qt).call(this, i.status === "completed"), g(this, Xt).call(this, i);
  }
};
We = new WeakMap(), Qt = new WeakMap(), Xt = new WeakMap(), Zt = new WeakMap(), ei = new WeakMap(), ti = new WeakMap(), It = new WeakMap(), s(Fr, "TimelineHandle");
let Tr = Fr;
const Et = /* @__PURE__ */ new Map();
function Xs(e, t) {
  const i = Et.get(e);
  i && !i.cancelled && i.cancel("replaced-by-name"), Et.set(e, t), t.finished.then(() => {
    Et.get(e) === t && Et.delete(e);
  });
}
s(Xs, "registerTimeline");
function da(e) {
  const t = Et.get(e);
  return t && !t.cancelled ? (t.cancel("cancelled-by-name"), !0) : !1;
}
s(da, "cancelTimeline");
function Zs(e) {
  return Et.get(e);
}
s(Zs, "getTimeline");
function el(e, t) {
  return e <= 0 ? Promise.resolve() : new Promise((i, n) => {
    if (t.aborted) return n(t.reason);
    const r = setTimeout(i, e);
    t.addEventListener("abort", () => {
      clearTimeout(r), n(t.reason);
    }, { once: !0 });
  });
}
s(el, "cancellableDelay");
var ve, Ke, ii, ni;
const Hr = class Hr {
  constructor(t) {
    /** @type {TweenTimeline} */
    I(this, ve);
    /** @type {Array<{ type: string, params: object, opts?: object, detach: boolean }>} */
    I(this, Ke, []);
    /** @type {Function|null} */
    I(this, ii, null);
    /** @type {Function|null} */
    I(this, ni, null);
    A(this, ve, t);
  }
  /**
   * Add a tween entry to this step.
   * @param {string} type  Registered tween type name
   * @param {object} params  Type-specific parameters
   * @param {object} [opts]  Options (durationMS, easing, etc.)
   * @returns {StepBuilder} this
   */
  add(t, i, n) {
    return g(this, Ke).push({ type: t, params: i, opts: n ?? {}, detach: !1 }), this;
  }
  /**
   * Mark the last entry as fire-and-forget (does not block step progression).
   * @returns {StepBuilder} this
   */
  detach() {
    if (g(this, Ke).length === 0)
      throw new Error("StepBuilder.detach(): no entry to detach.");
    return g(this, Ke)[g(this, Ke).length - 1].detach = !0, this;
  }
  /**
   * Callback invoked before this step's tweens start.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  before(t) {
    return A(this, ii, t), this;
  }
  /**
   * Callback invoked after this step's awaited tweens complete.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  after(t) {
    return A(this, ni, t), this;
  }
  // ── Delegation to parent TweenTimeline for fluent chaining ──
  /** Start a new step (finalizes this one). */
  step() {
    return g(this, ve).step();
  }
  /** Insert a delay between steps. */
  delay(t) {
    return g(this, ve).delay(t);
  }
  /** Register onComplete callback. */
  onComplete(t) {
    return g(this, ve).onComplete(t);
  }
  /** Register onCancel callback. */
  onCancel(t) {
    return g(this, ve).onCancel(t);
  }
  /** Register onError callback. */
  onError(t) {
    return g(this, ve).onError(t);
  }
  /** Execute the timeline. */
  run(t) {
    return g(this, ve).run(t);
  }
  /** Serialize the timeline. */
  toJSON() {
    return g(this, ve).toJSON();
  }
  // ── Internal access ──
  /** @returns {{ entries: Array, before: Function|null, after: Function|null }} */
  _finalize() {
    return {
      entries: g(this, Ke),
      before: g(this, ii),
      after: g(this, ni)
    };
  }
};
ve = new WeakMap(), Ke = new WeakMap(), ii = new WeakMap(), ni = new WeakMap(), s(Hr, "StepBuilder");
let br = Hr;
var he, Ee, ut, Je, ri, oi, ai, si, Q, Ut, fa, ga, Ni, ke, it;
const $r = class $r {
  constructor() {
    I(this, Q);
    /** @type {string|null} */
    I(this, he, null);
    /** @type {string} */
    I(this, Ee, ge.ABORT);
    /** @type {Array<{ kind: "step", data: object } | { kind: "delay", ms: number }>} */
    I(this, ut, []);
    /** @type {StepBuilder|null} */
    I(this, Je, null);
    /** @type {Function|null} */
    I(this, ri, null);
    /** @type {Function|null} */
    I(this, oi, null);
    /** @type {Function|null} */
    I(this, ai, null);
    /** @type {Function|null} */
    I(this, si, null);
  }
  /**
   * Register this timeline in the named registry. Starting a new
   * timeline with the same name cancels the previous one.
   * @param {string} name
   * @returns {TweenTimeline} this
   */
  name(t) {
    return A(this, he, t), this;
  }
  /**
   * Set the error policy for step execution.
   * @param {"abort"|"continue"} policy
   * @returns {TweenTimeline} this
   */
  errorPolicy(t) {
    if (t !== ge.ABORT && t !== ge.CONTINUE)
      throw new Error(`Invalid error policy: "${t}". Use "abort" or "continue".`);
    return A(this, Ee, t), this;
  }
  /**
   * Start a new step. Finalizes the previous step if one is open.
   * @returns {StepBuilder}
   */
  step() {
    return C(this, Q, Ut).call(this), A(this, Je, new br(this)), g(this, Je);
  }
  /**
   * Insert a delay (in ms) between the previous step and the next.
   * @param {number} ms
   * @returns {TweenTimeline} this
   */
  delay(t) {
    return C(this, Q, Ut).call(this), g(this, ut).push({ kind: "delay", ms: t }), this;
  }
  /**
   * Callback invoked before the first step runs.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  beforeAll(t) {
    return A(this, ri, t), this;
  }
  /**
   * Callback invoked on successful completion.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onComplete(t) {
    return A(this, oi, t), this;
  }
  /**
   * Callback invoked on cancellation (mutually exclusive with onComplete).
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onCancel(t) {
    return A(this, ai, t), this;
  }
  /**
   * Callback invoked on runtime failure (mutually exclusive with onComplete/onCancel).
   * @param {(outcome: object) => void} fn
   * @returns {TweenTimeline} this
   */
  onError(t) {
    return A(this, si, t), this;
  }
  /**
   * Execute the timeline.
   * @param {object} [opts]
   * @param {boolean} [opts.commit]     Default true for GM, false for socket receivers
   * @param {number}  [opts.startEpochMS]  For socket sync
   * @param {boolean} [opts.broadcast]  Default game.user.isGM, gates socket emission
   * @param {AbortSignal} [opts.signal] Parent signal for nested timeline cancellation
   * @returns {TimelineHandle}
   */
  run(t = {}) {
    C(this, Q, Ut).call(this);
    const i = new AbortController();
    t.signal && (t.signal.aborted ? i.abort(t.signal.reason ?? "parent-aborted") : t.signal.addEventListener("abort", () => {
      i.signal.aborted || i.abort(t.signal.reason ?? "parent-aborted");
    }, { once: !0 }));
    const n = new Tr(i);
    g(this, he) && Xs(g(this, he), n);
    const r = t.broadcast ?? game.user.isGM, o = t.commit ?? game.user.isGM, a = t.startEpochMS ?? Date.now();
    return r && g(this, he) && Ai(la, {
      name: g(this, he),
      data: this.toJSON(),
      startEpochMS: a
    }), C(this, Q, fa).call(this, n, { commit: o, startEpochMS: a }).then((l) => {
      var c, d, u;
      n._resolve(l), l.status === Pt.COMPLETED ? (c = g(this, oi)) == null || c.call(this) : l.status === Pt.CANCELLED ? ((d = g(this, ai)) == null || d.call(this), r && g(this, he) && Ai(hr, {
        name: g(this, he),
        reason: l.reason
      })) : ((u = g(this, si)) == null || u.call(this, l), r && g(this, he) && Ai(hr, {
        name: g(this, he),
        reason: "failed"
      }));
    }), n;
  }
  /**
   * Serialize the timeline to a JSON-safe object (steps/delays only, no hooks).
   * @returns {object}
   */
  toJSON() {
    C(this, Q, Ut).call(this);
    const t = [];
    for (const n of g(this, ut))
      if (n.kind === "delay")
        t.push({ delay: n.ms });
      else {
        const r = n.data.entries.map((o) => {
          const a = { type: o.type, params: o.params };
          return Object.keys(o.opts).length > 0 && (a.opts = o.opts), o.detach && (a.detach = !0), a;
        });
        t.push(r);
      }
    const i = { timeline: t };
    return g(this, he) && (i.name = g(this, he)), g(this, Ee) !== ge.ABORT && (i.errorPolicy = g(this, Ee)), i;
  }
};
he = new WeakMap(), Ee = new WeakMap(), ut = new WeakMap(), Je = new WeakMap(), ri = new WeakMap(), oi = new WeakMap(), ai = new WeakMap(), si = new WeakMap(), Q = new WeakSet(), // ── Private ─────────────────────────────────────────────────────────
Ut = /* @__PURE__ */ s(function() {
  g(this, Je) && (g(this, ut).push({ kind: "step", data: g(this, Je)._finalize() }), A(this, Je, null));
}, "#finalizeCurrentStep"), fa = /* @__PURE__ */ s(async function(t, { commit: i, startEpochMS: n }) {
  const r = t.signal, o = [];
  let a = -1;
  try {
    if (r.aborted) return C(this, Q, ke).call(this, r.reason);
    const l = await C(this, Q, Ni).call(this, g(this, ri), Ve.BEFORE_ALL, null);
    if (l) {
      if (g(this, Ee) === ge.ABORT) return l;
      o.push(l);
    }
    let c = 0;
    const d = [];
    for (const u of g(this, ut)) {
      if (r.aborted) return C(this, Q, ke).call(this, r.reason);
      if (u.kind === "delay") {
        try {
          await el(u.ms, r);
        } catch {
          return C(this, Q, ke).call(this, r.reason);
        }
        c += u.ms;
        continue;
      }
      a += 1;
      const { entries: m, before: h, after: p } = u.data, y = await C(this, Q, Ni).call(this, h, Ve.BEFORE_STEP, a);
      if (y) {
        if (g(this, Ee) === ge.ABORT) return y;
        o.push(y);
        continue;
      }
      if (r.aborted) return C(this, Q, ke).call(this, r.reason);
      const T = [];
      let S = 0;
      for (const N of m) {
        const q = Ln(N.type);
        if (!q) {
          const Z = C(this, Q, it).call(this, new Error(`TweenTimeline: unknown tween type "${N.type}"`), Ve.ENTRY, a, N.type);
          if (g(this, Ee) === ge.ABORT) return Z;
          o.push(Z), console.warn(Z.error.message);
          continue;
        }
        const B = {
          ...N.opts,
          commit: i,
          startEpochMS: n + c,
          signal: r
        }, U = B.durationMS ?? 2e3, R = Promise.resolve().then(() => q.execute(N.params, B)).then((Z) => Z === !1 ? {
          ok: !1,
          failure: C(this, Q, it).call(this, new Error("Tween entry returned false."), Ve.ENTRY, a, N.type)
        } : { ok: !0 }).catch((Z) => ({
          ok: !1,
          failure: C(this, Q, it).call(this, Z, Ve.ENTRY, a, N.type)
        }));
        N.detach ? d.push(R) : (T.push(R), S = Math.max(S, U));
      }
      const b = await C(this, Q, ga).call(this, T, r);
      if (b === null) return C(this, Q, ke).call(this, r.reason);
      for (const N of b)
        if (!N.ok) {
          if (g(this, Ee) === ge.ABORT) return N.failure;
          o.push(N.failure), console.warn("TweenTimeline: entry failed:", N.failure.error);
        }
      const v = await C(this, Q, Ni).call(this, p, Ve.AFTER_STEP, a);
      if (v) {
        if (g(this, Ee) === ge.ABORT) return v;
        o.push(v);
      }
      if (r.aborted) return C(this, Q, ke).call(this, r.reason);
      c += S;
    }
    if (!r.aborted) {
      const u = await Promise.allSettled(d);
      for (const m of u)
        if (m.status === "rejected") {
          const h = C(this, Q, it).call(this, m.reason, Ve.ENTRY, a);
          if (g(this, Ee) === ge.ABORT) return h;
          o.push(h);
        }
    }
    return r.aborted ? C(this, Q, ke).call(this, r.reason) : {
      status: Pt.COMPLETED,
      ...o.length > 0 ? { errors: o } : {}
    };
  } catch (l) {
    return r.aborted ? C(this, Q, ke).call(this, r.reason) : (console.error("TweenTimeline execution error:", l), C(this, Q, it).call(this, l, Ve.RUNTIME, a));
  }
}, "#execute"), /**
 * @param {Array<Promise<{ok: boolean, failure?: object}>>} stepPromises
 * @param {AbortSignal} signal
 * @returns {Promise<Array<{ok: boolean, failure?: object}>|null>}
 */
ga = /* @__PURE__ */ s(function(t, i) {
  return t.length === 0 ? Promise.resolve([]) : i.aborted ? Promise.resolve(null) : new Promise((n, r) => {
    const o = /* @__PURE__ */ s(() => n(null), "onAbort");
    i.addEventListener("abort", o, { once: !0 }), Promise.all(t).then((a) => {
      i.removeEventListener("abort", o), n(a);
    }).catch((a) => {
      i.removeEventListener("abort", o), r(a);
    });
  });
}, "#waitForStep"), Ni = /* @__PURE__ */ s(async function(t, i, n) {
  if (!t) return null;
  try {
    return await t(), null;
  } catch (r) {
    const o = C(this, Q, it).call(this, r, i, n ?? void 0);
    return g(this, Ee) === ge.CONTINUE && console.warn(`TweenTimeline: hook failure in ${i}:`, r), o;
  }
}, "#runHook"), /** @param {unknown} reason */
ke = /* @__PURE__ */ s(function(t) {
  let i;
  return typeof t == "string" ? i = t : t instanceof Error && (i = t.message), {
    status: Pt.CANCELLED,
    ...i ? { reason: i } : {}
  };
}, "#cancelledOutcome"), /**
 * @param {unknown} err
 * @param {string} phase
 * @param {number} [stepIndex]
 * @param {string} [entryType]
 */
it = /* @__PURE__ */ s(function(t, i, n, r) {
  const o = t instanceof Error ? t : new Error(String(t));
  return {
    status: Pt.FAILED,
    error: o,
    phase: i,
    ...typeof n == "number" ? { stepIndex: n } : {},
    ...r ? { entryType: r } : {}
  };
}, "#failedOutcome"), s($r, "TweenTimeline");
let Ui = $r;
function Nr(e) {
  if (!e || typeof e != "object")
    throw new Error("Sequence JSON: data must be an object.");
  if (!Array.isArray(e.timeline))
    throw new Error("Sequence JSON: 'timeline' must be an array.");
  if (e.name != null && typeof e.name != "string")
    throw new Error("Sequence JSON: 'name' must be a string.");
  if (e.errorPolicy != null && e.errorPolicy !== ge.ABORT && e.errorPolicy !== ge.CONTINUE)
    throw new Error(`Sequence JSON: 'errorPolicy' must be "abort" or "continue".`);
  for (let t = 0; t < e.timeline.length; t++) {
    const i = e.timeline[t];
    if (!Array.isArray(i)) {
      if (typeof i != "object" || typeof i.delay != "number" || i.delay < 0)
        throw new Error(`Sequence JSON: timeline[${t}] must be a step array or { delay: <ms> }.`);
      continue;
    }
    if (i.length === 0)
      throw new Error(`Sequence JSON: timeline[${t}] is an empty step.`);
    for (let n = 0; n < i.length; n++) {
      const r = i[n];
      if (!r || typeof r != "object")
        throw new Error(`Sequence JSON: timeline[${t}][${n}] must be an object.`);
      if (typeof r.type != "string" || !r.type)
        throw new Error(`Sequence JSON: timeline[${t}][${n}].type must be a non-empty string.`);
      if (r.params != null && typeof r.params != "object")
        throw new Error(`Sequence JSON: timeline[${t}][${n}].params must be an object.`);
      if (r.opts != null && typeof r.opts != "object")
        throw new Error(`Sequence JSON: timeline[${t}][${n}].opts must be an object.`);
      if (r.detach != null && typeof r.detach != "boolean")
        throw new Error(`Sequence JSON: timeline[${t}][${n}].detach must be a boolean.`);
    }
  }
}
s(Nr, "validateSequenceJSON");
function ma(e) {
  Nr(e);
  for (let t = 0; t < e.timeline.length; t++) {
    const i = e.timeline[t];
    if (Array.isArray(i))
      for (let n = 0; n < i.length; n++) {
        const r = i[n];
        try {
          xs(r.type, r.params ?? {});
        } catch (o) {
          throw new Error(`Sequence JSON: timeline[${t}][${n}] failed semantic validation: ${o.message}`);
        }
      }
  }
}
s(ma, "validateSequenceSemantics");
function Dr(e, t = {}) {
  Nr(e), t.validateSemantics && ma(e);
  const i = new Ui();
  e.name && i.name(e.name), e.errorPolicy && i.errorPolicy(e.errorPolicy);
  for (const n of e.timeline) {
    if (!Array.isArray(n)) {
      i.delay(n.delay);
      continue;
    }
    const r = i.step();
    for (const o of n)
      r.add(o.type, o.params ?? {}, o.opts), o.detach && r.detach();
  }
  return i;
}
s(Dr, "compileSequence");
function tl(e) {
  Nr(e), ma(e);
}
s(tl, "validate");
async function il(e, t = {}) {
  return Dr(e, { validateSemantics: !0 }).run({
    broadcast: !1,
    commit: t.commit,
    startEpochMS: t.startEpochMS,
    signal: t.signal
  }).finished;
}
s(il, "execute");
function nl() {
  Ar({ type: "sequence", execute: il, validate: tl });
}
s(nl, "registerSequenceTween");
async function rl(e, t, i = {}) {
  if (!game.user.isGM)
    return ui.notifications.warn("Only the GM can dispatch tweens."), !1;
  const n = Ln(e);
  if (!n)
    throw new Error(`Unknown tween type: "${e}". Registered types: ${pr().join(", ")}`);
  n.validate(t);
  const { durationMS: r = 2e3, easing: o = "easeInOutCosine", commit: a = !0 } = i, l = Date.now();
  return Ai(sa, {
    type: e,
    params: t,
    durationMS: r,
    easing: o,
    startEpochMS: l,
    commit: !1
  }), n.execute(t, { durationMS: r, easing: o, commit: a, startEpochMS: l });
}
s(rl, "dispatchTween");
function ol(e) {
  const { type: t, params: i, durationMS: n, easing: r, startEpochMS: o, commit: a } = e ?? {}, l = Ln(t);
  if (!l) {
    console.warn(`[${O}] Received unknown tween type over socket: "${t}"`);
    return;
  }
  l.execute(i, {
    durationMS: n,
    easing: r,
    commit: a ?? !1,
    startEpochMS: o
  });
}
s(ol, "handleTweenSocketMessage");
Ks();
Qs();
nl();
Mr(sa, ol);
Mr(la, al);
Mr(hr, sl);
function al(e) {
  const { data: t, startEpochMS: i } = e ?? {};
  if (!t) {
    console.warn(`[${O}] Received empty tween-sequence socket message.`);
    return;
  }
  try {
    Dr(t, { validateSemantics: !0 }).run({ commit: !1, startEpochMS: i, broadcast: !1 });
  } catch (n) {
    console.error(`[${O}] Failed to run received tween sequence:`, n);
  }
}
s(al, "handleSequenceSocketMessage");
function sl(e) {
  const { name: t } = e ?? {};
  t && da(t);
}
s(sl, "handleSequenceCancelMessage");
function ll() {
  Hooks.once("ready", () => {
    Ps();
    const e = game.modules.get(O);
    e.api || (e.api = {}), e.api.tween = {
      dispatch: rl,
      types: pr,
      Timeline: Ui,
      ErrorPolicy: ge,
      compileSequence: Dr,
      cancelTimeline: da,
      getTimeline: Zs
    }, console.log(`[${O}] Tween API registered. Types: ${pr().join(", ")}`);
  });
}
s(ll, "registerTweenHooks");
ll();
//# sourceMappingURL=eidolon-utilities.js.map
