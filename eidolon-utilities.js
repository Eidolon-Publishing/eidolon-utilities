var xu = Object.defineProperty;
var lg = Object.getPrototypeOf;
var cg = Reflect.get;
var _u = (t) => {
  throw TypeError(t);
};
var ug = (t, e, n) => e in t ? xu(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var u = (t, e) => xu(t, "name", { value: e, configurable: !0 });
var le = (t, e, n) => ug(t, typeof e != "symbol" ? e + "" : e, n), Ha = (t, e, n) => e.has(t) || _u("Cannot " + n);
var p = (t, e, n) => (Ha(t, e, "read from private field"), n ? n.call(t) : e.get(t)), _ = (t, e, n) => e.has(t) ? _u("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, n), O = (t, e, n, i) => (Ha(t, e, "write to private field"), i ? i.call(t, n) : e.set(t, n), n), T = (t, e, n) => (Ha(t, e, "access private method"), n);
var qa = (t, e, n, i) => ({
  set _(r) {
    O(t, e, r, n);
  },
  get _() {
    return p(t, e, i);
  }
}), Le = (t, e, n) => cg(lg(t), n, e);
const L = "eidolon-utilities", cs = "timeTriggerActive", pl = "timeTriggerHideWindow", yl = "timeTriggerShowPlayerWindow", bl = "timeTriggerAllowRealTime", Zd = "timeTriggers", Uo = "timeTriggerHistory", vl = "debug", wl = "timeFormat", El = "manageTime", Sl = "secondsPerRound";
const dg = [-30, -15, -5, 5, 15, 30], tr = 1440 * 60, Vo = "playSound", Lo = 6;
function C(t, e) {
  var n, i;
  return (i = (n = game.i18n) == null ? void 0 : n.has) != null && i.call(n, t) ? game.i18n.localize(t) : e;
}
u(C, "localize");
function jt(t) {
  return typeof t != "string" ? "" : t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
u(jt, "escapeHtml");
function Vt(t) {
  var e;
  return t == null ? t : (e = foundry == null ? void 0 : foundry.utils) != null && e.duplicate ? foundry.utils.duplicate(t) : JSON.parse(JSON.stringify(t));
}
u(Vt, "duplicateData");
function fg() {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
u(fg, "generateTriggerId");
function ef(t) {
  if (typeof t != "string") return null;
  const e = t.trim();
  if (!e) return null;
  const n = e.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (!n) return null;
  const i = Number(n[1]), r = Number(n[2]), o = n[3] !== void 0 ? Number(n[3]) : 0;
  return !Number.isInteger(i) || !Number.isInteger(r) || !Number.isInteger(o) || i < 0 || i > 23 || r < 0 || r > 59 || o < 0 || o > 59 ? null : i * 3600 + r * 60 + o;
}
u(ef, "parseTriggerTimeToSeconds");
function Ar() {
  var t, e;
  return ((t = game.scenes) == null ? void 0 : t.current) ?? ((e = game.scenes) == null ? void 0 : e.active) ?? null;
}
u(Ar, "getActiveScene");
function rn(t) {
  return (t == null ? void 0 : t.object) ?? (t == null ? void 0 : t.document) ?? null;
}
u(rn, "getSceneFromApplication");
function Qe(t) {
  return t && typeof t.getFlag == "function" && typeof t.setFlag == "function";
}
u(Qe, "hasSceneDocument");
const Cl = /* @__PURE__ */ new Set(), Tl = /* @__PURE__ */ new Set(), Ll = /* @__PURE__ */ new Set(), Il = /* @__PURE__ */ new Set();
let $i = !1, Kr = !1, us = Lo, ds = "12h", Nu = !1;
function ja(t) {
  $i = !!t;
  for (const e of Cl)
    try {
      e($i);
    } catch (n) {
      console.error(`${L} | Debug change handler failed`, n);
    }
}
u(ja, "notifyDebugChange");
function Ba(t) {
  Kr = !!t;
  for (const e of Tl)
    try {
      e(Kr);
    } catch (n) {
      console.error(`${L} | Manage time change handler failed`, n);
    }
}
u(Ba, "notifyManageTimeChange");
function tf(t) {
  return t === "24h" ? "24h" : "12h";
}
u(tf, "normalizeTimeFormatValue");
function Wc(t) {
  const e = Number(t);
  return !Number.isFinite(e) || e <= 0 ? Lo : e;
}
u(Wc, "normalizeSecondsPerRoundValue");
function Ua(t) {
  const e = Wc(t);
  us = e;
  for (const n of Ll)
    try {
      n(e);
    } catch (i) {
      console.error(`${L} | Seconds-per-round change handler failed`, i);
    }
}
u(Ua, "notifySecondsPerRoundChange");
function Va(t) {
  const e = tf(t);
  ds = e;
  for (const n of Il)
    try {
      n(e);
    } catch (i) {
      console.error(`${L} | Time format change handler failed`, i);
    }
}
u(Va, "notifyTimeFormatChange");
function hg() {
  var e;
  if (Nu) return;
  if (Nu = !0, !((e = game == null ? void 0 : game.settings) != null && e.register)) {
    console.warn(
      `${L} | game.settings.register is unavailable. Module settings could not be registered.`
    );
    return;
  }
  const t = typeof game.settings.registerChange == "function";
  game.settings.register(L, vl, {
    name: C("EIDOLON.TimeTrigger.DebugSettingName", "Enable debug logging"),
    hint: C(
      "EIDOLON.TimeTrigger.DebugSettingHint",
      "Write detailed time-trigger diagnostics to the browser console."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: t ? void 0 : ja
  }), t && game.settings.registerChange(L, vl, ja), $i = zc(), ja($i), game.settings.register(L, El, {
    name: C("EIDOLON.TimeTrigger.ManageTimeSettingName", "Manage Game Time"),
    hint: C(
      "EIDOLON.TimeTrigger.ManageTimeSettingHint",
      "Allow Eidolon Utilities to advance world time automatically while the game is unpaused. Warning: This may conflict with other time-management modules."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: t ? void 0 : Ba
  }), t && game.settings.registerChange(L, El, Ba), Kr = gg(), Ba(Kr), game.settings.register(L, Sl, {
    name: C(
      "EIDOLON.TimeTrigger.SecondsPerRoundSettingName",
      "Seconds Per Combat Round"
    ),
    hint: C(
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
    Sl,
    Ua
  ), us = Wc(pg()), Ua(us), game.settings.register(L, wl, {
    name: C("EIDOLON.TimeTrigger.TimeFormatSettingName", "Trigger Time Format"),
    hint: C(
      "EIDOLON.TimeTrigger.TimeFormatSettingHint",
      "Control whether trigger times use a 12-hour or 24-hour clock."
    ),
    scope: "world",
    config: !0,
    type: String,
    choices: {
      "12h": C(
        "EIDOLON.TimeTrigger.TimeFormatSettingChoice12Hour",
        "12-hour (e.g. 2:30 PM)"
      ),
      "24h": C(
        "EIDOLON.TimeTrigger.TimeFormatSettingChoice24Hour",
        "24-hour (e.g. 14:30)"
      )
    },
    default: "12h",
    onChange: t ? void 0 : Va
  }), t && game.settings.registerChange(L, wl, Va), ds = tf(nf()), Va(ds);
}
u(hg, "registerTimeTriggerSettings");
function zc() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return !!game.settings.get(L, vl);
  } catch (e) {
    console.error(`${L} | Failed to read debug setting`, e);
  }
  return !1;
}
u(zc, "getDebugSetting");
function mg() {
  return $i = zc(), $i;
}
u(mg, "refreshDebugSettingCache");
function gg() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return !!game.settings.get(L, El);
  } catch (e) {
    console.error(`${L} | Failed to read manage time setting`, e);
  }
  return !1;
}
u(gg, "getManageTimeSetting");
function nf() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return game.settings.get(L, wl) === "24h" ? "24h" : "12h";
  } catch (e) {
    console.error(`${L} | Failed to read time format setting`, e);
  }
  return "12h";
}
u(nf, "getTimeFormatSetting");
function pg() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get) {
      const e = game.settings.get(L, Sl);
      return Wc(e);
    }
  } catch (e) {
    console.error(`${L} | Failed to read seconds-per-round setting`, e);
  }
  return Lo;
}
u(pg, "getSecondsPerRoundSetting");
function yg(t) {
  if (typeof t != "function")
    return () => {
    };
  Cl.add(t);
  try {
    t($i);
  } catch (e) {
    console.error(`${L} | Debug change handler failed`, e);
  }
  return () => {
    Cl.delete(t);
  };
}
u(yg, "onDebugSettingChange");
function rf(t) {
  if (typeof t != "function")
    return () => {
    };
  Tl.add(t);
  try {
    t(Kr);
  } catch (e) {
    console.error(`${L} | Manage time change handler failed`, e);
  }
  return () => {
    Tl.delete(t);
  };
}
u(rf, "onManageTimeSettingChange");
function Yc(t) {
  if (typeof t != "function")
    return () => {
    };
  Il.add(t);
  try {
    t(ds);
  } catch (e) {
    console.error(`${L} | Time format change handler failed`, e);
  }
  return () => {
    Il.delete(t);
  };
}
u(Yc, "onTimeFormatSettingChange");
function bg(t) {
  if (typeof t != "function")
    return () => {
    };
  Ll.add(t);
  try {
    t(us);
  } catch (e) {
    console.error(`${L} | Seconds-per-round change handler failed`, e);
  }
  return () => {
    Ll.delete(t);
  };
}
u(bg, "onSecondsPerRoundSettingChange");
let ya = !1, Ol = !1;
function kl(t) {
  ya = !!t;
}
u(kl, "updateDebugState");
function of() {
  Ol || (Ol = !0, kl(zc()), yg((t) => {
    kl(t), console.info(`${L} | Debug ${ya ? "enabled" : "disabled"}`);
  }));
}
u(of, "ensureInitialized");
function Kc() {
  return Ol || of(), ya;
}
u(Kc, "shouldLog");
function sf(t) {
  if (!t.length)
    return [`${L} |`];
  const [e, ...n] = t;
  return typeof e == "string" ? [`${L} | ${e}`, ...n] : [`${L} |`, e, ...n];
}
u(sf, "formatArgs");
function vg() {
  of();
}
u(vg, "initializeDebug");
function wg() {
  return kl(mg()), ya;
}
u(wg, "syncDebugState");
function D(...t) {
  Kc() && console.debug(...sf(t));
}
u(D, "debugLog");
function ur(...t) {
  Kc() && console.group(...sf(t));
}
u(ur, "debugGroup");
function zn() {
  Kc() && console.groupEnd();
}
u(zn, "debugGroupEnd");
function nr(t) {
  var r;
  const e = (r = t == null ? void 0 : t.getFlag) == null ? void 0 : r.call(t, L, Zd);
  if (!e) return [];
  const n = Vt(e), i = Array.isArray(n) ? n : [];
  return D("Loaded time triggers", {
    sceneId: (t == null ? void 0 : t.id) ?? null,
    count: i.length
  }), i;
}
u(nr, "getTimeTriggers");
async function af(t, e) {
  t != null && t.setFlag && (D("Persisting time triggers", {
    sceneId: t.id,
    count: Array.isArray(e) ? e.length : 0
  }), await t.setFlag(L, Zd, e));
}
u(af, "setTimeTriggers");
function Eg(t) {
  var r;
  const e = (r = t == null ? void 0 : t.getFlag) == null ? void 0 : r.call(t, L, Uo);
  if (!e) return {};
  const n = Vt(e);
  if (!n || typeof n != "object") return {};
  const i = {};
  for (const [o, s] of Object.entries(n))
    typeof s == "number" && Number.isFinite(s) && (i[o] = s);
  return D("Loaded time trigger history", {
    sceneId: (t == null ? void 0 : t.id) ?? null,
    keys: Object.keys(i)
  }), i;
}
u(Eg, "getTimeTriggerHistory");
async function Ga(t, e) {
  var l, c, d, h;
  if (!t) return;
  const n = {};
  if (e && typeof e == "object")
    for (const [f, m] of Object.entries(e))
      typeof m == "number" && Number.isFinite(m) && (n[f] = m);
  const i = ((l = t.getFlag) == null ? void 0 : l.call(t, L, Uo)) ?? {}, r = {};
  if (i && typeof i == "object")
    for (const [f, m] of Object.entries(i))
      typeof m == "number" && Number.isFinite(m) && (r[f] = m);
  const o = Object.keys(n), s = Object.keys(r);
  if (typeof ((c = foundry == null ? void 0 : foundry.utils) == null ? void 0 : c.deepEqual) == "function" ? foundry.utils.deepEqual(r, n) : JSON.stringify(r) === JSON.stringify(n)) {
    D("Skip history update because state is unchanged", {
      sceneId: (t == null ? void 0 : t.id) ?? null
    });
    return;
  }
  D("Updating time trigger history", {
    sceneId: (t == null ? void 0 : t.id) ?? null,
    keys: o,
    removedKeys: s.filter((f) => !o.includes(f))
  });
  try {
    s.length && typeof t.unsetFlag == "function" && await t.unsetFlag(L, Uo), o.length && await t.setFlag(L, Uo, n);
  } catch (f) {
    console.error(`${L} | Failed to persist time trigger history`, f), (h = (d = ui.notifications) == null ? void 0 : d.error) == null || h.call(
      d,
      C(
        "EIDOLON.TimeTrigger.HistoryPersistError",
        "Failed to persist the scene's time trigger history."
      )
    );
  }
}
u(Ga, "updateTimeTriggerHistory");
const fs = /* @__PURE__ */ new Map(), $u = /* @__PURE__ */ new Set();
function Sg(t) {
  if (!(t != null && t.id))
    throw new Error(`${L} | Action definitions require an id.`);
  if (fs.has(t.id))
    throw new Error(`${L} | Duplicate time trigger action id: ${t.id}`);
  fs.set(t.id, {
    ...t
  }), D("Registered time trigger action", { actionId: t.id });
}
u(Sg, "registerAction");
function Io(t) {
  return fs.get(t) ?? null;
}
u(Io, "getAction");
function Cg(t) {
  const e = Io(t);
  return e ? typeof e.label == "function" ? e.label() : e.label : t;
}
u(Cg, "getActionLabel");
function Fu() {
  return Array.from(fs.values());
}
u(Fu, "listActions");
async function lf(t, e) {
  var i, r;
  const n = Io(e == null ? void 0 : e.action);
  if (!n || typeof n.execute != "function") {
    const o = C(
      "EIDOLON.TimeTrigger.UnknownAction",
      "Encountered an unknown time trigger action and skipped it."
    );
    (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, o), console.warn(`${L} | Unknown time trigger action`, e), D("Encountered unknown time trigger action", {
      triggerId: (e == null ? void 0 : e.id) ?? null,
      actionId: (e == null ? void 0 : e.action) ?? null
    });
    return;
  }
  D("Executing action handler", {
    actionId: n.id,
    triggerId: (e == null ? void 0 : e.id) ?? null,
    sceneId: (t == null ? void 0 : t.id) ?? null
  }), await n.execute({ scene: t, trigger: e });
}
u(lf, "executeTriggerAction");
function Tg(t) {
  const e = Io(t == null ? void 0 : t.action);
  return !e || typeof e.buildSummaryParts != "function" ? [] : e.buildSummaryParts({ trigger: t, escapeHtml: jt, localize: C }) ?? [];
}
u(Tg, "buildActionSummaryParts");
function Lg(t) {
  const e = Io(t == null ? void 0 : t.action);
  return !e || typeof e.buildFormContent != "function" ? "" : e.buildFormContent({ trigger: t, escapeHtml: jt, localize: C }) ?? "";
}
u(Lg, "buildActionFormSection");
function Ig(t, e) {
  const n = Io(t == null ? void 0 : t.action);
  !n || typeof n.prepareFormData != "function" || n.prepareFormData({ trigger: t, formData: e });
}
u(Ig, "applyActionFormData");
function Og(t, e, n) {
  var o, s;
  const i = `${(t == null ? void 0 : t.id) ?? "unknown"}:${(e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.action) ?? "unknown"}:${n}`;
  if ($u.has(i)) return;
  $u.add(i);
  const r = C(
    "EIDOLON.TimeTrigger.MissingDataWarning",
    "A scene time trigger is missing required data and was skipped."
  );
  (s = (o = ui.notifications) == null ? void 0 : o.warn) == null || s.call(o, r), console.warn(`${L} | Missing trigger data (${n})`, { scene: t == null ? void 0 : t.id, trigger: e });
}
u(Og, "warnMissingTriggerData");
async function kg({ scene: t, trigger: e }) {
  var o, s, a, l, c;
  const n = (a = (s = (o = e == null ? void 0 : e.data) == null ? void 0 : o.path) == null ? void 0 : s.trim) == null ? void 0 : a.call(s);
  if (!n) {
    Og(t, e, "missing-audio-path");
    return;
  }
  const i = {
    src: n,
    autoplay: !0,
    loop: !1
  }, r = (() => {
    var d, h, f, m, g;
    return typeof ((h = (d = foundry == null ? void 0 : foundry.audio) == null ? void 0 : d.AudioHelper) == null ? void 0 : h.play) == "function" ? foundry.audio.AudioHelper.play(i, !0) : typeof ((m = (f = game == null ? void 0 : game.audio) == null ? void 0 : f.constructor) == null ? void 0 : m.play) == "function" ? game.audio.constructor.play(i, !0) : typeof ((g = game == null ? void 0 : game.audio) == null ? void 0 : g.play) == "function" ? game.audio.play(i, !0) : null;
  })();
  if (!r) {
    console.error(`${L} | Foundry audio helper is unavailable`), (c = (l = ui.notifications) == null ? void 0 : l.error) == null || c.call(
      l,
      C(
        "EIDOLON.TimeTrigger.AudioHelperUnavailable",
        "Unable to play audio for a time trigger because the Foundry audio helper is unavailable."
      )
    );
    return;
  }
  await r;
}
u(kg, "executePlaySoundAction");
Sg({
  id: Vo,
  label: /* @__PURE__ */ u(() => C("EIDOLON.TimeTrigger.ActionPlaySound", "Play Sound"), "label"),
  execute: kg,
  buildSummaryParts: /* @__PURE__ */ u(({ trigger: t, escapeHtml: e, localize: n }) => {
    var r;
    return (r = t == null ? void 0 : t.data) != null && r.path ? [`${e(n("EIDOLON.TimeTrigger.TriggerSound", "Sound File"))}: ${e(t.data.path)}`] : [];
  }, "buildSummaryParts"),
  buildFormContent: /* @__PURE__ */ u(({ trigger: t, escapeHtml: e, localize: n }) => {
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
  prepareFormData: /* @__PURE__ */ u(({ trigger: t, formData: e }) => {
    var n, i;
    t.data.path = ((i = (n = e.playSoundPath) == null ? void 0 : n.trim) == null ? void 0 : i.call(n)) ?? "";
  }, "prepareFormData")
});
var Vd;
const { ApplicationV2: on, HandlebarsApplicationMixin: sn } = ((Vd = foundry.applications) == null ? void 0 : Vd.api) ?? {};
if (!on || !sn)
  throw new Error(
    `${L} | ApplicationV2 API unavailable. Update Foundry VTT to v13 or newer.`
  );
const Jn = "AM", Fi = "PM";
function Yn() {
  return nf();
}
u(Yn, "getConfiguredTimeFormat");
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
u(ba, "parseCanonicalTimeString");
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
u(Zt, "formatCanonicalTime");
function Ag(t, { format: e } = {}) {
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
u(Ag, "formatTimeComponentsForDisplay");
function Mg(t, { format: e } = {}) {
  const n = ba(t);
  if (!n) return "";
  const i = e ?? Yn();
  return hs(n, i);
}
u(Mg, "formatTriggerTimeForDisplay");
function hs(t, e = "12h") {
  if (!t) return "";
  const { hours: n, minutes: i, seconds: r = null } = t;
  if (!Number.isInteger(n) || !Number.isInteger(i)) return "";
  const o = Number.isInteger(r);
  if (e === "24h") {
    const f = `${String(n).padStart(2, "0")}:${String(i).padStart(2, "0")}`;
    return o ? `${f}:${String(r).padStart(2, "0")}` : f;
  }
  const s = n >= 12 ? Fi : Jn, a = n % 12 === 0 ? 12 : n % 12, l = String(a), c = String(i).padStart(2, "0"), d = `${l}:${c}`, h = s === Jn ? C("EIDOLON.TimeTrigger.TimePeriodAM", Jn) : C("EIDOLON.TimeTrigger.TimePeriodPM", Fi);
  if (o) {
    const f = String(r).padStart(2, "0");
    return `${d}:${f} ${h}`;
  }
  return `${d} ${h}`;
}
u(hs, "formatTimeParts");
function Du(t, e = Yn()) {
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
u(Du, "getTimeFormValues");
function xg({ hour: t, minute: e, period: n, time: i }, r = Yn()) {
  if (r === "24h") {
    const m = typeof t == "string" ? t.trim() : "", g = typeof e == "string" ? e.trim() : "", y = typeof i == "string" ? i.trim() : "";
    if (!m && !g && y) {
      const E = ba(y);
      return E ? { canonical: Zt(E) ?? "", error: null } : {
        canonical: "",
        error: C(
          "EIDOLON.TimeTrigger.TimeFormatInvalid24",
          "Enter a valid time in HH:MM format."
        )
      };
    }
    if (!m || !g)
      return {
        canonical: "",
        error: C("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.")
      };
    const b = Number(m), v = Number(g);
    return !Number.isInteger(b) || b < 0 || b > 23 ? {
      canonical: "",
      error: C(
        "EIDOLON.TimeTrigger.TimeFormatInvalid24",
        "Enter a valid time in HH:MM format."
      )
    } : !Number.isInteger(v) || v < 0 || v > 59 ? {
      canonical: "",
      error: C(
        "EIDOLON.TimeTrigger.TimeFormatInvalid24",
        "Enter a valid time in HH:MM format."
      )
    } : { canonical: Zt({
      hours: b,
      minutes: v
    }) ?? "", error: null };
  }
  const o = typeof t == "string" ? t.trim() : "", s = typeof e == "string" ? e.trim() : "", a = typeof n == "string" ? n.trim().toUpperCase() : "";
  if (!o || !s || !a)
    return { canonical: "", error: C("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.") };
  if (a !== Jn && a !== Fi)
    return { canonical: "", error: C("EIDOLON.TimeTrigger.TimeFormatInvalidPeriod", "Select AM or PM.") };
  const l = Number(o), c = Number(s);
  if (!Number.isInteger(l) || l < 1 || l > 12)
    return {
      canonical: "",
      error: C("EIDOLON.TimeTrigger.TimeFormatInvalidHour", "Hours must be between 1 and 12.")
    };
  if (!Number.isInteger(c) || c < 0 || c > 59)
    return {
      canonical: "",
      error: C("EIDOLON.TimeTrigger.TimeFormatInvalidMinute", "Minutes must be between 00 and 59.")
    };
  const d = l % 12, f = {
    hours: a === Fi ? d + 12 : d,
    minutes: c
  };
  return {
    canonical: Zt(f) ?? "",
    error: null
  };
}
u(xg, "normalizeFormTimeInput");
function _g() {
  return [
    {
      value: Jn,
      label: C("EIDOLON.TimeTrigger.TimePeriodAM", Jn)
    },
    {
      value: Fi,
      label: C("EIDOLON.TimeTrigger.TimePeriodPM", Fi)
    }
  ];
}
u(_g, "getPeriodOptions");
var wi, Ei, re, cf, Bs, Us, uf, Ml, xl, Vs, Gs, df, ff, hf, _l, Nl, $l, Ws, zs, Fl, Ys, mf, gf;
const bi = class bi extends sn(on) {
  constructor(n = {}) {
    var s;
    const { scene: i, showControls: r, ...o } = n ?? {};
    super(o);
    _(this, re);
    _(this, wi, null);
    _(this, Ei, null);
    _(this, Bs, /* @__PURE__ */ u((n) => {
      var r, o;
      n.preventDefault();
      const i = Number((o = (r = n.currentTarget) == null ? void 0 : r.dataset) == null ? void 0 : o.delta);
      Number.isFinite(i) && (D("Time delta button clicked", { delta: i }), this._advanceTime(i));
    }, "#onDeltaClick"));
    _(this, Us, /* @__PURE__ */ u((n) => {
      var i, r;
      n.preventDefault(), !(!this.showControls || !((i = game.user) != null && i.isGM)) && (D("Time value double clicked", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null }), T(this, re, uf).call(this));
    }, "#onTimeDoubleClick"));
    _(this, Vs, /* @__PURE__ */ u((n) => {
      if (this.isEditingTime && !this._commitTimeInProgress)
        if (n.key === "Enter") {
          n.preventDefault();
          const i = n.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
          T(this, re, xl).call(this, r);
        } else n.key === "Escape" && (n.preventDefault(), T(this, re, Ml).call(this));
    }, "#onTimeInputKeydown"));
    _(this, Gs, /* @__PURE__ */ u((n) => {
      if (!this.isEditingTime || this._commitTimeInProgress || this._suppressBlurCommit) return;
      const i = n.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
      T(this, re, xl).call(this, r);
    }, "#onTimeInputBlur"));
    _(this, Ws, /* @__PURE__ */ u((n) => {
      const i = !!n;
      if (this.manageTimeEnabled === i) return;
      this.manageTimeEnabled = i, (this.rendered ?? this.isRendered ?? !1) && this.render({ force: !0 });
    }, "#handleManageTimeChange"));
    _(this, zs, /* @__PURE__ */ u(async (n) => {
      var o, s, a, l, c, d, h, f, m;
      if (n.preventDefault(), !this.showControls || !((o = game.user) != null && o.isGM)) return;
      if (!this.manageTimeEnabled) {
        (a = (s = ui.notifications) == null ? void 0 : s.error) == null || a.call(
          s,
          C(
            "EIDOLON.TimeTrigger.SceneRealTimeManageDisabled",
            "Enable Manage Time in module settings to allow automatic real-time flow."
          )
        );
        return;
      }
      const i = this.scene;
      if (!i || typeof i.setFlag != "function") {
        (c = (l = ui.notifications) == null ? void 0 : l.error) == null || c.call(
          l,
          C(
            "EIDOLON.TimeTrigger.SceneUnavailable",
            "The active scene is unavailable. Try again after reloading the world."
          )
        );
        return;
      }
      const r = !this.sceneAllowsRealTime;
      try {
        await i.setFlag(L, bl, r), this.sceneAllowsRealTime = r;
        const g = r ? C(
          "EIDOLON.TimeTrigger.SceneRealTimeEnabled",
          "Automatic real-time flow enabled for this scene."
        ) : C(
          "EIDOLON.TimeTrigger.SceneRealTimeDisabled",
          "Automatic real-time flow disabled for this scene."
        );
        (h = (d = ui.notifications) == null ? void 0 : d.info) == null || h.call(d, g);
      } catch (g) {
        console.error(`${L} | Failed to toggle scene real-time flow`, g), (m = (f = ui.notifications) == null ? void 0 : f.error) == null || m.call(
          f,
          C(
            "EIDOLON.TimeTrigger.SceneRealTimeToggleError",
            "Failed to update the scene's real-time flow setting."
          )
        );
      } finally {
        this.render({ force: !0 });
      }
    }, "#onRealTimeToggleClick"));
    _(this, Ys, /* @__PURE__ */ u(() => {
      (this.rendered ?? this.isRendered ?? !1) && (this.isEditingTime && (this.editValue = T(this, re, _l).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    this.scene = i ?? null, this.showControls = typeof r == "boolean" ? r : !!((s = game.user) != null && s.isGM), this.isEditingTime = !1, this.editValue = "", this._commitTimeInProgress = !1, this._suppressBlurCommit = !1, this.manageTimeEnabled = !1, this.sceneAllowsRealTime = T(this, re, Fl).call(this), O(this, wi, Yc(p(this, Ys))), O(this, Ei, rf(p(this, Ws)));
  }
  async _prepareContext() {
    var v, w;
    const n = ((v = game.time) == null ? void 0 : v.components) ?? {}, r = ((n == null ? void 0 : n.second) !== void 0 && (n == null ? void 0 : n.second) !== null ? Ag(n) : null) ?? T(this, re, cf).call(this), o = Yn(), s = o === "24h", a = s ? C("EIDOLON.TimeTrigger.EditTimePlaceholder24", "HH:MM") : C("EIDOLON.TimeTrigger.EditTimePlaceholder12", "HH:MM AM/PM"), l = this.showControls ? C(
      "EIDOLON.TimeTrigger.EditTimeHint",
      "Double-click to set a specific time."
    ) : "", c = this.showControls ? C(
      "EIDOLON.TimeTrigger.EditTimeLabel",
      "New time (HH:MM or HH:MM AM/PM)"
    ) : "", d = dg.map((E) => ({
      minutes: E,
      label: E > 0 ? `+${E}` : `${E}`
    })), h = !!this.manageTimeEnabled, f = T(this, re, Fl).call(this);
    this.sceneAllowsRealTime = f;
    const m = C(
      "EIDOLON.TimeTrigger.SceneRealTimeEnable",
      "Enable automatic real-time flow for this scene."
    ), g = C(
      "EIDOLON.TimeTrigger.SceneRealTimeDisable",
      "Disable automatic real-time flow for this scene."
    ), y = C(
      "EIDOLON.TimeTrigger.SceneRealTimeManageDisabled",
      "Enable Manage Time in module settings to allow automatic real-time flow."
    );
    return {
      formattedTime: r,
      deltas: d,
      manageTimeEnabled: h,
      sceneAllowsRealTime: f,
      realTimeButtonLabel: h ? f ? g : m : y,
      isGM: ((w = game.user) == null ? void 0 : w.isGM) ?? !1,
      showControls: !!this.showControls,
      editHint: l,
      editLabel: c,
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
      return (this.rendered ?? this.isRendered ?? !1) || (D("TimeTriggerWindow close request rerendering", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null
      }), this.render({ force: !0 })), this;
    D("Closing time trigger window", { sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null, force: !0 });
    const i = await super.close(n);
    return T(this, re, mf).call(this), T(this, re, gf).call(this), i;
  }
  async _advanceTime(n) {
    var r, o, s, a, l, c, d;
    const i = n * 60;
    if (D("Advancing world time", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null, minutes: n, seconds: i }), !((o = game.user) != null && o.isGM)) {
      (a = (s = ui.notifications) == null ? void 0 : s.warn) == null || a.call(s, C("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time."));
      return;
    }
    try {
      await game.time.advance(i);
    } catch (h) {
      console.error(`${L} | Failed to advance time`, h), (c = (l = ui.notifications) == null ? void 0 : l.error) == null || c.call(
        l,
        C("EIDOLON.TimeTrigger.Error", "Failed to update the world time.")
      ), D("Failed to advance time from window", {
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
        D("Binding time trigger interactions", {
          sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
          buttonCount: r.querySelectorAll("[data-delta]").length
        }), r.querySelectorAll("[data-delta]").forEach((c) => {
          c.addEventListener("click", p(this, Bs));
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
wi = new WeakMap(), Ei = new WeakMap(), re = new WeakSet(), cf = /* @__PURE__ */ u(function() {
  var l;
  const n = (l = game.time) == null ? void 0 : l.worldTime;
  if (typeof n != "number" || !Number.isFinite(n)) return "";
  const i = 1440 * 60, r = (Math.floor(n) % i + i) % i, o = Math.floor(r / 3600), s = Math.floor(r % 3600 / 60), a = r % 60;
  return hs({ hours: o, minutes: s, seconds: a }, Yn());
}, "#formatFallbackTime"), Bs = new WeakMap(), Us = new WeakMap(), uf = /* @__PURE__ */ u(function() {
  var n;
  (n = game.user) != null && n.isGM && (this.isEditingTime = !0, this._suppressBlurCommit = !1, this.editValue = T(this, re, _l).call(this), this.render({ force: !0 }));
}, "#enterTimeEditMode"), Ml = /* @__PURE__ */ u(function() {
  this.isEditingTime = !1, this.editValue = "", this._suppressBlurCommit = !1, this.render({ force: !0 });
}, "#cancelTimeEdit"), xl = /* @__PURE__ */ u(async function(n) {
  var o, s, a;
  if (!((o = game.user) != null && o.isGM) || !this.isEditingTime || this._commitTimeInProgress) return;
  this._commitTimeInProgress = !0;
  const i = typeof n == "string" ? n.trim() : "";
  if (!i) {
    T(this, re, Ml).call(this), this._commitTimeInProgress = !1;
    return;
  }
  const r = T(this, re, hf).call(this, i);
  if (r.error) {
    (a = (s = ui.notifications) == null ? void 0 : s.error) == null || a.call(s, r.error), this._suppressBlurCommit = !0, this.editValue = i, this.render({ force: !0 }), this._commitTimeInProgress = !1;
    return;
  }
  try {
    await T(this, re, ff).call(this, r.seconds, r.includeSeconds) ? (this.isEditingTime = !1, this.editValue = "", this.render({ force: !0 })) : (this.editValue = i, this.render({ force: !0 }));
  } finally {
    this._commitTimeInProgress = !1;
  }
}, "#commitTimeInput"), Vs = new WeakMap(), Gs = new WeakMap(), df = /* @__PURE__ */ u(function() {
  var c, d;
  const n = (c = game.time) == null ? void 0 : c.worldTime;
  if (typeof n != "number" || !Number.isFinite(n))
    return "";
  const i = ((d = game.time) == null ? void 0 : d.components) ?? {}, r = Number(i.hour), o = Number(i.minute), s = i.second !== void 0 ? Number(i.second) : null, a = Number.isInteger(s);
  return (Number.isFinite(r) && Number.isFinite(o) ? Zt({
    hours: Math.max(0, Math.min(23, Number(r))),
    minutes: Math.max(0, Math.min(59, Number(o))),
    seconds: a && Number.isFinite(s) ? Math.max(0, Math.min(59, Number(s))) : void 0
  }) ?? "" : "") ?? "";
}, "#getCurrentCanonicalTime"), ff = /* @__PURE__ */ u(async function(n, i) {
  var f, m, g, y, b, v, w, E, S, I;
  const r = (f = game.time) == null ? void 0 : f.worldTime;
  if (typeof r != "number" || !Number.isFinite(r))
    return (g = (m = ui.notifications) == null ? void 0 : m.error) == null || g.call(
      m,
      C(
        "EIDOLON.TimeTrigger.EditTimeUnavailable",
        "The world time is unavailable, so it can't be updated."
      )
    ), !1;
  if (!Number.isInteger(n) || n < 0 || n >= tr)
    return (b = (y = ui.notifications) == null ? void 0 : y.error) == null || b.call(
      y,
      C(
        "EIDOLON.TimeTrigger.EditTimeInvalidRange",
        "Enter a time within the current day."
      )
    ), !1;
  const a = Math.floor(r / tr) * tr + n - r;
  if (!Number.isFinite(a) || a === 0)
    return !0;
  const l = Math.floor(n / 3600), c = Math.floor(n % 3600 / 60), d = n % 60, h = Zt({
    hours: l,
    minutes: c,
    seconds: i ? d : void 0
  });
  try {
    D("Updating world time directly", {
      sceneId: ((v = this.scene) == null ? void 0 : v.id) ?? null,
      targetCanonical: h ?? null,
      diff: a
    }), await game.time.advance(a);
    const k = hs(
      {
        hours: l,
        minutes: c,
        seconds: i ? d : null
      },
      Yn()
    );
    (E = (w = ui.notifications) == null ? void 0 : w.info) == null || E.call(
      w,
      C(
        "EIDOLON.TimeTrigger.EditTimeSuccess",
        "World time updated."
      ) + (k ? ` ${k}` : "")
    );
  } catch (k) {
    return console.error(`${L} | Failed to set world time`, k), (I = (S = ui.notifications) == null ? void 0 : S.error) == null || I.call(
      S,
      C(
        "EIDOLON.TimeTrigger.EditTimeError",
        "Failed to update the world time."
      )
    ), !1;
  }
  return !0;
}, "#applyTargetSeconds"), hf = /* @__PURE__ */ u(function(n) {
  var h;
  const i = C(
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
    const f = Number(o[1]), m = Number(o[2]), g = o[3] !== void 0 ? Number(o[3]) : void 0;
    if (Number.isInteger(f) && f >= 0 && f <= 23 && Number.isInteger(m) && m >= 0 && m <= 59 && (g === void 0 || Number.isInteger(g) && g >= 0 && g <= 59)) {
      const y = f * 3600 + m * 60 + (g ?? 0);
      return {
        canonical: Zt({ hours: f, minutes: m, seconds: g }),
        seconds: y,
        includeSeconds: g !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const { amLower: s, pmLower: a, periodPattern: l } = T(this, re, Nl).call(this), c = r.match(
    new RegExp(
      `^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?\\s*(${l})$`,
      "i"
    )
  );
  if (c) {
    let f = Number(c[1]);
    const m = Number(c[2]), g = c[3] !== void 0 ? Number(c[3]) : void 0, y = c[4] ?? "", b = typeof y == "string" ? ((h = y.toLocaleLowerCase) == null ? void 0 : h.call(y)) ?? y.toLowerCase() : "";
    if (Number.isInteger(f) && f >= 1 && f <= 12 && Number.isInteger(m) && m >= 0 && m <= 59 && (g === void 0 || Number.isInteger(g) && g >= 0 && g <= 59) && (b === s || b === a || b === "am" || b === "pm")) {
      f = f % 12, (b === a || b === "pm") && (f += 12);
      const w = f * 3600 + m * 60 + (g ?? 0);
      return {
        canonical: Zt({ hours: f, minutes: m, seconds: g }),
        seconds: w,
        includeSeconds: g !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const d = ef(r);
  if (d !== null) {
    const f = Math.floor(d / 3600), m = Math.floor(d % 3600 / 60), g = d % 60, y = g !== 0;
    return {
      canonical: Zt({
        hours: f,
        minutes: m,
        seconds: y ? g : void 0
      }),
      seconds: d,
      includeSeconds: y,
      error: null
    };
  }
  return { error: i };
}, "#parseInputTime"), _l = /* @__PURE__ */ u(function() {
  const n = T(this, re, df).call(this);
  if (!n) return "";
  if (Yn() === "24h")
    return n;
  const r = ba(n);
  if (!r) return n;
  const o = Number(r.hours), s = Number(r.minutes), a = r.seconds !== null && r.seconds !== void 0 ? Number(r.seconds) : void 0;
  if (!Number.isFinite(o) || !Number.isFinite(s)) return n;
  const l = Number.isFinite(a), c = o % 12 === 0 ? 12 : o % 12, d = String(s).padStart(2, "0"), h = l ? `:${String(a).padStart(2, "0")}` : "", { amLabel: f, pmLabel: m } = T(this, re, Nl).call(this), g = o >= 12 ? m : f;
  return `${c}:${d}${h} ${g}`.trim();
}, "#getInitialEditValue"), Nl = /* @__PURE__ */ u(function() {
  var c, d;
  const n = C("EIDOLON.TimeTrigger.TimePeriodAM", "AM"), i = C("EIDOLON.TimeTrigger.TimePeriodPM", "PM"), r = ((c = n.toLocaleLowerCase) == null ? void 0 : c.call(n)) ?? n.toLowerCase(), o = ((d = i.toLocaleLowerCase) == null ? void 0 : d.call(i)) ?? i.toLowerCase(), s = T(this, re, $l).call(this, n), a = T(this, re, $l).call(this, i), l = `${s}|${a}|AM|PM`;
  return {
    amLabel: n,
    pmLabel: i,
    amLower: r,
    pmLower: o,
    periodPattern: l
  };
}, "#getPeriodMatchData"), $l = /* @__PURE__ */ u(function(n) {
  return typeof n != "string" ? "" : n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}, "#escapeForRegex"), Ws = new WeakMap(), zs = new WeakMap(), Fl = /* @__PURE__ */ u(function() {
  const n = this.scene;
  if (!n || typeof n.getFlag != "function") return !1;
  try {
    return !!n.getFlag(L, bl);
  } catch (i) {
    D("TimeTriggerWindow | Failed to read scene real-time flag", {
      sceneId: (n == null ? void 0 : n.id) ?? null,
      message: (i == null ? void 0 : i.message) ?? String(i)
    });
  }
  return !1;
}, "#readSceneRealTimeFlag"), Ys = new WeakMap(), mf = /* @__PURE__ */ u(function() {
  if (typeof p(this, wi) == "function")
    try {
      p(this, wi).call(this);
    } catch (n) {
      console.error(`${L} | Failed to dispose time format subscription`, n);
    }
  O(this, wi, null);
}, "#disposeTimeFormatSubscription"), gf = /* @__PURE__ */ u(function() {
  if (typeof p(this, Ei) == "function")
    try {
      p(this, Ei).call(this);
    } catch (n) {
      console.error(`${L} | Failed to dispose manage time subscription`, n);
    }
  O(this, Ei, null);
}, "#disposeManageTimeSubscription"), u(bi, "TimeTriggerWindow"), le(bi, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Le(bi, bi, "DEFAULT_OPTIONS"),
  {
    id: `${L}-time-trigger`,
    window: {
      title: C("EIDOLON.TimeTrigger.Title", "Time Trigger"),
      resizable: !1
    },
    position: {
      width: "auto",
      height: "auto"
    }
  },
  { inplace: !1 }
)), le(bi, "PARTS", {
  content: {
    template: `modules/${L}/templates/time-trigger.html`
  }
});
let Al = bi;
function va(t, e = {}) {
  if (typeof t != "function")
    throw new TypeError("createApplicationFactory requires a constructor function.");
  const n = /* @__PURE__ */ u(function(r = {}) {
    const o = foundry.utils.mergeObject(
      e ?? {},
      r ?? {},
      { inplace: !1 }
    );
    return new t(o);
  }, "applicationFactory");
  return n.__eidolonFactorySignature = "options", n.__eidolonFactoryTarget = t, n;
}
u(va, "createApplicationFactory");
const Pu = /* @__PURE__ */ new Set();
var Ie, et, Si, pr, pf, yf;
const Cu = class Cu {
  constructor({ windowFactory: e } = {}) {
    _(this, pr);
    _(this, Ie, null);
    _(this, et, null);
    _(this, Si);
    const n = va(Al);
    typeof e == "function" ? e.__eidolonFactorySignature === "options" ? O(this, Si, (r, o = {}) => e({ scene: r, ...o ?? {} })) : O(this, Si, e) : O(this, Si, /* @__PURE__ */ u((r, o = {}) => n({ scene: r, ...o ?? {} }), "fallbackFactory"));
  }
  onReady() {
    var n;
    const e = typeof ((n = game.time) == null ? void 0 : n.worldTime) == "number" && Number.isFinite(game.time.worldTime) ? game.time.worldTime : null;
    D("TimeTriggerManager#onReady", { worldTime: e }), e !== null && O(this, et, e);
  }
  onCanvasReady(e) {
    const n = (e == null ? void 0 : e.scene) ?? Ar();
    D("TimeTriggerManager#onCanvasReady", { sceneId: (n == null ? void 0 : n.id) ?? null }), this.refreshTimeTriggerWindow(n), this.handleTimeTriggerEvaluation(n);
  }
  onUpdateScene(e) {
    const n = Ar();
    D("TimeTriggerManager#onUpdateScene", {
      sceneId: (e == null ? void 0 : e.id) ?? null,
      activeSceneId: (n == null ? void 0 : n.id) ?? null
    }), !(!n || e.id !== n.id) && (this.refreshTimeTriggerWindow(e), this.handleTimeTriggerEvaluation(e));
  }
  onUpdateWorldTime(e, n) {
    D("TimeTriggerManager#onUpdateWorldTime", {
      worldTime: e,
      diff: n,
      hasWindow: !!p(this, Ie)
    }), p(this, Ie) && p(this, Ie).render();
    const i = Ar(), r = T(this, pr, pf).call(this, e, n);
    this.handleTimeTriggerEvaluation(i, e, r);
  }
  refreshTimeTriggerWindow(e) {
    var l, c, d;
    if (!e) return;
    const n = !!((l = game.user) != null && l.isGM), i = !!e.getFlag(L, cs), r = !!e.getFlag(L, pl), o = !!e.getFlag(L, yl);
    if (D("TimeTriggerManager#refreshTimeTriggerWindow", {
      sceneId: e.id,
      isGM: n,
      isActive: i,
      hideWindow: r,
      showPlayerWindow: o
    }), !(i && !r && (n || o))) {
      p(this, Ie) && (D("Closing time trigger window", { reason: "not-visible" }), p(this, Ie).close({ force: !0 }), O(this, Ie, null));
      return;
    }
    const a = !!n;
    if (p(this, Ie) && ((c = p(this, Ie).scene) == null ? void 0 : c.id) === e.id) {
      D("Refreshing existing time trigger window", { sceneId: e.id }), p(this, Ie).showControls = a, p(this, Ie).render();
      return;
    }
    p(this, Ie) && (D("Closing existing window before creating new instance", {
      previousSceneId: ((d = p(this, Ie).scene) == null ? void 0 : d.id) ?? null
    }), p(this, Ie).close({ force: !0 })), O(this, Ie, p(this, Si).call(this, e, { showControls: a })), D("Rendering new time trigger window", { sceneId: e.id }), p(this, Ie).render({ force: !0 });
  }
  async handleTimeTriggerEvaluation(e, n, i) {
    var l;
    const r = e ?? Ar();
    if (!r) {
      D("handleTimeTriggerEvaluation skipped", {
        reason: "no-active-scene",
        providedSceneId: (e == null ? void 0 : e.id) ?? null,
        currentWorldTime: n
      }), typeof n == "number" && Number.isFinite(n) && O(this, et, n);
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
      await T(this, pr, yf).call(this, r, a, o);
    } catch (c) {
      console.error(`${L} | Unexpected error while evaluating time triggers`, c), D("handleTimeTriggerEvaluation error", { message: (c == null ? void 0 : c.message) ?? String(c) });
    } finally {
      O(this, et, o), zn();
    }
  }
};
Ie = new WeakMap(), et = new WeakMap(), Si = new WeakMap(), pr = new WeakSet(), pf = /* @__PURE__ */ u(function(e, n) {
  return typeof p(this, et) == "number" && Number.isFinite(p(this, et)) ? (D("Resolved previous world time from cache", {
    previousWorldTime: p(this, et)
  }), p(this, et)) : typeof e == "number" && Number.isFinite(e) && typeof n == "number" && Number.isFinite(n) ? (D("Resolved previous world time using diff", {
    worldTime: e,
    diff: n,
    resolved: e - n
  }), e - n) : typeof e == "number" && Number.isFinite(e) ? e : null;
}, "#resolvePreviousWorldTime"), yf = /* @__PURE__ */ u(async function(e, n, i) {
  var g, y, b;
  if (!((g = game.user) != null && g.isGM)) {
    D("Skipping trigger evaluation because user is not a GM");
    return;
  }
  if (!(e != null && e.id)) {
    D("Skipping trigger evaluation because the scene is missing an id");
    return;
  }
  if (!!!e.getFlag(L, cs)) {
    D("Skipping trigger evaluation because scene is inactive", { sceneId: e.id });
    return;
  }
  if (typeof i != "number" || !Number.isFinite(i)) return;
  (typeof n != "number" || !Number.isFinite(n)) && (n = i);
  const o = nr(e);
  if (!o.length) {
    D("No time triggers configured for scene", { sceneId: e.id });
    return;
  }
  const s = Eg(e), a = /* @__PURE__ */ new Set();
  for (const v of o)
    v != null && v.id && a.add(v.id);
  let l = !1;
  for (const v of Object.keys(s))
    a.has(v) || (delete s[v], l = !0);
  if (ur("Evaluating scene time triggers", {
    sceneId: e.id,
    previousWorldTime: n,
    currentWorldTime: i,
    triggerCount: o.length
  }), i <= n) {
    D("Detected world time rewind", {
      previousWorldTime: n,
      currentWorldTime: i
    });
    for (const v of o) {
      if (!(v != null && v.id) || !v.allowReplayOnRewind) continue;
      const w = s[v.id];
      typeof w == "number" ? i < w ? (D("Clearing trigger history due to rewind", {
        triggerId: v.id,
        lastFired: w,
        currentWorldTime: i
      }), delete s[v.id], l = !0) : D("Preserving trigger history after rewind", {
        triggerId: v.id,
        lastFired: w,
        currentWorldTime: i
      }) : D("No history stored for rewind-enabled trigger", {
        triggerId: v.id
      });
    }
    l && (D("Persisting history cleanup after rewind", {
      sceneId: e.id
    }), await Ga(e, s)), zn();
    return;
  }
  const c = n, d = i, h = [], f = Math.floor(c / tr), m = Math.floor(d / tr);
  for (const v of o) {
    if (!(v != null && v.id)) continue;
    const w = ef(v.time);
    if (w === null) {
      Ng(e, v), D("Skipping trigger with invalid time", {
        triggerId: v.id,
        time: v.time
      });
      continue;
    }
    for (let E = f; E <= m; E++) {
      const S = E * tr + w;
      if (S < c || S > d) continue;
      const k = s[v.id];
      if (typeof k == "number" && k >= S) {
        D("Skipping trigger because it already fired within window", {
          triggerId: v.id,
          lastFired: k,
          absoluteTime: S
        });
        continue;
      }
      h.push({ trigger: v, absoluteTime: S });
    }
  }
  if (!h.length) {
    l && await Ga(e, s), D("No triggers scheduled to fire within evaluation window", {
      sceneId: e.id
    }), zn();
    return;
  }
  h.sort((v, w) => v.absoluteTime - w.absoluteTime), D("Queued triggers for execution", {
    entries: h.map((v) => ({
      triggerId: v.trigger.id,
      absoluteTime: v.absoluteTime
    }))
  });
  for (const v of h)
    try {
      D("Executing time trigger action", {
        triggerId: v.trigger.id,
        absoluteTime: v.absoluteTime
      }), await lf(e, v.trigger);
    } catch (w) {
      console.error(`${L} | Failed to execute time trigger action`, w), (b = (y = ui.notifications) == null ? void 0 : y.error) == null || b.call(
        y,
        C(
          "EIDOLON.TimeTrigger.TriggerActionError",
          "Failed to execute a scene time trigger action. Check the console for details."
        )
      ), D("Trigger execution failed", {
        triggerId: v.trigger.id,
        message: (w == null ? void 0 : w.message) ?? String(w)
      });
    } finally {
      s[v.trigger.id] = v.absoluteTime, l = !0, D("Recorded trigger execution", {
        triggerId: v.trigger.id,
        absoluteTime: v.absoluteTime
      });
    }
  l && (D("Persisting trigger history updates", { sceneId: e.id }), await Ga(e, s)), zn();
}, "#evaluateSceneTimeTriggers"), u(Cu, "TimeTriggerManager");
let Dl = Cu;
function Ng(t, e) {
  var r, o;
  const n = `${(t == null ? void 0 : t.id) ?? "unknown"}:${(e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.time) ?? "unknown"}`;
  if (Pu.has(n)) return;
  Pu.add(n);
  const i = C(
    "EIDOLON.TimeTrigger.InvalidTimeWarning",
    "A scene time trigger has an invalid time value and was skipped."
  );
  (o = (r = ui.notifications) == null ? void 0 : r.warn) == null || o.call(r, i), console.warn(`${L} | Invalid time for trigger`, { scene: t == null ? void 0 : t.id, trigger: e });
}
u(Ng, "warnInvalidTriggerTime");
var Mt, oo, xt, Nn, Ci, Kt, sr, Ks, Xs, so, ao, Ti, Xt, G, Rl, Vi, Go, Hl, Wo, ql, zt, bf, jl, vf, Bl, wf, Js, Qs, Zs, ea, ta, na, Ul, Ef, zo, ia, ra;
const Tu = class Tu {
  constructor() {
    _(this, G);
    _(this, Mt, !1);
    _(this, oo, Lo);
    _(this, xt, /* @__PURE__ */ new Map());
    _(this, Nn, null);
    _(this, Ci, null);
    _(this, Kt, 0);
    _(this, sr, null);
    _(this, Ks, null);
    _(this, Xs, null);
    _(this, so, !1);
    _(this, ao, !1);
    _(this, Ti, !1);
    _(this, Xt, !1);
    _(this, Js, /* @__PURE__ */ u((e, n = {}) => {
      D("GameTimeAutomation | Pause state changed", {
        paused: e,
        userId: (n == null ? void 0 : n.userId) ?? null,
        broadcast: (n == null ? void 0 : n.broadcast) ?? null
      }), T(this, G, zt).call(this, { pausedOverride: e });
    }, "#handlePause"));
    _(this, Qs, /* @__PURE__ */ u((e) => {
      e != null && e.id && (p(this, xt).set(e.id, Math.max(e.round ?? 0, 1)), D("GameTimeAutomation | Combat started", { combatId: e.id, round: e.round ?? 0 }), T(this, G, zt).call(this));
    }, "#handleCombatStart"));
    _(this, Zs, /* @__PURE__ */ u((e, n) => {
      if (!(e != null && e.id)) return;
      const i = typeof n == "number" && Number.isFinite(n) ? n : typeof e.round == "number" && Number.isFinite(e.round) ? e.round : 0, r = i > 0 ? i : 1, o = p(this, xt).get(e.id), s = o ? Math.max(o, 1) : 1, a = r > 1 ? Math.max(r - s, 0) : 0;
      if (D("GameTimeAutomation | Combat round change detected", {
        combatId: e.id,
        effectiveRound: r,
        completedRounds: a,
        enabled: p(this, Mt),
        paused: (game == null ? void 0 : game.paused) ?? null
      }), a > 0 && p(this, Mt) && p(this, Xt) && !(game != null && game.paused) && T(this, G, Vi).call(this) && T(this, G, Go).call(this, e)) {
        const l = a * p(this, oo);
        l > 0 && (D("GameTimeAutomation | Advancing time for completed combat rounds", {
          combatId: e.id,
          completedRounds: a,
          delta: l
        }), T(this, G, Bl).call(this, l));
      }
      p(this, xt).set(e.id, Math.max(r, 1));
    }, "#handleCombatRound"));
    _(this, ea, /* @__PURE__ */ u((e) => {
      e != null && e.id && (p(this, xt).delete(e.id), D("GameTimeAutomation | Combat ended", { combatId: e.id }), T(this, G, zt).call(this));
    }, "#handleCombatEnd"));
    _(this, ta, /* @__PURE__ */ u((e) => {
      e != null && e.id && (p(this, xt).delete(e.id), D("GameTimeAutomation | Combat deleted", { combatId: e.id }), T(this, G, zt).call(this));
    }, "#handleCombatDelete"));
    _(this, na, /* @__PURE__ */ u((e, n) => {
      if (e != null && e.id) {
        if (typeof (n == null ? void 0 : n.round) == "number" && Number.isFinite(n.round)) {
          const i = Math.max(n.round, 1);
          p(this, xt).set(e.id, i), D("GameTimeAutomation | Combat round manually updated", {
            combatId: e.id,
            round: i
          });
        }
        (Object.prototype.hasOwnProperty.call(n ?? {}, "active") || (n == null ? void 0 : n.round) !== void 0) && T(this, G, zt).call(this);
      }
    }, "#handleCombatUpdate"));
    _(this, ia, /* @__PURE__ */ u((e) => {
      T(this, G, zo).call(this, e == null ? void 0 : e.scene), T(this, G, zt).call(this);
    }, "#handleCanvasReady"));
    _(this, ra, /* @__PURE__ */ u((e) => {
      if (!Qe(e)) return;
      const n = T(this, G, Ul).call(this);
      if (!n || n.id !== e.id) return;
      T(this, G, zo).call(this, e) && T(this, G, zt).call(this);
    }, "#handleSceneUpdate"));
  }
  registerHooks() {
    p(this, so) || (O(this, so, !0), Hooks.on("pauseGame", p(this, Js)), Hooks.on("combatStart", p(this, Qs)), Hooks.on("combatRound", p(this, Zs)), Hooks.on("combatEnd", p(this, ea)), Hooks.on("deleteCombat", p(this, ta)), Hooks.on("updateCombat", p(this, na)), Hooks.on("canvasReady", p(this, ia)), Hooks.on("updateScene", p(this, ra)));
  }
  initialize() {
    p(this, ao) || (O(this, ao, !0), O(this, Ks, rf((e) => {
      const n = !!e, i = n !== p(this, Mt);
      O(this, Mt, n), D("GameTimeAutomation | Manage time toggled", { enabled: n }), i && n && T(this, G, ql).call(this), T(this, G, zt).call(this);
    })), O(this, Xs, bg((e) => {
      O(this, oo, e), D("GameTimeAutomation | Seconds per round updated", { value: e });
    })), T(this, G, ql).call(this), T(this, G, zo).call(this), T(this, G, zt).call(this));
  }
};
Mt = new WeakMap(), oo = new WeakMap(), xt = new WeakMap(), Nn = new WeakMap(), Ci = new WeakMap(), Kt = new WeakMap(), sr = new WeakMap(), Ks = new WeakMap(), Xs = new WeakMap(), so = new WeakMap(), ao = new WeakMap(), Ti = new WeakMap(), Xt = new WeakMap(), G = new WeakSet(), Rl = /* @__PURE__ */ u(function() {
  var e;
  try {
    if (typeof ((e = globalThis.performance) == null ? void 0 : e.now) == "function")
      return globalThis.performance.now();
  } catch (n) {
    D("GameTimeAutomation | Failed to read high-resolution timestamp", {
      message: (n == null ? void 0 : n.message) ?? String(n)
    });
  }
  return Date.now();
}, "#currentTimestamp"), Vi = /* @__PURE__ */ u(function() {
  var e;
  return !!((e = game == null ? void 0 : game.user) != null && e.isGM && game.user.active !== !1);
}, "#canControlTime"), Go = /* @__PURE__ */ u(function(e) {
  var i, r;
  if (!e) return !1;
  if (e.active === !0) return !0;
  if (e.active === !1) return !1;
  const n = (i = game == null ? void 0 : game.combats) == null ? void 0 : i.active;
  return (n == null ? void 0 : n.id) === e.id ? !0 : ((r = game == null ? void 0 : game.combat) == null ? void 0 : r.id) === e.id ? game.combat.active ?? !0 : !1;
}, "#isCombatDocumentActive"), Hl = /* @__PURE__ */ u(function(e) {
  return e ? typeof e.started == "boolean" ? e.started : (e.round ?? 0) > 0 : !1;
}, "#hasCombatStarted"), Wo = /* @__PURE__ */ u(function() {
  var i;
  const e = Array.isArray((i = game == null ? void 0 : game.combats) == null ? void 0 : i.contents) ? game.combats.contents : [];
  for (const r of e)
    if (T(this, G, Go).call(this, r) && T(this, G, Hl).call(this, r))
      return !0;
  const n = game == null ? void 0 : game.combat;
  return !!(n && T(this, G, Go).call(this, n) && T(this, G, Hl).call(this, n));
}, "#isCombatRunning"), ql = /* @__PURE__ */ u(function() {
  var n;
  p(this, xt).clear();
  const e = Array.isArray((n = game == null ? void 0 : game.combats) == null ? void 0 : n.contents) ? game.combats.contents : [];
  for (const i of e)
    i != null && i.id && p(this, xt).set(i.id, Math.max(i.round ?? 0, 1));
}, "#hydrateRoundTracking"), zt = /* @__PURE__ */ u(function({ pausedOverride: e } = {}) {
  const n = typeof e == "boolean" ? e : !!(game != null && game.paused), i = p(this, Mt), r = p(this, Xt), o = i && r, s = {
    manageTimeEnabled: i,
    sceneAllowsRealTime: r,
    effectiveEnabled: o,
    paused: n,
    canControl: T(this, G, Vi).call(this),
    combatRunning: T(this, G, Wo).call(this),
    overrideApplied: typeof e == "boolean"
  };
  if (D("GameTimeAutomation | Sync running state", s), !o || !T(this, G, Vi).call(this)) {
    T(this, G, jl).call(this);
    return;
  }
  T(this, G, bf).call(this);
}, "#syncRunningState"), bf = /* @__PURE__ */ u(function() {
  p(this, Nn) === null && (O(this, Ci, T(this, G, Rl).call(this)), O(this, Nn, globalThis.setInterval(() => T(this, G, vf).call(this), 1e3)), D("GameTimeAutomation | Started real-time ticker"));
}, "#startRealTimeTicker"), jl = /* @__PURE__ */ u(function() {
  p(this, Nn) !== null && (globalThis.clearInterval(p(this, Nn)), O(this, Nn, null), D("GameTimeAutomation | Stopped real-time ticker")), O(this, Ci, null), O(this, Kt, 0), O(this, Ti, !1);
}, "#stopRealTimeTicker"), vf = /* @__PURE__ */ u(function() {
  if (!p(this, Mt) || !p(this, Xt) || !T(this, G, Vi).call(this)) {
    T(this, G, jl).call(this);
    return;
  }
  const e = T(this, G, Rl).call(this);
  if (typeof e != "number" || !Number.isFinite(e)) return;
  const n = p(this, Ci) ?? e, i = (e - n) / 1e3;
  if (O(this, Ci, e), !Number.isFinite(i) || i <= 0) return;
  const r = !!(game != null && game.paused), o = T(this, G, Wo).call(this);
  if (r || o) {
    p(this, Ti) || D("GameTimeAutomation | Tick skipped", { paused: r, combatRunning: o }), O(this, Ti, !0), O(this, Kt, 0);
    return;
  }
  O(this, Ti, !1), D("GameTimeAutomation | Real-time tick", { deltaSeconds: i }), T(this, G, Bl).call(this, i);
}, "#tickRealTime"), Bl = /* @__PURE__ */ u(function(e) {
  if (!p(this, Mt) || !p(this, Xt)) return;
  const n = Number(e);
  !Number.isFinite(n) || n <= 0 || (O(this, Kt, p(this, Kt) + n), !p(this, sr) && O(this, sr, T(this, G, wf).call(this)));
}, "#queueAdvance"), wf = /* @__PURE__ */ u(async function() {
  var e, n;
  for (; p(this, Kt) > 0; ) {
    if (!p(this, Mt) || !p(this, Xt) || game != null && game.paused || !T(this, G, Vi).call(this) || T(this, G, Wo).call(this)) {
      O(this, Kt, 0);
      break;
    }
    const i = p(this, Kt);
    O(this, Kt, 0);
    try {
      if (typeof ((e = game == null ? void 0 : game.time) == null ? void 0 : e.advance) == "function")
        D("GameTimeAutomation | Advancing world time", { delta: i }), await game.time.advance(i), D("GameTimeAutomation | World time advanced", {
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
  O(this, sr, null);
}, "#flushAdvanceQueue"), Js = new WeakMap(), Qs = new WeakMap(), Zs = new WeakMap(), ea = new WeakMap(), ta = new WeakMap(), na = new WeakMap(), Ul = /* @__PURE__ */ u(function() {
  const e = Ar();
  return Qe(e) ? e : null;
}, "#getActiveSceneDocument"), Ef = /* @__PURE__ */ u(function(e) {
  if (!Qe(e)) return !1;
  try {
    return !!e.getFlag(L, bl);
  } catch (n) {
    return D("GameTimeAutomation | Failed to read scene real-time flag", {
      sceneId: (e == null ? void 0 : e.id) ?? null,
      message: (n == null ? void 0 : n.message) ?? String(n)
    }), !1;
  }
}, "#isSceneRealTimeAllowed"), zo = /* @__PURE__ */ u(function(e) {
  const n = Qe(e) ? e : T(this, G, Ul).call(this), i = T(this, G, Ef).call(this, n), r = p(this, Xt);
  return O(this, Xt, i), r !== i ? (D("GameTimeAutomation | Scene real-time allowance changed", {
    sceneId: (n == null ? void 0 : n.id) ?? null,
    allows: i
  }), !0) : !1;
}, "#refreshSceneAutomationState"), ia = new WeakMap(), ra = new WeakMap(), u(Tu, "GameTimeAutomation");
let Pl = Tu;
var Gd, $n, Be, Li, pn, oa, Te, Sf, Cf, Tf, Lf, sa, Gl, aa, If, la, Of, kf;
const fn = class fn extends sn(on) {
  constructor(n = {}) {
    const { scene: i, trigger: r, triggerIndex: o, onSave: s, ...a } = n ?? {};
    super(a);
    _(this, Te);
    _(this, $n, null);
    _(this, Be, null);
    _(this, Li, null);
    _(this, pn, null);
    _(this, oa, /* @__PURE__ */ u(() => {
      (this.rendered ?? this.isRendered ?? !1) && (O(this, pn, T(this, Te, Sf).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    _(this, sa, /* @__PURE__ */ u((n) => {
      var o, s;
      const i = n.currentTarget, r = i == null ? void 0 : i.closest("form");
      r && (D("Trigger action selection changed", {
        sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
        triggerId: ((s = this.trigger) == null ? void 0 : s.id) ?? null,
        actionId: (i == null ? void 0 : i.value) ?? null
      }), T(this, Te, Gl).call(this, i.value, r));
    }, "#onActionSelectChange"));
    _(this, aa, /* @__PURE__ */ u((n) => {
      var c, d, h, f;
      n.preventDefault();
      const i = n.currentTarget, r = i == null ? void 0 : i.closest("form");
      if (!r) return;
      const o = (c = i.dataset) == null ? void 0 : c.target;
      if (!o) return;
      const s = typeof (CSS == null ? void 0 : CSS.escape) == "function" ? CSS.escape : (m) => m, a = r.querySelector(`[name="${s(o)}"]`);
      if (!a) return;
      D("Opening file picker for trigger", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        triggerId: ((h = this.trigger) == null ? void 0 : h.id) ?? null,
        target: o
      }), new FilePicker({
        type: ((f = i.dataset) == null ? void 0 : f.type) || "audio",
        current: a.value,
        callback: /* @__PURE__ */ u((m) => {
          var g, y;
          a.value = m, a.dispatchEvent(new Event("change")), D("Trigger form file selected", {
            sceneId: ((g = this.scene) == null ? void 0 : g.id) ?? null,
            triggerId: ((y = this.trigger) == null ? void 0 : y.id) ?? null,
            target: o,
            path: m
          });
        }, "callback")
      }).render({ force: !0 });
    }, "#onFilePicker"));
    _(this, la, /* @__PURE__ */ u(async (n) => {
      var r, o;
      n.preventDefault();
      const i = n.currentTarget;
      i instanceof HTMLFormElement && (D("Trigger form submitted", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null,
        triggerId: ((o = this.trigger) == null ? void 0 : o.id) ?? null
      }), await T(this, Te, Of).call(this, i));
    }, "#onSubmit"));
    this.scene = i ?? null, this.trigger = r ?? null, this.triggerIndex = Number.isInteger(o) ? Number(o) : null, this.onSave = typeof s == "function" ? s : null, O(this, Li, Yc(p(this, oa)));
  }
  async _prepareContext() {
    var n, i;
    ur("TriggerFormApplication#_prepareContext", {
      sceneId: ((n = this.scene) == null ? void 0 : n.id) ?? null,
      triggerId: ((i = this.trigger) == null ? void 0 : i.id) ?? null,
      triggerIndex: this.triggerIndex
    });
    try {
      const r = this.trigger ?? { action: Vo, data: {} }, o = r.action ?? Vo, s = Du(r.time), a = s.format ?? "12h", l = a === "12h" ? _g() : [], c = s.period ?? (l.length > 0 ? l[0].value : null), d = a === "12h" ? l.map((m) => ({
        ...m,
        selected: m.value === c
      })) : [], h = Fu().map((m) => ({
        id: m.id,
        label: typeof m.label == "function" ? m.label() : m.label,
        selected: m.id === o
      })), f = Fu().map((m) => {
        const g = m.id === r.action ? r : { ...r, action: m.id }, y = Lg(g);
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
        timePeriodValue: c ?? "",
        timeFormat: a,
        is12HourFormat: a === "12h",
        is24HourFormat: a === "24h",
        timePeriodOptions: d,
        actions: h,
        actionSections: f,
        allowReplayOnRewind: !!r.allowReplayOnRewind,
        labels: {
          time: C("EIDOLON.TimeTrigger.TriggerTime", "Trigger Time"),
          hour: C("EIDOLON.TimeTrigger.TriggerTimeHour", "Hour"),
          minute: C("EIDOLON.TimeTrigger.TriggerTimeMinute", "Minute"),
          period: C("EIDOLON.TimeTrigger.TriggerTimePeriod", "AM / PM"),
          action: C("EIDOLON.TimeTrigger.TriggerAction", "Action"),
          allowReplayOnRewind: C(
            "EIDOLON.TimeTrigger.AllowReplayOnRewind",
            "Allow replay after rewinding time"
          ),
          allowReplayOnRewindHint: C(
            "EIDOLON.TimeTrigger.AllowReplayOnRewindHint",
            "When enabled, this trigger can fire again if world time moves backward."
          ),
          save: C("EIDOLON.TimeTrigger.TriggerSave", "Save Trigger")
        }
      };
    } finally {
      zn();
    }
  }
  _onRender(n, i) {
    var l, c, d;
    super._onRender(n, i);
    const r = this.element;
    if (!r) return;
    D("Trigger form rendered", {
      sceneId: ((l = this.scene) == null ? void 0 : l.id) ?? null,
      triggerId: ((c = this.trigger) == null ? void 0 : c.id) ?? null
    });
    const o = Array.from(((d = document == null ? void 0 : document.body) == null ? void 0 : d.classList) ?? []).find(
      (h) => h.startsWith("theme-")
    );
    o && r.classList.add(o);
    const s = r.querySelector("form");
    if (!s) return;
    T(this, Te, If).call(this, s), T(this, Te, Cf).call(this, s), s.addEventListener("submit", p(this, la));
    const a = s.querySelector("[data-action-select]");
    a && (a.addEventListener("change", p(this, sa)), T(this, Te, Gl).call(this, a.value, s)), s.querySelectorAll("[data-action-file-picker]").forEach((h) => {
      h.addEventListener("click", p(this, aa));
    });
  }
  async close(n = {}) {
    var i;
    if ((i = p(this, $n)) == null || i.call(this), O(this, $n, null), O(this, Be, null), O(this, pn, null), typeof p(this, Li) == "function")
      try {
        p(this, Li).call(this);
      } catch (r) {
        console.error(`${L} | Failed to dispose trigger form time format subscription`, r);
      }
    return O(this, Li, null), super.close(n);
  }
};
$n = new WeakMap(), Be = new WeakMap(), Li = new WeakMap(), pn = new WeakMap(), oa = new WeakMap(), Te = new WeakSet(), Sf = /* @__PURE__ */ u(function() {
  var a, l, c, d, h, f, m;
  const n = (l = (a = this.element) == null ? void 0 : a.querySelector) == null ? void 0 : l.call(a, "form");
  if (!(n instanceof HTMLFormElement)) return null;
  const i = Array.from(n.elements ?? []), r = [];
  for (const g of i)
    if ((g instanceof HTMLInputElement || g instanceof HTMLSelectElement || g instanceof HTMLTextAreaElement) && g.name && !(((c = g.dataset) == null ? void 0 : c.timeHidden) !== void 0 || ((d = g.dataset) == null ? void 0 : d.timeHour) !== void 0 || ((h = g.dataset) == null ? void 0 : h.timeMinute) !== void 0 || ((f = g.dataset) == null ? void 0 : f.timePeriod) !== void 0)) {
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
    const g = o.querySelector("[data-time-hidden]"), y = o.querySelector("[data-time-hour]"), b = o.querySelector("[data-time-minute]"), v = o.querySelector("[data-time-period]");
    s = {
      format: ((m = o.dataset) == null ? void 0 : m.timeFormat) ?? null,
      canonical: g instanceof HTMLInputElement ? g.value : "",
      hour: y instanceof HTMLInputElement ? y.value : "",
      minute: b instanceof HTMLInputElement ? b.value : "",
      period: v instanceof HTMLSelectElement ? v.value : ""
    };
  }
  return {
    fields: r,
    time: s
  };
}, "#captureFormState"), Cf = /* @__PURE__ */ u(function(n) {
  if (!p(this, pn)) return;
  if (!(n instanceof HTMLFormElement)) {
    O(this, pn, null);
    return;
  }
  const { fields: i = [], time: r = null } = p(this, pn) ?? {};
  O(this, pn, null), T(this, Te, Tf).call(this, n, i), T(this, Te, Lf).call(this, n, r);
}, "#restorePendingFormState"), Tf = /* @__PURE__ */ u(function(n, i) {
  if (!Array.isArray(i) || i.length === 0) return;
  const r = typeof (CSS == null ? void 0 : CSS.escape) == "function" ? CSS.escape : (o) => o;
  for (const o of i) {
    if (!o || typeof o.name != "string") continue;
    const s = r(o.name);
    if (o.kind === "checkbox" || o.kind === "radio") {
      const l = `input[type="${o.kind}"][name="${s}"]`, c = n.querySelectorAll(l);
      c.forEach((d) => {
        d instanceof HTMLInputElement && (c.length === 1 || d.value === o.value) && (d.checked = !!o.checked);
      });
      continue;
    }
    if (o.kind === "select-multiple") {
      const l = n.querySelector(`select[name="${s}"]`);
      if (!(l instanceof HTMLSelectElement)) continue;
      const c = new Set(Array.isArray(o.values) ? o.values : []);
      Array.from(l.options ?? []).forEach((d) => {
        d.selected = c.has(d.value);
      });
      continue;
    }
    const a = n.querySelector(`[name="${s}"]`);
    (a instanceof HTMLInputElement || a instanceof HTMLSelectElement || a instanceof HTMLTextAreaElement) && (a.value = o.value ?? "");
  }
}, "#restoreFieldValues"), Lf = /* @__PURE__ */ u(function(n, i) {
  var w, E, S;
  const r = n.querySelector("[data-time-format]");
  if (!(r instanceof HTMLElement)) {
    typeof p(this, Be) == "function" && p(this, Be).call(this);
    return;
  }
  const o = ((w = r.dataset) == null ? void 0 : w.timeFormat) === "24h" ? "24h" : "12h", s = r.querySelector("[data-time-hour]"), a = r.querySelector("[data-time-minute]"), l = r.querySelector("[data-time-period]"), c = r.querySelector("[data-time-hidden]");
  if (!i) {
    if (s instanceof HTMLInputElement && (s.value = ""), a instanceof HTMLInputElement && (a.value = ""), l instanceof HTMLSelectElement) {
      const I = ((S = (E = l.options) == null ? void 0 : E[0]) == null ? void 0 : S.value) ?? "";
      l.value = I;
    }
    c instanceof HTMLInputElement && (c.value = ""), typeof p(this, Be) == "function" && p(this, Be).call(this);
    return;
  }
  const d = typeof i.canonical == "string" ? i.canonical : "", h = typeof i.period == "string" ? i.period : "", f = typeof i.hour == "string" ? i.hour : "", m = typeof i.minute == "string" ? i.minute : "";
  let g = "", y = "", b = h, v = d;
  if (d) {
    const I = Du(d, o);
    g = I.hour ?? "", y = I.minute ?? "", v = I.canonical ?? d, o === "12h" ? b = I.period ?? h : b = "";
  } else
    g = f, y = m, o !== "12h" && (b = "");
  if (s instanceof HTMLInputElement && (s.value = g ?? ""), a instanceof HTMLInputElement && (a.value = y ?? ""), l instanceof HTMLSelectElement)
    if (o === "12h") {
      const I = Array.from(l.options ?? []);
      I.find((M) => M.value === b) ? l.value = b : I.length > 0 ? l.value = I[0].value : l.value = "";
    } else
      l.value = "";
  c instanceof HTMLInputElement && (c.value = v ?? ""), typeof p(this, Be) == "function" && p(this, Be).call(this);
}, "#restoreTimeInputs"), sa = new WeakMap(), Gl = /* @__PURE__ */ u(function(n, i) {
  i && i.querySelectorAll("[data-action-config]").forEach((r) => {
    const o = r.dataset.actionConfig === n;
    r.style.display = o ? "" : "none";
  });
}, "#updateActionSections"), aa = new WeakMap(), If = /* @__PURE__ */ u(function(n) {
  var h, f, m, g;
  if ((h = p(this, $n)) == null || h.call(this), O(this, $n, null), O(this, Be, null), !(n instanceof HTMLFormElement)) return;
  const i = n.querySelector("[data-time-format]"), r = ((f = i == null ? void 0 : i.dataset) == null ? void 0 : f.timeFormat) ?? null;
  if (r !== "12h" && r !== "24h")
    return;
  const o = i.querySelector("[data-time-hidden]"), s = i.querySelector("[data-time-hour]"), a = i.querySelector("[data-time-minute]"), l = r === "12h" ? i.querySelector("[data-time-period]") : null;
  if (!o || !s || !a || r === "12h" && !l) {
    D("Trigger form time inputs missing elements", {
      format: r,
      hasHidden: !!o,
      hasHour: !!s,
      hasMinute: !!a,
      hasPeriod: !!l
    });
    return;
  }
  const c = [s, a, ...l ? [l] : []], d = /* @__PURE__ */ u(() => {
    const { canonical: y, error: b } = xg(
      {
        hour: s.value,
        minute: a.value,
        period: (l == null ? void 0 : l.value) ?? null,
        time: o.value
      },
      r
    );
    o.value = y ?? "";
    const v = b ?? "";
    o.setCustomValidity(v), c.forEach((w) => {
      w.setCustomValidity(v);
    });
  }, "update");
  c.forEach((y) => {
    y.addEventListener("input", d), y.addEventListener("change", d);
  }), d(), O(this, $n, () => {
    c.forEach((y) => {
      y.removeEventListener("input", d), y.removeEventListener("change", d);
    });
  }), O(this, Be, d), D("Trigger form configured for time input", {
    format: r,
    sceneId: ((m = this.scene) == null ? void 0 : m.id) ?? null,
    triggerId: ((g = this.trigger) == null ? void 0 : g.id) ?? null
  });
}, "#setupTimeInput"), la = new WeakMap(), Of = /* @__PURE__ */ u(async function(n) {
  var o, s, a, l, c;
  if (typeof p(this, Be) == "function" && p(this, Be).call(this), typeof n.checkValidity == "function" && !n.checkValidity()) {
    typeof n.reportValidity == "function" && n.reportValidity(), D("Trigger form submission blocked by validity check", {
      sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
      triggerId: ((s = this.trigger) == null ? void 0 : s.id) ?? null
    });
    return;
  }
  const i = new FormData(n), r = Object.fromEntries(i.entries());
  delete r.timeHour, delete r.timeMinute, delete r.timePeriod, r.allowReplayOnRewind = ((a = n.querySelector('input[name="allowReplayOnRewind"]')) == null ? void 0 : a.checked) ?? !1, D("Processing trigger form submission", {
    sceneId: ((l = this.scene) == null ? void 0 : l.id) ?? null,
    triggerId: ((c = this.trigger) == null ? void 0 : c.id) ?? null,
    allowReplayOnRewind: r.allowReplayOnRewind
  }), await T(this, Te, kf).call(this, r), await this.close();
}, "#handleSubmit"), kf = /* @__PURE__ */ u(async function(n) {
  var o, s, a, l, c, d;
  const i = {
    id: ((o = this.trigger) == null ? void 0 : o.id) ?? fg(),
    time: n.time ?? "",
    action: n.action ?? Vo,
    allowReplayOnRewind: !!n.allowReplayOnRewind,
    data: {}
  };
  D("Persisting trigger from form", {
    sceneId: ((s = this.scene) == null ? void 0 : s.id) ?? null,
    triggerId: i.id,
    existingIndex: this.triggerIndex
  }), Ig(i, n);
  const r = nr(this.scene);
  this.triggerIndex !== null && r[this.triggerIndex] ? r[this.triggerIndex] = i : r.push(i);
  try {
    await af(this.scene, r), D("Trigger list saved", {
      sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
      triggerCount: r.length
    });
  } catch (h) {
    throw console.error(`${L} | Failed to save time trigger`, h), (c = (l = ui.notifications) == null ? void 0 : l.error) == null || c.call(
      l,
      C(
        "EIDOLON.TimeTrigger.TriggerSaveError",
        "Failed to save the scene's time triggers."
      )
    ), h;
  }
  if (this.onSave)
    try {
      this.onSave(r);
    } catch (h) {
      console.error(`${L} | Trigger onSave callback failed`, h), D("Trigger onSave callback failed", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        message: (h == null ? void 0 : h.message) ?? String(h)
      });
    }
}, "#persistTrigger"), u(fn, "TriggerFormApplication"), le(fn, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Le(fn, fn, "DEFAULT_OPTIONS"),
  {
    id: `${L}-trigger-form`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Gd = Le(fn, fn, "DEFAULT_OPTIONS")) == null ? void 0 : Gd.classes) ?? [], "standard-form", "themed"])
    ),
    window: {
      title: C("EIDOLON.TimeTrigger.TriggerFormTitle", "Configure Time Trigger"),
      resizable: !1
    },
    position: {
      width: 400,
      height: "auto"
    }
  },
  { inplace: !1 }
)), le(fn, "PARTS", {
  content: {
    template: `modules/${L}/templates/time-trigger-form.html`
  }
});
let Vl = fn;
function qe(t) {
  return t instanceof HTMLElement ? t : (t == null ? void 0 : t[0]) instanceof HTMLElement ? t[0] : null;
}
u(qe, "asHTMLElement");
function Yo(t) {
  return typeof (t == null ? void 0 : t.changeTab) == "function";
}
u(Yo, "isAppV2");
function Af(t, e, n, i = {}) {
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
      $g(t, e);
    }
  }
}
u(Af, "setActiveTab");
function $g(t, e) {
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
u($g, "_manualTabActivation");
function Fg(t) {
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
u(Fg, "readFormData");
const Ru = Symbol.for("eidolon.sceneConfig.v13PatchedTabs");
function Mf(t = {}) {
  const {
    tabId: e,
    tabLabel: n,
    getScene: i,
    isApplicable: r,
    renderContent: o,
    debugNamespace: s = "SceneConfigTab",
    onButtonCreate: a,
    onTabCreate: l,
    onAfterRender: c,
    logger: d = {},
    moduleId: h = "eidolon-utilities",
    tabIcon: f = "fa-solid fa-puzzle-piece"
  } = t ?? {};
  if (!e)
    throw new Error("createSceneConfigTabFactory requires a tabId.");
  if (typeof o != "function")
    throw new TypeError("createSceneConfigTabFactory requires a renderContent callback.");
  const m = typeof d.log == "function" ? d.log.bind(d) : (...A) => {
    var R;
    return (R = console.debug) == null ? void 0 : R.call(console, `${s}`, ...A);
  }, g = typeof d.group == "function" ? d.group.bind(d) : (...A) => {
    var R;
    return (R = console.groupCollapsed) == null ? void 0 : R.call(console, `${s}`, ...A);
  }, y = typeof d.groupEnd == "function" ? d.groupEnd.bind(d) : () => {
    var A;
    return (A = console.groupEnd) == null ? void 0 : A.call(console);
  }, b = Symbol(`EIDOLON_SCENE_CONFIG_TAB_CLEANUP_${e}`), v = typeof i == "function" ? i : () => null, w = typeof r == "function" ? r : () => !0, E = typeof n == "function" ? n : () => typeof n == "string" ? n : e;
  function S() {
    var B, H, V, Y, oe;
    const A = ((H = (B = foundry == null ? void 0 : foundry.applications) == null ? void 0 : B.sheets) == null ? void 0 : H.SceneConfig) ?? ((V = CONFIG == null ? void 0 : CONFIG.Scene) == null ? void 0 : V.sheetClass);
    if (!A || !Yo({ changeTab: (Y = A.prototype) == null ? void 0 : Y.changeTab })) return;
    const R = A[Ru] ?? /* @__PURE__ */ new Set();
    if (R.has(e)) return;
    R.add(e), A[Ru] = R;
    const j = (oe = A.TABS) == null ? void 0 : oe.sheet;
    if (j && Array.isArray(j.tabs) && !j.tabs.some((J) => J.id === e)) {
      const J = E({ app: null, scene: null }) ?? e;
      j.tabs.push({
        id: e,
        icon: f,
        label: J
      });
    }
    A.PARTS && !A.PARTS[e] && (A.PARTS[e] = {
      template: `modules/${h}/templates/scene-config-tab-mount.hbs`,
      scrollable: [`.tab[data-tab="${e}"]`]
    }), m("Patched v13 SceneConfig TABS/PARTS", { tabId: e });
  }
  u(S, "patchV13SceneConfig");
  function I(A, R) {
    var B, H;
    const j = v(A);
    if (!w(A, j)) {
      m("Skipped render", {
        tabId: e,
        reason: "inapplicable",
        constructor: ((B = A == null ? void 0 : A.constructor) == null ? void 0 : B.name) ?? null
      });
      return;
    }
    g("render", {
      tabId: e,
      sceneId: (j == null ? void 0 : j.id) ?? null,
      constructor: ((H = A == null ? void 0 : A.constructor) == null ? void 0 : H.name) ?? null
    });
    try {
      const V = qe(R) ?? qe(A.element);
      if (!V) {
        m("Missing root element", { tabId: e });
        return;
      }
      Yo(A) ? $(A, V, j) : M(A, V, j);
    } finally {
      y();
    }
  }
  u(I, "handleRender");
  function k(A, R, j) {
    var V;
    if (!f) {
      A.textContent = R;
      return;
    }
    const B = (V = A.querySelector("i")) == null ? void 0 : V.cloneNode(!0);
    A.textContent = "";
    const H = B ?? document.createElement("i");
    if (B || (H.className = f, j && (H.inert = !0)), A.append(H, " "), j) {
      const Y = document.createElement("span");
      Y.textContent = R, A.append(Y);
    } else
      A.append(document.createTextNode(R));
  }
  u(k, "setButtonContent");
  function M(A, R, j) {
    var oi, Fe, xe, qi, ln, si, ut, cn, q, Mo, Q, Tt, De, wr, xo, Er, ai, Sr;
    const H = [
      "nav.sheet-tabs[data-group]",
      "nav.tabs[data-group]",
      "nav.sheet-tabs",
      "nav.tabs"
    ].map((ue) => R.querySelector(ue)).find((ue) => ue instanceof HTMLElement), Y = [
      (oi = R.querySelector(".tab[data-tab]")) == null ? void 0 : oi.parentElement,
      R.querySelector(".sheet-body"),
      (xe = (Fe = H == null ? void 0 : H.parentElement) == null ? void 0 : Fe.querySelector) == null ? void 0 : xe.call(Fe, ":scope > .sheet-body"),
      H == null ? void 0 : H.parentElement
    ].find((ue) => ue instanceof HTMLElement), oe = ((qi = H == null ? void 0 : H.dataset) == null ? void 0 : qi.group) ?? ((ut = (si = (ln = H == null ? void 0 : H.querySelector) == null ? void 0 : ln.call(H, "a[data-group]")) == null ? void 0 : si.dataset) == null ? void 0 : ut.group) ?? ((Mo = (q = (cn = H == null ? void 0 : H.querySelector) == null ? void 0 : cn.call(H, "[data-group]")) == null ? void 0 : q.dataset) == null ? void 0 : Mo.group) ?? ((De = (Tt = (Q = Y == null ? void 0 : Y.querySelector) == null ? void 0 : Q.call(Y, ".tab[data-group]")) == null ? void 0 : Tt.dataset) == null ? void 0 : De.group) ?? ((xo = (wr = A._tabs) == null ? void 0 : wr[0]) == null ? void 0 : xo._group) ?? null;
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
      const ue = H.querySelector("a[data-tab]");
      (Er = ue == null ? void 0 : ue.classList) != null && Er.contains("item") && J.classList.add("item"), H.appendChild(J), typeof a == "function" && a({ app: A, button: J, nav: H, scene: j }), m("Created tab button", { tabId: e, group: oe });
    }
    k(J, E({ app: A, scene: j }) ?? e, Yo(A));
    let te = Y.querySelector(`.tab[data-tab="${e}"]`);
    if (!te) {
      te = document.createElement("div"), te.classList.add("tab"), te.dataset.tab = e, oe && (te.dataset.group = oe);
      const ue = xf(Y);
      Y.insertBefore(te, ue ?? null), typeof l == "function" && l({ app: A, tab: te, body: Y, scene: j }), m("Created tab container", { tabId: e, group: oe });
    }
    A._eidolonActiveTab === e || ((ai = J.classList) == null ? void 0 : ai.contains("active")) || te.classList.contains("active") ? (H.querySelectorAll("[data-tab].active").forEach((ue) => {
      ue !== J && ue.classList.remove("active");
    }), Y.querySelectorAll(".tab[data-tab].active").forEach((ue) => {
      ue !== te && (ue.classList.remove("active"), ue.setAttribute("hidden", "true"));
    }), J.classList.add("active"), te.classList.add("active"), te.removeAttribute("hidden")) : (J.classList.remove("active"), te.classList.remove("active"), te.setAttribute("hidden", "true"));
    const Ct = /* @__PURE__ */ u(() => {
      var Cn, P;
      ((Cn = J.classList) != null && Cn.contains("active") || te.classList.contains("active")) && ((P = J.classList) == null || P.add("active"), te.classList.add("active"), te.removeAttribute("hidden"), te.removeAttribute("aria-hidden"), te.style.display === "none" && (te.style.display = ""));
    }, "ensureTabVisible"), je = /* @__PURE__ */ u(() => {
      Ct(), requestAnimationFrame(Ct);
    }, "scheduleEnsureTabVisible");
    J.dataset.eidolonEnsureSceneTabVisibility || (J.addEventListener("click", () => {
      A._eidolonActiveTab = e, Af(A, e, oe), requestAnimationFrame(Ct);
    }), J.dataset.eidolonEnsureSceneTabVisibility = "true");
    const lt = `data-eidolon-nav-watched-${e}`;
    H.hasAttribute(lt) || (H.addEventListener("click", (ue) => {
      const Cn = ue.target.closest("[data-tab]");
      Cn && Cn.dataset.tab !== e && delete A._eidolonActiveTab;
    }), H.setAttribute(lt, "true")), Wa(A, b, m);
    const ct = o({
      app: A,
      scene: j,
      tab: te,
      tabButton: J,
      ensureTabVisible: Ct,
      scheduleEnsureTabVisible: je
    });
    typeof ct == "function" && Hu(A, b, ct), typeof c == "function" && c({
      app: A,
      scene: j,
      tab: te,
      tabButton: J,
      ensureTabVisible: Ct,
      scheduleEnsureTabVisible: je
    }), (Sr = A.setPosition) == null || Sr.call(A, { height: "auto" });
  }
  u(M, "handleRenderV1");
  function $(A, R, j) {
    const B = R.querySelector(`.tab[data-tab="${e}"]`), H = R.querySelector(`nav [data-tab="${e}"]`);
    if (!B || !H) {
      m("v2 mount not found, falling back to v1 injection", { tabId: e }), M(A, R, j);
      return;
    }
    k(H, E({ app: A, scene: j }) ?? e, !0);
    const V = /* @__PURE__ */ u(() => {
      var J;
      !((J = H.classList) != null && J.contains("active")) && !B.classList.contains("active") || (B.classList.add("active"), B.removeAttribute("hidden"), B.removeAttribute("aria-hidden"), B.style.display === "none" && (B.style.display = ""));
    }, "ensureTabVisible"), Y = /* @__PURE__ */ u(() => {
      V(), requestAnimationFrame(V);
    }, "scheduleEnsureTabVisible");
    Wa(A, b, m);
    const oe = o({
      app: A,
      scene: j,
      tab: B,
      tabButton: H,
      ensureTabVisible: V,
      scheduleEnsureTabVisible: Y
    });
    typeof oe == "function" && Hu(A, b, oe), typeof c == "function" && c({
      app: A,
      scene: j,
      tab: B,
      tabButton: H,
      ensureTabVisible: V,
      scheduleEnsureTabVisible: Y
    });
  }
  u($, "handleRenderV2");
  function N(A) {
    Wa(A, b, m);
  }
  u(N, "handleClose");
  function x() {
    return Hooks.once("init", () => {
      S();
    }), Hooks.on("renderSceneConfig", I), Hooks.on("closeSceneConfig", N), () => F();
  }
  u(x, "register");
  function F() {
    Hooks.off("renderSceneConfig", I), Hooks.off("closeSceneConfig", N);
  }
  return u(F, "unregister"), { register: x, unregister: F };
}
u(Mf, "createSceneConfigTabFactory");
function Hu(t, e, n) {
  if (!t || typeof n != "function") return;
  const i = t == null ? void 0 : t[e];
  Array.isArray(i) || (t[e] = []), t[e].push(n);
}
u(Hu, "registerCleanup");
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
u(Wa, "invokeCleanup");
function xf(t) {
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
u(xf, "findFooterElement");
const Dg = va(Vl), Pg = `modules/${L}/templates/time-trigger-scene-tab.html`, Rg = Mf({
  tabId: "time-triggers",
  tabLabel: /* @__PURE__ */ u(() => C("EIDOLON.TimeTrigger.Tab", "Time Triggers"), "tabLabel"),
  getScene: rn,
  isApplicable: Bg,
  renderContent: /* @__PURE__ */ u(({ app: t, scene: e, tab: n }) => qg(t, n, e), "renderContent"),
  logger: {
    log: D,
    group: ur,
    groupEnd: zn
  }
});
function Hg() {
  return D("Registering SceneConfig render hook"), Rg.register();
}
u(Hg, "registerSceneConfigHook");
function qg(t, e, n) {
  if (!(e instanceof HTMLElement)) return;
  const i = Qe(n) ? n : rn(t);
  ms(t, e, i);
  const r = Yc(() => {
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
u(qg, "renderTimeTriggerTab");
async function ms(t, e, n) {
  var r, o;
  const i = n ?? rn(t);
  ur("renderTimeTriggersTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!Qe(i)) {
      const B = C(
        "EIDOLON.TimeTrigger.Unavailable",
        "Time triggers are unavailable for this configuration sheet."
      );
      e.innerHTML = `<p class="notes">${B}</p>`, D("Scene lacks document for time triggers", { sceneId: (i == null ? void 0 : i.id) ?? null });
      return;
    }
    const s = `flags.${L}.${cs}`, a = `flags.${L}.${pl}`, l = `flags.${L}.${yl}`, c = !!i.getFlag(L, cs), d = !!i.getFlag(L, pl), h = !!i.getFlag(L, yl), f = nr(i);
    D("Rendering time trigger list", {
      sceneId: i.id,
      isActive: c,
      shouldHideWindow: d,
      shouldShowPlayerWindow: h,
      triggerCount: f.length
    });
    const m = C("EIDOLON.TimeTrigger.Activate", "Activate Time Trigger"), g = C(
      "EIDOLON.TimeTrigger.Description",
      "Enable scene time triggers so scheduled actions can run automatically."
    ), y = C(
      "EIDOLON.TimeTrigger.HideWindowLabel",
      "Hide Floating Time Window"
    ), b = C(
      "EIDOLON.TimeTrigger.HideWindowDescription",
      "Keep the floating time control window hidden while leaving time triggers active."
    ), v = C(
      "EIDOLON.TimeTrigger.ShowPlayerWindowLabel",
      "Share Floating Time Window with Players"
    ), w = C(
      "EIDOLON.TimeTrigger.ShowPlayerWindowDescription",
      "Let non-GM players see the floating time window (without time controls)."
    ), E = C(
      "EIDOLON.TimeTrigger.TriggerListLabel",
      "Scene Time Triggers"
    ), S = C(
      "EIDOLON.TimeTrigger.TriggerListEmpty",
      "No time triggers configured for this scene."
    ), I = C("EIDOLON.TimeTrigger.AddTrigger", "Add Trigger"), k = C("EIDOLON.TimeTrigger.EditTrigger", "Edit"), M = C("EIDOLON.TimeTrigger.DeleteTrigger", "Remove"), $ = C("EIDOLON.TimeTrigger.TriggerNow", "Trigger Now"), N = C("EIDOLON.TimeTrigger.AtLabel", "At"), x = C("EIDOLON.TimeTrigger.DoLabel", "Do"), F = C("EIDOLON.TimeTrigger.MissingTime", "(No time set)"), A = f.map((B, H) => {
      const oe = (B.time ? Mg(B.time) : "") || B.time || "" || F, J = Cg(B.action), te = [
        `${N} ${oe}`,
        `${x} ${J}`,
        ...Tg(B)
      ];
      return {
        index: H,
        summaryParts: te,
        tooltips: {
          triggerNow: $,
          edit: k,
          delete: M
        }
      };
    }), R = ((o = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : o.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof R != "function") {
      console.error(`${L} | renderTemplate is unavailable; cannot render scene tab.`), e.innerHTML = `<p class="notes">${S}</p>`;
      return;
    }
    let j = "";
    try {
      j = await R(Pg, {
        flags: {
          active: s,
          hideWindow: a,
          showPlayerWindow: l
        },
        states: {
          isActive: c,
          hideWindow: d,
          showPlayerWindow: h
        },
        labels: {
          activate: m,
          hideWindow: y,
          showPlayerWindow: v,
          triggerList: E,
          empty: S,
          add: I
        },
        hints: {
          activate: g,
          hideWindow: b,
          showPlayerWindow: w
        },
        triggers: A,
        hasTriggers: A.length > 0
      });
    } catch (B) {
      console.error(`${L} | Failed to render time trigger scene tab template`, B), e.innerHTML = `<p class="notes">${S}</p>`;
      return;
    }
    e.innerHTML = j, jg(t, e, i);
  } finally {
    zn();
  }
}
u(ms, "renderTimeTriggersTabContent");
function jg(t, e, n) {
  const i = n ?? rn(t);
  if (!Qe(i)) return;
  const r = e.querySelector('[data-action="add-trigger"]');
  r && r.addEventListener("click", () => {
    D("Add trigger button clicked", { sceneId: i.id }), qu(t, { scene: i });
  }), e.querySelectorAll('[data-action="edit-trigger"]').forEach((o) => {
    o.addEventListener("click", () => {
      const s = Number(o.dataset.index);
      if (!Number.isInteger(s)) return;
      const l = nr(i)[s];
      l && (D("Edit trigger button clicked", { sceneId: i.id, triggerId: l.id, index: s }), qu(t, { trigger: l, triggerIndex: s, scene: i }));
    });
  }), e.querySelectorAll('[data-action="delete-trigger"]').forEach((o) => {
    o.addEventListener("click", async () => {
      var c, d;
      const s = Number(o.dataset.index);
      if (!Number.isInteger(s)) return;
      const a = nr(i), l = a[s];
      if (l) {
        a.splice(s, 1);
        try {
          D("Deleting trigger", {
            sceneId: i.id,
            index: s,
            triggerId: (l == null ? void 0 : l.id) ?? null
          }), await af(i, a), await ms(t, e, i);
        } catch (h) {
          console.error(`${L} | Failed to delete time trigger`, h), (d = (c = ui.notifications) == null ? void 0 : c.error) == null || d.call(
            c,
            C(
              "EIDOLON.TimeTrigger.TriggerDeleteError",
              "Failed to remove the selected time trigger."
            )
          );
        }
      }
    });
  }), e.querySelectorAll('[data-action="fire-trigger"]').forEach((o) => {
    o.addEventListener("click", async () => {
      var c, d, h, f, m, g, y;
      const s = Number(o.dataset.index);
      if (!Number.isInteger(s)) return;
      const l = nr(i)[s];
      if (l) {
        if (!((c = game.user) != null && c.isGM)) {
          (h = (d = ui.notifications) == null ? void 0 : d.warn) == null || h.call(
            d,
            C("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time.")
          );
          return;
        }
        try {
          D("Manually firing trigger", { sceneId: i.id, triggerId: l.id, index: s }), await lf(i, l), (m = (f = ui.notifications) == null ? void 0 : f.info) == null || m.call(
            f,
            C(
              "EIDOLON.TimeTrigger.TriggerNowSuccess",
              "Triggered the selected time trigger."
            )
          );
        } catch (b) {
          console.error(`${L} | Failed to execute time trigger manually`, b), (y = (g = ui.notifications) == null ? void 0 : g.error) == null || y.call(
            g,
            C(
              "EIDOLON.TimeTrigger.TriggerNowError",
              "Failed to execute the selected time trigger."
            )
          ), D("Manual trigger execution failed", {
            sceneId: i.id,
            triggerId: l.id,
            index: s,
            message: (b == null ? void 0 : b.message) ?? String(b)
          });
        }
      }
    });
  });
}
u(jg, "bindTimeTriggerTabEvents");
function qu(t, e = {}) {
  var s;
  const n = e.scene ?? null, i = n && Qe(n) ? n : rn(t);
  if (!Qe(i)) {
    console.warn(`${L} | Unable to open trigger form because no scene document is available.`);
    return;
  }
  D("Opening trigger form", {
    sceneId: i.id,
    triggerId: ((s = e.trigger) == null ? void 0 : s.id) ?? null,
    index: Number.isInteger(e.triggerIndex) ? Number(e.triggerIndex) : null
  }), Dg({
    scene: i,
    trigger: e.trigger ?? null,
    triggerIndex: e.triggerIndex ?? null,
    onSave: /* @__PURE__ */ u(() => {
      var l, c;
      const a = (c = (l = t.element) == null ? void 0 : l[0]) == null ? void 0 : c.querySelector('.tab[data-tab="time-triggers"]');
      a && ms(t, a, i);
    }, "onSave")
  }).render({ force: !0 });
}
u(qu, "openTriggerForm");
function Bg(t, e) {
  var o, s, a, l, c;
  if (!t) return !1;
  const n = ((s = (o = foundry == null ? void 0 : foundry.applications) == null ? void 0 : o.sheets) == null ? void 0 : s.SceneConfig) ?? (globalThis == null ? void 0 : globalThis.SceneConfig);
  if (n && t instanceof n) return !0;
  const i = (a = t == null ? void 0 : t.constructor) == null ? void 0 : a.name;
  if (typeof i == "string" && i.includes("SceneConfig")) return !0;
  if (e) {
    const d = globalThis == null ? void 0 : globalThis.Scene;
    if (d && e instanceof d || (e == null ? void 0 : e.documentName) === "Scene" || (e == null ? void 0 : e.documentName) === "scenes" || (e == null ? void 0 : e.collection) === "scenes") return !0;
  }
  const r = ((l = t == null ? void 0 : t.options) == null ? void 0 : l.baseApplication) ?? ((c = t == null ? void 0 : t.options) == null ? void 0 : c.id);
  return !!(typeof r == "string" && r.includes("SceneConfig"));
}
u(Bg, "isRecognizedSceneConfig");
const $o = new Dl(), ju = new Pl();
function Ug() {
  D("Registering time trigger hooks"), Hooks.once("init", () => {
    hg(), vg(), D("Time trigger settings registered during init");
  }), Hg(), D("Scene config hook registered"), ju.registerHooks(), D("Time automation hooks registered"), Hooks.once("ready", () => {
    wg(), D("Ready hook fired"), $o.onReady(), ju.initialize();
  }), Hooks.on("canvasReady", (t) => {
    var e;
    D("canvasReady hook received", { scene: ((e = t == null ? void 0 : t.scene) == null ? void 0 : e.id) ?? null }), $o.onCanvasReady(t);
  }), Hooks.on("updateScene", (t) => {
    D("updateScene hook received", { scene: (t == null ? void 0 : t.id) ?? null }), $o.onUpdateScene(t);
  }), Hooks.on("updateWorldTime", (t, e) => {
    D("updateWorldTime hook received", { worldTime: t, diff: e }), $o.onUpdateWorldTime(t, e);
  });
}
u(Ug, "registerTimeTriggerHooks");
Ug();
const Ce = L, _f = "criteria", gs = "state", Vg = "criteriaVersion", Gg = 1, Nf = "enableCriteriaSurfaces";
let Bu = !1;
function Wg() {
  var t;
  if (!Bu) {
    if (Bu = !0, !((t = game == null ? void 0 : game.settings) != null && t.register)) {
      console.warn(`${Ce} | game.settings.register unavailable; scene criteria setting skipped.`);
      return;
    }
    game.settings.register(Ce, Nf, {
      name: C("EIDOLON.SceneCriteria.EnableSurfacesSettingName", "Enable Criteria Editor Surfaces"),
      hint: C(
        "EIDOLON.SceneCriteria.EnableSurfacesSettingHint",
        "Show criteria authoring surfaces (Scene > Criteria tab and tile/light editor controls). The Criteria Switcher remains available."
      ),
      scope: "world",
      config: !0,
      type: Boolean,
      default: !0,
      onChange: /* @__PURE__ */ u(() => {
        zg();
      }, "onChange")
    });
  }
}
u(Wg, "registerSceneCriteriaSettings");
function wa() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return !!game.settings.get(Ce, Nf);
  } catch (e) {
    console.error(`${Ce} | Failed to read criteria surfaces setting`, e);
  }
  return !0;
}
u(wa, "getCriteriaSurfacesEnabled");
function zg() {
  var o, s, a, l, c;
  const t = C("EIDOLON.SceneCriteria.ReloadPromptTitle", "Reload Required"), e = `<p>${C(
    "EIDOLON.SceneCriteria.ReloadPromptBody",
    "Changes to criteria editor surfaces require a reload. Reload now?"
  )}</p>`, n = typeof ((o = foundry == null ? void 0 : foundry.utils) == null ? void 0 : o.debouncedReload) == "function", i = /* @__PURE__ */ u(() => {
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
      yes: /* @__PURE__ */ u(() => i(), "yes"),
      no: /* @__PURE__ */ u(() => {
      }, "no")
    });
    return;
  }
  (c = (l = ui.notifications) == null ? void 0 : l.info) == null || c.call(
    l,
    C(
      "EIDOLON.SceneCriteria.ReloadNotice",
      "Please reload the world to apply criteria editor surface changes."
    )
  );
}
u(zg, "promptReloadForCriteriaSurfaces");
const ps = "Standard";
function St(t) {
  var n;
  const e = (n = t == null ? void 0 : t.getFlag) == null ? void 0 : n.call(t, Ce, _f);
  return e ? $f(e) : [];
}
u(St, "getSceneCriteria");
async function Ea(t, e, n = {}) {
  var o;
  if (!(t != null && t.update)) return;
  const i = $f(e), r = Ca(
    Vt(((o = t == null ? void 0 : t.getFlag) == null ? void 0 : o.call(t, Ce, gs)) ?? {}),
    i
  );
  await t.update({
    [`flags.${Ce}.${_f}`]: i,
    [`flags.${Ce}.${Vg}`]: Gg,
    [`flags.${Ce}.${gs}`]: r
  }, n);
}
u(Ea, "setSceneCriteria");
function Sa(t, e = null) {
  var r;
  const n = Array.isArray(e) ? e : St(t), i = Vt(((r = t == null ? void 0 : t.getFlag) == null ? void 0 : r.call(t, Ce, gs)) ?? {});
  return Ca(i, n);
}
u(Sa, "getSceneCriteriaState");
async function Yg(t, e, n = null) {
  if (!(t != null && t.setFlag)) return;
  const i = Array.isArray(n) ? n : St(t), r = Ca(e, i);
  await t.setFlag(Ce, gs, r);
}
u(Yg, "setSceneCriteriaState");
function Xc(t = "") {
  const e = typeof t == "string" ? t.trim() : "", n = Ff(zl(e || "criterion"), /* @__PURE__ */ new Set());
  return {
    id: Df(),
    key: n,
    label: e,
    values: [ps],
    default: ps,
    order: 0
  };
}
u(Xc, "createSceneCriterion");
function $f(t) {
  const e = Array.isArray(t) ? Vt(t) : [], n = [], i = /* @__PURE__ */ new Set();
  return e.forEach((r, o) => {
    const s = Wl(r, o, i);
    s && (n.push(s), i.add(s.key));
  }), n;
}
u($f, "sanitizeCriteria$1");
function Wl(t, e = 0, n = /* @__PURE__ */ new Set()) {
  if (!t || typeof t != "object") return null;
  const i = typeof t.id == "string" && t.id.trim() ? t.id.trim() : Df(), o = (typeof t.label == "string" ? t.label : typeof t.name == "string" ? t.name : "").trim(), s = typeof t.key == "string" && t.key.trim() ? zl(t.key) : zl(o || `criterion-${Number(e) + 1}`), a = Ff(s, n), l = Xg(t.values);
  let c = typeof t.default == "string" ? t.default.trim() : "";
  c || (c = l[0] ?? ps), l.includes(c) || l.unshift(c);
  const d = Number.isFinite(t.order) ? Number(t.order) : Number(e);
  return {
    id: i,
    key: a,
    label: o,
    values: l,
    default: c,
    order: d
  };
}
u(Wl, "sanitizeCriterion");
function Ca(t, e = []) {
  const n = t && typeof t == "object" ? Vt(t) : {}, i = {};
  for (const r of e) {
    const o = n == null ? void 0 : n[r.key], s = typeof o == "string" ? o.trim() : "";
    s && r.values.includes(s) ? i[r.key] = s : i[r.key] = r.default;
  }
  return i;
}
u(Ca, "sanitizeSceneCriteriaState");
function Kg(t) {
  return St(t).map((n) => ({
    id: n.key,
    key: n.key,
    name: n.label,
    values: [...n.values]
  }));
}
u(Kg, "getSceneCriteriaCategories");
function Xg(t) {
  const e = Array.isArray(t) ? t : [], n = [];
  for (const i of e) {
    if (typeof i != "string") continue;
    const r = i.trim();
    !r || n.includes(r) || n.push(r);
  }
  return n.length || n.push(ps), n;
}
u(Xg, "sanitizeCriterionValues");
function zl(t) {
  return String(t ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
u(zl, "slugifyCriterionKey");
function Ff(t, e) {
  if (!e.has(t)) return t;
  let n = 2;
  for (; e.has(`${t}-${n}`); )
    n += 1;
  return `${t}-${n}`;
}
u(Ff, "ensureUniqueCriterionKey");
function Df() {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 11);
}
u(Df, "generateCriterionId");
function Pf(t) {
  var e, n;
  console.error(`${Ce} | Failed to persist scene criteria`, t), (n = (e = ui.notifications) == null ? void 0 : e.error) == null || n.call(
    e,
    C(
      "EIDOLON.SceneCriteria.PersistError",
      "Failed to persist the scene criteria."
    )
  );
}
u(Pf, "notifyPersistError");
var Wd, be, yn, He, Rf, ca, ua, da, fa, Ko, ha, lo, co, Mr, Hf;
const hn = class hn extends sn(on) {
  constructor(n = {}) {
    const { scene: i, criterion: r, isNew: o, onSave: s, ...a } = n ?? {};
    super(a);
    _(this, He);
    _(this, be, null);
    _(this, yn, !1);
    _(this, ca, /* @__PURE__ */ u(async (n) => {
      n.preventDefault();
      const i = n.currentTarget;
      if (!(i instanceof HTMLFormElement)) return;
      const r = new FormData(i), o = String(r.get("criterionLabel") ?? "").trim(), s = String(r.get("criterionKey") ?? "").trim(), a = Array.from(i.querySelectorAll('[name="criterionValues"]')).map((h) => h instanceof HTMLInputElement ? h.value.trim() : "").filter((h, f, m) => h && m.indexOf(h) === f), c = String(r.get("criterionDefault") ?? "").trim() || a[0] || "Standard", d = Wl(
        {
          id: p(this, be).id,
          key: s,
          label: o,
          values: a,
          default: c,
          order: Number(p(this, be).order ?? 0)
        },
        0,
        /* @__PURE__ */ new Set()
      );
      d && (O(this, be, d), await T(this, He, Hf).call(this), this.close());
    }, "#onSubmit"));
    _(this, ua, /* @__PURE__ */ u((n) => {
      var s;
      if (p(this, yn)) return;
      const i = n.currentTarget, r = (i == null ? void 0 : i.form) ?? ((s = this.element) == null ? void 0 : s.querySelector("form"));
      if (!(r instanceof HTMLFormElement)) return;
      const o = r.querySelector('input[name="criterionKey"]');
      o instanceof HTMLInputElement && (o.value = Lr(i.value));
    }, "#onLabelInput"));
    _(this, da, /* @__PURE__ */ u((n) => {
      var l;
      const i = n.currentTarget, r = (i == null ? void 0 : i.form) ?? ((l = this.element) == null ? void 0 : l.querySelector("form"));
      if (!(r instanceof HTMLFormElement) || !(i instanceof HTMLInputElement)) return;
      const o = r.querySelector('input[name="criterionLabel"]'), s = Lr(o instanceof HTMLInputElement ? o.value : ""), a = Lr(i.value);
      O(this, yn, a !== s), i.value = a, T(this, He, Ko).call(this, r);
    }, "#onKeyInput"));
    _(this, fa, /* @__PURE__ */ u((n) => {
      var s, a;
      n.preventDefault();
      const i = ((s = n.currentTarget) == null ? void 0 : s.form) ?? ((a = this.element) == null ? void 0 : a.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector('input[name="criterionLabel"]'), o = i.querySelector('input[name="criterionKey"]');
      o instanceof HTMLInputElement && (o.value = Lr(r instanceof HTMLInputElement ? r.value : ""), O(this, yn, !1), T(this, He, Ko).call(this, i));
    }, "#onResetAutoKey"));
    _(this, ha, /* @__PURE__ */ u((n) => {
      var l, c, d, h, f, m;
      n.preventDefault();
      const i = ((l = n.currentTarget) == null ? void 0 : l.form) ?? ((c = this.element) == null ? void 0 : c.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector(".scene-criterion-editor__values");
      if (!(r instanceof HTMLElement)) return;
      (d = r.querySelector(".scene-criterion-editor__empty")) == null || d.remove();
      const o = document.createElement("div");
      o.classList.add("scene-criterion-editor__value");
      const s = jt(C("EIDOLON.SceneCriteria.ValuePlaceholder", "Allowed value")), a = jt(C("EIDOLON.SceneCriteria.RemoveValue", "Remove Value"));
      o.innerHTML = `
      <input type="text" name="criterionValues" value="" placeholder="${s}" class="form-control">
      <button type="button" class="icon" data-action="remove-value" aria-label="${a}" title="${a}">
        <i class="fa-solid fa-trash"></i>
      </button>
    `, r.appendChild(o), (h = o.querySelector('[data-action="remove-value"]')) == null || h.addEventListener("click", p(this, lo)), (f = o.querySelector('input[name="criterionValues"]')) == null || f.addEventListener("input", p(this, co)), T(this, He, Mr).call(this, i), (m = o.querySelector('input[name="criterionValues"]')) == null || m.focus();
    }, "#onAddValue"));
    _(this, lo, /* @__PURE__ */ u((n) => {
      var o, s, a, l;
      n.preventDefault(), (s = (o = n.currentTarget) == null ? void 0 : o.closest(".scene-criterion-editor__value")) == null || s.remove();
      const i = ((a = n.currentTarget) == null ? void 0 : a.form) ?? ((l = this.element) == null ? void 0 : l.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector(".scene-criterion-editor__values");
      if (r instanceof HTMLElement) {
        if (!r.querySelector(".scene-criterion-editor__value")) {
          const c = document.createElement("p");
          c.classList.add("notes", "scene-criterion-editor__empty"), c.textContent = C(
            "EIDOLON.SceneCriteria.ValueListEmpty",
            "No values have been added to this criterion."
          ), r.appendChild(c);
        }
        T(this, He, Mr).call(this, i);
      }
    }, "#onRemoveValue"));
    _(this, co, /* @__PURE__ */ u((n) => {
      var r, o;
      const i = ((r = n.currentTarget) == null ? void 0 : r.form) ?? ((o = this.element) == null ? void 0 : o.querySelector("form"));
      i instanceof HTMLFormElement && T(this, He, Mr).call(this, i);
    }, "#onValuesChanged"));
    this.scene = i ?? null, this.criterion = r ?? null, this.onSave = typeof s == "function" ? s : null, this.isNew = !!o, O(this, be, T(this, He, Rf).call(this)), O(this, yn, p(this, be).key !== Lr(p(this, be).label));
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
        var c;
        return {
          index: l,
          value: a,
          selected: a === ((c = p(this, be)) == null ? void 0 : c.default)
        };
      }),
      hasValues: n.length > 0,
      labels: {
        label: C("EIDOLON.SceneCriteria.CategoryNameLabel", "Criterion Label"),
        key: C("EIDOLON.SceneCriteria.CriteriaKey", "Key"),
        values: C("EIDOLON.SceneCriteria.ValuesLabel", "Allowed Values"),
        default: C("EIDOLON.SceneCriteria.DefaultValue", "Default Value"),
        empty: C(
          "EIDOLON.SceneCriteria.ValueListEmpty",
          "No values have been added to this criterion."
        ),
        addValue: C("EIDOLON.SceneCriteria.AddValue", "Add Value"),
        removeValue: C("EIDOLON.SceneCriteria.RemoveValue", "Remove Value"),
        valuePlaceholder: C("EIDOLON.SceneCriteria.ValuePlaceholder", "Allowed value"),
        resetAutoKey: C("EIDOLON.SceneCriteria.ResetAutoKey", "Reset to Auto"),
        save: this.isNew ? C("EIDOLON.SceneCriteria.CreateCategory", "Add Criterion") : C("EIDOLON.SceneCriteria.SaveCategory", "Save Criterion"),
        cancel: C("EIDOLON.SceneCriteria.CancelEdit", "Cancel")
      },
      keyIsCustom: p(this, yn)
    };
  }
  _onRender(n, i) {
    var o, s, a, l, c, d;
    super._onRender(n, i);
    const r = (o = this.element) == null ? void 0 : o.querySelector("form");
    r && (r.addEventListener("submit", p(this, ca)), (s = r.querySelector('[data-action="add-value"]')) == null || s.addEventListener("click", p(this, ha)), (a = r.querySelector('input[name="criterionLabel"]')) == null || a.addEventListener("input", p(this, ua)), (l = r.querySelector('input[name="criterionKey"]')) == null || l.addEventListener("input", p(this, da)), (c = r.querySelector('[data-action="reset-auto-key"]')) == null || c.addEventListener("click", p(this, fa)), r.querySelectorAll('[data-action="remove-value"]').forEach((h) => {
      h.addEventListener("click", p(this, lo));
    }), r.querySelectorAll('input[name="criterionValues"]').forEach((h) => {
      h.addEventListener("input", p(this, co));
    }), (d = r.querySelector('[data-action="cancel"]')) == null || d.addEventListener("click", (h) => {
      h.preventDefault(), this.close();
    }), T(this, He, Ko).call(this, r), T(this, He, Mr).call(this, r));
  }
};
be = new WeakMap(), yn = new WeakMap(), He = new WeakSet(), Rf = /* @__PURE__ */ u(function() {
  const n = Wl(this.criterion, 0, /* @__PURE__ */ new Set()) ?? Xc(C("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion"));
  return {
    id: n.id,
    key: n.key,
    label: n.label ?? "",
    values: Array.isArray(n.values) ? [...n.values] : [],
    default: n.default
  };
}, "#initializeState"), ca = new WeakMap(), ua = new WeakMap(), da = new WeakMap(), fa = new WeakMap(), Ko = /* @__PURE__ */ u(function(n) {
  const i = n.querySelector('[data-action="reset-auto-key"]');
  i instanceof HTMLButtonElement && (i.disabled = !p(this, yn));
}, "#syncAutoKeyButton"), ha = new WeakMap(), lo = new WeakMap(), co = new WeakMap(), Mr = /* @__PURE__ */ u(function(n) {
  var l, c;
  const i = n.querySelector('select[name="criterionDefault"]');
  if (!(i instanceof HTMLSelectElement)) return;
  const r = ((c = (l = i.value) == null ? void 0 : l.trim) == null ? void 0 : c.call(l)) ?? "", o = Array.from(n.querySelectorAll('input[name="criterionValues"]')).map((d) => d instanceof HTMLInputElement ? d.value.trim() : "").filter((d, h, f) => d && f.indexOf(d) === h), s = i.dataset.emptyLabel || C("EIDOLON.SceneCriteria.ValueListEmpty", "No values have been added to this criterion.");
  if (i.innerHTML = "", !o.length) {
    const d = document.createElement("option");
    d.value = "", d.textContent = s, d.selected = !0, i.appendChild(d);
    return;
  }
  const a = o.includes(r) ? r : o[0];
  for (const d of o) {
    const h = document.createElement("option");
    h.value = d, h.textContent = d, h.selected = d === a, i.appendChild(h);
  }
}, "#syncDefaultOptions"), Hf = /* @__PURE__ */ u(async function() {
  if (!this.scene) return;
  const n = St(this.scene).sort((r, o) => r.order - o.order), i = n.findIndex((r) => r.id === p(this, be).id);
  i < 0 ? (p(this, be).order = n.length, n.push(p(this, be))) : (p(this, be).order = n[i].order, n.splice(i, 1, p(this, be)));
  try {
    await Ea(this.scene, n), this.onSave && await this.onSave(p(this, be));
  } catch (r) {
    Pf(r);
  }
}, "#persist"), u(hn, "CategoryEditorApplication"), le(hn, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Le(hn, hn, "DEFAULT_OPTIONS"),
  {
    id: `${Ce}-criterion-editor`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Wd = Le(hn, hn, "DEFAULT_OPTIONS")) == null ? void 0 : Wd.classes) ?? [], "standard-form", "themed"])
    ),
    window: {
      title: C("EIDOLON.SceneCriteria.EditCategory", "Edit Criterion"),
      resizable: !1
    },
    position: {
      width: 460,
      height: "auto"
    }
  },
  { inplace: !1 }
)), le(hn, "PARTS", {
  content: {
    template: `modules/${Ce}/templates/scene-criteria-editor.html`
  }
});
let Yl = hn;
function Lr(t) {
  return String(t ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
u(Lr, "slugifyKey");
const Jg = `modules/${Ce}/templates/scene-criteria-tab.html`, Kl = {
  log: /* @__PURE__ */ u((...t) => {
    var e;
    return (e = console.debug) == null ? void 0 : e.call(console, `${Ce} | Criteria`, ...t);
  }, "log"),
  group: /* @__PURE__ */ u((...t) => {
    var e;
    return (e = console.groupCollapsed) == null ? void 0 : e.call(console, `${Ce} | Criteria`, ...t);
  }, "group"),
  groupEnd: /* @__PURE__ */ u(() => {
    var t;
    return (t = console.groupEnd) == null ? void 0 : t.call(console);
  }, "groupEnd")
}, Qg = va(Yl), Zg = Mf({
  tabId: "criteria",
  tabLabel: /* @__PURE__ */ u(() => C("EIDOLON.SceneCriteria.TabLabel", "Criteria"), "tabLabel"),
  getScene: rn,
  isApplicable: /* @__PURE__ */ u(() => wa(), "isApplicable"),
  renderContent: /* @__PURE__ */ u(({ app: t, tab: e, scene: n }) => tp(t, e, n), "renderContent"),
  logger: Kl
});
function ep() {
  return Zg.register();
}
u(ep, "registerSceneCriteriaConfigHook");
function tp(t, e, n) {
  if (!(e instanceof HTMLElement)) return;
  const i = Qe(n) ? n : rn(t);
  Gi(t, e, i);
}
u(tp, "renderCriteriaTab");
async function Gi(t, e, n) {
  var r, o;
  const i = n ?? rn(t);
  Kl.group("renderCriteriaTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!Qe(i)) {
      const d = C(
        "EIDOLON.SceneCriteria.Unavailable",
        "Scene criteria are unavailable for this configuration sheet."
      );
      e.innerHTML = `<p class="notes">${d}</p>`;
      return;
    }
    const s = St(i).sort((d, h) => d.order - h.order), a = Sa(i, s), l = ((o = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : o.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof l != "function") {
      e.innerHTML = `<p class="notes">${C("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
      return;
    }
    const c = await l(Jg, {
      description: C(
        "EIDOLON.SceneCriteria.Description",
        "Define scene criteria dimensions and allowed values used by matching rules."
      ),
      labels: {
        list: C("EIDOLON.SceneCriteria.CategoryListLabel", "Scene Criteria"),
        empty: C(
          "EIDOLON.SceneCriteria.CategoryListEmpty",
          "No criteria configured for this scene."
        ),
        add: C("EIDOLON.SceneCriteria.AddCategory", "Add Criterion"),
        edit: C("EIDOLON.SceneCriteria.EditCategory", "Edit Criterion"),
        remove: C("EIDOLON.SceneCriteria.RemoveCategory", "Remove Criterion"),
        moveUp: C("EIDOLON.SceneCriteria.MoveUp", "Move Up"),
        moveDown: C("EIDOLON.SceneCriteria.MoveDown", "Move Down"),
        values: C("EIDOLON.SceneCriteria.ValuesLabel", "Allowed Values"),
        unnamed: C("EIDOLON.SceneCriteria.UnnamedCategory", "Unnamed Criterion")
      },
      summary: {
        criteriaCount: s.length,
        valueCount: s.reduce((d, h) => d + h.values.length, 0)
      },
      criteria: s.map((d, h) => {
        var f, m;
        return {
          id: d.id,
          label: d.label,
          displayName: ((m = (f = d.label) == null ? void 0 : f.trim) == null ? void 0 : m.call(f)) || C("EIDOLON.SceneCriteria.UnnamedCategory", "Unnamed Criterion"),
          hasValues: d.values.length > 0,
          values: d.values.map((g) => ({
            value: g,
            isCurrent: (a[d.key] ?? d.default) === g
          })),
          valueCountLabel: ip(d.values.length),
          canMoveUp: h > 0,
          canMoveDown: h < s.length - 1
        };
      }),
      hasCriteria: s.length > 0
    });
    e.innerHTML = c, np(t, e, i);
  } catch (s) {
    console.error(`${Ce} | Failed to render criteria tab`, s), e.innerHTML = `<p class="notes">${C("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
  } finally {
    Kl.groupEnd();
  }
}
u(Gi, "renderCriteriaTabContent");
function np(t, e, n) {
  const i = n ?? rn(t);
  if (!Qe(i)) return;
  const r = e.querySelector('[data-criteria-action="add"]');
  r && r.addEventListener("click", () => {
    Uu(t, {
      scene: i,
      criterion: Xc(
        C("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion")
      ),
      isNew: !0,
      onSave: /* @__PURE__ */ u(() => Gi(t, e, i), "onSave")
    });
  }), e.querySelectorAll('[data-criteria-action="edit"]').forEach((o) => {
    const s = o.dataset.criterionId;
    s && o.addEventListener("click", () => {
      const a = St(i).find((l) => l.id === s);
      a && Uu(t, {
        scene: i,
        criterion: a,
        onSave: /* @__PURE__ */ u(() => Gi(t, e, i), "onSave")
      });
    });
  }), e.querySelectorAll('[data-criteria-action="remove"]').forEach((o) => {
    const s = o.dataset.criterionId;
    s && o.addEventListener("click", async () => {
      await za(i, (l) => {
        const c = l.findIndex((d) => d.id === s);
        return c < 0 ? !1 : (l.splice(c, 1), Ya(l), !0);
      }) && await Gi(t, e, i);
    });
  }), e.querySelectorAll('[data-criteria-action="move-up"]').forEach((o) => {
    const s = o.dataset.criterionId;
    s && o.addEventListener("click", async () => {
      await za(i, (l) => {
        const c = l.findIndex((h) => h.id === s);
        if (c <= 0) return !1;
        const [d] = l.splice(c, 1);
        return l.splice(c - 1, 0, d), Ya(l), !0;
      }) && await Gi(t, e, i);
    });
  }), e.querySelectorAll('[data-criteria-action="move-down"]').forEach((o) => {
    const s = o.dataset.criterionId;
    s && o.addEventListener("click", async () => {
      await za(i, (l) => {
        const c = l.findIndex((h) => h.id === s);
        if (c < 0 || c >= l.length - 1) return !1;
        const [d] = l.splice(c, 1);
        return l.splice(c + 1, 0, d), Ya(l), !0;
      }) && await Gi(t, e, i);
    });
  });
}
u(np, "bindCriteriaTabEvents");
async function za(t, e) {
  const n = St(t).sort((r, o) => r.order - o.order);
  if (e(n) === !1) return !1;
  try {
    return await Ea(t, n, { render: !1 }), !0;
  } catch (r) {
    return Pf(r), !1;
  }
}
u(za, "mutateCriteria");
function Uu(t, e = {}) {
  const n = e.scene ?? null, i = n && Qe(n) ? n : rn(t);
  if (!Qe(i))
    return;
  Qg({
    scene: i,
    criterion: e.criterion ?? null,
    isNew: !!e.isNew,
    onSave: typeof e.onSave == "function" ? e.onSave : null
  }).render({ force: !0 });
}
u(Uu, "openCriterionEditor");
function Ya(t) {
  t.forEach((e, n) => {
    e.order = n;
  });
}
u(Ya, "reindexCriteriaOrder");
function ip(t) {
  var e, n;
  if ((n = (e = game.i18n) == null ? void 0 : e.has) != null && n.call(e, "EIDOLON.SceneCriteria.ValueCountLabel"))
    try {
      return game.i18n.format("EIDOLON.SceneCriteria.ValueCountLabel", { count: t });
    } catch (i) {
      console.error(`${Ce} | Failed to format value count label`, i);
    }
  return t === 0 ? "No values configured" : t === 1 ? "1 value" : `${t} values`;
}
u(ip, "formatValueCount");
let Vu = !1;
function rp() {
  Hooks.once("init", () => {
    Wg();
  }), Hooks.once("ready", () => {
    wa() && (Vu || (ep(), Vu = !0));
  });
}
u(rp, "registerSceneCriteriaHooks");
rp();
const ne = L, qf = "criteriaEngineVersion", xi = "fileIndex", _i = "tileCriteria", Jc = {
  LEGACY: 1,
  CRITERIA: 2
}, jf = Jc.CRITERIA;
function Bf(t) {
  var e;
  return ((e = t == null ? void 0 : t.getFlag) == null ? void 0 : e.call(t, ne, qf)) ?? Jc.LEGACY;
}
u(Bf, "getSceneEngineVersion");
function op(t, e, n, i, r) {
  if (!(t != null && t.length) || !(n != null && n.length)) return -1;
  const o = {};
  for (const a of n)
    o[a] = e[a];
  const s = Gu(t, o, n);
  if (s >= 0) return s;
  if (i != null && i.length && r) {
    const a = { ...o };
    for (const l of i) {
      if (!(l in a)) continue;
      a[l] = r[l] ?? "Standard";
      const c = Gu(t, a, n);
      if (c >= 0) return c;
    }
  }
  return -1;
}
u(op, "findBestMatch");
function Gu(t, e, n) {
  return t.findIndex((i) => {
    for (const r of n)
      if (i[r] !== e[r]) return !1;
    return !0;
  });
}
u(Gu, "findExactMatch");
function sp(t, e) {
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
u(sp, "findFileIndex");
function Xo(t) {
  return t && typeof t == "object" && !Array.isArray(t);
}
u(Xo, "isPlainObject$2");
function Wu(t) {
  return t == null ? t : typeof structuredClone == "function" ? structuredClone(t) : JSON.parse(JSON.stringify(t));
}
u(Wu, "deepClone");
function ap(t, e) {
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
u(ap, "deletePath");
function Uf(t, e) {
  const n = Wu(t ?? {});
  if (!Xo(e)) return n;
  for (const [i, r] of Object.entries(e)) {
    if (i.startsWith("-=") && r === !0) {
      ap(n, i.slice(2));
      continue;
    }
    Xo(r) && Xo(n[i]) ? n[i] = Uf(n[i], r) : n[i] = Wu(r);
  }
  return n;
}
u(Uf, "fallbackMerge");
function lp(t, e) {
  var n, i;
  return (n = foundry == null ? void 0 : foundry.utils) != null && n.mergeObject && ((i = foundry == null ? void 0 : foundry.utils) != null && i.deepClone) ? foundry.utils.mergeObject(t, foundry.utils.deepClone(e), {
    inplace: !1
  }) : Uf(t, e);
}
u(lp, "defaultMerge");
function cp(t, e) {
  if (!t) return !0;
  for (const n of Object.keys(t))
    if (t[n] !== e[n]) return !1;
  return !0;
}
u(cp, "criteriaMatch");
function Vf(t, e, n, i) {
  const r = i ?? lp;
  let o = r({}, t ?? {});
  if (!(e != null && e.length)) return o;
  const s = [];
  for (let a = 0; a < e.length; a += 1) {
    const l = e[a];
    if (cp(l == null ? void 0 : l.criteria, n)) {
      const c = l != null && l.criteria ? Object.keys(l.criteria).length : 0;
      s.push({ specificity: c, index: a, delta: l == null ? void 0 : l.delta });
    }
  }
  s.sort((a, l) => a.specificity - l.specificity || a.index - l.index);
  for (const a of s)
    a.delta && (o = r(o, a.delta));
  return o;
}
u(Vf, "resolveRules");
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
u(Ta, "canManageCriteria");
function up(t = null) {
  if (!Ta(t))
    throw new Error(`${ne} | You do not have permission to manage scene criteria.`);
}
u(up, "requireCriteriaAccess");
const zu = 200;
function Gf(t) {
  return t ? Number.isInteger(t.size) ? t.size : Array.isArray(t) || typeof t.length == "number" ? t.length : Array.from(t).length : 0;
}
u(Gf, "getCollectionSize");
function Rt() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
u(Rt, "nowMs");
function Wf(t) {
  if (!Array.isArray(t)) return [];
  const e = /* @__PURE__ */ new Set();
  for (const n of t) {
    if (typeof n != "string") continue;
    const i = n.trim();
    i && e.add(i);
  }
  return Array.from(e);
}
u(Wf, "uniqueStringKeys");
function dp(t, e = zu) {
  if (!Array.isArray(t) || t.length === 0) return [];
  const n = Number.isInteger(e) && e > 0 ? e : zu, i = [];
  for (let r = 0; r < t.length; r += n)
    i.push(t.slice(r, r + n));
  return i;
}
u(dp, "chunkArray");
function Ki(t) {
  return !!t && typeof t == "object" && !Array.isArray(t);
}
u(Ki, "isPlainObject$1");
function Xl(t, e) {
  if (Object.is(t, e)) return !0;
  if (Array.isArray(t) || Array.isArray(e)) {
    if (!Array.isArray(t) || !Array.isArray(e) || t.length !== e.length) return !1;
    for (let n = 0; n < t.length; n += 1)
      if (!Xl(t[n], e[n])) return !1;
    return !0;
  }
  if (Ki(t) || Ki(e)) {
    if (!Ki(t) || !Ki(e)) return !1;
    const n = Object.keys(e);
    for (const i of n)
      if (!Xl(t[i], e[i])) return !1;
    return !0;
  }
  return !1;
}
u(Xl, "areValuesEqual");
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
u(ys, "normalizeFilePath");
function zf(t) {
  return typeof (t == null ? void 0 : t.name) == "string" ? t.name : typeof (t == null ? void 0 : t.src) == "string" ? t.src : "";
}
u(zf, "getFilePath");
function Qc(t) {
  if (!Array.isArray(t)) return [];
  const e = /* @__PURE__ */ new Map();
  return t.map((n, i) => {
    const r = ys(zf(n)), o = r || `__index:${i}`, s = e.get(o) ?? 0;
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
u(Qc, "buildTileFileEntries");
function Zn(t, e) {
  if (!Number.isInteger(e) || e < 0) return null;
  const i = Qc(t).find((r) => r.index === e);
  return i ? { ...i.target } : { indexHint: e };
}
u(Zn, "createTileTargetFromIndex");
function La(t) {
  if (!t || typeof t != "object") return null;
  const e = ys(t.path), n = Number(t.indexHint ?? t.fileIndex), i = Number(t.occurrence), r = {};
  return e && (r.path = e, r.occurrence = Number.isInteger(i) && i >= 0 ? i : 0), Number.isInteger(n) && n >= 0 && (r.indexHint = n), !r.path && !Number.isInteger(r.indexHint) ? null : r;
}
u(La, "normalizeTileTarget");
function Xr(t, e) {
  const n = La(t);
  if (!n) return -1;
  const i = Qc(e);
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
u(Xr, "resolveTileTargetIndex");
function ei(t) {
  if (!t || typeof t != "object" || Array.isArray(t)) return {};
  const e = {};
  for (const [n, i] of Object.entries(t))
    typeof n != "string" || !n || typeof i != "string" || !i.trim() || (e[n] = i.trim());
  return e;
}
u(ei, "sanitizeCriteria");
function fp(t) {
  return Object.entries(ei(t)).sort(([n], [i]) => n.localeCompare(i)).map(([n, i]) => `${n}=${i}`).join("");
}
u(fp, "serializeCriteria");
function hp(t) {
  return Object.keys(ei(t)).length;
}
u(hp, "getCriteriaSpecificity");
function mp(t, e) {
  const n = ei(t), i = ei(e);
  for (const [r, o] of Object.entries(n))
    if (r in i && i[r] !== o)
      return !1;
  return !0;
}
u(mp, "areCriteriaCompatible");
function gp(t, e) {
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
u(gp, "getTargetIdentity");
function Yf(t, e = {}) {
  var a;
  const n = Array.isArray(e.files) ? e.files : [], i = Di(t, { files: n });
  if (!((a = i == null ? void 0 : i.variants) != null && a.length))
    return {
      errors: [],
      warnings: []
    };
  const r = i.variants.map((l, c) => ({
    index: c,
    criteria: ei(l.criteria),
    specificity: hp(l.criteria),
    criteriaSignature: fp(l.criteria),
    targetIdentity: gp(l.target, n)
  })), o = [], s = [];
  for (let l = 0; l < r.length; l += 1) {
    const c = r[l];
    for (let d = l + 1; d < r.length; d += 1) {
      const h = r[d];
      if (c.specificity !== h.specificity || !mp(c.criteria, h.criteria)) continue;
      if (!(!!c.targetIdentity && c.targetIdentity === h.targetIdentity)) {
        o.push({
          leftIndex: c.index,
          rightIndex: h.index,
          type: c.criteriaSignature === h.criteriaSignature ? "equivalent" : "overlap",
          specificity: c.specificity
        });
        continue;
      }
      c.criteriaSignature === h.criteriaSignature && s.push({
        leftIndex: c.index,
        rightIndex: h.index,
        type: "duplicate"
      });
    }
  }
  return {
    errors: o,
    warnings: s
  };
}
u(Yf, "detectTileCriteriaConflicts");
function pp(t, e) {
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
u(pp, "normalizeTileVariant");
function Kf(t, e = {}) {
  if (!Array.isArray(t) || t.length === 0) return null;
  const n = Array.isArray(e.files) ? e.files : null, i = t.map((l, c) => ({
    criteria: ei(l),
    target: Zn(n, c)
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
u(Kf, "buildTileCriteriaFromFileIndex");
function Di(t, e = {}) {
  const n = Array.isArray(e.files) ? e.files : null;
  if (Array.isArray(t))
    return Kf(t, { files: n });
  if (!t || typeof t != "object") return null;
  const i = Array.isArray(t.variants) ? t.variants.map((o) => pp(o, n)).filter(Boolean) : [];
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
u(Di, "normalizeTileCriteria");
let bs = /* @__PURE__ */ new WeakMap();
function yp(t, e) {
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
u(yp, "compileTileMatcher");
function bp(t, e, n) {
  const i = bs.get(t);
  if (i && i.tileCriteria === e && i.files === n)
    return i.compiled;
  const r = yp(e, n);
  return bs.set(t, {
    tileCriteria: e,
    files: n,
    compiled: r
  }), r;
}
u(bp, "getCompiledTileMatcher");
function vp(t, e) {
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
u(vp, "selectTileFileIndexFromCompiled");
function Yu(t = null) {
  t ? bs.delete(t) : bs = /* @__PURE__ */ new WeakMap();
}
u(Yu, "invalidateTileMatcherCache");
function wp({ extractKeys: t, label: e = "doc" }) {
  let n = /* @__PURE__ */ new WeakMap();
  function i(a, l) {
    const c = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Set();
    for (const h of l) {
      const f = t(h);
      if (f) {
        d.add(h.id);
        for (const m of f)
          c.has(m) || c.set(m, /* @__PURE__ */ new Set()), c.get(m).add(h.id);
      }
    }
    return { collection: l, keyToDocIds: c, allDocIds: d };
  }
  u(i, "build");
  function r(a, l) {
    const c = n.get(a);
    if ((c == null ? void 0 : c.collection) === l) return c;
    const d = i(a, l);
    return n.set(a, d), d;
  }
  u(r, "get");
  function o(a, l, c) {
    const d = Wf(c), h = r(a, l);
    if (!d.length)
      return typeof (l == null ? void 0 : l.get) == "function" ? Array.from(h.allDocIds).map((m) => l.get(m)).filter(Boolean) : Array.from(l ?? []).filter((m) => h.allDocIds.has(m.id));
    const f = /* @__PURE__ */ new Set();
    for (const m of d) {
      const g = h.keyToDocIds.get(m);
      if (g)
        for (const y of g) f.add(y);
    }
    return f.size ? typeof (l == null ? void 0 : l.get) == "function" ? Array.from(f).map((m) => l.get(m)).filter(Boolean) : Array.from(l ?? []).filter((m) => f.has(m.id)) : [];
  }
  u(o, "getAffectedDocs");
  function s(a = null) {
    a ? n.delete(a) : n = /* @__PURE__ */ new WeakMap();
  }
  return u(s, "invalidate"), { getAffectedDocs: o, invalidate: s };
}
u(wp, "createDependencyIndexManager");
async function Xf(t, e, n, i) {
  const r = dp(n, i);
  for (const o of r)
    await t.updateEmbeddedDocuments(e, o), r.length > 1 && await Promise.resolve();
  return r.length;
}
u(Xf, "updateDocumentsInChunks");
const Ep = /* @__PURE__ */ u((...t) => console.log(`${ne} | criteria tiles:`, ...t), "log$1"), Jf = wp({
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
function Sp(t = null, e = null) {
  Jf.invalidate(t ?? void 0), e ? Yu(e) : t || Yu(null);
}
u(Sp, "invalidateTileCriteriaCaches");
async function Qf(t, e, n = {}) {
  var l, c, d, h;
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
  r.total = Gf(o);
  const s = Jf.getAffectedDocs(e, o, n.changedKeys);
  if (r.scanned = s.length, !s.length)
    return r.skipped.unaffected = r.total, r.durationMs = Rt() - i, r;
  const a = [];
  for (const f of s) {
    const m = f.getFlag(ne, _i) ?? f.getFlag(ne, xi);
    if (!m) {
      r.skipped.noCriteria += 1;
      continue;
    }
    const g = f.getFlag("monks-active-tiles", "files");
    if (!(g != null && g.length)) {
      r.skipped.noFiles += 1;
      continue;
    }
    const y = bp(f, m, g), b = vp(y, t);
    if (!Number.isInteger(b) || b < 0 || b >= g.length) {
      console.warn(`${ne} | Tile ${f.id} has no valid file match for state`, t), r.skipped.noMatch += 1;
      continue;
    }
    const v = b, E = Number(f.getFlag("monks-active-tiles", "fileindex")) !== v, S = g.some((x, F) => !!(x != null && x.selected) != (F === b)), I = ys(((c = f.texture) == null ? void 0 : c.src) ?? ((h = (d = f._source) == null ? void 0 : d.texture) == null ? void 0 : h.src) ?? ""), k = zf(g[b]), M = ys(k), $ = !!M && M !== I;
    if (!S && !E && !$) {
      r.skipped.unchanged += 1;
      continue;
    }
    const N = {
      _id: f._id
    };
    S && (N["flags.monks-active-tiles.files"] = g.map((x, F) => ({
      ...x,
      selected: F === b
    }))), E && (N["flags.monks-active-tiles.fileindex"] = v), $ && (N.texture = { src: k }), a.push(N), Ep(`Tile ${f.id} -> ${k}`);
  }
  return a.length > 0 && (r.chunks = await Xf(e, "Tile", a, n.chunkSize), r.updated = a.length), r.durationMs = Rt() - i, r;
}
u(Qf, "updateTiles");
const Pr = L, Rr = "lightCriteria", Zc = Object.freeze({
  base: null,
  mappings: [],
  current: null
});
function Ka(t) {
  return t && typeof t == "object" && !Array.isArray(t);
}
u(Ka, "isPlainObject");
function Zf(t, e) {
  if (!Ka(e)) return {};
  const n = {};
  for (const [i, r] of Object.entries(e)) {
    const o = t == null ? void 0 : t[i];
    if (Ka(r) && Ka(o)) {
      const s = Zf(o, r);
      Object.keys(s).length > 0 && (n[i] = s);
    } else r !== o && (n[i] = Vt(r));
  }
  return n;
}
u(Zf, "computeDelta");
function eh(t) {
  var n;
  const e = ((n = t == null ? void 0 : t.getFlag) == null ? void 0 : n.call(t, Pr, Rr)) ?? Zc;
  return Jr(e);
}
u(eh, "getLightCriteriaState");
async function th(t, e) {
  const n = Jr(e);
  if (!(t != null && t.setFlag))
    return n;
  const i = n.base !== null, r = n.mappings.length > 0, o = n.current !== null;
  return !i && !r && !o ? (typeof t.unsetFlag == "function" ? await t.unsetFlag(Pr, Rr) : await t.setFlag(Pr, Rr, null), Zc) : (await t.setFlag(Pr, Rr, n), n);
}
u(th, "setLightCriteriaState");
async function Oo(t, e) {
  if (typeof e != "function")
    throw new TypeError("updateLightCriteriaState requires an updater function.");
  const n = Vt(eh(t)), i = await e(n);
  return th(t, i);
}
u(Oo, "updateLightCriteriaState");
async function Ku(t, e) {
  const n = Pi(e);
  if (!n)
    throw new Error("Invalid light configuration payload.");
  return Oo(t, (i) => ({
    ...i,
    base: n
  }));
}
u(Ku, "storeBaseLighting");
async function Xu(t, e, n, { label: i } = {}) {
  const r = ko(e);
  if (!r)
    throw new Error("Cannot create a mapping without at least one category selection.");
  const o = Pi(n);
  if (!o)
    throw new Error("Invalid light configuration payload.");
  return Oo(t, (s) => {
    const a = br(r), l = Array.isArray(s == null ? void 0 : s.mappings) ? [...s.mappings] : [], c = l.findIndex((m) => (m == null ? void 0 : m.key) === a), d = c >= 0 ? l[c] : null, h = typeof (d == null ? void 0 : d.id) == "string" && d.id.trim() ? d.id.trim() : ih(), f = Ia({
      id: h,
      categories: r,
      config: o,
      label: typeof i == "string" ? i : (d == null ? void 0 : d.label) ?? null,
      updatedAt: Date.now()
    });
    if (!f)
      throw new Error("Failed to sanitize criteria mapping entry.");
    return c >= 0 ? l[c] = f : l.push(f), {
      ...s,
      mappings: l
    };
  });
}
u(Xu, "upsertLightCriteriaMapping");
async function Cp(t, e, n, i, { replaceExisting: r = !1 } = {}) {
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
    const c = Array.isArray(l == null ? void 0 : l.mappings) ? [...l.mappings] : [], d = c.findIndex((v) => (v == null ? void 0 : v.id) === o);
    if (d < 0)
      throw new Error("The selected mapping no longer exists.");
    const h = br(s), f = c.findIndex(
      (v, w) => w !== d && (v == null ? void 0 : v.key) === h
    );
    if (f >= 0 && !r)
      throw new Error("A mapping already exists for the selected criteria.");
    const m = c[d], g = Ia({
      ...m,
      id: o,
      categories: s,
      config: a,
      updatedAt: Date.now()
    });
    if (!g)
      throw new Error("Failed to sanitize updated mapping.");
    c[d] = g;
    let y = null;
    if (f >= 0) {
      const [v] = c.splice(f, 1);
      y = (v == null ? void 0 : v.id) ?? null;
    }
    let b = (l == null ? void 0 : l.current) ?? null;
    return b && typeof b == "object" && (b.mappingId === o ? b = {
      ...b,
      mappingId: o,
      categories: s,
      updatedAt: Date.now()
    } : y && b.mappingId === y && (b = {
      ...b,
      mappingId: o,
      categories: s,
      updatedAt: Date.now()
    })), {
      ...l,
      mappings: c,
      current: b
    };
  });
}
u(Cp, "retargetLightCriteriaMapping");
async function Tp(t, e) {
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
u(Tp, "removeLightCriteriaMapping");
async function Hr(t, e) {
  const n = nh(e);
  return Oo(t, (i) => ({
    ...i,
    current: n
  }));
}
u(Hr, "storeCurrentCriteriaSelection");
function Lp(t) {
  const e = Jr(t), n = e.base ?? {}, i = [];
  for (const r of e.mappings) {
    const o = ko(r == null ? void 0 : r.categories);
    if (!o) continue;
    const s = Zf(n, (r == null ? void 0 : r.config) ?? {});
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
u(Lp, "convertLightCriteriaStateToPresets");
function Ip(t, e = []) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
  for (const l of e)
    typeof (l == null ? void 0 : l.key) == "string" && l.key.trim() && i.add(l.key.trim()), typeof (l == null ? void 0 : l.id) == "string" && l.id.trim() && typeof (l == null ? void 0 : l.key) == "string" && n.set(l.id.trim(), l.key.trim());
  const r = Jr(t), o = /* @__PURE__ */ u((l) => {
    const c = {};
    for (const [d, h] of Object.entries(l ?? {})) {
      const f = String(d ?? "").trim(), m = typeof h == "string" ? h.trim() : "";
      if (!f || !m) continue;
      if (i.has(f)) {
        c[f] = m;
        continue;
      }
      const g = n.get(f);
      g && (c[g] = m);
    }
    return Object.keys(c).length ? c : null;
  }, "remapCategories"), s = r.mappings.map((l) => {
    const c = o(l.categories);
    return c ? Ia({
      ...l,
      categories: c,
      key: br(c)
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
u(Ip, "migrateLightCriteriaCategoriesToKeys");
function Jr(t) {
  var l;
  const e = Vt(t);
  if (!e || typeof e != "object")
    return Vt(Zc);
  const n = Pi(e.base), i = Array.isArray(e.mappings) ? e.mappings : [], r = /* @__PURE__ */ new Map();
  for (const c of i) {
    const d = Ia(c);
    d && r.set(d.key, d);
  }
  const o = Array.from(r.values()), s = new Map(o.map((c) => [c.id, c]));
  let a = nh(e.current);
  if (a) {
    const c = a.categories && Object.keys(a.categories).length > 0;
    if (a.mappingId && !s.has(a.mappingId)) {
      const d = c ? ((l = o.find((h) => h.key === br(a.categories))) == null ? void 0 : l.id) ?? null : null;
      d ? a = {
        ...a,
        mappingId: d
      } : c && (a = {
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
u(Jr, "sanitizeLightCriteriaState");
function Pi(t) {
  const e = Vt(t);
  if (!e || typeof e != "object") return null;
  const n = /* @__PURE__ */ new Set(["config", "hidden", "vision"]);
  for (const i of Object.keys(e))
    n.has(i) || delete e[i];
  return e;
}
u(Pi, "sanitizeLightConfigPayload");
function Ia(t) {
  if (!t || typeof t != "object") return null;
  const e = ko(t.categories);
  if (!e) return null;
  const n = Pi(t.config);
  if (!n) return null;
  const i = typeof t.id == "string" && t.id.trim() ? t.id.trim() : ih(), r = br(e), o = {
    id: i,
    key: r,
    categories: e,
    config: n,
    updatedAt: Number.isFinite(t.updatedAt) ? Number(t.updatedAt) : Date.now()
  };
  return typeof t.label == "string" && t.label.trim() && (o.label = t.label.trim()), o;
}
u(Ia, "sanitizeCriteriaMappingEntry");
function nh(t) {
  if (!t || typeof t != "object") return null;
  const e = typeof t.mappingId == "string" && t.mappingId.trim() ? t.mappingId.trim() : null, n = ko(t.categories);
  return !e && !n ? null : {
    mappingId: e,
    categories: n,
    updatedAt: Number.isFinite(t.updatedAt) ? Number(t.updatedAt) : Date.now()
  };
}
u(nh, "sanitizeCurrentSelection");
function ko(t) {
  const e = {};
  if (Array.isArray(t))
    for (const n of t) {
      const i = Ju((n == null ? void 0 : n.id) ?? (n == null ? void 0 : n.categoryId) ?? (n == null ? void 0 : n.category)), r = Qu((n == null ? void 0 : n.value) ?? (n == null ? void 0 : n.selection) ?? (n == null ? void 0 : n.label));
      !i || !r || (e[i] = r);
    }
  else if (t && typeof t == "object")
    for (const [n, i] of Object.entries(t)) {
      const r = Ju(n), o = Qu(i);
      !r || !o || (e[r] = o);
    }
  return Object.keys(e).length > 0 ? e : null;
}
u(ko, "sanitizeCriteriaCategories");
function br(t) {
  if (!t || typeof t != "object") return "";
  const e = Object.entries(t).filter(([, n]) => typeof n == "string" && n).map(([n, i]) => `${n}:${i}`);
  return e.sort((n, i) => n < i ? -1 : n > i ? 1 : 0), e.join("|");
}
u(br, "computeCriteriaMappingKey");
function ih() {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
u(ih, "generateLightMappingId");
function Ju(t) {
  if (typeof t != "string") return null;
  const e = t.trim();
  return e || null;
}
u(Ju, "normalizeCategoryId");
function Qu(t) {
  if (typeof t != "string") return null;
  const e = t.trim();
  return e || null;
}
u(Qu, "normalizeCategoryValue");
const Qr = [];
function rh(t) {
  typeof t == "function" && (Qr.includes(t) || Qr.push(t));
}
u(rh, "registerHiddenLightProvider");
function Op(t) {
  const e = Qr.indexOf(t);
  e >= 0 && Qr.splice(e, 1);
}
u(Op, "unregisterHiddenLightProvider");
function kp() {
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
u(kp, "getHiddenLightIds");
const eu = /* @__PURE__ */ new Map(), Zr = [];
function xr(t) {
  t != null && t.tag && eu.set(t.tag, { ...t });
}
u(xr, "registerTileConvention");
function Ap(t) {
  eu.delete(t);
}
u(Ap, "unregisterTileConvention");
function oh() {
  return eu;
}
u(oh, "getTileConventions");
function Mp(t) {
  typeof t == "function" && (Zr.includes(t) || Zr.push(t));
}
u(Mp, "registerIndexingHook");
function xp(t) {
  const e = Zr.indexOf(t);
  e >= 0 && Zr.splice(e, 1);
}
u(xp, "unregisterIndexingHook");
function _p() {
  return Zr;
}
u(_p, "getIndexingHooks");
const vs = ["AmbientLight", "Wall", "AmbientSound"];
let ws = /* @__PURE__ */ new WeakMap(), Es = /* @__PURE__ */ new WeakMap();
function Np(t) {
  const e = /* @__PURE__ */ new Set();
  for (const n of (t == null ? void 0 : t.rules) ?? [])
    for (const i of Object.keys((n == null ? void 0 : n.criteria) ?? {}))
      i && e.add(i);
  return Array.from(e);
}
u(Np, "getPresetDependencyKeys");
function $p(t, e) {
  const n = /* @__PURE__ */ new Map();
  for (const i of vs) {
    const r = e.get(i) ?? [], o = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map();
    for (const a of r) {
      const l = ah(a, i);
      if (l != null && l.base) {
        o.add(a.id);
        for (const c of Np(l))
          s.has(c) || s.set(c, /* @__PURE__ */ new Set()), s.get(c).add(a.id);
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
u($p, "buildPlaceableDependencyIndex");
function Fp(t, e) {
  const n = Es.get(t);
  if (n && vs.every((r) => n.collectionsByType.get(r) === e.get(r)))
    return n;
  const i = $p(t, e);
  return Es.set(t, i), i;
}
u(Fp, "getPlaceableDependencyIndex");
function Dp(t, e, n) {
  if (!e || !t) return [];
  const i = Wf(n);
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
u(Dp, "getDocsForChangedKeys");
function sh(t, e) {
  const n = { _id: e._id };
  for (const [r, o] of Object.entries(e)) {
    if (r === "_id") continue;
    const s = t == null ? void 0 : t[r];
    if (Ki(o) && Ki(s)) {
      const a = sh(s, { _id: e._id, ...o });
      if (!a) continue;
      const l = Object.keys(a).filter((c) => c !== "_id");
      if (l.length > 0) {
        n[r] = {};
        for (const c of l)
          n[r][c] = a[c];
      }
      continue;
    }
    Xl(s, o) || (n[r] = o);
  }
  return Object.keys(n).filter((r) => r !== "_id").length > 0 ? n : null;
}
u(sh, "buildChangedPayload");
function ah(t, e) {
  var a;
  const n = ((a = t == null ? void 0 : t.flags) == null ? void 0 : a[ne]) ?? {}, i = (n == null ? void 0 : n.presets) ?? null, r = e === "AmbientLight" ? (n == null ? void 0 : n.lightCriteria) ?? null : null, o = ws.get(t);
  if (o && o.type === e && o.rawPresets === i && o.rawLightCriteria === r)
    return o.presets;
  let s = null;
  if (n != null && n.presets) {
    const l = n.presets.base ?? null, c = Array.isArray(n.presets.rules) ? n.presets.rules : [];
    (l && Object.keys(l).length > 0 || c.length > 0) && (s = {
      base: l ?? {},
      rules: c
    });
  }
  if (!s && e === "AmbientLight" && (n != null && n.lightCriteria)) {
    const l = Lp(n.lightCriteria);
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
u(ah, "getPresetsForDocument");
function Pp(t = null, e = null) {
  t ? Es.delete(t) : Es = /* @__PURE__ */ new WeakMap(), e ? ws.delete(e) : t || (ws = /* @__PURE__ */ new WeakMap());
}
u(Pp, "invalidatePlaceableCriteriaCaches");
async function lh(t, e, n = {}) {
  var l, c;
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
  const o = kp(), s = new Map(
    vs.map((d) => [d, e.getEmbeddedCollection(d) ?? []])
  ), a = Fp(e, s);
  for (const d of vs) {
    const h = s.get(d) ?? [], f = {
      total: Gf(h),
      scanned: 0,
      updated: 0,
      chunks: 0
    }, m = a.byType.get(d) ?? null, g = Dp(h, m, n.changedKeys);
    if (f.scanned = g.length, r.total += f.total, r.scanned += f.scanned, r.byType[d] = f, !g.length) continue;
    const y = [];
    for (const b of g) {
      const v = ah(b, d);
      if (!(v != null && v.base)) continue;
      const w = Vf(v.base, v.rules ?? [], t);
      w._id = b._id, d === "AmbientLight" && o.has(b._id) && (w.hidden = !0);
      const E = (b == null ? void 0 : b._source) ?? ((c = b == null ? void 0 : b.toObject) == null ? void 0 : c.call(b)) ?? {}, S = sh(E, w);
      S && y.push(S);
    }
    y.length > 0 && (f.chunks = await Xf(e, d, y, n.chunkSize), f.updated = y.length, r.updated += y.length, r.chunks += f.chunks, console.log(`${ne} | Updated ${y.length} ${d}(s)`));
  }
  return r.durationMs = Rt() - i, r;
}
u(lh, "updatePlaceables");
const Fo = /* @__PURE__ */ new Map();
function Rp(t) {
  var e;
  return t = t ?? ((e = game.scenes) == null ? void 0 : e.viewed), t ? Sa(t) : null;
}
u(Rp, "getState");
async function Hp(t, e, n = 0) {
  var m;
  const i = Rt();
  if (e = e ?? ((m = game.scenes) == null ? void 0 : m.viewed), !e) return null;
  up(e);
  const r = St(e);
  if (!r.length)
    return console.warn(`${ne} | applyState skipped: scene has no criteria.`), null;
  const o = Sa(e, r), s = Ca({ ...o, ...t ?? {} }, r), a = r.filter((g) => (o == null ? void 0 : o[g.key]) !== (s == null ? void 0 : s[g.key])).map((g) => g.key), l = a.length > 0;
  l && await Yg(e, s, r);
  const c = l ? s : o, [d, h] = await Promise.all([
    Qf(c, e, { changedKeys: a }),
    lh(c, e, { changedKeys: a })
  ]), f = Rt() - i;
  return D("Criteria apply telemetry", {
    sceneId: e.id,
    changedKeys: a,
    didChange: l,
    queuedMs: n,
    durationMs: f,
    tiles: d,
    placeables: h
  }), Hooks.callAll("eidolon-utilities.criteriaStateApplied", e, c), c;
}
u(Hp, "applyStateInternal");
async function ch(t, e) {
  var l;
  if (e = e ?? ((l = game.scenes) == null ? void 0 : l.viewed), !e) return null;
  const n = e.id ?? "__viewed__", i = Rt(), r = Fo.get(n) ?? Promise.resolve();
  let o = null;
  const s = r.catch(() => null).then(async () => {
    const c = Rt() - i;
    return Hp(t, e, c);
  });
  o = s;
  const a = s.finally(() => {
    Fo.get(n) === a && Fo.delete(n);
  });
  return Fo.set(n, a), o;
}
u(ch, "applyState$1");
function qp(t) {
  var e;
  return t = t ?? ((e = game.scenes) == null ? void 0 : e.viewed), t ? Bf(t) : null;
}
u(qp, "getVersion");
async function uh(t, e) {
  var n;
  e = e ?? ((n = game.scenes) == null ? void 0 : n.viewed), e != null && e.setFlag && await e.setFlag(ne, qf, Number(t));
}
u(uh, "setVersion");
async function jp(t) {
  return uh(jf, t);
}
u(jp, "markCurrentVersion");
const _r = "Standard", Bp = {
  nolights: "No Lights"
}, Up = /* @__PURE__ */ u((...t) => console.log(`${ne} | criteria indexer:`, ...t), "log");
function Vp() {
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
u(Vp, "registerDefaultConventions");
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
u(Ss, "parseFileTags");
function Gp(t, e, n = _r) {
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
u(Gp, "buildFileIndex");
function Wp(t, e) {
  return t.map((n, i) => {
    const r = [...e[n] ?? /* @__PURE__ */ new Set()].sort(), s = r.includes(_r) ? _r : r[0] ?? _r, a = Xc(n);
    return a.key = n, a.label = Bp[n] ?? n.charAt(0).toUpperCase() + n.slice(1), a.values = r.length ? r : [_r], a.default = a.values.includes(s) ? s : a.values[0], a.order = i, a;
  });
}
u(Wp, "buildCriteriaDefinitions");
async function Zu(t, e, n, { dryRun: i = !1 } = {}) {
  const r = t.getFlag("monks-active-tiles", "files");
  if (!(r != null && r.length)) return null;
  const o = Gp(r, e), s = Kf(o, { files: r });
  for (const a of r) {
    const l = Ss(a == null ? void 0 : a.name);
    if (l)
      for (const [c, d] of Object.entries(e)) {
        const h = l[Number(c)];
        h != null && n[d] && n[d].add(h);
      }
  }
  return i || (await t.setFlag(ne, _i, s), typeof t.unsetFlag == "function" && await t.unsetFlag(ne, xi)), { files: r.length };
}
u(Zu, "indexTile");
function ed(t, e, n) {
  return t.positionMap === "inherit" ? n : e >= 4 && t.positionMap4 ? t.positionMap4 : t.positionMap;
}
u(ed, "resolvePositionMap");
function zp(t, e) {
  return e >= 4 && t.positionMap4 ? t.positionMap4 : t.positionMap;
}
u(zp, "resolvePrimaryPositionMap");
function Yp(t) {
  if (!Array.isArray(t)) return oh();
  const e = /* @__PURE__ */ new Map();
  for (const n of t)
    n != null && n.tag && e.set(n.tag, { ...n });
  return e;
}
u(Yp, "resolveConventions");
async function Kp(t, e = {}) {
  var w, E, S, I, k, M, $;
  t != null && typeof t == "object" && !t.id && !t.tiles && (e = { ...t, ...e }, t = null);
  const {
    dryRun: n = !1,
    force: i = !1
  } = e;
  if (t = t ?? ((w = game.scenes) == null ? void 0 : w.viewed), !t) throw new Error("No scene provided to indexScene.");
  if (!globalThis.Tagger) throw new Error("Tagger is required to index scene criteria.");
  if (!i && Bf(t) >= jf)
    throw new Error(
      `Scene "${t.name}" is already criteria-indexed. Use force: true to re-index.`
    );
  const r = Yp(e.conventions), o = { sceneId: t.id };
  let s = null, a = null, l = 3;
  for (const [N, x] of r) {
    if (!x.required) continue;
    const F = Tagger.getByTag(N, o) ?? [];
    if (!F.length) throw new Error(`No ${N} tile found.`);
    if (x.maxCount && F.length > x.maxCount)
      throw new Error(`Expected ${x.maxCount} ${N} tile(s), found ${F.length}.`);
    s = x, a = F[0];
    const A = a.getFlag("monks-active-tiles", "files");
    if (!(A != null && A.length)) throw new Error(`${N} tile has no MATT files.`);
    const R = Ss((E = A[0]) == null ? void 0 : E.name);
    if (!(R != null && R.length))
      throw new Error(`Cannot parse bracket tags from: ${((S = A[0]) == null ? void 0 : S.name) ?? "<unknown>"}`);
    if (R.length < 3)
      throw new Error(`Expected 3+ bracket tags, found ${R.length}.`);
    l = R.length, l === 3 && ((I = s.positionMap) == null ? void 0 : I[2]) === "effect" && A.some((B) => {
      const H = Ss(B == null ? void 0 : B.name);
      return (H == null ? void 0 : H[2]) === "No Lights";
    }) && (s = {
      ...s,
      positionMap: { ...s.positionMap, 2: "nolights" }
    }, r.set(N, s));
    break;
  }
  if (!s)
    throw new Error("No required tile convention registered. Register conventions before indexing.");
  const c = zp(s, l), d = [], h = Object.keys(c).map(Number).sort((N, x) => N - x);
  for (const N of h) {
    const x = c[N];
    d.includes(x) || d.push(x);
  }
  const f = {};
  for (const N of d)
    f[N] = /* @__PURE__ */ new Set();
  for (const [, N] of r) {
    if (N.positionMap === "inherit") continue;
    const x = ed(N, l, c);
    for (const F of Object.values(x))
      f[F] || (f[F] = /* @__PURE__ */ new Set(), d.includes(F) || d.push(F));
  }
  const m = {}, g = _p();
  for (const [N, x] of r) {
    const F = Tagger.getByTag(N, o) ?? [], A = ed(x, l, c), R = N.toLowerCase(), j = [];
    for (const B of F) {
      const H = await Zu(B, A, f, { dryRun: n });
      H && j.push(H);
    }
    m[R] = x.maxCount === 1 ? j[0] ?? null : j;
  }
  if (g.length > 0) {
    const N = t.getEmbeddedCollection("Tile") ?? [], x = new Set(r.keys());
    for (const F of N) {
      if ((((M = (k = globalThis.Tagger) == null ? void 0 : k.getTags) == null ? void 0 : M.call(k, F)) ?? []).some((B) => x.has(B))) continue;
      const j = F.getFlag("monks-active-tiles", "files");
      if (j != null && j.length)
        for (const B of g)
          try {
            const H = B(t, F, j);
            if (H != null && H.positionMap) {
              await Zu(F, H.positionMap, f, { dryRun: n });
              break;
            }
          } catch (H) {
            console.warn(`${ne} | Indexing hook error:`, H);
          }
    }
  }
  const y = Wp(d, f);
  n || (await Ea(t, y), await jp(t));
  const b = s.tag.toLowerCase();
  Up(
    n ? "Dry run complete" : "Indexing complete",
    `- ${y.length} criteria,`,
    `${(($ = m[b]) == null ? void 0 : $.files) ?? 0} ${s.tag.toLowerCase()} files`
  );
  const v = Array.from(r.keys()).filter((N) => N !== s.tag).some((N) => {
    const x = m[N.toLowerCase()];
    return Array.isArray(x) ? x.length > 0 : !!x;
  });
  return {
    criteria: y,
    state: y.reduce((N, x) => (N[x.key] = x.default, N), {}),
    tiles: m,
    overlayMode: v
  };
}
u(Kp, "indexScene");
var zd, Ue, yt, bt, Ii, tt, Jt, Fn, ma, fe, dh, fh, hh, Ql, mh, Zl, gh, Nr, ec;
const Ot = class Ot extends sn(on) {
  constructor(n = {}) {
    var i;
    super(n);
    _(this, fe);
    _(this, Ue, null);
    _(this, yt, []);
    _(this, bt, {});
    _(this, Ii, !1);
    _(this, tt, null);
    _(this, Jt, null);
    _(this, Fn, null);
    _(this, ma, 120);
    this.setScene(n.scene ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null);
  }
  setScene(n) {
    var i;
    O(this, Ue, n ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null), T(this, fe, dh).call(this);
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
      sceneName: ((r = p(this, Ue)) == null ? void 0 : r.name) ?? C("EIDOLON.CriteriaSwitcher.NoScene", "No active scene"),
      labels: {
        subtitle: C(
          "EIDOLON.CriteriaSwitcher.Subtitle",
          "Switch criteria live and immediately apply all mapped updates."
        ),
        empty: C(
          "EIDOLON.CriteriaSwitcher.Empty",
          "No criteria found for this scene. Configure criteria first."
        ),
        reset: C("EIDOLON.CriteriaSwitcher.Reset", "Reset Defaults"),
        close: C("EIDOLON.CriteriaSwitcher.Close", "Close"),
        applying: C("EIDOLON.CriteriaSwitcher.Applying", "Applying changes..."),
        ready: C("EIDOLON.CriteriaSwitcher.Ready", "Ready")
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
      stateSummary: T(this, fe, ec).call(this)
    };
  }
  _onRender(n, i) {
    super._onRender(n, i), T(this, fe, fh).call(this), T(this, fe, hh).call(this);
  }
  async _onClose(n) {
    return p(this, tt) !== null && (clearTimeout(p(this, tt)), O(this, tt, null)), p(this, Fn) !== null && (Hooks.off("eidolon-utilities.criteriaStateApplied", p(this, Fn)), O(this, Fn, null)), super._onClose(n);
  }
};
Ue = new WeakMap(), yt = new WeakMap(), bt = new WeakMap(), Ii = new WeakMap(), tt = new WeakMap(), Jt = new WeakMap(), Fn = new WeakMap(), ma = new WeakMap(), fe = new WeakSet(), dh = /* @__PURE__ */ u(function() {
  if (!p(this, Ue)) {
    O(this, yt, []), O(this, bt, {});
    return;
  }
  O(this, yt, St(p(this, Ue)).sort((n, i) => n.order - i.order)), O(this, bt, Sa(p(this, Ue), p(this, yt)));
}, "#hydrateFromScene"), fh = /* @__PURE__ */ u(function() {
  var i, r;
  const n = this.element;
  n instanceof HTMLElement && (n.querySelectorAll("[data-criteria-key]").forEach((o) => {
    o.addEventListener("change", (s) => {
      const a = s.currentTarget;
      if (!(a instanceof HTMLSelectElement)) return;
      const l = a.dataset.criteriaKey;
      l && (O(this, bt, {
        ...p(this, bt),
        [l]: a.value
      }), T(this, fe, mh).call(this, { [l]: a.value }));
    });
  }), (i = n.querySelector("[data-action='reset-defaults']")) == null || i.addEventListener("click", () => {
    T(this, fe, gh).call(this);
  }), (r = n.querySelector("[data-action='close-switcher']")) == null || r.addEventListener("click", () => {
    this.close();
  }));
}, "#bindEvents"), hh = /* @__PURE__ */ u(function() {
  p(this, Fn) === null && O(this, Fn, Hooks.on("eidolon-utilities.criteriaStateApplied", (n, i) => {
    !p(this, Ue) || (n == null ? void 0 : n.id) !== p(this, Ue).id || p(this, Ii) || (O(this, bt, { ...i ?? {} }), this.render({ force: !0 }));
  }));
}, "#ensureSyncHook"), Ql = /* @__PURE__ */ u(async function(n) {
  var i, r;
  if (p(this, Ue)) {
    T(this, fe, Nr).call(this, "applying"), O(this, Ii, !0);
    try {
      const o = await ch(n, p(this, Ue));
      o && O(this, bt, o), T(this, fe, Nr).call(this, "ready"), this.render({ force: !0 });
    } catch (o) {
      console.error(`${ne} | Failed to apply criteria state`, o), (r = (i = ui.notifications) == null ? void 0 : i.error) == null || r.call(
        i,
        C(
          "EIDOLON.CriteriaSwitcher.ApplyError",
          "Failed to apply the selected criteria state."
        )
      ), T(this, fe, Nr).call(this, "error", (o == null ? void 0 : o.message) ?? "Unknown error");
    } finally {
      O(this, Ii, !1), p(this, Jt) && T(this, fe, Zl).call(this);
    }
  }
}, "#applyPartialState"), mh = /* @__PURE__ */ u(function(n) {
  O(this, Jt, {
    ...p(this, Jt) ?? {},
    ...n ?? {}
  }), p(this, tt) !== null && clearTimeout(p(this, tt)), T(this, fe, Nr).call(this, "applying"), O(this, tt, setTimeout(() => {
    O(this, tt, null), T(this, fe, Zl).call(this);
  }, p(this, ma)));
}, "#queuePartialState"), Zl = /* @__PURE__ */ u(async function() {
  if (p(this, Ii) || !p(this, Jt)) return;
  const n = p(this, Jt);
  O(this, Jt, null), await T(this, fe, Ql).call(this, n);
}, "#flushPendingState"), gh = /* @__PURE__ */ u(async function() {
  if (!p(this, yt).length) return;
  const n = p(this, yt).reduce((i, r) => (i[r.key] = r.default, i), {});
  O(this, bt, n), p(this, tt) !== null && (clearTimeout(p(this, tt)), O(this, tt, null)), O(this, Jt, null), await T(this, fe, Ql).call(this, n);
}, "#resetToDefaults"), Nr = /* @__PURE__ */ u(function(n, i = "") {
  const r = this.element;
  if (!(r instanceof HTMLElement)) return;
  const o = r.querySelector("[data-role='status']");
  if (o instanceof HTMLElement)
    switch (o.dataset.mode = n, n) {
      case "applying":
        o.textContent = C("EIDOLON.CriteriaSwitcher.Applying", "Applying changes...");
        break;
      case "error":
        o.textContent = `${C("EIDOLON.CriteriaSwitcher.Error", "Error")}: ${i}`;
        break;
      case "ready":
      default:
        o.textContent = `${C("EIDOLON.CriteriaSwitcher.Ready", "Ready")}: ${T(this, fe, ec).call(this)}`;
        break;
    }
}, "#setStatus"), ec = /* @__PURE__ */ u(function() {
  return p(this, yt).length ? `[${p(this, yt).map((n) => {
    var i;
    return ((i = p(this, bt)) == null ? void 0 : i[n.key]) ?? n.default;
  }).join(" | ")}]` : "-";
}, "#formatStateSummary"), u(Ot, "CriteriaSwitcherApplication"), le(Ot, "APP_ID", `${ne}-criteria-switcher`), le(Ot, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Le(Ot, Ot, "DEFAULT_OPTIONS"),
  {
    id: Ot.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((zd = Le(Ot, Ot, "DEFAULT_OPTIONS")) == null ? void 0 : zd.classes) ?? [], "eidolon-criteria-switcher-window", "themed"])
    ),
    tag: "section",
    window: {
      title: C("EIDOLON.CriteriaSwitcher.Title", "Criteria Switcher"),
      icon: "fa-solid fa-sliders",
      resizable: !1
    },
    position: {
      width: 420,
      height: "auto"
    }
  },
  { inplace: !1 }
)), le(Ot, "PARTS", {
  content: {
    template: `modules/${ne}/templates/criteria-switcher.html`
  }
});
let Jl = Ot;
const Xp = va(Jl);
let Ni = null;
function Jp(t) {
  var e;
  return t ?? ((e = game.scenes) == null ? void 0 : e.viewed) ?? null;
}
u(Jp, "resolveScene");
function Qp(t) {
  var e;
  return !!(t != null && t.rendered && ((e = t == null ? void 0 : t.element) != null && e.isConnected));
}
u(Qp, "isRendered");
function Oa() {
  return Qp(Ni) ? Ni : (Ni = null, null);
}
u(Oa, "getCriteriaSwitcher");
function ph(t) {
  var i, r, o, s, a;
  const e = Jp(t);
  if (!e)
    return (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "No active scene to open the criteria switcher."), null;
  if (!Ta(e))
    return (s = (o = ui.notifications) == null ? void 0 : o.warn) == null || s.call(o, "You do not have permission to manage scene criteria."), null;
  const n = Oa();
  return n ? (n.setScene(e), n.render({ force: !0 }), (a = n.bringToFront) == null || a.call(n), n) : (Ni = Xp({ scene: e }), Ni.render({ force: !0 }), Ni);
}
u(ph, "openCriteriaSwitcher");
function yh() {
  const t = Oa();
  t && (t.close(), Ni = null);
}
u(yh, "closeCriteriaSwitcher");
function tu(t) {
  return Oa() ? (yh(), null) : ph(t);
}
u(tu, "toggleCriteriaSwitcher");
const Zp = {
  SCHEMA_VERSION: Jc,
  applyState: ch,
  getState: Rp,
  getVersion: qp,
  setVersion: uh,
  getCriteria(t) {
    var e;
    return St(t ?? ((e = game.scenes) == null ? void 0 : e.viewed));
  },
  setCriteria(t, e) {
    var n;
    return Ea(e ?? ((n = game.scenes) == null ? void 0 : n.viewed), t);
  },
  updateTiles: Qf,
  updatePlaceables: lh,
  indexScene: Kp,
  openCriteriaSwitcher: ph,
  closeCriteriaSwitcher: yh,
  toggleCriteriaSwitcher: tu,
  findBestMatch: op,
  findFileIndex: sp,
  resolveRules: Vf,
  // Convention registration API
  registerTileConvention: xr,
  unregisterTileConvention: Ap,
  getTileConventions: oh,
  // Hidden light provider API
  registerHiddenLightProvider: rh,
  unregisterHiddenLightProvider: Op,
  // Indexing hook API
  registerIndexingHook: Mp,
  unregisterIndexingHook: xp
};
function ey(t) {
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
u(ey, "findTabNav");
function ty(t, e) {
  var i, r, o;
  return t instanceof HTMLElement ? [
    (i = t.querySelector(".tab[data-tab]")) == null ? void 0 : i.parentElement,
    t.querySelector(".sheet-body"),
    (o = (r = e == null ? void 0 : e.parentElement) == null ? void 0 : r.querySelector) == null ? void 0 : o.call(r, ":scope > .sheet-body"),
    e == null ? void 0 : e.parentElement
  ].find((s) => s instanceof HTMLElement) ?? null : null;
}
u(ty, "findTabBody");
function ny(t, e) {
  var n, i, r, o, s, a, l;
  return ((n = t == null ? void 0 : t.dataset) == null ? void 0 : n.group) ?? ((o = (r = (i = t == null ? void 0 : t.querySelector) == null ? void 0 : i.call(t, "[data-group]")) == null ? void 0 : r.dataset) == null ? void 0 : o.group) ?? ((l = (a = (s = e == null ? void 0 : e.querySelector) == null ? void 0 : s.call(e, ".tab[data-group]")) == null ? void 0 : a.dataset) == null ? void 0 : l.group) ?? null;
}
u(ny, "getTabGroup");
function iy(t, e, n) {
  if (!(t instanceof HTMLElement)) return;
  t.textContent = "";
  const i = document.createElement("i");
  i.className = n, i.setAttribute("inert", ""), t.append(i, " ");
  const r = document.createElement("span");
  r.textContent = e, t.append(r);
}
u(iy, "setTabButtonContent");
function ry(t, e, n) {
  const i = t.querySelector("[data-tab]"), r = (i == null ? void 0 : i.tagName) || "A", o = document.createElement(r);
  return i instanceof HTMLElement && (o.className = i.className), o.classList.remove("active"), r === "BUTTON" && (o.type = "button"), o.dataset.action = "tab", o.dataset.tab = n, e && (o.dataset.group = e), o.setAttribute("aria-selected", "false"), o.setAttribute("aria-pressed", "false"), o;
}
u(ry, "createTabButton");
function oy(t, e, n) {
  const i = document.createElement("div");
  i.classList.add("tab"), i.dataset.tab = n, e && (i.dataset.group = e), i.dataset.applicationPart = n, i.setAttribute("hidden", "true");
  const r = xf(t);
  return t.insertBefore(i, r ?? null), i;
}
u(oy, "createTabPanel");
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
u(Xa, "syncTabVisibility");
function nu(t, e, n, i, r) {
  const o = ey(e), s = ty(e, o);
  if (!(o instanceof HTMLElement) || !(s instanceof HTMLElement)) return null;
  const a = ny(o, s);
  let l = o.querySelector(`[data-tab="${n}"]`);
  l instanceof HTMLElement || (l = ry(o, a, n), o.appendChild(l)), iy(l, i, r);
  let c = s.querySelector(`.tab[data-tab="${n}"]`);
  c instanceof HTMLElement || (c = oy(s, a, n));
  const d = `data-eidolon-bound-${n}`;
  return l.hasAttribute(d) || (l.addEventListener("click", () => {
    Af(t, n, a), requestAnimationFrame(() => {
      Xa(t, a, n, l, c);
    });
  }), l.setAttribute(d, "true")), Xa(t, a, n, l, c), requestAnimationFrame(() => {
    Xa(t, a, n, l, c);
  }), sy(t, o), c;
}
u(nu, "ensureTileConfigTab");
function sy(t, e) {
  !(t != null && t.setPosition) || !(e instanceof HTMLElement) || requestAnimationFrame(() => {
    var o;
    if (e.scrollWidth <= e.clientWidth) return;
    const n = e.scrollWidth - e.clientWidth, i = t.element instanceof HTMLElement ? t.element : (o = t.element) == null ? void 0 : o[0];
    if (!i) return;
    const r = i.offsetWidth || 480;
    t.setPosition({ width: r + n + 16 });
  });
}
u(sy, "fitNavWidth");
function bh(t) {
  var e;
  return ((e = t == null ? void 0 : t.getFlag) == null ? void 0 : e.call(t, "monks-active-tiles", "files")) ?? [];
}
u(bh, "getTileFiles$1");
function ay(t = []) {
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
u(ay, "createDefaultTileCriteria");
function ly(t, e = {}) {
  var s, a;
  const { allowLegacy: n = !0 } = e, i = bh(t), r = (s = t == null ? void 0 : t.getFlag) == null ? void 0 : s.call(t, ne, _i);
  if (r) return Di(r, { files: i });
  if (!n) return null;
  const o = (a = t == null ? void 0 : t.getFlag) == null ? void 0 : a.call(t, ne, xi);
  return o ? Di(o, { files: i }) : null;
}
u(ly, "getTileCriteria");
async function td(t, e, n = {}) {
  if (!(t != null && t.setFlag)) return null;
  const {
    strictValidation: i = !0
  } = n, r = bh(t), o = Di(e, { files: r });
  if (!o)
    return typeof t.unsetFlag == "function" ? (await t.unsetFlag(ne, _i), await t.unsetFlag(ne, xi)) : (await t.setFlag(ne, _i, null), await t.setFlag(ne, xi, null)), null;
  if (i) {
    const s = Yf(o, { files: r });
    if (s.errors.length > 0)
      throw new Error(
        `Tile criteria contains ${s.errors.length} conflicting rule pair(s). Resolve clashes before saving.`
      );
  }
  return await t.setFlag(ne, _i, o), typeof t.unsetFlag == "function" && await t.unsetFlag(ne, xi), o;
}
u(td, "setTileCriteria");
const tc = "__eidolon_any__", nc = "eidolon-tile-criteria", cy = "fa-solid fa-sliders", vh = Symbol.for("eidolon.tileCriteriaUiState"), ka = ["all", "unmapped", "mapped", "conflicts"];
function uy(t) {
  const e = t == null ? void 0 : t[vh];
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
u(uy, "readUiState");
function dy(t, e) {
  if (!t || !e) return;
  typeof e.filterQuery == "string" && (t.filterQuery = e.filterQuery), ka.includes(e.filterMode) && (t.filterMode = e.filterMode), Number.isInteger(e.selectedFileIndex) && t.fileEntries.some((i) => i.index === e.selectedFileIndex) && (t.selectedFileIndex = e.selectedFileIndex);
}
u(dy, "applyUiState");
function fy(t) {
  const e = t == null ? void 0 : t.app, n = t == null ? void 0 : t.state;
  !e || !n || (e[vh] = {
    filterQuery: typeof n.filterQuery == "string" ? n.filterQuery : "",
    filterMode: ka.includes(n.filterMode) ? n.filterMode : "all",
    selectedFileIndex: Number.isInteger(n.selectedFileIndex) ? n.selectedFileIndex : null
  });
}
u(fy, "persistUiState");
function hy(t) {
  const e = (t == null ? void 0 : t.object) ?? (t == null ? void 0 : t.document) ?? null;
  return !(e != null && e.isEmbedded) || e.documentName !== "Tile" ? null : e;
}
u(hy, "getTileDocument");
function my(t) {
  var e;
  return ((e = t == null ? void 0 : t.getFlag) == null ? void 0 : e.call(t, "monks-active-tiles", "files")) ?? [];
}
u(my, "getTileFiles");
function gy(t, e) {
  var a;
  const n = (t == null ? void 0 : t.parent) ?? ((a = game.scenes) == null ? void 0 : a.viewed) ?? null, r = St(n).sort((l, c) => l.order - c.order).map((l) => ({
    key: l.key,
    label: l.label || l.key,
    values: [...l.values ?? []]
  })), o = new Set(r.map((l) => l.key)), s = /* @__PURE__ */ new Map();
  for (const l of (e == null ? void 0 : e.variants) ?? [])
    for (const [c, d] of Object.entries((l == null ? void 0 : l.criteria) ?? {}))
      o.has(c) || (s.has(c) || s.set(c, /* @__PURE__ */ new Set()), typeof d == "string" && d.trim() && s.get(c).add(d.trim()));
  for (const [l, c] of s.entries())
    r.push({
      key: l,
      label: l,
      values: [...c]
    });
  return r;
}
u(gy, "getCriteriaDefinitions");
function py(t) {
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
u(py, "buildTree");
function yy(t, e) {
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
u(yy, "collapseFolderBranch");
function by(t, e) {
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
u(by, "getRuleSummariesForFile");
function ic(t) {
  var m, g;
  const e = my(t), n = Qc(e), i = ly(t, { allowLegacy: !0 }) ?? ay(e), r = gy(t, i), o = new Map(r.map((y) => [y.key, y.label])), s = new Map(
    n.map((y) => [
      y.index,
      y.path || y.label
    ])
  ), a = Xr(i.defaultTarget, e), l = ((m = n[0]) == null ? void 0 : m.index) ?? 0, c = a >= 0 ? a : l, d = new Map(n.map((y) => [y.index, []]));
  let h = 1;
  for (const y of i.variants ?? []) {
    const b = Xr(y.target, e);
    b < 0 || (d.has(b) || d.set(b, []), d.get(b).push({
      id: h,
      criteria: { ...y.criteria ?? {} }
    }), h += 1);
  }
  const f = n.some((y) => y.index === c) ? c : ((g = n[0]) == null ? void 0 : g.index) ?? null;
  return {
    files: e,
    fileEntries: n,
    criteriaDefinitions: r,
    criteriaLabels: o,
    relativePaths: s,
    defaultIndex: c,
    selectedFileIndex: f,
    filterQuery: "",
    filterMode: "all",
    nextRuleId: h,
    rulesByFile: d,
    status: {
      mode: "ready",
      message: C("EIDOLON.TileCriteria.Ready", "Ready")
    }
  };
}
u(ic, "buildEditorState");
function rc(t, e) {
  return t.rulesByFile.has(e) || t.rulesByFile.set(e, []), t.rulesByFile.get(e);
}
u(rc, "getRulesForFile");
function vy(t) {
  return Object.fromEntries(
    Object.entries(t ?? {}).filter(([e, n]) => typeof e == "string" && e && typeof n == "string" && n.trim()).map(([e, n]) => [e, n.trim()])
  );
}
u(vy, "sanitizeRuleCriteria");
function wh(t) {
  const e = Zn(t.files, t.defaultIndex);
  if (!e) return null;
  const n = [], i = [];
  for (const [o, s] of t.rulesByFile.entries()) {
    const a = Zn(t.files, o);
    if (a)
      for (const [l, c] of s.entries()) {
        const d = vy(c.criteria);
        n.push({
          criteria: d,
          target: { ...a }
        }), i.push({
          fileIndex: o,
          ruleId: c.id,
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
u(wh, "buildTileCriteriaDraft");
function wy(t) {
  var e;
  return ((e = wh(t)) == null ? void 0 : e.normalized) ?? null;
}
u(wy, "exportTileCriteria");
function nd(t) {
  const e = wh(t);
  if (!(e != null && e.normalized))
    return {
      errors: [],
      warnings: [],
      errorFileIndexes: [],
      warningFileIndexes: []
    };
  const n = Yf(e.normalized, { files: t.files }), i = /* @__PURE__ */ u((a) => {
    const l = e.sources[a.leftIndex] ?? null, c = e.sources[a.rightIndex] ?? null;
    return {
      ...a,
      leftFileIndex: l == null ? void 0 : l.fileIndex,
      rightFileIndex: c == null ? void 0 : c.fileIndex
    };
  }, "mapConflict"), r = n.errors.map((a) => i(a)), o = n.warnings.map((a) => i(a)), s = /* @__PURE__ */ u((a) => {
    const l = /* @__PURE__ */ new Set();
    for (const c of a)
      Number.isInteger(c.leftFileIndex) && l.add(c.leftFileIndex), Number.isInteger(c.rightFileIndex) && l.add(c.rightFileIndex);
    return [...l];
  }, "toFileIndexes");
  return {
    errors: r,
    warnings: o,
    errorFileIndexes: s(r),
    warningFileIndexes: s(o)
  };
}
u(nd, "analyzeRuleConflicts");
function Do(t, e = "neutral") {
  const n = document.createElement("span");
  return n.classList.add("eidolon-tile-criteria__badge"), n.dataset.kind = e, n.textContent = t, n;
}
u(Do, "createBadge");
function Ey(t, e = {}) {
  const n = typeof t == "string" ? t : "", {
    maxLength: i = 42,
    headLength: r = 20,
    tailLength: o = 16
  } = e;
  if (!n || n.length <= i) return n;
  const s = n.slice(0, r).trimEnd(), a = n.slice(-o).trimStart();
  return `${s}...${a}`;
}
u(Ey, "middleEllipsis");
function Sy(t) {
  const e = typeof t == "string" ? t.trim() : "";
  if (!e)
    return {
      error: "",
      matches: /* @__PURE__ */ u(() => !0, "matches")
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
      matches: /* @__PURE__ */ u((o) => r.test(String(o ?? "")), "matches")
    };
  } catch (r) {
    return {
      error: (r == null ? void 0 : r.message) ?? C("EIDOLON.TileCriteria.InvalidRegex", "Invalid regex."),
      matches: /* @__PURE__ */ u(() => !0, "matches")
    };
  }
}
u(Sy, "createRegexFilter");
function Cy(t, e) {
  const n = document.createElement("select");
  n.dataset.criteriaKey = t.key;
  const i = document.createElement("option");
  i.value = tc, i.textContent = "*", n.appendChild(i);
  const r = new Set(t.values ?? []);
  e && !r.has(e) && r.add(e);
  for (const o of r) {
    const s = document.createElement("option");
    s.value = o, s.textContent = o, n.appendChild(s);
  }
  return n.value = e ?? tc, n;
}
u(Cy, "createCriterionSelect");
function Ty(t, e, n, i) {
  var a;
  const r = document.createElement("div");
  r.classList.add("eidolon-tile-criteria__rule-editor");
  const o = document.createElement("div");
  o.classList.add("eidolon-tile-criteria__rule-grid");
  for (const l of e.criteriaDefinitions) {
    const c = document.createElement("label");
    c.classList.add("eidolon-tile-criteria__rule-field");
    const d = document.createElement("span");
    d.classList.add("eidolon-tile-criteria__criterion-label"), d.textContent = l.label, c.appendChild(d);
    const h = Cy(l, (a = t.criteria) == null ? void 0 : a[l.key]);
    h.addEventListener("change", () => {
      h.value === tc ? delete t.criteria[l.key] : t.criteria[l.key] = h.value, i();
    }), c.appendChild(h), o.appendChild(c);
  }
  r.appendChild(o);
  const s = document.createElement("button");
  return s.type = "button", s.classList.add("control", "ui-control", "eidolon-tile-criteria__rule-remove"), s.textContent = C("EIDOLON.TileCriteria.RemoveRule", "Remove"), s.addEventListener("click", () => {
    const c = rc(e, n).filter((d) => d.id !== t.id);
    e.rulesByFile.set(n, c), i();
  }), r.appendChild(s), r;
}
u(Ty, "renderRuleEditor");
const Jo = /* @__PURE__ */ new WeakMap();
function Eh(t) {
  return (t == null ? void 0 : t.app) ?? (t == null ? void 0 : t.tile) ?? null;
}
u(Eh, "getDialogOwner");
function Ly(t) {
  for (const e of t) {
    const n = qe(e);
    if (n) return n;
    const i = qe(e == null ? void 0 : e.element);
    if (i) return i;
  }
  return null;
}
u(Ly, "findDialogRoot$1");
function Iy(t, e, n) {
  const i = t.state, r = i.fileEntries.find((y) => y.index === e);
  if (!r) return document.createElement("div");
  const o = document.createElement("section");
  o.classList.add("eidolon-tile-criteria__dialog-content");
  const s = document.createElement("header");
  s.classList.add("eidolon-tile-criteria__editor-header");
  const a = document.createElement("h4");
  a.textContent = i.relativePaths.get(r.index) || r.label, s.appendChild(a);
  const l = document.createElement("p");
  l.classList.add("notes"), l.textContent = `#${r.index + 1} · ${r.path || C("EIDOLON.TileCriteria.UnknownPath", "Unknown path")}`, s.appendChild(l), o.appendChild(s);
  const c = document.createElement("div");
  c.classList.add("eidolon-tile-criteria__editor-controls");
  const d = document.createElement("button");
  d.type = "button", d.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action"), i.defaultIndex === r.index ? (d.textContent = C("EIDOLON.TileCriteria.IsDefault", "Default Target"), d.disabled = !0) : (d.textContent = C("EIDOLON.TileCriteria.SetDefault", "Set As Default"), d.addEventListener("click", () => {
    i.defaultIndex = r.index, Xe(t), n();
  })), c.appendChild(d);
  const h = document.createElement("button");
  h.type = "button", h.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action", "secondary"), h.textContent = C("EIDOLON.TileCriteria.ClearFileRules", "Clear File Rules"), h.addEventListener("click", () => {
    i.rulesByFile.set(r.index, []), Xe(t), n();
  }), c.appendChild(h), o.appendChild(c);
  const f = document.createElement("div");
  f.classList.add("eidolon-tile-criteria__rule-editors");
  const m = rc(i, r.index);
  if (m.length)
    for (const y of m)
      f.appendChild(
        Ty(y, i, r.index, () => {
          Xe(t), n();
        })
      );
  else {
    const y = document.createElement("p");
    y.classList.add("notes"), y.textContent = C(
      "EIDOLON.TileCriteria.NoRulesForFile",
      "No rules map to this file yet. Add one to define when this variant should be active."
    ), f.appendChild(y);
  }
  o.appendChild(f);
  const g = document.createElement("button");
  return g.type = "button", g.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action"), g.textContent = C("EIDOLON.TileCriteria.AddRule", "Add Rule"), g.disabled = !i.criteriaDefinitions.length, g.addEventListener("click", () => {
    rc(i, r.index).push({
      id: i.nextRuleId,
      criteria: {}
    }), i.nextRuleId += 1, Xe(t), n();
  }), o.appendChild(g), o;
}
u(Iy, "buildRuleEditorContent");
function Oy(t, e) {
  var h, f, m;
  const n = Eh(t);
  if (!n) return;
  const i = Jo.get(n);
  if (i) {
    i.controller = t, i.fileIndex = e, (h = i.refresh) == null || h.call(i);
    return;
  }
  const r = {
    controller: t,
    fileIndex: e,
    host: null,
    refresh: null
  };
  Jo.set(n, r);
  const o = /* @__PURE__ */ u(() => {
    Jo.delete(n);
  }, "closeDialog"), s = /* @__PURE__ */ u(() => {
    r.host instanceof HTMLElement && r.host.replaceChildren(
      Iy(r.controller, r.fileIndex, s)
    );
  }, "refreshDialog");
  r.refresh = s;
  const a = C("EIDOLON.TileCriteria.EditorTitle", "Edit Tile Criteria Rules"), l = '<div class="eidolon-tile-criteria-editor-host"></div>', c = C("EIDOLON.TileCriteria.CloseEditor", "Close"), d = (m = (f = foundry == null ? void 0 : foundry.applications) == null ? void 0 : f.api) == null ? void 0 : m.DialogV2;
  if (typeof (d == null ? void 0 : d.wait) == "function") {
    d.wait({
      window: { title: a },
      content: l,
      buttons: [{ action: "close", label: c, default: !0 }],
      render: /* @__PURE__ */ u((...g) => {
        var v;
        const y = Ly(g), b = (v = y == null ? void 0 : y.querySelector) == null ? void 0 : v.call(y, ".eidolon-tile-criteria-editor-host");
        b instanceof HTMLElement && (r.host = b, s());
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
u(Oy, "openRuleEditorDialog");
function id(t) {
  var i;
  const e = Eh(t);
  if (!e) return;
  const n = Jo.get(e);
  (i = n == null ? void 0 : n.refresh) == null || i.call(n);
}
u(id, "refreshOpenRuleEditor");
function oc(t, e) {
  return (t.rulesByFile.get(e) ?? []).length > 0;
}
u(oc, "hasRulesForFile");
function Sh(t, e) {
  var n, i;
  return ((n = t == null ? void 0 : t.errorFileIndexes) == null ? void 0 : n.includes(e)) || ((i = t == null ? void 0 : t.warningFileIndexes) == null ? void 0 : i.includes(e));
}
u(Sh, "hasConflictForFile");
function ky(t, e, n) {
  switch (t.filterMode) {
    case "unmapped":
      return !oc(t, e.index);
    case "mapped":
      return oc(t, e.index);
    case "conflicts":
      return Sh(n, e.index);
    case "all":
    default:
      return !0;
  }
}
u(ky, "matchesFilterMode");
function Ay(t, e) {
  let n = 0, i = 0, r = 0;
  for (const o of t.fileEntries)
    oc(t, o.index) ? n += 1 : i += 1, Sh(e, o.index) && (r += 1);
  return {
    all: t.fileEntries.length,
    mapped: n,
    unmapped: i,
    conflicts: r
  };
}
u(Ay, "getFilterModeCounts");
function My(t) {
  switch (t) {
    case "unmapped":
      return C("EIDOLON.TileCriteria.FilterModeUnmapped", "Unmapped");
    case "mapped":
      return C("EIDOLON.TileCriteria.FilterModeMapped", "Mapped");
    case "conflicts":
      return C("EIDOLON.TileCriteria.FilterModeConflicts", "Clashes");
    case "all":
    default:
      return C("EIDOLON.TileCriteria.FilterModeAll", "All");
  }
}
u(My, "getFilterModeLabel");
function Ch(t, e, n, i, r) {
  var c, d;
  const o = [...t.folders.keys()].sort((h, f) => h.localeCompare(f));
  for (const h of o) {
    const f = yy(h, t.folders.get(h)), m = document.createElement("li");
    m.classList.add("eidolon-tile-criteria__tree-branch");
    const g = document.createElement("div");
    g.classList.add("document", "folder", "update", "eidolon-tile-criteria__folder-row");
    const y = document.createElement("i");
    y.classList.add("fa-solid", "fa-folder-open"), g.appendChild(y);
    const b = document.createElement("span");
    b.classList.add("eidolon-tile-criteria__tree-folder-label"), b.textContent = f.label, b.title = f.label, g.appendChild(b), m.appendChild(g);
    const v = document.createElement("ul");
    v.classList.add("eidolon-tile-criteria__tree"), v.dataset.folder = f.label, Ch(f.node, e, n, i, v), v.childElementCount > 0 && m.appendChild(v), r.appendChild(m);
  }
  const s = [...t.files].sort((h, f) => h.name.localeCompare(f.name));
  if (!s.length) return;
  const a = document.createElement("li"), l = document.createElement("ul");
  l.classList.add("document-list", "eidolon-tile-criteria__document-list");
  for (const h of s) {
    const f = h.entry, m = f.index === e.selectedFileIndex, g = f.index === e.defaultIndex, y = by(e, f.index), b = document.createElement("li");
    b.classList.add("document", "update", "eidolon-tile-criteria__tree-file");
    const v = document.createElement("button");
    v.type = "button", v.classList.add("eidolon-tile-criteria__file-row");
    const w = (c = i == null ? void 0 : i.errorFileIndexes) == null ? void 0 : c.includes(f.index), E = (d = i == null ? void 0 : i.warningFileIndexes) == null ? void 0 : d.includes(f.index);
    w ? v.classList.add("has-conflict") : E && v.classList.add("has-warning");
    const S = e.relativePaths.get(f.index) || f.path || h.name, I = [S];
    w ? I.push(
      C(
        "EIDOLON.TileCriteria.ConflictFileHint",
        "This file participates in one or more conflicting rules."
      )
    ) : E && I.push(
      C(
        "EIDOLON.TileCriteria.WarningFileHint",
        "This file has potentially redundant rules."
      )
    ), y.length || I.push(
      C(
        "EIDOLON.TileCriteria.UnmappedHint",
        "No criteria rules map to this file."
      )
    ), v.title = I.join(`
`), m && v.classList.add("is-selected"), v.addEventListener("click", () => {
      e.selectedFileIndex = f.index, Xe(n), Oy(n, f.index);
    });
    const k = document.createElement("span");
    k.classList.add("eidolon-tile-criteria__indicator"), k.dataset.kind = g ? "default" : y.length ? "mapped" : "unmapped", v.appendChild(k);
    const M = document.createElement("span");
    M.classList.add("eidolon-tile-criteria__file-content");
    const $ = document.createElement("span");
    $.classList.add("eidolon-tile-criteria__file-heading");
    const N = document.createElement("span");
    N.classList.add("eidolon-tile-criteria__file-title"), N.textContent = Ey(h.name || f.label), N.title = S, $.appendChild(N);
    const x = Do(`#${f.index + 1}`, "meta");
    x.classList.add("eidolon-tile-criteria__index-badge"), $.appendChild(x), M.appendChild($);
    const F = document.createElement("span");
    F.classList.add("eidolon-tile-criteria__badges"), g && F.appendChild(Do(C("EIDOLON.TileCriteria.DefaultBadge", "Default"), "default"));
    const A = y.slice(0, 2);
    for (const R of A)
      F.appendChild(Do(R, "rule"));
    if (y.length > A.length && F.appendChild(Do(`+${y.length - A.length}`, "meta")), M.appendChild(F), v.appendChild(M), w || E) {
      const R = document.createElement("span");
      R.classList.add("eidolon-tile-criteria__row-warning"), R.dataset.mode = w ? "error" : "warning", R.innerHTML = '<i class="fa-solid fa-triangle-exclamation" inert=""></i>', v.appendChild(R);
    }
    b.appendChild(v), l.appendChild(b);
  }
  a.appendChild(l), r.appendChild(a);
}
u(Ch, "renderTreeNode");
function xy(t, e, n, i = {}) {
  const r = document.createElement("section");
  r.classList.add("eidolon-tile-criteria__tree-panel");
  const o = Sy(t.filterQuery), s = Ay(t, n);
  t.filterMode !== "all" && s[t.filterMode] === 0 && (t.filterMode = "all");
  const a = document.createElement("div");
  a.classList.add("eidolon-tile-criteria__toolbar");
  const l = document.createElement("div");
  l.classList.add("eidolon-tile-criteria__mode-bar");
  for (const w of ka) {
    const E = document.createElement("button");
    E.type = "button", E.classList.add("control", "ui-control", "eidolon-tile-criteria__mode-button"), E.dataset.mode = w, E.textContent = My(w);
    const S = w === "all" || s[w] > 0;
    E.disabled = !S, S || (E.dataset.tooltip = C(
      "EIDOLON.TileCriteria.FilterModeUnavailable",
      "No entries currently match this filter."
    ), E.title = E.dataset.tooltip), t.filterMode === w ? (E.classList.add("is-active"), E.setAttribute("aria-pressed", "true")) : E.setAttribute("aria-pressed", "false"), E.addEventListener("click", () => {
      t.filterMode !== w && (t.filterMode = w, Xe(e));
    }), l.appendChild(E);
  }
  a.appendChild(l);
  const c = document.createElement("div");
  c.classList.add("eidolon-tile-criteria__filter-row");
  const d = document.createElement("input");
  d.type = "text", d.classList.add("eidolon-tile-criteria__filter-input"), d.placeholder = C("EIDOLON.TileCriteria.FilterPlaceholder", "Regex filter (path)"), d.value = t.filterQuery, d.autocomplete = "off", d.addEventListener("keydown", (w) => {
    w.stopPropagation(), w.key === "Enter" && w.preventDefault();
  }), d.addEventListener("keyup", (w) => {
    w.stopPropagation();
  }), d.addEventListener("change", (w) => {
    w.stopPropagation();
  }), d.addEventListener("input", (w) => {
    w.stopPropagation();
    const E = d.selectionStart ?? d.value.length, S = d.selectionEnd ?? E;
    t.filterQuery = d.value, Xe(e), requestAnimationFrame(() => {
      const I = e.section.querySelector(".eidolon-tile-criteria__filter-input");
      if (I instanceof HTMLInputElement) {
        I.focus();
        try {
          I.setSelectionRange(E, S);
        } catch {
        }
      }
    });
  }), c.appendChild(d);
  const h = document.createElement("div");
  h.classList.add("eidolon-tile-criteria__toolbar-actions");
  const f = document.createElement("button");
  f.type = "button";
  const m = C("EIDOLON.TileCriteria.Save", "Save Rules");
  f.classList.add("control", "ui-control", "eidolon-tile-criteria__toolbar-action", "icon-only"), f.dataset.tooltip = m, f.setAttribute("aria-label", m), f.title = m, f.innerHTML = '<i class="fa-solid fa-floppy-disk" inert=""></i>', f.disabled = n.errors.length > 0, f.addEventListener("click", () => {
    var w;
    (w = i.onSave) == null || w.call(i);
  }), h.appendChild(f);
  const g = document.createElement("button");
  g.type = "button";
  const y = C("EIDOLON.TileCriteria.Clear", "Clear Rules");
  if (g.classList.add("control", "ui-control", "secondary", "eidolon-tile-criteria__toolbar-action", "icon-only"), g.dataset.tooltip = y, g.setAttribute("aria-label", y), g.title = y, g.innerHTML = '<i class="fa-solid fa-trash" inert=""></i>', g.addEventListener("click", () => {
    var w;
    (w = i.onClear) == null || w.call(i);
  }), h.appendChild(g), c.appendChild(h), a.appendChild(c), r.appendChild(a), o.error) {
    const w = document.createElement("p");
    w.classList.add("notes", "eidolon-tile-criteria__filter-error"), w.textContent = `${C("EIDOLON.TileCriteria.InvalidRegex", "Invalid regex")}: ${o.error}`, r.appendChild(w);
  }
  const b = document.createElement("div");
  b.classList.add("eidolon-tile-criteria__library-tree");
  const v = t.fileEntries.filter((w) => {
    const E = t.relativePaths.get(w.index) || w.path || w.label;
    return ky(t, w, n) && o.matches(E);
  });
  if (t.fileEntries.length)
    if (v.length) {
      const w = document.createElement("ul");
      w.classList.add("eidolon-tile-criteria__tree"), Ch(py(v), t, e, n, w), b.appendChild(w);
    } else {
      const w = document.createElement("p");
      w.classList.add("notes"), w.textContent = C("EIDOLON.TileCriteria.NoMatches", "No variants match this filter."), b.appendChild(w);
    }
  else {
    const w = document.createElement("p");
    w.classList.add("notes"), w.textContent = C("EIDOLON.TileCriteria.NoVariants", "No MATT variants found"), b.appendChild(w);
  }
  return r.appendChild(b), r;
}
u(xy, "renderTreePanel");
function Xe(t) {
  const { section: e, state: n } = t, i = nd(n);
  fy(t), e.replaceChildren();
  const r = /* @__PURE__ */ u(async () => {
    try {
      const s = nd(n);
      if (s.errors.length) {
        n.status = {
          mode: "error",
          message: C(
            "EIDOLON.TileCriteria.ConflictSaveBlocked",
            `Resolve ${s.errors.length} conflict(s) before saving tile criteria rules.`
          )
        }, Xe(t);
        return;
      }
      const a = wy(n);
      if (!a) {
        n.status = {
          mode: "error",
          message: C("EIDOLON.TileCriteria.Invalid", "Invalid rules. Select valid target variants.")
        }, Xe(t);
        return;
      }
      await td(t.tile, a);
      const l = n.filterQuery, c = n.filterMode, d = n.selectedFileIndex;
      t.state = ic(t.tile), t.state.filterQuery = l, t.state.filterMode = c, Number.isInteger(d) && (t.state.selectedFileIndex = d), t.state.status = {
        mode: "ready",
        message: C("EIDOLON.TileCriteria.Saved", "Tile criteria rules saved.")
      }, Xe(t), id(t);
    } catch (s) {
      console.error(`${ne} | Failed to save tile criteria`, s), n.status = {
        mode: "error",
        message: (s == null ? void 0 : s.message) ?? "Failed to save tile criteria rules."
      }, Xe(t);
    }
  }, "handleSave"), o = /* @__PURE__ */ u(async () => {
    try {
      await td(t.tile, null);
      const s = n.filterQuery, a = n.filterMode, l = n.selectedFileIndex;
      t.state = ic(t.tile), t.state.filterQuery = s, t.state.filterMode = a, Number.isInteger(l) && (t.state.selectedFileIndex = l), t.state.status = {
        mode: "ready",
        message: C("EIDOLON.TileCriteria.Cleared", "Tile criteria rules cleared.")
      }, Xe(t), id(t);
    } catch (s) {
      console.error(`${ne} | Failed to clear tile criteria`, s), n.status = {
        mode: "error",
        message: (s == null ? void 0 : s.message) ?? "Failed to clear tile criteria rules."
      }, Xe(t);
    }
  }, "handleClear");
  if (e.appendChild(xy(n, t, i, {
    onSave: r,
    onClear: o
  })), i.errors.length || i.warnings.length) {
    const s = document.createElement("section");
    s.classList.add("eidolon-tile-criteria__conflicts");
    const a = document.createElement("p");
    a.classList.add("eidolon-tile-criteria__conflict-summary", "notes"), i.errors.length ? (a.dataset.mode = "error", a.textContent = C(
      "EIDOLON.TileCriteria.ConflictSummary",
      `${i.errors.length} conflict(s) must be resolved before saving${i.warnings.length ? ` (${i.warnings.length} warning(s))` : ""}.`
    )) : (a.dataset.mode = "warning", a.textContent = C(
      "EIDOLON.TileCriteria.WarningSummary",
      `${i.warnings.length} potential issue(s) detected.`
    )), s.appendChild(a);
    const l = document.createElement("p");
    l.classList.add("eidolon-tile-criteria__conflict-hint", "notes"), l.textContent = C(
      "EIDOLON.TileCriteria.ConflictHint",
      "Files involved in clashes are marked in red with a warning icon."
    ), s.appendChild(l), e.appendChild(s);
  }
  if (n.status.mode === "error" || n.status.mode === "warning") {
    const s = document.createElement("p");
    s.classList.add("eidolon-tile-criteria__status", "notes"), s.dataset.mode = n.status.mode, s.textContent = n.status.message, e.appendChild(s);
  }
}
u(Xe, "renderController");
function _y(t, e = null) {
  const n = document.createElement("section");
  n.classList.add("eidolon-tile-criteria");
  const i = ic(t);
  dy(i, uy(e));
  const r = {
    app: e,
    tile: t,
    section: n,
    state: i
  };
  return Xe(r), r;
}
u(_y, "createController");
function Ny(t, e) {
  return nu(
    t,
    e,
    nc,
    C("EIDOLON.TileCriteria.TabLabel", "Criteria"),
    cy
  );
}
u(Ny, "ensureTileCriteriaTab");
function $y() {
  Hooks.on("renderTileConfig", (t, e) => {
    var l, c, d, h;
    const n = qe(e);
    if (!n) return;
    const i = hy(t);
    if (!i) return;
    if ((l = n.querySelector(".eidolon-tile-criteria")) == null || l.remove(), !wa()) {
      (c = n.querySelector(`.item[data-tab='${nc}']`)) == null || c.remove(), (d = n.querySelector(`.tab[data-tab='${nc}']`)) == null || d.remove();
      return;
    }
    const r = _y(i, t), o = Ny(t, n);
    if (o instanceof HTMLElement) {
      o.replaceChildren(r.section), (h = t.setPosition) == null || h.call(t, { height: "auto" });
      return;
    }
    const s = (t == null ? void 0 : t.form) instanceof HTMLFormElement ? t.form : n instanceof HTMLFormElement ? n : n.querySelector("form");
    if (!(s instanceof HTMLFormElement)) return;
    const a = s.querySelector("button[type='submit']");
    a != null && a.parentElement ? a.parentElement.insertAdjacentElement("beforebegin", r.section) : s.appendChild(r.section);
  });
}
u($y, "registerTileCriteriaConfigControls");
const Fy = ["Checkbox", "Tile", "Settings", "Toggleable Lights"], Dy = [
  "Checkbox",
  "Tile",
  "Settings",
  "Toggleable Lights",
  "Checked",
  "Unchecked",
  "Individual"
];
function Py() {
  if (!globalThis.Tagger) return [];
  const t = Tagger.getByTag(Fy) ?? [], e = [];
  for (const n of t) {
    if (n.getFlag("monks-active-tiles", "variables.state") !== "unchecked") continue;
    const i = (Tagger.getTags(n) ?? []).filter((s) => !Dy.includes(s)), r = (Tagger.getByTag("Disable Automation") ?? []).concat(Tagger.getByTag("Settings") ?? []), o = Tagger.getByTag(i, { ignore: r }) ?? [];
    for (const s of o)
      s != null && s._id && e.push(s._id);
  }
  return e;
}
u(Py, "buildLightControlsMap");
function Ry() {
  rh(Py);
}
u(Ry, "registerCheckboxLightProvider");
function Hy(t) {
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
u(Hy, "toList");
function qy(t, e) {
  const n = t == null ? void 0 : t.tools;
  return Array.isArray(n) ? n.some((i) => (i == null ? void 0 : i.name) === e) : n instanceof Map ? n.has(e) : n && typeof n == "object" ? e in n ? !0 : Object.values(n).some((i) => (i == null ? void 0 : i.name) === e) : !1;
}
u(qy, "hasTool");
function jy(t, e) {
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
u(jy, "addTool");
function By() {
  Hooks.on("getSceneControlButtons", (t) => {
    var i;
    const e = Hy(t);
    if (!e.length) return;
    const n = e.find((r) => (r == null ? void 0 : r.name) === "tiles") ?? e.find((r) => (r == null ? void 0 : r.name) === "tokens" || (r == null ? void 0 : r.name) === "token") ?? e[0];
    n && (qy(n, "eidolonCriteriaSwitcher") || jy(n, {
      name: "eidolonCriteriaSwitcher",
      title: "Criteria Switcher",
      icon: "fa-solid fa-sliders",
      button: !0,
      toggle: !1,
      visible: Ta(((i = game.scenes) == null ? void 0 : i.viewed) ?? null),
      onClick: /* @__PURE__ */ u(() => tu(), "onClick")
    }));
  });
}
u(By, "registerSceneControlButton");
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
u(Po, "hasOwnPath");
function Uy() {
  const t = /* @__PURE__ */ u((i, r = null) => {
    i && Sp(i, r);
  }, "invalidateTileScene"), e = /* @__PURE__ */ u((i, r = null) => {
    i && Pp(i, r);
  }, "invalidatePlaceableScene");
  Hooks.on("createTile", (i) => {
    t((i == null ? void 0 : i.parent) ?? null, i ?? null);
  }), Hooks.on("deleteTile", (i) => {
    t((i == null ? void 0 : i.parent) ?? null, i ?? null);
  }), Hooks.on("updateTile", (i, r) => {
    (Po(r, `flags.${ne}.tileCriteria`) || Po(r, `flags.${ne}.fileIndex`)) && t((i == null ? void 0 : i.parent) ?? null, i ?? null);
  });
  const n = /* @__PURE__ */ u((i) => {
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
u(Uy, "registerCriteriaCacheInvalidationHooks");
function Vy() {
  Vp(), Ry(), By(), $y(), Uy(), Hooks.once("init", () => {
    var t, e;
    (e = (t = game.keybindings) == null ? void 0 : t.register) == null || e.call(t, ne, "toggleCriteriaSwitcher", {
      name: "Toggle Criteria Switcher",
      hint: "Open or close the criteria switcher window for live scene state updates.",
      editable: [{ key: "KeyM", modifiers: ["Alt"] }],
      onDown: /* @__PURE__ */ u(() => {
        var n, i, r;
        return Ta(((n = game.scenes) == null ? void 0 : n.viewed) ?? null) ? (tu(), !0) : ((r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "You do not have permission to manage scene criteria."), !0);
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
    t && (t.api || (t.api = {}), t.api.criteria = Zp, console.log(`${ne} | Criteria engine API registered`));
  });
}
u(Vy, "registerCriteriaEngineHooks");
Vy();
const Qo = /* @__PURE__ */ new WeakMap(), Ro = /* @__PURE__ */ new WeakMap(), we = "__eidolon_default__";
function Gy() {
  Hooks.on("renderAmbientLightConfig", Wy), D("LightCriteria | AmbientLightConfig controls registered");
}
u(Gy, "registerAmbientLightCriteriaControls");
function Wy(t, e) {
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
    zy(t, i);
  } catch (i) {
    console.error("eidolon-utilities | Failed to enhance AmbientLightConfig UI", i);
  } finally {
    zn();
  }
}
u(Wy, "handleAmbientLightConfigRender");
function zy(t, e) {
  var Er, ai, Sr, ue, Cn;
  const n = (t == null ? void 0 : t.form) instanceof HTMLFormElement ? t.form : e instanceof HTMLFormElement ? e : (Er = e == null ? void 0 : e.closest) == null ? void 0 : Er.call(e, "form");
  if (!(n instanceof HTMLFormElement)) return;
  const i = n.querySelector(".window-content");
  if (!(i instanceof HTMLElement)) return;
  const r = Lh(t);
  if (!r) return;
  const o = gb(r);
  D("LightCriteria | Resolved ambient light", {
    sheetId: (r == null ? void 0 : r.id) ?? null,
    persistedId: (o == null ? void 0 : o.id) ?? null,
    sameRef: r === o
  });
  const s = (o == null ? void 0 : o.parent) ?? r.parent ?? null, a = s ? Kg(s) : [], l = a.filter(
    (P) => Array.isArray(P == null ? void 0 : P.values) && P.values.length > 0
  ), c = ob(a), d = a.map((P) => typeof (P == null ? void 0 : P.id) == "string" ? P.id : null).filter((P) => !!P), h = o ?? r, f = s ? St(s) : [];
  let m = eh(h);
  const g = Ip(m, f);
  JSON.stringify(g) !== JSON.stringify(m) && (m = g, th(h, g).catch((P) => {
    console.warn("eidolon-utilities | Failed to persist migrated light criteria keys", P);
  })), D("LightCriteria | Loaded mapping state", {
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
  const b = document.createElement("fieldset");
  b.classList.add("eidolon-light-criteria");
  const v = document.createElement("legend");
  v.textContent = C("EIDOLON.LightCriteria.Legend", "Scene Criteria Lighting"), b.appendChild(v);
  const w = document.createElement("p");
  w.classList.add("notes"), w.textContent = C(
    "EIDOLON.LightCriteria.Description",
    "Capture a base lighting state, then map criteria values to lighting configurations."
  ), b.appendChild(w);
  const E = document.createElement("div");
  E.classList.add("eidolon-light-criteria__controls");
  const S = document.createElement("button");
  S.type = "button", S.dataset.action = "make-default", S.classList.add("eidolon-light-criteria__button"), S.textContent = C(
    "EIDOLON.LightCriteria.SetBase",
    "Set Base"
  ), E.appendChild(S);
  const I = document.createElement("button");
  I.type = "button", I.dataset.action = "create-mapping", I.classList.add("eidolon-light-criteria__button"), I.textContent = C(
    "EIDOLON.LightCriteria.CreateMapping",
    "Add Criteria Mapping"
  ), I.setAttribute("aria-expanded", "false"), E.appendChild(I), b.appendChild(E);
  const k = document.createElement("p");
  k.classList.add("notes", "eidolon-light-criteria__status"), b.appendChild(k);
  const M = document.createElement("div");
  M.classList.add("eidolon-light-criteria__switcher");
  const $ = document.createElement("label");
  $.classList.add("eidolon-light-criteria__switcher-label");
  const N = `${(t == null ? void 0 : t.id) ?? (r == null ? void 0 : r.id) ?? "eidolon-light"}-mapping-select`;
  $.htmlFor = N, $.textContent = C("EIDOLON.LightCriteria.SelectLabel", "Criteria Mapping"), M.appendChild($);
  const x = document.createElement("details");
  x.classList.add("eidolon-light-criteria__filter-details");
  const F = document.createElement("summary");
  F.classList.add("eidolon-light-criteria__filter-summary");
  const A = document.createElement("span");
  A.classList.add("eidolon-light-criteria__filter-summary-label"), A.textContent = C(
    "EIDOLON.LightCriteria.FilterHeading",
    "Filter mappings"
  ), F.appendChild(A);
  const R = document.createElement("span");
  R.classList.add("eidolon-light-criteria__filter-meta"), F.appendChild(R), x.appendChild(F);
  const j = document.createElement("div");
  j.classList.add("eidolon-light-criteria__filter-panel");
  const B = document.createElement("div");
  B.classList.add("eidolon-light-criteria__filter-grid");
  for (const P of l) {
    const W = document.createElement("label");
    W.classList.add("eidolon-light-criteria__filter");
    const Z = document.createElement("span");
    Z.classList.add("eidolon-light-criteria__filter-name"), Z.textContent = (Sr = (ai = P.name) == null ? void 0 : ai.trim) != null && Sr.call(ai) ? P.name.trim() : C("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), W.appendChild(Z);
    const ee = document.createElement("select");
    ee.dataset.filterCategoryId = P.id, ee.classList.add("eidolon-light-criteria__filter-select");
    const ie = document.createElement("option");
    ie.value = "", ie.textContent = C("EIDOLON.LightCriteria.FilterAny", "Any"), ee.appendChild(ie);
    for (const he of P.values) {
      const me = document.createElement("option");
      me.value = he, me.textContent = he, ee.appendChild(me);
    }
    W.appendChild(ee), B.appendChild(W);
  }
  j.appendChild(B);
  const H = document.createElement("div");
  H.classList.add("eidolon-light-criteria__filter-actions");
  const V = document.createElement("button");
  V.type = "button", V.dataset.action = "clear-mapping-filters", V.classList.add("eidolon-light-criteria__button", "secondary", "compact"), V.textContent = C("EIDOLON.LightCriteria.ClearFilters", "Clear Filters"), H.appendChild(V), j.appendChild(H), x.appendChild(j), x.hidden = l.length === 0, M.appendChild(x);
  const Y = document.createElement("div");
  Y.classList.add("eidolon-light-criteria__switcher-controls"), M.appendChild(Y);
  const oe = document.createElement("select");
  oe.id = N, oe.classList.add("eidolon-light-criteria__select"), oe.dataset.action = "select-mapping", Y.appendChild(oe);
  const J = document.createElement("button");
  J.type = "button", J.dataset.action = "apply-selected-mapping", J.classList.add("eidolon-light-criteria__button", "secondary"), J.textContent = C("EIDOLON.LightCriteria.ApplyButton", "Apply"), Y.appendChild(J);
  const te = document.createElement("details");
  te.classList.add("eidolon-light-criteria__menu"), te.dataset.action = "mapping-actions-menu";
  const an = document.createElement("summary");
  an.classList.add("eidolon-light-criteria__menu-toggle"), an.innerHTML = '<i class="fa-solid fa-ellipsis-vertical" inert=""></i>', an.setAttribute(
    "aria-label",
    C("EIDOLON.LightCriteria.MoreActions", "More actions")
  ), an.dataset.tooltip = C("EIDOLON.LightCriteria.MoreActions", "More actions"), te.appendChild(an);
  const Ct = document.createElement("div");
  Ct.classList.add("eidolon-light-criteria__menu-list"), te.appendChild(Ct);
  const je = document.createElement("button");
  je.type = "button", je.dataset.action = "update-selected-mapping", je.classList.add("eidolon-light-criteria__menu-item"), je.textContent = C(
    "EIDOLON.LightCriteria.UpdateSelected",
    "Save current config to selected"
  ), Ct.appendChild(je);
  const lt = document.createElement("button");
  lt.type = "button", lt.dataset.action = "edit-selected-mapping-criteria", lt.classList.add("eidolon-light-criteria__menu-item"), lt.textContent = C(
    "EIDOLON.LightCriteria.EditSelectedCriteria",
    "Edit selected mapping criteria"
  ), Ct.appendChild(lt);
  const ct = document.createElement("button");
  ct.type = "button", ct.dataset.action = "remove-selected-mapping", ct.classList.add("eidolon-light-criteria__menu-item", "danger"), ct.textContent = C(
    "EIDOLON.LightCriteria.RemoveSelected",
    "Delete selected mapping"
  ), Ct.appendChild(ct), Y.appendChild(te);
  const oi = document.createElement("div");
  oi.classList.add("eidolon-light-criteria-main-switcher"), oi.appendChild(M);
  const Fe = document.createElement("p");
  if (Fe.classList.add("notes", "eidolon-light-criteria-main-switcher__empty"), Fe.textContent = C(
    "EIDOLON.LightCriteria.ActiveRequiresBase",
    "Set Base Lighting to enable mapping selection and actions."
  ), oi.appendChild(Fe), a.length === 0) {
    const P = document.createElement("p");
    P.classList.add("notification", "warning", "eidolon-light-criteria__warning"), P.textContent = C(
      "EIDOLON.LightCriteria.NoCategoriesWarning",
      "This scene has no criteria configured. Add criteria under Scene -> Criteria to enable criteria-driven lighting."
    ), b.appendChild(P);
  } else if (l.length === 0) {
    const P = document.createElement("p");
    P.classList.add("notification", "warning", "eidolon-light-criteria__warning"), P.textContent = C(
      "EIDOLON.LightCriteria.NoValuesWarning",
      "Criteria exist, but none define selectable values. Add values in Scene -> Criteria."
    ), b.appendChild(P);
  }
  const xe = document.createElement("div");
  xe.classList.add("eidolon-light-criteria__creation"), xe.dataset.section = "creation", xe.hidden = !0;
  const qi = document.createElement("p");
  qi.classList.add("notes"), qi.textContent = C(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ), xe.appendChild(qi);
  const ln = document.createElement("div");
  ln.classList.add("eidolon-light-criteria__category-list"), xe.appendChild(ln);
  for (const P of l) {
    const W = document.createElement("label");
    W.classList.add("eidolon-light-criteria__category");
    const Z = document.createElement("span");
    Z.classList.add("eidolon-light-criteria__category-name"), Z.textContent = (Cn = (ue = P.name) == null ? void 0 : ue.trim) != null && Cn.call(ue) ? P.name.trim() : C("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), W.appendChild(Z);
    const ee = document.createElement("select");
    ee.dataset.categoryId = P.id, ee.classList.add("eidolon-light-criteria__category-select");
    const ie = document.createElement("option");
    ie.value = "", ie.textContent = C(
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
  ut.type = "button", ut.dataset.action = "save-mapping", ut.classList.add("eidolon-light-criteria__button", "primary"), ut.textContent = C(
    "EIDOLON.LightCriteria.SaveMapping",
    "Save Mapping"
  ), si.appendChild(ut);
  const cn = document.createElement("button");
  cn.type = "button", cn.dataset.action = "cancel-create", cn.classList.add("eidolon-light-criteria__button", "secondary"), cn.textContent = C(
    "EIDOLON.LightCriteria.Cancel",
    "Cancel"
  ), si.appendChild(cn), xe.appendChild(si), b.appendChild(xe), i.prepend(oi), b.hidden = !0, Xy(t, {
    fieldset: b,
    homeContainer: i
  }), requestAnimationFrame(() => {
    var P;
    (P = t.setPosition) == null || P.call(t, { height: "auto" });
  });
  let q = m;
  di({ switcher: M, emptyState: Fe, state: q }), ci(k, q), Ir(I, {
    state: q,
    hasCategories: l.length > 0
  }), D("LightCriteria | Controls injected", {
    sceneId: (s == null ? void 0 : s.id) ?? null,
    lightId: (r == null ? void 0 : r.id) ?? null,
    hasBase: !!(q != null && q.base),
    mappingCount: Array.isArray(q == null ? void 0 : q.mappings) ? q.mappings.length : 0,
    categories: l.length
  });
  const Mo = db(q), Q = {
    restoreConfig: null,
    app: t,
    selectedMapping: Mo,
    editorMode: "create",
    editingMappingId: null,
    mappingFilters: {}
  };
  Qo.set(b, Q);
  const Tt = /* @__PURE__ */ u(() => {
    te.open = !1;
  }, "closeActionsMenu");
  an.addEventListener("click", (P) => {
    te.classList.contains("is-disabled") && (P.preventDefault(), Tt());
  });
  const De = /* @__PURE__ */ u((P = Q.selectedMapping) => {
    const W = sb(B), Z = Array.isArray(q == null ? void 0 : q.mappings) ? q.mappings : [], ee = lb(Z, W), ie = Object.keys(W).length;
    Q.mappingFilters = W, V.disabled = ie === 0, cb(R, {
      totalCount: Z.length,
      visibleCount: ee.length,
      hasFilters: ie > 0,
      activeFilterCount: ie
    }), x.classList.toggle("has-active-filters", ie > 0), ub(oe, q, c, P, {
      mappings: ee,
      categoryOrder: d
    }), Q.selectedMapping = oe.value ?? "", Ja({
      mappingSelect: oe,
      applyMappingButton: J,
      updateMappingButton: je,
      editCriteriaButton: lt,
      removeMappingButton: ct,
      actionsMenu: te,
      state: q
    }), te.classList.contains("is-disabled") && Tt();
  }, "refreshMappingSelector");
  B.querySelectorAll("select[data-filter-category-id]").forEach((P) => {
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
    ab(B);
    const P = Q.selectedMapping;
    De(P), x.open = !1, Q.selectedMapping !== P && Qa(
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
      updateMappingButton: je,
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
  const wr = /* @__PURE__ */ u(async () => {
    var ee, ie, he, me, dt, Tn, ft, Ln, ve, In, On, Wt, li, Cr;
    const P = oe.value ?? "";
    if (!P) {
      (ie = (ee = ui.notifications) == null ? void 0 : ee.warn) == null || ie.call(
        ee,
        C(
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
          C(
            "EIDOLON.LightCriteria.BaseUnavailable",
            "Set a base lighting state before applying it."
          )
        );
        return;
      }
      Ho(b, xe, I), es(t, n, q.base), q = await Hr(o ?? r, {
        mappingId: we,
        categories: null,
        updatedAt: Date.now()
      }), Q.selectedMapping = we, De(Q.selectedMapping), ci(k, q), di({ switcher: M, emptyState: Fe, state: q }), Ir(I, {
        state: q,
        hasCategories: l.length > 0
      }), od(n, {
        mappingId: we,
        color: ((Tn = (dt = q.base) == null ? void 0 : dt.config) == null ? void 0 : Tn.color) ?? null
      }), (Ln = (ft = ui.notifications) == null ? void 0 : ft.info) == null || Ln.call(
        ft,
        C(
          "EIDOLON.LightCriteria.BaseApplied",
          "Applied the base lighting state to the form."
        )
      ), Tt();
      return;
    }
    const W = Array.isArray(q == null ? void 0 : q.mappings) && q.mappings.length ? q.mappings.find((ji) => (ji == null ? void 0 : ji.id) === P) : null;
    if (!W) {
      (In = (ve = ui.notifications) == null ? void 0 : ve.warn) == null || In.call(
        ve,
        C(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      ), Q.selectedMapping = "", De(Q.selectedMapping);
      return;
    }
    Ho(b, xe, I), es(t, n, W.config), q = await Hr(o ?? r, {
      mappingId: W.id,
      categories: W.categories,
      updatedAt: Date.now()
    }), Q.selectedMapping = W.id, De(Q.selectedMapping), ci(k, q), di({ switcher: M, emptyState: Fe, state: q }), Ir(I, {
      state: q,
      hasCategories: l.length > 0
    }), od(n, {
      mappingId: W.id,
      color: ((Wt = (On = W.config) == null ? void 0 : On.config) == null ? void 0 : Wt.color) ?? null
    });
    const Z = ir(W, c, d);
    (Cr = (li = ui.notifications) == null ? void 0 : li.info) == null || Cr.call(
      li,
      C(
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
  const xo = /* @__PURE__ */ u(async () => {
    var W, Z, ee, ie, he, me, dt, Tn, ft, Ln, ve, In, On, Wt, li, Cr, ji, _o, Au, No, Mu;
    const P = Q.selectedMapping;
    if (!P) {
      (Z = (W = ui.notifications) == null ? void 0 : W.warn) == null || Z.call(
        W,
        C(
          "EIDOLON.LightCriteria.SelectMappingWarning",
          "Choose a criteria mapping before applying."
        )
      );
      return;
    }
    je.disabled = !0;
    try {
      const Ze = Zo(t, o);
      if (P === we)
        q = await Ku(o ?? r, Ze), D("LightCriteria | Base lighting updated", {
          lightId: ((ee = o ?? r) == null ? void 0 : ee.id) ?? null,
          configColor: ((ie = Ze == null ? void 0 : Ze.config) == null ? void 0 : ie.color) ?? null
        }), (me = (he = ui.notifications) == null ? void 0 : he.info) == null || me.call(
          he,
          C(
            "EIDOLON.LightCriteria.BaseUpdated",
            "Updated the base lighting state with the current configuration."
          )
        ), Q.selectedMapping = we;
      else {
        const Bi = qr(q, P);
        if (!Bi) {
          (Tn = (dt = ui.notifications) == null ? void 0 : dt.warn) == null || Tn.call(
            dt,
            C(
              "EIDOLON.LightCriteria.MappingUnavailable",
              "The selected criteria mapping is no longer available."
            )
          ), Q.selectedMapping = "", De(Q.selectedMapping);
          return;
        }
        q = await Xu(
          o ?? r,
          Bi.categories,
          Ze,
          { label: Bi.label ?? null }
        ), D("LightCriteria | Mapping updated", {
          mappingId: P,
          hasColor: !!((ft = Ze == null ? void 0 : Ze.config) != null && ft.color),
          stored: Array.isArray(q == null ? void 0 : q.mappings) ? ((Ln = q.mappings.find((Ra) => (Ra == null ? void 0 : Ra.id) === P)) == null ? void 0 : Ln.config) ?? null : null,
          persisted: (In = (ve = o ?? r) == null ? void 0 : ve.getFlag) == null ? void 0 : In.call(ve, Pr, Rr)
        });
        const Tr = qr(q, P), ag = ir(Tr || Bi, c, d);
        D("LightCriteria | Mapping updated", {
          mappingId: P,
          categories: Bi.categories,
          updatedColor: ((On = Ze == null ? void 0 : Ze.config) == null ? void 0 : On.color) ?? null,
          storedColor: ((li = (Wt = Tr == null ? void 0 : Tr.config) == null ? void 0 : Wt.config) == null ? void 0 : li.color) ?? ((ji = (Cr = Bi.config) == null ? void 0 : Cr.config) == null ? void 0 : ji.color) ?? null
        }), (Au = (_o = ui.notifications) == null ? void 0 : _o.info) == null || Au.call(
          _o,
          C(
            "EIDOLON.LightCriteria.MappingUpdated",
            "Saved changes to mapping: {label}"
          ).replace("{label}", ag)
        ), Q.selectedMapping = P;
      }
      ci(k, q), di({ switcher: M, emptyState: Fe, state: q }), Ir(I, {
        state: q,
        hasCategories: l.length > 0
      }), De(Q.selectedMapping), Tt();
    } catch (Ze) {
      console.error("eidolon-utilities | Failed to update light criteria mapping", Ze), (Mu = (No = ui.notifications) == null ? void 0 : No.error) == null || Mu.call(
        No,
        C(
          "EIDOLON.LightCriteria.MappingUpdateError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      je.disabled = !1, Ja({
        mappingSelect: oe,
        applyMappingButton: J,
        updateMappingButton: je,
        editCriteriaButton: lt,
        removeMappingButton: ct,
        actionsMenu: te,
        state: q
      });
    }
  }, "updateSelectedMapping");
  je.addEventListener("click", () => {
    xo();
  }), De(Q.selectedMapping), S.addEventListener("click", async () => {
    var P, W, Z, ee, ie, he;
    S.disabled = !0;
    try {
      const me = Zo(t, o);
      q = await Ku(o ?? r, me), D("LightCriteria | Base lighting stored", {
        lightId: ((P = o ?? r) == null ? void 0 : P.id) ?? null,
        configColor: ((W = me == null ? void 0 : me.config) == null ? void 0 : W.color) ?? null
      }), (ee = (Z = ui.notifications) == null ? void 0 : Z.info) == null || ee.call(
        Z,
        C(
          "EIDOLON.LightCriteria.BaseStored",
          "Saved the current configuration as the base lighting state."
        )
      ), ci(k, q), di({ switcher: M, emptyState: Fe, state: q }), Ir(I, {
        state: q,
        hasCategories: l.length > 0
      }), Q.selectedMapping = we, De(Q.selectedMapping);
    } catch (me) {
      console.error("eidolon-utilities | Failed to store base light criteria state", me), (he = (ie = ui.notifications) == null ? void 0 : ie.error) == null || he.call(
        ie,
        C(
          "EIDOLON.LightCriteria.BaseError",
          "Failed to save the base lighting state. Check the console for details."
        )
      );
    } finally {
      S.disabled = !1;
    }
  }), I.addEventListener("click", () => {
    var W, Z, ee, ie;
    if (!(q != null && q.base)) {
      (Z = (W = ui.notifications) == null ? void 0 : W.warn) == null || Z.call(
        W,
        C(
          "EIDOLON.LightCriteria.RequiresBase",
          "Set a base lighting state before adding criteria mappings."
        )
      );
      return;
    }
    if (l.length === 0) {
      (ie = (ee = ui.notifications) == null ? void 0 : ee.warn) == null || ie.call(
        ee,
        C(
          "EIDOLON.LightCriteria.NoCategoriesAvailable",
          "Add scene criteria with values in the Scene configuration before creating mappings."
        )
      );
      return;
    }
    const P = Qo.get(b);
    rd({
      app: t,
      fieldset: b,
      createButton: I,
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
        C(
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
        C(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      );
      return;
    }
    Tt(), Th(t, { fieldset: b, homeContainer: i }), rd({
      app: t,
      fieldset: b,
      createButton: I,
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
    const P = mb(ln);
    if (!P) {
      (Z = (W = ui.notifications) == null ? void 0 : W.warn) == null || Z.call(
        W,
        C(
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
        const On = sc(q, P);
        let Wt = !1;
        if (On && On !== Q.editingMappingId && (Wt = await Yy(), !Wt)) {
          ut.disabled = !1;
          return;
        }
        q = await Cp(
          o ?? r,
          Q.editingMappingId,
          P,
          ve,
          { replaceExisting: Wt }
        ), D("LightCriteria | Mapping criteria retargeted", {
          mappingId: Q.editingMappingId,
          categories: P,
          replaced: Wt,
          configColor: ((ee = ve == null ? void 0 : ve.config) == null ? void 0 : ee.color) ?? null
        }), (he = (ie = ui.notifications) == null ? void 0 : ie.info) == null || he.call(
          ie,
          C(
            "EIDOLON.LightCriteria.MappingCriteriaUpdated",
            "Updated mapping criteria for the selected mapping."
          )
        );
      } else
        q = await Xu(
          o ?? r,
          P,
          ve,
          {}
        ), D("LightCriteria | Mapping saved from editor", {
          categories: P,
          configColor: ((me = ve == null ? void 0 : ve.config) == null ? void 0 : me.color) ?? null
        }), (Tn = (dt = ui.notifications) == null ? void 0 : dt.info) == null || Tn.call(
          dt,
          C(
            "EIDOLON.LightCriteria.MappingSaved",
            "Updated lighting mapping for the selected scene criteria."
          )
        );
      ci(k, q), di({ switcher: M, emptyState: Fe, state: q });
      const In = sc(q, P);
      In && (Q.selectedMapping = In), De(Q.selectedMapping), Ho(b, xe, I), Tt();
    } catch (ve) {
      console.error("eidolon-utilities | Failed to persist light criteria mapping", ve), (Ln = (ft = ui.notifications) == null ? void 0 : ft.error) == null || Ln.call(
        ft,
        C(
          "EIDOLON.LightCriteria.MappingError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      ut.disabled = !1;
    }
  }), cn.addEventListener("click", () => {
    const P = Qo.get(b);
    P != null && P.restoreConfig && es(t, n, P.restoreConfig), Ho(b, xe, I);
  }), ct.addEventListener("click", async () => {
    var Z, ee;
    const P = Q.selectedMapping;
    !P || P === we || !await Ky() || (q = await Tp(o ?? r, P), Q.selectedMapping = "", ci(k, q), di({ switcher: M, emptyState: Fe, state: q }), De(Q.selectedMapping), Tt(), (ee = (Z = ui.notifications) == null ? void 0 : Z.info) == null || ee.call(
      Z,
      C("EIDOLON.LightCriteria.MappingRemoved", "Removed selected mapping.")
    ));
  });
}
u(zy, "enhanceAmbientLightConfig");
function rd({
  app: t,
  fieldset: e,
  createButton: n,
  creationSection: i,
  categoryList: r,
  form: o,
  persistedLight: s,
  stateEntry: a,
  mode: l,
  mapping: c,
  preloadConfig: d
}) {
  a && (a.restoreConfig = Zo(t, s), a.editorMode = l, a.editingMappingId = l === "retarget" ? (c == null ? void 0 : c.id) ?? null : null), d && es(t, o, d), l === "retarget" && (c != null && c.categories) ? hb(r, c.categories) : fb(r);
  const h = i.querySelector("p.notes");
  h instanceof HTMLElement && (h.textContent = l === "retarget" ? C(
    "EIDOLON.LightCriteria.EditCriteriaDescription",
    "Adjust criteria values for the selected mapping."
  ) : C(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const f = i.querySelector('button[data-action="save-mapping"]');
  f instanceof HTMLButtonElement && (f.textContent = l === "retarget" ? C("EIDOLON.LightCriteria.SaveCriteriaChanges", "Save Criteria Changes") : C("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), i.hidden = !1, n.setAttribute("aria-expanded", "true"), iu(e, i), requestAnimationFrame(() => {
    var m;
    (m = t.setPosition) == null || m.call(t, { height: "auto" });
  });
}
u(rd, "openMappingEditor");
async function Yy() {
  var n, i;
  const t = (i = (n = foundry == null ? void 0 : foundry.applications) == null ? void 0 : n.api) == null ? void 0 : i.DialogV2;
  if (typeof (t == null ? void 0 : t.confirm) == "function")
    return t.confirm({
      window: { title: C("EIDOLON.LightCriteria.ConflictTitle", "Replace Existing Mapping?") },
      content: `<p>${C(
        "EIDOLON.LightCriteria.ConflictBody",
        "A mapping already exists for this criteria combination. Replace it with the edited mapping?"
      )}</p>`,
      rejectClose: !1
    });
  const e = globalThis.Dialog;
  return typeof (e == null ? void 0 : e.confirm) != "function" ? !1 : e.confirm({
    title: C("EIDOLON.LightCriteria.ConflictTitle", "Replace Existing Mapping?"),
    content: `<p>${C(
      "EIDOLON.LightCriteria.ConflictBody",
      "A mapping already exists for this criteria combination. Replace it with the edited mapping?"
    )}</p>`,
    yes: /* @__PURE__ */ u(() => !0, "yes"),
    no: /* @__PURE__ */ u(() => !1, "no"),
    defaultYes: !1
  });
}
u(Yy, "confirmCriteriaConflict");
async function Ky() {
  var n, i;
  const t = (i = (n = foundry == null ? void 0 : foundry.applications) == null ? void 0 : n.api) == null ? void 0 : i.DialogV2;
  if (typeof (t == null ? void 0 : t.confirm) == "function")
    return t.confirm({
      window: { title: C("EIDOLON.LightCriteria.RemoveTitle", "Remove Mapping?") },
      content: `<p>${C(
        "EIDOLON.LightCriteria.RemoveBody",
        "Remove the currently selected mapping? This cannot be undone."
      )}</p>`,
      rejectClose: !1
    });
  const e = globalThis.Dialog;
  return typeof (e == null ? void 0 : e.confirm) != "function" ? !1 : e.confirm({
    title: C("EIDOLON.LightCriteria.RemoveTitle", "Remove Mapping?"),
    content: `<p>${C(
      "EIDOLON.LightCriteria.RemoveBody",
      "Remove the currently selected mapping? This cannot be undone."
    )}</p>`,
    yes: /* @__PURE__ */ u(() => !0, "yes"),
    no: /* @__PURE__ */ u(() => !1, "no"),
    defaultYes: !1
  });
}
u(Ky, "confirmRemoveMapping");
function Xy(t, { fieldset: e, homeContainer: n }) {
  const i = Zy(t, n);
  if (!(i instanceof HTMLElement)) return;
  const r = i.querySelector(".window-header");
  if (!(r instanceof HTMLElement)) return;
  let o = r.querySelector('[data-eidolon-action="open-light-criteria-manager"]');
  if (!(o instanceof HTMLButtonElement)) {
    o = document.createElement("button"), o.type = "button", o.classList.add("header-control", "icon"), o.dataset.eidolonAction = "open-light-criteria-manager", o.dataset.tooltip = C("EIDOLON.LightCriteria.OpenManager", "Open Scene Criteria Lighting"), o.setAttribute("aria-label", C("EIDOLON.LightCriteria.OpenManager", "Open Scene Criteria Lighting")), o.innerHTML = '<i class="fa-solid fa-sliders" inert=""></i>';
    const s = r.querySelector(".window-controls") ?? r, a = s.querySelector('[data-action="toggleControls"]');
    if ((a == null ? void 0 : a.parentElement) === s)
      s.insertBefore(o, a);
    else {
      const l = s.querySelector('[data-action="close"]');
      (l == null ? void 0 : l.parentElement) === s ? s.insertBefore(o, l) : s.appendChild(o);
    }
  }
  o.onclick = (s) => {
    s.preventDefault(), Th(t, { fieldset: e, homeContainer: n });
  };
}
u(Xy, "ensureManagerHeaderButton");
function Th(t, { fieldset: e, homeContainer: n }) {
  var f, m, g;
  const i = Ro.get(t);
  if (i != null && i.rendered) {
    (f = i.bringToTop) == null || f.call(i);
    return;
  }
  const r = /* @__PURE__ */ u((...y) => {
    var w;
    const b = Jy(y), v = (w = b == null ? void 0 : b.querySelector) == null ? void 0 : w.call(b, ".eidolon-light-criteria-manager-host");
    v instanceof HTMLElement && (Qy(e), e.hidden = !1, v.appendChild(e));
  }, "onRender"), o = /* @__PURE__ */ u(() => {
    e.remove(), e.hidden = !0, Ro.delete(t), requestAnimationFrame(() => {
      var y;
      (y = t.setPosition) == null || y.call(t, { height: "auto" });
    });
  }, "onClose"), s = C("EIDOLON.LightCriteria.ManagerTitle", "Scene Criteria Lighting"), a = '<div class="eidolon-light-criteria-manager-host"></div>', l = C("EIDOLON.LightCriteria.Close", "Close"), c = (g = (m = foundry == null ? void 0 : foundry.applications) == null ? void 0 : m.api) == null ? void 0 : g.DialogV2;
  if (typeof (c == null ? void 0 : c.wait) == "function")
    try {
      let y = !1;
      const b = /* @__PURE__ */ u(() => {
        y || (y = !0, o());
      }, "closeOnce");
      Ro.set(t, {
        rendered: !0,
        bringToTop: /* @__PURE__ */ u(() => {
        }, "bringToTop")
      }), c.wait({
        window: { title: s },
        content: a,
        buttons: [{ action: "close", label: l, default: !0 }],
        render: /* @__PURE__ */ u((...v) => r(...v), "render"),
        close: b,
        rejectClose: !1
      }).catch((v) => {
        console.warn("eidolon-utilities | DialogV2 manager failed, falling back to Dialog", v), b();
      });
      return;
    } catch (y) {
      console.warn("eidolon-utilities | DialogV2 manager failed, falling back to Dialog", y), o();
    }
  const d = globalThis.Dialog;
  if (typeof d != "function") return;
  const h = new d(
    {
      title: s,
      content: a,
      buttons: {
        close: {
          label: l
        }
      },
      render: /* @__PURE__ */ u((...y) => r(...y), "render"),
      close: o
    },
    {
      width: 640,
      resizable: !0
    }
  );
  Ro.set(t, h), h.render(!0);
}
u(Th, "openManagerDialog");
function Jy(t) {
  for (const e of t) {
    const n = qe(e);
    if (n) return n;
    const i = qe(e == null ? void 0 : e.element);
    if (i) return i;
  }
  return null;
}
u(Jy, "findDialogRoot");
function Qy(t) {
  if (!(t instanceof HTMLElement) || t.dataset.managerLayout === "true") return;
  t.dataset.managerLayout = "true", t.classList.add("is-manager");
  const e = t.querySelector("legend"), n = t.querySelector("p.notes:not(.eidolon-light-criteria__status)"), i = t.querySelector(".eidolon-light-criteria__controls"), r = t.querySelector(".eidolon-light-criteria__status"), o = t.querySelector(".eidolon-light-criteria__creation"), s = Array.from(t.querySelectorAll(".eidolon-light-criteria__warning")), a = document.createElement("div");
  a.classList.add("eidolon-light-criteria-manager");
  const l = document.createElement("section");
  l.classList.add("eidolon-light-criteria-manager__section", "is-top"), a.appendChild(l);
  const c = document.createElement("section");
  c.classList.add("eidolon-light-criteria-manager__section", "is-bottom"), a.appendChild(c);
  const d = document.createElement("div");
  if (d.classList.add("eidolon-light-criteria-manager__header"), d.textContent = C("EIDOLON.LightCriteria.ManagerHeader", "Base State"), l.appendChild(d), r && l.appendChild(r), i && l.appendChild(i), s.length) {
    const f = document.createElement("div");
    f.classList.add("eidolon-light-criteria-manager__warnings");
    for (const m of s) f.appendChild(m);
    l.appendChild(f);
  }
  const h = document.createElement("div");
  h.classList.add("eidolon-light-criteria-manager__header"), h.textContent = C("EIDOLON.LightCriteria.ManagerAuthoring", "Create or Update Mapping"), c.appendChild(h), o && c.appendChild(o), t.innerHTML = "", e && t.appendChild(e), n && t.appendChild(n), t.appendChild(a), iu(t, o);
}
u(Qy, "applyManagerLayout");
function Zy(t, e) {
  var i;
  const n = qe(t == null ? void 0 : t.element);
  return n || (((i = e == null ? void 0 : e.closest) == null ? void 0 : i.call(e, ".application")) ?? null);
}
u(Zy, "resolveApplicationRoot");
function Ho(t, e, n) {
  const i = Qo.get(t);
  i && (i.restoreConfig = null, i.editorMode = "create", i.editingMappingId = null), e.hidden = !0, n.setAttribute("aria-expanded", "false");
  const r = e.querySelector("p.notes");
  r instanceof HTMLElement && (r.textContent = C(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const o = e.querySelector('button[data-action="save-mapping"]');
  o instanceof HTMLButtonElement && (o.textContent = C("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), iu(t, e), requestAnimationFrame(() => {
    var s, a;
    (a = (s = i == null ? void 0 : i.app) == null ? void 0 : s.setPosition) == null || a.call(s, { height: "auto" });
  });
}
u(Ho, "hideCreationSection");
function ci(t, e) {
  if (!t) return;
  const n = !!(e != null && e.base), i = Array.isArray(e == null ? void 0 : e.mappings) ? e.mappings.length : 0, r = [];
  r.push(
    n ? C(
      "EIDOLON.LightCriteria.StatusBaseSaved",
      "Base lighting saved."
    ) : C(
      "EIDOLON.LightCriteria.StatusBaseMissing",
      "Base lighting not yet saved."
    )
  ), r.push(
    C(
      "EIDOLON.LightCriteria.StatusMappingCount",
      "Mappings: {count}"
    ).replace("{count}", String(i))
  ), t.textContent = r.join(" ");
}
u(ci, "updateStatusLine");
function Ir(t, { state: e, hasCategories: n }) {
  if (!t) return;
  const i = !!(e != null && e.base), r = i && n;
  t.disabled = !r, t.title = r ? "" : i ? C(
    "EIDOLON.LightCriteria.CreateDisabledNoCategories",
    "Add scene criteria with values before creating mappings."
  ) : C(
    "EIDOLON.LightCriteria.CreateDisabledNoBase",
    "Save a base lighting state before creating criteria mappings."
  );
}
u(Ir, "updateCreateButtonState");
function Zo(t, e) {
  var l, c, d;
  const n = e ?? Lh(t);
  if (!n)
    throw new Error("Ambient light document unavailable.");
  const i = Pi(((l = n.toObject) == null ? void 0 : l.call(n)) ?? {});
  if (!i)
    throw new Error("Unable to duplicate ambient light data.");
  const r = (t == null ? void 0 : t.form) instanceof HTMLFormElement ? t.form : null, o = r ? Fg(r) : {}, s = foundry.utils.mergeObject(i, o, {
    inplace: !1,
    performDeletions: !0
  });
  r && (r.querySelectorAll("color-picker[name]").forEach((h) => {
    var v, w;
    const f = h.getAttribute("name");
    if (!f) return;
    const m = typeof h.value == "string" ? h.value : "", g = ((v = h.ui) == null ? void 0 : v.input) ?? ((w = h.querySelector) == null ? void 0 : w.call(h, 'input[type="color"]')), y = (g == null ? void 0 : g.value) ?? "", b = m || y;
    typeof b != "string" || !b || (foundry.utils.setProperty(s, f, b), D("LightCriteria | Captured color-picker value", {
      path: f,
      pickerValue: m,
      swatchValue: y,
      chosenValue: b
    }));
  }), r.querySelectorAll("range-picker[name]").forEach((h) => {
    var I, k;
    const f = h.getAttribute("name");
    if (!f) return;
    const m = h.value !== void 0 && h.value !== null ? String(h.value) : "", g = (I = h.querySelector) == null ? void 0 : I.call(h, 'input[type="range"]'), y = (k = h.querySelector) == null ? void 0 : k.call(h, 'input[type="number"]'), b = g instanceof HTMLInputElement ? g.value : "", v = y instanceof HTMLInputElement ? y.value : "", w = m || v || b;
    if (typeof w != "string" || !w.length) return;
    const E = Number(w), S = Number.isFinite(E) ? E : w;
    foundry.utils.setProperty(s, f, S), D("LightCriteria | Captured range-picker value", {
      path: f,
      elementValue: m,
      numberValue: v,
      rangeValue: b,
      chosenValue: S
    });
  }));
  const a = Pi(s);
  return D("LightCriteria | Captured form config", {
    lightId: (n == null ? void 0 : n.id) ?? null,
    hasColor: !!((c = a == null ? void 0 : a.config) != null && c.color),
    color: ((d = a == null ? void 0 : a.config) == null ? void 0 : d.color) ?? null
  }), a;
}
u(Zo, "captureAmbientLightFormConfig");
function es(t, e, n) {
  if (!n || typeof n != "object") return;
  const i = foundry.utils.flattenObject(n, { safe: !0 });
  for (const [r, o] of Object.entries(i)) {
    const s = e.querySelectorAll(`[name="${r}"]`);
    if (s.length) {
      D("LightCriteria | Applying field", {
        path: r,
        value: o,
        elementCount: s.length
      });
      for (const a of s)
        a instanceof HTMLElement && a.tagName === "COLOR-PICKER" ? tb(a, o) : a instanceof HTMLElement && a.tagName === "RANGE-PICKER" ? nb(a, o) : a instanceof HTMLInputElement ? eb(a, o) : a instanceof HTMLSelectElement ? ib(a, o) : a instanceof HTMLTextAreaElement && rb(a, o);
    }
  }
  requestAnimationFrame(() => {
    var r;
    return (r = t._previewChanges) == null ? void 0 : r.call(t);
  });
}
u(es, "applyConfigToForm");
function eb(t, e, n) {
  const i = t.type;
  if (i === "checkbox") {
    const s = !!e;
    t.checked !== s && (t.checked = s, Bt(t));
    return;
  }
  if (i === "radio") {
    const s = e == null ? "" : String(e), a = t.value === s;
    t.checked !== a && (t.checked = a, a && Bt(t));
    return;
  }
  const r = e == null ? "" : String(e);
  let o = !1;
  t.value !== r && (t.value = r, o = !0), o && Bt(t);
}
u(eb, "applyValueToInput");
function tb(t, e, n) {
  var a, l, c, d, h, f;
  const i = e == null ? "" : String(e);
  let r = !1;
  t.value !== i && (t.value = i, t.setAttribute("value", i), (a = t.ui) != null && a.setValue && t.ui.setValue(i), r = !0);
  const o = ((l = t.ui) == null ? void 0 : l.input) ?? ((c = t.querySelector) == null ? void 0 : c.call(t, 'input[type="color"]'));
  o instanceof HTMLInputElement && o.value !== i && (o.value = i, Bt(o));
  const s = ((d = t.ui) == null ? void 0 : d.text) ?? ((h = t.querySelector) == null ? void 0 : h.call(t, 'input[type="text"]'));
  s instanceof HTMLInputElement && s.value !== i && (s.value = i, Bt(s)), (f = t.ui) != null && f.commit ? t.ui.commit() : (t.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), t.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }))), D("LightCriteria | Color picker applied", {
    value: i,
    pickerValue: t.value ?? null,
    swatchValue: (o == null ? void 0 : o.value) ?? null,
    textValue: (s == null ? void 0 : s.value) ?? null
  }), r && Bt(t);
}
u(tb, "applyValueToColorPicker");
function nb(t, e, n) {
  var c, d;
  const i = e == null ? "" : String(e), r = Number(i), o = Number.isFinite(r) ? r : i;
  let s = !1;
  t.value !== void 0 && t.value !== o && (t.value = o, s = !0), t.getAttribute("value") !== i && (t.setAttribute("value", i), s = !0);
  const a = (c = t.querySelector) == null ? void 0 : c.call(t, 'input[type="range"]');
  a instanceof HTMLInputElement && a.value !== i && (a.value = i, Bt(a));
  const l = (d = t.querySelector) == null ? void 0 : d.call(t, 'input[type="number"]');
  if (l instanceof HTMLInputElement && l.value !== i && (l.value = i, Bt(l)), typeof t.commit == "function")
    try {
      t.commit();
    } catch (h) {
      console.error("eidolon-utilities | range-picker commit failed", h);
    }
  D("LightCriteria | Range picker applied", {
    value: i,
    resolvedValue: o,
    rangeValue: (a == null ? void 0 : a.value) ?? null,
    numberValue: (l == null ? void 0 : l.value) ?? null
  }), s && Bt(t);
}
u(nb, "applyValueToRangePicker");
function ib(t, e, n) {
  const i = e == null ? "" : String(e);
  t.value !== i && (t.value = i, Bt(t));
}
u(ib, "applyValueToSelect");
function rb(t, e, n) {
  const i = e == null ? "" : String(e);
  t.value !== i && (t.value = i, Bt(t));
}
u(rb, "applyValueToTextarea");
function Bt(t) {
  t.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), t.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }));
}
u(Bt, "triggerInputChange");
function Ja({
  mappingSelect: t,
  applyMappingButton: e,
  updateMappingButton: n,
  editCriteriaButton: i,
  removeMappingButton: r,
  actionsMenu: o,
  state: s
}) {
  const a = (t == null ? void 0 : t.value) ?? "", l = !!(s != null && s.base), c = a && a !== we ? !!qr(s, a) : !1;
  if (e instanceof HTMLButtonElement && (a ? a === we ? e.disabled = !l : e.disabled = !c : e.disabled = !0), n instanceof HTMLButtonElement && (a ? a === we ? n.disabled = !1 : n.disabled = !c : n.disabled = !0), i instanceof HTMLButtonElement && (i.disabled = !a || a === we || !c), r instanceof HTMLButtonElement && (r.disabled = !a || a === we || !c), o instanceof HTMLElement) {
    const d = n instanceof HTMLButtonElement && !n.disabled || i instanceof HTMLButtonElement && !i.disabled || r instanceof HTMLButtonElement && !r.disabled;
    o.classList.toggle("is-disabled", !d), !d && "open" in o && (o.open = !1);
  }
}
u(Ja, "syncMappingSwitcherState");
function ob(t) {
  const e = /* @__PURE__ */ new Map();
  for (const n of t) {
    if (!n) continue;
    const i = typeof n.id == "string" ? n.id : null;
    if (!i) continue;
    const r = typeof n.name == "string" && n.name.trim() ? n.name.trim() : C("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category");
    e.has(i) || e.set(i, r);
  }
  return e;
}
u(ob, "buildCategoryNameLookup");
function sb(t) {
  const e = {};
  return t instanceof HTMLElement && t.querySelectorAll("select[data-filter-category-id]").forEach((n) => {
    var o, s;
    const i = n.dataset.filterCategoryId, r = (s = (o = n.value) == null ? void 0 : o.trim) == null ? void 0 : s.call(o);
    !i || !r || (e[i] = r);
  }), e;
}
u(sb, "readMappingFilterSelections");
function ab(t) {
  t instanceof HTMLElement && t.querySelectorAll("select[data-filter-category-id]").forEach((e) => {
    e.value = "";
  });
}
u(ab, "resetMappingFilterSelections");
function lb(t, e) {
  const n = Array.isArray(t) ? t : [], i = Object.entries(e ?? {}).filter(([, r]) => !!r);
  return i.length ? n.filter((r) => {
    if (!r || typeof r != "object") return !1;
    const o = r.categories ?? {};
    for (const [s, a] of i)
      if ((o == null ? void 0 : o[s]) !== a) return !1;
    return !0;
  }) : n.slice();
}
u(lb, "filterMappingsByCriteria");
function cb(t, { totalCount: e = 0, visibleCount: n = 0, hasFilters: i = !1, activeFilterCount: r = 0 } = {}) {
  if (!(t instanceof HTMLElement)) return;
  if (!i) {
    t.textContent = C(
      "EIDOLON.LightCriteria.FilterSummaryAll",
      "All ({count})"
    ).replace("{count}", String(e));
    return;
  }
  const o = C(
    "EIDOLON.LightCriteria.FilterSummaryActive",
    "{active} filters · {visible}/{total}"
  ).replace("{active}", String(r)).replace("{visible}", String(n)).replace("{total}", String(e));
  t.textContent = o;
}
u(cb, "updateMappingFilterMeta");
function ub(t, e, n, i, r = {}) {
  if (!(t instanceof HTMLSelectElement)) return;
  const o = typeof i == "string" ? i : "", s = !!(e != null && e.base), a = Array.isArray(r == null ? void 0 : r.categoryOrder) ? r.categoryOrder : [], l = Array.isArray(r == null ? void 0 : r.mappings) ? r.mappings.slice() : Array.isArray(e == null ? void 0 : e.mappings) ? e.mappings.slice() : [], c = t.value;
  t.innerHTML = "";
  const d = document.createElement("option");
  d.value = "", d.textContent = C(
    "EIDOLON.LightCriteria.SelectPlaceholder",
    "Select a mapping"
  ), d.disabled = s, t.appendChild(d);
  const h = document.createElement("option");
  h.value = we, h.textContent = C(
    "EIDOLON.LightCriteria.BaseOption",
    "Base Lighting"
  ), h.disabled = !s, t.appendChild(h), l.slice().sort((y, b) => {
    var E;
    const v = ir(y, n, a), w = ir(b, n, a);
    return v.localeCompare(w, ((E = game.i18n) == null ? void 0 : E.lang) ?? void 0, {
      sensitivity: "base"
    });
  }).forEach((y) => {
    if (!(y != null && y.id)) return;
    const b = document.createElement("option");
    b.value = y.id, b.textContent = ir(y, n, a), t.appendChild(b);
  });
  const f = new Set(
    Array.from(t.options).filter((y) => !y.disabled).map((y) => y.value)
  ), m = s && c === "" ? "" : c, g = o || (f.has(m) ? m : "");
  g && f.has(g) ? t.value = g : s ? t.value = we : t.value = "";
}
u(ub, "populateMappingSelector");
function ir(t, e, n = []) {
  if (!t || typeof t != "object")
    return C("EIDOLON.LightCriteria.UnnamedMapping", "Unnamed Mapping");
  if (typeof t.label == "string" && t.label.trim())
    return t.label.trim();
  const i = t.categories ?? {}, r = [], o = /* @__PURE__ */ new Set();
  for (const a of n)
    !a || o.has(a) || (r.push(a), o.add(a));
  for (const a of Object.keys(i).sort((l, c) => l.localeCompare(c)))
    o.has(a) || (r.push(a), o.add(a));
  const s = r.map((a) => {
    const l = i == null ? void 0 : i[a];
    if (typeof l != "string" || !l.trim()) return null;
    const c = l.trim();
    return `${e.get(a) ?? C("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category")}=${c}`;
  }).filter(Boolean);
  return s.length === 0 ? C("EIDOLON.LightCriteria.UnnamedMapping", "Unnamed Mapping") : s.join(" | ");
}
u(ir, "formatMappingOptionLabel");
function sc(t, e) {
  if (!t || typeof t != "object" || !Array.isArray(t.mappings)) return null;
  const n = br(e);
  if (!n) return null;
  const i = t.mappings.find((r) => (r == null ? void 0 : r.key) === n);
  return (i == null ? void 0 : i.id) ?? null;
}
u(sc, "findMappingIdByCategories");
function qr(t, e) {
  return !e || !t || typeof t != "object" || !Array.isArray(t.mappings) ? null : t.mappings.find((n) => (n == null ? void 0 : n.id) === e) ?? null;
}
u(qr, "getMappingById");
function db(t) {
  if (!t || typeof t != "object") return "";
  const e = t.current;
  if (e != null && e.mappingId) {
    if (e.mappingId === we)
      return t != null && t.base ? we : "";
    if (Array.isArray(t.mappings) && t.mappings.some((n) => n.id === e.mappingId))
      return e.mappingId;
  }
  if (e != null && e.categories) {
    const n = sc(t, e.categories);
    if (n) return n;
  }
  return "";
}
u(db, "resolveInitialMappingSelection");
function od(t, e = {}) {
  var s, a, l, c;
  if (!(t instanceof HTMLFormElement)) return;
  const n = t.querySelector('color-picker[name="config.color"]'), i = (n == null ? void 0 : n.value) ?? null, r = ((s = n == null ? void 0 : n.ui) == null ? void 0 : s.text) ?? ((a = n == null ? void 0 : n.querySelector) == null ? void 0 : a.call(n, 'input[type="text"]')), o = ((l = n == null ? void 0 : n.ui) == null ? void 0 : l.input) ?? ((c = n == null ? void 0 : n.querySelector) == null ? void 0 : c.call(n, 'input[type="color"]'));
  D("LightCriteria | Color state after apply", {
    ...e,
    textValue: (r == null ? void 0 : r.value) ?? null,
    pickerValue: i,
    swatchValue: (o == null ? void 0 : o.value) ?? null
  });
}
u(od, "logAppliedColorState");
function fb(t) {
  t.querySelectorAll("select[data-category-id]").forEach((e) => {
    e.value = "";
  });
}
u(fb, "resetCategorySelections");
function hb(t, e) {
  const n = e && typeof e == "object" ? e : {};
  t.querySelectorAll("select[data-category-id]").forEach((i) => {
    const r = i.dataset.categoryId;
    if (!r) return;
    const o = n[r];
    i.value = typeof o == "string" ? o : "";
  });
}
u(hb, "setCategorySelections");
function mb(t) {
  const e = {};
  return t.querySelectorAll("select[data-category-id]").forEach((n) => {
    var o, s;
    const i = n.dataset.categoryId, r = (s = (o = n.value) == null ? void 0 : o.trim) == null ? void 0 : s.call(o);
    !i || !r || (e[i] = r);
  }), Object.keys(e).length > 0 ? e : null;
}
u(mb, "readCategorySelections");
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
u(Qa, "persistCurrentSelection");
function iu(t, e) {
  if (!(t instanceof HTMLElement)) return;
  const n = t.querySelector(".eidolon-light-criteria-manager__section.is-bottom");
  n instanceof HTMLElement && (n.hidden = !!(e != null && e.hidden));
}
u(iu, "updateManagerSectionVisibility");
function di({ switcher: t, emptyState: e, state: n }) {
  const i = !!(n != null && n.base);
  t instanceof HTMLElement && (t.hidden = !i), e instanceof HTMLElement && (e.hidden = i);
}
u(di, "updateActiveMappingVisibility");
function Lh(t) {
  const e = (t == null ? void 0 : t.object) ?? (t == null ? void 0 : t.document) ?? null;
  return !(e != null && e.isEmbedded) || e.documentName !== "AmbientLight" ? null : e;
}
u(Lh, "getAmbientLightDocument");
function gb(t) {
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
u(gb, "getPersistedAmbientLightDocument");
function pb() {
  Gy();
}
u(pb, "registerLightCriteriaHooks");
pb();
const ac = /* @__PURE__ */ new Map();
let lc = !1;
function ru(t, e) {
  ac.has(t) && console.warn(`[${L}] Socket handler for type "${t}" already registered, overwriting.`), ac.set(t, e);
}
u(ru, "registerSocketHandler");
function ts(t, e) {
  if (!lc) {
    console.error(`[${L}] Socket not initialized. Call initializeSocket() first.`);
    return;
  }
  game.socket.emit(`module.${L}`, { type: t, payload: e });
}
u(ts, "emitSocket");
function yb() {
  lc || (game.socket.on(`module.${L}`, (t) => {
    const { type: e, payload: n } = t ?? {}, i = ac.get(e);
    i ? i(n) : console.warn(`[${L}] No socket handler for type "${e}"`);
  }), lc = !0, console.log(`[${L}] Socket initialized on channel module.${L}`));
}
u(yb, "initializeSocket");
const Ih = "tween", Oh = "tween-sequence", cc = "tween-sequence-cancel", Ae = Object.freeze({
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
u(Gt, "registerTweenType");
function vr(t) {
  return Cs.get(t);
}
u(vr, "getTweenType");
function bb(t, e = {}) {
  const n = vr(t);
  if (!n)
    throw new Error(`Unknown tween type: "${t}".`);
  return n.validate(e ?? {}), n;
}
u(bb, "validateTweenEntry");
function uc() {
  return [...Cs.keys()];
}
u(uc, "listTweenTypes");
const rr = {
  easeInQuad: /* @__PURE__ */ u((t) => t * t, "easeInQuad"),
  easeOutQuad: /* @__PURE__ */ u((t) => t * (2 - t), "easeOutQuad"),
  easeInOutQuad: /* @__PURE__ */ u((t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t, "easeInOutQuad"),
  easeInCubic: /* @__PURE__ */ u((t) => t * t * t, "easeInCubic"),
  easeOutCubic: /* @__PURE__ */ u((t) => {
    const e = t - 1;
    return e * e * e + 1;
  }, "easeOutCubic"),
  easeInOutCubic: /* @__PURE__ */ u((t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1, "easeInOutCubic"),
  easeOutBounce: /* @__PURE__ */ u((t) => {
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
  easeInBounce: /* @__PURE__ */ u((t) => 1 - rr.easeOutBounce(1 - t), "easeInBounce"),
  easeInOutBounce: /* @__PURE__ */ u((t) => t < 0.5 ? (1 - rr.easeOutBounce(1 - 2 * t)) / 2 : (1 + rr.easeOutBounce(2 * t - 1)) / 2, "easeInOutBounce"),
  easeInElastic: /* @__PURE__ */ u((t) => t === 0 || t === 1 ? t : -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI), "easeInElastic"),
  easeOutElastic: /* @__PURE__ */ u((t) => t === 0 || t === 1 ? t : Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1, "easeOutElastic")
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
u(at, "resolveEasing");
function ou() {
  return ["linear", "easeInOutCosine", ...Object.keys(rr)];
}
u(ou, "listEasingNames");
function Ts(t) {
  return t <= 0.04045 ? t / 12.92 : ((t + 0.055) / 1.055) ** 2.4;
}
u(Ts, "srgbToLinear");
function or(t) {
  return t <= 31308e-7 ? 12.92 * t : 1.055 * t ** (1 / 2.4) - 0.055;
}
u(or, "linearToSrgb");
function sd(t, e, n) {
  const i = 0.4122214708 * t + 0.5363325363 * e + 0.0514459929 * n, r = 0.2119034982 * t + 0.6806995451 * e + 0.1073969566 * n, o = 0.0883024619 * t + 0.2817188376 * e + 0.6299787005 * n, s = Math.cbrt(i), a = Math.cbrt(r), l = Math.cbrt(o);
  return [
    0.2104542553 * s + 0.793617785 * a - 0.0040720468 * l,
    1.9779984951 * s - 2.428592205 * a + 0.4505937099 * l,
    0.0259040371 * s + 0.7827717662 * a - 0.808675766 * l
  ];
}
u(sd, "linearRgbToOklab");
function vb(t, e, n) {
  const i = (t + 0.3963377774 * e + 0.2158037573 * n) ** 3, r = (t - 0.1055613458 * e - 0.0638541728 * n) ** 3, o = (t - 0.0894841775 * e - 1.291485548 * n) ** 3;
  return [
    4.0767416621 * i - 3.3077115913 * r + 0.2309699292 * o,
    -1.2684380046 * i + 2.6097574011 * r - 0.3413193965 * o,
    -0.0041960863 * i - 0.7034186147 * r + 1.707614701 * o
  ];
}
u(vb, "oklabToLinearRgb");
function Ls(t) {
  return [t.r, t.g, t.b];
}
u(Ls, "colorToRgb");
function kh(t, e, n) {
  const i = /* @__PURE__ */ u((o) => Math.max(0, Math.min(1, o)), "clamp"), r = /* @__PURE__ */ u((o) => Math.round(i(o) * 255).toString(16).padStart(2, "0"), "toHex");
  return `#${r(t)}${r(e)}${r(n)}`;
}
u(kh, "rgbToHex");
function wb(t, e, n) {
  if (n <= 0) return t.toHTML();
  if (n >= 1) return e.toHTML();
  const i = foundry.utils.Color, [r, o, s] = t.hsl, [a, l, c] = e.hsl, d = (a - r + 0.5) % 1 - 0.5, h = (r + d * n + 1) % 1, f = o + (l - o) * n, m = s + (c - s) * n;
  return i.fromHSL([h, f, m]).toHTML();
}
u(wb, "interpolateHsl");
function Eb(t, e, n) {
  if (n <= 0) return t.toHTML();
  if (n >= 1) return e.toHTML();
  const [i, r, o] = Ls(t).map(Ts), [s, a, l] = Ls(e).map(Ts), c = or(i + (s - i) * n), d = or(r + (a - r) * n), h = or(o + (l - o) * n);
  return kh(c, d, h);
}
u(Eb, "interpolateRgb");
function Sb(t, e, n) {
  if (n <= 0) return t.toHTML();
  if (n >= 1) return e.toHTML();
  const [i, r, o] = Ls(t).map(Ts), [s, a, l] = Ls(e).map(Ts), [c, d, h] = sd(i, r, o), [f, m, g] = sd(s, a, l), y = 0.02, b = Math.sqrt(d * d + h * h), v = Math.sqrt(m * m + g * g);
  let w, E, S;
  if (b < y || v < y)
    w = c + (f - c) * n, E = d + (m - d) * n, S = h + (g - h) * n;
  else {
    const $ = Math.atan2(h, d);
    let x = Math.atan2(g, m) - $;
    x > Math.PI && (x -= 2 * Math.PI), x < -Math.PI && (x += 2 * Math.PI), w = c + (f - c) * n;
    const F = b + (v - b) * n, A = $ + x * n;
    E = F * Math.cos(A), S = F * Math.sin(A);
  }
  const [I, k, M] = vb(w, E, S);
  return kh(or(I), or(k), or(M));
}
u(Sb, "interpolateOklch");
const dc = {
  hsl: wb,
  rgb: Eb,
  oklch: Sb
};
function su(t = "hsl") {
  return dc[t] ?? dc.hsl;
}
u(su, "getInterpolator");
function dr() {
  return Object.keys(dc);
}
u(dr, "listInterpolationModes");
function Cb(t) {
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
u(Cb, "validate$7");
async function Tb(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { Color: i } = foundry.utils, { uuid: r, toColor: o, toAlpha: s, mode: a = "oklch" } = t, l = Array.isArray(r) ? r : [r];
  if (l.length === 0)
    return console.warn("light-color tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: c = 2e3,
    easing: d = "easeInOutCosine",
    commit: h = !0,
    startEpochMS: f = null,
    signal: m = null
  } = e, g = at(d), y = o != null, b = s != null, v = y ? su(a) : null, w = y ? i.fromString(o) : null;
  if (y && !w.valid) throw new Error(`light-color tween: invalid target color "${o}".`);
  async function E(I) {
    var B, H;
    if (m != null && m.aborted) return !1;
    const k = await fromUuid(I);
    if (!k) return !1;
    const M = k.object;
    if (!M) return !1;
    let $;
    if (y) {
      const V = (B = k.config) == null ? void 0 : B.color;
      V != null && V.valid || console.warn(`light-color tween: source color invalid on ${I}, using white.`), $ = V != null && V.valid ? V : i.fromString("#ffffff");
    }
    const N = b ? ((H = k._source.config) == null ? void 0 : H.alpha) ?? 0.5 : null, x = { t: 0 }, F = `ambient-hue-tween:${I}`;
    n.terminateAnimation(F), m && m.addEventListener("abort", () => {
      n.terminateAnimation(F);
    }, { once: !0 });
    const A = typeof f == "number" ? Math.max(0, Math.min(c, Date.now() - f)) : 0, R = /* @__PURE__ */ u((V) => {
      const Y = {};
      y && (Y.color = v($, w, V)), b && (Y.alpha = N + (s - N) * V), k.updateSource({ config: Y }), M.initializeLightSource();
    }, "applyFrame");
    A > 0 && (x.t = A / c, R(x.t));
    const j = await n.animate(
      [{ parent: x, attribute: "t", to: 1 }],
      {
        name: F,
        duration: c,
        easing: g,
        time: A,
        ontick: /* @__PURE__ */ u(() => R(x.t), "ontick")
      }
    );
    if (j !== !1) {
      if (m != null && m.aborted) return !1;
      const V = {};
      y && (V.color = w.toHTML()), b && (V.alpha = s), k.updateSource({ config: V }), M.initializeLightSource();
    }
    if (h && j !== !1 && k.canUserModify(game.user, "update")) {
      if (m != null && m.aborted) return !1;
      const V = {}, Y = {};
      y && (V.color = $.toHTML(), Y["config.color"] = w.toHTML()), b && (V.alpha = N, Y["config.alpha"] = s), k.updateSource({ config: V }), await k.update(Y);
    }
    return j !== !1;
  }
  return u(E, "animateOne"), (await Promise.all(l.map(E))).every(Boolean);
}
u(Tb, "execute$7");
function Lb() {
  Gt({ type: "light-color", execute: Tb, validate: Cb });
}
u(Lb, "registerLightColorTween");
const An = /* @__PURE__ */ new WeakMap();
function Ib(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("light-state tween: 'uuid' is required (string or array of AmbientLight document UUIDs).");
  if (typeof t.enabled != "boolean")
    throw new Error("light-state tween: 'enabled' (boolean) is required.");
}
u(Ib, "validate$6");
async function Ob(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, enabled: r } = t, o = Array.isArray(i) ? i : [i];
  if (o.length === 0)
    return console.warn("light-state tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: s = 2e3,
    easing: a = "easeInOutCosine",
    commit: l = !0,
    startEpochMS: c = null,
    signal: d = null
  } = e, h = at(a);
  async function f(g) {
    var k, M, $, N;
    if (d != null && d.aborted) return !1;
    const y = await fromUuid(g);
    if (!y) return !1;
    const b = y.object;
    if (!b) return !1;
    const v = `ambient-state-tween:${g}`;
    n.terminateAnimation(v), d && d.addEventListener("abort", () => {
      n.terminateAnimation(v);
    }, { once: !0 });
    const w = An.get(y) ?? {
      hidden: y._source.hidden,
      alpha: ((k = y._source.config) == null ? void 0 : k.alpha) ?? 0.5
    };
    if (An.set(y, w), D(`light-state START ${r ? "ON" : "OFF"} | snap: ${JSON.stringify(w)} | _source.hidden=${y._source.hidden}, _source.config.alpha=${(M = y._source.config) == null ? void 0 : M.alpha}`), r && !w.hidden || !r && w.hidden)
      return An.delete(y), !0;
    const E = w.alpha, S = typeof c == "number" ? Math.max(0, Math.min(s, Date.now() - c)) : 0, I = /* @__PURE__ */ u((x) => {
      y.updateSource({ config: { alpha: x } }), b.initializeLightSource();
    }, "applyAlpha");
    if (r) {
      y.updateSource({ hidden: !1, config: { alpha: 0 } }), b.initializeLightSource(), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
      const x = { t: 0 };
      S > 0 && (x.t = S / s, I(E * x.t));
      const F = await n.animate(
        [{ parent: x, attribute: "t", to: 1 }],
        {
          name: v,
          duration: s,
          easing: h,
          time: S,
          ontick: /* @__PURE__ */ u(() => I(E * x.t), "ontick")
        }
      );
      return F !== !1 && !(d != null && d.aborted) && l && y.canUserModify(game.user, "update") ? (y.updateSource({ hidden: !0, config: { alpha: E } }), await y.update({ hidden: !1 }), D(`light-state FADE-IN committed. _source.hidden=${y._source.hidden}, _source.config.alpha=${($ = y._source.config) == null ? void 0 : $.alpha}`), An.delete(y)) : F === !1 || An.delete(y), F !== !1;
    } else {
      y.updateSource({ hidden: !1, config: { alpha: w.alpha } }), b.initializeLightSource();
      const x = { t: 0 };
      S > 0 && (x.t = S / s, I(E * (1 - x.t)));
      const F = await n.animate(
        [{ parent: x, attribute: "t", to: 1 }],
        {
          name: v,
          duration: s,
          easing: h,
          time: S,
          ontick: /* @__PURE__ */ u(() => I(E * (1 - x.t)), "ontick")
        }
      );
      return F !== !1 && !(d != null && d.aborted) && l && y.canUserModify(game.user, "update") ? (await y.update({ hidden: !0 }), y.updateSource({ config: { alpha: E } }), b.initializeLightSource(), D(`light-state FADE-OUT committed+restored. _source.hidden=${y._source.hidden}, _source.config.alpha=${(N = y._source.config) == null ? void 0 : N.alpha}`), An.delete(y)) : F === !1 || (y.updateSource({ hidden: !0, config: { alpha: E } }), b.initializeLightSource(), An.delete(y)), F !== !1;
    }
  }
  return u(f, "animateOne"), (await Promise.all(o.map(f))).every(Boolean);
}
u(Ob, "execute$6");
function kb() {
  Gt({ type: "light-state", execute: Ob, validate: Ib });
}
u(kb, "registerLightStateTween");
function Aa(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("tile-prop tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (!t.attribute || typeof t.attribute != "string")
    throw new Error("tile-prop tween: 'attribute' (string) is required — dot-path to a numeric property (e.g. 'alpha', 'rotation').");
  if (typeof t.value != "number")
    throw new Error("tile-prop tween: 'value' (number) is required — the target value to animate to.");
}
u(Aa, "validate$5");
async function Ma(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, attribute: r, value: o } = t, s = Array.isArray(i) ? i : [i];
  if (s.length === 0)
    return console.warn("tile-prop tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: a = 2e3,
    easing: l = "easeInOutCosine",
    commit: c = !0,
    startEpochMS: d = null,
    signal: h = null
  } = e, f = at(l);
  async function m(y) {
    if (h != null && h.aborted) return !1;
    const b = await fromUuid(y);
    if (!b) return !1;
    const v = b.object;
    if (!v) return !1;
    const w = foundry.utils.getProperty(b._source, r);
    if (typeof w != "number")
      return console.warn(`tile-prop tween: source value at '${r}' on ${y} is not a number (got ${typeof w}). Skipping.`), !1;
    const E = `tile-prop-tween:${r}:${y}`;
    n.terminateAnimation(E), h && h.addEventListener("abort", () => {
      n.terminateAnimation(E);
    }, { once: !0 });
    const S = typeof d == "number" ? Math.max(0, Math.min(a, Date.now() - d)) : 0, I = /* @__PURE__ */ u(($) => {
      const N = w + (o - w) * $;
      b.updateSource(foundry.utils.expandObject({ [r]: N })), v.refresh();
    }, "applyFrame"), k = { t: 0 };
    S > 0 && (k.t = S / a, I(k.t));
    const M = await n.animate(
      [{ parent: k, attribute: "t", to: 1 }],
      {
        name: E,
        duration: a,
        easing: f,
        time: S,
        ontick: /* @__PURE__ */ u(() => I(k.t), "ontick")
      }
    );
    if (M !== !1) {
      if (h != null && h.aborted) return !1;
      b.updateSource(foundry.utils.expandObject({ [r]: o })), v.refresh();
    }
    if (c && M !== !1 && b.canUserModify(game.user, "update")) {
      if (h != null && h.aborted) return !1;
      b.updateSource(foundry.utils.expandObject({ [r]: w })), await b.update({ [r]: o });
    }
    return M !== !1;
  }
  return u(m, "animateOne"), (await Promise.all(s.map(m))).every(Boolean);
}
u(Ma, "execute$5");
function Ab() {
  Gt({ type: "tile-prop", execute: Ma, validate: Aa });
}
u(Ab, "registerTilePropTween");
function Mb(t) {
  if (!t.attribute || typeof t.attribute != "string")
    throw new Error("particles-prop tween: 'attribute' (string) is required — property name on canvas.particleeffects (e.g. 'alpha').");
  if (typeof t.value != "number")
    throw new Error("particles-prop tween: 'value' (number) is required — the target value to animate to.");
}
u(Mb, "validate$4");
async function xb(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { attribute: i, value: r } = t, {
    durationMS: o = 2e3,
    easing: s = "easeInOutCosine",
    startEpochMS: a = null,
    signal: l = null
  } = e, c = canvas.particleeffects;
  if (!c)
    return console.warn("particles-prop tween: canvas.particleeffects not available."), !1;
  const d = c[i];
  if (typeof d != "number")
    return console.warn(`particles-prop tween: current value of '${i}' is not a number (got ${typeof d}). Skipping.`), !1;
  const h = at(s), f = `particles-prop-tween:${i}`;
  n.terminateAnimation(f), l && l.addEventListener("abort", () => {
    n.terminateAnimation(f);
  }, { once: !0 });
  const m = typeof a == "number" ? Math.max(0, Math.min(o, Date.now() - a)) : 0, g = /* @__PURE__ */ u((v) => {
    c[i] = d + (r - d) * v;
  }, "applyFrame"), y = { t: 0 };
  m > 0 && (y.t = m / o, g(y.t));
  const b = await n.animate(
    [{ parent: y, attribute: "t", to: 1 }],
    {
      name: f,
      duration: o,
      easing: h,
      time: m,
      ontick: /* @__PURE__ */ u(() => g(y.t), "ontick")
    }
  );
  if (b !== !1) {
    if (l != null && l.aborted) return !1;
    c[i] = r;
  }
  return b !== !1;
}
u(xb, "execute$4");
function _b() {
  Gt({ type: "particles-prop", execute: xb, validate: Mb });
}
u(_b, "registerParticlesPropTween");
var Dn, uo, fo, ho, mo, go, ar;
const Lu = class Lu {
  /**
   * @param {AbortController} controller
   */
  constructor(e) {
    _(this, Dn);
    _(this, uo);
    _(this, fo);
    _(this, ho);
    _(this, mo);
    _(this, go, !1);
    _(this, ar, null);
    O(this, Dn, e), O(this, ho, new Promise((n) => {
      O(this, uo, n);
    })), O(this, mo, new Promise((n) => {
      O(this, fo, n);
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
    O(this, go, !0);
    const n = typeof e == "boolean" ? { status: e ? "completed" : "cancelled" } : e ?? { status: "cancelled" };
    O(this, ar, n), p(this, uo).call(this, n.status === "completed"), p(this, fo).call(this, n);
  }
};
Dn = new WeakMap(), uo = new WeakMap(), fo = new WeakMap(), ho = new WeakMap(), mo = new WeakMap(), go = new WeakMap(), ar = new WeakMap(), u(Lu, "TimelineHandle");
let fc = Lu;
var Oi, lr, ki;
const Iu = class Iu {
  constructor() {
    /** @type {Map<string, Set<Function>>} */
    _(this, Oi, /* @__PURE__ */ new Map());
    /** @type {Set<string>} Signals that have been emitted (sticky) */
    _(this, lr, /* @__PURE__ */ new Set());
    _(this, ki, !1);
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
      n && (s = /* @__PURE__ */ u(() => {
        o(), r(n.reason ?? "aborted");
      }, "onAbort"), n.addEventListener("abort", s, { once: !0 }));
    });
  }
  /**
   * Tear down the bus, clearing all listeners.
   */
  destroy() {
    O(this, ki, !0), p(this, Oi).clear(), p(this, lr).clear();
  }
};
Oi = new WeakMap(), lr = new WeakMap(), ki = new WeakMap(), u(Iu, "EventBus");
let hc = Iu;
const Ah = /* @__PURE__ */ new Map();
function xa(t, e) {
  Ah.set(t, e);
}
u(xa, "registerAwaitProvider");
function mc(t, e) {
  const n = Ah.get(t.event);
  return n ? n(t, e) : Promise.reject(new Error(`Unknown await event type: "${t.event}"`));
}
u(mc, "createAwaitPromise");
xa("signal", (t, e) => t.name ? e.eventBus.waitFor(t.name, e.signal) : Promise.reject(new Error('await signal: "name" is required')));
xa("click", (t, e) => new Promise((n, i) => {
  if (e.signal.aborted) return i(e.signal.reason ?? "aborted");
  const r = /* @__PURE__ */ u(() => {
    s(), n();
  }, "onClick"), o = /* @__PURE__ */ u(() => {
    s(), i(e.signal.reason ?? "aborted");
  }, "onAbort"), s = /* @__PURE__ */ u(() => {
    document.removeEventListener("click", r), e.signal.removeEventListener("abort", o);
  }, "cleanup");
  document.addEventListener("click", r, { once: !0 }), e.signal.addEventListener("abort", o, { once: !0 });
}));
xa("keypress", (t, e) => new Promise((n, i) => {
  if (e.signal.aborted) return i(e.signal.reason ?? "aborted");
  const r = /* @__PURE__ */ u((a) => {
    t.key && a.key !== t.key || (s(), n());
  }, "onKey"), o = /* @__PURE__ */ u(() => {
    s(), i(e.signal.reason ?? "aborted");
  }, "onAbort"), s = /* @__PURE__ */ u(() => {
    document.removeEventListener("keydown", r), e.signal.removeEventListener("abort", o);
  }, "cleanup");
  document.addEventListener("keydown", r), e.signal.addEventListener("abort", o, { once: !0 });
}));
const Xi = /* @__PURE__ */ new Map();
function Nb(t, e) {
  const n = Xi.get(t);
  n && !n.cancelled && n.cancel("replaced-by-name"), Xi.set(t, e), e.finished.then(() => {
    Xi.get(t) === e && Xi.delete(t);
  });
}
u(Nb, "registerTimeline");
function Mh(t) {
  const e = Xi.get(t);
  return e && !e.cancelled ? (e.cancel("cancelled-by-name"), !0) : !1;
}
u(Mh, "cancelTimeline");
function $b(t) {
  return Xi.get(t);
}
u($b, "getTimeline");
function ad(t, e) {
  return t <= 0 ? Promise.resolve() : new Promise((n, i) => {
    if (e.aborted) return i(e.reason);
    const r = setTimeout(n, t);
    e.addEventListener("abort", () => {
      clearTimeout(r), i(e.reason);
    }, { once: !0 });
  });
}
u(ad, "cancellableDelay");
var Ve, Pn, po, yo;
const Ou = class Ou {
  constructor(e) {
    /** @type {TweenTimeline} */
    _(this, Ve);
    /** @type {Array<{ type: string, params: object, opts?: object, detach: boolean }>} */
    _(this, Pn, []);
    /** @type {Function|null} */
    _(this, po, null);
    /** @type {Function|null} */
    _(this, yo, null);
    O(this, Ve, e);
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
    return O(this, po, e), this;
  }
  /**
   * Callback invoked after this step's awaited tweens complete.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  after(e) {
    return O(this, yo, e), this;
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
Ve = new WeakMap(), Pn = new WeakMap(), po = new WeakMap(), yo = new WeakMap(), u(Ou, "StepBuilder");
let gc = Ou;
var Ge, _e, _t, Rn, bo, vo, wo, Eo, ii, pc, X, dn, yc, xh, bc, _h, Nh, ns, ht, Yt;
const mn = class mn {
  constructor() {
    _(this, X);
    /** @type {string|null} */
    _(this, Ge, null);
    /** @type {string} */
    _(this, _e, Ae.ABORT);
    /** @type {Array<object>} */
    _(this, _t, []);
    /** @type {StepBuilder|null} */
    _(this, Rn, null);
    /** @type {Function|null} */
    _(this, bo, null);
    /** @type {Function|null} */
    _(this, vo, null);
    /** @type {Function|null} */
    _(this, wo, null);
    /** @type {Function|null} */
    _(this, Eo, null);
  }
  /**
   * Register this timeline in the named registry. Starting a new
   * timeline with the same name cancels the previous one.
   * @param {string} name
   * @returns {TweenTimeline} this
   */
  name(e) {
    return O(this, Ge, e), this;
  }
  /**
   * Set the error policy for step execution.
   * @param {"abort"|"continue"} policy
   * @returns {TweenTimeline} this
   */
  errorPolicy(e) {
    if (e !== Ae.ABORT && e !== Ae.CONTINUE)
      throw new Error(`Invalid error policy: "${e}". Use "abort" or "continue".`);
    return O(this, _e, e), this;
  }
  /**
   * Start a new step. Finalizes the previous step if one is open.
   * @returns {StepBuilder}
   */
  step() {
    return T(this, X, dn).call(this), O(this, Rn, new gc(this)), p(this, Rn);
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
    return O(this, bo, e), this;
  }
  /**
   * Callback invoked on successful completion.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onComplete(e) {
    return O(this, vo, e), this;
  }
  /**
   * Callback invoked on cancellation (mutually exclusive with onComplete).
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onCancel(e) {
    return O(this, wo, e), this;
  }
  /**
   * Callback invoked on runtime failure (mutually exclusive with onComplete/onCancel).
   * @param {(outcome: object) => void} fn
   * @returns {TweenTimeline} this
   */
  onError(e) {
    return O(this, Eo, e), this;
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
    const i = new fc(n);
    p(this, Ge) && Nb(p(this, Ge), i);
    const r = e.broadcast ?? game.user.isGM, o = e.commit ?? game.user.isGM, s = e.startEpochMS ?? Date.now();
    r && p(this, Ge) && ts(Oh, {
      name: p(this, Ge),
      data: this.toJSON(),
      startEpochMS: s
    });
    const a = new hc(), l = {
      signal: i.signal,
      commit: o,
      startEpochMS: s,
      eventBus: a,
      errors: [],
      detachedPromises: []
    };
    return T(this, X, xh).call(this, i, l).then((c) => {
      var d, h, f;
      a.destroy(), i._resolve(c), c.status === kn.COMPLETED ? (d = p(this, vo)) == null || d.call(this) : c.status === kn.CANCELLED ? ((h = p(this, wo)) == null || h.call(this), r && p(this, Ge) && ts(cc, {
        name: p(this, Ge),
        reason: c.reason
      })) : ((f = p(this, Eo)) == null || f.call(this, c), r && p(this, Ge) && ts(cc, {
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
    const n = { timeline: T(i = mn, ii, pc).call(i, p(this, _t)) };
    return p(this, Ge) && (n.name = p(this, Ge)), p(this, _e) !== Ae.ABORT && (n.errorPolicy = p(this, _e)), n;
  }
};
Ge = new WeakMap(), _e = new WeakMap(), _t = new WeakMap(), Rn = new WeakMap(), bo = new WeakMap(), vo = new WeakMap(), wo = new WeakMap(), Eo = new WeakMap(), ii = new WeakSet(), pc = /* @__PURE__ */ u(function(e) {
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
            return T(o = mn, ii, pc).call(o, r);
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
dn = /* @__PURE__ */ u(function() {
  p(this, Rn) && (p(this, _t).push({ kind: "step", data: p(this, Rn)._finalize() }), O(this, Rn, null));
}, "#finalizeCurrentStep"), yc = /* @__PURE__ */ u(function(e) {
  e.length !== 0 && Promise.allSettled(e).catch(() => {
  });
}, "#drainDetached"), xh = /* @__PURE__ */ u(async function(e, n) {
  var i, r;
  try {
    if (n.signal.aborted) return T(this, X, ht).call(this, n.signal.reason);
    const o = await T(this, X, ns).call(this, p(this, bo), Lt.BEFORE_ALL, null);
    if (o) {
      if (p(this, _e) === Ae.ABORT) return o;
      n.errors.push(o);
    }
    const s = await T(this, X, bc).call(this, p(this, _t), n);
    if (s)
      return T(i = mn, ii, yc).call(i, n.detachedPromises), s;
    if (!n.signal.aborted) {
      const a = await Promise.allSettled(n.detachedPromises);
      for (const l of a)
        if (l.status === "rejected") {
          const c = T(this, X, Yt).call(this, l.reason, Lt.ENTRY);
          if (p(this, _e) === Ae.ABORT) return c;
          n.errors.push(c);
        }
    }
    return n.signal.aborted ? T(this, X, ht).call(this, n.signal.reason) : {
      status: kn.COMPLETED,
      ...n.errors.length > 0 ? { errors: n.errors } : {}
    };
  } catch (o) {
    return T(r = mn, ii, yc).call(r, n.detachedPromises), n.signal.aborted ? T(this, X, ht).call(this, n.signal.reason) : (console.error("TweenTimeline execution error:", o), T(this, X, Yt).call(this, o, Lt.RUNTIME));
  }
}, "#execute"), bc = /* @__PURE__ */ u(async function(e, n) {
  let i = -1, r = 0;
  for (const o of e) {
    if (n.signal.aborted) return T(this, X, ht).call(this, n.signal.reason);
    if (o.kind === "delay") {
      try {
        await ad(o.ms, n.signal);
      } catch {
        return T(this, X, ht).call(this, n.signal.reason);
      }
      r += o.ms;
      continue;
    }
    if (o.kind === "await") {
      try {
        let g = mc(o.config, {
          signal: n.signal,
          eventBus: n.eventBus
        });
        const y = o.config.timeout;
        typeof y == "number" && y > 0 && (g = Promise.race([
          g,
          ad(y, n.signal)
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
      const g = await T(this, X, _h).call(this, o, n, r);
      if (g) return g;
      continue;
    }
    i += 1;
    const { entries: s, before: a, after: l } = o.data, c = await T(this, X, ns).call(this, a, Lt.BEFORE_STEP, i);
    if (c) {
      if (p(this, _e) === Ae.ABORT) return c;
      n.errors.push(c);
      continue;
    }
    if (n.signal.aborted) return T(this, X, ht).call(this, n.signal.reason);
    const d = [];
    let h = 0;
    for (const g of s) {
      const y = vr(g.type);
      if (!y) {
        const E = T(this, X, Yt).call(this, new Error(`TweenTimeline: unknown tween type "${g.type}"`), Lt.ENTRY, i, g.type);
        if (p(this, _e) === Ae.ABORT) return E;
        n.errors.push(E), console.warn(E.error.message);
        continue;
      }
      const b = {
        ...g.opts,
        commit: n.commit,
        startEpochMS: n.startEpochMS + r,
        signal: n.signal
      }, v = b.durationMS ?? 2e3, w = Promise.resolve().then(() => y.execute(g.params, b)).then((E) => E === !1 ? {
        ok: !1,
        failure: T(this, X, Yt).call(this, new Error("Tween entry returned false."), Lt.ENTRY, i, g.type)
      } : { ok: !0 }).catch((E) => ({
        ok: !1,
        failure: T(this, X, Yt).call(this, E, Lt.ENTRY, i, g.type)
      }));
      g.detach ? n.detachedPromises.push(w) : (d.push(w), h = Math.max(h, v));
    }
    const f = await T(this, X, Nh).call(this, d, n.signal);
    if (f === null) return T(this, X, ht).call(this, n.signal.reason);
    for (const g of f)
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
    r += h;
  }
  return null;
}, "#executeSegments"), _h = /* @__PURE__ */ u(async function(e, n, i = 0) {
  const { branches: r, join: o, overflow: s } = e, a = r.length, l = o === "all" ? a : o === "any" ? 1 : o, c = r.map(() => {
    const g = new AbortController();
    return n.signal.aborted ? g.abort(n.signal.reason ?? "parent-aborted") : n.signal.addEventListener("abort", () => {
      g.signal.aborted || g.abort(n.signal.reason ?? "parent-aborted");
    }, { once: !0 }), g;
  });
  let d = 0, h = 0;
  const f = new Array(a).fill(null);
  let m;
  return new Promise((g) => {
    let y = !1;
    const b = /* @__PURE__ */ u(() => {
      if (y) return;
      if (d >= l) {
        y = !0, v(), g(null);
        return;
      }
      const w = a - d - h;
      if (d + w < l) {
        y = !0, v();
        const E = f.filter((I) => I && I.status === kn.FAILED).map((I) => I), S = T(this, X, Yt).call(this, new Error(`parallel: join target ${l} impossible (${d} completed, ${h} failed)`), Lt.PARALLEL);
        p(this, _e) === Ae.ABORT ? g(S) : (n.errors.push(S), n.errors.push(...E), g(null));
      }
    }, "checkJoin"), v = /* @__PURE__ */ u(() => {
      if (s === "cancel")
        for (let w = 0; w < a; w++)
          !f[w] && !c[w].signal.aborted && c[w].abort("overflow-cancel");
      for (let w = 0; w < a; w++)
        f[w] || n.detachedPromises.push(m[w]);
    }, "applyOverflow");
    if (m = r.map((w, E) => {
      const S = {
        signal: c[E].signal,
        commit: n.commit,
        startEpochMS: n.startEpochMS + i,
        eventBus: n.eventBus,
        // shared
        errors: n.errors,
        // shared
        detachedPromises: n.detachedPromises
        // shared
      };
      return T(this, X, bc).call(this, w, S).then((I) => {
        if (I)
          if (I.status === kn.CANCELLED) {
            if (c[E].signal.aborted) {
              f[E] = I;
              return;
            }
            f[E] = I, h++;
          } else
            f[E] = I, h++;
        else
          f[E] = { status: kn.COMPLETED }, d++;
        b();
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
Nh = /* @__PURE__ */ u(function(e, n) {
  return e.length === 0 ? Promise.resolve([]) : n.aborted ? Promise.resolve(null) : new Promise((i, r) => {
    const o = /* @__PURE__ */ u(() => i(null), "onAbort");
    n.addEventListener("abort", o, { once: !0 }), Promise.all(e).then((s) => {
      n.removeEventListener("abort", o), i(s);
    }).catch((s) => {
      n.removeEventListener("abort", o), r(s);
    });
  });
}, "#waitForStep"), ns = /* @__PURE__ */ u(async function(e, n, i) {
  if (!e) return null;
  try {
    return await e(), null;
  } catch (r) {
    const o = T(this, X, Yt).call(this, r, n, i ?? void 0);
    return p(this, _e) === Ae.CONTINUE && console.warn(`TweenTimeline: hook failure in ${n}:`, r), o;
  }
}, "#runHook"), /** @param {unknown} reason */
ht = /* @__PURE__ */ u(function(e) {
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
Yt = /* @__PURE__ */ u(function(e, n, i, r) {
  const o = e instanceof Error ? e : new Error(String(e));
  return {
    status: kn.FAILED,
    error: o,
    phase: n,
    ...typeof i == "number" ? { stepIndex: i } : {},
    ...r ? { entryType: r } : {}
  };
}, "#failedOutcome"), _(mn, ii), u(mn, "TweenTimeline");
let Is = mn;
function au(t) {
  if (!t || typeof t != "object")
    throw new Error("Sequence JSON: data must be an object.");
  if (!Array.isArray(t.timeline))
    throw new Error("Sequence JSON: 'timeline' must be an array.");
  if (t.name != null && typeof t.name != "string")
    throw new Error("Sequence JSON: 'name' must be a string.");
  if (t.errorPolicy != null && t.errorPolicy !== Ae.ABORT && t.errorPolicy !== Ae.CONTINUE)
    throw new Error(`Sequence JSON: 'errorPolicy' must be "abort" or "continue".`);
  $h(t.timeline, "timeline", 0);
}
u(au, "validateSequenceJSON");
function $h(t, e, n = 0) {
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
      for (let c = 0; c < s.branches.length; c++) {
        const d = s.branches[c];
        if (!Array.isArray(d))
          throw new Error(`Sequence JSON: ${o}.parallel.branches[${c}] must be an array.`);
        $h(d, `${o}.parallel.branches[${c}]`, n + 1);
      }
      continue;
    }
    throw new Error(`Sequence JSON: ${o} is not a recognized segment (step array, delay, await, emit, or parallel).`);
  }
}
u($h, "validateSegmentsJSON");
function Fh(t) {
  au(t), Dh(t.timeline, "timeline");
}
u(Fh, "validateSequenceSemantics");
function Dh(t, e) {
  for (let n = 0; n < t.length; n++) {
    const i = t[n], r = `${e}[${n}]`;
    if (Array.isArray(i))
      for (let o = 0; o < i.length; o++) {
        const s = i[o];
        try {
          bb(s.type, s.params ?? {});
        } catch (a) {
          throw new Error(`Sequence JSON: ${r}[${o}] failed semantic validation: ${a.message}`);
        }
      }
    else if (i.parallel)
      for (let o = 0; o < i.parallel.branches.length; o++)
        Dh(i.parallel.branches[o], `${r}.parallel.branches[${o}]`);
  }
}
u(Dh, "validateSegmentsSemantics");
function lu(t, e = {}) {
  au(t), e.validateSemantics && Fh(t);
  const n = new Is();
  return t.name && n.name(t.name), t.errorPolicy && n.errorPolicy(t.errorPolicy), Ph(t.timeline, n), n;
}
u(lu, "compileSequence");
function Ph(t, e) {
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
      const i = n.parallel, r = i.branches.map((o) => (s) => Ph(o, s));
      e.parallel(r, {
        join: i.join ?? "all",
        overflow: i.overflow ?? "detach"
      });
    }
  }
}
u(Ph, "compileSegments");
function Fb(t) {
  au(t), Fh(t);
}
u(Fb, "validate$3");
async function Db(t, e = {}) {
  return lu(t, { validateSemantics: !0 }).run({
    broadcast: !1,
    commit: e.commit,
    startEpochMS: e.startEpochMS,
    signal: e.signal
  }).finished;
}
u(Db, "execute$3");
function Pb() {
  Gt({ type: "sequence", execute: Db, validate: Fb });
}
u(Pb, "registerSequenceTween");
function Rb(t) {
  if (t.x == null && t.y == null && t.scale == null)
    throw new Error("camera-pan tween: at least one of 'x', 'y', or 'scale' is required.");
  if (t.x != null && typeof t.x != "number")
    throw new Error("camera-pan tween: 'x' must be a number.");
  if (t.y != null && typeof t.y != "number")
    throw new Error("camera-pan tween: 'y' must be a number.");
  if (t.scale != null && (typeof t.scale != "number" || t.scale <= 0))
    throw new Error("camera-pan tween: 'scale' must be a positive number.");
}
u(Rb, "validate$2");
async function Hb(t, e = {}) {
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
  return r ? new Promise((c) => {
    const d = /* @__PURE__ */ u(() => {
      c(!1);
    }, "onAbort");
    r.addEventListener("abort", d, { once: !0 }), l.then(() => {
      r.removeEventListener("abort", d), c(!r.aborted);
    }).catch(() => {
      r.removeEventListener("abort", d), c(!1);
    });
  }) : (await l, !0);
}
u(Hb, "execute$2");
function qb() {
  Gt({ type: "camera-pan", execute: Hb, validate: Rb });
}
u(qb, "registerCameraPanTween");
function jb(t) {
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
u(jb, "validate$1");
async function Bb(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { Color: i } = foundry.utils, { uuid: r, toColor: o, mode: s = "oklch" } = t, a = Array.isArray(r) ? r : [r];
  if (a.length === 0)
    return console.warn("tile-tint tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: l = 2e3,
    easing: c = "easeInOutCosine",
    commit: d = !0,
    startEpochMS: h = null,
    signal: f = null
  } = e, m = at(c), g = su(s), y = i.fromString(o);
  if (!y.valid) throw new Error(`tile-tint tween: invalid target color "${o}".`);
  async function b(w) {
    var R, j;
    if (f != null && f.aborted) return !1;
    const E = await fromUuid(w);
    if (!E) return !1;
    const S = E.object;
    if (!S) return !1;
    const I = ((j = (R = E._source) == null ? void 0 : R.texture) == null ? void 0 : j.tint) ?? "#ffffff", k = i.fromString(I);
    k.valid || console.warn(`tile-tint tween: source tint invalid on ${w}, using white.`);
    const M = k.valid ? k : i.fromString("#ffffff"), $ = { t: 0 }, N = `tile-tint-tween:${w}`;
    n.terminateAnimation(N), f && f.addEventListener("abort", () => {
      n.terminateAnimation(N);
    }, { once: !0 });
    const x = typeof h == "number" ? Math.max(0, Math.min(l, Date.now() - h)) : 0, F = /* @__PURE__ */ u((B) => {
      const H = g(M, y, B);
      E.updateSource({ texture: { tint: H } }), S.refresh();
    }, "applyFrame");
    x > 0 && ($.t = x / l, F($.t));
    const A = await n.animate(
      [{ parent: $, attribute: "t", to: 1 }],
      {
        name: N,
        duration: l,
        easing: m,
        time: x,
        ontick: /* @__PURE__ */ u(() => F($.t), "ontick")
      }
    );
    if (A !== !1) {
      if (f != null && f.aborted) return !1;
      E.updateSource({ texture: { tint: y.toHTML() } }), S.refresh();
    }
    if (d && A !== !1 && E.canUserModify(game.user, "update")) {
      if (f != null && f.aborted) return !1;
      E.updateSource({ texture: { tint: M.toHTML() } }), await E.update({ "texture.tint": y.toHTML() });
    }
    return A !== !1;
  }
  return u(b, "animateOne"), (await Promise.all(a.map(b))).every(Boolean);
}
u(Bb, "execute$1");
function Ub() {
  Gt({ type: "tile-tint", execute: Bb, validate: jb });
}
u(Ub, "registerTileTintTween");
function Vb(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("tile-scale tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (typeof t.toScale != "number" || t.toScale <= 0)
    throw new Error("tile-scale tween: 'toScale' must be a positive number.");
  for (const n of ["baseWidth", "baseHeight", "centerX", "centerY"])
    if (typeof t[n] != "number")
      throw new Error(`tile-scale tween: '${n}' (number) is required.`);
}
u(Vb, "validate");
async function Gb(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, toScale: r, baseWidth: o, baseHeight: s, centerX: a, centerY: l } = t, c = Array.isArray(i) ? i : [i];
  if (c.length === 0) return !0;
  const {
    durationMS: d = 2e3,
    easing: h = "easeInOutCosine",
    commit: f = !0,
    startEpochMS: m = null,
    signal: g = null
  } = e, y = at(h), b = o * r, v = s * r, w = a - b / 2, E = l - v / 2;
  async function S(k) {
    if (g != null && g.aborted) return !1;
    const M = await fromUuid(k);
    if (!M) return !1;
    const $ = M.object;
    if (!$) return !1;
    const N = M._source.width, x = M._source.height, F = M._source.x, A = M._source.y, R = `tile-scale-tween:${k}`;
    n.terminateAnimation(R), g && g.addEventListener("abort", () => {
      n.terminateAnimation(R);
    }, { once: !0 });
    const j = typeof m == "number" ? Math.max(0, Math.min(d, Date.now() - m)) : 0, B = /* @__PURE__ */ u((Y) => {
      const oe = N + (b - N) * Y, J = x + (v - x) * Y, te = F + (w - F) * Y, an = A + (E - A) * Y;
      M.updateSource({ width: oe, height: J, x: te, y: an }), $.refresh();
    }, "applyFrame"), H = { t: 0 };
    j > 0 && (H.t = j / d, B(H.t));
    const V = await n.animate(
      [{ parent: H, attribute: "t", to: 1 }],
      {
        name: R,
        duration: d,
        easing: y,
        time: j,
        ontick: /* @__PURE__ */ u(() => B(H.t), "ontick")
      }
    );
    if (V !== !1) {
      if (g != null && g.aborted) return !1;
      M.updateSource({ width: b, height: v, x: w, y: E }), $.refresh();
    }
    if (f && V !== !1 && M.canUserModify(game.user, "update")) {
      if (g != null && g.aborted) return !1;
      M.updateSource({ width: N, height: x, x: F, y: A }), await M.update({ width: b, height: v, x: w, y: E });
    }
    return V !== !1;
  }
  return u(S, "animateOne"), (await Promise.all(c.map(S))).every(Boolean);
}
u(Gb, "execute");
function Wb() {
  Gt({ type: "tile-scale", execute: Gb, validate: Vb });
}
u(Wb, "registerTileScaleTween");
async function zb(t, e, n = {}) {
  if (!game.user.isGM)
    return ui.notifications.warn("Only the GM can dispatch tweens."), !1;
  const i = vr(t);
  if (!i)
    throw new Error(`Unknown tween type: "${t}". Registered types: ${uc().join(", ")}`);
  i.validate(e);
  const { durationMS: r = 2e3, easing: o = "easeInOutCosine", commit: s = !0 } = n, a = Date.now();
  return ts(Ih, {
    type: t,
    params: e,
    durationMS: r,
    easing: o,
    startEpochMS: a,
    commit: !1
  }), i.execute(e, { durationMS: r, easing: o, commit: s, startEpochMS: a });
}
u(zb, "dispatchTween");
function Yb(t) {
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
u(Yb, "handleTweenSocketMessage");
Lb();
kb();
Ab();
_b();
Pb();
qb();
Ub();
Wb();
Gt({ type: "token-prop", execute: Ma, validate: Aa });
Gt({ type: "drawing-prop", execute: Ma, validate: Aa });
Gt({ type: "sound-prop", execute: Ma, validate: Aa });
ru(Ih, Yb);
ru(Oh, Kb);
ru(cc, Xb);
function Kb(t) {
  const { data: e, startEpochMS: n } = t ?? {};
  if (!e) {
    console.warn(`[${L}] Received empty tween-sequence socket message.`);
    return;
  }
  try {
    lu(e, { validateSemantics: !0 }).run({ commit: !1, startEpochMS: n, broadcast: !1 });
  } catch (i) {
    console.error(`[${L}] Failed to run received tween sequence:`, i);
  }
}
u(Kb, "handleSequenceSocketMessage");
function Xb(t) {
  const { name: e } = t ?? {};
  e && Mh(e);
}
u(Xb, "handleSequenceCancelMessage");
function Jb() {
  Hooks.once("ready", () => {
    yb();
    const t = game.modules.get(L);
    t.api || (t.api = {}), t.api.tween = {
      dispatch: zb,
      types: uc,
      Timeline: Is,
      ErrorPolicy: Ae,
      compileSequence: lu,
      cancelTimeline: Mh,
      getTimeline: $b
    }, console.log(`[${L}] Tween API registered. Types: ${uc().join(", ")}`);
  });
}
u(Jb, "registerTweenHooks");
Jb();
const Qb = ["tag", "tag-all", "id", "tags-any", "tags-all"], Zb = /* @__PURE__ */ new Set(["tags-any", "tags-all"]);
function cu(t) {
  if (!t || typeof t != "string")
    return { type: "unknown", value: t ?? "" };
  if (t.startsWith("$"))
    return { type: "special", value: t };
  for (const e of Qb)
    if (t.startsWith(`${e}:`)) {
      const n = t.slice(e.length + 1), i = Zb.has(e) ? n.split(",").map((r) => r.trim()) : n;
      return { type: e, value: i };
    }
  return t.includes(".") ? { type: "uuid", value: t } : { type: "unknown", value: t };
}
u(cu, "parseSelector");
function ev(t) {
  if (!t) return "";
  const { type: e, value: n } = t;
  if (e === "special" || e === "uuid" || e === "unknown")
    return Array.isArray(n) ? n.join(",") : n ?? "";
  const i = Array.isArray(n) ? n.join(",") : n ?? "";
  return `${e}:${i}`;
}
u(ev, "buildSelector");
function Rh(t, e = "first") {
  return t != null && t.length ? t.length === 1 ? e === "first-all" || e === "all" ? `tag-all:${t[0]}` : `tag:${t[0]}` : e === "any" ? `tags-any:${t.join(",")}` : e === "all" ? `tags-all:${t.join(",")}` : e === "first-all" ? `tags-all:${t.join(",")}` : `tags-any:${t.join(",")}` : "";
}
u(Rh, "buildTagSelector");
function _a(t) {
  if (!t) return null;
  if (t.documentName || t._source !== void 0) {
    const e = t.object;
    return e ? { placeable: e, doc: t } : null;
  }
  return t.document ? { placeable: t, doc: t.document } : null;
}
u(_a, "normalizePlaceable");
function Hh() {
  var t;
  return window.Tagger ?? ((t = game.modules.get("tagger")) == null ? void 0 : t.api) ?? null;
}
u(Hh, "getTaggerAPI");
function Na(t, e) {
  if (!t) return null;
  const n = e ?? canvas.scene;
  if (!n) return null;
  const i = cu(t);
  switch (i.type) {
    case "special":
      return tv(i.value);
    case "tag":
      return ld(i.value, n);
    case "tag-all":
      return ld(i.value, n);
    case "id":
      return nv(i.value, n);
    case "tags-any":
      return cd(i.value, n, !0);
    case "tags-all":
      return cd(i.value, n, !1);
    case "uuid":
      return iv(i.value);
    default:
      return null;
  }
}
u(Na, "resolveSelector");
function tv(t) {
  var e;
  if (t === "$particles") {
    if (!((e = game.modules.get("fxmaster")) != null && e.active))
      return console.warn(`[${L}] Picker: FXMaster not active, cannot resolve "$particles".`), null;
    const n = canvas.particleeffects;
    return n ? { kind: "particles", documents: [], placeables: [], target: n } : null;
  }
  return null;
}
u(tv, "resolveSpecial");
function ld(t, e, n) {
  const i = Hh();
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
u(ld, "resolveTag");
function nv(t, e) {
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
u(nv, "resolveById");
function cd(t, e, n) {
  const i = Hh();
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
u(cd, "resolveMultiTag");
function iv(t) {
  const e = fromUuidSync(t);
  if (!e) return null;
  const n = _a(e);
  return n ? {
    kind: "placeable",
    documents: [n.doc],
    placeables: [n]
  } : null;
}
u(iv, "resolveUUID");
function rv(t) {
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
u(rv, "adaptResolved");
function Os(t) {
  var r;
  const e = /* @__PURE__ */ new Set();
  if (t.segments) {
    if (t.setup) for (const o of Object.keys(t.setup)) e.add(o);
    if (t.landing) for (const o of Object.keys(t.landing)) e.add(o);
    for (const o of Object.values(t.segments)) {
      if (o.setup) for (const s of Object.keys(o.setup)) e.add(s);
      if (o.landing) for (const s of Object.keys(o.landing)) e.add(s);
      o.timeline && wc(o.timeline, e), (r = o.gate) != null && r.target && e.add(o.gate.target);
    }
  } else {
    if (t.setup) for (const o of Object.keys(t.setup)) e.add(o);
    if (t.landing) for (const o of Object.keys(t.landing)) e.add(o);
    t.timeline && wc(t.timeline, e);
  }
  const n = /* @__PURE__ */ new Map(), i = [];
  for (const o of e) {
    const s = Na(o), a = rv(s);
    a ? n.set(o, a) : i.push(o);
  }
  return i.length && console.warn(`[${L}] Cinematic: ${i.length} unresolved target(s): ${i.join(", ")}`), { targets: n, unresolved: i };
}
u(Os, "resolveAllTargets");
function ov(t, e) {
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
u(ov, "captureSnapshot");
function sv(t) {
  const e = {};
  function n(i) {
    if (i)
      for (const [r, o] of Object.entries(i))
        e[r] || (e[r] = {}), Object.assign(e[r], o);
  }
  if (u(n, "mergeMap"), t.segments) {
    n(t.setup), n(t.landing);
    for (const i of Object.values(t.segments))
      n(i.setup), n(i.landing), i.timeline && vc(i.timeline, e, n);
  } else
    n(t.setup), n(t.landing), t.timeline && vc(t.timeline, e, n);
  return e;
}
u(sv, "gatherAllStateMaps");
function vc(t, e, n) {
  var i;
  for (const r of t)
    if (!(r.delay != null || r.await != null || r.emit != null) && !(r.transitionTo != null || r.sound != null || r.stopSound != null)) {
      if ((i = r.parallel) != null && i.branches) {
        for (const o of r.parallel.branches)
          vc(o, e, n);
        continue;
      }
      if (n(r.before), n(r.after), r.tweens)
        for (const o of r.tweens)
          o.target && o.attribute && (e[o.target] || (e[o.target] = {}), e[o.target][o.attribute] = "__snapshot__");
    }
}
u(vc, "gatherFromEntries");
function wc(t, e) {
  for (const n of t)
    if (n.delay == null && n.await == null && n.emit == null && n.transitionTo == null && n.sound == null && n.stopSound == null) {
      if (n.parallel) {
        const i = n.parallel;
        if (i.branches)
          for (const r of i.branches)
            wc(r, e);
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
u(wc, "collectSelectorsFromEntries");
const ud = {
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
}, av = /* @__PURE__ */ new Set([
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
u(Za, "filterOverrides");
function Me(t, e) {
  var i, r;
  if (!t) return;
  const n = [];
  for (const [o, s] of Object.entries(t)) {
    const a = e.get(o);
    if (a)
      if (a.kind === "particles") {
        if (a.target.destroyed) continue;
        const l = Za(s, av, "$particles");
        for (const [c, d] of Object.entries(l))
          a.target[c] = d;
      } else if (a.kind === "multi-placeable")
        for (const { placeable: l, doc: c } of a.placeables) {
          if (!(c != null && c.parent) || !(l != null && l.scene)) continue;
          const d = c.documentName, h = ud[d];
          if (!h) {
            console.warn(`[${L}] Cinematic: no allowlist for document type "${d}" on "${o}", skipping.`);
            continue;
          }
          const f = Za(s, h, `${d} "${o}"`);
          c.updateSource(f), n.push(l);
        }
      else {
        if (!((i = a.doc) != null && i.parent) || !((r = a.placeable) != null && r.scene)) continue;
        const l = a.doc.documentName, c = ud[l];
        if (!c) {
          console.warn(`[${L}] Cinematic: no allowlist for document type "${l}" on "${o}", skipping.`);
          continue;
        }
        const d = Za(s, c, `${l} "${o}"`);
        a.doc.updateSource(d), n.push(a.placeable);
      }
  }
  for (const o of n)
    o.refresh();
}
u(Me, "applyState");
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
u(Ji, "refreshPerceptionIfNeeded");
const lv = {
  "tile-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "light-color": /* @__PURE__ */ new Set(["uuid", "toColor", "toAlpha", "mode"]),
  "light-state": /* @__PURE__ */ new Set(["uuid", "enabled"]),
  "particles-prop": /* @__PURE__ */ new Set(["attribute", "value"]),
  "camera-pan": /* @__PURE__ */ new Set(["x", "y", "scale"]),
  "token-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "drawing-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "sound-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"])
}, cv = /* @__PURE__ */ new Set(["easing"]), uv = /* @__PURE__ */ new Set(["type", "target"]);
function qh(t, e) {
  const { type: n, target: i, ...r } = t;
  if (!n)
    return console.warn(`[${L}] Cinematic: tween entry missing 'type', skipping.`), null;
  const o = {}, s = {}, a = lv[n];
  if (i === "$particles")
    o.target = "$particles";
  else if (i) {
    const l = e.get(i);
    if (!l) return null;
    l.kind === "multi-placeable" ? o.uuid = l.placeables.map((c) => c.doc.uuid) : o.uuid = l.doc.uuid;
  }
  for (const [l, c] of Object.entries(r))
    uv.has(l) || (cv.has(l) ? s[l] = c : (a != null && a.has(l), o[l] = c));
  return { type: n, params: o, opts: s };
}
u(qh, "compileTween");
const eo = /* @__PURE__ */ new Map();
let dv = 0;
async function fv(t) {
  var c, d, h, f, m;
  const { id: e, src: n, volume: i = 0.8, loop: r = !1, fadeIn: o } = t;
  if (!n) {
    console.warn(`[${L}] Cinematic sound: missing 'src', skipping.`);
    return;
  }
  const s = e || `__auto_${++dv}`, a = {
    src: n,
    autoplay: !0,
    loop: r,
    volume: i
  };
  let l = null;
  try {
    typeof ((d = (c = foundry == null ? void 0 : foundry.audio) == null ? void 0 : c.AudioHelper) == null ? void 0 : d.play) == "function" ? l = await foundry.audio.AudioHelper.play(a, !1) : typeof ((f = (h = game == null ? void 0 : game.audio) == null ? void 0 : h.constructor) == null ? void 0 : f.play) == "function" ? l = await game.audio.constructor.play(a, !1) : typeof ((m = game == null ? void 0 : game.audio) == null ? void 0 : m.play) == "function" && (l = await game.audio.play(a, !1));
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
u(fv, "playLocalSound");
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
u(el, "stopCinematicSound");
function dd() {
  var t, e;
  for (const [n, i] of eo)
    try {
      (e = (t = i.sound).stop) == null || e.call(t);
    } catch (r) {
      console.warn(`[${L}] Cinematic sound: error stopping "${n}" during cleanup:`, r);
    }
  eo.clear();
}
u(dd, "stopAllCinematicSounds");
function hv(t, e, n, i = {}) {
  const { skipToStep: r, onStepComplete: o, timelineName: s } = i, a = new n().name(s ?? `cinematic-${canvas.scene.id}`);
  return a.beforeAll(() => {
    var l;
    try {
      Me(t.setup, e), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    } catch (c) {
      throw console.error(`[${L}] Cinematic: error in beforeAll (setup state) on scene ${(l = canvas.scene) == null ? void 0 : l.id}:`, c), c;
    }
  }), Bh(t.timeline, a, e, { skipToStep: r, onStepComplete: o }), { tl: a };
}
u(hv, "buildTimeline");
function jh(t, e) {
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
        (n = r.parallel) != null && n.branches && jh(r.parallel.branches, e);
      }
}
u(jh, "applyParallelStatesForSkip");
function Bh(t, e, n, i = {}) {
  const { skipToStep: r, onStepComplete: o } = i;
  let s = -1;
  for (const a of t) {
    if (a.sound != null) {
      if (r != null && s < r) continue;
      const h = a.sound, { duration: f, loop: m, fireAndForget: g } = h, y = e.step();
      if (y.before(() => {
        fv(h);
      }), f && f > 0)
        if (g) {
          if (m && h.id) {
            const b = h.id, v = f;
            y.before(() => {
              setTimeout(() => el(b), v);
            });
          }
        } else
          e.delay(f), m && e.step().before(() => {
            el(h.id);
          });
      continue;
    }
    if (a.stopSound != null) {
      if (r != null && s < r) continue;
      const h = a.stopSound;
      e.step().before(() => {
        el(h);
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
        jh(a.parallel.branches, n);
        continue;
      }
      const h = a.parallel, f = h.branches.map((m) => (g) => Bh(m, g, n));
      e.parallel(f, {
        join: h.join ?? "all",
        overflow: h.overflow ?? "detach"
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
        } catch (h) {
          console.warn(`[${L}] Cinematic: error applying skipped step.before:`, h);
        }
      if (a.after)
        try {
          Me(a.after, n), Ji(a.after, n);
        } catch (h) {
          console.warn(`[${L}] Cinematic: error applying skipped step.after:`, h);
        }
      continue;
    }
    const l = s, c = e.step();
    a.before && c.before(() => {
      var h;
      try {
        Me(a.before, n), Ji(a.before, n);
      } catch (f) {
        throw console.error(`[${L}] Cinematic: error in step.before callback on scene ${(h = canvas.scene) == null ? void 0 : h.id}:`, f), f;
      }
    });
    const d = a.duration ?? 500;
    for (const h of a.tweens) {
      const f = qh(h, n);
      f && c.add(f.type, f.params, { ...f.opts, durationMS: d });
    }
    c.after(() => {
      var h;
      try {
        a.after && (Me(a.after, n), Ji(a.after, n)), o == null || o(l);
      } catch (f) {
        throw console.error(`[${L}] Cinematic: error in step.after callback on scene ${(h = canvas.scene) == null ? void 0 : h.id}:`, f), f;
      }
    });
  }
}
u(Bh, "compileCinematicEntries");
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
u(Qi, "validateStateMap");
function Ec(t, e, n, i) {
  var r;
  for (let o = 0; o < t.length; o++) {
    const s = t[o], a = `${e}[${o}]`;
    if (!(s.delay != null || s.await != null || s.emit != null) && !(s.transitionTo != null || s.sound != null || s.stopSound != null)) {
      if ((r = s.parallel) != null && r.branches) {
        for (let l = 0; l < s.parallel.branches.length; l++)
          Ec(s.parallel.branches[l], `${a}.parallel.branches[${l}]`, n, i);
        continue;
      }
      if (Qi(s.before, `${a}.before`, i), Qi(s.after, `${a}.after`, i), s.tweens)
        for (let l = 0; l < s.tweens.length; l++) {
          const c = s.tweens[l], d = `${a}.tweens[${l}]`;
          if (!c.type) {
            i.push({ path: d, level: "error", message: "Missing 'type' field" });
            continue;
          }
          const h = vr(c.type);
          if (!h) {
            i.push({ path: d, level: "error", message: `Unknown tween type: "${c.type}"` });
            continue;
          }
          if (n)
            try {
              const f = qh(c, n);
              f ? h.validate(f.params) : c.target && i.push({ path: d, level: "warn", message: `Target "${c.target}" could not be resolved for compilation` });
            } catch (f) {
              i.push({ path: d, level: "error", message: f.message });
            }
          n && c.target && !n.has(c.target) && i.push({ path: `${d}.target`, level: "warn", message: `Target "${c.target}" is not resolved` });
        }
    }
  }
}
u(Ec, "validateEntries");
function mv(t, e = null) {
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
      Qi(a.setup, `${l}.setup`, n), Qi(a.landing, `${l}.landing`, n), a.timeline && Array.isArray(a.timeline) && Ec(a.timeline, `${l}.timeline`, e, n), a.next && typeof a.next == "string" && !t.segments[a.next] && n.push({ path: `${l}.next`, level: "error", message: `Next segment "${a.next}" not found` });
    }
  } else
    Qi(t.setup, "setup", n), Qi(t.landing, "landing", n), t.timeline && Array.isArray(t.timeline) && Ec(t.timeline, "timeline", e, n);
  return n;
}
u(mv, "validateCinematicDeep");
const tl = 5, fd = /* @__PURE__ */ new Set(["click", "tile-click", "keypress"]);
var ce, ye, We, Ne, Et, $r, Sc, Uh, K, Pe, is, ke, It;
const ae = class ae {
  constructor(e = null, { loadedHash: n = null, cinematicName: i = "default", segmentName: r = null } = {}) {
    _(this, K);
    _(this, ce);
    _(this, ye);
    _(this, We);
    _(this, Ne);
    var s;
    O(this, ce, e ?? ae.empty()), O(this, ye, i), O(this, Ne, n);
    const o = (s = p(this, ce).cinematics) == null ? void 0 : s[p(this, ye)];
    O(this, We, r ?? (o == null ? void 0 : o.entry) ?? "main");
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
    var b;
    const { trigger: n, tracking: i, synchronized: r, setup: o, landing: s, timeline: a = [] } = e;
    if (!a.some(
      (v) => {
        var w;
        return v.await != null && fd.has(((w = v.await) == null ? void 0 : w.event) ?? "click");
      }
    )) {
      const v = a.filter((S) => S.transitionTo == null), w = a.find((S) => S.transitionTo != null), E = { timeline: v };
      if (o && Object.keys(o).length && (E.setup = o), s && Object.keys(s).length && (E.landing = s), w) {
        const S = w.transitionTo;
        S.scene && S.cinematic ? E.next = { segment: S.cinematic, scene: S.scene } : S.cinematic;
      }
      return {
        trigger: n,
        tracking: i,
        ...r ? { synchronized: r } : {},
        entry: "main",
        segments: { main: E }
      };
    }
    const c = {};
    let d = [], h = 1, f = null;
    const m = [];
    function g() {
      const v = `segment-${h++}`, w = { timeline: [...d] };
      return f && (w.gate = f), c[v] = w, m.push(v), d = [], f = null, v;
    }
    u(g, "flushSegment");
    for (const v of a)
      if (v.transitionTo == null) {
        if (v.await != null && fd.has(((b = v.await) == null ? void 0 : b.event) ?? "click")) {
          g(), f = { ...v.await }, delete f.event, f = { event: v.await.event ?? "click", ...f };
          continue;
        }
        d.push(v);
      }
    (d.length > 0 || f) && g();
    for (let v = 0; v < m.length - 1; v++)
      c[m[v]].next = m[v + 1];
    m.length > 0 && (o && Object.keys(o).length && (c[m[0]].setup = o), s && Object.keys(s).length && (c[m[m.length - 1]].landing = s));
    const y = a.find((v) => v.transitionTo != null);
    if (y && m.length > 0) {
      const v = y.transitionTo, w = c[m[m.length - 1]];
      v.scene && v.cinematic && (w.next = { segment: v.cinematic, scene: v.scene });
    }
    return {
      trigger: n,
      tracking: i,
      ...r ? { synchronized: r } : {},
      entry: m[0] ?? "main",
      segments: c
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
      (i = o.timeline) != null && i.length && (o.timeline = T(r = ae, Et, Sc).call(r, o.timeline));
    return n;
  }
  static fromScene(e, n = "default") {
    var s;
    const i = e == null ? void 0 : e.getFlag(L, "cinematic");
    let r = i ? foundry.utils.deepClone(i) : null;
    const o = i ? T(s = ae, Et, Uh).call(s, i) : null;
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
    return p(this, ce);
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
    return Object.keys(p(this, ce).cinematics);
  }
  switchCinematic(e) {
    if (!p(this, ce).cinematics[e]) return this;
    const n = p(this, ce).cinematics[e];
    return new ae(foundry.utils.deepClone(p(this, ce)), {
      loadedHash: p(this, Ne),
      cinematicName: e,
      segmentName: n.entry ?? "main"
    });
  }
  addCinematic(e) {
    if (!e || p(this, ce).cinematics[e]) return this;
    const n = foundry.utils.deepClone(p(this, ce));
    return n.cinematics[e] = ae.emptyCinematic(), new ae(n, {
      loadedHash: p(this, Ne),
      cinematicName: e,
      segmentName: "main"
    });
  }
  removeCinematic(e) {
    if (Object.keys(p(this, ce).cinematics).length <= 1) return this;
    if (!p(this, ce).cinematics[e]) return this;
    const i = foundry.utils.deepClone(p(this, ce));
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
    if (!p(this, ce).cinematics[e]) return this;
    if (p(this, ce).cinematics[n]) return this;
    const i = foundry.utils.deepClone(p(this, ce)), r = {};
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
    return (n = p(this, K, Pe).segments) != null && n[e] ? new ae(foundry.utils.deepClone(p(this, ce)), {
      loadedHash: p(this, Ne),
      cinematicName: p(this, ye),
      segmentName: e
    }) : this;
  }
  addSegment(e, n = null) {
    var o;
    if (!e || (o = p(this, K, Pe).segments) != null && o[e]) return this;
    const i = foundry.utils.deepClone(p(this, ce)), r = i.cinematics[p(this, ye)];
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
    const i = foundry.utils.deepClone(p(this, ce)), r = i.cinematics[p(this, ye)], o = r.segments[e].next;
    for (const [, c] of Object.entries(r.segments))
      (c.next === e || typeof c.next == "object" && ((l = c.next) == null ? void 0 : l.segment) === e) && (c.next = o ?? void 0, c.next || delete c.next);
    delete r.segments[e], r.entry === e && (r.entry = Object.keys(r.segments)[0]);
    const s = p(this, We) === e ? r.entry : p(this, We);
    return new ae(i, {
      loadedHash: p(this, Ne),
      cinematicName: p(this, ye),
      segmentName: s
    });
  }
  renameSegment(e, n) {
    var a, l, c;
    if (!e || !n || e === n) return this;
    if (!((a = p(this, K, Pe).segments) != null && a[e])) return this;
    if ((l = p(this, K, Pe).segments) != null && l[n]) return this;
    const i = foundry.utils.deepClone(p(this, ce)), r = i.cinematics[p(this, ye)], o = {};
    for (const [d, h] of Object.entries(r.segments))
      o[d === e ? n : d] = h;
    r.segments = o;
    for (const [, d] of Object.entries(r.segments))
      d.next === e ? d.next = n : typeof d.next == "object" && ((c = d.next) == null ? void 0 : c.segment) === e && (d.next.segment = n);
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
      const o = r.parallel.branches.map((s, a) => a !== n ? s : s.filter((l, c) => c !== i));
      return { ...r, parallel: { ...r.parallel, branches: o } };
    });
  }
  updateBranchEntry(e, n, i, r) {
    return T(this, K, It).call(this, e, (o) => {
      if (!o.parallel) return o;
      const s = o.parallel.branches.map((a, l) => l !== n ? a : a.map((c, d) => d !== i ? c : { ...foundry.utils.deepClone(c), ...r }));
      return { ...o, parallel: { ...o.parallel, branches: s } };
    });
  }
  moveBranchEntry(e, n, i, r) {
    return i === r ? this : T(this, K, It).call(this, e, (o) => {
      if (!o.parallel) return o;
      const s = o.parallel.branches.map((a, l) => {
        if (l !== n) return a;
        const c = [...a];
        if (i < 0 || i >= c.length || r < 0 || r >= c.length) return a;
        const [d] = c.splice(i, 1);
        return c.splice(r, 0, d), c;
      });
      return { ...o, parallel: { ...o.parallel, branches: s } };
    });
  }
  // ── Persistence ──────────────────────────────────────────────────────
  async save(e) {
    const n = { ...foundry.utils.deepClone(p(this, ce)), version: tl };
    await e.setFlag(L, "cinematic", n);
  }
  /** Returns the active cinematic's data (for validation/export). */
  toJSON() {
    return foundry.utils.deepClone(p(this, K, Pe));
  }
  /** Returns the entire v4 flag structure. */
  toFullJSON() {
    return foundry.utils.deepClone(p(this, ce));
  }
};
ce = new WeakMap(), ye = new WeakMap(), We = new WeakMap(), Ne = new WeakMap(), Et = new WeakSet(), $r = /* @__PURE__ */ u(function(e) {
  const { duration: n, detach: i, ...r } = e;
  return r;
}, "#stripTween"), Sc = /* @__PURE__ */ u(function(e) {
  var i, r;
  const n = [];
  for (const o of e) {
    if (o.delay != null || o.await != null || o.emit != null || o.transitionTo != null || o.sound != null || o.stopSound != null) {
      n.push(o);
      continue;
    }
    if ((i = o.parallel) != null && i.branches) {
      const l = o.parallel.branches.map(
        (c) => {
          var d;
          return T(d = ae, Et, Sc).call(d, c);
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
      const l = Math.max(500, ...o.tweens.map((h) => h.duration ?? 0)), { tweens: c, ...d } = o;
      n.push({
        ...d,
        duration: l,
        tweens: c.map(T(ae, Et, $r))
      });
    } else if (s.length === 0) {
      const l = Math.max(500, ...a.map((h) => h.duration ?? 0)), { tweens: c, ...d } = o;
      n.push({
        ...d,
        duration: l,
        tweens: a.map(T(ae, Et, $r))
      });
    } else {
      const l = Math.max(500, ...s.map((f) => f.duration ?? 0)), c = Math.max(500, ...a.map((f) => f.duration ?? 0)), { tweens: d, ...h } = o;
      n.push({
        parallel: {
          branches: [
            [{ ...h, duration: l, tweens: s.map(T(ae, Et, $r)) }],
            [{ duration: c, tweens: a.map(T(ae, Et, $r)) }]
          ],
          join: "all",
          overflow: "detach"
        }
      });
    }
  }
  return n;
}, "#migrateTimelineV5"), Uh = /* @__PURE__ */ u(function(e) {
  return foundry.utils.deepClone(e);
}, "#computeHash"), K = new WeakSet(), Pe = /* @__PURE__ */ u(function() {
  return p(this, ce).cinematics[p(this, ye)];
}, "#active"), // ── Internal ─────────────────────────────────────────────────────────
/** Clone the full state with a patch to the active cinematic (cinematic-level props). */
is = /* @__PURE__ */ u(function(e) {
  const n = foundry.utils.deepClone(p(this, ce));
  return Object.assign(n.cinematics[p(this, ye)], e), new ae(n, {
    loadedHash: p(this, Ne),
    cinematicName: p(this, ye),
    segmentName: p(this, We)
  });
}, "#cloneActive"), /** Clone the full state with a patch to the active segment within the active cinematic. */
ke = /* @__PURE__ */ u(function(e) {
  const n = foundry.utils.deepClone(p(this, ce)), i = n.cinematics[p(this, ye)].segments[p(this, We)];
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
It = /* @__PURE__ */ u(function(e, n) {
  const i = this.activeSegment;
  if (!i || e < 0 || e >= i.timeline.length) return this;
  const r = i.timeline.map((o, s) => s !== e ? o : n(foundry.utils.deepClone(o)));
  return T(this, K, ke).call(this, { timeline: r });
}, "#mutateEntry"), _(ae, Et), u(ae, "CinematicState");
let nn = ae;
const hd = [
  { value: "tile-prop", label: "Tile Prop" },
  { value: "light-color", label: "Light Color" },
  { value: "light-state", label: "Light State" },
  { value: "particles-prop", label: "Particles Prop" },
  { value: "camera-pan", label: "Camera Pan" },
  { value: "token-prop", label: "Token Prop" },
  { value: "drawing-prop", label: "Drawing Prop" },
  { value: "sound-prop", label: "Sound Prop" }
], Vh = {
  "tile-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y, width, height" },
  "token-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y" },
  "drawing-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y" },
  "sound-prop": { form: "prop", attribute: "volume", value: 0.5, placeholder: "volume, radius" },
  "particles-prop": { form: "particles", attribute: "alpha", value: 1, placeholder: "alpha, rate, speed, size" },
  "camera-pan": { form: "camera", x: 0, y: 0, scale: 1 },
  "light-color": { form: "lightColor", toColor: "#ffffff", toAlpha: "", mode: "oklch" },
  "light-state": { form: "lightState", enabled: !0 }
}, gv = [
  { value: "canvasReady", label: "Canvas Ready" },
  { value: "manual", label: "Manual Only" }
];
function md(t) {
  return t && (t.split("/").pop() || "").replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "-") || "";
}
u(md, "soundIdFromPath");
function gd(t) {
  return t ? new Promise((e) => {
    const n = new Audio(t);
    n.addEventListener("loadedmetadata", () => {
      e(Math.round(n.duration * 1e3));
    }), n.addEventListener("error", () => e(0));
  }) : Promise.resolve(0);
}
u(gd, "loadAudioDurationMs");
const Kn = 40, jr = 24, to = 50, pd = 50, mi = 60, vi = 10, nl = 16, Gh = 40, Wh = 20, pv = 90, yd = 70, bd = 8;
function $a(t) {
  return { stepDuration: Math.max(500, t.duration ?? 500), detachOverflow: 0 };
}
u($a, "computeStepDurations");
function yv(t) {
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
u(yv, "computeParallelDuration");
function uu(t) {
  return t.reduce((e, n) => n.delay != null ? e + n.delay : n.await != null || n.emit != null || n.transitionTo != null ? e : n.sound != null ? e + (n.sound.fireAndForget ? 0 : n.sound.duration ?? 0) : n.stopSound != null ? e : n.parallel != null ? e + yv(n) : e + $a(n).stepDuration, 0);
}
u(uu, "computeTotalDuration");
function bv(t, e) {
  if (t <= 0) return 0.1;
  const n = e / t;
  return Math.max(0.03, Math.min(0.5, n));
}
u(bv, "computeScale");
function zh(t) {
  const e = t.tweens ?? [];
  if (e.length === 0) return "Empty";
  const n = e[0], i = (n.target ?? "").replace(/^tag:/, "#"), r = n.attribute ?? "";
  return n.type === "camera-pan" ? "Pan" : r === "alpha" ? `Fade ${i}` : r === "x" || r === "y" ? `Move ${i}` : n.type === "light-color" ? `Light ${i}` : n.type === "sound-prop" ? `Sound ${i}` : i ? `${i}` : "Step";
}
u(zh, "deriveStepLabel");
function vv(t, e, n, i, r) {
  var c, d;
  const o = [], s = [], a = [];
  let l = e;
  for (let h = 0; h < t.length; h++) {
    const f = t[h], m = `${i}.${h}`, g = r === m;
    if (f.delay != null) {
      const y = Math.max(Wh, f.delay * n);
      o.push({ type: "delay", leftPx: l, widthPx: y, label: `${f.delay}ms`, entryPath: m, selected: g }), l += y;
    } else if (f.await != null) {
      const y = ((c = f.await) == null ? void 0 : c.event) ?? "click", b = y === "tile-click" ? "fa-hand-pointer" : y === "signal" ? "fa-bolt" : "fa-pause";
      o.push({ type: "await", leftPx: l, widthPx: nl, label: y, entryPath: m, selected: g, isGate: !0, gateIcon: b }), ((d = f.await) == null ? void 0 : d.event) === "signal" && a.push({ signal: f.await.signal, centerPx: l + nl / 2 }), l += nl;
    } else if (f.emit != null)
      o.push({ type: "emit", leftPx: l, widthPx: vi, label: "emit", entryPath: m, selected: g, isMarker: !0 }), s.push({ signal: f.emit, centerPx: l + vi / 2 });
    else if (f.sound != null) {
      const y = (f.sound.src || "").split("/").pop() || "Sound", b = f.sound.duration ?? 0;
      if (f.sound.fireAndForget ?? !1)
        o.push({ type: "sound", leftPx: l, widthPx: vi, label: y, entryPath: m, selected: g, isMarker: !0 });
      else {
        const w = b > 0 ? Math.max(mi, b * n) : mi, E = (f.sound.loop ?? !1) && b <= 0;
        o.push({ type: "sound", leftPx: l, widthPx: w, label: y, entryPath: m, selected: g, hasTrailingArrow: E }), l += w;
      }
    } else if (f.stopSound != null)
      o.push({ type: "stopSound", leftPx: l, widthPx: vi, label: "Stop", entryPath: m, selected: g, isMarker: !0 });
    else {
      const { stepDuration: y } = $a(f), b = Math.max(Gh, y * n), v = zh(f);
      o.push({ type: "step", leftPx: l, widthPx: b, label: v, entryPath: m, selected: g }), l += b;
    }
  }
  return { blocks: o, width: l - e, emits: s, awaits: a };
}
u(vv, "computeBranchLane");
function vd(t) {
  return jr + t * Kn;
}
u(vd, "laneIndexToY");
function wv(t, e) {
  const n = [];
  for (const i of t.emits)
    for (const r of t.awaits) {
      if (i.signal !== r.signal) continue;
      const o = i.centerPx, s = vd(i.laneIndex) + Kn / 2, a = r.centerPx, l = vd(r.laneIndex) + Kn / 2, c = l - s, d = (o + a) / 2, h = s + Math.sign(c || 1) * Math.min(40, Math.abs(c) * 0.5 + 20), f = l - Math.sign(c || 1) * Math.min(40, Math.abs(c) * 0.5 + 20);
      n.push({
        pathD: `M ${o} ${s} C ${d} ${h}, ${d} ${f}, ${a} ${l}`,
        signal: i.signal
      });
    }
  return n;
}
u(wv, "computeSignalArcs");
function Ev(t, e) {
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
u(Ev, "computeTimeMarkers");
function Sv(t) {
  const e = [];
  for (let n = 0; n < t.length - 1; n++) {
    const i = t[n], r = t[n + 1], o = i.leftPx + i.widthPx + (r.leftPx - (i.leftPx + i.widthPx)) / 2, s = jr + Kn / 2;
    let a;
    if (i.entryPath === "setup")
      a = 0;
    else {
      if (i.entryPath === "landing")
        continue;
      if (i.entryPath.startsWith("timeline.")) {
        const c = i.entryPath.split(".");
        a = Number(c[1]) + 1;
      } else
        continue;
    }
    const l = r.entryPath === "landing";
    e.push({ leftPx: o, topPx: s, insertIndex: a, lane: "main", isEnd: l });
  }
  return e;
}
u(Sv, "computeInsertionPoints");
function Cv(t, { selectedPath: e, windowWidth: n }) {
  const i = uu(t), r = n - 70 - 100, o = bv(i, r), s = [], a = [], l = { emits: [], awaits: [] }, c = [];
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
    const E = t[w], S = `timeline.${w}`, I = e === S;
    if (E.delay != null) {
      const k = Math.max(Wh, E.delay * o);
      s.push({
        type: "delay",
        leftPx: d,
        widthPx: k,
        label: `${E.delay}ms`,
        entryPath: S,
        selected: I
      }), d += k;
    } else if (E.emit != null)
      s.push({
        type: "emit",
        leftPx: d,
        widthPx: vi,
        label: "Emit",
        entryPath: S,
        selected: I,
        isMarker: !0
      }), l.emits.push({
        signal: E.emit,
        centerPx: d + vi / 2,
        laneIndex: 0
      });
    else if (E.sound != null) {
      const k = (E.sound.src || "").split("/").pop() || "Sound", M = E.sound.duration ?? 0;
      if (E.sound.fireAndForget ?? !1) {
        const N = M > 0 ? Math.max(mi, M * o) : mi, x = (E.sound.loop ?? !1) && M <= 0, F = {
          type: "sound",
          leftPx: d,
          widthPx: N,
          label: k,
          entryPath: S,
          selected: I,
          hasTrailingArrow: x
        };
        let A = !1;
        for (const R of c)
          if (R.rightEdgePx <= d) {
            R.blocks.push(F), R.rightEdgePx = d + N, A = !0;
            break;
          }
        A || c.push({
          label: "♫ F&F",
          blocks: [F],
          rightEdgePx: d + N
        });
      } else {
        const N = M > 0 ? Math.max(mi, M * o) : mi, x = (E.sound.loop ?? !1) && M <= 0;
        s.push({
          type: "sound",
          leftPx: d,
          widthPx: N,
          label: k,
          entryPath: S,
          selected: I,
          hasTrailingArrow: x
        }), d += N;
      }
    } else if (E.stopSound != null)
      s.push({
        type: "stopSound",
        leftPx: d,
        widthPx: vi,
        label: "Stop",
        entryPath: S,
        selected: I,
        isMarker: !0
      });
    else if (E.parallel != null) {
      const k = E.parallel.branches ?? [], M = d, $ = [];
      let N = 0;
      for (let F = 0; F < k.length; F++) {
        const A = `timeline.${w}.parallel.branches.${F}`, { blocks: R, width: j, emits: B, awaits: H } = vv(k[F], M, o, A, e);
        $.push({ label: `Br ${F + 1}`, blocks: R }), N = Math.max(N, j);
        const V = a.length * 10 + F + 1;
        for (const Y of B) l.emits.push({ ...Y, laneIndex: V });
        for (const Y of H) l.awaits.push({ ...Y, laneIndex: V });
      }
      const x = Math.max(mi, N);
      s.push({
        type: "parallel",
        leftPx: M,
        widthPx: x,
        label: `${k.length} br`,
        entryPath: S,
        selected: I
      }), a.push({ parallelEntryIndex: w, startPx: M, lanes: $ }), d += x;
    } else {
      const { stepDuration: k } = $a(E), M = Math.max(Gh, k * o), $ = zh(E);
      s.push({
        type: "step",
        leftPx: d,
        widthPx: M,
        label: $,
        entryPath: S,
        selected: I
      }), d += M;
    }
  }
  s.push({
    type: "landing",
    leftPx: d,
    widthPx: pd,
    label: "Landing",
    entryPath: "landing",
    selected: e === "landing"
  }), d += pd;
  const h = a.flatMap((w) => w.lanes), f = h.length;
  for (const w of c)
    h.push({ label: w.label, blocks: w.blocks });
  const m = wv(l, h.length), g = [];
  for (let w = 0; w < c.length; w++) {
    const E = f + w;
    for (const S of c[w].blocks) {
      const I = S.leftPx, k = jr + Kn, M = jr + (1 + E) * Kn + Kn / 2;
      g.push({ x: I, y1: k, y2: M });
    }
  }
  const y = Ev(i, o), b = Sv(s), v = jr + (1 + h.length) * Kn;
  return {
    mainBlocks: s,
    subLanes: h,
    signalArcs: m,
    fafConnectors: g,
    timeMarkers: y,
    insertionPoints: b,
    totalWidthPx: Math.max(d, 200),
    swimlaneHeightPx: v,
    totalDurationMs: i
  };
}
u(Cv, "computeLanes");
function Tv(t) {
  if (t <= 0) return "0s";
  if (t < 1e3) return `${t}ms`;
  const e = t / 1e3;
  return e % 1 === 0 ? `${e}s` : `${e.toFixed(1)}s`;
}
u(Tv, "formatDuration");
function Lv(t, e) {
  var m, g, y, b;
  const n = t.segments ?? {}, i = t.entry ?? "main", r = Object.keys(n);
  if (r.length === 0)
    return { nodes: [], edges: [], totalWidthPx: 0 };
  const o = /* @__PURE__ */ new Set(), s = [];
  let a = i;
  for (; a && typeof a == "string" && n[a] && !o.has(a); )
    o.add(a), s.push(a), a = n[a].next;
  for (const v of r)
    o.has(v) || s.push(v);
  const l = [];
  let c = bd;
  for (const v of s) {
    const w = n[v], E = uu(w.timeline ?? []), S = Tv(E), I = v === i, k = v === e, M = !o.has(v), $ = pv;
    l.push({
      name: v,
      durationMs: E,
      durationLabel: S,
      isEntry: I,
      isActive: k,
      isOrphan: M,
      leftPx: c,
      widthPx: $,
      hasGate: !!w.gate,
      gateEvent: ((m = w.gate) == null ? void 0 : m.event) ?? null
    }), c += $ + yd;
  }
  const d = [], h = new Map(l.map((v) => [v.name, v]));
  for (const v of s) {
    const w = n[v];
    if (!w.next) continue;
    const E = typeof w.next == "string" ? w.next : (g = w.next) == null ? void 0 : g.segment;
    if (!E) continue;
    const S = h.get(v), I = h.get(E);
    if (!S || !I) continue;
    const k = n[E], M = ((y = k == null ? void 0 : k.gate) == null ? void 0 : y.event) ?? null, $ = typeof w.next == "object" && ((b = w.next) == null ? void 0 : b.scene);
    d.push({
      fromName: v,
      toName: E,
      gateLabel: M,
      isCrossScene: $,
      fromRightPx: S.leftPx + S.widthPx,
      toLeftPx: I.leftPx
    });
  }
  const f = c - yd + bd;
  return { nodes: l, edges: d, totalWidthPx: f };
}
u(Lv, "computeSegmentGraph");
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
u(ti, "parseEntryPath");
function ks(t, e) {
  var i, r, o, s;
  const n = ti(t);
  return n ? n.type === "setup" ? e.setup : n.type === "landing" ? e.landing : n.type === "timeline" ? e.timeline[n.index] : n.type === "branch" ? (s = (o = (r = (i = e.timeline[n.index]) == null ? void 0 : i.parallel) == null ? void 0 : r.branches) == null ? void 0 : o[n.branchIndex]) == null ? void 0 : s[n.branchEntryIndex] : null : null;
}
u(ks, "getEntryAtPath");
function wd(t) {
  const e = ti(t);
  return !e || e.type !== "timeline" ? null : e.index;
}
u(wd, "getTimelineIndexFromPath");
function Iv(t) {
  var o, s;
  const e = /* @__PURE__ */ new Set(), i = (o = t.data.cinematics) == null ? void 0 : o[t.activeCinematicName];
  if (!i) return 0;
  function r(a) {
    var l;
    for (const c of a ?? []) {
      if (c.tweens)
        for (const d of c.tweens)
          d.target && e.add(d.target);
      if (c.before) for (const d of Object.keys(c.before)) e.add(d);
      if (c.after) for (const d of Object.keys(c.after)) e.add(d);
      if ((l = c.parallel) != null && l.branches)
        for (const d of c.parallel.branches) r(d);
    }
  }
  if (u(r, "collectFromTimeline"), i.segments)
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
u(Iv, "countUniqueTargets");
function Ov(t, e) {
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
      const c = s[l];
      c && c.delay == null && c.emit == null && c.sound == null && c.stopSound == null && a++;
    }
    return a;
  }
  return 0;
}
u(Ov, "stepNumberForPath");
function kv(t) {
  return {
    isSetup: !0,
    targetCount: Object.keys(t.setup ?? {}).length
  };
}
u(kv, "buildSetupDetail");
function Av(t) {
  return {
    isLanding: !0,
    targetCount: Object.keys(t.landing ?? {}).length
  };
}
u(Av, "buildLandingDetail");
function Mv(t) {
  return { type: "delay", isDelay: !0, delay: t.delay };
}
u(Mv, "buildDelayDetail");
function xv(t) {
  return { type: "emit", isEmit: !0, signal: t.emit };
}
u(xv, "buildEmitDetail");
function _v(t) {
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
u(_v, "buildSoundDetail");
function Nv(t) {
  return {
    type: "stopSound",
    isStopSound: !0,
    stopSoundId: t.stopSound
  };
}
u(Nv, "buildStopSoundDetail");
function $v(t, e) {
  var s;
  const n = t.parallel, i = n.join ?? "all", r = n.overflow ?? "detach", o = (n.branches ?? []).map((a, l) => ({
    branchIndex: l,
    label: `Branch ${l + 1}`,
    entries: (a ?? []).map((c, d) => {
      var E, S;
      const h = c.delay != null, f = c.await != null, m = c.emit != null, g = c.sound != null, y = c.stopSound != null, b = !h && !f && !m && !g && !y;
      let v, w;
      return h ? (v = `${c.delay}ms`, w = "delay") : f ? (v = "Await", w = ((E = c.await) == null ? void 0 : E.event) ?? "click") : m ? (v = "Emit", w = c.emit || "(unnamed)") : g ? (v = "Sound", w = (c.sound.src || "").split("/").pop() || "(none)") : y ? (v = "Stop Sound", w = c.stopSound || "(no id)") : (v = "Step", w = `${((S = c.tweens) == null ? void 0 : S.length) ?? 0} tweens`), { branchEntryIndex: d, isDelay: h, isAwait: f, isEmit: m, isSound: g, isStopSound: y, isStep: b, label: v, sub: w };
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
u($v, "buildParallelDetail");
function Fv(t, e, n, i) {
  const r = ou(), o = (t.tweens ?? []).map((l, c) => {
    const d = `${e}.tweens.${c}`, h = n.has(d), f = l.type ?? "tile-prop", m = hd.find((v) => v.value === f), g = Vh[f], y = (g == null ? void 0 : g.form) ?? "prop", b = l.mode ?? "oklch";
    return {
      tweenIndex: c,
      isExpanded: h,
      type: f,
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
      colorMode: b,
      colorModeIsOklch: b === "oklch",
      colorModeIsHsl: b === "hsl",
      colorModeIsRgb: b === "rgb",
      // Light-state fields
      enabled: l.enabled ?? !0,
      typeOptions: hd.map((v) => ({
        ...v,
        selected: v.value === (l.type ?? "tile-prop")
      })),
      easingOptions: [
        { value: "", label: "(default)", selected: !l.easing },
        ...r.map((v) => ({
          value: v,
          label: v,
          selected: l.easing === v
        }))
      ]
    };
  }), s = Object.keys(t.before ?? {}), a = Object.keys(t.after ?? {});
  return {
    type: "step",
    isStep: !0,
    isDelay: !1,
    stepNumber: Ov(e, i),
    stepDuration: t.duration ?? 1e3,
    tweens: o,
    beforeSummary: s.length ? `${s.length} target${s.length !== 1 ? "s" : ""}` : "(none)",
    afterSummary: a.length ? `${a.length} target${a.length !== 1 ? "s" : ""}` : "(none)"
  };
}
u(Fv, "buildStepDetail");
function Dv(t, { state: e, expandedTweens: n }) {
  const i = ti(t);
  if (!i) return null;
  if (i.type === "setup") return kv(e);
  if (i.type === "landing") return Av(e);
  const r = ks(t, e);
  return r ? r.delay != null ? Mv(r) : r.emit != null ? xv(r) : r.sound != null ? _v(r) : r.stopSound != null ? Nv(r) : r.parallel != null && i.type === "timeline" ? $v(r) : Fv(r, t, n, e) : null;
}
u(Dv, "buildDetail");
function Pv({ state: t, mutate: e }) {
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
        callback: /* @__PURE__ */ u((n) => {
          var r, o, s, a;
          const i = n.find("#cinematic-import-json").val();
          try {
            const l = JSON.parse(i);
            if (typeof l != "object" || l === null || Array.isArray(l))
              throw new Error("Expected a JSON object");
            if (l.cinematics)
              e(() => new nn(l));
            else if (l.segments !== void 0) {
              const c = { version: 4, cinematics: { [t.activeCinematicName]: l } };
              e(() => new nn(c, { cinematicName: t.activeCinematicName }));
            } else if (l.timeline !== void 0) {
              const c = { version: 3, cinematics: { [t.activeCinematicName]: l } };
              e(() => new nn(c, { cinematicName: t.activeCinematicName }));
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
u(Pv, "showImportDialog");
function As(t, { state: e, mutate: n }) {
  const i = t === "setup" ? e.setup : e.landing, r = JSON.stringify(i ?? {}, null, 2);
  new Dialog({
    title: `Edit ${t.charAt(0).toUpperCase() + t.slice(1)}`,
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON map of target selector → property overrides:</p>
			<textarea id="cinematic-json-edit" style="width:100%;height:200px;font-family:monospace;font-size:0.8rem">${jt(r)}</textarea>
		`,
    buttons: {
      save: {
        label: "Apply",
        callback: /* @__PURE__ */ u((o) => {
          var a, l;
          const s = o.find("#cinematic-json-edit").val();
          try {
            const c = JSON.parse(s);
            n(t === "setup" ? (d) => d.setSetup(c) : (d) => d.setLanding(c));
          } catch (c) {
            (l = (a = ui.notifications) == null ? void 0 : a.error) == null || l.call(a, `Invalid JSON: ${c.message}`);
          }
        }, "callback")
      },
      cancel: { label: "Cancel" }
    },
    default: "save"
  }).render(!0);
}
u(As, "showEditJsonDialog");
function Ed(t, { selectedPath: e, state: n, mutate: i }) {
  const r = ks(e, n);
  if (!r || r.delay != null) return;
  const o = r[t] ?? {}, s = JSON.stringify(o, null, 2);
  new Dialog({
    title: `Edit Step ${t.charAt(0).toUpperCase() + t.slice(1)}`,
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON map of target selector → property overrides:</p>
			<textarea id="cinematic-json-edit" style="width:100%;height:200px;font-family:monospace;font-size:0.8rem">${jt(s)}</textarea>
		`,
    buttons: {
      save: {
        label: "Apply",
        callback: /* @__PURE__ */ u((a) => {
          var c, d;
          const l = a.find("#cinematic-json-edit").val();
          try {
            const h = JSON.parse(l), f = ti(e);
            (f == null ? void 0 : f.type) === "timeline" ? i((m) => m.updateEntry(f.index, { [t]: h })) : (f == null ? void 0 : f.type) === "branch" && i((m) => m.updateBranchEntry(f.index, f.branchIndex, f.branchEntryIndex, { [t]: h }));
          } catch (h) {
            (d = (c = ui.notifications) == null ? void 0 : c.error) == null || d.call(c, `Invalid JSON: ${h.message}`);
          }
        }, "callback")
      },
      cancel: { label: "Cancel" }
    },
    default: "save"
  }).render(!0);
}
u(Ed, "showEditStepStateDialog");
function Rv({ selectedPath: t, state: e, mutate: n }) {
  const i = ti(t);
  if (!i || i.type !== "timeline") return;
  const r = e.timeline[i.index];
  if (!(r != null && r.parallel)) return;
  const o = JSON.stringify(r.parallel.branches ?? [], null, 2);
  new Dialog({
    title: "Edit Parallel Branches",
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON array of branch timelines:</p>
			<textarea id="cinematic-json-edit" style="width:100%;height:250px;font-family:monospace;font-size:0.8rem">${jt(o)}</textarea>
		`,
    buttons: {
      save: {
        label: "Apply",
        callback: /* @__PURE__ */ u((s) => {
          var l, c;
          const a = s.find("#cinematic-json-edit").val();
          try {
            const d = JSON.parse(a);
            if (!Array.isArray(d)) throw new Error("Expected an array of branches");
            n((h) => h.updateEntry(i.index, {
              parallel: { ...r.parallel, branches: d }
            }));
          } catch (d) {
            (c = (l = ui.notifications) == null ? void 0 : l.error) == null || c.call(l, `Invalid JSON: ${d.message}`);
          }
        }, "callback")
      },
      cancel: { label: "Cancel" }
    },
    default: "save"
  }).render(!0);
}
u(Rv, "showEditParallelJsonDialog");
var Yd, Hn, Qn, rs, Yh;
const kt = class kt extends sn(on) {
  constructor(n = {}) {
    super(n);
    _(this, Qn);
    _(this, Hn, null);
    O(this, Hn, n.scene ?? canvas.scene ?? null);
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
    super._onRender(n, i), T(this, Qn, Yh).call(this);
  }
};
Hn = new WeakMap(), Qn = new WeakSet(), rs = /* @__PURE__ */ u(function() {
  var n, i;
  return (i = (n = game.modules.get(L)) == null ? void 0 : n.api) == null ? void 0 : i.cinematic;
}, "#api"), Yh = /* @__PURE__ */ u(function() {
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
}, "#bindEvents"), u(kt, "CinematicTrackingApplication"), le(kt, "APP_ID", `${L}-cinematic-tracking`), le(kt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Le(kt, kt, "DEFAULT_OPTIONS"),
  {
    id: kt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Yd = Le(kt, kt, "DEFAULT_OPTIONS")) == null ? void 0 : Yd.classes) ?? [], "eidolon-cinematic-tracking-window", "themed"])
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
)), le(kt, "PARTS", {
  content: {
    template: `modules/${L}/templates/cinematic-tracking.html`
  }
});
let Cc = kt;
function Hv(t, e) {
  var n, i, r, o, s, a, l, c, d;
  (n = t.querySelector("[data-action='save']")) == null || n.addEventListener("click", () => e.save()), (i = t.querySelector("[data-action='play-preview']")) == null || i.addEventListener("click", () => e.play()), (r = t.querySelector("[data-action='reset-tracking']")) == null || r.addEventListener("click", () => e.resetTracking()), (o = t.querySelector("[data-action='export-json']")) == null || o.addEventListener("click", () => e.exportJSON()), (s = t.querySelector("[data-action='undo']")) == null || s.addEventListener("click", () => e.undo()), (a = t.querySelector("[data-action='redo']")) == null || a.addEventListener("click", () => e.redo()), (l = t.querySelector("[data-action='validate']")) == null || l.addEventListener("click", () => e.validate()), (c = t.querySelector("[data-action='import-json']")) == null || c.addEventListener("click", () => e.importJSON()), (d = t.querySelector("[data-action='open-tracking']")) == null || d.addEventListener("click", () => {
    new Cc({ scene: e.scene }).render(!0);
  });
}
u(Hv, "bindToolbarEvents");
function qv(t, e) {
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
          callback: /* @__PURE__ */ u((s) => {
            var l, c, d, h, f, m, g;
            const a = (l = s.find("#cinematic-new-name").val()) == null ? void 0 : l.trim();
            if (!a) {
              (d = (c = ui.notifications) == null ? void 0 : c.warn) == null || d.call(c, "Name cannot be empty.");
              return;
            }
            if (/[.\s]/.test(a)) {
              (f = (h = ui.notifications) == null ? void 0 : h.warn) == null || f.call(h, "Name cannot contain dots or spaces.");
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
    var l, c;
    if (e.state.listCinematicNames().length <= 1) {
      (c = (l = ui.notifications) == null ? void 0 : l.warn) == null || c.call(l, "Cannot remove the last cinematic.");
      return;
    }
    const a = e.state.activeCinematicName;
    new Dialog({
      title: "Remove Cinematic",
      content: `<p>Remove cinematic "${a}"? This cannot be undone after saving.</p>`,
      buttons: {
        ok: {
          label: "Remove",
          callback: /* @__PURE__ */ u(() => {
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
      content: `<label style="display:flex;align-items:center;gap:0.5rem"><span>Name:</span><input id="cinematic-rename" type="text" style="flex:1" value="${jt(s)}" /></label>`,
      buttons: {
        ok: {
          label: "Rename",
          callback: /* @__PURE__ */ u((a) => {
            var c, d, h, f, m, g, y;
            const l = (c = a.find("#cinematic-rename").val()) == null ? void 0 : c.trim();
            if (!l) {
              (h = (d = ui.notifications) == null ? void 0 : d.warn) == null || h.call(d, "Name cannot be empty.");
              return;
            }
            if (/[.\s]/.test(l)) {
              (m = (f = ui.notifications) == null ? void 0 : f.warn) == null || m.call(f, "Name cannot contain dots or spaces.");
              return;
            }
            if (l !== s) {
              if (e.state.listCinematicNames().includes(l)) {
                (y = (g = ui.notifications) == null ? void 0 : g.warn) == null || y.call(g, "Name already exists.");
                return;
              }
              e.mutate((b) => b.renameCinematic(s, l));
            }
          }, "callback")
        },
        cancel: { label: "Cancel" }
      },
      default: "ok"
    }).render(!0);
  });
}
u(qv, "bindCinematicSelectorEvents");
function jv(t, e) {
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
        const a = wd(n), l = wd(s);
        a != null && l != null && (e.selectedPath === n && e.setSelectedPath(s), e.mutate((c) => c.moveEntry(a, l)));
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
u(jv, "bindSwimlaneEvents");
function Bv(t, e) {
  var n, i, r, o, s, a, l, c, d, h, f;
  (n = t.querySelector("[data-action='delete-entry']")) == null || n.addEventListener("click", () => {
    const m = e.parseEntryPath(e.selectedPath);
    m && (m.type === "timeline" ? (e.mutate((g) => g.removeEntry(m.index)), e.setSelectedPath(null)) : m.type === "branch" && (e.mutate((g) => g.removeBranchEntry(m.index, m.branchIndex, m.branchEntryIndex)), e.setSelectedPath(null)));
  }), (i = t.querySelector("[data-action='step-duration']")) == null || i.addEventListener("input", (m) => {
    const g = e.parseEntryPath(e.selectedPath);
    if (!g) return;
    const y = Number(m.target.value) || 0;
    g.type === "timeline" ? e.mutate((b) => b.updateStepDuration(g.index, y)) : g.type === "branch" && e.mutate((b) => b.updateBranchEntry(g.index, g.branchIndex, g.branchEntryIndex, { duration: Math.max(0, y) }));
  }), (r = t.querySelector("[data-action='add-tween']")) == null || r.addEventListener("click", () => {
    const m = e.parseEntryPath(e.selectedPath);
    if (m) {
      if (m.type === "timeline")
        e.mutate((g) => g.addTween(m.index));
      else if (m.type === "branch") {
        const g = e.getEntryAtPath(e.selectedPath);
        if (!g) return;
        const y = { type: "tile-prop", target: "", attribute: "alpha", value: 1 }, b = [...g.tweens ?? [], y];
        e.mutate((v) => v.updateBranchEntry(m.index, m.branchIndex, m.branchEntryIndex, { tweens: b }));
      }
    }
  }), (o = t.querySelector("[data-action='change-delay']")) == null || o.addEventListener("change", (m) => {
    const g = e.parseEntryPath(e.selectedPath);
    if (!g) return;
    const y = Number(m.target.value) || 0;
    g.type === "timeline" ? e.mutate((b) => b.updateEntry(g.index, { delay: y })) : g.type === "branch" && e.mutate((b) => b.updateBranchEntry(g.index, g.branchIndex, g.branchEntryIndex, { delay: y }));
  }), (s = t.querySelector("[data-action='edit-setup']")) == null || s.addEventListener("click", () => {
    As("setup", { state: e.state, mutate: e.mutate });
  }), (a = t.querySelector("[data-action='edit-landing']")) == null || a.addEventListener("click", () => {
    As("landing", { state: e.state, mutate: e.mutate });
  }), (l = t.querySelector("[data-action='edit-before']")) == null || l.addEventListener("click", () => {
    Ed("before", { selectedPath: e.selectedPath, state: e.state, mutate: e.mutate });
  }), (c = t.querySelector("[data-action='edit-after']")) == null || c.addEventListener("click", () => {
    Ed("after", { selectedPath: e.selectedPath, state: e.state, mutate: e.mutate });
  }), (d = t.querySelector("[data-action='change-trigger']")) == null || d.addEventListener("change", (m) => {
    e.mutate((g) => g.setTrigger(m.target.value));
  }), (h = t.querySelector("[data-action='change-tracking']")) == null || h.addEventListener("change", (m) => {
    e.mutate((g) => g.setTracking(m.target.checked));
  }), (f = t.querySelector("[data-action='change-synchronized']")) == null || f.addEventListener("change", (m) => {
    e.mutate((g) => g.setSynchronized(m.target.checked));
  });
}
u(Bv, "bindDetailPanelEvents");
const fr = /* @__PURE__ */ new WeakMap(), Ms = /* @__PURE__ */ new Set(), xs = /* @__PURE__ */ new Set(), Sd = {
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
  var g, y, b;
  if (!t) return !1;
  hr(t);
  const n = e.mode ?? (e.color != null ? "custom" : "hover"), i = Sd[n] ?? Sd.hover, r = e.color ?? i.borderColor, o = e.alpha ?? i.borderAlpha, s = e.color ?? i.spriteTint, a = i.spriteAlpha, l = e.pulse ?? i.pulse, c = { border: null, sprite: null, pulseData: null, mode: n }, d = ((g = t.document) == null ? void 0 : g.width) ?? t.w ?? 100, h = ((y = t.document) == null ? void 0 : y.height) ?? t.h ?? 100, f = new PIXI.Graphics();
  f.lineStyle(i.borderWidth, r, o), f.drawRect(0, 0, d, h), t.addChild(f), c.border = f;
  const m = Uv(t, s, a);
  if (m && (canvas.controls.debug.addChild(m), xs.add(m), c.sprite = m), l && ((b = canvas.app) != null && b.ticker)) {
    const v = {
      elapsed: 0,
      fn: /* @__PURE__ */ u((w) => {
        v.elapsed += w;
        const E = (Math.sin(v.elapsed * 0.05) + 1) / 2;
        c.border && (c.border.alpha = o * (0.4 + 0.6 * E)), c.sprite && (c.sprite.alpha = a * (0.5 + 0.5 * E));
      }, "fn")
    };
    canvas.app.ticker.add(v.fn), c.pulseData = v, Ms.add(v);
  }
  return fr.set(t, c), !0;
}
u(_s, "addHighlight");
function hr(t) {
  var n, i;
  if (!t) return;
  const e = fr.get(t);
  e && (e.pulseData && ((i = (n = canvas.app) == null ? void 0 : n.ticker) == null || i.remove(e.pulseData.fn), Ms.delete(e.pulseData)), e.border && (e.border.parent && e.border.parent.removeChild(e.border), e.border.destroy({ children: !0 })), e.sprite && (e.sprite.parent && e.sprite.parent.removeChild(e.sprite), e.sprite.destroy({ children: !0 }), xs.delete(e.sprite)), fr.delete(t));
}
u(hr, "removeHighlight");
function Kh(t) {
  return fr.has(t);
}
u(Kh, "hasHighlight");
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
      for (const c of l) {
        const d = fr.get(c);
        d && (d.border && (d.border.parent && d.border.parent.removeChild(d.border), d.border.destroy({ children: !0 })), fr.delete(c));
      }
}
u(os, "clearAllHighlights");
function Uv(t, e, n) {
  var o;
  const i = t.mesh;
  if (!((o = i == null ? void 0 : i.texture) != null && o.baseTexture)) return null;
  const r = PIXI.Sprite.from(i.texture);
  return r.isSprite = !0, r.anchor.set(i.anchor.x, i.anchor.y), r.width = i.width, r.height = i.height, r.scale = i.scale, r.position = t.center, r.angle = i.angle, r.alpha = n, r.tint = e, r.name = "eidolonPickerHighlight", r;
}
u(Uv, "createTintSprite");
let gi = null;
function Xh(t) {
  var g, y, b;
  gi && gi.cancel();
  const { placeableType: e = "Tile", onPick: n, onCancel: i } = t;
  let r = null;
  const o = `control${e}`, s = `hover${e}`, a = /* @__PURE__ */ u((v, w) => {
    var S;
    if (!w) return;
    const E = v.document ?? v;
    (S = v.release) == null || S.call(v), n(E);
  }, "onControl"), l = /* @__PURE__ */ u((v, w) => {
    w ? (r = v, _s(v, { mode: "pick" })) : r === v && (hr(v), r = null);
  }, "onHoverIn"), c = /* @__PURE__ */ u((v) => {
    v.key === "Escape" && (v.preventDefault(), v.stopPropagation(), m());
  }, "onKeydown"), d = /* @__PURE__ */ u((v) => {
    v.preventDefault(), m();
  }, "onContextMenu"), h = Hooks.on(o, a), f = Hooks.on(s, l);
  document.addEventListener("keydown", c, { capture: !0 }), (g = canvas.stage) == null || g.addEventListener("rightclick", d), (b = (y = ui.notifications) == null ? void 0 : y.info) == null || b.call(y, `Pick mode active — click a ${e.toLowerCase()} on the canvas, or press ESC to cancel.`, { permanent: !1 });
  function m() {
    var v;
    gi && (gi = null, Hooks.off(o, h), Hooks.off(s, f), document.removeEventListener("keydown", c, { capture: !0 }), (v = canvas.stage) == null || v.removeEventListener("rightclick", d), r && (hr(r), r = null), i == null || i());
  }
  return u(m, "cancel"), gi = { cancel: m }, { cancel: m };
}
u(Xh, "enterPickMode");
function Fr() {
  gi && gi.cancel();
}
u(Fr, "cancelPickMode");
const Vv = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cancelPickMode: Fr,
  enterPickMode: Xh
}, Symbol.toStringTag, { value: "Module" }));
var Kd, $e, ze, So, qn, Co, To, nt, jn, ge, Jh, Tc, Qh, Zh, em, Lc, Ic, tm, nm;
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
    _(this, ge);
    /** @type {string[]} Current selections (selector strings). */
    _(this, $e, []);
    /** @type {boolean} Whether pick mode is active. */
    _(this, ze, !1);
    /** @type {string} Placeable type (Tile, Token, etc.). */
    _(this, So, "Tile");
    /** @type {string} Current tag match mode. */
    _(this, qn, "any");
    /** @type {((selectors: string[]) => void) | null} */
    _(this, Co, null);
    /** @type {(() => void) | null} */
    _(this, To, null);
    /** @type {Promise resolve function for the open() API. */
    _(this, nt, null);
    /** @type {PlaceableObject | null} Currently hovered tile in the browser. */
    _(this, jn, null);
    O(this, $e, [...n.selections ?? []]), O(this, So, n.placeableType ?? "Tile"), O(this, Co, n.onApply ?? null), O(this, To, n.onCancel ?? null);
  }
  // ── Context ───────────────────────────────────────────────────────────
  async _prepareContext() {
    var r;
    const n = T(this, ge, Lc).call(this), i = (((r = canvas.tiles) == null ? void 0 : r.placeables) ?? []).map((o, s) => {
      var d, h;
      const a = o.document, l = a.id, c = (d = a.texture) != null && d.src ? a.texture.src.split("/").pop().replace(/\.[^.]+$/, "") : `Tile ${s + 1}`;
      return {
        id: l,
        name: c.length > 20 ? c.slice(0, 18) + "..." : c,
        thumbnailSrc: ((h = a.texture) == null ? void 0 : h.src) ?? null,
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
    super._onRender(n, i), T(this, ge, Jh).call(this), T(this, ge, Ic).call(this);
  }
  async _onClose(n) {
    return p(this, ze) && (Fr(), O(this, ze, !1)), os(), p(this, nt) && (p(this, nt).call(this, null), O(this, nt, null)), super._onClose(n);
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
        onApply: /* @__PURE__ */ u((o) => i(o), "onApply"),
        onCancel: /* @__PURE__ */ u(() => i(null), "onCancel")
      });
      O(r, nt, i), r.render(!0);
    });
  }
};
$e = new WeakMap(), ze = new WeakMap(), So = new WeakMap(), qn = new WeakMap(), Co = new WeakMap(), To = new WeakMap(), nt = new WeakMap(), jn = new WeakMap(), ge = new WeakSet(), Jh = /* @__PURE__ */ u(function() {
  var o, s, a, l;
  const n = this.element;
  if (!(n instanceof HTMLElement)) return;
  const i = n.querySelector("[data-role='tag-input']"), r = n.querySelector("[data-role='tag-mode']");
  r == null || r.addEventListener("change", (c) => {
    O(this, qn, c.target.value);
  }), i == null || i.addEventListener("input", () => {
    T(this, ge, Qh).call(this, n);
  }), i == null || i.addEventListener("keydown", (c) => {
    c.key === "Enter" && (c.preventDefault(), T(this, ge, Tc).call(this, n));
  }), (o = n.querySelector("[data-action='add-tag-selector']")) == null || o.addEventListener("click", () => {
    T(this, ge, Tc).call(this, n);
  }), (s = n.querySelector("[data-action='toggle-pick-mode']")) == null || s.addEventListener("click", () => {
    p(this, ze) ? (Fr(), O(this, ze, !1)) : (O(this, ze, !0), Xh({
      placeableType: p(this, So),
      onPick: /* @__PURE__ */ u((c) => {
        T(this, ge, Zh).call(this, c.id);
      }, "onPick"),
      onCancel: /* @__PURE__ */ u(() => {
        O(this, ze, !1), this.render({ force: !0 });
      }, "onCancel")
    })), this.render({ force: !0 });
  }), n.querySelectorAll("[data-action='toggle-tile']").forEach((c) => {
    c.addEventListener("click", () => {
      const d = c.dataset.docId;
      d && T(this, ge, em).call(this, d);
    }), c.addEventListener("mouseenter", () => {
      var f, m;
      const d = c.dataset.docId;
      if (!d) return;
      const h = (m = (f = canvas.tiles) == null ? void 0 : f.placeables) == null ? void 0 : m.find((g) => g.document.id === d);
      h && (O(this, jn, h), _s(h, { mode: "hover" }));
    }), c.addEventListener("mouseleave", () => {
      p(this, jn) && (hr(p(this, jn)), O(this, jn, null), T(this, ge, Ic).call(this));
    });
  }), n.querySelectorAll("[data-action='remove-selection']").forEach((c) => {
    c.addEventListener("click", () => {
      const d = Number(c.dataset.selectionIndex);
      Number.isNaN(d) || (p(this, $e).splice(d, 1), this.render({ force: !0 }));
    });
  }), (a = n.querySelector("[data-action='apply']")) == null || a.addEventListener("click", () => {
    T(this, ge, tm).call(this);
  }), (l = n.querySelector("[data-action='cancel']")) == null || l.addEventListener("click", () => {
    T(this, ge, nm).call(this);
  });
}, "#bindEvents"), // ── Tag helpers ───────────────────────────────────────────────────────
Tc = /* @__PURE__ */ u(function(n) {
  var a;
  const i = n.querySelector("[data-role='tag-input']"), r = (a = i == null ? void 0 : i.value) == null ? void 0 : a.trim();
  if (!r) return;
  const o = r.split(",").map((l) => l.trim()).filter(Boolean);
  if (o.length === 0) return;
  const s = Rh(o, p(this, qn));
  s && !p(this, $e).includes(s) && p(this, $e).push(s), i && (i.value = ""), this.render({ force: !0 });
}, "#addTagSelector"), Qh = /* @__PURE__ */ u(function(n) {
  var h, f;
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
  const a = window.Tagger ?? ((h = game.modules.get("tagger")) == null ? void 0 : h.api);
  if (!a) {
    r.textContent = "Tagger not available";
    return;
  }
  const l = p(this, qn) === "any", c = a.getByTag(s, {
    sceneId: (f = canvas.scene) == null ? void 0 : f.id,
    matchAny: l
  }), d = (c == null ? void 0 : c.length) ?? 0;
  r.textContent = `${d} matching placeable(s)`;
}, "#updateTagPreview"), // ── ID selector helpers ──────────────────────────────────────────────
Zh = /* @__PURE__ */ u(function(n) {
  const i = `id:${n}`;
  p(this, $e).includes(i) || (p(this, $e).push(i), this.render({ force: !0 }));
}, "#addIdSelector"), em = /* @__PURE__ */ u(function(n) {
  const i = `id:${n}`, r = p(this, $e).indexOf(i);
  r >= 0 ? p(this, $e).splice(r, 1) : p(this, $e).push(i), this.render({ force: !0 });
}, "#toggleIdSelector"), /**
 * Get the set of document IDs that are currently selected across all selector types.
 * Resolves tag/tags-any/tags-all selectors to find matching document IDs.
 * @returns {Set<string>}
 */
Lc = /* @__PURE__ */ u(function() {
  const n = /* @__PURE__ */ new Set();
  for (const i of p(this, $e)) {
    const r = cu(i);
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
Ic = /* @__PURE__ */ u(function() {
  var r, o;
  const n = T(this, ge, Lc).call(this), i = ((r = canvas.tiles) == null ? void 0 : r.placeables) ?? [];
  for (const s of i) {
    const a = (o = s.document) == null ? void 0 : o.id;
    if (!a) continue;
    const l = n.has(a), c = s === p(this, jn), d = Kh(s);
    l && !c && !d ? _s(s, { mode: "selected" }) : !l && d && !c && hr(s);
  }
}, "#refreshSelectionHighlights"), // ── Apply / Cancel ──────────────────────────────────────────────────
tm = /* @__PURE__ */ u(function() {
  var i;
  p(this, ze) && (Fr(), O(this, ze, !1)), os();
  const n = [...p(this, $e)];
  (i = p(this, Co)) == null || i.call(this, n), p(this, nt) && (p(this, nt).call(this, n), O(this, nt, null)), this.close({ force: !0 });
}, "#doApply"), nm = /* @__PURE__ */ u(function() {
  var n;
  p(this, ze) && (Fr(), O(this, ze, !1)), os(), (n = p(this, To)) == null || n.call(this), p(this, nt) && (p(this, nt).call(this, null), O(this, nt, null)), this.close({ force: !0 });
}, "#doCancel"), u(mt, "PlaceablePickerApplication"), le(mt, "APP_ID", `${L}-placeable-picker`), le(mt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Le(mt, mt, "DEFAULT_OPTIONS"),
  {
    id: mt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Kd = Le(mt, mt, "DEFAULT_OPTIONS")) == null ? void 0 : Kd.classes) ?? [], "eidolon-placeable-picker-window", "themed"])
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
)), le(mt, "PARTS", {
  content: {
    template: `modules/${L}/templates/placeable-picker.html`
  }
});
let Ns = mt;
function Gv(t, e) {
  t.querySelectorAll("[data-action='toggle-tween-card']").forEach((n) => {
    n.addEventListener("click", (i) => {
      if (i.target.closest("[data-action='delete-tween']")) return;
      const r = Number(n.dataset.tweenIndex), o = `${e.selectedPath}.tweens.${r}`;
      e.expandedTweens.has(o) ? e.expandedTweens.delete(o) : e.expandedTweens.add(o), e.render();
    });
  }), t.querySelectorAll("[data-action='pick-target']").forEach((n) => {
    n.addEventListener("click", async () => {
      var c, d;
      const i = Number(n.dataset.tweenIndex), r = e.parseEntryPath(e.selectedPath);
      if (!r || Number.isNaN(i)) return;
      const o = e.getEntryAtPath(e.selectedPath), s = ((d = (c = o == null ? void 0 : o.tweens) == null ? void 0 : c[i]) == null ? void 0 : d.target) ?? "", a = s ? [s] : [], l = await Ns.open({ selections: a });
      if (l && l.length > 0) {
        if (r.type === "timeline")
          e.mutate((h) => h.updateTween(r.index, i, { target: l[0] }));
        else if (r.type === "branch") {
          const h = (o.tweens ?? []).map((f, m) => m === i ? { ...f, target: l[0] } : f);
          e.mutate((f) => f.updateBranchEntry(r.index, r.branchIndex, r.branchEntryIndex, { tweens: h }));
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
          const l = Vh[a], c = { type: a };
          if (l) {
            const d = l.form ?? "prop";
            d === "prop" || d === "particles" ? Object.assign(c, { attribute: l.attribute, value: l.value }) : d === "camera" ? Object.assign(c, { x: l.x, y: l.y, scale: l.scale }) : d === "lightColor" ? Object.assign(c, { toColor: l.toColor, toAlpha: l.toAlpha, mode: l.mode }) : d === "lightState" && Object.assign(c, { enabled: l.enabled });
          }
          e.queueTweenChange(i, c), e.flushTweenChangesImmediate(), e.render();
        } else
          e.queueTweenChange(i, { [o]: a });
      });
    });
  });
}
u(Gv, "bindTweenFieldEvents");
function Wv(t, e) {
  var i, r, o, s, a, l, c, d, h, f;
  function n(m, g, y) {
    m.type === "timeline" ? e.mutate((b) => b.updateEntry(m.index, { sound: y })) : m.type === "branch" && e.mutate((b) => b.updateBranchEntry(m.index, m.branchIndex, m.branchEntryIndex, { sound: y }));
  }
  u(n, "applySoundPatch"), (i = t.querySelector("[data-action='change-sound-src']")) == null || i.addEventListener("change", async (m) => {
    const g = e.parseEntryPath(e.selectedPath);
    if (!g) return;
    const y = e.getEntryAtPath(e.selectedPath);
    if (!(y != null && y.sound)) return;
    const b = m.target.value, v = { ...y.sound, src: b };
    v.id || (v.id = md(b));
    const w = await gd(b);
    w > 0 && (v.duration = w), n(g, y, v);
  }), (r = t.querySelector("[data-action='pick-sound-src']")) == null || r.addEventListener("click", () => {
    const m = e.parseEntryPath(e.selectedPath);
    if (!m) return;
    const g = e.getEntryAtPath(e.selectedPath);
    if (!(g != null && g.sound)) return;
    new FilePicker({
      type: "audio",
      current: g.sound.src || "",
      callback: /* @__PURE__ */ u(async (b) => {
        const v = { ...g.sound, src: b };
        v.id || (v.id = md(b));
        const w = await gd(b);
        w > 0 && (v.duration = w), n(m, g, v);
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
  }), (c = t.querySelector("[data-action='change-sound-fadeout']")) == null || c.addEventListener("change", (m) => {
    const g = e.parseEntryPath(e.selectedPath);
    if (!g) return;
    const y = e.getEntryAtPath(e.selectedPath);
    y != null && y.sound && n(g, y, { ...y.sound, fadeOut: Number(m.target.value) || void 0 });
  }), (d = t.querySelector("[data-action='change-sound-duration']")) == null || d.addEventListener("change", (m) => {
    const g = e.parseEntryPath(e.selectedPath);
    if (!g) return;
    const y = e.getEntryAtPath(e.selectedPath);
    y != null && y.sound && n(g, y, { ...y.sound, duration: Number(m.target.value) || 0 });
  }), (h = t.querySelector("[data-action='change-sound-fireandforget']")) == null || h.addEventListener("change", (m) => {
    const g = e.parseEntryPath(e.selectedPath);
    if (!g) return;
    const y = e.getEntryAtPath(e.selectedPath);
    y != null && y.sound && n(g, y, { ...y.sound, fireAndForget: m.target.checked });
  }), (f = t.querySelector("[data-action='change-stopsound-id']")) == null || f.addEventListener("change", (m) => {
    const g = e.parseEntryPath(e.selectedPath);
    g && (g.type === "timeline" ? e.mutate((y) => y.updateEntry(g.index, { stopSound: m.target.value })) : g.type === "branch" && e.mutate((y) => y.updateBranchEntry(g.index, g.branchIndex, g.branchEntryIndex, { stopSound: m.target.value })));
  });
}
u(Wv, "bindSoundFieldEvents");
function zv(t, e) {
  var n, i, r, o, s;
  (n = t.querySelector("[data-action='change-emit-signal']")) == null || n.addEventListener("change", (a) => {
    const l = e.parseEntryPath(e.selectedPath);
    l && l.type === "timeline" && e.mutate((c) => c.updateEntry(l.index, { emit: a.target.value }));
  }), (i = t.querySelector("[data-action='change-parallel-join']")) == null || i.addEventListener("change", (a) => {
    const l = e.parseEntryPath(e.selectedPath);
    if (!l || l.type !== "timeline") return;
    const c = e.state.timeline[l.index];
    c != null && c.parallel && e.mutate((d) => d.updateEntry(l.index, { parallel: { ...c.parallel, join: a.target.value } }));
  }), (r = t.querySelector("[data-action='change-parallel-overflow']")) == null || r.addEventListener("change", (a) => {
    const l = e.parseEntryPath(e.selectedPath);
    if (!l || l.type !== "timeline") return;
    const c = e.state.timeline[l.index];
    c != null && c.parallel && e.mutate((d) => d.updateEntry(l.index, { parallel: { ...c.parallel, overflow: a.target.value } }));
  }), (o = t.querySelector("[data-action='edit-parallel-json']")) == null || o.addEventListener("click", () => {
    Rv({ selectedPath: e.selectedPath, state: e.state, mutate: e.mutate });
  }), (s = t.querySelector("[data-action='add-branch']")) == null || s.addEventListener("click", () => {
    const a = e.parseEntryPath(e.selectedPath);
    !a || a.type !== "timeline" || e.mutate((l) => l.addBranch(a.index));
  }), t.querySelectorAll("[data-action='remove-branch']").forEach((a) => {
    a.addEventListener("click", () => {
      const l = Number(a.dataset.branchIndex), c = e.parseEntryPath(e.selectedPath);
      !c || c.type !== "timeline" || Number.isNaN(l) || e.mutate((d) => d.removeBranch(c.index, l));
    });
  }), t.querySelectorAll("[data-action='add-branch-step']").forEach((a) => {
    a.addEventListener("click", () => {
      const l = Number(a.dataset.branchIndex), c = e.parseEntryPath(e.selectedPath);
      !c || c.type !== "timeline" || Number.isNaN(l) || e.mutate((d) => d.addBranchEntry(c.index, l, { tweens: [] }));
    });
  }), t.querySelectorAll("[data-action='add-branch-delay']").forEach((a) => {
    a.addEventListener("click", () => {
      const l = Number(a.dataset.branchIndex), c = e.parseEntryPath(e.selectedPath);
      !c || c.type !== "timeline" || Number.isNaN(l) || e.mutate((d) => d.addBranchEntry(c.index, l, { delay: 1e3 }));
    });
  }), t.querySelectorAll("[data-action='add-branch-sound']").forEach((a) => {
    a.addEventListener("click", () => {
      const l = Number(a.dataset.branchIndex), c = e.parseEntryPath(e.selectedPath);
      !c || c.type !== "timeline" || Number.isNaN(l) || e.mutate((d) => d.addBranchEntry(c.index, l, { sound: { src: "", volume: 0.8, loop: !1, duration: 0, fireAndForget: !1 } }));
    });
  }), t.querySelectorAll("[data-action='add-branch-stopSound']").forEach((a) => {
    a.addEventListener("click", () => {
      const l = Number(a.dataset.branchIndex), c = e.parseEntryPath(e.selectedPath);
      !c || c.type !== "timeline" || Number.isNaN(l) || e.mutate((d) => d.addBranchEntry(c.index, l, { stopSound: "" }));
    });
  }), t.querySelectorAll("[data-action='remove-branch-entry']").forEach((a) => {
    a.addEventListener("click", () => {
      const l = Number(a.dataset.branchIndex), c = Number(a.dataset.branchEntryIndex), d = e.parseEntryPath(e.selectedPath);
      !d || d.type !== "timeline" || Number.isNaN(l) || Number.isNaN(c) || e.mutate((h) => h.removeBranchEntry(d.index, l, c));
    });
  });
}
u(zv, "bindSpecialEntryEvents");
function Yv(t, e) {
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
            callback: /* @__PURE__ */ u((o) => {
              var s;
              return r((s = o.find("#seg-name").val()) == null ? void 0 : s.trim());
            }, "callback")
          },
          cancel: { label: "Cancel", callback: /* @__PURE__ */ u(() => r(null), "callback") }
        },
        default: "ok",
        close: /* @__PURE__ */ u(() => r(null), "close")
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
              callback: /* @__PURE__ */ u((a) => {
                var l;
                return s((l = a.find("#seg-name").val()) == null ? void 0 : l.trim());
              }, "callback")
            },
            cancel: { label: "Cancel", callback: /* @__PURE__ */ u(() => s(null), "callback") }
          },
          default: "ok",
          close: /* @__PURE__ */ u(() => s(null), "close")
        }).render(!0);
      });
      o && o !== r && e.renameSegment(r, o);
    });
  });
}
u(Yv, "bindSegmentGraphEvents");
function Kv(t, e) {
  var n, i, r, o, s, a, l;
  (n = t.querySelector("[data-action='change-gate-event']")) == null || n.addEventListener("change", (c) => {
    var h;
    const d = c.target.value;
    if (!d)
      e.setSegmentGate(null);
    else {
      const f = ((h = e.state.activeSegment) == null ? void 0 : h.gate) ?? {};
      e.setSegmentGate({ ...f, event: d });
    }
  }), (i = t.querySelector("[data-action='change-gate-target']")) == null || i.addEventListener("change", (c) => {
    var h;
    const d = (h = e.state.activeSegment) == null ? void 0 : h.gate;
    d && e.setSegmentGate({ ...d, target: c.target.value || void 0 });
  }), (r = t.querySelector("[data-action='pick-gate-target']")) == null || r.addEventListener("click", async () => {
    var h;
    const c = (h = e.state.activeSegment) == null ? void 0 : h.gate;
    if (!c) return;
    const { enterPickMode: d } = await Promise.resolve().then(() => Vv);
    d({
      placeableType: "Tile",
      onPick: /* @__PURE__ */ u((f) => {
        var y, b;
        const m = (b = (y = f.flags) == null ? void 0 : y.tagger) == null ? void 0 : b.tags, g = m != null && m.length ? `tag:${m[0]}` : `id:${f.id}`;
        e.setSegmentGate({ ...c, target: g });
      }, "onPick")
    });
  });
  for (const [c, d] of [["change-gate-anim-idle", "idle"], ["change-gate-anim-hover", "hover"], ["change-gate-anim-dim", "dim"]])
    (o = t.querySelector(`[data-action='${c}']`)) == null || o.addEventListener("change", (h) => {
      var v;
      const f = (v = e.state.activeSegment) == null ? void 0 : v.gate;
      if (!f) return;
      const m = h.target.value.trim(), g = m ? m.split(",").map((w) => w.trim()).filter(Boolean) : void 0, y = { ...f.animation ?? {} };
      g != null && g.length ? y[d] = g.length === 1 ? g[0] : g : delete y[d];
      const b = { ...f, animation: Object.keys(y).length ? y : void 0 };
      b.animation || delete b.animation, e.setSegmentGate(b);
    });
  (s = t.querySelector("[data-action='change-segment-next']")) == null || s.addEventListener("change", (c) => {
    const d = c.target.value;
    e.setSegmentNext(d || null);
  }), (a = t.querySelector("[data-action='edit-segment-setup']")) == null || a.addEventListener("click", () => {
    As("setup", { state: e.state, mutate: e.mutate });
  }), (l = t.querySelector("[data-action='edit-segment-landing']")) == null || l.addEventListener("click", () => {
    As("landing", { state: e.state, mutate: e.mutate });
  });
}
u(Kv, "bindSegmentDetailEvents");
var Xd, Ye, z, it, Bn, Nt, rt, Ke, ga, Re, ot, pa, bn, cr, vt, Ai, Un, Mi, U, im, rm, om, sm, xn, kc, Ac, Mc, xc, am, _n, _c, lm, cm, um, dm, fm, Nc, Dr;
const At = class At extends sn(on) {
  constructor(n = {}) {
    super(n);
    _(this, U);
    _(this, Ye, null);
    _(this, z, null);
    _(this, it, null);
    _(this, Bn, /* @__PURE__ */ new Set());
    _(this, Nt, !1);
    _(this, rt, null);
    _(this, Ke, null);
    _(this, ga, 120);
    _(this, Re, []);
    _(this, ot, -1);
    _(this, pa, 50);
    _(this, bn, null);
    _(this, cr, null);
    _(this, vt, null);
    _(this, Ai, null);
    _(this, Un, null);
    _(this, Mi, null);
    O(this, Ye, n.scene ?? canvas.scene ?? null), O(this, z, nn.fromScene(p(this, Ye)));
  }
  // ── Context ───────────────────────────────────────────────────────────
  async _prepareContext() {
    var m, g;
    const n = Lv(p(this, z), p(this, z).activeSegmentName), i = Cv(p(this, z).timeline, {
      selectedPath: p(this, it),
      windowWidth: ((m = this.position) == null ? void 0 : m.width) ?? 1100
    }), r = p(this, it) != null ? Dv(p(this, it), { state: p(this, z), expandedTweens: p(this, Bn) }) : null, o = p(this, z).listCinematicNames(), s = p(this, z).activeCinematicName, l = p(this, z).listSegmentNames().length > 1, c = p(this, z).activeSegment, d = (c == null ? void 0 : c.gate) ?? null, h = (c == null ? void 0 : c.next) ?? null, f = typeof h == "string" ? h : (h == null ? void 0 : h.segment) ?? null;
    return {
      // Toolbar
      sceneName: ((g = p(this, Ye)) == null ? void 0 : g.name) ?? "No scene",
      dirty: p(this, Nt),
      canUndo: p(this, U, kc),
      canRedo: p(this, U, Ac),
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
      activeSegmentNext: f,
      activeSegmentSetupCount: Object.keys((c == null ? void 0 : c.setup) ?? {}).length,
      activeSegmentLandingCount: Object.keys((c == null ? void 0 : c.landing) ?? {}).length,
      // Footer
      trigger: p(this, z).trigger,
      tracking: p(this, z).tracking,
      synchronized: p(this, z).synchronized,
      triggerOptions: gv.map((y) => ({
        ...y,
        selected: y.value === p(this, z).trigger
      })),
      entryCount: p(this, z).timeline.length,
      totalDuration: i.totalDurationMs,
      targetCount: Iv(p(this, z)),
      setupCount: Object.keys(p(this, z).setup ?? {}).length,
      landingCount: Object.keys(p(this, z).landing ?? {}).length
    };
  }
  // ── Render & Events ───────────────────────────────────────────────────
  _onRender(n, i) {
    var r, o, s;
    if (super._onRender(n, i), T(this, U, im).call(this), !p(this, Ai)) {
      const a = (o = (r = game.modules.get(L)) == null ? void 0 : r.api) == null ? void 0 : o.cinematic;
      a != null && a.onPlaybackProgress ? (O(this, Ai, a.onPlaybackProgress((l) => T(this, U, fm).call(this, l))), console.log("[cinematic-editor] Subscribed to playback progress events")) : console.warn("[cinematic-editor] onPlaybackProgress not available on API", a);
    }
    if (p(this, Mi) && ((s = this.element) == null || s.querySelectorAll(".cinematic-editor__segment-node").forEach((a) => {
      a.classList.toggle("cinematic-editor__segment-node--playing", a.dataset.segmentName === p(this, Mi));
    }), p(this, vt) && p(this, vt).segmentName === p(this, z).activeSegmentName)) {
      const a = performance.now() - p(this, vt).startTime;
      p(this, vt).durationMs - a > 0 && T(this, U, Nc).call(this, p(this, vt).durationMs, p(this, vt).startTime);
    }
    p(this, bn) || (O(this, bn, (a) => {
      !a.ctrlKey && !a.metaKey || (a.key === "z" && !a.shiftKey ? (a.preventDefault(), T(this, U, Mc).call(this)) : (a.key === "z" && a.shiftKey || a.key === "y") && (a.preventDefault(), T(this, U, xc).call(this)));
    }), document.addEventListener("keydown", p(this, bn)));
  }
  async close(n = {}) {
    if (p(this, Ke) && T(this, U, _n).call(this), p(this, Nt) && !n.force) {
      const i = await new Promise((r) => {
        new Dialog({
          title: "Unsaved Changes",
          content: "<p>You have unsaved cinematic changes.</p>",
          buttons: {
            save: { label: "Save & Close", icon: '<i class="fas fa-save"></i>', callback: /* @__PURE__ */ u(() => r("save"), "callback") },
            discard: { label: "Discard", icon: '<i class="fas fa-trash"></i>', callback: /* @__PURE__ */ u(() => r("discard"), "callback") },
            cancel: { label: "Cancel", icon: '<i class="fas fa-times"></i>', callback: /* @__PURE__ */ u(() => r("cancel"), "callback") }
          },
          default: "cancel",
          close: /* @__PURE__ */ u(() => r("cancel"), "close")
        }).render(!0);
      });
      if (i === "cancel") return;
      i === "save" && await T(this, U, _c).call(this);
    }
    return super.close(n);
  }
  async _onClose(n) {
    var i;
    return p(this, rt) !== null && (clearTimeout(p(this, rt)), O(this, rt, null)), p(this, bn) && (document.removeEventListener("keydown", p(this, bn)), O(this, bn, null)), (i = p(this, Ai)) == null || i.call(this), O(this, Ai, null), T(this, U, Dr).call(this), super._onClose(n);
  }
};
Ye = new WeakMap(), z = new WeakMap(), it = new WeakMap(), Bn = new WeakMap(), Nt = new WeakMap(), rt = new WeakMap(), Ke = new WeakMap(), ga = new WeakMap(), Re = new WeakMap(), ot = new WeakMap(), pa = new WeakMap(), bn = new WeakMap(), cr = new WeakMap(), vt = new WeakMap(), Ai = new WeakMap(), Un = new WeakMap(), Mi = new WeakMap(), U = new WeakSet(), // ── Event binding ─────────────────────────────────────────────────────
im = /* @__PURE__ */ u(function() {
  const n = this.element;
  if (!(n instanceof HTMLElement)) return;
  const i = T(this, U, rm).call(this);
  Hv(n, i), qv(n, i), Yv(n, i), jv(n, i), Bv(n, i), Gv(n, i), Wv(n, i), zv(n, i), Kv(n, i);
}, "#bindEvents"), rm = /* @__PURE__ */ u(function() {
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
      return p(n, Bn);
    },
    get insertMenuState() {
      return p(n, cr);
    },
    // Mutations
    mutate: /* @__PURE__ */ u((i) => T(this, U, xn).call(this, i), "mutate"),
    setSelectedPath: /* @__PURE__ */ u((i) => {
      O(this, it, i), this.render({ force: !0 });
    }, "setSelectedPath"),
    render: /* @__PURE__ */ u(() => this.render({ force: !0 }), "render"),
    // Cinematic switching (needs full state swap + clear)
    switchCinematic: /* @__PURE__ */ u((i) => {
      p(this, Ke) && T(this, U, _n).call(this), O(this, z, p(this, z).switchCinematic(i)), O(this, it, null), p(this, Bn).clear(), this.render({ force: !0 });
    }, "switchCinematic"),
    // Segment management
    selectSegment: /* @__PURE__ */ u((i) => {
      p(this, Ke) && T(this, U, _n).call(this), O(this, z, p(this, z).switchSegment(i)), O(this, it, null), p(this, Bn).clear(), this.render({ force: !0 });
    }, "selectSegment"),
    addSegment: /* @__PURE__ */ u((i) => {
      T(this, U, xn).call(this, (r) => r.addSegment(i, r.activeSegmentName));
    }, "addSegment"),
    removeSegment: /* @__PURE__ */ u((i) => {
      T(this, U, xn).call(this, (r) => r.removeSegment(i));
    }, "removeSegment"),
    renameSegment: /* @__PURE__ */ u((i, r) => {
      T(this, U, xn).call(this, (o) => o.renameSegment(i, r));
    }, "renameSegment"),
    setSegmentGate: /* @__PURE__ */ u((i) => {
      T(this, U, xn).call(this, (r) => r.setSegmentGate(i));
    }, "setSegmentGate"),
    setSegmentNext: /* @__PURE__ */ u((i) => {
      T(this, U, xn).call(this, (r) => r.setSegmentNext(i));
    }, "setSegmentNext"),
    // Tween debouncing
    queueTweenChange: /* @__PURE__ */ u((i, r) => T(this, U, am).call(this, i, r), "queueTweenChange"),
    flushTweenChanges: /* @__PURE__ */ u(() => {
      p(this, Ke) && T(this, U, _n).call(this);
    }, "flushTweenChanges"),
    flushTweenChangesImmediate: /* @__PURE__ */ u(() => {
      p(this, rt) !== null && clearTimeout(p(this, rt)), O(this, rt, null), T(this, U, _n).call(this);
    }, "flushTweenChangesImmediate"),
    // Path utilities
    parseEntryPath: ti,
    getEntryAtPath: /* @__PURE__ */ u((i) => ks(i, p(this, z)), "getEntryAtPath"),
    // Insert menu
    showInsertMenu: /* @__PURE__ */ u((i, r, o) => T(this, U, om).call(this, i, r, o), "showInsertMenu"),
    hideInsertMenu: /* @__PURE__ */ u(() => T(this, U, sm).call(this), "hideInsertMenu"),
    // Toolbar actions
    save: /* @__PURE__ */ u(() => T(this, U, _c).call(this), "save"),
    play: /* @__PURE__ */ u(() => T(this, U, lm).call(this), "play"),
    resetTracking: /* @__PURE__ */ u(() => T(this, U, cm).call(this), "resetTracking"),
    exportJSON: /* @__PURE__ */ u(() => T(this, U, um).call(this), "exportJSON"),
    validate: /* @__PURE__ */ u(() => T(this, U, dm).call(this), "validate"),
    importJSON: /* @__PURE__ */ u(() => Pv({ state: p(this, z), mutate: /* @__PURE__ */ u((i) => T(this, U, xn).call(this, i), "mutate") }), "importJSON"),
    undo: /* @__PURE__ */ u(() => T(this, U, Mc).call(this), "undo"),
    redo: /* @__PURE__ */ u(() => T(this, U, xc).call(this), "redo")
  };
}, "#createEventContext"), // ── Insert menu ───────────────────────────────────────────────────────
om = /* @__PURE__ */ u(function(n, i, r) {
  var l;
  const o = (l = this.element) == null ? void 0 : l.querySelector(".cinematic-editor__insert-menu");
  if (!o) return;
  const s = n.getBoundingClientRect();
  document.body.appendChild(o), o.style.display = "", o.style.position = "fixed", o.style.left = `${s.left}px`;
  const a = o.offsetHeight || 200;
  s.bottom + 4 + a > window.innerHeight ? o.style.top = `${s.top - a - 4}px` : o.style.top = `${s.bottom + 4}px`, O(this, cr, { insertIndex: i, lane: r });
}, "#showInsertMenu"), sm = /* @__PURE__ */ u(function() {
  var i, r;
  const n = document.body.querySelector(".cinematic-editor__insert-menu") ?? ((i = this.element) == null ? void 0 : i.querySelector(".cinematic-editor__insert-menu"));
  if (n) {
    n.style.display = "none";
    const o = (r = this.element) == null ? void 0 : r.querySelector(".cinematic-editor");
    o && n.parentNode !== o && o.appendChild(n);
  }
  O(this, cr, null);
}, "#hideInsertMenu"), // ── State mutation ────────────────────────────────────────────────────
xn = /* @__PURE__ */ u(function(n) {
  O(this, Re, p(this, Re).slice(0, p(this, ot) + 1)), p(this, Re).push(p(this, z)), p(this, Re).length > p(this, pa) && p(this, Re).shift(), O(this, ot, p(this, Re).length - 1), O(this, z, n(p(this, z))), O(this, Nt, !0), this.render({ force: !0 });
}, "#mutate"), kc = /* @__PURE__ */ u(function() {
  return p(this, ot) >= 0;
}, "#canUndo"), Ac = /* @__PURE__ */ u(function() {
  return p(this, ot) < p(this, Re).length - 1;
}, "#canRedo"), Mc = /* @__PURE__ */ u(function() {
  p(this, U, kc) && (p(this, ot) === p(this, Re).length - 1 && p(this, Re).push(p(this, z)), O(this, z, p(this, Re)[p(this, ot)]), qa(this, ot)._--, O(this, Nt, !0), this.render({ force: !0 }));
}, "#undo"), xc = /* @__PURE__ */ u(function() {
  p(this, U, Ac) && (qa(this, ot)._++, O(this, z, p(this, Re)[p(this, ot) + 1]), O(this, Nt, !0), this.render({ force: !0 }));
}, "#redo"), am = /* @__PURE__ */ u(function(n, i) {
  var r;
  p(this, it) != null && (O(this, Ke, {
    ...p(this, Ke) ?? {},
    entryPath: p(this, it),
    tweenIndex: n,
    patch: { ...((r = p(this, Ke)) == null ? void 0 : r.patch) ?? {}, ...i }
  }), p(this, rt) !== null && clearTimeout(p(this, rt)), O(this, rt, setTimeout(() => {
    O(this, rt, null), T(this, U, _n).call(this);
  }, p(this, ga))));
}, "#queueTweenChange"), _n = /* @__PURE__ */ u(function() {
  if (!p(this, Ke)) return;
  const { entryPath: n, tweenIndex: i, patch: r } = p(this, Ke);
  O(this, Ke, null);
  const o = ti(n);
  if (o) {
    if (o.type === "timeline")
      O(this, z, p(this, z).updateTween(o.index, i, r));
    else if (o.type === "branch") {
      const s = ks(n, p(this, z));
      if (s) {
        const a = (s.tweens ?? []).map((l, c) => c === i ? { ...l, ...r } : l);
        O(this, z, p(this, z).updateBranchEntry(o.index, o.branchIndex, o.branchEntryIndex, { tweens: a }));
      }
    }
    O(this, Nt, !0);
  }
}, "#flushTweenChanges"), _c = /* @__PURE__ */ u(async function() {
  var n, i, r, o, s, a;
  if (p(this, Ye)) {
    if (p(this, Ke) && T(this, U, _n).call(this), p(this, z).isStale(p(this, Ye))) {
      const l = await new Promise((c) => {
        new Dialog({
          title: "External Changes Detected",
          content: "<p>The scene's cinematic data was modified externally. Overwrite with your changes?</p>",
          buttons: {
            overwrite: { label: "Overwrite", icon: '<i class="fas fa-save"></i>', callback: /* @__PURE__ */ u(() => c(!0), "callback") },
            reload: { label: "Reload", icon: '<i class="fas fa-sync"></i>', callback: /* @__PURE__ */ u(() => c("reload"), "callback") },
            cancel: { label: "Cancel", icon: '<i class="fas fa-times"></i>', callback: /* @__PURE__ */ u(() => c(!1), "callback") }
          },
          default: "cancel",
          close: /* @__PURE__ */ u(() => c(!1), "close")
        }).render(!0);
      });
      if (l === "reload") {
        O(this, z, nn.fromScene(p(this, Ye), p(this, z).activeCinematicName)), O(this, Nt, !1), O(this, Re, []), O(this, ot, -1), this.render({ force: !0 }), (i = (n = ui.notifications) == null ? void 0 : n.info) == null || i.call(n, "Cinematic reloaded from scene.");
        return;
      }
      if (!l) return;
    }
    try {
      await p(this, z).save(p(this, Ye)), O(this, z, nn.fromScene(p(this, Ye), p(this, z).activeCinematicName)), O(this, Nt, !1), (o = (r = ui.notifications) == null ? void 0 : r.info) == null || o.call(r, "Cinematic saved."), this.render({ force: !0 });
    } catch (l) {
      console.error(`${L} | Cinematic save failed`, l), (a = (s = ui.notifications) == null ? void 0 : s.error) == null || a.call(s, "Failed to save cinematic data.");
    }
  }
}, "#onSave"), lm = /* @__PURE__ */ u(async function() {
  var i, r, o, s, a;
  const n = (r = (i = game.modules.get(L)) == null ? void 0 : i.api) == null ? void 0 : r.cinematic;
  if (!(n != null && n.play)) {
    (s = (o = ui.notifications) == null ? void 0 : o.warn) == null || s.call(o, "Cinematic API not available.");
    return;
  }
  await n.play((a = p(this, Ye)) == null ? void 0 : a.id, p(this, z).activeCinematicName);
}, "#onPlay"), cm = /* @__PURE__ */ u(async function() {
  var i, r, o, s, a;
  const n = (r = (i = game.modules.get(L)) == null ? void 0 : i.api) == null ? void 0 : r.cinematic;
  n != null && n.reset && (await n.reset((o = p(this, Ye)) == null ? void 0 : o.id, p(this, z).activeCinematicName), (a = (s = ui.notifications) == null ? void 0 : s.info) == null || a.call(s, "Cinematic tracking reset."));
}, "#onResetTracking"), um = /* @__PURE__ */ u(async function() {
  var i, r;
  const n = JSON.stringify(p(this, z).toJSON(), null, 2);
  try {
    await navigator.clipboard.writeText(n), (r = (i = ui.notifications) == null ? void 0 : i.info) == null || r.call(i, "Cinematic JSON copied to clipboard.");
  } catch {
    new Dialog({
      title: "Cinematic JSON",
      content: `<textarea style="width:100%;height:300px;font-family:monospace;font-size:0.8rem">${jt(n)}</textarea>`,
      buttons: { ok: { label: "Close" } }
    }).render(!0);
  }
}, "#onExportJSON"), dm = /* @__PURE__ */ u(function() {
  var l, c;
  const n = p(this, z).toJSON(), { targets: i, unresolved: r } = Os(n), o = mv(n, i), s = [
    ...r.map((d) => ({ path: "targets", level: "warn", message: `Unresolved target: "${d}"` })),
    ...o
  ];
  if (s.length === 0) {
    (c = (l = ui.notifications) == null ? void 0 : l.info) == null || c.call(l, "Cinematic validation passed — no issues found.");
    return;
  }
  const a = s.map((d) => {
    const h = d.level === "error" ? "fa-circle-xmark" : "fa-triangle-exclamation", f = d.level === "error" ? "#e74c3c" : "#f39c12";
    return `<li style="margin:0.3rem 0"><i class="fa-solid ${h}" style="color:${f};margin-right:0.3rem"></i><strong>${jt(d.path)}</strong>: ${jt(d.message)}</li>`;
  });
  new Dialog({
    title: "Cinematic Validation",
    content: `<p>${s.length} issue(s) found:</p><ul style="list-style:none;padding:0;max-height:300px;overflow:auto">${a.join("")}</ul>`,
    buttons: { ok: { label: "Close" } }
  }).render(!0);
}, "#onValidate"), // ── Playback progress ────────────────────────────────────────────────
fm = /* @__PURE__ */ u(function(n) {
  var i, r, o, s, a, l;
  switch (console.log(`[cinematic-editor] playback event: ${n.type}`, n), n.type) {
    case "segment-start":
      O(this, Mi, n.segmentName), n.segmentName !== p(this, z).activeSegmentName ? (O(this, z, p(this, z).switchSegment(n.segmentName)), O(this, it, null), p(this, Bn).clear(), this.render({ force: !0 })) : (i = this.element) == null || i.querySelectorAll(".cinematic-editor__segment-node").forEach((c) => {
        c.classList.toggle("cinematic-editor__segment-node--playing", c.dataset.segmentName === n.segmentName);
      });
      break;
    case "gate-wait":
      (o = (r = this.element) == null ? void 0 : r.querySelector(`.cinematic-editor__segment-node[data-segment-name="${CSS.escape(n.segmentName)}"]`)) == null || o.classList.add("cinematic-editor__segment-node--gate-waiting");
      break;
    case "gate-resolved":
      (a = (s = this.element) == null ? void 0 : s.querySelector(`.cinematic-editor__segment-node[data-segment-name="${CSS.escape(n.segmentName)}"]`)) == null || a.classList.remove("cinematic-editor__segment-node--gate-waiting");
      break;
    case "timeline-start":
      O(this, vt, { segmentName: n.segmentName, startTime: performance.now(), durationMs: n.durationMs }), n.segmentName === p(this, z).activeSegmentName && T(this, U, Nc).call(this, n.durationMs);
      break;
    case "timeline-end":
      T(this, U, Dr).call(this), O(this, vt, null);
      break;
    case "playback-end":
      T(this, U, Dr).call(this), O(this, vt, null), O(this, Mi, null), (l = this.element) == null || l.querySelectorAll(".cinematic-editor__segment-node--playing, .cinematic-editor__segment-node--gate-waiting").forEach((c) => {
        c.classList.remove("cinematic-editor__segment-node--playing", "cinematic-editor__segment-node--gate-waiting");
      });
      break;
  }
}, "#onPlaybackEvent"), Nc = /* @__PURE__ */ u(function(n, i = null) {
  var c, d;
  T(this, U, Dr).call(this);
  const r = (c = this.element) == null ? void 0 : c.querySelector(".cinematic-editor__playback-cursor"), o = (d = this.element) == null ? void 0 : d.querySelector(".cinematic-editor__swimlane");
  if (console.log(`[cinematic-editor] startCursor: duration=${n}, cursor=${!!r}, swimlane=${!!o}, width=${o == null ? void 0 : o.scrollWidth}`), !r || !o || n <= 0) return;
  r.style.display = "block";
  const s = i ?? performance.now(), a = o.scrollWidth, l = /* @__PURE__ */ u(() => {
    const h = performance.now() - s, f = Math.min(h / n, 1), m = to + f * (a - to);
    r.style.left = `${m}px`, f < 1 && O(this, Un, requestAnimationFrame(l));
  }, "tick");
  O(this, Un, requestAnimationFrame(l));
}, "#startCursorAnimation"), Dr = /* @__PURE__ */ u(function() {
  var i;
  p(this, Un) && (cancelAnimationFrame(p(this, Un)), O(this, Un, null));
  const n = (i = this.element) == null ? void 0 : i.querySelector(".cinematic-editor__playback-cursor");
  n && (n.style.display = "none");
}, "#stopCursorAnimation"), u(At, "CinematicEditorApplication"), le(At, "APP_ID", `${L}-cinematic-editor`), le(At, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Le(At, At, "DEFAULT_OPTIONS"),
  {
    id: At.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Xd = Le(At, At, "DEFAULT_OPTIONS")) == null ? void 0 : Xd.classes) ?? [], "eidolon-cinematic-editor-window", "themed"])
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
)), le(At, "PARTS", {
  content: {
    template: `modules/${L}/templates/cinematic-editor.html`
  }
});
let Oc = At;
const hm = /* @__PURE__ */ new Map();
function pe(t, e) {
  hm.set(t, e);
}
u(pe, "registerBehaviour");
function ss(t) {
  return hm.get(t);
}
u(ss, "getBehaviour");
function de(t) {
  var e;
  return ((e = t.document) == null ? void 0 : e.documentName) === "Drawing" ? t.shape ?? null : t.mesh ? t.mesh : t.destroyed || !t.transform ? null : t;
}
u(de, "getAnimationTarget");
function Xv(t, e, n) {
  let i, r, o;
  if (e === 0)
    i = r = o = n;
  else {
    const s = /* @__PURE__ */ u((c, d, h) => (h < 0 && (h += 1), h > 1 && (h -= 1), h < 0.16666666666666666 ? c + (d - c) * 6 * h : h < 0.5 ? d : h < 0.6666666666666666 ? c + (d - c) * (0.6666666666666666 - h) * 6 : c), "hue2rgb"), a = n < 0.5 ? n * (1 + e) : n + e - n * e, l = 2 * n - a;
    i = s(l, a, t + 1 / 3), r = s(l, a, t), o = s(l, a, t - 1 / 3);
  }
  return Math.round(i * 255) << 16 | Math.round(r * 255) << 8 | Math.round(o * 255);
}
u(Xv, "hslToInt");
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
      const c = (Math.sin(a) + 1) / 2;
      n.alpha = i + (r - i) * c;
    },
    detach() {
      n.alpha = s;
    }
  };
});
pe("scale", (t, e = {}, n) => {
  var w, E, S, I, k, M;
  const i = de(t);
  if (!i) return { update() {
  }, detach() {
  } };
  const r = e.factor ?? 1.12, o = e.durationFrames ?? 15, s = at(e.easing ?? "easeOutCubic"), a = i.scale.x, l = i.scale.y, c = a * r, d = l * r, f = !(!!t.mesh || ((w = i.pivot) == null ? void 0 : w.x) || ((E = i.pivot) == null ? void 0 : E.y)), m = f ? (((I = (S = t.document) == null ? void 0 : S.shape) == null ? void 0 : I.width) ?? 0) / 2 : 0, g = f ? (((M = (k = t.document) == null ? void 0 : k.shape) == null ? void 0 : M.height) ?? 0) / 2 : 0, y = (n == null ? void 0 : n.x) ?? i.position.x, b = (n == null ? void 0 : n.y) ?? i.position.y;
  let v = 0;
  return {
    update($) {
      if (v < o) {
        v += $;
        const N = Math.min(v / o, 1), x = s(N), F = a + (c - a) * x, A = l + (d - l) * x;
        i.scale.x = F, i.scale.y = A, f && (i.position.x = y - m * (F - a), i.position.y = b - g * (A - l));
      }
    },
    detach() {
      i.scale.x = a, i.scale.y = l, f && (i.position.x = y, i.position.y = b);
    }
  };
});
pe("glow", (t, e = {}) => {
  var y, b;
  const n = de(t);
  if (!((y = n == null ? void 0 : n.texture) != null && y.baseTexture)) return { update() {
  }, detach() {
  } };
  const i = t.document, r = e.color ?? 4513279, o = e.alpha ?? 0.5, s = e.blur ?? 8, a = e.pulseSpeed ?? 0.03, l = Math.abs(i.width), c = Math.abs(i.height), d = PIXI.Sprite.from(n.texture);
  d.anchor.set(0.5, 0.5), d.scale.set(n.scale.x, n.scale.y), d.position.set(l / 2, c / 2), d.angle = i.rotation ?? 0, d.alpha = o, d.tint = r;
  const h = PIXI.BlurFilter ?? ((b = PIXI.filters) == null ? void 0 : b.BlurFilter), f = new h(s);
  d.filters = [f], t.addChildAt(d, 0);
  const m = n.angle;
  let g = 0;
  return {
    update(v) {
      g += v;
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
      a = (a + l * i) % 1, n.tint = Xv(a, r, o);
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
      const c = Math.abs(a * i % 2 - 1);
      n.position.y = s + o(c) * r;
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
  const i = t.document, r = Math.abs(i.width), o = Math.abs(i.height), s = 2 * (r + o), a = e.speed ?? 1.5, l = e.length ?? 60, c = e.color ?? 4513279, d = e.alpha ?? 0.8, h = e.lineWidth ?? 2, f = new PIXI.Graphics();
  f.alpha = d, f.pivot.set(r / 2, o / 2), f.position.set(r / 2, o / 2), t.addChildAt(f, 0);
  const m = n.scale.x, g = n.scale.y, y = n.angle;
  let b = 0;
  function v(w) {
    return w = (w % s + s) % s, w < r ? { x: w, y: 0 } : (w -= r, w < o ? { x: r, y: w } : (w -= o, w < r ? { x: r - w, y: o } : (w -= r, { x: 0, y: o - w })));
  }
  return u(v, "perimeterPoint"), {
    update(w) {
      b = (b + w * a) % s, f.visible = n.visible !== !1, f.alpha = d * (n.alpha ?? 1), f.scale.set(n.scale.x / m, n.scale.y / g), f.angle = n.angle - y, f.clear(), f.lineStyle(h, c, 1);
      const E = 16, S = l / E, I = v(b);
      f.moveTo(I.x, I.y);
      for (let k = 1; k <= E; k++) {
        const M = v(b + k * S);
        f.lineTo(M.x, M.y);
      }
    },
    detach() {
      f.parent && f.parent.removeChild(f), f.destroy({ children: !0 });
    }
  };
});
pe("shimmer", (t, e = {}) => {
  const n = de(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), o = Math.abs(i.height), s = e.speed ?? 1, a = e.bandWidth ?? 40, l = e.alpha ?? 0.15, c = e.pause ?? 120, d = r + o + a, h = d + c * s, f = new PIXI.Container();
  f.pivot.set(r / 2, o / 2), f.position.set(r / 2, o / 2);
  const m = new PIXI.Graphics();
  m.alpha = l;
  const g = new PIXI.Graphics();
  g.beginFill(16777215), g.drawRect(0, 0, r, o), g.endFill(), f.addChild(g), m.mask = g, f.addChild(m), t.addChild(f);
  const y = n.scale.x, b = n.scale.y, v = n.angle;
  let w = 0;
  return {
    update(E) {
      if (w = (w + E * s) % h, f.visible = n.visible !== !1, f.scale.set(n.scale.x / y, n.scale.y / b), f.angle = n.angle - v, m.alpha = l * (n.alpha ?? 1), m.clear(), w < d) {
        const S = w - a;
        m.beginFill(16777215, 1), m.moveTo(S, 0), m.lineTo(S + a, 0), m.lineTo(S + a - o, o), m.lineTo(S - o, o), m.closePath(), m.endFill();
      }
    },
    detach() {
      m.mask = null, f.parent && f.parent.removeChild(f), f.destroy({ children: !0 });
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
      const c = Math.sin(a * r);
      n.scale.x = o * (1 + (i - 1) * c), n.scale.y = s * (1 + (i - 1) * c);
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
      const c = Math.abs(o.width), d = o.x + c / 2, h = l.x - d, f = Math.max(-i, Math.min(i, h / (c / 2) * i));
      a += (f - a) * r, n.angle = s + a;
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
  const r = e.offsetX ?? 0, o = e.offsetY ?? 20, s = e.durationFrames ?? 20, a = at(e.easing ?? "easeOutCubic"), l = e.delay ?? 0, c = i.position.x, d = i.position.y, h = i.alpha;
  i.position.x = c + r, i.position.y = d + o, i.alpha = 0;
  let f = -l;
  return {
    update(m) {
      if (f += m, f < 0) return;
      if (f >= s) {
        i.position.x = c, i.position.y = d, i.alpha = h;
        return;
      }
      const g = Math.min(f / s, 1), y = a(g);
      i.position.x = c + r * (1 - y), i.position.y = d + o * (1 - y), i.alpha = h * y;
    },
    detach() {
      i.position.x = c, i.position.y = d, i.alpha = h;
    }
  };
});
pe("embers", (t, e = {}) => {
  const n = de(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), o = Math.abs(i.height), s = e.count ?? 12, a = e.speed ?? 0.5, l = e.color ?? 16737792, c = e.alpha ?? 0.6, d = e.size ?? 2, h = new PIXI.Container();
  h.pivot.set(r / 2, o / 2), h.position.set(r / 2, o / 2);
  const f = new PIXI.Graphics();
  h.addChild(f), t.addChild(h);
  const m = n.scale.x, g = n.scale.y, y = n.angle, b = [];
  function v() {
    const w = Math.random();
    let E, S;
    return w < 0.7 ? (E = Math.random() * r, S = o) : w < 0.85 ? (E = 0, S = o * 0.5 + Math.random() * o * 0.5) : (E = r, S = o * 0.5 + Math.random() * o * 0.5), {
      x: E,
      y: S,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -a * (0.5 + Math.random() * 0.5),
      life: 0,
      maxLife: 40 + Math.random() * 60,
      size: d * (0.5 + Math.random() * 0.5)
    };
  }
  return u(v, "spawnParticle"), {
    update(w) {
      h.visible = n.visible !== !1, h.scale.set(n.scale.x / m, n.scale.y / g), h.angle = n.angle - y, b.length < s && b.push(v());
      for (let E = b.length - 1; E >= 0; E--) {
        const S = b[E];
        if (S.life += w, S.life >= S.maxLife) {
          b.splice(E, 1);
          continue;
        }
        S.x += S.vx * w, S.y += S.vy * w, S.vx += (Math.random() - 0.5) * 0.05 * w;
      }
      f.clear();
      for (const E of b) {
        const S = 1 - E.life / E.maxLife;
        f.beginFill(l, c * S * (n.alpha ?? 1)), f.drawCircle(E.x, E.y, E.size), f.endFill();
      }
    },
    detach() {
      h.parent && h.parent.removeChild(h), h.destroy({ children: !0 });
    }
  };
});
pe("runeGlow", (t, e = {}) => {
  const n = de(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), o = Math.abs(i.height), s = 2 * (r + o), a = e.dots ?? 3, l = e.speed ?? 1.2, c = e.color ?? 4513279, d = e.color2 ?? 8930559, h = e.radius ?? 3, f = e.alpha ?? 0.7, m = new PIXI.Graphics();
  m.pivot.set(r / 2, o / 2), m.position.set(r / 2, o / 2), t.addChildAt(m, 0);
  const g = n.scale.x, y = n.scale.y, b = n.angle, v = [];
  for (let S = 0; S < a; S++)
    v.push({
      phase: S / a * s,
      speedMul: 0.7 + Math.random() * 0.6,
      color: S % 2 === 0 ? c : d
    });
  function w(S) {
    return S = (S % s + s) % s, S < r ? { x: S, y: 0 } : (S -= r, S < o ? { x: r, y: S } : (S -= o, S < r ? { x: r - S, y: o } : (S -= r, { x: 0, y: o - S })));
  }
  u(w, "perimeterPoint");
  let E = 0;
  return {
    update(S) {
      E += S, m.visible = n.visible !== !1, m.alpha = f * (n.alpha ?? 1), m.scale.set(n.scale.x / g, n.scale.y / y), m.angle = n.angle - b, m.clear();
      for (const I of v) {
        const k = w(I.phase + E * l * I.speedMul);
        m.beginFill(I.color, 1), m.drawCircle(k.x, k.y, h), m.endFill();
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
  const i = t.document, r = Math.abs(i.width), o = Math.abs(i.height), s = e.maxRadius ?? Math.sqrt(r * r + o * o) / 2, a = e.rings ?? 3, l = e.interval ?? 30, c = e.speed ?? 1.5, d = e.color ?? 4513279, h = e.alpha ?? 0.4, f = e.lineWidth ?? 1.5, m = new PIXI.Container();
  m.pivot.set(r / 2, o / 2), m.position.set(r / 2, o / 2);
  const g = new PIXI.Graphics();
  m.addChild(g), t.addChild(m);
  const y = n.scale.x, b = n.scale.y, v = n.angle, w = [];
  let E = 0, S = 0;
  return {
    update(I) {
      E += I, m.visible = n.visible !== !1, m.scale.set(n.scale.x / y, n.scale.y / b), m.angle = n.angle - v, E >= S && w.length < a && (w.push({ radius: 0, alpha: h }), S = E + l);
      for (let $ = w.length - 1; $ >= 0; $--) {
        const N = w[$];
        N.radius += c * I, N.alpha = h * (1 - N.radius / s), N.radius >= s && w.splice($, 1);
      }
      g.clear();
      const k = r / 2, M = o / 2;
      for (const $ of w)
        g.lineStyle(f, d, $.alpha * (n.alpha ?? 1)), g.drawCircle(k, M, $.radius);
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
  const i = t.document, r = Math.abs(i.width), o = Math.abs(i.height), s = e.segments ?? 20, a = e.maxLength ?? 15, l = e.color ?? 11197951, c = e.alpha ?? 0.5, d = e.growSpeed ?? 0.02, h = new PIXI.Container();
  h.pivot.set(r / 2, o / 2), h.position.set(r / 2, o / 2);
  const f = new PIXI.Graphics(), m = new PIXI.Graphics();
  m.beginFill(16777215), m.drawRect(0, 0, r, o), m.endFill(), h.addChild(m), f.mask = m, h.addChild(f), t.addChild(h);
  const g = n.scale.x, y = n.scale.y, b = n.angle, v = [];
  for (let S = 0; S < s; S++) {
    const I = Math.floor(Math.random() * 4);
    let k, M, $;
    switch (I) {
      case 0:
        k = Math.random() * r, M = 0, $ = Math.PI / 2 + (Math.random() - 0.5) * 0.6;
        break;
      case 1:
        k = r, M = Math.random() * o, $ = Math.PI + (Math.random() - 0.5) * 0.6;
        break;
      case 2:
        k = Math.random() * r, M = o, $ = -Math.PI / 2 + (Math.random() - 0.5) * 0.6;
        break;
      default:
        k = 0, M = Math.random() * o, $ = (Math.random() - 0.5) * 0.6;
        break;
    }
    v.push({ sx: k, sy: M, angle: $, targetLength: a * (0.4 + Math.random() * 0.6), currentLength: 0, grown: !1 });
  }
  let w = !1, E = 0;
  return {
    update(S) {
      if (h.visible = n.visible !== !1, h.scale.set(n.scale.x / g, n.scale.y / y), h.angle = n.angle - b, w)
        E += S * 0.03;
      else {
        w = !0;
        for (const k of v)
          k.grown || (k.currentLength += (k.targetLength - k.currentLength) * d * S, k.currentLength >= k.targetLength * 0.99 ? (k.currentLength = k.targetLength, k.grown = !0) : w = !1);
      }
      const I = w ? c * (0.7 + 0.3 * Math.sin(E)) : c;
      f.clear(), f.lineStyle(1.5, l, I * (n.alpha ?? 1));
      for (const k of v)
        k.currentLength <= 0 || (f.moveTo(k.sx, k.sy), f.lineTo(k.sx + Math.cos(k.angle) * k.currentLength, k.sy + Math.sin(k.angle) * k.currentLength));
    },
    detach() {
      f.mask = null, h.parent && h.parent.removeChild(h), h.destroy({ children: !0 });
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
  const r = e.offsetY ?? 6, o = e.blur ?? 6, s = e.alpha ?? 0.35, a = e.color ?? 0, l = e.durationFrames ?? 12, c = at(e.easing ?? "easeOutCubic"), d = new i();
  d.blur = o, d.alpha = 0, d.color = a, d.quality = 3, d.distance = 0, d.rotation = 90;
  const h = n.filters ? [...n.filters] : [];
  n.filters = [...h, d];
  let f = 0;
  return {
    update(b) {
      if (f < l) {
        f += b;
        const v = Math.min(f / l, 1), w = c(v);
        d.distance = r * w, d.alpha = s * w;
      }
    },
    detach() {
      n.filters && (n.filters = n.filters.filter((b) => b !== d), n.filters.length === 0 && (n.filters = null)), d.destroy();
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
  const i = e.attribute ?? "alpha", r = e.from ?? 0.85, o = e.to ?? 1, s = e.period ?? 1500, a = at(e.easing ?? "easeInOutCosine"), c = { alpha: "alpha", rotation: "angle" }[i] ?? i, d = n[c];
  let h = 0;
  return {
    update(f) {
      h += f;
      const m = s / 16.667, g = Math.abs(h / m % 2 - 1), y = a(g);
      n[c] = r + (o - r) * y;
    },
    detach() {
      n[c] = d;
    }
  };
});
pe("tween-tint", (t, e = {}) => {
  const n = de(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.fromColor ?? "#ffffff", r = e.toColor ?? "#ffcc88", o = e.mode ?? "oklch", s = e.period ?? 3e3, a = at(e.easing ?? "easeInOutCosine"), l = su(o), c = foundry.utils.Color, d = c.from(i), h = c.from(r), f = n.tint;
  let m = 0;
  return {
    update(g) {
      m += g;
      const y = s / 16.667, b = Math.abs(m / y % 2 - 1), v = a(b), w = l(d, h, v);
      n.tint = c.from(w).valueOf();
    },
    detach() {
      n.tint = f;
    }
  };
});
pe("tween-scale", (t, e = {}) => {
  const n = de(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.fromScale ?? 0.95, r = e.toScale ?? 1.05, o = e.period ?? 2e3, s = at(e.easing ?? "easeInOutCosine"), a = n.scale.x, l = n.scale.y;
  let c = 0;
  return {
    update(d) {
      c += d;
      const h = o / 16.667, f = Math.abs(c / h % 2 - 1), m = s(f), g = i + (r - i) * m;
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
function Jv(t) {
  if (!t) return { ...Or };
  const e = /* @__PURE__ */ u((n, i) => n === void 0 ? i : typeof n == "string" ? [n] : typeof n == "object" && !Array.isArray(n) && n.name ? [n] : Array.isArray(n) ? n : i, "normalize");
  return {
    always: e(t.always, Or.always),
    idle: e(t.idle, Or.idle),
    hover: e(t.hover, Or.hover),
    dim: e(t.dim, Or.dim)
  };
}
u(Jv, "normalizeConfig");
var Se, $t, st, Ft, Vn, Gn, wt, Dt, vn, Ee, mm, as, gm, pm, ym, bm, vm, wm;
const Yr = class Yr {
  /**
   * @param {PlaceableObject} placeable
   * @param {object|undefined} animationConfig  Raw animation config from the await entry
   */
  constructor(e, n) {
    _(this, Ee);
    _(this, Se);
    _(this, $t);
    _(this, st, null);
    _(this, Ft, []);
    _(this, Vn, []);
    _(this, Gn, null);
    _(this, wt, null);
    _(this, Dt, null);
    _(this, vn, 0);
    O(this, Se, e), O(this, $t, Jv(n));
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
    O(this, st, e), O(this, Gn, (n) => {
      if (p(this, Se).destroyed || !p(this, Se).transform) {
        this.detach();
        return;
      }
      if (!p(this, wt)) {
        if (T(this, Ee, mm).call(this), !p(this, wt)) return;
        T(this, Ee, vm).call(this), T(this, Ee, ym).call(this, p(this, st));
        return;
      }
      p(this, Dt) && T(this, Ee, as).call(this);
      for (const i of p(this, Vn)) i.update(n);
      for (const i of p(this, Ft)) i.update(n);
      T(this, Ee, pm).call(this, n);
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
    var h;
    if (e === p(this, st)) return;
    if (!p(this, wt)) {
      O(this, st, e);
      return;
    }
    const n = ((h = p(this, Se).document) == null ? void 0 : h.id) ?? "?", i = de(p(this, Se)), r = p(this, $t)[p(this, st)] ?? p(this, $t).idle ?? ["none"], o = p(this, $t)[e] ?? p(this, $t).idle ?? ["none"], s = r.map((f) => typeof f == "string" ? f : f == null ? void 0 : f.name), a = o.map((f) => typeof f == "string" ? f : f == null ? void 0 : f.name);
    if (console.log(`%c[TileAnimator ${n}] setState: ${p(this, st)} → ${e}`, "color: #44DDFF; font-weight: bold"), console.log(`  old behaviours: [${s.join(", ")}]  →  new: [${a.join(", ")}]`), i && console.log(`  mesh BEFORE detach: pos=(${i.position.x.toFixed(2)}, ${i.position.y.toFixed(2)}) scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)} angle=${i.angle.toFixed(2)}`), p(this, wt)) {
      const f = p(this, wt);
      console.log(`  canonical: pos=(${f.x.toFixed(2)}, ${f.y.toFixed(2)}) scale=(${f.scaleX.toFixed(4)}, ${f.scaleY.toFixed(4)}) alpha=${f.alpha.toFixed(4)} angle=${f.angle.toFixed(2)}`);
    }
    const l = /* @__PURE__ */ new Map();
    for (let f = 0; f < p(this, Ft).length; f++) {
      const m = r[f], g = typeof m == "string" ? m : m == null ? void 0 : m.name;
      g && l.set(g, p(this, Ft)[f]);
    }
    const c = [], d = /* @__PURE__ */ new Set();
    for (const f of o) {
      const m = typeof f == "string" ? f : f.name;
      l.has(m) && !d.has(m) && d.add(m);
    }
    console.log(`  reused: [${[...d].join(", ")}]  detaching: [${[...l.keys()].filter((f) => !d.has(f)).join(", ")}]`), T(this, Ee, gm).call(this);
    for (const [f, m] of l)
      d.has(f) || (m.detach(), i && console.log(`  mesh AFTER detach("${f}"): scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)}`));
    T(this, Ee, as).call(this), i && console.log(`  mesh AFTER canonical restore: scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)}`);
    for (const f of o) {
      const m = typeof f == "string" ? f : f.name;
      if (l.has(m) && d.has(m))
        c.push(l.get(m)), d.delete(m), console.log(`  → reuse "${m}"`);
      else {
        const g = typeof f == "string" ? void 0 : f, y = ss(m);
        if (!y) {
          console.warn(`TileAnimator: unknown behaviour "${m}"`);
          continue;
        }
        c.push(y(p(this, Se), g, p(this, wt))), i && console.log(`  → create "${m}" — mesh after factory: scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)} pos=(${i.position.x.toFixed(2)}, ${i.position.y.toFixed(2)})`);
      }
    }
    if (p(this, Dt)) {
      const f = p(this, Dt);
      console.log(`  blend FROM: pos=(${f.x.toFixed(2)}, ${f.y.toFixed(2)}) scale=(${f.scaleX.toFixed(4)}, ${f.scaleY.toFixed(4)}) alpha=${f.alpha.toFixed(4)}`);
    }
    O(this, st, e), O(this, Ft, c);
  }
  /**
   * Full cleanup — detach all behaviours, restore canonical, and remove ticker.
   */
  detach() {
    var n, i;
    p(this, Se).destroyed || !p(this, Se).transform ? (O(this, Ft, []), O(this, Vn, [])) : (T(this, Ee, bm).call(this), T(this, Ee, wm).call(this), T(this, Ee, as).call(this)), O(this, Dt, null), O(this, st, null), p(this, Gn) && ((i = (n = canvas.app) == null ? void 0 : n.ticker) == null || i.remove(p(this, Gn)), O(this, Gn, null));
  }
};
Se = new WeakMap(), $t = new WeakMap(), st = new WeakMap(), Ft = new WeakMap(), Vn = new WeakMap(), Gn = new WeakMap(), wt = new WeakMap(), Dt = new WeakMap(), vn = new WeakMap(), Ee = new WeakSet(), // ── Private ──────────────────────────────────────────────────────────
mm = /* @__PURE__ */ u(function() {
  const e = de(p(this, Se));
  e && O(this, wt, {
    x: e.position.x,
    y: e.position.y,
    scaleX: e.scale.x,
    scaleY: e.scale.y,
    angle: e.angle,
    alpha: e.alpha,
    tint: e.tint
  });
}, "#captureCanonical"), as = /* @__PURE__ */ u(function() {
  const e = de(p(this, Se));
  if (!e || !p(this, wt)) return;
  const n = p(this, wt);
  e.position.x = n.x, e.position.y = n.y, e.scale.x = n.scaleX, e.scale.y = n.scaleY, e.angle = n.angle, e.alpha = n.alpha, e.tint = n.tint;
}, "#restoreCanonical"), /**
 * Snapshot the current (animated) mesh values so the transition blend
 * can lerp FROM here toward the new state's computed values.
 */
gm = /* @__PURE__ */ u(function() {
  const e = de(p(this, Se));
  e && (O(this, Dt, {
    x: e.position.x,
    y: e.position.y,
    scaleX: e.scale.x,
    scaleY: e.scale.y,
    angle: e.angle,
    alpha: e.alpha
  }), O(this, vn, 0));
}, "#captureBlendStart"), /**
 * After behaviours compute the new state's mesh values, blend from the
 * pre-transition snapshot toward those values over BLEND_FRAMES using
 * easeOutCubic. This hides the canonical-restore snap entirely.
 */
pm = /* @__PURE__ */ u(function(e) {
  var s, a;
  if (!p(this, Dt)) return;
  O(this, vn, p(this, vn) + e);
  const n = Math.min(p(this, vn) / Yr.BLEND_FRAMES, 1);
  if (n >= 1) {
    const l = ((s = p(this, Se).document) == null ? void 0 : s.id) ?? "?";
    console.log(`%c[TileAnimator ${l}] blend complete`, "color: #88FF88"), O(this, Dt, null);
    return;
  }
  const i = 1 - (1 - n) ** 3, r = de(p(this, Se));
  if (!r) return;
  const o = p(this, Dt);
  if (p(this, vn) <= e * 3) {
    const l = ((a = p(this, Se).document) == null ? void 0 : a.id) ?? "?", c = Math.round(p(this, vn) / e);
    console.log(`  [blend ${l} f${c}] t=${n.toFixed(3)} eased=${i.toFixed(3)} | behaviour→scale=(${r.scale.x.toFixed(4)},${r.scale.y.toFixed(4)}) alpha=${r.alpha.toFixed(4)} | blendFrom→scale=(${o.scaleX.toFixed(4)},${o.scaleY.toFixed(4)}) alpha=${o.alpha.toFixed(4)}`);
  }
  r.position.x = o.x + (r.position.x - o.x) * i, r.position.y = o.y + (r.position.y - o.y) * i, r.scale.x = o.scaleX + (r.scale.x - o.scaleX) * i, r.scale.y = o.scaleY + (r.scale.y - o.scaleY) * i, r.angle = o.angle + (r.angle - o.angle) * i, r.alpha = o.alpha + (r.alpha - o.alpha) * i, p(this, vn) <= e * 3 && console.log(`  [blend result] scale=(${r.scale.x.toFixed(4)},${r.scale.y.toFixed(4)}) alpha=${r.alpha.toFixed(4)} pos=(${r.position.x.toFixed(2)},${r.position.y.toFixed(2)})`);
}, "#applyBlend"), ym = /* @__PURE__ */ u(function(e) {
  O(this, st, e);
  const n = p(this, $t)[e] ?? p(this, $t).idle ?? ["none"];
  for (const i of n) {
    const r = typeof i == "string" ? i : i.name, o = typeof i == "string" ? void 0 : i, s = ss(r);
    if (!s) {
      console.warn(`TileAnimator: unknown behaviour "${r}"`);
      continue;
    }
    p(this, Ft).push(s(p(this, Se), o));
  }
}, "#attachBehaviours"), bm = /* @__PURE__ */ u(function() {
  for (const e of p(this, Ft)) e.detach();
  O(this, Ft, []);
}, "#detachBehaviours"), vm = /* @__PURE__ */ u(function() {
  const e = p(this, $t).always ?? [];
  for (const n of e) {
    const i = typeof n == "string" ? n : n.name, r = typeof n == "string" ? void 0 : n, o = ss(i);
    if (!o) {
      console.warn(`TileAnimator: unknown always behaviour "${i}"`);
      continue;
    }
    p(this, Vn).push(o(p(this, Se), r));
  }
}, "#attachAlwaysBehaviours"), wm = /* @__PURE__ */ u(function() {
  for (const e of p(this, Vn)) e.detach();
  O(this, Vn, []);
}, "#detachAlwaysBehaviours"), u(Yr, "TileAnimator"), /** Frames over which state transitions are blended (easeOutCubic). */
le(Yr, "BLEND_FRAMES", 8);
let Ri = Yr;
const Qv = "cinematic", il = 5, $c = /* @__PURE__ */ new Set();
function un(t) {
  for (const e of $c)
    try {
      e(t);
    } catch (n) {
      console.error("[cinematic] playback listener error:", n);
    }
}
u(un, "emitPlaybackEvent");
function Zv(t) {
  return $c.add(t), () => $c.delete(t);
}
u(Zv, "onPlaybackProgress");
let Oe = null, gn = null, Br = null, Ur = null, Ui = 0, pi = null;
function du(t, e = "default") {
  return `cinematic-progress-${t}-${e}`;
}
u(du, "progressFlagKey");
function ew(t, e, n, i) {
  game.user.setFlag(L, du(t, e), {
    currentSegment: n,
    completedSegments: [...i],
    timestamp: Date.now()
  }).catch(() => {
  });
}
u(ew, "saveSegmentProgress");
function Fc(t, e = "default") {
  game.user.unsetFlag(L, du(t, e)).catch(() => {
  });
}
u(Fc, "clearProgress");
function Em(t, e = "default", n = 3e5) {
  const i = game.user.getFlag(L, du(t, e));
  return !i || typeof i.timestamp != "number" || Date.now() - i.timestamp > n ? null : i.currentSegment ? i : null;
}
u(Em, "getSavedProgress");
function Hi(t, e = "default") {
  return `cinematic-seen-${t}-${e}`;
}
u(Hi, "seenFlagKey");
function Cd(t, e = "default") {
  return !!game.user.getFlag(L, Hi(t, e));
}
u(Cd, "hasSeenCinematic");
function tw(t, e) {
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
u(tw, "validateSingleCinematic");
function Fa(t) {
  const e = t ? game.scenes.get(t) : canvas.scene;
  let n = (e == null ? void 0 : e.getFlag(L, Qv)) ?? null;
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
    const o = tw(r, `scene ${e == null ? void 0 : e.id} cinematic "${i}"`);
    o ? n.cinematics[i] = o : delete n.cinematics[i];
  }
  return Object.keys(n.cinematics).length === 0 ? null : n;
}
u(Fa, "getCinematicData");
function $s(t, e = "default") {
  var i;
  const n = Fa(t);
  return ((i = n == null ? void 0 : n.cinematics) == null ? void 0 : i[e]) ?? null;
}
u($s, "getNamedCinematic");
function nw(t) {
  const e = Fa(t);
  return e ? Object.keys(e.cinematics) : [];
}
u(nw, "listCinematicNames");
function iw() {
  return game.ready ? Promise.resolve() : new Promise((t) => Hooks.once("ready", t));
}
u(iw, "waitForReady");
async function rw(t = 1e4) {
  var n, i;
  const e = (i = (n = game.modules.get(L)) == null ? void 0 : n.api) == null ? void 0 : i.tween;
  return e != null && e.Timeline ? e.Timeline : new Promise((r) => {
    const o = Date.now(), s = setTimeout(() => {
      var l, c;
      (c = (l = ui.notifications) == null ? void 0 : l.info) == null || c.call(l, `[${L}] Cinematic: waiting for tween engine...`);
    }, 2e3), a = setInterval(() => {
      var c, d, h, f;
      const l = (d = (c = game.modules.get(L)) == null ? void 0 : c.api) == null ? void 0 : d.tween;
      l != null && l.Timeline ? (clearInterval(a), clearTimeout(s), r(l.Timeline)) : Date.now() - o > t && (clearInterval(a), clearTimeout(s), console.warn(`[${L}] Cinematic: tween API not available after ${t}ms.`), (f = (h = ui.notifications) == null ? void 0 : h.warn) == null || f.call(h, `[${L}] Cinematic: tween engine unavailable — cinematic cannot play.`), r(null));
    }, 200);
  });
}
u(rw, "waitForTweenAPI");
async function Dc(t = 5e3) {
  var e;
  return window.Tagger ?? ((e = game.modules.get("tagger")) == null ? void 0 : e.api) ? !0 : new Promise((n) => {
    const i = Date.now(), r = setInterval(() => {
      var o;
      window.Tagger ?? ((o = game.modules.get("tagger")) == null ? void 0 : o.api) ? (clearInterval(r), n(!0)) : Date.now() - i > t && (clearInterval(r), console.warn(`[${L}] Cinematic: Tagger API not available after ${t}ms.`), n(!1));
    }, 200);
  });
}
u(Dc, "waitForTagger");
async function ow(t, e, n) {
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
      const o = new Promise((a) => setTimeout(a, t.timeout)), s = mc(i, { signal: n.signal, eventBus: null });
      await Promise.race([s, o]);
    } else
      await mc(i, { signal: n.signal, eventBus: null });
  } finally {
    r && r.detach();
  }
}
u(ow, "processGate");
function Sm(t) {
  if (!t.segments) return [];
  const e = [], n = /* @__PURE__ */ new Set();
  let i = t.entry;
  for (; i && typeof i == "string" && t.segments[i] && !n.has(i); )
    n.add(i), e.push(i), i = t.segments[i].next;
  return e;
}
u(Sm, "getSegmentOrder");
function Fs(t, e) {
  if (t.setup)
    try {
      Me(t.setup, e);
    } catch (i) {
      console.warn(`[${L}] Cinematic: error applying cinematic-level setup:`, i);
    }
  const n = Sm(t);
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
u(Fs, "applyAllSegmentLandingStates");
async function Vr(t, e = "default", n = null) {
  var w, E, S, I, k, M, $, N;
  const i = t ?? ((w = canvas.scene) == null ? void 0 : w.id);
  if (!i) return;
  const r = `${i}:${e}`;
  if (n || (n = /* @__PURE__ */ new Set()), n.has(r)) {
    console.warn(`[${L}] Cinematic: circular transition detected at "${r}". Stopping chain.`), (S = (E = ui.notifications) == null ? void 0 : E.warn) == null || S.call(E, "Cinematic: circular transition detected, stopping.");
    return;
  }
  n.add(r), (Oe == null ? void 0 : Oe.status) === "running" && Oe.cancel("replaced"), Oe = null, gn && (gn.abort("replaced"), gn = null);
  const o = $s(i, e);
  if (!o) {
    console.warn(`[${L}] Cinematic: no cinematic "${e}" on scene ${i}.`);
    return;
  }
  const s = await rw();
  if (!s || ((I = canvas.scene) == null ? void 0 : I.id) !== i || (await Dc(), ((k = canvas.scene) == null ? void 0 : k.id) !== i)) return;
  const { targets: a, unresolved: l } = Os(o);
  if (console.log(`[${L}] Cinematic "${e}": resolved ${a.size} targets`), l.length && console.warn(`[${L}] Cinematic "${e}": skipping ${l.length} unresolved: ${l.join(", ")}`), a.size === 0) {
    console.warn(`[${L}] Cinematic "${e}": no targets could be resolved on scene ${i}.`);
    return;
  }
  const c = sv(o);
  Br = ov(c, a), Ur = a;
  const d = Em(i, e), h = new AbortController();
  gn = h;
  const f = o.synchronized === !0 && game.user.isGM, m = Sm(o);
  if (m.length === 0) {
    console.warn(`[${L}] Cinematic "${e}": no segments to execute.`);
    return;
  }
  let g = 0;
  const y = /* @__PURE__ */ new Set();
  if (d) {
    const x = d.completedSegments ?? [];
    for (const A of x) y.add(A);
    const F = m.indexOf(d.currentSegment);
    F >= 0 && (g = F, console.log(`[${L}] Cinematic "${e}": resuming from segment "${d.currentSegment}" (${x.length} completed)`));
  }
  if (o.setup)
    try {
      Me(o.setup, a), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    } catch (x) {
      console.error(`[${L}] Cinematic "${e}": error applying cinematic-level setup:`, x);
    }
  for (let x = 0; x < g; x++) {
    const F = m[x], A = o.segments[F];
    if (A.setup)
      try {
        Me(A.setup, a);
      } catch (R) {
        console.warn(`[${L}] Cinematic: error applying setup for completed segment "${F}":`, R);
      }
    if (A.landing)
      try {
        Me(A.landing, a);
      } catch (R) {
        console.warn(`[${L}] Cinematic: error applying landing for completed segment "${F}":`, R);
      }
  }
  let b = !1, v = !1;
  un({ type: "playback-start", sceneName: ((M = canvas.scene) == null ? void 0 : M.name) ?? i });
  try {
    for (let x = g; x < m.length; x++) {
      if (h.signal.aborted) {
        b = !0;
        break;
      }
      if ((($ = canvas.scene) == null ? void 0 : $.id) !== i) {
        b = !0;
        break;
      }
      const F = m[x], A = o.segments[F];
      if (console.log(`[${L}] Cinematic "${e}": entering segment "${F}"`), un({ type: "segment-start", segmentName: F }), ew(i, e, F, [...y]), A.gate) {
        un({ type: "gate-wait", segmentName: F, gate: A.gate });
        try {
          await ow(A.gate, a, h);
        } catch (j) {
          if (h.signal.aborted) {
            b = !0;
            break;
          }
          throw j;
        }
        un({ type: "gate-resolved", segmentName: F });
      }
      if (h.signal.aborted) {
        b = !0;
        break;
      }
      if (A.setup)
        try {
          Me(A.setup, a), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
        } catch (j) {
          console.error(`[${L}] Cinematic "${e}": error applying setup for segment "${F}":`, j);
        }
      if ((N = A.timeline) != null && N.length) {
        const j = uu(A.timeline);
        un({ type: "timeline-start", segmentName: F, durationMs: j });
        const { tl: B } = hv(
          { setup: {}, timeline: A.timeline },
          a,
          s,
          {
            timelineName: `cinematic-${i}-${e}-${F}`,
            onStepComplete: /* @__PURE__ */ u((V) => {
              un({ type: "step-complete", segmentName: F, stepIndex: V });
            }, "onStepComplete")
          }
        );
        Oe = B.run({
          broadcast: f,
          commit: f
        });
        try {
          await new Promise((V, Y) => {
            B.onComplete(() => V()), B.onCancel(() => Y(new Error("cancelled"))), B.onError((J) => Y(new Error(`timeline error: ${J}`)));
            const oe = /* @__PURE__ */ u(() => Y(new Error("cancelled")), "onAbort");
            h.signal.addEventListener("abort", oe, { once: !0 });
          });
        } catch (V) {
          if (V.message === "cancelled" || h.signal.aborted) {
            b = !0;
            break;
          }
          throw V;
        }
        un({ type: "timeline-end", segmentName: F });
      }
      if (h.signal.aborted) {
        b = !0;
        break;
      }
      if (A.landing)
        try {
          Me(A.landing, a), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
        } catch (j) {
          console.error(`[${L}] Cinematic "${e}": error applying landing for segment "${F}":`, j);
        }
      un({ type: "segment-complete", segmentName: F }), y.add(F);
      const R = A.next;
      if (R && typeof R == "object" && R.scene) {
        const j = R.scene, B = R.segment ?? o.entry;
        console.log(`[${L}] Cinematic "${e}": cross-scene transition to scene ${j}, segment "${B}"`), Oe = null, gn = null, Fc(i, e), dd(), o.tracking !== !1 && await game.user.setFlag(L, Hi(i, e), !0), pi = { sceneId: j, cinematicName: e, visitedChain: n };
        const H = game.scenes.get(j);
        H ? H.view() : (console.warn(`[${L}] Cinematic: cross-scene transition target scene "${j}" not found.`), pi = null);
        return;
      }
    }
  } catch (x) {
    v = !0, console.error(`[${L}] Cinematic "${e}" error on scene ${i}:`, x);
  }
  if (Oe = null, gn = null, Fc(i, e), dd(), Br = null, Ur = null, un({ type: "playback-end", cancelled: !!b }), b) {
    console.log(`[${L}] Cinematic "${e}" cancelled on scene ${i}.`), Fs(o, a);
    return;
  }
  if (v) {
    Fs(o, a);
    return;
  }
  o.tracking !== !1 && await game.user.setFlag(L, Hi(i, e), !0), console.log(`[${L}] Cinematic "${e}" complete on scene ${i}.`);
}
u(Vr, "playCinematic");
async function sw(t, e = "default") {
  var i;
  const n = t ?? ((i = canvas.scene) == null ? void 0 : i.id);
  n && (await game.user.unsetFlag(L, Hi(n, e)), console.log(`[${L}] Cinematic: cleared seen flag for "${e}" on scene ${n}.`));
}
u(sw, "resetCinematic");
async function aw(t, e, n = "default") {
  var o;
  if (!game.user.isGM) return;
  const i = t ?? ((o = canvas.scene) == null ? void 0 : o.id);
  if (!i || !e) return;
  const r = game.users.get(e);
  r && (await r.unsetFlag(L, Hi(i, n)), console.log(`[${L}] Cinematic: cleared seen flag for user ${r.name} on "${n}" scene ${i}.`));
}
u(aw, "resetCinematicForUser");
async function lw(t, e = "default") {
  var o;
  if (!game.user.isGM) return;
  const n = t ?? ((o = canvas.scene) == null ? void 0 : o.id);
  if (!n) return;
  const i = Hi(n, e), r = game.users.map((s) => s.getFlag(L, i) ? s.unsetFlag(L, i) : Promise.resolve());
  await Promise.all(r), console.log(`[${L}] Cinematic: cleared seen flag for all users on "${e}" scene ${n}.`);
}
u(lw, "resetCinematicForAll");
function cw(t, e = "default") {
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
u(cw, "getSeenStatus");
function uw(t, e) {
  var i;
  const n = t ?? ((i = canvas.scene) == null ? void 0 : i.id);
  return e ? $s(n, e) != null : Fa(n) != null;
}
u(uw, "hasCinematic");
function dw() {
  if (!Br || !Ur) {
    console.warn(`[${L}] Cinematic: no snapshot available for revert.`);
    return;
  }
  (Oe == null ? void 0 : Oe.status) === "running" && Oe.cancel("reverted"), Oe = null, gn && (gn.abort("reverted"), gn = null);
  try {
    Me(Br, Ur), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 }), console.log(`[${L}] Cinematic: reverted to pre-cinematic state.`);
  } catch (t) {
    console.error(`[${L}] Cinematic: error during revert:`, t);
  }
  Br = null, Ur = null;
}
u(dw, "revertCinematic");
async function fw() {
  const t = ++Ui;
  if (console.log(`[${L}] Cinematic: canvasReady fired, gen=${t}, game.ready=${game.ready}`), await iw(), t !== Ui) return;
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
    const s = Em(e.id, o);
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
    if (!(s.tracking !== !1 && Cd(e.id, o))) {
      r = { name: o, data: s };
      break;
    }
  if (!r) {
    if (console.log(`[${L}] Cinematic: all canvasReady cinematics already seen on scene ${e.id}`), hw(e.id, i), (Oe == null ? void 0 : Oe.status) === "running" && Oe.cancel("already-seen"), Oe = null, await Dc(), t !== Ui) return;
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
  if (t === Ui && (console.log(`[${L}] Cinematic: playing first unseen cinematic "${r.name}"...`), await Dc(), t === Ui)) {
    for (const { name: o, data: s } of i) {
      if (o === r.name) continue;
      if (s.tracking !== !1 && Cd(e.id, o))
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
u(fw, "onCanvasReady$2");
function hw(t, e) {
  for (const { name: n } of e)
    Fc(t, n);
}
u(hw, "clearAllCanvasReadyProgress");
function mw(t = 3e5) {
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
u(mw, "cleanupStaleProgressFlags");
function gw() {
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
      onClick: /* @__PURE__ */ u(() => {
        new Oc({ scene: canvas.scene }).render(!0);
      }, "onClick")
    };
    Array.isArray(i) ? i.push(o) : i instanceof Map ? i.set(r, o) : i && typeof i == "object" ? i[r] = o : n.tools = [o];
  });
}
u(gw, "registerEditorButton");
function pw() {
  Hooks.on("canvasReady", fw), gw(), Hooks.once("ready", () => {
    mw();
    const t = game.modules.get(L);
    t.api || (t.api = {}), t.api.cinematic = {
      play: Vr,
      reset: sw,
      resetForUser: aw,
      resetForAll: lw,
      getSeenStatus: cw,
      has: uw,
      get: $s,
      list: nw,
      revert: dw,
      onPlaybackProgress: Zv,
      TileAnimator: Ri,
      registerBehaviour: pe,
      getBehaviour: ss,
      trigger: /* @__PURE__ */ u(async (e, n, i = "default") => {
        var s;
        const r = n ?? ((s = canvas.scene) == null ? void 0 : s.id);
        if (!r) return;
        const o = $s(r, i);
        o && (o.trigger && o.trigger !== e || await Vr(r, i));
      }, "trigger")
    }, console.log(`[${L}] Cinematic API registered (v5).`);
  });
}
u(pw, "registerCinematicHooks");
function Pc(t, e) {
  const n = Math.abs(t.width), i = Math.abs(t.height), r = n / 2, o = i / 2;
  let s = e.x - (t.x + r), a = e.y - (t.y + o);
  if (t.rotation !== 0) {
    const l = Math.toRadians(t.rotation), c = Math.cos(l), d = Math.sin(l), h = c * s + d * a, f = c * a - d * s;
    s = h, a = f;
  }
  return s += r, a += o, s >= 0 && s <= n && a >= 0 && a <= i;
}
u(Pc, "pointWithinTile");
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
  const c = /* @__PURE__ */ u((g) => {
    const y = canvas.activeLayer;
    if (!y) return;
    const b = y.toLocal(g);
    if (!b || isNaN(b.x) || isNaN(b.y)) return;
    let v = !1;
    for (const { placeable: w, animator: E } of s)
      Pc(w.document, b) ? (v = !0, E.state !== "hover" && E.setState("hover")) : E.state === "hover" && E.setState("idle");
    v ? l === null && (l = document.body.style.cursor, document.body.style.cursor = "pointer") : l !== null && (document.body.style.cursor = l, l = null);
  }, "onPointerMove");
  a == null || a.addEventListener("pointermove", c);
  const d = /* @__PURE__ */ u((g) => {
    if (g.button !== 0) return;
    const y = canvas.activeLayer;
    if (!y) return;
    const b = y.toLocal(g);
    isNaN(b.x) || isNaN(b.y) || !o.filter(({ doc: w }) => Pc(w, b)).sort((w, E) => (E.doc.sort ?? 0) - (w.doc.sort ?? 0))[0] || (g.stopPropagation(), g.preventDefault(), f(), n());
  }, "onPointerDown");
  a == null || a.addEventListener("pointerdown", d, { capture: !0 });
  const h = /* @__PURE__ */ u(() => {
    f(), i(e.signal.reason ?? "aborted");
  }, "onAbort");
  e.signal.addEventListener("abort", h, { once: !0 });
  function f() {
    a == null || a.removeEventListener("pointerdown", d, { capture: !0 }), a == null || a.removeEventListener("pointermove", c), e.signal.removeEventListener("abort", h);
    for (const { animator: g } of s)
      g.detach();
    l !== null ? (document.body.style.cursor = l, l = null) : document.body.style.cursor = "";
  }
  u(f, "cleanup");
}) : Promise.reject(new Error('await tile-click: "target" is required')));
pw();
function yw() {
  Hooks.once("ready", () => {
    const t = game.modules.get(L);
    t.api || (t.api = {}), t.api.picker = {
      /** Open the picker window. Returns Promise<string[] | null>. */
      open: /* @__PURE__ */ u((e) => Ns.open(e), "open"),
      /** Resolve a selector string to documents. */
      resolveSelector: Na,
      /** Parse a selector string into { type, value }. */
      parseSelector: cu,
      /** Build a selector string from { type, value }. */
      buildSelector: ev,
      /** Build a tag selector from tags array + mode. */
      buildTagSelector: Rh,
      /** Canvas highlight utilities. */
      highlight: {
        add: _s,
        remove: hr,
        has: Kh,
        clearAll: os
      }
    }, console.log(`[${L}] Placeable Picker API registered.`);
  });
}
u(yw, "registerPlaceablePickerHooks");
yw();
const kr = "canvas-popup", bw = 100;
function vw(t) {
  const e = canvas.stage.worldTransform, n = document.getElementById("board"), i = n == null ? void 0 : n.getBoundingClientRect(), r = (i == null ? void 0 : i.left) ?? 0, o = (i == null ? void 0 : i.top) ?? 0;
  return {
    x: e.a * t.x + e.c * t.y + e.tx + r,
    y: e.b * t.x + e.d * t.y + e.ty + o
  };
}
u(vw, "canvasToScreen");
function ww() {
  var t, e;
  return ((e = (t = canvas.stage) == null ? void 0 : t.scale) == null ? void 0 : e.x) ?? 1;
}
u(ww, "getZoom");
function rl(t, e) {
  var n;
  return e === "grid" ? t * (((n = canvas.grid) == null ? void 0 : n.size) ?? 100) : t;
}
u(rl, "resolveUnit");
function Ew(t, e) {
  let n = !1;
  function i(r) {
    n && r.button === 0 && (t.contains(r.target) || e());
  }
  return u(i, "handler"), requestAnimationFrame(() => {
    n = !0;
  }), document.addEventListener("pointerdown", i, !0), () => {
    document.removeEventListener("pointerdown", i, !0);
  };
}
u(Ew, "attachClickOutside");
function Sw(t, e) {
  let n = !1;
  function i(r) {
    n && r.button === 2 && (t.contains(r.target) || e());
  }
  return u(i, "handler"), requestAnimationFrame(() => {
    n = !0;
  }), document.addEventListener("pointerdown", i, !0), () => {
    document.removeEventListener("pointerdown", i, !0);
  };
}
u(Sw, "attachRightClickOutside");
function Cw(t, e) {
  function n(i) {
    i.key === "Escape" && (i.preventDefault(), i.stopPropagation(), e());
  }
  return u(n, "handler"), document.addEventListener("keydown", n, !0), () => {
    document.removeEventListener("keydown", n, !0);
  };
}
u(Cw, "attachEscape");
const ol = /* @__PURE__ */ new Set(), qo = 8, Td = 0.5, ku = class ku {
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
    e.className = kr, this._cssClass && e.classList.add(...this._cssClass.split(/\s+/)), e.style.position = "fixed", e.style.zIndex = bw;
    const n = document.createElement("div");
    n.className = `${kr}__content`, e.appendChild(n), this.element = e, this._contentWrap = n;
    const i = this._resolveWidth();
    i != null && (n.style.width = `${i}px`, n.style.minWidth = "0", n.style.boxSizing = "border-box"), this._initialContent && this.setContent(this._initialContent), document.body.appendChild(e), this.reposition(), this._animate ? requestAnimationFrame(() => {
      this.element && this.element.classList.add(`${kr}--visible`);
    }) : e.classList.add(`${kr}--visible`), this._hookId = Hooks.on("canvasPan", () => this.reposition()), this._anchor.placeable && ((o = canvas.app) != null && o.ticker) && (this._tickerFn = () => this.reposition(), canvas.app.ticker.add(this._tickerFn));
    const r = /* @__PURE__ */ u((s) => {
      this._emit("dismiss", s), this.destroy();
    }, "dismissFn");
    return this._dismiss.clickOutside && this._cleanups.push(Ew(e, () => r("clickOutside"))), this._dismiss.rightClickOutside && this._cleanups.push(Sw(e, () => r("rightClickOutside"))), this._dismiss.escape && this._cleanups.push(Cw(e, () => r("escape"))), this.isOpen = !0, ol.add(this), this._emit("open"), this;
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
        const i = /* @__PURE__ */ u(() => {
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
    const n = ww(), i = this._sizeUnit !== "screen", r = rl(this._offset.x, this._sizeUnit), o = rl(this._offset.y, this._sizeUnit), s = {
      x: e.x + r,
      y: e.y + o
    }, a = vw(s);
    if (Math.abs(a.x - this._lastScreenPos.x) < Td && Math.abs(a.y - this._lastScreenPos.y) < Td)
      return;
    this._lastScreenPos = { x: a.x, y: a.y };
    const l = this.element, c = i ? n : 1;
    i ? (l.style.transformOrigin = `${this._anchorX} ${this._anchorY}`, l.style.transform = `scale(${c})`) : (l.style.transform = "", l.style.transformOrigin = "");
    let d = 0, h = 0;
    const f = l.getBoundingClientRect();
    this._anchorX === "center" ? d = -f.width / 2 : this._anchorX === "right" && (d = -f.width), this._anchorY === "center" ? h = -f.height / 2 : this._anchorY === "bottom" && (h = -f.height);
    let m = a.x + d, g = a.y + h;
    if (this._clampToViewport) {
      const y = window.innerWidth - f.width - qo, b = window.innerHeight - f.height - qo;
      m = Math.max(qo, Math.min(m, y)), g = Math.max(qo, Math.min(g, b));
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
u(ku, "CanvasPopup");
let Ds = ku;
const fi = "canvas-popup-options";
function Tw({ sections: t = [] } = {}) {
  const e = /* @__PURE__ */ new Map(), n = document.createElement("div");
  n.className = fi;
  for (const a of t) {
    const l = document.createElement("div");
    l.className = `${fi}__section`;
    const c = document.createElement("div");
    c.className = `${fi}__header`, c.textContent = a.label, l.appendChild(c);
    for (const d of a.items) {
      const h = document.createElement("div");
      h.className = `${fi}__item`, d.active && h.classList.add(`${fi}__item--active`), h.dataset.key = a.key, h.dataset.value = d.value;
      const f = document.createElement("span");
      f.className = `${fi}__dot`, h.appendChild(f);
      const m = document.createElement("span");
      m.className = `${fi}__label`, m.textContent = d.label, h.appendChild(m), h.addEventListener("click", (g) => {
        i("select", a.key, d.value, d, g);
      }), h.addEventListener("mouseenter", () => {
        i("hover", a.key, d.value, d);
      }), h.addEventListener("mouseleave", () => {
        i("hoverEnd", a.key, d.value, d);
      }), l.appendChild(h);
    }
    n.appendChild(l);
  }
  function i(a, ...l) {
    const c = e.get(a);
    if (c)
      for (const d of c)
        try {
          d(...l);
        } catch (h) {
          console.error(`[OptionList] Error in '${a}' listener:`, h);
        }
  }
  u(i, "emit");
  function r(a, l) {
    e.has(a) || e.set(a, /* @__PURE__ */ new Set()), e.get(a).add(l);
  }
  u(r, "on");
  function o(a, l) {
    var c;
    (c = e.get(a)) == null || c.delete(l);
  }
  u(o, "off");
  function s() {
    e.clear(), n.remove();
  }
  return u(s, "destroy"), { element: n, on: r, off: o, destroy: s };
}
u(Tw, "createOptionList");
function Lw() {
  Hooks.once("ready", () => {
    const t = game.modules.get(L);
    t.api || (t.api = {}), t.api.canvasPopup = {
      CanvasPopup: Ds,
      content: { createOptionList: Tw }
    }, console.log(`[${L}] Canvas Popup API registered.`);
  }), Hooks.on("canvasTearDown", () => Ds.destroyAll());
}
u(Lw, "registerCanvasPopupHooks");
Lw();
function Iw(t, e) {
  const n = t.shape;
  if (!n) return !1;
  const i = t.x ?? 0, r = t.y ?? 0, o = n.width ?? 0, s = n.height ?? 0, a = t.rotation ?? 0, l = i + o / 2, c = r + s / 2;
  let d = e.x - l, h = e.y - c;
  if (a !== 0) {
    const f = Math.toRadians(a), m = Math.cos(f), g = Math.sin(f), y = m * d + g * h, b = m * h - g * d;
    d = y, h = b;
  }
  switch (d += o / 2, h += s / 2, n.type) {
    case "r":
      return d >= 0 && d <= o && h >= 0 && h <= s;
    case "e": {
      const f = o / 2, m = s / 2;
      if (f <= 0 || m <= 0) return !1;
      const g = (d - f) / f, y = (h - m) / m;
      return g * g + y * y <= 1;
    }
    case "p": {
      const f = n.points;
      return !Array.isArray(f) || f.length < 6 ? !1 : Ow(d, h, f);
    }
    case "f":
      return d >= 0 && d <= o && h >= 0 && h <= s;
    default:
      return !1;
  }
}
u(Iw, "pointWithinDrawing");
function Ow(t, e, n) {
  let i = !1;
  const r = n.length;
  for (let o = 0, s = r - 2; o < r; s = o, o += 2) {
    const a = n[o], l = n[o + 1], c = n[s], d = n[s + 1];
    l > e != d > e && t < (c - a) * (e - l) / (d - l) + a && (i = !i);
  }
  return i;
}
u(Ow, "pointInPolygon");
const Gr = "eidolon-utilities", kw = "tile-interactions", Aw = "tile-animations", Mw = "idle-animation";
function xw(t) {
  const e = t.type ?? "tile-prop";
  return e === "tile-tint" ? { name: "tween-tint", fromColor: t.fromColor, toColor: t.toColor, mode: t.mode, period: t.period, easing: t.easing } : e === "tile-scale" ? { name: "tween-scale", fromScale: t.fromScale, toScale: t.toScale, period: t.period, easing: t.easing } : { name: "tween-prop", attribute: t.attribute, from: t.from, to: t.to, period: t.period, easing: t.easing };
}
u(xw, "migrateIdleTweenToAlways");
function fu(t) {
  var c, d, h;
  const e = (c = t == null ? void 0 : t.getFlag) == null ? void 0 : c.call(t, Gr, Aw);
  if (e) return e;
  const n = (d = t == null ? void 0 : t.getFlag) == null ? void 0 : d.call(t, Gr, Mw), i = (h = t == null ? void 0 : t.getFlag) == null ? void 0 : h.call(t, Gr, kw);
  let r = [], o = [], s = [], a = [];
  if (n) {
    let f;
    Array.isArray(n) ? f = n : typeof n == "object" && "0" in n ? f = Object.values(n) : typeof n == "object" && (n.type || n.attribute) ? f = [n] : f = [], r = f.filter((m) => m && typeof m == "object").map(xw);
  }
  return i && (i.hover && (Array.isArray(i.hover) ? s = i.hover : typeof i.hover == "object" && (o = Array.isArray(i.hover.idle) ? i.hover.idle : [], s = Array.isArray(i.hover.enter) ? i.hover.enter : [])), Array.isArray(i.click) && i.click.length && (a = i.click)), r.length > 0 || o.length > 0 || s.length > 0 || a.length > 0 ? { always: r, idle: o, hover: s, click: a } : null;
}
u(fu, "readUnifiedConfig");
const Sn = /* @__PURE__ */ new Map(), ni = /* @__PURE__ */ new Map(), Ld = /* @__PURE__ */ new WeakMap(), Wr = /* @__PURE__ */ new Set();
let Ht = null, Je = null, Pt = null, en = null, tn = null;
function Cm(t) {
  const e = canvas.activeLayer;
  if (!e) return null;
  const n = e.toLocal(t);
  return !n || Number.isNaN(n.x) || Number.isNaN(n.y) ? null : n;
}
u(Cm, "canvasToLocal");
function Tm(t) {
  let e = null, n = -1 / 0;
  for (const [i, r] of Sn) {
    if (!(r.placeableType === "drawing" ? Iw(r.doc, t) : Pc(r.doc, t))) continue;
    const s = (r.doc.sort ?? 0) + (r.placeableType === "drawing" ? 1e9 : 0);
    s > n && (e = r, n = s);
  }
  return e;
}
u(Tm, "hitTest");
function _w(t) {
  var e, n;
  return {
    always: t.always ?? [],
    idle: (e = t.idle) != null && e.length ? t.idle : ["none"],
    hover: (n = t.hover) != null && n.length ? t.hover : ["none"]
  };
}
u(_w, "buildAnimatorConfig");
function hu(t, e, n) {
  Ao(t);
  const i = _w(n), r = new Ri(e, i);
  r.start("idle"), ni.set(t, r);
}
u(hu, "startHoverAnimator");
function Ao(t) {
  const e = ni.get(t);
  e && (e.detach(), ni.delete(t));
}
u(Ao, "stopHoverAnimator");
function sl(t, e, n, i) {
  return e.type === "tile-tint" ? { uuid: t, toColor: n ? e.toColor : e.fromColor, mode: e.mode } : e.type === "tile-scale" ? {
    uuid: t,
    toScale: n ? e.toScale : e.fromScale,
    ...i
  } : { uuid: t, attribute: e.attribute, value: n ? e.to : e.from };
}
u(sl, "buildClickParams");
function Nw(t) {
  const e = t._source.width, n = t._source.height, i = t._source.x, r = t._source.y;
  return {
    baseWidth: e,
    baseHeight: n,
    centerX: i + e / 2,
    centerY: r + n / 2
  };
}
u(Nw, "captureRefGeometry");
async function $w(t, e) {
  const n = t.uuid, i = e.type ?? "tile-prop", r = vr(i);
  if (!r) {
    console.warn(`[${Gr}] tile-interactions: unknown tween type "${i}"`);
    return;
  }
  const o = e.period ?? 300, s = e.easing ?? "easeOutCubic", a = e.mode ?? "bounce", l = i === "tile-scale" ? Nw(t) : null;
  if (a === "toggle") {
    const d = !(Ld.get(t) ?? !1);
    await r.execute(
      sl(n, e, d, l),
      { durationMS: o, easing: s, commit: !0 }
    ), Ld.set(t, d);
  } else {
    const c = o / 2;
    await r.execute(
      sl(n, e, !0, l),
      { durationMS: c, easing: s, commit: !1 }
    ), await r.execute(
      sl(n, e, !1, l),
      { durationMS: c, easing: s, commit: !1 }
    );
  }
}
u($w, "playClickAnimation");
async function Fw(t) {
  var n, i, r, o, s;
  const e = t.doc.id;
  if (!Wr.has(e)) {
    Wr.add(e);
    try {
      if (Ao(e), (n = t.clickConfig) != null && n.length) {
        const a = t.clickConfig.map((l) => $w(t.doc, l));
        await Promise.all(a);
      }
      if (t.macroUuid) {
        const a = await fromUuid(t.macroUuid);
        a ? a.execute({ placeable: t.placeable }) : console.warn(`[${Gr}] tile-interactions: macro not found: ${t.macroUuid}`);
      }
    } finally {
      Wr.delete(e), t.animConfig && (((i = t.animConfig.always) == null ? void 0 : i.length) > 0 || ((r = t.animConfig.idle) == null ? void 0 : r.length) > 0 || ((o = t.animConfig.hover) == null ? void 0 : o.length) > 0) && (hu(e, t.placeable, t.animConfig), Ht === e && ((s = ni.get(e)) == null || s.setState("hover")));
    }
  }
}
u(Fw, "handleClick");
function Lm(t) {
  var l, c, d;
  const e = Cm(t);
  if (!e) return;
  const n = Tm(e), i = (n == null ? void 0 : n.doc.id) ?? null;
  if (i === Ht) return;
  if (Ht) {
    const h = ni.get(Ht);
    h && h.setState("idle");
  }
  if (i) {
    const h = ni.get(i);
    h && h.setState("hover");
  }
  Ht = i;
  const r = (l = canvas.tokens) == null ? void 0 : l.active, o = (c = n == null ? void 0 : n.animConfig) == null ? void 0 : c.cursor, s = r && i && (o === !0 || o !== !1 && (((d = n.clickConfig) == null ? void 0 : d.length) || n.macroUuid)), a = document.getElementById("board");
  s ? (Je === null && (Je = (a == null ? void 0 : a.style.cursor) ?? ""), a && (a.style.cursor = "pointer")) : Je !== null && (a && (a.style.cursor = Je), Je = null);
}
u(Lm, "onPointerMove");
function Im(t) {
  var i, r;
  if (t.button !== 0 || !((i = canvas.tokens) != null && i.active)) return;
  const e = Cm(t);
  if (!e) return;
  const n = Tm(e);
  n && (!((r = n.clickConfig) != null && r.length) && !n.macroUuid || Fw(n));
}
u(Im, "onPointerDown");
function Om() {
  if (Ht) {
    const t = ni.get(Ht);
    t && t.setState("idle"), Ht = null;
  }
  if (Je !== null) {
    const t = document.getElementById("board");
    t && (t.style.cursor = Je), Je = null;
  }
}
u(Om, "onPointerLeave");
function Id(t, e, n) {
  var a, l, c;
  const i = fu(t);
  if (!i) return;
  const r = ((a = i.always) == null ? void 0 : a.length) > 0 || ((l = i.idle) == null ? void 0 : l.length) > 0 || ((c = i.hover) == null ? void 0 : c.length) > 0, o = Array.isArray(i.click) && i.click.length ? i.click : null, s = i.macro || null;
  !r && !o && !s || (Sn.set(t.id, { doc: t, placeable: e, animConfig: i, clickConfig: o, macroUuid: s, placeableType: n }), r && hu(t.id, e, i));
}
u(Id, "registerPlaceable");
function km() {
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
      Id(o.document, o, "tile");
  const n = (r = canvas.drawings) == null ? void 0 : r.placeables;
  if (Array.isArray(n))
    for (const o of n)
      Id(o.document, o, "drawing");
  Sn.size !== 0 && (Pt = Lm, en = Im, tn = Om, t == null || t.addEventListener("pointermove", Pt), t == null || t.addEventListener("pointerdown", en), t == null || t.addEventListener("pointerleave", tn));
}
u(km, "rebuild");
function Dw(t) {
  Am(t, "tile");
}
u(Dw, "updateTile");
function Pw(t) {
  mu(t);
}
u(Pw, "removeTile");
function Rw(t) {
  Am(t, "drawing");
}
u(Rw, "updateDrawing");
function Hw(t) {
  mu(t);
}
u(Hw, "removeDrawing");
function Am(t, e) {
  var l, c, d;
  const n = t.id, i = fu(t), r = i && (((l = i.always) == null ? void 0 : l.length) > 0 || ((c = i.idle) == null ? void 0 : c.length) > 0 || ((d = i.hover) == null ? void 0 : d.length) > 0), o = i && Array.isArray(i.click) && i.click.length ? i.click : null, s = (i == null ? void 0 : i.macro) || null;
  if (!r && !o && !s) {
    mu(t);
    return;
  }
  Ao(n);
  const a = t.object;
  if (!a) {
    Sn.delete(n);
    return;
  }
  Sn.set(n, { doc: t, placeable: a, animConfig: i, clickConfig: o, macroUuid: s, placeableType: e }), r && hu(n, a, i), qw();
}
u(Am, "updatePlaceable");
function mu(t) {
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
u(mu, "removePlaceable");
function qw() {
  if (Sn.size === 0 || Pt) return;
  const t = document.getElementById("board");
  t && (Pt = Lm, en = Im, tn = Om, t.addEventListener("pointermove", Pt), t.addEventListener("pointerdown", en), t.addEventListener("pointerleave", tn));
}
u(qw, "ensureListeners");
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
u(Wi, "buildSelectGroup");
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
u(zi, "buildNumberGroup");
function Rc(t, e, n) {
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
u(Rc, "buildColorGroup");
let se = null;
function al() {
  for (const t of document.querySelectorAll(".idle-anim__slot--insert-before, .idle-anim__slot--insert-after"))
    t.classList.remove("idle-anim__slot--insert-before", "idle-anim__slot--insert-after");
}
u(al, "clearInsertIndicators");
function Od(t) {
  for (const e of document.querySelectorAll(".idle-anim__slots"))
    e.classList.toggle("idle-anim__slots--drag-active", t);
}
u(Od, "setDragActive");
function Ps(t, e) {
  t.dispatchEvent(new CustomEvent("slot-reorder", { detail: { card: e } }));
}
u(Ps, "notifyReorder");
function Mm(t, { dropGroup: e, handleSelector: n = ".idle-anim__slot-header" }) {
  t.setAttribute("draggable", "true");
  let i = !1;
  t.addEventListener("pointerdown", (r) => {
    i = !!r.target.closest(n);
  }), t.addEventListener("dragstart", (r) => {
    if (!i) {
      r.preventDefault();
      return;
    }
    se = { card: t, sourceContainer: t.parentElement, group: e, insertMode: null, insertTarget: null }, t.classList.add("is-dragging"), Od(!0), r.dataTransfer.effectAllowed = "move", r.dataTransfer.setData("text/plain", "");
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
    t.classList.remove("is-dragging"), al(), Od(!1);
    for (const r of document.querySelectorAll(".idle-anim__slots--drag-over"))
      r.classList.remove("idle-anim__slots--drag-over");
    se = null;
  });
}
u(Mm, "makeDraggable");
function xm(t, { dropGroup: e, onDrop: n }) {
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
u(xm, "makeDropContainer");
const jo = "eidolon-utilities", kd = "tile-animations", jw = "tile-interactions", Bw = "idle-animation", Uw = "eidolon-idle-animation", Vw = "fa-solid fa-wave-pulse", _m = [
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
], Gw = [
  { value: "tween-prop", label: "Numeric" },
  { value: "tween-tint", label: "Tint" },
  { value: "tween-scale", label: "Scale" }
], Nm = {
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
}, $m = [
  { value: "alpha", label: "Alpha (Opacity)" },
  { value: "rotation", label: "Rotation" },
  { value: "texture.rotation", label: "Texture Rotation" }
];
let Mn = null;
function Ww(t) {
  var e;
  return (t == null ? void 0 : t.document) ?? ((e = t == null ? void 0 : t.object) == null ? void 0 : e.document) ?? (t == null ? void 0 : t.object) ?? null;
}
u(Ww, "getPlaceableDocument");
function zw(t, e) {
  const n = document.createElement("div");
  n.classList.add("form-group");
  const i = document.createElement("label");
  i.textContent = "Type", n.appendChild(i);
  const r = document.createElement("select");
  r.classList.add(e);
  const o = document.createElement("optgroup");
  o.label = "Effects";
  for (const a of _m) {
    const l = document.createElement("option");
    l.value = a.value, l.textContent = a.label, a.value === t && (l.selected = !0), o.appendChild(l);
  }
  r.appendChild(o);
  const s = document.createElement("optgroup");
  s.label = "Tweens";
  for (const a of Gw) {
    const l = document.createElement("option");
    l.value = a.value, l.textContent = a.label, a.value === t && (l.selected = !0), s.appendChild(l);
  }
  return r.appendChild(s), n.appendChild(r), n;
}
u(zw, "buildEffectTypeSelect");
function Ad(t) {
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
  const n = _m.find((i) => i.value === e);
  return (n == null ? void 0 : n.label) ?? e;
}
u(Ad, "summarizeEffectConfig");
function Md(t, e, n, i) {
  const r = t.name ?? "float", o = ou(), s = dr(), a = document.createElement("div");
  a.classList.add("idle-anim__slot", "is-collapsed", n), a.dataset.index = String(e);
  const l = document.createElement("div");
  l.classList.add("idle-anim__slot-header");
  const c = document.createElement("i");
  c.classList.add("fa-solid", "fa-chevron-right", "idle-anim__slot-chevron");
  const d = document.createElement("span");
  d.classList.add("idle-anim__slot-title"), d.textContent = `${i} ${e + 1}`;
  const h = document.createElement("span");
  h.classList.add("idle-anim__slot-summary"), h.textContent = Ad(t);
  const f = document.createElement("button");
  f.type = "button", f.classList.add("idle-anim__slot-remove"), f.innerHTML = '<i class="fa-solid fa-xmark"></i>', f.title = "Remove effect", l.append(c, d, h, f), a.appendChild(l);
  const m = document.createElement("div");
  m.classList.add("idle-anim__slot-body");
  const g = zw(r, "ti-effect__type");
  m.appendChild(g);
  const y = document.createElement("div");
  y.classList.add("idle-anim__type-fields"), m.appendChild(y);
  function b(w, E) {
    y.innerHTML = "";
    const S = Nm[w];
    if (S)
      for (const I of S) {
        const k = E[I.key] ?? I.default;
        if (I.type === "color")
          y.appendChild(Rc(I.label, `ti-effect__${I.key}`, k));
        else if (I.type === "select") {
          let M;
          I.options === "interpolation" ? M = s.map(($) => ({ value: $, label: $, selected: $ === k })) : Array.isArray(I.options) ? M = I.options.map(($) => ({ value: $.value, label: $.label, selected: $.value === k })) : M = o.map(($) => ({ value: $, label: $, selected: $ === k })), y.appendChild(Wi(I.label, `ti-effect__${I.key}`, M));
        } else
          y.appendChild(zi(I.label, `ti-effect__${I.key}`, k, I.attrs ?? {}));
      }
  }
  u(b, "renderParams"), b(r, t), a.appendChild(m);
  const v = a.querySelector(".ti-effect__type");
  return v == null || v.addEventListener("change", () => {
    b(v.value, {});
  }), l.addEventListener("click", (w) => {
    if (!w.target.closest(".idle-anim__slot-remove") && (a.classList.toggle("is-collapsed"), a.classList.contains("is-collapsed"))) {
      const E = Fm(a);
      E && (h.textContent = Ad(E));
    }
  }), f.addEventListener("click", (w) => {
    w.stopPropagation();
    const E = a.parentElement;
    a.remove(), E && Da(E, n, i);
  }), Mm(a, { dropGroup: "effect" }), a;
}
u(Md, "buildEffectSlot");
function Fm(t) {
  var r;
  const e = ((r = t.querySelector(".ti-effect__type")) == null ? void 0 : r.value) ?? "float", n = Nm[e], i = { name: e };
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
u(Fm, "readEffectSlot");
function xd(t) {
  if (!t) return "";
  const e = t.type ?? "tile-prop", n = t.mode ?? "bounce", i = n.charAt(0).toUpperCase() + n.slice(1);
  if (e === "tile-tint")
    return `${i} Tint ${t.fromColor ?? "?"} → ${t.toColor ?? "?"} (${t.period ?? "?"}ms)`;
  if (e === "tile-scale") {
    const s = t.fromScale != null ? `${Math.round(t.fromScale * 100)}%` : "?", a = t.toScale != null ? `${Math.round(t.toScale * 100)}%` : "?";
    return `${i} Scale ${s} → ${a} (${t.period ?? "?"}ms)`;
  }
  const r = $m.find((s) => s.value === t.attribute), o = (r == null ? void 0 : r.label) ?? t.attribute ?? "?";
  return `${i} ${o} ${t.from ?? "?"} → ${t.to ?? "?"} (${t.period ?? "?"}ms)`;
}
u(xd, "summarizeClickConfig");
function _d(t, e) {
  const n = t.type ?? "tile-prop", i = t.mode ?? "bounce", r = ou(), o = document.createElement("div");
  o.classList.add("idle-anim__slot", "is-collapsed", "ti-click-slot"), o.dataset.index = String(e);
  const s = document.createElement("div");
  s.classList.add("idle-anim__slot-header");
  const a = document.createElement("i");
  a.classList.add("fa-solid", "fa-chevron-right", "idle-anim__slot-chevron");
  const l = document.createElement("span");
  l.classList.add("idle-anim__slot-title"), l.textContent = `Animation ${e + 1}`;
  const c = document.createElement("span");
  c.classList.add("idle-anim__slot-summary"), c.textContent = xd(t);
  const d = document.createElement("button");
  d.type = "button", d.classList.add("idle-anim__slot-remove"), d.innerHTML = '<i class="fa-solid fa-xmark"></i>', d.title = "Remove animation", s.append(a, l, c, d), o.appendChild(s);
  const h = document.createElement("div");
  h.classList.add("idle-anim__slot-body");
  const f = document.createElement("div");
  f.classList.add("idle-anim__range-row"), f.appendChild(Wi("Mode", "ti-click__mode", [
    { value: "bounce", label: "Bounce", selected: i === "bounce" },
    { value: "toggle", label: "Toggle", selected: i === "toggle" }
  ])), f.appendChild(Wi("Type", "ti-click__type", [
    { value: "tile-prop", label: "Numeric", selected: n === "tile-prop" },
    { value: "tile-tint", label: "Tint", selected: n === "tile-tint" },
    { value: "tile-scale", label: "Scale", selected: n === "tile-scale" }
  ])), h.appendChild(f);
  const m = document.createElement("div");
  m.classList.add("idle-anim__type-fields"), h.appendChild(m);
  function g(w, E) {
    if (m.innerHTML = "", w === "tile-tint") {
      const S = dr(), I = E.fromColor ?? Zi.fromColor, k = E.toColor ?? Zi.toColor, M = E.mode ?? "oklch", $ = document.createElement("div");
      $.classList.add("idle-anim__range-row"), $.appendChild(Rc("From", "ti-click__from-color", I)), $.appendChild(Rc("To", "ti-click__to-color", k)), m.appendChild($), m.appendChild(Wi(
        "Interpolation",
        "ti-click__color-mode",
        S.map((N) => ({ value: N, label: N, selected: N === M }))
      ));
    } else if (w === "tile-scale") {
      const S = E.fromScale ?? ls.fromScale, I = E.toScale ?? ls.toScale, k = document.createElement("div");
      k.classList.add("idle-anim__range-row"), k.appendChild(zi("From", "ti-click__from-scale", S, { step: "0.01", min: "0.01" })), k.appendChild(zi("To", "ti-click__to-scale", I, { step: "0.01", min: "0.01" })), m.appendChild(k);
      const M = document.createElement("p");
      M.classList.add("idle-anim__hint"), M.textContent = "1.0 = original size. Scales from center.", m.appendChild(M);
    } else {
      const S = E.attribute ?? Yi.attribute, I = E.from ?? Yi.from, k = E.to ?? Yi.to;
      m.appendChild(Wi(
        "Attribute",
        "ti-click__attribute",
        $m.map(($) => ({ value: $.value, label: $.label, selected: $.value === S }))
      ));
      const M = document.createElement("div");
      M.classList.add("idle-anim__range-row"), M.appendChild(zi("From", "ti-click__from", I, { step: "0.01" })), M.appendChild(zi("To", "ti-click__to", k, { step: "0.01" })), m.appendChild(M);
    }
  }
  u(g, "renderTypeFields"), g(n, t);
  const y = t.period ?? (n === "tile-tint" ? Zi.period : Yi.period), b = t.easing ?? "easeOutCubic";
  h.appendChild(zi("Period (ms)", "ti-click__period", y, { min: "50", step: "50" })), h.appendChild(Wi(
    "Easing",
    "ti-click__easing",
    r.map((w) => ({ value: w, label: w, selected: w === b }))
  )), o.appendChild(h);
  const v = o.querySelector(".ti-click__type");
  return v == null || v.addEventListener("change", () => {
    const w = v.value;
    g(w, w === "tile-tint" ? Zi : w === "tile-scale" ? ls : Yi);
  }), s.addEventListener("click", (w) => {
    if (!w.target.closest(".idle-anim__slot-remove") && (o.classList.toggle("is-collapsed"), o.classList.contains("is-collapsed"))) {
      const E = Dm(o);
      E && (c.textContent = xd(E));
    }
  }), d.addEventListener("click", (w) => {
    w.stopPropagation();
    const E = o.parentElement;
    o.remove(), E && Da(E, "ti-click-slot", "Animation");
  }), Mm(o, { dropGroup: "click" }), o;
}
u(_d, "buildClickSlot");
function Dm(t) {
  var c, d, h, f, m, g, y, b, v, w, E, S, I, k;
  const e = ((c = t.querySelector(".ti-click__type")) == null ? void 0 : c.value) ?? "tile-prop", n = ((d = t.querySelector(".ti-click__mode")) == null ? void 0 : d.value) ?? "bounce", i = Number.parseInt((h = t.querySelector(".ti-click__period")) == null ? void 0 : h.value, 10), r = ((f = t.querySelector(".ti-click__easing")) == null ? void 0 : f.value) ?? "easeOutCubic";
  if (!i || i <= 0) return null;
  const o = { mode: n, period: i, easing: r };
  if (e === "tile-tint") {
    const M = ((m = t.querySelector(".ti-click__from-color")) == null ? void 0 : m.value) ?? ((g = t.querySelector(".ti-click__from-color-text")) == null ? void 0 : g.value) ?? Zi.fromColor, $ = ((y = t.querySelector(".ti-click__to-color")) == null ? void 0 : y.value) ?? ((b = t.querySelector(".ti-click__to-color-text")) == null ? void 0 : b.value) ?? Zi.toColor, N = ((v = t.querySelector(".ti-click__color-mode")) == null ? void 0 : v.value) ?? "oklch";
    return { type: "tile-tint", fromColor: M, toColor: $, mode: N, ...o };
  }
  if (e === "tile-scale") {
    const M = Number.parseFloat((w = t.querySelector(".ti-click__from-scale")) == null ? void 0 : w.value), $ = Number.parseFloat((E = t.querySelector(".ti-click__to-scale")) == null ? void 0 : E.value);
    return Number.isNaN(M) || Number.isNaN($) || M <= 0 || $ <= 0 ? null : { type: "tile-scale", fromScale: M, toScale: $, ...o };
  }
  const s = ((S = t.querySelector(".ti-click__attribute")) == null ? void 0 : S.value) ?? Yi.attribute, a = Number.parseFloat((I = t.querySelector(".ti-click__from")) == null ? void 0 : I.value), l = Number.parseFloat((k = t.querySelector(".ti-click__to")) == null ? void 0 : k.value);
  return Number.isNaN(a) || Number.isNaN(l) ? null : { type: "tile-prop", attribute: s, from: a, to: l, ...o };
}
u(Dm, "readClickSlot");
function Da(t, e, n) {
  t.querySelectorAll(`.${e}`).forEach((r, o) => {
    r.dataset.index = String(o);
    const s = r.querySelector(".idle-anim__slot-title");
    s && (s.textContent = `${n} ${o + 1}`);
  });
}
u(Da, "renumberSlots");
function ll(t, { heading: e, hint: n, configs: i, slotClass: r, titlePrefix: o, dropGroup: s, defaultEffect: a }) {
  const l = document.createElement("div");
  l.classList.add("ti-section-heading");
  const c = document.createElement("h3");
  c.textContent = e, l.appendChild(c);
  const d = document.createElement("div");
  d.classList.add("idle-anim__slots", `${r}s`);
  const h = document.createElement("button");
  h.type = "button", h.classList.add("ti-section-heading__add"), h.innerHTML = '<i class="fa-solid fa-plus"></i>', h.title = `Add ${e.toLowerCase()} effect`, h.addEventListener("click", () => {
    const g = d.querySelectorAll(`.${r}`).length, y = Md(a, g, r, o);
    y.classList.remove("is-collapsed"), d.appendChild(y);
  }), l.appendChild(h), t.appendChild(l);
  const f = document.createElement("p");
  f.classList.add("idle-anim__hint"), f.textContent = n, t.appendChild(f);
  for (let g = 0; g < i.length; g++)
    d.appendChild(Md(i[g], g, r, o));
  t.appendChild(d);
  const m = ["ti-always-slot", "ti-idle-slot", "ti-hover-slot"];
  return xm(d, {
    dropGroup: s,
    onDrop(g) {
      if (g.parentElement === d)
        for (const y of m)
          y !== r && g.classList.contains(y) && g.classList.replace(y, r);
      Da(d, r, o);
    }
  }), d;
}
u(ll, "buildEffectCategory");
function Yw(t) {
  const e = fu(t) ?? { always: [], idle: [], hover: [], click: [] }, n = document.createElement("section");
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
    const I = s.querySelectorAll(".ti-click-slot").length, k = _d(ls, I);
    k.classList.remove("is-collapsed"), s.appendChild(k);
  }), i.appendChild(a), n.appendChild(i);
  const l = document.createElement("p");
  l.classList.add("idle-anim__hint"), l.textContent = "One-shot animation on click.", n.appendChild(l);
  for (let I = 0; I < o.length; I++)
    s.appendChild(_d(o[I], I));
  n.appendChild(s), xm(s, {
    dropGroup: "click",
    onDrop() {
      Da(s, "ti-click-slot", "Animation");
    }
  });
  const c = document.createElement("div");
  c.classList.add("ti-section-heading");
  const d = document.createElement("h3");
  d.textContent = "Options", c.appendChild(d), n.appendChild(c);
  const h = document.createElement("div");
  h.classList.add("form-group");
  const f = document.createElement("label");
  f.textContent = "Pointer cursor on hover";
  const m = document.createElement("input");
  m.type = "checkbox", m.classList.add("ti-cursor-check"), m.checked = e.cursor ?? !1, h.append(f, m), n.appendChild(h);
  const g = document.createElement("p");
  g.classList.add("idle-anim__hint"), g.textContent = "Execute a macro when clicked. Drag a macro here or paste its UUID.", n.appendChild(g);
  const y = document.createElement("div");
  y.classList.add("form-group", "ti-macro");
  const b = document.createElement("label");
  b.textContent = "Macro", y.appendChild(b);
  const v = document.createElement("input");
  v.type = "text", v.classList.add("ti-macro__uuid"), v.placeholder = "Drag a macro here or paste UUID", v.value = e.macro ?? "", y.appendChild(v);
  const w = document.createElement("button");
  w.type = "button", w.classList.add("ti-macro__clear"), w.innerHTML = '<i class="fa-solid fa-xmark"></i>', w.title = "Clear macro", w.addEventListener("click", () => {
    v.value = "";
  }), y.appendChild(w), y.addEventListener("dragover", (I) => {
    I.preventDefault(), I.dataTransfer.dropEffect = "link";
  }), y.addEventListener("drop", (I) => {
    I.preventDefault();
    try {
      const k = I.dataTransfer.getData("text/plain"), M = JSON.parse(k);
      M.type === "Macro" && M.uuid && (v.value = M.uuid);
    } catch {
    }
  }), n.appendChild(y);
  const E = document.createElement("div");
  E.classList.add("idle-anim__actions");
  const S = document.createElement("button");
  return S.type = "button", S.classList.add("idle-anim__preview"), S.innerHTML = '<i class="fa-solid fa-play"></i> Preview', E.append(S), n.appendChild(E), n;
}
u(Yw, "buildSectionContent");
function cl(t, e) {
  const n = [];
  for (const i of t.querySelectorAll(`.${e}`)) {
    const r = Fm(i);
    r && n.push(r);
  }
  return n;
}
u(cl, "readAllEffectSlots");
function Kw(t) {
  const e = [];
  for (const n of t.querySelectorAll(".ti-click-slot")) {
    const i = Dm(n);
    i && e.push(i);
  }
  return e;
}
u(Kw, "readAllClickConfigs");
function Nd(t) {
  var r, o, s;
  const e = ((o = (r = t.querySelector(".ti-macro__uuid")) == null ? void 0 : r.value) == null ? void 0 : o.trim()) || null, n = ((s = t.querySelector(".ti-cursor-check")) == null ? void 0 : s.checked) ?? !1, i = {
    always: cl(t, "ti-always-slot"),
    idle: cl(t, "ti-idle-slot"),
    hover: cl(t, "ti-hover-slot"),
    click: Kw(t)
  };
  return e && (i.macro = e), n && (i.cursor = !0), i;
}
u(Nd, "readFormConfig");
function Pm(t, e) {
  var l;
  const n = qe(e);
  if (!n) return;
  const i = Ww(t);
  if (!i) return;
  const r = nu(t, n, Uw, "Animations", Vw);
  if (!r || r.querySelector(".eidolon-tile-interactions")) return;
  const o = r.closest("form");
  o && (o.noValidate = !0);
  const s = Yw(i);
  r.appendChild(s), (l = t.setPosition) == null || l.call(t, { height: "auto" });
  const a = r.querySelector(".idle-anim__preview");
  a == null || a.addEventListener("click", () => {
    const c = i.object;
    if (!c) return;
    if (Mn) {
      Mn.detach(), Mn = null, a.classList.remove("is-active"), a.innerHTML = '<i class="fa-solid fa-play"></i> Preview';
      return;
    }
    const d = Nd(s);
    (d.always.length > 0 || d.idle.length > 0 || d.hover.length > 0) && (Mn = new Ri(c, d), Mn.start("idle"), a.classList.add("is-active"), a.innerHTML = '<i class="fa-solid fa-stop"></i> Stop');
  }), o && o.addEventListener("submit", () => {
    Mn && (Mn.detach(), Mn = null);
    const c = Nd(s), d = c.always.length > 0 || c.idle.length > 0 || c.hover.length > 0 || c.click.length > 0 || !!c.macro || !!c.cursor, h = {
      [`flags.${jo}.-=${kd}`]: null,
      [`flags.${jo}.-=${jw}`]: null,
      [`flags.${jo}.-=${Bw}`]: null
    };
    i.update(h).then(() => {
      if (d)
        return i.update({ [`flags.${jo}.${kd}`]: c });
    });
  });
}
u(Pm, "renderAnimationSection");
const Rs = /* @__PURE__ */ new Map();
function Rm(t) {
  const e = Rs.get(t);
  e && (e.controller.abort(), Rs.delete(t), e.restore());
}
u(Rm, "stopLoopByKey");
function Hm(t) {
  const e = `${t}::`;
  for (const n of [...Rs.keys()])
    n.startsWith(e) && Rm(n);
}
u(Hm, "stopLoopsForTile");
function qm() {
  for (const t of [...Rs.keys()])
    Rm(t);
}
u(qm, "stopAllLoops");
const jm = "eidolon-utilities", Bm = ["tile-animations", "tile-interactions", "idle-animation"];
function Xw() {
  qm(), km();
}
u(Xw, "onCanvasTearDown");
function Jw() {
  qm(), km();
}
u(Jw, "onCanvasReady$1");
function Qw(t, e) {
  var r;
  const n = (r = e == null ? void 0 : e.flags) == null ? void 0 : r[jm];
  !n || !Bm.some((o) => o in n || `-=${o}` in n) || (Hm(t.id), Dw(t));
}
u(Qw, "onUpdateTile");
function Zw(t) {
  Hm(t.id), Pw(t);
}
u(Zw, "onDeleteTile");
function eE(t, e) {
  Pm(t, e);
}
u(eE, "onRenderTileConfig");
function tE(t, e) {
  var r;
  const n = (r = e == null ? void 0 : e.flags) == null ? void 0 : r[jm];
  !n || !Bm.some((o) => o in n || `-=${o}` in n) || Rw(t);
}
u(tE, "onUpdateDrawing");
function nE(t) {
  Hw(t);
}
u(nE, "onDeleteDrawing");
function iE(t, e) {
  Pm(t, e);
}
u(iE, "onRenderDrawingConfig");
function rE() {
  Hooks.on("canvasTearDown", Xw), Hooks.on("canvasReady", Jw), Hooks.on("updateTile", Qw), Hooks.on("deleteTile", Zw), Hooks.on("renderTileConfig", eE), Hooks.on("updateDrawing", tE), Hooks.on("deleteDrawing", nE), Hooks.on("renderDrawingConfig", iE);
}
u(rE, "registerTileInteractionHooks");
rE();
const Hs = /* @__PURE__ */ new Map();
function gu(t, e) {
  Hs.has(t) && console.warn(`[eidolon-utilities] Door-link behavior "${t}" is already registered. Overwriting.`), Hs.set(t, e);
}
u(gu, "registerBehavior");
function Um(t) {
  return Hs.get(t);
}
u(Um, "getBehavior");
function Pa() {
  return Hs;
}
u(Pa, "getAllBehaviors");
const oE = {
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
}, sE = {
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
}, no = "eidolon-utilities", Hc = "door-links", Vm = "door-link-default";
function En(t) {
  var e, n;
  return ((n = (e = t == null ? void 0 : t.flags) == null ? void 0 : e[no]) == null ? void 0 : n[Hc]) ?? {};
}
u(En, "getDoorLinks");
function io(t, e) {
  const n = { [`flags.${no}.${Hc}`]: e }, i = En(t);
  for (const r of Object.keys(i))
    r in e || (n[`flags.${no}.${Hc}.-=${r}`] = null);
  return t.update(n, { render: !1 });
}
u(io, "setDoorLinks");
function aE(t, e) {
  const n = En(t);
  let i = !1;
  const r = {};
  for (const [o, s] of Object.entries(n)) {
    const a = s.filter((l) => l !== e);
    a.length !== s.length && (i = !0), a.length > 0 && (r[o] = a);
  }
  return i ? io(t, r) : null;
}
u(aE, "removeWallFromAllLinks");
function pu(t) {
  var e, n;
  return ((n = (e = t == null ? void 0 : t.flags) == null ? void 0 : e[no]) == null ? void 0 : n[Vm]) ?? null;
}
u(pu, "getDefaultState");
function Gm(t) {
  const e = {
    light: t.light ?? 20,
    move: t.move ?? 20,
    sight: t.sight ?? 20,
    sound: t.sound ?? 20
  };
  return t.update({ [`flags.${no}.${Vm}`]: e });
}
u(Gm, "captureDefaultState");
function $d(t) {
  return pu(t) ? Promise.resolve() : Gm(t);
}
u($d, "ensureDefaultState");
async function Wm(t, e) {
  const n = t.parent;
  if (!n) return;
  const i = En(t), r = Object.keys(i);
  if (r.length === 0) return;
  const o = e === 1, s = [];
  let a = null;
  for (const l of r) {
    const c = Um(l);
    if (!c) {
      console.warn(`[eidolon-utilities] Unknown door-link behavior: "${l}"`);
      continue;
    }
    const d = i[l];
    if (d != null && d.length)
      for (const h of d) {
        const f = n.walls.get(h);
        if (!f) continue;
        const m = pu(f);
        if (m)
          if (o) {
            const g = c.apply(f, m);
            s.push({ _id: h, ...g });
          } else {
            a || (a = lE(n, t.id));
            const g = a.get(h);
            if ((g == null ? void 0 : g.length) > 0)
              continue;
            const y = c.revert(f, m);
            s.push({ _id: h, ...y });
          }
      }
  }
  s.length > 0 && await n.updateEmbeddedDocuments("Wall", s);
}
u(Wm, "onDoorStateChange");
function lE(t, e) {
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
u(lE, "buildReverseIndex");
const ro = /* @__PURE__ */ new WeakMap(), qs = /* @__PURE__ */ new Set();
function yu(t, e = {}) {
  var v;
  if (!(t != null && t.document)) return !1;
  qc(t);
  const n = e.color ?? 16739115, i = e.alpha ?? 0.85, r = e.width ?? 3, o = e.pulse ?? !0, [s, a, l, c] = t.document.c, d = s - t.x, h = a - t.y, f = l - t.x, m = c - t.y, g = new PIXI.Graphics(), y = [
    { w: r + 24, a: i * 0.08 },
    { w: r + 18, a: i * 0.14 },
    { w: r + 12, a: i * 0.25 },
    { w: r + 6, a: i * 0.4 }
  ];
  for (const w of y)
    g.lineStyle(w.w, n, w.a), g.moveTo(d, h), g.lineTo(f, m);
  g.lineStyle(r, n, i), g.moveTo(d, h), g.lineTo(f, m), g.name = "eidolonDoorLinkHighlight", t.addChild(g);
  const b = { gfx: g, pulseData: null };
  if (o && ((v = canvas.app) != null && v.ticker)) {
    const w = {
      elapsed: 0,
      fn: /* @__PURE__ */ u((E) => {
        w.elapsed += E;
        const S = (Math.sin(w.elapsed * 0.05) + 1) / 2;
        g.alpha = i * (0.4 + 0.6 * S);
      }, "fn")
    };
    canvas.app.ticker.add(w.fn), b.pulseData = w, qs.add(w);
  }
  return ro.set(t, b), !0;
}
u(yu, "highlightWall");
function qc(t) {
  var n, i;
  if (!t) return;
  const e = ro.get(t);
  e && (e.pulseData && ((i = (n = canvas.app) == null ? void 0 : n.ticker) == null || i.remove(e.pulseData.fn), qs.delete(e.pulseData)), e.gfx && (e.gfx.parent && e.gfx.parent.removeChild(e.gfx), e.gfx.destroy({ children: !0 })), ro.delete(t));
}
u(qc, "removeWallHighlight");
function zm() {
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
u(zm, "clearWallHighlights");
let yi = null;
function cE(t) {
  var y, b, v, w, E;
  yi && yi.cancel();
  const { onPick: e, onUnpick: n, onCancel: i, excludeIds: r, getExcludeIds: o, sourceDoorId: s } = t;
  let a = null;
  (y = canvas.walls) == null || y.activate();
  for (const S of ((b = canvas.walls) == null ? void 0 : b.controlled) ?? [])
    (v = S.release) == null || v.call(S);
  const l = /* @__PURE__ */ u((S, I) => {
    var $, N, x;
    if (!I) return;
    const k = S.document ?? S;
    if (s && k.id === s) {
      ($ = ui.notifications) == null || $.warn("Cannot link a door to itself.");
      return;
    }
    if ((o ? o() : r ?? /* @__PURE__ */ new Set()).has(k.id)) {
      (N = S.release) == null || N.call(S), n == null || n(k);
      return;
    }
    (x = S.release) == null || x.call(S), e(k);
  }, "onControl"), c = /* @__PURE__ */ u((S, I) => {
    I ? (a = S, yu(S, { color: 65416, alpha: 0.7, width: 4, pulse: !1 })) : a === S && (qc(S), a = null);
  }, "onHover"), d = /* @__PURE__ */ u((S) => {
    S.key === "Escape" && (S.preventDefault(), S.stopPropagation(), g());
  }, "onKeydown"), h = /* @__PURE__ */ u((S) => {
    S.preventDefault(), g();
  }, "onContextMenu"), f = Hooks.on("controlWall", l), m = Hooks.on("hoverWall", c);
  document.addEventListener("keydown", d, { capture: !0 }), (w = canvas.stage) == null || w.addEventListener("rightclick", h), (E = ui.notifications) == null || E.info("Pick mode active — click a wall segment on the canvas, or press ESC to cancel.", { permanent: !1 });
  function g() {
    var S;
    yi && (yi = null, Hooks.off("controlWall", f), Hooks.off("hoverWall", m), document.removeEventListener("keydown", d, { capture: !0 }), (S = canvas.stage) == null || S.removeEventListener("rightclick", h), a && (qc(a), a = null), i == null || i());
  }
  return u(g, "cancel"), yi = { cancel: g }, { cancel: g };
}
u(cE, "enterWallPickMode");
function uE() {
  yi && yi.cancel();
}
u(uE, "cancelWallPickMode");
const dE = "eidolon-door-links", fE = "Links", hE = "fa-solid fa-link", Ut = "eidolon-door-links";
function mE(t) {
  const [e, n, i, r] = t.c ?? [0, 0, 0, 0];
  return `(${e},${n}) → (${i},${r})`;
}
u(mE, "formatWallCoords");
function gE(t) {
  return t.length > 8 ? t.slice(0, 8) + "…" : t;
}
u(gE, "shortId");
function Fd(t) {
  const e = /* @__PURE__ */ new Set();
  for (const n of Object.values(t))
    for (const i of n) e.add(i);
  return e;
}
u(Fd, "allLinkedIds");
function pE(t) {
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
u(pE, "classifyWall");
function ul(t, e, n, i) {
  const r = document.createElement("div");
  r.classList.add("dl-wall-entry"), r.dataset.wallId = t.id, r.style.cursor = "pointer", r.title = "Click to select on canvas", r.addEventListener("click", () => {
    var g, y;
    const m = t.object;
    m && ((g = canvas.walls) == null || g.activate(), m.controlled ? m.release() : m.control({ releaseOthers: !((y = globalThis.keyboard) != null && y.isModifierActive(KeyboardManager.MODIFIER_KEYS.SHIFT)) }));
  });
  const { label: o, cssClass: s } = pE(t);
  r.classList.add(s), r.title = o;
  const a = document.createElement("div");
  a.classList.add("dl-wall-entry__info");
  const l = document.createElement("span");
  l.classList.add("dl-wall-entry__coords"), l.textContent = `#${gE(t.id)}  ${mE(t)}`, a.appendChild(l);
  const c = pu(t);
  if (c) {
    const m = document.createElement("span");
    m.classList.add("dl-wall-entry__defaults"), m.textContent = `L:${c.light} M:${c.move} S:${c.sight} Snd:${c.sound}`, a.appendChild(m);
  }
  const d = document.createElement("span");
  d.classList.add("dl-wall-entry__actions");
  const h = document.createElement("button");
  h.type = "button", h.classList.add("dl-wall-entry__btn"), h.innerHTML = '<i class="fa-solid fa-eye"></i>', h.title = "Highlight on canvas", h.addEventListener("click", (m) => {
    var y;
    m.stopPropagation();
    const g = t.object;
    g && yu(g, { color: ((y = Pa().get(e)) == null ? void 0 : y.highlightColor) ?? 16739115 });
  });
  const f = document.createElement("button");
  return f.type = "button", f.classList.add("dl-wall-entry__btn", "dl-wall-entry__btn--remove"), f.innerHTML = '<i class="fa-solid fa-xmark"></i>', f.title = "Remove link", f.addEventListener("click", (m) => {
    m.stopPropagation(), r.remove(), i(t.id, e);
  }), d.append(h, f), r.append(a, d), r;
}
u(ul, "buildWallEntry");
function yE(t, e, n, i, r, o) {
  const s = document.createElement("div");
  s.classList.add("dl-behavior-section"), s.dataset.behavior = t;
  const a = document.createElement("div");
  a.classList.add("dl-behavior-section__header");
  const l = document.createElement("i");
  l.className = e.icon;
  const c = document.createElement("span");
  c.classList.add("dl-behavior-section__title"), c.textContent = e.label;
  const d = document.createElement("span");
  d.classList.add("dl-behavior-section__count"), d.textContent = `(${n.length})`;
  const h = document.createElement("span");
  h.classList.add("dl-behavior-section__header-actions");
  const f = document.createElement("button");
  f.type = "button", f.classList.add("dl-header-btn"), f.innerHTML = '<i class="fa-solid fa-crosshairs"></i>', f.title = "Pick from canvas";
  const m = document.createElement("button");
  m.type = "button", m.classList.add("dl-header-btn"), m.innerHTML = '<i class="fa-solid fa-object-group"></i>', m.title = "Add selected walls";
  const g = document.createElement("button");
  g.type = "button", g.classList.add("dl-header-btn"), g.innerHTML = '<i class="fa-solid fa-arrows-to-dot"></i>', g.title = "Select all linked walls on canvas", h.append(g, m, f), a.append(l, c, d, h), s.appendChild(a);
  const y = document.createElement("p");
  y.classList.add("dl-behavior-section__desc"), y.textContent = e.description, s.appendChild(y);
  const b = document.createElement("div");
  b.classList.add("dl-behavior-section__walls");
  function v() {
    const E = b.querySelectorAll(".dl-wall-entry");
    d.textContent = `(${E.length})`;
  }
  u(v, "updateCount");
  function w(E, S) {
    v(), o();
  }
  u(w, "handleRemove");
  for (const E of n) {
    const S = r.walls.get(E);
    S && b.appendChild(ul(S, t, i, w));
  }
  return s.appendChild(b), f.addEventListener("click", (E) => {
    E.stopPropagation(), cE({
      sourceDoorId: i.id,
      getExcludeIds: /* @__PURE__ */ u(() => Fd(js(s.closest(`.${Ut}`))), "getExcludeIds"),
      onPick: /* @__PURE__ */ u(async (S) => {
        await $d(S), b.appendChild(ul(S, t, i, w)), v(), o();
      }, "onPick"),
      onUnpick: /* @__PURE__ */ u((S) => {
        const I = s.closest(`.${Ut}`), k = I == null ? void 0 : I.querySelector(`.dl-wall-entry[data-wall-id="${S.id}"]`);
        if (k) {
          k.remove();
          for (const M of I.querySelectorAll(".dl-behavior-section")) {
            const $ = M.querySelectorAll(".dl-wall-entry");
            M.querySelector(".dl-behavior-section__count").textContent = `(${$.length})`;
          }
          o();
        }
      }, "onUnpick")
    });
  }), m.addEventListener("click", async (E) => {
    var $, N, x, F;
    E.stopPropagation();
    const S = (($ = canvas.walls) == null ? void 0 : $.controlled) ?? [];
    if (S.length === 0) {
      (N = ui.notifications) == null || N.warn("No walls selected. Select walls on the canvas first.");
      return;
    }
    const I = js(s.closest(`.${Ut}`)), k = Fd(I);
    let M = 0;
    for (const A of S) {
      const R = A.document;
      !R || R.id === i.id || k.has(R.id) || (await $d(R), b.appendChild(ul(R, t, i, w)), k.add(R.id), M++);
    }
    M > 0 ? (v(), o(), (x = ui.notifications) == null || x.info(`Added ${M} wall(s) to ${e.label}.`)) : (F = ui.notifications) == null || F.warn("No eligible walls in selection (doors and already-linked walls are excluded).");
  }), g.addEventListener("click", (E) => {
    var $, N, x, F;
    E.stopPropagation();
    const S = [...b.querySelectorAll(".dl-wall-entry")].map((A) => A.dataset.wallId);
    if (S.length === 0) {
      ($ = ui.notifications) == null || $.info("No walls to select.");
      return;
    }
    (N = canvas.walls) == null || N.activate();
    const I = S.map((A) => {
      var R;
      return (R = r.walls.get(A)) == null ? void 0 : R.object;
    }).filter(Boolean);
    if (I.length > 0 && I.every((A) => A.controlled)) {
      for (const A of I) A.release();
      return;
    }
    (x = canvas.walls) == null || x.releaseAll();
    let M = 0;
    for (const A of I)
      A.control({ releaseOthers: !1 }), M++;
    (F = ui.notifications) == null || F.info(`Selected ${M} wall(s).`);
  }), s;
}
u(yE, "buildBehaviorSection");
function js(t) {
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
u(js, "readLinksFromDOM");
function mr(t, e, n) {
  var f;
  const i = document.createElement("div");
  i.classList.add(Ut);
  const r = En(t);
  let o = !1;
  const s = {};
  for (const [m, g] of Object.entries(r)) {
    const y = g.filter((b) => e.walls.has(b));
    y.length !== g.length && (o = !0), y.length > 0 && (s[m] = y);
  }
  o && io(t, s);
  const a = Pa(), l = /* @__PURE__ */ u(() => {
    const m = js(i);
    io(t, m);
  }, "onLinksChanged");
  for (const [m, g] of a) {
    const y = s[m] ?? [];
    i.appendChild(yE(m, g, y, t, e, l));
  }
  const c = document.createElement("button");
  c.type = "button", c.classList.add("dl-btn", "dl-btn--recapture"), c.innerHTML = '<i class="fa-solid fa-camera-rotate"></i> Re-capture defaults', c.title = "Snapshot current wall properties as the closed-door default for all linked walls", c.addEventListener("click", async (m) => {
    var b;
    m.stopPropagation();
    const g = js(i);
    let y = 0;
    for (const v of Object.values(g))
      for (const w of v) {
        const E = e.walls.get(w);
        E && (await Gm(E), y++);
      }
    (b = ui.notifications) == null || b.info(`Re-captured defaults for ${y} linked wall(s).`), n();
  }), i.appendChild(c), SE(s, e);
  const d = /* @__PURE__ */ u((m, g) => {
    var v;
    const y = ((v = m.document) == null ? void 0 : v.id) ?? m.id, b = i.querySelector(`.dl-wall-entry[data-wall-id="${y}"]`);
    b && b.classList.toggle("dl-wall-entry--selected", g);
  }, "syncSelection"), h = Hooks.on("controlWall", d);
  i._dlSelectionHookId = h;
  for (const m of i.querySelectorAll(".dl-wall-entry")) {
    const g = e.walls.get(m.dataset.wallId);
    (f = g == null ? void 0 : g.object) != null && f.controlled && m.classList.add("dl-wall-entry--selected");
  }
  return i;
}
u(mr, "buildDoorLinksContent");
function bE(t) {
  return t.querySelector(".standard-form [data-application-part='body']") ?? t.querySelector(".standard-form.scrollable") ?? null;
}
u(bE, "findV2Body");
function vE(t, e, n, i) {
  const r = bE(e);
  if (!r) return !1;
  if (r.querySelector(`.${Ut}`)) return !0;
  const o = document.createElement("fieldset");
  o.classList.add("dl-fieldset");
  const s = document.createElement("legend");
  s.textContent = "Door Links", o.appendChild(s);
  const a = /* @__PURE__ */ u(() => {
    var l;
    (l = o.querySelector(`.${Ut}`)) == null || l.remove(), o.appendChild(mr(n, i, a));
  }, "refresh");
  return o.appendChild(mr(n, i, a)), r.appendChild(o), !0;
}
u(vE, "injectAsFieldset");
function wE(t, e, n, i) {
  var a;
  const r = nu(t, e, dE, fE, hE);
  if (!r) return !1;
  if (r.querySelector(`.${Ut}`)) return !0;
  const o = r.closest("form");
  o && (o.noValidate = !0);
  const s = /* @__PURE__ */ u(() => {
    var l;
    (l = r.querySelector(`.${Ut}`)) == null || l.remove(), r.appendChild(mr(n, i, s));
  }, "refresh");
  return r.appendChild(mr(n, i, s)), (a = t.setPosition) == null || a.call(t, { height: "auto" }), !0;
}
u(wE, "injectAsTab");
function EE(t, e, n, i) {
  var c;
  const r = e.querySelector("form");
  if (!r) return !1;
  if (r.querySelector(`.${Ut}`)) return !0;
  const o = document.createElement("fieldset");
  o.classList.add("dl-fieldset");
  const s = document.createElement("legend");
  s.textContent = "Door Links", o.appendChild(s);
  const a = /* @__PURE__ */ u(() => {
    var d;
    (d = o.querySelector(`.${Ut}`)) == null || d.remove(), o.appendChild(mr(n, i, a));
  }, "refresh");
  o.appendChild(mr(n, i, a));
  const l = r.querySelector(":scope > footer") ?? r.querySelector(".form-footer");
  return r.insertBefore(o, l ?? null), r.noValidate = !0, (c = t.setPosition) == null || c.call(t, { height: "auto" }), !0;
}
u(EE, "injectAsFormSection");
function dl(t, e) {
  var l;
  const n = qe(e);
  if (!n) return;
  const i = t.document ?? ((l = t.object) == null ? void 0 : l.document) ?? t.object;
  if (!i || i.door === 0) return;
  const r = i.parent;
  if (!r || !(vE(t, n, i, r) || wE(t, n, i, r) || EE(t, n, i, r))) return;
  const s = `close${t.constructor.name}`, a = Hooks.on(s, (c) => {
    if (c === t) {
      zm(), uE();
      const d = n.querySelector(`.${Ut}`);
      (d == null ? void 0 : d._dlSelectionHookId) != null && Hooks.off("controlWall", d._dlSelectionHookId), Hooks.off(s, a);
    }
  });
}
u(dl, "renderDoorLinksTab");
function SE(t, e) {
  var i;
  const n = Pa();
  for (const [r, o] of Object.entries(t)) {
    const s = ((i = n.get(r)) == null ? void 0 : i.highlightColor) ?? 16739115;
    for (const a of o) {
      const l = e.walls.get(a), c = l == null ? void 0 : l.object;
      c && yu(c, { color: s });
    }
  }
}
u(SE, "highlightLinkedWalls");
const Dd = "eidolon-utilities";
function CE(t, e) {
  e.ds !== void 0 && t.door !== 0 && Wm(t, e.ds);
}
u(CE, "onUpdateWall");
function TE(t) {
  const e = t.parent;
  if (!e) return;
  const n = t.id;
  for (const i of e.walls)
    i.door !== 0 && aE(i, n);
}
u(TE, "onDeleteWall");
function LE(t, e) {
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
u(LE, "onRenderWallConfig");
async function IE(t) {
  const e = t.walls.filter((c) => {
    if (c.door === 0) return !1;
    const d = En(c);
    return Object.values(d).some((h) => h.length > 0);
  });
  if (e.length === 0) return;
  const n = new Set(t.walls.map((c) => c.id)), i = /* @__PURE__ */ new Set();
  for (const c of e)
    for (const d of Object.values(En(c)))
      for (const h of d)
        n.has(h) || i.add(h);
  if (i.size === 0) return;
  const r = [...i][0];
  let o = null;
  for (const c of game.scenes)
    if (c.id !== t.id && c.walls.get(r)) {
      o = c;
      break;
    }
  if (!o) return;
  const s = /* @__PURE__ */ u((c) => c.join(","), "coordKey"), a = /* @__PURE__ */ new Map();
  for (const c of t.walls)
    a.set(s(c.c), c.id);
  const l = /* @__PURE__ */ new Map();
  for (const c of i) {
    const d = o.walls.get(c);
    if (!d) continue;
    const h = a.get(s(d.c));
    h && l.set(c, h);
  }
  for (const c of e) {
    const d = En(c), h = {};
    let f = !1;
    for (const [m, g] of Object.entries(d))
      h[m] = g.map((y) => {
        const b = l.get(y);
        return b ? (f = !0, b) : y;
      });
    f && await io(c, h);
  }
}
u(IE, "onCreateScene");
function OE() {
  zm();
}
u(OE, "onCanvasReady");
function kE() {
  Hooks.on("updateWall", CE), Hooks.on("deleteWall", TE), Hooks.on("renderWallConfig", LE), Hooks.on("createScene", IE), Hooks.on("canvasReady", OE), Hooks.once("ready", () => {
    const t = game.modules.get(Dd);
    t.api || (t.api = {}), t.api.doorLinks = {
      registerBehavior: gu,
      getBehavior: Um,
      getAllBehaviors: Pa,
      getDoorLinks: En,
      setDoorLinks: io,
      triggerDoor: Wm
    }, console.log(`[${Dd}] Door Links API registered.`);
  });
}
u(kE, "registerDoorLinksHooks");
gu("reflect", oE);
gu("passthru", sE);
kE();
const hi = "application/x-foundry-region-shape", bu = /* @__PURE__ */ new Map();
function jc() {
  for (const t of document.querySelectorAll(
    ".rs-shape--insert-before, .rs-shape--insert-after"
  ))
    t.classList.remove("rs-shape--insert-before", "rs-shape--insert-after");
}
u(jc, "clearAllIndicators");
function Ym(t) {
  var e;
  for (const n of bu.values())
    (e = n.container) == null || e.classList.toggle("rs-drag-active", t);
}
u(Ym, "setAllDragActive");
function AE() {
  jc(), Ym(!1);
  for (const t of document.querySelectorAll(
    ".is-dragging, .rs-drop-over"
  ))
    t.classList.remove("is-dragging", "rs-drop-over");
}
u(AE, "globalCleanup");
async function Pd(t, e, n) {
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
  const l = t.ctrlKey || t.metaKey, c = s === e.uuid;
  if (c && !l) {
    const h = n === -1 ? e.shapes.length : n;
    if (h === a || h === a + 1)
      return;
  }
  const d = foundry.utils.deepClone(o);
  if (c) {
    const h = foundry.utils.deepClone(e.shapes);
    h.splice(a, 1);
    const f = n === -1 ? h.length : n, m = a < f ? f - 1 : f;
    h.splice(m, 0, d), await e.update({ shapes: h });
  } else {
    const h = foundry.utils.deepClone(e.shapes), f = n === -1 ? h.length : n;
    if (h.splice(f, 0, d), await e.update({ shapes: h }), l) {
      const m = await fromUuid(s);
      if (m) {
        const g = foundry.utils.deepClone(m.shapes);
        g.splice(a, 1), await m.update({ shapes: g });
      }
    }
  }
}
u(Pd, "handleShapeDrop");
function ME(t, e) {
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
    let c = !1;
    a.addEventListener("pointerdown", (d) => {
      c = !!d.target.closest(".rs-drag-handle");
    }), a.addEventListener("dragstart", (d) => {
      if (!c) {
        d.preventDefault();
        return;
      }
      const h = foundry.utils.deepClone(i.shapes[l]), f = JSON.stringify({
        shape: h,
        sourceRegionUuid: i.uuid,
        sourceIndex: l
      });
      d.dataTransfer.setData(hi, f), d.dataTransfer.effectAllowed = "copyMove", a.classList.add("is-dragging"), Ym(!0);
    }), a.addEventListener("dragover", (d) => {
      if (!d.dataTransfer.types.includes(hi)) return;
      d.preventDefault(), d.dataTransfer.dropEffect = d.ctrlKey || d.metaKey ? "move" : "copy";
      const h = a.getBoundingClientRect(), f = h.top + h.height / 2, m = d.clientY < f ? "before" : "after";
      jc(), a.classList.add(
        m === "before" ? "rs-shape--insert-before" : "rs-shape--insert-after"
      );
    }), a.addEventListener("dragleave", () => {
      a.classList.remove(
        "rs-shape--insert-before",
        "rs-shape--insert-after"
      );
    }), a.addEventListener("drop", (d) => {
      if (d.preventDefault(), d.stopPropagation(), jc(), !d.dataTransfer.types.includes(hi)) return;
      const f = (() => {
        const m = a.getBoundingClientRect(), g = m.top + m.height / 2;
        return d.clientY < g ? "before" : "after";
      })() === "before" ? l : l + 1;
      Pd(d, i, f);
    }), a.addEventListener("dragend", () => {
      AE();
    });
  }
  o.classList.add("rs-drop-container"), o.addEventListener("dragover", (a) => {
    a.dataTransfer.types.includes(hi) && (a.preventDefault(), a.dataTransfer.dropEffect = a.ctrlKey || a.metaKey ? "move" : "copy");
  }), o.addEventListener("dragenter", (a) => {
    a.dataTransfer.types.includes(hi) && (a.preventDefault(), o.classList.add("rs-drop-over"));
  }), o.addEventListener("dragleave", (a) => {
    a.relatedTarget && o.contains(a.relatedTarget) || o.classList.remove("rs-drop-over");
  }), o.addEventListener("drop", (a) => {
    a.preventDefault(), o.classList.remove("rs-drop-over"), a.dataTransfer.types.includes(hi) && Pd(a, i, -1);
  }), bu.set(i.uuid, { app: t, container: o });
}
u(ME, "injectShapeDragHandles");
function xE(t) {
  const e = t.document;
  e && bu.delete(e.uuid);
}
u(xE, "cleanupShapeDrag");
const _E = 100, Km = 32;
function NE(t, e, n) {
  const i = [];
  for (let r = 0; r < t.length; r += 2)
    i.push(new n.IntPoint(Math.round(t[r] * e), Math.round(t[r + 1] * e)));
  return n.Clipper.Orientation(i) || i.reverse(), i;
}
u(NE, "polygonToPath");
function $E(t, e, n) {
  const { x: i, y: r, width: o, height: s, rotation: a } = t;
  let l = i * e, c = r * e, d = (i + o) * e, h = (r + s) * e;
  if (!a)
    return l = Math.round(l), c = Math.round(c), d = Math.round(d), h = Math.round(h), [new n.IntPoint(l, c), new n.IntPoint(d, c), new n.IntPoint(d, h), new n.IntPoint(l, h)];
  const f = (l + d) / 2, m = (c + h) / 2;
  l -= f, c -= m, d -= f, h -= m;
  const g = a * Math.PI / 180, y = Math.cos(g), b = Math.sin(g);
  return [
    new n.IntPoint(Math.round(y * l - b * c + f), Math.round(b * l + y * c + m)),
    new n.IntPoint(Math.round(y * d - b * c + f), Math.round(b * d + y * c + m)),
    new n.IntPoint(Math.round(y * d - b * h + f), Math.round(b * d + y * h + m)),
    new n.IntPoint(Math.round(y * l - b * h + f), Math.round(b * l + y * h + m))
  ];
}
u($E, "rectangleToPath");
function FE(t, e, n, i) {
  const { x: r, y: o, radius: s } = t, a = r * e, l = o * e, c = s * e, d = [];
  for (let h = 0; h < i; h++) {
    const f = 2 * Math.PI * h / i;
    d.push(new n.IntPoint(Math.round(a + Math.cos(f) * c), Math.round(l + Math.sin(f) * c)));
  }
  return d;
}
u(FE, "circleToPath");
function DE(t, e, n, i) {
  const { x: r, y: o, radiusX: s, radiusY: a, rotation: l } = t, c = r * e, d = o * e, h = s * e, f = a * e, m = (l || 0) * Math.PI / 180, g = Math.cos(m), y = Math.sin(m), b = [];
  for (let v = 0; v < i; v++) {
    const w = 2 * Math.PI * v / i, E = Math.cos(w) * h, S = Math.sin(w) * f;
    b.push(new n.IntPoint(Math.round(c + g * E - y * S), Math.round(d + y * E + g * S)));
  }
  return b;
}
u(DE, "ellipseToPath");
function Bc(t, e, n, i = {}) {
  const r = i.vertexCount ?? Km;
  switch (t.type) {
    case "polygon":
      return NE(t.points, e, n);
    case "rectangle":
      return $E(t, e, n);
    case "circle":
      return FE(t, e, n, r);
    case "ellipse":
      return DE(t, e, n, r);
    default:
      throw new Error(`Unknown shape type: ${t.type}`);
  }
}
u(Bc, "shapeToClipperPath");
function Xm(t, e, n) {
  const i = [];
  for (const r of t)
    i.push(r.X / e, r.Y / e);
  return { type: "polygon", points: i, hole: n };
}
u(Xm, "clipperPathToPolygonShape");
function Rd(t) {
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
u(Rd, "walkPolyTree");
function Jm(t, e, n = {}) {
  const i = n.scalingFactor ?? _E, r = n.vertexCount ?? Km, o = [], s = [];
  for (const f of t)
    f.hole ? s.push(f) : o.push(f);
  if (o.length <= 1 && s.length === 0 || o.length === 0) return null;
  const a = [];
  for (const f of o)
    a.push(Bc(f, i, e, { vertexCount: r }));
  const l = new e.Clipper();
  l.AddPaths(a, e.PolyType.ptSubject, !0);
  const c = new e.PolyTree();
  l.Execute(e.ClipType.ctUnion, c, e.PolyFillType.pftNonZero, e.PolyFillType.pftNonZero);
  let d = c;
  if (s.length > 0) {
    const f = [];
    for (const { path: w, hole: E } of Rd(c))
      E || f.push(w);
    const m = [];
    for (const w of s) {
      const E = Bc(w, i, e, { vertexCount: r });
      e.Clipper.Orientation(E) || E.reverse(), m.push(E);
    }
    const g = new e.Clipper();
    g.AddPaths(m, e.PolyType.ptSubject, !0);
    const y = new e.Paths();
    g.Execute(e.ClipType.ctUnion, y, e.PolyFillType.pftNonZero, e.PolyFillType.pftNonZero);
    const b = [];
    for (const w of y)
      e.Clipper.Orientation(w) && w.reverse(), b.push(w);
    const v = new e.Clipper();
    v.AddPaths(f, e.PolyType.ptSubject, !0), v.AddPaths(b, e.PolyType.ptClip, !0), d = new e.PolyTree(), v.Execute(e.ClipType.ctDifference, d, e.PolyFillType.pftNonZero, e.PolyFillType.pftNonZero);
  }
  const h = [];
  for (const { path: f, hole: m } of Rd(d))
    h.push(Xm(f, i, m));
  return h;
}
u(Jm, "mergeShapes");
function PE(t, e) {
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
    const c = i.shapes.map((h) => foundry.utils.deepClone(h)), d = Jm(c, ClipperLib);
    if (!d) {
      ui.notifications.info("Nothing to merge — need 2+ shapes, or shapes with holes.");
      return;
    }
    await i.update({ shapes: d }), ui.notifications.info(`Merged ${c.length} shapes into ${d.length}.`);
  }), r.prepend(o);
}
u(PE, "injectMergeButton");
var Jd, yr, Qm, Zm;
const gt = class gt extends sn(on) {
  constructor() {
    super(...arguments);
    _(this, yr);
  }
  // ── Context ───────────────────────────────────────────────────────────
  async _prepareContext() {
    var a, l, c;
    const n = CONST.REGION_VISIBILITY, i = ((l = (a = canvas.scene) == null ? void 0 : a.regions) == null ? void 0 : l.contents) ?? [], r = {};
    for (const d of i) {
      const h = d.visibility ?? n.LAYER;
      r[h] = (r[h] ?? 0) + 1;
    }
    const o = (c = Object.entries(r).sort((d, h) => h[1] - d[1])[0]) == null ? void 0 : c[0], s = o != null ? Number(o) : n.GAMEMASTER;
    return {
      options: Object.entries(n).map(([d, h]) => ({
        value: h,
        label: game.i18n.localize(`REGION.VISIBILITY.${d}.label`),
        selected: h === s
      }))
    };
  }
  // ── Render & Events ───────────────────────────────────────────────────
  _onRender(n, i) {
    super._onRender(n, i), T(this, yr, Qm).call(this);
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
yr = new WeakSet(), Qm = /* @__PURE__ */ u(function() {
  var i, r;
  const n = this.element;
  n instanceof HTMLElement && ((i = n.querySelector("[data-action='apply']")) == null || i.addEventListener("click", () => T(this, yr, Zm).call(this)), (r = n.querySelector("[data-action='cancel']")) == null || r.addEventListener("click", () => this.close()));
}, "#bindEvents"), Zm = /* @__PURE__ */ u(async function() {
  var c, d, h;
  const i = this.element.querySelector("[data-role='visibility-select']"), r = Number(i.value), o = ((d = (c = canvas.scene) == null ? void 0 : c.regions) == null ? void 0 : d.contents) ?? [];
  if (o.length === 0) {
    ui.notifications.info("No regions on this scene."), this.close();
    return;
  }
  const s = o.filter((f) => f.visibility !== r).map((f) => ({ _id: f.id, visibility: r }));
  if (s.length === 0) {
    ui.notifications.info("All regions already have the selected visibility."), this.close();
    return;
  }
  await canvas.scene.updateEmbeddedDocuments("Region", s);
  const a = CONST.REGION_VISIBILITY, l = game.i18n.localize(
    `REGION.VISIBILITY.${(h = Object.entries(a).find(([, f]) => f === r)) == null ? void 0 : h[0]}.label`
  );
  ui.notifications.info(`Set visibility to "${l}" on ${s.length} region(s).`), this.close();
}, "#doApply"), u(gt, "GlobalVisibilityApplication"), le(gt, "APP_ID", `${L}-global-visibility`), le(gt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Le(gt, gt, "DEFAULT_OPTIONS"),
  {
    id: gt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Jd = Le(gt, gt, "DEFAULT_OPTIONS")) == null ? void 0 : Jd.classes) ?? [], "eidolon-global-visibility-window", "themed"])
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
)), le(gt, "PARTS", {
  content: {
    template: `modules/${L}/templates/global-visibility.html`
  }
});
let Uc = gt;
const eg = 100, tg = 32;
function RE(t) {
  let e = 1 / 0, n = 1 / 0, i = -1 / 0, r = -1 / 0, o = !1;
  for (const s of t)
    if (!s.hole)
      switch (s.type) {
        case "polygon":
          for (let a = 0; a < s.points.length; a += 2) {
            const l = s.points[a], c = s.points[a + 1];
            l < e && (e = l), c < n && (n = c), l > i && (i = l), c > r && (r = c), o = !0;
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
            const l = s.x + s.width / 2, c = s.y + s.height / 2, d = s.rotation * Math.PI / 180, h = Math.cos(d), f = Math.sin(d);
            for (const [m, g] of a) {
              const y = m - l, b = g - c, v = h * y - f * b + l, w = f * y + h * b + c;
              v < e && (e = v), w < n && (n = w), v > i && (i = v), w > r && (r = w), o = !0;
            }
          } else
            for (const [l, c] of a)
              l < e && (e = l), c < n && (n = c), l > i && (i = l), c > r && (r = c), o = !0;
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
u(RE, "regionBBox");
function HE(t, e) {
  return t.maxX > e.minX && t.minX < e.maxX && t.maxY > e.minY && t.minY < e.maxY;
}
u(HE, "bboxOverlaps");
function ng(t, e, n, i) {
  const r = [];
  for (const o of t)
    o.hole || r.push(Bc(o, e, n, { vertexCount: i }));
  return r;
}
u(ng, "nonHolePaths");
function Hd(t, e) {
  if (t.length === 0) return [];
  if (t.length === 1) return [t[0]];
  const n = new e.Clipper();
  n.AddPaths(t, e.PolyType.ptSubject, !0);
  const i = new e.Paths();
  return n.Execute(e.ClipType.ctUnion, i, e.PolyFillType.pftNonZero, e.PolyFillType.pftNonZero), i;
}
u(Hd, "unionPaths");
function qE(t, e, n, i) {
  const r = new n.Clipper();
  r.AddPaths(t, n.PolyType.ptSubject, !0), r.AddPaths(e, n.PolyType.ptClip, !0);
  const o = new n.Paths();
  r.Execute(n.ClipType.ctIntersection, o, n.PolyFillType.pftNonZero, n.PolyFillType.pftNonZero);
  const s = 4 * i * i;
  return o.some((a) => Math.abs(n.Clipper.Area(a)) > s);
}
u(qE, "pathsIntersect");
function jE(t, e, n = {}) {
  const i = n.scalingFactor ?? eg, r = n.vertexCount ?? tg, o = [];
  for (const a of t) {
    const l = a.shapes ?? [], c = RE(l);
    if (!c) continue;
    const d = ng(l, i, e, r);
    d.length !== 0 && o.push({ region: a, bbox: c, paths: d });
  }
  const s = /* @__PURE__ */ new Set();
  for (let a = 0; a < o.length; a++)
    for (let l = a + 1; l < o.length; l++)
      HE(o[a].bbox, o[l].bbox) && qE(o[a].paths, o[l].paths, e, i) && (s.add(o[a].region), s.add(o[l].region));
  return [...s];
}
u(jE, "findOverlappingRegions");
function BE(t, e, n = {}) {
  const i = n.scalingFactor ?? eg, r = n.vertexCount ?? tg;
  let o = [];
  const s = [];
  for (let a = 0; a < t.length; a++) {
    const l = t[a], c = l.shapes ?? [], d = ng(c, i, e, r);
    if (a === 0) {
      o = Hd(d, e);
      continue;
    }
    if (d.length === 0) continue;
    const h = new e.Clipper();
    h.AddPaths(d, e.PolyType.ptSubject, !0), h.AddPaths(o, e.PolyType.ptClip, !0);
    const f = new e.PolyTree();
    h.Execute(e.ClipType.ctDifference, f, e.PolyFillType.pftNonZero, e.PolyFillType.pftNonZero);
    const m = [], g = [], y = f.Childs();
    for (let v = y.length - 1; v >= 0; v--) g.push(y[v]);
    for (; g.length > 0; ) {
      const v = g.pop();
      m.push(Xm(v.Contour(), i, v.IsHole()));
      const w = v.Childs();
      for (let E = w.length - 1; E >= 0; E--) g.push(w[E]);
    }
    for (const v of c)
      v.hole && m.push(foundry.utils.deepClone(v));
    s.push({ region: l, newShapes: m });
    const b = [...o, ...d];
    o = Hd(b, e);
  }
  return s;
}
u(BE, "resolveOverlaps");
var Qd, wn, Wn, Qt, ri, ig, rg, og;
const pt = class pt extends sn(on) {
  /**
   * @param {object} options
   * @param {object[]} [options.regions]  Pre-filtered overlapping regions
   */
  constructor(n = {}) {
    super(n);
    _(this, ri);
    /** @type {object[]} Ordered region documents. */
    _(this, wn, []);
    /** @type {Set<string>} IDs of regions excluded from resolution. */
    _(this, Wn, /* @__PURE__ */ new Set());
    /** @type {number|null} Index of the item currently being dragged. */
    _(this, Qt, null);
    O(this, wn, [...n.regions ?? []]);
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
    super._onRender(n, i), T(this, ri, ig).call(this);
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
    const i = jE(n, ClipperLib);
    if (i.length === 0) {
      ui.notifications.info("No overlapping regions found on this scene.");
      return;
    }
    new pt({ regions: i }).render(!0);
  }
};
wn = new WeakMap(), Wn = new WeakMap(), Qt = new WeakMap(), ri = new WeakSet(), ig = /* @__PURE__ */ u(function() {
  var r, o;
  const n = this.element;
  if (!(n instanceof HTMLElement)) return;
  const i = n.querySelector("[data-role='region-list']");
  i && T(this, ri, rg).call(this, i);
  for (const s of n.querySelectorAll("[data-action='toggle-exclude']"))
    s.addEventListener("click", (a) => {
      a.stopPropagation();
      const l = Number(s.dataset.index), c = p(this, wn)[l];
      c && (p(this, Wn).has(c.id) ? p(this, Wn).delete(c.id) : p(this, Wn).add(c.id), this.render({ force: !0 }));
    });
  (r = n.querySelector("[data-action='resolve']")) == null || r.addEventListener("click", () => T(this, ri, og).call(this)), (o = n.querySelector("[data-action='cancel']")) == null || o.addEventListener("click", () => this.close());
}, "#bindEvents"), // ── Drag reorder ─────────────────────────────────────────────────────
rg = /* @__PURE__ */ u(function(n) {
  const i = n.querySelectorAll(".overlap-resolver__item");
  for (const r of i)
    r.addEventListener("dragstart", (o) => {
      O(this, Qt, Number(r.dataset.index)), o.dataTransfer.effectAllowed = "move", o.dataTransfer.setData("text/plain", String(p(this, Qt))), requestAnimationFrame(() => r.classList.add("is-dragging"));
    }), r.addEventListener("dragover", (o) => {
      o.preventDefault(), o.dataTransfer.dropEffect = "move";
      const s = r.getBoundingClientRect(), a = s.top + s.height / 2, l = o.clientY < a;
      for (const c of n.querySelectorAll(".overlap-resolver__item"))
        c.classList.remove("or--insert-before", "or--insert-after");
      r.classList.add(l ? "or--insert-before" : "or--insert-after");
    }), r.addEventListener("dragleave", () => {
      r.classList.remove("or--insert-before", "or--insert-after");
    }), r.addEventListener("drop", (o) => {
      o.preventDefault();
      for (const f of n.querySelectorAll(".overlap-resolver__item"))
        f.classList.remove("or--insert-before", "or--insert-after", "is-dragging");
      if (p(this, Qt) == null) return;
      const s = Number(r.dataset.index), a = r.getBoundingClientRect(), l = a.top + a.height / 2;
      let c = o.clientY < l ? s : s + 1;
      const d = p(this, Qt);
      if (d === c || d + 1 === c) {
        O(this, Qt, null);
        return;
      }
      const [h] = p(this, wn).splice(d, 1);
      d < c && c--, p(this, wn).splice(c, 0, h), O(this, Qt, null), this.render({ force: !0 });
    }), r.addEventListener("dragend", () => {
      O(this, Qt, null);
      for (const o of n.querySelectorAll(".overlap-resolver__item"))
        o.classList.remove("or--insert-before", "or--insert-after", "is-dragging");
    });
}, "#bindDragReorder"), og = /* @__PURE__ */ u(async function() {
  const n = p(this, wn).filter((s) => !p(this, Wn).has(s.id)), i = BE(n, ClipperLib);
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
}, "#doResolve"), u(pt, "OverlapResolverApplication"), le(pt, "APP_ID", `${L}-overlap-resolver`), le(pt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Le(pt, pt, "DEFAULT_OPTIONS"),
  {
    id: pt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Qd = Le(pt, pt, "DEFAULT_OPTIONS")) == null ? void 0 : Qd.classes) ?? [], "eidolon-overlap-resolver-window", "themed"])
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
)), le(pt, "PARTS", {
  content: {
    template: `modules/${L}/templates/overlap-resolver.html`
  }
});
let Vc = pt;
function UE(t, e) {
  var c;
  const n = qe(e);
  if (!n) return;
  const i = n.querySelector("header.window-header") ?? ((c = n.closest("section")) == null ? void 0 : c.querySelector("header.window-header"));
  if (!i || i.querySelector('[data-action="openGlobalVisibility"]')) return;
  const r = i.querySelector("button.close") ?? i.querySelector('[data-action="close"]'), o = /* @__PURE__ */ u((d) => r ? r.before(d) : i.append(d), "insertBefore"), s = document.createElement("button");
  s.type = "button", s.className = "header-control fa-solid fa-object-union", s.dataset.action = "mergeAllRegionShapes", s.dataset.tooltip = "Merge shapes in all regions", s.setAttribute("aria-label", "Merge shapes in all regions"), s.addEventListener("click", async (d) => {
    var g, y;
    d.preventDefault(), d.stopPropagation();
    const h = ((y = (g = canvas.scene) == null ? void 0 : g.regions) == null ? void 0 : y.contents) ?? [];
    if (h.length === 0) {
      ui.notifications.info("No regions on this scene.");
      return;
    }
    const f = [];
    for (const b of h) {
      const v = (b.shapes ?? []).map((E) => foundry.utils.deepClone(E)), w = Jm(v, ClipperLib);
      w && (w.length >= v.length || f.push({ _id: b.id, shapes: w }));
    }
    if (f.length === 0) {
      ui.notifications.info("Nothing to merge — all regions already have simple shapes.");
      return;
    }
    await canvas.scene.updateEmbeddedDocuments("Region", f);
    const m = f.reduce((b, v) => b + v.shapes.length, 0);
    ui.notifications.info(`Merged shapes in ${f.length} region(s) (${m} shapes total).`);
  }), o(s);
  const a = document.createElement("button");
  a.type = "button", a.className = "header-control fa-solid fa-eye", a.dataset.action = "openGlobalVisibility", a.dataset.tooltip = "Global Region Visibility", a.setAttribute("aria-label", "Set visibility for all regions"), a.addEventListener("click", (d) => {
    d.preventDefault(), d.stopPropagation(), Uc.open();
  }), o(a);
  const l = document.createElement("button");
  l.type = "button", l.className = "header-control fa-solid fa-scissors", l.dataset.action = "openOverlapResolver", l.dataset.tooltip = "Overlap Resolver", l.setAttribute("aria-label", "Open overlap resolver"), l.addEventListener("click", (d) => {
    d.preventDefault(), d.stopPropagation(), Vc.open();
  }), o(l);
}
u(UE, "injectRegionLegendButtons");
function VE() {
  Hooks.on("renderRegionConfig", (t, e) => {
    ME(t, e), PE(t, e);
  }), Hooks.on("closeRegionConfig", (t) => {
    xE(t);
  }), Hooks.on("renderRegionLegend", (t, e) => {
    UE(t, e);
  });
}
u(VE, "registerRegionShapeHooks");
VE();
const Xn = L, vu = "softVisionAttenuation", wu = "softVisionBrightness", Eu = "softVisionContrast", Su = "softVisionSaturation", zr = "softFade", er = Object.freeze({
  attenuation: 0.9,
  brightness: -0.1,
  contrast: -0.2,
  saturation: -0.1
});
function Bo(t) {
  try {
    const e = Number(game.settings.get(Xn, t));
    return Number.isFinite(e) ? e : er[qd(t)];
  } catch {
    return er[qd(t)] ?? 0;
  }
}
u(Bo, "getNumberSetting");
function qd(t) {
  return {
    [vu]: "attenuation",
    [wu]: "brightness",
    [Eu]: "contrast",
    [Su]: "saturation"
  }[t];
}
u(qd, "settingToDefaultKey");
function GE(t) {
  game.settings.register(Xn, vu, {
    name: "Soft Fade: Attenuation",
    hint: "How strongly the vision darkens toward the perimeter (0 = uniform, 1 = full falloff).",
    scope: "client",
    config: !0,
    type: Number,
    default: er.attenuation,
    range: { min: 0, max: 1, step: 0.05 },
    onChange: t
  }), game.settings.register(Xn, wu, {
    name: "Soft Fade: Brightness",
    hint: "Negative values darken the outer ring of vision.",
    scope: "client",
    config: !0,
    type: Number,
    default: er.brightness,
    range: { min: -1, max: 1, step: 0.05 },
    onChange: t
  }), game.settings.register(Xn, Eu, {
    name: "Soft Fade: Contrast",
    hint: "Negative values soften the scene near the vision edge.",
    scope: "client",
    config: !0,
    type: Number,
    default: er.contrast,
    range: { min: -1, max: 1, step: 0.05 },
    onChange: t
  }), game.settings.register(Xn, Su, {
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
u(GE, "registerSettings");
function WE() {
  var t, e, n;
  return ((e = (t = foundry == null ? void 0 : foundry.canvas) == null ? void 0 : t.perception) == null ? void 0 : e.VisionMode) ?? ((n = CONFIG.Canvas.visionModes.basic) == null ? void 0 : n.constructor);
}
u(WE, "getVisionModeClass");
function zE() {
  var t, e, n, i;
  return ((e = (t = foundry == null ? void 0 : foundry.canvas) == null ? void 0 : t.rendering) == null ? void 0 : e.ColorAdjustmentsSamplerShader) ?? ((i = (n = CONFIG.Canvas.visionModes.darkvision) == null ? void 0 : n.canvas) == null ? void 0 : i.shader);
}
u(zE, "getColorAdjustmentsShader");
function YE() {
  const t = WE(), e = zE();
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
        attenuation: Bo(vu),
        brightness: Bo(wu),
        contrast: Bo(Eu),
        saturation: Bo(Su)
      }
    }
  });
}
u(YE, "buildSoftVisionMode");
function fl() {
  var e;
  const t = YE();
  return t ? (CONFIG.Canvas.visionModes[zr] = t, canvas != null && canvas.ready && ((e = canvas.perception) == null || e.update({ refreshVision: !0, refreshLighting: !0 })), !0) : (console.warn(`[${Xn}] Soft Vision: required classes not available yet, deferring.`), !1);
}
u(fl, "refreshVisionMode");
function KE() {
  Hooks.once("init", () => {
    GE(fl);
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
u(KE, "registerSoftVisionHooks");
KE();
const gr = L, Gc = "softLightFade", qt = Object.freeze({
  enabled: !1,
  threshold: 0.3,
  saturation: -0.8,
  brightness: -0.15
}), XE = `
  uniform bool softFadeEnabled;
  uniform float softFadeThreshold;
  uniform float softFadeSaturation;
  uniform float softFadeBrightness;`, JE = `
    // Soft Light Fade — per-light radial desaturation/darkening
    if ( softFadeEnabled ) {
      float sfFade = smoothstep(softFadeThreshold, 1.0, dist);
      if ( sfFade > 0.0 ) {
        vec3 sfGrey = vec3(perceivedBrightness(finalColor));
        finalColor = mix(finalColor, sfGrey, sfFade * (-softFadeSaturation));
        finalColor *= 1.0 + (sfFade * softFadeBrightness);
      }
    }
`, hl = "uniform float saturation;", QE = "if ( attenuation != 0.0 ) depth *= smoothstep(";
function ZE() {
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
u(ZE, "collectIlluminationShaders");
function eS(t) {
  const e = t.fragmentShader;
  if (typeof e != "string" || e.includes("softFadeEnabled")) return !1;
  const n = e.indexOf(hl);
  if (n === -1)
    return console.warn("[eidolon-utilities] Soft Light: could not find uniform anchor in", t.name), !1;
  const i = e.slice(0, n + hl.length) + XE + e.slice(n + hl.length), r = i.indexOf(QE);
  if (r === -1)
    return console.warn("[eidolon-utilities] Soft Light: could not find FALLOFF anchor in", t.name), !1;
  const o = i.slice(0, r) + JE + i.slice(r);
  return t.fragmentShader = o, t.defaultUniforms.hasOwnProperty("softFadeEnabled") || (t.defaultUniforms = {
    ...t.defaultUniforms,
    softFadeEnabled: qt.enabled,
    softFadeThreshold: qt.threshold,
    softFadeSaturation: qt.saturation,
    softFadeBrightness: qt.brightness
  }), !0;
}
u(eS, "patchShaderClass");
function tS() {
  const t = ZE();
  let e = 0;
  for (const n of t)
    eS(n) && e++;
  return e;
}
u(tS, "patchIlluminationShaders");
function nS() {
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
u(nS, "getBaseLightSourceProto");
function iS() {
  const t = nS();
  if (!t)
    return console.warn(`[${gr}] Soft Light: could not find _updateCommonUniforms on BaseLightSource`), !1;
  const e = t._updateCommonUniforms;
  return t._updateCommonUniforms = /* @__PURE__ */ u(function(i) {
    var a, l;
    e.call(this, i);
    const r = i == null ? void 0 : i.uniforms;
    if (!r || !("softFadeEnabled" in r)) return;
    const o = (a = this.object) == null ? void 0 : a.document;
    if (!o) {
      r.softFadeEnabled = !1;
      return;
    }
    const s = (l = o.getFlag) == null ? void 0 : l.call(o, gr, Gc);
    if (!(s != null && s.enabled)) {
      r.softFadeEnabled = !1;
      return;
    }
    r.softFadeEnabled = !0, r.softFadeThreshold = s.threshold ?? qt.threshold, r.softFadeSaturation = s.saturation ?? qt.saturation, r.softFadeBrightness = s.brightness ?? qt.brightness;
  }, "patchedUpdateCommonUniforms"), !0;
}
u(iS, "patchUniformUpdater");
function rS() {
  Hooks.on("renderAmbientLightConfig", oS);
}
u(rS, "registerLightConfigUI");
function oS(t, e) {
  var v, w, E, S;
  const n = qe(e);
  if (!n || n.querySelector(".eidolon-soft-light-fade")) return;
  const i = n.querySelector('.tab[data-tab="animation"]');
  if (!i) return;
  const r = t.document ?? ((v = t.object) == null ? void 0 : v.document) ?? t.object;
  if (!r) return;
  const o = ((w = r.getFlag) == null ? void 0 : w.call(r, gr, Gc)) ?? {}, s = o.enabled ?? qt.enabled, a = o.threshold ?? qt.threshold, l = o.saturation ?? qt.saturation, c = o.brightness ?? qt.brightness, d = `flags.${gr}.${Gc}`, h = document.createElement("fieldset");
  h.className = "eidolon-soft-light-fade", h.innerHTML = `
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
					value="${c}">
				<span class="range-value">${c}</span>
			</div>
			<p class="hint">Darkening at the edge (-0.5 = strong, 0 = no change).</p>
		</div>
	`, i.appendChild(h);
  const f = h.querySelector('input[type="checkbox"]'), m = h.querySelector(".eidolon-soft-light-threshold-group"), g = h.querySelector(".eidolon-soft-light-saturation-group"), y = h.querySelector(".eidolon-soft-light-brightness-group"), b = [m, g, y];
  f == null || f.addEventListener("change", () => {
    const I = f.checked;
    for (const k of b)
      k && (k.style.opacity = I ? "" : "0.5");
  });
  for (const I of h.querySelectorAll('input[type="range"]')) {
    const k = (E = I.parentElement) == null ? void 0 : E.querySelector(".range-value");
    k && I.addEventListener("input", () => {
      k.textContent = I.value;
    });
  }
  (S = t.setPosition) == null || S.call(t, { height: "auto" });
}
u(oS, "handleRender");
function sS() {
  Hooks.once("init", () => {
    const t = tS();
    console.log(`[${gr}] Soft Light: patched ${t} illumination shaders`);
  }), Hooks.once("setup", () => {
    iS() && console.log(`[${gr}] Soft Light: uniform updater installed`);
  }), rS();
}
u(sS, "registerSoftLightHooks");
sS();
const sg = "eidolon-utilities", aS = "directionalTeleport", ml = `${sg}.${aS}`, jd = `[${sg}] Directional Teleport:`, gl = ["left", "right", "up", "down"], Bd = { left: "Left", right: "Right", up: "Up", down: "Down" }, Ud = { left: "fa-arrow-left", right: "fa-arrow-right", up: "fa-arrow-up", down: "fa-arrow-down" };
Hooks.once("init", () => {
  const { RegionBehaviorType: t } = foundry.data.regionBehaviors, { BooleanField: e, DocumentUUIDField: n, StringField: i } = foundry.data.fields, s = class s extends i {
    /** @override */
    _toInput(c) {
      const d = c.value || "", h = new Set(d ? d.split(",") : []), f = document.createElement("div");
      f.classList.add("eidutil-direction-pills");
      const m = document.createElement("input");
      m.type = "hidden", m.name = c.name, m.value = d, f.appendChild(m);
      const g = document.createElement("div");
      g.classList.add("eidutil-pill-box"), f.appendChild(g);
      const y = /* @__PURE__ */ u(() => {
        const N = g.querySelectorAll(".eidutil-pill"), x = [];
        for (const F of N) x.push(F.dataset.value);
        m.value = x.join(",");
      }, "syncHidden"), b = /* @__PURE__ */ u((N) => {
        const x = document.createElement("span");
        x.classList.add("eidutil-pill"), x.dataset.value = N;
        const F = document.createElement("i");
        F.className = `fa-solid ${Ud[N]}`, x.appendChild(F);
        const A = document.createElement("span");
        A.textContent = ` ${Bd[N]}`, x.appendChild(A);
        const R = document.createElement("a");
        R.classList.add("eidutil-pill-remove"), R.innerHTML = '<i class="fa-solid fa-xmark"></i>', R.addEventListener("click", (j) => {
          j.preventDefault(), x.remove(), y(), I();
        }), x.appendChild(R), g.appendChild(x);
      }, "addPill");
      for (const N of h)
        gl.includes(N) && b(N);
      const v = document.createElement("div");
      v.classList.add("eidutil-pill-add-wrapper");
      const w = document.createElement("a");
      w.classList.add("eidutil-pill-add"), w.innerHTML = '<i class="fa-solid fa-plus"></i>', v.appendChild(w);
      const E = document.createElement("div");
      E.classList.add("eidutil-pill-dropdown"), E.style.display = "none";
      for (const N of gl) {
        const x = document.createElement("a");
        x.classList.add("eidutil-pill-option"), x.dataset.value = N, x.innerHTML = `<i class="fa-solid ${Ud[N]}"></i> ${Bd[N]}`, x.addEventListener("click", (F) => {
          F.preventDefault(), F.stopPropagation(), b(N), y(), E.style.display = "none", I();
        }), E.appendChild(x);
      }
      v.appendChild(E), f.appendChild(v), w.addEventListener("click", (N) => {
        N.preventDefault(), N.stopPropagation(), S();
        const x = E.style.display === "none";
        E.style.display = x ? "block" : "none", x && setTimeout(() => {
          const F = /* @__PURE__ */ u(() => {
            E.style.display = "none", document.removeEventListener("pointerdown", F, !0);
          }, "closeHandler");
          document.addEventListener("pointerdown", F, !0);
        }, 0);
      });
      const S = /* @__PURE__ */ u(() => {
        const N = new Set(m.value ? m.value.split(",") : []);
        for (const x of E.querySelectorAll(".eidutil-pill-option"))
          x.style.display = N.has(x.dataset.value) ? "none" : "";
      }, "updateDropdownOptions"), I = /* @__PURE__ */ u(() => {
        const N = new Set(m.value ? m.value.split(",") : []);
        v.style.display = N.size >= gl.length ? "none" : "";
      }, "updateAddButton");
      I();
      const k = document.createElement("span");
      k.classList.add("eidutil-pill-empty-hint"), k.textContent = "Any direction", g.insertBefore(k, g.firstChild);
      const M = /* @__PURE__ */ u(() => {
        k.style.display = g.querySelectorAll(".eidutil-pill").length > 0 ? "none" : "";
      }, "updateHint");
      return new MutationObserver(M).observe(g, { childList: !0 }), M(), f;
    }
  };
  u(s, "DirectionPillField");
  let r = s;
  const a = class a extends t {
    static defineSchema() {
      return {
        destination: new n({
          type: "Region"
        }),
        choice: new e(),
        directions: new r({
          required: !0,
          initial: "",
          nullable: !1
        }),
        event: new i({
          required: !0,
          initial: "enter",
          choices: {
            enter: "On Enter (from)",
            exit: "On Exit (toward)"
          }
        })
      };
    }
    /* -------------------------------------------------- */
    /*  Direction detection                                */
    /* -------------------------------------------------- */
    /**
     * Determine the primary direction of a movement vector.
     * Returns "left", "right", "up", or "down".
     */
    static _detectDirection(c, d) {
      const h = d.x - c.x, f = d.y - c.y;
      return Math.abs(h) >= Math.abs(f) ? h >= 0 ? "right" : "left" : f >= 0 ? "down" : "up";
    }
    /** Find the first ENTER segment. */
    static _findEnterSegment(c) {
      for (const d of c)
        if (d.type === Region.MOVEMENT_SEGMENT_TYPES.ENTER) return d;
      return null;
    }
    /** Find the last EXIT segment. */
    static _findExitSegment(c) {
      for (let d = c.length - 1; d >= 0; d--)
        if (c[d].type === Region.MOVEMENT_SEGMENT_TYPES.EXIT) return c[d];
      return null;
    }
    /**
     * Check if the token's movement direction matches the configured directions.
     * Empty directions set = match any direction.
     */
    static _matchesDirection(c, d, h) {
      const f = d ? new Set(d.split(",")) : /* @__PURE__ */ new Set();
      if (f.size === 0) return !0;
      const m = h === "enter" ? a._findEnterSegment(c) : a._findExitSegment(c);
      if (!m) return !1;
      const g = a._detectDirection(
        m.from,
        m.to
      );
      if (h === "enter") {
        const y = { left: "right", right: "left", up: "down", down: "up" }[g];
        return f.has(y);
      }
      return f.has(g);
    }
    /** Enter trigger: teleport the token if direction matches. */
    static async _onTokenMoveIn(c) {
      this.event !== "enter" || !this.destination || c.data.forced || a._matchesDirection(
        c.data.segments,
        this.directions,
        "enter"
      ) && await a._handleTeleport.call(this, c);
    }
    /** Exit trigger: teleport the token if direction matches. */
    static async _onTokenMoveOut(c) {
      this.event !== "exit" || !this.destination || c.data.forced || a._matchesDirection(
        c.data.segments,
        this.directions,
        "exit"
      ) && await a._handleTeleport.call(this, c);
    }
    /** Pre-move: stop the token at the entry point (enter mode only, if direction matches). */
    static async _onTokenPreMove(c) {
      if (!(this.event !== "enter" || !this.destination) && a._matchesDirection(
        c.data.segments,
        this.directions,
        "enter"
      )) {
        for (const d of c.data.segments)
          if (d.type === Region.MOVEMENT_SEGMENT_TYPES.ENTER) {
            c.data.destination = d.to;
            break;
          }
      }
    }
    /* -------------------------------------------------- */
    /*  Core teleport logic                                */
    /* -------------------------------------------------- */
    /** Shared handler for both enter and exit events. */
    static async _handleTeleport(c) {
      const d = fromUuidSync(this.destination);
      if (!(d instanceof RegionDocument)) {
        console.error(`${jd} ${this.destination} does not exist`);
        return;
      }
      const h = c.data.token, f = c.user;
      if (a._shouldTeleport(h, d, f)) {
        if (h.object) {
          const m = CanvasAnimation.getAnimation(h.object.animationName);
          m && await m.promise;
        }
        this.choice && f.isSelf && !await a._confirmDialog(h, d) || await a._teleportToken(h, d, f);
      }
    }
    /**
     * Determine which user should execute the teleport.
     * Mirrors core logic: owner teleports if they can, otherwise the highest-role active GM.
     */
    static _shouldTeleport(c, d, h) {
      if (c.parent === d.parent || h.can("TOKEN_CREATE") && h.can("TOKEN_DELETE")) return h.isSelf;
      const m = game.users.filter(
        (g) => g.active && g.isGM && g.can("TOKEN_CREATE") && g.can("TOKEN_DELETE")
      );
      return m.length === 0 ? !1 : (m.sort((g, y) => y.role - g.role || g.id.compare(y.id)), m[0].isSelf);
    }
    /** Confirmation dialog using i18n strings. */
    static async _confirmDialog(c, d) {
      var g, y;
      const h = ((y = (g = foundry.applications) == null ? void 0 : g.api) == null ? void 0 : y.DialogV2) ?? Dialog, f = game.user.isGM ? "EIDUTIL.TYPES.directionalTeleport.ConfirmGM" : "EIDUTIL.TYPES.directionalTeleport.Confirm", m = game.i18n.format(f, {
        token: c.name,
        region: d.name,
        scene: d.parent.name
      });
      return h.confirm({
        window: { title: game.i18n.localize("EIDUTIL.directionalTeleport.typeLabel") },
        content: `<p>${m}</p>`,
        rejectClose: !1
      });
    }
    /* -------------------------------------------------- */
    /*  Random destination (same as core)                  */
    /* -------------------------------------------------- */
    /**
     * Find a random valid position within the destination region.
     * Mirrors core teleportToken #getDestination logic.
     */
    static _getRandomDestination(c, d) {
      const h = c.document.parent, f = h.grid;
      if (c.polygons.length === 0) throw new Error(`${c.document.uuid} is empty`);
      const m = Math.clamp(d.document.elevation, c.bottom, c.top), g = d.getCenterPoint({ x: 0, y: 0 });
      let y;
      if (!f.isGridless) {
        const S = [], [I, k, M, $] = f.getOffsetRange(
          new PIXI.Rectangle(0, 0, h.dimensions.width, h.dimensions.height).fit(c.bounds).pad(1)
        );
        for (let N = I; N < M; N++)
          for (let x = k; x < $; x++) {
            const F = f.getCenterPoint({ i: N, j: x });
            if (!c.polygonTree.testPoint(F)) continue;
            const A = d.getSnappedPosition({ x: F.x - g.x, y: F.y - g.y });
            A.x = Math.round(A.x), A.y = Math.round(A.y), A.elevation = m, c.polygonTree.testPoint(d.getCenterPoint(A)) && d.testInsideRegion(c, A) && S.push(A);
          }
        S.length !== 0 && (y = S[Math.floor(Math.random() * S.length)]);
      }
      if (y) return y;
      const { vertices: b, indices: v } = c.triangulation, w = [];
      let E = 0;
      for (let S = 0; S < v.length; S += 3) {
        const I = v[S] * 2, k = v[S + 1] * 2, M = v[S + 2] * 2, $ = Math.abs(
          (b[k] - b[I]) * (b[M + 1] - b[I + 1]) - (b[M] - b[I]) * (b[k + 1] - b[I + 1])
        ) / 2;
        E += $, w.push($);
      }
      for (let S = 0; S < 10; S++) {
        y = void 0;
        let I, k = E * Math.random();
        for (I = 0; I < w.length - 1 && (k -= w[I], !(k < 0)); I++)
          ;
        const M = 3 * I, $ = v[M] * 2, N = v[M + 1] * 2, x = v[M + 2] * 2, F = Math.sqrt(Math.random()), A = Math.random(), R = F * (1 - A), j = F * A, B = Math.round(
          b[$] + (b[N] - b[$]) * R + (b[x] - b[$]) * j - g.x
        ), H = Math.round(
          b[$ + 1] + (b[N + 1] - b[$ + 1]) * R + (b[x + 1] - b[$ + 1]) * j - g.y
        );
        y = { x: B, y: H, elevation: m }, c.polygonTree.testPoint(d.getCenterPoint(y)) && d.testInsideRegion(c, y);
      }
      if (!y) throw new Error(`${c.document.uuid} cannot accommodate ${d.document.uuid}`);
      return y;
    }
    /* -------------------------------------------------- */
    /*  Token teleportation                                */
    /* -------------------------------------------------- */
    /** Perform the actual teleportation, handling same-scene and cross-scene cases. */
    static async _teleportToken(c, d, h) {
      const f = d.parent, m = c.parent, g = d.object ?? new CONFIG.Region.objectClass(d);
      let y;
      if (m === f)
        y = c;
      else {
        const E = c.toObject();
        delete E._id, y = TokenDocument.implementation.fromSource(E, { parent: f });
      }
      const b = y.object ?? new CONFIG.Token.objectClass(y);
      b.animationContexts.size !== 0 && y.reset();
      let v;
      try {
        v = a._getRandomDestination(
          g,
          b
        );
      } finally {
        d.object || g.destroy({ children: !0 }), (!y.id || !y.object) && b.destroy({ children: !0 });
      }
      if (c === y) {
        await c.update(v, { teleport: !0, forced: !0 });
        return;
      }
      y.updateSource(v);
      const w = y.toObject();
      f.tokens.has(c.id) ? delete w._id : w._id = c.id, y = await TokenDocument.implementation.create(y, {
        parent: f,
        keepId: !0
      });
      for (const E of game.combats) {
        const S = [];
        for (const I of E.combatants)
          I.sceneId === m.id && I.tokenId === c.id && S.push({
            _id: I.id,
            sceneId: f.id,
            tokenId: y.id
          });
        S.length && await E.updateEmbeddedDocuments("Combatant", S);
      }
      await c.delete(), h.isSelf ? m.isView && await f.view() : m.id === h.viewedScene && await game.socket.emit("pullToScene", f.id, h.id);
    }
  };
  u(a, "DirectionalTeleportRegionBehaviorType"), le(a, "LOCALIZATION_PREFIXES", ["EIDUTIL.TYPES.directionalTeleport"]), /* -------------------------------------------------- */
  /*  Event handlers                                     */
  /* -------------------------------------------------- */
  le(a, "events", {
    [CONST.REGION_EVENTS.TOKEN_MOVE_IN]: a._onTokenMoveIn,
    [CONST.REGION_EVENTS.TOKEN_PRE_MOVE]: a._onTokenPreMove,
    [CONST.REGION_EVENTS.TOKEN_MOVE_OUT]: a._onTokenMoveOut
  });
  let o = a;
  Object.assign(CONFIG.RegionBehavior.dataModels, {
    [ml]: o
  }), CONFIG.RegionBehavior.typeLabels[ml] = "EIDUTIL.directionalTeleport.typeLabel", CONFIG.RegionBehavior.typeIcons[ml] = "fa-solid fa-compass", console.log(`${jd} Behavior registered.`);
});
//# sourceMappingURL=eidolon-utilities.js.map
