var Sl = Object.defineProperty;
var Rd = Object.getPrototypeOf;
var Hd = Reflect.get;
var Ll = (t) => {
  throw TypeError(t);
};
var qd = (t, n, e) => n in t ? Sl(t, n, { enumerable: !0, configurable: !0, writable: !0, value: e }) : t[n] = e;
var l = (t, n) => Sl(t, "name", { value: n, configurable: !0 });
var Ce = (t, n, e) => qd(t, typeof n != "symbol" ? n + "" : n, e), fo = (t, n, e) => n.has(t) || Ll("Cannot " + e);
var f = (t, n, e) => (fo(t, n, "read from private field"), e ? e.call(t) : n.get(t)), N = (t, n, e) => n.has(t) ? Ll("Cannot add the same private member more than once") : n instanceof WeakSet ? n.add(t) : n.set(t, e), L = (t, n, e, i) => (fo(t, n, "write to private field"), i ? i.call(t, e) : n.set(t, e), e), h = (t, n, e) => (fo(t, n, "access private method"), e);
var go = (t, n, e, i) => ({
  set _(r) {
    L(t, n, r, e);
  },
  get _() {
    return f(t, n, i);
  }
}), Re = (t, n, e) => Hd(Rd(t), e, n);
const T = "eidolon-utilities", Jr = "timeTriggerActive", No = "timeTriggerHideWindow", ko = "timeTriggerShowPlayerWindow", xo = "timeTriggerAllowRealTime", bc = "timeTriggers", Mr = "timeTriggerHistory", Do = "debug", $o = "timeFormat", Fo = "manageTime", _o = "secondsPerRound";
const Bd = [-30, -15, -5, 5, 15, 30], ii = 1440 * 60, Nr = "playSound", lr = 6;
function w(t, n) {
  var e, i;
  return (i = (e = game.i18n) == null ? void 0 : e.has) != null && i.call(e, t) ? game.i18n.localize(t) : n;
}
l(w, "localize");
function At(t) {
  return typeof t != "string" ? "" : t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
l(At, "escapeHtml");
function Nt(t) {
  var n;
  return t == null ? t : (n = foundry == null ? void 0 : foundry.utils) != null && n.duplicate ? foundry.utils.duplicate(t) : JSON.parse(JSON.stringify(t));
}
l(Nt, "duplicateData");
function jd() {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
l(jd, "generateTriggerId");
function wc(t) {
  if (typeof t != "string") return null;
  const n = t.trim();
  if (!n) return null;
  const e = n.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (!e) return null;
  const i = Number(e[1]), r = Number(e[2]), a = e[3] !== void 0 ? Number(e[3]) : 0;
  return !Number.isInteger(i) || !Number.isInteger(r) || !Number.isInteger(a) || i < 0 || i > 23 || r < 0 || r > 59 || a < 0 || a > 59 ? null : i * 3600 + r * 60 + a;
}
l(wc, "parseTriggerTimeToSeconds");
function Ni() {
  var t, n;
  return ((t = game.scenes) == null ? void 0 : t.current) ?? ((n = game.scenes) == null ? void 0 : n.active) ?? null;
}
l(Ni, "getActiveScene");
function kt(t) {
  return (t == null ? void 0 : t.object) ?? (t == null ? void 0 : t.document) ?? null;
}
l(kt, "getSceneFromApplication");
function Ge(t) {
  return t && typeof t.getFlag == "function" && typeof t.setFlag == "function";
}
l(Ge, "hasSceneDocument");
const Po = /* @__PURE__ */ new Set(), Ro = /* @__PURE__ */ new Set(), Ho = /* @__PURE__ */ new Set(), qo = /* @__PURE__ */ new Set();
let Vn = !1, Ri = !1, Kr = lr, Yr = "12h", Il = !1;
function ho(t) {
  Vn = !!t;
  for (const n of Po)
    try {
      n(Vn);
    } catch (e) {
      console.error(`${T} | Debug change handler failed`, e);
    }
}
l(ho, "notifyDebugChange");
function mo(t) {
  Ri = !!t;
  for (const n of Ro)
    try {
      n(Ri);
    } catch (e) {
      console.error(`${T} | Manage time change handler failed`, e);
    }
}
l(mo, "notifyManageTimeChange");
function vc(t) {
  return t === "24h" ? "24h" : "12h";
}
l(vc, "normalizeTimeFormatValue");
function Ys(t) {
  const n = Number(t);
  return !Number.isFinite(n) || n <= 0 ? lr : n;
}
l(Ys, "normalizeSecondsPerRoundValue");
function po(t) {
  const n = Ys(t);
  Kr = n;
  for (const e of Ho)
    try {
      e(n);
    } catch (i) {
      console.error(`${T} | Seconds-per-round change handler failed`, i);
    }
}
l(po, "notifySecondsPerRoundChange");
function yo(t) {
  const n = vc(t);
  Yr = n;
  for (const e of qo)
    try {
      e(n);
    } catch (i) {
      console.error(`${T} | Time format change handler failed`, i);
    }
}
l(yo, "notifyTimeFormatChange");
function Ud() {
  var n;
  if (Il) return;
  if (Il = !0, !((n = game == null ? void 0 : game.settings) != null && n.register)) {
    console.warn(
      `${T} | game.settings.register is unavailable. Module settings could not be registered.`
    );
    return;
  }
  const t = typeof game.settings.registerChange == "function";
  game.settings.register(T, Do, {
    name: w("EIDOLON.TimeTrigger.DebugSettingName", "Enable debug logging"),
    hint: w(
      "EIDOLON.TimeTrigger.DebugSettingHint",
      "Write detailed time-trigger diagnostics to the browser console."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: t ? void 0 : ho
  }), t && game.settings.registerChange(T, Do, ho), Vn = Qs(), ho(Vn), game.settings.register(T, Fo, {
    name: w("EIDOLON.TimeTrigger.ManageTimeSettingName", "Manage Game Time"),
    hint: w(
      "EIDOLON.TimeTrigger.ManageTimeSettingHint",
      "Allow Eidolon Utilities to advance world time automatically while the game is unpaused. Warning: This may conflict with other time-management modules."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: t ? void 0 : mo
  }), t && game.settings.registerChange(T, Fo, mo), Ri = zd(), mo(Ri), game.settings.register(T, _o, {
    name: w(
      "EIDOLON.TimeTrigger.SecondsPerRoundSettingName",
      "Seconds Per Combat Round"
    ),
    hint: w(
      "EIDOLON.TimeTrigger.SecondsPerRoundSettingHint",
      "Amount of world seconds to add whenever a combat round ends while time management is active."
    ),
    scope: "world",
    config: !0,
    type: Number,
    default: lr,
    range: { min: 1, max: 3600, step: 1 },
    onChange: t ? void 0 : po
  }), t && game.settings.registerChange(
    T,
    _o,
    po
  ), Kr = Ys(Gd()), po(Kr), game.settings.register(T, $o, {
    name: w("EIDOLON.TimeTrigger.TimeFormatSettingName", "Trigger Time Format"),
    hint: w(
      "EIDOLON.TimeTrigger.TimeFormatSettingHint",
      "Control whether trigger times use a 12-hour or 24-hour clock."
    ),
    scope: "world",
    config: !0,
    type: String,
    choices: {
      "12h": w(
        "EIDOLON.TimeTrigger.TimeFormatSettingChoice12Hour",
        "12-hour (e.g. 2:30 PM)"
      ),
      "24h": w(
        "EIDOLON.TimeTrigger.TimeFormatSettingChoice24Hour",
        "24-hour (e.g. 14:30)"
      )
    },
    default: "12h",
    onChange: t ? void 0 : yo
  }), t && game.settings.registerChange(T, $o, yo), Yr = vc(Ec()), yo(Yr);
}
l(Ud, "registerTimeTriggerSettings");
function Qs() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return !!game.settings.get(T, Do);
  } catch (n) {
    console.error(`${T} | Failed to read debug setting`, n);
  }
  return !1;
}
l(Qs, "getDebugSetting");
function Vd() {
  return Vn = Qs(), Vn;
}
l(Vd, "refreshDebugSettingCache");
function zd() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return !!game.settings.get(T, Fo);
  } catch (n) {
    console.error(`${T} | Failed to read manage time setting`, n);
  }
  return !1;
}
l(zd, "getManageTimeSetting");
function Ec() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return game.settings.get(T, $o) === "24h" ? "24h" : "12h";
  } catch (n) {
    console.error(`${T} | Failed to read time format setting`, n);
  }
  return "12h";
}
l(Ec, "getTimeFormatSetting");
function Gd() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get) {
      const n = game.settings.get(T, _o);
      return Ys(n);
    }
  } catch (n) {
    console.error(`${T} | Failed to read seconds-per-round setting`, n);
  }
  return lr;
}
l(Gd, "getSecondsPerRoundSetting");
function Wd(t) {
  if (typeof t != "function")
    return () => {
    };
  Po.add(t);
  try {
    t(Vn);
  } catch (n) {
    console.error(`${T} | Debug change handler failed`, n);
  }
  return () => {
    Po.delete(t);
  };
}
l(Wd, "onDebugSettingChange");
function Tc(t) {
  if (typeof t != "function")
    return () => {
    };
  Ro.add(t);
  try {
    t(Ri);
  } catch (n) {
    console.error(`${T} | Manage time change handler failed`, n);
  }
  return () => {
    Ro.delete(t);
  };
}
l(Tc, "onManageTimeSettingChange");
function Xs(t) {
  if (typeof t != "function")
    return () => {
    };
  qo.add(t);
  try {
    t(Yr);
  } catch (n) {
    console.error(`${T} | Time format change handler failed`, n);
  }
  return () => {
    qo.delete(t);
  };
}
l(Xs, "onTimeFormatSettingChange");
function Jd(t) {
  if (typeof t != "function")
    return () => {
    };
  Ho.add(t);
  try {
    t(Kr);
  } catch (n) {
    console.error(`${T} | Seconds-per-round change handler failed`, n);
  }
  return () => {
    Ho.delete(t);
  };
}
l(Jd, "onSecondsPerRoundSettingChange");
let Ka = !1, Bo = !1;
function jo(t) {
  Ka = !!t;
}
l(jo, "updateDebugState");
function Cc() {
  Bo || (Bo = !0, jo(Qs()), Wd((t) => {
    jo(t), console.info(`${T} | Debug ${Ka ? "enabled" : "disabled"}`);
  }));
}
l(Cc, "ensureInitialized");
function Zs() {
  return Bo || Cc(), Ka;
}
l(Zs, "shouldLog");
function Sc(t) {
  if (!t.length)
    return [`${T} |`];
  const [n, ...e] = t;
  return typeof n == "string" ? [`${T} | ${n}`, ...e] : [`${T} |`, n, ...e];
}
l(Sc, "formatArgs");
function Kd() {
  Cc();
}
l(Kd, "initializeDebug");
function Yd() {
  return jo(Vd()), Ka;
}
l(Yd, "syncDebugState");
function k(...t) {
  Zs() && console.debug(...Sc(t));
}
l(k, "debugLog");
function mi(...t) {
  Zs() && console.group(...Sc(t));
}
l(mi, "debugGroup");
function cn() {
  Zs() && console.groupEnd();
}
l(cn, "debugGroupEnd");
function ri(t) {
  var r;
  const n = (r = t == null ? void 0 : t.getFlag) == null ? void 0 : r.call(t, T, bc);
  if (!n) return [];
  const e = Nt(n), i = Array.isArray(e) ? e : [];
  return k("Loaded time triggers", {
    sceneId: (t == null ? void 0 : t.id) ?? null,
    count: i.length
  }), i;
}
l(ri, "getTimeTriggers");
async function Lc(t, n) {
  t != null && t.setFlag && (k("Persisting time triggers", {
    sceneId: t.id,
    count: Array.isArray(n) ? n.length : 0
  }), await t.setFlag(T, bc, n));
}
l(Lc, "setTimeTriggers");
function Qd(t) {
  var r;
  const n = (r = t == null ? void 0 : t.getFlag) == null ? void 0 : r.call(t, T, Mr);
  if (!n) return {};
  const e = Nt(n);
  if (!e || typeof e != "object") return {};
  const i = {};
  for (const [a, o] of Object.entries(e))
    typeof o == "number" && Number.isFinite(o) && (i[a] = o);
  return k("Loaded time trigger history", {
    sceneId: (t == null ? void 0 : t.id) ?? null,
    keys: Object.keys(i)
  }), i;
}
l(Qd, "getTimeTriggerHistory");
async function bo(t, n) {
  var c, u, d, g;
  if (!t) return;
  const e = {};
  if (n && typeof n == "object")
    for (const [p, b] of Object.entries(n))
      typeof b == "number" && Number.isFinite(b) && (e[p] = b);
  const i = ((c = t.getFlag) == null ? void 0 : c.call(t, T, Mr)) ?? {}, r = {};
  if (i && typeof i == "object")
    for (const [p, b] of Object.entries(i))
      typeof b == "number" && Number.isFinite(b) && (r[p] = b);
  const a = Object.keys(e), o = Object.keys(r);
  if (typeof ((u = foundry == null ? void 0 : foundry.utils) == null ? void 0 : u.deepEqual) == "function" ? foundry.utils.deepEqual(r, e) : JSON.stringify(r) === JSON.stringify(e)) {
    k("Skip history update because state is unchanged", {
      sceneId: (t == null ? void 0 : t.id) ?? null
    });
    return;
  }
  k("Updating time trigger history", {
    sceneId: (t == null ? void 0 : t.id) ?? null,
    keys: a,
    removedKeys: o.filter((p) => !a.includes(p))
  });
  try {
    o.length && typeof t.unsetFlag == "function" && await t.unsetFlag(T, Mr), a.length && await t.setFlag(T, Mr, e);
  } catch (p) {
    console.error(`${T} | Failed to persist time trigger history`, p), (g = (d = ui.notifications) == null ? void 0 : d.error) == null || g.call(
      d,
      w(
        "EIDOLON.TimeTrigger.HistoryPersistError",
        "Failed to persist the scene's time trigger history."
      )
    );
  }
}
l(bo, "updateTimeTriggerHistory");
const Qr = /* @__PURE__ */ new Map(), Ol = /* @__PURE__ */ new Set();
function Xd(t) {
  if (!(t != null && t.id))
    throw new Error(`${T} | Action definitions require an id.`);
  if (Qr.has(t.id))
    throw new Error(`${T} | Duplicate time trigger action id: ${t.id}`);
  Qr.set(t.id, {
    ...t
  }), k("Registered time trigger action", { actionId: t.id });
}
l(Xd, "registerAction");
function cr(t) {
  return Qr.get(t) ?? null;
}
l(cr, "getAction");
function Zd(t) {
  const n = cr(t);
  return n ? typeof n.label == "function" ? n.label() : n.label : t;
}
l(Zd, "getActionLabel");
function Al() {
  return Array.from(Qr.values());
}
l(Al, "listActions");
async function Ic(t, n) {
  var i, r;
  const e = cr(n == null ? void 0 : n.action);
  if (!e || typeof e.execute != "function") {
    const a = w(
      "EIDOLON.TimeTrigger.UnknownAction",
      "Encountered an unknown time trigger action and skipped it."
    );
    (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, a), console.warn(`${T} | Unknown time trigger action`, n), k("Encountered unknown time trigger action", {
      triggerId: (n == null ? void 0 : n.id) ?? null,
      actionId: (n == null ? void 0 : n.action) ?? null
    });
    return;
  }
  k("Executing action handler", {
    actionId: e.id,
    triggerId: (n == null ? void 0 : n.id) ?? null,
    sceneId: (t == null ? void 0 : t.id) ?? null
  }), await e.execute({ scene: t, trigger: n });
}
l(Ic, "executeTriggerAction");
function ef(t) {
  const n = cr(t == null ? void 0 : t.action);
  return !n || typeof n.buildSummaryParts != "function" ? [] : n.buildSummaryParts({ trigger: t, escapeHtml: At, localize: w }) ?? [];
}
l(ef, "buildActionSummaryParts");
function tf(t) {
  const n = cr(t == null ? void 0 : t.action);
  return !n || typeof n.buildFormContent != "function" ? "" : n.buildFormContent({ trigger: t, escapeHtml: At, localize: w }) ?? "";
}
l(tf, "buildActionFormSection");
function nf(t, n) {
  const e = cr(t == null ? void 0 : t.action);
  !e || typeof e.prepareFormData != "function" || e.prepareFormData({ trigger: t, formData: n });
}
l(nf, "applyActionFormData");
function rf(t, n, e) {
  var a, o;
  const i = `${(t == null ? void 0 : t.id) ?? "unknown"}:${(n == null ? void 0 : n.id) ?? (n == null ? void 0 : n.action) ?? "unknown"}:${e}`;
  if (Ol.has(i)) return;
  Ol.add(i);
  const r = w(
    "EIDOLON.TimeTrigger.MissingDataWarning",
    "A scene time trigger is missing required data and was skipped."
  );
  (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, r), console.warn(`${T} | Missing trigger data (${e})`, { scene: t == null ? void 0 : t.id, trigger: n });
}
l(rf, "warnMissingTriggerData");
async function af({ scene: t, trigger: n }) {
  var a, o, s, c, u;
  const e = (s = (o = (a = n == null ? void 0 : n.data) == null ? void 0 : a.path) == null ? void 0 : o.trim) == null ? void 0 : s.call(o);
  if (!e) {
    rf(t, n, "missing-audio-path");
    return;
  }
  const i = {
    src: e,
    autoplay: !0,
    loop: !1
  }, r = (() => {
    var d, g, p, b, y;
    return typeof ((g = (d = foundry == null ? void 0 : foundry.audio) == null ? void 0 : d.AudioHelper) == null ? void 0 : g.play) == "function" ? foundry.audio.AudioHelper.play(i, !0) : typeof ((b = (p = game == null ? void 0 : game.audio) == null ? void 0 : p.constructor) == null ? void 0 : b.play) == "function" ? game.audio.constructor.play(i, !0) : typeof ((y = game == null ? void 0 : game.audio) == null ? void 0 : y.play) == "function" ? game.audio.play(i, !0) : null;
  })();
  if (!r) {
    console.error(`${T} | Foundry audio helper is unavailable`), (u = (c = ui.notifications) == null ? void 0 : c.error) == null || u.call(
      c,
      w(
        "EIDOLON.TimeTrigger.AudioHelperUnavailable",
        "Unable to play audio for a time trigger because the Foundry audio helper is unavailable."
      )
    );
    return;
  }
  await r;
}
l(af, "executePlaySoundAction");
Xd({
  id: Nr,
  label: /* @__PURE__ */ l(() => w("EIDOLON.TimeTrigger.ActionPlaySound", "Play Sound"), "label"),
  execute: af,
  buildSummaryParts: /* @__PURE__ */ l(({ trigger: t, escapeHtml: n, localize: e }) => {
    var r;
    return (r = t == null ? void 0 : t.data) != null && r.path ? [`${n(e("EIDOLON.TimeTrigger.TriggerSound", "Sound File"))}: ${n(t.data.path)}`] : [];
  }, "buildSummaryParts"),
  buildFormContent: /* @__PURE__ */ l(({ trigger: t, escapeHtml: n, localize: e }) => {
    var s;
    const i = n(e("EIDOLON.TimeTrigger.TriggerSound", "Sound File")), r = n(
      e("EIDOLON.TimeTrigger.TriggerChooseFile", "Select File")
    ), a = n(
      e(
        "EIDOLON.TimeTrigger.TriggerSoundNotes",
        "Select or upload the audio file that should play when this trigger fires."
      )
    ), o = n(((s = t == null ? void 0 : t.data) == null ? void 0 : s.path) ?? "");
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
  prepareFormData: /* @__PURE__ */ l(({ trigger: t, formData: n }) => {
    var e, i;
    t.data.path = ((i = (e = n.playSoundPath) == null ? void 0 : e.trim) == null ? void 0 : i.call(e)) ?? "";
  }, "prepareFormData")
});
var dc;
const { ApplicationV2: yn, HandlebarsApplicationMixin: bn } = ((dc = foundry.applications) == null ? void 0 : dc.api) ?? {};
if (!yn || !bn)
  throw new Error(
    `${T} | ApplicationV2 API unavailable. Update Foundry VTT to v13 or newer.`
  );
const dn = "AM", zn = "PM";
function un() {
  return Ec();
}
l(un, "getConfiguredTimeFormat");
function Ya(t) {
  if (typeof t != "string") return null;
  const n = t.trim();
  if (!n) return null;
  const e = n.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (!e) return null;
  const i = Number(e[1]), r = Number(e[2]), a = e[3] !== void 0 ? Number(e[3]) : null;
  return !Number.isInteger(i) || !Number.isInteger(r) || i < 0 || i > 23 || r < 0 || r > 59 || a !== null && (!Number.isInteger(a) || a < 0 || a > 59) ? null : {
    hours: i,
    minutes: r,
    seconds: a
  };
}
l(Ya, "parseCanonicalTimeString");
function Mt({ hours: t, minutes: n, seconds: e }) {
  if (!Number.isInteger(t) || !Number.isInteger(n) || t < 0 || t > 23 || n < 0 || n > 59) return null;
  const i = String(t).padStart(2, "0"), r = String(n).padStart(2, "0");
  if (Number.isInteger(e)) {
    if (e < 0 || e > 59) return null;
    const a = String(e).padStart(2, "0");
    return `${i}:${r}:${a}`;
  }
  return `${i}:${r}`;
}
l(Mt, "formatCanonicalTime");
function of(t, { format: n } = {}) {
  if (!t || typeof t != "object") return null;
  const e = Number(t.hour), i = Number(t.minute), r = t.second !== void 0 && t.second !== null, a = r ? Number(t.second) : null, o = r && Number.isFinite(a) ? Math.floor(Math.max(0, Math.min(59, a))) : null;
  if (!Number.isFinite(e) || !Number.isFinite(i)) return null;
  const s = n ?? un();
  return Xr(
    {
      hours: e,
      minutes: i,
      seconds: o
    },
    s
  );
}
l(of, "formatTimeComponentsForDisplay");
function sf(t, { format: n } = {}) {
  const e = Ya(t);
  if (!e) return "";
  const i = n ?? un();
  return Xr(e, i);
}
l(sf, "formatTriggerTimeForDisplay");
function Xr(t, n = "12h") {
  if (!t) return "";
  const { hours: e, minutes: i, seconds: r = null } = t;
  if (!Number.isInteger(e) || !Number.isInteger(i)) return "";
  const a = Number.isInteger(r);
  if (n === "24h") {
    const p = `${String(e).padStart(2, "0")}:${String(i).padStart(2, "0")}`;
    return a ? `${p}:${String(r).padStart(2, "0")}` : p;
  }
  const o = e >= 12 ? zn : dn, s = e % 12 === 0 ? 12 : e % 12, c = String(s), u = String(i).padStart(2, "0"), d = `${c}:${u}`, g = o === dn ? w("EIDOLON.TimeTrigger.TimePeriodAM", dn) : w("EIDOLON.TimeTrigger.TimePeriodPM", zn);
  if (a) {
    const p = String(r).padStart(2, "0");
    return `${d}:${p} ${g}`;
  }
  return `${d} ${g}`;
}
l(Xr, "formatTimeParts");
function Ml(t, n = un()) {
  const e = Ya(t);
  if (n === "24h")
    return {
      format: n,
      canonical: e ? Mt(e) ?? "" : "",
      hour: e ? String(e.hours).padStart(2, "0") : "",
      minute: e ? String(e.minutes).padStart(2, "0") : ""
    };
  if (!e)
    return {
      format: n,
      canonical: "",
      hour: "",
      minute: "",
      period: dn
    };
  const i = e.hours >= 12 ? zn : dn, r = e.hours % 12 === 0 ? 12 : e.hours % 12;
  return {
    format: n,
    canonical: Mt(e) ?? "",
    hour: String(r),
    minute: String(e.minutes).padStart(2, "0"),
    period: i
  };
}
l(Ml, "getTimeFormValues");
function lf({ hour: t, minute: n, period: e, time: i }, r = un()) {
  if (r === "24h") {
    const b = typeof t == "string" ? t.trim() : "", y = typeof n == "string" ? n.trim() : "", m = typeof i == "string" ? i.trim() : "";
    if (!b && !y && m) {
      const M = Ya(m);
      return M ? { canonical: Mt(M) ?? "", error: null } : {
        canonical: "",
        error: w(
          "EIDOLON.TimeTrigger.TimeFormatInvalid24",
          "Enter a valid time in HH:MM format."
        )
      };
    }
    if (!b || !y)
      return {
        canonical: "",
        error: w("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.")
      };
    const v = Number(b), E = Number(y);
    return !Number.isInteger(v) || v < 0 || v > 23 ? {
      canonical: "",
      error: w(
        "EIDOLON.TimeTrigger.TimeFormatInvalid24",
        "Enter a valid time in HH:MM format."
      )
    } : !Number.isInteger(E) || E < 0 || E > 59 ? {
      canonical: "",
      error: w(
        "EIDOLON.TimeTrigger.TimeFormatInvalid24",
        "Enter a valid time in HH:MM format."
      )
    } : { canonical: Mt({
      hours: v,
      minutes: E
    }) ?? "", error: null };
  }
  const a = typeof t == "string" ? t.trim() : "", o = typeof n == "string" ? n.trim() : "", s = typeof e == "string" ? e.trim().toUpperCase() : "";
  if (!a || !o || !s)
    return { canonical: "", error: w("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.") };
  if (s !== dn && s !== zn)
    return { canonical: "", error: w("EIDOLON.TimeTrigger.TimeFormatInvalidPeriod", "Select AM or PM.") };
  const c = Number(a), u = Number(o);
  if (!Number.isInteger(c) || c < 1 || c > 12)
    return {
      canonical: "",
      error: w("EIDOLON.TimeTrigger.TimeFormatInvalidHour", "Hours must be between 1 and 12.")
    };
  if (!Number.isInteger(u) || u < 0 || u > 59)
    return {
      canonical: "",
      error: w("EIDOLON.TimeTrigger.TimeFormatInvalidMinute", "Minutes must be between 00 and 59.")
    };
  const d = c % 12, p = {
    hours: s === zn ? d + 12 : d,
    minutes: u
  };
  return {
    canonical: Mt(p) ?? "",
    error: null
  };
}
l(lf, "normalizeFormTimeInput");
function cf() {
  return [
    {
      value: dn,
      label: w("EIDOLON.TimeTrigger.TimePeriodAM", dn)
    },
    {
      value: zn,
      label: w("EIDOLON.TimeTrigger.TimePeriodPM", zn)
    }
  ];
}
l(cf, "getPeriodOptions");
var An, Mn, oe, Oc, wa, va, Ac, Vo, zo, Ea, Ta, Mc, Nc, kc, Go, Wo, Jo, Ca, Sa, Ko, La, xc, Dc;
const Ln = class Ln extends bn(yn) {
  constructor(e = {}) {
    var o;
    const { scene: i, showControls: r, ...a } = e ?? {};
    super(a);
    N(this, oe);
    N(this, An, null);
    N(this, Mn, null);
    N(this, wa, /* @__PURE__ */ l((e) => {
      var r, a;
      e.preventDefault();
      const i = Number((a = (r = e.currentTarget) == null ? void 0 : r.dataset) == null ? void 0 : a.delta);
      Number.isFinite(i) && (k("Time delta button clicked", { delta: i }), this._advanceTime(i));
    }, "#onDeltaClick"));
    N(this, va, /* @__PURE__ */ l((e) => {
      var i, r;
      e.preventDefault(), !(!this.showControls || !((i = game.user) != null && i.isGM)) && (k("Time value double clicked", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null }), h(this, oe, Ac).call(this));
    }, "#onTimeDoubleClick"));
    N(this, Ea, /* @__PURE__ */ l((e) => {
      if (this.isEditingTime && !this._commitTimeInProgress)
        if (e.key === "Enter") {
          e.preventDefault();
          const i = e.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
          h(this, oe, zo).call(this, r);
        } else e.key === "Escape" && (e.preventDefault(), h(this, oe, Vo).call(this));
    }, "#onTimeInputKeydown"));
    N(this, Ta, /* @__PURE__ */ l((e) => {
      if (!this.isEditingTime || this._commitTimeInProgress || this._suppressBlurCommit) return;
      const i = e.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
      h(this, oe, zo).call(this, r);
    }, "#onTimeInputBlur"));
    N(this, Ca, /* @__PURE__ */ l((e) => {
      const i = !!e;
      if (this.manageTimeEnabled === i) return;
      this.manageTimeEnabled = i, (this.rendered ?? this.isRendered ?? !1) && this.render({ force: !0 });
    }, "#handleManageTimeChange"));
    N(this, Sa, /* @__PURE__ */ l(async (e) => {
      var a, o, s, c, u, d, g, p, b;
      if (e.preventDefault(), !this.showControls || !((a = game.user) != null && a.isGM)) return;
      if (!this.manageTimeEnabled) {
        (s = (o = ui.notifications) == null ? void 0 : o.error) == null || s.call(
          o,
          w(
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
          w(
            "EIDOLON.TimeTrigger.SceneUnavailable",
            "The active scene is unavailable. Try again after reloading the world."
          )
        );
        return;
      }
      const r = !this.sceneAllowsRealTime;
      try {
        await i.setFlag(T, xo, r), this.sceneAllowsRealTime = r;
        const y = r ? w(
          "EIDOLON.TimeTrigger.SceneRealTimeEnabled",
          "Automatic real-time flow enabled for this scene."
        ) : w(
          "EIDOLON.TimeTrigger.SceneRealTimeDisabled",
          "Automatic real-time flow disabled for this scene."
        );
        (g = (d = ui.notifications) == null ? void 0 : d.info) == null || g.call(d, y);
      } catch (y) {
        console.error(`${T} | Failed to toggle scene real-time flow`, y), (b = (p = ui.notifications) == null ? void 0 : p.error) == null || b.call(
          p,
          w(
            "EIDOLON.TimeTrigger.SceneRealTimeToggleError",
            "Failed to update the scene's real-time flow setting."
          )
        );
      } finally {
        this.render({ force: !0 });
      }
    }, "#onRealTimeToggleClick"));
    N(this, La, /* @__PURE__ */ l(() => {
      (this.rendered ?? this.isRendered ?? !1) && (this.isEditingTime && (this.editValue = h(this, oe, Go).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    this.scene = i ?? null, this.showControls = typeof r == "boolean" ? r : !!((o = game.user) != null && o.isGM), this.isEditingTime = !1, this.editValue = "", this._commitTimeInProgress = !1, this._suppressBlurCommit = !1, this.manageTimeEnabled = !1, this.sceneAllowsRealTime = h(this, oe, Ko).call(this), L(this, An, Xs(f(this, La))), L(this, Mn, Tc(f(this, Ca)));
  }
  async _prepareContext() {
    var E, C;
    const e = ((E = game.time) == null ? void 0 : E.components) ?? {}, r = ((e == null ? void 0 : e.second) !== void 0 && (e == null ? void 0 : e.second) !== null ? of(e) : null) ?? h(this, oe, Oc).call(this), a = un(), o = a === "24h", s = o ? w("EIDOLON.TimeTrigger.EditTimePlaceholder24", "HH:MM") : w("EIDOLON.TimeTrigger.EditTimePlaceholder12", "HH:MM AM/PM"), c = this.showControls ? w(
      "EIDOLON.TimeTrigger.EditTimeHint",
      "Double-click to set a specific time."
    ) : "", u = this.showControls ? w(
      "EIDOLON.TimeTrigger.EditTimeLabel",
      "New time (HH:MM or HH:MM AM/PM)"
    ) : "", d = Bd.map((M) => ({
      minutes: M,
      label: M > 0 ? `+${M}` : `${M}`
    })), g = !!this.manageTimeEnabled, p = h(this, oe, Ko).call(this);
    this.sceneAllowsRealTime = p;
    const b = w(
      "EIDOLON.TimeTrigger.SceneRealTimeEnable",
      "Enable automatic real-time flow for this scene."
    ), y = w(
      "EIDOLON.TimeTrigger.SceneRealTimeDisable",
      "Disable automatic real-time flow for this scene."
    ), m = w(
      "EIDOLON.TimeTrigger.SceneRealTimeManageDisabled",
      "Enable Manage Time in module settings to allow automatic real-time flow."
    );
    return {
      formattedTime: r,
      deltas: d,
      manageTimeEnabled: g,
      sceneAllowsRealTime: p,
      realTimeButtonLabel: g ? p ? y : b : m,
      isGM: ((C = game.user) == null ? void 0 : C.isGM) ?? !1,
      showControls: !!this.showControls,
      editHint: c,
      editLabel: u,
      editPlaceholder: s,
      timeFormat: a,
      is24Hour: o,
      isEditingTime: !!this.isEditingTime,
      editValue: this.isEditingTime ? this.editValue ?? "" : ""
    };
  }
  async close(e = {}) {
    var r, a;
    if (!e.force)
      return (this.rendered ?? this.isRendered ?? !1) || (k("TimeTriggerWindow close request rerendering", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null
      }), this.render({ force: !0 })), this;
    k("Closing time trigger window", { sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null, force: !0 });
    const i = await super.close(e);
    return h(this, oe, xc).call(this), h(this, oe, Dc).call(this), i;
  }
  async _advanceTime(e) {
    var r, a, o, s, c, u, d;
    const i = e * 60;
    if (k("Advancing world time", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null, minutes: e, seconds: i }), !((a = game.user) != null && a.isGM)) {
      (s = (o = ui.notifications) == null ? void 0 : o.warn) == null || s.call(o, w("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time."));
      return;
    }
    try {
      await game.time.advance(i);
    } catch (g) {
      console.error(`${T} | Failed to advance time`, g), (u = (c = ui.notifications) == null ? void 0 : c.error) == null || u.call(
        c,
        w("EIDOLON.TimeTrigger.Error", "Failed to update the world time.")
      ), k("Failed to advance time from window", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        minutes: e,
        message: (g == null ? void 0 : g.message) ?? String(g)
      });
    }
  }
  _onRender(e, i) {
    var a;
    super._onRender(e, i);
    const r = this.element;
    if (r) {
      if (this.showControls) {
        k("Binding time trigger interactions", {
          sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
          buttonCount: r.querySelectorAll("[data-delta]").length
        }), r.querySelectorAll("[data-delta]").forEach((u) => {
          u.addEventListener("click", f(this, wa));
        });
        const o = r.querySelector('.time-trigger-window__time-value[data-editable="true"]');
        o && o.addEventListener("dblclick", f(this, va), { once: !1 });
        const s = r.querySelector(".time-trigger-window__time-input");
        s && (s.addEventListener("keydown", f(this, Ea)), s.addEventListener("blur", f(this, Ta)), typeof s.focus == "function" && (s.focus(), typeof s.select == "function" && s.select()));
        const c = r.querySelector('[data-action="toggle-real-time"]');
        c && c.addEventListener("click", f(this, Sa));
      }
      this._suppressBlurCommit = !1;
    }
  }
};
An = new WeakMap(), Mn = new WeakMap(), oe = new WeakSet(), Oc = /* @__PURE__ */ l(function() {
  var c;
  const e = (c = game.time) == null ? void 0 : c.worldTime;
  if (typeof e != "number" || !Number.isFinite(e)) return "";
  const i = 1440 * 60, r = (Math.floor(e) % i + i) % i, a = Math.floor(r / 3600), o = Math.floor(r % 3600 / 60), s = r % 60;
  return Xr({ hours: a, minutes: o, seconds: s }, un());
}, "#formatFallbackTime"), wa = new WeakMap(), va = new WeakMap(), Ac = /* @__PURE__ */ l(function() {
  var e;
  (e = game.user) != null && e.isGM && (this.isEditingTime = !0, this._suppressBlurCommit = !1, this.editValue = h(this, oe, Go).call(this), this.render({ force: !0 }));
}, "#enterTimeEditMode"), Vo = /* @__PURE__ */ l(function() {
  this.isEditingTime = !1, this.editValue = "", this._suppressBlurCommit = !1, this.render({ force: !0 });
}, "#cancelTimeEdit"), zo = /* @__PURE__ */ l(async function(e) {
  var a, o, s;
  if (!((a = game.user) != null && a.isGM) || !this.isEditingTime || this._commitTimeInProgress) return;
  this._commitTimeInProgress = !0;
  const i = typeof e == "string" ? e.trim() : "";
  if (!i) {
    h(this, oe, Vo).call(this), this._commitTimeInProgress = !1;
    return;
  }
  const r = h(this, oe, kc).call(this, i);
  if (r.error) {
    (s = (o = ui.notifications) == null ? void 0 : o.error) == null || s.call(o, r.error), this._suppressBlurCommit = !0, this.editValue = i, this.render({ force: !0 }), this._commitTimeInProgress = !1;
    return;
  }
  try {
    await h(this, oe, Nc).call(this, r.seconds, r.includeSeconds) ? (this.isEditingTime = !1, this.editValue = "", this.render({ force: !0 })) : (this.editValue = i, this.render({ force: !0 }));
  } finally {
    this._commitTimeInProgress = !1;
  }
}, "#commitTimeInput"), Ea = new WeakMap(), Ta = new WeakMap(), Mc = /* @__PURE__ */ l(function() {
  var u, d;
  const e = (u = game.time) == null ? void 0 : u.worldTime;
  if (typeof e != "number" || !Number.isFinite(e))
    return "";
  const i = ((d = game.time) == null ? void 0 : d.components) ?? {}, r = Number(i.hour), a = Number(i.minute), o = i.second !== void 0 ? Number(i.second) : null, s = Number.isInteger(o);
  return (Number.isFinite(r) && Number.isFinite(a) ? Mt({
    hours: Math.max(0, Math.min(23, Number(r))),
    minutes: Math.max(0, Math.min(59, Number(a))),
    seconds: s && Number.isFinite(o) ? Math.max(0, Math.min(59, Number(o))) : void 0
  }) ?? "" : "") ?? "";
}, "#getCurrentCanonicalTime"), Nc = /* @__PURE__ */ l(async function(e, i) {
  var p, b, y, m, v, E, C, M, D, F;
  const r = (p = game.time) == null ? void 0 : p.worldTime;
  if (typeof r != "number" || !Number.isFinite(r))
    return (y = (b = ui.notifications) == null ? void 0 : b.error) == null || y.call(
      b,
      w(
        "EIDOLON.TimeTrigger.EditTimeUnavailable",
        "The world time is unavailable, so it can't be updated."
      )
    ), !1;
  if (!Number.isInteger(e) || e < 0 || e >= ii)
    return (v = (m = ui.notifications) == null ? void 0 : m.error) == null || v.call(
      m,
      w(
        "EIDOLON.TimeTrigger.EditTimeInvalidRange",
        "Enter a time within the current day."
      )
    ), !1;
  const s = Math.floor(r / ii) * ii + e - r;
  if (!Number.isFinite(s) || s === 0)
    return !0;
  const c = Math.floor(e / 3600), u = Math.floor(e % 3600 / 60), d = e % 60, g = Mt({
    hours: c,
    minutes: u,
    seconds: i ? d : void 0
  });
  try {
    k("Updating world time directly", {
      sceneId: ((E = this.scene) == null ? void 0 : E.id) ?? null,
      targetCanonical: g ?? null,
      diff: s
    }), await game.time.advance(s);
    const P = Xr(
      {
        hours: c,
        minutes: u,
        seconds: i ? d : null
      },
      un()
    );
    (M = (C = ui.notifications) == null ? void 0 : C.info) == null || M.call(
      C,
      w(
        "EIDOLON.TimeTrigger.EditTimeSuccess",
        "World time updated."
      ) + (P ? ` ${P}` : "")
    );
  } catch (P) {
    return console.error(`${T} | Failed to set world time`, P), (F = (D = ui.notifications) == null ? void 0 : D.error) == null || F.call(
      D,
      w(
        "EIDOLON.TimeTrigger.EditTimeError",
        "Failed to update the world time."
      )
    ), !1;
  }
  return !0;
}, "#applyTargetSeconds"), kc = /* @__PURE__ */ l(function(e) {
  var g;
  const i = w(
    "EIDOLON.TimeTrigger.EditTimeInvalid",
    "Enter a valid time like 14:30 or 2:30 PM."
  );
  if (typeof e != "string")
    return { error: i };
  const r = e.trim();
  if (!r)
    return { error: i };
  const a = r.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (a) {
    const p = Number(a[1]), b = Number(a[2]), y = a[3] !== void 0 ? Number(a[3]) : void 0;
    if (Number.isInteger(p) && p >= 0 && p <= 23 && Number.isInteger(b) && b >= 0 && b <= 59 && (y === void 0 || Number.isInteger(y) && y >= 0 && y <= 59)) {
      const m = p * 3600 + b * 60 + (y ?? 0);
      return {
        canonical: Mt({ hours: p, minutes: b, seconds: y }),
        seconds: m,
        includeSeconds: y !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const { amLower: o, pmLower: s, periodPattern: c } = h(this, oe, Wo).call(this), u = r.match(
    new RegExp(
      `^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?\\s*(${c})$`,
      "i"
    )
  );
  if (u) {
    let p = Number(u[1]);
    const b = Number(u[2]), y = u[3] !== void 0 ? Number(u[3]) : void 0, m = u[4] ?? "", v = typeof m == "string" ? ((g = m.toLocaleLowerCase) == null ? void 0 : g.call(m)) ?? m.toLowerCase() : "";
    if (Number.isInteger(p) && p >= 1 && p <= 12 && Number.isInteger(b) && b >= 0 && b <= 59 && (y === void 0 || Number.isInteger(y) && y >= 0 && y <= 59) && (v === o || v === s || v === "am" || v === "pm")) {
      p = p % 12, (v === s || v === "pm") && (p += 12);
      const C = p * 3600 + b * 60 + (y ?? 0);
      return {
        canonical: Mt({ hours: p, minutes: b, seconds: y }),
        seconds: C,
        includeSeconds: y !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const d = wc(r);
  if (d !== null) {
    const p = Math.floor(d / 3600), b = Math.floor(d % 3600 / 60), y = d % 60, m = y !== 0;
    return {
      canonical: Mt({
        hours: p,
        minutes: b,
        seconds: m ? y : void 0
      }),
      seconds: d,
      includeSeconds: m,
      error: null
    };
  }
  return { error: i };
}, "#parseInputTime"), Go = /* @__PURE__ */ l(function() {
  const e = h(this, oe, Mc).call(this);
  if (!e) return "";
  if (un() === "24h")
    return e;
  const r = Ya(e);
  if (!r) return e;
  const a = Number(r.hours), o = Number(r.minutes), s = r.seconds !== null && r.seconds !== void 0 ? Number(r.seconds) : void 0;
  if (!Number.isFinite(a) || !Number.isFinite(o)) return e;
  const c = Number.isFinite(s), u = a % 12 === 0 ? 12 : a % 12, d = String(o).padStart(2, "0"), g = c ? `:${String(s).padStart(2, "0")}` : "", { amLabel: p, pmLabel: b } = h(this, oe, Wo).call(this), y = a >= 12 ? b : p;
  return `${u}:${d}${g} ${y}`.trim();
}, "#getInitialEditValue"), Wo = /* @__PURE__ */ l(function() {
  var u, d;
  const e = w("EIDOLON.TimeTrigger.TimePeriodAM", "AM"), i = w("EIDOLON.TimeTrigger.TimePeriodPM", "PM"), r = ((u = e.toLocaleLowerCase) == null ? void 0 : u.call(e)) ?? e.toLowerCase(), a = ((d = i.toLocaleLowerCase) == null ? void 0 : d.call(i)) ?? i.toLowerCase(), o = h(this, oe, Jo).call(this, e), s = h(this, oe, Jo).call(this, i), c = `${o}|${s}|AM|PM`;
  return {
    amLabel: e,
    pmLabel: i,
    amLower: r,
    pmLower: a,
    periodPattern: c
  };
}, "#getPeriodMatchData"), Jo = /* @__PURE__ */ l(function(e) {
  return typeof e != "string" ? "" : e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}, "#escapeForRegex"), Ca = new WeakMap(), Sa = new WeakMap(), Ko = /* @__PURE__ */ l(function() {
  const e = this.scene;
  if (!e || typeof e.getFlag != "function") return !1;
  try {
    return !!e.getFlag(T, xo);
  } catch (i) {
    k("TimeTriggerWindow | Failed to read scene real-time flag", {
      sceneId: (e == null ? void 0 : e.id) ?? null,
      message: (i == null ? void 0 : i.message) ?? String(i)
    });
  }
  return !1;
}, "#readSceneRealTimeFlag"), La = new WeakMap(), xc = /* @__PURE__ */ l(function() {
  if (typeof f(this, An) == "function")
    try {
      f(this, An).call(this);
    } catch (e) {
      console.error(`${T} | Failed to dispose time format subscription`, e);
    }
  L(this, An, null);
}, "#disposeTimeFormatSubscription"), Dc = /* @__PURE__ */ l(function() {
  if (typeof f(this, Mn) == "function")
    try {
      f(this, Mn).call(this);
    } catch (e) {
      console.error(`${T} | Failed to dispose manage time subscription`, e);
    }
  L(this, Mn, null);
}, "#disposeManageTimeSubscription"), l(Ln, "TimeTriggerWindow"), Ce(Ln, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Re(Ln, Ln, "DEFAULT_OPTIONS"),
  {
    id: `${T}-time-trigger`,
    window: {
      title: w("EIDOLON.TimeTrigger.Title", "Time Trigger"),
      resizable: !1
    },
    position: {
      width: "auto",
      height: "auto"
    }
  },
  { inplace: !1 }
)), Ce(Ln, "PARTS", {
  content: {
    template: `modules/${T}/templates/time-trigger.html`
  }
});
let Uo = Ln;
function Qa(t, n = {}) {
  if (typeof t != "function")
    throw new TypeError("createApplicationFactory requires a constructor function.");
  const e = /* @__PURE__ */ l(function(r = {}) {
    const a = foundry.utils.mergeObject(
      n ?? {},
      r ?? {},
      { inplace: !1 }
    );
    return new t(a);
  }, "applicationFactory");
  return e.__eidolonFactorySignature = "options", e.__eidolonFactoryTarget = t, e;
}
l(Qa, "createApplicationFactory");
const Nl = /* @__PURE__ */ new Set();
var Le, Ke, Nn, bi, $c, Fc;
const ml = class ml {
  constructor({ windowFactory: n } = {}) {
    N(this, bi);
    N(this, Le, null);
    N(this, Ke, null);
    N(this, Nn);
    const e = Qa(Uo);
    typeof n == "function" ? n.__eidolonFactorySignature === "options" ? L(this, Nn, (r, a = {}) => n({ scene: r, ...a ?? {} })) : L(this, Nn, n) : L(this, Nn, /* @__PURE__ */ l((r, a = {}) => e({ scene: r, ...a ?? {} }), "fallbackFactory"));
  }
  onReady() {
    var e;
    const n = typeof ((e = game.time) == null ? void 0 : e.worldTime) == "number" && Number.isFinite(game.time.worldTime) ? game.time.worldTime : null;
    k("TimeTriggerManager#onReady", { worldTime: n }), n !== null && L(this, Ke, n);
  }
  onCanvasReady(n) {
    const e = (n == null ? void 0 : n.scene) ?? Ni();
    k("TimeTriggerManager#onCanvasReady", { sceneId: (e == null ? void 0 : e.id) ?? null }), this.refreshTimeTriggerWindow(e), this.handleTimeTriggerEvaluation(e);
  }
  onUpdateScene(n) {
    const e = Ni();
    k("TimeTriggerManager#onUpdateScene", {
      sceneId: (n == null ? void 0 : n.id) ?? null,
      activeSceneId: (e == null ? void 0 : e.id) ?? null
    }), !(!e || n.id !== e.id) && (this.refreshTimeTriggerWindow(n), this.handleTimeTriggerEvaluation(n));
  }
  onUpdateWorldTime(n, e) {
    k("TimeTriggerManager#onUpdateWorldTime", {
      worldTime: n,
      diff: e,
      hasWindow: !!f(this, Le)
    }), f(this, Le) && f(this, Le).render();
    const i = Ni(), r = h(this, bi, $c).call(this, n, e);
    this.handleTimeTriggerEvaluation(i, n, r);
  }
  refreshTimeTriggerWindow(n) {
    var c, u, d;
    if (!n) return;
    const e = !!((c = game.user) != null && c.isGM), i = !!n.getFlag(T, Jr), r = !!n.getFlag(T, No), a = !!n.getFlag(T, ko);
    if (k("TimeTriggerManager#refreshTimeTriggerWindow", {
      sceneId: n.id,
      isGM: e,
      isActive: i,
      hideWindow: r,
      showPlayerWindow: a
    }), !(i && !r && (e || a))) {
      f(this, Le) && (k("Closing time trigger window", { reason: "not-visible" }), f(this, Le).close({ force: !0 }), L(this, Le, null));
      return;
    }
    const s = !!e;
    if (f(this, Le) && ((u = f(this, Le).scene) == null ? void 0 : u.id) === n.id) {
      k("Refreshing existing time trigger window", { sceneId: n.id }), f(this, Le).showControls = s, f(this, Le).render();
      return;
    }
    f(this, Le) && (k("Closing existing window before creating new instance", {
      previousSceneId: ((d = f(this, Le).scene) == null ? void 0 : d.id) ?? null
    }), f(this, Le).close({ force: !0 })), L(this, Le, f(this, Nn).call(this, n, { showControls: s })), k("Rendering new time trigger window", { sceneId: n.id }), f(this, Le).render({ force: !0 });
  }
  async handleTimeTriggerEvaluation(n, e, i) {
    var c;
    const r = n ?? Ni();
    if (!r) {
      k("handleTimeTriggerEvaluation skipped", {
        reason: "no-active-scene",
        providedSceneId: (n == null ? void 0 : n.id) ?? null,
        currentWorldTime: e
      }), typeof e == "number" && Number.isFinite(e) && L(this, Ke, e);
      return;
    }
    const a = typeof e == "number" && Number.isFinite(e) ? e : typeof ((c = game.time) == null ? void 0 : c.worldTime) == "number" ? game.time.worldTime : null;
    if (a === null) return;
    const o = typeof i == "number" && Number.isFinite(i) ? i : null, s = o !== null ? o : typeof f(this, Ke) == "number" && Number.isFinite(f(this, Ke)) ? f(this, Ke) : a;
    mi("handleTimeTriggerEvaluation", {
      sceneId: r.id,
      previousWorldTime: s,
      currentWorldTime: a,
      overrideProvided: o !== null
    });
    try {
      await h(this, bi, Fc).call(this, r, s, a);
    } catch (u) {
      console.error(`${T} | Unexpected error while evaluating time triggers`, u), k("handleTimeTriggerEvaluation error", { message: (u == null ? void 0 : u.message) ?? String(u) });
    } finally {
      L(this, Ke, a), cn();
    }
  }
};
Le = new WeakMap(), Ke = new WeakMap(), Nn = new WeakMap(), bi = new WeakSet(), $c = /* @__PURE__ */ l(function(n, e) {
  return typeof f(this, Ke) == "number" && Number.isFinite(f(this, Ke)) ? (k("Resolved previous world time from cache", {
    previousWorldTime: f(this, Ke)
  }), f(this, Ke)) : typeof n == "number" && Number.isFinite(n) && typeof e == "number" && Number.isFinite(e) ? (k("Resolved previous world time using diff", {
    worldTime: n,
    diff: e,
    resolved: n - e
  }), n - e) : typeof n == "number" && Number.isFinite(n) ? n : null;
}, "#resolvePreviousWorldTime"), Fc = /* @__PURE__ */ l(async function(n, e, i) {
  var y, m, v;
  if (!((y = game.user) != null && y.isGM)) {
    k("Skipping trigger evaluation because user is not a GM");
    return;
  }
  if (!(n != null && n.id)) {
    k("Skipping trigger evaluation because the scene is missing an id");
    return;
  }
  if (!!!n.getFlag(T, Jr)) {
    k("Skipping trigger evaluation because scene is inactive", { sceneId: n.id });
    return;
  }
  if (typeof i != "number" || !Number.isFinite(i)) return;
  (typeof e != "number" || !Number.isFinite(e)) && (e = i);
  const a = ri(n);
  if (!a.length) {
    k("No time triggers configured for scene", { sceneId: n.id });
    return;
  }
  const o = Qd(n), s = /* @__PURE__ */ new Set();
  for (const E of a)
    E != null && E.id && s.add(E.id);
  let c = !1;
  for (const E of Object.keys(o))
    s.has(E) || (delete o[E], c = !0);
  if (mi("Evaluating scene time triggers", {
    sceneId: n.id,
    previousWorldTime: e,
    currentWorldTime: i,
    triggerCount: a.length
  }), i <= e) {
    k("Detected world time rewind", {
      previousWorldTime: e,
      currentWorldTime: i
    });
    for (const E of a) {
      if (!(E != null && E.id) || !E.allowReplayOnRewind) continue;
      const C = o[E.id];
      typeof C == "number" ? i < C ? (k("Clearing trigger history due to rewind", {
        triggerId: E.id,
        lastFired: C,
        currentWorldTime: i
      }), delete o[E.id], c = !0) : k("Preserving trigger history after rewind", {
        triggerId: E.id,
        lastFired: C,
        currentWorldTime: i
      }) : k("No history stored for rewind-enabled trigger", {
        triggerId: E.id
      });
    }
    c && (k("Persisting history cleanup after rewind", {
      sceneId: n.id
    }), await bo(n, o)), cn();
    return;
  }
  const u = e, d = i, g = [], p = Math.floor(u / ii), b = Math.floor(d / ii);
  for (const E of a) {
    if (!(E != null && E.id)) continue;
    const C = wc(E.time);
    if (C === null) {
      uf(n, E), k("Skipping trigger with invalid time", {
        triggerId: E.id,
        time: E.time
      });
      continue;
    }
    for (let M = p; M <= b; M++) {
      const D = M * ii + C;
      if (D < u || D > d) continue;
      const P = o[E.id];
      if (typeof P == "number" && P >= D) {
        k("Skipping trigger because it already fired within window", {
          triggerId: E.id,
          lastFired: P,
          absoluteTime: D
        });
        continue;
      }
      g.push({ trigger: E, absoluteTime: D });
    }
  }
  if (!g.length) {
    c && await bo(n, o), k("No triggers scheduled to fire within evaluation window", {
      sceneId: n.id
    }), cn();
    return;
  }
  g.sort((E, C) => E.absoluteTime - C.absoluteTime), k("Queued triggers for execution", {
    entries: g.map((E) => ({
      triggerId: E.trigger.id,
      absoluteTime: E.absoluteTime
    }))
  });
  for (const E of g)
    try {
      k("Executing time trigger action", {
        triggerId: E.trigger.id,
        absoluteTime: E.absoluteTime
      }), await Ic(n, E.trigger);
    } catch (C) {
      console.error(`${T} | Failed to execute time trigger action`, C), (v = (m = ui.notifications) == null ? void 0 : m.error) == null || v.call(
        m,
        w(
          "EIDOLON.TimeTrigger.TriggerActionError",
          "Failed to execute a scene time trigger action. Check the console for details."
        )
      ), k("Trigger execution failed", {
        triggerId: E.trigger.id,
        message: (C == null ? void 0 : C.message) ?? String(C)
      });
    } finally {
      o[E.trigger.id] = E.absoluteTime, c = !0, k("Recorded trigger execution", {
        triggerId: E.trigger.id,
        absoluteTime: E.absoluteTime
      });
    }
  c && (k("Persisting trigger history updates", { sceneId: n.id }), await bo(n, o)), cn();
}, "#evaluateSceneTimeTriggers"), l(ml, "TimeTriggerManager");
let Yo = ml;
function uf(t, n) {
  var r, a;
  const e = `${(t == null ? void 0 : t.id) ?? "unknown"}:${(n == null ? void 0 : n.id) ?? (n == null ? void 0 : n.time) ?? "unknown"}`;
  if (Nl.has(e)) return;
  Nl.add(e);
  const i = w(
    "EIDOLON.TimeTrigger.InvalidTimeWarning",
    "A scene time trigger has an invalid time value and was skipped."
  );
  (a = (r = ui.notifications) == null ? void 0 : r.warn) == null || a.call(r, i), console.warn(`${T} | Invalid time for trigger`, { scene: t == null ? void 0 : t.id, trigger: n });
}
l(uf, "warnInvalidTriggerTime");
var ht, ji, mt, Qt, kn, St, ci, Ia, Oa, Ui, Vi, xn, Lt, B, Xo, Qn, kr, Zo, xr, es, Et, _c, ts, Pc, ns, Rc, Aa, Ma, Na, ka, xa, Da, is, Hc, Dr, $a, Fa;
const pl = class pl {
  constructor() {
    N(this, B);
    N(this, ht, !1);
    N(this, ji, lr);
    N(this, mt, /* @__PURE__ */ new Map());
    N(this, Qt, null);
    N(this, kn, null);
    N(this, St, 0);
    N(this, ci, null);
    N(this, Ia, null);
    N(this, Oa, null);
    N(this, Ui, !1);
    N(this, Vi, !1);
    N(this, xn, !1);
    N(this, Lt, !1);
    N(this, Aa, /* @__PURE__ */ l((n, e = {}) => {
      k("GameTimeAutomation | Pause state changed", {
        paused: n,
        userId: (e == null ? void 0 : e.userId) ?? null,
        broadcast: (e == null ? void 0 : e.broadcast) ?? null
      }), h(this, B, Et).call(this, { pausedOverride: n });
    }, "#handlePause"));
    N(this, Ma, /* @__PURE__ */ l((n) => {
      n != null && n.id && (f(this, mt).set(n.id, Math.max(n.round ?? 0, 1)), k("GameTimeAutomation | Combat started", { combatId: n.id, round: n.round ?? 0 }), h(this, B, Et).call(this));
    }, "#handleCombatStart"));
    N(this, Na, /* @__PURE__ */ l((n, e) => {
      if (!(n != null && n.id)) return;
      const i = typeof e == "number" && Number.isFinite(e) ? e : typeof n.round == "number" && Number.isFinite(n.round) ? n.round : 0, r = i > 0 ? i : 1, a = f(this, mt).get(n.id), o = a ? Math.max(a, 1) : 1, s = r > 1 ? Math.max(r - o, 0) : 0;
      if (k("GameTimeAutomation | Combat round change detected", {
        combatId: n.id,
        effectiveRound: r,
        completedRounds: s,
        enabled: f(this, ht),
        paused: (game == null ? void 0 : game.paused) ?? null
      }), s > 0 && f(this, ht) && f(this, Lt) && !(game != null && game.paused) && h(this, B, Qn).call(this) && h(this, B, kr).call(this, n)) {
        const c = s * f(this, ji);
        c > 0 && (k("GameTimeAutomation | Advancing time for completed combat rounds", {
          combatId: n.id,
          completedRounds: s,
          delta: c
        }), h(this, B, ns).call(this, c));
      }
      f(this, mt).set(n.id, Math.max(r, 1));
    }, "#handleCombatRound"));
    N(this, ka, /* @__PURE__ */ l((n) => {
      n != null && n.id && (f(this, mt).delete(n.id), k("GameTimeAutomation | Combat ended", { combatId: n.id }), h(this, B, Et).call(this));
    }, "#handleCombatEnd"));
    N(this, xa, /* @__PURE__ */ l((n) => {
      n != null && n.id && (f(this, mt).delete(n.id), k("GameTimeAutomation | Combat deleted", { combatId: n.id }), h(this, B, Et).call(this));
    }, "#handleCombatDelete"));
    N(this, Da, /* @__PURE__ */ l((n, e) => {
      if (n != null && n.id) {
        if (typeof (e == null ? void 0 : e.round) == "number" && Number.isFinite(e.round)) {
          const i = Math.max(e.round, 1);
          f(this, mt).set(n.id, i), k("GameTimeAutomation | Combat round manually updated", {
            combatId: n.id,
            round: i
          });
        }
        (Object.prototype.hasOwnProperty.call(e ?? {}, "active") || (e == null ? void 0 : e.round) !== void 0) && h(this, B, Et).call(this);
      }
    }, "#handleCombatUpdate"));
    N(this, $a, /* @__PURE__ */ l((n) => {
      h(this, B, Dr).call(this, n == null ? void 0 : n.scene), h(this, B, Et).call(this);
    }, "#handleCanvasReady"));
    N(this, Fa, /* @__PURE__ */ l((n) => {
      if (!Ge(n)) return;
      const e = h(this, B, is).call(this);
      if (!e || e.id !== n.id) return;
      h(this, B, Dr).call(this, n) && h(this, B, Et).call(this);
    }, "#handleSceneUpdate"));
  }
  registerHooks() {
    f(this, Ui) || (L(this, Ui, !0), Hooks.on("pauseGame", f(this, Aa)), Hooks.on("combatStart", f(this, Ma)), Hooks.on("combatRound", f(this, Na)), Hooks.on("combatEnd", f(this, ka)), Hooks.on("deleteCombat", f(this, xa)), Hooks.on("updateCombat", f(this, Da)), Hooks.on("canvasReady", f(this, $a)), Hooks.on("updateScene", f(this, Fa)));
  }
  initialize() {
    f(this, Vi) || (L(this, Vi, !0), L(this, Ia, Tc((n) => {
      const e = !!n, i = e !== f(this, ht);
      L(this, ht, e), k("GameTimeAutomation | Manage time toggled", { enabled: e }), i && e && h(this, B, es).call(this), h(this, B, Et).call(this);
    })), L(this, Oa, Jd((n) => {
      L(this, ji, n), k("GameTimeAutomation | Seconds per round updated", { value: n });
    })), h(this, B, es).call(this), h(this, B, Dr).call(this), h(this, B, Et).call(this));
  }
};
ht = new WeakMap(), ji = new WeakMap(), mt = new WeakMap(), Qt = new WeakMap(), kn = new WeakMap(), St = new WeakMap(), ci = new WeakMap(), Ia = new WeakMap(), Oa = new WeakMap(), Ui = new WeakMap(), Vi = new WeakMap(), xn = new WeakMap(), Lt = new WeakMap(), B = new WeakSet(), Xo = /* @__PURE__ */ l(function() {
  var n;
  try {
    if (typeof ((n = globalThis.performance) == null ? void 0 : n.now) == "function")
      return globalThis.performance.now();
  } catch (e) {
    k("GameTimeAutomation | Failed to read high-resolution timestamp", {
      message: (e == null ? void 0 : e.message) ?? String(e)
    });
  }
  return Date.now();
}, "#currentTimestamp"), Qn = /* @__PURE__ */ l(function() {
  var n;
  return !!((n = game == null ? void 0 : game.user) != null && n.isGM && game.user.active !== !1);
}, "#canControlTime"), kr = /* @__PURE__ */ l(function(n) {
  var i, r;
  if (!n) return !1;
  if (n.active === !0) return !0;
  if (n.active === !1) return !1;
  const e = (i = game == null ? void 0 : game.combats) == null ? void 0 : i.active;
  return (e == null ? void 0 : e.id) === n.id ? !0 : ((r = game == null ? void 0 : game.combat) == null ? void 0 : r.id) === n.id ? game.combat.active ?? !0 : !1;
}, "#isCombatDocumentActive"), Zo = /* @__PURE__ */ l(function(n) {
  return n ? typeof n.started == "boolean" ? n.started : (n.round ?? 0) > 0 : !1;
}, "#hasCombatStarted"), xr = /* @__PURE__ */ l(function() {
  var i;
  const n = Array.isArray((i = game == null ? void 0 : game.combats) == null ? void 0 : i.contents) ? game.combats.contents : [];
  for (const r of n)
    if (h(this, B, kr).call(this, r) && h(this, B, Zo).call(this, r))
      return !0;
  const e = game == null ? void 0 : game.combat;
  return !!(e && h(this, B, kr).call(this, e) && h(this, B, Zo).call(this, e));
}, "#isCombatRunning"), es = /* @__PURE__ */ l(function() {
  var e;
  f(this, mt).clear();
  const n = Array.isArray((e = game == null ? void 0 : game.combats) == null ? void 0 : e.contents) ? game.combats.contents : [];
  for (const i of n)
    i != null && i.id && f(this, mt).set(i.id, Math.max(i.round ?? 0, 1));
}, "#hydrateRoundTracking"), Et = /* @__PURE__ */ l(function({ pausedOverride: n } = {}) {
  const e = typeof n == "boolean" ? n : !!(game != null && game.paused), i = f(this, ht), r = f(this, Lt), a = i && r, o = {
    manageTimeEnabled: i,
    sceneAllowsRealTime: r,
    effectiveEnabled: a,
    paused: e,
    canControl: h(this, B, Qn).call(this),
    combatRunning: h(this, B, xr).call(this),
    overrideApplied: typeof n == "boolean"
  };
  if (k("GameTimeAutomation | Sync running state", o), !a || !h(this, B, Qn).call(this)) {
    h(this, B, ts).call(this);
    return;
  }
  h(this, B, _c).call(this);
}, "#syncRunningState"), _c = /* @__PURE__ */ l(function() {
  f(this, Qt) === null && (L(this, kn, h(this, B, Xo).call(this)), L(this, Qt, globalThis.setInterval(() => h(this, B, Pc).call(this), 1e3)), k("GameTimeAutomation | Started real-time ticker"));
}, "#startRealTimeTicker"), ts = /* @__PURE__ */ l(function() {
  f(this, Qt) !== null && (globalThis.clearInterval(f(this, Qt)), L(this, Qt, null), k("GameTimeAutomation | Stopped real-time ticker")), L(this, kn, null), L(this, St, 0), L(this, xn, !1);
}, "#stopRealTimeTicker"), Pc = /* @__PURE__ */ l(function() {
  if (!f(this, ht) || !f(this, Lt) || !h(this, B, Qn).call(this)) {
    h(this, B, ts).call(this);
    return;
  }
  const n = h(this, B, Xo).call(this);
  if (typeof n != "number" || !Number.isFinite(n)) return;
  const e = f(this, kn) ?? n, i = (n - e) / 1e3;
  if (L(this, kn, n), !Number.isFinite(i) || i <= 0) return;
  const r = !!(game != null && game.paused), a = h(this, B, xr).call(this);
  if (r || a) {
    f(this, xn) || k("GameTimeAutomation | Tick skipped", { paused: r, combatRunning: a }), L(this, xn, !0), L(this, St, 0);
    return;
  }
  L(this, xn, !1), k("GameTimeAutomation | Real-time tick", { deltaSeconds: i }), h(this, B, ns).call(this, i);
}, "#tickRealTime"), ns = /* @__PURE__ */ l(function(n) {
  if (!f(this, ht) || !f(this, Lt)) return;
  const e = Number(n);
  !Number.isFinite(e) || e <= 0 || (L(this, St, f(this, St) + e), !f(this, ci) && L(this, ci, h(this, B, Rc).call(this)));
}, "#queueAdvance"), Rc = /* @__PURE__ */ l(async function() {
  var n, e;
  for (; f(this, St) > 0; ) {
    if (!f(this, ht) || !f(this, Lt) || game != null && game.paused || !h(this, B, Qn).call(this) || h(this, B, xr).call(this)) {
      L(this, St, 0);
      break;
    }
    const i = f(this, St);
    L(this, St, 0);
    try {
      if (typeof ((n = game == null ? void 0 : game.time) == null ? void 0 : n.advance) == "function")
        k("GameTimeAutomation | Advancing world time", { delta: i }), await game.time.advance(i), k("GameTimeAutomation | World time advanced", {
          worldTime: ((e = game.time) == null ? void 0 : e.worldTime) ?? null
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
  L(this, ci, null);
}, "#flushAdvanceQueue"), Aa = new WeakMap(), Ma = new WeakMap(), Na = new WeakMap(), ka = new WeakMap(), xa = new WeakMap(), Da = new WeakMap(), is = /* @__PURE__ */ l(function() {
  const n = Ni();
  return Ge(n) ? n : null;
}, "#getActiveSceneDocument"), Hc = /* @__PURE__ */ l(function(n) {
  if (!Ge(n)) return !1;
  try {
    return !!n.getFlag(T, xo);
  } catch (e) {
    return k("GameTimeAutomation | Failed to read scene real-time flag", {
      sceneId: (n == null ? void 0 : n.id) ?? null,
      message: (e == null ? void 0 : e.message) ?? String(e)
    }), !1;
  }
}, "#isSceneRealTimeAllowed"), Dr = /* @__PURE__ */ l(function(n) {
  const e = Ge(n) ? n : h(this, B, is).call(this), i = h(this, B, Hc).call(this, e), r = f(this, Lt);
  return L(this, Lt, i), r !== i ? (k("GameTimeAutomation | Scene real-time allowance changed", {
    sceneId: (e == null ? void 0 : e.id) ?? null,
    allows: i
  }), !0) : !1;
}, "#refreshSceneAutomationState"), $a = new WeakMap(), Fa = new WeakMap(), l(pl, "GameTimeAutomation");
let Qo = pl;
var fc, Xt, He, Dn, Rt, _a, Se, qc, Bc, jc, Uc, Pa, as, Ra, Vc, Ha, zc, Gc;
const Ft = class Ft extends bn(yn) {
  constructor(e = {}) {
    const { scene: i, trigger: r, triggerIndex: a, onSave: o, ...s } = e ?? {};
    super(s);
    N(this, Se);
    N(this, Xt, null);
    N(this, He, null);
    N(this, Dn, null);
    N(this, Rt, null);
    N(this, _a, /* @__PURE__ */ l(() => {
      (this.rendered ?? this.isRendered ?? !1) && (L(this, Rt, h(this, Se, qc).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    N(this, Pa, /* @__PURE__ */ l((e) => {
      var a, o;
      const i = e.currentTarget, r = i == null ? void 0 : i.closest("form");
      r && (k("Trigger action selection changed", {
        sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
        triggerId: ((o = this.trigger) == null ? void 0 : o.id) ?? null,
        actionId: (i == null ? void 0 : i.value) ?? null
      }), h(this, Se, as).call(this, i.value, r));
    }, "#onActionSelectChange"));
    N(this, Ra, /* @__PURE__ */ l((e) => {
      var u, d, g, p;
      e.preventDefault();
      const i = e.currentTarget, r = i == null ? void 0 : i.closest("form");
      if (!r) return;
      const a = (u = i.dataset) == null ? void 0 : u.target;
      if (!a) return;
      const o = typeof (CSS == null ? void 0 : CSS.escape) == "function" ? CSS.escape : (b) => b, s = r.querySelector(`[name="${o(a)}"]`);
      if (!s) return;
      k("Opening file picker for trigger", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        triggerId: ((g = this.trigger) == null ? void 0 : g.id) ?? null,
        target: a
      }), new FilePicker({
        type: ((p = i.dataset) == null ? void 0 : p.type) || "audio",
        current: s.value,
        callback: /* @__PURE__ */ l((b) => {
          var y, m;
          s.value = b, s.dispatchEvent(new Event("change")), k("Trigger form file selected", {
            sceneId: ((y = this.scene) == null ? void 0 : y.id) ?? null,
            triggerId: ((m = this.trigger) == null ? void 0 : m.id) ?? null,
            target: a,
            path: b
          });
        }, "callback")
      }).render({ force: !0 });
    }, "#onFilePicker"));
    N(this, Ha, /* @__PURE__ */ l(async (e) => {
      var r, a;
      e.preventDefault();
      const i = e.currentTarget;
      i instanceof HTMLFormElement && (k("Trigger form submitted", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null,
        triggerId: ((a = this.trigger) == null ? void 0 : a.id) ?? null
      }), await h(this, Se, zc).call(this, i));
    }, "#onSubmit"));
    this.scene = i ?? null, this.trigger = r ?? null, this.triggerIndex = Number.isInteger(a) ? Number(a) : null, this.onSave = typeof o == "function" ? o : null, L(this, Dn, Xs(f(this, _a)));
  }
  async _prepareContext() {
    var e, i;
    mi("TriggerFormApplication#_prepareContext", {
      sceneId: ((e = this.scene) == null ? void 0 : e.id) ?? null,
      triggerId: ((i = this.trigger) == null ? void 0 : i.id) ?? null,
      triggerIndex: this.triggerIndex
    });
    try {
      const r = this.trigger ?? { action: Nr, data: {} }, a = r.action ?? Nr, o = Ml(r.time), s = o.format ?? "12h", c = s === "12h" ? cf() : [], u = o.period ?? (c.length > 0 ? c[0].value : null), d = s === "12h" ? c.map((b) => ({
        ...b,
        selected: b.value === u
      })) : [], g = Al().map((b) => ({
        id: b.id,
        label: typeof b.label == "function" ? b.label() : b.label,
        selected: b.id === a
      })), p = Al().map((b) => {
        const y = b.id === r.action ? r : { ...r, action: b.id }, m = tf(y);
        return m ? {
          id: b.id,
          visible: b.id === a,
          content: m
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
        actions: g,
        actionSections: p,
        allowReplayOnRewind: !!r.allowReplayOnRewind,
        labels: {
          time: w("EIDOLON.TimeTrigger.TriggerTime", "Trigger Time"),
          hour: w("EIDOLON.TimeTrigger.TriggerTimeHour", "Hour"),
          minute: w("EIDOLON.TimeTrigger.TriggerTimeMinute", "Minute"),
          period: w("EIDOLON.TimeTrigger.TriggerTimePeriod", "AM / PM"),
          action: w("EIDOLON.TimeTrigger.TriggerAction", "Action"),
          allowReplayOnRewind: w(
            "EIDOLON.TimeTrigger.AllowReplayOnRewind",
            "Allow replay after rewinding time"
          ),
          allowReplayOnRewindHint: w(
            "EIDOLON.TimeTrigger.AllowReplayOnRewindHint",
            "When enabled, this trigger can fire again if world time moves backward."
          ),
          save: w("EIDOLON.TimeTrigger.TriggerSave", "Save Trigger")
        }
      };
    } finally {
      cn();
    }
  }
  _onRender(e, i) {
    var c, u, d;
    super._onRender(e, i);
    const r = this.element;
    if (!r) return;
    k("Trigger form rendered", {
      sceneId: ((c = this.scene) == null ? void 0 : c.id) ?? null,
      triggerId: ((u = this.trigger) == null ? void 0 : u.id) ?? null
    });
    const a = Array.from(((d = document == null ? void 0 : document.body) == null ? void 0 : d.classList) ?? []).find(
      (g) => g.startsWith("theme-")
    );
    a && r.classList.add(a);
    const o = r.querySelector("form");
    if (!o) return;
    h(this, Se, Vc).call(this, o), h(this, Se, Bc).call(this, o), o.addEventListener("submit", f(this, Ha));
    const s = o.querySelector("[data-action-select]");
    s && (s.addEventListener("change", f(this, Pa)), h(this, Se, as).call(this, s.value, o)), o.querySelectorAll("[data-action-file-picker]").forEach((g) => {
      g.addEventListener("click", f(this, Ra));
    });
  }
  async close(e = {}) {
    var i;
    if ((i = f(this, Xt)) == null || i.call(this), L(this, Xt, null), L(this, He, null), L(this, Rt, null), typeof f(this, Dn) == "function")
      try {
        f(this, Dn).call(this);
      } catch (r) {
        console.error(`${T} | Failed to dispose trigger form time format subscription`, r);
      }
    return L(this, Dn, null), super.close(e);
  }
};
Xt = new WeakMap(), He = new WeakMap(), Dn = new WeakMap(), Rt = new WeakMap(), _a = new WeakMap(), Se = new WeakSet(), qc = /* @__PURE__ */ l(function() {
  var s, c, u, d, g, p, b;
  const e = (c = (s = this.element) == null ? void 0 : s.querySelector) == null ? void 0 : c.call(s, "form");
  if (!(e instanceof HTMLFormElement)) return null;
  const i = Array.from(e.elements ?? []), r = [];
  for (const y of i)
    if ((y instanceof HTMLInputElement || y instanceof HTMLSelectElement || y instanceof HTMLTextAreaElement) && y.name && !(((u = y.dataset) == null ? void 0 : u.timeHidden) !== void 0 || ((d = y.dataset) == null ? void 0 : d.timeHour) !== void 0 || ((g = y.dataset) == null ? void 0 : g.timeMinute) !== void 0 || ((p = y.dataset) == null ? void 0 : p.timePeriod) !== void 0)) {
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
          values: Array.from(y.selectedOptions ?? []).map((m) => m.value)
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
  const a = e.querySelector("[data-time-format]");
  let o = null;
  if (a instanceof HTMLElement) {
    const y = a.querySelector("[data-time-hidden]"), m = a.querySelector("[data-time-hour]"), v = a.querySelector("[data-time-minute]"), E = a.querySelector("[data-time-period]");
    o = {
      format: ((b = a.dataset) == null ? void 0 : b.timeFormat) ?? null,
      canonical: y instanceof HTMLInputElement ? y.value : "",
      hour: m instanceof HTMLInputElement ? m.value : "",
      minute: v instanceof HTMLInputElement ? v.value : "",
      period: E instanceof HTMLSelectElement ? E.value : ""
    };
  }
  return {
    fields: r,
    time: o
  };
}, "#captureFormState"), Bc = /* @__PURE__ */ l(function(e) {
  if (!f(this, Rt)) return;
  if (!(e instanceof HTMLFormElement)) {
    L(this, Rt, null);
    return;
  }
  const { fields: i = [], time: r = null } = f(this, Rt) ?? {};
  L(this, Rt, null), h(this, Se, jc).call(this, e, i), h(this, Se, Uc).call(this, e, r);
}, "#restorePendingFormState"), jc = /* @__PURE__ */ l(function(e, i) {
  if (!Array.isArray(i) || i.length === 0) return;
  const r = typeof (CSS == null ? void 0 : CSS.escape) == "function" ? CSS.escape : (a) => a;
  for (const a of i) {
    if (!a || typeof a.name != "string") continue;
    const o = r(a.name);
    if (a.kind === "checkbox" || a.kind === "radio") {
      const c = `input[type="${a.kind}"][name="${o}"]`, u = e.querySelectorAll(c);
      u.forEach((d) => {
        d instanceof HTMLInputElement && (u.length === 1 || d.value === a.value) && (d.checked = !!a.checked);
      });
      continue;
    }
    if (a.kind === "select-multiple") {
      const c = e.querySelector(`select[name="${o}"]`);
      if (!(c instanceof HTMLSelectElement)) continue;
      const u = new Set(Array.isArray(a.values) ? a.values : []);
      Array.from(c.options ?? []).forEach((d) => {
        d.selected = u.has(d.value);
      });
      continue;
    }
    const s = e.querySelector(`[name="${o}"]`);
    (s instanceof HTMLInputElement || s instanceof HTMLSelectElement || s instanceof HTMLTextAreaElement) && (s.value = a.value ?? "");
  }
}, "#restoreFieldValues"), Uc = /* @__PURE__ */ l(function(e, i) {
  var C, M, D;
  const r = e.querySelector("[data-time-format]");
  if (!(r instanceof HTMLElement)) {
    typeof f(this, He) == "function" && f(this, He).call(this);
    return;
  }
  const a = ((C = r.dataset) == null ? void 0 : C.timeFormat) === "24h" ? "24h" : "12h", o = r.querySelector("[data-time-hour]"), s = r.querySelector("[data-time-minute]"), c = r.querySelector("[data-time-period]"), u = r.querySelector("[data-time-hidden]");
  if (!i) {
    if (o instanceof HTMLInputElement && (o.value = ""), s instanceof HTMLInputElement && (s.value = ""), c instanceof HTMLSelectElement) {
      const F = ((D = (M = c.options) == null ? void 0 : M[0]) == null ? void 0 : D.value) ?? "";
      c.value = F;
    }
    u instanceof HTMLInputElement && (u.value = ""), typeof f(this, He) == "function" && f(this, He).call(this);
    return;
  }
  const d = typeof i.canonical == "string" ? i.canonical : "", g = typeof i.period == "string" ? i.period : "", p = typeof i.hour == "string" ? i.hour : "", b = typeof i.minute == "string" ? i.minute : "";
  let y = "", m = "", v = g, E = d;
  if (d) {
    const F = Ml(d, a);
    y = F.hour ?? "", m = F.minute ?? "", E = F.canonical ?? d, a === "12h" ? v = F.period ?? g : v = "";
  } else
    y = p, m = b, a !== "12h" && (v = "");
  if (o instanceof HTMLInputElement && (o.value = y ?? ""), s instanceof HTMLInputElement && (s.value = m ?? ""), c instanceof HTMLSelectElement)
    if (a === "12h") {
      const F = Array.from(c.options ?? []);
      F.find((H) => H.value === v) ? c.value = v : F.length > 0 ? c.value = F[0].value : c.value = "";
    } else
      c.value = "";
  u instanceof HTMLInputElement && (u.value = E ?? ""), typeof f(this, He) == "function" && f(this, He).call(this);
}, "#restoreTimeInputs"), Pa = new WeakMap(), as = /* @__PURE__ */ l(function(e, i) {
  i && i.querySelectorAll("[data-action-config]").forEach((r) => {
    const a = r.dataset.actionConfig === e;
    r.style.display = a ? "" : "none";
  });
}, "#updateActionSections"), Ra = new WeakMap(), Vc = /* @__PURE__ */ l(function(e) {
  var g, p, b, y;
  if ((g = f(this, Xt)) == null || g.call(this), L(this, Xt, null), L(this, He, null), !(e instanceof HTMLFormElement)) return;
  const i = e.querySelector("[data-time-format]"), r = ((p = i == null ? void 0 : i.dataset) == null ? void 0 : p.timeFormat) ?? null;
  if (r !== "12h" && r !== "24h")
    return;
  const a = i.querySelector("[data-time-hidden]"), o = i.querySelector("[data-time-hour]"), s = i.querySelector("[data-time-minute]"), c = r === "12h" ? i.querySelector("[data-time-period]") : null;
  if (!a || !o || !s || r === "12h" && !c) {
    k("Trigger form time inputs missing elements", {
      format: r,
      hasHidden: !!a,
      hasHour: !!o,
      hasMinute: !!s,
      hasPeriod: !!c
    });
    return;
  }
  const u = [o, s, ...c ? [c] : []], d = /* @__PURE__ */ l(() => {
    const { canonical: m, error: v } = lf(
      {
        hour: o.value,
        minute: s.value,
        period: (c == null ? void 0 : c.value) ?? null,
        time: a.value
      },
      r
    );
    a.value = m ?? "";
    const E = v ?? "";
    a.setCustomValidity(E), u.forEach((C) => {
      C.setCustomValidity(E);
    });
  }, "update");
  u.forEach((m) => {
    m.addEventListener("input", d), m.addEventListener("change", d);
  }), d(), L(this, Xt, () => {
    u.forEach((m) => {
      m.removeEventListener("input", d), m.removeEventListener("change", d);
    });
  }), L(this, He, d), k("Trigger form configured for time input", {
    format: r,
    sceneId: ((b = this.scene) == null ? void 0 : b.id) ?? null,
    triggerId: ((y = this.trigger) == null ? void 0 : y.id) ?? null
  });
}, "#setupTimeInput"), Ha = new WeakMap(), zc = /* @__PURE__ */ l(async function(e) {
  var a, o, s, c, u;
  if (typeof f(this, He) == "function" && f(this, He).call(this), typeof e.checkValidity == "function" && !e.checkValidity()) {
    typeof e.reportValidity == "function" && e.reportValidity(), k("Trigger form submission blocked by validity check", {
      sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
      triggerId: ((o = this.trigger) == null ? void 0 : o.id) ?? null
    });
    return;
  }
  const i = new FormData(e), r = Object.fromEntries(i.entries());
  delete r.timeHour, delete r.timeMinute, delete r.timePeriod, r.allowReplayOnRewind = ((s = e.querySelector('input[name="allowReplayOnRewind"]')) == null ? void 0 : s.checked) ?? !1, k("Processing trigger form submission", {
    sceneId: ((c = this.scene) == null ? void 0 : c.id) ?? null,
    triggerId: ((u = this.trigger) == null ? void 0 : u.id) ?? null,
    allowReplayOnRewind: r.allowReplayOnRewind
  }), await h(this, Se, Gc).call(this, r), await this.close();
}, "#handleSubmit"), Gc = /* @__PURE__ */ l(async function(e) {
  var a, o, s, c, u, d;
  const i = {
    id: ((a = this.trigger) == null ? void 0 : a.id) ?? jd(),
    time: e.time ?? "",
    action: e.action ?? Nr,
    allowReplayOnRewind: !!e.allowReplayOnRewind,
    data: {}
  };
  k("Persisting trigger from form", {
    sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
    triggerId: i.id,
    existingIndex: this.triggerIndex
  }), nf(i, e);
  const r = ri(this.scene);
  this.triggerIndex !== null && r[this.triggerIndex] ? r[this.triggerIndex] = i : r.push(i);
  try {
    await Lc(this.scene, r), k("Trigger list saved", {
      sceneId: ((s = this.scene) == null ? void 0 : s.id) ?? null,
      triggerCount: r.length
    });
  } catch (g) {
    throw console.error(`${T} | Failed to save time trigger`, g), (u = (c = ui.notifications) == null ? void 0 : c.error) == null || u.call(
      c,
      w(
        "EIDOLON.TimeTrigger.TriggerSaveError",
        "Failed to save the scene's time triggers."
      )
    ), g;
  }
  if (this.onSave)
    try {
      this.onSave(r);
    } catch (g) {
      console.error(`${T} | Trigger onSave callback failed`, g), k("Trigger onSave callback failed", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        message: (g == null ? void 0 : g.message) ?? String(g)
      });
    }
}, "#persistTrigger"), l(Ft, "TriggerFormApplication"), Ce(Ft, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Re(Ft, Ft, "DEFAULT_OPTIONS"),
  {
    id: `${T}-trigger-form`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((fc = Re(Ft, Ft, "DEFAULT_OPTIONS")) == null ? void 0 : fc.classes) ?? [], "standard-form", "themed"])
    ),
    window: {
      title: w("EIDOLON.TimeTrigger.TriggerFormTitle", "Configure Time Trigger"),
      resizable: !1
    },
    position: {
      width: 400,
      height: "auto"
    }
  },
  { inplace: !1 }
)), Ce(Ft, "PARTS", {
  content: {
    template: `modules/${T}/templates/time-trigger-form.html`
  }
});
let rs = Ft;
function jt(t) {
  return t instanceof HTMLElement ? t : (t == null ? void 0 : t[0]) instanceof HTMLElement ? t[0] : null;
}
l(jt, "asHTMLElement");
function $r(t) {
  return typeof (t == null ? void 0 : t.changeTab) == "function";
}
l($r, "isAppV2");
function Wc(t, n, e, i = {}) {
  if ($r(t)) {
    t.changeTab(n, e, i);
    return;
  }
  if (typeof (t == null ? void 0 : t.activateTab) == "function") {
    const r = { ...i };
    e != null && (r.group = e), r.triggerCallback == null && (r.triggerCallback = !0), t.activateTab(n, r);
  }
}
l(Wc, "setActiveTab");
function df(t) {
  var e, i;
  if (!(t instanceof HTMLFormElement)) return {};
  const n = ((i = (e = foundry == null ? void 0 : foundry.applications) == null ? void 0 : e.ux) == null ? void 0 : i.FormDataExtended) ?? globalThis.FormDataExtended ?? null;
  if (!n) return {};
  try {
    const r = new n(t), a = typeof r.object == "object" ? r.object : {};
    return foundry.utils.expandObject(a);
  } catch {
    return {};
  }
}
l(df, "readFormData");
const kl = Symbol.for("eidolon.sceneConfig.v13PatchedTabs");
function Jc(t = {}) {
  const {
    tabId: n,
    tabLabel: e,
    getScene: i,
    isApplicable: r,
    renderContent: a,
    debugNamespace: o = "SceneConfigTab",
    onButtonCreate: s,
    onTabCreate: c,
    onAfterRender: u,
    logger: d = {},
    moduleId: g = "eidolon-utilities",
    tabIcon: p = "fa-solid fa-puzzle-piece"
  } = t ?? {};
  if (!n)
    throw new Error("createSceneConfigTabFactory requires a tabId.");
  if (typeof a != "function")
    throw new TypeError("createSceneConfigTabFactory requires a renderContent callback.");
  const b = typeof d.log == "function" ? d.log.bind(d) : (..._) => {
    var z;
    return (z = console.debug) == null ? void 0 : z.call(console, `${o}`, ..._);
  }, y = typeof d.group == "function" ? d.group.bind(d) : (..._) => {
    var z;
    return (z = console.groupCollapsed) == null ? void 0 : z.call(console, `${o}`, ..._);
  }, m = typeof d.groupEnd == "function" ? d.groupEnd.bind(d) : () => {
    var _;
    return (_ = console.groupEnd) == null ? void 0 : _.call(console);
  }, v = Symbol(`EIDOLON_SCENE_CONFIG_TAB_CLEANUP_${n}`), E = typeof i == "function" ? i : () => null, C = typeof r == "function" ? r : () => !0, M = typeof e == "function" ? e : () => typeof e == "string" ? e : n;
  function D() {
    var X, U, I, O, A;
    const _ = ((U = (X = foundry == null ? void 0 : foundry.applications) == null ? void 0 : X.sheets) == null ? void 0 : U.SceneConfig) ?? ((I = CONFIG == null ? void 0 : CONFIG.Scene) == null ? void 0 : I.sheetClass);
    if (!_ || !$r({ changeTab: (O = _.prototype) == null ? void 0 : O.changeTab })) return;
    const z = _[kl] ?? /* @__PURE__ */ new Set();
    if (z.has(n)) return;
    z.add(n), _[kl] = z;
    const G = (A = _.TABS) == null ? void 0 : A.sheet;
    if (G && Array.isArray(G.tabs) && !G.tabs.some((x) => x.id === n)) {
      const x = M({ app: null, scene: null }) ?? n;
      G.tabs.push({
        id: n,
        icon: p,
        label: x
      });
    }
    _.PARTS && !_.PARTS[n] && (_.PARTS[n] = {
      template: `modules/${g}/templates/scene-config-tab-mount.hbs`,
      scrollable: [`.tab[data-tab="${n}"]`]
    }), b("Patched v13 SceneConfig TABS/PARTS", { tabId: n });
  }
  l(D, "patchV13SceneConfig");
  function F(_, z) {
    var X, U;
    const G = E(_);
    if (!C(_, G)) {
      b("Skipped render", {
        tabId: n,
        reason: "inapplicable",
        constructor: ((X = _ == null ? void 0 : _.constructor) == null ? void 0 : X.name) ?? null
      });
      return;
    }
    y("render", {
      tabId: n,
      sceneId: (G == null ? void 0 : G.id) ?? null,
      constructor: ((U = _ == null ? void 0 : _.constructor) == null ? void 0 : U.name) ?? null
    });
    try {
      const I = jt(z) ?? jt(_.element);
      if (!I) {
        b("Missing root element", { tabId: n });
        return;
      }
      $r(_) ? ne(_, I, G) : H(_, I, G);
    } finally {
      m();
    }
  }
  l(F, "handleRender");
  function P(_, z, G) {
    var I;
    if (!p) {
      _.textContent = z;
      return;
    }
    const X = (I = _.querySelector("i")) == null ? void 0 : I.cloneNode(!0);
    _.textContent = "";
    const U = X ?? document.createElement("i");
    if (X || (U.className = p, G && (U.inert = !0)), _.append(U, " "), G) {
      const O = document.createElement("span");
      O.textContent = z, _.append(O);
    } else
      _.append(document.createTextNode(z));
  }
  l(P, "setButtonContent");
  function H(_, z, G) {
    var we, Pe, ke, Ae, Jn, xt, wn, Ze, Dt, R, mr, Y, ct, xe, Ti, pr;
    const U = [
      "nav.sheet-tabs[data-group]",
      "nav.tabs[data-group]",
      "nav.sheet-tabs",
      "nav.tabs"
    ].map((De) => z.querySelector(De)).find((De) => De instanceof HTMLElement), O = [
      (we = z.querySelector(".tab[data-tab]")) == null ? void 0 : we.parentElement,
      z.querySelector(".sheet-body"),
      (ke = (Pe = U == null ? void 0 : U.parentElement) == null ? void 0 : Pe.querySelector) == null ? void 0 : ke.call(Pe, ":scope > .sheet-body"),
      U == null ? void 0 : U.parentElement
    ].find((De) => De instanceof HTMLElement), A = ((Ae = U == null ? void 0 : U.dataset) == null ? void 0 : Ae.group) ?? ((wn = (xt = (Jn = U == null ? void 0 : U.querySelector) == null ? void 0 : Jn.call(U, "a[data-group]")) == null ? void 0 : xt.dataset) == null ? void 0 : wn.group) ?? ((R = (Dt = (Ze = U == null ? void 0 : U.querySelector) == null ? void 0 : Ze.call(U, "[data-group]")) == null ? void 0 : Dt.dataset) == null ? void 0 : R.group) ?? ((ct = (Y = (mr = O == null ? void 0 : O.querySelector) == null ? void 0 : mr.call(O, ".tab[data-group]")) == null ? void 0 : Y.dataset) == null ? void 0 : ct.group) ?? "main";
    if (!U || !O) {
      b("Missing navigation elements", {
        tabId: n,
        hasNav: !!U,
        hasBody: !!O
      });
      return;
    }
    let x = U.querySelector(`[data-tab="${n}"]`);
    if (!x) {
      x = document.createElement("a"), x.dataset.action = "tab", x.dataset.group = A, x.dataset.tab = n;
      const De = U.querySelector("a[data-tab]");
      (xe = De == null ? void 0 : De.classList) != null && xe.contains("item") && x.classList.add("item"), U.appendChild(x), typeof s == "function" && s({ app: _, button: x, nav: U, scene: G }), b("Created tab button", { tabId: n, group: A });
    }
    P(x, M({ app: _, scene: G }) ?? n, $r(_));
    let q = O.querySelector(`.tab[data-tab="${n}"]`);
    if (!q) {
      q = document.createElement("div"), q.classList.add("tab"), q.dataset.tab = n, q.dataset.group = A;
      const De = ff(O);
      O.insertBefore(q, De ?? null), typeof c == "function" && c({ app: _, tab: q, body: O, scene: G }), b("Created tab container", { tabId: n, group: A });
    }
    ((Ti = x.classList) == null ? void 0 : Ti.contains("active")) || q.classList.contains("active") ? (x.classList.add("active"), q.classList.add("active"), q.removeAttribute("hidden")) : (x.classList.remove("active"), q.classList.remove("active"), q.setAttribute("hidden", "true"));
    const se = /* @__PURE__ */ l(() => {
      var vn, Ci;
      ((vn = x.classList) != null && vn.contains("active") || q.classList.contains("active")) && ((Ci = x.classList) == null || Ci.add("active"), q.classList.add("active"), q.removeAttribute("hidden"), q.removeAttribute("aria-hidden"), q.style.display === "none" && (q.style.display = ""));
    }, "ensureTabVisible"), fe = /* @__PURE__ */ l(() => {
      se(), requestAnimationFrame(se);
    }, "scheduleEnsureTabVisible");
    x.dataset.eidolonEnsureSceneTabVisibility || (x.addEventListener("click", () => {
      Wc(_, n, A), requestAnimationFrame(se);
    }), x.dataset.eidolonEnsureSceneTabVisibility = "true"), wo(_, v, b);
    const ye = a({
      app: _,
      scene: G,
      tab: q,
      tabButton: x,
      ensureTabVisible: se,
      scheduleEnsureTabVisible: fe
    });
    typeof ye == "function" && xl(_, v, ye), typeof u == "function" && u({
      app: _,
      scene: G,
      tab: q,
      tabButton: x,
      ensureTabVisible: se,
      scheduleEnsureTabVisible: fe
    }), (pr = _.setPosition) == null || pr.call(_, { height: "auto" });
  }
  l(H, "handleRenderV1");
  function ne(_, z, G) {
    const X = z.querySelector(`.tab[data-tab="${n}"]`), U = z.querySelector(`nav [data-tab="${n}"]`);
    if (!X || !U) {
      b("v2 mount not found, falling back to v1 injection", { tabId: n }), H(_, z, G);
      return;
    }
    P(U, M({ app: _, scene: G }) ?? n, !0);
    const I = /* @__PURE__ */ l(() => {
      var x;
      !((x = U.classList) != null && x.contains("active")) && !X.classList.contains("active") || (X.classList.add("active"), X.removeAttribute("hidden"), X.removeAttribute("aria-hidden"), X.style.display === "none" && (X.style.display = ""));
    }, "ensureTabVisible"), O = /* @__PURE__ */ l(() => {
      I(), requestAnimationFrame(I);
    }, "scheduleEnsureTabVisible");
    wo(_, v, b);
    const A = a({
      app: _,
      scene: G,
      tab: X,
      tabButton: U,
      ensureTabVisible: I,
      scheduleEnsureTabVisible: O
    });
    typeof A == "function" && xl(_, v, A), typeof u == "function" && u({
      app: _,
      scene: G,
      tab: X,
      tabButton: U,
      ensureTabVisible: I,
      scheduleEnsureTabVisible: O
    });
  }
  l(ne, "handleRenderV2");
  function ie(_) {
    wo(_, v, b);
  }
  l(ie, "handleClose");
  function V() {
    return Hooks.once("init", () => {
      D();
    }), Hooks.on("renderSceneConfig", F), Hooks.on("closeSceneConfig", ie), () => K();
  }
  l(V, "register");
  function K() {
    Hooks.off("renderSceneConfig", F), Hooks.off("closeSceneConfig", ie);
  }
  return l(K, "unregister"), { register: V, unregister: K };
}
l(Jc, "createSceneConfigTabFactory");
function xl(t, n, e) {
  if (!t || typeof e != "function") return;
  const i = t == null ? void 0 : t[n];
  Array.isArray(i) || (t[n] = []), t[n].push(e);
}
l(xl, "registerCleanup");
function wo(t, n, e) {
  if (!t) return;
  const i = t == null ? void 0 : t[n];
  if (Array.isArray(i))
    for (; i.length > 0; ) {
      const r = i.pop();
      if (typeof r == "function")
        try {
          r();
        } catch (a) {
          e("Cleanup failed", { message: (a == null ? void 0 : a.message) ?? String(a) });
        }
    }
}
l(wo, "invokeCleanup");
function ff(t) {
  if (!(t instanceof HTMLElement)) return null;
  const n = [
    ":scope > footer.sheet-footer",
    ":scope > footer.form-footer",
    ":scope > .sheet-footer",
    ":scope > .form-footer",
    ":scope > footer"
  ];
  for (const e of n) {
    const i = t.querySelector(e);
    if (i instanceof HTMLElement) return i;
  }
  return null;
}
l(ff, "findFooterElement$1");
const gf = Qa(rs), hf = `modules/${T}/templates/time-trigger-scene-tab.html`, mf = Jc({
  tabId: "time-triggers",
  tabLabel: /* @__PURE__ */ l(() => w("EIDOLON.TimeTrigger.Tab", "Time Triggers"), "tabLabel"),
  getScene: kt,
  isApplicable: wf,
  renderContent: /* @__PURE__ */ l(({ app: t, scene: n, tab: e }) => yf(t, e, n), "renderContent"),
  logger: {
    log: k,
    group: mi,
    groupEnd: cn
  }
});
function pf() {
  return k("Registering SceneConfig render hook"), mf.register();
}
l(pf, "registerSceneConfigHook");
function yf(t, n, e) {
  if (!(n instanceof HTMLElement)) return;
  const i = Ge(e) ? e : kt(t);
  Zr(t, n, i);
  const r = Xs(() => {
    Zr(t, n, i);
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
l(yf, "renderTimeTriggerTab");
async function Zr(t, n, e) {
  var r, a;
  const i = e ?? kt(t);
  mi("renderTimeTriggersTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!Ge(i)) {
      const X = w(
        "EIDOLON.TimeTrigger.Unavailable",
        "Time triggers are unavailable for this configuration sheet."
      );
      n.innerHTML = `<p class="notes">${X}</p>`, k("Scene lacks document for time triggers", { sceneId: (i == null ? void 0 : i.id) ?? null });
      return;
    }
    const o = `flags.${T}.${Jr}`, s = `flags.${T}.${No}`, c = `flags.${T}.${ko}`, u = !!i.getFlag(T, Jr), d = !!i.getFlag(T, No), g = !!i.getFlag(T, ko), p = ri(i);
    k("Rendering time trigger list", {
      sceneId: i.id,
      isActive: u,
      shouldHideWindow: d,
      shouldShowPlayerWindow: g,
      triggerCount: p.length
    });
    const b = w("EIDOLON.TimeTrigger.Activate", "Activate Time Trigger"), y = w(
      "EIDOLON.TimeTrigger.Description",
      "Enable scene time triggers so scheduled actions can run automatically."
    ), m = w(
      "EIDOLON.TimeTrigger.HideWindowLabel",
      "Hide Floating Time Window"
    ), v = w(
      "EIDOLON.TimeTrigger.HideWindowDescription",
      "Keep the floating time control window hidden while leaving time triggers active."
    ), E = w(
      "EIDOLON.TimeTrigger.ShowPlayerWindowLabel",
      "Share Floating Time Window with Players"
    ), C = w(
      "EIDOLON.TimeTrigger.ShowPlayerWindowDescription",
      "Let non-GM players see the floating time window (without time controls)."
    ), M = w(
      "EIDOLON.TimeTrigger.TriggerListLabel",
      "Scene Time Triggers"
    ), D = w(
      "EIDOLON.TimeTrigger.TriggerListEmpty",
      "No time triggers configured for this scene."
    ), F = w("EIDOLON.TimeTrigger.AddTrigger", "Add Trigger"), P = w("EIDOLON.TimeTrigger.EditTrigger", "Edit"), H = w("EIDOLON.TimeTrigger.DeleteTrigger", "Remove"), ne = w("EIDOLON.TimeTrigger.TriggerNow", "Trigger Now"), ie = w("EIDOLON.TimeTrigger.AtLabel", "At"), V = w("EIDOLON.TimeTrigger.DoLabel", "Do"), K = w("EIDOLON.TimeTrigger.MissingTime", "(No time set)"), _ = p.map((X, U) => {
      const A = (X.time ? sf(X.time) : "") || X.time || "" || K, x = Zd(X.action), q = [
        `${ie} ${A}`,
        `${V} ${x}`,
        ...ef(X)
      ];
      return {
        index: U,
        summaryParts: q,
        tooltips: {
          triggerNow: ne,
          edit: P,
          delete: H
        }
      };
    }), z = ((a = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : a.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof z != "function") {
      console.error(`${T} | renderTemplate is unavailable; cannot render scene tab.`), n.innerHTML = `<p class="notes">${D}</p>`;
      return;
    }
    let G = "";
    try {
      G = await z(hf, {
        flags: {
          active: o,
          hideWindow: s,
          showPlayerWindow: c
        },
        states: {
          isActive: u,
          hideWindow: d,
          showPlayerWindow: g
        },
        labels: {
          activate: b,
          hideWindow: m,
          showPlayerWindow: E,
          triggerList: M,
          empty: D,
          add: F
        },
        hints: {
          activate: y,
          hideWindow: v,
          showPlayerWindow: C
        },
        triggers: _,
        hasTriggers: _.length > 0
      });
    } catch (X) {
      console.error(`${T} | Failed to render time trigger scene tab template`, X), n.innerHTML = `<p class="notes">${D}</p>`;
      return;
    }
    n.innerHTML = G, bf(t, n, i);
  } finally {
    cn();
  }
}
l(Zr, "renderTimeTriggersTabContent");
function bf(t, n, e) {
  const i = e ?? kt(t);
  if (!Ge(i)) return;
  const r = n.querySelector('[data-action="add-trigger"]');
  r && r.addEventListener("click", () => {
    k("Add trigger button clicked", { sceneId: i.id }), Dl(t, { scene: i });
  }), n.querySelectorAll('[data-action="edit-trigger"]').forEach((a) => {
    a.addEventListener("click", () => {
      const o = Number(a.dataset.index);
      if (!Number.isInteger(o)) return;
      const c = ri(i)[o];
      c && (k("Edit trigger button clicked", { sceneId: i.id, triggerId: c.id, index: o }), Dl(t, { trigger: c, triggerIndex: o, scene: i }));
    });
  }), n.querySelectorAll('[data-action="delete-trigger"]').forEach((a) => {
    a.addEventListener("click", async () => {
      var u, d;
      const o = Number(a.dataset.index);
      if (!Number.isInteger(o)) return;
      const s = ri(i), c = s[o];
      if (c) {
        s.splice(o, 1);
        try {
          k("Deleting trigger", {
            sceneId: i.id,
            index: o,
            triggerId: (c == null ? void 0 : c.id) ?? null
          }), await Lc(i, s), await Zr(t, n, i);
        } catch (g) {
          console.error(`${T} | Failed to delete time trigger`, g), (d = (u = ui.notifications) == null ? void 0 : u.error) == null || d.call(
            u,
            w(
              "EIDOLON.TimeTrigger.TriggerDeleteError",
              "Failed to remove the selected time trigger."
            )
          );
        }
      }
    });
  }), n.querySelectorAll('[data-action="fire-trigger"]').forEach((a) => {
    a.addEventListener("click", async () => {
      var u, d, g, p, b, y, m;
      const o = Number(a.dataset.index);
      if (!Number.isInteger(o)) return;
      const c = ri(i)[o];
      if (c) {
        if (!((u = game.user) != null && u.isGM)) {
          (g = (d = ui.notifications) == null ? void 0 : d.warn) == null || g.call(
            d,
            w("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time.")
          );
          return;
        }
        try {
          k("Manually firing trigger", { sceneId: i.id, triggerId: c.id, index: o }), await Ic(i, c), (b = (p = ui.notifications) == null ? void 0 : p.info) == null || b.call(
            p,
            w(
              "EIDOLON.TimeTrigger.TriggerNowSuccess",
              "Triggered the selected time trigger."
            )
          );
        } catch (v) {
          console.error(`${T} | Failed to execute time trigger manually`, v), (m = (y = ui.notifications) == null ? void 0 : y.error) == null || m.call(
            y,
            w(
              "EIDOLON.TimeTrigger.TriggerNowError",
              "Failed to execute the selected time trigger."
            )
          ), k("Manual trigger execution failed", {
            sceneId: i.id,
            triggerId: c.id,
            index: o,
            message: (v == null ? void 0 : v.message) ?? String(v)
          });
        }
      }
    });
  });
}
l(bf, "bindTimeTriggerTabEvents");
function Dl(t, n = {}) {
  var o;
  const e = n.scene ?? null, i = e && Ge(e) ? e : kt(t);
  if (!Ge(i)) {
    console.warn(`${T} | Unable to open trigger form because no scene document is available.`);
    return;
  }
  k("Opening trigger form", {
    sceneId: i.id,
    triggerId: ((o = n.trigger) == null ? void 0 : o.id) ?? null,
    index: Number.isInteger(n.triggerIndex) ? Number(n.triggerIndex) : null
  }), gf({
    scene: i,
    trigger: n.trigger ?? null,
    triggerIndex: n.triggerIndex ?? null,
    onSave: /* @__PURE__ */ l(() => {
      var c, u;
      const s = (u = (c = t.element) == null ? void 0 : c[0]) == null ? void 0 : u.querySelector('.tab[data-tab="time-triggers"]');
      s && Zr(t, s, i);
    }, "onSave")
  }).render({ force: !0 });
}
l(Dl, "openTriggerForm");
function wf(t, n) {
  var a, o, s, c, u;
  if (!t) return !1;
  const e = ((o = (a = foundry == null ? void 0 : foundry.applications) == null ? void 0 : a.sheets) == null ? void 0 : o.SceneConfig) ?? (globalThis == null ? void 0 : globalThis.SceneConfig);
  if (e && t instanceof e) return !0;
  const i = (s = t == null ? void 0 : t.constructor) == null ? void 0 : s.name;
  if (typeof i == "string" && i.includes("SceneConfig")) return !0;
  if (n) {
    const d = globalThis == null ? void 0 : globalThis.Scene;
    if (d && n instanceof d || (n == null ? void 0 : n.documentName) === "Scene" || (n == null ? void 0 : n.documentName) === "scenes" || (n == null ? void 0 : n.collection) === "scenes") return !0;
  }
  const r = ((c = t == null ? void 0 : t.options) == null ? void 0 : c.baseApplication) ?? ((u = t == null ? void 0 : t.options) == null ? void 0 : u.id);
  return !!(typeof r == "string" && r.includes("SceneConfig"));
}
l(wf, "isRecognizedSceneConfig");
const vr = new Yo(), $l = new Qo();
function vf() {
  k("Registering time trigger hooks"), Hooks.once("init", () => {
    Ud(), Kd(), k("Time trigger settings registered during init");
  }), pf(), k("Scene config hook registered"), $l.registerHooks(), k("Time automation hooks registered"), Hooks.once("ready", () => {
    Yd(), k("Ready hook fired"), vr.onReady(), $l.initialize();
  }), Hooks.on("canvasReady", (t) => {
    var n;
    k("canvasReady hook received", { scene: ((n = t == null ? void 0 : t.scene) == null ? void 0 : n.id) ?? null }), vr.onCanvasReady(t);
  }), Hooks.on("updateScene", (t) => {
    k("updateScene hook received", { scene: (t == null ? void 0 : t.id) ?? null }), vr.onUpdateScene(t);
  }), Hooks.on("updateWorldTime", (t, n) => {
    k("updateWorldTime hook received", { worldTime: t, diff: n }), vr.onUpdateWorldTime(t, n);
  });
}
l(vf, "registerTimeTriggerHooks");
vf();
const Ie = T, Kc = "criteria", el = "state", Ef = "criteriaVersion", Tf = 1, Yc = "enableCriteriaSurfaces";
let Fl = !1;
function Cf() {
  var t;
  if (!Fl) {
    if (Fl = !0, !((t = game == null ? void 0 : game.settings) != null && t.register)) {
      console.warn(`${Ie} | game.settings.register unavailable; scene criteria setting skipped.`);
      return;
    }
    game.settings.register(Ie, Yc, {
      name: w("EIDOLON.SceneCriteria.EnableSurfacesSettingName", "Enable Criteria Editor Surfaces"),
      hint: w(
        "EIDOLON.SceneCriteria.EnableSurfacesSettingHint",
        "Show criteria authoring surfaces (Scene > Criteria tab and tile/light editor controls). The Criteria Switcher remains available."
      ),
      scope: "world",
      config: !0,
      type: Boolean,
      default: !0,
      onChange: /* @__PURE__ */ l(() => {
        Sf();
      }, "onChange")
    });
  }
}
l(Cf, "registerSceneCriteriaSettings");
function Xa() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return !!game.settings.get(Ie, Yc);
  } catch (n) {
    console.error(`${Ie} | Failed to read criteria surfaces setting`, n);
  }
  return !0;
}
l(Xa, "getCriteriaSurfacesEnabled");
function Sf() {
  var a, o, s, c, u;
  const t = w("EIDOLON.SceneCriteria.ReloadPromptTitle", "Reload Required"), n = `<p>${w(
    "EIDOLON.SceneCriteria.ReloadPromptBody",
    "Changes to criteria editor surfaces require a reload. Reload now?"
  )}</p>`, e = typeof ((a = foundry == null ? void 0 : foundry.utils) == null ? void 0 : a.debouncedReload) == "function", i = /* @__PURE__ */ l(() => {
    e ? foundry.utils.debouncedReload() : window.location.reload();
  }, "reload"), r = (s = (o = foundry == null ? void 0 : foundry.applications) == null ? void 0 : o.api) == null ? void 0 : s.DialogV2;
  if (typeof (r == null ? void 0 : r.confirm) == "function") {
    r.confirm({
      window: { title: t },
      content: n
    }).then((d) => {
      d && i();
    });
    return;
  }
  if (typeof (Dialog == null ? void 0 : Dialog.confirm) == "function") {
    Dialog.confirm({
      title: t,
      content: n,
      yes: /* @__PURE__ */ l(() => i(), "yes"),
      no: /* @__PURE__ */ l(() => {
      }, "no")
    });
    return;
  }
  (u = (c = ui.notifications) == null ? void 0 : c.info) == null || u.call(
    c,
    w(
      "EIDOLON.SceneCriteria.ReloadNotice",
      "Please reload the world to apply criteria editor surface changes."
    )
  );
}
l(Sf, "promptReloadForCriteriaSurfaces");
const ea = "Standard";
function lt(t) {
  var e;
  const n = (e = t == null ? void 0 : t.getFlag) == null ? void 0 : e.call(t, Ie, Kc);
  return n ? Qc(n) : [];
}
l(lt, "getSceneCriteria");
async function Za(t, n) {
  if (!(t != null && t.setFlag)) return;
  const e = Qc(n);
  await t.setFlag(Ie, Kc, e), await t.setFlag(Ie, Ef, Tf);
  const i = ur(t, e);
  await t.setFlag(Ie, el, i);
}
l(Za, "setSceneCriteria");
function ur(t, n = null) {
  var r;
  const e = Array.isArray(n) ? n : lt(t), i = Nt(((r = t == null ? void 0 : t.getFlag) == null ? void 0 : r.call(t, Ie, el)) ?? {});
  return nl(i, e);
}
l(ur, "getSceneCriteriaState");
async function Lf(t, n, e = null) {
  if (!(t != null && t.setFlag)) return;
  const i = Array.isArray(e) ? e : lt(t), r = nl(n, i);
  await t.setFlag(Ie, el, r);
}
l(Lf, "setSceneCriteriaState");
function tl(t = "") {
  const n = typeof t == "string" ? t.trim() : "", e = Xc(ss(n || "criterion"), /* @__PURE__ */ new Set());
  return {
    id: Zc(),
    key: e,
    label: n,
    values: [ea],
    default: ea,
    order: 0
  };
}
l(tl, "createSceneCriterion");
function Qc(t) {
  const n = Array.isArray(t) ? Nt(t) : [], e = [], i = /* @__PURE__ */ new Set();
  return n.forEach((r, a) => {
    const o = os(r, a, i);
    o && (e.push(o), i.add(o.key));
  }), e;
}
l(Qc, "sanitizeCriteria$1");
function os(t, n = 0, e = /* @__PURE__ */ new Set()) {
  if (!t || typeof t != "object") return null;
  const i = typeof t.id == "string" && t.id.trim() ? t.id.trim() : Zc(), a = (typeof t.label == "string" ? t.label : typeof t.name == "string" ? t.name : "").trim(), o = typeof t.key == "string" && t.key.trim() ? ss(t.key) : ss(a || `criterion-${Number(n) + 1}`), s = Xc(o, e), c = Of(t.values);
  let u = typeof t.default == "string" ? t.default.trim() : "";
  u || (u = c[0] ?? ea), c.includes(u) || c.unshift(u);
  const d = Number.isFinite(t.order) ? Number(t.order) : Number(n);
  return {
    id: i,
    key: s,
    label: a,
    values: c,
    default: u,
    order: d
  };
}
l(os, "sanitizeCriterion");
function nl(t, n = []) {
  const e = t && typeof t == "object" ? Nt(t) : {}, i = {};
  for (const r of n) {
    const a = e == null ? void 0 : e[r.key], o = typeof a == "string" ? a.trim() : "";
    o && r.values.includes(o) ? i[r.key] = o : i[r.key] = r.default;
  }
  return i;
}
l(nl, "sanitizeSceneCriteriaState");
function If(t) {
  return lt(t).map((e) => ({
    id: e.key,
    key: e.key,
    name: e.label,
    values: [...e.values]
  }));
}
l(If, "getSceneCriteriaCategories");
function Of(t) {
  const n = Array.isArray(t) ? t : [], e = [];
  for (const i of n) {
    if (typeof i != "string") continue;
    const r = i.trim();
    !r || e.includes(r) || e.push(r);
  }
  return e.length || e.push(ea), e;
}
l(Of, "sanitizeCriterionValues");
function ss(t) {
  return String(t ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
l(ss, "slugifyCriterionKey");
function Xc(t, n) {
  if (!n.has(t)) return t;
  let e = 2;
  for (; n.has(`${t}-${e}`); )
    e += 1;
  return `${t}-${e}`;
}
l(Xc, "ensureUniqueCriterionKey");
function Zc() {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 11);
}
l(Zc, "generateCriterionId");
function eu(t) {
  var n, e;
  console.error(`${Ie} | Failed to persist scene criteria`, t), (e = (n = ui.notifications) == null ? void 0 : n.error) == null || e.call(
    n,
    w(
      "EIDOLON.SceneCriteria.PersistError",
      "Failed to persist the scene criteria."
    )
  );
}
l(eu, "notifyPersistError");
var gc, be, Ht, _e, tu, qa, Ba, ja, Ua, Fr, Va, zi, Gi, ki, nu;
const _t = class _t extends bn(yn) {
  constructor(e = {}) {
    const { scene: i, criterion: r, isNew: a, onSave: o, ...s } = e ?? {};
    super(s);
    N(this, _e);
    N(this, be, null);
    N(this, Ht, !1);
    N(this, qa, /* @__PURE__ */ l(async (e) => {
      e.preventDefault();
      const i = e.currentTarget;
      if (!(i instanceof HTMLFormElement)) return;
      const r = new FormData(i), a = String(r.get("criterionLabel") ?? "").trim(), o = String(r.get("criterionKey") ?? "").trim(), s = Array.from(i.querySelectorAll('[name="criterionValues"]')).map((g) => g instanceof HTMLInputElement ? g.value.trim() : "").filter((g, p, b) => g && b.indexOf(g) === p), u = String(r.get("criterionDefault") ?? "").trim() || s[0] || "Standard", d = os(
        {
          id: f(this, be).id,
          key: o,
          label: a,
          values: s,
          default: u,
          order: Number(f(this, be).order ?? 0)
        },
        0,
        /* @__PURE__ */ new Set()
      );
      d && (L(this, be, d), await h(this, _e, nu).call(this), this.close());
    }, "#onSubmit"));
    N(this, Ba, /* @__PURE__ */ l((e) => {
      var o;
      if (f(this, Ht)) return;
      const i = e.currentTarget, r = (i == null ? void 0 : i.form) ?? ((o = this.element) == null ? void 0 : o.querySelector("form"));
      if (!(r instanceof HTMLFormElement)) return;
      const a = r.querySelector('input[name="criterionKey"]');
      a instanceof HTMLInputElement && (a.value = Ii(i.value));
    }, "#onLabelInput"));
    N(this, ja, /* @__PURE__ */ l((e) => {
      var c;
      const i = e.currentTarget, r = (i == null ? void 0 : i.form) ?? ((c = this.element) == null ? void 0 : c.querySelector("form"));
      if (!(r instanceof HTMLFormElement) || !(i instanceof HTMLInputElement)) return;
      const a = r.querySelector('input[name="criterionLabel"]'), o = Ii(a instanceof HTMLInputElement ? a.value : ""), s = Ii(i.value);
      L(this, Ht, s !== o), i.value = s, h(this, _e, Fr).call(this, r);
    }, "#onKeyInput"));
    N(this, Ua, /* @__PURE__ */ l((e) => {
      var o, s;
      e.preventDefault();
      const i = ((o = e.currentTarget) == null ? void 0 : o.form) ?? ((s = this.element) == null ? void 0 : s.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector('input[name="criterionLabel"]'), a = i.querySelector('input[name="criterionKey"]');
      a instanceof HTMLInputElement && (a.value = Ii(r instanceof HTMLInputElement ? r.value : ""), L(this, Ht, !1), h(this, _e, Fr).call(this, i));
    }, "#onResetAutoKey"));
    N(this, Va, /* @__PURE__ */ l((e) => {
      var c, u, d, g, p, b;
      e.preventDefault();
      const i = ((c = e.currentTarget) == null ? void 0 : c.form) ?? ((u = this.element) == null ? void 0 : u.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector(".scene-criterion-editor__values");
      if (!(r instanceof HTMLElement)) return;
      (d = r.querySelector(".scene-criterion-editor__empty")) == null || d.remove();
      const a = document.createElement("div");
      a.classList.add("scene-criterion-editor__value");
      const o = At(w("EIDOLON.SceneCriteria.ValuePlaceholder", "Allowed value")), s = At(w("EIDOLON.SceneCriteria.RemoveValue", "Remove Value"));
      a.innerHTML = `
      <input type="text" name="criterionValues" value="" placeholder="${o}" class="form-control">
      <button type="button" class="icon" data-action="remove-value" aria-label="${s}" title="${s}">
        <i class="fa-solid fa-trash"></i>
      </button>
    `, r.appendChild(a), (g = a.querySelector('[data-action="remove-value"]')) == null || g.addEventListener("click", f(this, zi)), (p = a.querySelector('input[name="criterionValues"]')) == null || p.addEventListener("input", f(this, Gi)), h(this, _e, ki).call(this, i), (b = a.querySelector('input[name="criterionValues"]')) == null || b.focus();
    }, "#onAddValue"));
    N(this, zi, /* @__PURE__ */ l((e) => {
      var a, o, s, c;
      e.preventDefault(), (o = (a = e.currentTarget) == null ? void 0 : a.closest(".scene-criterion-editor__value")) == null || o.remove();
      const i = ((s = e.currentTarget) == null ? void 0 : s.form) ?? ((c = this.element) == null ? void 0 : c.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector(".scene-criterion-editor__values");
      if (r instanceof HTMLElement) {
        if (!r.querySelector(".scene-criterion-editor__value")) {
          const u = document.createElement("p");
          u.classList.add("notes", "scene-criterion-editor__empty"), u.textContent = w(
            "EIDOLON.SceneCriteria.ValueListEmpty",
            "No values have been added to this criterion."
          ), r.appendChild(u);
        }
        h(this, _e, ki).call(this, i);
      }
    }, "#onRemoveValue"));
    N(this, Gi, /* @__PURE__ */ l((e) => {
      var r, a;
      const i = ((r = e.currentTarget) == null ? void 0 : r.form) ?? ((a = this.element) == null ? void 0 : a.querySelector("form"));
      i instanceof HTMLFormElement && h(this, _e, ki).call(this, i);
    }, "#onValuesChanged"));
    this.scene = i ?? null, this.criterion = r ?? null, this.onSave = typeof o == "function" ? o : null, this.isNew = !!a, L(this, be, h(this, _e, tu).call(this)), L(this, Ht, f(this, be).key !== Ii(f(this, be).label));
  }
  async _prepareContext() {
    var i, r, a, o;
    const e = Array.isArray((i = f(this, be)) == null ? void 0 : i.values) ? f(this, be).values : [];
    return {
      isNew: this.isNew,
      key: ((r = f(this, be)) == null ? void 0 : r.key) ?? "",
      label: ((a = f(this, be)) == null ? void 0 : a.label) ?? "",
      defaultValue: ((o = f(this, be)) == null ? void 0 : o.default) ?? "",
      values: e.map((s, c) => {
        var u;
        return {
          index: c,
          value: s,
          selected: s === ((u = f(this, be)) == null ? void 0 : u.default)
        };
      }),
      hasValues: e.length > 0,
      labels: {
        label: w("EIDOLON.SceneCriteria.CategoryNameLabel", "Criterion Label"),
        key: w("EIDOLON.SceneCriteria.CriteriaKey", "Key"),
        values: w("EIDOLON.SceneCriteria.ValuesLabel", "Allowed Values"),
        default: w("EIDOLON.SceneCriteria.DefaultValue", "Default Value"),
        empty: w(
          "EIDOLON.SceneCriteria.ValueListEmpty",
          "No values have been added to this criterion."
        ),
        addValue: w("EIDOLON.SceneCriteria.AddValue", "Add Value"),
        removeValue: w("EIDOLON.SceneCriteria.RemoveValue", "Remove Value"),
        valuePlaceholder: w("EIDOLON.SceneCriteria.ValuePlaceholder", "Allowed value"),
        resetAutoKey: w("EIDOLON.SceneCriteria.ResetAutoKey", "Reset to Auto"),
        save: this.isNew ? w("EIDOLON.SceneCriteria.CreateCategory", "Add Criterion") : w("EIDOLON.SceneCriteria.SaveCategory", "Save Criterion"),
        cancel: w("EIDOLON.SceneCriteria.CancelEdit", "Cancel")
      },
      keyIsCustom: f(this, Ht)
    };
  }
  _onRender(e, i) {
    var a, o, s, c, u, d;
    super._onRender(e, i);
    const r = (a = this.element) == null ? void 0 : a.querySelector("form");
    r && (r.addEventListener("submit", f(this, qa)), (o = r.querySelector('[data-action="add-value"]')) == null || o.addEventListener("click", f(this, Va)), (s = r.querySelector('input[name="criterionLabel"]')) == null || s.addEventListener("input", f(this, Ba)), (c = r.querySelector('input[name="criterionKey"]')) == null || c.addEventListener("input", f(this, ja)), (u = r.querySelector('[data-action="reset-auto-key"]')) == null || u.addEventListener("click", f(this, Ua)), r.querySelectorAll('[data-action="remove-value"]').forEach((g) => {
      g.addEventListener("click", f(this, zi));
    }), r.querySelectorAll('input[name="criterionValues"]').forEach((g) => {
      g.addEventListener("input", f(this, Gi));
    }), (d = r.querySelector('[data-action="cancel"]')) == null || d.addEventListener("click", (g) => {
      g.preventDefault(), this.close();
    }), h(this, _e, Fr).call(this, r), h(this, _e, ki).call(this, r));
  }
};
be = new WeakMap(), Ht = new WeakMap(), _e = new WeakSet(), tu = /* @__PURE__ */ l(function() {
  const e = os(this.criterion, 0, /* @__PURE__ */ new Set()) ?? tl(w("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion"));
  return {
    id: e.id,
    key: e.key,
    label: e.label ?? "",
    values: Array.isArray(e.values) ? [...e.values] : [],
    default: e.default
  };
}, "#initializeState"), qa = new WeakMap(), Ba = new WeakMap(), ja = new WeakMap(), Ua = new WeakMap(), Fr = /* @__PURE__ */ l(function(e) {
  const i = e.querySelector('[data-action="reset-auto-key"]');
  i instanceof HTMLButtonElement && (i.disabled = !f(this, Ht));
}, "#syncAutoKeyButton"), Va = new WeakMap(), zi = new WeakMap(), Gi = new WeakMap(), ki = /* @__PURE__ */ l(function(e) {
  var c, u;
  const i = e.querySelector('select[name="criterionDefault"]');
  if (!(i instanceof HTMLSelectElement)) return;
  const r = ((u = (c = i.value) == null ? void 0 : c.trim) == null ? void 0 : u.call(c)) ?? "", a = Array.from(e.querySelectorAll('input[name="criterionValues"]')).map((d) => d instanceof HTMLInputElement ? d.value.trim() : "").filter((d, g, p) => d && p.indexOf(d) === g), o = i.dataset.emptyLabel || w("EIDOLON.SceneCriteria.ValueListEmpty", "No values have been added to this criterion.");
  if (i.innerHTML = "", !a.length) {
    const d = document.createElement("option");
    d.value = "", d.textContent = o, d.selected = !0, i.appendChild(d);
    return;
  }
  const s = a.includes(r) ? r : a[0];
  for (const d of a) {
    const g = document.createElement("option");
    g.value = d, g.textContent = d, g.selected = d === s, i.appendChild(g);
  }
}, "#syncDefaultOptions"), nu = /* @__PURE__ */ l(async function() {
  if (!this.scene) return;
  const e = lt(this.scene).sort((r, a) => r.order - a.order), i = e.findIndex((r) => r.id === f(this, be).id);
  i < 0 ? (f(this, be).order = e.length, e.push(f(this, be))) : (f(this, be).order = e[i].order, e.splice(i, 1, f(this, be)));
  try {
    await Za(this.scene, e), this.onSave && await this.onSave(f(this, be));
  } catch (r) {
    eu(r);
  }
}, "#persist"), l(_t, "CategoryEditorApplication"), Ce(_t, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Re(_t, _t, "DEFAULT_OPTIONS"),
  {
    id: `${Ie}-criterion-editor`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((gc = Re(_t, _t, "DEFAULT_OPTIONS")) == null ? void 0 : gc.classes) ?? [], "standard-form", "themed"])
    ),
    window: {
      title: w("EIDOLON.SceneCriteria.EditCategory", "Edit Criterion"),
      resizable: !1
    },
    position: {
      width: 460,
      height: "auto"
    }
  },
  { inplace: !1 }
)), Ce(_t, "PARTS", {
  content: {
    template: `modules/${Ie}/templates/scene-criteria-editor.html`
  }
});
let ls = _t;
function Ii(t) {
  return String(t ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
l(Ii, "slugifyKey");
const Af = `modules/${Ie}/templates/scene-criteria-tab.html`, cs = {
  log: /* @__PURE__ */ l((...t) => {
    var n;
    return (n = console.debug) == null ? void 0 : n.call(console, `${Ie} | Criteria`, ...t);
  }, "log"),
  group: /* @__PURE__ */ l((...t) => {
    var n;
    return (n = console.groupCollapsed) == null ? void 0 : n.call(console, `${Ie} | Criteria`, ...t);
  }, "group"),
  groupEnd: /* @__PURE__ */ l(() => {
    var t;
    return (t = console.groupEnd) == null ? void 0 : t.call(console);
  }, "groupEnd")
}, Mf = Qa(ls), Nf = Jc({
  tabId: "criteria",
  tabLabel: /* @__PURE__ */ l(() => w("EIDOLON.SceneCriteria.TabLabel", "Criteria"), "tabLabel"),
  getScene: kt,
  isApplicable: /* @__PURE__ */ l(() => Xa(), "isApplicable"),
  renderContent: /* @__PURE__ */ l(({ app: t, tab: n, scene: e }) => xf(t, n, e), "renderContent"),
  logger: cs
});
function kf() {
  return Nf.register();
}
l(kf, "registerSceneCriteriaConfigHook");
function xf(t, n, e) {
  if (!(n instanceof HTMLElement)) return;
  const i = Ge(e) ? e : kt(t);
  Xn(t, n, i);
}
l(xf, "renderCriteriaTab");
async function Xn(t, n, e) {
  var r, a;
  const i = e ?? kt(t);
  cs.group("renderCriteriaTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!Ge(i)) {
      const d = w(
        "EIDOLON.SceneCriteria.Unavailable",
        "Scene criteria are unavailable for this configuration sheet."
      );
      n.innerHTML = `<p class="notes">${d}</p>`;
      return;
    }
    const o = lt(i).sort((d, g) => d.order - g.order), s = ur(i, o), c = ((a = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : a.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof c != "function") {
      n.innerHTML = `<p class="notes">${w("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
      return;
    }
    const u = await c(Af, {
      description: w(
        "EIDOLON.SceneCriteria.Description",
        "Define scene criteria dimensions and allowed values used by matching rules."
      ),
      labels: {
        list: w("EIDOLON.SceneCriteria.CategoryListLabel", "Scene Criteria"),
        empty: w(
          "EIDOLON.SceneCriteria.CategoryListEmpty",
          "No criteria configured for this scene."
        ),
        add: w("EIDOLON.SceneCriteria.AddCategory", "Add Criterion"),
        edit: w("EIDOLON.SceneCriteria.EditCategory", "Edit Criterion"),
        remove: w("EIDOLON.SceneCriteria.RemoveCategory", "Remove Criterion"),
        moveUp: w("EIDOLON.SceneCriteria.MoveUp", "Move Up"),
        moveDown: w("EIDOLON.SceneCriteria.MoveDown", "Move Down"),
        values: w("EIDOLON.SceneCriteria.ValuesLabel", "Allowed Values"),
        unnamed: w("EIDOLON.SceneCriteria.UnnamedCategory", "Unnamed Criterion")
      },
      summary: {
        criteriaCount: o.length,
        valueCount: o.reduce((d, g) => d + g.values.length, 0)
      },
      criteria: o.map((d, g) => {
        var p, b;
        return {
          id: d.id,
          label: d.label,
          displayName: ((b = (p = d.label) == null ? void 0 : p.trim) == null ? void 0 : b.call(p)) || w("EIDOLON.SceneCriteria.UnnamedCategory", "Unnamed Criterion"),
          hasValues: d.values.length > 0,
          values: d.values.map((y) => ({
            value: y,
            isCurrent: (s[d.key] ?? d.default) === y
          })),
          valueCountLabel: $f(d.values.length),
          canMoveUp: g > 0,
          canMoveDown: g < o.length - 1
        };
      }),
      hasCriteria: o.length > 0
    });
    n.innerHTML = u, Df(t, n, i);
  } catch (o) {
    console.error(`${Ie} | Failed to render criteria tab`, o), n.innerHTML = `<p class="notes">${w("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
  } finally {
    cs.groupEnd();
  }
}
l(Xn, "renderCriteriaTabContent");
function Df(t, n, e) {
  const i = e ?? kt(t);
  if (!Ge(i)) return;
  const r = n.querySelector('[data-criteria-action="add"]');
  r && r.addEventListener("click", () => {
    _l(t, {
      scene: i,
      criterion: tl(
        w("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion")
      ),
      isNew: !0,
      onSave: /* @__PURE__ */ l(() => Xn(t, n, i), "onSave")
    });
  }), n.querySelectorAll('[data-criteria-action="edit"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", () => {
      const s = lt(i).find((c) => c.id === o);
      s && _l(t, {
        scene: i,
        criterion: s,
        onSave: /* @__PURE__ */ l(() => Xn(t, n, i), "onSave")
      });
    });
  }), n.querySelectorAll('[data-criteria-action="remove"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await vo(i, (c) => {
        const u = c.findIndex((d) => d.id === o);
        return u < 0 ? !1 : (c.splice(u, 1), Eo(c), !0);
      }) && await Xn(t, n, i);
    });
  }), n.querySelectorAll('[data-criteria-action="move-up"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await vo(i, (c) => {
        const u = c.findIndex((g) => g.id === o);
        if (u <= 0) return !1;
        const [d] = c.splice(u, 1);
        return c.splice(u - 1, 0, d), Eo(c), !0;
      }) && await Xn(t, n, i);
    });
  }), n.querySelectorAll('[data-criteria-action="move-down"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await vo(i, (c) => {
        const u = c.findIndex((g) => g.id === o);
        if (u < 0 || u >= c.length - 1) return !1;
        const [d] = c.splice(u, 1);
        return c.splice(u + 1, 0, d), Eo(c), !0;
      }) && await Xn(t, n, i);
    });
  });
}
l(Df, "bindCriteriaTabEvents");
async function vo(t, n) {
  const e = lt(t).sort((r, a) => r.order - a.order);
  if (n(e) === !1) return !1;
  try {
    return await Za(t, e), !0;
  } catch (r) {
    return eu(r), !1;
  }
}
l(vo, "mutateCriteria");
function _l(t, n = {}) {
  const e = n.scene ?? null, i = e && Ge(e) ? e : kt(t);
  if (!Ge(i))
    return;
  Mf({
    scene: i,
    criterion: n.criterion ?? null,
    isNew: !!n.isNew,
    onSave: typeof n.onSave == "function" ? n.onSave : null
  }).render({ force: !0 });
}
l(_l, "openCriterionEditor");
function Eo(t) {
  t.forEach((n, e) => {
    n.order = e;
  });
}
l(Eo, "reindexCriteriaOrder");
function $f(t) {
  var n, e;
  if ((e = (n = game.i18n) == null ? void 0 : n.has) != null && e.call(n, "EIDOLON.SceneCriteria.ValueCountLabel"))
    try {
      return game.i18n.format("EIDOLON.SceneCriteria.ValueCountLabel", { count: t });
    } catch (i) {
      console.error(`${Ie} | Failed to format value count label`, i);
    }
  return t === 0 ? "No values configured" : t === 1 ? "1 value" : `${t} values`;
}
l($f, "formatValueCount");
let Pl = !1;
function Ff() {
  Hooks.once("init", () => {
    Cf();
  }), Hooks.once("ready", () => {
    Xa() && (Pl || (kf(), Pl = !0));
  });
}
l(Ff, "registerSceneCriteriaHooks");
Ff();
const ae = T, iu = "criteriaEngineVersion", qn = "fileIndex", Bn = "tileCriteria", il = {
  LEGACY: 1,
  CRITERIA: 2
}, ru = il.CRITERIA;
function au(t) {
  var n;
  return ((n = t == null ? void 0 : t.getFlag) == null ? void 0 : n.call(t, ae, iu)) ?? il.LEGACY;
}
l(au, "getSceneEngineVersion");
function _f(t, n, e, i, r) {
  if (!(t != null && t.length) || !(e != null && e.length)) return -1;
  const a = {};
  for (const s of e)
    a[s] = n[s];
  const o = Rl(t, a, e);
  if (o >= 0) return o;
  if (i != null && i.length && r) {
    const s = { ...a };
    for (const c of i) {
      if (!(c in s)) continue;
      s[c] = r[c] ?? "Standard";
      const u = Rl(t, s, e);
      if (u >= 0) return u;
    }
  }
  return -1;
}
l(_f, "findBestMatch");
function Rl(t, n, e) {
  return t.findIndex((i) => {
    for (const r of e)
      if (i[r] !== n[r]) return !1;
    return !0;
  });
}
l(Rl, "findExactMatch");
function Pf(t, n) {
  if (!(t != null && t.length)) return -1;
  let e = -1, i = -1;
  for (let r = 0; r < t.length; r += 1) {
    const a = t[r] ?? {}, o = Object.keys(a);
    if (o.length === 0) {
      i < 0 && (e = r, i = 0);
      continue;
    }
    let s = !0;
    for (const c of o)
      if (a[c] !== n[c]) {
        s = !1;
        break;
      }
    s && o.length > i && (e = r, i = o.length);
  }
  return e;
}
l(Pf, "findFileIndex");
function _r(t) {
  return t && typeof t == "object" && !Array.isArray(t);
}
l(_r, "isPlainObject$2");
function Hl(t) {
  return t == null ? t : typeof structuredClone == "function" ? structuredClone(t) : JSON.parse(JSON.stringify(t));
}
l(Hl, "deepClone");
function Rf(t, n) {
  if (!n) return;
  const e = n.split(".").filter(Boolean);
  if (!e.length) return;
  let i = t;
  for (let r = 0; r < e.length - 1; r += 1) {
    if (!_r(i == null ? void 0 : i[e[r]])) return;
    i = i[e[r]];
  }
  delete i[e.at(-1)];
}
l(Rf, "deletePath");
function ou(t, n) {
  const e = Hl(t ?? {});
  if (!_r(n)) return e;
  for (const [i, r] of Object.entries(n)) {
    if (i.startsWith("-=") && r === !0) {
      Rf(e, i.slice(2));
      continue;
    }
    _r(r) && _r(e[i]) ? e[i] = ou(e[i], r) : e[i] = Hl(r);
  }
  return e;
}
l(ou, "fallbackMerge");
function Hf(t, n) {
  var e, i;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.mergeObject && ((i = foundry == null ? void 0 : foundry.utils) != null && i.deepClone) ? foundry.utils.mergeObject(t, foundry.utils.deepClone(n), {
    inplace: !1
  }) : ou(t, n);
}
l(Hf, "defaultMerge");
function qf(t, n) {
  if (!t) return !0;
  for (const e of Object.keys(t))
    if (t[e] !== n[e]) return !1;
  return !0;
}
l(qf, "criteriaMatch");
function su(t, n, e, i) {
  const r = i ?? Hf;
  let a = r({}, t ?? {});
  if (!(n != null && n.length)) return a;
  const o = [];
  for (let s = 0; s < n.length; s += 1) {
    const c = n[s];
    if (qf(c == null ? void 0 : c.criteria, e)) {
      const u = c != null && c.criteria ? Object.keys(c.criteria).length : 0;
      o.push({ specificity: u, index: s, delta: c == null ? void 0 : c.delta });
    }
  }
  o.sort((s, c) => s.specificity - c.specificity || s.index - c.index);
  for (const s of o)
    s.delta && (a = r(a, s.delta));
  return a;
}
l(su, "resolveRules");
function eo(t = null) {
  var i;
  const n = (game == null ? void 0 : game.user) ?? null;
  if (!n) return !1;
  if (n.isGM) return !0;
  const e = t ?? ((i = game == null ? void 0 : game.scenes) == null ? void 0 : i.viewed) ?? null;
  if (!e) return !1;
  if (typeof e.canUserModify == "function")
    try {
      return !!e.canUserModify(n, "update");
    } catch {
    }
  if (typeof e.testUserPermission == "function")
    try {
      return !!e.testUserPermission(n, "OWNER");
    } catch {
    }
  return !!e.isOwner;
}
l(eo, "canManageCriteria");
function Bf(t = null) {
  if (!eo(t))
    throw new Error(`${ae} | You do not have permission to manage scene criteria.`);
}
l(Bf, "requireCriteriaAccess");
const jf = /* @__PURE__ */ l((...t) => console.log(`${ae} | criteria tiles:`, ...t), "log$1");
let ta = /* @__PURE__ */ new WeakMap(), na = /* @__PURE__ */ new WeakMap();
const ql = 200;
function Uf(t) {
  return t ? Number.isInteger(t.size) ? t.size : Array.isArray(t) || typeof t.length == "number" ? t.length : Array.from(t).length : 0;
}
l(Uf, "getCollectionSize$1");
function Er() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
l(Er, "nowMs$2");
function Vf(t) {
  if (!Array.isArray(t)) return [];
  const n = /* @__PURE__ */ new Set();
  for (const e of t) {
    if (typeof e != "string") continue;
    const i = e.trim();
    i && n.add(i);
  }
  return Array.from(n);
}
l(Vf, "uniqueStringKeys$1");
function zf(t, n = ql) {
  if (!Array.isArray(t) || t.length === 0) return [];
  const e = Number.isInteger(n) && n > 0 ? n : ql, i = [];
  for (let r = 0; r < t.length; r += e)
    i.push(t.slice(r, r + e));
  return i;
}
l(zf, "chunkArray$1");
async function Gf(t, n, e) {
  const i = zf(n, e);
  for (const r of i)
    await t.updateEmbeddedDocuments("Tile", r), i.length > 1 && await Promise.resolve();
  return i.length;
}
l(Gf, "updateTilesInChunks");
function Wf(t) {
  var i;
  const n = Gn(t, { files: null });
  if (!((i = n == null ? void 0 : n.variants) != null && i.length)) return [];
  const e = /* @__PURE__ */ new Set();
  for (const r of n.variants)
    for (const a of Object.keys(r.criteria ?? {}))
      a && e.add(a);
  return Array.from(e);
}
l(Wf, "getTileCriteriaDependencyKeys");
function Jf(t, n) {
  const e = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
  for (const r of n) {
    const a = r.getFlag(ae, Bn) ?? r.getFlag(ae, qn);
    if (a) {
      i.add(r.id);
      for (const o of Wf(a))
        e.has(o) || e.set(o, /* @__PURE__ */ new Set()), e.get(o).add(r.id);
    }
  }
  return {
    collection: n,
    keyToTileIds: e,
    allTileIds: i
  };
}
l(Jf, "buildTileDependencyIndex");
function Kf(t, n) {
  const e = na.get(t);
  if ((e == null ? void 0 : e.collection) === n) return e;
  const i = Jf(t, n);
  return na.set(t, i), i;
}
l(Kf, "getTileDependencyIndex");
function Yf(t, n, e) {
  const i = Vf(e);
  if (!i.length)
    return Array.from(n ?? []);
  const r = Kf(t, n), a = /* @__PURE__ */ new Set();
  for (const o of i) {
    const s = r.keyToTileIds.get(o);
    if (s)
      for (const c of s)
        a.add(c);
  }
  return a.size ? typeof (n == null ? void 0 : n.get) == "function" ? Array.from(a).map((o) => n.get(o)).filter(Boolean) : Array.from(n ?? []).filter((o) => a.has(o.id)) : [];
}
l(Yf, "getTilesForChangedKeys");
function lu(t) {
  return typeof (t == null ? void 0 : t.name) == "string" ? t.name : typeof (t == null ? void 0 : t.src) == "string" ? t.src : "";
}
l(lu, "getFilePath");
function ia(t) {
  if (typeof t != "string") return "";
  const n = t.trim();
  if (!n) return "";
  const e = n.replace(/\\/g, "/");
  try {
    return decodeURIComponent(e);
  } catch {
    return e;
  }
}
l(ia, "normalizeFilePath");
function rl(t) {
  if (!Array.isArray(t)) return [];
  const n = /* @__PURE__ */ new Map();
  return t.map((e, i) => {
    const r = ia(lu(e)), a = r || `__index:${i}`, o = n.get(a) ?? 0;
    n.set(a, o + 1);
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
l(rl, "buildTileFileEntries");
function gn(t, n) {
  if (!Number.isInteger(n) || n < 0) return null;
  const i = rl(t).find((r) => r.index === n);
  return i ? { ...i.target } : { indexHint: n };
}
l(gn, "createTileTargetFromIndex");
function to(t) {
  if (!t || typeof t != "object") return null;
  const n = ia(t.path), e = Number(t.indexHint ?? t.fileIndex), i = Number(t.occurrence), r = {};
  return n && (r.path = n, r.occurrence = Number.isInteger(i) && i >= 0 ? i : 0), Number.isInteger(e) && e >= 0 && (r.indexHint = e), !r.path && !Number.isInteger(r.indexHint) ? null : r;
}
l(to, "normalizeTileTarget");
function Hi(t, n) {
  const e = to(t);
  if (!e) return -1;
  const i = rl(n);
  if (!i.length) return -1;
  if (e.path) {
    const r = i.filter((a) => a.path === e.path);
    if (r.length > 0) {
      const a = Number.isInteger(e.occurrence) ? e.occurrence : 0;
      if (r[a]) return r[a].index;
      if (Number.isInteger(e.indexHint)) {
        const o = r.find((s) => s.index === e.indexHint);
        if (o) return o.index;
      }
      return r[0].index;
    }
  }
  return Number.isInteger(e.indexHint) && e.indexHint < i.length ? e.indexHint : -1;
}
l(Hi, "resolveTileTargetIndex");
function hn(t) {
  if (!t || typeof t != "object" || Array.isArray(t)) return {};
  const n = {};
  for (const [e, i] of Object.entries(t))
    typeof e != "string" || !e || typeof i != "string" || !i.trim() || (n[e] = i.trim());
  return n;
}
l(hn, "sanitizeCriteria");
function Qf(t) {
  return Object.entries(hn(t)).sort(([e], [i]) => e.localeCompare(i)).map(([e, i]) => `${e}=${i}`).join("");
}
l(Qf, "serializeCriteria");
function Xf(t) {
  return Object.keys(hn(t)).length;
}
l(Xf, "getCriteriaSpecificity");
function Zf(t, n) {
  const e = hn(t), i = hn(n);
  for (const [r, a] of Object.entries(e))
    if (r in i && i[r] !== a)
      return !1;
  return !0;
}
l(Zf, "areCriteriaCompatible");
function eg(t, n) {
  const e = Hi(t, n);
  if (Number.isInteger(e) && e >= 0)
    return `index:${e}`;
  const i = to(t);
  if (!i) return "";
  if (i.path) {
    const r = Number.isInteger(i.occurrence) ? i.occurrence : 0;
    return `path:${i.path}#${r}`;
  }
  return Number.isInteger(i.indexHint) ? `hint:${i.indexHint}` : "";
}
l(eg, "getTargetIdentity");
function cu(t, n = {}) {
  var s;
  const e = Array.isArray(n.files) ? n.files : [], i = Gn(t, { files: e });
  if (!((s = i == null ? void 0 : i.variants) != null && s.length))
    return {
      errors: [],
      warnings: []
    };
  const r = i.variants.map((c, u) => ({
    index: u,
    criteria: hn(c.criteria),
    specificity: Xf(c.criteria),
    criteriaSignature: Qf(c.criteria),
    targetIdentity: eg(c.target, e)
  })), a = [], o = [];
  for (let c = 0; c < r.length; c += 1) {
    const u = r[c];
    for (let d = c + 1; d < r.length; d += 1) {
      const g = r[d];
      if (u.specificity !== g.specificity || !Zf(u.criteria, g.criteria)) continue;
      if (!(!!u.targetIdentity && u.targetIdentity === g.targetIdentity)) {
        a.push({
          leftIndex: u.index,
          rightIndex: g.index,
          type: u.criteriaSignature === g.criteriaSignature ? "equivalent" : "overlap",
          specificity: u.specificity
        });
        continue;
      }
      u.criteriaSignature === g.criteriaSignature && o.push({
        leftIndex: u.index,
        rightIndex: g.index,
        type: "duplicate"
      });
    }
  }
  return {
    errors: a,
    warnings: o
  };
}
l(cu, "detectTileCriteriaConflicts");
function tg(t, n) {
  if (!t || typeof t != "object") return null;
  let e = to(t.target);
  if (!e) {
    const i = Number(t.fileIndex);
    Number.isInteger(i) && i >= 0 && (e = gn(n, i));
  }
  return e ? {
    criteria: hn(t.criteria),
    target: e
  } : null;
}
l(tg, "normalizeTileVariant");
function uu(t, n = {}) {
  if (!Array.isArray(t) || t.length === 0) return null;
  const e = Array.isArray(n.files) ? n.files : null, i = t.map((c, u) => ({
    criteria: hn(c),
    target: gn(e, u)
  })).filter((c) => c.target);
  if (!i.length) return null;
  const r = i.find((c) => Object.keys(c.criteria).length === 0), a = (r == null ? void 0 : r.target) ?? i[0].target;
  let o = null;
  const s = Number(n.defaultFileIndex);
  return Number.isInteger(s) && s >= 0 && (o = gn(e, s)), o || (o = a), {
    strategy: "select-one",
    variants: i,
    defaultTarget: o
  };
}
l(uu, "buildTileCriteriaFromFileIndex");
function Gn(t, n = {}) {
  const e = Array.isArray(n.files) ? n.files : null;
  if (Array.isArray(t))
    return uu(t, { files: e });
  if (!t || typeof t != "object") return null;
  const i = Array.isArray(t.variants) ? t.variants.map((a) => tg(a, e)).filter(Boolean) : [];
  if (!i.length) return null;
  let r = to(t.defaultTarget);
  if (!r) {
    const a = Number(t.defaultFileIndex);
    Number.isInteger(a) && a >= 0 && (r = gn(e, a));
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
l(Gn, "normalizeTileCriteria");
function ng(t, n) {
  if (!t) return -1;
  let e = -1, i = -1;
  for (const r of t.variants) {
    const a = r.keys;
    let o = !0;
    for (const s of a)
      if (r.criteria[s] !== (n == null ? void 0 : n[s])) {
        o = !1;
        break;
      }
    o && a.length > i && (i = a.length, e = r.targetIndex);
  }
  return e >= 0 ? e : t.defaultIndex;
}
l(ng, "selectTileFileIndexFromCompiled");
function ig(t, n) {
  const e = Gn(t, { files: n });
  if (!e) return null;
  const i = e.variants.map((a) => {
    const o = hn(a.criteria), s = Hi(a.target, n);
    return !Number.isInteger(s) || s < 0 ? null : {
      criteria: o,
      keys: Object.keys(o),
      targetIndex: s
    };
  }).filter(Boolean), r = Hi(e.defaultTarget, n);
  return !i.length && (!Number.isInteger(r) || r < 0) ? null : {
    variants: i,
    defaultIndex: r
  };
}
l(ig, "compileTileMatcher");
function rg(t, n, e) {
  const i = ta.get(t);
  if (i && i.tileCriteria === n && i.files === e)
    return i.compiled;
  const r = ig(n, e);
  return ta.set(t, {
    tileCriteria: n,
    files: e,
    compiled: r
  }), r;
}
l(rg, "getCompiledTileMatcher");
function ag(t = null, n = null) {
  t ? na.delete(t) : na = /* @__PURE__ */ new WeakMap(), n ? ta.delete(n) : t || (ta = /* @__PURE__ */ new WeakMap());
}
l(ag, "invalidateTileCriteriaCaches");
async function du(t, n, e = {}) {
  var c, u, d, g;
  const i = Er(), r = {
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
  if (n = n ?? ((c = game.scenes) == null ? void 0 : c.viewed), !n)
    return r.durationMs = Er() - i, r;
  const a = n.getEmbeddedCollection("Tile") ?? [];
  r.total = Uf(a);
  const o = Yf(n, a, e.changedKeys);
  if (r.scanned = o.length, !o.length)
    return r.skipped.unaffected = r.total, r.durationMs = Er() - i, r;
  const s = [];
  for (const p of o) {
    const b = p.getFlag(ae, Bn) ?? p.getFlag(ae, qn);
    if (!b) {
      r.skipped.noCriteria += 1;
      continue;
    }
    const y = p.getFlag("monks-active-tiles", "files");
    if (!(y != null && y.length)) {
      r.skipped.noFiles += 1;
      continue;
    }
    const m = rg(p, b, y), v = ng(m, t);
    if (!Number.isInteger(v) || v < 0 || v >= y.length) {
      console.warn(`${ae} | Tile ${p.id} has no valid file match for state`, t), r.skipped.noMatch += 1;
      continue;
    }
    const E = v + 1, M = Number(p.getFlag("monks-active-tiles", "fileindex")) !== E, D = y.some((V, K) => !!(V != null && V.selected) != (K === v)), F = ia(((u = p.texture) == null ? void 0 : u.src) ?? ((g = (d = p._source) == null ? void 0 : d.texture) == null ? void 0 : g.src) ?? ""), P = lu(y[v]), H = ia(P), ne = !!H && H !== F;
    if (!D && !M && !ne) {
      r.skipped.unchanged += 1;
      continue;
    }
    const ie = {
      _id: p._id
    };
    D && (ie["flags.monks-active-tiles.files"] = y.map((V, K) => ({
      ...V,
      selected: K === v
    }))), M && (ie["flags.monks-active-tiles.fileindex"] = E), ne && (ie.texture = { src: P }), s.push(ie), jf(`Tile ${p.id} -> ${P}`);
  }
  return s.length > 0 && (r.chunks = await Gf(n, s, e.chunkSize), r.updated = s.length), r.durationMs = Er() - i, r;
}
l(du, "updateTiles");
function og() {
  if (!globalThis.Tagger) return [];
  const t = ["Checkbox", "Tile", "Settings", "Toggleable Lights"], n = [
    "Checkbox",
    "Tile",
    "Settings",
    "Toggleable Lights",
    "Checked",
    "Unchecked",
    "Individual"
  ], e = Tagger.getByTag(t) ?? [], i = [];
  for (const r of e) {
    if (r.getFlag("monks-active-tiles", "variables.state") !== "unchecked") continue;
    const a = (Tagger.getTags(r) ?? []).filter((c) => !n.includes(c)), o = (Tagger.getByTag("Disable Automation") ?? []).concat(Tagger.getByTag("Settings") ?? []), s = Tagger.getByTag(a, { ignore: o }) ?? [];
    for (const c of s)
      c != null && c._id && i.push(c._id);
  }
  return i;
}
l(og, "buildLightControlsMap");
const jn = T, ai = "lightCriteria", al = Object.freeze({
  base: null,
  mappings: [],
  current: null
});
function To(t) {
  return t && typeof t == "object" && !Array.isArray(t);
}
l(To, "isPlainObject$1");
function fu(t, n) {
  if (!To(n)) return {};
  const e = {};
  for (const [i, r] of Object.entries(n)) {
    const a = t == null ? void 0 : t[i];
    if (To(r) && To(a)) {
      const o = fu(a, r);
      Object.keys(o).length > 0 && (e[i] = o);
    } else r !== a && (e[i] = Nt(r));
  }
  return e;
}
l(fu, "computeDelta");
function gu(t) {
  var e;
  const n = ((e = t == null ? void 0 : t.getFlag) == null ? void 0 : e.call(t, jn, ai)) ?? al;
  return qi(n);
}
l(gu, "getLightCriteriaState");
async function hu(t, n) {
  const e = qi(n);
  if (!(t != null && t.setFlag))
    return e;
  const i = e.base !== null, r = e.mappings.length > 0, a = e.current !== null;
  return !i && !r && !a ? (typeof t.unsetFlag == "function" ? await t.unsetFlag(jn, ai) : await t.setFlag(jn, ai, null), al) : (await t.setFlag(jn, ai, e), e);
}
l(hu, "setLightCriteriaState");
async function dr(t, n) {
  if (typeof n != "function")
    throw new TypeError("updateLightCriteriaState requires an updater function.");
  const e = Nt(gu(t)), i = await n(e);
  return hu(t, i);
}
l(dr, "updateLightCriteriaState");
async function Bl(t, n) {
  const e = Wn(n);
  if (!e)
    throw new Error("Invalid light configuration payload.");
  return dr(t, (i) => ({
    ...i,
    base: e
  }));
}
l(Bl, "storeBaseLighting");
async function jl(t, n, e, { label: i } = {}) {
  const r = fr(n);
  if (!r)
    throw new Error("Cannot create a mapping without at least one category selection.");
  const a = Wn(e);
  if (!a)
    throw new Error("Invalid light configuration payload.");
  return dr(t, (o) => {
    const s = wi(r), c = Array.isArray(o == null ? void 0 : o.mappings) ? [...o.mappings] : [], u = c.findIndex((b) => (b == null ? void 0 : b.key) === s), d = u >= 0 ? c[u] : null, g = typeof (d == null ? void 0 : d.id) == "string" && d.id.trim() ? d.id.trim() : pu(), p = no({
      id: g,
      categories: r,
      config: a,
      label: typeof i == "string" ? i : (d == null ? void 0 : d.label) ?? null,
      updatedAt: Date.now()
    });
    if (!p)
      throw new Error("Failed to sanitize criteria mapping entry.");
    return u >= 0 ? c[u] = p : c.push(p), {
      ...o,
      mappings: c
    };
  });
}
l(jl, "upsertLightCriteriaMapping");
async function sg(t, n, e, i, { replaceExisting: r = !1 } = {}) {
  const a = typeof n == "string" ? n.trim() : "";
  if (!a)
    throw new Error("A mapping id is required to retarget criteria.");
  const o = fr(e);
  if (!o)
    throw new Error("Cannot retarget mapping without at least one category selection.");
  const s = Wn(i);
  if (!s)
    throw new Error("Invalid light configuration payload.");
  return dr(t, (c) => {
    const u = Array.isArray(c == null ? void 0 : c.mappings) ? [...c.mappings] : [], d = u.findIndex((E) => (E == null ? void 0 : E.id) === a);
    if (d < 0)
      throw new Error("The selected mapping no longer exists.");
    const g = wi(o), p = u.findIndex(
      (E, C) => C !== d && (E == null ? void 0 : E.key) === g
    );
    if (p >= 0 && !r)
      throw new Error("A mapping already exists for the selected criteria.");
    const b = u[d], y = no({
      ...b,
      id: a,
      categories: o,
      config: s,
      updatedAt: Date.now()
    });
    if (!y)
      throw new Error("Failed to sanitize updated mapping.");
    u[d] = y;
    let m = null;
    if (p >= 0) {
      const [E] = u.splice(p, 1);
      m = (E == null ? void 0 : E.id) ?? null;
    }
    let v = (c == null ? void 0 : c.current) ?? null;
    return v && typeof v == "object" && (v.mappingId === a ? v = {
      ...v,
      mappingId: a,
      categories: o,
      updatedAt: Date.now()
    } : m && v.mappingId === m && (v = {
      ...v,
      mappingId: a,
      categories: o,
      updatedAt: Date.now()
    })), {
      ...c,
      mappings: u,
      current: v
    };
  });
}
l(sg, "retargetLightCriteriaMapping");
async function lg(t, n) {
  const e = typeof n == "string" ? n.trim() : "";
  if (!e)
    throw new Error("A mapping id is required to remove a mapping.");
  return dr(t, (i) => {
    const r = Array.isArray(i == null ? void 0 : i.mappings) ? [...i.mappings] : [], a = r.findIndex((s) => (s == null ? void 0 : s.id) === e);
    if (a < 0) return i;
    r.splice(a, 1);
    let o = (i == null ? void 0 : i.current) ?? null;
    return (o == null ? void 0 : o.mappingId) === e && (o = null), {
      ...i,
      mappings: r,
      current: o
    };
  });
}
l(lg, "removeLightCriteriaMapping");
async function _i(t, n) {
  const e = mu(n);
  return dr(t, (i) => ({
    ...i,
    current: e
  }));
}
l(_i, "storeCurrentCriteriaSelection");
function cg(t) {
  const n = qi(t), e = n.base ?? {}, i = [];
  for (const r of n.mappings) {
    const a = fr(r == null ? void 0 : r.categories);
    if (!a) continue;
    const o = fu(e, (r == null ? void 0 : r.config) ?? {});
    Object.keys(o).length !== 0 && i.push({
      criteria: a,
      delta: o
    });
  }
  return {
    base: e,
    rules: i
  };
}
l(cg, "convertLightCriteriaStateToPresets");
function ug(t, n = []) {
  const e = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
  for (const c of n)
    typeof (c == null ? void 0 : c.key) == "string" && c.key.trim() && i.add(c.key.trim()), typeof (c == null ? void 0 : c.id) == "string" && c.id.trim() && typeof (c == null ? void 0 : c.key) == "string" && e.set(c.id.trim(), c.key.trim());
  const r = qi(t), a = /* @__PURE__ */ l((c) => {
    const u = {};
    for (const [d, g] of Object.entries(c ?? {})) {
      const p = String(d ?? "").trim(), b = typeof g == "string" ? g.trim() : "";
      if (!p || !b) continue;
      if (i.has(p)) {
        u[p] = b;
        continue;
      }
      const y = e.get(p);
      y && (u[y] = b);
    }
    return Object.keys(u).length ? u : null;
  }, "remapCategories"), o = r.mappings.map((c) => {
    const u = a(c.categories);
    return u ? no({
      ...c,
      categories: u,
      key: wi(u)
    }) : null;
  }).filter(Boolean);
  let s = r.current;
  if (s != null && s.categories) {
    const c = a(s.categories);
    s = c ? {
      ...s,
      categories: c
    } : null;
  }
  return qi({
    ...r,
    mappings: o,
    current: s
  });
}
l(ug, "migrateLightCriteriaCategoriesToKeys");
function qi(t) {
  var c;
  const n = Nt(t);
  if (!n || typeof n != "object")
    return Nt(al);
  const e = Wn(n.base), i = Array.isArray(n.mappings) ? n.mappings : [], r = /* @__PURE__ */ new Map();
  for (const u of i) {
    const d = no(u);
    d && r.set(d.key, d);
  }
  const a = Array.from(r.values()), o = new Map(a.map((u) => [u.id, u]));
  let s = mu(n.current);
  if (s) {
    const u = s.categories && Object.keys(s.categories).length > 0;
    if (s.mappingId && !o.has(s.mappingId)) {
      const d = u ? ((c = a.find((g) => g.key === wi(s.categories))) == null ? void 0 : c.id) ?? null : null;
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
    base: e ?? null,
    mappings: a,
    current: s
  };
}
l(qi, "sanitizeLightCriteriaState");
function Wn(t) {
  const n = Nt(t);
  if (!n || typeof n != "object") return null;
  "_id" in n && delete n._id, "id" in n && delete n.id;
  const e = n.flags;
  if (e && typeof e == "object") {
    const i = e[jn];
    i && typeof i == "object" && (delete i[ai], Object.keys(i).length === 0 && delete e[jn]), Object.keys(e).length === 0 && delete n.flags;
  }
  return n;
}
l(Wn, "sanitizeLightConfigPayload");
function no(t) {
  if (!t || typeof t != "object") return null;
  const n = fr(t.categories);
  if (!n) return null;
  const e = Wn(t.config);
  if (!e) return null;
  const i = typeof t.id == "string" && t.id.trim() ? t.id.trim() : pu(), r = wi(n), a = {
    id: i,
    key: r,
    categories: n,
    config: e,
    updatedAt: Number.isFinite(t.updatedAt) ? Number(t.updatedAt) : Date.now()
  };
  return typeof t.label == "string" && t.label.trim() && (a.label = t.label.trim()), a;
}
l(no, "sanitizeCriteriaMappingEntry");
function mu(t) {
  if (!t || typeof t != "object") return null;
  const n = typeof t.mappingId == "string" && t.mappingId.trim() ? t.mappingId.trim() : null, e = fr(t.categories);
  return !n && !e ? null : {
    mappingId: n,
    categories: e,
    updatedAt: Number.isFinite(t.updatedAt) ? Number(t.updatedAt) : Date.now()
  };
}
l(mu, "sanitizeCurrentSelection");
function fr(t) {
  const n = {};
  if (Array.isArray(t))
    for (const e of t) {
      const i = Ul((e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.categoryId) ?? (e == null ? void 0 : e.category)), r = Vl((e == null ? void 0 : e.value) ?? (e == null ? void 0 : e.selection) ?? (e == null ? void 0 : e.label));
      !i || !r || (n[i] = r);
    }
  else if (t && typeof t == "object")
    for (const [e, i] of Object.entries(t)) {
      const r = Ul(e), a = Vl(i);
      !r || !a || (n[r] = a);
    }
  return Object.keys(n).length > 0 ? n : null;
}
l(fr, "sanitizeCriteriaCategories");
function wi(t) {
  if (!t || typeof t != "object") return "";
  const n = Object.entries(t).filter(([, e]) => typeof e == "string" && e).map(([e, i]) => `${e}:${i}`);
  return n.sort((e, i) => e < i ? -1 : e > i ? 1 : 0), n.join("|");
}
l(wi, "computeCriteriaMappingKey");
function pu() {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
l(pu, "generateLightMappingId");
function Ul(t) {
  if (typeof t != "string") return null;
  const n = t.trim();
  return n || null;
}
l(Ul, "normalizeCategoryId");
function Vl(t) {
  if (typeof t != "string") return null;
  const n = t.trim();
  return n || null;
}
l(Vl, "normalizeCategoryValue");
const ra = ["AmbientLight", "Wall", "AmbientSound"];
let aa = /* @__PURE__ */ new WeakMap(), oa = /* @__PURE__ */ new WeakMap();
const zl = 200;
function dg(t) {
  return t ? Number.isInteger(t.size) ? t.size : Array.isArray(t) || typeof t.length == "number" ? t.length : Array.from(t).length : 0;
}
l(dg, "getCollectionSize");
function Co() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
l(Co, "nowMs$1");
function fg(t) {
  if (!Array.isArray(t)) return [];
  const n = /* @__PURE__ */ new Set();
  for (const e of t) {
    if (typeof e != "string") continue;
    const i = e.trim();
    i && n.add(i);
  }
  return Array.from(n);
}
l(fg, "uniqueStringKeys");
function gg(t, n = zl) {
  if (!Array.isArray(t) || t.length === 0) return [];
  const e = Number.isInteger(n) && n > 0 ? n : zl, i = [];
  for (let r = 0; r < t.length; r += e)
    i.push(t.slice(r, r + e));
  return i;
}
l(gg, "chunkArray");
async function hg(t, n, e, i) {
  const r = gg(e, i);
  for (const a of r)
    await t.updateEmbeddedDocuments(n, a), r.length > 1 && await Promise.resolve();
  return r.length;
}
l(hg, "updatePlaceablesInChunks");
function mg(t) {
  const n = /* @__PURE__ */ new Set();
  for (const e of (t == null ? void 0 : t.rules) ?? [])
    for (const i of Object.keys((e == null ? void 0 : e.criteria) ?? {}))
      i && n.add(i);
  return Array.from(n);
}
l(mg, "getPresetDependencyKeys");
function pg(t, n) {
  const e = /* @__PURE__ */ new Map();
  for (const i of ra) {
    const r = n.get(i) ?? [], a = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Map();
    for (const s of r) {
      const c = bu(s, i);
      if (c != null && c.base) {
        a.add(s.id);
        for (const u of mg(c))
          o.has(u) || o.set(u, /* @__PURE__ */ new Set()), o.get(u).add(s.id);
      }
    }
    e.set(i, {
      allDocIds: a,
      keyToDocIds: o
    });
  }
  return {
    collectionsByType: n,
    byType: e
  };
}
l(pg, "buildPlaceableDependencyIndex");
function yg(t, n) {
  const e = oa.get(t);
  if (e && ra.every((r) => e.collectionsByType.get(r) === n.get(r)))
    return e;
  const i = pg(t, n);
  return oa.set(t, i), i;
}
l(yg, "getPlaceableDependencyIndex");
function bg(t, n, e) {
  if (!n || !t) return [];
  const i = fg(e);
  if (!i.length)
    return typeof t.get == "function" ? Array.from(n.allDocIds).map((a) => t.get(a)).filter(Boolean) : Array.from(t).filter((a) => n.allDocIds.has(a.id));
  const r = /* @__PURE__ */ new Set();
  for (const a of i) {
    const o = n.keyToDocIds.get(a);
    if (o)
      for (const s of o) r.add(s);
  }
  return r.size ? typeof t.get == "function" ? Array.from(r).map((a) => t.get(a)).filter(Boolean) : Array.from(t).filter((a) => r.has(a.id)) : [];
}
l(bg, "getDocsForChangedKeys");
function Zn(t) {
  return !!t && typeof t == "object" && !Array.isArray(t);
}
l(Zn, "isPlainObject");
function us(t, n) {
  if (Object.is(t, n)) return !0;
  if (Array.isArray(t) || Array.isArray(n)) {
    if (!Array.isArray(t) || !Array.isArray(n) || t.length !== n.length) return !1;
    for (let e = 0; e < t.length; e += 1)
      if (!us(t[e], n[e])) return !1;
    return !0;
  }
  if (Zn(t) || Zn(n)) {
    if (!Zn(t) || !Zn(n)) return !1;
    const e = Object.keys(n);
    for (const i of e)
      if (!us(t[i], n[i])) return !1;
    return !0;
  }
  return !1;
}
l(us, "areValuesEqual");
function yu(t, n) {
  const e = { _id: n._id };
  for (const [r, a] of Object.entries(n)) {
    if (r === "_id") continue;
    const o = t == null ? void 0 : t[r];
    if (Zn(a) && Zn(o)) {
      const s = yu(o, { _id: n._id, ...a });
      if (!s) continue;
      const c = Object.keys(s).filter((u) => u !== "_id");
      if (c.length > 0) {
        e[r] = {};
        for (const u of c)
          e[r][u] = s[u];
      }
      continue;
    }
    us(o, a) || (e[r] = a);
  }
  return Object.keys(e).filter((r) => r !== "_id").length > 0 ? e : null;
}
l(yu, "buildChangedPayload");
function bu(t, n) {
  var s;
  const e = ((s = t == null ? void 0 : t.flags) == null ? void 0 : s[ae]) ?? {}, i = (e == null ? void 0 : e.presets) ?? null, r = n === "AmbientLight" ? (e == null ? void 0 : e.lightCriteria) ?? null : null, a = aa.get(t);
  if (a && a.type === n && a.rawPresets === i && a.rawLightCriteria === r)
    return a.presets;
  let o = null;
  if (e != null && e.presets) {
    const c = e.presets.base ?? null, u = Array.isArray(e.presets.rules) ? e.presets.rules : [];
    (c && Object.keys(c).length > 0 || u.length > 0) && (o = {
      base: c ?? {},
      rules: u
    });
  }
  if (!o && n === "AmbientLight" && (e != null && e.lightCriteria)) {
    const c = cg(e.lightCriteria);
    (c.base && Object.keys(c.base).length > 0 || c.rules.length > 0) && (o = {
      base: c.base,
      rules: c.rules
    });
  }
  return aa.set(t, {
    type: n,
    rawPresets: i,
    rawLightCriteria: r,
    presets: o
  }), o;
}
l(bu, "getPresetsForDocument");
function wg(t = null, n = null) {
  t ? oa.delete(t) : oa = /* @__PURE__ */ new WeakMap(), n ? aa.delete(n) : t || (aa = /* @__PURE__ */ new WeakMap());
}
l(wg, "invalidatePlaceableCriteriaCaches");
async function wu(t, n, e = {}) {
  var c, u;
  const i = Co(), r = {
    total: 0,
    scanned: 0,
    updated: 0,
    chunks: 0,
    byType: {},
    durationMs: 0
  };
  if (n = n ?? ((c = game.scenes) == null ? void 0 : c.viewed), !n)
    return r.durationMs = Co() - i, r;
  const a = new Set(og()), o = new Map(
    ra.map((d) => [d, n.getEmbeddedCollection(d) ?? []])
  ), s = yg(n, o);
  for (const d of ra) {
    const g = o.get(d) ?? [], p = {
      total: dg(g),
      scanned: 0,
      updated: 0,
      chunks: 0
    }, b = s.byType.get(d) ?? null, y = bg(g, b, e.changedKeys);
    if (p.scanned = y.length, r.total += p.total, r.scanned += p.scanned, r.byType[d] = p, !y.length) continue;
    const m = [];
    for (const v of y) {
      const E = bu(v, d);
      if (!(E != null && E.base)) continue;
      const C = su(E.base, E.rules ?? [], t);
      C._id = v._id, d === "AmbientLight" && a.has(v._id) && (C.hidden = !0);
      const M = (v == null ? void 0 : v._source) ?? ((u = v == null ? void 0 : v.toObject) == null ? void 0 : u.call(v)) ?? {}, D = yu(M, C);
      D && m.push(D);
    }
    m.length > 0 && (p.chunks = await hg(n, d, m, e.chunkSize), p.updated = m.length, r.updated += m.length, r.chunks += p.chunks, console.log(`${ae} | Updated ${m.length} ${d}(s)`));
  }
  return r.durationMs = Co() - i, r;
}
l(wu, "updatePlaceables");
function sa() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
l(sa, "nowMs");
const Tr = /* @__PURE__ */ new Map();
function vg(t) {
  var n;
  return t = t ?? ((n = game.scenes) == null ? void 0 : n.viewed), t ? ur(t) : null;
}
l(vg, "getState");
async function Eg(t, n, e = 0) {
  var b;
  const i = sa();
  if (n = n ?? ((b = game.scenes) == null ? void 0 : b.viewed), !n) return null;
  Bf(n);
  const r = lt(n);
  if (!r.length)
    return console.warn(`${ae} | applyState skipped: scene has no criteria.`), null;
  const a = ur(n, r), o = nl({ ...a, ...t ?? {} }, r), s = r.filter((y) => (a == null ? void 0 : a[y.key]) !== (o == null ? void 0 : o[y.key])).map((y) => y.key), c = s.length > 0;
  c && await Lf(n, o, r);
  const u = c ? o : a, [d, g] = await Promise.all([
    du(u, n, { changedKeys: s }),
    wu(u, n, { changedKeys: s })
  ]), p = sa() - i;
  return k("Criteria apply telemetry", {
    sceneId: n.id,
    changedKeys: s,
    didChange: c,
    queuedMs: e,
    durationMs: p,
    tiles: d,
    placeables: g
  }), Hooks.callAll("eidolon-utilities.criteriaStateApplied", n, u), u;
}
l(Eg, "applyStateInternal");
async function vu(t, n) {
  var c;
  if (n = n ?? ((c = game.scenes) == null ? void 0 : c.viewed), !n) return null;
  const e = n.id ?? "__viewed__", i = sa(), r = Tr.get(e) ?? Promise.resolve();
  let a = null;
  const o = r.catch(() => null).then(async () => {
    const u = sa() - i;
    return Eg(t, n, u);
  });
  a = o;
  const s = o.finally(() => {
    Tr.get(e) === s && Tr.delete(e);
  });
  return Tr.set(e, s), a;
}
l(vu, "applyState$1");
function Tg(t) {
  var n;
  return t = t ?? ((n = game.scenes) == null ? void 0 : n.viewed), t ? au(t) : null;
}
l(Tg, "getVersion");
async function Eu(t, n) {
  var e;
  n = n ?? ((e = game.scenes) == null ? void 0 : e.viewed), n != null && n.setFlag && await n.setFlag(ae, iu, Number(t));
}
l(Eu, "setVersion");
async function Cg(t) {
  return Eu(ru, t);
}
l(Cg, "markCurrentVersion");
const xi = "Standard", Sg = /* @__PURE__ */ l((...t) => console.log(`${ae} | criteria indexer:`, ...t), "log");
function ol(t) {
  if (typeof t != "string") return null;
  let n = t;
  try {
    n = decodeURIComponent(t);
  } catch {
  }
  const e = n.match(/\[([^\]]+)\]/);
  if (!e) return null;
  const i = e[1].split(",").map((r) => r.trim()).filter(Boolean);
  return i.length ? i : null;
}
l(ol, "parseFileTags");
function Lg(t, n, e = xi) {
  return t != null && t.length ? t.map((i) => {
    const r = ol(i == null ? void 0 : i.name);
    if (!r) return {};
    const a = {};
    for (const [o, s] of Object.entries(n)) {
      const c = r[Number(o)];
      c != null && c !== e && (a[s] = c);
    }
    return a;
  }) : [];
}
l(Lg, "buildFileIndex");
function Ig(t, n) {
  return t.map((e, i) => {
    const r = [...n[e] ?? /* @__PURE__ */ new Set()].sort(), o = r.includes(xi) ? xi : r[0] ?? xi, s = tl(e);
    return s.key = e, s.label = e.charAt(0).toUpperCase() + e.slice(1), s.values = r.length ? r : [xi], s.default = s.values.includes(o) ? o : s.values[0], s.order = i, s;
  });
}
l(Ig, "buildCriteriaDefinitions");
async function Cr(t, n, e, { dryRun: i = !1 } = {}) {
  const r = t.getFlag("monks-active-tiles", "files");
  if (!(r != null && r.length)) return null;
  const a = Lg(r, n), o = uu(a, { files: r });
  for (const s of r) {
    const c = ol(s == null ? void 0 : s.name);
    if (c)
      for (const [u, d] of Object.entries(n)) {
        const g = c[Number(u)];
        g != null && e[d] && e[d].add(g);
      }
  }
  return i || (await t.setFlag(ae, Bn, o), typeof t.unsetFlag == "function" && await t.unsetFlag(ae, qn)), { files: r.length };
}
l(Cr, "indexTile");
async function Og(t, n = {}) {
  var C, M, D, F;
  const {
    dryRun: e = !1,
    force: i = !1
  } = n;
  if (t = t ?? ((C = game.scenes) == null ? void 0 : C.viewed), !t) throw new Error("No scene provided to indexScene.");
  if (!globalThis.Tagger) throw new Error("Tagger is required to index scene criteria.");
  if (!i && au(t) >= ru)
    throw new Error(
      `Scene "${t.name}" is already criteria-indexed. Use force: true to re-index.`
    );
  const r = { sceneId: t.id }, a = Tagger.getByTag("Map", r) ?? [];
  if (!a.length) throw new Error("No Map tile found.");
  if (a.length > 1) throw new Error(`Expected 1 Map tile, found ${a.length}.`);
  const o = a[0], s = o.getFlag("monks-active-tiles", "files");
  if (!(s != null && s.length)) throw new Error("Map tile has no MATT files.");
  const c = ol((M = s[0]) == null ? void 0 : M.name);
  if (!(c != null && c.length))
    throw new Error(`Cannot parse bracket tags from: ${((D = s[0]) == null ? void 0 : D.name) ?? "<unknown>"}`);
  if (c.length < 3)
    throw new Error(`Expected 3+ bracket tags, found ${c.length}.`);
  const u = Tagger.getByTag("Floor", r) ?? [], d = Tagger.getByTag("Roof", r) ?? [], g = Tagger.getByTag("Weather", r) ?? [];
  let p;
  const b = [];
  c.length >= 4 ? (p = { 0: "mood", 1: "stage", 2: "variant", 3: "effect" }, b.push("mood", "stage", "variant", "effect")) : (p = { 0: "mood", 1: "variant", 2: "effect" }, b.push("mood", "variant", "effect"));
  const y = { 1: "effect" }, m = {};
  for (const P of b)
    m[P] = /* @__PURE__ */ new Set();
  const v = {
    map: null,
    floor: [],
    roof: [],
    weather: []
  };
  v.map = await Cr(o, p, m, { dryRun: e });
  for (const P of u) {
    const H = await Cr(P, p, m, { dryRun: e });
    H && v.floor.push(H);
  }
  for (const P of d) {
    const H = await Cr(P, p, m, { dryRun: e });
    H && v.roof.push(H);
  }
  for (const P of g) {
    const H = await Cr(P, y, m, { dryRun: e });
    H && v.weather.push(H);
  }
  const E = Ig(b, m);
  return e || (await Za(t, E), await Cg(t)), Sg(
    e ? "Dry run complete" : "Indexing complete",
    `- ${E.length} criteria,`,
    `${((F = v.map) == null ? void 0 : F.files) ?? 0} map files`
  ), {
    criteria: E,
    state: E.reduce((P, H) => (P[H.key] = H.default, P), {}),
    tiles: v,
    overlayMode: g.length > 0
  };
}
l(Og, "indexScene");
var hc, qe, at, ot, $n, Ye, It, Zt, za, de, Tu, Cu, Su, fs, Lu, gs, Iu, Di, hs;
const dt = class dt extends bn(yn) {
  constructor(e = {}) {
    var i;
    super(e);
    N(this, de);
    N(this, qe, null);
    N(this, at, []);
    N(this, ot, {});
    N(this, $n, !1);
    N(this, Ye, null);
    N(this, It, null);
    N(this, Zt, null);
    N(this, za, 120);
    this.setScene(e.scene ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null);
  }
  setScene(e) {
    var i;
    L(this, qe, e ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null), h(this, de, Tu).call(this);
  }
  get scene() {
    return f(this, qe);
  }
  async _prepareContext() {
    var r;
    const e = !!f(this, qe), i = e && f(this, at).length > 0;
    return {
      hasScene: e,
      hasCriteria: i,
      sceneName: ((r = f(this, qe)) == null ? void 0 : r.name) ?? w("EIDOLON.CriteriaSwitcher.NoScene", "No active scene"),
      labels: {
        subtitle: w(
          "EIDOLON.CriteriaSwitcher.Subtitle",
          "Switch criteria live and immediately apply all mapped updates."
        ),
        empty: w(
          "EIDOLON.CriteriaSwitcher.Empty",
          "No criteria found for this scene. Configure criteria first."
        ),
        reset: w("EIDOLON.CriteriaSwitcher.Reset", "Reset Defaults"),
        close: w("EIDOLON.CriteriaSwitcher.Close", "Close"),
        applying: w("EIDOLON.CriteriaSwitcher.Applying", "Applying changes..."),
        ready: w("EIDOLON.CriteriaSwitcher.Ready", "Ready")
      },
      criteria: f(this, at).map((a) => ({
        key: a.key,
        label: a.label || a.key,
        values: a.values.map((o) => {
          var s;
          return {
            value: o,
            selected: ((s = f(this, ot)) == null ? void 0 : s[a.key]) === o
          };
        }),
        defaultValue: a.default
      })),
      stateSummary: h(this, de, hs).call(this)
    };
  }
  _onRender(e, i) {
    super._onRender(e, i), h(this, de, Cu).call(this), h(this, de, Su).call(this);
  }
  async _onClose(e) {
    return f(this, Ye) !== null && (clearTimeout(f(this, Ye)), L(this, Ye, null)), f(this, Zt) !== null && (Hooks.off("eidolon-utilities.criteriaStateApplied", f(this, Zt)), L(this, Zt, null)), super._onClose(e);
  }
};
qe = new WeakMap(), at = new WeakMap(), ot = new WeakMap(), $n = new WeakMap(), Ye = new WeakMap(), It = new WeakMap(), Zt = new WeakMap(), za = new WeakMap(), de = new WeakSet(), Tu = /* @__PURE__ */ l(function() {
  if (!f(this, qe)) {
    L(this, at, []), L(this, ot, {});
    return;
  }
  L(this, at, lt(f(this, qe)).sort((e, i) => e.order - i.order)), L(this, ot, ur(f(this, qe), f(this, at)));
}, "#hydrateFromScene"), Cu = /* @__PURE__ */ l(function() {
  var i, r;
  const e = this.element;
  e instanceof HTMLElement && (e.querySelectorAll("[data-criteria-key]").forEach((a) => {
    a.addEventListener("change", (o) => {
      const s = o.currentTarget;
      if (!(s instanceof HTMLSelectElement)) return;
      const c = s.dataset.criteriaKey;
      c && (L(this, ot, {
        ...f(this, ot),
        [c]: s.value
      }), h(this, de, Lu).call(this, { [c]: s.value }));
    });
  }), (i = e.querySelector("[data-action='reset-defaults']")) == null || i.addEventListener("click", () => {
    h(this, de, Iu).call(this);
  }), (r = e.querySelector("[data-action='close-switcher']")) == null || r.addEventListener("click", () => {
    this.close();
  }));
}, "#bindEvents"), Su = /* @__PURE__ */ l(function() {
  f(this, Zt) === null && L(this, Zt, Hooks.on("eidolon-utilities.criteriaStateApplied", (e, i) => {
    !f(this, qe) || (e == null ? void 0 : e.id) !== f(this, qe).id || f(this, $n) || (L(this, ot, { ...i ?? {} }), this.render({ force: !0 }));
  }));
}, "#ensureSyncHook"), fs = /* @__PURE__ */ l(async function(e) {
  var i, r;
  if (f(this, qe)) {
    h(this, de, Di).call(this, "applying"), L(this, $n, !0);
    try {
      const a = await vu(e, f(this, qe));
      a && L(this, ot, a), h(this, de, Di).call(this, "ready"), this.render({ force: !0 });
    } catch (a) {
      console.error(`${ae} | Failed to apply criteria state`, a), (r = (i = ui.notifications) == null ? void 0 : i.error) == null || r.call(
        i,
        w(
          "EIDOLON.CriteriaSwitcher.ApplyError",
          "Failed to apply the selected criteria state."
        )
      ), h(this, de, Di).call(this, "error", (a == null ? void 0 : a.message) ?? "Unknown error");
    } finally {
      L(this, $n, !1), f(this, It) && h(this, de, gs).call(this);
    }
  }
}, "#applyPartialState"), Lu = /* @__PURE__ */ l(function(e) {
  L(this, It, {
    ...f(this, It) ?? {},
    ...e ?? {}
  }), f(this, Ye) !== null && clearTimeout(f(this, Ye)), h(this, de, Di).call(this, "applying"), L(this, Ye, setTimeout(() => {
    L(this, Ye, null), h(this, de, gs).call(this);
  }, f(this, za)));
}, "#queuePartialState"), gs = /* @__PURE__ */ l(async function() {
  if (f(this, $n) || !f(this, It)) return;
  const e = f(this, It);
  L(this, It, null), await h(this, de, fs).call(this, e);
}, "#flushPendingState"), Iu = /* @__PURE__ */ l(async function() {
  if (!f(this, at).length) return;
  const e = f(this, at).reduce((i, r) => (i[r.key] = r.default, i), {});
  L(this, ot, e), f(this, Ye) !== null && (clearTimeout(f(this, Ye)), L(this, Ye, null)), L(this, It, null), await h(this, de, fs).call(this, e);
}, "#resetToDefaults"), Di = /* @__PURE__ */ l(function(e, i = "") {
  const r = this.element;
  if (!(r instanceof HTMLElement)) return;
  const a = r.querySelector("[data-role='status']");
  if (a instanceof HTMLElement)
    switch (a.dataset.mode = e, e) {
      case "applying":
        a.textContent = w("EIDOLON.CriteriaSwitcher.Applying", "Applying changes...");
        break;
      case "error":
        a.textContent = `${w("EIDOLON.CriteriaSwitcher.Error", "Error")}: ${i}`;
        break;
      case "ready":
      default:
        a.textContent = `${w("EIDOLON.CriteriaSwitcher.Ready", "Ready")}: ${h(this, de, hs).call(this)}`;
        break;
    }
}, "#setStatus"), hs = /* @__PURE__ */ l(function() {
  return f(this, at).length ? `[${f(this, at).map((e) => {
    var i;
    return ((i = f(this, ot)) == null ? void 0 : i[e.key]) ?? e.default;
  }).join(" | ")}]` : "-";
}, "#formatStateSummary"), l(dt, "CriteriaSwitcherApplication"), Ce(dt, "APP_ID", `${ae}-criteria-switcher`), Ce(dt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Re(dt, dt, "DEFAULT_OPTIONS"),
  {
    id: dt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((hc = Re(dt, dt, "DEFAULT_OPTIONS")) == null ? void 0 : hc.classes) ?? [], "eidolon-criteria-switcher-window", "themed"])
    ),
    tag: "section",
    window: {
      title: w("EIDOLON.CriteriaSwitcher.Title", "Criteria Switcher"),
      icon: "fa-solid fa-sliders",
      resizable: !1
    },
    position: {
      width: 420,
      height: "auto"
    }
  },
  { inplace: !1 }
)), Ce(dt, "PARTS", {
  content: {
    template: `modules/${ae}/templates/criteria-switcher.html`
  }
});
let ds = dt;
const Ag = Qa(ds);
let Un = null;
function Mg(t) {
  var n;
  return t ?? ((n = game.scenes) == null ? void 0 : n.viewed) ?? null;
}
l(Mg, "resolveScene");
function Ng(t) {
  var n;
  return !!(t != null && t.rendered && ((n = t == null ? void 0 : t.element) != null && n.isConnected));
}
l(Ng, "isRendered");
function io() {
  return Ng(Un) ? Un : (Un = null, null);
}
l(io, "getCriteriaSwitcher");
function Ou(t) {
  var i, r, a, o, s;
  const n = Mg(t);
  if (!n)
    return (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "No active scene to open the criteria switcher."), null;
  if (!eo(n))
    return (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, "You do not have permission to manage scene criteria."), null;
  const e = io();
  return e ? (e.setScene(n), e.render({ force: !0 }), (s = e.bringToFront) == null || s.call(e), e) : (Un = Ag({ scene: n }), Un.render({ force: !0 }), Un);
}
l(Ou, "openCriteriaSwitcher");
function Au() {
  const t = io();
  t && (t.close(), Un = null);
}
l(Au, "closeCriteriaSwitcher");
function sl(t) {
  return io() ? (Au(), null) : Ou(t);
}
l(sl, "toggleCriteriaSwitcher");
const kg = {
  SCHEMA_VERSION: il,
  applyState: vu,
  getState: vg,
  getVersion: Tg,
  setVersion: Eu,
  getCriteria(t) {
    var n;
    return lt(t ?? ((n = game.scenes) == null ? void 0 : n.viewed));
  },
  setCriteria(t, n) {
    var e;
    return Za(n ?? ((e = game.scenes) == null ? void 0 : e.viewed), t);
  },
  updateTiles: du,
  updatePlaceables: wu,
  indexScene: Og,
  openCriteriaSwitcher: Ou,
  closeCriteriaSwitcher: Au,
  toggleCriteriaSwitcher: sl,
  findBestMatch: _f,
  findFileIndex: Pf,
  resolveRules: su
};
function Mu(t) {
  var n;
  return ((n = t == null ? void 0 : t.getFlag) == null ? void 0 : n.call(t, "monks-active-tiles", "files")) ?? [];
}
l(Mu, "getTileFiles$1");
function xg(t = []) {
  return {
    strategy: "select-one",
    defaultTarget: gn(t, 0) ?? { indexHint: 0 },
    variants: [
      {
        criteria: {},
        target: gn(t, 0) ?? { indexHint: 0 }
      }
    ]
  };
}
l(xg, "createDefaultTileCriteria");
function Dg(t, n = {}) {
  var o, s;
  const { allowLegacy: e = !0 } = n, i = Mu(t), r = (o = t == null ? void 0 : t.getFlag) == null ? void 0 : o.call(t, ae, Bn);
  if (r) return Gn(r, { files: i });
  if (!e) return null;
  const a = (s = t == null ? void 0 : t.getFlag) == null ? void 0 : s.call(t, ae, qn);
  return a ? Gn(a, { files: i }) : null;
}
l(Dg, "getTileCriteria");
async function Gl(t, n, e = {}) {
  if (!(t != null && t.setFlag)) return null;
  const {
    strictValidation: i = !0
  } = e, r = Mu(t), a = Gn(n, { files: r });
  if (!a)
    return typeof t.unsetFlag == "function" ? (await t.unsetFlag(ae, Bn), await t.unsetFlag(ae, qn)) : (await t.setFlag(ae, Bn, null), await t.setFlag(ae, qn, null)), null;
  if (i) {
    const o = cu(a, { files: r });
    if (o.errors.length > 0)
      throw new Error(
        `Tile criteria contains ${o.errors.length} conflicting rule pair(s). Resolve clashes before saving.`
      );
  }
  return await t.setFlag(ae, Bn, a), typeof t.unsetFlag == "function" && await t.unsetFlag(ae, qn), a;
}
l(Gl, "setTileCriteria");
const ms = "__eidolon_any__", Bt = "eidolon-tile-criteria", $g = "fa-solid fa-sliders", Nu = Symbol.for("eidolon.tileCriteriaUiState"), ro = ["all", "unmapped", "mapped", "conflicts"];
function Fg(t) {
  const n = t == null ? void 0 : t[Nu];
  return !n || typeof n != "object" ? {
    filterQuery: "",
    filterMode: "all",
    selectedFileIndex: null
  } : {
    filterQuery: typeof n.filterQuery == "string" ? n.filterQuery : "",
    filterMode: ro.includes(n.filterMode) ? n.filterMode : "all",
    selectedFileIndex: Number.isInteger(n.selectedFileIndex) ? n.selectedFileIndex : null
  };
}
l(Fg, "readUiState");
function _g(t, n) {
  if (!t || !n) return;
  typeof n.filterQuery == "string" && (t.filterQuery = n.filterQuery), ro.includes(n.filterMode) && (t.filterMode = n.filterMode), Number.isInteger(n.selectedFileIndex) && t.fileEntries.some((i) => i.index === n.selectedFileIndex) && (t.selectedFileIndex = n.selectedFileIndex);
}
l(_g, "applyUiState");
function Pg(t) {
  const n = t == null ? void 0 : t.app, e = t == null ? void 0 : t.state;
  !n || !e || (n[Nu] = {
    filterQuery: typeof e.filterQuery == "string" ? e.filterQuery : "",
    filterMode: ro.includes(e.filterMode) ? e.filterMode : "all",
    selectedFileIndex: Number.isInteger(e.selectedFileIndex) ? e.selectedFileIndex : null
  });
}
l(Pg, "persistUiState");
function Rg(t) {
  const n = (t == null ? void 0 : t.object) ?? (t == null ? void 0 : t.document) ?? null;
  return !(n != null && n.isEmbedded) || n.documentName !== "Tile" ? null : n;
}
l(Rg, "getTileDocument");
function Hg(t) {
  var n;
  return ((n = t == null ? void 0 : t.getFlag) == null ? void 0 : n.call(t, "monks-active-tiles", "files")) ?? [];
}
l(Hg, "getTileFiles");
function qg(t, n) {
  var s;
  const e = (t == null ? void 0 : t.parent) ?? ((s = game.scenes) == null ? void 0 : s.viewed) ?? null, r = lt(e).sort((c, u) => c.order - u.order).map((c) => ({
    key: c.key,
    label: c.label || c.key,
    values: [...c.values ?? []]
  })), a = new Set(r.map((c) => c.key)), o = /* @__PURE__ */ new Map();
  for (const c of (n == null ? void 0 : n.variants) ?? [])
    for (const [u, d] of Object.entries((c == null ? void 0 : c.criteria) ?? {}))
      a.has(u) || (o.has(u) || o.set(u, /* @__PURE__ */ new Set()), typeof d == "string" && d.trim() && o.get(u).add(d.trim()));
  for (const [c, u] of o.entries())
    r.push({
      key: c,
      label: c,
      values: [...u]
    });
  return r;
}
l(qg, "getCriteriaDefinitions");
function Bg(t) {
  const n = {
    folders: /* @__PURE__ */ new Map(),
    files: []
  };
  for (const e of t) {
    const r = (e.path || e.label).split("/").filter(Boolean);
    if (!r.length) {
      n.files.push({ entry: e, name: e.label });
      continue;
    }
    const a = r.pop();
    let o = n;
    for (const s of r)
      o.folders.has(s) || o.folders.set(s, {
        folders: /* @__PURE__ */ new Map(),
        files: []
      }), o = o.folders.get(s);
    o.files.push({ entry: e, name: a || e.label });
  }
  return n;
}
l(Bg, "buildTree");
function jg(t, n) {
  const e = [t];
  let i = n;
  for (; i.files.length === 0 && i.folders.size === 1; ) {
    const [r, a] = i.folders.entries().next().value;
    e.push(r), i = a;
  }
  return {
    label: e.join("/"),
    node: i
  };
}
l(jg, "collapseFolderBranch");
function Ug(t, n) {
  const e = t.rulesByFile.get(n) ?? [], i = [];
  for (const r of e) {
    const a = Object.entries(r.criteria ?? {}).filter(([, s]) => typeof s == "string" && s.trim());
    if (!a.length) {
      i.push("*");
      continue;
    }
    const o = a.map(([s, c]) => `${t.criteriaLabels.get(s) ?? s}: ${c}`).join(" · ");
    i.push(o);
  }
  return i;
}
l(Ug, "getRuleSummariesForFile");
function ps(t) {
  var b, y;
  const n = Hg(t), e = rl(n), i = Dg(t, { allowLegacy: !0 }) ?? xg(n), r = qg(t, i), a = new Map(r.map((m) => [m.key, m.label])), o = new Map(
    e.map((m) => [
      m.index,
      m.path || m.label
    ])
  ), s = Hi(i.defaultTarget, n), c = ((b = e[0]) == null ? void 0 : b.index) ?? 0, u = s >= 0 ? s : c, d = new Map(e.map((m) => [m.index, []]));
  let g = 1;
  for (const m of i.variants ?? []) {
    const v = Hi(m.target, n);
    v < 0 || (d.has(v) || d.set(v, []), d.get(v).push({
      id: g,
      criteria: { ...m.criteria ?? {} }
    }), g += 1);
  }
  const p = e.some((m) => m.index === u) ? u : ((y = e[0]) == null ? void 0 : y.index) ?? null;
  return {
    files: n,
    fileEntries: e,
    criteriaDefinitions: r,
    criteriaLabels: a,
    relativePaths: o,
    defaultIndex: u,
    selectedFileIndex: p,
    filterQuery: "",
    filterMode: "all",
    nextRuleId: g,
    rulesByFile: d,
    status: {
      mode: "ready",
      message: w("EIDOLON.TileCriteria.Ready", "Ready")
    }
  };
}
l(ps, "buildEditorState");
function ys(t, n) {
  return t.rulesByFile.has(n) || t.rulesByFile.set(n, []), t.rulesByFile.get(n);
}
l(ys, "getRulesForFile");
function Vg(t) {
  return Object.fromEntries(
    Object.entries(t ?? {}).filter(([n, e]) => typeof n == "string" && n && typeof e == "string" && e.trim()).map(([n, e]) => [n, e.trim()])
  );
}
l(Vg, "sanitizeRuleCriteria");
function ku(t) {
  const n = gn(t.files, t.defaultIndex);
  if (!n) return null;
  const e = [], i = [];
  for (const [a, o] of t.rulesByFile.entries()) {
    const s = gn(t.files, a);
    if (s)
      for (const [c, u] of o.entries()) {
        const d = Vg(u.criteria);
        e.push({
          criteria: d,
          target: { ...s }
        }), i.push({
          fileIndex: a,
          ruleId: u.id,
          rulePosition: c,
          criteria: d
        });
      }
  }
  return e.length || (e.push({
    criteria: {},
    target: { ...n }
  }), i.push({
    fileIndex: t.defaultIndex,
    ruleId: null,
    rulePosition: null,
    criteria: {},
    isFallback: !0
  })), {
    normalized: Gn(
      {
        strategy: "select-one",
        defaultTarget: n,
        variants: e
      },
      { files: t.files }
    ),
    sources: i
  };
}
l(ku, "buildTileCriteriaDraft");
function zg(t) {
  var n;
  return ((n = ku(t)) == null ? void 0 : n.normalized) ?? null;
}
l(zg, "exportTileCriteria");
function Wl(t) {
  const n = ku(t);
  if (!(n != null && n.normalized))
    return {
      errors: [],
      warnings: [],
      errorFileIndexes: [],
      warningFileIndexes: []
    };
  const e = cu(n.normalized, { files: t.files }), i = /* @__PURE__ */ l((s) => {
    const c = n.sources[s.leftIndex] ?? null, u = n.sources[s.rightIndex] ?? null;
    return {
      ...s,
      leftFileIndex: c == null ? void 0 : c.fileIndex,
      rightFileIndex: u == null ? void 0 : u.fileIndex
    };
  }, "mapConflict"), r = e.errors.map((s) => i(s)), a = e.warnings.map((s) => i(s)), o = /* @__PURE__ */ l((s) => {
    const c = /* @__PURE__ */ new Set();
    for (const u of s)
      Number.isInteger(u.leftFileIndex) && c.add(u.leftFileIndex), Number.isInteger(u.rightFileIndex) && c.add(u.rightFileIndex);
    return [...c];
  }, "toFileIndexes");
  return {
    errors: r,
    warnings: a,
    errorFileIndexes: o(r),
    warningFileIndexes: o(a)
  };
}
l(Wl, "analyzeRuleConflicts");
function Sr(t, n = "neutral") {
  const e = document.createElement("span");
  return e.classList.add("eidolon-tile-criteria__badge"), e.dataset.kind = n, e.textContent = t, e;
}
l(Sr, "createBadge");
function Gg(t, n = {}) {
  const e = typeof t == "string" ? t : "", {
    maxLength: i = 42,
    headLength: r = 20,
    tailLength: a = 16
  } = n;
  if (!e || e.length <= i) return e;
  const o = e.slice(0, r).trimEnd(), s = e.slice(-a).trimStart();
  return `${o}...${s}`;
}
l(Gg, "middleEllipsis");
function Wg(t) {
  const n = typeof t == "string" ? t.trim() : "";
  if (!n)
    return {
      error: "",
      matches: /* @__PURE__ */ l(() => !0, "matches")
    };
  let e = n, i = "i";
  if (n.startsWith("/") && n.length > 1) {
    const r = n.lastIndexOf("/");
    r > 0 && (e = n.slice(1, r), i = n.slice(r + 1) || "i");
  }
  i = i.replace(/g/g, "");
  try {
    const r = new RegExp(e, i);
    return {
      error: "",
      matches: /* @__PURE__ */ l((a) => r.test(String(a ?? "")), "matches")
    };
  } catch (r) {
    return {
      error: (r == null ? void 0 : r.message) ?? w("EIDOLON.TileCriteria.InvalidRegex", "Invalid regex."),
      matches: /* @__PURE__ */ l(() => !0, "matches")
    };
  }
}
l(Wg, "createRegexFilter");
function Jg(t, n) {
  const e = document.createElement("select");
  e.dataset.criteriaKey = t.key;
  const i = document.createElement("option");
  i.value = ms, i.textContent = "*", e.appendChild(i);
  const r = new Set(t.values ?? []);
  n && !r.has(n) && r.add(n);
  for (const a of r) {
    const o = document.createElement("option");
    o.value = a, o.textContent = a, e.appendChild(o);
  }
  return e.value = n ?? ms, e;
}
l(Jg, "createCriterionSelect");
function Kg(t, n, e, i) {
  var s;
  const r = document.createElement("div");
  r.classList.add("eidolon-tile-criteria__rule-editor");
  const a = document.createElement("div");
  a.classList.add("eidolon-tile-criteria__rule-grid");
  for (const c of n.criteriaDefinitions) {
    const u = document.createElement("label");
    u.classList.add("eidolon-tile-criteria__rule-field");
    const d = document.createElement("span");
    d.classList.add("eidolon-tile-criteria__criterion-label"), d.textContent = c.label, u.appendChild(d);
    const g = Jg(c, (s = t.criteria) == null ? void 0 : s[c.key]);
    g.addEventListener("change", () => {
      g.value === ms ? delete t.criteria[c.key] : t.criteria[c.key] = g.value, i();
    }), u.appendChild(g), a.appendChild(u);
  }
  r.appendChild(a);
  const o = document.createElement("button");
  return o.type = "button", o.classList.add("control", "ui-control", "eidolon-tile-criteria__rule-remove"), o.textContent = w("EIDOLON.TileCriteria.RemoveRule", "Remove"), o.addEventListener("click", () => {
    const u = ys(n, e).filter((d) => d.id !== t.id);
    n.rulesByFile.set(e, u), i();
  }), r.appendChild(o), r;
}
l(Kg, "renderRuleEditor");
const Pr = /* @__PURE__ */ new WeakMap();
function xu(t) {
  return (t == null ? void 0 : t.app) ?? (t == null ? void 0 : t.tile) ?? null;
}
l(xu, "getDialogOwner");
function Yg(t) {
  for (const n of t) {
    const e = jt(n);
    if (e) return e;
    const i = jt(n == null ? void 0 : n.element);
    if (i) return i;
  }
  return null;
}
l(Yg, "findDialogRoot$1");
function Qg(t, n, e) {
  const i = t.state, r = i.fileEntries.find((m) => m.index === n);
  if (!r) return document.createElement("div");
  const a = document.createElement("section");
  a.classList.add("eidolon-tile-criteria__dialog-content");
  const o = document.createElement("header");
  o.classList.add("eidolon-tile-criteria__editor-header");
  const s = document.createElement("h4");
  s.textContent = i.relativePaths.get(r.index) || r.label, o.appendChild(s);
  const c = document.createElement("p");
  c.classList.add("notes"), c.textContent = `#${r.index + 1} · ${r.path || w("EIDOLON.TileCriteria.UnknownPath", "Unknown path")}`, o.appendChild(c), a.appendChild(o);
  const u = document.createElement("div");
  u.classList.add("eidolon-tile-criteria__editor-controls");
  const d = document.createElement("button");
  d.type = "button", d.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action"), i.defaultIndex === r.index ? (d.textContent = w("EIDOLON.TileCriteria.IsDefault", "Default Target"), d.disabled = !0) : (d.textContent = w("EIDOLON.TileCriteria.SetDefault", "Set As Default"), d.addEventListener("click", () => {
    i.defaultIndex = r.index, ze(t), e();
  })), u.appendChild(d);
  const g = document.createElement("button");
  g.type = "button", g.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action", "secondary"), g.textContent = w("EIDOLON.TileCriteria.ClearFileRules", "Clear File Rules"), g.addEventListener("click", () => {
    i.rulesByFile.set(r.index, []), ze(t), e();
  }), u.appendChild(g), a.appendChild(u);
  const p = document.createElement("div");
  p.classList.add("eidolon-tile-criteria__rule-editors");
  const b = ys(i, r.index);
  if (b.length)
    for (const m of b)
      p.appendChild(
        Kg(m, i, r.index, () => {
          ze(t), e();
        })
      );
  else {
    const m = document.createElement("p");
    m.classList.add("notes"), m.textContent = w(
      "EIDOLON.TileCriteria.NoRulesForFile",
      "No rules map to this file yet. Add one to define when this variant should be active."
    ), p.appendChild(m);
  }
  a.appendChild(p);
  const y = document.createElement("button");
  return y.type = "button", y.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action"), y.textContent = w("EIDOLON.TileCriteria.AddRule", "Add Rule"), y.disabled = !i.criteriaDefinitions.length, y.addEventListener("click", () => {
    ys(i, r.index).push({
      id: i.nextRuleId,
      criteria: {}
    }), i.nextRuleId += 1, ze(t), e();
  }), a.appendChild(y), a;
}
l(Qg, "buildRuleEditorContent");
function Xg(t, n) {
  var g, p, b;
  const e = xu(t);
  if (!e) return;
  const i = Pr.get(e);
  if (i) {
    i.controller = t, i.fileIndex = n, (g = i.refresh) == null || g.call(i);
    return;
  }
  const r = {
    controller: t,
    fileIndex: n,
    host: null,
    refresh: null
  };
  Pr.set(e, r);
  const a = /* @__PURE__ */ l(() => {
    Pr.delete(e);
  }, "closeDialog"), o = /* @__PURE__ */ l(() => {
    r.host instanceof HTMLElement && r.host.replaceChildren(
      Qg(r.controller, r.fileIndex, o)
    );
  }, "refreshDialog");
  r.refresh = o;
  const s = w("EIDOLON.TileCriteria.EditorTitle", "Edit Tile Criteria Rules"), c = '<div class="eidolon-tile-criteria-editor-host"></div>', u = w("EIDOLON.TileCriteria.CloseEditor", "Close"), d = (b = (p = foundry == null ? void 0 : foundry.applications) == null ? void 0 : p.api) == null ? void 0 : b.DialogV2;
  if (typeof (d == null ? void 0 : d.wait) == "function") {
    d.wait({
      window: { title: s },
      content: c,
      buttons: [{ action: "close", label: u, default: !0 }],
      render: /* @__PURE__ */ l((...y) => {
        var E;
        const m = Yg(y), v = (E = m == null ? void 0 : m.querySelector) == null ? void 0 : E.call(m, ".eidolon-tile-criteria-editor-host");
        v instanceof HTMLElement && (r.host = v, o());
      }, "render"),
      close: a,
      rejectClose: !1
    }).catch((y) => {
      console.warn(`${ae} | Rule editor dialog failed`, y), a();
    });
    return;
  }
  a();
}
l(Xg, "openRuleEditorDialog");
function Jl(t) {
  var i;
  const n = xu(t);
  if (!n) return;
  const e = Pr.get(n);
  (i = e == null ? void 0 : e.refresh) == null || i.call(e);
}
l(Jl, "refreshOpenRuleEditor");
function bs(t, n) {
  return (t.rulesByFile.get(n) ?? []).length > 0;
}
l(bs, "hasRulesForFile");
function Du(t, n) {
  var e, i;
  return ((e = t == null ? void 0 : t.errorFileIndexes) == null ? void 0 : e.includes(n)) || ((i = t == null ? void 0 : t.warningFileIndexes) == null ? void 0 : i.includes(n));
}
l(Du, "hasConflictForFile");
function Zg(t, n, e) {
  switch (t.filterMode) {
    case "unmapped":
      return !bs(t, n.index);
    case "mapped":
      return bs(t, n.index);
    case "conflicts":
      return Du(e, n.index);
    case "all":
    default:
      return !0;
  }
}
l(Zg, "matchesFilterMode");
function eh(t, n) {
  let e = 0, i = 0, r = 0;
  for (const a of t.fileEntries)
    bs(t, a.index) ? e += 1 : i += 1, Du(n, a.index) && (r += 1);
  return {
    all: t.fileEntries.length,
    mapped: e,
    unmapped: i,
    conflicts: r
  };
}
l(eh, "getFilterModeCounts");
function th(t) {
  switch (t) {
    case "unmapped":
      return w("EIDOLON.TileCriteria.FilterModeUnmapped", "Unmapped");
    case "mapped":
      return w("EIDOLON.TileCriteria.FilterModeMapped", "Mapped");
    case "conflicts":
      return w("EIDOLON.TileCriteria.FilterModeConflicts", "Clashes");
    case "all":
    default:
      return w("EIDOLON.TileCriteria.FilterModeAll", "All");
  }
}
l(th, "getFilterModeLabel");
function $u(t, n, e, i, r) {
  var u, d;
  const a = [...t.folders.keys()].sort((g, p) => g.localeCompare(p));
  for (const g of a) {
    const p = jg(g, t.folders.get(g)), b = document.createElement("li");
    b.classList.add("eidolon-tile-criteria__tree-branch");
    const y = document.createElement("div");
    y.classList.add("document", "folder", "update", "eidolon-tile-criteria__folder-row");
    const m = document.createElement("i");
    m.classList.add("fa-solid", "fa-folder-open"), y.appendChild(m);
    const v = document.createElement("span");
    v.classList.add("eidolon-tile-criteria__tree-folder-label"), v.textContent = p.label, v.title = p.label, y.appendChild(v), b.appendChild(y);
    const E = document.createElement("ul");
    E.classList.add("eidolon-tile-criteria__tree"), E.dataset.folder = p.label, $u(p.node, n, e, i, E), E.childElementCount > 0 && b.appendChild(E), r.appendChild(b);
  }
  const o = [...t.files].sort((g, p) => g.name.localeCompare(p.name));
  if (!o.length) return;
  const s = document.createElement("li"), c = document.createElement("ul");
  c.classList.add("document-list", "eidolon-tile-criteria__document-list");
  for (const g of o) {
    const p = g.entry, b = p.index === n.selectedFileIndex, y = p.index === n.defaultIndex, m = Ug(n, p.index), v = document.createElement("li");
    v.classList.add("document", "update", "eidolon-tile-criteria__tree-file");
    const E = document.createElement("button");
    E.type = "button", E.classList.add("eidolon-tile-criteria__file-row");
    const C = (u = i == null ? void 0 : i.errorFileIndexes) == null ? void 0 : u.includes(p.index), M = (d = i == null ? void 0 : i.warningFileIndexes) == null ? void 0 : d.includes(p.index);
    C ? E.classList.add("has-conflict") : M && E.classList.add("has-warning");
    const D = n.relativePaths.get(p.index) || p.path || g.name, F = [D];
    C ? F.push(
      w(
        "EIDOLON.TileCriteria.ConflictFileHint",
        "This file participates in one or more conflicting rules."
      )
    ) : M && F.push(
      w(
        "EIDOLON.TileCriteria.WarningFileHint",
        "This file has potentially redundant rules."
      )
    ), m.length || F.push(
      w(
        "EIDOLON.TileCriteria.UnmappedHint",
        "No criteria rules map to this file."
      )
    ), E.title = F.join(`
`), b && E.classList.add("is-selected"), E.addEventListener("click", () => {
      n.selectedFileIndex = p.index, ze(e), Xg(e, p.index);
    });
    const P = document.createElement("span");
    P.classList.add("eidolon-tile-criteria__indicator"), P.dataset.kind = y ? "default" : m.length ? "mapped" : "unmapped", E.appendChild(P);
    const H = document.createElement("span");
    H.classList.add("eidolon-tile-criteria__file-content");
    const ne = document.createElement("span");
    ne.classList.add("eidolon-tile-criteria__file-heading");
    const ie = document.createElement("span");
    ie.classList.add("eidolon-tile-criteria__file-title"), ie.textContent = Gg(g.name || p.label), ie.title = D, ne.appendChild(ie);
    const V = Sr(`#${p.index + 1}`, "meta");
    V.classList.add("eidolon-tile-criteria__index-badge"), ne.appendChild(V), H.appendChild(ne);
    const K = document.createElement("span");
    K.classList.add("eidolon-tile-criteria__badges"), y && K.appendChild(Sr(w("EIDOLON.TileCriteria.DefaultBadge", "Default"), "default"));
    const _ = m.slice(0, 2);
    for (const z of _)
      K.appendChild(Sr(z, "rule"));
    if (m.length > _.length && K.appendChild(Sr(`+${m.length - _.length}`, "meta")), H.appendChild(K), E.appendChild(H), C || M) {
      const z = document.createElement("span");
      z.classList.add("eidolon-tile-criteria__row-warning"), z.dataset.mode = C ? "error" : "warning", z.innerHTML = '<i class="fa-solid fa-triangle-exclamation" inert=""></i>', E.appendChild(z);
    }
    v.appendChild(E), c.appendChild(v);
  }
  s.appendChild(c), r.appendChild(s);
}
l($u, "renderTreeNode");
function nh(t, n, e, i = {}) {
  const r = document.createElement("section");
  r.classList.add("eidolon-tile-criteria__tree-panel");
  const a = Wg(t.filterQuery), o = eh(t, e);
  t.filterMode !== "all" && o[t.filterMode] === 0 && (t.filterMode = "all");
  const s = document.createElement("div");
  s.classList.add("eidolon-tile-criteria__toolbar");
  const c = document.createElement("div");
  c.classList.add("eidolon-tile-criteria__mode-bar");
  for (const C of ro) {
    const M = document.createElement("button");
    M.type = "button", M.classList.add("control", "ui-control", "eidolon-tile-criteria__mode-button"), M.dataset.mode = C, M.textContent = th(C);
    const D = C === "all" || o[C] > 0;
    M.disabled = !D, D || (M.dataset.tooltip = w(
      "EIDOLON.TileCriteria.FilterModeUnavailable",
      "No entries currently match this filter."
    ), M.title = M.dataset.tooltip), t.filterMode === C ? (M.classList.add("is-active"), M.setAttribute("aria-pressed", "true")) : M.setAttribute("aria-pressed", "false"), M.addEventListener("click", () => {
      t.filterMode !== C && (t.filterMode = C, ze(n));
    }), c.appendChild(M);
  }
  s.appendChild(c);
  const u = document.createElement("div");
  u.classList.add("eidolon-tile-criteria__filter-row");
  const d = document.createElement("input");
  d.type = "text", d.classList.add("eidolon-tile-criteria__filter-input"), d.placeholder = w("EIDOLON.TileCriteria.FilterPlaceholder", "Regex filter (path)"), d.value = t.filterQuery, d.autocomplete = "off", d.addEventListener("keydown", (C) => {
    C.stopPropagation(), C.key === "Enter" && C.preventDefault();
  }), d.addEventListener("keyup", (C) => {
    C.stopPropagation();
  }), d.addEventListener("change", (C) => {
    C.stopPropagation();
  }), d.addEventListener("input", (C) => {
    C.stopPropagation();
    const M = d.selectionStart ?? d.value.length, D = d.selectionEnd ?? M;
    t.filterQuery = d.value, ze(n), requestAnimationFrame(() => {
      const F = n.section.querySelector(".eidolon-tile-criteria__filter-input");
      if (F instanceof HTMLInputElement) {
        F.focus();
        try {
          F.setSelectionRange(M, D);
        } catch {
        }
      }
    });
  }), u.appendChild(d);
  const g = document.createElement("div");
  g.classList.add("eidolon-tile-criteria__toolbar-actions");
  const p = document.createElement("button");
  p.type = "button";
  const b = w("EIDOLON.TileCriteria.Save", "Save Rules");
  p.classList.add("control", "ui-control", "eidolon-tile-criteria__toolbar-action", "icon-only"), p.dataset.tooltip = b, p.setAttribute("aria-label", b), p.title = b, p.innerHTML = '<i class="fa-solid fa-floppy-disk" inert=""></i>', p.disabled = e.errors.length > 0, p.addEventListener("click", () => {
    var C;
    (C = i.onSave) == null || C.call(i);
  }), g.appendChild(p);
  const y = document.createElement("button");
  y.type = "button";
  const m = w("EIDOLON.TileCriteria.Clear", "Clear Rules");
  if (y.classList.add("control", "ui-control", "secondary", "eidolon-tile-criteria__toolbar-action", "icon-only"), y.dataset.tooltip = m, y.setAttribute("aria-label", m), y.title = m, y.innerHTML = '<i class="fa-solid fa-trash" inert=""></i>', y.addEventListener("click", () => {
    var C;
    (C = i.onClear) == null || C.call(i);
  }), g.appendChild(y), u.appendChild(g), s.appendChild(u), r.appendChild(s), a.error) {
    const C = document.createElement("p");
    C.classList.add("notes", "eidolon-tile-criteria__filter-error"), C.textContent = `${w("EIDOLON.TileCriteria.InvalidRegex", "Invalid regex")}: ${a.error}`, r.appendChild(C);
  }
  const v = document.createElement("div");
  v.classList.add("eidolon-tile-criteria__library-tree");
  const E = t.fileEntries.filter((C) => {
    const M = t.relativePaths.get(C.index) || C.path || C.label;
    return Zg(t, C, e) && a.matches(M);
  });
  if (t.fileEntries.length)
    if (E.length) {
      const C = document.createElement("ul");
      C.classList.add("eidolon-tile-criteria__tree"), $u(Bg(E), t, n, e, C), v.appendChild(C);
    } else {
      const C = document.createElement("p");
      C.classList.add("notes"), C.textContent = w("EIDOLON.TileCriteria.NoMatches", "No variants match this filter."), v.appendChild(C);
    }
  else {
    const C = document.createElement("p");
    C.classList.add("notes"), C.textContent = w("EIDOLON.TileCriteria.NoVariants", "No MATT variants found"), v.appendChild(C);
  }
  return r.appendChild(v), r;
}
l(nh, "renderTreePanel");
function ze(t) {
  const { section: n, state: e } = t, i = Wl(e);
  Pg(t), n.replaceChildren();
  const r = /* @__PURE__ */ l(async () => {
    try {
      const o = Wl(e);
      if (o.errors.length) {
        e.status = {
          mode: "error",
          message: w(
            "EIDOLON.TileCriteria.ConflictSaveBlocked",
            `Resolve ${o.errors.length} conflict(s) before saving tile criteria rules.`
          )
        }, ze(t);
        return;
      }
      const s = zg(e);
      if (!s) {
        e.status = {
          mode: "error",
          message: w("EIDOLON.TileCriteria.Invalid", "Invalid rules. Select valid target variants.")
        }, ze(t);
        return;
      }
      await Gl(t.tile, s);
      const c = e.filterQuery, u = e.filterMode, d = e.selectedFileIndex;
      t.state = ps(t.tile), t.state.filterQuery = c, t.state.filterMode = u, Number.isInteger(d) && (t.state.selectedFileIndex = d), t.state.status = {
        mode: "ready",
        message: w("EIDOLON.TileCriteria.Saved", "Tile criteria rules saved.")
      }, ze(t), Jl(t);
    } catch (o) {
      console.error(`${ae} | Failed to save tile criteria`, o), e.status = {
        mode: "error",
        message: (o == null ? void 0 : o.message) ?? "Failed to save tile criteria rules."
      }, ze(t);
    }
  }, "handleSave"), a = /* @__PURE__ */ l(async () => {
    try {
      await Gl(t.tile, null);
      const o = e.filterQuery, s = e.filterMode, c = e.selectedFileIndex;
      t.state = ps(t.tile), t.state.filterQuery = o, t.state.filterMode = s, Number.isInteger(c) && (t.state.selectedFileIndex = c), t.state.status = {
        mode: "ready",
        message: w("EIDOLON.TileCriteria.Cleared", "Tile criteria rules cleared.")
      }, ze(t), Jl(t);
    } catch (o) {
      console.error(`${ae} | Failed to clear tile criteria`, o), e.status = {
        mode: "error",
        message: (o == null ? void 0 : o.message) ?? "Failed to clear tile criteria rules."
      }, ze(t);
    }
  }, "handleClear");
  if (n.appendChild(nh(e, t, i, {
    onSave: r,
    onClear: a
  })), i.errors.length || i.warnings.length) {
    const o = document.createElement("section");
    o.classList.add("eidolon-tile-criteria__conflicts");
    const s = document.createElement("p");
    s.classList.add("eidolon-tile-criteria__conflict-summary", "notes"), i.errors.length ? (s.dataset.mode = "error", s.textContent = w(
      "EIDOLON.TileCriteria.ConflictSummary",
      `${i.errors.length} conflict(s) must be resolved before saving${i.warnings.length ? ` (${i.warnings.length} warning(s))` : ""}.`
    )) : (s.dataset.mode = "warning", s.textContent = w(
      "EIDOLON.TileCriteria.WarningSummary",
      `${i.warnings.length} potential issue(s) detected.`
    )), o.appendChild(s);
    const c = document.createElement("p");
    c.classList.add("eidolon-tile-criteria__conflict-hint", "notes"), c.textContent = w(
      "EIDOLON.TileCriteria.ConflictHint",
      "Files involved in clashes are marked in red with a warning icon."
    ), o.appendChild(c), n.appendChild(o);
  }
  if (e.status.mode === "error" || e.status.mode === "warning") {
    const o = document.createElement("p");
    o.classList.add("eidolon-tile-criteria__status", "notes"), o.dataset.mode = e.status.mode, o.textContent = e.status.message, n.appendChild(o);
  }
}
l(ze, "renderController");
function ih(t, n = null) {
  const e = document.createElement("section");
  e.classList.add("eidolon-tile-criteria");
  const i = ps(t);
  _g(i, Fg(n));
  const r = {
    app: n,
    tile: t,
    section: e,
    state: i
  };
  return ze(r), r;
}
l(ih, "createController");
function rh(t) {
  if (!(t instanceof HTMLElement)) return null;
  const n = [
    ":scope > footer.sheet-footer",
    ":scope > footer.form-footer",
    ":scope > .sheet-footer",
    ":scope > .form-footer",
    ":scope > footer"
  ];
  for (const e of n) {
    const i = t.querySelector(e);
    if (i instanceof HTMLElement) return i;
  }
  return null;
}
l(rh, "findFooterElement");
function ah(t) {
  if (!(t instanceof HTMLElement)) return null;
  const n = [
    "nav.sheet-tabs[data-group]",
    "nav.tabs[data-group]",
    "nav.sheet-tabs",
    "nav.tabs"
  ];
  for (const e of n) {
    const i = t.querySelector(e);
    if (i instanceof HTMLElement) return i;
  }
  return null;
}
l(ah, "findTabNav");
function oh(t, n) {
  var i, r, a;
  return t instanceof HTMLElement ? [
    (i = t.querySelector(".tab[data-tab]")) == null ? void 0 : i.parentElement,
    t.querySelector(".sheet-body"),
    (a = (r = n == null ? void 0 : n.parentElement) == null ? void 0 : r.querySelector) == null ? void 0 : a.call(r, ":scope > .sheet-body"),
    n == null ? void 0 : n.parentElement
  ].find((o) => o instanceof HTMLElement) ?? null : null;
}
l(oh, "findTabBody");
function sh(t, n) {
  var e, i, r, a, o, s, c;
  return ((e = t == null ? void 0 : t.dataset) == null ? void 0 : e.group) ?? ((a = (r = (i = t == null ? void 0 : t.querySelector) == null ? void 0 : i.call(t, "[data-group]")) == null ? void 0 : r.dataset) == null ? void 0 : a.group) ?? ((c = (s = (o = n == null ? void 0 : n.querySelector) == null ? void 0 : o.call(n, ".tab[data-group]")) == null ? void 0 : s.dataset) == null ? void 0 : c.group) ?? "main";
}
l(sh, "getTabGroup");
function lh(t, n) {
  if (!(t instanceof HTMLElement)) return;
  t.textContent = "";
  const e = document.createElement("i");
  e.className = $g, e.setAttribute("inert", ""), t.append(e, " ");
  const i = document.createElement("span");
  i.textContent = n, t.append(i);
}
l(lh, "setTabButtonContent");
function ch(t, n) {
  const e = t.querySelector("[data-tab]"), i = (e == null ? void 0 : e.tagName) || "A", r = document.createElement(i);
  return e instanceof HTMLElement && (r.className = e.className), r.classList.remove("active"), i === "BUTTON" && (r.type = "button"), r.dataset.action = "tab", r.dataset.tab = Bt, r.dataset.group = n, r.setAttribute("aria-selected", "false"), r.setAttribute("aria-pressed", "false"), r;
}
l(ch, "createTabButton");
function uh(t, n) {
  const e = document.createElement("div");
  e.classList.add("tab"), e.dataset.tab = Bt, e.dataset.group = n, e.dataset.applicationPart = Bt, e.setAttribute("hidden", "true");
  const i = rh(t);
  return t.insertBefore(e, i ?? null), e;
}
l(uh, "createTabPanel");
function So(t, n, e, i) {
  var o;
  if (!(e instanceof HTMLElement) || !(i instanceof HTMLElement)) return;
  const r = (o = t == null ? void 0 : t.tabGroups) == null ? void 0 : o[n];
  if (typeof r == "string" ? r === Bt : e.classList.contains("active") || i.classList.contains("active")) {
    e.classList.add("active"), e.setAttribute("aria-selected", "true"), e.setAttribute("aria-pressed", "true"), i.classList.add("active"), i.removeAttribute("hidden"), i.removeAttribute("aria-hidden");
    return;
  }
  e.classList.remove("active"), e.setAttribute("aria-selected", "false"), e.setAttribute("aria-pressed", "false"), i.classList.remove("active"), i.setAttribute("hidden", "true");
}
l(So, "syncTabVisibility");
function dh(t, n) {
  const e = ah(n), i = oh(n, e);
  if (!(e instanceof HTMLElement) || !(i instanceof HTMLElement)) return null;
  const r = sh(e, i);
  let a = e.querySelector(`[data-tab="${Bt}"]`);
  a instanceof HTMLElement || (a = ch(e, r), e.appendChild(a)), lh(a, w("EIDOLON.TileCriteria.TabLabel", "Criteria"));
  let o = i.querySelector(`.tab[data-tab="${Bt}"]`);
  return o instanceof HTMLElement || (o = uh(i, r)), a.dataset.eidolonTileCriteriaBound || (a.addEventListener("click", () => {
    Wc(t, Bt, r), requestAnimationFrame(() => {
      So(t, r, a, o);
    });
  }), a.dataset.eidolonTileCriteriaBound = "true"), So(t, r, a, o), requestAnimationFrame(() => {
    So(t, r, a, o);
  }), o;
}
l(dh, "ensureTileCriteriaTab");
function fh() {
  Hooks.on("renderTileConfig", (t, n) => {
    var c, u, d, g;
    const e = jt(n);
    if (!e) return;
    const i = Rg(t);
    if (!i) return;
    if ((c = e.querySelector(".eidolon-tile-criteria")) == null || c.remove(), !Xa()) {
      (u = e.querySelector(`.item[data-tab='${Bt}']`)) == null || u.remove(), (d = e.querySelector(`.tab[data-tab='${Bt}']`)) == null || d.remove();
      return;
    }
    const r = ih(i, t), a = dh(t, e);
    if (a instanceof HTMLElement) {
      a.replaceChildren(r.section), (g = t.setPosition) == null || g.call(t, { height: "auto" });
      return;
    }
    const o = (t == null ? void 0 : t.form) instanceof HTMLFormElement ? t.form : e instanceof HTMLFormElement ? e : e.querySelector("form");
    if (!(o instanceof HTMLFormElement)) return;
    const s = o.querySelector("button[type='submit']");
    s != null && s.parentElement ? s.parentElement.insertAdjacentElement("beforebegin", r.section) : o.appendChild(r.section);
  });
}
l(fh, "registerTileCriteriaConfigControls");
function gh(t) {
  if (Array.isArray(t)) return t;
  if (t instanceof Map) return Array.from(t.values());
  if (t && typeof t == "object") {
    if (typeof t.values == "function")
      try {
        const n = Array.from(t.values());
        if (n.length > 0) return n;
      } catch {
      }
    return Object.values(t);
  }
  return [];
}
l(gh, "toList");
function hh(t, n) {
  const e = t == null ? void 0 : t.tools;
  return Array.isArray(e) ? e.some((i) => (i == null ? void 0 : i.name) === n) : e instanceof Map ? e.has(n) : e && typeof e == "object" ? n in e ? !0 : Object.values(e).some((i) => (i == null ? void 0 : i.name) === n) : !1;
}
l(hh, "hasTool");
function mh(t, n) {
  if (Array.isArray(t.tools)) {
    t.tools.push(n);
    return;
  }
  if (t.tools instanceof Map) {
    t.tools.set(n.name, n);
    return;
  }
  if (t.tools && typeof t.tools == "object") {
    t.tools[n.name] = n;
    return;
  }
  t.tools = [n];
}
l(mh, "addTool");
function ph() {
  Hooks.on("getSceneControlButtons", (t) => {
    var i;
    const n = gh(t);
    if (!n.length) return;
    const e = n.find((r) => (r == null ? void 0 : r.name) === "tiles") ?? n.find((r) => (r == null ? void 0 : r.name) === "tokens" || (r == null ? void 0 : r.name) === "token") ?? n[0];
    e && (hh(e, "eidolonCriteriaSwitcher") || mh(e, {
      name: "eidolonCriteriaSwitcher",
      title: "Criteria Switcher",
      icon: "fa-solid fa-sliders",
      button: !0,
      toggle: !1,
      visible: eo(((i = game.scenes) == null ? void 0 : i.viewed) ?? null),
      onClick: /* @__PURE__ */ l(() => sl(), "onClick")
    }));
  });
}
l(ph, "registerSceneControlButton");
function Lr(t, n) {
  if (!t || typeof t != "object") return !1;
  const e = String(n).split(".");
  let i = t;
  for (const r of e) {
    if (!i || typeof i != "object" || !Object.prototype.hasOwnProperty.call(i, r)) return !1;
    i = i[r];
  }
  return !0;
}
l(Lr, "hasOwnPath");
function yh() {
  const t = /* @__PURE__ */ l((i, r = null) => {
    i && ag(i, r);
  }, "invalidateTileScene"), n = /* @__PURE__ */ l((i, r = null) => {
    i && wg(i, r);
  }, "invalidatePlaceableScene");
  Hooks.on("createTile", (i) => {
    t((i == null ? void 0 : i.parent) ?? null, i ?? null);
  }), Hooks.on("deleteTile", (i) => {
    t((i == null ? void 0 : i.parent) ?? null, i ?? null);
  }), Hooks.on("updateTile", (i, r) => {
    (Lr(r, `flags.${ae}.tileCriteria`) || Lr(r, `flags.${ae}.fileIndex`)) && t((i == null ? void 0 : i.parent) ?? null, i ?? null);
  });
  const e = /* @__PURE__ */ l((i) => {
    Hooks.on(`create${i}`, (r) => {
      n((r == null ? void 0 : r.parent) ?? null, r ?? null);
    }), Hooks.on(`delete${i}`, (r) => {
      n((r == null ? void 0 : r.parent) ?? null, r ?? null);
    }), Hooks.on(`update${i}`, (r, a) => {
      const o = Lr(a, `flags.${ae}.presets`), s = i === "AmbientLight" && Lr(a, `flags.${ae}.lightCriteria`);
      !o && !s || n((r == null ? void 0 : r.parent) ?? null, r ?? null);
    });
  }, "registerPlaceableHooks");
  e("AmbientLight"), e("Wall"), e("AmbientSound"), Hooks.on("canvasReady", (i) => {
    const r = (i == null ? void 0 : i.scene) ?? null;
    r && (t(r), n(r));
  });
}
l(yh, "registerCriteriaCacheInvalidationHooks");
function bh() {
  ph(), fh(), yh(), Hooks.once("init", () => {
    var t, n;
    (n = (t = game.keybindings) == null ? void 0 : t.register) == null || n.call(t, ae, "toggleCriteriaSwitcher", {
      name: "Toggle Criteria Switcher",
      hint: "Open or close the criteria switcher window for live scene state updates.",
      editable: [{ key: "KeyM", modifiers: ["Alt"] }],
      onDown: /* @__PURE__ */ l(() => {
        var e, i, r;
        return eo(((e = game.scenes) == null ? void 0 : e.viewed) ?? null) ? (sl(), !0) : ((r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "You do not have permission to manage scene criteria."), !0);
      }, "onDown"),
      restricted: !0,
      precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
    });
  }), Hooks.on("canvasReady", (t) => {
    var e;
    const n = io();
    n && (n.setScene((t == null ? void 0 : t.scene) ?? ((e = game.scenes) == null ? void 0 : e.viewed) ?? null), n.render({ force: !0 }));
  }), Hooks.once("ready", () => {
    var n, e;
    const t = (e = (n = game.modules) == null ? void 0 : n.get) == null ? void 0 : e.call(n, ae);
    t && (t.api || (t.api = {}), t.api.criteria = kg, console.log(`${ae} | Criteria engine API registered`));
  });
}
l(bh, "registerCriteriaEngineHooks");
bh();
const Rr = /* @__PURE__ */ new WeakMap(), Ir = /* @__PURE__ */ new WeakMap(), Te = "__eidolon_default__";
function wh() {
  Hooks.on("renderAmbientLightConfig", vh), k("LightCriteria | AmbientLightConfig controls registered");
}
l(wh, "registerAmbientLightCriteriaControls");
function vh(t, n) {
  var e;
  mi("LightCriteria | renderAmbientLightConfig", {
    appId: (t == null ? void 0 : t.id) ?? null,
    constructor: ((e = t == null ? void 0 : t.constructor) == null ? void 0 : e.name) ?? null,
    isRendered: (t == null ? void 0 : t.rendered) ?? !1
  });
  try {
    const i = jt(n);
    if (!i) return;
    if (!Xa()) {
      i.querySelectorAll(".eidolon-light-criteria, .eidolon-light-criteria-main-switcher").forEach((r) => r.remove());
      return;
    }
    Eh(t, i);
  } catch (i) {
    console.error("eidolon-utilities | Failed to enhance AmbientLightConfig UI", i);
  } finally {
    cn();
  }
}
l(vh, "handleAmbientLightConfigRender");
function Eh(t, n) {
  var De, vn, Ci, yr, El;
  const e = (t == null ? void 0 : t.form) instanceof HTMLFormElement ? t.form : n instanceof HTMLFormElement ? n : (De = n == null ? void 0 : n.closest) == null ? void 0 : De.call(n, "form");
  if (!(e instanceof HTMLFormElement)) return;
  const i = e.querySelector(".window-content");
  if (!(i instanceof HTMLElement)) return;
  const r = _u(t);
  if (!r) return;
  const a = Uh(r);
  k("LightCriteria | Resolved ambient light", {
    sheetId: (r == null ? void 0 : r.id) ?? null,
    persistedId: (a == null ? void 0 : a.id) ?? null,
    sameRef: r === a
  });
  const o = (a == null ? void 0 : a.parent) ?? r.parent ?? null, s = o ? If(o) : [], c = s.filter(
    ($) => Array.isArray($ == null ? void 0 : $.values) && $.values.length > 0
  ), u = Dh(s), d = s.map(($) => typeof ($ == null ? void 0 : $.id) == "string" ? $.id : null).filter(($) => !!$), g = a ?? r, p = o ? lt(o) : [];
  let b = gu(g);
  const y = ug(b, p);
  JSON.stringify(y) !== JSON.stringify(b) && (b = y, hu(g, y).catch(($) => {
    console.warn("eidolon-utilities | Failed to persist migrated light criteria keys", $);
  })), k("LightCriteria | Loaded mapping state", {
    hasBase: !!(b != null && b.base),
    mappingCount: Array.isArray(b == null ? void 0 : b.mappings) ? b.mappings.length : 0,
    mappings: Array.isArray(b == null ? void 0 : b.mappings) ? b.mappings.map(($) => {
      var j, Z;
      return {
        id: $.id,
        key: $.key,
        hasColor: !!((Z = (j = $.config) == null ? void 0 : j.config) != null && Z.color)
      };
    }) : []
  });
  const m = i.querySelector(".eidolon-light-criteria");
  m && m.remove(), i.querySelectorAll(".eidolon-light-criteria-main-switcher").forEach(($) => $.remove());
  const v = document.createElement("fieldset");
  v.classList.add("eidolon-light-criteria");
  const E = document.createElement("legend");
  E.textContent = w("EIDOLON.LightCriteria.Legend", "Scene Criteria Lighting"), v.appendChild(E);
  const C = document.createElement("p");
  C.classList.add("notes"), C.textContent = w(
    "EIDOLON.LightCriteria.Description",
    "Capture a base lighting state, then map criteria values to lighting configurations."
  ), v.appendChild(C);
  const M = document.createElement("div");
  M.classList.add("eidolon-light-criteria__controls");
  const D = document.createElement("button");
  D.type = "button", D.dataset.action = "make-default", D.classList.add("eidolon-light-criteria__button"), D.textContent = w(
    "EIDOLON.LightCriteria.SetBase",
    "Set Base"
  ), M.appendChild(D);
  const F = document.createElement("button");
  F.type = "button", F.dataset.action = "create-mapping", F.classList.add("eidolon-light-criteria__button"), F.textContent = w(
    "EIDOLON.LightCriteria.CreateMapping",
    "Add Criteria Mapping"
  ), F.setAttribute("aria-expanded", "false"), M.appendChild(F), v.appendChild(M);
  const P = document.createElement("p");
  P.classList.add("notes", "eidolon-light-criteria__status"), v.appendChild(P);
  const H = document.createElement("div");
  H.classList.add("eidolon-light-criteria__switcher");
  const ne = document.createElement("label");
  ne.classList.add("eidolon-light-criteria__switcher-label");
  const ie = `${(t == null ? void 0 : t.id) ?? (r == null ? void 0 : r.id) ?? "eidolon-light"}-mapping-select`;
  ne.htmlFor = ie, ne.textContent = w("EIDOLON.LightCriteria.SelectLabel", "Criteria Mapping"), H.appendChild(ne);
  const V = document.createElement("details");
  V.classList.add("eidolon-light-criteria__filter-details");
  const K = document.createElement("summary");
  K.classList.add("eidolon-light-criteria__filter-summary");
  const _ = document.createElement("span");
  _.classList.add("eidolon-light-criteria__filter-summary-label"), _.textContent = w(
    "EIDOLON.LightCriteria.FilterHeading",
    "Filter mappings"
  ), K.appendChild(_);
  const z = document.createElement("span");
  z.classList.add("eidolon-light-criteria__filter-meta"), K.appendChild(z), V.appendChild(K);
  const G = document.createElement("div");
  G.classList.add("eidolon-light-criteria__filter-panel");
  const X = document.createElement("div");
  X.classList.add("eidolon-light-criteria__filter-grid");
  for (const $ of c) {
    const j = document.createElement("label");
    j.classList.add("eidolon-light-criteria__filter");
    const Z = document.createElement("span");
    Z.classList.add("eidolon-light-criteria__filter-name"), Z.textContent = (Ci = (vn = $.name) == null ? void 0 : vn.trim) != null && Ci.call(vn) ? $.name.trim() : w("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), j.appendChild(Z);
    const ee = document.createElement("select");
    ee.dataset.filterCategoryId = $.id, ee.classList.add("eidolon-light-criteria__filter-select");
    const re = document.createElement("option");
    re.value = "", re.textContent = w("EIDOLON.LightCriteria.FilterAny", "Any"), ee.appendChild(re);
    for (const he of $.values) {
      const me = document.createElement("option");
      me.value = he, me.textContent = he, ee.appendChild(me);
    }
    j.appendChild(ee), X.appendChild(j);
  }
  G.appendChild(X);
  const U = document.createElement("div");
  U.classList.add("eidolon-light-criteria__filter-actions");
  const I = document.createElement("button");
  I.type = "button", I.dataset.action = "clear-mapping-filters", I.classList.add("eidolon-light-criteria__button", "secondary", "compact"), I.textContent = w("EIDOLON.LightCriteria.ClearFilters", "Clear Filters"), U.appendChild(I), G.appendChild(U), V.appendChild(G), V.hidden = c.length === 0, H.appendChild(V);
  const O = document.createElement("div");
  O.classList.add("eidolon-light-criteria__switcher-controls"), H.appendChild(O);
  const A = document.createElement("select");
  A.id = ie, A.classList.add("eidolon-light-criteria__select"), A.dataset.action = "select-mapping", O.appendChild(A);
  const x = document.createElement("button");
  x.type = "button", x.dataset.action = "apply-selected-mapping", x.classList.add("eidolon-light-criteria__button", "secondary"), x.textContent = w("EIDOLON.LightCriteria.ApplyButton", "Apply"), O.appendChild(x);
  const q = document.createElement("details");
  q.classList.add("eidolon-light-criteria__menu"), q.dataset.action = "mapping-actions-menu";
  const ce = document.createElement("summary");
  ce.classList.add("eidolon-light-criteria__menu-toggle"), ce.innerHTML = '<i class="fa-solid fa-ellipsis-vertical" inert=""></i>', ce.setAttribute(
    "aria-label",
    w("EIDOLON.LightCriteria.MoreActions", "More actions")
  ), ce.dataset.tooltip = w("EIDOLON.LightCriteria.MoreActions", "More actions"), q.appendChild(ce);
  const se = document.createElement("div");
  se.classList.add("eidolon-light-criteria__menu-list"), q.appendChild(se);
  const fe = document.createElement("button");
  fe.type = "button", fe.dataset.action = "update-selected-mapping", fe.classList.add("eidolon-light-criteria__menu-item"), fe.textContent = w(
    "EIDOLON.LightCriteria.UpdateSelected",
    "Save current config to selected"
  ), se.appendChild(fe);
  const ye = document.createElement("button");
  ye.type = "button", ye.dataset.action = "edit-selected-mapping-criteria", ye.classList.add("eidolon-light-criteria__menu-item"), ye.textContent = w(
    "EIDOLON.LightCriteria.EditSelectedCriteria",
    "Edit selected mapping criteria"
  ), se.appendChild(ye);
  const we = document.createElement("button");
  we.type = "button", we.dataset.action = "remove-selected-mapping", we.classList.add("eidolon-light-criteria__menu-item", "danger"), we.textContent = w(
    "EIDOLON.LightCriteria.RemoveSelected",
    "Delete selected mapping"
  ), se.appendChild(we), O.appendChild(q);
  const Pe = document.createElement("div");
  Pe.classList.add("eidolon-light-criteria-main-switcher"), Pe.appendChild(H);
  const ke = document.createElement("p");
  if (ke.classList.add("notes", "eidolon-light-criteria-main-switcher__empty"), ke.textContent = w(
    "EIDOLON.LightCriteria.ActiveRequiresBase",
    "Set Base Lighting to enable mapping selection and actions."
  ), Pe.appendChild(ke), s.length === 0) {
    const $ = document.createElement("p");
    $.classList.add("notification", "warning", "eidolon-light-criteria__warning"), $.textContent = w(
      "EIDOLON.LightCriteria.NoCategoriesWarning",
      "This scene has no criteria configured. Add criteria under Scene -> Criteria to enable criteria-driven lighting."
    ), v.appendChild($);
  } else if (c.length === 0) {
    const $ = document.createElement("p");
    $.classList.add("notification", "warning", "eidolon-light-criteria__warning"), $.textContent = w(
      "EIDOLON.LightCriteria.NoValuesWarning",
      "Criteria exist, but none define selectable values. Add values in Scene -> Criteria."
    ), v.appendChild($);
  }
  const Ae = document.createElement("div");
  Ae.classList.add("eidolon-light-criteria__creation"), Ae.dataset.section = "creation", Ae.hidden = !0;
  const Jn = document.createElement("p");
  Jn.classList.add("notes"), Jn.textContent = w(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ), Ae.appendChild(Jn);
  const xt = document.createElement("div");
  xt.classList.add("eidolon-light-criteria__category-list"), Ae.appendChild(xt);
  for (const $ of c) {
    const j = document.createElement("label");
    j.classList.add("eidolon-light-criteria__category");
    const Z = document.createElement("span");
    Z.classList.add("eidolon-light-criteria__category-name"), Z.textContent = (El = (yr = $.name) == null ? void 0 : yr.trim) != null && El.call(yr) ? $.name.trim() : w("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), j.appendChild(Z);
    const ee = document.createElement("select");
    ee.dataset.categoryId = $.id, ee.classList.add("eidolon-light-criteria__category-select");
    const re = document.createElement("option");
    re.value = "", re.textContent = w(
      "EIDOLON.LightCriteria.IgnoreCategory",
      "Ignore"
    ), ee.appendChild(re);
    for (const he of $.values) {
      const me = document.createElement("option");
      me.value = he, me.textContent = he, ee.appendChild(me);
    }
    j.appendChild(ee), xt.appendChild(j);
  }
  const wn = document.createElement("div");
  wn.classList.add("eidolon-light-criteria__creation-actions");
  const Ze = document.createElement("button");
  Ze.type = "button", Ze.dataset.action = "save-mapping", Ze.classList.add("eidolon-light-criteria__button", "primary"), Ze.textContent = w(
    "EIDOLON.LightCriteria.SaveMapping",
    "Save Mapping"
  ), wn.appendChild(Ze);
  const Dt = document.createElement("button");
  Dt.type = "button", Dt.dataset.action = "cancel-create", Dt.classList.add("eidolon-light-criteria__button", "secondary"), Dt.textContent = w(
    "EIDOLON.LightCriteria.Cancel",
    "Cancel"
  ), wn.appendChild(Dt), Ae.appendChild(wn), v.appendChild(Ae), i.prepend(Pe), i.appendChild(v), v.hidden = !0, Sh(t, {
    fieldset: v,
    homeContainer: i
  }), requestAnimationFrame(() => {
    var $;
    ($ = t.setPosition) == null || $.call(t, { height: "auto" });
  });
  let R = b;
  Cn({ switcher: H, emptyState: ke, state: R }), Tn(P, R), Oi(F, {
    state: R,
    hasCategories: c.length > 0
  }), k("LightCriteria | Controls injected", {
    sceneId: (o == null ? void 0 : o.id) ?? null,
    lightId: (r == null ? void 0 : r.id) ?? null,
    hasBase: !!(R != null && R.base),
    mappingCount: Array.isArray(R == null ? void 0 : R.mappings) ? R.mappings.length : 0,
    categories: c.length
  });
  const mr = Hh(R), Y = {
    restoreConfig: null,
    app: t,
    selectedMapping: mr,
    editorMode: "create",
    editingMappingId: null,
    mappingFilters: {}
  };
  Rr.set(v, Y);
  const ct = /* @__PURE__ */ l(() => {
    q.open = !1;
  }, "closeActionsMenu");
  ce.addEventListener("click", ($) => {
    q.classList.contains("is-disabled") && ($.preventDefault(), ct());
  });
  const xe = /* @__PURE__ */ l(($ = Y.selectedMapping) => {
    const j = $h(X), Z = Array.isArray(R == null ? void 0 : R.mappings) ? R.mappings : [], ee = _h(Z, j), re = Object.keys(j).length;
    Y.mappingFilters = j, I.disabled = re === 0, Ph(z, {
      totalCount: Z.length,
      visibleCount: ee.length,
      hasFilters: re > 0,
      activeFilterCount: re
    }), V.classList.toggle("has-active-filters", re > 0), Rh(A, R, u, $, {
      mappings: ee,
      categoryOrder: d
    }), Y.selectedMapping = A.value ?? "", Lo({
      mappingSelect: A,
      applyMappingButton: x,
      updateMappingButton: fe,
      editCriteriaButton: ye,
      removeMappingButton: we,
      actionsMenu: q,
      state: R
    }), q.classList.contains("is-disabled") && ct();
  }, "refreshMappingSelector");
  X.querySelectorAll("select[data-filter-category-id]").forEach(($) => {
    $.addEventListener("change", () => {
      const j = Y.selectedMapping;
      xe(j), Y.selectedMapping !== j && Io(
        a ?? r,
        R,
        Y.selectedMapping
      ).then((Z) => {
        Z && (R = Z);
      });
    });
  }), I.addEventListener("click", () => {
    Fh(X);
    const $ = Y.selectedMapping;
    xe($), V.open = !1, Y.selectedMapping !== $ && Io(
      a ?? r,
      R,
      Y.selectedMapping
    ).then((j) => {
      j && (R = j);
    });
  }), A.addEventListener("change", () => {
    Y.selectedMapping = A.value ?? "", Lo({
      mappingSelect: A,
      applyMappingButton: x,
      updateMappingButton: fe,
      editCriteriaButton: ye,
      removeMappingButton: we,
      actionsMenu: q,
      state: R
    }), Io(
      a ?? r,
      R,
      Y.selectedMapping
    ).then(($) => {
      $ && (R = $);
    });
  });
  const Ti = /* @__PURE__ */ l(async () => {
    var ee, re, he, me, et, Vt, tt, zt, ve, Gt, Wt, vt, En, Si;
    const $ = A.value ?? "";
    if (!$) {
      (re = (ee = ui.notifications) == null ? void 0 : ee.warn) == null || re.call(
        ee,
        w(
          "EIDOLON.LightCriteria.SelectMappingWarning",
          "Choose a criteria mapping before applying."
        )
      ), xe(Y.selectedMapping);
      return;
    }
    if ($ === Te) {
      if (!(R != null && R.base)) {
        (me = (he = ui.notifications) == null ? void 0 : he.warn) == null || me.call(
          he,
          w(
            "EIDOLON.LightCriteria.BaseUnavailable",
            "Set a base lighting state before applying it."
          )
        );
        return;
      }
      Or(v, Ae, F), qr(t, e, R.base), R = await _i(a ?? r, {
        mappingId: Te,
        categories: null,
        updatedAt: Date.now()
      }), Y.selectedMapping = Te, xe(Y.selectedMapping), Tn(P, R), Cn({ switcher: H, emptyState: ke, state: R }), Oi(F, {
        state: R,
        hasCategories: c.length > 0
      }), Yl(e, {
        mappingId: Te,
        color: ((Vt = (et = R.base) == null ? void 0 : et.config) == null ? void 0 : Vt.color) ?? null
      }), (zt = (tt = ui.notifications) == null ? void 0 : tt.info) == null || zt.call(
        tt,
        w(
          "EIDOLON.LightCriteria.BaseApplied",
          "Applied the base lighting state to the form."
        )
      ), ct();
      return;
    }
    const j = Array.isArray(R == null ? void 0 : R.mappings) && R.mappings.length ? R.mappings.find((Kn) => (Kn == null ? void 0 : Kn.id) === $) : null;
    if (!j) {
      (Gt = (ve = ui.notifications) == null ? void 0 : ve.warn) == null || Gt.call(
        ve,
        w(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      ), Y.selectedMapping = "", xe(Y.selectedMapping);
      return;
    }
    Or(v, Ae, F), qr(t, e, j.config), R = await _i(a ?? r, {
      mappingId: j.id,
      categories: j.categories,
      updatedAt: Date.now()
    }), Y.selectedMapping = j.id, xe(Y.selectedMapping), Tn(P, R), Cn({ switcher: H, emptyState: ke, state: R }), Oi(F, {
      state: R,
      hasCategories: c.length > 0
    }), Yl(e, {
      mappingId: j.id,
      color: ((vt = (Wt = j.config) == null ? void 0 : Wt.config) == null ? void 0 : vt.color) ?? null
    });
    const Z = oi(j, u, d);
    (Si = (En = ui.notifications) == null ? void 0 : En.info) == null || Si.call(
      En,
      w(
        "EIDOLON.LightCriteria.MappingApplied",
        "Applied mapping: {label}"
      ).replace("{label}", Z)
    ), ct();
  }, "applySelectedMapping");
  x.addEventListener("click", () => {
    Ti();
  }), A.addEventListener("keydown", ($) => {
    $.key === "Enter" && ($.preventDefault(), Ti());
  });
  const pr = /* @__PURE__ */ l(async () => {
    var j, Z, ee, re, he, me, et, Vt, tt, zt, ve, Gt, Wt, vt, En, Si, Kn, br, Tl, wr, Cl;
    const $ = Y.selectedMapping;
    if (!$) {
      (Z = (j = ui.notifications) == null ? void 0 : j.warn) == null || Z.call(
        j,
        w(
          "EIDOLON.LightCriteria.SelectMappingWarning",
          "Choose a criteria mapping before applying."
        )
      );
      return;
    }
    fe.disabled = !0;
    try {
      const We = Hr(t, a);
      if ($ === Te)
        R = await Bl(a ?? r, We), k("LightCriteria | Base lighting updated", {
          lightId: ((ee = a ?? r) == null ? void 0 : ee.id) ?? null,
          configColor: ((re = We == null ? void 0 : We.config) == null ? void 0 : re.color) ?? null
        }), (me = (he = ui.notifications) == null ? void 0 : he.info) == null || me.call(
          he,
          w(
            "EIDOLON.LightCriteria.BaseUpdated",
            "Updated the base lighting state with the current configuration."
          )
        ), Y.selectedMapping = Te;
      else {
        const Yn = Pi(R, $);
        if (!Yn) {
          (Vt = (et = ui.notifications) == null ? void 0 : et.warn) == null || Vt.call(
            et,
            w(
              "EIDOLON.LightCriteria.MappingUnavailable",
              "The selected criteria mapping is no longer available."
            )
          ), Y.selectedMapping = "", xe(Y.selectedMapping);
          return;
        }
        R = await jl(
          a ?? r,
          Yn.categories,
          We,
          { label: Yn.label ?? null }
        ), k("LightCriteria | Mapping updated", {
          mappingId: $,
          hasColor: !!((tt = We == null ? void 0 : We.config) != null && tt.color),
          stored: Array.isArray(R == null ? void 0 : R.mappings) ? ((zt = R.mappings.find((uo) => (uo == null ? void 0 : uo.id) === $)) == null ? void 0 : zt.config) ?? null : null,
          persisted: (Gt = (ve = a ?? r) == null ? void 0 : ve.getFlag) == null ? void 0 : Gt.call(ve, jn, ai)
        });
        const Li = Pi(R, $), Pd = oi(Li || Yn, u, d);
        k("LightCriteria | Mapping updated", {
          mappingId: $,
          categories: Yn.categories,
          updatedColor: ((Wt = We == null ? void 0 : We.config) == null ? void 0 : Wt.color) ?? null,
          storedColor: ((En = (vt = Li == null ? void 0 : Li.config) == null ? void 0 : vt.config) == null ? void 0 : En.color) ?? ((Kn = (Si = Yn.config) == null ? void 0 : Si.config) == null ? void 0 : Kn.color) ?? null
        }), (Tl = (br = ui.notifications) == null ? void 0 : br.info) == null || Tl.call(
          br,
          w(
            "EIDOLON.LightCriteria.MappingUpdated",
            "Saved changes to mapping: {label}"
          ).replace("{label}", Pd)
        ), Y.selectedMapping = $;
      }
      Tn(P, R), Cn({ switcher: H, emptyState: ke, state: R }), Oi(F, {
        state: R,
        hasCategories: c.length > 0
      }), xe(Y.selectedMapping), ct();
    } catch (We) {
      console.error("eidolon-utilities | Failed to update light criteria mapping", We), (Cl = (wr = ui.notifications) == null ? void 0 : wr.error) == null || Cl.call(
        wr,
        w(
          "EIDOLON.LightCriteria.MappingUpdateError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      fe.disabled = !1, Lo({
        mappingSelect: A,
        applyMappingButton: x,
        updateMappingButton: fe,
        editCriteriaButton: ye,
        removeMappingButton: we,
        actionsMenu: q,
        state: R
      });
    }
  }, "updateSelectedMapping");
  fe.addEventListener("click", () => {
    pr();
  }), xe(Y.selectedMapping), D.addEventListener("click", async () => {
    var $, j, Z, ee, re, he;
    D.disabled = !0;
    try {
      const me = Hr(t, a);
      R = await Bl(a ?? r, me), k("LightCriteria | Base lighting stored", {
        lightId: (($ = a ?? r) == null ? void 0 : $.id) ?? null,
        configColor: ((j = me == null ? void 0 : me.config) == null ? void 0 : j.color) ?? null
      }), (ee = (Z = ui.notifications) == null ? void 0 : Z.info) == null || ee.call(
        Z,
        w(
          "EIDOLON.LightCriteria.BaseStored",
          "Saved the current configuration as the base lighting state."
        )
      ), Tn(P, R), Cn({ switcher: H, emptyState: ke, state: R }), Oi(F, {
        state: R,
        hasCategories: c.length > 0
      }), Y.selectedMapping = Te, xe(Y.selectedMapping);
    } catch (me) {
      console.error("eidolon-utilities | Failed to store base light criteria state", me), (he = (re = ui.notifications) == null ? void 0 : re.error) == null || he.call(
        re,
        w(
          "EIDOLON.LightCriteria.BaseError",
          "Failed to save the base lighting state. Check the console for details."
        )
      );
    } finally {
      D.disabled = !1;
    }
  }), F.addEventListener("click", () => {
    var j, Z, ee, re;
    if (!(R != null && R.base)) {
      (Z = (j = ui.notifications) == null ? void 0 : j.warn) == null || Z.call(
        j,
        w(
          "EIDOLON.LightCriteria.RequiresBase",
          "Set a base lighting state before adding criteria mappings."
        )
      );
      return;
    }
    if (c.length === 0) {
      (re = (ee = ui.notifications) == null ? void 0 : ee.warn) == null || re.call(
        ee,
        w(
          "EIDOLON.LightCriteria.NoCategoriesAvailable",
          "Add scene criteria with values in the Scene configuration before creating mappings."
        )
      );
      return;
    }
    const $ = Rr.get(v);
    Kl({
      app: t,
      fieldset: v,
      createButton: F,
      creationSection: Ae,
      categoryList: xt,
      form: e,
      persistedLight: a,
      stateEntry: $,
      mode: "create",
      mapping: null,
      preloadConfig: R.base
    });
  }), ye.addEventListener("click", () => {
    var Z, ee, re, he;
    const $ = Y.selectedMapping;
    if (!$ || $ === Te) {
      (ee = (Z = ui.notifications) == null ? void 0 : Z.warn) == null || ee.call(
        Z,
        w(
          "EIDOLON.LightCriteria.SelectMappingForCriteriaEdit",
          "Select a mapping before editing criteria."
        )
      );
      return;
    }
    const j = Pi(R, $);
    if (!j) {
      (he = (re = ui.notifications) == null ? void 0 : re.warn) == null || he.call(
        re,
        w(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      );
      return;
    }
    ct(), Fu(t, { fieldset: v, homeContainer: i }), Kl({
      app: t,
      fieldset: v,
      createButton: F,
      creationSection: Ae,
      categoryList: xt,
      form: e,
      persistedLight: a,
      stateEntry: Y,
      mode: "retarget",
      mapping: j,
      preloadConfig: j.config
    });
  }), Ze.addEventListener("click", async () => {
    var j, Z, ee, re, he, me, et, Vt, tt, zt;
    const $ = jh(xt);
    if (!$) {
      (Z = (j = ui.notifications) == null ? void 0 : j.warn) == null || Z.call(
        j,
        w(
          "EIDOLON.LightCriteria.SelectionRequired",
          "Select at least one criteria value to identify the mapping."
        )
      );
      return;
    }
    Ze.disabled = !0;
    try {
      const ve = Hr(t, a);
      if (Y.editorMode === "retarget" && Y.editingMappingId) {
        const Wt = ws(R, $);
        let vt = !1;
        if (Wt && Wt !== Y.editingMappingId && (vt = await Th(), !vt)) {
          Ze.disabled = !1;
          return;
        }
        R = await sg(
          a ?? r,
          Y.editingMappingId,
          $,
          ve,
          { replaceExisting: vt }
        ), k("LightCriteria | Mapping criteria retargeted", {
          mappingId: Y.editingMappingId,
          categories: $,
          replaced: vt,
          configColor: ((ee = ve == null ? void 0 : ve.config) == null ? void 0 : ee.color) ?? null
        }), (he = (re = ui.notifications) == null ? void 0 : re.info) == null || he.call(
          re,
          w(
            "EIDOLON.LightCriteria.MappingCriteriaUpdated",
            "Updated mapping criteria for the selected mapping."
          )
        );
      } else
        R = await jl(
          a ?? r,
          $,
          ve,
          {}
        ), k("LightCriteria | Mapping saved from editor", {
          categories: $,
          configColor: ((me = ve == null ? void 0 : ve.config) == null ? void 0 : me.color) ?? null
        }), (Vt = (et = ui.notifications) == null ? void 0 : et.info) == null || Vt.call(
          et,
          w(
            "EIDOLON.LightCriteria.MappingSaved",
            "Updated lighting mapping for the selected scene criteria."
          )
        );
      Tn(P, R), Cn({ switcher: H, emptyState: ke, state: R });
      const Gt = ws(R, $);
      Gt && (Y.selectedMapping = Gt), xe(Y.selectedMapping), Or(v, Ae, F), ct();
    } catch (ve) {
      console.error("eidolon-utilities | Failed to persist light criteria mapping", ve), (zt = (tt = ui.notifications) == null ? void 0 : tt.error) == null || zt.call(
        tt,
        w(
          "EIDOLON.LightCriteria.MappingError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      Ze.disabled = !1;
    }
  }), Dt.addEventListener("click", () => {
    const $ = Rr.get(v);
    $ != null && $.restoreConfig && qr(t, e, $.restoreConfig), Or(v, Ae, F);
  }), we.addEventListener("click", async () => {
    var Z, ee;
    const $ = Y.selectedMapping;
    !$ || $ === Te || !await Ch() || (R = await lg(a ?? r, $), Y.selectedMapping = "", Tn(P, R), Cn({ switcher: H, emptyState: ke, state: R }), xe(Y.selectedMapping), ct(), (ee = (Z = ui.notifications) == null ? void 0 : Z.info) == null || ee.call(
      Z,
      w("EIDOLON.LightCriteria.MappingRemoved", "Removed selected mapping.")
    ));
  });
}
l(Eh, "enhanceAmbientLightConfig");
function Kl({
  app: t,
  fieldset: n,
  createButton: e,
  creationSection: i,
  categoryList: r,
  form: a,
  persistedLight: o,
  stateEntry: s,
  mode: c,
  mapping: u,
  preloadConfig: d
}) {
  s && (s.restoreConfig = Hr(t, o), s.editorMode = c, s.editingMappingId = c === "retarget" ? (u == null ? void 0 : u.id) ?? null : null), d && qr(t, a, d), c === "retarget" && (u != null && u.categories) ? Bh(r, u.categories) : qh(r);
  const g = i.querySelector("p.notes");
  g instanceof HTMLElement && (g.textContent = c === "retarget" ? w(
    "EIDOLON.LightCriteria.EditCriteriaDescription",
    "Adjust criteria values for the selected mapping."
  ) : w(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const p = i.querySelector('button[data-action="save-mapping"]');
  p instanceof HTMLButtonElement && (p.textContent = c === "retarget" ? w("EIDOLON.LightCriteria.SaveCriteriaChanges", "Save Criteria Changes") : w("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), i.hidden = !1, e.setAttribute("aria-expanded", "true"), ll(n, i), requestAnimationFrame(() => {
    var b;
    (b = t.setPosition) == null || b.call(t, { height: "auto" });
  });
}
l(Kl, "openMappingEditor");
async function Th() {
  var e, i;
  const t = (i = (e = foundry == null ? void 0 : foundry.applications) == null ? void 0 : e.api) == null ? void 0 : i.DialogV2;
  if (typeof (t == null ? void 0 : t.confirm) == "function")
    return t.confirm({
      window: { title: w("EIDOLON.LightCriteria.ConflictTitle", "Replace Existing Mapping?") },
      content: `<p>${w(
        "EIDOLON.LightCriteria.ConflictBody",
        "A mapping already exists for this criteria combination. Replace it with the edited mapping?"
      )}</p>`,
      rejectClose: !1
    });
  const n = globalThis.Dialog;
  return typeof (n == null ? void 0 : n.confirm) != "function" ? !1 : n.confirm({
    title: w("EIDOLON.LightCriteria.ConflictTitle", "Replace Existing Mapping?"),
    content: `<p>${w(
      "EIDOLON.LightCriteria.ConflictBody",
      "A mapping already exists for this criteria combination. Replace it with the edited mapping?"
    )}</p>`,
    yes: /* @__PURE__ */ l(() => !0, "yes"),
    no: /* @__PURE__ */ l(() => !1, "no"),
    defaultYes: !1
  });
}
l(Th, "confirmCriteriaConflict");
async function Ch() {
  var e, i;
  const t = (i = (e = foundry == null ? void 0 : foundry.applications) == null ? void 0 : e.api) == null ? void 0 : i.DialogV2;
  if (typeof (t == null ? void 0 : t.confirm) == "function")
    return t.confirm({
      window: { title: w("EIDOLON.LightCriteria.RemoveTitle", "Remove Mapping?") },
      content: `<p>${w(
        "EIDOLON.LightCriteria.RemoveBody",
        "Remove the currently selected mapping? This cannot be undone."
      )}</p>`,
      rejectClose: !1
    });
  const n = globalThis.Dialog;
  return typeof (n == null ? void 0 : n.confirm) != "function" ? !1 : n.confirm({
    title: w("EIDOLON.LightCriteria.RemoveTitle", "Remove Mapping?"),
    content: `<p>${w(
      "EIDOLON.LightCriteria.RemoveBody",
      "Remove the currently selected mapping? This cannot be undone."
    )}</p>`,
    yes: /* @__PURE__ */ l(() => !0, "yes"),
    no: /* @__PURE__ */ l(() => !1, "no"),
    defaultYes: !1
  });
}
l(Ch, "confirmRemoveMapping");
function Sh(t, { fieldset: n, homeContainer: e }) {
  const i = Oh(t, e);
  if (!(i instanceof HTMLElement)) return;
  const r = i.querySelector(".window-header");
  if (!(r instanceof HTMLElement)) return;
  let a = r.querySelector('[data-eidolon-action="open-light-criteria-manager"]');
  if (!(a instanceof HTMLButtonElement)) {
    a = document.createElement("button"), a.type = "button", a.classList.add("header-control", "icon"), a.dataset.eidolonAction = "open-light-criteria-manager", a.dataset.tooltip = w("EIDOLON.LightCriteria.OpenManager", "Open Scene Criteria Lighting"), a.setAttribute("aria-label", w("EIDOLON.LightCriteria.OpenManager", "Open Scene Criteria Lighting")), a.innerHTML = '<i class="fa-solid fa-sliders" inert=""></i>';
    const o = r.querySelector(".window-controls") ?? r, s = o.querySelector('[data-action="toggleControls"]');
    if ((s == null ? void 0 : s.parentElement) === o)
      o.insertBefore(a, s);
    else {
      const c = o.querySelector('[data-action="close"]');
      (c == null ? void 0 : c.parentElement) === o ? o.insertBefore(a, c) : o.appendChild(a);
    }
  }
  a.onclick = (o) => {
    o.preventDefault(), Fu(t, { fieldset: n, homeContainer: e });
  };
}
l(Sh, "ensureManagerHeaderButton");
function Fu(t, { fieldset: n, homeContainer: e }) {
  var p, b, y;
  const i = Ir.get(t);
  if (i != null && i.rendered) {
    (p = i.bringToTop) == null || p.call(i);
    return;
  }
  const r = /* @__PURE__ */ l((...m) => {
    var C;
    const v = Lh(m), E = (C = v == null ? void 0 : v.querySelector) == null ? void 0 : C.call(v, ".eidolon-light-criteria-manager-host");
    E instanceof HTMLElement && (Ih(n), n.hidden = !1, E.appendChild(n));
  }, "onRender"), a = /* @__PURE__ */ l(() => {
    e instanceof HTMLElement && e.appendChild(n), n.hidden = !0, Ir.delete(t), requestAnimationFrame(() => {
      var m;
      (m = t.setPosition) == null || m.call(t, { height: "auto" });
    });
  }, "onClose"), o = w("EIDOLON.LightCriteria.ManagerTitle", "Scene Criteria Lighting"), s = '<div class="eidolon-light-criteria-manager-host"></div>', c = w("EIDOLON.LightCriteria.Close", "Close"), u = (y = (b = foundry == null ? void 0 : foundry.applications) == null ? void 0 : b.api) == null ? void 0 : y.DialogV2;
  if (typeof (u == null ? void 0 : u.wait) == "function")
    try {
      let m = !1;
      const v = /* @__PURE__ */ l(() => {
        m || (m = !0, a());
      }, "closeOnce");
      Ir.set(t, {
        rendered: !0,
        bringToTop: /* @__PURE__ */ l(() => {
        }, "bringToTop")
      }), u.wait({
        window: { title: o },
        content: s,
        buttons: [{ action: "close", label: c, default: !0 }],
        render: /* @__PURE__ */ l((...E) => r(...E), "render"),
        close: v,
        rejectClose: !1
      }).catch((E) => {
        console.warn("eidolon-utilities | DialogV2 manager failed, falling back to Dialog", E), v();
      });
      return;
    } catch (m) {
      console.warn("eidolon-utilities | DialogV2 manager failed, falling back to Dialog", m), a();
    }
  const d = globalThis.Dialog;
  if (typeof d != "function") return;
  const g = new d(
    {
      title: o,
      content: s,
      buttons: {
        close: {
          label: c
        }
      },
      render: /* @__PURE__ */ l((...m) => r(...m), "render"),
      close: a
    },
    {
      width: 640,
      resizable: !0
    }
  );
  Ir.set(t, g), g.render(!0);
}
l(Fu, "openManagerDialog");
function Lh(t) {
  for (const n of t) {
    const e = jt(n);
    if (e) return e;
    const i = jt(n == null ? void 0 : n.element);
    if (i) return i;
  }
  return null;
}
l(Lh, "findDialogRoot");
function Ih(t) {
  if (!(t instanceof HTMLElement) || t.dataset.managerLayout === "true") return;
  t.dataset.managerLayout = "true", t.classList.add("is-manager");
  const n = t.querySelector("legend"), e = t.querySelector("p.notes:not(.eidolon-light-criteria__status)"), i = t.querySelector(".eidolon-light-criteria__controls"), r = t.querySelector(".eidolon-light-criteria__status"), a = t.querySelector(".eidolon-light-criteria__creation"), o = Array.from(t.querySelectorAll(".eidolon-light-criteria__warning")), s = document.createElement("div");
  s.classList.add("eidolon-light-criteria-manager");
  const c = document.createElement("section");
  c.classList.add("eidolon-light-criteria-manager__section", "is-top"), s.appendChild(c);
  const u = document.createElement("section");
  u.classList.add("eidolon-light-criteria-manager__section", "is-bottom"), s.appendChild(u);
  const d = document.createElement("div");
  if (d.classList.add("eidolon-light-criteria-manager__header"), d.textContent = w("EIDOLON.LightCriteria.ManagerHeader", "Base State"), c.appendChild(d), r && c.appendChild(r), i && c.appendChild(i), o.length) {
    const p = document.createElement("div");
    p.classList.add("eidolon-light-criteria-manager__warnings");
    for (const b of o) p.appendChild(b);
    c.appendChild(p);
  }
  const g = document.createElement("div");
  g.classList.add("eidolon-light-criteria-manager__header"), g.textContent = w("EIDOLON.LightCriteria.ManagerAuthoring", "Create or Update Mapping"), u.appendChild(g), a && u.appendChild(a), t.innerHTML = "", n && t.appendChild(n), e && t.appendChild(e), t.appendChild(s), ll(t, a);
}
l(Ih, "applyManagerLayout");
function Oh(t, n) {
  var i;
  const e = jt(t == null ? void 0 : t.element);
  return e || (((i = n == null ? void 0 : n.closest) == null ? void 0 : i.call(n, ".application")) ?? null);
}
l(Oh, "resolveApplicationRoot");
function Or(t, n, e) {
  const i = Rr.get(t);
  i && (i.restoreConfig = null, i.editorMode = "create", i.editingMappingId = null), n.hidden = !0, e.setAttribute("aria-expanded", "false");
  const r = n.querySelector("p.notes");
  r instanceof HTMLElement && (r.textContent = w(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const a = n.querySelector('button[data-action="save-mapping"]');
  a instanceof HTMLButtonElement && (a.textContent = w("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), ll(t, n), requestAnimationFrame(() => {
    var o, s;
    (s = (o = i == null ? void 0 : i.app) == null ? void 0 : o.setPosition) == null || s.call(o, { height: "auto" });
  });
}
l(Or, "hideCreationSection");
function Tn(t, n) {
  if (!t) return;
  const e = !!(n != null && n.base), i = Array.isArray(n == null ? void 0 : n.mappings) ? n.mappings.length : 0, r = [];
  r.push(
    e ? w(
      "EIDOLON.LightCriteria.StatusBaseSaved",
      "Base lighting saved."
    ) : w(
      "EIDOLON.LightCriteria.StatusBaseMissing",
      "Base lighting not yet saved."
    )
  ), r.push(
    w(
      "EIDOLON.LightCriteria.StatusMappingCount",
      "Mappings: {count}"
    ).replace("{count}", String(i))
  ), t.textContent = r.join(" ");
}
l(Tn, "updateStatusLine");
function Oi(t, { state: n, hasCategories: e }) {
  if (!t) return;
  const i = !!(n != null && n.base), r = i && e;
  t.disabled = !r, t.title = r ? "" : i ? w(
    "EIDOLON.LightCriteria.CreateDisabledNoCategories",
    "Add scene criteria with values before creating mappings."
  ) : w(
    "EIDOLON.LightCriteria.CreateDisabledNoBase",
    "Save a base lighting state before creating criteria mappings."
  );
}
l(Oi, "updateCreateButtonState");
function Hr(t, n) {
  var c, u, d;
  const e = n ?? _u(t);
  if (!e)
    throw new Error("Ambient light document unavailable.");
  const i = Wn(((c = e.toObject) == null ? void 0 : c.call(e)) ?? {});
  if (!i)
    throw new Error("Unable to duplicate ambient light data.");
  const r = (t == null ? void 0 : t.form) instanceof HTMLFormElement ? t.form : null, a = r ? df(r) : {}, o = foundry.utils.mergeObject(i, a, {
    inplace: !1,
    performDeletions: !0
  });
  r && (r.querySelectorAll("color-picker[name]").forEach((g) => {
    var E, C;
    const p = g.getAttribute("name");
    if (!p) return;
    const b = typeof g.value == "string" ? g.value : "", y = ((E = g.ui) == null ? void 0 : E.input) ?? ((C = g.querySelector) == null ? void 0 : C.call(g, 'input[type="color"]')), m = (y == null ? void 0 : y.value) ?? "", v = b || m;
    typeof v != "string" || !v || (foundry.utils.setProperty(o, p, v), k("LightCriteria | Captured color-picker value", {
      path: p,
      pickerValue: b,
      swatchValue: m,
      chosenValue: v
    }));
  }), r.querySelectorAll("range-picker[name]").forEach((g) => {
    var F, P;
    const p = g.getAttribute("name");
    if (!p) return;
    const b = g.value !== void 0 && g.value !== null ? String(g.value) : "", y = (F = g.querySelector) == null ? void 0 : F.call(g, 'input[type="range"]'), m = (P = g.querySelector) == null ? void 0 : P.call(g, 'input[type="number"]'), v = y instanceof HTMLInputElement ? y.value : "", E = m instanceof HTMLInputElement ? m.value : "", C = b || E || v;
    if (typeof C != "string" || !C.length) return;
    const M = Number(C), D = Number.isFinite(M) ? M : C;
    foundry.utils.setProperty(o, p, D), k("LightCriteria | Captured range-picker value", {
      path: p,
      elementValue: b,
      numberValue: E,
      rangeValue: v,
      chosenValue: D
    });
  }));
  const s = Wn(o);
  return k("LightCriteria | Captured form config", {
    lightId: (e == null ? void 0 : e.id) ?? null,
    hasColor: !!((u = s == null ? void 0 : s.config) != null && u.color),
    color: ((d = s == null ? void 0 : s.config) == null ? void 0 : d.color) ?? null
  }), s;
}
l(Hr, "captureAmbientLightFormConfig");
function qr(t, n, e) {
  if (!e || typeof e != "object") return;
  const i = foundry.utils.flattenObject(e, { safe: !0 });
  for (const [r, a] of Object.entries(i)) {
    const o = n.querySelectorAll(`[name="${r}"]`);
    if (o.length) {
      k("LightCriteria | Applying field", {
        path: r,
        value: a,
        elementCount: o.length
      });
      for (const s of o)
        s instanceof HTMLElement && s.tagName === "COLOR-PICKER" ? Mh(s, a) : s instanceof HTMLElement && s.tagName === "RANGE-PICKER" ? Nh(s, a) : s instanceof HTMLInputElement ? Ah(s, a) : s instanceof HTMLSelectElement ? kh(s, a) : s instanceof HTMLTextAreaElement && xh(s, a);
    }
  }
  requestAnimationFrame(() => {
    var r;
    return (r = t._previewChanges) == null ? void 0 : r.call(t);
  });
}
l(qr, "applyConfigToForm");
function Ah(t, n, e) {
  const i = t.type;
  if (i === "checkbox") {
    const o = !!n;
    t.checked !== o && (t.checked = o, wt(t));
    return;
  }
  if (i === "radio") {
    const o = n == null ? "" : String(n), s = t.value === o;
    t.checked !== s && (t.checked = s, s && wt(t));
    return;
  }
  const r = n == null ? "" : String(n);
  let a = !1;
  t.value !== r && (t.value = r, a = !0), a && wt(t);
}
l(Ah, "applyValueToInput");
function Mh(t, n, e) {
  var s, c, u, d, g, p;
  const i = n == null ? "" : String(n);
  let r = !1;
  t.value !== i && (t.value = i, t.setAttribute("value", i), (s = t.ui) != null && s.setValue && t.ui.setValue(i), r = !0);
  const a = ((c = t.ui) == null ? void 0 : c.input) ?? ((u = t.querySelector) == null ? void 0 : u.call(t, 'input[type="color"]'));
  a instanceof HTMLInputElement && a.value !== i && (a.value = i, wt(a));
  const o = ((d = t.ui) == null ? void 0 : d.text) ?? ((g = t.querySelector) == null ? void 0 : g.call(t, 'input[type="text"]'));
  o instanceof HTMLInputElement && o.value !== i && (o.value = i, wt(o)), (p = t.ui) != null && p.commit ? t.ui.commit() : (t.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), t.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }))), k("LightCriteria | Color picker applied", {
    value: i,
    pickerValue: t.value ?? null,
    swatchValue: (a == null ? void 0 : a.value) ?? null,
    textValue: (o == null ? void 0 : o.value) ?? null
  }), r && wt(t);
}
l(Mh, "applyValueToColorPicker");
function Nh(t, n, e) {
  var u, d;
  const i = n == null ? "" : String(n), r = Number(i), a = Number.isFinite(r) ? r : i;
  let o = !1;
  t.value !== void 0 && t.value !== a && (t.value = a, o = !0), t.getAttribute("value") !== i && (t.setAttribute("value", i), o = !0);
  const s = (u = t.querySelector) == null ? void 0 : u.call(t, 'input[type="range"]');
  s instanceof HTMLInputElement && s.value !== i && (s.value = i, wt(s));
  const c = (d = t.querySelector) == null ? void 0 : d.call(t, 'input[type="number"]');
  if (c instanceof HTMLInputElement && c.value !== i && (c.value = i, wt(c)), typeof t.commit == "function")
    try {
      t.commit();
    } catch (g) {
      console.error("eidolon-utilities | range-picker commit failed", g);
    }
  k("LightCriteria | Range picker applied", {
    value: i,
    resolvedValue: a,
    rangeValue: (s == null ? void 0 : s.value) ?? null,
    numberValue: (c == null ? void 0 : c.value) ?? null
  }), o && wt(t);
}
l(Nh, "applyValueToRangePicker");
function kh(t, n, e) {
  const i = n == null ? "" : String(n);
  t.value !== i && (t.value = i, wt(t));
}
l(kh, "applyValueToSelect");
function xh(t, n, e) {
  const i = n == null ? "" : String(n);
  t.value !== i && (t.value = i, wt(t));
}
l(xh, "applyValueToTextarea");
function wt(t) {
  t.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), t.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }));
}
l(wt, "triggerInputChange");
function Lo({
  mappingSelect: t,
  applyMappingButton: n,
  updateMappingButton: e,
  editCriteriaButton: i,
  removeMappingButton: r,
  actionsMenu: a,
  state: o
}) {
  const s = (t == null ? void 0 : t.value) ?? "", c = !!(o != null && o.base), u = s && s !== Te ? !!Pi(o, s) : !1;
  if (n instanceof HTMLButtonElement && (s ? s === Te ? n.disabled = !c : n.disabled = !u : n.disabled = !0), e instanceof HTMLButtonElement && (s ? s === Te ? e.disabled = !1 : e.disabled = !u : e.disabled = !0), i instanceof HTMLButtonElement && (i.disabled = !s || s === Te || !u), r instanceof HTMLButtonElement && (r.disabled = !s || s === Te || !u), a instanceof HTMLElement) {
    const d = e instanceof HTMLButtonElement && !e.disabled || i instanceof HTMLButtonElement && !i.disabled || r instanceof HTMLButtonElement && !r.disabled;
    a.classList.toggle("is-disabled", !d), !d && "open" in a && (a.open = !1);
  }
}
l(Lo, "syncMappingSwitcherState");
function Dh(t) {
  const n = /* @__PURE__ */ new Map();
  for (const e of t) {
    if (!e) continue;
    const i = typeof e.id == "string" ? e.id : null;
    if (!i) continue;
    const r = typeof e.name == "string" && e.name.trim() ? e.name.trim() : w("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category");
    n.has(i) || n.set(i, r);
  }
  return n;
}
l(Dh, "buildCategoryNameLookup");
function $h(t) {
  const n = {};
  return t instanceof HTMLElement && t.querySelectorAll("select[data-filter-category-id]").forEach((e) => {
    var a, o;
    const i = e.dataset.filterCategoryId, r = (o = (a = e.value) == null ? void 0 : a.trim) == null ? void 0 : o.call(a);
    !i || !r || (n[i] = r);
  }), n;
}
l($h, "readMappingFilterSelections");
function Fh(t) {
  t instanceof HTMLElement && t.querySelectorAll("select[data-filter-category-id]").forEach((n) => {
    n.value = "";
  });
}
l(Fh, "resetMappingFilterSelections");
function _h(t, n) {
  const e = Array.isArray(t) ? t : [], i = Object.entries(n ?? {}).filter(([, r]) => !!r);
  return i.length ? e.filter((r) => {
    if (!r || typeof r != "object") return !1;
    const a = r.categories ?? {};
    for (const [o, s] of i)
      if ((a == null ? void 0 : a[o]) !== s) return !1;
    return !0;
  }) : e.slice();
}
l(_h, "filterMappingsByCriteria");
function Ph(t, { totalCount: n = 0, visibleCount: e = 0, hasFilters: i = !1, activeFilterCount: r = 0 } = {}) {
  if (!(t instanceof HTMLElement)) return;
  if (!i) {
    t.textContent = w(
      "EIDOLON.LightCriteria.FilterSummaryAll",
      "All ({count})"
    ).replace("{count}", String(n));
    return;
  }
  const a = w(
    "EIDOLON.LightCriteria.FilterSummaryActive",
    "{active} filters · {visible}/{total}"
  ).replace("{active}", String(r)).replace("{visible}", String(e)).replace("{total}", String(n));
  t.textContent = a;
}
l(Ph, "updateMappingFilterMeta");
function Rh(t, n, e, i, r = {}) {
  if (!(t instanceof HTMLSelectElement)) return;
  const a = typeof i == "string" ? i : "", o = !!(n != null && n.base), s = Array.isArray(r == null ? void 0 : r.categoryOrder) ? r.categoryOrder : [], c = Array.isArray(r == null ? void 0 : r.mappings) ? r.mappings.slice() : Array.isArray(n == null ? void 0 : n.mappings) ? n.mappings.slice() : [], u = t.value;
  t.innerHTML = "";
  const d = document.createElement("option");
  d.value = "", d.textContent = w(
    "EIDOLON.LightCriteria.SelectPlaceholder",
    "Select a mapping"
  ), d.disabled = o, t.appendChild(d);
  const g = document.createElement("option");
  g.value = Te, g.textContent = w(
    "EIDOLON.LightCriteria.BaseOption",
    "Base Lighting"
  ), g.disabled = !o, t.appendChild(g), c.slice().sort((m, v) => {
    var M;
    const E = oi(m, e, s), C = oi(v, e, s);
    return E.localeCompare(C, ((M = game.i18n) == null ? void 0 : M.lang) ?? void 0, {
      sensitivity: "base"
    });
  }).forEach((m) => {
    if (!(m != null && m.id)) return;
    const v = document.createElement("option");
    v.value = m.id, v.textContent = oi(m, e, s), t.appendChild(v);
  });
  const p = new Set(
    Array.from(t.options).filter((m) => !m.disabled).map((m) => m.value)
  ), b = o && u === "" ? "" : u, y = a || (p.has(b) ? b : "");
  y && p.has(y) ? t.value = y : o ? t.value = Te : t.value = "";
}
l(Rh, "populateMappingSelector");
function oi(t, n, e = []) {
  if (!t || typeof t != "object")
    return w("EIDOLON.LightCriteria.UnnamedMapping", "Unnamed Mapping");
  if (typeof t.label == "string" && t.label.trim())
    return t.label.trim();
  const i = t.categories ?? {}, r = [], a = /* @__PURE__ */ new Set();
  for (const s of e)
    !s || a.has(s) || (r.push(s), a.add(s));
  for (const s of Object.keys(i).sort((c, u) => c.localeCompare(u)))
    a.has(s) || (r.push(s), a.add(s));
  const o = r.map((s) => {
    const c = i == null ? void 0 : i[s];
    if (typeof c != "string" || !c.trim()) return null;
    const u = c.trim();
    return `${n.get(s) ?? w("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category")}=${u}`;
  }).filter(Boolean);
  return o.length === 0 ? w("EIDOLON.LightCriteria.UnnamedMapping", "Unnamed Mapping") : o.join(" | ");
}
l(oi, "formatMappingOptionLabel");
function ws(t, n) {
  if (!t || typeof t != "object" || !Array.isArray(t.mappings)) return null;
  const e = wi(n);
  if (!e) return null;
  const i = t.mappings.find((r) => (r == null ? void 0 : r.key) === e);
  return (i == null ? void 0 : i.id) ?? null;
}
l(ws, "findMappingIdByCategories");
function Pi(t, n) {
  return !n || !t || typeof t != "object" || !Array.isArray(t.mappings) ? null : t.mappings.find((e) => (e == null ? void 0 : e.id) === n) ?? null;
}
l(Pi, "getMappingById");
function Hh(t) {
  if (!t || typeof t != "object") return "";
  const n = t.current;
  if (n != null && n.mappingId) {
    if (n.mappingId === Te)
      return t != null && t.base ? Te : "";
    if (Array.isArray(t.mappings) && t.mappings.some((e) => e.id === n.mappingId))
      return n.mappingId;
  }
  if (n != null && n.categories) {
    const e = ws(t, n.categories);
    if (e) return e;
  }
  return "";
}
l(Hh, "resolveInitialMappingSelection");
function Yl(t, n = {}) {
  var o, s, c, u;
  if (!(t instanceof HTMLFormElement)) return;
  const e = t.querySelector('color-picker[name="config.color"]'), i = (e == null ? void 0 : e.value) ?? null, r = ((o = e == null ? void 0 : e.ui) == null ? void 0 : o.text) ?? ((s = e == null ? void 0 : e.querySelector) == null ? void 0 : s.call(e, 'input[type="text"]')), a = ((c = e == null ? void 0 : e.ui) == null ? void 0 : c.input) ?? ((u = e == null ? void 0 : e.querySelector) == null ? void 0 : u.call(e, 'input[type="color"]'));
  k("LightCriteria | Color state after apply", {
    ...n,
    textValue: (r == null ? void 0 : r.value) ?? null,
    pickerValue: i,
    swatchValue: (a == null ? void 0 : a.value) ?? null
  });
}
l(Yl, "logAppliedColorState");
function qh(t) {
  t.querySelectorAll("select[data-category-id]").forEach((n) => {
    n.value = "";
  });
}
l(qh, "resetCategorySelections");
function Bh(t, n) {
  const e = n && typeof n == "object" ? n : {};
  t.querySelectorAll("select[data-category-id]").forEach((i) => {
    const r = i.dataset.categoryId;
    if (!r) return;
    const a = e[r];
    i.value = typeof a == "string" ? a : "";
  });
}
l(Bh, "setCategorySelections");
function jh(t) {
  const n = {};
  return t.querySelectorAll("select[data-category-id]").forEach((e) => {
    var a, o;
    const i = e.dataset.categoryId, r = (o = (a = e.value) == null ? void 0 : a.trim) == null ? void 0 : o.call(a);
    !i || !r || (n[i] = r);
  }), Object.keys(n).length > 0 ? n : null;
}
l(jh, "readCategorySelections");
async function Io(t, n, e) {
  if (!t) return null;
  try {
    if (!e)
      return await _i(t, {});
    if (e === Te)
      return await _i(t, {
        mappingId: Te,
        categories: null,
        updatedAt: Date.now()
      });
    const i = Pi(n, e);
    return i ? await _i(t, {
      mappingId: i.id,
      categories: i.categories,
      updatedAt: Date.now()
    }) : null;
  } catch (i) {
    return console.warn("eidolon-utilities | Failed to persist mapping selection", i), null;
  }
}
l(Io, "persistCurrentSelection");
function ll(t, n) {
  if (!(t instanceof HTMLElement)) return;
  const e = t.querySelector(".eidolon-light-criteria-manager__section.is-bottom");
  e instanceof HTMLElement && (e.hidden = !!(n != null && n.hidden));
}
l(ll, "updateManagerSectionVisibility");
function Cn({ switcher: t, emptyState: n, state: e }) {
  const i = !!(e != null && e.base);
  t instanceof HTMLElement && (t.hidden = !i), n instanceof HTMLElement && (n.hidden = i);
}
l(Cn, "updateActiveMappingVisibility");
function _u(t) {
  const n = (t == null ? void 0 : t.object) ?? (t == null ? void 0 : t.document) ?? null;
  return !(n != null && n.isEmbedded) || n.documentName !== "AmbientLight" ? null : n;
}
l(_u, "getAmbientLightDocument");
function Uh(t) {
  if (!(t != null && t.isEmbedded)) return null;
  const n = t.parent ?? null;
  if (!n) return t;
  if (typeof n.getEmbeddedDocument == "function") {
    const i = n.getEmbeddedDocument(t.documentName, t.id);
    if (i) return i;
  }
  const e = n.lights;
  if (e != null && e.get) {
    const i = e.get(t.id);
    if (i) return i;
  }
  return t;
}
l(Uh, "getPersistedAmbientLightDocument");
function Vh() {
  wh();
}
l(Vh, "registerLightCriteriaHooks");
Vh();
const vs = /* @__PURE__ */ new Map();
let Es = !1;
function cl(t, n) {
  vs.has(t) && console.warn(`[${T}] Socket handler for type "${t}" already registered, overwriting.`), vs.set(t, n);
}
l(cl, "registerSocketHandler");
function Br(t, n) {
  if (!Es) {
    console.error(`[${T}] Socket not initialized. Call initializeSocket() first.`);
    return;
  }
  game.socket.emit(`module.${T}`, { type: t, payload: n });
}
l(Br, "emitSocket");
function zh() {
  Es || (game.socket.on(`module.${T}`, (t) => {
    const { type: n, payload: e } = t ?? {}, i = vs.get(n);
    i ? i(e) : console.warn(`[${T}] No socket handler for type "${n}"`);
  }), Es = !0, console.log(`[${T}] Socket initialized on channel module.${T}`));
}
l(zh, "initializeSocket");
const Pu = "tween", Ru = "tween-sequence", Ts = "tween-sequence-cancel", Oe = Object.freeze({
  ABORT: "abort",
  CONTINUE: "continue"
}), Jt = Object.freeze({
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  FAILED: "failed"
}), ut = Object.freeze({
  BEFORE_ALL: "beforeAll",
  BEFORE_STEP: "before",
  ENTRY: "entry",
  AFTER_STEP: "after",
  RUNTIME: "runtime",
  VALIDATION: "validation",
  AWAIT: "await",
  EMIT: "emit",
  PARALLEL: "parallel"
}), la = /* @__PURE__ */ new Map();
function Ut({ type: t, execute: n, validate: e }) {
  la.has(t) && console.warn(`[tween-registry] Type "${t}" already registered, overwriting.`), la.set(t, { type: t, execute: n, validate: e ?? (() => {
  }) });
}
l(Ut, "registerTweenType");
function gr(t) {
  return la.get(t);
}
l(gr, "getTweenType");
function Gh(t, n = {}) {
  const e = gr(t);
  if (!e)
    throw new Error(`Unknown tween type: "${t}".`);
  return e.validate(n ?? {}), e;
}
l(Gh, "validateTweenEntry");
function Cs() {
  return [...la.keys()];
}
l(Cs, "listTweenTypes");
const si = {
  easeInQuad: /* @__PURE__ */ l((t) => t * t, "easeInQuad"),
  easeOutQuad: /* @__PURE__ */ l((t) => t * (2 - t), "easeOutQuad"),
  easeInOutQuad: /* @__PURE__ */ l((t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t, "easeInOutQuad"),
  easeInCubic: /* @__PURE__ */ l((t) => t * t * t, "easeInCubic"),
  easeOutCubic: /* @__PURE__ */ l((t) => {
    const n = t - 1;
    return n * n * n + 1;
  }, "easeOutCubic"),
  easeInOutCubic: /* @__PURE__ */ l((t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1, "easeInOutCubic"),
  easeOutBounce: /* @__PURE__ */ l((t) => {
    if (t < 1 / 2.75) return 7.5625 * t * t;
    if (t < 2 / 2.75) {
      const e = t - 0.5454545454545454;
      return 7.5625 * e * e + 0.75;
    }
    if (t < 2.5 / 2.75) {
      const e = t - 0.8181818181818182;
      return 7.5625 * e * e + 0.9375;
    }
    const n = t - 2.625 / 2.75;
    return 7.5625 * n * n + 0.984375;
  }, "easeOutBounce"),
  easeInBounce: /* @__PURE__ */ l((t) => 1 - si.easeOutBounce(1 - t), "easeInBounce"),
  easeInOutBounce: /* @__PURE__ */ l((t) => t < 0.5 ? (1 - si.easeOutBounce(1 - 2 * t)) / 2 : (1 + si.easeOutBounce(2 * t - 1)) / 2, "easeInOutBounce"),
  easeInElastic: /* @__PURE__ */ l((t) => t === 0 || t === 1 ? t : -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI), "easeInElastic"),
  easeOutElastic: /* @__PURE__ */ l((t) => t === 0 || t === 1 ? t : Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1, "easeOutElastic")
};
function hr(t) {
  if (t && si[t])
    return si[t];
  const n = foundry.canvas.animation.CanvasAnimation;
  return {
    linear: n.easeLinear,
    easeInOutCosine: n.easeInOutCosine
  }[t] ?? n.easeInOutCosine;
}
l(hr, "resolveEasing");
function Wh() {
  return ["linear", "easeInOutCosine", ...Object.keys(si)];
}
l(Wh, "listEasingNames");
function ca(t) {
  return t <= 0.04045 ? t / 12.92 : ((t + 0.055) / 1.055) ** 2.4;
}
l(ca, "srgbToLinear");
function li(t) {
  return t <= 31308e-7 ? 12.92 * t : 1.055 * t ** (1 / 2.4) - 0.055;
}
l(li, "linearToSrgb");
function Ql(t, n, e) {
  const i = 0.4122214708 * t + 0.5363325363 * n + 0.0514459929 * e, r = 0.2119034982 * t + 0.6806995451 * n + 0.1073969566 * e, a = 0.0883024619 * t + 0.2817188376 * n + 0.6299787005 * e, o = Math.cbrt(i), s = Math.cbrt(r), c = Math.cbrt(a);
  return [
    0.2104542553 * o + 0.793617785 * s - 0.0040720468 * c,
    1.9779984951 * o - 2.428592205 * s + 0.4505937099 * c,
    0.0259040371 * o + 0.7827717662 * s - 0.808675766 * c
  ];
}
l(Ql, "linearRgbToOklab");
function Jh(t, n, e) {
  const i = (t + 0.3963377774 * n + 0.2158037573 * e) ** 3, r = (t - 0.1055613458 * n - 0.0638541728 * e) ** 3, a = (t - 0.0894841775 * n - 1.291485548 * e) ** 3;
  return [
    4.0767416621 * i - 3.3077115913 * r + 0.2309699292 * a,
    -1.2684380046 * i + 2.6097574011 * r - 0.3413193965 * a,
    -0.0041960863 * i - 0.7034186147 * r + 1.707614701 * a
  ];
}
l(Jh, "oklabToLinearRgb");
function ua(t) {
  return [t.r, t.g, t.b];
}
l(ua, "colorToRgb");
function Hu(t, n, e) {
  const i = /* @__PURE__ */ l((a) => Math.max(0, Math.min(1, a)), "clamp"), r = /* @__PURE__ */ l((a) => Math.round(i(a) * 255).toString(16).padStart(2, "0"), "toHex");
  return `#${r(t)}${r(n)}${r(e)}`;
}
l(Hu, "rgbToHex");
function Kh(t, n, e) {
  if (e <= 0) return t.toHTML();
  if (e >= 1) return n.toHTML();
  const i = foundry.utils.Color, [r, a, o] = t.hsl, [s, c, u] = n.hsl, d = (s - r + 0.5) % 1 - 0.5, g = (r + d * e + 1) % 1, p = a + (c - a) * e, b = o + (u - o) * e;
  return i.fromHSL([g, p, b]).toHTML();
}
l(Kh, "interpolateHsl");
function Yh(t, n, e) {
  if (e <= 0) return t.toHTML();
  if (e >= 1) return n.toHTML();
  const [i, r, a] = ua(t).map(ca), [o, s, c] = ua(n).map(ca), u = li(i + (o - i) * e), d = li(r + (s - r) * e), g = li(a + (c - a) * e);
  return Hu(u, d, g);
}
l(Yh, "interpolateRgb");
function Qh(t, n, e) {
  if (e <= 0) return t.toHTML();
  if (e >= 1) return n.toHTML();
  const [i, r, a] = ua(t).map(ca), [o, s, c] = ua(n).map(ca), [u, d, g] = Ql(i, r, a), [p, b, y] = Ql(o, s, c), m = 0.02, v = Math.sqrt(d * d + g * g), E = Math.sqrt(b * b + y * y);
  let C, M, D;
  if (v < m || E < m)
    C = u + (p - u) * e, M = d + (b - d) * e, D = g + (y - g) * e;
  else {
    const ne = Math.atan2(g, d);
    let V = Math.atan2(y, b) - ne;
    V > Math.PI && (V -= 2 * Math.PI), V < -Math.PI && (V += 2 * Math.PI), C = u + (p - u) * e;
    const K = v + (E - v) * e, _ = ne + V * e;
    M = K * Math.cos(_), D = K * Math.sin(_);
  }
  const [F, P, H] = Jh(C, M, D);
  return Hu(li(F), li(P), li(H));
}
l(Qh, "interpolateOklch");
const Ss = {
  hsl: Kh,
  rgb: Yh,
  oklch: Qh
};
function Xh(t = "hsl") {
  return Ss[t] ?? Ss.hsl;
}
l(Xh, "getInterpolator");
function Xl() {
  return Object.keys(Ss);
}
l(Xl, "listInterpolationModes");
function Zh(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((e) => !e || typeof e != "string"))
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
  if (t.mode && !Xl().includes(t.mode))
    throw new Error(
      `light-color tween: unknown mode "${t.mode}". Available: ${Xl().join(", ")}`
    );
}
l(Zh, "validate$5");
async function em(t, n = {}) {
  const { CanvasAnimation: e } = foundry.canvas.animation, { Color: i } = foundry.utils, { uuid: r, toColor: a, toAlpha: o, mode: s = "oklch" } = t, c = Array.isArray(r) ? r : [r];
  if (c.length === 0)
    return console.warn("light-color tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: u = 2e3,
    easing: d = "easeInOutCosine",
    commit: g = !0,
    startEpochMS: p = null,
    signal: b = null
  } = n, y = hr(d), m = a != null, v = o != null, E = m ? Xh(s) : null, C = m ? i.fromString(a) : null;
  if (m && !C.valid) throw new Error(`light-color tween: invalid target color "${a}".`);
  async function M(F) {
    var X, U;
    if (b != null && b.aborted) return !1;
    const P = await fromUuid(F);
    if (!P) return !1;
    const H = P.object;
    if (!H) return !1;
    let ne;
    if (m) {
      const I = (X = P.config) == null ? void 0 : X.color;
      I != null && I.valid || console.warn(`light-color tween: source color invalid on ${F}, using white.`), ne = I != null && I.valid ? I : i.fromString("#ffffff");
    }
    const ie = v ? ((U = P._source.config) == null ? void 0 : U.alpha) ?? 0.5 : null, V = { t: 0 }, K = `ambient-hue-tween:${F}`;
    e.terminateAnimation(K), b && b.addEventListener("abort", () => {
      e.terminateAnimation(K);
    }, { once: !0 });
    const _ = typeof p == "number" ? Math.max(0, Math.min(u, Date.now() - p)) : 0, z = /* @__PURE__ */ l((I) => {
      const O = {};
      m && (O.color = E(ne, C, I)), v && (O.alpha = ie + (o - ie) * I), P.updateSource({ config: O }), H.initializeLightSource();
    }, "applyFrame");
    _ > 0 && (V.t = _ / u, z(V.t));
    const G = await e.animate(
      [{ parent: V, attribute: "t", to: 1 }],
      {
        name: K,
        duration: u,
        easing: y,
        time: _,
        ontick: /* @__PURE__ */ l(() => z(V.t), "ontick")
      }
    );
    if (G !== !1) {
      if (b != null && b.aborted) return !1;
      const I = {};
      m && (I.color = C.toHTML()), v && (I.alpha = o), P.updateSource({ config: I }), H.initializeLightSource();
    }
    if (g && G !== !1 && P.canUserModify(game.user, "update")) {
      if (b != null && b.aborted) return !1;
      const I = {}, O = {};
      m && (I.color = ne.toHTML(), O["config.color"] = C.toHTML()), v && (I.alpha = ie, O["config.alpha"] = o), P.updateSource({ config: I }), await P.update(O);
    }
    return G !== !1;
  }
  return l(M, "animateOne"), (await Promise.all(c.map(M))).every(Boolean);
}
l(em, "execute$5");
function tm() {
  Ut({ type: "light-color", execute: em, validate: Zh });
}
l(tm, "registerLightColorTween");
const Kt = /* @__PURE__ */ new WeakMap();
function nm(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((e) => !e || typeof e != "string"))
    throw new Error("light-state tween: 'uuid' is required (string or array of AmbientLight document UUIDs).");
  if (typeof t.enabled != "boolean")
    throw new Error("light-state tween: 'enabled' (boolean) is required.");
}
l(nm, "validate$4");
async function im(t, n = {}) {
  const { CanvasAnimation: e } = foundry.canvas.animation, { uuid: i, enabled: r } = t, a = Array.isArray(i) ? i : [i];
  if (a.length === 0)
    return console.warn("light-state tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: o = 2e3,
    easing: s = "easeInOutCosine",
    commit: c = !0,
    startEpochMS: u = null,
    signal: d = null
  } = n, g = hr(s);
  async function p(y) {
    var P, H, ne, ie;
    if (d != null && d.aborted) return !1;
    const m = await fromUuid(y);
    if (!m) return !1;
    const v = m.object;
    if (!v) return !1;
    const E = `ambient-state-tween:${y}`;
    e.terminateAnimation(E), d && d.addEventListener("abort", () => {
      e.terminateAnimation(E);
    }, { once: !0 });
    const C = Kt.get(m) ?? {
      hidden: m._source.hidden,
      alpha: ((P = m._source.config) == null ? void 0 : P.alpha) ?? 0.5
    };
    if (Kt.set(m, C), k(`light-state START ${r ? "ON" : "OFF"} | snap: ${JSON.stringify(C)} | _source.hidden=${m._source.hidden}, _source.config.alpha=${(H = m._source.config) == null ? void 0 : H.alpha}`), r && !C.hidden || !r && C.hidden)
      return Kt.delete(m), !0;
    const M = C.alpha, D = typeof u == "number" ? Math.max(0, Math.min(o, Date.now() - u)) : 0, F = /* @__PURE__ */ l((V) => {
      m.updateSource({ config: { alpha: V } }), v.initializeLightSource();
    }, "applyAlpha");
    if (r) {
      m.updateSource({ hidden: !1, config: { alpha: 0 } }), v.initializeLightSource(), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
      const V = { t: 0 };
      D > 0 && (V.t = D / o, F(M * V.t));
      const K = await e.animate(
        [{ parent: V, attribute: "t", to: 1 }],
        {
          name: E,
          duration: o,
          easing: g,
          time: D,
          ontick: /* @__PURE__ */ l(() => F(M * V.t), "ontick")
        }
      );
      return K !== !1 && !(d != null && d.aborted) && c && m.canUserModify(game.user, "update") ? (m.updateSource({ hidden: !0, config: { alpha: M } }), await m.update({ hidden: !1 }), k(`light-state FADE-IN committed. _source.hidden=${m._source.hidden}, _source.config.alpha=${(ne = m._source.config) == null ? void 0 : ne.alpha}`), Kt.delete(m)) : K === !1 || Kt.delete(m), K !== !1;
    } else {
      m.updateSource({ hidden: !1, config: { alpha: C.alpha } }), v.initializeLightSource();
      const V = { t: 0 };
      D > 0 && (V.t = D / o, F(M * (1 - V.t)));
      const K = await e.animate(
        [{ parent: V, attribute: "t", to: 1 }],
        {
          name: E,
          duration: o,
          easing: g,
          time: D,
          ontick: /* @__PURE__ */ l(() => F(M * (1 - V.t)), "ontick")
        }
      );
      return K !== !1 && !(d != null && d.aborted) && c && m.canUserModify(game.user, "update") ? (await m.update({ hidden: !0 }), m.updateSource({ config: { alpha: M } }), v.initializeLightSource(), k(`light-state FADE-OUT committed+restored. _source.hidden=${m._source.hidden}, _source.config.alpha=${(ie = m._source.config) == null ? void 0 : ie.alpha}`), Kt.delete(m)) : K === !1 || (m.updateSource({ hidden: !0, config: { alpha: M } }), v.initializeLightSource(), Kt.delete(m)), K !== !1;
    }
  }
  return l(p, "animateOne"), (await Promise.all(a.map(p))).every(Boolean);
}
l(im, "execute$4");
function rm() {
  Ut({ type: "light-state", execute: im, validate: nm });
}
l(rm, "registerLightStateTween");
function ao(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((e) => !e || typeof e != "string"))
    throw new Error("tile-prop tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (!t.attribute || typeof t.attribute != "string")
    throw new Error("tile-prop tween: 'attribute' (string) is required — dot-path to a numeric property (e.g. 'alpha', 'rotation').");
  if (typeof t.value != "number")
    throw new Error("tile-prop tween: 'value' (number) is required — the target value to animate to.");
}
l(ao, "validate$3");
async function oo(t, n = {}) {
  const { CanvasAnimation: e } = foundry.canvas.animation, { uuid: i, attribute: r, value: a } = t, o = Array.isArray(i) ? i : [i];
  if (o.length === 0)
    return console.warn("tile-prop tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: s = 2e3,
    easing: c = "easeInOutCosine",
    commit: u = !0,
    startEpochMS: d = null,
    signal: g = null
  } = n, p = hr(c);
  async function b(m) {
    if (g != null && g.aborted) return !1;
    const v = await fromUuid(m);
    if (!v) return !1;
    const E = v.object;
    if (!E) return !1;
    const C = foundry.utils.getProperty(v._source, r);
    if (typeof C != "number")
      return console.warn(`tile-prop tween: source value at '${r}' on ${m} is not a number (got ${typeof C}). Skipping.`), !1;
    const M = `tile-prop-tween:${r}:${m}`;
    e.terminateAnimation(M), g && g.addEventListener("abort", () => {
      e.terminateAnimation(M);
    }, { once: !0 });
    const D = typeof d == "number" ? Math.max(0, Math.min(s, Date.now() - d)) : 0, F = /* @__PURE__ */ l((ne) => {
      const ie = C + (a - C) * ne;
      v.updateSource(foundry.utils.expandObject({ [r]: ie })), E.refresh();
    }, "applyFrame"), P = { t: 0 };
    D > 0 && (P.t = D / s, F(P.t));
    const H = await e.animate(
      [{ parent: P, attribute: "t", to: 1 }],
      {
        name: M,
        duration: s,
        easing: p,
        time: D,
        ontick: /* @__PURE__ */ l(() => F(P.t), "ontick")
      }
    );
    if (H !== !1) {
      if (g != null && g.aborted) return !1;
      v.updateSource(foundry.utils.expandObject({ [r]: a })), E.refresh();
    }
    if (u && H !== !1 && v.canUserModify(game.user, "update")) {
      if (g != null && g.aborted) return !1;
      v.updateSource(foundry.utils.expandObject({ [r]: C })), await v.update({ [r]: a });
    }
    return H !== !1;
  }
  return l(b, "animateOne"), (await Promise.all(o.map(b))).every(Boolean);
}
l(oo, "execute$3");
function am() {
  Ut({ type: "tile-prop", execute: oo, validate: ao });
}
l(am, "registerTilePropTween");
function om(t) {
  if (!t.attribute || typeof t.attribute != "string")
    throw new Error("particles-prop tween: 'attribute' (string) is required — property name on canvas.particleeffects (e.g. 'alpha').");
  if (typeof t.value != "number")
    throw new Error("particles-prop tween: 'value' (number) is required — the target value to animate to.");
}
l(om, "validate$2");
async function sm(t, n = {}) {
  const { CanvasAnimation: e } = foundry.canvas.animation, { attribute: i, value: r } = t, {
    durationMS: a = 2e3,
    easing: o = "easeInOutCosine",
    startEpochMS: s = null,
    signal: c = null
  } = n, u = canvas.particleeffects;
  if (!u)
    return console.warn("particles-prop tween: canvas.particleeffects not available."), !1;
  const d = u[i];
  if (typeof d != "number")
    return console.warn(`particles-prop tween: current value of '${i}' is not a number (got ${typeof d}). Skipping.`), !1;
  const g = hr(o), p = `particles-prop-tween:${i}`;
  e.terminateAnimation(p), c && c.addEventListener("abort", () => {
    e.terminateAnimation(p);
  }, { once: !0 });
  const b = typeof s == "number" ? Math.max(0, Math.min(a, Date.now() - s)) : 0, y = /* @__PURE__ */ l((E) => {
    u[i] = d + (r - d) * E;
  }, "applyFrame"), m = { t: 0 };
  b > 0 && (m.t = b / a, y(m.t));
  const v = await e.animate(
    [{ parent: m, attribute: "t", to: 1 }],
    {
      name: p,
      duration: a,
      easing: g,
      time: b,
      ontick: /* @__PURE__ */ l(() => y(m.t), "ontick")
    }
  );
  if (v !== !1) {
    if (c != null && c.aborted) return !1;
    u[i] = r;
  }
  return v !== !1;
}
l(sm, "execute$2");
function lm() {
  Ut({ type: "particles-prop", execute: sm, validate: om });
}
l(lm, "registerParticlesPropTween");
var en, Wi, Ji, Ki, Yi, Qi, di;
const yl = class yl {
  /**
   * @param {AbortController} controller
   */
  constructor(n) {
    N(this, en);
    N(this, Wi);
    N(this, Ji);
    N(this, Ki);
    N(this, Yi);
    N(this, Qi, !1);
    N(this, di, null);
    L(this, en, n), L(this, Ki, new Promise((e) => {
      L(this, Wi, e);
    })), L(this, Yi, new Promise((e) => {
      L(this, Ji, e);
    }));
  }
  /** @returns {Promise<boolean>} Resolves true (completed) or false (cancelled/failed). */
  get finished() {
    return f(this, Ki);
  }
  /** @returns {Promise<{status: string, [k: string]: unknown}>} */
  get result() {
    return f(this, Yi);
  }
  /** @returns {boolean} */
  get cancelled() {
    return f(this, en).signal.aborted;
  }
  /** @returns {AbortSignal} */
  get signal() {
    return f(this, en).signal;
  }
  /** @returns {string} */
  get status() {
    return f(this, di) ? f(this, di).status : this.cancelled ? "cancelled" : "running";
  }
  /** Abort the timeline, triggering onCancel callbacks. */
  cancel(n = "cancelled") {
    f(this, en).signal.aborted || f(this, en).abort(n);
  }
  /**
   * Called internally by the execution engine when the timeline finishes.
   * @param {boolean} completed - true if all steps ran, false if cancelled
   */
  _resolve(n) {
    if (f(this, Qi)) return;
    L(this, Qi, !0);
    const e = typeof n == "boolean" ? { status: n ? "completed" : "cancelled" } : n ?? { status: "cancelled" };
    L(this, di, e), f(this, Wi).call(this, e.status === "completed"), f(this, Ji).call(this, e);
  }
};
en = new WeakMap(), Wi = new WeakMap(), Ji = new WeakMap(), Ki = new WeakMap(), Yi = new WeakMap(), Qi = new WeakMap(), di = new WeakMap(), l(yl, "TimelineHandle");
let Ls = yl;
var Fn, fi, _n;
const bl = class bl {
  constructor() {
    /** @type {Map<string, Set<Function>>} */
    N(this, Fn, /* @__PURE__ */ new Map());
    /** @type {Set<string>} Signals that have been emitted (sticky) */
    N(this, fi, /* @__PURE__ */ new Set());
    N(this, _n, !1);
  }
  /**
   * Subscribe to a named signal.
   * @param {string} signal
   * @param {Function} listener
   * @returns {() => void} Unsubscribe function
   */
  on(n, e) {
    if (f(this, _n)) return () => {
    };
    let i = f(this, Fn).get(n);
    return i || (i = /* @__PURE__ */ new Set(), f(this, Fn).set(n, i)), i.add(e), () => i.delete(e);
  }
  /**
   * Fire a named signal synchronously. All registered listeners are invoked.
   * The signal is recorded so that future waitFor() calls resolve immediately.
   * @param {string} signal
   */
  emit(n) {
    if (f(this, _n)) return;
    f(this, fi).add(n);
    const e = f(this, Fn).get(n);
    if (e)
      for (const i of e)
        i();
  }
  /**
   * Returns a promise that resolves when the signal fires, or rejects
   * if the abort signal fires first.
   * @param {string} signal
   * @param {AbortSignal} [abortSignal]
   * @returns {Promise<void>}
   */
  waitFor(n, e) {
    return f(this, _n) ? Promise.reject(new Error("EventBus destroyed")) : f(this, fi).has(n) ? Promise.resolve() : new Promise((i, r) => {
      if (e != null && e.aborted)
        return r(e.reason ?? "aborted");
      const a = this.on(n, () => {
        a(), o && (e == null || e.removeEventListener("abort", o)), i();
      });
      let o;
      e && (o = /* @__PURE__ */ l(() => {
        a(), r(e.reason ?? "aborted");
      }, "onAbort"), e.addEventListener("abort", o, { once: !0 }));
    });
  }
  /**
   * Tear down the bus, clearing all listeners.
   */
  destroy() {
    L(this, _n, !0), f(this, Fn).clear(), f(this, fi).clear();
  }
};
Fn = new WeakMap(), fi = new WeakMap(), _n = new WeakMap(), l(bl, "EventBus");
let Is = bl;
const qu = /* @__PURE__ */ new Map();
function so(t, n) {
  qu.set(t, n);
}
l(so, "registerAwaitProvider");
function cm(t, n) {
  const e = qu.get(t.event);
  return e ? e(t, n) : Promise.reject(new Error(`Unknown await event type: "${t.event}"`));
}
l(cm, "createAwaitPromise");
so("signal", (t, n) => t.name ? n.eventBus.waitFor(t.name, n.signal) : Promise.reject(new Error('await signal: "name" is required')));
so("click", (t, n) => new Promise((e, i) => {
  if (n.signal.aborted) return i(n.signal.reason ?? "aborted");
  const r = /* @__PURE__ */ l(() => {
    o(), e();
  }, "onClick"), a = /* @__PURE__ */ l(() => {
    o(), i(n.signal.reason ?? "aborted");
  }, "onAbort"), o = /* @__PURE__ */ l(() => {
    document.removeEventListener("click", r), n.signal.removeEventListener("abort", a);
  }, "cleanup");
  document.addEventListener("click", r, { once: !0 }), n.signal.addEventListener("abort", a, { once: !0 });
}));
so("keypress", (t, n) => new Promise((e, i) => {
  if (n.signal.aborted) return i(n.signal.reason ?? "aborted");
  const r = /* @__PURE__ */ l((s) => {
    t.key && s.key !== t.key || (o(), e());
  }, "onKey"), a = /* @__PURE__ */ l(() => {
    o(), i(n.signal.reason ?? "aborted");
  }, "onAbort"), o = /* @__PURE__ */ l(() => {
    document.removeEventListener("keydown", r), n.signal.removeEventListener("abort", a);
  }, "cleanup");
  document.addEventListener("keydown", r), n.signal.addEventListener("abort", a, { once: !0 });
}));
const ei = /* @__PURE__ */ new Map();
function um(t, n) {
  const e = ei.get(t);
  e && !e.cancelled && e.cancel("replaced-by-name"), ei.set(t, n), n.finished.then(() => {
    ei.get(t) === n && ei.delete(t);
  });
}
l(um, "registerTimeline");
function Bu(t) {
  const n = ei.get(t);
  return n && !n.cancelled ? (n.cancel("cancelled-by-name"), !0) : !1;
}
l(Bu, "cancelTimeline");
function dm(t) {
  return ei.get(t);
}
l(dm, "getTimeline");
function Zl(t, n) {
  return t <= 0 ? Promise.resolve() : new Promise((e, i) => {
    if (n.aborted) return i(n.reason);
    const r = setTimeout(e, t);
    n.addEventListener("abort", () => {
      clearTimeout(r), i(n.reason);
    }, { once: !0 });
  });
}
l(Zl, "cancellableDelay");
var Be, tn, Xi, Zi;
const wl = class wl {
  constructor(n) {
    /** @type {TweenTimeline} */
    N(this, Be);
    /** @type {Array<{ type: string, params: object, opts?: object, detach: boolean }>} */
    N(this, tn, []);
    /** @type {Function|null} */
    N(this, Xi, null);
    /** @type {Function|null} */
    N(this, Zi, null);
    L(this, Be, n);
  }
  /**
   * Add a tween entry to this step.
   * @param {string} type  Registered tween type name
   * @param {object} params  Type-specific parameters
   * @param {object} [opts]  Options (durationMS, easing, etc.)
   * @returns {StepBuilder} this
   */
  add(n, e, i) {
    return f(this, tn).push({ type: n, params: e, opts: i ?? {}, detach: !1 }), this;
  }
  /**
   * Mark the last entry as fire-and-forget (does not block step progression).
   * @returns {StepBuilder} this
   */
  detach() {
    if (f(this, tn).length === 0)
      throw new Error("StepBuilder.detach(): no entry to detach.");
    return f(this, tn)[f(this, tn).length - 1].detach = !0, this;
  }
  /**
   * Callback invoked before this step's tweens start.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  before(n) {
    return L(this, Xi, n), this;
  }
  /**
   * Callback invoked after this step's awaited tweens complete.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  after(n) {
    return L(this, Zi, n), this;
  }
  // ── Delegation to parent TweenTimeline for fluent chaining ──
  /** Start a new step (finalizes this one). */
  step() {
    return f(this, Be).step();
  }
  /** Insert a delay between steps. */
  delay(n) {
    return f(this, Be).delay(n);
  }
  /** Insert an await segment. */
  await(n) {
    return f(this, Be).await(n);
  }
  /** Insert an emit segment. */
  emit(n) {
    return f(this, Be).emit(n);
  }
  /** Insert a parallel segment. */
  parallel(n, e) {
    return f(this, Be).parallel(n, e);
  }
  /** Register onComplete callback. */
  onComplete(n) {
    return f(this, Be).onComplete(n);
  }
  /** Register onCancel callback. */
  onCancel(n) {
    return f(this, Be).onCancel(n);
  }
  /** Register onError callback. */
  onError(n) {
    return f(this, Be).onError(n);
  }
  /** Execute the timeline. */
  run(n) {
    return f(this, Be).run(n);
  }
  /** Serialize the timeline. */
  toJSON() {
    return f(this, Be).toJSON();
  }
  // ── Internal access ──
  /** @returns {{ entries: Array, before: Function|null, after: Function|null }} */
  _finalize() {
    return {
      entries: f(this, tn),
      before: f(this, Xi),
      after: f(this, Zi)
    };
  }
};
Be = new WeakMap(), tn = new WeakMap(), Xi = new WeakMap(), Zi = new WeakMap(), l(wl, "StepBuilder");
let Os = wl;
var je, Me, pt, nn, er, tr, nr, ir, mn, As, J, $t, Ms, ju, Ns, Uu, Vu, jr, nt, Tt;
const Pt = class Pt {
  constructor() {
    N(this, J);
    /** @type {string|null} */
    N(this, je, null);
    /** @type {string} */
    N(this, Me, Oe.ABORT);
    /** @type {Array<object>} */
    N(this, pt, []);
    /** @type {StepBuilder|null} */
    N(this, nn, null);
    /** @type {Function|null} */
    N(this, er, null);
    /** @type {Function|null} */
    N(this, tr, null);
    /** @type {Function|null} */
    N(this, nr, null);
    /** @type {Function|null} */
    N(this, ir, null);
  }
  /**
   * Register this timeline in the named registry. Starting a new
   * timeline with the same name cancels the previous one.
   * @param {string} name
   * @returns {TweenTimeline} this
   */
  name(n) {
    return L(this, je, n), this;
  }
  /**
   * Set the error policy for step execution.
   * @param {"abort"|"continue"} policy
   * @returns {TweenTimeline} this
   */
  errorPolicy(n) {
    if (n !== Oe.ABORT && n !== Oe.CONTINUE)
      throw new Error(`Invalid error policy: "${n}". Use "abort" or "continue".`);
    return L(this, Me, n), this;
  }
  /**
   * Start a new step. Finalizes the previous step if one is open.
   * @returns {StepBuilder}
   */
  step() {
    return h(this, J, $t).call(this), L(this, nn, new Os(this)), f(this, nn);
  }
  /**
   * Insert a delay (in ms) between the previous step and the next.
   * @param {number} ms
   * @returns {TweenTimeline} this
   */
  delay(n) {
    return h(this, J, $t).call(this), f(this, pt).push({ kind: "delay", ms: n }), this;
  }
  /**
   * Pause execution until an event occurs.
   * @param {object} config  e.g. { event: "click" }, { event: "signal", name: "fog-done" }
   * @returns {TweenTimeline} this
   */
  await(n) {
    return h(this, J, $t).call(this), f(this, pt).push({ kind: "await", config: n }), this;
  }
  /**
   * Fire a named signal (instant, non-blocking).
   * @param {string} signal  Signal name
   * @returns {TweenTimeline} this
   */
  emit(n) {
    return h(this, J, $t).call(this), f(this, pt).push({ kind: "emit", signal: n }), this;
  }
  /**
   * Fork N branches with a join strategy.
   * @param {Array<(tl: TweenTimeline) => void>} branchFns  Callbacks that build each branch
   * @param {object} [opts]
   * @param {"all"|"any"|number} [opts.join="all"]  Join strategy
   * @param {"detach"|"cancel"} [opts.overflow="detach"]  What to do with un-joined branches
   * @returns {TweenTimeline} this
   */
  parallel(n, e = {}) {
    h(this, J, $t).call(this);
    const i = e.join ?? "all", r = e.overflow ?? "detach";
    if (i !== "all" && i !== "any" && (typeof i != "number" || i < 1 || i > n.length))
      throw new Error(`parallel: join must be "all", "any", or 1..${n.length}, got ${JSON.stringify(i)}`);
    if (r !== "detach" && r !== "cancel")
      throw new Error(`parallel: overflow must be "detach" or "cancel", got ${JSON.stringify(r)}`);
    const a = n.map((o) => {
      var c;
      const s = new Pt();
      return o(s), h(c = s, J, $t).call(c), f(s, pt);
    });
    return f(this, pt).push({ kind: "parallel", branches: a, join: i, overflow: r }), this;
  }
  /**
   * Callback invoked before the first step runs.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  beforeAll(n) {
    return L(this, er, n), this;
  }
  /**
   * Callback invoked on successful completion.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onComplete(n) {
    return L(this, tr, n), this;
  }
  /**
   * Callback invoked on cancellation (mutually exclusive with onComplete).
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onCancel(n) {
    return L(this, nr, n), this;
  }
  /**
   * Callback invoked on runtime failure (mutually exclusive with onComplete/onCancel).
   * @param {(outcome: object) => void} fn
   * @returns {TweenTimeline} this
   */
  onError(n) {
    return L(this, ir, n), this;
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
  run(n = {}) {
    h(this, J, $t).call(this);
    const e = new AbortController();
    n.signal && (n.signal.aborted ? e.abort(n.signal.reason ?? "parent-aborted") : n.signal.addEventListener("abort", () => {
      e.signal.aborted || e.abort(n.signal.reason ?? "parent-aborted");
    }, { once: !0 }));
    const i = new Ls(e);
    f(this, je) && um(f(this, je), i);
    const r = n.broadcast ?? game.user.isGM, a = n.commit ?? game.user.isGM, o = n.startEpochMS ?? Date.now();
    r && f(this, je) && Br(Ru, {
      name: f(this, je),
      data: this.toJSON(),
      startEpochMS: o
    });
    const s = new Is(), c = {
      signal: i.signal,
      commit: a,
      startEpochMS: o,
      eventBus: s,
      errors: [],
      detachedPromises: []
    };
    return h(this, J, ju).call(this, i, c).then((u) => {
      var d, g, p;
      s.destroy(), i._resolve(u), u.status === Jt.COMPLETED ? (d = f(this, tr)) == null || d.call(this) : u.status === Jt.CANCELLED ? ((g = f(this, nr)) == null || g.call(this), r && f(this, je) && Br(Ts, {
        name: f(this, je),
        reason: u.reason
      })) : ((p = f(this, ir)) == null || p.call(this, u), r && f(this, je) && Br(Ts, {
        name: f(this, je),
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
    h(this, J, $t).call(this);
    const e = { timeline: h(i = Pt, mn, As).call(i, f(this, pt)) };
    return f(this, je) && (e.name = f(this, je)), f(this, Me) !== Oe.ABORT && (e.errorPolicy = f(this, Me)), e;
  }
};
je = new WeakMap(), Me = new WeakMap(), pt = new WeakMap(), nn = new WeakMap(), er = new WeakMap(), tr = new WeakMap(), nr = new WeakMap(), ir = new WeakMap(), mn = new WeakSet(), As = /* @__PURE__ */ l(function(n) {
  const e = [];
  for (const i of n)
    if (i.kind === "delay")
      e.push({ delay: i.ms });
    else if (i.kind === "await")
      e.push({ await: i.config });
    else if (i.kind === "emit")
      e.push({ emit: i.signal });
    else if (i.kind === "parallel")
      e.push({
        parallel: {
          branches: i.branches.map((r) => {
            var a;
            return h(a = Pt, mn, As).call(a, r);
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
      e.push(r);
    }
  return e;
}, "#serializeSegments"), J = new WeakSet(), // ── Private ─────────────────────────────────────────────────────────
$t = /* @__PURE__ */ l(function() {
  f(this, nn) && (f(this, pt).push({ kind: "step", data: f(this, nn)._finalize() }), L(this, nn, null));
}, "#finalizeCurrentStep"), Ms = /* @__PURE__ */ l(function(n) {
  n.length !== 0 && Promise.allSettled(n).catch(() => {
  });
}, "#drainDetached"), ju = /* @__PURE__ */ l(async function(n, e) {
  var i, r;
  try {
    if (e.signal.aborted) return h(this, J, nt).call(this, e.signal.reason);
    const a = await h(this, J, jr).call(this, f(this, er), ut.BEFORE_ALL, null);
    if (a) {
      if (f(this, Me) === Oe.ABORT) return a;
      e.errors.push(a);
    }
    const o = await h(this, J, Ns).call(this, f(this, pt), e);
    if (o)
      return h(i = Pt, mn, Ms).call(i, e.detachedPromises), o;
    if (!e.signal.aborted) {
      const s = await Promise.allSettled(e.detachedPromises);
      for (const c of s)
        if (c.status === "rejected") {
          const u = h(this, J, Tt).call(this, c.reason, ut.ENTRY);
          if (f(this, Me) === Oe.ABORT) return u;
          e.errors.push(u);
        }
    }
    return e.signal.aborted ? h(this, J, nt).call(this, e.signal.reason) : {
      status: Jt.COMPLETED,
      ...e.errors.length > 0 ? { errors: e.errors } : {}
    };
  } catch (a) {
    return h(r = Pt, mn, Ms).call(r, e.detachedPromises), e.signal.aborted ? h(this, J, nt).call(this, e.signal.reason) : (console.error("TweenTimeline execution error:", a), h(this, J, Tt).call(this, a, ut.RUNTIME));
  }
}, "#execute"), Ns = /* @__PURE__ */ l(async function(n, e) {
  let i = -1, r = 0;
  for (const a of n) {
    if (e.signal.aborted) return h(this, J, nt).call(this, e.signal.reason);
    if (a.kind === "delay") {
      try {
        await Zl(a.ms, e.signal);
      } catch {
        return h(this, J, nt).call(this, e.signal.reason);
      }
      r += a.ms;
      continue;
    }
    if (a.kind === "await") {
      try {
        let y = cm(a.config, {
          signal: e.signal,
          eventBus: e.eventBus
        });
        const m = a.config.timeout;
        typeof m == "number" && m > 0 && (y = Promise.race([
          y,
          Zl(m, e.signal)
        ])), await y;
      } catch (y) {
        if (e.signal.aborted) return h(this, J, nt).call(this, e.signal.reason);
        const m = h(this, J, Tt).call(this, y, ut.AWAIT);
        if (f(this, Me) === Oe.ABORT) return m;
        e.errors.push(m);
      }
      continue;
    }
    if (a.kind === "emit") {
      try {
        e.eventBus.emit(a.signal);
      } catch (y) {
        const m = h(this, J, Tt).call(this, y, ut.EMIT);
        if (f(this, Me) === Oe.ABORT) return m;
        e.errors.push(m);
      }
      continue;
    }
    if (a.kind === "parallel") {
      const y = await h(this, J, Uu).call(this, a, e);
      if (y) return y;
      continue;
    }
    i += 1;
    const { entries: o, before: s, after: c } = a.data, u = await h(this, J, jr).call(this, s, ut.BEFORE_STEP, i);
    if (u) {
      if (f(this, Me) === Oe.ABORT) return u;
      e.errors.push(u);
      continue;
    }
    if (e.signal.aborted) return h(this, J, nt).call(this, e.signal.reason);
    const d = [];
    let g = 0;
    for (const y of o) {
      const m = gr(y.type);
      if (!m) {
        const M = h(this, J, Tt).call(this, new Error(`TweenTimeline: unknown tween type "${y.type}"`), ut.ENTRY, i, y.type);
        if (f(this, Me) === Oe.ABORT) return M;
        e.errors.push(M), console.warn(M.error.message);
        continue;
      }
      const v = {
        ...y.opts,
        commit: e.commit,
        startEpochMS: e.startEpochMS + r,
        signal: e.signal
      }, E = v.durationMS ?? 2e3, C = Promise.resolve().then(() => m.execute(y.params, v)).then((M) => M === !1 ? {
        ok: !1,
        failure: h(this, J, Tt).call(this, new Error("Tween entry returned false."), ut.ENTRY, i, y.type)
      } : { ok: !0 }).catch((M) => ({
        ok: !1,
        failure: h(this, J, Tt).call(this, M, ut.ENTRY, i, y.type)
      }));
      y.detach ? e.detachedPromises.push(C) : (d.push(C), g = Math.max(g, E));
    }
    const p = await h(this, J, Vu).call(this, d, e.signal);
    if (p === null) return h(this, J, nt).call(this, e.signal.reason);
    for (const y of p)
      if (!y.ok) {
        if (f(this, Me) === Oe.ABORT) return y.failure;
        e.errors.push(y.failure), console.warn("TweenTimeline: entry failed:", y.failure.error);
      }
    const b = await h(this, J, jr).call(this, c, ut.AFTER_STEP, i);
    if (b) {
      if (f(this, Me) === Oe.ABORT) return b;
      e.errors.push(b);
    }
    if (e.signal.aborted) return h(this, J, nt).call(this, e.signal.reason);
    r += g;
  }
  return null;
}, "#executeSegments"), Uu = /* @__PURE__ */ l(async function(n, e) {
  const { branches: i, join: r, overflow: a } = n, o = i.length, s = r === "all" ? o : r === "any" ? 1 : r, c = i.map(() => {
    const b = new AbortController();
    return e.signal.aborted ? b.abort(e.signal.reason ?? "parent-aborted") : e.signal.addEventListener("abort", () => {
      b.signal.aborted || b.abort(e.signal.reason ?? "parent-aborted");
    }, { once: !0 }), b;
  });
  let u = 0, d = 0;
  const g = new Array(o).fill(null);
  let p;
  return new Promise((b) => {
    let y = !1;
    const m = /* @__PURE__ */ l(() => {
      if (y) return;
      if (u >= s) {
        y = !0, v(), b(null);
        return;
      }
      const E = o - u - d;
      if (u + E < s) {
        y = !0, v();
        const C = g.filter((D) => D && D.status === Jt.FAILED).map((D) => D), M = h(this, J, Tt).call(this, new Error(`parallel: join target ${s} impossible (${u} completed, ${d} failed)`), ut.PARALLEL);
        f(this, Me) === Oe.ABORT ? b(M) : (e.errors.push(M), e.errors.push(...C), b(null));
      }
    }, "checkJoin"), v = /* @__PURE__ */ l(() => {
      if (a === "cancel")
        for (let E = 0; E < o; E++)
          !g[E] && !c[E].signal.aborted && c[E].abort("overflow-cancel");
      for (let E = 0; E < o; E++)
        g[E] || e.detachedPromises.push(p[E]);
    }, "applyOverflow");
    if (p = i.map((E, C) => {
      const M = {
        signal: c[C].signal,
        commit: e.commit,
        startEpochMS: e.startEpochMS,
        eventBus: e.eventBus,
        // shared
        errors: e.errors,
        // shared
        detachedPromises: e.detachedPromises
        // shared
      };
      return h(this, J, Ns).call(this, E, M).then((D) => {
        if (D)
          if (D.status === Jt.CANCELLED) {
            if (c[C].signal.aborted) {
              g[C] = D;
              return;
            }
            g[C] = D, d++;
          } else
            g[C] = D, d++;
        else
          g[C] = { status: Jt.COMPLETED }, u++;
        m();
      });
    }), e.signal.aborted) {
      y = !0, b(h(this, J, nt).call(this, e.signal.reason));
      return;
    }
    e.signal.addEventListener("abort", () => {
      y || (y = !0, b(h(this, J, nt).call(this, e.signal.reason)));
    }, { once: !0 });
  });
}, "#executeParallel"), /**
 * @param {Array<Promise<{ok: boolean, failure?: object}>>} stepPromises
 * @param {AbortSignal} signal
 * @returns {Promise<Array<{ok: boolean, failure?: object}>|null>}
 */
Vu = /* @__PURE__ */ l(function(n, e) {
  return n.length === 0 ? Promise.resolve([]) : e.aborted ? Promise.resolve(null) : new Promise((i, r) => {
    const a = /* @__PURE__ */ l(() => i(null), "onAbort");
    e.addEventListener("abort", a, { once: !0 }), Promise.all(n).then((o) => {
      e.removeEventListener("abort", a), i(o);
    }).catch((o) => {
      e.removeEventListener("abort", a), r(o);
    });
  });
}, "#waitForStep"), jr = /* @__PURE__ */ l(async function(n, e, i) {
  if (!n) return null;
  try {
    return await n(), null;
  } catch (r) {
    const a = h(this, J, Tt).call(this, r, e, i ?? void 0);
    return f(this, Me) === Oe.CONTINUE && console.warn(`TweenTimeline: hook failure in ${e}:`, r), a;
  }
}, "#runHook"), /** @param {unknown} reason */
nt = /* @__PURE__ */ l(function(n) {
  let e;
  return typeof n == "string" ? e = n : n instanceof Error && (e = n.message), {
    status: Jt.CANCELLED,
    ...e ? { reason: e } : {}
  };
}, "#cancelledOutcome"), /**
 * @param {unknown} err
 * @param {string} phase
 * @param {number} [stepIndex]
 * @param {string} [entryType]
 */
Tt = /* @__PURE__ */ l(function(n, e, i, r) {
  const a = n instanceof Error ? n : new Error(String(n));
  return {
    status: Jt.FAILED,
    error: a,
    phase: e,
    ...typeof i == "number" ? { stepIndex: i } : {},
    ...r ? { entryType: r } : {}
  };
}, "#failedOutcome"), N(Pt, mn), l(Pt, "TweenTimeline");
let da = Pt;
function ul(t) {
  if (!t || typeof t != "object")
    throw new Error("Sequence JSON: data must be an object.");
  if (!Array.isArray(t.timeline))
    throw new Error("Sequence JSON: 'timeline' must be an array.");
  if (t.name != null && typeof t.name != "string")
    throw new Error("Sequence JSON: 'name' must be a string.");
  if (t.errorPolicy != null && t.errorPolicy !== Oe.ABORT && t.errorPolicy !== Oe.CONTINUE)
    throw new Error(`Sequence JSON: 'errorPolicy' must be "abort" or "continue".`);
  zu(t.timeline, "timeline", 0);
}
l(ul, "validateSequenceJSON");
function zu(t, n, e = 0) {
  for (let i = 0; i < t.length; i++) {
    const r = t[i], a = `${n}[${i}]`;
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
      if (e >= 8)
        throw new Error(`Sequence JSON: ${a} exceeds maximum parallel nesting depth of 8.`);
      const o = r.parallel;
      if (!o || typeof o != "object")
        throw new Error(`Sequence JSON: ${a}.parallel must be an object.`);
      if (!Array.isArray(o.branches) || o.branches.length === 0)
        throw new Error(`Sequence JSON: ${a}.parallel.branches must be a non-empty array.`);
      const s = o.join ?? "all";
      if (s !== "all" && s !== "any" && (typeof s != "number" || !Number.isInteger(s) || s < 1 || s > o.branches.length))
        throw new Error(`Sequence JSON: ${a}.parallel.join must be "all", "any", or 1..${o.branches.length}.`);
      const c = o.overflow ?? "detach";
      if (c !== "detach" && c !== "cancel")
        throw new Error(`Sequence JSON: ${a}.parallel.overflow must be "detach" or "cancel".`);
      for (let u = 0; u < o.branches.length; u++) {
        const d = o.branches[u];
        if (!Array.isArray(d))
          throw new Error(`Sequence JSON: ${a}.parallel.branches[${u}] must be an array.`);
        zu(d, `${a}.parallel.branches[${u}]`, e + 1);
      }
      continue;
    }
    throw new Error(`Sequence JSON: ${a} is not a recognized segment (step array, delay, await, emit, or parallel).`);
  }
}
l(zu, "validateSegmentsJSON");
function Gu(t) {
  ul(t), Wu(t.timeline, "timeline");
}
l(Gu, "validateSequenceSemantics");
function Wu(t, n) {
  for (let e = 0; e < t.length; e++) {
    const i = t[e], r = `${n}[${e}]`;
    if (Array.isArray(i))
      for (let a = 0; a < i.length; a++) {
        const o = i[a];
        try {
          Gh(o.type, o.params ?? {});
        } catch (s) {
          throw new Error(`Sequence JSON: ${r}[${a}] failed semantic validation: ${s.message}`);
        }
      }
    else if (i.parallel)
      for (let a = 0; a < i.parallel.branches.length; a++)
        Wu(i.parallel.branches[a], `${r}.parallel.branches[${a}]`);
  }
}
l(Wu, "validateSegmentsSemantics");
function dl(t, n = {}) {
  ul(t), n.validateSemantics && Gu(t);
  const e = new da();
  return t.name && e.name(t.name), t.errorPolicy && e.errorPolicy(t.errorPolicy), Ju(t.timeline, e), e;
}
l(dl, "compileSequence");
function Ju(t, n) {
  for (const e of t) {
    if (Array.isArray(e)) {
      const i = n.step();
      for (const r of e)
        i.add(r.type, r.params ?? {}, r.opts), r.detach && i.detach();
      continue;
    }
    if (e.delay !== void 0) {
      n.delay(e.delay);
      continue;
    }
    if (e.await !== void 0) {
      n.await(e.await);
      continue;
    }
    if (e.emit !== void 0) {
      n.emit(e.emit);
      continue;
    }
    if (e.parallel !== void 0) {
      const i = e.parallel, r = i.branches.map((a) => (o) => Ju(a, o));
      n.parallel(r, {
        join: i.join ?? "all",
        overflow: i.overflow ?? "detach"
      });
    }
  }
}
l(Ju, "compileSegments");
function fm(t) {
  ul(t), Gu(t);
}
l(fm, "validate$1");
async function gm(t, n = {}) {
  return dl(t, { validateSemantics: !0 }).run({
    broadcast: !1,
    commit: n.commit,
    startEpochMS: n.startEpochMS,
    signal: n.signal
  }).finished;
}
l(gm, "execute$1");
function hm() {
  Ut({ type: "sequence", execute: gm, validate: fm });
}
l(hm, "registerSequenceTween");
function mm(t) {
  if (t.x == null && t.y == null && t.scale == null)
    throw new Error("camera-pan tween: at least one of 'x', 'y', or 'scale' is required.");
  if (t.x != null && typeof t.x != "number")
    throw new Error("camera-pan tween: 'x' must be a number.");
  if (t.y != null && typeof t.y != "number")
    throw new Error("camera-pan tween: 'y' must be a number.");
  if (t.scale != null && (typeof t.scale != "number" || t.scale <= 0))
    throw new Error("camera-pan tween: 'scale' must be a positive number.");
}
l(mm, "validate");
async function pm(t, n = {}) {
  const {
    durationMS: e = 2e3,
    startEpochMS: i = null,
    signal: r = null
  } = n;
  if (r != null && r.aborted) return !1;
  const a = typeof i == "number" ? Math.max(0, Math.min(e, Date.now() - i)) : 0, o = Math.max(0, e - a), s = { duration: o };
  if (t.x != null && (s.x = t.x), t.y != null && (s.y = t.y), t.scale != null && (s.scale = t.scale), o <= 0)
    return await canvas.animatePan({ ...s, duration: 0 }), !0;
  const c = canvas.animatePan(s);
  return r ? new Promise((u) => {
    const d = /* @__PURE__ */ l(() => {
      u(!1);
    }, "onAbort");
    r.addEventListener("abort", d, { once: !0 }), c.then(() => {
      r.removeEventListener("abort", d), u(!r.aborted);
    }).catch(() => {
      r.removeEventListener("abort", d), u(!1);
    });
  }) : (await c, !0);
}
l(pm, "execute");
function ym() {
  Ut({ type: "camera-pan", execute: pm, validate: mm });
}
l(ym, "registerCameraPanTween");
async function bm(t, n, e = {}) {
  if (!game.user.isGM)
    return ui.notifications.warn("Only the GM can dispatch tweens."), !1;
  const i = gr(t);
  if (!i)
    throw new Error(`Unknown tween type: "${t}". Registered types: ${Cs().join(", ")}`);
  i.validate(n);
  const { durationMS: r = 2e3, easing: a = "easeInOutCosine", commit: o = !0 } = e, s = Date.now();
  return Br(Pu, {
    type: t,
    params: n,
    durationMS: r,
    easing: a,
    startEpochMS: s,
    commit: !1
  }), i.execute(n, { durationMS: r, easing: a, commit: o, startEpochMS: s });
}
l(bm, "dispatchTween");
function wm(t) {
  const { type: n, params: e, durationMS: i, easing: r, startEpochMS: a, commit: o } = t ?? {}, s = gr(n);
  if (!s) {
    console.warn(`[${T}] Received unknown tween type over socket: "${n}"`);
    return;
  }
  s.execute(e, {
    durationMS: i,
    easing: r,
    commit: o ?? !1,
    startEpochMS: a
  });
}
l(wm, "handleTweenSocketMessage");
tm();
rm();
am();
lm();
hm();
ym();
Ut({ type: "token-prop", execute: oo, validate: ao });
Ut({ type: "drawing-prop", execute: oo, validate: ao });
Ut({ type: "sound-prop", execute: oo, validate: ao });
cl(Pu, wm);
cl(Ru, vm);
cl(Ts, Em);
function vm(t) {
  const { data: n, startEpochMS: e } = t ?? {};
  if (!n) {
    console.warn(`[${T}] Received empty tween-sequence socket message.`);
    return;
  }
  try {
    dl(n, { validateSemantics: !0 }).run({ commit: !1, startEpochMS: e, broadcast: !1 });
  } catch (i) {
    console.error(`[${T}] Failed to run received tween sequence:`, i);
  }
}
l(vm, "handleSequenceSocketMessage");
function Em(t) {
  const { name: n } = t ?? {};
  n && Bu(n);
}
l(Em, "handleSequenceCancelMessage");
function Tm() {
  Hooks.once("ready", () => {
    zh();
    const t = game.modules.get(T);
    t.api || (t.api = {}), t.api.tween = {
      dispatch: bm,
      types: Cs,
      Timeline: da,
      ErrorPolicy: Oe,
      compileSequence: dl,
      cancelTimeline: Bu,
      getTimeline: dm
    }, console.log(`[${T}] Tween API registered. Types: ${Cs().join(", ")}`);
  });
}
l(Tm, "registerTweenHooks");
Tm();
const Cm = ["tag", "tag-all", "id", "tags-any", "tags-all"], Sm = /* @__PURE__ */ new Set(["tags-any", "tags-all"]);
function fl(t) {
  if (!t || typeof t != "string")
    return { type: "unknown", value: t ?? "" };
  if (t.startsWith("$"))
    return { type: "special", value: t };
  for (const n of Cm)
    if (t.startsWith(`${n}:`)) {
      const e = t.slice(n.length + 1), i = Sm.has(n) ? e.split(",").map((r) => r.trim()) : e;
      return { type: n, value: i };
    }
  return t.includes(".") ? { type: "uuid", value: t } : { type: "unknown", value: t };
}
l(fl, "parseSelector");
function Lm(t) {
  if (!t) return "";
  const { type: n, value: e } = t;
  if (n === "special" || n === "uuid" || n === "unknown")
    return Array.isArray(e) ? e.join(",") : e ?? "";
  const i = Array.isArray(e) ? e.join(",") : e ?? "";
  return `${n}:${i}`;
}
l(Lm, "buildSelector");
function Ku(t, n = "first") {
  return t != null && t.length ? t.length === 1 ? n === "first-all" || n === "all" ? `tag-all:${t[0]}` : `tag:${t[0]}` : n === "any" ? `tags-any:${t.join(",")}` : n === "all" ? `tags-all:${t.join(",")}` : n === "first-all" ? `tags-all:${t.join(",")}` : `tags-any:${t.join(",")}` : "";
}
l(Ku, "buildTagSelector");
function lo(t) {
  if (!t) return null;
  if (t.documentName || t._source !== void 0) {
    const n = t.object;
    return n ? { placeable: n, doc: t } : null;
  }
  return t.document ? { placeable: t, doc: t.document } : null;
}
l(lo, "normalizePlaceable");
function Yu() {
  var t;
  return window.Tagger ?? ((t = game.modules.get("tagger")) == null ? void 0 : t.api) ?? null;
}
l(Yu, "getTaggerAPI");
function co(t, n) {
  if (!t) return null;
  const e = n ?? canvas.scene;
  if (!e) return null;
  const i = fl(t);
  switch (i.type) {
    case "special":
      return Im(i.value);
    case "tag":
      return ec(i.value, e, !1);
    case "tag-all":
      return ec(i.value, e, !0);
    case "id":
      return Om(i.value, e);
    case "tags-any":
      return tc(i.value, e, !0);
    case "tags-all":
      return tc(i.value, e, !1);
    case "uuid":
      return Am(i.value);
    default:
      return null;
  }
}
l(co, "resolveSelector");
function Im(t) {
  var n;
  if (t === "$particles") {
    if (!((n = game.modules.get("fxmaster")) != null && n.active))
      return console.warn(`[${T}] Picker: FXMaster not active, cannot resolve "$particles".`), null;
    const e = canvas.particleeffects;
    return e ? { kind: "particles", documents: [], placeables: [], target: e } : null;
  }
  return null;
}
l(Im, "resolveSpecial");
function ec(t, n, e) {
  const i = Yu();
  if (!i)
    return console.warn(`[${T}] Picker: Tagger not available, cannot resolve tag "${t}".`), null;
  const r = i.getByTag(t, { sceneId: n.id });
  if (!(r != null && r.length)) return null;
  const a = e ? r : [r[0]], o = [];
  for (const s of a) {
    const c = lo(s);
    c && o.push(c);
  }
  return o.length === 0 ? null : {
    kind: e ? "multi-placeable" : "placeable",
    documents: o.map((s) => s.doc),
    placeables: o
  };
}
l(ec, "resolveTag");
function Om(t, n) {
  const e = [
    n.tiles,
    n.lights,
    n.tokens,
    n.drawings,
    n.sounds
  ];
  for (const i of e) {
    const r = i == null ? void 0 : i.get(t);
    if (r) {
      const a = lo(r);
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
l(Om, "resolveById");
function tc(t, n, e) {
  const i = Yu();
  if (!i)
    return console.warn(`[${T}] Picker: Tagger not available, cannot resolve multi-tag.`), null;
  const r = i.getByTag(t, {
    sceneId: n.id,
    matchAny: e
  });
  if (!(r != null && r.length)) return null;
  const a = [];
  for (const o of r) {
    const s = lo(o);
    s && a.push(s);
  }
  return a.length === 0 ? null : {
    kind: a.length === 1 ? "placeable" : "multi-placeable",
    documents: a.map((o) => o.doc),
    placeables: a
  };
}
l(tc, "resolveMultiTag");
function Am(t) {
  const n = fromUuidSync(t);
  if (!n) return null;
  const e = lo(n);
  return e ? {
    kind: "placeable",
    documents: [e.doc],
    placeables: [e]
  } : null;
}
l(Am, "resolveUUID");
function Mm(t) {
  var n;
  if (!t) return null;
  if (t.kind === "particles")
    return { kind: "particles", target: t.target };
  if (t.kind === "multi-placeable")
    return { kind: "multi-placeable", placeables: t.placeables };
  if ((n = t.placeables) != null && n.length) {
    const e = t.placeables[0];
    return { kind: "placeable", placeable: e.placeable, doc: e.doc };
  }
  return null;
}
l(Mm, "adaptResolved");
function gl(t) {
  const n = /* @__PURE__ */ new Set();
  if (t.setup)
    for (const r of Object.keys(t.setup)) n.add(r);
  if (t.landing)
    for (const r of Object.keys(t.landing)) n.add(r);
  t.timeline && Xu(t.timeline, n);
  const e = /* @__PURE__ */ new Map(), i = [];
  for (const r of n) {
    const a = co(r), o = Mm(a);
    o ? e.set(r, o) : i.push(r);
  }
  return i.length && console.warn(`[${T}] Cinematic: ${i.length} unresolved target(s): ${i.join(", ")}`), { targets: e, unresolved: i };
}
l(gl, "resolveAllTargets");
function Nm(t, n) {
  if (!t) return {};
  const e = {};
  for (const [i, r] of Object.entries(t)) {
    const a = n.get(i);
    if (a)
      if (a.kind === "particles") {
        if (a.target.destroyed) continue;
        const o = {};
        for (const s of Object.keys(r))
          o[s] = a.target[s];
        e[i] = o;
      } else if (a.kind === "multi-placeable") {
        const o = a.placeables[0];
        if (!(o != null && o.doc)) continue;
        const s = {};
        for (const c of Object.keys(r))
          s[c] = foundry.utils.getProperty(o.doc._source, c);
        e[i] = s;
      } else {
        if (!a.doc) continue;
        const o = {};
        for (const s of Object.keys(r))
          o[s] = foundry.utils.getProperty(a.doc._source, s);
        e[i] = o;
      }
  }
  return e;
}
l(Nm, "captureSnapshot");
function km(t) {
  const n = {};
  function e(i) {
    if (i)
      for (const [r, a] of Object.entries(i))
        n[r] || (n[r] = {}), Object.assign(n[r], a);
  }
  return l(e, "mergeMap"), e(t.setup), e(t.landing), t.timeline && Qu(t.timeline, n, e), n;
}
l(km, "gatherAllStateMaps");
function Qu(t, n, e) {
  var i;
  for (const r of t)
    if (!(r.delay != null || r.await != null || r.emit != null)) {
      if ((i = r.parallel) != null && i.branches) {
        for (const a of r.parallel.branches)
          Qu(a, n, e);
        continue;
      }
      if (e(r.before), e(r.after), r.tweens)
        for (const a of r.tweens)
          a.target && a.attribute && (n[a.target] || (n[a.target] = {}), n[a.target][a.attribute] = "__snapshot__");
    }
}
l(Qu, "gatherFromEntries");
function Xu(t, n) {
  for (const e of t)
    if (e.delay == null && e.await == null && e.emit == null) {
      if (e.parallel) {
        const i = e.parallel;
        if (i.branches)
          for (const r of i.branches)
            Xu(r, n);
        continue;
      }
      if (e.before)
        for (const i of Object.keys(e.before)) n.add(i);
      if (e.after)
        for (const i of Object.keys(e.after)) n.add(i);
      if (e.tweens)
        for (const i of e.tweens)
          i.target && n.add(i.target);
    }
}
l(Xu, "collectSelectorsFromEntries");
const nc = {
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
}, xm = /* @__PURE__ */ new Set([
  "alpha",
  "visible",
  "x",
  "y",
  "scale",
  "rotation"
]);
function Oo(t, n, e) {
  const i = {};
  for (const [r, a] of Object.entries(t))
    n.has(r) ? i[r] = a : console.warn(`[${T}] Cinematic: blocked property "${r}" on ${e}.`);
  return i;
}
l(Oo, "filterOverrides");
function st(t, n) {
  var i, r;
  if (!t) return;
  const e = [];
  for (const [a, o] of Object.entries(t)) {
    const s = n.get(a);
    if (s)
      if (s.kind === "particles") {
        if (s.target.destroyed) continue;
        const c = Oo(o, xm, "$particles");
        for (const [u, d] of Object.entries(c))
          s.target[u] = d;
      } else if (s.kind === "multi-placeable")
        for (const { placeable: c, doc: u } of s.placeables) {
          if (!(u != null && u.parent) || !(c != null && c.scene)) continue;
          const d = u.documentName, g = nc[d];
          if (!g) {
            console.warn(`[${T}] Cinematic: no allowlist for document type "${d}" on "${a}", skipping.`);
            continue;
          }
          const p = Oo(o, g, `${d} "${a}"`);
          u.updateSource(p), e.push(c);
        }
      else {
        if (!((i = s.doc) != null && i.parent) || !((r = s.placeable) != null && r.scene)) continue;
        const c = s.doc.documentName, u = nc[c];
        if (!u) {
          console.warn(`[${T}] Cinematic: no allowlist for document type "${c}" on "${a}", skipping.`);
          continue;
        }
        const d = Oo(o, u, `${c} "${a}"`);
        s.doc.updateSource(d), e.push(s.placeable);
      }
  }
  for (const a of e)
    a.refresh();
}
l(st, "applyState");
function ti(t, n) {
  var e;
  if (t)
    for (const i of Object.keys(t)) {
      const r = n.get(i);
      if ((r == null ? void 0 : r.kind) === "placeable" && ((e = r.doc) == null ? void 0 : e.documentName) === "AmbientLight") {
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
l(ti, "refreshPerceptionIfNeeded");
const Dm = {
  "tile-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "light-color": /* @__PURE__ */ new Set(["uuid", "toColor", "toAlpha", "mode"]),
  "light-state": /* @__PURE__ */ new Set(["uuid", "enabled"]),
  "particles-prop": /* @__PURE__ */ new Set(["attribute", "value"]),
  "camera-pan": /* @__PURE__ */ new Set(["x", "y", "scale"]),
  "token-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "drawing-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "sound-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"])
}, $m = /* @__PURE__ */ new Set(["duration", "easing", "detach"]), Fm = /* @__PURE__ */ new Set(["type", "target"]);
function Zu(t, n) {
  const { type: e, target: i, detach: r = !1, ...a } = t;
  if (!e)
    return console.warn(`[${T}] Cinematic: tween entry missing 'type', skipping.`), null;
  const o = {}, s = {}, c = Dm[e];
  if (i === "$particles")
    o.target = "$particles";
  else if (i) {
    const u = n.get(i);
    if (!u) return null;
    u.kind === "multi-placeable" ? o.uuid = u.placeables.map((d) => d.doc.uuid) : o.uuid = u.doc.uuid;
  }
  for (const [u, d] of Object.entries(a))
    Fm.has(u) || (u === "duration" ? s.durationMS = d : $m.has(u) ? s[u] = d : (c != null && c.has(u), o[u] = d));
  return { type: e, params: o, opts: s, detach: r };
}
l(Zu, "compileTween");
function _m(t, n, e, i = {}) {
  const r = new e().name(`cinematic-${canvas.scene.id}`), { skipToStep: a, onStepComplete: o } = i;
  return r.beforeAll(() => {
    var s;
    try {
      st(t.setup, n), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    } catch (c) {
      throw console.error(`[${T}] Cinematic: error in beforeAll (setup state) on scene ${(s = canvas.scene) == null ? void 0 : s.id}:`, c), c;
    }
  }), td(t.timeline, r, n, { skipToStep: a, onStepComplete: o }), r;
}
l(_m, "buildTimeline");
function ed(t, n) {
  var e;
  if (t)
    for (const i of t)
      for (const r of i) {
        if (r.before)
          try {
            st(r.before, n), ti(r.before, n);
          } catch (a) {
            console.warn(`[${T}] Cinematic: error in skipped parallel before:`, a);
          }
        if (r.after)
          try {
            st(r.after, n), ti(r.after, n);
          } catch (a) {
            console.warn(`[${T}] Cinematic: error in skipped parallel after:`, a);
          }
        (e = r.parallel) != null && e.branches && ed(r.parallel.branches, n);
      }
}
l(ed, "applyParallelStatesForSkip");
function td(t, n, e, i = {}) {
  const { skipToStep: r, onStepComplete: a } = i;
  let o = -1;
  for (const s of t) {
    if (s.delay != null) {
      if (r != null && o < r) continue;
      n.delay(s.delay);
      continue;
    }
    if (s.await != null) {
      if (r != null && o < r) continue;
      n.await(s.await);
      continue;
    }
    if (s.emit != null) {
      if (r != null && o < r) continue;
      n.emit(s.emit);
      continue;
    }
    if (s.parallel) {
      if (r != null && o < r) {
        ed(s.parallel.branches, e);
        continue;
      }
      const d = s.parallel, g = d.branches.map((p) => (b) => td(p, b, e));
      n.parallel(g, {
        join: d.join ?? "all",
        overflow: d.overflow ?? "detach"
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
          st(s.before, e), ti(s.before, e);
        } catch (d) {
          console.warn(`[${T}] Cinematic: error applying skipped step.before:`, d);
        }
      if (s.after)
        try {
          st(s.after, e), ti(s.after, e);
        } catch (d) {
          console.warn(`[${T}] Cinematic: error applying skipped step.after:`, d);
        }
      continue;
    }
    const c = o, u = n.step();
    s.before && u.before(() => {
      var d;
      try {
        st(s.before, e), ti(s.before, e);
      } catch (g) {
        throw console.error(`[${T}] Cinematic: error in step.before callback on scene ${(d = canvas.scene) == null ? void 0 : d.id}:`, g), g;
      }
    });
    for (const d of s.tweens) {
      const g = Zu(d, e);
      g && (u.add(g.type, g.params, g.opts), g.detach && u.detach());
    }
    u.after(() => {
      var d;
      try {
        s.after && (st(s.after, e), ti(s.after, e)), a == null || a(c);
      } catch (g) {
        throw console.error(`[${T}] Cinematic: error in step.after callback on scene ${(d = canvas.scene) == null ? void 0 : d.id}:`, g), g;
      }
    });
  }
}
l(td, "compileCinematicEntries");
function fa(t, n, e) {
  if (t != null) {
    if (typeof t != "object" || Array.isArray(t)) {
      e.push({ path: n, level: "error", message: `Expected object, got ${Array.isArray(t) ? "array" : typeof t}` });
      return;
    }
    for (const [i, r] of Object.entries(t))
      (typeof r != "object" || r === null || Array.isArray(r)) && e.push({ path: `${n}["${i}"]`, level: "error", message: `Expected property overrides object, got ${Array.isArray(r) ? "array" : typeof r}` });
  }
}
l(fa, "validateStateMap");
function nd(t, n, e, i) {
  var r;
  for (let a = 0; a < t.length; a++) {
    const o = t[a], s = `${n}[${a}]`;
    if (!(o.delay != null || o.await != null || o.emit != null)) {
      if ((r = o.parallel) != null && r.branches) {
        for (let c = 0; c < o.parallel.branches.length; c++)
          nd(o.parallel.branches[c], `${s}.parallel.branches[${c}]`, e, i);
        continue;
      }
      if (fa(o.before, `${s}.before`, i), fa(o.after, `${s}.after`, i), o.tweens)
        for (let c = 0; c < o.tweens.length; c++) {
          const u = o.tweens[c], d = `${s}.tweens[${c}]`;
          if (!u.type) {
            i.push({ path: d, level: "error", message: "Missing 'type' field" });
            continue;
          }
          const g = gr(u.type);
          if (!g) {
            i.push({ path: d, level: "error", message: `Unknown tween type: "${u.type}"` });
            continue;
          }
          if (e)
            try {
              const p = Zu(u, e);
              p ? g.validate(p.params) : u.target && i.push({ path: d, level: "warn", message: `Target "${u.target}" could not be resolved for compilation` });
            } catch (p) {
              i.push({ path: d, level: "error", message: p.message });
            }
          e && u.target && !e.has(u.target) && i.push({ path: `${d}.target`, level: "warn", message: `Target "${u.target}" is not resolved` });
        }
    }
  }
}
l(nd, "validateEntries");
function Pm(t, n = null) {
  const e = [];
  return !t || typeof t != "object" ? (e.push({ path: "", level: "error", message: "Cinematic data is not an object" }), e) : (fa(t.setup, "setup", e), fa(t.landing, "landing", e), t.timeline && Array.isArray(t.timeline) && nd(t.timeline, "timeline", n, e), e);
}
l(Pm, "validateCinematicDeep");
const ic = 2;
var ge, Pn, Ga, id, le, $e, Ct;
const Yt = class Yt {
  constructor(n = null, { loadedHash: e = null } = {}) {
    N(this, le);
    N(this, ge);
    N(this, Pn);
    L(this, ge, n ?? Yt.empty()), L(this, Pn, e);
  }
  static empty() {
    return { version: ic, trigger: "canvasReady", tracking: !0, setup: {}, landing: {}, timeline: [] };
  }
  static fromScene(n) {
    var a;
    const e = n == null ? void 0 : n.getFlag(T, "cinematic"), i = e ? foundry.utils.deepClone(e) : null, r = e ? h(a = Yt, Ga, id).call(a, e) : null;
    return new Yt(i, { loadedHash: r });
  }
  /**
   * Check if the scene's cinematic flag has been modified since this state was loaded.
   * @param {object} scene  The Foundry scene document
   * @returns {boolean} true if scene data differs from what was loaded
   */
  isStale(n) {
    if (!f(this, Pn)) return !1;
    const e = n == null ? void 0 : n.getFlag(T, "cinematic");
    return e ? !foundry.utils.objectsEqual(e, f(this, Pn)) : !1;
  }
  // ── Read ──────────────────────────────────────────────────────────────
  get data() {
    return f(this, ge);
  }
  get timeline() {
    return f(this, ge).timeline;
  }
  get trigger() {
    return f(this, ge).trigger;
  }
  get tracking() {
    return f(this, ge).tracking;
  }
  get setup() {
    return f(this, ge).setup;
  }
  get landing() {
    return f(this, ge).landing;
  }
  get isEmpty() {
    var n;
    return !((n = f(this, ge).timeline) != null && n.length);
  }
  get synchronized() {
    return f(this, ge).synchronized ?? !1;
  }
  // ── Top-level mutations ───────────────────────────────────────────────
  setTrigger(n) {
    return h(this, le, $e).call(this, { trigger: n });
  }
  setTracking(n) {
    return h(this, le, $e).call(this, { tracking: n });
  }
  setSynchronized(n) {
    return h(this, le, $e).call(this, { synchronized: n });
  }
  setSetup(n) {
    return h(this, le, $e).call(this, { setup: n });
  }
  setLanding(n) {
    return h(this, le, $e).call(this, { landing: n });
  }
  // ── Timeline entry mutations ──────────────────────────────────────────
  addStep(n = -1) {
    const e = [...f(this, ge).timeline], i = { tweens: [] };
    return n < 0 || n >= e.length ? e.push(i) : e.splice(n, 0, i), h(this, le, $e).call(this, { timeline: e });
  }
  addDelay(n = -1, e = 1e3) {
    const i = [...f(this, ge).timeline], r = { delay: e };
    return n < 0 || n >= i.length ? i.push(r) : i.splice(n, 0, r), h(this, le, $e).call(this, { timeline: i });
  }
  addAwait(n = -1, e = null) {
    const i = [...f(this, ge).timeline], r = { await: e ?? { event: "click" } };
    return n < 0 || n >= i.length ? i.push(r) : i.splice(n, 0, r), h(this, le, $e).call(this, { timeline: i });
  }
  addEmit(n = -1, e = "") {
    const i = [...f(this, ge).timeline], r = { emit: e };
    return n < 0 || n >= i.length ? i.push(r) : i.splice(n, 0, r), h(this, le, $e).call(this, { timeline: i });
  }
  addParallel(n = -1) {
    const e = [...f(this, ge).timeline], i = { parallel: { branches: [[], []], join: "all", overflow: "detach" } };
    return n < 0 || n >= e.length ? e.push(i) : e.splice(n, 0, i), h(this, le, $e).call(this, { timeline: e });
  }
  moveEntry(n, e) {
    if (n === e) return this;
    const i = [...f(this, ge).timeline];
    if (n < 0 || n >= i.length) return this;
    if (e < 0 || e >= i.length) return this;
    const [r] = i.splice(n, 1);
    return i.splice(e, 0, r), h(this, le, $e).call(this, { timeline: i });
  }
  removeEntry(n) {
    const e = [...f(this, ge).timeline];
    return n < 0 || n >= e.length ? this : (e.splice(n, 1), h(this, le, $e).call(this, { timeline: e }));
  }
  updateEntry(n, e) {
    const i = f(this, ge).timeline.map((r, a) => a !== n ? r : { ...foundry.utils.deepClone(r), ...e });
    return h(this, le, $e).call(this, { timeline: i });
  }
  // ── Tween mutations ──────────────────────────────────────────────────
  addTween(n, e = null) {
    const i = { type: "tile-prop", target: "", attribute: "alpha", value: 1, duration: 1e3 };
    return h(this, le, Ct).call(this, n, (r) => {
      const a = [...r.tweens ?? [], e ?? i];
      return { ...r, tweens: a };
    });
  }
  updateTween(n, e, i) {
    return h(this, le, Ct).call(this, n, (r) => {
      const a = (r.tweens ?? []).map((o, s) => s !== e ? o : { ...o, ...i });
      return { ...r, tweens: a };
    });
  }
  removeTween(n, e) {
    return h(this, le, Ct).call(this, n, (i) => {
      const r = (i.tweens ?? []).filter((a, o) => o !== e);
      return { ...i, tweens: r };
    });
  }
  // ── Parallel branch mutations ────────────────────────────────────────
  addBranch(n) {
    return h(this, le, Ct).call(this, n, (e) => {
      if (!e.parallel) return e;
      const i = [...e.parallel.branches, []];
      return { ...e, parallel: { ...e.parallel, branches: i } };
    });
  }
  removeBranch(n, e) {
    return h(this, le, Ct).call(this, n, (i) => {
      if (!i.parallel) return i;
      const r = i.parallel.branches.filter((a, o) => o !== e);
      return r.length < 1 ? i : { ...i, parallel: { ...i.parallel, branches: r } };
    });
  }
  addBranchEntry(n, e, i = null) {
    const r = { tweens: [] };
    return h(this, le, Ct).call(this, n, (a) => {
      if (!a.parallel) return a;
      const o = a.parallel.branches.map((s, c) => c !== e ? s : [...s, i ?? r]);
      return { ...a, parallel: { ...a.parallel, branches: o } };
    });
  }
  removeBranchEntry(n, e, i) {
    return h(this, le, Ct).call(this, n, (r) => {
      if (!r.parallel) return r;
      const a = r.parallel.branches.map((o, s) => s !== e ? o : o.filter((c, u) => u !== i));
      return { ...r, parallel: { ...r.parallel, branches: a } };
    });
  }
  updateBranchEntry(n, e, i, r) {
    return h(this, le, Ct).call(this, n, (a) => {
      if (!a.parallel) return a;
      const o = a.parallel.branches.map((s, c) => c !== e ? s : s.map((u, d) => d !== i ? u : { ...foundry.utils.deepClone(u), ...r }));
      return { ...a, parallel: { ...a.parallel, branches: o } };
    });
  }
  moveBranchEntry(n, e, i, r) {
    return i === r ? this : h(this, le, Ct).call(this, n, (a) => {
      if (!a.parallel) return a;
      const o = a.parallel.branches.map((s, c) => {
        if (c !== e) return s;
        const u = [...s];
        if (i < 0 || i >= u.length || r < 0 || r >= u.length) return s;
        const [d] = u.splice(i, 1);
        return u.splice(r, 0, d), u;
      });
      return { ...a, parallel: { ...a.parallel, branches: o } };
    });
  }
  // ── Persistence ──────────────────────────────────────────────────────
  async save(n) {
    const e = { ...f(this, ge), version: ic };
    await n.setFlag(T, "cinematic", e);
  }
  toJSON() {
    return foundry.utils.deepClone(f(this, ge));
  }
};
ge = new WeakMap(), Pn = new WeakMap(), Ga = new WeakSet(), id = /* @__PURE__ */ l(function(n) {
  return foundry.utils.deepClone(n);
}, "#computeHash"), le = new WeakSet(), // ── Internal ─────────────────────────────────────────────────────────
$e = /* @__PURE__ */ l(function(n) {
  return new Yt({ ...foundry.utils.deepClone(f(this, ge)), ...n }, { loadedHash: f(this, Pn) });
}, "#clone"), Ct = /* @__PURE__ */ l(function(n, e) {
  if (n < 0 || n >= f(this, ge).timeline.length) return this;
  const i = f(this, ge).timeline.map((r, a) => a !== n ? r : e(foundry.utils.deepClone(r)));
  return h(this, le, $e).call(this, { timeline: i });
}, "#mutateEntry"), N(Yt, Ga), l(Yt, "CinematicState");
let ni = Yt;
const pi = /* @__PURE__ */ new WeakMap(), ga = /* @__PURE__ */ new Set(), ha = /* @__PURE__ */ new Set(), rc = {
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
function ma(t, n = {}) {
  var y, m, v;
  if (!t) return !1;
  yi(t);
  const e = n.mode ?? (n.color != null ? "custom" : "hover"), i = rc[e] ?? rc.hover, r = n.color ?? i.borderColor, a = n.alpha ?? i.borderAlpha, o = n.color ?? i.spriteTint, s = i.spriteAlpha, c = n.pulse ?? i.pulse, u = { border: null, sprite: null, pulseData: null, mode: e }, d = ((y = t.document) == null ? void 0 : y.width) ?? t.w ?? 100, g = ((m = t.document) == null ? void 0 : m.height) ?? t.h ?? 100, p = new PIXI.Graphics();
  p.lineStyle(i.borderWidth, r, a), p.drawRect(0, 0, d, g), t.addChild(p), u.border = p;
  const b = Rm(t, o, s);
  if (b && (canvas.controls.debug.addChild(b), ha.add(b), u.sprite = b), c && ((v = canvas.app) != null && v.ticker)) {
    const E = {
      elapsed: 0,
      fn: /* @__PURE__ */ l((C) => {
        E.elapsed += C;
        const M = (Math.sin(E.elapsed * 0.05) + 1) / 2;
        u.border && (u.border.alpha = a * (0.4 + 0.6 * M)), u.sprite && (u.sprite.alpha = s * (0.5 + 0.5 * M));
      }, "fn")
    };
    canvas.app.ticker.add(E.fn), u.pulseData = E, ga.add(E);
  }
  return pi.set(t, u), !0;
}
l(ma, "addHighlight");
function yi(t) {
  var e, i;
  if (!t) return;
  const n = pi.get(t);
  n && (n.pulseData && ((i = (e = canvas.app) == null ? void 0 : e.ticker) == null || i.remove(n.pulseData.fn), ga.delete(n.pulseData)), n.border && (n.border.parent && n.border.parent.removeChild(n.border), n.border.destroy({ children: !0 })), n.sprite && (n.sprite.parent && n.sprite.parent.removeChild(n.sprite), n.sprite.destroy({ children: !0 }), ha.delete(n.sprite)), pi.delete(t));
}
l(yi, "removeHighlight");
function rd(t) {
  return pi.has(t);
}
l(rd, "hasHighlight");
function Ur() {
  var n, e, i, r, a, o, s;
  for (const c of ga)
    (e = (n = canvas.app) == null ? void 0 : n.ticker) == null || e.remove(c.fn);
  ga.clear();
  for (const c of ha)
    c.parent && c.parent.removeChild(c), c.destroy({ children: !0 });
  ha.clear();
  const t = [
    (i = canvas.tiles) == null ? void 0 : i.placeables,
    (r = canvas.tokens) == null ? void 0 : r.placeables,
    (a = canvas.lighting) == null ? void 0 : a.placeables,
    (o = canvas.drawings) == null ? void 0 : o.placeables,
    (s = canvas.sounds) == null ? void 0 : s.placeables
  ];
  for (const c of t)
    if (c)
      for (const u of c) {
        const d = pi.get(u);
        d && (d.border && (d.border.parent && d.border.parent.removeChild(d.border), d.border.destroy({ children: !0 })), pi.delete(u));
      }
}
l(Ur, "clearAllHighlights");
function Rm(t, n, e) {
  var a;
  const i = t.mesh;
  if (!((a = i == null ? void 0 : i.texture) != null && a.baseTexture)) return null;
  const r = PIXI.Sprite.from(i.texture);
  return r.isSprite = !0, r.anchor.set(i.anchor.x, i.anchor.y), r.width = i.width, r.height = i.height, r.scale = i.scale, r.position = t.center, r.angle = i.angle, r.alpha = e, r.tint = n, r.name = "eidolonPickerHighlight", r;
}
l(Rm, "createTintSprite");
let Sn = null;
function ad(t) {
  var y, m, v;
  Sn && Sn.cancel();
  const { placeableType: n = "Tile", onPick: e, onCancel: i } = t;
  let r = null;
  const a = `control${n}`, o = `hover${n}`, s = /* @__PURE__ */ l((E, C) => {
    var D;
    if (!C) return;
    const M = E.document ?? E;
    (D = E.release) == null || D.call(E), e(M);
  }, "onControl"), c = /* @__PURE__ */ l((E, C) => {
    C ? (r = E, ma(E, { mode: "pick" })) : r === E && (yi(E), r = null);
  }, "onHoverIn"), u = /* @__PURE__ */ l((E) => {
    E.key === "Escape" && (E.preventDefault(), E.stopPropagation(), b());
  }, "onKeydown"), d = /* @__PURE__ */ l((E) => {
    E.preventDefault(), b();
  }, "onContextMenu"), g = Hooks.on(a, s), p = Hooks.on(o, c);
  document.addEventListener("keydown", u, { capture: !0 }), (y = canvas.stage) == null || y.addEventListener("rightclick", d), (v = (m = ui.notifications) == null ? void 0 : m.info) == null || v.call(m, `Pick mode active — click a ${n.toLowerCase()} on the canvas, or press ESC to cancel.`, { permanent: !1 });
  function b() {
    var E;
    Sn && (Sn = null, Hooks.off(a, g), Hooks.off(o, p), document.removeEventListener("keydown", u, { capture: !0 }), (E = canvas.stage) == null || E.removeEventListener("rightclick", d), r && (yi(r), r = null), i == null || i());
  }
  return l(b, "cancel"), Sn = { cancel: b }, { cancel: b };
}
l(ad, "enterPickMode");
function $i() {
  Sn && Sn.cancel();
}
l($i, "cancelPickMode");
const Hm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cancelPickMode: $i,
  enterPickMode: ad
}, Symbol.toStringTag, { value: "Module" }));
var mc, Ne, Ue, rr, rn, ar, or, Qe, an, pe, od, ks, sd, ld, cd, xs, Ds, ud, dd;
const rt = class rt extends bn(yn) {
  /**
   * @param {object} options
   * @param {string[]} [options.selections]  Initial selections
   * @param {string} [options.placeableType]  "Tile", "Token", etc.
   * @param {(selectors: string[]) => void} [options.onApply]
   * @param {() => void} [options.onCancel]
   */
  constructor(e = {}) {
    super(e);
    N(this, pe);
    /** @type {string[]} Current selections (selector strings). */
    N(this, Ne, []);
    /** @type {boolean} Whether pick mode is active. */
    N(this, Ue, !1);
    /** @type {string} Placeable type (Tile, Token, etc.). */
    N(this, rr, "Tile");
    /** @type {string} Current tag match mode. */
    N(this, rn, "any");
    /** @type {((selectors: string[]) => void) | null} */
    N(this, ar, null);
    /** @type {(() => void) | null} */
    N(this, or, null);
    /** @type {Promise resolve function for the open() API. */
    N(this, Qe, null);
    /** @type {PlaceableObject | null} Currently hovered tile in the browser. */
    N(this, an, null);
    L(this, Ne, [...e.selections ?? []]), L(this, rr, e.placeableType ?? "Tile"), L(this, ar, e.onApply ?? null), L(this, or, e.onCancel ?? null);
  }
  // ── Context ───────────────────────────────────────────────────────────
  async _prepareContext() {
    var r;
    const e = h(this, pe, xs).call(this), i = (((r = canvas.tiles) == null ? void 0 : r.placeables) ?? []).map((a, o) => {
      var d, g;
      const s = a.document, c = s.id, u = (d = s.texture) != null && d.src ? s.texture.src.split("/").pop().replace(/\.[^.]+$/, "") : `Tile ${o + 1}`;
      return {
        id: c,
        name: u.length > 20 ? u.slice(0, 18) + "..." : u,
        thumbnailSrc: ((g = s.texture) == null ? void 0 : g.src) ?? null,
        selected: e.has(c)
      };
    });
    return {
      selections: f(this, Ne),
      selectionCount: f(this, Ne).length,
      pickModeActive: f(this, Ue),
      tagModeIsAny: f(this, rn) === "any",
      tagModeIsAll: f(this, rn) === "all",
      tagPreviewCount: 0,
      tiles: i,
      tileCount: i.length
    };
  }
  // ── Render & Events ───────────────────────────────────────────────────
  _onRender(e, i) {
    super._onRender(e, i), h(this, pe, od).call(this), h(this, pe, Ds).call(this);
  }
  async _onClose(e) {
    return f(this, Ue) && ($i(), L(this, Ue, !1)), Ur(), f(this, Qe) && (f(this, Qe).call(this, null), L(this, Qe, null)), super._onClose(e);
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
  static open(e = {}) {
    return new Promise((i) => {
      const r = new rt({
        ...e,
        onApply: /* @__PURE__ */ l((a) => i(a), "onApply"),
        onCancel: /* @__PURE__ */ l(() => i(null), "onCancel")
      });
      L(r, Qe, i), r.render(!0);
    });
  }
};
Ne = new WeakMap(), Ue = new WeakMap(), rr = new WeakMap(), rn = new WeakMap(), ar = new WeakMap(), or = new WeakMap(), Qe = new WeakMap(), an = new WeakMap(), pe = new WeakSet(), od = /* @__PURE__ */ l(function() {
  var a, o, s, c;
  const e = this.element;
  if (!(e instanceof HTMLElement)) return;
  const i = e.querySelector("[data-role='tag-input']"), r = e.querySelector("[data-role='tag-mode']");
  r == null || r.addEventListener("change", (u) => {
    L(this, rn, u.target.value);
  }), i == null || i.addEventListener("input", () => {
    h(this, pe, sd).call(this, e);
  }), i == null || i.addEventListener("keydown", (u) => {
    u.key === "Enter" && (u.preventDefault(), h(this, pe, ks).call(this, e));
  }), (a = e.querySelector("[data-action='add-tag-selector']")) == null || a.addEventListener("click", () => {
    h(this, pe, ks).call(this, e);
  }), (o = e.querySelector("[data-action='toggle-pick-mode']")) == null || o.addEventListener("click", () => {
    f(this, Ue) ? ($i(), L(this, Ue, !1)) : (L(this, Ue, !0), ad({
      placeableType: f(this, rr),
      onPick: /* @__PURE__ */ l((u) => {
        h(this, pe, ld).call(this, u.id);
      }, "onPick"),
      onCancel: /* @__PURE__ */ l(() => {
        L(this, Ue, !1), this.render({ force: !0 });
      }, "onCancel")
    })), this.render({ force: !0 });
  }), e.querySelectorAll("[data-action='toggle-tile']").forEach((u) => {
    u.addEventListener("click", () => {
      const d = u.dataset.docId;
      d && h(this, pe, cd).call(this, d);
    }), u.addEventListener("mouseenter", () => {
      var p, b;
      const d = u.dataset.docId;
      if (!d) return;
      const g = (b = (p = canvas.tiles) == null ? void 0 : p.placeables) == null ? void 0 : b.find((y) => y.document.id === d);
      g && (L(this, an, g), ma(g, { mode: "hover" }));
    }), u.addEventListener("mouseleave", () => {
      f(this, an) && (yi(f(this, an)), L(this, an, null), h(this, pe, Ds).call(this));
    });
  }), e.querySelectorAll("[data-action='remove-selection']").forEach((u) => {
    u.addEventListener("click", () => {
      const d = Number(u.dataset.selectionIndex);
      Number.isNaN(d) || (f(this, Ne).splice(d, 1), this.render({ force: !0 }));
    });
  }), (s = e.querySelector("[data-action='apply']")) == null || s.addEventListener("click", () => {
    h(this, pe, ud).call(this);
  }), (c = e.querySelector("[data-action='cancel']")) == null || c.addEventListener("click", () => {
    h(this, pe, dd).call(this);
  });
}, "#bindEvents"), // ── Tag helpers ───────────────────────────────────────────────────────
ks = /* @__PURE__ */ l(function(e) {
  var s;
  const i = e.querySelector("[data-role='tag-input']"), r = (s = i == null ? void 0 : i.value) == null ? void 0 : s.trim();
  if (!r) return;
  const a = r.split(",").map((c) => c.trim()).filter(Boolean);
  if (a.length === 0) return;
  const o = Ku(a, f(this, rn));
  o && !f(this, Ne).includes(o) && f(this, Ne).push(o), i && (i.value = ""), this.render({ force: !0 });
}, "#addTagSelector"), sd = /* @__PURE__ */ l(function(e) {
  var g, p;
  const i = e.querySelector("[data-role='tag-input']"), r = e.querySelector("[data-role='tag-preview']");
  if (!i || !r) return;
  const a = i.value.trim();
  if (!a) {
    r.textContent = "";
    return;
  }
  const o = a.split(",").map((b) => b.trim()).filter(Boolean);
  if (o.length === 0) {
    r.textContent = "";
    return;
  }
  const s = window.Tagger ?? ((g = game.modules.get("tagger")) == null ? void 0 : g.api);
  if (!s) {
    r.textContent = "Tagger not available";
    return;
  }
  const c = f(this, rn) === "any", u = s.getByTag(o, {
    sceneId: (p = canvas.scene) == null ? void 0 : p.id,
    matchAny: c
  }), d = (u == null ? void 0 : u.length) ?? 0;
  r.textContent = `${d} matching placeable(s)`;
}, "#updateTagPreview"), // ── ID selector helpers ──────────────────────────────────────────────
ld = /* @__PURE__ */ l(function(e) {
  const i = `id:${e}`;
  f(this, Ne).includes(i) || (f(this, Ne).push(i), this.render({ force: !0 }));
}, "#addIdSelector"), cd = /* @__PURE__ */ l(function(e) {
  const i = `id:${e}`, r = f(this, Ne).indexOf(i);
  r >= 0 ? f(this, Ne).splice(r, 1) : f(this, Ne).push(i), this.render({ force: !0 });
}, "#toggleIdSelector"), /**
 * Get the set of document IDs that are currently selected across all selector types.
 * Resolves tag/tags-any/tags-all selectors to find matching document IDs.
 * @returns {Set<string>}
 */
xs = /* @__PURE__ */ l(function() {
  const e = /* @__PURE__ */ new Set();
  for (const i of f(this, Ne)) {
    const r = fl(i);
    if (r.type === "id") {
      e.add(r.value);
      continue;
    }
    const a = co(i);
    if (a != null && a.placeables)
      for (const { doc: o } of a.placeables)
        o != null && o.id && e.add(o.id);
  }
  return e;
}, "#getSelectedIds"), // ── Canvas selection highlights ──────────────────────────────────────
/**
 * Maintain "selected" highlights on canvas tiles that are in the selection list.
 * Clears stale highlights and adds missing ones (skipping the hovered tile).
 */
Ds = /* @__PURE__ */ l(function() {
  var r, a;
  const e = h(this, pe, xs).call(this), i = ((r = canvas.tiles) == null ? void 0 : r.placeables) ?? [];
  for (const o of i) {
    const s = (a = o.document) == null ? void 0 : a.id;
    if (!s) continue;
    const c = e.has(s), u = o === f(this, an), d = rd(o);
    c && !u && !d ? ma(o, { mode: "selected" }) : !c && d && !u && yi(o);
  }
}, "#refreshSelectionHighlights"), // ── Apply / Cancel ──────────────────────────────────────────────────
ud = /* @__PURE__ */ l(function() {
  var i;
  f(this, Ue) && ($i(), L(this, Ue, !1)), Ur();
  const e = [...f(this, Ne)];
  (i = f(this, ar)) == null || i.call(this, e), f(this, Qe) && (f(this, Qe).call(this, e), L(this, Qe, null)), this.close({ force: !0 });
}, "#doApply"), dd = /* @__PURE__ */ l(function() {
  var e;
  f(this, Ue) && ($i(), L(this, Ue, !1)), Ur(), (e = f(this, or)) == null || e.call(this), f(this, Qe) && (f(this, Qe).call(this, null), L(this, Qe, null)), this.close({ force: !0 });
}, "#doCancel"), l(rt, "PlaceablePickerApplication"), Ce(rt, "APP_ID", `${T}-placeable-picker`), Ce(rt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Re(rt, rt, "DEFAULT_OPTIONS"),
  {
    id: rt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((mc = Re(rt, rt, "DEFAULT_OPTIONS")) == null ? void 0 : mc.classes) ?? [], "eidolon-placeable-picker-window", "themed"])
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
)), Ce(rt, "PARTS", {
  content: {
    template: `modules/${T}/templates/placeable-picker.html`
  }
});
let pa = rt;
var pc, on, fn, Vr, fd;
const ft = class ft extends bn(yn) {
  constructor(e = {}) {
    super(e);
    N(this, fn);
    N(this, on, null);
    L(this, on, e.scene ?? canvas.scene ?? null);
  }
  async _prepareContext() {
    var r, a, o;
    const e = f(this, fn, Vr), i = ((a = e == null ? void 0 : e.getSeenStatus) == null ? void 0 : a.call(e, (r = f(this, on)) == null ? void 0 : r.id)) ?? [];
    return {
      sceneName: ((o = f(this, on)) == null ? void 0 : o.name) ?? "No scene",
      users: i.map((s) => ({
        ...s,
        statusLabel: s.seen ? "Seen" : "Not seen",
        statusClass: s.seen ? "cinematic-tracking__status--seen" : "cinematic-tracking__status--unseen"
      })),
      hasAnyTracked: i.some((s) => s.seen)
    };
  }
  _onRender(e, i) {
    super._onRender(e, i), h(this, fn, fd).call(this);
  }
};
on = new WeakMap(), fn = new WeakSet(), Vr = /* @__PURE__ */ l(function() {
  var e, i;
  return (i = (e = game.modules.get(T)) == null ? void 0 : e.api) == null ? void 0 : i.cinematic;
}, "#api"), fd = /* @__PURE__ */ l(function() {
  var i, r;
  const e = this.element;
  e instanceof HTMLElement && (e.querySelectorAll("[data-action='reset-user']").forEach((a) => {
    a.addEventListener("click", async () => {
      var c;
      const o = a.dataset.userId;
      if (!o) return;
      const s = f(this, fn, Vr);
      s != null && s.resetForUser && (await s.resetForUser((c = f(this, on)) == null ? void 0 : c.id, o), this.render({ force: !0 }));
    });
  }), (i = e.querySelector("[data-action='reset-all']")) == null || i.addEventListener("click", async () => {
    var o;
    const a = f(this, fn, Vr);
    a != null && a.resetForAll && (await a.resetForAll((o = f(this, on)) == null ? void 0 : o.id), this.render({ force: !0 }));
  }), (r = e.querySelector("[data-action='refresh']")) == null || r.addEventListener("click", () => {
    this.render({ force: !0 });
  }));
}, "#bindEvents"), l(ft, "CinematicTrackingApplication"), Ce(ft, "APP_ID", `${T}-cinematic-tracking`), Ce(ft, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Re(ft, ft, "DEFAULT_OPTIONS"),
  {
    id: ft.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((pc = Re(ft, ft, "DEFAULT_OPTIONS")) == null ? void 0 : pc.classes) ?? [], "eidolon-cinematic-tracking-window", "themed"])
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
)), Ce(ft, "PARTS", {
  content: {
    template: `modules/${T}/templates/cinematic-tracking.html`
  }
});
let $s = ft;
const ac = [
  { value: "tile-prop", label: "Tile Prop" },
  { value: "light-color", label: "Light Color" },
  { value: "light-state", label: "Light State" },
  { value: "particles-prop", label: "Particles Prop" },
  { value: "camera-pan", label: "Camera Pan" },
  { value: "token-prop", label: "Token Prop" },
  { value: "drawing-prop", label: "Drawing Prop" },
  { value: "sound-prop", label: "Sound Prop" }
], qm = [
  { value: "canvasReady", label: "Canvas Ready" },
  { value: "manual", label: "Manual Only" }
], Ai = 40, Ao = 24, Mo = 50, oc = 50, Je = 60, sc = 40, lc = 20;
var yc, Ve, Q, W, Rn, yt, Ot, bt, Wa, Fe, Xe, Ja, qt, sn, S, gd, hd, _s, md, pd, Ps, yd, Fi, bd, Rs, wd, Hs, vd, Ed, ue, it, qs, te, Bs, js, Us, Vs, Td, zr, zs, Cd, Sd, Ld, Id, Od, Gs, Ws, Ad, Md, Nd, kd, xd;
const gt = class gt extends bn(yn) {
  constructor(e = {}) {
    super(e);
    N(this, S);
    N(this, Ve, null);
    N(this, Q, null);
    N(this, W, null);
    N(this, Rn, /* @__PURE__ */ new Set());
    N(this, yt, !1);
    N(this, Ot, null);
    N(this, bt, null);
    N(this, Wa, 120);
    N(this, Fe, []);
    N(this, Xe, -1);
    N(this, Ja, 50);
    N(this, qt, null);
    N(this, sn, null);
    L(this, Ve, e.scene ?? canvas.scene ?? null), L(this, Q, ni.fromScene(f(this, Ve)));
  }
  // ── Context ───────────────────────────────────────────────────────────
  async _prepareContext() {
    var r;
    const e = h(this, S, md).call(this), i = f(this, W) != null ? h(this, S, Md).call(this, f(this, W)) : null;
    return {
      // Toolbar
      sceneName: ((r = f(this, Ve)) == null ? void 0 : r.name) ?? "No scene",
      dirty: f(this, yt),
      canUndo: f(this, S, Bs),
      canRedo: f(this, S, js),
      // Swimlane
      timeMarkers: e.timeMarkers,
      mainBlocks: e.mainBlocks,
      subLanes: e.subLanes,
      signalArcs: e.signalArcs,
      totalWidthPx: e.totalWidthPx,
      swimlaneHeightPx: e.swimlaneHeightPx,
      insertionPoints: e.insertionPoints,
      // Detail
      detail: i,
      // Footer
      trigger: f(this, Q).trigger,
      tracking: f(this, Q).tracking,
      synchronized: f(this, Q).synchronized,
      triggerOptions: qm.map((a) => ({
        ...a,
        selected: a.value === f(this, Q).trigger
      })),
      entryCount: f(this, Q).timeline.length,
      totalDuration: e.totalDurationMs,
      targetCount: h(this, S, xd).call(this),
      setupCount: Object.keys(f(this, Q).setup ?? {}).length,
      landingCount: Object.keys(f(this, Q).landing ?? {}).length
    };
  }
  // ── Render & Events ───────────────────────────────────────────────────
  _onRender(e, i) {
    super._onRender(e, i), h(this, S, gd).call(this), f(this, qt) || (L(this, qt, (r) => {
      !r.ctrlKey && !r.metaKey || (r.key === "z" && !r.shiftKey ? (r.preventDefault(), h(this, S, Us).call(this)) : (r.key === "z" && r.shiftKey || r.key === "y") && (r.preventDefault(), h(this, S, Vs).call(this)));
    }), document.addEventListener("keydown", f(this, qt)));
  }
  async close(e = {}) {
    if (f(this, bt) && h(this, S, zr).call(this), f(this, yt) && !e.force) {
      const i = await new Promise((r) => {
        new Dialog({
          title: "Unsaved Changes",
          content: "<p>You have unsaved cinematic changes.</p>",
          buttons: {
            save: { label: "Save & Close", icon: '<i class="fas fa-save"></i>', callback: /* @__PURE__ */ l(() => r("save"), "callback") },
            discard: { label: "Discard", icon: '<i class="fas fa-trash"></i>', callback: /* @__PURE__ */ l(() => r("discard"), "callback") },
            cancel: { label: "Cancel", icon: '<i class="fas fa-times"></i>', callback: /* @__PURE__ */ l(() => r("cancel"), "callback") }
          },
          default: "cancel",
          close: /* @__PURE__ */ l(() => r("cancel"), "close")
        }).render(!0);
      });
      if (i === "cancel") return;
      i === "save" && await h(this, S, zs).call(this);
    }
    return super.close(e);
  }
  async _onClose(e) {
    return f(this, Ot) !== null && (clearTimeout(f(this, Ot)), L(this, Ot, null)), f(this, qt) && (document.removeEventListener("keydown", f(this, qt)), L(this, qt, null)), super._onClose(e);
  }
};
Ve = new WeakMap(), Q = new WeakMap(), W = new WeakMap(), Rn = new WeakMap(), yt = new WeakMap(), Ot = new WeakMap(), bt = new WeakMap(), Wa = new WeakMap(), Fe = new WeakMap(), Xe = new WeakMap(), Ja = new WeakMap(), qt = new WeakMap(), sn = new WeakMap(), S = new WeakSet(), // ── Event binding ─────────────────────────────────────────────────────
gd = /* @__PURE__ */ l(function() {
  var r, a, o, s, c, u, d, g, p, b, y, m, v, E, C, M, D, F, P, H, ne, ie, V, K, _, z, G, X, U;
  const e = this.element;
  if (!(e instanceof HTMLElement)) return;
  e.querySelectorAll("[data-action='select-block']").forEach((I) => {
    I.addEventListener("click", (O) => {
      if (O.target.closest("button")) return;
      const A = I.dataset.entryPath;
      L(this, W, f(this, W) === A ? null : A), this.render({ force: !0 });
    });
  });
  let i = null;
  e.querySelectorAll(".cinematic-editor__lane--main [data-action='select-block']").forEach((I) => {
    const O = I.dataset.entryPath;
    O === "setup" || O === "landing" || (I.addEventListener("dragstart", (A) => {
      i = O, I.classList.add("dragging"), A.dataTransfer.effectAllowed = "move";
    }), I.addEventListener("dragover", (A) => {
      A.preventDefault(), A.dataTransfer.dropEffect = "move";
    }), I.addEventListener("dragenter", (A) => {
      A.preventDefault(), I.classList.add("cinematic-editor__block--drag-over");
    }), I.addEventListener("dragleave", () => {
      I.classList.remove("cinematic-editor__block--drag-over");
    }), I.addEventListener("drop", (A) => {
      A.preventDefault(), I.classList.remove("cinematic-editor__block--drag-over");
      const x = I.dataset.entryPath;
      if (i && i !== x) {
        const q = h(this, S, qs).call(this, i), ce = h(this, S, qs).call(this, x);
        q != null && ce != null && (f(this, W) === i && L(this, W, x), h(this, S, te).call(this, (se) => se.moveEntry(q, ce)));
      }
      i = null;
    }), I.addEventListener("dragend", () => {
      I.classList.remove("dragging"), i = null;
    }));
  }), (r = e.querySelector("[data-action='save']")) == null || r.addEventListener("click", () => h(this, S, zs).call(this)), (a = e.querySelector("[data-action='play-preview']")) == null || a.addEventListener("click", () => h(this, S, Cd).call(this)), (o = e.querySelector("[data-action='reset-tracking']")) == null || o.addEventListener("click", () => h(this, S, Sd).call(this)), (s = e.querySelector("[data-action='export-json']")) == null || s.addEventListener("click", () => h(this, S, Ld).call(this)), (c = e.querySelector("[data-action='undo']")) == null || c.addEventListener("click", () => h(this, S, Us).call(this)), (u = e.querySelector("[data-action='redo']")) == null || u.addEventListener("click", () => h(this, S, Vs).call(this)), (d = e.querySelector("[data-action='validate']")) == null || d.addEventListener("click", () => h(this, S, Id).call(this)), (g = e.querySelector("[data-action='import-json']")) == null || g.addEventListener("click", () => h(this, S, Od).call(this)), (p = e.querySelector("[data-action='open-tracking']")) == null || p.addEventListener("click", () => {
    new $s({ scene: f(this, Ve) }).render(!0);
  }), (b = e.querySelector("[data-action='change-trigger']")) == null || b.addEventListener("change", (I) => {
    h(this, S, te).call(this, (O) => O.setTrigger(I.target.value));
  }), (y = e.querySelector("[data-action='change-tracking']")) == null || y.addEventListener("change", (I) => {
    h(this, S, te).call(this, (O) => O.setTracking(I.target.checked));
  }), (m = e.querySelector("[data-action='change-synchronized']")) == null || m.addEventListener("change", (I) => {
    h(this, S, te).call(this, (O) => O.setSynchronized(I.target.checked));
  }), (v = e.querySelector("[data-action='delete-entry']")) == null || v.addEventListener("click", () => {
    const I = h(this, S, ue).call(this, f(this, W));
    I && (I.type === "timeline" ? (h(this, S, te).call(this, (O) => O.removeEntry(I.index)), L(this, W, null)) : I.type === "branch" && (h(this, S, te).call(this, (O) => O.removeBranchEntry(I.index, I.branchIndex, I.branchEntryIndex)), L(this, W, null)));
  }), (E = e.querySelector("[data-action='add-tween']")) == null || E.addEventListener("click", () => {
    const I = h(this, S, ue).call(this, f(this, W));
    if (I) {
      if (I.type === "timeline")
        h(this, S, te).call(this, (O) => O.addTween(I.index));
      else if (I.type === "branch") {
        const O = h(this, S, it).call(this, f(this, W));
        if (!O) return;
        const A = { type: "tile-prop", target: "", attribute: "alpha", value: 1, duration: 1e3 }, x = [...O.tweens ?? [], A];
        h(this, S, te).call(this, (q) => q.updateBranchEntry(I.index, I.branchIndex, I.branchEntryIndex, { tweens: x }));
      }
    }
  }), (C = e.querySelector("[data-action='change-delay']")) == null || C.addEventListener("change", (I) => {
    const O = h(this, S, ue).call(this, f(this, W));
    if (!O) return;
    const A = Number(I.target.value) || 0;
    O.type === "timeline" ? h(this, S, te).call(this, (x) => x.updateEntry(O.index, { delay: A })) : O.type === "branch" && h(this, S, te).call(this, (x) => x.updateBranchEntry(O.index, O.branchIndex, O.branchEntryIndex, { delay: A }));
  }), e.querySelectorAll("[data-action='toggle-tween-card']").forEach((I) => {
    I.addEventListener("click", (O) => {
      if (O.target.closest("[data-action='delete-tween']")) return;
      const A = Number(I.dataset.tweenIndex), x = `${f(this, W)}.tweens.${A}`;
      f(this, Rn).has(x) ? f(this, Rn).delete(x) : f(this, Rn).add(x), this.render({ force: !0 });
    });
  }), e.querySelectorAll("[data-action='pick-target']").forEach((I) => {
    I.addEventListener("click", async () => {
      var fe, ye;
      const O = Number(I.dataset.tweenIndex), A = h(this, S, ue).call(this, f(this, W));
      if (!A || Number.isNaN(O)) return;
      const x = h(this, S, it).call(this, f(this, W)), q = ((ye = (fe = x == null ? void 0 : x.tweens) == null ? void 0 : fe[O]) == null ? void 0 : ye.target) ?? "", ce = q ? [q] : [], se = await pa.open({ selections: ce });
      if (se && se.length > 0) {
        if (A.type === "timeline")
          h(this, S, te).call(this, (we) => we.updateTween(A.index, O, { target: se[0] }));
        else if (A.type === "branch") {
          const we = (x.tweens ?? []).map((Pe, ke) => ke === O ? { ...Pe, target: se[0] } : Pe);
          h(this, S, te).call(this, (Pe) => Pe.updateBranchEntry(A.index, A.branchIndex, A.branchEntryIndex, { tweens: we }));
        }
      }
    });
  }), e.querySelectorAll("[data-action='delete-tween']").forEach((I) => {
    I.addEventListener("click", () => {
      const O = Number(I.dataset.tweenIndex), A = h(this, S, ue).call(this, f(this, W));
      if (!(!A || Number.isNaN(O))) {
        if (A.type === "timeline")
          h(this, S, te).call(this, (x) => x.removeTween(A.index, O));
        else if (A.type === "branch") {
          const x = h(this, S, it).call(this, f(this, W));
          if (!x) return;
          const q = (x.tweens ?? []).filter((ce, se) => se !== O);
          h(this, S, te).call(this, (ce) => ce.updateBranchEntry(A.index, A.branchIndex, A.branchEntryIndex, { tweens: q }));
        }
      }
    });
  }), e.querySelectorAll(".cinematic-editor__tween-card-body").forEach((I) => {
    const O = Number(I.dataset.tweenIndex);
    I.querySelectorAll("[data-field]").forEach((A) => {
      const x = A.dataset.field, q = A.tagName === "SELECT" || A.type === "checkbox" ? "change" : "input";
      A.addEventListener(q, () => {
        let ce;
        A.type === "checkbox" ? ce = A.checked : x === "duration" ? ce = Number(A.value) || 0 : x === "value" && !Number.isNaN(Number(A.value)) && A.value.trim() !== "" ? ce = Number(A.value) : ce = A.value, h(this, S, Td).call(this, O, { [x]: ce });
      });
    });
  }), (M = e.querySelector("[data-action='edit-setup']")) == null || M.addEventListener("click", () => h(this, S, Gs).call(this, "setup")), (D = e.querySelector("[data-action='edit-landing']")) == null || D.addEventListener("click", () => h(this, S, Gs).call(this, "landing")), (F = e.querySelector("[data-action='edit-before']")) == null || F.addEventListener("click", () => h(this, S, Ws).call(this, "before")), (P = e.querySelector("[data-action='edit-after']")) == null || P.addEventListener("click", () => h(this, S, Ws).call(this, "after")), (H = e.querySelector("[data-action='change-await-event']")) == null || H.addEventListener("change", (I) => {
    const O = h(this, S, ue).call(this, f(this, W));
    if (!O) return;
    const A = h(this, S, it).call(this, f(this, W));
    A != null && A.await && O.type === "timeline" && h(this, S, te).call(this, (x) => x.updateEntry(O.index, { await: { ...A.await, event: I.target.value } }));
  }), (ne = e.querySelector("[data-action='change-await-signal']")) == null || ne.addEventListener("change", (I) => {
    const O = h(this, S, ue).call(this, f(this, W));
    if (!O) return;
    const A = h(this, S, it).call(this, f(this, W));
    A != null && A.await && O.type === "timeline" && h(this, S, te).call(this, (x) => x.updateEntry(O.index, { await: { ...A.await, signal: I.target.value } }));
  }), (ie = e.querySelector("[data-action='change-await-target']")) == null || ie.addEventListener("change", (I) => {
    const O = h(this, S, ue).call(this, f(this, W));
    if (!O) return;
    const A = h(this, S, it).call(this, f(this, W));
    A != null && A.await && O.type === "timeline" && h(this, S, te).call(this, (x) => x.updateEntry(O.index, { await: { ...A.await, target: I.target.value } }));
  }), (V = e.querySelector("[data-action='pick-await-target']")) == null || V.addEventListener("click", async () => {
    const I = h(this, S, ue).call(this, f(this, W));
    if (!I) return;
    const O = h(this, S, it).call(this, f(this, W));
    if (!(O != null && O.await)) return;
    const { enterPickMode: A } = await Promise.resolve().then(() => Hm);
    A({
      placeableType: "Tile",
      onPick: /* @__PURE__ */ l((x) => {
        var se, fe;
        const q = (fe = (se = x.flags) == null ? void 0 : se.tagger) == null ? void 0 : fe.tags, ce = q != null && q.length ? `tag:${q[0]}` : `id:${x.id}`;
        I.type === "timeline" && h(this, S, te).call(this, (ye) => ye.updateEntry(I.index, { await: { ...O.await, target: ce } }));
      }, "onPick")
    });
  });
  for (const [I, O] of [["change-anim-idle", "idle"], ["change-anim-hover", "hover"], ["change-anim-dim", "dim"]])
    (K = e.querySelector(`[data-action='${I}']`)) == null || K.addEventListener("change", (A) => {
      const x = h(this, S, ue).call(this, f(this, W));
      if (!x) return;
      const q = h(this, S, it).call(this, f(this, W));
      if (!(q != null && q.await)) return;
      const ce = A.target.value.trim(), se = ce ? ce.split(",").map((we) => we.trim()).filter(Boolean) : void 0, fe = { ...q.await.animation ?? {} };
      se != null && se.length ? fe[O] = se.length === 1 ? se[0] : se : delete fe[O];
      const ye = { ...q.await, animation: Object.keys(fe).length ? fe : void 0 };
      ye.animation || delete ye.animation, x.type === "timeline" && h(this, S, te).call(this, (we) => we.updateEntry(x.index, { await: ye }));
    });
  (_ = e.querySelector("[data-action='change-emit-signal']")) == null || _.addEventListener("change", (I) => {
    const O = h(this, S, ue).call(this, f(this, W));
    O && O.type === "timeline" && h(this, S, te).call(this, (A) => A.updateEntry(O.index, { emit: I.target.value }));
  }), (z = e.querySelector("[data-action='change-parallel-join']")) == null || z.addEventListener("change", (I) => {
    const O = h(this, S, ue).call(this, f(this, W));
    if (!O || O.type !== "timeline") return;
    const A = f(this, Q).timeline[O.index];
    A != null && A.parallel && h(this, S, te).call(this, (x) => x.updateEntry(O.index, { parallel: { ...A.parallel, join: I.target.value } }));
  }), (G = e.querySelector("[data-action='change-parallel-overflow']")) == null || G.addEventListener("change", (I) => {
    const O = h(this, S, ue).call(this, f(this, W));
    if (!O || O.type !== "timeline") return;
    const A = f(this, Q).timeline[O.index];
    A != null && A.parallel && h(this, S, te).call(this, (x) => x.updateEntry(O.index, { parallel: { ...A.parallel, overflow: I.target.value } }));
  }), (X = e.querySelector("[data-action='edit-parallel-json']")) == null || X.addEventListener("click", () => h(this, S, Ad).call(this)), (U = e.querySelector("[data-action='add-branch']")) == null || U.addEventListener("click", () => {
    const I = h(this, S, ue).call(this, f(this, W));
    !I || I.type !== "timeline" || h(this, S, te).call(this, (O) => O.addBranch(I.index));
  }), e.querySelectorAll("[data-action='remove-branch']").forEach((I) => {
    I.addEventListener("click", () => {
      const O = Number(I.dataset.branchIndex), A = h(this, S, ue).call(this, f(this, W));
      !A || A.type !== "timeline" || Number.isNaN(O) || h(this, S, te).call(this, (x) => x.removeBranch(A.index, O));
    });
  }), e.querySelectorAll("[data-action='add-branch-step']").forEach((I) => {
    I.addEventListener("click", () => {
      const O = Number(I.dataset.branchIndex), A = h(this, S, ue).call(this, f(this, W));
      !A || A.type !== "timeline" || Number.isNaN(O) || h(this, S, te).call(this, (x) => x.addBranchEntry(A.index, O, { tweens: [] }));
    });
  }), e.querySelectorAll("[data-action='add-branch-delay']").forEach((I) => {
    I.addEventListener("click", () => {
      const O = Number(I.dataset.branchIndex), A = h(this, S, ue).call(this, f(this, W));
      !A || A.type !== "timeline" || Number.isNaN(O) || h(this, S, te).call(this, (x) => x.addBranchEntry(A.index, O, { delay: 1e3 }));
    });
  }), e.querySelectorAll("[data-action='remove-branch-entry']").forEach((I) => {
    I.addEventListener("click", () => {
      const O = Number(I.dataset.branchIndex), A = Number(I.dataset.branchEntryIndex), x = h(this, S, ue).call(this, f(this, W));
      !x || x.type !== "timeline" || Number.isNaN(O) || Number.isNaN(A) || h(this, S, te).call(this, (q) => q.removeBranchEntry(x.index, O, A));
    });
  }), e.querySelectorAll("[data-action='show-insert-menu']").forEach((I) => {
    I.addEventListener("click", (O) => {
      O.stopPropagation();
      const A = Number(I.dataset.insertIndex), x = I.dataset.lane;
      h(this, S, hd).call(this, I, A, x);
    });
  }), e.querySelectorAll("[data-action='insert-entry']").forEach((I) => {
    I.addEventListener("click", () => {
      if (!f(this, sn)) return;
      const O = I.dataset.insertType, { insertIndex: A } = f(this, sn);
      switch (O) {
        case "step":
          h(this, S, te).call(this, (x) => x.addStep(A));
          break;
        case "delay":
          h(this, S, te).call(this, (x) => x.addDelay(A));
          break;
        case "await":
          h(this, S, te).call(this, (x) => x.addAwait(A));
          break;
        case "emit":
          h(this, S, te).call(this, (x) => x.addEmit(A));
          break;
        case "parallel":
          h(this, S, te).call(this, (x) => x.addParallel(A));
          break;
      }
      h(this, S, _s).call(this);
    });
  }), e.addEventListener("click", (I) => {
    f(this, sn) && !I.target.closest(".cinematic-editor__insert-menu") && !I.target.closest("[data-action='show-insert-menu']") && h(this, S, _s).call(this);
  });
}, "#bindEvents"), // ── Insert menu ───────────────────────────────────────────────────────
hd = /* @__PURE__ */ l(function(e, i, r) {
  var u, d;
  const a = (u = this.element) == null ? void 0 : u.querySelector(".cinematic-editor__insert-menu");
  if (!a) return;
  const o = (d = this.element) == null ? void 0 : d.querySelector(".cinematic-editor__swimlane");
  if (!o) return;
  const s = e.getBoundingClientRect(), c = o.getBoundingClientRect();
  a.style.display = "", a.style.left = `${s.left - c.left}px`, a.style.top = `${s.bottom - c.top + 4}px`, L(this, sn, { insertIndex: i, lane: r });
}, "#showInsertMenu"), _s = /* @__PURE__ */ l(function() {
  var i;
  const e = (i = this.element) == null ? void 0 : i.querySelector(".cinematic-editor__insert-menu");
  e && (e.style.display = "none"), L(this, sn, null);
}, "#hideInsertMenu"), // ── Lane computation ──────────────────────────────────────────────────
md = /* @__PURE__ */ l(function() {
  const e = f(this, Q).timeline, i = h(this, S, pd).call(this), r = [], a = [], o = { emits: [], awaits: [] };
  r.push({
    type: "setup",
    leftPx: 0,
    widthPx: Mo,
    label: "Setup",
    entryPath: "setup",
    selected: f(this, W) === "setup"
  });
  let s = Mo;
  for (let y = 0; y < e.length; y++) {
    const m = e[y], v = `timeline.${y}`, E = f(this, W) === v;
    if (m.delay != null) {
      const C = Math.max(lc, m.delay * i);
      r.push({
        type: "delay",
        leftPx: s,
        widthPx: C,
        label: `${m.delay}ms`,
        entryPath: v,
        selected: E
      }), s += C;
    } else if (m.await != null) {
      const M = (m.await.event ?? "click") === "tile-click" ? "Tile Click" : "Await";
      r.push({
        type: "await",
        leftPx: s,
        widthPx: Je,
        label: M,
        entryPath: v,
        selected: E
      }), m.await.event === "signal" && o.awaits.push({
        signal: m.await.signal,
        centerPx: s + Je / 2,
        laneIndex: 0
      }), s += Je;
    } else if (m.emit != null)
      r.push({
        type: "emit",
        leftPx: s,
        widthPx: Je,
        label: "Emit",
        entryPath: v,
        selected: E
      }), o.emits.push({
        signal: m.emit,
        centerPx: s + Je / 2,
        laneIndex: 0
      }), s += Je;
    else if (m.parallel != null) {
      const C = m.parallel.branches ?? [], M = s, D = [];
      let F = 0;
      for (let H = 0; H < C.length; H++) {
        const ne = `timeline.${y}.parallel.branches.${H}`, { blocks: ie, width: V, emits: K, awaits: _ } = h(this, S, bd).call(this, C[H], M, i, ne);
        D.push({ label: `Br ${H + 1}`, blocks: ie }), F = Math.max(F, V);
        const z = a.length * 10 + H + 1;
        for (const G of K) o.emits.push({ ...G, laneIndex: z });
        for (const G of _) o.awaits.push({ ...G, laneIndex: z });
      }
      const P = Math.max(Je, F);
      r.push({
        type: "parallel",
        leftPx: M,
        widthPx: P,
        label: `${C.length} br`,
        entryPath: v,
        selected: E
      }), a.push({ parallelEntryIndex: y, startPx: M, lanes: D }), s += P;
    } else {
      const { stepDuration: C, detachOverflow: M } = h(this, S, Fi).call(this, m), D = Math.max(sc, C * i), F = M > 0 ? Math.max(4, M * i) : 0, P = h(this, S, Rs).call(this, m);
      r.push({
        type: "step",
        leftPx: s,
        widthPx: D,
        detachTailPx: F,
        label: P,
        entryPath: v,
        selected: E
      }), s += D;
    }
  }
  r.push({
    type: "landing",
    leftPx: s,
    widthPx: oc,
    label: "Landing",
    entryPath: "landing",
    selected: f(this, W) === "landing"
  }), s += oc;
  const c = a.flatMap((y) => y.lanes), u = h(this, S, wd).call(this, o, c.length), d = h(this, S, Ps).call(this), g = h(this, S, vd).call(this, d, i), p = h(this, S, Ed).call(this, r), b = Ao + (1 + c.length) * Ai;
  return {
    mainBlocks: r,
    subLanes: c,
    signalArcs: u,
    timeMarkers: g,
    insertionPoints: p,
    totalWidthPx: Math.max(s, 200),
    swimlaneHeightPx: b,
    totalDurationMs: d
  };
}, "#computeLanes"), pd = /* @__PURE__ */ l(function() {
  var a;
  const e = (((a = this.position) == null ? void 0 : a.width) ?? 1100) - 70 - 100, i = h(this, S, Ps).call(this);
  if (i <= 0) return 0.1;
  const r = e / i;
  return Math.max(0.03, Math.min(0.5, r));
}, "#computeScale"), Ps = /* @__PURE__ */ l(function() {
  return f(this, Q).timeline.reduce((e, i) => i.delay != null ? e + i.delay : i.await != null || i.emit != null ? e + 500 : i.parallel != null ? e + h(this, S, yd).call(this, i) : e + h(this, S, Fi).call(this, i).stepDuration, 0);
}, "#computeTotalDuration"), yd = /* @__PURE__ */ l(function(e) {
  var a;
  const i = ((a = e.parallel) == null ? void 0 : a.branches) ?? [];
  let r = 0;
  for (const o of i) {
    let s = 0;
    for (const c of o)
      c.delay != null ? s += c.delay : c.await != null || c.emit != null ? s += 500 : s += h(this, S, Fi).call(this, c).stepDuration;
    r = Math.max(r, s);
  }
  return Math.max(500, r);
}, "#computeParallelDuration"), Fi = /* @__PURE__ */ l(function(e) {
  const i = e.tweens ?? [];
  if (i.length === 0) return { stepDuration: 500, detachOverflow: 0 };
  let r = 0, a = 0;
  for (const c of i) {
    const u = c.duration ?? 0;
    c.detach ? a = Math.max(a, u) : r = Math.max(r, u);
  }
  const o = Math.max(500, r), s = Math.max(0, a - o);
  return { stepDuration: o, detachOverflow: s };
}, "#computeStepDurations"), bd = /* @__PURE__ */ l(function(e, i, r, a) {
  var d, g;
  const o = [], s = [], c = [];
  let u = i;
  for (let p = 0; p < e.length; p++) {
    const b = e[p], y = `${a}.${p}`, m = f(this, W) === y;
    if (b.delay != null) {
      const v = Math.max(lc, b.delay * r);
      o.push({ type: "delay", leftPx: u, widthPx: v, label: `${b.delay}ms`, entryPath: y, selected: m }), u += v;
    } else if (b.await != null)
      o.push({ type: "await", leftPx: u, widthPx: Je, label: ((d = b.await) == null ? void 0 : d.event) ?? "click", entryPath: y, selected: m }), ((g = b.await) == null ? void 0 : g.event) === "signal" && c.push({ signal: b.await.signal, centerPx: u + Je / 2 }), u += Je;
    else if (b.emit != null)
      o.push({ type: "emit", leftPx: u, widthPx: Je, label: b.emit || "emit", entryPath: y, selected: m }), s.push({ signal: b.emit, centerPx: u + Je / 2 }), u += Je;
    else {
      const { stepDuration: v } = h(this, S, Fi).call(this, b), E = Math.max(sc, v * r), C = h(this, S, Rs).call(this, b);
      o.push({ type: "step", leftPx: u, widthPx: E, label: C, entryPath: y, selected: m }), u += E;
    }
  }
  return { blocks: o, width: u - i, emits: s, awaits: c };
}, "#computeBranchLane"), Rs = /* @__PURE__ */ l(function(e) {
  const i = e.tweens ?? [];
  if (i.length === 0) return "Empty";
  const r = i[0], a = (r.target ?? "").replace(/^tag:/, "#"), o = r.attribute ?? "";
  return r.type === "camera-pan" ? "Pan" : o === "alpha" ? `Fade ${a}` : o === "x" || o === "y" ? `Move ${a}` : r.type === "light-color" ? `Light ${a}` : r.type === "sound-prop" ? `Sound ${a}` : a ? `${a}` : "Step";
}, "#deriveStepLabel"), wd = /* @__PURE__ */ l(function(e, i) {
  const r = [];
  for (const a of e.emits)
    for (const o of e.awaits) {
      if (a.signal !== o.signal) continue;
      const s = a.centerPx, c = h(this, S, Hs).call(this, a.laneIndex) + Ai / 2, u = o.centerPx, d = h(this, S, Hs).call(this, o.laneIndex) + Ai / 2, g = d - c, p = (s + u) / 2, b = c + Math.sign(g || 1) * Math.min(40, Math.abs(g) * 0.5 + 20), y = d - Math.sign(g || 1) * Math.min(40, Math.abs(g) * 0.5 + 20);
      r.push({
        pathD: `M ${s} ${c} C ${p} ${b}, ${p} ${y}, ${u} ${d}`,
        signal: a.signal
      });
    }
  return r;
}, "#computeSignalArcs"), Hs = /* @__PURE__ */ l(function(e) {
  return Ao + e * Ai;
}, "#laneIndexToY"), vd = /* @__PURE__ */ l(function(e, i) {
  const r = [];
  if (e <= 0) return r;
  const a = i * 1e3;
  let o;
  a >= 200 ? o = 500 : a >= 80 ? o = 1e3 : a >= 40 ? o = 2e3 : o = 5e3;
  for (let s = 0; s <= e + o; s += o) {
    const c = s >= 1e3 ? `${(s / 1e3).toFixed(s % 1e3 === 0 ? 0 : 1)}s` : `${s}ms`;
    r.push({ px: Mo + s * i, label: c });
  }
  return r;
}, "#computeTimeMarkers"), Ed = /* @__PURE__ */ l(function(e) {
  const i = [];
  for (let r = 0; r < e.length - 1; r++) {
    const a = e[r], o = e[r + 1], s = a.leftPx + a.widthPx + (o.leftPx - (a.leftPx + a.widthPx)) / 2, c = Ao + Ai / 2;
    let u;
    if (a.entryPath === "setup")
      u = 0;
    else {
      if (a.entryPath === "landing")
        continue;
      if (a.entryPath.startsWith("timeline.")) {
        const g = a.entryPath.split(".");
        u = Number(g[1]) + 1;
      } else
        continue;
    }
    const d = o.entryPath === "landing";
    i.push({ leftPx: s, topPx: c, insertIndex: u, lane: "main", isEnd: d });
  }
  return i;
}, "#computeInsertionPoints"), // ── Path-based addressing ─────────────────────────────────────────────
ue = /* @__PURE__ */ l(function(e) {
  if (!e) return null;
  if (e === "setup") return { type: "setup" };
  if (e === "landing") return { type: "landing" };
  const i = e.split(".");
  if (i[0] === "timeline") {
    const r = Number(i[1]);
    if (i.length === 2) return { type: "timeline", index: r };
    if (i[2] === "parallel" && i[3] === "branches" && i.length >= 6)
      return {
        type: "branch",
        index: r,
        branchIndex: Number(i[4]),
        branchEntryIndex: Number(i[5])
      };
  }
  return null;
}, "#parseEntryPath"), it = /* @__PURE__ */ l(function(e) {
  var r, a, o, s;
  const i = h(this, S, ue).call(this, e);
  return i ? i.type === "setup" ? f(this, Q).setup : i.type === "landing" ? f(this, Q).landing : i.type === "timeline" ? f(this, Q).timeline[i.index] : i.type === "branch" ? (s = (o = (a = (r = f(this, Q).timeline[i.index]) == null ? void 0 : r.parallel) == null ? void 0 : a.branches) == null ? void 0 : o[i.branchIndex]) == null ? void 0 : s[i.branchEntryIndex] : null : null;
}, "#getEntryAtPath"), qs = /* @__PURE__ */ l(function(e) {
  const i = h(this, S, ue).call(this, e);
  return !i || i.type !== "timeline" ? null : i.index;
}, "#getTimelineIndexFromPath"), // ── State mutation ────────────────────────────────────────────────────
te = /* @__PURE__ */ l(function(e) {
  L(this, Fe, f(this, Fe).slice(0, f(this, Xe) + 1)), f(this, Fe).push(f(this, Q)), f(this, Fe).length > f(this, Ja) && f(this, Fe).shift(), L(this, Xe, f(this, Fe).length - 1), L(this, Q, e(f(this, Q))), L(this, yt, !0), this.render({ force: !0 });
}, "#mutate"), Bs = /* @__PURE__ */ l(function() {
  return f(this, Xe) >= 0;
}, "#canUndo"), js = /* @__PURE__ */ l(function() {
  return f(this, Xe) < f(this, Fe).length - 1;
}, "#canRedo"), Us = /* @__PURE__ */ l(function() {
  f(this, S, Bs) && (f(this, Xe) === f(this, Fe).length - 1 && f(this, Fe).push(f(this, Q)), L(this, Q, f(this, Fe)[f(this, Xe)]), go(this, Xe)._--, L(this, yt, !0), this.render({ force: !0 }));
}, "#undo"), Vs = /* @__PURE__ */ l(function() {
  f(this, S, js) && (go(this, Xe)._++, L(this, Q, f(this, Fe)[f(this, Xe) + 1]), L(this, yt, !0), this.render({ force: !0 }));
}, "#redo"), Td = /* @__PURE__ */ l(function(e, i) {
  var r;
  f(this, W) != null && (L(this, bt, {
    ...f(this, bt) ?? {},
    entryPath: f(this, W),
    tweenIndex: e,
    patch: { ...((r = f(this, bt)) == null ? void 0 : r.patch) ?? {}, ...i }
  }), f(this, Ot) !== null && clearTimeout(f(this, Ot)), L(this, Ot, setTimeout(() => {
    L(this, Ot, null), h(this, S, zr).call(this);
  }, f(this, Wa))));
}, "#queueTweenChange"), zr = /* @__PURE__ */ l(function() {
  if (!f(this, bt)) return;
  const { entryPath: e, tweenIndex: i, patch: r } = f(this, bt);
  L(this, bt, null);
  const a = h(this, S, ue).call(this, e);
  if (a) {
    if (a.type === "timeline")
      L(this, Q, f(this, Q).updateTween(a.index, i, r));
    else if (a.type === "branch") {
      const o = h(this, S, it).call(this, e);
      if (o) {
        const s = (o.tweens ?? []).map((c, u) => u === i ? { ...c, ...r } : c);
        L(this, Q, f(this, Q).updateBranchEntry(a.index, a.branchIndex, a.branchEntryIndex, { tweens: s }));
      }
    }
    L(this, yt, !0);
  }
}, "#flushTweenChanges"), zs = /* @__PURE__ */ l(async function() {
  var e, i, r, a, o, s;
  if (f(this, Ve)) {
    if (f(this, bt) && h(this, S, zr).call(this), f(this, Q).isStale(f(this, Ve))) {
      const c = await new Promise((u) => {
        new Dialog({
          title: "External Changes Detected",
          content: "<p>The scene's cinematic data was modified externally. Overwrite with your changes?</p>",
          buttons: {
            overwrite: { label: "Overwrite", icon: '<i class="fas fa-save"></i>', callback: /* @__PURE__ */ l(() => u(!0), "callback") },
            reload: { label: "Reload", icon: '<i class="fas fa-sync"></i>', callback: /* @__PURE__ */ l(() => u("reload"), "callback") },
            cancel: { label: "Cancel", icon: '<i class="fas fa-times"></i>', callback: /* @__PURE__ */ l(() => u(!1), "callback") }
          },
          default: "cancel",
          close: /* @__PURE__ */ l(() => u(!1), "close")
        }).render(!0);
      });
      if (c === "reload") {
        L(this, Q, ni.fromScene(f(this, Ve))), L(this, yt, !1), L(this, Fe, []), L(this, Xe, -1), this.render({ force: !0 }), (i = (e = ui.notifications) == null ? void 0 : e.info) == null || i.call(e, "Cinematic reloaded from scene.");
        return;
      }
      if (!c) return;
    }
    try {
      await f(this, Q).save(f(this, Ve)), L(this, Q, ni.fromScene(f(this, Ve))), L(this, yt, !1), (a = (r = ui.notifications) == null ? void 0 : r.info) == null || a.call(r, "Cinematic saved."), this.render({ force: !0 });
    } catch (c) {
      console.error(`${T} | Cinematic save failed`, c), (s = (o = ui.notifications) == null ? void 0 : o.error) == null || s.call(o, "Failed to save cinematic data.");
    }
  }
}, "#onSave"), Cd = /* @__PURE__ */ l(async function() {
  var i, r, a, o, s;
  const e = (r = (i = game.modules.get(T)) == null ? void 0 : i.api) == null ? void 0 : r.cinematic;
  if (!(e != null && e.play)) {
    (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, "Cinematic API not available.");
    return;
  }
  await e.play((s = f(this, Ve)) == null ? void 0 : s.id);
}, "#onPlay"), Sd = /* @__PURE__ */ l(async function() {
  var i, r, a, o, s;
  const e = (r = (i = game.modules.get(T)) == null ? void 0 : i.api) == null ? void 0 : r.cinematic;
  e != null && e.reset && (await e.reset((a = f(this, Ve)) == null ? void 0 : a.id), (s = (o = ui.notifications) == null ? void 0 : o.info) == null || s.call(o, "Cinematic tracking reset."));
}, "#onResetTracking"), Ld = /* @__PURE__ */ l(async function() {
  var i, r;
  const e = JSON.stringify(f(this, Q).toJSON(), null, 2);
  try {
    await navigator.clipboard.writeText(e), (r = (i = ui.notifications) == null ? void 0 : i.info) == null || r.call(i, "Cinematic JSON copied to clipboard.");
  } catch {
    new Dialog({
      title: "Cinematic JSON",
      content: `<textarea style="width:100%;height:300px;font-family:monospace;font-size:0.8rem">${At(e)}</textarea>`,
      buttons: { ok: { label: "Close" } }
    }).render(!0);
  }
}, "#onExportJSON"), Id = /* @__PURE__ */ l(function() {
  var c, u;
  const e = f(this, Q).toJSON(), { targets: i, unresolved: r } = gl(e), a = Pm(e, i), o = [
    ...r.map((d) => ({ path: "targets", level: "warn", message: `Unresolved target: "${d}"` })),
    ...a
  ];
  if (o.length === 0) {
    (u = (c = ui.notifications) == null ? void 0 : c.info) == null || u.call(c, "Cinematic validation passed — no issues found.");
    return;
  }
  const s = o.map((d) => {
    const g = d.level === "error" ? "fa-circle-xmark" : "fa-triangle-exclamation", p = d.level === "error" ? "#e74c3c" : "#f39c12";
    return `<li style="margin:0.3rem 0"><i class="fa-solid ${g}" style="color:${p};margin-right:0.3rem"></i><strong>${At(d.path)}</strong>: ${At(d.message)}</li>`;
  });
  new Dialog({
    title: "Cinematic Validation",
    content: `<p>${o.length} issue(s) found:</p><ul style="list-style:none;padding:0;max-height:300px;overflow:auto">${s.join("")}</ul>`,
    buttons: { ok: { label: "Close" } }
  }).render(!0);
}, "#onValidate"), Od = /* @__PURE__ */ l(function() {
  new Dialog({
    title: "Import Cinematic JSON",
    content: `
				<p style="font-size:0.82rem;margin-bottom:0.4rem">Paste cinematic JSON data below. This will replace the current editor state.</p>
				<textarea id="cinematic-import-json" style="width:100%;height:250px;font-family:monospace;font-size:0.8rem" placeholder='{"version":2,"trigger":"canvasReady",...}'></textarea>
			`,
    buttons: {
      import: {
        label: "Import",
        icon: '<i class="fas fa-file-import"></i>',
        callback: /* @__PURE__ */ l((e) => {
          var r, a, o, s;
          const i = e.find("#cinematic-import-json").val();
          try {
            const c = JSON.parse(i);
            if (typeof c != "object" || c === null || Array.isArray(c))
              throw new Error("Expected a JSON object");
            if (c.timeline !== void 0 && !Array.isArray(c.timeline))
              throw new Error("'timeline' must be an array");
            h(this, S, te).call(this, () => new ni(c)), (a = (r = ui.notifications) == null ? void 0 : r.info) == null || a.call(r, "Cinematic JSON imported.");
          } catch (c) {
            (s = (o = ui.notifications) == null ? void 0 : o.error) == null || s.call(o, `Import failed: ${c.message}`);
          }
        }, "callback")
      },
      cancel: { label: "Cancel" }
    },
    default: "import"
  }).render(!0);
}, "#onImportJSON"), Gs = /* @__PURE__ */ l(async function(e) {
  const i = e === "setup" ? f(this, Q).setup : f(this, Q).landing, r = JSON.stringify(i ?? {}, null, 2);
  new Dialog({
    title: `Edit ${e.charAt(0).toUpperCase() + e.slice(1)}`,
    content: `
				<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON map of target selector → property overrides:</p>
				<textarea id="cinematic-json-edit" style="width:100%;height:200px;font-family:monospace;font-size:0.8rem">${At(r)}</textarea>
			`,
    buttons: {
      save: {
        label: "Apply",
        callback: /* @__PURE__ */ l((a) => {
          var s, c;
          const o = a.find("#cinematic-json-edit").val();
          try {
            const u = JSON.parse(o);
            e === "setup" ? h(this, S, te).call(this, (d) => d.setSetup(u)) : h(this, S, te).call(this, (d) => d.setLanding(u));
          } catch (u) {
            (c = (s = ui.notifications) == null ? void 0 : s.error) == null || c.call(s, `Invalid JSON: ${u.message}`);
          }
        }, "callback")
      },
      cancel: { label: "Cancel" }
    },
    default: "save"
  }).render(!0);
}, "#onEditJSON"), Ws = /* @__PURE__ */ l(async function(e) {
  const i = h(this, S, it).call(this, f(this, W));
  if (!i || i.delay != null) return;
  const r = i[e] ?? {}, a = JSON.stringify(r, null, 2);
  new Dialog({
    title: `Edit Step ${e.charAt(0).toUpperCase() + e.slice(1)}`,
    content: `
				<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON map of target selector → property overrides:</p>
				<textarea id="cinematic-json-edit" style="width:100%;height:200px;font-family:monospace;font-size:0.8rem">${At(a)}</textarea>
			`,
    buttons: {
      save: {
        label: "Apply",
        callback: /* @__PURE__ */ l((o) => {
          var c, u;
          const s = o.find("#cinematic-json-edit").val();
          try {
            const d = JSON.parse(s), g = h(this, S, ue).call(this, f(this, W));
            (g == null ? void 0 : g.type) === "timeline" ? h(this, S, te).call(this, (p) => p.updateEntry(g.index, { [e]: d })) : (g == null ? void 0 : g.type) === "branch" && h(this, S, te).call(this, (p) => p.updateBranchEntry(g.index, g.branchIndex, g.branchEntryIndex, { [e]: d }));
          } catch (d) {
            (u = (c = ui.notifications) == null ? void 0 : c.error) == null || u.call(c, `Invalid JSON: ${d.message}`);
          }
        }, "callback")
      },
      cancel: { label: "Cancel" }
    },
    default: "save"
  }).render(!0);
}, "#onEditStepState"), Ad = /* @__PURE__ */ l(async function() {
  const e = h(this, S, ue).call(this, f(this, W));
  if (!e || e.type !== "timeline") return;
  const i = f(this, Q).timeline[e.index];
  if (!(i != null && i.parallel)) return;
  const r = JSON.stringify(i.parallel.branches ?? [], null, 2);
  new Dialog({
    title: "Edit Parallel Branches",
    content: `
				<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON array of branch timelines:</p>
				<textarea id="cinematic-json-edit" style="width:100%;height:250px;font-family:monospace;font-size:0.8rem">${At(r)}</textarea>
			`,
    buttons: {
      save: {
        label: "Apply",
        callback: /* @__PURE__ */ l((a) => {
          var s, c;
          const o = a.find("#cinematic-json-edit").val();
          try {
            const u = JSON.parse(o);
            if (!Array.isArray(u)) throw new Error("Expected an array of branches");
            h(this, S, te).call(this, (d) => d.updateEntry(e.index, {
              parallel: { ...i.parallel, branches: u }
            }));
          } catch (u) {
            (c = (s = ui.notifications) == null ? void 0 : s.error) == null || c.call(s, `Invalid JSON: ${u.message}`);
          }
        }, "callback")
      },
      cancel: { label: "Cancel" }
    },
    default: "save"
  }).render(!0);
}, "#onEditParallelJSON"), // ── Detail panel builder ──────────────────────────────────────────────
Md = /* @__PURE__ */ l(function(e) {
  var d, g, p, b, y;
  const i = h(this, S, ue).call(this, e);
  if (!i) return null;
  if (i.type === "setup")
    return {
      isSetup: !0,
      targetCount: Object.keys(f(this, Q).setup ?? {}).length
    };
  if (i.type === "landing")
    return {
      isLanding: !0,
      targetCount: Object.keys(f(this, Q).landing ?? {}).length
    };
  const r = h(this, S, it).call(this, e);
  if (!r) return null;
  if (r.delay != null)
    return { type: "delay", isDelay: !0, delay: r.delay };
  if (r.await != null) {
    const m = ((d = r.await) == null ? void 0 : d.event) ?? "click", v = (g = r.await) == null ? void 0 : g.animation, E = /* @__PURE__ */ l((C) => Array.isArray(C) ? C.join(", ") : C ?? "", "toStr");
    return {
      type: "await",
      isAwait: !0,
      event: m,
      signal: ((p = r.await) == null ? void 0 : p.signal) ?? "",
      target: ((b = r.await) == null ? void 0 : b.target) ?? "",
      eventIsClick: m === "click",
      eventIsKeypress: m === "keypress",
      eventIsSignal: m === "signal",
      eventIsTileClick: m === "tile-click",
      animIdle: E(v == null ? void 0 : v.idle),
      animHover: E(v == null ? void 0 : v.hover),
      animDim: E(v == null ? void 0 : v.dim)
    };
  }
  if (r.emit != null)
    return { type: "emit", isEmit: !0, signal: r.emit };
  if (r.parallel != null && i.type === "timeline") {
    const m = r.parallel, v = m.join ?? "all", E = m.overflow ?? "detach", C = (m.branches ?? []).map((M, D) => ({
      branchIndex: D,
      label: `Branch ${D + 1}`,
      entries: (M ?? []).map((F, P) => {
        var z, G;
        const H = F.delay != null, ne = F.await != null, ie = F.emit != null, V = !H && !ne && !ie;
        let K, _;
        return H ? (K = `${F.delay}ms`, _ = "delay") : ne ? (K = "Await", _ = ((z = F.await) == null ? void 0 : z.event) ?? "click") : ie ? (K = "Emit", _ = F.emit || "(unnamed)") : (K = "Step", _ = `${((G = F.tweens) == null ? void 0 : G.length) ?? 0} tweens`), { branchEntryIndex: P, isDelay: H, isAwait: ne, isEmit: ie, isStep: V, label: K, sub: _ };
      })
    }));
    return {
      type: "parallel",
      isParallel: !0,
      branchCount: ((y = m.branches) == null ? void 0 : y.length) ?? 0,
      join: v,
      overflow: E,
      joinIsAll: v === "all",
      joinIsAny: v === "any",
      overflowIsDetach: E === "detach",
      overflowIsCancel: E === "cancel",
      branches: C
    };
  }
  const a = Wh(), o = (r.tweens ?? []).map((m, v) => {
    const E = `${e}.tweens.${v}`, C = f(this, Rn).has(E), M = ac.find((D) => D.value === (m.type ?? "tile-prop"));
    return {
      tweenIndex: v,
      isExpanded: C,
      type: m.type ?? "tile-prop",
      typeLabel: (M == null ? void 0 : M.label) ?? m.type ?? "Tile Prop",
      target: m.target ?? "",
      attribute: m.attribute ?? "",
      value: m.value ?? "",
      duration: m.duration ?? 0,
      easing: m.easing ?? "",
      detach: m.detach ?? !1,
      typeOptions: ac.map((D) => ({
        ...D,
        selected: D.value === (m.type ?? "tile-prop")
      })),
      easingOptions: [
        { value: "", label: "(default)", selected: !m.easing },
        ...a.map((D) => ({
          value: D,
          label: D,
          selected: m.easing === D
        }))
      ]
    };
  }), s = h(this, S, Nd).call(this, r), c = Object.keys(r.before ?? {}), u = Object.keys(r.after ?? {});
  return {
    type: "step",
    isStep: !0,
    isDelay: !1,
    stepNumber: h(this, S, kd).call(this, e),
    maxDuration: s,
    tweens: o,
    beforeSummary: c.length ? `${c.length} target${c.length !== 1 ? "s" : ""}` : "(none)",
    afterSummary: u.length ? `${u.length} target${u.length !== 1 ? "s" : ""}` : "(none)"
  };
}, "#buildDetail"), // ── Helpers ────────────────────────────────────────────────────────────
Nd = /* @__PURE__ */ l(function(e) {
  var i;
  return (i = e.tweens) != null && i.length ? Math.max(500, ...e.tweens.map((r) => r.duration ?? 0)) : 500;
}, "#maxTweenDuration"), kd = /* @__PURE__ */ l(function(e) {
  var r, a, o;
  const i = h(this, S, ue).call(this, e);
  if (!i) return 0;
  if (i.type === "timeline") {
    let s = 0;
    for (let c = 0; c <= i.index; c++) {
      const u = f(this, Q).timeline[c];
      u && u.delay == null && u.await == null && u.emit == null && u.parallel == null && s++;
    }
    return s;
  }
  if (i.type === "branch") {
    const s = ((o = (a = (r = f(this, Q).timeline[i.index]) == null ? void 0 : r.parallel) == null ? void 0 : a.branches) == null ? void 0 : o[i.branchIndex]) ?? [];
    let c = 0;
    for (let u = 0; u <= i.branchEntryIndex; u++) {
      const d = s[u];
      d && d.delay == null && d.await == null && d.emit == null && c++;
    }
    return c;
  }
  return 0;
}, "#stepNumberForPath"), xd = /* @__PURE__ */ l(function() {
  var r;
  const e = /* @__PURE__ */ new Set(), i = f(this, Q).data;
  if (i.setup) for (const a of Object.keys(i.setup)) e.add(a);
  if (i.landing) for (const a of Object.keys(i.landing)) e.add(a);
  for (const a of i.timeline ?? []) {
    if (a.tweens)
      for (const o of a.tweens)
        o.target && e.add(o.target);
    if (a.before) for (const o of Object.keys(a.before)) e.add(o);
    if (a.after) for (const o of Object.keys(a.after)) e.add(o);
    if ((r = a.parallel) != null && r.branches) {
      for (const o of a.parallel.branches)
        for (const s of o)
          if (s.tweens)
            for (const c of s.tweens)
              c.target && e.add(c.target);
    }
  }
  return e.size;
}, "#countUniqueTargets"), l(gt, "CinematicEditorApplication"), Ce(gt, "APP_ID", `${T}-cinematic-editor`), Ce(gt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Re(gt, gt, "DEFAULT_OPTIONS"),
  {
    id: gt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((yc = Re(gt, gt, "DEFAULT_OPTIONS")) == null ? void 0 : yc.classes) ?? [], "eidolon-cinematic-editor-window", "themed"])
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
)), Ce(gt, "PARTS", {
  content: {
    template: `modules/${T}/templates/cinematic-editor.html`
  }
});
let Fs = gt;
const Dd = /* @__PURE__ */ new Map();
function vi(t, n) {
  Dd.set(t, n);
}
l(vi, "registerBehaviour");
function $d(t) {
  return Dd.get(t);
}
l($d, "getBehaviour");
vi("float", (t, n = {}) => {
  const e = t.mesh;
  if (!e) return { update() {
  }, detach() {
  } };
  const i = n.speed ?? 0.04, r = n.amplitude ?? 3, a = e.position.y;
  let o = 0;
  return {
    update(s) {
      o += s, e.position.y = a + Math.sin(o * i) * r;
    },
    detach() {
      e.position.y = a;
    }
  };
});
vi("pulse", (t, n = {}) => {
  const e = t.mesh;
  if (!e) return { update() {
  }, detach() {
  } };
  const i = n.minAlpha ?? 0.6, r = n.maxAlpha ?? 1, a = n.speed ?? 0.05, o = e.alpha;
  let s = 0;
  return {
    update(c) {
      s += c;
      const u = (Math.sin(s * a) + 1) / 2;
      e.alpha = i + (r - i) * u;
    },
    detach() {
      e.alpha = o;
    }
  };
});
vi("scale", (t, n = {}) => {
  const e = t.mesh;
  if (!e) return { update() {
  }, detach() {
  } };
  const i = n.factor ?? 1.12, r = n.durationFrames ?? 15, a = hr(n.easing ?? "easeOutCubic"), o = e.scale.x, s = e.scale.y, c = o * i, u = s * i;
  let d = 0;
  return {
    update(g) {
      if (d < r) {
        d += g;
        const p = Math.min(d / r, 1), b = a(p);
        e.scale.x = o + (c - o) * b, e.scale.y = s + (u - s) * b;
      }
    },
    detach() {
      e.scale.x = o, e.scale.y = s;
    }
  };
});
vi("glow", (t, n = {}) => {
  var p, b;
  const e = t.mesh;
  if (!((p = e == null ? void 0 : e.texture) != null && p.baseTexture)) return { update() {
  }, detach() {
  } };
  const i = n.color ?? 4513279, r = n.alpha ?? 0.5, a = n.blur ?? 8, o = n.pulseSpeed ?? 0.03, s = PIXI.Sprite.from(e.texture);
  s.anchor.set(e.anchor.x, e.anchor.y), s.width = e.width, s.height = e.height, s.position.copyFrom(e.position), s.angle = e.angle, s.alpha = r, s.tint = i;
  const c = PIXI.BlurFilter ?? ((b = PIXI.filters) == null ? void 0 : b.BlurFilter), u = new c(a);
  s.filters = [u];
  const d = t.children.indexOf(e);
  d > 0 ? t.addChildAt(s, d) : t.addChildAt(s, 0);
  let g = 0;
  return {
    update(y) {
      g += y;
      const m = (Math.sin(g * o) + 1) / 2;
      s.alpha = r * (0.5 + 0.5 * m);
    },
    detach() {
      s.parent && s.parent.removeChild(s), s.destroy({ children: !0 });
    }
  };
});
vi("none", () => ({ update() {
}, detach() {
} }));
const Ar = {
  idle: ["float", "glow"],
  hover: ["scale"],
  dim: ["none"]
};
function Bm(t) {
  if (!t) return { ...Ar };
  const n = /* @__PURE__ */ l((e, i) => e === void 0 ? i : typeof e == "string" ? [e] : Array.isArray(e) ? e : i, "normalize");
  return {
    idle: n(t.idle, Ar.idle),
    hover: n(t.hover, Ar.hover),
    dim: n(t.dim, Ar.dim)
  };
}
l(Bm, "normalizeConfig");
var sr, gi, hi, Hn, ln, pn, Js, Ks;
const vl = class vl {
  /**
   * @param {PlaceableObject} placeable
   * @param {object|undefined} animationConfig  Raw animation config from the await entry
   */
  constructor(n, e) {
    N(this, pn);
    N(this, sr);
    N(this, gi);
    N(this, hi, null);
    N(this, Hn, []);
    N(this, ln, null);
    L(this, sr, n), L(this, gi, Bm(e));
  }
  /** Current animation state name. */
  get state() {
    return f(this, hi);
  }
  /**
   * Start animating in the given state.
   * @param {string} [state="idle"]
   */
  start(n = "idle") {
    h(this, pn, Js).call(this, n), L(this, ln, (e) => {
      for (const i of f(this, Hn)) i.update(e);
    }), canvas.app.ticker.add(f(this, ln));
  }
  /**
   * Transition to a new state. Detaches current behaviours, attaches new ones.
   * No-op if already in the requested state.
   * @param {string} state
   */
  setState(n) {
    n !== f(this, hi) && (h(this, pn, Ks).call(this), h(this, pn, Js).call(this, n));
  }
  /**
   * Full cleanup — detach all behaviours and remove ticker.
   */
  detach() {
    var n, e;
    h(this, pn, Ks).call(this), f(this, ln) && ((e = (n = canvas.app) == null ? void 0 : n.ticker) == null || e.remove(f(this, ln)), L(this, ln, null));
  }
};
sr = new WeakMap(), gi = new WeakMap(), hi = new WeakMap(), Hn = new WeakMap(), ln = new WeakMap(), pn = new WeakSet(), // ── Private ──────────────────────────────────────────────────────────
Js = /* @__PURE__ */ l(function(n) {
  L(this, hi, n);
  const e = f(this, gi)[n] ?? f(this, gi).idle ?? ["none"];
  for (const i of e) {
    const r = $d(i);
    if (!r) {
      console.warn(`TileAnimator: unknown behaviour "${i}"`);
      continue;
    }
    f(this, Hn).push(r(f(this, sr)));
  }
}, "#attachBehaviours"), Ks = /* @__PURE__ */ l(function() {
  for (const n of f(this, Hn)) n.detach();
  L(this, Hn, []);
}, "#detachBehaviours"), l(vl, "TileAnimator");
let ya = vl;
const jm = "cinematic", cc = 2;
let Ee = null, In = null, On = null, Mi = 0;
function hl(t) {
  return `cinematic-progress-${t}`;
}
l(hl, "progressFlagKey");
let Gr = 0;
function Um(t, n) {
  Gr++, !(Gr < 3) && (Gr = 0, game.user.setFlag(T, hl(t), {
    step: n,
    timestamp: Date.now()
  }).catch(() => {
  }));
}
l(Um, "saveProgress");
function Wr(t) {
  Gr = 0, game.user.unsetFlag(T, hl(t)).catch(() => {
  });
}
l(Wr, "clearProgress");
function Fd(t, n = 3e5) {
  const e = game.user.getFlag(T, hl(t));
  return !e || typeof e.step != "number" || typeof e.timestamp != "number" || Date.now() - e.timestamp > n ? null : e;
}
l(Fd, "getSavedProgress");
function Vm(t, n) {
  var e;
  return t == null ? null : typeof t != "object" || Array.isArray(t) ? (console.warn(`[${T}] Cinematic: invalid flag data on scene ${n} (expected object, got ${Array.isArray(t) ? "array" : typeof t}). Ignoring.`), null) : t.version !== void 0 && typeof t.version != "number" ? (console.warn(`[${T}] Cinematic: invalid 'version' on scene ${n} (expected number). Ignoring.`), null) : t.trigger !== void 0 && typeof t.trigger != "string" ? (console.warn(`[${T}] Cinematic: invalid 'trigger' on scene ${n} (expected string). Ignoring.`), null) : t.tracking !== void 0 && typeof t.tracking != "boolean" ? (console.warn(`[${T}] Cinematic: invalid 'tracking' on scene ${n} (expected boolean). Ignoring.`), null) : t.synchronized !== void 0 && typeof t.synchronized != "boolean" ? (console.warn(`[${T}] Cinematic: invalid 'synchronized' on scene ${n} (expected boolean). Ignoring.`), null) : t.setup !== void 0 && (typeof t.setup != "object" || t.setup === null || Array.isArray(t.setup)) ? (console.warn(`[${T}] Cinematic: invalid 'setup' on scene ${n} (expected object). Ignoring.`), null) : t.landing !== void 0 && (typeof t.landing != "object" || t.landing === null || Array.isArray(t.landing)) ? (console.warn(`[${T}] Cinematic: invalid 'landing' on scene ${n} (expected object). Ignoring.`), null) : t.timeline !== void 0 && !Array.isArray(t.timeline) ? (console.warn(`[${T}] Cinematic: invalid 'timeline' on scene ${n} (expected array). Ignoring.`), null) : ((e = t.timeline) != null && e.length && (t.timeline = t.timeline.filter((i, r) => !i || typeof i != "object" || Array.isArray(i) ? (console.warn(`[${T}] Cinematic: timeline[${r}] on scene ${n} is not a valid object, removing.`), !1) : i.delay != null && typeof i.delay != "number" ? (console.warn(`[${T}] Cinematic: timeline[${r}].delay on scene ${n} is not a number, removing entry.`), !1) : i.await != null && (typeof i.await != "object" || i.await === null) ? (console.warn(`[${T}] Cinematic: timeline[${r}].await on scene ${n} is not an object, removing entry.`), !1) : i.emit != null && typeof i.emit != "string" ? (console.warn(`[${T}] Cinematic: timeline[${r}].emit on scene ${n} is not a string, removing entry.`), !1) : i.parallel != null && (!i.parallel.branches || !Array.isArray(i.parallel.branches)) ? (console.warn(`[${T}] Cinematic: timeline[${r}].parallel.branches on scene ${n} is not an array, removing entry.`), !1) : i.tweens != null && !Array.isArray(i.tweens) ? (console.warn(`[${T}] Cinematic: timeline[${r}].tweens on scene ${n} is not an array, removing entry.`), !1) : !0)), t);
}
l(Vm, "validateCinematicData");
function Bi(t) {
  const n = t ? game.scenes.get(t) : canvas.scene, e = (n == null ? void 0 : n.getFlag(T, jm)) ?? null;
  return Vm(e, (n == null ? void 0 : n.id) ?? t ?? "unknown");
}
l(Bi, "getCinematicData");
function Ei(t) {
  return `cinematic-seen-${t}`;
}
l(Ei, "seenFlagKey");
function zm(t) {
  return !!game.user.getFlag(T, Ei(t));
}
l(zm, "hasSeenCinematic");
function Gm() {
  return game.ready ? Promise.resolve() : new Promise((t) => Hooks.once("ready", t));
}
l(Gm, "waitForReady");
async function Wm(t = 1e4) {
  var e, i;
  const n = (i = (e = game.modules.get(T)) == null ? void 0 : e.api) == null ? void 0 : i.tween;
  return n != null && n.Timeline ? n.Timeline : new Promise((r) => {
    const a = Date.now(), o = setTimeout(() => {
      var c, u;
      (u = (c = ui.notifications) == null ? void 0 : c.info) == null || u.call(c, `[${T}] Cinematic: waiting for tween engine...`);
    }, 2e3), s = setInterval(() => {
      var u, d, g, p;
      const c = (d = (u = game.modules.get(T)) == null ? void 0 : u.api) == null ? void 0 : d.tween;
      c != null && c.Timeline ? (clearInterval(s), clearTimeout(o), r(c.Timeline)) : Date.now() - a > t && (clearInterval(s), clearTimeout(o), console.warn(`[${T}] Cinematic: tween API not available after ${t}ms.`), (p = (g = ui.notifications) == null ? void 0 : g.warn) == null || p.call(g, `[${T}] Cinematic: tween engine unavailable — cinematic cannot play.`), r(null));
    }, 200);
  });
}
l(Wm, "waitForTweenAPI");
async function _d(t = 5e3) {
  var n;
  return window.Tagger ?? ((n = game.modules.get("tagger")) == null ? void 0 : n.api) ? !0 : new Promise((e) => {
    const i = Date.now(), r = setInterval(() => {
      var a;
      window.Tagger ?? ((a = game.modules.get("tagger")) == null ? void 0 : a.api) ? (clearInterval(r), e(!0)) : Date.now() - i > t && (clearInterval(r), console.warn(`[${T}] Cinematic: Tagger API not available after ${t}ms.`), e(!1));
    }, 200);
  });
}
l(_d, "waitForTagger");
async function ba(t) {
  var g, p, b;
  const n = t ?? ((g = canvas.scene) == null ? void 0 : g.id);
  if (!n) return;
  (Ee == null ? void 0 : Ee.status) === "running" && Ee.cancel("replaced"), Ee = null;
  const e = Bi(n);
  if (!e) {
    console.warn(`[${T}] Cinematic: no cinematic data on scene ${n}.`);
    return;
  }
  const i = await Wm();
  if (!i || ((p = canvas.scene) == null ? void 0 : p.id) !== n || (await _d(), ((b = canvas.scene) == null ? void 0 : b.id) !== n)) return;
  const { targets: r, unresolved: a } = gl(e);
  if (console.log(`[${T}] Cinematic: resolved ${r.size} targets:`, [...r.entries()].map(([y, m]) => {
    var v, E;
    return `${y} → ${((v = m == null ? void 0 : m.document) == null ? void 0 : v.uuid) ?? ((E = m == null ? void 0 : m.constructor) == null ? void 0 : E.name) ?? "?"}`;
  })), a.length && console.warn(`[${T}] Cinematic: skipping ${a.length} unresolved: ${a.join(", ")}`), r.size === 0) {
    console.warn(`[${T}] Cinematic: no targets could be resolved on scene ${n}.`);
    return;
  }
  const o = km(e);
  In = Nm(o, r), On = r;
  const s = Fd(n), c = s ? s.step : void 0;
  c != null && console.log(`[${T}] Cinematic: resuming from step ${c} (saved ${Date.now() - s.timestamp}ms ago)`);
  const u = _m(e, r, i, {
    skipToStep: c,
    onStepComplete: /* @__PURE__ */ l((y) => Um(n, y), "onStepComplete")
  });
  console.log(`[${T}] Cinematic: timeline built, JSON:`, JSON.stringify(u.toJSON())), u.onComplete(async () => {
    if (Ee = null, In = null, On = null, Wr(n), e.landing)
      try {
        st(e.landing, r), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
      } catch (y) {
        console.error(`[${T}] Cinematic: error applying landing state on complete for scene ${n}:`, y);
      }
    e.tracking !== !1 && await game.user.setFlag(T, Ei(n), !0), console.log(`[${T}] Cinematic complete on scene ${n}.`);
  }), u.onCancel(() => {
    if (Ee = null, In = null, On = null, Wr(n), console.log(`[${T}] Cinematic cancelled on scene ${n}.`), e.landing)
      try {
        st(e.landing, r), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
      } catch (y) {
        console.error(`[${T}] Cinematic: error applying landing state after cancel on scene ${n}:`, y);
      }
  }), u.onError((y) => {
    if (Ee = null, In = null, On = null, Wr(n), console.error(`[${T}] Cinematic error on scene ${n}:`, y), e.landing)
      try {
        st(e.landing, r), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
      } catch (m) {
        console.error(`[${T}] Cinematic: error applying landing state after error on scene ${n}:`, m);
      }
  });
  const d = e.synchronized === !0 && game.user.isGM;
  Ee = u.run({
    broadcast: d,
    commit: d
  }), console.log(`[${T}] Cinematic: timeline started, handle status: ${Ee.status}`);
}
l(ba, "playCinematic");
async function Jm(t) {
  var e;
  const n = t ?? ((e = canvas.scene) == null ? void 0 : e.id);
  n && (await game.user.unsetFlag(T, Ei(n)), console.log(`[${T}] Cinematic: cleared seen flag for scene ${n}.`));
}
l(Jm, "resetCinematic");
async function Km(t, n) {
  var r;
  if (!game.user.isGM) return;
  const e = t ?? ((r = canvas.scene) == null ? void 0 : r.id);
  if (!e || !n) return;
  const i = game.users.get(n);
  i && (await i.unsetFlag(T, Ei(e)), console.log(`[${T}] Cinematic: cleared seen flag for user ${i.name} on scene ${e}.`));
}
l(Km, "resetCinematicForUser");
async function Ym(t) {
  var r;
  if (!game.user.isGM) return;
  const n = t ?? ((r = canvas.scene) == null ? void 0 : r.id);
  if (!n) return;
  const e = Ei(n), i = game.users.map((a) => a.getFlag(T, e) ? a.unsetFlag(T, e) : Promise.resolve());
  await Promise.all(i), console.log(`[${T}] Cinematic: cleared seen flag for all users on scene ${n}.`);
}
l(Ym, "resetCinematicForAll");
function Qm(t) {
  var i;
  const n = t ?? ((i = canvas.scene) == null ? void 0 : i.id);
  if (!n) return [];
  const e = Ei(n);
  return game.users.map((r) => ({
    userId: r.id,
    name: r.name,
    color: r.color ?? "#888888",
    isGM: r.isGM,
    seen: !!r.getFlag(T, e)
  }));
}
l(Qm, "getSeenStatus");
function Xm(t) {
  var n;
  return Bi(t ?? ((n = canvas.scene) == null ? void 0 : n.id)) != null;
}
l(Xm, "hasCinematic");
function Zm() {
  if (!In || !On) {
    console.warn(`[${T}] Cinematic: no snapshot available for revert.`);
    return;
  }
  (Ee == null ? void 0 : Ee.status) === "running" && Ee.cancel("reverted"), Ee = null;
  try {
    st(In, On), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 }), console.log(`[${T}] Cinematic: reverted to pre-cinematic state.`);
  } catch (t) {
    console.error(`[${T}] Cinematic: error during revert:`, t);
  }
  In = null, On = null;
}
l(Zm, "revertCinematic");
async function ep() {
  const t = ++Mi;
  if (console.log(`[${T}] Cinematic: canvasReady fired, gen=${t}, game.ready=${game.ready}`), await Gm(), t !== Mi) return;
  console.log(`[${T}] Cinematic: game is ready`);
  const n = canvas.scene;
  if (!n) {
    console.log(`[${T}] Cinematic: no canvas.scene, exiting`);
    return;
  }
  const e = Bi(n.id);
  if (!e) {
    console.log(`[${T}] Cinematic: no cinematic flag on scene ${n.id}, exiting`);
    return;
  }
  if (console.log(`[${T}] Cinematic: found flag data on scene ${n.id}`), e.version && e.version > cc) {
    console.warn(`[${T}] Cinematic: scene ${n.id} has version ${e.version}, runtime supports up to ${cc}. Skipping.`);
    return;
  }
  if (e.trigger && e.trigger !== "canvasReady") {
    console.log(`[${T}] Cinematic: trigger "${e.trigger}" doesn't match, exiting`);
    return;
  }
  const i = Fd(n.id);
  if (t !== Mi) return;
  if (i) {
    console.log(`[${T}] Cinematic: found saved progress at step ${i.step}, resuming...`);
    try {
      await ba(n.id);
    } catch (a) {
      console.error(`[${T}] Cinematic: unhandled error during resumed playback on scene ${n.id}:`, a);
    }
    return;
  }
  const r = e.tracking !== !1 && zm(n.id);
  if (console.log(`[${T}] Cinematic: tracking=${e.tracking}, seen=${r}`), r) {
    if (Wr(n.id), (Ee == null ? void 0 : Ee.status) === "running" && Ee.cancel("already-seen"), Ee = null, e.landing) {
      if (console.log(`[${T}] Cinematic: applying landing state (already seen)`), await _d(), t !== Mi) return;
      try {
        const { targets: a } = gl(e);
        st(e.landing, a), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
      } catch (a) {
        console.error(`[${T}] Cinematic: error applying landing state (already seen) on scene ${n.id}:`, a);
      }
    }
    return;
  }
  if (t === Mi) {
    console.log(`[${T}] Cinematic: playing cinematic...`);
    try {
      await ba(n.id);
    } catch (a) {
      console.error(`[${T}] Cinematic: unhandled error during playback on scene ${n.id}:`, a);
    }
  }
}
l(ep, "onCanvasReady");
function tp(t = 3e5) {
  var i;
  const n = (i = game.user.flags) == null ? void 0 : i[T];
  if (!n) return;
  const e = Date.now();
  for (const r of Object.keys(n)) {
    if (!r.startsWith("cinematic-progress-")) continue;
    const a = n[r];
    if (!a || typeof a.timestamp != "number") {
      game.user.unsetFlag(T, r).catch(() => {
      });
      continue;
    }
    e - a.timestamp > t && (console.log(`[${T}] Cinematic: cleaning up stale progress flag "${r}" (age: ${e - a.timestamp}ms)`), game.user.unsetFlag(T, r).catch(() => {
    }));
  }
}
l(tp, "cleanupStaleProgressFlags");
function np() {
  Hooks.on("getSceneControlButtons", (t) => {
    if (!game.user.isGM) return;
    const n = Array.isArray(t) ? t : t instanceof Map ? Array.from(t.values()) : Object.values(t);
    if (!n.length) return;
    const e = n.find((o) => (o == null ? void 0 : o.name) === "tiles") ?? n.find((o) => (o == null ? void 0 : o.name) === "tokens" || (o == null ? void 0 : o.name) === "token") ?? n[0];
    if (!e) return;
    const i = e.tools, r = "eidolonCinematicEditor";
    if (Array.isArray(i) && i.some((o) => (o == null ? void 0 : o.name) === r) || i instanceof Map && i.has(r)) return;
    const a = {
      name: r,
      title: "Cinematic Editor",
      icon: "fa-solid fa-film",
      button: !0,
      toggle: !1,
      visible: !0,
      onClick: /* @__PURE__ */ l(() => {
        new Fs({ scene: canvas.scene }).render(!0);
      }, "onClick")
    };
    Array.isArray(i) ? i.push(a) : i instanceof Map ? i.set(r, a) : i && typeof i == "object" ? i[r] = a : e.tools = [a];
  });
}
l(np, "registerEditorButton");
function ip() {
  Hooks.on("canvasReady", ep), np(), Hooks.once("ready", () => {
    tp();
    const t = game.modules.get(T);
    t.api || (t.api = {}), t.api.cinematic = {
      play: ba,
      reset: Jm,
      resetForUser: Km,
      resetForAll: Ym,
      getSeenStatus: Qm,
      has: Xm,
      get: Bi,
      revert: Zm,
      TileAnimator: ya,
      registerBehaviour: vi,
      getBehaviour: $d,
      trigger: /* @__PURE__ */ l(async (n, e) => {
        var a;
        const i = e ?? ((a = canvas.scene) == null ? void 0 : a.id);
        if (!i) return;
        const r = Bi(i);
        r && (r.trigger && r.trigger !== n || await ba(i));
      }, "trigger")
    }, console.log(`[${T}] Cinematic API registered.`);
  });
}
l(ip, "registerCinematicHooks");
function uc(t, n) {
  const e = Math.abs(t.width), i = Math.abs(t.height), r = e / 2, a = i / 2;
  let o = n.x - (t.x + r), s = n.y - (t.y + a);
  if (t.rotation !== 0) {
    const c = Math.toRadians(t.rotation), u = Math.cos(c), d = Math.sin(c), g = u * o + d * s, p = u * s - d * o;
    o = g, s = p;
  }
  return o += r, s += a, o >= 0 && o <= e && s >= 0 && s <= i;
}
l(uc, "pointWithinTile");
so("tile-click", (t, n) => t.target ? new Promise((e, i) => {
  var b;
  if (n.signal.aborted) return i(n.signal.reason ?? "aborted");
  const r = co(t.target);
  if (!((b = r == null ? void 0 : r.placeables) != null && b.length))
    return i(new Error(`await tile-click: no placeables found for "${t.target}"`));
  const a = r.placeables, o = [];
  for (const { placeable: y } of a) {
    const m = new ya(y, t.animation);
    m.start("idle"), o.push({ placeable: y, animator: m });
  }
  const s = document.getElementById("board");
  let c = null;
  const u = /* @__PURE__ */ l((y) => {
    const m = canvas.activeLayer;
    if (!m) return;
    const v = m.toLocal(y);
    if (!v || isNaN(v.x) || isNaN(v.y)) return;
    let E = !1;
    for (const { placeable: C, animator: M } of o)
      uc(C.document, v) ? (E = !0, M.state !== "hover" && M.setState("hover")) : M.state === "hover" && M.setState("idle");
    E ? c === null && (c = document.body.style.cursor, document.body.style.cursor = "pointer") : c !== null && (document.body.style.cursor = c, c = null);
  }, "onPointerMove");
  s == null || s.addEventListener("pointermove", u);
  const d = /* @__PURE__ */ l((y) => {
    if (y.button !== 0) return;
    const m = canvas.activeLayer;
    if (!m) return;
    const v = m.toLocal(y);
    isNaN(v.x) || isNaN(v.y) || !a.filter(({ doc: C }) => uc(C, v)).sort((C, M) => (M.doc.sort ?? 0) - (C.doc.sort ?? 0))[0] || (y.stopPropagation(), y.preventDefault(), p(), e());
  }, "onPointerDown");
  s == null || s.addEventListener("pointerdown", d, { capture: !0 });
  const g = /* @__PURE__ */ l(() => {
    p(), i(n.signal.reason ?? "aborted");
  }, "onAbort");
  n.signal.addEventListener("abort", g, { once: !0 });
  function p() {
    s == null || s.removeEventListener("pointerdown", d, { capture: !0 }), s == null || s.removeEventListener("pointermove", u), n.signal.removeEventListener("abort", g);
    for (const { animator: y } of o)
      y.detach();
    c !== null ? (document.body.style.cursor = c, c = null) : document.body.style.cursor = "";
  }
  l(p, "cleanup");
}) : Promise.reject(new Error('await tile-click: "target" is required')));
ip();
function rp() {
  Hooks.once("ready", () => {
    const t = game.modules.get(T);
    t.api || (t.api = {}), t.api.picker = {
      /** Open the picker window. Returns Promise<string[] | null>. */
      open: /* @__PURE__ */ l((n) => pa.open(n), "open"),
      /** Resolve a selector string to documents. */
      resolveSelector: co,
      /** Parse a selector string into { type, value }. */
      parseSelector: fl,
      /** Build a selector string from { type, value }. */
      buildSelector: Lm,
      /** Build a tag selector from tags array + mode. */
      buildTagSelector: Ku,
      /** Canvas highlight utilities. */
      highlight: {
        add: ma,
        remove: yi,
        has: rd,
        clearAll: Ur
      }
    }, console.log(`[${T}] Placeable Picker API registered.`);
  });
}
l(rp, "registerPlaceablePickerHooks");
rp();
//# sourceMappingURL=eidolon-utilities.js.map
