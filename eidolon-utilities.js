var lc = Object.defineProperty;
var _f = Object.getPrototypeOf;
var Df = Reflect.get;
var cc = (t) => {
  throw TypeError(t);
};
var Ff = (t, e, n) => e in t ? lc(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var c = (t, e) => lc(t, "name", { value: e, configurable: !0 });
var pe = (t, e, n) => Ff(t, typeof e != "symbol" ? e + "" : e, n), xo = (t, e, n) => e.has(t) || cc("Cannot " + n);
var f = (t, e, n) => (xo(t, e, "read from private field"), n ? n.call(t) : e.get(t)), I = (t, e, n) => e.has(t) ? cc("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, n), L = (t, e, n, i) => (xo(t, e, "write to private field"), i ? i.call(t, n) : e.set(t, n), n), S = (t, e, n) => (xo(t, e, "access private method"), n);
var Ro = (t, e, n, i) => ({
  set _(r) {
    L(t, e, r, n);
  },
  get _() {
    return f(t, e, i);
  }
}), _e = (t, e, n) => Df(_f(t), n, e);
const T = "eidolon-utilities", pa = "timeTriggerActive", os = "timeTriggerHideWindow", ss = "timeTriggerShowPlayerWindow", ls = "timeTriggerAllowRealTime", pu = "timeTriggers", Zr = "timeTriggerHistory", cs = "debug", us = "timeFormat", ds = "manageTime", fs = "secondsPerRound";
const Pf = [-30, -15, -5, 5, 15, 30], bi = 1440 * 60, ea = "playSound", _r = 6;
function E(t, e) {
  var n, i;
  return (i = (n = game.i18n) == null ? void 0 : n.has) != null && i.call(n, t) ? game.i18n.localize(t) : e;
}
c(E, "localize");
function St(t) {
  return typeof t != "string" ? "" : t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
c(St, "escapeHtml");
function _t(t) {
  var e;
  return t == null ? t : (e = foundry == null ? void 0 : foundry.utils) != null && e.duplicate ? foundry.utils.duplicate(t) : JSON.parse(JSON.stringify(t));
}
c(_t, "duplicateData");
function xf() {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
c(xf, "generateTriggerId");
function yu(t) {
  if (typeof t != "string") return null;
  const e = t.trim();
  if (!e) return null;
  const n = e.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (!n) return null;
  const i = Number(n[1]), r = Number(n[2]), a = n[3] !== void 0 ? Number(n[3]) : 0;
  return !Number.isInteger(i) || !Number.isInteger(r) || !Number.isInteger(a) || i < 0 || i > 23 || r < 0 || r > 59 || a < 0 || a > 59 ? null : i * 3600 + r * 60 + a;
}
c(yu, "parseTriggerTimeToSeconds");
function zi() {
  var t, e;
  return ((t = game.scenes) == null ? void 0 : t.current) ?? ((e = game.scenes) == null ? void 0 : e.active) ?? null;
}
c(zi, "getActiveScene");
function Ft(t) {
  return (t == null ? void 0 : t.object) ?? (t == null ? void 0 : t.document) ?? null;
}
c(Ft, "getSceneFromApplication");
function Ue(t) {
  return t && typeof t.getFlag == "function" && typeof t.setFlag == "function";
}
c(Ue, "hasSceneDocument");
const ms = /* @__PURE__ */ new Set(), gs = /* @__PURE__ */ new Set(), hs = /* @__PURE__ */ new Set(), ps = /* @__PURE__ */ new Set();
let ti = !1, ar = !1, ya = _r, ba = "12h", uc = !1;
function Ho(t) {
  ti = !!t;
  for (const e of ms)
    try {
      e(ti);
    } catch (n) {
      console.error(`${T} | Debug change handler failed`, n);
    }
}
c(Ho, "notifyDebugChange");
function qo(t) {
  ar = !!t;
  for (const e of gs)
    try {
      e(ar);
    } catch (n) {
      console.error(`${T} | Manage time change handler failed`, n);
    }
}
c(qo, "notifyManageTimeChange");
function bu(t) {
  return t === "24h" ? "24h" : "12h";
}
c(bu, "normalizeTimeFormatValue");
function Nl(t) {
  const e = Number(t);
  return !Number.isFinite(e) || e <= 0 ? _r : e;
}
c(Nl, "normalizeSecondsPerRoundValue");
function jo(t) {
  const e = Nl(t);
  ya = e;
  for (const n of hs)
    try {
      n(e);
    } catch (i) {
      console.error(`${T} | Seconds-per-round change handler failed`, i);
    }
}
c(jo, "notifySecondsPerRoundChange");
function Bo(t) {
  const e = bu(t);
  ba = e;
  for (const n of ps)
    try {
      n(e);
    } catch (i) {
      console.error(`${T} | Time format change handler failed`, i);
    }
}
c(Bo, "notifyTimeFormatChange");
function Rf() {
  var e;
  if (uc) return;
  if (uc = !0, !((e = game == null ? void 0 : game.settings) != null && e.register)) {
    console.warn(
      `${T} | game.settings.register is unavailable. Module settings could not be registered.`
    );
    return;
  }
  const t = typeof game.settings.registerChange == "function";
  game.settings.register(T, cs, {
    name: E("EIDOLON.TimeTrigger.DebugSettingName", "Enable debug logging"),
    hint: E(
      "EIDOLON.TimeTrigger.DebugSettingHint",
      "Write detailed time-trigger diagnostics to the browser console."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: t ? void 0 : Ho
  }), t && game.settings.registerChange(T, cs, Ho), ti = kl(), Ho(ti), game.settings.register(T, ds, {
    name: E("EIDOLON.TimeTrigger.ManageTimeSettingName", "Manage Game Time"),
    hint: E(
      "EIDOLON.TimeTrigger.ManageTimeSettingHint",
      "Allow Eidolon Utilities to advance world time automatically while the game is unpaused. Warning: This may conflict with other time-management modules."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: t ? void 0 : qo
  }), t && game.settings.registerChange(T, ds, qo), ar = qf(), qo(ar), game.settings.register(T, fs, {
    name: E(
      "EIDOLON.TimeTrigger.SecondsPerRoundSettingName",
      "Seconds Per Combat Round"
    ),
    hint: E(
      "EIDOLON.TimeTrigger.SecondsPerRoundSettingHint",
      "Amount of world seconds to add whenever a combat round ends while time management is active."
    ),
    scope: "world",
    config: !0,
    type: Number,
    default: _r,
    range: { min: 1, max: 3600, step: 1 },
    onChange: t ? void 0 : jo
  }), t && game.settings.registerChange(
    T,
    fs,
    jo
  ), ya = Nl(jf()), jo(ya), game.settings.register(T, us, {
    name: E("EIDOLON.TimeTrigger.TimeFormatSettingName", "Trigger Time Format"),
    hint: E(
      "EIDOLON.TimeTrigger.TimeFormatSettingHint",
      "Control whether trigger times use a 12-hour or 24-hour clock."
    ),
    scope: "world",
    config: !0,
    type: String,
    choices: {
      "12h": E(
        "EIDOLON.TimeTrigger.TimeFormatSettingChoice12Hour",
        "12-hour (e.g. 2:30 PM)"
      ),
      "24h": E(
        "EIDOLON.TimeTrigger.TimeFormatSettingChoice24Hour",
        "24-hour (e.g. 14:30)"
      )
    },
    default: "12h",
    onChange: t ? void 0 : Bo
  }), t && game.settings.registerChange(T, us, Bo), ba = bu(vu()), Bo(ba);
}
c(Rf, "registerTimeTriggerSettings");
function kl() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return !!game.settings.get(T, cs);
  } catch (e) {
    console.error(`${T} | Failed to read debug setting`, e);
  }
  return !1;
}
c(kl, "getDebugSetting");
function Hf() {
  return ti = kl(), ti;
}
c(Hf, "refreshDebugSettingCache");
function qf() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return !!game.settings.get(T, ds);
  } catch (e) {
    console.error(`${T} | Failed to read manage time setting`, e);
  }
  return !1;
}
c(qf, "getManageTimeSetting");
function vu() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return game.settings.get(T, us) === "24h" ? "24h" : "12h";
  } catch (e) {
    console.error(`${T} | Failed to read time format setting`, e);
  }
  return "12h";
}
c(vu, "getTimeFormatSetting");
function jf() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get) {
      const e = game.settings.get(T, fs);
      return Nl(e);
    }
  } catch (e) {
    console.error(`${T} | Failed to read seconds-per-round setting`, e);
  }
  return _r;
}
c(jf, "getSecondsPerRoundSetting");
function Bf(t) {
  if (typeof t != "function")
    return () => {
    };
  ms.add(t);
  try {
    t(ti);
  } catch (e) {
    console.error(`${T} | Debug change handler failed`, e);
  }
  return () => {
    ms.delete(t);
  };
}
c(Bf, "onDebugSettingChange");
function wu(t) {
  if (typeof t != "function")
    return () => {
    };
  gs.add(t);
  try {
    t(ar);
  } catch (e) {
    console.error(`${T} | Manage time change handler failed`, e);
  }
  return () => {
    gs.delete(t);
  };
}
c(wu, "onManageTimeSettingChange");
function $l(t) {
  if (typeof t != "function")
    return () => {
    };
  ps.add(t);
  try {
    t(ba);
  } catch (e) {
    console.error(`${T} | Time format change handler failed`, e);
  }
  return () => {
    ps.delete(t);
  };
}
c($l, "onTimeFormatSettingChange");
function Uf(t) {
  if (typeof t != "function")
    return () => {
    };
  hs.add(t);
  try {
    t(ya);
  } catch (e) {
    console.error(`${T} | Seconds-per-round change handler failed`, e);
  }
  return () => {
    hs.delete(t);
  };
}
c(Uf, "onSecondsPerRoundSettingChange");
let vo = !1, ys = !1;
function bs(t) {
  vo = !!t;
}
c(bs, "updateDebugState");
function Eu() {
  ys || (ys = !0, bs(kl()), Bf((t) => {
    bs(t), console.info(`${T} | Debug ${vo ? "enabled" : "disabled"}`);
  }));
}
c(Eu, "ensureInitialized");
function _l() {
  return ys || Eu(), vo;
}
c(_l, "shouldLog");
function Su(t) {
  if (!t.length)
    return [`${T} |`];
  const [e, ...n] = t;
  return typeof e == "string" ? [`${T} | ${e}`, ...n] : [`${T} |`, e, ...n];
}
c(Su, "formatArgs");
function Vf() {
  Eu();
}
c(Vf, "initializeDebug");
function zf() {
  return bs(Hf()), vo;
}
c(zf, "syncDebugState");
function M(...t) {
  _l() && console.debug(...Su(t));
}
c(M, "debugLog");
function Ni(...t) {
  _l() && console.group(...Su(t));
}
c(Ni, "debugGroup");
function pn() {
  _l() && console.groupEnd();
}
c(pn, "debugGroupEnd");
function vi(t) {
  var r;
  const e = (r = t == null ? void 0 : t.getFlag) == null ? void 0 : r.call(t, T, pu);
  if (!e) return [];
  const n = _t(e), i = Array.isArray(n) ? n : [];
  return M("Loaded time triggers", {
    sceneId: (t == null ? void 0 : t.id) ?? null,
    count: i.length
  }), i;
}
c(vi, "getTimeTriggers");
async function Tu(t, e) {
  t != null && t.setFlag && (M("Persisting time triggers", {
    sceneId: t.id,
    count: Array.isArray(e) ? e.length : 0
  }), await t.setFlag(T, pu, e));
}
c(Tu, "setTimeTriggers");
function Gf(t) {
  var r;
  const e = (r = t == null ? void 0 : t.getFlag) == null ? void 0 : r.call(t, T, Zr);
  if (!e) return {};
  const n = _t(e);
  if (!n || typeof n != "object") return {};
  const i = {};
  for (const [a, o] of Object.entries(n))
    typeof o == "number" && Number.isFinite(o) && (i[a] = o);
  return M("Loaded time trigger history", {
    sceneId: (t == null ? void 0 : t.id) ?? null,
    keys: Object.keys(i)
  }), i;
}
c(Gf, "getTimeTriggerHistory");
async function Uo(t, e) {
  var l, u, d, m;
  if (!t) return;
  const n = {};
  if (e && typeof e == "object")
    for (const [g, y] of Object.entries(e))
      typeof y == "number" && Number.isFinite(y) && (n[g] = y);
  const i = ((l = t.getFlag) == null ? void 0 : l.call(t, T, Zr)) ?? {}, r = {};
  if (i && typeof i == "object")
    for (const [g, y] of Object.entries(i))
      typeof y == "number" && Number.isFinite(y) && (r[g] = y);
  const a = Object.keys(n), o = Object.keys(r);
  if (typeof ((u = foundry == null ? void 0 : foundry.utils) == null ? void 0 : u.deepEqual) == "function" ? foundry.utils.deepEqual(r, n) : JSON.stringify(r) === JSON.stringify(n)) {
    M("Skip history update because state is unchanged", {
      sceneId: (t == null ? void 0 : t.id) ?? null
    });
    return;
  }
  M("Updating time trigger history", {
    sceneId: (t == null ? void 0 : t.id) ?? null,
    keys: a,
    removedKeys: o.filter((g) => !a.includes(g))
  });
  try {
    o.length && typeof t.unsetFlag == "function" && await t.unsetFlag(T, Zr), a.length && await t.setFlag(T, Zr, n);
  } catch (g) {
    console.error(`${T} | Failed to persist time trigger history`, g), (m = (d = ui.notifications) == null ? void 0 : d.error) == null || m.call(
      d,
      E(
        "EIDOLON.TimeTrigger.HistoryPersistError",
        "Failed to persist the scene's time trigger history."
      )
    );
  }
}
c(Uo, "updateTimeTriggerHistory");
const va = /* @__PURE__ */ new Map(), dc = /* @__PURE__ */ new Set();
function Wf(t) {
  if (!(t != null && t.id))
    throw new Error(`${T} | Action definitions require an id.`);
  if (va.has(t.id))
    throw new Error(`${T} | Duplicate time trigger action id: ${t.id}`);
  va.set(t.id, {
    ...t
  }), M("Registered time trigger action", { actionId: t.id });
}
c(Wf, "registerAction");
function Dr(t) {
  return va.get(t) ?? null;
}
c(Dr, "getAction");
function Jf(t) {
  const e = Dr(t);
  return e ? typeof e.label == "function" ? e.label() : e.label : t;
}
c(Jf, "getActionLabel");
function fc() {
  return Array.from(va.values());
}
c(fc, "listActions");
async function Cu(t, e) {
  var i, r;
  const n = Dr(e == null ? void 0 : e.action);
  if (!n || typeof n.execute != "function") {
    const a = E(
      "EIDOLON.TimeTrigger.UnknownAction",
      "Encountered an unknown time trigger action and skipped it."
    );
    (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, a), console.warn(`${T} | Unknown time trigger action`, e), M("Encountered unknown time trigger action", {
      triggerId: (e == null ? void 0 : e.id) ?? null,
      actionId: (e == null ? void 0 : e.action) ?? null
    });
    return;
  }
  M("Executing action handler", {
    actionId: n.id,
    triggerId: (e == null ? void 0 : e.id) ?? null,
    sceneId: (t == null ? void 0 : t.id) ?? null
  }), await n.execute({ scene: t, trigger: e });
}
c(Cu, "executeTriggerAction");
function Kf(t) {
  const e = Dr(t == null ? void 0 : t.action);
  return !e || typeof e.buildSummaryParts != "function" ? [] : e.buildSummaryParts({ trigger: t, escapeHtml: St, localize: E }) ?? [];
}
c(Kf, "buildActionSummaryParts");
function Yf(t) {
  const e = Dr(t == null ? void 0 : t.action);
  return !e || typeof e.buildFormContent != "function" ? "" : e.buildFormContent({ trigger: t, escapeHtml: St, localize: E }) ?? "";
}
c(Yf, "buildActionFormSection");
function Qf(t, e) {
  const n = Dr(t == null ? void 0 : t.action);
  !n || typeof n.prepareFormData != "function" || n.prepareFormData({ trigger: t, formData: e });
}
c(Qf, "applyActionFormData");
function Xf(t, e, n) {
  var a, o;
  const i = `${(t == null ? void 0 : t.id) ?? "unknown"}:${(e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.action) ?? "unknown"}:${n}`;
  if (dc.has(i)) return;
  dc.add(i);
  const r = E(
    "EIDOLON.TimeTrigger.MissingDataWarning",
    "A scene time trigger is missing required data and was skipped."
  );
  (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, r), console.warn(`${T} | Missing trigger data (${n})`, { scene: t == null ? void 0 : t.id, trigger: e });
}
c(Xf, "warnMissingTriggerData");
async function Zf({ scene: t, trigger: e }) {
  var a, o, s, l, u;
  const n = (s = (o = (a = e == null ? void 0 : e.data) == null ? void 0 : a.path) == null ? void 0 : o.trim) == null ? void 0 : s.call(o);
  if (!n) {
    Xf(t, e, "missing-audio-path");
    return;
  }
  const i = {
    src: n,
    autoplay: !0,
    loop: !1
  }, r = (() => {
    var d, m, g, y, h;
    return typeof ((m = (d = foundry == null ? void 0 : foundry.audio) == null ? void 0 : d.AudioHelper) == null ? void 0 : m.play) == "function" ? foundry.audio.AudioHelper.play(i, !0) : typeof ((y = (g = game == null ? void 0 : game.audio) == null ? void 0 : g.constructor) == null ? void 0 : y.play) == "function" ? game.audio.constructor.play(i, !0) : typeof ((h = game == null ? void 0 : game.audio) == null ? void 0 : h.play) == "function" ? game.audio.play(i, !0) : null;
  })();
  if (!r) {
    console.error(`${T} | Foundry audio helper is unavailable`), (u = (l = ui.notifications) == null ? void 0 : l.error) == null || u.call(
      l,
      E(
        "EIDOLON.TimeTrigger.AudioHelperUnavailable",
        "Unable to play audio for a time trigger because the Foundry audio helper is unavailable."
      )
    );
    return;
  }
  await r;
}
c(Zf, "executePlaySoundAction");
Wf({
  id: ea,
  label: /* @__PURE__ */ c(() => E("EIDOLON.TimeTrigger.ActionPlaySound", "Play Sound"), "label"),
  execute: Zf,
  buildSummaryParts: /* @__PURE__ */ c(({ trigger: t, escapeHtml: e, localize: n }) => {
    var r;
    return (r = t == null ? void 0 : t.data) != null && r.path ? [`${e(n("EIDOLON.TimeTrigger.TriggerSound", "Sound File"))}: ${e(t.data.path)}`] : [];
  }, "buildSummaryParts"),
  buildFormContent: /* @__PURE__ */ c(({ trigger: t, escapeHtml: e, localize: n }) => {
    var s;
    const i = e(n("EIDOLON.TimeTrigger.TriggerSound", "Sound File")), r = e(
      n("EIDOLON.TimeTrigger.TriggerChooseFile", "Select File")
    ), a = e(
      n(
        "EIDOLON.TimeTrigger.TriggerSoundNotes",
        "Select or upload the audio file that should play when this trigger fires."
      )
    ), o = e(((s = t == null ? void 0 : t.data) == null ? void 0 : s.path) ?? "");
    return `
      <label>${i}</label>
      <div class="form-fields">
        <input type="text" name="playSoundPath" value="${o}" data-dtype="String">
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
      <p class="hint">${a}</p>
    `;
  }, "buildFormContent"),
  prepareFormData: /* @__PURE__ */ c(({ trigger: t, formData: e }) => {
    var n, i;
    t.data.path = ((i = (n = e.playSoundPath) == null ? void 0 : n.trim) == null ? void 0 : i.call(n)) ?? "";
  }, "prepareFormData")
});
var cu;
const { ApplicationV2: In, HandlebarsApplicationMixin: On } = ((cu = foundry.applications) == null ? void 0 : cu.api) ?? {};
if (!In || !On)
  throw new Error(
    `${T} | ApplicationV2 API unavailable. Update Foundry VTT to v13 or newer.`
  );
const vn = "AM", ni = "PM";
function yn() {
  return vu();
}
c(yn, "getConfiguredTimeFormat");
function wo(t) {
  if (typeof t != "string") return null;
  const e = t.trim();
  if (!e) return null;
  const n = e.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (!n) return null;
  const i = Number(n[1]), r = Number(n[2]), a = n[3] !== void 0 ? Number(n[3]) : null;
  return !Number.isInteger(i) || !Number.isInteger(r) || i < 0 || i > 23 || r < 0 || r > 59 || a !== null && (!Number.isInteger(a) || a < 0 || a > 59) ? null : {
    hours: i,
    minutes: r,
    seconds: a
  };
}
c(wo, "parseCanonicalTimeString");
function kt({ hours: t, minutes: e, seconds: n }) {
  if (!Number.isInteger(t) || !Number.isInteger(e) || t < 0 || t > 23 || e < 0 || e > 59) return null;
  const i = String(t).padStart(2, "0"), r = String(e).padStart(2, "0");
  if (Number.isInteger(n)) {
    if (n < 0 || n > 59) return null;
    const a = String(n).padStart(2, "0");
    return `${i}:${r}:${a}`;
  }
  return `${i}:${r}`;
}
c(kt, "formatCanonicalTime");
function em(t, { format: e } = {}) {
  if (!t || typeof t != "object") return null;
  const n = Number(t.hour), i = Number(t.minute), r = t.second !== void 0 && t.second !== null, a = r ? Number(t.second) : null, o = r && Number.isFinite(a) ? Math.floor(Math.max(0, Math.min(59, a))) : null;
  if (!Number.isFinite(n) || !Number.isFinite(i)) return null;
  const s = e ?? yn();
  return wa(
    {
      hours: n,
      minutes: i,
      seconds: o
    },
    s
  );
}
c(em, "formatTimeComponentsForDisplay");
function tm(t, { format: e } = {}) {
  const n = wo(t);
  if (!n) return "";
  const i = e ?? yn();
  return wa(n, i);
}
c(tm, "formatTriggerTimeForDisplay");
function wa(t, e = "12h") {
  if (!t) return "";
  const { hours: n, minutes: i, seconds: r = null } = t;
  if (!Number.isInteger(n) || !Number.isInteger(i)) return "";
  const a = Number.isInteger(r);
  if (e === "24h") {
    const g = `${String(n).padStart(2, "0")}:${String(i).padStart(2, "0")}`;
    return a ? `${g}:${String(r).padStart(2, "0")}` : g;
  }
  const o = n >= 12 ? ni : vn, s = n % 12 === 0 ? 12 : n % 12, l = String(s), u = String(i).padStart(2, "0"), d = `${l}:${u}`, m = o === vn ? E("EIDOLON.TimeTrigger.TimePeriodAM", vn) : E("EIDOLON.TimeTrigger.TimePeriodPM", ni);
  if (a) {
    const g = String(r).padStart(2, "0");
    return `${d}:${g} ${m}`;
  }
  return `${d} ${m}`;
}
c(wa, "formatTimeParts");
function mc(t, e = yn()) {
  const n = wo(t);
  if (e === "24h")
    return {
      format: e,
      canonical: n ? kt(n) ?? "" : "",
      hour: n ? String(n.hours).padStart(2, "0") : "",
      minute: n ? String(n.minutes).padStart(2, "0") : ""
    };
  if (!n)
    return {
      format: e,
      canonical: "",
      hour: "",
      minute: "",
      period: vn
    };
  const i = n.hours >= 12 ? ni : vn, r = n.hours % 12 === 0 ? 12 : n.hours % 12;
  return {
    format: e,
    canonical: kt(n) ?? "",
    hour: String(r),
    minute: String(n.minutes).padStart(2, "0"),
    period: i
  };
}
c(mc, "getTimeFormValues");
function nm({ hour: t, minute: e, period: n, time: i }, r = yn()) {
  if (r === "24h") {
    const y = typeof t == "string" ? t.trim() : "", h = typeof e == "string" ? e.trim() : "", p = typeof i == "string" ? i.trim() : "";
    if (!y && !h && p) {
      const C = wo(p);
      return C ? { canonical: kt(C) ?? "", error: null } : {
        canonical: "",
        error: E(
          "EIDOLON.TimeTrigger.TimeFormatInvalid24",
          "Enter a valid time in HH:MM format."
        )
      };
    }
    if (!y || !h)
      return {
        canonical: "",
        error: E("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.")
      };
    const v = Number(y), b = Number(h);
    return !Number.isInteger(v) || v < 0 || v > 23 ? {
      canonical: "",
      error: E(
        "EIDOLON.TimeTrigger.TimeFormatInvalid24",
        "Enter a valid time in HH:MM format."
      )
    } : !Number.isInteger(b) || b < 0 || b > 59 ? {
      canonical: "",
      error: E(
        "EIDOLON.TimeTrigger.TimeFormatInvalid24",
        "Enter a valid time in HH:MM format."
      )
    } : { canonical: kt({
      hours: v,
      minutes: b
    }) ?? "", error: null };
  }
  const a = typeof t == "string" ? t.trim() : "", o = typeof e == "string" ? e.trim() : "", s = typeof n == "string" ? n.trim().toUpperCase() : "";
  if (!a || !o || !s)
    return { canonical: "", error: E("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.") };
  if (s !== vn && s !== ni)
    return { canonical: "", error: E("EIDOLON.TimeTrigger.TimeFormatInvalidPeriod", "Select AM or PM.") };
  const l = Number(a), u = Number(o);
  if (!Number.isInteger(l) || l < 1 || l > 12)
    return {
      canonical: "",
      error: E("EIDOLON.TimeTrigger.TimeFormatInvalidHour", "Hours must be between 1 and 12.")
    };
  if (!Number.isInteger(u) || u < 0 || u > 59)
    return {
      canonical: "",
      error: E("EIDOLON.TimeTrigger.TimeFormatInvalidMinute", "Minutes must be between 00 and 59.")
    };
  const d = l % 12, g = {
    hours: s === ni ? d + 12 : d,
    minutes: u
  };
  return {
    canonical: kt(g) ?? "",
    error: null
  };
}
c(nm, "normalizeFormTimeInput");
function im() {
  return [
    {
      value: vn,
      label: E("EIDOLON.TimeTrigger.TimePeriodAM", vn)
    },
    {
      value: ni,
      label: E("EIDOLON.TimeTrigger.TimePeriodPM", ni)
    }
  ];
}
c(im, "getPeriodOptions");
var Hn, qn, re, Lu, Ua, Va, Iu, ws, Es, za, Ga, Ou, Au, Mu, Ss, Ts, Cs, Wa, Ja, Ls, Ka, Nu, ku;
const xn = class xn extends On(In) {
  constructor(n = {}) {
    var o;
    const { scene: i, showControls: r, ...a } = n ?? {};
    super(a);
    I(this, re);
    I(this, Hn, null);
    I(this, qn, null);
    I(this, Ua, /* @__PURE__ */ c((n) => {
      var r, a;
      n.preventDefault();
      const i = Number((a = (r = n.currentTarget) == null ? void 0 : r.dataset) == null ? void 0 : a.delta);
      Number.isFinite(i) && (M("Time delta button clicked", { delta: i }), this._advanceTime(i));
    }, "#onDeltaClick"));
    I(this, Va, /* @__PURE__ */ c((n) => {
      var i, r;
      n.preventDefault(), !(!this.showControls || !((i = game.user) != null && i.isGM)) && (M("Time value double clicked", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null }), S(this, re, Iu).call(this));
    }, "#onTimeDoubleClick"));
    I(this, za, /* @__PURE__ */ c((n) => {
      if (this.isEditingTime && !this._commitTimeInProgress)
        if (n.key === "Enter") {
          n.preventDefault();
          const i = n.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
          S(this, re, Es).call(this, r);
        } else n.key === "Escape" && (n.preventDefault(), S(this, re, ws).call(this));
    }, "#onTimeInputKeydown"));
    I(this, Ga, /* @__PURE__ */ c((n) => {
      if (!this.isEditingTime || this._commitTimeInProgress || this._suppressBlurCommit) return;
      const i = n.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
      S(this, re, Es).call(this, r);
    }, "#onTimeInputBlur"));
    I(this, Wa, /* @__PURE__ */ c((n) => {
      const i = !!n;
      if (this.manageTimeEnabled === i) return;
      this.manageTimeEnabled = i, (this.rendered ?? this.isRendered ?? !1) && this.render({ force: !0 });
    }, "#handleManageTimeChange"));
    I(this, Ja, /* @__PURE__ */ c(async (n) => {
      var a, o, s, l, u, d, m, g, y;
      if (n.preventDefault(), !this.showControls || !((a = game.user) != null && a.isGM)) return;
      if (!this.manageTimeEnabled) {
        (s = (o = ui.notifications) == null ? void 0 : o.error) == null || s.call(
          o,
          E(
            "EIDOLON.TimeTrigger.SceneRealTimeManageDisabled",
            "Enable Manage Time in module settings to allow automatic real-time flow."
          )
        );
        return;
      }
      const i = this.scene;
      if (!i || typeof i.setFlag != "function") {
        (u = (l = ui.notifications) == null ? void 0 : l.error) == null || u.call(
          l,
          E(
            "EIDOLON.TimeTrigger.SceneUnavailable",
            "The active scene is unavailable. Try again after reloading the world."
          )
        );
        return;
      }
      const r = !this.sceneAllowsRealTime;
      try {
        await i.setFlag(T, ls, r), this.sceneAllowsRealTime = r;
        const h = r ? E(
          "EIDOLON.TimeTrigger.SceneRealTimeEnabled",
          "Automatic real-time flow enabled for this scene."
        ) : E(
          "EIDOLON.TimeTrigger.SceneRealTimeDisabled",
          "Automatic real-time flow disabled for this scene."
        );
        (m = (d = ui.notifications) == null ? void 0 : d.info) == null || m.call(d, h);
      } catch (h) {
        console.error(`${T} | Failed to toggle scene real-time flow`, h), (y = (g = ui.notifications) == null ? void 0 : g.error) == null || y.call(
          g,
          E(
            "EIDOLON.TimeTrigger.SceneRealTimeToggleError",
            "Failed to update the scene's real-time flow setting."
          )
        );
      } finally {
        this.render({ force: !0 });
      }
    }, "#onRealTimeToggleClick"));
    I(this, Ka, /* @__PURE__ */ c(() => {
      (this.rendered ?? this.isRendered ?? !1) && (this.isEditingTime && (this.editValue = S(this, re, Ss).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    this.scene = i ?? null, this.showControls = typeof r == "boolean" ? r : !!((o = game.user) != null && o.isGM), this.isEditingTime = !1, this.editValue = "", this._commitTimeInProgress = !1, this._suppressBlurCommit = !1, this.manageTimeEnabled = !1, this.sceneAllowsRealTime = S(this, re, Ls).call(this), L(this, Hn, $l(f(this, Ka))), L(this, qn, wu(f(this, Wa)));
  }
  async _prepareContext() {
    var b, w;
    const n = ((b = game.time) == null ? void 0 : b.components) ?? {}, r = ((n == null ? void 0 : n.second) !== void 0 && (n == null ? void 0 : n.second) !== null ? em(n) : null) ?? S(this, re, Lu).call(this), a = yn(), o = a === "24h", s = o ? E("EIDOLON.TimeTrigger.EditTimePlaceholder24", "HH:MM") : E("EIDOLON.TimeTrigger.EditTimePlaceholder12", "HH:MM AM/PM"), l = this.showControls ? E(
      "EIDOLON.TimeTrigger.EditTimeHint",
      "Double-click to set a specific time."
    ) : "", u = this.showControls ? E(
      "EIDOLON.TimeTrigger.EditTimeLabel",
      "New time (HH:MM or HH:MM AM/PM)"
    ) : "", d = Pf.map((C) => ({
      minutes: C,
      label: C > 0 ? `+${C}` : `${C}`
    })), m = !!this.manageTimeEnabled, g = S(this, re, Ls).call(this);
    this.sceneAllowsRealTime = g;
    const y = E(
      "EIDOLON.TimeTrigger.SceneRealTimeEnable",
      "Enable automatic real-time flow for this scene."
    ), h = E(
      "EIDOLON.TimeTrigger.SceneRealTimeDisable",
      "Disable automatic real-time flow for this scene."
    ), p = E(
      "EIDOLON.TimeTrigger.SceneRealTimeManageDisabled",
      "Enable Manage Time in module settings to allow automatic real-time flow."
    );
    return {
      formattedTime: r,
      deltas: d,
      manageTimeEnabled: m,
      sceneAllowsRealTime: g,
      realTimeButtonLabel: m ? g ? h : y : p,
      isGM: ((w = game.user) == null ? void 0 : w.isGM) ?? !1,
      showControls: !!this.showControls,
      editHint: l,
      editLabel: u,
      editPlaceholder: s,
      timeFormat: a,
      is24Hour: o,
      isEditingTime: !!this.isEditingTime,
      editValue: this.isEditingTime ? this.editValue ?? "" : ""
    };
  }
  async close(n = {}) {
    var r, a;
    if (!n.force)
      return (this.rendered ?? this.isRendered ?? !1) || (M("TimeTriggerWindow close request rerendering", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null
      }), this.render({ force: !0 })), this;
    M("Closing time trigger window", { sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null, force: !0 });
    const i = await super.close(n);
    return S(this, re, Nu).call(this), S(this, re, ku).call(this), i;
  }
  async _advanceTime(n) {
    var r, a, o, s, l, u, d;
    const i = n * 60;
    if (M("Advancing world time", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null, minutes: n, seconds: i }), !((a = game.user) != null && a.isGM)) {
      (s = (o = ui.notifications) == null ? void 0 : o.warn) == null || s.call(o, E("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time."));
      return;
    }
    try {
      await game.time.advance(i);
    } catch (m) {
      console.error(`${T} | Failed to advance time`, m), (u = (l = ui.notifications) == null ? void 0 : l.error) == null || u.call(
        l,
        E("EIDOLON.TimeTrigger.Error", "Failed to update the world time.")
      ), M("Failed to advance time from window", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        minutes: n,
        message: (m == null ? void 0 : m.message) ?? String(m)
      });
    }
  }
  _onRender(n, i) {
    var a;
    super._onRender(n, i);
    const r = this.element;
    if (r) {
      if (this.showControls) {
        M("Binding time trigger interactions", {
          sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
          buttonCount: r.querySelectorAll("[data-delta]").length
        }), r.querySelectorAll("[data-delta]").forEach((u) => {
          u.addEventListener("click", f(this, Ua));
        });
        const o = r.querySelector('.time-trigger-window__time-value[data-editable="true"]');
        o && o.addEventListener("dblclick", f(this, Va), { once: !1 });
        const s = r.querySelector(".time-trigger-window__time-input");
        s && (s.addEventListener("keydown", f(this, za)), s.addEventListener("blur", f(this, Ga)), typeof s.focus == "function" && (s.focus(), typeof s.select == "function" && s.select()));
        const l = r.querySelector('[data-action="toggle-real-time"]');
        l && l.addEventListener("click", f(this, Ja));
      }
      this._suppressBlurCommit = !1;
    }
  }
};
Hn = new WeakMap(), qn = new WeakMap(), re = new WeakSet(), Lu = /* @__PURE__ */ c(function() {
  var l;
  const n = (l = game.time) == null ? void 0 : l.worldTime;
  if (typeof n != "number" || !Number.isFinite(n)) return "";
  const i = 1440 * 60, r = (Math.floor(n) % i + i) % i, a = Math.floor(r / 3600), o = Math.floor(r % 3600 / 60), s = r % 60;
  return wa({ hours: a, minutes: o, seconds: s }, yn());
}, "#formatFallbackTime"), Ua = new WeakMap(), Va = new WeakMap(), Iu = /* @__PURE__ */ c(function() {
  var n;
  (n = game.user) != null && n.isGM && (this.isEditingTime = !0, this._suppressBlurCommit = !1, this.editValue = S(this, re, Ss).call(this), this.render({ force: !0 }));
}, "#enterTimeEditMode"), ws = /* @__PURE__ */ c(function() {
  this.isEditingTime = !1, this.editValue = "", this._suppressBlurCommit = !1, this.render({ force: !0 });
}, "#cancelTimeEdit"), Es = /* @__PURE__ */ c(async function(n) {
  var a, o, s;
  if (!((a = game.user) != null && a.isGM) || !this.isEditingTime || this._commitTimeInProgress) return;
  this._commitTimeInProgress = !0;
  const i = typeof n == "string" ? n.trim() : "";
  if (!i) {
    S(this, re, ws).call(this), this._commitTimeInProgress = !1;
    return;
  }
  const r = S(this, re, Mu).call(this, i);
  if (r.error) {
    (s = (o = ui.notifications) == null ? void 0 : o.error) == null || s.call(o, r.error), this._suppressBlurCommit = !0, this.editValue = i, this.render({ force: !0 }), this._commitTimeInProgress = !1;
    return;
  }
  try {
    await S(this, re, Au).call(this, r.seconds, r.includeSeconds) ? (this.isEditingTime = !1, this.editValue = "", this.render({ force: !0 })) : (this.editValue = i, this.render({ force: !0 }));
  } finally {
    this._commitTimeInProgress = !1;
  }
}, "#commitTimeInput"), za = new WeakMap(), Ga = new WeakMap(), Ou = /* @__PURE__ */ c(function() {
  var u, d;
  const n = (u = game.time) == null ? void 0 : u.worldTime;
  if (typeof n != "number" || !Number.isFinite(n))
    return "";
  const i = ((d = game.time) == null ? void 0 : d.components) ?? {}, r = Number(i.hour), a = Number(i.minute), o = i.second !== void 0 ? Number(i.second) : null, s = Number.isInteger(o);
  return (Number.isFinite(r) && Number.isFinite(a) ? kt({
    hours: Math.max(0, Math.min(23, Number(r))),
    minutes: Math.max(0, Math.min(59, Number(a))),
    seconds: s && Number.isFinite(o) ? Math.max(0, Math.min(59, Number(o))) : void 0
  }) ?? "" : "") ?? "";
}, "#getCurrentCanonicalTime"), Au = /* @__PURE__ */ c(async function(n, i) {
  var g, y, h, p, v, b, w, C, O, A;
  const r = (g = game.time) == null ? void 0 : g.worldTime;
  if (typeof r != "number" || !Number.isFinite(r))
    return (h = (y = ui.notifications) == null ? void 0 : y.error) == null || h.call(
      y,
      E(
        "EIDOLON.TimeTrigger.EditTimeUnavailable",
        "The world time is unavailable, so it can't be updated."
      )
    ), !1;
  if (!Number.isInteger(n) || n < 0 || n >= bi)
    return (v = (p = ui.notifications) == null ? void 0 : p.error) == null || v.call(
      p,
      E(
        "EIDOLON.TimeTrigger.EditTimeInvalidRange",
        "Enter a time within the current day."
      )
    ), !1;
  const s = Math.floor(r / bi) * bi + n - r;
  if (!Number.isFinite(s) || s === 0)
    return !0;
  const l = Math.floor(n / 3600), u = Math.floor(n % 3600 / 60), d = n % 60, m = kt({
    hours: l,
    minutes: u,
    seconds: i ? d : void 0
  });
  try {
    M("Updating world time directly", {
      sceneId: ((b = this.scene) == null ? void 0 : b.id) ?? null,
      targetCanonical: m ?? null,
      diff: s
    }), await game.time.advance(s);
    const k = wa(
      {
        hours: l,
        minutes: u,
        seconds: i ? d : null
      },
      yn()
    );
    (C = (w = ui.notifications) == null ? void 0 : w.info) == null || C.call(
      w,
      E(
        "EIDOLON.TimeTrigger.EditTimeSuccess",
        "World time updated."
      ) + (k ? ` ${k}` : "")
    );
  } catch (k) {
    return console.error(`${T} | Failed to set world time`, k), (A = (O = ui.notifications) == null ? void 0 : O.error) == null || A.call(
      O,
      E(
        "EIDOLON.TimeTrigger.EditTimeError",
        "Failed to update the world time."
      )
    ), !1;
  }
  return !0;
}, "#applyTargetSeconds"), Mu = /* @__PURE__ */ c(function(n) {
  var m;
  const i = E(
    "EIDOLON.TimeTrigger.EditTimeInvalid",
    "Enter a valid time like 14:30 or 2:30 PM."
  );
  if (typeof n != "string")
    return { error: i };
  const r = n.trim();
  if (!r)
    return { error: i };
  const a = r.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (a) {
    const g = Number(a[1]), y = Number(a[2]), h = a[3] !== void 0 ? Number(a[3]) : void 0;
    if (Number.isInteger(g) && g >= 0 && g <= 23 && Number.isInteger(y) && y >= 0 && y <= 59 && (h === void 0 || Number.isInteger(h) && h >= 0 && h <= 59)) {
      const p = g * 3600 + y * 60 + (h ?? 0);
      return {
        canonical: kt({ hours: g, minutes: y, seconds: h }),
        seconds: p,
        includeSeconds: h !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const { amLower: o, pmLower: s, periodPattern: l } = S(this, re, Ts).call(this), u = r.match(
    new RegExp(
      `^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?\\s*(${l})$`,
      "i"
    )
  );
  if (u) {
    let g = Number(u[1]);
    const y = Number(u[2]), h = u[3] !== void 0 ? Number(u[3]) : void 0, p = u[4] ?? "", v = typeof p == "string" ? ((m = p.toLocaleLowerCase) == null ? void 0 : m.call(p)) ?? p.toLowerCase() : "";
    if (Number.isInteger(g) && g >= 1 && g <= 12 && Number.isInteger(y) && y >= 0 && y <= 59 && (h === void 0 || Number.isInteger(h) && h >= 0 && h <= 59) && (v === o || v === s || v === "am" || v === "pm")) {
      g = g % 12, (v === s || v === "pm") && (g += 12);
      const w = g * 3600 + y * 60 + (h ?? 0);
      return {
        canonical: kt({ hours: g, minutes: y, seconds: h }),
        seconds: w,
        includeSeconds: h !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const d = yu(r);
  if (d !== null) {
    const g = Math.floor(d / 3600), y = Math.floor(d % 3600 / 60), h = d % 60, p = h !== 0;
    return {
      canonical: kt({
        hours: g,
        minutes: y,
        seconds: p ? h : void 0
      }),
      seconds: d,
      includeSeconds: p,
      error: null
    };
  }
  return { error: i };
}, "#parseInputTime"), Ss = /* @__PURE__ */ c(function() {
  const n = S(this, re, Ou).call(this);
  if (!n) return "";
  if (yn() === "24h")
    return n;
  const r = wo(n);
  if (!r) return n;
  const a = Number(r.hours), o = Number(r.minutes), s = r.seconds !== null && r.seconds !== void 0 ? Number(r.seconds) : void 0;
  if (!Number.isFinite(a) || !Number.isFinite(o)) return n;
  const l = Number.isFinite(s), u = a % 12 === 0 ? 12 : a % 12, d = String(o).padStart(2, "0"), m = l ? `:${String(s).padStart(2, "0")}` : "", { amLabel: g, pmLabel: y } = S(this, re, Ts).call(this), h = a >= 12 ? y : g;
  return `${u}:${d}${m} ${h}`.trim();
}, "#getInitialEditValue"), Ts = /* @__PURE__ */ c(function() {
  var u, d;
  const n = E("EIDOLON.TimeTrigger.TimePeriodAM", "AM"), i = E("EIDOLON.TimeTrigger.TimePeriodPM", "PM"), r = ((u = n.toLocaleLowerCase) == null ? void 0 : u.call(n)) ?? n.toLowerCase(), a = ((d = i.toLocaleLowerCase) == null ? void 0 : d.call(i)) ?? i.toLowerCase(), o = S(this, re, Cs).call(this, n), s = S(this, re, Cs).call(this, i), l = `${o}|${s}|AM|PM`;
  return {
    amLabel: n,
    pmLabel: i,
    amLower: r,
    pmLower: a,
    periodPattern: l
  };
}, "#getPeriodMatchData"), Cs = /* @__PURE__ */ c(function(n) {
  return typeof n != "string" ? "" : n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}, "#escapeForRegex"), Wa = new WeakMap(), Ja = new WeakMap(), Ls = /* @__PURE__ */ c(function() {
  const n = this.scene;
  if (!n || typeof n.getFlag != "function") return !1;
  try {
    return !!n.getFlag(T, ls);
  } catch (i) {
    M("TimeTriggerWindow | Failed to read scene real-time flag", {
      sceneId: (n == null ? void 0 : n.id) ?? null,
      message: (i == null ? void 0 : i.message) ?? String(i)
    });
  }
  return !1;
}, "#readSceneRealTimeFlag"), Ka = new WeakMap(), Nu = /* @__PURE__ */ c(function() {
  if (typeof f(this, Hn) == "function")
    try {
      f(this, Hn).call(this);
    } catch (n) {
      console.error(`${T} | Failed to dispose time format subscription`, n);
    }
  L(this, Hn, null);
}, "#disposeTimeFormatSubscription"), ku = /* @__PURE__ */ c(function() {
  if (typeof f(this, qn) == "function")
    try {
      f(this, qn).call(this);
    } catch (n) {
      console.error(`${T} | Failed to dispose manage time subscription`, n);
    }
  L(this, qn, null);
}, "#disposeManageTimeSubscription"), c(xn, "TimeTriggerWindow"), pe(xn, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  _e(xn, xn, "DEFAULT_OPTIONS"),
  {
    id: `${T}-time-trigger`,
    window: {
      title: E("EIDOLON.TimeTrigger.Title", "Time Trigger"),
      resizable: !1
    },
    position: {
      width: "auto",
      height: "auto"
    }
  },
  { inplace: !1 }
)), pe(xn, "PARTS", {
  content: {
    template: `modules/${T}/templates/time-trigger.html`
  }
});
let vs = xn;
function Eo(t, e = {}) {
  if (typeof t != "function")
    throw new TypeError("createApplicationFactory requires a constructor function.");
  const n = /* @__PURE__ */ c(function(r = {}) {
    const a = foundry.utils.mergeObject(
      e ?? {},
      r ?? {},
      { inplace: !1 }
    );
    return new t(a);
  }, "applicationFactory");
  return n.__eidolonFactorySignature = "options", n.__eidolonFactoryTarget = t, n;
}
c(Eo, "createApplicationFactory");
const gc = /* @__PURE__ */ new Set();
var be, We, jn, Di, $u, _u;
const Zl = class Zl {
  constructor({ windowFactory: e } = {}) {
    I(this, Di);
    I(this, be, null);
    I(this, We, null);
    I(this, jn);
    const n = Eo(vs);
    typeof e == "function" ? e.__eidolonFactorySignature === "options" ? L(this, jn, (r, a = {}) => e({ scene: r, ...a ?? {} })) : L(this, jn, e) : L(this, jn, /* @__PURE__ */ c((r, a = {}) => n({ scene: r, ...a ?? {} }), "fallbackFactory"));
  }
  onReady() {
    var n;
    const e = typeof ((n = game.time) == null ? void 0 : n.worldTime) == "number" && Number.isFinite(game.time.worldTime) ? game.time.worldTime : null;
    M("TimeTriggerManager#onReady", { worldTime: e }), e !== null && L(this, We, e);
  }
  onCanvasReady(e) {
    const n = (e == null ? void 0 : e.scene) ?? zi();
    M("TimeTriggerManager#onCanvasReady", { sceneId: (n == null ? void 0 : n.id) ?? null }), this.refreshTimeTriggerWindow(n), this.handleTimeTriggerEvaluation(n);
  }
  onUpdateScene(e) {
    const n = zi();
    M("TimeTriggerManager#onUpdateScene", {
      sceneId: (e == null ? void 0 : e.id) ?? null,
      activeSceneId: (n == null ? void 0 : n.id) ?? null
    }), !(!n || e.id !== n.id) && (this.refreshTimeTriggerWindow(e), this.handleTimeTriggerEvaluation(e));
  }
  onUpdateWorldTime(e, n) {
    M("TimeTriggerManager#onUpdateWorldTime", {
      worldTime: e,
      diff: n,
      hasWindow: !!f(this, be)
    }), f(this, be) && f(this, be).render();
    const i = zi(), r = S(this, Di, $u).call(this, e, n);
    this.handleTimeTriggerEvaluation(i, e, r);
  }
  refreshTimeTriggerWindow(e) {
    var l, u, d;
    if (!e) return;
    const n = !!((l = game.user) != null && l.isGM), i = !!e.getFlag(T, pa), r = !!e.getFlag(T, os), a = !!e.getFlag(T, ss);
    if (M("TimeTriggerManager#refreshTimeTriggerWindow", {
      sceneId: e.id,
      isGM: n,
      isActive: i,
      hideWindow: r,
      showPlayerWindow: a
    }), !(i && !r && (n || a))) {
      f(this, be) && (M("Closing time trigger window", { reason: "not-visible" }), f(this, be).close({ force: !0 }), L(this, be, null));
      return;
    }
    const s = !!n;
    if (f(this, be) && ((u = f(this, be).scene) == null ? void 0 : u.id) === e.id) {
      M("Refreshing existing time trigger window", { sceneId: e.id }), f(this, be).showControls = s, f(this, be).render();
      return;
    }
    f(this, be) && (M("Closing existing window before creating new instance", {
      previousSceneId: ((d = f(this, be).scene) == null ? void 0 : d.id) ?? null
    }), f(this, be).close({ force: !0 })), L(this, be, f(this, jn).call(this, e, { showControls: s })), M("Rendering new time trigger window", { sceneId: e.id }), f(this, be).render({ force: !0 });
  }
  async handleTimeTriggerEvaluation(e, n, i) {
    var l;
    const r = e ?? zi();
    if (!r) {
      M("handleTimeTriggerEvaluation skipped", {
        reason: "no-active-scene",
        providedSceneId: (e == null ? void 0 : e.id) ?? null,
        currentWorldTime: n
      }), typeof n == "number" && Number.isFinite(n) && L(this, We, n);
      return;
    }
    const a = typeof n == "number" && Number.isFinite(n) ? n : typeof ((l = game.time) == null ? void 0 : l.worldTime) == "number" ? game.time.worldTime : null;
    if (a === null) return;
    const o = typeof i == "number" && Number.isFinite(i) ? i : null, s = o !== null ? o : typeof f(this, We) == "number" && Number.isFinite(f(this, We)) ? f(this, We) : a;
    Ni("handleTimeTriggerEvaluation", {
      sceneId: r.id,
      previousWorldTime: s,
      currentWorldTime: a,
      overrideProvided: o !== null
    });
    try {
      await S(this, Di, _u).call(this, r, s, a);
    } catch (u) {
      console.error(`${T} | Unexpected error while evaluating time triggers`, u), M("handleTimeTriggerEvaluation error", { message: (u == null ? void 0 : u.message) ?? String(u) });
    } finally {
      L(this, We, a), pn();
    }
  }
};
be = new WeakMap(), We = new WeakMap(), jn = new WeakMap(), Di = new WeakSet(), $u = /* @__PURE__ */ c(function(e, n) {
  return typeof f(this, We) == "number" && Number.isFinite(f(this, We)) ? (M("Resolved previous world time from cache", {
    previousWorldTime: f(this, We)
  }), f(this, We)) : typeof e == "number" && Number.isFinite(e) && typeof n == "number" && Number.isFinite(n) ? (M("Resolved previous world time using diff", {
    worldTime: e,
    diff: n,
    resolved: e - n
  }), e - n) : typeof e == "number" && Number.isFinite(e) ? e : null;
}, "#resolvePreviousWorldTime"), _u = /* @__PURE__ */ c(async function(e, n, i) {
  var h, p, v;
  if (!((h = game.user) != null && h.isGM)) {
    M("Skipping trigger evaluation because user is not a GM");
    return;
  }
  if (!(e != null && e.id)) {
    M("Skipping trigger evaluation because the scene is missing an id");
    return;
  }
  if (!!!e.getFlag(T, pa)) {
    M("Skipping trigger evaluation because scene is inactive", { sceneId: e.id });
    return;
  }
  if (typeof i != "number" || !Number.isFinite(i)) return;
  (typeof n != "number" || !Number.isFinite(n)) && (n = i);
  const a = vi(e);
  if (!a.length) {
    M("No time triggers configured for scene", { sceneId: e.id });
    return;
  }
  const o = Gf(e), s = /* @__PURE__ */ new Set();
  for (const b of a)
    b != null && b.id && s.add(b.id);
  let l = !1;
  for (const b of Object.keys(o))
    s.has(b) || (delete o[b], l = !0);
  if (Ni("Evaluating scene time triggers", {
    sceneId: e.id,
    previousWorldTime: n,
    currentWorldTime: i,
    triggerCount: a.length
  }), i <= n) {
    M("Detected world time rewind", {
      previousWorldTime: n,
      currentWorldTime: i
    });
    for (const b of a) {
      if (!(b != null && b.id) || !b.allowReplayOnRewind) continue;
      const w = o[b.id];
      typeof w == "number" ? i < w ? (M("Clearing trigger history due to rewind", {
        triggerId: b.id,
        lastFired: w,
        currentWorldTime: i
      }), delete o[b.id], l = !0) : M("Preserving trigger history after rewind", {
        triggerId: b.id,
        lastFired: w,
        currentWorldTime: i
      }) : M("No history stored for rewind-enabled trigger", {
        triggerId: b.id
      });
    }
    l && (M("Persisting history cleanup after rewind", {
      sceneId: e.id
    }), await Uo(e, o)), pn();
    return;
  }
  const u = n, d = i, m = [], g = Math.floor(u / bi), y = Math.floor(d / bi);
  for (const b of a) {
    if (!(b != null && b.id)) continue;
    const w = yu(b.time);
    if (w === null) {
      rm(e, b), M("Skipping trigger with invalid time", {
        triggerId: b.id,
        time: b.time
      });
      continue;
    }
    for (let C = g; C <= y; C++) {
      const O = C * bi + w;
      if (O < u || O > d) continue;
      const k = o[b.id];
      if (typeof k == "number" && k >= O) {
        M("Skipping trigger because it already fired within window", {
          triggerId: b.id,
          lastFired: k,
          absoluteTime: O
        });
        continue;
      }
      m.push({ trigger: b, absoluteTime: O });
    }
  }
  if (!m.length) {
    l && await Uo(e, o), M("No triggers scheduled to fire within evaluation window", {
      sceneId: e.id
    }), pn();
    return;
  }
  m.sort((b, w) => b.absoluteTime - w.absoluteTime), M("Queued triggers for execution", {
    entries: m.map((b) => ({
      triggerId: b.trigger.id,
      absoluteTime: b.absoluteTime
    }))
  });
  for (const b of m)
    try {
      M("Executing time trigger action", {
        triggerId: b.trigger.id,
        absoluteTime: b.absoluteTime
      }), await Cu(e, b.trigger);
    } catch (w) {
      console.error(`${T} | Failed to execute time trigger action`, w), (v = (p = ui.notifications) == null ? void 0 : p.error) == null || v.call(
        p,
        E(
          "EIDOLON.TimeTrigger.TriggerActionError",
          "Failed to execute a scene time trigger action. Check the console for details."
        )
      ), M("Trigger execution failed", {
        triggerId: b.trigger.id,
        message: (w == null ? void 0 : w.message) ?? String(w)
      });
    } finally {
      o[b.trigger.id] = b.absoluteTime, l = !0, M("Recorded trigger execution", {
        triggerId: b.trigger.id,
        absoluteTime: b.absoluteTime
      });
    }
  l && (M("Persisting trigger history updates", { sceneId: e.id }), await Uo(e, o)), pn();
}, "#evaluateSceneTimeTriggers"), c(Zl, "TimeTriggerManager");
let Is = Zl;
function rm(t, e) {
  var r, a;
  const n = `${(t == null ? void 0 : t.id) ?? "unknown"}:${(e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.time) ?? "unknown"}`;
  if (gc.has(n)) return;
  gc.add(n);
  const i = E(
    "EIDOLON.TimeTrigger.InvalidTimeWarning",
    "A scene time trigger has an invalid time value and was skipped."
  );
  (a = (r = ui.notifications) == null ? void 0 : r.warn) == null || a.call(r, i), console.warn(`${T} | Invalid time for trigger`, { scene: t == null ? void 0 : t.id, trigger: e });
}
c(rm, "warnInvalidTriggerTime");
var bt, mr, vt, rn, Bn, At, Ci, Ya, Qa, gr, hr, Un, Mt, V, As, fi, ta, Ms, na, Ns, It, Du, ks, Fu, $s, Pu, Xa, Za, eo, to, no, io, _s, xu, ia, ro, ao;
const ec = class ec {
  constructor() {
    I(this, V);
    I(this, bt, !1);
    I(this, mr, _r);
    I(this, vt, /* @__PURE__ */ new Map());
    I(this, rn, null);
    I(this, Bn, null);
    I(this, At, 0);
    I(this, Ci, null);
    I(this, Ya, null);
    I(this, Qa, null);
    I(this, gr, !1);
    I(this, hr, !1);
    I(this, Un, !1);
    I(this, Mt, !1);
    I(this, Xa, /* @__PURE__ */ c((e, n = {}) => {
      M("GameTimeAutomation | Pause state changed", {
        paused: e,
        userId: (n == null ? void 0 : n.userId) ?? null,
        broadcast: (n == null ? void 0 : n.broadcast) ?? null
      }), S(this, V, It).call(this, { pausedOverride: e });
    }, "#handlePause"));
    I(this, Za, /* @__PURE__ */ c((e) => {
      e != null && e.id && (f(this, vt).set(e.id, Math.max(e.round ?? 0, 1)), M("GameTimeAutomation | Combat started", { combatId: e.id, round: e.round ?? 0 }), S(this, V, It).call(this));
    }, "#handleCombatStart"));
    I(this, eo, /* @__PURE__ */ c((e, n) => {
      if (!(e != null && e.id)) return;
      const i = typeof n == "number" && Number.isFinite(n) ? n : typeof e.round == "number" && Number.isFinite(e.round) ? e.round : 0, r = i > 0 ? i : 1, a = f(this, vt).get(e.id), o = a ? Math.max(a, 1) : 1, s = r > 1 ? Math.max(r - o, 0) : 0;
      if (M("GameTimeAutomation | Combat round change detected", {
        combatId: e.id,
        effectiveRound: r,
        completedRounds: s,
        enabled: f(this, bt),
        paused: (game == null ? void 0 : game.paused) ?? null
      }), s > 0 && f(this, bt) && f(this, Mt) && !(game != null && game.paused) && S(this, V, fi).call(this) && S(this, V, ta).call(this, e)) {
        const l = s * f(this, mr);
        l > 0 && (M("GameTimeAutomation | Advancing time for completed combat rounds", {
          combatId: e.id,
          completedRounds: s,
          delta: l
        }), S(this, V, $s).call(this, l));
      }
      f(this, vt).set(e.id, Math.max(r, 1));
    }, "#handleCombatRound"));
    I(this, to, /* @__PURE__ */ c((e) => {
      e != null && e.id && (f(this, vt).delete(e.id), M("GameTimeAutomation | Combat ended", { combatId: e.id }), S(this, V, It).call(this));
    }, "#handleCombatEnd"));
    I(this, no, /* @__PURE__ */ c((e) => {
      e != null && e.id && (f(this, vt).delete(e.id), M("GameTimeAutomation | Combat deleted", { combatId: e.id }), S(this, V, It).call(this));
    }, "#handleCombatDelete"));
    I(this, io, /* @__PURE__ */ c((e, n) => {
      if (e != null && e.id) {
        if (typeof (n == null ? void 0 : n.round) == "number" && Number.isFinite(n.round)) {
          const i = Math.max(n.round, 1);
          f(this, vt).set(e.id, i), M("GameTimeAutomation | Combat round manually updated", {
            combatId: e.id,
            round: i
          });
        }
        (Object.prototype.hasOwnProperty.call(n ?? {}, "active") || (n == null ? void 0 : n.round) !== void 0) && S(this, V, It).call(this);
      }
    }, "#handleCombatUpdate"));
    I(this, ro, /* @__PURE__ */ c((e) => {
      S(this, V, ia).call(this, e == null ? void 0 : e.scene), S(this, V, It).call(this);
    }, "#handleCanvasReady"));
    I(this, ao, /* @__PURE__ */ c((e) => {
      if (!Ue(e)) return;
      const n = S(this, V, _s).call(this);
      if (!n || n.id !== e.id) return;
      S(this, V, ia).call(this, e) && S(this, V, It).call(this);
    }, "#handleSceneUpdate"));
  }
  registerHooks() {
    f(this, gr) || (L(this, gr, !0), Hooks.on("pauseGame", f(this, Xa)), Hooks.on("combatStart", f(this, Za)), Hooks.on("combatRound", f(this, eo)), Hooks.on("combatEnd", f(this, to)), Hooks.on("deleteCombat", f(this, no)), Hooks.on("updateCombat", f(this, io)), Hooks.on("canvasReady", f(this, ro)), Hooks.on("updateScene", f(this, ao)));
  }
  initialize() {
    f(this, hr) || (L(this, hr, !0), L(this, Ya, wu((e) => {
      const n = !!e, i = n !== f(this, bt);
      L(this, bt, n), M("GameTimeAutomation | Manage time toggled", { enabled: n }), i && n && S(this, V, Ns).call(this), S(this, V, It).call(this);
    })), L(this, Qa, Uf((e) => {
      L(this, mr, e), M("GameTimeAutomation | Seconds per round updated", { value: e });
    })), S(this, V, Ns).call(this), S(this, V, ia).call(this), S(this, V, It).call(this));
  }
};
bt = new WeakMap(), mr = new WeakMap(), vt = new WeakMap(), rn = new WeakMap(), Bn = new WeakMap(), At = new WeakMap(), Ci = new WeakMap(), Ya = new WeakMap(), Qa = new WeakMap(), gr = new WeakMap(), hr = new WeakMap(), Un = new WeakMap(), Mt = new WeakMap(), V = new WeakSet(), As = /* @__PURE__ */ c(function() {
  var e;
  try {
    if (typeof ((e = globalThis.performance) == null ? void 0 : e.now) == "function")
      return globalThis.performance.now();
  } catch (n) {
    M("GameTimeAutomation | Failed to read high-resolution timestamp", {
      message: (n == null ? void 0 : n.message) ?? String(n)
    });
  }
  return Date.now();
}, "#currentTimestamp"), fi = /* @__PURE__ */ c(function() {
  var e;
  return !!((e = game == null ? void 0 : game.user) != null && e.isGM && game.user.active !== !1);
}, "#canControlTime"), ta = /* @__PURE__ */ c(function(e) {
  var i, r;
  if (!e) return !1;
  if (e.active === !0) return !0;
  if (e.active === !1) return !1;
  const n = (i = game == null ? void 0 : game.combats) == null ? void 0 : i.active;
  return (n == null ? void 0 : n.id) === e.id ? !0 : ((r = game == null ? void 0 : game.combat) == null ? void 0 : r.id) === e.id ? game.combat.active ?? !0 : !1;
}, "#isCombatDocumentActive"), Ms = /* @__PURE__ */ c(function(e) {
  return e ? typeof e.started == "boolean" ? e.started : (e.round ?? 0) > 0 : !1;
}, "#hasCombatStarted"), na = /* @__PURE__ */ c(function() {
  var i;
  const e = Array.isArray((i = game == null ? void 0 : game.combats) == null ? void 0 : i.contents) ? game.combats.contents : [];
  for (const r of e)
    if (S(this, V, ta).call(this, r) && S(this, V, Ms).call(this, r))
      return !0;
  const n = game == null ? void 0 : game.combat;
  return !!(n && S(this, V, ta).call(this, n) && S(this, V, Ms).call(this, n));
}, "#isCombatRunning"), Ns = /* @__PURE__ */ c(function() {
  var n;
  f(this, vt).clear();
  const e = Array.isArray((n = game == null ? void 0 : game.combats) == null ? void 0 : n.contents) ? game.combats.contents : [];
  for (const i of e)
    i != null && i.id && f(this, vt).set(i.id, Math.max(i.round ?? 0, 1));
}, "#hydrateRoundTracking"), It = /* @__PURE__ */ c(function({ pausedOverride: e } = {}) {
  const n = typeof e == "boolean" ? e : !!(game != null && game.paused), i = f(this, bt), r = f(this, Mt), a = i && r, o = {
    manageTimeEnabled: i,
    sceneAllowsRealTime: r,
    effectiveEnabled: a,
    paused: n,
    canControl: S(this, V, fi).call(this),
    combatRunning: S(this, V, na).call(this),
    overrideApplied: typeof e == "boolean"
  };
  if (M("GameTimeAutomation | Sync running state", o), !a || !S(this, V, fi).call(this)) {
    S(this, V, ks).call(this);
    return;
  }
  S(this, V, Du).call(this);
}, "#syncRunningState"), Du = /* @__PURE__ */ c(function() {
  f(this, rn) === null && (L(this, Bn, S(this, V, As).call(this)), L(this, rn, globalThis.setInterval(() => S(this, V, Fu).call(this), 1e3)), M("GameTimeAutomation | Started real-time ticker"));
}, "#startRealTimeTicker"), ks = /* @__PURE__ */ c(function() {
  f(this, rn) !== null && (globalThis.clearInterval(f(this, rn)), L(this, rn, null), M("GameTimeAutomation | Stopped real-time ticker")), L(this, Bn, null), L(this, At, 0), L(this, Un, !1);
}, "#stopRealTimeTicker"), Fu = /* @__PURE__ */ c(function() {
  if (!f(this, bt) || !f(this, Mt) || !S(this, V, fi).call(this)) {
    S(this, V, ks).call(this);
    return;
  }
  const e = S(this, V, As).call(this);
  if (typeof e != "number" || !Number.isFinite(e)) return;
  const n = f(this, Bn) ?? e, i = (e - n) / 1e3;
  if (L(this, Bn, e), !Number.isFinite(i) || i <= 0) return;
  const r = !!(game != null && game.paused), a = S(this, V, na).call(this);
  if (r || a) {
    f(this, Un) || M("GameTimeAutomation | Tick skipped", { paused: r, combatRunning: a }), L(this, Un, !0), L(this, At, 0);
    return;
  }
  L(this, Un, !1), M("GameTimeAutomation | Real-time tick", { deltaSeconds: i }), S(this, V, $s).call(this, i);
}, "#tickRealTime"), $s = /* @__PURE__ */ c(function(e) {
  if (!f(this, bt) || !f(this, Mt)) return;
  const n = Number(e);
  !Number.isFinite(n) || n <= 0 || (L(this, At, f(this, At) + n), !f(this, Ci) && L(this, Ci, S(this, V, Pu).call(this)));
}, "#queueAdvance"), Pu = /* @__PURE__ */ c(async function() {
  var e, n;
  for (; f(this, At) > 0; ) {
    if (!f(this, bt) || !f(this, Mt) || game != null && game.paused || !S(this, V, fi).call(this) || S(this, V, na).call(this)) {
      L(this, At, 0);
      break;
    }
    const i = f(this, At);
    L(this, At, 0);
    try {
      if (typeof ((e = game == null ? void 0 : game.time) == null ? void 0 : e.advance) == "function")
        M("GameTimeAutomation | Advancing world time", { delta: i }), await game.time.advance(i), M("GameTimeAutomation | World time advanced", {
          worldTime: ((n = game.time) == null ? void 0 : n.worldTime) ?? null
        });
      else {
        console.warn(`${T} | game.time.advance is unavailable; cannot manage world time.`);
        break;
      }
    } catch (r) {
      console.error(`${T} | Failed to advance world time`, r);
      break;
    }
  }
  L(this, Ci, null);
}, "#flushAdvanceQueue"), Xa = new WeakMap(), Za = new WeakMap(), eo = new WeakMap(), to = new WeakMap(), no = new WeakMap(), io = new WeakMap(), _s = /* @__PURE__ */ c(function() {
  const e = zi();
  return Ue(e) ? e : null;
}, "#getActiveSceneDocument"), xu = /* @__PURE__ */ c(function(e) {
  if (!Ue(e)) return !1;
  try {
    return !!e.getFlag(T, ls);
  } catch (n) {
    return M("GameTimeAutomation | Failed to read scene real-time flag", {
      sceneId: (e == null ? void 0 : e.id) ?? null,
      message: (n == null ? void 0 : n.message) ?? String(n)
    }), !1;
  }
}, "#isSceneRealTimeAllowed"), ia = /* @__PURE__ */ c(function(e) {
  const n = Ue(e) ? e : S(this, V, _s).call(this), i = S(this, V, xu).call(this, n), r = f(this, Mt);
  return L(this, Mt, i), r !== i ? (M("GameTimeAutomation | Scene real-time allowance changed", {
    sceneId: (n == null ? void 0 : n.id) ?? null,
    allows: i
  }), !0) : !1;
}, "#refreshSceneAutomationState"), ro = new WeakMap(), ao = new WeakMap(), c(ec, "GameTimeAutomation");
let Os = ec;
var uu, an, De, Vn, Gt, oo, ye, Ru, Hu, qu, ju, so, Fs, lo, Bu, co, Uu, Vu;
const Bt = class Bt extends On(In) {
  constructor(n = {}) {
    const { scene: i, trigger: r, triggerIndex: a, onSave: o, ...s } = n ?? {};
    super(s);
    I(this, ye);
    I(this, an, null);
    I(this, De, null);
    I(this, Vn, null);
    I(this, Gt, null);
    I(this, oo, /* @__PURE__ */ c(() => {
      (this.rendered ?? this.isRendered ?? !1) && (L(this, Gt, S(this, ye, Ru).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    I(this, so, /* @__PURE__ */ c((n) => {
      var a, o;
      const i = n.currentTarget, r = i == null ? void 0 : i.closest("form");
      r && (M("Trigger action selection changed", {
        sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
        triggerId: ((o = this.trigger) == null ? void 0 : o.id) ?? null,
        actionId: (i == null ? void 0 : i.value) ?? null
      }), S(this, ye, Fs).call(this, i.value, r));
    }, "#onActionSelectChange"));
    I(this, lo, /* @__PURE__ */ c((n) => {
      var u, d, m, g;
      n.preventDefault();
      const i = n.currentTarget, r = i == null ? void 0 : i.closest("form");
      if (!r) return;
      const a = (u = i.dataset) == null ? void 0 : u.target;
      if (!a) return;
      const o = typeof (CSS == null ? void 0 : CSS.escape) == "function" ? CSS.escape : (y) => y, s = r.querySelector(`[name="${o(a)}"]`);
      if (!s) return;
      M("Opening file picker for trigger", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        triggerId: ((m = this.trigger) == null ? void 0 : m.id) ?? null,
        target: a
      }), new FilePicker({
        type: ((g = i.dataset) == null ? void 0 : g.type) || "audio",
        current: s.value,
        callback: /* @__PURE__ */ c((y) => {
          var h, p;
          s.value = y, s.dispatchEvent(new Event("change")), M("Trigger form file selected", {
            sceneId: ((h = this.scene) == null ? void 0 : h.id) ?? null,
            triggerId: ((p = this.trigger) == null ? void 0 : p.id) ?? null,
            target: a,
            path: y
          });
        }, "callback")
      }).render({ force: !0 });
    }, "#onFilePicker"));
    I(this, co, /* @__PURE__ */ c(async (n) => {
      var r, a;
      n.preventDefault();
      const i = n.currentTarget;
      i instanceof HTMLFormElement && (M("Trigger form submitted", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null,
        triggerId: ((a = this.trigger) == null ? void 0 : a.id) ?? null
      }), await S(this, ye, Uu).call(this, i));
    }, "#onSubmit"));
    this.scene = i ?? null, this.trigger = r ?? null, this.triggerIndex = Number.isInteger(a) ? Number(a) : null, this.onSave = typeof o == "function" ? o : null, L(this, Vn, $l(f(this, oo)));
  }
  async _prepareContext() {
    var n, i;
    Ni("TriggerFormApplication#_prepareContext", {
      sceneId: ((n = this.scene) == null ? void 0 : n.id) ?? null,
      triggerId: ((i = this.trigger) == null ? void 0 : i.id) ?? null,
      triggerIndex: this.triggerIndex
    });
    try {
      const r = this.trigger ?? { action: ea, data: {} }, a = r.action ?? ea, o = mc(r.time), s = o.format ?? "12h", l = s === "12h" ? im() : [], u = o.period ?? (l.length > 0 ? l[0].value : null), d = s === "12h" ? l.map((y) => ({
        ...y,
        selected: y.value === u
      })) : [], m = fc().map((y) => ({
        id: y.id,
        label: typeof y.label == "function" ? y.label() : y.label,
        selected: y.id === a
      })), g = fc().map((y) => {
        const h = y.id === r.action ? r : { ...r, action: y.id }, p = Yf(h);
        return p ? {
          id: y.id,
          visible: y.id === a,
          content: p
        } : null;
      }).filter(Boolean);
      return {
        timeValue: o.canonical ?? "",
        timeHourValue: o.hour ?? "",
        timeMinuteValue: o.minute ?? "",
        timePeriodValue: u ?? "",
        timeFormat: s,
        is12HourFormat: s === "12h",
        is24HourFormat: s === "24h",
        timePeriodOptions: d,
        actions: m,
        actionSections: g,
        allowReplayOnRewind: !!r.allowReplayOnRewind,
        labels: {
          time: E("EIDOLON.TimeTrigger.TriggerTime", "Trigger Time"),
          hour: E("EIDOLON.TimeTrigger.TriggerTimeHour", "Hour"),
          minute: E("EIDOLON.TimeTrigger.TriggerTimeMinute", "Minute"),
          period: E("EIDOLON.TimeTrigger.TriggerTimePeriod", "AM / PM"),
          action: E("EIDOLON.TimeTrigger.TriggerAction", "Action"),
          allowReplayOnRewind: E(
            "EIDOLON.TimeTrigger.AllowReplayOnRewind",
            "Allow replay after rewinding time"
          ),
          allowReplayOnRewindHint: E(
            "EIDOLON.TimeTrigger.AllowReplayOnRewindHint",
            "When enabled, this trigger can fire again if world time moves backward."
          ),
          save: E("EIDOLON.TimeTrigger.TriggerSave", "Save Trigger")
        }
      };
    } finally {
      pn();
    }
  }
  _onRender(n, i) {
    var l, u, d;
    super._onRender(n, i);
    const r = this.element;
    if (!r) return;
    M("Trigger form rendered", {
      sceneId: ((l = this.scene) == null ? void 0 : l.id) ?? null,
      triggerId: ((u = this.trigger) == null ? void 0 : u.id) ?? null
    });
    const a = Array.from(((d = document == null ? void 0 : document.body) == null ? void 0 : d.classList) ?? []).find(
      (m) => m.startsWith("theme-")
    );
    a && r.classList.add(a);
    const o = r.querySelector("form");
    if (!o) return;
    S(this, ye, Bu).call(this, o), S(this, ye, Hu).call(this, o), o.addEventListener("submit", f(this, co));
    const s = o.querySelector("[data-action-select]");
    s && (s.addEventListener("change", f(this, so)), S(this, ye, Fs).call(this, s.value, o)), o.querySelectorAll("[data-action-file-picker]").forEach((m) => {
      m.addEventListener("click", f(this, lo));
    });
  }
  async close(n = {}) {
    var i;
    if ((i = f(this, an)) == null || i.call(this), L(this, an, null), L(this, De, null), L(this, Gt, null), typeof f(this, Vn) == "function")
      try {
        f(this, Vn).call(this);
      } catch (r) {
        console.error(`${T} | Failed to dispose trigger form time format subscription`, r);
      }
    return L(this, Vn, null), super.close(n);
  }
};
an = new WeakMap(), De = new WeakMap(), Vn = new WeakMap(), Gt = new WeakMap(), oo = new WeakMap(), ye = new WeakSet(), Ru = /* @__PURE__ */ c(function() {
  var s, l, u, d, m, g, y;
  const n = (l = (s = this.element) == null ? void 0 : s.querySelector) == null ? void 0 : l.call(s, "form");
  if (!(n instanceof HTMLFormElement)) return null;
  const i = Array.from(n.elements ?? []), r = [];
  for (const h of i)
    if ((h instanceof HTMLInputElement || h instanceof HTMLSelectElement || h instanceof HTMLTextAreaElement) && h.name && !(((u = h.dataset) == null ? void 0 : u.timeHidden) !== void 0 || ((d = h.dataset) == null ? void 0 : d.timeHour) !== void 0 || ((m = h.dataset) == null ? void 0 : m.timeMinute) !== void 0 || ((g = h.dataset) == null ? void 0 : g.timePeriod) !== void 0)) {
      if (h instanceof HTMLInputElement) {
        if (h.type === "checkbox" || h.type === "radio") {
          r.push({
            kind: h.type,
            name: h.name,
            value: h.value,
            checked: h.checked
          });
          continue;
        }
        r.push({
          kind: "value",
          name: h.name,
          value: h.value
        });
        continue;
      }
      if (h instanceof HTMLSelectElement) {
        h.multiple ? r.push({
          kind: "select-multiple",
          name: h.name,
          values: Array.from(h.selectedOptions ?? []).map((p) => p.value)
        }) : r.push({
          kind: "value",
          name: h.name,
          value: h.value
        });
        continue;
      }
      r.push({
        kind: "value",
        name: h.name,
        value: h.value
      });
    }
  const a = n.querySelector("[data-time-format]");
  let o = null;
  if (a instanceof HTMLElement) {
    const h = a.querySelector("[data-time-hidden]"), p = a.querySelector("[data-time-hour]"), v = a.querySelector("[data-time-minute]"), b = a.querySelector("[data-time-period]");
    o = {
      format: ((y = a.dataset) == null ? void 0 : y.timeFormat) ?? null,
      canonical: h instanceof HTMLInputElement ? h.value : "",
      hour: p instanceof HTMLInputElement ? p.value : "",
      minute: v instanceof HTMLInputElement ? v.value : "",
      period: b instanceof HTMLSelectElement ? b.value : ""
    };
  }
  return {
    fields: r,
    time: o
  };
}, "#captureFormState"), Hu = /* @__PURE__ */ c(function(n) {
  if (!f(this, Gt)) return;
  if (!(n instanceof HTMLFormElement)) {
    L(this, Gt, null);
    return;
  }
  const { fields: i = [], time: r = null } = f(this, Gt) ?? {};
  L(this, Gt, null), S(this, ye, qu).call(this, n, i), S(this, ye, ju).call(this, n, r);
}, "#restorePendingFormState"), qu = /* @__PURE__ */ c(function(n, i) {
  if (!Array.isArray(i) || i.length === 0) return;
  const r = typeof (CSS == null ? void 0 : CSS.escape) == "function" ? CSS.escape : (a) => a;
  for (const a of i) {
    if (!a || typeof a.name != "string") continue;
    const o = r(a.name);
    if (a.kind === "checkbox" || a.kind === "radio") {
      const l = `input[type="${a.kind}"][name="${o}"]`, u = n.querySelectorAll(l);
      u.forEach((d) => {
        d instanceof HTMLInputElement && (u.length === 1 || d.value === a.value) && (d.checked = !!a.checked);
      });
      continue;
    }
    if (a.kind === "select-multiple") {
      const l = n.querySelector(`select[name="${o}"]`);
      if (!(l instanceof HTMLSelectElement)) continue;
      const u = new Set(Array.isArray(a.values) ? a.values : []);
      Array.from(l.options ?? []).forEach((d) => {
        d.selected = u.has(d.value);
      });
      continue;
    }
    const s = n.querySelector(`[name="${o}"]`);
    (s instanceof HTMLInputElement || s instanceof HTMLSelectElement || s instanceof HTMLTextAreaElement) && (s.value = a.value ?? "");
  }
}, "#restoreFieldValues"), ju = /* @__PURE__ */ c(function(n, i) {
  var w, C, O;
  const r = n.querySelector("[data-time-format]");
  if (!(r instanceof HTMLElement)) {
    typeof f(this, De) == "function" && f(this, De).call(this);
    return;
  }
  const a = ((w = r.dataset) == null ? void 0 : w.timeFormat) === "24h" ? "24h" : "12h", o = r.querySelector("[data-time-hour]"), s = r.querySelector("[data-time-minute]"), l = r.querySelector("[data-time-period]"), u = r.querySelector("[data-time-hidden]");
  if (!i) {
    if (o instanceof HTMLInputElement && (o.value = ""), s instanceof HTMLInputElement && (s.value = ""), l instanceof HTMLSelectElement) {
      const A = ((O = (C = l.options) == null ? void 0 : C[0]) == null ? void 0 : O.value) ?? "";
      l.value = A;
    }
    u instanceof HTMLInputElement && (u.value = ""), typeof f(this, De) == "function" && f(this, De).call(this);
    return;
  }
  const d = typeof i.canonical == "string" ? i.canonical : "", m = typeof i.period == "string" ? i.period : "", g = typeof i.hour == "string" ? i.hour : "", y = typeof i.minute == "string" ? i.minute : "";
  let h = "", p = "", v = m, b = d;
  if (d) {
    const A = mc(d, a);
    h = A.hour ?? "", p = A.minute ?? "", b = A.canonical ?? d, a === "12h" ? v = A.period ?? m : v = "";
  } else
    h = g, p = y, a !== "12h" && (v = "");
  if (o instanceof HTMLInputElement && (o.value = h ?? ""), s instanceof HTMLInputElement && (s.value = p ?? ""), l instanceof HTMLSelectElement)
    if (a === "12h") {
      const A = Array.from(l.options ?? []);
      A.find(($) => $.value === v) ? l.value = v : A.length > 0 ? l.value = A[0].value : l.value = "";
    } else
      l.value = "";
  u instanceof HTMLInputElement && (u.value = b ?? ""), typeof f(this, De) == "function" && f(this, De).call(this);
}, "#restoreTimeInputs"), so = new WeakMap(), Fs = /* @__PURE__ */ c(function(n, i) {
  i && i.querySelectorAll("[data-action-config]").forEach((r) => {
    const a = r.dataset.actionConfig === n;
    r.style.display = a ? "" : "none";
  });
}, "#updateActionSections"), lo = new WeakMap(), Bu = /* @__PURE__ */ c(function(n) {
  var m, g, y, h;
  if ((m = f(this, an)) == null || m.call(this), L(this, an, null), L(this, De, null), !(n instanceof HTMLFormElement)) return;
  const i = n.querySelector("[data-time-format]"), r = ((g = i == null ? void 0 : i.dataset) == null ? void 0 : g.timeFormat) ?? null;
  if (r !== "12h" && r !== "24h")
    return;
  const a = i.querySelector("[data-time-hidden]"), o = i.querySelector("[data-time-hour]"), s = i.querySelector("[data-time-minute]"), l = r === "12h" ? i.querySelector("[data-time-period]") : null;
  if (!a || !o || !s || r === "12h" && !l) {
    M("Trigger form time inputs missing elements", {
      format: r,
      hasHidden: !!a,
      hasHour: !!o,
      hasMinute: !!s,
      hasPeriod: !!l
    });
    return;
  }
  const u = [o, s, ...l ? [l] : []], d = /* @__PURE__ */ c(() => {
    const { canonical: p, error: v } = nm(
      {
        hour: o.value,
        minute: s.value,
        period: (l == null ? void 0 : l.value) ?? null,
        time: a.value
      },
      r
    );
    a.value = p ?? "";
    const b = v ?? "";
    a.setCustomValidity(b), u.forEach((w) => {
      w.setCustomValidity(b);
    });
  }, "update");
  u.forEach((p) => {
    p.addEventListener("input", d), p.addEventListener("change", d);
  }), d(), L(this, an, () => {
    u.forEach((p) => {
      p.removeEventListener("input", d), p.removeEventListener("change", d);
    });
  }), L(this, De, d), M("Trigger form configured for time input", {
    format: r,
    sceneId: ((y = this.scene) == null ? void 0 : y.id) ?? null,
    triggerId: ((h = this.trigger) == null ? void 0 : h.id) ?? null
  });
}, "#setupTimeInput"), co = new WeakMap(), Uu = /* @__PURE__ */ c(async function(n) {
  var a, o, s, l, u;
  if (typeof f(this, De) == "function" && f(this, De).call(this), typeof n.checkValidity == "function" && !n.checkValidity()) {
    typeof n.reportValidity == "function" && n.reportValidity(), M("Trigger form submission blocked by validity check", {
      sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
      triggerId: ((o = this.trigger) == null ? void 0 : o.id) ?? null
    });
    return;
  }
  const i = new FormData(n), r = Object.fromEntries(i.entries());
  delete r.timeHour, delete r.timeMinute, delete r.timePeriod, r.allowReplayOnRewind = ((s = n.querySelector('input[name="allowReplayOnRewind"]')) == null ? void 0 : s.checked) ?? !1, M("Processing trigger form submission", {
    sceneId: ((l = this.scene) == null ? void 0 : l.id) ?? null,
    triggerId: ((u = this.trigger) == null ? void 0 : u.id) ?? null,
    allowReplayOnRewind: r.allowReplayOnRewind
  }), await S(this, ye, Vu).call(this, r), await this.close();
}, "#handleSubmit"), Vu = /* @__PURE__ */ c(async function(n) {
  var a, o, s, l, u, d;
  const i = {
    id: ((a = this.trigger) == null ? void 0 : a.id) ?? xf(),
    time: n.time ?? "",
    action: n.action ?? ea,
    allowReplayOnRewind: !!n.allowReplayOnRewind,
    data: {}
  };
  M("Persisting trigger from form", {
    sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
    triggerId: i.id,
    existingIndex: this.triggerIndex
  }), Qf(i, n);
  const r = vi(this.scene);
  this.triggerIndex !== null && r[this.triggerIndex] ? r[this.triggerIndex] = i : r.push(i);
  try {
    await Tu(this.scene, r), M("Trigger list saved", {
      sceneId: ((s = this.scene) == null ? void 0 : s.id) ?? null,
      triggerCount: r.length
    });
  } catch (m) {
    throw console.error(`${T} | Failed to save time trigger`, m), (u = (l = ui.notifications) == null ? void 0 : l.error) == null || u.call(
      l,
      E(
        "EIDOLON.TimeTrigger.TriggerSaveError",
        "Failed to save the scene's time triggers."
      )
    ), m;
  }
  if (this.onSave)
    try {
      this.onSave(r);
    } catch (m) {
      console.error(`${T} | Trigger onSave callback failed`, m), M("Trigger onSave callback failed", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        message: (m == null ? void 0 : m.message) ?? String(m)
      });
    }
}, "#persistTrigger"), c(Bt, "TriggerFormApplication"), pe(Bt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  _e(Bt, Bt, "DEFAULT_OPTIONS"),
  {
    id: `${T}-trigger-form`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((uu = _e(Bt, Bt, "DEFAULT_OPTIONS")) == null ? void 0 : uu.classes) ?? [], "standard-form", "themed"])
    ),
    window: {
      title: E("EIDOLON.TimeTrigger.TriggerFormTitle", "Configure Time Trigger"),
      resizable: !1
    },
    position: {
      width: 400,
      height: "auto"
    }
  },
  { inplace: !1 }
)), pe(Bt, "PARTS", {
  content: {
    template: `modules/${T}/templates/time-trigger-form.html`
  }
});
let Ds = Bt;
function Dt(t) {
  return t instanceof HTMLElement ? t : (t == null ? void 0 : t[0]) instanceof HTMLElement ? t[0] : null;
}
c(Dt, "asHTMLElement");
function ra(t) {
  return typeof (t == null ? void 0 : t.changeTab) == "function";
}
c(ra, "isAppV2");
function zu(t, e, n, i = {}) {
  if (ra(t)) {
    t.changeTab(e, n, i);
    return;
  }
  if (typeof (t == null ? void 0 : t.activateTab) == "function") {
    const r = { ...i };
    n != null && (r.group = n), r.triggerCallback == null && (r.triggerCallback = !0), t.activateTab(e, r);
  }
}
c(zu, "setActiveTab");
function am(t) {
  var n, i;
  if (!(t instanceof HTMLFormElement)) return {};
  const e = ((i = (n = foundry == null ? void 0 : foundry.applications) == null ? void 0 : n.ux) == null ? void 0 : i.FormDataExtended) ?? globalThis.FormDataExtended ?? null;
  if (!e) return {};
  try {
    const r = new e(t), a = typeof r.object == "object" ? r.object : {};
    return foundry.utils.expandObject(a);
  } catch {
    return {};
  }
}
c(am, "readFormData");
const hc = Symbol.for("eidolon.sceneConfig.v13PatchedTabs");
function Gu(t = {}) {
  const {
    tabId: e,
    tabLabel: n,
    getScene: i,
    isApplicable: r,
    renderContent: a,
    debugNamespace: o = "SceneConfigTab",
    onButtonCreate: s,
    onTabCreate: l,
    onAfterRender: u,
    logger: d = {},
    moduleId: m = "eidolon-utilities",
    tabIcon: g = "fa-solid fa-puzzle-piece"
  } = t ?? {};
  if (!e)
    throw new Error("createSceneConfigTabFactory requires a tabId.");
  if (typeof a != "function")
    throw new TypeError("createSceneConfigTabFactory requires a renderContent callback.");
  const y = typeof d.log == "function" ? d.log.bind(d) : (...N) => {
    var x;
    return (x = console.debug) == null ? void 0 : x.call(console, `${o}`, ...N);
  }, h = typeof d.group == "function" ? d.group.bind(d) : (...N) => {
    var x;
    return (x = console.groupCollapsed) == null ? void 0 : x.call(console, `${o}`, ...N);
  }, p = typeof d.groupEnd == "function" ? d.groupEnd.bind(d) : () => {
    var N;
    return (N = console.groupEnd) == null ? void 0 : N.call(console);
  }, v = Symbol(`EIDOLON_SCENE_CONFIG_TAB_CLEANUP_${e}`), b = typeof i == "function" ? i : () => null, w = typeof r == "function" ? r : () => !0, C = typeof n == "function" ? n : () => typeof n == "string" ? n : e;
  function O() {
    var W, R, U, K, ae;
    const N = ((R = (W = foundry == null ? void 0 : foundry.applications) == null ? void 0 : W.sheets) == null ? void 0 : R.SceneConfig) ?? ((U = CONFIG == null ? void 0 : CONFIG.Scene) == null ? void 0 : U.sheetClass);
    if (!N || !ra({ changeTab: (K = N.prototype) == null ? void 0 : K.changeTab })) return;
    const x = N[hc] ?? /* @__PURE__ */ new Set();
    if (x.has(e)) return;
    x.add(e), N[hc] = x;
    const B = (ae = N.TABS) == null ? void 0 : ae.sheet;
    if (B && Array.isArray(B.tabs) && !B.tabs.some((X) => X.id === e)) {
      const X = C({ app: null, scene: null }) ?? e;
      B.tabs.push({
        id: e,
        icon: g,
        label: X
      });
    }
    N.PARTS && !N.PARTS[e] && (N.PARTS[e] = {
      template: `modules/${m}/templates/scene-config-tab-mount.hbs`,
      scrollable: [`.tab[data-tab="${e}"]`]
    }), y("Patched v13 SceneConfig TABS/PARTS", { tabId: e });
  }
  c(O, "patchV13SceneConfig");
  function A(N, x) {
    var W, R;
    const B = b(N);
    if (!w(N, B)) {
      y("Skipped render", {
        tabId: e,
        reason: "inapplicable",
        constructor: ((W = N == null ? void 0 : N.constructor) == null ? void 0 : W.name) ?? null
      });
      return;
    }
    h("render", {
      tabId: e,
      sceneId: (B == null ? void 0 : B.id) ?? null,
      constructor: ((R = N == null ? void 0 : N.constructor) == null ? void 0 : R.name) ?? null
    });
    try {
      const U = Dt(x) ?? Dt(N.element);
      if (!U) {
        y("Missing root element", { tabId: e });
        return;
      }
      ra(N) ? H(N, U, B) : $(N, U, B);
    } finally {
      p();
    }
  }
  c(A, "handleRender");
  function k(N, x, B) {
    var U;
    if (!g) {
      N.textContent = x;
      return;
    }
    const W = (U = N.querySelector("i")) == null ? void 0 : U.cloneNode(!0);
    N.textContent = "";
    const R = W ?? document.createElement("i");
    if (W || (R.className = g, B && (R.inert = !0)), N.append(R, " "), B) {
      const K = document.createElement("span");
      K.textContent = x, N.append(K);
    } else
      N.append(document.createTextNode(x));
  }
  c(k, "setButtonContent");
  function $(N, x, B) {
    var et, xt, ze, Te, si, Rt, An, tt, Ht, P, Rr, Q, ft, Oe, Ri, Hr;
    const R = [
      "nav.sheet-tabs[data-group]",
      "nav.tabs[data-group]",
      "nav.sheet-tabs",
      "nav.tabs"
    ].map((Ae) => x.querySelector(Ae)).find((Ae) => Ae instanceof HTMLElement), K = [
      (et = x.querySelector(".tab[data-tab]")) == null ? void 0 : et.parentElement,
      x.querySelector(".sheet-body"),
      (ze = (xt = R == null ? void 0 : R.parentElement) == null ? void 0 : xt.querySelector) == null ? void 0 : ze.call(xt, ":scope > .sheet-body"),
      R == null ? void 0 : R.parentElement
    ].find((Ae) => Ae instanceof HTMLElement), ae = ((Te = R == null ? void 0 : R.dataset) == null ? void 0 : Te.group) ?? ((An = (Rt = (si = R == null ? void 0 : R.querySelector) == null ? void 0 : si.call(R, "a[data-group]")) == null ? void 0 : Rt.dataset) == null ? void 0 : An.group) ?? ((P = (Ht = (tt = R == null ? void 0 : R.querySelector) == null ? void 0 : tt.call(R, "[data-group]")) == null ? void 0 : Ht.dataset) == null ? void 0 : P.group) ?? ((ft = (Q = (Rr = K == null ? void 0 : K.querySelector) == null ? void 0 : Rr.call(K, ".tab[data-group]")) == null ? void 0 : Q.dataset) == null ? void 0 : ft.group) ?? "main";
    if (!R || !K) {
      y("Missing navigation elements", {
        tabId: e,
        hasNav: !!R,
        hasBody: !!K
      });
      return;
    }
    let X = R.querySelector(`[data-tab="${e}"]`);
    if (!X) {
      X = document.createElement("a"), X.dataset.action = "tab", X.dataset.group = ae, X.dataset.tab = e;
      const Ae = R.querySelector("a[data-tab]");
      (Oe = Ae == null ? void 0 : Ae.classList) != null && Oe.contains("item") && X.classList.add("item"), R.appendChild(X), typeof s == "function" && s({ app: N, button: X, nav: R, scene: B }), y("Created tab button", { tabId: e, group: ae });
    }
    k(X, C({ app: N, scene: B }) ?? e, ra(N));
    let te = K.querySelector(`.tab[data-tab="${e}"]`);
    if (!te) {
      te = document.createElement("div"), te.classList.add("tab"), te.dataset.tab = e, te.dataset.group = ae;
      const Ae = Wu(K);
      K.insertBefore(te, Ae ?? null), typeof l == "function" && l({ app: N, tab: te, body: K, scene: B }), y("Created tab container", { tabId: e, group: ae });
    }
    ((Ri = X.classList) == null ? void 0 : Ri.contains("active")) || te.classList.contains("active") ? (X.classList.add("active"), te.classList.add("active"), te.removeAttribute("hidden")) : (X.classList.remove("active"), te.classList.remove("active"), te.setAttribute("hidden", "true"));
    const dt = /* @__PURE__ */ c(() => {
      var Mn, Hi;
      ((Mn = X.classList) != null && Mn.contains("active") || te.classList.contains("active")) && ((Hi = X.classList) == null || Hi.add("active"), te.classList.add("active"), te.removeAttribute("hidden"), te.removeAttribute("aria-hidden"), te.style.display === "none" && (te.style.display = ""));
    }, "ensureTabVisible"), $e = /* @__PURE__ */ c(() => {
      dt(), requestAnimationFrame(dt);
    }, "scheduleEnsureTabVisible");
    X.dataset.eidolonEnsureSceneTabVisibility || (X.addEventListener("click", () => {
      zu(N, e, ae), requestAnimationFrame(dt);
    }), X.dataset.eidolonEnsureSceneTabVisibility = "true"), Vo(N, v, y);
    const Ze = a({
      app: N,
      scene: B,
      tab: te,
      tabButton: X,
      ensureTabVisible: dt,
      scheduleEnsureTabVisible: $e
    });
    typeof Ze == "function" && pc(N, v, Ze), typeof u == "function" && u({
      app: N,
      scene: B,
      tab: te,
      tabButton: X,
      ensureTabVisible: dt,
      scheduleEnsureTabVisible: $e
    }), (Hr = N.setPosition) == null || Hr.call(N, { height: "auto" });
  }
  c($, "handleRenderV1");
  function H(N, x, B) {
    const W = x.querySelector(`.tab[data-tab="${e}"]`), R = x.querySelector(`nav [data-tab="${e}"]`);
    if (!W || !R) {
      y("v2 mount not found, falling back to v1 injection", { tabId: e }), $(N, x, B);
      return;
    }
    k(R, C({ app: N, scene: B }) ?? e, !0);
    const U = /* @__PURE__ */ c(() => {
      var X;
      !((X = R.classList) != null && X.contains("active")) && !W.classList.contains("active") || (W.classList.add("active"), W.removeAttribute("hidden"), W.removeAttribute("aria-hidden"), W.style.display === "none" && (W.style.display = ""));
    }, "ensureTabVisible"), K = /* @__PURE__ */ c(() => {
      U(), requestAnimationFrame(U);
    }, "scheduleEnsureTabVisible");
    Vo(N, v, y);
    const ae = a({
      app: N,
      scene: B,
      tab: W,
      tabButton: R,
      ensureTabVisible: U,
      scheduleEnsureTabVisible: K
    });
    typeof ae == "function" && pc(N, v, ae), typeof u == "function" && u({
      app: N,
      scene: B,
      tab: W,
      tabButton: R,
      ensureTabVisible: U,
      scheduleEnsureTabVisible: K
    });
  }
  c(H, "handleRenderV2");
  function q(N) {
    Vo(N, v, y);
  }
  c(q, "handleClose");
  function F() {
    return Hooks.once("init", () => {
      O();
    }), Hooks.on("renderSceneConfig", A), Hooks.on("closeSceneConfig", q), () => D();
  }
  c(F, "register");
  function D() {
    Hooks.off("renderSceneConfig", A), Hooks.off("closeSceneConfig", q);
  }
  return c(D, "unregister"), { register: F, unregister: D };
}
c(Gu, "createSceneConfigTabFactory");
function pc(t, e, n) {
  if (!t || typeof n != "function") return;
  const i = t == null ? void 0 : t[e];
  Array.isArray(i) || (t[e] = []), t[e].push(n);
}
c(pc, "registerCleanup");
function Vo(t, e, n) {
  if (!t) return;
  const i = t == null ? void 0 : t[e];
  if (Array.isArray(i))
    for (; i.length > 0; ) {
      const r = i.pop();
      if (typeof r == "function")
        try {
          r();
        } catch (a) {
          n("Cleanup failed", { message: (a == null ? void 0 : a.message) ?? String(a) });
        }
    }
}
c(Vo, "invokeCleanup");
function Wu(t) {
  if (!(t instanceof HTMLElement)) return null;
  const e = [
    ":scope > footer.sheet-footer",
    ":scope > footer.form-footer",
    ":scope > .sheet-footer",
    ":scope > .form-footer",
    ":scope > footer"
  ];
  for (const n of e) {
    const i = t.querySelector(n);
    if (i instanceof HTMLElement) return i;
  }
  return null;
}
c(Wu, "findFooterElement");
const om = Eo(Ds), sm = `modules/${T}/templates/time-trigger-scene-tab.html`, lm = Gu({
  tabId: "time-triggers",
  tabLabel: /* @__PURE__ */ c(() => E("EIDOLON.TimeTrigger.Tab", "Time Triggers"), "tabLabel"),
  getScene: Ft,
  isApplicable: fm,
  renderContent: /* @__PURE__ */ c(({ app: t, scene: e, tab: n }) => um(t, n, e), "renderContent"),
  logger: {
    log: M,
    group: Ni,
    groupEnd: pn
  }
});
function cm() {
  return M("Registering SceneConfig render hook"), lm.register();
}
c(cm, "registerSceneConfigHook");
function um(t, e, n) {
  if (!(e instanceof HTMLElement)) return;
  const i = Ue(n) ? n : Ft(t);
  Ea(t, e, i);
  const r = $l(() => {
    Ea(t, e, i);
  });
  return () => {
    if (typeof r == "function")
      try {
        r();
      } catch (a) {
        console.error(
          `${T} | Failed to dispose scene config time format subscription`,
          a
        );
      }
  };
}
c(um, "renderTimeTriggerTab");
async function Ea(t, e, n) {
  var r, a;
  const i = n ?? Ft(t);
  Ni("renderTimeTriggersTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!Ue(i)) {
      const W = E(
        "EIDOLON.TimeTrigger.Unavailable",
        "Time triggers are unavailable for this configuration sheet."
      );
      e.innerHTML = `<p class="notes">${W}</p>`, M("Scene lacks document for time triggers", { sceneId: (i == null ? void 0 : i.id) ?? null });
      return;
    }
    const o = `flags.${T}.${pa}`, s = `flags.${T}.${os}`, l = `flags.${T}.${ss}`, u = !!i.getFlag(T, pa), d = !!i.getFlag(T, os), m = !!i.getFlag(T, ss), g = vi(i);
    M("Rendering time trigger list", {
      sceneId: i.id,
      isActive: u,
      shouldHideWindow: d,
      shouldShowPlayerWindow: m,
      triggerCount: g.length
    });
    const y = E("EIDOLON.TimeTrigger.Activate", "Activate Time Trigger"), h = E(
      "EIDOLON.TimeTrigger.Description",
      "Enable scene time triggers so scheduled actions can run automatically."
    ), p = E(
      "EIDOLON.TimeTrigger.HideWindowLabel",
      "Hide Floating Time Window"
    ), v = E(
      "EIDOLON.TimeTrigger.HideWindowDescription",
      "Keep the floating time control window hidden while leaving time triggers active."
    ), b = E(
      "EIDOLON.TimeTrigger.ShowPlayerWindowLabel",
      "Share Floating Time Window with Players"
    ), w = E(
      "EIDOLON.TimeTrigger.ShowPlayerWindowDescription",
      "Let non-GM players see the floating time window (without time controls)."
    ), C = E(
      "EIDOLON.TimeTrigger.TriggerListLabel",
      "Scene Time Triggers"
    ), O = E(
      "EIDOLON.TimeTrigger.TriggerListEmpty",
      "No time triggers configured for this scene."
    ), A = E("EIDOLON.TimeTrigger.AddTrigger", "Add Trigger"), k = E("EIDOLON.TimeTrigger.EditTrigger", "Edit"), $ = E("EIDOLON.TimeTrigger.DeleteTrigger", "Remove"), H = E("EIDOLON.TimeTrigger.TriggerNow", "Trigger Now"), q = E("EIDOLON.TimeTrigger.AtLabel", "At"), F = E("EIDOLON.TimeTrigger.DoLabel", "Do"), D = E("EIDOLON.TimeTrigger.MissingTime", "(No time set)"), N = g.map((W, R) => {
      const ae = (W.time ? tm(W.time) : "") || W.time || "" || D, X = Jf(W.action), te = [
        `${q} ${ae}`,
        `${F} ${X}`,
        ...Kf(W)
      ];
      return {
        index: R,
        summaryParts: te,
        tooltips: {
          triggerNow: H,
          edit: k,
          delete: $
        }
      };
    }), x = ((a = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : a.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof x != "function") {
      console.error(`${T} | renderTemplate is unavailable; cannot render scene tab.`), e.innerHTML = `<p class="notes">${O}</p>`;
      return;
    }
    let B = "";
    try {
      B = await x(sm, {
        flags: {
          active: o,
          hideWindow: s,
          showPlayerWindow: l
        },
        states: {
          isActive: u,
          hideWindow: d,
          showPlayerWindow: m
        },
        labels: {
          activate: y,
          hideWindow: p,
          showPlayerWindow: b,
          triggerList: C,
          empty: O,
          add: A
        },
        hints: {
          activate: h,
          hideWindow: v,
          showPlayerWindow: w
        },
        triggers: N,
        hasTriggers: N.length > 0
      });
    } catch (W) {
      console.error(`${T} | Failed to render time trigger scene tab template`, W), e.innerHTML = `<p class="notes">${O}</p>`;
      return;
    }
    e.innerHTML = B, dm(t, e, i);
  } finally {
    pn();
  }
}
c(Ea, "renderTimeTriggersTabContent");
function dm(t, e, n) {
  const i = n ?? Ft(t);
  if (!Ue(i)) return;
  const r = e.querySelector('[data-action="add-trigger"]');
  r && r.addEventListener("click", () => {
    M("Add trigger button clicked", { sceneId: i.id }), yc(t, { scene: i });
  }), e.querySelectorAll('[data-action="edit-trigger"]').forEach((a) => {
    a.addEventListener("click", () => {
      const o = Number(a.dataset.index);
      if (!Number.isInteger(o)) return;
      const l = vi(i)[o];
      l && (M("Edit trigger button clicked", { sceneId: i.id, triggerId: l.id, index: o }), yc(t, { trigger: l, triggerIndex: o, scene: i }));
    });
  }), e.querySelectorAll('[data-action="delete-trigger"]').forEach((a) => {
    a.addEventListener("click", async () => {
      var u, d;
      const o = Number(a.dataset.index);
      if (!Number.isInteger(o)) return;
      const s = vi(i), l = s[o];
      if (l) {
        s.splice(o, 1);
        try {
          M("Deleting trigger", {
            sceneId: i.id,
            index: o,
            triggerId: (l == null ? void 0 : l.id) ?? null
          }), await Tu(i, s), await Ea(t, e, i);
        } catch (m) {
          console.error(`${T} | Failed to delete time trigger`, m), (d = (u = ui.notifications) == null ? void 0 : u.error) == null || d.call(
            u,
            E(
              "EIDOLON.TimeTrigger.TriggerDeleteError",
              "Failed to remove the selected time trigger."
            )
          );
        }
      }
    });
  }), e.querySelectorAll('[data-action="fire-trigger"]').forEach((a) => {
    a.addEventListener("click", async () => {
      var u, d, m, g, y, h, p;
      const o = Number(a.dataset.index);
      if (!Number.isInteger(o)) return;
      const l = vi(i)[o];
      if (l) {
        if (!((u = game.user) != null && u.isGM)) {
          (m = (d = ui.notifications) == null ? void 0 : d.warn) == null || m.call(
            d,
            E("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time.")
          );
          return;
        }
        try {
          M("Manually firing trigger", { sceneId: i.id, triggerId: l.id, index: o }), await Cu(i, l), (y = (g = ui.notifications) == null ? void 0 : g.info) == null || y.call(
            g,
            E(
              "EIDOLON.TimeTrigger.TriggerNowSuccess",
              "Triggered the selected time trigger."
            )
          );
        } catch (v) {
          console.error(`${T} | Failed to execute time trigger manually`, v), (p = (h = ui.notifications) == null ? void 0 : h.error) == null || p.call(
            h,
            E(
              "EIDOLON.TimeTrigger.TriggerNowError",
              "Failed to execute the selected time trigger."
            )
          ), M("Manual trigger execution failed", {
            sceneId: i.id,
            triggerId: l.id,
            index: o,
            message: (v == null ? void 0 : v.message) ?? String(v)
          });
        }
      }
    });
  });
}
c(dm, "bindTimeTriggerTabEvents");
function yc(t, e = {}) {
  var o;
  const n = e.scene ?? null, i = n && Ue(n) ? n : Ft(t);
  if (!Ue(i)) {
    console.warn(`${T} | Unable to open trigger form because no scene document is available.`);
    return;
  }
  M("Opening trigger form", {
    sceneId: i.id,
    triggerId: ((o = e.trigger) == null ? void 0 : o.id) ?? null,
    index: Number.isInteger(e.triggerIndex) ? Number(e.triggerIndex) : null
  }), om({
    scene: i,
    trigger: e.trigger ?? null,
    triggerIndex: e.triggerIndex ?? null,
    onSave: /* @__PURE__ */ c(() => {
      var l, u;
      const s = (u = (l = t.element) == null ? void 0 : l[0]) == null ? void 0 : u.querySelector('.tab[data-tab="time-triggers"]');
      s && Ea(t, s, i);
    }, "onSave")
  }).render({ force: !0 });
}
c(yc, "openTriggerForm");
function fm(t, e) {
  var a, o, s, l, u;
  if (!t) return !1;
  const n = ((o = (a = foundry == null ? void 0 : foundry.applications) == null ? void 0 : a.sheets) == null ? void 0 : o.SceneConfig) ?? (globalThis == null ? void 0 : globalThis.SceneConfig);
  if (n && t instanceof n) return !0;
  const i = (s = t == null ? void 0 : t.constructor) == null ? void 0 : s.name;
  if (typeof i == "string" && i.includes("SceneConfig")) return !0;
  if (e) {
    const d = globalThis == null ? void 0 : globalThis.Scene;
    if (d && e instanceof d || (e == null ? void 0 : e.documentName) === "Scene" || (e == null ? void 0 : e.documentName) === "scenes" || (e == null ? void 0 : e.collection) === "scenes") return !0;
  }
  const r = ((l = t == null ? void 0 : t.options) == null ? void 0 : l.baseApplication) ?? ((u = t == null ? void 0 : t.options) == null ? void 0 : u.id);
  return !!(typeof r == "string" && r.includes("SceneConfig"));
}
c(fm, "isRecognizedSceneConfig");
const Ur = new Is(), bc = new Os();
function mm() {
  M("Registering time trigger hooks"), Hooks.once("init", () => {
    Rf(), Vf(), M("Time trigger settings registered during init");
  }), cm(), M("Scene config hook registered"), bc.registerHooks(), M("Time automation hooks registered"), Hooks.once("ready", () => {
    zf(), M("Ready hook fired"), Ur.onReady(), bc.initialize();
  }), Hooks.on("canvasReady", (t) => {
    var e;
    M("canvasReady hook received", { scene: ((e = t == null ? void 0 : t.scene) == null ? void 0 : e.id) ?? null }), Ur.onCanvasReady(t);
  }), Hooks.on("updateScene", (t) => {
    M("updateScene hook received", { scene: (t == null ? void 0 : t.id) ?? null }), Ur.onUpdateScene(t);
  }), Hooks.on("updateWorldTime", (t, e) => {
    M("updateWorldTime hook received", { worldTime: t, diff: e }), Ur.onUpdateWorldTime(t, e);
  });
}
c(mm, "registerTimeTriggerHooks");
mm();
const we = T, Ju = "criteria", Dl = "state", gm = "criteriaVersion", hm = 1, Ku = "enableCriteriaSurfaces";
let vc = !1;
function pm() {
  var t;
  if (!vc) {
    if (vc = !0, !((t = game == null ? void 0 : game.settings) != null && t.register)) {
      console.warn(`${we} | game.settings.register unavailable; scene criteria setting skipped.`);
      return;
    }
    game.settings.register(we, Ku, {
      name: E("EIDOLON.SceneCriteria.EnableSurfacesSettingName", "Enable Criteria Editor Surfaces"),
      hint: E(
        "EIDOLON.SceneCriteria.EnableSurfacesSettingHint",
        "Show criteria authoring surfaces (Scene > Criteria tab and tile/light editor controls). The Criteria Switcher remains available."
      ),
      scope: "world",
      config: !0,
      type: Boolean,
      default: !0,
      onChange: /* @__PURE__ */ c(() => {
        ym();
      }, "onChange")
    });
  }
}
c(pm, "registerSceneCriteriaSettings");
function So() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return !!game.settings.get(we, Ku);
  } catch (e) {
    console.error(`${we} | Failed to read criteria surfaces setting`, e);
  }
  return !0;
}
c(So, "getCriteriaSurfacesEnabled");
function ym() {
  var a, o, s, l, u;
  const t = E("EIDOLON.SceneCriteria.ReloadPromptTitle", "Reload Required"), e = `<p>${E(
    "EIDOLON.SceneCriteria.ReloadPromptBody",
    "Changes to criteria editor surfaces require a reload. Reload now?"
  )}</p>`, n = typeof ((a = foundry == null ? void 0 : foundry.utils) == null ? void 0 : a.debouncedReload) == "function", i = /* @__PURE__ */ c(() => {
    n ? foundry.utils.debouncedReload() : window.location.reload();
  }, "reload"), r = (s = (o = foundry == null ? void 0 : foundry.applications) == null ? void 0 : o.api) == null ? void 0 : s.DialogV2;
  if (typeof (r == null ? void 0 : r.confirm) == "function") {
    r.confirm({
      window: { title: t },
      content: e
    }).then((d) => {
      d && i();
    });
    return;
  }
  if (typeof (Dialog == null ? void 0 : Dialog.confirm) == "function") {
    Dialog.confirm({
      title: t,
      content: e,
      yes: /* @__PURE__ */ c(() => i(), "yes"),
      no: /* @__PURE__ */ c(() => {
      }, "no")
    });
    return;
  }
  (u = (l = ui.notifications) == null ? void 0 : l.info) == null || u.call(
    l,
    E(
      "EIDOLON.SceneCriteria.ReloadNotice",
      "Please reload the world to apply criteria editor surface changes."
    )
  );
}
c(ym, "promptReloadForCriteriaSurfaces");
const Sa = "Standard";
function ut(t) {
  var n;
  const e = (n = t == null ? void 0 : t.getFlag) == null ? void 0 : n.call(t, we, Ju);
  return e ? Yu(e) : [];
}
c(ut, "getSceneCriteria");
async function To(t, e) {
  if (!(t != null && t.setFlag)) return;
  const n = Yu(e);
  await t.setFlag(we, Ju, n), await t.setFlag(we, gm, hm);
  const i = Fr(t, n);
  await t.setFlag(we, Dl, i);
}
c(To, "setSceneCriteria");
function Fr(t, e = null) {
  var r;
  const n = Array.isArray(e) ? e : ut(t), i = _t(((r = t == null ? void 0 : t.getFlag) == null ? void 0 : r.call(t, we, Dl)) ?? {});
  return Pl(i, n);
}
c(Fr, "getSceneCriteriaState");
async function bm(t, e, n = null) {
  if (!(t != null && t.setFlag)) return;
  const i = Array.isArray(n) ? n : ut(t), r = Pl(e, i);
  await t.setFlag(we, Dl, r);
}
c(bm, "setSceneCriteriaState");
function Fl(t = "") {
  const e = typeof t == "string" ? t.trim() : "", n = Qu(xs(e || "criterion"), /* @__PURE__ */ new Set());
  return {
    id: Xu(),
    key: n,
    label: e,
    values: [Sa],
    default: Sa,
    order: 0
  };
}
c(Fl, "createSceneCriterion");
function Yu(t) {
  const e = Array.isArray(t) ? _t(t) : [], n = [], i = /* @__PURE__ */ new Set();
  return e.forEach((r, a) => {
    const o = Ps(r, a, i);
    o && (n.push(o), i.add(o.key));
  }), n;
}
c(Yu, "sanitizeCriteria$1");
function Ps(t, e = 0, n = /* @__PURE__ */ new Set()) {
  if (!t || typeof t != "object") return null;
  const i = typeof t.id == "string" && t.id.trim() ? t.id.trim() : Xu(), a = (typeof t.label == "string" ? t.label : typeof t.name == "string" ? t.name : "").trim(), o = typeof t.key == "string" && t.key.trim() ? xs(t.key) : xs(a || `criterion-${Number(e) + 1}`), s = Qu(o, n), l = wm(t.values);
  let u = typeof t.default == "string" ? t.default.trim() : "";
  u || (u = l[0] ?? Sa), l.includes(u) || l.unshift(u);
  const d = Number.isFinite(t.order) ? Number(t.order) : Number(e);
  return {
    id: i,
    key: s,
    label: a,
    values: l,
    default: u,
    order: d
  };
}
c(Ps, "sanitizeCriterion");
function Pl(t, e = []) {
  const n = t && typeof t == "object" ? _t(t) : {}, i = {};
  for (const r of e) {
    const a = n == null ? void 0 : n[r.key], o = typeof a == "string" ? a.trim() : "";
    o && r.values.includes(o) ? i[r.key] = o : i[r.key] = r.default;
  }
  return i;
}
c(Pl, "sanitizeSceneCriteriaState");
function vm(t) {
  return ut(t).map((n) => ({
    id: n.key,
    key: n.key,
    name: n.label,
    values: [...n.values]
  }));
}
c(vm, "getSceneCriteriaCategories");
function wm(t) {
  const e = Array.isArray(t) ? t : [], n = [];
  for (const i of e) {
    if (typeof i != "string") continue;
    const r = i.trim();
    !r || n.includes(r) || n.push(r);
  }
  return n.length || n.push(Sa), n;
}
c(wm, "sanitizeCriterionValues");
function xs(t) {
  return String(t ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
c(xs, "slugifyCriterionKey");
function Qu(t, e) {
  if (!e.has(t)) return t;
  let n = 2;
  for (; e.has(`${t}-${n}`); )
    n += 1;
  return `${t}-${n}`;
}
c(Qu, "ensureUniqueCriterionKey");
function Xu() {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 11);
}
c(Xu, "generateCriterionId");
function Zu(t) {
  var e, n;
  console.error(`${we} | Failed to persist scene criteria`, t), (n = (e = ui.notifications) == null ? void 0 : e.error) == null || n.call(
    e,
    E(
      "EIDOLON.SceneCriteria.PersistError",
      "Failed to persist the scene criteria."
    )
  );
}
c(Zu, "notifyPersistError");
var du, me, Wt, ke, ed, uo, fo, mo, go, aa, ho, pr, yr, Gi, td;
const Ut = class Ut extends On(In) {
  constructor(n = {}) {
    const { scene: i, criterion: r, isNew: a, onSave: o, ...s } = n ?? {};
    super(s);
    I(this, ke);
    I(this, me, null);
    I(this, Wt, !1);
    I(this, uo, /* @__PURE__ */ c(async (n) => {
      n.preventDefault();
      const i = n.currentTarget;
      if (!(i instanceof HTMLFormElement)) return;
      const r = new FormData(i), a = String(r.get("criterionLabel") ?? "").trim(), o = String(r.get("criterionKey") ?? "").trim(), s = Array.from(i.querySelectorAll('[name="criterionValues"]')).map((m) => m instanceof HTMLInputElement ? m.value.trim() : "").filter((m, g, y) => m && y.indexOf(m) === g), u = String(r.get("criterionDefault") ?? "").trim() || s[0] || "Standard", d = Ps(
        {
          id: f(this, me).id,
          key: o,
          label: a,
          values: s,
          default: u,
          order: Number(f(this, me).order ?? 0)
        },
        0,
        /* @__PURE__ */ new Set()
      );
      d && (L(this, me, d), await S(this, ke, td).call(this), this.close());
    }, "#onSubmit"));
    I(this, fo, /* @__PURE__ */ c((n) => {
      var o;
      if (f(this, Wt)) return;
      const i = n.currentTarget, r = (i == null ? void 0 : i.form) ?? ((o = this.element) == null ? void 0 : o.querySelector("form"));
      if (!(r instanceof HTMLFormElement)) return;
      const a = r.querySelector('input[name="criterionKey"]');
      a instanceof HTMLInputElement && (a.value = Bi(i.value));
    }, "#onLabelInput"));
    I(this, mo, /* @__PURE__ */ c((n) => {
      var l;
      const i = n.currentTarget, r = (i == null ? void 0 : i.form) ?? ((l = this.element) == null ? void 0 : l.querySelector("form"));
      if (!(r instanceof HTMLFormElement) || !(i instanceof HTMLInputElement)) return;
      const a = r.querySelector('input[name="criterionLabel"]'), o = Bi(a instanceof HTMLInputElement ? a.value : ""), s = Bi(i.value);
      L(this, Wt, s !== o), i.value = s, S(this, ke, aa).call(this, r);
    }, "#onKeyInput"));
    I(this, go, /* @__PURE__ */ c((n) => {
      var o, s;
      n.preventDefault();
      const i = ((o = n.currentTarget) == null ? void 0 : o.form) ?? ((s = this.element) == null ? void 0 : s.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector('input[name="criterionLabel"]'), a = i.querySelector('input[name="criterionKey"]');
      a instanceof HTMLInputElement && (a.value = Bi(r instanceof HTMLInputElement ? r.value : ""), L(this, Wt, !1), S(this, ke, aa).call(this, i));
    }, "#onResetAutoKey"));
    I(this, ho, /* @__PURE__ */ c((n) => {
      var l, u, d, m, g, y;
      n.preventDefault();
      const i = ((l = n.currentTarget) == null ? void 0 : l.form) ?? ((u = this.element) == null ? void 0 : u.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector(".scene-criterion-editor__values");
      if (!(r instanceof HTMLElement)) return;
      (d = r.querySelector(".scene-criterion-editor__empty")) == null || d.remove();
      const a = document.createElement("div");
      a.classList.add("scene-criterion-editor__value");
      const o = St(E("EIDOLON.SceneCriteria.ValuePlaceholder", "Allowed value")), s = St(E("EIDOLON.SceneCriteria.RemoveValue", "Remove Value"));
      a.innerHTML = `
      <input type="text" name="criterionValues" value="" placeholder="${o}" class="form-control">
      <button type="button" class="icon" data-action="remove-value" aria-label="${s}" title="${s}">
        <i class="fa-solid fa-trash"></i>
      </button>
    `, r.appendChild(a), (m = a.querySelector('[data-action="remove-value"]')) == null || m.addEventListener("click", f(this, pr)), (g = a.querySelector('input[name="criterionValues"]')) == null || g.addEventListener("input", f(this, yr)), S(this, ke, Gi).call(this, i), (y = a.querySelector('input[name="criterionValues"]')) == null || y.focus();
    }, "#onAddValue"));
    I(this, pr, /* @__PURE__ */ c((n) => {
      var a, o, s, l;
      n.preventDefault(), (o = (a = n.currentTarget) == null ? void 0 : a.closest(".scene-criterion-editor__value")) == null || o.remove();
      const i = ((s = n.currentTarget) == null ? void 0 : s.form) ?? ((l = this.element) == null ? void 0 : l.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector(".scene-criterion-editor__values");
      if (r instanceof HTMLElement) {
        if (!r.querySelector(".scene-criterion-editor__value")) {
          const u = document.createElement("p");
          u.classList.add("notes", "scene-criterion-editor__empty"), u.textContent = E(
            "EIDOLON.SceneCriteria.ValueListEmpty",
            "No values have been added to this criterion."
          ), r.appendChild(u);
        }
        S(this, ke, Gi).call(this, i);
      }
    }, "#onRemoveValue"));
    I(this, yr, /* @__PURE__ */ c((n) => {
      var r, a;
      const i = ((r = n.currentTarget) == null ? void 0 : r.form) ?? ((a = this.element) == null ? void 0 : a.querySelector("form"));
      i instanceof HTMLFormElement && S(this, ke, Gi).call(this, i);
    }, "#onValuesChanged"));
    this.scene = i ?? null, this.criterion = r ?? null, this.onSave = typeof o == "function" ? o : null, this.isNew = !!a, L(this, me, S(this, ke, ed).call(this)), L(this, Wt, f(this, me).key !== Bi(f(this, me).label));
  }
  async _prepareContext() {
    var i, r, a, o;
    const n = Array.isArray((i = f(this, me)) == null ? void 0 : i.values) ? f(this, me).values : [];
    return {
      isNew: this.isNew,
      key: ((r = f(this, me)) == null ? void 0 : r.key) ?? "",
      label: ((a = f(this, me)) == null ? void 0 : a.label) ?? "",
      defaultValue: ((o = f(this, me)) == null ? void 0 : o.default) ?? "",
      values: n.map((s, l) => {
        var u;
        return {
          index: l,
          value: s,
          selected: s === ((u = f(this, me)) == null ? void 0 : u.default)
        };
      }),
      hasValues: n.length > 0,
      labels: {
        label: E("EIDOLON.SceneCriteria.CategoryNameLabel", "Criterion Label"),
        key: E("EIDOLON.SceneCriteria.CriteriaKey", "Key"),
        values: E("EIDOLON.SceneCriteria.ValuesLabel", "Allowed Values"),
        default: E("EIDOLON.SceneCriteria.DefaultValue", "Default Value"),
        empty: E(
          "EIDOLON.SceneCriteria.ValueListEmpty",
          "No values have been added to this criterion."
        ),
        addValue: E("EIDOLON.SceneCriteria.AddValue", "Add Value"),
        removeValue: E("EIDOLON.SceneCriteria.RemoveValue", "Remove Value"),
        valuePlaceholder: E("EIDOLON.SceneCriteria.ValuePlaceholder", "Allowed value"),
        resetAutoKey: E("EIDOLON.SceneCriteria.ResetAutoKey", "Reset to Auto"),
        save: this.isNew ? E("EIDOLON.SceneCriteria.CreateCategory", "Add Criterion") : E("EIDOLON.SceneCriteria.SaveCategory", "Save Criterion"),
        cancel: E("EIDOLON.SceneCriteria.CancelEdit", "Cancel")
      },
      keyIsCustom: f(this, Wt)
    };
  }
  _onRender(n, i) {
    var a, o, s, l, u, d;
    super._onRender(n, i);
    const r = (a = this.element) == null ? void 0 : a.querySelector("form");
    r && (r.addEventListener("submit", f(this, uo)), (o = r.querySelector('[data-action="add-value"]')) == null || o.addEventListener("click", f(this, ho)), (s = r.querySelector('input[name="criterionLabel"]')) == null || s.addEventListener("input", f(this, fo)), (l = r.querySelector('input[name="criterionKey"]')) == null || l.addEventListener("input", f(this, mo)), (u = r.querySelector('[data-action="reset-auto-key"]')) == null || u.addEventListener("click", f(this, go)), r.querySelectorAll('[data-action="remove-value"]').forEach((m) => {
      m.addEventListener("click", f(this, pr));
    }), r.querySelectorAll('input[name="criterionValues"]').forEach((m) => {
      m.addEventListener("input", f(this, yr));
    }), (d = r.querySelector('[data-action="cancel"]')) == null || d.addEventListener("click", (m) => {
      m.preventDefault(), this.close();
    }), S(this, ke, aa).call(this, r), S(this, ke, Gi).call(this, r));
  }
};
me = new WeakMap(), Wt = new WeakMap(), ke = new WeakSet(), ed = /* @__PURE__ */ c(function() {
  const n = Ps(this.criterion, 0, /* @__PURE__ */ new Set()) ?? Fl(E("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion"));
  return {
    id: n.id,
    key: n.key,
    label: n.label ?? "",
    values: Array.isArray(n.values) ? [...n.values] : [],
    default: n.default
  };
}, "#initializeState"), uo = new WeakMap(), fo = new WeakMap(), mo = new WeakMap(), go = new WeakMap(), aa = /* @__PURE__ */ c(function(n) {
  const i = n.querySelector('[data-action="reset-auto-key"]');
  i instanceof HTMLButtonElement && (i.disabled = !f(this, Wt));
}, "#syncAutoKeyButton"), ho = new WeakMap(), pr = new WeakMap(), yr = new WeakMap(), Gi = /* @__PURE__ */ c(function(n) {
  var l, u;
  const i = n.querySelector('select[name="criterionDefault"]');
  if (!(i instanceof HTMLSelectElement)) return;
  const r = ((u = (l = i.value) == null ? void 0 : l.trim) == null ? void 0 : u.call(l)) ?? "", a = Array.from(n.querySelectorAll('input[name="criterionValues"]')).map((d) => d instanceof HTMLInputElement ? d.value.trim() : "").filter((d, m, g) => d && g.indexOf(d) === m), o = i.dataset.emptyLabel || E("EIDOLON.SceneCriteria.ValueListEmpty", "No values have been added to this criterion.");
  if (i.innerHTML = "", !a.length) {
    const d = document.createElement("option");
    d.value = "", d.textContent = o, d.selected = !0, i.appendChild(d);
    return;
  }
  const s = a.includes(r) ? r : a[0];
  for (const d of a) {
    const m = document.createElement("option");
    m.value = d, m.textContent = d, m.selected = d === s, i.appendChild(m);
  }
}, "#syncDefaultOptions"), td = /* @__PURE__ */ c(async function() {
  if (!this.scene) return;
  const n = ut(this.scene).sort((r, a) => r.order - a.order), i = n.findIndex((r) => r.id === f(this, me).id);
  i < 0 ? (f(this, me).order = n.length, n.push(f(this, me))) : (f(this, me).order = n[i].order, n.splice(i, 1, f(this, me)));
  try {
    await To(this.scene, n), this.onSave && await this.onSave(f(this, me));
  } catch (r) {
    Zu(r);
  }
}, "#persist"), c(Ut, "CategoryEditorApplication"), pe(Ut, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  _e(Ut, Ut, "DEFAULT_OPTIONS"),
  {
    id: `${we}-criterion-editor`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((du = _e(Ut, Ut, "DEFAULT_OPTIONS")) == null ? void 0 : du.classes) ?? [], "standard-form", "themed"])
    ),
    window: {
      title: E("EIDOLON.SceneCriteria.EditCategory", "Edit Criterion"),
      resizable: !1
    },
    position: {
      width: 460,
      height: "auto"
    }
  },
  { inplace: !1 }
)), pe(Ut, "PARTS", {
  content: {
    template: `modules/${we}/templates/scene-criteria-editor.html`
  }
});
let Rs = Ut;
function Bi(t) {
  return String(t ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
c(Bi, "slugifyKey");
const Em = `modules/${we}/templates/scene-criteria-tab.html`, Hs = {
  log: /* @__PURE__ */ c((...t) => {
    var e;
    return (e = console.debug) == null ? void 0 : e.call(console, `${we} | Criteria`, ...t);
  }, "log"),
  group: /* @__PURE__ */ c((...t) => {
    var e;
    return (e = console.groupCollapsed) == null ? void 0 : e.call(console, `${we} | Criteria`, ...t);
  }, "group"),
  groupEnd: /* @__PURE__ */ c(() => {
    var t;
    return (t = console.groupEnd) == null ? void 0 : t.call(console);
  }, "groupEnd")
}, Sm = Eo(Rs), Tm = Gu({
  tabId: "criteria",
  tabLabel: /* @__PURE__ */ c(() => E("EIDOLON.SceneCriteria.TabLabel", "Criteria"), "tabLabel"),
  getScene: Ft,
  isApplicable: /* @__PURE__ */ c(() => So(), "isApplicable"),
  renderContent: /* @__PURE__ */ c(({ app: t, tab: e, scene: n }) => Lm(t, e, n), "renderContent"),
  logger: Hs
});
function Cm() {
  return Tm.register();
}
c(Cm, "registerSceneCriteriaConfigHook");
function Lm(t, e, n) {
  if (!(e instanceof HTMLElement)) return;
  const i = Ue(n) ? n : Ft(t);
  mi(t, e, i);
}
c(Lm, "renderCriteriaTab");
async function mi(t, e, n) {
  var r, a;
  const i = n ?? Ft(t);
  Hs.group("renderCriteriaTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!Ue(i)) {
      const d = E(
        "EIDOLON.SceneCriteria.Unavailable",
        "Scene criteria are unavailable for this configuration sheet."
      );
      e.innerHTML = `<p class="notes">${d}</p>`;
      return;
    }
    const o = ut(i).sort((d, m) => d.order - m.order), s = Fr(i, o), l = ((a = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : a.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof l != "function") {
      e.innerHTML = `<p class="notes">${E("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
      return;
    }
    const u = await l(Em, {
      description: E(
        "EIDOLON.SceneCriteria.Description",
        "Define scene criteria dimensions and allowed values used by matching rules."
      ),
      labels: {
        list: E("EIDOLON.SceneCriteria.CategoryListLabel", "Scene Criteria"),
        empty: E(
          "EIDOLON.SceneCriteria.CategoryListEmpty",
          "No criteria configured for this scene."
        ),
        add: E("EIDOLON.SceneCriteria.AddCategory", "Add Criterion"),
        edit: E("EIDOLON.SceneCriteria.EditCategory", "Edit Criterion"),
        remove: E("EIDOLON.SceneCriteria.RemoveCategory", "Remove Criterion"),
        moveUp: E("EIDOLON.SceneCriteria.MoveUp", "Move Up"),
        moveDown: E("EIDOLON.SceneCriteria.MoveDown", "Move Down"),
        values: E("EIDOLON.SceneCriteria.ValuesLabel", "Allowed Values"),
        unnamed: E("EIDOLON.SceneCriteria.UnnamedCategory", "Unnamed Criterion")
      },
      summary: {
        criteriaCount: o.length,
        valueCount: o.reduce((d, m) => d + m.values.length, 0)
      },
      criteria: o.map((d, m) => {
        var g, y;
        return {
          id: d.id,
          label: d.label,
          displayName: ((y = (g = d.label) == null ? void 0 : g.trim) == null ? void 0 : y.call(g)) || E("EIDOLON.SceneCriteria.UnnamedCategory", "Unnamed Criterion"),
          hasValues: d.values.length > 0,
          values: d.values.map((h) => ({
            value: h,
            isCurrent: (s[d.key] ?? d.default) === h
          })),
          valueCountLabel: Om(d.values.length),
          canMoveUp: m > 0,
          canMoveDown: m < o.length - 1
        };
      }),
      hasCriteria: o.length > 0
    });
    e.innerHTML = u, Im(t, e, i);
  } catch (o) {
    console.error(`${we} | Failed to render criteria tab`, o), e.innerHTML = `<p class="notes">${E("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
  } finally {
    Hs.groupEnd();
  }
}
c(mi, "renderCriteriaTabContent");
function Im(t, e, n) {
  const i = n ?? Ft(t);
  if (!Ue(i)) return;
  const r = e.querySelector('[data-criteria-action="add"]');
  r && r.addEventListener("click", () => {
    wc(t, {
      scene: i,
      criterion: Fl(
        E("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion")
      ),
      isNew: !0,
      onSave: /* @__PURE__ */ c(() => mi(t, e, i), "onSave")
    });
  }), e.querySelectorAll('[data-criteria-action="edit"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", () => {
      const s = ut(i).find((l) => l.id === o);
      s && wc(t, {
        scene: i,
        criterion: s,
        onSave: /* @__PURE__ */ c(() => mi(t, e, i), "onSave")
      });
    });
  }), e.querySelectorAll('[data-criteria-action="remove"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await zo(i, (l) => {
        const u = l.findIndex((d) => d.id === o);
        return u < 0 ? !1 : (l.splice(u, 1), Go(l), !0);
      }) && await mi(t, e, i);
    });
  }), e.querySelectorAll('[data-criteria-action="move-up"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await zo(i, (l) => {
        const u = l.findIndex((m) => m.id === o);
        if (u <= 0) return !1;
        const [d] = l.splice(u, 1);
        return l.splice(u - 1, 0, d), Go(l), !0;
      }) && await mi(t, e, i);
    });
  }), e.querySelectorAll('[data-criteria-action="move-down"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await zo(i, (l) => {
        const u = l.findIndex((m) => m.id === o);
        if (u < 0 || u >= l.length - 1) return !1;
        const [d] = l.splice(u, 1);
        return l.splice(u + 1, 0, d), Go(l), !0;
      }) && await mi(t, e, i);
    });
  });
}
c(Im, "bindCriteriaTabEvents");
async function zo(t, e) {
  const n = ut(t).sort((r, a) => r.order - a.order);
  if (e(n) === !1) return !1;
  try {
    return await To(t, n), !0;
  } catch (r) {
    return Zu(r), !1;
  }
}
c(zo, "mutateCriteria");
function wc(t, e = {}) {
  const n = e.scene ?? null, i = n && Ue(n) ? n : Ft(t);
  if (!Ue(i))
    return;
  Sm({
    scene: i,
    criterion: e.criterion ?? null,
    isNew: !!e.isNew,
    onSave: typeof e.onSave == "function" ? e.onSave : null
  }).render({ force: !0 });
}
c(wc, "openCriterionEditor");
function Go(t) {
  t.forEach((e, n) => {
    e.order = n;
  });
}
c(Go, "reindexCriteriaOrder");
function Om(t) {
  var e, n;
  if ((n = (e = game.i18n) == null ? void 0 : e.has) != null && n.call(e, "EIDOLON.SceneCriteria.ValueCountLabel"))
    try {
      return game.i18n.format("EIDOLON.SceneCriteria.ValueCountLabel", { count: t });
    } catch (i) {
      console.error(`${we} | Failed to format value count label`, i);
    }
  return t === 0 ? "No values configured" : t === 1 ? "1 value" : `${t} values`;
}
c(Om, "formatValueCount");
let Ec = !1;
function Am() {
  Hooks.once("init", () => {
    pm();
  }), Hooks.once("ready", () => {
    So() && (Ec || (Cm(), Ec = !0));
  });
}
c(Am, "registerSceneCriteriaHooks");
Am();
const ie = T, nd = "criteriaEngineVersion", Qn = "fileIndex", Xn = "tileCriteria", xl = {
  LEGACY: 1,
  CRITERIA: 2
}, id = xl.CRITERIA;
function rd(t) {
  var e;
  return ((e = t == null ? void 0 : t.getFlag) == null ? void 0 : e.call(t, ie, nd)) ?? xl.LEGACY;
}
c(rd, "getSceneEngineVersion");
function Mm(t, e, n, i, r) {
  if (!(t != null && t.length) || !(n != null && n.length)) return -1;
  const a = {};
  for (const s of n)
    a[s] = e[s];
  const o = Sc(t, a, n);
  if (o >= 0) return o;
  if (i != null && i.length && r) {
    const s = { ...a };
    for (const l of i) {
      if (!(l in s)) continue;
      s[l] = r[l] ?? "Standard";
      const u = Sc(t, s, n);
      if (u >= 0) return u;
    }
  }
  return -1;
}
c(Mm, "findBestMatch");
function Sc(t, e, n) {
  return t.findIndex((i) => {
    for (const r of n)
      if (i[r] !== e[r]) return !1;
    return !0;
  });
}
c(Sc, "findExactMatch");
function Nm(t, e) {
  if (!(t != null && t.length)) return -1;
  let n = -1, i = -1;
  for (let r = 0; r < t.length; r += 1) {
    const a = t[r] ?? {}, o = Object.keys(a);
    if (o.length === 0) {
      i < 0 && (n = r, i = 0);
      continue;
    }
    let s = !0;
    for (const l of o)
      if (a[l] !== e[l]) {
        s = !1;
        break;
      }
    s && o.length > i && (n = r, i = o.length);
  }
  return n;
}
c(Nm, "findFileIndex");
function oa(t) {
  return t && typeof t == "object" && !Array.isArray(t);
}
c(oa, "isPlainObject$2");
function Tc(t) {
  return t == null ? t : typeof structuredClone == "function" ? structuredClone(t) : JSON.parse(JSON.stringify(t));
}
c(Tc, "deepClone");
function km(t, e) {
  if (!e) return;
  const n = e.split(".").filter(Boolean);
  if (!n.length) return;
  let i = t;
  for (let r = 0; r < n.length - 1; r += 1) {
    if (!oa(i == null ? void 0 : i[n[r]])) return;
    i = i[n[r]];
  }
  delete i[n.at(-1)];
}
c(km, "deletePath");
function ad(t, e) {
  const n = Tc(t ?? {});
  if (!oa(e)) return n;
  for (const [i, r] of Object.entries(e)) {
    if (i.startsWith("-=") && r === !0) {
      km(n, i.slice(2));
      continue;
    }
    oa(r) && oa(n[i]) ? n[i] = ad(n[i], r) : n[i] = Tc(r);
  }
  return n;
}
c(ad, "fallbackMerge");
function $m(t, e) {
  var n, i;
  return (n = foundry == null ? void 0 : foundry.utils) != null && n.mergeObject && ((i = foundry == null ? void 0 : foundry.utils) != null && i.deepClone) ? foundry.utils.mergeObject(t, foundry.utils.deepClone(e), {
    inplace: !1
  }) : ad(t, e);
}
c($m, "defaultMerge");
function _m(t, e) {
  if (!t) return !0;
  for (const n of Object.keys(t))
    if (t[n] !== e[n]) return !1;
  return !0;
}
c(_m, "criteriaMatch");
function od(t, e, n, i) {
  const r = i ?? $m;
  let a = r({}, t ?? {});
  if (!(e != null && e.length)) return a;
  const o = [];
  for (let s = 0; s < e.length; s += 1) {
    const l = e[s];
    if (_m(l == null ? void 0 : l.criteria, n)) {
      const u = l != null && l.criteria ? Object.keys(l.criteria).length : 0;
      o.push({ specificity: u, index: s, delta: l == null ? void 0 : l.delta });
    }
  }
  o.sort((s, l) => s.specificity - l.specificity || s.index - l.index);
  for (const s of o)
    s.delta && (a = r(a, s.delta));
  return a;
}
c(od, "resolveRules");
function Co(t = null) {
  var i;
  const e = (game == null ? void 0 : game.user) ?? null;
  if (!e) return !1;
  if (e.isGM) return !0;
  const n = t ?? ((i = game == null ? void 0 : game.scenes) == null ? void 0 : i.viewed) ?? null;
  if (!n) return !1;
  if (typeof n.canUserModify == "function")
    try {
      return !!n.canUserModify(e, "update");
    } catch {
    }
  if (typeof n.testUserPermission == "function")
    try {
      return !!n.testUserPermission(e, "OWNER");
    } catch {
    }
  return !!n.isOwner;
}
c(Co, "canManageCriteria");
function Dm(t = null) {
  if (!Co(t))
    throw new Error(`${ie} | You do not have permission to manage scene criteria.`);
}
c(Dm, "requireCriteriaAccess");
const Fm = /* @__PURE__ */ c((...t) => console.log(`${ie} | criteria tiles:`, ...t), "log$1");
let Ta = /* @__PURE__ */ new WeakMap(), Ca = /* @__PURE__ */ new WeakMap();
const Cc = 200;
function Pm(t) {
  return t ? Number.isInteger(t.size) ? t.size : Array.isArray(t) || typeof t.length == "number" ? t.length : Array.from(t).length : 0;
}
c(Pm, "getCollectionSize$1");
function Vr() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
c(Vr, "nowMs$2");
function xm(t) {
  if (!Array.isArray(t)) return [];
  const e = /* @__PURE__ */ new Set();
  for (const n of t) {
    if (typeof n != "string") continue;
    const i = n.trim();
    i && e.add(i);
  }
  return Array.from(e);
}
c(xm, "uniqueStringKeys$1");
function Rm(t, e = Cc) {
  if (!Array.isArray(t) || t.length === 0) return [];
  const n = Number.isInteger(e) && e > 0 ? e : Cc, i = [];
  for (let r = 0; r < t.length; r += n)
    i.push(t.slice(r, r + n));
  return i;
}
c(Rm, "chunkArray$1");
async function Hm(t, e, n) {
  const i = Rm(e, n);
  for (const r of i)
    await t.updateEmbeddedDocuments("Tile", r), i.length > 1 && await Promise.resolve();
  return i.length;
}
c(Hm, "updateTilesInChunks");
function qm(t) {
  var i;
  const e = ii(t, { files: null });
  if (!((i = e == null ? void 0 : e.variants) != null && i.length)) return [];
  const n = /* @__PURE__ */ new Set();
  for (const r of e.variants)
    for (const a of Object.keys(r.criteria ?? {}))
      a && n.add(a);
  return Array.from(n);
}
c(qm, "getTileCriteriaDependencyKeys");
function jm(t, e) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
  for (const r of e) {
    const a = r.getFlag(ie, Xn) ?? r.getFlag(ie, Qn);
    if (a) {
      i.add(r.id);
      for (const o of qm(a))
        n.has(o) || n.set(o, /* @__PURE__ */ new Set()), n.get(o).add(r.id);
    }
  }
  return {
    collection: e,
    keyToTileIds: n,
    allTileIds: i
  };
}
c(jm, "buildTileDependencyIndex");
function Bm(t, e) {
  const n = Ca.get(t);
  if ((n == null ? void 0 : n.collection) === e) return n;
  const i = jm(t, e);
  return Ca.set(t, i), i;
}
c(Bm, "getTileDependencyIndex");
function Um(t, e, n) {
  const i = xm(n);
  if (!i.length)
    return Array.from(e ?? []);
  const r = Bm(t, e), a = /* @__PURE__ */ new Set();
  for (const o of i) {
    const s = r.keyToTileIds.get(o);
    if (s)
      for (const l of s)
        a.add(l);
  }
  return a.size ? typeof (e == null ? void 0 : e.get) == "function" ? Array.from(a).map((o) => e.get(o)).filter(Boolean) : Array.from(e ?? []).filter((o) => a.has(o.id)) : [];
}
c(Um, "getTilesForChangedKeys");
function sd(t) {
  return typeof (t == null ? void 0 : t.name) == "string" ? t.name : typeof (t == null ? void 0 : t.src) == "string" ? t.src : "";
}
c(sd, "getFilePath");
function La(t) {
  if (typeof t != "string") return "";
  const e = t.trim();
  if (!e) return "";
  const n = e.replace(/\\/g, "/");
  try {
    return decodeURIComponent(n);
  } catch {
    return n;
  }
}
c(La, "normalizeFilePath");
function Rl(t) {
  if (!Array.isArray(t)) return [];
  const e = /* @__PURE__ */ new Map();
  return t.map((n, i) => {
    const r = La(sd(n)), a = r || `__index:${i}`, o = e.get(a) ?? 0;
    e.set(a, o + 1);
    const s = {
      indexHint: i
    };
    return r && (s.path = r, s.occurrence = o), {
      index: i,
      path: r,
      occurrence: o,
      target: s,
      label: r.split("/").pop() || `File ${i + 1}`
    };
  });
}
c(Rl, "buildTileFileEntries");
function En(t, e) {
  if (!Number.isInteger(e) || e < 0) return null;
  const i = Rl(t).find((r) => r.index === e);
  return i ? { ...i.target } : { indexHint: e };
}
c(En, "createTileTargetFromIndex");
function Lo(t) {
  if (!t || typeof t != "object") return null;
  const e = La(t.path), n = Number(t.indexHint ?? t.fileIndex), i = Number(t.occurrence), r = {};
  return e && (r.path = e, r.occurrence = Number.isInteger(i) && i >= 0 ? i : 0), Number.isInteger(n) && n >= 0 && (r.indexHint = n), !r.path && !Number.isInteger(r.indexHint) ? null : r;
}
c(Lo, "normalizeTileTarget");
function or(t, e) {
  const n = Lo(t);
  if (!n) return -1;
  const i = Rl(e);
  if (!i.length) return -1;
  if (n.path) {
    const r = i.filter((a) => a.path === n.path);
    if (r.length > 0) {
      const a = Number.isInteger(n.occurrence) ? n.occurrence : 0;
      if (r[a]) return r[a].index;
      if (Number.isInteger(n.indexHint)) {
        const o = r.find((s) => s.index === n.indexHint);
        if (o) return o.index;
      }
      return r[0].index;
    }
  }
  return Number.isInteger(n.indexHint) && n.indexHint < i.length ? n.indexHint : -1;
}
c(or, "resolveTileTargetIndex");
function Sn(t) {
  if (!t || typeof t != "object" || Array.isArray(t)) return {};
  const e = {};
  for (const [n, i] of Object.entries(t))
    typeof n != "string" || !n || typeof i != "string" || !i.trim() || (e[n] = i.trim());
  return e;
}
c(Sn, "sanitizeCriteria");
function Vm(t) {
  return Object.entries(Sn(t)).sort(([n], [i]) => n.localeCompare(i)).map(([n, i]) => `${n}=${i}`).join("");
}
c(Vm, "serializeCriteria");
function zm(t) {
  return Object.keys(Sn(t)).length;
}
c(zm, "getCriteriaSpecificity");
function Gm(t, e) {
  const n = Sn(t), i = Sn(e);
  for (const [r, a] of Object.entries(n))
    if (r in i && i[r] !== a)
      return !1;
  return !0;
}
c(Gm, "areCriteriaCompatible");
function Wm(t, e) {
  const n = or(t, e);
  if (Number.isInteger(n) && n >= 0)
    return `index:${n}`;
  const i = Lo(t);
  if (!i) return "";
  if (i.path) {
    const r = Number.isInteger(i.occurrence) ? i.occurrence : 0;
    return `path:${i.path}#${r}`;
  }
  return Number.isInteger(i.indexHint) ? `hint:${i.indexHint}` : "";
}
c(Wm, "getTargetIdentity");
function ld(t, e = {}) {
  var s;
  const n = Array.isArray(e.files) ? e.files : [], i = ii(t, { files: n });
  if (!((s = i == null ? void 0 : i.variants) != null && s.length))
    return {
      errors: [],
      warnings: []
    };
  const r = i.variants.map((l, u) => ({
    index: u,
    criteria: Sn(l.criteria),
    specificity: zm(l.criteria),
    criteriaSignature: Vm(l.criteria),
    targetIdentity: Wm(l.target, n)
  })), a = [], o = [];
  for (let l = 0; l < r.length; l += 1) {
    const u = r[l];
    for (let d = l + 1; d < r.length; d += 1) {
      const m = r[d];
      if (u.specificity !== m.specificity || !Gm(u.criteria, m.criteria)) continue;
      if (!(!!u.targetIdentity && u.targetIdentity === m.targetIdentity)) {
        a.push({
          leftIndex: u.index,
          rightIndex: m.index,
          type: u.criteriaSignature === m.criteriaSignature ? "equivalent" : "overlap",
          specificity: u.specificity
        });
        continue;
      }
      u.criteriaSignature === m.criteriaSignature && o.push({
        leftIndex: u.index,
        rightIndex: m.index,
        type: "duplicate"
      });
    }
  }
  return {
    errors: a,
    warnings: o
  };
}
c(ld, "detectTileCriteriaConflicts");
function Jm(t, e) {
  if (!t || typeof t != "object") return null;
  let n = Lo(t.target);
  if (!n) {
    const i = Number(t.fileIndex);
    Number.isInteger(i) && i >= 0 && (n = En(e, i));
  }
  return n ? {
    criteria: Sn(t.criteria),
    target: n
  } : null;
}
c(Jm, "normalizeTileVariant");
function cd(t, e = {}) {
  if (!Array.isArray(t) || t.length === 0) return null;
  const n = Array.isArray(e.files) ? e.files : null, i = t.map((l, u) => ({
    criteria: Sn(l),
    target: En(n, u)
  })).filter((l) => l.target);
  if (!i.length) return null;
  const r = i.find((l) => Object.keys(l.criteria).length === 0), a = (r == null ? void 0 : r.target) ?? i[0].target;
  let o = null;
  const s = Number(e.defaultFileIndex);
  return Number.isInteger(s) && s >= 0 && (o = En(n, s)), o || (o = a), {
    strategy: "select-one",
    variants: i,
    defaultTarget: o
  };
}
c(cd, "buildTileCriteriaFromFileIndex");
function ii(t, e = {}) {
  const n = Array.isArray(e.files) ? e.files : null;
  if (Array.isArray(t))
    return cd(t, { files: n });
  if (!t || typeof t != "object") return null;
  const i = Array.isArray(t.variants) ? t.variants.map((a) => Jm(a, n)).filter(Boolean) : [];
  if (!i.length) return null;
  let r = Lo(t.defaultTarget);
  if (!r) {
    const a = Number(t.defaultFileIndex);
    Number.isInteger(a) && a >= 0 && (r = En(n, a));
  }
  if (!r) {
    const a = i.find((o) => Object.keys(o.criteria).length === 0);
    r = (a == null ? void 0 : a.target) ?? i[0].target;
  }
  return {
    strategy: "select-one",
    variants: i,
    defaultTarget: r
  };
}
c(ii, "normalizeTileCriteria");
function Km(t, e) {
  if (!t) return -1;
  let n = -1, i = -1;
  for (const r of t.variants) {
    const a = r.keys;
    let o = !0;
    for (const s of a)
      if (r.criteria[s] !== (e == null ? void 0 : e[s])) {
        o = !1;
        break;
      }
    o && a.length > i && (i = a.length, n = r.targetIndex);
  }
  return n >= 0 ? n : t.defaultIndex;
}
c(Km, "selectTileFileIndexFromCompiled");
function Ym(t, e) {
  const n = ii(t, { files: e });
  if (!n) return null;
  const i = n.variants.map((a) => {
    const o = Sn(a.criteria), s = or(a.target, e);
    return !Number.isInteger(s) || s < 0 ? null : {
      criteria: o,
      keys: Object.keys(o),
      targetIndex: s
    };
  }).filter(Boolean), r = or(n.defaultTarget, e);
  return !i.length && (!Number.isInteger(r) || r < 0) ? null : {
    variants: i,
    defaultIndex: r
  };
}
c(Ym, "compileTileMatcher");
function Qm(t, e, n) {
  const i = Ta.get(t);
  if (i && i.tileCriteria === e && i.files === n)
    return i.compiled;
  const r = Ym(e, n);
  return Ta.set(t, {
    tileCriteria: e,
    files: n,
    compiled: r
  }), r;
}
c(Qm, "getCompiledTileMatcher");
function Xm(t = null, e = null) {
  t ? Ca.delete(t) : Ca = /* @__PURE__ */ new WeakMap(), e ? Ta.delete(e) : t || (Ta = /* @__PURE__ */ new WeakMap());
}
c(Xm, "invalidateTileCriteriaCaches");
async function ud(t, e, n = {}) {
  var l, u, d, m;
  const i = Vr(), r = {
    total: 0,
    scanned: 0,
    updated: 0,
    chunks: 0,
    skipped: {
      unaffected: 0,
      noCriteria: 0,
      noFiles: 0,
      noMatch: 0,
      unchanged: 0
    },
    durationMs: 0
  };
  if (e = e ?? ((l = game.scenes) == null ? void 0 : l.viewed), !e)
    return r.durationMs = Vr() - i, r;
  const a = e.getEmbeddedCollection("Tile") ?? [];
  r.total = Pm(a);
  const o = Um(e, a, n.changedKeys);
  if (r.scanned = o.length, !o.length)
    return r.skipped.unaffected = r.total, r.durationMs = Vr() - i, r;
  const s = [];
  for (const g of o) {
    const y = g.getFlag(ie, Xn) ?? g.getFlag(ie, Qn);
    if (!y) {
      r.skipped.noCriteria += 1;
      continue;
    }
    const h = g.getFlag("monks-active-tiles", "files");
    if (!(h != null && h.length)) {
      r.skipped.noFiles += 1;
      continue;
    }
    const p = Qm(g, y, h), v = Km(p, t);
    if (!Number.isInteger(v) || v < 0 || v >= h.length) {
      console.warn(`${ie} | Tile ${g.id} has no valid file match for state`, t), r.skipped.noMatch += 1;
      continue;
    }
    const b = v + 1, C = Number(g.getFlag("monks-active-tiles", "fileindex")) !== b, O = h.some((F, D) => !!(F != null && F.selected) != (D === v)), A = La(((u = g.texture) == null ? void 0 : u.src) ?? ((m = (d = g._source) == null ? void 0 : d.texture) == null ? void 0 : m.src) ?? ""), k = sd(h[v]), $ = La(k), H = !!$ && $ !== A;
    if (!O && !C && !H) {
      r.skipped.unchanged += 1;
      continue;
    }
    const q = {
      _id: g._id
    };
    O && (q["flags.monks-active-tiles.files"] = h.map((F, D) => ({
      ...F,
      selected: D === v
    }))), C && (q["flags.monks-active-tiles.fileindex"] = b), H && (q.texture = { src: k }), s.push(q), Fm(`Tile ${g.id} -> ${k}`);
  }
  return s.length > 0 && (r.chunks = await Hm(e, s, n.chunkSize), r.updated = s.length), r.durationMs = Vr() - i, r;
}
c(ud, "updateTiles");
function Zm() {
  if (!globalThis.Tagger) return [];
  const t = ["Checkbox", "Tile", "Settings", "Toggleable Lights"], e = [
    "Checkbox",
    "Tile",
    "Settings",
    "Toggleable Lights",
    "Checked",
    "Unchecked",
    "Individual"
  ], n = Tagger.getByTag(t) ?? [], i = [];
  for (const r of n) {
    if (r.getFlag("monks-active-tiles", "variables.state") !== "unchecked") continue;
    const a = (Tagger.getTags(r) ?? []).filter((l) => !e.includes(l)), o = (Tagger.getByTag("Disable Automation") ?? []).concat(Tagger.getByTag("Settings") ?? []), s = Tagger.getByTag(a, { ignore: o }) ?? [];
    for (const l of s)
      l != null && l._id && i.push(l._id);
  }
  return i;
}
c(Zm, "buildLightControlsMap");
const Zn = T, wi = "lightCriteria", Hl = Object.freeze({
  base: null,
  mappings: [],
  current: null
});
function Wo(t) {
  return t && typeof t == "object" && !Array.isArray(t);
}
c(Wo, "isPlainObject$1");
function dd(t, e) {
  if (!Wo(e)) return {};
  const n = {};
  for (const [i, r] of Object.entries(e)) {
    const a = t == null ? void 0 : t[i];
    if (Wo(r) && Wo(a)) {
      const o = dd(a, r);
      Object.keys(o).length > 0 && (n[i] = o);
    } else r !== a && (n[i] = _t(r));
  }
  return n;
}
c(dd, "computeDelta");
function fd(t) {
  var n;
  const e = ((n = t == null ? void 0 : t.getFlag) == null ? void 0 : n.call(t, Zn, wi)) ?? Hl;
  return sr(e);
}
c(fd, "getLightCriteriaState");
async function md(t, e) {
  const n = sr(e);
  if (!(t != null && t.setFlag))
    return n;
  const i = n.base !== null, r = n.mappings.length > 0, a = n.current !== null;
  return !i && !r && !a ? (typeof t.unsetFlag == "function" ? await t.unsetFlag(Zn, wi) : await t.setFlag(Zn, wi, null), Hl) : (await t.setFlag(Zn, wi, n), n);
}
c(md, "setLightCriteriaState");
async function Pr(t, e) {
  if (typeof e != "function")
    throw new TypeError("updateLightCriteriaState requires an updater function.");
  const n = _t(fd(t)), i = await e(n);
  return md(t, i);
}
c(Pr, "updateLightCriteriaState");
async function Lc(t, e) {
  const n = ri(e);
  if (!n)
    throw new Error("Invalid light configuration payload.");
  return Pr(t, (i) => ({
    ...i,
    base: n
  }));
}
c(Lc, "storeBaseLighting");
async function Ic(t, e, n, { label: i } = {}) {
  const r = xr(e);
  if (!r)
    throw new Error("Cannot create a mapping without at least one category selection.");
  const a = ri(n);
  if (!a)
    throw new Error("Invalid light configuration payload.");
  return Pr(t, (o) => {
    const s = Fi(r), l = Array.isArray(o == null ? void 0 : o.mappings) ? [...o.mappings] : [], u = l.findIndex((y) => (y == null ? void 0 : y.key) === s), d = u >= 0 ? l[u] : null, m = typeof (d == null ? void 0 : d.id) == "string" && d.id.trim() ? d.id.trim() : hd(), g = Io({
      id: m,
      categories: r,
      config: a,
      label: typeof i == "string" ? i : (d == null ? void 0 : d.label) ?? null,
      updatedAt: Date.now()
    });
    if (!g)
      throw new Error("Failed to sanitize criteria mapping entry.");
    return u >= 0 ? l[u] = g : l.push(g), {
      ...o,
      mappings: l
    };
  });
}
c(Ic, "upsertLightCriteriaMapping");
async function eg(t, e, n, i, { replaceExisting: r = !1 } = {}) {
  const a = typeof e == "string" ? e.trim() : "";
  if (!a)
    throw new Error("A mapping id is required to retarget criteria.");
  const o = xr(n);
  if (!o)
    throw new Error("Cannot retarget mapping without at least one category selection.");
  const s = ri(i);
  if (!s)
    throw new Error("Invalid light configuration payload.");
  return Pr(t, (l) => {
    const u = Array.isArray(l == null ? void 0 : l.mappings) ? [...l.mappings] : [], d = u.findIndex((b) => (b == null ? void 0 : b.id) === a);
    if (d < 0)
      throw new Error("The selected mapping no longer exists.");
    const m = Fi(o), g = u.findIndex(
      (b, w) => w !== d && (b == null ? void 0 : b.key) === m
    );
    if (g >= 0 && !r)
      throw new Error("A mapping already exists for the selected criteria.");
    const y = u[d], h = Io({
      ...y,
      id: a,
      categories: o,
      config: s,
      updatedAt: Date.now()
    });
    if (!h)
      throw new Error("Failed to sanitize updated mapping.");
    u[d] = h;
    let p = null;
    if (g >= 0) {
      const [b] = u.splice(g, 1);
      p = (b == null ? void 0 : b.id) ?? null;
    }
    let v = (l == null ? void 0 : l.current) ?? null;
    return v && typeof v == "object" && (v.mappingId === a ? v = {
      ...v,
      mappingId: a,
      categories: o,
      updatedAt: Date.now()
    } : p && v.mappingId === p && (v = {
      ...v,
      mappingId: a,
      categories: o,
      updatedAt: Date.now()
    })), {
      ...l,
      mappings: u,
      current: v
    };
  });
}
c(eg, "retargetLightCriteriaMapping");
async function tg(t, e) {
  const n = typeof e == "string" ? e.trim() : "";
  if (!n)
    throw new Error("A mapping id is required to remove a mapping.");
  return Pr(t, (i) => {
    const r = Array.isArray(i == null ? void 0 : i.mappings) ? [...i.mappings] : [], a = r.findIndex((s) => (s == null ? void 0 : s.id) === n);
    if (a < 0) return i;
    r.splice(a, 1);
    let o = (i == null ? void 0 : i.current) ?? null;
    return (o == null ? void 0 : o.mappingId) === n && (o = null), {
      ...i,
      mappings: r,
      current: o
    };
  });
}
c(tg, "removeLightCriteriaMapping");
async function Xi(t, e) {
  const n = gd(e);
  return Pr(t, (i) => ({
    ...i,
    current: n
  }));
}
c(Xi, "storeCurrentCriteriaSelection");
function ng(t) {
  const e = sr(t), n = e.base ?? {}, i = [];
  for (const r of e.mappings) {
    const a = xr(r == null ? void 0 : r.categories);
    if (!a) continue;
    const o = dd(n, (r == null ? void 0 : r.config) ?? {});
    Object.keys(o).length !== 0 && i.push({
      criteria: a,
      delta: o
    });
  }
  return {
    base: n,
    rules: i
  };
}
c(ng, "convertLightCriteriaStateToPresets");
function ig(t, e = []) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
  for (const l of e)
    typeof (l == null ? void 0 : l.key) == "string" && l.key.trim() && i.add(l.key.trim()), typeof (l == null ? void 0 : l.id) == "string" && l.id.trim() && typeof (l == null ? void 0 : l.key) == "string" && n.set(l.id.trim(), l.key.trim());
  const r = sr(t), a = /* @__PURE__ */ c((l) => {
    const u = {};
    for (const [d, m] of Object.entries(l ?? {})) {
      const g = String(d ?? "").trim(), y = typeof m == "string" ? m.trim() : "";
      if (!g || !y) continue;
      if (i.has(g)) {
        u[g] = y;
        continue;
      }
      const h = n.get(g);
      h && (u[h] = y);
    }
    return Object.keys(u).length ? u : null;
  }, "remapCategories"), o = r.mappings.map((l) => {
    const u = a(l.categories);
    return u ? Io({
      ...l,
      categories: u,
      key: Fi(u)
    }) : null;
  }).filter(Boolean);
  let s = r.current;
  if (s != null && s.categories) {
    const l = a(s.categories);
    s = l ? {
      ...s,
      categories: l
    } : null;
  }
  return sr({
    ...r,
    mappings: o,
    current: s
  });
}
c(ig, "migrateLightCriteriaCategoriesToKeys");
function sr(t) {
  var l;
  const e = _t(t);
  if (!e || typeof e != "object")
    return _t(Hl);
  const n = ri(e.base), i = Array.isArray(e.mappings) ? e.mappings : [], r = /* @__PURE__ */ new Map();
  for (const u of i) {
    const d = Io(u);
    d && r.set(d.key, d);
  }
  const a = Array.from(r.values()), o = new Map(a.map((u) => [u.id, u]));
  let s = gd(e.current);
  if (s) {
    const u = s.categories && Object.keys(s.categories).length > 0;
    if (s.mappingId && !o.has(s.mappingId)) {
      const d = u ? ((l = a.find((m) => m.key === Fi(s.categories))) == null ? void 0 : l.id) ?? null : null;
      d ? s = {
        ...s,
        mappingId: d
      } : u && (s = {
        mappingId: null,
        categories: s.categories,
        updatedAt: s.updatedAt
      });
    }
  }
  return {
    base: n ?? null,
    mappings: a,
    current: s
  };
}
c(sr, "sanitizeLightCriteriaState");
function ri(t) {
  const e = _t(t);
  if (!e || typeof e != "object") return null;
  "_id" in e && delete e._id, "id" in e && delete e.id;
  const n = e.flags;
  if (n && typeof n == "object") {
    const i = n[Zn];
    i && typeof i == "object" && (delete i[wi], Object.keys(i).length === 0 && delete n[Zn]), Object.keys(n).length === 0 && delete e.flags;
  }
  return e;
}
c(ri, "sanitizeLightConfigPayload");
function Io(t) {
  if (!t || typeof t != "object") return null;
  const e = xr(t.categories);
  if (!e) return null;
  const n = ri(t.config);
  if (!n) return null;
  const i = typeof t.id == "string" && t.id.trim() ? t.id.trim() : hd(), r = Fi(e), a = {
    id: i,
    key: r,
    categories: e,
    config: n,
    updatedAt: Number.isFinite(t.updatedAt) ? Number(t.updatedAt) : Date.now()
  };
  return typeof t.label == "string" && t.label.trim() && (a.label = t.label.trim()), a;
}
c(Io, "sanitizeCriteriaMappingEntry");
function gd(t) {
  if (!t || typeof t != "object") return null;
  const e = typeof t.mappingId == "string" && t.mappingId.trim() ? t.mappingId.trim() : null, n = xr(t.categories);
  return !e && !n ? null : {
    mappingId: e,
    categories: n,
    updatedAt: Number.isFinite(t.updatedAt) ? Number(t.updatedAt) : Date.now()
  };
}
c(gd, "sanitizeCurrentSelection");
function xr(t) {
  const e = {};
  if (Array.isArray(t))
    for (const n of t) {
      const i = Oc((n == null ? void 0 : n.id) ?? (n == null ? void 0 : n.categoryId) ?? (n == null ? void 0 : n.category)), r = Ac((n == null ? void 0 : n.value) ?? (n == null ? void 0 : n.selection) ?? (n == null ? void 0 : n.label));
      !i || !r || (e[i] = r);
    }
  else if (t && typeof t == "object")
    for (const [n, i] of Object.entries(t)) {
      const r = Oc(n), a = Ac(i);
      !r || !a || (e[r] = a);
    }
  return Object.keys(e).length > 0 ? e : null;
}
c(xr, "sanitizeCriteriaCategories");
function Fi(t) {
  if (!t || typeof t != "object") return "";
  const e = Object.entries(t).filter(([, n]) => typeof n == "string" && n).map(([n, i]) => `${n}:${i}`);
  return e.sort((n, i) => n < i ? -1 : n > i ? 1 : 0), e.join("|");
}
c(Fi, "computeCriteriaMappingKey");
function hd() {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
c(hd, "generateLightMappingId");
function Oc(t) {
  if (typeof t != "string") return null;
  const e = t.trim();
  return e || null;
}
c(Oc, "normalizeCategoryId");
function Ac(t) {
  if (typeof t != "string") return null;
  const e = t.trim();
  return e || null;
}
c(Ac, "normalizeCategoryValue");
const Ia = ["AmbientLight", "Wall", "AmbientSound"];
let Oa = /* @__PURE__ */ new WeakMap(), Aa = /* @__PURE__ */ new WeakMap();
const Mc = 200;
function rg(t) {
  return t ? Number.isInteger(t.size) ? t.size : Array.isArray(t) || typeof t.length == "number" ? t.length : Array.from(t).length : 0;
}
c(rg, "getCollectionSize");
function Jo() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
c(Jo, "nowMs$1");
function ag(t) {
  if (!Array.isArray(t)) return [];
  const e = /* @__PURE__ */ new Set();
  for (const n of t) {
    if (typeof n != "string") continue;
    const i = n.trim();
    i && e.add(i);
  }
  return Array.from(e);
}
c(ag, "uniqueStringKeys");
function og(t, e = Mc) {
  if (!Array.isArray(t) || t.length === 0) return [];
  const n = Number.isInteger(e) && e > 0 ? e : Mc, i = [];
  for (let r = 0; r < t.length; r += n)
    i.push(t.slice(r, r + n));
  return i;
}
c(og, "chunkArray");
async function sg(t, e, n, i) {
  const r = og(n, i);
  for (const a of r)
    await t.updateEmbeddedDocuments(e, a), r.length > 1 && await Promise.resolve();
  return r.length;
}
c(sg, "updatePlaceablesInChunks");
function lg(t) {
  const e = /* @__PURE__ */ new Set();
  for (const n of (t == null ? void 0 : t.rules) ?? [])
    for (const i of Object.keys((n == null ? void 0 : n.criteria) ?? {}))
      i && e.add(i);
  return Array.from(e);
}
c(lg, "getPresetDependencyKeys");
function cg(t, e) {
  const n = /* @__PURE__ */ new Map();
  for (const i of Ia) {
    const r = e.get(i) ?? [], a = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Map();
    for (const s of r) {
      const l = yd(s, i);
      if (l != null && l.base) {
        a.add(s.id);
        for (const u of lg(l))
          o.has(u) || o.set(u, /* @__PURE__ */ new Set()), o.get(u).add(s.id);
      }
    }
    n.set(i, {
      allDocIds: a,
      keyToDocIds: o
    });
  }
  return {
    collectionsByType: e,
    byType: n
  };
}
c(cg, "buildPlaceableDependencyIndex");
function ug(t, e) {
  const n = Aa.get(t);
  if (n && Ia.every((r) => n.collectionsByType.get(r) === e.get(r)))
    return n;
  const i = cg(t, e);
  return Aa.set(t, i), i;
}
c(ug, "getPlaceableDependencyIndex");
function dg(t, e, n) {
  if (!e || !t) return [];
  const i = ag(n);
  if (!i.length)
    return typeof t.get == "function" ? Array.from(e.allDocIds).map((a) => t.get(a)).filter(Boolean) : Array.from(t).filter((a) => e.allDocIds.has(a.id));
  const r = /* @__PURE__ */ new Set();
  for (const a of i) {
    const o = e.keyToDocIds.get(a);
    if (o)
      for (const s of o) r.add(s);
  }
  return r.size ? typeof t.get == "function" ? Array.from(r).map((a) => t.get(a)).filter(Boolean) : Array.from(t).filter((a) => r.has(a.id)) : [];
}
c(dg, "getDocsForChangedKeys");
function gi(t) {
  return !!t && typeof t == "object" && !Array.isArray(t);
}
c(gi, "isPlainObject");
function qs(t, e) {
  if (Object.is(t, e)) return !0;
  if (Array.isArray(t) || Array.isArray(e)) {
    if (!Array.isArray(t) || !Array.isArray(e) || t.length !== e.length) return !1;
    for (let n = 0; n < t.length; n += 1)
      if (!qs(t[n], e[n])) return !1;
    return !0;
  }
  if (gi(t) || gi(e)) {
    if (!gi(t) || !gi(e)) return !1;
    const n = Object.keys(e);
    for (const i of n)
      if (!qs(t[i], e[i])) return !1;
    return !0;
  }
  return !1;
}
c(qs, "areValuesEqual");
function pd(t, e) {
  const n = { _id: e._id };
  for (const [r, a] of Object.entries(e)) {
    if (r === "_id") continue;
    const o = t == null ? void 0 : t[r];
    if (gi(a) && gi(o)) {
      const s = pd(o, { _id: e._id, ...a });
      if (!s) continue;
      const l = Object.keys(s).filter((u) => u !== "_id");
      if (l.length > 0) {
        n[r] = {};
        for (const u of l)
          n[r][u] = s[u];
      }
      continue;
    }
    qs(o, a) || (n[r] = a);
  }
  return Object.keys(n).filter((r) => r !== "_id").length > 0 ? n : null;
}
c(pd, "buildChangedPayload");
function yd(t, e) {
  var s;
  const n = ((s = t == null ? void 0 : t.flags) == null ? void 0 : s[ie]) ?? {}, i = (n == null ? void 0 : n.presets) ?? null, r = e === "AmbientLight" ? (n == null ? void 0 : n.lightCriteria) ?? null : null, a = Oa.get(t);
  if (a && a.type === e && a.rawPresets === i && a.rawLightCriteria === r)
    return a.presets;
  let o = null;
  if (n != null && n.presets) {
    const l = n.presets.base ?? null, u = Array.isArray(n.presets.rules) ? n.presets.rules : [];
    (l && Object.keys(l).length > 0 || u.length > 0) && (o = {
      base: l ?? {},
      rules: u
    });
  }
  if (!o && e === "AmbientLight" && (n != null && n.lightCriteria)) {
    const l = ng(n.lightCriteria);
    (l.base && Object.keys(l.base).length > 0 || l.rules.length > 0) && (o = {
      base: l.base,
      rules: l.rules
    });
  }
  return Oa.set(t, {
    type: e,
    rawPresets: i,
    rawLightCriteria: r,
    presets: o
  }), o;
}
c(yd, "getPresetsForDocument");
function fg(t = null, e = null) {
  t ? Aa.delete(t) : Aa = /* @__PURE__ */ new WeakMap(), e ? Oa.delete(e) : t || (Oa = /* @__PURE__ */ new WeakMap());
}
c(fg, "invalidatePlaceableCriteriaCaches");
async function bd(t, e, n = {}) {
  var l, u;
  const i = Jo(), r = {
    total: 0,
    scanned: 0,
    updated: 0,
    chunks: 0,
    byType: {},
    durationMs: 0
  };
  if (e = e ?? ((l = game.scenes) == null ? void 0 : l.viewed), !e)
    return r.durationMs = Jo() - i, r;
  const a = new Set(Zm()), o = new Map(
    Ia.map((d) => [d, e.getEmbeddedCollection(d) ?? []])
  ), s = ug(e, o);
  for (const d of Ia) {
    const m = o.get(d) ?? [], g = {
      total: rg(m),
      scanned: 0,
      updated: 0,
      chunks: 0
    }, y = s.byType.get(d) ?? null, h = dg(m, y, n.changedKeys);
    if (g.scanned = h.length, r.total += g.total, r.scanned += g.scanned, r.byType[d] = g, !h.length) continue;
    const p = [];
    for (const v of h) {
      const b = yd(v, d);
      if (!(b != null && b.base)) continue;
      const w = od(b.base, b.rules ?? [], t);
      w._id = v._id, d === "AmbientLight" && a.has(v._id) && (w.hidden = !0);
      const C = (v == null ? void 0 : v._source) ?? ((u = v == null ? void 0 : v.toObject) == null ? void 0 : u.call(v)) ?? {}, O = pd(C, w);
      O && p.push(O);
    }
    p.length > 0 && (g.chunks = await sg(e, d, p, n.chunkSize), g.updated = p.length, r.updated += p.length, r.chunks += g.chunks, console.log(`${ie} | Updated ${p.length} ${d}(s)`));
  }
  return r.durationMs = Jo() - i, r;
}
c(bd, "updatePlaceables");
function Ma() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
c(Ma, "nowMs");
const zr = /* @__PURE__ */ new Map();
function mg(t) {
  var e;
  return t = t ?? ((e = game.scenes) == null ? void 0 : e.viewed), t ? Fr(t) : null;
}
c(mg, "getState");
async function gg(t, e, n = 0) {
  var y;
  const i = Ma();
  if (e = e ?? ((y = game.scenes) == null ? void 0 : y.viewed), !e) return null;
  Dm(e);
  const r = ut(e);
  if (!r.length)
    return console.warn(`${ie} | applyState skipped: scene has no criteria.`), null;
  const a = Fr(e, r), o = Pl({ ...a, ...t ?? {} }, r), s = r.filter((h) => (a == null ? void 0 : a[h.key]) !== (o == null ? void 0 : o[h.key])).map((h) => h.key), l = s.length > 0;
  l && await bm(e, o, r);
  const u = l ? o : a, [d, m] = await Promise.all([
    ud(u, e, { changedKeys: s }),
    bd(u, e, { changedKeys: s })
  ]), g = Ma() - i;
  return M("Criteria apply telemetry", {
    sceneId: e.id,
    changedKeys: s,
    didChange: l,
    queuedMs: n,
    durationMs: g,
    tiles: d,
    placeables: m
  }), Hooks.callAll("eidolon-utilities.criteriaStateApplied", e, u), u;
}
c(gg, "applyStateInternal");
async function vd(t, e) {
  var l;
  if (e = e ?? ((l = game.scenes) == null ? void 0 : l.viewed), !e) return null;
  const n = e.id ?? "__viewed__", i = Ma(), r = zr.get(n) ?? Promise.resolve();
  let a = null;
  const o = r.catch(() => null).then(async () => {
    const u = Ma() - i;
    return gg(t, e, u);
  });
  a = o;
  const s = o.finally(() => {
    zr.get(n) === s && zr.delete(n);
  });
  return zr.set(n, s), a;
}
c(vd, "applyState$1");
function hg(t) {
  var e;
  return t = t ?? ((e = game.scenes) == null ? void 0 : e.viewed), t ? rd(t) : null;
}
c(hg, "getVersion");
async function wd(t, e) {
  var n;
  e = e ?? ((n = game.scenes) == null ? void 0 : n.viewed), e != null && e.setFlag && await e.setFlag(ie, nd, Number(t));
}
c(wd, "setVersion");
async function pg(t) {
  return wd(id, t);
}
c(pg, "markCurrentVersion");
const Wi = "Standard", yg = /* @__PURE__ */ c((...t) => console.log(`${ie} | criteria indexer:`, ...t), "log");
function ql(t) {
  if (typeof t != "string") return null;
  let e = t;
  try {
    e = decodeURIComponent(t);
  } catch {
  }
  const n = e.match(/\[([^\]]+)\]/);
  if (!n) return null;
  const i = n[1].split(",").map((r) => r.trim()).filter(Boolean);
  return i.length ? i : null;
}
c(ql, "parseFileTags");
function bg(t, e, n = Wi) {
  return t != null && t.length ? t.map((i) => {
    const r = ql(i == null ? void 0 : i.name);
    if (!r) return {};
    const a = {};
    for (const [o, s] of Object.entries(e)) {
      const l = r[Number(o)];
      l != null && l !== n && (a[s] = l);
    }
    return a;
  }) : [];
}
c(bg, "buildFileIndex");
function vg(t, e) {
  return t.map((n, i) => {
    const r = [...e[n] ?? /* @__PURE__ */ new Set()].sort(), o = r.includes(Wi) ? Wi : r[0] ?? Wi, s = Fl(n);
    return s.key = n, s.label = n.charAt(0).toUpperCase() + n.slice(1), s.values = r.length ? r : [Wi], s.default = s.values.includes(o) ? o : s.values[0], s.order = i, s;
  });
}
c(vg, "buildCriteriaDefinitions");
async function Gr(t, e, n, { dryRun: i = !1 } = {}) {
  const r = t.getFlag("monks-active-tiles", "files");
  if (!(r != null && r.length)) return null;
  const a = bg(r, e), o = cd(a, { files: r });
  for (const s of r) {
    const l = ql(s == null ? void 0 : s.name);
    if (l)
      for (const [u, d] of Object.entries(e)) {
        const m = l[Number(u)];
        m != null && n[d] && n[d].add(m);
      }
  }
  return i || (await t.setFlag(ie, Xn, o), typeof t.unsetFlag == "function" && await t.unsetFlag(ie, Qn)), { files: r.length };
}
c(Gr, "indexTile");
async function wg(t, e = {}) {
  var w, C, O, A;
  const {
    dryRun: n = !1,
    force: i = !1
  } = e;
  if (t = t ?? ((w = game.scenes) == null ? void 0 : w.viewed), !t) throw new Error("No scene provided to indexScene.");
  if (!globalThis.Tagger) throw new Error("Tagger is required to index scene criteria.");
  if (!i && rd(t) >= id)
    throw new Error(
      `Scene "${t.name}" is already criteria-indexed. Use force: true to re-index.`
    );
  const r = { sceneId: t.id }, a = Tagger.getByTag("Map", r) ?? [];
  if (!a.length) throw new Error("No Map tile found.");
  if (a.length > 1) throw new Error(`Expected 1 Map tile, found ${a.length}.`);
  const o = a[0], s = o.getFlag("monks-active-tiles", "files");
  if (!(s != null && s.length)) throw new Error("Map tile has no MATT files.");
  const l = ql((C = s[0]) == null ? void 0 : C.name);
  if (!(l != null && l.length))
    throw new Error(`Cannot parse bracket tags from: ${((O = s[0]) == null ? void 0 : O.name) ?? "<unknown>"}`);
  if (l.length < 3)
    throw new Error(`Expected 3+ bracket tags, found ${l.length}.`);
  const u = Tagger.getByTag("Floor", r) ?? [], d = Tagger.getByTag("Roof", r) ?? [], m = Tagger.getByTag("Weather", r) ?? [];
  let g;
  const y = [];
  l.length >= 4 ? (g = { 0: "mood", 1: "stage", 2: "variant", 3: "effect" }, y.push("mood", "stage", "variant", "effect")) : (g = { 0: "mood", 1: "variant", 2: "effect" }, y.push("mood", "variant", "effect"));
  const h = { 1: "effect" }, p = {};
  for (const k of y)
    p[k] = /* @__PURE__ */ new Set();
  const v = {
    map: null,
    floor: [],
    roof: [],
    weather: []
  };
  v.map = await Gr(o, g, p, { dryRun: n });
  for (const k of u) {
    const $ = await Gr(k, g, p, { dryRun: n });
    $ && v.floor.push($);
  }
  for (const k of d) {
    const $ = await Gr(k, g, p, { dryRun: n });
    $ && v.roof.push($);
  }
  for (const k of m) {
    const $ = await Gr(k, h, p, { dryRun: n });
    $ && v.weather.push($);
  }
  const b = vg(y, p);
  return n || (await To(t, b), await pg(t)), yg(
    n ? "Dry run complete" : "Indexing complete",
    `- ${b.length} criteria,`,
    `${((A = v.map) == null ? void 0 : A.files) ?? 0} map files`
  ), {
    criteria: b,
    state: b.reduce((k, $) => (k[$.key] = $.default, k), {}),
    tiles: v,
    overlayMode: m.length > 0
  };
}
c(wg, "indexScene");
var fu, Fe, ot, st, zn, Je, Nt, on, po, le, Ed, Sd, Td, Bs, Cd, Us, Ld, Ji, Vs;
const ht = class ht extends On(In) {
  constructor(n = {}) {
    var i;
    super(n);
    I(this, le);
    I(this, Fe, null);
    I(this, ot, []);
    I(this, st, {});
    I(this, zn, !1);
    I(this, Je, null);
    I(this, Nt, null);
    I(this, on, null);
    I(this, po, 120);
    this.setScene(n.scene ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null);
  }
  setScene(n) {
    var i;
    L(this, Fe, n ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null), S(this, le, Ed).call(this);
  }
  get scene() {
    return f(this, Fe);
  }
  async _prepareContext() {
    var r;
    const n = !!f(this, Fe), i = n && f(this, ot).length > 0;
    return {
      hasScene: n,
      hasCriteria: i,
      sceneName: ((r = f(this, Fe)) == null ? void 0 : r.name) ?? E("EIDOLON.CriteriaSwitcher.NoScene", "No active scene"),
      labels: {
        subtitle: E(
          "EIDOLON.CriteriaSwitcher.Subtitle",
          "Switch criteria live and immediately apply all mapped updates."
        ),
        empty: E(
          "EIDOLON.CriteriaSwitcher.Empty",
          "No criteria found for this scene. Configure criteria first."
        ),
        reset: E("EIDOLON.CriteriaSwitcher.Reset", "Reset Defaults"),
        close: E("EIDOLON.CriteriaSwitcher.Close", "Close"),
        applying: E("EIDOLON.CriteriaSwitcher.Applying", "Applying changes..."),
        ready: E("EIDOLON.CriteriaSwitcher.Ready", "Ready")
      },
      criteria: f(this, ot).map((a) => ({
        key: a.key,
        label: a.label || a.key,
        values: a.values.map((o) => {
          var s;
          return {
            value: o,
            selected: ((s = f(this, st)) == null ? void 0 : s[a.key]) === o
          };
        }),
        defaultValue: a.default
      })),
      stateSummary: S(this, le, Vs).call(this)
    };
  }
  _onRender(n, i) {
    super._onRender(n, i), S(this, le, Sd).call(this), S(this, le, Td).call(this);
  }
  async _onClose(n) {
    return f(this, Je) !== null && (clearTimeout(f(this, Je)), L(this, Je, null)), f(this, on) !== null && (Hooks.off("eidolon-utilities.criteriaStateApplied", f(this, on)), L(this, on, null)), super._onClose(n);
  }
};
Fe = new WeakMap(), ot = new WeakMap(), st = new WeakMap(), zn = new WeakMap(), Je = new WeakMap(), Nt = new WeakMap(), on = new WeakMap(), po = new WeakMap(), le = new WeakSet(), Ed = /* @__PURE__ */ c(function() {
  if (!f(this, Fe)) {
    L(this, ot, []), L(this, st, {});
    return;
  }
  L(this, ot, ut(f(this, Fe)).sort((n, i) => n.order - i.order)), L(this, st, Fr(f(this, Fe), f(this, ot)));
}, "#hydrateFromScene"), Sd = /* @__PURE__ */ c(function() {
  var i, r;
  const n = this.element;
  n instanceof HTMLElement && (n.querySelectorAll("[data-criteria-key]").forEach((a) => {
    a.addEventListener("change", (o) => {
      const s = o.currentTarget;
      if (!(s instanceof HTMLSelectElement)) return;
      const l = s.dataset.criteriaKey;
      l && (L(this, st, {
        ...f(this, st),
        [l]: s.value
      }), S(this, le, Cd).call(this, { [l]: s.value }));
    });
  }), (i = n.querySelector("[data-action='reset-defaults']")) == null || i.addEventListener("click", () => {
    S(this, le, Ld).call(this);
  }), (r = n.querySelector("[data-action='close-switcher']")) == null || r.addEventListener("click", () => {
    this.close();
  }));
}, "#bindEvents"), Td = /* @__PURE__ */ c(function() {
  f(this, on) === null && L(this, on, Hooks.on("eidolon-utilities.criteriaStateApplied", (n, i) => {
    !f(this, Fe) || (n == null ? void 0 : n.id) !== f(this, Fe).id || f(this, zn) || (L(this, st, { ...i ?? {} }), this.render({ force: !0 }));
  }));
}, "#ensureSyncHook"), Bs = /* @__PURE__ */ c(async function(n) {
  var i, r;
  if (f(this, Fe)) {
    S(this, le, Ji).call(this, "applying"), L(this, zn, !0);
    try {
      const a = await vd(n, f(this, Fe));
      a && L(this, st, a), S(this, le, Ji).call(this, "ready"), this.render({ force: !0 });
    } catch (a) {
      console.error(`${ie} | Failed to apply criteria state`, a), (r = (i = ui.notifications) == null ? void 0 : i.error) == null || r.call(
        i,
        E(
          "EIDOLON.CriteriaSwitcher.ApplyError",
          "Failed to apply the selected criteria state."
        )
      ), S(this, le, Ji).call(this, "error", (a == null ? void 0 : a.message) ?? "Unknown error");
    } finally {
      L(this, zn, !1), f(this, Nt) && S(this, le, Us).call(this);
    }
  }
}, "#applyPartialState"), Cd = /* @__PURE__ */ c(function(n) {
  L(this, Nt, {
    ...f(this, Nt) ?? {},
    ...n ?? {}
  }), f(this, Je) !== null && clearTimeout(f(this, Je)), S(this, le, Ji).call(this, "applying"), L(this, Je, setTimeout(() => {
    L(this, Je, null), S(this, le, Us).call(this);
  }, f(this, po)));
}, "#queuePartialState"), Us = /* @__PURE__ */ c(async function() {
  if (f(this, zn) || !f(this, Nt)) return;
  const n = f(this, Nt);
  L(this, Nt, null), await S(this, le, Bs).call(this, n);
}, "#flushPendingState"), Ld = /* @__PURE__ */ c(async function() {
  if (!f(this, ot).length) return;
  const n = f(this, ot).reduce((i, r) => (i[r.key] = r.default, i), {});
  L(this, st, n), f(this, Je) !== null && (clearTimeout(f(this, Je)), L(this, Je, null)), L(this, Nt, null), await S(this, le, Bs).call(this, n);
}, "#resetToDefaults"), Ji = /* @__PURE__ */ c(function(n, i = "") {
  const r = this.element;
  if (!(r instanceof HTMLElement)) return;
  const a = r.querySelector("[data-role='status']");
  if (a instanceof HTMLElement)
    switch (a.dataset.mode = n, n) {
      case "applying":
        a.textContent = E("EIDOLON.CriteriaSwitcher.Applying", "Applying changes...");
        break;
      case "error":
        a.textContent = `${E("EIDOLON.CriteriaSwitcher.Error", "Error")}: ${i}`;
        break;
      case "ready":
      default:
        a.textContent = `${E("EIDOLON.CriteriaSwitcher.Ready", "Ready")}: ${S(this, le, Vs).call(this)}`;
        break;
    }
}, "#setStatus"), Vs = /* @__PURE__ */ c(function() {
  return f(this, ot).length ? `[${f(this, ot).map((n) => {
    var i;
    return ((i = f(this, st)) == null ? void 0 : i[n.key]) ?? n.default;
  }).join(" | ")}]` : "-";
}, "#formatStateSummary"), c(ht, "CriteriaSwitcherApplication"), pe(ht, "APP_ID", `${ie}-criteria-switcher`), pe(ht, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  _e(ht, ht, "DEFAULT_OPTIONS"),
  {
    id: ht.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((fu = _e(ht, ht, "DEFAULT_OPTIONS")) == null ? void 0 : fu.classes) ?? [], "eidolon-criteria-switcher-window", "themed"])
    ),
    tag: "section",
    window: {
      title: E("EIDOLON.CriteriaSwitcher.Title", "Criteria Switcher"),
      icon: "fa-solid fa-sliders",
      resizable: !1
    },
    position: {
      width: 420,
      height: "auto"
    }
  },
  { inplace: !1 }
)), pe(ht, "PARTS", {
  content: {
    template: `modules/${ie}/templates/criteria-switcher.html`
  }
});
let js = ht;
const Eg = Eo(js);
let ei = null;
function Sg(t) {
  var e;
  return t ?? ((e = game.scenes) == null ? void 0 : e.viewed) ?? null;
}
c(Sg, "resolveScene");
function Tg(t) {
  var e;
  return !!(t != null && t.rendered && ((e = t == null ? void 0 : t.element) != null && e.isConnected));
}
c(Tg, "isRendered");
function Oo() {
  return Tg(ei) ? ei : (ei = null, null);
}
c(Oo, "getCriteriaSwitcher");
function Id(t) {
  var i, r, a, o, s;
  const e = Sg(t);
  if (!e)
    return (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "No active scene to open the criteria switcher."), null;
  if (!Co(e))
    return (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, "You do not have permission to manage scene criteria."), null;
  const n = Oo();
  return n ? (n.setScene(e), n.render({ force: !0 }), (s = n.bringToFront) == null || s.call(n), n) : (ei = Eg({ scene: e }), ei.render({ force: !0 }), ei);
}
c(Id, "openCriteriaSwitcher");
function Od() {
  const t = Oo();
  t && (t.close(), ei = null);
}
c(Od, "closeCriteriaSwitcher");
function jl(t) {
  return Oo() ? (Od(), null) : Id(t);
}
c(jl, "toggleCriteriaSwitcher");
const Cg = {
  SCHEMA_VERSION: xl,
  applyState: vd,
  getState: mg,
  getVersion: hg,
  setVersion: wd,
  getCriteria(t) {
    var e;
    return ut(t ?? ((e = game.scenes) == null ? void 0 : e.viewed));
  },
  setCriteria(t, e) {
    var n;
    return To(e ?? ((n = game.scenes) == null ? void 0 : n.viewed), t);
  },
  updateTiles: ud,
  updatePlaceables: bd,
  indexScene: wg,
  openCriteriaSwitcher: Id,
  closeCriteriaSwitcher: Od,
  toggleCriteriaSwitcher: jl,
  findBestMatch: Mm,
  findFileIndex: Nm,
  resolveRules: od
};
function Lg(t) {
  if (!(t instanceof HTMLElement)) return null;
  const e = [
    "nav.sheet-tabs[data-group]",
    "nav.tabs[data-group]",
    "nav.sheet-tabs",
    "nav.tabs"
  ];
  for (const n of e) {
    const i = t.querySelector(n);
    if (i instanceof HTMLElement) return i;
  }
  return null;
}
c(Lg, "findTabNav");
function Ig(t, e) {
  var i, r, a;
  return t instanceof HTMLElement ? [
    (i = t.querySelector(".tab[data-tab]")) == null ? void 0 : i.parentElement,
    t.querySelector(".sheet-body"),
    (a = (r = e == null ? void 0 : e.parentElement) == null ? void 0 : r.querySelector) == null ? void 0 : a.call(r, ":scope > .sheet-body"),
    e == null ? void 0 : e.parentElement
  ].find((o) => o instanceof HTMLElement) ?? null : null;
}
c(Ig, "findTabBody");
function Og(t, e) {
  var n, i, r, a, o, s, l;
  return ((n = t == null ? void 0 : t.dataset) == null ? void 0 : n.group) ?? ((a = (r = (i = t == null ? void 0 : t.querySelector) == null ? void 0 : i.call(t, "[data-group]")) == null ? void 0 : r.dataset) == null ? void 0 : a.group) ?? ((l = (s = (o = e == null ? void 0 : e.querySelector) == null ? void 0 : o.call(e, ".tab[data-group]")) == null ? void 0 : s.dataset) == null ? void 0 : l.group) ?? "main";
}
c(Og, "getTabGroup");
function Ag(t, e, n) {
  if (!(t instanceof HTMLElement)) return;
  t.textContent = "";
  const i = document.createElement("i");
  i.className = n, i.setAttribute("inert", ""), t.append(i, " ");
  const r = document.createElement("span");
  r.textContent = e, t.append(r);
}
c(Ag, "setTabButtonContent");
function Mg(t, e, n) {
  const i = t.querySelector("[data-tab]"), r = (i == null ? void 0 : i.tagName) || "A", a = document.createElement(r);
  return i instanceof HTMLElement && (a.className = i.className), a.classList.remove("active"), r === "BUTTON" && (a.type = "button"), a.dataset.action = "tab", a.dataset.tab = n, a.dataset.group = e, a.setAttribute("aria-selected", "false"), a.setAttribute("aria-pressed", "false"), a;
}
c(Mg, "createTabButton");
function Ng(t, e, n) {
  const i = document.createElement("div");
  i.classList.add("tab"), i.dataset.tab = n, i.dataset.group = e, i.dataset.applicationPart = n, i.setAttribute("hidden", "true");
  const r = Wu(t);
  return t.insertBefore(i, r ?? null), i;
}
c(Ng, "createTabPanel");
function Ko(t, e, n, i, r) {
  var s;
  if (!(i instanceof HTMLElement) || !(r instanceof HTMLElement)) return;
  const a = (s = t == null ? void 0 : t.tabGroups) == null ? void 0 : s[e];
  if (typeof a == "string" ? a === n : i.classList.contains("active") || r.classList.contains("active")) {
    i.classList.add("active"), i.setAttribute("aria-selected", "true"), i.setAttribute("aria-pressed", "true"), r.classList.add("active"), r.removeAttribute("hidden"), r.removeAttribute("aria-hidden");
    return;
  }
  i.classList.remove("active"), i.setAttribute("aria-selected", "false"), i.setAttribute("aria-pressed", "false"), r.classList.remove("active"), r.setAttribute("hidden", "true");
}
c(Ko, "syncTabVisibility");
function Ad(t, e, n, i, r) {
  const a = Lg(e), o = Ig(e, a);
  if (!(a instanceof HTMLElement) || !(o instanceof HTMLElement)) return null;
  const s = Og(a, o);
  let l = a.querySelector(`[data-tab="${n}"]`);
  l instanceof HTMLElement || (l = Mg(a, s, n), a.appendChild(l)), Ag(l, i, r);
  let u = o.querySelector(`.tab[data-tab="${n}"]`);
  u instanceof HTMLElement || (u = Ng(o, s, n));
  const d = `data-eidolon-bound-${n}`;
  return l.hasAttribute(d) || (l.addEventListener("click", () => {
    zu(t, n, s), requestAnimationFrame(() => {
      Ko(t, s, n, l, u);
    });
  }), l.setAttribute(d, "true")), Ko(t, s, n, l, u), requestAnimationFrame(() => {
    Ko(t, s, n, l, u);
  }), kg(t, a), u;
}
c(Ad, "ensureTileConfigTab");
function kg(t, e) {
  !(t != null && t.setPosition) || !(e instanceof HTMLElement) || requestAnimationFrame(() => {
    var a;
    if (e.scrollWidth <= e.clientWidth) return;
    const n = e.scrollWidth - e.clientWidth, i = t.element instanceof HTMLElement ? t.element : (a = t.element) == null ? void 0 : a[0];
    if (!i) return;
    const r = i.offsetWidth || 480;
    t.setPosition({ width: r + n + 16 });
  });
}
c(kg, "fitNavWidth");
function Md(t) {
  var e;
  return ((e = t == null ? void 0 : t.getFlag) == null ? void 0 : e.call(t, "monks-active-tiles", "files")) ?? [];
}
c(Md, "getTileFiles$1");
function $g(t = []) {
  return {
    strategy: "select-one",
    defaultTarget: En(t, 0) ?? { indexHint: 0 },
    variants: [
      {
        criteria: {},
        target: En(t, 0) ?? { indexHint: 0 }
      }
    ]
  };
}
c($g, "createDefaultTileCriteria");
function _g(t, e = {}) {
  var o, s;
  const { allowLegacy: n = !0 } = e, i = Md(t), r = (o = t == null ? void 0 : t.getFlag) == null ? void 0 : o.call(t, ie, Xn);
  if (r) return ii(r, { files: i });
  if (!n) return null;
  const a = (s = t == null ? void 0 : t.getFlag) == null ? void 0 : s.call(t, ie, Qn);
  return a ? ii(a, { files: i }) : null;
}
c(_g, "getTileCriteria");
async function Nc(t, e, n = {}) {
  if (!(t != null && t.setFlag)) return null;
  const {
    strictValidation: i = !0
  } = n, r = Md(t), a = ii(e, { files: r });
  if (!a)
    return typeof t.unsetFlag == "function" ? (await t.unsetFlag(ie, Xn), await t.unsetFlag(ie, Qn)) : (await t.setFlag(ie, Xn, null), await t.setFlag(ie, Qn, null)), null;
  if (i) {
    const o = ld(a, { files: r });
    if (o.errors.length > 0)
      throw new Error(
        `Tile criteria contains ${o.errors.length} conflicting rule pair(s). Resolve clashes before saving.`
      );
  }
  return await t.setFlag(ie, Xn, a), typeof t.unsetFlag == "function" && await t.unsetFlag(ie, Qn), a;
}
c(Nc, "setTileCriteria");
const zs = "__eidolon_any__", Gs = "eidolon-tile-criteria", Dg = "fa-solid fa-sliders", Nd = Symbol.for("eidolon.tileCriteriaUiState"), Ao = ["all", "unmapped", "mapped", "conflicts"];
function Fg(t) {
  const e = t == null ? void 0 : t[Nd];
  return !e || typeof e != "object" ? {
    filterQuery: "",
    filterMode: "all",
    selectedFileIndex: null
  } : {
    filterQuery: typeof e.filterQuery == "string" ? e.filterQuery : "",
    filterMode: Ao.includes(e.filterMode) ? e.filterMode : "all",
    selectedFileIndex: Number.isInteger(e.selectedFileIndex) ? e.selectedFileIndex : null
  };
}
c(Fg, "readUiState");
function Pg(t, e) {
  if (!t || !e) return;
  typeof e.filterQuery == "string" && (t.filterQuery = e.filterQuery), Ao.includes(e.filterMode) && (t.filterMode = e.filterMode), Number.isInteger(e.selectedFileIndex) && t.fileEntries.some((i) => i.index === e.selectedFileIndex) && (t.selectedFileIndex = e.selectedFileIndex);
}
c(Pg, "applyUiState");
function xg(t) {
  const e = t == null ? void 0 : t.app, n = t == null ? void 0 : t.state;
  !e || !n || (e[Nd] = {
    filterQuery: typeof n.filterQuery == "string" ? n.filterQuery : "",
    filterMode: Ao.includes(n.filterMode) ? n.filterMode : "all",
    selectedFileIndex: Number.isInteger(n.selectedFileIndex) ? n.selectedFileIndex : null
  });
}
c(xg, "persistUiState");
function Rg(t) {
  const e = (t == null ? void 0 : t.object) ?? (t == null ? void 0 : t.document) ?? null;
  return !(e != null && e.isEmbedded) || e.documentName !== "Tile" ? null : e;
}
c(Rg, "getTileDocument$1");
function Hg(t) {
  var e;
  return ((e = t == null ? void 0 : t.getFlag) == null ? void 0 : e.call(t, "monks-active-tiles", "files")) ?? [];
}
c(Hg, "getTileFiles");
function qg(t, e) {
  var s;
  const n = (t == null ? void 0 : t.parent) ?? ((s = game.scenes) == null ? void 0 : s.viewed) ?? null, r = ut(n).sort((l, u) => l.order - u.order).map((l) => ({
    key: l.key,
    label: l.label || l.key,
    values: [...l.values ?? []]
  })), a = new Set(r.map((l) => l.key)), o = /* @__PURE__ */ new Map();
  for (const l of (e == null ? void 0 : e.variants) ?? [])
    for (const [u, d] of Object.entries((l == null ? void 0 : l.criteria) ?? {}))
      a.has(u) || (o.has(u) || o.set(u, /* @__PURE__ */ new Set()), typeof d == "string" && d.trim() && o.get(u).add(d.trim()));
  for (const [l, u] of o.entries())
    r.push({
      key: l,
      label: l,
      values: [...u]
    });
  return r;
}
c(qg, "getCriteriaDefinitions");
function jg(t) {
  const e = {
    folders: /* @__PURE__ */ new Map(),
    files: []
  };
  for (const n of t) {
    const r = (n.path || n.label).split("/").filter(Boolean);
    if (!r.length) {
      e.files.push({ entry: n, name: n.label });
      continue;
    }
    const a = r.pop();
    let o = e;
    for (const s of r)
      o.folders.has(s) || o.folders.set(s, {
        folders: /* @__PURE__ */ new Map(),
        files: []
      }), o = o.folders.get(s);
    o.files.push({ entry: n, name: a || n.label });
  }
  return e;
}
c(jg, "buildTree");
function Bg(t, e) {
  const n = [t];
  let i = e;
  for (; i.files.length === 0 && i.folders.size === 1; ) {
    const [r, a] = i.folders.entries().next().value;
    n.push(r), i = a;
  }
  return {
    label: n.join("/"),
    node: i
  };
}
c(Bg, "collapseFolderBranch");
function Ug(t, e) {
  const n = t.rulesByFile.get(e) ?? [], i = [];
  for (const r of n) {
    const a = Object.entries(r.criteria ?? {}).filter(([, s]) => typeof s == "string" && s.trim());
    if (!a.length) {
      i.push("*");
      continue;
    }
    const o = a.map(([s, l]) => `${t.criteriaLabels.get(s) ?? s}: ${l}`).join(" · ");
    i.push(o);
  }
  return i;
}
c(Ug, "getRuleSummariesForFile");
function Ws(t) {
  var y, h;
  const e = Hg(t), n = Rl(e), i = _g(t, { allowLegacy: !0 }) ?? $g(e), r = qg(t, i), a = new Map(r.map((p) => [p.key, p.label])), o = new Map(
    n.map((p) => [
      p.index,
      p.path || p.label
    ])
  ), s = or(i.defaultTarget, e), l = ((y = n[0]) == null ? void 0 : y.index) ?? 0, u = s >= 0 ? s : l, d = new Map(n.map((p) => [p.index, []]));
  let m = 1;
  for (const p of i.variants ?? []) {
    const v = or(p.target, e);
    v < 0 || (d.has(v) || d.set(v, []), d.get(v).push({
      id: m,
      criteria: { ...p.criteria ?? {} }
    }), m += 1);
  }
  const g = n.some((p) => p.index === u) ? u : ((h = n[0]) == null ? void 0 : h.index) ?? null;
  return {
    files: e,
    fileEntries: n,
    criteriaDefinitions: r,
    criteriaLabels: a,
    relativePaths: o,
    defaultIndex: u,
    selectedFileIndex: g,
    filterQuery: "",
    filterMode: "all",
    nextRuleId: m,
    rulesByFile: d,
    status: {
      mode: "ready",
      message: E("EIDOLON.TileCriteria.Ready", "Ready")
    }
  };
}
c(Ws, "buildEditorState");
function Js(t, e) {
  return t.rulesByFile.has(e) || t.rulesByFile.set(e, []), t.rulesByFile.get(e);
}
c(Js, "getRulesForFile");
function Vg(t) {
  return Object.fromEntries(
    Object.entries(t ?? {}).filter(([e, n]) => typeof e == "string" && e && typeof n == "string" && n.trim()).map(([e, n]) => [e, n.trim()])
  );
}
c(Vg, "sanitizeRuleCriteria");
function kd(t) {
  const e = En(t.files, t.defaultIndex);
  if (!e) return null;
  const n = [], i = [];
  for (const [a, o] of t.rulesByFile.entries()) {
    const s = En(t.files, a);
    if (s)
      for (const [l, u] of o.entries()) {
        const d = Vg(u.criteria);
        n.push({
          criteria: d,
          target: { ...s }
        }), i.push({
          fileIndex: a,
          ruleId: u.id,
          rulePosition: l,
          criteria: d
        });
      }
  }
  return n.length || (n.push({
    criteria: {},
    target: { ...e }
  }), i.push({
    fileIndex: t.defaultIndex,
    ruleId: null,
    rulePosition: null,
    criteria: {},
    isFallback: !0
  })), {
    normalized: ii(
      {
        strategy: "select-one",
        defaultTarget: e,
        variants: n
      },
      { files: t.files }
    ),
    sources: i
  };
}
c(kd, "buildTileCriteriaDraft");
function zg(t) {
  var e;
  return ((e = kd(t)) == null ? void 0 : e.normalized) ?? null;
}
c(zg, "exportTileCriteria");
function kc(t) {
  const e = kd(t);
  if (!(e != null && e.normalized))
    return {
      errors: [],
      warnings: [],
      errorFileIndexes: [],
      warningFileIndexes: []
    };
  const n = ld(e.normalized, { files: t.files }), i = /* @__PURE__ */ c((s) => {
    const l = e.sources[s.leftIndex] ?? null, u = e.sources[s.rightIndex] ?? null;
    return {
      ...s,
      leftFileIndex: l == null ? void 0 : l.fileIndex,
      rightFileIndex: u == null ? void 0 : u.fileIndex
    };
  }, "mapConflict"), r = n.errors.map((s) => i(s)), a = n.warnings.map((s) => i(s)), o = /* @__PURE__ */ c((s) => {
    const l = /* @__PURE__ */ new Set();
    for (const u of s)
      Number.isInteger(u.leftFileIndex) && l.add(u.leftFileIndex), Number.isInteger(u.rightFileIndex) && l.add(u.rightFileIndex);
    return [...l];
  }, "toFileIndexes");
  return {
    errors: r,
    warnings: a,
    errorFileIndexes: o(r),
    warningFileIndexes: o(a)
  };
}
c(kc, "analyzeRuleConflicts");
function Wr(t, e = "neutral") {
  const n = document.createElement("span");
  return n.classList.add("eidolon-tile-criteria__badge"), n.dataset.kind = e, n.textContent = t, n;
}
c(Wr, "createBadge");
function Gg(t, e = {}) {
  const n = typeof t == "string" ? t : "", {
    maxLength: i = 42,
    headLength: r = 20,
    tailLength: a = 16
  } = e;
  if (!n || n.length <= i) return n;
  const o = n.slice(0, r).trimEnd(), s = n.slice(-a).trimStart();
  return `${o}...${s}`;
}
c(Gg, "middleEllipsis");
function Wg(t) {
  const e = typeof t == "string" ? t.trim() : "";
  if (!e)
    return {
      error: "",
      matches: /* @__PURE__ */ c(() => !0, "matches")
    };
  let n = e, i = "i";
  if (e.startsWith("/") && e.length > 1) {
    const r = e.lastIndexOf("/");
    r > 0 && (n = e.slice(1, r), i = e.slice(r + 1) || "i");
  }
  i = i.replace(/g/g, "");
  try {
    const r = new RegExp(n, i);
    return {
      error: "",
      matches: /* @__PURE__ */ c((a) => r.test(String(a ?? "")), "matches")
    };
  } catch (r) {
    return {
      error: (r == null ? void 0 : r.message) ?? E("EIDOLON.TileCriteria.InvalidRegex", "Invalid regex."),
      matches: /* @__PURE__ */ c(() => !0, "matches")
    };
  }
}
c(Wg, "createRegexFilter");
function Jg(t, e) {
  const n = document.createElement("select");
  n.dataset.criteriaKey = t.key;
  const i = document.createElement("option");
  i.value = zs, i.textContent = "*", n.appendChild(i);
  const r = new Set(t.values ?? []);
  e && !r.has(e) && r.add(e);
  for (const a of r) {
    const o = document.createElement("option");
    o.value = a, o.textContent = a, n.appendChild(o);
  }
  return n.value = e ?? zs, n;
}
c(Jg, "createCriterionSelect");
function Kg(t, e, n, i) {
  var s;
  const r = document.createElement("div");
  r.classList.add("eidolon-tile-criteria__rule-editor");
  const a = document.createElement("div");
  a.classList.add("eidolon-tile-criteria__rule-grid");
  for (const l of e.criteriaDefinitions) {
    const u = document.createElement("label");
    u.classList.add("eidolon-tile-criteria__rule-field");
    const d = document.createElement("span");
    d.classList.add("eidolon-tile-criteria__criterion-label"), d.textContent = l.label, u.appendChild(d);
    const m = Jg(l, (s = t.criteria) == null ? void 0 : s[l.key]);
    m.addEventListener("change", () => {
      m.value === zs ? delete t.criteria[l.key] : t.criteria[l.key] = m.value, i();
    }), u.appendChild(m), a.appendChild(u);
  }
  r.appendChild(a);
  const o = document.createElement("button");
  return o.type = "button", o.classList.add("control", "ui-control", "eidolon-tile-criteria__rule-remove"), o.textContent = E("EIDOLON.TileCriteria.RemoveRule", "Remove"), o.addEventListener("click", () => {
    const u = Js(e, n).filter((d) => d.id !== t.id);
    e.rulesByFile.set(n, u), i();
  }), r.appendChild(o), r;
}
c(Kg, "renderRuleEditor");
const sa = /* @__PURE__ */ new WeakMap();
function $d(t) {
  return (t == null ? void 0 : t.app) ?? (t == null ? void 0 : t.tile) ?? null;
}
c($d, "getDialogOwner");
function Yg(t) {
  for (const e of t) {
    const n = Dt(e);
    if (n) return n;
    const i = Dt(e == null ? void 0 : e.element);
    if (i) return i;
  }
  return null;
}
c(Yg, "findDialogRoot$1");
function Qg(t, e, n) {
  const i = t.state, r = i.fileEntries.find((p) => p.index === e);
  if (!r) return document.createElement("div");
  const a = document.createElement("section");
  a.classList.add("eidolon-tile-criteria__dialog-content");
  const o = document.createElement("header");
  o.classList.add("eidolon-tile-criteria__editor-header");
  const s = document.createElement("h4");
  s.textContent = i.relativePaths.get(r.index) || r.label, o.appendChild(s);
  const l = document.createElement("p");
  l.classList.add("notes"), l.textContent = `#${r.index + 1} · ${r.path || E("EIDOLON.TileCriteria.UnknownPath", "Unknown path")}`, o.appendChild(l), a.appendChild(o);
  const u = document.createElement("div");
  u.classList.add("eidolon-tile-criteria__editor-controls");
  const d = document.createElement("button");
  d.type = "button", d.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action"), i.defaultIndex === r.index ? (d.textContent = E("EIDOLON.TileCriteria.IsDefault", "Default Target"), d.disabled = !0) : (d.textContent = E("EIDOLON.TileCriteria.SetDefault", "Set As Default"), d.addEventListener("click", () => {
    i.defaultIndex = r.index, Be(t), n();
  })), u.appendChild(d);
  const m = document.createElement("button");
  m.type = "button", m.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action", "secondary"), m.textContent = E("EIDOLON.TileCriteria.ClearFileRules", "Clear File Rules"), m.addEventListener("click", () => {
    i.rulesByFile.set(r.index, []), Be(t), n();
  }), u.appendChild(m), a.appendChild(u);
  const g = document.createElement("div");
  g.classList.add("eidolon-tile-criteria__rule-editors");
  const y = Js(i, r.index);
  if (y.length)
    for (const p of y)
      g.appendChild(
        Kg(p, i, r.index, () => {
          Be(t), n();
        })
      );
  else {
    const p = document.createElement("p");
    p.classList.add("notes"), p.textContent = E(
      "EIDOLON.TileCriteria.NoRulesForFile",
      "No rules map to this file yet. Add one to define when this variant should be active."
    ), g.appendChild(p);
  }
  a.appendChild(g);
  const h = document.createElement("button");
  return h.type = "button", h.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action"), h.textContent = E("EIDOLON.TileCriteria.AddRule", "Add Rule"), h.disabled = !i.criteriaDefinitions.length, h.addEventListener("click", () => {
    Js(i, r.index).push({
      id: i.nextRuleId,
      criteria: {}
    }), i.nextRuleId += 1, Be(t), n();
  }), a.appendChild(h), a;
}
c(Qg, "buildRuleEditorContent");
function Xg(t, e) {
  var m, g, y;
  const n = $d(t);
  if (!n) return;
  const i = sa.get(n);
  if (i) {
    i.controller = t, i.fileIndex = e, (m = i.refresh) == null || m.call(i);
    return;
  }
  const r = {
    controller: t,
    fileIndex: e,
    host: null,
    refresh: null
  };
  sa.set(n, r);
  const a = /* @__PURE__ */ c(() => {
    sa.delete(n);
  }, "closeDialog"), o = /* @__PURE__ */ c(() => {
    r.host instanceof HTMLElement && r.host.replaceChildren(
      Qg(r.controller, r.fileIndex, o)
    );
  }, "refreshDialog");
  r.refresh = o;
  const s = E("EIDOLON.TileCriteria.EditorTitle", "Edit Tile Criteria Rules"), l = '<div class="eidolon-tile-criteria-editor-host"></div>', u = E("EIDOLON.TileCriteria.CloseEditor", "Close"), d = (y = (g = foundry == null ? void 0 : foundry.applications) == null ? void 0 : g.api) == null ? void 0 : y.DialogV2;
  if (typeof (d == null ? void 0 : d.wait) == "function") {
    d.wait({
      window: { title: s },
      content: l,
      buttons: [{ action: "close", label: u, default: !0 }],
      render: /* @__PURE__ */ c((...h) => {
        var b;
        const p = Yg(h), v = (b = p == null ? void 0 : p.querySelector) == null ? void 0 : b.call(p, ".eidolon-tile-criteria-editor-host");
        v instanceof HTMLElement && (r.host = v, o());
      }, "render"),
      close: a,
      rejectClose: !1
    }).catch((h) => {
      console.warn(`${ie} | Rule editor dialog failed`, h), a();
    });
    return;
  }
  a();
}
c(Xg, "openRuleEditorDialog");
function $c(t) {
  var i;
  const e = $d(t);
  if (!e) return;
  const n = sa.get(e);
  (i = n == null ? void 0 : n.refresh) == null || i.call(n);
}
c($c, "refreshOpenRuleEditor");
function Ks(t, e) {
  return (t.rulesByFile.get(e) ?? []).length > 0;
}
c(Ks, "hasRulesForFile");
function _d(t, e) {
  var n, i;
  return ((n = t == null ? void 0 : t.errorFileIndexes) == null ? void 0 : n.includes(e)) || ((i = t == null ? void 0 : t.warningFileIndexes) == null ? void 0 : i.includes(e));
}
c(_d, "hasConflictForFile");
function Zg(t, e, n) {
  switch (t.filterMode) {
    case "unmapped":
      return !Ks(t, e.index);
    case "mapped":
      return Ks(t, e.index);
    case "conflicts":
      return _d(n, e.index);
    case "all":
    default:
      return !0;
  }
}
c(Zg, "matchesFilterMode");
function eh(t, e) {
  let n = 0, i = 0, r = 0;
  for (const a of t.fileEntries)
    Ks(t, a.index) ? n += 1 : i += 1, _d(e, a.index) && (r += 1);
  return {
    all: t.fileEntries.length,
    mapped: n,
    unmapped: i,
    conflicts: r
  };
}
c(eh, "getFilterModeCounts");
function th(t) {
  switch (t) {
    case "unmapped":
      return E("EIDOLON.TileCriteria.FilterModeUnmapped", "Unmapped");
    case "mapped":
      return E("EIDOLON.TileCriteria.FilterModeMapped", "Mapped");
    case "conflicts":
      return E("EIDOLON.TileCriteria.FilterModeConflicts", "Clashes");
    case "all":
    default:
      return E("EIDOLON.TileCriteria.FilterModeAll", "All");
  }
}
c(th, "getFilterModeLabel");
function Dd(t, e, n, i, r) {
  var u, d;
  const a = [...t.folders.keys()].sort((m, g) => m.localeCompare(g));
  for (const m of a) {
    const g = Bg(m, t.folders.get(m)), y = document.createElement("li");
    y.classList.add("eidolon-tile-criteria__tree-branch");
    const h = document.createElement("div");
    h.classList.add("document", "folder", "update", "eidolon-tile-criteria__folder-row");
    const p = document.createElement("i");
    p.classList.add("fa-solid", "fa-folder-open"), h.appendChild(p);
    const v = document.createElement("span");
    v.classList.add("eidolon-tile-criteria__tree-folder-label"), v.textContent = g.label, v.title = g.label, h.appendChild(v), y.appendChild(h);
    const b = document.createElement("ul");
    b.classList.add("eidolon-tile-criteria__tree"), b.dataset.folder = g.label, Dd(g.node, e, n, i, b), b.childElementCount > 0 && y.appendChild(b), r.appendChild(y);
  }
  const o = [...t.files].sort((m, g) => m.name.localeCompare(g.name));
  if (!o.length) return;
  const s = document.createElement("li"), l = document.createElement("ul");
  l.classList.add("document-list", "eidolon-tile-criteria__document-list");
  for (const m of o) {
    const g = m.entry, y = g.index === e.selectedFileIndex, h = g.index === e.defaultIndex, p = Ug(e, g.index), v = document.createElement("li");
    v.classList.add("document", "update", "eidolon-tile-criteria__tree-file");
    const b = document.createElement("button");
    b.type = "button", b.classList.add("eidolon-tile-criteria__file-row");
    const w = (u = i == null ? void 0 : i.errorFileIndexes) == null ? void 0 : u.includes(g.index), C = (d = i == null ? void 0 : i.warningFileIndexes) == null ? void 0 : d.includes(g.index);
    w ? b.classList.add("has-conflict") : C && b.classList.add("has-warning");
    const O = e.relativePaths.get(g.index) || g.path || m.name, A = [O];
    w ? A.push(
      E(
        "EIDOLON.TileCriteria.ConflictFileHint",
        "This file participates in one or more conflicting rules."
      )
    ) : C && A.push(
      E(
        "EIDOLON.TileCriteria.WarningFileHint",
        "This file has potentially redundant rules."
      )
    ), p.length || A.push(
      E(
        "EIDOLON.TileCriteria.UnmappedHint",
        "No criteria rules map to this file."
      )
    ), b.title = A.join(`
`), y && b.classList.add("is-selected"), b.addEventListener("click", () => {
      e.selectedFileIndex = g.index, Be(n), Xg(n, g.index);
    });
    const k = document.createElement("span");
    k.classList.add("eidolon-tile-criteria__indicator"), k.dataset.kind = h ? "default" : p.length ? "mapped" : "unmapped", b.appendChild(k);
    const $ = document.createElement("span");
    $.classList.add("eidolon-tile-criteria__file-content");
    const H = document.createElement("span");
    H.classList.add("eidolon-tile-criteria__file-heading");
    const q = document.createElement("span");
    q.classList.add("eidolon-tile-criteria__file-title"), q.textContent = Gg(m.name || g.label), q.title = O, H.appendChild(q);
    const F = Wr(`#${g.index + 1}`, "meta");
    F.classList.add("eidolon-tile-criteria__index-badge"), H.appendChild(F), $.appendChild(H);
    const D = document.createElement("span");
    D.classList.add("eidolon-tile-criteria__badges"), h && D.appendChild(Wr(E("EIDOLON.TileCriteria.DefaultBadge", "Default"), "default"));
    const N = p.slice(0, 2);
    for (const x of N)
      D.appendChild(Wr(x, "rule"));
    if (p.length > N.length && D.appendChild(Wr(`+${p.length - N.length}`, "meta")), $.appendChild(D), b.appendChild($), w || C) {
      const x = document.createElement("span");
      x.classList.add("eidolon-tile-criteria__row-warning"), x.dataset.mode = w ? "error" : "warning", x.innerHTML = '<i class="fa-solid fa-triangle-exclamation" inert=""></i>', b.appendChild(x);
    }
    v.appendChild(b), l.appendChild(v);
  }
  s.appendChild(l), r.appendChild(s);
}
c(Dd, "renderTreeNode");
function nh(t, e, n, i = {}) {
  const r = document.createElement("section");
  r.classList.add("eidolon-tile-criteria__tree-panel");
  const a = Wg(t.filterQuery), o = eh(t, n);
  t.filterMode !== "all" && o[t.filterMode] === 0 && (t.filterMode = "all");
  const s = document.createElement("div");
  s.classList.add("eidolon-tile-criteria__toolbar");
  const l = document.createElement("div");
  l.classList.add("eidolon-tile-criteria__mode-bar");
  for (const w of Ao) {
    const C = document.createElement("button");
    C.type = "button", C.classList.add("control", "ui-control", "eidolon-tile-criteria__mode-button"), C.dataset.mode = w, C.textContent = th(w);
    const O = w === "all" || o[w] > 0;
    C.disabled = !O, O || (C.dataset.tooltip = E(
      "EIDOLON.TileCriteria.FilterModeUnavailable",
      "No entries currently match this filter."
    ), C.title = C.dataset.tooltip), t.filterMode === w ? (C.classList.add("is-active"), C.setAttribute("aria-pressed", "true")) : C.setAttribute("aria-pressed", "false"), C.addEventListener("click", () => {
      t.filterMode !== w && (t.filterMode = w, Be(e));
    }), l.appendChild(C);
  }
  s.appendChild(l);
  const u = document.createElement("div");
  u.classList.add("eidolon-tile-criteria__filter-row");
  const d = document.createElement("input");
  d.type = "text", d.classList.add("eidolon-tile-criteria__filter-input"), d.placeholder = E("EIDOLON.TileCriteria.FilterPlaceholder", "Regex filter (path)"), d.value = t.filterQuery, d.autocomplete = "off", d.addEventListener("keydown", (w) => {
    w.stopPropagation(), w.key === "Enter" && w.preventDefault();
  }), d.addEventListener("keyup", (w) => {
    w.stopPropagation();
  }), d.addEventListener("change", (w) => {
    w.stopPropagation();
  }), d.addEventListener("input", (w) => {
    w.stopPropagation();
    const C = d.selectionStart ?? d.value.length, O = d.selectionEnd ?? C;
    t.filterQuery = d.value, Be(e), requestAnimationFrame(() => {
      const A = e.section.querySelector(".eidolon-tile-criteria__filter-input");
      if (A instanceof HTMLInputElement) {
        A.focus();
        try {
          A.setSelectionRange(C, O);
        } catch {
        }
      }
    });
  }), u.appendChild(d);
  const m = document.createElement("div");
  m.classList.add("eidolon-tile-criteria__toolbar-actions");
  const g = document.createElement("button");
  g.type = "button";
  const y = E("EIDOLON.TileCriteria.Save", "Save Rules");
  g.classList.add("control", "ui-control", "eidolon-tile-criteria__toolbar-action", "icon-only"), g.dataset.tooltip = y, g.setAttribute("aria-label", y), g.title = y, g.innerHTML = '<i class="fa-solid fa-floppy-disk" inert=""></i>', g.disabled = n.errors.length > 0, g.addEventListener("click", () => {
    var w;
    (w = i.onSave) == null || w.call(i);
  }), m.appendChild(g);
  const h = document.createElement("button");
  h.type = "button";
  const p = E("EIDOLON.TileCriteria.Clear", "Clear Rules");
  if (h.classList.add("control", "ui-control", "secondary", "eidolon-tile-criteria__toolbar-action", "icon-only"), h.dataset.tooltip = p, h.setAttribute("aria-label", p), h.title = p, h.innerHTML = '<i class="fa-solid fa-trash" inert=""></i>', h.addEventListener("click", () => {
    var w;
    (w = i.onClear) == null || w.call(i);
  }), m.appendChild(h), u.appendChild(m), s.appendChild(u), r.appendChild(s), a.error) {
    const w = document.createElement("p");
    w.classList.add("notes", "eidolon-tile-criteria__filter-error"), w.textContent = `${E("EIDOLON.TileCriteria.InvalidRegex", "Invalid regex")}: ${a.error}`, r.appendChild(w);
  }
  const v = document.createElement("div");
  v.classList.add("eidolon-tile-criteria__library-tree");
  const b = t.fileEntries.filter((w) => {
    const C = t.relativePaths.get(w.index) || w.path || w.label;
    return Zg(t, w, n) && a.matches(C);
  });
  if (t.fileEntries.length)
    if (b.length) {
      const w = document.createElement("ul");
      w.classList.add("eidolon-tile-criteria__tree"), Dd(jg(b), t, e, n, w), v.appendChild(w);
    } else {
      const w = document.createElement("p");
      w.classList.add("notes"), w.textContent = E("EIDOLON.TileCriteria.NoMatches", "No variants match this filter."), v.appendChild(w);
    }
  else {
    const w = document.createElement("p");
    w.classList.add("notes"), w.textContent = E("EIDOLON.TileCriteria.NoVariants", "No MATT variants found"), v.appendChild(w);
  }
  return r.appendChild(v), r;
}
c(nh, "renderTreePanel");
function Be(t) {
  const { section: e, state: n } = t, i = kc(n);
  xg(t), e.replaceChildren();
  const r = /* @__PURE__ */ c(async () => {
    try {
      const o = kc(n);
      if (o.errors.length) {
        n.status = {
          mode: "error",
          message: E(
            "EIDOLON.TileCriteria.ConflictSaveBlocked",
            `Resolve ${o.errors.length} conflict(s) before saving tile criteria rules.`
          )
        }, Be(t);
        return;
      }
      const s = zg(n);
      if (!s) {
        n.status = {
          mode: "error",
          message: E("EIDOLON.TileCriteria.Invalid", "Invalid rules. Select valid target variants.")
        }, Be(t);
        return;
      }
      await Nc(t.tile, s);
      const l = n.filterQuery, u = n.filterMode, d = n.selectedFileIndex;
      t.state = Ws(t.tile), t.state.filterQuery = l, t.state.filterMode = u, Number.isInteger(d) && (t.state.selectedFileIndex = d), t.state.status = {
        mode: "ready",
        message: E("EIDOLON.TileCriteria.Saved", "Tile criteria rules saved.")
      }, Be(t), $c(t);
    } catch (o) {
      console.error(`${ie} | Failed to save tile criteria`, o), n.status = {
        mode: "error",
        message: (o == null ? void 0 : o.message) ?? "Failed to save tile criteria rules."
      }, Be(t);
    }
  }, "handleSave"), a = /* @__PURE__ */ c(async () => {
    try {
      await Nc(t.tile, null);
      const o = n.filterQuery, s = n.filterMode, l = n.selectedFileIndex;
      t.state = Ws(t.tile), t.state.filterQuery = o, t.state.filterMode = s, Number.isInteger(l) && (t.state.selectedFileIndex = l), t.state.status = {
        mode: "ready",
        message: E("EIDOLON.TileCriteria.Cleared", "Tile criteria rules cleared.")
      }, Be(t), $c(t);
    } catch (o) {
      console.error(`${ie} | Failed to clear tile criteria`, o), n.status = {
        mode: "error",
        message: (o == null ? void 0 : o.message) ?? "Failed to clear tile criteria rules."
      }, Be(t);
    }
  }, "handleClear");
  if (e.appendChild(nh(n, t, i, {
    onSave: r,
    onClear: a
  })), i.errors.length || i.warnings.length) {
    const o = document.createElement("section");
    o.classList.add("eidolon-tile-criteria__conflicts");
    const s = document.createElement("p");
    s.classList.add("eidolon-tile-criteria__conflict-summary", "notes"), i.errors.length ? (s.dataset.mode = "error", s.textContent = E(
      "EIDOLON.TileCriteria.ConflictSummary",
      `${i.errors.length} conflict(s) must be resolved before saving${i.warnings.length ? ` (${i.warnings.length} warning(s))` : ""}.`
    )) : (s.dataset.mode = "warning", s.textContent = E(
      "EIDOLON.TileCriteria.WarningSummary",
      `${i.warnings.length} potential issue(s) detected.`
    )), o.appendChild(s);
    const l = document.createElement("p");
    l.classList.add("eidolon-tile-criteria__conflict-hint", "notes"), l.textContent = E(
      "EIDOLON.TileCriteria.ConflictHint",
      "Files involved in clashes are marked in red with a warning icon."
    ), o.appendChild(l), e.appendChild(o);
  }
  if (n.status.mode === "error" || n.status.mode === "warning") {
    const o = document.createElement("p");
    o.classList.add("eidolon-tile-criteria__status", "notes"), o.dataset.mode = n.status.mode, o.textContent = n.status.message, e.appendChild(o);
  }
}
c(Be, "renderController");
function ih(t, e = null) {
  const n = document.createElement("section");
  n.classList.add("eidolon-tile-criteria");
  const i = Ws(t);
  Pg(i, Fg(e));
  const r = {
    app: e,
    tile: t,
    section: n,
    state: i
  };
  return Be(r), r;
}
c(ih, "createController");
function rh(t, e) {
  return Ad(
    t,
    e,
    Gs,
    E("EIDOLON.TileCriteria.TabLabel", "Criteria"),
    Dg
  );
}
c(rh, "ensureTileCriteriaTab");
function ah() {
  Hooks.on("renderTileConfig", (t, e) => {
    var l, u, d, m;
    const n = Dt(e);
    if (!n) return;
    const i = Rg(t);
    if (!i) return;
    if ((l = n.querySelector(".eidolon-tile-criteria")) == null || l.remove(), !So()) {
      (u = n.querySelector(`.item[data-tab='${Gs}']`)) == null || u.remove(), (d = n.querySelector(`.tab[data-tab='${Gs}']`)) == null || d.remove();
      return;
    }
    const r = ih(i, t), a = rh(t, n);
    if (a instanceof HTMLElement) {
      a.replaceChildren(r.section), (m = t.setPosition) == null || m.call(t, { height: "auto" });
      return;
    }
    const o = (t == null ? void 0 : t.form) instanceof HTMLFormElement ? t.form : n instanceof HTMLFormElement ? n : n.querySelector("form");
    if (!(o instanceof HTMLFormElement)) return;
    const s = o.querySelector("button[type='submit']");
    s != null && s.parentElement ? s.parentElement.insertAdjacentElement("beforebegin", r.section) : o.appendChild(r.section);
  });
}
c(ah, "registerTileCriteriaConfigControls");
function oh(t) {
  if (Array.isArray(t)) return t;
  if (t instanceof Map) return Array.from(t.values());
  if (t && typeof t == "object") {
    if (typeof t.values == "function")
      try {
        const e = Array.from(t.values());
        if (e.length > 0) return e;
      } catch {
      }
    return Object.values(t);
  }
  return [];
}
c(oh, "toList");
function sh(t, e) {
  const n = t == null ? void 0 : t.tools;
  return Array.isArray(n) ? n.some((i) => (i == null ? void 0 : i.name) === e) : n instanceof Map ? n.has(e) : n && typeof n == "object" ? e in n ? !0 : Object.values(n).some((i) => (i == null ? void 0 : i.name) === e) : !1;
}
c(sh, "hasTool");
function lh(t, e) {
  if (Array.isArray(t.tools)) {
    t.tools.push(e);
    return;
  }
  if (t.tools instanceof Map) {
    t.tools.set(e.name, e);
    return;
  }
  if (t.tools && typeof t.tools == "object") {
    t.tools[e.name] = e;
    return;
  }
  t.tools = [e];
}
c(lh, "addTool");
function ch() {
  Hooks.on("getSceneControlButtons", (t) => {
    var i;
    const e = oh(t);
    if (!e.length) return;
    const n = e.find((r) => (r == null ? void 0 : r.name) === "tiles") ?? e.find((r) => (r == null ? void 0 : r.name) === "tokens" || (r == null ? void 0 : r.name) === "token") ?? e[0];
    n && (sh(n, "eidolonCriteriaSwitcher") || lh(n, {
      name: "eidolonCriteriaSwitcher",
      title: "Criteria Switcher",
      icon: "fa-solid fa-sliders",
      button: !0,
      toggle: !1,
      visible: Co(((i = game.scenes) == null ? void 0 : i.viewed) ?? null),
      onClick: /* @__PURE__ */ c(() => jl(), "onClick")
    }));
  });
}
c(ch, "registerSceneControlButton");
function Jr(t, e) {
  if (!t || typeof t != "object") return !1;
  const n = String(e).split(".");
  let i = t;
  for (const r of n) {
    if (!i || typeof i != "object" || !Object.prototype.hasOwnProperty.call(i, r)) return !1;
    i = i[r];
  }
  return !0;
}
c(Jr, "hasOwnPath");
function uh() {
  const t = /* @__PURE__ */ c((i, r = null) => {
    i && Xm(i, r);
  }, "invalidateTileScene"), e = /* @__PURE__ */ c((i, r = null) => {
    i && fg(i, r);
  }, "invalidatePlaceableScene");
  Hooks.on("createTile", (i) => {
    t((i == null ? void 0 : i.parent) ?? null, i ?? null);
  }), Hooks.on("deleteTile", (i) => {
    t((i == null ? void 0 : i.parent) ?? null, i ?? null);
  }), Hooks.on("updateTile", (i, r) => {
    (Jr(r, `flags.${ie}.tileCriteria`) || Jr(r, `flags.${ie}.fileIndex`)) && t((i == null ? void 0 : i.parent) ?? null, i ?? null);
  });
  const n = /* @__PURE__ */ c((i) => {
    Hooks.on(`create${i}`, (r) => {
      e((r == null ? void 0 : r.parent) ?? null, r ?? null);
    }), Hooks.on(`delete${i}`, (r) => {
      e((r == null ? void 0 : r.parent) ?? null, r ?? null);
    }), Hooks.on(`update${i}`, (r, a) => {
      const o = Jr(a, `flags.${ie}.presets`), s = i === "AmbientLight" && Jr(a, `flags.${ie}.lightCriteria`);
      !o && !s || e((r == null ? void 0 : r.parent) ?? null, r ?? null);
    });
  }, "registerPlaceableHooks");
  n("AmbientLight"), n("Wall"), n("AmbientSound"), Hooks.on("canvasReady", (i) => {
    const r = (i == null ? void 0 : i.scene) ?? null;
    r && (t(r), e(r));
  });
}
c(uh, "registerCriteriaCacheInvalidationHooks");
function dh() {
  ch(), ah(), uh(), Hooks.once("init", () => {
    var t, e;
    (e = (t = game.keybindings) == null ? void 0 : t.register) == null || e.call(t, ie, "toggleCriteriaSwitcher", {
      name: "Toggle Criteria Switcher",
      hint: "Open or close the criteria switcher window for live scene state updates.",
      editable: [{ key: "KeyM", modifiers: ["Alt"] }],
      onDown: /* @__PURE__ */ c(() => {
        var n, i, r;
        return Co(((n = game.scenes) == null ? void 0 : n.viewed) ?? null) ? (jl(), !0) : ((r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "You do not have permission to manage scene criteria."), !0);
      }, "onDown"),
      restricted: !0,
      precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
    });
  }), Hooks.on("canvasReady", (t) => {
    var n;
    const e = Oo();
    e && (e.setScene((t == null ? void 0 : t.scene) ?? ((n = game.scenes) == null ? void 0 : n.viewed) ?? null), e.render({ force: !0 }));
  }), Hooks.once("ready", () => {
    var e, n;
    const t = (n = (e = game.modules) == null ? void 0 : e.get) == null ? void 0 : n.call(e, ie);
    t && (t.api || (t.api = {}), t.api.criteria = Cg, console.log(`${ie} | Criteria engine API registered`));
  });
}
c(dh, "registerCriteriaEngineHooks");
dh();
const la = /* @__PURE__ */ new WeakMap(), Kr = /* @__PURE__ */ new WeakMap(), he = "__eidolon_default__";
function fh() {
  Hooks.on("renderAmbientLightConfig", mh), M("LightCriteria | AmbientLightConfig controls registered");
}
c(fh, "registerAmbientLightCriteriaControls");
function mh(t, e) {
  var n;
  Ni("LightCriteria | renderAmbientLightConfig", {
    appId: (t == null ? void 0 : t.id) ?? null,
    constructor: ((n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) ?? null,
    isRendered: (t == null ? void 0 : t.rendered) ?? !1
  });
  try {
    const i = Dt(e);
    if (!i) return;
    if (!So()) {
      i.querySelectorAll(".eidolon-light-criteria, .eidolon-light-criteria-main-switcher").forEach((r) => r.remove());
      return;
    }
    gh(t, i);
  } catch (i) {
    console.error("eidolon-utilities | Failed to enhance AmbientLightConfig UI", i);
  } finally {
    pn();
  }
}
c(mh, "handleAmbientLightConfigRender");
function gh(t, e) {
  var Ae, Mn, Hi, qr, ac;
  const n = (t == null ? void 0 : t.form) instanceof HTMLFormElement ? t.form : e instanceof HTMLFormElement ? e : (Ae = e == null ? void 0 : e.closest) == null ? void 0 : Ae.call(e, "form");
  if (!(n instanceof HTMLFormElement)) return;
  const i = n.querySelector(".window-content");
  if (!(i instanceof HTMLElement)) return;
  const r = Pd(t);
  if (!r) return;
  const a = Ph(r);
  M("LightCriteria | Resolved ambient light", {
    sheetId: (r == null ? void 0 : r.id) ?? null,
    persistedId: (a == null ? void 0 : a.id) ?? null,
    sameRef: r === a
  });
  const o = (a == null ? void 0 : a.parent) ?? r.parent ?? null, s = o ? vm(o) : [], l = s.filter(
    (_) => Array.isArray(_ == null ? void 0 : _.values) && _.values.length > 0
  ), u = Ih(s), d = s.map((_) => typeof (_ == null ? void 0 : _.id) == "string" ? _.id : null).filter((_) => !!_), m = a ?? r, g = o ? ut(o) : [];
  let y = fd(m);
  const h = ig(y, g);
  JSON.stringify(h) !== JSON.stringify(y) && (y = h, md(m, h).catch((_) => {
    console.warn("eidolon-utilities | Failed to persist migrated light criteria keys", _);
  })), M("LightCriteria | Loaded mapping state", {
    hasBase: !!(y != null && y.base),
    mappingCount: Array.isArray(y == null ? void 0 : y.mappings) ? y.mappings.length : 0,
    mappings: Array.isArray(y == null ? void 0 : y.mappings) ? y.mappings.map((_) => {
      var z, Z;
      return {
        id: _.id,
        key: _.key,
        hasColor: !!((Z = (z = _.config) == null ? void 0 : z.config) != null && Z.color)
      };
    }) : []
  });
  const p = i.querySelector(".eidolon-light-criteria");
  p && p.remove(), i.querySelectorAll(".eidolon-light-criteria-main-switcher").forEach((_) => _.remove());
  const v = document.createElement("fieldset");
  v.classList.add("eidolon-light-criteria");
  const b = document.createElement("legend");
  b.textContent = E("EIDOLON.LightCriteria.Legend", "Scene Criteria Lighting"), v.appendChild(b);
  const w = document.createElement("p");
  w.classList.add("notes"), w.textContent = E(
    "EIDOLON.LightCriteria.Description",
    "Capture a base lighting state, then map criteria values to lighting configurations."
  ), v.appendChild(w);
  const C = document.createElement("div");
  C.classList.add("eidolon-light-criteria__controls");
  const O = document.createElement("button");
  O.type = "button", O.dataset.action = "make-default", O.classList.add("eidolon-light-criteria__button"), O.textContent = E(
    "EIDOLON.LightCriteria.SetBase",
    "Set Base"
  ), C.appendChild(O);
  const A = document.createElement("button");
  A.type = "button", A.dataset.action = "create-mapping", A.classList.add("eidolon-light-criteria__button"), A.textContent = E(
    "EIDOLON.LightCriteria.CreateMapping",
    "Add Criteria Mapping"
  ), A.setAttribute("aria-expanded", "false"), C.appendChild(A), v.appendChild(C);
  const k = document.createElement("p");
  k.classList.add("notes", "eidolon-light-criteria__status"), v.appendChild(k);
  const $ = document.createElement("div");
  $.classList.add("eidolon-light-criteria__switcher");
  const H = document.createElement("label");
  H.classList.add("eidolon-light-criteria__switcher-label");
  const q = `${(t == null ? void 0 : t.id) ?? (r == null ? void 0 : r.id) ?? "eidolon-light"}-mapping-select`;
  H.htmlFor = q, H.textContent = E("EIDOLON.LightCriteria.SelectLabel", "Criteria Mapping"), $.appendChild(H);
  const F = document.createElement("details");
  F.classList.add("eidolon-light-criteria__filter-details");
  const D = document.createElement("summary");
  D.classList.add("eidolon-light-criteria__filter-summary");
  const N = document.createElement("span");
  N.classList.add("eidolon-light-criteria__filter-summary-label"), N.textContent = E(
    "EIDOLON.LightCriteria.FilterHeading",
    "Filter mappings"
  ), D.appendChild(N);
  const x = document.createElement("span");
  x.classList.add("eidolon-light-criteria__filter-meta"), D.appendChild(x), F.appendChild(D);
  const B = document.createElement("div");
  B.classList.add("eidolon-light-criteria__filter-panel");
  const W = document.createElement("div");
  W.classList.add("eidolon-light-criteria__filter-grid");
  for (const _ of l) {
    const z = document.createElement("label");
    z.classList.add("eidolon-light-criteria__filter");
    const Z = document.createElement("span");
    Z.classList.add("eidolon-light-criteria__filter-name"), Z.textContent = (Hi = (Mn = _.name) == null ? void 0 : Mn.trim) != null && Hi.call(Mn) ? _.name.trim() : E("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), z.appendChild(Z);
    const ee = document.createElement("select");
    ee.dataset.filterCategoryId = _.id, ee.classList.add("eidolon-light-criteria__filter-select");
    const ne = document.createElement("option");
    ne.value = "", ne.textContent = E("EIDOLON.LightCriteria.FilterAny", "Any"), ee.appendChild(ne);
    for (const ce of _.values) {
      const ue = document.createElement("option");
      ue.value = ce, ue.textContent = ce, ee.appendChild(ue);
    }
    z.appendChild(ee), W.appendChild(z);
  }
  B.appendChild(W);
  const R = document.createElement("div");
  R.classList.add("eidolon-light-criteria__filter-actions");
  const U = document.createElement("button");
  U.type = "button", U.dataset.action = "clear-mapping-filters", U.classList.add("eidolon-light-criteria__button", "secondary", "compact"), U.textContent = E("EIDOLON.LightCriteria.ClearFilters", "Clear Filters"), R.appendChild(U), B.appendChild(R), F.appendChild(B), F.hidden = l.length === 0, $.appendChild(F);
  const K = document.createElement("div");
  K.classList.add("eidolon-light-criteria__switcher-controls"), $.appendChild(K);
  const ae = document.createElement("select");
  ae.id = q, ae.classList.add("eidolon-light-criteria__select"), ae.dataset.action = "select-mapping", K.appendChild(ae);
  const X = document.createElement("button");
  X.type = "button", X.dataset.action = "apply-selected-mapping", X.classList.add("eidolon-light-criteria__button", "secondary"), X.textContent = E("EIDOLON.LightCriteria.ApplyButton", "Apply"), K.appendChild(X);
  const te = document.createElement("details");
  te.classList.add("eidolon-light-criteria__menu"), te.dataset.action = "mapping-actions-menu";
  const Pt = document.createElement("summary");
  Pt.classList.add("eidolon-light-criteria__menu-toggle"), Pt.innerHTML = '<i class="fa-solid fa-ellipsis-vertical" inert=""></i>', Pt.setAttribute(
    "aria-label",
    E("EIDOLON.LightCriteria.MoreActions", "More actions")
  ), Pt.dataset.tooltip = E("EIDOLON.LightCriteria.MoreActions", "More actions"), te.appendChild(Pt);
  const dt = document.createElement("div");
  dt.classList.add("eidolon-light-criteria__menu-list"), te.appendChild(dt);
  const $e = document.createElement("button");
  $e.type = "button", $e.dataset.action = "update-selected-mapping", $e.classList.add("eidolon-light-criteria__menu-item"), $e.textContent = E(
    "EIDOLON.LightCriteria.UpdateSelected",
    "Save current config to selected"
  ), dt.appendChild($e);
  const Ze = document.createElement("button");
  Ze.type = "button", Ze.dataset.action = "edit-selected-mapping-criteria", Ze.classList.add("eidolon-light-criteria__menu-item"), Ze.textContent = E(
    "EIDOLON.LightCriteria.EditSelectedCriteria",
    "Edit selected mapping criteria"
  ), dt.appendChild(Ze);
  const et = document.createElement("button");
  et.type = "button", et.dataset.action = "remove-selected-mapping", et.classList.add("eidolon-light-criteria__menu-item", "danger"), et.textContent = E(
    "EIDOLON.LightCriteria.RemoveSelected",
    "Delete selected mapping"
  ), dt.appendChild(et), K.appendChild(te);
  const xt = document.createElement("div");
  xt.classList.add("eidolon-light-criteria-main-switcher"), xt.appendChild($);
  const ze = document.createElement("p");
  if (ze.classList.add("notes", "eidolon-light-criteria-main-switcher__empty"), ze.textContent = E(
    "EIDOLON.LightCriteria.ActiveRequiresBase",
    "Set Base Lighting to enable mapping selection and actions."
  ), xt.appendChild(ze), s.length === 0) {
    const _ = document.createElement("p");
    _.classList.add("notification", "warning", "eidolon-light-criteria__warning"), _.textContent = E(
      "EIDOLON.LightCriteria.NoCategoriesWarning",
      "This scene has no criteria configured. Add criteria under Scene -> Criteria to enable criteria-driven lighting."
    ), v.appendChild(_);
  } else if (l.length === 0) {
    const _ = document.createElement("p");
    _.classList.add("notification", "warning", "eidolon-light-criteria__warning"), _.textContent = E(
      "EIDOLON.LightCriteria.NoValuesWarning",
      "Criteria exist, but none define selectable values. Add values in Scene -> Criteria."
    ), v.appendChild(_);
  }
  const Te = document.createElement("div");
  Te.classList.add("eidolon-light-criteria__creation"), Te.dataset.section = "creation", Te.hidden = !0;
  const si = document.createElement("p");
  si.classList.add("notes"), si.textContent = E(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ), Te.appendChild(si);
  const Rt = document.createElement("div");
  Rt.classList.add("eidolon-light-criteria__category-list"), Te.appendChild(Rt);
  for (const _ of l) {
    const z = document.createElement("label");
    z.classList.add("eidolon-light-criteria__category");
    const Z = document.createElement("span");
    Z.classList.add("eidolon-light-criteria__category-name"), Z.textContent = (ac = (qr = _.name) == null ? void 0 : qr.trim) != null && ac.call(qr) ? _.name.trim() : E("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), z.appendChild(Z);
    const ee = document.createElement("select");
    ee.dataset.categoryId = _.id, ee.classList.add("eidolon-light-criteria__category-select");
    const ne = document.createElement("option");
    ne.value = "", ne.textContent = E(
      "EIDOLON.LightCriteria.IgnoreCategory",
      "Ignore"
    ), ee.appendChild(ne);
    for (const ce of _.values) {
      const ue = document.createElement("option");
      ue.value = ce, ue.textContent = ce, ee.appendChild(ue);
    }
    z.appendChild(ee), Rt.appendChild(z);
  }
  const An = document.createElement("div");
  An.classList.add("eidolon-light-criteria__creation-actions");
  const tt = document.createElement("button");
  tt.type = "button", tt.dataset.action = "save-mapping", tt.classList.add("eidolon-light-criteria__button", "primary"), tt.textContent = E(
    "EIDOLON.LightCriteria.SaveMapping",
    "Save Mapping"
  ), An.appendChild(tt);
  const Ht = document.createElement("button");
  Ht.type = "button", Ht.dataset.action = "cancel-create", Ht.classList.add("eidolon-light-criteria__button", "secondary"), Ht.textContent = E(
    "EIDOLON.LightCriteria.Cancel",
    "Cancel"
  ), An.appendChild(Ht), Te.appendChild(An), v.appendChild(Te), i.prepend(xt), i.appendChild(v), v.hidden = !0, yh(t, {
    fieldset: v,
    homeContainer: i
  }), requestAnimationFrame(() => {
    var _;
    (_ = t.setPosition) == null || _.call(t, { height: "auto" });
  });
  let P = y;
  $n({ switcher: $, emptyState: ze, state: P }), kn(k, P), Ui(A, {
    state: P,
    hasCategories: l.length > 0
  }), M("LightCriteria | Controls injected", {
    sceneId: (o == null ? void 0 : o.id) ?? null,
    lightId: (r == null ? void 0 : r.id) ?? null,
    hasBase: !!(P != null && P.base),
    mappingCount: Array.isArray(P == null ? void 0 : P.mappings) ? P.mappings.length : 0,
    categories: l.length
  });
  const Rr = $h(P), Q = {
    restoreConfig: null,
    app: t,
    selectedMapping: Rr,
    editorMode: "create",
    editingMappingId: null,
    mappingFilters: {}
  };
  la.set(v, Q);
  const ft = /* @__PURE__ */ c(() => {
    te.open = !1;
  }, "closeActionsMenu");
  Pt.addEventListener("click", (_) => {
    te.classList.contains("is-disabled") && (_.preventDefault(), ft());
  });
  const Oe = /* @__PURE__ */ c((_ = Q.selectedMapping) => {
    const z = Oh(W), Z = Array.isArray(P == null ? void 0 : P.mappings) ? P.mappings : [], ee = Mh(Z, z), ne = Object.keys(z).length;
    Q.mappingFilters = z, U.disabled = ne === 0, Nh(x, {
      totalCount: Z.length,
      visibleCount: ee.length,
      hasFilters: ne > 0,
      activeFilterCount: ne
    }), F.classList.toggle("has-active-filters", ne > 0), kh(ae, P, u, _, {
      mappings: ee,
      categoryOrder: d
    }), Q.selectedMapping = ae.value ?? "", Yo({
      mappingSelect: ae,
      applyMappingButton: X,
      updateMappingButton: $e,
      editCriteriaButton: Ze,
      removeMappingButton: et,
      actionsMenu: te,
      state: P
    }), te.classList.contains("is-disabled") && ft();
  }, "refreshMappingSelector");
  W.querySelectorAll("select[data-filter-category-id]").forEach((_) => {
    _.addEventListener("change", () => {
      const z = Q.selectedMapping;
      Oe(z), Q.selectedMapping !== z && Qo(
        a ?? r,
        P,
        Q.selectedMapping
      ).then((Z) => {
        Z && (P = Z);
      });
    });
  }), U.addEventListener("click", () => {
    Ah(W);
    const _ = Q.selectedMapping;
    Oe(_), F.open = !1, Q.selectedMapping !== _ && Qo(
      a ?? r,
      P,
      Q.selectedMapping
    ).then((z) => {
      z && (P = z);
    });
  }), ae.addEventListener("change", () => {
    Q.selectedMapping = ae.value ?? "", Yo({
      mappingSelect: ae,
      applyMappingButton: X,
      updateMappingButton: $e,
      editCriteriaButton: Ze,
      removeMappingButton: et,
      actionsMenu: te,
      state: P
    }), Qo(
      a ?? r,
      P,
      Q.selectedMapping
    ).then((_) => {
      _ && (P = _);
    });
  });
  const Ri = /* @__PURE__ */ c(async () => {
    var ee, ne, ce, ue, nt, Kt, it, Yt, ge, Qt, Xt, Lt, Nn, qi;
    const _ = ae.value ?? "";
    if (!_) {
      (ne = (ee = ui.notifications) == null ? void 0 : ee.warn) == null || ne.call(
        ee,
        E(
          "EIDOLON.LightCriteria.SelectMappingWarning",
          "Choose a criteria mapping before applying."
        )
      ), Oe(Q.selectedMapping);
      return;
    }
    if (_ === he) {
      if (!(P != null && P.base)) {
        (ue = (ce = ui.notifications) == null ? void 0 : ce.warn) == null || ue.call(
          ce,
          E(
            "EIDOLON.LightCriteria.BaseUnavailable",
            "Set a base lighting state before applying it."
          )
        );
        return;
      }
      Yr(v, Te, A), ua(t, n, P.base), P = await Xi(a ?? r, {
        mappingId: he,
        categories: null,
        updatedAt: Date.now()
      }), Q.selectedMapping = he, Oe(Q.selectedMapping), kn(k, P), $n({ switcher: $, emptyState: ze, state: P }), Ui(A, {
        state: P,
        hasCategories: l.length > 0
      }), Dc(n, {
        mappingId: he,
        color: ((Kt = (nt = P.base) == null ? void 0 : nt.config) == null ? void 0 : Kt.color) ?? null
      }), (Yt = (it = ui.notifications) == null ? void 0 : it.info) == null || Yt.call(
        it,
        E(
          "EIDOLON.LightCriteria.BaseApplied",
          "Applied the base lighting state to the form."
        )
      ), ft();
      return;
    }
    const z = Array.isArray(P == null ? void 0 : P.mappings) && P.mappings.length ? P.mappings.find((li) => (li == null ? void 0 : li.id) === _) : null;
    if (!z) {
      (Qt = (ge = ui.notifications) == null ? void 0 : ge.warn) == null || Qt.call(
        ge,
        E(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      ), Q.selectedMapping = "", Oe(Q.selectedMapping);
      return;
    }
    Yr(v, Te, A), ua(t, n, z.config), P = await Xi(a ?? r, {
      mappingId: z.id,
      categories: z.categories,
      updatedAt: Date.now()
    }), Q.selectedMapping = z.id, Oe(Q.selectedMapping), kn(k, P), $n({ switcher: $, emptyState: ze, state: P }), Ui(A, {
      state: P,
      hasCategories: l.length > 0
    }), Dc(n, {
      mappingId: z.id,
      color: ((Lt = (Xt = z.config) == null ? void 0 : Xt.config) == null ? void 0 : Lt.color) ?? null
    });
    const Z = Ei(z, u, d);
    (qi = (Nn = ui.notifications) == null ? void 0 : Nn.info) == null || qi.call(
      Nn,
      E(
        "EIDOLON.LightCriteria.MappingApplied",
        "Applied mapping: {label}"
      ).replace("{label}", Z)
    ), ft();
  }, "applySelectedMapping");
  X.addEventListener("click", () => {
    Ri();
  }), ae.addEventListener("keydown", (_) => {
    _.key === "Enter" && (_.preventDefault(), Ri());
  });
  const Hr = /* @__PURE__ */ c(async () => {
    var z, Z, ee, ne, ce, ue, nt, Kt, it, Yt, ge, Qt, Xt, Lt, Nn, qi, li, jr, oc, Br, sc;
    const _ = Q.selectedMapping;
    if (!_) {
      (Z = (z = ui.notifications) == null ? void 0 : z.warn) == null || Z.call(
        z,
        E(
          "EIDOLON.LightCriteria.SelectMappingWarning",
          "Choose a criteria mapping before applying."
        )
      );
      return;
    }
    $e.disabled = !0;
    try {
      const Ge = ca(t, a);
      if (_ === he)
        P = await Lc(a ?? r, Ge), M("LightCriteria | Base lighting updated", {
          lightId: ((ee = a ?? r) == null ? void 0 : ee.id) ?? null,
          configColor: ((ne = Ge == null ? void 0 : Ge.config) == null ? void 0 : ne.color) ?? null
        }), (ue = (ce = ui.notifications) == null ? void 0 : ce.info) == null || ue.call(
          ce,
          E(
            "EIDOLON.LightCriteria.BaseUpdated",
            "Updated the base lighting state with the current configuration."
          )
        ), Q.selectedMapping = he;
      else {
        const ci = Zi(P, _);
        if (!ci) {
          (Kt = (nt = ui.notifications) == null ? void 0 : nt.warn) == null || Kt.call(
            nt,
            E(
              "EIDOLON.LightCriteria.MappingUnavailable",
              "The selected criteria mapping is no longer available."
            )
          ), Q.selectedMapping = "", Oe(Q.selectedMapping);
          return;
        }
        P = await Ic(
          a ?? r,
          ci.categories,
          Ge,
          { label: ci.label ?? null }
        ), M("LightCriteria | Mapping updated", {
          mappingId: _,
          hasColor: !!((it = Ge == null ? void 0 : Ge.config) != null && it.color),
          stored: Array.isArray(P == null ? void 0 : P.mappings) ? ((Yt = P.mappings.find((Po) => (Po == null ? void 0 : Po.id) === _)) == null ? void 0 : Yt.config) ?? null : null,
          persisted: (Qt = (ge = a ?? r) == null ? void 0 : ge.getFlag) == null ? void 0 : Qt.call(ge, Zn, wi)
        });
        const ji = Zi(P, _), $f = Ei(ji || ci, u, d);
        M("LightCriteria | Mapping updated", {
          mappingId: _,
          categories: ci.categories,
          updatedColor: ((Xt = Ge == null ? void 0 : Ge.config) == null ? void 0 : Xt.color) ?? null,
          storedColor: ((Nn = (Lt = ji == null ? void 0 : ji.config) == null ? void 0 : Lt.config) == null ? void 0 : Nn.color) ?? ((li = (qi = ci.config) == null ? void 0 : qi.config) == null ? void 0 : li.color) ?? null
        }), (oc = (jr = ui.notifications) == null ? void 0 : jr.info) == null || oc.call(
          jr,
          E(
            "EIDOLON.LightCriteria.MappingUpdated",
            "Saved changes to mapping: {label}"
          ).replace("{label}", $f)
        ), Q.selectedMapping = _;
      }
      kn(k, P), $n({ switcher: $, emptyState: ze, state: P }), Ui(A, {
        state: P,
        hasCategories: l.length > 0
      }), Oe(Q.selectedMapping), ft();
    } catch (Ge) {
      console.error("eidolon-utilities | Failed to update light criteria mapping", Ge), (sc = (Br = ui.notifications) == null ? void 0 : Br.error) == null || sc.call(
        Br,
        E(
          "EIDOLON.LightCriteria.MappingUpdateError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      $e.disabled = !1, Yo({
        mappingSelect: ae,
        applyMappingButton: X,
        updateMappingButton: $e,
        editCriteriaButton: Ze,
        removeMappingButton: et,
        actionsMenu: te,
        state: P
      });
    }
  }, "updateSelectedMapping");
  $e.addEventListener("click", () => {
    Hr();
  }), Oe(Q.selectedMapping), O.addEventListener("click", async () => {
    var _, z, Z, ee, ne, ce;
    O.disabled = !0;
    try {
      const ue = ca(t, a);
      P = await Lc(a ?? r, ue), M("LightCriteria | Base lighting stored", {
        lightId: ((_ = a ?? r) == null ? void 0 : _.id) ?? null,
        configColor: ((z = ue == null ? void 0 : ue.config) == null ? void 0 : z.color) ?? null
      }), (ee = (Z = ui.notifications) == null ? void 0 : Z.info) == null || ee.call(
        Z,
        E(
          "EIDOLON.LightCriteria.BaseStored",
          "Saved the current configuration as the base lighting state."
        )
      ), kn(k, P), $n({ switcher: $, emptyState: ze, state: P }), Ui(A, {
        state: P,
        hasCategories: l.length > 0
      }), Q.selectedMapping = he, Oe(Q.selectedMapping);
    } catch (ue) {
      console.error("eidolon-utilities | Failed to store base light criteria state", ue), (ce = (ne = ui.notifications) == null ? void 0 : ne.error) == null || ce.call(
        ne,
        E(
          "EIDOLON.LightCriteria.BaseError",
          "Failed to save the base lighting state. Check the console for details."
        )
      );
    } finally {
      O.disabled = !1;
    }
  }), A.addEventListener("click", () => {
    var z, Z, ee, ne;
    if (!(P != null && P.base)) {
      (Z = (z = ui.notifications) == null ? void 0 : z.warn) == null || Z.call(
        z,
        E(
          "EIDOLON.LightCriteria.RequiresBase",
          "Set a base lighting state before adding criteria mappings."
        )
      );
      return;
    }
    if (l.length === 0) {
      (ne = (ee = ui.notifications) == null ? void 0 : ee.warn) == null || ne.call(
        ee,
        E(
          "EIDOLON.LightCriteria.NoCategoriesAvailable",
          "Add scene criteria with values in the Scene configuration before creating mappings."
        )
      );
      return;
    }
    const _ = la.get(v);
    _c({
      app: t,
      fieldset: v,
      createButton: A,
      creationSection: Te,
      categoryList: Rt,
      form: n,
      persistedLight: a,
      stateEntry: _,
      mode: "create",
      mapping: null,
      preloadConfig: P.base
    });
  }), Ze.addEventListener("click", () => {
    var Z, ee, ne, ce;
    const _ = Q.selectedMapping;
    if (!_ || _ === he) {
      (ee = (Z = ui.notifications) == null ? void 0 : Z.warn) == null || ee.call(
        Z,
        E(
          "EIDOLON.LightCriteria.SelectMappingForCriteriaEdit",
          "Select a mapping before editing criteria."
        )
      );
      return;
    }
    const z = Zi(P, _);
    if (!z) {
      (ce = (ne = ui.notifications) == null ? void 0 : ne.warn) == null || ce.call(
        ne,
        E(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      );
      return;
    }
    ft(), Fd(t, { fieldset: v, homeContainer: i }), _c({
      app: t,
      fieldset: v,
      createButton: A,
      creationSection: Te,
      categoryList: Rt,
      form: n,
      persistedLight: a,
      stateEntry: Q,
      mode: "retarget",
      mapping: z,
      preloadConfig: z.config
    });
  }), tt.addEventListener("click", async () => {
    var z, Z, ee, ne, ce, ue, nt, Kt, it, Yt;
    const _ = Fh(Rt);
    if (!_) {
      (Z = (z = ui.notifications) == null ? void 0 : z.warn) == null || Z.call(
        z,
        E(
          "EIDOLON.LightCriteria.SelectionRequired",
          "Select at least one criteria value to identify the mapping."
        )
      );
      return;
    }
    tt.disabled = !0;
    try {
      const ge = ca(t, a);
      if (Q.editorMode === "retarget" && Q.editingMappingId) {
        const Xt = Ys(P, _);
        let Lt = !1;
        if (Xt && Xt !== Q.editingMappingId && (Lt = await hh(), !Lt)) {
          tt.disabled = !1;
          return;
        }
        P = await eg(
          a ?? r,
          Q.editingMappingId,
          _,
          ge,
          { replaceExisting: Lt }
        ), M("LightCriteria | Mapping criteria retargeted", {
          mappingId: Q.editingMappingId,
          categories: _,
          replaced: Lt,
          configColor: ((ee = ge == null ? void 0 : ge.config) == null ? void 0 : ee.color) ?? null
        }), (ce = (ne = ui.notifications) == null ? void 0 : ne.info) == null || ce.call(
          ne,
          E(
            "EIDOLON.LightCriteria.MappingCriteriaUpdated",
            "Updated mapping criteria for the selected mapping."
          )
        );
      } else
        P = await Ic(
          a ?? r,
          _,
          ge,
          {}
        ), M("LightCriteria | Mapping saved from editor", {
          categories: _,
          configColor: ((ue = ge == null ? void 0 : ge.config) == null ? void 0 : ue.color) ?? null
        }), (Kt = (nt = ui.notifications) == null ? void 0 : nt.info) == null || Kt.call(
          nt,
          E(
            "EIDOLON.LightCriteria.MappingSaved",
            "Updated lighting mapping for the selected scene criteria."
          )
        );
      kn(k, P), $n({ switcher: $, emptyState: ze, state: P });
      const Qt = Ys(P, _);
      Qt && (Q.selectedMapping = Qt), Oe(Q.selectedMapping), Yr(v, Te, A), ft();
    } catch (ge) {
      console.error("eidolon-utilities | Failed to persist light criteria mapping", ge), (Yt = (it = ui.notifications) == null ? void 0 : it.error) == null || Yt.call(
        it,
        E(
          "EIDOLON.LightCriteria.MappingError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      tt.disabled = !1;
    }
  }), Ht.addEventListener("click", () => {
    const _ = la.get(v);
    _ != null && _.restoreConfig && ua(t, n, _.restoreConfig), Yr(v, Te, A);
  }), et.addEventListener("click", async () => {
    var Z, ee;
    const _ = Q.selectedMapping;
    !_ || _ === he || !await ph() || (P = await tg(a ?? r, _), Q.selectedMapping = "", kn(k, P), $n({ switcher: $, emptyState: ze, state: P }), Oe(Q.selectedMapping), ft(), (ee = (Z = ui.notifications) == null ? void 0 : Z.info) == null || ee.call(
      Z,
      E("EIDOLON.LightCriteria.MappingRemoved", "Removed selected mapping.")
    ));
  });
}
c(gh, "enhanceAmbientLightConfig");
function _c({
  app: t,
  fieldset: e,
  createButton: n,
  creationSection: i,
  categoryList: r,
  form: a,
  persistedLight: o,
  stateEntry: s,
  mode: l,
  mapping: u,
  preloadConfig: d
}) {
  s && (s.restoreConfig = ca(t, o), s.editorMode = l, s.editingMappingId = l === "retarget" ? (u == null ? void 0 : u.id) ?? null : null), d && ua(t, a, d), l === "retarget" && (u != null && u.categories) ? Dh(r, u.categories) : _h(r);
  const m = i.querySelector("p.notes");
  m instanceof HTMLElement && (m.textContent = l === "retarget" ? E(
    "EIDOLON.LightCriteria.EditCriteriaDescription",
    "Adjust criteria values for the selected mapping."
  ) : E(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const g = i.querySelector('button[data-action="save-mapping"]');
  g instanceof HTMLButtonElement && (g.textContent = l === "retarget" ? E("EIDOLON.LightCriteria.SaveCriteriaChanges", "Save Criteria Changes") : E("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), i.hidden = !1, n.setAttribute("aria-expanded", "true"), Bl(e, i), requestAnimationFrame(() => {
    var y;
    (y = t.setPosition) == null || y.call(t, { height: "auto" });
  });
}
c(_c, "openMappingEditor");
async function hh() {
  var n, i;
  const t = (i = (n = foundry == null ? void 0 : foundry.applications) == null ? void 0 : n.api) == null ? void 0 : i.DialogV2;
  if (typeof (t == null ? void 0 : t.confirm) == "function")
    return t.confirm({
      window: { title: E("EIDOLON.LightCriteria.ConflictTitle", "Replace Existing Mapping?") },
      content: `<p>${E(
        "EIDOLON.LightCriteria.ConflictBody",
        "A mapping already exists for this criteria combination. Replace it with the edited mapping?"
      )}</p>`,
      rejectClose: !1
    });
  const e = globalThis.Dialog;
  return typeof (e == null ? void 0 : e.confirm) != "function" ? !1 : e.confirm({
    title: E("EIDOLON.LightCriteria.ConflictTitle", "Replace Existing Mapping?"),
    content: `<p>${E(
      "EIDOLON.LightCriteria.ConflictBody",
      "A mapping already exists for this criteria combination. Replace it with the edited mapping?"
    )}</p>`,
    yes: /* @__PURE__ */ c(() => !0, "yes"),
    no: /* @__PURE__ */ c(() => !1, "no"),
    defaultYes: !1
  });
}
c(hh, "confirmCriteriaConflict");
async function ph() {
  var n, i;
  const t = (i = (n = foundry == null ? void 0 : foundry.applications) == null ? void 0 : n.api) == null ? void 0 : i.DialogV2;
  if (typeof (t == null ? void 0 : t.confirm) == "function")
    return t.confirm({
      window: { title: E("EIDOLON.LightCriteria.RemoveTitle", "Remove Mapping?") },
      content: `<p>${E(
        "EIDOLON.LightCriteria.RemoveBody",
        "Remove the currently selected mapping? This cannot be undone."
      )}</p>`,
      rejectClose: !1
    });
  const e = globalThis.Dialog;
  return typeof (e == null ? void 0 : e.confirm) != "function" ? !1 : e.confirm({
    title: E("EIDOLON.LightCriteria.RemoveTitle", "Remove Mapping?"),
    content: `<p>${E(
      "EIDOLON.LightCriteria.RemoveBody",
      "Remove the currently selected mapping? This cannot be undone."
    )}</p>`,
    yes: /* @__PURE__ */ c(() => !0, "yes"),
    no: /* @__PURE__ */ c(() => !1, "no"),
    defaultYes: !1
  });
}
c(ph, "confirmRemoveMapping");
function yh(t, { fieldset: e, homeContainer: n }) {
  const i = wh(t, n);
  if (!(i instanceof HTMLElement)) return;
  const r = i.querySelector(".window-header");
  if (!(r instanceof HTMLElement)) return;
  let a = r.querySelector('[data-eidolon-action="open-light-criteria-manager"]');
  if (!(a instanceof HTMLButtonElement)) {
    a = document.createElement("button"), a.type = "button", a.classList.add("header-control", "icon"), a.dataset.eidolonAction = "open-light-criteria-manager", a.dataset.tooltip = E("EIDOLON.LightCriteria.OpenManager", "Open Scene Criteria Lighting"), a.setAttribute("aria-label", E("EIDOLON.LightCriteria.OpenManager", "Open Scene Criteria Lighting")), a.innerHTML = '<i class="fa-solid fa-sliders" inert=""></i>';
    const o = r.querySelector(".window-controls") ?? r, s = o.querySelector('[data-action="toggleControls"]');
    if ((s == null ? void 0 : s.parentElement) === o)
      o.insertBefore(a, s);
    else {
      const l = o.querySelector('[data-action="close"]');
      (l == null ? void 0 : l.parentElement) === o ? o.insertBefore(a, l) : o.appendChild(a);
    }
  }
  a.onclick = (o) => {
    o.preventDefault(), Fd(t, { fieldset: e, homeContainer: n });
  };
}
c(yh, "ensureManagerHeaderButton");
function Fd(t, { fieldset: e, homeContainer: n }) {
  var g, y, h;
  const i = Kr.get(t);
  if (i != null && i.rendered) {
    (g = i.bringToTop) == null || g.call(i);
    return;
  }
  const r = /* @__PURE__ */ c((...p) => {
    var w;
    const v = bh(p), b = (w = v == null ? void 0 : v.querySelector) == null ? void 0 : w.call(v, ".eidolon-light-criteria-manager-host");
    b instanceof HTMLElement && (vh(e), e.hidden = !1, b.appendChild(e));
  }, "onRender"), a = /* @__PURE__ */ c(() => {
    n instanceof HTMLElement && n.appendChild(e), e.hidden = !0, Kr.delete(t), requestAnimationFrame(() => {
      var p;
      (p = t.setPosition) == null || p.call(t, { height: "auto" });
    });
  }, "onClose"), o = E("EIDOLON.LightCriteria.ManagerTitle", "Scene Criteria Lighting"), s = '<div class="eidolon-light-criteria-manager-host"></div>', l = E("EIDOLON.LightCriteria.Close", "Close"), u = (h = (y = foundry == null ? void 0 : foundry.applications) == null ? void 0 : y.api) == null ? void 0 : h.DialogV2;
  if (typeof (u == null ? void 0 : u.wait) == "function")
    try {
      let p = !1;
      const v = /* @__PURE__ */ c(() => {
        p || (p = !0, a());
      }, "closeOnce");
      Kr.set(t, {
        rendered: !0,
        bringToTop: /* @__PURE__ */ c(() => {
        }, "bringToTop")
      }), u.wait({
        window: { title: o },
        content: s,
        buttons: [{ action: "close", label: l, default: !0 }],
        render: /* @__PURE__ */ c((...b) => r(...b), "render"),
        close: v,
        rejectClose: !1
      }).catch((b) => {
        console.warn("eidolon-utilities | DialogV2 manager failed, falling back to Dialog", b), v();
      });
      return;
    } catch (p) {
      console.warn("eidolon-utilities | DialogV2 manager failed, falling back to Dialog", p), a();
    }
  const d = globalThis.Dialog;
  if (typeof d != "function") return;
  const m = new d(
    {
      title: o,
      content: s,
      buttons: {
        close: {
          label: l
        }
      },
      render: /* @__PURE__ */ c((...p) => r(...p), "render"),
      close: a
    },
    {
      width: 640,
      resizable: !0
    }
  );
  Kr.set(t, m), m.render(!0);
}
c(Fd, "openManagerDialog");
function bh(t) {
  for (const e of t) {
    const n = Dt(e);
    if (n) return n;
    const i = Dt(e == null ? void 0 : e.element);
    if (i) return i;
  }
  return null;
}
c(bh, "findDialogRoot");
function vh(t) {
  if (!(t instanceof HTMLElement) || t.dataset.managerLayout === "true") return;
  t.dataset.managerLayout = "true", t.classList.add("is-manager");
  const e = t.querySelector("legend"), n = t.querySelector("p.notes:not(.eidolon-light-criteria__status)"), i = t.querySelector(".eidolon-light-criteria__controls"), r = t.querySelector(".eidolon-light-criteria__status"), a = t.querySelector(".eidolon-light-criteria__creation"), o = Array.from(t.querySelectorAll(".eidolon-light-criteria__warning")), s = document.createElement("div");
  s.classList.add("eidolon-light-criteria-manager");
  const l = document.createElement("section");
  l.classList.add("eidolon-light-criteria-manager__section", "is-top"), s.appendChild(l);
  const u = document.createElement("section");
  u.classList.add("eidolon-light-criteria-manager__section", "is-bottom"), s.appendChild(u);
  const d = document.createElement("div");
  if (d.classList.add("eidolon-light-criteria-manager__header"), d.textContent = E("EIDOLON.LightCriteria.ManagerHeader", "Base State"), l.appendChild(d), r && l.appendChild(r), i && l.appendChild(i), o.length) {
    const g = document.createElement("div");
    g.classList.add("eidolon-light-criteria-manager__warnings");
    for (const y of o) g.appendChild(y);
    l.appendChild(g);
  }
  const m = document.createElement("div");
  m.classList.add("eidolon-light-criteria-manager__header"), m.textContent = E("EIDOLON.LightCriteria.ManagerAuthoring", "Create or Update Mapping"), u.appendChild(m), a && u.appendChild(a), t.innerHTML = "", e && t.appendChild(e), n && t.appendChild(n), t.appendChild(s), Bl(t, a);
}
c(vh, "applyManagerLayout");
function wh(t, e) {
  var i;
  const n = Dt(t == null ? void 0 : t.element);
  return n || (((i = e == null ? void 0 : e.closest) == null ? void 0 : i.call(e, ".application")) ?? null);
}
c(wh, "resolveApplicationRoot");
function Yr(t, e, n) {
  const i = la.get(t);
  i && (i.restoreConfig = null, i.editorMode = "create", i.editingMappingId = null), e.hidden = !0, n.setAttribute("aria-expanded", "false");
  const r = e.querySelector("p.notes");
  r instanceof HTMLElement && (r.textContent = E(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const a = e.querySelector('button[data-action="save-mapping"]');
  a instanceof HTMLButtonElement && (a.textContent = E("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), Bl(t, e), requestAnimationFrame(() => {
    var o, s;
    (s = (o = i == null ? void 0 : i.app) == null ? void 0 : o.setPosition) == null || s.call(o, { height: "auto" });
  });
}
c(Yr, "hideCreationSection");
function kn(t, e) {
  if (!t) return;
  const n = !!(e != null && e.base), i = Array.isArray(e == null ? void 0 : e.mappings) ? e.mappings.length : 0, r = [];
  r.push(
    n ? E(
      "EIDOLON.LightCriteria.StatusBaseSaved",
      "Base lighting saved."
    ) : E(
      "EIDOLON.LightCriteria.StatusBaseMissing",
      "Base lighting not yet saved."
    )
  ), r.push(
    E(
      "EIDOLON.LightCriteria.StatusMappingCount",
      "Mappings: {count}"
    ).replace("{count}", String(i))
  ), t.textContent = r.join(" ");
}
c(kn, "updateStatusLine");
function Ui(t, { state: e, hasCategories: n }) {
  if (!t) return;
  const i = !!(e != null && e.base), r = i && n;
  t.disabled = !r, t.title = r ? "" : i ? E(
    "EIDOLON.LightCriteria.CreateDisabledNoCategories",
    "Add scene criteria with values before creating mappings."
  ) : E(
    "EIDOLON.LightCriteria.CreateDisabledNoBase",
    "Save a base lighting state before creating criteria mappings."
  );
}
c(Ui, "updateCreateButtonState");
function ca(t, e) {
  var l, u, d;
  const n = e ?? Pd(t);
  if (!n)
    throw new Error("Ambient light document unavailable.");
  const i = ri(((l = n.toObject) == null ? void 0 : l.call(n)) ?? {});
  if (!i)
    throw new Error("Unable to duplicate ambient light data.");
  const r = (t == null ? void 0 : t.form) instanceof HTMLFormElement ? t.form : null, a = r ? am(r) : {}, o = foundry.utils.mergeObject(i, a, {
    inplace: !1,
    performDeletions: !0
  });
  r && (r.querySelectorAll("color-picker[name]").forEach((m) => {
    var b, w;
    const g = m.getAttribute("name");
    if (!g) return;
    const y = typeof m.value == "string" ? m.value : "", h = ((b = m.ui) == null ? void 0 : b.input) ?? ((w = m.querySelector) == null ? void 0 : w.call(m, 'input[type="color"]')), p = (h == null ? void 0 : h.value) ?? "", v = y || p;
    typeof v != "string" || !v || (foundry.utils.setProperty(o, g, v), M("LightCriteria | Captured color-picker value", {
      path: g,
      pickerValue: y,
      swatchValue: p,
      chosenValue: v
    }));
  }), r.querySelectorAll("range-picker[name]").forEach((m) => {
    var A, k;
    const g = m.getAttribute("name");
    if (!g) return;
    const y = m.value !== void 0 && m.value !== null ? String(m.value) : "", h = (A = m.querySelector) == null ? void 0 : A.call(m, 'input[type="range"]'), p = (k = m.querySelector) == null ? void 0 : k.call(m, 'input[type="number"]'), v = h instanceof HTMLInputElement ? h.value : "", b = p instanceof HTMLInputElement ? p.value : "", w = y || b || v;
    if (typeof w != "string" || !w.length) return;
    const C = Number(w), O = Number.isFinite(C) ? C : w;
    foundry.utils.setProperty(o, g, O), M("LightCriteria | Captured range-picker value", {
      path: g,
      elementValue: y,
      numberValue: b,
      rangeValue: v,
      chosenValue: O
    });
  }));
  const s = ri(o);
  return M("LightCriteria | Captured form config", {
    lightId: (n == null ? void 0 : n.id) ?? null,
    hasColor: !!((u = s == null ? void 0 : s.config) != null && u.color),
    color: ((d = s == null ? void 0 : s.config) == null ? void 0 : d.color) ?? null
  }), s;
}
c(ca, "captureAmbientLightFormConfig");
function ua(t, e, n) {
  if (!n || typeof n != "object") return;
  const i = foundry.utils.flattenObject(n, { safe: !0 });
  for (const [r, a] of Object.entries(i)) {
    const o = e.querySelectorAll(`[name="${r}"]`);
    if (o.length) {
      M("LightCriteria | Applying field", {
        path: r,
        value: a,
        elementCount: o.length
      });
      for (const s of o)
        s instanceof HTMLElement && s.tagName === "COLOR-PICKER" ? Sh(s, a) : s instanceof HTMLElement && s.tagName === "RANGE-PICKER" ? Th(s, a) : s instanceof HTMLInputElement ? Eh(s, a) : s instanceof HTMLSelectElement ? Ch(s, a) : s instanceof HTMLTextAreaElement && Lh(s, a);
    }
  }
  requestAnimationFrame(() => {
    var r;
    return (r = t._previewChanges) == null ? void 0 : r.call(t);
  });
}
c(ua, "applyConfigToForm");
function Eh(t, e, n) {
  const i = t.type;
  if (i === "checkbox") {
    const o = !!e;
    t.checked !== o && (t.checked = o, Tt(t));
    return;
  }
  if (i === "radio") {
    const o = e == null ? "" : String(e), s = t.value === o;
    t.checked !== s && (t.checked = s, s && Tt(t));
    return;
  }
  const r = e == null ? "" : String(e);
  let a = !1;
  t.value !== r && (t.value = r, a = !0), a && Tt(t);
}
c(Eh, "applyValueToInput");
function Sh(t, e, n) {
  var s, l, u, d, m, g;
  const i = e == null ? "" : String(e);
  let r = !1;
  t.value !== i && (t.value = i, t.setAttribute("value", i), (s = t.ui) != null && s.setValue && t.ui.setValue(i), r = !0);
  const a = ((l = t.ui) == null ? void 0 : l.input) ?? ((u = t.querySelector) == null ? void 0 : u.call(t, 'input[type="color"]'));
  a instanceof HTMLInputElement && a.value !== i && (a.value = i, Tt(a));
  const o = ((d = t.ui) == null ? void 0 : d.text) ?? ((m = t.querySelector) == null ? void 0 : m.call(t, 'input[type="text"]'));
  o instanceof HTMLInputElement && o.value !== i && (o.value = i, Tt(o)), (g = t.ui) != null && g.commit ? t.ui.commit() : (t.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), t.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }))), M("LightCriteria | Color picker applied", {
    value: i,
    pickerValue: t.value ?? null,
    swatchValue: (a == null ? void 0 : a.value) ?? null,
    textValue: (o == null ? void 0 : o.value) ?? null
  }), r && Tt(t);
}
c(Sh, "applyValueToColorPicker");
function Th(t, e, n) {
  var u, d;
  const i = e == null ? "" : String(e), r = Number(i), a = Number.isFinite(r) ? r : i;
  let o = !1;
  t.value !== void 0 && t.value !== a && (t.value = a, o = !0), t.getAttribute("value") !== i && (t.setAttribute("value", i), o = !0);
  const s = (u = t.querySelector) == null ? void 0 : u.call(t, 'input[type="range"]');
  s instanceof HTMLInputElement && s.value !== i && (s.value = i, Tt(s));
  const l = (d = t.querySelector) == null ? void 0 : d.call(t, 'input[type="number"]');
  if (l instanceof HTMLInputElement && l.value !== i && (l.value = i, Tt(l)), typeof t.commit == "function")
    try {
      t.commit();
    } catch (m) {
      console.error("eidolon-utilities | range-picker commit failed", m);
    }
  M("LightCriteria | Range picker applied", {
    value: i,
    resolvedValue: a,
    rangeValue: (s == null ? void 0 : s.value) ?? null,
    numberValue: (l == null ? void 0 : l.value) ?? null
  }), o && Tt(t);
}
c(Th, "applyValueToRangePicker");
function Ch(t, e, n) {
  const i = e == null ? "" : String(e);
  t.value !== i && (t.value = i, Tt(t));
}
c(Ch, "applyValueToSelect");
function Lh(t, e, n) {
  const i = e == null ? "" : String(e);
  t.value !== i && (t.value = i, Tt(t));
}
c(Lh, "applyValueToTextarea");
function Tt(t) {
  t.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), t.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }));
}
c(Tt, "triggerInputChange");
function Yo({
  mappingSelect: t,
  applyMappingButton: e,
  updateMappingButton: n,
  editCriteriaButton: i,
  removeMappingButton: r,
  actionsMenu: a,
  state: o
}) {
  const s = (t == null ? void 0 : t.value) ?? "", l = !!(o != null && o.base), u = s && s !== he ? !!Zi(o, s) : !1;
  if (e instanceof HTMLButtonElement && (s ? s === he ? e.disabled = !l : e.disabled = !u : e.disabled = !0), n instanceof HTMLButtonElement && (s ? s === he ? n.disabled = !1 : n.disabled = !u : n.disabled = !0), i instanceof HTMLButtonElement && (i.disabled = !s || s === he || !u), r instanceof HTMLButtonElement && (r.disabled = !s || s === he || !u), a instanceof HTMLElement) {
    const d = n instanceof HTMLButtonElement && !n.disabled || i instanceof HTMLButtonElement && !i.disabled || r instanceof HTMLButtonElement && !r.disabled;
    a.classList.toggle("is-disabled", !d), !d && "open" in a && (a.open = !1);
  }
}
c(Yo, "syncMappingSwitcherState");
function Ih(t) {
  const e = /* @__PURE__ */ new Map();
  for (const n of t) {
    if (!n) continue;
    const i = typeof n.id == "string" ? n.id : null;
    if (!i) continue;
    const r = typeof n.name == "string" && n.name.trim() ? n.name.trim() : E("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category");
    e.has(i) || e.set(i, r);
  }
  return e;
}
c(Ih, "buildCategoryNameLookup");
function Oh(t) {
  const e = {};
  return t instanceof HTMLElement && t.querySelectorAll("select[data-filter-category-id]").forEach((n) => {
    var a, o;
    const i = n.dataset.filterCategoryId, r = (o = (a = n.value) == null ? void 0 : a.trim) == null ? void 0 : o.call(a);
    !i || !r || (e[i] = r);
  }), e;
}
c(Oh, "readMappingFilterSelections");
function Ah(t) {
  t instanceof HTMLElement && t.querySelectorAll("select[data-filter-category-id]").forEach((e) => {
    e.value = "";
  });
}
c(Ah, "resetMappingFilterSelections");
function Mh(t, e) {
  const n = Array.isArray(t) ? t : [], i = Object.entries(e ?? {}).filter(([, r]) => !!r);
  return i.length ? n.filter((r) => {
    if (!r || typeof r != "object") return !1;
    const a = r.categories ?? {};
    for (const [o, s] of i)
      if ((a == null ? void 0 : a[o]) !== s) return !1;
    return !0;
  }) : n.slice();
}
c(Mh, "filterMappingsByCriteria");
function Nh(t, { totalCount: e = 0, visibleCount: n = 0, hasFilters: i = !1, activeFilterCount: r = 0 } = {}) {
  if (!(t instanceof HTMLElement)) return;
  if (!i) {
    t.textContent = E(
      "EIDOLON.LightCriteria.FilterSummaryAll",
      "All ({count})"
    ).replace("{count}", String(e));
    return;
  }
  const a = E(
    "EIDOLON.LightCriteria.FilterSummaryActive",
    "{active} filters · {visible}/{total}"
  ).replace("{active}", String(r)).replace("{visible}", String(n)).replace("{total}", String(e));
  t.textContent = a;
}
c(Nh, "updateMappingFilterMeta");
function kh(t, e, n, i, r = {}) {
  if (!(t instanceof HTMLSelectElement)) return;
  const a = typeof i == "string" ? i : "", o = !!(e != null && e.base), s = Array.isArray(r == null ? void 0 : r.categoryOrder) ? r.categoryOrder : [], l = Array.isArray(r == null ? void 0 : r.mappings) ? r.mappings.slice() : Array.isArray(e == null ? void 0 : e.mappings) ? e.mappings.slice() : [], u = t.value;
  t.innerHTML = "";
  const d = document.createElement("option");
  d.value = "", d.textContent = E(
    "EIDOLON.LightCriteria.SelectPlaceholder",
    "Select a mapping"
  ), d.disabled = o, t.appendChild(d);
  const m = document.createElement("option");
  m.value = he, m.textContent = E(
    "EIDOLON.LightCriteria.BaseOption",
    "Base Lighting"
  ), m.disabled = !o, t.appendChild(m), l.slice().sort((p, v) => {
    var C;
    const b = Ei(p, n, s), w = Ei(v, n, s);
    return b.localeCompare(w, ((C = game.i18n) == null ? void 0 : C.lang) ?? void 0, {
      sensitivity: "base"
    });
  }).forEach((p) => {
    if (!(p != null && p.id)) return;
    const v = document.createElement("option");
    v.value = p.id, v.textContent = Ei(p, n, s), t.appendChild(v);
  });
  const g = new Set(
    Array.from(t.options).filter((p) => !p.disabled).map((p) => p.value)
  ), y = o && u === "" ? "" : u, h = a || (g.has(y) ? y : "");
  h && g.has(h) ? t.value = h : o ? t.value = he : t.value = "";
}
c(kh, "populateMappingSelector");
function Ei(t, e, n = []) {
  if (!t || typeof t != "object")
    return E("EIDOLON.LightCriteria.UnnamedMapping", "Unnamed Mapping");
  if (typeof t.label == "string" && t.label.trim())
    return t.label.trim();
  const i = t.categories ?? {}, r = [], a = /* @__PURE__ */ new Set();
  for (const s of n)
    !s || a.has(s) || (r.push(s), a.add(s));
  for (const s of Object.keys(i).sort((l, u) => l.localeCompare(u)))
    a.has(s) || (r.push(s), a.add(s));
  const o = r.map((s) => {
    const l = i == null ? void 0 : i[s];
    if (typeof l != "string" || !l.trim()) return null;
    const u = l.trim();
    return `${e.get(s) ?? E("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category")}=${u}`;
  }).filter(Boolean);
  return o.length === 0 ? E("EIDOLON.LightCriteria.UnnamedMapping", "Unnamed Mapping") : o.join(" | ");
}
c(Ei, "formatMappingOptionLabel");
function Ys(t, e) {
  if (!t || typeof t != "object" || !Array.isArray(t.mappings)) return null;
  const n = Fi(e);
  if (!n) return null;
  const i = t.mappings.find((r) => (r == null ? void 0 : r.key) === n);
  return (i == null ? void 0 : i.id) ?? null;
}
c(Ys, "findMappingIdByCategories");
function Zi(t, e) {
  return !e || !t || typeof t != "object" || !Array.isArray(t.mappings) ? null : t.mappings.find((n) => (n == null ? void 0 : n.id) === e) ?? null;
}
c(Zi, "getMappingById");
function $h(t) {
  if (!t || typeof t != "object") return "";
  const e = t.current;
  if (e != null && e.mappingId) {
    if (e.mappingId === he)
      return t != null && t.base ? he : "";
    if (Array.isArray(t.mappings) && t.mappings.some((n) => n.id === e.mappingId))
      return e.mappingId;
  }
  if (e != null && e.categories) {
    const n = Ys(t, e.categories);
    if (n) return n;
  }
  return "";
}
c($h, "resolveInitialMappingSelection");
function Dc(t, e = {}) {
  var o, s, l, u;
  if (!(t instanceof HTMLFormElement)) return;
  const n = t.querySelector('color-picker[name="config.color"]'), i = (n == null ? void 0 : n.value) ?? null, r = ((o = n == null ? void 0 : n.ui) == null ? void 0 : o.text) ?? ((s = n == null ? void 0 : n.querySelector) == null ? void 0 : s.call(n, 'input[type="text"]')), a = ((l = n == null ? void 0 : n.ui) == null ? void 0 : l.input) ?? ((u = n == null ? void 0 : n.querySelector) == null ? void 0 : u.call(n, 'input[type="color"]'));
  M("LightCriteria | Color state after apply", {
    ...e,
    textValue: (r == null ? void 0 : r.value) ?? null,
    pickerValue: i,
    swatchValue: (a == null ? void 0 : a.value) ?? null
  });
}
c(Dc, "logAppliedColorState");
function _h(t) {
  t.querySelectorAll("select[data-category-id]").forEach((e) => {
    e.value = "";
  });
}
c(_h, "resetCategorySelections");
function Dh(t, e) {
  const n = e && typeof e == "object" ? e : {};
  t.querySelectorAll("select[data-category-id]").forEach((i) => {
    const r = i.dataset.categoryId;
    if (!r) return;
    const a = n[r];
    i.value = typeof a == "string" ? a : "";
  });
}
c(Dh, "setCategorySelections");
function Fh(t) {
  const e = {};
  return t.querySelectorAll("select[data-category-id]").forEach((n) => {
    var a, o;
    const i = n.dataset.categoryId, r = (o = (a = n.value) == null ? void 0 : a.trim) == null ? void 0 : o.call(a);
    !i || !r || (e[i] = r);
  }), Object.keys(e).length > 0 ? e : null;
}
c(Fh, "readCategorySelections");
async function Qo(t, e, n) {
  if (!t) return null;
  try {
    if (!n)
      return await Xi(t, {});
    if (n === he)
      return await Xi(t, {
        mappingId: he,
        categories: null,
        updatedAt: Date.now()
      });
    const i = Zi(e, n);
    return i ? await Xi(t, {
      mappingId: i.id,
      categories: i.categories,
      updatedAt: Date.now()
    }) : null;
  } catch (i) {
    return console.warn("eidolon-utilities | Failed to persist mapping selection", i), null;
  }
}
c(Qo, "persistCurrentSelection");
function Bl(t, e) {
  if (!(t instanceof HTMLElement)) return;
  const n = t.querySelector(".eidolon-light-criteria-manager__section.is-bottom");
  n instanceof HTMLElement && (n.hidden = !!(e != null && e.hidden));
}
c(Bl, "updateManagerSectionVisibility");
function $n({ switcher: t, emptyState: e, state: n }) {
  const i = !!(n != null && n.base);
  t instanceof HTMLElement && (t.hidden = !i), e instanceof HTMLElement && (e.hidden = i);
}
c($n, "updateActiveMappingVisibility");
function Pd(t) {
  const e = (t == null ? void 0 : t.object) ?? (t == null ? void 0 : t.document) ?? null;
  return !(e != null && e.isEmbedded) || e.documentName !== "AmbientLight" ? null : e;
}
c(Pd, "getAmbientLightDocument");
function Ph(t) {
  if (!(t != null && t.isEmbedded)) return null;
  const e = t.parent ?? null;
  if (!e) return t;
  if (typeof e.getEmbeddedDocument == "function") {
    const i = e.getEmbeddedDocument(t.documentName, t.id);
    if (i) return i;
  }
  const n = e.lights;
  if (n != null && n.get) {
    const i = n.get(t.id);
    if (i) return i;
  }
  return t;
}
c(Ph, "getPersistedAmbientLightDocument");
function xh() {
  fh();
}
c(xh, "registerLightCriteriaHooks");
xh();
const Qs = /* @__PURE__ */ new Map();
let Xs = !1;
function Ul(t, e) {
  Qs.has(t) && console.warn(`[${T}] Socket handler for type "${t}" already registered, overwriting.`), Qs.set(t, e);
}
c(Ul, "registerSocketHandler");
function da(t, e) {
  if (!Xs) {
    console.error(`[${T}] Socket not initialized. Call initializeSocket() first.`);
    return;
  }
  game.socket.emit(`module.${T}`, { type: t, payload: e });
}
c(da, "emitSocket");
function Rh() {
  Xs || (game.socket.on(`module.${T}`, (t) => {
    const { type: e, payload: n } = t ?? {}, i = Qs.get(e);
    i ? i(n) : console.warn(`[${T}] No socket handler for type "${e}"`);
  }), Xs = !0, console.log(`[${T}] Socket initialized on channel module.${T}`));
}
c(Rh, "initializeSocket");
const xd = "tween", Rd = "tween-sequence", Zs = "tween-sequence-cancel", Se = Object.freeze({
  ABORT: "abort",
  CONTINUE: "continue"
}), Zt = Object.freeze({
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  FAILED: "failed"
}), mt = Object.freeze({
  BEFORE_ALL: "beforeAll",
  BEFORE_STEP: "before",
  ENTRY: "entry",
  AFTER_STEP: "after",
  RUNTIME: "runtime",
  VALIDATION: "validation",
  AWAIT: "await",
  EMIT: "emit",
  PARALLEL: "parallel"
}), Na = /* @__PURE__ */ new Map();
function Ct({ type: t, execute: e, validate: n }) {
  Na.has(t) && console.warn(`[tween-registry] Type "${t}" already registered, overwriting.`), Na.set(t, { type: t, execute: e, validate: n ?? (() => {
  }) });
}
c(Ct, "registerTweenType");
function Pi(t) {
  return Na.get(t);
}
c(Pi, "getTweenType");
function Hh(t, e = {}) {
  const n = Pi(t);
  if (!n)
    throw new Error(`Unknown tween type: "${t}".`);
  return n.validate(e ?? {}), n;
}
c(Hh, "validateTweenEntry");
function el() {
  return [...Na.keys()];
}
c(el, "listTweenTypes");
const Si = {
  easeInQuad: /* @__PURE__ */ c((t) => t * t, "easeInQuad"),
  easeOutQuad: /* @__PURE__ */ c((t) => t * (2 - t), "easeOutQuad"),
  easeInOutQuad: /* @__PURE__ */ c((t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t, "easeInOutQuad"),
  easeInCubic: /* @__PURE__ */ c((t) => t * t * t, "easeInCubic"),
  easeOutCubic: /* @__PURE__ */ c((t) => {
    const e = t - 1;
    return e * e * e + 1;
  }, "easeOutCubic"),
  easeInOutCubic: /* @__PURE__ */ c((t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1, "easeInOutCubic"),
  easeOutBounce: /* @__PURE__ */ c((t) => {
    if (t < 1 / 2.75) return 7.5625 * t * t;
    if (t < 2 / 2.75) {
      const n = t - 0.5454545454545454;
      return 7.5625 * n * n + 0.75;
    }
    if (t < 2.5 / 2.75) {
      const n = t - 0.8181818181818182;
      return 7.5625 * n * n + 0.9375;
    }
    const e = t - 2.625 / 2.75;
    return 7.5625 * e * e + 0.984375;
  }, "easeOutBounce"),
  easeInBounce: /* @__PURE__ */ c((t) => 1 - Si.easeOutBounce(1 - t), "easeInBounce"),
  easeInOutBounce: /* @__PURE__ */ c((t) => t < 0.5 ? (1 - Si.easeOutBounce(1 - 2 * t)) / 2 : (1 + Si.easeOutBounce(2 * t - 1)) / 2, "easeInOutBounce"),
  easeInElastic: /* @__PURE__ */ c((t) => t === 0 || t === 1 ? t : -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI), "easeInElastic"),
  easeOutElastic: /* @__PURE__ */ c((t) => t === 0 || t === 1 ? t : Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1, "easeOutElastic")
};
function oi(t) {
  if (t && Si[t])
    return Si[t];
  const e = foundry.canvas.animation.CanvasAnimation;
  return {
    linear: e.easeLinear,
    easeInOutCosine: e.easeInOutCosine
  }[t] ?? e.easeInOutCosine;
}
c(oi, "resolveEasing");
function Hd() {
  return ["linear", "easeInOutCosine", ...Object.keys(Si)];
}
c(Hd, "listEasingNames");
function ka(t) {
  return t <= 0.04045 ? t / 12.92 : ((t + 0.055) / 1.055) ** 2.4;
}
c(ka, "srgbToLinear");
function Ti(t) {
  return t <= 31308e-7 ? 12.92 * t : 1.055 * t ** (1 / 2.4) - 0.055;
}
c(Ti, "linearToSrgb");
function Fc(t, e, n) {
  const i = 0.4122214708 * t + 0.5363325363 * e + 0.0514459929 * n, r = 0.2119034982 * t + 0.6806995451 * e + 0.1073969566 * n, a = 0.0883024619 * t + 0.2817188376 * e + 0.6299787005 * n, o = Math.cbrt(i), s = Math.cbrt(r), l = Math.cbrt(a);
  return [
    0.2104542553 * o + 0.793617785 * s - 0.0040720468 * l,
    1.9779984951 * o - 2.428592205 * s + 0.4505937099 * l,
    0.0259040371 * o + 0.7827717662 * s - 0.808675766 * l
  ];
}
c(Fc, "linearRgbToOklab");
function qh(t, e, n) {
  const i = (t + 0.3963377774 * e + 0.2158037573 * n) ** 3, r = (t - 0.1055613458 * e - 0.0638541728 * n) ** 3, a = (t - 0.0894841775 * e - 1.291485548 * n) ** 3;
  return [
    4.0767416621 * i - 3.3077115913 * r + 0.2309699292 * a,
    -1.2684380046 * i + 2.6097574011 * r - 0.3413193965 * a,
    -0.0041960863 * i - 0.7034186147 * r + 1.707614701 * a
  ];
}
c(qh, "oklabToLinearRgb");
function $a(t) {
  return [t.r, t.g, t.b];
}
c($a, "colorToRgb");
function qd(t, e, n) {
  const i = /* @__PURE__ */ c((a) => Math.max(0, Math.min(1, a)), "clamp"), r = /* @__PURE__ */ c((a) => Math.round(i(a) * 255).toString(16).padStart(2, "0"), "toHex");
  return `#${r(t)}${r(e)}${r(n)}`;
}
c(qd, "rgbToHex");
function jh(t, e, n) {
  if (n <= 0) return t.toHTML();
  if (n >= 1) return e.toHTML();
  const i = foundry.utils.Color, [r, a, o] = t.hsl, [s, l, u] = e.hsl, d = (s - r + 0.5) % 1 - 0.5, m = (r + d * n + 1) % 1, g = a + (l - a) * n, y = o + (u - o) * n;
  return i.fromHSL([m, g, y]).toHTML();
}
c(jh, "interpolateHsl");
function Bh(t, e, n) {
  if (n <= 0) return t.toHTML();
  if (n >= 1) return e.toHTML();
  const [i, r, a] = $a(t).map(ka), [o, s, l] = $a(e).map(ka), u = Ti(i + (o - i) * n), d = Ti(r + (s - r) * n), m = Ti(a + (l - a) * n);
  return qd(u, d, m);
}
c(Bh, "interpolateRgb");
function Uh(t, e, n) {
  if (n <= 0) return t.toHTML();
  if (n >= 1) return e.toHTML();
  const [i, r, a] = $a(t).map(ka), [o, s, l] = $a(e).map(ka), [u, d, m] = Fc(i, r, a), [g, y, h] = Fc(o, s, l), p = 0.02, v = Math.sqrt(d * d + m * m), b = Math.sqrt(y * y + h * h);
  let w, C, O;
  if (v < p || b < p)
    w = u + (g - u) * n, C = d + (y - d) * n, O = m + (h - m) * n;
  else {
    const H = Math.atan2(m, d);
    let F = Math.atan2(h, y) - H;
    F > Math.PI && (F -= 2 * Math.PI), F < -Math.PI && (F += 2 * Math.PI), w = u + (g - u) * n;
    const D = v + (b - v) * n, N = H + F * n;
    C = D * Math.cos(N), O = D * Math.sin(N);
  }
  const [A, k, $] = qh(w, C, O);
  return qd(Ti(A), Ti(k), Ti($));
}
c(Uh, "interpolateOklch");
const tl = {
  hsl: jh,
  rgb: Bh,
  oklch: Uh
};
function jd(t = "hsl") {
  return tl[t] ?? tl.hsl;
}
c(jd, "getInterpolator");
function lr() {
  return Object.keys(tl);
}
c(lr, "listInterpolationModes");
function Vh(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("light-color tween: 'uuid' is required (string or array of AmbientLight document UUIDs).");
  if (t.toColor == null && t.toAlpha == null)
    throw new Error("light-color tween: at least one of 'toColor' or 'toAlpha' is required.");
  if (t.toColor != null) {
    if (typeof t.toColor != "string")
      throw new Error("light-color tween: 'toColor' must be a CSS color string.");
    if (!foundry.utils.Color.fromString(t.toColor).valid)
      throw new Error(`light-color tween: invalid target color "${t.toColor}".`);
  }
  if (t.toAlpha != null && (typeof t.toAlpha != "number" || t.toAlpha < 0 || t.toAlpha > 1))
    throw new Error("light-color tween: 'toAlpha' must be a number between 0 and 1.");
  if (t.mode && !lr().includes(t.mode))
    throw new Error(
      `light-color tween: unknown mode "${t.mode}". Available: ${lr().join(", ")}`
    );
}
c(Vh, "validate$7");
async function zh(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { Color: i } = foundry.utils, { uuid: r, toColor: a, toAlpha: o, mode: s = "oklch" } = t, l = Array.isArray(r) ? r : [r];
  if (l.length === 0)
    return console.warn("light-color tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: u = 2e3,
    easing: d = "easeInOutCosine",
    commit: m = !0,
    startEpochMS: g = null,
    signal: y = null
  } = e, h = oi(d), p = a != null, v = o != null, b = p ? jd(s) : null, w = p ? i.fromString(a) : null;
  if (p && !w.valid) throw new Error(`light-color tween: invalid target color "${a}".`);
  async function C(A) {
    var W, R;
    if (y != null && y.aborted) return !1;
    const k = await fromUuid(A);
    if (!k) return !1;
    const $ = k.object;
    if (!$) return !1;
    let H;
    if (p) {
      const U = (W = k.config) == null ? void 0 : W.color;
      U != null && U.valid || console.warn(`light-color tween: source color invalid on ${A}, using white.`), H = U != null && U.valid ? U : i.fromString("#ffffff");
    }
    const q = v ? ((R = k._source.config) == null ? void 0 : R.alpha) ?? 0.5 : null, F = { t: 0 }, D = `ambient-hue-tween:${A}`;
    n.terminateAnimation(D), y && y.addEventListener("abort", () => {
      n.terminateAnimation(D);
    }, { once: !0 });
    const N = typeof g == "number" ? Math.max(0, Math.min(u, Date.now() - g)) : 0, x = /* @__PURE__ */ c((U) => {
      const K = {};
      p && (K.color = b(H, w, U)), v && (K.alpha = q + (o - q) * U), k.updateSource({ config: K }), $.initializeLightSource();
    }, "applyFrame");
    N > 0 && (F.t = N / u, x(F.t));
    const B = await n.animate(
      [{ parent: F, attribute: "t", to: 1 }],
      {
        name: D,
        duration: u,
        easing: h,
        time: N,
        ontick: /* @__PURE__ */ c(() => x(F.t), "ontick")
      }
    );
    if (B !== !1) {
      if (y != null && y.aborted) return !1;
      const U = {};
      p && (U.color = w.toHTML()), v && (U.alpha = o), k.updateSource({ config: U }), $.initializeLightSource();
    }
    if (m && B !== !1 && k.canUserModify(game.user, "update")) {
      if (y != null && y.aborted) return !1;
      const U = {}, K = {};
      p && (U.color = H.toHTML(), K["config.color"] = w.toHTML()), v && (U.alpha = q, K["config.alpha"] = o), k.updateSource({ config: U }), await k.update(K);
    }
    return B !== !1;
  }
  return c(C, "animateOne"), (await Promise.all(l.map(C))).every(Boolean);
}
c(zh, "execute$7");
function Gh() {
  Ct({ type: "light-color", execute: zh, validate: Vh });
}
c(Gh, "registerLightColorTween");
const en = /* @__PURE__ */ new WeakMap();
function Wh(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("light-state tween: 'uuid' is required (string or array of AmbientLight document UUIDs).");
  if (typeof t.enabled != "boolean")
    throw new Error("light-state tween: 'enabled' (boolean) is required.");
}
c(Wh, "validate$6");
async function Jh(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, enabled: r } = t, a = Array.isArray(i) ? i : [i];
  if (a.length === 0)
    return console.warn("light-state tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: o = 2e3,
    easing: s = "easeInOutCosine",
    commit: l = !0,
    startEpochMS: u = null,
    signal: d = null
  } = e, m = oi(s);
  async function g(h) {
    var k, $, H, q;
    if (d != null && d.aborted) return !1;
    const p = await fromUuid(h);
    if (!p) return !1;
    const v = p.object;
    if (!v) return !1;
    const b = `ambient-state-tween:${h}`;
    n.terminateAnimation(b), d && d.addEventListener("abort", () => {
      n.terminateAnimation(b);
    }, { once: !0 });
    const w = en.get(p) ?? {
      hidden: p._source.hidden,
      alpha: ((k = p._source.config) == null ? void 0 : k.alpha) ?? 0.5
    };
    if (en.set(p, w), M(`light-state START ${r ? "ON" : "OFF"} | snap: ${JSON.stringify(w)} | _source.hidden=${p._source.hidden}, _source.config.alpha=${($ = p._source.config) == null ? void 0 : $.alpha}`), r && !w.hidden || !r && w.hidden)
      return en.delete(p), !0;
    const C = w.alpha, O = typeof u == "number" ? Math.max(0, Math.min(o, Date.now() - u)) : 0, A = /* @__PURE__ */ c((F) => {
      p.updateSource({ config: { alpha: F } }), v.initializeLightSource();
    }, "applyAlpha");
    if (r) {
      p.updateSource({ hidden: !1, config: { alpha: 0 } }), v.initializeLightSource(), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
      const F = { t: 0 };
      O > 0 && (F.t = O / o, A(C * F.t));
      const D = await n.animate(
        [{ parent: F, attribute: "t", to: 1 }],
        {
          name: b,
          duration: o,
          easing: m,
          time: O,
          ontick: /* @__PURE__ */ c(() => A(C * F.t), "ontick")
        }
      );
      return D !== !1 && !(d != null && d.aborted) && l && p.canUserModify(game.user, "update") ? (p.updateSource({ hidden: !0, config: { alpha: C } }), await p.update({ hidden: !1 }), M(`light-state FADE-IN committed. _source.hidden=${p._source.hidden}, _source.config.alpha=${(H = p._source.config) == null ? void 0 : H.alpha}`), en.delete(p)) : D === !1 || en.delete(p), D !== !1;
    } else {
      p.updateSource({ hidden: !1, config: { alpha: w.alpha } }), v.initializeLightSource();
      const F = { t: 0 };
      O > 0 && (F.t = O / o, A(C * (1 - F.t)));
      const D = await n.animate(
        [{ parent: F, attribute: "t", to: 1 }],
        {
          name: b,
          duration: o,
          easing: m,
          time: O,
          ontick: /* @__PURE__ */ c(() => A(C * (1 - F.t)), "ontick")
        }
      );
      return D !== !1 && !(d != null && d.aborted) && l && p.canUserModify(game.user, "update") ? (await p.update({ hidden: !0 }), p.updateSource({ config: { alpha: C } }), v.initializeLightSource(), M(`light-state FADE-OUT committed+restored. _source.hidden=${p._source.hidden}, _source.config.alpha=${(q = p._source.config) == null ? void 0 : q.alpha}`), en.delete(p)) : D === !1 || (p.updateSource({ hidden: !0, config: { alpha: C } }), v.initializeLightSource(), en.delete(p)), D !== !1;
    }
  }
  return c(g, "animateOne"), (await Promise.all(a.map(g))).every(Boolean);
}
c(Jh, "execute$6");
function Kh() {
  Ct({ type: "light-state", execute: Jh, validate: Wh });
}
c(Kh, "registerLightStateTween");
function Mo(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("tile-prop tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (!t.attribute || typeof t.attribute != "string")
    throw new Error("tile-prop tween: 'attribute' (string) is required — dot-path to a numeric property (e.g. 'alpha', 'rotation').");
  if (typeof t.value != "number")
    throw new Error("tile-prop tween: 'value' (number) is required — the target value to animate to.");
}
c(Mo, "validate$5");
async function No(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, attribute: r, value: a } = t, o = Array.isArray(i) ? i : [i];
  if (o.length === 0)
    return console.warn("tile-prop tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: s = 2e3,
    easing: l = "easeInOutCosine",
    commit: u = !0,
    startEpochMS: d = null,
    signal: m = null
  } = e, g = oi(l);
  async function y(p) {
    if (m != null && m.aborted) return !1;
    const v = await fromUuid(p);
    if (!v) return !1;
    const b = v.object;
    if (!b) return !1;
    const w = foundry.utils.getProperty(v._source, r);
    if (typeof w != "number")
      return console.warn(`tile-prop tween: source value at '${r}' on ${p} is not a number (got ${typeof w}). Skipping.`), !1;
    const C = `tile-prop-tween:${r}:${p}`;
    n.terminateAnimation(C), m && m.addEventListener("abort", () => {
      n.terminateAnimation(C);
    }, { once: !0 });
    const O = typeof d == "number" ? Math.max(0, Math.min(s, Date.now() - d)) : 0, A = /* @__PURE__ */ c((H) => {
      const q = w + (a - w) * H;
      v.updateSource(foundry.utils.expandObject({ [r]: q })), b.refresh();
    }, "applyFrame"), k = { t: 0 };
    O > 0 && (k.t = O / s, A(k.t));
    const $ = await n.animate(
      [{ parent: k, attribute: "t", to: 1 }],
      {
        name: C,
        duration: s,
        easing: g,
        time: O,
        ontick: /* @__PURE__ */ c(() => A(k.t), "ontick")
      }
    );
    if ($ !== !1) {
      if (m != null && m.aborted) return !1;
      v.updateSource(foundry.utils.expandObject({ [r]: a })), b.refresh();
    }
    if (u && $ !== !1 && v.canUserModify(game.user, "update")) {
      if (m != null && m.aborted) return !1;
      v.updateSource(foundry.utils.expandObject({ [r]: w })), await v.update({ [r]: a });
    }
    return $ !== !1;
  }
  return c(y, "animateOne"), (await Promise.all(o.map(y))).every(Boolean);
}
c(No, "execute$5");
function Yh() {
  Ct({ type: "tile-prop", execute: No, validate: Mo });
}
c(Yh, "registerTilePropTween");
function Qh(t) {
  if (!t.attribute || typeof t.attribute != "string")
    throw new Error("particles-prop tween: 'attribute' (string) is required — property name on canvas.particleeffects (e.g. 'alpha').");
  if (typeof t.value != "number")
    throw new Error("particles-prop tween: 'value' (number) is required — the target value to animate to.");
}
c(Qh, "validate$4");
async function Xh(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { attribute: i, value: r } = t, {
    durationMS: a = 2e3,
    easing: o = "easeInOutCosine",
    startEpochMS: s = null,
    signal: l = null
  } = e, u = canvas.particleeffects;
  if (!u)
    return console.warn("particles-prop tween: canvas.particleeffects not available."), !1;
  const d = u[i];
  if (typeof d != "number")
    return console.warn(`particles-prop tween: current value of '${i}' is not a number (got ${typeof d}). Skipping.`), !1;
  const m = oi(o), g = `particles-prop-tween:${i}`;
  n.terminateAnimation(g), l && l.addEventListener("abort", () => {
    n.terminateAnimation(g);
  }, { once: !0 });
  const y = typeof s == "number" ? Math.max(0, Math.min(a, Date.now() - s)) : 0, h = /* @__PURE__ */ c((b) => {
    u[i] = d + (r - d) * b;
  }, "applyFrame"), p = { t: 0 };
  y > 0 && (p.t = y / a, h(p.t));
  const v = await n.animate(
    [{ parent: p, attribute: "t", to: 1 }],
    {
      name: g,
      duration: a,
      easing: m,
      time: y,
      ontick: /* @__PURE__ */ c(() => h(p.t), "ontick")
    }
  );
  if (v !== !1) {
    if (l != null && l.aborted) return !1;
    u[i] = r;
  }
  return v !== !1;
}
c(Xh, "execute$4");
function Zh() {
  Ct({ type: "particles-prop", execute: Xh, validate: Qh });
}
c(Zh, "registerParticlesPropTween");
var sn, br, vr, wr, Er, Sr, Li;
const tc = class tc {
  /**
   * @param {AbortController} controller
   */
  constructor(e) {
    I(this, sn);
    I(this, br);
    I(this, vr);
    I(this, wr);
    I(this, Er);
    I(this, Sr, !1);
    I(this, Li, null);
    L(this, sn, e), L(this, wr, new Promise((n) => {
      L(this, br, n);
    })), L(this, Er, new Promise((n) => {
      L(this, vr, n);
    }));
  }
  /** @returns {Promise<boolean>} Resolves true (completed) or false (cancelled/failed). */
  get finished() {
    return f(this, wr);
  }
  /** @returns {Promise<{status: string, [k: string]: unknown}>} */
  get result() {
    return f(this, Er);
  }
  /** @returns {boolean} */
  get cancelled() {
    return f(this, sn).signal.aborted;
  }
  /** @returns {AbortSignal} */
  get signal() {
    return f(this, sn).signal;
  }
  /** @returns {string} */
  get status() {
    return f(this, Li) ? f(this, Li).status : this.cancelled ? "cancelled" : "running";
  }
  /** Abort the timeline, triggering onCancel callbacks. */
  cancel(e = "cancelled") {
    f(this, sn).signal.aborted || f(this, sn).abort(e);
  }
  /**
   * Called internally by the execution engine when the timeline finishes.
   * @param {boolean} completed - true if all steps ran, false if cancelled
   */
  _resolve(e) {
    if (f(this, Sr)) return;
    L(this, Sr, !0);
    const n = typeof e == "boolean" ? { status: e ? "completed" : "cancelled" } : e ?? { status: "cancelled" };
    L(this, Li, n), f(this, br).call(this, n.status === "completed"), f(this, vr).call(this, n);
  }
};
sn = new WeakMap(), br = new WeakMap(), vr = new WeakMap(), wr = new WeakMap(), Er = new WeakMap(), Sr = new WeakMap(), Li = new WeakMap(), c(tc, "TimelineHandle");
let nl = tc;
var Gn, Ii, Wn;
const nc = class nc {
  constructor() {
    /** @type {Map<string, Set<Function>>} */
    I(this, Gn, /* @__PURE__ */ new Map());
    /** @type {Set<string>} Signals that have been emitted (sticky) */
    I(this, Ii, /* @__PURE__ */ new Set());
    I(this, Wn, !1);
  }
  /**
   * Subscribe to a named signal.
   * @param {string} signal
   * @param {Function} listener
   * @returns {() => void} Unsubscribe function
   */
  on(e, n) {
    if (f(this, Wn)) return () => {
    };
    let i = f(this, Gn).get(e);
    return i || (i = /* @__PURE__ */ new Set(), f(this, Gn).set(e, i)), i.add(n), () => i.delete(n);
  }
  /**
   * Fire a named signal synchronously. All registered listeners are invoked.
   * The signal is recorded so that future waitFor() calls resolve immediately.
   * @param {string} signal
   */
  emit(e) {
    if (f(this, Wn)) return;
    f(this, Ii).add(e);
    const n = f(this, Gn).get(e);
    if (n)
      for (const i of n)
        i();
  }
  /**
   * Returns a promise that resolves when the signal fires, or rejects
   * if the abort signal fires first.
   * @param {string} signal
   * @param {AbortSignal} [abortSignal]
   * @returns {Promise<void>}
   */
  waitFor(e, n) {
    return f(this, Wn) ? Promise.reject(new Error("EventBus destroyed")) : f(this, Ii).has(e) ? Promise.resolve() : new Promise((i, r) => {
      if (n != null && n.aborted)
        return r(n.reason ?? "aborted");
      const a = this.on(e, () => {
        a(), o && (n == null || n.removeEventListener("abort", o)), i();
      });
      let o;
      n && (o = /* @__PURE__ */ c(() => {
        a(), r(n.reason ?? "aborted");
      }, "onAbort"), n.addEventListener("abort", o, { once: !0 }));
    });
  }
  /**
   * Tear down the bus, clearing all listeners.
   */
  destroy() {
    L(this, Wn, !0), f(this, Gn).clear(), f(this, Ii).clear();
  }
};
Gn = new WeakMap(), Ii = new WeakMap(), Wn = new WeakMap(), c(nc, "EventBus");
let il = nc;
const Bd = /* @__PURE__ */ new Map();
function ko(t, e) {
  Bd.set(t, e);
}
c(ko, "registerAwaitProvider");
function rl(t, e) {
  const n = Bd.get(t.event);
  return n ? n(t, e) : Promise.reject(new Error(`Unknown await event type: "${t.event}"`));
}
c(rl, "createAwaitPromise");
ko("signal", (t, e) => t.name ? e.eventBus.waitFor(t.name, e.signal) : Promise.reject(new Error('await signal: "name" is required')));
ko("click", (t, e) => new Promise((n, i) => {
  if (e.signal.aborted) return i(e.signal.reason ?? "aborted");
  const r = /* @__PURE__ */ c(() => {
    o(), n();
  }, "onClick"), a = /* @__PURE__ */ c(() => {
    o(), i(e.signal.reason ?? "aborted");
  }, "onAbort"), o = /* @__PURE__ */ c(() => {
    document.removeEventListener("click", r), e.signal.removeEventListener("abort", a);
  }, "cleanup");
  document.addEventListener("click", r, { once: !0 }), e.signal.addEventListener("abort", a, { once: !0 });
}));
ko("keypress", (t, e) => new Promise((n, i) => {
  if (e.signal.aborted) return i(e.signal.reason ?? "aborted");
  const r = /* @__PURE__ */ c((s) => {
    t.key && s.key !== t.key || (o(), n());
  }, "onKey"), a = /* @__PURE__ */ c(() => {
    o(), i(e.signal.reason ?? "aborted");
  }, "onAbort"), o = /* @__PURE__ */ c(() => {
    document.removeEventListener("keydown", r), e.signal.removeEventListener("abort", a);
  }, "cleanup");
  document.addEventListener("keydown", r), e.signal.addEventListener("abort", a, { once: !0 });
}));
const hi = /* @__PURE__ */ new Map();
function ep(t, e) {
  const n = hi.get(t);
  n && !n.cancelled && n.cancel("replaced-by-name"), hi.set(t, e), e.finished.then(() => {
    hi.get(t) === e && hi.delete(t);
  });
}
c(ep, "registerTimeline");
function Ud(t) {
  const e = hi.get(t);
  return e && !e.cancelled ? (e.cancel("cancelled-by-name"), !0) : !1;
}
c(Ud, "cancelTimeline");
function tp(t) {
  return hi.get(t);
}
c(tp, "getTimeline");
function Pc(t, e) {
  return t <= 0 ? Promise.resolve() : new Promise((n, i) => {
    if (e.aborted) return i(e.reason);
    const r = setTimeout(n, t);
    e.addEventListener("abort", () => {
      clearTimeout(r), i(e.reason);
    }, { once: !0 });
  });
}
c(Pc, "cancellableDelay");
var Pe, ln, Tr, Cr;
const ic = class ic {
  constructor(e) {
    /** @type {TweenTimeline} */
    I(this, Pe);
    /** @type {Array<{ type: string, params: object, opts?: object, detach: boolean }>} */
    I(this, ln, []);
    /** @type {Function|null} */
    I(this, Tr, null);
    /** @type {Function|null} */
    I(this, Cr, null);
    L(this, Pe, e);
  }
  /**
   * Add a tween entry to this step.
   * @param {string} type  Registered tween type name
   * @param {object} params  Type-specific parameters
   * @param {object} [opts]  Options (durationMS, easing, etc.)
   * @returns {StepBuilder} this
   */
  add(e, n, i) {
    return f(this, ln).push({ type: e, params: n, opts: i ?? {}, detach: !1 }), this;
  }
  /**
   * Mark the last entry as fire-and-forget (does not block step progression).
   * @returns {StepBuilder} this
   */
  detach() {
    if (f(this, ln).length === 0)
      throw new Error("StepBuilder.detach(): no entry to detach.");
    return f(this, ln)[f(this, ln).length - 1].detach = !0, this;
  }
  /**
   * Callback invoked before this step's tweens start.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  before(e) {
    return L(this, Tr, e), this;
  }
  /**
   * Callback invoked after this step's awaited tweens complete.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  after(e) {
    return L(this, Cr, e), this;
  }
  // ── Delegation to parent TweenTimeline for fluent chaining ──
  /** Start a new step (finalizes this one). */
  step() {
    return f(this, Pe).step();
  }
  /** Insert a delay between steps. */
  delay(e) {
    return f(this, Pe).delay(e);
  }
  /** Insert an await segment. */
  await(e) {
    return f(this, Pe).await(e);
  }
  /** Insert an emit segment. */
  emit(e) {
    return f(this, Pe).emit(e);
  }
  /** Insert a parallel segment. */
  parallel(e, n) {
    return f(this, Pe).parallel(e, n);
  }
  /** Register onComplete callback. */
  onComplete(e) {
    return f(this, Pe).onComplete(e);
  }
  /** Register onCancel callback. */
  onCancel(e) {
    return f(this, Pe).onCancel(e);
  }
  /** Register onError callback. */
  onError(e) {
    return f(this, Pe).onError(e);
  }
  /** Execute the timeline. */
  run(e) {
    return f(this, Pe).run(e);
  }
  /** Serialize the timeline. */
  toJSON() {
    return f(this, Pe).toJSON();
  }
  // ── Internal access ──
  /** @returns {{ entries: Array, before: Function|null, after: Function|null }} */
  _finalize() {
    return {
      entries: f(this, ln),
      before: f(this, Tr),
      after: f(this, Cr)
    };
  }
};
Pe = new WeakMap(), ln = new WeakMap(), Tr = new WeakMap(), Cr = new WeakMap(), c(ic, "StepBuilder");
let al = ic;
var xe, Ce, wt, cn, Lr, Ir, Or, Ar, Cn, ol, Y, jt, sl, Vd, ll, zd, Gd, fa, rt, Ot;
const Vt = class Vt {
  constructor() {
    I(this, Y);
    /** @type {string|null} */
    I(this, xe, null);
    /** @type {string} */
    I(this, Ce, Se.ABORT);
    /** @type {Array<object>} */
    I(this, wt, []);
    /** @type {StepBuilder|null} */
    I(this, cn, null);
    /** @type {Function|null} */
    I(this, Lr, null);
    /** @type {Function|null} */
    I(this, Ir, null);
    /** @type {Function|null} */
    I(this, Or, null);
    /** @type {Function|null} */
    I(this, Ar, null);
  }
  /**
   * Register this timeline in the named registry. Starting a new
   * timeline with the same name cancels the previous one.
   * @param {string} name
   * @returns {TweenTimeline} this
   */
  name(e) {
    return L(this, xe, e), this;
  }
  /**
   * Set the error policy for step execution.
   * @param {"abort"|"continue"} policy
   * @returns {TweenTimeline} this
   */
  errorPolicy(e) {
    if (e !== Se.ABORT && e !== Se.CONTINUE)
      throw new Error(`Invalid error policy: "${e}". Use "abort" or "continue".`);
    return L(this, Ce, e), this;
  }
  /**
   * Start a new step. Finalizes the previous step if one is open.
   * @returns {StepBuilder}
   */
  step() {
    return S(this, Y, jt).call(this), L(this, cn, new al(this)), f(this, cn);
  }
  /**
   * Insert a delay (in ms) between the previous step and the next.
   * @param {number} ms
   * @returns {TweenTimeline} this
   */
  delay(e) {
    return S(this, Y, jt).call(this), f(this, wt).push({ kind: "delay", ms: e }), this;
  }
  /**
   * Pause execution until an event occurs.
   * @param {object} config  e.g. { event: "click" }, { event: "signal", name: "fog-done" }
   * @returns {TweenTimeline} this
   */
  await(e) {
    return S(this, Y, jt).call(this), f(this, wt).push({ kind: "await", config: e }), this;
  }
  /**
   * Fire a named signal (instant, non-blocking).
   * @param {string} signal  Signal name
   * @returns {TweenTimeline} this
   */
  emit(e) {
    return S(this, Y, jt).call(this), f(this, wt).push({ kind: "emit", signal: e }), this;
  }
  /**
   * Fork N branches with a join strategy.
   * @param {Array<(tl: TweenTimeline) => void>} branchFns  Callbacks that build each branch
   * @param {object} [opts]
   * @param {"all"|"any"|number} [opts.join="all"]  Join strategy
   * @param {"detach"|"cancel"} [opts.overflow="detach"]  What to do with un-joined branches
   * @returns {TweenTimeline} this
   */
  parallel(e, n = {}) {
    S(this, Y, jt).call(this);
    const i = n.join ?? "all", r = n.overflow ?? "detach";
    if (i !== "all" && i !== "any" && (typeof i != "number" || i < 1 || i > e.length))
      throw new Error(`parallel: join must be "all", "any", or 1..${e.length}, got ${JSON.stringify(i)}`);
    if (r !== "detach" && r !== "cancel")
      throw new Error(`parallel: overflow must be "detach" or "cancel", got ${JSON.stringify(r)}`);
    const a = e.map((o) => {
      var l;
      const s = new Vt();
      return o(s), S(l = s, Y, jt).call(l), f(s, wt);
    });
    return f(this, wt).push({ kind: "parallel", branches: a, join: i, overflow: r }), this;
  }
  /**
   * Callback invoked before the first step runs.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  beforeAll(e) {
    return L(this, Lr, e), this;
  }
  /**
   * Callback invoked on successful completion.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onComplete(e) {
    return L(this, Ir, e), this;
  }
  /**
   * Callback invoked on cancellation (mutually exclusive with onComplete).
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onCancel(e) {
    return L(this, Or, e), this;
  }
  /**
   * Callback invoked on runtime failure (mutually exclusive with onComplete/onCancel).
   * @param {(outcome: object) => void} fn
   * @returns {TweenTimeline} this
   */
  onError(e) {
    return L(this, Ar, e), this;
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
  run(e = {}) {
    S(this, Y, jt).call(this);
    const n = new AbortController();
    e.signal && (e.signal.aborted ? n.abort(e.signal.reason ?? "parent-aborted") : e.signal.addEventListener("abort", () => {
      n.signal.aborted || n.abort(e.signal.reason ?? "parent-aborted");
    }, { once: !0 }));
    const i = new nl(n);
    f(this, xe) && ep(f(this, xe), i);
    const r = e.broadcast ?? game.user.isGM, a = e.commit ?? game.user.isGM, o = e.startEpochMS ?? Date.now();
    r && f(this, xe) && da(Rd, {
      name: f(this, xe),
      data: this.toJSON(),
      startEpochMS: o
    });
    const s = new il(), l = {
      signal: i.signal,
      commit: a,
      startEpochMS: o,
      eventBus: s,
      errors: [],
      detachedPromises: []
    };
    return S(this, Y, Vd).call(this, i, l).then((u) => {
      var d, m, g;
      s.destroy(), i._resolve(u), u.status === Zt.COMPLETED ? (d = f(this, Ir)) == null || d.call(this) : u.status === Zt.CANCELLED ? ((m = f(this, Or)) == null || m.call(this), r && f(this, xe) && da(Zs, {
        name: f(this, xe),
        reason: u.reason
      })) : ((g = f(this, Ar)) == null || g.call(this, u), r && f(this, xe) && da(Zs, {
        name: f(this, xe),
        reason: "failed"
      }));
    }), i;
  }
  /**
   * Serialize the timeline to a JSON-safe object.
   * @returns {object}
   */
  toJSON() {
    var i;
    S(this, Y, jt).call(this);
    const n = { timeline: S(i = Vt, Cn, ol).call(i, f(this, wt)) };
    return f(this, xe) && (n.name = f(this, xe)), f(this, Ce) !== Se.ABORT && (n.errorPolicy = f(this, Ce)), n;
  }
};
xe = new WeakMap(), Ce = new WeakMap(), wt = new WeakMap(), cn = new WeakMap(), Lr = new WeakMap(), Ir = new WeakMap(), Or = new WeakMap(), Ar = new WeakMap(), Cn = new WeakSet(), ol = /* @__PURE__ */ c(function(e) {
  const n = [];
  for (const i of e)
    if (i.kind === "delay")
      n.push({ delay: i.ms });
    else if (i.kind === "await")
      n.push({ await: i.config });
    else if (i.kind === "emit")
      n.push({ emit: i.signal });
    else if (i.kind === "parallel")
      n.push({
        parallel: {
          branches: i.branches.map((r) => {
            var a;
            return S(a = Vt, Cn, ol).call(a, r);
          }),
          join: i.join,
          overflow: i.overflow
        }
      });
    else {
      const r = i.data.entries.map((a) => {
        const o = { type: a.type, params: a.params };
        return Object.keys(a.opts).length > 0 && (o.opts = a.opts), a.detach && (o.detach = !0), o;
      });
      n.push(r);
    }
  return n;
}, "#serializeSegments"), Y = new WeakSet(), // ── Private ─────────────────────────────────────────────────────────
jt = /* @__PURE__ */ c(function() {
  f(this, cn) && (f(this, wt).push({ kind: "step", data: f(this, cn)._finalize() }), L(this, cn, null));
}, "#finalizeCurrentStep"), sl = /* @__PURE__ */ c(function(e) {
  e.length !== 0 && Promise.allSettled(e).catch(() => {
  });
}, "#drainDetached"), Vd = /* @__PURE__ */ c(async function(e, n) {
  var i, r;
  try {
    if (n.signal.aborted) return S(this, Y, rt).call(this, n.signal.reason);
    const a = await S(this, Y, fa).call(this, f(this, Lr), mt.BEFORE_ALL, null);
    if (a) {
      if (f(this, Ce) === Se.ABORT) return a;
      n.errors.push(a);
    }
    const o = await S(this, Y, ll).call(this, f(this, wt), n);
    if (o)
      return S(i = Vt, Cn, sl).call(i, n.detachedPromises), o;
    if (!n.signal.aborted) {
      const s = await Promise.allSettled(n.detachedPromises);
      for (const l of s)
        if (l.status === "rejected") {
          const u = S(this, Y, Ot).call(this, l.reason, mt.ENTRY);
          if (f(this, Ce) === Se.ABORT) return u;
          n.errors.push(u);
        }
    }
    return n.signal.aborted ? S(this, Y, rt).call(this, n.signal.reason) : {
      status: Zt.COMPLETED,
      ...n.errors.length > 0 ? { errors: n.errors } : {}
    };
  } catch (a) {
    return S(r = Vt, Cn, sl).call(r, n.detachedPromises), n.signal.aborted ? S(this, Y, rt).call(this, n.signal.reason) : (console.error("TweenTimeline execution error:", a), S(this, Y, Ot).call(this, a, mt.RUNTIME));
  }
}, "#execute"), ll = /* @__PURE__ */ c(async function(e, n) {
  let i = -1, r = 0;
  for (const a of e) {
    if (n.signal.aborted) return S(this, Y, rt).call(this, n.signal.reason);
    if (a.kind === "delay") {
      try {
        await Pc(a.ms, n.signal);
      } catch {
        return S(this, Y, rt).call(this, n.signal.reason);
      }
      r += a.ms;
      continue;
    }
    if (a.kind === "await") {
      try {
        let h = rl(a.config, {
          signal: n.signal,
          eventBus: n.eventBus
        });
        const p = a.config.timeout;
        typeof p == "number" && p > 0 && (h = Promise.race([
          h,
          Pc(p, n.signal)
        ])), await h;
      } catch (h) {
        if (n.signal.aborted) return S(this, Y, rt).call(this, n.signal.reason);
        const p = S(this, Y, Ot).call(this, h, mt.AWAIT);
        if (f(this, Ce) === Se.ABORT) return p;
        n.errors.push(p);
      }
      continue;
    }
    if (a.kind === "emit") {
      try {
        n.eventBus.emit(a.signal);
      } catch (h) {
        const p = S(this, Y, Ot).call(this, h, mt.EMIT);
        if (f(this, Ce) === Se.ABORT) return p;
        n.errors.push(p);
      }
      continue;
    }
    if (a.kind === "parallel") {
      const h = await S(this, Y, zd).call(this, a, n, r);
      if (h) return h;
      continue;
    }
    i += 1;
    const { entries: o, before: s, after: l } = a.data, u = await S(this, Y, fa).call(this, s, mt.BEFORE_STEP, i);
    if (u) {
      if (f(this, Ce) === Se.ABORT) return u;
      n.errors.push(u);
      continue;
    }
    if (n.signal.aborted) return S(this, Y, rt).call(this, n.signal.reason);
    const d = [];
    let m = 0;
    for (const h of o) {
      const p = Pi(h.type);
      if (!p) {
        const C = S(this, Y, Ot).call(this, new Error(`TweenTimeline: unknown tween type "${h.type}"`), mt.ENTRY, i, h.type);
        if (f(this, Ce) === Se.ABORT) return C;
        n.errors.push(C), console.warn(C.error.message);
        continue;
      }
      const v = {
        ...h.opts,
        commit: n.commit,
        startEpochMS: n.startEpochMS + r,
        signal: n.signal
      }, b = v.durationMS ?? 2e3, w = Promise.resolve().then(() => p.execute(h.params, v)).then((C) => C === !1 ? {
        ok: !1,
        failure: S(this, Y, Ot).call(this, new Error("Tween entry returned false."), mt.ENTRY, i, h.type)
      } : { ok: !0 }).catch((C) => ({
        ok: !1,
        failure: S(this, Y, Ot).call(this, C, mt.ENTRY, i, h.type)
      }));
      h.detach ? n.detachedPromises.push(w) : (d.push(w), m = Math.max(m, b));
    }
    const g = await S(this, Y, Gd).call(this, d, n.signal);
    if (g === null) return S(this, Y, rt).call(this, n.signal.reason);
    for (const h of g)
      if (!h.ok) {
        if (f(this, Ce) === Se.ABORT) return h.failure;
        n.errors.push(h.failure), console.warn("TweenTimeline: entry failed:", h.failure.error);
      }
    const y = await S(this, Y, fa).call(this, l, mt.AFTER_STEP, i);
    if (y) {
      if (f(this, Ce) === Se.ABORT) return y;
      n.errors.push(y);
    }
    if (n.signal.aborted) return S(this, Y, rt).call(this, n.signal.reason);
    r += m;
  }
  return null;
}, "#executeSegments"), zd = /* @__PURE__ */ c(async function(e, n, i = 0) {
  const { branches: r, join: a, overflow: o } = e, s = r.length, l = a === "all" ? s : a === "any" ? 1 : a, u = r.map(() => {
    const h = new AbortController();
    return n.signal.aborted ? h.abort(n.signal.reason ?? "parent-aborted") : n.signal.addEventListener("abort", () => {
      h.signal.aborted || h.abort(n.signal.reason ?? "parent-aborted");
    }, { once: !0 }), h;
  });
  let d = 0, m = 0;
  const g = new Array(s).fill(null);
  let y;
  return new Promise((h) => {
    let p = !1;
    const v = /* @__PURE__ */ c(() => {
      if (p) return;
      if (d >= l) {
        p = !0, b(), h(null);
        return;
      }
      const w = s - d - m;
      if (d + w < l) {
        p = !0, b();
        const C = g.filter((A) => A && A.status === Zt.FAILED).map((A) => A), O = S(this, Y, Ot).call(this, new Error(`parallel: join target ${l} impossible (${d} completed, ${m} failed)`), mt.PARALLEL);
        f(this, Ce) === Se.ABORT ? h(O) : (n.errors.push(O), n.errors.push(...C), h(null));
      }
    }, "checkJoin"), b = /* @__PURE__ */ c(() => {
      if (o === "cancel")
        for (let w = 0; w < s; w++)
          !g[w] && !u[w].signal.aborted && u[w].abort("overflow-cancel");
      for (let w = 0; w < s; w++)
        g[w] || n.detachedPromises.push(y[w]);
    }, "applyOverflow");
    if (y = r.map((w, C) => {
      const O = {
        signal: u[C].signal,
        commit: n.commit,
        startEpochMS: n.startEpochMS + i,
        eventBus: n.eventBus,
        // shared
        errors: n.errors,
        // shared
        detachedPromises: n.detachedPromises
        // shared
      };
      return S(this, Y, ll).call(this, w, O).then((A) => {
        if (A)
          if (A.status === Zt.CANCELLED) {
            if (u[C].signal.aborted) {
              g[C] = A;
              return;
            }
            g[C] = A, m++;
          } else
            g[C] = A, m++;
        else
          g[C] = { status: Zt.COMPLETED }, d++;
        v();
      });
    }), n.signal.aborted) {
      p = !0, h(S(this, Y, rt).call(this, n.signal.reason));
      return;
    }
    n.signal.addEventListener("abort", () => {
      p || (p = !0, h(S(this, Y, rt).call(this, n.signal.reason)));
    }, { once: !0 });
  });
}, "#executeParallel"), /**
 * @param {Array<Promise<{ok: boolean, failure?: object}>>} stepPromises
 * @param {AbortSignal} signal
 * @returns {Promise<Array<{ok: boolean, failure?: object}>|null>}
 */
Gd = /* @__PURE__ */ c(function(e, n) {
  return e.length === 0 ? Promise.resolve([]) : n.aborted ? Promise.resolve(null) : new Promise((i, r) => {
    const a = /* @__PURE__ */ c(() => i(null), "onAbort");
    n.addEventListener("abort", a, { once: !0 }), Promise.all(e).then((o) => {
      n.removeEventListener("abort", a), i(o);
    }).catch((o) => {
      n.removeEventListener("abort", a), r(o);
    });
  });
}, "#waitForStep"), fa = /* @__PURE__ */ c(async function(e, n, i) {
  if (!e) return null;
  try {
    return await e(), null;
  } catch (r) {
    const a = S(this, Y, Ot).call(this, r, n, i ?? void 0);
    return f(this, Ce) === Se.CONTINUE && console.warn(`TweenTimeline: hook failure in ${n}:`, r), a;
  }
}, "#runHook"), /** @param {unknown} reason */
rt = /* @__PURE__ */ c(function(e) {
  let n;
  return typeof e == "string" ? n = e : e instanceof Error && (n = e.message), {
    status: Zt.CANCELLED,
    ...n ? { reason: n } : {}
  };
}, "#cancelledOutcome"), /**
 * @param {unknown} err
 * @param {string} phase
 * @param {number} [stepIndex]
 * @param {string} [entryType]
 */
Ot = /* @__PURE__ */ c(function(e, n, i, r) {
  const a = e instanceof Error ? e : new Error(String(e));
  return {
    status: Zt.FAILED,
    error: a,
    phase: n,
    ...typeof i == "number" ? { stepIndex: i } : {},
    ...r ? { entryType: r } : {}
  };
}, "#failedOutcome"), I(Vt, Cn), c(Vt, "TweenTimeline");
let _a = Vt;
function Vl(t) {
  if (!t || typeof t != "object")
    throw new Error("Sequence JSON: data must be an object.");
  if (!Array.isArray(t.timeline))
    throw new Error("Sequence JSON: 'timeline' must be an array.");
  if (t.name != null && typeof t.name != "string")
    throw new Error("Sequence JSON: 'name' must be a string.");
  if (t.errorPolicy != null && t.errorPolicy !== Se.ABORT && t.errorPolicy !== Se.CONTINUE)
    throw new Error(`Sequence JSON: 'errorPolicy' must be "abort" or "continue".`);
  Wd(t.timeline, "timeline", 0);
}
c(Vl, "validateSequenceJSON");
function Wd(t, e, n = 0) {
  for (let i = 0; i < t.length; i++) {
    const r = t[i], a = `${e}[${i}]`;
    if (Array.isArray(r)) {
      if (r.length === 0)
        throw new Error(`Sequence JSON: ${a} is an empty step.`);
      for (let o = 0; o < r.length; o++) {
        const s = r[o];
        if (!s || typeof s != "object")
          throw new Error(`Sequence JSON: ${a}[${o}] must be an object.`);
        if (typeof s.type != "string" || !s.type)
          throw new Error(`Sequence JSON: ${a}[${o}].type must be a non-empty string.`);
        if (s.params != null && typeof s.params != "object")
          throw new Error(`Sequence JSON: ${a}[${o}].params must be an object.`);
        if (s.opts != null && typeof s.opts != "object")
          throw new Error(`Sequence JSON: ${a}[${o}].opts must be an object.`);
        if (s.detach != null && typeof s.detach != "boolean")
          throw new Error(`Sequence JSON: ${a}[${o}].detach must be a boolean.`);
      }
      continue;
    }
    if (typeof r != "object")
      throw new Error(`Sequence JSON: ${a} must be a step array or an object.`);
    if (r.delay !== void 0) {
      if (typeof r.delay != "number" || r.delay < 0)
        throw new Error(`Sequence JSON: ${a}.delay must be a non-negative number.`);
      continue;
    }
    if (r.await !== void 0) {
      const o = r.await;
      if (!o || typeof o != "object")
        throw new Error(`Sequence JSON: ${a}.await must be an object.`);
      if (typeof o.event != "string" || !o.event)
        throw new Error(`Sequence JSON: ${a}.await.event must be a non-empty string.`);
      if (o.event === "signal" && (typeof o.name != "string" || !o.name))
        throw new Error(`Sequence JSON: ${a}.await signal requires a non-empty "name".`);
      if (o.event === "keypress" && o.key != null && typeof o.key != "string")
        throw new Error(`Sequence JSON: ${a}.await keypress "key" must be a string.`);
      if (o.timeout != null && (typeof o.timeout != "number" || o.timeout <= 0))
        throw new Error(`Sequence JSON: ${a}.await.timeout must be a positive number.`);
      continue;
    }
    if (r.emit !== void 0) {
      if (typeof r.emit != "string" || !r.emit)
        throw new Error(`Sequence JSON: ${a}.emit must be a non-empty string.`);
      continue;
    }
    if (r.parallel !== void 0) {
      if (n >= 8)
        throw new Error(`Sequence JSON: ${a} exceeds maximum parallel nesting depth of 8.`);
      const o = r.parallel;
      if (!o || typeof o != "object")
        throw new Error(`Sequence JSON: ${a}.parallel must be an object.`);
      if (!Array.isArray(o.branches) || o.branches.length === 0)
        throw new Error(`Sequence JSON: ${a}.parallel.branches must be a non-empty array.`);
      const s = o.join ?? "all";
      if (s !== "all" && s !== "any" && (typeof s != "number" || !Number.isInteger(s) || s < 1 || s > o.branches.length))
        throw new Error(`Sequence JSON: ${a}.parallel.join must be "all", "any", or 1..${o.branches.length}.`);
      const l = o.overflow ?? "detach";
      if (l !== "detach" && l !== "cancel")
        throw new Error(`Sequence JSON: ${a}.parallel.overflow must be "detach" or "cancel".`);
      for (let u = 0; u < o.branches.length; u++) {
        const d = o.branches[u];
        if (!Array.isArray(d))
          throw new Error(`Sequence JSON: ${a}.parallel.branches[${u}] must be an array.`);
        Wd(d, `${a}.parallel.branches[${u}]`, n + 1);
      }
      continue;
    }
    throw new Error(`Sequence JSON: ${a} is not a recognized segment (step array, delay, await, emit, or parallel).`);
  }
}
c(Wd, "validateSegmentsJSON");
function Jd(t) {
  Vl(t), Kd(t.timeline, "timeline");
}
c(Jd, "validateSequenceSemantics");
function Kd(t, e) {
  for (let n = 0; n < t.length; n++) {
    const i = t[n], r = `${e}[${n}]`;
    if (Array.isArray(i))
      for (let a = 0; a < i.length; a++) {
        const o = i[a];
        try {
          Hh(o.type, o.params ?? {});
        } catch (s) {
          throw new Error(`Sequence JSON: ${r}[${a}] failed semantic validation: ${s.message}`);
        }
      }
    else if (i.parallel)
      for (let a = 0; a < i.parallel.branches.length; a++)
        Kd(i.parallel.branches[a], `${r}.parallel.branches[${a}]`);
  }
}
c(Kd, "validateSegmentsSemantics");
function zl(t, e = {}) {
  Vl(t), e.validateSemantics && Jd(t);
  const n = new _a();
  return t.name && n.name(t.name), t.errorPolicy && n.errorPolicy(t.errorPolicy), Yd(t.timeline, n), n;
}
c(zl, "compileSequence");
function Yd(t, e) {
  for (const n of t) {
    if (Array.isArray(n)) {
      const i = e.step();
      for (const r of n)
        i.add(r.type, r.params ?? {}, r.opts), r.detach && i.detach();
      continue;
    }
    if (n.delay !== void 0) {
      e.delay(n.delay);
      continue;
    }
    if (n.await !== void 0) {
      e.await(n.await);
      continue;
    }
    if (n.emit !== void 0) {
      e.emit(n.emit);
      continue;
    }
    if (n.parallel !== void 0) {
      const i = n.parallel, r = i.branches.map((a) => (o) => Yd(a, o));
      e.parallel(r, {
        join: i.join ?? "all",
        overflow: i.overflow ?? "detach"
      });
    }
  }
}
c(Yd, "compileSegments");
function np(t) {
  Vl(t), Jd(t);
}
c(np, "validate$3");
async function ip(t, e = {}) {
  return zl(t, { validateSemantics: !0 }).run({
    broadcast: !1,
    commit: e.commit,
    startEpochMS: e.startEpochMS,
    signal: e.signal
  }).finished;
}
c(ip, "execute$3");
function rp() {
  Ct({ type: "sequence", execute: ip, validate: np });
}
c(rp, "registerSequenceTween");
function ap(t) {
  if (t.x == null && t.y == null && t.scale == null)
    throw new Error("camera-pan tween: at least one of 'x', 'y', or 'scale' is required.");
  if (t.x != null && typeof t.x != "number")
    throw new Error("camera-pan tween: 'x' must be a number.");
  if (t.y != null && typeof t.y != "number")
    throw new Error("camera-pan tween: 'y' must be a number.");
  if (t.scale != null && (typeof t.scale != "number" || t.scale <= 0))
    throw new Error("camera-pan tween: 'scale' must be a positive number.");
}
c(ap, "validate$2");
async function op(t, e = {}) {
  const {
    durationMS: n = 2e3,
    startEpochMS: i = null,
    signal: r = null
  } = e;
  if (r != null && r.aborted) return !1;
  const a = typeof i == "number" ? Math.max(0, Math.min(n, Date.now() - i)) : 0, o = Math.max(0, n - a), s = { duration: o };
  if (t.x != null && (s.x = t.x), t.y != null && (s.y = t.y), t.scale != null && (s.scale = t.scale), o <= 0)
    return await canvas.animatePan({ ...s, duration: 0 }), !0;
  const l = canvas.animatePan(s);
  return r ? new Promise((u) => {
    const d = /* @__PURE__ */ c(() => {
      u(!1);
    }, "onAbort");
    r.addEventListener("abort", d, { once: !0 }), l.then(() => {
      r.removeEventListener("abort", d), u(!r.aborted);
    }).catch(() => {
      r.removeEventListener("abort", d), u(!1);
    });
  }) : (await l, !0);
}
c(op, "execute$2");
function sp() {
  Ct({ type: "camera-pan", execute: op, validate: ap });
}
c(sp, "registerCameraPanTween");
function lp(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((i) => !i || typeof i != "string"))
    throw new Error("tile-tint tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (t.toColor == null || typeof t.toColor != "string")
    throw new Error("tile-tint tween: 'toColor' (CSS color string) is required.");
  if (!foundry.utils.Color.fromString(t.toColor).valid)
    throw new Error(`tile-tint tween: invalid target color "${t.toColor}".`);
  if (t.mode && !lr().includes(t.mode))
    throw new Error(
      `tile-tint tween: unknown mode "${t.mode}". Available: ${lr().join(", ")}`
    );
}
c(lp, "validate$1");
async function cp(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { Color: i } = foundry.utils, { uuid: r, toColor: a, mode: o = "oklch" } = t, s = Array.isArray(r) ? r : [r];
  if (s.length === 0)
    return console.warn("tile-tint tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: l = 2e3,
    easing: u = "easeInOutCosine",
    commit: d = !0,
    startEpochMS: m = null,
    signal: g = null
  } = e, y = oi(u), h = jd(o), p = i.fromString(a);
  if (!p.valid) throw new Error(`tile-tint tween: invalid target color "${a}".`);
  async function v(w) {
    var x, B;
    if (g != null && g.aborted) return !1;
    const C = await fromUuid(w);
    if (!C) return !1;
    const O = C.object;
    if (!O) return !1;
    const A = ((B = (x = C._source) == null ? void 0 : x.texture) == null ? void 0 : B.tint) ?? "#ffffff", k = i.fromString(A);
    k.valid || console.warn(`tile-tint tween: source tint invalid on ${w}, using white.`);
    const $ = k.valid ? k : i.fromString("#ffffff"), H = { t: 0 }, q = `tile-tint-tween:${w}`;
    n.terminateAnimation(q), g && g.addEventListener("abort", () => {
      n.terminateAnimation(q);
    }, { once: !0 });
    const F = typeof m == "number" ? Math.max(0, Math.min(l, Date.now() - m)) : 0, D = /* @__PURE__ */ c((W) => {
      const R = h($, p, W);
      C.updateSource({ texture: { tint: R } }), O.refresh();
    }, "applyFrame");
    F > 0 && (H.t = F / l, D(H.t));
    const N = await n.animate(
      [{ parent: H, attribute: "t", to: 1 }],
      {
        name: q,
        duration: l,
        easing: y,
        time: F,
        ontick: /* @__PURE__ */ c(() => D(H.t), "ontick")
      }
    );
    if (N !== !1) {
      if (g != null && g.aborted) return !1;
      C.updateSource({ texture: { tint: p.toHTML() } }), O.refresh();
    }
    if (d && N !== !1 && C.canUserModify(game.user, "update")) {
      if (g != null && g.aborted) return !1;
      C.updateSource({ texture: { tint: $.toHTML() } }), await C.update({ "texture.tint": p.toHTML() });
    }
    return N !== !1;
  }
  return c(v, "animateOne"), (await Promise.all(s.map(v))).every(Boolean);
}
c(cp, "execute$1");
function up() {
  Ct({ type: "tile-tint", execute: cp, validate: lp });
}
c(up, "registerTileTintTween");
function dp(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("tile-scale tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (typeof t.toScale != "number" || t.toScale <= 0)
    throw new Error("tile-scale tween: 'toScale' must be a positive number.");
  for (const n of ["baseWidth", "baseHeight", "centerX", "centerY"])
    if (typeof t[n] != "number")
      throw new Error(`tile-scale tween: '${n}' (number) is required.`);
}
c(dp, "validate");
async function fp(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, toScale: r, baseWidth: a, baseHeight: o, centerX: s, centerY: l } = t, u = Array.isArray(i) ? i : [i];
  if (u.length === 0) return !0;
  const {
    durationMS: d = 2e3,
    easing: m = "easeInOutCosine",
    commit: g = !0,
    startEpochMS: y = null,
    signal: h = null
  } = e, p = oi(m), v = a * r, b = o * r, w = s - v / 2, C = l - b / 2;
  async function O(k) {
    if (h != null && h.aborted) return !1;
    const $ = await fromUuid(k);
    if (!$) return !1;
    const H = $.object;
    if (!H) return !1;
    const q = $._source.width, F = $._source.height, D = $._source.x, N = $._source.y, x = `tile-scale-tween:${k}`;
    n.terminateAnimation(x), h && h.addEventListener("abort", () => {
      n.terminateAnimation(x);
    }, { once: !0 });
    const B = typeof y == "number" ? Math.max(0, Math.min(d, Date.now() - y)) : 0, W = /* @__PURE__ */ c((K) => {
      const ae = q + (v - q) * K, X = F + (b - F) * K, te = D + (w - D) * K, Pt = N + (C - N) * K;
      $.updateSource({ width: ae, height: X, x: te, y: Pt }), H.refresh();
    }, "applyFrame"), R = { t: 0 };
    B > 0 && (R.t = B / d, W(R.t));
    const U = await n.animate(
      [{ parent: R, attribute: "t", to: 1 }],
      {
        name: x,
        duration: d,
        easing: p,
        time: B,
        ontick: /* @__PURE__ */ c(() => W(R.t), "ontick")
      }
    );
    if (U !== !1) {
      if (h != null && h.aborted) return !1;
      $.updateSource({ width: v, height: b, x: w, y: C }), H.refresh();
    }
    if (g && U !== !1 && $.canUserModify(game.user, "update")) {
      if (h != null && h.aborted) return !1;
      $.updateSource({ width: q, height: F, x: D, y: N }), await $.update({ width: v, height: b, x: w, y: C });
    }
    return U !== !1;
  }
  return c(O, "animateOne"), (await Promise.all(u.map(O))).every(Boolean);
}
c(fp, "execute");
function mp() {
  Ct({ type: "tile-scale", execute: fp, validate: dp });
}
c(mp, "registerTileScaleTween");
async function gp(t, e, n = {}) {
  if (!game.user.isGM)
    return ui.notifications.warn("Only the GM can dispatch tweens."), !1;
  const i = Pi(t);
  if (!i)
    throw new Error(`Unknown tween type: "${t}". Registered types: ${el().join(", ")}`);
  i.validate(e);
  const { durationMS: r = 2e3, easing: a = "easeInOutCosine", commit: o = !0 } = n, s = Date.now();
  return da(xd, {
    type: t,
    params: e,
    durationMS: r,
    easing: a,
    startEpochMS: s,
    commit: !1
  }), i.execute(e, { durationMS: r, easing: a, commit: o, startEpochMS: s });
}
c(gp, "dispatchTween");
function hp(t) {
  const { type: e, params: n, durationMS: i, easing: r, startEpochMS: a, commit: o } = t ?? {}, s = Pi(e);
  if (!s) {
    console.warn(`[${T}] Received unknown tween type over socket: "${e}"`);
    return;
  }
  s.execute(n, {
    durationMS: i,
    easing: r,
    commit: o ?? !1,
    startEpochMS: a
  });
}
c(hp, "handleTweenSocketMessage");
Gh();
Kh();
Yh();
Zh();
rp();
sp();
up();
mp();
Ct({ type: "token-prop", execute: No, validate: Mo });
Ct({ type: "drawing-prop", execute: No, validate: Mo });
Ct({ type: "sound-prop", execute: No, validate: Mo });
Ul(xd, hp);
Ul(Rd, pp);
Ul(Zs, yp);
function pp(t) {
  const { data: e, startEpochMS: n } = t ?? {};
  if (!e) {
    console.warn(`[${T}] Received empty tween-sequence socket message.`);
    return;
  }
  try {
    zl(e, { validateSemantics: !0 }).run({ commit: !1, startEpochMS: n, broadcast: !1 });
  } catch (i) {
    console.error(`[${T}] Failed to run received tween sequence:`, i);
  }
}
c(pp, "handleSequenceSocketMessage");
function yp(t) {
  const { name: e } = t ?? {};
  e && Ud(e);
}
c(yp, "handleSequenceCancelMessage");
function bp() {
  Hooks.once("ready", () => {
    Rh();
    const t = game.modules.get(T);
    t.api || (t.api = {}), t.api.tween = {
      dispatch: gp,
      types: el,
      Timeline: _a,
      ErrorPolicy: Se,
      compileSequence: zl,
      cancelTimeline: Ud,
      getTimeline: tp
    }, console.log(`[${T}] Tween API registered. Types: ${el().join(", ")}`);
  });
}
c(bp, "registerTweenHooks");
bp();
const vp = ["tag", "tag-all", "id", "tags-any", "tags-all"], wp = /* @__PURE__ */ new Set(["tags-any", "tags-all"]);
function Gl(t) {
  if (!t || typeof t != "string")
    return { type: "unknown", value: t ?? "" };
  if (t.startsWith("$"))
    return { type: "special", value: t };
  for (const e of vp)
    if (t.startsWith(`${e}:`)) {
      const n = t.slice(e.length + 1), i = wp.has(e) ? n.split(",").map((r) => r.trim()) : n;
      return { type: e, value: i };
    }
  return t.includes(".") ? { type: "uuid", value: t } : { type: "unknown", value: t };
}
c(Gl, "parseSelector");
function Ep(t) {
  if (!t) return "";
  const { type: e, value: n } = t;
  if (e === "special" || e === "uuid" || e === "unknown")
    return Array.isArray(n) ? n.join(",") : n ?? "";
  const i = Array.isArray(n) ? n.join(",") : n ?? "";
  return `${e}:${i}`;
}
c(Ep, "buildSelector");
function Qd(t, e = "first") {
  return t != null && t.length ? t.length === 1 ? e === "first-all" || e === "all" ? `tag-all:${t[0]}` : `tag:${t[0]}` : e === "any" ? `tags-any:${t.join(",")}` : e === "all" ? `tags-all:${t.join(",")}` : e === "first-all" ? `tags-all:${t.join(",")}` : `tags-any:${t.join(",")}` : "";
}
c(Qd, "buildTagSelector");
function $o(t) {
  if (!t) return null;
  if (t.documentName || t._source !== void 0) {
    const e = t.object;
    return e ? { placeable: e, doc: t } : null;
  }
  return t.document ? { placeable: t, doc: t.document } : null;
}
c($o, "normalizePlaceable");
function Xd() {
  var t;
  return window.Tagger ?? ((t = game.modules.get("tagger")) == null ? void 0 : t.api) ?? null;
}
c(Xd, "getTaggerAPI");
function _o(t, e) {
  if (!t) return null;
  const n = e ?? canvas.scene;
  if (!n) return null;
  const i = Gl(t);
  switch (i.type) {
    case "special":
      return Sp(i.value);
    case "tag":
      return xc(i.value, n, !1);
    case "tag-all":
      return xc(i.value, n, !0);
    case "id":
      return Tp(i.value, n);
    case "tags-any":
      return Rc(i.value, n, !0);
    case "tags-all":
      return Rc(i.value, n, !1);
    case "uuid":
      return Cp(i.value);
    default:
      return null;
  }
}
c(_o, "resolveSelector");
function Sp(t) {
  var e;
  if (t === "$particles") {
    if (!((e = game.modules.get("fxmaster")) != null && e.active))
      return console.warn(`[${T}] Picker: FXMaster not active, cannot resolve "$particles".`), null;
    const n = canvas.particleeffects;
    return n ? { kind: "particles", documents: [], placeables: [], target: n } : null;
  }
  return null;
}
c(Sp, "resolveSpecial");
function xc(t, e, n) {
  const i = Xd();
  if (!i)
    return console.warn(`[${T}] Picker: Tagger not available, cannot resolve tag "${t}".`), null;
  const r = i.getByTag(t, { sceneId: e.id });
  if (!(r != null && r.length)) return null;
  const a = n ? r : [r[0]], o = [];
  for (const s of a) {
    const l = $o(s);
    l && o.push(l);
  }
  return o.length === 0 ? null : {
    kind: n ? "multi-placeable" : "placeable",
    documents: o.map((s) => s.doc),
    placeables: o
  };
}
c(xc, "resolveTag");
function Tp(t, e) {
  const n = [
    e.tiles,
    e.lights,
    e.tokens,
    e.drawings,
    e.sounds
  ];
  for (const i of n) {
    const r = i == null ? void 0 : i.get(t);
    if (r) {
      const a = $o(r);
      if (a)
        return {
          kind: "placeable",
          documents: [a.doc],
          placeables: [a]
        };
    }
  }
  return null;
}
c(Tp, "resolveById");
function Rc(t, e, n) {
  const i = Xd();
  if (!i)
    return console.warn(`[${T}] Picker: Tagger not available, cannot resolve multi-tag.`), null;
  const r = i.getByTag(t, {
    sceneId: e.id,
    matchAny: n
  });
  if (!(r != null && r.length)) return null;
  const a = [];
  for (const o of r) {
    const s = $o(o);
    s && a.push(s);
  }
  return a.length === 0 ? null : {
    kind: a.length === 1 ? "placeable" : "multi-placeable",
    documents: a.map((o) => o.doc),
    placeables: a
  };
}
c(Rc, "resolveMultiTag");
function Cp(t) {
  const e = fromUuidSync(t);
  if (!e) return null;
  const n = $o(e);
  return n ? {
    kind: "placeable",
    documents: [n.doc],
    placeables: [n]
  } : null;
}
c(Cp, "resolveUUID");
function Lp(t) {
  var e;
  if (!t) return null;
  if (t.kind === "particles")
    return { kind: "particles", target: t.target };
  if (t.kind === "multi-placeable")
    return { kind: "multi-placeable", placeables: t.placeables };
  if ((e = t.placeables) != null && e.length) {
    const n = t.placeables[0];
    return { kind: "placeable", placeable: n.placeable, doc: n.doc };
  }
  return null;
}
c(Lp, "adaptResolved");
function Da(t) {
  var r;
  const e = /* @__PURE__ */ new Set();
  if (t.segments)
    for (const a of Object.values(t.segments)) {
      if (a.setup) for (const o of Object.keys(a.setup)) e.add(o);
      if (a.landing) for (const o of Object.keys(a.landing)) e.add(o);
      a.timeline && ul(a.timeline, e), (r = a.gate) != null && r.target && e.add(a.gate.target);
    }
  else {
    if (t.setup) for (const a of Object.keys(t.setup)) e.add(a);
    if (t.landing) for (const a of Object.keys(t.landing)) e.add(a);
    t.timeline && ul(t.timeline, e);
  }
  const n = /* @__PURE__ */ new Map(), i = [];
  for (const a of e) {
    const o = _o(a), s = Lp(o);
    s ? n.set(a, s) : i.push(a);
  }
  return i.length && console.warn(`[${T}] Cinematic: ${i.length} unresolved target(s): ${i.join(", ")}`), { targets: n, unresolved: i };
}
c(Da, "resolveAllTargets");
function Ip(t, e) {
  if (!t) return {};
  const n = {};
  for (const [i, r] of Object.entries(t)) {
    const a = e.get(i);
    if (a)
      if (a.kind === "particles") {
        if (a.target.destroyed) continue;
        const o = {};
        for (const s of Object.keys(r))
          o[s] = a.target[s];
        n[i] = o;
      } else if (a.kind === "multi-placeable") {
        const o = a.placeables[0];
        if (!(o != null && o.doc)) continue;
        const s = {};
        for (const l of Object.keys(r))
          s[l] = foundry.utils.getProperty(o.doc._source, l);
        n[i] = s;
      } else {
        if (!a.doc) continue;
        const o = {};
        for (const s of Object.keys(r))
          o[s] = foundry.utils.getProperty(a.doc._source, s);
        n[i] = o;
      }
  }
  return n;
}
c(Ip, "captureSnapshot");
function Op(t) {
  const e = {};
  function n(i) {
    if (i)
      for (const [r, a] of Object.entries(i))
        e[r] || (e[r] = {}), Object.assign(e[r], a);
  }
  if (c(n, "mergeMap"), t.segments)
    for (const i of Object.values(t.segments))
      n(i.setup), n(i.landing), i.timeline && cl(i.timeline, e, n);
  else
    n(t.setup), n(t.landing), t.timeline && cl(t.timeline, e, n);
  return e;
}
c(Op, "gatherAllStateMaps");
function cl(t, e, n) {
  var i;
  for (const r of t)
    if (!(r.delay != null || r.await != null || r.emit != null) && !(r.transitionTo != null || r.sound != null || r.stopSound != null)) {
      if ((i = r.parallel) != null && i.branches) {
        for (const a of r.parallel.branches)
          cl(a, e, n);
        continue;
      }
      if (n(r.before), n(r.after), r.tweens)
        for (const a of r.tweens)
          a.target && a.attribute && (e[a.target] || (e[a.target] = {}), e[a.target][a.attribute] = "__snapshot__");
    }
}
c(cl, "gatherFromEntries");
function ul(t, e) {
  for (const n of t)
    if (n.delay == null && n.await == null && n.emit == null && n.transitionTo == null && n.sound == null && n.stopSound == null) {
      if (n.parallel) {
        const i = n.parallel;
        if (i.branches)
          for (const r of i.branches)
            ul(r, e);
        continue;
      }
      if (n.before)
        for (const i of Object.keys(n.before)) e.add(i);
      if (n.after)
        for (const i of Object.keys(n.after)) e.add(i);
      if (n.tweens)
        for (const i of n.tweens)
          i.target && e.add(i.target);
    }
}
c(ul, "collectSelectorsFromEntries");
const Hc = {
  Tile: /* @__PURE__ */ new Set([
    "alpha",
    "hidden",
    "rotation",
    "elevation",
    "x",
    "y",
    "width",
    "height",
    "sort",
    "z",
    "texture.src",
    "texture.scaleX",
    "texture.scaleY",
    "occlusion.alpha",
    "occlusion.mode",
    "tint"
  ]),
  AmbientLight: /* @__PURE__ */ new Set([
    "hidden",
    "config.color",
    "config.alpha",
    "config.dim",
    "config.bright",
    "config.luminosity",
    "config.angle",
    "config.rotation"
  ]),
  Token: /* @__PURE__ */ new Set([
    "alpha",
    "hidden",
    "rotation",
    "elevation",
    "x",
    "y",
    "width",
    "height",
    "texture.src",
    "texture.scaleX",
    "texture.scaleY",
    "tint"
  ]),
  Drawing: /* @__PURE__ */ new Set([
    "hidden",
    "x",
    "y",
    "rotation",
    "shape.width",
    "shape.height",
    "fillAlpha",
    "strokeAlpha"
  ]),
  AmbientSound: /* @__PURE__ */ new Set([
    "hidden",
    "x",
    "y",
    "radius",
    "volume"
  ])
}, Ap = /* @__PURE__ */ new Set([
  "alpha",
  "visible",
  "x",
  "y",
  "scale",
  "rotation"
]);
function Xo(t, e, n) {
  const i = {};
  for (const [r, a] of Object.entries(t))
    e.has(r) ? i[r] = a : console.warn(`[${T}] Cinematic: blocked property "${r}" on ${n}.`);
  return i;
}
c(Xo, "filterOverrides");
function Ve(t, e) {
  var i, r;
  if (!t) return;
  const n = [];
  for (const [a, o] of Object.entries(t)) {
    const s = e.get(a);
    if (s)
      if (s.kind === "particles") {
        if (s.target.destroyed) continue;
        const l = Xo(o, Ap, "$particles");
        for (const [u, d] of Object.entries(l))
          s.target[u] = d;
      } else if (s.kind === "multi-placeable")
        for (const { placeable: l, doc: u } of s.placeables) {
          if (!(u != null && u.parent) || !(l != null && l.scene)) continue;
          const d = u.documentName, m = Hc[d];
          if (!m) {
            console.warn(`[${T}] Cinematic: no allowlist for document type "${d}" on "${a}", skipping.`);
            continue;
          }
          const g = Xo(o, m, `${d} "${a}"`);
          u.updateSource(g), n.push(l);
        }
      else {
        if (!((i = s.doc) != null && i.parent) || !((r = s.placeable) != null && r.scene)) continue;
        const l = s.doc.documentName, u = Hc[l];
        if (!u) {
          console.warn(`[${T}] Cinematic: no allowlist for document type "${l}" on "${a}", skipping.`);
          continue;
        }
        const d = Xo(o, u, `${l} "${a}"`);
        s.doc.updateSource(d), n.push(s.placeable);
      }
  }
  for (const a of n)
    a.refresh();
}
c(Ve, "applyState");
function pi(t, e) {
  var n;
  if (t)
    for (const i of Object.keys(t)) {
      const r = e.get(i);
      if ((r == null ? void 0 : r.kind) === "placeable" && ((n = r.doc) == null ? void 0 : n.documentName) === "AmbientLight") {
        canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
        return;
      }
      if ((r == null ? void 0 : r.kind) === "multi-placeable") {
        for (const { doc: a } of r.placeables)
          if ((a == null ? void 0 : a.documentName) === "AmbientLight") {
            canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
            return;
          }
      }
    }
}
c(pi, "refreshPerceptionIfNeeded");
const Mp = {
  "tile-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "light-color": /* @__PURE__ */ new Set(["uuid", "toColor", "toAlpha", "mode"]),
  "light-state": /* @__PURE__ */ new Set(["uuid", "enabled"]),
  "particles-prop": /* @__PURE__ */ new Set(["attribute", "value"]),
  "camera-pan": /* @__PURE__ */ new Set(["x", "y", "scale"]),
  "token-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "drawing-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "sound-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"])
}, Np = /* @__PURE__ */ new Set(["easing"]), kp = /* @__PURE__ */ new Set(["type", "target"]);
function Zd(t, e) {
  const { type: n, target: i, ...r } = t;
  if (!n)
    return console.warn(`[${T}] Cinematic: tween entry missing 'type', skipping.`), null;
  const a = {}, o = {}, s = Mp[n];
  if (i === "$particles")
    a.target = "$particles";
  else if (i) {
    const l = e.get(i);
    if (!l) return null;
    l.kind === "multi-placeable" ? a.uuid = l.placeables.map((u) => u.doc.uuid) : a.uuid = l.doc.uuid;
  }
  for (const [l, u] of Object.entries(r))
    kp.has(l) || (Np.has(l) ? o[l] = u : (s != null && s.has(l), a[l] = u));
  return { type: n, params: a, opts: o };
}
c(Zd, "compileTween");
const cr = /* @__PURE__ */ new Map();
let $p = 0;
async function _p(t) {
  var u, d, m, g, y;
  const { id: e, src: n, volume: i = 0.8, loop: r = !1, fadeIn: a } = t;
  if (!n) {
    console.warn(`[${T}] Cinematic sound: missing 'src', skipping.`);
    return;
  }
  const o = e || `__auto_${++$p}`, s = {
    src: n,
    autoplay: !0,
    loop: r,
    volume: i
  };
  let l = null;
  try {
    typeof ((d = (u = foundry == null ? void 0 : foundry.audio) == null ? void 0 : u.AudioHelper) == null ? void 0 : d.play) == "function" ? l = await foundry.audio.AudioHelper.play(s, !1) : typeof ((g = (m = game == null ? void 0 : game.audio) == null ? void 0 : m.constructor) == null ? void 0 : g.play) == "function" ? l = await game.audio.constructor.play(s, !1) : typeof ((y = game == null ? void 0 : game.audio) == null ? void 0 : y.play) == "function" && (l = await game.audio.play(s, !1));
  } catch (h) {
    console.error(`[${T}] Cinematic sound: failed to play "${n}":`, h);
    return;
  }
  if (!l) {
    console.warn(`[${T}] Cinematic sound: audio helper unavailable for "${n}".`);
    return;
  }
  a && a > 0 && l.fade && l.fade(i, { duration: a, from: 0 }), cr.set(o, { sound: l, config: t }), console.log(`[${T}] Cinematic sound: playing "${n}" as "${o}" (loop=${r}, vol=${i})`);
}
c(_p, "playLocalSound");
function Zo(t) {
  var i, r;
  const e = cr.get(t);
  if (!e) {
    console.warn(`[${T}] Cinematic sound: no active sound with id "${t}".`);
    return;
  }
  const n = e.config.fadeOut;
  try {
    n && n > 0 && e.sound.fade ? e.sound.fade(0, { duration: n }).then(() => {
      var a, o;
      return (o = (a = e.sound).stop) == null ? void 0 : o.call(a);
    }) : (r = (i = e.sound).stop) == null || r.call(i);
  } catch (a) {
    console.warn(`[${T}] Cinematic sound: error stopping "${t}":`, a);
  }
  cr.delete(t);
}
c(Zo, "stopCinematicSound");
function qc() {
  var t, e;
  for (const [n, i] of cr)
    try {
      (e = (t = i.sound).stop) == null || e.call(t);
    } catch (r) {
      console.warn(`[${T}] Cinematic sound: error stopping "${n}" during cleanup:`, r);
    }
  cr.clear();
}
c(qc, "stopAllCinematicSounds");
function Dp(t, e, n, i = {}) {
  const { skipToStep: r, onStepComplete: a, timelineName: o } = i, s = new n().name(o ?? `cinematic-${canvas.scene.id}`);
  return s.beforeAll(() => {
    var l;
    try {
      Ve(t.setup, e), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    } catch (u) {
      throw console.error(`[${T}] Cinematic: error in beforeAll (setup state) on scene ${(l = canvas.scene) == null ? void 0 : l.id}:`, u), u;
    }
  }), tf(t.timeline, s, e, { skipToStep: r, onStepComplete: a }), { tl: s };
}
c(Dp, "buildTimeline");
function ef(t, e) {
  var n;
  if (t)
    for (const i of t)
      for (const r of i) {
        if (r.before)
          try {
            Ve(r.before, e), pi(r.before, e);
          } catch (a) {
            console.warn(`[${T}] Cinematic: error in skipped parallel before:`, a);
          }
        if (r.after)
          try {
            Ve(r.after, e), pi(r.after, e);
          } catch (a) {
            console.warn(`[${T}] Cinematic: error in skipped parallel after:`, a);
          }
        (n = r.parallel) != null && n.branches && ef(r.parallel.branches, e);
      }
}
c(ef, "applyParallelStatesForSkip");
function tf(t, e, n, i = {}) {
  const { skipToStep: r, onStepComplete: a } = i;
  let o = -1;
  for (const s of t) {
    if (s.sound != null) {
      if (r != null && o < r) continue;
      const m = s.sound, { duration: g, loop: y, fireAndForget: h } = m, p = e.step();
      if (p.before(() => {
        _p(m);
      }), g && g > 0)
        if (h) {
          if (y && m.id) {
            const v = m.id, b = g;
            p.before(() => {
              setTimeout(() => Zo(v), b);
            });
          }
        } else
          e.delay(g), y && e.step().before(() => {
            Zo(m.id);
          });
      continue;
    }
    if (s.stopSound != null) {
      if (r != null && o < r) continue;
      const m = s.stopSound;
      e.step().before(() => {
        Zo(m);
      });
      continue;
    }
    if (s.delay != null) {
      if (r != null && o < r) continue;
      e.delay(s.delay);
      continue;
    }
    if (s.await != null) {
      if (r != null && o < r) continue;
      e.await(s.await);
      continue;
    }
    if (s.emit != null) {
      if (r != null && o < r) continue;
      e.emit(s.emit);
      continue;
    }
    if (s.parallel) {
      if (r != null && o < r) {
        ef(s.parallel.branches, n);
        continue;
      }
      const m = s.parallel, g = m.branches.map((y) => (h) => tf(y, h, n));
      e.parallel(g, {
        join: m.join ?? "all",
        overflow: m.overflow ?? "detach"
      });
      continue;
    }
    if (!s.tweens || !Array.isArray(s.tweens)) {
      console.warn(`[${T}] Cinematic: timeline entry has no tweens array, skipping.`);
      continue;
    }
    if (o++, r != null && o < r) {
      if (s.before)
        try {
          Ve(s.before, n), pi(s.before, n);
        } catch (m) {
          console.warn(`[${T}] Cinematic: error applying skipped step.before:`, m);
        }
      if (s.after)
        try {
          Ve(s.after, n), pi(s.after, n);
        } catch (m) {
          console.warn(`[${T}] Cinematic: error applying skipped step.after:`, m);
        }
      continue;
    }
    const l = o, u = e.step();
    s.before && u.before(() => {
      var m;
      try {
        Ve(s.before, n), pi(s.before, n);
      } catch (g) {
        throw console.error(`[${T}] Cinematic: error in step.before callback on scene ${(m = canvas.scene) == null ? void 0 : m.id}:`, g), g;
      }
    });
    const d = s.duration ?? 500;
    for (const m of s.tweens) {
      const g = Zd(m, n);
      g && u.add(g.type, g.params, { ...g.opts, durationMS: d });
    }
    u.after(() => {
      var m;
      try {
        s.after && (Ve(s.after, n), pi(s.after, n)), a == null || a(l);
      } catch (g) {
        throw console.error(`[${T}] Cinematic: error in step.after callback on scene ${(m = canvas.scene) == null ? void 0 : m.id}:`, g), g;
      }
    });
  }
}
c(tf, "compileCinematicEntries");
function yi(t, e, n) {
  if (t != null) {
    if (typeof t != "object" || Array.isArray(t)) {
      n.push({ path: e, level: "error", message: `Expected object, got ${Array.isArray(t) ? "array" : typeof t}` });
      return;
    }
    for (const [i, r] of Object.entries(t))
      (typeof r != "object" || r === null || Array.isArray(r)) && n.push({ path: `${e}["${i}"]`, level: "error", message: `Expected property overrides object, got ${Array.isArray(r) ? "array" : typeof r}` });
  }
}
c(yi, "validateStateMap");
function dl(t, e, n, i) {
  var r;
  for (let a = 0; a < t.length; a++) {
    const o = t[a], s = `${e}[${a}]`;
    if (!(o.delay != null || o.await != null || o.emit != null) && !(o.transitionTo != null || o.sound != null || o.stopSound != null)) {
      if ((r = o.parallel) != null && r.branches) {
        for (let l = 0; l < o.parallel.branches.length; l++)
          dl(o.parallel.branches[l], `${s}.parallel.branches[${l}]`, n, i);
        continue;
      }
      if (yi(o.before, `${s}.before`, i), yi(o.after, `${s}.after`, i), o.tweens)
        for (let l = 0; l < o.tweens.length; l++) {
          const u = o.tweens[l], d = `${s}.tweens[${l}]`;
          if (!u.type) {
            i.push({ path: d, level: "error", message: "Missing 'type' field" });
            continue;
          }
          const m = Pi(u.type);
          if (!m) {
            i.push({ path: d, level: "error", message: `Unknown tween type: "${u.type}"` });
            continue;
          }
          if (n)
            try {
              const g = Zd(u, n);
              g ? m.validate(g.params) : u.target && i.push({ path: d, level: "warn", message: `Target "${u.target}" could not be resolved for compilation` });
            } catch (g) {
              i.push({ path: d, level: "error", message: g.message });
            }
          n && u.target && !n.has(u.target) && i.push({ path: `${d}.target`, level: "warn", message: `Target "${u.target}" is not resolved` });
        }
    }
  }
}
c(dl, "validateEntries");
function Fp(t, e = null) {
  var i;
  const n = [];
  if (!t || typeof t != "object")
    return n.push({ path: "", level: "error", message: "Cinematic data is not an object" }), n;
  if (t.segments) {
    t.entry ? t.segments[t.entry] || n.push({ path: "entry", level: "error", message: `Entry segment "${t.entry}" not found in segments` }) : n.push({ path: "entry", level: "error", message: "Missing 'entry' field" });
    const r = /* @__PURE__ */ new Set();
    let a = t.entry;
    for (; a && typeof a == "string"; ) {
      if (r.has(a)) {
        n.push({ path: `segments.${a}.next`, level: "error", message: `Cycle detected in segment graph at "${a}"` });
        break;
      }
      r.add(a), a = (i = t.segments[a]) == null ? void 0 : i.next;
    }
    for (const [o, s] of Object.entries(t.segments)) {
      const l = `segments.${o}`;
      yi(s.setup, `${l}.setup`, n), yi(s.landing, `${l}.landing`, n), s.timeline && Array.isArray(s.timeline) && dl(s.timeline, `${l}.timeline`, e, n), s.next && typeof s.next == "string" && !t.segments[s.next] && n.push({ path: `${l}.next`, level: "error", message: `Next segment "${s.next}" not found` });
    }
  } else
    yi(t.setup, "setup", n), yi(t.landing, "landing", n), t.timeline && Array.isArray(t.timeline) && dl(t.timeline, "timeline", e, n);
  return n;
}
c(Fp, "validateCinematicDeep");
const es = 5, jc = /* @__PURE__ */ new Set(["click", "tile-click", "keypress"]);
var se, fe, Re, Le, ct, Ki, fl, nf, J, Me, ma, Ee, gt;
const oe = class oe {
  constructor(e = null, { loadedHash: n = null, cinematicName: i = "default", segmentName: r = null } = {}) {
    I(this, J);
    I(this, se);
    I(this, fe);
    I(this, Re);
    I(this, Le);
    var o;
    L(this, se, e ?? oe.empty()), L(this, fe, i), L(this, Le, n);
    const a = (o = f(this, se).cinematics) == null ? void 0 : o[f(this, fe)];
    L(this, Re, r ?? (a == null ? void 0 : a.entry) ?? "main");
  }
  static empty() {
    return {
      version: es,
      cinematics: {
        default: oe.emptyCinematic()
      }
    };
  }
  static emptyCinematic() {
    return {
      trigger: "canvasReady",
      tracking: !0,
      entry: "main",
      segments: {
        main: oe.emptySegment()
      }
    };
  }
  static emptySegment() {
    return { timeline: [] };
  }
  /**
   * Migrate a v3 single cinematic object to v4 segment structure.
   * Splits flat timeline at interaction gate boundaries.
   *
   * @param {object} v3Data  A single cinematic: { trigger, tracking, synchronized?, setup?, landing?, timeline }
   * @returns {object}  v4 cinematic: { trigger, tracking, synchronized?, entry, segments }
   */
  static migrateV3toV4(e) {
    var v;
    const { trigger: n, tracking: i, synchronized: r, setup: a, landing: o, timeline: s = [] } = e;
    if (!s.some(
      (b) => {
        var w;
        return b.await != null && jc.has(((w = b.await) == null ? void 0 : w.event) ?? "click");
      }
    )) {
      const b = s.filter((O) => O.transitionTo == null), w = s.find((O) => O.transitionTo != null), C = { timeline: b };
      if (a && Object.keys(a).length && (C.setup = a), o && Object.keys(o).length && (C.landing = o), w) {
        const O = w.transitionTo;
        O.scene && O.cinematic ? C.next = { segment: O.cinematic, scene: O.scene } : O.cinematic;
      }
      return {
        trigger: n,
        tracking: i,
        ...r ? { synchronized: r } : {},
        entry: "main",
        segments: { main: C }
      };
    }
    const u = {};
    let d = [], m = 1, g = null;
    const y = [];
    function h() {
      const b = `segment-${m++}`, w = { timeline: [...d] };
      return g && (w.gate = g), u[b] = w, y.push(b), d = [], g = null, b;
    }
    c(h, "flushSegment");
    for (const b of s)
      if (b.transitionTo == null) {
        if (b.await != null && jc.has(((v = b.await) == null ? void 0 : v.event) ?? "click")) {
          h(), g = { ...b.await }, delete g.event, g = { event: b.await.event ?? "click", ...g };
          continue;
        }
        d.push(b);
      }
    (d.length > 0 || g) && h();
    for (let b = 0; b < y.length - 1; b++)
      u[y[b]].next = y[b + 1];
    y.length > 0 && (a && Object.keys(a).length && (u[y[0]].setup = a), o && Object.keys(o).length && (u[y[y.length - 1]].landing = o));
    const p = s.find((b) => b.transitionTo != null);
    if (p && y.length > 0) {
      const b = p.transitionTo, w = u[y[y.length - 1]];
      b.scene && b.cinematic && (w.next = { segment: b.cinematic, scene: b.scene });
    }
    return {
      trigger: n,
      tracking: i,
      ...r ? { synchronized: r } : {},
      entry: y[0] ?? "main",
      segments: u
    };
  }
  /**
   * Migrate a v4 cinematic to v5 step-level duration model.
   * Lifts per-tween duration to the step, removes detach field.
   * Steps with detached tweens become parallel entries.
   *
   * @param {object} v4Data  A single v4 cinematic
   * @returns {object}  v5 cinematic (same shape, timeline entries transformed)
   */
  static migrateV4toV5(e) {
    var i, r;
    if (!e.segments) return e;
    const n = foundry.utils.deepClone(e);
    for (const a of Object.values(n.segments))
      (i = a.timeline) != null && i.length && (a.timeline = S(r = oe, ct, fl).call(r, a.timeline));
    return n;
  }
  static fromScene(e, n = "default") {
    var o;
    const i = e == null ? void 0 : e.getFlag(T, "cinematic");
    let r = i ? foundry.utils.deepClone(i) : null;
    const a = i ? S(o = oe, ct, nf).call(o, i) : null;
    if (r && (r.version ?? 1) < 3) {
      const { version: s, ...l } = r;
      r = { version: 3, cinematics: { default: l } };
    }
    if (r && r.version === 3) {
      for (const [s, l] of Object.entries(r.cinematics ?? {}))
        r.cinematics[s] = oe.migrateV3toV4(l);
      r.version = 4;
    }
    if (r && r.version === 4) {
      for (const [s, l] of Object.entries(r.cinematics ?? {}))
        r.cinematics[s] = oe.migrateV4toV5(l);
      r.version = es;
    }
    return new oe(r, { loadedHash: a, cinematicName: n });
  }
  /**
   * Check if the scene's cinematic flag has been modified since this state was loaded.
   * @param {object} scene  The Foundry scene document
   * @returns {boolean} true if scene data differs from what was loaded
   */
  isStale(e) {
    if (!f(this, Le)) return !1;
    const n = e == null ? void 0 : e.getFlag(T, "cinematic");
    return n ? !foundry.utils.objectsEqual(n, f(this, Le)) : !1;
  }
  // ── Read ──────────────────────────────────────────────────────────────
  get data() {
    return f(this, se);
  }
  get trigger() {
    return f(this, J, Me).trigger;
  }
  get tracking() {
    return f(this, J, Me).tracking;
  }
  get synchronized() {
    return f(this, J, Me).synchronized ?? !1;
  }
  get activeCinematicName() {
    return f(this, fe);
  }
  // ── Segment accessors ────────────────────────────────────────────────
  get segments() {
    return f(this, J, Me).segments;
  }
  get entry() {
    return f(this, J, Me).entry;
  }
  get activeSegmentName() {
    return f(this, Re);
  }
  get activeSegment() {
    var e;
    return ((e = f(this, J, Me).segments) == null ? void 0 : e[f(this, Re)]) ?? null;
  }
  // ── Compatibility bridge: route through active segment ───────────────
  get timeline() {
    var e;
    return ((e = this.activeSegment) == null ? void 0 : e.timeline) ?? [];
  }
  get setup() {
    var e;
    return ((e = this.activeSegment) == null ? void 0 : e.setup) ?? {};
  }
  get landing() {
    var e;
    return ((e = this.activeSegment) == null ? void 0 : e.landing) ?? {};
  }
  get isEmpty() {
    var e, n;
    return !((n = (e = this.activeSegment) == null ? void 0 : e.timeline) != null && n.length);
  }
  // ── Multi-cinematic management ────────────────────────────────────────
  listCinematicNames() {
    return Object.keys(f(this, se).cinematics);
  }
  switchCinematic(e) {
    if (!f(this, se).cinematics[e]) return this;
    const n = f(this, se).cinematics[e];
    return new oe(foundry.utils.deepClone(f(this, se)), {
      loadedHash: f(this, Le),
      cinematicName: e,
      segmentName: n.entry ?? "main"
    });
  }
  addCinematic(e) {
    if (!e || f(this, se).cinematics[e]) return this;
    const n = foundry.utils.deepClone(f(this, se));
    return n.cinematics[e] = oe.emptyCinematic(), new oe(n, {
      loadedHash: f(this, Le),
      cinematicName: e,
      segmentName: "main"
    });
  }
  removeCinematic(e) {
    if (Object.keys(f(this, se).cinematics).length <= 1) return this;
    if (!f(this, se).cinematics[e]) return this;
    const i = foundry.utils.deepClone(f(this, se));
    delete i.cinematics[e];
    const r = f(this, fe) === e ? Object.keys(i.cinematics)[0] : f(this, fe), a = i.cinematics[r];
    return new oe(i, {
      loadedHash: f(this, Le),
      cinematicName: r,
      segmentName: (a == null ? void 0 : a.entry) ?? "main"
    });
  }
  renameCinematic(e, n) {
    if (!e || !n || e === n) return this;
    if (!f(this, se).cinematics[e]) return this;
    if (f(this, se).cinematics[n]) return this;
    const i = foundry.utils.deepClone(f(this, se)), r = {};
    for (const [o, s] of Object.entries(i.cinematics))
      r[o === e ? n : o] = s;
    i.cinematics = r;
    const a = f(this, fe) === e ? n : f(this, fe);
    return new oe(i, {
      loadedHash: f(this, Le),
      cinematicName: a,
      segmentName: f(this, Re)
    });
  }
  // ── Cinematic-level mutations ─────────────────────────────────────────
  setTrigger(e) {
    return S(this, J, ma).call(this, { trigger: e });
  }
  setTracking(e) {
    return S(this, J, ma).call(this, { tracking: e });
  }
  setSynchronized(e) {
    return S(this, J, ma).call(this, { synchronized: e });
  }
  // ── Segment-level mutations (setup/landing now live on segments) ──────
  setSetup(e) {
    return S(this, J, Ee).call(this, { setup: e });
  }
  setLanding(e) {
    return S(this, J, Ee).call(this, { landing: e });
  }
  // ── Segment management methods ────────────────────────────────────────
  switchSegment(e) {
    var n;
    return (n = f(this, J, Me).segments) != null && n[e] ? new oe(foundry.utils.deepClone(f(this, se)), {
      loadedHash: f(this, Le),
      cinematicName: f(this, fe),
      segmentName: e
    }) : this;
  }
  addSegment(e, n = null) {
    var a;
    if (!e || (a = f(this, J, Me).segments) != null && a[e]) return this;
    const i = foundry.utils.deepClone(f(this, se)), r = i.cinematics[f(this, fe)];
    if (r.segments[e] = oe.emptySegment(), n && r.segments[n]) {
      const o = r.segments[n].next;
      r.segments[n].next = e, o && (r.segments[e].next = o);
    }
    return new oe(i, {
      loadedHash: f(this, Le),
      cinematicName: f(this, fe),
      segmentName: e
    });
  }
  removeSegment(e) {
    var s, l;
    if (Object.keys(f(this, J, Me).segments ?? {}).length <= 1) return this;
    if (!((s = f(this, J, Me).segments) != null && s[e])) return this;
    const i = foundry.utils.deepClone(f(this, se)), r = i.cinematics[f(this, fe)], a = r.segments[e].next;
    for (const [, u] of Object.entries(r.segments))
      (u.next === e || typeof u.next == "object" && ((l = u.next) == null ? void 0 : l.segment) === e) && (u.next = a ?? void 0, u.next || delete u.next);
    delete r.segments[e], r.entry === e && (r.entry = Object.keys(r.segments)[0]);
    const o = f(this, Re) === e ? r.entry : f(this, Re);
    return new oe(i, {
      loadedHash: f(this, Le),
      cinematicName: f(this, fe),
      segmentName: o
    });
  }
  renameSegment(e, n) {
    var s, l, u;
    if (!e || !n || e === n) return this;
    if (!((s = f(this, J, Me).segments) != null && s[e])) return this;
    if ((l = f(this, J, Me).segments) != null && l[n]) return this;
    const i = foundry.utils.deepClone(f(this, se)), r = i.cinematics[f(this, fe)], a = {};
    for (const [d, m] of Object.entries(r.segments))
      a[d === e ? n : d] = m;
    r.segments = a;
    for (const [, d] of Object.entries(r.segments))
      d.next === e ? d.next = n : typeof d.next == "object" && ((u = d.next) == null ? void 0 : u.segment) === e && (d.next.segment = n);
    r.entry === e && (r.entry = n);
    const o = f(this, Re) === e ? n : f(this, Re);
    return new oe(i, {
      loadedHash: f(this, Le),
      cinematicName: f(this, fe),
      segmentName: o
    });
  }
  setSegmentGate(e) {
    return S(this, J, Ee).call(this, { gate: e ?? void 0 });
  }
  setSegmentNext(e) {
    return S(this, J, Ee).call(this, { next: e ?? void 0 });
  }
  setSegmentSetup(e) {
    return S(this, J, Ee).call(this, { setup: e });
  }
  setSegmentLanding(e) {
    return S(this, J, Ee).call(this, { landing: e });
  }
  listSegmentNames() {
    return Object.keys(f(this, J, Me).segments ?? {});
  }
  // ── Timeline entry mutations (scoped to active segment) ──────────────
  addStep(e = -1) {
    const n = [...this.activeSegment.timeline], i = { duration: 1e3, tweens: [] };
    return e < 0 || e >= n.length ? n.push(i) : n.splice(e, 0, i), S(this, J, Ee).call(this, { timeline: n });
  }
  addDelay(e = -1, n = 1e3) {
    const i = [...this.activeSegment.timeline], r = { delay: n };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), S(this, J, Ee).call(this, { timeline: i });
  }
  addAwait(e = -1, n = null) {
    return console.warn(`[${T}] CinematicState.addAwait() is deprecated in v4. Use segment gates instead.`), this;
  }
  addEmit(e = -1, n = "") {
    const i = [...this.activeSegment.timeline], r = { emit: n };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), S(this, J, Ee).call(this, { timeline: i });
  }
  addParallel(e = -1) {
    const n = [...this.activeSegment.timeline], i = { parallel: { branches: [[], []], join: "all", overflow: "detach" } };
    return e < 0 || e >= n.length ? n.push(i) : n.splice(e, 0, i), S(this, J, Ee).call(this, { timeline: n });
  }
  addTransitionTo(e = -1, n = null) {
    return console.warn(`[${T}] CinematicState.addTransitionTo() is deprecated in v4. Use segment next edges instead.`), this;
  }
  addSound(e = -1, n = null) {
    const i = [...this.activeSegment.timeline], r = { sound: n ?? { src: "", volume: 0.8, loop: !1, duration: 0, fireAndForget: !1 } };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), S(this, J, Ee).call(this, { timeline: i });
  }
  addStopSound(e = -1, n = "") {
    const i = [...this.activeSegment.timeline], r = { stopSound: n };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), S(this, J, Ee).call(this, { timeline: i });
  }
  moveEntry(e, n) {
    if (e === n) return this;
    const i = [...this.activeSegment.timeline];
    if (e < 0 || e >= i.length) return this;
    if (n < 0 || n >= i.length) return this;
    const [r] = i.splice(e, 1);
    return i.splice(n, 0, r), S(this, J, Ee).call(this, { timeline: i });
  }
  removeEntry(e) {
    const n = [...this.activeSegment.timeline];
    return e < 0 || e >= n.length ? this : (n.splice(e, 1), S(this, J, Ee).call(this, { timeline: n }));
  }
  updateEntry(e, n) {
    const i = this.activeSegment.timeline.map((r, a) => a !== e ? r : { ...foundry.utils.deepClone(r), ...n });
    return S(this, J, Ee).call(this, { timeline: i });
  }
  // ── Tween mutations ──────────────────────────────────────────────────
  addTween(e, n = null) {
    const i = { type: "tile-prop", target: "", attribute: "alpha", value: 1 };
    return S(this, J, gt).call(this, e, (r) => {
      const a = [...r.tweens ?? [], n ?? i];
      return { ...r, tweens: a };
    });
  }
  updateTween(e, n, i) {
    return S(this, J, gt).call(this, e, (r) => {
      const a = (r.tweens ?? []).map((o, s) => s !== n ? o : { ...o, ...i });
      return { ...r, tweens: a };
    });
  }
  removeTween(e, n) {
    return S(this, J, gt).call(this, e, (i) => {
      const r = (i.tweens ?? []).filter((a, o) => o !== n);
      return { ...i, tweens: r };
    });
  }
  updateStepDuration(e, n) {
    return S(this, J, gt).call(this, e, (i) => ({ ...i, duration: Math.max(0, n) }));
  }
  // ── Parallel branch mutations ────────────────────────────────────────
  addBranch(e) {
    return S(this, J, gt).call(this, e, (n) => {
      if (!n.parallel) return n;
      const i = [...n.parallel.branches, []];
      return { ...n, parallel: { ...n.parallel, branches: i } };
    });
  }
  removeBranch(e, n) {
    return S(this, J, gt).call(this, e, (i) => {
      if (!i.parallel) return i;
      const r = i.parallel.branches.filter((a, o) => o !== n);
      return r.length < 1 ? i : { ...i, parallel: { ...i.parallel, branches: r } };
    });
  }
  addBranchEntry(e, n, i = null) {
    const r = { duration: 1e3, tweens: [] };
    return S(this, J, gt).call(this, e, (a) => {
      if (!a.parallel) return a;
      const o = a.parallel.branches.map((s, l) => l !== n ? s : [...s, i ?? r]);
      return { ...a, parallel: { ...a.parallel, branches: o } };
    });
  }
  removeBranchEntry(e, n, i) {
    return S(this, J, gt).call(this, e, (r) => {
      if (!r.parallel) return r;
      const a = r.parallel.branches.map((o, s) => s !== n ? o : o.filter((l, u) => u !== i));
      return { ...r, parallel: { ...r.parallel, branches: a } };
    });
  }
  updateBranchEntry(e, n, i, r) {
    return S(this, J, gt).call(this, e, (a) => {
      if (!a.parallel) return a;
      const o = a.parallel.branches.map((s, l) => l !== n ? s : s.map((u, d) => d !== i ? u : { ...foundry.utils.deepClone(u), ...r }));
      return { ...a, parallel: { ...a.parallel, branches: o } };
    });
  }
  moveBranchEntry(e, n, i, r) {
    return i === r ? this : S(this, J, gt).call(this, e, (a) => {
      if (!a.parallel) return a;
      const o = a.parallel.branches.map((s, l) => {
        if (l !== n) return s;
        const u = [...s];
        if (i < 0 || i >= u.length || r < 0 || r >= u.length) return s;
        const [d] = u.splice(i, 1);
        return u.splice(r, 0, d), u;
      });
      return { ...a, parallel: { ...a.parallel, branches: o } };
    });
  }
  // ── Persistence ──────────────────────────────────────────────────────
  async save(e) {
    const n = { ...foundry.utils.deepClone(f(this, se)), version: es };
    await e.setFlag(T, "cinematic", n);
  }
  /** Returns the active cinematic's data (for validation/export). */
  toJSON() {
    return foundry.utils.deepClone(f(this, J, Me));
  }
  /** Returns the entire v4 flag structure. */
  toFullJSON() {
    return foundry.utils.deepClone(f(this, se));
  }
};
se = new WeakMap(), fe = new WeakMap(), Re = new WeakMap(), Le = new WeakMap(), ct = new WeakSet(), Ki = /* @__PURE__ */ c(function(e) {
  const { duration: n, detach: i, ...r } = e;
  return r;
}, "#stripTween"), fl = /* @__PURE__ */ c(function(e) {
  var i, r;
  const n = [];
  for (const a of e) {
    if (a.delay != null || a.await != null || a.emit != null || a.transitionTo != null || a.sound != null || a.stopSound != null) {
      n.push(a);
      continue;
    }
    if ((i = a.parallel) != null && i.branches) {
      const l = a.parallel.branches.map(
        (u) => {
          var d;
          return S(d = oe, ct, fl).call(d, u);
        }
      );
      n.push({ ...a, parallel: { ...a.parallel, branches: l } });
      continue;
    }
    if (!((r = a.tweens) != null && r.length)) {
      n.push({ duration: 500, ...a });
      continue;
    }
    const o = [], s = [];
    for (const l of a.tweens)
      l.detach ? s.push(l) : o.push(l);
    if (s.length === 0) {
      const l = Math.max(500, ...a.tweens.map((m) => m.duration ?? 0)), { tweens: u, ...d } = a;
      n.push({
        ...d,
        duration: l,
        tweens: u.map(S(oe, ct, Ki))
      });
    } else if (o.length === 0) {
      const l = Math.max(500, ...s.map((m) => m.duration ?? 0)), { tweens: u, ...d } = a;
      n.push({
        ...d,
        duration: l,
        tweens: s.map(S(oe, ct, Ki))
      });
    } else {
      const l = Math.max(500, ...o.map((g) => g.duration ?? 0)), u = Math.max(500, ...s.map((g) => g.duration ?? 0)), { tweens: d, ...m } = a;
      n.push({
        parallel: {
          branches: [
            [{ ...m, duration: l, tweens: o.map(S(oe, ct, Ki)) }],
            [{ duration: u, tweens: s.map(S(oe, ct, Ki)) }]
          ],
          join: "all",
          overflow: "detach"
        }
      });
    }
  }
  return n;
}, "#migrateTimelineV5"), nf = /* @__PURE__ */ c(function(e) {
  return foundry.utils.deepClone(e);
}, "#computeHash"), J = new WeakSet(), Me = /* @__PURE__ */ c(function() {
  return f(this, se).cinematics[f(this, fe)];
}, "#active"), // ── Internal ─────────────────────────────────────────────────────────
/** Clone the full state with a patch to the active cinematic (cinematic-level props). */
ma = /* @__PURE__ */ c(function(e) {
  const n = foundry.utils.deepClone(f(this, se));
  return Object.assign(n.cinematics[f(this, fe)], e), new oe(n, {
    loadedHash: f(this, Le),
    cinematicName: f(this, fe),
    segmentName: f(this, Re)
  });
}, "#cloneActive"), /** Clone the full state with a patch to the active segment within the active cinematic. */
Ee = /* @__PURE__ */ c(function(e) {
  const n = foundry.utils.deepClone(f(this, se)), i = n.cinematics[f(this, fe)].segments[f(this, Re)];
  if (!i) return this;
  Object.assign(i, e);
  for (const [r, a] of Object.entries(i))
    a === void 0 && delete i[r];
  return new oe(n, {
    loadedHash: f(this, Le),
    cinematicName: f(this, fe),
    segmentName: f(this, Re)
  });
}, "#cloneActiveSegment"), /** Mutate a single timeline entry within the active segment. */
gt = /* @__PURE__ */ c(function(e, n) {
  const i = this.activeSegment;
  if (!i || e < 0 || e >= i.timeline.length) return this;
  const r = i.timeline.map((a, o) => o !== e ? a : n(foundry.utils.deepClone(a)));
  return S(this, J, Ee).call(this, { timeline: r });
}, "#mutateEntry"), I(oe, ct), c(oe, "CinematicState");
let $t = oe;
const Bc = [
  { value: "tile-prop", label: "Tile Prop" },
  { value: "light-color", label: "Light Color" },
  { value: "light-state", label: "Light State" },
  { value: "particles-prop", label: "Particles Prop" },
  { value: "camera-pan", label: "Camera Pan" },
  { value: "token-prop", label: "Token Prop" },
  { value: "drawing-prop", label: "Drawing Prop" },
  { value: "sound-prop", label: "Sound Prop" }
], rf = {
  "tile-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y, width, height" },
  "token-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y" },
  "drawing-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y" },
  "sound-prop": { form: "prop", attribute: "volume", value: 0.5, placeholder: "volume, radius" },
  "particles-prop": { form: "particles", attribute: "alpha", value: 1, placeholder: "alpha, rate, speed, size" },
  "camera-pan": { form: "camera", x: 0, y: 0, scale: 1 },
  "light-color": { form: "lightColor", toColor: "#ffffff", toAlpha: "", mode: "oklch" },
  "light-state": { form: "lightState", enabled: !0 }
}, Pp = [
  { value: "canvasReady", label: "Canvas Ready" },
  { value: "manual", label: "Manual Only" }
];
function Uc(t) {
  return t && (t.split("/").pop() || "").replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "-") || "";
}
c(Uc, "soundIdFromPath");
function Vc(t) {
  return t ? new Promise((e) => {
    const n = new Audio(t);
    n.addEventListener("loadedmetadata", () => {
      e(Math.round(n.duration * 1e3));
    }), n.addEventListener("error", () => e(0));
  }) : Promise.resolve(0);
}
c(Vc, "loadAudioDurationMs");
const bn = 40, er = 24, ur = 50, zc = 50, _n = 60, Rn = 10, ts = 16, af = 40, of = 20, xp = 90, Gc = 70, Wc = 8;
function Do(t) {
  return { stepDuration: Math.max(500, t.duration ?? 500), detachOverflow: 0 };
}
c(Do, "computeStepDurations");
function Rp(t) {
  var i;
  const e = ((i = t.parallel) == null ? void 0 : i.branches) ?? [];
  let n = 0;
  for (const r of e) {
    let a = 0;
    for (const o of r)
      o.delay != null ? a += o.delay : o.await != null || o.emit != null || (o.sound != null ? a += o.sound.fireAndForget ? 0 : o.sound.duration ?? 0 : o.stopSound != null || (a += Do(o).stepDuration));
    n = Math.max(n, a);
  }
  return Math.max(500, n);
}
c(Rp, "computeParallelDuration");
function Wl(t) {
  return t.reduce((e, n) => n.delay != null ? e + n.delay : n.await != null || n.emit != null || n.transitionTo != null ? e : n.sound != null ? e + (n.sound.fireAndForget ? 0 : n.sound.duration ?? 0) : n.stopSound != null ? e : n.parallel != null ? e + Rp(n) : e + Do(n).stepDuration, 0);
}
c(Wl, "computeTotalDuration");
function Hp(t, e) {
  if (t <= 0) return 0.1;
  const n = e / t;
  return Math.max(0.03, Math.min(0.5, n));
}
c(Hp, "computeScale");
function sf(t) {
  const e = t.tweens ?? [];
  if (e.length === 0) return "Empty";
  const n = e[0], i = (n.target ?? "").replace(/^tag:/, "#"), r = n.attribute ?? "";
  return n.type === "camera-pan" ? "Pan" : r === "alpha" ? `Fade ${i}` : r === "x" || r === "y" ? `Move ${i}` : n.type === "light-color" ? `Light ${i}` : n.type === "sound-prop" ? `Sound ${i}` : i ? `${i}` : "Step";
}
c(sf, "deriveStepLabel");
function qp(t, e, n, i, r) {
  var u, d;
  const a = [], o = [], s = [];
  let l = e;
  for (let m = 0; m < t.length; m++) {
    const g = t[m], y = `${i}.${m}`, h = r === y;
    if (g.delay != null) {
      const p = Math.max(of, g.delay * n);
      a.push({ type: "delay", leftPx: l, widthPx: p, label: `${g.delay}ms`, entryPath: y, selected: h }), l += p;
    } else if (g.await != null) {
      const p = ((u = g.await) == null ? void 0 : u.event) ?? "click", v = p === "tile-click" ? "fa-hand-pointer" : p === "signal" ? "fa-bolt" : "fa-pause";
      a.push({ type: "await", leftPx: l, widthPx: ts, label: p, entryPath: y, selected: h, isGate: !0, gateIcon: v }), ((d = g.await) == null ? void 0 : d.event) === "signal" && s.push({ signal: g.await.signal, centerPx: l + ts / 2 }), l += ts;
    } else if (g.emit != null)
      a.push({ type: "emit", leftPx: l, widthPx: Rn, label: "emit", entryPath: y, selected: h, isMarker: !0 }), o.push({ signal: g.emit, centerPx: l + Rn / 2 });
    else if (g.sound != null) {
      const p = (g.sound.src || "").split("/").pop() || "Sound", v = g.sound.duration ?? 0;
      if (g.sound.fireAndForget ?? !1)
        a.push({ type: "sound", leftPx: l, widthPx: Rn, label: p, entryPath: y, selected: h, isMarker: !0 });
      else {
        const w = v > 0 ? Math.max(_n, v * n) : _n, C = (g.sound.loop ?? !1) && v <= 0;
        a.push({ type: "sound", leftPx: l, widthPx: w, label: p, entryPath: y, selected: h, hasTrailingArrow: C }), l += w;
      }
    } else if (g.stopSound != null)
      a.push({ type: "stopSound", leftPx: l, widthPx: Rn, label: "Stop", entryPath: y, selected: h, isMarker: !0 });
    else {
      const { stepDuration: p } = Do(g), v = Math.max(af, p * n), b = sf(g);
      a.push({ type: "step", leftPx: l, widthPx: v, label: b, entryPath: y, selected: h }), l += v;
    }
  }
  return { blocks: a, width: l - e, emits: o, awaits: s };
}
c(qp, "computeBranchLane");
function Jc(t) {
  return er + t * bn;
}
c(Jc, "laneIndexToY");
function jp(t, e) {
  const n = [];
  for (const i of t.emits)
    for (const r of t.awaits) {
      if (i.signal !== r.signal) continue;
      const a = i.centerPx, o = Jc(i.laneIndex) + bn / 2, s = r.centerPx, l = Jc(r.laneIndex) + bn / 2, u = l - o, d = (a + s) / 2, m = o + Math.sign(u || 1) * Math.min(40, Math.abs(u) * 0.5 + 20), g = l - Math.sign(u || 1) * Math.min(40, Math.abs(u) * 0.5 + 20);
      n.push({
        pathD: `M ${a} ${o} C ${d} ${m}, ${d} ${g}, ${s} ${l}`,
        signal: i.signal
      });
    }
  return n;
}
c(jp, "computeSignalArcs");
function Bp(t, e) {
  const n = [];
  if (t <= 0) return n;
  const i = e * 1e3;
  let r;
  i >= 200 ? r = 500 : i >= 80 ? r = 1e3 : i >= 40 ? r = 2e3 : r = 5e3;
  for (let a = 0; a <= t + r; a += r) {
    const o = a >= 1e3 ? `${(a / 1e3).toFixed(a % 1e3 === 0 ? 0 : 1)}s` : `${a}ms`;
    n.push({ px: ur + a * e, label: o });
  }
  return n;
}
c(Bp, "computeTimeMarkers");
function Up(t) {
  const e = [];
  for (let n = 0; n < t.length - 1; n++) {
    const i = t[n], r = t[n + 1], a = i.leftPx + i.widthPx + (r.leftPx - (i.leftPx + i.widthPx)) / 2, o = er + bn / 2;
    let s;
    if (i.entryPath === "setup")
      s = 0;
    else {
      if (i.entryPath === "landing")
        continue;
      if (i.entryPath.startsWith("timeline.")) {
        const u = i.entryPath.split(".");
        s = Number(u[1]) + 1;
      } else
        continue;
    }
    const l = r.entryPath === "landing";
    e.push({ leftPx: a, topPx: o, insertIndex: s, lane: "main", isEnd: l });
  }
  return e;
}
c(Up, "computeInsertionPoints");
function Vp(t, { selectedPath: e, windowWidth: n }) {
  const i = Wl(t), r = n - 70 - 100, a = Hp(i, r), o = [], s = [], l = { emits: [], awaits: [] }, u = [];
  o.push({
    type: "setup",
    leftPx: 0,
    widthPx: ur,
    label: "Setup",
    entryPath: "setup",
    selected: e === "setup"
  });
  let d = ur;
  for (let w = 0; w < t.length; w++) {
    const C = t[w], O = `timeline.${w}`, A = e === O;
    if (C.delay != null) {
      const k = Math.max(of, C.delay * a);
      o.push({
        type: "delay",
        leftPx: d,
        widthPx: k,
        label: `${C.delay}ms`,
        entryPath: O,
        selected: A
      }), d += k;
    } else if (C.emit != null)
      o.push({
        type: "emit",
        leftPx: d,
        widthPx: Rn,
        label: "Emit",
        entryPath: O,
        selected: A,
        isMarker: !0
      }), l.emits.push({
        signal: C.emit,
        centerPx: d + Rn / 2,
        laneIndex: 0
      });
    else if (C.sound != null) {
      const k = (C.sound.src || "").split("/").pop() || "Sound", $ = C.sound.duration ?? 0;
      if (C.sound.fireAndForget ?? !1) {
        const q = $ > 0 ? Math.max(_n, $ * a) : _n, F = (C.sound.loop ?? !1) && $ <= 0, D = {
          type: "sound",
          leftPx: d,
          widthPx: q,
          label: k,
          entryPath: O,
          selected: A,
          hasTrailingArrow: F
        };
        let N = !1;
        for (const x of u)
          if (x.rightEdgePx <= d) {
            x.blocks.push(D), x.rightEdgePx = d + q, N = !0;
            break;
          }
        N || u.push({
          label: "♫ F&F",
          blocks: [D],
          rightEdgePx: d + q
        });
      } else {
        const q = $ > 0 ? Math.max(_n, $ * a) : _n, F = (C.sound.loop ?? !1) && $ <= 0;
        o.push({
          type: "sound",
          leftPx: d,
          widthPx: q,
          label: k,
          entryPath: O,
          selected: A,
          hasTrailingArrow: F
        }), d += q;
      }
    } else if (C.stopSound != null)
      o.push({
        type: "stopSound",
        leftPx: d,
        widthPx: Rn,
        label: "Stop",
        entryPath: O,
        selected: A,
        isMarker: !0
      });
    else if (C.parallel != null) {
      const k = C.parallel.branches ?? [], $ = d, H = [];
      let q = 0;
      for (let D = 0; D < k.length; D++) {
        const N = `timeline.${w}.parallel.branches.${D}`, { blocks: x, width: B, emits: W, awaits: R } = qp(k[D], $, a, N, e);
        H.push({ label: `Br ${D + 1}`, blocks: x }), q = Math.max(q, B);
        const U = s.length * 10 + D + 1;
        for (const K of W) l.emits.push({ ...K, laneIndex: U });
        for (const K of R) l.awaits.push({ ...K, laneIndex: U });
      }
      const F = Math.max(_n, q);
      o.push({
        type: "parallel",
        leftPx: $,
        widthPx: F,
        label: `${k.length} br`,
        entryPath: O,
        selected: A
      }), s.push({ parallelEntryIndex: w, startPx: $, lanes: H }), d += F;
    } else {
      const { stepDuration: k } = Do(C), $ = Math.max(af, k * a), H = sf(C);
      o.push({
        type: "step",
        leftPx: d,
        widthPx: $,
        label: H,
        entryPath: O,
        selected: A
      }), d += $;
    }
  }
  o.push({
    type: "landing",
    leftPx: d,
    widthPx: zc,
    label: "Landing",
    entryPath: "landing",
    selected: e === "landing"
  }), d += zc;
  const m = s.flatMap((w) => w.lanes), g = m.length;
  for (const w of u)
    m.push({ label: w.label, blocks: w.blocks });
  const y = jp(l, m.length), h = [];
  for (let w = 0; w < u.length; w++) {
    const C = g + w;
    for (const O of u[w].blocks) {
      const A = O.leftPx, k = er + bn, $ = er + (1 + C) * bn + bn / 2;
      h.push({ x: A, y1: k, y2: $ });
    }
  }
  const p = Bp(i, a), v = Up(o), b = er + (1 + m.length) * bn;
  return {
    mainBlocks: o,
    subLanes: m,
    signalArcs: y,
    fafConnectors: h,
    timeMarkers: p,
    insertionPoints: v,
    totalWidthPx: Math.max(d, 200),
    swimlaneHeightPx: b,
    totalDurationMs: i
  };
}
c(Vp, "computeLanes");
function zp(t) {
  if (t <= 0) return "0s";
  if (t < 1e3) return `${t}ms`;
  const e = t / 1e3;
  return e % 1 === 0 ? `${e}s` : `${e.toFixed(1)}s`;
}
c(zp, "formatDuration");
function Gp(t, e) {
  var y, h, p, v;
  const n = t.segments ?? {}, i = t.entry ?? "main", r = Object.keys(n);
  if (r.length === 0)
    return { nodes: [], edges: [], totalWidthPx: 0 };
  const a = /* @__PURE__ */ new Set(), o = [];
  let s = i;
  for (; s && typeof s == "string" && n[s] && !a.has(s); )
    a.add(s), o.push(s), s = n[s].next;
  for (const b of r)
    a.has(b) || o.push(b);
  const l = [];
  let u = Wc;
  for (const b of o) {
    const w = n[b], C = Wl(w.timeline ?? []), O = zp(C), A = b === i, k = b === e, $ = !a.has(b), H = xp;
    l.push({
      name: b,
      durationMs: C,
      durationLabel: O,
      isEntry: A,
      isActive: k,
      isOrphan: $,
      leftPx: u,
      widthPx: H,
      hasGate: !!w.gate,
      gateEvent: ((y = w.gate) == null ? void 0 : y.event) ?? null
    }), u += H + Gc;
  }
  const d = [], m = new Map(l.map((b) => [b.name, b]));
  for (const b of o) {
    const w = n[b];
    if (!w.next) continue;
    const C = typeof w.next == "string" ? w.next : (h = w.next) == null ? void 0 : h.segment;
    if (!C) continue;
    const O = m.get(b), A = m.get(C);
    if (!O || !A) continue;
    const k = n[C], $ = ((p = k == null ? void 0 : k.gate) == null ? void 0 : p.event) ?? null, H = typeof w.next == "object" && ((v = w.next) == null ? void 0 : v.scene);
    d.push({
      fromName: b,
      toName: C,
      gateLabel: $,
      isCrossScene: H,
      fromRightPx: O.leftPx + O.widthPx,
      toLeftPx: A.leftPx
    });
  }
  const g = u - Gc + Wc;
  return { nodes: l, edges: d, totalWidthPx: g };
}
c(Gp, "computeSegmentGraph");
function Tn(t) {
  if (!t) return null;
  if (t === "setup") return { type: "setup" };
  if (t === "landing") return { type: "landing" };
  const e = t.split(".");
  if (e[0] === "timeline") {
    const n = Number(e[1]);
    if (e.length === 2) return { type: "timeline", index: n };
    if (e[2] === "parallel" && e[3] === "branches" && e.length >= 6)
      return {
        type: "branch",
        index: n,
        branchIndex: Number(e[4]),
        branchEntryIndex: Number(e[5])
      };
  }
  return null;
}
c(Tn, "parseEntryPath");
function Fa(t, e) {
  var i, r, a, o;
  const n = Tn(t);
  return n ? n.type === "setup" ? e.setup : n.type === "landing" ? e.landing : n.type === "timeline" ? e.timeline[n.index] : n.type === "branch" ? (o = (a = (r = (i = e.timeline[n.index]) == null ? void 0 : i.parallel) == null ? void 0 : r.branches) == null ? void 0 : a[n.branchIndex]) == null ? void 0 : o[n.branchEntryIndex] : null : null;
}
c(Fa, "getEntryAtPath");
function Kc(t) {
  const e = Tn(t);
  return !e || e.type !== "timeline" ? null : e.index;
}
c(Kc, "getTimelineIndexFromPath");
function Wp(t) {
  var a, o;
  const e = /* @__PURE__ */ new Set(), i = (a = t.data.cinematics) == null ? void 0 : a[t.activeCinematicName];
  if (!i) return 0;
  function r(s) {
    var l;
    for (const u of s ?? []) {
      if (u.tweens)
        for (const d of u.tweens)
          d.target && e.add(d.target);
      if (u.before) for (const d of Object.keys(u.before)) e.add(d);
      if (u.after) for (const d of Object.keys(u.after)) e.add(d);
      if ((l = u.parallel) != null && l.branches)
        for (const d of u.parallel.branches) r(d);
    }
  }
  if (c(r, "collectFromTimeline"), i.segments)
    for (const s of Object.values(i.segments)) {
      if (s.setup) for (const l of Object.keys(s.setup)) e.add(l);
      if (s.landing) for (const l of Object.keys(s.landing)) e.add(l);
      (o = s.gate) != null && o.target && e.add(s.gate.target), r(s.timeline);
    }
  else {
    if (i.setup) for (const s of Object.keys(i.setup)) e.add(s);
    if (i.landing) for (const s of Object.keys(i.landing)) e.add(s);
    r(i.timeline);
  }
  return e.size;
}
c(Wp, "countUniqueTargets");
function Jp(t, e) {
  var i, r, a;
  const n = Tn(t);
  if (!n) return 0;
  if (n.type === "timeline") {
    let o = 0;
    for (let s = 0; s <= n.index; s++) {
      const l = e.timeline[s];
      l && l.delay == null && l.emit == null && l.parallel == null && l.sound == null && l.stopSound == null && o++;
    }
    return o;
  }
  if (n.type === "branch") {
    const o = ((a = (r = (i = e.timeline[n.index]) == null ? void 0 : i.parallel) == null ? void 0 : r.branches) == null ? void 0 : a[n.branchIndex]) ?? [];
    let s = 0;
    for (let l = 0; l <= n.branchEntryIndex; l++) {
      const u = o[l];
      u && u.delay == null && u.emit == null && u.sound == null && u.stopSound == null && s++;
    }
    return s;
  }
  return 0;
}
c(Jp, "stepNumberForPath");
function Kp(t) {
  return {
    isSetup: !0,
    targetCount: Object.keys(t.setup ?? {}).length
  };
}
c(Kp, "buildSetupDetail");
function Yp(t) {
  return {
    isLanding: !0,
    targetCount: Object.keys(t.landing ?? {}).length
  };
}
c(Yp, "buildLandingDetail");
function Qp(t) {
  return { type: "delay", isDelay: !0, delay: t.delay };
}
c(Qp, "buildDelayDetail");
function Xp(t) {
  return { type: "emit", isEmit: !0, signal: t.emit };
}
c(Xp, "buildEmitDetail");
function Zp(t) {
  const e = (t.sound.src || "").split("/").pop() || "";
  return {
    type: "sound",
    isSound: !0,
    soundSrc: t.sound.src ?? "",
    soundFilename: e,
    soundId: t.sound.id ?? "",
    soundVolume: t.sound.volume ?? 0.8,
    soundLoop: t.sound.loop ?? !1,
    soundFadeIn: t.sound.fadeIn ?? "",
    soundFadeOut: t.sound.fadeOut ?? "",
    soundDuration: t.sound.duration ?? 0,
    soundFireAndForget: t.sound.fireAndForget ?? !1,
    soundModeForever: (t.sound.loop ?? !1) && !((t.sound.duration ?? 0) > 0)
  };
}
c(Zp, "buildSoundDetail");
function ey(t) {
  return {
    type: "stopSound",
    isStopSound: !0,
    stopSoundId: t.stopSound
  };
}
c(ey, "buildStopSoundDetail");
function ty(t, e) {
  var o;
  const n = t.parallel, i = n.join ?? "all", r = n.overflow ?? "detach", a = (n.branches ?? []).map((s, l) => ({
    branchIndex: l,
    label: `Branch ${l + 1}`,
    entries: (s ?? []).map((u, d) => {
      var C, O;
      const m = u.delay != null, g = u.await != null, y = u.emit != null, h = u.sound != null, p = u.stopSound != null, v = !m && !g && !y && !h && !p;
      let b, w;
      return m ? (b = `${u.delay}ms`, w = "delay") : g ? (b = "Await", w = ((C = u.await) == null ? void 0 : C.event) ?? "click") : y ? (b = "Emit", w = u.emit || "(unnamed)") : h ? (b = "Sound", w = (u.sound.src || "").split("/").pop() || "(none)") : p ? (b = "Stop Sound", w = u.stopSound || "(no id)") : (b = "Step", w = `${((O = u.tweens) == null ? void 0 : O.length) ?? 0} tweens`), { branchEntryIndex: d, isDelay: m, isAwait: g, isEmit: y, isSound: h, isStopSound: p, isStep: v, label: b, sub: w };
    })
  }));
  return {
    type: "parallel",
    isParallel: !0,
    branchCount: ((o = n.branches) == null ? void 0 : o.length) ?? 0,
    join: i,
    overflow: r,
    joinIsAll: i === "all",
    joinIsAny: i === "any",
    overflowIsDetach: r === "detach",
    overflowIsCancel: r === "cancel",
    branches: a
  };
}
c(ty, "buildParallelDetail");
function ny(t, e, n, i) {
  const r = Hd(), a = (t.tweens ?? []).map((l, u) => {
    const d = `${e}.tweens.${u}`, m = n.has(d), g = l.type ?? "tile-prop", y = Bc.find((b) => b.value === g), h = rf[g], p = (h == null ? void 0 : h.form) ?? "prop", v = l.mode ?? "oklch";
    return {
      tweenIndex: u,
      isExpanded: m,
      type: g,
      typeLabel: (y == null ? void 0 : y.label) ?? l.type ?? "Tile Prop",
      target: l.target ?? "",
      attribute: l.attribute ?? "",
      attributePlaceholder: (h == null ? void 0 : h.placeholder) ?? "",
      value: l.value ?? "",
      easing: l.easing ?? "",
      // Form group flags
      formGroup: p,
      formIsProp: p === "prop",
      formIsParticles: p === "particles",
      formIsCamera: p === "camera",
      formIsLightColor: p === "lightColor",
      formIsLightState: p === "lightState",
      // Camera fields
      camX: l.x ?? "",
      camY: l.y ?? "",
      camScale: l.scale ?? "",
      // Light-color fields
      toColor: l.toColor ?? "#ffffff",
      toAlpha: l.toAlpha ?? "",
      colorMode: v,
      colorModeIsOklch: v === "oklch",
      colorModeIsHsl: v === "hsl",
      colorModeIsRgb: v === "rgb",
      // Light-state fields
      enabled: l.enabled ?? !0,
      typeOptions: Bc.map((b) => ({
        ...b,
        selected: b.value === (l.type ?? "tile-prop")
      })),
      easingOptions: [
        { value: "", label: "(default)", selected: !l.easing },
        ...r.map((b) => ({
          value: b,
          label: b,
          selected: l.easing === b
        }))
      ]
    };
  }), o = Object.keys(t.before ?? {}), s = Object.keys(t.after ?? {});
  return {
    type: "step",
    isStep: !0,
    isDelay: !1,
    stepNumber: Jp(e, i),
    stepDuration: t.duration ?? 1e3,
    tweens: a,
    beforeSummary: o.length ? `${o.length} target${o.length !== 1 ? "s" : ""}` : "(none)",
    afterSummary: s.length ? `${s.length} target${s.length !== 1 ? "s" : ""}` : "(none)"
  };
}
c(ny, "buildStepDetail");
function iy(t, { state: e, expandedTweens: n }) {
  const i = Tn(t);
  if (!i) return null;
  if (i.type === "setup") return Kp(e);
  if (i.type === "landing") return Yp(e);
  const r = Fa(t, e);
  return r ? r.delay != null ? Qp(r) : r.emit != null ? Xp(r) : r.sound != null ? Zp(r) : r.stopSound != null ? ey(r) : r.parallel != null && i.type === "timeline" ? ty(r) : ny(r, t, n, e) : null;
}
c(iy, "buildDetail");
function ry({ state: t, mutate: e }) {
  new Dialog({
    title: "Import Cinematic JSON",
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">Paste cinematic JSON data below. This will replace the current editor state. Accepts v3 or v4 format (v3 auto-migrates).</p>
			<textarea id="cinematic-import-json" style="width:100%;height:250px;font-family:monospace;font-size:0.8rem" placeholder='{"version":4,"cinematics":{"default":{...}}}'></textarea>
		`,
    buttons: {
      import: {
        label: "Import",
        icon: '<i class="fas fa-file-import"></i>',
        callback: /* @__PURE__ */ c((n) => {
          var r, a, o, s;
          const i = n.find("#cinematic-import-json").val();
          try {
            const l = JSON.parse(i);
            if (typeof l != "object" || l === null || Array.isArray(l))
              throw new Error("Expected a JSON object");
            if (l.cinematics)
              e(() => new $t(l));
            else if (l.segments !== void 0) {
              const u = { version: 4, cinematics: { [t.activeCinematicName]: l } };
              e(() => new $t(u, { cinematicName: t.activeCinematicName }));
            } else if (l.timeline !== void 0) {
              const u = { version: 3, cinematics: { [t.activeCinematicName]: l } };
              e(() => new $t(u, { cinematicName: t.activeCinematicName }));
            } else
              throw new Error("Expected v3/v4 wrapper or single cinematic with 'segments' or 'timeline'");
            (a = (r = ui.notifications) == null ? void 0 : r.info) == null || a.call(r, "Cinematic JSON imported.");
          } catch (l) {
            (s = (o = ui.notifications) == null ? void 0 : o.error) == null || s.call(o, `Import failed: ${l.message}`);
          }
        }, "callback")
      },
      cancel: { label: "Cancel" }
    },
    default: "import"
  }).render(!0);
}
c(ry, "showImportDialog");
function Pa(t, { state: e, mutate: n }) {
  const i = t === "setup" ? e.setup : e.landing, r = JSON.stringify(i ?? {}, null, 2);
  new Dialog({
    title: `Edit ${t.charAt(0).toUpperCase() + t.slice(1)}`,
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON map of target selector → property overrides:</p>
			<textarea id="cinematic-json-edit" style="width:100%;height:200px;font-family:monospace;font-size:0.8rem">${St(r)}</textarea>
		`,
    buttons: {
      save: {
        label: "Apply",
        callback: /* @__PURE__ */ c((a) => {
          var s, l;
          const o = a.find("#cinematic-json-edit").val();
          try {
            const u = JSON.parse(o);
            n(t === "setup" ? (d) => d.setSetup(u) : (d) => d.setLanding(u));
          } catch (u) {
            (l = (s = ui.notifications) == null ? void 0 : s.error) == null || l.call(s, `Invalid JSON: ${u.message}`);
          }
        }, "callback")
      },
      cancel: { label: "Cancel" }
    },
    default: "save"
  }).render(!0);
}
c(Pa, "showEditJsonDialog");
function Yc(t, { selectedPath: e, state: n, mutate: i }) {
  const r = Fa(e, n);
  if (!r || r.delay != null) return;
  const a = r[t] ?? {}, o = JSON.stringify(a, null, 2);
  new Dialog({
    title: `Edit Step ${t.charAt(0).toUpperCase() + t.slice(1)}`,
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON map of target selector → property overrides:</p>
			<textarea id="cinematic-json-edit" style="width:100%;height:200px;font-family:monospace;font-size:0.8rem">${St(o)}</textarea>
		`,
    buttons: {
      save: {
        label: "Apply",
        callback: /* @__PURE__ */ c((s) => {
          var u, d;
          const l = s.find("#cinematic-json-edit").val();
          try {
            const m = JSON.parse(l), g = Tn(e);
            (g == null ? void 0 : g.type) === "timeline" ? i((y) => y.updateEntry(g.index, { [t]: m })) : (g == null ? void 0 : g.type) === "branch" && i((y) => y.updateBranchEntry(g.index, g.branchIndex, g.branchEntryIndex, { [t]: m }));
          } catch (m) {
            (d = (u = ui.notifications) == null ? void 0 : u.error) == null || d.call(u, `Invalid JSON: ${m.message}`);
          }
        }, "callback")
      },
      cancel: { label: "Cancel" }
    },
    default: "save"
  }).render(!0);
}
c(Yc, "showEditStepStateDialog");
function ay({ selectedPath: t, state: e, mutate: n }) {
  const i = Tn(t);
  if (!i || i.type !== "timeline") return;
  const r = e.timeline[i.index];
  if (!(r != null && r.parallel)) return;
  const a = JSON.stringify(r.parallel.branches ?? [], null, 2);
  new Dialog({
    title: "Edit Parallel Branches",
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON array of branch timelines:</p>
			<textarea id="cinematic-json-edit" style="width:100%;height:250px;font-family:monospace;font-size:0.8rem">${St(a)}</textarea>
		`,
    buttons: {
      save: {
        label: "Apply",
        callback: /* @__PURE__ */ c((o) => {
          var l, u;
          const s = o.find("#cinematic-json-edit").val();
          try {
            const d = JSON.parse(s);
            if (!Array.isArray(d)) throw new Error("Expected an array of branches");
            n((m) => m.updateEntry(i.index, {
              parallel: { ...r.parallel, branches: d }
            }));
          } catch (d) {
            (u = (l = ui.notifications) == null ? void 0 : l.error) == null || u.call(l, `Invalid JSON: ${d.message}`);
          }
        }, "callback")
      },
      cancel: { label: "Cancel" }
    },
    default: "save"
  }).render(!0);
}
c(ay, "showEditParallelJsonDialog");
var mu, un, wn, ga, lf;
const pt = class pt extends On(In) {
  constructor(n = {}) {
    super(n);
    I(this, wn);
    I(this, un, null);
    L(this, un, n.scene ?? canvas.scene ?? null);
  }
  async _prepareContext() {
    var r, a, o;
    const n = f(this, wn, ga), i = ((a = n == null ? void 0 : n.getSeenStatus) == null ? void 0 : a.call(n, (r = f(this, un)) == null ? void 0 : r.id)) ?? [];
    return {
      sceneName: ((o = f(this, un)) == null ? void 0 : o.name) ?? "No scene",
      users: i.map((s) => ({
        ...s,
        statusLabel: s.seen ? "Seen" : "Not seen",
        statusClass: s.seen ? "cinematic-tracking__status--seen" : "cinematic-tracking__status--unseen"
      })),
      hasAnyTracked: i.some((s) => s.seen)
    };
  }
  _onRender(n, i) {
    super._onRender(n, i), S(this, wn, lf).call(this);
  }
};
un = new WeakMap(), wn = new WeakSet(), ga = /* @__PURE__ */ c(function() {
  var n, i;
  return (i = (n = game.modules.get(T)) == null ? void 0 : n.api) == null ? void 0 : i.cinematic;
}, "#api"), lf = /* @__PURE__ */ c(function() {
  var i, r;
  const n = this.element;
  n instanceof HTMLElement && (n.querySelectorAll("[data-action='reset-user']").forEach((a) => {
    a.addEventListener("click", async () => {
      var l;
      const o = a.dataset.userId;
      if (!o) return;
      const s = f(this, wn, ga);
      s != null && s.resetForUser && (await s.resetForUser((l = f(this, un)) == null ? void 0 : l.id, o), this.render({ force: !0 }));
    });
  }), (i = n.querySelector("[data-action='reset-all']")) == null || i.addEventListener("click", async () => {
    var o;
    const a = f(this, wn, ga);
    a != null && a.resetForAll && (await a.resetForAll((o = f(this, un)) == null ? void 0 : o.id), this.render({ force: !0 }));
  }), (r = n.querySelector("[data-action='refresh']")) == null || r.addEventListener("click", () => {
    this.render({ force: !0 });
  }));
}, "#bindEvents"), c(pt, "CinematicTrackingApplication"), pe(pt, "APP_ID", `${T}-cinematic-tracking`), pe(pt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  _e(pt, pt, "DEFAULT_OPTIONS"),
  {
    id: pt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((mu = _e(pt, pt, "DEFAULT_OPTIONS")) == null ? void 0 : mu.classes) ?? [], "eidolon-cinematic-tracking-window", "themed"])
    ),
    tag: "section",
    window: {
      title: "Cinematic Tracking",
      icon: "fa-solid fa-eye",
      resizable: !0
    },
    position: {
      width: 340,
      height: "auto"
    }
  },
  { inplace: !1 }
)), pe(pt, "PARTS", {
  content: {
    template: `modules/${T}/templates/cinematic-tracking.html`
  }
});
let ml = pt;
function oy(t, e) {
  var n, i, r, a, o, s, l, u, d;
  (n = t.querySelector("[data-action='save']")) == null || n.addEventListener("click", () => e.save()), (i = t.querySelector("[data-action='play-preview']")) == null || i.addEventListener("click", () => e.play()), (r = t.querySelector("[data-action='reset-tracking']")) == null || r.addEventListener("click", () => e.resetTracking()), (a = t.querySelector("[data-action='export-json']")) == null || a.addEventListener("click", () => e.exportJSON()), (o = t.querySelector("[data-action='undo']")) == null || o.addEventListener("click", () => e.undo()), (s = t.querySelector("[data-action='redo']")) == null || s.addEventListener("click", () => e.redo()), (l = t.querySelector("[data-action='validate']")) == null || l.addEventListener("click", () => e.validate()), (u = t.querySelector("[data-action='import-json']")) == null || u.addEventListener("click", () => e.importJSON()), (d = t.querySelector("[data-action='open-tracking']")) == null || d.addEventListener("click", () => {
    new ml({ scene: e.scene }).render(!0);
  });
}
c(oy, "bindToolbarEvents");
function sy(t, e) {
  var n, i, r, a;
  (n = t.querySelector("[data-action='change-cinematic']")) == null || n.addEventListener("change", (o) => {
    e.flushTweenChanges(), e.switchCinematic(o.target.value);
  }), (i = t.querySelector("[data-action='add-cinematic']")) == null || i.addEventListener("click", () => {
    new Dialog({
      title: "New Cinematic",
      content: '<label style="display:flex;align-items:center;gap:0.5rem"><span>Name:</span><input id="cinematic-new-name" type="text" style="flex:1" placeholder="intro" /></label>',
      buttons: {
        ok: {
          label: "Create",
          callback: /* @__PURE__ */ c((o) => {
            var l, u, d, m, g, y, h;
            const s = (l = o.find("#cinematic-new-name").val()) == null ? void 0 : l.trim();
            if (!s) {
              (d = (u = ui.notifications) == null ? void 0 : u.warn) == null || d.call(u, "Name cannot be empty.");
              return;
            }
            if (/[.\s]/.test(s)) {
              (g = (m = ui.notifications) == null ? void 0 : m.warn) == null || g.call(m, "Name cannot contain dots or spaces.");
              return;
            }
            if (e.state.listCinematicNames().includes(s)) {
              (h = (y = ui.notifications) == null ? void 0 : y.warn) == null || h.call(y, "Name already exists.");
              return;
            }
            e.mutate((p) => p.addCinematic(s));
          }, "callback")
        },
        cancel: { label: "Cancel" }
      },
      default: "ok"
    }).render(!0);
  }), (r = t.querySelector("[data-action='remove-cinematic']")) == null || r.addEventListener("click", () => {
    var l, u;
    if (e.state.listCinematicNames().length <= 1) {
      (u = (l = ui.notifications) == null ? void 0 : l.warn) == null || u.call(l, "Cannot remove the last cinematic.");
      return;
    }
    const s = e.state.activeCinematicName;
    new Dialog({
      title: "Remove Cinematic",
      content: `<p>Remove cinematic "${s}"? This cannot be undone after saving.</p>`,
      buttons: {
        ok: {
          label: "Remove",
          callback: /* @__PURE__ */ c(() => {
            e.setSelectedPath(null), e.mutate((d) => d.removeCinematic(s));
          }, "callback")
        },
        cancel: { label: "Cancel" }
      },
      default: "cancel"
    }).render(!0);
  }), (a = t.querySelector("[data-action='rename-cinematic']")) == null || a.addEventListener("click", () => {
    const o = e.state.activeCinematicName;
    new Dialog({
      title: "Rename Cinematic",
      content: `<label style="display:flex;align-items:center;gap:0.5rem"><span>Name:</span><input id="cinematic-rename" type="text" style="flex:1" value="${St(o)}" /></label>`,
      buttons: {
        ok: {
          label: "Rename",
          callback: /* @__PURE__ */ c((s) => {
            var u, d, m, g, y, h, p;
            const l = (u = s.find("#cinematic-rename").val()) == null ? void 0 : u.trim();
            if (!l) {
              (m = (d = ui.notifications) == null ? void 0 : d.warn) == null || m.call(d, "Name cannot be empty.");
              return;
            }
            if (/[.\s]/.test(l)) {
              (y = (g = ui.notifications) == null ? void 0 : g.warn) == null || y.call(g, "Name cannot contain dots or spaces.");
              return;
            }
            if (l !== o) {
              if (e.state.listCinematicNames().includes(l)) {
                (p = (h = ui.notifications) == null ? void 0 : h.warn) == null || p.call(h, "Name already exists.");
                return;
              }
              e.mutate((v) => v.renameCinematic(o, l));
            }
          }, "callback")
        },
        cancel: { label: "Cancel" }
      },
      default: "ok"
    }).render(!0);
  });
}
c(sy, "bindCinematicSelectorEvents");
function ly(t, e) {
  t.querySelectorAll("[data-action='select-block']").forEach((i) => {
    i.addEventListener("click", (r) => {
      if (r.target.closest("button")) return;
      const a = i.dataset.entryPath;
      e.setSelectedPath(e.selectedPath === a ? null : a);
    });
  });
  let n = null;
  t.querySelectorAll(".cinematic-editor__lane--main [data-action='select-block']").forEach((i) => {
    const r = i.dataset.entryPath;
    r === "setup" || r === "landing" || (i.addEventListener("dragstart", (a) => {
      n = r, i.classList.add("dragging"), a.dataTransfer.effectAllowed = "move";
    }), i.addEventListener("dragover", (a) => {
      a.preventDefault(), a.dataTransfer.dropEffect = "move";
    }), i.addEventListener("dragenter", (a) => {
      a.preventDefault(), i.classList.add("cinematic-editor__block--drag-over");
    }), i.addEventListener("dragleave", () => {
      i.classList.remove("cinematic-editor__block--drag-over");
    }), i.addEventListener("drop", (a) => {
      a.preventDefault(), i.classList.remove("cinematic-editor__block--drag-over");
      const o = i.dataset.entryPath;
      if (n && n !== o) {
        const s = Kc(n), l = Kc(o);
        s != null && l != null && (e.selectedPath === n && e.setSelectedPath(o), e.mutate((u) => u.moveEntry(s, l)));
      }
      n = null;
    }), i.addEventListener("dragend", () => {
      i.classList.remove("dragging"), n = null;
    }));
  }), t.querySelectorAll("[data-action='show-insert-menu']").forEach((i) => {
    i.addEventListener("click", (r) => {
      r.stopPropagation();
      const a = Number(i.dataset.insertIndex), o = i.dataset.lane;
      e.showInsertMenu(i, a, o);
    });
  }), t.querySelectorAll("[data-action='insert-entry']").forEach((i) => {
    i.addEventListener("click", () => {
      if (!e.insertMenuState) return;
      const r = i.dataset.insertType, { insertIndex: a } = e.insertMenuState;
      switch (r) {
        case "step":
          e.mutate((o) => o.addStep(a));
          break;
        case "delay":
          e.mutate((o) => o.addDelay(a));
          break;
        case "emit":
          e.mutate((o) => o.addEmit(a));
          break;
        case "parallel":
          e.mutate((o) => o.addParallel(a));
          break;
        case "sound":
          e.mutate((o) => o.addSound(a));
          break;
        case "stopSound":
          e.mutate((o) => o.addStopSound(a));
          break;
      }
      e.hideInsertMenu();
    });
  }), document.addEventListener("click", (i) => {
    e.insertMenuState && !i.target.closest(".cinematic-editor__insert-menu") && !i.target.closest("[data-action='show-insert-menu']") && e.hideInsertMenu();
  });
}
c(ly, "bindSwimlaneEvents");
function cy(t, e) {
  var n, i, r, a, o, s, l, u, d, m, g;
  (n = t.querySelector("[data-action='delete-entry']")) == null || n.addEventListener("click", () => {
    const y = e.parseEntryPath(e.selectedPath);
    y && (y.type === "timeline" ? (e.mutate((h) => h.removeEntry(y.index)), e.setSelectedPath(null)) : y.type === "branch" && (e.mutate((h) => h.removeBranchEntry(y.index, y.branchIndex, y.branchEntryIndex)), e.setSelectedPath(null)));
  }), (i = t.querySelector("[data-action='step-duration']")) == null || i.addEventListener("input", (y) => {
    const h = e.parseEntryPath(e.selectedPath);
    if (!h) return;
    const p = Number(y.target.value) || 0;
    h.type === "timeline" ? e.mutate((v) => v.updateStepDuration(h.index, p)) : h.type === "branch" && e.mutate((v) => v.updateBranchEntry(h.index, h.branchIndex, h.branchEntryIndex, { duration: Math.max(0, p) }));
  }), (r = t.querySelector("[data-action='add-tween']")) == null || r.addEventListener("click", () => {
    const y = e.parseEntryPath(e.selectedPath);
    if (y) {
      if (y.type === "timeline")
        e.mutate((h) => h.addTween(y.index));
      else if (y.type === "branch") {
        const h = e.getEntryAtPath(e.selectedPath);
        if (!h) return;
        const p = { type: "tile-prop", target: "", attribute: "alpha", value: 1 }, v = [...h.tweens ?? [], p];
        e.mutate((b) => b.updateBranchEntry(y.index, y.branchIndex, y.branchEntryIndex, { tweens: v }));
      }
    }
  }), (a = t.querySelector("[data-action='change-delay']")) == null || a.addEventListener("change", (y) => {
    const h = e.parseEntryPath(e.selectedPath);
    if (!h) return;
    const p = Number(y.target.value) || 0;
    h.type === "timeline" ? e.mutate((v) => v.updateEntry(h.index, { delay: p })) : h.type === "branch" && e.mutate((v) => v.updateBranchEntry(h.index, h.branchIndex, h.branchEntryIndex, { delay: p }));
  }), (o = t.querySelector("[data-action='edit-setup']")) == null || o.addEventListener("click", () => {
    Pa("setup", { state: e.state, mutate: e.mutate });
  }), (s = t.querySelector("[data-action='edit-landing']")) == null || s.addEventListener("click", () => {
    Pa("landing", { state: e.state, mutate: e.mutate });
  }), (l = t.querySelector("[data-action='edit-before']")) == null || l.addEventListener("click", () => {
    Yc("before", { selectedPath: e.selectedPath, state: e.state, mutate: e.mutate });
  }), (u = t.querySelector("[data-action='edit-after']")) == null || u.addEventListener("click", () => {
    Yc("after", { selectedPath: e.selectedPath, state: e.state, mutate: e.mutate });
  }), (d = t.querySelector("[data-action='change-trigger']")) == null || d.addEventListener("change", (y) => {
    e.mutate((h) => h.setTrigger(y.target.value));
  }), (m = t.querySelector("[data-action='change-tracking']")) == null || m.addEventListener("change", (y) => {
    e.mutate((h) => h.setTracking(y.target.checked));
  }), (g = t.querySelector("[data-action='change-synchronized']")) == null || g.addEventListener("change", (y) => {
    e.mutate((h) => h.setSynchronized(y.target.checked));
  });
}
c(cy, "bindDetailPanelEvents");
const ki = /* @__PURE__ */ new WeakMap(), xa = /* @__PURE__ */ new Set(), Ra = /* @__PURE__ */ new Set(), Qc = {
  hover: {
    borderColor: 52945,
    borderAlpha: 0.9,
    borderWidth: 3,
    spriteTint: 52945,
    spriteAlpha: 0.35,
    pulse: !1
  },
  selected: {
    borderColor: 14263361,
    borderAlpha: 0.8,
    borderWidth: 3,
    spriteTint: 14263361,
    spriteAlpha: 0.18,
    pulse: !0
  },
  pick: {
    borderColor: 65416,
    borderAlpha: 0.7,
    borderWidth: 2,
    spriteTint: 65416,
    spriteAlpha: 0.25,
    pulse: !1
  },
  interactive: {
    borderColor: 4513279,
    borderAlpha: 0.85,
    borderWidth: 3,
    spriteTint: 4513279,
    spriteAlpha: 0.22,
    pulse: !0
  },
  interactiveHover: {
    borderColor: 16777215,
    borderAlpha: 1,
    borderWidth: 4,
    spriteTint: 16777215,
    spriteAlpha: 0.35,
    pulse: !1
  }
};
function Ha(t, e = {}) {
  var h, p, v;
  if (!t) return !1;
  $i(t);
  const n = e.mode ?? (e.color != null ? "custom" : "hover"), i = Qc[n] ?? Qc.hover, r = e.color ?? i.borderColor, a = e.alpha ?? i.borderAlpha, o = e.color ?? i.spriteTint, s = i.spriteAlpha, l = e.pulse ?? i.pulse, u = { border: null, sprite: null, pulseData: null, mode: n }, d = ((h = t.document) == null ? void 0 : h.width) ?? t.w ?? 100, m = ((p = t.document) == null ? void 0 : p.height) ?? t.h ?? 100, g = new PIXI.Graphics();
  g.lineStyle(i.borderWidth, r, a), g.drawRect(0, 0, d, m), t.addChild(g), u.border = g;
  const y = uy(t, o, s);
  if (y && (canvas.controls.debug.addChild(y), Ra.add(y), u.sprite = y), l && ((v = canvas.app) != null && v.ticker)) {
    const b = {
      elapsed: 0,
      fn: /* @__PURE__ */ c((w) => {
        b.elapsed += w;
        const C = (Math.sin(b.elapsed * 0.05) + 1) / 2;
        u.border && (u.border.alpha = a * (0.4 + 0.6 * C)), u.sprite && (u.sprite.alpha = s * (0.5 + 0.5 * C));
      }, "fn")
    };
    canvas.app.ticker.add(b.fn), u.pulseData = b, xa.add(b);
  }
  return ki.set(t, u), !0;
}
c(Ha, "addHighlight");
function $i(t) {
  var n, i;
  if (!t) return;
  const e = ki.get(t);
  e && (e.pulseData && ((i = (n = canvas.app) == null ? void 0 : n.ticker) == null || i.remove(e.pulseData.fn), xa.delete(e.pulseData)), e.border && (e.border.parent && e.border.parent.removeChild(e.border), e.border.destroy({ children: !0 })), e.sprite && (e.sprite.parent && e.sprite.parent.removeChild(e.sprite), e.sprite.destroy({ children: !0 }), Ra.delete(e.sprite)), ki.delete(t));
}
c($i, "removeHighlight");
function cf(t) {
  return ki.has(t);
}
c(cf, "hasHighlight");
function ha() {
  var e, n, i, r, a, o, s;
  for (const l of xa)
    (n = (e = canvas.app) == null ? void 0 : e.ticker) == null || n.remove(l.fn);
  xa.clear();
  for (const l of Ra)
    l.parent && l.parent.removeChild(l), l.destroy({ children: !0 });
  Ra.clear();
  const t = [
    (i = canvas.tiles) == null ? void 0 : i.placeables,
    (r = canvas.tokens) == null ? void 0 : r.placeables,
    (a = canvas.lighting) == null ? void 0 : a.placeables,
    (o = canvas.drawings) == null ? void 0 : o.placeables,
    (s = canvas.sounds) == null ? void 0 : s.placeables
  ];
  for (const l of t)
    if (l)
      for (const u of l) {
        const d = ki.get(u);
        d && (d.border && (d.border.parent && d.border.parent.removeChild(d.border), d.border.destroy({ children: !0 })), ki.delete(u));
      }
}
c(ha, "clearAllHighlights");
function uy(t, e, n) {
  var a;
  const i = t.mesh;
  if (!((a = i == null ? void 0 : i.texture) != null && a.baseTexture)) return null;
  const r = PIXI.Sprite.from(i.texture);
  return r.isSprite = !0, r.anchor.set(i.anchor.x, i.anchor.y), r.width = i.width, r.height = i.height, r.scale = i.scale, r.position = t.center, r.angle = i.angle, r.alpha = n, r.tint = e, r.name = "eidolonPickerHighlight", r;
}
c(uy, "createTintSprite");
let Dn = null;
function uf(t) {
  var h, p, v;
  Dn && Dn.cancel();
  const { placeableType: e = "Tile", onPick: n, onCancel: i } = t;
  let r = null;
  const a = `control${e}`, o = `hover${e}`, s = /* @__PURE__ */ c((b, w) => {
    var O;
    if (!w) return;
    const C = b.document ?? b;
    (O = b.release) == null || O.call(b), n(C);
  }, "onControl"), l = /* @__PURE__ */ c((b, w) => {
    w ? (r = b, Ha(b, { mode: "pick" })) : r === b && ($i(b), r = null);
  }, "onHoverIn"), u = /* @__PURE__ */ c((b) => {
    b.key === "Escape" && (b.preventDefault(), b.stopPropagation(), y());
  }, "onKeydown"), d = /* @__PURE__ */ c((b) => {
    b.preventDefault(), y();
  }, "onContextMenu"), m = Hooks.on(a, s), g = Hooks.on(o, l);
  document.addEventListener("keydown", u, { capture: !0 }), (h = canvas.stage) == null || h.addEventListener("rightclick", d), (v = (p = ui.notifications) == null ? void 0 : p.info) == null || v.call(p, `Pick mode active — click a ${e.toLowerCase()} on the canvas, or press ESC to cancel.`, { permanent: !1 });
  function y() {
    var b;
    Dn && (Dn = null, Hooks.off(a, m), Hooks.off(o, g), document.removeEventListener("keydown", u, { capture: !0 }), (b = canvas.stage) == null || b.removeEventListener("rightclick", d), r && ($i(r), r = null), i == null || i());
  }
  return c(y, "cancel"), Dn = { cancel: y }, { cancel: y };
}
c(uf, "enterPickMode");
function Yi() {
  Dn && Dn.cancel();
}
c(Yi, "cancelPickMode");
const dy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cancelPickMode: Yi,
  enterPickMode: uf
}, Symbol.toStringTag, { value: "Module" }));
var gu, Ie, He, Mr, dn, Nr, kr, Ke, fn, de, df, gl, ff, mf, gf, hl, pl, hf, pf;
const at = class at extends On(In) {
  /**
   * @param {object} options
   * @param {string[]} [options.selections]  Initial selections
   * @param {string} [options.placeableType]  "Tile", "Token", etc.
   * @param {(selectors: string[]) => void} [options.onApply]
   * @param {() => void} [options.onCancel]
   */
  constructor(n = {}) {
    super(n);
    I(this, de);
    /** @type {string[]} Current selections (selector strings). */
    I(this, Ie, []);
    /** @type {boolean} Whether pick mode is active. */
    I(this, He, !1);
    /** @type {string} Placeable type (Tile, Token, etc.). */
    I(this, Mr, "Tile");
    /** @type {string} Current tag match mode. */
    I(this, dn, "any");
    /** @type {((selectors: string[]) => void) | null} */
    I(this, Nr, null);
    /** @type {(() => void) | null} */
    I(this, kr, null);
    /** @type {Promise resolve function for the open() API. */
    I(this, Ke, null);
    /** @type {PlaceableObject | null} Currently hovered tile in the browser. */
    I(this, fn, null);
    L(this, Ie, [...n.selections ?? []]), L(this, Mr, n.placeableType ?? "Tile"), L(this, Nr, n.onApply ?? null), L(this, kr, n.onCancel ?? null);
  }
  // ── Context ───────────────────────────────────────────────────────────
  async _prepareContext() {
    var r;
    const n = S(this, de, hl).call(this), i = (((r = canvas.tiles) == null ? void 0 : r.placeables) ?? []).map((a, o) => {
      var d, m;
      const s = a.document, l = s.id, u = (d = s.texture) != null && d.src ? s.texture.src.split("/").pop().replace(/\.[^.]+$/, "") : `Tile ${o + 1}`;
      return {
        id: l,
        name: u.length > 20 ? u.slice(0, 18) + "..." : u,
        thumbnailSrc: ((m = s.texture) == null ? void 0 : m.src) ?? null,
        selected: n.has(l)
      };
    });
    return {
      selections: f(this, Ie),
      selectionCount: f(this, Ie).length,
      pickModeActive: f(this, He),
      tagModeIsAny: f(this, dn) === "any",
      tagModeIsAll: f(this, dn) === "all",
      tagPreviewCount: 0,
      tiles: i,
      tileCount: i.length
    };
  }
  // ── Render & Events ───────────────────────────────────────────────────
  _onRender(n, i) {
    super._onRender(n, i), S(this, de, df).call(this), S(this, de, pl).call(this);
  }
  async _onClose(n) {
    return f(this, He) && (Yi(), L(this, He, !1)), ha(), f(this, Ke) && (f(this, Ke).call(this, null), L(this, Ke, null)), super._onClose(n);
  }
  // ── Promise-based API ────────────────────────────────────────────────
  /**
   * Open the picker and return a Promise that resolves with the selected
   * selector strings (or null if cancelled).
   *
   * @param {object} [options]
   * @param {string[]} [options.selections]  Initial selections
   * @param {string} [options.placeableType]  Placeable type filter
   * @returns {Promise<string[] | null>}
   */
  static open(n = {}) {
    return new Promise((i) => {
      const r = new at({
        ...n,
        onApply: /* @__PURE__ */ c((a) => i(a), "onApply"),
        onCancel: /* @__PURE__ */ c(() => i(null), "onCancel")
      });
      L(r, Ke, i), r.render(!0);
    });
  }
};
Ie = new WeakMap(), He = new WeakMap(), Mr = new WeakMap(), dn = new WeakMap(), Nr = new WeakMap(), kr = new WeakMap(), Ke = new WeakMap(), fn = new WeakMap(), de = new WeakSet(), df = /* @__PURE__ */ c(function() {
  var a, o, s, l;
  const n = this.element;
  if (!(n instanceof HTMLElement)) return;
  const i = n.querySelector("[data-role='tag-input']"), r = n.querySelector("[data-role='tag-mode']");
  r == null || r.addEventListener("change", (u) => {
    L(this, dn, u.target.value);
  }), i == null || i.addEventListener("input", () => {
    S(this, de, ff).call(this, n);
  }), i == null || i.addEventListener("keydown", (u) => {
    u.key === "Enter" && (u.preventDefault(), S(this, de, gl).call(this, n));
  }), (a = n.querySelector("[data-action='add-tag-selector']")) == null || a.addEventListener("click", () => {
    S(this, de, gl).call(this, n);
  }), (o = n.querySelector("[data-action='toggle-pick-mode']")) == null || o.addEventListener("click", () => {
    f(this, He) ? (Yi(), L(this, He, !1)) : (L(this, He, !0), uf({
      placeableType: f(this, Mr),
      onPick: /* @__PURE__ */ c((u) => {
        S(this, de, mf).call(this, u.id);
      }, "onPick"),
      onCancel: /* @__PURE__ */ c(() => {
        L(this, He, !1), this.render({ force: !0 });
      }, "onCancel")
    })), this.render({ force: !0 });
  }), n.querySelectorAll("[data-action='toggle-tile']").forEach((u) => {
    u.addEventListener("click", () => {
      const d = u.dataset.docId;
      d && S(this, de, gf).call(this, d);
    }), u.addEventListener("mouseenter", () => {
      var g, y;
      const d = u.dataset.docId;
      if (!d) return;
      const m = (y = (g = canvas.tiles) == null ? void 0 : g.placeables) == null ? void 0 : y.find((h) => h.document.id === d);
      m && (L(this, fn, m), Ha(m, { mode: "hover" }));
    }), u.addEventListener("mouseleave", () => {
      f(this, fn) && ($i(f(this, fn)), L(this, fn, null), S(this, de, pl).call(this));
    });
  }), n.querySelectorAll("[data-action='remove-selection']").forEach((u) => {
    u.addEventListener("click", () => {
      const d = Number(u.dataset.selectionIndex);
      Number.isNaN(d) || (f(this, Ie).splice(d, 1), this.render({ force: !0 }));
    });
  }), (s = n.querySelector("[data-action='apply']")) == null || s.addEventListener("click", () => {
    S(this, de, hf).call(this);
  }), (l = n.querySelector("[data-action='cancel']")) == null || l.addEventListener("click", () => {
    S(this, de, pf).call(this);
  });
}, "#bindEvents"), // ── Tag helpers ───────────────────────────────────────────────────────
gl = /* @__PURE__ */ c(function(n) {
  var s;
  const i = n.querySelector("[data-role='tag-input']"), r = (s = i == null ? void 0 : i.value) == null ? void 0 : s.trim();
  if (!r) return;
  const a = r.split(",").map((l) => l.trim()).filter(Boolean);
  if (a.length === 0) return;
  const o = Qd(a, f(this, dn));
  o && !f(this, Ie).includes(o) && f(this, Ie).push(o), i && (i.value = ""), this.render({ force: !0 });
}, "#addTagSelector"), ff = /* @__PURE__ */ c(function(n) {
  var m, g;
  const i = n.querySelector("[data-role='tag-input']"), r = n.querySelector("[data-role='tag-preview']");
  if (!i || !r) return;
  const a = i.value.trim();
  if (!a) {
    r.textContent = "";
    return;
  }
  const o = a.split(",").map((y) => y.trim()).filter(Boolean);
  if (o.length === 0) {
    r.textContent = "";
    return;
  }
  const s = window.Tagger ?? ((m = game.modules.get("tagger")) == null ? void 0 : m.api);
  if (!s) {
    r.textContent = "Tagger not available";
    return;
  }
  const l = f(this, dn) === "any", u = s.getByTag(o, {
    sceneId: (g = canvas.scene) == null ? void 0 : g.id,
    matchAny: l
  }), d = (u == null ? void 0 : u.length) ?? 0;
  r.textContent = `${d} matching placeable(s)`;
}, "#updateTagPreview"), // ── ID selector helpers ──────────────────────────────────────────────
mf = /* @__PURE__ */ c(function(n) {
  const i = `id:${n}`;
  f(this, Ie).includes(i) || (f(this, Ie).push(i), this.render({ force: !0 }));
}, "#addIdSelector"), gf = /* @__PURE__ */ c(function(n) {
  const i = `id:${n}`, r = f(this, Ie).indexOf(i);
  r >= 0 ? f(this, Ie).splice(r, 1) : f(this, Ie).push(i), this.render({ force: !0 });
}, "#toggleIdSelector"), /**
 * Get the set of document IDs that are currently selected across all selector types.
 * Resolves tag/tags-any/tags-all selectors to find matching document IDs.
 * @returns {Set<string>}
 */
hl = /* @__PURE__ */ c(function() {
  const n = /* @__PURE__ */ new Set();
  for (const i of f(this, Ie)) {
    const r = Gl(i);
    if (r.type === "id") {
      n.add(r.value);
      continue;
    }
    const a = _o(i);
    if (a != null && a.placeables)
      for (const { doc: o } of a.placeables)
        o != null && o.id && n.add(o.id);
  }
  return n;
}, "#getSelectedIds"), // ── Canvas selection highlights ──────────────────────────────────────
/**
 * Maintain "selected" highlights on canvas tiles that are in the selection list.
 * Clears stale highlights and adds missing ones (skipping the hovered tile).
 */
pl = /* @__PURE__ */ c(function() {
  var r, a;
  const n = S(this, de, hl).call(this), i = ((r = canvas.tiles) == null ? void 0 : r.placeables) ?? [];
  for (const o of i) {
    const s = (a = o.document) == null ? void 0 : a.id;
    if (!s) continue;
    const l = n.has(s), u = o === f(this, fn), d = cf(o);
    l && !u && !d ? Ha(o, { mode: "selected" }) : !l && d && !u && $i(o);
  }
}, "#refreshSelectionHighlights"), // ── Apply / Cancel ──────────────────────────────────────────────────
hf = /* @__PURE__ */ c(function() {
  var i;
  f(this, He) && (Yi(), L(this, He, !1)), ha();
  const n = [...f(this, Ie)];
  (i = f(this, Nr)) == null || i.call(this, n), f(this, Ke) && (f(this, Ke).call(this, n), L(this, Ke, null)), this.close({ force: !0 });
}, "#doApply"), pf = /* @__PURE__ */ c(function() {
  var n;
  f(this, He) && (Yi(), L(this, He, !1)), ha(), (n = f(this, kr)) == null || n.call(this), f(this, Ke) && (f(this, Ke).call(this, null), L(this, Ke, null)), this.close({ force: !0 });
}, "#doCancel"), c(at, "PlaceablePickerApplication"), pe(at, "APP_ID", `${T}-placeable-picker`), pe(at, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  _e(at, at, "DEFAULT_OPTIONS"),
  {
    id: at.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((gu = _e(at, at, "DEFAULT_OPTIONS")) == null ? void 0 : gu.classes) ?? [], "eidolon-placeable-picker-window", "themed"])
    ),
    tag: "section",
    window: {
      title: "Placeable Picker",
      icon: "fa-solid fa-crosshairs",
      resizable: !0
    },
    position: {
      width: 500,
      height: "auto"
    }
  },
  { inplace: !1 }
)), pe(at, "PARTS", {
  content: {
    template: `modules/${T}/templates/placeable-picker.html`
  }
});
let qa = at;
function fy(t, e) {
  t.querySelectorAll("[data-action='toggle-tween-card']").forEach((n) => {
    n.addEventListener("click", (i) => {
      if (i.target.closest("[data-action='delete-tween']")) return;
      const r = Number(n.dataset.tweenIndex), a = `${e.selectedPath}.tweens.${r}`;
      e.expandedTweens.has(a) ? e.expandedTweens.delete(a) : e.expandedTweens.add(a), e.render();
    });
  }), t.querySelectorAll("[data-action='pick-target']").forEach((n) => {
    n.addEventListener("click", async () => {
      var u, d;
      const i = Number(n.dataset.tweenIndex), r = e.parseEntryPath(e.selectedPath);
      if (!r || Number.isNaN(i)) return;
      const a = e.getEntryAtPath(e.selectedPath), o = ((d = (u = a == null ? void 0 : a.tweens) == null ? void 0 : u[i]) == null ? void 0 : d.target) ?? "", s = o ? [o] : [], l = await qa.open({ selections: s });
      if (l && l.length > 0) {
        if (r.type === "timeline")
          e.mutate((m) => m.updateTween(r.index, i, { target: l[0] }));
        else if (r.type === "branch") {
          const m = (a.tweens ?? []).map((g, y) => y === i ? { ...g, target: l[0] } : g);
          e.mutate((g) => g.updateBranchEntry(r.index, r.branchIndex, r.branchEntryIndex, { tweens: m }));
        }
      }
    });
  }), t.querySelectorAll("[data-action='delete-tween']").forEach((n) => {
    n.addEventListener("click", () => {
      const i = Number(n.dataset.tweenIndex), r = e.parseEntryPath(e.selectedPath);
      if (!(!r || Number.isNaN(i))) {
        if (r.type === "timeline")
          e.mutate((a) => a.removeTween(r.index, i));
        else if (r.type === "branch") {
          const a = e.getEntryAtPath(e.selectedPath);
          if (!a) return;
          const o = (a.tweens ?? []).filter((s, l) => l !== i);
          e.mutate((s) => s.updateBranchEntry(r.index, r.branchIndex, r.branchEntryIndex, { tweens: o }));
        }
      }
    });
  }), t.querySelectorAll(".cinematic-editor__tween-card-body").forEach((n) => {
    const i = Number(n.dataset.tweenIndex);
    n.querySelectorAll("[data-field]").forEach((r) => {
      const a = r.dataset.field, o = r.tagName === "SELECT" || r.type === "checkbox" ? "change" : "input";
      r.addEventListener(o, () => {
        let s;
        if (r.type === "checkbox" ? s = r.checked : a === "x" || a === "y" || a === "scale" || a === "toAlpha" ? s = r.value.trim() === "" ? "" : Number(r.value) || 0 : a === "value" && !Number.isNaN(Number(r.value)) && r.value.trim() !== "" ? s = Number(r.value) : s = r.value, a === "type") {
          const l = rf[s], u = { type: s };
          if (l) {
            const d = l.form ?? "prop";
            d === "prop" || d === "particles" ? Object.assign(u, { attribute: l.attribute, value: l.value }) : d === "camera" ? Object.assign(u, { x: l.x, y: l.y, scale: l.scale }) : d === "lightColor" ? Object.assign(u, { toColor: l.toColor, toAlpha: l.toAlpha, mode: l.mode }) : d === "lightState" && Object.assign(u, { enabled: l.enabled });
          }
          e.queueTweenChange(i, u), e.flushTweenChangesImmediate(), e.render();
        } else
          e.queueTweenChange(i, { [a]: s });
      });
    });
  });
}
c(fy, "bindTweenFieldEvents");
function my(t, e) {
  var i, r, a, o, s, l, u, d, m, g;
  function n(y, h, p) {
    y.type === "timeline" ? e.mutate((v) => v.updateEntry(y.index, { sound: p })) : y.type === "branch" && e.mutate((v) => v.updateBranchEntry(y.index, y.branchIndex, y.branchEntryIndex, { sound: p }));
  }
  c(n, "applySoundPatch"), (i = t.querySelector("[data-action='change-sound-src']")) == null || i.addEventListener("change", async (y) => {
    const h = e.parseEntryPath(e.selectedPath);
    if (!h) return;
    const p = e.getEntryAtPath(e.selectedPath);
    if (!(p != null && p.sound)) return;
    const v = y.target.value, b = { ...p.sound, src: v };
    b.id || (b.id = Uc(v));
    const w = await Vc(v);
    w > 0 && (b.duration = w), n(h, p, b);
  }), (r = t.querySelector("[data-action='pick-sound-src']")) == null || r.addEventListener("click", () => {
    const y = e.parseEntryPath(e.selectedPath);
    if (!y) return;
    const h = e.getEntryAtPath(e.selectedPath);
    if (!(h != null && h.sound)) return;
    new FilePicker({
      type: "audio",
      current: h.sound.src || "",
      callback: /* @__PURE__ */ c(async (v) => {
        const b = { ...h.sound, src: v };
        b.id || (b.id = Uc(v));
        const w = await Vc(v);
        w > 0 && (b.duration = w), n(y, h, b);
      }, "callback")
    }).render(!0);
  }), (a = t.querySelector("[data-action='change-sound-id']")) == null || a.addEventListener("change", (y) => {
    const h = e.parseEntryPath(e.selectedPath);
    if (!h) return;
    const p = e.getEntryAtPath(e.selectedPath);
    p != null && p.sound && n(h, p, { ...p.sound, id: y.target.value || void 0 });
  }), (o = t.querySelector("[data-action='change-sound-volume']")) == null || o.addEventListener("input", (y) => {
    const h = e.parseEntryPath(e.selectedPath);
    if (!h) return;
    const p = e.getEntryAtPath(e.selectedPath);
    p != null && p.sound && n(h, p, { ...p.sound, volume: Number(y.target.value) || 0.8 });
  }), (s = t.querySelector("[data-action='change-sound-loop']")) == null || s.addEventListener("change", (y) => {
    const h = e.parseEntryPath(e.selectedPath);
    if (!h) return;
    const p = e.getEntryAtPath(e.selectedPath);
    p != null && p.sound && n(h, p, { ...p.sound, loop: y.target.checked });
  }), (l = t.querySelector("[data-action='change-sound-fadein']")) == null || l.addEventListener("change", (y) => {
    const h = e.parseEntryPath(e.selectedPath);
    if (!h) return;
    const p = e.getEntryAtPath(e.selectedPath);
    p != null && p.sound && n(h, p, { ...p.sound, fadeIn: Number(y.target.value) || void 0 });
  }), (u = t.querySelector("[data-action='change-sound-fadeout']")) == null || u.addEventListener("change", (y) => {
    const h = e.parseEntryPath(e.selectedPath);
    if (!h) return;
    const p = e.getEntryAtPath(e.selectedPath);
    p != null && p.sound && n(h, p, { ...p.sound, fadeOut: Number(y.target.value) || void 0 });
  }), (d = t.querySelector("[data-action='change-sound-duration']")) == null || d.addEventListener("change", (y) => {
    const h = e.parseEntryPath(e.selectedPath);
    if (!h) return;
    const p = e.getEntryAtPath(e.selectedPath);
    p != null && p.sound && n(h, p, { ...p.sound, duration: Number(y.target.value) || 0 });
  }), (m = t.querySelector("[data-action='change-sound-fireandforget']")) == null || m.addEventListener("change", (y) => {
    const h = e.parseEntryPath(e.selectedPath);
    if (!h) return;
    const p = e.getEntryAtPath(e.selectedPath);
    p != null && p.sound && n(h, p, { ...p.sound, fireAndForget: y.target.checked });
  }), (g = t.querySelector("[data-action='change-stopsound-id']")) == null || g.addEventListener("change", (y) => {
    const h = e.parseEntryPath(e.selectedPath);
    h && (h.type === "timeline" ? e.mutate((p) => p.updateEntry(h.index, { stopSound: y.target.value })) : h.type === "branch" && e.mutate((p) => p.updateBranchEntry(h.index, h.branchIndex, h.branchEntryIndex, { stopSound: y.target.value })));
  });
}
c(my, "bindSoundFieldEvents");
function gy(t, e) {
  var n, i, r, a, o;
  (n = t.querySelector("[data-action='change-emit-signal']")) == null || n.addEventListener("change", (s) => {
    const l = e.parseEntryPath(e.selectedPath);
    l && l.type === "timeline" && e.mutate((u) => u.updateEntry(l.index, { emit: s.target.value }));
  }), (i = t.querySelector("[data-action='change-parallel-join']")) == null || i.addEventListener("change", (s) => {
    const l = e.parseEntryPath(e.selectedPath);
    if (!l || l.type !== "timeline") return;
    const u = e.state.timeline[l.index];
    u != null && u.parallel && e.mutate((d) => d.updateEntry(l.index, { parallel: { ...u.parallel, join: s.target.value } }));
  }), (r = t.querySelector("[data-action='change-parallel-overflow']")) == null || r.addEventListener("change", (s) => {
    const l = e.parseEntryPath(e.selectedPath);
    if (!l || l.type !== "timeline") return;
    const u = e.state.timeline[l.index];
    u != null && u.parallel && e.mutate((d) => d.updateEntry(l.index, { parallel: { ...u.parallel, overflow: s.target.value } }));
  }), (a = t.querySelector("[data-action='edit-parallel-json']")) == null || a.addEventListener("click", () => {
    ay({ selectedPath: e.selectedPath, state: e.state, mutate: e.mutate });
  }), (o = t.querySelector("[data-action='add-branch']")) == null || o.addEventListener("click", () => {
    const s = e.parseEntryPath(e.selectedPath);
    !s || s.type !== "timeline" || e.mutate((l) => l.addBranch(s.index));
  }), t.querySelectorAll("[data-action='remove-branch']").forEach((s) => {
    s.addEventListener("click", () => {
      const l = Number(s.dataset.branchIndex), u = e.parseEntryPath(e.selectedPath);
      !u || u.type !== "timeline" || Number.isNaN(l) || e.mutate((d) => d.removeBranch(u.index, l));
    });
  }), t.querySelectorAll("[data-action='add-branch-step']").forEach((s) => {
    s.addEventListener("click", () => {
      const l = Number(s.dataset.branchIndex), u = e.parseEntryPath(e.selectedPath);
      !u || u.type !== "timeline" || Number.isNaN(l) || e.mutate((d) => d.addBranchEntry(u.index, l, { tweens: [] }));
    });
  }), t.querySelectorAll("[data-action='add-branch-delay']").forEach((s) => {
    s.addEventListener("click", () => {
      const l = Number(s.dataset.branchIndex), u = e.parseEntryPath(e.selectedPath);
      !u || u.type !== "timeline" || Number.isNaN(l) || e.mutate((d) => d.addBranchEntry(u.index, l, { delay: 1e3 }));
    });
  }), t.querySelectorAll("[data-action='add-branch-sound']").forEach((s) => {
    s.addEventListener("click", () => {
      const l = Number(s.dataset.branchIndex), u = e.parseEntryPath(e.selectedPath);
      !u || u.type !== "timeline" || Number.isNaN(l) || e.mutate((d) => d.addBranchEntry(u.index, l, { sound: { src: "", volume: 0.8, loop: !1, duration: 0, fireAndForget: !1 } }));
    });
  }), t.querySelectorAll("[data-action='add-branch-stopSound']").forEach((s) => {
    s.addEventListener("click", () => {
      const l = Number(s.dataset.branchIndex), u = e.parseEntryPath(e.selectedPath);
      !u || u.type !== "timeline" || Number.isNaN(l) || e.mutate((d) => d.addBranchEntry(u.index, l, { stopSound: "" }));
    });
  }), t.querySelectorAll("[data-action='remove-branch-entry']").forEach((s) => {
    s.addEventListener("click", () => {
      const l = Number(s.dataset.branchIndex), u = Number(s.dataset.branchEntryIndex), d = e.parseEntryPath(e.selectedPath);
      !d || d.type !== "timeline" || Number.isNaN(l) || Number.isNaN(u) || e.mutate((m) => m.removeBranchEntry(d.index, l, u));
    });
  });
}
c(gy, "bindSpecialEntryEvents");
function hy(t, e) {
  var n;
  t.querySelectorAll("[data-action='select-segment']").forEach((i) => {
    i.addEventListener("click", () => {
      const r = i.dataset.segmentName;
      r && e.selectSegment(r);
    });
  }), (n = t.querySelector("[data-action='add-segment']")) == null || n.addEventListener("click", async () => {
    const i = await new Promise((r) => {
      new Dialog({
        title: "Add Segment",
        content: '<label style="font-size:0.82rem">Segment name:<input type="text" id="seg-name" value="" style="width:100%;margin-top:0.3rem" /></label>',
        buttons: {
          ok: {
            label: "Add",
            callback: /* @__PURE__ */ c((a) => {
              var o;
              return r((o = a.find("#seg-name").val()) == null ? void 0 : o.trim());
            }, "callback")
          },
          cancel: { label: "Cancel", callback: /* @__PURE__ */ c(() => r(null), "callback") }
        },
        default: "ok",
        close: /* @__PURE__ */ c(() => r(null), "close")
      }).render(!0);
    });
    i && e.addSegment(i);
  }), t.querySelectorAll("[data-action='remove-segment']").forEach((i) => {
    i.addEventListener("click", () => {
      const r = i.dataset.segmentName;
      r && e.removeSegment(r);
    });
  }), t.querySelectorAll("[data-action='rename-segment']").forEach((i) => {
    i.addEventListener("click", async () => {
      const r = i.dataset.segmentName;
      if (!r) return;
      const a = await new Promise((o) => {
        new Dialog({
          title: "Rename Segment",
          content: `<label style="font-size:0.82rem">New name:<input type="text" id="seg-name" value="${r}" style="width:100%;margin-top:0.3rem" /></label>`,
          buttons: {
            ok: {
              label: "Rename",
              callback: /* @__PURE__ */ c((s) => {
                var l;
                return o((l = s.find("#seg-name").val()) == null ? void 0 : l.trim());
              }, "callback")
            },
            cancel: { label: "Cancel", callback: /* @__PURE__ */ c(() => o(null), "callback") }
          },
          default: "ok",
          close: /* @__PURE__ */ c(() => o(null), "close")
        }).render(!0);
      });
      a && a !== r && e.renameSegment(r, a);
    });
  });
}
c(hy, "bindSegmentGraphEvents");
function py(t, e) {
  var n, i, r, a, o, s, l;
  (n = t.querySelector("[data-action='change-gate-event']")) == null || n.addEventListener("change", (u) => {
    var m;
    const d = u.target.value;
    if (!d)
      e.setSegmentGate(null);
    else {
      const g = ((m = e.state.activeSegment) == null ? void 0 : m.gate) ?? {};
      e.setSegmentGate({ ...g, event: d });
    }
  }), (i = t.querySelector("[data-action='change-gate-target']")) == null || i.addEventListener("change", (u) => {
    var m;
    const d = (m = e.state.activeSegment) == null ? void 0 : m.gate;
    d && e.setSegmentGate({ ...d, target: u.target.value || void 0 });
  }), (r = t.querySelector("[data-action='pick-gate-target']")) == null || r.addEventListener("click", async () => {
    var m;
    const u = (m = e.state.activeSegment) == null ? void 0 : m.gate;
    if (!u) return;
    const { enterPickMode: d } = await Promise.resolve().then(() => dy);
    d({
      placeableType: "Tile",
      onPick: /* @__PURE__ */ c((g) => {
        var p, v;
        const y = (v = (p = g.flags) == null ? void 0 : p.tagger) == null ? void 0 : v.tags, h = y != null && y.length ? `tag:${y[0]}` : `id:${g.id}`;
        e.setSegmentGate({ ...u, target: h });
      }, "onPick")
    });
  });
  for (const [u, d] of [["change-gate-anim-idle", "idle"], ["change-gate-anim-hover", "hover"], ["change-gate-anim-dim", "dim"]])
    (a = t.querySelector(`[data-action='${u}']`)) == null || a.addEventListener("change", (m) => {
      var b;
      const g = (b = e.state.activeSegment) == null ? void 0 : b.gate;
      if (!g) return;
      const y = m.target.value.trim(), h = y ? y.split(",").map((w) => w.trim()).filter(Boolean) : void 0, p = { ...g.animation ?? {} };
      h != null && h.length ? p[d] = h.length === 1 ? h[0] : h : delete p[d];
      const v = { ...g, animation: Object.keys(p).length ? p : void 0 };
      v.animation || delete v.animation, e.setSegmentGate(v);
    });
  (o = t.querySelector("[data-action='change-segment-next']")) == null || o.addEventListener("change", (u) => {
    const d = u.target.value;
    e.setSegmentNext(d || null);
  }), (s = t.querySelector("[data-action='edit-segment-setup']")) == null || s.addEventListener("click", () => {
    Pa("setup", { state: e.state, mutate: e.mutate });
  }), (l = t.querySelector("[data-action='edit-segment-landing']")) == null || l.addEventListener("click", () => {
    Pa("landing", { state: e.state, mutate: e.mutate });
  });
}
c(py, "bindSegmentDetailEvents");
var hu, qe, G, Ye, mn, Et, Qe, je, yo, Ne, Xe, bo, Jt, Oi, lt, Jn, gn, Kn, j, yf, bf, vf, wf, tn, bl, vl, wl, El, Ef, nn, Sl, Sf, Tf, Cf, Lf, If, Tl, Qi;
const yt = class yt extends On(In) {
  constructor(n = {}) {
    super(n);
    I(this, j);
    I(this, qe, null);
    I(this, G, null);
    I(this, Ye, null);
    I(this, mn, /* @__PURE__ */ new Set());
    I(this, Et, !1);
    I(this, Qe, null);
    I(this, je, null);
    I(this, yo, 120);
    I(this, Ne, []);
    I(this, Xe, -1);
    I(this, bo, 50);
    I(this, Jt, null);
    I(this, Oi, null);
    I(this, lt, null);
    I(this, Jn, null);
    I(this, gn, null);
    I(this, Kn, null);
    L(this, qe, n.scene ?? canvas.scene ?? null), L(this, G, $t.fromScene(f(this, qe)));
  }
  // ── Context ───────────────────────────────────────────────────────────
  async _prepareContext() {
    var y, h;
    const n = Gp(f(this, G), f(this, G).activeSegmentName), i = Vp(f(this, G).timeline, {
      selectedPath: f(this, Ye),
      windowWidth: ((y = this.position) == null ? void 0 : y.width) ?? 1100
    }), r = f(this, Ye) != null ? iy(f(this, Ye), { state: f(this, G), expandedTweens: f(this, mn) }) : null, a = f(this, G).listCinematicNames(), o = f(this, G).activeCinematicName, l = f(this, G).listSegmentNames().length > 1, u = f(this, G).activeSegment, d = (u == null ? void 0 : u.gate) ?? null, m = (u == null ? void 0 : u.next) ?? null, g = typeof m == "string" ? m : (m == null ? void 0 : m.segment) ?? null;
    return {
      // Toolbar
      sceneName: ((h = f(this, qe)) == null ? void 0 : h.name) ?? "No scene",
      dirty: f(this, Et),
      canUndo: f(this, j, bl),
      canRedo: f(this, j, vl),
      // Cinematic selector
      cinematicNames: a,
      activeCinematicName: o,
      cinematicOptions: a.map((p) => ({
        value: p,
        label: p,
        selected: p === o
      })),
      hasMultipleCinematics: a.length > 1,
      // Segment graph
      segmentGraph: n,
      activeSegmentName: f(this, G).activeSegmentName,
      hasMultipleSegments: l,
      // Swimlane
      timeMarkers: i.timeMarkers,
      mainBlocks: i.mainBlocks,
      subLanes: i.subLanes,
      signalArcs: i.signalArcs,
      fafConnectors: i.fafConnectors,
      totalWidthPx: i.totalWidthPx,
      swimlaneHeightPx: i.swimlaneHeightPx,
      insertionPoints: i.insertionPoints,
      // Detail
      detail: r,
      // Active segment detail
      activeSegmentGate: d,
      activeSegmentNext: g,
      activeSegmentSetupCount: Object.keys((u == null ? void 0 : u.setup) ?? {}).length,
      activeSegmentLandingCount: Object.keys((u == null ? void 0 : u.landing) ?? {}).length,
      // Footer
      trigger: f(this, G).trigger,
      tracking: f(this, G).tracking,
      synchronized: f(this, G).synchronized,
      triggerOptions: Pp.map((p) => ({
        ...p,
        selected: p.value === f(this, G).trigger
      })),
      entryCount: f(this, G).timeline.length,
      totalDuration: i.totalDurationMs,
      targetCount: Wp(f(this, G)),
      setupCount: Object.keys(f(this, G).setup ?? {}).length,
      landingCount: Object.keys(f(this, G).landing ?? {}).length
    };
  }
  // ── Render & Events ───────────────────────────────────────────────────
  _onRender(n, i) {
    var r, a, o;
    if (super._onRender(n, i), S(this, j, yf).call(this), !f(this, Jn)) {
      const s = (a = (r = game.modules.get(T)) == null ? void 0 : r.api) == null ? void 0 : a.cinematic;
      s != null && s.onPlaybackProgress ? (L(this, Jn, s.onPlaybackProgress((l) => S(this, j, If).call(this, l))), console.log("[cinematic-editor] Subscribed to playback progress events")) : console.warn("[cinematic-editor] onPlaybackProgress not available on API", s);
    }
    if (f(this, Kn) && ((o = this.element) == null || o.querySelectorAll(".cinematic-editor__segment-node").forEach((s) => {
      s.classList.toggle("cinematic-editor__segment-node--playing", s.dataset.segmentName === f(this, Kn));
    }), f(this, lt) && f(this, lt).segmentName === f(this, G).activeSegmentName)) {
      const s = performance.now() - f(this, lt).startTime;
      f(this, lt).durationMs - s > 0 && S(this, j, Tl).call(this, f(this, lt).durationMs, f(this, lt).startTime);
    }
    f(this, Jt) || (L(this, Jt, (s) => {
      !s.ctrlKey && !s.metaKey || (s.key === "z" && !s.shiftKey ? (s.preventDefault(), S(this, j, wl).call(this)) : (s.key === "z" && s.shiftKey || s.key === "y") && (s.preventDefault(), S(this, j, El).call(this)));
    }), document.addEventListener("keydown", f(this, Jt)));
  }
  async close(n = {}) {
    if (f(this, je) && S(this, j, nn).call(this), f(this, Et) && !n.force) {
      const i = await new Promise((r) => {
        new Dialog({
          title: "Unsaved Changes",
          content: "<p>You have unsaved cinematic changes.</p>",
          buttons: {
            save: { label: "Save & Close", icon: '<i class="fas fa-save"></i>', callback: /* @__PURE__ */ c(() => r("save"), "callback") },
            discard: { label: "Discard", icon: '<i class="fas fa-trash"></i>', callback: /* @__PURE__ */ c(() => r("discard"), "callback") },
            cancel: { label: "Cancel", icon: '<i class="fas fa-times"></i>', callback: /* @__PURE__ */ c(() => r("cancel"), "callback") }
          },
          default: "cancel",
          close: /* @__PURE__ */ c(() => r("cancel"), "close")
        }).render(!0);
      });
      if (i === "cancel") return;
      i === "save" && await S(this, j, Sl).call(this);
    }
    return super.close(n);
  }
  async _onClose(n) {
    var i;
    return f(this, Qe) !== null && (clearTimeout(f(this, Qe)), L(this, Qe, null)), f(this, Jt) && (document.removeEventListener("keydown", f(this, Jt)), L(this, Jt, null)), (i = f(this, Jn)) == null || i.call(this), L(this, Jn, null), S(this, j, Qi).call(this), super._onClose(n);
  }
};
qe = new WeakMap(), G = new WeakMap(), Ye = new WeakMap(), mn = new WeakMap(), Et = new WeakMap(), Qe = new WeakMap(), je = new WeakMap(), yo = new WeakMap(), Ne = new WeakMap(), Xe = new WeakMap(), bo = new WeakMap(), Jt = new WeakMap(), Oi = new WeakMap(), lt = new WeakMap(), Jn = new WeakMap(), gn = new WeakMap(), Kn = new WeakMap(), j = new WeakSet(), // ── Event binding ─────────────────────────────────────────────────────
yf = /* @__PURE__ */ c(function() {
  const n = this.element;
  if (!(n instanceof HTMLElement)) return;
  const i = S(this, j, bf).call(this);
  oy(n, i), sy(n, i), hy(n, i), ly(n, i), cy(n, i), fy(n, i), my(n, i), gy(n, i), py(n, i);
}, "#bindEvents"), bf = /* @__PURE__ */ c(function() {
  const n = this;
  return {
    // State access (read-only getters — closures over `self` for private field access)
    get state() {
      return f(n, G);
    },
    get selectedPath() {
      return f(n, Ye);
    },
    get scene() {
      return f(n, qe);
    },
    get expandedTweens() {
      return f(n, mn);
    },
    get insertMenuState() {
      return f(n, Oi);
    },
    // Mutations
    mutate: /* @__PURE__ */ c((i) => S(this, j, tn).call(this, i), "mutate"),
    setSelectedPath: /* @__PURE__ */ c((i) => {
      L(this, Ye, i), this.render({ force: !0 });
    }, "setSelectedPath"),
    render: /* @__PURE__ */ c(() => this.render({ force: !0 }), "render"),
    // Cinematic switching (needs full state swap + clear)
    switchCinematic: /* @__PURE__ */ c((i) => {
      f(this, je) && S(this, j, nn).call(this), L(this, G, f(this, G).switchCinematic(i)), L(this, Ye, null), f(this, mn).clear(), this.render({ force: !0 });
    }, "switchCinematic"),
    // Segment management
    selectSegment: /* @__PURE__ */ c((i) => {
      f(this, je) && S(this, j, nn).call(this), L(this, G, f(this, G).switchSegment(i)), L(this, Ye, null), f(this, mn).clear(), this.render({ force: !0 });
    }, "selectSegment"),
    addSegment: /* @__PURE__ */ c((i) => {
      S(this, j, tn).call(this, (r) => r.addSegment(i, r.activeSegmentName));
    }, "addSegment"),
    removeSegment: /* @__PURE__ */ c((i) => {
      S(this, j, tn).call(this, (r) => r.removeSegment(i));
    }, "removeSegment"),
    renameSegment: /* @__PURE__ */ c((i, r) => {
      S(this, j, tn).call(this, (a) => a.renameSegment(i, r));
    }, "renameSegment"),
    setSegmentGate: /* @__PURE__ */ c((i) => {
      S(this, j, tn).call(this, (r) => r.setSegmentGate(i));
    }, "setSegmentGate"),
    setSegmentNext: /* @__PURE__ */ c((i) => {
      S(this, j, tn).call(this, (r) => r.setSegmentNext(i));
    }, "setSegmentNext"),
    // Tween debouncing
    queueTweenChange: /* @__PURE__ */ c((i, r) => S(this, j, Ef).call(this, i, r), "queueTweenChange"),
    flushTweenChanges: /* @__PURE__ */ c(() => {
      f(this, je) && S(this, j, nn).call(this);
    }, "flushTweenChanges"),
    flushTweenChangesImmediate: /* @__PURE__ */ c(() => {
      f(this, Qe) !== null && clearTimeout(f(this, Qe)), L(this, Qe, null), S(this, j, nn).call(this);
    }, "flushTweenChangesImmediate"),
    // Path utilities
    parseEntryPath: Tn,
    getEntryAtPath: /* @__PURE__ */ c((i) => Fa(i, f(this, G)), "getEntryAtPath"),
    // Insert menu
    showInsertMenu: /* @__PURE__ */ c((i, r, a) => S(this, j, vf).call(this, i, r, a), "showInsertMenu"),
    hideInsertMenu: /* @__PURE__ */ c(() => S(this, j, wf).call(this), "hideInsertMenu"),
    // Toolbar actions
    save: /* @__PURE__ */ c(() => S(this, j, Sl).call(this), "save"),
    play: /* @__PURE__ */ c(() => S(this, j, Sf).call(this), "play"),
    resetTracking: /* @__PURE__ */ c(() => S(this, j, Tf).call(this), "resetTracking"),
    exportJSON: /* @__PURE__ */ c(() => S(this, j, Cf).call(this), "exportJSON"),
    validate: /* @__PURE__ */ c(() => S(this, j, Lf).call(this), "validate"),
    importJSON: /* @__PURE__ */ c(() => ry({ state: f(this, G), mutate: /* @__PURE__ */ c((i) => S(this, j, tn).call(this, i), "mutate") }), "importJSON"),
    undo: /* @__PURE__ */ c(() => S(this, j, wl).call(this), "undo"),
    redo: /* @__PURE__ */ c(() => S(this, j, El).call(this), "redo")
  };
}, "#createEventContext"), // ── Insert menu ───────────────────────────────────────────────────────
vf = /* @__PURE__ */ c(function(n, i, r) {
  var l;
  const a = (l = this.element) == null ? void 0 : l.querySelector(".cinematic-editor__insert-menu");
  if (!a) return;
  const o = n.getBoundingClientRect();
  document.body.appendChild(a), a.style.display = "", a.style.position = "fixed", a.style.left = `${o.left}px`;
  const s = a.offsetHeight || 200;
  o.bottom + 4 + s > window.innerHeight ? a.style.top = `${o.top - s - 4}px` : a.style.top = `${o.bottom + 4}px`, L(this, Oi, { insertIndex: i, lane: r });
}, "#showInsertMenu"), wf = /* @__PURE__ */ c(function() {
  var i, r;
  const n = document.body.querySelector(".cinematic-editor__insert-menu") ?? ((i = this.element) == null ? void 0 : i.querySelector(".cinematic-editor__insert-menu"));
  if (n) {
    n.style.display = "none";
    const a = (r = this.element) == null ? void 0 : r.querySelector(".cinematic-editor");
    a && n.parentNode !== a && a.appendChild(n);
  }
  L(this, Oi, null);
}, "#hideInsertMenu"), // ── State mutation ────────────────────────────────────────────────────
tn = /* @__PURE__ */ c(function(n) {
  L(this, Ne, f(this, Ne).slice(0, f(this, Xe) + 1)), f(this, Ne).push(f(this, G)), f(this, Ne).length > f(this, bo) && f(this, Ne).shift(), L(this, Xe, f(this, Ne).length - 1), L(this, G, n(f(this, G))), L(this, Et, !0), this.render({ force: !0 });
}, "#mutate"), bl = /* @__PURE__ */ c(function() {
  return f(this, Xe) >= 0;
}, "#canUndo"), vl = /* @__PURE__ */ c(function() {
  return f(this, Xe) < f(this, Ne).length - 1;
}, "#canRedo"), wl = /* @__PURE__ */ c(function() {
  f(this, j, bl) && (f(this, Xe) === f(this, Ne).length - 1 && f(this, Ne).push(f(this, G)), L(this, G, f(this, Ne)[f(this, Xe)]), Ro(this, Xe)._--, L(this, Et, !0), this.render({ force: !0 }));
}, "#undo"), El = /* @__PURE__ */ c(function() {
  f(this, j, vl) && (Ro(this, Xe)._++, L(this, G, f(this, Ne)[f(this, Xe) + 1]), L(this, Et, !0), this.render({ force: !0 }));
}, "#redo"), Ef = /* @__PURE__ */ c(function(n, i) {
  var r;
  f(this, Ye) != null && (L(this, je, {
    ...f(this, je) ?? {},
    entryPath: f(this, Ye),
    tweenIndex: n,
    patch: { ...((r = f(this, je)) == null ? void 0 : r.patch) ?? {}, ...i }
  }), f(this, Qe) !== null && clearTimeout(f(this, Qe)), L(this, Qe, setTimeout(() => {
    L(this, Qe, null), S(this, j, nn).call(this);
  }, f(this, yo))));
}, "#queueTweenChange"), nn = /* @__PURE__ */ c(function() {
  if (!f(this, je)) return;
  const { entryPath: n, tweenIndex: i, patch: r } = f(this, je);
  L(this, je, null);
  const a = Tn(n);
  if (a) {
    if (a.type === "timeline")
      L(this, G, f(this, G).updateTween(a.index, i, r));
    else if (a.type === "branch") {
      const o = Fa(n, f(this, G));
      if (o) {
        const s = (o.tweens ?? []).map((l, u) => u === i ? { ...l, ...r } : l);
        L(this, G, f(this, G).updateBranchEntry(a.index, a.branchIndex, a.branchEntryIndex, { tweens: s }));
      }
    }
    L(this, Et, !0);
  }
}, "#flushTweenChanges"), Sl = /* @__PURE__ */ c(async function() {
  var n, i, r, a, o, s;
  if (f(this, qe)) {
    if (f(this, je) && S(this, j, nn).call(this), f(this, G).isStale(f(this, qe))) {
      const l = await new Promise((u) => {
        new Dialog({
          title: "External Changes Detected",
          content: "<p>The scene's cinematic data was modified externally. Overwrite with your changes?</p>",
          buttons: {
            overwrite: { label: "Overwrite", icon: '<i class="fas fa-save"></i>', callback: /* @__PURE__ */ c(() => u(!0), "callback") },
            reload: { label: "Reload", icon: '<i class="fas fa-sync"></i>', callback: /* @__PURE__ */ c(() => u("reload"), "callback") },
            cancel: { label: "Cancel", icon: '<i class="fas fa-times"></i>', callback: /* @__PURE__ */ c(() => u(!1), "callback") }
          },
          default: "cancel",
          close: /* @__PURE__ */ c(() => u(!1), "close")
        }).render(!0);
      });
      if (l === "reload") {
        L(this, G, $t.fromScene(f(this, qe), f(this, G).activeCinematicName)), L(this, Et, !1), L(this, Ne, []), L(this, Xe, -1), this.render({ force: !0 }), (i = (n = ui.notifications) == null ? void 0 : n.info) == null || i.call(n, "Cinematic reloaded from scene.");
        return;
      }
      if (!l) return;
    }
    try {
      await f(this, G).save(f(this, qe)), L(this, G, $t.fromScene(f(this, qe), f(this, G).activeCinematicName)), L(this, Et, !1), (a = (r = ui.notifications) == null ? void 0 : r.info) == null || a.call(r, "Cinematic saved."), this.render({ force: !0 });
    } catch (l) {
      console.error(`${T} | Cinematic save failed`, l), (s = (o = ui.notifications) == null ? void 0 : o.error) == null || s.call(o, "Failed to save cinematic data.");
    }
  }
}, "#onSave"), Sf = /* @__PURE__ */ c(async function() {
  var i, r, a, o, s;
  const n = (r = (i = game.modules.get(T)) == null ? void 0 : i.api) == null ? void 0 : r.cinematic;
  if (!(n != null && n.play)) {
    (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, "Cinematic API not available.");
    return;
  }
  await n.play((s = f(this, qe)) == null ? void 0 : s.id, f(this, G).activeCinematicName);
}, "#onPlay"), Tf = /* @__PURE__ */ c(async function() {
  var i, r, a, o, s;
  const n = (r = (i = game.modules.get(T)) == null ? void 0 : i.api) == null ? void 0 : r.cinematic;
  n != null && n.reset && (await n.reset((a = f(this, qe)) == null ? void 0 : a.id, f(this, G).activeCinematicName), (s = (o = ui.notifications) == null ? void 0 : o.info) == null || s.call(o, "Cinematic tracking reset."));
}, "#onResetTracking"), Cf = /* @__PURE__ */ c(async function() {
  var i, r;
  const n = JSON.stringify(f(this, G).toJSON(), null, 2);
  try {
    await navigator.clipboard.writeText(n), (r = (i = ui.notifications) == null ? void 0 : i.info) == null || r.call(i, "Cinematic JSON copied to clipboard.");
  } catch {
    new Dialog({
      title: "Cinematic JSON",
      content: `<textarea style="width:100%;height:300px;font-family:monospace;font-size:0.8rem">${St(n)}</textarea>`,
      buttons: { ok: { label: "Close" } }
    }).render(!0);
  }
}, "#onExportJSON"), Lf = /* @__PURE__ */ c(function() {
  var l, u;
  const n = f(this, G).toJSON(), { targets: i, unresolved: r } = Da(n), a = Fp(n, i), o = [
    ...r.map((d) => ({ path: "targets", level: "warn", message: `Unresolved target: "${d}"` })),
    ...a
  ];
  if (o.length === 0) {
    (u = (l = ui.notifications) == null ? void 0 : l.info) == null || u.call(l, "Cinematic validation passed — no issues found.");
    return;
  }
  const s = o.map((d) => {
    const m = d.level === "error" ? "fa-circle-xmark" : "fa-triangle-exclamation", g = d.level === "error" ? "#e74c3c" : "#f39c12";
    return `<li style="margin:0.3rem 0"><i class="fa-solid ${m}" style="color:${g};margin-right:0.3rem"></i><strong>${St(d.path)}</strong>: ${St(d.message)}</li>`;
  });
  new Dialog({
    title: "Cinematic Validation",
    content: `<p>${o.length} issue(s) found:</p><ul style="list-style:none;padding:0;max-height:300px;overflow:auto">${s.join("")}</ul>`,
    buttons: { ok: { label: "Close" } }
  }).render(!0);
}, "#onValidate"), // ── Playback progress ────────────────────────────────────────────────
If = /* @__PURE__ */ c(function(n) {
  var i, r, a, o, s, l;
  switch (console.log(`[cinematic-editor] playback event: ${n.type}`, n), n.type) {
    case "segment-start":
      L(this, Kn, n.segmentName), n.segmentName !== f(this, G).activeSegmentName ? (L(this, G, f(this, G).switchSegment(n.segmentName)), L(this, Ye, null), f(this, mn).clear(), this.render({ force: !0 })) : (i = this.element) == null || i.querySelectorAll(".cinematic-editor__segment-node").forEach((u) => {
        u.classList.toggle("cinematic-editor__segment-node--playing", u.dataset.segmentName === n.segmentName);
      });
      break;
    case "gate-wait":
      (a = (r = this.element) == null ? void 0 : r.querySelector(`.cinematic-editor__segment-node[data-segment-name="${CSS.escape(n.segmentName)}"]`)) == null || a.classList.add("cinematic-editor__segment-node--gate-waiting");
      break;
    case "gate-resolved":
      (s = (o = this.element) == null ? void 0 : o.querySelector(`.cinematic-editor__segment-node[data-segment-name="${CSS.escape(n.segmentName)}"]`)) == null || s.classList.remove("cinematic-editor__segment-node--gate-waiting");
      break;
    case "timeline-start":
      L(this, lt, { segmentName: n.segmentName, startTime: performance.now(), durationMs: n.durationMs }), n.segmentName === f(this, G).activeSegmentName && S(this, j, Tl).call(this, n.durationMs);
      break;
    case "timeline-end":
      S(this, j, Qi).call(this), L(this, lt, null);
      break;
    case "playback-end":
      S(this, j, Qi).call(this), L(this, lt, null), L(this, Kn, null), (l = this.element) == null || l.querySelectorAll(".cinematic-editor__segment-node--playing, .cinematic-editor__segment-node--gate-waiting").forEach((u) => {
        u.classList.remove("cinematic-editor__segment-node--playing", "cinematic-editor__segment-node--gate-waiting");
      });
      break;
  }
}, "#onPlaybackEvent"), Tl = /* @__PURE__ */ c(function(n, i = null) {
  var u, d;
  S(this, j, Qi).call(this);
  const r = (u = this.element) == null ? void 0 : u.querySelector(".cinematic-editor__playback-cursor"), a = (d = this.element) == null ? void 0 : d.querySelector(".cinematic-editor__swimlane");
  if (console.log(`[cinematic-editor] startCursor: duration=${n}, cursor=${!!r}, swimlane=${!!a}, width=${a == null ? void 0 : a.scrollWidth}`), !r || !a || n <= 0) return;
  r.style.display = "block";
  const o = i ?? performance.now(), s = a.scrollWidth, l = /* @__PURE__ */ c(() => {
    const m = performance.now() - o, g = Math.min(m / n, 1), y = ur + g * (s - ur);
    r.style.left = `${y}px`, g < 1 && L(this, gn, requestAnimationFrame(l));
  }, "tick");
  L(this, gn, requestAnimationFrame(l));
}, "#startCursorAnimation"), Qi = /* @__PURE__ */ c(function() {
  var i;
  f(this, gn) && (cancelAnimationFrame(f(this, gn)), L(this, gn, null));
  const n = (i = this.element) == null ? void 0 : i.querySelector(".cinematic-editor__playback-cursor");
  n && (n.style.display = "none");
}, "#stopCursorAnimation"), c(yt, "CinematicEditorApplication"), pe(yt, "APP_ID", `${T}-cinematic-editor`), pe(yt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  _e(yt, yt, "DEFAULT_OPTIONS"),
  {
    id: yt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((hu = _e(yt, yt, "DEFAULT_OPTIONS")) == null ? void 0 : hu.classes) ?? [], "eidolon-cinematic-editor-window", "themed"])
    ),
    tag: "section",
    window: {
      title: "Cinematic Editor",
      icon: "fa-solid fa-film",
      resizable: !0
    },
    position: {
      width: 1100,
      height: "auto"
    }
  },
  { inplace: !1 }
)), pe(yt, "PARTS", {
  content: {
    template: `modules/${T}/templates/cinematic-editor.html`
  }
});
let yl = yt;
const Of = /* @__PURE__ */ new Map();
function xi(t, e) {
  Of.set(t, e);
}
c(xi, "registerBehaviour");
function Af(t) {
  return Of.get(t);
}
c(Af, "getBehaviour");
xi("float", (t, e = {}) => {
  const n = t.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.speed ?? 0.04, r = e.amplitude ?? 3, a = n.position.y;
  let o = 0;
  return {
    update(s) {
      o += s, n.position.y = a + Math.sin(o * i) * r;
    },
    detach() {
      n.position.y = a;
    }
  };
});
xi("pulse", (t, e = {}) => {
  const n = t.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.minAlpha ?? 0.6, r = e.maxAlpha ?? 1, a = e.speed ?? 0.05, o = n.alpha;
  let s = Math.PI / 2;
  return {
    update(l) {
      s += l * a;
      const u = (Math.sin(s) + 1) / 2;
      n.alpha = i + (r - i) * u;
    },
    detach() {
      n.alpha = o;
    }
  };
});
xi("scale", (t, e = {}) => {
  const n = t.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.factor ?? 1.12, r = e.durationFrames ?? 15, a = oi(e.easing ?? "easeOutCubic"), o = n.scale.x, s = n.scale.y, l = o * i, u = s * i;
  let d = 0;
  return {
    update(m) {
      if (d < r) {
        d += m;
        const g = Math.min(d / r, 1), y = a(g);
        n.scale.x = o + (l - o) * y, n.scale.y = s + (u - s) * y;
      }
    },
    detach() {
      n.scale.x = o, n.scale.y = s;
    }
  };
});
xi("glow", (t, e = {}) => {
  var g, y;
  const n = t.mesh;
  if (!((g = n == null ? void 0 : n.texture) != null && g.baseTexture)) return { update() {
  }, detach() {
  } };
  const i = e.color ?? 4513279, r = e.alpha ?? 0.5, a = e.blur ?? 8, o = e.pulseSpeed ?? 0.03, s = PIXI.Sprite.from(n.texture);
  s.anchor.set(n.anchor.x, n.anchor.y), s.width = n.width, s.height = n.height, s.position.copyFrom(n.position), s.angle = n.angle, s.alpha = r, s.tint = i;
  const l = PIXI.BlurFilter ?? ((y = PIXI.filters) == null ? void 0 : y.BlurFilter), u = new l(a);
  s.filters = [u];
  const d = t.children.indexOf(n);
  d > 0 ? t.addChildAt(s, d) : t.addChildAt(s, 0);
  let m = 0;
  return {
    update(h) {
      m += h;
      const p = (Math.sin(m * o) + 1) / 2;
      s.alpha = r * (0.5 + 0.5 * p);
    },
    detach() {
      s.parent && s.parent.removeChild(s), s.destroy({ children: !0 });
    }
  };
});
xi("none", () => ({ update() {
}, detach() {
} }));
const Qr = {
  idle: ["float", "glow"],
  hover: ["scale"],
  dim: ["none"]
};
function yy(t) {
  if (!t) return { ...Qr };
  const e = /* @__PURE__ */ c((n, i) => n === void 0 ? i : typeof n == "string" ? [n] : typeof n == "object" && !Array.isArray(n) && n.name ? [n] : Array.isArray(n) ? n : i, "normalize");
  return {
    idle: e(t.idle, Qr.idle),
    hover: e(t.hover, Qr.hover),
    dim: e(t.dim, Qr.dim)
  };
}
c(yy, "normalizeConfig");
var $r, Ai, Mi, Yn, hn, Ln, Cl, Ll;
const rc = class rc {
  /**
   * @param {PlaceableObject} placeable
   * @param {object|undefined} animationConfig  Raw animation config from the await entry
   */
  constructor(e, n) {
    I(this, Ln);
    I(this, $r);
    I(this, Ai);
    I(this, Mi, null);
    I(this, Yn, []);
    I(this, hn, null);
    L(this, $r, e), L(this, Ai, yy(n));
  }
  /** Current animation state name. */
  get state() {
    return f(this, Mi);
  }
  /**
   * Start animating in the given state.
   * @param {string} [state="idle"]
   */
  start(e = "idle") {
    S(this, Ln, Cl).call(this, e), L(this, hn, (n) => {
      for (const i of f(this, Yn)) i.update(n);
    }), canvas.app.ticker.add(f(this, hn));
  }
  /**
   * Transition to a new state. Detaches current behaviours, attaches new ones.
   * No-op if already in the requested state.
   * @param {string} state
   */
  setState(e) {
    e !== f(this, Mi) && (S(this, Ln, Ll).call(this), S(this, Ln, Cl).call(this, e));
  }
  /**
   * Full cleanup — detach all behaviours and remove ticker.
   */
  detach() {
    var e, n;
    S(this, Ln, Ll).call(this), f(this, hn) && ((n = (e = canvas.app) == null ? void 0 : e.ticker) == null || n.remove(f(this, hn)), L(this, hn, null));
  }
};
$r = new WeakMap(), Ai = new WeakMap(), Mi = new WeakMap(), Yn = new WeakMap(), hn = new WeakMap(), Ln = new WeakSet(), // ── Private ──────────────────────────────────────────────────────────
Cl = /* @__PURE__ */ c(function(e) {
  L(this, Mi, e);
  const n = f(this, Ai)[e] ?? f(this, Ai).idle ?? ["none"];
  for (const i of n) {
    const r = typeof i == "string" ? i : i.name, a = typeof i == "string" ? void 0 : i, o = Af(r);
    if (!o) {
      console.warn(`TileAnimator: unknown behaviour "${r}"`);
      continue;
    }
    f(this, Yn).push(o(f(this, $r), a));
  }
}, "#attachBehaviours"), Ll = /* @__PURE__ */ c(function() {
  for (const e of f(this, Yn)) e.detach();
  L(this, Yn, []);
}, "#detachBehaviours"), c(rc, "TileAnimator");
let dr = rc;
const by = "cinematic", ns = 5, Il = /* @__PURE__ */ new Set();
function qt(t) {
  for (const e of Il)
    try {
      e(t);
    } catch (n) {
      console.error("[cinematic] playback listener error:", n);
    }
}
c(qt, "emitPlaybackEvent");
function vy(t) {
  return Il.add(t), () => Il.delete(t);
}
c(vy, "onPlaybackProgress");
let ve = null, zt = null, tr = null, nr = null, di = 0, Fn = null;
function Jl(t, e = "default") {
  return `cinematic-progress-${t}-${e}`;
}
c(Jl, "progressFlagKey");
function wy(t, e, n, i) {
  game.user.setFlag(T, Jl(t, e), {
    currentSegment: n,
    completedSegments: [...i],
    timestamp: Date.now()
  }).catch(() => {
  });
}
c(wy, "saveSegmentProgress");
function Ol(t, e = "default") {
  game.user.unsetFlag(T, Jl(t, e)).catch(() => {
  });
}
c(Ol, "clearProgress");
function Mf(t, e = "default", n = 3e5) {
  const i = game.user.getFlag(T, Jl(t, e));
  return !i || typeof i.timestamp != "number" || Date.now() - i.timestamp > n ? null : i.currentSegment ? i : null;
}
c(Mf, "getSavedProgress");
function ai(t, e = "default") {
  return `cinematic-seen-${t}-${e}`;
}
c(ai, "seenFlagKey");
function Xc(t, e = "default") {
  return !!game.user.getFlag(T, ai(t, e));
}
c(Xc, "hasSeenCinematic");
function Ey(t, e) {
  var n;
  if (t == null) return null;
  if (typeof t != "object" || Array.isArray(t))
    return console.warn(`[${T}] Cinematic: invalid data for ${e} (expected object). Ignoring.`), null;
  if (t.trigger !== void 0 && typeof t.trigger != "string")
    return console.warn(`[${T}] Cinematic: invalid 'trigger' on ${e} (expected string). Ignoring.`), null;
  if (t.tracking !== void 0 && typeof t.tracking != "boolean")
    return console.warn(`[${T}] Cinematic: invalid 'tracking' on ${e} (expected boolean). Ignoring.`), null;
  if (t.synchronized !== void 0 && typeof t.synchronized != "boolean")
    return console.warn(`[${T}] Cinematic: invalid 'synchronized' on ${e} (expected boolean). Ignoring.`), null;
  if (t.segments) {
    if (typeof t.segments != "object" || Array.isArray(t.segments))
      return console.warn(`[${T}] Cinematic: invalid 'segments' on ${e} (expected object). Ignoring.`), null;
    for (const [i, r] of Object.entries(t.segments)) {
      if (!r || typeof r != "object" || Array.isArray(r)) {
        console.warn(`[${T}] Cinematic: invalid segment "${i}" on ${e}. Removing.`), delete t.segments[i];
        continue;
      }
      if (r.timeline !== void 0 && !Array.isArray(r.timeline)) {
        console.warn(`[${T}] Cinematic: invalid timeline on segment "${i}" of ${e}. Removing.`), delete t.segments[i];
        continue;
      }
      (n = r.timeline) != null && n.length && (r.timeline = r.timeline.filter((a, o) => !a || typeof a != "object" || Array.isArray(a) ? (console.warn(`[${T}] Cinematic: segment "${i}" timeline[${o}] on ${e} is not a valid object, removing.`), !1) : !0));
    }
    if (Object.keys(t.segments).length === 0)
      return console.warn(`[${T}] Cinematic: no valid segments on ${e}. Ignoring.`), null;
  }
  return t.timeline !== void 0 && !Array.isArray(t.timeline) ? (console.warn(`[${T}] Cinematic: invalid 'timeline' on ${e} (expected array). Ignoring.`), null) : t;
}
c(Ey, "validateSingleCinematic");
function Fo(t) {
  const e = t ? game.scenes.get(t) : canvas.scene;
  let n = (e == null ? void 0 : e.getFlag(T, by)) ?? null;
  if (n == null) return null;
  if (typeof n != "object" || Array.isArray(n))
    return console.warn(`[${T}] Cinematic: invalid flag data on scene ${e == null ? void 0 : e.id} (expected object). Ignoring.`), null;
  if ((n.version ?? 1) < 3) {
    const { version: i, ...r } = n;
    n = { version: 3, cinematics: { default: r } };
  }
  if (n.version === 3) {
    for (const [i, r] of Object.entries(n.cinematics ?? {}))
      n.cinematics[i] = $t.migrateV3toV4(r);
    n.version = 4;
  }
  if (n.version === 4) {
    for (const [i, r] of Object.entries(n.cinematics ?? {}))
      n.cinematics[i] = $t.migrateV4toV5(r);
    n.version = ns;
  }
  if (n.version > ns)
    return console.warn(`[${T}] Cinematic: scene ${e == null ? void 0 : e.id} has version ${n.version}, runtime supports up to ${ns}. Skipping.`), null;
  if (!n.cinematics || typeof n.cinematics != "object")
    return console.warn(`[${T}] Cinematic: no 'cinematics' map on scene ${e == null ? void 0 : e.id}. Ignoring.`), null;
  for (const [i, r] of Object.entries(n.cinematics)) {
    const a = Ey(r, `scene ${e == null ? void 0 : e.id} cinematic "${i}"`);
    a ? n.cinematics[i] = a : delete n.cinematics[i];
  }
  return Object.keys(n.cinematics).length === 0 ? null : n;
}
c(Fo, "getCinematicData");
function ja(t, e = "default") {
  var i;
  const n = Fo(t);
  return ((i = n == null ? void 0 : n.cinematics) == null ? void 0 : i[e]) ?? null;
}
c(ja, "getNamedCinematic");
function Sy(t) {
  const e = Fo(t);
  return e ? Object.keys(e.cinematics) : [];
}
c(Sy, "listCinematicNames");
function Ty() {
  return game.ready ? Promise.resolve() : new Promise((t) => Hooks.once("ready", t));
}
c(Ty, "waitForReady");
async function Cy(t = 1e4) {
  var n, i;
  const e = (i = (n = game.modules.get(T)) == null ? void 0 : n.api) == null ? void 0 : i.tween;
  return e != null && e.Timeline ? e.Timeline : new Promise((r) => {
    const a = Date.now(), o = setTimeout(() => {
      var l, u;
      (u = (l = ui.notifications) == null ? void 0 : l.info) == null || u.call(l, `[${T}] Cinematic: waiting for tween engine...`);
    }, 2e3), s = setInterval(() => {
      var u, d, m, g;
      const l = (d = (u = game.modules.get(T)) == null ? void 0 : u.api) == null ? void 0 : d.tween;
      l != null && l.Timeline ? (clearInterval(s), clearTimeout(o), r(l.Timeline)) : Date.now() - a > t && (clearInterval(s), clearTimeout(o), console.warn(`[${T}] Cinematic: tween API not available after ${t}ms.`), (g = (m = ui.notifications) == null ? void 0 : m.warn) == null || g.call(m, `[${T}] Cinematic: tween engine unavailable — cinematic cannot play.`), r(null));
    }, 200);
  });
}
c(Cy, "waitForTweenAPI");
async function Al(t = 5e3) {
  var e;
  return window.Tagger ?? ((e = game.modules.get("tagger")) == null ? void 0 : e.api) ? !0 : new Promise((n) => {
    const i = Date.now(), r = setInterval(() => {
      var a;
      window.Tagger ?? ((a = game.modules.get("tagger")) == null ? void 0 : a.api) ? (clearInterval(r), n(!0)) : Date.now() - i > t && (clearInterval(r), console.warn(`[${T}] Cinematic: Tagger API not available after ${t}ms.`), n(!1));
    }, 200);
  });
}
c(Al, "waitForTagger");
async function Ly(t, e, n) {
  if (!t || !t.event) return;
  const i = { ...t };
  console.log(`[${T}] Cinematic: waiting for gate: ${t.event}`);
  let r = null;
  if (t.event === "tile-click" && t.target && t.animation) {
    const a = e.get(t.target);
    (a == null ? void 0 : a.kind) === "placeable" && a.placeable && (r = new dr(a.placeable, t.animation), r.start());
  }
  try {
    if (t.timeout && t.timeout > 0) {
      const a = new Promise((s) => setTimeout(s, t.timeout)), o = rl(i, { signal: n.signal, eventBus: null });
      await Promise.race([o, a]);
    } else
      await rl(i, { signal: n.signal, eventBus: null });
  } finally {
    r && r.detach();
  }
}
c(Ly, "processGate");
function Nf(t) {
  if (!t.segments) return [];
  const e = [], n = /* @__PURE__ */ new Set();
  let i = t.entry;
  for (; i && typeof i == "string" && t.segments[i] && !n.has(i); )
    n.add(i), e.push(i), i = t.segments[i].next;
  return e;
}
c(Nf, "getSegmentOrder");
function Ba(t, e) {
  const n = Nf(t);
  for (const i of n) {
    const r = t.segments[i];
    if (r.setup)
      try {
        Ve(r.setup, e);
      } catch (a) {
        console.warn(`[${T}] Cinematic: error applying setup for segment "${i}":`, a);
      }
    if (r.landing)
      try {
        Ve(r.landing, e);
      } catch (a) {
        console.warn(`[${T}] Cinematic: error applying landing for segment "${i}":`, a);
      }
  }
  canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
}
c(Ba, "applyAllSegmentLandingStates");
async function ir(t, e = "default", n = null) {
  var w, C, O, A, k, $, H, q;
  const i = t ?? ((w = canvas.scene) == null ? void 0 : w.id);
  if (!i) return;
  const r = `${i}:${e}`;
  if (n || (n = /* @__PURE__ */ new Set()), n.has(r)) {
    console.warn(`[${T}] Cinematic: circular transition detected at "${r}". Stopping chain.`), (O = (C = ui.notifications) == null ? void 0 : C.warn) == null || O.call(C, "Cinematic: circular transition detected, stopping.");
    return;
  }
  n.add(r), (ve == null ? void 0 : ve.status) === "running" && ve.cancel("replaced"), ve = null, zt && (zt.abort("replaced"), zt = null);
  const a = ja(i, e);
  if (!a) {
    console.warn(`[${T}] Cinematic: no cinematic "${e}" on scene ${i}.`);
    return;
  }
  const o = await Cy();
  if (!o || ((A = canvas.scene) == null ? void 0 : A.id) !== i || (await Al(), ((k = canvas.scene) == null ? void 0 : k.id) !== i)) return;
  const { targets: s, unresolved: l } = Da(a);
  if (console.log(`[${T}] Cinematic "${e}": resolved ${s.size} targets`), l.length && console.warn(`[${T}] Cinematic "${e}": skipping ${l.length} unresolved: ${l.join(", ")}`), s.size === 0) {
    console.warn(`[${T}] Cinematic "${e}": no targets could be resolved on scene ${i}.`);
    return;
  }
  const u = Op(a);
  tr = Ip(u, s), nr = s;
  const d = Mf(i, e), m = new AbortController();
  zt = m;
  const g = a.synchronized === !0 && game.user.isGM, y = Nf(a);
  if (y.length === 0) {
    console.warn(`[${T}] Cinematic "${e}": no segments to execute.`);
    return;
  }
  let h = 0;
  const p = /* @__PURE__ */ new Set();
  if (d) {
    const F = d.completedSegments ?? [];
    for (const N of F) p.add(N);
    const D = y.indexOf(d.currentSegment);
    D >= 0 && (h = D, console.log(`[${T}] Cinematic "${e}": resuming from segment "${d.currentSegment}" (${F.length} completed)`));
  }
  for (let F = 0; F < h; F++) {
    const D = y[F], N = a.segments[D];
    if (N.setup)
      try {
        Ve(N.setup, s);
      } catch (x) {
        console.warn(`[${T}] Cinematic: error applying setup for completed segment "${D}":`, x);
      }
    if (N.landing)
      try {
        Ve(N.landing, s);
      } catch (x) {
        console.warn(`[${T}] Cinematic: error applying landing for completed segment "${D}":`, x);
      }
  }
  let v = !1, b = !1;
  qt({ type: "playback-start", sceneName: (($ = canvas.scene) == null ? void 0 : $.name) ?? i });
  try {
    for (let F = h; F < y.length; F++) {
      if (m.signal.aborted) {
        v = !0;
        break;
      }
      if (((H = canvas.scene) == null ? void 0 : H.id) !== i) {
        v = !0;
        break;
      }
      const D = y[F], N = a.segments[D];
      if (console.log(`[${T}] Cinematic "${e}": entering segment "${D}"`), qt({ type: "segment-start", segmentName: D }), wy(i, e, D, [...p]), N.gate) {
        qt({ type: "gate-wait", segmentName: D, gate: N.gate });
        try {
          await Ly(N.gate, s, m);
        } catch (B) {
          if (m.signal.aborted) {
            v = !0;
            break;
          }
          throw B;
        }
        qt({ type: "gate-resolved", segmentName: D });
      }
      if (m.signal.aborted) {
        v = !0;
        break;
      }
      if (N.setup)
        try {
          Ve(N.setup, s), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
        } catch (B) {
          console.error(`[${T}] Cinematic "${e}": error applying setup for segment "${D}":`, B);
        }
      if ((q = N.timeline) != null && q.length) {
        const B = Wl(N.timeline);
        qt({ type: "timeline-start", segmentName: D, durationMs: B });
        const { tl: W } = Dp(
          { setup: {}, timeline: N.timeline },
          s,
          o,
          {
            timelineName: `cinematic-${i}-${e}-${D}`,
            onStepComplete: /* @__PURE__ */ c((U) => {
              qt({ type: "step-complete", segmentName: D, stepIndex: U });
            }, "onStepComplete")
          }
        );
        ve = W.run({
          broadcast: g,
          commit: g
        });
        try {
          await new Promise((U, K) => {
            W.onComplete(() => U()), W.onCancel(() => K(new Error("cancelled"))), W.onError((X) => K(new Error(`timeline error: ${X}`)));
            const ae = /* @__PURE__ */ c(() => K(new Error("cancelled")), "onAbort");
            m.signal.addEventListener("abort", ae, { once: !0 });
          });
        } catch (U) {
          if (U.message === "cancelled" || m.signal.aborted) {
            v = !0;
            break;
          }
          throw U;
        }
        qt({ type: "timeline-end", segmentName: D });
      }
      if (m.signal.aborted) {
        v = !0;
        break;
      }
      if (N.landing)
        try {
          Ve(N.landing, s), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
        } catch (B) {
          console.error(`[${T}] Cinematic "${e}": error applying landing for segment "${D}":`, B);
        }
      qt({ type: "segment-complete", segmentName: D }), p.add(D);
      const x = N.next;
      if (x && typeof x == "object" && x.scene) {
        const B = x.scene, W = x.segment ?? a.entry;
        console.log(`[${T}] Cinematic "${e}": cross-scene transition to scene ${B}, segment "${W}"`), ve = null, zt = null, Ol(i, e), qc(), a.tracking !== !1 && await game.user.setFlag(T, ai(i, e), !0), Fn = { sceneId: B, cinematicName: e, visitedChain: n };
        const R = game.scenes.get(B);
        R ? R.view() : (console.warn(`[${T}] Cinematic: cross-scene transition target scene "${B}" not found.`), Fn = null);
        return;
      }
    }
  } catch (F) {
    b = !0, console.error(`[${T}] Cinematic "${e}" error on scene ${i}:`, F);
  }
  if (ve = null, zt = null, Ol(i, e), qc(), tr = null, nr = null, qt({ type: "playback-end", cancelled: !!v }), v) {
    console.log(`[${T}] Cinematic "${e}" cancelled on scene ${i}.`), Ba(a, s);
    return;
  }
  if (b) {
    Ba(a, s);
    return;
  }
  a.tracking !== !1 && await game.user.setFlag(T, ai(i, e), !0), console.log(`[${T}] Cinematic "${e}" complete on scene ${i}.`);
}
c(ir, "playCinematic");
async function Iy(t, e = "default") {
  var i;
  const n = t ?? ((i = canvas.scene) == null ? void 0 : i.id);
  n && (await game.user.unsetFlag(T, ai(n, e)), console.log(`[${T}] Cinematic: cleared seen flag for "${e}" on scene ${n}.`));
}
c(Iy, "resetCinematic");
async function Oy(t, e, n = "default") {
  var a;
  if (!game.user.isGM) return;
  const i = t ?? ((a = canvas.scene) == null ? void 0 : a.id);
  if (!i || !e) return;
  const r = game.users.get(e);
  r && (await r.unsetFlag(T, ai(i, n)), console.log(`[${T}] Cinematic: cleared seen flag for user ${r.name} on "${n}" scene ${i}.`));
}
c(Oy, "resetCinematicForUser");
async function Ay(t, e = "default") {
  var a;
  if (!game.user.isGM) return;
  const n = t ?? ((a = canvas.scene) == null ? void 0 : a.id);
  if (!n) return;
  const i = ai(n, e), r = game.users.map((o) => o.getFlag(T, i) ? o.unsetFlag(T, i) : Promise.resolve());
  await Promise.all(r), console.log(`[${T}] Cinematic: cleared seen flag for all users on "${e}" scene ${n}.`);
}
c(Ay, "resetCinematicForAll");
function My(t, e = "default") {
  var r;
  const n = t ?? ((r = canvas.scene) == null ? void 0 : r.id);
  if (!n) return [];
  const i = ai(n, e);
  return game.users.map((a) => ({
    userId: a.id,
    name: a.name,
    color: a.color ?? "#888888",
    isGM: a.isGM,
    seen: !!a.getFlag(T, i)
  }));
}
c(My, "getSeenStatus");
function Ny(t, e) {
  var i;
  const n = t ?? ((i = canvas.scene) == null ? void 0 : i.id);
  return e ? ja(n, e) != null : Fo(n) != null;
}
c(Ny, "hasCinematic");
function ky() {
  if (!tr || !nr) {
    console.warn(`[${T}] Cinematic: no snapshot available for revert.`);
    return;
  }
  (ve == null ? void 0 : ve.status) === "running" && ve.cancel("reverted"), ve = null, zt && (zt.abort("reverted"), zt = null);
  try {
    Ve(tr, nr), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 }), console.log(`[${T}] Cinematic: reverted to pre-cinematic state.`);
  } catch (t) {
    console.error(`[${T}] Cinematic: error during revert:`, t);
  }
  tr = null, nr = null;
}
c(ky, "revertCinematic");
async function $y() {
  const t = ++di;
  if (console.log(`[${T}] Cinematic: canvasReady fired, gen=${t}, game.ready=${game.ready}`), await Ty(), t !== di) return;
  console.log(`[${T}] Cinematic: game is ready`);
  const e = canvas.scene;
  if (!e) {
    console.log(`[${T}] Cinematic: no canvas.scene, exiting`);
    return;
  }
  if (Fn && Fn.sceneId === e.id) {
    const a = Fn;
    Fn = null, console.log(`[${T}] Cinematic: picking up pending transition to "${a.cinematicName}" on scene ${e.id}`);
    try {
      await ir(e.id, a.cinematicName, a.visitedChain);
    } catch (o) {
      console.error(`[${T}] Cinematic: error during pending transition playback on scene ${e.id}:`, o);
    }
    return;
  }
  Fn = null;
  const n = Fo(e.id);
  if (!n) {
    console.log(`[${T}] Cinematic: no cinematic flag on scene ${e.id}, exiting`);
    return;
  }
  console.log(`[${T}] Cinematic: found ${Object.keys(n.cinematics).length} cinematic(s) on scene ${e.id}`);
  const i = [];
  for (const [a, o] of Object.entries(n.cinematics))
    (!o.trigger || o.trigger === "canvasReady") && i.push({ name: a, data: o });
  if (i.length === 0) {
    console.log(`[${T}] Cinematic: no canvasReady cinematics on scene ${e.id}, exiting`);
    return;
  }
  for (const { name: a } of i) {
    const o = Mf(e.id, a);
    if (t !== di) return;
    if (o) {
      console.log(`[${T}] Cinematic "${a}": found saved progress at segment "${o.currentSegment}", resuming...`);
      try {
        await ir(e.id, a);
      } catch (s) {
        console.error(`[${T}] Cinematic "${a}": error during resumed playback on scene ${e.id}:`, s);
      }
      return;
    }
  }
  let r = null;
  for (const { name: a, data: o } of i)
    if (!(o.tracking !== !1 && Xc(e.id, a))) {
      r = { name: a, data: o };
      break;
    }
  if (!r) {
    if (console.log(`[${T}] Cinematic: all canvasReady cinematics already seen on scene ${e.id}`), _y(e.id, i), (ve == null ? void 0 : ve.status) === "running" && ve.cancel("already-seen"), ve = null, await Al(), t !== di) return;
    for (const { name: a, data: o } of i)
      try {
        const { targets: s } = Da(o);
        Ba(o, s);
      } catch (s) {
        console.error(`[${T}] Cinematic "${a}": error applying landing states (already seen) on scene ${e.id}:`, s);
      }
    canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    return;
  }
  if (t === di && (console.log(`[${T}] Cinematic: playing first unseen cinematic "${r.name}"...`), await Al(), t === di)) {
    for (const { name: a, data: o } of i) {
      if (a === r.name) continue;
      if (o.tracking !== !1 && Xc(e.id, a))
        try {
          const { targets: l } = Da(o);
          Ba(o, l);
        } catch (l) {
          console.error(`[${T}] Cinematic "${a}": error applying landing states (already seen) on scene ${e.id}:`, l);
        }
    }
    try {
      await ir(e.id, r.name);
    } catch (a) {
      console.error(`[${T}] Cinematic "${r.name}": error during playback on scene ${e.id}:`, a);
    }
  }
}
c($y, "onCanvasReady$1");
function _y(t, e) {
  for (const { name: n } of e)
    Ol(t, n);
}
c(_y, "clearAllCanvasReadyProgress");
function Dy(t = 3e5) {
  var i;
  const e = (i = game.user.flags) == null ? void 0 : i[T];
  if (!e) return;
  const n = Date.now();
  for (const r of Object.keys(e)) {
    if (!r.startsWith("cinematic-progress-")) continue;
    const a = e[r];
    if (!a || typeof a.timestamp != "number") {
      game.user.unsetFlag(T, r).catch(() => {
      });
      continue;
    }
    n - a.timestamp > t && (console.log(`[${T}] Cinematic: cleaning up stale progress flag "${r}" (age: ${n - a.timestamp}ms)`), game.user.unsetFlag(T, r).catch(() => {
    }));
  }
}
c(Dy, "cleanupStaleProgressFlags");
function Fy() {
  Hooks.on("getSceneControlButtons", (t) => {
    if (!game.user.isGM) return;
    const e = Array.isArray(t) ? t : t instanceof Map ? Array.from(t.values()) : Object.values(t);
    if (!e.length) return;
    const n = e.find((o) => (o == null ? void 0 : o.name) === "tiles") ?? e.find((o) => (o == null ? void 0 : o.name) === "tokens" || (o == null ? void 0 : o.name) === "token") ?? e[0];
    if (!n) return;
    const i = n.tools, r = "eidolonCinematicEditor";
    if (Array.isArray(i) && i.some((o) => (o == null ? void 0 : o.name) === r) || i instanceof Map && i.has(r)) return;
    const a = {
      name: r,
      title: "Cinematic Editor",
      icon: "fa-solid fa-film",
      button: !0,
      toggle: !1,
      visible: !0,
      onClick: /* @__PURE__ */ c(() => {
        new yl({ scene: canvas.scene }).render(!0);
      }, "onClick")
    };
    Array.isArray(i) ? i.push(a) : i instanceof Map ? i.set(r, a) : i && typeof i == "object" ? i[r] = a : n.tools = [a];
  });
}
c(Fy, "registerEditorButton");
function Py() {
  Hooks.on("canvasReady", $y), Fy(), Hooks.once("ready", () => {
    Dy();
    const t = game.modules.get(T);
    t.api || (t.api = {}), t.api.cinematic = {
      play: ir,
      reset: Iy,
      resetForUser: Oy,
      resetForAll: Ay,
      getSeenStatus: My,
      has: Ny,
      get: ja,
      list: Sy,
      revert: ky,
      onPlaybackProgress: vy,
      TileAnimator: dr,
      registerBehaviour: xi,
      getBehaviour: Af,
      trigger: /* @__PURE__ */ c(async (e, n, i = "default") => {
        var o;
        const r = n ?? ((o = canvas.scene) == null ? void 0 : o.id);
        if (!r) return;
        const a = ja(r, i);
        a && (a.trigger && a.trigger !== e || await ir(r, i));
      }, "trigger")
    }, console.log(`[${T}] Cinematic API registered (v5).`);
  });
}
c(Py, "registerCinematicHooks");
function Zc(t, e) {
  const n = Math.abs(t.width), i = Math.abs(t.height), r = n / 2, a = i / 2;
  let o = e.x - (t.x + r), s = e.y - (t.y + a);
  if (t.rotation !== 0) {
    const l = Math.toRadians(t.rotation), u = Math.cos(l), d = Math.sin(l), m = u * o + d * s, g = u * s - d * o;
    o = m, s = g;
  }
  return o += r, s += a, o >= 0 && o <= n && s >= 0 && s <= i;
}
c(Zc, "pointWithinTile");
ko("tile-click", (t, e) => t.target ? new Promise((n, i) => {
  var y;
  if (e.signal.aborted) return i(e.signal.reason ?? "aborted");
  const r = _o(t.target);
  if (!((y = r == null ? void 0 : r.placeables) != null && y.length))
    return i(new Error(`await tile-click: no placeables found for "${t.target}"`));
  const a = r.placeables, o = [];
  for (const { placeable: h } of a) {
    const p = new dr(h, t.animation);
    p.start("idle"), o.push({ placeable: h, animator: p });
  }
  const s = document.getElementById("board");
  let l = null;
  const u = /* @__PURE__ */ c((h) => {
    const p = canvas.activeLayer;
    if (!p) return;
    const v = p.toLocal(h);
    if (!v || isNaN(v.x) || isNaN(v.y)) return;
    let b = !1;
    for (const { placeable: w, animator: C } of o)
      Zc(w.document, v) ? (b = !0, C.state !== "hover" && C.setState("hover")) : C.state === "hover" && C.setState("idle");
    b ? l === null && (l = document.body.style.cursor, document.body.style.cursor = "pointer") : l !== null && (document.body.style.cursor = l, l = null);
  }, "onPointerMove");
  s == null || s.addEventListener("pointermove", u);
  const d = /* @__PURE__ */ c((h) => {
    if (h.button !== 0) return;
    const p = canvas.activeLayer;
    if (!p) return;
    const v = p.toLocal(h);
    isNaN(v.x) || isNaN(v.y) || !a.filter(({ doc: w }) => Zc(w, v)).sort((w, C) => (C.doc.sort ?? 0) - (w.doc.sort ?? 0))[0] || (h.stopPropagation(), h.preventDefault(), g(), n());
  }, "onPointerDown");
  s == null || s.addEventListener("pointerdown", d, { capture: !0 });
  const m = /* @__PURE__ */ c(() => {
    g(), i(e.signal.reason ?? "aborted");
  }, "onAbort");
  e.signal.addEventListener("abort", m, { once: !0 });
  function g() {
    s == null || s.removeEventListener("pointerdown", d, { capture: !0 }), s == null || s.removeEventListener("pointermove", u), e.signal.removeEventListener("abort", m);
    for (const { animator: h } of o)
      h.detach();
    l !== null ? (document.body.style.cursor = l, l = null) : document.body.style.cursor = "";
  }
  c(g, "cleanup");
}) : Promise.reject(new Error('await tile-click: "target" is required')));
Py();
function xy() {
  Hooks.once("ready", () => {
    const t = game.modules.get(T);
    t.api || (t.api = {}), t.api.picker = {
      /** Open the picker window. Returns Promise<string[] | null>. */
      open: /* @__PURE__ */ c((e) => qa.open(e), "open"),
      /** Resolve a selector string to documents. */
      resolveSelector: _o,
      /** Parse a selector string into { type, value }. */
      parseSelector: Gl,
      /** Build a selector string from { type, value }. */
      buildSelector: Ep,
      /** Build a tag selector from tags array + mode. */
      buildTagSelector: Qd,
      /** Canvas highlight utilities. */
      highlight: {
        add: Ha,
        remove: $i,
        has: cf,
        clearAll: ha
      }
    }, console.log(`[${T}] Placeable Picker API registered.`);
  });
}
c(xy, "registerPlaceablePickerHooks");
xy();
const Ml = "eidolon-utilities", Ry = "idle-animation", _i = /* @__PURE__ */ new Map();
function Hy(t) {
  return typeof t.attribute == "string" && typeof t.from == "number" && typeof t.to == "number" && typeof t.period == "number" && t.period > 0;
}
c(Hy, "isValidTilePropConfig");
function qy(t) {
  return typeof t.fromColor == "string" && typeof t.toColor == "string" && typeof t.period == "number" && t.period > 0;
}
c(qy, "isValidTileTintConfig");
function jy(t) {
  return typeof t.fromScale == "number" && typeof t.toScale == "number" && t.fromScale > 0 && t.toScale > 0 && typeof t.period == "number" && t.period > 0;
}
c(jy, "isValidTileScaleConfig");
function eu(t) {
  if (!t || typeof t != "object") return !1;
  const e = t.type ?? "tile-prop";
  return e === "tile-tint" ? qy(t) : e === "tile-scale" ? jy(t) : Hy(t);
}
c(eu, "isValidConfig");
function Kl(t) {
  var i;
  const e = (i = t == null ? void 0 : t.getFlag) == null ? void 0 : i.call(t, Ml, Ry);
  if (!e) return [];
  let n;
  if (Array.isArray(e))
    n = e;
  else if (typeof e == "object" && "0" in e)
    n = Object.values(e);
  else return typeof e == "object" && eu(e) ? [e] : [];
  return n.filter(eu);
}
c(Kl, "getIdleAnimationConfigs");
function By(t, e) {
  const n = e.type ?? "tile-prop";
  return n === "tile-tint" ? `${t}::tint` : n === "tile-scale" ? `${t}::scale` : `${t}::${e.attribute}`;
}
c(By, "loopKey");
function tu(t, e, n, i) {
  return e.type === "tile-tint" ? { uuid: t, toColor: n ? e.toColor : e.fromColor, mode: e.mode } : e.type === "tile-scale" ? {
    uuid: t,
    toScale: n ? e.toScale : e.fromScale,
    ...i
  } : { uuid: t, attribute: e.attribute, value: n ? e.to : e.from };
}
c(tu, "buildExecuteParams");
function Uy(t, e) {
  var y, h;
  const n = t == null ? void 0 : t.document;
  if (!n) return;
  const i = n.id, r = By(i, e);
  Yl(r);
  const a = e.type ?? "tile-prop", o = Pi(a);
  if (!o) {
    console.warn(`[${Ml}] idle-animation: unknown tween type "${a}"`);
    return;
  }
  const s = new AbortController();
  let l, u = null;
  if (a === "tile-tint") {
    const p = ((h = (y = n._source) == null ? void 0 : y.texture) == null ? void 0 : h.tint) ?? "#ffffff";
    l = /* @__PURE__ */ c(() => {
      var b, w, C;
      const v = (w = (b = canvas.scene) == null ? void 0 : b.tiles) == null ? void 0 : w.get(i);
      v && (v.updateSource({ texture: { tint: p } }), (C = v.object) == null || C.refresh());
    }, "restore"), n.updateSource({ texture: { tint: e.fromColor } }), t.refresh();
  } else if (a === "tile-scale") {
    const p = n._source.width, v = n._source.height, b = n._source.x, w = n._source.y;
    u = {
      baseWidth: p,
      baseHeight: v,
      centerX: b + p / 2,
      centerY: w + v / 2
    }, l = /* @__PURE__ */ c(() => {
      var H, q, F;
      const $ = (q = (H = canvas.scene) == null ? void 0 : H.tiles) == null ? void 0 : q.get(i);
      $ && ($.updateSource({ width: p, height: v, x: b, y: w }), (F = $.object) == null || F.refresh());
    }, "restore");
    const C = p * e.fromScale, O = v * e.fromScale, A = u.centerX - C / 2, k = u.centerY - O / 2;
    n.updateSource({ width: C, height: O, x: A, y: k }), t.refresh();
  } else {
    const p = foundry.utils.getProperty(n._source, e.attribute);
    if (typeof p != "number") {
      console.warn(`[${Ml}] idle-animation: attribute "${e.attribute}" is not a number on tile ${i}`);
      return;
    }
    l = /* @__PURE__ */ c(() => {
      var b, w, C;
      const v = (w = (b = canvas.scene) == null ? void 0 : b.tiles) == null ? void 0 : w.get(i);
      v && (v.updateSource(foundry.utils.expandObject({ [e.attribute]: p })), (C = v.object) == null || C.refresh());
    }, "restore"), n.updateSource(foundry.utils.expandObject({ [e.attribute]: e.from })), t.refresh();
  }
  _i.set(r, { controller: s, restore: l });
  const d = n.uuid, m = e.period / 2, g = e.easing ?? "easeInOutCosine";
  (async () => {
    const { signal: p } = s;
    for (; !p.aborted && !(await o.execute(
      tu(d, e, !0, u),
      { durationMS: m, easing: g, commit: !1, signal: p }
    ) === !1 || p.aborted || await o.execute(
      tu(d, e, !1, u),
      { durationMS: m, easing: g, commit: !1, signal: p }
    ) === !1 || p.aborted); )
      ;
  })();
}
c(Uy, "startLoop");
function Yl(t) {
  const e = _i.get(t);
  e && (e.controller.abort(), _i.delete(t), e.restore());
}
c(Yl, "stopLoopByKey");
function fr(t) {
  const e = `${t}::`;
  for (const n of [..._i.keys()])
    n.startsWith(e) && Yl(n);
}
c(fr, "stopLoopsForTile");
function Ql(t, e) {
  if (t != null && t.document) {
    fr(t.document.id);
    for (const n of e)
      Uy(t, n);
  }
}
c(Ql, "startAllLoops");
function Vy() {
  for (const t of [..._i.keys()])
    Yl(t);
}
c(Vy, "stopAllLoops");
function nu(t) {
  const e = `${t}::`;
  for (const n of _i.keys())
    if (n.startsWith(e)) return !0;
  return !1;
}
c(nu, "isLooping");
const is = "eidolon-utilities", rs = "idle-animation", zy = "eidolon-idle-animation", Gy = "fa-solid fa-wave-pulse", Xl = [
  { value: "alpha", label: "Alpha (Opacity)", from: 0.85, to: 1, step: "0.01" },
  { value: "rotation", label: "Rotation", from: -5, to: 5, step: "1" },
  { value: "texture.rotation", label: "Texture Rotation", from: -5, to: 5, step: "1" }
], rr = {
  type: "tile-prop",
  attribute: "alpha",
  from: 0.85,
  to: 1,
  period: 1500,
  easing: "easeInOutCosine"
}, Pn = {
  fromColor: "#ffffff",
  toColor: "#ffcc88",
  mode: "oklch",
  period: 3e3
}, as = {
  fromScale: 0.95,
  toScale: 1.05
};
function iu(t, e) {
  const n = Xl.find((r) => r.value === t);
  if (n && n.from !== null) return { from: n.from, to: n.to, step: n.step };
  const i = foundry.utils.getProperty((e == null ? void 0 : e._source) ?? {}, t);
  return typeof i == "number" && i > 0 ? { from: Math.round(i * 0.95), to: Math.round(i * 1.05), step: "1" } : { from: 0, to: 100, step: "1" };
}
c(iu, "getAttributeDefaults");
function Wy(t) {
  var e;
  return (t == null ? void 0 : t.document) ?? ((e = t == null ? void 0 : t.object) == null ? void 0 : e.document) ?? (t == null ? void 0 : t.object) ?? null;
}
c(Wy, "getTileDocument");
function Xr(t, e, n) {
  const i = document.createElement("div");
  i.classList.add("form-group");
  const r = document.createElement("label");
  r.textContent = t;
  const a = document.createElement("select");
  a.classList.add(e);
  for (const o of n) {
    const s = document.createElement("option");
    s.value = o.value, s.textContent = o.label, o.selected && (s.selected = !0), a.appendChild(s);
  }
  return i.append(r, a), i;
}
c(Xr, "buildSelectGroup");
function Vi(t, e, n, i = {}) {
  const r = document.createElement("div");
  r.classList.add("form-group");
  const a = document.createElement("label");
  a.textContent = t;
  const o = document.createElement("input");
  o.type = "number", o.classList.add(e), o.value = String(n);
  for (const [s, l] of Object.entries(i)) o.setAttribute(s, l);
  return r.append(a, o), r;
}
c(Vi, "buildNumberGroup");
function ru(t, e, n) {
  const i = document.createElement("div");
  i.classList.add("form-group");
  const r = document.createElement("label");
  r.textContent = t;
  const a = document.createElement("div");
  a.classList.add("idle-anim__color-wrapper");
  const o = document.createElement("input");
  o.type = "color", o.classList.add(e), o.value = n;
  const s = document.createElement("input");
  return s.type = "text", s.classList.add(`${e}-text`), s.value = n, s.maxLength = 7, o.addEventListener("input", () => {
    s.value = o.value;
  }), s.addEventListener("change", () => {
    /^#[0-9a-f]{6}$/i.test(s.value) && (o.value = s.value);
  }), a.append(o, s), i.append(r, a), i;
}
c(ru, "buildColorGroup");
function au(t) {
  if (!t) return "";
  const e = t.type ?? "tile-prop";
  if (e === "tile-tint")
    return `Tint ${t.fromColor ?? "?"} → ${t.toColor ?? "?"} (${t.period ?? "?"}ms)`;
  if (e === "tile-scale") {
    const r = t.fromScale != null ? `${Math.round(t.fromScale * 100)}%` : "?", a = t.toScale != null ? `${Math.round(t.toScale * 100)}%` : "?";
    return `Scale ${r} → ${a} (${t.period ?? "?"}ms)`;
  }
  const n = Xl.find((r) => r.value === t.attribute);
  return `${(n == null ? void 0 : n.label) ?? t.attribute ?? "?"} ${t.from ?? "?"} → ${t.to ?? "?"} (${t.period ?? "?"}ms)`;
}
c(au, "summarizeConfig");
function ou(t, e, n) {
  const i = e.type ?? "tile-prop", r = Hd(), a = document.createElement("div");
  a.classList.add("idle-anim__slot", "is-collapsed"), a.dataset.index = String(n);
  const o = document.createElement("div");
  o.classList.add("idle-anim__slot-header");
  const s = document.createElement("i");
  s.classList.add("fa-solid", "fa-chevron-right", "idle-anim__slot-chevron");
  const l = document.createElement("span");
  l.classList.add("idle-anim__slot-title"), l.textContent = `Animation ${n + 1}`;
  const u = document.createElement("span");
  u.classList.add("idle-anim__slot-summary"), u.textContent = au(e);
  const d = document.createElement("button");
  d.type = "button", d.classList.add("idle-anim__slot-remove"), d.innerHTML = '<i class="fa-solid fa-xmark"></i>', d.title = "Remove animation", o.append(s, l, u, d), a.appendChild(o);
  const m = document.createElement("div");
  m.classList.add("idle-anim__slot-body");
  const g = Xr("Type", "idle-anim__type", [
    { value: "tile-prop", label: "Numeric", selected: i === "tile-prop" || i !== "tile-tint" && i !== "tile-scale" },
    { value: "tile-tint", label: "Tint", selected: i === "tile-tint" },
    { value: "tile-scale", label: "Scale", selected: i === "tile-scale" }
  ]);
  m.appendChild(g);
  const y = document.createElement("div");
  y.classList.add("idle-anim__type-fields"), m.appendChild(y);
  function h(w, C) {
    if (y.innerHTML = "", w === "tile-tint") {
      const O = lr(), A = C.fromColor ?? Pn.fromColor, k = C.toColor ?? Pn.toColor, $ = C.mode ?? Pn.mode, H = document.createElement("div");
      H.classList.add("idle-anim__range-row"), H.appendChild(ru("From", "idle-anim__from-color", A)), H.appendChild(ru("To", "idle-anim__to-color", k)), y.appendChild(H), y.appendChild(Xr(
        "Mode",
        "idle-anim__mode",
        O.map((q) => ({ value: q, label: q, selected: q === $ }))
      ));
    } else if (w === "tile-scale") {
      const O = C.fromScale ?? as.fromScale, A = C.toScale ?? as.toScale, k = document.createElement("div");
      k.classList.add("idle-anim__range-row"), k.appendChild(Vi("From", "idle-anim__from-scale", O, { step: "0.01", min: "0.01" })), k.appendChild(Vi("To", "idle-anim__to-scale", A, { step: "0.01", min: "0.01" })), y.appendChild(k);
      const $ = document.createElement("p");
      $.classList.add("idle-anim__hint"), $.textContent = "1.0 = original size. Scales from center.", y.appendChild($);
    } else {
      const O = C.attribute ?? rr.attribute, A = iu(O, t), k = C.from ?? A.from, $ = C.to ?? A.to, H = A.step;
      y.appendChild(Xr(
        "Attribute",
        "idle-anim__attribute",
        Xl.map((D) => ({ value: D.value, label: D.label, selected: D.value === O }))
      ));
      const q = document.createElement("div");
      q.classList.add("idle-anim__range-row"), q.appendChild(Vi("From", "idle-anim__from", k, { step: H })), q.appendChild(Vi("To", "idle-anim__to", $, { step: H })), y.appendChild(q);
      const F = y.querySelector(".idle-anim__attribute");
      F == null || F.addEventListener("change", () => {
        const D = iu(F.value, t), N = y.querySelector(".idle-anim__from"), x = y.querySelector(".idle-anim__to");
        N && (N.value = String(D.from), N.step = D.step), x && (x.value = String(D.to), x.step = D.step);
      });
    }
  }
  c(h, "renderTypeFields"), h(i, e);
  const p = e.period ?? (i === "tile-tint" ? Pn.period : rr.period), v = e.easing ?? "easeInOutCosine";
  m.appendChild(Vi("Period (ms)", "idle-anim__period", p, { min: "100", step: "100" })), m.appendChild(Xr(
    "Easing",
    "idle-anim__easing",
    r.map((w) => ({ value: w, label: w, selected: w === v }))
  )), a.appendChild(m);
  const b = a.querySelector(".idle-anim__type");
  return b == null || b.addEventListener("change", () => {
    const w = b.value;
    h(w, w === "tile-tint" ? Pn : w === "tile-scale" ? as : rr);
  }), o.addEventListener("click", (w) => {
    if (!w.target.closest(".idle-anim__slot-remove") && (a.classList.toggle("is-collapsed"), a.classList.contains("is-collapsed"))) {
      const C = kf(a);
      C && (u.textContent = au(C));
    }
  }), d.addEventListener("click", (w) => {
    w.stopPropagation();
    const C = a.parentElement;
    a.remove(), C && Jy(C);
  }), a;
}
c(ou, "buildSlot");
function Jy(t) {
  t.querySelectorAll(".idle-anim__slot").forEach((n, i) => {
    n.dataset.index = String(i);
    const r = n.querySelector(".idle-anim__slot-title");
    r && (r.textContent = `Animation ${i + 1}`);
  });
}
c(Jy, "renumberSlots");
function Ky(t) {
  const e = Kl(t), n = document.createElement("section");
  n.classList.add("eidolon-idle-animation");
  const i = document.createElement("div");
  i.classList.add("idle-anim__slots");
  for (let l = 0; l < e.length; l++)
    i.appendChild(ou(t, e[l], l));
  n.appendChild(i);
  const r = document.createElement("button");
  r.type = "button", r.classList.add("idle-anim__add"), r.innerHTML = '<i class="fa-solid fa-plus"></i> Add Animation', r.addEventListener("click", () => {
    const l = i.querySelectorAll(".idle-anim__slot").length, u = ou(t, rr, l);
    u.classList.remove("is-collapsed"), i.appendChild(u);
  }), n.appendChild(r);
  const a = document.createElement("div");
  a.classList.add("idle-anim__actions");
  const o = document.createElement("button");
  o.type = "button", o.classList.add("idle-anim__preview"), o.innerHTML = '<i class="fa-solid fa-play"></i> Preview All';
  const s = document.createElement("button");
  return s.type = "button", s.classList.add("idle-anim__save"), s.innerHTML = '<i class="fa-solid fa-save"></i> Save', a.append(o, s), n.appendChild(a), n;
}
c(Ky, "buildTabContent");
function kf(t) {
  var l, u, d, m, g, y, h, p, v, b, w, C;
  const e = t.querySelector(".idle-anim__type"), n = (e == null ? void 0 : e.value) ?? "tile-prop", i = Number.parseInt((l = t.querySelector(".idle-anim__period")) == null ? void 0 : l.value, 10), r = ((u = t.querySelector(".idle-anim__easing")) == null ? void 0 : u.value) ?? "easeInOutCosine";
  if (!i || i <= 0) return null;
  if (n === "tile-tint") {
    const O = ((d = t.querySelector(".idle-anim__from-color")) == null ? void 0 : d.value) ?? ((m = t.querySelector(".idle-anim__from-color-text")) == null ? void 0 : m.value) ?? Pn.fromColor, A = ((g = t.querySelector(".idle-anim__to-color")) == null ? void 0 : g.value) ?? ((y = t.querySelector(".idle-anim__to-color-text")) == null ? void 0 : y.value) ?? Pn.toColor, k = ((h = t.querySelector(".idle-anim__mode")) == null ? void 0 : h.value) ?? "oklch";
    return { type: "tile-tint", fromColor: O, toColor: A, mode: k, period: i, easing: r };
  }
  if (n === "tile-scale") {
    const O = Number.parseFloat((p = t.querySelector(".idle-anim__from-scale")) == null ? void 0 : p.value), A = Number.parseFloat((v = t.querySelector(".idle-anim__to-scale")) == null ? void 0 : v.value);
    return Number.isNaN(O) || Number.isNaN(A) || O <= 0 || A <= 0 ? null : { type: "tile-scale", fromScale: O, toScale: A, period: i, easing: r };
  }
  const a = ((b = t.querySelector(".idle-anim__attribute")) == null ? void 0 : b.value) ?? rr.attribute, o = Number.parseFloat((w = t.querySelector(".idle-anim__from")) == null ? void 0 : w.value), s = Number.parseFloat((C = t.querySelector(".idle-anim__to")) == null ? void 0 : C.value);
  return Number.isNaN(o) || Number.isNaN(s) ? null : { type: "tile-prop", attribute: a, from: o, to: s, period: i, easing: r };
}
c(kf, "readSlotConfig");
function su(t) {
  const e = t.querySelectorAll(".idle-anim__slot"), n = [];
  for (const i of e) {
    const r = kf(i);
    r && n.push(r);
  }
  return n;
}
c(su, "readAllFormValues");
function Yy(t, e) {
  var s;
  const n = Dt(e);
  if (!n) return;
  const i = Wy(t);
  if (!i) return;
  const r = Ad(t, n, zy, "Animations", Gy);
  if (!r || r.querySelector(".eidolon-idle-animation")) return;
  r.replaceChildren(Ky(i)), (s = t.setPosition) == null || s.call(t, { height: "auto" });
  const a = r.querySelector(".idle-anim__preview");
  a == null || a.addEventListener("click", () => {
    const l = i.object;
    if (!l) return;
    if (nu(i.id)) {
      fr(i.id), a.classList.remove("is-active"), a.innerHTML = '<i class="fa-solid fa-play"></i> Preview All';
      return;
    }
    const u = su(r);
    u.length !== 0 && (Ql(l, u), a.classList.add("is-active"), a.innerHTML = '<i class="fa-solid fa-stop"></i> Stop');
  });
  const o = r.querySelector(".idle-anim__save");
  o == null || o.addEventListener("click", async () => {
    var u;
    nu(i.id) && (fr(i.id), a && (a.classList.remove("is-active"), a.innerHTML = '<i class="fa-solid fa-play"></i> Preview All'));
    const l = su(r);
    l.length > 0 ? (await i.update({ [`flags.${is}.-=${rs}`]: null }), await i.update({ [`flags.${is}.${rs}`]: l })) : await i.update({ [`flags.${is}.-=${rs}`]: null }), (u = ui.notifications) == null || u.info("Idle animations saved.");
  });
}
c(Yy, "renderAnimationTab");
const Qy = "eidolon-utilities", lu = "idle-animation";
function Xy() {
  var e;
  Vy();
  const t = (e = canvas.tiles) == null ? void 0 : e.placeables;
  if (Array.isArray(t))
    for (const n of t) {
      const i = Kl(n.document);
      i.length > 0 && Ql(n, i);
    }
}
c(Xy, "onCanvasReady");
function Zy(t, e) {
  var r;
  const n = (r = e == null ? void 0 : e.flags) == null ? void 0 : r[Qy];
  if (!n || !(lu in n || `-=${lu}` in n)) return;
  const i = Kl(t);
  i.length > 0 && t.object ? Ql(t.object, i) : fr(t.id);
}
c(Zy, "onUpdateTile");
function eb(t) {
  fr(t.id);
}
c(eb, "onDeleteTile");
function tb(t, e) {
  Yy(t, e);
}
c(tb, "onRenderTileConfig");
function nb() {
  Hooks.on("canvasReady", Xy), Hooks.on("updateTile", Zy), Hooks.on("deleteTile", eb), Hooks.on("renderTileConfig", tb);
}
c(nb, "registerIdleAnimationHooks");
nb();
//# sourceMappingURL=eidolon-utilities.js.map
