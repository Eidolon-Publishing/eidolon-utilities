var Di = Object.defineProperty;
var Yr = Object.getPrototypeOf;
var Qr = Reflect.get;
var Fi = (e) => {
  throw TypeError(e);
};
var Xr = (e, t, n) => t in e ? Di(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var s = (e, t) => Di(e, "name", { value: t, configurable: !0 });
var qe = (e, t, n) => Xr(e, typeof t != "symbol" ? t + "" : t, n), Nn = (e, t, n) => t.has(e) || Fi("Cannot " + n);
var v = (e, t, n) => (Nn(e, t, "read from private field"), n ? n.call(e) : t.get(e)), M = (e, t, n) => t.has(e) ? Fi("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), D = (e, t, n, i) => (Nn(e, t, "write to private field"), i ? i.call(e, n) : t.set(e, n), n), S = (e, t, n) => (Nn(e, t, "access private method"), n);
var it = (e, t, n) => Qr(Yr(e), n, t);
const O = "eidolon-utilities", jt = "timeTriggerActive", Hn = "timeTriggerHideWindow", $n = "timeTriggerShowPlayerWindow", Vn = "timeTriggerAllowRealTime", er = "timeTriggers", _t = "timeTriggerHistory", kn = "debug", xn = "timeFormat", Un = "manageTime", jn = "secondsPerRound";
const Zr = [-30, -15, -5, 5, 15, 30], st = 1440 * 60, Rt = "playSound", Ct = 6;
function f(e, t) {
  var n, i;
  return (i = (n = game.i18n) == null ? void 0 : n.has) != null && i.call(n, e) ? game.i18n.localize(e) : t;
}
s(f, "localize");
function qt(e) {
  return typeof e != "string" ? "" : e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
s(qt, "escapeHtml");
function Ze(e) {
  var t;
  return e == null ? e : (t = foundry == null ? void 0 : foundry.utils) != null && t.duplicate ? foundry.utils.duplicate(e) : JSON.parse(JSON.stringify(e));
}
s(Ze, "duplicateData");
function eo() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
s(eo, "generateTriggerId");
function tr(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  if (!t) return null;
  const n = t.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (!n) return null;
  const i = Number(n[1]), r = Number(n[2]), o = n[3] !== void 0 ? Number(n[3]) : 0;
  return !Number.isInteger(i) || !Number.isInteger(r) || !Number.isInteger(o) || i < 0 || i > 23 || r < 0 || r > 59 || o < 0 || o > 59 ? null : i * 3600 + r * 60 + o;
}
s(tr, "parseTriggerTimeToSeconds");
function vt() {
  var e, t;
  return ((e = game.scenes) == null ? void 0 : e.current) ?? ((t = game.scenes) == null ? void 0 : t.active) ?? null;
}
s(vt, "getActiveScene");
function Ie(e) {
  return (e == null ? void 0 : e.object) ?? (e == null ? void 0 : e.document) ?? null;
}
s(Ie, "getSceneFromApplication");
function ae(e) {
  return e && typeof e.getFlag == "function" && typeof e.setFlag == "function";
}
s(ae, "hasSceneDocument");
const qn = /* @__PURE__ */ new Set(), Bn = /* @__PURE__ */ new Set(), Gn = /* @__PURE__ */ new Set(), zn = /* @__PURE__ */ new Set();
let et = !1, Lt = !1, Bt = Ct, Gt = "12h", Pi = !1;
function Mn(e) {
  et = !!e;
  for (const t of qn)
    try {
      t(et);
    } catch (n) {
      console.error(`${O} | Debug change handler failed`, n);
    }
}
s(Mn, "notifyDebugChange");
function Dn(e) {
  Lt = !!e;
  for (const t of Bn)
    try {
      t(Lt);
    } catch (n) {
      console.error(`${O} | Manage time change handler failed`, n);
    }
}
s(Dn, "notifyManageTimeChange");
function nr(e) {
  return e === "24h" ? "24h" : "12h";
}
s(nr, "normalizeTimeFormatValue");
function vi(e) {
  const t = Number(e);
  return !Number.isFinite(t) || t <= 0 ? Ct : t;
}
s(vi, "normalizeSecondsPerRoundValue");
function Fn(e) {
  const t = vi(e);
  Bt = t;
  for (const n of Gn)
    try {
      n(t);
    } catch (i) {
      console.error(`${O} | Seconds-per-round change handler failed`, i);
    }
}
s(Fn, "notifySecondsPerRoundChange");
function Pn(e) {
  const t = nr(e);
  Gt = t;
  for (const n of zn)
    try {
      n(t);
    } catch (i) {
      console.error(`${O} | Time format change handler failed`, i);
    }
}
s(Pn, "notifyTimeFormatChange");
function to() {
  var t;
  if (Pi) return;
  if (Pi = !0, !((t = game == null ? void 0 : game.settings) != null && t.register)) {
    console.warn(
      `${O} | game.settings.register is unavailable. Module settings could not be registered.`
    );
    return;
  }
  const e = typeof game.settings.registerChange == "function";
  game.settings.register(O, kn, {
    name: f("EIDOLON.TimeTrigger.DebugSettingName", "Enable debug logging"),
    hint: f(
      "EIDOLON.TimeTrigger.DebugSettingHint",
      "Write detailed time-trigger diagnostics to the browser console."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: e ? void 0 : Mn
  }), e && game.settings.registerChange(O, kn, Mn), et = Oi(), Mn(et), game.settings.register(O, Un, {
    name: f("EIDOLON.TimeTrigger.ManageTimeSettingName", "Manage Game Time"),
    hint: f(
      "EIDOLON.TimeTrigger.ManageTimeSettingHint",
      "Allow Eidolon Utilities to advance world time automatically while the game is unpaused. Warning: This may conflict with other time-management modules."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: e ? void 0 : Dn
  }), e && game.settings.registerChange(O, Un, Dn), Lt = io(), Dn(Lt), game.settings.register(O, jn, {
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
    default: Ct,
    range: { min: 1, max: 3600, step: 1 },
    onChange: e ? void 0 : Fn
  }), e && game.settings.registerChange(
    O,
    jn,
    Fn
  ), Bt = vi(ro()), Fn(Bt), game.settings.register(O, xn, {
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
    onChange: e ? void 0 : Pn
  }), e && game.settings.registerChange(O, xn, Pn), Gt = nr(ir()), Pn(Gt);
}
s(to, "registerTimeTriggerSettings");
function Oi() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get)
      return !!game.settings.get(O, kn);
  } catch (t) {
    console.error(`${O} | Failed to read debug setting`, t);
  }
  return !1;
}
s(Oi, "getDebugSetting");
function no() {
  return et = Oi(), et;
}
s(no, "refreshDebugSettingCache");
function io() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get)
      return !!game.settings.get(O, Un);
  } catch (t) {
    console.error(`${O} | Failed to read manage time setting`, t);
  }
  return !1;
}
s(io, "getManageTimeSetting");
function ir() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get)
      return game.settings.get(O, xn) === "24h" ? "24h" : "12h";
  } catch (t) {
    console.error(`${O} | Failed to read time format setting`, t);
  }
  return "12h";
}
s(ir, "getTimeFormatSetting");
function ro() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get) {
      const t = game.settings.get(O, jn);
      return vi(t);
    }
  } catch (t) {
    console.error(`${O} | Failed to read seconds-per-round setting`, t);
  }
  return Ct;
}
s(ro, "getSecondsPerRoundSetting");
function oo(e) {
  if (typeof e != "function")
    return () => {
    };
  qn.add(e);
  try {
    e(et);
  } catch (t) {
    console.error(`${O} | Debug change handler failed`, t);
  }
  return () => {
    qn.delete(e);
  };
}
s(oo, "onDebugSettingChange");
function rr(e) {
  if (typeof e != "function")
    return () => {
    };
  Bn.add(e);
  try {
    e(Lt);
  } catch (t) {
    console.error(`${O} | Manage time change handler failed`, t);
  }
  return () => {
    Bn.delete(e);
  };
}
s(rr, "onManageTimeSettingChange");
function Li(e) {
  if (typeof e != "function")
    return () => {
    };
  zn.add(e);
  try {
    e(Gt);
  } catch (t) {
    console.error(`${O} | Time format change handler failed`, t);
  }
  return () => {
    zn.delete(e);
  };
}
s(Li, "onTimeFormatSettingChange");
function so(e) {
  if (typeof e != "function")
    return () => {
    };
  Gn.add(e);
  try {
    e(Bt);
  } catch (t) {
    console.error(`${O} | Seconds-per-round change handler failed`, t);
  }
  return () => {
    Gn.delete(e);
  };
}
s(so, "onSecondsPerRoundSettingChange");
let In = !1, Wn = !1;
function Kn(e) {
  In = !!e;
}
s(Kn, "updateDebugState");
function or() {
  Wn || (Wn = !0, Kn(Oi()), oo((e) => {
    Kn(e), console.info(`${O} | Debug ${In ? "enabled" : "disabled"}`);
  }));
}
s(or, "ensureInitialized");
function Ii() {
  return Wn || or(), In;
}
s(Ii, "shouldLog");
function sr(e) {
  if (!e.length)
    return [`${O} |`];
  const [t, ...n] = e;
  return typeof t == "string" ? [`${O} | ${t}`, ...n] : [`${O} |`, t, ...n];
}
s(sr, "formatArgs");
function ao() {
  or();
}
s(ao, "initializeDebug");
function lo() {
  return Kn(no()), In;
}
s(lo, "syncDebugState");
function T(...e) {
  Ii() && console.debug(...sr(e));
}
s(T, "debugLog");
function ft(...e) {
  Ii() && console.group(...sr(e));
}
s(ft, "debugGroup");
function ke() {
  Ii() && console.groupEnd();
}
s(ke, "debugGroupEnd");
function at(e) {
  var r;
  const t = (r = e == null ? void 0 : e.getFlag) == null ? void 0 : r.call(e, O, er);
  if (!t) return [];
  const n = Ze(t), i = Array.isArray(n) ? n : [];
  return T("Loaded time triggers", {
    sceneId: (e == null ? void 0 : e.id) ?? null,
    count: i.length
  }), i;
}
s(at, "getTimeTriggers");
async function ar(e, t) {
  e != null && e.setFlag && (T("Persisting time triggers", {
    sceneId: e.id,
    count: Array.isArray(t) ? t.length : 0
  }), await e.setFlag(O, er, t));
}
s(ar, "setTimeTriggers");
function co(e) {
  var r;
  const t = (r = e == null ? void 0 : e.getFlag) == null ? void 0 : r.call(e, O, _t);
  if (!t) return {};
  const n = Ze(t);
  if (!n || typeof n != "object") return {};
  const i = {};
  for (const [o, a] of Object.entries(n))
    typeof a == "number" && Number.isFinite(a) && (i[o] = a);
  return T("Loaded time trigger history", {
    sceneId: (e == null ? void 0 : e.id) ?? null,
    keys: Object.keys(i)
  }), i;
}
s(co, "getTimeTriggerHistory");
async function _n(e, t) {
  var c, u, d, h;
  if (!e) return;
  const n = {};
  if (t && typeof t == "object")
    for (const [m, p] of Object.entries(t))
      typeof p == "number" && Number.isFinite(p) && (n[m] = p);
  const i = ((c = e.getFlag) == null ? void 0 : c.call(e, O, _t)) ?? {}, r = {};
  if (i && typeof i == "object")
    for (const [m, p] of Object.entries(i))
      typeof p == "number" && Number.isFinite(p) && (r[m] = p);
  const o = Object.keys(n), a = Object.keys(r);
  if (typeof ((u = foundry == null ? void 0 : foundry.utils) == null ? void 0 : u.deepEqual) == "function" ? foundry.utils.deepEqual(r, n) : JSON.stringify(r) === JSON.stringify(n)) {
    T("Skip history update because state is unchanged", {
      sceneId: (e == null ? void 0 : e.id) ?? null
    });
    return;
  }
  T("Updating time trigger history", {
    sceneId: (e == null ? void 0 : e.id) ?? null,
    keys: o,
    removedKeys: a.filter((m) => !o.includes(m))
  });
  try {
    a.length && typeof e.unsetFlag == "function" && await e.unsetFlag(O, _t), o.length && await e.setFlag(O, _t, n);
  } catch (m) {
    console.error(`${O} | Failed to persist time trigger history`, m), (h = (d = ui.notifications) == null ? void 0 : d.error) == null || h.call(
      d,
      f(
        "EIDOLON.TimeTrigger.HistoryPersistError",
        "Failed to persist the scene's time trigger history."
      )
    );
  }
}
s(_n, "updateTimeTriggerHistory");
const zt = /* @__PURE__ */ new Map(), _i = /* @__PURE__ */ new Set();
function uo(e) {
  if (!(e != null && e.id))
    throw new Error(`${O} | Action definitions require an id.`);
  if (zt.has(e.id))
    throw new Error(`${O} | Duplicate time trigger action id: ${e.id}`);
  zt.set(e.id, {
    ...e
  }), T("Registered time trigger action", { actionId: e.id });
}
s(uo, "registerAction");
function At(e) {
  return zt.get(e) ?? null;
}
s(At, "getAction");
function fo(e) {
  const t = At(e);
  return t ? typeof t.label == "function" ? t.label() : t.label : e;
}
s(fo, "getActionLabel");
function Ri() {
  return Array.from(zt.values());
}
s(Ri, "listActions");
async function lr(e, t) {
  var i, r;
  const n = At(t == null ? void 0 : t.action);
  if (!n || typeof n.execute != "function") {
    const o = f(
      "EIDOLON.TimeTrigger.UnknownAction",
      "Encountered an unknown time trigger action and skipped it."
    );
    (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, o), console.warn(`${O} | Unknown time trigger action`, t), T("Encountered unknown time trigger action", {
      triggerId: (t == null ? void 0 : t.id) ?? null,
      actionId: (t == null ? void 0 : t.action) ?? null
    });
    return;
  }
  T("Executing action handler", {
    actionId: n.id,
    triggerId: (t == null ? void 0 : t.id) ?? null,
    sceneId: (e == null ? void 0 : e.id) ?? null
  }), await n.execute({ scene: e, trigger: t });
}
s(lr, "executeTriggerAction");
function go(e) {
  const t = At(e == null ? void 0 : e.action);
  return !t || typeof t.buildSummaryParts != "function" ? [] : t.buildSummaryParts({ trigger: e, escapeHtml: qt, localize: f }) ?? [];
}
s(go, "buildActionSummaryParts");
function mo(e) {
  const t = At(e == null ? void 0 : e.action);
  return !t || typeof t.buildFormContent != "function" ? "" : t.buildFormContent({ trigger: e, escapeHtml: qt, localize: f }) ?? "";
}
s(mo, "buildActionFormSection");
function ho(e, t) {
  const n = At(e == null ? void 0 : e.action);
  !n || typeof n.prepareFormData != "function" || n.prepareFormData({ trigger: e, formData: t });
}
s(ho, "applyActionFormData");
function yo(e, t, n) {
  var o, a;
  const i = `${(e == null ? void 0 : e.id) ?? "unknown"}:${(t == null ? void 0 : t.id) ?? (t == null ? void 0 : t.action) ?? "unknown"}:${n}`;
  if (_i.has(i)) return;
  _i.add(i);
  const r = f(
    "EIDOLON.TimeTrigger.MissingDataWarning",
    "A scene time trigger is missing required data and was skipped."
  );
  (a = (o = ui.notifications) == null ? void 0 : o.warn) == null || a.call(o, r), console.warn(`${O} | Missing trigger data (${n})`, { scene: e == null ? void 0 : e.id, trigger: t });
}
s(yo, "warnMissingTriggerData");
async function po({ scene: e, trigger: t }) {
  var o, a, l, c, u;
  const n = (l = (a = (o = t == null ? void 0 : t.data) == null ? void 0 : o.path) == null ? void 0 : a.trim) == null ? void 0 : l.call(a);
  if (!n) {
    yo(e, t, "missing-audio-path");
    return;
  }
  const i = {
    src: n,
    autoplay: !0,
    loop: !1
  }, r = (() => {
    var d, h, m, p, g;
    return typeof ((h = (d = foundry == null ? void 0 : foundry.audio) == null ? void 0 : d.AudioHelper) == null ? void 0 : h.play) == "function" ? foundry.audio.AudioHelper.play(i, !0) : typeof ((p = (m = game == null ? void 0 : game.audio) == null ? void 0 : m.constructor) == null ? void 0 : p.play) == "function" ? game.audio.constructor.play(i, !0) : typeof ((g = game == null ? void 0 : game.audio) == null ? void 0 : g.play) == "function" ? game.audio.play(i, !0) : null;
  })();
  if (!r) {
    console.error(`${O} | Foundry audio helper is unavailable`), (u = (c = ui.notifications) == null ? void 0 : c.error) == null || u.call(
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
s(po, "executePlaySoundAction");
uo({
  id: Rt,
  label: /* @__PURE__ */ s(() => f("EIDOLON.TimeTrigger.ActionPlaySound", "Play Sound"), "label"),
  execute: po,
  buildSummaryParts: /* @__PURE__ */ s(({ trigger: e, escapeHtml: t, localize: n }) => {
    var r;
    return (r = e == null ? void 0 : e.data) != null && r.path ? [`${t(n("EIDOLON.TimeTrigger.TriggerSound", "Sound File"))}: ${t(e.data.path)}`] : [];
  }, "buildSummaryParts"),
  buildFormContent: /* @__PURE__ */ s(({ trigger: e, escapeHtml: t, localize: n }) => {
    var l;
    const i = t(n("EIDOLON.TimeTrigger.TriggerSound", "Sound File")), r = t(
      n("EIDOLON.TimeTrigger.TriggerChooseFile", "Select File")
    ), o = t(
      n(
        "EIDOLON.TimeTrigger.TriggerSoundNotes",
        "Select or upload the audio file that should play when this trigger fires."
      )
    ), a = t(((l = e == null ? void 0 : e.data) == null ? void 0 : l.path) ?? "");
    return `
      <label>${i}</label>
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
    var n, i;
    e.data.path = ((i = (n = t.playSoundPath) == null ? void 0 : n.trim) == null ? void 0 : i.call(n)) ?? "";
  }, "prepareFormData")
});
var Qi;
const { ApplicationV2: En, HandlebarsApplicationMixin: Sn } = ((Qi = foundry.applications) == null ? void 0 : Qi.api) ?? {};
if (!En || !Sn)
  throw new Error(
    `${O} | ApplicationV2 API unavailable. Update Foundry VTT to v13 or newer.`
  );
const Ue = "AM", tt = "PM";
function xe() {
  return ir();
}
s(xe, "getConfiguredTimeFormat");
function wn(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  if (!t) return null;
  const n = t.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (!n) return null;
  const i = Number(n[1]), r = Number(n[2]), o = n[3] !== void 0 ? Number(n[3]) : null;
  return !Number.isInteger(i) || !Number.isInteger(r) || i < 0 || i > 23 || r < 0 || r > 59 || o !== null && (!Number.isInteger(o) || o < 0 || o > 59) ? null : {
    hours: i,
    minutes: r,
    seconds: o
  };
}
s(wn, "parseCanonicalTimeString");
function Le({ hours: e, minutes: t, seconds: n }) {
  if (!Number.isInteger(e) || !Number.isInteger(t) || e < 0 || e > 23 || t < 0 || t > 59) return null;
  const i = String(e).padStart(2, "0"), r = String(t).padStart(2, "0");
  if (Number.isInteger(n)) {
    if (n < 0 || n > 59) return null;
    const o = String(n).padStart(2, "0");
    return `${i}:${r}:${o}`;
  }
  return `${i}:${r}`;
}
s(Le, "formatCanonicalTime");
function To(e, { format: t } = {}) {
  if (!e || typeof e != "object") return null;
  const n = Number(e.hour), i = Number(e.minute), r = e.second !== void 0 && e.second !== null, o = r ? Number(e.second) : null, a = r && Number.isFinite(o) ? Math.floor(Math.max(0, Math.min(59, o))) : null;
  if (!Number.isFinite(n) || !Number.isFinite(i)) return null;
  const l = t ?? xe();
  return Wt(
    {
      hours: n,
      minutes: i,
      seconds: a
    },
    l
  );
}
s(To, "formatTimeComponentsForDisplay");
function bo(e, { format: t } = {}) {
  const n = wn(e);
  if (!n) return "";
  const i = t ?? xe();
  return Wt(n, i);
}
s(bo, "formatTriggerTimeForDisplay");
function Wt(e, t = "12h") {
  if (!e) return "";
  const { hours: n, minutes: i, seconds: r = null } = e;
  if (!Number.isInteger(n) || !Number.isInteger(i)) return "";
  const o = Number.isInteger(r);
  if (t === "24h") {
    const m = `${String(n).padStart(2, "0")}:${String(i).padStart(2, "0")}`;
    return o ? `${m}:${String(r).padStart(2, "0")}` : m;
  }
  const a = n >= 12 ? tt : Ue, l = n % 12 === 0 ? 12 : n % 12, c = String(l), u = String(i).padStart(2, "0"), d = `${c}:${u}`, h = a === Ue ? f("EIDOLON.TimeTrigger.TimePeriodAM", Ue) : f("EIDOLON.TimeTrigger.TimePeriodPM", tt);
  if (o) {
    const m = String(r).padStart(2, "0");
    return `${d}:${m} ${h}`;
  }
  return `${d} ${h}`;
}
s(Wt, "formatTimeParts");
function Hi(e, t = xe()) {
  const n = wn(e);
  if (t === "24h")
    return {
      format: t,
      canonical: n ? Le(n) ?? "" : "",
      hour: n ? String(n.hours).padStart(2, "0") : "",
      minute: n ? String(n.minutes).padStart(2, "0") : ""
    };
  if (!n)
    return {
      format: t,
      canonical: "",
      hour: "",
      minute: "",
      period: Ue
    };
  const i = n.hours >= 12 ? tt : Ue, r = n.hours % 12 === 0 ? 12 : n.hours % 12;
  return {
    format: t,
    canonical: Le(n) ?? "",
    hour: String(r),
    minute: String(n.minutes).padStart(2, "0"),
    period: i
  };
}
s(Hi, "getTimeFormValues");
function vo({ hour: e, minute: t, period: n, time: i }, r = xe()) {
  if (r === "24h") {
    const p = typeof e == "string" ? e.trim() : "", g = typeof t == "string" ? t.trim() : "", L = typeof i == "string" ? i.trim() : "";
    if (!p && !g && L) {
      const A = wn(L);
      return A ? { canonical: Le(A) ?? "", error: null } : {
        canonical: "",
        error: f(
          "EIDOLON.TimeTrigger.TimeFormatInvalid24",
          "Enter a valid time in HH:MM format."
        )
      };
    }
    if (!p || !g)
      return {
        canonical: "",
        error: f("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.")
      };
    const I = Number(p), b = Number(g);
    return !Number.isInteger(I) || I < 0 || I > 23 ? {
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
    } : { canonical: Le({
      hours: I,
      minutes: b
    }) ?? "", error: null };
  }
  const o = typeof e == "string" ? e.trim() : "", a = typeof t == "string" ? t.trim() : "", l = typeof n == "string" ? n.trim().toUpperCase() : "";
  if (!o || !a || !l)
    return { canonical: "", error: f("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.") };
  if (l !== Ue && l !== tt)
    return { canonical: "", error: f("EIDOLON.TimeTrigger.TimeFormatInvalidPeriod", "Select AM or PM.") };
  const c = Number(o), u = Number(a);
  if (!Number.isInteger(c) || c < 1 || c > 12)
    return {
      canonical: "",
      error: f("EIDOLON.TimeTrigger.TimeFormatInvalidHour", "Hours must be between 1 and 12.")
    };
  if (!Number.isInteger(u) || u < 0 || u > 59)
    return {
      canonical: "",
      error: f("EIDOLON.TimeTrigger.TimeFormatInvalidMinute", "Minutes must be between 00 and 59.")
    };
  const d = c % 12, m = {
    hours: l === tt ? d + 12 : d,
    minutes: u
  };
  return {
    canonical: Le(m) ?? "",
    error: null
  };
}
s(vo, "normalizeFormTimeInput");
function Oo() {
  return [
    {
      value: Ue,
      label: f("EIDOLON.TimeTrigger.TimePeriodAM", Ue)
    },
    {
      value: tt,
      label: f("EIDOLON.TimeTrigger.TimePeriodPM", tt)
    }
  ];
}
s(Oo, "getPeriodOptions");
var Ge, ze, j, cr, Zt, en, ur, Yn, Qn, tn, nn, dr, fr, gr, Xn, Zn, ei, rn, on, ti, sn, mr, hr;
const Be = class Be extends Sn(En) {
  constructor(n = {}) {
    var a;
    const { scene: i, showControls: r, ...o } = n ?? {};
    super(o);
    M(this, j);
    M(this, Ge, null);
    M(this, ze, null);
    M(this, Zt, /* @__PURE__ */ s((n) => {
      var r, o;
      n.preventDefault();
      const i = Number((o = (r = n.currentTarget) == null ? void 0 : r.dataset) == null ? void 0 : o.delta);
      Number.isFinite(i) && (T("Time delta button clicked", { delta: i }), this._advanceTime(i));
    }, "#onDeltaClick"));
    M(this, en, /* @__PURE__ */ s((n) => {
      var i, r;
      n.preventDefault(), !(!this.showControls || !((i = game.user) != null && i.isGM)) && (T("Time value double clicked", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null }), S(this, j, ur).call(this));
    }, "#onTimeDoubleClick"));
    M(this, tn, /* @__PURE__ */ s((n) => {
      if (this.isEditingTime && !this._commitTimeInProgress)
        if (n.key === "Enter") {
          n.preventDefault();
          const i = n.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
          S(this, j, Qn).call(this, r);
        } else n.key === "Escape" && (n.preventDefault(), S(this, j, Yn).call(this));
    }, "#onTimeInputKeydown"));
    M(this, nn, /* @__PURE__ */ s((n) => {
      if (!this.isEditingTime || this._commitTimeInProgress || this._suppressBlurCommit) return;
      const i = n.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
      S(this, j, Qn).call(this, r);
    }, "#onTimeInputBlur"));
    M(this, rn, /* @__PURE__ */ s((n) => {
      const i = !!n;
      if (this.manageTimeEnabled === i) return;
      this.manageTimeEnabled = i, (this.rendered ?? this.isRendered ?? !1) && this.render({ force: !0 });
    }, "#handleManageTimeChange"));
    M(this, on, /* @__PURE__ */ s(async (n) => {
      var o, a, l, c, u, d, h, m, p;
      if (n.preventDefault(), !this.showControls || !((o = game.user) != null && o.isGM)) return;
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
      const i = this.scene;
      if (!i || typeof i.setFlag != "function") {
        (u = (c = ui.notifications) == null ? void 0 : c.error) == null || u.call(
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
        await i.setFlag(O, Vn, r), this.sceneAllowsRealTime = r;
        const g = r ? f(
          "EIDOLON.TimeTrigger.SceneRealTimeEnabled",
          "Automatic real-time flow enabled for this scene."
        ) : f(
          "EIDOLON.TimeTrigger.SceneRealTimeDisabled",
          "Automatic real-time flow disabled for this scene."
        );
        (h = (d = ui.notifications) == null ? void 0 : d.info) == null || h.call(d, g);
      } catch (g) {
        console.error(`${O} | Failed to toggle scene real-time flow`, g), (p = (m = ui.notifications) == null ? void 0 : m.error) == null || p.call(
          m,
          f(
            "EIDOLON.TimeTrigger.SceneRealTimeToggleError",
            "Failed to update the scene's real-time flow setting."
          )
        );
      } finally {
        this.render({ force: !0 });
      }
    }, "#onRealTimeToggleClick"));
    M(this, sn, /* @__PURE__ */ s(() => {
      (this.rendered ?? this.isRendered ?? !1) && (this.isEditingTime && (this.editValue = S(this, j, Xn).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    this.scene = i ?? null, this.showControls = typeof r == "boolean" ? r : !!((a = game.user) != null && a.isGM), this.isEditingTime = !1, this.editValue = "", this._commitTimeInProgress = !1, this._suppressBlurCommit = !1, this.manageTimeEnabled = !1, this.sceneAllowsRealTime = S(this, j, ti).call(this), D(this, Ge, Li(v(this, sn))), D(this, ze, rr(v(this, rn)));
  }
  async _prepareContext() {
    var b, w;
    const n = ((b = game.time) == null ? void 0 : b.components) ?? {}, r = ((n == null ? void 0 : n.second) !== void 0 && (n == null ? void 0 : n.second) !== null ? To(n) : null) ?? S(this, j, cr).call(this), o = xe(), a = o === "24h", l = a ? f("EIDOLON.TimeTrigger.EditTimePlaceholder24", "HH:MM") : f("EIDOLON.TimeTrigger.EditTimePlaceholder12", "HH:MM AM/PM"), c = this.showControls ? f(
      "EIDOLON.TimeTrigger.EditTimeHint",
      "Double-click to set a specific time."
    ) : "", u = this.showControls ? f(
      "EIDOLON.TimeTrigger.EditTimeLabel",
      "New time (HH:MM or HH:MM AM/PM)"
    ) : "", d = Zr.map((A) => ({
      minutes: A,
      label: A > 0 ? `+${A}` : `${A}`
    })), h = !!this.manageTimeEnabled, m = S(this, j, ti).call(this);
    this.sceneAllowsRealTime = m;
    const p = f(
      "EIDOLON.TimeTrigger.SceneRealTimeEnable",
      "Enable automatic real-time flow for this scene."
    ), g = f(
      "EIDOLON.TimeTrigger.SceneRealTimeDisable",
      "Disable automatic real-time flow for this scene."
    ), L = f(
      "EIDOLON.TimeTrigger.SceneRealTimeManageDisabled",
      "Enable Manage Time in module settings to allow automatic real-time flow."
    );
    return {
      formattedTime: r,
      deltas: d,
      manageTimeEnabled: h,
      sceneAllowsRealTime: m,
      realTimeButtonLabel: h ? m ? g : p : L,
      isGM: ((w = game.user) == null ? void 0 : w.isGM) ?? !1,
      showControls: !!this.showControls,
      editHint: c,
      editLabel: u,
      editPlaceholder: l,
      timeFormat: o,
      is24Hour: a,
      isEditingTime: !!this.isEditingTime,
      editValue: this.isEditingTime ? this.editValue ?? "" : ""
    };
  }
  async close(n = {}) {
    var r, o;
    if (!n.force)
      return (this.rendered ?? this.isRendered ?? !1) || (T("TimeTriggerWindow close request rerendering", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null
      }), this.render({ force: !0 })), this;
    T("Closing time trigger window", { sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null, force: !0 });
    const i = await super.close(n);
    return S(this, j, mr).call(this), S(this, j, hr).call(this), i;
  }
  async _advanceTime(n) {
    var r, o, a, l, c, u, d;
    const i = n * 60;
    if (T("Advancing world time", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null, minutes: n, seconds: i }), !((o = game.user) != null && o.isGM)) {
      (l = (a = ui.notifications) == null ? void 0 : a.warn) == null || l.call(a, f("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time."));
      return;
    }
    try {
      await game.time.advance(i);
    } catch (h) {
      console.error(`${O} | Failed to advance time`, h), (u = (c = ui.notifications) == null ? void 0 : c.error) == null || u.call(
        c,
        f("EIDOLON.TimeTrigger.Error", "Failed to update the world time.")
      ), T("Failed to advance time from window", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        minutes: n,
        message: (h == null ? void 0 : h.message) ?? String(h)
      });
    }
  }
  _onRender(n, i) {
    var o;
    super._onRender(n, i);
    const r = this.element;
    if (r) {
      if (this.showControls) {
        T("Binding time trigger interactions", {
          sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
          buttonCount: r.querySelectorAll("[data-delta]").length
        }), r.querySelectorAll("[data-delta]").forEach((u) => {
          u.addEventListener("click", v(this, Zt));
        });
        const a = r.querySelector('.time-trigger-window__time-value[data-editable="true"]');
        a && a.addEventListener("dblclick", v(this, en), { once: !1 });
        const l = r.querySelector(".time-trigger-window__time-input");
        l && (l.addEventListener("keydown", v(this, tn)), l.addEventListener("blur", v(this, nn)), typeof l.focus == "function" && (l.focus(), typeof l.select == "function" && l.select()));
        const c = r.querySelector('[data-action="toggle-real-time"]');
        c && c.addEventListener("click", v(this, on));
      }
      this._suppressBlurCommit = !1;
    }
  }
};
Ge = new WeakMap(), ze = new WeakMap(), j = new WeakSet(), cr = /* @__PURE__ */ s(function() {
  var c;
  const n = (c = game.time) == null ? void 0 : c.worldTime;
  if (typeof n != "number" || !Number.isFinite(n)) return "";
  const i = 1440 * 60, r = (Math.floor(n) % i + i) % i, o = Math.floor(r / 3600), a = Math.floor(r % 3600 / 60), l = r % 60;
  return Wt({ hours: o, minutes: a, seconds: l }, xe());
}, "#formatFallbackTime"), Zt = new WeakMap(), en = new WeakMap(), ur = /* @__PURE__ */ s(function() {
  var n;
  (n = game.user) != null && n.isGM && (this.isEditingTime = !0, this._suppressBlurCommit = !1, this.editValue = S(this, j, Xn).call(this), this.render({ force: !0 }));
}, "#enterTimeEditMode"), Yn = /* @__PURE__ */ s(function() {
  this.isEditingTime = !1, this.editValue = "", this._suppressBlurCommit = !1, this.render({ force: !0 });
}, "#cancelTimeEdit"), Qn = /* @__PURE__ */ s(async function(n) {
  var o, a, l;
  if (!((o = game.user) != null && o.isGM) || !this.isEditingTime || this._commitTimeInProgress) return;
  this._commitTimeInProgress = !0;
  const i = typeof n == "string" ? n.trim() : "";
  if (!i) {
    S(this, j, Yn).call(this), this._commitTimeInProgress = !1;
    return;
  }
  const r = S(this, j, gr).call(this, i);
  if (r.error) {
    (l = (a = ui.notifications) == null ? void 0 : a.error) == null || l.call(a, r.error), this._suppressBlurCommit = !0, this.editValue = i, this.render({ force: !0 }), this._commitTimeInProgress = !1;
    return;
  }
  try {
    await S(this, j, fr).call(this, r.seconds, r.includeSeconds) ? (this.isEditingTime = !1, this.editValue = "", this.render({ force: !0 })) : (this.editValue = i, this.render({ force: !0 }));
  } finally {
    this._commitTimeInProgress = !1;
  }
}, "#commitTimeInput"), tn = new WeakMap(), nn = new WeakMap(), dr = /* @__PURE__ */ s(function() {
  var u, d;
  const n = (u = game.time) == null ? void 0 : u.worldTime;
  if (typeof n != "number" || !Number.isFinite(n))
    return "";
  const i = ((d = game.time) == null ? void 0 : d.components) ?? {}, r = Number(i.hour), o = Number(i.minute), a = i.second !== void 0 ? Number(i.second) : null, l = Number.isInteger(a);
  return (Number.isFinite(r) && Number.isFinite(o) ? Le({
    hours: Math.max(0, Math.min(23, Number(r))),
    minutes: Math.max(0, Math.min(59, Number(o))),
    seconds: l && Number.isFinite(a) ? Math.max(0, Math.min(59, Number(a))) : void 0
  }) ?? "" : "") ?? "";
}, "#getCurrentCanonicalTime"), fr = /* @__PURE__ */ s(async function(n, i) {
  var m, p, g, L, I, b, w, A, R, _;
  const r = (m = game.time) == null ? void 0 : m.worldTime;
  if (typeof r != "number" || !Number.isFinite(r))
    return (g = (p = ui.notifications) == null ? void 0 : p.error) == null || g.call(
      p,
      f(
        "EIDOLON.TimeTrigger.EditTimeUnavailable",
        "The world time is unavailable, so it can't be updated."
      )
    ), !1;
  if (!Number.isInteger(n) || n < 0 || n >= st)
    return (I = (L = ui.notifications) == null ? void 0 : L.error) == null || I.call(
      L,
      f(
        "EIDOLON.TimeTrigger.EditTimeInvalidRange",
        "Enter a time within the current day."
      )
    ), !1;
  const l = Math.floor(r / st) * st + n - r;
  if (!Number.isFinite(l) || l === 0)
    return !0;
  const c = Math.floor(n / 3600), u = Math.floor(n % 3600 / 60), d = n % 60, h = Le({
    hours: c,
    minutes: u,
    seconds: i ? d : void 0
  });
  try {
    T("Updating world time directly", {
      sceneId: ((b = this.scene) == null ? void 0 : b.id) ?? null,
      targetCanonical: h ?? null,
      diff: l
    }), await game.time.advance(l);
    const x = Wt(
      {
        hours: c,
        minutes: u,
        seconds: i ? d : null
      },
      xe()
    );
    (A = (w = ui.notifications) == null ? void 0 : w.info) == null || A.call(
      w,
      f(
        "EIDOLON.TimeTrigger.EditTimeSuccess",
        "World time updated."
      ) + (x ? ` ${x}` : "")
    );
  } catch (x) {
    return console.error(`${O} | Failed to set world time`, x), (_ = (R = ui.notifications) == null ? void 0 : R.error) == null || _.call(
      R,
      f(
        "EIDOLON.TimeTrigger.EditTimeError",
        "Failed to update the world time."
      )
    ), !1;
  }
  return !0;
}, "#applyTargetSeconds"), gr = /* @__PURE__ */ s(function(n) {
  var h;
  const i = f(
    "EIDOLON.TimeTrigger.EditTimeInvalid",
    "Enter a valid time like 14:30 or 2:30 PM."
  );
  if (typeof n != "string")
    return { error: i };
  const r = n.trim();
  if (!r)
    return { error: i };
  const o = r.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (o) {
    const m = Number(o[1]), p = Number(o[2]), g = o[3] !== void 0 ? Number(o[3]) : void 0;
    if (Number.isInteger(m) && m >= 0 && m <= 23 && Number.isInteger(p) && p >= 0 && p <= 59 && (g === void 0 || Number.isInteger(g) && g >= 0 && g <= 59)) {
      const L = m * 3600 + p * 60 + (g ?? 0);
      return {
        canonical: Le({ hours: m, minutes: p, seconds: g }),
        seconds: L,
        includeSeconds: g !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const { amLower: a, pmLower: l, periodPattern: c } = S(this, j, Zn).call(this), u = r.match(
    new RegExp(
      `^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?\\s*(${c})$`,
      "i"
    )
  );
  if (u) {
    let m = Number(u[1]);
    const p = Number(u[2]), g = u[3] !== void 0 ? Number(u[3]) : void 0, L = u[4] ?? "", I = typeof L == "string" ? ((h = L.toLocaleLowerCase) == null ? void 0 : h.call(L)) ?? L.toLowerCase() : "";
    if (Number.isInteger(m) && m >= 1 && m <= 12 && Number.isInteger(p) && p >= 0 && p <= 59 && (g === void 0 || Number.isInteger(g) && g >= 0 && g <= 59) && (I === a || I === l || I === "am" || I === "pm")) {
      m = m % 12, (I === l || I === "pm") && (m += 12);
      const w = m * 3600 + p * 60 + (g ?? 0);
      return {
        canonical: Le({ hours: m, minutes: p, seconds: g }),
        seconds: w,
        includeSeconds: g !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const d = tr(r);
  if (d !== null) {
    const m = Math.floor(d / 3600), p = Math.floor(d % 3600 / 60), g = d % 60, L = g !== 0;
    return {
      canonical: Le({
        hours: m,
        minutes: p,
        seconds: L ? g : void 0
      }),
      seconds: d,
      includeSeconds: L,
      error: null
    };
  }
  return { error: i };
}, "#parseInputTime"), Xn = /* @__PURE__ */ s(function() {
  const n = S(this, j, dr).call(this);
  if (!n) return "";
  if (xe() === "24h")
    return n;
  const r = wn(n);
  if (!r) return n;
  const o = Number(r.hours), a = Number(r.minutes), l = r.seconds !== null && r.seconds !== void 0 ? Number(r.seconds) : void 0;
  if (!Number.isFinite(o) || !Number.isFinite(a)) return n;
  const c = Number.isFinite(l), u = o % 12 === 0 ? 12 : o % 12, d = String(a).padStart(2, "0"), h = c ? `:${String(l).padStart(2, "0")}` : "", { amLabel: m, pmLabel: p } = S(this, j, Zn).call(this), g = o >= 12 ? p : m;
  return `${u}:${d}${h} ${g}`.trim();
}, "#getInitialEditValue"), Zn = /* @__PURE__ */ s(function() {
  var u, d;
  const n = f("EIDOLON.TimeTrigger.TimePeriodAM", "AM"), i = f("EIDOLON.TimeTrigger.TimePeriodPM", "PM"), r = ((u = n.toLocaleLowerCase) == null ? void 0 : u.call(n)) ?? n.toLowerCase(), o = ((d = i.toLocaleLowerCase) == null ? void 0 : d.call(i)) ?? i.toLowerCase(), a = S(this, j, ei).call(this, n), l = S(this, j, ei).call(this, i), c = `${a}|${l}|AM|PM`;
  return {
    amLabel: n,
    pmLabel: i,
    amLower: r,
    pmLower: o,
    periodPattern: c
  };
}, "#getPeriodMatchData"), ei = /* @__PURE__ */ s(function(n) {
  return typeof n != "string" ? "" : n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}, "#escapeForRegex"), rn = new WeakMap(), on = new WeakMap(), ti = /* @__PURE__ */ s(function() {
  const n = this.scene;
  if (!n || typeof n.getFlag != "function") return !1;
  try {
    return !!n.getFlag(O, Vn);
  } catch (i) {
    T("TimeTriggerWindow | Failed to read scene real-time flag", {
      sceneId: (n == null ? void 0 : n.id) ?? null,
      message: (i == null ? void 0 : i.message) ?? String(i)
    });
  }
  return !1;
}, "#readSceneRealTimeFlag"), sn = new WeakMap(), mr = /* @__PURE__ */ s(function() {
  if (typeof v(this, Ge) == "function")
    try {
      v(this, Ge).call(this);
    } catch (n) {
      console.error(`${O} | Failed to dispose time format subscription`, n);
    }
  D(this, Ge, null);
}, "#disposeTimeFormatSubscription"), hr = /* @__PURE__ */ s(function() {
  if (typeof v(this, ze) == "function")
    try {
      v(this, ze).call(this);
    } catch (n) {
      console.error(`${O} | Failed to dispose manage time subscription`, n);
    }
  D(this, ze, null);
}, "#disposeManageTimeSubscription"), s(Be, "TimeTriggerWindow"), qe(Be, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  it(Be, Be, "DEFAULT_OPTIONS"),
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
)), qe(Be, "PARTS", {
  content: {
    template: `modules/${O}/templates/time-trigger.html`
  }
});
let Jn = Be;
function Ei(e, t = {}) {
  if (typeof e != "function")
    throw new TypeError("createApplicationFactory requires a constructor function.");
  const n = /* @__PURE__ */ s(function(r = {}) {
    const o = foundry.utils.mergeObject(
      t ?? {},
      r ?? {},
      { inplace: !1 }
    );
    return new e(o);
  }, "applicationFactory");
  return n.__eidolonFactorySignature = "options", n.__eidolonFactoryTarget = e, n;
}
s(Ei, "createApplicationFactory");
const $i = /* @__PURE__ */ new Set();
var ee, de, We, mt, yr, pr;
const Ai = class Ai {
  constructor({ windowFactory: t } = {}) {
    M(this, mt);
    M(this, ee, null);
    M(this, de, null);
    M(this, We);
    const n = Ei(Jn);
    typeof t == "function" ? t.__eidolonFactorySignature === "options" ? D(this, We, (r, o = {}) => t({ scene: r, ...o ?? {} })) : D(this, We, t) : D(this, We, /* @__PURE__ */ s((r, o = {}) => n({ scene: r, ...o ?? {} }), "fallbackFactory"));
  }
  onReady() {
    var n;
    const t = typeof ((n = game.time) == null ? void 0 : n.worldTime) == "number" && Number.isFinite(game.time.worldTime) ? game.time.worldTime : null;
    T("TimeTriggerManager#onReady", { worldTime: t }), t !== null && D(this, de, t);
  }
  onCanvasReady(t) {
    const n = (t == null ? void 0 : t.scene) ?? vt();
    T("TimeTriggerManager#onCanvasReady", { sceneId: (n == null ? void 0 : n.id) ?? null }), this.refreshTimeTriggerWindow(n), this.handleTimeTriggerEvaluation(n);
  }
  onUpdateScene(t) {
    const n = vt();
    T("TimeTriggerManager#onUpdateScene", {
      sceneId: (t == null ? void 0 : t.id) ?? null,
      activeSceneId: (n == null ? void 0 : n.id) ?? null
    }), !(!n || t.id !== n.id) && (this.refreshTimeTriggerWindow(t), this.handleTimeTriggerEvaluation(t));
  }
  onUpdateWorldTime(t, n) {
    T("TimeTriggerManager#onUpdateWorldTime", {
      worldTime: t,
      diff: n,
      hasWindow: !!v(this, ee)
    }), v(this, ee) && v(this, ee).render();
    const i = vt(), r = S(this, mt, yr).call(this, t, n);
    this.handleTimeTriggerEvaluation(i, t, r);
  }
  refreshTimeTriggerWindow(t) {
    var c, u, d;
    if (!t) return;
    const n = !!((c = game.user) != null && c.isGM), i = !!t.getFlag(O, jt), r = !!t.getFlag(O, Hn), o = !!t.getFlag(O, $n);
    if (T("TimeTriggerManager#refreshTimeTriggerWindow", {
      sceneId: t.id,
      isGM: n,
      isActive: i,
      hideWindow: r,
      showPlayerWindow: o
    }), !(i && !r && (n || o))) {
      v(this, ee) && (T("Closing time trigger window", { reason: "not-visible" }), v(this, ee).close({ force: !0 }), D(this, ee, null));
      return;
    }
    const l = !!n;
    if (v(this, ee) && ((u = v(this, ee).scene) == null ? void 0 : u.id) === t.id) {
      T("Refreshing existing time trigger window", { sceneId: t.id }), v(this, ee).showControls = l, v(this, ee).render();
      return;
    }
    v(this, ee) && (T("Closing existing window before creating new instance", {
      previousSceneId: ((d = v(this, ee).scene) == null ? void 0 : d.id) ?? null
    }), v(this, ee).close({ force: !0 })), D(this, ee, v(this, We).call(this, t, { showControls: l })), T("Rendering new time trigger window", { sceneId: t.id }), v(this, ee).render({ force: !0 });
  }
  async handleTimeTriggerEvaluation(t, n, i) {
    var c;
    const r = t ?? vt();
    if (!r) {
      T("handleTimeTriggerEvaluation skipped", {
        reason: "no-active-scene",
        providedSceneId: (t == null ? void 0 : t.id) ?? null,
        currentWorldTime: n
      }), typeof n == "number" && Number.isFinite(n) && D(this, de, n);
      return;
    }
    const o = typeof n == "number" && Number.isFinite(n) ? n : typeof ((c = game.time) == null ? void 0 : c.worldTime) == "number" ? game.time.worldTime : null;
    if (o === null) return;
    const a = typeof i == "number" && Number.isFinite(i) ? i : null, l = a !== null ? a : typeof v(this, de) == "number" && Number.isFinite(v(this, de)) ? v(this, de) : o;
    ft("handleTimeTriggerEvaluation", {
      sceneId: r.id,
      previousWorldTime: l,
      currentWorldTime: o,
      overrideProvided: a !== null
    });
    try {
      await S(this, mt, pr).call(this, r, l, o);
    } catch (u) {
      console.error(`${O} | Unexpected error while evaluating time triggers`, u), T("handleTimeTriggerEvaluation error", { message: (u == null ? void 0 : u.message) ?? String(u) });
    } finally {
      D(this, de, o), ke();
    }
  }
};
ee = new WeakMap(), de = new WeakMap(), We = new WeakMap(), mt = new WeakSet(), yr = /* @__PURE__ */ s(function(t, n) {
  return typeof v(this, de) == "number" && Number.isFinite(v(this, de)) ? (T("Resolved previous world time from cache", {
    previousWorldTime: v(this, de)
  }), v(this, de)) : typeof t == "number" && Number.isFinite(t) && typeof n == "number" && Number.isFinite(n) ? (T("Resolved previous world time using diff", {
    worldTime: t,
    diff: n,
    resolved: t - n
  }), t - n) : typeof t == "number" && Number.isFinite(t) ? t : null;
}, "#resolvePreviousWorldTime"), pr = /* @__PURE__ */ s(async function(t, n, i) {
  var g, L, I;
  if (!((g = game.user) != null && g.isGM)) {
    T("Skipping trigger evaluation because user is not a GM");
    return;
  }
  if (!(t != null && t.id)) {
    T("Skipping trigger evaluation because the scene is missing an id");
    return;
  }
  if (!!!t.getFlag(O, jt)) {
    T("Skipping trigger evaluation because scene is inactive", { sceneId: t.id });
    return;
  }
  if (typeof i != "number" || !Number.isFinite(i)) return;
  (typeof n != "number" || !Number.isFinite(n)) && (n = i);
  const o = at(t);
  if (!o.length) {
    T("No time triggers configured for scene", { sceneId: t.id });
    return;
  }
  const a = co(t), l = /* @__PURE__ */ new Set();
  for (const b of o)
    b != null && b.id && l.add(b.id);
  let c = !1;
  for (const b of Object.keys(a))
    l.has(b) || (delete a[b], c = !0);
  if (ft("Evaluating scene time triggers", {
    sceneId: t.id,
    previousWorldTime: n,
    currentWorldTime: i,
    triggerCount: o.length
  }), i <= n) {
    T("Detected world time rewind", {
      previousWorldTime: n,
      currentWorldTime: i
    });
    for (const b of o) {
      if (!(b != null && b.id) || !b.allowReplayOnRewind) continue;
      const w = a[b.id];
      typeof w == "number" ? i < w ? (T("Clearing trigger history due to rewind", {
        triggerId: b.id,
        lastFired: w,
        currentWorldTime: i
      }), delete a[b.id], c = !0) : T("Preserving trigger history after rewind", {
        triggerId: b.id,
        lastFired: w,
        currentWorldTime: i
      }) : T("No history stored for rewind-enabled trigger", {
        triggerId: b.id
      });
    }
    c && (T("Persisting history cleanup after rewind", {
      sceneId: t.id
    }), await _n(t, a)), ke();
    return;
  }
  const u = n, d = i, h = [], m = Math.floor(u / st), p = Math.floor(d / st);
  for (const b of o) {
    if (!(b != null && b.id)) continue;
    const w = tr(b.time);
    if (w === null) {
      Lo(t, b), T("Skipping trigger with invalid time", {
        triggerId: b.id,
        time: b.time
      });
      continue;
    }
    for (let A = m; A <= p; A++) {
      const R = A * st + w;
      if (R < u || R > d) continue;
      const x = a[b.id];
      if (typeof x == "number" && x >= R) {
        T("Skipping trigger because it already fired within window", {
          triggerId: b.id,
          lastFired: x,
          absoluteTime: R
        });
        continue;
      }
      h.push({ trigger: b, absoluteTime: R });
    }
  }
  if (!h.length) {
    c && await _n(t, a), T("No triggers scheduled to fire within evaluation window", {
      sceneId: t.id
    }), ke();
    return;
  }
  h.sort((b, w) => b.absoluteTime - w.absoluteTime), T("Queued triggers for execution", {
    entries: h.map((b) => ({
      triggerId: b.trigger.id,
      absoluteTime: b.absoluteTime
    }))
  });
  for (const b of h)
    try {
      T("Executing time trigger action", {
        triggerId: b.trigger.id,
        absoluteTime: b.absoluteTime
      }), await lr(t, b.trigger);
    } catch (w) {
      console.error(`${O} | Failed to execute time trigger action`, w), (I = (L = ui.notifications) == null ? void 0 : L.error) == null || I.call(
        L,
        f(
          "EIDOLON.TimeTrigger.TriggerActionError",
          "Failed to execute a scene time trigger action. Check the console for details."
        )
      ), T("Trigger execution failed", {
        triggerId: b.trigger.id,
        message: (w == null ? void 0 : w.message) ?? String(w)
      });
    } finally {
      a[b.trigger.id] = b.absoluteTime, c = !0, T("Recorded trigger execution", {
        triggerId: b.trigger.id,
        absoluteTime: b.absoluteTime
      });
    }
  c && (T("Persisting trigger history updates", { sceneId: t.id }), await _n(t, a)), ke();
}, "#evaluateSceneTimeTriggers"), s(Ai, "TimeTriggerManager");
let ni = Ai;
function Lo(e, t) {
  var r, o;
  const n = `${(e == null ? void 0 : e.id) ?? "unknown"}:${(t == null ? void 0 : t.id) ?? (t == null ? void 0 : t.time) ?? "unknown"}`;
  if ($i.has(n)) return;
  $i.add(n);
  const i = f(
    "EIDOLON.TimeTrigger.InvalidTimeWarning",
    "A scene time trigger has an invalid time value and was skipped."
  );
  (o = (r = ui.notifications) == null ? void 0 : r.warn) == null || o.call(r, i), console.warn(`${O} | Invalid time for trigger`, { scene: e == null ? void 0 : e.id, trigger: t });
}
s(Lo, "warnInvalidTriggerTime");
var he, It, ye, $e, Ke, ve, dt, an, ln, Et, St, Je, Oe, N, ri, ot, Ht, oi, $t, si, be, Tr, ai, br, li, vr, cn, un, dn, fn, gn, mn, ci, Or, Vt, hn, yn;
const Ni = class Ni {
  constructor() {
    M(this, N);
    M(this, he, !1);
    M(this, It, Ct);
    M(this, ye, /* @__PURE__ */ new Map());
    M(this, $e, null);
    M(this, Ke, null);
    M(this, ve, 0);
    M(this, dt, null);
    M(this, an, null);
    M(this, ln, null);
    M(this, Et, !1);
    M(this, St, !1);
    M(this, Je, !1);
    M(this, Oe, !1);
    M(this, cn, /* @__PURE__ */ s((t, n = {}) => {
      T("GameTimeAutomation | Pause state changed", {
        paused: t,
        userId: (n == null ? void 0 : n.userId) ?? null,
        broadcast: (n == null ? void 0 : n.broadcast) ?? null
      }), S(this, N, be).call(this, { pausedOverride: t });
    }, "#handlePause"));
    M(this, un, /* @__PURE__ */ s((t) => {
      t != null && t.id && (v(this, ye).set(t.id, Math.max(t.round ?? 0, 1)), T("GameTimeAutomation | Combat started", { combatId: t.id, round: t.round ?? 0 }), S(this, N, be).call(this));
    }, "#handleCombatStart"));
    M(this, dn, /* @__PURE__ */ s((t, n) => {
      if (!(t != null && t.id)) return;
      const i = typeof n == "number" && Number.isFinite(n) ? n : typeof t.round == "number" && Number.isFinite(t.round) ? t.round : 0, r = i > 0 ? i : 1, o = v(this, ye).get(t.id), a = o ? Math.max(o, 1) : 1, l = r > 1 ? Math.max(r - a, 0) : 0;
      if (T("GameTimeAutomation | Combat round change detected", {
        combatId: t.id,
        effectiveRound: r,
        completedRounds: l,
        enabled: v(this, he),
        paused: (game == null ? void 0 : game.paused) ?? null
      }), l > 0 && v(this, he) && v(this, Oe) && !(game != null && game.paused) && S(this, N, ot).call(this) && S(this, N, Ht).call(this, t)) {
        const c = l * v(this, It);
        c > 0 && (T("GameTimeAutomation | Advancing time for completed combat rounds", {
          combatId: t.id,
          completedRounds: l,
          delta: c
        }), S(this, N, li).call(this, c));
      }
      v(this, ye).set(t.id, Math.max(r, 1));
    }, "#handleCombatRound"));
    M(this, fn, /* @__PURE__ */ s((t) => {
      t != null && t.id && (v(this, ye).delete(t.id), T("GameTimeAutomation | Combat ended", { combatId: t.id }), S(this, N, be).call(this));
    }, "#handleCombatEnd"));
    M(this, gn, /* @__PURE__ */ s((t) => {
      t != null && t.id && (v(this, ye).delete(t.id), T("GameTimeAutomation | Combat deleted", { combatId: t.id }), S(this, N, be).call(this));
    }, "#handleCombatDelete"));
    M(this, mn, /* @__PURE__ */ s((t, n) => {
      if (t != null && t.id) {
        if (typeof (n == null ? void 0 : n.round) == "number" && Number.isFinite(n.round)) {
          const i = Math.max(n.round, 1);
          v(this, ye).set(t.id, i), T("GameTimeAutomation | Combat round manually updated", {
            combatId: t.id,
            round: i
          });
        }
        (Object.prototype.hasOwnProperty.call(n ?? {}, "active") || (n == null ? void 0 : n.round) !== void 0) && S(this, N, be).call(this);
      }
    }, "#handleCombatUpdate"));
    M(this, hn, /* @__PURE__ */ s((t) => {
      S(this, N, Vt).call(this, t == null ? void 0 : t.scene), S(this, N, be).call(this);
    }, "#handleCanvasReady"));
    M(this, yn, /* @__PURE__ */ s((t) => {
      if (!ae(t)) return;
      const n = S(this, N, ci).call(this);
      if (!n || n.id !== t.id) return;
      S(this, N, Vt).call(this, t) && S(this, N, be).call(this);
    }, "#handleSceneUpdate"));
  }
  registerHooks() {
    v(this, Et) || (D(this, Et, !0), Hooks.on("pauseGame", v(this, cn)), Hooks.on("combatStart", v(this, un)), Hooks.on("combatRound", v(this, dn)), Hooks.on("combatEnd", v(this, fn)), Hooks.on("deleteCombat", v(this, gn)), Hooks.on("updateCombat", v(this, mn)), Hooks.on("canvasReady", v(this, hn)), Hooks.on("updateScene", v(this, yn)));
  }
  initialize() {
    v(this, St) || (D(this, St, !0), D(this, an, rr((t) => {
      const n = !!t, i = n !== v(this, he);
      D(this, he, n), T("GameTimeAutomation | Manage time toggled", { enabled: n }), i && n && S(this, N, si).call(this), S(this, N, be).call(this);
    })), D(this, ln, so((t) => {
      D(this, It, t), T("GameTimeAutomation | Seconds per round updated", { value: t });
    })), S(this, N, si).call(this), S(this, N, Vt).call(this), S(this, N, be).call(this));
  }
};
he = new WeakMap(), It = new WeakMap(), ye = new WeakMap(), $e = new WeakMap(), Ke = new WeakMap(), ve = new WeakMap(), dt = new WeakMap(), an = new WeakMap(), ln = new WeakMap(), Et = new WeakMap(), St = new WeakMap(), Je = new WeakMap(), Oe = new WeakMap(), N = new WeakSet(), ri = /* @__PURE__ */ s(function() {
  var t;
  try {
    if (typeof ((t = globalThis.performance) == null ? void 0 : t.now) == "function")
      return globalThis.performance.now();
  } catch (n) {
    T("GameTimeAutomation | Failed to read high-resolution timestamp", {
      message: (n == null ? void 0 : n.message) ?? String(n)
    });
  }
  return Date.now();
}, "#currentTimestamp"), ot = /* @__PURE__ */ s(function() {
  var t;
  return !!((t = game == null ? void 0 : game.user) != null && t.isGM && game.user.active !== !1);
}, "#canControlTime"), Ht = /* @__PURE__ */ s(function(t) {
  var i, r;
  if (!t) return !1;
  if (t.active === !0) return !0;
  if (t.active === !1) return !1;
  const n = (i = game == null ? void 0 : game.combats) == null ? void 0 : i.active;
  return (n == null ? void 0 : n.id) === t.id ? !0 : ((r = game == null ? void 0 : game.combat) == null ? void 0 : r.id) === t.id ? game.combat.active ?? !0 : !1;
}, "#isCombatDocumentActive"), oi = /* @__PURE__ */ s(function(t) {
  return t ? typeof t.started == "boolean" ? t.started : (t.round ?? 0) > 0 : !1;
}, "#hasCombatStarted"), $t = /* @__PURE__ */ s(function() {
  var i;
  const t = Array.isArray((i = game == null ? void 0 : game.combats) == null ? void 0 : i.contents) ? game.combats.contents : [];
  for (const r of t)
    if (S(this, N, Ht).call(this, r) && S(this, N, oi).call(this, r))
      return !0;
  const n = game == null ? void 0 : game.combat;
  return !!(n && S(this, N, Ht).call(this, n) && S(this, N, oi).call(this, n));
}, "#isCombatRunning"), si = /* @__PURE__ */ s(function() {
  var n;
  v(this, ye).clear();
  const t = Array.isArray((n = game == null ? void 0 : game.combats) == null ? void 0 : n.contents) ? game.combats.contents : [];
  for (const i of t)
    i != null && i.id && v(this, ye).set(i.id, Math.max(i.round ?? 0, 1));
}, "#hydrateRoundTracking"), be = /* @__PURE__ */ s(function({ pausedOverride: t } = {}) {
  const n = typeof t == "boolean" ? t : !!(game != null && game.paused), i = v(this, he), r = v(this, Oe), o = i && r, a = {
    manageTimeEnabled: i,
    sceneAllowsRealTime: r,
    effectiveEnabled: o,
    paused: n,
    canControl: S(this, N, ot).call(this),
    combatRunning: S(this, N, $t).call(this),
    overrideApplied: typeof t == "boolean"
  };
  if (T("GameTimeAutomation | Sync running state", a), !o || !S(this, N, ot).call(this)) {
    S(this, N, ai).call(this);
    return;
  }
  S(this, N, Tr).call(this);
}, "#syncRunningState"), Tr = /* @__PURE__ */ s(function() {
  v(this, $e) === null && (D(this, Ke, S(this, N, ri).call(this)), D(this, $e, globalThis.setInterval(() => S(this, N, br).call(this), 1e3)), T("GameTimeAutomation | Started real-time ticker"));
}, "#startRealTimeTicker"), ai = /* @__PURE__ */ s(function() {
  v(this, $e) !== null && (globalThis.clearInterval(v(this, $e)), D(this, $e, null), T("GameTimeAutomation | Stopped real-time ticker")), D(this, Ke, null), D(this, ve, 0), D(this, Je, !1);
}, "#stopRealTimeTicker"), br = /* @__PURE__ */ s(function() {
  if (!v(this, he) || !v(this, Oe) || !S(this, N, ot).call(this)) {
    S(this, N, ai).call(this);
    return;
  }
  const t = S(this, N, ri).call(this);
  if (typeof t != "number" || !Number.isFinite(t)) return;
  const n = v(this, Ke) ?? t, i = (t - n) / 1e3;
  if (D(this, Ke, t), !Number.isFinite(i) || i <= 0) return;
  const r = !!(game != null && game.paused), o = S(this, N, $t).call(this);
  if (r || o) {
    v(this, Je) || T("GameTimeAutomation | Tick skipped", { paused: r, combatRunning: o }), D(this, Je, !0), D(this, ve, 0);
    return;
  }
  D(this, Je, !1), T("GameTimeAutomation | Real-time tick", { deltaSeconds: i }), S(this, N, li).call(this, i);
}, "#tickRealTime"), li = /* @__PURE__ */ s(function(t) {
  if (!v(this, he) || !v(this, Oe)) return;
  const n = Number(t);
  !Number.isFinite(n) || n <= 0 || (D(this, ve, v(this, ve) + n), !v(this, dt) && D(this, dt, S(this, N, vr).call(this)));
}, "#queueAdvance"), vr = /* @__PURE__ */ s(async function() {
  var t, n;
  for (; v(this, ve) > 0; ) {
    if (!v(this, he) || !v(this, Oe) || game != null && game.paused || !S(this, N, ot).call(this) || S(this, N, $t).call(this)) {
      D(this, ve, 0);
      break;
    }
    const i = v(this, ve);
    D(this, ve, 0);
    try {
      if (typeof ((t = game == null ? void 0 : game.time) == null ? void 0 : t.advance) == "function")
        T("GameTimeAutomation | Advancing world time", { delta: i }), await game.time.advance(i), T("GameTimeAutomation | World time advanced", {
          worldTime: ((n = game.time) == null ? void 0 : n.worldTime) ?? null
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
  D(this, dt, null);
}, "#flushAdvanceQueue"), cn = new WeakMap(), un = new WeakMap(), dn = new WeakMap(), fn = new WeakMap(), gn = new WeakMap(), mn = new WeakMap(), ci = /* @__PURE__ */ s(function() {
  const t = vt();
  return ae(t) ? t : null;
}, "#getActiveSceneDocument"), Or = /* @__PURE__ */ s(function(t) {
  if (!ae(t)) return !1;
  try {
    return !!t.getFlag(O, Vn);
  } catch (n) {
    return T("GameTimeAutomation | Failed to read scene real-time flag", {
      sceneId: (t == null ? void 0 : t.id) ?? null,
      message: (n == null ? void 0 : n.message) ?? String(n)
    }), !1;
  }
}, "#isSceneRealTimeAllowed"), Vt = /* @__PURE__ */ s(function(t) {
  const n = ae(t) ? t : S(this, N, ci).call(this), i = S(this, N, Or).call(this, n), r = v(this, Oe);
  return D(this, Oe, i), r !== i ? (T("GameTimeAutomation | Scene real-time allowance changed", {
    sceneId: (n == null ? void 0 : n.id) ?? null,
    allows: i
  }), !0) : !1;
}, "#refreshSceneAutomationState"), hn = new WeakMap(), yn = new WeakMap(), s(Ni, "GameTimeAutomation");
let ii = Ni;
var Xi, Ve, se, Ye, Ae, pn, Z, Lr, Ir, Er, Sr, Tn, fi, bn, wr, vn, Cr, Ar;
const we = class we extends Sn(En) {
  constructor(n = {}) {
    const { scene: i, trigger: r, triggerIndex: o, onSave: a, ...l } = n ?? {};
    super(l);
    M(this, Z);
    M(this, Ve, null);
    M(this, se, null);
    M(this, Ye, null);
    M(this, Ae, null);
    M(this, pn, /* @__PURE__ */ s(() => {
      (this.rendered ?? this.isRendered ?? !1) && (D(this, Ae, S(this, Z, Lr).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    M(this, Tn, /* @__PURE__ */ s((n) => {
      var o, a;
      const i = n.currentTarget, r = i == null ? void 0 : i.closest("form");
      r && (T("Trigger action selection changed", {
        sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
        triggerId: ((a = this.trigger) == null ? void 0 : a.id) ?? null,
        actionId: (i == null ? void 0 : i.value) ?? null
      }), S(this, Z, fi).call(this, i.value, r));
    }, "#onActionSelectChange"));
    M(this, bn, /* @__PURE__ */ s((n) => {
      var u, d, h, m;
      n.preventDefault();
      const i = n.currentTarget, r = i == null ? void 0 : i.closest("form");
      if (!r) return;
      const o = (u = i.dataset) == null ? void 0 : u.target;
      if (!o) return;
      const a = typeof (CSS == null ? void 0 : CSS.escape) == "function" ? CSS.escape : (p) => p, l = r.querySelector(`[name="${a(o)}"]`);
      if (!l) return;
      T("Opening file picker for trigger", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        triggerId: ((h = this.trigger) == null ? void 0 : h.id) ?? null,
        target: o
      }), new FilePicker({
        type: ((m = i.dataset) == null ? void 0 : m.type) || "audio",
        current: l.value,
        callback: /* @__PURE__ */ s((p) => {
          var g, L;
          l.value = p, l.dispatchEvent(new Event("change")), T("Trigger form file selected", {
            sceneId: ((g = this.scene) == null ? void 0 : g.id) ?? null,
            triggerId: ((L = this.trigger) == null ? void 0 : L.id) ?? null,
            target: o,
            path: p
          });
        }, "callback")
      }).render({ force: !0 });
    }, "#onFilePicker"));
    M(this, vn, /* @__PURE__ */ s(async (n) => {
      var r, o;
      n.preventDefault();
      const i = n.currentTarget;
      i instanceof HTMLFormElement && (T("Trigger form submitted", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null,
        triggerId: ((o = this.trigger) == null ? void 0 : o.id) ?? null
      }), await S(this, Z, Cr).call(this, i));
    }, "#onSubmit"));
    this.scene = i ?? null, this.trigger = r ?? null, this.triggerIndex = Number.isInteger(o) ? Number(o) : null, this.onSave = typeof a == "function" ? a : null, D(this, Ye, Li(v(this, pn)));
  }
  async _prepareContext() {
    var n, i;
    ft("TriggerFormApplication#_prepareContext", {
      sceneId: ((n = this.scene) == null ? void 0 : n.id) ?? null,
      triggerId: ((i = this.trigger) == null ? void 0 : i.id) ?? null,
      triggerIndex: this.triggerIndex
    });
    try {
      const r = this.trigger ?? { action: Rt, data: {} }, o = r.action ?? Rt, a = Hi(r.time), l = a.format ?? "12h", c = l === "12h" ? Oo() : [], u = a.period ?? (c.length > 0 ? c[0].value : null), d = l === "12h" ? c.map((p) => ({
        ...p,
        selected: p.value === u
      })) : [], h = Ri().map((p) => ({
        id: p.id,
        label: typeof p.label == "function" ? p.label() : p.label,
        selected: p.id === o
      })), m = Ri().map((p) => {
        const g = p.id === r.action ? r : { ...r, action: p.id }, L = mo(g);
        return L ? {
          id: p.id,
          visible: p.id === o,
          content: L
        } : null;
      }).filter(Boolean);
      return {
        timeValue: a.canonical ?? "",
        timeHourValue: a.hour ?? "",
        timeMinuteValue: a.minute ?? "",
        timePeriodValue: u ?? "",
        timeFormat: l,
        is12HourFormat: l === "12h",
        is24HourFormat: l === "24h",
        timePeriodOptions: d,
        actions: h,
        actionSections: m,
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
      ke();
    }
  }
  _onRender(n, i) {
    var c, u, d;
    super._onRender(n, i);
    const r = this.element;
    if (!r) return;
    T("Trigger form rendered", {
      sceneId: ((c = this.scene) == null ? void 0 : c.id) ?? null,
      triggerId: ((u = this.trigger) == null ? void 0 : u.id) ?? null
    });
    const o = Array.from(((d = document == null ? void 0 : document.body) == null ? void 0 : d.classList) ?? []).find(
      (h) => h.startsWith("theme-")
    );
    o && r.classList.add(o);
    const a = r.querySelector("form");
    if (!a) return;
    S(this, Z, wr).call(this, a), S(this, Z, Ir).call(this, a), a.addEventListener("submit", v(this, vn));
    const l = a.querySelector("[data-action-select]");
    l && (l.addEventListener("change", v(this, Tn)), S(this, Z, fi).call(this, l.value, a)), a.querySelectorAll("[data-action-file-picker]").forEach((h) => {
      h.addEventListener("click", v(this, bn));
    });
  }
  async close(n = {}) {
    var i;
    if ((i = v(this, Ve)) == null || i.call(this), D(this, Ve, null), D(this, se, null), D(this, Ae, null), typeof v(this, Ye) == "function")
      try {
        v(this, Ye).call(this);
      } catch (r) {
        console.error(`${O} | Failed to dispose trigger form time format subscription`, r);
      }
    return D(this, Ye, null), super.close(n);
  }
};
Ve = new WeakMap(), se = new WeakMap(), Ye = new WeakMap(), Ae = new WeakMap(), pn = new WeakMap(), Z = new WeakSet(), Lr = /* @__PURE__ */ s(function() {
  var l, c, u, d, h, m, p;
  const n = (c = (l = this.element) == null ? void 0 : l.querySelector) == null ? void 0 : c.call(l, "form");
  if (!(n instanceof HTMLFormElement)) return null;
  const i = Array.from(n.elements ?? []), r = [];
  for (const g of i)
    if ((g instanceof HTMLInputElement || g instanceof HTMLSelectElement || g instanceof HTMLTextAreaElement) && g.name && !(((u = g.dataset) == null ? void 0 : u.timeHidden) !== void 0 || ((d = g.dataset) == null ? void 0 : d.timeHour) !== void 0 || ((h = g.dataset) == null ? void 0 : h.timeMinute) !== void 0 || ((m = g.dataset) == null ? void 0 : m.timePeriod) !== void 0)) {
      if (g instanceof HTMLInputElement) {
        if (g.type === "checkbox" || g.type === "radio") {
          r.push({
            kind: g.type,
            name: g.name,
            value: g.value,
            checked: g.checked
          });
          continue;
        }
        r.push({
          kind: "value",
          name: g.name,
          value: g.value
        });
        continue;
      }
      if (g instanceof HTMLSelectElement) {
        g.multiple ? r.push({
          kind: "select-multiple",
          name: g.name,
          values: Array.from(g.selectedOptions ?? []).map((L) => L.value)
        }) : r.push({
          kind: "value",
          name: g.name,
          value: g.value
        });
        continue;
      }
      r.push({
        kind: "value",
        name: g.name,
        value: g.value
      });
    }
  const o = n.querySelector("[data-time-format]");
  let a = null;
  if (o instanceof HTMLElement) {
    const g = o.querySelector("[data-time-hidden]"), L = o.querySelector("[data-time-hour]"), I = o.querySelector("[data-time-minute]"), b = o.querySelector("[data-time-period]");
    a = {
      format: ((p = o.dataset) == null ? void 0 : p.timeFormat) ?? null,
      canonical: g instanceof HTMLInputElement ? g.value : "",
      hour: L instanceof HTMLInputElement ? L.value : "",
      minute: I instanceof HTMLInputElement ? I.value : "",
      period: b instanceof HTMLSelectElement ? b.value : ""
    };
  }
  return {
    fields: r,
    time: a
  };
}, "#captureFormState"), Ir = /* @__PURE__ */ s(function(n) {
  if (!v(this, Ae)) return;
  if (!(n instanceof HTMLFormElement)) {
    D(this, Ae, null);
    return;
  }
  const { fields: i = [], time: r = null } = v(this, Ae) ?? {};
  D(this, Ae, null), S(this, Z, Er).call(this, n, i), S(this, Z, Sr).call(this, n, r);
}, "#restorePendingFormState"), Er = /* @__PURE__ */ s(function(n, i) {
  if (!Array.isArray(i) || i.length === 0) return;
  const r = typeof (CSS == null ? void 0 : CSS.escape) == "function" ? CSS.escape : (o) => o;
  for (const o of i) {
    if (!o || typeof o.name != "string") continue;
    const a = r(o.name);
    if (o.kind === "checkbox" || o.kind === "radio") {
      const c = `input[type="${o.kind}"][name="${a}"]`, u = n.querySelectorAll(c);
      u.forEach((d) => {
        d instanceof HTMLInputElement && (u.length === 1 || d.value === o.value) && (d.checked = !!o.checked);
      });
      continue;
    }
    if (o.kind === "select-multiple") {
      const c = n.querySelector(`select[name="${a}"]`);
      if (!(c instanceof HTMLSelectElement)) continue;
      const u = new Set(Array.isArray(o.values) ? o.values : []);
      Array.from(c.options ?? []).forEach((d) => {
        d.selected = u.has(d.value);
      });
      continue;
    }
    const l = n.querySelector(`[name="${a}"]`);
    (l instanceof HTMLInputElement || l instanceof HTMLSelectElement || l instanceof HTMLTextAreaElement) && (l.value = o.value ?? "");
  }
}, "#restoreFieldValues"), Sr = /* @__PURE__ */ s(function(n, i) {
  var w, A, R;
  const r = n.querySelector("[data-time-format]");
  if (!(r instanceof HTMLElement)) {
    typeof v(this, se) == "function" && v(this, se).call(this);
    return;
  }
  const o = ((w = r.dataset) == null ? void 0 : w.timeFormat) === "24h" ? "24h" : "12h", a = r.querySelector("[data-time-hour]"), l = r.querySelector("[data-time-minute]"), c = r.querySelector("[data-time-period]"), u = r.querySelector("[data-time-hidden]");
  if (!i) {
    if (a instanceof HTMLInputElement && (a.value = ""), l instanceof HTMLInputElement && (l.value = ""), c instanceof HTMLSelectElement) {
      const _ = ((R = (A = c.options) == null ? void 0 : A[0]) == null ? void 0 : R.value) ?? "";
      c.value = _;
    }
    u instanceof HTMLInputElement && (u.value = ""), typeof v(this, se) == "function" && v(this, se).call(this);
    return;
  }
  const d = typeof i.canonical == "string" ? i.canonical : "", h = typeof i.period == "string" ? i.period : "", m = typeof i.hour == "string" ? i.hour : "", p = typeof i.minute == "string" ? i.minute : "";
  let g = "", L = "", I = h, b = d;
  if (d) {
    const _ = Hi(d, o);
    g = _.hour ?? "", L = _.minute ?? "", b = _.canonical ?? d, o === "12h" ? I = _.period ?? h : I = "";
  } else
    g = m, L = p, o !== "12h" && (I = "");
  if (a instanceof HTMLInputElement && (a.value = g ?? ""), l instanceof HTMLInputElement && (l.value = L ?? ""), c instanceof HTMLSelectElement)
    if (o === "12h") {
      const _ = Array.from(c.options ?? []);
      _.find((F) => F.value === I) ? c.value = I : _.length > 0 ? c.value = _[0].value : c.value = "";
    } else
      c.value = "";
  u instanceof HTMLInputElement && (u.value = b ?? ""), typeof v(this, se) == "function" && v(this, se).call(this);
}, "#restoreTimeInputs"), Tn = new WeakMap(), fi = /* @__PURE__ */ s(function(n, i) {
  i && i.querySelectorAll("[data-action-config]").forEach((r) => {
    const o = r.dataset.actionConfig === n;
    r.style.display = o ? "" : "none";
  });
}, "#updateActionSections"), bn = new WeakMap(), wr = /* @__PURE__ */ s(function(n) {
  var h, m, p, g;
  if ((h = v(this, Ve)) == null || h.call(this), D(this, Ve, null), D(this, se, null), !(n instanceof HTMLFormElement)) return;
  const i = n.querySelector("[data-time-format]"), r = ((m = i == null ? void 0 : i.dataset) == null ? void 0 : m.timeFormat) ?? null;
  if (r !== "12h" && r !== "24h")
    return;
  const o = i.querySelector("[data-time-hidden]"), a = i.querySelector("[data-time-hour]"), l = i.querySelector("[data-time-minute]"), c = r === "12h" ? i.querySelector("[data-time-period]") : null;
  if (!o || !a || !l || r === "12h" && !c) {
    T("Trigger form time inputs missing elements", {
      format: r,
      hasHidden: !!o,
      hasHour: !!a,
      hasMinute: !!l,
      hasPeriod: !!c
    });
    return;
  }
  const u = [a, l, ...c ? [c] : []], d = /* @__PURE__ */ s(() => {
    const { canonical: L, error: I } = vo(
      {
        hour: a.value,
        minute: l.value,
        period: (c == null ? void 0 : c.value) ?? null,
        time: o.value
      },
      r
    );
    o.value = L ?? "";
    const b = I ?? "";
    o.setCustomValidity(b), u.forEach((w) => {
      w.setCustomValidity(b);
    });
  }, "update");
  u.forEach((L) => {
    L.addEventListener("input", d), L.addEventListener("change", d);
  }), d(), D(this, Ve, () => {
    u.forEach((L) => {
      L.removeEventListener("input", d), L.removeEventListener("change", d);
    });
  }), D(this, se, d), T("Trigger form configured for time input", {
    format: r,
    sceneId: ((p = this.scene) == null ? void 0 : p.id) ?? null,
    triggerId: ((g = this.trigger) == null ? void 0 : g.id) ?? null
  });
}, "#setupTimeInput"), vn = new WeakMap(), Cr = /* @__PURE__ */ s(async function(n) {
  var o, a, l, c, u;
  if (typeof v(this, se) == "function" && v(this, se).call(this), typeof n.checkValidity == "function" && !n.checkValidity()) {
    typeof n.reportValidity == "function" && n.reportValidity(), T("Trigger form submission blocked by validity check", {
      sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
      triggerId: ((a = this.trigger) == null ? void 0 : a.id) ?? null
    });
    return;
  }
  const i = new FormData(n), r = Object.fromEntries(i.entries());
  delete r.timeHour, delete r.timeMinute, delete r.timePeriod, r.allowReplayOnRewind = ((l = n.querySelector('input[name="allowReplayOnRewind"]')) == null ? void 0 : l.checked) ?? !1, T("Processing trigger form submission", {
    sceneId: ((c = this.scene) == null ? void 0 : c.id) ?? null,
    triggerId: ((u = this.trigger) == null ? void 0 : u.id) ?? null,
    allowReplayOnRewind: r.allowReplayOnRewind
  }), await S(this, Z, Ar).call(this, r), await this.close();
}, "#handleSubmit"), Ar = /* @__PURE__ */ s(async function(n) {
  var o, a, l, c, u, d;
  const i = {
    id: ((o = this.trigger) == null ? void 0 : o.id) ?? eo(),
    time: n.time ?? "",
    action: n.action ?? Rt,
    allowReplayOnRewind: !!n.allowReplayOnRewind,
    data: {}
  };
  T("Persisting trigger from form", {
    sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
    triggerId: i.id,
    existingIndex: this.triggerIndex
  }), ho(i, n);
  const r = at(this.scene);
  this.triggerIndex !== null && r[this.triggerIndex] ? r[this.triggerIndex] = i : r.push(i);
  try {
    await ar(this.scene, r), T("Trigger list saved", {
      sceneId: ((l = this.scene) == null ? void 0 : l.id) ?? null,
      triggerCount: r.length
    });
  } catch (h) {
    throw console.error(`${O} | Failed to save time trigger`, h), (u = (c = ui.notifications) == null ? void 0 : c.error) == null || u.call(
      c,
      f(
        "EIDOLON.TimeTrigger.TriggerSaveError",
        "Failed to save the scene's time triggers."
      )
    ), h;
  }
  if (this.onSave)
    try {
      this.onSave(r);
    } catch (h) {
      console.error(`${O} | Trigger onSave callback failed`, h), T("Trigger onSave callback failed", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        message: (h == null ? void 0 : h.message) ?? String(h)
      });
    }
}, "#persistTrigger"), s(we, "TriggerFormApplication"), qe(we, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  it(we, we, "DEFAULT_OPTIONS"),
  {
    id: `${O}-trigger-form`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Xi = it(we, we, "DEFAULT_OPTIONS")) == null ? void 0 : Xi.classes) ?? [], "standard-form", "themed"])
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
)), qe(we, "PARTS", {
  content: {
    template: `modules/${O}/templates/time-trigger-form.html`
  }
});
let di = we;
function gi(e) {
  return e instanceof HTMLElement ? e : (e == null ? void 0 : e[0]) instanceof HTMLElement ? e[0] : null;
}
s(gi, "asHTMLElement");
function kt(e) {
  return typeof (e == null ? void 0 : e.changeTab) == "function";
}
s(kt, "isAppV2");
function Io(e, t, n, i = {}) {
  if (kt(e)) {
    e.changeTab(t, n, i);
    return;
  }
  if (typeof (e == null ? void 0 : e.activateTab) == "function") {
    const r = { ...i };
    n != null && (r.group = n), r.triggerCallback == null && (r.triggerCallback = !0), e.activateTab(t, r);
  }
}
s(Io, "setActiveTab");
function Eo(e) {
  var n, i;
  if (!(e instanceof HTMLFormElement)) return {};
  const t = ((i = (n = foundry == null ? void 0 : foundry.applications) == null ? void 0 : n.ux) == null ? void 0 : i.FormDataExtended) ?? globalThis.FormDataExtended ?? null;
  if (!t) return {};
  try {
    const r = new t(e), o = typeof r.object == "object" ? r.object : {};
    return foundry.utils.expandObject(o);
  } catch {
    return {};
  }
}
s(Eo, "readFormData");
const Vi = Symbol.for("eidolon.sceneConfig.v13PatchedTabs");
function Nr(e = {}) {
  const {
    tabId: t,
    tabLabel: n,
    getScene: i,
    isApplicable: r,
    renderContent: o,
    debugNamespace: a = "SceneConfigTab",
    onButtonCreate: l,
    onTabCreate: c,
    onAfterRender: u,
    logger: d = {},
    moduleId: h = "eidolon-utilities",
    tabIcon: m = "fa-solid fa-puzzle-piece"
  } = e ?? {};
  if (!t)
    throw new Error("createSceneConfigTabFactory requires a tabId.");
  if (typeof o != "function")
    throw new TypeError("createSceneConfigTabFactory requires a renderContent callback.");
  const p = typeof d.log == "function" ? d.log.bind(d) : (...E) => {
    var U;
    return (U = console.debug) == null ? void 0 : U.call(console, `${a}`, ...E);
  }, g = typeof d.group == "function" ? d.group.bind(d) : (...E) => {
    var U;
    return (U = console.groupCollapsed) == null ? void 0 : U.call(console, `${a}`, ...E);
  }, L = typeof d.groupEnd == "function" ? d.groupEnd.bind(d) : () => {
    var E;
    return (E = console.groupEnd) == null ? void 0 : E.call(console);
  }, I = Symbol(`EIDOLON_SCENE_CONFIG_TAB_CLEANUP_${t}`), b = typeof i == "function" ? i : () => null, w = typeof r == "function" ? r : () => !0, A = typeof n == "function" ? n : () => typeof n == "string" ? n : t;
  function R() {
    var V, y, W, P, ne;
    const E = ((y = (V = foundry == null ? void 0 : foundry.applications) == null ? void 0 : V.sheets) == null ? void 0 : y.SceneConfig) ?? ((W = CONFIG == null ? void 0 : CONFIG.Scene) == null ? void 0 : W.sheetClass);
    if (!E || !kt({ changeTab: (P = E.prototype) == null ? void 0 : P.changeTab })) return;
    const U = E[Vi] ?? /* @__PURE__ */ new Set();
    if (U.has(t)) return;
    U.add(t), E[Vi] = U;
    const $ = (ne = E.TABS) == null ? void 0 : ne.sheet;
    $ && Array.isArray($.tabs) && ($.tabs.some((z) => z.id === t) || $.tabs.push({
      id: t,
      icon: m
    })), E.PARTS && !E.PARTS[t] && (E.PARTS[t] = {
      template: `modules/${h}/templates/scene-config-tab-mount.hbs`,
      scrollable: [`.tab[data-tab="${t}"]`]
    }), p("Patched v13 SceneConfig TABS/PARTS", { tabId: t });
  }
  s(R, "patchV13SceneConfig");
  function _(E, U) {
    var V, y;
    const $ = b(E);
    if (!w(E, $)) {
      p("Skipped render", {
        tabId: t,
        reason: "inapplicable",
        constructor: ((V = E == null ? void 0 : E.constructor) == null ? void 0 : V.name) ?? null
      });
      return;
    }
    g("render", {
      tabId: t,
      sceneId: ($ == null ? void 0 : $.id) ?? null,
      constructor: ((y = E == null ? void 0 : E.constructor) == null ? void 0 : y.name) ?? null
    });
    try {
      const W = gi(U) ?? gi(E.element);
      if (!W) {
        p("Missing root element", { tabId: t });
        return;
      }
      kt(E) ? B(E, W, $) : F(E, W, $);
    } finally {
      L();
    }
  }
  s(_, "handleRender");
  function x(E, U, $) {
    var W;
    if (!m) {
      E.textContent = U;
      return;
    }
    const V = (W = E.querySelector("i")) == null ? void 0 : W.cloneNode(!0);
    E.textContent = "";
    const y = V ?? document.createElement("i");
    if (V || (y.className = m, $ && (y.inert = !0)), E.append(y, " "), $) {
      const P = document.createElement("span");
      P.textContent = U, E.append(P);
    } else
      E.append(document.createTextNode(U));
  }
  s(x, "setButtonContent");
  function F(E, U, $) {
    var J, G, Y, Q, X, le, re, ce, Me, me, De, Fe, Pe, Te, _e, Ee;
    const y = [
      "nav.sheet-tabs[data-group]",
      "nav.tabs[data-group]",
      "nav.sheet-tabs",
      "nav.tabs"
    ].map((te) => U.querySelector(te)).find((te) => te instanceof HTMLElement), P = [
      (J = U.querySelector(".tab[data-tab]")) == null ? void 0 : J.parentElement,
      U.querySelector(".sheet-body"),
      (Y = (G = y == null ? void 0 : y.parentElement) == null ? void 0 : G.querySelector) == null ? void 0 : Y.call(G, ":scope > .sheet-body"),
      y == null ? void 0 : y.parentElement
    ].find((te) => te instanceof HTMLElement), ne = ((Q = y == null ? void 0 : y.dataset) == null ? void 0 : Q.group) ?? ((re = (le = (X = y == null ? void 0 : y.querySelector) == null ? void 0 : X.call(y, "a[data-group]")) == null ? void 0 : le.dataset) == null ? void 0 : re.group) ?? ((me = (Me = (ce = y == null ? void 0 : y.querySelector) == null ? void 0 : ce.call(y, "[data-group]")) == null ? void 0 : Me.dataset) == null ? void 0 : me.group) ?? ((Pe = (Fe = (De = P == null ? void 0 : P.querySelector) == null ? void 0 : De.call(P, ".tab[data-group]")) == null ? void 0 : Fe.dataset) == null ? void 0 : Pe.group) ?? "main";
    if (!y || !P) {
      p("Missing navigation elements", {
        tabId: t,
        hasNav: !!y,
        hasBody: !!P
      });
      return;
    }
    let z = y.querySelector(`[data-tab="${t}"]`);
    if (!z) {
      z = document.createElement("a"), z.dataset.action = "tab", z.dataset.group = ne, z.dataset.tab = t;
      const te = y.querySelector("a[data-tab]");
      (Te = te == null ? void 0 : te.classList) != null && Te.contains("item") && z.classList.add("item"), y.appendChild(z), typeof l == "function" && l({ app: E, button: z, nav: y, scene: $ }), p("Created tab button", { tabId: t, group: ne });
    }
    x(z, A({ app: E, scene: $ }) ?? t, kt(E));
    let K = P.querySelector(`.tab[data-tab="${t}"]`);
    if (!K) {
      K = document.createElement("div"), K.classList.add("tab"), K.dataset.tab = t, K.dataset.group = ne;
      const te = So(P);
      P.insertBefore(K, te ?? null), typeof c == "function" && c({ app: E, tab: K, body: P, scene: $ }), p("Created tab container", { tabId: t, group: ne });
    }
    ((_e = z.classList) == null ? void 0 : _e.contains("active")) || K.classList.contains("active") ? (z.classList.add("active"), K.classList.add("active"), K.removeAttribute("hidden")) : (z.classList.remove("active"), K.classList.remove("active"), K.setAttribute("hidden", "true"));
    const Ne = /* @__PURE__ */ s(() => {
      var pt, je;
      ((pt = z.classList) != null && pt.contains("active") || K.classList.contains("active")) && ((je = z.classList) == null || je.add("active"), K.classList.add("active"), K.removeAttribute("hidden"), K.removeAttribute("aria-hidden"), K.style.display === "none" && (K.style.display = ""));
    }, "ensureTabVisible"), C = /* @__PURE__ */ s(() => {
      Ne(), requestAnimationFrame(Ne);
    }, "scheduleEnsureTabVisible");
    z.dataset.eidolonEnsureSceneTabVisibility || (z.addEventListener("click", () => {
      Io(E, t, ne), requestAnimationFrame(Ne);
    }), z.dataset.eidolonEnsureSceneTabVisibility = "true"), Rn(E, I, p);
    const k = o({
      app: E,
      scene: $,
      tab: K,
      tabButton: z,
      ensureTabVisible: Ne,
      scheduleEnsureTabVisible: C
    });
    typeof k == "function" && ki(E, I, k), typeof u == "function" && u({
      app: E,
      scene: $,
      tab: K,
      tabButton: z,
      ensureTabVisible: Ne,
      scheduleEnsureTabVisible: C
    }), (Ee = E.setPosition) == null || Ee.call(E, { height: "auto" });
  }
  s(F, "handleRenderV1");
  function B(E, U, $) {
    const V = U.querySelector(`.tab[data-tab="${t}"]`), y = U.querySelector(`nav [data-tab="${t}"]`);
    if (!V || !y) {
      p("v2 mount not found, falling back to v1 injection", { tabId: t }), F(E, U, $);
      return;
    }
    x(y, A({ app: E, scene: $ }) ?? t, !0);
    const W = /* @__PURE__ */ s(() => {
      var z;
      !((z = y.classList) != null && z.contains("active")) && !V.classList.contains("active") || (V.classList.add("active"), V.removeAttribute("hidden"), V.removeAttribute("aria-hidden"), V.style.display === "none" && (V.style.display = ""));
    }, "ensureTabVisible"), P = /* @__PURE__ */ s(() => {
      W(), requestAnimationFrame(W);
    }, "scheduleEnsureTabVisible");
    Rn(E, I, p);
    const ne = o({
      app: E,
      scene: $,
      tab: V,
      tabButton: y,
      ensureTabVisible: W,
      scheduleEnsureTabVisible: P
    });
    typeof ne == "function" && ki(E, I, ne), typeof u == "function" && u({
      app: E,
      scene: $,
      tab: V,
      tabButton: y,
      ensureTabVisible: W,
      scheduleEnsureTabVisible: P
    });
  }
  s(B, "handleRenderV2");
  function H(E) {
    Rn(E, I, p);
  }
  s(H, "handleClose");
  function q() {
    return Hooks.once("init", () => {
      R();
    }), Hooks.on("renderSceneConfig", _), Hooks.on("closeSceneConfig", H), () => ie();
  }
  s(q, "register");
  function ie() {
    Hooks.off("renderSceneConfig", _), Hooks.off("closeSceneConfig", H);
  }
  return s(ie, "unregister"), { register: q, unregister: ie };
}
s(Nr, "createSceneConfigTabFactory");
function ki(e, t, n) {
  if (!e || typeof n != "function") return;
  const i = e == null ? void 0 : e[t];
  Array.isArray(i) || (e[t] = []), e[t].push(n);
}
s(ki, "registerCleanup");
function Rn(e, t, n) {
  if (!e) return;
  const i = e == null ? void 0 : e[t];
  if (Array.isArray(i))
    for (; i.length > 0; ) {
      const r = i.pop();
      if (typeof r == "function")
        try {
          r();
        } catch (o) {
          n("Cleanup failed", { message: (o == null ? void 0 : o.message) ?? String(o) });
        }
    }
}
s(Rn, "invokeCleanup");
function So(e) {
  if (!(e instanceof HTMLElement)) return null;
  const t = [
    ":scope > footer.sheet-footer",
    ":scope > footer.form-footer",
    ":scope > .sheet-footer",
    ":scope > .form-footer",
    ":scope > footer"
  ];
  for (const n of t) {
    const i = e.querySelector(n);
    if (i instanceof HTMLElement) return i;
  }
  return null;
}
s(So, "findFooterElement");
const wo = Ei(di), Co = `modules/${O}/templates/time-trigger-scene-tab.html`, Ao = Nr({
  tabId: "time-triggers",
  tabLabel: /* @__PURE__ */ s(() => f("EIDOLON.TimeTrigger.Tab", "Time Triggers"), "tabLabel"),
  getScene: Ie,
  isApplicable: Fo,
  renderContent: /* @__PURE__ */ s(({ app: e, scene: t, tab: n }) => Mo(e, n, t), "renderContent"),
  logger: {
    log: T,
    group: ft,
    groupEnd: ke
  }
});
function No() {
  return T("Registering SceneConfig render hook"), Ao.register();
}
s(No, "registerSceneConfigHook");
function Mo(e, t, n) {
  if (!(t instanceof HTMLElement)) return;
  const i = ae(n) ? n : Ie(e);
  Kt(e, t, i);
  const r = Li(() => {
    Kt(e, t, i);
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
s(Mo, "renderTimeTriggerTab");
async function Kt(e, t, n) {
  var r, o;
  const i = n ?? Ie(e);
  ft("renderTimeTriggersTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!ae(i)) {
      const V = f(
        "EIDOLON.TimeTrigger.Unavailable",
        "Time triggers are unavailable for this configuration sheet."
      );
      t.innerHTML = `<p class="notes">${V}</p>`, T("Scene lacks document for time triggers", { sceneId: (i == null ? void 0 : i.id) ?? null });
      return;
    }
    const a = `flags.${O}.${jt}`, l = `flags.${O}.${Hn}`, c = `flags.${O}.${$n}`, u = !!i.getFlag(O, jt), d = !!i.getFlag(O, Hn), h = !!i.getFlag(O, $n), m = at(i);
    T("Rendering time trigger list", {
      sceneId: i.id,
      isActive: u,
      shouldHideWindow: d,
      shouldShowPlayerWindow: h,
      triggerCount: m.length
    });
    const p = f("EIDOLON.TimeTrigger.Activate", "Activate Time Trigger"), g = f(
      "EIDOLON.TimeTrigger.Description",
      "Enable scene time triggers so scheduled actions can run automatically."
    ), L = f(
      "EIDOLON.TimeTrigger.HideWindowLabel",
      "Hide Floating Time Window"
    ), I = f(
      "EIDOLON.TimeTrigger.HideWindowDescription",
      "Keep the floating time control window hidden while leaving time triggers active."
    ), b = f(
      "EIDOLON.TimeTrigger.ShowPlayerWindowLabel",
      "Share Floating Time Window with Players"
    ), w = f(
      "EIDOLON.TimeTrigger.ShowPlayerWindowDescription",
      "Let non-GM players see the floating time window (without time controls)."
    ), A = f(
      "EIDOLON.TimeTrigger.TriggerListLabel",
      "Scene Time Triggers"
    ), R = f(
      "EIDOLON.TimeTrigger.TriggerListEmpty",
      "No time triggers configured for this scene."
    ), _ = f("EIDOLON.TimeTrigger.AddTrigger", "Add Trigger"), x = f("EIDOLON.TimeTrigger.EditTrigger", "Edit"), F = f("EIDOLON.TimeTrigger.DeleteTrigger", "Remove"), B = f("EIDOLON.TimeTrigger.TriggerNow", "Trigger Now"), H = f("EIDOLON.TimeTrigger.AtLabel", "At"), q = f("EIDOLON.TimeTrigger.DoLabel", "Do"), ie = f("EIDOLON.TimeTrigger.MissingTime", "(No time set)"), E = m.map((V, y) => {
      const ne = (V.time ? bo(V.time) : "") || V.time || "" || ie, z = fo(V.action), K = [
        `${H} ${ne}`,
        `${q} ${z}`,
        ...go(V)
      ];
      return {
        index: y,
        summaryParts: K,
        tooltips: {
          triggerNow: B,
          edit: x,
          delete: F
        }
      };
    }), U = ((o = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : o.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof U != "function") {
      console.error(`${O} | renderTemplate is unavailable; cannot render scene tab.`), t.innerHTML = `<p class="notes">${R}</p>`;
      return;
    }
    let $ = "";
    try {
      $ = await U(Co, {
        flags: {
          active: a,
          hideWindow: l,
          showPlayerWindow: c
        },
        states: {
          isActive: u,
          hideWindow: d,
          showPlayerWindow: h
        },
        labels: {
          activate: p,
          hideWindow: L,
          showPlayerWindow: b,
          triggerList: A,
          empty: R,
          add: _
        },
        hints: {
          activate: g,
          hideWindow: I,
          showPlayerWindow: w
        },
        triggers: E,
        hasTriggers: E.length > 0
      });
    } catch (V) {
      console.error(`${O} | Failed to render time trigger scene tab template`, V), t.innerHTML = `<p class="notes">${R}</p>`;
      return;
    }
    t.innerHTML = $, Do(e, t, i);
  } finally {
    ke();
  }
}
s(Kt, "renderTimeTriggersTabContent");
function Do(e, t, n) {
  const i = n ?? Ie(e);
  if (!ae(i)) return;
  const r = t.querySelector('[data-action="add-trigger"]');
  r && r.addEventListener("click", () => {
    T("Add trigger button clicked", { sceneId: i.id }), xi(e, { scene: i });
  }), t.querySelectorAll('[data-action="edit-trigger"]').forEach((o) => {
    o.addEventListener("click", () => {
      const a = Number(o.dataset.index);
      if (!Number.isInteger(a)) return;
      const c = at(i)[a];
      c && (T("Edit trigger button clicked", { sceneId: i.id, triggerId: c.id, index: a }), xi(e, { trigger: c, triggerIndex: a, scene: i }));
    });
  }), t.querySelectorAll('[data-action="delete-trigger"]').forEach((o) => {
    o.addEventListener("click", async () => {
      var u, d;
      const a = Number(o.dataset.index);
      if (!Number.isInteger(a)) return;
      const l = at(i), c = l[a];
      if (c) {
        l.splice(a, 1);
        try {
          T("Deleting trigger", {
            sceneId: i.id,
            index: a,
            triggerId: (c == null ? void 0 : c.id) ?? null
          }), await ar(i, l), await Kt(e, t, i);
        } catch (h) {
          console.error(`${O} | Failed to delete time trigger`, h), (d = (u = ui.notifications) == null ? void 0 : u.error) == null || d.call(
            u,
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
      var u, d, h, m, p, g, L;
      const a = Number(o.dataset.index);
      if (!Number.isInteger(a)) return;
      const c = at(i)[a];
      if (c) {
        if (!((u = game.user) != null && u.isGM)) {
          (h = (d = ui.notifications) == null ? void 0 : d.warn) == null || h.call(
            d,
            f("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time.")
          );
          return;
        }
        try {
          T("Manually firing trigger", { sceneId: i.id, triggerId: c.id, index: a }), await lr(i, c), (p = (m = ui.notifications) == null ? void 0 : m.info) == null || p.call(
            m,
            f(
              "EIDOLON.TimeTrigger.TriggerNowSuccess",
              "Triggered the selected time trigger."
            )
          );
        } catch (I) {
          console.error(`${O} | Failed to execute time trigger manually`, I), (L = (g = ui.notifications) == null ? void 0 : g.error) == null || L.call(
            g,
            f(
              "EIDOLON.TimeTrigger.TriggerNowError",
              "Failed to execute the selected time trigger."
            )
          ), T("Manual trigger execution failed", {
            sceneId: i.id,
            triggerId: c.id,
            index: a,
            message: (I == null ? void 0 : I.message) ?? String(I)
          });
        }
      }
    });
  });
}
s(Do, "bindTimeTriggerTabEvents");
function xi(e, t = {}) {
  var a;
  const n = t.scene ?? null, i = n && ae(n) ? n : Ie(e);
  if (!ae(i)) {
    console.warn(`${O} | Unable to open trigger form because no scene document is available.`);
    return;
  }
  T("Opening trigger form", {
    sceneId: i.id,
    triggerId: ((a = t.trigger) == null ? void 0 : a.id) ?? null,
    index: Number.isInteger(t.triggerIndex) ? Number(t.triggerIndex) : null
  }), wo({
    scene: i,
    trigger: t.trigger ?? null,
    triggerIndex: t.triggerIndex ?? null,
    onSave: /* @__PURE__ */ s(() => {
      var c, u;
      const l = (u = (c = e.element) == null ? void 0 : c[0]) == null ? void 0 : u.querySelector('.tab[data-tab="time-triggers"]');
      l && Kt(e, l, i);
    }, "onSave")
  }).render({ force: !0 });
}
s(xi, "openTriggerForm");
function Fo(e, t) {
  var o, a, l, c, u;
  if (!e) return !1;
  const n = ((a = (o = foundry == null ? void 0 : foundry.applications) == null ? void 0 : o.sheets) == null ? void 0 : a.SceneConfig) ?? (globalThis == null ? void 0 : globalThis.SceneConfig);
  if (n && e instanceof n) return !0;
  const i = (l = e == null ? void 0 : e.constructor) == null ? void 0 : l.name;
  if (typeof i == "string" && i.includes("SceneConfig")) return !0;
  if (t) {
    const d = globalThis == null ? void 0 : globalThis.Scene;
    if (d && t instanceof d || (t == null ? void 0 : t.documentName) === "Scene" || (t == null ? void 0 : t.documentName) === "scenes" || (t == null ? void 0 : t.collection) === "scenes") return !0;
  }
  const r = ((c = e == null ? void 0 : e.options) == null ? void 0 : c.baseApplication) ?? ((u = e == null ? void 0 : e.options) == null ? void 0 : u.id);
  return !!(typeof r == "string" && r.includes("SceneConfig"));
}
s(Fo, "isRecognizedSceneConfig");
const Mt = new ni(), Ui = new ii();
function Po() {
  T("Registering time trigger hooks"), Hooks.once("init", () => {
    to(), ao(), T("Time trigger settings registered during init");
  }), No(), T("Scene config hook registered"), Ui.registerHooks(), T("Time automation hooks registered"), Hooks.once("ready", () => {
    lo(), T("Ready hook fired"), Mt.onReady(), Ui.initialize();
  }), Hooks.on("canvasReady", (e) => {
    var t;
    T("canvasReady hook received", { scene: ((t = e == null ? void 0 : e.scene) == null ? void 0 : t.id) ?? null }), Mt.onCanvasReady(e);
  }), Hooks.on("updateScene", (e) => {
    T("updateScene hook received", { scene: (e == null ? void 0 : e.id) ?? null }), Mt.onUpdateScene(e);
  }), Hooks.on("updateWorldTime", (e, t) => {
    T("updateWorldTime hook received", { worldTime: e, diff: t }), Mt.onUpdateWorldTime(e, t);
  });
}
s(Po, "registerTimeTriggerHooks");
Po();
const ge = O, Mr = "objectVariants";
function Nt(e) {
  var i;
  const t = (i = e == null ? void 0 : e.getFlag) == null ? void 0 : i.call(e, ge, Mr);
  if (!t) return [];
  const n = Ze(t);
  return Array.isArray(n) ? n.map((r) => Jt(r)).filter((r) => r !== null) : [];
}
s(Nt, "getObjectVariantCategories");
async function Dr(e, t) {
  if (!(e != null && e.setFlag)) return;
  const n = Array.isArray(t) ? t.map((i) => Jt(i)).filter((i) => i !== null) : [];
  await e.setFlag(ge, Mr, n);
}
s(Dr, "setObjectVariantCategories");
function Fr(e = "") {
  return {
    id: Pr(),
    name: typeof e == "string" ? e : "",
    values: []
  };
}
s(Fr, "createObjectVariantCategory");
function Jt(e) {
  if (!e || typeof e != "object") return null;
  const t = typeof e.id == "string" && e.id.trim() ? e.id.trim() : Pr(), n = typeof e.name == "string" ? e.name : "", i = Array.isArray(e.values) ? e.values : [], r = [];
  for (const o of i) {
    if (typeof o != "string") continue;
    const a = o.trim();
    a && (r.includes(a) || r.push(a));
  }
  return { id: t, name: n, values: r };
}
s(Jt, "sanitizeCategory");
function Pr() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 11);
}
s(Pr, "generateVariantId");
function _r(e) {
  var t, n;
  console.error(`${ge} | Failed to persist object variants`, e), (n = (t = ui.notifications) == null ? void 0 : t.error) == null || n.call(
    t,
    f(
      "EIDOLON.ObjectVariants.PersistError",
      "Failed to persist the scene's object variants."
    )
  );
}
s(_r, "notifyPersistError");
var Zi, fe, Qe, ht, Rr, On, Ln, wt, Hr;
const Ce = class Ce extends Sn(En) {
  constructor(n = {}) {
    const { scene: i, category: r, isNew: o, onSave: a, ...l } = n ?? {};
    super(l);
    M(this, ht);
    M(this, fe, null);
    M(this, Qe, !1);
    M(this, On, /* @__PURE__ */ s(async (n) => {
      n.preventDefault(), n.stopPropagation();
      const i = n.currentTarget;
      if (!(i instanceof HTMLFormElement)) return;
      const o = (new FormData(i).get("categoryName") ?? "").toString(), a = Array.from(i.querySelectorAll('[name="categoryValues"]')), l = [];
      for (const c of a) {
        if (!(c instanceof HTMLInputElement)) continue;
        const u = c.value.trim();
        u && (l.includes(u) || l.push(u));
      }
      D(this, fe, {
        ...v(this, fe),
        name: o,
        values: l
      }), await S(this, ht, Hr).call(this), this.close();
    }, "#onSubmit"));
    M(this, Ln, /* @__PURE__ */ s((n) => {
      var m, p;
      n.preventDefault();
      const i = n.currentTarget, r = (i == null ? void 0 : i.form) ?? ((p = (m = this.element) == null ? void 0 : m.querySelector) == null ? void 0 : p.call(m, "form"));
      if (!r) return;
      const o = r.querySelector(".object-variant-editor__values");
      if (!o) return;
      const a = o.querySelector(".object-variant-editor__empty");
      a && a.remove();
      const l = document.createElement("div");
      l.classList.add("object-variant-editor__value");
      const c = qt(
        f("EIDOLON.ObjectVariants.ValuePlaceholder", "Variant label")
      ), u = qt(
        f("EIDOLON.ObjectVariants.RemoveValue", "Remove Value")
      );
      l.innerHTML = `
      <input type="text" name="categoryValues" value="" placeholder="${c}" class="form-control">
      <button type="button" class="icon" data-action="remove-value" aria-label="${u}" title="${u}">
        <i class="fa-solid fa-trash"></i>
      </button>
    `, o.appendChild(l);
      const d = l.querySelector('[data-action="remove-value"]');
      d && d.addEventListener("click", v(this, wt));
      const h = l.querySelector('input[name="categoryValues"]');
      h && h.focus();
    }, "#onAddValue"));
    M(this, wt, /* @__PURE__ */ s((n) => {
      var c, u;
      n.preventDefault();
      const i = n.currentTarget, r = i == null ? void 0 : i.closest(".object-variant-editor__value");
      r && r.remove();
      const o = (i == null ? void 0 : i.form) ?? ((u = (c = this.element) == null ? void 0 : c.querySelector) == null ? void 0 : u.call(c, "form"));
      if (!o) return;
      const a = o.querySelector(".object-variant-editor__values");
      if (!a) return;
      if (!a.querySelector(".object-variant-editor__value")) {
        const d = document.createElement("p");
        d.classList.add("notes", "object-variant-editor__empty"), d.textContent = f(
          "EIDOLON.ObjectVariants.ValueListEmpty",
          "No values have been added to this category."
        ), a.appendChild(d);
      }
    }, "#onRemoveValue"));
    this.scene = i ?? null, this.category = r ?? null, this.onSave = typeof a == "function" ? a : null, D(this, Qe, !!o), D(this, fe, S(this, ht, Rr).call(this));
  }
  async _prepareContext() {
    var i, r;
    const n = Array.isArray((i = v(this, fe)) == null ? void 0 : i.values) ? v(this, fe).values : [];
    return {
      isNew: v(this, Qe),
      name: ((r = v(this, fe)) == null ? void 0 : r.name) ?? "",
      values: n.map((o, a) => ({
        index: a,
        value: o
      })),
      hasValues: n.length > 0,
      labels: {
        name: f("EIDOLON.ObjectVariants.CategoryNameLabel", "Category Name"),
        values: f("EIDOLON.ObjectVariants.ValuesLabel", "Values"),
        empty: f(
          "EIDOLON.ObjectVariants.ValueListEmpty",
          "No values have been added to this category."
        ),
        addValue: f("EIDOLON.ObjectVariants.AddValue", "Add Value"),
        removeValue: f("EIDOLON.ObjectVariants.RemoveValue", "Remove Value"),
        valuePlaceholder: f(
          "EIDOLON.ObjectVariants.ValuePlaceholder",
          "Variant label"
        ),
        save: v(this, Qe) ? f("EIDOLON.ObjectVariants.CreateCategory", "Add Category") : f("EIDOLON.ObjectVariants.SaveCategory", "Save Category"),
        cancel: f("EIDOLON.ObjectVariants.CancelEdit", "Cancel"),
        title: v(this, Qe) ? f("EIDOLON.ObjectVariants.CreateCategory", "Add Category") : f("EIDOLON.ObjectVariants.EditCategory", "Edit Category")
      }
    };
  }
  _onRender(n, i) {
    var c;
    super._onRender(n, i);
    const r = this.element;
    if (!r) return;
    const o = Array.from(((c = document == null ? void 0 : document.body) == null ? void 0 : c.classList) ?? []).find(
      (u) => u.startsWith("theme-")
    );
    o && r.classList.add(o);
    const a = r.querySelector("form");
    if (!a) return;
    a.addEventListener("submit", v(this, On)), a.querySelectorAll('[data-action="add-value"]').forEach((u) => {
      u.addEventListener("click", v(this, Ln));
    }), a.querySelectorAll('[data-action="remove-value"]').forEach((u) => {
      u.addEventListener("click", v(this, wt));
    });
    const l = a.querySelector('[data-action="cancel"]');
    l && l.addEventListener("click", (u) => {
      u.preventDefault(), this.close();
    });
  }
};
fe = new WeakMap(), Qe = new WeakMap(), ht = new WeakSet(), Rr = /* @__PURE__ */ s(function() {
  const n = Jt(this.category) ?? Fr(
    f("EIDOLON.ObjectVariants.DefaultCategoryName", "New Category")
  );
  return {
    id: n.id,
    name: n.name ?? "",
    values: Array.isArray(n.values) ? [...n.values] : []
  };
}, "#initializeState"), On = new WeakMap(), Ln = new WeakMap(), wt = new WeakMap(), Hr = /* @__PURE__ */ s(async function() {
  if (!this.scene) return;
  const n = Nt(this.scene), i = n.findIndex((o) => o.id === v(this, fe).id), r = Jt({
    id: v(this, fe).id,
    name: v(this, fe).name,
    values: v(this, fe).values
  });
  i === -1 ? n.push(r) : n.splice(i, 1, r);
  try {
    if (await Dr(this.scene, n), this.onSave)
      try {
        await this.onSave(r);
      } catch (o) {
        console.error(`${ge} | Object variant editor onSave handler failed`, o);
      }
  } catch (o) {
    _r(o);
  }
}, "#persist"), s(Ce, "CategoryEditorApplication"), qe(Ce, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  it(Ce, Ce, "DEFAULT_OPTIONS"),
  {
    id: `${ge}-variant-category-editor`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Zi = it(Ce, Ce, "DEFAULT_OPTIONS")) == null ? void 0 : Zi.classes) ?? [], "standard-form", "themed"])
    ),
    window: {
      title: f("EIDOLON.ObjectVariants.EditCategory", "Edit Category"),
      resizable: !1
    },
    position: {
      width: 440,
      height: "auto"
    }
  },
  { inplace: !1 }
)), qe(Ce, "PARTS", {
  content: {
    template: `modules/${ge}/templates/object-variants-category-editor.html`
  }
});
let mi = Ce;
const _o = `modules/${ge}/templates/object-variants-scene-tab.html`, Ot = {
  log: /* @__PURE__ */ s((...e) => {
    var t;
    return (t = console.debug) == null ? void 0 : t.call(console, `${ge} | ObjectVariants`, ...e);
  }, "log"),
  group: /* @__PURE__ */ s((...e) => {
    var t;
    return (t = console.groupCollapsed) == null ? void 0 : t.call(console, `${ge} | ObjectVariants`, ...e);
  }, "group"),
  groupEnd: /* @__PURE__ */ s(() => {
    var e;
    return (e = console.groupEnd) == null ? void 0 : e.call(console);
  }, "groupEnd")
}, Ro = Ei(mi), Ho = Nr({
  tabId: "variants",
  tabLabel: /* @__PURE__ */ s(() => f("EIDOLON.ObjectVariants.TabLabel", "Variants"), "tabLabel"),
  getScene: Ie,
  renderContent: /* @__PURE__ */ s(({ app: e, tab: t, scene: n }) => Vo(e, t, n), "renderContent"),
  logger: Ot
});
function $o() {
  return Ho.register();
}
s($o, "registerObjectVariantSceneConfigHook");
function Vo(e, t, n) {
  if (!(t instanceof HTMLElement)) return;
  const i = ae(n) ? n : Ie(e);
  xt(e, t, i);
}
s(Vo, "renderObjectVariantsTab");
async function xt(e, t, n) {
  var r, o;
  const i = n ?? Ie(e);
  Ot.group("renderObjectVariantsTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!ae(i)) {
      const A = f(
        "EIDOLON.ObjectVariants.Unavailable",
        "Object variants are unavailable for this configuration sheet."
      );
      t.innerHTML = `<p class="notes">${A}</p>`, Ot.log("Scene lacks document for object variants", { sceneId: (i == null ? void 0 : i.id) ?? null });
      return;
    }
    const a = Nt(i);
    Ot.log("Rendering object variant list", {
      sceneId: i.id,
      categoryCount: a.length
    });
    const l = f(
      "EIDOLON.ObjectVariants.Description",
      "Group scene assets into reusable variant categories and assign label values for quick reference."
    ), c = f(
      "EIDOLON.ObjectVariants.CategoryListLabel",
      "Scene Variant Categories"
    ), u = f(
      "EIDOLON.ObjectVariants.CategoryListEmpty",
      "No variant categories configured for this scene."
    ), d = f("EIDOLON.ObjectVariants.AddCategory", "Add Category"), h = f(
      "EIDOLON.ObjectVariants.RemoveCategory",
      "Remove Category"
    ), m = f("EIDOLON.ObjectVariants.EditCategory", "Edit Category"), p = f("EIDOLON.ObjectVariants.ValuesLabel", "Values"), g = f(
      "EIDOLON.ObjectVariants.ValueListEmpty",
      "No values have been added to this category."
    ), L = f(
      "EIDOLON.ObjectVariants.UnnamedCategory",
      "Unnamed Category"
    ), I = /* @__PURE__ */ s((A) => qo(A), "formatCount"), b = ((o = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : o.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof b != "function") {
      console.error(`${ge} | renderTemplate is unavailable; cannot render object variants tab.`), t.innerHTML = `<p class="notes">${u}</p>`;
      return;
    }
    let w = "";
    try {
      w = await b(_o, {
        description: l,
        labels: {
          categories: c,
          empty: u,
          addCategory: d,
          removeCategory: h,
          editCategory: m,
          values: p,
          emptyValue: g,
          unnamedCategory: L
        },
        categories: a.map((A) => {
          var _, x;
          const R = ((x = (_ = A.name) == null ? void 0 : _.trim) == null ? void 0 : x.call(_)) ?? "";
          return {
            id: A.id,
            name: A.name,
            displayName: R || L,
            isUnnamed: !R,
            values: A.values,
            hasValues: A.values.length > 0,
            valuePreview: Uo(A.values),
            valueCount: A.values.length,
            valueCountLabel: I(A.values.length),
            valueChips: jo(A.values)
          };
        }),
        hasCategories: a.length > 0
      });
    } catch (A) {
      console.error(`${ge} | Failed to render object variants scene tab template`, A), t.innerHTML = `<p class="notes">${u}</p>`;
      return;
    }
    t.innerHTML = w, ko(e, t, i);
  } finally {
    Ot.groupEnd();
  }
}
s(xt, "renderObjectVariantsTabContent");
function ko(e, t, n) {
  const i = n ?? Ie(e);
  if (!ae(i)) return;
  const r = f(
    "EIDOLON.ObjectVariants.DefaultCategoryName",
    "New Category"
  ), o = t.querySelector('[data-variant-action="add-category"]');
  o && o.addEventListener("click", () => {
    ji(e, {
      scene: i,
      category: Fr(r),
      isNew: !0,
      onSave: /* @__PURE__ */ s(() => xt(e, t, i), "onSave")
    });
  }), t.querySelectorAll('[data-variant-action="remove-category"]').forEach((a) => {
    const l = a.dataset.categoryId;
    l && a.addEventListener("click", async () => {
      await xo(i, (u) => {
        const d = u.findIndex((h) => h.id === l);
        return d === -1 ? !1 : (u.splice(d, 1), !0);
      }) && await xt(e, t, i);
    });
  }), t.querySelectorAll('[data-variant-action="edit-category"]').forEach((a) => {
    const l = a.dataset.categoryId;
    l && a.addEventListener("click", () => {
      const u = Nt(i).find((d) => d.id === l);
      u && ji(e, {
        scene: i,
        category: u,
        onSave: /* @__PURE__ */ s(() => xt(e, t, i), "onSave")
      });
    });
  });
}
s(ko, "bindObjectVariantTabEvents");
async function xo(e, t) {
  const n = Nt(e);
  if (t(n) === !1) return !1;
  try {
    return await Dr(e, n), !0;
  } catch (r) {
    return _r(r), !1;
  }
}
s(xo, "mutateVariantCategories");
function ji(e, t = {}) {
  const n = t.scene ?? null, i = n && ae(n) ? n : Ie(e);
  if (!ae(i)) {
    console.warn(
      `${ge} | Unable to open object variant editor because no scene document is available.`
    );
    return;
  }
  Ro({
    scene: i,
    category: t.category ?? null,
    isNew: !!t.isNew,
    onSave: typeof t.onSave == "function" ? t.onSave : null
  }).render({ force: !0 });
}
s(ji, "openCategoryEditor");
function Uo(e) {
  if (!Array.isArray(e) || e.length === 0) return "";
  const t = e.slice(0, 5), n = t.join(", ");
  return e.length > t.length ? `${n}, …` : n;
}
s(Uo, "buildValuePreview");
function jo(e) {
  return !Array.isArray(e) || e.length === 0 ? [] : e.map((t) => t);
}
s(jo, "buildValueChips");
function qo(e) {
  var t, n;
  if ((n = (t = game.i18n) == null ? void 0 : t.has) != null && n.call(t, "EIDOLON.ObjectVariants.ValueCountLabel"))
    try {
      return game.i18n.format("EIDOLON.ObjectVariants.ValueCountLabel", { count: e });
    } catch (i) {
      console.error(`${ge} | Failed to format value count label`, i);
    }
  return e === 0 ? "No values configured" : e === 1 ? "1 value" : `${e} values`;
}
s(qo, "formatValueCount");
function Bo() {
  $o();
}
s(Bo, "registerObjectVariantHooks");
Bo();
const Xe = O, lt = "lightPresets", Si = Object.freeze({
  default: null,
  presets: [],
  current: null
});
function $r(e) {
  var n;
  const t = ((n = e == null ? void 0 : e.getFlag) == null ? void 0 : n.call(e, Xe, lt)) ?? Si;
  return Vr(t);
}
s($r, "getLightPresetState");
async function Go(e, t) {
  const n = Vr(t);
  if (!(e != null && e.setFlag))
    return n;
  const i = n.default !== null, r = n.presets.length > 0, o = n.current !== null;
  return !i && !r && !o ? (typeof e.unsetFlag == "function" ? await e.unsetFlag(Xe, lt) : await e.setFlag(Xe, lt, null), Si) : (await e.setFlag(Xe, lt, n), n);
}
s(Go, "setLightPresetState");
async function wi(e, t) {
  if (typeof t != "function")
    throw new TypeError("updateLightPresetState requires an updater function.");
  const n = Ze($r(e)), i = await t(n);
  return Go(e, i);
}
s(wi, "updateLightPresetState");
async function qi(e, t) {
  const n = gt(t);
  if (!n)
    throw new Error("Invalid light configuration payload.");
  return wi(e, (i) => ({
    ...i,
    default: n
  }));
}
s(qi, "storeDefaultPreset");
async function Bi(e, t, n, { label: i } = {}) {
  const r = Ci(t);
  if (!r)
    throw new Error("Cannot create preset without at least one category selection.");
  const o = gt(n);
  if (!o)
    throw new Error("Invalid light configuration payload.");
  return wi(e, (a) => {
    const l = Cn(r), c = Array.isArray(a == null ? void 0 : a.presets) ? [...a.presets] : [], u = c.findIndex((p) => (p == null ? void 0 : p.key) === l), d = u >= 0 ? c[u] : null, h = typeof (d == null ? void 0 : d.id) == "string" && d.id.trim() ? d.id.trim() : Ur(), m = kr({
      id: h,
      categories: r,
      config: o,
      label: typeof i == "string" ? i : (d == null ? void 0 : d.label) ?? null,
      updatedAt: Date.now()
    });
    if (!m)
      throw new Error("Failed to sanitize preset entry.");
    return u >= 0 ? c[u] = m : c.push(m), {
      ...a,
      presets: c
    };
  });
}
s(Bi, "upsertLightPreset");
async function Gi(e, t) {
  const n = xr(t);
  return wi(e, (i) => ({
    ...i,
    current: n
  }));
}
s(Gi, "storeCurrentPresetSelection");
function Vr(e) {
  var c;
  const t = Ze(e);
  if (!t || typeof t != "object")
    return Ze(Si);
  const n = gt(t.default ?? t.defaultPreset), i = Array.isArray(t.presets) ? t.presets : [], r = /* @__PURE__ */ new Map();
  for (const u of i) {
    const d = kr(u);
    d && r.set(d.key, d);
  }
  const o = Array.from(r.values()), a = new Map(o.map((u) => [u.id, u]));
  let l = xr(t.current);
  if (l) {
    const u = l.categories && Object.keys(l.categories).length > 0;
    if (l.presetId && !a.has(l.presetId)) {
      const d = u ? ((c = o.find((h) => h.key === Cn(l.categories))) == null ? void 0 : c.id) ?? null : null;
      d ? l = {
        ...l,
        presetId: d
      } : u && (l = {
        presetId: null,
        categories: l.categories,
        updatedAt: l.updatedAt
      });
    }
  }
  return {
    default: n ?? null,
    presets: o,
    current: l
  };
}
s(Vr, "sanitizeLightPresetState");
function gt(e) {
  const t = Ze(e);
  if (!t || typeof t != "object") return null;
  "_id" in t && delete t._id, "id" in t && delete t.id;
  const n = t.flags;
  if (n && typeof n == "object") {
    const i = n[Xe];
    i && typeof i == "object" && (delete i[lt], Object.keys(i).length === 0 && delete n[Xe]), Object.keys(n).length === 0 && delete t.flags;
  }
  return t;
}
s(gt, "sanitizeLightConfigPayload");
function kr(e) {
  if (!e || typeof e != "object") return null;
  const t = Ci(e.categories);
  if (!t) return null;
  const n = gt(e.config);
  if (!n) return null;
  const i = typeof e.id == "string" && e.id.trim() ? e.id.trim() : Ur(), r = Cn(t), o = {
    id: i,
    key: r,
    categories: t,
    config: n,
    updatedAt: Number.isFinite(e.updatedAt) ? Number(e.updatedAt) : Date.now()
  };
  return typeof e.label == "string" && e.label.trim() && (o.label = e.label.trim()), o;
}
s(kr, "sanitizePresetEntry");
function xr(e) {
  if (!e || typeof e != "object") return null;
  const t = typeof e.presetId == "string" && e.presetId.trim() ? e.presetId.trim() : null, n = Ci(e.categories);
  return !t && !n ? null : {
    presetId: t,
    categories: n,
    updatedAt: Number.isFinite(e.updatedAt) ? Number(e.updatedAt) : Date.now()
  };
}
s(xr, "sanitizeCurrentSelection");
function Ci(e) {
  const t = {};
  if (Array.isArray(e))
    for (const n of e) {
      const i = zi((n == null ? void 0 : n.id) ?? (n == null ? void 0 : n.categoryId) ?? (n == null ? void 0 : n.category)), r = Wi((n == null ? void 0 : n.value) ?? (n == null ? void 0 : n.selection) ?? (n == null ? void 0 : n.label));
      !i || !r || (t[i] = r);
    }
  else if (e && typeof e == "object")
    for (const [n, i] of Object.entries(e)) {
      const r = zi(n), o = Wi(i);
      !r || !o || (t[r] = o);
    }
  return Object.keys(t).length > 0 ? t : null;
}
s(Ci, "sanitizePresetCategories");
function Cn(e) {
  if (!e || typeof e != "object") return "";
  const t = Object.entries(e).filter(([, n]) => typeof n == "string" && n).map(([n, i]) => `${n}:${i}`);
  return t.sort((n, i) => n < i ? -1 : n > i ? 1 : 0), t.join("|");
}
s(Cn, "computePresetKey");
function Ur() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
s(Ur, "generateLightPresetId");
function zi(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  return t || null;
}
s(zi, "normalizeCategoryId");
function Wi(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  return t || null;
}
s(Wi, "normalizeCategoryValue");
const Ut = /* @__PURE__ */ new WeakMap(), oe = "__eidolon_default__";
function zo() {
  Hooks.on("renderAmbientLightConfig", Wo), T("LightPresets | AmbientLightConfig controls registered");
}
s(zo, "registerAmbientLightConfigControls");
function Wo(e, t) {
  var n;
  ft("LightPresets | renderAmbientLightConfig", {
    appId: (e == null ? void 0 : e.id) ?? null,
    constructor: ((n = e == null ? void 0 : e.constructor) == null ? void 0 : n.name) ?? null,
    isRendered: (e == null ? void 0 : e.rendered) ?? !1
  });
  try {
    const i = gi(t);
    if (!i) return;
    Ko(e, i);
  } catch (i) {
    console.error("eidolon-utilities | Failed to enhance AmbientLightConfig UI", i);
  } finally {
    ke();
  }
}
s(Wo, "handleAmbientLightConfigRender");
function Ko(e, t) {
  var K, yt, Ne;
  const n = (e == null ? void 0 : e.form) instanceof HTMLFormElement ? e.form : t instanceof HTMLFormElement ? t : (K = t == null ? void 0 : t.closest) == null ? void 0 : K.call(t, "form");
  if (!(n instanceof HTMLFormElement)) return;
  const i = n.querySelector(".window-content");
  if (!(i instanceof HTMLElement)) return;
  const r = qr(e);
  if (!r) return;
  const o = rs(r);
  T("LightPresets | Resolved ambient light", {
    sheetId: (r == null ? void 0 : r.id) ?? null,
    persistedId: (o == null ? void 0 : o.id) ?? null,
    sameRef: r === o
  });
  const a = (o == null ? void 0 : o.parent) ?? r.parent ?? null, l = a ? Nt(a) : [], c = l.filter(
    (C) => Array.isArray(C == null ? void 0 : C.values) && C.values.length > 0
  ), u = es(l), d = $r(o ?? r);
  T("LightPresets | Loaded preset state", {
    hasDefault: !!(d != null && d.default),
    presetCount: Array.isArray(d == null ? void 0 : d.presets) ? d.presets.length : 0,
    presets: Array.isArray(d == null ? void 0 : d.presets) ? d.presets.map((C) => {
      var k, J;
      return {
        id: C.id,
        key: C.key,
        hasColor: !!((J = (k = C.config) == null ? void 0 : k.config) != null && J.color)
      };
    }) : []
  });
  const h = i.querySelector(".eidolon-light-presets");
  h && h.remove();
  const m = document.createElement("fieldset");
  m.classList.add("eidolon-light-presets");
  const p = document.createElement("legend");
  p.textContent = f("EIDOLON.LightPresets.Legend", "Light Presets"), m.appendChild(p);
  const g = document.createElement("p");
  g.classList.add("notes"), g.textContent = f(
    "EIDOLON.LightPresets.Description",
    "Capture default lighting and register presets tied to scene variant values."
  ), m.appendChild(g);
  const L = document.createElement("div");
  L.classList.add("eidolon-light-presets__controls");
  const I = document.createElement("button");
  I.type = "button", I.dataset.action = "make-default", I.classList.add("eidolon-light-presets__button"), I.textContent = f(
    "EIDOLON.LightPresets.MakeDefault",
    "Make Default"
  ), L.appendChild(I);
  const b = document.createElement("button");
  b.type = "button", b.dataset.action = "create-preset", b.classList.add("eidolon-light-presets__button"), b.textContent = f(
    "EIDOLON.LightPresets.CreatePreset",
    "Create Preset"
  ), b.setAttribute("aria-expanded", "false"), L.appendChild(b), m.appendChild(L);
  const w = document.createElement("p");
  w.classList.add("notes", "eidolon-light-presets__status"), m.appendChild(w);
  const A = document.createElement("div");
  A.classList.add("eidolon-light-presets__switcher");
  const R = document.createElement("label");
  R.classList.add("eidolon-light-presets__switcher-label");
  const _ = `${(e == null ? void 0 : e.id) ?? (r == null ? void 0 : r.id) ?? "eidolon-light"}-preset-select`;
  R.htmlFor = _, R.textContent = f("EIDOLON.LightPresets.SelectLabel", "Preset"), A.appendChild(R);
  const x = document.createElement("div");
  x.classList.add("eidolon-light-presets__switcher-controls"), A.appendChild(x);
  const F = document.createElement("select");
  F.id = _, F.classList.add("eidolon-light-presets__select"), F.dataset.action = "select-preset", x.appendChild(F);
  const B = document.createElement("button");
  B.type = "button", B.dataset.action = "apply-selected-preset", B.classList.add("eidolon-light-presets__button", "secondary"), B.textContent = f("EIDOLON.LightPresets.ApplyButton", "Apply"), x.appendChild(B);
  const H = document.createElement("button");
  if (H.type = "button", H.dataset.action = "update-selected-preset", H.classList.add("eidolon-light-presets__button", "secondary"), H.textContent = f(
    "EIDOLON.LightPresets.UpdateButton",
    "Save Changes"
  ), x.appendChild(H), m.appendChild(A), l.length === 0) {
    const C = document.createElement("p");
    C.classList.add("notification", "warning", "eidolon-light-presets__warning"), C.textContent = f(
      "EIDOLON.LightPresets.NoCategoriesWarning",
      "This scene has no variant categories. Add categories under Scene → Variants to enable lighting presets."
    ), m.appendChild(C);
  } else if (c.length === 0) {
    const C = document.createElement("p");
    C.classList.add("notification", "warning", "eidolon-light-presets__warning"), C.textContent = f(
      "EIDOLON.LightPresets.NoValuesWarning",
      "Variant categories exist, but none define selectable values. Add values in Scene → Variants."
    ), m.appendChild(C);
  }
  const q = document.createElement("div");
  q.classList.add("eidolon-light-presets__creation"), q.dataset.section = "creation", q.hidden = !0;
  const ie = document.createElement("p");
  ie.classList.add("notes"), ie.textContent = f(
    "EIDOLON.LightPresets.CreateDescription",
    "Assign scene variant values to map the current configuration to a preset."
  ), q.appendChild(ie);
  const E = document.createElement("div");
  E.classList.add("eidolon-light-presets__category-list"), q.appendChild(E);
  for (const C of c) {
    const k = document.createElement("label");
    k.classList.add("eidolon-light-presets__category");
    const J = document.createElement("span");
    J.classList.add("eidolon-light-presets__category-name"), J.textContent = (Ne = (yt = C.name) == null ? void 0 : yt.trim) != null && Ne.call(yt) ? C.name.trim() : f("EIDOLON.LightPresets.UnnamedCategory", "Unnamed Category"), k.appendChild(J);
    const G = document.createElement("select");
    G.dataset.categoryId = C.id, G.classList.add("eidolon-light-presets__category-select");
    const Y = document.createElement("option");
    Y.value = "", Y.textContent = f(
      "EIDOLON.LightPresets.IgnoreCategory",
      "Ignore"
    ), G.appendChild(Y);
    for (const Q of C.values) {
      const X = document.createElement("option");
      X.value = Q, X.textContent = Q, G.appendChild(X);
    }
    k.appendChild(G), E.appendChild(k);
  }
  const U = document.createElement("div");
  U.classList.add("eidolon-light-presets__creation-actions");
  const $ = document.createElement("button");
  $.type = "button", $.dataset.action = "save-preset", $.classList.add("eidolon-light-presets__button", "primary"), $.textContent = f(
    "EIDOLON.LightPresets.SavePreset",
    "Save Preset"
  ), U.appendChild($);
  const V = document.createElement("button");
  V.type = "button", V.dataset.action = "cancel-create", V.classList.add("eidolon-light-presets__button", "secondary"), V.textContent = f(
    "EIDOLON.LightPresets.Cancel",
    "Cancel"
  ), U.appendChild(V), q.appendChild(U), m.appendChild(q), i.appendChild(m), requestAnimationFrame(() => {
    var C;
    (C = e.setPosition) == null || C.call(e, { height: "auto" });
  });
  let y = d;
  rt(w, y), bt(b, {
    state: y,
    hasCategories: c.length > 0
  }), T("LightPresets | Controls injected", {
    sceneId: (a == null ? void 0 : a.id) ?? null,
    lightId: (r == null ? void 0 : r.id) ?? null,
    hasDefault: !!(y != null && y.default),
    presetCount: Array.isArray(y == null ? void 0 : y.presets) ? y.presets.length : 0,
    categories: c.length
  });
  const W = ts(y), P = {
    restoreConfig: null,
    app: e,
    selectedPreset: W
  };
  Ut.set(m, P), F.addEventListener("change", () => {
    P.selectedPreset = F.value ?? "", Se({
      presetSelect: F,
      applyPresetButton: B,
      updatePresetButton: H,
      state: y
    });
  });
  const ne = /* @__PURE__ */ s(async () => {
    var G, Y, Q, X, le, re, ce, Me, me, De, Fe, Pe, Te, _e;
    const C = F.value ?? "";
    if (!C) {
      (Y = (G = ui.notifications) == null ? void 0 : G.warn) == null || Y.call(
        G,
        f(
          "EIDOLON.LightPresets.SelectPresetWarning",
          "Choose a preset before applying."
        )
      ), Se({
        presetSelect: F,
        applyPresetButton: B,
        updatePresetButton: H,
        state: y
      });
      return;
    }
    if (C === oe) {
      if (!(y != null && y.default)) {
        (X = (Q = ui.notifications) == null ? void 0 : Q.warn) == null || X.call(
          Q,
          f(
            "EIDOLON.LightPresets.DefaultUnavailable",
            "Save a default preset before applying it."
          )
        );
        return;
      }
      Dt(m, q, b), Pt(e, n, y.default), y = await Gi(o ?? r, {
        presetId: oe,
        categories: null,
        updatedAt: Date.now()
      }), P.selectedPreset = oe, Re(F, y, u, P.selectedPreset), P.selectedPreset = F.value ?? oe, rt(w, y), bt(b, {
        state: y,
        hasCategories: c.length > 0
      }), Ki(n, {
        presetId: oe,
        color: ((re = (le = y.default) == null ? void 0 : le.config) == null ? void 0 : re.color) ?? null
      }), (Me = (ce = ui.notifications) == null ? void 0 : ce.info) == null || Me.call(
        ce,
        f(
          "EIDOLON.LightPresets.DefaultApplied",
          "Applied the default preset to the form."
        )
      ), Se({
        presetSelect: F,
        applyPresetButton: B,
        updatePresetButton: H,
        state: y
      });
      return;
    }
    const k = Array.isArray(y == null ? void 0 : y.presets) && y.presets.length ? y.presets.find((Ee) => (Ee == null ? void 0 : Ee.id) === C) : null;
    if (!k) {
      (De = (me = ui.notifications) == null ? void 0 : me.warn) == null || De.call(
        me,
        f(
          "EIDOLON.LightPresets.PresetUnavailable",
          "The selected preset is no longer available."
        )
      ), Re(F, y, u, ""), P.selectedPreset = F.value ?? "", Se({
        presetSelect: F,
        applyPresetButton: B,
        updatePresetButton: H,
        state: y
      });
      return;
    }
    Dt(m, q, b), Pt(e, n, k.config), y = await Gi(o ?? r, {
      presetId: k.id,
      categories: k.categories,
      updatedAt: Date.now()
    }), P.selectedPreset = k.id, Re(F, y, u, P.selectedPreset), P.selectedPreset = F.value ?? k.id, rt(w, y), bt(b, {
      state: y,
      hasCategories: c.length > 0
    }), Ki(n, {
      presetId: k.id,
      color: ((Pe = (Fe = k.config) == null ? void 0 : Fe.config) == null ? void 0 : Pe.color) ?? null
    });
    const J = ct(k, u);
    (_e = (Te = ui.notifications) == null ? void 0 : Te.info) == null || _e.call(
      Te,
      f(
        "EIDOLON.LightPresets.PresetApplied",
        "Applied preset: {label}"
      ).replace("{label}", J)
    ), Se({
      presetSelect: F,
      applyPresetButton: B,
      updatePresetButton: H,
      state: y
    });
  }, "applySelectedPreset");
  B.addEventListener("click", () => {
    ne();
  }), F.addEventListener("keydown", (C) => {
    C.key === "Enter" && (C.preventDefault(), ne());
  });
  const z = /* @__PURE__ */ s(async () => {
    var k, J, G, Y, Q, X, le, re, ce, Me, me, De, Fe, Pe, Te, _e, Ee, te, pt, je, Mi;
    const C = P.selectedPreset;
    if (!C) {
      (J = (k = ui.notifications) == null ? void 0 : k.warn) == null || J.call(
        k,
        f(
          "EIDOLON.LightPresets.SelectPresetWarning",
          "Choose a preset before applying."
        )
      );
      return;
    }
    H.disabled = !0;
    try {
      const ue = Ft(e, o);
      if (C === oe)
        y = await qi(o ?? r, ue), T("LightPresets | Default preset updated", {
          lightId: ((G = o ?? r) == null ? void 0 : G.id) ?? null,
          configColor: ((Y = ue == null ? void 0 : ue.config) == null ? void 0 : Y.color) ?? null
        }), (X = (Q = ui.notifications) == null ? void 0 : Q.info) == null || X.call(
          Q,
          f(
            "EIDOLON.LightPresets.DefaultUpdated",
            "Updated the default preset with the current configuration."
          )
        ), P.selectedPreset = oe;
      else {
        const nt = hi(y, C);
        if (!nt) {
          (re = (le = ui.notifications) == null ? void 0 : le.warn) == null || re.call(
            le,
            f(
              "EIDOLON.LightPresets.PresetUnavailable",
              "The selected preset is no longer available."
            )
          ), Re(F, y, u, ""), P.selectedPreset = F.value ?? "";
          return;
        }
        y = await Bi(
          o ?? r,
          nt.categories,
          ue,
          { label: nt.label ?? null }
        ), T("LightPresets | Preset updated", {
          presetId: C,
          hasColor: !!((ce = ue == null ? void 0 : ue.config) != null && ce.color),
          stored: Array.isArray(y == null ? void 0 : y.presets) ? ((Me = y.presets.find((An) => (An == null ? void 0 : An.id) === C)) == null ? void 0 : Me.config) ?? null : null,
          persisted: (De = (me = o ?? r) == null ? void 0 : me.getFlag) == null ? void 0 : De.call(me, Xe, lt)
        });
        const Tt = hi(y, C), Jr = ct(Tt || nt, u);
        T("LightPresets | Preset updated", {
          presetId: C,
          categories: nt.categories,
          updatedColor: ((Fe = ue == null ? void 0 : ue.config) == null ? void 0 : Fe.color) ?? null,
          storedColor: ((Te = (Pe = Tt == null ? void 0 : Tt.config) == null ? void 0 : Pe.config) == null ? void 0 : Te.color) ?? ((Ee = (_e = nt.config) == null ? void 0 : _e.config) == null ? void 0 : Ee.color) ?? null
        }), (pt = (te = ui.notifications) == null ? void 0 : te.info) == null || pt.call(
          te,
          f(
            "EIDOLON.LightPresets.PresetUpdated",
            "Saved changes to preset: {label}"
          ).replace("{label}", Jr)
        ), P.selectedPreset = C;
      }
      rt(w, y), bt(b, {
        state: y,
        hasCategories: c.length > 0
      }), Re(F, y, u, P.selectedPreset), P.selectedPreset = F.value ?? "";
    } catch (ue) {
      console.error("eidolon-utilities | Failed to update light preset", ue), (Mi = (je = ui.notifications) == null ? void 0 : je.error) == null || Mi.call(
        je,
        f(
          "EIDOLON.LightPresets.PresetUpdateError",
          "Failed to save the preset. Check the console for details."
        )
      );
    } finally {
      H.disabled = !1, Se({
        presetSelect: F,
        applyPresetButton: B,
        updatePresetButton: H,
        state: y
      });
    }
  }, "updateSelectedPreset");
  H.addEventListener("click", () => {
    z();
  }), Re(F, y, u, P.selectedPreset), P.selectedPreset = F.value ?? P.selectedPreset ?? "", Se({
    presetSelect: F,
    applyPresetButton: B,
    updatePresetButton: H,
    state: y
  }), I.addEventListener("click", async () => {
    var C, k, J, G, Y, Q;
    I.disabled = !0;
    try {
      const X = Ft(e, o);
      y = await qi(o ?? r, X), T("LightPresets | Default preset stored", {
        lightId: ((C = o ?? r) == null ? void 0 : C.id) ?? null,
        configColor: ((k = X == null ? void 0 : X.config) == null ? void 0 : k.color) ?? null
      }), (G = (J = ui.notifications) == null ? void 0 : J.info) == null || G.call(
        J,
        f(
          "EIDOLON.LightPresets.DefaultStored",
          "Saved the current configuration as the default preset."
        )
      ), rt(w, y), bt(b, {
        state: y,
        hasCategories: c.length > 0
      }), P.selectedPreset = oe, Re(F, y, u, P.selectedPreset), P.selectedPreset = F.value ?? "", Se({
        presetSelect: F,
        applyPresetButton: B,
        updatePresetButton: H,
        state: y
      });
    } catch (X) {
      console.error("eidolon-utilities | Failed to store default light preset", X), (Q = (Y = ui.notifications) == null ? void 0 : Y.error) == null || Q.call(
        Y,
        f(
          "EIDOLON.LightPresets.DefaultError",
          "Failed to save the default preset. Check the console for details."
        )
      );
    } finally {
      I.disabled = !1;
    }
  }), b.addEventListener("click", () => {
    var k, J, G, Y;
    if (!(y != null && y.default)) {
      (J = (k = ui.notifications) == null ? void 0 : k.warn) == null || J.call(
        k,
        f(
          "EIDOLON.LightPresets.RequiresDefault",
          "Create a default preset before adding additional variants."
        )
      );
      return;
    }
    if (c.length === 0) {
      (Y = (G = ui.notifications) == null ? void 0 : G.warn) == null || Y.call(
        G,
        f(
          "EIDOLON.LightPresets.NoCategoriesAvailable",
          "Add variant categories with values in the Scene configuration before creating presets."
        )
      );
      return;
    }
    const C = Ut.get(m);
    C && (C.restoreConfig = Ft(e, o)), Pt(e, n, y.default), ns(E), q.hidden = !1, b.setAttribute("aria-expanded", "true"), requestAnimationFrame(() => {
      var Q;
      (Q = e.setPosition) == null || Q.call(e, { height: "auto" });
    });
  }), $.addEventListener("click", async () => {
    var k, J, G, Y, Q, X, le;
    const C = is(E);
    if (!C) {
      (J = (k = ui.notifications) == null ? void 0 : k.warn) == null || J.call(
        k,
        f(
          "EIDOLON.LightPresets.SelectionRequired",
          "Select at least one category value to identify the preset."
        )
      );
      return;
    }
    $.disabled = !0;
    try {
      const re = Ft(e, o);
      y = await Bi(
        o ?? r,
        C,
        re,
        {}
      ), T("LightPresets | Preset saved from editor", {
        categories: C,
        configColor: ((G = re == null ? void 0 : re.config) == null ? void 0 : G.color) ?? null
      }), (Q = (Y = ui.notifications) == null ? void 0 : Y.info) == null || Q.call(
        Y,
        f(
          "EIDOLON.LightPresets.PresetSaved",
          "Updated lighting preset for the selected scene variants."
        )
      ), rt(w, y);
      const ce = jr(y, C);
      ce && (P.selectedPreset = ce), Re(F, y, u, P.selectedPreset), P.selectedPreset = F.value ?? "", Se({
        presetSelect: F,
        applyPresetButton: B,
        updatePresetButton: H,
        state: y
      }), Dt(m, q, b);
    } catch (re) {
      console.error("eidolon-utilities | Failed to persist light preset", re), (le = (X = ui.notifications) == null ? void 0 : X.error) == null || le.call(
        X,
        f(
          "EIDOLON.LightPresets.PresetError",
          "Failed to save the preset. Check the console for details."
        )
      );
    } finally {
      $.disabled = !1;
    }
  }), V.addEventListener("click", () => {
    const C = Ut.get(m);
    C != null && C.restoreConfig && Pt(e, n, C.restoreConfig), Dt(m, q, b);
  });
}
s(Ko, "enhanceAmbientLightConfig");
function Dt(e, t, n) {
  const i = Ut.get(e);
  i && (i.restoreConfig = null), t.hidden = !0, n.setAttribute("aria-expanded", "false"), requestAnimationFrame(() => {
    var r, o;
    (o = (r = i == null ? void 0 : i.app) == null ? void 0 : r.setPosition) == null || o.call(r, { height: "auto" });
  });
}
s(Dt, "hideCreationSection");
function rt(e, t) {
  if (!e) return;
  const n = !!(t != null && t.default), i = Array.isArray(t == null ? void 0 : t.presets) ? t.presets.length : 0, r = [];
  r.push(
    n ? f(
      "EIDOLON.LightPresets.StatusDefaultSaved",
      "Default preset saved."
    ) : f(
      "EIDOLON.LightPresets.StatusDefaultMissing",
      "Default preset not yet saved."
    )
  ), r.push(
    f(
      "EIDOLON.LightPresets.StatusPresetCount",
      "Preset count: {count}"
    ).replace("{count}", String(i))
  ), e.textContent = r.join(" ");
}
s(rt, "updateStatusLine");
function bt(e, { state: t, hasCategories: n }) {
  if (!e) return;
  const i = !!(t != null && t.default), r = i && n;
  e.disabled = !r, e.title = r ? "" : i ? f(
    "EIDOLON.LightPresets.CreateDisabledNoCategories",
    "Add scene variant categories with values before creating presets."
  ) : f(
    "EIDOLON.LightPresets.CreateDisabledNoDefault",
    "Save a default preset before creating additional presets."
  );
}
s(bt, "updateCreateButtonState");
function Ft(e, t) {
  var c, u, d;
  const n = t ?? qr(e);
  if (!n)
    throw new Error("Ambient light document unavailable.");
  const i = gt(((c = n.toObject) == null ? void 0 : c.call(n)) ?? {});
  if (!i)
    throw new Error("Unable to duplicate ambient light data.");
  const r = (e == null ? void 0 : e.form) instanceof HTMLFormElement ? e.form : null, o = r ? Eo(r) : {}, a = foundry.utils.mergeObject(i, o, {
    inplace: !1,
    performDeletions: !0
  });
  r && (r.querySelectorAll("color-picker[name]").forEach((h) => {
    var b, w;
    const m = h.getAttribute("name");
    if (!m) return;
    const p = typeof h.value == "string" ? h.value : "", g = ((b = h.ui) == null ? void 0 : b.input) ?? ((w = h.querySelector) == null ? void 0 : w.call(h, 'input[type="color"]')), L = (g == null ? void 0 : g.value) ?? "", I = p || L;
    typeof I != "string" || !I || (foundry.utils.setProperty(a, m, I), T("LightPresets | Captured color-picker value", {
      path: m,
      pickerValue: p,
      swatchValue: L,
      chosenValue: I
    }));
  }), r.querySelectorAll("range-picker[name]").forEach((h) => {
    var _, x;
    const m = h.getAttribute("name");
    if (!m) return;
    const p = h.value !== void 0 && h.value !== null ? String(h.value) : "", g = (_ = h.querySelector) == null ? void 0 : _.call(h, 'input[type="range"]'), L = (x = h.querySelector) == null ? void 0 : x.call(h, 'input[type="number"]'), I = g instanceof HTMLInputElement ? g.value : "", b = L instanceof HTMLInputElement ? L.value : "", w = p || b || I;
    if (typeof w != "string" || !w.length) return;
    const A = Number(w), R = Number.isFinite(A) ? A : w;
    foundry.utils.setProperty(a, m, R), T("LightPresets | Captured range-picker value", {
      path: m,
      elementValue: p,
      numberValue: b,
      rangeValue: I,
      chosenValue: R
    });
  }));
  const l = gt(a);
  return T("LightPresets | Captured form config", {
    lightId: (n == null ? void 0 : n.id) ?? null,
    hasColor: !!((u = l == null ? void 0 : l.config) != null && u.color),
    color: ((d = l == null ? void 0 : l.config) == null ? void 0 : d.color) ?? null
  }), l;
}
s(Ft, "captureAmbientLightFormConfig");
function Pt(e, t, n) {
  if (!n || typeof n != "object") return;
  const i = foundry.utils.flattenObject(n, { safe: !0 });
  for (const [r, o] of Object.entries(i)) {
    const a = t.querySelectorAll(`[name="${r}"]`);
    if (a.length) {
      T("LightPresets | Applying field", {
        path: r,
        value: o,
        elementCount: a.length
      });
      for (const l of a)
        l instanceof HTMLElement && l.tagName === "COLOR-PICKER" ? Yo(l, o) : l instanceof HTMLElement && l.tagName === "RANGE-PICKER" ? Qo(l, o) : l instanceof HTMLInputElement ? Jo(l, o) : l instanceof HTMLSelectElement ? Xo(l, o) : l instanceof HTMLTextAreaElement && Zo(l, o);
    }
  }
  requestAnimationFrame(() => {
    var r;
    return (r = e._previewChanges) == null ? void 0 : r.call(e);
  });
}
s(Pt, "applyConfigToForm");
function Jo(e, t, n) {
  const i = e.type;
  if (i === "checkbox") {
    const a = !!t;
    e.checked !== a && (e.checked = a, pe(e));
    return;
  }
  if (i === "radio") {
    const a = t == null ? "" : String(t), l = e.value === a;
    e.checked !== l && (e.checked = l, l && pe(e));
    return;
  }
  const r = t == null ? "" : String(t);
  let o = !1;
  e.value !== r && (e.value = r, o = !0), o && pe(e);
}
s(Jo, "applyValueToInput");
function Yo(e, t, n) {
  var l, c, u, d, h, m;
  const i = t == null ? "" : String(t);
  let r = !1;
  e.value !== i && (e.value = i, e.setAttribute("value", i), (l = e.ui) != null && l.setValue && e.ui.setValue(i), r = !0);
  const o = ((c = e.ui) == null ? void 0 : c.input) ?? ((u = e.querySelector) == null ? void 0 : u.call(e, 'input[type="color"]'));
  o instanceof HTMLInputElement && o.value !== i && (o.value = i, pe(o));
  const a = ((d = e.ui) == null ? void 0 : d.text) ?? ((h = e.querySelector) == null ? void 0 : h.call(e, 'input[type="text"]'));
  a instanceof HTMLInputElement && a.value !== i && (a.value = i, pe(a)), (m = e.ui) != null && m.commit ? e.ui.commit() : (e.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }))), T("LightPresets | Color picker applied", {
    value: i,
    pickerValue: e.value ?? null,
    swatchValue: (o == null ? void 0 : o.value) ?? null,
    textValue: (a == null ? void 0 : a.value) ?? null
  }), r && pe(e);
}
s(Yo, "applyValueToColorPicker");
function Qo(e, t, n) {
  var u, d;
  const i = t == null ? "" : String(t), r = Number(i), o = Number.isFinite(r) ? r : i;
  let a = !1;
  e.value !== void 0 && e.value !== o && (e.value = o, a = !0), e.getAttribute("value") !== i && (e.setAttribute("value", i), a = !0);
  const l = (u = e.querySelector) == null ? void 0 : u.call(e, 'input[type="range"]');
  l instanceof HTMLInputElement && l.value !== i && (l.value = i, pe(l));
  const c = (d = e.querySelector) == null ? void 0 : d.call(e, 'input[type="number"]');
  if (c instanceof HTMLInputElement && c.value !== i && (c.value = i, pe(c)), typeof e.commit == "function")
    try {
      e.commit();
    } catch (h) {
      console.error("eidolon-utilities | range-picker commit failed", h);
    }
  T("LightPresets | Range picker applied", {
    value: i,
    resolvedValue: o,
    rangeValue: (l == null ? void 0 : l.value) ?? null,
    numberValue: (c == null ? void 0 : c.value) ?? null
  }), a && pe(e);
}
s(Qo, "applyValueToRangePicker");
function Xo(e, t, n) {
  const i = t == null ? "" : String(t);
  e.value !== i && (e.value = i, pe(e));
}
s(Xo, "applyValueToSelect");
function Zo(e, t, n) {
  const i = t == null ? "" : String(t);
  e.value !== i && (e.value = i, pe(e));
}
s(Zo, "applyValueToTextarea");
function pe(e) {
  e.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }));
}
s(pe, "triggerInputChange");
function Se({ presetSelect: e, applyPresetButton: t, updatePresetButton: n, state: i }) {
  const r = (e == null ? void 0 : e.value) ?? "", o = !!(i != null && i.default), a = r && r !== oe ? !!hi(i, r) : !1;
  t instanceof HTMLButtonElement && (r ? r === oe ? t.disabled = !o : t.disabled = !a : t.disabled = !0), n instanceof HTMLButtonElement && (r ? r === oe ? n.disabled = !1 : n.disabled = !a : n.disabled = !0);
}
s(Se, "syncPresetSwitcherState");
function es(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    if (!n) continue;
    const i = typeof n.id == "string" ? n.id : null;
    if (!i) continue;
    const r = typeof n.name == "string" && n.name.trim() ? n.name.trim() : f("EIDOLON.LightPresets.UnnamedCategory", "Unnamed Category");
    t.has(i) || t.set(i, r);
  }
  return t;
}
s(es, "buildCategoryNameLookup");
function Re(e, t, n, i) {
  if (!(e instanceof HTMLSelectElement)) return;
  const r = typeof i == "string" ? i : "", o = !!(t != null && t.default), a = Array.isArray(t == null ? void 0 : t.presets) ? [...t.presets] : [], l = e.value;
  e.innerHTML = "";
  const c = document.createElement("option");
  c.value = "", c.textContent = f(
    "EIDOLON.LightPresets.SelectPlaceholder",
    "Select a preset"
  ), e.appendChild(c);
  const u = document.createElement("option");
  u.value = oe, u.textContent = f(
    "EIDOLON.LightPresets.DefaultOption",
    "Default Preset"
  ), u.disabled = !o, e.appendChild(u), a.slice().sort((m, p) => {
    var I;
    const g = ct(m, n), L = ct(p, n);
    return g.localeCompare(L, ((I = game.i18n) == null ? void 0 : I.lang) ?? void 0, {
      sensitivity: "base"
    });
  }).forEach((m) => {
    if (!(m != null && m.id)) return;
    const p = document.createElement("option");
    p.value = m.id, p.textContent = ct(m, n), e.appendChild(p);
  });
  const d = new Set(
    Array.from(e.options).filter((m) => !m.disabled).map((m) => m.value)
  ), h = r || (d.has(l) ? l : "");
  h && d.has(h) ? e.value = h : o ? e.value = oe : e.value = "";
}
s(Re, "populatePresetSelector");
function ct(e, t) {
  if (!e || typeof e != "object")
    return f("EIDOLON.LightPresets.UnnamedPreset", "Unnamed Preset");
  if (typeof e.label == "string" && e.label.trim())
    return e.label.trim();
  const n = e.categories ?? {}, i = Object.entries(n).filter(([, r]) => typeof r == "string" && r.trim()).map(([r, o]) => {
    const a = o.trim();
    return `${t.get(r) ?? f("EIDOLON.LightPresets.UnnamedCategory", "Unnamed Category")}: ${a}`;
  });
  return i.length === 0 ? f("EIDOLON.LightPresets.UnnamedPreset", "Unnamed Preset") : i.join(" • ");
}
s(ct, "formatPresetOptionLabel");
function jr(e, t) {
  if (!e || typeof e != "object" || !Array.isArray(e.presets)) return null;
  const n = Cn(t);
  if (!n) return null;
  const i = e.presets.find((r) => (r == null ? void 0 : r.key) === n);
  return (i == null ? void 0 : i.id) ?? null;
}
s(jr, "findPresetIdByCategories");
function hi(e, t) {
  return !t || !e || typeof e != "object" || !Array.isArray(e.presets) ? null : e.presets.find((n) => (n == null ? void 0 : n.id) === t) ?? null;
}
s(hi, "getPresetById");
function ts(e) {
  if (!e || typeof e != "object") return "";
  const t = e.current;
  if (t != null && t.presetId) {
    if (t.presetId === oe)
      return e != null && e.default ? oe : "";
    if (Array.isArray(e.presets) && e.presets.some((n) => n.id === t.presetId))
      return t.presetId;
  }
  if (t != null && t.categories) {
    const n = jr(e, t.categories);
    if (n) return n;
  }
  return "";
}
s(ts, "resolveInitialPresetSelection");
function Ki(e, t = {}) {
  var a, l, c, u;
  if (!(e instanceof HTMLFormElement)) return;
  const n = e.querySelector('color-picker[name="config.color"]'), i = (n == null ? void 0 : n.value) ?? null, r = ((a = n == null ? void 0 : n.ui) == null ? void 0 : a.text) ?? ((l = n == null ? void 0 : n.querySelector) == null ? void 0 : l.call(n, 'input[type="text"]')), o = ((c = n == null ? void 0 : n.ui) == null ? void 0 : c.input) ?? ((u = n == null ? void 0 : n.querySelector) == null ? void 0 : u.call(n, 'input[type="color"]'));
  T("LightPresets | Color state after apply", {
    ...t,
    textValue: (r == null ? void 0 : r.value) ?? null,
    pickerValue: i,
    swatchValue: (o == null ? void 0 : o.value) ?? null
  });
}
s(Ki, "logAppliedColorState");
function ns(e) {
  e.querySelectorAll("select[data-category-id]").forEach((t) => {
    t.value = "";
  });
}
s(ns, "resetCategorySelections");
function is(e) {
  const t = {};
  return e.querySelectorAll("select[data-category-id]").forEach((n) => {
    var o, a;
    const i = n.dataset.categoryId, r = (a = (o = n.value) == null ? void 0 : o.trim) == null ? void 0 : a.call(o);
    !i || !r || (t[i] = r);
  }), Object.keys(t).length > 0 ? t : null;
}
s(is, "readCategorySelections");
function qr(e) {
  const t = (e == null ? void 0 : e.object) ?? (e == null ? void 0 : e.document) ?? null;
  return !(t != null && t.isEmbedded) || t.documentName !== "AmbientLight" ? null : t;
}
s(qr, "getAmbientLightDocument");
function rs(e) {
  if (!(e != null && e.isEmbedded)) return null;
  const t = e.parent ?? null;
  if (!t) return e;
  if (typeof t.getEmbeddedDocument == "function") {
    const i = t.getEmbeddedDocument(e.documentName, e.id);
    if (i) return i;
  }
  const n = t.lights;
  if (n != null && n.get) {
    const i = n.get(e.id);
    if (i) return i;
  }
  return e;
}
s(rs, "getPersistedAmbientLightDocument");
function os() {
  zo();
}
s(os, "registerLightPresetHooks");
os();
const yi = /* @__PURE__ */ new Map();
let pi = !1;
function ss(e, t) {
  yi.has(e) && console.warn(`[${O}] Socket handler for type "${e}" already registered, overwriting.`), yi.set(e, t);
}
s(ss, "registerSocketHandler");
function as(e, t) {
  if (!pi) {
    console.error(`[${O}] Socket not initialized. Call initializeSocket() first.`);
    return;
  }
  game.socket.emit(`module.${O}`, { type: e, payload: t });
}
s(as, "emitSocket");
function ls() {
  pi || (game.socket.on(`module.${O}`, (e) => {
    const { type: t, payload: n } = e ?? {}, i = yi.get(t);
    i ? i(n) : console.warn(`[${O}] No socket handler for type "${t}"`);
  }), pi = !0, console.log(`[${O}] Socket initialized on channel module.${O}`));
}
s(ls, "initializeSocket");
const Br = "tween", Yt = /* @__PURE__ */ new Map();
function Gr({ type: e, execute: t, validate: n }) {
  Yt.has(e) && console.warn(`[tween-registry] Type "${e}" already registered, overwriting.`), Yt.set(e, { type: e, execute: t, validate: n ?? (() => {
  }) });
}
s(Gr, "registerTweenType");
function zr(e) {
  return Yt.get(e);
}
s(zr, "getTweenType");
function Ti() {
  return [...Yt.keys()];
}
s(Ti, "listTweenTypes");
function Wr(e) {
  const t = foundry.canvas.animation.CanvasAnimation;
  return {
    linear: t.easeLinear,
    easeInOutCosine: t.easeInOutCosine
  }[e] ?? t.easeInOutCosine;
}
s(Wr, "resolveEasing");
function Qt(e) {
  return e <= 0.04045 ? e / 12.92 : ((e + 0.055) / 1.055) ** 2.4;
}
s(Qt, "srgbToLinear");
function ut(e) {
  return e <= 31308e-7 ? 12.92 * e : 1.055 * e ** (1 / 2.4) - 0.055;
}
s(ut, "linearToSrgb");
function Ji(e, t, n) {
  const i = 0.4122214708 * e + 0.5363325363 * t + 0.0514459929 * n, r = 0.2119034982 * e + 0.6806995451 * t + 0.1073969566 * n, o = 0.0883024619 * e + 0.2817188376 * t + 0.6299787005 * n, a = Math.cbrt(i), l = Math.cbrt(r), c = Math.cbrt(o);
  return [
    0.2104542553 * a + 0.793617785 * l - 0.0040720468 * c,
    1.9779984951 * a - 2.428592205 * l + 0.4505937099 * c,
    0.0259040371 * a + 0.7827717662 * l - 0.808675766 * c
  ];
}
s(Ji, "linearRgbToOklab");
function cs(e, t, n) {
  const i = (e + 0.3963377774 * t + 0.2158037573 * n) ** 3, r = (e - 0.1055613458 * t - 0.0638541728 * n) ** 3, o = (e - 0.0894841775 * t - 1.291485548 * n) ** 3;
  return [
    4.0767416621 * i - 3.3077115913 * r + 0.2309699292 * o,
    -1.2684380046 * i + 2.6097574011 * r - 0.3413193965 * o,
    -0.0041960863 * i - 0.7034186147 * r + 1.707614701 * o
  ];
}
s(cs, "oklabToLinearRgb");
function Xt(e) {
  return [e.r, e.g, e.b];
}
s(Xt, "colorToRgb");
function Kr(e, t, n) {
  const i = /* @__PURE__ */ s((o) => Math.max(0, Math.min(1, o)), "clamp"), r = /* @__PURE__ */ s((o) => Math.round(i(o) * 255).toString(16).padStart(2, "0"), "toHex");
  return `#${r(e)}${r(t)}${r(n)}`;
}
s(Kr, "rgbToHex");
function us(e, t, n) {
  if (n <= 0) return e.toHTML();
  if (n >= 1) return t.toHTML();
  const i = foundry.utils.Color, [r, o, a] = e.hsl, [l, c, u] = t.hsl, d = (l - r + 0.5) % 1 - 0.5, h = (r + d * n + 1) % 1, m = o + (c - o) * n, p = a + (u - a) * n;
  return i.fromHSL([h, m, p]).toHTML();
}
s(us, "interpolateHsl");
function ds(e, t, n) {
  if (n <= 0) return e.toHTML();
  if (n >= 1) return t.toHTML();
  const [i, r, o] = Xt(e).map(Qt), [a, l, c] = Xt(t).map(Qt), u = ut(i + (a - i) * n), d = ut(r + (l - r) * n), h = ut(o + (c - o) * n);
  return Kr(u, d, h);
}
s(ds, "interpolateRgb");
function fs(e, t, n) {
  if (n <= 0) return e.toHTML();
  if (n >= 1) return t.toHTML();
  const [i, r, o] = Xt(e).map(Qt), [a, l, c] = Xt(t).map(Qt), [u, d, h] = Ji(i, r, o), [m, p, g] = Ji(a, l, c), L = 0.02, I = Math.sqrt(d * d + h * h), b = Math.sqrt(p * p + g * g);
  let w, A, R;
  if (I < L || b < L)
    w = u + (m - u) * n, A = d + (p - d) * n, R = h + (g - h) * n;
  else {
    const B = Math.atan2(h, d);
    let q = Math.atan2(g, p) - B;
    q > Math.PI && (q -= 2 * Math.PI), q < -Math.PI && (q += 2 * Math.PI), w = u + (m - u) * n;
    const ie = I + (b - I) * n, E = B + q * n;
    A = ie * Math.cos(E), R = ie * Math.sin(E);
  }
  const [_, x, F] = cs(w, A, R);
  return Kr(ut(_), ut(x), ut(F));
}
s(fs, "interpolateOklch");
const bi = {
  hsl: us,
  rgb: ds,
  oklch: fs
};
function gs(e = "hsl") {
  return bi[e] ?? bi.hsl;
}
s(gs, "getInterpolator");
function Yi() {
  return Object.keys(bi);
}
s(Yi, "listInterpolationModes");
function ms(e) {
  if ((Array.isArray(e.uuid) ? e.uuid : [e.uuid]).some((n) => !n || typeof n != "string"))
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
  if (e.mode && !Yi().includes(e.mode))
    throw new Error(
      `light-color tween: unknown mode "${e.mode}". Available: ${Yi().join(", ")}`
    );
}
s(ms, "validate$1");
async function hs(e, t = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { Color: i } = foundry.utils, { uuid: r, toColor: o, toAlpha: a, mode: l = "oklch" } = e, c = Array.isArray(r) ? r : [r];
  if (c.length === 0)
    return console.warn("light-color tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: u = 2e3,
    easing: d = "easeInOutCosine",
    commit: h = !0,
    startEpochMS: m = null
  } = t, p = Wr(d), g = o != null, L = a != null, I = g ? gs(l) : null, b = g ? i.fromString(o) : null;
  if (g && !b.valid) throw new Error(`light-color tween: invalid target color "${o}".`);
  async function w(R) {
    var $, V;
    const _ = await fromUuid(R);
    if (!_) return !1;
    const x = _.object;
    if (!x) return !1;
    let F;
    if (g) {
      const y = ($ = _.config) == null ? void 0 : $.color;
      y != null && y.valid || console.warn(`light-color tween: source color invalid on ${R}, using white.`), F = y != null && y.valid ? y : i.fromString("#ffffff");
    }
    const B = L ? ((V = _._source.config) == null ? void 0 : V.alpha) ?? 0.5 : null, H = { t: 0 }, q = `ambient-hue-tween:${R}`;
    n.terminateAnimation(q);
    const ie = typeof m == "number" ? Math.max(0, Math.min(u, Date.now() - m)) : 0, E = /* @__PURE__ */ s((y) => {
      const W = {};
      g && (W.color = I(F, b, y)), L && (W.alpha = B + (a - B) * y), _.updateSource({ config: W }), x.initializeLightSource();
    }, "applyFrame");
    ie > 0 && (H.t = ie / u, E(H.t));
    const U = await n.animate(
      [{ parent: H, attribute: "t", to: 1 }],
      {
        name: q,
        duration: u,
        easing: p,
        time: ie,
        ontick: /* @__PURE__ */ s(() => E(H.t), "ontick")
      }
    );
    if (U !== !1) {
      const y = {};
      g && (y.color = b.toHTML()), L && (y.alpha = a), _.updateSource({ config: y }), x.initializeLightSource();
    }
    if (h && U !== !1 && _.canUserModify(game.user, "update")) {
      const y = {}, W = {};
      g && (y.color = F.toHTML(), W["config.color"] = b.toHTML()), L && (y.alpha = B, W["config.alpha"] = a), _.updateSource({ config: y }), await _.update(W);
    }
    return U !== !1;
  }
  return s(w, "animateOne"), (await Promise.all(c.map(w))).every(Boolean);
}
s(hs, "execute$1");
function ys() {
  Gr({ type: "light-color", execute: hs, validate: ms });
}
s(ys, "registerLightColorTween");
const He = /* @__PURE__ */ new WeakMap();
function ps(e) {
  if ((Array.isArray(e.uuid) ? e.uuid : [e.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("light-state tween: 'uuid' is required (string or array of AmbientLight document UUIDs).");
  if (typeof e.enabled != "boolean")
    throw new Error("light-state tween: 'enabled' (boolean) is required.");
}
s(ps, "validate");
async function Ts(e, t = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, enabled: r } = e, o = Array.isArray(i) ? i : [i];
  if (o.length === 0)
    return console.warn("light-state tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: a = 2e3,
    easing: l = "easeInOutCosine",
    commit: c = !0,
    startEpochMS: u = null
  } = t, d = Wr(l);
  async function h(p) {
    var _, x, F, B;
    const g = await fromUuid(p);
    if (!g) return !1;
    const L = g.object;
    if (!L) return !1;
    const I = `ambient-state-tween:${p}`;
    n.terminateAnimation(I);
    const b = He.get(g) ?? {
      hidden: g._source.hidden,
      alpha: ((_ = g._source.config) == null ? void 0 : _.alpha) ?? 0.5
    };
    if (He.set(g, b), T(`light-state START ${r ? "ON" : "OFF"} | snap: ${JSON.stringify(b)} | _source.hidden=${g._source.hidden}, _source.config.alpha=${(x = g._source.config) == null ? void 0 : x.alpha}`), r && !b.hidden || !r && b.hidden)
      return He.delete(g), !0;
    const w = b.alpha, A = typeof u == "number" ? Math.max(0, Math.min(a, Date.now() - u)) : 0, R = /* @__PURE__ */ s((H) => {
      g.updateSource({ config: { alpha: H } }), L.initializeLightSource();
    }, "applyAlpha");
    if (r) {
      g.updateSource({ hidden: !1, config: { alpha: 0 } }), L.initializeLightSource(), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
      const H = { t: 0 };
      A > 0 && (H.t = A / a, R(w * H.t));
      const q = await n.animate(
        [{ parent: H, attribute: "t", to: 1 }],
        {
          name: I,
          duration: a,
          easing: d,
          time: A,
          ontick: /* @__PURE__ */ s(() => R(w * H.t), "ontick")
        }
      );
      return q !== !1 && c && g.canUserModify(game.user, "update") ? (g.updateSource({ hidden: !0, config: { alpha: w } }), await g.update({ hidden: !1 }), T(`light-state FADE-IN committed. _source.hidden=${g._source.hidden}, _source.config.alpha=${(F = g._source.config) == null ? void 0 : F.alpha}`), He.delete(g)) : q === !1 || He.delete(g), q !== !1;
    } else {
      g.updateSource({ hidden: !1, config: { alpha: b.alpha } }), L.initializeLightSource();
      const H = { t: 0 };
      A > 0 && (H.t = A / a, R(w * (1 - H.t)));
      const q = await n.animate(
        [{ parent: H, attribute: "t", to: 1 }],
        {
          name: I,
          duration: a,
          easing: d,
          time: A,
          ontick: /* @__PURE__ */ s(() => R(w * (1 - H.t)), "ontick")
        }
      );
      return q !== !1 && c && g.canUserModify(game.user, "update") ? (await g.update({ hidden: !0 }), g.updateSource({ config: { alpha: w } }), L.initializeLightSource(), T(`light-state FADE-OUT committed+restored. _source.hidden=${g._source.hidden}, _source.config.alpha=${(B = g._source.config) == null ? void 0 : B.alpha}`), He.delete(g)) : q === !1 || (g.updateSource({ hidden: !0, config: { alpha: w } }), L.initializeLightSource(), He.delete(g)), q !== !1;
    }
  }
  return s(h, "animateOne"), (await Promise.all(o.map(h))).every(Boolean);
}
s(Ts, "execute");
function bs() {
  Gr({ type: "light-state", execute: Ts, validate: ps });
}
s(bs, "registerLightStateTween");
async function vs(e, t, n = {}) {
  if (!game.user.isGM)
    return ui.notifications.warn("Only the GM can dispatch tweens."), !1;
  const i = zr(e);
  if (!i)
    throw new Error(`Unknown tween type: "${e}". Registered types: ${Ti().join(", ")}`);
  i.validate(t);
  const { durationMS: r = 2e3, easing: o = "easeInOutCosine", commit: a = !0 } = n, l = Date.now();
  return as(Br, {
    type: e,
    params: t,
    durationMS: r,
    easing: o,
    startEpochMS: l,
    commit: !1
  }), i.execute(t, { durationMS: r, easing: o, commit: a, startEpochMS: l });
}
s(vs, "dispatchTween");
function Os(e) {
  const { type: t, params: n, durationMS: i, easing: r, startEpochMS: o, commit: a } = e ?? {}, l = zr(t);
  if (!l) {
    console.warn(`[${O}] Received unknown tween type over socket: "${t}"`);
    return;
  }
  l.execute(n, {
    durationMS: i,
    easing: r,
    commit: a ?? !1,
    startEpochMS: o
  });
}
s(Os, "handleTweenSocketMessage");
ys();
bs();
ss(Br, Os);
function Ls() {
  Hooks.once("ready", () => {
    ls();
    const e = game.modules.get(O);
    e.api || (e.api = {}), e.api.tween = {
      dispatch: vs,
      types: Ti
    }, console.log(`[${O}] Tween API registered. Types: ${Ti().join(", ")}`);
  });
}
s(Ls, "registerTweenHooks");
Ls();
//# sourceMappingURL=eidolon-utilities.js.map
