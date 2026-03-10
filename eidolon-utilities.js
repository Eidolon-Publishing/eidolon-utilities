var Au = Object.defineProperty;
var ng = Object.getPrototypeOf;
var ig = Reflect.get;
var Mu = (t) => {
  throw TypeError(t);
};
var rg = (t, e, n) => e in t ? Au(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var c = (t, e) => Au(t, "name", { value: e, configurable: !0 });
var ue = (t, e, n) => rg(t, typeof e != "symbol" ? e + "" : e, n), Ha = (t, e, n) => e.has(t) || Mu("Cannot " + n);
var p = (t, e, n) => (Ha(t, e, "read from private field"), n ? n.call(t) : e.get(t)), A = (t, e, n) => e.has(t) ? Mu("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, n), I = (t, e, n, i) => (Ha(t, e, "write to private field"), i ? i.call(t, n) : e.set(t, n), n), T = (t, e, n) => (Ha(t, e, "access private method"), n);
var qa = (t, e, n, i) => ({
  set _(r) {
    I(t, e, r, n);
  },
  get _() {
    return p(t, e, i);
  }
}), Le = (t, e, n) => ig(ng(t), n, e);
const L = "eidolon-utilities", cs = "timeTriggerActive", ml = "timeTriggerHideWindow", gl = "timeTriggerShowPlayerWindow", pl = "timeTriggerAllowRealTime", Yd = "timeTriggers", Uo = "timeTriggerHistory", yl = "debug", bl = "timeFormat", vl = "manageTime", wl = "secondsPerRound";
const og = [-30, -15, -5, 5, 15, 30], tr = 1440 * 60, Vo = "playSound", Lo = 6;
function S(t, e) {
  var n, i;
  return (i = (n = game.i18n) == null ? void 0 : n.has) != null && i.call(n, t) ? game.i18n.localize(t) : e;
}
c(S, "localize");
function Bt(t) {
  return typeof t != "string" ? "" : t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
c(Bt, "escapeHtml");
function Vt(t) {
  var e;
  return t == null ? t : (e = foundry == null ? void 0 : foundry.utils) != null && e.duplicate ? foundry.utils.duplicate(t) : JSON.parse(JSON.stringify(t));
}
c(Vt, "duplicateData");
function sg() {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
c(sg, "generateTriggerId");
function Kd(t) {
  if (typeof t != "string") return null;
  const e = t.trim();
  if (!e) return null;
  const n = e.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (!n) return null;
  const i = Number(n[1]), r = Number(n[2]), o = n[3] !== void 0 ? Number(n[3]) : 0;
  return !Number.isInteger(i) || !Number.isInteger(r) || !Number.isInteger(o) || i < 0 || i > 23 || r < 0 || r > 59 || o < 0 || o > 59 ? null : i * 3600 + r * 60 + o;
}
c(Kd, "parseTriggerTimeToSeconds");
function Ar() {
  var t, e;
  return ((t = game.scenes) == null ? void 0 : t.current) ?? ((e = game.scenes) == null ? void 0 : e.active) ?? null;
}
c(Ar, "getActiveScene");
function rn(t) {
  return (t == null ? void 0 : t.object) ?? (t == null ? void 0 : t.document) ?? null;
}
c(rn, "getSceneFromApplication");
function Qe(t) {
  return t && typeof t.getFlag == "function" && typeof t.setFlag == "function";
}
c(Qe, "hasSceneDocument");
const El = /* @__PURE__ */ new Set(), Sl = /* @__PURE__ */ new Set(), Cl = /* @__PURE__ */ new Set(), Tl = /* @__PURE__ */ new Set();
let $i = !1, Kr = !1, us = Lo, ds = "12h", xu = !1;
function Ba(t) {
  $i = !!t;
  for (const e of El)
    try {
      e($i);
    } catch (n) {
      console.error(`${L} | Debug change handler failed`, n);
    }
}
c(Ba, "notifyDebugChange");
function ja(t) {
  Kr = !!t;
  for (const e of Sl)
    try {
      e(Kr);
    } catch (n) {
      console.error(`${L} | Manage time change handler failed`, n);
    }
}
c(ja, "notifyManageTimeChange");
function Xd(t) {
  return t === "24h" ? "24h" : "12h";
}
c(Xd, "normalizeTimeFormatValue");
function Vc(t) {
  const e = Number(t);
  return !Number.isFinite(e) || e <= 0 ? Lo : e;
}
c(Vc, "normalizeSecondsPerRoundValue");
function Ua(t) {
  const e = Vc(t);
  us = e;
  for (const n of Cl)
    try {
      n(e);
    } catch (i) {
      console.error(`${L} | Seconds-per-round change handler failed`, i);
    }
}
c(Ua, "notifySecondsPerRoundChange");
function Va(t) {
  const e = Xd(t);
  ds = e;
  for (const n of Tl)
    try {
      n(e);
    } catch (i) {
      console.error(`${L} | Time format change handler failed`, i);
    }
}
c(Va, "notifyTimeFormatChange");
function ag() {
  var e;
  if (xu) return;
  if (xu = !0, !((e = game == null ? void 0 : game.settings) != null && e.register)) {
    console.warn(
      `${L} | game.settings.register is unavailable. Module settings could not be registered.`
    );
    return;
  }
  const t = typeof game.settings.registerChange == "function";
  game.settings.register(L, yl, {
    name: S("EIDOLON.TimeTrigger.DebugSettingName", "Enable debug logging"),
    hint: S(
      "EIDOLON.TimeTrigger.DebugSettingHint",
      "Write detailed time-trigger diagnostics to the browser console."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: t ? void 0 : Ba
  }), t && game.settings.registerChange(L, yl, Ba), $i = Gc(), Ba($i), game.settings.register(L, vl, {
    name: S("EIDOLON.TimeTrigger.ManageTimeSettingName", "Manage Game Time"),
    hint: S(
      "EIDOLON.TimeTrigger.ManageTimeSettingHint",
      "Allow Eidolon Utilities to advance world time automatically while the game is unpaused. Warning: This may conflict with other time-management modules."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: t ? void 0 : ja
  }), t && game.settings.registerChange(L, vl, ja), Kr = cg(), ja(Kr), game.settings.register(L, wl, {
    name: S(
      "EIDOLON.TimeTrigger.SecondsPerRoundSettingName",
      "Seconds Per Combat Round"
    ),
    hint: S(
      "EIDOLON.TimeTrigger.SecondsPerRoundSettingHint",
      "Amount of world seconds to add whenever a combat round ends while time management is active."
    ),
    scope: "world",
    config: !0,
    type: Number,
    default: Lo,
    range: { min: 1, max: 3600, step: 1 },
    onChange: t ? void 0 : Ua
  }), t && game.settings.registerChange(
    L,
    wl,
    Ua
  ), us = Vc(ug()), Ua(us), game.settings.register(L, bl, {
    name: S("EIDOLON.TimeTrigger.TimeFormatSettingName", "Trigger Time Format"),
    hint: S(
      "EIDOLON.TimeTrigger.TimeFormatSettingHint",
      "Control whether trigger times use a 12-hour or 24-hour clock."
    ),
    scope: "world",
    config: !0,
    type: String,
    choices: {
      "12h": S(
        "EIDOLON.TimeTrigger.TimeFormatSettingChoice12Hour",
        "12-hour (e.g. 2:30 PM)"
      ),
      "24h": S(
        "EIDOLON.TimeTrigger.TimeFormatSettingChoice24Hour",
        "24-hour (e.g. 14:30)"
      )
    },
    default: "12h",
    onChange: t ? void 0 : Va
  }), t && game.settings.registerChange(L, bl, Va), ds = Xd(Jd()), Va(ds);
}
c(ag, "registerTimeTriggerSettings");
function Gc() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return !!game.settings.get(L, yl);
  } catch (e) {
    console.error(`${L} | Failed to read debug setting`, e);
  }
  return !1;
}
c(Gc, "getDebugSetting");
function lg() {
  return $i = Gc(), $i;
}
c(lg, "refreshDebugSettingCache");
function cg() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return !!game.settings.get(L, vl);
  } catch (e) {
    console.error(`${L} | Failed to read manage time setting`, e);
  }
  return !1;
}
c(cg, "getManageTimeSetting");
function Jd() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return game.settings.get(L, bl) === "24h" ? "24h" : "12h";
  } catch (e) {
    console.error(`${L} | Failed to read time format setting`, e);
  }
  return "12h";
}
c(Jd, "getTimeFormatSetting");
function ug() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get) {
      const e = game.settings.get(L, wl);
      return Vc(e);
    }
  } catch (e) {
    console.error(`${L} | Failed to read seconds-per-round setting`, e);
  }
  return Lo;
}
c(ug, "getSecondsPerRoundSetting");
function dg(t) {
  if (typeof t != "function")
    return () => {
    };
  El.add(t);
  try {
    t($i);
  } catch (e) {
    console.error(`${L} | Debug change handler failed`, e);
  }
  return () => {
    El.delete(t);
  };
}
c(dg, "onDebugSettingChange");
function Qd(t) {
  if (typeof t != "function")
    return () => {
    };
  Sl.add(t);
  try {
    t(Kr);
  } catch (e) {
    console.error(`${L} | Manage time change handler failed`, e);
  }
  return () => {
    Sl.delete(t);
  };
}
c(Qd, "onManageTimeSettingChange");
function Wc(t) {
  if (typeof t != "function")
    return () => {
    };
  Tl.add(t);
  try {
    t(ds);
  } catch (e) {
    console.error(`${L} | Time format change handler failed`, e);
  }
  return () => {
    Tl.delete(t);
  };
}
c(Wc, "onTimeFormatSettingChange");
function fg(t) {
  if (typeof t != "function")
    return () => {
    };
  Cl.add(t);
  try {
    t(us);
  } catch (e) {
    console.error(`${L} | Seconds-per-round change handler failed`, e);
  }
  return () => {
    Cl.delete(t);
  };
}
c(fg, "onSecondsPerRoundSettingChange");
let ya = !1, Ll = !1;
function Il(t) {
  ya = !!t;
}
c(Il, "updateDebugState");
function Zd() {
  Ll || (Ll = !0, Il(Gc()), dg((t) => {
    Il(t), console.info(`${L} | Debug ${ya ? "enabled" : "disabled"}`);
  }));
}
c(Zd, "ensureInitialized");
function zc() {
  return Ll || Zd(), ya;
}
c(zc, "shouldLog");
function ef(t) {
  if (!t.length)
    return [`${L} |`];
  const [e, ...n] = t;
  return typeof e == "string" ? [`${L} | ${e}`, ...n] : [`${L} |`, e, ...n];
}
c(ef, "formatArgs");
function hg() {
  Zd();
}
c(hg, "initializeDebug");
function mg() {
  return Il(lg()), ya;
}
c(mg, "syncDebugState");
function _(...t) {
  zc() && console.debug(...ef(t));
}
c(_, "debugLog");
function ur(...t) {
  zc() && console.group(...ef(t));
}
c(ur, "debugGroup");
function zn() {
  zc() && console.groupEnd();
}
c(zn, "debugGroupEnd");
function nr(t) {
  var r;
  const e = (r = t == null ? void 0 : t.getFlag) == null ? void 0 : r.call(t, L, Yd);
  if (!e) return [];
  const n = Vt(e), i = Array.isArray(n) ? n : [];
  return _("Loaded time triggers", {
    sceneId: (t == null ? void 0 : t.id) ?? null,
    count: i.length
  }), i;
}
c(nr, "getTimeTriggers");
async function tf(t, e) {
  t != null && t.setFlag && (_("Persisting time triggers", {
    sceneId: t.id,
    count: Array.isArray(e) ? e.length : 0
  }), await t.setFlag(L, Yd, e));
}
c(tf, "setTimeTriggers");
function gg(t) {
  var r;
  const e = (r = t == null ? void 0 : t.getFlag) == null ? void 0 : r.call(t, L, Uo);
  if (!e) return {};
  const n = Vt(e);
  if (!n || typeof n != "object") return {};
  const i = {};
  for (const [o, s] of Object.entries(n))
    typeof s == "number" && Number.isFinite(s) && (i[o] = s);
  return _("Loaded time trigger history", {
    sceneId: (t == null ? void 0 : t.id) ?? null,
    keys: Object.keys(i)
  }), i;
}
c(gg, "getTimeTriggerHistory");
async function Ga(t, e) {
  var l, u, d, f;
  if (!t) return;
  const n = {};
  if (e && typeof e == "object")
    for (const [h, m] of Object.entries(e))
      typeof m == "number" && Number.isFinite(m) && (n[h] = m);
  const i = ((l = t.getFlag) == null ? void 0 : l.call(t, L, Uo)) ?? {}, r = {};
  if (i && typeof i == "object")
    for (const [h, m] of Object.entries(i))
      typeof m == "number" && Number.isFinite(m) && (r[h] = m);
  const o = Object.keys(n), s = Object.keys(r);
  if (typeof ((u = foundry == null ? void 0 : foundry.utils) == null ? void 0 : u.deepEqual) == "function" ? foundry.utils.deepEqual(r, n) : JSON.stringify(r) === JSON.stringify(n)) {
    _("Skip history update because state is unchanged", {
      sceneId: (t == null ? void 0 : t.id) ?? null
    });
    return;
  }
  _("Updating time trigger history", {
    sceneId: (t == null ? void 0 : t.id) ?? null,
    keys: o,
    removedKeys: s.filter((h) => !o.includes(h))
  });
  try {
    s.length && typeof t.unsetFlag == "function" && await t.unsetFlag(L, Uo), o.length && await t.setFlag(L, Uo, n);
  } catch (h) {
    console.error(`${L} | Failed to persist time trigger history`, h), (f = (d = ui.notifications) == null ? void 0 : d.error) == null || f.call(
      d,
      S(
        "EIDOLON.TimeTrigger.HistoryPersistError",
        "Failed to persist the scene's time trigger history."
      )
    );
  }
}
c(Ga, "updateTimeTriggerHistory");
const fs = /* @__PURE__ */ new Map(), _u = /* @__PURE__ */ new Set();
function pg(t) {
  if (!(t != null && t.id))
    throw new Error(`${L} | Action definitions require an id.`);
  if (fs.has(t.id))
    throw new Error(`${L} | Duplicate time trigger action id: ${t.id}`);
  fs.set(t.id, {
    ...t
  }), _("Registered time trigger action", { actionId: t.id });
}
c(pg, "registerAction");
function Io(t) {
  return fs.get(t) ?? null;
}
c(Io, "getAction");
function yg(t) {
  const e = Io(t);
  return e ? typeof e.label == "function" ? e.label() : e.label : t;
}
c(yg, "getActionLabel");
function Nu() {
  return Array.from(fs.values());
}
c(Nu, "listActions");
async function nf(t, e) {
  var i, r;
  const n = Io(e == null ? void 0 : e.action);
  if (!n || typeof n.execute != "function") {
    const o = S(
      "EIDOLON.TimeTrigger.UnknownAction",
      "Encountered an unknown time trigger action and skipped it."
    );
    (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, o), console.warn(`${L} | Unknown time trigger action`, e), _("Encountered unknown time trigger action", {
      triggerId: (e == null ? void 0 : e.id) ?? null,
      actionId: (e == null ? void 0 : e.action) ?? null
    });
    return;
  }
  _("Executing action handler", {
    actionId: n.id,
    triggerId: (e == null ? void 0 : e.id) ?? null,
    sceneId: (t == null ? void 0 : t.id) ?? null
  }), await n.execute({ scene: t, trigger: e });
}
c(nf, "executeTriggerAction");
function bg(t) {
  const e = Io(t == null ? void 0 : t.action);
  return !e || typeof e.buildSummaryParts != "function" ? [] : e.buildSummaryParts({ trigger: t, escapeHtml: Bt, localize: S }) ?? [];
}
c(bg, "buildActionSummaryParts");
function vg(t) {
  const e = Io(t == null ? void 0 : t.action);
  return !e || typeof e.buildFormContent != "function" ? "" : e.buildFormContent({ trigger: t, escapeHtml: Bt, localize: S }) ?? "";
}
c(vg, "buildActionFormSection");
function wg(t, e) {
  const n = Io(t == null ? void 0 : t.action);
  !n || typeof n.prepareFormData != "function" || n.prepareFormData({ trigger: t, formData: e });
}
c(wg, "applyActionFormData");
function Eg(t, e, n) {
  var o, s;
  const i = `${(t == null ? void 0 : t.id) ?? "unknown"}:${(e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.action) ?? "unknown"}:${n}`;
  if (_u.has(i)) return;
  _u.add(i);
  const r = S(
    "EIDOLON.TimeTrigger.MissingDataWarning",
    "A scene time trigger is missing required data and was skipped."
  );
  (s = (o = ui.notifications) == null ? void 0 : o.warn) == null || s.call(o, r), console.warn(`${L} | Missing trigger data (${n})`, { scene: t == null ? void 0 : t.id, trigger: e });
}
c(Eg, "warnMissingTriggerData");
async function Sg({ scene: t, trigger: e }) {
  var o, s, a, l, u;
  const n = (a = (s = (o = e == null ? void 0 : e.data) == null ? void 0 : o.path) == null ? void 0 : s.trim) == null ? void 0 : a.call(s);
  if (!n) {
    Eg(t, e, "missing-audio-path");
    return;
  }
  const i = {
    src: n,
    autoplay: !0,
    loop: !1
  }, r = (() => {
    var d, f, h, m, g;
    return typeof ((f = (d = foundry == null ? void 0 : foundry.audio) == null ? void 0 : d.AudioHelper) == null ? void 0 : f.play) == "function" ? foundry.audio.AudioHelper.play(i, !0) : typeof ((m = (h = game == null ? void 0 : game.audio) == null ? void 0 : h.constructor) == null ? void 0 : m.play) == "function" ? game.audio.constructor.play(i, !0) : typeof ((g = game == null ? void 0 : game.audio) == null ? void 0 : g.play) == "function" ? game.audio.play(i, !0) : null;
  })();
  if (!r) {
    console.error(`${L} | Foundry audio helper is unavailable`), (u = (l = ui.notifications) == null ? void 0 : l.error) == null || u.call(
      l,
      S(
        "EIDOLON.TimeTrigger.AudioHelperUnavailable",
        "Unable to play audio for a time trigger because the Foundry audio helper is unavailable."
      )
    );
    return;
  }
  await r;
}
c(Sg, "executePlaySoundAction");
pg({
  id: Vo,
  label: /* @__PURE__ */ c(() => S("EIDOLON.TimeTrigger.ActionPlaySound", "Play Sound"), "label"),
  execute: Sg,
  buildSummaryParts: /* @__PURE__ */ c(({ trigger: t, escapeHtml: e, localize: n }) => {
    var r;
    return (r = t == null ? void 0 : t.data) != null && r.path ? [`${e(n("EIDOLON.TimeTrigger.TriggerSound", "Sound File"))}: ${e(t.data.path)}`] : [];
  }, "buildSummaryParts"),
  buildFormContent: /* @__PURE__ */ c(({ trigger: t, escapeHtml: e, localize: n }) => {
    var a;
    const i = e(n("EIDOLON.TimeTrigger.TriggerSound", "Sound File")), r = e(
      n("EIDOLON.TimeTrigger.TriggerChooseFile", "Select File")
    ), o = e(
      n(
        "EIDOLON.TimeTrigger.TriggerSoundNotes",
        "Select or upload the audio file that should play when this trigger fires."
      )
    ), s = e(((a = t == null ? void 0 : t.data) == null ? void 0 : a.path) ?? "");
    return `
      <label>${i}</label>
      <div class="form-fields">
        <input type="text" name="playSoundPath" value="${s}" data-dtype="String">
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
  prepareFormData: /* @__PURE__ */ c(({ trigger: t, formData: e }) => {
    var n, i;
    t.data.path = ((i = (n = e.playSoundPath) == null ? void 0 : n.trim) == null ? void 0 : i.call(n)) ?? "";
  }, "prepareFormData")
});
var Hd;
const { ApplicationV2: on, HandlebarsApplicationMixin: sn } = ((Hd = foundry.applications) == null ? void 0 : Hd.api) ?? {};
if (!on || !sn)
  throw new Error(
    `${L} | ApplicationV2 API unavailable. Update Foundry VTT to v13 or newer.`
  );
const Jn = "AM", Fi = "PM";
function Yn() {
  return Jd();
}
c(Yn, "getConfiguredTimeFormat");
function ba(t) {
  if (typeof t != "string") return null;
  const e = t.trim();
  if (!e) return null;
  const n = e.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (!n) return null;
  const i = Number(n[1]), r = Number(n[2]), o = n[3] !== void 0 ? Number(n[3]) : null;
  return !Number.isInteger(i) || !Number.isInteger(r) || i < 0 || i > 23 || r < 0 || r > 59 || o !== null && (!Number.isInteger(o) || o < 0 || o > 59) ? null : {
    hours: i,
    minutes: r,
    seconds: o
  };
}
c(ba, "parseCanonicalTimeString");
function Zt({ hours: t, minutes: e, seconds: n }) {
  if (!Number.isInteger(t) || !Number.isInteger(e) || t < 0 || t > 23 || e < 0 || e > 59) return null;
  const i = String(t).padStart(2, "0"), r = String(e).padStart(2, "0");
  if (Number.isInteger(n)) {
    if (n < 0 || n > 59) return null;
    const o = String(n).padStart(2, "0");
    return `${i}:${r}:${o}`;
  }
  return `${i}:${r}`;
}
c(Zt, "formatCanonicalTime");
function Cg(t, { format: e } = {}) {
  if (!t || typeof t != "object") return null;
  const n = Number(t.hour), i = Number(t.minute), r = t.second !== void 0 && t.second !== null, o = r ? Number(t.second) : null, s = r && Number.isFinite(o) ? Math.floor(Math.max(0, Math.min(59, o))) : null;
  if (!Number.isFinite(n) || !Number.isFinite(i)) return null;
  const a = e ?? Yn();
  return hs(
    {
      hours: n,
      minutes: i,
      seconds: s
    },
    a
  );
}
c(Cg, "formatTimeComponentsForDisplay");
function Tg(t, { format: e } = {}) {
  const n = ba(t);
  if (!n) return "";
  const i = e ?? Yn();
  return hs(n, i);
}
c(Tg, "formatTriggerTimeForDisplay");
function hs(t, e = "12h") {
  if (!t) return "";
  const { hours: n, minutes: i, seconds: r = null } = t;
  if (!Number.isInteger(n) || !Number.isInteger(i)) return "";
  const o = Number.isInteger(r);
  if (e === "24h") {
    const h = `${String(n).padStart(2, "0")}:${String(i).padStart(2, "0")}`;
    return o ? `${h}:${String(r).padStart(2, "0")}` : h;
  }
  const s = n >= 12 ? Fi : Jn, a = n % 12 === 0 ? 12 : n % 12, l = String(a), u = String(i).padStart(2, "0"), d = `${l}:${u}`, f = s === Jn ? S("EIDOLON.TimeTrigger.TimePeriodAM", Jn) : S("EIDOLON.TimeTrigger.TimePeriodPM", Fi);
  if (o) {
    const h = String(r).padStart(2, "0");
    return `${d}:${h} ${f}`;
  }
  return `${d} ${f}`;
}
c(hs, "formatTimeParts");
function $u(t, e = Yn()) {
  const n = ba(t);
  if (e === "24h")
    return {
      format: e,
      canonical: n ? Zt(n) ?? "" : "",
      hour: n ? String(n.hours).padStart(2, "0") : "",
      minute: n ? String(n.minutes).padStart(2, "0") : ""
    };
  if (!n)
    return {
      format: e,
      canonical: "",
      hour: "",
      minute: "",
      period: Jn
    };
  const i = n.hours >= 12 ? Fi : Jn, r = n.hours % 12 === 0 ? 12 : n.hours % 12;
  return {
    format: e,
    canonical: Zt(n) ?? "",
    hour: String(r),
    minute: String(n.minutes).padStart(2, "0"),
    period: i
  };
}
c($u, "getTimeFormValues");
function Lg({ hour: t, minute: e, period: n, time: i }, r = Yn()) {
  if (r === "24h") {
    const m = typeof t == "string" ? t.trim() : "", g = typeof e == "string" ? e.trim() : "", y = typeof i == "string" ? i.trim() : "";
    if (!m && !g && y) {
      const E = ba(y);
      return E ? { canonical: Zt(E) ?? "", error: null } : {
        canonical: "",
        error: S(
          "EIDOLON.TimeTrigger.TimeFormatInvalid24",
          "Enter a valid time in HH:MM format."
        )
      };
    }
    if (!m || !g)
      return {
        canonical: "",
        error: S("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.")
      };
    const v = Number(m), b = Number(g);
    return !Number.isInteger(v) || v < 0 || v > 23 ? {
      canonical: "",
      error: S(
        "EIDOLON.TimeTrigger.TimeFormatInvalid24",
        "Enter a valid time in HH:MM format."
      )
    } : !Number.isInteger(b) || b < 0 || b > 59 ? {
      canonical: "",
      error: S(
        "EIDOLON.TimeTrigger.TimeFormatInvalid24",
        "Enter a valid time in HH:MM format."
      )
    } : { canonical: Zt({
      hours: v,
      minutes: b
    }) ?? "", error: null };
  }
  const o = typeof t == "string" ? t.trim() : "", s = typeof e == "string" ? e.trim() : "", a = typeof n == "string" ? n.trim().toUpperCase() : "";
  if (!o || !s || !a)
    return { canonical: "", error: S("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.") };
  if (a !== Jn && a !== Fi)
    return { canonical: "", error: S("EIDOLON.TimeTrigger.TimeFormatInvalidPeriod", "Select AM or PM.") };
  const l = Number(o), u = Number(s);
  if (!Number.isInteger(l) || l < 1 || l > 12)
    return {
      canonical: "",
      error: S("EIDOLON.TimeTrigger.TimeFormatInvalidHour", "Hours must be between 1 and 12.")
    };
  if (!Number.isInteger(u) || u < 0 || u > 59)
    return {
      canonical: "",
      error: S("EIDOLON.TimeTrigger.TimeFormatInvalidMinute", "Minutes must be between 00 and 59.")
    };
  const d = l % 12, h = {
    hours: a === Fi ? d + 12 : d,
    minutes: u
  };
  return {
    canonical: Zt(h) ?? "",
    error: null
  };
}
c(Lg, "normalizeFormTimeInput");
function Ig() {
  return [
    {
      value: Jn,
      label: S("EIDOLON.TimeTrigger.TimePeriodAM", Jn)
    },
    {
      value: Fi,
      label: S("EIDOLON.TimeTrigger.TimePeriodPM", Fi)
    }
  ];
}
c(Ig, "getPeriodOptions");
var wi, Ei, re, rf, js, Us, of, kl, Al, Vs, Gs, sf, af, lf, Ml, xl, _l, Ws, zs, Nl, Ys, cf, uf;
const bi = class bi extends sn(on) {
  constructor(n = {}) {
    var s;
    const { scene: i, showControls: r, ...o } = n ?? {};
    super(o);
    A(this, re);
    A(this, wi, null);
    A(this, Ei, null);
    A(this, js, /* @__PURE__ */ c((n) => {
      var r, o;
      n.preventDefault();
      const i = Number((o = (r = n.currentTarget) == null ? void 0 : r.dataset) == null ? void 0 : o.delta);
      Number.isFinite(i) && (_("Time delta button clicked", { delta: i }), this._advanceTime(i));
    }, "#onDeltaClick"));
    A(this, Us, /* @__PURE__ */ c((n) => {
      var i, r;
      n.preventDefault(), !(!this.showControls || !((i = game.user) != null && i.isGM)) && (_("Time value double clicked", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null }), T(this, re, of).call(this));
    }, "#onTimeDoubleClick"));
    A(this, Vs, /* @__PURE__ */ c((n) => {
      if (this.isEditingTime && !this._commitTimeInProgress)
        if (n.key === "Enter") {
          n.preventDefault();
          const i = n.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
          T(this, re, Al).call(this, r);
        } else n.key === "Escape" && (n.preventDefault(), T(this, re, kl).call(this));
    }, "#onTimeInputKeydown"));
    A(this, Gs, /* @__PURE__ */ c((n) => {
      if (!this.isEditingTime || this._commitTimeInProgress || this._suppressBlurCommit) return;
      const i = n.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
      T(this, re, Al).call(this, r);
    }, "#onTimeInputBlur"));
    A(this, Ws, /* @__PURE__ */ c((n) => {
      const i = !!n;
      if (this.manageTimeEnabled === i) return;
      this.manageTimeEnabled = i, (this.rendered ?? this.isRendered ?? !1) && this.render({ force: !0 });
    }, "#handleManageTimeChange"));
    A(this, zs, /* @__PURE__ */ c(async (n) => {
      var o, s, a, l, u, d, f, h, m;
      if (n.preventDefault(), !this.showControls || !((o = game.user) != null && o.isGM)) return;
      if (!this.manageTimeEnabled) {
        (a = (s = ui.notifications) == null ? void 0 : s.error) == null || a.call(
          s,
          S(
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
          S(
            "EIDOLON.TimeTrigger.SceneUnavailable",
            "The active scene is unavailable. Try again after reloading the world."
          )
        );
        return;
      }
      const r = !this.sceneAllowsRealTime;
      try {
        await i.setFlag(L, pl, r), this.sceneAllowsRealTime = r;
        const g = r ? S(
          "EIDOLON.TimeTrigger.SceneRealTimeEnabled",
          "Automatic real-time flow enabled for this scene."
        ) : S(
          "EIDOLON.TimeTrigger.SceneRealTimeDisabled",
          "Automatic real-time flow disabled for this scene."
        );
        (f = (d = ui.notifications) == null ? void 0 : d.info) == null || f.call(d, g);
      } catch (g) {
        console.error(`${L} | Failed to toggle scene real-time flow`, g), (m = (h = ui.notifications) == null ? void 0 : h.error) == null || m.call(
          h,
          S(
            "EIDOLON.TimeTrigger.SceneRealTimeToggleError",
            "Failed to update the scene's real-time flow setting."
          )
        );
      } finally {
        this.render({ force: !0 });
      }
    }, "#onRealTimeToggleClick"));
    A(this, Ys, /* @__PURE__ */ c(() => {
      (this.rendered ?? this.isRendered ?? !1) && (this.isEditingTime && (this.editValue = T(this, re, Ml).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    this.scene = i ?? null, this.showControls = typeof r == "boolean" ? r : !!((s = game.user) != null && s.isGM), this.isEditingTime = !1, this.editValue = "", this._commitTimeInProgress = !1, this._suppressBlurCommit = !1, this.manageTimeEnabled = !1, this.sceneAllowsRealTime = T(this, re, Nl).call(this), I(this, wi, Wc(p(this, Ys))), I(this, Ei, Qd(p(this, Ws)));
  }
  async _prepareContext() {
    var b, w;
    const n = ((b = game.time) == null ? void 0 : b.components) ?? {}, r = ((n == null ? void 0 : n.second) !== void 0 && (n == null ? void 0 : n.second) !== null ? Cg(n) : null) ?? T(this, re, rf).call(this), o = Yn(), s = o === "24h", a = s ? S("EIDOLON.TimeTrigger.EditTimePlaceholder24", "HH:MM") : S("EIDOLON.TimeTrigger.EditTimePlaceholder12", "HH:MM AM/PM"), l = this.showControls ? S(
      "EIDOLON.TimeTrigger.EditTimeHint",
      "Double-click to set a specific time."
    ) : "", u = this.showControls ? S(
      "EIDOLON.TimeTrigger.EditTimeLabel",
      "New time (HH:MM or HH:MM AM/PM)"
    ) : "", d = og.map((E) => ({
      minutes: E,
      label: E > 0 ? `+${E}` : `${E}`
    })), f = !!this.manageTimeEnabled, h = T(this, re, Nl).call(this);
    this.sceneAllowsRealTime = h;
    const m = S(
      "EIDOLON.TimeTrigger.SceneRealTimeEnable",
      "Enable automatic real-time flow for this scene."
    ), g = S(
      "EIDOLON.TimeTrigger.SceneRealTimeDisable",
      "Disable automatic real-time flow for this scene."
    ), y = S(
      "EIDOLON.TimeTrigger.SceneRealTimeManageDisabled",
      "Enable Manage Time in module settings to allow automatic real-time flow."
    );
    return {
      formattedTime: r,
      deltas: d,
      manageTimeEnabled: f,
      sceneAllowsRealTime: h,
      realTimeButtonLabel: f ? h ? g : m : y,
      isGM: ((w = game.user) == null ? void 0 : w.isGM) ?? !1,
      showControls: !!this.showControls,
      editHint: l,
      editLabel: u,
      editPlaceholder: a,
      timeFormat: o,
      is24Hour: s,
      isEditingTime: !!this.isEditingTime,
      editValue: this.isEditingTime ? this.editValue ?? "" : ""
    };
  }
  async close(n = {}) {
    var r, o;
    if (!n.force)
      return (this.rendered ?? this.isRendered ?? !1) || (_("TimeTriggerWindow close request rerendering", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null
      }), this.render({ force: !0 })), this;
    _("Closing time trigger window", { sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null, force: !0 });
    const i = await super.close(n);
    return T(this, re, cf).call(this), T(this, re, uf).call(this), i;
  }
  async _advanceTime(n) {
    var r, o, s, a, l, u, d;
    const i = n * 60;
    if (_("Advancing world time", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null, minutes: n, seconds: i }), !((o = game.user) != null && o.isGM)) {
      (a = (s = ui.notifications) == null ? void 0 : s.warn) == null || a.call(s, S("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time."));
      return;
    }
    try {
      await game.time.advance(i);
    } catch (f) {
      console.error(`${L} | Failed to advance time`, f), (u = (l = ui.notifications) == null ? void 0 : l.error) == null || u.call(
        l,
        S("EIDOLON.TimeTrigger.Error", "Failed to update the world time.")
      ), _("Failed to advance time from window", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        minutes: n,
        message: (f == null ? void 0 : f.message) ?? String(f)
      });
    }
  }
  _onRender(n, i) {
    var o;
    super._onRender(n, i);
    const r = this.element;
    if (r) {
      if (this.showControls) {
        _("Binding time trigger interactions", {
          sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
          buttonCount: r.querySelectorAll("[data-delta]").length
        }), r.querySelectorAll("[data-delta]").forEach((u) => {
          u.addEventListener("click", p(this, js));
        });
        const s = r.querySelector('.time-trigger-window__time-value[data-editable="true"]');
        s && s.addEventListener("dblclick", p(this, Us), { once: !1 });
        const a = r.querySelector(".time-trigger-window__time-input");
        a && (a.addEventListener("keydown", p(this, Vs)), a.addEventListener("blur", p(this, Gs)), typeof a.focus == "function" && (a.focus(), typeof a.select == "function" && a.select()));
        const l = r.querySelector('[data-action="toggle-real-time"]');
        l && l.addEventListener("click", p(this, zs));
      }
      this._suppressBlurCommit = !1;
    }
  }
};
wi = new WeakMap(), Ei = new WeakMap(), re = new WeakSet(), rf = /* @__PURE__ */ c(function() {
  var l;
  const n = (l = game.time) == null ? void 0 : l.worldTime;
  if (typeof n != "number" || !Number.isFinite(n)) return "";
  const i = 1440 * 60, r = (Math.floor(n) % i + i) % i, o = Math.floor(r / 3600), s = Math.floor(r % 3600 / 60), a = r % 60;
  return hs({ hours: o, minutes: s, seconds: a }, Yn());
}, "#formatFallbackTime"), js = new WeakMap(), Us = new WeakMap(), of = /* @__PURE__ */ c(function() {
  var n;
  (n = game.user) != null && n.isGM && (this.isEditingTime = !0, this._suppressBlurCommit = !1, this.editValue = T(this, re, Ml).call(this), this.render({ force: !0 }));
}, "#enterTimeEditMode"), kl = /* @__PURE__ */ c(function() {
  this.isEditingTime = !1, this.editValue = "", this._suppressBlurCommit = !1, this.render({ force: !0 });
}, "#cancelTimeEdit"), Al = /* @__PURE__ */ c(async function(n) {
  var o, s, a;
  if (!((o = game.user) != null && o.isGM) || !this.isEditingTime || this._commitTimeInProgress) return;
  this._commitTimeInProgress = !0;
  const i = typeof n == "string" ? n.trim() : "";
  if (!i) {
    T(this, re, kl).call(this), this._commitTimeInProgress = !1;
    return;
  }
  const r = T(this, re, lf).call(this, i);
  if (r.error) {
    (a = (s = ui.notifications) == null ? void 0 : s.error) == null || a.call(s, r.error), this._suppressBlurCommit = !0, this.editValue = i, this.render({ force: !0 }), this._commitTimeInProgress = !1;
    return;
  }
  try {
    await T(this, re, af).call(this, r.seconds, r.includeSeconds) ? (this.isEditingTime = !1, this.editValue = "", this.render({ force: !0 })) : (this.editValue = i, this.render({ force: !0 }));
  } finally {
    this._commitTimeInProgress = !1;
  }
}, "#commitTimeInput"), Vs = new WeakMap(), Gs = new WeakMap(), sf = /* @__PURE__ */ c(function() {
  var u, d;
  const n = (u = game.time) == null ? void 0 : u.worldTime;
  if (typeof n != "number" || !Number.isFinite(n))
    return "";
  const i = ((d = game.time) == null ? void 0 : d.components) ?? {}, r = Number(i.hour), o = Number(i.minute), s = i.second !== void 0 ? Number(i.second) : null, a = Number.isInteger(s);
  return (Number.isFinite(r) && Number.isFinite(o) ? Zt({
    hours: Math.max(0, Math.min(23, Number(r))),
    minutes: Math.max(0, Math.min(59, Number(o))),
    seconds: a && Number.isFinite(s) ? Math.max(0, Math.min(59, Number(s))) : void 0
  }) ?? "" : "") ?? "";
}, "#getCurrentCanonicalTime"), af = /* @__PURE__ */ c(async function(n, i) {
  var h, m, g, y, v, b, w, E, C, O;
  const r = (h = game.time) == null ? void 0 : h.worldTime;
  if (typeof r != "number" || !Number.isFinite(r))
    return (g = (m = ui.notifications) == null ? void 0 : m.error) == null || g.call(
      m,
      S(
        "EIDOLON.TimeTrigger.EditTimeUnavailable",
        "The world time is unavailable, so it can't be updated."
      )
    ), !1;
  if (!Number.isInteger(n) || n < 0 || n >= tr)
    return (v = (y = ui.notifications) == null ? void 0 : y.error) == null || v.call(
      y,
      S(
        "EIDOLON.TimeTrigger.EditTimeInvalidRange",
        "Enter a time within the current day."
      )
    ), !1;
  const a = Math.floor(r / tr) * tr + n - r;
  if (!Number.isFinite(a) || a === 0)
    return !0;
  const l = Math.floor(n / 3600), u = Math.floor(n % 3600 / 60), d = n % 60, f = Zt({
    hours: l,
    minutes: u,
    seconds: i ? d : void 0
  });
  try {
    _("Updating world time directly", {
      sceneId: ((b = this.scene) == null ? void 0 : b.id) ?? null,
      targetCanonical: f ?? null,
      diff: a
    }), await game.time.advance(a);
    const k = hs(
      {
        hours: l,
        minutes: u,
        seconds: i ? d : null
      },
      Yn()
    );
    (E = (w = ui.notifications) == null ? void 0 : w.info) == null || E.call(
      w,
      S(
        "EIDOLON.TimeTrigger.EditTimeSuccess",
        "World time updated."
      ) + (k ? ` ${k}` : "")
    );
  } catch (k) {
    return console.error(`${L} | Failed to set world time`, k), (O = (C = ui.notifications) == null ? void 0 : C.error) == null || O.call(
      C,
      S(
        "EIDOLON.TimeTrigger.EditTimeError",
        "Failed to update the world time."
      )
    ), !1;
  }
  return !0;
}, "#applyTargetSeconds"), lf = /* @__PURE__ */ c(function(n) {
  var f;
  const i = S(
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
    const h = Number(o[1]), m = Number(o[2]), g = o[3] !== void 0 ? Number(o[3]) : void 0;
    if (Number.isInteger(h) && h >= 0 && h <= 23 && Number.isInteger(m) && m >= 0 && m <= 59 && (g === void 0 || Number.isInteger(g) && g >= 0 && g <= 59)) {
      const y = h * 3600 + m * 60 + (g ?? 0);
      return {
        canonical: Zt({ hours: h, minutes: m, seconds: g }),
        seconds: y,
        includeSeconds: g !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const { amLower: s, pmLower: a, periodPattern: l } = T(this, re, xl).call(this), u = r.match(
    new RegExp(
      `^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?\\s*(${l})$`,
      "i"
    )
  );
  if (u) {
    let h = Number(u[1]);
    const m = Number(u[2]), g = u[3] !== void 0 ? Number(u[3]) : void 0, y = u[4] ?? "", v = typeof y == "string" ? ((f = y.toLocaleLowerCase) == null ? void 0 : f.call(y)) ?? y.toLowerCase() : "";
    if (Number.isInteger(h) && h >= 1 && h <= 12 && Number.isInteger(m) && m >= 0 && m <= 59 && (g === void 0 || Number.isInteger(g) && g >= 0 && g <= 59) && (v === s || v === a || v === "am" || v === "pm")) {
      h = h % 12, (v === a || v === "pm") && (h += 12);
      const w = h * 3600 + m * 60 + (g ?? 0);
      return {
        canonical: Zt({ hours: h, minutes: m, seconds: g }),
        seconds: w,
        includeSeconds: g !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const d = Kd(r);
  if (d !== null) {
    const h = Math.floor(d / 3600), m = Math.floor(d % 3600 / 60), g = d % 60, y = g !== 0;
    return {
      canonical: Zt({
        hours: h,
        minutes: m,
        seconds: y ? g : void 0
      }),
      seconds: d,
      includeSeconds: y,
      error: null
    };
  }
  return { error: i };
}, "#parseInputTime"), Ml = /* @__PURE__ */ c(function() {
  const n = T(this, re, sf).call(this);
  if (!n) return "";
  if (Yn() === "24h")
    return n;
  const r = ba(n);
  if (!r) return n;
  const o = Number(r.hours), s = Number(r.minutes), a = r.seconds !== null && r.seconds !== void 0 ? Number(r.seconds) : void 0;
  if (!Number.isFinite(o) || !Number.isFinite(s)) return n;
  const l = Number.isFinite(a), u = o % 12 === 0 ? 12 : o % 12, d = String(s).padStart(2, "0"), f = l ? `:${String(a).padStart(2, "0")}` : "", { amLabel: h, pmLabel: m } = T(this, re, xl).call(this), g = o >= 12 ? m : h;
  return `${u}:${d}${f} ${g}`.trim();
}, "#getInitialEditValue"), xl = /* @__PURE__ */ c(function() {
  var u, d;
  const n = S("EIDOLON.TimeTrigger.TimePeriodAM", "AM"), i = S("EIDOLON.TimeTrigger.TimePeriodPM", "PM"), r = ((u = n.toLocaleLowerCase) == null ? void 0 : u.call(n)) ?? n.toLowerCase(), o = ((d = i.toLocaleLowerCase) == null ? void 0 : d.call(i)) ?? i.toLowerCase(), s = T(this, re, _l).call(this, n), a = T(this, re, _l).call(this, i), l = `${s}|${a}|AM|PM`;
  return {
    amLabel: n,
    pmLabel: i,
    amLower: r,
    pmLower: o,
    periodPattern: l
  };
}, "#getPeriodMatchData"), _l = /* @__PURE__ */ c(function(n) {
  return typeof n != "string" ? "" : n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}, "#escapeForRegex"), Ws = new WeakMap(), zs = new WeakMap(), Nl = /* @__PURE__ */ c(function() {
  const n = this.scene;
  if (!n || typeof n.getFlag != "function") return !1;
  try {
    return !!n.getFlag(L, pl);
  } catch (i) {
    _("TimeTriggerWindow | Failed to read scene real-time flag", {
      sceneId: (n == null ? void 0 : n.id) ?? null,
      message: (i == null ? void 0 : i.message) ?? String(i)
    });
  }
  return !1;
}, "#readSceneRealTimeFlag"), Ys = new WeakMap(), cf = /* @__PURE__ */ c(function() {
  if (typeof p(this, wi) == "function")
    try {
      p(this, wi).call(this);
    } catch (n) {
      console.error(`${L} | Failed to dispose time format subscription`, n);
    }
  I(this, wi, null);
}, "#disposeTimeFormatSubscription"), uf = /* @__PURE__ */ c(function() {
  if (typeof p(this, Ei) == "function")
    try {
      p(this, Ei).call(this);
    } catch (n) {
      console.error(`${L} | Failed to dispose manage time subscription`, n);
    }
  I(this, Ei, null);
}, "#disposeManageTimeSubscription"), c(bi, "TimeTriggerWindow"), ue(bi, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Le(bi, bi, "DEFAULT_OPTIONS"),
  {
    id: `${L}-time-trigger`,
    window: {
      title: S("EIDOLON.TimeTrigger.Title", "Time Trigger"),
      resizable: !1
    },
    position: {
      width: "auto",
      height: "auto"
    }
  },
  { inplace: !1 }
)), ue(bi, "PARTS", {
  content: {
    template: `modules/${L}/templates/time-trigger.html`
  }
});
let Ol = bi;
function va(t, e = {}) {
  if (typeof t != "function")
    throw new TypeError("createApplicationFactory requires a constructor function.");
  const n = /* @__PURE__ */ c(function(r = {}) {
    const o = foundry.utils.mergeObject(
      e ?? {},
      r ?? {},
      { inplace: !1 }
    );
    return new t(o);
  }, "applicationFactory");
  return n.__eidolonFactorySignature = "options", n.__eidolonFactoryTarget = t, n;
}
c(va, "createApplicationFactory");
const Fu = /* @__PURE__ */ new Set();
var Ie, et, Si, pr, df, ff;
const Eu = class Eu {
  constructor({ windowFactory: e } = {}) {
    A(this, pr);
    A(this, Ie, null);
    A(this, et, null);
    A(this, Si);
    const n = va(Ol);
    typeof e == "function" ? e.__eidolonFactorySignature === "options" ? I(this, Si, (r, o = {}) => e({ scene: r, ...o ?? {} })) : I(this, Si, e) : I(this, Si, /* @__PURE__ */ c((r, o = {}) => n({ scene: r, ...o ?? {} }), "fallbackFactory"));
  }
  onReady() {
    var n;
    const e = typeof ((n = game.time) == null ? void 0 : n.worldTime) == "number" && Number.isFinite(game.time.worldTime) ? game.time.worldTime : null;
    _("TimeTriggerManager#onReady", { worldTime: e }), e !== null && I(this, et, e);
  }
  onCanvasReady(e) {
    const n = (e == null ? void 0 : e.scene) ?? Ar();
    _("TimeTriggerManager#onCanvasReady", { sceneId: (n == null ? void 0 : n.id) ?? null }), this.refreshTimeTriggerWindow(n), this.handleTimeTriggerEvaluation(n);
  }
  onUpdateScene(e) {
    const n = Ar();
    _("TimeTriggerManager#onUpdateScene", {
      sceneId: (e == null ? void 0 : e.id) ?? null,
      activeSceneId: (n == null ? void 0 : n.id) ?? null
    }), !(!n || e.id !== n.id) && (this.refreshTimeTriggerWindow(e), this.handleTimeTriggerEvaluation(e));
  }
  onUpdateWorldTime(e, n) {
    _("TimeTriggerManager#onUpdateWorldTime", {
      worldTime: e,
      diff: n,
      hasWindow: !!p(this, Ie)
    }), p(this, Ie) && p(this, Ie).render();
    const i = Ar(), r = T(this, pr, df).call(this, e, n);
    this.handleTimeTriggerEvaluation(i, e, r);
  }
  refreshTimeTriggerWindow(e) {
    var l, u, d;
    if (!e) return;
    const n = !!((l = game.user) != null && l.isGM), i = !!e.getFlag(L, cs), r = !!e.getFlag(L, ml), o = !!e.getFlag(L, gl);
    if (_("TimeTriggerManager#refreshTimeTriggerWindow", {
      sceneId: e.id,
      isGM: n,
      isActive: i,
      hideWindow: r,
      showPlayerWindow: o
    }), !(i && !r && (n || o))) {
      p(this, Ie) && (_("Closing time trigger window", { reason: "not-visible" }), p(this, Ie).close({ force: !0 }), I(this, Ie, null));
      return;
    }
    const a = !!n;
    if (p(this, Ie) && ((u = p(this, Ie).scene) == null ? void 0 : u.id) === e.id) {
      _("Refreshing existing time trigger window", { sceneId: e.id }), p(this, Ie).showControls = a, p(this, Ie).render();
      return;
    }
    p(this, Ie) && (_("Closing existing window before creating new instance", {
      previousSceneId: ((d = p(this, Ie).scene) == null ? void 0 : d.id) ?? null
    }), p(this, Ie).close({ force: !0 })), I(this, Ie, p(this, Si).call(this, e, { showControls: a })), _("Rendering new time trigger window", { sceneId: e.id }), p(this, Ie).render({ force: !0 });
  }
  async handleTimeTriggerEvaluation(e, n, i) {
    var l;
    const r = e ?? Ar();
    if (!r) {
      _("handleTimeTriggerEvaluation skipped", {
        reason: "no-active-scene",
        providedSceneId: (e == null ? void 0 : e.id) ?? null,
        currentWorldTime: n
      }), typeof n == "number" && Number.isFinite(n) && I(this, et, n);
      return;
    }
    const o = typeof n == "number" && Number.isFinite(n) ? n : typeof ((l = game.time) == null ? void 0 : l.worldTime) == "number" ? game.time.worldTime : null;
    if (o === null) return;
    const s = typeof i == "number" && Number.isFinite(i) ? i : null, a = s !== null ? s : typeof p(this, et) == "number" && Number.isFinite(p(this, et)) ? p(this, et) : o;
    ur("handleTimeTriggerEvaluation", {
      sceneId: r.id,
      previousWorldTime: a,
      currentWorldTime: o,
      overrideProvided: s !== null
    });
    try {
      await T(this, pr, ff).call(this, r, a, o);
    } catch (u) {
      console.error(`${L} | Unexpected error while evaluating time triggers`, u), _("handleTimeTriggerEvaluation error", { message: (u == null ? void 0 : u.message) ?? String(u) });
    } finally {
      I(this, et, o), zn();
    }
  }
};
Ie = new WeakMap(), et = new WeakMap(), Si = new WeakMap(), pr = new WeakSet(), df = /* @__PURE__ */ c(function(e, n) {
  return typeof p(this, et) == "number" && Number.isFinite(p(this, et)) ? (_("Resolved previous world time from cache", {
    previousWorldTime: p(this, et)
  }), p(this, et)) : typeof e == "number" && Number.isFinite(e) && typeof n == "number" && Number.isFinite(n) ? (_("Resolved previous world time using diff", {
    worldTime: e,
    diff: n,
    resolved: e - n
  }), e - n) : typeof e == "number" && Number.isFinite(e) ? e : null;
}, "#resolvePreviousWorldTime"), ff = /* @__PURE__ */ c(async function(e, n, i) {
  var g, y, v;
  if (!((g = game.user) != null && g.isGM)) {
    _("Skipping trigger evaluation because user is not a GM");
    return;
  }
  if (!(e != null && e.id)) {
    _("Skipping trigger evaluation because the scene is missing an id");
    return;
  }
  if (!!!e.getFlag(L, cs)) {
    _("Skipping trigger evaluation because scene is inactive", { sceneId: e.id });
    return;
  }
  if (typeof i != "number" || !Number.isFinite(i)) return;
  (typeof n != "number" || !Number.isFinite(n)) && (n = i);
  const o = nr(e);
  if (!o.length) {
    _("No time triggers configured for scene", { sceneId: e.id });
    return;
  }
  const s = gg(e), a = /* @__PURE__ */ new Set();
  for (const b of o)
    b != null && b.id && a.add(b.id);
  let l = !1;
  for (const b of Object.keys(s))
    a.has(b) || (delete s[b], l = !0);
  if (ur("Evaluating scene time triggers", {
    sceneId: e.id,
    previousWorldTime: n,
    currentWorldTime: i,
    triggerCount: o.length
  }), i <= n) {
    _("Detected world time rewind", {
      previousWorldTime: n,
      currentWorldTime: i
    });
    for (const b of o) {
      if (!(b != null && b.id) || !b.allowReplayOnRewind) continue;
      const w = s[b.id];
      typeof w == "number" ? i < w ? (_("Clearing trigger history due to rewind", {
        triggerId: b.id,
        lastFired: w,
        currentWorldTime: i
      }), delete s[b.id], l = !0) : _("Preserving trigger history after rewind", {
        triggerId: b.id,
        lastFired: w,
        currentWorldTime: i
      }) : _("No history stored for rewind-enabled trigger", {
        triggerId: b.id
      });
    }
    l && (_("Persisting history cleanup after rewind", {
      sceneId: e.id
    }), await Ga(e, s)), zn();
    return;
  }
  const u = n, d = i, f = [], h = Math.floor(u / tr), m = Math.floor(d / tr);
  for (const b of o) {
    if (!(b != null && b.id)) continue;
    const w = Kd(b.time);
    if (w === null) {
      Og(e, b), _("Skipping trigger with invalid time", {
        triggerId: b.id,
        time: b.time
      });
      continue;
    }
    for (let E = h; E <= m; E++) {
      const C = E * tr + w;
      if (C < u || C > d) continue;
      const k = s[b.id];
      if (typeof k == "number" && k >= C) {
        _("Skipping trigger because it already fired within window", {
          triggerId: b.id,
          lastFired: k,
          absoluteTime: C
        });
        continue;
      }
      f.push({ trigger: b, absoluteTime: C });
    }
  }
  if (!f.length) {
    l && await Ga(e, s), _("No triggers scheduled to fire within evaluation window", {
      sceneId: e.id
    }), zn();
    return;
  }
  f.sort((b, w) => b.absoluteTime - w.absoluteTime), _("Queued triggers for execution", {
    entries: f.map((b) => ({
      triggerId: b.trigger.id,
      absoluteTime: b.absoluteTime
    }))
  });
  for (const b of f)
    try {
      _("Executing time trigger action", {
        triggerId: b.trigger.id,
        absoluteTime: b.absoluteTime
      }), await nf(e, b.trigger);
    } catch (w) {
      console.error(`${L} | Failed to execute time trigger action`, w), (v = (y = ui.notifications) == null ? void 0 : y.error) == null || v.call(
        y,
        S(
          "EIDOLON.TimeTrigger.TriggerActionError",
          "Failed to execute a scene time trigger action. Check the console for details."
        )
      ), _("Trigger execution failed", {
        triggerId: b.trigger.id,
        message: (w == null ? void 0 : w.message) ?? String(w)
      });
    } finally {
      s[b.trigger.id] = b.absoluteTime, l = !0, _("Recorded trigger execution", {
        triggerId: b.trigger.id,
        absoluteTime: b.absoluteTime
      });
    }
  l && (_("Persisting trigger history updates", { sceneId: e.id }), await Ga(e, s)), zn();
}, "#evaluateSceneTimeTriggers"), c(Eu, "TimeTriggerManager");
let $l = Eu;
function Og(t, e) {
  var r, o;
  const n = `${(t == null ? void 0 : t.id) ?? "unknown"}:${(e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.time) ?? "unknown"}`;
  if (Fu.has(n)) return;
  Fu.add(n);
  const i = S(
    "EIDOLON.TimeTrigger.InvalidTimeWarning",
    "A scene time trigger has an invalid time value and was skipped."
  );
  (o = (r = ui.notifications) == null ? void 0 : r.warn) == null || o.call(r, i), console.warn(`${L} | Invalid time for trigger`, { scene: t == null ? void 0 : t.id, trigger: e });
}
c(Og, "warnInvalidTriggerTime");
var Mt, oo, xt, Nn, Ci, Kt, sr, Ks, Xs, so, ao, Ti, Xt, G, Dl, Vi, Go, Pl, Wo, Rl, zt, hf, Hl, mf, ql, gf, Js, Qs, Zs, ea, ta, na, Bl, pf, zo, ia, ra;
const Su = class Su {
  constructor() {
    A(this, G);
    A(this, Mt, !1);
    A(this, oo, Lo);
    A(this, xt, /* @__PURE__ */ new Map());
    A(this, Nn, null);
    A(this, Ci, null);
    A(this, Kt, 0);
    A(this, sr, null);
    A(this, Ks, null);
    A(this, Xs, null);
    A(this, so, !1);
    A(this, ao, !1);
    A(this, Ti, !1);
    A(this, Xt, !1);
    A(this, Js, /* @__PURE__ */ c((e, n = {}) => {
      _("GameTimeAutomation | Pause state changed", {
        paused: e,
        userId: (n == null ? void 0 : n.userId) ?? null,
        broadcast: (n == null ? void 0 : n.broadcast) ?? null
      }), T(this, G, zt).call(this, { pausedOverride: e });
    }, "#handlePause"));
    A(this, Qs, /* @__PURE__ */ c((e) => {
      e != null && e.id && (p(this, xt).set(e.id, Math.max(e.round ?? 0, 1)), _("GameTimeAutomation | Combat started", { combatId: e.id, round: e.round ?? 0 }), T(this, G, zt).call(this));
    }, "#handleCombatStart"));
    A(this, Zs, /* @__PURE__ */ c((e, n) => {
      if (!(e != null && e.id)) return;
      const i = typeof n == "number" && Number.isFinite(n) ? n : typeof e.round == "number" && Number.isFinite(e.round) ? e.round : 0, r = i > 0 ? i : 1, o = p(this, xt).get(e.id), s = o ? Math.max(o, 1) : 1, a = r > 1 ? Math.max(r - s, 0) : 0;
      if (_("GameTimeAutomation | Combat round change detected", {
        combatId: e.id,
        effectiveRound: r,
        completedRounds: a,
        enabled: p(this, Mt),
        paused: (game == null ? void 0 : game.paused) ?? null
      }), a > 0 && p(this, Mt) && p(this, Xt) && !(game != null && game.paused) && T(this, G, Vi).call(this) && T(this, G, Go).call(this, e)) {
        const l = a * p(this, oo);
        l > 0 && (_("GameTimeAutomation | Advancing time for completed combat rounds", {
          combatId: e.id,
          completedRounds: a,
          delta: l
        }), T(this, G, ql).call(this, l));
      }
      p(this, xt).set(e.id, Math.max(r, 1));
    }, "#handleCombatRound"));
    A(this, ea, /* @__PURE__ */ c((e) => {
      e != null && e.id && (p(this, xt).delete(e.id), _("GameTimeAutomation | Combat ended", { combatId: e.id }), T(this, G, zt).call(this));
    }, "#handleCombatEnd"));
    A(this, ta, /* @__PURE__ */ c((e) => {
      e != null && e.id && (p(this, xt).delete(e.id), _("GameTimeAutomation | Combat deleted", { combatId: e.id }), T(this, G, zt).call(this));
    }, "#handleCombatDelete"));
    A(this, na, /* @__PURE__ */ c((e, n) => {
      if (e != null && e.id) {
        if (typeof (n == null ? void 0 : n.round) == "number" && Number.isFinite(n.round)) {
          const i = Math.max(n.round, 1);
          p(this, xt).set(e.id, i), _("GameTimeAutomation | Combat round manually updated", {
            combatId: e.id,
            round: i
          });
        }
        (Object.prototype.hasOwnProperty.call(n ?? {}, "active") || (n == null ? void 0 : n.round) !== void 0) && T(this, G, zt).call(this);
      }
    }, "#handleCombatUpdate"));
    A(this, ia, /* @__PURE__ */ c((e) => {
      T(this, G, zo).call(this, e == null ? void 0 : e.scene), T(this, G, zt).call(this);
    }, "#handleCanvasReady"));
    A(this, ra, /* @__PURE__ */ c((e) => {
      if (!Qe(e)) return;
      const n = T(this, G, Bl).call(this);
      if (!n || n.id !== e.id) return;
      T(this, G, zo).call(this, e) && T(this, G, zt).call(this);
    }, "#handleSceneUpdate"));
  }
  registerHooks() {
    p(this, so) || (I(this, so, !0), Hooks.on("pauseGame", p(this, Js)), Hooks.on("combatStart", p(this, Qs)), Hooks.on("combatRound", p(this, Zs)), Hooks.on("combatEnd", p(this, ea)), Hooks.on("deleteCombat", p(this, ta)), Hooks.on("updateCombat", p(this, na)), Hooks.on("canvasReady", p(this, ia)), Hooks.on("updateScene", p(this, ra)));
  }
  initialize() {
    p(this, ao) || (I(this, ao, !0), I(this, Ks, Qd((e) => {
      const n = !!e, i = n !== p(this, Mt);
      I(this, Mt, n), _("GameTimeAutomation | Manage time toggled", { enabled: n }), i && n && T(this, G, Rl).call(this), T(this, G, zt).call(this);
    })), I(this, Xs, fg((e) => {
      I(this, oo, e), _("GameTimeAutomation | Seconds per round updated", { value: e });
    })), T(this, G, Rl).call(this), T(this, G, zo).call(this), T(this, G, zt).call(this));
  }
};
Mt = new WeakMap(), oo = new WeakMap(), xt = new WeakMap(), Nn = new WeakMap(), Ci = new WeakMap(), Kt = new WeakMap(), sr = new WeakMap(), Ks = new WeakMap(), Xs = new WeakMap(), so = new WeakMap(), ao = new WeakMap(), Ti = new WeakMap(), Xt = new WeakMap(), G = new WeakSet(), Dl = /* @__PURE__ */ c(function() {
  var e;
  try {
    if (typeof ((e = globalThis.performance) == null ? void 0 : e.now) == "function")
      return globalThis.performance.now();
  } catch (n) {
    _("GameTimeAutomation | Failed to read high-resolution timestamp", {
      message: (n == null ? void 0 : n.message) ?? String(n)
    });
  }
  return Date.now();
}, "#currentTimestamp"), Vi = /* @__PURE__ */ c(function() {
  var e;
  return !!((e = game == null ? void 0 : game.user) != null && e.isGM && game.user.active !== !1);
}, "#canControlTime"), Go = /* @__PURE__ */ c(function(e) {
  var i, r;
  if (!e) return !1;
  if (e.active === !0) return !0;
  if (e.active === !1) return !1;
  const n = (i = game == null ? void 0 : game.combats) == null ? void 0 : i.active;
  return (n == null ? void 0 : n.id) === e.id ? !0 : ((r = game == null ? void 0 : game.combat) == null ? void 0 : r.id) === e.id ? game.combat.active ?? !0 : !1;
}, "#isCombatDocumentActive"), Pl = /* @__PURE__ */ c(function(e) {
  return e ? typeof e.started == "boolean" ? e.started : (e.round ?? 0) > 0 : !1;
}, "#hasCombatStarted"), Wo = /* @__PURE__ */ c(function() {
  var i;
  const e = Array.isArray((i = game == null ? void 0 : game.combats) == null ? void 0 : i.contents) ? game.combats.contents : [];
  for (const r of e)
    if (T(this, G, Go).call(this, r) && T(this, G, Pl).call(this, r))
      return !0;
  const n = game == null ? void 0 : game.combat;
  return !!(n && T(this, G, Go).call(this, n) && T(this, G, Pl).call(this, n));
}, "#isCombatRunning"), Rl = /* @__PURE__ */ c(function() {
  var n;
  p(this, xt).clear();
  const e = Array.isArray((n = game == null ? void 0 : game.combats) == null ? void 0 : n.contents) ? game.combats.contents : [];
  for (const i of e)
    i != null && i.id && p(this, xt).set(i.id, Math.max(i.round ?? 0, 1));
}, "#hydrateRoundTracking"), zt = /* @__PURE__ */ c(function({ pausedOverride: e } = {}) {
  const n = typeof e == "boolean" ? e : !!(game != null && game.paused), i = p(this, Mt), r = p(this, Xt), o = i && r, s = {
    manageTimeEnabled: i,
    sceneAllowsRealTime: r,
    effectiveEnabled: o,
    paused: n,
    canControl: T(this, G, Vi).call(this),
    combatRunning: T(this, G, Wo).call(this),
    overrideApplied: typeof e == "boolean"
  };
  if (_("GameTimeAutomation | Sync running state", s), !o || !T(this, G, Vi).call(this)) {
    T(this, G, Hl).call(this);
    return;
  }
  T(this, G, hf).call(this);
}, "#syncRunningState"), hf = /* @__PURE__ */ c(function() {
  p(this, Nn) === null && (I(this, Ci, T(this, G, Dl).call(this)), I(this, Nn, globalThis.setInterval(() => T(this, G, mf).call(this), 1e3)), _("GameTimeAutomation | Started real-time ticker"));
}, "#startRealTimeTicker"), Hl = /* @__PURE__ */ c(function() {
  p(this, Nn) !== null && (globalThis.clearInterval(p(this, Nn)), I(this, Nn, null), _("GameTimeAutomation | Stopped real-time ticker")), I(this, Ci, null), I(this, Kt, 0), I(this, Ti, !1);
}, "#stopRealTimeTicker"), mf = /* @__PURE__ */ c(function() {
  if (!p(this, Mt) || !p(this, Xt) || !T(this, G, Vi).call(this)) {
    T(this, G, Hl).call(this);
    return;
  }
  const e = T(this, G, Dl).call(this);
  if (typeof e != "number" || !Number.isFinite(e)) return;
  const n = p(this, Ci) ?? e, i = (e - n) / 1e3;
  if (I(this, Ci, e), !Number.isFinite(i) || i <= 0) return;
  const r = !!(game != null && game.paused), o = T(this, G, Wo).call(this);
  if (r || o) {
    p(this, Ti) || _("GameTimeAutomation | Tick skipped", { paused: r, combatRunning: o }), I(this, Ti, !0), I(this, Kt, 0);
    return;
  }
  I(this, Ti, !1), _("GameTimeAutomation | Real-time tick", { deltaSeconds: i }), T(this, G, ql).call(this, i);
}, "#tickRealTime"), ql = /* @__PURE__ */ c(function(e) {
  if (!p(this, Mt) || !p(this, Xt)) return;
  const n = Number(e);
  !Number.isFinite(n) || n <= 0 || (I(this, Kt, p(this, Kt) + n), !p(this, sr) && I(this, sr, T(this, G, gf).call(this)));
}, "#queueAdvance"), gf = /* @__PURE__ */ c(async function() {
  var e, n;
  for (; p(this, Kt) > 0; ) {
    if (!p(this, Mt) || !p(this, Xt) || game != null && game.paused || !T(this, G, Vi).call(this) || T(this, G, Wo).call(this)) {
      I(this, Kt, 0);
      break;
    }
    const i = p(this, Kt);
    I(this, Kt, 0);
    try {
      if (typeof ((e = game == null ? void 0 : game.time) == null ? void 0 : e.advance) == "function")
        _("GameTimeAutomation | Advancing world time", { delta: i }), await game.time.advance(i), _("GameTimeAutomation | World time advanced", {
          worldTime: ((n = game.time) == null ? void 0 : n.worldTime) ?? null
        });
      else {
        console.warn(`${L} | game.time.advance is unavailable; cannot manage world time.`);
        break;
      }
    } catch (r) {
      console.error(`${L} | Failed to advance world time`, r);
      break;
    }
  }
  I(this, sr, null);
}, "#flushAdvanceQueue"), Js = new WeakMap(), Qs = new WeakMap(), Zs = new WeakMap(), ea = new WeakMap(), ta = new WeakMap(), na = new WeakMap(), Bl = /* @__PURE__ */ c(function() {
  const e = Ar();
  return Qe(e) ? e : null;
}, "#getActiveSceneDocument"), pf = /* @__PURE__ */ c(function(e) {
  if (!Qe(e)) return !1;
  try {
    return !!e.getFlag(L, pl);
  } catch (n) {
    return _("GameTimeAutomation | Failed to read scene real-time flag", {
      sceneId: (e == null ? void 0 : e.id) ?? null,
      message: (n == null ? void 0 : n.message) ?? String(n)
    }), !1;
  }
}, "#isSceneRealTimeAllowed"), zo = /* @__PURE__ */ c(function(e) {
  const n = Qe(e) ? e : T(this, G, Bl).call(this), i = T(this, G, pf).call(this, n), r = p(this, Xt);
  return I(this, Xt, i), r !== i ? (_("GameTimeAutomation | Scene real-time allowance changed", {
    sceneId: (n == null ? void 0 : n.id) ?? null,
    allows: i
  }), !0) : !1;
}, "#refreshSceneAutomationState"), ia = new WeakMap(), ra = new WeakMap(), c(Su, "GameTimeAutomation");
let Fl = Su;
var qd, $n, je, Li, pn, oa, Te, yf, bf, vf, wf, sa, Ul, aa, Ef, la, Sf, Cf;
const fn = class fn extends sn(on) {
  constructor(n = {}) {
    const { scene: i, trigger: r, triggerIndex: o, onSave: s, ...a } = n ?? {};
    super(a);
    A(this, Te);
    A(this, $n, null);
    A(this, je, null);
    A(this, Li, null);
    A(this, pn, null);
    A(this, oa, /* @__PURE__ */ c(() => {
      (this.rendered ?? this.isRendered ?? !1) && (I(this, pn, T(this, Te, yf).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    A(this, sa, /* @__PURE__ */ c((n) => {
      var o, s;
      const i = n.currentTarget, r = i == null ? void 0 : i.closest("form");
      r && (_("Trigger action selection changed", {
        sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
        triggerId: ((s = this.trigger) == null ? void 0 : s.id) ?? null,
        actionId: (i == null ? void 0 : i.value) ?? null
      }), T(this, Te, Ul).call(this, i.value, r));
    }, "#onActionSelectChange"));
    A(this, aa, /* @__PURE__ */ c((n) => {
      var u, d, f, h;
      n.preventDefault();
      const i = n.currentTarget, r = i == null ? void 0 : i.closest("form");
      if (!r) return;
      const o = (u = i.dataset) == null ? void 0 : u.target;
      if (!o) return;
      const s = typeof (CSS == null ? void 0 : CSS.escape) == "function" ? CSS.escape : (m) => m, a = r.querySelector(`[name="${s(o)}"]`);
      if (!a) return;
      _("Opening file picker for trigger", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        triggerId: ((f = this.trigger) == null ? void 0 : f.id) ?? null,
        target: o
      }), new FilePicker({
        type: ((h = i.dataset) == null ? void 0 : h.type) || "audio",
        current: a.value,
        callback: /* @__PURE__ */ c((m) => {
          var g, y;
          a.value = m, a.dispatchEvent(new Event("change")), _("Trigger form file selected", {
            sceneId: ((g = this.scene) == null ? void 0 : g.id) ?? null,
            triggerId: ((y = this.trigger) == null ? void 0 : y.id) ?? null,
            target: o,
            path: m
          });
        }, "callback")
      }).render({ force: !0 });
    }, "#onFilePicker"));
    A(this, la, /* @__PURE__ */ c(async (n) => {
      var r, o;
      n.preventDefault();
      const i = n.currentTarget;
      i instanceof HTMLFormElement && (_("Trigger form submitted", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null,
        triggerId: ((o = this.trigger) == null ? void 0 : o.id) ?? null
      }), await T(this, Te, Sf).call(this, i));
    }, "#onSubmit"));
    this.scene = i ?? null, this.trigger = r ?? null, this.triggerIndex = Number.isInteger(o) ? Number(o) : null, this.onSave = typeof s == "function" ? s : null, I(this, Li, Wc(p(this, oa)));
  }
  async _prepareContext() {
    var n, i;
    ur("TriggerFormApplication#_prepareContext", {
      sceneId: ((n = this.scene) == null ? void 0 : n.id) ?? null,
      triggerId: ((i = this.trigger) == null ? void 0 : i.id) ?? null,
      triggerIndex: this.triggerIndex
    });
    try {
      const r = this.trigger ?? { action: Vo, data: {} }, o = r.action ?? Vo, s = $u(r.time), a = s.format ?? "12h", l = a === "12h" ? Ig() : [], u = s.period ?? (l.length > 0 ? l[0].value : null), d = a === "12h" ? l.map((m) => ({
        ...m,
        selected: m.value === u
      })) : [], f = Nu().map((m) => ({
        id: m.id,
        label: typeof m.label == "function" ? m.label() : m.label,
        selected: m.id === o
      })), h = Nu().map((m) => {
        const g = m.id === r.action ? r : { ...r, action: m.id }, y = vg(g);
        return y ? {
          id: m.id,
          visible: m.id === o,
          content: y
        } : null;
      }).filter(Boolean);
      return {
        timeValue: s.canonical ?? "",
        timeHourValue: s.hour ?? "",
        timeMinuteValue: s.minute ?? "",
        timePeriodValue: u ?? "",
        timeFormat: a,
        is12HourFormat: a === "12h",
        is24HourFormat: a === "24h",
        timePeriodOptions: d,
        actions: f,
        actionSections: h,
        allowReplayOnRewind: !!r.allowReplayOnRewind,
        labels: {
          time: S("EIDOLON.TimeTrigger.TriggerTime", "Trigger Time"),
          hour: S("EIDOLON.TimeTrigger.TriggerTimeHour", "Hour"),
          minute: S("EIDOLON.TimeTrigger.TriggerTimeMinute", "Minute"),
          period: S("EIDOLON.TimeTrigger.TriggerTimePeriod", "AM / PM"),
          action: S("EIDOLON.TimeTrigger.TriggerAction", "Action"),
          allowReplayOnRewind: S(
            "EIDOLON.TimeTrigger.AllowReplayOnRewind",
            "Allow replay after rewinding time"
          ),
          allowReplayOnRewindHint: S(
            "EIDOLON.TimeTrigger.AllowReplayOnRewindHint",
            "When enabled, this trigger can fire again if world time moves backward."
          ),
          save: S("EIDOLON.TimeTrigger.TriggerSave", "Save Trigger")
        }
      };
    } finally {
      zn();
    }
  }
  _onRender(n, i) {
    var l, u, d;
    super._onRender(n, i);
    const r = this.element;
    if (!r) return;
    _("Trigger form rendered", {
      sceneId: ((l = this.scene) == null ? void 0 : l.id) ?? null,
      triggerId: ((u = this.trigger) == null ? void 0 : u.id) ?? null
    });
    const o = Array.from(((d = document == null ? void 0 : document.body) == null ? void 0 : d.classList) ?? []).find(
      (f) => f.startsWith("theme-")
    );
    o && r.classList.add(o);
    const s = r.querySelector("form");
    if (!s) return;
    T(this, Te, Ef).call(this, s), T(this, Te, bf).call(this, s), s.addEventListener("submit", p(this, la));
    const a = s.querySelector("[data-action-select]");
    a && (a.addEventListener("change", p(this, sa)), T(this, Te, Ul).call(this, a.value, s)), s.querySelectorAll("[data-action-file-picker]").forEach((f) => {
      f.addEventListener("click", p(this, aa));
    });
  }
  async close(n = {}) {
    var i;
    if ((i = p(this, $n)) == null || i.call(this), I(this, $n, null), I(this, je, null), I(this, pn, null), typeof p(this, Li) == "function")
      try {
        p(this, Li).call(this);
      } catch (r) {
        console.error(`${L} | Failed to dispose trigger form time format subscription`, r);
      }
    return I(this, Li, null), super.close(n);
  }
};
$n = new WeakMap(), je = new WeakMap(), Li = new WeakMap(), pn = new WeakMap(), oa = new WeakMap(), Te = new WeakSet(), yf = /* @__PURE__ */ c(function() {
  var a, l, u, d, f, h, m;
  const n = (l = (a = this.element) == null ? void 0 : a.querySelector) == null ? void 0 : l.call(a, "form");
  if (!(n instanceof HTMLFormElement)) return null;
  const i = Array.from(n.elements ?? []), r = [];
  for (const g of i)
    if ((g instanceof HTMLInputElement || g instanceof HTMLSelectElement || g instanceof HTMLTextAreaElement) && g.name && !(((u = g.dataset) == null ? void 0 : u.timeHidden) !== void 0 || ((d = g.dataset) == null ? void 0 : d.timeHour) !== void 0 || ((f = g.dataset) == null ? void 0 : f.timeMinute) !== void 0 || ((h = g.dataset) == null ? void 0 : h.timePeriod) !== void 0)) {
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
          values: Array.from(g.selectedOptions ?? []).map((y) => y.value)
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
  let s = null;
  if (o instanceof HTMLElement) {
    const g = o.querySelector("[data-time-hidden]"), y = o.querySelector("[data-time-hour]"), v = o.querySelector("[data-time-minute]"), b = o.querySelector("[data-time-period]");
    s = {
      format: ((m = o.dataset) == null ? void 0 : m.timeFormat) ?? null,
      canonical: g instanceof HTMLInputElement ? g.value : "",
      hour: y instanceof HTMLInputElement ? y.value : "",
      minute: v instanceof HTMLInputElement ? v.value : "",
      period: b instanceof HTMLSelectElement ? b.value : ""
    };
  }
  return {
    fields: r,
    time: s
  };
}, "#captureFormState"), bf = /* @__PURE__ */ c(function(n) {
  if (!p(this, pn)) return;
  if (!(n instanceof HTMLFormElement)) {
    I(this, pn, null);
    return;
  }
  const { fields: i = [], time: r = null } = p(this, pn) ?? {};
  I(this, pn, null), T(this, Te, vf).call(this, n, i), T(this, Te, wf).call(this, n, r);
}, "#restorePendingFormState"), vf = /* @__PURE__ */ c(function(n, i) {
  if (!Array.isArray(i) || i.length === 0) return;
  const r = typeof (CSS == null ? void 0 : CSS.escape) == "function" ? CSS.escape : (o) => o;
  for (const o of i) {
    if (!o || typeof o.name != "string") continue;
    const s = r(o.name);
    if (o.kind === "checkbox" || o.kind === "radio") {
      const l = `input[type="${o.kind}"][name="${s}"]`, u = n.querySelectorAll(l);
      u.forEach((d) => {
        d instanceof HTMLInputElement && (u.length === 1 || d.value === o.value) && (d.checked = !!o.checked);
      });
      continue;
    }
    if (o.kind === "select-multiple") {
      const l = n.querySelector(`select[name="${s}"]`);
      if (!(l instanceof HTMLSelectElement)) continue;
      const u = new Set(Array.isArray(o.values) ? o.values : []);
      Array.from(l.options ?? []).forEach((d) => {
        d.selected = u.has(d.value);
      });
      continue;
    }
    const a = n.querySelector(`[name="${s}"]`);
    (a instanceof HTMLInputElement || a instanceof HTMLSelectElement || a instanceof HTMLTextAreaElement) && (a.value = o.value ?? "");
  }
}, "#restoreFieldValues"), wf = /* @__PURE__ */ c(function(n, i) {
  var w, E, C;
  const r = n.querySelector("[data-time-format]");
  if (!(r instanceof HTMLElement)) {
    typeof p(this, je) == "function" && p(this, je).call(this);
    return;
  }
  const o = ((w = r.dataset) == null ? void 0 : w.timeFormat) === "24h" ? "24h" : "12h", s = r.querySelector("[data-time-hour]"), a = r.querySelector("[data-time-minute]"), l = r.querySelector("[data-time-period]"), u = r.querySelector("[data-time-hidden]");
  if (!i) {
    if (s instanceof HTMLInputElement && (s.value = ""), a instanceof HTMLInputElement && (a.value = ""), l instanceof HTMLSelectElement) {
      const O = ((C = (E = l.options) == null ? void 0 : E[0]) == null ? void 0 : C.value) ?? "";
      l.value = O;
    }
    u instanceof HTMLInputElement && (u.value = ""), typeof p(this, je) == "function" && p(this, je).call(this);
    return;
  }
  const d = typeof i.canonical == "string" ? i.canonical : "", f = typeof i.period == "string" ? i.period : "", h = typeof i.hour == "string" ? i.hour : "", m = typeof i.minute == "string" ? i.minute : "";
  let g = "", y = "", v = f, b = d;
  if (d) {
    const O = $u(d, o);
    g = O.hour ?? "", y = O.minute ?? "", b = O.canonical ?? d, o === "12h" ? v = O.period ?? f : v = "";
  } else
    g = h, y = m, o !== "12h" && (v = "");
  if (s instanceof HTMLInputElement && (s.value = g ?? ""), a instanceof HTMLInputElement && (a.value = y ?? ""), l instanceof HTMLSelectElement)
    if (o === "12h") {
      const O = Array.from(l.options ?? []);
      O.find((x) => x.value === v) ? l.value = v : O.length > 0 ? l.value = O[0].value : l.value = "";
    } else
      l.value = "";
  u instanceof HTMLInputElement && (u.value = b ?? ""), typeof p(this, je) == "function" && p(this, je).call(this);
}, "#restoreTimeInputs"), sa = new WeakMap(), Ul = /* @__PURE__ */ c(function(n, i) {
  i && i.querySelectorAll("[data-action-config]").forEach((r) => {
    const o = r.dataset.actionConfig === n;
    r.style.display = o ? "" : "none";
  });
}, "#updateActionSections"), aa = new WeakMap(), Ef = /* @__PURE__ */ c(function(n) {
  var f, h, m, g;
  if ((f = p(this, $n)) == null || f.call(this), I(this, $n, null), I(this, je, null), !(n instanceof HTMLFormElement)) return;
  const i = n.querySelector("[data-time-format]"), r = ((h = i == null ? void 0 : i.dataset) == null ? void 0 : h.timeFormat) ?? null;
  if (r !== "12h" && r !== "24h")
    return;
  const o = i.querySelector("[data-time-hidden]"), s = i.querySelector("[data-time-hour]"), a = i.querySelector("[data-time-minute]"), l = r === "12h" ? i.querySelector("[data-time-period]") : null;
  if (!o || !s || !a || r === "12h" && !l) {
    _("Trigger form time inputs missing elements", {
      format: r,
      hasHidden: !!o,
      hasHour: !!s,
      hasMinute: !!a,
      hasPeriod: !!l
    });
    return;
  }
  const u = [s, a, ...l ? [l] : []], d = /* @__PURE__ */ c(() => {
    const { canonical: y, error: v } = Lg(
      {
        hour: s.value,
        minute: a.value,
        period: (l == null ? void 0 : l.value) ?? null,
        time: o.value
      },
      r
    );
    o.value = y ?? "";
    const b = v ?? "";
    o.setCustomValidity(b), u.forEach((w) => {
      w.setCustomValidity(b);
    });
  }, "update");
  u.forEach((y) => {
    y.addEventListener("input", d), y.addEventListener("change", d);
  }), d(), I(this, $n, () => {
    u.forEach((y) => {
      y.removeEventListener("input", d), y.removeEventListener("change", d);
    });
  }), I(this, je, d), _("Trigger form configured for time input", {
    format: r,
    sceneId: ((m = this.scene) == null ? void 0 : m.id) ?? null,
    triggerId: ((g = this.trigger) == null ? void 0 : g.id) ?? null
  });
}, "#setupTimeInput"), la = new WeakMap(), Sf = /* @__PURE__ */ c(async function(n) {
  var o, s, a, l, u;
  if (typeof p(this, je) == "function" && p(this, je).call(this), typeof n.checkValidity == "function" && !n.checkValidity()) {
    typeof n.reportValidity == "function" && n.reportValidity(), _("Trigger form submission blocked by validity check", {
      sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
      triggerId: ((s = this.trigger) == null ? void 0 : s.id) ?? null
    });
    return;
  }
  const i = new FormData(n), r = Object.fromEntries(i.entries());
  delete r.timeHour, delete r.timeMinute, delete r.timePeriod, r.allowReplayOnRewind = ((a = n.querySelector('input[name="allowReplayOnRewind"]')) == null ? void 0 : a.checked) ?? !1, _("Processing trigger form submission", {
    sceneId: ((l = this.scene) == null ? void 0 : l.id) ?? null,
    triggerId: ((u = this.trigger) == null ? void 0 : u.id) ?? null,
    allowReplayOnRewind: r.allowReplayOnRewind
  }), await T(this, Te, Cf).call(this, r), await this.close();
}, "#handleSubmit"), Cf = /* @__PURE__ */ c(async function(n) {
  var o, s, a, l, u, d;
  const i = {
    id: ((o = this.trigger) == null ? void 0 : o.id) ?? sg(),
    time: n.time ?? "",
    action: n.action ?? Vo,
    allowReplayOnRewind: !!n.allowReplayOnRewind,
    data: {}
  };
  _("Persisting trigger from form", {
    sceneId: ((s = this.scene) == null ? void 0 : s.id) ?? null,
    triggerId: i.id,
    existingIndex: this.triggerIndex
  }), wg(i, n);
  const r = nr(this.scene);
  this.triggerIndex !== null && r[this.triggerIndex] ? r[this.triggerIndex] = i : r.push(i);
  try {
    await tf(this.scene, r), _("Trigger list saved", {
      sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
      triggerCount: r.length
    });
  } catch (f) {
    throw console.error(`${L} | Failed to save time trigger`, f), (u = (l = ui.notifications) == null ? void 0 : l.error) == null || u.call(
      l,
      S(
        "EIDOLON.TimeTrigger.TriggerSaveError",
        "Failed to save the scene's time triggers."
      )
    ), f;
  }
  if (this.onSave)
    try {
      this.onSave(r);
    } catch (f) {
      console.error(`${L} | Trigger onSave callback failed`, f), _("Trigger onSave callback failed", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        message: (f == null ? void 0 : f.message) ?? String(f)
      });
    }
}, "#persistTrigger"), c(fn, "TriggerFormApplication"), ue(fn, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Le(fn, fn, "DEFAULT_OPTIONS"),
  {
    id: `${L}-trigger-form`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((qd = Le(fn, fn, "DEFAULT_OPTIONS")) == null ? void 0 : qd.classes) ?? [], "standard-form", "themed"])
    ),
    window: {
      title: S("EIDOLON.TimeTrigger.TriggerFormTitle", "Configure Time Trigger"),
      resizable: !1
    },
    position: {
      width: 400,
      height: "auto"
    }
  },
  { inplace: !1 }
)), ue(fn, "PARTS", {
  content: {
    template: `modules/${L}/templates/time-trigger-form.html`
  }
});
let jl = fn;
function qe(t) {
  return t instanceof HTMLElement ? t : (t == null ? void 0 : t[0]) instanceof HTMLElement ? t[0] : null;
}
c(qe, "asHTMLElement");
function Yo(t) {
  return typeof (t == null ? void 0 : t.changeTab) == "function";
}
c(Yo, "isAppV2");
function Tf(t, e, n, i = {}) {
  if (Yo(t)) {
    t.changeTab(e, n, i);
    return;
  }
  if (typeof (t == null ? void 0 : t.activateTab) == "function") {
    const r = { ...i };
    n != null && Array.isArray(t._tabs) && t._tabs.some((s) => s._group === n) && (r.group = n), r.triggerCallback == null && (r.triggerCallback = !0);
    try {
      t.activateTab(e, r);
    } catch {
      kg(t, e);
    }
  }
}
c(Tf, "setActiveTab");
function kg(t, e) {
  var s;
  const n = ((s = t.element) == null ? void 0 : s[0]) ?? t.element;
  if (!(n instanceof HTMLElement)) return;
  const i = n.querySelector("nav.sheet-tabs") ?? n.querySelector("nav.tabs");
  i && i.querySelectorAll("[data-tab]").forEach((a) => a.classList.remove("active")), n.querySelectorAll(".tab[data-tab]").forEach((a) => {
    a.classList.remove("active"), a.setAttribute("hidden", "true");
  });
  const r = i == null ? void 0 : i.querySelector(`[data-tab="${e}"]`), o = n.querySelector(`.tab[data-tab="${e}"]`);
  r == null || r.classList.add("active"), o && (o.classList.add("active"), o.removeAttribute("hidden"));
}
c(kg, "_manualTabActivation");
function Ag(t) {
  var n, i;
  if (!(t instanceof HTMLFormElement)) return {};
  const e = ((i = (n = foundry == null ? void 0 : foundry.applications) == null ? void 0 : n.ux) == null ? void 0 : i.FormDataExtended) ?? globalThis.FormDataExtended ?? null;
  if (!e) return {};
  try {
    const r = new e(t), o = typeof r.object == "object" ? r.object : {};
    return foundry.utils.expandObject(o);
  } catch {
    return {};
  }
}
c(Ag, "readFormData");
const Du = Symbol.for("eidolon.sceneConfig.v13PatchedTabs");
function Lf(t = {}) {
  const {
    tabId: e,
    tabLabel: n,
    getScene: i,
    isApplicable: r,
    renderContent: o,
    debugNamespace: s = "SceneConfigTab",
    onButtonCreate: a,
    onTabCreate: l,
    onAfterRender: u,
    logger: d = {},
    moduleId: f = "eidolon-utilities",
    tabIcon: h = "fa-solid fa-puzzle-piece"
  } = t ?? {};
  if (!e)
    throw new Error("createSceneConfigTabFactory requires a tabId.");
  if (typeof o != "function")
    throw new TypeError("createSceneConfigTabFactory requires a renderContent callback.");
  const m = typeof d.log == "function" ? d.log.bind(d) : (...M) => {
    var R;
    return (R = console.debug) == null ? void 0 : R.call(console, `${s}`, ...M);
  }, g = typeof d.group == "function" ? d.group.bind(d) : (...M) => {
    var R;
    return (R = console.groupCollapsed) == null ? void 0 : R.call(console, `${s}`, ...M);
  }, y = typeof d.groupEnd == "function" ? d.groupEnd.bind(d) : () => {
    var M;
    return (M = console.groupEnd) == null ? void 0 : M.call(console);
  }, v = Symbol(`EIDOLON_SCENE_CONFIG_TAB_CLEANUP_${e}`), b = typeof i == "function" ? i : () => null, w = typeof r == "function" ? r : () => !0, E = typeof n == "function" ? n : () => typeof n == "string" ? n : e;
  function C() {
    var j, H, V, Y, oe;
    const M = ((H = (j = foundry == null ? void 0 : foundry.applications) == null ? void 0 : j.sheets) == null ? void 0 : H.SceneConfig) ?? ((V = CONFIG == null ? void 0 : CONFIG.Scene) == null ? void 0 : V.sheetClass);
    if (!M || !Yo({ changeTab: (Y = M.prototype) == null ? void 0 : Y.changeTab })) return;
    const R = M[Du] ?? /* @__PURE__ */ new Set();
    if (R.has(e)) return;
    R.add(e), M[Du] = R;
    const B = (oe = M.TABS) == null ? void 0 : oe.sheet;
    if (B && Array.isArray(B.tabs) && !B.tabs.some((J) => J.id === e)) {
      const J = E({ app: null, scene: null }) ?? e;
      B.tabs.push({
        id: e,
        icon: h,
        label: J
      });
    }
    M.PARTS && !M.PARTS[e] && (M.PARTS[e] = {
      template: `modules/${f}/templates/scene-config-tab-mount.hbs`,
      scrollable: [`.tab[data-tab="${e}"]`]
    }), m("Patched v13 SceneConfig TABS/PARTS", { tabId: e });
  }
  c(C, "patchV13SceneConfig");
  function O(M, R) {
    var j, H;
    const B = b(M);
    if (!w(M, B)) {
      m("Skipped render", {
        tabId: e,
        reason: "inapplicable",
        constructor: ((j = M == null ? void 0 : M.constructor) == null ? void 0 : j.name) ?? null
      });
      return;
    }
    g("render", {
      tabId: e,
      sceneId: (B == null ? void 0 : B.id) ?? null,
      constructor: ((H = M == null ? void 0 : M.constructor) == null ? void 0 : H.name) ?? null
    });
    try {
      const V = qe(R) ?? qe(M.element);
      if (!V) {
        m("Missing root element", { tabId: e });
        return;
      }
      Yo(M) ? $(M, V, B) : x(M, V, B);
    } finally {
      y();
    }
  }
  c(O, "handleRender");
  function k(M, R, B) {
    var V;
    if (!h) {
      M.textContent = R;
      return;
    }
    const j = (V = M.querySelector("i")) == null ? void 0 : V.cloneNode(!0);
    M.textContent = "";
    const H = j ?? document.createElement("i");
    if (j || (H.className = h, B && (H.inert = !0)), M.append(H, " "), B) {
      const Y = document.createElement("span");
      Y.textContent = R, M.append(Y);
    } else
      M.append(document.createTextNode(R));
  }
  c(k, "setButtonContent");
  function x(M, R, B) {
    var oi, Fe, xe, qi, ln, si, ut, cn, q, Mo, Q, Tt, De, wr, xo, Er, ai, Sr;
    const H = [
      "nav.sheet-tabs[data-group]",
      "nav.tabs[data-group]",
      "nav.sheet-tabs",
      "nav.tabs"
    ].map((ce) => R.querySelector(ce)).find((ce) => ce instanceof HTMLElement), Y = [
      (oi = R.querySelector(".tab[data-tab]")) == null ? void 0 : oi.parentElement,
      R.querySelector(".sheet-body"),
      (xe = (Fe = H == null ? void 0 : H.parentElement) == null ? void 0 : Fe.querySelector) == null ? void 0 : xe.call(Fe, ":scope > .sheet-body"),
      H == null ? void 0 : H.parentElement
    ].find((ce) => ce instanceof HTMLElement), oe = ((qi = H == null ? void 0 : H.dataset) == null ? void 0 : qi.group) ?? ((ut = (si = (ln = H == null ? void 0 : H.querySelector) == null ? void 0 : ln.call(H, "a[data-group]")) == null ? void 0 : si.dataset) == null ? void 0 : ut.group) ?? ((Mo = (q = (cn = H == null ? void 0 : H.querySelector) == null ? void 0 : cn.call(H, "[data-group]")) == null ? void 0 : q.dataset) == null ? void 0 : Mo.group) ?? ((De = (Tt = (Q = Y == null ? void 0 : Y.querySelector) == null ? void 0 : Q.call(Y, ".tab[data-group]")) == null ? void 0 : Tt.dataset) == null ? void 0 : De.group) ?? ((xo = (wr = M._tabs) == null ? void 0 : wr[0]) == null ? void 0 : xo._group) ?? null;
    if (!H || !Y) {
      m("Missing navigation elements", {
        tabId: e,
        hasNav: !!H,
        hasBody: !!Y
      });
      return;
    }
    let J = H.querySelector(`[data-tab="${e}"]`);
    if (!J) {
      J = document.createElement("a"), J.dataset.action = "tab", oe && (J.dataset.group = oe), J.dataset.tab = e;
      const ce = H.querySelector("a[data-tab]");
      (Er = ce == null ? void 0 : ce.classList) != null && Er.contains("item") && J.classList.add("item"), H.appendChild(J), typeof a == "function" && a({ app: M, button: J, nav: H, scene: B }), m("Created tab button", { tabId: e, group: oe });
    }
    k(J, E({ app: M, scene: B }) ?? e, Yo(M));
    let te = Y.querySelector(`.tab[data-tab="${e}"]`);
    if (!te) {
      te = document.createElement("div"), te.classList.add("tab"), te.dataset.tab = e, oe && (te.dataset.group = oe);
      const ce = If(Y);
      Y.insertBefore(te, ce ?? null), typeof l == "function" && l({ app: M, tab: te, body: Y, scene: B }), m("Created tab container", { tabId: e, group: oe });
    }
    M._eidolonActiveTab === e || ((ai = J.classList) == null ? void 0 : ai.contains("active")) || te.classList.contains("active") ? (H.querySelectorAll("[data-tab].active").forEach((ce) => {
      ce !== J && ce.classList.remove("active");
    }), Y.querySelectorAll(".tab[data-tab].active").forEach((ce) => {
      ce !== te && (ce.classList.remove("active"), ce.setAttribute("hidden", "true"));
    }), J.classList.add("active"), te.classList.add("active"), te.removeAttribute("hidden")) : (J.classList.remove("active"), te.classList.remove("active"), te.setAttribute("hidden", "true"));
    const Ct = /* @__PURE__ */ c(() => {
      var Cn, P;
      ((Cn = J.classList) != null && Cn.contains("active") || te.classList.contains("active")) && ((P = J.classList) == null || P.add("active"), te.classList.add("active"), te.removeAttribute("hidden"), te.removeAttribute("aria-hidden"), te.style.display === "none" && (te.style.display = ""));
    }, "ensureTabVisible"), Be = /* @__PURE__ */ c(() => {
      Ct(), requestAnimationFrame(Ct);
    }, "scheduleEnsureTabVisible");
    J.dataset.eidolonEnsureSceneTabVisibility || (J.addEventListener("click", () => {
      M._eidolonActiveTab = e, Tf(M, e, oe), requestAnimationFrame(Ct);
    }), J.dataset.eidolonEnsureSceneTabVisibility = "true");
    const lt = `data-eidolon-nav-watched-${e}`;
    H.hasAttribute(lt) || (H.addEventListener("click", (ce) => {
      const Cn = ce.target.closest("[data-tab]");
      Cn && Cn.dataset.tab !== e && delete M._eidolonActiveTab;
    }), H.setAttribute(lt, "true")), Wa(M, v, m);
    const ct = o({
      app: M,
      scene: B,
      tab: te,
      tabButton: J,
      ensureTabVisible: Ct,
      scheduleEnsureTabVisible: Be
    });
    typeof ct == "function" && Pu(M, v, ct), typeof u == "function" && u({
      app: M,
      scene: B,
      tab: te,
      tabButton: J,
      ensureTabVisible: Ct,
      scheduleEnsureTabVisible: Be
    }), (Sr = M.setPosition) == null || Sr.call(M, { height: "auto" });
  }
  c(x, "handleRenderV1");
  function $(M, R, B) {
    const j = R.querySelector(`.tab[data-tab="${e}"]`), H = R.querySelector(`nav [data-tab="${e}"]`);
    if (!j || !H) {
      m("v2 mount not found, falling back to v1 injection", { tabId: e }), x(M, R, B);
      return;
    }
    k(H, E({ app: M, scene: B }) ?? e, !0);
    const V = /* @__PURE__ */ c(() => {
      var J;
      !((J = H.classList) != null && J.contains("active")) && !j.classList.contains("active") || (j.classList.add("active"), j.removeAttribute("hidden"), j.removeAttribute("aria-hidden"), j.style.display === "none" && (j.style.display = ""));
    }, "ensureTabVisible"), Y = /* @__PURE__ */ c(() => {
      V(), requestAnimationFrame(V);
    }, "scheduleEnsureTabVisible");
    Wa(M, v, m);
    const oe = o({
      app: M,
      scene: B,
      tab: j,
      tabButton: H,
      ensureTabVisible: V,
      scheduleEnsureTabVisible: Y
    });
    typeof oe == "function" && Pu(M, v, oe), typeof u == "function" && u({
      app: M,
      scene: B,
      tab: j,
      tabButton: H,
      ensureTabVisible: V,
      scheduleEnsureTabVisible: Y
    });
  }
  c($, "handleRenderV2");
  function D(M) {
    Wa(M, v, m);
  }
  c(D, "handleClose");
  function N() {
    return Hooks.once("init", () => {
      C();
    }), Hooks.on("renderSceneConfig", O), Hooks.on("closeSceneConfig", D), () => F();
  }
  c(N, "register");
  function F() {
    Hooks.off("renderSceneConfig", O), Hooks.off("closeSceneConfig", D);
  }
  return c(F, "unregister"), { register: N, unregister: F };
}
c(Lf, "createSceneConfigTabFactory");
function Pu(t, e, n) {
  if (!t || typeof n != "function") return;
  const i = t == null ? void 0 : t[e];
  Array.isArray(i) || (t[e] = []), t[e].push(n);
}
c(Pu, "registerCleanup");
function Wa(t, e, n) {
  if (!t) return;
  const i = t == null ? void 0 : t[e];
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
c(Wa, "invokeCleanup");
function If(t) {
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
c(If, "findFooterElement");
const Mg = va(jl), xg = `modules/${L}/templates/time-trigger-scene-tab.html`, _g = Lf({
  tabId: "time-triggers",
  tabLabel: /* @__PURE__ */ c(() => S("EIDOLON.TimeTrigger.Tab", "Time Triggers"), "tabLabel"),
  getScene: rn,
  isApplicable: Dg,
  renderContent: /* @__PURE__ */ c(({ app: t, scene: e, tab: n }) => $g(t, n, e), "renderContent"),
  logger: {
    log: _,
    group: ur,
    groupEnd: zn
  }
});
function Ng() {
  return _("Registering SceneConfig render hook"), _g.register();
}
c(Ng, "registerSceneConfigHook");
function $g(t, e, n) {
  if (!(e instanceof HTMLElement)) return;
  const i = Qe(n) ? n : rn(t);
  ms(t, e, i);
  const r = Wc(() => {
    ms(t, e, i);
  });
  return () => {
    if (typeof r == "function")
      try {
        r();
      } catch (o) {
        console.error(
          `${L} | Failed to dispose scene config time format subscription`,
          o
        );
      }
  };
}
c($g, "renderTimeTriggerTab");
async function ms(t, e, n) {
  var r, o;
  const i = n ?? rn(t);
  ur("renderTimeTriggersTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!Qe(i)) {
      const j = S(
        "EIDOLON.TimeTrigger.Unavailable",
        "Time triggers are unavailable for this configuration sheet."
      );
      e.innerHTML = `<p class="notes">${j}</p>`, _("Scene lacks document for time triggers", { sceneId: (i == null ? void 0 : i.id) ?? null });
      return;
    }
    const s = `flags.${L}.${cs}`, a = `flags.${L}.${ml}`, l = `flags.${L}.${gl}`, u = !!i.getFlag(L, cs), d = !!i.getFlag(L, ml), f = !!i.getFlag(L, gl), h = nr(i);
    _("Rendering time trigger list", {
      sceneId: i.id,
      isActive: u,
      shouldHideWindow: d,
      shouldShowPlayerWindow: f,
      triggerCount: h.length
    });
    const m = S("EIDOLON.TimeTrigger.Activate", "Activate Time Trigger"), g = S(
      "EIDOLON.TimeTrigger.Description",
      "Enable scene time triggers so scheduled actions can run automatically."
    ), y = S(
      "EIDOLON.TimeTrigger.HideWindowLabel",
      "Hide Floating Time Window"
    ), v = S(
      "EIDOLON.TimeTrigger.HideWindowDescription",
      "Keep the floating time control window hidden while leaving time triggers active."
    ), b = S(
      "EIDOLON.TimeTrigger.ShowPlayerWindowLabel",
      "Share Floating Time Window with Players"
    ), w = S(
      "EIDOLON.TimeTrigger.ShowPlayerWindowDescription",
      "Let non-GM players see the floating time window (without time controls)."
    ), E = S(
      "EIDOLON.TimeTrigger.TriggerListLabel",
      "Scene Time Triggers"
    ), C = S(
      "EIDOLON.TimeTrigger.TriggerListEmpty",
      "No time triggers configured for this scene."
    ), O = S("EIDOLON.TimeTrigger.AddTrigger", "Add Trigger"), k = S("EIDOLON.TimeTrigger.EditTrigger", "Edit"), x = S("EIDOLON.TimeTrigger.DeleteTrigger", "Remove"), $ = S("EIDOLON.TimeTrigger.TriggerNow", "Trigger Now"), D = S("EIDOLON.TimeTrigger.AtLabel", "At"), N = S("EIDOLON.TimeTrigger.DoLabel", "Do"), F = S("EIDOLON.TimeTrigger.MissingTime", "(No time set)"), M = h.map((j, H) => {
      const oe = (j.time ? Tg(j.time) : "") || j.time || "" || F, J = yg(j.action), te = [
        `${D} ${oe}`,
        `${N} ${J}`,
        ...bg(j)
      ];
      return {
        index: H,
        summaryParts: te,
        tooltips: {
          triggerNow: $,
          edit: k,
          delete: x
        }
      };
    }), R = ((o = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : o.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof R != "function") {
      console.error(`${L} | renderTemplate is unavailable; cannot render scene tab.`), e.innerHTML = `<p class="notes">${C}</p>`;
      return;
    }
    let B = "";
    try {
      B = await R(xg, {
        flags: {
          active: s,
          hideWindow: a,
          showPlayerWindow: l
        },
        states: {
          isActive: u,
          hideWindow: d,
          showPlayerWindow: f
        },
        labels: {
          activate: m,
          hideWindow: y,
          showPlayerWindow: b,
          triggerList: E,
          empty: C,
          add: O
        },
        hints: {
          activate: g,
          hideWindow: v,
          showPlayerWindow: w
        },
        triggers: M,
        hasTriggers: M.length > 0
      });
    } catch (j) {
      console.error(`${L} | Failed to render time trigger scene tab template`, j), e.innerHTML = `<p class="notes">${C}</p>`;
      return;
    }
    e.innerHTML = B, Fg(t, e, i);
  } finally {
    zn();
  }
}
c(ms, "renderTimeTriggersTabContent");
function Fg(t, e, n) {
  const i = n ?? rn(t);
  if (!Qe(i)) return;
  const r = e.querySelector('[data-action="add-trigger"]');
  r && r.addEventListener("click", () => {
    _("Add trigger button clicked", { sceneId: i.id }), Ru(t, { scene: i });
  }), e.querySelectorAll('[data-action="edit-trigger"]').forEach((o) => {
    o.addEventListener("click", () => {
      const s = Number(o.dataset.index);
      if (!Number.isInteger(s)) return;
      const l = nr(i)[s];
      l && (_("Edit trigger button clicked", { sceneId: i.id, triggerId: l.id, index: s }), Ru(t, { trigger: l, triggerIndex: s, scene: i }));
    });
  }), e.querySelectorAll('[data-action="delete-trigger"]').forEach((o) => {
    o.addEventListener("click", async () => {
      var u, d;
      const s = Number(o.dataset.index);
      if (!Number.isInteger(s)) return;
      const a = nr(i), l = a[s];
      if (l) {
        a.splice(s, 1);
        try {
          _("Deleting trigger", {
            sceneId: i.id,
            index: s,
            triggerId: (l == null ? void 0 : l.id) ?? null
          }), await tf(i, a), await ms(t, e, i);
        } catch (f) {
          console.error(`${L} | Failed to delete time trigger`, f), (d = (u = ui.notifications) == null ? void 0 : u.error) == null || d.call(
            u,
            S(
              "EIDOLON.TimeTrigger.TriggerDeleteError",
              "Failed to remove the selected time trigger."
            )
          );
        }
      }
    });
  }), e.querySelectorAll('[data-action="fire-trigger"]').forEach((o) => {
    o.addEventListener("click", async () => {
      var u, d, f, h, m, g, y;
      const s = Number(o.dataset.index);
      if (!Number.isInteger(s)) return;
      const l = nr(i)[s];
      if (l) {
        if (!((u = game.user) != null && u.isGM)) {
          (f = (d = ui.notifications) == null ? void 0 : d.warn) == null || f.call(
            d,
            S("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time.")
          );
          return;
        }
        try {
          _("Manually firing trigger", { sceneId: i.id, triggerId: l.id, index: s }), await nf(i, l), (m = (h = ui.notifications) == null ? void 0 : h.info) == null || m.call(
            h,
            S(
              "EIDOLON.TimeTrigger.TriggerNowSuccess",
              "Triggered the selected time trigger."
            )
          );
        } catch (v) {
          console.error(`${L} | Failed to execute time trigger manually`, v), (y = (g = ui.notifications) == null ? void 0 : g.error) == null || y.call(
            g,
            S(
              "EIDOLON.TimeTrigger.TriggerNowError",
              "Failed to execute the selected time trigger."
            )
          ), _("Manual trigger execution failed", {
            sceneId: i.id,
            triggerId: l.id,
            index: s,
            message: (v == null ? void 0 : v.message) ?? String(v)
          });
        }
      }
    });
  });
}
c(Fg, "bindTimeTriggerTabEvents");
function Ru(t, e = {}) {
  var s;
  const n = e.scene ?? null, i = n && Qe(n) ? n : rn(t);
  if (!Qe(i)) {
    console.warn(`${L} | Unable to open trigger form because no scene document is available.`);
    return;
  }
  _("Opening trigger form", {
    sceneId: i.id,
    triggerId: ((s = e.trigger) == null ? void 0 : s.id) ?? null,
    index: Number.isInteger(e.triggerIndex) ? Number(e.triggerIndex) : null
  }), Mg({
    scene: i,
    trigger: e.trigger ?? null,
    triggerIndex: e.triggerIndex ?? null,
    onSave: /* @__PURE__ */ c(() => {
      var l, u;
      const a = (u = (l = t.element) == null ? void 0 : l[0]) == null ? void 0 : u.querySelector('.tab[data-tab="time-triggers"]');
      a && ms(t, a, i);
    }, "onSave")
  }).render({ force: !0 });
}
c(Ru, "openTriggerForm");
function Dg(t, e) {
  var o, s, a, l, u;
  if (!t) return !1;
  const n = ((s = (o = foundry == null ? void 0 : foundry.applications) == null ? void 0 : o.sheets) == null ? void 0 : s.SceneConfig) ?? (globalThis == null ? void 0 : globalThis.SceneConfig);
  if (n && t instanceof n) return !0;
  const i = (a = t == null ? void 0 : t.constructor) == null ? void 0 : a.name;
  if (typeof i == "string" && i.includes("SceneConfig")) return !0;
  if (e) {
    const d = globalThis == null ? void 0 : globalThis.Scene;
    if (d && e instanceof d || (e == null ? void 0 : e.documentName) === "Scene" || (e == null ? void 0 : e.documentName) === "scenes" || (e == null ? void 0 : e.collection) === "scenes") return !0;
  }
  const r = ((l = t == null ? void 0 : t.options) == null ? void 0 : l.baseApplication) ?? ((u = t == null ? void 0 : t.options) == null ? void 0 : u.id);
  return !!(typeof r == "string" && r.includes("SceneConfig"));
}
c(Dg, "isRecognizedSceneConfig");
const $o = new $l(), Hu = new Fl();
function Pg() {
  _("Registering time trigger hooks"), Hooks.once("init", () => {
    ag(), hg(), _("Time trigger settings registered during init");
  }), Ng(), _("Scene config hook registered"), Hu.registerHooks(), _("Time automation hooks registered"), Hooks.once("ready", () => {
    mg(), _("Ready hook fired"), $o.onReady(), Hu.initialize();
  }), Hooks.on("canvasReady", (t) => {
    var e;
    _("canvasReady hook received", { scene: ((e = t == null ? void 0 : t.scene) == null ? void 0 : e.id) ?? null }), $o.onCanvasReady(t);
  }), Hooks.on("updateScene", (t) => {
    _("updateScene hook received", { scene: (t == null ? void 0 : t.id) ?? null }), $o.onUpdateScene(t);
  }), Hooks.on("updateWorldTime", (t, e) => {
    _("updateWorldTime hook received", { worldTime: t, diff: e }), $o.onUpdateWorldTime(t, e);
  });
}
c(Pg, "registerTimeTriggerHooks");
Pg();
const Ce = L, Of = "criteria", gs = "state", Rg = "criteriaVersion", Hg = 1, kf = "enableCriteriaSurfaces";
let qu = !1;
function qg() {
  var t;
  if (!qu) {
    if (qu = !0, !((t = game == null ? void 0 : game.settings) != null && t.register)) {
      console.warn(`${Ce} | game.settings.register unavailable; scene criteria setting skipped.`);
      return;
    }
    game.settings.register(Ce, kf, {
      name: S("EIDOLON.SceneCriteria.EnableSurfacesSettingName", "Enable Criteria Editor Surfaces"),
      hint: S(
        "EIDOLON.SceneCriteria.EnableSurfacesSettingHint",
        "Show criteria authoring surfaces (Scene > Criteria tab and tile/light editor controls). The Criteria Switcher remains available."
      ),
      scope: "world",
      config: !0,
      type: Boolean,
      default: !0,
      onChange: /* @__PURE__ */ c(() => {
        Bg();
      }, "onChange")
    });
  }
}
c(qg, "registerSceneCriteriaSettings");
function wa() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return !!game.settings.get(Ce, kf);
  } catch (e) {
    console.error(`${Ce} | Failed to read criteria surfaces setting`, e);
  }
  return !0;
}
c(wa, "getCriteriaSurfacesEnabled");
function Bg() {
  var o, s, a, l, u;
  const t = S("EIDOLON.SceneCriteria.ReloadPromptTitle", "Reload Required"), e = `<p>${S(
    "EIDOLON.SceneCriteria.ReloadPromptBody",
    "Changes to criteria editor surfaces require a reload. Reload now?"
  )}</p>`, n = typeof ((o = foundry == null ? void 0 : foundry.utils) == null ? void 0 : o.debouncedReload) == "function", i = /* @__PURE__ */ c(() => {
    n ? foundry.utils.debouncedReload() : window.location.reload();
  }, "reload"), r = (a = (s = foundry == null ? void 0 : foundry.applications) == null ? void 0 : s.api) == null ? void 0 : a.DialogV2;
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
    S(
      "EIDOLON.SceneCriteria.ReloadNotice",
      "Please reload the world to apply criteria editor surface changes."
    )
  );
}
c(Bg, "promptReloadForCriteriaSurfaces");
const ps = "Standard";
function St(t) {
  var n;
  const e = (n = t == null ? void 0 : t.getFlag) == null ? void 0 : n.call(t, Ce, Of);
  return e ? Af(e) : [];
}
c(St, "getSceneCriteria");
async function Ea(t, e, n = {}) {
  var o;
  if (!(t != null && t.update)) return;
  const i = Af(e), r = Ca(
    Vt(((o = t == null ? void 0 : t.getFlag) == null ? void 0 : o.call(t, Ce, gs)) ?? {}),
    i
  );
  await t.update({
    [`flags.${Ce}.${Of}`]: i,
    [`flags.${Ce}.${Rg}`]: Hg,
    [`flags.${Ce}.${gs}`]: r
  }, n);
}
c(Ea, "setSceneCriteria");
function Sa(t, e = null) {
  var r;
  const n = Array.isArray(e) ? e : St(t), i = Vt(((r = t == null ? void 0 : t.getFlag) == null ? void 0 : r.call(t, Ce, gs)) ?? {});
  return Ca(i, n);
}
c(Sa, "getSceneCriteriaState");
async function jg(t, e, n = null) {
  if (!(t != null && t.setFlag)) return;
  const i = Array.isArray(n) ? n : St(t), r = Ca(e, i);
  await t.setFlag(Ce, gs, r);
}
c(jg, "setSceneCriteriaState");
function Yc(t = "") {
  const e = typeof t == "string" ? t.trim() : "", n = Mf(Gl(e || "criterion"), /* @__PURE__ */ new Set());
  return {
    id: xf(),
    key: n,
    label: e,
    values: [ps],
    default: ps,
    order: 0
  };
}
c(Yc, "createSceneCriterion");
function Af(t) {
  const e = Array.isArray(t) ? Vt(t) : [], n = [], i = /* @__PURE__ */ new Set();
  return e.forEach((r, o) => {
    const s = Vl(r, o, i);
    s && (n.push(s), i.add(s.key));
  }), n;
}
c(Af, "sanitizeCriteria$1");
function Vl(t, e = 0, n = /* @__PURE__ */ new Set()) {
  if (!t || typeof t != "object") return null;
  const i = typeof t.id == "string" && t.id.trim() ? t.id.trim() : xf(), o = (typeof t.label == "string" ? t.label : typeof t.name == "string" ? t.name : "").trim(), s = typeof t.key == "string" && t.key.trim() ? Gl(t.key) : Gl(o || `criterion-${Number(e) + 1}`), a = Mf(s, n), l = Vg(t.values);
  let u = typeof t.default == "string" ? t.default.trim() : "";
  u || (u = l[0] ?? ps), l.includes(u) || l.unshift(u);
  const d = Number.isFinite(t.order) ? Number(t.order) : Number(e);
  return {
    id: i,
    key: a,
    label: o,
    values: l,
    default: u,
    order: d
  };
}
c(Vl, "sanitizeCriterion");
function Ca(t, e = []) {
  const n = t && typeof t == "object" ? Vt(t) : {}, i = {};
  for (const r of e) {
    const o = n == null ? void 0 : n[r.key], s = typeof o == "string" ? o.trim() : "";
    s && r.values.includes(s) ? i[r.key] = s : i[r.key] = r.default;
  }
  return i;
}
c(Ca, "sanitizeSceneCriteriaState");
function Ug(t) {
  return St(t).map((n) => ({
    id: n.key,
    key: n.key,
    name: n.label,
    values: [...n.values]
  }));
}
c(Ug, "getSceneCriteriaCategories");
function Vg(t) {
  const e = Array.isArray(t) ? t : [], n = [];
  for (const i of e) {
    if (typeof i != "string") continue;
    const r = i.trim();
    !r || n.includes(r) || n.push(r);
  }
  return n.length || n.push(ps), n;
}
c(Vg, "sanitizeCriterionValues");
function Gl(t) {
  return String(t ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
c(Gl, "slugifyCriterionKey");
function Mf(t, e) {
  if (!e.has(t)) return t;
  let n = 2;
  for (; e.has(`${t}-${n}`); )
    n += 1;
  return `${t}-${n}`;
}
c(Mf, "ensureUniqueCriterionKey");
function xf() {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 11);
}
c(xf, "generateCriterionId");
function _f(t) {
  var e, n;
  console.error(`${Ce} | Failed to persist scene criteria`, t), (n = (e = ui.notifications) == null ? void 0 : e.error) == null || n.call(
    e,
    S(
      "EIDOLON.SceneCriteria.PersistError",
      "Failed to persist the scene criteria."
    )
  );
}
c(_f, "notifyPersistError");
var Bd, be, yn, He, Nf, ca, ua, da, fa, Ko, ha, lo, co, Mr, $f;
const hn = class hn extends sn(on) {
  constructor(n = {}) {
    const { scene: i, criterion: r, isNew: o, onSave: s, ...a } = n ?? {};
    super(a);
    A(this, He);
    A(this, be, null);
    A(this, yn, !1);
    A(this, ca, /* @__PURE__ */ c(async (n) => {
      n.preventDefault();
      const i = n.currentTarget;
      if (!(i instanceof HTMLFormElement)) return;
      const r = new FormData(i), o = String(r.get("criterionLabel") ?? "").trim(), s = String(r.get("criterionKey") ?? "").trim(), a = Array.from(i.querySelectorAll('[name="criterionValues"]')).map((f) => f instanceof HTMLInputElement ? f.value.trim() : "").filter((f, h, m) => f && m.indexOf(f) === h), u = String(r.get("criterionDefault") ?? "").trim() || a[0] || "Standard", d = Vl(
        {
          id: p(this, be).id,
          key: s,
          label: o,
          values: a,
          default: u,
          order: Number(p(this, be).order ?? 0)
        },
        0,
        /* @__PURE__ */ new Set()
      );
      d && (I(this, be, d), await T(this, He, $f).call(this), this.close());
    }, "#onSubmit"));
    A(this, ua, /* @__PURE__ */ c((n) => {
      var s;
      if (p(this, yn)) return;
      const i = n.currentTarget, r = (i == null ? void 0 : i.form) ?? ((s = this.element) == null ? void 0 : s.querySelector("form"));
      if (!(r instanceof HTMLFormElement)) return;
      const o = r.querySelector('input[name="criterionKey"]');
      o instanceof HTMLInputElement && (o.value = Lr(i.value));
    }, "#onLabelInput"));
    A(this, da, /* @__PURE__ */ c((n) => {
      var l;
      const i = n.currentTarget, r = (i == null ? void 0 : i.form) ?? ((l = this.element) == null ? void 0 : l.querySelector("form"));
      if (!(r instanceof HTMLFormElement) || !(i instanceof HTMLInputElement)) return;
      const o = r.querySelector('input[name="criterionLabel"]'), s = Lr(o instanceof HTMLInputElement ? o.value : ""), a = Lr(i.value);
      I(this, yn, a !== s), i.value = a, T(this, He, Ko).call(this, r);
    }, "#onKeyInput"));
    A(this, fa, /* @__PURE__ */ c((n) => {
      var s, a;
      n.preventDefault();
      const i = ((s = n.currentTarget) == null ? void 0 : s.form) ?? ((a = this.element) == null ? void 0 : a.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector('input[name="criterionLabel"]'), o = i.querySelector('input[name="criterionKey"]');
      o instanceof HTMLInputElement && (o.value = Lr(r instanceof HTMLInputElement ? r.value : ""), I(this, yn, !1), T(this, He, Ko).call(this, i));
    }, "#onResetAutoKey"));
    A(this, ha, /* @__PURE__ */ c((n) => {
      var l, u, d, f, h, m;
      n.preventDefault();
      const i = ((l = n.currentTarget) == null ? void 0 : l.form) ?? ((u = this.element) == null ? void 0 : u.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector(".scene-criterion-editor__values");
      if (!(r instanceof HTMLElement)) return;
      (d = r.querySelector(".scene-criterion-editor__empty")) == null || d.remove();
      const o = document.createElement("div");
      o.classList.add("scene-criterion-editor__value");
      const s = Bt(S("EIDOLON.SceneCriteria.ValuePlaceholder", "Allowed value")), a = Bt(S("EIDOLON.SceneCriteria.RemoveValue", "Remove Value"));
      o.innerHTML = `
      <input type="text" name="criterionValues" value="" placeholder="${s}" class="form-control">
      <button type="button" class="icon" data-action="remove-value" aria-label="${a}" title="${a}">
        <i class="fa-solid fa-trash"></i>
      </button>
    `, r.appendChild(o), (f = o.querySelector('[data-action="remove-value"]')) == null || f.addEventListener("click", p(this, lo)), (h = o.querySelector('input[name="criterionValues"]')) == null || h.addEventListener("input", p(this, co)), T(this, He, Mr).call(this, i), (m = o.querySelector('input[name="criterionValues"]')) == null || m.focus();
    }, "#onAddValue"));
    A(this, lo, /* @__PURE__ */ c((n) => {
      var o, s, a, l;
      n.preventDefault(), (s = (o = n.currentTarget) == null ? void 0 : o.closest(".scene-criterion-editor__value")) == null || s.remove();
      const i = ((a = n.currentTarget) == null ? void 0 : a.form) ?? ((l = this.element) == null ? void 0 : l.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector(".scene-criterion-editor__values");
      if (r instanceof HTMLElement) {
        if (!r.querySelector(".scene-criterion-editor__value")) {
          const u = document.createElement("p");
          u.classList.add("notes", "scene-criterion-editor__empty"), u.textContent = S(
            "EIDOLON.SceneCriteria.ValueListEmpty",
            "No values have been added to this criterion."
          ), r.appendChild(u);
        }
        T(this, He, Mr).call(this, i);
      }
    }, "#onRemoveValue"));
    A(this, co, /* @__PURE__ */ c((n) => {
      var r, o;
      const i = ((r = n.currentTarget) == null ? void 0 : r.form) ?? ((o = this.element) == null ? void 0 : o.querySelector("form"));
      i instanceof HTMLFormElement && T(this, He, Mr).call(this, i);
    }, "#onValuesChanged"));
    this.scene = i ?? null, this.criterion = r ?? null, this.onSave = typeof s == "function" ? s : null, this.isNew = !!o, I(this, be, T(this, He, Nf).call(this)), I(this, yn, p(this, be).key !== Lr(p(this, be).label));
  }
  async _prepareContext() {
    var i, r, o, s;
    const n = Array.isArray((i = p(this, be)) == null ? void 0 : i.values) ? p(this, be).values : [];
    return {
      isNew: this.isNew,
      key: ((r = p(this, be)) == null ? void 0 : r.key) ?? "",
      label: ((o = p(this, be)) == null ? void 0 : o.label) ?? "",
      defaultValue: ((s = p(this, be)) == null ? void 0 : s.default) ?? "",
      values: n.map((a, l) => {
        var u;
        return {
          index: l,
          value: a,
          selected: a === ((u = p(this, be)) == null ? void 0 : u.default)
        };
      }),
      hasValues: n.length > 0,
      labels: {
        label: S("EIDOLON.SceneCriteria.CategoryNameLabel", "Criterion Label"),
        key: S("EIDOLON.SceneCriteria.CriteriaKey", "Key"),
        values: S("EIDOLON.SceneCriteria.ValuesLabel", "Allowed Values"),
        default: S("EIDOLON.SceneCriteria.DefaultValue", "Default Value"),
        empty: S(
          "EIDOLON.SceneCriteria.ValueListEmpty",
          "No values have been added to this criterion."
        ),
        addValue: S("EIDOLON.SceneCriteria.AddValue", "Add Value"),
        removeValue: S("EIDOLON.SceneCriteria.RemoveValue", "Remove Value"),
        valuePlaceholder: S("EIDOLON.SceneCriteria.ValuePlaceholder", "Allowed value"),
        resetAutoKey: S("EIDOLON.SceneCriteria.ResetAutoKey", "Reset to Auto"),
        save: this.isNew ? S("EIDOLON.SceneCriteria.CreateCategory", "Add Criterion") : S("EIDOLON.SceneCriteria.SaveCategory", "Save Criterion"),
        cancel: S("EIDOLON.SceneCriteria.CancelEdit", "Cancel")
      },
      keyIsCustom: p(this, yn)
    };
  }
  _onRender(n, i) {
    var o, s, a, l, u, d;
    super._onRender(n, i);
    const r = (o = this.element) == null ? void 0 : o.querySelector("form");
    r && (r.addEventListener("submit", p(this, ca)), (s = r.querySelector('[data-action="add-value"]')) == null || s.addEventListener("click", p(this, ha)), (a = r.querySelector('input[name="criterionLabel"]')) == null || a.addEventListener("input", p(this, ua)), (l = r.querySelector('input[name="criterionKey"]')) == null || l.addEventListener("input", p(this, da)), (u = r.querySelector('[data-action="reset-auto-key"]')) == null || u.addEventListener("click", p(this, fa)), r.querySelectorAll('[data-action="remove-value"]').forEach((f) => {
      f.addEventListener("click", p(this, lo));
    }), r.querySelectorAll('input[name="criterionValues"]').forEach((f) => {
      f.addEventListener("input", p(this, co));
    }), (d = r.querySelector('[data-action="cancel"]')) == null || d.addEventListener("click", (f) => {
      f.preventDefault(), this.close();
    }), T(this, He, Ko).call(this, r), T(this, He, Mr).call(this, r));
  }
};
be = new WeakMap(), yn = new WeakMap(), He = new WeakSet(), Nf = /* @__PURE__ */ c(function() {
  const n = Vl(this.criterion, 0, /* @__PURE__ */ new Set()) ?? Yc(S("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion"));
  return {
    id: n.id,
    key: n.key,
    label: n.label ?? "",
    values: Array.isArray(n.values) ? [...n.values] : [],
    default: n.default
  };
}, "#initializeState"), ca = new WeakMap(), ua = new WeakMap(), da = new WeakMap(), fa = new WeakMap(), Ko = /* @__PURE__ */ c(function(n) {
  const i = n.querySelector('[data-action="reset-auto-key"]');
  i instanceof HTMLButtonElement && (i.disabled = !p(this, yn));
}, "#syncAutoKeyButton"), ha = new WeakMap(), lo = new WeakMap(), co = new WeakMap(), Mr = /* @__PURE__ */ c(function(n) {
  var l, u;
  const i = n.querySelector('select[name="criterionDefault"]');
  if (!(i instanceof HTMLSelectElement)) return;
  const r = ((u = (l = i.value) == null ? void 0 : l.trim) == null ? void 0 : u.call(l)) ?? "", o = Array.from(n.querySelectorAll('input[name="criterionValues"]')).map((d) => d instanceof HTMLInputElement ? d.value.trim() : "").filter((d, f, h) => d && h.indexOf(d) === f), s = i.dataset.emptyLabel || S("EIDOLON.SceneCriteria.ValueListEmpty", "No values have been added to this criterion.");
  if (i.innerHTML = "", !o.length) {
    const d = document.createElement("option");
    d.value = "", d.textContent = s, d.selected = !0, i.appendChild(d);
    return;
  }
  const a = o.includes(r) ? r : o[0];
  for (const d of o) {
    const f = document.createElement("option");
    f.value = d, f.textContent = d, f.selected = d === a, i.appendChild(f);
  }
}, "#syncDefaultOptions"), $f = /* @__PURE__ */ c(async function() {
  if (!this.scene) return;
  const n = St(this.scene).sort((r, o) => r.order - o.order), i = n.findIndex((r) => r.id === p(this, be).id);
  i < 0 ? (p(this, be).order = n.length, n.push(p(this, be))) : (p(this, be).order = n[i].order, n.splice(i, 1, p(this, be)));
  try {
    await Ea(this.scene, n), this.onSave && await this.onSave(p(this, be));
  } catch (r) {
    _f(r);
  }
}, "#persist"), c(hn, "CategoryEditorApplication"), ue(hn, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Le(hn, hn, "DEFAULT_OPTIONS"),
  {
    id: `${Ce}-criterion-editor`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Bd = Le(hn, hn, "DEFAULT_OPTIONS")) == null ? void 0 : Bd.classes) ?? [], "standard-form", "themed"])
    ),
    window: {
      title: S("EIDOLON.SceneCriteria.EditCategory", "Edit Criterion"),
      resizable: !1
    },
    position: {
      width: 460,
      height: "auto"
    }
  },
  { inplace: !1 }
)), ue(hn, "PARTS", {
  content: {
    template: `modules/${Ce}/templates/scene-criteria-editor.html`
  }
});
let Wl = hn;
function Lr(t) {
  return String(t ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
c(Lr, "slugifyKey");
const Gg = `modules/${Ce}/templates/scene-criteria-tab.html`, zl = {
  log: /* @__PURE__ */ c((...t) => {
    var e;
    return (e = console.debug) == null ? void 0 : e.call(console, `${Ce} | Criteria`, ...t);
  }, "log"),
  group: /* @__PURE__ */ c((...t) => {
    var e;
    return (e = console.groupCollapsed) == null ? void 0 : e.call(console, `${Ce} | Criteria`, ...t);
  }, "group"),
  groupEnd: /* @__PURE__ */ c(() => {
    var t;
    return (t = console.groupEnd) == null ? void 0 : t.call(console);
  }, "groupEnd")
}, Wg = va(Wl), zg = Lf({
  tabId: "criteria",
  tabLabel: /* @__PURE__ */ c(() => S("EIDOLON.SceneCriteria.TabLabel", "Criteria"), "tabLabel"),
  getScene: rn,
  isApplicable: /* @__PURE__ */ c(() => wa(), "isApplicable"),
  renderContent: /* @__PURE__ */ c(({ app: t, tab: e, scene: n }) => Kg(t, e, n), "renderContent"),
  logger: zl
});
function Yg() {
  return zg.register();
}
c(Yg, "registerSceneCriteriaConfigHook");
function Kg(t, e, n) {
  if (!(e instanceof HTMLElement)) return;
  const i = Qe(n) ? n : rn(t);
  Gi(t, e, i);
}
c(Kg, "renderCriteriaTab");
async function Gi(t, e, n) {
  var r, o;
  const i = n ?? rn(t);
  zl.group("renderCriteriaTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!Qe(i)) {
      const d = S(
        "EIDOLON.SceneCriteria.Unavailable",
        "Scene criteria are unavailable for this configuration sheet."
      );
      e.innerHTML = `<p class="notes">${d}</p>`;
      return;
    }
    const s = St(i).sort((d, f) => d.order - f.order), a = Sa(i, s), l = ((o = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : o.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof l != "function") {
      e.innerHTML = `<p class="notes">${S("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
      return;
    }
    const u = await l(Gg, {
      description: S(
        "EIDOLON.SceneCriteria.Description",
        "Define scene criteria dimensions and allowed values used by matching rules."
      ),
      labels: {
        list: S("EIDOLON.SceneCriteria.CategoryListLabel", "Scene Criteria"),
        empty: S(
          "EIDOLON.SceneCriteria.CategoryListEmpty",
          "No criteria configured for this scene."
        ),
        add: S("EIDOLON.SceneCriteria.AddCategory", "Add Criterion"),
        edit: S("EIDOLON.SceneCriteria.EditCategory", "Edit Criterion"),
        remove: S("EIDOLON.SceneCriteria.RemoveCategory", "Remove Criterion"),
        moveUp: S("EIDOLON.SceneCriteria.MoveUp", "Move Up"),
        moveDown: S("EIDOLON.SceneCriteria.MoveDown", "Move Down"),
        values: S("EIDOLON.SceneCriteria.ValuesLabel", "Allowed Values"),
        unnamed: S("EIDOLON.SceneCriteria.UnnamedCategory", "Unnamed Criterion")
      },
      summary: {
        criteriaCount: s.length,
        valueCount: s.reduce((d, f) => d + f.values.length, 0)
      },
      criteria: s.map((d, f) => {
        var h, m;
        return {
          id: d.id,
          label: d.label,
          displayName: ((m = (h = d.label) == null ? void 0 : h.trim) == null ? void 0 : m.call(h)) || S("EIDOLON.SceneCriteria.UnnamedCategory", "Unnamed Criterion"),
          hasValues: d.values.length > 0,
          values: d.values.map((g) => ({
            value: g,
            isCurrent: (a[d.key] ?? d.default) === g
          })),
          valueCountLabel: Jg(d.values.length),
          canMoveUp: f > 0,
          canMoveDown: f < s.length - 1
        };
      }),
      hasCriteria: s.length > 0
    });
    e.innerHTML = u, Xg(t, e, i);
  } catch (s) {
    console.error(`${Ce} | Failed to render criteria tab`, s), e.innerHTML = `<p class="notes">${S("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
  } finally {
    zl.groupEnd();
  }
}
c(Gi, "renderCriteriaTabContent");
function Xg(t, e, n) {
  const i = n ?? rn(t);
  if (!Qe(i)) return;
  const r = e.querySelector('[data-criteria-action="add"]');
  r && r.addEventListener("click", () => {
    Bu(t, {
      scene: i,
      criterion: Yc(
        S("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion")
      ),
      isNew: !0,
      onSave: /* @__PURE__ */ c(() => Gi(t, e, i), "onSave")
    });
  }), e.querySelectorAll('[data-criteria-action="edit"]').forEach((o) => {
    const s = o.dataset.criterionId;
    s && o.addEventListener("click", () => {
      const a = St(i).find((l) => l.id === s);
      a && Bu(t, {
        scene: i,
        criterion: a,
        onSave: /* @__PURE__ */ c(() => Gi(t, e, i), "onSave")
      });
    });
  }), e.querySelectorAll('[data-criteria-action="remove"]').forEach((o) => {
    const s = o.dataset.criterionId;
    s && o.addEventListener("click", async () => {
      await za(i, (l) => {
        const u = l.findIndex((d) => d.id === s);
        return u < 0 ? !1 : (l.splice(u, 1), Ya(l), !0);
      }) && await Gi(t, e, i);
    });
  }), e.querySelectorAll('[data-criteria-action="move-up"]').forEach((o) => {
    const s = o.dataset.criterionId;
    s && o.addEventListener("click", async () => {
      await za(i, (l) => {
        const u = l.findIndex((f) => f.id === s);
        if (u <= 0) return !1;
        const [d] = l.splice(u, 1);
        return l.splice(u - 1, 0, d), Ya(l), !0;
      }) && await Gi(t, e, i);
    });
  }), e.querySelectorAll('[data-criteria-action="move-down"]').forEach((o) => {
    const s = o.dataset.criterionId;
    s && o.addEventListener("click", async () => {
      await za(i, (l) => {
        const u = l.findIndex((f) => f.id === s);
        if (u < 0 || u >= l.length - 1) return !1;
        const [d] = l.splice(u, 1);
        return l.splice(u + 1, 0, d), Ya(l), !0;
      }) && await Gi(t, e, i);
    });
  });
}
c(Xg, "bindCriteriaTabEvents");
async function za(t, e) {
  const n = St(t).sort((r, o) => r.order - o.order);
  if (e(n) === !1) return !1;
  try {
    return await Ea(t, n, { render: !1 }), !0;
  } catch (r) {
    return _f(r), !1;
  }
}
c(za, "mutateCriteria");
function Bu(t, e = {}) {
  const n = e.scene ?? null, i = n && Qe(n) ? n : rn(t);
  if (!Qe(i))
    return;
  Wg({
    scene: i,
    criterion: e.criterion ?? null,
    isNew: !!e.isNew,
    onSave: typeof e.onSave == "function" ? e.onSave : null
  }).render({ force: !0 });
}
c(Bu, "openCriterionEditor");
function Ya(t) {
  t.forEach((e, n) => {
    e.order = n;
  });
}
c(Ya, "reindexCriteriaOrder");
function Jg(t) {
  var e, n;
  if ((n = (e = game.i18n) == null ? void 0 : e.has) != null && n.call(e, "EIDOLON.SceneCriteria.ValueCountLabel"))
    try {
      return game.i18n.format("EIDOLON.SceneCriteria.ValueCountLabel", { count: t });
    } catch (i) {
      console.error(`${Ce} | Failed to format value count label`, i);
    }
  return t === 0 ? "No values configured" : t === 1 ? "1 value" : `${t} values`;
}
c(Jg, "formatValueCount");
let ju = !1;
function Qg() {
  Hooks.once("init", () => {
    qg();
  }), Hooks.once("ready", () => {
    wa() && (ju || (Yg(), ju = !0));
  });
}
c(Qg, "registerSceneCriteriaHooks");
Qg();
const ne = L, Ff = "criteriaEngineVersion", xi = "fileIndex", _i = "tileCriteria", Kc = {
  LEGACY: 1,
  CRITERIA: 2
}, Df = Kc.CRITERIA;
function Pf(t) {
  var e;
  return ((e = t == null ? void 0 : t.getFlag) == null ? void 0 : e.call(t, ne, Ff)) ?? Kc.LEGACY;
}
c(Pf, "getSceneEngineVersion");
function Zg(t, e, n, i, r) {
  if (!(t != null && t.length) || !(n != null && n.length)) return -1;
  const o = {};
  for (const a of n)
    o[a] = e[a];
  const s = Uu(t, o, n);
  if (s >= 0) return s;
  if (i != null && i.length && r) {
    const a = { ...o };
    for (const l of i) {
      if (!(l in a)) continue;
      a[l] = r[l] ?? "Standard";
      const u = Uu(t, a, n);
      if (u >= 0) return u;
    }
  }
  return -1;
}
c(Zg, "findBestMatch");
function Uu(t, e, n) {
  return t.findIndex((i) => {
    for (const r of n)
      if (i[r] !== e[r]) return !1;
    return !0;
  });
}
c(Uu, "findExactMatch");
function ep(t, e) {
  if (!(t != null && t.length)) return -1;
  let n = -1, i = -1;
  for (let r = 0; r < t.length; r += 1) {
    const o = t[r] ?? {}, s = Object.keys(o);
    if (s.length === 0) {
      i < 0 && (n = r, i = 0);
      continue;
    }
    let a = !0;
    for (const l of s)
      if (o[l] !== e[l]) {
        a = !1;
        break;
      }
    a && s.length > i && (n = r, i = s.length);
  }
  return n;
}
c(ep, "findFileIndex");
function Xo(t) {
  return t && typeof t == "object" && !Array.isArray(t);
}
c(Xo, "isPlainObject$2");
function Vu(t) {
  return t == null ? t : typeof structuredClone == "function" ? structuredClone(t) : JSON.parse(JSON.stringify(t));
}
c(Vu, "deepClone");
function tp(t, e) {
  if (!e) return;
  const n = e.split(".").filter(Boolean);
  if (!n.length) return;
  let i = t;
  for (let r = 0; r < n.length - 1; r += 1) {
    if (!Xo(i == null ? void 0 : i[n[r]])) return;
    i = i[n[r]];
  }
  delete i[n.at(-1)];
}
c(tp, "deletePath");
function Rf(t, e) {
  const n = Vu(t ?? {});
  if (!Xo(e)) return n;
  for (const [i, r] of Object.entries(e)) {
    if (i.startsWith("-=") && r === !0) {
      tp(n, i.slice(2));
      continue;
    }
    Xo(r) && Xo(n[i]) ? n[i] = Rf(n[i], r) : n[i] = Vu(r);
  }
  return n;
}
c(Rf, "fallbackMerge");
function np(t, e) {
  var n, i;
  return (n = foundry == null ? void 0 : foundry.utils) != null && n.mergeObject && ((i = foundry == null ? void 0 : foundry.utils) != null && i.deepClone) ? foundry.utils.mergeObject(t, foundry.utils.deepClone(e), {
    inplace: !1
  }) : Rf(t, e);
}
c(np, "defaultMerge");
function ip(t, e) {
  if (!t) return !0;
  for (const n of Object.keys(t))
    if (t[n] !== e[n]) return !1;
  return !0;
}
c(ip, "criteriaMatch");
function Hf(t, e, n, i) {
  const r = i ?? np;
  let o = r({}, t ?? {});
  if (!(e != null && e.length)) return o;
  const s = [];
  for (let a = 0; a < e.length; a += 1) {
    const l = e[a];
    if (ip(l == null ? void 0 : l.criteria, n)) {
      const u = l != null && l.criteria ? Object.keys(l.criteria).length : 0;
      s.push({ specificity: u, index: a, delta: l == null ? void 0 : l.delta });
    }
  }
  s.sort((a, l) => a.specificity - l.specificity || a.index - l.index);
  for (const a of s)
    a.delta && (o = r(o, a.delta));
  return o;
}
c(Hf, "resolveRules");
function Ta(t = null) {
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
c(Ta, "canManageCriteria");
function rp(t = null) {
  if (!Ta(t))
    throw new Error(`${ne} | You do not have permission to manage scene criteria.`);
}
c(rp, "requireCriteriaAccess");
const Gu = 200;
function qf(t) {
  return t ? Number.isInteger(t.size) ? t.size : Array.isArray(t) || typeof t.length == "number" ? t.length : Array.from(t).length : 0;
}
c(qf, "getCollectionSize");
function Rt() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
c(Rt, "nowMs");
function Bf(t) {
  if (!Array.isArray(t)) return [];
  const e = /* @__PURE__ */ new Set();
  for (const n of t) {
    if (typeof n != "string") continue;
    const i = n.trim();
    i && e.add(i);
  }
  return Array.from(e);
}
c(Bf, "uniqueStringKeys");
function op(t, e = Gu) {
  if (!Array.isArray(t) || t.length === 0) return [];
  const n = Number.isInteger(e) && e > 0 ? e : Gu, i = [];
  for (let r = 0; r < t.length; r += n)
    i.push(t.slice(r, r + n));
  return i;
}
c(op, "chunkArray");
function Ki(t) {
  return !!t && typeof t == "object" && !Array.isArray(t);
}
c(Ki, "isPlainObject$1");
function Yl(t, e) {
  if (Object.is(t, e)) return !0;
  if (Array.isArray(t) || Array.isArray(e)) {
    if (!Array.isArray(t) || !Array.isArray(e) || t.length !== e.length) return !1;
    for (let n = 0; n < t.length; n += 1)
      if (!Yl(t[n], e[n])) return !1;
    return !0;
  }
  if (Ki(t) || Ki(e)) {
    if (!Ki(t) || !Ki(e)) return !1;
    const n = Object.keys(e);
    for (const i of n)
      if (!Yl(t[i], e[i])) return !1;
    return !0;
  }
  return !1;
}
c(Yl, "areValuesEqual");
function ys(t) {
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
c(ys, "normalizeFilePath");
function jf(t) {
  return typeof (t == null ? void 0 : t.name) == "string" ? t.name : typeof (t == null ? void 0 : t.src) == "string" ? t.src : "";
}
c(jf, "getFilePath");
function Xc(t) {
  if (!Array.isArray(t)) return [];
  const e = /* @__PURE__ */ new Map();
  return t.map((n, i) => {
    const r = ys(jf(n)), o = r || `__index:${i}`, s = e.get(o) ?? 0;
    e.set(o, s + 1);
    const a = {
      indexHint: i
    };
    return r && (a.path = r, a.occurrence = s), {
      index: i,
      path: r,
      occurrence: s,
      target: a,
      label: r.split("/").pop() || `File ${i + 1}`
    };
  });
}
c(Xc, "buildTileFileEntries");
function Zn(t, e) {
  if (!Number.isInteger(e) || e < 0) return null;
  const i = Xc(t).find((r) => r.index === e);
  return i ? { ...i.target } : { indexHint: e };
}
c(Zn, "createTileTargetFromIndex");
function La(t) {
  if (!t || typeof t != "object") return null;
  const e = ys(t.path), n = Number(t.indexHint ?? t.fileIndex), i = Number(t.occurrence), r = {};
  return e && (r.path = e, r.occurrence = Number.isInteger(i) && i >= 0 ? i : 0), Number.isInteger(n) && n >= 0 && (r.indexHint = n), !r.path && !Number.isInteger(r.indexHint) ? null : r;
}
c(La, "normalizeTileTarget");
function Xr(t, e) {
  const n = La(t);
  if (!n) return -1;
  const i = Xc(e);
  if (!i.length) return -1;
  if (n.path) {
    const r = i.filter((o) => o.path === n.path);
    if (r.length > 0) {
      const o = Number.isInteger(n.occurrence) ? n.occurrence : 0;
      if (r[o]) return r[o].index;
      if (Number.isInteger(n.indexHint)) {
        const s = r.find((a) => a.index === n.indexHint);
        if (s) return s.index;
      }
      return r[0].index;
    }
  }
  return Number.isInteger(n.indexHint) && n.indexHint < i.length ? n.indexHint : -1;
}
c(Xr, "resolveTileTargetIndex");
function ei(t) {
  if (!t || typeof t != "object" || Array.isArray(t)) return {};
  const e = {};
  for (const [n, i] of Object.entries(t))
    typeof n != "string" || !n || typeof i != "string" || !i.trim() || (e[n] = i.trim());
  return e;
}
c(ei, "sanitizeCriteria");
function sp(t) {
  return Object.entries(ei(t)).sort(([n], [i]) => n.localeCompare(i)).map(([n, i]) => `${n}=${i}`).join("");
}
c(sp, "serializeCriteria");
function ap(t) {
  return Object.keys(ei(t)).length;
}
c(ap, "getCriteriaSpecificity");
function lp(t, e) {
  const n = ei(t), i = ei(e);
  for (const [r, o] of Object.entries(n))
    if (r in i && i[r] !== o)
      return !1;
  return !0;
}
c(lp, "areCriteriaCompatible");
function cp(t, e) {
  const n = Xr(t, e);
  if (Number.isInteger(n) && n >= 0)
    return `index:${n}`;
  const i = La(t);
  if (!i) return "";
  if (i.path) {
    const r = Number.isInteger(i.occurrence) ? i.occurrence : 0;
    return `path:${i.path}#${r}`;
  }
  return Number.isInteger(i.indexHint) ? `hint:${i.indexHint}` : "";
}
c(cp, "getTargetIdentity");
function Uf(t, e = {}) {
  var a;
  const n = Array.isArray(e.files) ? e.files : [], i = Di(t, { files: n });
  if (!((a = i == null ? void 0 : i.variants) != null && a.length))
    return {
      errors: [],
      warnings: []
    };
  const r = i.variants.map((l, u) => ({
    index: u,
    criteria: ei(l.criteria),
    specificity: ap(l.criteria),
    criteriaSignature: sp(l.criteria),
    targetIdentity: cp(l.target, n)
  })), o = [], s = [];
  for (let l = 0; l < r.length; l += 1) {
    const u = r[l];
    for (let d = l + 1; d < r.length; d += 1) {
      const f = r[d];
      if (u.specificity !== f.specificity || !lp(u.criteria, f.criteria)) continue;
      if (!(!!u.targetIdentity && u.targetIdentity === f.targetIdentity)) {
        o.push({
          leftIndex: u.index,
          rightIndex: f.index,
          type: u.criteriaSignature === f.criteriaSignature ? "equivalent" : "overlap",
          specificity: u.specificity
        });
        continue;
      }
      u.criteriaSignature === f.criteriaSignature && s.push({
        leftIndex: u.index,
        rightIndex: f.index,
        type: "duplicate"
      });
    }
  }
  return {
    errors: o,
    warnings: s
  };
}
c(Uf, "detectTileCriteriaConflicts");
function up(t, e) {
  if (!t || typeof t != "object") return null;
  let n = La(t.target);
  if (!n) {
    const i = Number(t.fileIndex);
    Number.isInteger(i) && i >= 0 && (n = Zn(e, i));
  }
  return n ? {
    criteria: ei(t.criteria),
    target: n
  } : null;
}
c(up, "normalizeTileVariant");
function Vf(t, e = {}) {
  if (!Array.isArray(t) || t.length === 0) return null;
  const n = Array.isArray(e.files) ? e.files : null, i = t.map((l, u) => ({
    criteria: ei(l),
    target: Zn(n, u)
  })).filter((l) => l.target);
  if (!i.length) return null;
  const r = i.find((l) => Object.keys(l.criteria).length === 0), o = (r == null ? void 0 : r.target) ?? i[0].target;
  let s = null;
  const a = Number(e.defaultFileIndex);
  return Number.isInteger(a) && a >= 0 && (s = Zn(n, a)), s || (s = o), {
    strategy: "select-one",
    variants: i,
    defaultTarget: s
  };
}
c(Vf, "buildTileCriteriaFromFileIndex");
function Di(t, e = {}) {
  const n = Array.isArray(e.files) ? e.files : null;
  if (Array.isArray(t))
    return Vf(t, { files: n });
  if (!t || typeof t != "object") return null;
  const i = Array.isArray(t.variants) ? t.variants.map((o) => up(o, n)).filter(Boolean) : [];
  if (!i.length) return null;
  let r = La(t.defaultTarget);
  if (!r) {
    const o = Number(t.defaultFileIndex);
    Number.isInteger(o) && o >= 0 && (r = Zn(n, o));
  }
  if (!r) {
    const o = i.find((s) => Object.keys(s.criteria).length === 0);
    r = (o == null ? void 0 : o.target) ?? i[0].target;
  }
  return {
    strategy: "select-one",
    variants: i,
    defaultTarget: r
  };
}
c(Di, "normalizeTileCriteria");
let bs = /* @__PURE__ */ new WeakMap();
function dp(t, e) {
  const n = Di(t, { files: e });
  if (!n) return null;
  const i = n.variants.map((o) => {
    const s = ei(o.criteria), a = Xr(o.target, e);
    return !Number.isInteger(a) || a < 0 ? null : {
      criteria: s,
      keys: Object.keys(s),
      targetIndex: a
    };
  }).filter(Boolean), r = Xr(n.defaultTarget, e);
  return !i.length && (!Number.isInteger(r) || r < 0) ? null : {
    variants: i,
    defaultIndex: r
  };
}
c(dp, "compileTileMatcher");
function fp(t, e, n) {
  const i = bs.get(t);
  if (i && i.tileCriteria === e && i.files === n)
    return i.compiled;
  const r = dp(e, n);
  return bs.set(t, {
    tileCriteria: e,
    files: n,
    compiled: r
  }), r;
}
c(fp, "getCompiledTileMatcher");
function hp(t, e) {
  if (!t) return -1;
  let n = -1, i = -1;
  for (const r of t.variants) {
    const o = r.keys;
    let s = !0;
    for (const a of o)
      if (r.criteria[a] !== (e == null ? void 0 : e[a])) {
        s = !1;
        break;
      }
    s && o.length > i && (i = o.length, n = r.targetIndex);
  }
  return n >= 0 ? n : t.defaultIndex;
}
c(hp, "selectTileFileIndexFromCompiled");
function Wu(t = null) {
  t ? bs.delete(t) : bs = /* @__PURE__ */ new WeakMap();
}
c(Wu, "invalidateTileMatcherCache");
function mp({ extractKeys: t, label: e = "doc" }) {
  let n = /* @__PURE__ */ new WeakMap();
  function i(a, l) {
    const u = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Set();
    for (const f of l) {
      const h = t(f);
      if (h) {
        d.add(f.id);
        for (const m of h)
          u.has(m) || u.set(m, /* @__PURE__ */ new Set()), u.get(m).add(f.id);
      }
    }
    return { collection: l, keyToDocIds: u, allDocIds: d };
  }
  c(i, "build");
  function r(a, l) {
    const u = n.get(a);
    if ((u == null ? void 0 : u.collection) === l) return u;
    const d = i(a, l);
    return n.set(a, d), d;
  }
  c(r, "get");
  function o(a, l, u) {
    const d = Bf(u), f = r(a, l);
    if (!d.length)
      return typeof (l == null ? void 0 : l.get) == "function" ? Array.from(f.allDocIds).map((m) => l.get(m)).filter(Boolean) : Array.from(l ?? []).filter((m) => f.allDocIds.has(m.id));
    const h = /* @__PURE__ */ new Set();
    for (const m of d) {
      const g = f.keyToDocIds.get(m);
      if (g)
        for (const y of g) h.add(y);
    }
    return h.size ? typeof (l == null ? void 0 : l.get) == "function" ? Array.from(h).map((m) => l.get(m)).filter(Boolean) : Array.from(l ?? []).filter((m) => h.has(m.id)) : [];
  }
  c(o, "getAffectedDocs");
  function s(a = null) {
    a ? n.delete(a) : n = /* @__PURE__ */ new WeakMap();
  }
  return c(s, "invalidate"), { getAffectedDocs: o, invalidate: s };
}
c(mp, "createDependencyIndexManager");
async function Gf(t, e, n, i) {
  const r = op(n, i);
  for (const o of r)
    await t.updateEmbeddedDocuments(e, o), r.length > 1 && await Promise.resolve();
  return r.length;
}
c(Gf, "updateDocumentsInChunks");
const gp = /* @__PURE__ */ c((...t) => console.log(`${ne} | criteria tiles:`, ...t), "log$1"), Wf = mp({
  label: "tile",
  extractKeys(t) {
    var r;
    const e = t.getFlag(ne, _i) ?? t.getFlag(ne, xi);
    if (!e) return null;
    const n = Di(e, { files: null });
    if (!((r = n == null ? void 0 : n.variants) != null && r.length)) return [];
    const i = [];
    for (const o of n.variants)
      for (const s of Object.keys(o.criteria ?? {}))
        s && i.push(s);
    return i;
  }
});
function pp(t = null, e = null) {
  Wf.invalidate(t ?? void 0), e ? Wu(e) : t || Wu(null);
}
c(pp, "invalidateTileCriteriaCaches");
async function zf(t, e, n = {}) {
  var l, u, d, f;
  const i = Rt(), r = {
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
    return r.durationMs = Rt() - i, r;
  const o = e.getEmbeddedCollection("Tile") ?? [];
  r.total = qf(o);
  const s = Wf.getAffectedDocs(e, o, n.changedKeys);
  if (r.scanned = s.length, !s.length)
    return r.skipped.unaffected = r.total, r.durationMs = Rt() - i, r;
  const a = [];
  for (const h of s) {
    const m = h.getFlag(ne, _i) ?? h.getFlag(ne, xi);
    if (!m) {
      r.skipped.noCriteria += 1;
      continue;
    }
    const g = h.getFlag("monks-active-tiles", "files");
    if (!(g != null && g.length)) {
      r.skipped.noFiles += 1;
      continue;
    }
    const y = fp(h, m, g), v = hp(y, t);
    if (!Number.isInteger(v) || v < 0 || v >= g.length) {
      console.warn(`${ne} | Tile ${h.id} has no valid file match for state`, t), r.skipped.noMatch += 1;
      continue;
    }
    const b = v, E = Number(h.getFlag("monks-active-tiles", "fileindex")) !== b, C = g.some((N, F) => !!(N != null && N.selected) != (F === v)), O = ys(((u = h.texture) == null ? void 0 : u.src) ?? ((f = (d = h._source) == null ? void 0 : d.texture) == null ? void 0 : f.src) ?? ""), k = jf(g[v]), x = ys(k), $ = !!x && x !== O;
    if (!C && !E && !$) {
      r.skipped.unchanged += 1;
      continue;
    }
    const D = {
      _id: h._id
    };
    C && (D["flags.monks-active-tiles.files"] = g.map((N, F) => ({
      ...N,
      selected: F === v
    }))), E && (D["flags.monks-active-tiles.fileindex"] = b), $ && (D.texture = { src: k }), a.push(D), gp(`Tile ${h.id} -> ${k}`);
  }
  return a.length > 0 && (r.chunks = await Gf(e, "Tile", a, n.chunkSize), r.updated = a.length), r.durationMs = Rt() - i, r;
}
c(zf, "updateTiles");
const Pr = L, Rr = "lightCriteria", Jc = Object.freeze({
  base: null,
  mappings: [],
  current: null
});
function Ka(t) {
  return t && typeof t == "object" && !Array.isArray(t);
}
c(Ka, "isPlainObject");
function Yf(t, e) {
  if (!Ka(e)) return {};
  const n = {};
  for (const [i, r] of Object.entries(e)) {
    const o = t == null ? void 0 : t[i];
    if (Ka(r) && Ka(o)) {
      const s = Yf(o, r);
      Object.keys(s).length > 0 && (n[i] = s);
    } else r !== o && (n[i] = Vt(r));
  }
  return n;
}
c(Yf, "computeDelta");
function Kf(t) {
  var n;
  const e = ((n = t == null ? void 0 : t.getFlag) == null ? void 0 : n.call(t, Pr, Rr)) ?? Jc;
  return Jr(e);
}
c(Kf, "getLightCriteriaState");
async function Xf(t, e) {
  const n = Jr(e);
  if (!(t != null && t.setFlag))
    return n;
  const i = n.base !== null, r = n.mappings.length > 0, o = n.current !== null;
  return !i && !r && !o ? (typeof t.unsetFlag == "function" ? await t.unsetFlag(Pr, Rr) : await t.setFlag(Pr, Rr, null), Jc) : (await t.setFlag(Pr, Rr, n), n);
}
c(Xf, "setLightCriteriaState");
async function Oo(t, e) {
  if (typeof e != "function")
    throw new TypeError("updateLightCriteriaState requires an updater function.");
  const n = Vt(Kf(t)), i = await e(n);
  return Xf(t, i);
}
c(Oo, "updateLightCriteriaState");
async function zu(t, e) {
  const n = Pi(e);
  if (!n)
    throw new Error("Invalid light configuration payload.");
  return Oo(t, (i) => ({
    ...i,
    base: n
  }));
}
c(zu, "storeBaseLighting");
async function Yu(t, e, n, { label: i } = {}) {
  const r = ko(e);
  if (!r)
    throw new Error("Cannot create a mapping without at least one category selection.");
  const o = Pi(n);
  if (!o)
    throw new Error("Invalid light configuration payload.");
  return Oo(t, (s) => {
    const a = br(r), l = Array.isArray(s == null ? void 0 : s.mappings) ? [...s.mappings] : [], u = l.findIndex((m) => (m == null ? void 0 : m.key) === a), d = u >= 0 ? l[u] : null, f = typeof (d == null ? void 0 : d.id) == "string" && d.id.trim() ? d.id.trim() : Qf(), h = Ia({
      id: f,
      categories: r,
      config: o,
      label: typeof i == "string" ? i : (d == null ? void 0 : d.label) ?? null,
      updatedAt: Date.now()
    });
    if (!h)
      throw new Error("Failed to sanitize criteria mapping entry.");
    return u >= 0 ? l[u] = h : l.push(h), {
      ...s,
      mappings: l
    };
  });
}
c(Yu, "upsertLightCriteriaMapping");
async function yp(t, e, n, i, { replaceExisting: r = !1 } = {}) {
  const o = typeof e == "string" ? e.trim() : "";
  if (!o)
    throw new Error("A mapping id is required to retarget criteria.");
  const s = ko(n);
  if (!s)
    throw new Error("Cannot retarget mapping without at least one category selection.");
  const a = Pi(i);
  if (!a)
    throw new Error("Invalid light configuration payload.");
  return Oo(t, (l) => {
    const u = Array.isArray(l == null ? void 0 : l.mappings) ? [...l.mappings] : [], d = u.findIndex((b) => (b == null ? void 0 : b.id) === o);
    if (d < 0)
      throw new Error("The selected mapping no longer exists.");
    const f = br(s), h = u.findIndex(
      (b, w) => w !== d && (b == null ? void 0 : b.key) === f
    );
    if (h >= 0 && !r)
      throw new Error("A mapping already exists for the selected criteria.");
    const m = u[d], g = Ia({
      ...m,
      id: o,
      categories: s,
      config: a,
      updatedAt: Date.now()
    });
    if (!g)
      throw new Error("Failed to sanitize updated mapping.");
    u[d] = g;
    let y = null;
    if (h >= 0) {
      const [b] = u.splice(h, 1);
      y = (b == null ? void 0 : b.id) ?? null;
    }
    let v = (l == null ? void 0 : l.current) ?? null;
    return v && typeof v == "object" && (v.mappingId === o ? v = {
      ...v,
      mappingId: o,
      categories: s,
      updatedAt: Date.now()
    } : y && v.mappingId === y && (v = {
      ...v,
      mappingId: o,
      categories: s,
      updatedAt: Date.now()
    })), {
      ...l,
      mappings: u,
      current: v
    };
  });
}
c(yp, "retargetLightCriteriaMapping");
async function bp(t, e) {
  const n = typeof e == "string" ? e.trim() : "";
  if (!n)
    throw new Error("A mapping id is required to remove a mapping.");
  return Oo(t, (i) => {
    const r = Array.isArray(i == null ? void 0 : i.mappings) ? [...i.mappings] : [], o = r.findIndex((a) => (a == null ? void 0 : a.id) === n);
    if (o < 0) return i;
    r.splice(o, 1);
    let s = (i == null ? void 0 : i.current) ?? null;
    return (s == null ? void 0 : s.mappingId) === n && (s = null), {
      ...i,
      mappings: r,
      current: s
    };
  });
}
c(bp, "removeLightCriteriaMapping");
async function Hr(t, e) {
  const n = Jf(e);
  return Oo(t, (i) => ({
    ...i,
    current: n
  }));
}
c(Hr, "storeCurrentCriteriaSelection");
function vp(t) {
  const e = Jr(t), n = e.base ?? {}, i = [];
  for (const r of e.mappings) {
    const o = ko(r == null ? void 0 : r.categories);
    if (!o) continue;
    const s = Yf(n, (r == null ? void 0 : r.config) ?? {});
    Object.keys(s).length !== 0 && i.push({
      criteria: o,
      delta: s
    });
  }
  return {
    base: n,
    rules: i
  };
}
c(vp, "convertLightCriteriaStateToPresets");
function wp(t, e = []) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
  for (const l of e)
    typeof (l == null ? void 0 : l.key) == "string" && l.key.trim() && i.add(l.key.trim()), typeof (l == null ? void 0 : l.id) == "string" && l.id.trim() && typeof (l == null ? void 0 : l.key) == "string" && n.set(l.id.trim(), l.key.trim());
  const r = Jr(t), o = /* @__PURE__ */ c((l) => {
    const u = {};
    for (const [d, f] of Object.entries(l ?? {})) {
      const h = String(d ?? "").trim(), m = typeof f == "string" ? f.trim() : "";
      if (!h || !m) continue;
      if (i.has(h)) {
        u[h] = m;
        continue;
      }
      const g = n.get(h);
      g && (u[g] = m);
    }
    return Object.keys(u).length ? u : null;
  }, "remapCategories"), s = r.mappings.map((l) => {
    const u = o(l.categories);
    return u ? Ia({
      ...l,
      categories: u,
      key: br(u)
    }) : null;
  }).filter(Boolean);
  let a = r.current;
  if (a != null && a.categories) {
    const l = o(a.categories);
    a = l ? {
      ...a,
      categories: l
    } : null;
  }
  return Jr({
    ...r,
    mappings: s,
    current: a
  });
}
c(wp, "migrateLightCriteriaCategoriesToKeys");
function Jr(t) {
  var l;
  const e = Vt(t);
  if (!e || typeof e != "object")
    return Vt(Jc);
  const n = Pi(e.base), i = Array.isArray(e.mappings) ? e.mappings : [], r = /* @__PURE__ */ new Map();
  for (const u of i) {
    const d = Ia(u);
    d && r.set(d.key, d);
  }
  const o = Array.from(r.values()), s = new Map(o.map((u) => [u.id, u]));
  let a = Jf(e.current);
  if (a) {
    const u = a.categories && Object.keys(a.categories).length > 0;
    if (a.mappingId && !s.has(a.mappingId)) {
      const d = u ? ((l = o.find((f) => f.key === br(a.categories))) == null ? void 0 : l.id) ?? null : null;
      d ? a = {
        ...a,
        mappingId: d
      } : u && (a = {
        mappingId: null,
        categories: a.categories,
        updatedAt: a.updatedAt
      });
    }
  }
  return {
    base: n ?? null,
    mappings: o,
    current: a
  };
}
c(Jr, "sanitizeLightCriteriaState");
function Pi(t) {
  const e = Vt(t);
  if (!e || typeof e != "object") return null;
  const n = /* @__PURE__ */ new Set(["config", "hidden", "vision"]);
  for (const i of Object.keys(e))
    n.has(i) || delete e[i];
  return e;
}
c(Pi, "sanitizeLightConfigPayload");
function Ia(t) {
  if (!t || typeof t != "object") return null;
  const e = ko(t.categories);
  if (!e) return null;
  const n = Pi(t.config);
  if (!n) return null;
  const i = typeof t.id == "string" && t.id.trim() ? t.id.trim() : Qf(), r = br(e), o = {
    id: i,
    key: r,
    categories: e,
    config: n,
    updatedAt: Number.isFinite(t.updatedAt) ? Number(t.updatedAt) : Date.now()
  };
  return typeof t.label == "string" && t.label.trim() && (o.label = t.label.trim()), o;
}
c(Ia, "sanitizeCriteriaMappingEntry");
function Jf(t) {
  if (!t || typeof t != "object") return null;
  const e = typeof t.mappingId == "string" && t.mappingId.trim() ? t.mappingId.trim() : null, n = ko(t.categories);
  return !e && !n ? null : {
    mappingId: e,
    categories: n,
    updatedAt: Number.isFinite(t.updatedAt) ? Number(t.updatedAt) : Date.now()
  };
}
c(Jf, "sanitizeCurrentSelection");
function ko(t) {
  const e = {};
  if (Array.isArray(t))
    for (const n of t) {
      const i = Ku((n == null ? void 0 : n.id) ?? (n == null ? void 0 : n.categoryId) ?? (n == null ? void 0 : n.category)), r = Xu((n == null ? void 0 : n.value) ?? (n == null ? void 0 : n.selection) ?? (n == null ? void 0 : n.label));
      !i || !r || (e[i] = r);
    }
  else if (t && typeof t == "object")
    for (const [n, i] of Object.entries(t)) {
      const r = Ku(n), o = Xu(i);
      !r || !o || (e[r] = o);
    }
  return Object.keys(e).length > 0 ? e : null;
}
c(ko, "sanitizeCriteriaCategories");
function br(t) {
  if (!t || typeof t != "object") return "";
  const e = Object.entries(t).filter(([, n]) => typeof n == "string" && n).map(([n, i]) => `${n}:${i}`);
  return e.sort((n, i) => n < i ? -1 : n > i ? 1 : 0), e.join("|");
}
c(br, "computeCriteriaMappingKey");
function Qf() {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
c(Qf, "generateLightMappingId");
function Ku(t) {
  if (typeof t != "string") return null;
  const e = t.trim();
  return e || null;
}
c(Ku, "normalizeCategoryId");
function Xu(t) {
  if (typeof t != "string") return null;
  const e = t.trim();
  return e || null;
}
c(Xu, "normalizeCategoryValue");
const Qr = [];
function Zf(t) {
  typeof t == "function" && (Qr.includes(t) || Qr.push(t));
}
c(Zf, "registerHiddenLightProvider");
function Ep(t) {
  const e = Qr.indexOf(t);
  e >= 0 && Qr.splice(e, 1);
}
c(Ep, "unregisterHiddenLightProvider");
function Sp() {
  const t = /* @__PURE__ */ new Set();
  for (const e of Qr)
    try {
      const n = e();
      if (Array.isArray(n))
        for (const i of n)
          i && t.add(i);
    } catch (n) {
      console.warn("eidolon-utilities | Hidden light provider error:", n);
    }
  return t;
}
c(Sp, "getHiddenLightIds");
const Qc = /* @__PURE__ */ new Map(), Zr = [];
function xr(t) {
  t != null && t.tag && Qc.set(t.tag, { ...t });
}
c(xr, "registerTileConvention");
function Cp(t) {
  Qc.delete(t);
}
c(Cp, "unregisterTileConvention");
function eh() {
  return Qc;
}
c(eh, "getTileConventions");
function Tp(t) {
  typeof t == "function" && (Zr.includes(t) || Zr.push(t));
}
c(Tp, "registerIndexingHook");
function Lp(t) {
  const e = Zr.indexOf(t);
  e >= 0 && Zr.splice(e, 1);
}
c(Lp, "unregisterIndexingHook");
function Ip() {
  return Zr;
}
c(Ip, "getIndexingHooks");
const vs = ["AmbientLight", "Wall", "AmbientSound"];
let ws = /* @__PURE__ */ new WeakMap(), Es = /* @__PURE__ */ new WeakMap();
function Op(t) {
  const e = /* @__PURE__ */ new Set();
  for (const n of (t == null ? void 0 : t.rules) ?? [])
    for (const i of Object.keys((n == null ? void 0 : n.criteria) ?? {}))
      i && e.add(i);
  return Array.from(e);
}
c(Op, "getPresetDependencyKeys");
function kp(t, e) {
  const n = /* @__PURE__ */ new Map();
  for (const i of vs) {
    const r = e.get(i) ?? [], o = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map();
    for (const a of r) {
      const l = nh(a, i);
      if (l != null && l.base) {
        o.add(a.id);
        for (const u of Op(l))
          s.has(u) || s.set(u, /* @__PURE__ */ new Set()), s.get(u).add(a.id);
      }
    }
    n.set(i, {
      allDocIds: o,
      keyToDocIds: s
    });
  }
  return {
    collectionsByType: e,
    byType: n
  };
}
c(kp, "buildPlaceableDependencyIndex");
function Ap(t, e) {
  const n = Es.get(t);
  if (n && vs.every((r) => n.collectionsByType.get(r) === e.get(r)))
    return n;
  const i = kp(t, e);
  return Es.set(t, i), i;
}
c(Ap, "getPlaceableDependencyIndex");
function Mp(t, e, n) {
  if (!e || !t) return [];
  const i = Bf(n);
  if (!i.length)
    return typeof t.get == "function" ? Array.from(e.allDocIds).map((o) => t.get(o)).filter(Boolean) : Array.from(t).filter((o) => e.allDocIds.has(o.id));
  const r = /* @__PURE__ */ new Set();
  for (const o of i) {
    const s = e.keyToDocIds.get(o);
    if (s)
      for (const a of s) r.add(a);
  }
  return r.size ? typeof t.get == "function" ? Array.from(r).map((o) => t.get(o)).filter(Boolean) : Array.from(t).filter((o) => r.has(o.id)) : [];
}
c(Mp, "getDocsForChangedKeys");
function th(t, e) {
  const n = { _id: e._id };
  for (const [r, o] of Object.entries(e)) {
    if (r === "_id") continue;
    const s = t == null ? void 0 : t[r];
    if (Ki(o) && Ki(s)) {
      const a = th(s, { _id: e._id, ...o });
      if (!a) continue;
      const l = Object.keys(a).filter((u) => u !== "_id");
      if (l.length > 0) {
        n[r] = {};
        for (const u of l)
          n[r][u] = a[u];
      }
      continue;
    }
    Yl(s, o) || (n[r] = o);
  }
  return Object.keys(n).filter((r) => r !== "_id").length > 0 ? n : null;
}
c(th, "buildChangedPayload");
function nh(t, e) {
  var a;
  const n = ((a = t == null ? void 0 : t.flags) == null ? void 0 : a[ne]) ?? {}, i = (n == null ? void 0 : n.presets) ?? null, r = e === "AmbientLight" ? (n == null ? void 0 : n.lightCriteria) ?? null : null, o = ws.get(t);
  if (o && o.type === e && o.rawPresets === i && o.rawLightCriteria === r)
    return o.presets;
  let s = null;
  if (n != null && n.presets) {
    const l = n.presets.base ?? null, u = Array.isArray(n.presets.rules) ? n.presets.rules : [];
    (l && Object.keys(l).length > 0 || u.length > 0) && (s = {
      base: l ?? {},
      rules: u
    });
  }
  if (!s && e === "AmbientLight" && (n != null && n.lightCriteria)) {
    const l = vp(n.lightCriteria);
    (l.base && Object.keys(l.base).length > 0 || l.rules.length > 0) && (s = {
      base: l.base,
      rules: l.rules
    });
  }
  return ws.set(t, {
    type: e,
    rawPresets: i,
    rawLightCriteria: r,
    presets: s
  }), s;
}
c(nh, "getPresetsForDocument");
function xp(t = null, e = null) {
  t ? Es.delete(t) : Es = /* @__PURE__ */ new WeakMap(), e ? ws.delete(e) : t || (ws = /* @__PURE__ */ new WeakMap());
}
c(xp, "invalidatePlaceableCriteriaCaches");
async function ih(t, e, n = {}) {
  var l, u;
  const i = Rt(), r = {
    total: 0,
    scanned: 0,
    updated: 0,
    chunks: 0,
    byType: {},
    durationMs: 0
  };
  if (e = e ?? ((l = game.scenes) == null ? void 0 : l.viewed), !e)
    return r.durationMs = Rt() - i, r;
  const o = Sp(), s = new Map(
    vs.map((d) => [d, e.getEmbeddedCollection(d) ?? []])
  ), a = Ap(e, s);
  for (const d of vs) {
    const f = s.get(d) ?? [], h = {
      total: qf(f),
      scanned: 0,
      updated: 0,
      chunks: 0
    }, m = a.byType.get(d) ?? null, g = Mp(f, m, n.changedKeys);
    if (h.scanned = g.length, r.total += h.total, r.scanned += h.scanned, r.byType[d] = h, !g.length) continue;
    const y = [];
    for (const v of g) {
      const b = nh(v, d);
      if (!(b != null && b.base)) continue;
      const w = Hf(b.base, b.rules ?? [], t);
      w._id = v._id, d === "AmbientLight" && o.has(v._id) && (w.hidden = !0);
      const E = (v == null ? void 0 : v._source) ?? ((u = v == null ? void 0 : v.toObject) == null ? void 0 : u.call(v)) ?? {}, C = th(E, w);
      C && y.push(C);
    }
    y.length > 0 && (h.chunks = await Gf(e, d, y, n.chunkSize), h.updated = y.length, r.updated += y.length, r.chunks += h.chunks, console.log(`${ne} | Updated ${y.length} ${d}(s)`));
  }
  return r.durationMs = Rt() - i, r;
}
c(ih, "updatePlaceables");
const Fo = /* @__PURE__ */ new Map();
function _p(t) {
  var e;
  return t = t ?? ((e = game.scenes) == null ? void 0 : e.viewed), t ? Sa(t) : null;
}
c(_p, "getState");
async function Np(t, e, n = 0) {
  var m;
  const i = Rt();
  if (e = e ?? ((m = game.scenes) == null ? void 0 : m.viewed), !e) return null;
  rp(e);
  const r = St(e);
  if (!r.length)
    return console.warn(`${ne} | applyState skipped: scene has no criteria.`), null;
  const o = Sa(e, r), s = Ca({ ...o, ...t ?? {} }, r), a = r.filter((g) => (o == null ? void 0 : o[g.key]) !== (s == null ? void 0 : s[g.key])).map((g) => g.key), l = a.length > 0;
  l && await jg(e, s, r);
  const u = l ? s : o, [d, f] = await Promise.all([
    zf(u, e, { changedKeys: a }),
    ih(u, e, { changedKeys: a })
  ]), h = Rt() - i;
  return _("Criteria apply telemetry", {
    sceneId: e.id,
    changedKeys: a,
    didChange: l,
    queuedMs: n,
    durationMs: h,
    tiles: d,
    placeables: f
  }), Hooks.callAll("eidolon-utilities.criteriaStateApplied", e, u), u;
}
c(Np, "applyStateInternal");
async function rh(t, e) {
  var l;
  if (e = e ?? ((l = game.scenes) == null ? void 0 : l.viewed), !e) return null;
  const n = e.id ?? "__viewed__", i = Rt(), r = Fo.get(n) ?? Promise.resolve();
  let o = null;
  const s = r.catch(() => null).then(async () => {
    const u = Rt() - i;
    return Np(t, e, u);
  });
  o = s;
  const a = s.finally(() => {
    Fo.get(n) === a && Fo.delete(n);
  });
  return Fo.set(n, a), o;
}
c(rh, "applyState$1");
function $p(t) {
  var e;
  return t = t ?? ((e = game.scenes) == null ? void 0 : e.viewed), t ? Pf(t) : null;
}
c($p, "getVersion");
async function oh(t, e) {
  var n;
  e = e ?? ((n = game.scenes) == null ? void 0 : n.viewed), e != null && e.setFlag && await e.setFlag(ne, Ff, Number(t));
}
c(oh, "setVersion");
async function Fp(t) {
  return oh(Df, t);
}
c(Fp, "markCurrentVersion");
const _r = "Standard", Dp = {
  nolights: "No Lights"
}, Pp = /* @__PURE__ */ c((...t) => console.log(`${ne} | criteria indexer:`, ...t), "log");
function Rp() {
  xr({
    tag: "Map",
    positionMap: { 0: "mood", 1: "variant", 2: "effect" },
    positionMap4: { 0: "mood", 1: "stage", 2: "variant", 3: "effect" },
    required: !0,
    maxCount: 1
  }), xr({ tag: "Floor", positionMap: "inherit" }), xr({ tag: "Roof", positionMap: "inherit" }), xr({
    tag: "Weather",
    positionMap: { 1: "effect" }
  });
}
c(Rp, "registerDefaultConventions");
function Ss(t) {
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
c(Ss, "parseFileTags");
function Hp(t, e, n = _r) {
  return t != null && t.length ? t.map((i) => {
    const r = Ss(i == null ? void 0 : i.name);
    if (!r) return {};
    const o = {};
    for (const [s, a] of Object.entries(e)) {
      const l = r[Number(s)];
      l != null && l !== n && (o[a] = l);
    }
    return o;
  }) : [];
}
c(Hp, "buildFileIndex");
function qp(t, e) {
  return t.map((n, i) => {
    const r = [...e[n] ?? /* @__PURE__ */ new Set()].sort(), s = r.includes(_r) ? _r : r[0] ?? _r, a = Yc(n);
    return a.key = n, a.label = Dp[n] ?? n.charAt(0).toUpperCase() + n.slice(1), a.values = r.length ? r : [_r], a.default = a.values.includes(s) ? s : a.values[0], a.order = i, a;
  });
}
c(qp, "buildCriteriaDefinitions");
async function Ju(t, e, n, { dryRun: i = !1 } = {}) {
  const r = t.getFlag("monks-active-tiles", "files");
  if (!(r != null && r.length)) return null;
  const o = Hp(r, e), s = Vf(o, { files: r });
  for (const a of r) {
    const l = Ss(a == null ? void 0 : a.name);
    if (l)
      for (const [u, d] of Object.entries(e)) {
        const f = l[Number(u)];
        f != null && n[d] && n[d].add(f);
      }
  }
  return i || (await t.setFlag(ne, _i, s), typeof t.unsetFlag == "function" && await t.unsetFlag(ne, xi)), { files: r.length };
}
c(Ju, "indexTile");
function Qu(t, e, n) {
  return t.positionMap === "inherit" ? n : e >= 4 && t.positionMap4 ? t.positionMap4 : t.positionMap;
}
c(Qu, "resolvePositionMap");
function Bp(t, e) {
  return e >= 4 && t.positionMap4 ? t.positionMap4 : t.positionMap;
}
c(Bp, "resolvePrimaryPositionMap");
function jp(t) {
  if (!Array.isArray(t)) return eh();
  const e = /* @__PURE__ */ new Map();
  for (const n of t)
    n != null && n.tag && e.set(n.tag, { ...n });
  return e;
}
c(jp, "resolveConventions");
async function Up(t, e = {}) {
  var w, E, C, O, k, x, $;
  t != null && typeof t == "object" && !t.id && !t.tiles && (e = { ...t, ...e }, t = null);
  const {
    dryRun: n = !1,
    force: i = !1
  } = e;
  if (t = t ?? ((w = game.scenes) == null ? void 0 : w.viewed), !t) throw new Error("No scene provided to indexScene.");
  if (!globalThis.Tagger) throw new Error("Tagger is required to index scene criteria.");
  if (!i && Pf(t) >= Df)
    throw new Error(
      `Scene "${t.name}" is already criteria-indexed. Use force: true to re-index.`
    );
  const r = jp(e.conventions), o = { sceneId: t.id };
  let s = null, a = null, l = 3;
  for (const [D, N] of r) {
    if (!N.required) continue;
    const F = Tagger.getByTag(D, o) ?? [];
    if (!F.length) throw new Error(`No ${D} tile found.`);
    if (N.maxCount && F.length > N.maxCount)
      throw new Error(`Expected ${N.maxCount} ${D} tile(s), found ${F.length}.`);
    s = N, a = F[0];
    const M = a.getFlag("monks-active-tiles", "files");
    if (!(M != null && M.length)) throw new Error(`${D} tile has no MATT files.`);
    const R = Ss((E = M[0]) == null ? void 0 : E.name);
    if (!(R != null && R.length))
      throw new Error(`Cannot parse bracket tags from: ${((C = M[0]) == null ? void 0 : C.name) ?? "<unknown>"}`);
    if (R.length < 3)
      throw new Error(`Expected 3+ bracket tags, found ${R.length}.`);
    l = R.length, l === 3 && ((O = s.positionMap) == null ? void 0 : O[2]) === "effect" && M.some((j) => {
      const H = Ss(j == null ? void 0 : j.name);
      return (H == null ? void 0 : H[2]) === "No Lights";
    }) && (s = {
      ...s,
      positionMap: { ...s.positionMap, 2: "nolights" }
    }, r.set(D, s));
    break;
  }
  if (!s)
    throw new Error("No required tile convention registered. Register conventions before indexing.");
  const u = Bp(s, l), d = [], f = Object.keys(u).map(Number).sort((D, N) => D - N);
  for (const D of f) {
    const N = u[D];
    d.includes(N) || d.push(N);
  }
  const h = {};
  for (const D of d)
    h[D] = /* @__PURE__ */ new Set();
  for (const [, D] of r) {
    if (D.positionMap === "inherit") continue;
    const N = Qu(D, l, u);
    for (const F of Object.values(N))
      h[F] || (h[F] = /* @__PURE__ */ new Set(), d.includes(F) || d.push(F));
  }
  const m = {}, g = Ip();
  for (const [D, N] of r) {
    const F = Tagger.getByTag(D, o) ?? [], M = Qu(N, l, u), R = D.toLowerCase(), B = [];
    for (const j of F) {
      const H = await Ju(j, M, h, { dryRun: n });
      H && B.push(H);
    }
    m[R] = N.maxCount === 1 ? B[0] ?? null : B;
  }
  if (g.length > 0) {
    const D = t.getEmbeddedCollection("Tile") ?? [], N = new Set(r.keys());
    for (const F of D) {
      if ((((x = (k = globalThis.Tagger) == null ? void 0 : k.getTags) == null ? void 0 : x.call(k, F)) ?? []).some((j) => N.has(j))) continue;
      const B = F.getFlag("monks-active-tiles", "files");
      if (B != null && B.length)
        for (const j of g)
          try {
            const H = j(t, F, B);
            if (H != null && H.positionMap) {
              await Ju(F, H.positionMap, h, { dryRun: n });
              break;
            }
          } catch (H) {
            console.warn(`${ne} | Indexing hook error:`, H);
          }
    }
  }
  const y = qp(d, h);
  n || (await Ea(t, y), await Fp(t));
  const v = s.tag.toLowerCase();
  Pp(
    n ? "Dry run complete" : "Indexing complete",
    `- ${y.length} criteria,`,
    `${(($ = m[v]) == null ? void 0 : $.files) ?? 0} ${s.tag.toLowerCase()} files`
  );
  const b = Array.from(r.keys()).filter((D) => D !== s.tag).some((D) => {
    const N = m[D.toLowerCase()];
    return Array.isArray(N) ? N.length > 0 : !!N;
  });
  return {
    criteria: y,
    state: y.reduce((D, N) => (D[N.key] = N.default, D), {}),
    tiles: m,
    overlayMode: b
  };
}
c(Up, "indexScene");
var jd, Ue, yt, bt, Ii, tt, Jt, Fn, ma, fe, sh, ah, lh, Xl, ch, Jl, uh, Nr, Ql;
const Ot = class Ot extends sn(on) {
  constructor(n = {}) {
    var i;
    super(n);
    A(this, fe);
    A(this, Ue, null);
    A(this, yt, []);
    A(this, bt, {});
    A(this, Ii, !1);
    A(this, tt, null);
    A(this, Jt, null);
    A(this, Fn, null);
    A(this, ma, 120);
    this.setScene(n.scene ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null);
  }
  setScene(n) {
    var i;
    I(this, Ue, n ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null), T(this, fe, sh).call(this);
  }
  get scene() {
    return p(this, Ue);
  }
  async _prepareContext() {
    var r;
    const n = !!p(this, Ue), i = n && p(this, yt).length > 0;
    return {
      hasScene: n,
      hasCriteria: i,
      sceneName: ((r = p(this, Ue)) == null ? void 0 : r.name) ?? S("EIDOLON.CriteriaSwitcher.NoScene", "No active scene"),
      labels: {
        subtitle: S(
          "EIDOLON.CriteriaSwitcher.Subtitle",
          "Switch criteria live and immediately apply all mapped updates."
        ),
        empty: S(
          "EIDOLON.CriteriaSwitcher.Empty",
          "No criteria found for this scene. Configure criteria first."
        ),
        reset: S("EIDOLON.CriteriaSwitcher.Reset", "Reset Defaults"),
        close: S("EIDOLON.CriteriaSwitcher.Close", "Close"),
        applying: S("EIDOLON.CriteriaSwitcher.Applying", "Applying changes..."),
        ready: S("EIDOLON.CriteriaSwitcher.Ready", "Ready")
      },
      criteria: p(this, yt).map((o) => ({
        key: o.key,
        label: o.label || o.key,
        values: o.values.map((s) => {
          var a;
          return {
            value: s,
            selected: ((a = p(this, bt)) == null ? void 0 : a[o.key]) === s
          };
        }),
        defaultValue: o.default
      })),
      stateSummary: T(this, fe, Ql).call(this)
    };
  }
  _onRender(n, i) {
    super._onRender(n, i), T(this, fe, ah).call(this), T(this, fe, lh).call(this);
  }
  async _onClose(n) {
    return p(this, tt) !== null && (clearTimeout(p(this, tt)), I(this, tt, null)), p(this, Fn) !== null && (Hooks.off("eidolon-utilities.criteriaStateApplied", p(this, Fn)), I(this, Fn, null)), super._onClose(n);
  }
};
Ue = new WeakMap(), yt = new WeakMap(), bt = new WeakMap(), Ii = new WeakMap(), tt = new WeakMap(), Jt = new WeakMap(), Fn = new WeakMap(), ma = new WeakMap(), fe = new WeakSet(), sh = /* @__PURE__ */ c(function() {
  if (!p(this, Ue)) {
    I(this, yt, []), I(this, bt, {});
    return;
  }
  I(this, yt, St(p(this, Ue)).sort((n, i) => n.order - i.order)), I(this, bt, Sa(p(this, Ue), p(this, yt)));
}, "#hydrateFromScene"), ah = /* @__PURE__ */ c(function() {
  var i, r;
  const n = this.element;
  n instanceof HTMLElement && (n.querySelectorAll("[data-criteria-key]").forEach((o) => {
    o.addEventListener("change", (s) => {
      const a = s.currentTarget;
      if (!(a instanceof HTMLSelectElement)) return;
      const l = a.dataset.criteriaKey;
      l && (I(this, bt, {
        ...p(this, bt),
        [l]: a.value
      }), T(this, fe, ch).call(this, { [l]: a.value }));
    });
  }), (i = n.querySelector("[data-action='reset-defaults']")) == null || i.addEventListener("click", () => {
    T(this, fe, uh).call(this);
  }), (r = n.querySelector("[data-action='close-switcher']")) == null || r.addEventListener("click", () => {
    this.close();
  }));
}, "#bindEvents"), lh = /* @__PURE__ */ c(function() {
  p(this, Fn) === null && I(this, Fn, Hooks.on("eidolon-utilities.criteriaStateApplied", (n, i) => {
    !p(this, Ue) || (n == null ? void 0 : n.id) !== p(this, Ue).id || p(this, Ii) || (I(this, bt, { ...i ?? {} }), this.render({ force: !0 }));
  }));
}, "#ensureSyncHook"), Xl = /* @__PURE__ */ c(async function(n) {
  var i, r;
  if (p(this, Ue)) {
    T(this, fe, Nr).call(this, "applying"), I(this, Ii, !0);
    try {
      const o = await rh(n, p(this, Ue));
      o && I(this, bt, o), T(this, fe, Nr).call(this, "ready"), this.render({ force: !0 });
    } catch (o) {
      console.error(`${ne} | Failed to apply criteria state`, o), (r = (i = ui.notifications) == null ? void 0 : i.error) == null || r.call(
        i,
        S(
          "EIDOLON.CriteriaSwitcher.ApplyError",
          "Failed to apply the selected criteria state."
        )
      ), T(this, fe, Nr).call(this, "error", (o == null ? void 0 : o.message) ?? "Unknown error");
    } finally {
      I(this, Ii, !1), p(this, Jt) && T(this, fe, Jl).call(this);
    }
  }
}, "#applyPartialState"), ch = /* @__PURE__ */ c(function(n) {
  I(this, Jt, {
    ...p(this, Jt) ?? {},
    ...n ?? {}
  }), p(this, tt) !== null && clearTimeout(p(this, tt)), T(this, fe, Nr).call(this, "applying"), I(this, tt, setTimeout(() => {
    I(this, tt, null), T(this, fe, Jl).call(this);
  }, p(this, ma)));
}, "#queuePartialState"), Jl = /* @__PURE__ */ c(async function() {
  if (p(this, Ii) || !p(this, Jt)) return;
  const n = p(this, Jt);
  I(this, Jt, null), await T(this, fe, Xl).call(this, n);
}, "#flushPendingState"), uh = /* @__PURE__ */ c(async function() {
  if (!p(this, yt).length) return;
  const n = p(this, yt).reduce((i, r) => (i[r.key] = r.default, i), {});
  I(this, bt, n), p(this, tt) !== null && (clearTimeout(p(this, tt)), I(this, tt, null)), I(this, Jt, null), await T(this, fe, Xl).call(this, n);
}, "#resetToDefaults"), Nr = /* @__PURE__ */ c(function(n, i = "") {
  const r = this.element;
  if (!(r instanceof HTMLElement)) return;
  const o = r.querySelector("[data-role='status']");
  if (o instanceof HTMLElement)
    switch (o.dataset.mode = n, n) {
      case "applying":
        o.textContent = S("EIDOLON.CriteriaSwitcher.Applying", "Applying changes...");
        break;
      case "error":
        o.textContent = `${S("EIDOLON.CriteriaSwitcher.Error", "Error")}: ${i}`;
        break;
      case "ready":
      default:
        o.textContent = `${S("EIDOLON.CriteriaSwitcher.Ready", "Ready")}: ${T(this, fe, Ql).call(this)}`;
        break;
    }
}, "#setStatus"), Ql = /* @__PURE__ */ c(function() {
  return p(this, yt).length ? `[${p(this, yt).map((n) => {
    var i;
    return ((i = p(this, bt)) == null ? void 0 : i[n.key]) ?? n.default;
  }).join(" | ")}]` : "-";
}, "#formatStateSummary"), c(Ot, "CriteriaSwitcherApplication"), ue(Ot, "APP_ID", `${ne}-criteria-switcher`), ue(Ot, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Le(Ot, Ot, "DEFAULT_OPTIONS"),
  {
    id: Ot.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((jd = Le(Ot, Ot, "DEFAULT_OPTIONS")) == null ? void 0 : jd.classes) ?? [], "eidolon-criteria-switcher-window", "themed"])
    ),
    tag: "section",
    window: {
      title: S("EIDOLON.CriteriaSwitcher.Title", "Criteria Switcher"),
      icon: "fa-solid fa-sliders",
      resizable: !1
    },
    position: {
      width: 420,
      height: "auto"
    }
  },
  { inplace: !1 }
)), ue(Ot, "PARTS", {
  content: {
    template: `modules/${ne}/templates/criteria-switcher.html`
  }
});
let Kl = Ot;
const Vp = va(Kl);
let Ni = null;
function Gp(t) {
  var e;
  return t ?? ((e = game.scenes) == null ? void 0 : e.viewed) ?? null;
}
c(Gp, "resolveScene");
function Wp(t) {
  var e;
  return !!(t != null && t.rendered && ((e = t == null ? void 0 : t.element) != null && e.isConnected));
}
c(Wp, "isRendered");
function Oa() {
  return Wp(Ni) ? Ni : (Ni = null, null);
}
c(Oa, "getCriteriaSwitcher");
function dh(t) {
  var i, r, o, s, a;
  const e = Gp(t);
  if (!e)
    return (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "No active scene to open the criteria switcher."), null;
  if (!Ta(e))
    return (s = (o = ui.notifications) == null ? void 0 : o.warn) == null || s.call(o, "You do not have permission to manage scene criteria."), null;
  const n = Oa();
  return n ? (n.setScene(e), n.render({ force: !0 }), (a = n.bringToFront) == null || a.call(n), n) : (Ni = Vp({ scene: e }), Ni.render({ force: !0 }), Ni);
}
c(dh, "openCriteriaSwitcher");
function fh() {
  const t = Oa();
  t && (t.close(), Ni = null);
}
c(fh, "closeCriteriaSwitcher");
function Zc(t) {
  return Oa() ? (fh(), null) : dh(t);
}
c(Zc, "toggleCriteriaSwitcher");
const zp = {
  SCHEMA_VERSION: Kc,
  applyState: rh,
  getState: _p,
  getVersion: $p,
  setVersion: oh,
  getCriteria(t) {
    var e;
    return St(t ?? ((e = game.scenes) == null ? void 0 : e.viewed));
  },
  setCriteria(t, e) {
    var n;
    return Ea(e ?? ((n = game.scenes) == null ? void 0 : n.viewed), t);
  },
  updateTiles: zf,
  updatePlaceables: ih,
  indexScene: Up,
  openCriteriaSwitcher: dh,
  closeCriteriaSwitcher: fh,
  toggleCriteriaSwitcher: Zc,
  findBestMatch: Zg,
  findFileIndex: ep,
  resolveRules: Hf,
  // Convention registration API
  registerTileConvention: xr,
  unregisterTileConvention: Cp,
  getTileConventions: eh,
  // Hidden light provider API
  registerHiddenLightProvider: Zf,
  unregisterHiddenLightProvider: Ep,
  // Indexing hook API
  registerIndexingHook: Tp,
  unregisterIndexingHook: Lp
};
function Yp(t) {
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
c(Yp, "findTabNav");
function Kp(t, e) {
  var i, r, o;
  return t instanceof HTMLElement ? [
    (i = t.querySelector(".tab[data-tab]")) == null ? void 0 : i.parentElement,
    t.querySelector(".sheet-body"),
    (o = (r = e == null ? void 0 : e.parentElement) == null ? void 0 : r.querySelector) == null ? void 0 : o.call(r, ":scope > .sheet-body"),
    e == null ? void 0 : e.parentElement
  ].find((s) => s instanceof HTMLElement) ?? null : null;
}
c(Kp, "findTabBody");
function Xp(t, e) {
  var n, i, r, o, s, a, l;
  return ((n = t == null ? void 0 : t.dataset) == null ? void 0 : n.group) ?? ((o = (r = (i = t == null ? void 0 : t.querySelector) == null ? void 0 : i.call(t, "[data-group]")) == null ? void 0 : r.dataset) == null ? void 0 : o.group) ?? ((l = (a = (s = e == null ? void 0 : e.querySelector) == null ? void 0 : s.call(e, ".tab[data-group]")) == null ? void 0 : a.dataset) == null ? void 0 : l.group) ?? null;
}
c(Xp, "getTabGroup");
function Jp(t, e, n) {
  if (!(t instanceof HTMLElement)) return;
  t.textContent = "";
  const i = document.createElement("i");
  i.className = n, i.setAttribute("inert", ""), t.append(i, " ");
  const r = document.createElement("span");
  r.textContent = e, t.append(r);
}
c(Jp, "setTabButtonContent");
function Qp(t, e, n) {
  const i = t.querySelector("[data-tab]"), r = (i == null ? void 0 : i.tagName) || "A", o = document.createElement(r);
  return i instanceof HTMLElement && (o.className = i.className), o.classList.remove("active"), r === "BUTTON" && (o.type = "button"), o.dataset.action = "tab", o.dataset.tab = n, e && (o.dataset.group = e), o.setAttribute("aria-selected", "false"), o.setAttribute("aria-pressed", "false"), o;
}
c(Qp, "createTabButton");
function Zp(t, e, n) {
  const i = document.createElement("div");
  i.classList.add("tab"), i.dataset.tab = n, e && (i.dataset.group = e), i.dataset.applicationPart = n, i.setAttribute("hidden", "true");
  const r = If(t);
  return t.insertBefore(i, r ?? null), i;
}
c(Zp, "createTabPanel");
function Xa(t, e, n, i, r) {
  var a;
  if (!(i instanceof HTMLElement) || !(r instanceof HTMLElement)) return;
  const o = (a = t == null ? void 0 : t.tabGroups) == null ? void 0 : a[e];
  if (typeof o == "string" ? o === n : i.classList.contains("active") || r.classList.contains("active")) {
    i.classList.add("active"), i.setAttribute("aria-selected", "true"), i.setAttribute("aria-pressed", "true"), r.classList.add("active"), r.removeAttribute("hidden"), r.removeAttribute("aria-hidden");
    return;
  }
  i.classList.remove("active"), i.setAttribute("aria-selected", "false"), i.setAttribute("aria-pressed", "false"), r.classList.remove("active"), r.setAttribute("hidden", "true");
}
c(Xa, "syncTabVisibility");
function eu(t, e, n, i, r) {
  const o = Yp(e), s = Kp(e, o);
  if (!(o instanceof HTMLElement) || !(s instanceof HTMLElement)) return null;
  const a = Xp(o, s);
  let l = o.querySelector(`[data-tab="${n}"]`);
  l instanceof HTMLElement || (l = Qp(o, a, n), o.appendChild(l)), Jp(l, i, r);
  let u = s.querySelector(`.tab[data-tab="${n}"]`);
  u instanceof HTMLElement || (u = Zp(s, a, n));
  const d = `data-eidolon-bound-${n}`;
  return l.hasAttribute(d) || (l.addEventListener("click", () => {
    Tf(t, n, a), requestAnimationFrame(() => {
      Xa(t, a, n, l, u);
    });
  }), l.setAttribute(d, "true")), Xa(t, a, n, l, u), requestAnimationFrame(() => {
    Xa(t, a, n, l, u);
  }), ey(t, o), u;
}
c(eu, "ensureTileConfigTab");
function ey(t, e) {
  !(t != null && t.setPosition) || !(e instanceof HTMLElement) || requestAnimationFrame(() => {
    var o;
    if (e.scrollWidth <= e.clientWidth) return;
    const n = e.scrollWidth - e.clientWidth, i = t.element instanceof HTMLElement ? t.element : (o = t.element) == null ? void 0 : o[0];
    if (!i) return;
    const r = i.offsetWidth || 480;
    t.setPosition({ width: r + n + 16 });
  });
}
c(ey, "fitNavWidth");
function hh(t) {
  var e;
  return ((e = t == null ? void 0 : t.getFlag) == null ? void 0 : e.call(t, "monks-active-tiles", "files")) ?? [];
}
c(hh, "getTileFiles$1");
function ty(t = []) {
  return {
    strategy: "select-one",
    defaultTarget: Zn(t, 0) ?? { indexHint: 0 },
    variants: [
      {
        criteria: {},
        target: Zn(t, 0) ?? { indexHint: 0 }
      }
    ]
  };
}
c(ty, "createDefaultTileCriteria");
function ny(t, e = {}) {
  var s, a;
  const { allowLegacy: n = !0 } = e, i = hh(t), r = (s = t == null ? void 0 : t.getFlag) == null ? void 0 : s.call(t, ne, _i);
  if (r) return Di(r, { files: i });
  if (!n) return null;
  const o = (a = t == null ? void 0 : t.getFlag) == null ? void 0 : a.call(t, ne, xi);
  return o ? Di(o, { files: i }) : null;
}
c(ny, "getTileCriteria");
async function Zu(t, e, n = {}) {
  if (!(t != null && t.setFlag)) return null;
  const {
    strictValidation: i = !0
  } = n, r = hh(t), o = Di(e, { files: r });
  if (!o)
    return typeof t.unsetFlag == "function" ? (await t.unsetFlag(ne, _i), await t.unsetFlag(ne, xi)) : (await t.setFlag(ne, _i, null), await t.setFlag(ne, xi, null)), null;
  if (i) {
    const s = Uf(o, { files: r });
    if (s.errors.length > 0)
      throw new Error(
        `Tile criteria contains ${s.errors.length} conflicting rule pair(s). Resolve clashes before saving.`
      );
  }
  return await t.setFlag(ne, _i, o), typeof t.unsetFlag == "function" && await t.unsetFlag(ne, xi), o;
}
c(Zu, "setTileCriteria");
const Zl = "__eidolon_any__", ec = "eidolon-tile-criteria", iy = "fa-solid fa-sliders", mh = Symbol.for("eidolon.tileCriteriaUiState"), ka = ["all", "unmapped", "mapped", "conflicts"];
function ry(t) {
  const e = t == null ? void 0 : t[mh];
  return !e || typeof e != "object" ? {
    filterQuery: "",
    filterMode: "all",
    selectedFileIndex: null
  } : {
    filterQuery: typeof e.filterQuery == "string" ? e.filterQuery : "",
    filterMode: ka.includes(e.filterMode) ? e.filterMode : "all",
    selectedFileIndex: Number.isInteger(e.selectedFileIndex) ? e.selectedFileIndex : null
  };
}
c(ry, "readUiState");
function oy(t, e) {
  if (!t || !e) return;
  typeof e.filterQuery == "string" && (t.filterQuery = e.filterQuery), ka.includes(e.filterMode) && (t.filterMode = e.filterMode), Number.isInteger(e.selectedFileIndex) && t.fileEntries.some((i) => i.index === e.selectedFileIndex) && (t.selectedFileIndex = e.selectedFileIndex);
}
c(oy, "applyUiState");
function sy(t) {
  const e = t == null ? void 0 : t.app, n = t == null ? void 0 : t.state;
  !e || !n || (e[mh] = {
    filterQuery: typeof n.filterQuery == "string" ? n.filterQuery : "",
    filterMode: ka.includes(n.filterMode) ? n.filterMode : "all",
    selectedFileIndex: Number.isInteger(n.selectedFileIndex) ? n.selectedFileIndex : null
  });
}
c(sy, "persistUiState");
function ay(t) {
  const e = (t == null ? void 0 : t.object) ?? (t == null ? void 0 : t.document) ?? null;
  return !(e != null && e.isEmbedded) || e.documentName !== "Tile" ? null : e;
}
c(ay, "getTileDocument");
function ly(t) {
  var e;
  return ((e = t == null ? void 0 : t.getFlag) == null ? void 0 : e.call(t, "monks-active-tiles", "files")) ?? [];
}
c(ly, "getTileFiles");
function cy(t, e) {
  var a;
  const n = (t == null ? void 0 : t.parent) ?? ((a = game.scenes) == null ? void 0 : a.viewed) ?? null, r = St(n).sort((l, u) => l.order - u.order).map((l) => ({
    key: l.key,
    label: l.label || l.key,
    values: [...l.values ?? []]
  })), o = new Set(r.map((l) => l.key)), s = /* @__PURE__ */ new Map();
  for (const l of (e == null ? void 0 : e.variants) ?? [])
    for (const [u, d] of Object.entries((l == null ? void 0 : l.criteria) ?? {}))
      o.has(u) || (s.has(u) || s.set(u, /* @__PURE__ */ new Set()), typeof d == "string" && d.trim() && s.get(u).add(d.trim()));
  for (const [l, u] of s.entries())
    r.push({
      key: l,
      label: l,
      values: [...u]
    });
  return r;
}
c(cy, "getCriteriaDefinitions");
function uy(t) {
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
    const o = r.pop();
    let s = e;
    for (const a of r)
      s.folders.has(a) || s.folders.set(a, {
        folders: /* @__PURE__ */ new Map(),
        files: []
      }), s = s.folders.get(a);
    s.files.push({ entry: n, name: o || n.label });
  }
  return e;
}
c(uy, "buildTree");
function dy(t, e) {
  const n = [t];
  let i = e;
  for (; i.files.length === 0 && i.folders.size === 1; ) {
    const [r, o] = i.folders.entries().next().value;
    n.push(r), i = o;
  }
  return {
    label: n.join("/"),
    node: i
  };
}
c(dy, "collapseFolderBranch");
function fy(t, e) {
  const n = t.rulesByFile.get(e) ?? [], i = [];
  for (const r of n) {
    const o = Object.entries(r.criteria ?? {}).filter(([, a]) => typeof a == "string" && a.trim());
    if (!o.length) {
      i.push("*");
      continue;
    }
    const s = o.map(([a, l]) => `${t.criteriaLabels.get(a) ?? a}: ${l}`).join(" · ");
    i.push(s);
  }
  return i;
}
c(fy, "getRuleSummariesForFile");
function tc(t) {
  var m, g;
  const e = ly(t), n = Xc(e), i = ny(t, { allowLegacy: !0 }) ?? ty(e), r = cy(t, i), o = new Map(r.map((y) => [y.key, y.label])), s = new Map(
    n.map((y) => [
      y.index,
      y.path || y.label
    ])
  ), a = Xr(i.defaultTarget, e), l = ((m = n[0]) == null ? void 0 : m.index) ?? 0, u = a >= 0 ? a : l, d = new Map(n.map((y) => [y.index, []]));
  let f = 1;
  for (const y of i.variants ?? []) {
    const v = Xr(y.target, e);
    v < 0 || (d.has(v) || d.set(v, []), d.get(v).push({
      id: f,
      criteria: { ...y.criteria ?? {} }
    }), f += 1);
  }
  const h = n.some((y) => y.index === u) ? u : ((g = n[0]) == null ? void 0 : g.index) ?? null;
  return {
    files: e,
    fileEntries: n,
    criteriaDefinitions: r,
    criteriaLabels: o,
    relativePaths: s,
    defaultIndex: u,
    selectedFileIndex: h,
    filterQuery: "",
    filterMode: "all",
    nextRuleId: f,
    rulesByFile: d,
    status: {
      mode: "ready",
      message: S("EIDOLON.TileCriteria.Ready", "Ready")
    }
  };
}
c(tc, "buildEditorState");
function nc(t, e) {
  return t.rulesByFile.has(e) || t.rulesByFile.set(e, []), t.rulesByFile.get(e);
}
c(nc, "getRulesForFile");
function hy(t) {
  return Object.fromEntries(
    Object.entries(t ?? {}).filter(([e, n]) => typeof e == "string" && e && typeof n == "string" && n.trim()).map(([e, n]) => [e, n.trim()])
  );
}
c(hy, "sanitizeRuleCriteria");
function gh(t) {
  const e = Zn(t.files, t.defaultIndex);
  if (!e) return null;
  const n = [], i = [];
  for (const [o, s] of t.rulesByFile.entries()) {
    const a = Zn(t.files, o);
    if (a)
      for (const [l, u] of s.entries()) {
        const d = hy(u.criteria);
        n.push({
          criteria: d,
          target: { ...a }
        }), i.push({
          fileIndex: o,
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
    normalized: Di(
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
c(gh, "buildTileCriteriaDraft");
function my(t) {
  var e;
  return ((e = gh(t)) == null ? void 0 : e.normalized) ?? null;
}
c(my, "exportTileCriteria");
function ed(t) {
  const e = gh(t);
  if (!(e != null && e.normalized))
    return {
      errors: [],
      warnings: [],
      errorFileIndexes: [],
      warningFileIndexes: []
    };
  const n = Uf(e.normalized, { files: t.files }), i = /* @__PURE__ */ c((a) => {
    const l = e.sources[a.leftIndex] ?? null, u = e.sources[a.rightIndex] ?? null;
    return {
      ...a,
      leftFileIndex: l == null ? void 0 : l.fileIndex,
      rightFileIndex: u == null ? void 0 : u.fileIndex
    };
  }, "mapConflict"), r = n.errors.map((a) => i(a)), o = n.warnings.map((a) => i(a)), s = /* @__PURE__ */ c((a) => {
    const l = /* @__PURE__ */ new Set();
    for (const u of a)
      Number.isInteger(u.leftFileIndex) && l.add(u.leftFileIndex), Number.isInteger(u.rightFileIndex) && l.add(u.rightFileIndex);
    return [...l];
  }, "toFileIndexes");
  return {
    errors: r,
    warnings: o,
    errorFileIndexes: s(r),
    warningFileIndexes: s(o)
  };
}
c(ed, "analyzeRuleConflicts");
function Do(t, e = "neutral") {
  const n = document.createElement("span");
  return n.classList.add("eidolon-tile-criteria__badge"), n.dataset.kind = e, n.textContent = t, n;
}
c(Do, "createBadge");
function gy(t, e = {}) {
  const n = typeof t == "string" ? t : "", {
    maxLength: i = 42,
    headLength: r = 20,
    tailLength: o = 16
  } = e;
  if (!n || n.length <= i) return n;
  const s = n.slice(0, r).trimEnd(), a = n.slice(-o).trimStart();
  return `${s}...${a}`;
}
c(gy, "middleEllipsis");
function py(t) {
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
      matches: /* @__PURE__ */ c((o) => r.test(String(o ?? "")), "matches")
    };
  } catch (r) {
    return {
      error: (r == null ? void 0 : r.message) ?? S("EIDOLON.TileCriteria.InvalidRegex", "Invalid regex."),
      matches: /* @__PURE__ */ c(() => !0, "matches")
    };
  }
}
c(py, "createRegexFilter");
function yy(t, e) {
  const n = document.createElement("select");
  n.dataset.criteriaKey = t.key;
  const i = document.createElement("option");
  i.value = Zl, i.textContent = "*", n.appendChild(i);
  const r = new Set(t.values ?? []);
  e && !r.has(e) && r.add(e);
  for (const o of r) {
    const s = document.createElement("option");
    s.value = o, s.textContent = o, n.appendChild(s);
  }
  return n.value = e ?? Zl, n;
}
c(yy, "createCriterionSelect");
function by(t, e, n, i) {
  var a;
  const r = document.createElement("div");
  r.classList.add("eidolon-tile-criteria__rule-editor");
  const o = document.createElement("div");
  o.classList.add("eidolon-tile-criteria__rule-grid");
  for (const l of e.criteriaDefinitions) {
    const u = document.createElement("label");
    u.classList.add("eidolon-tile-criteria__rule-field");
    const d = document.createElement("span");
    d.classList.add("eidolon-tile-criteria__criterion-label"), d.textContent = l.label, u.appendChild(d);
    const f = yy(l, (a = t.criteria) == null ? void 0 : a[l.key]);
    f.addEventListener("change", () => {
      f.value === Zl ? delete t.criteria[l.key] : t.criteria[l.key] = f.value, i();
    }), u.appendChild(f), o.appendChild(u);
  }
  r.appendChild(o);
  const s = document.createElement("button");
  return s.type = "button", s.classList.add("control", "ui-control", "eidolon-tile-criteria__rule-remove"), s.textContent = S("EIDOLON.TileCriteria.RemoveRule", "Remove"), s.addEventListener("click", () => {
    const u = nc(e, n).filter((d) => d.id !== t.id);
    e.rulesByFile.set(n, u), i();
  }), r.appendChild(s), r;
}
c(by, "renderRuleEditor");
const Jo = /* @__PURE__ */ new WeakMap();
function ph(t) {
  return (t == null ? void 0 : t.app) ?? (t == null ? void 0 : t.tile) ?? null;
}
c(ph, "getDialogOwner");
function vy(t) {
  for (const e of t) {
    const n = qe(e);
    if (n) return n;
    const i = qe(e == null ? void 0 : e.element);
    if (i) return i;
  }
  return null;
}
c(vy, "findDialogRoot$1");
function wy(t, e, n) {
  const i = t.state, r = i.fileEntries.find((y) => y.index === e);
  if (!r) return document.createElement("div");
  const o = document.createElement("section");
  o.classList.add("eidolon-tile-criteria__dialog-content");
  const s = document.createElement("header");
  s.classList.add("eidolon-tile-criteria__editor-header");
  const a = document.createElement("h4");
  a.textContent = i.relativePaths.get(r.index) || r.label, s.appendChild(a);
  const l = document.createElement("p");
  l.classList.add("notes"), l.textContent = `#${r.index + 1} · ${r.path || S("EIDOLON.TileCriteria.UnknownPath", "Unknown path")}`, s.appendChild(l), o.appendChild(s);
  const u = document.createElement("div");
  u.classList.add("eidolon-tile-criteria__editor-controls");
  const d = document.createElement("button");
  d.type = "button", d.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action"), i.defaultIndex === r.index ? (d.textContent = S("EIDOLON.TileCriteria.IsDefault", "Default Target"), d.disabled = !0) : (d.textContent = S("EIDOLON.TileCriteria.SetDefault", "Set As Default"), d.addEventListener("click", () => {
    i.defaultIndex = r.index, Xe(t), n();
  })), u.appendChild(d);
  const f = document.createElement("button");
  f.type = "button", f.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action", "secondary"), f.textContent = S("EIDOLON.TileCriteria.ClearFileRules", "Clear File Rules"), f.addEventListener("click", () => {
    i.rulesByFile.set(r.index, []), Xe(t), n();
  }), u.appendChild(f), o.appendChild(u);
  const h = document.createElement("div");
  h.classList.add("eidolon-tile-criteria__rule-editors");
  const m = nc(i, r.index);
  if (m.length)
    for (const y of m)
      h.appendChild(
        by(y, i, r.index, () => {
          Xe(t), n();
        })
      );
  else {
    const y = document.createElement("p");
    y.classList.add("notes"), y.textContent = S(
      "EIDOLON.TileCriteria.NoRulesForFile",
      "No rules map to this file yet. Add one to define when this variant should be active."
    ), h.appendChild(y);
  }
  o.appendChild(h);
  const g = document.createElement("button");
  return g.type = "button", g.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action"), g.textContent = S("EIDOLON.TileCriteria.AddRule", "Add Rule"), g.disabled = !i.criteriaDefinitions.length, g.addEventListener("click", () => {
    nc(i, r.index).push({
      id: i.nextRuleId,
      criteria: {}
    }), i.nextRuleId += 1, Xe(t), n();
  }), o.appendChild(g), o;
}
c(wy, "buildRuleEditorContent");
function Ey(t, e) {
  var f, h, m;
  const n = ph(t);
  if (!n) return;
  const i = Jo.get(n);
  if (i) {
    i.controller = t, i.fileIndex = e, (f = i.refresh) == null || f.call(i);
    return;
  }
  const r = {
    controller: t,
    fileIndex: e,
    host: null,
    refresh: null
  };
  Jo.set(n, r);
  const o = /* @__PURE__ */ c(() => {
    Jo.delete(n);
  }, "closeDialog"), s = /* @__PURE__ */ c(() => {
    r.host instanceof HTMLElement && r.host.replaceChildren(
      wy(r.controller, r.fileIndex, s)
    );
  }, "refreshDialog");
  r.refresh = s;
  const a = S("EIDOLON.TileCriteria.EditorTitle", "Edit Tile Criteria Rules"), l = '<div class="eidolon-tile-criteria-editor-host"></div>', u = S("EIDOLON.TileCriteria.CloseEditor", "Close"), d = (m = (h = foundry == null ? void 0 : foundry.applications) == null ? void 0 : h.api) == null ? void 0 : m.DialogV2;
  if (typeof (d == null ? void 0 : d.wait) == "function") {
    d.wait({
      window: { title: a },
      content: l,
      buttons: [{ action: "close", label: u, default: !0 }],
      render: /* @__PURE__ */ c((...g) => {
        var b;
        const y = vy(g), v = (b = y == null ? void 0 : y.querySelector) == null ? void 0 : b.call(y, ".eidolon-tile-criteria-editor-host");
        v instanceof HTMLElement && (r.host = v, s());
      }, "render"),
      close: o,
      rejectClose: !1
    }).catch((g) => {
      console.warn(`${ne} | Rule editor dialog failed`, g), o();
    });
    return;
  }
  o();
}
c(Ey, "openRuleEditorDialog");
function td(t) {
  var i;
  const e = ph(t);
  if (!e) return;
  const n = Jo.get(e);
  (i = n == null ? void 0 : n.refresh) == null || i.call(n);
}
c(td, "refreshOpenRuleEditor");
function ic(t, e) {
  return (t.rulesByFile.get(e) ?? []).length > 0;
}
c(ic, "hasRulesForFile");
function yh(t, e) {
  var n, i;
  return ((n = t == null ? void 0 : t.errorFileIndexes) == null ? void 0 : n.includes(e)) || ((i = t == null ? void 0 : t.warningFileIndexes) == null ? void 0 : i.includes(e));
}
c(yh, "hasConflictForFile");
function Sy(t, e, n) {
  switch (t.filterMode) {
    case "unmapped":
      return !ic(t, e.index);
    case "mapped":
      return ic(t, e.index);
    case "conflicts":
      return yh(n, e.index);
    case "all":
    default:
      return !0;
  }
}
c(Sy, "matchesFilterMode");
function Cy(t, e) {
  let n = 0, i = 0, r = 0;
  for (const o of t.fileEntries)
    ic(t, o.index) ? n += 1 : i += 1, yh(e, o.index) && (r += 1);
  return {
    all: t.fileEntries.length,
    mapped: n,
    unmapped: i,
    conflicts: r
  };
}
c(Cy, "getFilterModeCounts");
function Ty(t) {
  switch (t) {
    case "unmapped":
      return S("EIDOLON.TileCriteria.FilterModeUnmapped", "Unmapped");
    case "mapped":
      return S("EIDOLON.TileCriteria.FilterModeMapped", "Mapped");
    case "conflicts":
      return S("EIDOLON.TileCriteria.FilterModeConflicts", "Clashes");
    case "all":
    default:
      return S("EIDOLON.TileCriteria.FilterModeAll", "All");
  }
}
c(Ty, "getFilterModeLabel");
function bh(t, e, n, i, r) {
  var u, d;
  const o = [...t.folders.keys()].sort((f, h) => f.localeCompare(h));
  for (const f of o) {
    const h = dy(f, t.folders.get(f)), m = document.createElement("li");
    m.classList.add("eidolon-tile-criteria__tree-branch");
    const g = document.createElement("div");
    g.classList.add("document", "folder", "update", "eidolon-tile-criteria__folder-row");
    const y = document.createElement("i");
    y.classList.add("fa-solid", "fa-folder-open"), g.appendChild(y);
    const v = document.createElement("span");
    v.classList.add("eidolon-tile-criteria__tree-folder-label"), v.textContent = h.label, v.title = h.label, g.appendChild(v), m.appendChild(g);
    const b = document.createElement("ul");
    b.classList.add("eidolon-tile-criteria__tree"), b.dataset.folder = h.label, bh(h.node, e, n, i, b), b.childElementCount > 0 && m.appendChild(b), r.appendChild(m);
  }
  const s = [...t.files].sort((f, h) => f.name.localeCompare(h.name));
  if (!s.length) return;
  const a = document.createElement("li"), l = document.createElement("ul");
  l.classList.add("document-list", "eidolon-tile-criteria__document-list");
  for (const f of s) {
    const h = f.entry, m = h.index === e.selectedFileIndex, g = h.index === e.defaultIndex, y = fy(e, h.index), v = document.createElement("li");
    v.classList.add("document", "update", "eidolon-tile-criteria__tree-file");
    const b = document.createElement("button");
    b.type = "button", b.classList.add("eidolon-tile-criteria__file-row");
    const w = (u = i == null ? void 0 : i.errorFileIndexes) == null ? void 0 : u.includes(h.index), E = (d = i == null ? void 0 : i.warningFileIndexes) == null ? void 0 : d.includes(h.index);
    w ? b.classList.add("has-conflict") : E && b.classList.add("has-warning");
    const C = e.relativePaths.get(h.index) || h.path || f.name, O = [C];
    w ? O.push(
      S(
        "EIDOLON.TileCriteria.ConflictFileHint",
        "This file participates in one or more conflicting rules."
      )
    ) : E && O.push(
      S(
        "EIDOLON.TileCriteria.WarningFileHint",
        "This file has potentially redundant rules."
      )
    ), y.length || O.push(
      S(
        "EIDOLON.TileCriteria.UnmappedHint",
        "No criteria rules map to this file."
      )
    ), b.title = O.join(`
`), m && b.classList.add("is-selected"), b.addEventListener("click", () => {
      e.selectedFileIndex = h.index, Xe(n), Ey(n, h.index);
    });
    const k = document.createElement("span");
    k.classList.add("eidolon-tile-criteria__indicator"), k.dataset.kind = g ? "default" : y.length ? "mapped" : "unmapped", b.appendChild(k);
    const x = document.createElement("span");
    x.classList.add("eidolon-tile-criteria__file-content");
    const $ = document.createElement("span");
    $.classList.add("eidolon-tile-criteria__file-heading");
    const D = document.createElement("span");
    D.classList.add("eidolon-tile-criteria__file-title"), D.textContent = gy(f.name || h.label), D.title = C, $.appendChild(D);
    const N = Do(`#${h.index + 1}`, "meta");
    N.classList.add("eidolon-tile-criteria__index-badge"), $.appendChild(N), x.appendChild($);
    const F = document.createElement("span");
    F.classList.add("eidolon-tile-criteria__badges"), g && F.appendChild(Do(S("EIDOLON.TileCriteria.DefaultBadge", "Default"), "default"));
    const M = y.slice(0, 2);
    for (const R of M)
      F.appendChild(Do(R, "rule"));
    if (y.length > M.length && F.appendChild(Do(`+${y.length - M.length}`, "meta")), x.appendChild(F), b.appendChild(x), w || E) {
      const R = document.createElement("span");
      R.classList.add("eidolon-tile-criteria__row-warning"), R.dataset.mode = w ? "error" : "warning", R.innerHTML = '<i class="fa-solid fa-triangle-exclamation" inert=""></i>', b.appendChild(R);
    }
    v.appendChild(b), l.appendChild(v);
  }
  a.appendChild(l), r.appendChild(a);
}
c(bh, "renderTreeNode");
function Ly(t, e, n, i = {}) {
  const r = document.createElement("section");
  r.classList.add("eidolon-tile-criteria__tree-panel");
  const o = py(t.filterQuery), s = Cy(t, n);
  t.filterMode !== "all" && s[t.filterMode] === 0 && (t.filterMode = "all");
  const a = document.createElement("div");
  a.classList.add("eidolon-tile-criteria__toolbar");
  const l = document.createElement("div");
  l.classList.add("eidolon-tile-criteria__mode-bar");
  for (const w of ka) {
    const E = document.createElement("button");
    E.type = "button", E.classList.add("control", "ui-control", "eidolon-tile-criteria__mode-button"), E.dataset.mode = w, E.textContent = Ty(w);
    const C = w === "all" || s[w] > 0;
    E.disabled = !C, C || (E.dataset.tooltip = S(
      "EIDOLON.TileCriteria.FilterModeUnavailable",
      "No entries currently match this filter."
    ), E.title = E.dataset.tooltip), t.filterMode === w ? (E.classList.add("is-active"), E.setAttribute("aria-pressed", "true")) : E.setAttribute("aria-pressed", "false"), E.addEventListener("click", () => {
      t.filterMode !== w && (t.filterMode = w, Xe(e));
    }), l.appendChild(E);
  }
  a.appendChild(l);
  const u = document.createElement("div");
  u.classList.add("eidolon-tile-criteria__filter-row");
  const d = document.createElement("input");
  d.type = "text", d.classList.add("eidolon-tile-criteria__filter-input"), d.placeholder = S("EIDOLON.TileCriteria.FilterPlaceholder", "Regex filter (path)"), d.value = t.filterQuery, d.autocomplete = "off", d.addEventListener("keydown", (w) => {
    w.stopPropagation(), w.key === "Enter" && w.preventDefault();
  }), d.addEventListener("keyup", (w) => {
    w.stopPropagation();
  }), d.addEventListener("change", (w) => {
    w.stopPropagation();
  }), d.addEventListener("input", (w) => {
    w.stopPropagation();
    const E = d.selectionStart ?? d.value.length, C = d.selectionEnd ?? E;
    t.filterQuery = d.value, Xe(e), requestAnimationFrame(() => {
      const O = e.section.querySelector(".eidolon-tile-criteria__filter-input");
      if (O instanceof HTMLInputElement) {
        O.focus();
        try {
          O.setSelectionRange(E, C);
        } catch {
        }
      }
    });
  }), u.appendChild(d);
  const f = document.createElement("div");
  f.classList.add("eidolon-tile-criteria__toolbar-actions");
  const h = document.createElement("button");
  h.type = "button";
  const m = S("EIDOLON.TileCriteria.Save", "Save Rules");
  h.classList.add("control", "ui-control", "eidolon-tile-criteria__toolbar-action", "icon-only"), h.dataset.tooltip = m, h.setAttribute("aria-label", m), h.title = m, h.innerHTML = '<i class="fa-solid fa-floppy-disk" inert=""></i>', h.disabled = n.errors.length > 0, h.addEventListener("click", () => {
    var w;
    (w = i.onSave) == null || w.call(i);
  }), f.appendChild(h);
  const g = document.createElement("button");
  g.type = "button";
  const y = S("EIDOLON.TileCriteria.Clear", "Clear Rules");
  if (g.classList.add("control", "ui-control", "secondary", "eidolon-tile-criteria__toolbar-action", "icon-only"), g.dataset.tooltip = y, g.setAttribute("aria-label", y), g.title = y, g.innerHTML = '<i class="fa-solid fa-trash" inert=""></i>', g.addEventListener("click", () => {
    var w;
    (w = i.onClear) == null || w.call(i);
  }), f.appendChild(g), u.appendChild(f), a.appendChild(u), r.appendChild(a), o.error) {
    const w = document.createElement("p");
    w.classList.add("notes", "eidolon-tile-criteria__filter-error"), w.textContent = `${S("EIDOLON.TileCriteria.InvalidRegex", "Invalid regex")}: ${o.error}`, r.appendChild(w);
  }
  const v = document.createElement("div");
  v.classList.add("eidolon-tile-criteria__library-tree");
  const b = t.fileEntries.filter((w) => {
    const E = t.relativePaths.get(w.index) || w.path || w.label;
    return Sy(t, w, n) && o.matches(E);
  });
  if (t.fileEntries.length)
    if (b.length) {
      const w = document.createElement("ul");
      w.classList.add("eidolon-tile-criteria__tree"), bh(uy(b), t, e, n, w), v.appendChild(w);
    } else {
      const w = document.createElement("p");
      w.classList.add("notes"), w.textContent = S("EIDOLON.TileCriteria.NoMatches", "No variants match this filter."), v.appendChild(w);
    }
  else {
    const w = document.createElement("p");
    w.classList.add("notes"), w.textContent = S("EIDOLON.TileCriteria.NoVariants", "No MATT variants found"), v.appendChild(w);
  }
  return r.appendChild(v), r;
}
c(Ly, "renderTreePanel");
function Xe(t) {
  const { section: e, state: n } = t, i = ed(n);
  sy(t), e.replaceChildren();
  const r = /* @__PURE__ */ c(async () => {
    try {
      const s = ed(n);
      if (s.errors.length) {
        n.status = {
          mode: "error",
          message: S(
            "EIDOLON.TileCriteria.ConflictSaveBlocked",
            `Resolve ${s.errors.length} conflict(s) before saving tile criteria rules.`
          )
        }, Xe(t);
        return;
      }
      const a = my(n);
      if (!a) {
        n.status = {
          mode: "error",
          message: S("EIDOLON.TileCriteria.Invalid", "Invalid rules. Select valid target variants.")
        }, Xe(t);
        return;
      }
      await Zu(t.tile, a);
      const l = n.filterQuery, u = n.filterMode, d = n.selectedFileIndex;
      t.state = tc(t.tile), t.state.filterQuery = l, t.state.filterMode = u, Number.isInteger(d) && (t.state.selectedFileIndex = d), t.state.status = {
        mode: "ready",
        message: S("EIDOLON.TileCriteria.Saved", "Tile criteria rules saved.")
      }, Xe(t), td(t);
    } catch (s) {
      console.error(`${ne} | Failed to save tile criteria`, s), n.status = {
        mode: "error",
        message: (s == null ? void 0 : s.message) ?? "Failed to save tile criteria rules."
      }, Xe(t);
    }
  }, "handleSave"), o = /* @__PURE__ */ c(async () => {
    try {
      await Zu(t.tile, null);
      const s = n.filterQuery, a = n.filterMode, l = n.selectedFileIndex;
      t.state = tc(t.tile), t.state.filterQuery = s, t.state.filterMode = a, Number.isInteger(l) && (t.state.selectedFileIndex = l), t.state.status = {
        mode: "ready",
        message: S("EIDOLON.TileCriteria.Cleared", "Tile criteria rules cleared.")
      }, Xe(t), td(t);
    } catch (s) {
      console.error(`${ne} | Failed to clear tile criteria`, s), n.status = {
        mode: "error",
        message: (s == null ? void 0 : s.message) ?? "Failed to clear tile criteria rules."
      }, Xe(t);
    }
  }, "handleClear");
  if (e.appendChild(Ly(n, t, i, {
    onSave: r,
    onClear: o
  })), i.errors.length || i.warnings.length) {
    const s = document.createElement("section");
    s.classList.add("eidolon-tile-criteria__conflicts");
    const a = document.createElement("p");
    a.classList.add("eidolon-tile-criteria__conflict-summary", "notes"), i.errors.length ? (a.dataset.mode = "error", a.textContent = S(
      "EIDOLON.TileCriteria.ConflictSummary",
      `${i.errors.length} conflict(s) must be resolved before saving${i.warnings.length ? ` (${i.warnings.length} warning(s))` : ""}.`
    )) : (a.dataset.mode = "warning", a.textContent = S(
      "EIDOLON.TileCriteria.WarningSummary",
      `${i.warnings.length} potential issue(s) detected.`
    )), s.appendChild(a);
    const l = document.createElement("p");
    l.classList.add("eidolon-tile-criteria__conflict-hint", "notes"), l.textContent = S(
      "EIDOLON.TileCriteria.ConflictHint",
      "Files involved in clashes are marked in red with a warning icon."
    ), s.appendChild(l), e.appendChild(s);
  }
  if (n.status.mode === "error" || n.status.mode === "warning") {
    const s = document.createElement("p");
    s.classList.add("eidolon-tile-criteria__status", "notes"), s.dataset.mode = n.status.mode, s.textContent = n.status.message, e.appendChild(s);
  }
}
c(Xe, "renderController");
function Iy(t, e = null) {
  const n = document.createElement("section");
  n.classList.add("eidolon-tile-criteria");
  const i = tc(t);
  oy(i, ry(e));
  const r = {
    app: e,
    tile: t,
    section: n,
    state: i
  };
  return Xe(r), r;
}
c(Iy, "createController");
function Oy(t, e) {
  return eu(
    t,
    e,
    ec,
    S("EIDOLON.TileCriteria.TabLabel", "Criteria"),
    iy
  );
}
c(Oy, "ensureTileCriteriaTab");
function ky() {
  Hooks.on("renderTileConfig", (t, e) => {
    var l, u, d, f;
    const n = qe(e);
    if (!n) return;
    const i = ay(t);
    if (!i) return;
    if ((l = n.querySelector(".eidolon-tile-criteria")) == null || l.remove(), !wa()) {
      (u = n.querySelector(`.item[data-tab='${ec}']`)) == null || u.remove(), (d = n.querySelector(`.tab[data-tab='${ec}']`)) == null || d.remove();
      return;
    }
    const r = Iy(i, t), o = Oy(t, n);
    if (o instanceof HTMLElement) {
      o.replaceChildren(r.section), (f = t.setPosition) == null || f.call(t, { height: "auto" });
      return;
    }
    const s = (t == null ? void 0 : t.form) instanceof HTMLFormElement ? t.form : n instanceof HTMLFormElement ? n : n.querySelector("form");
    if (!(s instanceof HTMLFormElement)) return;
    const a = s.querySelector("button[type='submit']");
    a != null && a.parentElement ? a.parentElement.insertAdjacentElement("beforebegin", r.section) : s.appendChild(r.section);
  });
}
c(ky, "registerTileCriteriaConfigControls");
const Ay = ["Checkbox", "Tile", "Settings", "Toggleable Lights"], My = [
  "Checkbox",
  "Tile",
  "Settings",
  "Toggleable Lights",
  "Checked",
  "Unchecked",
  "Individual"
];
function xy() {
  if (!globalThis.Tagger) return [];
  const t = Tagger.getByTag(Ay) ?? [], e = [];
  for (const n of t) {
    if (n.getFlag("monks-active-tiles", "variables.state") !== "unchecked") continue;
    const i = (Tagger.getTags(n) ?? []).filter((s) => !My.includes(s)), r = (Tagger.getByTag("Disable Automation") ?? []).concat(Tagger.getByTag("Settings") ?? []), o = Tagger.getByTag(i, { ignore: r }) ?? [];
    for (const s of o)
      s != null && s._id && e.push(s._id);
  }
  return e;
}
c(xy, "buildLightControlsMap");
function _y() {
  Zf(xy);
}
c(_y, "registerCheckboxLightProvider");
function Ny(t) {
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
c(Ny, "toList");
function $y(t, e) {
  const n = t == null ? void 0 : t.tools;
  return Array.isArray(n) ? n.some((i) => (i == null ? void 0 : i.name) === e) : n instanceof Map ? n.has(e) : n && typeof n == "object" ? e in n ? !0 : Object.values(n).some((i) => (i == null ? void 0 : i.name) === e) : !1;
}
c($y, "hasTool");
function Fy(t, e) {
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
c(Fy, "addTool");
function Dy() {
  Hooks.on("getSceneControlButtons", (t) => {
    var i;
    const e = Ny(t);
    if (!e.length) return;
    const n = e.find((r) => (r == null ? void 0 : r.name) === "tiles") ?? e.find((r) => (r == null ? void 0 : r.name) === "tokens" || (r == null ? void 0 : r.name) === "token") ?? e[0];
    n && ($y(n, "eidolonCriteriaSwitcher") || Fy(n, {
      name: "eidolonCriteriaSwitcher",
      title: "Criteria Switcher",
      icon: "fa-solid fa-sliders",
      button: !0,
      toggle: !1,
      visible: Ta(((i = game.scenes) == null ? void 0 : i.viewed) ?? null),
      onClick: /* @__PURE__ */ c(() => Zc(), "onClick")
    }));
  });
}
c(Dy, "registerSceneControlButton");
function Po(t, e) {
  if (!t || typeof t != "object") return !1;
  const n = String(e).split(".");
  let i = t;
  for (const r of n) {
    if (!i || typeof i != "object" || !Object.prototype.hasOwnProperty.call(i, r)) return !1;
    i = i[r];
  }
  return !0;
}
c(Po, "hasOwnPath");
function Py() {
  const t = /* @__PURE__ */ c((i, r = null) => {
    i && pp(i, r);
  }, "invalidateTileScene"), e = /* @__PURE__ */ c((i, r = null) => {
    i && xp(i, r);
  }, "invalidatePlaceableScene");
  Hooks.on("createTile", (i) => {
    t((i == null ? void 0 : i.parent) ?? null, i ?? null);
  }), Hooks.on("deleteTile", (i) => {
    t((i == null ? void 0 : i.parent) ?? null, i ?? null);
  }), Hooks.on("updateTile", (i, r) => {
    (Po(r, `flags.${ne}.tileCriteria`) || Po(r, `flags.${ne}.fileIndex`)) && t((i == null ? void 0 : i.parent) ?? null, i ?? null);
  });
  const n = /* @__PURE__ */ c((i) => {
    Hooks.on(`create${i}`, (r) => {
      e((r == null ? void 0 : r.parent) ?? null, r ?? null);
    }), Hooks.on(`delete${i}`, (r) => {
      e((r == null ? void 0 : r.parent) ?? null, r ?? null);
    }), Hooks.on(`update${i}`, (r, o) => {
      const s = Po(o, `flags.${ne}.presets`), a = i === "AmbientLight" && Po(o, `flags.${ne}.lightCriteria`);
      !s && !a || e((r == null ? void 0 : r.parent) ?? null, r ?? null);
    });
  }, "registerPlaceableHooks");
  n("AmbientLight"), n("Wall"), n("AmbientSound"), Hooks.on("canvasReady", (i) => {
    const r = (i == null ? void 0 : i.scene) ?? null;
    r && (t(r), e(r));
  });
}
c(Py, "registerCriteriaCacheInvalidationHooks");
function Ry() {
  Rp(), _y(), Dy(), ky(), Py(), Hooks.once("init", () => {
    var t, e;
    (e = (t = game.keybindings) == null ? void 0 : t.register) == null || e.call(t, ne, "toggleCriteriaSwitcher", {
      name: "Toggle Criteria Switcher",
      hint: "Open or close the criteria switcher window for live scene state updates.",
      editable: [{ key: "KeyM", modifiers: ["Alt"] }],
      onDown: /* @__PURE__ */ c(() => {
        var n, i, r;
        return Ta(((n = game.scenes) == null ? void 0 : n.viewed) ?? null) ? (Zc(), !0) : ((r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "You do not have permission to manage scene criteria."), !0);
      }, "onDown"),
      restricted: !0,
      precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
    });
  }), Hooks.on("canvasReady", (t) => {
    var n;
    const e = Oa();
    e && (e.setScene((t == null ? void 0 : t.scene) ?? ((n = game.scenes) == null ? void 0 : n.viewed) ?? null), e.render({ force: !0 }));
  }), Hooks.once("ready", () => {
    var e, n;
    const t = (n = (e = game.modules) == null ? void 0 : e.get) == null ? void 0 : n.call(e, ne);
    t && (t.api || (t.api = {}), t.api.criteria = zp, console.log(`${ne} | Criteria engine API registered`));
  });
}
c(Ry, "registerCriteriaEngineHooks");
Ry();
const Qo = /* @__PURE__ */ new WeakMap(), Ro = /* @__PURE__ */ new WeakMap(), we = "__eidolon_default__";
function Hy() {
  Hooks.on("renderAmbientLightConfig", qy), _("LightCriteria | AmbientLightConfig controls registered");
}
c(Hy, "registerAmbientLightCriteriaControls");
function qy(t, e) {
  var n;
  ur("LightCriteria | renderAmbientLightConfig", {
    appId: (t == null ? void 0 : t.id) ?? null,
    constructor: ((n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) ?? null,
    isRendered: (t == null ? void 0 : t.rendered) ?? !1
  });
  try {
    const i = qe(e);
    if (!i) return;
    if (!wa()) {
      i.querySelectorAll(".eidolon-light-criteria, .eidolon-light-criteria-main-switcher").forEach((r) => r.remove());
      return;
    }
    By(t, i);
  } catch (i) {
    console.error("eidolon-utilities | Failed to enhance AmbientLightConfig UI", i);
  } finally {
    zn();
  }
}
c(qy, "handleAmbientLightConfigRender");
function By(t, e) {
  var Er, ai, Sr, ce, Cn;
  const n = (t == null ? void 0 : t.form) instanceof HTMLFormElement ? t.form : e instanceof HTMLFormElement ? e : (Er = e == null ? void 0 : e.closest) == null ? void 0 : Er.call(e, "form");
  if (!(n instanceof HTMLFormElement)) return;
  const i = n.querySelector(".window-content");
  if (!(i instanceof HTMLElement)) return;
  const r = wh(t);
  if (!r) return;
  const o = cb(r);
  _("LightCriteria | Resolved ambient light", {
    sheetId: (r == null ? void 0 : r.id) ?? null,
    persistedId: (o == null ? void 0 : o.id) ?? null,
    sameRef: r === o
  });
  const s = (o == null ? void 0 : o.parent) ?? r.parent ?? null, a = s ? Ug(s) : [], l = a.filter(
    (P) => Array.isArray(P == null ? void 0 : P.values) && P.values.length > 0
  ), u = Zy(a), d = a.map((P) => typeof (P == null ? void 0 : P.id) == "string" ? P.id : null).filter((P) => !!P), f = o ?? r, h = s ? St(s) : [];
  let m = Kf(f);
  const g = wp(m, h);
  JSON.stringify(g) !== JSON.stringify(m) && (m = g, Xf(f, g).catch((P) => {
    console.warn("eidolon-utilities | Failed to persist migrated light criteria keys", P);
  })), _("LightCriteria | Loaded mapping state", {
    hasBase: !!(m != null && m.base),
    mappingCount: Array.isArray(m == null ? void 0 : m.mappings) ? m.mappings.length : 0,
    mappings: Array.isArray(m == null ? void 0 : m.mappings) ? m.mappings.map((P) => {
      var W, Z;
      return {
        id: P.id,
        key: P.key,
        hasColor: !!((Z = (W = P.config) == null ? void 0 : W.config) != null && Z.color)
      };
    }) : []
  });
  const y = i.querySelector(".eidolon-light-criteria");
  y && y.remove(), i.querySelectorAll(".eidolon-light-criteria-main-switcher").forEach((P) => P.remove());
  const v = document.createElement("fieldset");
  v.classList.add("eidolon-light-criteria");
  const b = document.createElement("legend");
  b.textContent = S("EIDOLON.LightCriteria.Legend", "Scene Criteria Lighting"), v.appendChild(b);
  const w = document.createElement("p");
  w.classList.add("notes"), w.textContent = S(
    "EIDOLON.LightCriteria.Description",
    "Capture a base lighting state, then map criteria values to lighting configurations."
  ), v.appendChild(w);
  const E = document.createElement("div");
  E.classList.add("eidolon-light-criteria__controls");
  const C = document.createElement("button");
  C.type = "button", C.dataset.action = "make-default", C.classList.add("eidolon-light-criteria__button"), C.textContent = S(
    "EIDOLON.LightCriteria.SetBase",
    "Set Base"
  ), E.appendChild(C);
  const O = document.createElement("button");
  O.type = "button", O.dataset.action = "create-mapping", O.classList.add("eidolon-light-criteria__button"), O.textContent = S(
    "EIDOLON.LightCriteria.CreateMapping",
    "Add Criteria Mapping"
  ), O.setAttribute("aria-expanded", "false"), E.appendChild(O), v.appendChild(E);
  const k = document.createElement("p");
  k.classList.add("notes", "eidolon-light-criteria__status"), v.appendChild(k);
  const x = document.createElement("div");
  x.classList.add("eidolon-light-criteria__switcher");
  const $ = document.createElement("label");
  $.classList.add("eidolon-light-criteria__switcher-label");
  const D = `${(t == null ? void 0 : t.id) ?? (r == null ? void 0 : r.id) ?? "eidolon-light"}-mapping-select`;
  $.htmlFor = D, $.textContent = S("EIDOLON.LightCriteria.SelectLabel", "Criteria Mapping"), x.appendChild($);
  const N = document.createElement("details");
  N.classList.add("eidolon-light-criteria__filter-details");
  const F = document.createElement("summary");
  F.classList.add("eidolon-light-criteria__filter-summary");
  const M = document.createElement("span");
  M.classList.add("eidolon-light-criteria__filter-summary-label"), M.textContent = S(
    "EIDOLON.LightCriteria.FilterHeading",
    "Filter mappings"
  ), F.appendChild(M);
  const R = document.createElement("span");
  R.classList.add("eidolon-light-criteria__filter-meta"), F.appendChild(R), N.appendChild(F);
  const B = document.createElement("div");
  B.classList.add("eidolon-light-criteria__filter-panel");
  const j = document.createElement("div");
  j.classList.add("eidolon-light-criteria__filter-grid");
  for (const P of l) {
    const W = document.createElement("label");
    W.classList.add("eidolon-light-criteria__filter");
    const Z = document.createElement("span");
    Z.classList.add("eidolon-light-criteria__filter-name"), Z.textContent = (Sr = (ai = P.name) == null ? void 0 : ai.trim) != null && Sr.call(ai) ? P.name.trim() : S("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), W.appendChild(Z);
    const ee = document.createElement("select");
    ee.dataset.filterCategoryId = P.id, ee.classList.add("eidolon-light-criteria__filter-select");
    const ie = document.createElement("option");
    ie.value = "", ie.textContent = S("EIDOLON.LightCriteria.FilterAny", "Any"), ee.appendChild(ie);
    for (const he of P.values) {
      const me = document.createElement("option");
      me.value = he, me.textContent = he, ee.appendChild(me);
    }
    W.appendChild(ee), j.appendChild(W);
  }
  B.appendChild(j);
  const H = document.createElement("div");
  H.classList.add("eidolon-light-criteria__filter-actions");
  const V = document.createElement("button");
  V.type = "button", V.dataset.action = "clear-mapping-filters", V.classList.add("eidolon-light-criteria__button", "secondary", "compact"), V.textContent = S("EIDOLON.LightCriteria.ClearFilters", "Clear Filters"), H.appendChild(V), B.appendChild(H), N.appendChild(B), N.hidden = l.length === 0, x.appendChild(N);
  const Y = document.createElement("div");
  Y.classList.add("eidolon-light-criteria__switcher-controls"), x.appendChild(Y);
  const oe = document.createElement("select");
  oe.id = D, oe.classList.add("eidolon-light-criteria__select"), oe.dataset.action = "select-mapping", Y.appendChild(oe);
  const J = document.createElement("button");
  J.type = "button", J.dataset.action = "apply-selected-mapping", J.classList.add("eidolon-light-criteria__button", "secondary"), J.textContent = S("EIDOLON.LightCriteria.ApplyButton", "Apply"), Y.appendChild(J);
  const te = document.createElement("details");
  te.classList.add("eidolon-light-criteria__menu"), te.dataset.action = "mapping-actions-menu";
  const an = document.createElement("summary");
  an.classList.add("eidolon-light-criteria__menu-toggle"), an.innerHTML = '<i class="fa-solid fa-ellipsis-vertical" inert=""></i>', an.setAttribute(
    "aria-label",
    S("EIDOLON.LightCriteria.MoreActions", "More actions")
  ), an.dataset.tooltip = S("EIDOLON.LightCriteria.MoreActions", "More actions"), te.appendChild(an);
  const Ct = document.createElement("div");
  Ct.classList.add("eidolon-light-criteria__menu-list"), te.appendChild(Ct);
  const Be = document.createElement("button");
  Be.type = "button", Be.dataset.action = "update-selected-mapping", Be.classList.add("eidolon-light-criteria__menu-item"), Be.textContent = S(
    "EIDOLON.LightCriteria.UpdateSelected",
    "Save current config to selected"
  ), Ct.appendChild(Be);
  const lt = document.createElement("button");
  lt.type = "button", lt.dataset.action = "edit-selected-mapping-criteria", lt.classList.add("eidolon-light-criteria__menu-item"), lt.textContent = S(
    "EIDOLON.LightCriteria.EditSelectedCriteria",
    "Edit selected mapping criteria"
  ), Ct.appendChild(lt);
  const ct = document.createElement("button");
  ct.type = "button", ct.dataset.action = "remove-selected-mapping", ct.classList.add("eidolon-light-criteria__menu-item", "danger"), ct.textContent = S(
    "EIDOLON.LightCriteria.RemoveSelected",
    "Delete selected mapping"
  ), Ct.appendChild(ct), Y.appendChild(te);
  const oi = document.createElement("div");
  oi.classList.add("eidolon-light-criteria-main-switcher"), oi.appendChild(x);
  const Fe = document.createElement("p");
  if (Fe.classList.add("notes", "eidolon-light-criteria-main-switcher__empty"), Fe.textContent = S(
    "EIDOLON.LightCriteria.ActiveRequiresBase",
    "Set Base Lighting to enable mapping selection and actions."
  ), oi.appendChild(Fe), a.length === 0) {
    const P = document.createElement("p");
    P.classList.add("notification", "warning", "eidolon-light-criteria__warning"), P.textContent = S(
      "EIDOLON.LightCriteria.NoCategoriesWarning",
      "This scene has no criteria configured. Add criteria under Scene -> Criteria to enable criteria-driven lighting."
    ), v.appendChild(P);
  } else if (l.length === 0) {
    const P = document.createElement("p");
    P.classList.add("notification", "warning", "eidolon-light-criteria__warning"), P.textContent = S(
      "EIDOLON.LightCriteria.NoValuesWarning",
      "Criteria exist, but none define selectable values. Add values in Scene -> Criteria."
    ), v.appendChild(P);
  }
  const xe = document.createElement("div");
  xe.classList.add("eidolon-light-criteria__creation"), xe.dataset.section = "creation", xe.hidden = !0;
  const qi = document.createElement("p");
  qi.classList.add("notes"), qi.textContent = S(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ), xe.appendChild(qi);
  const ln = document.createElement("div");
  ln.classList.add("eidolon-light-criteria__category-list"), xe.appendChild(ln);
  for (const P of l) {
    const W = document.createElement("label");
    W.classList.add("eidolon-light-criteria__category");
    const Z = document.createElement("span");
    Z.classList.add("eidolon-light-criteria__category-name"), Z.textContent = (Cn = (ce = P.name) == null ? void 0 : ce.trim) != null && Cn.call(ce) ? P.name.trim() : S("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), W.appendChild(Z);
    const ee = document.createElement("select");
    ee.dataset.categoryId = P.id, ee.classList.add("eidolon-light-criteria__category-select");
    const ie = document.createElement("option");
    ie.value = "", ie.textContent = S(
      "EIDOLON.LightCriteria.IgnoreCategory",
      "Ignore"
    ), ee.appendChild(ie);
    for (const he of P.values) {
      const me = document.createElement("option");
      me.value = he, me.textContent = he, ee.appendChild(me);
    }
    W.appendChild(ee), ln.appendChild(W);
  }
  const si = document.createElement("div");
  si.classList.add("eidolon-light-criteria__creation-actions");
  const ut = document.createElement("button");
  ut.type = "button", ut.dataset.action = "save-mapping", ut.classList.add("eidolon-light-criteria__button", "primary"), ut.textContent = S(
    "EIDOLON.LightCriteria.SaveMapping",
    "Save Mapping"
  ), si.appendChild(ut);
  const cn = document.createElement("button");
  cn.type = "button", cn.dataset.action = "cancel-create", cn.classList.add("eidolon-light-criteria__button", "secondary"), cn.textContent = S(
    "EIDOLON.LightCriteria.Cancel",
    "Cancel"
  ), si.appendChild(cn), xe.appendChild(si), v.appendChild(xe), i.prepend(oi), v.hidden = !0, Vy(t, {
    fieldset: v,
    homeContainer: i
  }), requestAnimationFrame(() => {
    var P;
    (P = t.setPosition) == null || P.call(t, { height: "auto" });
  });
  let q = m;
  di({ switcher: x, emptyState: Fe, state: q }), ci(k, q), Ir(O, {
    state: q,
    hasCategories: l.length > 0
  }), _("LightCriteria | Controls injected", {
    sceneId: (s == null ? void 0 : s.id) ?? null,
    lightId: (r == null ? void 0 : r.id) ?? null,
    hasBase: !!(q != null && q.base),
    mappingCount: Array.isArray(q == null ? void 0 : q.mappings) ? q.mappings.length : 0,
    categories: l.length
  });
  const Mo = ob(q), Q = {
    restoreConfig: null,
    app: t,
    selectedMapping: Mo,
    editorMode: "create",
    editingMappingId: null,
    mappingFilters: {}
  };
  Qo.set(v, Q);
  const Tt = /* @__PURE__ */ c(() => {
    te.open = !1;
  }, "closeActionsMenu");
  an.addEventListener("click", (P) => {
    te.classList.contains("is-disabled") && (P.preventDefault(), Tt());
  });
  const De = /* @__PURE__ */ c((P = Q.selectedMapping) => {
    const W = eb(j), Z = Array.isArray(q == null ? void 0 : q.mappings) ? q.mappings : [], ee = nb(Z, W), ie = Object.keys(W).length;
    Q.mappingFilters = W, V.disabled = ie === 0, ib(R, {
      totalCount: Z.length,
      visibleCount: ee.length,
      hasFilters: ie > 0,
      activeFilterCount: ie
    }), N.classList.toggle("has-active-filters", ie > 0), rb(oe, q, u, P, {
      mappings: ee,
      categoryOrder: d
    }), Q.selectedMapping = oe.value ?? "", Ja({
      mappingSelect: oe,
      applyMappingButton: J,
      updateMappingButton: Be,
      editCriteriaButton: lt,
      removeMappingButton: ct,
      actionsMenu: te,
      state: q
    }), te.classList.contains("is-disabled") && Tt();
  }, "refreshMappingSelector");
  j.querySelectorAll("select[data-filter-category-id]").forEach((P) => {
    P.addEventListener("change", () => {
      const W = Q.selectedMapping;
      De(W), Q.selectedMapping !== W && Qa(
        o ?? r,
        q,
        Q.selectedMapping
      ).then((Z) => {
        Z && (q = Z);
      });
    });
  }), V.addEventListener("click", () => {
    tb(j);
    const P = Q.selectedMapping;
    De(P), N.open = !1, Q.selectedMapping !== P && Qa(
      o ?? r,
      q,
      Q.selectedMapping
    ).then((W) => {
      W && (q = W);
    });
  }), oe.addEventListener("change", () => {
    Q.selectedMapping = oe.value ?? "", Ja({
      mappingSelect: oe,
      applyMappingButton: J,
      updateMappingButton: Be,
      editCriteriaButton: lt,
      removeMappingButton: ct,
      actionsMenu: te,
      state: q
    }), Qa(
      o ?? r,
      q,
      Q.selectedMapping
    ).then((P) => {
      P && (q = P);
    });
  });
  const wr = /* @__PURE__ */ c(async () => {
    var ee, ie, he, me, dt, Tn, ft, Ln, ve, In, On, Wt, li, Cr;
    const P = oe.value ?? "";
    if (!P) {
      (ie = (ee = ui.notifications) == null ? void 0 : ee.warn) == null || ie.call(
        ee,
        S(
          "EIDOLON.LightCriteria.SelectMappingWarning",
          "Choose a criteria mapping before applying."
        )
      ), De(Q.selectedMapping);
      return;
    }
    if (P === we) {
      if (!(q != null && q.base)) {
        (me = (he = ui.notifications) == null ? void 0 : he.warn) == null || me.call(
          he,
          S(
            "EIDOLON.LightCriteria.BaseUnavailable",
            "Set a base lighting state before applying it."
          )
        );
        return;
      }
      Ho(v, xe, O), es(t, n, q.base), q = await Hr(o ?? r, {
        mappingId: we,
        categories: null,
        updatedAt: Date.now()
      }), Q.selectedMapping = we, De(Q.selectedMapping), ci(k, q), di({ switcher: x, emptyState: Fe, state: q }), Ir(O, {
        state: q,
        hasCategories: l.length > 0
      }), id(n, {
        mappingId: we,
        color: ((Tn = (dt = q.base) == null ? void 0 : dt.config) == null ? void 0 : Tn.color) ?? null
      }), (Ln = (ft = ui.notifications) == null ? void 0 : ft.info) == null || Ln.call(
        ft,
        S(
          "EIDOLON.LightCriteria.BaseApplied",
          "Applied the base lighting state to the form."
        )
      ), Tt();
      return;
    }
    const W = Array.isArray(q == null ? void 0 : q.mappings) && q.mappings.length ? q.mappings.find((Bi) => (Bi == null ? void 0 : Bi.id) === P) : null;
    if (!W) {
      (In = (ve = ui.notifications) == null ? void 0 : ve.warn) == null || In.call(
        ve,
        S(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      ), Q.selectedMapping = "", De(Q.selectedMapping);
      return;
    }
    Ho(v, xe, O), es(t, n, W.config), q = await Hr(o ?? r, {
      mappingId: W.id,
      categories: W.categories,
      updatedAt: Date.now()
    }), Q.selectedMapping = W.id, De(Q.selectedMapping), ci(k, q), di({ switcher: x, emptyState: Fe, state: q }), Ir(O, {
      state: q,
      hasCategories: l.length > 0
    }), id(n, {
      mappingId: W.id,
      color: ((Wt = (On = W.config) == null ? void 0 : On.config) == null ? void 0 : Wt.color) ?? null
    });
    const Z = ir(W, u, d);
    (Cr = (li = ui.notifications) == null ? void 0 : li.info) == null || Cr.call(
      li,
      S(
        "EIDOLON.LightCriteria.MappingApplied",
        "Applied mapping: {label}"
      ).replace("{label}", Z)
    ), Tt();
  }, "applySelectedMapping");
  J.addEventListener("click", () => {
    wr();
  }), oe.addEventListener("keydown", (P) => {
    P.key === "Enter" && (P.preventDefault(), wr());
  });
  const xo = /* @__PURE__ */ c(async () => {
    var W, Z, ee, ie, he, me, dt, Tn, ft, Ln, ve, In, On, Wt, li, Cr, Bi, _o, Ou, No, ku;
    const P = Q.selectedMapping;
    if (!P) {
      (Z = (W = ui.notifications) == null ? void 0 : W.warn) == null || Z.call(
        W,
        S(
          "EIDOLON.LightCriteria.SelectMappingWarning",
          "Choose a criteria mapping before applying."
        )
      );
      return;
    }
    Be.disabled = !0;
    try {
      const Ze = Zo(t, o);
      if (P === we)
        q = await zu(o ?? r, Ze), _("LightCriteria | Base lighting updated", {
          lightId: ((ee = o ?? r) == null ? void 0 : ee.id) ?? null,
          configColor: ((ie = Ze == null ? void 0 : Ze.config) == null ? void 0 : ie.color) ?? null
        }), (me = (he = ui.notifications) == null ? void 0 : he.info) == null || me.call(
          he,
          S(
            "EIDOLON.LightCriteria.BaseUpdated",
            "Updated the base lighting state with the current configuration."
          )
        ), Q.selectedMapping = we;
      else {
        const ji = qr(q, P);
        if (!ji) {
          (Tn = (dt = ui.notifications) == null ? void 0 : dt.warn) == null || Tn.call(
            dt,
            S(
              "EIDOLON.LightCriteria.MappingUnavailable",
              "The selected criteria mapping is no longer available."
            )
          ), Q.selectedMapping = "", De(Q.selectedMapping);
          return;
        }
        q = await Yu(
          o ?? r,
          ji.categories,
          Ze,
          { label: ji.label ?? null }
        ), _("LightCriteria | Mapping updated", {
          mappingId: P,
          hasColor: !!((ft = Ze == null ? void 0 : Ze.config) != null && ft.color),
          stored: Array.isArray(q == null ? void 0 : q.mappings) ? ((Ln = q.mappings.find((Ra) => (Ra == null ? void 0 : Ra.id) === P)) == null ? void 0 : Ln.config) ?? null : null,
          persisted: (In = (ve = o ?? r) == null ? void 0 : ve.getFlag) == null ? void 0 : In.call(ve, Pr, Rr)
        });
        const Tr = qr(q, P), tg = ir(Tr || ji, u, d);
        _("LightCriteria | Mapping updated", {
          mappingId: P,
          categories: ji.categories,
          updatedColor: ((On = Ze == null ? void 0 : Ze.config) == null ? void 0 : On.color) ?? null,
          storedColor: ((li = (Wt = Tr == null ? void 0 : Tr.config) == null ? void 0 : Wt.config) == null ? void 0 : li.color) ?? ((Bi = (Cr = ji.config) == null ? void 0 : Cr.config) == null ? void 0 : Bi.color) ?? null
        }), (Ou = (_o = ui.notifications) == null ? void 0 : _o.info) == null || Ou.call(
          _o,
          S(
            "EIDOLON.LightCriteria.MappingUpdated",
            "Saved changes to mapping: {label}"
          ).replace("{label}", tg)
        ), Q.selectedMapping = P;
      }
      ci(k, q), di({ switcher: x, emptyState: Fe, state: q }), Ir(O, {
        state: q,
        hasCategories: l.length > 0
      }), De(Q.selectedMapping), Tt();
    } catch (Ze) {
      console.error("eidolon-utilities | Failed to update light criteria mapping", Ze), (ku = (No = ui.notifications) == null ? void 0 : No.error) == null || ku.call(
        No,
        S(
          "EIDOLON.LightCriteria.MappingUpdateError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      Be.disabled = !1, Ja({
        mappingSelect: oe,
        applyMappingButton: J,
        updateMappingButton: Be,
        editCriteriaButton: lt,
        removeMappingButton: ct,
        actionsMenu: te,
        state: q
      });
    }
  }, "updateSelectedMapping");
  Be.addEventListener("click", () => {
    xo();
  }), De(Q.selectedMapping), C.addEventListener("click", async () => {
    var P, W, Z, ee, ie, he;
    C.disabled = !0;
    try {
      const me = Zo(t, o);
      q = await zu(o ?? r, me), _("LightCriteria | Base lighting stored", {
        lightId: ((P = o ?? r) == null ? void 0 : P.id) ?? null,
        configColor: ((W = me == null ? void 0 : me.config) == null ? void 0 : W.color) ?? null
      }), (ee = (Z = ui.notifications) == null ? void 0 : Z.info) == null || ee.call(
        Z,
        S(
          "EIDOLON.LightCriteria.BaseStored",
          "Saved the current configuration as the base lighting state."
        )
      ), ci(k, q), di({ switcher: x, emptyState: Fe, state: q }), Ir(O, {
        state: q,
        hasCategories: l.length > 0
      }), Q.selectedMapping = we, De(Q.selectedMapping);
    } catch (me) {
      console.error("eidolon-utilities | Failed to store base light criteria state", me), (he = (ie = ui.notifications) == null ? void 0 : ie.error) == null || he.call(
        ie,
        S(
          "EIDOLON.LightCriteria.BaseError",
          "Failed to save the base lighting state. Check the console for details."
        )
      );
    } finally {
      C.disabled = !1;
    }
  }), O.addEventListener("click", () => {
    var W, Z, ee, ie;
    if (!(q != null && q.base)) {
      (Z = (W = ui.notifications) == null ? void 0 : W.warn) == null || Z.call(
        W,
        S(
          "EIDOLON.LightCriteria.RequiresBase",
          "Set a base lighting state before adding criteria mappings."
        )
      );
      return;
    }
    if (l.length === 0) {
      (ie = (ee = ui.notifications) == null ? void 0 : ee.warn) == null || ie.call(
        ee,
        S(
          "EIDOLON.LightCriteria.NoCategoriesAvailable",
          "Add scene criteria with values in the Scene configuration before creating mappings."
        )
      );
      return;
    }
    const P = Qo.get(v);
    nd({
      app: t,
      fieldset: v,
      createButton: O,
      creationSection: xe,
      categoryList: ln,
      form: n,
      persistedLight: o,
      stateEntry: P,
      mode: "create",
      mapping: null,
      preloadConfig: q.base
    });
  }), lt.addEventListener("click", () => {
    var Z, ee, ie, he;
    const P = Q.selectedMapping;
    if (!P || P === we) {
      (ee = (Z = ui.notifications) == null ? void 0 : Z.warn) == null || ee.call(
        Z,
        S(
          "EIDOLON.LightCriteria.SelectMappingForCriteriaEdit",
          "Select a mapping before editing criteria."
        )
      );
      return;
    }
    const W = qr(q, P);
    if (!W) {
      (he = (ie = ui.notifications) == null ? void 0 : ie.warn) == null || he.call(
        ie,
        S(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      );
      return;
    }
    Tt(), vh(t, { fieldset: v, homeContainer: i }), nd({
      app: t,
      fieldset: v,
      createButton: O,
      creationSection: xe,
      categoryList: ln,
      form: n,
      persistedLight: o,
      stateEntry: Q,
      mode: "retarget",
      mapping: W,
      preloadConfig: W.config
    });
  }), ut.addEventListener("click", async () => {
    var W, Z, ee, ie, he, me, dt, Tn, ft, Ln;
    const P = lb(ln);
    if (!P) {
      (Z = (W = ui.notifications) == null ? void 0 : W.warn) == null || Z.call(
        W,
        S(
          "EIDOLON.LightCriteria.SelectionRequired",
          "Select at least one criteria value to identify the mapping."
        )
      );
      return;
    }
    ut.disabled = !0;
    try {
      const ve = Zo(t, o);
      if (Q.editorMode === "retarget" && Q.editingMappingId) {
        const On = rc(q, P);
        let Wt = !1;
        if (On && On !== Q.editingMappingId && (Wt = await jy(), !Wt)) {
          ut.disabled = !1;
          return;
        }
        q = await yp(
          o ?? r,
          Q.editingMappingId,
          P,
          ve,
          { replaceExisting: Wt }
        ), _("LightCriteria | Mapping criteria retargeted", {
          mappingId: Q.editingMappingId,
          categories: P,
          replaced: Wt,
          configColor: ((ee = ve == null ? void 0 : ve.config) == null ? void 0 : ee.color) ?? null
        }), (he = (ie = ui.notifications) == null ? void 0 : ie.info) == null || he.call(
          ie,
          S(
            "EIDOLON.LightCriteria.MappingCriteriaUpdated",
            "Updated mapping criteria for the selected mapping."
          )
        );
      } else
        q = await Yu(
          o ?? r,
          P,
          ve,
          {}
        ), _("LightCriteria | Mapping saved from editor", {
          categories: P,
          configColor: ((me = ve == null ? void 0 : ve.config) == null ? void 0 : me.color) ?? null
        }), (Tn = (dt = ui.notifications) == null ? void 0 : dt.info) == null || Tn.call(
          dt,
          S(
            "EIDOLON.LightCriteria.MappingSaved",
            "Updated lighting mapping for the selected scene criteria."
          )
        );
      ci(k, q), di({ switcher: x, emptyState: Fe, state: q });
      const In = rc(q, P);
      In && (Q.selectedMapping = In), De(Q.selectedMapping), Ho(v, xe, O), Tt();
    } catch (ve) {
      console.error("eidolon-utilities | Failed to persist light criteria mapping", ve), (Ln = (ft = ui.notifications) == null ? void 0 : ft.error) == null || Ln.call(
        ft,
        S(
          "EIDOLON.LightCriteria.MappingError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      ut.disabled = !1;
    }
  }), cn.addEventListener("click", () => {
    const P = Qo.get(v);
    P != null && P.restoreConfig && es(t, n, P.restoreConfig), Ho(v, xe, O);
  }), ct.addEventListener("click", async () => {
    var Z, ee;
    const P = Q.selectedMapping;
    !P || P === we || !await Uy() || (q = await bp(o ?? r, P), Q.selectedMapping = "", ci(k, q), di({ switcher: x, emptyState: Fe, state: q }), De(Q.selectedMapping), Tt(), (ee = (Z = ui.notifications) == null ? void 0 : Z.info) == null || ee.call(
      Z,
      S("EIDOLON.LightCriteria.MappingRemoved", "Removed selected mapping.")
    ));
  });
}
c(By, "enhanceAmbientLightConfig");
function nd({
  app: t,
  fieldset: e,
  createButton: n,
  creationSection: i,
  categoryList: r,
  form: o,
  persistedLight: s,
  stateEntry: a,
  mode: l,
  mapping: u,
  preloadConfig: d
}) {
  a && (a.restoreConfig = Zo(t, s), a.editorMode = l, a.editingMappingId = l === "retarget" ? (u == null ? void 0 : u.id) ?? null : null), d && es(t, o, d), l === "retarget" && (u != null && u.categories) ? ab(r, u.categories) : sb(r);
  const f = i.querySelector("p.notes");
  f instanceof HTMLElement && (f.textContent = l === "retarget" ? S(
    "EIDOLON.LightCriteria.EditCriteriaDescription",
    "Adjust criteria values for the selected mapping."
  ) : S(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const h = i.querySelector('button[data-action="save-mapping"]');
  h instanceof HTMLButtonElement && (h.textContent = l === "retarget" ? S("EIDOLON.LightCriteria.SaveCriteriaChanges", "Save Criteria Changes") : S("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), i.hidden = !1, n.setAttribute("aria-expanded", "true"), tu(e, i), requestAnimationFrame(() => {
    var m;
    (m = t.setPosition) == null || m.call(t, { height: "auto" });
  });
}
c(nd, "openMappingEditor");
async function jy() {
  var n, i;
  const t = (i = (n = foundry == null ? void 0 : foundry.applications) == null ? void 0 : n.api) == null ? void 0 : i.DialogV2;
  if (typeof (t == null ? void 0 : t.confirm) == "function")
    return t.confirm({
      window: { title: S("EIDOLON.LightCriteria.ConflictTitle", "Replace Existing Mapping?") },
      content: `<p>${S(
        "EIDOLON.LightCriteria.ConflictBody",
        "A mapping already exists for this criteria combination. Replace it with the edited mapping?"
      )}</p>`,
      rejectClose: !1
    });
  const e = globalThis.Dialog;
  return typeof (e == null ? void 0 : e.confirm) != "function" ? !1 : e.confirm({
    title: S("EIDOLON.LightCriteria.ConflictTitle", "Replace Existing Mapping?"),
    content: `<p>${S(
      "EIDOLON.LightCriteria.ConflictBody",
      "A mapping already exists for this criteria combination. Replace it with the edited mapping?"
    )}</p>`,
    yes: /* @__PURE__ */ c(() => !0, "yes"),
    no: /* @__PURE__ */ c(() => !1, "no"),
    defaultYes: !1
  });
}
c(jy, "confirmCriteriaConflict");
async function Uy() {
  var n, i;
  const t = (i = (n = foundry == null ? void 0 : foundry.applications) == null ? void 0 : n.api) == null ? void 0 : i.DialogV2;
  if (typeof (t == null ? void 0 : t.confirm) == "function")
    return t.confirm({
      window: { title: S("EIDOLON.LightCriteria.RemoveTitle", "Remove Mapping?") },
      content: `<p>${S(
        "EIDOLON.LightCriteria.RemoveBody",
        "Remove the currently selected mapping? This cannot be undone."
      )}</p>`,
      rejectClose: !1
    });
  const e = globalThis.Dialog;
  return typeof (e == null ? void 0 : e.confirm) != "function" ? !1 : e.confirm({
    title: S("EIDOLON.LightCriteria.RemoveTitle", "Remove Mapping?"),
    content: `<p>${S(
      "EIDOLON.LightCriteria.RemoveBody",
      "Remove the currently selected mapping? This cannot be undone."
    )}</p>`,
    yes: /* @__PURE__ */ c(() => !0, "yes"),
    no: /* @__PURE__ */ c(() => !1, "no"),
    defaultYes: !1
  });
}
c(Uy, "confirmRemoveMapping");
function Vy(t, { fieldset: e, homeContainer: n }) {
  const i = zy(t, n);
  if (!(i instanceof HTMLElement)) return;
  const r = i.querySelector(".window-header");
  if (!(r instanceof HTMLElement)) return;
  let o = r.querySelector('[data-eidolon-action="open-light-criteria-manager"]');
  if (!(o instanceof HTMLButtonElement)) {
    o = document.createElement("button"), o.type = "button", o.classList.add("header-control", "icon"), o.dataset.eidolonAction = "open-light-criteria-manager", o.dataset.tooltip = S("EIDOLON.LightCriteria.OpenManager", "Open Scene Criteria Lighting"), o.setAttribute("aria-label", S("EIDOLON.LightCriteria.OpenManager", "Open Scene Criteria Lighting")), o.innerHTML = '<i class="fa-solid fa-sliders" inert=""></i>';
    const s = r.querySelector(".window-controls") ?? r, a = s.querySelector('[data-action="toggleControls"]');
    if ((a == null ? void 0 : a.parentElement) === s)
      s.insertBefore(o, a);
    else {
      const l = s.querySelector('[data-action="close"]');
      (l == null ? void 0 : l.parentElement) === s ? s.insertBefore(o, l) : s.appendChild(o);
    }
  }
  o.onclick = (s) => {
    s.preventDefault(), vh(t, { fieldset: e, homeContainer: n });
  };
}
c(Vy, "ensureManagerHeaderButton");
function vh(t, { fieldset: e, homeContainer: n }) {
  var h, m, g;
  const i = Ro.get(t);
  if (i != null && i.rendered) {
    (h = i.bringToTop) == null || h.call(i);
    return;
  }
  const r = /* @__PURE__ */ c((...y) => {
    var w;
    const v = Gy(y), b = (w = v == null ? void 0 : v.querySelector) == null ? void 0 : w.call(v, ".eidolon-light-criteria-manager-host");
    b instanceof HTMLElement && (Wy(e), e.hidden = !1, b.appendChild(e));
  }, "onRender"), o = /* @__PURE__ */ c(() => {
    e.remove(), e.hidden = !0, Ro.delete(t), requestAnimationFrame(() => {
      var y;
      (y = t.setPosition) == null || y.call(t, { height: "auto" });
    });
  }, "onClose"), s = S("EIDOLON.LightCriteria.ManagerTitle", "Scene Criteria Lighting"), a = '<div class="eidolon-light-criteria-manager-host"></div>', l = S("EIDOLON.LightCriteria.Close", "Close"), u = (g = (m = foundry == null ? void 0 : foundry.applications) == null ? void 0 : m.api) == null ? void 0 : g.DialogV2;
  if (typeof (u == null ? void 0 : u.wait) == "function")
    try {
      let y = !1;
      const v = /* @__PURE__ */ c(() => {
        y || (y = !0, o());
      }, "closeOnce");
      Ro.set(t, {
        rendered: !0,
        bringToTop: /* @__PURE__ */ c(() => {
        }, "bringToTop")
      }), u.wait({
        window: { title: s },
        content: a,
        buttons: [{ action: "close", label: l, default: !0 }],
        render: /* @__PURE__ */ c((...b) => r(...b), "render"),
        close: v,
        rejectClose: !1
      }).catch((b) => {
        console.warn("eidolon-utilities | DialogV2 manager failed, falling back to Dialog", b), v();
      });
      return;
    } catch (y) {
      console.warn("eidolon-utilities | DialogV2 manager failed, falling back to Dialog", y), o();
    }
  const d = globalThis.Dialog;
  if (typeof d != "function") return;
  const f = new d(
    {
      title: s,
      content: a,
      buttons: {
        close: {
          label: l
        }
      },
      render: /* @__PURE__ */ c((...y) => r(...y), "render"),
      close: o
    },
    {
      width: 640,
      resizable: !0
    }
  );
  Ro.set(t, f), f.render(!0);
}
c(vh, "openManagerDialog");
function Gy(t) {
  for (const e of t) {
    const n = qe(e);
    if (n) return n;
    const i = qe(e == null ? void 0 : e.element);
    if (i) return i;
  }
  return null;
}
c(Gy, "findDialogRoot");
function Wy(t) {
  if (!(t instanceof HTMLElement) || t.dataset.managerLayout === "true") return;
  t.dataset.managerLayout = "true", t.classList.add("is-manager");
  const e = t.querySelector("legend"), n = t.querySelector("p.notes:not(.eidolon-light-criteria__status)"), i = t.querySelector(".eidolon-light-criteria__controls"), r = t.querySelector(".eidolon-light-criteria__status"), o = t.querySelector(".eidolon-light-criteria__creation"), s = Array.from(t.querySelectorAll(".eidolon-light-criteria__warning")), a = document.createElement("div");
  a.classList.add("eidolon-light-criteria-manager");
  const l = document.createElement("section");
  l.classList.add("eidolon-light-criteria-manager__section", "is-top"), a.appendChild(l);
  const u = document.createElement("section");
  u.classList.add("eidolon-light-criteria-manager__section", "is-bottom"), a.appendChild(u);
  const d = document.createElement("div");
  if (d.classList.add("eidolon-light-criteria-manager__header"), d.textContent = S("EIDOLON.LightCriteria.ManagerHeader", "Base State"), l.appendChild(d), r && l.appendChild(r), i && l.appendChild(i), s.length) {
    const h = document.createElement("div");
    h.classList.add("eidolon-light-criteria-manager__warnings");
    for (const m of s) h.appendChild(m);
    l.appendChild(h);
  }
  const f = document.createElement("div");
  f.classList.add("eidolon-light-criteria-manager__header"), f.textContent = S("EIDOLON.LightCriteria.ManagerAuthoring", "Create or Update Mapping"), u.appendChild(f), o && u.appendChild(o), t.innerHTML = "", e && t.appendChild(e), n && t.appendChild(n), t.appendChild(a), tu(t, o);
}
c(Wy, "applyManagerLayout");
function zy(t, e) {
  var i;
  const n = qe(t == null ? void 0 : t.element);
  return n || (((i = e == null ? void 0 : e.closest) == null ? void 0 : i.call(e, ".application")) ?? null);
}
c(zy, "resolveApplicationRoot");
function Ho(t, e, n) {
  const i = Qo.get(t);
  i && (i.restoreConfig = null, i.editorMode = "create", i.editingMappingId = null), e.hidden = !0, n.setAttribute("aria-expanded", "false");
  const r = e.querySelector("p.notes");
  r instanceof HTMLElement && (r.textContent = S(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const o = e.querySelector('button[data-action="save-mapping"]');
  o instanceof HTMLButtonElement && (o.textContent = S("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), tu(t, e), requestAnimationFrame(() => {
    var s, a;
    (a = (s = i == null ? void 0 : i.app) == null ? void 0 : s.setPosition) == null || a.call(s, { height: "auto" });
  });
}
c(Ho, "hideCreationSection");
function ci(t, e) {
  if (!t) return;
  const n = !!(e != null && e.base), i = Array.isArray(e == null ? void 0 : e.mappings) ? e.mappings.length : 0, r = [];
  r.push(
    n ? S(
      "EIDOLON.LightCriteria.StatusBaseSaved",
      "Base lighting saved."
    ) : S(
      "EIDOLON.LightCriteria.StatusBaseMissing",
      "Base lighting not yet saved."
    )
  ), r.push(
    S(
      "EIDOLON.LightCriteria.StatusMappingCount",
      "Mappings: {count}"
    ).replace("{count}", String(i))
  ), t.textContent = r.join(" ");
}
c(ci, "updateStatusLine");
function Ir(t, { state: e, hasCategories: n }) {
  if (!t) return;
  const i = !!(e != null && e.base), r = i && n;
  t.disabled = !r, t.title = r ? "" : i ? S(
    "EIDOLON.LightCriteria.CreateDisabledNoCategories",
    "Add scene criteria with values before creating mappings."
  ) : S(
    "EIDOLON.LightCriteria.CreateDisabledNoBase",
    "Save a base lighting state before creating criteria mappings."
  );
}
c(Ir, "updateCreateButtonState");
function Zo(t, e) {
  var l, u, d;
  const n = e ?? wh(t);
  if (!n)
    throw new Error("Ambient light document unavailable.");
  const i = Pi(((l = n.toObject) == null ? void 0 : l.call(n)) ?? {});
  if (!i)
    throw new Error("Unable to duplicate ambient light data.");
  const r = (t == null ? void 0 : t.form) instanceof HTMLFormElement ? t.form : null, o = r ? Ag(r) : {}, s = foundry.utils.mergeObject(i, o, {
    inplace: !1,
    performDeletions: !0
  });
  r && (r.querySelectorAll("color-picker[name]").forEach((f) => {
    var b, w;
    const h = f.getAttribute("name");
    if (!h) return;
    const m = typeof f.value == "string" ? f.value : "", g = ((b = f.ui) == null ? void 0 : b.input) ?? ((w = f.querySelector) == null ? void 0 : w.call(f, 'input[type="color"]')), y = (g == null ? void 0 : g.value) ?? "", v = m || y;
    typeof v != "string" || !v || (foundry.utils.setProperty(s, h, v), _("LightCriteria | Captured color-picker value", {
      path: h,
      pickerValue: m,
      swatchValue: y,
      chosenValue: v
    }));
  }), r.querySelectorAll("range-picker[name]").forEach((f) => {
    var O, k;
    const h = f.getAttribute("name");
    if (!h) return;
    const m = f.value !== void 0 && f.value !== null ? String(f.value) : "", g = (O = f.querySelector) == null ? void 0 : O.call(f, 'input[type="range"]'), y = (k = f.querySelector) == null ? void 0 : k.call(f, 'input[type="number"]'), v = g instanceof HTMLInputElement ? g.value : "", b = y instanceof HTMLInputElement ? y.value : "", w = m || b || v;
    if (typeof w != "string" || !w.length) return;
    const E = Number(w), C = Number.isFinite(E) ? E : w;
    foundry.utils.setProperty(s, h, C), _("LightCriteria | Captured range-picker value", {
      path: h,
      elementValue: m,
      numberValue: b,
      rangeValue: v,
      chosenValue: C
    });
  }));
  const a = Pi(s);
  return _("LightCriteria | Captured form config", {
    lightId: (n == null ? void 0 : n.id) ?? null,
    hasColor: !!((u = a == null ? void 0 : a.config) != null && u.color),
    color: ((d = a == null ? void 0 : a.config) == null ? void 0 : d.color) ?? null
  }), a;
}
c(Zo, "captureAmbientLightFormConfig");
function es(t, e, n) {
  if (!n || typeof n != "object") return;
  const i = foundry.utils.flattenObject(n, { safe: !0 });
  for (const [r, o] of Object.entries(i)) {
    const s = e.querySelectorAll(`[name="${r}"]`);
    if (s.length) {
      _("LightCriteria | Applying field", {
        path: r,
        value: o,
        elementCount: s.length
      });
      for (const a of s)
        a instanceof HTMLElement && a.tagName === "COLOR-PICKER" ? Ky(a, o) : a instanceof HTMLElement && a.tagName === "RANGE-PICKER" ? Xy(a, o) : a instanceof HTMLInputElement ? Yy(a, o) : a instanceof HTMLSelectElement ? Jy(a, o) : a instanceof HTMLTextAreaElement && Qy(a, o);
    }
  }
  requestAnimationFrame(() => {
    var r;
    return (r = t._previewChanges) == null ? void 0 : r.call(t);
  });
}
c(es, "applyConfigToForm");
function Yy(t, e, n) {
  const i = t.type;
  if (i === "checkbox") {
    const s = !!e;
    t.checked !== s && (t.checked = s, jt(t));
    return;
  }
  if (i === "radio") {
    const s = e == null ? "" : String(e), a = t.value === s;
    t.checked !== a && (t.checked = a, a && jt(t));
    return;
  }
  const r = e == null ? "" : String(e);
  let o = !1;
  t.value !== r && (t.value = r, o = !0), o && jt(t);
}
c(Yy, "applyValueToInput");
function Ky(t, e, n) {
  var a, l, u, d, f, h;
  const i = e == null ? "" : String(e);
  let r = !1;
  t.value !== i && (t.value = i, t.setAttribute("value", i), (a = t.ui) != null && a.setValue && t.ui.setValue(i), r = !0);
  const o = ((l = t.ui) == null ? void 0 : l.input) ?? ((u = t.querySelector) == null ? void 0 : u.call(t, 'input[type="color"]'));
  o instanceof HTMLInputElement && o.value !== i && (o.value = i, jt(o));
  const s = ((d = t.ui) == null ? void 0 : d.text) ?? ((f = t.querySelector) == null ? void 0 : f.call(t, 'input[type="text"]'));
  s instanceof HTMLInputElement && s.value !== i && (s.value = i, jt(s)), (h = t.ui) != null && h.commit ? t.ui.commit() : (t.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), t.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }))), _("LightCriteria | Color picker applied", {
    value: i,
    pickerValue: t.value ?? null,
    swatchValue: (o == null ? void 0 : o.value) ?? null,
    textValue: (s == null ? void 0 : s.value) ?? null
  }), r && jt(t);
}
c(Ky, "applyValueToColorPicker");
function Xy(t, e, n) {
  var u, d;
  const i = e == null ? "" : String(e), r = Number(i), o = Number.isFinite(r) ? r : i;
  let s = !1;
  t.value !== void 0 && t.value !== o && (t.value = o, s = !0), t.getAttribute("value") !== i && (t.setAttribute("value", i), s = !0);
  const a = (u = t.querySelector) == null ? void 0 : u.call(t, 'input[type="range"]');
  a instanceof HTMLInputElement && a.value !== i && (a.value = i, jt(a));
  const l = (d = t.querySelector) == null ? void 0 : d.call(t, 'input[type="number"]');
  if (l instanceof HTMLInputElement && l.value !== i && (l.value = i, jt(l)), typeof t.commit == "function")
    try {
      t.commit();
    } catch (f) {
      console.error("eidolon-utilities | range-picker commit failed", f);
    }
  _("LightCriteria | Range picker applied", {
    value: i,
    resolvedValue: o,
    rangeValue: (a == null ? void 0 : a.value) ?? null,
    numberValue: (l == null ? void 0 : l.value) ?? null
  }), s && jt(t);
}
c(Xy, "applyValueToRangePicker");
function Jy(t, e, n) {
  const i = e == null ? "" : String(e);
  t.value !== i && (t.value = i, jt(t));
}
c(Jy, "applyValueToSelect");
function Qy(t, e, n) {
  const i = e == null ? "" : String(e);
  t.value !== i && (t.value = i, jt(t));
}
c(Qy, "applyValueToTextarea");
function jt(t) {
  t.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), t.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }));
}
c(jt, "triggerInputChange");
function Ja({
  mappingSelect: t,
  applyMappingButton: e,
  updateMappingButton: n,
  editCriteriaButton: i,
  removeMappingButton: r,
  actionsMenu: o,
  state: s
}) {
  const a = (t == null ? void 0 : t.value) ?? "", l = !!(s != null && s.base), u = a && a !== we ? !!qr(s, a) : !1;
  if (e instanceof HTMLButtonElement && (a ? a === we ? e.disabled = !l : e.disabled = !u : e.disabled = !0), n instanceof HTMLButtonElement && (a ? a === we ? n.disabled = !1 : n.disabled = !u : n.disabled = !0), i instanceof HTMLButtonElement && (i.disabled = !a || a === we || !u), r instanceof HTMLButtonElement && (r.disabled = !a || a === we || !u), o instanceof HTMLElement) {
    const d = n instanceof HTMLButtonElement && !n.disabled || i instanceof HTMLButtonElement && !i.disabled || r instanceof HTMLButtonElement && !r.disabled;
    o.classList.toggle("is-disabled", !d), !d && "open" in o && (o.open = !1);
  }
}
c(Ja, "syncMappingSwitcherState");
function Zy(t) {
  const e = /* @__PURE__ */ new Map();
  for (const n of t) {
    if (!n) continue;
    const i = typeof n.id == "string" ? n.id : null;
    if (!i) continue;
    const r = typeof n.name == "string" && n.name.trim() ? n.name.trim() : S("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category");
    e.has(i) || e.set(i, r);
  }
  return e;
}
c(Zy, "buildCategoryNameLookup");
function eb(t) {
  const e = {};
  return t instanceof HTMLElement && t.querySelectorAll("select[data-filter-category-id]").forEach((n) => {
    var o, s;
    const i = n.dataset.filterCategoryId, r = (s = (o = n.value) == null ? void 0 : o.trim) == null ? void 0 : s.call(o);
    !i || !r || (e[i] = r);
  }), e;
}
c(eb, "readMappingFilterSelections");
function tb(t) {
  t instanceof HTMLElement && t.querySelectorAll("select[data-filter-category-id]").forEach((e) => {
    e.value = "";
  });
}
c(tb, "resetMappingFilterSelections");
function nb(t, e) {
  const n = Array.isArray(t) ? t : [], i = Object.entries(e ?? {}).filter(([, r]) => !!r);
  return i.length ? n.filter((r) => {
    if (!r || typeof r != "object") return !1;
    const o = r.categories ?? {};
    for (const [s, a] of i)
      if ((o == null ? void 0 : o[s]) !== a) return !1;
    return !0;
  }) : n.slice();
}
c(nb, "filterMappingsByCriteria");
function ib(t, { totalCount: e = 0, visibleCount: n = 0, hasFilters: i = !1, activeFilterCount: r = 0 } = {}) {
  if (!(t instanceof HTMLElement)) return;
  if (!i) {
    t.textContent = S(
      "EIDOLON.LightCriteria.FilterSummaryAll",
      "All ({count})"
    ).replace("{count}", String(e));
    return;
  }
  const o = S(
    "EIDOLON.LightCriteria.FilterSummaryActive",
    "{active} filters · {visible}/{total}"
  ).replace("{active}", String(r)).replace("{visible}", String(n)).replace("{total}", String(e));
  t.textContent = o;
}
c(ib, "updateMappingFilterMeta");
function rb(t, e, n, i, r = {}) {
  if (!(t instanceof HTMLSelectElement)) return;
  const o = typeof i == "string" ? i : "", s = !!(e != null && e.base), a = Array.isArray(r == null ? void 0 : r.categoryOrder) ? r.categoryOrder : [], l = Array.isArray(r == null ? void 0 : r.mappings) ? r.mappings.slice() : Array.isArray(e == null ? void 0 : e.mappings) ? e.mappings.slice() : [], u = t.value;
  t.innerHTML = "";
  const d = document.createElement("option");
  d.value = "", d.textContent = S(
    "EIDOLON.LightCriteria.SelectPlaceholder",
    "Select a mapping"
  ), d.disabled = s, t.appendChild(d);
  const f = document.createElement("option");
  f.value = we, f.textContent = S(
    "EIDOLON.LightCriteria.BaseOption",
    "Base Lighting"
  ), f.disabled = !s, t.appendChild(f), l.slice().sort((y, v) => {
    var E;
    const b = ir(y, n, a), w = ir(v, n, a);
    return b.localeCompare(w, ((E = game.i18n) == null ? void 0 : E.lang) ?? void 0, {
      sensitivity: "base"
    });
  }).forEach((y) => {
    if (!(y != null && y.id)) return;
    const v = document.createElement("option");
    v.value = y.id, v.textContent = ir(y, n, a), t.appendChild(v);
  });
  const h = new Set(
    Array.from(t.options).filter((y) => !y.disabled).map((y) => y.value)
  ), m = s && u === "" ? "" : u, g = o || (h.has(m) ? m : "");
  g && h.has(g) ? t.value = g : s ? t.value = we : t.value = "";
}
c(rb, "populateMappingSelector");
function ir(t, e, n = []) {
  if (!t || typeof t != "object")
    return S("EIDOLON.LightCriteria.UnnamedMapping", "Unnamed Mapping");
  if (typeof t.label == "string" && t.label.trim())
    return t.label.trim();
  const i = t.categories ?? {}, r = [], o = /* @__PURE__ */ new Set();
  for (const a of n)
    !a || o.has(a) || (r.push(a), o.add(a));
  for (const a of Object.keys(i).sort((l, u) => l.localeCompare(u)))
    o.has(a) || (r.push(a), o.add(a));
  const s = r.map((a) => {
    const l = i == null ? void 0 : i[a];
    if (typeof l != "string" || !l.trim()) return null;
    const u = l.trim();
    return `${e.get(a) ?? S("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category")}=${u}`;
  }).filter(Boolean);
  return s.length === 0 ? S("EIDOLON.LightCriteria.UnnamedMapping", "Unnamed Mapping") : s.join(" | ");
}
c(ir, "formatMappingOptionLabel");
function rc(t, e) {
  if (!t || typeof t != "object" || !Array.isArray(t.mappings)) return null;
  const n = br(e);
  if (!n) return null;
  const i = t.mappings.find((r) => (r == null ? void 0 : r.key) === n);
  return (i == null ? void 0 : i.id) ?? null;
}
c(rc, "findMappingIdByCategories");
function qr(t, e) {
  return !e || !t || typeof t != "object" || !Array.isArray(t.mappings) ? null : t.mappings.find((n) => (n == null ? void 0 : n.id) === e) ?? null;
}
c(qr, "getMappingById");
function ob(t) {
  if (!t || typeof t != "object") return "";
  const e = t.current;
  if (e != null && e.mappingId) {
    if (e.mappingId === we)
      return t != null && t.base ? we : "";
    if (Array.isArray(t.mappings) && t.mappings.some((n) => n.id === e.mappingId))
      return e.mappingId;
  }
  if (e != null && e.categories) {
    const n = rc(t, e.categories);
    if (n) return n;
  }
  return "";
}
c(ob, "resolveInitialMappingSelection");
function id(t, e = {}) {
  var s, a, l, u;
  if (!(t instanceof HTMLFormElement)) return;
  const n = t.querySelector('color-picker[name="config.color"]'), i = (n == null ? void 0 : n.value) ?? null, r = ((s = n == null ? void 0 : n.ui) == null ? void 0 : s.text) ?? ((a = n == null ? void 0 : n.querySelector) == null ? void 0 : a.call(n, 'input[type="text"]')), o = ((l = n == null ? void 0 : n.ui) == null ? void 0 : l.input) ?? ((u = n == null ? void 0 : n.querySelector) == null ? void 0 : u.call(n, 'input[type="color"]'));
  _("LightCriteria | Color state after apply", {
    ...e,
    textValue: (r == null ? void 0 : r.value) ?? null,
    pickerValue: i,
    swatchValue: (o == null ? void 0 : o.value) ?? null
  });
}
c(id, "logAppliedColorState");
function sb(t) {
  t.querySelectorAll("select[data-category-id]").forEach((e) => {
    e.value = "";
  });
}
c(sb, "resetCategorySelections");
function ab(t, e) {
  const n = e && typeof e == "object" ? e : {};
  t.querySelectorAll("select[data-category-id]").forEach((i) => {
    const r = i.dataset.categoryId;
    if (!r) return;
    const o = n[r];
    i.value = typeof o == "string" ? o : "";
  });
}
c(ab, "setCategorySelections");
function lb(t) {
  const e = {};
  return t.querySelectorAll("select[data-category-id]").forEach((n) => {
    var o, s;
    const i = n.dataset.categoryId, r = (s = (o = n.value) == null ? void 0 : o.trim) == null ? void 0 : s.call(o);
    !i || !r || (e[i] = r);
  }), Object.keys(e).length > 0 ? e : null;
}
c(lb, "readCategorySelections");
async function Qa(t, e, n) {
  if (!t) return null;
  try {
    if (!n)
      return await Hr(t, {});
    if (n === we)
      return await Hr(t, {
        mappingId: we,
        categories: null,
        updatedAt: Date.now()
      });
    const i = qr(e, n);
    return i ? await Hr(t, {
      mappingId: i.id,
      categories: i.categories,
      updatedAt: Date.now()
    }) : null;
  } catch (i) {
    return console.warn("eidolon-utilities | Failed to persist mapping selection", i), null;
  }
}
c(Qa, "persistCurrentSelection");
function tu(t, e) {
  if (!(t instanceof HTMLElement)) return;
  const n = t.querySelector(".eidolon-light-criteria-manager__section.is-bottom");
  n instanceof HTMLElement && (n.hidden = !!(e != null && e.hidden));
}
c(tu, "updateManagerSectionVisibility");
function di({ switcher: t, emptyState: e, state: n }) {
  const i = !!(n != null && n.base);
  t instanceof HTMLElement && (t.hidden = !i), e instanceof HTMLElement && (e.hidden = i);
}
c(di, "updateActiveMappingVisibility");
function wh(t) {
  const e = (t == null ? void 0 : t.object) ?? (t == null ? void 0 : t.document) ?? null;
  return !(e != null && e.isEmbedded) || e.documentName !== "AmbientLight" ? null : e;
}
c(wh, "getAmbientLightDocument");
function cb(t) {
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
c(cb, "getPersistedAmbientLightDocument");
function ub() {
  Hy();
}
c(ub, "registerLightCriteriaHooks");
ub();
const oc = /* @__PURE__ */ new Map();
let sc = !1;
function nu(t, e) {
  oc.has(t) && console.warn(`[${L}] Socket handler for type "${t}" already registered, overwriting.`), oc.set(t, e);
}
c(nu, "registerSocketHandler");
function ts(t, e) {
  if (!sc) {
    console.error(`[${L}] Socket not initialized. Call initializeSocket() first.`);
    return;
  }
  game.socket.emit(`module.${L}`, { type: t, payload: e });
}
c(ts, "emitSocket");
function db() {
  sc || (game.socket.on(`module.${L}`, (t) => {
    const { type: e, payload: n } = t ?? {}, i = oc.get(e);
    i ? i(n) : console.warn(`[${L}] No socket handler for type "${e}"`);
  }), sc = !0, console.log(`[${L}] Socket initialized on channel module.${L}`));
}
c(db, "initializeSocket");
const Eh = "tween", Sh = "tween-sequence", ac = "tween-sequence-cancel", Ae = Object.freeze({
  ABORT: "abort",
  CONTINUE: "continue"
}), kn = Object.freeze({
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  FAILED: "failed"
}), Lt = Object.freeze({
  BEFORE_ALL: "beforeAll",
  BEFORE_STEP: "before",
  ENTRY: "entry",
  AFTER_STEP: "after",
  RUNTIME: "runtime",
  VALIDATION: "validation",
  AWAIT: "await",
  EMIT: "emit",
  PARALLEL: "parallel"
}), Cs = /* @__PURE__ */ new Map();
function Gt({ type: t, execute: e, validate: n }) {
  Cs.has(t) && console.warn(`[tween-registry] Type "${t}" already registered, overwriting.`), Cs.set(t, { type: t, execute: e, validate: n ?? (() => {
  }) });
}
c(Gt, "registerTweenType");
function vr(t) {
  return Cs.get(t);
}
c(vr, "getTweenType");
function fb(t, e = {}) {
  const n = vr(t);
  if (!n)
    throw new Error(`Unknown tween type: "${t}".`);
  return n.validate(e ?? {}), n;
}
c(fb, "validateTweenEntry");
function lc() {
  return [...Cs.keys()];
}
c(lc, "listTweenTypes");
const rr = {
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
  easeInBounce: /* @__PURE__ */ c((t) => 1 - rr.easeOutBounce(1 - t), "easeInBounce"),
  easeInOutBounce: /* @__PURE__ */ c((t) => t < 0.5 ? (1 - rr.easeOutBounce(1 - 2 * t)) / 2 : (1 + rr.easeOutBounce(2 * t - 1)) / 2, "easeInOutBounce"),
  easeInElastic: /* @__PURE__ */ c((t) => t === 0 || t === 1 ? t : -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI), "easeInElastic"),
  easeOutElastic: /* @__PURE__ */ c((t) => t === 0 || t === 1 ? t : Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1, "easeOutElastic")
};
function at(t) {
  if (t && rr[t])
    return rr[t];
  const e = foundry.canvas.animation.CanvasAnimation;
  return {
    linear: e.easeLinear,
    easeInOutCosine: e.easeInOutCosine
  }[t] ?? e.easeInOutCosine;
}
c(at, "resolveEasing");
function iu() {
  return ["linear", "easeInOutCosine", ...Object.keys(rr)];
}
c(iu, "listEasingNames");
function Ts(t) {
  return t <= 0.04045 ? t / 12.92 : ((t + 0.055) / 1.055) ** 2.4;
}
c(Ts, "srgbToLinear");
function or(t) {
  return t <= 31308e-7 ? 12.92 * t : 1.055 * t ** (1 / 2.4) - 0.055;
}
c(or, "linearToSrgb");
function rd(t, e, n) {
  const i = 0.4122214708 * t + 0.5363325363 * e + 0.0514459929 * n, r = 0.2119034982 * t + 0.6806995451 * e + 0.1073969566 * n, o = 0.0883024619 * t + 0.2817188376 * e + 0.6299787005 * n, s = Math.cbrt(i), a = Math.cbrt(r), l = Math.cbrt(o);
  return [
    0.2104542553 * s + 0.793617785 * a - 0.0040720468 * l,
    1.9779984951 * s - 2.428592205 * a + 0.4505937099 * l,
    0.0259040371 * s + 0.7827717662 * a - 0.808675766 * l
  ];
}
c(rd, "linearRgbToOklab");
function hb(t, e, n) {
  const i = (t + 0.3963377774 * e + 0.2158037573 * n) ** 3, r = (t - 0.1055613458 * e - 0.0638541728 * n) ** 3, o = (t - 0.0894841775 * e - 1.291485548 * n) ** 3;
  return [
    4.0767416621 * i - 3.3077115913 * r + 0.2309699292 * o,
    -1.2684380046 * i + 2.6097574011 * r - 0.3413193965 * o,
    -0.0041960863 * i - 0.7034186147 * r + 1.707614701 * o
  ];
}
c(hb, "oklabToLinearRgb");
function Ls(t) {
  return [t.r, t.g, t.b];
}
c(Ls, "colorToRgb");
function Ch(t, e, n) {
  const i = /* @__PURE__ */ c((o) => Math.max(0, Math.min(1, o)), "clamp"), r = /* @__PURE__ */ c((o) => Math.round(i(o) * 255).toString(16).padStart(2, "0"), "toHex");
  return `#${r(t)}${r(e)}${r(n)}`;
}
c(Ch, "rgbToHex");
function mb(t, e, n) {
  if (n <= 0) return t.toHTML();
  if (n >= 1) return e.toHTML();
  const i = foundry.utils.Color, [r, o, s] = t.hsl, [a, l, u] = e.hsl, d = (a - r + 0.5) % 1 - 0.5, f = (r + d * n + 1) % 1, h = o + (l - o) * n, m = s + (u - s) * n;
  return i.fromHSL([f, h, m]).toHTML();
}
c(mb, "interpolateHsl");
function gb(t, e, n) {
  if (n <= 0) return t.toHTML();
  if (n >= 1) return e.toHTML();
  const [i, r, o] = Ls(t).map(Ts), [s, a, l] = Ls(e).map(Ts), u = or(i + (s - i) * n), d = or(r + (a - r) * n), f = or(o + (l - o) * n);
  return Ch(u, d, f);
}
c(gb, "interpolateRgb");
function pb(t, e, n) {
  if (n <= 0) return t.toHTML();
  if (n >= 1) return e.toHTML();
  const [i, r, o] = Ls(t).map(Ts), [s, a, l] = Ls(e).map(Ts), [u, d, f] = rd(i, r, o), [h, m, g] = rd(s, a, l), y = 0.02, v = Math.sqrt(d * d + f * f), b = Math.sqrt(m * m + g * g);
  let w, E, C;
  if (v < y || b < y)
    w = u + (h - u) * n, E = d + (m - d) * n, C = f + (g - f) * n;
  else {
    const $ = Math.atan2(f, d);
    let N = Math.atan2(g, m) - $;
    N > Math.PI && (N -= 2 * Math.PI), N < -Math.PI && (N += 2 * Math.PI), w = u + (h - u) * n;
    const F = v + (b - v) * n, M = $ + N * n;
    E = F * Math.cos(M), C = F * Math.sin(M);
  }
  const [O, k, x] = hb(w, E, C);
  return Ch(or(O), or(k), or(x));
}
c(pb, "interpolateOklch");
const cc = {
  hsl: mb,
  rgb: gb,
  oklch: pb
};
function ru(t = "hsl") {
  return cc[t] ?? cc.hsl;
}
c(ru, "getInterpolator");
function dr() {
  return Object.keys(cc);
}
c(dr, "listInterpolationModes");
function yb(t) {
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
  if (t.mode && !dr().includes(t.mode))
    throw new Error(
      `light-color tween: unknown mode "${t.mode}". Available: ${dr().join(", ")}`
    );
}
c(yb, "validate$7");
async function bb(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { Color: i } = foundry.utils, { uuid: r, toColor: o, toAlpha: s, mode: a = "oklch" } = t, l = Array.isArray(r) ? r : [r];
  if (l.length === 0)
    return console.warn("light-color tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: u = 2e3,
    easing: d = "easeInOutCosine",
    commit: f = !0,
    startEpochMS: h = null,
    signal: m = null
  } = e, g = at(d), y = o != null, v = s != null, b = y ? ru(a) : null, w = y ? i.fromString(o) : null;
  if (y && !w.valid) throw new Error(`light-color tween: invalid target color "${o}".`);
  async function E(O) {
    var j, H;
    if (m != null && m.aborted) return !1;
    const k = await fromUuid(O);
    if (!k) return !1;
    const x = k.object;
    if (!x) return !1;
    let $;
    if (y) {
      const V = (j = k.config) == null ? void 0 : j.color;
      V != null && V.valid || console.warn(`light-color tween: source color invalid on ${O}, using white.`), $ = V != null && V.valid ? V : i.fromString("#ffffff");
    }
    const D = v ? ((H = k._source.config) == null ? void 0 : H.alpha) ?? 0.5 : null, N = { t: 0 }, F = `ambient-hue-tween:${O}`;
    n.terminateAnimation(F), m && m.addEventListener("abort", () => {
      n.terminateAnimation(F);
    }, { once: !0 });
    const M = typeof h == "number" ? Math.max(0, Math.min(u, Date.now() - h)) : 0, R = /* @__PURE__ */ c((V) => {
      const Y = {};
      y && (Y.color = b($, w, V)), v && (Y.alpha = D + (s - D) * V), k.updateSource({ config: Y }), x.initializeLightSource();
    }, "applyFrame");
    M > 0 && (N.t = M / u, R(N.t));
    const B = await n.animate(
      [{ parent: N, attribute: "t", to: 1 }],
      {
        name: F,
        duration: u,
        easing: g,
        time: M,
        ontick: /* @__PURE__ */ c(() => R(N.t), "ontick")
      }
    );
    if (B !== !1) {
      if (m != null && m.aborted) return !1;
      const V = {};
      y && (V.color = w.toHTML()), v && (V.alpha = s), k.updateSource({ config: V }), x.initializeLightSource();
    }
    if (f && B !== !1 && k.canUserModify(game.user, "update")) {
      if (m != null && m.aborted) return !1;
      const V = {}, Y = {};
      y && (V.color = $.toHTML(), Y["config.color"] = w.toHTML()), v && (V.alpha = D, Y["config.alpha"] = s), k.updateSource({ config: V }), await k.update(Y);
    }
    return B !== !1;
  }
  return c(E, "animateOne"), (await Promise.all(l.map(E))).every(Boolean);
}
c(bb, "execute$7");
function vb() {
  Gt({ type: "light-color", execute: bb, validate: yb });
}
c(vb, "registerLightColorTween");
const An = /* @__PURE__ */ new WeakMap();
function wb(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("light-state tween: 'uuid' is required (string or array of AmbientLight document UUIDs).");
  if (typeof t.enabled != "boolean")
    throw new Error("light-state tween: 'enabled' (boolean) is required.");
}
c(wb, "validate$6");
async function Eb(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, enabled: r } = t, o = Array.isArray(i) ? i : [i];
  if (o.length === 0)
    return console.warn("light-state tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: s = 2e3,
    easing: a = "easeInOutCosine",
    commit: l = !0,
    startEpochMS: u = null,
    signal: d = null
  } = e, f = at(a);
  async function h(g) {
    var k, x, $, D;
    if (d != null && d.aborted) return !1;
    const y = await fromUuid(g);
    if (!y) return !1;
    const v = y.object;
    if (!v) return !1;
    const b = `ambient-state-tween:${g}`;
    n.terminateAnimation(b), d && d.addEventListener("abort", () => {
      n.terminateAnimation(b);
    }, { once: !0 });
    const w = An.get(y) ?? {
      hidden: y._source.hidden,
      alpha: ((k = y._source.config) == null ? void 0 : k.alpha) ?? 0.5
    };
    if (An.set(y, w), _(`light-state START ${r ? "ON" : "OFF"} | snap: ${JSON.stringify(w)} | _source.hidden=${y._source.hidden}, _source.config.alpha=${(x = y._source.config) == null ? void 0 : x.alpha}`), r && !w.hidden || !r && w.hidden)
      return An.delete(y), !0;
    const E = w.alpha, C = typeof u == "number" ? Math.max(0, Math.min(s, Date.now() - u)) : 0, O = /* @__PURE__ */ c((N) => {
      y.updateSource({ config: { alpha: N } }), v.initializeLightSource();
    }, "applyAlpha");
    if (r) {
      y.updateSource({ hidden: !1, config: { alpha: 0 } }), v.initializeLightSource(), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
      const N = { t: 0 };
      C > 0 && (N.t = C / s, O(E * N.t));
      const F = await n.animate(
        [{ parent: N, attribute: "t", to: 1 }],
        {
          name: b,
          duration: s,
          easing: f,
          time: C,
          ontick: /* @__PURE__ */ c(() => O(E * N.t), "ontick")
        }
      );
      return F !== !1 && !(d != null && d.aborted) && l && y.canUserModify(game.user, "update") ? (y.updateSource({ hidden: !0, config: { alpha: E } }), await y.update({ hidden: !1 }), _(`light-state FADE-IN committed. _source.hidden=${y._source.hidden}, _source.config.alpha=${($ = y._source.config) == null ? void 0 : $.alpha}`), An.delete(y)) : F === !1 || An.delete(y), F !== !1;
    } else {
      y.updateSource({ hidden: !1, config: { alpha: w.alpha } }), v.initializeLightSource();
      const N = { t: 0 };
      C > 0 && (N.t = C / s, O(E * (1 - N.t)));
      const F = await n.animate(
        [{ parent: N, attribute: "t", to: 1 }],
        {
          name: b,
          duration: s,
          easing: f,
          time: C,
          ontick: /* @__PURE__ */ c(() => O(E * (1 - N.t)), "ontick")
        }
      );
      return F !== !1 && !(d != null && d.aborted) && l && y.canUserModify(game.user, "update") ? (await y.update({ hidden: !0 }), y.updateSource({ config: { alpha: E } }), v.initializeLightSource(), _(`light-state FADE-OUT committed+restored. _source.hidden=${y._source.hidden}, _source.config.alpha=${(D = y._source.config) == null ? void 0 : D.alpha}`), An.delete(y)) : F === !1 || (y.updateSource({ hidden: !0, config: { alpha: E } }), v.initializeLightSource(), An.delete(y)), F !== !1;
    }
  }
  return c(h, "animateOne"), (await Promise.all(o.map(h))).every(Boolean);
}
c(Eb, "execute$6");
function Sb() {
  Gt({ type: "light-state", execute: Eb, validate: wb });
}
c(Sb, "registerLightStateTween");
function Aa(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("tile-prop tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (!t.attribute || typeof t.attribute != "string")
    throw new Error("tile-prop tween: 'attribute' (string) is required — dot-path to a numeric property (e.g. 'alpha', 'rotation').");
  if (typeof t.value != "number")
    throw new Error("tile-prop tween: 'value' (number) is required — the target value to animate to.");
}
c(Aa, "validate$5");
async function Ma(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, attribute: r, value: o } = t, s = Array.isArray(i) ? i : [i];
  if (s.length === 0)
    return console.warn("tile-prop tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: a = 2e3,
    easing: l = "easeInOutCosine",
    commit: u = !0,
    startEpochMS: d = null,
    signal: f = null
  } = e, h = at(l);
  async function m(y) {
    if (f != null && f.aborted) return !1;
    const v = await fromUuid(y);
    if (!v) return !1;
    const b = v.object;
    if (!b) return !1;
    const w = foundry.utils.getProperty(v._source, r);
    if (typeof w != "number")
      return console.warn(`tile-prop tween: source value at '${r}' on ${y} is not a number (got ${typeof w}). Skipping.`), !1;
    const E = `tile-prop-tween:${r}:${y}`;
    n.terminateAnimation(E), f && f.addEventListener("abort", () => {
      n.terminateAnimation(E);
    }, { once: !0 });
    const C = typeof d == "number" ? Math.max(0, Math.min(a, Date.now() - d)) : 0, O = /* @__PURE__ */ c(($) => {
      const D = w + (o - w) * $;
      v.updateSource(foundry.utils.expandObject({ [r]: D })), b.refresh();
    }, "applyFrame"), k = { t: 0 };
    C > 0 && (k.t = C / a, O(k.t));
    const x = await n.animate(
      [{ parent: k, attribute: "t", to: 1 }],
      {
        name: E,
        duration: a,
        easing: h,
        time: C,
        ontick: /* @__PURE__ */ c(() => O(k.t), "ontick")
      }
    );
    if (x !== !1) {
      if (f != null && f.aborted) return !1;
      v.updateSource(foundry.utils.expandObject({ [r]: o })), b.refresh();
    }
    if (u && x !== !1 && v.canUserModify(game.user, "update")) {
      if (f != null && f.aborted) return !1;
      v.updateSource(foundry.utils.expandObject({ [r]: w })), await v.update({ [r]: o });
    }
    return x !== !1;
  }
  return c(m, "animateOne"), (await Promise.all(s.map(m))).every(Boolean);
}
c(Ma, "execute$5");
function Cb() {
  Gt({ type: "tile-prop", execute: Ma, validate: Aa });
}
c(Cb, "registerTilePropTween");
function Tb(t) {
  if (!t.attribute || typeof t.attribute != "string")
    throw new Error("particles-prop tween: 'attribute' (string) is required — property name on canvas.particleeffects (e.g. 'alpha').");
  if (typeof t.value != "number")
    throw new Error("particles-prop tween: 'value' (number) is required — the target value to animate to.");
}
c(Tb, "validate$4");
async function Lb(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { attribute: i, value: r } = t, {
    durationMS: o = 2e3,
    easing: s = "easeInOutCosine",
    startEpochMS: a = null,
    signal: l = null
  } = e, u = canvas.particleeffects;
  if (!u)
    return console.warn("particles-prop tween: canvas.particleeffects not available."), !1;
  const d = u[i];
  if (typeof d != "number")
    return console.warn(`particles-prop tween: current value of '${i}' is not a number (got ${typeof d}). Skipping.`), !1;
  const f = at(s), h = `particles-prop-tween:${i}`;
  n.terminateAnimation(h), l && l.addEventListener("abort", () => {
    n.terminateAnimation(h);
  }, { once: !0 });
  const m = typeof a == "number" ? Math.max(0, Math.min(o, Date.now() - a)) : 0, g = /* @__PURE__ */ c((b) => {
    u[i] = d + (r - d) * b;
  }, "applyFrame"), y = { t: 0 };
  m > 0 && (y.t = m / o, g(y.t));
  const v = await n.animate(
    [{ parent: y, attribute: "t", to: 1 }],
    {
      name: h,
      duration: o,
      easing: f,
      time: m,
      ontick: /* @__PURE__ */ c(() => g(y.t), "ontick")
    }
  );
  if (v !== !1) {
    if (l != null && l.aborted) return !1;
    u[i] = r;
  }
  return v !== !1;
}
c(Lb, "execute$4");
function Ib() {
  Gt({ type: "particles-prop", execute: Lb, validate: Tb });
}
c(Ib, "registerParticlesPropTween");
var Dn, uo, fo, ho, mo, go, ar;
const Cu = class Cu {
  /**
   * @param {AbortController} controller
   */
  constructor(e) {
    A(this, Dn);
    A(this, uo);
    A(this, fo);
    A(this, ho);
    A(this, mo);
    A(this, go, !1);
    A(this, ar, null);
    I(this, Dn, e), I(this, ho, new Promise((n) => {
      I(this, uo, n);
    })), I(this, mo, new Promise((n) => {
      I(this, fo, n);
    }));
  }
  /** @returns {Promise<boolean>} Resolves true (completed) or false (cancelled/failed). */
  get finished() {
    return p(this, ho);
  }
  /** @returns {Promise<{status: string, [k: string]: unknown}>} */
  get result() {
    return p(this, mo);
  }
  /** @returns {boolean} */
  get cancelled() {
    return p(this, Dn).signal.aborted;
  }
  /** @returns {AbortSignal} */
  get signal() {
    return p(this, Dn).signal;
  }
  /** @returns {string} */
  get status() {
    return p(this, ar) ? p(this, ar).status : this.cancelled ? "cancelled" : "running";
  }
  /** Abort the timeline, triggering onCancel callbacks. */
  cancel(e = "cancelled") {
    p(this, Dn).signal.aborted || p(this, Dn).abort(e);
  }
  /**
   * Called internally by the execution engine when the timeline finishes.
   * @param {boolean} completed - true if all steps ran, false if cancelled
   */
  _resolve(e) {
    if (p(this, go)) return;
    I(this, go, !0);
    const n = typeof e == "boolean" ? { status: e ? "completed" : "cancelled" } : e ?? { status: "cancelled" };
    I(this, ar, n), p(this, uo).call(this, n.status === "completed"), p(this, fo).call(this, n);
  }
};
Dn = new WeakMap(), uo = new WeakMap(), fo = new WeakMap(), ho = new WeakMap(), mo = new WeakMap(), go = new WeakMap(), ar = new WeakMap(), c(Cu, "TimelineHandle");
let uc = Cu;
var Oi, lr, ki;
const Tu = class Tu {
  constructor() {
    /** @type {Map<string, Set<Function>>} */
    A(this, Oi, /* @__PURE__ */ new Map());
    /** @type {Set<string>} Signals that have been emitted (sticky) */
    A(this, lr, /* @__PURE__ */ new Set());
    A(this, ki, !1);
  }
  /**
   * Subscribe to a named signal.
   * @param {string} signal
   * @param {Function} listener
   * @returns {() => void} Unsubscribe function
   */
  on(e, n) {
    if (p(this, ki)) return () => {
    };
    let i = p(this, Oi).get(e);
    return i || (i = /* @__PURE__ */ new Set(), p(this, Oi).set(e, i)), i.add(n), () => i.delete(n);
  }
  /**
   * Fire a named signal synchronously. All registered listeners are invoked.
   * The signal is recorded so that future waitFor() calls resolve immediately.
   * @param {string} signal
   */
  emit(e) {
    if (p(this, ki)) return;
    p(this, lr).add(e);
    const n = p(this, Oi).get(e);
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
    return p(this, ki) ? Promise.reject(new Error("EventBus destroyed")) : p(this, lr).has(e) ? Promise.resolve() : new Promise((i, r) => {
      if (n != null && n.aborted)
        return r(n.reason ?? "aborted");
      const o = this.on(e, () => {
        o(), s && (n == null || n.removeEventListener("abort", s)), i();
      });
      let s;
      n && (s = /* @__PURE__ */ c(() => {
        o(), r(n.reason ?? "aborted");
      }, "onAbort"), n.addEventListener("abort", s, { once: !0 }));
    });
  }
  /**
   * Tear down the bus, clearing all listeners.
   */
  destroy() {
    I(this, ki, !0), p(this, Oi).clear(), p(this, lr).clear();
  }
};
Oi = new WeakMap(), lr = new WeakMap(), ki = new WeakMap(), c(Tu, "EventBus");
let dc = Tu;
const Th = /* @__PURE__ */ new Map();
function xa(t, e) {
  Th.set(t, e);
}
c(xa, "registerAwaitProvider");
function fc(t, e) {
  const n = Th.get(t.event);
  return n ? n(t, e) : Promise.reject(new Error(`Unknown await event type: "${t.event}"`));
}
c(fc, "createAwaitPromise");
xa("signal", (t, e) => t.name ? e.eventBus.waitFor(t.name, e.signal) : Promise.reject(new Error('await signal: "name" is required')));
xa("click", (t, e) => new Promise((n, i) => {
  if (e.signal.aborted) return i(e.signal.reason ?? "aborted");
  const r = /* @__PURE__ */ c(() => {
    s(), n();
  }, "onClick"), o = /* @__PURE__ */ c(() => {
    s(), i(e.signal.reason ?? "aborted");
  }, "onAbort"), s = /* @__PURE__ */ c(() => {
    document.removeEventListener("click", r), e.signal.removeEventListener("abort", o);
  }, "cleanup");
  document.addEventListener("click", r, { once: !0 }), e.signal.addEventListener("abort", o, { once: !0 });
}));
xa("keypress", (t, e) => new Promise((n, i) => {
  if (e.signal.aborted) return i(e.signal.reason ?? "aborted");
  const r = /* @__PURE__ */ c((a) => {
    t.key && a.key !== t.key || (s(), n());
  }, "onKey"), o = /* @__PURE__ */ c(() => {
    s(), i(e.signal.reason ?? "aborted");
  }, "onAbort"), s = /* @__PURE__ */ c(() => {
    document.removeEventListener("keydown", r), e.signal.removeEventListener("abort", o);
  }, "cleanup");
  document.addEventListener("keydown", r), e.signal.addEventListener("abort", o, { once: !0 });
}));
const Xi = /* @__PURE__ */ new Map();
function Ob(t, e) {
  const n = Xi.get(t);
  n && !n.cancelled && n.cancel("replaced-by-name"), Xi.set(t, e), e.finished.then(() => {
    Xi.get(t) === e && Xi.delete(t);
  });
}
c(Ob, "registerTimeline");
function Lh(t) {
  const e = Xi.get(t);
  return e && !e.cancelled ? (e.cancel("cancelled-by-name"), !0) : !1;
}
c(Lh, "cancelTimeline");
function kb(t) {
  return Xi.get(t);
}
c(kb, "getTimeline");
function od(t, e) {
  return t <= 0 ? Promise.resolve() : new Promise((n, i) => {
    if (e.aborted) return i(e.reason);
    const r = setTimeout(n, t);
    e.addEventListener("abort", () => {
      clearTimeout(r), i(e.reason);
    }, { once: !0 });
  });
}
c(od, "cancellableDelay");
var Ve, Pn, po, yo;
const Lu = class Lu {
  constructor(e) {
    /** @type {TweenTimeline} */
    A(this, Ve);
    /** @type {Array<{ type: string, params: object, opts?: object, detach: boolean }>} */
    A(this, Pn, []);
    /** @type {Function|null} */
    A(this, po, null);
    /** @type {Function|null} */
    A(this, yo, null);
    I(this, Ve, e);
  }
  /**
   * Add a tween entry to this step.
   * @param {string} type  Registered tween type name
   * @param {object} params  Type-specific parameters
   * @param {object} [opts]  Options (durationMS, easing, etc.)
   * @returns {StepBuilder} this
   */
  add(e, n, i) {
    return p(this, Pn).push({ type: e, params: n, opts: i ?? {}, detach: !1 }), this;
  }
  /**
   * Mark the last entry as fire-and-forget (does not block step progression).
   * @returns {StepBuilder} this
   */
  detach() {
    if (p(this, Pn).length === 0)
      throw new Error("StepBuilder.detach(): no entry to detach.");
    return p(this, Pn)[p(this, Pn).length - 1].detach = !0, this;
  }
  /**
   * Callback invoked before this step's tweens start.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  before(e) {
    return I(this, po, e), this;
  }
  /**
   * Callback invoked after this step's awaited tweens complete.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  after(e) {
    return I(this, yo, e), this;
  }
  // ── Delegation to parent TweenTimeline for fluent chaining ──
  /** Start a new step (finalizes this one). */
  step() {
    return p(this, Ve).step();
  }
  /** Insert a delay between steps. */
  delay(e) {
    return p(this, Ve).delay(e);
  }
  /** Insert an await segment. */
  await(e) {
    return p(this, Ve).await(e);
  }
  /** Insert an emit segment. */
  emit(e) {
    return p(this, Ve).emit(e);
  }
  /** Insert a parallel segment. */
  parallel(e, n) {
    return p(this, Ve).parallel(e, n);
  }
  /** Register onComplete callback. */
  onComplete(e) {
    return p(this, Ve).onComplete(e);
  }
  /** Register onCancel callback. */
  onCancel(e) {
    return p(this, Ve).onCancel(e);
  }
  /** Register onError callback. */
  onError(e) {
    return p(this, Ve).onError(e);
  }
  /** Execute the timeline. */
  run(e) {
    return p(this, Ve).run(e);
  }
  /** Serialize the timeline. */
  toJSON() {
    return p(this, Ve).toJSON();
  }
  // ── Internal access ──
  /** @returns {{ entries: Array, before: Function|null, after: Function|null }} */
  _finalize() {
    return {
      entries: p(this, Pn),
      before: p(this, po),
      after: p(this, yo)
    };
  }
};
Ve = new WeakMap(), Pn = new WeakMap(), po = new WeakMap(), yo = new WeakMap(), c(Lu, "StepBuilder");
let hc = Lu;
var Ge, _e, _t, Rn, bo, vo, wo, Eo, ii, mc, X, dn, gc, Ih, pc, Oh, kh, ns, ht, Yt;
const mn = class mn {
  constructor() {
    A(this, X);
    /** @type {string|null} */
    A(this, Ge, null);
    /** @type {string} */
    A(this, _e, Ae.ABORT);
    /** @type {Array<object>} */
    A(this, _t, []);
    /** @type {StepBuilder|null} */
    A(this, Rn, null);
    /** @type {Function|null} */
    A(this, bo, null);
    /** @type {Function|null} */
    A(this, vo, null);
    /** @type {Function|null} */
    A(this, wo, null);
    /** @type {Function|null} */
    A(this, Eo, null);
  }
  /**
   * Register this timeline in the named registry. Starting a new
   * timeline with the same name cancels the previous one.
   * @param {string} name
   * @returns {TweenTimeline} this
   */
  name(e) {
    return I(this, Ge, e), this;
  }
  /**
   * Set the error policy for step execution.
   * @param {"abort"|"continue"} policy
   * @returns {TweenTimeline} this
   */
  errorPolicy(e) {
    if (e !== Ae.ABORT && e !== Ae.CONTINUE)
      throw new Error(`Invalid error policy: "${e}". Use "abort" or "continue".`);
    return I(this, _e, e), this;
  }
  /**
   * Start a new step. Finalizes the previous step if one is open.
   * @returns {StepBuilder}
   */
  step() {
    return T(this, X, dn).call(this), I(this, Rn, new hc(this)), p(this, Rn);
  }
  /**
   * Insert a delay (in ms) between the previous step and the next.
   * @param {number} ms
   * @returns {TweenTimeline} this
   */
  delay(e) {
    return T(this, X, dn).call(this), p(this, _t).push({ kind: "delay", ms: e }), this;
  }
  /**
   * Pause execution until an event occurs.
   * @param {object} config  e.g. { event: "click" }, { event: "signal", name: "fog-done" }
   * @returns {TweenTimeline} this
   */
  await(e) {
    return T(this, X, dn).call(this), p(this, _t).push({ kind: "await", config: e }), this;
  }
  /**
   * Fire a named signal (instant, non-blocking).
   * @param {string} signal  Signal name
   * @returns {TweenTimeline} this
   */
  emit(e) {
    return T(this, X, dn).call(this), p(this, _t).push({ kind: "emit", signal: e }), this;
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
    T(this, X, dn).call(this);
    const i = n.join ?? "all", r = n.overflow ?? "detach";
    if (i !== "all" && i !== "any" && (typeof i != "number" || i < 1 || i > e.length))
      throw new Error(`parallel: join must be "all", "any", or 1..${e.length}, got ${JSON.stringify(i)}`);
    if (r !== "detach" && r !== "cancel")
      throw new Error(`parallel: overflow must be "detach" or "cancel", got ${JSON.stringify(r)}`);
    const o = e.map((s) => {
      var l;
      const a = new mn();
      return s(a), T(l = a, X, dn).call(l), p(a, _t);
    });
    return p(this, _t).push({ kind: "parallel", branches: o, join: i, overflow: r }), this;
  }
  /**
   * Callback invoked before the first step runs.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  beforeAll(e) {
    return I(this, bo, e), this;
  }
  /**
   * Callback invoked on successful completion.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onComplete(e) {
    return I(this, vo, e), this;
  }
  /**
   * Callback invoked on cancellation (mutually exclusive with onComplete).
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onCancel(e) {
    return I(this, wo, e), this;
  }
  /**
   * Callback invoked on runtime failure (mutually exclusive with onComplete/onCancel).
   * @param {(outcome: object) => void} fn
   * @returns {TweenTimeline} this
   */
  onError(e) {
    return I(this, Eo, e), this;
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
    T(this, X, dn).call(this);
    const n = new AbortController();
    e.signal && (e.signal.aborted ? n.abort(e.signal.reason ?? "parent-aborted") : e.signal.addEventListener("abort", () => {
      n.signal.aborted || n.abort(e.signal.reason ?? "parent-aborted");
    }, { once: !0 }));
    const i = new uc(n);
    p(this, Ge) && Ob(p(this, Ge), i);
    const r = e.broadcast ?? game.user.isGM, o = e.commit ?? game.user.isGM, s = e.startEpochMS ?? Date.now();
    r && p(this, Ge) && ts(Sh, {
      name: p(this, Ge),
      data: this.toJSON(),
      startEpochMS: s
    });
    const a = new dc(), l = {
      signal: i.signal,
      commit: o,
      startEpochMS: s,
      eventBus: a,
      errors: [],
      detachedPromises: []
    };
    return T(this, X, Ih).call(this, i, l).then((u) => {
      var d, f, h;
      a.destroy(), i._resolve(u), u.status === kn.COMPLETED ? (d = p(this, vo)) == null || d.call(this) : u.status === kn.CANCELLED ? ((f = p(this, wo)) == null || f.call(this), r && p(this, Ge) && ts(ac, {
        name: p(this, Ge),
        reason: u.reason
      })) : ((h = p(this, Eo)) == null || h.call(this, u), r && p(this, Ge) && ts(ac, {
        name: p(this, Ge),
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
    T(this, X, dn).call(this);
    const n = { timeline: T(i = mn, ii, mc).call(i, p(this, _t)) };
    return p(this, Ge) && (n.name = p(this, Ge)), p(this, _e) !== Ae.ABORT && (n.errorPolicy = p(this, _e)), n;
  }
};
Ge = new WeakMap(), _e = new WeakMap(), _t = new WeakMap(), Rn = new WeakMap(), bo = new WeakMap(), vo = new WeakMap(), wo = new WeakMap(), Eo = new WeakMap(), ii = new WeakSet(), mc = /* @__PURE__ */ c(function(e) {
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
            var o;
            return T(o = mn, ii, mc).call(o, r);
          }),
          join: i.join,
          overflow: i.overflow
        }
      });
    else {
      const r = i.data.entries.map((o) => {
        const s = { type: o.type, params: o.params };
        return Object.keys(o.opts).length > 0 && (s.opts = o.opts), o.detach && (s.detach = !0), s;
      });
      n.push(r);
    }
  return n;
}, "#serializeSegments"), X = new WeakSet(), // ── Private ─────────────────────────────────────────────────────────
dn = /* @__PURE__ */ c(function() {
  p(this, Rn) && (p(this, _t).push({ kind: "step", data: p(this, Rn)._finalize() }), I(this, Rn, null));
}, "#finalizeCurrentStep"), gc = /* @__PURE__ */ c(function(e) {
  e.length !== 0 && Promise.allSettled(e).catch(() => {
  });
}, "#drainDetached"), Ih = /* @__PURE__ */ c(async function(e, n) {
  var i, r;
  try {
    if (n.signal.aborted) return T(this, X, ht).call(this, n.signal.reason);
    const o = await T(this, X, ns).call(this, p(this, bo), Lt.BEFORE_ALL, null);
    if (o) {
      if (p(this, _e) === Ae.ABORT) return o;
      n.errors.push(o);
    }
    const s = await T(this, X, pc).call(this, p(this, _t), n);
    if (s)
      return T(i = mn, ii, gc).call(i, n.detachedPromises), s;
    if (!n.signal.aborted) {
      const a = await Promise.allSettled(n.detachedPromises);
      for (const l of a)
        if (l.status === "rejected") {
          const u = T(this, X, Yt).call(this, l.reason, Lt.ENTRY);
          if (p(this, _e) === Ae.ABORT) return u;
          n.errors.push(u);
        }
    }
    return n.signal.aborted ? T(this, X, ht).call(this, n.signal.reason) : {
      status: kn.COMPLETED,
      ...n.errors.length > 0 ? { errors: n.errors } : {}
    };
  } catch (o) {
    return T(r = mn, ii, gc).call(r, n.detachedPromises), n.signal.aborted ? T(this, X, ht).call(this, n.signal.reason) : (console.error("TweenTimeline execution error:", o), T(this, X, Yt).call(this, o, Lt.RUNTIME));
  }
}, "#execute"), pc = /* @__PURE__ */ c(async function(e, n) {
  let i = -1, r = 0;
  for (const o of e) {
    if (n.signal.aborted) return T(this, X, ht).call(this, n.signal.reason);
    if (o.kind === "delay") {
      try {
        await od(o.ms, n.signal);
      } catch {
        return T(this, X, ht).call(this, n.signal.reason);
      }
      r += o.ms;
      continue;
    }
    if (o.kind === "await") {
      try {
        let g = fc(o.config, {
          signal: n.signal,
          eventBus: n.eventBus
        });
        const y = o.config.timeout;
        typeof y == "number" && y > 0 && (g = Promise.race([
          g,
          od(y, n.signal)
        ])), await g;
      } catch (g) {
        if (n.signal.aborted) return T(this, X, ht).call(this, n.signal.reason);
        const y = T(this, X, Yt).call(this, g, Lt.AWAIT);
        if (p(this, _e) === Ae.ABORT) return y;
        n.errors.push(y);
      }
      continue;
    }
    if (o.kind === "emit") {
      try {
        n.eventBus.emit(o.signal);
      } catch (g) {
        const y = T(this, X, Yt).call(this, g, Lt.EMIT);
        if (p(this, _e) === Ae.ABORT) return y;
        n.errors.push(y);
      }
      continue;
    }
    if (o.kind === "parallel") {
      const g = await T(this, X, Oh).call(this, o, n, r);
      if (g) return g;
      continue;
    }
    i += 1;
    const { entries: s, before: a, after: l } = o.data, u = await T(this, X, ns).call(this, a, Lt.BEFORE_STEP, i);
    if (u) {
      if (p(this, _e) === Ae.ABORT) return u;
      n.errors.push(u);
      continue;
    }
    if (n.signal.aborted) return T(this, X, ht).call(this, n.signal.reason);
    const d = [];
    let f = 0;
    for (const g of s) {
      const y = vr(g.type);
      if (!y) {
        const E = T(this, X, Yt).call(this, new Error(`TweenTimeline: unknown tween type "${g.type}"`), Lt.ENTRY, i, g.type);
        if (p(this, _e) === Ae.ABORT) return E;
        n.errors.push(E), console.warn(E.error.message);
        continue;
      }
      const v = {
        ...g.opts,
        commit: n.commit,
        startEpochMS: n.startEpochMS + r,
        signal: n.signal
      }, b = v.durationMS ?? 2e3, w = Promise.resolve().then(() => y.execute(g.params, v)).then((E) => E === !1 ? {
        ok: !1,
        failure: T(this, X, Yt).call(this, new Error("Tween entry returned false."), Lt.ENTRY, i, g.type)
      } : { ok: !0 }).catch((E) => ({
        ok: !1,
        failure: T(this, X, Yt).call(this, E, Lt.ENTRY, i, g.type)
      }));
      g.detach ? n.detachedPromises.push(w) : (d.push(w), f = Math.max(f, b));
    }
    const h = await T(this, X, kh).call(this, d, n.signal);
    if (h === null) return T(this, X, ht).call(this, n.signal.reason);
    for (const g of h)
      if (!g.ok) {
        if (p(this, _e) === Ae.ABORT) return g.failure;
        n.errors.push(g.failure), console.warn("TweenTimeline: entry failed:", g.failure.error);
      }
    const m = await T(this, X, ns).call(this, l, Lt.AFTER_STEP, i);
    if (m) {
      if (p(this, _e) === Ae.ABORT) return m;
      n.errors.push(m);
    }
    if (n.signal.aborted) return T(this, X, ht).call(this, n.signal.reason);
    r += f;
  }
  return null;
}, "#executeSegments"), Oh = /* @__PURE__ */ c(async function(e, n, i = 0) {
  const { branches: r, join: o, overflow: s } = e, a = r.length, l = o === "all" ? a : o === "any" ? 1 : o, u = r.map(() => {
    const g = new AbortController();
    return n.signal.aborted ? g.abort(n.signal.reason ?? "parent-aborted") : n.signal.addEventListener("abort", () => {
      g.signal.aborted || g.abort(n.signal.reason ?? "parent-aborted");
    }, { once: !0 }), g;
  });
  let d = 0, f = 0;
  const h = new Array(a).fill(null);
  let m;
  return new Promise((g) => {
    let y = !1;
    const v = /* @__PURE__ */ c(() => {
      if (y) return;
      if (d >= l) {
        y = !0, b(), g(null);
        return;
      }
      const w = a - d - f;
      if (d + w < l) {
        y = !0, b();
        const E = h.filter((O) => O && O.status === kn.FAILED).map((O) => O), C = T(this, X, Yt).call(this, new Error(`parallel: join target ${l} impossible (${d} completed, ${f} failed)`), Lt.PARALLEL);
        p(this, _e) === Ae.ABORT ? g(C) : (n.errors.push(C), n.errors.push(...E), g(null));
      }
    }, "checkJoin"), b = /* @__PURE__ */ c(() => {
      if (s === "cancel")
        for (let w = 0; w < a; w++)
          !h[w] && !u[w].signal.aborted && u[w].abort("overflow-cancel");
      for (let w = 0; w < a; w++)
        h[w] || n.detachedPromises.push(m[w]);
    }, "applyOverflow");
    if (m = r.map((w, E) => {
      const C = {
        signal: u[E].signal,
        commit: n.commit,
        startEpochMS: n.startEpochMS + i,
        eventBus: n.eventBus,
        // shared
        errors: n.errors,
        // shared
        detachedPromises: n.detachedPromises
        // shared
      };
      return T(this, X, pc).call(this, w, C).then((O) => {
        if (O)
          if (O.status === kn.CANCELLED) {
            if (u[E].signal.aborted) {
              h[E] = O;
              return;
            }
            h[E] = O, f++;
          } else
            h[E] = O, f++;
        else
          h[E] = { status: kn.COMPLETED }, d++;
        v();
      });
    }), n.signal.aborted) {
      y = !0, g(T(this, X, ht).call(this, n.signal.reason));
      return;
    }
    n.signal.addEventListener("abort", () => {
      y || (y = !0, g(T(this, X, ht).call(this, n.signal.reason)));
    }, { once: !0 });
  });
}, "#executeParallel"), /**
 * @param {Array<Promise<{ok: boolean, failure?: object}>>} stepPromises
 * @param {AbortSignal} signal
 * @returns {Promise<Array<{ok: boolean, failure?: object}>|null>}
 */
kh = /* @__PURE__ */ c(function(e, n) {
  return e.length === 0 ? Promise.resolve([]) : n.aborted ? Promise.resolve(null) : new Promise((i, r) => {
    const o = /* @__PURE__ */ c(() => i(null), "onAbort");
    n.addEventListener("abort", o, { once: !0 }), Promise.all(e).then((s) => {
      n.removeEventListener("abort", o), i(s);
    }).catch((s) => {
      n.removeEventListener("abort", o), r(s);
    });
  });
}, "#waitForStep"), ns = /* @__PURE__ */ c(async function(e, n, i) {
  if (!e) return null;
  try {
    return await e(), null;
  } catch (r) {
    const o = T(this, X, Yt).call(this, r, n, i ?? void 0);
    return p(this, _e) === Ae.CONTINUE && console.warn(`TweenTimeline: hook failure in ${n}:`, r), o;
  }
}, "#runHook"), /** @param {unknown} reason */
ht = /* @__PURE__ */ c(function(e) {
  let n;
  return typeof e == "string" ? n = e : e instanceof Error && (n = e.message), {
    status: kn.CANCELLED,
    ...n ? { reason: n } : {}
  };
}, "#cancelledOutcome"), /**
 * @param {unknown} err
 * @param {string} phase
 * @param {number} [stepIndex]
 * @param {string} [entryType]
 */
Yt = /* @__PURE__ */ c(function(e, n, i, r) {
  const o = e instanceof Error ? e : new Error(String(e));
  return {
    status: kn.FAILED,
    error: o,
    phase: n,
    ...typeof i == "number" ? { stepIndex: i } : {},
    ...r ? { entryType: r } : {}
  };
}, "#failedOutcome"), A(mn, ii), c(mn, "TweenTimeline");
let Is = mn;
function ou(t) {
  if (!t || typeof t != "object")
    throw new Error("Sequence JSON: data must be an object.");
  if (!Array.isArray(t.timeline))
    throw new Error("Sequence JSON: 'timeline' must be an array.");
  if (t.name != null && typeof t.name != "string")
    throw new Error("Sequence JSON: 'name' must be a string.");
  if (t.errorPolicy != null && t.errorPolicy !== Ae.ABORT && t.errorPolicy !== Ae.CONTINUE)
    throw new Error(`Sequence JSON: 'errorPolicy' must be "abort" or "continue".`);
  Ah(t.timeline, "timeline", 0);
}
c(ou, "validateSequenceJSON");
function Ah(t, e, n = 0) {
  for (let i = 0; i < t.length; i++) {
    const r = t[i], o = `${e}[${i}]`;
    if (Array.isArray(r)) {
      if (r.length === 0)
        throw new Error(`Sequence JSON: ${o} is an empty step.`);
      for (let s = 0; s < r.length; s++) {
        const a = r[s];
        if (!a || typeof a != "object")
          throw new Error(`Sequence JSON: ${o}[${s}] must be an object.`);
        if (typeof a.type != "string" || !a.type)
          throw new Error(`Sequence JSON: ${o}[${s}].type must be a non-empty string.`);
        if (a.params != null && typeof a.params != "object")
          throw new Error(`Sequence JSON: ${o}[${s}].params must be an object.`);
        if (a.opts != null && typeof a.opts != "object")
          throw new Error(`Sequence JSON: ${o}[${s}].opts must be an object.`);
        if (a.detach != null && typeof a.detach != "boolean")
          throw new Error(`Sequence JSON: ${o}[${s}].detach must be a boolean.`);
      }
      continue;
    }
    if (typeof r != "object")
      throw new Error(`Sequence JSON: ${o} must be a step array or an object.`);
    if (r.delay !== void 0) {
      if (typeof r.delay != "number" || r.delay < 0)
        throw new Error(`Sequence JSON: ${o}.delay must be a non-negative number.`);
      continue;
    }
    if (r.await !== void 0) {
      const s = r.await;
      if (!s || typeof s != "object")
        throw new Error(`Sequence JSON: ${o}.await must be an object.`);
      if (typeof s.event != "string" || !s.event)
        throw new Error(`Sequence JSON: ${o}.await.event must be a non-empty string.`);
      if (s.event === "signal" && (typeof s.name != "string" || !s.name))
        throw new Error(`Sequence JSON: ${o}.await signal requires a non-empty "name".`);
      if (s.event === "keypress" && s.key != null && typeof s.key != "string")
        throw new Error(`Sequence JSON: ${o}.await keypress "key" must be a string.`);
      if (s.timeout != null && (typeof s.timeout != "number" || s.timeout <= 0))
        throw new Error(`Sequence JSON: ${o}.await.timeout must be a positive number.`);
      continue;
    }
    if (r.emit !== void 0) {
      if (typeof r.emit != "string" || !r.emit)
        throw new Error(`Sequence JSON: ${o}.emit must be a non-empty string.`);
      continue;
    }
    if (r.parallel !== void 0) {
      if (n >= 8)
        throw new Error(`Sequence JSON: ${o} exceeds maximum parallel nesting depth of 8.`);
      const s = r.parallel;
      if (!s || typeof s != "object")
        throw new Error(`Sequence JSON: ${o}.parallel must be an object.`);
      if (!Array.isArray(s.branches) || s.branches.length === 0)
        throw new Error(`Sequence JSON: ${o}.parallel.branches must be a non-empty array.`);
      const a = s.join ?? "all";
      if (a !== "all" && a !== "any" && (typeof a != "number" || !Number.isInteger(a) || a < 1 || a > s.branches.length))
        throw new Error(`Sequence JSON: ${o}.parallel.join must be "all", "any", or 1..${s.branches.length}.`);
      const l = s.overflow ?? "detach";
      if (l !== "detach" && l !== "cancel")
        throw new Error(`Sequence JSON: ${o}.parallel.overflow must be "detach" or "cancel".`);
      for (let u = 0; u < s.branches.length; u++) {
        const d = s.branches[u];
        if (!Array.isArray(d))
          throw new Error(`Sequence JSON: ${o}.parallel.branches[${u}] must be an array.`);
        Ah(d, `${o}.parallel.branches[${u}]`, n + 1);
      }
      continue;
    }
    throw new Error(`Sequence JSON: ${o} is not a recognized segment (step array, delay, await, emit, or parallel).`);
  }
}
c(Ah, "validateSegmentsJSON");
function Mh(t) {
  ou(t), xh(t.timeline, "timeline");
}
c(Mh, "validateSequenceSemantics");
function xh(t, e) {
  for (let n = 0; n < t.length; n++) {
    const i = t[n], r = `${e}[${n}]`;
    if (Array.isArray(i))
      for (let o = 0; o < i.length; o++) {
        const s = i[o];
        try {
          fb(s.type, s.params ?? {});
        } catch (a) {
          throw new Error(`Sequence JSON: ${r}[${o}] failed semantic validation: ${a.message}`);
        }
      }
    else if (i.parallel)
      for (let o = 0; o < i.parallel.branches.length; o++)
        xh(i.parallel.branches[o], `${r}.parallel.branches[${o}]`);
  }
}
c(xh, "validateSegmentsSemantics");
function su(t, e = {}) {
  ou(t), e.validateSemantics && Mh(t);
  const n = new Is();
  return t.name && n.name(t.name), t.errorPolicy && n.errorPolicy(t.errorPolicy), _h(t.timeline, n), n;
}
c(su, "compileSequence");
function _h(t, e) {
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
      const i = n.parallel, r = i.branches.map((o) => (s) => _h(o, s));
      e.parallel(r, {
        join: i.join ?? "all",
        overflow: i.overflow ?? "detach"
      });
    }
  }
}
c(_h, "compileSegments");
function Ab(t) {
  ou(t), Mh(t);
}
c(Ab, "validate$3");
async function Mb(t, e = {}) {
  return su(t, { validateSemantics: !0 }).run({
    broadcast: !1,
    commit: e.commit,
    startEpochMS: e.startEpochMS,
    signal: e.signal
  }).finished;
}
c(Mb, "execute$3");
function xb() {
  Gt({ type: "sequence", execute: Mb, validate: Ab });
}
c(xb, "registerSequenceTween");
function _b(t) {
  if (t.x == null && t.y == null && t.scale == null)
    throw new Error("camera-pan tween: at least one of 'x', 'y', or 'scale' is required.");
  if (t.x != null && typeof t.x != "number")
    throw new Error("camera-pan tween: 'x' must be a number.");
  if (t.y != null && typeof t.y != "number")
    throw new Error("camera-pan tween: 'y' must be a number.");
  if (t.scale != null && (typeof t.scale != "number" || t.scale <= 0))
    throw new Error("camera-pan tween: 'scale' must be a positive number.");
}
c(_b, "validate$2");
async function Nb(t, e = {}) {
  const {
    durationMS: n = 2e3,
    startEpochMS: i = null,
    signal: r = null
  } = e;
  if (r != null && r.aborted) return !1;
  const o = typeof i == "number" ? Math.max(0, Math.min(n, Date.now() - i)) : 0, s = Math.max(0, n - o), a = { duration: s };
  if (t.x != null && (a.x = t.x), t.y != null && (a.y = t.y), t.scale != null && (a.scale = t.scale), s <= 0)
    return await canvas.animatePan({ ...a, duration: 0 }), !0;
  const l = canvas.animatePan(a);
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
c(Nb, "execute$2");
function $b() {
  Gt({ type: "camera-pan", execute: Nb, validate: _b });
}
c($b, "registerCameraPanTween");
function Fb(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((i) => !i || typeof i != "string"))
    throw new Error("tile-tint tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (t.toColor == null || typeof t.toColor != "string")
    throw new Error("tile-tint tween: 'toColor' (CSS color string) is required.");
  if (!foundry.utils.Color.fromString(t.toColor).valid)
    throw new Error(`tile-tint tween: invalid target color "${t.toColor}".`);
  if (t.mode && !dr().includes(t.mode))
    throw new Error(
      `tile-tint tween: unknown mode "${t.mode}". Available: ${dr().join(", ")}`
    );
}
c(Fb, "validate$1");
async function Db(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { Color: i } = foundry.utils, { uuid: r, toColor: o, mode: s = "oklch" } = t, a = Array.isArray(r) ? r : [r];
  if (a.length === 0)
    return console.warn("tile-tint tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: l = 2e3,
    easing: u = "easeInOutCosine",
    commit: d = !0,
    startEpochMS: f = null,
    signal: h = null
  } = e, m = at(u), g = ru(s), y = i.fromString(o);
  if (!y.valid) throw new Error(`tile-tint tween: invalid target color "${o}".`);
  async function v(w) {
    var R, B;
    if (h != null && h.aborted) return !1;
    const E = await fromUuid(w);
    if (!E) return !1;
    const C = E.object;
    if (!C) return !1;
    const O = ((B = (R = E._source) == null ? void 0 : R.texture) == null ? void 0 : B.tint) ?? "#ffffff", k = i.fromString(O);
    k.valid || console.warn(`tile-tint tween: source tint invalid on ${w}, using white.`);
    const x = k.valid ? k : i.fromString("#ffffff"), $ = { t: 0 }, D = `tile-tint-tween:${w}`;
    n.terminateAnimation(D), h && h.addEventListener("abort", () => {
      n.terminateAnimation(D);
    }, { once: !0 });
    const N = typeof f == "number" ? Math.max(0, Math.min(l, Date.now() - f)) : 0, F = /* @__PURE__ */ c((j) => {
      const H = g(x, y, j);
      E.updateSource({ texture: { tint: H } }), C.refresh();
    }, "applyFrame");
    N > 0 && ($.t = N / l, F($.t));
    const M = await n.animate(
      [{ parent: $, attribute: "t", to: 1 }],
      {
        name: D,
        duration: l,
        easing: m,
        time: N,
        ontick: /* @__PURE__ */ c(() => F($.t), "ontick")
      }
    );
    if (M !== !1) {
      if (h != null && h.aborted) return !1;
      E.updateSource({ texture: { tint: y.toHTML() } }), C.refresh();
    }
    if (d && M !== !1 && E.canUserModify(game.user, "update")) {
      if (h != null && h.aborted) return !1;
      E.updateSource({ texture: { tint: x.toHTML() } }), await E.update({ "texture.tint": y.toHTML() });
    }
    return M !== !1;
  }
  return c(v, "animateOne"), (await Promise.all(a.map(v))).every(Boolean);
}
c(Db, "execute$1");
function Pb() {
  Gt({ type: "tile-tint", execute: Db, validate: Fb });
}
c(Pb, "registerTileTintTween");
function Rb(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("tile-scale tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (typeof t.toScale != "number" || t.toScale <= 0)
    throw new Error("tile-scale tween: 'toScale' must be a positive number.");
  for (const n of ["baseWidth", "baseHeight", "centerX", "centerY"])
    if (typeof t[n] != "number")
      throw new Error(`tile-scale tween: '${n}' (number) is required.`);
}
c(Rb, "validate");
async function Hb(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, toScale: r, baseWidth: o, baseHeight: s, centerX: a, centerY: l } = t, u = Array.isArray(i) ? i : [i];
  if (u.length === 0) return !0;
  const {
    durationMS: d = 2e3,
    easing: f = "easeInOutCosine",
    commit: h = !0,
    startEpochMS: m = null,
    signal: g = null
  } = e, y = at(f), v = o * r, b = s * r, w = a - v / 2, E = l - b / 2;
  async function C(k) {
    if (g != null && g.aborted) return !1;
    const x = await fromUuid(k);
    if (!x) return !1;
    const $ = x.object;
    if (!$) return !1;
    const D = x._source.width, N = x._source.height, F = x._source.x, M = x._source.y, R = `tile-scale-tween:${k}`;
    n.terminateAnimation(R), g && g.addEventListener("abort", () => {
      n.terminateAnimation(R);
    }, { once: !0 });
    const B = typeof m == "number" ? Math.max(0, Math.min(d, Date.now() - m)) : 0, j = /* @__PURE__ */ c((Y) => {
      const oe = D + (v - D) * Y, J = N + (b - N) * Y, te = F + (w - F) * Y, an = M + (E - M) * Y;
      x.updateSource({ width: oe, height: J, x: te, y: an }), $.refresh();
    }, "applyFrame"), H = { t: 0 };
    B > 0 && (H.t = B / d, j(H.t));
    const V = await n.animate(
      [{ parent: H, attribute: "t", to: 1 }],
      {
        name: R,
        duration: d,
        easing: y,
        time: B,
        ontick: /* @__PURE__ */ c(() => j(H.t), "ontick")
      }
    );
    if (V !== !1) {
      if (g != null && g.aborted) return !1;
      x.updateSource({ width: v, height: b, x: w, y: E }), $.refresh();
    }
    if (h && V !== !1 && x.canUserModify(game.user, "update")) {
      if (g != null && g.aborted) return !1;
      x.updateSource({ width: D, height: N, x: F, y: M }), await x.update({ width: v, height: b, x: w, y: E });
    }
    return V !== !1;
  }
  return c(C, "animateOne"), (await Promise.all(u.map(C))).every(Boolean);
}
c(Hb, "execute");
function qb() {
  Gt({ type: "tile-scale", execute: Hb, validate: Rb });
}
c(qb, "registerTileScaleTween");
async function Bb(t, e, n = {}) {
  if (!game.user.isGM)
    return ui.notifications.warn("Only the GM can dispatch tweens."), !1;
  const i = vr(t);
  if (!i)
    throw new Error(`Unknown tween type: "${t}". Registered types: ${lc().join(", ")}`);
  i.validate(e);
  const { durationMS: r = 2e3, easing: o = "easeInOutCosine", commit: s = !0 } = n, a = Date.now();
  return ts(Eh, {
    type: t,
    params: e,
    durationMS: r,
    easing: o,
    startEpochMS: a,
    commit: !1
  }), i.execute(e, { durationMS: r, easing: o, commit: s, startEpochMS: a });
}
c(Bb, "dispatchTween");
function jb(t) {
  const { type: e, params: n, durationMS: i, easing: r, startEpochMS: o, commit: s } = t ?? {}, a = vr(e);
  if (!a) {
    console.warn(`[${L}] Received unknown tween type over socket: "${e}"`);
    return;
  }
  a.execute(n, {
    durationMS: i,
    easing: r,
    commit: s ?? !1,
    startEpochMS: o
  });
}
c(jb, "handleTweenSocketMessage");
vb();
Sb();
Cb();
Ib();
xb();
$b();
Pb();
qb();
Gt({ type: "token-prop", execute: Ma, validate: Aa });
Gt({ type: "drawing-prop", execute: Ma, validate: Aa });
Gt({ type: "sound-prop", execute: Ma, validate: Aa });
nu(Eh, jb);
nu(Sh, Ub);
nu(ac, Vb);
function Ub(t) {
  const { data: e, startEpochMS: n } = t ?? {};
  if (!e) {
    console.warn(`[${L}] Received empty tween-sequence socket message.`);
    return;
  }
  try {
    su(e, { validateSemantics: !0 }).run({ commit: !1, startEpochMS: n, broadcast: !1 });
  } catch (i) {
    console.error(`[${L}] Failed to run received tween sequence:`, i);
  }
}
c(Ub, "handleSequenceSocketMessage");
function Vb(t) {
  const { name: e } = t ?? {};
  e && Lh(e);
}
c(Vb, "handleSequenceCancelMessage");
function Gb() {
  Hooks.once("ready", () => {
    db();
    const t = game.modules.get(L);
    t.api || (t.api = {}), t.api.tween = {
      dispatch: Bb,
      types: lc,
      Timeline: Is,
      ErrorPolicy: Ae,
      compileSequence: su,
      cancelTimeline: Lh,
      getTimeline: kb
    }, console.log(`[${L}] Tween API registered. Types: ${lc().join(", ")}`);
  });
}
c(Gb, "registerTweenHooks");
Gb();
const Wb = ["tag", "tag-all", "id", "tags-any", "tags-all"], zb = /* @__PURE__ */ new Set(["tags-any", "tags-all"]);
function au(t) {
  if (!t || typeof t != "string")
    return { type: "unknown", value: t ?? "" };
  if (t.startsWith("$"))
    return { type: "special", value: t };
  for (const e of Wb)
    if (t.startsWith(`${e}:`)) {
      const n = t.slice(e.length + 1), i = zb.has(e) ? n.split(",").map((r) => r.trim()) : n;
      return { type: e, value: i };
    }
  return t.includes(".") ? { type: "uuid", value: t } : { type: "unknown", value: t };
}
c(au, "parseSelector");
function Yb(t) {
  if (!t) return "";
  const { type: e, value: n } = t;
  if (e === "special" || e === "uuid" || e === "unknown")
    return Array.isArray(n) ? n.join(",") : n ?? "";
  const i = Array.isArray(n) ? n.join(",") : n ?? "";
  return `${e}:${i}`;
}
c(Yb, "buildSelector");
function Nh(t, e = "first") {
  return t != null && t.length ? t.length === 1 ? e === "first-all" || e === "all" ? `tag-all:${t[0]}` : `tag:${t[0]}` : e === "any" ? `tags-any:${t.join(",")}` : e === "all" ? `tags-all:${t.join(",")}` : e === "first-all" ? `tags-all:${t.join(",")}` : `tags-any:${t.join(",")}` : "";
}
c(Nh, "buildTagSelector");
function _a(t) {
  if (!t) return null;
  if (t.documentName || t._source !== void 0) {
    const e = t.object;
    return e ? { placeable: e, doc: t } : null;
  }
  return t.document ? { placeable: t, doc: t.document } : null;
}
c(_a, "normalizePlaceable");
function $h() {
  var t;
  return window.Tagger ?? ((t = game.modules.get("tagger")) == null ? void 0 : t.api) ?? null;
}
c($h, "getTaggerAPI");
function Na(t, e) {
  if (!t) return null;
  const n = e ?? canvas.scene;
  if (!n) return null;
  const i = au(t);
  switch (i.type) {
    case "special":
      return Kb(i.value);
    case "tag":
      return sd(i.value, n);
    case "tag-all":
      return sd(i.value, n);
    case "id":
      return Xb(i.value, n);
    case "tags-any":
      return ad(i.value, n, !0);
    case "tags-all":
      return ad(i.value, n, !1);
    case "uuid":
      return Jb(i.value);
    default:
      return null;
  }
}
c(Na, "resolveSelector");
function Kb(t) {
  var e;
  if (t === "$particles") {
    if (!((e = game.modules.get("fxmaster")) != null && e.active))
      return console.warn(`[${L}] Picker: FXMaster not active, cannot resolve "$particles".`), null;
    const n = canvas.particleeffects;
    return n ? { kind: "particles", documents: [], placeables: [], target: n } : null;
  }
  return null;
}
c(Kb, "resolveSpecial");
function sd(t, e, n) {
  const i = $h();
  if (!i)
    return console.warn(`[${L}] Picker: Tagger not available, cannot resolve tag "${t}".`), null;
  const r = i.getByTag(t, { sceneId: e.id });
  if (!(r != null && r.length)) return null;
  const o = [];
  for (const s of r) {
    const a = _a(s);
    a && o.push(a);
  }
  return o.length === 0 ? null : {
    kind: o.length === 1 ? "placeable" : "multi-placeable",
    documents: o.map((s) => s.doc),
    placeables: o
  };
}
c(sd, "resolveTag");
function Xb(t, e) {
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
      const o = _a(r);
      if (o)
        return {
          kind: "placeable",
          documents: [o.doc],
          placeables: [o]
        };
    }
  }
  return null;
}
c(Xb, "resolveById");
function ad(t, e, n) {
  const i = $h();
  if (!i)
    return console.warn(`[${L}] Picker: Tagger not available, cannot resolve multi-tag.`), null;
  const r = i.getByTag(t, {
    sceneId: e.id,
    matchAny: n
  });
  if (!(r != null && r.length)) return null;
  const o = [];
  for (const s of r) {
    const a = _a(s);
    a && o.push(a);
  }
  return o.length === 0 ? null : {
    kind: o.length === 1 ? "placeable" : "multi-placeable",
    documents: o.map((s) => s.doc),
    placeables: o
  };
}
c(ad, "resolveMultiTag");
function Jb(t) {
  const e = fromUuidSync(t);
  if (!e) return null;
  const n = _a(e);
  return n ? {
    kind: "placeable",
    documents: [n.doc],
    placeables: [n]
  } : null;
}
c(Jb, "resolveUUID");
function Qb(t) {
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
c(Qb, "adaptResolved");
function Os(t) {
  var r;
  const e = /* @__PURE__ */ new Set();
  if (t.segments) {
    if (t.setup) for (const o of Object.keys(t.setup)) e.add(o);
    if (t.landing) for (const o of Object.keys(t.landing)) e.add(o);
    for (const o of Object.values(t.segments)) {
      if (o.setup) for (const s of Object.keys(o.setup)) e.add(s);
      if (o.landing) for (const s of Object.keys(o.landing)) e.add(s);
      o.timeline && bc(o.timeline, e), (r = o.gate) != null && r.target && e.add(o.gate.target);
    }
  } else {
    if (t.setup) for (const o of Object.keys(t.setup)) e.add(o);
    if (t.landing) for (const o of Object.keys(t.landing)) e.add(o);
    t.timeline && bc(t.timeline, e);
  }
  const n = /* @__PURE__ */ new Map(), i = [];
  for (const o of e) {
    const s = Na(o), a = Qb(s);
    a ? n.set(o, a) : i.push(o);
  }
  return i.length && console.warn(`[${L}] Cinematic: ${i.length} unresolved target(s): ${i.join(", ")}`), { targets: n, unresolved: i };
}
c(Os, "resolveAllTargets");
function Zb(t, e) {
  if (!t) return {};
  const n = {};
  for (const [i, r] of Object.entries(t)) {
    const o = e.get(i);
    if (o)
      if (o.kind === "particles") {
        if (o.target.destroyed) continue;
        const s = {};
        for (const a of Object.keys(r))
          s[a] = o.target[a];
        n[i] = s;
      } else if (o.kind === "multi-placeable") {
        const s = o.placeables[0];
        if (!(s != null && s.doc)) continue;
        const a = {};
        for (const l of Object.keys(r))
          a[l] = foundry.utils.getProperty(s.doc._source, l);
        n[i] = a;
      } else {
        if (!o.doc) continue;
        const s = {};
        for (const a of Object.keys(r))
          s[a] = foundry.utils.getProperty(o.doc._source, a);
        n[i] = s;
      }
  }
  return n;
}
c(Zb, "captureSnapshot");
function ev(t) {
  const e = {};
  function n(i) {
    if (i)
      for (const [r, o] of Object.entries(i))
        e[r] || (e[r] = {}), Object.assign(e[r], o);
  }
  if (c(n, "mergeMap"), t.segments) {
    n(t.setup), n(t.landing);
    for (const i of Object.values(t.segments))
      n(i.setup), n(i.landing), i.timeline && yc(i.timeline, e, n);
  } else
    n(t.setup), n(t.landing), t.timeline && yc(t.timeline, e, n);
  return e;
}
c(ev, "gatherAllStateMaps");
function yc(t, e, n) {
  var i;
  for (const r of t)
    if (!(r.delay != null || r.await != null || r.emit != null) && !(r.transitionTo != null || r.sound != null || r.stopSound != null)) {
      if ((i = r.parallel) != null && i.branches) {
        for (const o of r.parallel.branches)
          yc(o, e, n);
        continue;
      }
      if (n(r.before), n(r.after), r.tweens)
        for (const o of r.tweens)
          o.target && o.attribute && (e[o.target] || (e[o.target] = {}), e[o.target][o.attribute] = "__snapshot__");
    }
}
c(yc, "gatherFromEntries");
function bc(t, e) {
  for (const n of t)
    if (n.delay == null && n.await == null && n.emit == null && n.transitionTo == null && n.sound == null && n.stopSound == null) {
      if (n.parallel) {
        const i = n.parallel;
        if (i.branches)
          for (const r of i.branches)
            bc(r, e);
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
c(bc, "collectSelectorsFromEntries");
const ld = {
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
}, tv = /* @__PURE__ */ new Set([
  "alpha",
  "visible",
  "x",
  "y",
  "scale",
  "rotation"
]);
function Za(t, e, n) {
  const i = {};
  for (const [r, o] of Object.entries(t))
    e.has(r) ? i[r] = o : console.warn(`[${L}] Cinematic: blocked property "${r}" on ${n}.`);
  return i;
}
c(Za, "filterOverrides");
function Me(t, e) {
  var i, r;
  if (!t) return;
  const n = [];
  for (const [o, s] of Object.entries(t)) {
    const a = e.get(o);
    if (a)
      if (a.kind === "particles") {
        if (a.target.destroyed) continue;
        const l = Za(s, tv, "$particles");
        for (const [u, d] of Object.entries(l))
          a.target[u] = d;
      } else if (a.kind === "multi-placeable")
        for (const { placeable: l, doc: u } of a.placeables) {
          if (!(u != null && u.parent) || !(l != null && l.scene)) continue;
          const d = u.documentName, f = ld[d];
          if (!f) {
            console.warn(`[${L}] Cinematic: no allowlist for document type "${d}" on "${o}", skipping.`);
            continue;
          }
          const h = Za(s, f, `${d} "${o}"`);
          u.updateSource(h), n.push(l);
        }
      else {
        if (!((i = a.doc) != null && i.parent) || !((r = a.placeable) != null && r.scene)) continue;
        const l = a.doc.documentName, u = ld[l];
        if (!u) {
          console.warn(`[${L}] Cinematic: no allowlist for document type "${l}" on "${o}", skipping.`);
          continue;
        }
        const d = Za(s, u, `${l} "${o}"`);
        a.doc.updateSource(d), n.push(a.placeable);
      }
  }
  for (const o of n)
    o.refresh();
}
c(Me, "applyState");
function Ji(t, e) {
  var n;
  if (t)
    for (const i of Object.keys(t)) {
      const r = e.get(i);
      if ((r == null ? void 0 : r.kind) === "placeable" && ((n = r.doc) == null ? void 0 : n.documentName) === "AmbientLight") {
        canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
        return;
      }
      if ((r == null ? void 0 : r.kind) === "multi-placeable") {
        for (const { doc: o } of r.placeables)
          if ((o == null ? void 0 : o.documentName) === "AmbientLight") {
            canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
            return;
          }
      }
    }
}
c(Ji, "refreshPerceptionIfNeeded");
const nv = {
  "tile-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "light-color": /* @__PURE__ */ new Set(["uuid", "toColor", "toAlpha", "mode"]),
  "light-state": /* @__PURE__ */ new Set(["uuid", "enabled"]),
  "particles-prop": /* @__PURE__ */ new Set(["attribute", "value"]),
  "camera-pan": /* @__PURE__ */ new Set(["x", "y", "scale"]),
  "token-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "drawing-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "sound-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"])
}, iv = /* @__PURE__ */ new Set(["easing"]), rv = /* @__PURE__ */ new Set(["type", "target"]);
function Fh(t, e) {
  const { type: n, target: i, ...r } = t;
  if (!n)
    return console.warn(`[${L}] Cinematic: tween entry missing 'type', skipping.`), null;
  const o = {}, s = {}, a = nv[n];
  if (i === "$particles")
    o.target = "$particles";
  else if (i) {
    const l = e.get(i);
    if (!l) return null;
    l.kind === "multi-placeable" ? o.uuid = l.placeables.map((u) => u.doc.uuid) : o.uuid = l.doc.uuid;
  }
  for (const [l, u] of Object.entries(r))
    rv.has(l) || (iv.has(l) ? s[l] = u : (a != null && a.has(l), o[l] = u));
  return { type: n, params: o, opts: s };
}
c(Fh, "compileTween");
const eo = /* @__PURE__ */ new Map();
let ov = 0;
async function sv(t) {
  var u, d, f, h, m;
  const { id: e, src: n, volume: i = 0.8, loop: r = !1, fadeIn: o } = t;
  if (!n) {
    console.warn(`[${L}] Cinematic sound: missing 'src', skipping.`);
    return;
  }
  const s = e || `__auto_${++ov}`, a = {
    src: n,
    autoplay: !0,
    loop: r,
    volume: i
  };
  let l = null;
  try {
    typeof ((d = (u = foundry == null ? void 0 : foundry.audio) == null ? void 0 : u.AudioHelper) == null ? void 0 : d.play) == "function" ? l = await foundry.audio.AudioHelper.play(a, !1) : typeof ((h = (f = game == null ? void 0 : game.audio) == null ? void 0 : f.constructor) == null ? void 0 : h.play) == "function" ? l = await game.audio.constructor.play(a, !1) : typeof ((m = game == null ? void 0 : game.audio) == null ? void 0 : m.play) == "function" && (l = await game.audio.play(a, !1));
  } catch (g) {
    console.error(`[${L}] Cinematic sound: failed to play "${n}":`, g);
    return;
  }
  if (!l) {
    console.warn(`[${L}] Cinematic sound: audio helper unavailable for "${n}".`);
    return;
  }
  o && o > 0 && l.fade && l.fade(i, { duration: o, from: 0 }), eo.set(s, { sound: l, config: t }), console.log(`[${L}] Cinematic sound: playing "${n}" as "${s}" (loop=${r}, vol=${i})`);
}
c(sv, "playLocalSound");
function el(t) {
  var i, r;
  const e = eo.get(t);
  if (!e) {
    console.warn(`[${L}] Cinematic sound: no active sound with id "${t}".`);
    return;
  }
  const n = e.config.fadeOut;
  try {
    n && n > 0 && e.sound.fade ? e.sound.fade(0, { duration: n }).then(() => {
      var o, s;
      return (s = (o = e.sound).stop) == null ? void 0 : s.call(o);
    }) : (r = (i = e.sound).stop) == null || r.call(i);
  } catch (o) {
    console.warn(`[${L}] Cinematic sound: error stopping "${t}":`, o);
  }
  eo.delete(t);
}
c(el, "stopCinematicSound");
function cd() {
  var t, e;
  for (const [n, i] of eo)
    try {
      (e = (t = i.sound).stop) == null || e.call(t);
    } catch (r) {
      console.warn(`[${L}] Cinematic sound: error stopping "${n}" during cleanup:`, r);
    }
  eo.clear();
}
c(cd, "stopAllCinematicSounds");
function av(t, e, n, i = {}) {
  const { skipToStep: r, onStepComplete: o, timelineName: s } = i, a = new n().name(s ?? `cinematic-${canvas.scene.id}`);
  return a.beforeAll(() => {
    var l;
    try {
      Me(t.setup, e), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    } catch (u) {
      throw console.error(`[${L}] Cinematic: error in beforeAll (setup state) on scene ${(l = canvas.scene) == null ? void 0 : l.id}:`, u), u;
    }
  }), Ph(t.timeline, a, e, { skipToStep: r, onStepComplete: o }), { tl: a };
}
c(av, "buildTimeline");
function Dh(t, e) {
  var n;
  if (t)
    for (const i of t)
      for (const r of i) {
        if (r.before)
          try {
            Me(r.before, e), Ji(r.before, e);
          } catch (o) {
            console.warn(`[${L}] Cinematic: error in skipped parallel before:`, o);
          }
        if (r.after)
          try {
            Me(r.after, e), Ji(r.after, e);
          } catch (o) {
            console.warn(`[${L}] Cinematic: error in skipped parallel after:`, o);
          }
        (n = r.parallel) != null && n.branches && Dh(r.parallel.branches, e);
      }
}
c(Dh, "applyParallelStatesForSkip");
function Ph(t, e, n, i = {}) {
  const { skipToStep: r, onStepComplete: o } = i;
  let s = -1;
  for (const a of t) {
    if (a.sound != null) {
      if (r != null && s < r) continue;
      const f = a.sound, { duration: h, loop: m, fireAndForget: g } = f, y = e.step();
      if (y.before(() => {
        sv(f);
      }), h && h > 0)
        if (g) {
          if (m && f.id) {
            const v = f.id, b = h;
            y.before(() => {
              setTimeout(() => el(v), b);
            });
          }
        } else
          e.delay(h), m && e.step().before(() => {
            el(f.id);
          });
      continue;
    }
    if (a.stopSound != null) {
      if (r != null && s < r) continue;
      const f = a.stopSound;
      e.step().before(() => {
        el(f);
      });
      continue;
    }
    if (a.delay != null) {
      if (r != null && s < r) continue;
      e.delay(a.delay);
      continue;
    }
    if (a.await != null) {
      if (r != null && s < r) continue;
      e.await(a.await);
      continue;
    }
    if (a.emit != null) {
      if (r != null && s < r) continue;
      e.emit(a.emit);
      continue;
    }
    if (a.parallel) {
      if (r != null && s < r) {
        Dh(a.parallel.branches, n);
        continue;
      }
      const f = a.parallel, h = f.branches.map((m) => (g) => Ph(m, g, n));
      e.parallel(h, {
        join: f.join ?? "all",
        overflow: f.overflow ?? "detach"
      });
      continue;
    }
    if (!a.tweens || !Array.isArray(a.tweens)) {
      console.warn(`[${L}] Cinematic: timeline entry has no tweens array, skipping.`);
      continue;
    }
    if (s++, r != null && s < r) {
      if (a.before)
        try {
          Me(a.before, n), Ji(a.before, n);
        } catch (f) {
          console.warn(`[${L}] Cinematic: error applying skipped step.before:`, f);
        }
      if (a.after)
        try {
          Me(a.after, n), Ji(a.after, n);
        } catch (f) {
          console.warn(`[${L}] Cinematic: error applying skipped step.after:`, f);
        }
      continue;
    }
    const l = s, u = e.step();
    a.before && u.before(() => {
      var f;
      try {
        Me(a.before, n), Ji(a.before, n);
      } catch (h) {
        throw console.error(`[${L}] Cinematic: error in step.before callback on scene ${(f = canvas.scene) == null ? void 0 : f.id}:`, h), h;
      }
    });
    const d = a.duration ?? 500;
    for (const f of a.tweens) {
      const h = Fh(f, n);
      h && u.add(h.type, h.params, { ...h.opts, durationMS: d });
    }
    u.after(() => {
      var f;
      try {
        a.after && (Me(a.after, n), Ji(a.after, n)), o == null || o(l);
      } catch (h) {
        throw console.error(`[${L}] Cinematic: error in step.after callback on scene ${(f = canvas.scene) == null ? void 0 : f.id}:`, h), h;
      }
    });
  }
}
c(Ph, "compileCinematicEntries");
function Qi(t, e, n) {
  if (t != null) {
    if (typeof t != "object" || Array.isArray(t)) {
      n.push({ path: e, level: "error", message: `Expected object, got ${Array.isArray(t) ? "array" : typeof t}` });
      return;
    }
    for (const [i, r] of Object.entries(t))
      (typeof r != "object" || r === null || Array.isArray(r)) && n.push({ path: `${e}["${i}"]`, level: "error", message: `Expected property overrides object, got ${Array.isArray(r) ? "array" : typeof r}` });
  }
}
c(Qi, "validateStateMap");
function vc(t, e, n, i) {
  var r;
  for (let o = 0; o < t.length; o++) {
    const s = t[o], a = `${e}[${o}]`;
    if (!(s.delay != null || s.await != null || s.emit != null) && !(s.transitionTo != null || s.sound != null || s.stopSound != null)) {
      if ((r = s.parallel) != null && r.branches) {
        for (let l = 0; l < s.parallel.branches.length; l++)
          vc(s.parallel.branches[l], `${a}.parallel.branches[${l}]`, n, i);
        continue;
      }
      if (Qi(s.before, `${a}.before`, i), Qi(s.after, `${a}.after`, i), s.tweens)
        for (let l = 0; l < s.tweens.length; l++) {
          const u = s.tweens[l], d = `${a}.tweens[${l}]`;
          if (!u.type) {
            i.push({ path: d, level: "error", message: "Missing 'type' field" });
            continue;
          }
          const f = vr(u.type);
          if (!f) {
            i.push({ path: d, level: "error", message: `Unknown tween type: "${u.type}"` });
            continue;
          }
          if (n)
            try {
              const h = Fh(u, n);
              h ? f.validate(h.params) : u.target && i.push({ path: d, level: "warn", message: `Target "${u.target}" could not be resolved for compilation` });
            } catch (h) {
              i.push({ path: d, level: "error", message: h.message });
            }
          n && u.target && !n.has(u.target) && i.push({ path: `${d}.target`, level: "warn", message: `Target "${u.target}" is not resolved` });
        }
    }
  }
}
c(vc, "validateEntries");
function lv(t, e = null) {
  var i;
  const n = [];
  if (!t || typeof t != "object")
    return n.push({ path: "", level: "error", message: "Cinematic data is not an object" }), n;
  if (t.segments) {
    t.entry ? t.segments[t.entry] || n.push({ path: "entry", level: "error", message: `Entry segment "${t.entry}" not found in segments` }) : n.push({ path: "entry", level: "error", message: "Missing 'entry' field" });
    const r = /* @__PURE__ */ new Set();
    let o = t.entry;
    for (; o && typeof o == "string"; ) {
      if (r.has(o)) {
        n.push({ path: `segments.${o}.next`, level: "error", message: `Cycle detected in segment graph at "${o}"` });
        break;
      }
      r.add(o), o = (i = t.segments[o]) == null ? void 0 : i.next;
    }
    for (const [s, a] of Object.entries(t.segments)) {
      const l = `segments.${s}`;
      Qi(a.setup, `${l}.setup`, n), Qi(a.landing, `${l}.landing`, n), a.timeline && Array.isArray(a.timeline) && vc(a.timeline, `${l}.timeline`, e, n), a.next && typeof a.next == "string" && !t.segments[a.next] && n.push({ path: `${l}.next`, level: "error", message: `Next segment "${a.next}" not found` });
    }
  } else
    Qi(t.setup, "setup", n), Qi(t.landing, "landing", n), t.timeline && Array.isArray(t.timeline) && vc(t.timeline, "timeline", e, n);
  return n;
}
c(lv, "validateCinematicDeep");
const tl = 5, ud = /* @__PURE__ */ new Set(["click", "tile-click", "keypress"]);
var le, ye, We, Ne, Et, $r, wc, Rh, K, Pe, is, ke, It;
const ae = class ae {
  constructor(e = null, { loadedHash: n = null, cinematicName: i = "default", segmentName: r = null } = {}) {
    A(this, K);
    A(this, le);
    A(this, ye);
    A(this, We);
    A(this, Ne);
    var s;
    I(this, le, e ?? ae.empty()), I(this, ye, i), I(this, Ne, n);
    const o = (s = p(this, le).cinematics) == null ? void 0 : s[p(this, ye)];
    I(this, We, r ?? (o == null ? void 0 : o.entry) ?? "main");
  }
  static empty() {
    return {
      version: tl,
      cinematics: {
        default: ae.emptyCinematic()
      }
    };
  }
  static emptyCinematic() {
    return {
      trigger: "canvasReady",
      tracking: !0,
      entry: "main",
      segments: {
        main: ae.emptySegment()
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
    const { trigger: n, tracking: i, synchronized: r, setup: o, landing: s, timeline: a = [] } = e;
    if (!a.some(
      (b) => {
        var w;
        return b.await != null && ud.has(((w = b.await) == null ? void 0 : w.event) ?? "click");
      }
    )) {
      const b = a.filter((C) => C.transitionTo == null), w = a.find((C) => C.transitionTo != null), E = { timeline: b };
      if (o && Object.keys(o).length && (E.setup = o), s && Object.keys(s).length && (E.landing = s), w) {
        const C = w.transitionTo;
        C.scene && C.cinematic ? E.next = { segment: C.cinematic, scene: C.scene } : C.cinematic;
      }
      return {
        trigger: n,
        tracking: i,
        ...r ? { synchronized: r } : {},
        entry: "main",
        segments: { main: E }
      };
    }
    const u = {};
    let d = [], f = 1, h = null;
    const m = [];
    function g() {
      const b = `segment-${f++}`, w = { timeline: [...d] };
      return h && (w.gate = h), u[b] = w, m.push(b), d = [], h = null, b;
    }
    c(g, "flushSegment");
    for (const b of a)
      if (b.transitionTo == null) {
        if (b.await != null && ud.has(((v = b.await) == null ? void 0 : v.event) ?? "click")) {
          g(), h = { ...b.await }, delete h.event, h = { event: b.await.event ?? "click", ...h };
          continue;
        }
        d.push(b);
      }
    (d.length > 0 || h) && g();
    for (let b = 0; b < m.length - 1; b++)
      u[m[b]].next = m[b + 1];
    m.length > 0 && (o && Object.keys(o).length && (u[m[0]].setup = o), s && Object.keys(s).length && (u[m[m.length - 1]].landing = s));
    const y = a.find((b) => b.transitionTo != null);
    if (y && m.length > 0) {
      const b = y.transitionTo, w = u[m[m.length - 1]];
      b.scene && b.cinematic && (w.next = { segment: b.cinematic, scene: b.scene });
    }
    return {
      trigger: n,
      tracking: i,
      ...r ? { synchronized: r } : {},
      entry: m[0] ?? "main",
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
    for (const o of Object.values(n.segments))
      (i = o.timeline) != null && i.length && (o.timeline = T(r = ae, Et, wc).call(r, o.timeline));
    return n;
  }
  static fromScene(e, n = "default") {
    var s;
    const i = e == null ? void 0 : e.getFlag(L, "cinematic");
    let r = i ? foundry.utils.deepClone(i) : null;
    const o = i ? T(s = ae, Et, Rh).call(s, i) : null;
    if (r && (r.version ?? 1) < 3) {
      const { version: a, ...l } = r;
      r = { version: 3, cinematics: { default: l } };
    }
    if (r && r.version === 3) {
      for (const [a, l] of Object.entries(r.cinematics ?? {}))
        r.cinematics[a] = ae.migrateV3toV4(l);
      r.version = 4;
    }
    if (r && r.version === 4) {
      for (const [a, l] of Object.entries(r.cinematics ?? {}))
        r.cinematics[a] = ae.migrateV4toV5(l);
      r.version = tl;
    }
    return new ae(r, { loadedHash: o, cinematicName: n });
  }
  /**
   * Check if the scene's cinematic flag has been modified since this state was loaded.
   * @param {object} scene  The Foundry scene document
   * @returns {boolean} true if scene data differs from what was loaded
   */
  isStale(e) {
    if (!p(this, Ne)) return !1;
    const n = e == null ? void 0 : e.getFlag(L, "cinematic");
    return n ? !foundry.utils.objectsEqual(n, p(this, Ne)) : !1;
  }
  // ── Read ──────────────────────────────────────────────────────────────
  get data() {
    return p(this, le);
  }
  get trigger() {
    return p(this, K, Pe).trigger;
  }
  get tracking() {
    return p(this, K, Pe).tracking;
  }
  get synchronized() {
    return p(this, K, Pe).synchronized ?? !1;
  }
  get activeCinematicName() {
    return p(this, ye);
  }
  // ── Segment accessors ────────────────────────────────────────────────
  get segments() {
    return p(this, K, Pe).segments;
  }
  get entry() {
    return p(this, K, Pe).entry;
  }
  get activeSegmentName() {
    return p(this, We);
  }
  get activeSegment() {
    var e;
    return ((e = p(this, K, Pe).segments) == null ? void 0 : e[p(this, We)]) ?? null;
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
    return Object.keys(p(this, le).cinematics);
  }
  switchCinematic(e) {
    if (!p(this, le).cinematics[e]) return this;
    const n = p(this, le).cinematics[e];
    return new ae(foundry.utils.deepClone(p(this, le)), {
      loadedHash: p(this, Ne),
      cinematicName: e,
      segmentName: n.entry ?? "main"
    });
  }
  addCinematic(e) {
    if (!e || p(this, le).cinematics[e]) return this;
    const n = foundry.utils.deepClone(p(this, le));
    return n.cinematics[e] = ae.emptyCinematic(), new ae(n, {
      loadedHash: p(this, Ne),
      cinematicName: e,
      segmentName: "main"
    });
  }
  removeCinematic(e) {
    if (Object.keys(p(this, le).cinematics).length <= 1) return this;
    if (!p(this, le).cinematics[e]) return this;
    const i = foundry.utils.deepClone(p(this, le));
    delete i.cinematics[e];
    const r = p(this, ye) === e ? Object.keys(i.cinematics)[0] : p(this, ye), o = i.cinematics[r];
    return new ae(i, {
      loadedHash: p(this, Ne),
      cinematicName: r,
      segmentName: (o == null ? void 0 : o.entry) ?? "main"
    });
  }
  renameCinematic(e, n) {
    if (!e || !n || e === n) return this;
    if (!p(this, le).cinematics[e]) return this;
    if (p(this, le).cinematics[n]) return this;
    const i = foundry.utils.deepClone(p(this, le)), r = {};
    for (const [s, a] of Object.entries(i.cinematics))
      r[s === e ? n : s] = a;
    i.cinematics = r;
    const o = p(this, ye) === e ? n : p(this, ye);
    return new ae(i, {
      loadedHash: p(this, Ne),
      cinematicName: o,
      segmentName: p(this, We)
    });
  }
  // ── Cinematic-level mutations ─────────────────────────────────────────
  setTrigger(e) {
    return T(this, K, is).call(this, { trigger: e });
  }
  setTracking(e) {
    return T(this, K, is).call(this, { tracking: e });
  }
  setSynchronized(e) {
    return T(this, K, is).call(this, { synchronized: e });
  }
  // ── Segment-level mutations (setup/landing now live on segments) ──────
  setSetup(e) {
    return T(this, K, ke).call(this, { setup: e });
  }
  setLanding(e) {
    return T(this, K, ke).call(this, { landing: e });
  }
  // ── Segment management methods ────────────────────────────────────────
  switchSegment(e) {
    var n;
    return (n = p(this, K, Pe).segments) != null && n[e] ? new ae(foundry.utils.deepClone(p(this, le)), {
      loadedHash: p(this, Ne),
      cinematicName: p(this, ye),
      segmentName: e
    }) : this;
  }
  addSegment(e, n = null) {
    var o;
    if (!e || (o = p(this, K, Pe).segments) != null && o[e]) return this;
    const i = foundry.utils.deepClone(p(this, le)), r = i.cinematics[p(this, ye)];
    if (r.segments[e] = ae.emptySegment(), n && r.segments[n]) {
      const s = r.segments[n].next;
      r.segments[n].next = e, s && (r.segments[e].next = s);
    }
    return new ae(i, {
      loadedHash: p(this, Ne),
      cinematicName: p(this, ye),
      segmentName: e
    });
  }
  removeSegment(e) {
    var a, l;
    if (Object.keys(p(this, K, Pe).segments ?? {}).length <= 1) return this;
    if (!((a = p(this, K, Pe).segments) != null && a[e])) return this;
    const i = foundry.utils.deepClone(p(this, le)), r = i.cinematics[p(this, ye)], o = r.segments[e].next;
    for (const [, u] of Object.entries(r.segments))
      (u.next === e || typeof u.next == "object" && ((l = u.next) == null ? void 0 : l.segment) === e) && (u.next = o ?? void 0, u.next || delete u.next);
    delete r.segments[e], r.entry === e && (r.entry = Object.keys(r.segments)[0]);
    const s = p(this, We) === e ? r.entry : p(this, We);
    return new ae(i, {
      loadedHash: p(this, Ne),
      cinematicName: p(this, ye),
      segmentName: s
    });
  }
  renameSegment(e, n) {
    var a, l, u;
    if (!e || !n || e === n) return this;
    if (!((a = p(this, K, Pe).segments) != null && a[e])) return this;
    if ((l = p(this, K, Pe).segments) != null && l[n]) return this;
    const i = foundry.utils.deepClone(p(this, le)), r = i.cinematics[p(this, ye)], o = {};
    for (const [d, f] of Object.entries(r.segments))
      o[d === e ? n : d] = f;
    r.segments = o;
    for (const [, d] of Object.entries(r.segments))
      d.next === e ? d.next = n : typeof d.next == "object" && ((u = d.next) == null ? void 0 : u.segment) === e && (d.next.segment = n);
    r.entry === e && (r.entry = n);
    const s = p(this, We) === e ? n : p(this, We);
    return new ae(i, {
      loadedHash: p(this, Ne),
      cinematicName: p(this, ye),
      segmentName: s
    });
  }
  setSegmentGate(e) {
    return T(this, K, ke).call(this, { gate: e ?? void 0 });
  }
  setSegmentNext(e) {
    return T(this, K, ke).call(this, { next: e ?? void 0 });
  }
  setSegmentSetup(e) {
    return T(this, K, ke).call(this, { setup: e });
  }
  setSegmentLanding(e) {
    return T(this, K, ke).call(this, { landing: e });
  }
  listSegmentNames() {
    return Object.keys(p(this, K, Pe).segments ?? {});
  }
  // ── Timeline entry mutations (scoped to active segment) ──────────────
  addStep(e = -1) {
    const n = [...this.activeSegment.timeline], i = { duration: 1e3, tweens: [] };
    return e < 0 || e >= n.length ? n.push(i) : n.splice(e, 0, i), T(this, K, ke).call(this, { timeline: n });
  }
  addDelay(e = -1, n = 1e3) {
    const i = [...this.activeSegment.timeline], r = { delay: n };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), T(this, K, ke).call(this, { timeline: i });
  }
  addAwait(e = -1, n = null) {
    return console.warn(`[${L}] CinematicState.addAwait() is deprecated in v4. Use segment gates instead.`), this;
  }
  addEmit(e = -1, n = "") {
    const i = [...this.activeSegment.timeline], r = { emit: n };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), T(this, K, ke).call(this, { timeline: i });
  }
  addParallel(e = -1) {
    const n = [...this.activeSegment.timeline], i = { parallel: { branches: [[], []], join: "all", overflow: "detach" } };
    return e < 0 || e >= n.length ? n.push(i) : n.splice(e, 0, i), T(this, K, ke).call(this, { timeline: n });
  }
  addTransitionTo(e = -1, n = null) {
    return console.warn(`[${L}] CinematicState.addTransitionTo() is deprecated in v4. Use segment next edges instead.`), this;
  }
  addSound(e = -1, n = null) {
    const i = [...this.activeSegment.timeline], r = { sound: n ?? { src: "", volume: 0.8, loop: !1, duration: 0, fireAndForget: !1 } };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), T(this, K, ke).call(this, { timeline: i });
  }
  addStopSound(e = -1, n = "") {
    const i = [...this.activeSegment.timeline], r = { stopSound: n };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), T(this, K, ke).call(this, { timeline: i });
  }
  moveEntry(e, n) {
    if (e === n) return this;
    const i = [...this.activeSegment.timeline];
    if (e < 0 || e >= i.length) return this;
    if (n < 0 || n >= i.length) return this;
    const [r] = i.splice(e, 1);
    return i.splice(n, 0, r), T(this, K, ke).call(this, { timeline: i });
  }
  removeEntry(e) {
    const n = [...this.activeSegment.timeline];
    return e < 0 || e >= n.length ? this : (n.splice(e, 1), T(this, K, ke).call(this, { timeline: n }));
  }
  updateEntry(e, n) {
    const i = this.activeSegment.timeline.map((r, o) => o !== e ? r : { ...foundry.utils.deepClone(r), ...n });
    return T(this, K, ke).call(this, { timeline: i });
  }
  // ── Tween mutations ──────────────────────────────────────────────────
  addTween(e, n = null) {
    const i = { type: "tile-prop", target: "", attribute: "alpha", value: 1 };
    return T(this, K, It).call(this, e, (r) => {
      const o = [...r.tweens ?? [], n ?? i];
      return { ...r, tweens: o };
    });
  }
  updateTween(e, n, i) {
    return T(this, K, It).call(this, e, (r) => {
      const o = (r.tweens ?? []).map((s, a) => a !== n ? s : { ...s, ...i });
      return { ...r, tweens: o };
    });
  }
  removeTween(e, n) {
    return T(this, K, It).call(this, e, (i) => {
      const r = (i.tweens ?? []).filter((o, s) => s !== n);
      return { ...i, tweens: r };
    });
  }
  updateStepDuration(e, n) {
    return T(this, K, It).call(this, e, (i) => ({ ...i, duration: Math.max(0, n) }));
  }
  // ── Parallel branch mutations ────────────────────────────────────────
  addBranch(e) {
    return T(this, K, It).call(this, e, (n) => {
      if (!n.parallel) return n;
      const i = [...n.parallel.branches, []];
      return { ...n, parallel: { ...n.parallel, branches: i } };
    });
  }
  removeBranch(e, n) {
    return T(this, K, It).call(this, e, (i) => {
      if (!i.parallel) return i;
      const r = i.parallel.branches.filter((o, s) => s !== n);
      return r.length < 1 ? i : { ...i, parallel: { ...i.parallel, branches: r } };
    });
  }
  addBranchEntry(e, n, i = null) {
    const r = { duration: 1e3, tweens: [] };
    return T(this, K, It).call(this, e, (o) => {
      if (!o.parallel) return o;
      const s = o.parallel.branches.map((a, l) => l !== n ? a : [...a, i ?? r]);
      return { ...o, parallel: { ...o.parallel, branches: s } };
    });
  }
  removeBranchEntry(e, n, i) {
    return T(this, K, It).call(this, e, (r) => {
      if (!r.parallel) return r;
      const o = r.parallel.branches.map((s, a) => a !== n ? s : s.filter((l, u) => u !== i));
      return { ...r, parallel: { ...r.parallel, branches: o } };
    });
  }
  updateBranchEntry(e, n, i, r) {
    return T(this, K, It).call(this, e, (o) => {
      if (!o.parallel) return o;
      const s = o.parallel.branches.map((a, l) => l !== n ? a : a.map((u, d) => d !== i ? u : { ...foundry.utils.deepClone(u), ...r }));
      return { ...o, parallel: { ...o.parallel, branches: s } };
    });
  }
  moveBranchEntry(e, n, i, r) {
    return i === r ? this : T(this, K, It).call(this, e, (o) => {
      if (!o.parallel) return o;
      const s = o.parallel.branches.map((a, l) => {
        if (l !== n) return a;
        const u = [...a];
        if (i < 0 || i >= u.length || r < 0 || r >= u.length) return a;
        const [d] = u.splice(i, 1);
        return u.splice(r, 0, d), u;
      });
      return { ...o, parallel: { ...o.parallel, branches: s } };
    });
  }
  // ── Persistence ──────────────────────────────────────────────────────
  async save(e) {
    const n = { ...foundry.utils.deepClone(p(this, le)), version: tl };
    await e.setFlag(L, "cinematic", n);
  }
  /** Returns the active cinematic's data (for validation/export). */
  toJSON() {
    return foundry.utils.deepClone(p(this, K, Pe));
  }
  /** Returns the entire v4 flag structure. */
  toFullJSON() {
    return foundry.utils.deepClone(p(this, le));
  }
};
le = new WeakMap(), ye = new WeakMap(), We = new WeakMap(), Ne = new WeakMap(), Et = new WeakSet(), $r = /* @__PURE__ */ c(function(e) {
  const { duration: n, detach: i, ...r } = e;
  return r;
}, "#stripTween"), wc = /* @__PURE__ */ c(function(e) {
  var i, r;
  const n = [];
  for (const o of e) {
    if (o.delay != null || o.await != null || o.emit != null || o.transitionTo != null || o.sound != null || o.stopSound != null) {
      n.push(o);
      continue;
    }
    if ((i = o.parallel) != null && i.branches) {
      const l = o.parallel.branches.map(
        (u) => {
          var d;
          return T(d = ae, Et, wc).call(d, u);
        }
      );
      n.push({ ...o, parallel: { ...o.parallel, branches: l } });
      continue;
    }
    if (!((r = o.tweens) != null && r.length)) {
      n.push({ duration: 500, ...o });
      continue;
    }
    const s = [], a = [];
    for (const l of o.tweens)
      l.detach ? a.push(l) : s.push(l);
    if (a.length === 0) {
      const l = Math.max(500, ...o.tweens.map((f) => f.duration ?? 0)), { tweens: u, ...d } = o;
      n.push({
        ...d,
        duration: l,
        tweens: u.map(T(ae, Et, $r))
      });
    } else if (s.length === 0) {
      const l = Math.max(500, ...a.map((f) => f.duration ?? 0)), { tweens: u, ...d } = o;
      n.push({
        ...d,
        duration: l,
        tweens: a.map(T(ae, Et, $r))
      });
    } else {
      const l = Math.max(500, ...s.map((h) => h.duration ?? 0)), u = Math.max(500, ...a.map((h) => h.duration ?? 0)), { tweens: d, ...f } = o;
      n.push({
        parallel: {
          branches: [
            [{ ...f, duration: l, tweens: s.map(T(ae, Et, $r)) }],
            [{ duration: u, tweens: a.map(T(ae, Et, $r)) }]
          ],
          join: "all",
          overflow: "detach"
        }
      });
    }
  }
  return n;
}, "#migrateTimelineV5"), Rh = /* @__PURE__ */ c(function(e) {
  return foundry.utils.deepClone(e);
}, "#computeHash"), K = new WeakSet(), Pe = /* @__PURE__ */ c(function() {
  return p(this, le).cinematics[p(this, ye)];
}, "#active"), // ── Internal ─────────────────────────────────────────────────────────
/** Clone the full state with a patch to the active cinematic (cinematic-level props). */
is = /* @__PURE__ */ c(function(e) {
  const n = foundry.utils.deepClone(p(this, le));
  return Object.assign(n.cinematics[p(this, ye)], e), new ae(n, {
    loadedHash: p(this, Ne),
    cinematicName: p(this, ye),
    segmentName: p(this, We)
  });
}, "#cloneActive"), /** Clone the full state with a patch to the active segment within the active cinematic. */
ke = /* @__PURE__ */ c(function(e) {
  const n = foundry.utils.deepClone(p(this, le)), i = n.cinematics[p(this, ye)].segments[p(this, We)];
  if (!i) return this;
  Object.assign(i, e);
  for (const [r, o] of Object.entries(i))
    o === void 0 && delete i[r];
  return new ae(n, {
    loadedHash: p(this, Ne),
    cinematicName: p(this, ye),
    segmentName: p(this, We)
  });
}, "#cloneActiveSegment"), /** Mutate a single timeline entry within the active segment. */
It = /* @__PURE__ */ c(function(e, n) {
  const i = this.activeSegment;
  if (!i || e < 0 || e >= i.timeline.length) return this;
  const r = i.timeline.map((o, s) => s !== e ? o : n(foundry.utils.deepClone(o)));
  return T(this, K, ke).call(this, { timeline: r });
}, "#mutateEntry"), A(ae, Et), c(ae, "CinematicState");
let nn = ae;
const dd = [
  { value: "tile-prop", label: "Tile Prop" },
  { value: "light-color", label: "Light Color" },
  { value: "light-state", label: "Light State" },
  { value: "particles-prop", label: "Particles Prop" },
  { value: "camera-pan", label: "Camera Pan" },
  { value: "token-prop", label: "Token Prop" },
  { value: "drawing-prop", label: "Drawing Prop" },
  { value: "sound-prop", label: "Sound Prop" }
], Hh = {
  "tile-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y, width, height" },
  "token-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y" },
  "drawing-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y" },
  "sound-prop": { form: "prop", attribute: "volume", value: 0.5, placeholder: "volume, radius" },
  "particles-prop": { form: "particles", attribute: "alpha", value: 1, placeholder: "alpha, rate, speed, size" },
  "camera-pan": { form: "camera", x: 0, y: 0, scale: 1 },
  "light-color": { form: "lightColor", toColor: "#ffffff", toAlpha: "", mode: "oklch" },
  "light-state": { form: "lightState", enabled: !0 }
}, cv = [
  { value: "canvasReady", label: "Canvas Ready" },
  { value: "manual", label: "Manual Only" }
];
function fd(t) {
  return t && (t.split("/").pop() || "").replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "-") || "";
}
c(fd, "soundIdFromPath");
function hd(t) {
  return t ? new Promise((e) => {
    const n = new Audio(t);
    n.addEventListener("loadedmetadata", () => {
      e(Math.round(n.duration * 1e3));
    }), n.addEventListener("error", () => e(0));
  }) : Promise.resolve(0);
}
c(hd, "loadAudioDurationMs");
const Kn = 40, Br = 24, to = 50, md = 50, mi = 60, vi = 10, nl = 16, qh = 40, Bh = 20, uv = 90, gd = 70, pd = 8;
function $a(t) {
  return { stepDuration: Math.max(500, t.duration ?? 500), detachOverflow: 0 };
}
c($a, "computeStepDurations");
function dv(t) {
  var i;
  const e = ((i = t.parallel) == null ? void 0 : i.branches) ?? [];
  let n = 0;
  for (const r of e) {
    let o = 0;
    for (const s of r)
      s.delay != null ? o += s.delay : s.await != null || s.emit != null || (s.sound != null ? o += s.sound.fireAndForget ? 0 : s.sound.duration ?? 0 : s.stopSound != null || (o += $a(s).stepDuration));
    n = Math.max(n, o);
  }
  return Math.max(500, n);
}
c(dv, "computeParallelDuration");
function lu(t) {
  return t.reduce((e, n) => n.delay != null ? e + n.delay : n.await != null || n.emit != null || n.transitionTo != null ? e : n.sound != null ? e + (n.sound.fireAndForget ? 0 : n.sound.duration ?? 0) : n.stopSound != null ? e : n.parallel != null ? e + dv(n) : e + $a(n).stepDuration, 0);
}
c(lu, "computeTotalDuration");
function fv(t, e) {
  if (t <= 0) return 0.1;
  const n = e / t;
  return Math.max(0.03, Math.min(0.5, n));
}
c(fv, "computeScale");
function jh(t) {
  const e = t.tweens ?? [];
  if (e.length === 0) return "Empty";
  const n = e[0], i = (n.target ?? "").replace(/^tag:/, "#"), r = n.attribute ?? "";
  return n.type === "camera-pan" ? "Pan" : r === "alpha" ? `Fade ${i}` : r === "x" || r === "y" ? `Move ${i}` : n.type === "light-color" ? `Light ${i}` : n.type === "sound-prop" ? `Sound ${i}` : i ? `${i}` : "Step";
}
c(jh, "deriveStepLabel");
function hv(t, e, n, i, r) {
  var u, d;
  const o = [], s = [], a = [];
  let l = e;
  for (let f = 0; f < t.length; f++) {
    const h = t[f], m = `${i}.${f}`, g = r === m;
    if (h.delay != null) {
      const y = Math.max(Bh, h.delay * n);
      o.push({ type: "delay", leftPx: l, widthPx: y, label: `${h.delay}ms`, entryPath: m, selected: g }), l += y;
    } else if (h.await != null) {
      const y = ((u = h.await) == null ? void 0 : u.event) ?? "click", v = y === "tile-click" ? "fa-hand-pointer" : y === "signal" ? "fa-bolt" : "fa-pause";
      o.push({ type: "await", leftPx: l, widthPx: nl, label: y, entryPath: m, selected: g, isGate: !0, gateIcon: v }), ((d = h.await) == null ? void 0 : d.event) === "signal" && a.push({ signal: h.await.signal, centerPx: l + nl / 2 }), l += nl;
    } else if (h.emit != null)
      o.push({ type: "emit", leftPx: l, widthPx: vi, label: "emit", entryPath: m, selected: g, isMarker: !0 }), s.push({ signal: h.emit, centerPx: l + vi / 2 });
    else if (h.sound != null) {
      const y = (h.sound.src || "").split("/").pop() || "Sound", v = h.sound.duration ?? 0;
      if (h.sound.fireAndForget ?? !1)
        o.push({ type: "sound", leftPx: l, widthPx: vi, label: y, entryPath: m, selected: g, isMarker: !0 });
      else {
        const w = v > 0 ? Math.max(mi, v * n) : mi, E = (h.sound.loop ?? !1) && v <= 0;
        o.push({ type: "sound", leftPx: l, widthPx: w, label: y, entryPath: m, selected: g, hasTrailingArrow: E }), l += w;
      }
    } else if (h.stopSound != null)
      o.push({ type: "stopSound", leftPx: l, widthPx: vi, label: "Stop", entryPath: m, selected: g, isMarker: !0 });
    else {
      const { stepDuration: y } = $a(h), v = Math.max(qh, y * n), b = jh(h);
      o.push({ type: "step", leftPx: l, widthPx: v, label: b, entryPath: m, selected: g }), l += v;
    }
  }
  return { blocks: o, width: l - e, emits: s, awaits: a };
}
c(hv, "computeBranchLane");
function yd(t) {
  return Br + t * Kn;
}
c(yd, "laneIndexToY");
function mv(t, e) {
  const n = [];
  for (const i of t.emits)
    for (const r of t.awaits) {
      if (i.signal !== r.signal) continue;
      const o = i.centerPx, s = yd(i.laneIndex) + Kn / 2, a = r.centerPx, l = yd(r.laneIndex) + Kn / 2, u = l - s, d = (o + a) / 2, f = s + Math.sign(u || 1) * Math.min(40, Math.abs(u) * 0.5 + 20), h = l - Math.sign(u || 1) * Math.min(40, Math.abs(u) * 0.5 + 20);
      n.push({
        pathD: `M ${o} ${s} C ${d} ${f}, ${d} ${h}, ${a} ${l}`,
        signal: i.signal
      });
    }
  return n;
}
c(mv, "computeSignalArcs");
function gv(t, e) {
  const n = [];
  if (t <= 0) return n;
  const i = e * 1e3;
  let r;
  i >= 200 ? r = 500 : i >= 80 ? r = 1e3 : i >= 40 ? r = 2e3 : r = 5e3;
  for (let o = 0; o <= t + r; o += r) {
    const s = o >= 1e3 ? `${(o / 1e3).toFixed(o % 1e3 === 0 ? 0 : 1)}s` : `${o}ms`;
    n.push({ px: to + o * e, label: s });
  }
  return n;
}
c(gv, "computeTimeMarkers");
function pv(t) {
  const e = [];
  for (let n = 0; n < t.length - 1; n++) {
    const i = t[n], r = t[n + 1], o = i.leftPx + i.widthPx + (r.leftPx - (i.leftPx + i.widthPx)) / 2, s = Br + Kn / 2;
    let a;
    if (i.entryPath === "setup")
      a = 0;
    else {
      if (i.entryPath === "landing")
        continue;
      if (i.entryPath.startsWith("timeline.")) {
        const u = i.entryPath.split(".");
        a = Number(u[1]) + 1;
      } else
        continue;
    }
    const l = r.entryPath === "landing";
    e.push({ leftPx: o, topPx: s, insertIndex: a, lane: "main", isEnd: l });
  }
  return e;
}
c(pv, "computeInsertionPoints");
function yv(t, { selectedPath: e, windowWidth: n }) {
  const i = lu(t), r = n - 70 - 100, o = fv(i, r), s = [], a = [], l = { emits: [], awaits: [] }, u = [];
  s.push({
    type: "setup",
    leftPx: 0,
    widthPx: to,
    label: "Setup",
    entryPath: "setup",
    selected: e === "setup"
  });
  let d = to;
  for (let w = 0; w < t.length; w++) {
    const E = t[w], C = `timeline.${w}`, O = e === C;
    if (E.delay != null) {
      const k = Math.max(Bh, E.delay * o);
      s.push({
        type: "delay",
        leftPx: d,
        widthPx: k,
        label: `${E.delay}ms`,
        entryPath: C,
        selected: O
      }), d += k;
    } else if (E.emit != null)
      s.push({
        type: "emit",
        leftPx: d,
        widthPx: vi,
        label: "Emit",
        entryPath: C,
        selected: O,
        isMarker: !0
      }), l.emits.push({
        signal: E.emit,
        centerPx: d + vi / 2,
        laneIndex: 0
      });
    else if (E.sound != null) {
      const k = (E.sound.src || "").split("/").pop() || "Sound", x = E.sound.duration ?? 0;
      if (E.sound.fireAndForget ?? !1) {
        const D = x > 0 ? Math.max(mi, x * o) : mi, N = (E.sound.loop ?? !1) && x <= 0, F = {
          type: "sound",
          leftPx: d,
          widthPx: D,
          label: k,
          entryPath: C,
          selected: O,
          hasTrailingArrow: N
        };
        let M = !1;
        for (const R of u)
          if (R.rightEdgePx <= d) {
            R.blocks.push(F), R.rightEdgePx = d + D, M = !0;
            break;
          }
        M || u.push({
          label: "♫ F&F",
          blocks: [F],
          rightEdgePx: d + D
        });
      } else {
        const D = x > 0 ? Math.max(mi, x * o) : mi, N = (E.sound.loop ?? !1) && x <= 0;
        s.push({
          type: "sound",
          leftPx: d,
          widthPx: D,
          label: k,
          entryPath: C,
          selected: O,
          hasTrailingArrow: N
        }), d += D;
      }
    } else if (E.stopSound != null)
      s.push({
        type: "stopSound",
        leftPx: d,
        widthPx: vi,
        label: "Stop",
        entryPath: C,
        selected: O,
        isMarker: !0
      });
    else if (E.parallel != null) {
      const k = E.parallel.branches ?? [], x = d, $ = [];
      let D = 0;
      for (let F = 0; F < k.length; F++) {
        const M = `timeline.${w}.parallel.branches.${F}`, { blocks: R, width: B, emits: j, awaits: H } = hv(k[F], x, o, M, e);
        $.push({ label: `Br ${F + 1}`, blocks: R }), D = Math.max(D, B);
        const V = a.length * 10 + F + 1;
        for (const Y of j) l.emits.push({ ...Y, laneIndex: V });
        for (const Y of H) l.awaits.push({ ...Y, laneIndex: V });
      }
      const N = Math.max(mi, D);
      s.push({
        type: "parallel",
        leftPx: x,
        widthPx: N,
        label: `${k.length} br`,
        entryPath: C,
        selected: O
      }), a.push({ parallelEntryIndex: w, startPx: x, lanes: $ }), d += N;
    } else {
      const { stepDuration: k } = $a(E), x = Math.max(qh, k * o), $ = jh(E);
      s.push({
        type: "step",
        leftPx: d,
        widthPx: x,
        label: $,
        entryPath: C,
        selected: O
      }), d += x;
    }
  }
  s.push({
    type: "landing",
    leftPx: d,
    widthPx: md,
    label: "Landing",
    entryPath: "landing",
    selected: e === "landing"
  }), d += md;
  const f = a.flatMap((w) => w.lanes), h = f.length;
  for (const w of u)
    f.push({ label: w.label, blocks: w.blocks });
  const m = mv(l, f.length), g = [];
  for (let w = 0; w < u.length; w++) {
    const E = h + w;
    for (const C of u[w].blocks) {
      const O = C.leftPx, k = Br + Kn, x = Br + (1 + E) * Kn + Kn / 2;
      g.push({ x: O, y1: k, y2: x });
    }
  }
  const y = gv(i, o), v = pv(s), b = Br + (1 + f.length) * Kn;
  return {
    mainBlocks: s,
    subLanes: f,
    signalArcs: m,
    fafConnectors: g,
    timeMarkers: y,
    insertionPoints: v,
    totalWidthPx: Math.max(d, 200),
    swimlaneHeightPx: b,
    totalDurationMs: i
  };
}
c(yv, "computeLanes");
function bv(t) {
  if (t <= 0) return "0s";
  if (t < 1e3) return `${t}ms`;
  const e = t / 1e3;
  return e % 1 === 0 ? `${e}s` : `${e.toFixed(1)}s`;
}
c(bv, "formatDuration");
function vv(t, e) {
  var m, g, y, v;
  const n = t.segments ?? {}, i = t.entry ?? "main", r = Object.keys(n);
  if (r.length === 0)
    return { nodes: [], edges: [], totalWidthPx: 0 };
  const o = /* @__PURE__ */ new Set(), s = [];
  let a = i;
  for (; a && typeof a == "string" && n[a] && !o.has(a); )
    o.add(a), s.push(a), a = n[a].next;
  for (const b of r)
    o.has(b) || s.push(b);
  const l = [];
  let u = pd;
  for (const b of s) {
    const w = n[b], E = lu(w.timeline ?? []), C = bv(E), O = b === i, k = b === e, x = !o.has(b), $ = uv;
    l.push({
      name: b,
      durationMs: E,
      durationLabel: C,
      isEntry: O,
      isActive: k,
      isOrphan: x,
      leftPx: u,
      widthPx: $,
      hasGate: !!w.gate,
      gateEvent: ((m = w.gate) == null ? void 0 : m.event) ?? null
    }), u += $ + gd;
  }
  const d = [], f = new Map(l.map((b) => [b.name, b]));
  for (const b of s) {
    const w = n[b];
    if (!w.next) continue;
    const E = typeof w.next == "string" ? w.next : (g = w.next) == null ? void 0 : g.segment;
    if (!E) continue;
    const C = f.get(b), O = f.get(E);
    if (!C || !O) continue;
    const k = n[E], x = ((y = k == null ? void 0 : k.gate) == null ? void 0 : y.event) ?? null, $ = typeof w.next == "object" && ((v = w.next) == null ? void 0 : v.scene);
    d.push({
      fromName: b,
      toName: E,
      gateLabel: x,
      isCrossScene: $,
      fromRightPx: C.leftPx + C.widthPx,
      toLeftPx: O.leftPx
    });
  }
  const h = u - gd + pd;
  return { nodes: l, edges: d, totalWidthPx: h };
}
c(vv, "computeSegmentGraph");
function ti(t) {
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
c(ti, "parseEntryPath");
function ks(t, e) {
  var i, r, o, s;
  const n = ti(t);
  return n ? n.type === "setup" ? e.setup : n.type === "landing" ? e.landing : n.type === "timeline" ? e.timeline[n.index] : n.type === "branch" ? (s = (o = (r = (i = e.timeline[n.index]) == null ? void 0 : i.parallel) == null ? void 0 : r.branches) == null ? void 0 : o[n.branchIndex]) == null ? void 0 : s[n.branchEntryIndex] : null : null;
}
c(ks, "getEntryAtPath");
function bd(t) {
  const e = ti(t);
  return !e || e.type !== "timeline" ? null : e.index;
}
c(bd, "getTimelineIndexFromPath");
function wv(t) {
  var o, s;
  const e = /* @__PURE__ */ new Set(), i = (o = t.data.cinematics) == null ? void 0 : o[t.activeCinematicName];
  if (!i) return 0;
  function r(a) {
    var l;
    for (const u of a ?? []) {
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
    for (const a of Object.values(i.segments)) {
      if (a.setup) for (const l of Object.keys(a.setup)) e.add(l);
      if (a.landing) for (const l of Object.keys(a.landing)) e.add(l);
      (s = a.gate) != null && s.target && e.add(a.gate.target), r(a.timeline);
    }
  else {
    if (i.setup) for (const a of Object.keys(i.setup)) e.add(a);
    if (i.landing) for (const a of Object.keys(i.landing)) e.add(a);
    r(i.timeline);
  }
  return e.size;
}
c(wv, "countUniqueTargets");
function Ev(t, e) {
  var i, r, o;
  const n = ti(t);
  if (!n) return 0;
  if (n.type === "timeline") {
    let s = 0;
    for (let a = 0; a <= n.index; a++) {
      const l = e.timeline[a];
      l && l.delay == null && l.emit == null && l.parallel == null && l.sound == null && l.stopSound == null && s++;
    }
    return s;
  }
  if (n.type === "branch") {
    const s = ((o = (r = (i = e.timeline[n.index]) == null ? void 0 : i.parallel) == null ? void 0 : r.branches) == null ? void 0 : o[n.branchIndex]) ?? [];
    let a = 0;
    for (let l = 0; l <= n.branchEntryIndex; l++) {
      const u = s[l];
      u && u.delay == null && u.emit == null && u.sound == null && u.stopSound == null && a++;
    }
    return a;
  }
  return 0;
}
c(Ev, "stepNumberForPath");
function Sv(t) {
  return {
    isSetup: !0,
    targetCount: Object.keys(t.setup ?? {}).length
  };
}
c(Sv, "buildSetupDetail");
function Cv(t) {
  return {
    isLanding: !0,
    targetCount: Object.keys(t.landing ?? {}).length
  };
}
c(Cv, "buildLandingDetail");
function Tv(t) {
  return { type: "delay", isDelay: !0, delay: t.delay };
}
c(Tv, "buildDelayDetail");
function Lv(t) {
  return { type: "emit", isEmit: !0, signal: t.emit };
}
c(Lv, "buildEmitDetail");
function Iv(t) {
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
c(Iv, "buildSoundDetail");
function Ov(t) {
  return {
    type: "stopSound",
    isStopSound: !0,
    stopSoundId: t.stopSound
  };
}
c(Ov, "buildStopSoundDetail");
function kv(t, e) {
  var s;
  const n = t.parallel, i = n.join ?? "all", r = n.overflow ?? "detach", o = (n.branches ?? []).map((a, l) => ({
    branchIndex: l,
    label: `Branch ${l + 1}`,
    entries: (a ?? []).map((u, d) => {
      var E, C;
      const f = u.delay != null, h = u.await != null, m = u.emit != null, g = u.sound != null, y = u.stopSound != null, v = !f && !h && !m && !g && !y;
      let b, w;
      return f ? (b = `${u.delay}ms`, w = "delay") : h ? (b = "Await", w = ((E = u.await) == null ? void 0 : E.event) ?? "click") : m ? (b = "Emit", w = u.emit || "(unnamed)") : g ? (b = "Sound", w = (u.sound.src || "").split("/").pop() || "(none)") : y ? (b = "Stop Sound", w = u.stopSound || "(no id)") : (b = "Step", w = `${((C = u.tweens) == null ? void 0 : C.length) ?? 0} tweens`), { branchEntryIndex: d, isDelay: f, isAwait: h, isEmit: m, isSound: g, isStopSound: y, isStep: v, label: b, sub: w };
    })
  }));
  return {
    type: "parallel",
    isParallel: !0,
    branchCount: ((s = n.branches) == null ? void 0 : s.length) ?? 0,
    join: i,
    overflow: r,
    joinIsAll: i === "all",
    joinIsAny: i === "any",
    overflowIsDetach: r === "detach",
    overflowIsCancel: r === "cancel",
    branches: o
  };
}
c(kv, "buildParallelDetail");
function Av(t, e, n, i) {
  const r = iu(), o = (t.tweens ?? []).map((l, u) => {
    const d = `${e}.tweens.${u}`, f = n.has(d), h = l.type ?? "tile-prop", m = dd.find((b) => b.value === h), g = Hh[h], y = (g == null ? void 0 : g.form) ?? "prop", v = l.mode ?? "oklch";
    return {
      tweenIndex: u,
      isExpanded: f,
      type: h,
      typeLabel: (m == null ? void 0 : m.label) ?? l.type ?? "Tile Prop",
      target: l.target ?? "",
      attribute: l.attribute ?? "",
      attributePlaceholder: (g == null ? void 0 : g.placeholder) ?? "",
      value: l.value ?? "",
      easing: l.easing ?? "",
      // Form group flags
      formGroup: y,
      formIsProp: y === "prop",
      formIsParticles: y === "particles",
      formIsCamera: y === "camera",
      formIsLightColor: y === "lightColor",
      formIsLightState: y === "lightState",
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
      typeOptions: dd.map((b) => ({
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
  }), s = Object.keys(t.before ?? {}), a = Object.keys(t.after ?? {});
  return {
    type: "step",
    isStep: !0,
    isDelay: !1,
    stepNumber: Ev(e, i),
    stepDuration: t.duration ?? 1e3,
    tweens: o,
    beforeSummary: s.length ? `${s.length} target${s.length !== 1 ? "s" : ""}` : "(none)",
    afterSummary: a.length ? `${a.length} target${a.length !== 1 ? "s" : ""}` : "(none)"
  };
}
c(Av, "buildStepDetail");
function Mv(t, { state: e, expandedTweens: n }) {
  const i = ti(t);
  if (!i) return null;
  if (i.type === "setup") return Sv(e);
  if (i.type === "landing") return Cv(e);
  const r = ks(t, e);
  return r ? r.delay != null ? Tv(r) : r.emit != null ? Lv(r) : r.sound != null ? Iv(r) : r.stopSound != null ? Ov(r) : r.parallel != null && i.type === "timeline" ? kv(r) : Av(r, t, n, e) : null;
}
c(Mv, "buildDetail");
function xv({ state: t, mutate: e }) {
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
          var r, o, s, a;
          const i = n.find("#cinematic-import-json").val();
          try {
            const l = JSON.parse(i);
            if (typeof l != "object" || l === null || Array.isArray(l))
              throw new Error("Expected a JSON object");
            if (l.cinematics)
              e(() => new nn(l));
            else if (l.segments !== void 0) {
              const u = { version: 4, cinematics: { [t.activeCinematicName]: l } };
              e(() => new nn(u, { cinematicName: t.activeCinematicName }));
            } else if (l.timeline !== void 0) {
              const u = { version: 3, cinematics: { [t.activeCinematicName]: l } };
              e(() => new nn(u, { cinematicName: t.activeCinematicName }));
            } else
              throw new Error("Expected v3/v4 wrapper or single cinematic with 'segments' or 'timeline'");
            (o = (r = ui.notifications) == null ? void 0 : r.info) == null || o.call(r, "Cinematic JSON imported.");
          } catch (l) {
            (a = (s = ui.notifications) == null ? void 0 : s.error) == null || a.call(s, `Import failed: ${l.message}`);
          }
        }, "callback")
      },
      cancel: { label: "Cancel" }
    },
    default: "import"
  }).render(!0);
}
c(xv, "showImportDialog");
function As(t, { state: e, mutate: n }) {
  const i = t === "setup" ? e.setup : e.landing, r = JSON.stringify(i ?? {}, null, 2);
  new Dialog({
    title: `Edit ${t.charAt(0).toUpperCase() + t.slice(1)}`,
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON map of target selector → property overrides:</p>
			<textarea id="cinematic-json-edit" style="width:100%;height:200px;font-family:monospace;font-size:0.8rem">${Bt(r)}</textarea>
		`,
    buttons: {
      save: {
        label: "Apply",
        callback: /* @__PURE__ */ c((o) => {
          var a, l;
          const s = o.find("#cinematic-json-edit").val();
          try {
            const u = JSON.parse(s);
            n(t === "setup" ? (d) => d.setSetup(u) : (d) => d.setLanding(u));
          } catch (u) {
            (l = (a = ui.notifications) == null ? void 0 : a.error) == null || l.call(a, `Invalid JSON: ${u.message}`);
          }
        }, "callback")
      },
      cancel: { label: "Cancel" }
    },
    default: "save"
  }).render(!0);
}
c(As, "showEditJsonDialog");
function vd(t, { selectedPath: e, state: n, mutate: i }) {
  const r = ks(e, n);
  if (!r || r.delay != null) return;
  const o = r[t] ?? {}, s = JSON.stringify(o, null, 2);
  new Dialog({
    title: `Edit Step ${t.charAt(0).toUpperCase() + t.slice(1)}`,
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON map of target selector → property overrides:</p>
			<textarea id="cinematic-json-edit" style="width:100%;height:200px;font-family:monospace;font-size:0.8rem">${Bt(s)}</textarea>
		`,
    buttons: {
      save: {
        label: "Apply",
        callback: /* @__PURE__ */ c((a) => {
          var u, d;
          const l = a.find("#cinematic-json-edit").val();
          try {
            const f = JSON.parse(l), h = ti(e);
            (h == null ? void 0 : h.type) === "timeline" ? i((m) => m.updateEntry(h.index, { [t]: f })) : (h == null ? void 0 : h.type) === "branch" && i((m) => m.updateBranchEntry(h.index, h.branchIndex, h.branchEntryIndex, { [t]: f }));
          } catch (f) {
            (d = (u = ui.notifications) == null ? void 0 : u.error) == null || d.call(u, `Invalid JSON: ${f.message}`);
          }
        }, "callback")
      },
      cancel: { label: "Cancel" }
    },
    default: "save"
  }).render(!0);
}
c(vd, "showEditStepStateDialog");
function _v({ selectedPath: t, state: e, mutate: n }) {
  const i = ti(t);
  if (!i || i.type !== "timeline") return;
  const r = e.timeline[i.index];
  if (!(r != null && r.parallel)) return;
  const o = JSON.stringify(r.parallel.branches ?? [], null, 2);
  new Dialog({
    title: "Edit Parallel Branches",
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON array of branch timelines:</p>
			<textarea id="cinematic-json-edit" style="width:100%;height:250px;font-family:monospace;font-size:0.8rem">${Bt(o)}</textarea>
		`,
    buttons: {
      save: {
        label: "Apply",
        callback: /* @__PURE__ */ c((s) => {
          var l, u;
          const a = s.find("#cinematic-json-edit").val();
          try {
            const d = JSON.parse(a);
            if (!Array.isArray(d)) throw new Error("Expected an array of branches");
            n((f) => f.updateEntry(i.index, {
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
c(_v, "showEditParallelJsonDialog");
var Ud, Hn, Qn, rs, Uh;
const kt = class kt extends sn(on) {
  constructor(n = {}) {
    super(n);
    A(this, Qn);
    A(this, Hn, null);
    I(this, Hn, n.scene ?? canvas.scene ?? null);
  }
  async _prepareContext() {
    var r, o, s;
    const n = p(this, Qn, rs), i = ((o = n == null ? void 0 : n.getSeenStatus) == null ? void 0 : o.call(n, (r = p(this, Hn)) == null ? void 0 : r.id)) ?? [];
    return {
      sceneName: ((s = p(this, Hn)) == null ? void 0 : s.name) ?? "No scene",
      users: i.map((a) => ({
        ...a,
        statusLabel: a.seen ? "Seen" : "Not seen",
        statusClass: a.seen ? "cinematic-tracking__status--seen" : "cinematic-tracking__status--unseen"
      })),
      hasAnyTracked: i.some((a) => a.seen)
    };
  }
  _onRender(n, i) {
    super._onRender(n, i), T(this, Qn, Uh).call(this);
  }
};
Hn = new WeakMap(), Qn = new WeakSet(), rs = /* @__PURE__ */ c(function() {
  var n, i;
  return (i = (n = game.modules.get(L)) == null ? void 0 : n.api) == null ? void 0 : i.cinematic;
}, "#api"), Uh = /* @__PURE__ */ c(function() {
  var i, r;
  const n = this.element;
  n instanceof HTMLElement && (n.querySelectorAll("[data-action='reset-user']").forEach((o) => {
    o.addEventListener("click", async () => {
      var l;
      const s = o.dataset.userId;
      if (!s) return;
      const a = p(this, Qn, rs);
      a != null && a.resetForUser && (await a.resetForUser((l = p(this, Hn)) == null ? void 0 : l.id, s), this.render({ force: !0 }));
    });
  }), (i = n.querySelector("[data-action='reset-all']")) == null || i.addEventListener("click", async () => {
    var s;
    const o = p(this, Qn, rs);
    o != null && o.resetForAll && (await o.resetForAll((s = p(this, Hn)) == null ? void 0 : s.id), this.render({ force: !0 }));
  }), (r = n.querySelector("[data-action='refresh']")) == null || r.addEventListener("click", () => {
    this.render({ force: !0 });
  }));
}, "#bindEvents"), c(kt, "CinematicTrackingApplication"), ue(kt, "APP_ID", `${L}-cinematic-tracking`), ue(kt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Le(kt, kt, "DEFAULT_OPTIONS"),
  {
    id: kt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Ud = Le(kt, kt, "DEFAULT_OPTIONS")) == null ? void 0 : Ud.classes) ?? [], "eidolon-cinematic-tracking-window", "themed"])
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
)), ue(kt, "PARTS", {
  content: {
    template: `modules/${L}/templates/cinematic-tracking.html`
  }
});
let Ec = kt;
function Nv(t, e) {
  var n, i, r, o, s, a, l, u, d;
  (n = t.querySelector("[data-action='save']")) == null || n.addEventListener("click", () => e.save()), (i = t.querySelector("[data-action='play-preview']")) == null || i.addEventListener("click", () => e.play()), (r = t.querySelector("[data-action='reset-tracking']")) == null || r.addEventListener("click", () => e.resetTracking()), (o = t.querySelector("[data-action='export-json']")) == null || o.addEventListener("click", () => e.exportJSON()), (s = t.querySelector("[data-action='undo']")) == null || s.addEventListener("click", () => e.undo()), (a = t.querySelector("[data-action='redo']")) == null || a.addEventListener("click", () => e.redo()), (l = t.querySelector("[data-action='validate']")) == null || l.addEventListener("click", () => e.validate()), (u = t.querySelector("[data-action='import-json']")) == null || u.addEventListener("click", () => e.importJSON()), (d = t.querySelector("[data-action='open-tracking']")) == null || d.addEventListener("click", () => {
    new Ec({ scene: e.scene }).render(!0);
  });
}
c(Nv, "bindToolbarEvents");
function $v(t, e) {
  var n, i, r, o;
  (n = t.querySelector("[data-action='change-cinematic']")) == null || n.addEventListener("change", (s) => {
    e.flushTweenChanges(), e.switchCinematic(s.target.value);
  }), (i = t.querySelector("[data-action='add-cinematic']")) == null || i.addEventListener("click", () => {
    new Dialog({
      title: "New Cinematic",
      content: '<label style="display:flex;align-items:center;gap:0.5rem"><span>Name:</span><input id="cinematic-new-name" type="text" style="flex:1" placeholder="intro" /></label>',
      buttons: {
        ok: {
          label: "Create",
          callback: /* @__PURE__ */ c((s) => {
            var l, u, d, f, h, m, g;
            const a = (l = s.find("#cinematic-new-name").val()) == null ? void 0 : l.trim();
            if (!a) {
              (d = (u = ui.notifications) == null ? void 0 : u.warn) == null || d.call(u, "Name cannot be empty.");
              return;
            }
            if (/[.\s]/.test(a)) {
              (h = (f = ui.notifications) == null ? void 0 : f.warn) == null || h.call(f, "Name cannot contain dots or spaces.");
              return;
            }
            if (e.state.listCinematicNames().includes(a)) {
              (g = (m = ui.notifications) == null ? void 0 : m.warn) == null || g.call(m, "Name already exists.");
              return;
            }
            e.mutate((y) => y.addCinematic(a));
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
    const a = e.state.activeCinematicName;
    new Dialog({
      title: "Remove Cinematic",
      content: `<p>Remove cinematic "${a}"? This cannot be undone after saving.</p>`,
      buttons: {
        ok: {
          label: "Remove",
          callback: /* @__PURE__ */ c(() => {
            e.setSelectedPath(null), e.mutate((d) => d.removeCinematic(a));
          }, "callback")
        },
        cancel: { label: "Cancel" }
      },
      default: "cancel"
    }).render(!0);
  }), (o = t.querySelector("[data-action='rename-cinematic']")) == null || o.addEventListener("click", () => {
    const s = e.state.activeCinematicName;
    new Dialog({
      title: "Rename Cinematic",
      content: `<label style="display:flex;align-items:center;gap:0.5rem"><span>Name:</span><input id="cinematic-rename" type="text" style="flex:1" value="${Bt(s)}" /></label>`,
      buttons: {
        ok: {
          label: "Rename",
          callback: /* @__PURE__ */ c((a) => {
            var u, d, f, h, m, g, y;
            const l = (u = a.find("#cinematic-rename").val()) == null ? void 0 : u.trim();
            if (!l) {
              (f = (d = ui.notifications) == null ? void 0 : d.warn) == null || f.call(d, "Name cannot be empty.");
              return;
            }
            if (/[.\s]/.test(l)) {
              (m = (h = ui.notifications) == null ? void 0 : h.warn) == null || m.call(h, "Name cannot contain dots or spaces.");
              return;
            }
            if (l !== s) {
              if (e.state.listCinematicNames().includes(l)) {
                (y = (g = ui.notifications) == null ? void 0 : g.warn) == null || y.call(g, "Name already exists.");
                return;
              }
              e.mutate((v) => v.renameCinematic(s, l));
            }
          }, "callback")
        },
        cancel: { label: "Cancel" }
      },
      default: "ok"
    }).render(!0);
  });
}
c($v, "bindCinematicSelectorEvents");
function Fv(t, e) {
  t.querySelectorAll("[data-action='select-block']").forEach((i) => {
    i.addEventListener("click", (r) => {
      if (r.target.closest("button")) return;
      const o = i.dataset.entryPath;
      e.setSelectedPath(e.selectedPath === o ? null : o);
    });
  });
  let n = null;
  t.querySelectorAll(".cinematic-editor__lane--main [data-action='select-block']").forEach((i) => {
    const r = i.dataset.entryPath;
    r === "setup" || r === "landing" || (i.addEventListener("dragstart", (o) => {
      n = r, i.classList.add("dragging"), o.dataTransfer.effectAllowed = "move";
    }), i.addEventListener("dragover", (o) => {
      o.preventDefault(), o.dataTransfer.dropEffect = "move";
    }), i.addEventListener("dragenter", (o) => {
      o.preventDefault(), i.classList.add("cinematic-editor__block--drag-over");
    }), i.addEventListener("dragleave", () => {
      i.classList.remove("cinematic-editor__block--drag-over");
    }), i.addEventListener("drop", (o) => {
      o.preventDefault(), i.classList.remove("cinematic-editor__block--drag-over");
      const s = i.dataset.entryPath;
      if (n && n !== s) {
        const a = bd(n), l = bd(s);
        a != null && l != null && (e.selectedPath === n && e.setSelectedPath(s), e.mutate((u) => u.moveEntry(a, l)));
      }
      n = null;
    }), i.addEventListener("dragend", () => {
      i.classList.remove("dragging"), n = null;
    }));
  }), t.querySelectorAll("[data-action='show-insert-menu']").forEach((i) => {
    i.addEventListener("click", (r) => {
      r.stopPropagation();
      const o = Number(i.dataset.insertIndex), s = i.dataset.lane;
      e.showInsertMenu(i, o, s);
    });
  }), t.querySelectorAll("[data-action='insert-entry']").forEach((i) => {
    i.addEventListener("click", () => {
      if (!e.insertMenuState) return;
      const r = i.dataset.insertType, { insertIndex: o } = e.insertMenuState;
      switch (r) {
        case "step":
          e.mutate((s) => s.addStep(o));
          break;
        case "delay":
          e.mutate((s) => s.addDelay(o));
          break;
        case "emit":
          e.mutate((s) => s.addEmit(o));
          break;
        case "parallel":
          e.mutate((s) => s.addParallel(o));
          break;
        case "sound":
          e.mutate((s) => s.addSound(o));
          break;
        case "stopSound":
          e.mutate((s) => s.addStopSound(o));
          break;
      }
      e.hideInsertMenu();
    });
  }), document.addEventListener("click", (i) => {
    e.insertMenuState && !i.target.closest(".cinematic-editor__insert-menu") && !i.target.closest("[data-action='show-insert-menu']") && e.hideInsertMenu();
  });
}
c(Fv, "bindSwimlaneEvents");
function Dv(t, e) {
  var n, i, r, o, s, a, l, u, d, f, h;
  (n = t.querySelector("[data-action='delete-entry']")) == null || n.addEventListener("click", () => {
    const m = e.parseEntryPath(e.selectedPath);
    m && (m.type === "timeline" ? (e.mutate((g) => g.removeEntry(m.index)), e.setSelectedPath(null)) : m.type === "branch" && (e.mutate((g) => g.removeBranchEntry(m.index, m.branchIndex, m.branchEntryIndex)), e.setSelectedPath(null)));
  }), (i = t.querySelector("[data-action='step-duration']")) == null || i.addEventListener("input", (m) => {
    const g = e.parseEntryPath(e.selectedPath);
    if (!g) return;
    const y = Number(m.target.value) || 0;
    g.type === "timeline" ? e.mutate((v) => v.updateStepDuration(g.index, y)) : g.type === "branch" && e.mutate((v) => v.updateBranchEntry(g.index, g.branchIndex, g.branchEntryIndex, { duration: Math.max(0, y) }));
  }), (r = t.querySelector("[data-action='add-tween']")) == null || r.addEventListener("click", () => {
    const m = e.parseEntryPath(e.selectedPath);
    if (m) {
      if (m.type === "timeline")
        e.mutate((g) => g.addTween(m.index));
      else if (m.type === "branch") {
        const g = e.getEntryAtPath(e.selectedPath);
        if (!g) return;
        const y = { type: "tile-prop", target: "", attribute: "alpha", value: 1 }, v = [...g.tweens ?? [], y];
        e.mutate((b) => b.updateBranchEntry(m.index, m.branchIndex, m.branchEntryIndex, { tweens: v }));
      }
    }
  }), (o = t.querySelector("[data-action='change-delay']")) == null || o.addEventListener("change", (m) => {
    const g = e.parseEntryPath(e.selectedPath);
    if (!g) return;
    const y = Number(m.target.value) || 0;
    g.type === "timeline" ? e.mutate((v) => v.updateEntry(g.index, { delay: y })) : g.type === "branch" && e.mutate((v) => v.updateBranchEntry(g.index, g.branchIndex, g.branchEntryIndex, { delay: y }));
  }), (s = t.querySelector("[data-action='edit-setup']")) == null || s.addEventListener("click", () => {
    As("setup", { state: e.state, mutate: e.mutate });
  }), (a = t.querySelector("[data-action='edit-landing']")) == null || a.addEventListener("click", () => {
    As("landing", { state: e.state, mutate: e.mutate });
  }), (l = t.querySelector("[data-action='edit-before']")) == null || l.addEventListener("click", () => {
    vd("before", { selectedPath: e.selectedPath, state: e.state, mutate: e.mutate });
  }), (u = t.querySelector("[data-action='edit-after']")) == null || u.addEventListener("click", () => {
    vd("after", { selectedPath: e.selectedPath, state: e.state, mutate: e.mutate });
  }), (d = t.querySelector("[data-action='change-trigger']")) == null || d.addEventListener("change", (m) => {
    e.mutate((g) => g.setTrigger(m.target.value));
  }), (f = t.querySelector("[data-action='change-tracking']")) == null || f.addEventListener("change", (m) => {
    e.mutate((g) => g.setTracking(m.target.checked));
  }), (h = t.querySelector("[data-action='change-synchronized']")) == null || h.addEventListener("change", (m) => {
    e.mutate((g) => g.setSynchronized(m.target.checked));
  });
}
c(Dv, "bindDetailPanelEvents");
const fr = /* @__PURE__ */ new WeakMap(), Ms = /* @__PURE__ */ new Set(), xs = /* @__PURE__ */ new Set(), wd = {
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
function _s(t, e = {}) {
  var g, y, v;
  if (!t) return !1;
  hr(t);
  const n = e.mode ?? (e.color != null ? "custom" : "hover"), i = wd[n] ?? wd.hover, r = e.color ?? i.borderColor, o = e.alpha ?? i.borderAlpha, s = e.color ?? i.spriteTint, a = i.spriteAlpha, l = e.pulse ?? i.pulse, u = { border: null, sprite: null, pulseData: null, mode: n }, d = ((g = t.document) == null ? void 0 : g.width) ?? t.w ?? 100, f = ((y = t.document) == null ? void 0 : y.height) ?? t.h ?? 100, h = new PIXI.Graphics();
  h.lineStyle(i.borderWidth, r, o), h.drawRect(0, 0, d, f), t.addChild(h), u.border = h;
  const m = Pv(t, s, a);
  if (m && (canvas.controls.debug.addChild(m), xs.add(m), u.sprite = m), l && ((v = canvas.app) != null && v.ticker)) {
    const b = {
      elapsed: 0,
      fn: /* @__PURE__ */ c((w) => {
        b.elapsed += w;
        const E = (Math.sin(b.elapsed * 0.05) + 1) / 2;
        u.border && (u.border.alpha = o * (0.4 + 0.6 * E)), u.sprite && (u.sprite.alpha = a * (0.5 + 0.5 * E));
      }, "fn")
    };
    canvas.app.ticker.add(b.fn), u.pulseData = b, Ms.add(b);
  }
  return fr.set(t, u), !0;
}
c(_s, "addHighlight");
function hr(t) {
  var n, i;
  if (!t) return;
  const e = fr.get(t);
  e && (e.pulseData && ((i = (n = canvas.app) == null ? void 0 : n.ticker) == null || i.remove(e.pulseData.fn), Ms.delete(e.pulseData)), e.border && (e.border.parent && e.border.parent.removeChild(e.border), e.border.destroy({ children: !0 })), e.sprite && (e.sprite.parent && e.sprite.parent.removeChild(e.sprite), e.sprite.destroy({ children: !0 }), xs.delete(e.sprite)), fr.delete(t));
}
c(hr, "removeHighlight");
function Vh(t) {
  return fr.has(t);
}
c(Vh, "hasHighlight");
function os() {
  var e, n, i, r, o, s, a;
  for (const l of Ms)
    (n = (e = canvas.app) == null ? void 0 : e.ticker) == null || n.remove(l.fn);
  Ms.clear();
  for (const l of xs)
    l.parent && l.parent.removeChild(l), l.destroy({ children: !0 });
  xs.clear();
  const t = [
    (i = canvas.tiles) == null ? void 0 : i.placeables,
    (r = canvas.tokens) == null ? void 0 : r.placeables,
    (o = canvas.lighting) == null ? void 0 : o.placeables,
    (s = canvas.drawings) == null ? void 0 : s.placeables,
    (a = canvas.sounds) == null ? void 0 : a.placeables
  ];
  for (const l of t)
    if (l)
      for (const u of l) {
        const d = fr.get(u);
        d && (d.border && (d.border.parent && d.border.parent.removeChild(d.border), d.border.destroy({ children: !0 })), fr.delete(u));
      }
}
c(os, "clearAllHighlights");
function Pv(t, e, n) {
  var o;
  const i = t.mesh;
  if (!((o = i == null ? void 0 : i.texture) != null && o.baseTexture)) return null;
  const r = PIXI.Sprite.from(i.texture);
  return r.isSprite = !0, r.anchor.set(i.anchor.x, i.anchor.y), r.width = i.width, r.height = i.height, r.scale = i.scale, r.position = t.center, r.angle = i.angle, r.alpha = n, r.tint = e, r.name = "eidolonPickerHighlight", r;
}
c(Pv, "createTintSprite");
let gi = null;
function Gh(t) {
  var g, y, v;
  gi && gi.cancel();
  const { placeableType: e = "Tile", onPick: n, onCancel: i } = t;
  let r = null;
  const o = `control${e}`, s = `hover${e}`, a = /* @__PURE__ */ c((b, w) => {
    var C;
    if (!w) return;
    const E = b.document ?? b;
    (C = b.release) == null || C.call(b), n(E);
  }, "onControl"), l = /* @__PURE__ */ c((b, w) => {
    w ? (r = b, _s(b, { mode: "pick" })) : r === b && (hr(b), r = null);
  }, "onHoverIn"), u = /* @__PURE__ */ c((b) => {
    b.key === "Escape" && (b.preventDefault(), b.stopPropagation(), m());
  }, "onKeydown"), d = /* @__PURE__ */ c((b) => {
    b.preventDefault(), m();
  }, "onContextMenu"), f = Hooks.on(o, a), h = Hooks.on(s, l);
  document.addEventListener("keydown", u, { capture: !0 }), (g = canvas.stage) == null || g.addEventListener("rightclick", d), (v = (y = ui.notifications) == null ? void 0 : y.info) == null || v.call(y, `Pick mode active — click a ${e.toLowerCase()} on the canvas, or press ESC to cancel.`, { permanent: !1 });
  function m() {
    var b;
    gi && (gi = null, Hooks.off(o, f), Hooks.off(s, h), document.removeEventListener("keydown", u, { capture: !0 }), (b = canvas.stage) == null || b.removeEventListener("rightclick", d), r && (hr(r), r = null), i == null || i());
  }
  return c(m, "cancel"), gi = { cancel: m }, { cancel: m };
}
c(Gh, "enterPickMode");
function Fr() {
  gi && gi.cancel();
}
c(Fr, "cancelPickMode");
const Rv = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cancelPickMode: Fr,
  enterPickMode: Gh
}, Symbol.toStringTag, { value: "Module" }));
var Vd, $e, ze, So, qn, Co, To, nt, Bn, ge, Wh, Sc, zh, Yh, Kh, Cc, Tc, Xh, Jh;
const mt = class mt extends sn(on) {
  /**
   * @param {object} options
   * @param {string[]} [options.selections]  Initial selections
   * @param {string} [options.placeableType]  "Tile", "Token", etc.
   * @param {(selectors: string[]) => void} [options.onApply]
   * @param {() => void} [options.onCancel]
   */
  constructor(n = {}) {
    super(n);
    A(this, ge);
    /** @type {string[]} Current selections (selector strings). */
    A(this, $e, []);
    /** @type {boolean} Whether pick mode is active. */
    A(this, ze, !1);
    /** @type {string} Placeable type (Tile, Token, etc.). */
    A(this, So, "Tile");
    /** @type {string} Current tag match mode. */
    A(this, qn, "any");
    /** @type {((selectors: string[]) => void) | null} */
    A(this, Co, null);
    /** @type {(() => void) | null} */
    A(this, To, null);
    /** @type {Promise resolve function for the open() API. */
    A(this, nt, null);
    /** @type {PlaceableObject | null} Currently hovered tile in the browser. */
    A(this, Bn, null);
    I(this, $e, [...n.selections ?? []]), I(this, So, n.placeableType ?? "Tile"), I(this, Co, n.onApply ?? null), I(this, To, n.onCancel ?? null);
  }
  // ── Context ───────────────────────────────────────────────────────────
  async _prepareContext() {
    var r;
    const n = T(this, ge, Cc).call(this), i = (((r = canvas.tiles) == null ? void 0 : r.placeables) ?? []).map((o, s) => {
      var d, f;
      const a = o.document, l = a.id, u = (d = a.texture) != null && d.src ? a.texture.src.split("/").pop().replace(/\.[^.]+$/, "") : `Tile ${s + 1}`;
      return {
        id: l,
        name: u.length > 20 ? u.slice(0, 18) + "..." : u,
        thumbnailSrc: ((f = a.texture) == null ? void 0 : f.src) ?? null,
        selected: n.has(l)
      };
    });
    return {
      selections: p(this, $e),
      selectionCount: p(this, $e).length,
      pickModeActive: p(this, ze),
      tagModeIsAny: p(this, qn) === "any",
      tagModeIsAll: p(this, qn) === "all",
      tagPreviewCount: 0,
      tiles: i,
      tileCount: i.length
    };
  }
  // ── Render & Events ───────────────────────────────────────────────────
  _onRender(n, i) {
    super._onRender(n, i), T(this, ge, Wh).call(this), T(this, ge, Tc).call(this);
  }
  async _onClose(n) {
    return p(this, ze) && (Fr(), I(this, ze, !1)), os(), p(this, nt) && (p(this, nt).call(this, null), I(this, nt, null)), super._onClose(n);
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
      const r = new mt({
        ...n,
        onApply: /* @__PURE__ */ c((o) => i(o), "onApply"),
        onCancel: /* @__PURE__ */ c(() => i(null), "onCancel")
      });
      I(r, nt, i), r.render(!0);
    });
  }
};
$e = new WeakMap(), ze = new WeakMap(), So = new WeakMap(), qn = new WeakMap(), Co = new WeakMap(), To = new WeakMap(), nt = new WeakMap(), Bn = new WeakMap(), ge = new WeakSet(), Wh = /* @__PURE__ */ c(function() {
  var o, s, a, l;
  const n = this.element;
  if (!(n instanceof HTMLElement)) return;
  const i = n.querySelector("[data-role='tag-input']"), r = n.querySelector("[data-role='tag-mode']");
  r == null || r.addEventListener("change", (u) => {
    I(this, qn, u.target.value);
  }), i == null || i.addEventListener("input", () => {
    T(this, ge, zh).call(this, n);
  }), i == null || i.addEventListener("keydown", (u) => {
    u.key === "Enter" && (u.preventDefault(), T(this, ge, Sc).call(this, n));
  }), (o = n.querySelector("[data-action='add-tag-selector']")) == null || o.addEventListener("click", () => {
    T(this, ge, Sc).call(this, n);
  }), (s = n.querySelector("[data-action='toggle-pick-mode']")) == null || s.addEventListener("click", () => {
    p(this, ze) ? (Fr(), I(this, ze, !1)) : (I(this, ze, !0), Gh({
      placeableType: p(this, So),
      onPick: /* @__PURE__ */ c((u) => {
        T(this, ge, Yh).call(this, u.id);
      }, "onPick"),
      onCancel: /* @__PURE__ */ c(() => {
        I(this, ze, !1), this.render({ force: !0 });
      }, "onCancel")
    })), this.render({ force: !0 });
  }), n.querySelectorAll("[data-action='toggle-tile']").forEach((u) => {
    u.addEventListener("click", () => {
      const d = u.dataset.docId;
      d && T(this, ge, Kh).call(this, d);
    }), u.addEventListener("mouseenter", () => {
      var h, m;
      const d = u.dataset.docId;
      if (!d) return;
      const f = (m = (h = canvas.tiles) == null ? void 0 : h.placeables) == null ? void 0 : m.find((g) => g.document.id === d);
      f && (I(this, Bn, f), _s(f, { mode: "hover" }));
    }), u.addEventListener("mouseleave", () => {
      p(this, Bn) && (hr(p(this, Bn)), I(this, Bn, null), T(this, ge, Tc).call(this));
    });
  }), n.querySelectorAll("[data-action='remove-selection']").forEach((u) => {
    u.addEventListener("click", () => {
      const d = Number(u.dataset.selectionIndex);
      Number.isNaN(d) || (p(this, $e).splice(d, 1), this.render({ force: !0 }));
    });
  }), (a = n.querySelector("[data-action='apply']")) == null || a.addEventListener("click", () => {
    T(this, ge, Xh).call(this);
  }), (l = n.querySelector("[data-action='cancel']")) == null || l.addEventListener("click", () => {
    T(this, ge, Jh).call(this);
  });
}, "#bindEvents"), // ── Tag helpers ───────────────────────────────────────────────────────
Sc = /* @__PURE__ */ c(function(n) {
  var a;
  const i = n.querySelector("[data-role='tag-input']"), r = (a = i == null ? void 0 : i.value) == null ? void 0 : a.trim();
  if (!r) return;
  const o = r.split(",").map((l) => l.trim()).filter(Boolean);
  if (o.length === 0) return;
  const s = Nh(o, p(this, qn));
  s && !p(this, $e).includes(s) && p(this, $e).push(s), i && (i.value = ""), this.render({ force: !0 });
}, "#addTagSelector"), zh = /* @__PURE__ */ c(function(n) {
  var f, h;
  const i = n.querySelector("[data-role='tag-input']"), r = n.querySelector("[data-role='tag-preview']");
  if (!i || !r) return;
  const o = i.value.trim();
  if (!o) {
    r.textContent = "";
    return;
  }
  const s = o.split(",").map((m) => m.trim()).filter(Boolean);
  if (s.length === 0) {
    r.textContent = "";
    return;
  }
  const a = window.Tagger ?? ((f = game.modules.get("tagger")) == null ? void 0 : f.api);
  if (!a) {
    r.textContent = "Tagger not available";
    return;
  }
  const l = p(this, qn) === "any", u = a.getByTag(s, {
    sceneId: (h = canvas.scene) == null ? void 0 : h.id,
    matchAny: l
  }), d = (u == null ? void 0 : u.length) ?? 0;
  r.textContent = `${d} matching placeable(s)`;
}, "#updateTagPreview"), // ── ID selector helpers ──────────────────────────────────────────────
Yh = /* @__PURE__ */ c(function(n) {
  const i = `id:${n}`;
  p(this, $e).includes(i) || (p(this, $e).push(i), this.render({ force: !0 }));
}, "#addIdSelector"), Kh = /* @__PURE__ */ c(function(n) {
  const i = `id:${n}`, r = p(this, $e).indexOf(i);
  r >= 0 ? p(this, $e).splice(r, 1) : p(this, $e).push(i), this.render({ force: !0 });
}, "#toggleIdSelector"), /**
 * Get the set of document IDs that are currently selected across all selector types.
 * Resolves tag/tags-any/tags-all selectors to find matching document IDs.
 * @returns {Set<string>}
 */
Cc = /* @__PURE__ */ c(function() {
  const n = /* @__PURE__ */ new Set();
  for (const i of p(this, $e)) {
    const r = au(i);
    if (r.type === "id") {
      n.add(r.value);
      continue;
    }
    const o = Na(i);
    if (o != null && o.placeables)
      for (const { doc: s } of o.placeables)
        s != null && s.id && n.add(s.id);
  }
  return n;
}, "#getSelectedIds"), // ── Canvas selection highlights ──────────────────────────────────────
/**
 * Maintain "selected" highlights on canvas tiles that are in the selection list.
 * Clears stale highlights and adds missing ones (skipping the hovered tile).
 */
Tc = /* @__PURE__ */ c(function() {
  var r, o;
  const n = T(this, ge, Cc).call(this), i = ((r = canvas.tiles) == null ? void 0 : r.placeables) ?? [];
  for (const s of i) {
    const a = (o = s.document) == null ? void 0 : o.id;
    if (!a) continue;
    const l = n.has(a), u = s === p(this, Bn), d = Vh(s);
    l && !u && !d ? _s(s, { mode: "selected" }) : !l && d && !u && hr(s);
  }
}, "#refreshSelectionHighlights"), // ── Apply / Cancel ──────────────────────────────────────────────────
Xh = /* @__PURE__ */ c(function() {
  var i;
  p(this, ze) && (Fr(), I(this, ze, !1)), os();
  const n = [...p(this, $e)];
  (i = p(this, Co)) == null || i.call(this, n), p(this, nt) && (p(this, nt).call(this, n), I(this, nt, null)), this.close({ force: !0 });
}, "#doApply"), Jh = /* @__PURE__ */ c(function() {
  var n;
  p(this, ze) && (Fr(), I(this, ze, !1)), os(), (n = p(this, To)) == null || n.call(this), p(this, nt) && (p(this, nt).call(this, null), I(this, nt, null)), this.close({ force: !0 });
}, "#doCancel"), c(mt, "PlaceablePickerApplication"), ue(mt, "APP_ID", `${L}-placeable-picker`), ue(mt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Le(mt, mt, "DEFAULT_OPTIONS"),
  {
    id: mt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Vd = Le(mt, mt, "DEFAULT_OPTIONS")) == null ? void 0 : Vd.classes) ?? [], "eidolon-placeable-picker-window", "themed"])
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
)), ue(mt, "PARTS", {
  content: {
    template: `modules/${L}/templates/placeable-picker.html`
  }
});
let Ns = mt;
function Hv(t, e) {
  t.querySelectorAll("[data-action='toggle-tween-card']").forEach((n) => {
    n.addEventListener("click", (i) => {
      if (i.target.closest("[data-action='delete-tween']")) return;
      const r = Number(n.dataset.tweenIndex), o = `${e.selectedPath}.tweens.${r}`;
      e.expandedTweens.has(o) ? e.expandedTweens.delete(o) : e.expandedTweens.add(o), e.render();
    });
  }), t.querySelectorAll("[data-action='pick-target']").forEach((n) => {
    n.addEventListener("click", async () => {
      var u, d;
      const i = Number(n.dataset.tweenIndex), r = e.parseEntryPath(e.selectedPath);
      if (!r || Number.isNaN(i)) return;
      const o = e.getEntryAtPath(e.selectedPath), s = ((d = (u = o == null ? void 0 : o.tweens) == null ? void 0 : u[i]) == null ? void 0 : d.target) ?? "", a = s ? [s] : [], l = await Ns.open({ selections: a });
      if (l && l.length > 0) {
        if (r.type === "timeline")
          e.mutate((f) => f.updateTween(r.index, i, { target: l[0] }));
        else if (r.type === "branch") {
          const f = (o.tweens ?? []).map((h, m) => m === i ? { ...h, target: l[0] } : h);
          e.mutate((h) => h.updateBranchEntry(r.index, r.branchIndex, r.branchEntryIndex, { tweens: f }));
        }
      }
    });
  }), t.querySelectorAll("[data-action='delete-tween']").forEach((n) => {
    n.addEventListener("click", () => {
      const i = Number(n.dataset.tweenIndex), r = e.parseEntryPath(e.selectedPath);
      if (!(!r || Number.isNaN(i))) {
        if (r.type === "timeline")
          e.mutate((o) => o.removeTween(r.index, i));
        else if (r.type === "branch") {
          const o = e.getEntryAtPath(e.selectedPath);
          if (!o) return;
          const s = (o.tweens ?? []).filter((a, l) => l !== i);
          e.mutate((a) => a.updateBranchEntry(r.index, r.branchIndex, r.branchEntryIndex, { tweens: s }));
        }
      }
    });
  }), t.querySelectorAll(".cinematic-editor__tween-card-body").forEach((n) => {
    const i = Number(n.dataset.tweenIndex);
    n.querySelectorAll("[data-field]").forEach((r) => {
      const o = r.dataset.field, s = r.tagName === "SELECT" || r.type === "checkbox" ? "change" : "input";
      r.addEventListener(s, () => {
        let a;
        if (r.type === "checkbox" ? a = r.checked : o === "x" || o === "y" || o === "scale" || o === "toAlpha" ? a = r.value.trim() === "" ? "" : Number(r.value) || 0 : o === "value" && !Number.isNaN(Number(r.value)) && r.value.trim() !== "" ? a = Number(r.value) : a = r.value, o === "type") {
          const l = Hh[a], u = { type: a };
          if (l) {
            const d = l.form ?? "prop";
            d === "prop" || d === "particles" ? Object.assign(u, { attribute: l.attribute, value: l.value }) : d === "camera" ? Object.assign(u, { x: l.x, y: l.y, scale: l.scale }) : d === "lightColor" ? Object.assign(u, { toColor: l.toColor, toAlpha: l.toAlpha, mode: l.mode }) : d === "lightState" && Object.assign(u, { enabled: l.enabled });
          }
          e.queueTweenChange(i, u), e.flushTweenChangesImmediate(), e.render();
        } else
          e.queueTweenChange(i, { [o]: a });
      });
    });
  });
}
c(Hv, "bindTweenFieldEvents");
function qv(t, e) {
  var i, r, o, s, a, l, u, d, f, h;
  function n(m, g, y) {
    m.type === "timeline" ? e.mutate((v) => v.updateEntry(m.index, { sound: y })) : m.type === "branch" && e.mutate((v) => v.updateBranchEntry(m.index, m.branchIndex, m.branchEntryIndex, { sound: y }));
  }
  c(n, "applySoundPatch"), (i = t.querySelector("[data-action='change-sound-src']")) == null || i.addEventListener("change", async (m) => {
    const g = e.parseEntryPath(e.selectedPath);
    if (!g) return;
    const y = e.getEntryAtPath(e.selectedPath);
    if (!(y != null && y.sound)) return;
    const v = m.target.value, b = { ...y.sound, src: v };
    b.id || (b.id = fd(v));
    const w = await hd(v);
    w > 0 && (b.duration = w), n(g, y, b);
  }), (r = t.querySelector("[data-action='pick-sound-src']")) == null || r.addEventListener("click", () => {
    const m = e.parseEntryPath(e.selectedPath);
    if (!m) return;
    const g = e.getEntryAtPath(e.selectedPath);
    if (!(g != null && g.sound)) return;
    new FilePicker({
      type: "audio",
      current: g.sound.src || "",
      callback: /* @__PURE__ */ c(async (v) => {
        const b = { ...g.sound, src: v };
        b.id || (b.id = fd(v));
        const w = await hd(v);
        w > 0 && (b.duration = w), n(m, g, b);
      }, "callback")
    }).render(!0);
  }), (o = t.querySelector("[data-action='change-sound-id']")) == null || o.addEventListener("change", (m) => {
    const g = e.parseEntryPath(e.selectedPath);
    if (!g) return;
    const y = e.getEntryAtPath(e.selectedPath);
    y != null && y.sound && n(g, y, { ...y.sound, id: m.target.value || void 0 });
  }), (s = t.querySelector("[data-action='change-sound-volume']")) == null || s.addEventListener("input", (m) => {
    const g = e.parseEntryPath(e.selectedPath);
    if (!g) return;
    const y = e.getEntryAtPath(e.selectedPath);
    y != null && y.sound && n(g, y, { ...y.sound, volume: Number(m.target.value) || 0.8 });
  }), (a = t.querySelector("[data-action='change-sound-loop']")) == null || a.addEventListener("change", (m) => {
    const g = e.parseEntryPath(e.selectedPath);
    if (!g) return;
    const y = e.getEntryAtPath(e.selectedPath);
    y != null && y.sound && n(g, y, { ...y.sound, loop: m.target.checked });
  }), (l = t.querySelector("[data-action='change-sound-fadein']")) == null || l.addEventListener("change", (m) => {
    const g = e.parseEntryPath(e.selectedPath);
    if (!g) return;
    const y = e.getEntryAtPath(e.selectedPath);
    y != null && y.sound && n(g, y, { ...y.sound, fadeIn: Number(m.target.value) || void 0 });
  }), (u = t.querySelector("[data-action='change-sound-fadeout']")) == null || u.addEventListener("change", (m) => {
    const g = e.parseEntryPath(e.selectedPath);
    if (!g) return;
    const y = e.getEntryAtPath(e.selectedPath);
    y != null && y.sound && n(g, y, { ...y.sound, fadeOut: Number(m.target.value) || void 0 });
  }), (d = t.querySelector("[data-action='change-sound-duration']")) == null || d.addEventListener("change", (m) => {
    const g = e.parseEntryPath(e.selectedPath);
    if (!g) return;
    const y = e.getEntryAtPath(e.selectedPath);
    y != null && y.sound && n(g, y, { ...y.sound, duration: Number(m.target.value) || 0 });
  }), (f = t.querySelector("[data-action='change-sound-fireandforget']")) == null || f.addEventListener("change", (m) => {
    const g = e.parseEntryPath(e.selectedPath);
    if (!g) return;
    const y = e.getEntryAtPath(e.selectedPath);
    y != null && y.sound && n(g, y, { ...y.sound, fireAndForget: m.target.checked });
  }), (h = t.querySelector("[data-action='change-stopsound-id']")) == null || h.addEventListener("change", (m) => {
    const g = e.parseEntryPath(e.selectedPath);
    g && (g.type === "timeline" ? e.mutate((y) => y.updateEntry(g.index, { stopSound: m.target.value })) : g.type === "branch" && e.mutate((y) => y.updateBranchEntry(g.index, g.branchIndex, g.branchEntryIndex, { stopSound: m.target.value })));
  });
}
c(qv, "bindSoundFieldEvents");
function Bv(t, e) {
  var n, i, r, o, s;
  (n = t.querySelector("[data-action='change-emit-signal']")) == null || n.addEventListener("change", (a) => {
    const l = e.parseEntryPath(e.selectedPath);
    l && l.type === "timeline" && e.mutate((u) => u.updateEntry(l.index, { emit: a.target.value }));
  }), (i = t.querySelector("[data-action='change-parallel-join']")) == null || i.addEventListener("change", (a) => {
    const l = e.parseEntryPath(e.selectedPath);
    if (!l || l.type !== "timeline") return;
    const u = e.state.timeline[l.index];
    u != null && u.parallel && e.mutate((d) => d.updateEntry(l.index, { parallel: { ...u.parallel, join: a.target.value } }));
  }), (r = t.querySelector("[data-action='change-parallel-overflow']")) == null || r.addEventListener("change", (a) => {
    const l = e.parseEntryPath(e.selectedPath);
    if (!l || l.type !== "timeline") return;
    const u = e.state.timeline[l.index];
    u != null && u.parallel && e.mutate((d) => d.updateEntry(l.index, { parallel: { ...u.parallel, overflow: a.target.value } }));
  }), (o = t.querySelector("[data-action='edit-parallel-json']")) == null || o.addEventListener("click", () => {
    _v({ selectedPath: e.selectedPath, state: e.state, mutate: e.mutate });
  }), (s = t.querySelector("[data-action='add-branch']")) == null || s.addEventListener("click", () => {
    const a = e.parseEntryPath(e.selectedPath);
    !a || a.type !== "timeline" || e.mutate((l) => l.addBranch(a.index));
  }), t.querySelectorAll("[data-action='remove-branch']").forEach((a) => {
    a.addEventListener("click", () => {
      const l = Number(a.dataset.branchIndex), u = e.parseEntryPath(e.selectedPath);
      !u || u.type !== "timeline" || Number.isNaN(l) || e.mutate((d) => d.removeBranch(u.index, l));
    });
  }), t.querySelectorAll("[data-action='add-branch-step']").forEach((a) => {
    a.addEventListener("click", () => {
      const l = Number(a.dataset.branchIndex), u = e.parseEntryPath(e.selectedPath);
      !u || u.type !== "timeline" || Number.isNaN(l) || e.mutate((d) => d.addBranchEntry(u.index, l, { tweens: [] }));
    });
  }), t.querySelectorAll("[data-action='add-branch-delay']").forEach((a) => {
    a.addEventListener("click", () => {
      const l = Number(a.dataset.branchIndex), u = e.parseEntryPath(e.selectedPath);
      !u || u.type !== "timeline" || Number.isNaN(l) || e.mutate((d) => d.addBranchEntry(u.index, l, { delay: 1e3 }));
    });
  }), t.querySelectorAll("[data-action='add-branch-sound']").forEach((a) => {
    a.addEventListener("click", () => {
      const l = Number(a.dataset.branchIndex), u = e.parseEntryPath(e.selectedPath);
      !u || u.type !== "timeline" || Number.isNaN(l) || e.mutate((d) => d.addBranchEntry(u.index, l, { sound: { src: "", volume: 0.8, loop: !1, duration: 0, fireAndForget: !1 } }));
    });
  }), t.querySelectorAll("[data-action='add-branch-stopSound']").forEach((a) => {
    a.addEventListener("click", () => {
      const l = Number(a.dataset.branchIndex), u = e.parseEntryPath(e.selectedPath);
      !u || u.type !== "timeline" || Number.isNaN(l) || e.mutate((d) => d.addBranchEntry(u.index, l, { stopSound: "" }));
    });
  }), t.querySelectorAll("[data-action='remove-branch-entry']").forEach((a) => {
    a.addEventListener("click", () => {
      const l = Number(a.dataset.branchIndex), u = Number(a.dataset.branchEntryIndex), d = e.parseEntryPath(e.selectedPath);
      !d || d.type !== "timeline" || Number.isNaN(l) || Number.isNaN(u) || e.mutate((f) => f.removeBranchEntry(d.index, l, u));
    });
  });
}
c(Bv, "bindSpecialEntryEvents");
function jv(t, e) {
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
            callback: /* @__PURE__ */ c((o) => {
              var s;
              return r((s = o.find("#seg-name").val()) == null ? void 0 : s.trim());
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
      const o = await new Promise((s) => {
        new Dialog({
          title: "Rename Segment",
          content: `<label style="font-size:0.82rem">New name:<input type="text" id="seg-name" value="${r}" style="width:100%;margin-top:0.3rem" /></label>`,
          buttons: {
            ok: {
              label: "Rename",
              callback: /* @__PURE__ */ c((a) => {
                var l;
                return s((l = a.find("#seg-name").val()) == null ? void 0 : l.trim());
              }, "callback")
            },
            cancel: { label: "Cancel", callback: /* @__PURE__ */ c(() => s(null), "callback") }
          },
          default: "ok",
          close: /* @__PURE__ */ c(() => s(null), "close")
        }).render(!0);
      });
      o && o !== r && e.renameSegment(r, o);
    });
  });
}
c(jv, "bindSegmentGraphEvents");
function Uv(t, e) {
  var n, i, r, o, s, a, l;
  (n = t.querySelector("[data-action='change-gate-event']")) == null || n.addEventListener("change", (u) => {
    var f;
    const d = u.target.value;
    if (!d)
      e.setSegmentGate(null);
    else {
      const h = ((f = e.state.activeSegment) == null ? void 0 : f.gate) ?? {};
      e.setSegmentGate({ ...h, event: d });
    }
  }), (i = t.querySelector("[data-action='change-gate-target']")) == null || i.addEventListener("change", (u) => {
    var f;
    const d = (f = e.state.activeSegment) == null ? void 0 : f.gate;
    d && e.setSegmentGate({ ...d, target: u.target.value || void 0 });
  }), (r = t.querySelector("[data-action='pick-gate-target']")) == null || r.addEventListener("click", async () => {
    var f;
    const u = (f = e.state.activeSegment) == null ? void 0 : f.gate;
    if (!u) return;
    const { enterPickMode: d } = await Promise.resolve().then(() => Rv);
    d({
      placeableType: "Tile",
      onPick: /* @__PURE__ */ c((h) => {
        var y, v;
        const m = (v = (y = h.flags) == null ? void 0 : y.tagger) == null ? void 0 : v.tags, g = m != null && m.length ? `tag:${m[0]}` : `id:${h.id}`;
        e.setSegmentGate({ ...u, target: g });
      }, "onPick")
    });
  });
  for (const [u, d] of [["change-gate-anim-idle", "idle"], ["change-gate-anim-hover", "hover"], ["change-gate-anim-dim", "dim"]])
    (o = t.querySelector(`[data-action='${u}']`)) == null || o.addEventListener("change", (f) => {
      var b;
      const h = (b = e.state.activeSegment) == null ? void 0 : b.gate;
      if (!h) return;
      const m = f.target.value.trim(), g = m ? m.split(",").map((w) => w.trim()).filter(Boolean) : void 0, y = { ...h.animation ?? {} };
      g != null && g.length ? y[d] = g.length === 1 ? g[0] : g : delete y[d];
      const v = { ...h, animation: Object.keys(y).length ? y : void 0 };
      v.animation || delete v.animation, e.setSegmentGate(v);
    });
  (s = t.querySelector("[data-action='change-segment-next']")) == null || s.addEventListener("change", (u) => {
    const d = u.target.value;
    e.setSegmentNext(d || null);
  }), (a = t.querySelector("[data-action='edit-segment-setup']")) == null || a.addEventListener("click", () => {
    As("setup", { state: e.state, mutate: e.mutate });
  }), (l = t.querySelector("[data-action='edit-segment-landing']")) == null || l.addEventListener("click", () => {
    As("landing", { state: e.state, mutate: e.mutate });
  });
}
c(Uv, "bindSegmentDetailEvents");
var Gd, Ye, z, it, jn, Nt, rt, Ke, ga, Re, ot, pa, bn, cr, vt, Ai, Un, Mi, U, Qh, Zh, em, tm, xn, Ic, Oc, kc, Ac, nm, _n, Mc, im, rm, om, sm, am, xc, Dr;
const At = class At extends sn(on) {
  constructor(n = {}) {
    super(n);
    A(this, U);
    A(this, Ye, null);
    A(this, z, null);
    A(this, it, null);
    A(this, jn, /* @__PURE__ */ new Set());
    A(this, Nt, !1);
    A(this, rt, null);
    A(this, Ke, null);
    A(this, ga, 120);
    A(this, Re, []);
    A(this, ot, -1);
    A(this, pa, 50);
    A(this, bn, null);
    A(this, cr, null);
    A(this, vt, null);
    A(this, Ai, null);
    A(this, Un, null);
    A(this, Mi, null);
    I(this, Ye, n.scene ?? canvas.scene ?? null), I(this, z, nn.fromScene(p(this, Ye)));
  }
  // ── Context ───────────────────────────────────────────────────────────
  async _prepareContext() {
    var m, g;
    const n = vv(p(this, z), p(this, z).activeSegmentName), i = yv(p(this, z).timeline, {
      selectedPath: p(this, it),
      windowWidth: ((m = this.position) == null ? void 0 : m.width) ?? 1100
    }), r = p(this, it) != null ? Mv(p(this, it), { state: p(this, z), expandedTweens: p(this, jn) }) : null, o = p(this, z).listCinematicNames(), s = p(this, z).activeCinematicName, l = p(this, z).listSegmentNames().length > 1, u = p(this, z).activeSegment, d = (u == null ? void 0 : u.gate) ?? null, f = (u == null ? void 0 : u.next) ?? null, h = typeof f == "string" ? f : (f == null ? void 0 : f.segment) ?? null;
    return {
      // Toolbar
      sceneName: ((g = p(this, Ye)) == null ? void 0 : g.name) ?? "No scene",
      dirty: p(this, Nt),
      canUndo: p(this, U, Ic),
      canRedo: p(this, U, Oc),
      // Cinematic selector
      cinematicNames: o,
      activeCinematicName: s,
      cinematicOptions: o.map((y) => ({
        value: y,
        label: y,
        selected: y === s
      })),
      hasMultipleCinematics: o.length > 1,
      // Segment graph
      segmentGraph: n,
      activeSegmentName: p(this, z).activeSegmentName,
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
      activeSegmentNext: h,
      activeSegmentSetupCount: Object.keys((u == null ? void 0 : u.setup) ?? {}).length,
      activeSegmentLandingCount: Object.keys((u == null ? void 0 : u.landing) ?? {}).length,
      // Footer
      trigger: p(this, z).trigger,
      tracking: p(this, z).tracking,
      synchronized: p(this, z).synchronized,
      triggerOptions: cv.map((y) => ({
        ...y,
        selected: y.value === p(this, z).trigger
      })),
      entryCount: p(this, z).timeline.length,
      totalDuration: i.totalDurationMs,
      targetCount: wv(p(this, z)),
      setupCount: Object.keys(p(this, z).setup ?? {}).length,
      landingCount: Object.keys(p(this, z).landing ?? {}).length
    };
  }
  // ── Render & Events ───────────────────────────────────────────────────
  _onRender(n, i) {
    var r, o, s;
    if (super._onRender(n, i), T(this, U, Qh).call(this), !p(this, Ai)) {
      const a = (o = (r = game.modules.get(L)) == null ? void 0 : r.api) == null ? void 0 : o.cinematic;
      a != null && a.onPlaybackProgress ? (I(this, Ai, a.onPlaybackProgress((l) => T(this, U, am).call(this, l))), console.log("[cinematic-editor] Subscribed to playback progress events")) : console.warn("[cinematic-editor] onPlaybackProgress not available on API", a);
    }
    if (p(this, Mi) && ((s = this.element) == null || s.querySelectorAll(".cinematic-editor__segment-node").forEach((a) => {
      a.classList.toggle("cinematic-editor__segment-node--playing", a.dataset.segmentName === p(this, Mi));
    }), p(this, vt) && p(this, vt).segmentName === p(this, z).activeSegmentName)) {
      const a = performance.now() - p(this, vt).startTime;
      p(this, vt).durationMs - a > 0 && T(this, U, xc).call(this, p(this, vt).durationMs, p(this, vt).startTime);
    }
    p(this, bn) || (I(this, bn, (a) => {
      !a.ctrlKey && !a.metaKey || (a.key === "z" && !a.shiftKey ? (a.preventDefault(), T(this, U, kc).call(this)) : (a.key === "z" && a.shiftKey || a.key === "y") && (a.preventDefault(), T(this, U, Ac).call(this)));
    }), document.addEventListener("keydown", p(this, bn)));
  }
  async close(n = {}) {
    if (p(this, Ke) && T(this, U, _n).call(this), p(this, Nt) && !n.force) {
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
      i === "save" && await T(this, U, Mc).call(this);
    }
    return super.close(n);
  }
  async _onClose(n) {
    var i;
    return p(this, rt) !== null && (clearTimeout(p(this, rt)), I(this, rt, null)), p(this, bn) && (document.removeEventListener("keydown", p(this, bn)), I(this, bn, null)), (i = p(this, Ai)) == null || i.call(this), I(this, Ai, null), T(this, U, Dr).call(this), super._onClose(n);
  }
};
Ye = new WeakMap(), z = new WeakMap(), it = new WeakMap(), jn = new WeakMap(), Nt = new WeakMap(), rt = new WeakMap(), Ke = new WeakMap(), ga = new WeakMap(), Re = new WeakMap(), ot = new WeakMap(), pa = new WeakMap(), bn = new WeakMap(), cr = new WeakMap(), vt = new WeakMap(), Ai = new WeakMap(), Un = new WeakMap(), Mi = new WeakMap(), U = new WeakSet(), // ── Event binding ─────────────────────────────────────────────────────
Qh = /* @__PURE__ */ c(function() {
  const n = this.element;
  if (!(n instanceof HTMLElement)) return;
  const i = T(this, U, Zh).call(this);
  Nv(n, i), $v(n, i), jv(n, i), Fv(n, i), Dv(n, i), Hv(n, i), qv(n, i), Bv(n, i), Uv(n, i);
}, "#bindEvents"), Zh = /* @__PURE__ */ c(function() {
  const n = this;
  return {
    // State access (read-only getters — closures over `self` for private field access)
    get state() {
      return p(n, z);
    },
    get selectedPath() {
      return p(n, it);
    },
    get scene() {
      return p(n, Ye);
    },
    get expandedTweens() {
      return p(n, jn);
    },
    get insertMenuState() {
      return p(n, cr);
    },
    // Mutations
    mutate: /* @__PURE__ */ c((i) => T(this, U, xn).call(this, i), "mutate"),
    setSelectedPath: /* @__PURE__ */ c((i) => {
      I(this, it, i), this.render({ force: !0 });
    }, "setSelectedPath"),
    render: /* @__PURE__ */ c(() => this.render({ force: !0 }), "render"),
    // Cinematic switching (needs full state swap + clear)
    switchCinematic: /* @__PURE__ */ c((i) => {
      p(this, Ke) && T(this, U, _n).call(this), I(this, z, p(this, z).switchCinematic(i)), I(this, it, null), p(this, jn).clear(), this.render({ force: !0 });
    }, "switchCinematic"),
    // Segment management
    selectSegment: /* @__PURE__ */ c((i) => {
      p(this, Ke) && T(this, U, _n).call(this), I(this, z, p(this, z).switchSegment(i)), I(this, it, null), p(this, jn).clear(), this.render({ force: !0 });
    }, "selectSegment"),
    addSegment: /* @__PURE__ */ c((i) => {
      T(this, U, xn).call(this, (r) => r.addSegment(i, r.activeSegmentName));
    }, "addSegment"),
    removeSegment: /* @__PURE__ */ c((i) => {
      T(this, U, xn).call(this, (r) => r.removeSegment(i));
    }, "removeSegment"),
    renameSegment: /* @__PURE__ */ c((i, r) => {
      T(this, U, xn).call(this, (o) => o.renameSegment(i, r));
    }, "renameSegment"),
    setSegmentGate: /* @__PURE__ */ c((i) => {
      T(this, U, xn).call(this, (r) => r.setSegmentGate(i));
    }, "setSegmentGate"),
    setSegmentNext: /* @__PURE__ */ c((i) => {
      T(this, U, xn).call(this, (r) => r.setSegmentNext(i));
    }, "setSegmentNext"),
    // Tween debouncing
    queueTweenChange: /* @__PURE__ */ c((i, r) => T(this, U, nm).call(this, i, r), "queueTweenChange"),
    flushTweenChanges: /* @__PURE__ */ c(() => {
      p(this, Ke) && T(this, U, _n).call(this);
    }, "flushTweenChanges"),
    flushTweenChangesImmediate: /* @__PURE__ */ c(() => {
      p(this, rt) !== null && clearTimeout(p(this, rt)), I(this, rt, null), T(this, U, _n).call(this);
    }, "flushTweenChangesImmediate"),
    // Path utilities
    parseEntryPath: ti,
    getEntryAtPath: /* @__PURE__ */ c((i) => ks(i, p(this, z)), "getEntryAtPath"),
    // Insert menu
    showInsertMenu: /* @__PURE__ */ c((i, r, o) => T(this, U, em).call(this, i, r, o), "showInsertMenu"),
    hideInsertMenu: /* @__PURE__ */ c(() => T(this, U, tm).call(this), "hideInsertMenu"),
    // Toolbar actions
    save: /* @__PURE__ */ c(() => T(this, U, Mc).call(this), "save"),
    play: /* @__PURE__ */ c(() => T(this, U, im).call(this), "play"),
    resetTracking: /* @__PURE__ */ c(() => T(this, U, rm).call(this), "resetTracking"),
    exportJSON: /* @__PURE__ */ c(() => T(this, U, om).call(this), "exportJSON"),
    validate: /* @__PURE__ */ c(() => T(this, U, sm).call(this), "validate"),
    importJSON: /* @__PURE__ */ c(() => xv({ state: p(this, z), mutate: /* @__PURE__ */ c((i) => T(this, U, xn).call(this, i), "mutate") }), "importJSON"),
    undo: /* @__PURE__ */ c(() => T(this, U, kc).call(this), "undo"),
    redo: /* @__PURE__ */ c(() => T(this, U, Ac).call(this), "redo")
  };
}, "#createEventContext"), // ── Insert menu ───────────────────────────────────────────────────────
em = /* @__PURE__ */ c(function(n, i, r) {
  var l;
  const o = (l = this.element) == null ? void 0 : l.querySelector(".cinematic-editor__insert-menu");
  if (!o) return;
  const s = n.getBoundingClientRect();
  document.body.appendChild(o), o.style.display = "", o.style.position = "fixed", o.style.left = `${s.left}px`;
  const a = o.offsetHeight || 200;
  s.bottom + 4 + a > window.innerHeight ? o.style.top = `${s.top - a - 4}px` : o.style.top = `${s.bottom + 4}px`, I(this, cr, { insertIndex: i, lane: r });
}, "#showInsertMenu"), tm = /* @__PURE__ */ c(function() {
  var i, r;
  const n = document.body.querySelector(".cinematic-editor__insert-menu") ?? ((i = this.element) == null ? void 0 : i.querySelector(".cinematic-editor__insert-menu"));
  if (n) {
    n.style.display = "none";
    const o = (r = this.element) == null ? void 0 : r.querySelector(".cinematic-editor");
    o && n.parentNode !== o && o.appendChild(n);
  }
  I(this, cr, null);
}, "#hideInsertMenu"), // ── State mutation ────────────────────────────────────────────────────
xn = /* @__PURE__ */ c(function(n) {
  I(this, Re, p(this, Re).slice(0, p(this, ot) + 1)), p(this, Re).push(p(this, z)), p(this, Re).length > p(this, pa) && p(this, Re).shift(), I(this, ot, p(this, Re).length - 1), I(this, z, n(p(this, z))), I(this, Nt, !0), this.render({ force: !0 });
}, "#mutate"), Ic = /* @__PURE__ */ c(function() {
  return p(this, ot) >= 0;
}, "#canUndo"), Oc = /* @__PURE__ */ c(function() {
  return p(this, ot) < p(this, Re).length - 1;
}, "#canRedo"), kc = /* @__PURE__ */ c(function() {
  p(this, U, Ic) && (p(this, ot) === p(this, Re).length - 1 && p(this, Re).push(p(this, z)), I(this, z, p(this, Re)[p(this, ot)]), qa(this, ot)._--, I(this, Nt, !0), this.render({ force: !0 }));
}, "#undo"), Ac = /* @__PURE__ */ c(function() {
  p(this, U, Oc) && (qa(this, ot)._++, I(this, z, p(this, Re)[p(this, ot) + 1]), I(this, Nt, !0), this.render({ force: !0 }));
}, "#redo"), nm = /* @__PURE__ */ c(function(n, i) {
  var r;
  p(this, it) != null && (I(this, Ke, {
    ...p(this, Ke) ?? {},
    entryPath: p(this, it),
    tweenIndex: n,
    patch: { ...((r = p(this, Ke)) == null ? void 0 : r.patch) ?? {}, ...i }
  }), p(this, rt) !== null && clearTimeout(p(this, rt)), I(this, rt, setTimeout(() => {
    I(this, rt, null), T(this, U, _n).call(this);
  }, p(this, ga))));
}, "#queueTweenChange"), _n = /* @__PURE__ */ c(function() {
  if (!p(this, Ke)) return;
  const { entryPath: n, tweenIndex: i, patch: r } = p(this, Ke);
  I(this, Ke, null);
  const o = ti(n);
  if (o) {
    if (o.type === "timeline")
      I(this, z, p(this, z).updateTween(o.index, i, r));
    else if (o.type === "branch") {
      const s = ks(n, p(this, z));
      if (s) {
        const a = (s.tweens ?? []).map((l, u) => u === i ? { ...l, ...r } : l);
        I(this, z, p(this, z).updateBranchEntry(o.index, o.branchIndex, o.branchEntryIndex, { tweens: a }));
      }
    }
    I(this, Nt, !0);
  }
}, "#flushTweenChanges"), Mc = /* @__PURE__ */ c(async function() {
  var n, i, r, o, s, a;
  if (p(this, Ye)) {
    if (p(this, Ke) && T(this, U, _n).call(this), p(this, z).isStale(p(this, Ye))) {
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
        I(this, z, nn.fromScene(p(this, Ye), p(this, z).activeCinematicName)), I(this, Nt, !1), I(this, Re, []), I(this, ot, -1), this.render({ force: !0 }), (i = (n = ui.notifications) == null ? void 0 : n.info) == null || i.call(n, "Cinematic reloaded from scene.");
        return;
      }
      if (!l) return;
    }
    try {
      await p(this, z).save(p(this, Ye)), I(this, z, nn.fromScene(p(this, Ye), p(this, z).activeCinematicName)), I(this, Nt, !1), (o = (r = ui.notifications) == null ? void 0 : r.info) == null || o.call(r, "Cinematic saved."), this.render({ force: !0 });
    } catch (l) {
      console.error(`${L} | Cinematic save failed`, l), (a = (s = ui.notifications) == null ? void 0 : s.error) == null || a.call(s, "Failed to save cinematic data.");
    }
  }
}, "#onSave"), im = /* @__PURE__ */ c(async function() {
  var i, r, o, s, a;
  const n = (r = (i = game.modules.get(L)) == null ? void 0 : i.api) == null ? void 0 : r.cinematic;
  if (!(n != null && n.play)) {
    (s = (o = ui.notifications) == null ? void 0 : o.warn) == null || s.call(o, "Cinematic API not available.");
    return;
  }
  await n.play((a = p(this, Ye)) == null ? void 0 : a.id, p(this, z).activeCinematicName);
}, "#onPlay"), rm = /* @__PURE__ */ c(async function() {
  var i, r, o, s, a;
  const n = (r = (i = game.modules.get(L)) == null ? void 0 : i.api) == null ? void 0 : r.cinematic;
  n != null && n.reset && (await n.reset((o = p(this, Ye)) == null ? void 0 : o.id, p(this, z).activeCinematicName), (a = (s = ui.notifications) == null ? void 0 : s.info) == null || a.call(s, "Cinematic tracking reset."));
}, "#onResetTracking"), om = /* @__PURE__ */ c(async function() {
  var i, r;
  const n = JSON.stringify(p(this, z).toJSON(), null, 2);
  try {
    await navigator.clipboard.writeText(n), (r = (i = ui.notifications) == null ? void 0 : i.info) == null || r.call(i, "Cinematic JSON copied to clipboard.");
  } catch {
    new Dialog({
      title: "Cinematic JSON",
      content: `<textarea style="width:100%;height:300px;font-family:monospace;font-size:0.8rem">${Bt(n)}</textarea>`,
      buttons: { ok: { label: "Close" } }
    }).render(!0);
  }
}, "#onExportJSON"), sm = /* @__PURE__ */ c(function() {
  var l, u;
  const n = p(this, z).toJSON(), { targets: i, unresolved: r } = Os(n), o = lv(n, i), s = [
    ...r.map((d) => ({ path: "targets", level: "warn", message: `Unresolved target: "${d}"` })),
    ...o
  ];
  if (s.length === 0) {
    (u = (l = ui.notifications) == null ? void 0 : l.info) == null || u.call(l, "Cinematic validation passed — no issues found.");
    return;
  }
  const a = s.map((d) => {
    const f = d.level === "error" ? "fa-circle-xmark" : "fa-triangle-exclamation", h = d.level === "error" ? "#e74c3c" : "#f39c12";
    return `<li style="margin:0.3rem 0"><i class="fa-solid ${f}" style="color:${h};margin-right:0.3rem"></i><strong>${Bt(d.path)}</strong>: ${Bt(d.message)}</li>`;
  });
  new Dialog({
    title: "Cinematic Validation",
    content: `<p>${s.length} issue(s) found:</p><ul style="list-style:none;padding:0;max-height:300px;overflow:auto">${a.join("")}</ul>`,
    buttons: { ok: { label: "Close" } }
  }).render(!0);
}, "#onValidate"), // ── Playback progress ────────────────────────────────────────────────
am = /* @__PURE__ */ c(function(n) {
  var i, r, o, s, a, l;
  switch (console.log(`[cinematic-editor] playback event: ${n.type}`, n), n.type) {
    case "segment-start":
      I(this, Mi, n.segmentName), n.segmentName !== p(this, z).activeSegmentName ? (I(this, z, p(this, z).switchSegment(n.segmentName)), I(this, it, null), p(this, jn).clear(), this.render({ force: !0 })) : (i = this.element) == null || i.querySelectorAll(".cinematic-editor__segment-node").forEach((u) => {
        u.classList.toggle("cinematic-editor__segment-node--playing", u.dataset.segmentName === n.segmentName);
      });
      break;
    case "gate-wait":
      (o = (r = this.element) == null ? void 0 : r.querySelector(`.cinematic-editor__segment-node[data-segment-name="${CSS.escape(n.segmentName)}"]`)) == null || o.classList.add("cinematic-editor__segment-node--gate-waiting");
      break;
    case "gate-resolved":
      (a = (s = this.element) == null ? void 0 : s.querySelector(`.cinematic-editor__segment-node[data-segment-name="${CSS.escape(n.segmentName)}"]`)) == null || a.classList.remove("cinematic-editor__segment-node--gate-waiting");
      break;
    case "timeline-start":
      I(this, vt, { segmentName: n.segmentName, startTime: performance.now(), durationMs: n.durationMs }), n.segmentName === p(this, z).activeSegmentName && T(this, U, xc).call(this, n.durationMs);
      break;
    case "timeline-end":
      T(this, U, Dr).call(this), I(this, vt, null);
      break;
    case "playback-end":
      T(this, U, Dr).call(this), I(this, vt, null), I(this, Mi, null), (l = this.element) == null || l.querySelectorAll(".cinematic-editor__segment-node--playing, .cinematic-editor__segment-node--gate-waiting").forEach((u) => {
        u.classList.remove("cinematic-editor__segment-node--playing", "cinematic-editor__segment-node--gate-waiting");
      });
      break;
  }
}, "#onPlaybackEvent"), xc = /* @__PURE__ */ c(function(n, i = null) {
  var u, d;
  T(this, U, Dr).call(this);
  const r = (u = this.element) == null ? void 0 : u.querySelector(".cinematic-editor__playback-cursor"), o = (d = this.element) == null ? void 0 : d.querySelector(".cinematic-editor__swimlane");
  if (console.log(`[cinematic-editor] startCursor: duration=${n}, cursor=${!!r}, swimlane=${!!o}, width=${o == null ? void 0 : o.scrollWidth}`), !r || !o || n <= 0) return;
  r.style.display = "block";
  const s = i ?? performance.now(), a = o.scrollWidth, l = /* @__PURE__ */ c(() => {
    const f = performance.now() - s, h = Math.min(f / n, 1), m = to + h * (a - to);
    r.style.left = `${m}px`, h < 1 && I(this, Un, requestAnimationFrame(l));
  }, "tick");
  I(this, Un, requestAnimationFrame(l));
}, "#startCursorAnimation"), Dr = /* @__PURE__ */ c(function() {
  var i;
  p(this, Un) && (cancelAnimationFrame(p(this, Un)), I(this, Un, null));
  const n = (i = this.element) == null ? void 0 : i.querySelector(".cinematic-editor__playback-cursor");
  n && (n.style.display = "none");
}, "#stopCursorAnimation"), c(At, "CinematicEditorApplication"), ue(At, "APP_ID", `${L}-cinematic-editor`), ue(At, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Le(At, At, "DEFAULT_OPTIONS"),
  {
    id: At.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Gd = Le(At, At, "DEFAULT_OPTIONS")) == null ? void 0 : Gd.classes) ?? [], "eidolon-cinematic-editor-window", "themed"])
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
)), ue(At, "PARTS", {
  content: {
    template: `modules/${L}/templates/cinematic-editor.html`
  }
});
let Lc = At;
const lm = /* @__PURE__ */ new Map();
function pe(t, e) {
  lm.set(t, e);
}
c(pe, "registerBehaviour");
function ss(t) {
  return lm.get(t);
}
c(ss, "getBehaviour");
function de(t) {
  var e;
  return ((e = t.document) == null ? void 0 : e.documentName) === "Drawing" ? t.shape ?? null : t.mesh ? t.mesh : t.destroyed || !t.transform ? null : t;
}
c(de, "getAnimationTarget");
function Vv(t, e, n) {
  let i, r, o;
  if (e === 0)
    i = r = o = n;
  else {
    const s = /* @__PURE__ */ c((u, d, f) => (f < 0 && (f += 1), f > 1 && (f -= 1), f < 0.16666666666666666 ? u + (d - u) * 6 * f : f < 0.5 ? d : f < 0.6666666666666666 ? u + (d - u) * (0.6666666666666666 - f) * 6 : u), "hue2rgb"), a = n < 0.5 ? n * (1 + e) : n + e - n * e, l = 2 * n - a;
    i = s(l, a, t + 1 / 3), r = s(l, a, t), o = s(l, a, t - 1 / 3);
  }
  return Math.round(i * 255) << 16 | Math.round(r * 255) << 8 | Math.round(o * 255);
}
c(Vv, "hslToInt");
pe("float", (t, e = {}) => {
  const n = de(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.speed ?? 0.04, r = e.amplitude ?? 3, o = n.position.y;
  let s = 0;
  return {
    update(a) {
      s += a, n.position.y = o + Math.sin(s * i) * r;
    },
    detach() {
      n.position.y = o;
    }
  };
});
pe("pulse", (t, e = {}) => {
  const n = de(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.minAlpha ?? 0.6, r = e.maxAlpha ?? 1, o = e.speed ?? 0.05, s = n.alpha;
  let a = Math.PI / 2;
  return {
    update(l) {
      a += l * o;
      const u = (Math.sin(a) + 1) / 2;
      n.alpha = i + (r - i) * u;
    },
    detach() {
      n.alpha = s;
    }
  };
});
pe("scale", (t, e = {}, n) => {
  var w, E, C, O, k, x;
  const i = de(t);
  if (!i) return { update() {
  }, detach() {
  } };
  const r = e.factor ?? 1.12, o = e.durationFrames ?? 15, s = at(e.easing ?? "easeOutCubic"), a = i.scale.x, l = i.scale.y, u = a * r, d = l * r, h = !(!!t.mesh || ((w = i.pivot) == null ? void 0 : w.x) || ((E = i.pivot) == null ? void 0 : E.y)), m = h ? (((O = (C = t.document) == null ? void 0 : C.shape) == null ? void 0 : O.width) ?? 0) / 2 : 0, g = h ? (((x = (k = t.document) == null ? void 0 : k.shape) == null ? void 0 : x.height) ?? 0) / 2 : 0, y = (n == null ? void 0 : n.x) ?? i.position.x, v = (n == null ? void 0 : n.y) ?? i.position.y;
  let b = 0;
  return {
    update($) {
      if (b < o) {
        b += $;
        const D = Math.min(b / o, 1), N = s(D), F = a + (u - a) * N, M = l + (d - l) * N;
        i.scale.x = F, i.scale.y = M, h && (i.position.x = y - m * (F - a), i.position.y = v - g * (M - l));
      }
    },
    detach() {
      i.scale.x = a, i.scale.y = l, h && (i.position.x = y, i.position.y = v);
    }
  };
});
pe("glow", (t, e = {}) => {
  var y, v;
  const n = de(t);
  if (!((y = n == null ? void 0 : n.texture) != null && y.baseTexture)) return { update() {
  }, detach() {
  } };
  const i = t.document, r = e.color ?? 4513279, o = e.alpha ?? 0.5, s = e.blur ?? 8, a = e.pulseSpeed ?? 0.03, l = Math.abs(i.width), u = Math.abs(i.height), d = PIXI.Sprite.from(n.texture);
  d.anchor.set(0.5, 0.5), d.scale.set(n.scale.x, n.scale.y), d.position.set(l / 2, u / 2), d.angle = i.rotation ?? 0, d.alpha = o, d.tint = r;
  const f = PIXI.BlurFilter ?? ((v = PIXI.filters) == null ? void 0 : v.BlurFilter), h = new f(s);
  d.filters = [h], t.addChildAt(d, 0);
  const m = n.angle;
  let g = 0;
  return {
    update(b) {
      g += b;
      const w = (Math.sin(g * a) + 1) / 2;
      d.visible = n.visible !== !1, d.alpha = o * (0.5 + 0.5 * w) * (n.alpha ?? 1), d.scale.set(n.scale.x, n.scale.y), d.angle = (i.rotation ?? 0) + (n.angle - m);
    },
    detach() {
      d.parent && d.parent.removeChild(d), d.destroy({ children: !0 });
    }
  };
});
pe("wobble", (t, e = {}) => {
  const n = de(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.speed ?? 0.15, r = e.angle ?? 2.5, o = n.angle;
  let s = 0;
  return {
    update(a) {
      s += a, n.angle = o + Math.sin(s * i) * r;
    },
    detach() {
      n.angle = o;
    }
  };
});
pe("colorCycle", (t, e = {}) => {
  const n = de(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.speed ?? 5e-3, r = e.saturation ?? 0.6, o = e.lightness ?? 0.6, s = n.tint;
  let a = 0;
  return {
    update(l) {
      a = (a + l * i) % 1, n.tint = Vv(a, r, o);
    },
    detach() {
      n.tint = s;
    }
  };
});
pe("spin", (t, e = {}) => {
  const n = de(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.speed ?? 0.5, r = n.angle;
  let o = 0;
  return {
    update(s) {
      o += s, n.angle = r + o * i;
    },
    detach() {
      n.angle = r;
    }
  };
});
pe("bounce", (t, e = {}) => {
  const n = de(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.speed ?? 0.02, r = e.amplitude ?? 6, o = at("easeOutBounce"), s = n.position.y;
  let a = 0;
  return {
    update(l) {
      a += l;
      const u = Math.abs(a * i % 2 - 1);
      n.position.y = s + o(u) * r;
    },
    detach() {
      n.position.y = s;
    }
  };
});
pe("borderTrace", (t, e = {}) => {
  const n = de(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), o = Math.abs(i.height), s = 2 * (r + o), a = e.speed ?? 1.5, l = e.length ?? 60, u = e.color ?? 4513279, d = e.alpha ?? 0.8, f = e.lineWidth ?? 2, h = new PIXI.Graphics();
  h.alpha = d, h.pivot.set(r / 2, o / 2), h.position.set(r / 2, o / 2), t.addChildAt(h, 0);
  const m = n.scale.x, g = n.scale.y, y = n.angle;
  let v = 0;
  function b(w) {
    return w = (w % s + s) % s, w < r ? { x: w, y: 0 } : (w -= r, w < o ? { x: r, y: w } : (w -= o, w < r ? { x: r - w, y: o } : (w -= r, { x: 0, y: o - w })));
  }
  return c(b, "perimeterPoint"), {
    update(w) {
      v = (v + w * a) % s, h.visible = n.visible !== !1, h.alpha = d * (n.alpha ?? 1), h.scale.set(n.scale.x / m, n.scale.y / g), h.angle = n.angle - y, h.clear(), h.lineStyle(f, u, 1);
      const E = 16, C = l / E, O = b(v);
      h.moveTo(O.x, O.y);
      for (let k = 1; k <= E; k++) {
        const x = b(v + k * C);
        h.lineTo(x.x, x.y);
      }
    },
    detach() {
      h.parent && h.parent.removeChild(h), h.destroy({ children: !0 });
    }
  };
});
pe("shimmer", (t, e = {}) => {
  const n = de(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), o = Math.abs(i.height), s = e.speed ?? 1, a = e.bandWidth ?? 40, l = e.alpha ?? 0.15, u = e.pause ?? 120, d = r + o + a, f = d + u * s, h = new PIXI.Container();
  h.pivot.set(r / 2, o / 2), h.position.set(r / 2, o / 2);
  const m = new PIXI.Graphics();
  m.alpha = l;
  const g = new PIXI.Graphics();
  g.beginFill(16777215), g.drawRect(0, 0, r, o), g.endFill(), h.addChild(g), m.mask = g, h.addChild(m), t.addChild(h);
  const y = n.scale.x, v = n.scale.y, b = n.angle;
  let w = 0;
  return {
    update(E) {
      if (w = (w + E * s) % f, h.visible = n.visible !== !1, h.scale.set(n.scale.x / y, n.scale.y / v), h.angle = n.angle - b, m.alpha = l * (n.alpha ?? 1), m.clear(), w < d) {
        const C = w - a;
        m.beginFill(16777215, 1), m.moveTo(C, 0), m.lineTo(C + a, 0), m.lineTo(C + a - o, o), m.lineTo(C - o, o), m.closePath(), m.endFill();
      }
    },
    detach() {
      m.mask = null, h.parent && h.parent.removeChild(h), h.destroy({ children: !0 });
    }
  };
});
pe("breathe", (t, e = {}) => {
  const n = de(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.factor ?? 1.03, r = e.speed ?? 0.02, o = n.scale.x, s = n.scale.y;
  let a = 0;
  return {
    update(l) {
      a += l;
      const u = Math.sin(a * r);
      n.scale.x = o * (1 + (i - 1) * u), n.scale.y = s * (1 + (i - 1) * u);
    },
    detach() {
      n.scale.x = o, n.scale.y = s;
    }
  };
});
pe("tiltFollow", (t, e = {}) => {
  const n = de(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.maxAngle ?? 3, r = e.smoothing ?? 0.15, o = t.document, s = n.angle;
  let a = 0;
  return {
    update() {
      const l = canvas.mousePosition;
      if (!l) return;
      const u = Math.abs(o.width), d = o.x + u / 2, f = l.x - d, h = Math.max(-i, Math.min(i, f / (u / 2) * i));
      a += (h - a) * r, n.angle = s + a;
    },
    detach() {
      n.angle = s;
    }
  };
});
pe("slideReveal", (t, e = {}, n) => {
  const i = de(t);
  if (!i) return { update() {
  }, detach() {
  } };
  if (n) return { update() {
  }, detach() {
  } };
  const r = e.offsetX ?? 0, o = e.offsetY ?? 20, s = e.durationFrames ?? 20, a = at(e.easing ?? "easeOutCubic"), l = e.delay ?? 0, u = i.position.x, d = i.position.y, f = i.alpha;
  i.position.x = u + r, i.position.y = d + o, i.alpha = 0;
  let h = -l;
  return {
    update(m) {
      if (h += m, h < 0) return;
      if (h >= s) {
        i.position.x = u, i.position.y = d, i.alpha = f;
        return;
      }
      const g = Math.min(h / s, 1), y = a(g);
      i.position.x = u + r * (1 - y), i.position.y = d + o * (1 - y), i.alpha = f * y;
    },
    detach() {
      i.position.x = u, i.position.y = d, i.alpha = f;
    }
  };
});
pe("embers", (t, e = {}) => {
  const n = de(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), o = Math.abs(i.height), s = e.count ?? 12, a = e.speed ?? 0.5, l = e.color ?? 16737792, u = e.alpha ?? 0.6, d = e.size ?? 2, f = new PIXI.Container();
  f.pivot.set(r / 2, o / 2), f.position.set(r / 2, o / 2);
  const h = new PIXI.Graphics();
  f.addChild(h), t.addChild(f);
  const m = n.scale.x, g = n.scale.y, y = n.angle, v = [];
  function b() {
    const w = Math.random();
    let E, C;
    return w < 0.7 ? (E = Math.random() * r, C = o) : w < 0.85 ? (E = 0, C = o * 0.5 + Math.random() * o * 0.5) : (E = r, C = o * 0.5 + Math.random() * o * 0.5), {
      x: E,
      y: C,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -a * (0.5 + Math.random() * 0.5),
      life: 0,
      maxLife: 40 + Math.random() * 60,
      size: d * (0.5 + Math.random() * 0.5)
    };
  }
  return c(b, "spawnParticle"), {
    update(w) {
      f.visible = n.visible !== !1, f.scale.set(n.scale.x / m, n.scale.y / g), f.angle = n.angle - y, v.length < s && v.push(b());
      for (let E = v.length - 1; E >= 0; E--) {
        const C = v[E];
        if (C.life += w, C.life >= C.maxLife) {
          v.splice(E, 1);
          continue;
        }
        C.x += C.vx * w, C.y += C.vy * w, C.vx += (Math.random() - 0.5) * 0.05 * w;
      }
      h.clear();
      for (const E of v) {
        const C = 1 - E.life / E.maxLife;
        h.beginFill(l, u * C * (n.alpha ?? 1)), h.drawCircle(E.x, E.y, E.size), h.endFill();
      }
    },
    detach() {
      f.parent && f.parent.removeChild(f), f.destroy({ children: !0 });
    }
  };
});
pe("runeGlow", (t, e = {}) => {
  const n = de(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), o = Math.abs(i.height), s = 2 * (r + o), a = e.dots ?? 3, l = e.speed ?? 1.2, u = e.color ?? 4513279, d = e.color2 ?? 8930559, f = e.radius ?? 3, h = e.alpha ?? 0.7, m = new PIXI.Graphics();
  m.pivot.set(r / 2, o / 2), m.position.set(r / 2, o / 2), t.addChildAt(m, 0);
  const g = n.scale.x, y = n.scale.y, v = n.angle, b = [];
  for (let C = 0; C < a; C++)
    b.push({
      phase: C / a * s,
      speedMul: 0.7 + Math.random() * 0.6,
      color: C % 2 === 0 ? u : d
    });
  function w(C) {
    return C = (C % s + s) % s, C < r ? { x: C, y: 0 } : (C -= r, C < o ? { x: r, y: C } : (C -= o, C < r ? { x: r - C, y: o } : (C -= r, { x: 0, y: o - C })));
  }
  c(w, "perimeterPoint");
  let E = 0;
  return {
    update(C) {
      E += C, m.visible = n.visible !== !1, m.alpha = h * (n.alpha ?? 1), m.scale.set(n.scale.x / g, n.scale.y / y), m.angle = n.angle - v, m.clear();
      for (const O of b) {
        const k = w(O.phase + E * l * O.speedMul);
        m.beginFill(O.color, 1), m.drawCircle(k.x, k.y, f), m.endFill();
      }
    },
    detach() {
      m.parent && m.parent.removeChild(m), m.destroy({ children: !0 });
    }
  };
});
pe("ripple", (t, e = {}) => {
  const n = de(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), o = Math.abs(i.height), s = e.maxRadius ?? Math.sqrt(r * r + o * o) / 2, a = e.rings ?? 3, l = e.interval ?? 30, u = e.speed ?? 1.5, d = e.color ?? 4513279, f = e.alpha ?? 0.4, h = e.lineWidth ?? 1.5, m = new PIXI.Container();
  m.pivot.set(r / 2, o / 2), m.position.set(r / 2, o / 2);
  const g = new PIXI.Graphics();
  m.addChild(g), t.addChild(m);
  const y = n.scale.x, v = n.scale.y, b = n.angle, w = [];
  let E = 0, C = 0;
  return {
    update(O) {
      E += O, m.visible = n.visible !== !1, m.scale.set(n.scale.x / y, n.scale.y / v), m.angle = n.angle - b, E >= C && w.length < a && (w.push({ radius: 0, alpha: f }), C = E + l);
      for (let $ = w.length - 1; $ >= 0; $--) {
        const D = w[$];
        D.radius += u * O, D.alpha = f * (1 - D.radius / s), D.radius >= s && w.splice($, 1);
      }
      g.clear();
      const k = r / 2, x = o / 2;
      for (const $ of w)
        g.lineStyle(h, d, $.alpha * (n.alpha ?? 1)), g.drawCircle(k, x, $.radius);
    },
    detach() {
      m.parent && m.parent.removeChild(m), m.destroy({ children: !0 });
    }
  };
});
pe("frostEdge", (t, e = {}) => {
  const n = de(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), o = Math.abs(i.height), s = e.segments ?? 20, a = e.maxLength ?? 15, l = e.color ?? 11197951, u = e.alpha ?? 0.5, d = e.growSpeed ?? 0.02, f = new PIXI.Container();
  f.pivot.set(r / 2, o / 2), f.position.set(r / 2, o / 2);
  const h = new PIXI.Graphics(), m = new PIXI.Graphics();
  m.beginFill(16777215), m.drawRect(0, 0, r, o), m.endFill(), f.addChild(m), h.mask = m, f.addChild(h), t.addChild(f);
  const g = n.scale.x, y = n.scale.y, v = n.angle, b = [];
  for (let C = 0; C < s; C++) {
    const O = Math.floor(Math.random() * 4);
    let k, x, $;
    switch (O) {
      case 0:
        k = Math.random() * r, x = 0, $ = Math.PI / 2 + (Math.random() - 0.5) * 0.6;
        break;
      case 1:
        k = r, x = Math.random() * o, $ = Math.PI + (Math.random() - 0.5) * 0.6;
        break;
      case 2:
        k = Math.random() * r, x = o, $ = -Math.PI / 2 + (Math.random() - 0.5) * 0.6;
        break;
      default:
        k = 0, x = Math.random() * o, $ = (Math.random() - 0.5) * 0.6;
        break;
    }
    b.push({ sx: k, sy: x, angle: $, targetLength: a * (0.4 + Math.random() * 0.6), currentLength: 0, grown: !1 });
  }
  let w = !1, E = 0;
  return {
    update(C) {
      if (f.visible = n.visible !== !1, f.scale.set(n.scale.x / g, n.scale.y / y), f.angle = n.angle - v, w)
        E += C * 0.03;
      else {
        w = !0;
        for (const k of b)
          k.grown || (k.currentLength += (k.targetLength - k.currentLength) * d * C, k.currentLength >= k.targetLength * 0.99 ? (k.currentLength = k.targetLength, k.grown = !0) : w = !1);
      }
      const O = w ? u * (0.7 + 0.3 * Math.sin(E)) : u;
      h.clear(), h.lineStyle(1.5, l, O * (n.alpha ?? 1));
      for (const k of b)
        k.currentLength <= 0 || (h.moveTo(k.sx, k.sy), h.lineTo(k.sx + Math.cos(k.angle) * k.currentLength, k.sy + Math.sin(k.angle) * k.currentLength));
    },
    detach() {
      h.mask = null, f.parent && f.parent.removeChild(f), f.destroy({ children: !0 });
    }
  };
});
pe("shadowLift", (t, e = {}) => {
  var m, g, y;
  const n = de(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = PIXI.DropShadowFilter ?? ((m = PIXI.filters) == null ? void 0 : m.DropShadowFilter) ?? ((y = (g = globalThis.PIXI) == null ? void 0 : g.filters) == null ? void 0 : y.DropShadowFilter);
  if (!i)
    return console.warn("shadowLift: DropShadowFilter not available in this PIXI build"), { update() {
    }, detach() {
    } };
  const r = e.offsetY ?? 6, o = e.blur ?? 6, s = e.alpha ?? 0.35, a = e.color ?? 0, l = e.durationFrames ?? 12, u = at(e.easing ?? "easeOutCubic"), d = new i();
  d.blur = o, d.alpha = 0, d.color = a, d.quality = 3, d.distance = 0, d.rotation = 90;
  const f = n.filters ? [...n.filters] : [];
  n.filters = [...f, d];
  let h = 0;
  return {
    update(v) {
      if (h < l) {
        h += v;
        const b = Math.min(h / l, 1), w = u(b);
        d.distance = r * w, d.alpha = s * w;
      }
    },
    detach() {
      n.filters && (n.filters = n.filters.filter((v) => v !== d), n.filters.length === 0 && (n.filters = null)), d.destroy();
    }
  };
});
pe("none", () => ({ update() {
}, detach() {
} }));
pe("tween-prop", (t, e = {}) => {
  const n = de(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.attribute ?? "alpha", r = e.from ?? 0.85, o = e.to ?? 1, s = e.period ?? 1500, a = at(e.easing ?? "easeInOutCosine"), u = { alpha: "alpha", rotation: "angle" }[i] ?? i, d = n[u];
  let f = 0;
  return {
    update(h) {
      f += h;
      const m = s / 16.667, g = Math.abs(f / m % 2 - 1), y = a(g);
      n[u] = r + (o - r) * y;
    },
    detach() {
      n[u] = d;
    }
  };
});
pe("tween-tint", (t, e = {}) => {
  const n = de(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.fromColor ?? "#ffffff", r = e.toColor ?? "#ffcc88", o = e.mode ?? "oklch", s = e.period ?? 3e3, a = at(e.easing ?? "easeInOutCosine"), l = ru(o), u = foundry.utils.Color, d = u.from(i), f = u.from(r), h = n.tint;
  let m = 0;
  return {
    update(g) {
      m += g;
      const y = s / 16.667, v = Math.abs(m / y % 2 - 1), b = a(v), w = l(d, f, b);
      n.tint = u.from(w).valueOf();
    },
    detach() {
      n.tint = h;
    }
  };
});
pe("tween-scale", (t, e = {}) => {
  const n = de(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.fromScale ?? 0.95, r = e.toScale ?? 1.05, o = e.period ?? 2e3, s = at(e.easing ?? "easeInOutCosine"), a = n.scale.x, l = n.scale.y;
  let u = 0;
  return {
    update(d) {
      u += d;
      const f = o / 16.667, h = Math.abs(u / f % 2 - 1), m = s(h), g = i + (r - i) * m;
      n.scale.set(a * g, l * g);
    },
    detach() {
      n.scale.set(a, l);
    }
  };
});
const Or = {
  always: [],
  idle: ["float", "glow"],
  hover: ["scale"],
  dim: ["none"]
};
function Gv(t) {
  if (!t) return { ...Or };
  const e = /* @__PURE__ */ c((n, i) => n === void 0 ? i : typeof n == "string" ? [n] : typeof n == "object" && !Array.isArray(n) && n.name ? [n] : Array.isArray(n) ? n : i, "normalize");
  return {
    always: e(t.always, Or.always),
    idle: e(t.idle, Or.idle),
    hover: e(t.hover, Or.hover),
    dim: e(t.dim, Or.dim)
  };
}
c(Gv, "normalizeConfig");
var Se, $t, st, Ft, Vn, Gn, wt, Dt, vn, Ee, cm, as, um, dm, fm, hm, mm, gm;
const Yr = class Yr {
  /**
   * @param {PlaceableObject} placeable
   * @param {object|undefined} animationConfig  Raw animation config from the await entry
   */
  constructor(e, n) {
    A(this, Ee);
    A(this, Se);
    A(this, $t);
    A(this, st, null);
    A(this, Ft, []);
    A(this, Vn, []);
    A(this, Gn, null);
    A(this, wt, null);
    A(this, Dt, null);
    A(this, vn, 0);
    I(this, Se, e), I(this, $t, Gv(n));
  }
  /** Current animation state name. */
  get state() {
    return p(this, st);
  }
  /**
   * Start animating in the given state.
   * @param {string} [state="idle"]
   */
  start(e = "idle") {
    I(this, st, e), I(this, Gn, (n) => {
      if (p(this, Se).destroyed || !p(this, Se).transform) {
        this.detach();
        return;
      }
      if (!p(this, wt)) {
        if (T(this, Ee, cm).call(this), !p(this, wt)) return;
        T(this, Ee, mm).call(this), T(this, Ee, fm).call(this, p(this, st));
        return;
      }
      p(this, Dt) && T(this, Ee, as).call(this);
      for (const i of p(this, Vn)) i.update(n);
      for (const i of p(this, Ft)) i.update(n);
      T(this, Ee, dm).call(this, n);
    }), canvas.app.ticker.add(p(this, Gn));
  }
  /**
   * Transition to a new state. Behaviours shared between old and new state
   * (matched by name) are kept alive — only the diff is detached/attached.
   * Mesh is restored to canonical before constructing new behaviours so they
   * always capture clean "original" values (no drift). A short blend smooths
   * the visual transition so the canonical restore isn't visible.
   * No-op if already in the requested state.
   * @param {string} state
   */
  setState(e) {
    var f;
    if (e === p(this, st)) return;
    if (!p(this, wt)) {
      I(this, st, e);
      return;
    }
    const n = ((f = p(this, Se).document) == null ? void 0 : f.id) ?? "?", i = de(p(this, Se)), r = p(this, $t)[p(this, st)] ?? p(this, $t).idle ?? ["none"], o = p(this, $t)[e] ?? p(this, $t).idle ?? ["none"], s = r.map((h) => typeof h == "string" ? h : h == null ? void 0 : h.name), a = o.map((h) => typeof h == "string" ? h : h == null ? void 0 : h.name);
    if (console.log(`%c[TileAnimator ${n}] setState: ${p(this, st)} → ${e}`, "color: #44DDFF; font-weight: bold"), console.log(`  old behaviours: [${s.join(", ")}]  →  new: [${a.join(", ")}]`), i && console.log(`  mesh BEFORE detach: pos=(${i.position.x.toFixed(2)}, ${i.position.y.toFixed(2)}) scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)} angle=${i.angle.toFixed(2)}`), p(this, wt)) {
      const h = p(this, wt);
      console.log(`  canonical: pos=(${h.x.toFixed(2)}, ${h.y.toFixed(2)}) scale=(${h.scaleX.toFixed(4)}, ${h.scaleY.toFixed(4)}) alpha=${h.alpha.toFixed(4)} angle=${h.angle.toFixed(2)}`);
    }
    const l = /* @__PURE__ */ new Map();
    for (let h = 0; h < p(this, Ft).length; h++) {
      const m = r[h], g = typeof m == "string" ? m : m == null ? void 0 : m.name;
      g && l.set(g, p(this, Ft)[h]);
    }
    const u = [], d = /* @__PURE__ */ new Set();
    for (const h of o) {
      const m = typeof h == "string" ? h : h.name;
      l.has(m) && !d.has(m) && d.add(m);
    }
    console.log(`  reused: [${[...d].join(", ")}]  detaching: [${[...l.keys()].filter((h) => !d.has(h)).join(", ")}]`), T(this, Ee, um).call(this);
    for (const [h, m] of l)
      d.has(h) || (m.detach(), i && console.log(`  mesh AFTER detach("${h}"): scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)}`));
    T(this, Ee, as).call(this), i && console.log(`  mesh AFTER canonical restore: scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)}`);
    for (const h of o) {
      const m = typeof h == "string" ? h : h.name;
      if (l.has(m) && d.has(m))
        u.push(l.get(m)), d.delete(m), console.log(`  → reuse "${m}"`);
      else {
        const g = typeof h == "string" ? void 0 : h, y = ss(m);
        if (!y) {
          console.warn(`TileAnimator: unknown behaviour "${m}"`);
          continue;
        }
        u.push(y(p(this, Se), g, p(this, wt))), i && console.log(`  → create "${m}" — mesh after factory: scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)} pos=(${i.position.x.toFixed(2)}, ${i.position.y.toFixed(2)})`);
      }
    }
    if (p(this, Dt)) {
      const h = p(this, Dt);
      console.log(`  blend FROM: pos=(${h.x.toFixed(2)}, ${h.y.toFixed(2)}) scale=(${h.scaleX.toFixed(4)}, ${h.scaleY.toFixed(4)}) alpha=${h.alpha.toFixed(4)}`);
    }
    I(this, st, e), I(this, Ft, u);
  }
  /**
   * Full cleanup — detach all behaviours, restore canonical, and remove ticker.
   */
  detach() {
    var n, i;
    p(this, Se).destroyed || !p(this, Se).transform ? (I(this, Ft, []), I(this, Vn, [])) : (T(this, Ee, hm).call(this), T(this, Ee, gm).call(this), T(this, Ee, as).call(this)), I(this, Dt, null), I(this, st, null), p(this, Gn) && ((i = (n = canvas.app) == null ? void 0 : n.ticker) == null || i.remove(p(this, Gn)), I(this, Gn, null));
  }
};
Se = new WeakMap(), $t = new WeakMap(), st = new WeakMap(), Ft = new WeakMap(), Vn = new WeakMap(), Gn = new WeakMap(), wt = new WeakMap(), Dt = new WeakMap(), vn = new WeakMap(), Ee = new WeakSet(), // ── Private ──────────────────────────────────────────────────────────
cm = /* @__PURE__ */ c(function() {
  const e = de(p(this, Se));
  e && I(this, wt, {
    x: e.position.x,
    y: e.position.y,
    scaleX: e.scale.x,
    scaleY: e.scale.y,
    angle: e.angle,
    alpha: e.alpha,
    tint: e.tint
  });
}, "#captureCanonical"), as = /* @__PURE__ */ c(function() {
  const e = de(p(this, Se));
  if (!e || !p(this, wt)) return;
  const n = p(this, wt);
  e.position.x = n.x, e.position.y = n.y, e.scale.x = n.scaleX, e.scale.y = n.scaleY, e.angle = n.angle, e.alpha = n.alpha, e.tint = n.tint;
}, "#restoreCanonical"), /**
 * Snapshot the current (animated) mesh values so the transition blend
 * can lerp FROM here toward the new state's computed values.
 */
um = /* @__PURE__ */ c(function() {
  const e = de(p(this, Se));
  e && (I(this, Dt, {
    x: e.position.x,
    y: e.position.y,
    scaleX: e.scale.x,
    scaleY: e.scale.y,
    angle: e.angle,
    alpha: e.alpha
  }), I(this, vn, 0));
}, "#captureBlendStart"), /**
 * After behaviours compute the new state's mesh values, blend from the
 * pre-transition snapshot toward those values over BLEND_FRAMES using
 * easeOutCubic. This hides the canonical-restore snap entirely.
 */
dm = /* @__PURE__ */ c(function(e) {
  var s, a;
  if (!p(this, Dt)) return;
  I(this, vn, p(this, vn) + e);
  const n = Math.min(p(this, vn) / Yr.BLEND_FRAMES, 1);
  if (n >= 1) {
    const l = ((s = p(this, Se).document) == null ? void 0 : s.id) ?? "?";
    console.log(`%c[TileAnimator ${l}] blend complete`, "color: #88FF88"), I(this, Dt, null);
    return;
  }
  const i = 1 - (1 - n) ** 3, r = de(p(this, Se));
  if (!r) return;
  const o = p(this, Dt);
  if (p(this, vn) <= e * 3) {
    const l = ((a = p(this, Se).document) == null ? void 0 : a.id) ?? "?", u = Math.round(p(this, vn) / e);
    console.log(`  [blend ${l} f${u}] t=${n.toFixed(3)} eased=${i.toFixed(3)} | behaviour→scale=(${r.scale.x.toFixed(4)},${r.scale.y.toFixed(4)}) alpha=${r.alpha.toFixed(4)} | blendFrom→scale=(${o.scaleX.toFixed(4)},${o.scaleY.toFixed(4)}) alpha=${o.alpha.toFixed(4)}`);
  }
  r.position.x = o.x + (r.position.x - o.x) * i, r.position.y = o.y + (r.position.y - o.y) * i, r.scale.x = o.scaleX + (r.scale.x - o.scaleX) * i, r.scale.y = o.scaleY + (r.scale.y - o.scaleY) * i, r.angle = o.angle + (r.angle - o.angle) * i, r.alpha = o.alpha + (r.alpha - o.alpha) * i, p(this, vn) <= e * 3 && console.log(`  [blend result] scale=(${r.scale.x.toFixed(4)},${r.scale.y.toFixed(4)}) alpha=${r.alpha.toFixed(4)} pos=(${r.position.x.toFixed(2)},${r.position.y.toFixed(2)})`);
}, "#applyBlend"), fm = /* @__PURE__ */ c(function(e) {
  I(this, st, e);
  const n = p(this, $t)[e] ?? p(this, $t).idle ?? ["none"];
  for (const i of n) {
    const r = typeof i == "string" ? i : i.name, o = typeof i == "string" ? void 0 : i, s = ss(r);
    if (!s) {
      console.warn(`TileAnimator: unknown behaviour "${r}"`);
      continue;
    }
    p(this, Ft).push(s(p(this, Se), o));
  }
}, "#attachBehaviours"), hm = /* @__PURE__ */ c(function() {
  for (const e of p(this, Ft)) e.detach();
  I(this, Ft, []);
}, "#detachBehaviours"), mm = /* @__PURE__ */ c(function() {
  const e = p(this, $t).always ?? [];
  for (const n of e) {
    const i = typeof n == "string" ? n : n.name, r = typeof n == "string" ? void 0 : n, o = ss(i);
    if (!o) {
      console.warn(`TileAnimator: unknown always behaviour "${i}"`);
      continue;
    }
    p(this, Vn).push(o(p(this, Se), r));
  }
}, "#attachAlwaysBehaviours"), gm = /* @__PURE__ */ c(function() {
  for (const e of p(this, Vn)) e.detach();
  I(this, Vn, []);
}, "#detachAlwaysBehaviours"), c(Yr, "TileAnimator"), /** Frames over which state transitions are blended (easeOutCubic). */
ue(Yr, "BLEND_FRAMES", 8);
let Ri = Yr;
const Wv = "cinematic", il = 5, _c = /* @__PURE__ */ new Set();
function un(t) {
  for (const e of _c)
    try {
      e(t);
    } catch (n) {
      console.error("[cinematic] playback listener error:", n);
    }
}
c(un, "emitPlaybackEvent");
function zv(t) {
  return _c.add(t), () => _c.delete(t);
}
c(zv, "onPlaybackProgress");
let Oe = null, gn = null, jr = null, Ur = null, Ui = 0, pi = null;
function cu(t, e = "default") {
  return `cinematic-progress-${t}-${e}`;
}
c(cu, "progressFlagKey");
function Yv(t, e, n, i) {
  game.user.setFlag(L, cu(t, e), {
    currentSegment: n,
    completedSegments: [...i],
    timestamp: Date.now()
  }).catch(() => {
  });
}
c(Yv, "saveSegmentProgress");
function Nc(t, e = "default") {
  game.user.unsetFlag(L, cu(t, e)).catch(() => {
  });
}
c(Nc, "clearProgress");
function pm(t, e = "default", n = 3e5) {
  const i = game.user.getFlag(L, cu(t, e));
  return !i || typeof i.timestamp != "number" || Date.now() - i.timestamp > n ? null : i.currentSegment ? i : null;
}
c(pm, "getSavedProgress");
function Hi(t, e = "default") {
  return `cinematic-seen-${t}-${e}`;
}
c(Hi, "seenFlagKey");
function Ed(t, e = "default") {
  return !!game.user.getFlag(L, Hi(t, e));
}
c(Ed, "hasSeenCinematic");
function Kv(t, e) {
  var n;
  if (t == null) return null;
  if (typeof t != "object" || Array.isArray(t))
    return console.warn(`[${L}] Cinematic: invalid data for ${e} (expected object). Ignoring.`), null;
  if (t.trigger !== void 0 && typeof t.trigger != "string")
    return console.warn(`[${L}] Cinematic: invalid 'trigger' on ${e} (expected string). Ignoring.`), null;
  if (t.tracking !== void 0 && typeof t.tracking != "boolean")
    return console.warn(`[${L}] Cinematic: invalid 'tracking' on ${e} (expected boolean). Ignoring.`), null;
  if (t.synchronized !== void 0 && typeof t.synchronized != "boolean")
    return console.warn(`[${L}] Cinematic: invalid 'synchronized' on ${e} (expected boolean). Ignoring.`), null;
  if (t.segments) {
    if (typeof t.segments != "object" || Array.isArray(t.segments))
      return console.warn(`[${L}] Cinematic: invalid 'segments' on ${e} (expected object). Ignoring.`), null;
    for (const [i, r] of Object.entries(t.segments)) {
      if (!r || typeof r != "object" || Array.isArray(r)) {
        console.warn(`[${L}] Cinematic: invalid segment "${i}" on ${e}. Removing.`), delete t.segments[i];
        continue;
      }
      if (r.timeline !== void 0 && !Array.isArray(r.timeline)) {
        console.warn(`[${L}] Cinematic: invalid timeline on segment "${i}" of ${e}. Removing.`), delete t.segments[i];
        continue;
      }
      (n = r.timeline) != null && n.length && (r.timeline = r.timeline.filter((o, s) => !o || typeof o != "object" || Array.isArray(o) ? (console.warn(`[${L}] Cinematic: segment "${i}" timeline[${s}] on ${e} is not a valid object, removing.`), !1) : !0));
    }
    if (Object.keys(t.segments).length === 0)
      return console.warn(`[${L}] Cinematic: no valid segments on ${e}. Ignoring.`), null;
  }
  return t.timeline !== void 0 && !Array.isArray(t.timeline) ? (console.warn(`[${L}] Cinematic: invalid 'timeline' on ${e} (expected array). Ignoring.`), null) : t;
}
c(Kv, "validateSingleCinematic");
function Fa(t) {
  const e = t ? game.scenes.get(t) : canvas.scene;
  let n = (e == null ? void 0 : e.getFlag(L, Wv)) ?? null;
  if (n == null) return null;
  if (typeof n != "object" || Array.isArray(n))
    return console.warn(`[${L}] Cinematic: invalid flag data on scene ${e == null ? void 0 : e.id} (expected object). Ignoring.`), null;
  if ((n.version ?? 1) < 3) {
    const { version: i, ...r } = n;
    n = { version: 3, cinematics: { default: r } };
  }
  if (n.version === 3) {
    for (const [i, r] of Object.entries(n.cinematics ?? {}))
      n.cinematics[i] = nn.migrateV3toV4(r);
    n.version = 4;
  }
  if (n.version === 4) {
    for (const [i, r] of Object.entries(n.cinematics ?? {}))
      n.cinematics[i] = nn.migrateV4toV5(r);
    n.version = il;
  }
  if (n.version > il)
    return console.warn(`[${L}] Cinematic: scene ${e == null ? void 0 : e.id} has version ${n.version}, runtime supports up to ${il}. Skipping.`), null;
  if (!n.cinematics || typeof n.cinematics != "object")
    return console.warn(`[${L}] Cinematic: no 'cinematics' map on scene ${e == null ? void 0 : e.id}. Ignoring.`), null;
  for (const [i, r] of Object.entries(n.cinematics)) {
    const o = Kv(r, `scene ${e == null ? void 0 : e.id} cinematic "${i}"`);
    o ? n.cinematics[i] = o : delete n.cinematics[i];
  }
  return Object.keys(n.cinematics).length === 0 ? null : n;
}
c(Fa, "getCinematicData");
function $s(t, e = "default") {
  var i;
  const n = Fa(t);
  return ((i = n == null ? void 0 : n.cinematics) == null ? void 0 : i[e]) ?? null;
}
c($s, "getNamedCinematic");
function Xv(t) {
  const e = Fa(t);
  return e ? Object.keys(e.cinematics) : [];
}
c(Xv, "listCinematicNames");
function Jv() {
  return game.ready ? Promise.resolve() : new Promise((t) => Hooks.once("ready", t));
}
c(Jv, "waitForReady");
async function Qv(t = 1e4) {
  var n, i;
  const e = (i = (n = game.modules.get(L)) == null ? void 0 : n.api) == null ? void 0 : i.tween;
  return e != null && e.Timeline ? e.Timeline : new Promise((r) => {
    const o = Date.now(), s = setTimeout(() => {
      var l, u;
      (u = (l = ui.notifications) == null ? void 0 : l.info) == null || u.call(l, `[${L}] Cinematic: waiting for tween engine...`);
    }, 2e3), a = setInterval(() => {
      var u, d, f, h;
      const l = (d = (u = game.modules.get(L)) == null ? void 0 : u.api) == null ? void 0 : d.tween;
      l != null && l.Timeline ? (clearInterval(a), clearTimeout(s), r(l.Timeline)) : Date.now() - o > t && (clearInterval(a), clearTimeout(s), console.warn(`[${L}] Cinematic: tween API not available after ${t}ms.`), (h = (f = ui.notifications) == null ? void 0 : f.warn) == null || h.call(f, `[${L}] Cinematic: tween engine unavailable — cinematic cannot play.`), r(null));
    }, 200);
  });
}
c(Qv, "waitForTweenAPI");
async function $c(t = 5e3) {
  var e;
  return window.Tagger ?? ((e = game.modules.get("tagger")) == null ? void 0 : e.api) ? !0 : new Promise((n) => {
    const i = Date.now(), r = setInterval(() => {
      var o;
      window.Tagger ?? ((o = game.modules.get("tagger")) == null ? void 0 : o.api) ? (clearInterval(r), n(!0)) : Date.now() - i > t && (clearInterval(r), console.warn(`[${L}] Cinematic: Tagger API not available after ${t}ms.`), n(!1));
    }, 200);
  });
}
c($c, "waitForTagger");
async function Zv(t, e, n) {
  if (!t || !t.event) return;
  const i = { ...t };
  console.log(`[${L}] Cinematic: waiting for gate: ${t.event}`);
  let r = null;
  if (t.event === "tile-click" && t.target && t.animation) {
    const o = e.get(t.target);
    (o == null ? void 0 : o.kind) === "placeable" && o.placeable && (r = new Ri(o.placeable, t.animation), r.start());
  }
  try {
    if (t.timeout && t.timeout > 0) {
      const o = new Promise((a) => setTimeout(a, t.timeout)), s = fc(i, { signal: n.signal, eventBus: null });
      await Promise.race([s, o]);
    } else
      await fc(i, { signal: n.signal, eventBus: null });
  } finally {
    r && r.detach();
  }
}
c(Zv, "processGate");
function ym(t) {
  if (!t.segments) return [];
  const e = [], n = /* @__PURE__ */ new Set();
  let i = t.entry;
  for (; i && typeof i == "string" && t.segments[i] && !n.has(i); )
    n.add(i), e.push(i), i = t.segments[i].next;
  return e;
}
c(ym, "getSegmentOrder");
function Fs(t, e) {
  if (t.setup)
    try {
      Me(t.setup, e);
    } catch (i) {
      console.warn(`[${L}] Cinematic: error applying cinematic-level setup:`, i);
    }
  const n = ym(t);
  for (const i of n) {
    const r = t.segments[i];
    if (r.setup)
      try {
        Me(r.setup, e);
      } catch (o) {
        console.warn(`[${L}] Cinematic: error applying setup for segment "${i}":`, o);
      }
    if (r.landing)
      try {
        Me(r.landing, e);
      } catch (o) {
        console.warn(`[${L}] Cinematic: error applying landing for segment "${i}":`, o);
      }
  }
  if (t.landing)
    try {
      Me(t.landing, e);
    } catch (i) {
      console.warn(`[${L}] Cinematic: error applying cinematic-level landing:`, i);
    }
  canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
}
c(Fs, "applyAllSegmentLandingStates");
async function Vr(t, e = "default", n = null) {
  var w, E, C, O, k, x, $, D;
  const i = t ?? ((w = canvas.scene) == null ? void 0 : w.id);
  if (!i) return;
  const r = `${i}:${e}`;
  if (n || (n = /* @__PURE__ */ new Set()), n.has(r)) {
    console.warn(`[${L}] Cinematic: circular transition detected at "${r}". Stopping chain.`), (C = (E = ui.notifications) == null ? void 0 : E.warn) == null || C.call(E, "Cinematic: circular transition detected, stopping.");
    return;
  }
  n.add(r), (Oe == null ? void 0 : Oe.status) === "running" && Oe.cancel("replaced"), Oe = null, gn && (gn.abort("replaced"), gn = null);
  const o = $s(i, e);
  if (!o) {
    console.warn(`[${L}] Cinematic: no cinematic "${e}" on scene ${i}.`);
    return;
  }
  const s = await Qv();
  if (!s || ((O = canvas.scene) == null ? void 0 : O.id) !== i || (await $c(), ((k = canvas.scene) == null ? void 0 : k.id) !== i)) return;
  const { targets: a, unresolved: l } = Os(o);
  if (console.log(`[${L}] Cinematic "${e}": resolved ${a.size} targets`), l.length && console.warn(`[${L}] Cinematic "${e}": skipping ${l.length} unresolved: ${l.join(", ")}`), a.size === 0) {
    console.warn(`[${L}] Cinematic "${e}": no targets could be resolved on scene ${i}.`);
    return;
  }
  const u = ev(o);
  jr = Zb(u, a), Ur = a;
  const d = pm(i, e), f = new AbortController();
  gn = f;
  const h = o.synchronized === !0 && game.user.isGM, m = ym(o);
  if (m.length === 0) {
    console.warn(`[${L}] Cinematic "${e}": no segments to execute.`);
    return;
  }
  let g = 0;
  const y = /* @__PURE__ */ new Set();
  if (d) {
    const N = d.completedSegments ?? [];
    for (const M of N) y.add(M);
    const F = m.indexOf(d.currentSegment);
    F >= 0 && (g = F, console.log(`[${L}] Cinematic "${e}": resuming from segment "${d.currentSegment}" (${N.length} completed)`));
  }
  if (o.setup)
    try {
      Me(o.setup, a), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    } catch (N) {
      console.error(`[${L}] Cinematic "${e}": error applying cinematic-level setup:`, N);
    }
  for (let N = 0; N < g; N++) {
    const F = m[N], M = o.segments[F];
    if (M.setup)
      try {
        Me(M.setup, a);
      } catch (R) {
        console.warn(`[${L}] Cinematic: error applying setup for completed segment "${F}":`, R);
      }
    if (M.landing)
      try {
        Me(M.landing, a);
      } catch (R) {
        console.warn(`[${L}] Cinematic: error applying landing for completed segment "${F}":`, R);
      }
  }
  let v = !1, b = !1;
  un({ type: "playback-start", sceneName: ((x = canvas.scene) == null ? void 0 : x.name) ?? i });
  try {
    for (let N = g; N < m.length; N++) {
      if (f.signal.aborted) {
        v = !0;
        break;
      }
      if ((($ = canvas.scene) == null ? void 0 : $.id) !== i) {
        v = !0;
        break;
      }
      const F = m[N], M = o.segments[F];
      if (console.log(`[${L}] Cinematic "${e}": entering segment "${F}"`), un({ type: "segment-start", segmentName: F }), Yv(i, e, F, [...y]), M.gate) {
        un({ type: "gate-wait", segmentName: F, gate: M.gate });
        try {
          await Zv(M.gate, a, f);
        } catch (B) {
          if (f.signal.aborted) {
            v = !0;
            break;
          }
          throw B;
        }
        un({ type: "gate-resolved", segmentName: F });
      }
      if (f.signal.aborted) {
        v = !0;
        break;
      }
      if (M.setup)
        try {
          Me(M.setup, a), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
        } catch (B) {
          console.error(`[${L}] Cinematic "${e}": error applying setup for segment "${F}":`, B);
        }
      if ((D = M.timeline) != null && D.length) {
        const B = lu(M.timeline);
        un({ type: "timeline-start", segmentName: F, durationMs: B });
        const { tl: j } = av(
          { setup: {}, timeline: M.timeline },
          a,
          s,
          {
            timelineName: `cinematic-${i}-${e}-${F}`,
            onStepComplete: /* @__PURE__ */ c((V) => {
              un({ type: "step-complete", segmentName: F, stepIndex: V });
            }, "onStepComplete")
          }
        );
        Oe = j.run({
          broadcast: h,
          commit: h
        });
        try {
          await new Promise((V, Y) => {
            j.onComplete(() => V()), j.onCancel(() => Y(new Error("cancelled"))), j.onError((J) => Y(new Error(`timeline error: ${J}`)));
            const oe = /* @__PURE__ */ c(() => Y(new Error("cancelled")), "onAbort");
            f.signal.addEventListener("abort", oe, { once: !0 });
          });
        } catch (V) {
          if (V.message === "cancelled" || f.signal.aborted) {
            v = !0;
            break;
          }
          throw V;
        }
        un({ type: "timeline-end", segmentName: F });
      }
      if (f.signal.aborted) {
        v = !0;
        break;
      }
      if (M.landing)
        try {
          Me(M.landing, a), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
        } catch (B) {
          console.error(`[${L}] Cinematic "${e}": error applying landing for segment "${F}":`, B);
        }
      un({ type: "segment-complete", segmentName: F }), y.add(F);
      const R = M.next;
      if (R && typeof R == "object" && R.scene) {
        const B = R.scene, j = R.segment ?? o.entry;
        console.log(`[${L}] Cinematic "${e}": cross-scene transition to scene ${B}, segment "${j}"`), Oe = null, gn = null, Nc(i, e), cd(), o.tracking !== !1 && await game.user.setFlag(L, Hi(i, e), !0), pi = { sceneId: B, cinematicName: e, visitedChain: n };
        const H = game.scenes.get(B);
        H ? H.view() : (console.warn(`[${L}] Cinematic: cross-scene transition target scene "${B}" not found.`), pi = null);
        return;
      }
    }
  } catch (N) {
    b = !0, console.error(`[${L}] Cinematic "${e}" error on scene ${i}:`, N);
  }
  if (Oe = null, gn = null, Nc(i, e), cd(), jr = null, Ur = null, un({ type: "playback-end", cancelled: !!v }), v) {
    console.log(`[${L}] Cinematic "${e}" cancelled on scene ${i}.`), Fs(o, a);
    return;
  }
  if (b) {
    Fs(o, a);
    return;
  }
  o.tracking !== !1 && await game.user.setFlag(L, Hi(i, e), !0), console.log(`[${L}] Cinematic "${e}" complete on scene ${i}.`);
}
c(Vr, "playCinematic");
async function ew(t, e = "default") {
  var i;
  const n = t ?? ((i = canvas.scene) == null ? void 0 : i.id);
  n && (await game.user.unsetFlag(L, Hi(n, e)), console.log(`[${L}] Cinematic: cleared seen flag for "${e}" on scene ${n}.`));
}
c(ew, "resetCinematic");
async function tw(t, e, n = "default") {
  var o;
  if (!game.user.isGM) return;
  const i = t ?? ((o = canvas.scene) == null ? void 0 : o.id);
  if (!i || !e) return;
  const r = game.users.get(e);
  r && (await r.unsetFlag(L, Hi(i, n)), console.log(`[${L}] Cinematic: cleared seen flag for user ${r.name} on "${n}" scene ${i}.`));
}
c(tw, "resetCinematicForUser");
async function nw(t, e = "default") {
  var o;
  if (!game.user.isGM) return;
  const n = t ?? ((o = canvas.scene) == null ? void 0 : o.id);
  if (!n) return;
  const i = Hi(n, e), r = game.users.map((s) => s.getFlag(L, i) ? s.unsetFlag(L, i) : Promise.resolve());
  await Promise.all(r), console.log(`[${L}] Cinematic: cleared seen flag for all users on "${e}" scene ${n}.`);
}
c(nw, "resetCinematicForAll");
function iw(t, e = "default") {
  var r;
  const n = t ?? ((r = canvas.scene) == null ? void 0 : r.id);
  if (!n) return [];
  const i = Hi(n, e);
  return game.users.map((o) => ({
    userId: o.id,
    name: o.name,
    color: o.color ?? "#888888",
    isGM: o.isGM,
    seen: !!o.getFlag(L, i)
  }));
}
c(iw, "getSeenStatus");
function rw(t, e) {
  var i;
  const n = t ?? ((i = canvas.scene) == null ? void 0 : i.id);
  return e ? $s(n, e) != null : Fa(n) != null;
}
c(rw, "hasCinematic");
function ow() {
  if (!jr || !Ur) {
    console.warn(`[${L}] Cinematic: no snapshot available for revert.`);
    return;
  }
  (Oe == null ? void 0 : Oe.status) === "running" && Oe.cancel("reverted"), Oe = null, gn && (gn.abort("reverted"), gn = null);
  try {
    Me(jr, Ur), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 }), console.log(`[${L}] Cinematic: reverted to pre-cinematic state.`);
  } catch (t) {
    console.error(`[${L}] Cinematic: error during revert:`, t);
  }
  jr = null, Ur = null;
}
c(ow, "revertCinematic");
async function sw() {
  const t = ++Ui;
  if (console.log(`[${L}] Cinematic: canvasReady fired, gen=${t}, game.ready=${game.ready}`), await Jv(), t !== Ui) return;
  console.log(`[${L}] Cinematic: game is ready`);
  const e = canvas.scene;
  if (!e) {
    console.log(`[${L}] Cinematic: no canvas.scene, exiting`);
    return;
  }
  if (pi && pi.sceneId === e.id) {
    const o = pi;
    pi = null, console.log(`[${L}] Cinematic: picking up pending transition to "${o.cinematicName}" on scene ${e.id}`);
    try {
      await Vr(e.id, o.cinematicName, o.visitedChain);
    } catch (s) {
      console.error(`[${L}] Cinematic: error during pending transition playback on scene ${e.id}:`, s);
    }
    return;
  }
  pi = null;
  const n = Fa(e.id);
  if (!n) {
    console.log(`[${L}] Cinematic: no cinematic flag on scene ${e.id}, exiting`);
    return;
  }
  console.log(`[${L}] Cinematic: found ${Object.keys(n.cinematics).length} cinematic(s) on scene ${e.id}`);
  const i = [];
  for (const [o, s] of Object.entries(n.cinematics))
    (!s.trigger || s.trigger === "canvasReady") && i.push({ name: o, data: s });
  if (i.length === 0) {
    console.log(`[${L}] Cinematic: no canvasReady cinematics on scene ${e.id}, exiting`);
    return;
  }
  for (const { name: o } of i) {
    const s = pm(e.id, o);
    if (t !== Ui) return;
    if (s) {
      console.log(`[${L}] Cinematic "${o}": found saved progress at segment "${s.currentSegment}", resuming...`);
      try {
        await Vr(e.id, o);
      } catch (a) {
        console.error(`[${L}] Cinematic "${o}": error during resumed playback on scene ${e.id}:`, a);
      }
      return;
    }
  }
  let r = null;
  for (const { name: o, data: s } of i)
    if (!(s.tracking !== !1 && Ed(e.id, o))) {
      r = { name: o, data: s };
      break;
    }
  if (!r) {
    if (console.log(`[${L}] Cinematic: all canvasReady cinematics already seen on scene ${e.id}`), aw(e.id, i), (Oe == null ? void 0 : Oe.status) === "running" && Oe.cancel("already-seen"), Oe = null, await $c(), t !== Ui) return;
    for (const { name: o, data: s } of i)
      try {
        const { targets: a } = Os(s);
        Fs(s, a);
      } catch (a) {
        console.error(`[${L}] Cinematic "${o}": error applying landing states (already seen) on scene ${e.id}:`, a);
      }
    canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    return;
  }
  if (t === Ui && (console.log(`[${L}] Cinematic: playing first unseen cinematic "${r.name}"...`), await $c(), t === Ui)) {
    for (const { name: o, data: s } of i) {
      if (o === r.name) continue;
      if (s.tracking !== !1 && Ed(e.id, o))
        try {
          const { targets: l } = Os(s);
          Fs(s, l);
        } catch (l) {
          console.error(`[${L}] Cinematic "${o}": error applying landing states (already seen) on scene ${e.id}:`, l);
        }
    }
    try {
      await Vr(e.id, r.name);
    } catch (o) {
      console.error(`[${L}] Cinematic "${r.name}": error during playback on scene ${e.id}:`, o);
    }
  }
}
c(sw, "onCanvasReady$2");
function aw(t, e) {
  for (const { name: n } of e)
    Nc(t, n);
}
c(aw, "clearAllCanvasReadyProgress");
function lw(t = 3e5) {
  var i;
  const e = (i = game.user.flags) == null ? void 0 : i[L];
  if (!e) return;
  const n = Date.now();
  for (const r of Object.keys(e)) {
    if (!r.startsWith("cinematic-progress-")) continue;
    const o = e[r];
    if (!o || typeof o.timestamp != "number") {
      game.user.unsetFlag(L, r).catch(() => {
      });
      continue;
    }
    n - o.timestamp > t && (console.log(`[${L}] Cinematic: cleaning up stale progress flag "${r}" (age: ${n - o.timestamp}ms)`), game.user.unsetFlag(L, r).catch(() => {
    }));
  }
}
c(lw, "cleanupStaleProgressFlags");
function cw() {
  Hooks.on("getSceneControlButtons", (t) => {
    if (!game.user.isGM) return;
    const e = Array.isArray(t) ? t : t instanceof Map ? Array.from(t.values()) : Object.values(t);
    if (!e.length) return;
    const n = e.find((s) => (s == null ? void 0 : s.name) === "tiles") ?? e.find((s) => (s == null ? void 0 : s.name) === "tokens" || (s == null ? void 0 : s.name) === "token") ?? e[0];
    if (!n) return;
    const i = n.tools, r = "eidolonCinematicEditor";
    if (Array.isArray(i) && i.some((s) => (s == null ? void 0 : s.name) === r) || i instanceof Map && i.has(r)) return;
    const o = {
      name: r,
      title: "Cinematic Editor",
      icon: "fa-solid fa-film",
      button: !0,
      toggle: !1,
      visible: !0,
      onClick: /* @__PURE__ */ c(() => {
        new Lc({ scene: canvas.scene }).render(!0);
      }, "onClick")
    };
    Array.isArray(i) ? i.push(o) : i instanceof Map ? i.set(r, o) : i && typeof i == "object" ? i[r] = o : n.tools = [o];
  });
}
c(cw, "registerEditorButton");
function uw() {
  Hooks.on("canvasReady", sw), cw(), Hooks.once("ready", () => {
    lw();
    const t = game.modules.get(L);
    t.api || (t.api = {}), t.api.cinematic = {
      play: Vr,
      reset: ew,
      resetForUser: tw,
      resetForAll: nw,
      getSeenStatus: iw,
      has: rw,
      get: $s,
      list: Xv,
      revert: ow,
      onPlaybackProgress: zv,
      TileAnimator: Ri,
      registerBehaviour: pe,
      getBehaviour: ss,
      trigger: /* @__PURE__ */ c(async (e, n, i = "default") => {
        var s;
        const r = n ?? ((s = canvas.scene) == null ? void 0 : s.id);
        if (!r) return;
        const o = $s(r, i);
        o && (o.trigger && o.trigger !== e || await Vr(r, i));
      }, "trigger")
    }, console.log(`[${L}] Cinematic API registered (v5).`);
  });
}
c(uw, "registerCinematicHooks");
function Fc(t, e) {
  const n = Math.abs(t.width), i = Math.abs(t.height), r = n / 2, o = i / 2;
  let s = e.x - (t.x + r), a = e.y - (t.y + o);
  if (t.rotation !== 0) {
    const l = Math.toRadians(t.rotation), u = Math.cos(l), d = Math.sin(l), f = u * s + d * a, h = u * a - d * s;
    s = f, a = h;
  }
  return s += r, a += o, s >= 0 && s <= n && a >= 0 && a <= i;
}
c(Fc, "pointWithinTile");
xa("tile-click", (t, e) => t.target ? new Promise((n, i) => {
  var m;
  if (e.signal.aborted) return i(e.signal.reason ?? "aborted");
  const r = Na(t.target);
  if (!((m = r == null ? void 0 : r.placeables) != null && m.length))
    return i(new Error(`await tile-click: no placeables found for "${t.target}"`));
  const o = r.placeables, s = [];
  for (const { placeable: g } of o) {
    const y = new Ri(g, t.animation);
    y.start("idle"), s.push({ placeable: g, animator: y });
  }
  const a = document.getElementById("board");
  let l = null;
  const u = /* @__PURE__ */ c((g) => {
    const y = canvas.activeLayer;
    if (!y) return;
    const v = y.toLocal(g);
    if (!v || isNaN(v.x) || isNaN(v.y)) return;
    let b = !1;
    for (const { placeable: w, animator: E } of s)
      Fc(w.document, v) ? (b = !0, E.state !== "hover" && E.setState("hover")) : E.state === "hover" && E.setState("idle");
    b ? l === null && (l = document.body.style.cursor, document.body.style.cursor = "pointer") : l !== null && (document.body.style.cursor = l, l = null);
  }, "onPointerMove");
  a == null || a.addEventListener("pointermove", u);
  const d = /* @__PURE__ */ c((g) => {
    if (g.button !== 0) return;
    const y = canvas.activeLayer;
    if (!y) return;
    const v = y.toLocal(g);
    isNaN(v.x) || isNaN(v.y) || !o.filter(({ doc: w }) => Fc(w, v)).sort((w, E) => (E.doc.sort ?? 0) - (w.doc.sort ?? 0))[0] || (g.stopPropagation(), g.preventDefault(), h(), n());
  }, "onPointerDown");
  a == null || a.addEventListener("pointerdown", d, { capture: !0 });
  const f = /* @__PURE__ */ c(() => {
    h(), i(e.signal.reason ?? "aborted");
  }, "onAbort");
  e.signal.addEventListener("abort", f, { once: !0 });
  function h() {
    a == null || a.removeEventListener("pointerdown", d, { capture: !0 }), a == null || a.removeEventListener("pointermove", u), e.signal.removeEventListener("abort", f);
    for (const { animator: g } of s)
      g.detach();
    l !== null ? (document.body.style.cursor = l, l = null) : document.body.style.cursor = "";
  }
  c(h, "cleanup");
}) : Promise.reject(new Error('await tile-click: "target" is required')));
uw();
function dw() {
  Hooks.once("ready", () => {
    const t = game.modules.get(L);
    t.api || (t.api = {}), t.api.picker = {
      /** Open the picker window. Returns Promise<string[] | null>. */
      open: /* @__PURE__ */ c((e) => Ns.open(e), "open"),
      /** Resolve a selector string to documents. */
      resolveSelector: Na,
      /** Parse a selector string into { type, value }. */
      parseSelector: au,
      /** Build a selector string from { type, value }. */
      buildSelector: Yb,
      /** Build a tag selector from tags array + mode. */
      buildTagSelector: Nh,
      /** Canvas highlight utilities. */
      highlight: {
        add: _s,
        remove: hr,
        has: Vh,
        clearAll: os
      }
    }, console.log(`[${L}] Placeable Picker API registered.`);
  });
}
c(dw, "registerPlaceablePickerHooks");
dw();
const kr = "canvas-popup", fw = 100;
function hw(t) {
  const e = canvas.stage.worldTransform, n = document.getElementById("board"), i = n == null ? void 0 : n.getBoundingClientRect(), r = (i == null ? void 0 : i.left) ?? 0, o = (i == null ? void 0 : i.top) ?? 0;
  return {
    x: e.a * t.x + e.c * t.y + e.tx + r,
    y: e.b * t.x + e.d * t.y + e.ty + o
  };
}
c(hw, "canvasToScreen");
function mw() {
  var t, e;
  return ((e = (t = canvas.stage) == null ? void 0 : t.scale) == null ? void 0 : e.x) ?? 1;
}
c(mw, "getZoom");
function rl(t, e) {
  var n;
  return e === "grid" ? t * (((n = canvas.grid) == null ? void 0 : n.size) ?? 100) : t;
}
c(rl, "resolveUnit");
function gw(t, e) {
  let n = !1;
  function i(r) {
    n && r.button === 0 && (t.contains(r.target) || e());
  }
  return c(i, "handler"), requestAnimationFrame(() => {
    n = !0;
  }), document.addEventListener("pointerdown", i, !0), () => {
    document.removeEventListener("pointerdown", i, !0);
  };
}
c(gw, "attachClickOutside");
function pw(t, e) {
  let n = !1;
  function i(r) {
    n && r.button === 2 && (t.contains(r.target) || e());
  }
  return c(i, "handler"), requestAnimationFrame(() => {
    n = !0;
  }), document.addEventListener("pointerdown", i, !0), () => {
    document.removeEventListener("pointerdown", i, !0);
  };
}
c(pw, "attachRightClickOutside");
function yw(t, e) {
  function n(i) {
    i.key === "Escape" && (i.preventDefault(), i.stopPropagation(), e());
  }
  return c(n, "handler"), document.addEventListener("keydown", n, !0), () => {
    document.removeEventListener("keydown", n, !0);
  };
}
c(yw, "attachEscape");
const ol = /* @__PURE__ */ new Set(), qo = 8, Sd = 0.5, Iu = class Iu {
  /**
   * @param {object} options
   * @param {{ x: number, y: number } | { placeable: PlaceableObject } | { document: object }} options.anchor
   * @param {{ x?: number, y?: number }} [options.offset]
   * @param {"left" | "center" | "right"} [options.anchorX]
   * @param {"top" | "center" | "bottom"} [options.anchorY]
   * @param {"grid" | "canvas" | "screen"} [options.sizeUnit]
   * @param {{ clickOutside?: boolean, rightClickOutside?: boolean, escape?: boolean }} [options.dismiss]
   * @param {string} [options.cssClass]
   * @param {boolean} [options.animate]
   * @param {number | "anchor"} [options.width]
   * @param {boolean} [options.clampToViewport]
   * @param {HTMLElement | string} [options.content]
   */
  constructor(e = {}) {
    var n, i, r, o, s;
    this._anchor = this._resolveAnchor(e.anchor), this._offset = { x: ((n = e.offset) == null ? void 0 : n.x) ?? 0, y: ((i = e.offset) == null ? void 0 : i.y) ?? 0 }, this._anchorX = e.anchorX ?? "left", this._anchorY = e.anchorY ?? "top", this._sizeUnit = e.sizeUnit ?? "grid", this._dismiss = {
      clickOutside: ((r = e.dismiss) == null ? void 0 : r.clickOutside) ?? !0,
      rightClickOutside: ((o = e.dismiss) == null ? void 0 : o.rightClickOutside) ?? !1,
      escape: ((s = e.dismiss) == null ? void 0 : s.escape) ?? !0
    }, this._cssClass = e.cssClass ?? "", this._animate = e.animate ?? !0, this._width = e.width ?? null, this._clampToViewport = e.clampToViewport ?? !0, this._initialContent = e.content ?? null, this.element = null, this.isOpen = !1, this._cleanups = [], this._listeners = /* @__PURE__ */ new Map(), this._hookId = null, this._tickerFn = null, this._lastScreenPos = { x: -99999, y: -99999 };
  }
  // ── Public API ────────────────────────────────────────────────────────
  /**
   * Append popup to the DOM and start tracking.
   * @returns {this}
   */
  mount() {
    var o;
    if (this.isOpen) return this;
    const e = document.createElement("div");
    e.className = kr, this._cssClass && e.classList.add(...this._cssClass.split(/\s+/)), e.style.position = "fixed", e.style.zIndex = fw;
    const n = document.createElement("div");
    n.className = `${kr}__content`, e.appendChild(n), this.element = e, this._contentWrap = n;
    const i = this._resolveWidth();
    i != null && (n.style.width = `${i}px`, n.style.minWidth = "0", n.style.boxSizing = "border-box"), this._initialContent && this.setContent(this._initialContent), document.body.appendChild(e), this.reposition(), this._animate ? requestAnimationFrame(() => {
      this.element && this.element.classList.add(`${kr}--visible`);
    }) : e.classList.add(`${kr}--visible`), this._hookId = Hooks.on("canvasPan", () => this.reposition()), this._anchor.placeable && ((o = canvas.app) != null && o.ticker) && (this._tickerFn = () => this.reposition(), canvas.app.ticker.add(this._tickerFn));
    const r = /* @__PURE__ */ c((s) => {
      this._emit("dismiss", s), this.destroy();
    }, "dismissFn");
    return this._dismiss.clickOutside && this._cleanups.push(gw(e, () => r("clickOutside"))), this._dismiss.rightClickOutside && this._cleanups.push(pw(e, () => r("rightClickOutside"))), this._dismiss.escape && this._cleanups.push(yw(e, () => r("escape"))), this.isOpen = !0, ol.add(this), this._emit("open"), this;
  }
  /**
   * Remove from DOM and clean up everything. Idempotent.
   */
  destroy() {
    var n;
    if (!this.isOpen) return;
    this.isOpen = !1, ol.delete(this);
    for (const i of this._cleanups) i();
    this._cleanups.length = 0, this._hookId != null && (Hooks.off("canvasPan", this._hookId), this._hookId = null), this._tickerFn && ((n = canvas.app) != null && n.ticker) && (canvas.app.ticker.remove(this._tickerFn), this._tickerFn = null);
    const e = this.element;
    if (e) {
      if (this._animate) {
        e.classList.remove(`${kr}--visible`);
        const i = /* @__PURE__ */ c(() => {
          e.removeEventListener("transitionend", i), e.remove();
        }, "onEnd");
        e.addEventListener("transitionend", i), setTimeout(() => e.remove(), 200);
      } else
        e.remove();
      this.element = null, this._contentWrap = null, this._emit("close");
    }
  }
  /**
   * Replace inner content.
   * @param {HTMLElement | string} content
   */
  setContent(e) {
    if (!this._contentWrap) {
      this._initialContent = e;
      return;
    }
    this._contentWrap.innerHTML = "", typeof e == "string" ? this._contentWrap.innerHTML = e : e instanceof HTMLElement && this._contentWrap.appendChild(e);
  }
  /**
   * Change the anchor point.
   * @param {{ x: number, y: number } | { placeable: PlaceableObject } | { document: object }} newAnchor
   */
  setAnchor(e) {
    var r, o;
    const n = !!this._anchor.placeable;
    this._anchor = this._resolveAnchor(e);
    const i = !!this._anchor.placeable;
    n && !i && this._tickerFn && ((r = canvas.app) != null && r.ticker) ? (canvas.app.ticker.remove(this._tickerFn), this._tickerFn = null) : !n && i && this.isOpen && ((o = canvas.app) != null && o.ticker) && !this._tickerFn && (this._tickerFn = () => this.reposition(), canvas.app.ticker.add(this._tickerFn)), this._lastScreenPos = { x: -99999, y: -99999 }, this.reposition();
  }
  /**
   * Force recalculate position. Auto-called on canvasPan and ticker.
   */
  reposition() {
    if (!this.element) return;
    const e = this._getAnchorCanvasPoint();
    if (!e) return;
    const n = mw(), i = this._sizeUnit !== "screen", r = rl(this._offset.x, this._sizeUnit), o = rl(this._offset.y, this._sizeUnit), s = {
      x: e.x + r,
      y: e.y + o
    }, a = hw(s);
    if (Math.abs(a.x - this._lastScreenPos.x) < Sd && Math.abs(a.y - this._lastScreenPos.y) < Sd)
      return;
    this._lastScreenPos = { x: a.x, y: a.y };
    const l = this.element, u = i ? n : 1;
    i ? (l.style.transformOrigin = `${this._anchorX} ${this._anchorY}`, l.style.transform = `scale(${u})`) : (l.style.transform = "", l.style.transformOrigin = "");
    let d = 0, f = 0;
    const h = l.getBoundingClientRect();
    this._anchorX === "center" ? d = -h.width / 2 : this._anchorX === "right" && (d = -h.width), this._anchorY === "center" ? f = -h.height / 2 : this._anchorY === "bottom" && (f = -h.height);
    let m = a.x + d, g = a.y + f;
    if (this._clampToViewport) {
      const y = window.innerWidth - h.width - qo, v = window.innerHeight - h.height - qo;
      m = Math.max(qo, Math.min(m, y)), g = Math.max(qo, Math.min(g, v));
    }
    l.style.left = `${m}px`, l.style.top = `${g}px`, this._emit("reposition", { x: m, y: g });
  }
  // ── Event emitter ─────────────────────────────────────────────────────
  /**
   * Register a lifecycle callback.
   * @param {"open" | "close" | "dismiss" | "reposition"} event
   * @param {Function} fn
   * @returns {this}
   */
  on(e, n) {
    return this._listeners.has(e) || this._listeners.set(e, /* @__PURE__ */ new Set()), this._listeners.get(e).add(n), this;
  }
  /**
   * Unregister a lifecycle callback.
   * @param {"open" | "close" | "dismiss" | "reposition"} event
   * @param {Function} fn
   * @returns {this}
   */
  off(e, n) {
    var i;
    return (i = this._listeners.get(e)) == null || i.delete(n), this;
  }
  // ── Static ────────────────────────────────────────────────────────────
  /**
   * Destroy all mounted popup instances.
   */
  static destroyAll() {
    for (const e of [...ol])
      e.destroy();
  }
  // ── Internal ──────────────────────────────────────────────────────────
  /**
   * Normalize anchor input to a consistent internal shape.
   * @param {object} anchor
   * @returns {{ x?: number, y?: number, placeable?: PlaceableObject }}
   */
  _resolveAnchor(e) {
    if (!e) throw new Error("CanvasPopup: anchor is required");
    if (e.placeable) return { placeable: e.placeable };
    if (e.document) {
      const n = e.document.object;
      if (n) return { placeable: n };
      throw new Error("CanvasPopup: anchor.document has no rendered object on the canvas");
    }
    if (e.x != null && e.y != null) return { x: e.x, y: e.y };
    throw new Error("CanvasPopup: anchor must be { x, y }, { placeable }, or { document }");
  }
  /**
   * Resolve the width option to canvas pixels.
   * @returns {number | null}
   */
  _resolveWidth() {
    return this._width == null ? null : this._width === "anchor" ? this._getAnchorSize().width : rl(this._width, this._sizeUnit);
  }
  /**
   * Get the anchor placeable's canvas-pixel size.
   * Works across tiles, drawings, tokens, etc.
   * @returns {{ width: number, height: number }}
   */
  _getAnchorSize() {
    var i, r, o;
    const e = this._anchor.placeable;
    if (!e) return { width: 0, height: 0 };
    const n = e.document;
    return ((i = n == null ? void 0 : n.shape) == null ? void 0 : i.width) != null ? { width: n.shape.width, height: n.shape.height } : (n == null ? void 0 : n.width) != null ? { width: n.width, height: n.height } : (n == null ? void 0 : n.width) != null ? { width: n.width * (((r = canvas.grid) == null ? void 0 : r.size) ?? 100), height: n.height * (((o = canvas.grid) == null ? void 0 : o.size) ?? 100) } : { width: 0, height: 0 };
  }
  /**
   * Get the current canvas-space anchor point.
   * @returns {{ x: number, y: number } | null}
   */
  _getAnchorCanvasPoint() {
    if (this._anchor.placeable) {
      const e = this._anchor.placeable, n = e.document;
      return n ? { x: n.x ?? e.x ?? 0, y: n.y ?? e.y ?? 0 } : { x: e.x ?? 0, y: e.y ?? 0 };
    }
    return { x: this._anchor.x, y: this._anchor.y };
  }
  /**
   * Emit a lifecycle event.
   * @param {string} event
   * @param  {...any} args
   */
  _emit(e, ...n) {
    const i = this._listeners.get(e);
    if (i)
      for (const r of i)
        try {
          r(this, ...n);
        } catch (o) {
          console.error(`[CanvasPopup] Error in '${e}' listener:`, o);
        }
  }
};
c(Iu, "CanvasPopup");
let Ds = Iu;
const fi = "canvas-popup-options";
function bw({ sections: t = [] } = {}) {
  const e = /* @__PURE__ */ new Map(), n = document.createElement("div");
  n.className = fi;
  for (const a of t) {
    const l = document.createElement("div");
    l.className = `${fi}__section`;
    const u = document.createElement("div");
    u.className = `${fi}__header`, u.textContent = a.label, l.appendChild(u);
    for (const d of a.items) {
      const f = document.createElement("div");
      f.className = `${fi}__item`, d.active && f.classList.add(`${fi}__item--active`), f.dataset.key = a.key, f.dataset.value = d.value;
      const h = document.createElement("span");
      h.className = `${fi}__dot`, f.appendChild(h);
      const m = document.createElement("span");
      m.className = `${fi}__label`, m.textContent = d.label, f.appendChild(m), f.addEventListener("click", (g) => {
        i("select", a.key, d.value, d, g);
      }), f.addEventListener("mouseenter", () => {
        i("hover", a.key, d.value, d);
      }), f.addEventListener("mouseleave", () => {
        i("hoverEnd", a.key, d.value, d);
      }), l.appendChild(f);
    }
    n.appendChild(l);
  }
  function i(a, ...l) {
    const u = e.get(a);
    if (u)
      for (const d of u)
        try {
          d(...l);
        } catch (f) {
          console.error(`[OptionList] Error in '${a}' listener:`, f);
        }
  }
  c(i, "emit");
  function r(a, l) {
    e.has(a) || e.set(a, /* @__PURE__ */ new Set()), e.get(a).add(l);
  }
  c(r, "on");
  function o(a, l) {
    var u;
    (u = e.get(a)) == null || u.delete(l);
  }
  c(o, "off");
  function s() {
    e.clear(), n.remove();
  }
  return c(s, "destroy"), { element: n, on: r, off: o, destroy: s };
}
c(bw, "createOptionList");
function vw() {
  Hooks.once("ready", () => {
    const t = game.modules.get(L);
    t.api || (t.api = {}), t.api.canvasPopup = {
      CanvasPopup: Ds,
      content: { createOptionList: bw }
    }, console.log(`[${L}] Canvas Popup API registered.`);
  }), Hooks.on("canvasTearDown", () => Ds.destroyAll());
}
c(vw, "registerCanvasPopupHooks");
vw();
function ww(t, e) {
  const n = t.shape;
  if (!n) return !1;
  const i = t.x ?? 0, r = t.y ?? 0, o = n.width ?? 0, s = n.height ?? 0, a = t.rotation ?? 0, l = i + o / 2, u = r + s / 2;
  let d = e.x - l, f = e.y - u;
  if (a !== 0) {
    const h = Math.toRadians(a), m = Math.cos(h), g = Math.sin(h), y = m * d + g * f, v = m * f - g * d;
    d = y, f = v;
  }
  switch (d += o / 2, f += s / 2, n.type) {
    case "r":
      return d >= 0 && d <= o && f >= 0 && f <= s;
    case "e": {
      const h = o / 2, m = s / 2;
      if (h <= 0 || m <= 0) return !1;
      const g = (d - h) / h, y = (f - m) / m;
      return g * g + y * y <= 1;
    }
    case "p": {
      const h = n.points;
      return !Array.isArray(h) || h.length < 6 ? !1 : Ew(d, f, h);
    }
    case "f":
      return d >= 0 && d <= o && f >= 0 && f <= s;
    default:
      return !1;
  }
}
c(ww, "pointWithinDrawing");
function Ew(t, e, n) {
  let i = !1;
  const r = n.length;
  for (let o = 0, s = r - 2; o < r; s = o, o += 2) {
    const a = n[o], l = n[o + 1], u = n[s], d = n[s + 1];
    l > e != d > e && t < (u - a) * (e - l) / (d - l) + a && (i = !i);
  }
  return i;
}
c(Ew, "pointInPolygon");
const Gr = "eidolon-utilities", Sw = "tile-interactions", Cw = "tile-animations", Tw = "idle-animation";
function Lw(t) {
  const e = t.type ?? "tile-prop";
  return e === "tile-tint" ? { name: "tween-tint", fromColor: t.fromColor, toColor: t.toColor, mode: t.mode, period: t.period, easing: t.easing } : e === "tile-scale" ? { name: "tween-scale", fromScale: t.fromScale, toScale: t.toScale, period: t.period, easing: t.easing } : { name: "tween-prop", attribute: t.attribute, from: t.from, to: t.to, period: t.period, easing: t.easing };
}
c(Lw, "migrateIdleTweenToAlways");
function uu(t) {
  var u, d, f;
  const e = (u = t == null ? void 0 : t.getFlag) == null ? void 0 : u.call(t, Gr, Cw);
  if (e) return e;
  const n = (d = t == null ? void 0 : t.getFlag) == null ? void 0 : d.call(t, Gr, Tw), i = (f = t == null ? void 0 : t.getFlag) == null ? void 0 : f.call(t, Gr, Sw);
  let r = [], o = [], s = [], a = [];
  if (n) {
    let h;
    Array.isArray(n) ? h = n : typeof n == "object" && "0" in n ? h = Object.values(n) : typeof n == "object" && (n.type || n.attribute) ? h = [n] : h = [], r = h.filter((m) => m && typeof m == "object").map(Lw);
  }
  return i && (i.hover && (Array.isArray(i.hover) ? s = i.hover : typeof i.hover == "object" && (o = Array.isArray(i.hover.idle) ? i.hover.idle : [], s = Array.isArray(i.hover.enter) ? i.hover.enter : [])), Array.isArray(i.click) && i.click.length && (a = i.click)), r.length > 0 || o.length > 0 || s.length > 0 || a.length > 0 ? { always: r, idle: o, hover: s, click: a } : null;
}
c(uu, "readUnifiedConfig");
const Sn = /* @__PURE__ */ new Map(), ni = /* @__PURE__ */ new Map(), Cd = /* @__PURE__ */ new WeakMap(), Wr = /* @__PURE__ */ new Set();
let Ht = null, Je = null, Pt = null, en = null, tn = null;
function bm(t) {
  const e = canvas.activeLayer;
  if (!e) return null;
  const n = e.toLocal(t);
  return !n || Number.isNaN(n.x) || Number.isNaN(n.y) ? null : n;
}
c(bm, "canvasToLocal");
function vm(t) {
  let e = null, n = -1 / 0;
  for (const [i, r] of Sn) {
    if (!(r.placeableType === "drawing" ? ww(r.doc, t) : Fc(r.doc, t))) continue;
    const s = (r.doc.sort ?? 0) + (r.placeableType === "drawing" ? 1e9 : 0);
    s > n && (e = r, n = s);
  }
  return e;
}
c(vm, "hitTest");
function Iw(t) {
  var e, n;
  return {
    always: t.always ?? [],
    idle: (e = t.idle) != null && e.length ? t.idle : ["none"],
    hover: (n = t.hover) != null && n.length ? t.hover : ["none"]
  };
}
c(Iw, "buildAnimatorConfig");
function du(t, e, n) {
  Ao(t);
  const i = Iw(n), r = new Ri(e, i);
  r.start("idle"), ni.set(t, r);
}
c(du, "startHoverAnimator");
function Ao(t) {
  const e = ni.get(t);
  e && (e.detach(), ni.delete(t));
}
c(Ao, "stopHoverAnimator");
function sl(t, e, n, i) {
  return e.type === "tile-tint" ? { uuid: t, toColor: n ? e.toColor : e.fromColor, mode: e.mode } : e.type === "tile-scale" ? {
    uuid: t,
    toScale: n ? e.toScale : e.fromScale,
    ...i
  } : { uuid: t, attribute: e.attribute, value: n ? e.to : e.from };
}
c(sl, "buildClickParams");
function Ow(t) {
  const e = t._source.width, n = t._source.height, i = t._source.x, r = t._source.y;
  return {
    baseWidth: e,
    baseHeight: n,
    centerX: i + e / 2,
    centerY: r + n / 2
  };
}
c(Ow, "captureRefGeometry");
async function kw(t, e) {
  const n = t.uuid, i = e.type ?? "tile-prop", r = vr(i);
  if (!r) {
    console.warn(`[${Gr}] tile-interactions: unknown tween type "${i}"`);
    return;
  }
  const o = e.period ?? 300, s = e.easing ?? "easeOutCubic", a = e.mode ?? "bounce", l = i === "tile-scale" ? Ow(t) : null;
  if (a === "toggle") {
    const d = !(Cd.get(t) ?? !1);
    await r.execute(
      sl(n, e, d, l),
      { durationMS: o, easing: s, commit: !0 }
    ), Cd.set(t, d);
  } else {
    const u = o / 2;
    await r.execute(
      sl(n, e, !0, l),
      { durationMS: u, easing: s, commit: !1 }
    ), await r.execute(
      sl(n, e, !1, l),
      { durationMS: u, easing: s, commit: !1 }
    );
  }
}
c(kw, "playClickAnimation");
async function Aw(t) {
  var n, i, r, o, s;
  const e = t.doc.id;
  if (!Wr.has(e)) {
    Wr.add(e);
    try {
      if (Ao(e), (n = t.clickConfig) != null && n.length) {
        const a = t.clickConfig.map((l) => kw(t.doc, l));
        await Promise.all(a);
      }
      if (t.macroUuid) {
        const a = await fromUuid(t.macroUuid);
        a ? a.execute({ placeable: t.placeable }) : console.warn(`[${Gr}] tile-interactions: macro not found: ${t.macroUuid}`);
      }
    } finally {
      Wr.delete(e), t.animConfig && (((i = t.animConfig.always) == null ? void 0 : i.length) > 0 || ((r = t.animConfig.idle) == null ? void 0 : r.length) > 0 || ((o = t.animConfig.hover) == null ? void 0 : o.length) > 0) && (du(e, t.placeable, t.animConfig), Ht === e && ((s = ni.get(e)) == null || s.setState("hover")));
    }
  }
}
c(Aw, "handleClick");
function wm(t) {
  var l, u, d;
  const e = bm(t);
  if (!e) return;
  const n = vm(e), i = (n == null ? void 0 : n.doc.id) ?? null;
  if (i === Ht) return;
  if (Ht) {
    const f = ni.get(Ht);
    f && f.setState("idle");
  }
  if (i) {
    const f = ni.get(i);
    f && f.setState("hover");
  }
  Ht = i;
  const r = (l = canvas.tokens) == null ? void 0 : l.active, o = (u = n == null ? void 0 : n.animConfig) == null ? void 0 : u.cursor, s = r && i && (o === !0 || o !== !1 && (((d = n.clickConfig) == null ? void 0 : d.length) || n.macroUuid)), a = document.getElementById("board");
  s ? (Je === null && (Je = (a == null ? void 0 : a.style.cursor) ?? ""), a && (a.style.cursor = "pointer")) : Je !== null && (a && (a.style.cursor = Je), Je = null);
}
c(wm, "onPointerMove");
function Em(t) {
  var i, r;
  if (t.button !== 0 || !((i = canvas.tokens) != null && i.active)) return;
  const e = bm(t);
  if (!e) return;
  const n = vm(e);
  n && (!((r = n.clickConfig) != null && r.length) && !n.macroUuid || Aw(n));
}
c(Em, "onPointerDown");
function Sm() {
  if (Ht) {
    const t = ni.get(Ht);
    t && t.setState("idle"), Ht = null;
  }
  if (Je !== null) {
    const t = document.getElementById("board");
    t && (t.style.cursor = Je), Je = null;
  }
}
c(Sm, "onPointerLeave");
function Td(t, e, n) {
  var a, l, u;
  const i = uu(t);
  if (!i) return;
  const r = ((a = i.always) == null ? void 0 : a.length) > 0 || ((l = i.idle) == null ? void 0 : l.length) > 0 || ((u = i.hover) == null ? void 0 : u.length) > 0, o = Array.isArray(i.click) && i.click.length ? i.click : null, s = i.macro || null;
  !r && !o && !s || (Sn.set(t.id, { doc: t, placeable: e, animConfig: i, clickConfig: o, macroUuid: s, placeableType: n }), r && du(t.id, e, i));
}
c(Td, "registerPlaceable");
function Cm() {
  var i, r;
  for (const o of ni.keys())
    Ao(o);
  if (Sn.clear(), Wr.clear(), Ht = null, Je !== null) {
    const o = document.getElementById("board");
    o && (o.style.cursor = Je), Je = null;
  }
  const t = document.getElementById("board");
  Pt && (t == null || t.removeEventListener("pointermove", Pt), Pt = null), en && (t == null || t.removeEventListener("pointerdown", en), en = null), tn && (t == null || t.removeEventListener("pointerleave", tn), tn = null);
  const e = (i = canvas.tiles) == null ? void 0 : i.placeables;
  if (Array.isArray(e))
    for (const o of e)
      Td(o.document, o, "tile");
  const n = (r = canvas.drawings) == null ? void 0 : r.placeables;
  if (Array.isArray(n))
    for (const o of n)
      Td(o.document, o, "drawing");
  Sn.size !== 0 && (Pt = wm, en = Em, tn = Sm, t == null || t.addEventListener("pointermove", Pt), t == null || t.addEventListener("pointerdown", en), t == null || t.addEventListener("pointerleave", tn));
}
c(Cm, "rebuild");
function Mw(t) {
  Tm(t, "tile");
}
c(Mw, "updateTile");
function xw(t) {
  fu(t);
}
c(xw, "removeTile");
function _w(t) {
  Tm(t, "drawing");
}
c(_w, "updateDrawing");
function Nw(t) {
  fu(t);
}
c(Nw, "removeDrawing");
function Tm(t, e) {
  var l, u, d;
  const n = t.id, i = uu(t), r = i && (((l = i.always) == null ? void 0 : l.length) > 0 || ((u = i.idle) == null ? void 0 : u.length) > 0 || ((d = i.hover) == null ? void 0 : d.length) > 0), o = i && Array.isArray(i.click) && i.click.length ? i.click : null, s = (i == null ? void 0 : i.macro) || null;
  if (!r && !o && !s) {
    fu(t);
    return;
  }
  Ao(n);
  const a = t.object;
  if (!a) {
    Sn.delete(n);
    return;
  }
  Sn.set(n, { doc: t, placeable: a, animConfig: i, clickConfig: o, macroUuid: s, placeableType: e }), r && du(n, a, i), $w();
}
c(Tm, "updatePlaceable");
function fu(t) {
  const e = t.id;
  if (Ao(e), Sn.delete(e), Wr.delete(e), Ht === e && (Ht = null, Je !== null)) {
    const n = document.getElementById("board");
    n && (n.style.cursor = Je), Je = null;
  }
  if (Sn.size === 0) {
    const n = document.getElementById("board");
    Pt && (n == null || n.removeEventListener("pointermove", Pt), Pt = null), en && (n == null || n.removeEventListener("pointerdown", en), en = null), tn && (n == null || n.removeEventListener("pointerleave", tn), tn = null);
  }
}
c(fu, "removePlaceable");
function $w() {
  if (Sn.size === 0 || Pt) return;
  const t = document.getElementById("board");
  t && (Pt = wm, en = Em, tn = Sm, t.addEventListener("pointermove", Pt), t.addEventListener("pointerdown", en), t.addEventListener("pointerleave", tn));
}
c($w, "ensureListeners");
function Wi(t, e, n) {
  const i = document.createElement("div");
  i.classList.add("form-group");
  const r = document.createElement("label");
  r.textContent = t;
  const o = document.createElement("select");
  o.classList.add(e);
  for (const s of n) {
    const a = document.createElement("option");
    a.value = s.value, a.textContent = s.label, s.selected && (a.selected = !0), o.appendChild(a);
  }
  return i.append(r, o), i;
}
c(Wi, "buildSelectGroup");
function zi(t, e, n, i = {}) {
  const r = document.createElement("div");
  r.classList.add("form-group");
  const o = document.createElement("label");
  o.textContent = t;
  const s = document.createElement("input");
  s.type = "number", s.classList.add(e), s.value = String(n);
  for (const [a, l] of Object.entries(i)) s.setAttribute(a, l);
  return r.append(o, s), r;
}
c(zi, "buildNumberGroup");
function Dc(t, e, n) {
  const i = document.createElement("div");
  i.classList.add("form-group");
  const r = document.createElement("label");
  r.textContent = t;
  const o = document.createElement("div");
  o.classList.add("idle-anim__color-wrapper");
  const s = document.createElement("input");
  s.type = "color", s.classList.add(e), s.value = n;
  const a = document.createElement("input");
  return a.type = "text", a.classList.add(`${e}-text`), a.value = n, a.maxLength = 7, s.addEventListener("input", () => {
    a.value = s.value;
  }), a.addEventListener("change", () => {
    /^#[0-9a-f]{6}$/i.test(a.value) && (s.value = a.value);
  }), o.append(s, a), i.append(r, o), i;
}
c(Dc, "buildColorGroup");
let se = null;
function al() {
  for (const t of document.querySelectorAll(".idle-anim__slot--insert-before, .idle-anim__slot--insert-after"))
    t.classList.remove("idle-anim__slot--insert-before", "idle-anim__slot--insert-after");
}
c(al, "clearInsertIndicators");
function Ld(t) {
  for (const e of document.querySelectorAll(".idle-anim__slots"))
    e.classList.toggle("idle-anim__slots--drag-active", t);
}
c(Ld, "setDragActive");
function Ps(t, e) {
  t.dispatchEvent(new CustomEvent("slot-reorder", { detail: { card: e } }));
}
c(Ps, "notifyReorder");
function Lm(t, { dropGroup: e, handleSelector: n = ".idle-anim__slot-header" }) {
  t.setAttribute("draggable", "true");
  let i = !1;
  t.addEventListener("pointerdown", (r) => {
    i = !!r.target.closest(n);
  }), t.addEventListener("dragstart", (r) => {
    if (!i) {
      r.preventDefault();
      return;
    }
    se = { card: t, sourceContainer: t.parentElement, group: e, insertMode: null, insertTarget: null }, t.classList.add("is-dragging"), Ld(!0), r.dataTransfer.effectAllowed = "move", r.dataTransfer.setData("text/plain", "");
  }), t.addEventListener("dragover", (r) => {
    if (!se || se.group !== e || se.card === t) return;
    r.preventDefault(), r.dataTransfer.dropEffect = "move";
    const o = t.getBoundingClientRect(), s = o.top + o.height / 2, a = r.clientY < s ? "before" : "after";
    (se.insertTarget !== t || se.insertMode !== a) && (al(), t.classList.add(a === "before" ? "idle-anim__slot--insert-before" : "idle-anim__slot--insert-after"), se.insertTarget = t, se.insertMode = a);
  }), t.addEventListener("dragleave", () => {
    t.classList.remove("idle-anim__slot--insert-before", "idle-anim__slot--insert-after"), (se == null ? void 0 : se.insertTarget) === t && (se.insertTarget = null, se.insertMode = null);
  }), t.addEventListener("drop", (r) => {
    if (r.preventDefault(), r.stopPropagation(), al(), !se || se.group !== e || se.card === t) return;
    const o = se.card, s = se.sourceContainer, a = t.parentElement;
    se.insertMode === "after" ? a.insertBefore(o, t.nextSibling) : a.insertBefore(o, t), Ps(a, o), s !== a && Ps(s, o), se = null;
  }), t.addEventListener("dragend", () => {
    t.classList.remove("is-dragging"), al(), Ld(!1);
    for (const r of document.querySelectorAll(".idle-anim__slots--drag-over"))
      r.classList.remove("idle-anim__slots--drag-over");
    se = null;
  });
}
c(Lm, "makeDraggable");
function Im(t, { dropGroup: e, onDrop: n }) {
  t.addEventListener("dragover", (i) => {
    !se || se.group !== e || (i.preventDefault(), i.dataTransfer.dropEffect = "move");
  }), t.addEventListener("dragenter", (i) => {
    !se || se.group !== e || (i.preventDefault(), t.classList.add("idle-anim__slots--drag-over"));
  }), t.addEventListener("dragleave", (i) => {
    i.relatedTarget && t.contains(i.relatedTarget) || t.classList.remove("idle-anim__slots--drag-over");
  }), t.addEventListener("drop", (i) => {
    if (i.preventDefault(), t.classList.remove("idle-anim__slots--drag-over"), !se || se.group !== e) return;
    const r = se.card, o = se.sourceContainer;
    t.appendChild(r), Ps(t, r), o !== t && Ps(o, r), se = null;
  }), t.addEventListener("slot-reorder", (i) => {
    n == null || n(i.detail.card, t);
  });
}
c(Im, "makeDropContainer");
const Bo = "eidolon-utilities", Id = "tile-animations", Fw = "tile-interactions", Dw = "idle-animation", Pw = "eidolon-idle-animation", Rw = "fa-solid fa-wave-pulse", Om = [
  { value: "float", label: "Float" },
  { value: "pulse", label: "Pulse" },
  { value: "scale", label: "Scale" },
  { value: "glow", label: "Glow" },
  { value: "wobble", label: "Wobble" },
  { value: "colorCycle", label: "Color Cycle" },
  { value: "spin", label: "Spin" },
  { value: "bounce", label: "Bounce" },
  { value: "borderTrace", label: "Border Trace" },
  { value: "shimmer", label: "Shimmer" },
  { value: "breathe", label: "Breathe" },
  { value: "tiltFollow", label: "Tilt Follow" },
  { value: "slideReveal", label: "Slide Reveal" },
  { value: "embers", label: "Embers" },
  { value: "runeGlow", label: "Rune Glow" },
  { value: "ripple", label: "Ripple" },
  { value: "frostEdge", label: "Frost Edge" },
  { value: "shadowLift", label: "Shadow Lift" }
], Hw = [
  { value: "tween-prop", label: "Numeric" },
  { value: "tween-tint", label: "Tint" },
  { value: "tween-scale", label: "Scale" }
], km = {
  float: [
    { key: "speed", label: "Speed", type: "number", default: 0.04, attrs: { step: "0.01", min: "0.001" } },
    { key: "amplitude", label: "Amplitude (px)", type: "number", default: 3, attrs: { step: "1", min: "1" } }
  ],
  pulse: [
    { key: "minAlpha", label: "Min Alpha", type: "number", default: 0.6, attrs: { step: "0.05", min: "0", max: "1" } },
    { key: "maxAlpha", label: "Max Alpha", type: "number", default: 1, attrs: { step: "0.05", min: "0", max: "1" } },
    { key: "speed", label: "Speed", type: "number", default: 0.05, attrs: { step: "0.01", min: "0.001" } }
  ],
  scale: [
    { key: "factor", label: "Factor", type: "number", default: 1.12, attrs: { step: "0.01", min: "0.5", max: "3" } },
    { key: "durationFrames", label: "Duration (frames)", type: "number", default: 15, attrs: { step: "1", min: "1" } },
    { key: "easing", label: "Easing", type: "select", default: "easeOutCubic" }
  ],
  glow: [
    { key: "color", label: "Color", type: "color", default: "#44DDFF" },
    { key: "alpha", label: "Alpha", type: "number", default: 0.5, attrs: { step: "0.05", min: "0", max: "1" } },
    { key: "blur", label: "Blur", type: "number", default: 8, attrs: { step: "1", min: "1", max: "32" } },
    { key: "pulseSpeed", label: "Pulse Speed", type: "number", default: 0.03, attrs: { step: "0.01", min: "0" } }
  ],
  wobble: [
    { key: "speed", label: "Speed", type: "number", default: 0.15, attrs: { step: "0.01", min: "0.001" } },
    { key: "angle", label: "Angle (°)", type: "number", default: 2.5, attrs: { step: "0.5", min: "0.1", max: "45" } }
  ],
  colorCycle: [
    { key: "speed", label: "Speed", type: "number", default: 5e-3, attrs: { step: "0.001", min: "0.001" } },
    { key: "saturation", label: "Saturation", type: "number", default: 0.6, attrs: { step: "0.05", min: "0", max: "1" } },
    { key: "lightness", label: "Lightness", type: "number", default: 0.6, attrs: { step: "0.05", min: "0", max: "1" } }
  ],
  spin: [
    { key: "speed", label: "Speed (°/frame)", type: "number", default: 0.5, attrs: { step: "0.1", min: "-10", max: "10" } }
  ],
  bounce: [
    { key: "speed", label: "Speed", type: "number", default: 0.02, attrs: { step: "0.005", min: "0.001" } },
    { key: "amplitude", label: "Amplitude (px)", type: "number", default: 6, attrs: { step: "1", min: "1" } }
  ],
  borderTrace: [
    { key: "speed", label: "Speed (px/frame)", type: "number", default: 1.5, attrs: { step: "0.1", min: "0.1" } },
    { key: "length", label: "Trail Length (px)", type: "number", default: 60, attrs: { step: "5", min: "5" } },
    { key: "color", label: "Color", type: "color", default: "#44DDFF" },
    { key: "alpha", label: "Alpha", type: "number", default: 0.8, attrs: { step: "0.05", min: "0", max: "1" } },
    { key: "lineWidth", label: "Line Width", type: "number", default: 2, attrs: { step: "1", min: "1", max: "10" } }
  ],
  shimmer: [
    { key: "speed", label: "Speed", type: "number", default: 1, attrs: { step: "0.1", min: "0.1" } },
    { key: "bandWidth", label: "Band Width (px)", type: "number", default: 40, attrs: { step: "5", min: "5" } },
    { key: "alpha", label: "Alpha", type: "number", default: 0.15, attrs: { step: "0.05", min: "0", max: "1" } },
    { key: "pause", label: "Pause (frames)", type: "number", default: 120, attrs: { step: "10", min: "0" } }
  ],
  breathe: [
    { key: "factor", label: "Factor", type: "number", default: 1.03, attrs: { step: "0.01", min: "1.001", max: "1.2" } },
    { key: "speed", label: "Speed", type: "number", default: 0.02, attrs: { step: "0.005", min: "0.001" } }
  ],
  tiltFollow: [
    { key: "maxAngle", label: "Max Angle (°)", type: "number", default: 3, attrs: { step: "0.5", min: "0.5", max: "15" } },
    { key: "smoothing", label: "Smoothing", type: "number", default: 0.15, attrs: { step: "0.05", min: "0.01", max: "1" } }
  ],
  slideReveal: [
    { key: "offsetX", label: "Offset X (px)", type: "number", default: 0, attrs: { step: "5" } },
    { key: "offsetY", label: "Offset Y (px)", type: "number", default: 20, attrs: { step: "5" } },
    { key: "durationFrames", label: "Duration (frames)", type: "number", default: 20, attrs: { step: "1", min: "1" } },
    { key: "easing", label: "Easing", type: "select", default: "easeOutCubic" },
    { key: "delay", label: "Delay (frames)", type: "number", default: 0, attrs: { step: "1", min: "0" } }
  ],
  embers: [
    { key: "count", label: "Count", type: "number", default: 12, attrs: { step: "1", min: "1", max: "50" } },
    { key: "speed", label: "Speed", type: "number", default: 0.5, attrs: { step: "0.1", min: "0.1" } },
    { key: "color", label: "Color", type: "color", default: "#FF6600" },
    { key: "alpha", label: "Alpha", type: "number", default: 0.6, attrs: { step: "0.05", min: "0", max: "1" } },
    { key: "size", label: "Size (px)", type: "number", default: 2, attrs: { step: "0.5", min: "0.5", max: "10" } }
  ],
  runeGlow: [
    { key: "dots", label: "Dots", type: "number", default: 3, attrs: { step: "1", min: "1", max: "12" } },
    { key: "speed", label: "Speed", type: "number", default: 1.2, attrs: { step: "0.1", min: "0.1" } },
    { key: "color", label: "Color 1", type: "color", default: "#44DDFF" },
    { key: "color2", label: "Color 2", type: "color", default: "#8844FF" },
    { key: "radius", label: "Dot Radius (px)", type: "number", default: 3, attrs: { step: "0.5", min: "0.5", max: "10" } },
    { key: "alpha", label: "Alpha", type: "number", default: 0.7, attrs: { step: "0.05", min: "0", max: "1" } }
  ],
  ripple: [
    { key: "rings", label: "Max Rings", type: "number", default: 3, attrs: { step: "1", min: "1", max: "10" } },
    { key: "interval", label: "Spawn Interval (frames)", type: "number", default: 30, attrs: { step: "5", min: "5" } },
    { key: "speed", label: "Speed", type: "number", default: 1.5, attrs: { step: "0.1", min: "0.1" } },
    { key: "color", label: "Color", type: "color", default: "#44DDFF" },
    { key: "alpha", label: "Alpha", type: "number", default: 0.4, attrs: { step: "0.05", min: "0", max: "1" } },
    { key: "lineWidth", label: "Line Width", type: "number", default: 1.5, attrs: { step: "0.5", min: "0.5", max: "5" } }
  ],
  frostEdge: [
    { key: "segments", label: "Segments", type: "number", default: 20, attrs: { step: "1", min: "5", max: "60" } },
    { key: "maxLength", label: "Max Length (px)", type: "number", default: 15, attrs: { step: "1", min: "3", max: "50" } },
    { key: "color", label: "Color", type: "color", default: "#AADDFF" },
    { key: "alpha", label: "Alpha", type: "number", default: 0.5, attrs: { step: "0.05", min: "0", max: "1" } },
    { key: "growSpeed", label: "Grow Speed", type: "number", default: 0.02, attrs: { step: "0.005", min: "0.001" } }
  ],
  shadowLift: [
    { key: "offsetY", label: "Offset Y (px)", type: "number", default: 6, attrs: { step: "1", min: "1", max: "20" } },
    { key: "blur", label: "Blur", type: "number", default: 6, attrs: { step: "1", min: "1", max: "20" } },
    { key: "alpha", label: "Alpha", type: "number", default: 0.35, attrs: { step: "0.05", min: "0", max: "1" } },
    { key: "color", label: "Color", type: "color", default: "#000000" },
    { key: "durationFrames", label: "Duration (frames)", type: "number", default: 12, attrs: { step: "1", min: "1" } },
    { key: "easing", label: "Easing", type: "select", default: "easeOutCubic" }
  ],
  // Tween-as-behaviour param defs
  "tween-prop": [
    { key: "attribute", label: "Attribute", type: "select", default: "alpha", options: [
      { value: "alpha", label: "Alpha (Opacity)" },
      { value: "rotation", label: "Rotation" }
    ] },
    { key: "from", label: "From", type: "number", default: 0.85, attrs: { step: "0.01" } },
    { key: "to", label: "To", type: "number", default: 1, attrs: { step: "0.01" } },
    { key: "period", label: "Period (ms)", type: "number", default: 1500, attrs: { min: "100", step: "100" } },
    { key: "easing", label: "Easing", type: "select", default: "easeInOutCosine" }
  ],
  "tween-tint": [
    { key: "fromColor", label: "From", type: "color", default: "#ffffff" },
    { key: "toColor", label: "To", type: "color", default: "#ffcc88" },
    { key: "mode", label: "Interpolation", type: "select", default: "oklch", options: "interpolation" },
    { key: "period", label: "Period (ms)", type: "number", default: 3e3, attrs: { min: "100", step: "100" } },
    { key: "easing", label: "Easing", type: "select", default: "easeInOutCosine" }
  ],
  "tween-scale": [
    { key: "fromScale", label: "From", type: "number", default: 0.95, attrs: { step: "0.01", min: "0.01" } },
    { key: "toScale", label: "To", type: "number", default: 1.05, attrs: { step: "0.01", min: "0.01" } },
    { key: "period", label: "Period (ms)", type: "number", default: 2e3, attrs: { min: "100", step: "100" } },
    { key: "easing", label: "Easing", type: "select", default: "easeInOutCosine" }
  ]
}, Yi = {
  attribute: "alpha",
  from: 1,
  to: 0.5,
  period: 300,
  mode: "bounce"
}, Zi = {
  fromColor: "#ffffff",
  toColor: "#ffaa00",
  period: 500,
  mode: "bounce"
}, ls = {
  type: "tile-scale",
  fromScale: 1,
  toScale: 1.2,
  period: 300,
  easing: "easeOutCubic",
  mode: "bounce"
}, Am = [
  { value: "alpha", label: "Alpha (Opacity)" },
  { value: "rotation", label: "Rotation" },
  { value: "texture.rotation", label: "Texture Rotation" }
];
let Mn = null;
function qw(t) {
  var e;
  return (t == null ? void 0 : t.document) ?? ((e = t == null ? void 0 : t.object) == null ? void 0 : e.document) ?? (t == null ? void 0 : t.object) ?? null;
}
c(qw, "getPlaceableDocument");
function Bw(t, e) {
  const n = document.createElement("div");
  n.classList.add("form-group");
  const i = document.createElement("label");
  i.textContent = "Type", n.appendChild(i);
  const r = document.createElement("select");
  r.classList.add(e);
  const o = document.createElement("optgroup");
  o.label = "Effects";
  for (const a of Om) {
    const l = document.createElement("option");
    l.value = a.value, l.textContent = a.label, a.value === t && (l.selected = !0), o.appendChild(l);
  }
  r.appendChild(o);
  const s = document.createElement("optgroup");
  s.label = "Tweens";
  for (const a of Hw) {
    const l = document.createElement("option");
    l.value = a.value, l.textContent = a.label, a.value === t && (l.selected = !0), s.appendChild(l);
  }
  return r.appendChild(s), n.appendChild(r), n;
}
c(Bw, "buildEffectTypeSelect");
function Od(t) {
  if (!t) return "";
  const e = t.name ?? "float";
  if (e === "tween-prop")
    return `Tween ${t.attribute ?? "alpha"} ${t.from ?? "?"}→${t.to ?? "?"} (${t.period ?? "?"}ms)`;
  if (e === "tween-tint")
    return `Tween Tint ${t.fromColor ?? "?"}→${t.toColor ?? "?"} (${t.period ?? "?"}ms)`;
  if (e === "tween-scale") {
    const i = t.fromScale != null ? `${Math.round(t.fromScale * 100)}%` : "?", r = t.toScale != null ? `${Math.round(t.toScale * 100)}%` : "?";
    return `Tween Scale ${i}→${r} (${t.period ?? "?"}ms)`;
  }
  const n = Om.find((i) => i.value === e);
  return (n == null ? void 0 : n.label) ?? e;
}
c(Od, "summarizeEffectConfig");
function kd(t, e, n, i) {
  const r = t.name ?? "float", o = iu(), s = dr(), a = document.createElement("div");
  a.classList.add("idle-anim__slot", "is-collapsed", n), a.dataset.index = String(e);
  const l = document.createElement("div");
  l.classList.add("idle-anim__slot-header");
  const u = document.createElement("i");
  u.classList.add("fa-solid", "fa-chevron-right", "idle-anim__slot-chevron");
  const d = document.createElement("span");
  d.classList.add("idle-anim__slot-title"), d.textContent = `${i} ${e + 1}`;
  const f = document.createElement("span");
  f.classList.add("idle-anim__slot-summary"), f.textContent = Od(t);
  const h = document.createElement("button");
  h.type = "button", h.classList.add("idle-anim__slot-remove"), h.innerHTML = '<i class="fa-solid fa-xmark"></i>', h.title = "Remove effect", l.append(u, d, f, h), a.appendChild(l);
  const m = document.createElement("div");
  m.classList.add("idle-anim__slot-body");
  const g = Bw(r, "ti-effect__type");
  m.appendChild(g);
  const y = document.createElement("div");
  y.classList.add("idle-anim__type-fields"), m.appendChild(y);
  function v(w, E) {
    y.innerHTML = "";
    const C = km[w];
    if (C)
      for (const O of C) {
        const k = E[O.key] ?? O.default;
        if (O.type === "color")
          y.appendChild(Dc(O.label, `ti-effect__${O.key}`, k));
        else if (O.type === "select") {
          let x;
          O.options === "interpolation" ? x = s.map(($) => ({ value: $, label: $, selected: $ === k })) : Array.isArray(O.options) ? x = O.options.map(($) => ({ value: $.value, label: $.label, selected: $.value === k })) : x = o.map(($) => ({ value: $, label: $, selected: $ === k })), y.appendChild(Wi(O.label, `ti-effect__${O.key}`, x));
        } else
          y.appendChild(zi(O.label, `ti-effect__${O.key}`, k, O.attrs ?? {}));
      }
  }
  c(v, "renderParams"), v(r, t), a.appendChild(m);
  const b = a.querySelector(".ti-effect__type");
  return b == null || b.addEventListener("change", () => {
    v(b.value, {});
  }), l.addEventListener("click", (w) => {
    if (!w.target.closest(".idle-anim__slot-remove") && (a.classList.toggle("is-collapsed"), a.classList.contains("is-collapsed"))) {
      const E = Mm(a);
      E && (f.textContent = Od(E));
    }
  }), h.addEventListener("click", (w) => {
    w.stopPropagation();
    const E = a.parentElement;
    a.remove(), E && Da(E, n, i);
  }), Lm(a, { dropGroup: "effect" }), a;
}
c(kd, "buildEffectSlot");
function Mm(t) {
  var r;
  const e = ((r = t.querySelector(".ti-effect__type")) == null ? void 0 : r.value) ?? "float", n = km[e], i = { name: e };
  if (n)
    for (const o of n) {
      const s = t.querySelector(`.ti-effect__${o.key}`);
      if (s)
        if (o.type === "color")
          i[o.key] = s.value;
        else if (o.type === "select")
          i[o.key] = s.value;
        else {
          const a = Number.parseFloat(s.value);
          Number.isNaN(a) || (i[o.key] = a);
        }
    }
  return i;
}
c(Mm, "readEffectSlot");
function Ad(t) {
  if (!t) return "";
  const e = t.type ?? "tile-prop", n = t.mode ?? "bounce", i = n.charAt(0).toUpperCase() + n.slice(1);
  if (e === "tile-tint")
    return `${i} Tint ${t.fromColor ?? "?"} → ${t.toColor ?? "?"} (${t.period ?? "?"}ms)`;
  if (e === "tile-scale") {
    const s = t.fromScale != null ? `${Math.round(t.fromScale * 100)}%` : "?", a = t.toScale != null ? `${Math.round(t.toScale * 100)}%` : "?";
    return `${i} Scale ${s} → ${a} (${t.period ?? "?"}ms)`;
  }
  const r = Am.find((s) => s.value === t.attribute), o = (r == null ? void 0 : r.label) ?? t.attribute ?? "?";
  return `${i} ${o} ${t.from ?? "?"} → ${t.to ?? "?"} (${t.period ?? "?"}ms)`;
}
c(Ad, "summarizeClickConfig");
function Md(t, e) {
  const n = t.type ?? "tile-prop", i = t.mode ?? "bounce", r = iu(), o = document.createElement("div");
  o.classList.add("idle-anim__slot", "is-collapsed", "ti-click-slot"), o.dataset.index = String(e);
  const s = document.createElement("div");
  s.classList.add("idle-anim__slot-header");
  const a = document.createElement("i");
  a.classList.add("fa-solid", "fa-chevron-right", "idle-anim__slot-chevron");
  const l = document.createElement("span");
  l.classList.add("idle-anim__slot-title"), l.textContent = `Animation ${e + 1}`;
  const u = document.createElement("span");
  u.classList.add("idle-anim__slot-summary"), u.textContent = Ad(t);
  const d = document.createElement("button");
  d.type = "button", d.classList.add("idle-anim__slot-remove"), d.innerHTML = '<i class="fa-solid fa-xmark"></i>', d.title = "Remove animation", s.append(a, l, u, d), o.appendChild(s);
  const f = document.createElement("div");
  f.classList.add("idle-anim__slot-body");
  const h = document.createElement("div");
  h.classList.add("idle-anim__range-row"), h.appendChild(Wi("Mode", "ti-click__mode", [
    { value: "bounce", label: "Bounce", selected: i === "bounce" },
    { value: "toggle", label: "Toggle", selected: i === "toggle" }
  ])), h.appendChild(Wi("Type", "ti-click__type", [
    { value: "tile-prop", label: "Numeric", selected: n === "tile-prop" },
    { value: "tile-tint", label: "Tint", selected: n === "tile-tint" },
    { value: "tile-scale", label: "Scale", selected: n === "tile-scale" }
  ])), f.appendChild(h);
  const m = document.createElement("div");
  m.classList.add("idle-anim__type-fields"), f.appendChild(m);
  function g(w, E) {
    if (m.innerHTML = "", w === "tile-tint") {
      const C = dr(), O = E.fromColor ?? Zi.fromColor, k = E.toColor ?? Zi.toColor, x = E.mode ?? "oklch", $ = document.createElement("div");
      $.classList.add("idle-anim__range-row"), $.appendChild(Dc("From", "ti-click__from-color", O)), $.appendChild(Dc("To", "ti-click__to-color", k)), m.appendChild($), m.appendChild(Wi(
        "Interpolation",
        "ti-click__color-mode",
        C.map((D) => ({ value: D, label: D, selected: D === x }))
      ));
    } else if (w === "tile-scale") {
      const C = E.fromScale ?? ls.fromScale, O = E.toScale ?? ls.toScale, k = document.createElement("div");
      k.classList.add("idle-anim__range-row"), k.appendChild(zi("From", "ti-click__from-scale", C, { step: "0.01", min: "0.01" })), k.appendChild(zi("To", "ti-click__to-scale", O, { step: "0.01", min: "0.01" })), m.appendChild(k);
      const x = document.createElement("p");
      x.classList.add("idle-anim__hint"), x.textContent = "1.0 = original size. Scales from center.", m.appendChild(x);
    } else {
      const C = E.attribute ?? Yi.attribute, O = E.from ?? Yi.from, k = E.to ?? Yi.to;
      m.appendChild(Wi(
        "Attribute",
        "ti-click__attribute",
        Am.map(($) => ({ value: $.value, label: $.label, selected: $.value === C }))
      ));
      const x = document.createElement("div");
      x.classList.add("idle-anim__range-row"), x.appendChild(zi("From", "ti-click__from", O, { step: "0.01" })), x.appendChild(zi("To", "ti-click__to", k, { step: "0.01" })), m.appendChild(x);
    }
  }
  c(g, "renderTypeFields"), g(n, t);
  const y = t.period ?? (n === "tile-tint" ? Zi.period : Yi.period), v = t.easing ?? "easeOutCubic";
  f.appendChild(zi("Period (ms)", "ti-click__period", y, { min: "50", step: "50" })), f.appendChild(Wi(
    "Easing",
    "ti-click__easing",
    r.map((w) => ({ value: w, label: w, selected: w === v }))
  )), o.appendChild(f);
  const b = o.querySelector(".ti-click__type");
  return b == null || b.addEventListener("change", () => {
    const w = b.value;
    g(w, w === "tile-tint" ? Zi : w === "tile-scale" ? ls : Yi);
  }), s.addEventListener("click", (w) => {
    if (!w.target.closest(".idle-anim__slot-remove") && (o.classList.toggle("is-collapsed"), o.classList.contains("is-collapsed"))) {
      const E = xm(o);
      E && (u.textContent = Ad(E));
    }
  }), d.addEventListener("click", (w) => {
    w.stopPropagation();
    const E = o.parentElement;
    o.remove(), E && Da(E, "ti-click-slot", "Animation");
  }), Lm(o, { dropGroup: "click" }), o;
}
c(Md, "buildClickSlot");
function xm(t) {
  var u, d, f, h, m, g, y, v, b, w, E, C, O, k;
  const e = ((u = t.querySelector(".ti-click__type")) == null ? void 0 : u.value) ?? "tile-prop", n = ((d = t.querySelector(".ti-click__mode")) == null ? void 0 : d.value) ?? "bounce", i = Number.parseInt((f = t.querySelector(".ti-click__period")) == null ? void 0 : f.value, 10), r = ((h = t.querySelector(".ti-click__easing")) == null ? void 0 : h.value) ?? "easeOutCubic";
  if (!i || i <= 0) return null;
  const o = { mode: n, period: i, easing: r };
  if (e === "tile-tint") {
    const x = ((m = t.querySelector(".ti-click__from-color")) == null ? void 0 : m.value) ?? ((g = t.querySelector(".ti-click__from-color-text")) == null ? void 0 : g.value) ?? Zi.fromColor, $ = ((y = t.querySelector(".ti-click__to-color")) == null ? void 0 : y.value) ?? ((v = t.querySelector(".ti-click__to-color-text")) == null ? void 0 : v.value) ?? Zi.toColor, D = ((b = t.querySelector(".ti-click__color-mode")) == null ? void 0 : b.value) ?? "oklch";
    return { type: "tile-tint", fromColor: x, toColor: $, mode: D, ...o };
  }
  if (e === "tile-scale") {
    const x = Number.parseFloat((w = t.querySelector(".ti-click__from-scale")) == null ? void 0 : w.value), $ = Number.parseFloat((E = t.querySelector(".ti-click__to-scale")) == null ? void 0 : E.value);
    return Number.isNaN(x) || Number.isNaN($) || x <= 0 || $ <= 0 ? null : { type: "tile-scale", fromScale: x, toScale: $, ...o };
  }
  const s = ((C = t.querySelector(".ti-click__attribute")) == null ? void 0 : C.value) ?? Yi.attribute, a = Number.parseFloat((O = t.querySelector(".ti-click__from")) == null ? void 0 : O.value), l = Number.parseFloat((k = t.querySelector(".ti-click__to")) == null ? void 0 : k.value);
  return Number.isNaN(a) || Number.isNaN(l) ? null : { type: "tile-prop", attribute: s, from: a, to: l, ...o };
}
c(xm, "readClickSlot");
function Da(t, e, n) {
  t.querySelectorAll(`.${e}`).forEach((r, o) => {
    r.dataset.index = String(o);
    const s = r.querySelector(".idle-anim__slot-title");
    s && (s.textContent = `${n} ${o + 1}`);
  });
}
c(Da, "renumberSlots");
function ll(t, { heading: e, hint: n, configs: i, slotClass: r, titlePrefix: o, dropGroup: s, defaultEffect: a }) {
  const l = document.createElement("div");
  l.classList.add("ti-section-heading");
  const u = document.createElement("h3");
  u.textContent = e, l.appendChild(u);
  const d = document.createElement("div");
  d.classList.add("idle-anim__slots", `${r}s`);
  const f = document.createElement("button");
  f.type = "button", f.classList.add("ti-section-heading__add"), f.innerHTML = '<i class="fa-solid fa-plus"></i>', f.title = `Add ${e.toLowerCase()} effect`, f.addEventListener("click", () => {
    const g = d.querySelectorAll(`.${r}`).length, y = kd(a, g, r, o);
    y.classList.remove("is-collapsed"), d.appendChild(y);
  }), l.appendChild(f), t.appendChild(l);
  const h = document.createElement("p");
  h.classList.add("idle-anim__hint"), h.textContent = n, t.appendChild(h);
  for (let g = 0; g < i.length; g++)
    d.appendChild(kd(i[g], g, r, o));
  t.appendChild(d);
  const m = ["ti-always-slot", "ti-idle-slot", "ti-hover-slot"];
  return Im(d, {
    dropGroup: s,
    onDrop(g) {
      if (g.parentElement === d)
        for (const y of m)
          y !== r && g.classList.contains(y) && g.classList.replace(y, r);
      Da(d, r, o);
    }
  }), d;
}
c(ll, "buildEffectCategory");
function jw(t) {
  const e = uu(t) ?? { always: [], idle: [], hover: [], click: [] }, n = document.createElement("section");
  n.classList.add("eidolon-tile-interactions"), ll(n, {
    heading: "Always",
    hint: "Runs continuously, ignores pointer state.",
    configs: e.always ?? [],
    slotClass: "ti-always-slot",
    titlePrefix: "Effect",
    dropGroup: "effect",
    defaultEffect: { name: "embers" }
  }), ll(n, {
    heading: "Idle",
    hint: "Plays by default. Stops when pointer enters the tile.",
    configs: e.idle ?? [],
    slotClass: "ti-idle-slot",
    titlePrefix: "Effect",
    dropGroup: "effect",
    defaultEffect: { name: "float" }
  }), ll(n, {
    heading: "Hover",
    hint: "Plays while pointer is over the tile.",
    configs: e.hover ?? [],
    slotClass: "ti-hover-slot",
    titlePrefix: "Effect",
    dropGroup: "effect",
    defaultEffect: { name: "scale" }
  });
  const i = document.createElement("div");
  i.classList.add("ti-section-heading");
  const r = document.createElement("h3");
  r.textContent = "Click", i.appendChild(r);
  const o = e.click ?? [], s = document.createElement("div");
  s.classList.add("idle-anim__slots", "ti-click-slots");
  const a = document.createElement("button");
  a.type = "button", a.classList.add("ti-section-heading__add"), a.innerHTML = '<i class="fa-solid fa-plus"></i>', a.title = "Add click animation", a.addEventListener("click", () => {
    const O = s.querySelectorAll(".ti-click-slot").length, k = Md(ls, O);
    k.classList.remove("is-collapsed"), s.appendChild(k);
  }), i.appendChild(a), n.appendChild(i);
  const l = document.createElement("p");
  l.classList.add("idle-anim__hint"), l.textContent = "One-shot animation on click.", n.appendChild(l);
  for (let O = 0; O < o.length; O++)
    s.appendChild(Md(o[O], O));
  n.appendChild(s), Im(s, {
    dropGroup: "click",
    onDrop() {
      Da(s, "ti-click-slot", "Animation");
    }
  });
  const u = document.createElement("div");
  u.classList.add("ti-section-heading");
  const d = document.createElement("h3");
  d.textContent = "Options", u.appendChild(d), n.appendChild(u);
  const f = document.createElement("div");
  f.classList.add("form-group");
  const h = document.createElement("label");
  h.textContent = "Pointer cursor on hover";
  const m = document.createElement("input");
  m.type = "checkbox", m.classList.add("ti-cursor-check"), m.checked = e.cursor ?? !1, f.append(h, m), n.appendChild(f);
  const g = document.createElement("p");
  g.classList.add("idle-anim__hint"), g.textContent = "Execute a macro when clicked. Drag a macro here or paste its UUID.", n.appendChild(g);
  const y = document.createElement("div");
  y.classList.add("form-group", "ti-macro");
  const v = document.createElement("label");
  v.textContent = "Macro", y.appendChild(v);
  const b = document.createElement("input");
  b.type = "text", b.classList.add("ti-macro__uuid"), b.placeholder = "Drag a macro here or paste UUID", b.value = e.macro ?? "", y.appendChild(b);
  const w = document.createElement("button");
  w.type = "button", w.classList.add("ti-macro__clear"), w.innerHTML = '<i class="fa-solid fa-xmark"></i>', w.title = "Clear macro", w.addEventListener("click", () => {
    b.value = "";
  }), y.appendChild(w), y.addEventListener("dragover", (O) => {
    O.preventDefault(), O.dataTransfer.dropEffect = "link";
  }), y.addEventListener("drop", (O) => {
    O.preventDefault();
    try {
      const k = O.dataTransfer.getData("text/plain"), x = JSON.parse(k);
      x.type === "Macro" && x.uuid && (b.value = x.uuid);
    } catch {
    }
  }), n.appendChild(y);
  const E = document.createElement("div");
  E.classList.add("idle-anim__actions");
  const C = document.createElement("button");
  return C.type = "button", C.classList.add("idle-anim__preview"), C.innerHTML = '<i class="fa-solid fa-play"></i> Preview', E.append(C), n.appendChild(E), n;
}
c(jw, "buildSectionContent");
function cl(t, e) {
  const n = [];
  for (const i of t.querySelectorAll(`.${e}`)) {
    const r = Mm(i);
    r && n.push(r);
  }
  return n;
}
c(cl, "readAllEffectSlots");
function Uw(t) {
  const e = [];
  for (const n of t.querySelectorAll(".ti-click-slot")) {
    const i = xm(n);
    i && e.push(i);
  }
  return e;
}
c(Uw, "readAllClickConfigs");
function xd(t) {
  var r, o, s;
  const e = ((o = (r = t.querySelector(".ti-macro__uuid")) == null ? void 0 : r.value) == null ? void 0 : o.trim()) || null, n = ((s = t.querySelector(".ti-cursor-check")) == null ? void 0 : s.checked) ?? !1, i = {
    always: cl(t, "ti-always-slot"),
    idle: cl(t, "ti-idle-slot"),
    hover: cl(t, "ti-hover-slot"),
    click: Uw(t)
  };
  return e && (i.macro = e), n && (i.cursor = !0), i;
}
c(xd, "readFormConfig");
function _m(t, e) {
  var l;
  const n = qe(e);
  if (!n) return;
  const i = qw(t);
  if (!i) return;
  const r = eu(t, n, Pw, "Animations", Rw);
  if (!r || r.querySelector(".eidolon-tile-interactions")) return;
  const o = r.closest("form");
  o && (o.noValidate = !0);
  const s = jw(i);
  r.appendChild(s), (l = t.setPosition) == null || l.call(t, { height: "auto" });
  const a = r.querySelector(".idle-anim__preview");
  a == null || a.addEventListener("click", () => {
    const u = i.object;
    if (!u) return;
    if (Mn) {
      Mn.detach(), Mn = null, a.classList.remove("is-active"), a.innerHTML = '<i class="fa-solid fa-play"></i> Preview';
      return;
    }
    const d = xd(s);
    (d.always.length > 0 || d.idle.length > 0 || d.hover.length > 0) && (Mn = new Ri(u, d), Mn.start("idle"), a.classList.add("is-active"), a.innerHTML = '<i class="fa-solid fa-stop"></i> Stop');
  }), o && o.addEventListener("submit", () => {
    Mn && (Mn.detach(), Mn = null);
    const u = xd(s), d = u.always.length > 0 || u.idle.length > 0 || u.hover.length > 0 || u.click.length > 0 || !!u.macro || !!u.cursor, f = {
      [`flags.${Bo}.-=${Id}`]: null,
      [`flags.${Bo}.-=${Fw}`]: null,
      [`flags.${Bo}.-=${Dw}`]: null
    };
    i.update(f).then(() => {
      if (d)
        return i.update({ [`flags.${Bo}.${Id}`]: u });
    });
  });
}
c(_m, "renderAnimationSection");
const Rs = /* @__PURE__ */ new Map();
function Nm(t) {
  const e = Rs.get(t);
  e && (e.controller.abort(), Rs.delete(t), e.restore());
}
c(Nm, "stopLoopByKey");
function $m(t) {
  const e = `${t}::`;
  for (const n of [...Rs.keys()])
    n.startsWith(e) && Nm(n);
}
c($m, "stopLoopsForTile");
function Fm() {
  for (const t of [...Rs.keys()])
    Nm(t);
}
c(Fm, "stopAllLoops");
const Dm = "eidolon-utilities", Pm = ["tile-animations", "tile-interactions", "idle-animation"];
function Vw() {
  Fm(), Cm();
}
c(Vw, "onCanvasTearDown");
function Gw() {
  Fm(), Cm();
}
c(Gw, "onCanvasReady$1");
function Ww(t, e) {
  var r;
  const n = (r = e == null ? void 0 : e.flags) == null ? void 0 : r[Dm];
  !n || !Pm.some((o) => o in n || `-=${o}` in n) || ($m(t.id), Mw(t));
}
c(Ww, "onUpdateTile");
function zw(t) {
  $m(t.id), xw(t);
}
c(zw, "onDeleteTile");
function Yw(t, e) {
  _m(t, e);
}
c(Yw, "onRenderTileConfig");
function Kw(t, e) {
  var r;
  const n = (r = e == null ? void 0 : e.flags) == null ? void 0 : r[Dm];
  !n || !Pm.some((o) => o in n || `-=${o}` in n) || _w(t);
}
c(Kw, "onUpdateDrawing");
function Xw(t) {
  Nw(t);
}
c(Xw, "onDeleteDrawing");
function Jw(t, e) {
  _m(t, e);
}
c(Jw, "onRenderDrawingConfig");
function Qw() {
  Hooks.on("canvasTearDown", Vw), Hooks.on("canvasReady", Gw), Hooks.on("updateTile", Ww), Hooks.on("deleteTile", zw), Hooks.on("renderTileConfig", Yw), Hooks.on("updateDrawing", Kw), Hooks.on("deleteDrawing", Xw), Hooks.on("renderDrawingConfig", Jw);
}
c(Qw, "registerTileInteractionHooks");
Qw();
const Hs = /* @__PURE__ */ new Map();
function hu(t, e) {
  Hs.has(t) && console.warn(`[eidolon-utilities] Door-link behavior "${t}" is already registered. Overwriting.`), Hs.set(t, e);
}
c(hu, "registerBehavior");
function Rm(t) {
  return Hs.get(t);
}
c(Rm, "getBehavior");
function Pa() {
  return Hs;
}
c(Pa, "getAllBehaviors");
const Zw = {
  label: "Reflect",
  icon: "fa-solid fa-arrows-left-right",
  description: "Wall fully disappears when door opens.",
  highlightColor: 16739115,
  apply() {
    return { light: 0, move: 0, sight: 0, sound: 0 };
  },
  revert(t, e) {
    return { ...e };
  }
}, eE = {
  label: "Pass-thru",
  icon: "fa-solid fa-person-walking-dashed-line-arrow-right",
  description: "Wall allows movement when door opens, keeps other restrictions.",
  highlightColor: 14263361,
  apply(t, e) {
    return { light: e.light, move: 0, sight: e.sight, sound: e.sound };
  },
  revert(t, e) {
    return { ...e };
  }
}, no = "eidolon-utilities", Pc = "door-links", Hm = "door-link-default";
function En(t) {
  var e, n;
  return ((n = (e = t == null ? void 0 : t.flags) == null ? void 0 : e[no]) == null ? void 0 : n[Pc]) ?? {};
}
c(En, "getDoorLinks");
function io(t, e) {
  const n = { [`flags.${no}.${Pc}`]: e }, i = En(t);
  for (const r of Object.keys(i))
    r in e || (n[`flags.${no}.${Pc}.-=${r}`] = null);
  return t.update(n, { render: !1 });
}
c(io, "setDoorLinks");
function tE(t, e) {
  const n = En(t);
  let i = !1;
  const r = {};
  for (const [o, s] of Object.entries(n)) {
    const a = s.filter((l) => l !== e);
    a.length !== s.length && (i = !0), a.length > 0 && (r[o] = a);
  }
  return i ? io(t, r) : null;
}
c(tE, "removeWallFromAllLinks");
function mu(t) {
  var e, n;
  return ((n = (e = t == null ? void 0 : t.flags) == null ? void 0 : e[no]) == null ? void 0 : n[Hm]) ?? null;
}
c(mu, "getDefaultState");
function qm(t) {
  const e = {
    light: t.light ?? 20,
    move: t.move ?? 20,
    sight: t.sight ?? 20,
    sound: t.sound ?? 20
  };
  return t.update({ [`flags.${no}.${Hm}`]: e });
}
c(qm, "captureDefaultState");
function _d(t) {
  return mu(t) ? Promise.resolve() : qm(t);
}
c(_d, "ensureDefaultState");
async function Bm(t, e) {
  const n = t.parent;
  if (!n) return;
  const i = En(t), r = Object.keys(i);
  if (r.length === 0) return;
  const o = e === 1, s = [];
  let a = null;
  for (const l of r) {
    const u = Rm(l);
    if (!u) {
      console.warn(`[eidolon-utilities] Unknown door-link behavior: "${l}"`);
      continue;
    }
    const d = i[l];
    if (d != null && d.length)
      for (const f of d) {
        const h = n.walls.get(f);
        if (!h) continue;
        const m = mu(h);
        if (m)
          if (o) {
            const g = u.apply(h, m);
            s.push({ _id: f, ...g });
          } else {
            a || (a = nE(n, t.id));
            const g = a.get(f);
            if ((g == null ? void 0 : g.length) > 0)
              continue;
            const y = u.revert(h, m);
            s.push({ _id: f, ...y });
          }
      }
  }
  s.length > 0 && await n.updateEmbeddedDocuments("Wall", s);
}
c(Bm, "onDoorStateChange");
function nE(t, e) {
  const n = /* @__PURE__ */ new Map();
  for (const i of t.walls) {
    if (i.id === e || i.door === 0 || i.ds !== 1) continue;
    const r = En(i);
    for (const o of Object.values(r))
      for (const s of o)
        n.has(s) || n.set(s, []), n.get(s).push(i);
  }
  return n;
}
c(nE, "buildReverseIndex");
const ro = /* @__PURE__ */ new WeakMap(), qs = /* @__PURE__ */ new Set();
function gu(t, e = {}) {
  var b;
  if (!(t != null && t.document)) return !1;
  Rc(t);
  const n = e.color ?? 16739115, i = e.alpha ?? 0.85, r = e.width ?? 3, o = e.pulse ?? !0, [s, a, l, u] = t.document.c, d = s - t.x, f = a - t.y, h = l - t.x, m = u - t.y, g = new PIXI.Graphics(), y = [
    { w: r + 24, a: i * 0.08 },
    { w: r + 18, a: i * 0.14 },
    { w: r + 12, a: i * 0.25 },
    { w: r + 6, a: i * 0.4 }
  ];
  for (const w of y)
    g.lineStyle(w.w, n, w.a), g.moveTo(d, f), g.lineTo(h, m);
  g.lineStyle(r, n, i), g.moveTo(d, f), g.lineTo(h, m), g.name = "eidolonDoorLinkHighlight", t.addChild(g);
  const v = { gfx: g, pulseData: null };
  if (o && ((b = canvas.app) != null && b.ticker)) {
    const w = {
      elapsed: 0,
      fn: /* @__PURE__ */ c((E) => {
        w.elapsed += E;
        const C = (Math.sin(w.elapsed * 0.05) + 1) / 2;
        g.alpha = i * (0.4 + 0.6 * C);
      }, "fn")
    };
    canvas.app.ticker.add(w.fn), v.pulseData = w, qs.add(w);
  }
  return ro.set(t, v), !0;
}
c(gu, "highlightWall");
function Rc(t) {
  var n, i;
  if (!t) return;
  const e = ro.get(t);
  e && (e.pulseData && ((i = (n = canvas.app) == null ? void 0 : n.ticker) == null || i.remove(e.pulseData.fn), qs.delete(e.pulseData)), e.gfx && (e.gfx.parent && e.gfx.parent.removeChild(e.gfx), e.gfx.destroy({ children: !0 })), ro.delete(t));
}
c(Rc, "removeWallHighlight");
function jm() {
  var e, n, i;
  for (const r of qs)
    (n = (e = canvas.app) == null ? void 0 : e.ticker) == null || n.remove(r.fn);
  qs.clear();
  const t = (i = canvas.walls) == null ? void 0 : i.placeables;
  if (t)
    for (const r of t) {
      const o = ro.get(r);
      o && (o.gfx && (o.gfx.parent && o.gfx.parent.removeChild(o.gfx), o.gfx.destroy({ children: !0 })), ro.delete(r));
    }
}
c(jm, "clearWallHighlights");
let yi = null;
function iE(t) {
  var y, v, b, w, E;
  yi && yi.cancel();
  const { onPick: e, onUnpick: n, onCancel: i, excludeIds: r, getExcludeIds: o, sourceDoorId: s } = t;
  let a = null;
  (y = canvas.walls) == null || y.activate();
  for (const C of ((v = canvas.walls) == null ? void 0 : v.controlled) ?? [])
    (b = C.release) == null || b.call(C);
  const l = /* @__PURE__ */ c((C, O) => {
    var $, D, N;
    if (!O) return;
    const k = C.document ?? C;
    if (s && k.id === s) {
      ($ = ui.notifications) == null || $.warn("Cannot link a door to itself.");
      return;
    }
    if ((o ? o() : r ?? /* @__PURE__ */ new Set()).has(k.id)) {
      (D = C.release) == null || D.call(C), n == null || n(k);
      return;
    }
    (N = C.release) == null || N.call(C), e(k);
  }, "onControl"), u = /* @__PURE__ */ c((C, O) => {
    O ? (a = C, gu(C, { color: 65416, alpha: 0.7, width: 4, pulse: !1 })) : a === C && (Rc(C), a = null);
  }, "onHover"), d = /* @__PURE__ */ c((C) => {
    C.key === "Escape" && (C.preventDefault(), C.stopPropagation(), g());
  }, "onKeydown"), f = /* @__PURE__ */ c((C) => {
    C.preventDefault(), g();
  }, "onContextMenu"), h = Hooks.on("controlWall", l), m = Hooks.on("hoverWall", u);
  document.addEventListener("keydown", d, { capture: !0 }), (w = canvas.stage) == null || w.addEventListener("rightclick", f), (E = ui.notifications) == null || E.info("Pick mode active — click a wall segment on the canvas, or press ESC to cancel.", { permanent: !1 });
  function g() {
    var C;
    yi && (yi = null, Hooks.off("controlWall", h), Hooks.off("hoverWall", m), document.removeEventListener("keydown", d, { capture: !0 }), (C = canvas.stage) == null || C.removeEventListener("rightclick", f), a && (Rc(a), a = null), i == null || i());
  }
  return c(g, "cancel"), yi = { cancel: g }, { cancel: g };
}
c(iE, "enterWallPickMode");
function rE() {
  yi && yi.cancel();
}
c(rE, "cancelWallPickMode");
const oE = "eidolon-door-links", sE = "Links", aE = "fa-solid fa-link", Ut = "eidolon-door-links";
function lE(t) {
  const [e, n, i, r] = t.c ?? [0, 0, 0, 0];
  return `(${e},${n}) → (${i},${r})`;
}
c(lE, "formatWallCoords");
function cE(t) {
  return t.length > 8 ? t.slice(0, 8) + "…" : t;
}
c(cE, "shortId");
function Nd(t) {
  const e = /* @__PURE__ */ new Set();
  for (const n of Object.values(t))
    for (const i of n) e.add(i);
  return e;
}
c(Nd, "allLinkedIds");
function uE(t) {
  const e = t.sight ?? 20, n = t.move ?? 20;
  if (e === 0) return { label: "Invisible Wall", cssClass: "dl-pill--invisible" };
  if (e === 10) return { label: "Terrain Wall", cssClass: "dl-pill--terrain" };
  if ([30, 40].includes(e)) return { label: "Window", cssClass: "dl-pill--window" };
  if (n === 0 && t.door === 0) return { label: "Ethereal Wall", cssClass: "dl-pill--ethereal" };
  if (t.door === 1) {
    const i = t.ds ?? 0;
    return i === 2 ? { label: "Locked Door", cssClass: "dl-pill--door-locked" } : i === 1 ? { label: "Open Door", cssClass: "dl-pill--door-open" } : { label: "Door", cssClass: "dl-pill--door" };
  }
  if (t.door === 2) {
    const i = t.ds ?? 0;
    return i === 2 ? { label: "Locked Secret Door", cssClass: "dl-pill--door-locked" } : i === 1 ? { label: "Open Secret Door", cssClass: "dl-pill--secret-open" } : { label: "Secret Door", cssClass: "dl-pill--secret" };
  }
  return { label: "Basic Wall", cssClass: "dl-pill--wall" };
}
c(uE, "classifyWall");
function ul(t, e, n, i) {
  const r = document.createElement("div");
  r.classList.add("dl-wall-entry"), r.dataset.wallId = t.id, r.style.cursor = "pointer", r.title = "Click to select on canvas", r.addEventListener("click", () => {
    var g, y;
    const m = t.object;
    m && ((g = canvas.walls) == null || g.activate(), m.controlled ? m.release() : m.control({ releaseOthers: !((y = globalThis.keyboard) != null && y.isModifierActive(KeyboardManager.MODIFIER_KEYS.SHIFT)) }));
  });
  const { label: o, cssClass: s } = uE(t);
  r.classList.add(s), r.title = o;
  const a = document.createElement("div");
  a.classList.add("dl-wall-entry__info");
  const l = document.createElement("span");
  l.classList.add("dl-wall-entry__coords"), l.textContent = `#${cE(t.id)}  ${lE(t)}`, a.appendChild(l);
  const u = mu(t);
  if (u) {
    const m = document.createElement("span");
    m.classList.add("dl-wall-entry__defaults"), m.textContent = `L:${u.light} M:${u.move} S:${u.sight} Snd:${u.sound}`, a.appendChild(m);
  }
  const d = document.createElement("span");
  d.classList.add("dl-wall-entry__actions");
  const f = document.createElement("button");
  f.type = "button", f.classList.add("dl-wall-entry__btn"), f.innerHTML = '<i class="fa-solid fa-eye"></i>', f.title = "Highlight on canvas", f.addEventListener("click", (m) => {
    var y;
    m.stopPropagation();
    const g = t.object;
    g && gu(g, { color: ((y = Pa().get(e)) == null ? void 0 : y.highlightColor) ?? 16739115 });
  });
  const h = document.createElement("button");
  return h.type = "button", h.classList.add("dl-wall-entry__btn", "dl-wall-entry__btn--remove"), h.innerHTML = '<i class="fa-solid fa-xmark"></i>', h.title = "Remove link", h.addEventListener("click", (m) => {
    m.stopPropagation(), r.remove(), i(t.id, e);
  }), d.append(f, h), r.append(a, d), r;
}
c(ul, "buildWallEntry");
function dE(t, e, n, i, r, o) {
  const s = document.createElement("div");
  s.classList.add("dl-behavior-section"), s.dataset.behavior = t;
  const a = document.createElement("div");
  a.classList.add("dl-behavior-section__header");
  const l = document.createElement("i");
  l.className = e.icon;
  const u = document.createElement("span");
  u.classList.add("dl-behavior-section__title"), u.textContent = e.label;
  const d = document.createElement("span");
  d.classList.add("dl-behavior-section__count"), d.textContent = `(${n.length})`;
  const f = document.createElement("span");
  f.classList.add("dl-behavior-section__header-actions");
  const h = document.createElement("button");
  h.type = "button", h.classList.add("dl-header-btn"), h.innerHTML = '<i class="fa-solid fa-crosshairs"></i>', h.title = "Pick from canvas";
  const m = document.createElement("button");
  m.type = "button", m.classList.add("dl-header-btn"), m.innerHTML = '<i class="fa-solid fa-object-group"></i>', m.title = "Add selected walls";
  const g = document.createElement("button");
  g.type = "button", g.classList.add("dl-header-btn"), g.innerHTML = '<i class="fa-solid fa-arrows-to-dot"></i>', g.title = "Select all linked walls on canvas", f.append(g, m, h), a.append(l, u, d, f), s.appendChild(a);
  const y = document.createElement("p");
  y.classList.add("dl-behavior-section__desc"), y.textContent = e.description, s.appendChild(y);
  const v = document.createElement("div");
  v.classList.add("dl-behavior-section__walls");
  function b() {
    const E = v.querySelectorAll(".dl-wall-entry");
    d.textContent = `(${E.length})`;
  }
  c(b, "updateCount");
  function w(E, C) {
    b(), o();
  }
  c(w, "handleRemove");
  for (const E of n) {
    const C = r.walls.get(E);
    C && v.appendChild(ul(C, t, i, w));
  }
  return s.appendChild(v), h.addEventListener("click", (E) => {
    E.stopPropagation(), iE({
      sourceDoorId: i.id,
      getExcludeIds: /* @__PURE__ */ c(() => Nd(Bs(s.closest(`.${Ut}`))), "getExcludeIds"),
      onPick: /* @__PURE__ */ c(async (C) => {
        await _d(C), v.appendChild(ul(C, t, i, w)), b(), o();
      }, "onPick"),
      onUnpick: /* @__PURE__ */ c((C) => {
        const O = s.closest(`.${Ut}`), k = O == null ? void 0 : O.querySelector(`.dl-wall-entry[data-wall-id="${C.id}"]`);
        if (k) {
          k.remove();
          for (const x of O.querySelectorAll(".dl-behavior-section")) {
            const $ = x.querySelectorAll(".dl-wall-entry");
            x.querySelector(".dl-behavior-section__count").textContent = `(${$.length})`;
          }
          o();
        }
      }, "onUnpick")
    });
  }), m.addEventListener("click", async (E) => {
    var $, D, N, F;
    E.stopPropagation();
    const C = (($ = canvas.walls) == null ? void 0 : $.controlled) ?? [];
    if (C.length === 0) {
      (D = ui.notifications) == null || D.warn("No walls selected. Select walls on the canvas first.");
      return;
    }
    const O = Bs(s.closest(`.${Ut}`)), k = Nd(O);
    let x = 0;
    for (const M of C) {
      const R = M.document;
      !R || R.id === i.id || k.has(R.id) || (await _d(R), v.appendChild(ul(R, t, i, w)), k.add(R.id), x++);
    }
    x > 0 ? (b(), o(), (N = ui.notifications) == null || N.info(`Added ${x} wall(s) to ${e.label}.`)) : (F = ui.notifications) == null || F.warn("No eligible walls in selection (doors and already-linked walls are excluded).");
  }), g.addEventListener("click", (E) => {
    var $, D, N, F;
    E.stopPropagation();
    const C = [...v.querySelectorAll(".dl-wall-entry")].map((M) => M.dataset.wallId);
    if (C.length === 0) {
      ($ = ui.notifications) == null || $.info("No walls to select.");
      return;
    }
    (D = canvas.walls) == null || D.activate();
    const O = C.map((M) => {
      var R;
      return (R = r.walls.get(M)) == null ? void 0 : R.object;
    }).filter(Boolean);
    if (O.length > 0 && O.every((M) => M.controlled)) {
      for (const M of O) M.release();
      return;
    }
    (N = canvas.walls) == null || N.releaseAll();
    let x = 0;
    for (const M of O)
      M.control({ releaseOthers: !1 }), x++;
    (F = ui.notifications) == null || F.info(`Selected ${x} wall(s).`);
  }), s;
}
c(dE, "buildBehaviorSection");
function Bs(t) {
  if (!t) return {};
  const e = {};
  for (const n of t.querySelectorAll(".dl-behavior-section")) {
    const i = n.dataset.behavior, r = [];
    for (const o of n.querySelectorAll(".dl-wall-entry"))
      o.dataset.wallId && r.push(o.dataset.wallId);
    r.length > 0 && (e[i] = r);
  }
  return e;
}
c(Bs, "readLinksFromDOM");
function mr(t, e, n) {
  var h;
  const i = document.createElement("div");
  i.classList.add(Ut);
  const r = En(t);
  let o = !1;
  const s = {};
  for (const [m, g] of Object.entries(r)) {
    const y = g.filter((v) => e.walls.has(v));
    y.length !== g.length && (o = !0), y.length > 0 && (s[m] = y);
  }
  o && io(t, s);
  const a = Pa(), l = /* @__PURE__ */ c(() => {
    const m = Bs(i);
    io(t, m);
  }, "onLinksChanged");
  for (const [m, g] of a) {
    const y = s[m] ?? [];
    i.appendChild(dE(m, g, y, t, e, l));
  }
  const u = document.createElement("button");
  u.type = "button", u.classList.add("dl-btn", "dl-btn--recapture"), u.innerHTML = '<i class="fa-solid fa-camera-rotate"></i> Re-capture defaults', u.title = "Snapshot current wall properties as the closed-door default for all linked walls", u.addEventListener("click", async (m) => {
    var v;
    m.stopPropagation();
    const g = Bs(i);
    let y = 0;
    for (const b of Object.values(g))
      for (const w of b) {
        const E = e.walls.get(w);
        E && (await qm(E), y++);
      }
    (v = ui.notifications) == null || v.info(`Re-captured defaults for ${y} linked wall(s).`), n();
  }), i.appendChild(u), pE(s, e);
  const d = /* @__PURE__ */ c((m, g) => {
    var b;
    const y = ((b = m.document) == null ? void 0 : b.id) ?? m.id, v = i.querySelector(`.dl-wall-entry[data-wall-id="${y}"]`);
    v && v.classList.toggle("dl-wall-entry--selected", g);
  }, "syncSelection"), f = Hooks.on("controlWall", d);
  i._dlSelectionHookId = f;
  for (const m of i.querySelectorAll(".dl-wall-entry")) {
    const g = e.walls.get(m.dataset.wallId);
    (h = g == null ? void 0 : g.object) != null && h.controlled && m.classList.add("dl-wall-entry--selected");
  }
  return i;
}
c(mr, "buildDoorLinksContent");
function fE(t) {
  return t.querySelector(".standard-form [data-application-part='body']") ?? t.querySelector(".standard-form.scrollable") ?? null;
}
c(fE, "findV2Body");
function hE(t, e, n, i) {
  const r = fE(e);
  if (!r) return !1;
  if (r.querySelector(`.${Ut}`)) return !0;
  const o = document.createElement("fieldset");
  o.classList.add("dl-fieldset");
  const s = document.createElement("legend");
  s.textContent = "Door Links", o.appendChild(s);
  const a = /* @__PURE__ */ c(() => {
    var l;
    (l = o.querySelector(`.${Ut}`)) == null || l.remove(), o.appendChild(mr(n, i, a));
  }, "refresh");
  return o.appendChild(mr(n, i, a)), r.appendChild(o), !0;
}
c(hE, "injectAsFieldset");
function mE(t, e, n, i) {
  var a;
  const r = eu(t, e, oE, sE, aE);
  if (!r) return !1;
  if (r.querySelector(`.${Ut}`)) return !0;
  const o = r.closest("form");
  o && (o.noValidate = !0);
  const s = /* @__PURE__ */ c(() => {
    var l;
    (l = r.querySelector(`.${Ut}`)) == null || l.remove(), r.appendChild(mr(n, i, s));
  }, "refresh");
  return r.appendChild(mr(n, i, s)), (a = t.setPosition) == null || a.call(t, { height: "auto" }), !0;
}
c(mE, "injectAsTab");
function gE(t, e, n, i) {
  var u;
  const r = e.querySelector("form");
  if (!r) return !1;
  if (r.querySelector(`.${Ut}`)) return !0;
  const o = document.createElement("fieldset");
  o.classList.add("dl-fieldset");
  const s = document.createElement("legend");
  s.textContent = "Door Links", o.appendChild(s);
  const a = /* @__PURE__ */ c(() => {
    var d;
    (d = o.querySelector(`.${Ut}`)) == null || d.remove(), o.appendChild(mr(n, i, a));
  }, "refresh");
  o.appendChild(mr(n, i, a));
  const l = r.querySelector(":scope > footer") ?? r.querySelector(".form-footer");
  return r.insertBefore(o, l ?? null), r.noValidate = !0, (u = t.setPosition) == null || u.call(t, { height: "auto" }), !0;
}
c(gE, "injectAsFormSection");
function dl(t, e) {
  var l;
  const n = qe(e);
  if (!n) return;
  const i = t.document ?? ((l = t.object) == null ? void 0 : l.document) ?? t.object;
  if (!i || i.door === 0) return;
  const r = i.parent;
  if (!r || !(hE(t, n, i, r) || mE(t, n, i, r) || gE(t, n, i, r))) return;
  const s = `close${t.constructor.name}`, a = Hooks.on(s, (u) => {
    if (u === t) {
      jm(), rE();
      const d = n.querySelector(`.${Ut}`);
      (d == null ? void 0 : d._dlSelectionHookId) != null && Hooks.off("controlWall", d._dlSelectionHookId), Hooks.off(s, a);
    }
  });
}
c(dl, "renderDoorLinksTab");
function pE(t, e) {
  var i;
  const n = Pa();
  for (const [r, o] of Object.entries(t)) {
    const s = ((i = n.get(r)) == null ? void 0 : i.highlightColor) ?? 16739115;
    for (const a of o) {
      const l = e.walls.get(a), u = l == null ? void 0 : l.object;
      u && gu(u, { color: s });
    }
  }
}
c(pE, "highlightLinkedWalls");
const $d = "eidolon-utilities";
function yE(t, e) {
  e.ds !== void 0 && t.door !== 0 && Bm(t, e.ds);
}
c(yE, "onUpdateWall");
function bE(t) {
  const e = t.parent;
  if (!e) return;
  const n = t.id;
  for (const i of e.walls)
    i.door !== 0 && tE(i, n);
}
c(bE, "onDeleteWall");
function vE(t, e) {
  var o;
  const n = e instanceof HTMLElement ? e : e == null ? void 0 : e[0];
  if (!n) return;
  if (!((o = game.modules.get("monks-active-tiles")) != null && o.active)) {
    dl(t, e);
    return;
  }
  if (n.querySelector("nav.sheet-tabs, nav.tabs")) {
    dl(t, e);
    return;
  }
  const i = new MutationObserver(() => {
    n.querySelector("nav.sheet-tabs, nav.tabs") && (i.disconnect(), dl(t, e));
  });
  i.observe(n, { childList: !0, subtree: !0 });
  const r = `close${t.constructor.name}`;
  Hooks.once(r, (s) => {
    s === t && i.disconnect();
  });
}
c(vE, "onRenderWallConfig");
async function wE(t) {
  const e = t.walls.filter((u) => {
    if (u.door === 0) return !1;
    const d = En(u);
    return Object.values(d).some((f) => f.length > 0);
  });
  if (e.length === 0) return;
  const n = new Set(t.walls.map((u) => u.id)), i = /* @__PURE__ */ new Set();
  for (const u of e)
    for (const d of Object.values(En(u)))
      for (const f of d)
        n.has(f) || i.add(f);
  if (i.size === 0) return;
  const r = [...i][0];
  let o = null;
  for (const u of game.scenes)
    if (u.id !== t.id && u.walls.get(r)) {
      o = u;
      break;
    }
  if (!o) return;
  const s = /* @__PURE__ */ c((u) => u.join(","), "coordKey"), a = /* @__PURE__ */ new Map();
  for (const u of t.walls)
    a.set(s(u.c), u.id);
  const l = /* @__PURE__ */ new Map();
  for (const u of i) {
    const d = o.walls.get(u);
    if (!d) continue;
    const f = a.get(s(d.c));
    f && l.set(u, f);
  }
  for (const u of e) {
    const d = En(u), f = {};
    let h = !1;
    for (const [m, g] of Object.entries(d))
      f[m] = g.map((y) => {
        const v = l.get(y);
        return v ? (h = !0, v) : y;
      });
    h && await io(u, f);
  }
}
c(wE, "onCreateScene");
function EE() {
  jm();
}
c(EE, "onCanvasReady");
function SE() {
  Hooks.on("updateWall", yE), Hooks.on("deleteWall", bE), Hooks.on("renderWallConfig", vE), Hooks.on("createScene", wE), Hooks.on("canvasReady", EE), Hooks.once("ready", () => {
    const t = game.modules.get($d);
    t.api || (t.api = {}), t.api.doorLinks = {
      registerBehavior: hu,
      getBehavior: Rm,
      getAllBehaviors: Pa,
      getDoorLinks: En,
      setDoorLinks: io,
      triggerDoor: Bm
    }, console.log(`[${$d}] Door Links API registered.`);
  });
}
c(SE, "registerDoorLinksHooks");
hu("reflect", Zw);
hu("passthru", eE);
SE();
const hi = "application/x-foundry-region-shape", pu = /* @__PURE__ */ new Map();
function Hc() {
  for (const t of document.querySelectorAll(
    ".rs-shape--insert-before, .rs-shape--insert-after"
  ))
    t.classList.remove("rs-shape--insert-before", "rs-shape--insert-after");
}
c(Hc, "clearAllIndicators");
function Um(t) {
  var e;
  for (const n of pu.values())
    (e = n.container) == null || e.classList.toggle("rs-drag-active", t);
}
c(Um, "setAllDragActive");
function CE() {
  Hc(), Um(!1);
  for (const t of document.querySelectorAll(
    ".is-dragging, .rs-drop-over"
  ))
    t.classList.remove("is-dragging", "rs-drop-over");
}
c(CE, "globalCleanup");
async function Fd(t, e, n) {
  const i = t.dataTransfer.getData(hi);
  if (!i) return;
  let r;
  try {
    r = JSON.parse(i);
  } catch {
    return;
  }
  const { shape: o, sourceRegionUuid: s, sourceIndex: a } = r;
  if (!o || s == null) return;
  const l = t.ctrlKey || t.metaKey, u = s === e.uuid;
  if (u && !l) {
    const f = n === -1 ? e.shapes.length : n;
    if (f === a || f === a + 1)
      return;
  }
  const d = foundry.utils.deepClone(o);
  if (u) {
    const f = foundry.utils.deepClone(e.shapes);
    f.splice(a, 1);
    const h = n === -1 ? f.length : n, m = a < h ? h - 1 : h;
    f.splice(m, 0, d), await e.update({ shapes: f });
  } else {
    const f = foundry.utils.deepClone(e.shapes), h = n === -1 ? f.length : n;
    if (f.splice(h, 0, d), await e.update({ shapes: f }), l) {
      const m = await fromUuid(s);
      if (m) {
        const g = foundry.utils.deepClone(m.shapes);
        g.splice(a, 1), await m.update({ shapes: g });
      }
    }
  }
}
c(Fd, "handleShapeDrop");
function TE(t, e) {
  const n = qe(e);
  if (!n) return;
  const i = t.document;
  if (!i) return;
  const r = n.querySelector('section.tab[data-tab="shapes"]');
  if (!r) return;
  const o = r, s = o.querySelectorAll("fieldset[data-shape-index]");
  for (const a of s) {
    const l = Number(a.dataset.shapeIndex);
    if (!a.querySelector(".rs-drag-handle")) {
      const d = document.createElement("i");
      d.className = "fa-solid fa-grip-vertical rs-drag-handle", d.title = "Drag to reorder or copy to another region", a.prepend(d);
    }
    a.setAttribute("draggable", "true"), a.classList.add("rs-shape-fieldset");
    let u = !1;
    a.addEventListener("pointerdown", (d) => {
      u = !!d.target.closest(".rs-drag-handle");
    }), a.addEventListener("dragstart", (d) => {
      if (!u) {
        d.preventDefault();
        return;
      }
      const f = foundry.utils.deepClone(i.shapes[l]), h = JSON.stringify({
        shape: f,
        sourceRegionUuid: i.uuid,
        sourceIndex: l
      });
      d.dataTransfer.setData(hi, h), d.dataTransfer.effectAllowed = "copyMove", a.classList.add("is-dragging"), Um(!0);
    }), a.addEventListener("dragover", (d) => {
      if (!d.dataTransfer.types.includes(hi)) return;
      d.preventDefault(), d.dataTransfer.dropEffect = d.ctrlKey || d.metaKey ? "move" : "copy";
      const f = a.getBoundingClientRect(), h = f.top + f.height / 2, m = d.clientY < h ? "before" : "after";
      Hc(), a.classList.add(
        m === "before" ? "rs-shape--insert-before" : "rs-shape--insert-after"
      );
    }), a.addEventListener("dragleave", () => {
      a.classList.remove(
        "rs-shape--insert-before",
        "rs-shape--insert-after"
      );
    }), a.addEventListener("drop", (d) => {
      if (d.preventDefault(), d.stopPropagation(), Hc(), !d.dataTransfer.types.includes(hi)) return;
      const h = (() => {
        const m = a.getBoundingClientRect(), g = m.top + m.height / 2;
        return d.clientY < g ? "before" : "after";
      })() === "before" ? l : l + 1;
      Fd(d, i, h);
    }), a.addEventListener("dragend", () => {
      CE();
    });
  }
  o.classList.add("rs-drop-container"), o.addEventListener("dragover", (a) => {
    a.dataTransfer.types.includes(hi) && (a.preventDefault(), a.dataTransfer.dropEffect = a.ctrlKey || a.metaKey ? "move" : "copy");
  }), o.addEventListener("dragenter", (a) => {
    a.dataTransfer.types.includes(hi) && (a.preventDefault(), o.classList.add("rs-drop-over"));
  }), o.addEventListener("dragleave", (a) => {
    a.relatedTarget && o.contains(a.relatedTarget) || o.classList.remove("rs-drop-over");
  }), o.addEventListener("drop", (a) => {
    a.preventDefault(), o.classList.remove("rs-drop-over"), a.dataTransfer.types.includes(hi) && Fd(a, i, -1);
  }), pu.set(i.uuid, { app: t, container: o });
}
c(TE, "injectShapeDragHandles");
function LE(t) {
  const e = t.document;
  e && pu.delete(e.uuid);
}
c(LE, "cleanupShapeDrag");
const IE = 100, Vm = 32;
function OE(t, e, n) {
  const i = [];
  for (let r = 0; r < t.length; r += 2)
    i.push(new n.IntPoint(Math.round(t[r] * e), Math.round(t[r + 1] * e)));
  return n.Clipper.Orientation(i) || i.reverse(), i;
}
c(OE, "polygonToPath");
function kE(t, e, n) {
  const { x: i, y: r, width: o, height: s, rotation: a } = t;
  let l = i * e, u = r * e, d = (i + o) * e, f = (r + s) * e;
  if (!a)
    return l = Math.round(l), u = Math.round(u), d = Math.round(d), f = Math.round(f), [new n.IntPoint(l, u), new n.IntPoint(d, u), new n.IntPoint(d, f), new n.IntPoint(l, f)];
  const h = (l + d) / 2, m = (u + f) / 2;
  l -= h, u -= m, d -= h, f -= m;
  const g = a * Math.PI / 180, y = Math.cos(g), v = Math.sin(g);
  return [
    new n.IntPoint(Math.round(y * l - v * u + h), Math.round(v * l + y * u + m)),
    new n.IntPoint(Math.round(y * d - v * u + h), Math.round(v * d + y * u + m)),
    new n.IntPoint(Math.round(y * d - v * f + h), Math.round(v * d + y * f + m)),
    new n.IntPoint(Math.round(y * l - v * f + h), Math.round(v * l + y * f + m))
  ];
}
c(kE, "rectangleToPath");
function AE(t, e, n, i) {
  const { x: r, y: o, radius: s } = t, a = r * e, l = o * e, u = s * e, d = [];
  for (let f = 0; f < i; f++) {
    const h = 2 * Math.PI * f / i;
    d.push(new n.IntPoint(Math.round(a + Math.cos(h) * u), Math.round(l + Math.sin(h) * u)));
  }
  return d;
}
c(AE, "circleToPath");
function ME(t, e, n, i) {
  const { x: r, y: o, radiusX: s, radiusY: a, rotation: l } = t, u = r * e, d = o * e, f = s * e, h = a * e, m = (l || 0) * Math.PI / 180, g = Math.cos(m), y = Math.sin(m), v = [];
  for (let b = 0; b < i; b++) {
    const w = 2 * Math.PI * b / i, E = Math.cos(w) * f, C = Math.sin(w) * h;
    v.push(new n.IntPoint(Math.round(u + g * E - y * C), Math.round(d + y * E + g * C)));
  }
  return v;
}
c(ME, "ellipseToPath");
function qc(t, e, n, i = {}) {
  const r = i.vertexCount ?? Vm;
  switch (t.type) {
    case "polygon":
      return OE(t.points, e, n);
    case "rectangle":
      return kE(t, e, n);
    case "circle":
      return AE(t, e, n, r);
    case "ellipse":
      return ME(t, e, n, r);
    default:
      throw new Error(`Unknown shape type: ${t.type}`);
  }
}
c(qc, "shapeToClipperPath");
function Gm(t, e, n) {
  const i = [];
  for (const r of t)
    i.push(r.X / e, r.Y / e);
  return { type: "polygon", points: i, hole: n };
}
c(Gm, "clipperPathToPolygonShape");
function Dd(t) {
  const e = [], n = [], i = t.Childs();
  for (let r = i.length - 1; r >= 0; r--)
    n.push(i[r]);
  for (; n.length > 0; ) {
    const r = n.pop();
    e.push({ path: r.Contour(), hole: r.IsHole() });
    const o = r.Childs();
    for (let s = o.length - 1; s >= 0; s--)
      n.push(o[s]);
  }
  return e;
}
c(Dd, "walkPolyTree");
function Wm(t, e, n = {}) {
  const i = n.scalingFactor ?? IE, r = n.vertexCount ?? Vm, o = [], s = [];
  for (const h of t)
    h.hole ? s.push(h) : o.push(h);
  if (o.length <= 1 && s.length === 0 || o.length === 0) return null;
  const a = [];
  for (const h of o)
    a.push(qc(h, i, e, { vertexCount: r }));
  const l = new e.Clipper();
  l.AddPaths(a, e.PolyType.ptSubject, !0);
  const u = new e.PolyTree();
  l.Execute(e.ClipType.ctUnion, u, e.PolyFillType.pftNonZero, e.PolyFillType.pftNonZero);
  let d = u;
  if (s.length > 0) {
    const h = [];
    for (const { path: w, hole: E } of Dd(u))
      E || h.push(w);
    const m = [];
    for (const w of s) {
      const E = qc(w, i, e, { vertexCount: r });
      e.Clipper.Orientation(E) || E.reverse(), m.push(E);
    }
    const g = new e.Clipper();
    g.AddPaths(m, e.PolyType.ptSubject, !0);
    const y = new e.Paths();
    g.Execute(e.ClipType.ctUnion, y, e.PolyFillType.pftNonZero, e.PolyFillType.pftNonZero);
    const v = [];
    for (const w of y)
      e.Clipper.Orientation(w) && w.reverse(), v.push(w);
    const b = new e.Clipper();
    b.AddPaths(h, e.PolyType.ptSubject, !0), b.AddPaths(v, e.PolyType.ptClip, !0), d = new e.PolyTree(), b.Execute(e.ClipType.ctDifference, d, e.PolyFillType.pftNonZero, e.PolyFillType.pftNonZero);
  }
  const f = [];
  for (const { path: h, hole: m } of Dd(d))
    f.push(Gm(h, i, m));
  return f;
}
c(Wm, "mergeShapes");
function xE(t, e) {
  const n = qe(e);
  if (!n) return;
  const i = t.document;
  if (!i) return;
  const r = n.querySelector("header.region-element.region-shape .region-element-controls");
  if (!r || r.querySelector('[data-action="shapeMergeOverlapping"]')) return;
  const o = document.createElement("a");
  o.className = "control", o.dataset.action = "shapeMergeOverlapping", o.dataset.tooltip = "Merge shapes & apply holes", o.setAttribute("aria-label", "Merge shapes and apply holes"), o.innerHTML = '<i class="fa-solid fa-object-union fa-fw"></i>';
  const s = i.shapes.filter((l) => !l.hole).length, a = i.shapes.filter((l) => l.hole).length;
  s < 2 && (s === 0 || a === 0) && (o.classList.add("disabled"), o.dataset.tooltip = "Need 2+ shapes to merge, or shapes with holes to subtract"), o.addEventListener("click", async (l) => {
    if (l.preventDefault(), o.classList.contains("disabled")) return;
    const u = i.shapes.map((f) => foundry.utils.deepClone(f)), d = Wm(u, ClipperLib);
    if (!d) {
      ui.notifications.info("Nothing to merge — need 2+ shapes, or shapes with holes.");
      return;
    }
    await i.update({ shapes: d }), ui.notifications.info(`Merged ${u.length} shapes into ${d.length}.`);
  }), r.prepend(o);
}
c(xE, "injectMergeButton");
var Wd, yr, zm, Ym;
const gt = class gt extends sn(on) {
  constructor() {
    super(...arguments);
    A(this, yr);
  }
  // ── Context ───────────────────────────────────────────────────────────
  async _prepareContext() {
    var a, l, u;
    const n = CONST.REGION_VISIBILITY, i = ((l = (a = canvas.scene) == null ? void 0 : a.regions) == null ? void 0 : l.contents) ?? [], r = {};
    for (const d of i) {
      const f = d.visibility ?? n.LAYER;
      r[f] = (r[f] ?? 0) + 1;
    }
    const o = (u = Object.entries(r).sort((d, f) => f[1] - d[1])[0]) == null ? void 0 : u[0], s = o != null ? Number(o) : n.GAMEMASTER;
    return {
      options: Object.entries(n).map(([d, f]) => ({
        value: f,
        label: game.i18n.localize(`REGION.VISIBILITY.${d}.label`),
        selected: f === s
      }))
    };
  }
  // ── Render & Events ───────────────────────────────────────────────────
  _onRender(n, i) {
    super._onRender(n, i), T(this, yr, zm).call(this);
  }
  // ── Static opener ────────────────────────────────────────────────────
  static open() {
    var r, o;
    if ((((o = (r = canvas.scene) == null ? void 0 : r.regions) == null ? void 0 : o.contents) ?? []).length === 0) {
      ui.notifications.info("No regions on this scene.");
      return;
    }
    new gt().render(!0);
  }
};
yr = new WeakSet(), zm = /* @__PURE__ */ c(function() {
  var i, r;
  const n = this.element;
  n instanceof HTMLElement && ((i = n.querySelector("[data-action='apply']")) == null || i.addEventListener("click", () => T(this, yr, Ym).call(this)), (r = n.querySelector("[data-action='cancel']")) == null || r.addEventListener("click", () => this.close()));
}, "#bindEvents"), Ym = /* @__PURE__ */ c(async function() {
  var u, d, f;
  const i = this.element.querySelector("[data-role='visibility-select']"), r = Number(i.value), o = ((d = (u = canvas.scene) == null ? void 0 : u.regions) == null ? void 0 : d.contents) ?? [];
  if (o.length === 0) {
    ui.notifications.info("No regions on this scene."), this.close();
    return;
  }
  const s = o.filter((h) => h.visibility !== r).map((h) => ({ _id: h.id, visibility: r }));
  if (s.length === 0) {
    ui.notifications.info("All regions already have the selected visibility."), this.close();
    return;
  }
  await canvas.scene.updateEmbeddedDocuments("Region", s);
  const a = CONST.REGION_VISIBILITY, l = game.i18n.localize(
    `REGION.VISIBILITY.${(f = Object.entries(a).find(([, h]) => h === r)) == null ? void 0 : f[0]}.label`
  );
  ui.notifications.info(`Set visibility to "${l}" on ${s.length} region(s).`), this.close();
}, "#doApply"), c(gt, "GlobalVisibilityApplication"), ue(gt, "APP_ID", `${L}-global-visibility`), ue(gt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Le(gt, gt, "DEFAULT_OPTIONS"),
  {
    id: gt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Wd = Le(gt, gt, "DEFAULT_OPTIONS")) == null ? void 0 : Wd.classes) ?? [], "eidolon-global-visibility-window", "themed"])
    ),
    tag: "section",
    window: {
      title: "Global Region Visibility",
      icon: "fa-solid fa-eye",
      resizable: !1
    },
    position: {
      width: 320,
      height: "auto"
    }
  },
  { inplace: !1 }
)), ue(gt, "PARTS", {
  content: {
    template: `modules/${L}/templates/global-visibility.html`
  }
});
let Bc = gt;
const Km = 100, Xm = 32;
function _E(t) {
  let e = 1 / 0, n = 1 / 0, i = -1 / 0, r = -1 / 0, o = !1;
  for (const s of t)
    if (!s.hole)
      switch (s.type) {
        case "polygon":
          for (let a = 0; a < s.points.length; a += 2) {
            const l = s.points[a], u = s.points[a + 1];
            l < e && (e = l), u < n && (n = u), l > i && (i = l), u > r && (r = u), o = !0;
          }
          break;
        case "rectangle": {
          const a = [
            [s.x, s.y],
            [s.x + s.width, s.y],
            [s.x + s.width, s.y + s.height],
            [s.x, s.y + s.height]
          ];
          if (s.rotation) {
            const l = s.x + s.width / 2, u = s.y + s.height / 2, d = s.rotation * Math.PI / 180, f = Math.cos(d), h = Math.sin(d);
            for (const [m, g] of a) {
              const y = m - l, v = g - u, b = f * y - h * v + l, w = h * y + f * v + u;
              b < e && (e = b), w < n && (n = w), b > i && (i = b), w > r && (r = w), o = !0;
            }
          } else
            for (const [l, u] of a)
              l < e && (e = l), u < n && (n = u), l > i && (i = l), u > r && (r = u), o = !0;
          break;
        }
        case "circle": {
          const a = s.radius;
          s.x - a < e && (e = s.x - a), s.y - a < n && (n = s.y - a), s.x + a > i && (i = s.x + a), s.y + a > r && (r = s.y + a), o = !0;
          break;
        }
        case "ellipse": {
          const a = s.radiusX, l = s.radiusY;
          s.x - a < e && (e = s.x - a), s.y - l < n && (n = s.y - l), s.x + a > i && (i = s.x + a), s.y + l > r && (r = s.y + l), o = !0;
          break;
        }
      }
  return o ? { minX: e, minY: n, maxX: i, maxY: r } : null;
}
c(_E, "regionBBox");
function NE(t, e) {
  return t.maxX > e.minX && t.minX < e.maxX && t.maxY > e.minY && t.minY < e.maxY;
}
c(NE, "bboxOverlaps");
function Jm(t, e, n, i) {
  const r = [];
  for (const o of t)
    o.hole || r.push(qc(o, e, n, { vertexCount: i }));
  return r;
}
c(Jm, "nonHolePaths");
function Pd(t, e) {
  if (t.length === 0) return [];
  if (t.length === 1) return [t[0]];
  const n = new e.Clipper();
  n.AddPaths(t, e.PolyType.ptSubject, !0);
  const i = new e.Paths();
  return n.Execute(e.ClipType.ctUnion, i, e.PolyFillType.pftNonZero, e.PolyFillType.pftNonZero), i;
}
c(Pd, "unionPaths");
function $E(t, e, n, i) {
  const r = new n.Clipper();
  r.AddPaths(t, n.PolyType.ptSubject, !0), r.AddPaths(e, n.PolyType.ptClip, !0);
  const o = new n.Paths();
  r.Execute(n.ClipType.ctIntersection, o, n.PolyFillType.pftNonZero, n.PolyFillType.pftNonZero);
  const s = 4 * i * i;
  return o.some((a) => Math.abs(n.Clipper.Area(a)) > s);
}
c($E, "pathsIntersect");
function FE(t, e, n = {}) {
  const i = n.scalingFactor ?? Km, r = n.vertexCount ?? Xm, o = [];
  for (const a of t) {
    const l = a.shapes ?? [], u = _E(l);
    if (!u) continue;
    const d = Jm(l, i, e, r);
    d.length !== 0 && o.push({ region: a, bbox: u, paths: d });
  }
  const s = /* @__PURE__ */ new Set();
  for (let a = 0; a < o.length; a++)
    for (let l = a + 1; l < o.length; l++)
      NE(o[a].bbox, o[l].bbox) && $E(o[a].paths, o[l].paths, e, i) && (s.add(o[a].region), s.add(o[l].region));
  return [...s];
}
c(FE, "findOverlappingRegions");
function DE(t, e, n = {}) {
  const i = n.scalingFactor ?? Km, r = n.vertexCount ?? Xm;
  let o = [];
  const s = [];
  for (let a = 0; a < t.length; a++) {
    const l = t[a], u = l.shapes ?? [], d = Jm(u, i, e, r);
    if (a === 0) {
      o = Pd(d, e);
      continue;
    }
    if (d.length === 0) continue;
    const f = new e.Clipper();
    f.AddPaths(d, e.PolyType.ptSubject, !0), f.AddPaths(o, e.PolyType.ptClip, !0);
    const h = new e.PolyTree();
    f.Execute(e.ClipType.ctDifference, h, e.PolyFillType.pftNonZero, e.PolyFillType.pftNonZero);
    const m = [], g = [], y = h.Childs();
    for (let b = y.length - 1; b >= 0; b--) g.push(y[b]);
    for (; g.length > 0; ) {
      const b = g.pop();
      m.push(Gm(b.Contour(), i, b.IsHole()));
      const w = b.Childs();
      for (let E = w.length - 1; E >= 0; E--) g.push(w[E]);
    }
    for (const b of u)
      b.hole && m.push(foundry.utils.deepClone(b));
    s.push({ region: l, newShapes: m });
    const v = [...o, ...d];
    o = Pd(v, e);
  }
  return s;
}
c(DE, "resolveOverlaps");
var zd, wn, Wn, Qt, ri, Qm, Zm, eg;
const pt = class pt extends sn(on) {
  /**
   * @param {object} options
   * @param {object[]} [options.regions]  Pre-filtered overlapping regions
   */
  constructor(n = {}) {
    super(n);
    A(this, ri);
    /** @type {object[]} Ordered region documents. */
    A(this, wn, []);
    /** @type {Set<string>} IDs of regions excluded from resolution. */
    A(this, Wn, /* @__PURE__ */ new Set());
    /** @type {number|null} Index of the item currently being dragged. */
    A(this, Qt, null);
    I(this, wn, [...n.regions ?? []]);
  }
  // ── Context ───────────────────────────────────────────────────────────
  async _prepareContext() {
    return {
      regions: p(this, wn).map((n) => ({
        id: n.id,
        name: n.name,
        color: n.color ?? "#999999",
        shapeCount: (n.shapes ?? []).length,
        isSingle: (n.shapes ?? []).length === 1,
        excluded: p(this, Wn).has(n.id)
      }))
    };
  }
  // ── Render & Events ───────────────────────────────────────────────────
  _onRender(n, i) {
    super._onRender(n, i), T(this, ri, Qm).call(this);
  }
  // ── Static opener ────────────────────────────────────────────────────
  /**
   * Open the resolver. Detects overlapping regions first; if none overlap,
   * shows a notification and does not open.
   */
  static open() {
    var o, s;
    const n = ((s = (o = canvas.scene) == null ? void 0 : o.regions) == null ? void 0 : s.contents) ?? [];
    if (n.length < 2) {
      ui.notifications.info("Need at least 2 regions to check for overlaps.");
      return;
    }
    const i = FE(n, ClipperLib);
    if (i.length === 0) {
      ui.notifications.info("No overlapping regions found on this scene.");
      return;
    }
    new pt({ regions: i }).render(!0);
  }
};
wn = new WeakMap(), Wn = new WeakMap(), Qt = new WeakMap(), ri = new WeakSet(), Qm = /* @__PURE__ */ c(function() {
  var r, o;
  const n = this.element;
  if (!(n instanceof HTMLElement)) return;
  const i = n.querySelector("[data-role='region-list']");
  i && T(this, ri, Zm).call(this, i);
  for (const s of n.querySelectorAll("[data-action='toggle-exclude']"))
    s.addEventListener("click", (a) => {
      a.stopPropagation();
      const l = Number(s.dataset.index), u = p(this, wn)[l];
      u && (p(this, Wn).has(u.id) ? p(this, Wn).delete(u.id) : p(this, Wn).add(u.id), this.render({ force: !0 }));
    });
  (r = n.querySelector("[data-action='resolve']")) == null || r.addEventListener("click", () => T(this, ri, eg).call(this)), (o = n.querySelector("[data-action='cancel']")) == null || o.addEventListener("click", () => this.close());
}, "#bindEvents"), // ── Drag reorder ─────────────────────────────────────────────────────
Zm = /* @__PURE__ */ c(function(n) {
  const i = n.querySelectorAll(".overlap-resolver__item");
  for (const r of i)
    r.addEventListener("dragstart", (o) => {
      I(this, Qt, Number(r.dataset.index)), o.dataTransfer.effectAllowed = "move", o.dataTransfer.setData("text/plain", String(p(this, Qt))), requestAnimationFrame(() => r.classList.add("is-dragging"));
    }), r.addEventListener("dragover", (o) => {
      o.preventDefault(), o.dataTransfer.dropEffect = "move";
      const s = r.getBoundingClientRect(), a = s.top + s.height / 2, l = o.clientY < a;
      for (const u of n.querySelectorAll(".overlap-resolver__item"))
        u.classList.remove("or--insert-before", "or--insert-after");
      r.classList.add(l ? "or--insert-before" : "or--insert-after");
    }), r.addEventListener("dragleave", () => {
      r.classList.remove("or--insert-before", "or--insert-after");
    }), r.addEventListener("drop", (o) => {
      o.preventDefault();
      for (const h of n.querySelectorAll(".overlap-resolver__item"))
        h.classList.remove("or--insert-before", "or--insert-after", "is-dragging");
      if (p(this, Qt) == null) return;
      const s = Number(r.dataset.index), a = r.getBoundingClientRect(), l = a.top + a.height / 2;
      let u = o.clientY < l ? s : s + 1;
      const d = p(this, Qt);
      if (d === u || d + 1 === u) {
        I(this, Qt, null);
        return;
      }
      const [f] = p(this, wn).splice(d, 1);
      d < u && u--, p(this, wn).splice(u, 0, f), I(this, Qt, null), this.render({ force: !0 });
    }), r.addEventListener("dragend", () => {
      I(this, Qt, null);
      for (const o of n.querySelectorAll(".overlap-resolver__item"))
        o.classList.remove("or--insert-before", "or--insert-after", "is-dragging");
    });
}, "#bindDragReorder"), eg = /* @__PURE__ */ c(async function() {
  const n = p(this, wn).filter((s) => !p(this, Wn).has(s.id)), i = DE(n, ClipperLib);
  if (i.length === 0) {
    ui.notifications.info("No overlaps found after applying priority order."), this.close();
    return;
  }
  const r = i.map(({ region: s, newShapes: a }) => ({
    _id: s.id,
    shapes: a
  }));
  await canvas.scene.updateEmbeddedDocuments("Region", r);
  const o = i.map(({ region: s }) => s.name).join(", ");
  ui.notifications.info(`Resolved overlaps: updated ${i.length} region(s) (${o}).`), this.close();
}, "#doResolve"), c(pt, "OverlapResolverApplication"), ue(pt, "APP_ID", `${L}-overlap-resolver`), ue(pt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Le(pt, pt, "DEFAULT_OPTIONS"),
  {
    id: pt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((zd = Le(pt, pt, "DEFAULT_OPTIONS")) == null ? void 0 : zd.classes) ?? [], "eidolon-overlap-resolver-window", "themed"])
    ),
    tag: "section",
    window: {
      title: "Overlap Resolver",
      icon: "fa-solid fa-scissors",
      resizable: !1
    },
    position: {
      width: 360,
      height: "auto"
    }
  },
  { inplace: !1 }
)), ue(pt, "PARTS", {
  content: {
    template: `modules/${L}/templates/overlap-resolver.html`
  }
});
let jc = pt;
function PE(t, e) {
  var u;
  const n = qe(e);
  if (!n) return;
  const i = n.querySelector("header.window-header") ?? ((u = n.closest("section")) == null ? void 0 : u.querySelector("header.window-header"));
  if (!i || i.querySelector('[data-action="openGlobalVisibility"]')) return;
  const r = i.querySelector("button.close") ?? i.querySelector('[data-action="close"]'), o = /* @__PURE__ */ c((d) => r ? r.before(d) : i.append(d), "insertBefore"), s = document.createElement("button");
  s.type = "button", s.className = "header-control fa-solid fa-object-union", s.dataset.action = "mergeAllRegionShapes", s.dataset.tooltip = "Merge shapes in all regions", s.setAttribute("aria-label", "Merge shapes in all regions"), s.addEventListener("click", async (d) => {
    var g, y;
    d.preventDefault(), d.stopPropagation();
    const f = ((y = (g = canvas.scene) == null ? void 0 : g.regions) == null ? void 0 : y.contents) ?? [];
    if (f.length === 0) {
      ui.notifications.info("No regions on this scene.");
      return;
    }
    const h = [];
    for (const v of f) {
      const b = (v.shapes ?? []).map((E) => foundry.utils.deepClone(E)), w = Wm(b, ClipperLib);
      w && (w.length >= b.length || h.push({ _id: v.id, shapes: w }));
    }
    if (h.length === 0) {
      ui.notifications.info("Nothing to merge — all regions already have simple shapes.");
      return;
    }
    await canvas.scene.updateEmbeddedDocuments("Region", h);
    const m = h.reduce((v, b) => v + b.shapes.length, 0);
    ui.notifications.info(`Merged shapes in ${h.length} region(s) (${m} shapes total).`);
  }), o(s);
  const a = document.createElement("button");
  a.type = "button", a.className = "header-control fa-solid fa-eye", a.dataset.action = "openGlobalVisibility", a.dataset.tooltip = "Global Region Visibility", a.setAttribute("aria-label", "Set visibility for all regions"), a.addEventListener("click", (d) => {
    d.preventDefault(), d.stopPropagation(), Bc.open();
  }), o(a);
  const l = document.createElement("button");
  l.type = "button", l.className = "header-control fa-solid fa-scissors", l.dataset.action = "openOverlapResolver", l.dataset.tooltip = "Overlap Resolver", l.setAttribute("aria-label", "Open overlap resolver"), l.addEventListener("click", (d) => {
    d.preventDefault(), d.stopPropagation(), jc.open();
  }), o(l);
}
c(PE, "injectRegionLegendButtons");
function RE() {
  Hooks.on("renderRegionConfig", (t, e) => {
    TE(t, e), xE(t, e);
  }), Hooks.on("closeRegionConfig", (t) => {
    LE(t);
  }), Hooks.on("renderRegionLegend", (t, e) => {
    PE(t, e);
  });
}
c(RE, "registerRegionShapeHooks");
RE();
const Xn = L, yu = "softVisionAttenuation", bu = "softVisionBrightness", vu = "softVisionContrast", wu = "softVisionSaturation", zr = "softFade", er = Object.freeze({
  attenuation: 0.9,
  brightness: -0.1,
  contrast: -0.2,
  saturation: -0.1
});
function jo(t) {
  try {
    const e = Number(game.settings.get(Xn, t));
    return Number.isFinite(e) ? e : er[Rd(t)];
  } catch {
    return er[Rd(t)] ?? 0;
  }
}
c(jo, "getNumberSetting");
function Rd(t) {
  return {
    [yu]: "attenuation",
    [bu]: "brightness",
    [vu]: "contrast",
    [wu]: "saturation"
  }[t];
}
c(Rd, "settingToDefaultKey");
function HE(t) {
  game.settings.register(Xn, yu, {
    name: "Soft Fade: Attenuation",
    hint: "How strongly the vision darkens toward the perimeter (0 = uniform, 1 = full falloff).",
    scope: "client",
    config: !0,
    type: Number,
    default: er.attenuation,
    range: { min: 0, max: 1, step: 0.05 },
    onChange: t
  }), game.settings.register(Xn, bu, {
    name: "Soft Fade: Brightness",
    hint: "Negative values darken the outer ring of vision.",
    scope: "client",
    config: !0,
    type: Number,
    default: er.brightness,
    range: { min: -1, max: 1, step: 0.05 },
    onChange: t
  }), game.settings.register(Xn, vu, {
    name: "Soft Fade: Contrast",
    hint: "Negative values soften the scene near the vision edge.",
    scope: "client",
    config: !0,
    type: Number,
    default: er.contrast,
    range: { min: -1, max: 1, step: 0.05 },
    onChange: t
  }), game.settings.register(Xn, wu, {
    name: "Soft Fade: Saturation",
    hint: "Negative values desaturate toward the vision edge.",
    scope: "client",
    config: !0,
    type: Number,
    default: er.saturation,
    range: { min: -1, max: 1, step: 0.05 },
    onChange: t
  });
}
c(HE, "registerSettings");
function qE() {
  var t, e, n;
  return ((e = (t = foundry == null ? void 0 : foundry.canvas) == null ? void 0 : t.perception) == null ? void 0 : e.VisionMode) ?? ((n = CONFIG.Canvas.visionModes.basic) == null ? void 0 : n.constructor);
}
c(qE, "getVisionModeClass");
function BE() {
  var t, e, n, i;
  return ((e = (t = foundry == null ? void 0 : foundry.canvas) == null ? void 0 : t.rendering) == null ? void 0 : e.ColorAdjustmentsSamplerShader) ?? ((i = (n = CONFIG.Canvas.visionModes.darkvision) == null ? void 0 : n.canvas) == null ? void 0 : i.shader);
}
c(BE, "getColorAdjustmentsShader");
function jE() {
  const t = qE(), e = BE();
  return !t || !e ? null : new t({
    id: zr,
    label: "Soft Fade",
    tokenConfig: !0,
    canvas: {
      shader: e,
      uniforms: { contrast: 0, saturation: 0, brightness: 0 }
    },
    vision: {
      defaults: {
        attenuation: jo(yu),
        brightness: jo(bu),
        contrast: jo(vu),
        saturation: jo(wu)
      }
    }
  });
}
c(jE, "buildSoftVisionMode");
function fl() {
  var e;
  const t = jE();
  return t ? (CONFIG.Canvas.visionModes[zr] = t, canvas != null && canvas.ready && ((e = canvas.perception) == null || e.update({ refreshVision: !0, refreshLighting: !0 })), !0) : (console.warn(`[${Xn}] Soft Vision: required classes not available yet, deferring.`), !1);
}
c(fl, "refreshVisionMode");
function UE() {
  Hooks.once("init", () => {
    HE(fl);
  }), Hooks.once("setup", () => {
    fl();
  }), Hooks.once("ready", () => {
    CONFIG.Canvas.visionModes[zr] || fl();
    const t = game.modules.get(Xn);
    t.api || (t.api = {}), t.api.softVision = {
      VISION_MODE_ID: zr,
      /** Apply the Soft Fade vision mode to all currently controlled tokens. */
      async applyToControlled() {
        const e = canvas.tokens.controlled;
        if (!e.length) {
          ui.notifications.warn("Select at least one token.");
          return;
        }
        for (const n of e)
          await n.document.updateVisionMode(zr, !0);
      }
    }, console.log(`[${Xn}] Soft Vision API registered.`);
  });
}
c(UE, "registerSoftVisionHooks");
UE();
const gr = L, Uc = "softLightFade", qt = Object.freeze({
  enabled: !1,
  threshold: 0.3,
  saturation: -0.8,
  brightness: -0.15
}), VE = `
  uniform bool softFadeEnabled;
  uniform float softFadeThreshold;
  uniform float softFadeSaturation;
  uniform float softFadeBrightness;`, GE = `
    // Soft Light Fade — per-light radial desaturation/darkening
    if ( softFadeEnabled ) {
      float sfFade = smoothstep(softFadeThreshold, 1.0, dist);
      if ( sfFade > 0.0 ) {
        vec3 sfGrey = vec3(perceivedBrightness(finalColor));
        finalColor = mix(finalColor, sfGrey, sfFade * (-softFadeSaturation));
        finalColor *= 1.0 + (sfFade * softFadeBrightness);
      }
    }
`, hl = "uniform float saturation;", WE = "if ( attenuation != 0.0 ) depth *= smoothstep(";
function zE() {
  const t = /* @__PURE__ */ new Set();
  for (const e of Object.values(CONFIG.Canvas.lightAnimations))
    e.illuminationShader && t.add(e.illuminationShader);
  if (t.size > 0) {
    const e = t.values().next().value;
    let n = Object.getPrototypeOf(e);
    for (; n && n !== Function.prototype; ) {
      if (n.hasOwnProperty("SHADER_HEADER") && typeof n.fragmentShader == "string") {
        t.add(n);
        break;
      }
      n = Object.getPrototypeOf(n);
    }
  }
  return t;
}
c(zE, "collectIlluminationShaders");
function YE(t) {
  const e = t.fragmentShader;
  if (typeof e != "string" || e.includes("softFadeEnabled")) return !1;
  const n = e.indexOf(hl);
  if (n === -1)
    return console.warn("[eidolon-utilities] Soft Light: could not find uniform anchor in", t.name), !1;
  const i = e.slice(0, n + hl.length) + VE + e.slice(n + hl.length), r = i.indexOf(WE);
  if (r === -1)
    return console.warn("[eidolon-utilities] Soft Light: could not find FALLOFF anchor in", t.name), !1;
  const o = i.slice(0, r) + GE + i.slice(r);
  return t.fragmentShader = o, t.defaultUniforms.hasOwnProperty("softFadeEnabled") || (t.defaultUniforms = {
    ...t.defaultUniforms,
    softFadeEnabled: qt.enabled,
    softFadeThreshold: qt.threshold,
    softFadeSaturation: qt.saturation,
    softFadeBrightness: qt.brightness
  }), !0;
}
c(YE, "patchShaderClass");
function KE() {
  const t = zE();
  let e = 0;
  for (const n of t)
    YE(n) && e++;
  return e;
}
c(KE, "patchIlluminationShaders");
function XE() {
  var n, i;
  const t = (i = (n = foundry == null ? void 0 : foundry.canvas) == null ? void 0 : n.sources) == null ? void 0 : i.PointLightSource;
  if (!t) return null;
  let e = t.prototype;
  for (; e; ) {
    if (e.hasOwnProperty("_updateCommonUniforms")) return e;
    e = Object.getPrototypeOf(e);
  }
  return null;
}
c(XE, "getBaseLightSourceProto");
function JE() {
  const t = XE();
  if (!t)
    return console.warn(`[${gr}] Soft Light: could not find _updateCommonUniforms on BaseLightSource`), !1;
  const e = t._updateCommonUniforms;
  return t._updateCommonUniforms = /* @__PURE__ */ c(function(i) {
    var a, l;
    e.call(this, i);
    const r = i == null ? void 0 : i.uniforms;
    if (!r || !("softFadeEnabled" in r)) return;
    const o = (a = this.object) == null ? void 0 : a.document;
    if (!o) {
      r.softFadeEnabled = !1;
      return;
    }
    const s = (l = o.getFlag) == null ? void 0 : l.call(o, gr, Uc);
    if (!(s != null && s.enabled)) {
      r.softFadeEnabled = !1;
      return;
    }
    r.softFadeEnabled = !0, r.softFadeThreshold = s.threshold ?? qt.threshold, r.softFadeSaturation = s.saturation ?? qt.saturation, r.softFadeBrightness = s.brightness ?? qt.brightness;
  }, "patchedUpdateCommonUniforms"), !0;
}
c(JE, "patchUniformUpdater");
function QE() {
  Hooks.on("renderAmbientLightConfig", ZE);
}
c(QE, "registerLightConfigUI");
function ZE(t, e) {
  var b, w, E, C;
  const n = qe(e);
  if (!n || n.querySelector(".eidolon-soft-light-fade")) return;
  const i = n.querySelector('.tab[data-tab="animation"]');
  if (!i) return;
  const r = t.document ?? ((b = t.object) == null ? void 0 : b.document) ?? t.object;
  if (!r) return;
  const o = ((w = r.getFlag) == null ? void 0 : w.call(r, gr, Uc)) ?? {}, s = o.enabled ?? qt.enabled, a = o.threshold ?? qt.threshold, l = o.saturation ?? qt.saturation, u = o.brightness ?? qt.brightness, d = `flags.${gr}.${Uc}`, f = document.createElement("fieldset");
  f.className = "eidolon-soft-light-fade", f.innerHTML = `
		<legend>Soft Fade</legend>
		<div class="form-group">
			<label>Enable Soft Fade</label>
			<input type="checkbox" name="${d}.enabled" ${s ? "checked" : ""}>
		</div>
		<div class="form-group eidolon-soft-light-threshold-group" ${s ? "" : 'style="opacity: 0.5"'}>
			<label>Fade Threshold</label>
			<div class="form-fields">
				<input type="range" name="${d}.threshold"
					min="0" max="0.95" step="0.05"
					value="${a}">
				<span class="range-value">${a}</span>
			</div>
			<p class="hint">How far from center the fade begins (0 = edge only, 0.95 = almost center).</p>
		</div>
		<div class="form-group eidolon-soft-light-saturation-group" ${s ? "" : 'style="opacity: 0.5"'}>
			<label>Edge Saturation</label>
			<div class="form-fields">
				<input type="range" name="${d}.saturation"
					min="-1" max="0" step="0.05"
					value="${l}">
				<span class="range-value">${l}</span>
			</div>
			<p class="hint">Desaturation strength at the edge (-1 = full greyscale, 0 = no change).</p>
		</div>
		<div class="form-group eidolon-soft-light-brightness-group" ${s ? "" : 'style="opacity: 0.5"'}>
			<label>Edge Brightness</label>
			<div class="form-fields">
				<input type="range" name="${d}.brightness"
					min="-0.5" max="0" step="0.05"
					value="${u}">
				<span class="range-value">${u}</span>
			</div>
			<p class="hint">Darkening at the edge (-0.5 = strong, 0 = no change).</p>
		</div>
	`, i.appendChild(f);
  const h = f.querySelector('input[type="checkbox"]'), m = f.querySelector(".eidolon-soft-light-threshold-group"), g = f.querySelector(".eidolon-soft-light-saturation-group"), y = f.querySelector(".eidolon-soft-light-brightness-group"), v = [m, g, y];
  h == null || h.addEventListener("change", () => {
    const O = h.checked;
    for (const k of v)
      k && (k.style.opacity = O ? "" : "0.5");
  });
  for (const O of f.querySelectorAll('input[type="range"]')) {
    const k = (E = O.parentElement) == null ? void 0 : E.querySelector(".range-value");
    k && O.addEventListener("input", () => {
      k.textContent = O.value;
    });
  }
  (C = t.setPosition) == null || C.call(t, { height: "auto" });
}
c(ZE, "handleRender");
function eS() {
  Hooks.once("init", () => {
    const t = KE();
    console.log(`[${gr}] Soft Light: patched ${t} illumination shaders`);
  }), Hooks.once("setup", () => {
    JE() && console.log(`[${gr}] Soft Light: uniform updater installed`);
  }), QE();
}
c(eS, "registerSoftLightHooks");
eS();
//# sourceMappingURL=eidolon-utilities.js.map
