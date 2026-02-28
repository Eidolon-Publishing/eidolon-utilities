var Rc = Object.defineProperty;
var qm = Object.getPrototypeOf;
var jm = Reflect.get;
var Hc = (t) => {
  throw TypeError(t);
};
var Bm = (t, e, n) => e in t ? Rc(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var c = (t, e) => Rc(t, "name", { value: e, configurable: !0 });
var be = (t, e, n) => Bm(t, typeof e != "symbol" ? e + "" : e, n), us = (t, e, n) => e.has(t) || Hc("Cannot " + n);
var h = (t, e, n) => (us(t, e, "read from private field"), n ? n.call(t) : e.get(t)), k = (t, e, n) => e.has(t) ? Hc("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, n), L = (t, e, n, i) => (us(t, e, "write to private field"), i ? i.call(t, n) : e.set(t, n), n), C = (t, e, n) => (us(t, e, "access private method"), n);
var ds = (t, e, n, i) => ({
  set _(r) {
    L(t, e, r, n);
  },
  get _() {
    return h(t, e, i);
  }
}), He = (t, e, n) => jm(qm(t), n, e);
const T = "eidolon-utilities", ja = "timeTriggerActive", Fs = "timeTriggerHideWindow", Ds = "timeTriggerShowPlayerWindow", Ps = "timeTriggerAllowRealTime", Yu = "timeTriggers", Ea = "timeTriggerHistory", Rs = "debug", Hs = "timeFormat", qs = "manageTime", js = "secondsPerRound";
const Um = [-30, -15, -5, 5, 15, 30], Bi = 1440 * 60, Ca = "playSound", na = 6;
function E(t, e) {
  var n, i;
  return (i = (n = game.i18n) == null ? void 0 : n.has) != null && i.call(n, t) ? game.i18n.localize(t) : e;
}
c(E, "localize");
function Pt(t) {
  return typeof t != "string" ? "" : t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
c(Pt, "escapeHtml");
function Kt(t) {
  var e;
  return t == null ? t : (e = foundry == null ? void 0 : foundry.utils) != null && e.duplicate ? foundry.utils.duplicate(t) : JSON.parse(JSON.stringify(t));
}
c(Kt, "duplicateData");
function Vm() {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
c(Vm, "generateTriggerId");
function Ju(t) {
  if (typeof t != "string") return null;
  const e = t.trim();
  if (!e) return null;
  const n = e.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (!n) return null;
  const i = Number(n[1]), r = Number(n[2]), a = n[3] !== void 0 ? Number(n[3]) : 0;
  return !Number.isInteger(i) || !Number.isInteger(r) || !Number.isInteger(a) || i < 0 || i > 23 || r < 0 || r > 59 || a < 0 || a > 59 ? null : i * 3600 + r * 60 + a;
}
c(Ju, "parseTriggerTimeToSeconds");
function mr() {
  var t, e;
  return ((t = game.scenes) == null ? void 0 : t.current) ?? ((e = game.scenes) == null ? void 0 : e.active) ?? null;
}
c(mr, "getActiveScene");
function Qt(t) {
  return (t == null ? void 0 : t.object) ?? (t == null ? void 0 : t.document) ?? null;
}
c(Qt, "getSceneFromApplication");
function Ke(t) {
  return t && typeof t.getFlag == "function" && typeof t.setFlag == "function";
}
c(Ke, "hasSceneDocument");
const Bs = /* @__PURE__ */ new Set(), Us = /* @__PURE__ */ new Set(), Vs = /* @__PURE__ */ new Set(), zs = /* @__PURE__ */ new Set();
let Ci = !1, Mr = !1, Ba = na, Ua = "12h", qc = !1;
function fs(t) {
  Ci = !!t;
  for (const e of Bs)
    try {
      e(Ci);
    } catch (n) {
      console.error(`${T} | Debug change handler failed`, n);
    }
}
c(fs, "notifyDebugChange");
function ms(t) {
  Mr = !!t;
  for (const e of Us)
    try {
      e(Mr);
    } catch (n) {
      console.error(`${T} | Manage time change handler failed`, n);
    }
}
c(ms, "notifyManageTimeChange");
function Ku(t) {
  return t === "24h" ? "24h" : "12h";
}
c(Ku, "normalizeTimeFormatValue");
function rc(t) {
  const e = Number(t);
  return !Number.isFinite(e) || e <= 0 ? na : e;
}
c(rc, "normalizeSecondsPerRoundValue");
function hs(t) {
  const e = rc(t);
  Ba = e;
  for (const n of Vs)
    try {
      n(e);
    } catch (i) {
      console.error(`${T} | Seconds-per-round change handler failed`, i);
    }
}
c(hs, "notifySecondsPerRoundChange");
function gs(t) {
  const e = Ku(t);
  Ua = e;
  for (const n of zs)
    try {
      n(e);
    } catch (i) {
      console.error(`${T} | Time format change handler failed`, i);
    }
}
c(gs, "notifyTimeFormatChange");
function zm() {
  var e;
  if (qc) return;
  if (qc = !0, !((e = game == null ? void 0 : game.settings) != null && e.register)) {
    console.warn(
      `${T} | game.settings.register is unavailable. Module settings could not be registered.`
    );
    return;
  }
  const t = typeof game.settings.registerChange == "function";
  game.settings.register(T, Rs, {
    name: E("EIDOLON.TimeTrigger.DebugSettingName", "Enable debug logging"),
    hint: E(
      "EIDOLON.TimeTrigger.DebugSettingHint",
      "Write detailed time-trigger diagnostics to the browser console."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: t ? void 0 : fs
  }), t && game.settings.registerChange(T, Rs, fs), Ci = ac(), fs(Ci), game.settings.register(T, qs, {
    name: E("EIDOLON.TimeTrigger.ManageTimeSettingName", "Manage Game Time"),
    hint: E(
      "EIDOLON.TimeTrigger.ManageTimeSettingHint",
      "Allow Eidolon Utilities to advance world time automatically while the game is unpaused. Warning: This may conflict with other time-management modules."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: t ? void 0 : ms
  }), t && game.settings.registerChange(T, qs, ms), Mr = Wm(), ms(Mr), game.settings.register(T, js, {
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
    default: na,
    range: { min: 1, max: 3600, step: 1 },
    onChange: t ? void 0 : hs
  }), t && game.settings.registerChange(
    T,
    js,
    hs
  ), Ba = rc(Ym()), hs(Ba), game.settings.register(T, Hs, {
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
    onChange: t ? void 0 : gs
  }), t && game.settings.registerChange(T, Hs, gs), Ua = Ku(Xu()), gs(Ua);
}
c(zm, "registerTimeTriggerSettings");
function ac() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return !!game.settings.get(T, Rs);
  } catch (e) {
    console.error(`${T} | Failed to read debug setting`, e);
  }
  return !1;
}
c(ac, "getDebugSetting");
function Gm() {
  return Ci = ac(), Ci;
}
c(Gm, "refreshDebugSettingCache");
function Wm() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return !!game.settings.get(T, qs);
  } catch (e) {
    console.error(`${T} | Failed to read manage time setting`, e);
  }
  return !1;
}
c(Wm, "getManageTimeSetting");
function Xu() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return game.settings.get(T, Hs) === "24h" ? "24h" : "12h";
  } catch (e) {
    console.error(`${T} | Failed to read time format setting`, e);
  }
  return "12h";
}
c(Xu, "getTimeFormatSetting");
function Ym() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get) {
      const e = game.settings.get(T, js);
      return rc(e);
    }
  } catch (e) {
    console.error(`${T} | Failed to read seconds-per-round setting`, e);
  }
  return na;
}
c(Ym, "getSecondsPerRoundSetting");
function Jm(t) {
  if (typeof t != "function")
    return () => {
    };
  Bs.add(t);
  try {
    t(Ci);
  } catch (e) {
    console.error(`${T} | Debug change handler failed`, e);
  }
  return () => {
    Bs.delete(t);
  };
}
c(Jm, "onDebugSettingChange");
function Qu(t) {
  if (typeof t != "function")
    return () => {
    };
  Us.add(t);
  try {
    t(Mr);
  } catch (e) {
    console.error(`${T} | Manage time change handler failed`, e);
  }
  return () => {
    Us.delete(t);
  };
}
c(Qu, "onManageTimeSettingChange");
function oc(t) {
  if (typeof t != "function")
    return () => {
    };
  zs.add(t);
  try {
    t(Ua);
  } catch (e) {
    console.error(`${T} | Time format change handler failed`, e);
  }
  return () => {
    zs.delete(t);
  };
}
c(oc, "onTimeFormatSettingChange");
function Km(t) {
  if (typeof t != "function")
    return () => {
    };
  Vs.add(t);
  try {
    t(Ba);
  } catch (e) {
    console.error(`${T} | Seconds-per-round change handler failed`, e);
  }
  return () => {
    Vs.delete(t);
  };
}
c(Km, "onSecondsPerRoundSettingChange");
let zo = !1, Gs = !1;
function Ws(t) {
  zo = !!t;
}
c(Ws, "updateDebugState");
function Zu() {
  Gs || (Gs = !0, Ws(ac()), Jm((t) => {
    Ws(t), console.info(`${T} | Debug ${zo ? "enabled" : "disabled"}`);
  }));
}
c(Zu, "ensureInitialized");
function sc() {
  return Gs || Zu(), zo;
}
c(sc, "shouldLog");
function ed(t) {
  if (!t.length)
    return [`${T} |`];
  const [e, ...n] = t;
  return typeof e == "string" ? [`${T} | ${e}`, ...n] : [`${T} |`, e, ...n];
}
c(ed, "formatArgs");
function Xm() {
  Zu();
}
c(Xm, "initializeDebug");
function Qm() {
  return Ws(Gm()), zo;
}
c(Qm, "syncDebugState");
function N(...t) {
  sc() && console.debug(...ed(t));
}
c(N, "debugLog");
function Qi(...t) {
  sc() && console.group(...ed(t));
}
c(Qi, "debugGroup");
function Pn() {
  sc() && console.groupEnd();
}
c(Pn, "debugGroupEnd");
function Ui(t) {
  var r;
  const e = (r = t == null ? void 0 : t.getFlag) == null ? void 0 : r.call(t, T, Yu);
  if (!e) return [];
  const n = Kt(e), i = Array.isArray(n) ? n : [];
  return N("Loaded time triggers", {
    sceneId: (t == null ? void 0 : t.id) ?? null,
    count: i.length
  }), i;
}
c(Ui, "getTimeTriggers");
async function td(t, e) {
  t != null && t.setFlag && (N("Persisting time triggers", {
    sceneId: t.id,
    count: Array.isArray(e) ? e.length : 0
  }), await t.setFlag(T, Yu, e));
}
c(td, "setTimeTriggers");
function Zm(t) {
  var r;
  const e = (r = t == null ? void 0 : t.getFlag) == null ? void 0 : r.call(t, T, Ea);
  if (!e) return {};
  const n = Kt(e);
  if (!n || typeof n != "object") return {};
  const i = {};
  for (const [a, o] of Object.entries(n))
    typeof o == "number" && Number.isFinite(o) && (i[a] = o);
  return N("Loaded time trigger history", {
    sceneId: (t == null ? void 0 : t.id) ?? null,
    keys: Object.keys(i)
  }), i;
}
c(Zm, "getTimeTriggerHistory");
async function ps(t, e) {
  var l, u, d, m;
  if (!t) return;
  const n = {};
  if (e && typeof e == "object")
    for (const [f, g] of Object.entries(e))
      typeof g == "number" && Number.isFinite(g) && (n[f] = g);
  const i = ((l = t.getFlag) == null ? void 0 : l.call(t, T, Ea)) ?? {}, r = {};
  if (i && typeof i == "object")
    for (const [f, g] of Object.entries(i))
      typeof g == "number" && Number.isFinite(g) && (r[f] = g);
  const a = Object.keys(n), o = Object.keys(r);
  if (typeof ((u = foundry == null ? void 0 : foundry.utils) == null ? void 0 : u.deepEqual) == "function" ? foundry.utils.deepEqual(r, n) : JSON.stringify(r) === JSON.stringify(n)) {
    N("Skip history update because state is unchanged", {
      sceneId: (t == null ? void 0 : t.id) ?? null
    });
    return;
  }
  N("Updating time trigger history", {
    sceneId: (t == null ? void 0 : t.id) ?? null,
    keys: a,
    removedKeys: o.filter((f) => !a.includes(f))
  });
  try {
    o.length && typeof t.unsetFlag == "function" && await t.unsetFlag(T, Ea), a.length && await t.setFlag(T, Ea, n);
  } catch (f) {
    console.error(`${T} | Failed to persist time trigger history`, f), (m = (d = ui.notifications) == null ? void 0 : d.error) == null || m.call(
      d,
      E(
        "EIDOLON.TimeTrigger.HistoryPersistError",
        "Failed to persist the scene's time trigger history."
      )
    );
  }
}
c(ps, "updateTimeTriggerHistory");
const Va = /* @__PURE__ */ new Map(), jc = /* @__PURE__ */ new Set();
function eh(t) {
  if (!(t != null && t.id))
    throw new Error(`${T} | Action definitions require an id.`);
  if (Va.has(t.id))
    throw new Error(`${T} | Duplicate time trigger action id: ${t.id}`);
  Va.set(t.id, {
    ...t
  }), N("Registered time trigger action", { actionId: t.id });
}
c(eh, "registerAction");
function ia(t) {
  return Va.get(t) ?? null;
}
c(ia, "getAction");
function th(t) {
  const e = ia(t);
  return e ? typeof e.label == "function" ? e.label() : e.label : t;
}
c(th, "getActionLabel");
function Bc() {
  return Array.from(Va.values());
}
c(Bc, "listActions");
async function nd(t, e) {
  var i, r;
  const n = ia(e == null ? void 0 : e.action);
  if (!n || typeof n.execute != "function") {
    const a = E(
      "EIDOLON.TimeTrigger.UnknownAction",
      "Encountered an unknown time trigger action and skipped it."
    );
    (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, a), console.warn(`${T} | Unknown time trigger action`, e), N("Encountered unknown time trigger action", {
      triggerId: (e == null ? void 0 : e.id) ?? null,
      actionId: (e == null ? void 0 : e.action) ?? null
    });
    return;
  }
  N("Executing action handler", {
    actionId: n.id,
    triggerId: (e == null ? void 0 : e.id) ?? null,
    sceneId: (t == null ? void 0 : t.id) ?? null
  }), await n.execute({ scene: t, trigger: e });
}
c(nd, "executeTriggerAction");
function nh(t) {
  const e = ia(t == null ? void 0 : t.action);
  return !e || typeof e.buildSummaryParts != "function" ? [] : e.buildSummaryParts({ trigger: t, escapeHtml: Pt, localize: E }) ?? [];
}
c(nh, "buildActionSummaryParts");
function ih(t) {
  const e = ia(t == null ? void 0 : t.action);
  return !e || typeof e.buildFormContent != "function" ? "" : e.buildFormContent({ trigger: t, escapeHtml: Pt, localize: E }) ?? "";
}
c(ih, "buildActionFormSection");
function rh(t, e) {
  const n = ia(t == null ? void 0 : t.action);
  !n || typeof n.prepareFormData != "function" || n.prepareFormData({ trigger: t, formData: e });
}
c(rh, "applyActionFormData");
function ah(t, e, n) {
  var a, o;
  const i = `${(t == null ? void 0 : t.id) ?? "unknown"}:${(e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.action) ?? "unknown"}:${n}`;
  if (jc.has(i)) return;
  jc.add(i);
  const r = E(
    "EIDOLON.TimeTrigger.MissingDataWarning",
    "A scene time trigger is missing required data and was skipped."
  );
  (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, r), console.warn(`${T} | Missing trigger data (${n})`, { scene: t == null ? void 0 : t.id, trigger: e });
}
c(ah, "warnMissingTriggerData");
async function oh({ scene: t, trigger: e }) {
  var a, o, s, l, u;
  const n = (s = (o = (a = e == null ? void 0 : e.data) == null ? void 0 : a.path) == null ? void 0 : o.trim) == null ? void 0 : s.call(o);
  if (!n) {
    ah(t, e, "missing-audio-path");
    return;
  }
  const i = {
    src: n,
    autoplay: !0,
    loop: !1
  }, r = (() => {
    var d, m, f, g, p;
    return typeof ((m = (d = foundry == null ? void 0 : foundry.audio) == null ? void 0 : d.AudioHelper) == null ? void 0 : m.play) == "function" ? foundry.audio.AudioHelper.play(i, !0) : typeof ((g = (f = game == null ? void 0 : game.audio) == null ? void 0 : f.constructor) == null ? void 0 : g.play) == "function" ? game.audio.constructor.play(i, !0) : typeof ((p = game == null ? void 0 : game.audio) == null ? void 0 : p.play) == "function" ? game.audio.play(i, !0) : null;
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
c(oh, "executePlaySoundAction");
eh({
  id: Ca,
  label: /* @__PURE__ */ c(() => E("EIDOLON.TimeTrigger.ActionPlaySound", "Play Sound"), "label"),
  execute: oh,
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
var ju;
const { ApplicationV2: Wn, HandlebarsApplicationMixin: Yn } = ((ju = foundry.applications) == null ? void 0 : ju.api) ?? {};
if (!Wn || !Yn)
  throw new Error(
    `${T} | ApplicationV2 API unavailable. Update Foundry VTT to v13 or newer.`
  );
const qn = "AM", Si = "PM";
function Rn() {
  return Xu();
}
c(Rn, "getConfiguredTimeFormat");
function Go(t) {
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
c(Go, "parseCanonicalTimeString");
function Gt({ hours: t, minutes: e, seconds: n }) {
  if (!Number.isInteger(t) || !Number.isInteger(e) || t < 0 || t > 23 || e < 0 || e > 59) return null;
  const i = String(t).padStart(2, "0"), r = String(e).padStart(2, "0");
  if (Number.isInteger(n)) {
    if (n < 0 || n > 59) return null;
    const a = String(n).padStart(2, "0");
    return `${i}:${r}:${a}`;
  }
  return `${i}:${r}`;
}
c(Gt, "formatCanonicalTime");
function sh(t, { format: e } = {}) {
  if (!t || typeof t != "object") return null;
  const n = Number(t.hour), i = Number(t.minute), r = t.second !== void 0 && t.second !== null, a = r ? Number(t.second) : null, o = r && Number.isFinite(a) ? Math.floor(Math.max(0, Math.min(59, a))) : null;
  if (!Number.isFinite(n) || !Number.isFinite(i)) return null;
  const s = e ?? Rn();
  return za(
    {
      hours: n,
      minutes: i,
      seconds: o
    },
    s
  );
}
c(sh, "formatTimeComponentsForDisplay");
function lh(t, { format: e } = {}) {
  const n = Go(t);
  if (!n) return "";
  const i = e ?? Rn();
  return za(n, i);
}
c(lh, "formatTriggerTimeForDisplay");
function za(t, e = "12h") {
  if (!t) return "";
  const { hours: n, minutes: i, seconds: r = null } = t;
  if (!Number.isInteger(n) || !Number.isInteger(i)) return "";
  const a = Number.isInteger(r);
  if (e === "24h") {
    const f = `${String(n).padStart(2, "0")}:${String(i).padStart(2, "0")}`;
    return a ? `${f}:${String(r).padStart(2, "0")}` : f;
  }
  const o = n >= 12 ? Si : qn, s = n % 12 === 0 ? 12 : n % 12, l = String(s), u = String(i).padStart(2, "0"), d = `${l}:${u}`, m = o === qn ? E("EIDOLON.TimeTrigger.TimePeriodAM", qn) : E("EIDOLON.TimeTrigger.TimePeriodPM", Si);
  if (a) {
    const f = String(r).padStart(2, "0");
    return `${d}:${f} ${m}`;
  }
  return `${d} ${m}`;
}
c(za, "formatTimeParts");
function Uc(t, e = Rn()) {
  const n = Go(t);
  if (e === "24h")
    return {
      format: e,
      canonical: n ? Gt(n) ?? "" : "",
      hour: n ? String(n.hours).padStart(2, "0") : "",
      minute: n ? String(n.minutes).padStart(2, "0") : ""
    };
  if (!n)
    return {
      format: e,
      canonical: "",
      hour: "",
      minute: "",
      period: qn
    };
  const i = n.hours >= 12 ? Si : qn, r = n.hours % 12 === 0 ? 12 : n.hours % 12;
  return {
    format: e,
    canonical: Gt(n) ?? "",
    hour: String(r),
    minute: String(n.minutes).padStart(2, "0"),
    period: i
  };
}
c(Uc, "getTimeFormValues");
function ch({ hour: t, minute: e, period: n, time: i }, r = Rn()) {
  if (r === "24h") {
    const g = typeof t == "string" ? t.trim() : "", p = typeof e == "string" ? e.trim() : "", y = typeof i == "string" ? i.trim() : "";
    if (!g && !p && y) {
      const S = Go(y);
      return S ? { canonical: Gt(S) ?? "", error: null } : {
        canonical: "",
        error: E(
          "EIDOLON.TimeTrigger.TimeFormatInvalid24",
          "Enter a valid time in HH:MM format."
        )
      };
    }
    if (!g || !p)
      return {
        canonical: "",
        error: E("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.")
      };
    const b = Number(g), v = Number(p);
    return !Number.isInteger(b) || b < 0 || b > 23 ? {
      canonical: "",
      error: E(
        "EIDOLON.TimeTrigger.TimeFormatInvalid24",
        "Enter a valid time in HH:MM format."
      )
    } : !Number.isInteger(v) || v < 0 || v > 59 ? {
      canonical: "",
      error: E(
        "EIDOLON.TimeTrigger.TimeFormatInvalid24",
        "Enter a valid time in HH:MM format."
      )
    } : { canonical: Gt({
      hours: b,
      minutes: v
    }) ?? "", error: null };
  }
  const a = typeof t == "string" ? t.trim() : "", o = typeof e == "string" ? e.trim() : "", s = typeof n == "string" ? n.trim().toUpperCase() : "";
  if (!a || !o || !s)
    return { canonical: "", error: E("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.") };
  if (s !== qn && s !== Si)
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
  const d = l % 12, f = {
    hours: s === Si ? d + 12 : d,
    minutes: u
  };
  return {
    canonical: Gt(f) ?? "",
    error: null
  };
}
c(ch, "normalizeFormTimeInput");
function uh() {
  return [
    {
      value: qn,
      label: E("EIDOLON.TimeTrigger.TimePeriodAM", qn)
    },
    {
      value: Si,
      label: E("EIDOLON.TimeTrigger.TimePeriodPM", Si)
    }
  ];
}
c(uh, "getPeriodOptions");
var oi, si, re, id, po, yo, rd, Js, Ks, bo, vo, ad, od, sd, Xs, Qs, Zs, wo, Eo, el, Co, ld, cd;
const ri = class ri extends Yn(Wn) {
  constructor(n = {}) {
    var o;
    const { scene: i, showControls: r, ...a } = n ?? {};
    super(a);
    k(this, re);
    k(this, oi, null);
    k(this, si, null);
    k(this, po, /* @__PURE__ */ c((n) => {
      var r, a;
      n.preventDefault();
      const i = Number((a = (r = n.currentTarget) == null ? void 0 : r.dataset) == null ? void 0 : a.delta);
      Number.isFinite(i) && (N("Time delta button clicked", { delta: i }), this._advanceTime(i));
    }, "#onDeltaClick"));
    k(this, yo, /* @__PURE__ */ c((n) => {
      var i, r;
      n.preventDefault(), !(!this.showControls || !((i = game.user) != null && i.isGM)) && (N("Time value double clicked", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null }), C(this, re, rd).call(this));
    }, "#onTimeDoubleClick"));
    k(this, bo, /* @__PURE__ */ c((n) => {
      if (this.isEditingTime && !this._commitTimeInProgress)
        if (n.key === "Enter") {
          n.preventDefault();
          const i = n.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
          C(this, re, Ks).call(this, r);
        } else n.key === "Escape" && (n.preventDefault(), C(this, re, Js).call(this));
    }, "#onTimeInputKeydown"));
    k(this, vo, /* @__PURE__ */ c((n) => {
      if (!this.isEditingTime || this._commitTimeInProgress || this._suppressBlurCommit) return;
      const i = n.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
      C(this, re, Ks).call(this, r);
    }, "#onTimeInputBlur"));
    k(this, wo, /* @__PURE__ */ c((n) => {
      const i = !!n;
      if (this.manageTimeEnabled === i) return;
      this.manageTimeEnabled = i, (this.rendered ?? this.isRendered ?? !1) && this.render({ force: !0 });
    }, "#handleManageTimeChange"));
    k(this, Eo, /* @__PURE__ */ c(async (n) => {
      var a, o, s, l, u, d, m, f, g;
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
        await i.setFlag(T, Ps, r), this.sceneAllowsRealTime = r;
        const p = r ? E(
          "EIDOLON.TimeTrigger.SceneRealTimeEnabled",
          "Automatic real-time flow enabled for this scene."
        ) : E(
          "EIDOLON.TimeTrigger.SceneRealTimeDisabled",
          "Automatic real-time flow disabled for this scene."
        );
        (m = (d = ui.notifications) == null ? void 0 : d.info) == null || m.call(d, p);
      } catch (p) {
        console.error(`${T} | Failed to toggle scene real-time flow`, p), (g = (f = ui.notifications) == null ? void 0 : f.error) == null || g.call(
          f,
          E(
            "EIDOLON.TimeTrigger.SceneRealTimeToggleError",
            "Failed to update the scene's real-time flow setting."
          )
        );
      } finally {
        this.render({ force: !0 });
      }
    }, "#onRealTimeToggleClick"));
    k(this, Co, /* @__PURE__ */ c(() => {
      (this.rendered ?? this.isRendered ?? !1) && (this.isEditingTime && (this.editValue = C(this, re, Xs).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    this.scene = i ?? null, this.showControls = typeof r == "boolean" ? r : !!((o = game.user) != null && o.isGM), this.isEditingTime = !1, this.editValue = "", this._commitTimeInProgress = !1, this._suppressBlurCommit = !1, this.manageTimeEnabled = !1, this.sceneAllowsRealTime = C(this, re, el).call(this), L(this, oi, oc(h(this, Co))), L(this, si, Qu(h(this, wo)));
  }
  async _prepareContext() {
    var v, w;
    const n = ((v = game.time) == null ? void 0 : v.components) ?? {}, r = ((n == null ? void 0 : n.second) !== void 0 && (n == null ? void 0 : n.second) !== null ? sh(n) : null) ?? C(this, re, id).call(this), a = Rn(), o = a === "24h", s = o ? E("EIDOLON.TimeTrigger.EditTimePlaceholder24", "HH:MM") : E("EIDOLON.TimeTrigger.EditTimePlaceholder12", "HH:MM AM/PM"), l = this.showControls ? E(
      "EIDOLON.TimeTrigger.EditTimeHint",
      "Double-click to set a specific time."
    ) : "", u = this.showControls ? E(
      "EIDOLON.TimeTrigger.EditTimeLabel",
      "New time (HH:MM or HH:MM AM/PM)"
    ) : "", d = Um.map((S) => ({
      minutes: S,
      label: S > 0 ? `+${S}` : `${S}`
    })), m = !!this.manageTimeEnabled, f = C(this, re, el).call(this);
    this.sceneAllowsRealTime = f;
    const g = E(
      "EIDOLON.TimeTrigger.SceneRealTimeEnable",
      "Enable automatic real-time flow for this scene."
    ), p = E(
      "EIDOLON.TimeTrigger.SceneRealTimeDisable",
      "Disable automatic real-time flow for this scene."
    ), y = E(
      "EIDOLON.TimeTrigger.SceneRealTimeManageDisabled",
      "Enable Manage Time in module settings to allow automatic real-time flow."
    );
    return {
      formattedTime: r,
      deltas: d,
      manageTimeEnabled: m,
      sceneAllowsRealTime: f,
      realTimeButtonLabel: m ? f ? p : g : y,
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
      return (this.rendered ?? this.isRendered ?? !1) || (N("TimeTriggerWindow close request rerendering", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null
      }), this.render({ force: !0 })), this;
    N("Closing time trigger window", { sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null, force: !0 });
    const i = await super.close(n);
    return C(this, re, ld).call(this), C(this, re, cd).call(this), i;
  }
  async _advanceTime(n) {
    var r, a, o, s, l, u, d;
    const i = n * 60;
    if (N("Advancing world time", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null, minutes: n, seconds: i }), !((a = game.user) != null && a.isGM)) {
      (s = (o = ui.notifications) == null ? void 0 : o.warn) == null || s.call(o, E("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time."));
      return;
    }
    try {
      await game.time.advance(i);
    } catch (m) {
      console.error(`${T} | Failed to advance time`, m), (u = (l = ui.notifications) == null ? void 0 : l.error) == null || u.call(
        l,
        E("EIDOLON.TimeTrigger.Error", "Failed to update the world time.")
      ), N("Failed to advance time from window", {
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
        N("Binding time trigger interactions", {
          sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
          buttonCount: r.querySelectorAll("[data-delta]").length
        }), r.querySelectorAll("[data-delta]").forEach((u) => {
          u.addEventListener("click", h(this, po));
        });
        const o = r.querySelector('.time-trigger-window__time-value[data-editable="true"]');
        o && o.addEventListener("dblclick", h(this, yo), { once: !1 });
        const s = r.querySelector(".time-trigger-window__time-input");
        s && (s.addEventListener("keydown", h(this, bo)), s.addEventListener("blur", h(this, vo)), typeof s.focus == "function" && (s.focus(), typeof s.select == "function" && s.select()));
        const l = r.querySelector('[data-action="toggle-real-time"]');
        l && l.addEventListener("click", h(this, Eo));
      }
      this._suppressBlurCommit = !1;
    }
  }
};
oi = new WeakMap(), si = new WeakMap(), re = new WeakSet(), id = /* @__PURE__ */ c(function() {
  var l;
  const n = (l = game.time) == null ? void 0 : l.worldTime;
  if (typeof n != "number" || !Number.isFinite(n)) return "";
  const i = 1440 * 60, r = (Math.floor(n) % i + i) % i, a = Math.floor(r / 3600), o = Math.floor(r % 3600 / 60), s = r % 60;
  return za({ hours: a, minutes: o, seconds: s }, Rn());
}, "#formatFallbackTime"), po = new WeakMap(), yo = new WeakMap(), rd = /* @__PURE__ */ c(function() {
  var n;
  (n = game.user) != null && n.isGM && (this.isEditingTime = !0, this._suppressBlurCommit = !1, this.editValue = C(this, re, Xs).call(this), this.render({ force: !0 }));
}, "#enterTimeEditMode"), Js = /* @__PURE__ */ c(function() {
  this.isEditingTime = !1, this.editValue = "", this._suppressBlurCommit = !1, this.render({ force: !0 });
}, "#cancelTimeEdit"), Ks = /* @__PURE__ */ c(async function(n) {
  var a, o, s;
  if (!((a = game.user) != null && a.isGM) || !this.isEditingTime || this._commitTimeInProgress) return;
  this._commitTimeInProgress = !0;
  const i = typeof n == "string" ? n.trim() : "";
  if (!i) {
    C(this, re, Js).call(this), this._commitTimeInProgress = !1;
    return;
  }
  const r = C(this, re, sd).call(this, i);
  if (r.error) {
    (s = (o = ui.notifications) == null ? void 0 : o.error) == null || s.call(o, r.error), this._suppressBlurCommit = !0, this.editValue = i, this.render({ force: !0 }), this._commitTimeInProgress = !1;
    return;
  }
  try {
    await C(this, re, od).call(this, r.seconds, r.includeSeconds) ? (this.isEditingTime = !1, this.editValue = "", this.render({ force: !0 })) : (this.editValue = i, this.render({ force: !0 }));
  } finally {
    this._commitTimeInProgress = !1;
  }
}, "#commitTimeInput"), bo = new WeakMap(), vo = new WeakMap(), ad = /* @__PURE__ */ c(function() {
  var u, d;
  const n = (u = game.time) == null ? void 0 : u.worldTime;
  if (typeof n != "number" || !Number.isFinite(n))
    return "";
  const i = ((d = game.time) == null ? void 0 : d.components) ?? {}, r = Number(i.hour), a = Number(i.minute), o = i.second !== void 0 ? Number(i.second) : null, s = Number.isInteger(o);
  return (Number.isFinite(r) && Number.isFinite(a) ? Gt({
    hours: Math.max(0, Math.min(23, Number(r))),
    minutes: Math.max(0, Math.min(59, Number(a))),
    seconds: s && Number.isFinite(o) ? Math.max(0, Math.min(59, Number(o))) : void 0
  }) ?? "" : "") ?? "";
}, "#getCurrentCanonicalTime"), od = /* @__PURE__ */ c(async function(n, i) {
  var f, g, p, y, b, v, w, S, I, A;
  const r = (f = game.time) == null ? void 0 : f.worldTime;
  if (typeof r != "number" || !Number.isFinite(r))
    return (p = (g = ui.notifications) == null ? void 0 : g.error) == null || p.call(
      g,
      E(
        "EIDOLON.TimeTrigger.EditTimeUnavailable",
        "The world time is unavailable, so it can't be updated."
      )
    ), !1;
  if (!Number.isInteger(n) || n < 0 || n >= Bi)
    return (b = (y = ui.notifications) == null ? void 0 : y.error) == null || b.call(
      y,
      E(
        "EIDOLON.TimeTrigger.EditTimeInvalidRange",
        "Enter a time within the current day."
      )
    ), !1;
  const s = Math.floor(r / Bi) * Bi + n - r;
  if (!Number.isFinite(s) || s === 0)
    return !0;
  const l = Math.floor(n / 3600), u = Math.floor(n % 3600 / 60), d = n % 60, m = Gt({
    hours: l,
    minutes: u,
    seconds: i ? d : void 0
  });
  try {
    N("Updating world time directly", {
      sceneId: ((v = this.scene) == null ? void 0 : v.id) ?? null,
      targetCanonical: m ?? null,
      diff: s
    }), await game.time.advance(s);
    const O = za(
      {
        hours: l,
        minutes: u,
        seconds: i ? d : null
      },
      Rn()
    );
    (S = (w = ui.notifications) == null ? void 0 : w.info) == null || S.call(
      w,
      E(
        "EIDOLON.TimeTrigger.EditTimeSuccess",
        "World time updated."
      ) + (O ? ` ${O}` : "")
    );
  } catch (O) {
    return console.error(`${T} | Failed to set world time`, O), (A = (I = ui.notifications) == null ? void 0 : I.error) == null || A.call(
      I,
      E(
        "EIDOLON.TimeTrigger.EditTimeError",
        "Failed to update the world time."
      )
    ), !1;
  }
  return !0;
}, "#applyTargetSeconds"), sd = /* @__PURE__ */ c(function(n) {
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
    const f = Number(a[1]), g = Number(a[2]), p = a[3] !== void 0 ? Number(a[3]) : void 0;
    if (Number.isInteger(f) && f >= 0 && f <= 23 && Number.isInteger(g) && g >= 0 && g <= 59 && (p === void 0 || Number.isInteger(p) && p >= 0 && p <= 59)) {
      const y = f * 3600 + g * 60 + (p ?? 0);
      return {
        canonical: Gt({ hours: f, minutes: g, seconds: p }),
        seconds: y,
        includeSeconds: p !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const { amLower: o, pmLower: s, periodPattern: l } = C(this, re, Qs).call(this), u = r.match(
    new RegExp(
      `^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?\\s*(${l})$`,
      "i"
    )
  );
  if (u) {
    let f = Number(u[1]);
    const g = Number(u[2]), p = u[3] !== void 0 ? Number(u[3]) : void 0, y = u[4] ?? "", b = typeof y == "string" ? ((m = y.toLocaleLowerCase) == null ? void 0 : m.call(y)) ?? y.toLowerCase() : "";
    if (Number.isInteger(f) && f >= 1 && f <= 12 && Number.isInteger(g) && g >= 0 && g <= 59 && (p === void 0 || Number.isInteger(p) && p >= 0 && p <= 59) && (b === o || b === s || b === "am" || b === "pm")) {
      f = f % 12, (b === s || b === "pm") && (f += 12);
      const w = f * 3600 + g * 60 + (p ?? 0);
      return {
        canonical: Gt({ hours: f, minutes: g, seconds: p }),
        seconds: w,
        includeSeconds: p !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const d = Ju(r);
  if (d !== null) {
    const f = Math.floor(d / 3600), g = Math.floor(d % 3600 / 60), p = d % 60, y = p !== 0;
    return {
      canonical: Gt({
        hours: f,
        minutes: g,
        seconds: y ? p : void 0
      }),
      seconds: d,
      includeSeconds: y,
      error: null
    };
  }
  return { error: i };
}, "#parseInputTime"), Xs = /* @__PURE__ */ c(function() {
  const n = C(this, re, ad).call(this);
  if (!n) return "";
  if (Rn() === "24h")
    return n;
  const r = Go(n);
  if (!r) return n;
  const a = Number(r.hours), o = Number(r.minutes), s = r.seconds !== null && r.seconds !== void 0 ? Number(r.seconds) : void 0;
  if (!Number.isFinite(a) || !Number.isFinite(o)) return n;
  const l = Number.isFinite(s), u = a % 12 === 0 ? 12 : a % 12, d = String(o).padStart(2, "0"), m = l ? `:${String(s).padStart(2, "0")}` : "", { amLabel: f, pmLabel: g } = C(this, re, Qs).call(this), p = a >= 12 ? g : f;
  return `${u}:${d}${m} ${p}`.trim();
}, "#getInitialEditValue"), Qs = /* @__PURE__ */ c(function() {
  var u, d;
  const n = E("EIDOLON.TimeTrigger.TimePeriodAM", "AM"), i = E("EIDOLON.TimeTrigger.TimePeriodPM", "PM"), r = ((u = n.toLocaleLowerCase) == null ? void 0 : u.call(n)) ?? n.toLowerCase(), a = ((d = i.toLocaleLowerCase) == null ? void 0 : d.call(i)) ?? i.toLowerCase(), o = C(this, re, Zs).call(this, n), s = C(this, re, Zs).call(this, i), l = `${o}|${s}|AM|PM`;
  return {
    amLabel: n,
    pmLabel: i,
    amLower: r,
    pmLower: a,
    periodPattern: l
  };
}, "#getPeriodMatchData"), Zs = /* @__PURE__ */ c(function(n) {
  return typeof n != "string" ? "" : n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}, "#escapeForRegex"), wo = new WeakMap(), Eo = new WeakMap(), el = /* @__PURE__ */ c(function() {
  const n = this.scene;
  if (!n || typeof n.getFlag != "function") return !1;
  try {
    return !!n.getFlag(T, Ps);
  } catch (i) {
    N("TimeTriggerWindow | Failed to read scene real-time flag", {
      sceneId: (n == null ? void 0 : n.id) ?? null,
      message: (i == null ? void 0 : i.message) ?? String(i)
    });
  }
  return !1;
}, "#readSceneRealTimeFlag"), Co = new WeakMap(), ld = /* @__PURE__ */ c(function() {
  if (typeof h(this, oi) == "function")
    try {
      h(this, oi).call(this);
    } catch (n) {
      console.error(`${T} | Failed to dispose time format subscription`, n);
    }
  L(this, oi, null);
}, "#disposeTimeFormatSubscription"), cd = /* @__PURE__ */ c(function() {
  if (typeof h(this, si) == "function")
    try {
      h(this, si).call(this);
    } catch (n) {
      console.error(`${T} | Failed to dispose manage time subscription`, n);
    }
  L(this, si, null);
}, "#disposeManageTimeSubscription"), c(ri, "TimeTriggerWindow"), be(ri, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  He(ri, ri, "DEFAULT_OPTIONS"),
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
)), be(ri, "PARTS", {
  content: {
    template: `modules/${T}/templates/time-trigger.html`
  }
});
let Ys = ri;
function Wo(t, e = {}) {
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
c(Wo, "createApplicationFactory");
const Vc = /* @__PURE__ */ new Set();
var Se, Ze, li, nr, ud, dd;
const kc = class kc {
  constructor({ windowFactory: e } = {}) {
    k(this, nr);
    k(this, Se, null);
    k(this, Ze, null);
    k(this, li);
    const n = Wo(Ys);
    typeof e == "function" ? e.__eidolonFactorySignature === "options" ? L(this, li, (r, a = {}) => e({ scene: r, ...a ?? {} })) : L(this, li, e) : L(this, li, /* @__PURE__ */ c((r, a = {}) => n({ scene: r, ...a ?? {} }), "fallbackFactory"));
  }
  onReady() {
    var n;
    const e = typeof ((n = game.time) == null ? void 0 : n.worldTime) == "number" && Number.isFinite(game.time.worldTime) ? game.time.worldTime : null;
    N("TimeTriggerManager#onReady", { worldTime: e }), e !== null && L(this, Ze, e);
  }
  onCanvasReady(e) {
    const n = (e == null ? void 0 : e.scene) ?? mr();
    N("TimeTriggerManager#onCanvasReady", { sceneId: (n == null ? void 0 : n.id) ?? null }), this.refreshTimeTriggerWindow(n), this.handleTimeTriggerEvaluation(n);
  }
  onUpdateScene(e) {
    const n = mr();
    N("TimeTriggerManager#onUpdateScene", {
      sceneId: (e == null ? void 0 : e.id) ?? null,
      activeSceneId: (n == null ? void 0 : n.id) ?? null
    }), !(!n || e.id !== n.id) && (this.refreshTimeTriggerWindow(e), this.handleTimeTriggerEvaluation(e));
  }
  onUpdateWorldTime(e, n) {
    N("TimeTriggerManager#onUpdateWorldTime", {
      worldTime: e,
      diff: n,
      hasWindow: !!h(this, Se)
    }), h(this, Se) && h(this, Se).render();
    const i = mr(), r = C(this, nr, ud).call(this, e, n);
    this.handleTimeTriggerEvaluation(i, e, r);
  }
  refreshTimeTriggerWindow(e) {
    var l, u, d;
    if (!e) return;
    const n = !!((l = game.user) != null && l.isGM), i = !!e.getFlag(T, ja), r = !!e.getFlag(T, Fs), a = !!e.getFlag(T, Ds);
    if (N("TimeTriggerManager#refreshTimeTriggerWindow", {
      sceneId: e.id,
      isGM: n,
      isActive: i,
      hideWindow: r,
      showPlayerWindow: a
    }), !(i && !r && (n || a))) {
      h(this, Se) && (N("Closing time trigger window", { reason: "not-visible" }), h(this, Se).close({ force: !0 }), L(this, Se, null));
      return;
    }
    const s = !!n;
    if (h(this, Se) && ((u = h(this, Se).scene) == null ? void 0 : u.id) === e.id) {
      N("Refreshing existing time trigger window", { sceneId: e.id }), h(this, Se).showControls = s, h(this, Se).render();
      return;
    }
    h(this, Se) && (N("Closing existing window before creating new instance", {
      previousSceneId: ((d = h(this, Se).scene) == null ? void 0 : d.id) ?? null
    }), h(this, Se).close({ force: !0 })), L(this, Se, h(this, li).call(this, e, { showControls: s })), N("Rendering new time trigger window", { sceneId: e.id }), h(this, Se).render({ force: !0 });
  }
  async handleTimeTriggerEvaluation(e, n, i) {
    var l;
    const r = e ?? mr();
    if (!r) {
      N("handleTimeTriggerEvaluation skipped", {
        reason: "no-active-scene",
        providedSceneId: (e == null ? void 0 : e.id) ?? null,
        currentWorldTime: n
      }), typeof n == "number" && Number.isFinite(n) && L(this, Ze, n);
      return;
    }
    const a = typeof n == "number" && Number.isFinite(n) ? n : typeof ((l = game.time) == null ? void 0 : l.worldTime) == "number" ? game.time.worldTime : null;
    if (a === null) return;
    const o = typeof i == "number" && Number.isFinite(i) ? i : null, s = o !== null ? o : typeof h(this, Ze) == "number" && Number.isFinite(h(this, Ze)) ? h(this, Ze) : a;
    Qi("handleTimeTriggerEvaluation", {
      sceneId: r.id,
      previousWorldTime: s,
      currentWorldTime: a,
      overrideProvided: o !== null
    });
    try {
      await C(this, nr, dd).call(this, r, s, a);
    } catch (u) {
      console.error(`${T} | Unexpected error while evaluating time triggers`, u), N("handleTimeTriggerEvaluation error", { message: (u == null ? void 0 : u.message) ?? String(u) });
    } finally {
      L(this, Ze, a), Pn();
    }
  }
};
Se = new WeakMap(), Ze = new WeakMap(), li = new WeakMap(), nr = new WeakSet(), ud = /* @__PURE__ */ c(function(e, n) {
  return typeof h(this, Ze) == "number" && Number.isFinite(h(this, Ze)) ? (N("Resolved previous world time from cache", {
    previousWorldTime: h(this, Ze)
  }), h(this, Ze)) : typeof e == "number" && Number.isFinite(e) && typeof n == "number" && Number.isFinite(n) ? (N("Resolved previous world time using diff", {
    worldTime: e,
    diff: n,
    resolved: e - n
  }), e - n) : typeof e == "number" && Number.isFinite(e) ? e : null;
}, "#resolvePreviousWorldTime"), dd = /* @__PURE__ */ c(async function(e, n, i) {
  var p, y, b;
  if (!((p = game.user) != null && p.isGM)) {
    N("Skipping trigger evaluation because user is not a GM");
    return;
  }
  if (!(e != null && e.id)) {
    N("Skipping trigger evaluation because the scene is missing an id");
    return;
  }
  if (!!!e.getFlag(T, ja)) {
    N("Skipping trigger evaluation because scene is inactive", { sceneId: e.id });
    return;
  }
  if (typeof i != "number" || !Number.isFinite(i)) return;
  (typeof n != "number" || !Number.isFinite(n)) && (n = i);
  const a = Ui(e);
  if (!a.length) {
    N("No time triggers configured for scene", { sceneId: e.id });
    return;
  }
  const o = Zm(e), s = /* @__PURE__ */ new Set();
  for (const v of a)
    v != null && v.id && s.add(v.id);
  let l = !1;
  for (const v of Object.keys(o))
    s.has(v) || (delete o[v], l = !0);
  if (Qi("Evaluating scene time triggers", {
    sceneId: e.id,
    previousWorldTime: n,
    currentWorldTime: i,
    triggerCount: a.length
  }), i <= n) {
    N("Detected world time rewind", {
      previousWorldTime: n,
      currentWorldTime: i
    });
    for (const v of a) {
      if (!(v != null && v.id) || !v.allowReplayOnRewind) continue;
      const w = o[v.id];
      typeof w == "number" ? i < w ? (N("Clearing trigger history due to rewind", {
        triggerId: v.id,
        lastFired: w,
        currentWorldTime: i
      }), delete o[v.id], l = !0) : N("Preserving trigger history after rewind", {
        triggerId: v.id,
        lastFired: w,
        currentWorldTime: i
      }) : N("No history stored for rewind-enabled trigger", {
        triggerId: v.id
      });
    }
    l && (N("Persisting history cleanup after rewind", {
      sceneId: e.id
    }), await ps(e, o)), Pn();
    return;
  }
  const u = n, d = i, m = [], f = Math.floor(u / Bi), g = Math.floor(d / Bi);
  for (const v of a) {
    if (!(v != null && v.id)) continue;
    const w = Ju(v.time);
    if (w === null) {
      dh(e, v), N("Skipping trigger with invalid time", {
        triggerId: v.id,
        time: v.time
      });
      continue;
    }
    for (let S = f; S <= g; S++) {
      const I = S * Bi + w;
      if (I < u || I > d) continue;
      const O = o[v.id];
      if (typeof O == "number" && O >= I) {
        N("Skipping trigger because it already fired within window", {
          triggerId: v.id,
          lastFired: O,
          absoluteTime: I
        });
        continue;
      }
      m.push({ trigger: v, absoluteTime: I });
    }
  }
  if (!m.length) {
    l && await ps(e, o), N("No triggers scheduled to fire within evaluation window", {
      sceneId: e.id
    }), Pn();
    return;
  }
  m.sort((v, w) => v.absoluteTime - w.absoluteTime), N("Queued triggers for execution", {
    entries: m.map((v) => ({
      triggerId: v.trigger.id,
      absoluteTime: v.absoluteTime
    }))
  });
  for (const v of m)
    try {
      N("Executing time trigger action", {
        triggerId: v.trigger.id,
        absoluteTime: v.absoluteTime
      }), await nd(e, v.trigger);
    } catch (w) {
      console.error(`${T} | Failed to execute time trigger action`, w), (b = (y = ui.notifications) == null ? void 0 : y.error) == null || b.call(
        y,
        E(
          "EIDOLON.TimeTrigger.TriggerActionError",
          "Failed to execute a scene time trigger action. Check the console for details."
        )
      ), N("Trigger execution failed", {
        triggerId: v.trigger.id,
        message: (w == null ? void 0 : w.message) ?? String(w)
      });
    } finally {
      o[v.trigger.id] = v.absoluteTime, l = !0, N("Recorded trigger execution", {
        triggerId: v.trigger.id,
        absoluteTime: v.absoluteTime
      });
    }
  l && (N("Persisting trigger history updates", { sceneId: e.id }), await ps(e, o)), Pn();
}, "#evaluateSceneTimeTriggers"), c(kc, "TimeTriggerManager");
let tl = kc;
function dh(t, e) {
  var r, a;
  const n = `${(t == null ? void 0 : t.id) ?? "unknown"}:${(e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.time) ?? "unknown"}`;
  if (Vc.has(n)) return;
  Vc.add(n);
  const i = E(
    "EIDOLON.TimeTrigger.InvalidTimeWarning",
    "A scene time trigger has an invalid time value and was skipped."
  );
  (a = (r = ui.notifications) == null ? void 0 : r.warn) == null || a.call(r, i), console.warn(`${T} | Invalid time for trigger`, { scene: t == null ? void 0 : t.id, trigger: e });
}
c(dh, "warnInvalidTriggerTime");
var Ot, Pr, At, Tn, ci, Ut, Yi, So, To, Rr, Hr, di, Vt, z, il, Ni, Sa, rl, Ta, al, jt, fd, ol, md, sl, hd, Lo, Io, Oo, Ao, ko, Mo, ll, gd, La, _o, No;
const Mc = class Mc {
  constructor() {
    k(this, z);
    k(this, Ot, !1);
    k(this, Pr, na);
    k(this, At, /* @__PURE__ */ new Map());
    k(this, Tn, null);
    k(this, ci, null);
    k(this, Ut, 0);
    k(this, Yi, null);
    k(this, So, null);
    k(this, To, null);
    k(this, Rr, !1);
    k(this, Hr, !1);
    k(this, di, !1);
    k(this, Vt, !1);
    k(this, Lo, /* @__PURE__ */ c((e, n = {}) => {
      N("GameTimeAutomation | Pause state changed", {
        paused: e,
        userId: (n == null ? void 0 : n.userId) ?? null,
        broadcast: (n == null ? void 0 : n.broadcast) ?? null
      }), C(this, z, jt).call(this, { pausedOverride: e });
    }, "#handlePause"));
    k(this, Io, /* @__PURE__ */ c((e) => {
      e != null && e.id && (h(this, At).set(e.id, Math.max(e.round ?? 0, 1)), N("GameTimeAutomation | Combat started", { combatId: e.id, round: e.round ?? 0 }), C(this, z, jt).call(this));
    }, "#handleCombatStart"));
    k(this, Oo, /* @__PURE__ */ c((e, n) => {
      if (!(e != null && e.id)) return;
      const i = typeof n == "number" && Number.isFinite(n) ? n : typeof e.round == "number" && Number.isFinite(e.round) ? e.round : 0, r = i > 0 ? i : 1, a = h(this, At).get(e.id), o = a ? Math.max(a, 1) : 1, s = r > 1 ? Math.max(r - o, 0) : 0;
      if (N("GameTimeAutomation | Combat round change detected", {
        combatId: e.id,
        effectiveRound: r,
        completedRounds: s,
        enabled: h(this, Ot),
        paused: (game == null ? void 0 : game.paused) ?? null
      }), s > 0 && h(this, Ot) && h(this, Vt) && !(game != null && game.paused) && C(this, z, Ni).call(this) && C(this, z, Sa).call(this, e)) {
        const l = s * h(this, Pr);
        l > 0 && (N("GameTimeAutomation | Advancing time for completed combat rounds", {
          combatId: e.id,
          completedRounds: s,
          delta: l
        }), C(this, z, sl).call(this, l));
      }
      h(this, At).set(e.id, Math.max(r, 1));
    }, "#handleCombatRound"));
    k(this, Ao, /* @__PURE__ */ c((e) => {
      e != null && e.id && (h(this, At).delete(e.id), N("GameTimeAutomation | Combat ended", { combatId: e.id }), C(this, z, jt).call(this));
    }, "#handleCombatEnd"));
    k(this, ko, /* @__PURE__ */ c((e) => {
      e != null && e.id && (h(this, At).delete(e.id), N("GameTimeAutomation | Combat deleted", { combatId: e.id }), C(this, z, jt).call(this));
    }, "#handleCombatDelete"));
    k(this, Mo, /* @__PURE__ */ c((e, n) => {
      if (e != null && e.id) {
        if (typeof (n == null ? void 0 : n.round) == "number" && Number.isFinite(n.round)) {
          const i = Math.max(n.round, 1);
          h(this, At).set(e.id, i), N("GameTimeAutomation | Combat round manually updated", {
            combatId: e.id,
            round: i
          });
        }
        (Object.prototype.hasOwnProperty.call(n ?? {}, "active") || (n == null ? void 0 : n.round) !== void 0) && C(this, z, jt).call(this);
      }
    }, "#handleCombatUpdate"));
    k(this, _o, /* @__PURE__ */ c((e) => {
      C(this, z, La).call(this, e == null ? void 0 : e.scene), C(this, z, jt).call(this);
    }, "#handleCanvasReady"));
    k(this, No, /* @__PURE__ */ c((e) => {
      if (!Ke(e)) return;
      const n = C(this, z, ll).call(this);
      if (!n || n.id !== e.id) return;
      C(this, z, La).call(this, e) && C(this, z, jt).call(this);
    }, "#handleSceneUpdate"));
  }
  registerHooks() {
    h(this, Rr) || (L(this, Rr, !0), Hooks.on("pauseGame", h(this, Lo)), Hooks.on("combatStart", h(this, Io)), Hooks.on("combatRound", h(this, Oo)), Hooks.on("combatEnd", h(this, Ao)), Hooks.on("deleteCombat", h(this, ko)), Hooks.on("updateCombat", h(this, Mo)), Hooks.on("canvasReady", h(this, _o)), Hooks.on("updateScene", h(this, No)));
  }
  initialize() {
    h(this, Hr) || (L(this, Hr, !0), L(this, So, Qu((e) => {
      const n = !!e, i = n !== h(this, Ot);
      L(this, Ot, n), N("GameTimeAutomation | Manage time toggled", { enabled: n }), i && n && C(this, z, al).call(this), C(this, z, jt).call(this);
    })), L(this, To, Km((e) => {
      L(this, Pr, e), N("GameTimeAutomation | Seconds per round updated", { value: e });
    })), C(this, z, al).call(this), C(this, z, La).call(this), C(this, z, jt).call(this));
  }
};
Ot = new WeakMap(), Pr = new WeakMap(), At = new WeakMap(), Tn = new WeakMap(), ci = new WeakMap(), Ut = new WeakMap(), Yi = new WeakMap(), So = new WeakMap(), To = new WeakMap(), Rr = new WeakMap(), Hr = new WeakMap(), di = new WeakMap(), Vt = new WeakMap(), z = new WeakSet(), il = /* @__PURE__ */ c(function() {
  var e;
  try {
    if (typeof ((e = globalThis.performance) == null ? void 0 : e.now) == "function")
      return globalThis.performance.now();
  } catch (n) {
    N("GameTimeAutomation | Failed to read high-resolution timestamp", {
      message: (n == null ? void 0 : n.message) ?? String(n)
    });
  }
  return Date.now();
}, "#currentTimestamp"), Ni = /* @__PURE__ */ c(function() {
  var e;
  return !!((e = game == null ? void 0 : game.user) != null && e.isGM && game.user.active !== !1);
}, "#canControlTime"), Sa = /* @__PURE__ */ c(function(e) {
  var i, r;
  if (!e) return !1;
  if (e.active === !0) return !0;
  if (e.active === !1) return !1;
  const n = (i = game == null ? void 0 : game.combats) == null ? void 0 : i.active;
  return (n == null ? void 0 : n.id) === e.id ? !0 : ((r = game == null ? void 0 : game.combat) == null ? void 0 : r.id) === e.id ? game.combat.active ?? !0 : !1;
}, "#isCombatDocumentActive"), rl = /* @__PURE__ */ c(function(e) {
  return e ? typeof e.started == "boolean" ? e.started : (e.round ?? 0) > 0 : !1;
}, "#hasCombatStarted"), Ta = /* @__PURE__ */ c(function() {
  var i;
  const e = Array.isArray((i = game == null ? void 0 : game.combats) == null ? void 0 : i.contents) ? game.combats.contents : [];
  for (const r of e)
    if (C(this, z, Sa).call(this, r) && C(this, z, rl).call(this, r))
      return !0;
  const n = game == null ? void 0 : game.combat;
  return !!(n && C(this, z, Sa).call(this, n) && C(this, z, rl).call(this, n));
}, "#isCombatRunning"), al = /* @__PURE__ */ c(function() {
  var n;
  h(this, At).clear();
  const e = Array.isArray((n = game == null ? void 0 : game.combats) == null ? void 0 : n.contents) ? game.combats.contents : [];
  for (const i of e)
    i != null && i.id && h(this, At).set(i.id, Math.max(i.round ?? 0, 1));
}, "#hydrateRoundTracking"), jt = /* @__PURE__ */ c(function({ pausedOverride: e } = {}) {
  const n = typeof e == "boolean" ? e : !!(game != null && game.paused), i = h(this, Ot), r = h(this, Vt), a = i && r, o = {
    manageTimeEnabled: i,
    sceneAllowsRealTime: r,
    effectiveEnabled: a,
    paused: n,
    canControl: C(this, z, Ni).call(this),
    combatRunning: C(this, z, Ta).call(this),
    overrideApplied: typeof e == "boolean"
  };
  if (N("GameTimeAutomation | Sync running state", o), !a || !C(this, z, Ni).call(this)) {
    C(this, z, ol).call(this);
    return;
  }
  C(this, z, fd).call(this);
}, "#syncRunningState"), fd = /* @__PURE__ */ c(function() {
  h(this, Tn) === null && (L(this, ci, C(this, z, il).call(this)), L(this, Tn, globalThis.setInterval(() => C(this, z, md).call(this), 1e3)), N("GameTimeAutomation | Started real-time ticker"));
}, "#startRealTimeTicker"), ol = /* @__PURE__ */ c(function() {
  h(this, Tn) !== null && (globalThis.clearInterval(h(this, Tn)), L(this, Tn, null), N("GameTimeAutomation | Stopped real-time ticker")), L(this, ci, null), L(this, Ut, 0), L(this, di, !1);
}, "#stopRealTimeTicker"), md = /* @__PURE__ */ c(function() {
  if (!h(this, Ot) || !h(this, Vt) || !C(this, z, Ni).call(this)) {
    C(this, z, ol).call(this);
    return;
  }
  const e = C(this, z, il).call(this);
  if (typeof e != "number" || !Number.isFinite(e)) return;
  const n = h(this, ci) ?? e, i = (e - n) / 1e3;
  if (L(this, ci, e), !Number.isFinite(i) || i <= 0) return;
  const r = !!(game != null && game.paused), a = C(this, z, Ta).call(this);
  if (r || a) {
    h(this, di) || N("GameTimeAutomation | Tick skipped", { paused: r, combatRunning: a }), L(this, di, !0), L(this, Ut, 0);
    return;
  }
  L(this, di, !1), N("GameTimeAutomation | Real-time tick", { deltaSeconds: i }), C(this, z, sl).call(this, i);
}, "#tickRealTime"), sl = /* @__PURE__ */ c(function(e) {
  if (!h(this, Ot) || !h(this, Vt)) return;
  const n = Number(e);
  !Number.isFinite(n) || n <= 0 || (L(this, Ut, h(this, Ut) + n), !h(this, Yi) && L(this, Yi, C(this, z, hd).call(this)));
}, "#queueAdvance"), hd = /* @__PURE__ */ c(async function() {
  var e, n;
  for (; h(this, Ut) > 0; ) {
    if (!h(this, Ot) || !h(this, Vt) || game != null && game.paused || !C(this, z, Ni).call(this) || C(this, z, Ta).call(this)) {
      L(this, Ut, 0);
      break;
    }
    const i = h(this, Ut);
    L(this, Ut, 0);
    try {
      if (typeof ((e = game == null ? void 0 : game.time) == null ? void 0 : e.advance) == "function")
        N("GameTimeAutomation | Advancing world time", { delta: i }), await game.time.advance(i), N("GameTimeAutomation | World time advanced", {
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
  L(this, Yi, null);
}, "#flushAdvanceQueue"), Lo = new WeakMap(), Io = new WeakMap(), Oo = new WeakMap(), Ao = new WeakMap(), ko = new WeakMap(), Mo = new WeakMap(), ll = /* @__PURE__ */ c(function() {
  const e = mr();
  return Ke(e) ? e : null;
}, "#getActiveSceneDocument"), gd = /* @__PURE__ */ c(function(e) {
  if (!Ke(e)) return !1;
  try {
    return !!e.getFlag(T, Ps);
  } catch (n) {
    return N("GameTimeAutomation | Failed to read scene real-time flag", {
      sceneId: (e == null ? void 0 : e.id) ?? null,
      message: (n == null ? void 0 : n.message) ?? String(n)
    }), !1;
  }
}, "#isSceneRealTimeAllowed"), La = /* @__PURE__ */ c(function(e) {
  const n = Ke(e) ? e : C(this, z, ll).call(this), i = C(this, z, gd).call(this, n), r = h(this, Vt);
  return L(this, Vt, i), r !== i ? (N("GameTimeAutomation | Scene real-time allowance changed", {
    sceneId: (n == null ? void 0 : n.id) ?? null,
    allows: i
  }), !0) : !1;
}, "#refreshSceneAutomationState"), _o = new WeakMap(), No = new WeakMap(), c(Mc, "GameTimeAutomation");
let nl = Mc;
var Bu, Ln, qe, fi, un, xo, Ce, pd, yd, bd, vd, $o, ul, Fo, wd, Do, Ed, Cd;
const on = class on extends Yn(Wn) {
  constructor(n = {}) {
    const { scene: i, trigger: r, triggerIndex: a, onSave: o, ...s } = n ?? {};
    super(s);
    k(this, Ce);
    k(this, Ln, null);
    k(this, qe, null);
    k(this, fi, null);
    k(this, un, null);
    k(this, xo, /* @__PURE__ */ c(() => {
      (this.rendered ?? this.isRendered ?? !1) && (L(this, un, C(this, Ce, pd).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    k(this, $o, /* @__PURE__ */ c((n) => {
      var a, o;
      const i = n.currentTarget, r = i == null ? void 0 : i.closest("form");
      r && (N("Trigger action selection changed", {
        sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
        triggerId: ((o = this.trigger) == null ? void 0 : o.id) ?? null,
        actionId: (i == null ? void 0 : i.value) ?? null
      }), C(this, Ce, ul).call(this, i.value, r));
    }, "#onActionSelectChange"));
    k(this, Fo, /* @__PURE__ */ c((n) => {
      var u, d, m, f;
      n.preventDefault();
      const i = n.currentTarget, r = i == null ? void 0 : i.closest("form");
      if (!r) return;
      const a = (u = i.dataset) == null ? void 0 : u.target;
      if (!a) return;
      const o = typeof (CSS == null ? void 0 : CSS.escape) == "function" ? CSS.escape : (g) => g, s = r.querySelector(`[name="${o(a)}"]`);
      if (!s) return;
      N("Opening file picker for trigger", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        triggerId: ((m = this.trigger) == null ? void 0 : m.id) ?? null,
        target: a
      }), new FilePicker({
        type: ((f = i.dataset) == null ? void 0 : f.type) || "audio",
        current: s.value,
        callback: /* @__PURE__ */ c((g) => {
          var p, y;
          s.value = g, s.dispatchEvent(new Event("change")), N("Trigger form file selected", {
            sceneId: ((p = this.scene) == null ? void 0 : p.id) ?? null,
            triggerId: ((y = this.trigger) == null ? void 0 : y.id) ?? null,
            target: a,
            path: g
          });
        }, "callback")
      }).render({ force: !0 });
    }, "#onFilePicker"));
    k(this, Do, /* @__PURE__ */ c(async (n) => {
      var r, a;
      n.preventDefault();
      const i = n.currentTarget;
      i instanceof HTMLFormElement && (N("Trigger form submitted", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null,
        triggerId: ((a = this.trigger) == null ? void 0 : a.id) ?? null
      }), await C(this, Ce, Ed).call(this, i));
    }, "#onSubmit"));
    this.scene = i ?? null, this.trigger = r ?? null, this.triggerIndex = Number.isInteger(a) ? Number(a) : null, this.onSave = typeof o == "function" ? o : null, L(this, fi, oc(h(this, xo)));
  }
  async _prepareContext() {
    var n, i;
    Qi("TriggerFormApplication#_prepareContext", {
      sceneId: ((n = this.scene) == null ? void 0 : n.id) ?? null,
      triggerId: ((i = this.trigger) == null ? void 0 : i.id) ?? null,
      triggerIndex: this.triggerIndex
    });
    try {
      const r = this.trigger ?? { action: Ca, data: {} }, a = r.action ?? Ca, o = Uc(r.time), s = o.format ?? "12h", l = s === "12h" ? uh() : [], u = o.period ?? (l.length > 0 ? l[0].value : null), d = s === "12h" ? l.map((g) => ({
        ...g,
        selected: g.value === u
      })) : [], m = Bc().map((g) => ({
        id: g.id,
        label: typeof g.label == "function" ? g.label() : g.label,
        selected: g.id === a
      })), f = Bc().map((g) => {
        const p = g.id === r.action ? r : { ...r, action: g.id }, y = ih(p);
        return y ? {
          id: g.id,
          visible: g.id === a,
          content: y
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
        actionSections: f,
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
      Pn();
    }
  }
  _onRender(n, i) {
    var l, u, d;
    super._onRender(n, i);
    const r = this.element;
    if (!r) return;
    N("Trigger form rendered", {
      sceneId: ((l = this.scene) == null ? void 0 : l.id) ?? null,
      triggerId: ((u = this.trigger) == null ? void 0 : u.id) ?? null
    });
    const a = Array.from(((d = document == null ? void 0 : document.body) == null ? void 0 : d.classList) ?? []).find(
      (m) => m.startsWith("theme-")
    );
    a && r.classList.add(a);
    const o = r.querySelector("form");
    if (!o) return;
    C(this, Ce, wd).call(this, o), C(this, Ce, yd).call(this, o), o.addEventListener("submit", h(this, Do));
    const s = o.querySelector("[data-action-select]");
    s && (s.addEventListener("change", h(this, $o)), C(this, Ce, ul).call(this, s.value, o)), o.querySelectorAll("[data-action-file-picker]").forEach((m) => {
      m.addEventListener("click", h(this, Fo));
    });
  }
  async close(n = {}) {
    var i;
    if ((i = h(this, Ln)) == null || i.call(this), L(this, Ln, null), L(this, qe, null), L(this, un, null), typeof h(this, fi) == "function")
      try {
        h(this, fi).call(this);
      } catch (r) {
        console.error(`${T} | Failed to dispose trigger form time format subscription`, r);
      }
    return L(this, fi, null), super.close(n);
  }
};
Ln = new WeakMap(), qe = new WeakMap(), fi = new WeakMap(), un = new WeakMap(), xo = new WeakMap(), Ce = new WeakSet(), pd = /* @__PURE__ */ c(function() {
  var s, l, u, d, m, f, g;
  const n = (l = (s = this.element) == null ? void 0 : s.querySelector) == null ? void 0 : l.call(s, "form");
  if (!(n instanceof HTMLFormElement)) return null;
  const i = Array.from(n.elements ?? []), r = [];
  for (const p of i)
    if ((p instanceof HTMLInputElement || p instanceof HTMLSelectElement || p instanceof HTMLTextAreaElement) && p.name && !(((u = p.dataset) == null ? void 0 : u.timeHidden) !== void 0 || ((d = p.dataset) == null ? void 0 : d.timeHour) !== void 0 || ((m = p.dataset) == null ? void 0 : m.timeMinute) !== void 0 || ((f = p.dataset) == null ? void 0 : f.timePeriod) !== void 0)) {
      if (p instanceof HTMLInputElement) {
        if (p.type === "checkbox" || p.type === "radio") {
          r.push({
            kind: p.type,
            name: p.name,
            value: p.value,
            checked: p.checked
          });
          continue;
        }
        r.push({
          kind: "value",
          name: p.name,
          value: p.value
        });
        continue;
      }
      if (p instanceof HTMLSelectElement) {
        p.multiple ? r.push({
          kind: "select-multiple",
          name: p.name,
          values: Array.from(p.selectedOptions ?? []).map((y) => y.value)
        }) : r.push({
          kind: "value",
          name: p.name,
          value: p.value
        });
        continue;
      }
      r.push({
        kind: "value",
        name: p.name,
        value: p.value
      });
    }
  const a = n.querySelector("[data-time-format]");
  let o = null;
  if (a instanceof HTMLElement) {
    const p = a.querySelector("[data-time-hidden]"), y = a.querySelector("[data-time-hour]"), b = a.querySelector("[data-time-minute]"), v = a.querySelector("[data-time-period]");
    o = {
      format: ((g = a.dataset) == null ? void 0 : g.timeFormat) ?? null,
      canonical: p instanceof HTMLInputElement ? p.value : "",
      hour: y instanceof HTMLInputElement ? y.value : "",
      minute: b instanceof HTMLInputElement ? b.value : "",
      period: v instanceof HTMLSelectElement ? v.value : ""
    };
  }
  return {
    fields: r,
    time: o
  };
}, "#captureFormState"), yd = /* @__PURE__ */ c(function(n) {
  if (!h(this, un)) return;
  if (!(n instanceof HTMLFormElement)) {
    L(this, un, null);
    return;
  }
  const { fields: i = [], time: r = null } = h(this, un) ?? {};
  L(this, un, null), C(this, Ce, bd).call(this, n, i), C(this, Ce, vd).call(this, n, r);
}, "#restorePendingFormState"), bd = /* @__PURE__ */ c(function(n, i) {
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
}, "#restoreFieldValues"), vd = /* @__PURE__ */ c(function(n, i) {
  var w, S, I;
  const r = n.querySelector("[data-time-format]");
  if (!(r instanceof HTMLElement)) {
    typeof h(this, qe) == "function" && h(this, qe).call(this);
    return;
  }
  const a = ((w = r.dataset) == null ? void 0 : w.timeFormat) === "24h" ? "24h" : "12h", o = r.querySelector("[data-time-hour]"), s = r.querySelector("[data-time-minute]"), l = r.querySelector("[data-time-period]"), u = r.querySelector("[data-time-hidden]");
  if (!i) {
    if (o instanceof HTMLInputElement && (o.value = ""), s instanceof HTMLInputElement && (s.value = ""), l instanceof HTMLSelectElement) {
      const A = ((I = (S = l.options) == null ? void 0 : S[0]) == null ? void 0 : I.value) ?? "";
      l.value = A;
    }
    u instanceof HTMLInputElement && (u.value = ""), typeof h(this, qe) == "function" && h(this, qe).call(this);
    return;
  }
  const d = typeof i.canonical == "string" ? i.canonical : "", m = typeof i.period == "string" ? i.period : "", f = typeof i.hour == "string" ? i.hour : "", g = typeof i.minute == "string" ? i.minute : "";
  let p = "", y = "", b = m, v = d;
  if (d) {
    const A = Uc(d, a);
    p = A.hour ?? "", y = A.minute ?? "", v = A.canonical ?? d, a === "12h" ? b = A.period ?? m : b = "";
  } else
    p = f, y = g, a !== "12h" && (b = "");
  if (o instanceof HTMLInputElement && (o.value = p ?? ""), s instanceof HTMLInputElement && (s.value = y ?? ""), l instanceof HTMLSelectElement)
    if (a === "12h") {
      const A = Array.from(l.options ?? []);
      A.find((x) => x.value === b) ? l.value = b : A.length > 0 ? l.value = A[0].value : l.value = "";
    } else
      l.value = "";
  u instanceof HTMLInputElement && (u.value = v ?? ""), typeof h(this, qe) == "function" && h(this, qe).call(this);
}, "#restoreTimeInputs"), $o = new WeakMap(), ul = /* @__PURE__ */ c(function(n, i) {
  i && i.querySelectorAll("[data-action-config]").forEach((r) => {
    const a = r.dataset.actionConfig === n;
    r.style.display = a ? "" : "none";
  });
}, "#updateActionSections"), Fo = new WeakMap(), wd = /* @__PURE__ */ c(function(n) {
  var m, f, g, p;
  if ((m = h(this, Ln)) == null || m.call(this), L(this, Ln, null), L(this, qe, null), !(n instanceof HTMLFormElement)) return;
  const i = n.querySelector("[data-time-format]"), r = ((f = i == null ? void 0 : i.dataset) == null ? void 0 : f.timeFormat) ?? null;
  if (r !== "12h" && r !== "24h")
    return;
  const a = i.querySelector("[data-time-hidden]"), o = i.querySelector("[data-time-hour]"), s = i.querySelector("[data-time-minute]"), l = r === "12h" ? i.querySelector("[data-time-period]") : null;
  if (!a || !o || !s || r === "12h" && !l) {
    N("Trigger form time inputs missing elements", {
      format: r,
      hasHidden: !!a,
      hasHour: !!o,
      hasMinute: !!s,
      hasPeriod: !!l
    });
    return;
  }
  const u = [o, s, ...l ? [l] : []], d = /* @__PURE__ */ c(() => {
    const { canonical: y, error: b } = ch(
      {
        hour: o.value,
        minute: s.value,
        period: (l == null ? void 0 : l.value) ?? null,
        time: a.value
      },
      r
    );
    a.value = y ?? "";
    const v = b ?? "";
    a.setCustomValidity(v), u.forEach((w) => {
      w.setCustomValidity(v);
    });
  }, "update");
  u.forEach((y) => {
    y.addEventListener("input", d), y.addEventListener("change", d);
  }), d(), L(this, Ln, () => {
    u.forEach((y) => {
      y.removeEventListener("input", d), y.removeEventListener("change", d);
    });
  }), L(this, qe, d), N("Trigger form configured for time input", {
    format: r,
    sceneId: ((g = this.scene) == null ? void 0 : g.id) ?? null,
    triggerId: ((p = this.trigger) == null ? void 0 : p.id) ?? null
  });
}, "#setupTimeInput"), Do = new WeakMap(), Ed = /* @__PURE__ */ c(async function(n) {
  var a, o, s, l, u;
  if (typeof h(this, qe) == "function" && h(this, qe).call(this), typeof n.checkValidity == "function" && !n.checkValidity()) {
    typeof n.reportValidity == "function" && n.reportValidity(), N("Trigger form submission blocked by validity check", {
      sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
      triggerId: ((o = this.trigger) == null ? void 0 : o.id) ?? null
    });
    return;
  }
  const i = new FormData(n), r = Object.fromEntries(i.entries());
  delete r.timeHour, delete r.timeMinute, delete r.timePeriod, r.allowReplayOnRewind = ((s = n.querySelector('input[name="allowReplayOnRewind"]')) == null ? void 0 : s.checked) ?? !1, N("Processing trigger form submission", {
    sceneId: ((l = this.scene) == null ? void 0 : l.id) ?? null,
    triggerId: ((u = this.trigger) == null ? void 0 : u.id) ?? null,
    allowReplayOnRewind: r.allowReplayOnRewind
  }), await C(this, Ce, Cd).call(this, r), await this.close();
}, "#handleSubmit"), Cd = /* @__PURE__ */ c(async function(n) {
  var a, o, s, l, u, d;
  const i = {
    id: ((a = this.trigger) == null ? void 0 : a.id) ?? Vm(),
    time: n.time ?? "",
    action: n.action ?? Ca,
    allowReplayOnRewind: !!n.allowReplayOnRewind,
    data: {}
  };
  N("Persisting trigger from form", {
    sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
    triggerId: i.id,
    existingIndex: this.triggerIndex
  }), rh(i, n);
  const r = Ui(this.scene);
  this.triggerIndex !== null && r[this.triggerIndex] ? r[this.triggerIndex] = i : r.push(i);
  try {
    await td(this.scene, r), N("Trigger list saved", {
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
      console.error(`${T} | Trigger onSave callback failed`, m), N("Trigger onSave callback failed", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        message: (m == null ? void 0 : m.message) ?? String(m)
      });
    }
}, "#persistTrigger"), c(on, "TriggerFormApplication"), be(on, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  He(on, on, "DEFAULT_OPTIONS"),
  {
    id: `${T}-trigger-form`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Bu = He(on, on, "DEFAULT_OPTIONS")) == null ? void 0 : Bu.classes) ?? [], "standard-form", "themed"])
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
)), be(on, "PARTS", {
  content: {
    template: `modules/${T}/templates/time-trigger-form.html`
  }
});
let cl = on;
function Xt(t) {
  return t instanceof HTMLElement ? t : (t == null ? void 0 : t[0]) instanceof HTMLElement ? t[0] : null;
}
c(Xt, "asHTMLElement");
function Ia(t) {
  return typeof (t == null ? void 0 : t.changeTab) == "function";
}
c(Ia, "isAppV2");
function Sd(t, e, n, i = {}) {
  if (Ia(t)) {
    t.changeTab(e, n, i);
    return;
  }
  if (typeof (t == null ? void 0 : t.activateTab) == "function") {
    const r = { ...i };
    n != null && (r.group = n), r.triggerCallback == null && (r.triggerCallback = !0), t.activateTab(e, r);
  }
}
c(Sd, "setActiveTab");
function fh(t) {
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
c(fh, "readFormData");
const zc = Symbol.for("eidolon.sceneConfig.v13PatchedTabs");
function Td(t = {}) {
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
    tabIcon: f = "fa-solid fa-puzzle-piece"
  } = t ?? {};
  if (!e)
    throw new Error("createSceneConfigTabFactory requires a tabId.");
  if (typeof a != "function")
    throw new TypeError("createSceneConfigTabFactory requires a renderContent callback.");
  const g = typeof d.log == "function" ? d.log.bind(d) : (..._) => {
    var H;
    return (H = console.debug) == null ? void 0 : H.call(console, `${o}`, ..._);
  }, p = typeof d.group == "function" ? d.group.bind(d) : (..._) => {
    var H;
    return (H = console.groupCollapsed) == null ? void 0 : H.call(console, `${o}`, ..._);
  }, y = typeof d.groupEnd == "function" ? d.groupEnd.bind(d) : () => {
    var _;
    return (_ = console.groupEnd) == null ? void 0 : _.call(console);
  }, b = Symbol(`EIDOLON_SCENE_CONFIG_TAB_CLEANUP_${e}`), v = typeof i == "function" ? i : () => null, w = typeof r == "function" ? r : () => !0, S = typeof n == "function" ? n : () => typeof n == "string" ? n : e;
  function I() {
    var j, B, V, J, ae;
    const _ = ((B = (j = foundry == null ? void 0 : foundry.applications) == null ? void 0 : j.sheets) == null ? void 0 : B.SceneConfig) ?? ((V = CONFIG == null ? void 0 : CONFIG.Scene) == null ? void 0 : V.sheetClass);
    if (!_ || !Ia({ changeTab: (J = _.prototype) == null ? void 0 : J.changeTab })) return;
    const H = _[zc] ?? /* @__PURE__ */ new Set();
    if (H.has(e)) return;
    H.add(e), _[zc] = H;
    const q = (ae = _.TABS) == null ? void 0 : ae.sheet;
    if (q && Array.isArray(q.tabs) && !q.tabs.some((Q) => Q.id === e)) {
      const Q = S({ app: null, scene: null }) ?? e;
      q.tabs.push({
        id: e,
        icon: f,
        label: Q
      });
    }
    _.PARTS && !_.PARTS[e] && (_.PARTS[e] = {
      template: `modules/${m}/templates/scene-config-tab-mount.hbs`,
      scrollable: [`.tab[data-tab="${e}"]`]
    }), g("Patched v13 SceneConfig TABS/PARTS", { tabId: e });
  }
  c(I, "patchV13SceneConfig");
  function A(_, H) {
    var j, B;
    const q = v(_);
    if (!w(_, q)) {
      g("Skipped render", {
        tabId: e,
        reason: "inapplicable",
        constructor: ((j = _ == null ? void 0 : _.constructor) == null ? void 0 : j.name) ?? null
      });
      return;
    }
    p("render", {
      tabId: e,
      sceneId: (q == null ? void 0 : q.id) ?? null,
      constructor: ((B = _ == null ? void 0 : _.constructor) == null ? void 0 : B.name) ?? null
    });
    try {
      const V = Xt(H) ?? Xt(_.element);
      if (!V) {
        g("Missing root element", { tabId: e });
        return;
      }
      Ia(_) ? M(_, V, q) : x(_, V, q);
    } finally {
      y();
    }
  }
  c(A, "handleRender");
  function O(_, H, q) {
    var V;
    if (!f) {
      _.textContent = H;
      return;
    }
    const j = (V = _.querySelector("i")) == null ? void 0 : V.cloneNode(!0);
    _.textContent = "";
    const B = j ?? document.createElement("i");
    if (j || (B.className = f, q && (B.inert = !0)), _.append(B, " "), q) {
      const J = document.createElement("span");
      J.textContent = H, _.append(J);
    } else
      _.append(document.createTextNode(H));
  }
  c(O, "setButtonContent");
  function x(_, H, q) {
    var lt, en, Xe, ke, Ai, tn, Jn, ct, nn, R, la, X, Et, xe, ar, ca;
    const B = [
      "nav.sheet-tabs[data-group]",
      "nav.tabs[data-group]",
      "nav.sheet-tabs",
      "nav.tabs"
    ].map(($e) => H.querySelector($e)).find(($e) => $e instanceof HTMLElement), J = [
      (lt = H.querySelector(".tab[data-tab]")) == null ? void 0 : lt.parentElement,
      H.querySelector(".sheet-body"),
      (Xe = (en = B == null ? void 0 : B.parentElement) == null ? void 0 : en.querySelector) == null ? void 0 : Xe.call(en, ":scope > .sheet-body"),
      B == null ? void 0 : B.parentElement
    ].find(($e) => $e instanceof HTMLElement), ae = ((ke = B == null ? void 0 : B.dataset) == null ? void 0 : ke.group) ?? ((Jn = (tn = (Ai = B == null ? void 0 : B.querySelector) == null ? void 0 : Ai.call(B, "a[data-group]")) == null ? void 0 : tn.dataset) == null ? void 0 : Jn.group) ?? ((R = (nn = (ct = B == null ? void 0 : B.querySelector) == null ? void 0 : ct.call(B, "[data-group]")) == null ? void 0 : nn.dataset) == null ? void 0 : R.group) ?? ((Et = (X = (la = J == null ? void 0 : J.querySelector) == null ? void 0 : la.call(J, ".tab[data-group]")) == null ? void 0 : X.dataset) == null ? void 0 : Et.group) ?? "main";
    if (!B || !J) {
      g("Missing navigation elements", {
        tabId: e,
        hasNav: !!B,
        hasBody: !!J
      });
      return;
    }
    let Q = B.querySelector(`[data-tab="${e}"]`);
    if (!Q) {
      Q = document.createElement("a"), Q.dataset.action = "tab", Q.dataset.group = ae, Q.dataset.tab = e;
      const $e = B.querySelector("a[data-tab]");
      (xe = $e == null ? void 0 : $e.classList) != null && xe.contains("item") && Q.classList.add("item"), B.appendChild(Q), typeof s == "function" && s({ app: _, button: Q, nav: B, scene: q }), g("Created tab button", { tabId: e, group: ae });
    }
    O(Q, S({ app: _, scene: q }) ?? e, Ia(_));
    let ne = J.querySelector(`.tab[data-tab="${e}"]`);
    if (!ne) {
      ne = document.createElement("div"), ne.classList.add("tab"), ne.dataset.tab = e, ne.dataset.group = ae;
      const $e = Ld(J);
      J.insertBefore(ne, $e ?? null), typeof l == "function" && l({ app: _, tab: ne, body: J, scene: q }), g("Created tab container", { tabId: e, group: ae });
    }
    ((ar = Q.classList) == null ? void 0 : ar.contains("active")) || ne.classList.contains("active") ? (Q.classList.add("active"), ne.classList.add("active"), ne.removeAttribute("hidden")) : (Q.classList.remove("active"), ne.classList.remove("active"), ne.setAttribute("hidden", "true"));
    const wt = /* @__PURE__ */ c(() => {
      var Kn, or;
      ((Kn = Q.classList) != null && Kn.contains("active") || ne.classList.contains("active")) && ((or = Q.classList) == null || or.add("active"), ne.classList.add("active"), ne.removeAttribute("hidden"), ne.removeAttribute("aria-hidden"), ne.style.display === "none" && (ne.style.display = ""));
    }, "ensureTabVisible"), Re = /* @__PURE__ */ c(() => {
      wt(), requestAnimationFrame(wt);
    }, "scheduleEnsureTabVisible");
    Q.dataset.eidolonEnsureSceneTabVisibility || (Q.addEventListener("click", () => {
      Sd(_, e, ae), requestAnimationFrame(wt);
    }), Q.dataset.eidolonEnsureSceneTabVisibility = "true"), ys(_, b, g);
    const st = a({
      app: _,
      scene: q,
      tab: ne,
      tabButton: Q,
      ensureTabVisible: wt,
      scheduleEnsureTabVisible: Re
    });
    typeof st == "function" && Gc(_, b, st), typeof u == "function" && u({
      app: _,
      scene: q,
      tab: ne,
      tabButton: Q,
      ensureTabVisible: wt,
      scheduleEnsureTabVisible: Re
    }), (ca = _.setPosition) == null || ca.call(_, { height: "auto" });
  }
  c(x, "handleRenderV1");
  function M(_, H, q) {
    const j = H.querySelector(`.tab[data-tab="${e}"]`), B = H.querySelector(`nav [data-tab="${e}"]`);
    if (!j || !B) {
      g("v2 mount not found, falling back to v1 injection", { tabId: e }), x(_, H, q);
      return;
    }
    O(B, S({ app: _, scene: q }) ?? e, !0);
    const V = /* @__PURE__ */ c(() => {
      var Q;
      !((Q = B.classList) != null && Q.contains("active")) && !j.classList.contains("active") || (j.classList.add("active"), j.removeAttribute("hidden"), j.removeAttribute("aria-hidden"), j.style.display === "none" && (j.style.display = ""));
    }, "ensureTabVisible"), J = /* @__PURE__ */ c(() => {
      V(), requestAnimationFrame(V);
    }, "scheduleEnsureTabVisible");
    ys(_, b, g);
    const ae = a({
      app: _,
      scene: q,
      tab: j,
      tabButton: B,
      ensureTabVisible: V,
      scheduleEnsureTabVisible: J
    });
    typeof ae == "function" && Gc(_, b, ae), typeof u == "function" && u({
      app: _,
      scene: q,
      tab: j,
      tabButton: B,
      ensureTabVisible: V,
      scheduleEnsureTabVisible: J
    });
  }
  c(M, "handleRenderV2");
  function D(_) {
    ys(_, b, g);
  }
  c(D, "handleClose");
  function F() {
    return Hooks.once("init", () => {
      I();
    }), Hooks.on("renderSceneConfig", A), Hooks.on("closeSceneConfig", D), () => P();
  }
  c(F, "register");
  function P() {
    Hooks.off("renderSceneConfig", A), Hooks.off("closeSceneConfig", D);
  }
  return c(P, "unregister"), { register: F, unregister: P };
}
c(Td, "createSceneConfigTabFactory");
function Gc(t, e, n) {
  if (!t || typeof n != "function") return;
  const i = t == null ? void 0 : t[e];
  Array.isArray(i) || (t[e] = []), t[e].push(n);
}
c(Gc, "registerCleanup");
function ys(t, e, n) {
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
c(ys, "invokeCleanup");
function Ld(t) {
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
c(Ld, "findFooterElement");
const mh = Wo(cl), hh = `modules/${T}/templates/time-trigger-scene-tab.html`, gh = Td({
  tabId: "time-triggers",
  tabLabel: /* @__PURE__ */ c(() => E("EIDOLON.TimeTrigger.Tab", "Time Triggers"), "tabLabel"),
  getScene: Qt,
  isApplicable: vh,
  renderContent: /* @__PURE__ */ c(({ app: t, scene: e, tab: n }) => yh(t, n, e), "renderContent"),
  logger: {
    log: N,
    group: Qi,
    groupEnd: Pn
  }
});
function ph() {
  return N("Registering SceneConfig render hook"), gh.register();
}
c(ph, "registerSceneConfigHook");
function yh(t, e, n) {
  if (!(e instanceof HTMLElement)) return;
  const i = Ke(n) ? n : Qt(t);
  Ga(t, e, i);
  const r = oc(() => {
    Ga(t, e, i);
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
c(yh, "renderTimeTriggerTab");
async function Ga(t, e, n) {
  var r, a;
  const i = n ?? Qt(t);
  Qi("renderTimeTriggersTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!Ke(i)) {
      const j = E(
        "EIDOLON.TimeTrigger.Unavailable",
        "Time triggers are unavailable for this configuration sheet."
      );
      e.innerHTML = `<p class="notes">${j}</p>`, N("Scene lacks document for time triggers", { sceneId: (i == null ? void 0 : i.id) ?? null });
      return;
    }
    const o = `flags.${T}.${ja}`, s = `flags.${T}.${Fs}`, l = `flags.${T}.${Ds}`, u = !!i.getFlag(T, ja), d = !!i.getFlag(T, Fs), m = !!i.getFlag(T, Ds), f = Ui(i);
    N("Rendering time trigger list", {
      sceneId: i.id,
      isActive: u,
      shouldHideWindow: d,
      shouldShowPlayerWindow: m,
      triggerCount: f.length
    });
    const g = E("EIDOLON.TimeTrigger.Activate", "Activate Time Trigger"), p = E(
      "EIDOLON.TimeTrigger.Description",
      "Enable scene time triggers so scheduled actions can run automatically."
    ), y = E(
      "EIDOLON.TimeTrigger.HideWindowLabel",
      "Hide Floating Time Window"
    ), b = E(
      "EIDOLON.TimeTrigger.HideWindowDescription",
      "Keep the floating time control window hidden while leaving time triggers active."
    ), v = E(
      "EIDOLON.TimeTrigger.ShowPlayerWindowLabel",
      "Share Floating Time Window with Players"
    ), w = E(
      "EIDOLON.TimeTrigger.ShowPlayerWindowDescription",
      "Let non-GM players see the floating time window (without time controls)."
    ), S = E(
      "EIDOLON.TimeTrigger.TriggerListLabel",
      "Scene Time Triggers"
    ), I = E(
      "EIDOLON.TimeTrigger.TriggerListEmpty",
      "No time triggers configured for this scene."
    ), A = E("EIDOLON.TimeTrigger.AddTrigger", "Add Trigger"), O = E("EIDOLON.TimeTrigger.EditTrigger", "Edit"), x = E("EIDOLON.TimeTrigger.DeleteTrigger", "Remove"), M = E("EIDOLON.TimeTrigger.TriggerNow", "Trigger Now"), D = E("EIDOLON.TimeTrigger.AtLabel", "At"), F = E("EIDOLON.TimeTrigger.DoLabel", "Do"), P = E("EIDOLON.TimeTrigger.MissingTime", "(No time set)"), _ = f.map((j, B) => {
      const ae = (j.time ? lh(j.time) : "") || j.time || "" || P, Q = th(j.action), ne = [
        `${D} ${ae}`,
        `${F} ${Q}`,
        ...nh(j)
      ];
      return {
        index: B,
        summaryParts: ne,
        tooltips: {
          triggerNow: M,
          edit: O,
          delete: x
        }
      };
    }), H = ((a = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : a.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof H != "function") {
      console.error(`${T} | renderTemplate is unavailable; cannot render scene tab.`), e.innerHTML = `<p class="notes">${I}</p>`;
      return;
    }
    let q = "";
    try {
      q = await H(hh, {
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
          activate: g,
          hideWindow: y,
          showPlayerWindow: v,
          triggerList: S,
          empty: I,
          add: A
        },
        hints: {
          activate: p,
          hideWindow: b,
          showPlayerWindow: w
        },
        triggers: _,
        hasTriggers: _.length > 0
      });
    } catch (j) {
      console.error(`${T} | Failed to render time trigger scene tab template`, j), e.innerHTML = `<p class="notes">${I}</p>`;
      return;
    }
    e.innerHTML = q, bh(t, e, i);
  } finally {
    Pn();
  }
}
c(Ga, "renderTimeTriggersTabContent");
function bh(t, e, n) {
  const i = n ?? Qt(t);
  if (!Ke(i)) return;
  const r = e.querySelector('[data-action="add-trigger"]');
  r && r.addEventListener("click", () => {
    N("Add trigger button clicked", { sceneId: i.id }), Wc(t, { scene: i });
  }), e.querySelectorAll('[data-action="edit-trigger"]').forEach((a) => {
    a.addEventListener("click", () => {
      const o = Number(a.dataset.index);
      if (!Number.isInteger(o)) return;
      const l = Ui(i)[o];
      l && (N("Edit trigger button clicked", { sceneId: i.id, triggerId: l.id, index: o }), Wc(t, { trigger: l, triggerIndex: o, scene: i }));
    });
  }), e.querySelectorAll('[data-action="delete-trigger"]').forEach((a) => {
    a.addEventListener("click", async () => {
      var u, d;
      const o = Number(a.dataset.index);
      if (!Number.isInteger(o)) return;
      const s = Ui(i), l = s[o];
      if (l) {
        s.splice(o, 1);
        try {
          N("Deleting trigger", {
            sceneId: i.id,
            index: o,
            triggerId: (l == null ? void 0 : l.id) ?? null
          }), await td(i, s), await Ga(t, e, i);
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
      var u, d, m, f, g, p, y;
      const o = Number(a.dataset.index);
      if (!Number.isInteger(o)) return;
      const l = Ui(i)[o];
      if (l) {
        if (!((u = game.user) != null && u.isGM)) {
          (m = (d = ui.notifications) == null ? void 0 : d.warn) == null || m.call(
            d,
            E("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time.")
          );
          return;
        }
        try {
          N("Manually firing trigger", { sceneId: i.id, triggerId: l.id, index: o }), await nd(i, l), (g = (f = ui.notifications) == null ? void 0 : f.info) == null || g.call(
            f,
            E(
              "EIDOLON.TimeTrigger.TriggerNowSuccess",
              "Triggered the selected time trigger."
            )
          );
        } catch (b) {
          console.error(`${T} | Failed to execute time trigger manually`, b), (y = (p = ui.notifications) == null ? void 0 : p.error) == null || y.call(
            p,
            E(
              "EIDOLON.TimeTrigger.TriggerNowError",
              "Failed to execute the selected time trigger."
            )
          ), N("Manual trigger execution failed", {
            sceneId: i.id,
            triggerId: l.id,
            index: o,
            message: (b == null ? void 0 : b.message) ?? String(b)
          });
        }
      }
    });
  });
}
c(bh, "bindTimeTriggerTabEvents");
function Wc(t, e = {}) {
  var o;
  const n = e.scene ?? null, i = n && Ke(n) ? n : Qt(t);
  if (!Ke(i)) {
    console.warn(`${T} | Unable to open trigger form because no scene document is available.`);
    return;
  }
  N("Opening trigger form", {
    sceneId: i.id,
    triggerId: ((o = e.trigger) == null ? void 0 : o.id) ?? null,
    index: Number.isInteger(e.triggerIndex) ? Number(e.triggerIndex) : null
  }), mh({
    scene: i,
    trigger: e.trigger ?? null,
    triggerIndex: e.triggerIndex ?? null,
    onSave: /* @__PURE__ */ c(() => {
      var l, u;
      const s = (u = (l = t.element) == null ? void 0 : l[0]) == null ? void 0 : u.querySelector('.tab[data-tab="time-triggers"]');
      s && Ga(t, s, i);
    }, "onSave")
  }).render({ force: !0 });
}
c(Wc, "openTriggerForm");
function vh(t, e) {
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
c(vh, "isRecognizedSceneConfig");
const ma = new tl(), Yc = new nl();
function wh() {
  N("Registering time trigger hooks"), Hooks.once("init", () => {
    zm(), Xm(), N("Time trigger settings registered during init");
  }), ph(), N("Scene config hook registered"), Yc.registerHooks(), N("Time automation hooks registered"), Hooks.once("ready", () => {
    Qm(), N("Ready hook fired"), ma.onReady(), Yc.initialize();
  }), Hooks.on("canvasReady", (t) => {
    var e;
    N("canvasReady hook received", { scene: ((e = t == null ? void 0 : t.scene) == null ? void 0 : e.id) ?? null }), ma.onCanvasReady(t);
  }), Hooks.on("updateScene", (t) => {
    N("updateScene hook received", { scene: (t == null ? void 0 : t.id) ?? null }), ma.onUpdateScene(t);
  }), Hooks.on("updateWorldTime", (t, e) => {
    N("updateWorldTime hook received", { worldTime: t, diff: e }), ma.onUpdateWorldTime(t, e);
  });
}
c(wh, "registerTimeTriggerHooks");
wh();
const Le = T, Id = "criteria", lc = "state", Eh = "criteriaVersion", Ch = 1, Od = "enableCriteriaSurfaces";
let Jc = !1;
function Sh() {
  var t;
  if (!Jc) {
    if (Jc = !0, !((t = game == null ? void 0 : game.settings) != null && t.register)) {
      console.warn(`${Le} | game.settings.register unavailable; scene criteria setting skipped.`);
      return;
    }
    game.settings.register(Le, Od, {
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
        Th();
      }, "onChange")
    });
  }
}
c(Sh, "registerSceneCriteriaSettings");
function Yo() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return !!game.settings.get(Le, Od);
  } catch (e) {
    console.error(`${Le} | Failed to read criteria surfaces setting`, e);
  }
  return !0;
}
c(Yo, "getCriteriaSurfacesEnabled");
function Th() {
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
c(Th, "promptReloadForCriteriaSurfaces");
const Wa = "Standard";
function vt(t) {
  var n;
  const e = (n = t == null ? void 0 : t.getFlag) == null ? void 0 : n.call(t, Le, Id);
  return e ? Ad(e) : [];
}
c(vt, "getSceneCriteria");
async function Jo(t, e) {
  if (!(t != null && t.setFlag)) return;
  const n = Ad(e);
  await t.setFlag(Le, Id, n), await t.setFlag(Le, Eh, Ch);
  const i = ra(t, n);
  await t.setFlag(Le, lc, i);
}
c(Jo, "setSceneCriteria");
function ra(t, e = null) {
  var r;
  const n = Array.isArray(e) ? e : vt(t), i = Kt(((r = t == null ? void 0 : t.getFlag) == null ? void 0 : r.call(t, Le, lc)) ?? {});
  return uc(i, n);
}
c(ra, "getSceneCriteriaState");
async function Lh(t, e, n = null) {
  if (!(t != null && t.setFlag)) return;
  const i = Array.isArray(n) ? n : vt(t), r = uc(e, i);
  await t.setFlag(Le, lc, r);
}
c(Lh, "setSceneCriteriaState");
function cc(t = "") {
  const e = typeof t == "string" ? t.trim() : "", n = kd(fl(e || "criterion"), /* @__PURE__ */ new Set());
  return {
    id: Md(),
    key: n,
    label: e,
    values: [Wa],
    default: Wa,
    order: 0
  };
}
c(cc, "createSceneCriterion");
function Ad(t) {
  const e = Array.isArray(t) ? Kt(t) : [], n = [], i = /* @__PURE__ */ new Set();
  return e.forEach((r, a) => {
    const o = dl(r, a, i);
    o && (n.push(o), i.add(o.key));
  }), n;
}
c(Ad, "sanitizeCriteria$1");
function dl(t, e = 0, n = /* @__PURE__ */ new Set()) {
  if (!t || typeof t != "object") return null;
  const i = typeof t.id == "string" && t.id.trim() ? t.id.trim() : Md(), a = (typeof t.label == "string" ? t.label : typeof t.name == "string" ? t.name : "").trim(), o = typeof t.key == "string" && t.key.trim() ? fl(t.key) : fl(a || `criterion-${Number(e) + 1}`), s = kd(o, n), l = Oh(t.values);
  let u = typeof t.default == "string" ? t.default.trim() : "";
  u || (u = l[0] ?? Wa), l.includes(u) || l.unshift(u);
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
c(dl, "sanitizeCriterion");
function uc(t, e = []) {
  const n = t && typeof t == "object" ? Kt(t) : {}, i = {};
  for (const r of e) {
    const a = n == null ? void 0 : n[r.key], o = typeof a == "string" ? a.trim() : "";
    o && r.values.includes(o) ? i[r.key] = o : i[r.key] = r.default;
  }
  return i;
}
c(uc, "sanitizeSceneCriteriaState");
function Ih(t) {
  return vt(t).map((n) => ({
    id: n.key,
    key: n.key,
    name: n.label,
    values: [...n.values]
  }));
}
c(Ih, "getSceneCriteriaCategories");
function Oh(t) {
  const e = Array.isArray(t) ? t : [], n = [];
  for (const i of e) {
    if (typeof i != "string") continue;
    const r = i.trim();
    !r || n.includes(r) || n.push(r);
  }
  return n.length || n.push(Wa), n;
}
c(Oh, "sanitizeCriterionValues");
function fl(t) {
  return String(t ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
c(fl, "slugifyCriterionKey");
function kd(t, e) {
  if (!e.has(t)) return t;
  let n = 2;
  for (; e.has(`${t}-${n}`); )
    n += 1;
  return `${t}-${n}`;
}
c(kd, "ensureUniqueCriterionKey");
function Md() {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 11);
}
c(Md, "generateCriterionId");
function _d(t) {
  var e, n;
  console.error(`${Le} | Failed to persist scene criteria`, t), (n = (e = ui.notifications) == null ? void 0 : e.error) == null || n.call(
    e,
    E(
      "EIDOLON.SceneCriteria.PersistError",
      "Failed to persist the scene criteria."
    )
  );
}
c(_d, "notifyPersistError");
var Uu, pe, dn, Pe, Nd, Po, Ro, Ho, qo, Oa, jo, qr, jr, hr, xd;
const sn = class sn extends Yn(Wn) {
  constructor(n = {}) {
    const { scene: i, criterion: r, isNew: a, onSave: o, ...s } = n ?? {};
    super(s);
    k(this, Pe);
    k(this, pe, null);
    k(this, dn, !1);
    k(this, Po, /* @__PURE__ */ c(async (n) => {
      n.preventDefault();
      const i = n.currentTarget;
      if (!(i instanceof HTMLFormElement)) return;
      const r = new FormData(i), a = String(r.get("criterionLabel") ?? "").trim(), o = String(r.get("criterionKey") ?? "").trim(), s = Array.from(i.querySelectorAll('[name="criterionValues"]')).map((m) => m instanceof HTMLInputElement ? m.value.trim() : "").filter((m, f, g) => m && g.indexOf(m) === f), u = String(r.get("criterionDefault") ?? "").trim() || s[0] || "Standard", d = dl(
        {
          id: h(this, pe).id,
          key: o,
          label: a,
          values: s,
          default: u,
          order: Number(h(this, pe).order ?? 0)
        },
        0,
        /* @__PURE__ */ new Set()
      );
      d && (L(this, pe, d), await C(this, Pe, xd).call(this), this.close());
    }, "#onSubmit"));
    k(this, Ro, /* @__PURE__ */ c((n) => {
      var o;
      if (h(this, dn)) return;
      const i = n.currentTarget, r = (i == null ? void 0 : i.form) ?? ((o = this.element) == null ? void 0 : o.querySelector("form"));
      if (!(r instanceof HTMLFormElement)) return;
      const a = r.querySelector('input[name="criterionKey"]');
      a instanceof HTMLInputElement && (a.value = cr(i.value));
    }, "#onLabelInput"));
    k(this, Ho, /* @__PURE__ */ c((n) => {
      var l;
      const i = n.currentTarget, r = (i == null ? void 0 : i.form) ?? ((l = this.element) == null ? void 0 : l.querySelector("form"));
      if (!(r instanceof HTMLFormElement) || !(i instanceof HTMLInputElement)) return;
      const a = r.querySelector('input[name="criterionLabel"]'), o = cr(a instanceof HTMLInputElement ? a.value : ""), s = cr(i.value);
      L(this, dn, s !== o), i.value = s, C(this, Pe, Oa).call(this, r);
    }, "#onKeyInput"));
    k(this, qo, /* @__PURE__ */ c((n) => {
      var o, s;
      n.preventDefault();
      const i = ((o = n.currentTarget) == null ? void 0 : o.form) ?? ((s = this.element) == null ? void 0 : s.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector('input[name="criterionLabel"]'), a = i.querySelector('input[name="criterionKey"]');
      a instanceof HTMLInputElement && (a.value = cr(r instanceof HTMLInputElement ? r.value : ""), L(this, dn, !1), C(this, Pe, Oa).call(this, i));
    }, "#onResetAutoKey"));
    k(this, jo, /* @__PURE__ */ c((n) => {
      var l, u, d, m, f, g;
      n.preventDefault();
      const i = ((l = n.currentTarget) == null ? void 0 : l.form) ?? ((u = this.element) == null ? void 0 : u.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector(".scene-criterion-editor__values");
      if (!(r instanceof HTMLElement)) return;
      (d = r.querySelector(".scene-criterion-editor__empty")) == null || d.remove();
      const a = document.createElement("div");
      a.classList.add("scene-criterion-editor__value");
      const o = Pt(E("EIDOLON.SceneCriteria.ValuePlaceholder", "Allowed value")), s = Pt(E("EIDOLON.SceneCriteria.RemoveValue", "Remove Value"));
      a.innerHTML = `
      <input type="text" name="criterionValues" value="" placeholder="${o}" class="form-control">
      <button type="button" class="icon" data-action="remove-value" aria-label="${s}" title="${s}">
        <i class="fa-solid fa-trash"></i>
      </button>
    `, r.appendChild(a), (m = a.querySelector('[data-action="remove-value"]')) == null || m.addEventListener("click", h(this, qr)), (f = a.querySelector('input[name="criterionValues"]')) == null || f.addEventListener("input", h(this, jr)), C(this, Pe, hr).call(this, i), (g = a.querySelector('input[name="criterionValues"]')) == null || g.focus();
    }, "#onAddValue"));
    k(this, qr, /* @__PURE__ */ c((n) => {
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
        C(this, Pe, hr).call(this, i);
      }
    }, "#onRemoveValue"));
    k(this, jr, /* @__PURE__ */ c((n) => {
      var r, a;
      const i = ((r = n.currentTarget) == null ? void 0 : r.form) ?? ((a = this.element) == null ? void 0 : a.querySelector("form"));
      i instanceof HTMLFormElement && C(this, Pe, hr).call(this, i);
    }, "#onValuesChanged"));
    this.scene = i ?? null, this.criterion = r ?? null, this.onSave = typeof o == "function" ? o : null, this.isNew = !!a, L(this, pe, C(this, Pe, Nd).call(this)), L(this, dn, h(this, pe).key !== cr(h(this, pe).label));
  }
  async _prepareContext() {
    var i, r, a, o;
    const n = Array.isArray((i = h(this, pe)) == null ? void 0 : i.values) ? h(this, pe).values : [];
    return {
      isNew: this.isNew,
      key: ((r = h(this, pe)) == null ? void 0 : r.key) ?? "",
      label: ((a = h(this, pe)) == null ? void 0 : a.label) ?? "",
      defaultValue: ((o = h(this, pe)) == null ? void 0 : o.default) ?? "",
      values: n.map((s, l) => {
        var u;
        return {
          index: l,
          value: s,
          selected: s === ((u = h(this, pe)) == null ? void 0 : u.default)
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
      keyIsCustom: h(this, dn)
    };
  }
  _onRender(n, i) {
    var a, o, s, l, u, d;
    super._onRender(n, i);
    const r = (a = this.element) == null ? void 0 : a.querySelector("form");
    r && (r.addEventListener("submit", h(this, Po)), (o = r.querySelector('[data-action="add-value"]')) == null || o.addEventListener("click", h(this, jo)), (s = r.querySelector('input[name="criterionLabel"]')) == null || s.addEventListener("input", h(this, Ro)), (l = r.querySelector('input[name="criterionKey"]')) == null || l.addEventListener("input", h(this, Ho)), (u = r.querySelector('[data-action="reset-auto-key"]')) == null || u.addEventListener("click", h(this, qo)), r.querySelectorAll('[data-action="remove-value"]').forEach((m) => {
      m.addEventListener("click", h(this, qr));
    }), r.querySelectorAll('input[name="criterionValues"]').forEach((m) => {
      m.addEventListener("input", h(this, jr));
    }), (d = r.querySelector('[data-action="cancel"]')) == null || d.addEventListener("click", (m) => {
      m.preventDefault(), this.close();
    }), C(this, Pe, Oa).call(this, r), C(this, Pe, hr).call(this, r));
  }
};
pe = new WeakMap(), dn = new WeakMap(), Pe = new WeakSet(), Nd = /* @__PURE__ */ c(function() {
  const n = dl(this.criterion, 0, /* @__PURE__ */ new Set()) ?? cc(E("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion"));
  return {
    id: n.id,
    key: n.key,
    label: n.label ?? "",
    values: Array.isArray(n.values) ? [...n.values] : [],
    default: n.default
  };
}, "#initializeState"), Po = new WeakMap(), Ro = new WeakMap(), Ho = new WeakMap(), qo = new WeakMap(), Oa = /* @__PURE__ */ c(function(n) {
  const i = n.querySelector('[data-action="reset-auto-key"]');
  i instanceof HTMLButtonElement && (i.disabled = !h(this, dn));
}, "#syncAutoKeyButton"), jo = new WeakMap(), qr = new WeakMap(), jr = new WeakMap(), hr = /* @__PURE__ */ c(function(n) {
  var l, u;
  const i = n.querySelector('select[name="criterionDefault"]');
  if (!(i instanceof HTMLSelectElement)) return;
  const r = ((u = (l = i.value) == null ? void 0 : l.trim) == null ? void 0 : u.call(l)) ?? "", a = Array.from(n.querySelectorAll('input[name="criterionValues"]')).map((d) => d instanceof HTMLInputElement ? d.value.trim() : "").filter((d, m, f) => d && f.indexOf(d) === m), o = i.dataset.emptyLabel || E("EIDOLON.SceneCriteria.ValueListEmpty", "No values have been added to this criterion.");
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
}, "#syncDefaultOptions"), xd = /* @__PURE__ */ c(async function() {
  if (!this.scene) return;
  const n = vt(this.scene).sort((r, a) => r.order - a.order), i = n.findIndex((r) => r.id === h(this, pe).id);
  i < 0 ? (h(this, pe).order = n.length, n.push(h(this, pe))) : (h(this, pe).order = n[i].order, n.splice(i, 1, h(this, pe)));
  try {
    await Jo(this.scene, n), this.onSave && await this.onSave(h(this, pe));
  } catch (r) {
    _d(r);
  }
}, "#persist"), c(sn, "CategoryEditorApplication"), be(sn, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  He(sn, sn, "DEFAULT_OPTIONS"),
  {
    id: `${Le}-criterion-editor`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Uu = He(sn, sn, "DEFAULT_OPTIONS")) == null ? void 0 : Uu.classes) ?? [], "standard-form", "themed"])
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
)), be(sn, "PARTS", {
  content: {
    template: `modules/${Le}/templates/scene-criteria-editor.html`
  }
});
let ml = sn;
function cr(t) {
  return String(t ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
c(cr, "slugifyKey");
const Ah = `modules/${Le}/templates/scene-criteria-tab.html`, hl = {
  log: /* @__PURE__ */ c((...t) => {
    var e;
    return (e = console.debug) == null ? void 0 : e.call(console, `${Le} | Criteria`, ...t);
  }, "log"),
  group: /* @__PURE__ */ c((...t) => {
    var e;
    return (e = console.groupCollapsed) == null ? void 0 : e.call(console, `${Le} | Criteria`, ...t);
  }, "group"),
  groupEnd: /* @__PURE__ */ c(() => {
    var t;
    return (t = console.groupEnd) == null ? void 0 : t.call(console);
  }, "groupEnd")
}, kh = Wo(ml), Mh = Td({
  tabId: "criteria",
  tabLabel: /* @__PURE__ */ c(() => E("EIDOLON.SceneCriteria.TabLabel", "Criteria"), "tabLabel"),
  getScene: Qt,
  isApplicable: /* @__PURE__ */ c(() => Yo(), "isApplicable"),
  renderContent: /* @__PURE__ */ c(({ app: t, tab: e, scene: n }) => Nh(t, e, n), "renderContent"),
  logger: hl
});
function _h() {
  return Mh.register();
}
c(_h, "registerSceneCriteriaConfigHook");
function Nh(t, e, n) {
  if (!(e instanceof HTMLElement)) return;
  const i = Ke(n) ? n : Qt(t);
  xi(t, e, i);
}
c(Nh, "renderCriteriaTab");
async function xi(t, e, n) {
  var r, a;
  const i = n ?? Qt(t);
  hl.group("renderCriteriaTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!Ke(i)) {
      const d = E(
        "EIDOLON.SceneCriteria.Unavailable",
        "Scene criteria are unavailable for this configuration sheet."
      );
      e.innerHTML = `<p class="notes">${d}</p>`;
      return;
    }
    const o = vt(i).sort((d, m) => d.order - m.order), s = ra(i, o), l = ((a = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : a.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof l != "function") {
      e.innerHTML = `<p class="notes">${E("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
      return;
    }
    const u = await l(Ah, {
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
        var f, g;
        return {
          id: d.id,
          label: d.label,
          displayName: ((g = (f = d.label) == null ? void 0 : f.trim) == null ? void 0 : g.call(f)) || E("EIDOLON.SceneCriteria.UnnamedCategory", "Unnamed Criterion"),
          hasValues: d.values.length > 0,
          values: d.values.map((p) => ({
            value: p,
            isCurrent: (s[d.key] ?? d.default) === p
          })),
          valueCountLabel: $h(d.values.length),
          canMoveUp: m > 0,
          canMoveDown: m < o.length - 1
        };
      }),
      hasCriteria: o.length > 0
    });
    e.innerHTML = u, xh(t, e, i);
  } catch (o) {
    console.error(`${Le} | Failed to render criteria tab`, o), e.innerHTML = `<p class="notes">${E("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
  } finally {
    hl.groupEnd();
  }
}
c(xi, "renderCriteriaTabContent");
function xh(t, e, n) {
  const i = n ?? Qt(t);
  if (!Ke(i)) return;
  const r = e.querySelector('[data-criteria-action="add"]');
  r && r.addEventListener("click", () => {
    Kc(t, {
      scene: i,
      criterion: cc(
        E("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion")
      ),
      isNew: !0,
      onSave: /* @__PURE__ */ c(() => xi(t, e, i), "onSave")
    });
  }), e.querySelectorAll('[data-criteria-action="edit"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", () => {
      const s = vt(i).find((l) => l.id === o);
      s && Kc(t, {
        scene: i,
        criterion: s,
        onSave: /* @__PURE__ */ c(() => xi(t, e, i), "onSave")
      });
    });
  }), e.querySelectorAll('[data-criteria-action="remove"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await bs(i, (l) => {
        const u = l.findIndex((d) => d.id === o);
        return u < 0 ? !1 : (l.splice(u, 1), vs(l), !0);
      }) && await xi(t, e, i);
    });
  }), e.querySelectorAll('[data-criteria-action="move-up"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await bs(i, (l) => {
        const u = l.findIndex((m) => m.id === o);
        if (u <= 0) return !1;
        const [d] = l.splice(u, 1);
        return l.splice(u - 1, 0, d), vs(l), !0;
      }) && await xi(t, e, i);
    });
  }), e.querySelectorAll('[data-criteria-action="move-down"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await bs(i, (l) => {
        const u = l.findIndex((m) => m.id === o);
        if (u < 0 || u >= l.length - 1) return !1;
        const [d] = l.splice(u, 1);
        return l.splice(u + 1, 0, d), vs(l), !0;
      }) && await xi(t, e, i);
    });
  });
}
c(xh, "bindCriteriaTabEvents");
async function bs(t, e) {
  const n = vt(t).sort((r, a) => r.order - a.order);
  if (e(n) === !1) return !1;
  try {
    return await Jo(t, n), !0;
  } catch (r) {
    return _d(r), !1;
  }
}
c(bs, "mutateCriteria");
function Kc(t, e = {}) {
  const n = e.scene ?? null, i = n && Ke(n) ? n : Qt(t);
  if (!Ke(i))
    return;
  kh({
    scene: i,
    criterion: e.criterion ?? null,
    isNew: !!e.isNew,
    onSave: typeof e.onSave == "function" ? e.onSave : null
  }).render({ force: !0 });
}
c(Kc, "openCriterionEditor");
function vs(t) {
  t.forEach((e, n) => {
    e.order = n;
  });
}
c(vs, "reindexCriteriaOrder");
function $h(t) {
  var e, n;
  if ((n = (e = game.i18n) == null ? void 0 : e.has) != null && n.call(e, "EIDOLON.SceneCriteria.ValueCountLabel"))
    try {
      return game.i18n.format("EIDOLON.SceneCriteria.ValueCountLabel", { count: t });
    } catch (i) {
      console.error(`${Le} | Failed to format value count label`, i);
    }
  return t === 0 ? "No values configured" : t === 1 ? "1 value" : `${t} values`;
}
c($h, "formatValueCount");
let Xc = !1;
function Fh() {
  Hooks.once("init", () => {
    Sh();
  }), Hooks.once("ready", () => {
    Yo() && (Xc || (_h(), Xc = !0));
  });
}
c(Fh, "registerSceneCriteriaHooks");
Fh();
const te = T, $d = "criteriaEngineVersion", bi = "fileIndex", vi = "tileCriteria", dc = {
  LEGACY: 1,
  CRITERIA: 2
}, Fd = dc.CRITERIA;
function Dd(t) {
  var e;
  return ((e = t == null ? void 0 : t.getFlag) == null ? void 0 : e.call(t, te, $d)) ?? dc.LEGACY;
}
c(Dd, "getSceneEngineVersion");
function Dh(t, e, n, i, r) {
  if (!(t != null && t.length) || !(n != null && n.length)) return -1;
  const a = {};
  for (const s of n)
    a[s] = e[s];
  const o = Qc(t, a, n);
  if (o >= 0) return o;
  if (i != null && i.length && r) {
    const s = { ...a };
    for (const l of i) {
      if (!(l in s)) continue;
      s[l] = r[l] ?? "Standard";
      const u = Qc(t, s, n);
      if (u >= 0) return u;
    }
  }
  return -1;
}
c(Dh, "findBestMatch");
function Qc(t, e, n) {
  return t.findIndex((i) => {
    for (const r of n)
      if (i[r] !== e[r]) return !1;
    return !0;
  });
}
c(Qc, "findExactMatch");
function Ph(t, e) {
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
c(Ph, "findFileIndex");
function Aa(t) {
  return t && typeof t == "object" && !Array.isArray(t);
}
c(Aa, "isPlainObject$2");
function Zc(t) {
  return t == null ? t : typeof structuredClone == "function" ? structuredClone(t) : JSON.parse(JSON.stringify(t));
}
c(Zc, "deepClone");
function Rh(t, e) {
  if (!e) return;
  const n = e.split(".").filter(Boolean);
  if (!n.length) return;
  let i = t;
  for (let r = 0; r < n.length - 1; r += 1) {
    if (!Aa(i == null ? void 0 : i[n[r]])) return;
    i = i[n[r]];
  }
  delete i[n.at(-1)];
}
c(Rh, "deletePath");
function Pd(t, e) {
  const n = Zc(t ?? {});
  if (!Aa(e)) return n;
  for (const [i, r] of Object.entries(e)) {
    if (i.startsWith("-=") && r === !0) {
      Rh(n, i.slice(2));
      continue;
    }
    Aa(r) && Aa(n[i]) ? n[i] = Pd(n[i], r) : n[i] = Zc(r);
  }
  return n;
}
c(Pd, "fallbackMerge");
function Hh(t, e) {
  var n, i;
  return (n = foundry == null ? void 0 : foundry.utils) != null && n.mergeObject && ((i = foundry == null ? void 0 : foundry.utils) != null && i.deepClone) ? foundry.utils.mergeObject(t, foundry.utils.deepClone(e), {
    inplace: !1
  }) : Pd(t, e);
}
c(Hh, "defaultMerge");
function qh(t, e) {
  if (!t) return !0;
  for (const n of Object.keys(t))
    if (t[n] !== e[n]) return !1;
  return !0;
}
c(qh, "criteriaMatch");
function Rd(t, e, n, i) {
  const r = i ?? Hh;
  let a = r({}, t ?? {});
  if (!(e != null && e.length)) return a;
  const o = [];
  for (let s = 0; s < e.length; s += 1) {
    const l = e[s];
    if (qh(l == null ? void 0 : l.criteria, n)) {
      const u = l != null && l.criteria ? Object.keys(l.criteria).length : 0;
      o.push({ specificity: u, index: s, delta: l == null ? void 0 : l.delta });
    }
  }
  o.sort((s, l) => s.specificity - l.specificity || s.index - l.index);
  for (const s of o)
    s.delta && (a = r(a, s.delta));
  return a;
}
c(Rd, "resolveRules");
function Ko(t = null) {
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
c(Ko, "canManageCriteria");
function jh(t = null) {
  if (!Ko(t))
    throw new Error(`${te} | You do not have permission to manage scene criteria.`);
}
c(jh, "requireCriteriaAccess");
const eu = 200;
function Hd(t) {
  return t ? Number.isInteger(t.size) ? t.size : Array.isArray(t) || typeof t.length == "number" ? t.length : Array.from(t).length : 0;
}
c(Hd, "getCollectionSize");
function Ft() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
c(Ft, "nowMs");
function qd(t) {
  if (!Array.isArray(t)) return [];
  const e = /* @__PURE__ */ new Set();
  for (const n of t) {
    if (typeof n != "string") continue;
    const i = n.trim();
    i && e.add(i);
  }
  return Array.from(e);
}
c(qd, "uniqueStringKeys");
function Bh(t, e = eu) {
  if (!Array.isArray(t) || t.length === 0) return [];
  const n = Number.isInteger(e) && e > 0 ? e : eu, i = [];
  for (let r = 0; r < t.length; r += n)
    i.push(t.slice(r, r + n));
  return i;
}
c(Bh, "chunkArray");
function Pi(t) {
  return !!t && typeof t == "object" && !Array.isArray(t);
}
c(Pi, "isPlainObject$1");
function gl(t, e) {
  if (Object.is(t, e)) return !0;
  if (Array.isArray(t) || Array.isArray(e)) {
    if (!Array.isArray(t) || !Array.isArray(e) || t.length !== e.length) return !1;
    for (let n = 0; n < t.length; n += 1)
      if (!gl(t[n], e[n])) return !1;
    return !0;
  }
  if (Pi(t) || Pi(e)) {
    if (!Pi(t) || !Pi(e)) return !1;
    const n = Object.keys(e);
    for (const i of n)
      if (!gl(t[i], e[i])) return !1;
    return !0;
  }
  return !1;
}
c(gl, "areValuesEqual");
function Ya(t) {
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
c(Ya, "normalizeFilePath");
function jd(t) {
  return typeof (t == null ? void 0 : t.name) == "string" ? t.name : typeof (t == null ? void 0 : t.src) == "string" ? t.src : "";
}
c(jd, "getFilePath");
function fc(t) {
  if (!Array.isArray(t)) return [];
  const e = /* @__PURE__ */ new Map();
  return t.map((n, i) => {
    const r = Ya(jd(n)), a = r || `__index:${i}`, o = e.get(a) ?? 0;
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
c(fc, "buildTileFileEntries");
function Bn(t, e) {
  if (!Number.isInteger(e) || e < 0) return null;
  const i = fc(t).find((r) => r.index === e);
  return i ? { ...i.target } : { indexHint: e };
}
c(Bn, "createTileTargetFromIndex");
function Xo(t) {
  if (!t || typeof t != "object") return null;
  const e = Ya(t.path), n = Number(t.indexHint ?? t.fileIndex), i = Number(t.occurrence), r = {};
  return e && (r.path = e, r.occurrence = Number.isInteger(i) && i >= 0 ? i : 0), Number.isInteger(n) && n >= 0 && (r.indexHint = n), !r.path && !Number.isInteger(r.indexHint) ? null : r;
}
c(Xo, "normalizeTileTarget");
function _r(t, e) {
  const n = Xo(t);
  if (!n) return -1;
  const i = fc(e);
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
c(_r, "resolveTileTargetIndex");
function Un(t) {
  if (!t || typeof t != "object" || Array.isArray(t)) return {};
  const e = {};
  for (const [n, i] of Object.entries(t))
    typeof n != "string" || !n || typeof i != "string" || !i.trim() || (e[n] = i.trim());
  return e;
}
c(Un, "sanitizeCriteria");
function Uh(t) {
  return Object.entries(Un(t)).sort(([n], [i]) => n.localeCompare(i)).map(([n, i]) => `${n}=${i}`).join("");
}
c(Uh, "serializeCriteria");
function Vh(t) {
  return Object.keys(Un(t)).length;
}
c(Vh, "getCriteriaSpecificity");
function zh(t, e) {
  const n = Un(t), i = Un(e);
  for (const [r, a] of Object.entries(n))
    if (r in i && i[r] !== a)
      return !1;
  return !0;
}
c(zh, "areCriteriaCompatible");
function Gh(t, e) {
  const n = _r(t, e);
  if (Number.isInteger(n) && n >= 0)
    return `index:${n}`;
  const i = Xo(t);
  if (!i) return "";
  if (i.path) {
    const r = Number.isInteger(i.occurrence) ? i.occurrence : 0;
    return `path:${i.path}#${r}`;
  }
  return Number.isInteger(i.indexHint) ? `hint:${i.indexHint}` : "";
}
c(Gh, "getTargetIdentity");
function Bd(t, e = {}) {
  var s;
  const n = Array.isArray(e.files) ? e.files : [], i = Ti(t, { files: n });
  if (!((s = i == null ? void 0 : i.variants) != null && s.length))
    return {
      errors: [],
      warnings: []
    };
  const r = i.variants.map((l, u) => ({
    index: u,
    criteria: Un(l.criteria),
    specificity: Vh(l.criteria),
    criteriaSignature: Uh(l.criteria),
    targetIdentity: Gh(l.target, n)
  })), a = [], o = [];
  for (let l = 0; l < r.length; l += 1) {
    const u = r[l];
    for (let d = l + 1; d < r.length; d += 1) {
      const m = r[d];
      if (u.specificity !== m.specificity || !zh(u.criteria, m.criteria)) continue;
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
c(Bd, "detectTileCriteriaConflicts");
function Wh(t, e) {
  if (!t || typeof t != "object") return null;
  let n = Xo(t.target);
  if (!n) {
    const i = Number(t.fileIndex);
    Number.isInteger(i) && i >= 0 && (n = Bn(e, i));
  }
  return n ? {
    criteria: Un(t.criteria),
    target: n
  } : null;
}
c(Wh, "normalizeTileVariant");
function Ud(t, e = {}) {
  if (!Array.isArray(t) || t.length === 0) return null;
  const n = Array.isArray(e.files) ? e.files : null, i = t.map((l, u) => ({
    criteria: Un(l),
    target: Bn(n, u)
  })).filter((l) => l.target);
  if (!i.length) return null;
  const r = i.find((l) => Object.keys(l.criteria).length === 0), a = (r == null ? void 0 : r.target) ?? i[0].target;
  let o = null;
  const s = Number(e.defaultFileIndex);
  return Number.isInteger(s) && s >= 0 && (o = Bn(n, s)), o || (o = a), {
    strategy: "select-one",
    variants: i,
    defaultTarget: o
  };
}
c(Ud, "buildTileCriteriaFromFileIndex");
function Ti(t, e = {}) {
  const n = Array.isArray(e.files) ? e.files : null;
  if (Array.isArray(t))
    return Ud(t, { files: n });
  if (!t || typeof t != "object") return null;
  const i = Array.isArray(t.variants) ? t.variants.map((a) => Wh(a, n)).filter(Boolean) : [];
  if (!i.length) return null;
  let r = Xo(t.defaultTarget);
  if (!r) {
    const a = Number(t.defaultFileIndex);
    Number.isInteger(a) && a >= 0 && (r = Bn(n, a));
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
c(Ti, "normalizeTileCriteria");
let Ja = /* @__PURE__ */ new WeakMap();
function Yh(t, e) {
  const n = Ti(t, { files: e });
  if (!n) return null;
  const i = n.variants.map((a) => {
    const o = Un(a.criteria), s = _r(a.target, e);
    return !Number.isInteger(s) || s < 0 ? null : {
      criteria: o,
      keys: Object.keys(o),
      targetIndex: s
    };
  }).filter(Boolean), r = _r(n.defaultTarget, e);
  return !i.length && (!Number.isInteger(r) || r < 0) ? null : {
    variants: i,
    defaultIndex: r
  };
}
c(Yh, "compileTileMatcher");
function Jh(t, e, n) {
  const i = Ja.get(t);
  if (i && i.tileCriteria === e && i.files === n)
    return i.compiled;
  const r = Yh(e, n);
  return Ja.set(t, {
    tileCriteria: e,
    files: n,
    compiled: r
  }), r;
}
c(Jh, "getCompiledTileMatcher");
function Kh(t, e) {
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
c(Kh, "selectTileFileIndexFromCompiled");
function tu(t = null) {
  t ? Ja.delete(t) : Ja = /* @__PURE__ */ new WeakMap();
}
c(tu, "invalidateTileMatcherCache");
function Xh({ extractKeys: t, label: e = "doc" }) {
  let n = /* @__PURE__ */ new WeakMap();
  function i(s, l) {
    const u = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Set();
    for (const m of l) {
      const f = t(m);
      if (f) {
        d.add(m.id);
        for (const g of f)
          u.has(g) || u.set(g, /* @__PURE__ */ new Set()), u.get(g).add(m.id);
      }
    }
    return { collection: l, keyToDocIds: u, allDocIds: d };
  }
  c(i, "build");
  function r(s, l) {
    const u = n.get(s);
    if ((u == null ? void 0 : u.collection) === l) return u;
    const d = i(s, l);
    return n.set(s, d), d;
  }
  c(r, "get");
  function a(s, l, u) {
    const d = qd(u), m = r(s, l);
    if (!d.length)
      return typeof (l == null ? void 0 : l.get) == "function" ? Array.from(m.allDocIds).map((g) => l.get(g)).filter(Boolean) : Array.from(l ?? []).filter((g) => m.allDocIds.has(g.id));
    const f = /* @__PURE__ */ new Set();
    for (const g of d) {
      const p = m.keyToDocIds.get(g);
      if (p)
        for (const y of p) f.add(y);
    }
    return f.size ? typeof (l == null ? void 0 : l.get) == "function" ? Array.from(f).map((g) => l.get(g)).filter(Boolean) : Array.from(l ?? []).filter((g) => f.has(g.id)) : [];
  }
  c(a, "getAffectedDocs");
  function o(s = null) {
    s ? n.delete(s) : n = /* @__PURE__ */ new WeakMap();
  }
  return c(o, "invalidate"), { getAffectedDocs: a, invalidate: o };
}
c(Xh, "createDependencyIndexManager");
async function Vd(t, e, n, i) {
  const r = Bh(n, i);
  for (const a of r)
    await t.updateEmbeddedDocuments(e, a), r.length > 1 && await Promise.resolve();
  return r.length;
}
c(Vd, "updateDocumentsInChunks");
const Qh = /* @__PURE__ */ c((...t) => console.log(`${te} | criteria tiles:`, ...t), "log$1"), zd = Xh({
  label: "tile",
  extractKeys(t) {
    var r;
    const e = t.getFlag(te, vi) ?? t.getFlag(te, bi);
    if (!e) return null;
    const n = Ti(e, { files: null });
    if (!((r = n == null ? void 0 : n.variants) != null && r.length)) return [];
    const i = [];
    for (const a of n.variants)
      for (const o of Object.keys(a.criteria ?? {}))
        o && i.push(o);
    return i;
  }
});
function Zh(t = null, e = null) {
  zd.invalidate(t ?? void 0), e ? tu(e) : t || tu(null);
}
c(Zh, "invalidateTileCriteriaCaches");
async function Gd(t, e, n = {}) {
  var l, u, d, m;
  const i = Ft(), r = {
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
    return r.durationMs = Ft() - i, r;
  const a = e.getEmbeddedCollection("Tile") ?? [];
  r.total = Hd(a);
  const o = zd.getAffectedDocs(e, a, n.changedKeys);
  if (r.scanned = o.length, !o.length)
    return r.skipped.unaffected = r.total, r.durationMs = Ft() - i, r;
  const s = [];
  for (const f of o) {
    const g = f.getFlag(te, vi) ?? f.getFlag(te, bi);
    if (!g) {
      r.skipped.noCriteria += 1;
      continue;
    }
    const p = f.getFlag("monks-active-tiles", "files");
    if (!(p != null && p.length)) {
      r.skipped.noFiles += 1;
      continue;
    }
    const y = Jh(f, g, p), b = Kh(y, t);
    if (!Number.isInteger(b) || b < 0 || b >= p.length) {
      console.warn(`${te} | Tile ${f.id} has no valid file match for state`, t), r.skipped.noMatch += 1;
      continue;
    }
    const v = b, S = Number(f.getFlag("monks-active-tiles", "fileindex")) !== v, I = p.some((F, P) => !!(F != null && F.selected) != (P === b)), A = Ya(((u = f.texture) == null ? void 0 : u.src) ?? ((m = (d = f._source) == null ? void 0 : d.texture) == null ? void 0 : m.src) ?? ""), O = jd(p[b]), x = Ya(O), M = !!x && x !== A;
    if (!I && !S && !M) {
      r.skipped.unchanged += 1;
      continue;
    }
    const D = {
      _id: f._id
    };
    I && (D["flags.monks-active-tiles.files"] = p.map((F, P) => ({
      ...F,
      selected: P === b
    }))), S && (D["flags.monks-active-tiles.fileindex"] = v), M && (D.texture = { src: O }), s.push(D), Qh(`Tile ${f.id} -> ${O}`);
  }
  return s.length > 0 && (r.chunks = await Vd(e, "Tile", s, n.chunkSize), r.updated = s.length), r.durationMs = Ft() - i, r;
}
c(Gd, "updateTiles");
const wi = T, Vi = "lightCriteria", mc = Object.freeze({
  base: null,
  mappings: [],
  current: null
});
function ws(t) {
  return t && typeof t == "object" && !Array.isArray(t);
}
c(ws, "isPlainObject");
function Wd(t, e) {
  if (!ws(e)) return {};
  const n = {};
  for (const [i, r] of Object.entries(e)) {
    const a = t == null ? void 0 : t[i];
    if (ws(r) && ws(a)) {
      const o = Wd(a, r);
      Object.keys(o).length > 0 && (n[i] = o);
    } else r !== a && (n[i] = Kt(r));
  }
  return n;
}
c(Wd, "computeDelta");
function Yd(t) {
  var n;
  const e = ((n = t == null ? void 0 : t.getFlag) == null ? void 0 : n.call(t, wi, Vi)) ?? mc;
  return Nr(e);
}
c(Yd, "getLightCriteriaState");
async function Jd(t, e) {
  const n = Nr(e);
  if (!(t != null && t.setFlag))
    return n;
  const i = n.base !== null, r = n.mappings.length > 0, a = n.current !== null;
  return !i && !r && !a ? (typeof t.unsetFlag == "function" ? await t.unsetFlag(wi, Vi) : await t.setFlag(wi, Vi, null), mc) : (await t.setFlag(wi, Vi, n), n);
}
c(Jd, "setLightCriteriaState");
async function aa(t, e) {
  if (typeof e != "function")
    throw new TypeError("updateLightCriteriaState requires an updater function.");
  const n = Kt(Yd(t)), i = await e(n);
  return Jd(t, i);
}
c(aa, "updateLightCriteriaState");
async function nu(t, e) {
  const n = Li(e);
  if (!n)
    throw new Error("Invalid light configuration payload.");
  return aa(t, (i) => ({
    ...i,
    base: n
  }));
}
c(nu, "storeBaseLighting");
async function iu(t, e, n, { label: i } = {}) {
  const r = oa(e);
  if (!r)
    throw new Error("Cannot create a mapping without at least one category selection.");
  const a = Li(n);
  if (!a)
    throw new Error("Invalid light configuration payload.");
  return aa(t, (o) => {
    const s = ir(r), l = Array.isArray(o == null ? void 0 : o.mappings) ? [...o.mappings] : [], u = l.findIndex((g) => (g == null ? void 0 : g.key) === s), d = u >= 0 ? l[u] : null, m = typeof (d == null ? void 0 : d.id) == "string" && d.id.trim() ? d.id.trim() : Xd(), f = Qo({
      id: m,
      categories: r,
      config: a,
      label: typeof i == "string" ? i : (d == null ? void 0 : d.label) ?? null,
      updatedAt: Date.now()
    });
    if (!f)
      throw new Error("Failed to sanitize criteria mapping entry.");
    return u >= 0 ? l[u] = f : l.push(f), {
      ...o,
      mappings: l
    };
  });
}
c(iu, "upsertLightCriteriaMapping");
async function eg(t, e, n, i, { replaceExisting: r = !1 } = {}) {
  const a = typeof e == "string" ? e.trim() : "";
  if (!a)
    throw new Error("A mapping id is required to retarget criteria.");
  const o = oa(n);
  if (!o)
    throw new Error("Cannot retarget mapping without at least one category selection.");
  const s = Li(i);
  if (!s)
    throw new Error("Invalid light configuration payload.");
  return aa(t, (l) => {
    const u = Array.isArray(l == null ? void 0 : l.mappings) ? [...l.mappings] : [], d = u.findIndex((v) => (v == null ? void 0 : v.id) === a);
    if (d < 0)
      throw new Error("The selected mapping no longer exists.");
    const m = ir(o), f = u.findIndex(
      (v, w) => w !== d && (v == null ? void 0 : v.key) === m
    );
    if (f >= 0 && !r)
      throw new Error("A mapping already exists for the selected criteria.");
    const g = u[d], p = Qo({
      ...g,
      id: a,
      categories: o,
      config: s,
      updatedAt: Date.now()
    });
    if (!p)
      throw new Error("Failed to sanitize updated mapping.");
    u[d] = p;
    let y = null;
    if (f >= 0) {
      const [v] = u.splice(f, 1);
      y = (v == null ? void 0 : v.id) ?? null;
    }
    let b = (l == null ? void 0 : l.current) ?? null;
    return b && typeof b == "object" && (b.mappingId === a ? b = {
      ...b,
      mappingId: a,
      categories: o,
      updatedAt: Date.now()
    } : y && b.mappingId === y && (b = {
      ...b,
      mappingId: a,
      categories: o,
      updatedAt: Date.now()
    })), {
      ...l,
      mappings: u,
      current: b
    };
  });
}
c(eg, "retargetLightCriteriaMapping");
async function tg(t, e) {
  const n = typeof e == "string" ? e.trim() : "";
  if (!n)
    throw new Error("A mapping id is required to remove a mapping.");
  return aa(t, (i) => {
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
async function Er(t, e) {
  const n = Kd(e);
  return aa(t, (i) => ({
    ...i,
    current: n
  }));
}
c(Er, "storeCurrentCriteriaSelection");
function ng(t) {
  const e = Nr(t), n = e.base ?? {}, i = [];
  for (const r of e.mappings) {
    const a = oa(r == null ? void 0 : r.categories);
    if (!a) continue;
    const o = Wd(n, (r == null ? void 0 : r.config) ?? {});
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
  const r = Nr(t), a = /* @__PURE__ */ c((l) => {
    const u = {};
    for (const [d, m] of Object.entries(l ?? {})) {
      const f = String(d ?? "").trim(), g = typeof m == "string" ? m.trim() : "";
      if (!f || !g) continue;
      if (i.has(f)) {
        u[f] = g;
        continue;
      }
      const p = n.get(f);
      p && (u[p] = g);
    }
    return Object.keys(u).length ? u : null;
  }, "remapCategories"), o = r.mappings.map((l) => {
    const u = a(l.categories);
    return u ? Qo({
      ...l,
      categories: u,
      key: ir(u)
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
  return Nr({
    ...r,
    mappings: o,
    current: s
  });
}
c(ig, "migrateLightCriteriaCategoriesToKeys");
function Nr(t) {
  var l;
  const e = Kt(t);
  if (!e || typeof e != "object")
    return Kt(mc);
  const n = Li(e.base), i = Array.isArray(e.mappings) ? e.mappings : [], r = /* @__PURE__ */ new Map();
  for (const u of i) {
    const d = Qo(u);
    d && r.set(d.key, d);
  }
  const a = Array.from(r.values()), o = new Map(a.map((u) => [u.id, u]));
  let s = Kd(e.current);
  if (s) {
    const u = s.categories && Object.keys(s.categories).length > 0;
    if (s.mappingId && !o.has(s.mappingId)) {
      const d = u ? ((l = a.find((m) => m.key === ir(s.categories))) == null ? void 0 : l.id) ?? null : null;
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
c(Nr, "sanitizeLightCriteriaState");
function Li(t) {
  const e = Kt(t);
  if (!e || typeof e != "object") return null;
  "_id" in e && delete e._id, "id" in e && delete e.id;
  const n = e.flags;
  if (n && typeof n == "object") {
    const i = n[wi];
    i && typeof i == "object" && (delete i[Vi], Object.keys(i).length === 0 && delete n[wi]), Object.keys(n).length === 0 && delete e.flags;
  }
  return e;
}
c(Li, "sanitizeLightConfigPayload");
function Qo(t) {
  if (!t || typeof t != "object") return null;
  const e = oa(t.categories);
  if (!e) return null;
  const n = Li(t.config);
  if (!n) return null;
  const i = typeof t.id == "string" && t.id.trim() ? t.id.trim() : Xd(), r = ir(e), a = {
    id: i,
    key: r,
    categories: e,
    config: n,
    updatedAt: Number.isFinite(t.updatedAt) ? Number(t.updatedAt) : Date.now()
  };
  return typeof t.label == "string" && t.label.trim() && (a.label = t.label.trim()), a;
}
c(Qo, "sanitizeCriteriaMappingEntry");
function Kd(t) {
  if (!t || typeof t != "object") return null;
  const e = typeof t.mappingId == "string" && t.mappingId.trim() ? t.mappingId.trim() : null, n = oa(t.categories);
  return !e && !n ? null : {
    mappingId: e,
    categories: n,
    updatedAt: Number.isFinite(t.updatedAt) ? Number(t.updatedAt) : Date.now()
  };
}
c(Kd, "sanitizeCurrentSelection");
function oa(t) {
  const e = {};
  if (Array.isArray(t))
    for (const n of t) {
      const i = ru((n == null ? void 0 : n.id) ?? (n == null ? void 0 : n.categoryId) ?? (n == null ? void 0 : n.category)), r = au((n == null ? void 0 : n.value) ?? (n == null ? void 0 : n.selection) ?? (n == null ? void 0 : n.label));
      !i || !r || (e[i] = r);
    }
  else if (t && typeof t == "object")
    for (const [n, i] of Object.entries(t)) {
      const r = ru(n), a = au(i);
      !r || !a || (e[r] = a);
    }
  return Object.keys(e).length > 0 ? e : null;
}
c(oa, "sanitizeCriteriaCategories");
function ir(t) {
  if (!t || typeof t != "object") return "";
  const e = Object.entries(t).filter(([, n]) => typeof n == "string" && n).map(([n, i]) => `${n}:${i}`);
  return e.sort((n, i) => n < i ? -1 : n > i ? 1 : 0), e.join("|");
}
c(ir, "computeCriteriaMappingKey");
function Xd() {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
c(Xd, "generateLightMappingId");
function ru(t) {
  if (typeof t != "string") return null;
  const e = t.trim();
  return e || null;
}
c(ru, "normalizeCategoryId");
function au(t) {
  if (typeof t != "string") return null;
  const e = t.trim();
  return e || null;
}
c(au, "normalizeCategoryValue");
const xr = [];
function Qd(t) {
  typeof t == "function" && (xr.includes(t) || xr.push(t));
}
c(Qd, "registerHiddenLightProvider");
function rg(t) {
  const e = xr.indexOf(t);
  e >= 0 && xr.splice(e, 1);
}
c(rg, "unregisterHiddenLightProvider");
function ag() {
  const t = /* @__PURE__ */ new Set();
  for (const e of xr)
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
c(ag, "getHiddenLightIds");
const hc = /* @__PURE__ */ new Map(), $r = [];
function gr(t) {
  t != null && t.tag && hc.set(t.tag, { ...t });
}
c(gr, "registerTileConvention");
function og(t) {
  hc.delete(t);
}
c(og, "unregisterTileConvention");
function Zd() {
  return hc;
}
c(Zd, "getTileConventions");
function sg(t) {
  typeof t == "function" && ($r.includes(t) || $r.push(t));
}
c(sg, "registerIndexingHook");
function lg(t) {
  const e = $r.indexOf(t);
  e >= 0 && $r.splice(e, 1);
}
c(lg, "unregisterIndexingHook");
function cg() {
  return $r;
}
c(cg, "getIndexingHooks");
const Ka = ["AmbientLight", "Wall", "AmbientSound"];
let Xa = /* @__PURE__ */ new WeakMap(), Qa = /* @__PURE__ */ new WeakMap();
function ug(t) {
  const e = /* @__PURE__ */ new Set();
  for (const n of (t == null ? void 0 : t.rules) ?? [])
    for (const i of Object.keys((n == null ? void 0 : n.criteria) ?? {}))
      i && e.add(i);
  return Array.from(e);
}
c(ug, "getPresetDependencyKeys");
function dg(t, e) {
  const n = /* @__PURE__ */ new Map();
  for (const i of Ka) {
    const r = e.get(i) ?? [], a = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Map();
    for (const s of r) {
      const l = tf(s, i);
      if (l != null && l.base) {
        a.add(s.id);
        for (const u of ug(l))
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
c(dg, "buildPlaceableDependencyIndex");
function fg(t, e) {
  const n = Qa.get(t);
  if (n && Ka.every((r) => n.collectionsByType.get(r) === e.get(r)))
    return n;
  const i = dg(t, e);
  return Qa.set(t, i), i;
}
c(fg, "getPlaceableDependencyIndex");
function mg(t, e, n) {
  if (!e || !t) return [];
  const i = qd(n);
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
c(mg, "getDocsForChangedKeys");
function ef(t, e) {
  const n = { _id: e._id };
  for (const [r, a] of Object.entries(e)) {
    if (r === "_id") continue;
    const o = t == null ? void 0 : t[r];
    if (Pi(a) && Pi(o)) {
      const s = ef(o, { _id: e._id, ...a });
      if (!s) continue;
      const l = Object.keys(s).filter((u) => u !== "_id");
      if (l.length > 0) {
        n[r] = {};
        for (const u of l)
          n[r][u] = s[u];
      }
      continue;
    }
    gl(o, a) || (n[r] = a);
  }
  return Object.keys(n).filter((r) => r !== "_id").length > 0 ? n : null;
}
c(ef, "buildChangedPayload");
function tf(t, e) {
  var s;
  const n = ((s = t == null ? void 0 : t.flags) == null ? void 0 : s[te]) ?? {}, i = (n == null ? void 0 : n.presets) ?? null, r = e === "AmbientLight" ? (n == null ? void 0 : n.lightCriteria) ?? null : null, a = Xa.get(t);
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
  return Xa.set(t, {
    type: e,
    rawPresets: i,
    rawLightCriteria: r,
    presets: o
  }), o;
}
c(tf, "getPresetsForDocument");
function hg(t = null, e = null) {
  t ? Qa.delete(t) : Qa = /* @__PURE__ */ new WeakMap(), e ? Xa.delete(e) : t || (Xa = /* @__PURE__ */ new WeakMap());
}
c(hg, "invalidatePlaceableCriteriaCaches");
async function nf(t, e, n = {}) {
  var l, u;
  const i = Ft(), r = {
    total: 0,
    scanned: 0,
    updated: 0,
    chunks: 0,
    byType: {},
    durationMs: 0
  };
  if (e = e ?? ((l = game.scenes) == null ? void 0 : l.viewed), !e)
    return r.durationMs = Ft() - i, r;
  const a = ag(), o = new Map(
    Ka.map((d) => [d, e.getEmbeddedCollection(d) ?? []])
  ), s = fg(e, o);
  for (const d of Ka) {
    const m = o.get(d) ?? [], f = {
      total: Hd(m),
      scanned: 0,
      updated: 0,
      chunks: 0
    }, g = s.byType.get(d) ?? null, p = mg(m, g, n.changedKeys);
    if (f.scanned = p.length, r.total += f.total, r.scanned += f.scanned, r.byType[d] = f, !p.length) continue;
    const y = [];
    for (const b of p) {
      const v = tf(b, d);
      if (!(v != null && v.base)) continue;
      const w = Rd(v.base, v.rules ?? [], t);
      w._id = b._id, d === "AmbientLight" && a.has(b._id) && (w.hidden = !0);
      const S = (b == null ? void 0 : b._source) ?? ((u = b == null ? void 0 : b.toObject) == null ? void 0 : u.call(b)) ?? {}, I = ef(S, w);
      I && y.push(I);
    }
    y.length > 0 && (f.chunks = await Vd(e, d, y, n.chunkSize), f.updated = y.length, r.updated += y.length, r.chunks += f.chunks, console.log(`${te} | Updated ${y.length} ${d}(s)`));
  }
  return r.durationMs = Ft() - i, r;
}
c(nf, "updatePlaceables");
const ha = /* @__PURE__ */ new Map();
function gg(t) {
  var e;
  return t = t ?? ((e = game.scenes) == null ? void 0 : e.viewed), t ? ra(t) : null;
}
c(gg, "getState");
async function pg(t, e, n = 0) {
  var g;
  const i = Ft();
  if (e = e ?? ((g = game.scenes) == null ? void 0 : g.viewed), !e) return null;
  jh(e);
  const r = vt(e);
  if (!r.length)
    return console.warn(`${te} | applyState skipped: scene has no criteria.`), null;
  const a = ra(e, r), o = uc({ ...a, ...t ?? {} }, r), s = r.filter((p) => (a == null ? void 0 : a[p.key]) !== (o == null ? void 0 : o[p.key])).map((p) => p.key), l = s.length > 0;
  l && await Lh(e, o, r);
  const u = l ? o : a, [d, m] = await Promise.all([
    Gd(u, e, { changedKeys: s }),
    nf(u, e, { changedKeys: s })
  ]), f = Ft() - i;
  return N("Criteria apply telemetry", {
    sceneId: e.id,
    changedKeys: s,
    didChange: l,
    queuedMs: n,
    durationMs: f,
    tiles: d,
    placeables: m
  }), Hooks.callAll("eidolon-utilities.criteriaStateApplied", e, u), u;
}
c(pg, "applyStateInternal");
async function rf(t, e) {
  var l;
  if (e = e ?? ((l = game.scenes) == null ? void 0 : l.viewed), !e) return null;
  const n = e.id ?? "__viewed__", i = Ft(), r = ha.get(n) ?? Promise.resolve();
  let a = null;
  const o = r.catch(() => null).then(async () => {
    const u = Ft() - i;
    return pg(t, e, u);
  });
  a = o;
  const s = o.finally(() => {
    ha.get(n) === s && ha.delete(n);
  });
  return ha.set(n, s), a;
}
c(rf, "applyState$1");
function yg(t) {
  var e;
  return t = t ?? ((e = game.scenes) == null ? void 0 : e.viewed), t ? Dd(t) : null;
}
c(yg, "getVersion");
async function af(t, e) {
  var n;
  e = e ?? ((n = game.scenes) == null ? void 0 : n.viewed), e != null && e.setFlag && await e.setFlag(te, $d, Number(t));
}
c(af, "setVersion");
async function bg(t) {
  return af(Fd, t);
}
c(bg, "markCurrentVersion");
const pr = "Standard", vg = /* @__PURE__ */ c((...t) => console.log(`${te} | criteria indexer:`, ...t), "log");
function wg() {
  gr({
    tag: "Map",
    positionMap: { 0: "mood", 1: "variant", 2: "effect" },
    positionMap4: { 0: "mood", 1: "stage", 2: "variant", 3: "effect" },
    required: !0,
    maxCount: 1
  }), gr({ tag: "Floor", positionMap: "inherit" }), gr({ tag: "Roof", positionMap: "inherit" }), gr({
    tag: "Weather",
    positionMap: { 1: "effect" }
  });
}
c(wg, "registerDefaultConventions");
function gc(t) {
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
c(gc, "parseFileTags");
function Eg(t, e, n = pr) {
  return t != null && t.length ? t.map((i) => {
    const r = gc(i == null ? void 0 : i.name);
    if (!r) return {};
    const a = {};
    for (const [o, s] of Object.entries(e)) {
      const l = r[Number(o)];
      l != null && l !== n && (a[s] = l);
    }
    return a;
  }) : [];
}
c(Eg, "buildFileIndex");
function Cg(t, e) {
  return t.map((n, i) => {
    const r = [...e[n] ?? /* @__PURE__ */ new Set()].sort(), o = r.includes(pr) ? pr : r[0] ?? pr, s = cc(n);
    return s.key = n, s.label = n.charAt(0).toUpperCase() + n.slice(1), s.values = r.length ? r : [pr], s.default = s.values.includes(o) ? o : s.values[0], s.order = i, s;
  });
}
c(Cg, "buildCriteriaDefinitions");
async function ou(t, e, n, { dryRun: i = !1 } = {}) {
  const r = t.getFlag("monks-active-tiles", "files");
  if (!(r != null && r.length)) return null;
  const a = Eg(r, e), o = Ud(a, { files: r });
  for (const s of r) {
    const l = gc(s == null ? void 0 : s.name);
    if (l)
      for (const [u, d] of Object.entries(e)) {
        const m = l[Number(u)];
        m != null && n[d] && n[d].add(m);
      }
  }
  return i || (await t.setFlag(te, vi, o), typeof t.unsetFlag == "function" && await t.unsetFlag(te, bi)), { files: r.length };
}
c(ou, "indexTile");
function su(t, e, n) {
  return t.positionMap === "inherit" ? n : e >= 4 && t.positionMap4 ? t.positionMap4 : t.positionMap;
}
c(su, "resolvePositionMap");
function Sg(t, e) {
  return e >= 4 && t.positionMap4 ? t.positionMap4 : t.positionMap;
}
c(Sg, "resolvePrimaryPositionMap");
function Tg(t) {
  if (!Array.isArray(t)) return Zd();
  const e = /* @__PURE__ */ new Map();
  for (const n of t)
    n != null && n.tag && e.set(n.tag, { ...n });
  return e;
}
c(Tg, "resolveConventions");
async function Lg(t, e = {}) {
  var w, S, I, A, O, x;
  const {
    dryRun: n = !1,
    force: i = !1
  } = e;
  if (t = t ?? ((w = game.scenes) == null ? void 0 : w.viewed), !t) throw new Error("No scene provided to indexScene.");
  if (!globalThis.Tagger) throw new Error("Tagger is required to index scene criteria.");
  if (!i && Dd(t) >= Fd)
    throw new Error(
      `Scene "${t.name}" is already criteria-indexed. Use force: true to re-index.`
    );
  const r = Tg(e.conventions), a = { sceneId: t.id };
  let o = null, s = null, l = 3;
  for (const [M, D] of r) {
    if (!D.required) continue;
    const F = Tagger.getByTag(M, a) ?? [];
    if (!F.length) throw new Error(`No ${M} tile found.`);
    if (D.maxCount && F.length > D.maxCount)
      throw new Error(`Expected ${D.maxCount} ${M} tile(s), found ${F.length}.`);
    o = D, s = F[0];
    const P = s.getFlag("monks-active-tiles", "files");
    if (!(P != null && P.length)) throw new Error(`${M} tile has no MATT files.`);
    const _ = gc((S = P[0]) == null ? void 0 : S.name);
    if (!(_ != null && _.length))
      throw new Error(`Cannot parse bracket tags from: ${((I = P[0]) == null ? void 0 : I.name) ?? "<unknown>"}`);
    if (_.length < 3)
      throw new Error(`Expected 3+ bracket tags, found ${_.length}.`);
    l = _.length;
    break;
  }
  if (!o)
    throw new Error("No required tile convention registered. Register conventions before indexing.");
  const u = Sg(o, l), d = [], m = Object.keys(u).map(Number).sort((M, D) => M - D);
  for (const M of m) {
    const D = u[M];
    d.includes(D) || d.push(D);
  }
  const f = {};
  for (const M of d)
    f[M] = /* @__PURE__ */ new Set();
  for (const [, M] of r) {
    if (M.positionMap === "inherit") continue;
    const D = su(M, l, u);
    for (const F of Object.values(D))
      f[F] || (f[F] = /* @__PURE__ */ new Set(), d.includes(F) || d.push(F));
  }
  const g = {}, p = cg();
  for (const [M, D] of r) {
    const F = Tagger.getByTag(M, a) ?? [], P = su(D, l, u), _ = M.toLowerCase(), H = [];
    for (const q of F) {
      const j = await ou(q, P, f, { dryRun: n });
      j && H.push(j);
    }
    g[_] = D.maxCount === 1 ? H[0] ?? null : H;
  }
  if (p.length > 0) {
    const M = t.getEmbeddedCollection("Tile") ?? [], D = new Set(r.keys());
    for (const F of M) {
      if ((((O = (A = globalThis.Tagger) == null ? void 0 : A.getTags) == null ? void 0 : O.call(A, F)) ?? []).some((q) => D.has(q))) continue;
      const H = F.getFlag("monks-active-tiles", "files");
      if (H != null && H.length)
        for (const q of p)
          try {
            const j = q(t, F, H);
            if (j != null && j.positionMap) {
              await ou(F, j.positionMap, f, { dryRun: n });
              break;
            }
          } catch (j) {
            console.warn(`${te} | Indexing hook error:`, j);
          }
    }
  }
  const y = Cg(d, f);
  n || (await Jo(t, y), await bg(t));
  const b = o.tag.toLowerCase();
  vg(
    n ? "Dry run complete" : "Indexing complete",
    `- ${y.length} criteria,`,
    `${((x = g[b]) == null ? void 0 : x.files) ?? 0} ${o.tag.toLowerCase()} files`
  );
  const v = Array.from(r.keys()).filter((M) => M !== o.tag).some((M) => {
    const D = g[M.toLowerCase()];
    return Array.isArray(D) ? D.length > 0 : !!D;
  });
  return {
    criteria: y,
    state: y.reduce((M, D) => (M[D.key] = D.default, M), {}),
    tiles: g,
    overlayMode: v
  };
}
c(Lg, "indexScene");
var Vu, je, ht, gt, mi, et, zt, In, Bo, ue, of, sf, lf, yl, cf, bl, uf, yr, vl;
const Tt = class Tt extends Yn(Wn) {
  constructor(n = {}) {
    var i;
    super(n);
    k(this, ue);
    k(this, je, null);
    k(this, ht, []);
    k(this, gt, {});
    k(this, mi, !1);
    k(this, et, null);
    k(this, zt, null);
    k(this, In, null);
    k(this, Bo, 120);
    this.setScene(n.scene ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null);
  }
  setScene(n) {
    var i;
    L(this, je, n ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null), C(this, ue, of).call(this);
  }
  get scene() {
    return h(this, je);
  }
  async _prepareContext() {
    var r;
    const n = !!h(this, je), i = n && h(this, ht).length > 0;
    return {
      hasScene: n,
      hasCriteria: i,
      sceneName: ((r = h(this, je)) == null ? void 0 : r.name) ?? E("EIDOLON.CriteriaSwitcher.NoScene", "No active scene"),
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
      criteria: h(this, ht).map((a) => ({
        key: a.key,
        label: a.label || a.key,
        values: a.values.map((o) => {
          var s;
          return {
            value: o,
            selected: ((s = h(this, gt)) == null ? void 0 : s[a.key]) === o
          };
        }),
        defaultValue: a.default
      })),
      stateSummary: C(this, ue, vl).call(this)
    };
  }
  _onRender(n, i) {
    super._onRender(n, i), C(this, ue, sf).call(this), C(this, ue, lf).call(this);
  }
  async _onClose(n) {
    return h(this, et) !== null && (clearTimeout(h(this, et)), L(this, et, null)), h(this, In) !== null && (Hooks.off("eidolon-utilities.criteriaStateApplied", h(this, In)), L(this, In, null)), super._onClose(n);
  }
};
je = new WeakMap(), ht = new WeakMap(), gt = new WeakMap(), mi = new WeakMap(), et = new WeakMap(), zt = new WeakMap(), In = new WeakMap(), Bo = new WeakMap(), ue = new WeakSet(), of = /* @__PURE__ */ c(function() {
  if (!h(this, je)) {
    L(this, ht, []), L(this, gt, {});
    return;
  }
  L(this, ht, vt(h(this, je)).sort((n, i) => n.order - i.order)), L(this, gt, ra(h(this, je), h(this, ht)));
}, "#hydrateFromScene"), sf = /* @__PURE__ */ c(function() {
  var i, r;
  const n = this.element;
  n instanceof HTMLElement && (n.querySelectorAll("[data-criteria-key]").forEach((a) => {
    a.addEventListener("change", (o) => {
      const s = o.currentTarget;
      if (!(s instanceof HTMLSelectElement)) return;
      const l = s.dataset.criteriaKey;
      l && (L(this, gt, {
        ...h(this, gt),
        [l]: s.value
      }), C(this, ue, cf).call(this, { [l]: s.value }));
    });
  }), (i = n.querySelector("[data-action='reset-defaults']")) == null || i.addEventListener("click", () => {
    C(this, ue, uf).call(this);
  }), (r = n.querySelector("[data-action='close-switcher']")) == null || r.addEventListener("click", () => {
    this.close();
  }));
}, "#bindEvents"), lf = /* @__PURE__ */ c(function() {
  h(this, In) === null && L(this, In, Hooks.on("eidolon-utilities.criteriaStateApplied", (n, i) => {
    !h(this, je) || (n == null ? void 0 : n.id) !== h(this, je).id || h(this, mi) || (L(this, gt, { ...i ?? {} }), this.render({ force: !0 }));
  }));
}, "#ensureSyncHook"), yl = /* @__PURE__ */ c(async function(n) {
  var i, r;
  if (h(this, je)) {
    C(this, ue, yr).call(this, "applying"), L(this, mi, !0);
    try {
      const a = await rf(n, h(this, je));
      a && L(this, gt, a), C(this, ue, yr).call(this, "ready"), this.render({ force: !0 });
    } catch (a) {
      console.error(`${te} | Failed to apply criteria state`, a), (r = (i = ui.notifications) == null ? void 0 : i.error) == null || r.call(
        i,
        E(
          "EIDOLON.CriteriaSwitcher.ApplyError",
          "Failed to apply the selected criteria state."
        )
      ), C(this, ue, yr).call(this, "error", (a == null ? void 0 : a.message) ?? "Unknown error");
    } finally {
      L(this, mi, !1), h(this, zt) && C(this, ue, bl).call(this);
    }
  }
}, "#applyPartialState"), cf = /* @__PURE__ */ c(function(n) {
  L(this, zt, {
    ...h(this, zt) ?? {},
    ...n ?? {}
  }), h(this, et) !== null && clearTimeout(h(this, et)), C(this, ue, yr).call(this, "applying"), L(this, et, setTimeout(() => {
    L(this, et, null), C(this, ue, bl).call(this);
  }, h(this, Bo)));
}, "#queuePartialState"), bl = /* @__PURE__ */ c(async function() {
  if (h(this, mi) || !h(this, zt)) return;
  const n = h(this, zt);
  L(this, zt, null), await C(this, ue, yl).call(this, n);
}, "#flushPendingState"), uf = /* @__PURE__ */ c(async function() {
  if (!h(this, ht).length) return;
  const n = h(this, ht).reduce((i, r) => (i[r.key] = r.default, i), {});
  L(this, gt, n), h(this, et) !== null && (clearTimeout(h(this, et)), L(this, et, null)), L(this, zt, null), await C(this, ue, yl).call(this, n);
}, "#resetToDefaults"), yr = /* @__PURE__ */ c(function(n, i = "") {
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
        a.textContent = `${E("EIDOLON.CriteriaSwitcher.Ready", "Ready")}: ${C(this, ue, vl).call(this)}`;
        break;
    }
}, "#setStatus"), vl = /* @__PURE__ */ c(function() {
  return h(this, ht).length ? `[${h(this, ht).map((n) => {
    var i;
    return ((i = h(this, gt)) == null ? void 0 : i[n.key]) ?? n.default;
  }).join(" | ")}]` : "-";
}, "#formatStateSummary"), c(Tt, "CriteriaSwitcherApplication"), be(Tt, "APP_ID", `${te}-criteria-switcher`), be(Tt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  He(Tt, Tt, "DEFAULT_OPTIONS"),
  {
    id: Tt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Vu = He(Tt, Tt, "DEFAULT_OPTIONS")) == null ? void 0 : Vu.classes) ?? [], "eidolon-criteria-switcher-window", "themed"])
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
)), be(Tt, "PARTS", {
  content: {
    template: `modules/${te}/templates/criteria-switcher.html`
  }
});
let pl = Tt;
const Ig = Wo(pl);
let Ei = null;
function Og(t) {
  var e;
  return t ?? ((e = game.scenes) == null ? void 0 : e.viewed) ?? null;
}
c(Og, "resolveScene");
function Ag(t) {
  var e;
  return !!(t != null && t.rendered && ((e = t == null ? void 0 : t.element) != null && e.isConnected));
}
c(Ag, "isRendered");
function Zo() {
  return Ag(Ei) ? Ei : (Ei = null, null);
}
c(Zo, "getCriteriaSwitcher");
function df(t) {
  var i, r, a, o, s;
  const e = Og(t);
  if (!e)
    return (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "No active scene to open the criteria switcher."), null;
  if (!Ko(e))
    return (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, "You do not have permission to manage scene criteria."), null;
  const n = Zo();
  return n ? (n.setScene(e), n.render({ force: !0 }), (s = n.bringToFront) == null || s.call(n), n) : (Ei = Ig({ scene: e }), Ei.render({ force: !0 }), Ei);
}
c(df, "openCriteriaSwitcher");
function ff() {
  const t = Zo();
  t && (t.close(), Ei = null);
}
c(ff, "closeCriteriaSwitcher");
function pc(t) {
  return Zo() ? (ff(), null) : df(t);
}
c(pc, "toggleCriteriaSwitcher");
const kg = {
  SCHEMA_VERSION: dc,
  applyState: rf,
  getState: gg,
  getVersion: yg,
  setVersion: af,
  getCriteria(t) {
    var e;
    return vt(t ?? ((e = game.scenes) == null ? void 0 : e.viewed));
  },
  setCriteria(t, e) {
    var n;
    return Jo(e ?? ((n = game.scenes) == null ? void 0 : n.viewed), t);
  },
  updateTiles: Gd,
  updatePlaceables: nf,
  indexScene: Lg,
  openCriteriaSwitcher: df,
  closeCriteriaSwitcher: ff,
  toggleCriteriaSwitcher: pc,
  findBestMatch: Dh,
  findFileIndex: Ph,
  resolveRules: Rd,
  // Convention registration API
  registerTileConvention: gr,
  unregisterTileConvention: og,
  getTileConventions: Zd,
  // Hidden light provider API
  registerHiddenLightProvider: Qd,
  unregisterHiddenLightProvider: rg,
  // Indexing hook API
  registerIndexingHook: sg,
  unregisterIndexingHook: lg
};
function Mg(t) {
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
c(Mg, "findTabNav");
function _g(t, e) {
  var i, r, a;
  return t instanceof HTMLElement ? [
    (i = t.querySelector(".tab[data-tab]")) == null ? void 0 : i.parentElement,
    t.querySelector(".sheet-body"),
    (a = (r = e == null ? void 0 : e.parentElement) == null ? void 0 : r.querySelector) == null ? void 0 : a.call(r, ":scope > .sheet-body"),
    e == null ? void 0 : e.parentElement
  ].find((o) => o instanceof HTMLElement) ?? null : null;
}
c(_g, "findTabBody");
function Ng(t, e) {
  var n, i, r, a, o, s, l;
  return ((n = t == null ? void 0 : t.dataset) == null ? void 0 : n.group) ?? ((a = (r = (i = t == null ? void 0 : t.querySelector) == null ? void 0 : i.call(t, "[data-group]")) == null ? void 0 : r.dataset) == null ? void 0 : a.group) ?? ((l = (s = (o = e == null ? void 0 : e.querySelector) == null ? void 0 : o.call(e, ".tab[data-group]")) == null ? void 0 : s.dataset) == null ? void 0 : l.group) ?? "main";
}
c(Ng, "getTabGroup");
function xg(t, e, n) {
  if (!(t instanceof HTMLElement)) return;
  t.textContent = "";
  const i = document.createElement("i");
  i.className = n, i.setAttribute("inert", ""), t.append(i, " ");
  const r = document.createElement("span");
  r.textContent = e, t.append(r);
}
c(xg, "setTabButtonContent");
function $g(t, e, n) {
  const i = t.querySelector("[data-tab]"), r = (i == null ? void 0 : i.tagName) || "A", a = document.createElement(r);
  return i instanceof HTMLElement && (a.className = i.className), a.classList.remove("active"), r === "BUTTON" && (a.type = "button"), a.dataset.action = "tab", a.dataset.tab = n, a.dataset.group = e, a.setAttribute("aria-selected", "false"), a.setAttribute("aria-pressed", "false"), a;
}
c($g, "createTabButton");
function Fg(t, e, n) {
  const i = document.createElement("div");
  i.classList.add("tab"), i.dataset.tab = n, i.dataset.group = e, i.dataset.applicationPart = n, i.setAttribute("hidden", "true");
  const r = Ld(t);
  return t.insertBefore(i, r ?? null), i;
}
c(Fg, "createTabPanel");
function Es(t, e, n, i, r) {
  var s;
  if (!(i instanceof HTMLElement) || !(r instanceof HTMLElement)) return;
  const a = (s = t == null ? void 0 : t.tabGroups) == null ? void 0 : s[e];
  if (typeof a == "string" ? a === n : i.classList.contains("active") || r.classList.contains("active")) {
    i.classList.add("active"), i.setAttribute("aria-selected", "true"), i.setAttribute("aria-pressed", "true"), r.classList.add("active"), r.removeAttribute("hidden"), r.removeAttribute("aria-hidden");
    return;
  }
  i.classList.remove("active"), i.setAttribute("aria-selected", "false"), i.setAttribute("aria-pressed", "false"), r.classList.remove("active"), r.setAttribute("hidden", "true");
}
c(Es, "syncTabVisibility");
function mf(t, e, n, i, r) {
  const a = Mg(e), o = _g(e, a);
  if (!(a instanceof HTMLElement) || !(o instanceof HTMLElement)) return null;
  const s = Ng(a, o);
  let l = a.querySelector(`[data-tab="${n}"]`);
  l instanceof HTMLElement || (l = $g(a, s, n), a.appendChild(l)), xg(l, i, r);
  let u = o.querySelector(`.tab[data-tab="${n}"]`);
  u instanceof HTMLElement || (u = Fg(o, s, n));
  const d = `data-eidolon-bound-${n}`;
  return l.hasAttribute(d) || (l.addEventListener("click", () => {
    Sd(t, n, s), requestAnimationFrame(() => {
      Es(t, s, n, l, u);
    });
  }), l.setAttribute(d, "true")), Es(t, s, n, l, u), requestAnimationFrame(() => {
    Es(t, s, n, l, u);
  }), Dg(t, a), u;
}
c(mf, "ensureTileConfigTab");
function Dg(t, e) {
  !(t != null && t.setPosition) || !(e instanceof HTMLElement) || requestAnimationFrame(() => {
    var a;
    if (e.scrollWidth <= e.clientWidth) return;
    const n = e.scrollWidth - e.clientWidth, i = t.element instanceof HTMLElement ? t.element : (a = t.element) == null ? void 0 : a[0];
    if (!i) return;
    const r = i.offsetWidth || 480;
    t.setPosition({ width: r + n + 16 });
  });
}
c(Dg, "fitNavWidth");
function hf(t) {
  var e;
  return ((e = t == null ? void 0 : t.getFlag) == null ? void 0 : e.call(t, "monks-active-tiles", "files")) ?? [];
}
c(hf, "getTileFiles$1");
function Pg(t = []) {
  return {
    strategy: "select-one",
    defaultTarget: Bn(t, 0) ?? { indexHint: 0 },
    variants: [
      {
        criteria: {},
        target: Bn(t, 0) ?? { indexHint: 0 }
      }
    ]
  };
}
c(Pg, "createDefaultTileCriteria");
function Rg(t, e = {}) {
  var o, s;
  const { allowLegacy: n = !0 } = e, i = hf(t), r = (o = t == null ? void 0 : t.getFlag) == null ? void 0 : o.call(t, te, vi);
  if (r) return Ti(r, { files: i });
  if (!n) return null;
  const a = (s = t == null ? void 0 : t.getFlag) == null ? void 0 : s.call(t, te, bi);
  return a ? Ti(a, { files: i }) : null;
}
c(Rg, "getTileCriteria");
async function lu(t, e, n = {}) {
  if (!(t != null && t.setFlag)) return null;
  const {
    strictValidation: i = !0
  } = n, r = hf(t), a = Ti(e, { files: r });
  if (!a)
    return typeof t.unsetFlag == "function" ? (await t.unsetFlag(te, vi), await t.unsetFlag(te, bi)) : (await t.setFlag(te, vi, null), await t.setFlag(te, bi, null)), null;
  if (i) {
    const o = Bd(a, { files: r });
    if (o.errors.length > 0)
      throw new Error(
        `Tile criteria contains ${o.errors.length} conflicting rule pair(s). Resolve clashes before saving.`
      );
  }
  return await t.setFlag(te, vi, a), typeof t.unsetFlag == "function" && await t.unsetFlag(te, bi), a;
}
c(lu, "setTileCriteria");
const wl = "__eidolon_any__", El = "eidolon-tile-criteria", Hg = "fa-solid fa-sliders", gf = Symbol.for("eidolon.tileCriteriaUiState"), es = ["all", "unmapped", "mapped", "conflicts"];
function qg(t) {
  const e = t == null ? void 0 : t[gf];
  return !e || typeof e != "object" ? {
    filterQuery: "",
    filterMode: "all",
    selectedFileIndex: null
  } : {
    filterQuery: typeof e.filterQuery == "string" ? e.filterQuery : "",
    filterMode: es.includes(e.filterMode) ? e.filterMode : "all",
    selectedFileIndex: Number.isInteger(e.selectedFileIndex) ? e.selectedFileIndex : null
  };
}
c(qg, "readUiState");
function jg(t, e) {
  if (!t || !e) return;
  typeof e.filterQuery == "string" && (t.filterQuery = e.filterQuery), es.includes(e.filterMode) && (t.filterMode = e.filterMode), Number.isInteger(e.selectedFileIndex) && t.fileEntries.some((i) => i.index === e.selectedFileIndex) && (t.selectedFileIndex = e.selectedFileIndex);
}
c(jg, "applyUiState");
function Bg(t) {
  const e = t == null ? void 0 : t.app, n = t == null ? void 0 : t.state;
  !e || !n || (e[gf] = {
    filterQuery: typeof n.filterQuery == "string" ? n.filterQuery : "",
    filterMode: es.includes(n.filterMode) ? n.filterMode : "all",
    selectedFileIndex: Number.isInteger(n.selectedFileIndex) ? n.selectedFileIndex : null
  });
}
c(Bg, "persistUiState");
function Ug(t) {
  const e = (t == null ? void 0 : t.object) ?? (t == null ? void 0 : t.document) ?? null;
  return !(e != null && e.isEmbedded) || e.documentName !== "Tile" ? null : e;
}
c(Ug, "getTileDocument");
function Vg(t) {
  var e;
  return ((e = t == null ? void 0 : t.getFlag) == null ? void 0 : e.call(t, "monks-active-tiles", "files")) ?? [];
}
c(Vg, "getTileFiles");
function zg(t, e) {
  var s;
  const n = (t == null ? void 0 : t.parent) ?? ((s = game.scenes) == null ? void 0 : s.viewed) ?? null, r = vt(n).sort((l, u) => l.order - u.order).map((l) => ({
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
c(zg, "getCriteriaDefinitions");
function Gg(t) {
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
c(Gg, "buildTree");
function Wg(t, e) {
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
c(Wg, "collapseFolderBranch");
function Yg(t, e) {
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
c(Yg, "getRuleSummariesForFile");
function Cl(t) {
  var g, p;
  const e = Vg(t), n = fc(e), i = Rg(t, { allowLegacy: !0 }) ?? Pg(e), r = zg(t, i), a = new Map(r.map((y) => [y.key, y.label])), o = new Map(
    n.map((y) => [
      y.index,
      y.path || y.label
    ])
  ), s = _r(i.defaultTarget, e), l = ((g = n[0]) == null ? void 0 : g.index) ?? 0, u = s >= 0 ? s : l, d = new Map(n.map((y) => [y.index, []]));
  let m = 1;
  for (const y of i.variants ?? []) {
    const b = _r(y.target, e);
    b < 0 || (d.has(b) || d.set(b, []), d.get(b).push({
      id: m,
      criteria: { ...y.criteria ?? {} }
    }), m += 1);
  }
  const f = n.some((y) => y.index === u) ? u : ((p = n[0]) == null ? void 0 : p.index) ?? null;
  return {
    files: e,
    fileEntries: n,
    criteriaDefinitions: r,
    criteriaLabels: a,
    relativePaths: o,
    defaultIndex: u,
    selectedFileIndex: f,
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
c(Cl, "buildEditorState");
function Sl(t, e) {
  return t.rulesByFile.has(e) || t.rulesByFile.set(e, []), t.rulesByFile.get(e);
}
c(Sl, "getRulesForFile");
function Jg(t) {
  return Object.fromEntries(
    Object.entries(t ?? {}).filter(([e, n]) => typeof e == "string" && e && typeof n == "string" && n.trim()).map(([e, n]) => [e, n.trim()])
  );
}
c(Jg, "sanitizeRuleCriteria");
function pf(t) {
  const e = Bn(t.files, t.defaultIndex);
  if (!e) return null;
  const n = [], i = [];
  for (const [a, o] of t.rulesByFile.entries()) {
    const s = Bn(t.files, a);
    if (s)
      for (const [l, u] of o.entries()) {
        const d = Jg(u.criteria);
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
    normalized: Ti(
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
c(pf, "buildTileCriteriaDraft");
function Kg(t) {
  var e;
  return ((e = pf(t)) == null ? void 0 : e.normalized) ?? null;
}
c(Kg, "exportTileCriteria");
function cu(t) {
  const e = pf(t);
  if (!(e != null && e.normalized))
    return {
      errors: [],
      warnings: [],
      errorFileIndexes: [],
      warningFileIndexes: []
    };
  const n = Bd(e.normalized, { files: t.files }), i = /* @__PURE__ */ c((s) => {
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
c(cu, "analyzeRuleConflicts");
function ga(t, e = "neutral") {
  const n = document.createElement("span");
  return n.classList.add("eidolon-tile-criteria__badge"), n.dataset.kind = e, n.textContent = t, n;
}
c(ga, "createBadge");
function Xg(t, e = {}) {
  const n = typeof t == "string" ? t : "", {
    maxLength: i = 42,
    headLength: r = 20,
    tailLength: a = 16
  } = e;
  if (!n || n.length <= i) return n;
  const o = n.slice(0, r).trimEnd(), s = n.slice(-a).trimStart();
  return `${o}...${s}`;
}
c(Xg, "middleEllipsis");
function Qg(t) {
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
c(Qg, "createRegexFilter");
function Zg(t, e) {
  const n = document.createElement("select");
  n.dataset.criteriaKey = t.key;
  const i = document.createElement("option");
  i.value = wl, i.textContent = "*", n.appendChild(i);
  const r = new Set(t.values ?? []);
  e && !r.has(e) && r.add(e);
  for (const a of r) {
    const o = document.createElement("option");
    o.value = a, o.textContent = a, n.appendChild(o);
  }
  return n.value = e ?? wl, n;
}
c(Zg, "createCriterionSelect");
function ep(t, e, n, i) {
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
    const m = Zg(l, (s = t.criteria) == null ? void 0 : s[l.key]);
    m.addEventListener("change", () => {
      m.value === wl ? delete t.criteria[l.key] : t.criteria[l.key] = m.value, i();
    }), u.appendChild(m), a.appendChild(u);
  }
  r.appendChild(a);
  const o = document.createElement("button");
  return o.type = "button", o.classList.add("control", "ui-control", "eidolon-tile-criteria__rule-remove"), o.textContent = E("EIDOLON.TileCriteria.RemoveRule", "Remove"), o.addEventListener("click", () => {
    const u = Sl(e, n).filter((d) => d.id !== t.id);
    e.rulesByFile.set(n, u), i();
  }), r.appendChild(o), r;
}
c(ep, "renderRuleEditor");
const ka = /* @__PURE__ */ new WeakMap();
function yf(t) {
  return (t == null ? void 0 : t.app) ?? (t == null ? void 0 : t.tile) ?? null;
}
c(yf, "getDialogOwner");
function tp(t) {
  for (const e of t) {
    const n = Xt(e);
    if (n) return n;
    const i = Xt(e == null ? void 0 : e.element);
    if (i) return i;
  }
  return null;
}
c(tp, "findDialogRoot$1");
function np(t, e, n) {
  const i = t.state, r = i.fileEntries.find((y) => y.index === e);
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
    i.defaultIndex = r.index, Ye(t), n();
  })), u.appendChild(d);
  const m = document.createElement("button");
  m.type = "button", m.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action", "secondary"), m.textContent = E("EIDOLON.TileCriteria.ClearFileRules", "Clear File Rules"), m.addEventListener("click", () => {
    i.rulesByFile.set(r.index, []), Ye(t), n();
  }), u.appendChild(m), a.appendChild(u);
  const f = document.createElement("div");
  f.classList.add("eidolon-tile-criteria__rule-editors");
  const g = Sl(i, r.index);
  if (g.length)
    for (const y of g)
      f.appendChild(
        ep(y, i, r.index, () => {
          Ye(t), n();
        })
      );
  else {
    const y = document.createElement("p");
    y.classList.add("notes"), y.textContent = E(
      "EIDOLON.TileCriteria.NoRulesForFile",
      "No rules map to this file yet. Add one to define when this variant should be active."
    ), f.appendChild(y);
  }
  a.appendChild(f);
  const p = document.createElement("button");
  return p.type = "button", p.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action"), p.textContent = E("EIDOLON.TileCriteria.AddRule", "Add Rule"), p.disabled = !i.criteriaDefinitions.length, p.addEventListener("click", () => {
    Sl(i, r.index).push({
      id: i.nextRuleId,
      criteria: {}
    }), i.nextRuleId += 1, Ye(t), n();
  }), a.appendChild(p), a;
}
c(np, "buildRuleEditorContent");
function ip(t, e) {
  var m, f, g;
  const n = yf(t);
  if (!n) return;
  const i = ka.get(n);
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
  ka.set(n, r);
  const a = /* @__PURE__ */ c(() => {
    ka.delete(n);
  }, "closeDialog"), o = /* @__PURE__ */ c(() => {
    r.host instanceof HTMLElement && r.host.replaceChildren(
      np(r.controller, r.fileIndex, o)
    );
  }, "refreshDialog");
  r.refresh = o;
  const s = E("EIDOLON.TileCriteria.EditorTitle", "Edit Tile Criteria Rules"), l = '<div class="eidolon-tile-criteria-editor-host"></div>', u = E("EIDOLON.TileCriteria.CloseEditor", "Close"), d = (g = (f = foundry == null ? void 0 : foundry.applications) == null ? void 0 : f.api) == null ? void 0 : g.DialogV2;
  if (typeof (d == null ? void 0 : d.wait) == "function") {
    d.wait({
      window: { title: s },
      content: l,
      buttons: [{ action: "close", label: u, default: !0 }],
      render: /* @__PURE__ */ c((...p) => {
        var v;
        const y = tp(p), b = (v = y == null ? void 0 : y.querySelector) == null ? void 0 : v.call(y, ".eidolon-tile-criteria-editor-host");
        b instanceof HTMLElement && (r.host = b, o());
      }, "render"),
      close: a,
      rejectClose: !1
    }).catch((p) => {
      console.warn(`${te} | Rule editor dialog failed`, p), a();
    });
    return;
  }
  a();
}
c(ip, "openRuleEditorDialog");
function uu(t) {
  var i;
  const e = yf(t);
  if (!e) return;
  const n = ka.get(e);
  (i = n == null ? void 0 : n.refresh) == null || i.call(n);
}
c(uu, "refreshOpenRuleEditor");
function Tl(t, e) {
  return (t.rulesByFile.get(e) ?? []).length > 0;
}
c(Tl, "hasRulesForFile");
function bf(t, e) {
  var n, i;
  return ((n = t == null ? void 0 : t.errorFileIndexes) == null ? void 0 : n.includes(e)) || ((i = t == null ? void 0 : t.warningFileIndexes) == null ? void 0 : i.includes(e));
}
c(bf, "hasConflictForFile");
function rp(t, e, n) {
  switch (t.filterMode) {
    case "unmapped":
      return !Tl(t, e.index);
    case "mapped":
      return Tl(t, e.index);
    case "conflicts":
      return bf(n, e.index);
    case "all":
    default:
      return !0;
  }
}
c(rp, "matchesFilterMode");
function ap(t, e) {
  let n = 0, i = 0, r = 0;
  for (const a of t.fileEntries)
    Tl(t, a.index) ? n += 1 : i += 1, bf(e, a.index) && (r += 1);
  return {
    all: t.fileEntries.length,
    mapped: n,
    unmapped: i,
    conflicts: r
  };
}
c(ap, "getFilterModeCounts");
function op(t) {
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
c(op, "getFilterModeLabel");
function vf(t, e, n, i, r) {
  var u, d;
  const a = [...t.folders.keys()].sort((m, f) => m.localeCompare(f));
  for (const m of a) {
    const f = Wg(m, t.folders.get(m)), g = document.createElement("li");
    g.classList.add("eidolon-tile-criteria__tree-branch");
    const p = document.createElement("div");
    p.classList.add("document", "folder", "update", "eidolon-tile-criteria__folder-row");
    const y = document.createElement("i");
    y.classList.add("fa-solid", "fa-folder-open"), p.appendChild(y);
    const b = document.createElement("span");
    b.classList.add("eidolon-tile-criteria__tree-folder-label"), b.textContent = f.label, b.title = f.label, p.appendChild(b), g.appendChild(p);
    const v = document.createElement("ul");
    v.classList.add("eidolon-tile-criteria__tree"), v.dataset.folder = f.label, vf(f.node, e, n, i, v), v.childElementCount > 0 && g.appendChild(v), r.appendChild(g);
  }
  const o = [...t.files].sort((m, f) => m.name.localeCompare(f.name));
  if (!o.length) return;
  const s = document.createElement("li"), l = document.createElement("ul");
  l.classList.add("document-list", "eidolon-tile-criteria__document-list");
  for (const m of o) {
    const f = m.entry, g = f.index === e.selectedFileIndex, p = f.index === e.defaultIndex, y = Yg(e, f.index), b = document.createElement("li");
    b.classList.add("document", "update", "eidolon-tile-criteria__tree-file");
    const v = document.createElement("button");
    v.type = "button", v.classList.add("eidolon-tile-criteria__file-row");
    const w = (u = i == null ? void 0 : i.errorFileIndexes) == null ? void 0 : u.includes(f.index), S = (d = i == null ? void 0 : i.warningFileIndexes) == null ? void 0 : d.includes(f.index);
    w ? v.classList.add("has-conflict") : S && v.classList.add("has-warning");
    const I = e.relativePaths.get(f.index) || f.path || m.name, A = [I];
    w ? A.push(
      E(
        "EIDOLON.TileCriteria.ConflictFileHint",
        "This file participates in one or more conflicting rules."
      )
    ) : S && A.push(
      E(
        "EIDOLON.TileCriteria.WarningFileHint",
        "This file has potentially redundant rules."
      )
    ), y.length || A.push(
      E(
        "EIDOLON.TileCriteria.UnmappedHint",
        "No criteria rules map to this file."
      )
    ), v.title = A.join(`
`), g && v.classList.add("is-selected"), v.addEventListener("click", () => {
      e.selectedFileIndex = f.index, Ye(n), ip(n, f.index);
    });
    const O = document.createElement("span");
    O.classList.add("eidolon-tile-criteria__indicator"), O.dataset.kind = p ? "default" : y.length ? "mapped" : "unmapped", v.appendChild(O);
    const x = document.createElement("span");
    x.classList.add("eidolon-tile-criteria__file-content");
    const M = document.createElement("span");
    M.classList.add("eidolon-tile-criteria__file-heading");
    const D = document.createElement("span");
    D.classList.add("eidolon-tile-criteria__file-title"), D.textContent = Xg(m.name || f.label), D.title = I, M.appendChild(D);
    const F = ga(`#${f.index + 1}`, "meta");
    F.classList.add("eidolon-tile-criteria__index-badge"), M.appendChild(F), x.appendChild(M);
    const P = document.createElement("span");
    P.classList.add("eidolon-tile-criteria__badges"), p && P.appendChild(ga(E("EIDOLON.TileCriteria.DefaultBadge", "Default"), "default"));
    const _ = y.slice(0, 2);
    for (const H of _)
      P.appendChild(ga(H, "rule"));
    if (y.length > _.length && P.appendChild(ga(`+${y.length - _.length}`, "meta")), x.appendChild(P), v.appendChild(x), w || S) {
      const H = document.createElement("span");
      H.classList.add("eidolon-tile-criteria__row-warning"), H.dataset.mode = w ? "error" : "warning", H.innerHTML = '<i class="fa-solid fa-triangle-exclamation" inert=""></i>', v.appendChild(H);
    }
    b.appendChild(v), l.appendChild(b);
  }
  s.appendChild(l), r.appendChild(s);
}
c(vf, "renderTreeNode");
function sp(t, e, n, i = {}) {
  const r = document.createElement("section");
  r.classList.add("eidolon-tile-criteria__tree-panel");
  const a = Qg(t.filterQuery), o = ap(t, n);
  t.filterMode !== "all" && o[t.filterMode] === 0 && (t.filterMode = "all");
  const s = document.createElement("div");
  s.classList.add("eidolon-tile-criteria__toolbar");
  const l = document.createElement("div");
  l.classList.add("eidolon-tile-criteria__mode-bar");
  for (const w of es) {
    const S = document.createElement("button");
    S.type = "button", S.classList.add("control", "ui-control", "eidolon-tile-criteria__mode-button"), S.dataset.mode = w, S.textContent = op(w);
    const I = w === "all" || o[w] > 0;
    S.disabled = !I, I || (S.dataset.tooltip = E(
      "EIDOLON.TileCriteria.FilterModeUnavailable",
      "No entries currently match this filter."
    ), S.title = S.dataset.tooltip), t.filterMode === w ? (S.classList.add("is-active"), S.setAttribute("aria-pressed", "true")) : S.setAttribute("aria-pressed", "false"), S.addEventListener("click", () => {
      t.filterMode !== w && (t.filterMode = w, Ye(e));
    }), l.appendChild(S);
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
    const S = d.selectionStart ?? d.value.length, I = d.selectionEnd ?? S;
    t.filterQuery = d.value, Ye(e), requestAnimationFrame(() => {
      const A = e.section.querySelector(".eidolon-tile-criteria__filter-input");
      if (A instanceof HTMLInputElement) {
        A.focus();
        try {
          A.setSelectionRange(S, I);
        } catch {
        }
      }
    });
  }), u.appendChild(d);
  const m = document.createElement("div");
  m.classList.add("eidolon-tile-criteria__toolbar-actions");
  const f = document.createElement("button");
  f.type = "button";
  const g = E("EIDOLON.TileCriteria.Save", "Save Rules");
  f.classList.add("control", "ui-control", "eidolon-tile-criteria__toolbar-action", "icon-only"), f.dataset.tooltip = g, f.setAttribute("aria-label", g), f.title = g, f.innerHTML = '<i class="fa-solid fa-floppy-disk" inert=""></i>', f.disabled = n.errors.length > 0, f.addEventListener("click", () => {
    var w;
    (w = i.onSave) == null || w.call(i);
  }), m.appendChild(f);
  const p = document.createElement("button");
  p.type = "button";
  const y = E("EIDOLON.TileCriteria.Clear", "Clear Rules");
  if (p.classList.add("control", "ui-control", "secondary", "eidolon-tile-criteria__toolbar-action", "icon-only"), p.dataset.tooltip = y, p.setAttribute("aria-label", y), p.title = y, p.innerHTML = '<i class="fa-solid fa-trash" inert=""></i>', p.addEventListener("click", () => {
    var w;
    (w = i.onClear) == null || w.call(i);
  }), m.appendChild(p), u.appendChild(m), s.appendChild(u), r.appendChild(s), a.error) {
    const w = document.createElement("p");
    w.classList.add("notes", "eidolon-tile-criteria__filter-error"), w.textContent = `${E("EIDOLON.TileCriteria.InvalidRegex", "Invalid regex")}: ${a.error}`, r.appendChild(w);
  }
  const b = document.createElement("div");
  b.classList.add("eidolon-tile-criteria__library-tree");
  const v = t.fileEntries.filter((w) => {
    const S = t.relativePaths.get(w.index) || w.path || w.label;
    return rp(t, w, n) && a.matches(S);
  });
  if (t.fileEntries.length)
    if (v.length) {
      const w = document.createElement("ul");
      w.classList.add("eidolon-tile-criteria__tree"), vf(Gg(v), t, e, n, w), b.appendChild(w);
    } else {
      const w = document.createElement("p");
      w.classList.add("notes"), w.textContent = E("EIDOLON.TileCriteria.NoMatches", "No variants match this filter."), b.appendChild(w);
    }
  else {
    const w = document.createElement("p");
    w.classList.add("notes"), w.textContent = E("EIDOLON.TileCriteria.NoVariants", "No MATT variants found"), b.appendChild(w);
  }
  return r.appendChild(b), r;
}
c(sp, "renderTreePanel");
function Ye(t) {
  const { section: e, state: n } = t, i = cu(n);
  Bg(t), e.replaceChildren();
  const r = /* @__PURE__ */ c(async () => {
    try {
      const o = cu(n);
      if (o.errors.length) {
        n.status = {
          mode: "error",
          message: E(
            "EIDOLON.TileCriteria.ConflictSaveBlocked",
            `Resolve ${o.errors.length} conflict(s) before saving tile criteria rules.`
          )
        }, Ye(t);
        return;
      }
      const s = Kg(n);
      if (!s) {
        n.status = {
          mode: "error",
          message: E("EIDOLON.TileCriteria.Invalid", "Invalid rules. Select valid target variants.")
        }, Ye(t);
        return;
      }
      await lu(t.tile, s);
      const l = n.filterQuery, u = n.filterMode, d = n.selectedFileIndex;
      t.state = Cl(t.tile), t.state.filterQuery = l, t.state.filterMode = u, Number.isInteger(d) && (t.state.selectedFileIndex = d), t.state.status = {
        mode: "ready",
        message: E("EIDOLON.TileCriteria.Saved", "Tile criteria rules saved.")
      }, Ye(t), uu(t);
    } catch (o) {
      console.error(`${te} | Failed to save tile criteria`, o), n.status = {
        mode: "error",
        message: (o == null ? void 0 : o.message) ?? "Failed to save tile criteria rules."
      }, Ye(t);
    }
  }, "handleSave"), a = /* @__PURE__ */ c(async () => {
    try {
      await lu(t.tile, null);
      const o = n.filterQuery, s = n.filterMode, l = n.selectedFileIndex;
      t.state = Cl(t.tile), t.state.filterQuery = o, t.state.filterMode = s, Number.isInteger(l) && (t.state.selectedFileIndex = l), t.state.status = {
        mode: "ready",
        message: E("EIDOLON.TileCriteria.Cleared", "Tile criteria rules cleared.")
      }, Ye(t), uu(t);
    } catch (o) {
      console.error(`${te} | Failed to clear tile criteria`, o), n.status = {
        mode: "error",
        message: (o == null ? void 0 : o.message) ?? "Failed to clear tile criteria rules."
      }, Ye(t);
    }
  }, "handleClear");
  if (e.appendChild(sp(n, t, i, {
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
c(Ye, "renderController");
function lp(t, e = null) {
  const n = document.createElement("section");
  n.classList.add("eidolon-tile-criteria");
  const i = Cl(t);
  jg(i, qg(e));
  const r = {
    app: e,
    tile: t,
    section: n,
    state: i
  };
  return Ye(r), r;
}
c(lp, "createController");
function cp(t, e) {
  return mf(
    t,
    e,
    El,
    E("EIDOLON.TileCriteria.TabLabel", "Criteria"),
    Hg
  );
}
c(cp, "ensureTileCriteriaTab");
function up() {
  Hooks.on("renderTileConfig", (t, e) => {
    var l, u, d, m;
    const n = Xt(e);
    if (!n) return;
    const i = Ug(t);
    if (!i) return;
    if ((l = n.querySelector(".eidolon-tile-criteria")) == null || l.remove(), !Yo()) {
      (u = n.querySelector(`.item[data-tab='${El}']`)) == null || u.remove(), (d = n.querySelector(`.tab[data-tab='${El}']`)) == null || d.remove();
      return;
    }
    const r = lp(i, t), a = cp(t, n);
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
c(up, "registerTileCriteriaConfigControls");
const dp = ["Checkbox", "Tile", "Settings", "Toggleable Lights"], fp = [
  "Checkbox",
  "Tile",
  "Settings",
  "Toggleable Lights",
  "Checked",
  "Unchecked",
  "Individual"
];
function mp() {
  if (!globalThis.Tagger) return [];
  const t = Tagger.getByTag(dp) ?? [], e = [];
  for (const n of t) {
    if (n.getFlag("monks-active-tiles", "variables.state") !== "unchecked") continue;
    const i = (Tagger.getTags(n) ?? []).filter((o) => !fp.includes(o)), r = (Tagger.getByTag("Disable Automation") ?? []).concat(Tagger.getByTag("Settings") ?? []), a = Tagger.getByTag(i, { ignore: r }) ?? [];
    for (const o of a)
      o != null && o._id && e.push(o._id);
  }
  return e;
}
c(mp, "buildLightControlsMap");
function hp() {
  Qd(mp);
}
c(hp, "registerCheckboxLightProvider");
function gp(t) {
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
c(gp, "toList");
function pp(t, e) {
  const n = t == null ? void 0 : t.tools;
  return Array.isArray(n) ? n.some((i) => (i == null ? void 0 : i.name) === e) : n instanceof Map ? n.has(e) : n && typeof n == "object" ? e in n ? !0 : Object.values(n).some((i) => (i == null ? void 0 : i.name) === e) : !1;
}
c(pp, "hasTool");
function yp(t, e) {
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
c(yp, "addTool");
function bp() {
  Hooks.on("getSceneControlButtons", (t) => {
    var i;
    const e = gp(t);
    if (!e.length) return;
    const n = e.find((r) => (r == null ? void 0 : r.name) === "tiles") ?? e.find((r) => (r == null ? void 0 : r.name) === "tokens" || (r == null ? void 0 : r.name) === "token") ?? e[0];
    n && (pp(n, "eidolonCriteriaSwitcher") || yp(n, {
      name: "eidolonCriteriaSwitcher",
      title: "Criteria Switcher",
      icon: "fa-solid fa-sliders",
      button: !0,
      toggle: !1,
      visible: Ko(((i = game.scenes) == null ? void 0 : i.viewed) ?? null),
      onClick: /* @__PURE__ */ c(() => pc(), "onClick")
    }));
  });
}
c(bp, "registerSceneControlButton");
function pa(t, e) {
  if (!t || typeof t != "object") return !1;
  const n = String(e).split(".");
  let i = t;
  for (const r of n) {
    if (!i || typeof i != "object" || !Object.prototype.hasOwnProperty.call(i, r)) return !1;
    i = i[r];
  }
  return !0;
}
c(pa, "hasOwnPath");
function vp() {
  const t = /* @__PURE__ */ c((i, r = null) => {
    i && Zh(i, r);
  }, "invalidateTileScene"), e = /* @__PURE__ */ c((i, r = null) => {
    i && hg(i, r);
  }, "invalidatePlaceableScene");
  Hooks.on("createTile", (i) => {
    t((i == null ? void 0 : i.parent) ?? null, i ?? null);
  }), Hooks.on("deleteTile", (i) => {
    t((i == null ? void 0 : i.parent) ?? null, i ?? null);
  }), Hooks.on("updateTile", (i, r) => {
    (pa(r, `flags.${te}.tileCriteria`) || pa(r, `flags.${te}.fileIndex`)) && t((i == null ? void 0 : i.parent) ?? null, i ?? null);
  });
  const n = /* @__PURE__ */ c((i) => {
    Hooks.on(`create${i}`, (r) => {
      e((r == null ? void 0 : r.parent) ?? null, r ?? null);
    }), Hooks.on(`delete${i}`, (r) => {
      e((r == null ? void 0 : r.parent) ?? null, r ?? null);
    }), Hooks.on(`update${i}`, (r, a) => {
      const o = pa(a, `flags.${te}.presets`), s = i === "AmbientLight" && pa(a, `flags.${te}.lightCriteria`);
      !o && !s || e((r == null ? void 0 : r.parent) ?? null, r ?? null);
    });
  }, "registerPlaceableHooks");
  n("AmbientLight"), n("Wall"), n("AmbientSound"), Hooks.on("canvasReady", (i) => {
    const r = (i == null ? void 0 : i.scene) ?? null;
    r && (t(r), e(r));
  });
}
c(vp, "registerCriteriaCacheInvalidationHooks");
function wp() {
  wg(), hp(), bp(), up(), vp(), Hooks.once("init", () => {
    var t, e;
    (e = (t = game.keybindings) == null ? void 0 : t.register) == null || e.call(t, te, "toggleCriteriaSwitcher", {
      name: "Toggle Criteria Switcher",
      hint: "Open or close the criteria switcher window for live scene state updates.",
      editable: [{ key: "KeyM", modifiers: ["Alt"] }],
      onDown: /* @__PURE__ */ c(() => {
        var n, i, r;
        return Ko(((n = game.scenes) == null ? void 0 : n.viewed) ?? null) ? (pc(), !0) : ((r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "You do not have permission to manage scene criteria."), !0);
      }, "onDown"),
      restricted: !0,
      precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
    });
  }), Hooks.on("canvasReady", (t) => {
    var n;
    const e = Zo();
    e && (e.setScene((t == null ? void 0 : t.scene) ?? ((n = game.scenes) == null ? void 0 : n.viewed) ?? null), e.render({ force: !0 }));
  }), Hooks.once("ready", () => {
    var e, n;
    const t = (n = (e = game.modules) == null ? void 0 : e.get) == null ? void 0 : n.call(e, te);
    t && (t.api || (t.api = {}), t.api.criteria = kg, console.log(`${te} | Criteria engine API registered`));
  });
}
c(wp, "registerCriteriaEngineHooks");
wp();
const Ma = /* @__PURE__ */ new WeakMap(), ya = /* @__PURE__ */ new WeakMap(), ve = "__eidolon_default__";
function Ep() {
  Hooks.on("renderAmbientLightConfig", Cp), N("LightCriteria | AmbientLightConfig controls registered");
}
c(Ep, "registerAmbientLightCriteriaControls");
function Cp(t, e) {
  var n;
  Qi("LightCriteria | renderAmbientLightConfig", {
    appId: (t == null ? void 0 : t.id) ?? null,
    constructor: ((n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) ?? null,
    isRendered: (t == null ? void 0 : t.rendered) ?? !1
  });
  try {
    const i = Xt(e);
    if (!i) return;
    if (!Yo()) {
      i.querySelectorAll(".eidolon-light-criteria, .eidolon-light-criteria-main-switcher").forEach((r) => r.remove());
      return;
    }
    Sp(t, i);
  } catch (i) {
    console.error("eidolon-utilities | Failed to enhance AmbientLightConfig UI", i);
  } finally {
    Pn();
  }
}
c(Cp, "handleAmbientLightConfigRender");
function Sp(t, e) {
  var $e, Kn, or, ua, Fc;
  const n = (t == null ? void 0 : t.form) instanceof HTMLFormElement ? t.form : e instanceof HTMLFormElement ? e : ($e = e == null ? void 0 : e.closest) == null ? void 0 : $e.call(e, "form");
  if (!(n instanceof HTMLFormElement)) return;
  const i = n.querySelector(".window-content");
  if (!(i instanceof HTMLElement)) return;
  const r = Ef(t);
  if (!r) return;
  const a = zp(r);
  N("LightCriteria | Resolved ambient light", {
    sheetId: (r == null ? void 0 : r.id) ?? null,
    persistedId: (a == null ? void 0 : a.id) ?? null,
    sameRef: r === a
  });
  const o = (a == null ? void 0 : a.parent) ?? r.parent ?? null, s = o ? Ih(o) : [], l = s.filter(
    ($) => Array.isArray($ == null ? void 0 : $.values) && $.values.length > 0
  ), u = Fp(s), d = s.map(($) => typeof ($ == null ? void 0 : $.id) == "string" ? $.id : null).filter(($) => !!$), m = a ?? r, f = o ? vt(o) : [];
  let g = Yd(m);
  const p = ig(g, f);
  JSON.stringify(p) !== JSON.stringify(g) && (g = p, Jd(m, p).catch(($) => {
    console.warn("eidolon-utilities | Failed to persist migrated light criteria keys", $);
  })), N("LightCriteria | Loaded mapping state", {
    hasBase: !!(g != null && g.base),
    mappingCount: Array.isArray(g == null ? void 0 : g.mappings) ? g.mappings.length : 0,
    mappings: Array.isArray(g == null ? void 0 : g.mappings) ? g.mappings.map(($) => {
      var G, Z;
      return {
        id: $.id,
        key: $.key,
        hasColor: !!((Z = (G = $.config) == null ? void 0 : G.config) != null && Z.color)
      };
    }) : []
  });
  const y = i.querySelector(".eidolon-light-criteria");
  y && y.remove(), i.querySelectorAll(".eidolon-light-criteria-main-switcher").forEach(($) => $.remove());
  const b = document.createElement("fieldset");
  b.classList.add("eidolon-light-criteria");
  const v = document.createElement("legend");
  v.textContent = E("EIDOLON.LightCriteria.Legend", "Scene Criteria Lighting"), b.appendChild(v);
  const w = document.createElement("p");
  w.classList.add("notes"), w.textContent = E(
    "EIDOLON.LightCriteria.Description",
    "Capture a base lighting state, then map criteria values to lighting configurations."
  ), b.appendChild(w);
  const S = document.createElement("div");
  S.classList.add("eidolon-light-criteria__controls");
  const I = document.createElement("button");
  I.type = "button", I.dataset.action = "make-default", I.classList.add("eidolon-light-criteria__button"), I.textContent = E(
    "EIDOLON.LightCriteria.SetBase",
    "Set Base"
  ), S.appendChild(I);
  const A = document.createElement("button");
  A.type = "button", A.dataset.action = "create-mapping", A.classList.add("eidolon-light-criteria__button"), A.textContent = E(
    "EIDOLON.LightCriteria.CreateMapping",
    "Add Criteria Mapping"
  ), A.setAttribute("aria-expanded", "false"), S.appendChild(A), b.appendChild(S);
  const O = document.createElement("p");
  O.classList.add("notes", "eidolon-light-criteria__status"), b.appendChild(O);
  const x = document.createElement("div");
  x.classList.add("eidolon-light-criteria__switcher");
  const M = document.createElement("label");
  M.classList.add("eidolon-light-criteria__switcher-label");
  const D = `${(t == null ? void 0 : t.id) ?? (r == null ? void 0 : r.id) ?? "eidolon-light"}-mapping-select`;
  M.htmlFor = D, M.textContent = E("EIDOLON.LightCriteria.SelectLabel", "Criteria Mapping"), x.appendChild(M);
  const F = document.createElement("details");
  F.classList.add("eidolon-light-criteria__filter-details");
  const P = document.createElement("summary");
  P.classList.add("eidolon-light-criteria__filter-summary");
  const _ = document.createElement("span");
  _.classList.add("eidolon-light-criteria__filter-summary-label"), _.textContent = E(
    "EIDOLON.LightCriteria.FilterHeading",
    "Filter mappings"
  ), P.appendChild(_);
  const H = document.createElement("span");
  H.classList.add("eidolon-light-criteria__filter-meta"), P.appendChild(H), F.appendChild(P);
  const q = document.createElement("div");
  q.classList.add("eidolon-light-criteria__filter-panel");
  const j = document.createElement("div");
  j.classList.add("eidolon-light-criteria__filter-grid");
  for (const $ of l) {
    const G = document.createElement("label");
    G.classList.add("eidolon-light-criteria__filter");
    const Z = document.createElement("span");
    Z.classList.add("eidolon-light-criteria__filter-name"), Z.textContent = (or = (Kn = $.name) == null ? void 0 : Kn.trim) != null && or.call(Kn) ? $.name.trim() : E("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), G.appendChild(Z);
    const ee = document.createElement("select");
    ee.dataset.filterCategoryId = $.id, ee.classList.add("eidolon-light-criteria__filter-select");
    const ie = document.createElement("option");
    ie.value = "", ie.textContent = E("EIDOLON.LightCriteria.FilterAny", "Any"), ee.appendChild(ie);
    for (const de of $.values) {
      const fe = document.createElement("option");
      fe.value = de, fe.textContent = de, ee.appendChild(fe);
    }
    G.appendChild(ee), j.appendChild(G);
  }
  q.appendChild(j);
  const B = document.createElement("div");
  B.classList.add("eidolon-light-criteria__filter-actions");
  const V = document.createElement("button");
  V.type = "button", V.dataset.action = "clear-mapping-filters", V.classList.add("eidolon-light-criteria__button", "secondary", "compact"), V.textContent = E("EIDOLON.LightCriteria.ClearFilters", "Clear Filters"), B.appendChild(V), q.appendChild(B), F.appendChild(q), F.hidden = l.length === 0, x.appendChild(F);
  const J = document.createElement("div");
  J.classList.add("eidolon-light-criteria__switcher-controls"), x.appendChild(J);
  const ae = document.createElement("select");
  ae.id = D, ae.classList.add("eidolon-light-criteria__select"), ae.dataset.action = "select-mapping", J.appendChild(ae);
  const Q = document.createElement("button");
  Q.type = "button", Q.dataset.action = "apply-selected-mapping", Q.classList.add("eidolon-light-criteria__button", "secondary"), Q.textContent = E("EIDOLON.LightCriteria.ApplyButton", "Apply"), J.appendChild(Q);
  const ne = document.createElement("details");
  ne.classList.add("eidolon-light-criteria__menu"), ne.dataset.action = "mapping-actions-menu";
  const Zt = document.createElement("summary");
  Zt.classList.add("eidolon-light-criteria__menu-toggle"), Zt.innerHTML = '<i class="fa-solid fa-ellipsis-vertical" inert=""></i>', Zt.setAttribute(
    "aria-label",
    E("EIDOLON.LightCriteria.MoreActions", "More actions")
  ), Zt.dataset.tooltip = E("EIDOLON.LightCriteria.MoreActions", "More actions"), ne.appendChild(Zt);
  const wt = document.createElement("div");
  wt.classList.add("eidolon-light-criteria__menu-list"), ne.appendChild(wt);
  const Re = document.createElement("button");
  Re.type = "button", Re.dataset.action = "update-selected-mapping", Re.classList.add("eidolon-light-criteria__menu-item"), Re.textContent = E(
    "EIDOLON.LightCriteria.UpdateSelected",
    "Save current config to selected"
  ), wt.appendChild(Re);
  const st = document.createElement("button");
  st.type = "button", st.dataset.action = "edit-selected-mapping-criteria", st.classList.add("eidolon-light-criteria__menu-item"), st.textContent = E(
    "EIDOLON.LightCriteria.EditSelectedCriteria",
    "Edit selected mapping criteria"
  ), wt.appendChild(st);
  const lt = document.createElement("button");
  lt.type = "button", lt.dataset.action = "remove-selected-mapping", lt.classList.add("eidolon-light-criteria__menu-item", "danger"), lt.textContent = E(
    "EIDOLON.LightCriteria.RemoveSelected",
    "Delete selected mapping"
  ), wt.appendChild(lt), J.appendChild(ne);
  const en = document.createElement("div");
  en.classList.add("eidolon-light-criteria-main-switcher"), en.appendChild(x);
  const Xe = document.createElement("p");
  if (Xe.classList.add("notes", "eidolon-light-criteria-main-switcher__empty"), Xe.textContent = E(
    "EIDOLON.LightCriteria.ActiveRequiresBase",
    "Set Base Lighting to enable mapping selection and actions."
  ), en.appendChild(Xe), s.length === 0) {
    const $ = document.createElement("p");
    $.classList.add("notification", "warning", "eidolon-light-criteria__warning"), $.textContent = E(
      "EIDOLON.LightCriteria.NoCategoriesWarning",
      "This scene has no criteria configured. Add criteria under Scene -> Criteria to enable criteria-driven lighting."
    ), b.appendChild($);
  } else if (l.length === 0) {
    const $ = document.createElement("p");
    $.classList.add("notification", "warning", "eidolon-light-criteria__warning"), $.textContent = E(
      "EIDOLON.LightCriteria.NoValuesWarning",
      "Criteria exist, but none define selectable values. Add values in Scene -> Criteria."
    ), b.appendChild($);
  }
  const ke = document.createElement("div");
  ke.classList.add("eidolon-light-criteria__creation"), ke.dataset.section = "creation", ke.hidden = !0;
  const Ai = document.createElement("p");
  Ai.classList.add("notes"), Ai.textContent = E(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ), ke.appendChild(Ai);
  const tn = document.createElement("div");
  tn.classList.add("eidolon-light-criteria__category-list"), ke.appendChild(tn);
  for (const $ of l) {
    const G = document.createElement("label");
    G.classList.add("eidolon-light-criteria__category");
    const Z = document.createElement("span");
    Z.classList.add("eidolon-light-criteria__category-name"), Z.textContent = (Fc = (ua = $.name) == null ? void 0 : ua.trim) != null && Fc.call(ua) ? $.name.trim() : E("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), G.appendChild(Z);
    const ee = document.createElement("select");
    ee.dataset.categoryId = $.id, ee.classList.add("eidolon-light-criteria__category-select");
    const ie = document.createElement("option");
    ie.value = "", ie.textContent = E(
      "EIDOLON.LightCriteria.IgnoreCategory",
      "Ignore"
    ), ee.appendChild(ie);
    for (const de of $.values) {
      const fe = document.createElement("option");
      fe.value = de, fe.textContent = de, ee.appendChild(fe);
    }
    G.appendChild(ee), tn.appendChild(G);
  }
  const Jn = document.createElement("div");
  Jn.classList.add("eidolon-light-criteria__creation-actions");
  const ct = document.createElement("button");
  ct.type = "button", ct.dataset.action = "save-mapping", ct.classList.add("eidolon-light-criteria__button", "primary"), ct.textContent = E(
    "EIDOLON.LightCriteria.SaveMapping",
    "Save Mapping"
  ), Jn.appendChild(ct);
  const nn = document.createElement("button");
  nn.type = "button", nn.dataset.action = "cancel-create", nn.classList.add("eidolon-light-criteria__button", "secondary"), nn.textContent = E(
    "EIDOLON.LightCriteria.Cancel",
    "Cancel"
  ), Jn.appendChild(nn), ke.appendChild(Jn), b.appendChild(ke), i.prepend(en), i.appendChild(b), b.hidden = !0, Ip(t, {
    fieldset: b,
    homeContainer: i
  }), requestAnimationFrame(() => {
    var $;
    ($ = t.setPosition) == null || $.call(t, { height: "auto" });
  });
  let R = g;
  Zn({ switcher: x, emptyState: Xe, state: R }), Qn(O, R), ur(A, {
    state: R,
    hasCategories: l.length > 0
  }), N("LightCriteria | Controls injected", {
    sceneId: (o == null ? void 0 : o.id) ?? null,
    lightId: (r == null ? void 0 : r.id) ?? null,
    hasBase: !!(R != null && R.base),
    mappingCount: Array.isArray(R == null ? void 0 : R.mappings) ? R.mappings.length : 0,
    categories: l.length
  });
  const la = jp(R), X = {
    restoreConfig: null,
    app: t,
    selectedMapping: la,
    editorMode: "create",
    editingMappingId: null,
    mappingFilters: {}
  };
  Ma.set(b, X);
  const Et = /* @__PURE__ */ c(() => {
    ne.open = !1;
  }, "closeActionsMenu");
  Zt.addEventListener("click", ($) => {
    ne.classList.contains("is-disabled") && ($.preventDefault(), Et());
  });
  const xe = /* @__PURE__ */ c(($ = X.selectedMapping) => {
    const G = Dp(j), Z = Array.isArray(R == null ? void 0 : R.mappings) ? R.mappings : [], ee = Rp(Z, G), ie = Object.keys(G).length;
    X.mappingFilters = G, V.disabled = ie === 0, Hp(H, {
      totalCount: Z.length,
      visibleCount: ee.length,
      hasFilters: ie > 0,
      activeFilterCount: ie
    }), F.classList.toggle("has-active-filters", ie > 0), qp(ae, R, u, $, {
      mappings: ee,
      categoryOrder: d
    }), X.selectedMapping = ae.value ?? "", Cs({
      mappingSelect: ae,
      applyMappingButton: Q,
      updateMappingButton: Re,
      editCriteriaButton: st,
      removeMappingButton: lt,
      actionsMenu: ne,
      state: R
    }), ne.classList.contains("is-disabled") && Et();
  }, "refreshMappingSelector");
  j.querySelectorAll("select[data-filter-category-id]").forEach(($) => {
    $.addEventListener("change", () => {
      const G = X.selectedMapping;
      xe(G), X.selectedMapping !== G && Ss(
        a ?? r,
        R,
        X.selectedMapping
      ).then((Z) => {
        Z && (R = Z);
      });
    });
  }), V.addEventListener("click", () => {
    Pp(j);
    const $ = X.selectedMapping;
    xe($), F.open = !1, X.selectedMapping !== $ && Ss(
      a ?? r,
      R,
      X.selectedMapping
    ).then((G) => {
      G && (R = G);
    });
  }), ae.addEventListener("change", () => {
    X.selectedMapping = ae.value ?? "", Cs({
      mappingSelect: ae,
      applyMappingButton: Q,
      updateMappingButton: Re,
      editCriteriaButton: st,
      removeMappingButton: lt,
      actionsMenu: ne,
      state: R
    }), Ss(
      a ?? r,
      R,
      X.selectedMapping
    ).then(($) => {
      $ && (R = $);
    });
  });
  const ar = /* @__PURE__ */ c(async () => {
    var ee, ie, de, fe, ut, gn, dt, pn, ye, yn, bn, qt, Xn, sr;
    const $ = ae.value ?? "";
    if (!$) {
      (ie = (ee = ui.notifications) == null ? void 0 : ee.warn) == null || ie.call(
        ee,
        E(
          "EIDOLON.LightCriteria.SelectMappingWarning",
          "Choose a criteria mapping before applying."
        )
      ), xe(X.selectedMapping);
      return;
    }
    if ($ === ve) {
      if (!(R != null && R.base)) {
        (fe = (de = ui.notifications) == null ? void 0 : de.warn) == null || fe.call(
          de,
          E(
            "EIDOLON.LightCriteria.BaseUnavailable",
            "Set a base lighting state before applying it."
          )
        );
        return;
      }
      ba(b, ke, A), Na(t, n, R.base), R = await Er(a ?? r, {
        mappingId: ve,
        categories: null,
        updatedAt: Date.now()
      }), X.selectedMapping = ve, xe(X.selectedMapping), Qn(O, R), Zn({ switcher: x, emptyState: Xe, state: R }), ur(A, {
        state: R,
        hasCategories: l.length > 0
      }), fu(n, {
        mappingId: ve,
        color: ((gn = (ut = R.base) == null ? void 0 : ut.config) == null ? void 0 : gn.color) ?? null
      }), (pn = (dt = ui.notifications) == null ? void 0 : dt.info) == null || pn.call(
        dt,
        E(
          "EIDOLON.LightCriteria.BaseApplied",
          "Applied the base lighting state to the form."
        )
      ), Et();
      return;
    }
    const G = Array.isArray(R == null ? void 0 : R.mappings) && R.mappings.length ? R.mappings.find((ki) => (ki == null ? void 0 : ki.id) === $) : null;
    if (!G) {
      (yn = (ye = ui.notifications) == null ? void 0 : ye.warn) == null || yn.call(
        ye,
        E(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      ), X.selectedMapping = "", xe(X.selectedMapping);
      return;
    }
    ba(b, ke, A), Na(t, n, G.config), R = await Er(a ?? r, {
      mappingId: G.id,
      categories: G.categories,
      updatedAt: Date.now()
    }), X.selectedMapping = G.id, xe(X.selectedMapping), Qn(O, R), Zn({ switcher: x, emptyState: Xe, state: R }), ur(A, {
      state: R,
      hasCategories: l.length > 0
    }), fu(n, {
      mappingId: G.id,
      color: ((qt = (bn = G.config) == null ? void 0 : bn.config) == null ? void 0 : qt.color) ?? null
    });
    const Z = zi(G, u, d);
    (sr = (Xn = ui.notifications) == null ? void 0 : Xn.info) == null || sr.call(
      Xn,
      E(
        "EIDOLON.LightCriteria.MappingApplied",
        "Applied mapping: {label}"
      ).replace("{label}", Z)
    ), Et();
  }, "applySelectedMapping");
  Q.addEventListener("click", () => {
    ar();
  }), ae.addEventListener("keydown", ($) => {
    $.key === "Enter" && ($.preventDefault(), ar());
  });
  const ca = /* @__PURE__ */ c(async () => {
    var G, Z, ee, ie, de, fe, ut, gn, dt, pn, ye, yn, bn, qt, Xn, sr, ki, da, Dc, fa, Pc;
    const $ = X.selectedMapping;
    if (!$) {
      (Z = (G = ui.notifications) == null ? void 0 : G.warn) == null || Z.call(
        G,
        E(
          "EIDOLON.LightCriteria.SelectMappingWarning",
          "Choose a criteria mapping before applying."
        )
      );
      return;
    }
    Re.disabled = !0;
    try {
      const Qe = _a(t, a);
      if ($ === ve)
        R = await nu(a ?? r, Qe), N("LightCriteria | Base lighting updated", {
          lightId: ((ee = a ?? r) == null ? void 0 : ee.id) ?? null,
          configColor: ((ie = Qe == null ? void 0 : Qe.config) == null ? void 0 : ie.color) ?? null
        }), (fe = (de = ui.notifications) == null ? void 0 : de.info) == null || fe.call(
          de,
          E(
            "EIDOLON.LightCriteria.BaseUpdated",
            "Updated the base lighting state with the current configuration."
          )
        ), X.selectedMapping = ve;
      else {
        const Mi = Cr(R, $);
        if (!Mi) {
          (gn = (ut = ui.notifications) == null ? void 0 : ut.warn) == null || gn.call(
            ut,
            E(
              "EIDOLON.LightCriteria.MappingUnavailable",
              "The selected criteria mapping is no longer available."
            )
          ), X.selectedMapping = "", xe(X.selectedMapping);
          return;
        }
        R = await iu(
          a ?? r,
          Mi.categories,
          Qe,
          { label: Mi.label ?? null }
        ), N("LightCriteria | Mapping updated", {
          mappingId: $,
          hasColor: !!((dt = Qe == null ? void 0 : Qe.config) != null && dt.color),
          stored: Array.isArray(R == null ? void 0 : R.mappings) ? ((pn = R.mappings.find((cs) => (cs == null ? void 0 : cs.id) === $)) == null ? void 0 : pn.config) ?? null : null,
          persisted: (yn = (ye = a ?? r) == null ? void 0 : ye.getFlag) == null ? void 0 : yn.call(ye, wi, Vi)
        });
        const lr = Cr(R, $), Hm = zi(lr || Mi, u, d);
        N("LightCriteria | Mapping updated", {
          mappingId: $,
          categories: Mi.categories,
          updatedColor: ((bn = Qe == null ? void 0 : Qe.config) == null ? void 0 : bn.color) ?? null,
          storedColor: ((Xn = (qt = lr == null ? void 0 : lr.config) == null ? void 0 : qt.config) == null ? void 0 : Xn.color) ?? ((ki = (sr = Mi.config) == null ? void 0 : sr.config) == null ? void 0 : ki.color) ?? null
        }), (Dc = (da = ui.notifications) == null ? void 0 : da.info) == null || Dc.call(
          da,
          E(
            "EIDOLON.LightCriteria.MappingUpdated",
            "Saved changes to mapping: {label}"
          ).replace("{label}", Hm)
        ), X.selectedMapping = $;
      }
      Qn(O, R), Zn({ switcher: x, emptyState: Xe, state: R }), ur(A, {
        state: R,
        hasCategories: l.length > 0
      }), xe(X.selectedMapping), Et();
    } catch (Qe) {
      console.error("eidolon-utilities | Failed to update light criteria mapping", Qe), (Pc = (fa = ui.notifications) == null ? void 0 : fa.error) == null || Pc.call(
        fa,
        E(
          "EIDOLON.LightCriteria.MappingUpdateError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      Re.disabled = !1, Cs({
        mappingSelect: ae,
        applyMappingButton: Q,
        updateMappingButton: Re,
        editCriteriaButton: st,
        removeMappingButton: lt,
        actionsMenu: ne,
        state: R
      });
    }
  }, "updateSelectedMapping");
  Re.addEventListener("click", () => {
    ca();
  }), xe(X.selectedMapping), I.addEventListener("click", async () => {
    var $, G, Z, ee, ie, de;
    I.disabled = !0;
    try {
      const fe = _a(t, a);
      R = await nu(a ?? r, fe), N("LightCriteria | Base lighting stored", {
        lightId: (($ = a ?? r) == null ? void 0 : $.id) ?? null,
        configColor: ((G = fe == null ? void 0 : fe.config) == null ? void 0 : G.color) ?? null
      }), (ee = (Z = ui.notifications) == null ? void 0 : Z.info) == null || ee.call(
        Z,
        E(
          "EIDOLON.LightCriteria.BaseStored",
          "Saved the current configuration as the base lighting state."
        )
      ), Qn(O, R), Zn({ switcher: x, emptyState: Xe, state: R }), ur(A, {
        state: R,
        hasCategories: l.length > 0
      }), X.selectedMapping = ve, xe(X.selectedMapping);
    } catch (fe) {
      console.error("eidolon-utilities | Failed to store base light criteria state", fe), (de = (ie = ui.notifications) == null ? void 0 : ie.error) == null || de.call(
        ie,
        E(
          "EIDOLON.LightCriteria.BaseError",
          "Failed to save the base lighting state. Check the console for details."
        )
      );
    } finally {
      I.disabled = !1;
    }
  }), A.addEventListener("click", () => {
    var G, Z, ee, ie;
    if (!(R != null && R.base)) {
      (Z = (G = ui.notifications) == null ? void 0 : G.warn) == null || Z.call(
        G,
        E(
          "EIDOLON.LightCriteria.RequiresBase",
          "Set a base lighting state before adding criteria mappings."
        )
      );
      return;
    }
    if (l.length === 0) {
      (ie = (ee = ui.notifications) == null ? void 0 : ee.warn) == null || ie.call(
        ee,
        E(
          "EIDOLON.LightCriteria.NoCategoriesAvailable",
          "Add scene criteria with values in the Scene configuration before creating mappings."
        )
      );
      return;
    }
    const $ = Ma.get(b);
    du({
      app: t,
      fieldset: b,
      createButton: A,
      creationSection: ke,
      categoryList: tn,
      form: n,
      persistedLight: a,
      stateEntry: $,
      mode: "create",
      mapping: null,
      preloadConfig: R.base
    });
  }), st.addEventListener("click", () => {
    var Z, ee, ie, de;
    const $ = X.selectedMapping;
    if (!$ || $ === ve) {
      (ee = (Z = ui.notifications) == null ? void 0 : Z.warn) == null || ee.call(
        Z,
        E(
          "EIDOLON.LightCriteria.SelectMappingForCriteriaEdit",
          "Select a mapping before editing criteria."
        )
      );
      return;
    }
    const G = Cr(R, $);
    if (!G) {
      (de = (ie = ui.notifications) == null ? void 0 : ie.warn) == null || de.call(
        ie,
        E(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      );
      return;
    }
    Et(), wf(t, { fieldset: b, homeContainer: i }), du({
      app: t,
      fieldset: b,
      createButton: A,
      creationSection: ke,
      categoryList: tn,
      form: n,
      persistedLight: a,
      stateEntry: X,
      mode: "retarget",
      mapping: G,
      preloadConfig: G.config
    });
  }), ct.addEventListener("click", async () => {
    var G, Z, ee, ie, de, fe, ut, gn, dt, pn;
    const $ = Vp(tn);
    if (!$) {
      (Z = (G = ui.notifications) == null ? void 0 : G.warn) == null || Z.call(
        G,
        E(
          "EIDOLON.LightCriteria.SelectionRequired",
          "Select at least one criteria value to identify the mapping."
        )
      );
      return;
    }
    ct.disabled = !0;
    try {
      const ye = _a(t, a);
      if (X.editorMode === "retarget" && X.editingMappingId) {
        const bn = Ll(R, $);
        let qt = !1;
        if (bn && bn !== X.editingMappingId && (qt = await Tp(), !qt)) {
          ct.disabled = !1;
          return;
        }
        R = await eg(
          a ?? r,
          X.editingMappingId,
          $,
          ye,
          { replaceExisting: qt }
        ), N("LightCriteria | Mapping criteria retargeted", {
          mappingId: X.editingMappingId,
          categories: $,
          replaced: qt,
          configColor: ((ee = ye == null ? void 0 : ye.config) == null ? void 0 : ee.color) ?? null
        }), (de = (ie = ui.notifications) == null ? void 0 : ie.info) == null || de.call(
          ie,
          E(
            "EIDOLON.LightCriteria.MappingCriteriaUpdated",
            "Updated mapping criteria for the selected mapping."
          )
        );
      } else
        R = await iu(
          a ?? r,
          $,
          ye,
          {}
        ), N("LightCriteria | Mapping saved from editor", {
          categories: $,
          configColor: ((fe = ye == null ? void 0 : ye.config) == null ? void 0 : fe.color) ?? null
        }), (gn = (ut = ui.notifications) == null ? void 0 : ut.info) == null || gn.call(
          ut,
          E(
            "EIDOLON.LightCriteria.MappingSaved",
            "Updated lighting mapping for the selected scene criteria."
          )
        );
      Qn(O, R), Zn({ switcher: x, emptyState: Xe, state: R });
      const yn = Ll(R, $);
      yn && (X.selectedMapping = yn), xe(X.selectedMapping), ba(b, ke, A), Et();
    } catch (ye) {
      console.error("eidolon-utilities | Failed to persist light criteria mapping", ye), (pn = (dt = ui.notifications) == null ? void 0 : dt.error) == null || pn.call(
        dt,
        E(
          "EIDOLON.LightCriteria.MappingError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      ct.disabled = !1;
    }
  }), nn.addEventListener("click", () => {
    const $ = Ma.get(b);
    $ != null && $.restoreConfig && Na(t, n, $.restoreConfig), ba(b, ke, A);
  }), lt.addEventListener("click", async () => {
    var Z, ee;
    const $ = X.selectedMapping;
    !$ || $ === ve || !await Lp() || (R = await tg(a ?? r, $), X.selectedMapping = "", Qn(O, R), Zn({ switcher: x, emptyState: Xe, state: R }), xe(X.selectedMapping), Et(), (ee = (Z = ui.notifications) == null ? void 0 : Z.info) == null || ee.call(
      Z,
      E("EIDOLON.LightCriteria.MappingRemoved", "Removed selected mapping.")
    ));
  });
}
c(Sp, "enhanceAmbientLightConfig");
function du({
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
  s && (s.restoreConfig = _a(t, o), s.editorMode = l, s.editingMappingId = l === "retarget" ? (u == null ? void 0 : u.id) ?? null : null), d && Na(t, a, d), l === "retarget" && (u != null && u.categories) ? Up(r, u.categories) : Bp(r);
  const m = i.querySelector("p.notes");
  m instanceof HTMLElement && (m.textContent = l === "retarget" ? E(
    "EIDOLON.LightCriteria.EditCriteriaDescription",
    "Adjust criteria values for the selected mapping."
  ) : E(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const f = i.querySelector('button[data-action="save-mapping"]');
  f instanceof HTMLButtonElement && (f.textContent = l === "retarget" ? E("EIDOLON.LightCriteria.SaveCriteriaChanges", "Save Criteria Changes") : E("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), i.hidden = !1, n.setAttribute("aria-expanded", "true"), yc(e, i), requestAnimationFrame(() => {
    var g;
    (g = t.setPosition) == null || g.call(t, { height: "auto" });
  });
}
c(du, "openMappingEditor");
async function Tp() {
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
c(Tp, "confirmCriteriaConflict");
async function Lp() {
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
c(Lp, "confirmRemoveMapping");
function Ip(t, { fieldset: e, homeContainer: n }) {
  const i = kp(t, n);
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
    o.preventDefault(), wf(t, { fieldset: e, homeContainer: n });
  };
}
c(Ip, "ensureManagerHeaderButton");
function wf(t, { fieldset: e, homeContainer: n }) {
  var f, g, p;
  const i = ya.get(t);
  if (i != null && i.rendered) {
    (f = i.bringToTop) == null || f.call(i);
    return;
  }
  const r = /* @__PURE__ */ c((...y) => {
    var w;
    const b = Op(y), v = (w = b == null ? void 0 : b.querySelector) == null ? void 0 : w.call(b, ".eidolon-light-criteria-manager-host");
    v instanceof HTMLElement && (Ap(e), e.hidden = !1, v.appendChild(e));
  }, "onRender"), a = /* @__PURE__ */ c(() => {
    n instanceof HTMLElement && n.appendChild(e), e.hidden = !0, ya.delete(t), requestAnimationFrame(() => {
      var y;
      (y = t.setPosition) == null || y.call(t, { height: "auto" });
    });
  }, "onClose"), o = E("EIDOLON.LightCriteria.ManagerTitle", "Scene Criteria Lighting"), s = '<div class="eidolon-light-criteria-manager-host"></div>', l = E("EIDOLON.LightCriteria.Close", "Close"), u = (p = (g = foundry == null ? void 0 : foundry.applications) == null ? void 0 : g.api) == null ? void 0 : p.DialogV2;
  if (typeof (u == null ? void 0 : u.wait) == "function")
    try {
      let y = !1;
      const b = /* @__PURE__ */ c(() => {
        y || (y = !0, a());
      }, "closeOnce");
      ya.set(t, {
        rendered: !0,
        bringToTop: /* @__PURE__ */ c(() => {
        }, "bringToTop")
      }), u.wait({
        window: { title: o },
        content: s,
        buttons: [{ action: "close", label: l, default: !0 }],
        render: /* @__PURE__ */ c((...v) => r(...v), "render"),
        close: b,
        rejectClose: !1
      }).catch((v) => {
        console.warn("eidolon-utilities | DialogV2 manager failed, falling back to Dialog", v), b();
      });
      return;
    } catch (y) {
      console.warn("eidolon-utilities | DialogV2 manager failed, falling back to Dialog", y), a();
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
      render: /* @__PURE__ */ c((...y) => r(...y), "render"),
      close: a
    },
    {
      width: 640,
      resizable: !0
    }
  );
  ya.set(t, m), m.render(!0);
}
c(wf, "openManagerDialog");
function Op(t) {
  for (const e of t) {
    const n = Xt(e);
    if (n) return n;
    const i = Xt(e == null ? void 0 : e.element);
    if (i) return i;
  }
  return null;
}
c(Op, "findDialogRoot");
function Ap(t) {
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
    const f = document.createElement("div");
    f.classList.add("eidolon-light-criteria-manager__warnings");
    for (const g of o) f.appendChild(g);
    l.appendChild(f);
  }
  const m = document.createElement("div");
  m.classList.add("eidolon-light-criteria-manager__header"), m.textContent = E("EIDOLON.LightCriteria.ManagerAuthoring", "Create or Update Mapping"), u.appendChild(m), a && u.appendChild(a), t.innerHTML = "", e && t.appendChild(e), n && t.appendChild(n), t.appendChild(s), yc(t, a);
}
c(Ap, "applyManagerLayout");
function kp(t, e) {
  var i;
  const n = Xt(t == null ? void 0 : t.element);
  return n || (((i = e == null ? void 0 : e.closest) == null ? void 0 : i.call(e, ".application")) ?? null);
}
c(kp, "resolveApplicationRoot");
function ba(t, e, n) {
  const i = Ma.get(t);
  i && (i.restoreConfig = null, i.editorMode = "create", i.editingMappingId = null), e.hidden = !0, n.setAttribute("aria-expanded", "false");
  const r = e.querySelector("p.notes");
  r instanceof HTMLElement && (r.textContent = E(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const a = e.querySelector('button[data-action="save-mapping"]');
  a instanceof HTMLButtonElement && (a.textContent = E("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), yc(t, e), requestAnimationFrame(() => {
    var o, s;
    (s = (o = i == null ? void 0 : i.app) == null ? void 0 : o.setPosition) == null || s.call(o, { height: "auto" });
  });
}
c(ba, "hideCreationSection");
function Qn(t, e) {
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
c(Qn, "updateStatusLine");
function ur(t, { state: e, hasCategories: n }) {
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
c(ur, "updateCreateButtonState");
function _a(t, e) {
  var l, u, d;
  const n = e ?? Ef(t);
  if (!n)
    throw new Error("Ambient light document unavailable.");
  const i = Li(((l = n.toObject) == null ? void 0 : l.call(n)) ?? {});
  if (!i)
    throw new Error("Unable to duplicate ambient light data.");
  const r = (t == null ? void 0 : t.form) instanceof HTMLFormElement ? t.form : null, a = r ? fh(r) : {}, o = foundry.utils.mergeObject(i, a, {
    inplace: !1,
    performDeletions: !0
  });
  r && (r.querySelectorAll("color-picker[name]").forEach((m) => {
    var v, w;
    const f = m.getAttribute("name");
    if (!f) return;
    const g = typeof m.value == "string" ? m.value : "", p = ((v = m.ui) == null ? void 0 : v.input) ?? ((w = m.querySelector) == null ? void 0 : w.call(m, 'input[type="color"]')), y = (p == null ? void 0 : p.value) ?? "", b = g || y;
    typeof b != "string" || !b || (foundry.utils.setProperty(o, f, b), N("LightCriteria | Captured color-picker value", {
      path: f,
      pickerValue: g,
      swatchValue: y,
      chosenValue: b
    }));
  }), r.querySelectorAll("range-picker[name]").forEach((m) => {
    var A, O;
    const f = m.getAttribute("name");
    if (!f) return;
    const g = m.value !== void 0 && m.value !== null ? String(m.value) : "", p = (A = m.querySelector) == null ? void 0 : A.call(m, 'input[type="range"]'), y = (O = m.querySelector) == null ? void 0 : O.call(m, 'input[type="number"]'), b = p instanceof HTMLInputElement ? p.value : "", v = y instanceof HTMLInputElement ? y.value : "", w = g || v || b;
    if (typeof w != "string" || !w.length) return;
    const S = Number(w), I = Number.isFinite(S) ? S : w;
    foundry.utils.setProperty(o, f, I), N("LightCriteria | Captured range-picker value", {
      path: f,
      elementValue: g,
      numberValue: v,
      rangeValue: b,
      chosenValue: I
    });
  }));
  const s = Li(o);
  return N("LightCriteria | Captured form config", {
    lightId: (n == null ? void 0 : n.id) ?? null,
    hasColor: !!((u = s == null ? void 0 : s.config) != null && u.color),
    color: ((d = s == null ? void 0 : s.config) == null ? void 0 : d.color) ?? null
  }), s;
}
c(_a, "captureAmbientLightFormConfig");
function Na(t, e, n) {
  if (!n || typeof n != "object") return;
  const i = foundry.utils.flattenObject(n, { safe: !0 });
  for (const [r, a] of Object.entries(i)) {
    const o = e.querySelectorAll(`[name="${r}"]`);
    if (o.length) {
      N("LightCriteria | Applying field", {
        path: r,
        value: a,
        elementCount: o.length
      });
      for (const s of o)
        s instanceof HTMLElement && s.tagName === "COLOR-PICKER" ? _p(s, a) : s instanceof HTMLElement && s.tagName === "RANGE-PICKER" ? Np(s, a) : s instanceof HTMLInputElement ? Mp(s, a) : s instanceof HTMLSelectElement ? xp(s, a) : s instanceof HTMLTextAreaElement && $p(s, a);
    }
  }
  requestAnimationFrame(() => {
    var r;
    return (r = t._previewChanges) == null ? void 0 : r.call(t);
  });
}
c(Na, "applyConfigToForm");
function Mp(t, e, n) {
  const i = t.type;
  if (i === "checkbox") {
    const o = !!e;
    t.checked !== o && (t.checked = o, Rt(t));
    return;
  }
  if (i === "radio") {
    const o = e == null ? "" : String(e), s = t.value === o;
    t.checked !== s && (t.checked = s, s && Rt(t));
    return;
  }
  const r = e == null ? "" : String(e);
  let a = !1;
  t.value !== r && (t.value = r, a = !0), a && Rt(t);
}
c(Mp, "applyValueToInput");
function _p(t, e, n) {
  var s, l, u, d, m, f;
  const i = e == null ? "" : String(e);
  let r = !1;
  t.value !== i && (t.value = i, t.setAttribute("value", i), (s = t.ui) != null && s.setValue && t.ui.setValue(i), r = !0);
  const a = ((l = t.ui) == null ? void 0 : l.input) ?? ((u = t.querySelector) == null ? void 0 : u.call(t, 'input[type="color"]'));
  a instanceof HTMLInputElement && a.value !== i && (a.value = i, Rt(a));
  const o = ((d = t.ui) == null ? void 0 : d.text) ?? ((m = t.querySelector) == null ? void 0 : m.call(t, 'input[type="text"]'));
  o instanceof HTMLInputElement && o.value !== i && (o.value = i, Rt(o)), (f = t.ui) != null && f.commit ? t.ui.commit() : (t.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), t.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }))), N("LightCriteria | Color picker applied", {
    value: i,
    pickerValue: t.value ?? null,
    swatchValue: (a == null ? void 0 : a.value) ?? null,
    textValue: (o == null ? void 0 : o.value) ?? null
  }), r && Rt(t);
}
c(_p, "applyValueToColorPicker");
function Np(t, e, n) {
  var u, d;
  const i = e == null ? "" : String(e), r = Number(i), a = Number.isFinite(r) ? r : i;
  let o = !1;
  t.value !== void 0 && t.value !== a && (t.value = a, o = !0), t.getAttribute("value") !== i && (t.setAttribute("value", i), o = !0);
  const s = (u = t.querySelector) == null ? void 0 : u.call(t, 'input[type="range"]');
  s instanceof HTMLInputElement && s.value !== i && (s.value = i, Rt(s));
  const l = (d = t.querySelector) == null ? void 0 : d.call(t, 'input[type="number"]');
  if (l instanceof HTMLInputElement && l.value !== i && (l.value = i, Rt(l)), typeof t.commit == "function")
    try {
      t.commit();
    } catch (m) {
      console.error("eidolon-utilities | range-picker commit failed", m);
    }
  N("LightCriteria | Range picker applied", {
    value: i,
    resolvedValue: a,
    rangeValue: (s == null ? void 0 : s.value) ?? null,
    numberValue: (l == null ? void 0 : l.value) ?? null
  }), o && Rt(t);
}
c(Np, "applyValueToRangePicker");
function xp(t, e, n) {
  const i = e == null ? "" : String(e);
  t.value !== i && (t.value = i, Rt(t));
}
c(xp, "applyValueToSelect");
function $p(t, e, n) {
  const i = e == null ? "" : String(e);
  t.value !== i && (t.value = i, Rt(t));
}
c($p, "applyValueToTextarea");
function Rt(t) {
  t.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), t.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }));
}
c(Rt, "triggerInputChange");
function Cs({
  mappingSelect: t,
  applyMappingButton: e,
  updateMappingButton: n,
  editCriteriaButton: i,
  removeMappingButton: r,
  actionsMenu: a,
  state: o
}) {
  const s = (t == null ? void 0 : t.value) ?? "", l = !!(o != null && o.base), u = s && s !== ve ? !!Cr(o, s) : !1;
  if (e instanceof HTMLButtonElement && (s ? s === ve ? e.disabled = !l : e.disabled = !u : e.disabled = !0), n instanceof HTMLButtonElement && (s ? s === ve ? n.disabled = !1 : n.disabled = !u : n.disabled = !0), i instanceof HTMLButtonElement && (i.disabled = !s || s === ve || !u), r instanceof HTMLButtonElement && (r.disabled = !s || s === ve || !u), a instanceof HTMLElement) {
    const d = n instanceof HTMLButtonElement && !n.disabled || i instanceof HTMLButtonElement && !i.disabled || r instanceof HTMLButtonElement && !r.disabled;
    a.classList.toggle("is-disabled", !d), !d && "open" in a && (a.open = !1);
  }
}
c(Cs, "syncMappingSwitcherState");
function Fp(t) {
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
c(Fp, "buildCategoryNameLookup");
function Dp(t) {
  const e = {};
  return t instanceof HTMLElement && t.querySelectorAll("select[data-filter-category-id]").forEach((n) => {
    var a, o;
    const i = n.dataset.filterCategoryId, r = (o = (a = n.value) == null ? void 0 : a.trim) == null ? void 0 : o.call(a);
    !i || !r || (e[i] = r);
  }), e;
}
c(Dp, "readMappingFilterSelections");
function Pp(t) {
  t instanceof HTMLElement && t.querySelectorAll("select[data-filter-category-id]").forEach((e) => {
    e.value = "";
  });
}
c(Pp, "resetMappingFilterSelections");
function Rp(t, e) {
  const n = Array.isArray(t) ? t : [], i = Object.entries(e ?? {}).filter(([, r]) => !!r);
  return i.length ? n.filter((r) => {
    if (!r || typeof r != "object") return !1;
    const a = r.categories ?? {};
    for (const [o, s] of i)
      if ((a == null ? void 0 : a[o]) !== s) return !1;
    return !0;
  }) : n.slice();
}
c(Rp, "filterMappingsByCriteria");
function Hp(t, { totalCount: e = 0, visibleCount: n = 0, hasFilters: i = !1, activeFilterCount: r = 0 } = {}) {
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
c(Hp, "updateMappingFilterMeta");
function qp(t, e, n, i, r = {}) {
  if (!(t instanceof HTMLSelectElement)) return;
  const a = typeof i == "string" ? i : "", o = !!(e != null && e.base), s = Array.isArray(r == null ? void 0 : r.categoryOrder) ? r.categoryOrder : [], l = Array.isArray(r == null ? void 0 : r.mappings) ? r.mappings.slice() : Array.isArray(e == null ? void 0 : e.mappings) ? e.mappings.slice() : [], u = t.value;
  t.innerHTML = "";
  const d = document.createElement("option");
  d.value = "", d.textContent = E(
    "EIDOLON.LightCriteria.SelectPlaceholder",
    "Select a mapping"
  ), d.disabled = o, t.appendChild(d);
  const m = document.createElement("option");
  m.value = ve, m.textContent = E(
    "EIDOLON.LightCriteria.BaseOption",
    "Base Lighting"
  ), m.disabled = !o, t.appendChild(m), l.slice().sort((y, b) => {
    var S;
    const v = zi(y, n, s), w = zi(b, n, s);
    return v.localeCompare(w, ((S = game.i18n) == null ? void 0 : S.lang) ?? void 0, {
      sensitivity: "base"
    });
  }).forEach((y) => {
    if (!(y != null && y.id)) return;
    const b = document.createElement("option");
    b.value = y.id, b.textContent = zi(y, n, s), t.appendChild(b);
  });
  const f = new Set(
    Array.from(t.options).filter((y) => !y.disabled).map((y) => y.value)
  ), g = o && u === "" ? "" : u, p = a || (f.has(g) ? g : "");
  p && f.has(p) ? t.value = p : o ? t.value = ve : t.value = "";
}
c(qp, "populateMappingSelector");
function zi(t, e, n = []) {
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
c(zi, "formatMappingOptionLabel");
function Ll(t, e) {
  if (!t || typeof t != "object" || !Array.isArray(t.mappings)) return null;
  const n = ir(e);
  if (!n) return null;
  const i = t.mappings.find((r) => (r == null ? void 0 : r.key) === n);
  return (i == null ? void 0 : i.id) ?? null;
}
c(Ll, "findMappingIdByCategories");
function Cr(t, e) {
  return !e || !t || typeof t != "object" || !Array.isArray(t.mappings) ? null : t.mappings.find((n) => (n == null ? void 0 : n.id) === e) ?? null;
}
c(Cr, "getMappingById");
function jp(t) {
  if (!t || typeof t != "object") return "";
  const e = t.current;
  if (e != null && e.mappingId) {
    if (e.mappingId === ve)
      return t != null && t.base ? ve : "";
    if (Array.isArray(t.mappings) && t.mappings.some((n) => n.id === e.mappingId))
      return e.mappingId;
  }
  if (e != null && e.categories) {
    const n = Ll(t, e.categories);
    if (n) return n;
  }
  return "";
}
c(jp, "resolveInitialMappingSelection");
function fu(t, e = {}) {
  var o, s, l, u;
  if (!(t instanceof HTMLFormElement)) return;
  const n = t.querySelector('color-picker[name="config.color"]'), i = (n == null ? void 0 : n.value) ?? null, r = ((o = n == null ? void 0 : n.ui) == null ? void 0 : o.text) ?? ((s = n == null ? void 0 : n.querySelector) == null ? void 0 : s.call(n, 'input[type="text"]')), a = ((l = n == null ? void 0 : n.ui) == null ? void 0 : l.input) ?? ((u = n == null ? void 0 : n.querySelector) == null ? void 0 : u.call(n, 'input[type="color"]'));
  N("LightCriteria | Color state after apply", {
    ...e,
    textValue: (r == null ? void 0 : r.value) ?? null,
    pickerValue: i,
    swatchValue: (a == null ? void 0 : a.value) ?? null
  });
}
c(fu, "logAppliedColorState");
function Bp(t) {
  t.querySelectorAll("select[data-category-id]").forEach((e) => {
    e.value = "";
  });
}
c(Bp, "resetCategorySelections");
function Up(t, e) {
  const n = e && typeof e == "object" ? e : {};
  t.querySelectorAll("select[data-category-id]").forEach((i) => {
    const r = i.dataset.categoryId;
    if (!r) return;
    const a = n[r];
    i.value = typeof a == "string" ? a : "";
  });
}
c(Up, "setCategorySelections");
function Vp(t) {
  const e = {};
  return t.querySelectorAll("select[data-category-id]").forEach((n) => {
    var a, o;
    const i = n.dataset.categoryId, r = (o = (a = n.value) == null ? void 0 : a.trim) == null ? void 0 : o.call(a);
    !i || !r || (e[i] = r);
  }), Object.keys(e).length > 0 ? e : null;
}
c(Vp, "readCategorySelections");
async function Ss(t, e, n) {
  if (!t) return null;
  try {
    if (!n)
      return await Er(t, {});
    if (n === ve)
      return await Er(t, {
        mappingId: ve,
        categories: null,
        updatedAt: Date.now()
      });
    const i = Cr(e, n);
    return i ? await Er(t, {
      mappingId: i.id,
      categories: i.categories,
      updatedAt: Date.now()
    }) : null;
  } catch (i) {
    return console.warn("eidolon-utilities | Failed to persist mapping selection", i), null;
  }
}
c(Ss, "persistCurrentSelection");
function yc(t, e) {
  if (!(t instanceof HTMLElement)) return;
  const n = t.querySelector(".eidolon-light-criteria-manager__section.is-bottom");
  n instanceof HTMLElement && (n.hidden = !!(e != null && e.hidden));
}
c(yc, "updateManagerSectionVisibility");
function Zn({ switcher: t, emptyState: e, state: n }) {
  const i = !!(n != null && n.base);
  t instanceof HTMLElement && (t.hidden = !i), e instanceof HTMLElement && (e.hidden = i);
}
c(Zn, "updateActiveMappingVisibility");
function Ef(t) {
  const e = (t == null ? void 0 : t.object) ?? (t == null ? void 0 : t.document) ?? null;
  return !(e != null && e.isEmbedded) || e.documentName !== "AmbientLight" ? null : e;
}
c(Ef, "getAmbientLightDocument");
function zp(t) {
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
c(zp, "getPersistedAmbientLightDocument");
function Gp() {
  Ep();
}
c(Gp, "registerLightCriteriaHooks");
Gp();
const Il = /* @__PURE__ */ new Map();
let Ol = !1;
function bc(t, e) {
  Il.has(t) && console.warn(`[${T}] Socket handler for type "${t}" already registered, overwriting.`), Il.set(t, e);
}
c(bc, "registerSocketHandler");
function xa(t, e) {
  if (!Ol) {
    console.error(`[${T}] Socket not initialized. Call initializeSocket() first.`);
    return;
  }
  game.socket.emit(`module.${T}`, { type: t, payload: e });
}
c(xa, "emitSocket");
function Wp() {
  Ol || (game.socket.on(`module.${T}`, (t) => {
    const { type: e, payload: n } = t ?? {}, i = Il.get(e);
    i ? i(n) : console.warn(`[${T}] No socket handler for type "${e}"`);
  }), Ol = !0, console.log(`[${T}] Socket initialized on channel module.${T}`));
}
c(Wp, "initializeSocket");
const Cf = "tween", Sf = "tween-sequence", Al = "tween-sequence-cancel", Oe = Object.freeze({
  ABORT: "abort",
  CONTINUE: "continue"
}), vn = Object.freeze({
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  FAILED: "failed"
}), Ct = Object.freeze({
  BEFORE_ALL: "beforeAll",
  BEFORE_STEP: "before",
  ENTRY: "entry",
  AFTER_STEP: "after",
  RUNTIME: "runtime",
  VALIDATION: "validation",
  AWAIT: "await",
  EMIT: "emit",
  PARALLEL: "parallel"
}), Za = /* @__PURE__ */ new Map();
function Ht({ type: t, execute: e, validate: n }) {
  Za.has(t) && console.warn(`[tween-registry] Type "${t}" already registered, overwriting.`), Za.set(t, { type: t, execute: e, validate: n ?? (() => {
  }) });
}
c(Ht, "registerTweenType");
function rr(t) {
  return Za.get(t);
}
c(rr, "getTweenType");
function Yp(t, e = {}) {
  const n = rr(t);
  if (!n)
    throw new Error(`Unknown tween type: "${t}".`);
  return n.validate(e ?? {}), n;
}
c(Yp, "validateTweenEntry");
function kl() {
  return [...Za.keys()];
}
c(kl, "listTweenTypes");
const Gi = {
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
  easeInBounce: /* @__PURE__ */ c((t) => 1 - Gi.easeOutBounce(1 - t), "easeInBounce"),
  easeInOutBounce: /* @__PURE__ */ c((t) => t < 0.5 ? (1 - Gi.easeOutBounce(1 - 2 * t)) / 2 : (1 + Gi.easeOutBounce(2 * t - 1)) / 2, "easeInOutBounce"),
  easeInElastic: /* @__PURE__ */ c((t) => t === 0 || t === 1 ? t : -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI), "easeInElastic"),
  easeOutElastic: /* @__PURE__ */ c((t) => t === 0 || t === 1 ? t : Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1, "easeOutElastic")
};
function ot(t) {
  if (t && Gi[t])
    return Gi[t];
  const e = foundry.canvas.animation.CanvasAnimation;
  return {
    linear: e.easeLinear,
    easeInOutCosine: e.easeInOutCosine
  }[t] ?? e.easeInOutCosine;
}
c(ot, "resolveEasing");
function vc() {
  return ["linear", "easeInOutCosine", ...Object.keys(Gi)];
}
c(vc, "listEasingNames");
function eo(t) {
  return t <= 0.04045 ? t / 12.92 : ((t + 0.055) / 1.055) ** 2.4;
}
c(eo, "srgbToLinear");
function Wi(t) {
  return t <= 31308e-7 ? 12.92 * t : 1.055 * t ** (1 / 2.4) - 0.055;
}
c(Wi, "linearToSrgb");
function mu(t, e, n) {
  const i = 0.4122214708 * t + 0.5363325363 * e + 0.0514459929 * n, r = 0.2119034982 * t + 0.6806995451 * e + 0.1073969566 * n, a = 0.0883024619 * t + 0.2817188376 * e + 0.6299787005 * n, o = Math.cbrt(i), s = Math.cbrt(r), l = Math.cbrt(a);
  return [
    0.2104542553 * o + 0.793617785 * s - 0.0040720468 * l,
    1.9779984951 * o - 2.428592205 * s + 0.4505937099 * l,
    0.0259040371 * o + 0.7827717662 * s - 0.808675766 * l
  ];
}
c(mu, "linearRgbToOklab");
function Jp(t, e, n) {
  const i = (t + 0.3963377774 * e + 0.2158037573 * n) ** 3, r = (t - 0.1055613458 * e - 0.0638541728 * n) ** 3, a = (t - 0.0894841775 * e - 1.291485548 * n) ** 3;
  return [
    4.0767416621 * i - 3.3077115913 * r + 0.2309699292 * a,
    -1.2684380046 * i + 2.6097574011 * r - 0.3413193965 * a,
    -0.0041960863 * i - 0.7034186147 * r + 1.707614701 * a
  ];
}
c(Jp, "oklabToLinearRgb");
function to(t) {
  return [t.r, t.g, t.b];
}
c(to, "colorToRgb");
function Tf(t, e, n) {
  const i = /* @__PURE__ */ c((a) => Math.max(0, Math.min(1, a)), "clamp"), r = /* @__PURE__ */ c((a) => Math.round(i(a) * 255).toString(16).padStart(2, "0"), "toHex");
  return `#${r(t)}${r(e)}${r(n)}`;
}
c(Tf, "rgbToHex");
function Kp(t, e, n) {
  if (n <= 0) return t.toHTML();
  if (n >= 1) return e.toHTML();
  const i = foundry.utils.Color, [r, a, o] = t.hsl, [s, l, u] = e.hsl, d = (s - r + 0.5) % 1 - 0.5, m = (r + d * n + 1) % 1, f = a + (l - a) * n, g = o + (u - o) * n;
  return i.fromHSL([m, f, g]).toHTML();
}
c(Kp, "interpolateHsl");
function Xp(t, e, n) {
  if (n <= 0) return t.toHTML();
  if (n >= 1) return e.toHTML();
  const [i, r, a] = to(t).map(eo), [o, s, l] = to(e).map(eo), u = Wi(i + (o - i) * n), d = Wi(r + (s - r) * n), m = Wi(a + (l - a) * n);
  return Tf(u, d, m);
}
c(Xp, "interpolateRgb");
function Qp(t, e, n) {
  if (n <= 0) return t.toHTML();
  if (n >= 1) return e.toHTML();
  const [i, r, a] = to(t).map(eo), [o, s, l] = to(e).map(eo), [u, d, m] = mu(i, r, a), [f, g, p] = mu(o, s, l), y = 0.02, b = Math.sqrt(d * d + m * m), v = Math.sqrt(g * g + p * p);
  let w, S, I;
  if (b < y || v < y)
    w = u + (f - u) * n, S = d + (g - d) * n, I = m + (p - m) * n;
  else {
    const M = Math.atan2(m, d);
    let F = Math.atan2(p, g) - M;
    F > Math.PI && (F -= 2 * Math.PI), F < -Math.PI && (F += 2 * Math.PI), w = u + (f - u) * n;
    const P = b + (v - b) * n, _ = M + F * n;
    S = P * Math.cos(_), I = P * Math.sin(_);
  }
  const [A, O, x] = Jp(w, S, I);
  return Tf(Wi(A), Wi(O), Wi(x));
}
c(Qp, "interpolateOklch");
const Ml = {
  hsl: Kp,
  rgb: Xp,
  oklch: Qp
};
function wc(t = "hsl") {
  return Ml[t] ?? Ml.hsl;
}
c(wc, "getInterpolator");
function Zi() {
  return Object.keys(Ml);
}
c(Zi, "listInterpolationModes");
function Zp(t) {
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
  if (t.mode && !Zi().includes(t.mode))
    throw new Error(
      `light-color tween: unknown mode "${t.mode}". Available: ${Zi().join(", ")}`
    );
}
c(Zp, "validate$7");
async function ey(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { Color: i } = foundry.utils, { uuid: r, toColor: a, toAlpha: o, mode: s = "oklch" } = t, l = Array.isArray(r) ? r : [r];
  if (l.length === 0)
    return console.warn("light-color tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: u = 2e3,
    easing: d = "easeInOutCosine",
    commit: m = !0,
    startEpochMS: f = null,
    signal: g = null
  } = e, p = ot(d), y = a != null, b = o != null, v = y ? wc(s) : null, w = y ? i.fromString(a) : null;
  if (y && !w.valid) throw new Error(`light-color tween: invalid target color "${a}".`);
  async function S(A) {
    var j, B;
    if (g != null && g.aborted) return !1;
    const O = await fromUuid(A);
    if (!O) return !1;
    const x = O.object;
    if (!x) return !1;
    let M;
    if (y) {
      const V = (j = O.config) == null ? void 0 : j.color;
      V != null && V.valid || console.warn(`light-color tween: source color invalid on ${A}, using white.`), M = V != null && V.valid ? V : i.fromString("#ffffff");
    }
    const D = b ? ((B = O._source.config) == null ? void 0 : B.alpha) ?? 0.5 : null, F = { t: 0 }, P = `ambient-hue-tween:${A}`;
    n.terminateAnimation(P), g && g.addEventListener("abort", () => {
      n.terminateAnimation(P);
    }, { once: !0 });
    const _ = typeof f == "number" ? Math.max(0, Math.min(u, Date.now() - f)) : 0, H = /* @__PURE__ */ c((V) => {
      const J = {};
      y && (J.color = v(M, w, V)), b && (J.alpha = D + (o - D) * V), O.updateSource({ config: J }), x.initializeLightSource();
    }, "applyFrame");
    _ > 0 && (F.t = _ / u, H(F.t));
    const q = await n.animate(
      [{ parent: F, attribute: "t", to: 1 }],
      {
        name: P,
        duration: u,
        easing: p,
        time: _,
        ontick: /* @__PURE__ */ c(() => H(F.t), "ontick")
      }
    );
    if (q !== !1) {
      if (g != null && g.aborted) return !1;
      const V = {};
      y && (V.color = w.toHTML()), b && (V.alpha = o), O.updateSource({ config: V }), x.initializeLightSource();
    }
    if (m && q !== !1 && O.canUserModify(game.user, "update")) {
      if (g != null && g.aborted) return !1;
      const V = {}, J = {};
      y && (V.color = M.toHTML(), J["config.color"] = w.toHTML()), b && (V.alpha = D, J["config.alpha"] = o), O.updateSource({ config: V }), await O.update(J);
    }
    return q !== !1;
  }
  return c(S, "animateOne"), (await Promise.all(l.map(S))).every(Boolean);
}
c(ey, "execute$7");
function ty() {
  Ht({ type: "light-color", execute: ey, validate: Zp });
}
c(ty, "registerLightColorTween");
const wn = /* @__PURE__ */ new WeakMap();
function ny(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("light-state tween: 'uuid' is required (string or array of AmbientLight document UUIDs).");
  if (typeof t.enabled != "boolean")
    throw new Error("light-state tween: 'enabled' (boolean) is required.");
}
c(ny, "validate$6");
async function iy(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, enabled: r } = t, a = Array.isArray(i) ? i : [i];
  if (a.length === 0)
    return console.warn("light-state tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: o = 2e3,
    easing: s = "easeInOutCosine",
    commit: l = !0,
    startEpochMS: u = null,
    signal: d = null
  } = e, m = ot(s);
  async function f(p) {
    var O, x, M, D;
    if (d != null && d.aborted) return !1;
    const y = await fromUuid(p);
    if (!y) return !1;
    const b = y.object;
    if (!b) return !1;
    const v = `ambient-state-tween:${p}`;
    n.terminateAnimation(v), d && d.addEventListener("abort", () => {
      n.terminateAnimation(v);
    }, { once: !0 });
    const w = wn.get(y) ?? {
      hidden: y._source.hidden,
      alpha: ((O = y._source.config) == null ? void 0 : O.alpha) ?? 0.5
    };
    if (wn.set(y, w), N(`light-state START ${r ? "ON" : "OFF"} | snap: ${JSON.stringify(w)} | _source.hidden=${y._source.hidden}, _source.config.alpha=${(x = y._source.config) == null ? void 0 : x.alpha}`), r && !w.hidden || !r && w.hidden)
      return wn.delete(y), !0;
    const S = w.alpha, I = typeof u == "number" ? Math.max(0, Math.min(o, Date.now() - u)) : 0, A = /* @__PURE__ */ c((F) => {
      y.updateSource({ config: { alpha: F } }), b.initializeLightSource();
    }, "applyAlpha");
    if (r) {
      y.updateSource({ hidden: !1, config: { alpha: 0 } }), b.initializeLightSource(), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
      const F = { t: 0 };
      I > 0 && (F.t = I / o, A(S * F.t));
      const P = await n.animate(
        [{ parent: F, attribute: "t", to: 1 }],
        {
          name: v,
          duration: o,
          easing: m,
          time: I,
          ontick: /* @__PURE__ */ c(() => A(S * F.t), "ontick")
        }
      );
      return P !== !1 && !(d != null && d.aborted) && l && y.canUserModify(game.user, "update") ? (y.updateSource({ hidden: !0, config: { alpha: S } }), await y.update({ hidden: !1 }), N(`light-state FADE-IN committed. _source.hidden=${y._source.hidden}, _source.config.alpha=${(M = y._source.config) == null ? void 0 : M.alpha}`), wn.delete(y)) : P === !1 || wn.delete(y), P !== !1;
    } else {
      y.updateSource({ hidden: !1, config: { alpha: w.alpha } }), b.initializeLightSource();
      const F = { t: 0 };
      I > 0 && (F.t = I / o, A(S * (1 - F.t)));
      const P = await n.animate(
        [{ parent: F, attribute: "t", to: 1 }],
        {
          name: v,
          duration: o,
          easing: m,
          time: I,
          ontick: /* @__PURE__ */ c(() => A(S * (1 - F.t)), "ontick")
        }
      );
      return P !== !1 && !(d != null && d.aborted) && l && y.canUserModify(game.user, "update") ? (await y.update({ hidden: !0 }), y.updateSource({ config: { alpha: S } }), b.initializeLightSource(), N(`light-state FADE-OUT committed+restored. _source.hidden=${y._source.hidden}, _source.config.alpha=${(D = y._source.config) == null ? void 0 : D.alpha}`), wn.delete(y)) : P === !1 || (y.updateSource({ hidden: !0, config: { alpha: S } }), b.initializeLightSource(), wn.delete(y)), P !== !1;
    }
  }
  return c(f, "animateOne"), (await Promise.all(a.map(f))).every(Boolean);
}
c(iy, "execute$6");
function ry() {
  Ht({ type: "light-state", execute: iy, validate: ny });
}
c(ry, "registerLightStateTween");
function ts(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("tile-prop tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (!t.attribute || typeof t.attribute != "string")
    throw new Error("tile-prop tween: 'attribute' (string) is required — dot-path to a numeric property (e.g. 'alpha', 'rotation').");
  if (typeof t.value != "number")
    throw new Error("tile-prop tween: 'value' (number) is required — the target value to animate to.");
}
c(ts, "validate$5");
async function ns(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, attribute: r, value: a } = t, o = Array.isArray(i) ? i : [i];
  if (o.length === 0)
    return console.warn("tile-prop tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: s = 2e3,
    easing: l = "easeInOutCosine",
    commit: u = !0,
    startEpochMS: d = null,
    signal: m = null
  } = e, f = ot(l);
  async function g(y) {
    if (m != null && m.aborted) return !1;
    const b = await fromUuid(y);
    if (!b) return !1;
    const v = b.object;
    if (!v) return !1;
    const w = foundry.utils.getProperty(b._source, r);
    if (typeof w != "number")
      return console.warn(`tile-prop tween: source value at '${r}' on ${y} is not a number (got ${typeof w}). Skipping.`), !1;
    const S = `tile-prop-tween:${r}:${y}`;
    n.terminateAnimation(S), m && m.addEventListener("abort", () => {
      n.terminateAnimation(S);
    }, { once: !0 });
    const I = typeof d == "number" ? Math.max(0, Math.min(s, Date.now() - d)) : 0, A = /* @__PURE__ */ c((M) => {
      const D = w + (a - w) * M;
      b.updateSource(foundry.utils.expandObject({ [r]: D })), v.refresh();
    }, "applyFrame"), O = { t: 0 };
    I > 0 && (O.t = I / s, A(O.t));
    const x = await n.animate(
      [{ parent: O, attribute: "t", to: 1 }],
      {
        name: S,
        duration: s,
        easing: f,
        time: I,
        ontick: /* @__PURE__ */ c(() => A(O.t), "ontick")
      }
    );
    if (x !== !1) {
      if (m != null && m.aborted) return !1;
      b.updateSource(foundry.utils.expandObject({ [r]: a })), v.refresh();
    }
    if (u && x !== !1 && b.canUserModify(game.user, "update")) {
      if (m != null && m.aborted) return !1;
      b.updateSource(foundry.utils.expandObject({ [r]: w })), await b.update({ [r]: a });
    }
    return x !== !1;
  }
  return c(g, "animateOne"), (await Promise.all(o.map(g))).every(Boolean);
}
c(ns, "execute$5");
function ay() {
  Ht({ type: "tile-prop", execute: ns, validate: ts });
}
c(ay, "registerTilePropTween");
function oy(t) {
  if (!t.attribute || typeof t.attribute != "string")
    throw new Error("particles-prop tween: 'attribute' (string) is required — property name on canvas.particleeffects (e.g. 'alpha').");
  if (typeof t.value != "number")
    throw new Error("particles-prop tween: 'value' (number) is required — the target value to animate to.");
}
c(oy, "validate$4");
async function sy(t, e = {}) {
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
  const m = ot(o), f = `particles-prop-tween:${i}`;
  n.terminateAnimation(f), l && l.addEventListener("abort", () => {
    n.terminateAnimation(f);
  }, { once: !0 });
  const g = typeof s == "number" ? Math.max(0, Math.min(a, Date.now() - s)) : 0, p = /* @__PURE__ */ c((v) => {
    u[i] = d + (r - d) * v;
  }, "applyFrame"), y = { t: 0 };
  g > 0 && (y.t = g / a, p(y.t));
  const b = await n.animate(
    [{ parent: y, attribute: "t", to: 1 }],
    {
      name: f,
      duration: a,
      easing: m,
      time: g,
      ontick: /* @__PURE__ */ c(() => p(y.t), "ontick")
    }
  );
  if (b !== !1) {
    if (l != null && l.aborted) return !1;
    u[i] = r;
  }
  return b !== !1;
}
c(sy, "execute$4");
function ly() {
  Ht({ type: "particles-prop", execute: sy, validate: oy });
}
c(ly, "registerParticlesPropTween");
var On, Br, Ur, Vr, zr, Gr, Ji;
const _c = class _c {
  /**
   * @param {AbortController} controller
   */
  constructor(e) {
    k(this, On);
    k(this, Br);
    k(this, Ur);
    k(this, Vr);
    k(this, zr);
    k(this, Gr, !1);
    k(this, Ji, null);
    L(this, On, e), L(this, Vr, new Promise((n) => {
      L(this, Br, n);
    })), L(this, zr, new Promise((n) => {
      L(this, Ur, n);
    }));
  }
  /** @returns {Promise<boolean>} Resolves true (completed) or false (cancelled/failed). */
  get finished() {
    return h(this, Vr);
  }
  /** @returns {Promise<{status: string, [k: string]: unknown}>} */
  get result() {
    return h(this, zr);
  }
  /** @returns {boolean} */
  get cancelled() {
    return h(this, On).signal.aborted;
  }
  /** @returns {AbortSignal} */
  get signal() {
    return h(this, On).signal;
  }
  /** @returns {string} */
  get status() {
    return h(this, Ji) ? h(this, Ji).status : this.cancelled ? "cancelled" : "running";
  }
  /** Abort the timeline, triggering onCancel callbacks. */
  cancel(e = "cancelled") {
    h(this, On).signal.aborted || h(this, On).abort(e);
  }
  /**
   * Called internally by the execution engine when the timeline finishes.
   * @param {boolean} completed - true if all steps ran, false if cancelled
   */
  _resolve(e) {
    if (h(this, Gr)) return;
    L(this, Gr, !0);
    const n = typeof e == "boolean" ? { status: e ? "completed" : "cancelled" } : e ?? { status: "cancelled" };
    L(this, Ji, n), h(this, Br).call(this, n.status === "completed"), h(this, Ur).call(this, n);
  }
};
On = new WeakMap(), Br = new WeakMap(), Ur = new WeakMap(), Vr = new WeakMap(), zr = new WeakMap(), Gr = new WeakMap(), Ji = new WeakMap(), c(_c, "TimelineHandle");
let _l = _c;
var hi, Ki, gi;
const Nc = class Nc {
  constructor() {
    /** @type {Map<string, Set<Function>>} */
    k(this, hi, /* @__PURE__ */ new Map());
    /** @type {Set<string>} Signals that have been emitted (sticky) */
    k(this, Ki, /* @__PURE__ */ new Set());
    k(this, gi, !1);
  }
  /**
   * Subscribe to a named signal.
   * @param {string} signal
   * @param {Function} listener
   * @returns {() => void} Unsubscribe function
   */
  on(e, n) {
    if (h(this, gi)) return () => {
    };
    let i = h(this, hi).get(e);
    return i || (i = /* @__PURE__ */ new Set(), h(this, hi).set(e, i)), i.add(n), () => i.delete(n);
  }
  /**
   * Fire a named signal synchronously. All registered listeners are invoked.
   * The signal is recorded so that future waitFor() calls resolve immediately.
   * @param {string} signal
   */
  emit(e) {
    if (h(this, gi)) return;
    h(this, Ki).add(e);
    const n = h(this, hi).get(e);
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
    return h(this, gi) ? Promise.reject(new Error("EventBus destroyed")) : h(this, Ki).has(e) ? Promise.resolve() : new Promise((i, r) => {
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
    L(this, gi, !0), h(this, hi).clear(), h(this, Ki).clear();
  }
};
hi = new WeakMap(), Ki = new WeakMap(), gi = new WeakMap(), c(Nc, "EventBus");
let Nl = Nc;
const Lf = /* @__PURE__ */ new Map();
function is(t, e) {
  Lf.set(t, e);
}
c(is, "registerAwaitProvider");
function xl(t, e) {
  const n = Lf.get(t.event);
  return n ? n(t, e) : Promise.reject(new Error(`Unknown await event type: "${t.event}"`));
}
c(xl, "createAwaitPromise");
is("signal", (t, e) => t.name ? e.eventBus.waitFor(t.name, e.signal) : Promise.reject(new Error('await signal: "name" is required')));
is("click", (t, e) => new Promise((n, i) => {
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
is("keypress", (t, e) => new Promise((n, i) => {
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
const Ri = /* @__PURE__ */ new Map();
function cy(t, e) {
  const n = Ri.get(t);
  n && !n.cancelled && n.cancel("replaced-by-name"), Ri.set(t, e), e.finished.then(() => {
    Ri.get(t) === e && Ri.delete(t);
  });
}
c(cy, "registerTimeline");
function If(t) {
  const e = Ri.get(t);
  return e && !e.cancelled ? (e.cancel("cancelled-by-name"), !0) : !1;
}
c(If, "cancelTimeline");
function uy(t) {
  return Ri.get(t);
}
c(uy, "getTimeline");
function hu(t, e) {
  return t <= 0 ? Promise.resolve() : new Promise((n, i) => {
    if (e.aborted) return i(e.reason);
    const r = setTimeout(n, t);
    e.addEventListener("abort", () => {
      clearTimeout(r), i(e.reason);
    }, { once: !0 });
  });
}
c(hu, "cancellableDelay");
var Be, An, Wr, Yr;
const xc = class xc {
  constructor(e) {
    /** @type {TweenTimeline} */
    k(this, Be);
    /** @type {Array<{ type: string, params: object, opts?: object, detach: boolean }>} */
    k(this, An, []);
    /** @type {Function|null} */
    k(this, Wr, null);
    /** @type {Function|null} */
    k(this, Yr, null);
    L(this, Be, e);
  }
  /**
   * Add a tween entry to this step.
   * @param {string} type  Registered tween type name
   * @param {object} params  Type-specific parameters
   * @param {object} [opts]  Options (durationMS, easing, etc.)
   * @returns {StepBuilder} this
   */
  add(e, n, i) {
    return h(this, An).push({ type: e, params: n, opts: i ?? {}, detach: !1 }), this;
  }
  /**
   * Mark the last entry as fire-and-forget (does not block step progression).
   * @returns {StepBuilder} this
   */
  detach() {
    if (h(this, An).length === 0)
      throw new Error("StepBuilder.detach(): no entry to detach.");
    return h(this, An)[h(this, An).length - 1].detach = !0, this;
  }
  /**
   * Callback invoked before this step's tweens start.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  before(e) {
    return L(this, Wr, e), this;
  }
  /**
   * Callback invoked after this step's awaited tweens complete.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  after(e) {
    return L(this, Yr, e), this;
  }
  // ── Delegation to parent TweenTimeline for fluent chaining ──
  /** Start a new step (finalizes this one). */
  step() {
    return h(this, Be).step();
  }
  /** Insert a delay between steps. */
  delay(e) {
    return h(this, Be).delay(e);
  }
  /** Insert an await segment. */
  await(e) {
    return h(this, Be).await(e);
  }
  /** Insert an emit segment. */
  emit(e) {
    return h(this, Be).emit(e);
  }
  /** Insert a parallel segment. */
  parallel(e, n) {
    return h(this, Be).parallel(e, n);
  }
  /** Register onComplete callback. */
  onComplete(e) {
    return h(this, Be).onComplete(e);
  }
  /** Register onCancel callback. */
  onCancel(e) {
    return h(this, Be).onCancel(e);
  }
  /** Register onError callback. */
  onError(e) {
    return h(this, Be).onError(e);
  }
  /** Execute the timeline. */
  run(e) {
    return h(this, Be).run(e);
  }
  /** Serialize the timeline. */
  toJSON() {
    return h(this, Be).toJSON();
  }
  // ── Internal access ──
  /** @returns {{ entries: Array, before: Function|null, after: Function|null }} */
  _finalize() {
    return {
      entries: h(this, An),
      before: h(this, Wr),
      after: h(this, Yr)
    };
  }
};
Be = new WeakMap(), An = new WeakMap(), Wr = new WeakMap(), Yr = new WeakMap(), c(xc, "StepBuilder");
let $l = xc;
var Ue, Me, kt, kn, Jr, Kr, Xr, Qr, Gn, Fl, K, an, Dl, Of, Pl, Af, kf, $a, ft, Bt;
const ln = class ln {
  constructor() {
    k(this, K);
    /** @type {string|null} */
    k(this, Ue, null);
    /** @type {string} */
    k(this, Me, Oe.ABORT);
    /** @type {Array<object>} */
    k(this, kt, []);
    /** @type {StepBuilder|null} */
    k(this, kn, null);
    /** @type {Function|null} */
    k(this, Jr, null);
    /** @type {Function|null} */
    k(this, Kr, null);
    /** @type {Function|null} */
    k(this, Xr, null);
    /** @type {Function|null} */
    k(this, Qr, null);
  }
  /**
   * Register this timeline in the named registry. Starting a new
   * timeline with the same name cancels the previous one.
   * @param {string} name
   * @returns {TweenTimeline} this
   */
  name(e) {
    return L(this, Ue, e), this;
  }
  /**
   * Set the error policy for step execution.
   * @param {"abort"|"continue"} policy
   * @returns {TweenTimeline} this
   */
  errorPolicy(e) {
    if (e !== Oe.ABORT && e !== Oe.CONTINUE)
      throw new Error(`Invalid error policy: "${e}". Use "abort" or "continue".`);
    return L(this, Me, e), this;
  }
  /**
   * Start a new step. Finalizes the previous step if one is open.
   * @returns {StepBuilder}
   */
  step() {
    return C(this, K, an).call(this), L(this, kn, new $l(this)), h(this, kn);
  }
  /**
   * Insert a delay (in ms) between the previous step and the next.
   * @param {number} ms
   * @returns {TweenTimeline} this
   */
  delay(e) {
    return C(this, K, an).call(this), h(this, kt).push({ kind: "delay", ms: e }), this;
  }
  /**
   * Pause execution until an event occurs.
   * @param {object} config  e.g. { event: "click" }, { event: "signal", name: "fog-done" }
   * @returns {TweenTimeline} this
   */
  await(e) {
    return C(this, K, an).call(this), h(this, kt).push({ kind: "await", config: e }), this;
  }
  /**
   * Fire a named signal (instant, non-blocking).
   * @param {string} signal  Signal name
   * @returns {TweenTimeline} this
   */
  emit(e) {
    return C(this, K, an).call(this), h(this, kt).push({ kind: "emit", signal: e }), this;
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
    C(this, K, an).call(this);
    const i = n.join ?? "all", r = n.overflow ?? "detach";
    if (i !== "all" && i !== "any" && (typeof i != "number" || i < 1 || i > e.length))
      throw new Error(`parallel: join must be "all", "any", or 1..${e.length}, got ${JSON.stringify(i)}`);
    if (r !== "detach" && r !== "cancel")
      throw new Error(`parallel: overflow must be "detach" or "cancel", got ${JSON.stringify(r)}`);
    const a = e.map((o) => {
      var l;
      const s = new ln();
      return o(s), C(l = s, K, an).call(l), h(s, kt);
    });
    return h(this, kt).push({ kind: "parallel", branches: a, join: i, overflow: r }), this;
  }
  /**
   * Callback invoked before the first step runs.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  beforeAll(e) {
    return L(this, Jr, e), this;
  }
  /**
   * Callback invoked on successful completion.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onComplete(e) {
    return L(this, Kr, e), this;
  }
  /**
   * Callback invoked on cancellation (mutually exclusive with onComplete).
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onCancel(e) {
    return L(this, Xr, e), this;
  }
  /**
   * Callback invoked on runtime failure (mutually exclusive with onComplete/onCancel).
   * @param {(outcome: object) => void} fn
   * @returns {TweenTimeline} this
   */
  onError(e) {
    return L(this, Qr, e), this;
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
    C(this, K, an).call(this);
    const n = new AbortController();
    e.signal && (e.signal.aborted ? n.abort(e.signal.reason ?? "parent-aborted") : e.signal.addEventListener("abort", () => {
      n.signal.aborted || n.abort(e.signal.reason ?? "parent-aborted");
    }, { once: !0 }));
    const i = new _l(n);
    h(this, Ue) && cy(h(this, Ue), i);
    const r = e.broadcast ?? game.user.isGM, a = e.commit ?? game.user.isGM, o = e.startEpochMS ?? Date.now();
    r && h(this, Ue) && xa(Sf, {
      name: h(this, Ue),
      data: this.toJSON(),
      startEpochMS: o
    });
    const s = new Nl(), l = {
      signal: i.signal,
      commit: a,
      startEpochMS: o,
      eventBus: s,
      errors: [],
      detachedPromises: []
    };
    return C(this, K, Of).call(this, i, l).then((u) => {
      var d, m, f;
      s.destroy(), i._resolve(u), u.status === vn.COMPLETED ? (d = h(this, Kr)) == null || d.call(this) : u.status === vn.CANCELLED ? ((m = h(this, Xr)) == null || m.call(this), r && h(this, Ue) && xa(Al, {
        name: h(this, Ue),
        reason: u.reason
      })) : ((f = h(this, Qr)) == null || f.call(this, u), r && h(this, Ue) && xa(Al, {
        name: h(this, Ue),
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
    C(this, K, an).call(this);
    const n = { timeline: C(i = ln, Gn, Fl).call(i, h(this, kt)) };
    return h(this, Ue) && (n.name = h(this, Ue)), h(this, Me) !== Oe.ABORT && (n.errorPolicy = h(this, Me)), n;
  }
};
Ue = new WeakMap(), Me = new WeakMap(), kt = new WeakMap(), kn = new WeakMap(), Jr = new WeakMap(), Kr = new WeakMap(), Xr = new WeakMap(), Qr = new WeakMap(), Gn = new WeakSet(), Fl = /* @__PURE__ */ c(function(e) {
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
            return C(a = ln, Gn, Fl).call(a, r);
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
}, "#serializeSegments"), K = new WeakSet(), // ── Private ─────────────────────────────────────────────────────────
an = /* @__PURE__ */ c(function() {
  h(this, kn) && (h(this, kt).push({ kind: "step", data: h(this, kn)._finalize() }), L(this, kn, null));
}, "#finalizeCurrentStep"), Dl = /* @__PURE__ */ c(function(e) {
  e.length !== 0 && Promise.allSettled(e).catch(() => {
  });
}, "#drainDetached"), Of = /* @__PURE__ */ c(async function(e, n) {
  var i, r;
  try {
    if (n.signal.aborted) return C(this, K, ft).call(this, n.signal.reason);
    const a = await C(this, K, $a).call(this, h(this, Jr), Ct.BEFORE_ALL, null);
    if (a) {
      if (h(this, Me) === Oe.ABORT) return a;
      n.errors.push(a);
    }
    const o = await C(this, K, Pl).call(this, h(this, kt), n);
    if (o)
      return C(i = ln, Gn, Dl).call(i, n.detachedPromises), o;
    if (!n.signal.aborted) {
      const s = await Promise.allSettled(n.detachedPromises);
      for (const l of s)
        if (l.status === "rejected") {
          const u = C(this, K, Bt).call(this, l.reason, Ct.ENTRY);
          if (h(this, Me) === Oe.ABORT) return u;
          n.errors.push(u);
        }
    }
    return n.signal.aborted ? C(this, K, ft).call(this, n.signal.reason) : {
      status: vn.COMPLETED,
      ...n.errors.length > 0 ? { errors: n.errors } : {}
    };
  } catch (a) {
    return C(r = ln, Gn, Dl).call(r, n.detachedPromises), n.signal.aborted ? C(this, K, ft).call(this, n.signal.reason) : (console.error("TweenTimeline execution error:", a), C(this, K, Bt).call(this, a, Ct.RUNTIME));
  }
}, "#execute"), Pl = /* @__PURE__ */ c(async function(e, n) {
  let i = -1, r = 0;
  for (const a of e) {
    if (n.signal.aborted) return C(this, K, ft).call(this, n.signal.reason);
    if (a.kind === "delay") {
      try {
        await hu(a.ms, n.signal);
      } catch {
        return C(this, K, ft).call(this, n.signal.reason);
      }
      r += a.ms;
      continue;
    }
    if (a.kind === "await") {
      try {
        let p = xl(a.config, {
          signal: n.signal,
          eventBus: n.eventBus
        });
        const y = a.config.timeout;
        typeof y == "number" && y > 0 && (p = Promise.race([
          p,
          hu(y, n.signal)
        ])), await p;
      } catch (p) {
        if (n.signal.aborted) return C(this, K, ft).call(this, n.signal.reason);
        const y = C(this, K, Bt).call(this, p, Ct.AWAIT);
        if (h(this, Me) === Oe.ABORT) return y;
        n.errors.push(y);
      }
      continue;
    }
    if (a.kind === "emit") {
      try {
        n.eventBus.emit(a.signal);
      } catch (p) {
        const y = C(this, K, Bt).call(this, p, Ct.EMIT);
        if (h(this, Me) === Oe.ABORT) return y;
        n.errors.push(y);
      }
      continue;
    }
    if (a.kind === "parallel") {
      const p = await C(this, K, Af).call(this, a, n, r);
      if (p) return p;
      continue;
    }
    i += 1;
    const { entries: o, before: s, after: l } = a.data, u = await C(this, K, $a).call(this, s, Ct.BEFORE_STEP, i);
    if (u) {
      if (h(this, Me) === Oe.ABORT) return u;
      n.errors.push(u);
      continue;
    }
    if (n.signal.aborted) return C(this, K, ft).call(this, n.signal.reason);
    const d = [];
    let m = 0;
    for (const p of o) {
      const y = rr(p.type);
      if (!y) {
        const S = C(this, K, Bt).call(this, new Error(`TweenTimeline: unknown tween type "${p.type}"`), Ct.ENTRY, i, p.type);
        if (h(this, Me) === Oe.ABORT) return S;
        n.errors.push(S), console.warn(S.error.message);
        continue;
      }
      const b = {
        ...p.opts,
        commit: n.commit,
        startEpochMS: n.startEpochMS + r,
        signal: n.signal
      }, v = b.durationMS ?? 2e3, w = Promise.resolve().then(() => y.execute(p.params, b)).then((S) => S === !1 ? {
        ok: !1,
        failure: C(this, K, Bt).call(this, new Error("Tween entry returned false."), Ct.ENTRY, i, p.type)
      } : { ok: !0 }).catch((S) => ({
        ok: !1,
        failure: C(this, K, Bt).call(this, S, Ct.ENTRY, i, p.type)
      }));
      p.detach ? n.detachedPromises.push(w) : (d.push(w), m = Math.max(m, v));
    }
    const f = await C(this, K, kf).call(this, d, n.signal);
    if (f === null) return C(this, K, ft).call(this, n.signal.reason);
    for (const p of f)
      if (!p.ok) {
        if (h(this, Me) === Oe.ABORT) return p.failure;
        n.errors.push(p.failure), console.warn("TweenTimeline: entry failed:", p.failure.error);
      }
    const g = await C(this, K, $a).call(this, l, Ct.AFTER_STEP, i);
    if (g) {
      if (h(this, Me) === Oe.ABORT) return g;
      n.errors.push(g);
    }
    if (n.signal.aborted) return C(this, K, ft).call(this, n.signal.reason);
    r += m;
  }
  return null;
}, "#executeSegments"), Af = /* @__PURE__ */ c(async function(e, n, i = 0) {
  const { branches: r, join: a, overflow: o } = e, s = r.length, l = a === "all" ? s : a === "any" ? 1 : a, u = r.map(() => {
    const p = new AbortController();
    return n.signal.aborted ? p.abort(n.signal.reason ?? "parent-aborted") : n.signal.addEventListener("abort", () => {
      p.signal.aborted || p.abort(n.signal.reason ?? "parent-aborted");
    }, { once: !0 }), p;
  });
  let d = 0, m = 0;
  const f = new Array(s).fill(null);
  let g;
  return new Promise((p) => {
    let y = !1;
    const b = /* @__PURE__ */ c(() => {
      if (y) return;
      if (d >= l) {
        y = !0, v(), p(null);
        return;
      }
      const w = s - d - m;
      if (d + w < l) {
        y = !0, v();
        const S = f.filter((A) => A && A.status === vn.FAILED).map((A) => A), I = C(this, K, Bt).call(this, new Error(`parallel: join target ${l} impossible (${d} completed, ${m} failed)`), Ct.PARALLEL);
        h(this, Me) === Oe.ABORT ? p(I) : (n.errors.push(I), n.errors.push(...S), p(null));
      }
    }, "checkJoin"), v = /* @__PURE__ */ c(() => {
      if (o === "cancel")
        for (let w = 0; w < s; w++)
          !f[w] && !u[w].signal.aborted && u[w].abort("overflow-cancel");
      for (let w = 0; w < s; w++)
        f[w] || n.detachedPromises.push(g[w]);
    }, "applyOverflow");
    if (g = r.map((w, S) => {
      const I = {
        signal: u[S].signal,
        commit: n.commit,
        startEpochMS: n.startEpochMS + i,
        eventBus: n.eventBus,
        // shared
        errors: n.errors,
        // shared
        detachedPromises: n.detachedPromises
        // shared
      };
      return C(this, K, Pl).call(this, w, I).then((A) => {
        if (A)
          if (A.status === vn.CANCELLED) {
            if (u[S].signal.aborted) {
              f[S] = A;
              return;
            }
            f[S] = A, m++;
          } else
            f[S] = A, m++;
        else
          f[S] = { status: vn.COMPLETED }, d++;
        b();
      });
    }), n.signal.aborted) {
      y = !0, p(C(this, K, ft).call(this, n.signal.reason));
      return;
    }
    n.signal.addEventListener("abort", () => {
      y || (y = !0, p(C(this, K, ft).call(this, n.signal.reason)));
    }, { once: !0 });
  });
}, "#executeParallel"), /**
 * @param {Array<Promise<{ok: boolean, failure?: object}>>} stepPromises
 * @param {AbortSignal} signal
 * @returns {Promise<Array<{ok: boolean, failure?: object}>|null>}
 */
kf = /* @__PURE__ */ c(function(e, n) {
  return e.length === 0 ? Promise.resolve([]) : n.aborted ? Promise.resolve(null) : new Promise((i, r) => {
    const a = /* @__PURE__ */ c(() => i(null), "onAbort");
    n.addEventListener("abort", a, { once: !0 }), Promise.all(e).then((o) => {
      n.removeEventListener("abort", a), i(o);
    }).catch((o) => {
      n.removeEventListener("abort", a), r(o);
    });
  });
}, "#waitForStep"), $a = /* @__PURE__ */ c(async function(e, n, i) {
  if (!e) return null;
  try {
    return await e(), null;
  } catch (r) {
    const a = C(this, K, Bt).call(this, r, n, i ?? void 0);
    return h(this, Me) === Oe.CONTINUE && console.warn(`TweenTimeline: hook failure in ${n}:`, r), a;
  }
}, "#runHook"), /** @param {unknown} reason */
ft = /* @__PURE__ */ c(function(e) {
  let n;
  return typeof e == "string" ? n = e : e instanceof Error && (n = e.message), {
    status: vn.CANCELLED,
    ...n ? { reason: n } : {}
  };
}, "#cancelledOutcome"), /**
 * @param {unknown} err
 * @param {string} phase
 * @param {number} [stepIndex]
 * @param {string} [entryType]
 */
Bt = /* @__PURE__ */ c(function(e, n, i, r) {
  const a = e instanceof Error ? e : new Error(String(e));
  return {
    status: vn.FAILED,
    error: a,
    phase: n,
    ...typeof i == "number" ? { stepIndex: i } : {},
    ...r ? { entryType: r } : {}
  };
}, "#failedOutcome"), k(ln, Gn), c(ln, "TweenTimeline");
let no = ln;
function Ec(t) {
  if (!t || typeof t != "object")
    throw new Error("Sequence JSON: data must be an object.");
  if (!Array.isArray(t.timeline))
    throw new Error("Sequence JSON: 'timeline' must be an array.");
  if (t.name != null && typeof t.name != "string")
    throw new Error("Sequence JSON: 'name' must be a string.");
  if (t.errorPolicy != null && t.errorPolicy !== Oe.ABORT && t.errorPolicy !== Oe.CONTINUE)
    throw new Error(`Sequence JSON: 'errorPolicy' must be "abort" or "continue".`);
  Mf(t.timeline, "timeline", 0);
}
c(Ec, "validateSequenceJSON");
function Mf(t, e, n = 0) {
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
        Mf(d, `${a}.parallel.branches[${u}]`, n + 1);
      }
      continue;
    }
    throw new Error(`Sequence JSON: ${a} is not a recognized segment (step array, delay, await, emit, or parallel).`);
  }
}
c(Mf, "validateSegmentsJSON");
function _f(t) {
  Ec(t), Nf(t.timeline, "timeline");
}
c(_f, "validateSequenceSemantics");
function Nf(t, e) {
  for (let n = 0; n < t.length; n++) {
    const i = t[n], r = `${e}[${n}]`;
    if (Array.isArray(i))
      for (let a = 0; a < i.length; a++) {
        const o = i[a];
        try {
          Yp(o.type, o.params ?? {});
        } catch (s) {
          throw new Error(`Sequence JSON: ${r}[${a}] failed semantic validation: ${s.message}`);
        }
      }
    else if (i.parallel)
      for (let a = 0; a < i.parallel.branches.length; a++)
        Nf(i.parallel.branches[a], `${r}.parallel.branches[${a}]`);
  }
}
c(Nf, "validateSegmentsSemantics");
function Cc(t, e = {}) {
  Ec(t), e.validateSemantics && _f(t);
  const n = new no();
  return t.name && n.name(t.name), t.errorPolicy && n.errorPolicy(t.errorPolicy), xf(t.timeline, n), n;
}
c(Cc, "compileSequence");
function xf(t, e) {
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
      const i = n.parallel, r = i.branches.map((a) => (o) => xf(a, o));
      e.parallel(r, {
        join: i.join ?? "all",
        overflow: i.overflow ?? "detach"
      });
    }
  }
}
c(xf, "compileSegments");
function dy(t) {
  Ec(t), _f(t);
}
c(dy, "validate$3");
async function fy(t, e = {}) {
  return Cc(t, { validateSemantics: !0 }).run({
    broadcast: !1,
    commit: e.commit,
    startEpochMS: e.startEpochMS,
    signal: e.signal
  }).finished;
}
c(fy, "execute$3");
function my() {
  Ht({ type: "sequence", execute: fy, validate: dy });
}
c(my, "registerSequenceTween");
function hy(t) {
  if (t.x == null && t.y == null && t.scale == null)
    throw new Error("camera-pan tween: at least one of 'x', 'y', or 'scale' is required.");
  if (t.x != null && typeof t.x != "number")
    throw new Error("camera-pan tween: 'x' must be a number.");
  if (t.y != null && typeof t.y != "number")
    throw new Error("camera-pan tween: 'y' must be a number.");
  if (t.scale != null && (typeof t.scale != "number" || t.scale <= 0))
    throw new Error("camera-pan tween: 'scale' must be a positive number.");
}
c(hy, "validate$2");
async function gy(t, e = {}) {
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
c(gy, "execute$2");
function py() {
  Ht({ type: "camera-pan", execute: gy, validate: hy });
}
c(py, "registerCameraPanTween");
function yy(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((i) => !i || typeof i != "string"))
    throw new Error("tile-tint tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (t.toColor == null || typeof t.toColor != "string")
    throw new Error("tile-tint tween: 'toColor' (CSS color string) is required.");
  if (!foundry.utils.Color.fromString(t.toColor).valid)
    throw new Error(`tile-tint tween: invalid target color "${t.toColor}".`);
  if (t.mode && !Zi().includes(t.mode))
    throw new Error(
      `tile-tint tween: unknown mode "${t.mode}". Available: ${Zi().join(", ")}`
    );
}
c(yy, "validate$1");
async function by(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { Color: i } = foundry.utils, { uuid: r, toColor: a, mode: o = "oklch" } = t, s = Array.isArray(r) ? r : [r];
  if (s.length === 0)
    return console.warn("tile-tint tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: l = 2e3,
    easing: u = "easeInOutCosine",
    commit: d = !0,
    startEpochMS: m = null,
    signal: f = null
  } = e, g = ot(u), p = wc(o), y = i.fromString(a);
  if (!y.valid) throw new Error(`tile-tint tween: invalid target color "${a}".`);
  async function b(w) {
    var H, q;
    if (f != null && f.aborted) return !1;
    const S = await fromUuid(w);
    if (!S) return !1;
    const I = S.object;
    if (!I) return !1;
    const A = ((q = (H = S._source) == null ? void 0 : H.texture) == null ? void 0 : q.tint) ?? "#ffffff", O = i.fromString(A);
    O.valid || console.warn(`tile-tint tween: source tint invalid on ${w}, using white.`);
    const x = O.valid ? O : i.fromString("#ffffff"), M = { t: 0 }, D = `tile-tint-tween:${w}`;
    n.terminateAnimation(D), f && f.addEventListener("abort", () => {
      n.terminateAnimation(D);
    }, { once: !0 });
    const F = typeof m == "number" ? Math.max(0, Math.min(l, Date.now() - m)) : 0, P = /* @__PURE__ */ c((j) => {
      const B = p(x, y, j);
      S.updateSource({ texture: { tint: B } }), I.refresh();
    }, "applyFrame");
    F > 0 && (M.t = F / l, P(M.t));
    const _ = await n.animate(
      [{ parent: M, attribute: "t", to: 1 }],
      {
        name: D,
        duration: l,
        easing: g,
        time: F,
        ontick: /* @__PURE__ */ c(() => P(M.t), "ontick")
      }
    );
    if (_ !== !1) {
      if (f != null && f.aborted) return !1;
      S.updateSource({ texture: { tint: y.toHTML() } }), I.refresh();
    }
    if (d && _ !== !1 && S.canUserModify(game.user, "update")) {
      if (f != null && f.aborted) return !1;
      S.updateSource({ texture: { tint: x.toHTML() } }), await S.update({ "texture.tint": y.toHTML() });
    }
    return _ !== !1;
  }
  return c(b, "animateOne"), (await Promise.all(s.map(b))).every(Boolean);
}
c(by, "execute$1");
function vy() {
  Ht({ type: "tile-tint", execute: by, validate: yy });
}
c(vy, "registerTileTintTween");
function wy(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("tile-scale tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (typeof t.toScale != "number" || t.toScale <= 0)
    throw new Error("tile-scale tween: 'toScale' must be a positive number.");
  for (const n of ["baseWidth", "baseHeight", "centerX", "centerY"])
    if (typeof t[n] != "number")
      throw new Error(`tile-scale tween: '${n}' (number) is required.`);
}
c(wy, "validate");
async function Ey(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, toScale: r, baseWidth: a, baseHeight: o, centerX: s, centerY: l } = t, u = Array.isArray(i) ? i : [i];
  if (u.length === 0) return !0;
  const {
    durationMS: d = 2e3,
    easing: m = "easeInOutCosine",
    commit: f = !0,
    startEpochMS: g = null,
    signal: p = null
  } = e, y = ot(m), b = a * r, v = o * r, w = s - b / 2, S = l - v / 2;
  async function I(O) {
    if (p != null && p.aborted) return !1;
    const x = await fromUuid(O);
    if (!x) return !1;
    const M = x.object;
    if (!M) return !1;
    const D = x._source.width, F = x._source.height, P = x._source.x, _ = x._source.y, H = `tile-scale-tween:${O}`;
    n.terminateAnimation(H), p && p.addEventListener("abort", () => {
      n.terminateAnimation(H);
    }, { once: !0 });
    const q = typeof g == "number" ? Math.max(0, Math.min(d, Date.now() - g)) : 0, j = /* @__PURE__ */ c((J) => {
      const ae = D + (b - D) * J, Q = F + (v - F) * J, ne = P + (w - P) * J, Zt = _ + (S - _) * J;
      x.updateSource({ width: ae, height: Q, x: ne, y: Zt }), M.refresh();
    }, "applyFrame"), B = { t: 0 };
    q > 0 && (B.t = q / d, j(B.t));
    const V = await n.animate(
      [{ parent: B, attribute: "t", to: 1 }],
      {
        name: H,
        duration: d,
        easing: y,
        time: q,
        ontick: /* @__PURE__ */ c(() => j(B.t), "ontick")
      }
    );
    if (V !== !1) {
      if (p != null && p.aborted) return !1;
      x.updateSource({ width: b, height: v, x: w, y: S }), M.refresh();
    }
    if (f && V !== !1 && x.canUserModify(game.user, "update")) {
      if (p != null && p.aborted) return !1;
      x.updateSource({ width: D, height: F, x: P, y: _ }), await x.update({ width: b, height: v, x: w, y: S });
    }
    return V !== !1;
  }
  return c(I, "animateOne"), (await Promise.all(u.map(I))).every(Boolean);
}
c(Ey, "execute");
function Cy() {
  Ht({ type: "tile-scale", execute: Ey, validate: wy });
}
c(Cy, "registerTileScaleTween");
async function Sy(t, e, n = {}) {
  if (!game.user.isGM)
    return ui.notifications.warn("Only the GM can dispatch tweens."), !1;
  const i = rr(t);
  if (!i)
    throw new Error(`Unknown tween type: "${t}". Registered types: ${kl().join(", ")}`);
  i.validate(e);
  const { durationMS: r = 2e3, easing: a = "easeInOutCosine", commit: o = !0 } = n, s = Date.now();
  return xa(Cf, {
    type: t,
    params: e,
    durationMS: r,
    easing: a,
    startEpochMS: s,
    commit: !1
  }), i.execute(e, { durationMS: r, easing: a, commit: o, startEpochMS: s });
}
c(Sy, "dispatchTween");
function Ty(t) {
  const { type: e, params: n, durationMS: i, easing: r, startEpochMS: a, commit: o } = t ?? {}, s = rr(e);
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
c(Ty, "handleTweenSocketMessage");
ty();
ry();
ay();
ly();
my();
py();
vy();
Cy();
Ht({ type: "token-prop", execute: ns, validate: ts });
Ht({ type: "drawing-prop", execute: ns, validate: ts });
Ht({ type: "sound-prop", execute: ns, validate: ts });
bc(Cf, Ty);
bc(Sf, Ly);
bc(Al, Iy);
function Ly(t) {
  const { data: e, startEpochMS: n } = t ?? {};
  if (!e) {
    console.warn(`[${T}] Received empty tween-sequence socket message.`);
    return;
  }
  try {
    Cc(e, { validateSemantics: !0 }).run({ commit: !1, startEpochMS: n, broadcast: !1 });
  } catch (i) {
    console.error(`[${T}] Failed to run received tween sequence:`, i);
  }
}
c(Ly, "handleSequenceSocketMessage");
function Iy(t) {
  const { name: e } = t ?? {};
  e && If(e);
}
c(Iy, "handleSequenceCancelMessage");
function Oy() {
  Hooks.once("ready", () => {
    Wp();
    const t = game.modules.get(T);
    t.api || (t.api = {}), t.api.tween = {
      dispatch: Sy,
      types: kl,
      Timeline: no,
      ErrorPolicy: Oe,
      compileSequence: Cc,
      cancelTimeline: If,
      getTimeline: uy
    }, console.log(`[${T}] Tween API registered. Types: ${kl().join(", ")}`);
  });
}
c(Oy, "registerTweenHooks");
Oy();
const Ay = ["tag", "tag-all", "id", "tags-any", "tags-all"], ky = /* @__PURE__ */ new Set(["tags-any", "tags-all"]);
function Sc(t) {
  if (!t || typeof t != "string")
    return { type: "unknown", value: t ?? "" };
  if (t.startsWith("$"))
    return { type: "special", value: t };
  for (const e of Ay)
    if (t.startsWith(`${e}:`)) {
      const n = t.slice(e.length + 1), i = ky.has(e) ? n.split(",").map((r) => r.trim()) : n;
      return { type: e, value: i };
    }
  return t.includes(".") ? { type: "uuid", value: t } : { type: "unknown", value: t };
}
c(Sc, "parseSelector");
function My(t) {
  if (!t) return "";
  const { type: e, value: n } = t;
  if (e === "special" || e === "uuid" || e === "unknown")
    return Array.isArray(n) ? n.join(",") : n ?? "";
  const i = Array.isArray(n) ? n.join(",") : n ?? "";
  return `${e}:${i}`;
}
c(My, "buildSelector");
function $f(t, e = "first") {
  return t != null && t.length ? t.length === 1 ? e === "first-all" || e === "all" ? `tag-all:${t[0]}` : `tag:${t[0]}` : e === "any" ? `tags-any:${t.join(",")}` : e === "all" ? `tags-all:${t.join(",")}` : e === "first-all" ? `tags-all:${t.join(",")}` : `tags-any:${t.join(",")}` : "";
}
c($f, "buildTagSelector");
function rs(t) {
  if (!t) return null;
  if (t.documentName || t._source !== void 0) {
    const e = t.object;
    return e ? { placeable: e, doc: t } : null;
  }
  return t.document ? { placeable: t, doc: t.document } : null;
}
c(rs, "normalizePlaceable");
function Ff() {
  var t;
  return window.Tagger ?? ((t = game.modules.get("tagger")) == null ? void 0 : t.api) ?? null;
}
c(Ff, "getTaggerAPI");
function as(t, e) {
  if (!t) return null;
  const n = e ?? canvas.scene;
  if (!n) return null;
  const i = Sc(t);
  switch (i.type) {
    case "special":
      return _y(i.value);
    case "tag":
      return gu(i.value, n);
    case "tag-all":
      return gu(i.value, n);
    case "id":
      return Ny(i.value, n);
    case "tags-any":
      return pu(i.value, n, !0);
    case "tags-all":
      return pu(i.value, n, !1);
    case "uuid":
      return xy(i.value);
    default:
      return null;
  }
}
c(as, "resolveSelector");
function _y(t) {
  var e;
  if (t === "$particles") {
    if (!((e = game.modules.get("fxmaster")) != null && e.active))
      return console.warn(`[${T}] Picker: FXMaster not active, cannot resolve "$particles".`), null;
    const n = canvas.particleeffects;
    return n ? { kind: "particles", documents: [], placeables: [], target: n } : null;
  }
  return null;
}
c(_y, "resolveSpecial");
function gu(t, e, n) {
  const i = Ff();
  if (!i)
    return console.warn(`[${T}] Picker: Tagger not available, cannot resolve tag "${t}".`), null;
  const r = i.getByTag(t, { sceneId: e.id });
  if (!(r != null && r.length)) return null;
  const a = [];
  for (const o of r) {
    const s = rs(o);
    s && a.push(s);
  }
  return a.length === 0 ? null : {
    kind: a.length === 1 ? "placeable" : "multi-placeable",
    documents: a.map((o) => o.doc),
    placeables: a
  };
}
c(gu, "resolveTag");
function Ny(t, e) {
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
      const a = rs(r);
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
c(Ny, "resolveById");
function pu(t, e, n) {
  const i = Ff();
  if (!i)
    return console.warn(`[${T}] Picker: Tagger not available, cannot resolve multi-tag.`), null;
  const r = i.getByTag(t, {
    sceneId: e.id,
    matchAny: n
  });
  if (!(r != null && r.length)) return null;
  const a = [];
  for (const o of r) {
    const s = rs(o);
    s && a.push(s);
  }
  return a.length === 0 ? null : {
    kind: a.length === 1 ? "placeable" : "multi-placeable",
    documents: a.map((o) => o.doc),
    placeables: a
  };
}
c(pu, "resolveMultiTag");
function xy(t) {
  const e = fromUuidSync(t);
  if (!e) return null;
  const n = rs(e);
  return n ? {
    kind: "placeable",
    documents: [n.doc],
    placeables: [n]
  } : null;
}
c(xy, "resolveUUID");
function $y(t) {
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
c($y, "adaptResolved");
function io(t) {
  var r;
  const e = /* @__PURE__ */ new Set();
  if (t.segments) {
    if (t.setup) for (const a of Object.keys(t.setup)) e.add(a);
    if (t.landing) for (const a of Object.keys(t.landing)) e.add(a);
    for (const a of Object.values(t.segments)) {
      if (a.setup) for (const o of Object.keys(a.setup)) e.add(o);
      if (a.landing) for (const o of Object.keys(a.landing)) e.add(o);
      a.timeline && Hl(a.timeline, e), (r = a.gate) != null && r.target && e.add(a.gate.target);
    }
  } else {
    if (t.setup) for (const a of Object.keys(t.setup)) e.add(a);
    if (t.landing) for (const a of Object.keys(t.landing)) e.add(a);
    t.timeline && Hl(t.timeline, e);
  }
  const n = /* @__PURE__ */ new Map(), i = [];
  for (const a of e) {
    const o = as(a), s = $y(o);
    s ? n.set(a, s) : i.push(a);
  }
  return i.length && console.warn(`[${T}] Cinematic: ${i.length} unresolved target(s): ${i.join(", ")}`), { targets: n, unresolved: i };
}
c(io, "resolveAllTargets");
function Fy(t, e) {
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
c(Fy, "captureSnapshot");
function Dy(t) {
  const e = {};
  function n(i) {
    if (i)
      for (const [r, a] of Object.entries(i))
        e[r] || (e[r] = {}), Object.assign(e[r], a);
  }
  if (c(n, "mergeMap"), t.segments) {
    n(t.setup), n(t.landing);
    for (const i of Object.values(t.segments))
      n(i.setup), n(i.landing), i.timeline && Rl(i.timeline, e, n);
  } else
    n(t.setup), n(t.landing), t.timeline && Rl(t.timeline, e, n);
  return e;
}
c(Dy, "gatherAllStateMaps");
function Rl(t, e, n) {
  var i;
  for (const r of t)
    if (!(r.delay != null || r.await != null || r.emit != null) && !(r.transitionTo != null || r.sound != null || r.stopSound != null)) {
      if ((i = r.parallel) != null && i.branches) {
        for (const a of r.parallel.branches)
          Rl(a, e, n);
        continue;
      }
      if (n(r.before), n(r.after), r.tweens)
        for (const a of r.tweens)
          a.target && a.attribute && (e[a.target] || (e[a.target] = {}), e[a.target][a.attribute] = "__snapshot__");
    }
}
c(Rl, "gatherFromEntries");
function Hl(t, e) {
  for (const n of t)
    if (n.delay == null && n.await == null && n.emit == null && n.transitionTo == null && n.sound == null && n.stopSound == null) {
      if (n.parallel) {
        const i = n.parallel;
        if (i.branches)
          for (const r of i.branches)
            Hl(r, e);
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
c(Hl, "collectSelectorsFromEntries");
const yu = {
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
}, Py = /* @__PURE__ */ new Set([
  "alpha",
  "visible",
  "x",
  "y",
  "scale",
  "rotation"
]);
function Ts(t, e, n) {
  const i = {};
  for (const [r, a] of Object.entries(t))
    e.has(r) ? i[r] = a : console.warn(`[${T}] Cinematic: blocked property "${r}" on ${n}.`);
  return i;
}
c(Ts, "filterOverrides");
function Ae(t, e) {
  var i, r;
  if (!t) return;
  const n = [];
  for (const [a, o] of Object.entries(t)) {
    const s = e.get(a);
    if (s)
      if (s.kind === "particles") {
        if (s.target.destroyed) continue;
        const l = Ts(o, Py, "$particles");
        for (const [u, d] of Object.entries(l))
          s.target[u] = d;
      } else if (s.kind === "multi-placeable")
        for (const { placeable: l, doc: u } of s.placeables) {
          if (!(u != null && u.parent) || !(l != null && l.scene)) continue;
          const d = u.documentName, m = yu[d];
          if (!m) {
            console.warn(`[${T}] Cinematic: no allowlist for document type "${d}" on "${a}", skipping.`);
            continue;
          }
          const f = Ts(o, m, `${d} "${a}"`);
          u.updateSource(f), n.push(l);
        }
      else {
        if (!((i = s.doc) != null && i.parent) || !((r = s.placeable) != null && r.scene)) continue;
        const l = s.doc.documentName, u = yu[l];
        if (!u) {
          console.warn(`[${T}] Cinematic: no allowlist for document type "${l}" on "${a}", skipping.`);
          continue;
        }
        const d = Ts(o, u, `${l} "${a}"`);
        s.doc.updateSource(d), n.push(s.placeable);
      }
  }
  for (const a of n)
    a.refresh();
}
c(Ae, "applyState");
function Hi(t, e) {
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
c(Hi, "refreshPerceptionIfNeeded");
const Ry = {
  "tile-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "light-color": /* @__PURE__ */ new Set(["uuid", "toColor", "toAlpha", "mode"]),
  "light-state": /* @__PURE__ */ new Set(["uuid", "enabled"]),
  "particles-prop": /* @__PURE__ */ new Set(["attribute", "value"]),
  "camera-pan": /* @__PURE__ */ new Set(["x", "y", "scale"]),
  "token-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "drawing-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "sound-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"])
}, Hy = /* @__PURE__ */ new Set(["easing"]), qy = /* @__PURE__ */ new Set(["type", "target"]);
function Df(t, e) {
  const { type: n, target: i, ...r } = t;
  if (!n)
    return console.warn(`[${T}] Cinematic: tween entry missing 'type', skipping.`), null;
  const a = {}, o = {}, s = Ry[n];
  if (i === "$particles")
    a.target = "$particles";
  else if (i) {
    const l = e.get(i);
    if (!l) return null;
    l.kind === "multi-placeable" ? a.uuid = l.placeables.map((u) => u.doc.uuid) : a.uuid = l.doc.uuid;
  }
  for (const [l, u] of Object.entries(r))
    qy.has(l) || (Hy.has(l) ? o[l] = u : (s != null && s.has(l), a[l] = u));
  return { type: n, params: a, opts: o };
}
c(Df, "compileTween");
const Fr = /* @__PURE__ */ new Map();
let jy = 0;
async function By(t) {
  var u, d, m, f, g;
  const { id: e, src: n, volume: i = 0.8, loop: r = !1, fadeIn: a } = t;
  if (!n) {
    console.warn(`[${T}] Cinematic sound: missing 'src', skipping.`);
    return;
  }
  const o = e || `__auto_${++jy}`, s = {
    src: n,
    autoplay: !0,
    loop: r,
    volume: i
  };
  let l = null;
  try {
    typeof ((d = (u = foundry == null ? void 0 : foundry.audio) == null ? void 0 : u.AudioHelper) == null ? void 0 : d.play) == "function" ? l = await foundry.audio.AudioHelper.play(s, !1) : typeof ((f = (m = game == null ? void 0 : game.audio) == null ? void 0 : m.constructor) == null ? void 0 : f.play) == "function" ? l = await game.audio.constructor.play(s, !1) : typeof ((g = game == null ? void 0 : game.audio) == null ? void 0 : g.play) == "function" && (l = await game.audio.play(s, !1));
  } catch (p) {
    console.error(`[${T}] Cinematic sound: failed to play "${n}":`, p);
    return;
  }
  if (!l) {
    console.warn(`[${T}] Cinematic sound: audio helper unavailable for "${n}".`);
    return;
  }
  a && a > 0 && l.fade && l.fade(i, { duration: a, from: 0 }), Fr.set(o, { sound: l, config: t }), console.log(`[${T}] Cinematic sound: playing "${n}" as "${o}" (loop=${r}, vol=${i})`);
}
c(By, "playLocalSound");
function Ls(t) {
  var i, r;
  const e = Fr.get(t);
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
  Fr.delete(t);
}
c(Ls, "stopCinematicSound");
function bu() {
  var t, e;
  for (const [n, i] of Fr)
    try {
      (e = (t = i.sound).stop) == null || e.call(t);
    } catch (r) {
      console.warn(`[${T}] Cinematic sound: error stopping "${n}" during cleanup:`, r);
    }
  Fr.clear();
}
c(bu, "stopAllCinematicSounds");
function Uy(t, e, n, i = {}) {
  const { skipToStep: r, onStepComplete: a, timelineName: o } = i, s = new n().name(o ?? `cinematic-${canvas.scene.id}`);
  return s.beforeAll(() => {
    var l;
    try {
      Ae(t.setup, e), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    } catch (u) {
      throw console.error(`[${T}] Cinematic: error in beforeAll (setup state) on scene ${(l = canvas.scene) == null ? void 0 : l.id}:`, u), u;
    }
  }), Rf(t.timeline, s, e, { skipToStep: r, onStepComplete: a }), { tl: s };
}
c(Uy, "buildTimeline");
function Pf(t, e) {
  var n;
  if (t)
    for (const i of t)
      for (const r of i) {
        if (r.before)
          try {
            Ae(r.before, e), Hi(r.before, e);
          } catch (a) {
            console.warn(`[${T}] Cinematic: error in skipped parallel before:`, a);
          }
        if (r.after)
          try {
            Ae(r.after, e), Hi(r.after, e);
          } catch (a) {
            console.warn(`[${T}] Cinematic: error in skipped parallel after:`, a);
          }
        (n = r.parallel) != null && n.branches && Pf(r.parallel.branches, e);
      }
}
c(Pf, "applyParallelStatesForSkip");
function Rf(t, e, n, i = {}) {
  const { skipToStep: r, onStepComplete: a } = i;
  let o = -1;
  for (const s of t) {
    if (s.sound != null) {
      if (r != null && o < r) continue;
      const m = s.sound, { duration: f, loop: g, fireAndForget: p } = m, y = e.step();
      if (y.before(() => {
        By(m);
      }), f && f > 0)
        if (p) {
          if (g && m.id) {
            const b = m.id, v = f;
            y.before(() => {
              setTimeout(() => Ls(b), v);
            });
          }
        } else
          e.delay(f), g && e.step().before(() => {
            Ls(m.id);
          });
      continue;
    }
    if (s.stopSound != null) {
      if (r != null && o < r) continue;
      const m = s.stopSound;
      e.step().before(() => {
        Ls(m);
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
        Pf(s.parallel.branches, n);
        continue;
      }
      const m = s.parallel, f = m.branches.map((g) => (p) => Rf(g, p, n));
      e.parallel(f, {
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
          Ae(s.before, n), Hi(s.before, n);
        } catch (m) {
          console.warn(`[${T}] Cinematic: error applying skipped step.before:`, m);
        }
      if (s.after)
        try {
          Ae(s.after, n), Hi(s.after, n);
        } catch (m) {
          console.warn(`[${T}] Cinematic: error applying skipped step.after:`, m);
        }
      continue;
    }
    const l = o, u = e.step();
    s.before && u.before(() => {
      var m;
      try {
        Ae(s.before, n), Hi(s.before, n);
      } catch (f) {
        throw console.error(`[${T}] Cinematic: error in step.before callback on scene ${(m = canvas.scene) == null ? void 0 : m.id}:`, f), f;
      }
    });
    const d = s.duration ?? 500;
    for (const m of s.tweens) {
      const f = Df(m, n);
      f && u.add(f.type, f.params, { ...f.opts, durationMS: d });
    }
    u.after(() => {
      var m;
      try {
        s.after && (Ae(s.after, n), Hi(s.after, n)), a == null || a(l);
      } catch (f) {
        throw console.error(`[${T}] Cinematic: error in step.after callback on scene ${(m = canvas.scene) == null ? void 0 : m.id}:`, f), f;
      }
    });
  }
}
c(Rf, "compileCinematicEntries");
function qi(t, e, n) {
  if (t != null) {
    if (typeof t != "object" || Array.isArray(t)) {
      n.push({ path: e, level: "error", message: `Expected object, got ${Array.isArray(t) ? "array" : typeof t}` });
      return;
    }
    for (const [i, r] of Object.entries(t))
      (typeof r != "object" || r === null || Array.isArray(r)) && n.push({ path: `${e}["${i}"]`, level: "error", message: `Expected property overrides object, got ${Array.isArray(r) ? "array" : typeof r}` });
  }
}
c(qi, "validateStateMap");
function ql(t, e, n, i) {
  var r;
  for (let a = 0; a < t.length; a++) {
    const o = t[a], s = `${e}[${a}]`;
    if (!(o.delay != null || o.await != null || o.emit != null) && !(o.transitionTo != null || o.sound != null || o.stopSound != null)) {
      if ((r = o.parallel) != null && r.branches) {
        for (let l = 0; l < o.parallel.branches.length; l++)
          ql(o.parallel.branches[l], `${s}.parallel.branches[${l}]`, n, i);
        continue;
      }
      if (qi(o.before, `${s}.before`, i), qi(o.after, `${s}.after`, i), o.tweens)
        for (let l = 0; l < o.tweens.length; l++) {
          const u = o.tweens[l], d = `${s}.tweens[${l}]`;
          if (!u.type) {
            i.push({ path: d, level: "error", message: "Missing 'type' field" });
            continue;
          }
          const m = rr(u.type);
          if (!m) {
            i.push({ path: d, level: "error", message: `Unknown tween type: "${u.type}"` });
            continue;
          }
          if (n)
            try {
              const f = Df(u, n);
              f ? m.validate(f.params) : u.target && i.push({ path: d, level: "warn", message: `Target "${u.target}" could not be resolved for compilation` });
            } catch (f) {
              i.push({ path: d, level: "error", message: f.message });
            }
          n && u.target && !n.has(u.target) && i.push({ path: `${d}.target`, level: "warn", message: `Target "${u.target}" is not resolved` });
        }
    }
  }
}
c(ql, "validateEntries");
function Vy(t, e = null) {
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
      qi(s.setup, `${l}.setup`, n), qi(s.landing, `${l}.landing`, n), s.timeline && Array.isArray(s.timeline) && ql(s.timeline, `${l}.timeline`, e, n), s.next && typeof s.next == "string" && !t.segments[s.next] && n.push({ path: `${l}.next`, level: "error", message: `Next segment "${s.next}" not found` });
    }
  } else
    qi(t.setup, "setup", n), qi(t.landing, "landing", n), t.timeline && Array.isArray(t.timeline) && ql(t.timeline, "timeline", e, n);
  return n;
}
c(Vy, "validateCinematicDeep");
const Is = 5, vu = /* @__PURE__ */ new Set(["click", "tile-click", "keypress"]);
var le, ge, Ve, _e, bt, br, jl, Hf, Y, Fe, Fa, Ie, St;
const se = class se {
  constructor(e = null, { loadedHash: n = null, cinematicName: i = "default", segmentName: r = null } = {}) {
    k(this, Y);
    k(this, le);
    k(this, ge);
    k(this, Ve);
    k(this, _e);
    var o;
    L(this, le, e ?? se.empty()), L(this, ge, i), L(this, _e, n);
    const a = (o = h(this, le).cinematics) == null ? void 0 : o[h(this, ge)];
    L(this, Ve, r ?? (a == null ? void 0 : a.entry) ?? "main");
  }
  static empty() {
    return {
      version: Is,
      cinematics: {
        default: se.emptyCinematic()
      }
    };
  }
  static emptyCinematic() {
    return {
      trigger: "canvasReady",
      tracking: !0,
      entry: "main",
      segments: {
        main: se.emptySegment()
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
    const { trigger: n, tracking: i, synchronized: r, setup: a, landing: o, timeline: s = [] } = e;
    if (!s.some(
      (v) => {
        var w;
        return v.await != null && vu.has(((w = v.await) == null ? void 0 : w.event) ?? "click");
      }
    )) {
      const v = s.filter((I) => I.transitionTo == null), w = s.find((I) => I.transitionTo != null), S = { timeline: v };
      if (a && Object.keys(a).length && (S.setup = a), o && Object.keys(o).length && (S.landing = o), w) {
        const I = w.transitionTo;
        I.scene && I.cinematic ? S.next = { segment: I.cinematic, scene: I.scene } : I.cinematic;
      }
      return {
        trigger: n,
        tracking: i,
        ...r ? { synchronized: r } : {},
        entry: "main",
        segments: { main: S }
      };
    }
    const u = {};
    let d = [], m = 1, f = null;
    const g = [];
    function p() {
      const v = `segment-${m++}`, w = { timeline: [...d] };
      return f && (w.gate = f), u[v] = w, g.push(v), d = [], f = null, v;
    }
    c(p, "flushSegment");
    for (const v of s)
      if (v.transitionTo == null) {
        if (v.await != null && vu.has(((b = v.await) == null ? void 0 : b.event) ?? "click")) {
          p(), f = { ...v.await }, delete f.event, f = { event: v.await.event ?? "click", ...f };
          continue;
        }
        d.push(v);
      }
    (d.length > 0 || f) && p();
    for (let v = 0; v < g.length - 1; v++)
      u[g[v]].next = g[v + 1];
    g.length > 0 && (a && Object.keys(a).length && (u[g[0]].setup = a), o && Object.keys(o).length && (u[g[g.length - 1]].landing = o));
    const y = s.find((v) => v.transitionTo != null);
    if (y && g.length > 0) {
      const v = y.transitionTo, w = u[g[g.length - 1]];
      v.scene && v.cinematic && (w.next = { segment: v.cinematic, scene: v.scene });
    }
    return {
      trigger: n,
      tracking: i,
      ...r ? { synchronized: r } : {},
      entry: g[0] ?? "main",
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
      (i = a.timeline) != null && i.length && (a.timeline = C(r = se, bt, jl).call(r, a.timeline));
    return n;
  }
  static fromScene(e, n = "default") {
    var o;
    const i = e == null ? void 0 : e.getFlag(T, "cinematic");
    let r = i ? foundry.utils.deepClone(i) : null;
    const a = i ? C(o = se, bt, Hf).call(o, i) : null;
    if (r && (r.version ?? 1) < 3) {
      const { version: s, ...l } = r;
      r = { version: 3, cinematics: { default: l } };
    }
    if (r && r.version === 3) {
      for (const [s, l] of Object.entries(r.cinematics ?? {}))
        r.cinematics[s] = se.migrateV3toV4(l);
      r.version = 4;
    }
    if (r && r.version === 4) {
      for (const [s, l] of Object.entries(r.cinematics ?? {}))
        r.cinematics[s] = se.migrateV4toV5(l);
      r.version = Is;
    }
    return new se(r, { loadedHash: a, cinematicName: n });
  }
  /**
   * Check if the scene's cinematic flag has been modified since this state was loaded.
   * @param {object} scene  The Foundry scene document
   * @returns {boolean} true if scene data differs from what was loaded
   */
  isStale(e) {
    if (!h(this, _e)) return !1;
    const n = e == null ? void 0 : e.getFlag(T, "cinematic");
    return n ? !foundry.utils.objectsEqual(n, h(this, _e)) : !1;
  }
  // ── Read ──────────────────────────────────────────────────────────────
  get data() {
    return h(this, le);
  }
  get trigger() {
    return h(this, Y, Fe).trigger;
  }
  get tracking() {
    return h(this, Y, Fe).tracking;
  }
  get synchronized() {
    return h(this, Y, Fe).synchronized ?? !1;
  }
  get activeCinematicName() {
    return h(this, ge);
  }
  // ── Segment accessors ────────────────────────────────────────────────
  get segments() {
    return h(this, Y, Fe).segments;
  }
  get entry() {
    return h(this, Y, Fe).entry;
  }
  get activeSegmentName() {
    return h(this, Ve);
  }
  get activeSegment() {
    var e;
    return ((e = h(this, Y, Fe).segments) == null ? void 0 : e[h(this, Ve)]) ?? null;
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
    return Object.keys(h(this, le).cinematics);
  }
  switchCinematic(e) {
    if (!h(this, le).cinematics[e]) return this;
    const n = h(this, le).cinematics[e];
    return new se(foundry.utils.deepClone(h(this, le)), {
      loadedHash: h(this, _e),
      cinematicName: e,
      segmentName: n.entry ?? "main"
    });
  }
  addCinematic(e) {
    if (!e || h(this, le).cinematics[e]) return this;
    const n = foundry.utils.deepClone(h(this, le));
    return n.cinematics[e] = se.emptyCinematic(), new se(n, {
      loadedHash: h(this, _e),
      cinematicName: e,
      segmentName: "main"
    });
  }
  removeCinematic(e) {
    if (Object.keys(h(this, le).cinematics).length <= 1) return this;
    if (!h(this, le).cinematics[e]) return this;
    const i = foundry.utils.deepClone(h(this, le));
    delete i.cinematics[e];
    const r = h(this, ge) === e ? Object.keys(i.cinematics)[0] : h(this, ge), a = i.cinematics[r];
    return new se(i, {
      loadedHash: h(this, _e),
      cinematicName: r,
      segmentName: (a == null ? void 0 : a.entry) ?? "main"
    });
  }
  renameCinematic(e, n) {
    if (!e || !n || e === n) return this;
    if (!h(this, le).cinematics[e]) return this;
    if (h(this, le).cinematics[n]) return this;
    const i = foundry.utils.deepClone(h(this, le)), r = {};
    for (const [o, s] of Object.entries(i.cinematics))
      r[o === e ? n : o] = s;
    i.cinematics = r;
    const a = h(this, ge) === e ? n : h(this, ge);
    return new se(i, {
      loadedHash: h(this, _e),
      cinematicName: a,
      segmentName: h(this, Ve)
    });
  }
  // ── Cinematic-level mutations ─────────────────────────────────────────
  setTrigger(e) {
    return C(this, Y, Fa).call(this, { trigger: e });
  }
  setTracking(e) {
    return C(this, Y, Fa).call(this, { tracking: e });
  }
  setSynchronized(e) {
    return C(this, Y, Fa).call(this, { synchronized: e });
  }
  // ── Segment-level mutations (setup/landing now live on segments) ──────
  setSetup(e) {
    return C(this, Y, Ie).call(this, { setup: e });
  }
  setLanding(e) {
    return C(this, Y, Ie).call(this, { landing: e });
  }
  // ── Segment management methods ────────────────────────────────────────
  switchSegment(e) {
    var n;
    return (n = h(this, Y, Fe).segments) != null && n[e] ? new se(foundry.utils.deepClone(h(this, le)), {
      loadedHash: h(this, _e),
      cinematicName: h(this, ge),
      segmentName: e
    }) : this;
  }
  addSegment(e, n = null) {
    var a;
    if (!e || (a = h(this, Y, Fe).segments) != null && a[e]) return this;
    const i = foundry.utils.deepClone(h(this, le)), r = i.cinematics[h(this, ge)];
    if (r.segments[e] = se.emptySegment(), n && r.segments[n]) {
      const o = r.segments[n].next;
      r.segments[n].next = e, o && (r.segments[e].next = o);
    }
    return new se(i, {
      loadedHash: h(this, _e),
      cinematicName: h(this, ge),
      segmentName: e
    });
  }
  removeSegment(e) {
    var s, l;
    if (Object.keys(h(this, Y, Fe).segments ?? {}).length <= 1) return this;
    if (!((s = h(this, Y, Fe).segments) != null && s[e])) return this;
    const i = foundry.utils.deepClone(h(this, le)), r = i.cinematics[h(this, ge)], a = r.segments[e].next;
    for (const [, u] of Object.entries(r.segments))
      (u.next === e || typeof u.next == "object" && ((l = u.next) == null ? void 0 : l.segment) === e) && (u.next = a ?? void 0, u.next || delete u.next);
    delete r.segments[e], r.entry === e && (r.entry = Object.keys(r.segments)[0]);
    const o = h(this, Ve) === e ? r.entry : h(this, Ve);
    return new se(i, {
      loadedHash: h(this, _e),
      cinematicName: h(this, ge),
      segmentName: o
    });
  }
  renameSegment(e, n) {
    var s, l, u;
    if (!e || !n || e === n) return this;
    if (!((s = h(this, Y, Fe).segments) != null && s[e])) return this;
    if ((l = h(this, Y, Fe).segments) != null && l[n]) return this;
    const i = foundry.utils.deepClone(h(this, le)), r = i.cinematics[h(this, ge)], a = {};
    for (const [d, m] of Object.entries(r.segments))
      a[d === e ? n : d] = m;
    r.segments = a;
    for (const [, d] of Object.entries(r.segments))
      d.next === e ? d.next = n : typeof d.next == "object" && ((u = d.next) == null ? void 0 : u.segment) === e && (d.next.segment = n);
    r.entry === e && (r.entry = n);
    const o = h(this, Ve) === e ? n : h(this, Ve);
    return new se(i, {
      loadedHash: h(this, _e),
      cinematicName: h(this, ge),
      segmentName: o
    });
  }
  setSegmentGate(e) {
    return C(this, Y, Ie).call(this, { gate: e ?? void 0 });
  }
  setSegmentNext(e) {
    return C(this, Y, Ie).call(this, { next: e ?? void 0 });
  }
  setSegmentSetup(e) {
    return C(this, Y, Ie).call(this, { setup: e });
  }
  setSegmentLanding(e) {
    return C(this, Y, Ie).call(this, { landing: e });
  }
  listSegmentNames() {
    return Object.keys(h(this, Y, Fe).segments ?? {});
  }
  // ── Timeline entry mutations (scoped to active segment) ──────────────
  addStep(e = -1) {
    const n = [...this.activeSegment.timeline], i = { duration: 1e3, tweens: [] };
    return e < 0 || e >= n.length ? n.push(i) : n.splice(e, 0, i), C(this, Y, Ie).call(this, { timeline: n });
  }
  addDelay(e = -1, n = 1e3) {
    const i = [...this.activeSegment.timeline], r = { delay: n };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), C(this, Y, Ie).call(this, { timeline: i });
  }
  addAwait(e = -1, n = null) {
    return console.warn(`[${T}] CinematicState.addAwait() is deprecated in v4. Use segment gates instead.`), this;
  }
  addEmit(e = -1, n = "") {
    const i = [...this.activeSegment.timeline], r = { emit: n };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), C(this, Y, Ie).call(this, { timeline: i });
  }
  addParallel(e = -1) {
    const n = [...this.activeSegment.timeline], i = { parallel: { branches: [[], []], join: "all", overflow: "detach" } };
    return e < 0 || e >= n.length ? n.push(i) : n.splice(e, 0, i), C(this, Y, Ie).call(this, { timeline: n });
  }
  addTransitionTo(e = -1, n = null) {
    return console.warn(`[${T}] CinematicState.addTransitionTo() is deprecated in v4. Use segment next edges instead.`), this;
  }
  addSound(e = -1, n = null) {
    const i = [...this.activeSegment.timeline], r = { sound: n ?? { src: "", volume: 0.8, loop: !1, duration: 0, fireAndForget: !1 } };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), C(this, Y, Ie).call(this, { timeline: i });
  }
  addStopSound(e = -1, n = "") {
    const i = [...this.activeSegment.timeline], r = { stopSound: n };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), C(this, Y, Ie).call(this, { timeline: i });
  }
  moveEntry(e, n) {
    if (e === n) return this;
    const i = [...this.activeSegment.timeline];
    if (e < 0 || e >= i.length) return this;
    if (n < 0 || n >= i.length) return this;
    const [r] = i.splice(e, 1);
    return i.splice(n, 0, r), C(this, Y, Ie).call(this, { timeline: i });
  }
  removeEntry(e) {
    const n = [...this.activeSegment.timeline];
    return e < 0 || e >= n.length ? this : (n.splice(e, 1), C(this, Y, Ie).call(this, { timeline: n }));
  }
  updateEntry(e, n) {
    const i = this.activeSegment.timeline.map((r, a) => a !== e ? r : { ...foundry.utils.deepClone(r), ...n });
    return C(this, Y, Ie).call(this, { timeline: i });
  }
  // ── Tween mutations ──────────────────────────────────────────────────
  addTween(e, n = null) {
    const i = { type: "tile-prop", target: "", attribute: "alpha", value: 1 };
    return C(this, Y, St).call(this, e, (r) => {
      const a = [...r.tweens ?? [], n ?? i];
      return { ...r, tweens: a };
    });
  }
  updateTween(e, n, i) {
    return C(this, Y, St).call(this, e, (r) => {
      const a = (r.tweens ?? []).map((o, s) => s !== n ? o : { ...o, ...i });
      return { ...r, tweens: a };
    });
  }
  removeTween(e, n) {
    return C(this, Y, St).call(this, e, (i) => {
      const r = (i.tweens ?? []).filter((a, o) => o !== n);
      return { ...i, tweens: r };
    });
  }
  updateStepDuration(e, n) {
    return C(this, Y, St).call(this, e, (i) => ({ ...i, duration: Math.max(0, n) }));
  }
  // ── Parallel branch mutations ────────────────────────────────────────
  addBranch(e) {
    return C(this, Y, St).call(this, e, (n) => {
      if (!n.parallel) return n;
      const i = [...n.parallel.branches, []];
      return { ...n, parallel: { ...n.parallel, branches: i } };
    });
  }
  removeBranch(e, n) {
    return C(this, Y, St).call(this, e, (i) => {
      if (!i.parallel) return i;
      const r = i.parallel.branches.filter((a, o) => o !== n);
      return r.length < 1 ? i : { ...i, parallel: { ...i.parallel, branches: r } };
    });
  }
  addBranchEntry(e, n, i = null) {
    const r = { duration: 1e3, tweens: [] };
    return C(this, Y, St).call(this, e, (a) => {
      if (!a.parallel) return a;
      const o = a.parallel.branches.map((s, l) => l !== n ? s : [...s, i ?? r]);
      return { ...a, parallel: { ...a.parallel, branches: o } };
    });
  }
  removeBranchEntry(e, n, i) {
    return C(this, Y, St).call(this, e, (r) => {
      if (!r.parallel) return r;
      const a = r.parallel.branches.map((o, s) => s !== n ? o : o.filter((l, u) => u !== i));
      return { ...r, parallel: { ...r.parallel, branches: a } };
    });
  }
  updateBranchEntry(e, n, i, r) {
    return C(this, Y, St).call(this, e, (a) => {
      if (!a.parallel) return a;
      const o = a.parallel.branches.map((s, l) => l !== n ? s : s.map((u, d) => d !== i ? u : { ...foundry.utils.deepClone(u), ...r }));
      return { ...a, parallel: { ...a.parallel, branches: o } };
    });
  }
  moveBranchEntry(e, n, i, r) {
    return i === r ? this : C(this, Y, St).call(this, e, (a) => {
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
    const n = { ...foundry.utils.deepClone(h(this, le)), version: Is };
    await e.setFlag(T, "cinematic", n);
  }
  /** Returns the active cinematic's data (for validation/export). */
  toJSON() {
    return foundry.utils.deepClone(h(this, Y, Fe));
  }
  /** Returns the entire v4 flag structure. */
  toFullJSON() {
    return foundry.utils.deepClone(h(this, le));
  }
};
le = new WeakMap(), ge = new WeakMap(), Ve = new WeakMap(), _e = new WeakMap(), bt = new WeakSet(), br = /* @__PURE__ */ c(function(e) {
  const { duration: n, detach: i, ...r } = e;
  return r;
}, "#stripTween"), jl = /* @__PURE__ */ c(function(e) {
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
          return C(d = se, bt, jl).call(d, u);
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
        tweens: u.map(C(se, bt, br))
      });
    } else if (o.length === 0) {
      const l = Math.max(500, ...s.map((m) => m.duration ?? 0)), { tweens: u, ...d } = a;
      n.push({
        ...d,
        duration: l,
        tweens: s.map(C(se, bt, br))
      });
    } else {
      const l = Math.max(500, ...o.map((f) => f.duration ?? 0)), u = Math.max(500, ...s.map((f) => f.duration ?? 0)), { tweens: d, ...m } = a;
      n.push({
        parallel: {
          branches: [
            [{ ...m, duration: l, tweens: o.map(C(se, bt, br)) }],
            [{ duration: u, tweens: s.map(C(se, bt, br)) }]
          ],
          join: "all",
          overflow: "detach"
        }
      });
    }
  }
  return n;
}, "#migrateTimelineV5"), Hf = /* @__PURE__ */ c(function(e) {
  return foundry.utils.deepClone(e);
}, "#computeHash"), Y = new WeakSet(), Fe = /* @__PURE__ */ c(function() {
  return h(this, le).cinematics[h(this, ge)];
}, "#active"), // ── Internal ─────────────────────────────────────────────────────────
/** Clone the full state with a patch to the active cinematic (cinematic-level props). */
Fa = /* @__PURE__ */ c(function(e) {
  const n = foundry.utils.deepClone(h(this, le));
  return Object.assign(n.cinematics[h(this, ge)], e), new se(n, {
    loadedHash: h(this, _e),
    cinematicName: h(this, ge),
    segmentName: h(this, Ve)
  });
}, "#cloneActive"), /** Clone the full state with a patch to the active segment within the active cinematic. */
Ie = /* @__PURE__ */ c(function(e) {
  const n = foundry.utils.deepClone(h(this, le)), i = n.cinematics[h(this, ge)].segments[h(this, Ve)];
  if (!i) return this;
  Object.assign(i, e);
  for (const [r, a] of Object.entries(i))
    a === void 0 && delete i[r];
  return new se(n, {
    loadedHash: h(this, _e),
    cinematicName: h(this, ge),
    segmentName: h(this, Ve)
  });
}, "#cloneActiveSegment"), /** Mutate a single timeline entry within the active segment. */
St = /* @__PURE__ */ c(function(e, n) {
  const i = this.activeSegment;
  if (!i || e < 0 || e >= i.timeline.length) return this;
  const r = i.timeline.map((a, o) => o !== e ? a : n(foundry.utils.deepClone(a)));
  return C(this, Y, Ie).call(this, { timeline: r });
}, "#mutateEntry"), k(se, bt), c(se, "CinematicState");
let Jt = se;
const wu = [
  { value: "tile-prop", label: "Tile Prop" },
  { value: "light-color", label: "Light Color" },
  { value: "light-state", label: "Light State" },
  { value: "particles-prop", label: "Particles Prop" },
  { value: "camera-pan", label: "Camera Pan" },
  { value: "token-prop", label: "Token Prop" },
  { value: "drawing-prop", label: "Drawing Prop" },
  { value: "sound-prop", label: "Sound Prop" }
], qf = {
  "tile-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y, width, height" },
  "token-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y" },
  "drawing-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y" },
  "sound-prop": { form: "prop", attribute: "volume", value: 0.5, placeholder: "volume, radius" },
  "particles-prop": { form: "particles", attribute: "alpha", value: 1, placeholder: "alpha, rate, speed, size" },
  "camera-pan": { form: "camera", x: 0, y: 0, scale: 1 },
  "light-color": { form: "lightColor", toColor: "#ffffff", toAlpha: "", mode: "oklch" },
  "light-state": { form: "lightState", enabled: !0 }
}, zy = [
  { value: "canvasReady", label: "Canvas Ready" },
  { value: "manual", label: "Manual Only" }
];
function Eu(t) {
  return t && (t.split("/").pop() || "").replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "-") || "";
}
c(Eu, "soundIdFromPath");
function Cu(t) {
  return t ? new Promise((e) => {
    const n = new Audio(t);
    n.addEventListener("loadedmetadata", () => {
      e(Math.round(n.duration * 1e3));
    }), n.addEventListener("error", () => e(0));
  }) : Promise.resolve(0);
}
c(Cu, "loadAudioDurationMs");
const Hn = 40, Sr = 24, Dr = 50, Su = 50, ti = 60, ai = 10, Os = 16, jf = 40, Bf = 20, Gy = 90, Tu = 70, Lu = 8;
function os(t) {
  return { stepDuration: Math.max(500, t.duration ?? 500), detachOverflow: 0 };
}
c(os, "computeStepDurations");
function Wy(t) {
  var i;
  const e = ((i = t.parallel) == null ? void 0 : i.branches) ?? [];
  let n = 0;
  for (const r of e) {
    let a = 0;
    for (const o of r)
      o.delay != null ? a += o.delay : o.await != null || o.emit != null || (o.sound != null ? a += o.sound.fireAndForget ? 0 : o.sound.duration ?? 0 : o.stopSound != null || (a += os(o).stepDuration));
    n = Math.max(n, a);
  }
  return Math.max(500, n);
}
c(Wy, "computeParallelDuration");
function Tc(t) {
  return t.reduce((e, n) => n.delay != null ? e + n.delay : n.await != null || n.emit != null || n.transitionTo != null ? e : n.sound != null ? e + (n.sound.fireAndForget ? 0 : n.sound.duration ?? 0) : n.stopSound != null ? e : n.parallel != null ? e + Wy(n) : e + os(n).stepDuration, 0);
}
c(Tc, "computeTotalDuration");
function Yy(t, e) {
  if (t <= 0) return 0.1;
  const n = e / t;
  return Math.max(0.03, Math.min(0.5, n));
}
c(Yy, "computeScale");
function Uf(t) {
  const e = t.tweens ?? [];
  if (e.length === 0) return "Empty";
  const n = e[0], i = (n.target ?? "").replace(/^tag:/, "#"), r = n.attribute ?? "";
  return n.type === "camera-pan" ? "Pan" : r === "alpha" ? `Fade ${i}` : r === "x" || r === "y" ? `Move ${i}` : n.type === "light-color" ? `Light ${i}` : n.type === "sound-prop" ? `Sound ${i}` : i ? `${i}` : "Step";
}
c(Uf, "deriveStepLabel");
function Jy(t, e, n, i, r) {
  var u, d;
  const a = [], o = [], s = [];
  let l = e;
  for (let m = 0; m < t.length; m++) {
    const f = t[m], g = `${i}.${m}`, p = r === g;
    if (f.delay != null) {
      const y = Math.max(Bf, f.delay * n);
      a.push({ type: "delay", leftPx: l, widthPx: y, label: `${f.delay}ms`, entryPath: g, selected: p }), l += y;
    } else if (f.await != null) {
      const y = ((u = f.await) == null ? void 0 : u.event) ?? "click", b = y === "tile-click" ? "fa-hand-pointer" : y === "signal" ? "fa-bolt" : "fa-pause";
      a.push({ type: "await", leftPx: l, widthPx: Os, label: y, entryPath: g, selected: p, isGate: !0, gateIcon: b }), ((d = f.await) == null ? void 0 : d.event) === "signal" && s.push({ signal: f.await.signal, centerPx: l + Os / 2 }), l += Os;
    } else if (f.emit != null)
      a.push({ type: "emit", leftPx: l, widthPx: ai, label: "emit", entryPath: g, selected: p, isMarker: !0 }), o.push({ signal: f.emit, centerPx: l + ai / 2 });
    else if (f.sound != null) {
      const y = (f.sound.src || "").split("/").pop() || "Sound", b = f.sound.duration ?? 0;
      if (f.sound.fireAndForget ?? !1)
        a.push({ type: "sound", leftPx: l, widthPx: ai, label: y, entryPath: g, selected: p, isMarker: !0 });
      else {
        const w = b > 0 ? Math.max(ti, b * n) : ti, S = (f.sound.loop ?? !1) && b <= 0;
        a.push({ type: "sound", leftPx: l, widthPx: w, label: y, entryPath: g, selected: p, hasTrailingArrow: S }), l += w;
      }
    } else if (f.stopSound != null)
      a.push({ type: "stopSound", leftPx: l, widthPx: ai, label: "Stop", entryPath: g, selected: p, isMarker: !0 });
    else {
      const { stepDuration: y } = os(f), b = Math.max(jf, y * n), v = Uf(f);
      a.push({ type: "step", leftPx: l, widthPx: b, label: v, entryPath: g, selected: p }), l += b;
    }
  }
  return { blocks: a, width: l - e, emits: o, awaits: s };
}
c(Jy, "computeBranchLane");
function Iu(t) {
  return Sr + t * Hn;
}
c(Iu, "laneIndexToY");
function Ky(t, e) {
  const n = [];
  for (const i of t.emits)
    for (const r of t.awaits) {
      if (i.signal !== r.signal) continue;
      const a = i.centerPx, o = Iu(i.laneIndex) + Hn / 2, s = r.centerPx, l = Iu(r.laneIndex) + Hn / 2, u = l - o, d = (a + s) / 2, m = o + Math.sign(u || 1) * Math.min(40, Math.abs(u) * 0.5 + 20), f = l - Math.sign(u || 1) * Math.min(40, Math.abs(u) * 0.5 + 20);
      n.push({
        pathD: `M ${a} ${o} C ${d} ${m}, ${d} ${f}, ${s} ${l}`,
        signal: i.signal
      });
    }
  return n;
}
c(Ky, "computeSignalArcs");
function Xy(t, e) {
  const n = [];
  if (t <= 0) return n;
  const i = e * 1e3;
  let r;
  i >= 200 ? r = 500 : i >= 80 ? r = 1e3 : i >= 40 ? r = 2e3 : r = 5e3;
  for (let a = 0; a <= t + r; a += r) {
    const o = a >= 1e3 ? `${(a / 1e3).toFixed(a % 1e3 === 0 ? 0 : 1)}s` : `${a}ms`;
    n.push({ px: Dr + a * e, label: o });
  }
  return n;
}
c(Xy, "computeTimeMarkers");
function Qy(t) {
  const e = [];
  for (let n = 0; n < t.length - 1; n++) {
    const i = t[n], r = t[n + 1], a = i.leftPx + i.widthPx + (r.leftPx - (i.leftPx + i.widthPx)) / 2, o = Sr + Hn / 2;
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
c(Qy, "computeInsertionPoints");
function Zy(t, { selectedPath: e, windowWidth: n }) {
  const i = Tc(t), r = n - 70 - 100, a = Yy(i, r), o = [], s = [], l = { emits: [], awaits: [] }, u = [];
  o.push({
    type: "setup",
    leftPx: 0,
    widthPx: Dr,
    label: "Setup",
    entryPath: "setup",
    selected: e === "setup"
  });
  let d = Dr;
  for (let w = 0; w < t.length; w++) {
    const S = t[w], I = `timeline.${w}`, A = e === I;
    if (S.delay != null) {
      const O = Math.max(Bf, S.delay * a);
      o.push({
        type: "delay",
        leftPx: d,
        widthPx: O,
        label: `${S.delay}ms`,
        entryPath: I,
        selected: A
      }), d += O;
    } else if (S.emit != null)
      o.push({
        type: "emit",
        leftPx: d,
        widthPx: ai,
        label: "Emit",
        entryPath: I,
        selected: A,
        isMarker: !0
      }), l.emits.push({
        signal: S.emit,
        centerPx: d + ai / 2,
        laneIndex: 0
      });
    else if (S.sound != null) {
      const O = (S.sound.src || "").split("/").pop() || "Sound", x = S.sound.duration ?? 0;
      if (S.sound.fireAndForget ?? !1) {
        const D = x > 0 ? Math.max(ti, x * a) : ti, F = (S.sound.loop ?? !1) && x <= 0, P = {
          type: "sound",
          leftPx: d,
          widthPx: D,
          label: O,
          entryPath: I,
          selected: A,
          hasTrailingArrow: F
        };
        let _ = !1;
        for (const H of u)
          if (H.rightEdgePx <= d) {
            H.blocks.push(P), H.rightEdgePx = d + D, _ = !0;
            break;
          }
        _ || u.push({
          label: "♫ F&F",
          blocks: [P],
          rightEdgePx: d + D
        });
      } else {
        const D = x > 0 ? Math.max(ti, x * a) : ti, F = (S.sound.loop ?? !1) && x <= 0;
        o.push({
          type: "sound",
          leftPx: d,
          widthPx: D,
          label: O,
          entryPath: I,
          selected: A,
          hasTrailingArrow: F
        }), d += D;
      }
    } else if (S.stopSound != null)
      o.push({
        type: "stopSound",
        leftPx: d,
        widthPx: ai,
        label: "Stop",
        entryPath: I,
        selected: A,
        isMarker: !0
      });
    else if (S.parallel != null) {
      const O = S.parallel.branches ?? [], x = d, M = [];
      let D = 0;
      for (let P = 0; P < O.length; P++) {
        const _ = `timeline.${w}.parallel.branches.${P}`, { blocks: H, width: q, emits: j, awaits: B } = Jy(O[P], x, a, _, e);
        M.push({ label: `Br ${P + 1}`, blocks: H }), D = Math.max(D, q);
        const V = s.length * 10 + P + 1;
        for (const J of j) l.emits.push({ ...J, laneIndex: V });
        for (const J of B) l.awaits.push({ ...J, laneIndex: V });
      }
      const F = Math.max(ti, D);
      o.push({
        type: "parallel",
        leftPx: x,
        widthPx: F,
        label: `${O.length} br`,
        entryPath: I,
        selected: A
      }), s.push({ parallelEntryIndex: w, startPx: x, lanes: M }), d += F;
    } else {
      const { stepDuration: O } = os(S), x = Math.max(jf, O * a), M = Uf(S);
      o.push({
        type: "step",
        leftPx: d,
        widthPx: x,
        label: M,
        entryPath: I,
        selected: A
      }), d += x;
    }
  }
  o.push({
    type: "landing",
    leftPx: d,
    widthPx: Su,
    label: "Landing",
    entryPath: "landing",
    selected: e === "landing"
  }), d += Su;
  const m = s.flatMap((w) => w.lanes), f = m.length;
  for (const w of u)
    m.push({ label: w.label, blocks: w.blocks });
  const g = Ky(l, m.length), p = [];
  for (let w = 0; w < u.length; w++) {
    const S = f + w;
    for (const I of u[w].blocks) {
      const A = I.leftPx, O = Sr + Hn, x = Sr + (1 + S) * Hn + Hn / 2;
      p.push({ x: A, y1: O, y2: x });
    }
  }
  const y = Xy(i, a), b = Qy(o), v = Sr + (1 + m.length) * Hn;
  return {
    mainBlocks: o,
    subLanes: m,
    signalArcs: g,
    fafConnectors: p,
    timeMarkers: y,
    insertionPoints: b,
    totalWidthPx: Math.max(d, 200),
    swimlaneHeightPx: v,
    totalDurationMs: i
  };
}
c(Zy, "computeLanes");
function eb(t) {
  if (t <= 0) return "0s";
  if (t < 1e3) return `${t}ms`;
  const e = t / 1e3;
  return e % 1 === 0 ? `${e}s` : `${e.toFixed(1)}s`;
}
c(eb, "formatDuration");
function tb(t, e) {
  var g, p, y, b;
  const n = t.segments ?? {}, i = t.entry ?? "main", r = Object.keys(n);
  if (r.length === 0)
    return { nodes: [], edges: [], totalWidthPx: 0 };
  const a = /* @__PURE__ */ new Set(), o = [];
  let s = i;
  for (; s && typeof s == "string" && n[s] && !a.has(s); )
    a.add(s), o.push(s), s = n[s].next;
  for (const v of r)
    a.has(v) || o.push(v);
  const l = [];
  let u = Lu;
  for (const v of o) {
    const w = n[v], S = Tc(w.timeline ?? []), I = eb(S), A = v === i, O = v === e, x = !a.has(v), M = Gy;
    l.push({
      name: v,
      durationMs: S,
      durationLabel: I,
      isEntry: A,
      isActive: O,
      isOrphan: x,
      leftPx: u,
      widthPx: M,
      hasGate: !!w.gate,
      gateEvent: ((g = w.gate) == null ? void 0 : g.event) ?? null
    }), u += M + Tu;
  }
  const d = [], m = new Map(l.map((v) => [v.name, v]));
  for (const v of o) {
    const w = n[v];
    if (!w.next) continue;
    const S = typeof w.next == "string" ? w.next : (p = w.next) == null ? void 0 : p.segment;
    if (!S) continue;
    const I = m.get(v), A = m.get(S);
    if (!I || !A) continue;
    const O = n[S], x = ((y = O == null ? void 0 : O.gate) == null ? void 0 : y.event) ?? null, M = typeof w.next == "object" && ((b = w.next) == null ? void 0 : b.scene);
    d.push({
      fromName: v,
      toName: S,
      gateLabel: x,
      isCrossScene: M,
      fromRightPx: I.leftPx + I.widthPx,
      toLeftPx: A.leftPx
    });
  }
  const f = u - Tu + Lu;
  return { nodes: l, edges: d, totalWidthPx: f };
}
c(tb, "computeSegmentGraph");
function Vn(t) {
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
c(Vn, "parseEntryPath");
function ro(t, e) {
  var i, r, a, o;
  const n = Vn(t);
  return n ? n.type === "setup" ? e.setup : n.type === "landing" ? e.landing : n.type === "timeline" ? e.timeline[n.index] : n.type === "branch" ? (o = (a = (r = (i = e.timeline[n.index]) == null ? void 0 : i.parallel) == null ? void 0 : r.branches) == null ? void 0 : a[n.branchIndex]) == null ? void 0 : o[n.branchEntryIndex] : null : null;
}
c(ro, "getEntryAtPath");
function Ou(t) {
  const e = Vn(t);
  return !e || e.type !== "timeline" ? null : e.index;
}
c(Ou, "getTimelineIndexFromPath");
function nb(t) {
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
c(nb, "countUniqueTargets");
function ib(t, e) {
  var i, r, a;
  const n = Vn(t);
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
c(ib, "stepNumberForPath");
function rb(t) {
  return {
    isSetup: !0,
    targetCount: Object.keys(t.setup ?? {}).length
  };
}
c(rb, "buildSetupDetail");
function ab(t) {
  return {
    isLanding: !0,
    targetCount: Object.keys(t.landing ?? {}).length
  };
}
c(ab, "buildLandingDetail");
function ob(t) {
  return { type: "delay", isDelay: !0, delay: t.delay };
}
c(ob, "buildDelayDetail");
function sb(t) {
  return { type: "emit", isEmit: !0, signal: t.emit };
}
c(sb, "buildEmitDetail");
function lb(t) {
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
c(lb, "buildSoundDetail");
function cb(t) {
  return {
    type: "stopSound",
    isStopSound: !0,
    stopSoundId: t.stopSound
  };
}
c(cb, "buildStopSoundDetail");
function ub(t, e) {
  var o;
  const n = t.parallel, i = n.join ?? "all", r = n.overflow ?? "detach", a = (n.branches ?? []).map((s, l) => ({
    branchIndex: l,
    label: `Branch ${l + 1}`,
    entries: (s ?? []).map((u, d) => {
      var S, I;
      const m = u.delay != null, f = u.await != null, g = u.emit != null, p = u.sound != null, y = u.stopSound != null, b = !m && !f && !g && !p && !y;
      let v, w;
      return m ? (v = `${u.delay}ms`, w = "delay") : f ? (v = "Await", w = ((S = u.await) == null ? void 0 : S.event) ?? "click") : g ? (v = "Emit", w = u.emit || "(unnamed)") : p ? (v = "Sound", w = (u.sound.src || "").split("/").pop() || "(none)") : y ? (v = "Stop Sound", w = u.stopSound || "(no id)") : (v = "Step", w = `${((I = u.tweens) == null ? void 0 : I.length) ?? 0} tweens`), { branchEntryIndex: d, isDelay: m, isAwait: f, isEmit: g, isSound: p, isStopSound: y, isStep: b, label: v, sub: w };
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
c(ub, "buildParallelDetail");
function db(t, e, n, i) {
  const r = vc(), a = (t.tweens ?? []).map((l, u) => {
    const d = `${e}.tweens.${u}`, m = n.has(d), f = l.type ?? "tile-prop", g = wu.find((v) => v.value === f), p = qf[f], y = (p == null ? void 0 : p.form) ?? "prop", b = l.mode ?? "oklch";
    return {
      tweenIndex: u,
      isExpanded: m,
      type: f,
      typeLabel: (g == null ? void 0 : g.label) ?? l.type ?? "Tile Prop",
      target: l.target ?? "",
      attribute: l.attribute ?? "",
      attributePlaceholder: (p == null ? void 0 : p.placeholder) ?? "",
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
      typeOptions: wu.map((v) => ({
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
  }), o = Object.keys(t.before ?? {}), s = Object.keys(t.after ?? {});
  return {
    type: "step",
    isStep: !0,
    isDelay: !1,
    stepNumber: ib(e, i),
    stepDuration: t.duration ?? 1e3,
    tweens: a,
    beforeSummary: o.length ? `${o.length} target${o.length !== 1 ? "s" : ""}` : "(none)",
    afterSummary: s.length ? `${s.length} target${s.length !== 1 ? "s" : ""}` : "(none)"
  };
}
c(db, "buildStepDetail");
function fb(t, { state: e, expandedTweens: n }) {
  const i = Vn(t);
  if (!i) return null;
  if (i.type === "setup") return rb(e);
  if (i.type === "landing") return ab(e);
  const r = ro(t, e);
  return r ? r.delay != null ? ob(r) : r.emit != null ? sb(r) : r.sound != null ? lb(r) : r.stopSound != null ? cb(r) : r.parallel != null && i.type === "timeline" ? ub(r) : db(r, t, n, e) : null;
}
c(fb, "buildDetail");
function mb({ state: t, mutate: e }) {
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
              e(() => new Jt(l));
            else if (l.segments !== void 0) {
              const u = { version: 4, cinematics: { [t.activeCinematicName]: l } };
              e(() => new Jt(u, { cinematicName: t.activeCinematicName }));
            } else if (l.timeline !== void 0) {
              const u = { version: 3, cinematics: { [t.activeCinematicName]: l } };
              e(() => new Jt(u, { cinematicName: t.activeCinematicName }));
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
c(mb, "showImportDialog");
function ao(t, { state: e, mutate: n }) {
  const i = t === "setup" ? e.setup : e.landing, r = JSON.stringify(i ?? {}, null, 2);
  new Dialog({
    title: `Edit ${t.charAt(0).toUpperCase() + t.slice(1)}`,
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON map of target selector → property overrides:</p>
			<textarea id="cinematic-json-edit" style="width:100%;height:200px;font-family:monospace;font-size:0.8rem">${Pt(r)}</textarea>
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
c(ao, "showEditJsonDialog");
function Au(t, { selectedPath: e, state: n, mutate: i }) {
  const r = ro(e, n);
  if (!r || r.delay != null) return;
  const a = r[t] ?? {}, o = JSON.stringify(a, null, 2);
  new Dialog({
    title: `Edit Step ${t.charAt(0).toUpperCase() + t.slice(1)}`,
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON map of target selector → property overrides:</p>
			<textarea id="cinematic-json-edit" style="width:100%;height:200px;font-family:monospace;font-size:0.8rem">${Pt(o)}</textarea>
		`,
    buttons: {
      save: {
        label: "Apply",
        callback: /* @__PURE__ */ c((s) => {
          var u, d;
          const l = s.find("#cinematic-json-edit").val();
          try {
            const m = JSON.parse(l), f = Vn(e);
            (f == null ? void 0 : f.type) === "timeline" ? i((g) => g.updateEntry(f.index, { [t]: m })) : (f == null ? void 0 : f.type) === "branch" && i((g) => g.updateBranchEntry(f.index, f.branchIndex, f.branchEntryIndex, { [t]: m }));
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
c(Au, "showEditStepStateDialog");
function hb({ selectedPath: t, state: e, mutate: n }) {
  const i = Vn(t);
  if (!i || i.type !== "timeline") return;
  const r = e.timeline[i.index];
  if (!(r != null && r.parallel)) return;
  const a = JSON.stringify(r.parallel.branches ?? [], null, 2);
  new Dialog({
    title: "Edit Parallel Branches",
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON array of branch timelines:</p>
			<textarea id="cinematic-json-edit" style="width:100%;height:250px;font-family:monospace;font-size:0.8rem">${Pt(a)}</textarea>
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
c(hb, "showEditParallelJsonDialog");
var zu, Mn, jn, Da, Vf;
const Lt = class Lt extends Yn(Wn) {
  constructor(n = {}) {
    super(n);
    k(this, jn);
    k(this, Mn, null);
    L(this, Mn, n.scene ?? canvas.scene ?? null);
  }
  async _prepareContext() {
    var r, a, o;
    const n = h(this, jn, Da), i = ((a = n == null ? void 0 : n.getSeenStatus) == null ? void 0 : a.call(n, (r = h(this, Mn)) == null ? void 0 : r.id)) ?? [];
    return {
      sceneName: ((o = h(this, Mn)) == null ? void 0 : o.name) ?? "No scene",
      users: i.map((s) => ({
        ...s,
        statusLabel: s.seen ? "Seen" : "Not seen",
        statusClass: s.seen ? "cinematic-tracking__status--seen" : "cinematic-tracking__status--unseen"
      })),
      hasAnyTracked: i.some((s) => s.seen)
    };
  }
  _onRender(n, i) {
    super._onRender(n, i), C(this, jn, Vf).call(this);
  }
};
Mn = new WeakMap(), jn = new WeakSet(), Da = /* @__PURE__ */ c(function() {
  var n, i;
  return (i = (n = game.modules.get(T)) == null ? void 0 : n.api) == null ? void 0 : i.cinematic;
}, "#api"), Vf = /* @__PURE__ */ c(function() {
  var i, r;
  const n = this.element;
  n instanceof HTMLElement && (n.querySelectorAll("[data-action='reset-user']").forEach((a) => {
    a.addEventListener("click", async () => {
      var l;
      const o = a.dataset.userId;
      if (!o) return;
      const s = h(this, jn, Da);
      s != null && s.resetForUser && (await s.resetForUser((l = h(this, Mn)) == null ? void 0 : l.id, o), this.render({ force: !0 }));
    });
  }), (i = n.querySelector("[data-action='reset-all']")) == null || i.addEventListener("click", async () => {
    var o;
    const a = h(this, jn, Da);
    a != null && a.resetForAll && (await a.resetForAll((o = h(this, Mn)) == null ? void 0 : o.id), this.render({ force: !0 }));
  }), (r = n.querySelector("[data-action='refresh']")) == null || r.addEventListener("click", () => {
    this.render({ force: !0 });
  }));
}, "#bindEvents"), c(Lt, "CinematicTrackingApplication"), be(Lt, "APP_ID", `${T}-cinematic-tracking`), be(Lt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  He(Lt, Lt, "DEFAULT_OPTIONS"),
  {
    id: Lt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((zu = He(Lt, Lt, "DEFAULT_OPTIONS")) == null ? void 0 : zu.classes) ?? [], "eidolon-cinematic-tracking-window", "themed"])
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
)), be(Lt, "PARTS", {
  content: {
    template: `modules/${T}/templates/cinematic-tracking.html`
  }
});
let Bl = Lt;
function gb(t, e) {
  var n, i, r, a, o, s, l, u, d;
  (n = t.querySelector("[data-action='save']")) == null || n.addEventListener("click", () => e.save()), (i = t.querySelector("[data-action='play-preview']")) == null || i.addEventListener("click", () => e.play()), (r = t.querySelector("[data-action='reset-tracking']")) == null || r.addEventListener("click", () => e.resetTracking()), (a = t.querySelector("[data-action='export-json']")) == null || a.addEventListener("click", () => e.exportJSON()), (o = t.querySelector("[data-action='undo']")) == null || o.addEventListener("click", () => e.undo()), (s = t.querySelector("[data-action='redo']")) == null || s.addEventListener("click", () => e.redo()), (l = t.querySelector("[data-action='validate']")) == null || l.addEventListener("click", () => e.validate()), (u = t.querySelector("[data-action='import-json']")) == null || u.addEventListener("click", () => e.importJSON()), (d = t.querySelector("[data-action='open-tracking']")) == null || d.addEventListener("click", () => {
    new Bl({ scene: e.scene }).render(!0);
  });
}
c(gb, "bindToolbarEvents");
function pb(t, e) {
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
            var l, u, d, m, f, g, p;
            const s = (l = o.find("#cinematic-new-name").val()) == null ? void 0 : l.trim();
            if (!s) {
              (d = (u = ui.notifications) == null ? void 0 : u.warn) == null || d.call(u, "Name cannot be empty.");
              return;
            }
            if (/[.\s]/.test(s)) {
              (f = (m = ui.notifications) == null ? void 0 : m.warn) == null || f.call(m, "Name cannot contain dots or spaces.");
              return;
            }
            if (e.state.listCinematicNames().includes(s)) {
              (p = (g = ui.notifications) == null ? void 0 : g.warn) == null || p.call(g, "Name already exists.");
              return;
            }
            e.mutate((y) => y.addCinematic(s));
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
      content: `<label style="display:flex;align-items:center;gap:0.5rem"><span>Name:</span><input id="cinematic-rename" type="text" style="flex:1" value="${Pt(o)}" /></label>`,
      buttons: {
        ok: {
          label: "Rename",
          callback: /* @__PURE__ */ c((s) => {
            var u, d, m, f, g, p, y;
            const l = (u = s.find("#cinematic-rename").val()) == null ? void 0 : u.trim();
            if (!l) {
              (m = (d = ui.notifications) == null ? void 0 : d.warn) == null || m.call(d, "Name cannot be empty.");
              return;
            }
            if (/[.\s]/.test(l)) {
              (g = (f = ui.notifications) == null ? void 0 : f.warn) == null || g.call(f, "Name cannot contain dots or spaces.");
              return;
            }
            if (l !== o) {
              if (e.state.listCinematicNames().includes(l)) {
                (y = (p = ui.notifications) == null ? void 0 : p.warn) == null || y.call(p, "Name already exists.");
                return;
              }
              e.mutate((b) => b.renameCinematic(o, l));
            }
          }, "callback")
        },
        cancel: { label: "Cancel" }
      },
      default: "ok"
    }).render(!0);
  });
}
c(pb, "bindCinematicSelectorEvents");
function yb(t, e) {
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
        const s = Ou(n), l = Ou(o);
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
c(yb, "bindSwimlaneEvents");
function bb(t, e) {
  var n, i, r, a, o, s, l, u, d, m, f;
  (n = t.querySelector("[data-action='delete-entry']")) == null || n.addEventListener("click", () => {
    const g = e.parseEntryPath(e.selectedPath);
    g && (g.type === "timeline" ? (e.mutate((p) => p.removeEntry(g.index)), e.setSelectedPath(null)) : g.type === "branch" && (e.mutate((p) => p.removeBranchEntry(g.index, g.branchIndex, g.branchEntryIndex)), e.setSelectedPath(null)));
  }), (i = t.querySelector("[data-action='step-duration']")) == null || i.addEventListener("input", (g) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = Number(g.target.value) || 0;
    p.type === "timeline" ? e.mutate((b) => b.updateStepDuration(p.index, y)) : p.type === "branch" && e.mutate((b) => b.updateBranchEntry(p.index, p.branchIndex, p.branchEntryIndex, { duration: Math.max(0, y) }));
  }), (r = t.querySelector("[data-action='add-tween']")) == null || r.addEventListener("click", () => {
    const g = e.parseEntryPath(e.selectedPath);
    if (g) {
      if (g.type === "timeline")
        e.mutate((p) => p.addTween(g.index));
      else if (g.type === "branch") {
        const p = e.getEntryAtPath(e.selectedPath);
        if (!p) return;
        const y = { type: "tile-prop", target: "", attribute: "alpha", value: 1 }, b = [...p.tweens ?? [], y];
        e.mutate((v) => v.updateBranchEntry(g.index, g.branchIndex, g.branchEntryIndex, { tweens: b }));
      }
    }
  }), (a = t.querySelector("[data-action='change-delay']")) == null || a.addEventListener("change", (g) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = Number(g.target.value) || 0;
    p.type === "timeline" ? e.mutate((b) => b.updateEntry(p.index, { delay: y })) : p.type === "branch" && e.mutate((b) => b.updateBranchEntry(p.index, p.branchIndex, p.branchEntryIndex, { delay: y }));
  }), (o = t.querySelector("[data-action='edit-setup']")) == null || o.addEventListener("click", () => {
    ao("setup", { state: e.state, mutate: e.mutate });
  }), (s = t.querySelector("[data-action='edit-landing']")) == null || s.addEventListener("click", () => {
    ao("landing", { state: e.state, mutate: e.mutate });
  }), (l = t.querySelector("[data-action='edit-before']")) == null || l.addEventListener("click", () => {
    Au("before", { selectedPath: e.selectedPath, state: e.state, mutate: e.mutate });
  }), (u = t.querySelector("[data-action='edit-after']")) == null || u.addEventListener("click", () => {
    Au("after", { selectedPath: e.selectedPath, state: e.state, mutate: e.mutate });
  }), (d = t.querySelector("[data-action='change-trigger']")) == null || d.addEventListener("change", (g) => {
    e.mutate((p) => p.setTrigger(g.target.value));
  }), (m = t.querySelector("[data-action='change-tracking']")) == null || m.addEventListener("change", (g) => {
    e.mutate((p) => p.setTracking(g.target.checked));
  }), (f = t.querySelector("[data-action='change-synchronized']")) == null || f.addEventListener("change", (g) => {
    e.mutate((p) => p.setSynchronized(g.target.checked));
  });
}
c(bb, "bindDetailPanelEvents");
const er = /* @__PURE__ */ new WeakMap(), oo = /* @__PURE__ */ new Set(), so = /* @__PURE__ */ new Set(), ku = {
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
function lo(t, e = {}) {
  var p, y, b;
  if (!t) return !1;
  tr(t);
  const n = e.mode ?? (e.color != null ? "custom" : "hover"), i = ku[n] ?? ku.hover, r = e.color ?? i.borderColor, a = e.alpha ?? i.borderAlpha, o = e.color ?? i.spriteTint, s = i.spriteAlpha, l = e.pulse ?? i.pulse, u = { border: null, sprite: null, pulseData: null, mode: n }, d = ((p = t.document) == null ? void 0 : p.width) ?? t.w ?? 100, m = ((y = t.document) == null ? void 0 : y.height) ?? t.h ?? 100, f = new PIXI.Graphics();
  f.lineStyle(i.borderWidth, r, a), f.drawRect(0, 0, d, m), t.addChild(f), u.border = f;
  const g = vb(t, o, s);
  if (g && (canvas.controls.debug.addChild(g), so.add(g), u.sprite = g), l && ((b = canvas.app) != null && b.ticker)) {
    const v = {
      elapsed: 0,
      fn: /* @__PURE__ */ c((w) => {
        v.elapsed += w;
        const S = (Math.sin(v.elapsed * 0.05) + 1) / 2;
        u.border && (u.border.alpha = a * (0.4 + 0.6 * S)), u.sprite && (u.sprite.alpha = s * (0.5 + 0.5 * S));
      }, "fn")
    };
    canvas.app.ticker.add(v.fn), u.pulseData = v, oo.add(v);
  }
  return er.set(t, u), !0;
}
c(lo, "addHighlight");
function tr(t) {
  var n, i;
  if (!t) return;
  const e = er.get(t);
  e && (e.pulseData && ((i = (n = canvas.app) == null ? void 0 : n.ticker) == null || i.remove(e.pulseData.fn), oo.delete(e.pulseData)), e.border && (e.border.parent && e.border.parent.removeChild(e.border), e.border.destroy({ children: !0 })), e.sprite && (e.sprite.parent && e.sprite.parent.removeChild(e.sprite), e.sprite.destroy({ children: !0 }), so.delete(e.sprite)), er.delete(t));
}
c(tr, "removeHighlight");
function zf(t) {
  return er.has(t);
}
c(zf, "hasHighlight");
function Pa() {
  var e, n, i, r, a, o, s;
  for (const l of oo)
    (n = (e = canvas.app) == null ? void 0 : e.ticker) == null || n.remove(l.fn);
  oo.clear();
  for (const l of so)
    l.parent && l.parent.removeChild(l), l.destroy({ children: !0 });
  so.clear();
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
        const d = er.get(u);
        d && (d.border && (d.border.parent && d.border.parent.removeChild(d.border), d.border.destroy({ children: !0 })), er.delete(u));
      }
}
c(Pa, "clearAllHighlights");
function vb(t, e, n) {
  var a;
  const i = t.mesh;
  if (!((a = i == null ? void 0 : i.texture) != null && a.baseTexture)) return null;
  const r = PIXI.Sprite.from(i.texture);
  return r.isSprite = !0, r.anchor.set(i.anchor.x, i.anchor.y), r.width = i.width, r.height = i.height, r.scale = i.scale, r.position = t.center, r.angle = i.angle, r.alpha = n, r.tint = e, r.name = "eidolonPickerHighlight", r;
}
c(vb, "createTintSprite");
let ni = null;
function Gf(t) {
  var p, y, b;
  ni && ni.cancel();
  const { placeableType: e = "Tile", onPick: n, onCancel: i } = t;
  let r = null;
  const a = `control${e}`, o = `hover${e}`, s = /* @__PURE__ */ c((v, w) => {
    var I;
    if (!w) return;
    const S = v.document ?? v;
    (I = v.release) == null || I.call(v), n(S);
  }, "onControl"), l = /* @__PURE__ */ c((v, w) => {
    w ? (r = v, lo(v, { mode: "pick" })) : r === v && (tr(v), r = null);
  }, "onHoverIn"), u = /* @__PURE__ */ c((v) => {
    v.key === "Escape" && (v.preventDefault(), v.stopPropagation(), g());
  }, "onKeydown"), d = /* @__PURE__ */ c((v) => {
    v.preventDefault(), g();
  }, "onContextMenu"), m = Hooks.on(a, s), f = Hooks.on(o, l);
  document.addEventListener("keydown", u, { capture: !0 }), (p = canvas.stage) == null || p.addEventListener("rightclick", d), (b = (y = ui.notifications) == null ? void 0 : y.info) == null || b.call(y, `Pick mode active — click a ${e.toLowerCase()} on the canvas, or press ESC to cancel.`, { permanent: !1 });
  function g() {
    var v;
    ni && (ni = null, Hooks.off(a, m), Hooks.off(o, f), document.removeEventListener("keydown", u, { capture: !0 }), (v = canvas.stage) == null || v.removeEventListener("rightclick", d), r && (tr(r), r = null), i == null || i());
  }
  return c(g, "cancel"), ni = { cancel: g }, { cancel: g };
}
c(Gf, "enterPickMode");
function vr() {
  ni && ni.cancel();
}
c(vr, "cancelPickMode");
const wb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cancelPickMode: vr,
  enterPickMode: Gf
}, Symbol.toStringTag, { value: "Module" }));
var Gu, Ne, ze, Zr, _n, ea, ta, tt, Nn, me, Wf, Ul, Yf, Jf, Kf, Vl, zl, Xf, Qf;
const mt = class mt extends Yn(Wn) {
  /**
   * @param {object} options
   * @param {string[]} [options.selections]  Initial selections
   * @param {string} [options.placeableType]  "Tile", "Token", etc.
   * @param {(selectors: string[]) => void} [options.onApply]
   * @param {() => void} [options.onCancel]
   */
  constructor(n = {}) {
    super(n);
    k(this, me);
    /** @type {string[]} Current selections (selector strings). */
    k(this, Ne, []);
    /** @type {boolean} Whether pick mode is active. */
    k(this, ze, !1);
    /** @type {string} Placeable type (Tile, Token, etc.). */
    k(this, Zr, "Tile");
    /** @type {string} Current tag match mode. */
    k(this, _n, "any");
    /** @type {((selectors: string[]) => void) | null} */
    k(this, ea, null);
    /** @type {(() => void) | null} */
    k(this, ta, null);
    /** @type {Promise resolve function for the open() API. */
    k(this, tt, null);
    /** @type {PlaceableObject | null} Currently hovered tile in the browser. */
    k(this, Nn, null);
    L(this, Ne, [...n.selections ?? []]), L(this, Zr, n.placeableType ?? "Tile"), L(this, ea, n.onApply ?? null), L(this, ta, n.onCancel ?? null);
  }
  // ── Context ───────────────────────────────────────────────────────────
  async _prepareContext() {
    var r;
    const n = C(this, me, Vl).call(this), i = (((r = canvas.tiles) == null ? void 0 : r.placeables) ?? []).map((a, o) => {
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
      selections: h(this, Ne),
      selectionCount: h(this, Ne).length,
      pickModeActive: h(this, ze),
      tagModeIsAny: h(this, _n) === "any",
      tagModeIsAll: h(this, _n) === "all",
      tagPreviewCount: 0,
      tiles: i,
      tileCount: i.length
    };
  }
  // ── Render & Events ───────────────────────────────────────────────────
  _onRender(n, i) {
    super._onRender(n, i), C(this, me, Wf).call(this), C(this, me, zl).call(this);
  }
  async _onClose(n) {
    return h(this, ze) && (vr(), L(this, ze, !1)), Pa(), h(this, tt) && (h(this, tt).call(this, null), L(this, tt, null)), super._onClose(n);
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
        onApply: /* @__PURE__ */ c((a) => i(a), "onApply"),
        onCancel: /* @__PURE__ */ c(() => i(null), "onCancel")
      });
      L(r, tt, i), r.render(!0);
    });
  }
};
Ne = new WeakMap(), ze = new WeakMap(), Zr = new WeakMap(), _n = new WeakMap(), ea = new WeakMap(), ta = new WeakMap(), tt = new WeakMap(), Nn = new WeakMap(), me = new WeakSet(), Wf = /* @__PURE__ */ c(function() {
  var a, o, s, l;
  const n = this.element;
  if (!(n instanceof HTMLElement)) return;
  const i = n.querySelector("[data-role='tag-input']"), r = n.querySelector("[data-role='tag-mode']");
  r == null || r.addEventListener("change", (u) => {
    L(this, _n, u.target.value);
  }), i == null || i.addEventListener("input", () => {
    C(this, me, Yf).call(this, n);
  }), i == null || i.addEventListener("keydown", (u) => {
    u.key === "Enter" && (u.preventDefault(), C(this, me, Ul).call(this, n));
  }), (a = n.querySelector("[data-action='add-tag-selector']")) == null || a.addEventListener("click", () => {
    C(this, me, Ul).call(this, n);
  }), (o = n.querySelector("[data-action='toggle-pick-mode']")) == null || o.addEventListener("click", () => {
    h(this, ze) ? (vr(), L(this, ze, !1)) : (L(this, ze, !0), Gf({
      placeableType: h(this, Zr),
      onPick: /* @__PURE__ */ c((u) => {
        C(this, me, Jf).call(this, u.id);
      }, "onPick"),
      onCancel: /* @__PURE__ */ c(() => {
        L(this, ze, !1), this.render({ force: !0 });
      }, "onCancel")
    })), this.render({ force: !0 });
  }), n.querySelectorAll("[data-action='toggle-tile']").forEach((u) => {
    u.addEventListener("click", () => {
      const d = u.dataset.docId;
      d && C(this, me, Kf).call(this, d);
    }), u.addEventListener("mouseenter", () => {
      var f, g;
      const d = u.dataset.docId;
      if (!d) return;
      const m = (g = (f = canvas.tiles) == null ? void 0 : f.placeables) == null ? void 0 : g.find((p) => p.document.id === d);
      m && (L(this, Nn, m), lo(m, { mode: "hover" }));
    }), u.addEventListener("mouseleave", () => {
      h(this, Nn) && (tr(h(this, Nn)), L(this, Nn, null), C(this, me, zl).call(this));
    });
  }), n.querySelectorAll("[data-action='remove-selection']").forEach((u) => {
    u.addEventListener("click", () => {
      const d = Number(u.dataset.selectionIndex);
      Number.isNaN(d) || (h(this, Ne).splice(d, 1), this.render({ force: !0 }));
    });
  }), (s = n.querySelector("[data-action='apply']")) == null || s.addEventListener("click", () => {
    C(this, me, Xf).call(this);
  }), (l = n.querySelector("[data-action='cancel']")) == null || l.addEventListener("click", () => {
    C(this, me, Qf).call(this);
  });
}, "#bindEvents"), // ── Tag helpers ───────────────────────────────────────────────────────
Ul = /* @__PURE__ */ c(function(n) {
  var s;
  const i = n.querySelector("[data-role='tag-input']"), r = (s = i == null ? void 0 : i.value) == null ? void 0 : s.trim();
  if (!r) return;
  const a = r.split(",").map((l) => l.trim()).filter(Boolean);
  if (a.length === 0) return;
  const o = $f(a, h(this, _n));
  o && !h(this, Ne).includes(o) && h(this, Ne).push(o), i && (i.value = ""), this.render({ force: !0 });
}, "#addTagSelector"), Yf = /* @__PURE__ */ c(function(n) {
  var m, f;
  const i = n.querySelector("[data-role='tag-input']"), r = n.querySelector("[data-role='tag-preview']");
  if (!i || !r) return;
  const a = i.value.trim();
  if (!a) {
    r.textContent = "";
    return;
  }
  const o = a.split(",").map((g) => g.trim()).filter(Boolean);
  if (o.length === 0) {
    r.textContent = "";
    return;
  }
  const s = window.Tagger ?? ((m = game.modules.get("tagger")) == null ? void 0 : m.api);
  if (!s) {
    r.textContent = "Tagger not available";
    return;
  }
  const l = h(this, _n) === "any", u = s.getByTag(o, {
    sceneId: (f = canvas.scene) == null ? void 0 : f.id,
    matchAny: l
  }), d = (u == null ? void 0 : u.length) ?? 0;
  r.textContent = `${d} matching placeable(s)`;
}, "#updateTagPreview"), // ── ID selector helpers ──────────────────────────────────────────────
Jf = /* @__PURE__ */ c(function(n) {
  const i = `id:${n}`;
  h(this, Ne).includes(i) || (h(this, Ne).push(i), this.render({ force: !0 }));
}, "#addIdSelector"), Kf = /* @__PURE__ */ c(function(n) {
  const i = `id:${n}`, r = h(this, Ne).indexOf(i);
  r >= 0 ? h(this, Ne).splice(r, 1) : h(this, Ne).push(i), this.render({ force: !0 });
}, "#toggleIdSelector"), /**
 * Get the set of document IDs that are currently selected across all selector types.
 * Resolves tag/tags-any/tags-all selectors to find matching document IDs.
 * @returns {Set<string>}
 */
Vl = /* @__PURE__ */ c(function() {
  const n = /* @__PURE__ */ new Set();
  for (const i of h(this, Ne)) {
    const r = Sc(i);
    if (r.type === "id") {
      n.add(r.value);
      continue;
    }
    const a = as(i);
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
zl = /* @__PURE__ */ c(function() {
  var r, a;
  const n = C(this, me, Vl).call(this), i = ((r = canvas.tiles) == null ? void 0 : r.placeables) ?? [];
  for (const o of i) {
    const s = (a = o.document) == null ? void 0 : a.id;
    if (!s) continue;
    const l = n.has(s), u = o === h(this, Nn), d = zf(o);
    l && !u && !d ? lo(o, { mode: "selected" }) : !l && d && !u && tr(o);
  }
}, "#refreshSelectionHighlights"), // ── Apply / Cancel ──────────────────────────────────────────────────
Xf = /* @__PURE__ */ c(function() {
  var i;
  h(this, ze) && (vr(), L(this, ze, !1)), Pa();
  const n = [...h(this, Ne)];
  (i = h(this, ea)) == null || i.call(this, n), h(this, tt) && (h(this, tt).call(this, n), L(this, tt, null)), this.close({ force: !0 });
}, "#doApply"), Qf = /* @__PURE__ */ c(function() {
  var n;
  h(this, ze) && (vr(), L(this, ze, !1)), Pa(), (n = h(this, ta)) == null || n.call(this), h(this, tt) && (h(this, tt).call(this, null), L(this, tt, null)), this.close({ force: !0 });
}, "#doCancel"), c(mt, "PlaceablePickerApplication"), be(mt, "APP_ID", `${T}-placeable-picker`), be(mt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  He(mt, mt, "DEFAULT_OPTIONS"),
  {
    id: mt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Gu = He(mt, mt, "DEFAULT_OPTIONS")) == null ? void 0 : Gu.classes) ?? [], "eidolon-placeable-picker-window", "themed"])
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
)), be(mt, "PARTS", {
  content: {
    template: `modules/${T}/templates/placeable-picker.html`
  }
});
let co = mt;
function Eb(t, e) {
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
      const a = e.getEntryAtPath(e.selectedPath), o = ((d = (u = a == null ? void 0 : a.tweens) == null ? void 0 : u[i]) == null ? void 0 : d.target) ?? "", s = o ? [o] : [], l = await co.open({ selections: s });
      if (l && l.length > 0) {
        if (r.type === "timeline")
          e.mutate((m) => m.updateTween(r.index, i, { target: l[0] }));
        else if (r.type === "branch") {
          const m = (a.tweens ?? []).map((f, g) => g === i ? { ...f, target: l[0] } : f);
          e.mutate((f) => f.updateBranchEntry(r.index, r.branchIndex, r.branchEntryIndex, { tweens: m }));
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
          const l = qf[s], u = { type: s };
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
c(Eb, "bindTweenFieldEvents");
function Cb(t, e) {
  var i, r, a, o, s, l, u, d, m, f;
  function n(g, p, y) {
    g.type === "timeline" ? e.mutate((b) => b.updateEntry(g.index, { sound: y })) : g.type === "branch" && e.mutate((b) => b.updateBranchEntry(g.index, g.branchIndex, g.branchEntryIndex, { sound: y }));
  }
  c(n, "applySoundPatch"), (i = t.querySelector("[data-action='change-sound-src']")) == null || i.addEventListener("change", async (g) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = e.getEntryAtPath(e.selectedPath);
    if (!(y != null && y.sound)) return;
    const b = g.target.value, v = { ...y.sound, src: b };
    v.id || (v.id = Eu(b));
    const w = await Cu(b);
    w > 0 && (v.duration = w), n(p, y, v);
  }), (r = t.querySelector("[data-action='pick-sound-src']")) == null || r.addEventListener("click", () => {
    const g = e.parseEntryPath(e.selectedPath);
    if (!g) return;
    const p = e.getEntryAtPath(e.selectedPath);
    if (!(p != null && p.sound)) return;
    new FilePicker({
      type: "audio",
      current: p.sound.src || "",
      callback: /* @__PURE__ */ c(async (b) => {
        const v = { ...p.sound, src: b };
        v.id || (v.id = Eu(b));
        const w = await Cu(b);
        w > 0 && (v.duration = w), n(g, p, v);
      }, "callback")
    }).render(!0);
  }), (a = t.querySelector("[data-action='change-sound-id']")) == null || a.addEventListener("change", (g) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = e.getEntryAtPath(e.selectedPath);
    y != null && y.sound && n(p, y, { ...y.sound, id: g.target.value || void 0 });
  }), (o = t.querySelector("[data-action='change-sound-volume']")) == null || o.addEventListener("input", (g) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = e.getEntryAtPath(e.selectedPath);
    y != null && y.sound && n(p, y, { ...y.sound, volume: Number(g.target.value) || 0.8 });
  }), (s = t.querySelector("[data-action='change-sound-loop']")) == null || s.addEventListener("change", (g) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = e.getEntryAtPath(e.selectedPath);
    y != null && y.sound && n(p, y, { ...y.sound, loop: g.target.checked });
  }), (l = t.querySelector("[data-action='change-sound-fadein']")) == null || l.addEventListener("change", (g) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = e.getEntryAtPath(e.selectedPath);
    y != null && y.sound && n(p, y, { ...y.sound, fadeIn: Number(g.target.value) || void 0 });
  }), (u = t.querySelector("[data-action='change-sound-fadeout']")) == null || u.addEventListener("change", (g) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = e.getEntryAtPath(e.selectedPath);
    y != null && y.sound && n(p, y, { ...y.sound, fadeOut: Number(g.target.value) || void 0 });
  }), (d = t.querySelector("[data-action='change-sound-duration']")) == null || d.addEventListener("change", (g) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = e.getEntryAtPath(e.selectedPath);
    y != null && y.sound && n(p, y, { ...y.sound, duration: Number(g.target.value) || 0 });
  }), (m = t.querySelector("[data-action='change-sound-fireandforget']")) == null || m.addEventListener("change", (g) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = e.getEntryAtPath(e.selectedPath);
    y != null && y.sound && n(p, y, { ...y.sound, fireAndForget: g.target.checked });
  }), (f = t.querySelector("[data-action='change-stopsound-id']")) == null || f.addEventListener("change", (g) => {
    const p = e.parseEntryPath(e.selectedPath);
    p && (p.type === "timeline" ? e.mutate((y) => y.updateEntry(p.index, { stopSound: g.target.value })) : p.type === "branch" && e.mutate((y) => y.updateBranchEntry(p.index, p.branchIndex, p.branchEntryIndex, { stopSound: g.target.value })));
  });
}
c(Cb, "bindSoundFieldEvents");
function Sb(t, e) {
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
    hb({ selectedPath: e.selectedPath, state: e.state, mutate: e.mutate });
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
c(Sb, "bindSpecialEntryEvents");
function Tb(t, e) {
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
c(Tb, "bindSegmentGraphEvents");
function Lb(t, e) {
  var n, i, r, a, o, s, l;
  (n = t.querySelector("[data-action='change-gate-event']")) == null || n.addEventListener("change", (u) => {
    var m;
    const d = u.target.value;
    if (!d)
      e.setSegmentGate(null);
    else {
      const f = ((m = e.state.activeSegment) == null ? void 0 : m.gate) ?? {};
      e.setSegmentGate({ ...f, event: d });
    }
  }), (i = t.querySelector("[data-action='change-gate-target']")) == null || i.addEventListener("change", (u) => {
    var m;
    const d = (m = e.state.activeSegment) == null ? void 0 : m.gate;
    d && e.setSegmentGate({ ...d, target: u.target.value || void 0 });
  }), (r = t.querySelector("[data-action='pick-gate-target']")) == null || r.addEventListener("click", async () => {
    var m;
    const u = (m = e.state.activeSegment) == null ? void 0 : m.gate;
    if (!u) return;
    const { enterPickMode: d } = await Promise.resolve().then(() => wb);
    d({
      placeableType: "Tile",
      onPick: /* @__PURE__ */ c((f) => {
        var y, b;
        const g = (b = (y = f.flags) == null ? void 0 : y.tagger) == null ? void 0 : b.tags, p = g != null && g.length ? `tag:${g[0]}` : `id:${f.id}`;
        e.setSegmentGate({ ...u, target: p });
      }, "onPick")
    });
  });
  for (const [u, d] of [["change-gate-anim-idle", "idle"], ["change-gate-anim-hover", "hover"], ["change-gate-anim-dim", "dim"]])
    (a = t.querySelector(`[data-action='${u}']`)) == null || a.addEventListener("change", (m) => {
      var v;
      const f = (v = e.state.activeSegment) == null ? void 0 : v.gate;
      if (!f) return;
      const g = m.target.value.trim(), p = g ? g.split(",").map((w) => w.trim()).filter(Boolean) : void 0, y = { ...f.animation ?? {} };
      p != null && p.length ? y[d] = p.length === 1 ? p[0] : p : delete y[d];
      const b = { ...f, animation: Object.keys(y).length ? y : void 0 };
      b.animation || delete b.animation, e.setSegmentGate(b);
    });
  (o = t.querySelector("[data-action='change-segment-next']")) == null || o.addEventListener("change", (u) => {
    const d = u.target.value;
    e.setSegmentNext(d || null);
  }), (s = t.querySelector("[data-action='edit-segment-setup']")) == null || s.addEventListener("click", () => {
    ao("setup", { state: e.state, mutate: e.mutate });
  }), (l = t.querySelector("[data-action='edit-segment-landing']")) == null || l.addEventListener("click", () => {
    ao("landing", { state: e.state, mutate: e.mutate });
  });
}
c(Lb, "bindSegmentDetailEvents");
var Wu, Ge, W, nt, xn, Mt, it, We, Uo, De, rt, Vo, fn, Xi, pt, pi, $n, yi, U, Zf, em, tm, nm, Cn, Wl, Yl, Jl, Kl, im, Sn, Xl, rm, am, om, sm, lm, Ql, wr;
const It = class It extends Yn(Wn) {
  constructor(n = {}) {
    super(n);
    k(this, U);
    k(this, Ge, null);
    k(this, W, null);
    k(this, nt, null);
    k(this, xn, /* @__PURE__ */ new Set());
    k(this, Mt, !1);
    k(this, it, null);
    k(this, We, null);
    k(this, Uo, 120);
    k(this, De, []);
    k(this, rt, -1);
    k(this, Vo, 50);
    k(this, fn, null);
    k(this, Xi, null);
    k(this, pt, null);
    k(this, pi, null);
    k(this, $n, null);
    k(this, yi, null);
    L(this, Ge, n.scene ?? canvas.scene ?? null), L(this, W, Jt.fromScene(h(this, Ge)));
  }
  // ── Context ───────────────────────────────────────────────────────────
  async _prepareContext() {
    var g, p;
    const n = tb(h(this, W), h(this, W).activeSegmentName), i = Zy(h(this, W).timeline, {
      selectedPath: h(this, nt),
      windowWidth: ((g = this.position) == null ? void 0 : g.width) ?? 1100
    }), r = h(this, nt) != null ? fb(h(this, nt), { state: h(this, W), expandedTweens: h(this, xn) }) : null, a = h(this, W).listCinematicNames(), o = h(this, W).activeCinematicName, l = h(this, W).listSegmentNames().length > 1, u = h(this, W).activeSegment, d = (u == null ? void 0 : u.gate) ?? null, m = (u == null ? void 0 : u.next) ?? null, f = typeof m == "string" ? m : (m == null ? void 0 : m.segment) ?? null;
    return {
      // Toolbar
      sceneName: ((p = h(this, Ge)) == null ? void 0 : p.name) ?? "No scene",
      dirty: h(this, Mt),
      canUndo: h(this, U, Wl),
      canRedo: h(this, U, Yl),
      // Cinematic selector
      cinematicNames: a,
      activeCinematicName: o,
      cinematicOptions: a.map((y) => ({
        value: y,
        label: y,
        selected: y === o
      })),
      hasMultipleCinematics: a.length > 1,
      // Segment graph
      segmentGraph: n,
      activeSegmentName: h(this, W).activeSegmentName,
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
      activeSegmentSetupCount: Object.keys((u == null ? void 0 : u.setup) ?? {}).length,
      activeSegmentLandingCount: Object.keys((u == null ? void 0 : u.landing) ?? {}).length,
      // Footer
      trigger: h(this, W).trigger,
      tracking: h(this, W).tracking,
      synchronized: h(this, W).synchronized,
      triggerOptions: zy.map((y) => ({
        ...y,
        selected: y.value === h(this, W).trigger
      })),
      entryCount: h(this, W).timeline.length,
      totalDuration: i.totalDurationMs,
      targetCount: nb(h(this, W)),
      setupCount: Object.keys(h(this, W).setup ?? {}).length,
      landingCount: Object.keys(h(this, W).landing ?? {}).length
    };
  }
  // ── Render & Events ───────────────────────────────────────────────────
  _onRender(n, i) {
    var r, a, o;
    if (super._onRender(n, i), C(this, U, Zf).call(this), !h(this, pi)) {
      const s = (a = (r = game.modules.get(T)) == null ? void 0 : r.api) == null ? void 0 : a.cinematic;
      s != null && s.onPlaybackProgress ? (L(this, pi, s.onPlaybackProgress((l) => C(this, U, lm).call(this, l))), console.log("[cinematic-editor] Subscribed to playback progress events")) : console.warn("[cinematic-editor] onPlaybackProgress not available on API", s);
    }
    if (h(this, yi) && ((o = this.element) == null || o.querySelectorAll(".cinematic-editor__segment-node").forEach((s) => {
      s.classList.toggle("cinematic-editor__segment-node--playing", s.dataset.segmentName === h(this, yi));
    }), h(this, pt) && h(this, pt).segmentName === h(this, W).activeSegmentName)) {
      const s = performance.now() - h(this, pt).startTime;
      h(this, pt).durationMs - s > 0 && C(this, U, Ql).call(this, h(this, pt).durationMs, h(this, pt).startTime);
    }
    h(this, fn) || (L(this, fn, (s) => {
      !s.ctrlKey && !s.metaKey || (s.key === "z" && !s.shiftKey ? (s.preventDefault(), C(this, U, Jl).call(this)) : (s.key === "z" && s.shiftKey || s.key === "y") && (s.preventDefault(), C(this, U, Kl).call(this)));
    }), document.addEventListener("keydown", h(this, fn)));
  }
  async close(n = {}) {
    if (h(this, We) && C(this, U, Sn).call(this), h(this, Mt) && !n.force) {
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
      i === "save" && await C(this, U, Xl).call(this);
    }
    return super.close(n);
  }
  async _onClose(n) {
    var i;
    return h(this, it) !== null && (clearTimeout(h(this, it)), L(this, it, null)), h(this, fn) && (document.removeEventListener("keydown", h(this, fn)), L(this, fn, null)), (i = h(this, pi)) == null || i.call(this), L(this, pi, null), C(this, U, wr).call(this), super._onClose(n);
  }
};
Ge = new WeakMap(), W = new WeakMap(), nt = new WeakMap(), xn = new WeakMap(), Mt = new WeakMap(), it = new WeakMap(), We = new WeakMap(), Uo = new WeakMap(), De = new WeakMap(), rt = new WeakMap(), Vo = new WeakMap(), fn = new WeakMap(), Xi = new WeakMap(), pt = new WeakMap(), pi = new WeakMap(), $n = new WeakMap(), yi = new WeakMap(), U = new WeakSet(), // ── Event binding ─────────────────────────────────────────────────────
Zf = /* @__PURE__ */ c(function() {
  const n = this.element;
  if (!(n instanceof HTMLElement)) return;
  const i = C(this, U, em).call(this);
  gb(n, i), pb(n, i), Tb(n, i), yb(n, i), bb(n, i), Eb(n, i), Cb(n, i), Sb(n, i), Lb(n, i);
}, "#bindEvents"), em = /* @__PURE__ */ c(function() {
  const n = this;
  return {
    // State access (read-only getters — closures over `self` for private field access)
    get state() {
      return h(n, W);
    },
    get selectedPath() {
      return h(n, nt);
    },
    get scene() {
      return h(n, Ge);
    },
    get expandedTweens() {
      return h(n, xn);
    },
    get insertMenuState() {
      return h(n, Xi);
    },
    // Mutations
    mutate: /* @__PURE__ */ c((i) => C(this, U, Cn).call(this, i), "mutate"),
    setSelectedPath: /* @__PURE__ */ c((i) => {
      L(this, nt, i), this.render({ force: !0 });
    }, "setSelectedPath"),
    render: /* @__PURE__ */ c(() => this.render({ force: !0 }), "render"),
    // Cinematic switching (needs full state swap + clear)
    switchCinematic: /* @__PURE__ */ c((i) => {
      h(this, We) && C(this, U, Sn).call(this), L(this, W, h(this, W).switchCinematic(i)), L(this, nt, null), h(this, xn).clear(), this.render({ force: !0 });
    }, "switchCinematic"),
    // Segment management
    selectSegment: /* @__PURE__ */ c((i) => {
      h(this, We) && C(this, U, Sn).call(this), L(this, W, h(this, W).switchSegment(i)), L(this, nt, null), h(this, xn).clear(), this.render({ force: !0 });
    }, "selectSegment"),
    addSegment: /* @__PURE__ */ c((i) => {
      C(this, U, Cn).call(this, (r) => r.addSegment(i, r.activeSegmentName));
    }, "addSegment"),
    removeSegment: /* @__PURE__ */ c((i) => {
      C(this, U, Cn).call(this, (r) => r.removeSegment(i));
    }, "removeSegment"),
    renameSegment: /* @__PURE__ */ c((i, r) => {
      C(this, U, Cn).call(this, (a) => a.renameSegment(i, r));
    }, "renameSegment"),
    setSegmentGate: /* @__PURE__ */ c((i) => {
      C(this, U, Cn).call(this, (r) => r.setSegmentGate(i));
    }, "setSegmentGate"),
    setSegmentNext: /* @__PURE__ */ c((i) => {
      C(this, U, Cn).call(this, (r) => r.setSegmentNext(i));
    }, "setSegmentNext"),
    // Tween debouncing
    queueTweenChange: /* @__PURE__ */ c((i, r) => C(this, U, im).call(this, i, r), "queueTweenChange"),
    flushTweenChanges: /* @__PURE__ */ c(() => {
      h(this, We) && C(this, U, Sn).call(this);
    }, "flushTweenChanges"),
    flushTweenChangesImmediate: /* @__PURE__ */ c(() => {
      h(this, it) !== null && clearTimeout(h(this, it)), L(this, it, null), C(this, U, Sn).call(this);
    }, "flushTweenChangesImmediate"),
    // Path utilities
    parseEntryPath: Vn,
    getEntryAtPath: /* @__PURE__ */ c((i) => ro(i, h(this, W)), "getEntryAtPath"),
    // Insert menu
    showInsertMenu: /* @__PURE__ */ c((i, r, a) => C(this, U, tm).call(this, i, r, a), "showInsertMenu"),
    hideInsertMenu: /* @__PURE__ */ c(() => C(this, U, nm).call(this), "hideInsertMenu"),
    // Toolbar actions
    save: /* @__PURE__ */ c(() => C(this, U, Xl).call(this), "save"),
    play: /* @__PURE__ */ c(() => C(this, U, rm).call(this), "play"),
    resetTracking: /* @__PURE__ */ c(() => C(this, U, am).call(this), "resetTracking"),
    exportJSON: /* @__PURE__ */ c(() => C(this, U, om).call(this), "exportJSON"),
    validate: /* @__PURE__ */ c(() => C(this, U, sm).call(this), "validate"),
    importJSON: /* @__PURE__ */ c(() => mb({ state: h(this, W), mutate: /* @__PURE__ */ c((i) => C(this, U, Cn).call(this, i), "mutate") }), "importJSON"),
    undo: /* @__PURE__ */ c(() => C(this, U, Jl).call(this), "undo"),
    redo: /* @__PURE__ */ c(() => C(this, U, Kl).call(this), "redo")
  };
}, "#createEventContext"), // ── Insert menu ───────────────────────────────────────────────────────
tm = /* @__PURE__ */ c(function(n, i, r) {
  var l;
  const a = (l = this.element) == null ? void 0 : l.querySelector(".cinematic-editor__insert-menu");
  if (!a) return;
  const o = n.getBoundingClientRect();
  document.body.appendChild(a), a.style.display = "", a.style.position = "fixed", a.style.left = `${o.left}px`;
  const s = a.offsetHeight || 200;
  o.bottom + 4 + s > window.innerHeight ? a.style.top = `${o.top - s - 4}px` : a.style.top = `${o.bottom + 4}px`, L(this, Xi, { insertIndex: i, lane: r });
}, "#showInsertMenu"), nm = /* @__PURE__ */ c(function() {
  var i, r;
  const n = document.body.querySelector(".cinematic-editor__insert-menu") ?? ((i = this.element) == null ? void 0 : i.querySelector(".cinematic-editor__insert-menu"));
  if (n) {
    n.style.display = "none";
    const a = (r = this.element) == null ? void 0 : r.querySelector(".cinematic-editor");
    a && n.parentNode !== a && a.appendChild(n);
  }
  L(this, Xi, null);
}, "#hideInsertMenu"), // ── State mutation ────────────────────────────────────────────────────
Cn = /* @__PURE__ */ c(function(n) {
  L(this, De, h(this, De).slice(0, h(this, rt) + 1)), h(this, De).push(h(this, W)), h(this, De).length > h(this, Vo) && h(this, De).shift(), L(this, rt, h(this, De).length - 1), L(this, W, n(h(this, W))), L(this, Mt, !0), this.render({ force: !0 });
}, "#mutate"), Wl = /* @__PURE__ */ c(function() {
  return h(this, rt) >= 0;
}, "#canUndo"), Yl = /* @__PURE__ */ c(function() {
  return h(this, rt) < h(this, De).length - 1;
}, "#canRedo"), Jl = /* @__PURE__ */ c(function() {
  h(this, U, Wl) && (h(this, rt) === h(this, De).length - 1 && h(this, De).push(h(this, W)), L(this, W, h(this, De)[h(this, rt)]), ds(this, rt)._--, L(this, Mt, !0), this.render({ force: !0 }));
}, "#undo"), Kl = /* @__PURE__ */ c(function() {
  h(this, U, Yl) && (ds(this, rt)._++, L(this, W, h(this, De)[h(this, rt) + 1]), L(this, Mt, !0), this.render({ force: !0 }));
}, "#redo"), im = /* @__PURE__ */ c(function(n, i) {
  var r;
  h(this, nt) != null && (L(this, We, {
    ...h(this, We) ?? {},
    entryPath: h(this, nt),
    tweenIndex: n,
    patch: { ...((r = h(this, We)) == null ? void 0 : r.patch) ?? {}, ...i }
  }), h(this, it) !== null && clearTimeout(h(this, it)), L(this, it, setTimeout(() => {
    L(this, it, null), C(this, U, Sn).call(this);
  }, h(this, Uo))));
}, "#queueTweenChange"), Sn = /* @__PURE__ */ c(function() {
  if (!h(this, We)) return;
  const { entryPath: n, tweenIndex: i, patch: r } = h(this, We);
  L(this, We, null);
  const a = Vn(n);
  if (a) {
    if (a.type === "timeline")
      L(this, W, h(this, W).updateTween(a.index, i, r));
    else if (a.type === "branch") {
      const o = ro(n, h(this, W));
      if (o) {
        const s = (o.tweens ?? []).map((l, u) => u === i ? { ...l, ...r } : l);
        L(this, W, h(this, W).updateBranchEntry(a.index, a.branchIndex, a.branchEntryIndex, { tweens: s }));
      }
    }
    L(this, Mt, !0);
  }
}, "#flushTweenChanges"), Xl = /* @__PURE__ */ c(async function() {
  var n, i, r, a, o, s;
  if (h(this, Ge)) {
    if (h(this, We) && C(this, U, Sn).call(this), h(this, W).isStale(h(this, Ge))) {
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
        L(this, W, Jt.fromScene(h(this, Ge), h(this, W).activeCinematicName)), L(this, Mt, !1), L(this, De, []), L(this, rt, -1), this.render({ force: !0 }), (i = (n = ui.notifications) == null ? void 0 : n.info) == null || i.call(n, "Cinematic reloaded from scene.");
        return;
      }
      if (!l) return;
    }
    try {
      await h(this, W).save(h(this, Ge)), L(this, W, Jt.fromScene(h(this, Ge), h(this, W).activeCinematicName)), L(this, Mt, !1), (a = (r = ui.notifications) == null ? void 0 : r.info) == null || a.call(r, "Cinematic saved."), this.render({ force: !0 });
    } catch (l) {
      console.error(`${T} | Cinematic save failed`, l), (s = (o = ui.notifications) == null ? void 0 : o.error) == null || s.call(o, "Failed to save cinematic data.");
    }
  }
}, "#onSave"), rm = /* @__PURE__ */ c(async function() {
  var i, r, a, o, s;
  const n = (r = (i = game.modules.get(T)) == null ? void 0 : i.api) == null ? void 0 : r.cinematic;
  if (!(n != null && n.play)) {
    (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, "Cinematic API not available.");
    return;
  }
  await n.play((s = h(this, Ge)) == null ? void 0 : s.id, h(this, W).activeCinematicName);
}, "#onPlay"), am = /* @__PURE__ */ c(async function() {
  var i, r, a, o, s;
  const n = (r = (i = game.modules.get(T)) == null ? void 0 : i.api) == null ? void 0 : r.cinematic;
  n != null && n.reset && (await n.reset((a = h(this, Ge)) == null ? void 0 : a.id, h(this, W).activeCinematicName), (s = (o = ui.notifications) == null ? void 0 : o.info) == null || s.call(o, "Cinematic tracking reset."));
}, "#onResetTracking"), om = /* @__PURE__ */ c(async function() {
  var i, r;
  const n = JSON.stringify(h(this, W).toJSON(), null, 2);
  try {
    await navigator.clipboard.writeText(n), (r = (i = ui.notifications) == null ? void 0 : i.info) == null || r.call(i, "Cinematic JSON copied to clipboard.");
  } catch {
    new Dialog({
      title: "Cinematic JSON",
      content: `<textarea style="width:100%;height:300px;font-family:monospace;font-size:0.8rem">${Pt(n)}</textarea>`,
      buttons: { ok: { label: "Close" } }
    }).render(!0);
  }
}, "#onExportJSON"), sm = /* @__PURE__ */ c(function() {
  var l, u;
  const n = h(this, W).toJSON(), { targets: i, unresolved: r } = io(n), a = Vy(n, i), o = [
    ...r.map((d) => ({ path: "targets", level: "warn", message: `Unresolved target: "${d}"` })),
    ...a
  ];
  if (o.length === 0) {
    (u = (l = ui.notifications) == null ? void 0 : l.info) == null || u.call(l, "Cinematic validation passed — no issues found.");
    return;
  }
  const s = o.map((d) => {
    const m = d.level === "error" ? "fa-circle-xmark" : "fa-triangle-exclamation", f = d.level === "error" ? "#e74c3c" : "#f39c12";
    return `<li style="margin:0.3rem 0"><i class="fa-solid ${m}" style="color:${f};margin-right:0.3rem"></i><strong>${Pt(d.path)}</strong>: ${Pt(d.message)}</li>`;
  });
  new Dialog({
    title: "Cinematic Validation",
    content: `<p>${o.length} issue(s) found:</p><ul style="list-style:none;padding:0;max-height:300px;overflow:auto">${s.join("")}</ul>`,
    buttons: { ok: { label: "Close" } }
  }).render(!0);
}, "#onValidate"), // ── Playback progress ────────────────────────────────────────────────
lm = /* @__PURE__ */ c(function(n) {
  var i, r, a, o, s, l;
  switch (console.log(`[cinematic-editor] playback event: ${n.type}`, n), n.type) {
    case "segment-start":
      L(this, yi, n.segmentName), n.segmentName !== h(this, W).activeSegmentName ? (L(this, W, h(this, W).switchSegment(n.segmentName)), L(this, nt, null), h(this, xn).clear(), this.render({ force: !0 })) : (i = this.element) == null || i.querySelectorAll(".cinematic-editor__segment-node").forEach((u) => {
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
      L(this, pt, { segmentName: n.segmentName, startTime: performance.now(), durationMs: n.durationMs }), n.segmentName === h(this, W).activeSegmentName && C(this, U, Ql).call(this, n.durationMs);
      break;
    case "timeline-end":
      C(this, U, wr).call(this), L(this, pt, null);
      break;
    case "playback-end":
      C(this, U, wr).call(this), L(this, pt, null), L(this, yi, null), (l = this.element) == null || l.querySelectorAll(".cinematic-editor__segment-node--playing, .cinematic-editor__segment-node--gate-waiting").forEach((u) => {
        u.classList.remove("cinematic-editor__segment-node--playing", "cinematic-editor__segment-node--gate-waiting");
      });
      break;
  }
}, "#onPlaybackEvent"), Ql = /* @__PURE__ */ c(function(n, i = null) {
  var u, d;
  C(this, U, wr).call(this);
  const r = (u = this.element) == null ? void 0 : u.querySelector(".cinematic-editor__playback-cursor"), a = (d = this.element) == null ? void 0 : d.querySelector(".cinematic-editor__swimlane");
  if (console.log(`[cinematic-editor] startCursor: duration=${n}, cursor=${!!r}, swimlane=${!!a}, width=${a == null ? void 0 : a.scrollWidth}`), !r || !a || n <= 0) return;
  r.style.display = "block";
  const o = i ?? performance.now(), s = a.scrollWidth, l = /* @__PURE__ */ c(() => {
    const m = performance.now() - o, f = Math.min(m / n, 1), g = Dr + f * (s - Dr);
    r.style.left = `${g}px`, f < 1 && L(this, $n, requestAnimationFrame(l));
  }, "tick");
  L(this, $n, requestAnimationFrame(l));
}, "#startCursorAnimation"), wr = /* @__PURE__ */ c(function() {
  var i;
  h(this, $n) && (cancelAnimationFrame(h(this, $n)), L(this, $n, null));
  const n = (i = this.element) == null ? void 0 : i.querySelector(".cinematic-editor__playback-cursor");
  n && (n.style.display = "none");
}, "#stopCursorAnimation"), c(It, "CinematicEditorApplication"), be(It, "APP_ID", `${T}-cinematic-editor`), be(It, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  He(It, It, "DEFAULT_OPTIONS"),
  {
    id: It.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Wu = He(It, It, "DEFAULT_OPTIONS")) == null ? void 0 : Wu.classes) ?? [], "eidolon-cinematic-editor-window", "themed"])
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
)), be(It, "PARTS", {
  content: {
    template: `modules/${T}/templates/cinematic-editor.html`
  }
});
let Gl = It;
const cm = /* @__PURE__ */ new Map();
function he(t, e) {
  cm.set(t, e);
}
c(he, "registerBehaviour");
function Ra(t) {
  return cm.get(t);
}
c(Ra, "getBehaviour");
function ce(t) {
  return t.mesh ? t.mesh : t.destroyed || !t.transform ? null : t;
}
c(ce, "getAnimationTarget");
function Ib(t, e, n) {
  let i, r, a;
  if (e === 0)
    i = r = a = n;
  else {
    const o = /* @__PURE__ */ c((u, d, m) => (m < 0 && (m += 1), m > 1 && (m -= 1), m < 0.16666666666666666 ? u + (d - u) * 6 * m : m < 0.5 ? d : m < 0.6666666666666666 ? u + (d - u) * (0.6666666666666666 - m) * 6 : u), "hue2rgb"), s = n < 0.5 ? n * (1 + e) : n + e - n * e, l = 2 * n - s;
    i = o(l, s, t + 1 / 3), r = o(l, s, t), a = o(l, s, t - 1 / 3);
  }
  return Math.round(i * 255) << 16 | Math.round(r * 255) << 8 | Math.round(a * 255);
}
c(Ib, "hslToInt");
he("float", (t, e = {}) => {
  const n = ce(t);
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
he("pulse", (t, e = {}) => {
  const n = ce(t);
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
he("scale", (t, e = {}) => {
  const n = ce(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.factor ?? 1.12, r = e.durationFrames ?? 15, a = ot(e.easing ?? "easeOutCubic"), o = n.scale.x, s = n.scale.y, l = o * i, u = s * i;
  let d = 0;
  return {
    update(m) {
      if (d < r) {
        d += m;
        const f = Math.min(d / r, 1), g = a(f);
        n.scale.x = o + (l - o) * g, n.scale.y = s + (u - s) * g;
      }
    },
    detach() {
      n.scale.x = o, n.scale.y = s;
    }
  };
});
he("glow", (t, e = {}) => {
  var y, b;
  const n = ce(t);
  if (!((y = n == null ? void 0 : n.texture) != null && y.baseTexture)) return { update() {
  }, detach() {
  } };
  const i = t.document, r = e.color ?? 4513279, a = e.alpha ?? 0.5, o = e.blur ?? 8, s = e.pulseSpeed ?? 0.03, l = Math.abs(i.width), u = Math.abs(i.height), d = PIXI.Sprite.from(n.texture);
  d.anchor.set(0.5, 0.5), d.scale.set(n.scale.x, n.scale.y), d.position.set(l / 2, u / 2), d.angle = i.rotation ?? 0, d.alpha = a, d.tint = r;
  const m = PIXI.BlurFilter ?? ((b = PIXI.filters) == null ? void 0 : b.BlurFilter), f = new m(o);
  d.filters = [f], t.addChildAt(d, 0);
  const g = n.angle;
  let p = 0;
  return {
    update(v) {
      p += v;
      const w = (Math.sin(p * s) + 1) / 2;
      d.visible = n.visible !== !1, d.alpha = a * (0.5 + 0.5 * w) * (n.alpha ?? 1), d.scale.set(n.scale.x, n.scale.y), d.angle = (i.rotation ?? 0) + (n.angle - g);
    },
    detach() {
      d.parent && d.parent.removeChild(d), d.destroy({ children: !0 });
    }
  };
});
he("wobble", (t, e = {}) => {
  const n = ce(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.speed ?? 0.15, r = e.angle ?? 2.5, a = n.angle;
  let o = 0;
  return {
    update(s) {
      o += s, n.angle = a + Math.sin(o * i) * r;
    },
    detach() {
      n.angle = a;
    }
  };
});
he("colorCycle", (t, e = {}) => {
  const n = ce(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.speed ?? 5e-3, r = e.saturation ?? 0.6, a = e.lightness ?? 0.6, o = n.tint;
  let s = 0;
  return {
    update(l) {
      s = (s + l * i) % 1, n.tint = Ib(s, r, a);
    },
    detach() {
      n.tint = o;
    }
  };
});
he("spin", (t, e = {}) => {
  const n = ce(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.speed ?? 0.5, r = n.angle;
  let a = 0;
  return {
    update(o) {
      a += o, n.angle = r + a * i;
    },
    detach() {
      n.angle = r;
    }
  };
});
he("bounce", (t, e = {}) => {
  const n = ce(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.speed ?? 0.02, r = e.amplitude ?? 6, a = ot("easeOutBounce"), o = n.position.y;
  let s = 0;
  return {
    update(l) {
      s += l;
      const u = Math.abs(s * i % 2 - 1);
      n.position.y = o + a(u) * r;
    },
    detach() {
      n.position.y = o;
    }
  };
});
he("borderTrace", (t, e = {}) => {
  const n = ce(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), a = Math.abs(i.height), o = 2 * (r + a), s = e.speed ?? 1.5, l = e.length ?? 60, u = e.color ?? 4513279, d = e.alpha ?? 0.8, m = e.lineWidth ?? 2, f = new PIXI.Graphics();
  f.alpha = d, f.pivot.set(r / 2, a / 2), f.position.set(r / 2, a / 2), t.addChildAt(f, 0);
  const g = n.scale.x, p = n.scale.y, y = n.angle;
  let b = 0;
  function v(w) {
    return w = (w % o + o) % o, w < r ? { x: w, y: 0 } : (w -= r, w < a ? { x: r, y: w } : (w -= a, w < r ? { x: r - w, y: a } : (w -= r, { x: 0, y: a - w })));
  }
  return c(v, "perimeterPoint"), {
    update(w) {
      b = (b + w * s) % o, f.visible = n.visible !== !1, f.alpha = d * (n.alpha ?? 1), f.scale.set(n.scale.x / g, n.scale.y / p), f.angle = n.angle - y, f.clear(), f.lineStyle(m, u, 1);
      const S = 16, I = l / S, A = v(b);
      f.moveTo(A.x, A.y);
      for (let O = 1; O <= S; O++) {
        const x = v(b + O * I);
        f.lineTo(x.x, x.y);
      }
    },
    detach() {
      f.parent && f.parent.removeChild(f), f.destroy({ children: !0 });
    }
  };
});
he("shimmer", (t, e = {}) => {
  const n = ce(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), a = Math.abs(i.height), o = e.speed ?? 1, s = e.bandWidth ?? 40, l = e.alpha ?? 0.15, u = e.pause ?? 120, d = r + a + s, m = d + u * o, f = new PIXI.Container();
  f.pivot.set(r / 2, a / 2), f.position.set(r / 2, a / 2);
  const g = new PIXI.Graphics();
  g.alpha = l;
  const p = new PIXI.Graphics();
  p.beginFill(16777215), p.drawRect(0, 0, r, a), p.endFill(), f.addChild(p), g.mask = p, f.addChild(g), t.addChild(f);
  const y = n.scale.x, b = n.scale.y, v = n.angle;
  let w = 0;
  return {
    update(S) {
      if (w = (w + S * o) % m, f.visible = n.visible !== !1, f.scale.set(n.scale.x / y, n.scale.y / b), f.angle = n.angle - v, g.alpha = l * (n.alpha ?? 1), g.clear(), w < d) {
        const I = w - s;
        g.beginFill(16777215, 1), g.moveTo(I, 0), g.lineTo(I + s, 0), g.lineTo(I + s - a, a), g.lineTo(I - a, a), g.closePath(), g.endFill();
      }
    },
    detach() {
      g.mask = null, f.parent && f.parent.removeChild(f), f.destroy({ children: !0 });
    }
  };
});
he("breathe", (t, e = {}) => {
  const n = ce(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.factor ?? 1.03, r = e.speed ?? 0.02, a = n.scale.x, o = n.scale.y;
  let s = 0;
  return {
    update(l) {
      s += l;
      const u = Math.sin(s * r);
      n.scale.x = a * (1 + (i - 1) * u), n.scale.y = o * (1 + (i - 1) * u);
    },
    detach() {
      n.scale.x = a, n.scale.y = o;
    }
  };
});
he("tiltFollow", (t, e = {}) => {
  const n = ce(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.maxAngle ?? 3, r = e.smoothing ?? 0.15, a = t.document, o = n.angle;
  let s = 0;
  return {
    update() {
      const l = canvas.mousePosition;
      if (!l) return;
      const u = Math.abs(a.width), d = a.x + u / 2, m = l.x - d, f = Math.max(-i, Math.min(i, m / (u / 2) * i));
      s += (f - s) * r, n.angle = o + s;
    },
    detach() {
      n.angle = o;
    }
  };
});
he("slideReveal", (t, e = {}, n) => {
  const i = ce(t);
  if (!i) return { update() {
  }, detach() {
  } };
  if (n) return { update() {
  }, detach() {
  } };
  const r = e.offsetX ?? 0, a = e.offsetY ?? 20, o = e.durationFrames ?? 20, s = ot(e.easing ?? "easeOutCubic"), l = e.delay ?? 0, u = i.position.x, d = i.position.y, m = i.alpha;
  i.position.x = u + r, i.position.y = d + a, i.alpha = 0;
  let f = -l;
  return {
    update(g) {
      if (f += g, f < 0) return;
      if (f >= o) {
        i.position.x = u, i.position.y = d, i.alpha = m;
        return;
      }
      const p = Math.min(f / o, 1), y = s(p);
      i.position.x = u + r * (1 - y), i.position.y = d + a * (1 - y), i.alpha = m * y;
    },
    detach() {
      i.position.x = u, i.position.y = d, i.alpha = m;
    }
  };
});
he("embers", (t, e = {}) => {
  const n = ce(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), a = Math.abs(i.height), o = e.count ?? 12, s = e.speed ?? 0.5, l = e.color ?? 16737792, u = e.alpha ?? 0.6, d = e.size ?? 2, m = new PIXI.Container();
  m.pivot.set(r / 2, a / 2), m.position.set(r / 2, a / 2);
  const f = new PIXI.Graphics();
  m.addChild(f), t.addChild(m);
  const g = n.scale.x, p = n.scale.y, y = n.angle, b = [];
  function v() {
    const w = Math.random();
    let S, I;
    return w < 0.7 ? (S = Math.random() * r, I = a) : w < 0.85 ? (S = 0, I = a * 0.5 + Math.random() * a * 0.5) : (S = r, I = a * 0.5 + Math.random() * a * 0.5), {
      x: S,
      y: I,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -s * (0.5 + Math.random() * 0.5),
      life: 0,
      maxLife: 40 + Math.random() * 60,
      size: d * (0.5 + Math.random() * 0.5)
    };
  }
  return c(v, "spawnParticle"), {
    update(w) {
      m.visible = n.visible !== !1, m.scale.set(n.scale.x / g, n.scale.y / p), m.angle = n.angle - y, b.length < o && b.push(v());
      for (let S = b.length - 1; S >= 0; S--) {
        const I = b[S];
        if (I.life += w, I.life >= I.maxLife) {
          b.splice(S, 1);
          continue;
        }
        I.x += I.vx * w, I.y += I.vy * w, I.vx += (Math.random() - 0.5) * 0.05 * w;
      }
      f.clear();
      for (const S of b) {
        const I = 1 - S.life / S.maxLife;
        f.beginFill(l, u * I * (n.alpha ?? 1)), f.drawCircle(S.x, S.y, S.size), f.endFill();
      }
    },
    detach() {
      m.parent && m.parent.removeChild(m), m.destroy({ children: !0 });
    }
  };
});
he("runeGlow", (t, e = {}) => {
  const n = ce(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), a = Math.abs(i.height), o = 2 * (r + a), s = e.dots ?? 3, l = e.speed ?? 1.2, u = e.color ?? 4513279, d = e.color2 ?? 8930559, m = e.radius ?? 3, f = e.alpha ?? 0.7, g = new PIXI.Graphics();
  g.pivot.set(r / 2, a / 2), g.position.set(r / 2, a / 2), t.addChildAt(g, 0);
  const p = n.scale.x, y = n.scale.y, b = n.angle, v = [];
  for (let I = 0; I < s; I++)
    v.push({
      phase: I / s * o,
      speedMul: 0.7 + Math.random() * 0.6,
      color: I % 2 === 0 ? u : d
    });
  function w(I) {
    return I = (I % o + o) % o, I < r ? { x: I, y: 0 } : (I -= r, I < a ? { x: r, y: I } : (I -= a, I < r ? { x: r - I, y: a } : (I -= r, { x: 0, y: a - I })));
  }
  c(w, "perimeterPoint");
  let S = 0;
  return {
    update(I) {
      S += I, g.visible = n.visible !== !1, g.alpha = f * (n.alpha ?? 1), g.scale.set(n.scale.x / p, n.scale.y / y), g.angle = n.angle - b, g.clear();
      for (const A of v) {
        const O = w(A.phase + S * l * A.speedMul);
        g.beginFill(A.color, 1), g.drawCircle(O.x, O.y, m), g.endFill();
      }
    },
    detach() {
      g.parent && g.parent.removeChild(g), g.destroy({ children: !0 });
    }
  };
});
he("ripple", (t, e = {}) => {
  const n = ce(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), a = Math.abs(i.height), o = e.maxRadius ?? Math.sqrt(r * r + a * a) / 2, s = e.rings ?? 3, l = e.interval ?? 30, u = e.speed ?? 1.5, d = e.color ?? 4513279, m = e.alpha ?? 0.4, f = e.lineWidth ?? 1.5, g = new PIXI.Container();
  g.pivot.set(r / 2, a / 2), g.position.set(r / 2, a / 2);
  const p = new PIXI.Graphics();
  g.addChild(p), t.addChild(g);
  const y = n.scale.x, b = n.scale.y, v = n.angle, w = [];
  let S = 0, I = 0;
  return {
    update(A) {
      S += A, g.visible = n.visible !== !1, g.scale.set(n.scale.x / y, n.scale.y / b), g.angle = n.angle - v, S >= I && w.length < s && (w.push({ radius: 0, alpha: m }), I = S + l);
      for (let M = w.length - 1; M >= 0; M--) {
        const D = w[M];
        D.radius += u * A, D.alpha = m * (1 - D.radius / o), D.radius >= o && w.splice(M, 1);
      }
      p.clear();
      const O = r / 2, x = a / 2;
      for (const M of w)
        p.lineStyle(f, d, M.alpha * (n.alpha ?? 1)), p.drawCircle(O, x, M.radius);
    },
    detach() {
      g.parent && g.parent.removeChild(g), g.destroy({ children: !0 });
    }
  };
});
he("frostEdge", (t, e = {}) => {
  const n = ce(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), a = Math.abs(i.height), o = e.segments ?? 20, s = e.maxLength ?? 15, l = e.color ?? 11197951, u = e.alpha ?? 0.5, d = e.growSpeed ?? 0.02, m = new PIXI.Container();
  m.pivot.set(r / 2, a / 2), m.position.set(r / 2, a / 2);
  const f = new PIXI.Graphics(), g = new PIXI.Graphics();
  g.beginFill(16777215), g.drawRect(0, 0, r, a), g.endFill(), m.addChild(g), f.mask = g, m.addChild(f), t.addChild(m);
  const p = n.scale.x, y = n.scale.y, b = n.angle, v = [];
  for (let I = 0; I < o; I++) {
    const A = Math.floor(Math.random() * 4);
    let O, x, M;
    switch (A) {
      case 0:
        O = Math.random() * r, x = 0, M = Math.PI / 2 + (Math.random() - 0.5) * 0.6;
        break;
      case 1:
        O = r, x = Math.random() * a, M = Math.PI + (Math.random() - 0.5) * 0.6;
        break;
      case 2:
        O = Math.random() * r, x = a, M = -Math.PI / 2 + (Math.random() - 0.5) * 0.6;
        break;
      default:
        O = 0, x = Math.random() * a, M = (Math.random() - 0.5) * 0.6;
        break;
    }
    v.push({ sx: O, sy: x, angle: M, targetLength: s * (0.4 + Math.random() * 0.6), currentLength: 0, grown: !1 });
  }
  let w = !1, S = 0;
  return {
    update(I) {
      if (m.visible = n.visible !== !1, m.scale.set(n.scale.x / p, n.scale.y / y), m.angle = n.angle - b, w)
        S += I * 0.03;
      else {
        w = !0;
        for (const O of v)
          O.grown || (O.currentLength += (O.targetLength - O.currentLength) * d * I, O.currentLength >= O.targetLength * 0.99 ? (O.currentLength = O.targetLength, O.grown = !0) : w = !1);
      }
      const A = w ? u * (0.7 + 0.3 * Math.sin(S)) : u;
      f.clear(), f.lineStyle(1.5, l, A * (n.alpha ?? 1));
      for (const O of v)
        O.currentLength <= 0 || (f.moveTo(O.sx, O.sy), f.lineTo(O.sx + Math.cos(O.angle) * O.currentLength, O.sy + Math.sin(O.angle) * O.currentLength));
    },
    detach() {
      f.mask = null, m.parent && m.parent.removeChild(m), m.destroy({ children: !0 });
    }
  };
});
he("shadowLift", (t, e = {}) => {
  var g, p, y;
  const n = ce(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = PIXI.DropShadowFilter ?? ((g = PIXI.filters) == null ? void 0 : g.DropShadowFilter) ?? ((y = (p = globalThis.PIXI) == null ? void 0 : p.filters) == null ? void 0 : y.DropShadowFilter);
  if (!i)
    return console.warn("shadowLift: DropShadowFilter not available in this PIXI build"), { update() {
    }, detach() {
    } };
  const r = e.offsetY ?? 6, a = e.blur ?? 6, o = e.alpha ?? 0.35, s = e.color ?? 0, l = e.durationFrames ?? 12, u = ot(e.easing ?? "easeOutCubic"), d = new i();
  d.blur = a, d.alpha = 0, d.color = s, d.quality = 3, d.distance = 0, d.rotation = 90;
  const m = n.filters ? [...n.filters] : [];
  n.filters = [...m, d];
  let f = 0;
  return {
    update(b) {
      if (f < l) {
        f += b;
        const v = Math.min(f / l, 1), w = u(v);
        d.distance = r * w, d.alpha = o * w;
      }
    },
    detach() {
      n.filters && (n.filters = n.filters.filter((b) => b !== d), n.filters.length === 0 && (n.filters = null)), d.destroy();
    }
  };
});
he("none", () => ({ update() {
}, detach() {
} }));
he("tween-prop", (t, e = {}) => {
  const n = ce(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.attribute ?? "alpha", r = e.from ?? 0.85, a = e.to ?? 1, o = e.period ?? 1500, s = ot(e.easing ?? "easeInOutCosine"), u = { alpha: "alpha", rotation: "angle" }[i] ?? i, d = n[u];
  let m = 0;
  return {
    update(f) {
      m += f;
      const g = o / 16.667, p = Math.abs(m / g % 2 - 1), y = s(p);
      n[u] = r + (a - r) * y;
    },
    detach() {
      n[u] = d;
    }
  };
});
he("tween-tint", (t, e = {}) => {
  const n = ce(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.fromColor ?? "#ffffff", r = e.toColor ?? "#ffcc88", a = e.mode ?? "oklch", o = e.period ?? 3e3, s = ot(e.easing ?? "easeInOutCosine"), l = wc(a), u = foundry.utils.Color, d = u.from(i), m = u.from(r), f = n.tint;
  let g = 0;
  return {
    update(p) {
      g += p;
      const y = o / 16.667, b = Math.abs(g / y % 2 - 1), v = s(b), w = l(d, m, v);
      n.tint = u.from(w).valueOf();
    },
    detach() {
      n.tint = f;
    }
  };
});
he("tween-scale", (t, e = {}) => {
  const n = ce(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.fromScale ?? 0.95, r = e.toScale ?? 1.05, a = e.period ?? 2e3, o = ot(e.easing ?? "easeInOutCosine"), s = n.scale.x, l = n.scale.y;
  let u = 0;
  return {
    update(d) {
      u += d;
      const m = a / 16.667, f = Math.abs(u / m % 2 - 1), g = o(f), p = i + (r - i) * g;
      n.scale.set(s * p, l * p);
    },
    detach() {
      n.scale.set(s, l);
    }
  };
});
const dr = {
  always: [],
  idle: ["float", "glow"],
  hover: ["scale"],
  dim: ["none"]
};
function Ob(t) {
  if (!t) return { ...dr };
  const e = /* @__PURE__ */ c((n, i) => n === void 0 ? i : typeof n == "string" ? [n] : typeof n == "object" && !Array.isArray(n) && n.name ? [n] : Array.isArray(n) ? n : i, "normalize");
  return {
    always: e(t.always, dr.always),
    idle: e(t.idle, dr.idle),
    hover: e(t.hover, dr.hover),
    dim: e(t.dim, dr.dim)
  };
}
c(Ob, "normalizeConfig");
var Ee, _t, at, Nt, Fn, Dn, yt, xt, mn, we, um, Ha, dm, fm, mm, hm, gm, pm;
const kr = class kr {
  /**
   * @param {PlaceableObject} placeable
   * @param {object|undefined} animationConfig  Raw animation config from the await entry
   */
  constructor(e, n) {
    k(this, we);
    k(this, Ee);
    k(this, _t);
    k(this, at, null);
    k(this, Nt, []);
    k(this, Fn, []);
    k(this, Dn, null);
    k(this, yt, null);
    k(this, xt, null);
    k(this, mn, 0);
    L(this, Ee, e), L(this, _t, Ob(n));
  }
  /** Current animation state name. */
  get state() {
    return h(this, at);
  }
  /**
   * Start animating in the given state.
   * @param {string} [state="idle"]
   */
  start(e = "idle") {
    L(this, at, e), L(this, Dn, (n) => {
      if (h(this, Ee).destroyed || !h(this, Ee).transform) {
        this.detach();
        return;
      }
      if (!h(this, yt)) {
        if (C(this, we, um).call(this), !h(this, yt)) return;
        C(this, we, gm).call(this), C(this, we, mm).call(this, h(this, at));
        return;
      }
      h(this, xt) && C(this, we, Ha).call(this);
      for (const i of h(this, Fn)) i.update(n);
      for (const i of h(this, Nt)) i.update(n);
      C(this, we, fm).call(this, n);
    }), canvas.app.ticker.add(h(this, Dn));
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
    var m;
    if (e === h(this, at)) return;
    if (!h(this, yt)) {
      L(this, at, e);
      return;
    }
    const n = ((m = h(this, Ee).document) == null ? void 0 : m.id) ?? "?", i = ce(h(this, Ee)), r = h(this, _t)[h(this, at)] ?? h(this, _t).idle ?? ["none"], a = h(this, _t)[e] ?? h(this, _t).idle ?? ["none"], o = r.map((f) => typeof f == "string" ? f : f == null ? void 0 : f.name), s = a.map((f) => typeof f == "string" ? f : f == null ? void 0 : f.name);
    if (console.log(`%c[TileAnimator ${n}] setState: ${h(this, at)} → ${e}`, "color: #44DDFF; font-weight: bold"), console.log(`  old behaviours: [${o.join(", ")}]  →  new: [${s.join(", ")}]`), i && console.log(`  mesh BEFORE detach: pos=(${i.position.x.toFixed(2)}, ${i.position.y.toFixed(2)}) scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)} angle=${i.angle.toFixed(2)}`), h(this, yt)) {
      const f = h(this, yt);
      console.log(`  canonical: pos=(${f.x.toFixed(2)}, ${f.y.toFixed(2)}) scale=(${f.scaleX.toFixed(4)}, ${f.scaleY.toFixed(4)}) alpha=${f.alpha.toFixed(4)} angle=${f.angle.toFixed(2)}`);
    }
    const l = /* @__PURE__ */ new Map();
    for (let f = 0; f < h(this, Nt).length; f++) {
      const g = r[f], p = typeof g == "string" ? g : g == null ? void 0 : g.name;
      p && l.set(p, h(this, Nt)[f]);
    }
    const u = [], d = /* @__PURE__ */ new Set();
    for (const f of a) {
      const g = typeof f == "string" ? f : f.name;
      l.has(g) && !d.has(g) && d.add(g);
    }
    console.log(`  reused: [${[...d].join(", ")}]  detaching: [${[...l.keys()].filter((f) => !d.has(f)).join(", ")}]`), C(this, we, dm).call(this);
    for (const [f, g] of l)
      d.has(f) || (g.detach(), i && console.log(`  mesh AFTER detach("${f}"): scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)}`));
    C(this, we, Ha).call(this), i && console.log(`  mesh AFTER canonical restore: scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)}`);
    for (const f of a) {
      const g = typeof f == "string" ? f : f.name;
      if (l.has(g) && d.has(g))
        u.push(l.get(g)), d.delete(g), console.log(`  → reuse "${g}"`);
      else {
        const p = typeof f == "string" ? void 0 : f, y = Ra(g);
        if (!y) {
          console.warn(`TileAnimator: unknown behaviour "${g}"`);
          continue;
        }
        u.push(y(h(this, Ee), p, h(this, yt))), i && console.log(`  → create "${g}" — mesh after factory: scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)} pos=(${i.position.x.toFixed(2)}, ${i.position.y.toFixed(2)})`);
      }
    }
    if (h(this, xt)) {
      const f = h(this, xt);
      console.log(`  blend FROM: pos=(${f.x.toFixed(2)}, ${f.y.toFixed(2)}) scale=(${f.scaleX.toFixed(4)}, ${f.scaleY.toFixed(4)}) alpha=${f.alpha.toFixed(4)}`);
    }
    L(this, at, e), L(this, Nt, u);
  }
  /**
   * Full cleanup — detach all behaviours, restore canonical, and remove ticker.
   */
  detach() {
    var n, i;
    h(this, Ee).destroyed || !h(this, Ee).transform ? (L(this, Nt, []), L(this, Fn, [])) : (C(this, we, hm).call(this), C(this, we, pm).call(this), C(this, we, Ha).call(this)), L(this, xt, null), L(this, at, null), h(this, Dn) && ((i = (n = canvas.app) == null ? void 0 : n.ticker) == null || i.remove(h(this, Dn)), L(this, Dn, null));
  }
};
Ee = new WeakMap(), _t = new WeakMap(), at = new WeakMap(), Nt = new WeakMap(), Fn = new WeakMap(), Dn = new WeakMap(), yt = new WeakMap(), xt = new WeakMap(), mn = new WeakMap(), we = new WeakSet(), // ── Private ──────────────────────────────────────────────────────────
um = /* @__PURE__ */ c(function() {
  const e = ce(h(this, Ee));
  e && L(this, yt, {
    x: e.position.x,
    y: e.position.y,
    scaleX: e.scale.x,
    scaleY: e.scale.y,
    angle: e.angle,
    alpha: e.alpha,
    tint: e.tint
  });
}, "#captureCanonical"), Ha = /* @__PURE__ */ c(function() {
  const e = ce(h(this, Ee));
  if (!e || !h(this, yt)) return;
  const n = h(this, yt);
  e.position.x = n.x, e.position.y = n.y, e.scale.x = n.scaleX, e.scale.y = n.scaleY, e.angle = n.angle, e.alpha = n.alpha, e.tint = n.tint;
}, "#restoreCanonical"), /**
 * Snapshot the current (animated) mesh values so the transition blend
 * can lerp FROM here toward the new state's computed values.
 */
dm = /* @__PURE__ */ c(function() {
  const e = ce(h(this, Ee));
  e && (L(this, xt, {
    x: e.position.x,
    y: e.position.y,
    scaleX: e.scale.x,
    scaleY: e.scale.y,
    angle: e.angle,
    alpha: e.alpha
  }), L(this, mn, 0));
}, "#captureBlendStart"), /**
 * After behaviours compute the new state's mesh values, blend from the
 * pre-transition snapshot toward those values over BLEND_FRAMES using
 * easeOutCubic. This hides the canonical-restore snap entirely.
 */
fm = /* @__PURE__ */ c(function(e) {
  var o, s;
  if (!h(this, xt)) return;
  L(this, mn, h(this, mn) + e);
  const n = Math.min(h(this, mn) / kr.BLEND_FRAMES, 1);
  if (n >= 1) {
    const l = ((o = h(this, Ee).document) == null ? void 0 : o.id) ?? "?";
    console.log(`%c[TileAnimator ${l}] blend complete`, "color: #88FF88"), L(this, xt, null);
    return;
  }
  const i = 1 - (1 - n) ** 3, r = ce(h(this, Ee));
  if (!r) return;
  const a = h(this, xt);
  if (h(this, mn) <= e * 3) {
    const l = ((s = h(this, Ee).document) == null ? void 0 : s.id) ?? "?", u = Math.round(h(this, mn) / e);
    console.log(`  [blend ${l} f${u}] t=${n.toFixed(3)} eased=${i.toFixed(3)} | behaviour→scale=(${r.scale.x.toFixed(4)},${r.scale.y.toFixed(4)}) alpha=${r.alpha.toFixed(4)} | blendFrom→scale=(${a.scaleX.toFixed(4)},${a.scaleY.toFixed(4)}) alpha=${a.alpha.toFixed(4)}`);
  }
  r.position.x = a.x + (r.position.x - a.x) * i, r.position.y = a.y + (r.position.y - a.y) * i, r.scale.x = a.scaleX + (r.scale.x - a.scaleX) * i, r.scale.y = a.scaleY + (r.scale.y - a.scaleY) * i, r.angle = a.angle + (r.angle - a.angle) * i, r.alpha = a.alpha + (r.alpha - a.alpha) * i, h(this, mn) <= e * 3 && console.log(`  [blend result] scale=(${r.scale.x.toFixed(4)},${r.scale.y.toFixed(4)}) alpha=${r.alpha.toFixed(4)} pos=(${r.position.x.toFixed(2)},${r.position.y.toFixed(2)})`);
}, "#applyBlend"), mm = /* @__PURE__ */ c(function(e) {
  L(this, at, e);
  const n = h(this, _t)[e] ?? h(this, _t).idle ?? ["none"];
  for (const i of n) {
    const r = typeof i == "string" ? i : i.name, a = typeof i == "string" ? void 0 : i, o = Ra(r);
    if (!o) {
      console.warn(`TileAnimator: unknown behaviour "${r}"`);
      continue;
    }
    h(this, Nt).push(o(h(this, Ee), a));
  }
}, "#attachBehaviours"), hm = /* @__PURE__ */ c(function() {
  for (const e of h(this, Nt)) e.detach();
  L(this, Nt, []);
}, "#detachBehaviours"), gm = /* @__PURE__ */ c(function() {
  const e = h(this, _t).always ?? [];
  for (const n of e) {
    const i = typeof n == "string" ? n : n.name, r = typeof n == "string" ? void 0 : n, a = Ra(i);
    if (!a) {
      console.warn(`TileAnimator: unknown always behaviour "${i}"`);
      continue;
    }
    h(this, Fn).push(a(h(this, Ee), r));
  }
}, "#attachAlwaysBehaviours"), pm = /* @__PURE__ */ c(function() {
  for (const e of h(this, Fn)) e.detach();
  L(this, Fn, []);
}, "#detachAlwaysBehaviours"), c(kr, "TileAnimator"), /** Frames over which state transitions are blended (easeOutCubic). */
be(kr, "BLEND_FRAMES", 8);
let Ii = kr;
const Ab = "cinematic", As = 5, Zl = /* @__PURE__ */ new Set();
function rn(t) {
  for (const e of Zl)
    try {
      e(t);
    } catch (n) {
      console.error("[cinematic] playback listener error:", n);
    }
}
c(rn, "emitPlaybackEvent");
function kb(t) {
  return Zl.add(t), () => Zl.delete(t);
}
c(kb, "onPlaybackProgress");
let Te = null, cn = null, Tr = null, Lr = null, _i = 0, ii = null;
function Lc(t, e = "default") {
  return `cinematic-progress-${t}-${e}`;
}
c(Lc, "progressFlagKey");
function Mb(t, e, n, i) {
  game.user.setFlag(T, Lc(t, e), {
    currentSegment: n,
    completedSegments: [...i],
    timestamp: Date.now()
  }).catch(() => {
  });
}
c(Mb, "saveSegmentProgress");
function ec(t, e = "default") {
  game.user.unsetFlag(T, Lc(t, e)).catch(() => {
  });
}
c(ec, "clearProgress");
function ym(t, e = "default", n = 3e5) {
  const i = game.user.getFlag(T, Lc(t, e));
  return !i || typeof i.timestamp != "number" || Date.now() - i.timestamp > n ? null : i.currentSegment ? i : null;
}
c(ym, "getSavedProgress");
function Oi(t, e = "default") {
  return `cinematic-seen-${t}-${e}`;
}
c(Oi, "seenFlagKey");
function Mu(t, e = "default") {
  return !!game.user.getFlag(T, Oi(t, e));
}
c(Mu, "hasSeenCinematic");
function _b(t, e) {
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
c(_b, "validateSingleCinematic");
function ss(t) {
  const e = t ? game.scenes.get(t) : canvas.scene;
  let n = (e == null ? void 0 : e.getFlag(T, Ab)) ?? null;
  if (n == null) return null;
  if (typeof n != "object" || Array.isArray(n))
    return console.warn(`[${T}] Cinematic: invalid flag data on scene ${e == null ? void 0 : e.id} (expected object). Ignoring.`), null;
  if ((n.version ?? 1) < 3) {
    const { version: i, ...r } = n;
    n = { version: 3, cinematics: { default: r } };
  }
  if (n.version === 3) {
    for (const [i, r] of Object.entries(n.cinematics ?? {}))
      n.cinematics[i] = Jt.migrateV3toV4(r);
    n.version = 4;
  }
  if (n.version === 4) {
    for (const [i, r] of Object.entries(n.cinematics ?? {}))
      n.cinematics[i] = Jt.migrateV4toV5(r);
    n.version = As;
  }
  if (n.version > As)
    return console.warn(`[${T}] Cinematic: scene ${e == null ? void 0 : e.id} has version ${n.version}, runtime supports up to ${As}. Skipping.`), null;
  if (!n.cinematics || typeof n.cinematics != "object")
    return console.warn(`[${T}] Cinematic: no 'cinematics' map on scene ${e == null ? void 0 : e.id}. Ignoring.`), null;
  for (const [i, r] of Object.entries(n.cinematics)) {
    const a = _b(r, `scene ${e == null ? void 0 : e.id} cinematic "${i}"`);
    a ? n.cinematics[i] = a : delete n.cinematics[i];
  }
  return Object.keys(n.cinematics).length === 0 ? null : n;
}
c(ss, "getCinematicData");
function uo(t, e = "default") {
  var i;
  const n = ss(t);
  return ((i = n == null ? void 0 : n.cinematics) == null ? void 0 : i[e]) ?? null;
}
c(uo, "getNamedCinematic");
function Nb(t) {
  const e = ss(t);
  return e ? Object.keys(e.cinematics) : [];
}
c(Nb, "listCinematicNames");
function xb() {
  return game.ready ? Promise.resolve() : new Promise((t) => Hooks.once("ready", t));
}
c(xb, "waitForReady");
async function $b(t = 1e4) {
  var n, i;
  const e = (i = (n = game.modules.get(T)) == null ? void 0 : n.api) == null ? void 0 : i.tween;
  return e != null && e.Timeline ? e.Timeline : new Promise((r) => {
    const a = Date.now(), o = setTimeout(() => {
      var l, u;
      (u = (l = ui.notifications) == null ? void 0 : l.info) == null || u.call(l, `[${T}] Cinematic: waiting for tween engine...`);
    }, 2e3), s = setInterval(() => {
      var u, d, m, f;
      const l = (d = (u = game.modules.get(T)) == null ? void 0 : u.api) == null ? void 0 : d.tween;
      l != null && l.Timeline ? (clearInterval(s), clearTimeout(o), r(l.Timeline)) : Date.now() - a > t && (clearInterval(s), clearTimeout(o), console.warn(`[${T}] Cinematic: tween API not available after ${t}ms.`), (f = (m = ui.notifications) == null ? void 0 : m.warn) == null || f.call(m, `[${T}] Cinematic: tween engine unavailable — cinematic cannot play.`), r(null));
    }, 200);
  });
}
c($b, "waitForTweenAPI");
async function tc(t = 5e3) {
  var e;
  return window.Tagger ?? ((e = game.modules.get("tagger")) == null ? void 0 : e.api) ? !0 : new Promise((n) => {
    const i = Date.now(), r = setInterval(() => {
      var a;
      window.Tagger ?? ((a = game.modules.get("tagger")) == null ? void 0 : a.api) ? (clearInterval(r), n(!0)) : Date.now() - i > t && (clearInterval(r), console.warn(`[${T}] Cinematic: Tagger API not available after ${t}ms.`), n(!1));
    }, 200);
  });
}
c(tc, "waitForTagger");
async function Fb(t, e, n) {
  if (!t || !t.event) return;
  const i = { ...t };
  console.log(`[${T}] Cinematic: waiting for gate: ${t.event}`);
  let r = null;
  if (t.event === "tile-click" && t.target && t.animation) {
    const a = e.get(t.target);
    (a == null ? void 0 : a.kind) === "placeable" && a.placeable && (r = new Ii(a.placeable, t.animation), r.start());
  }
  try {
    if (t.timeout && t.timeout > 0) {
      const a = new Promise((s) => setTimeout(s, t.timeout)), o = xl(i, { signal: n.signal, eventBus: null });
      await Promise.race([o, a]);
    } else
      await xl(i, { signal: n.signal, eventBus: null });
  } finally {
    r && r.detach();
  }
}
c(Fb, "processGate");
function bm(t) {
  if (!t.segments) return [];
  const e = [], n = /* @__PURE__ */ new Set();
  let i = t.entry;
  for (; i && typeof i == "string" && t.segments[i] && !n.has(i); )
    n.add(i), e.push(i), i = t.segments[i].next;
  return e;
}
c(bm, "getSegmentOrder");
function fo(t, e) {
  if (t.setup)
    try {
      Ae(t.setup, e);
    } catch (i) {
      console.warn(`[${T}] Cinematic: error applying cinematic-level setup:`, i);
    }
  const n = bm(t);
  for (const i of n) {
    const r = t.segments[i];
    if (r.setup)
      try {
        Ae(r.setup, e);
      } catch (a) {
        console.warn(`[${T}] Cinematic: error applying setup for segment "${i}":`, a);
      }
    if (r.landing)
      try {
        Ae(r.landing, e);
      } catch (a) {
        console.warn(`[${T}] Cinematic: error applying landing for segment "${i}":`, a);
      }
  }
  if (t.landing)
    try {
      Ae(t.landing, e);
    } catch (i) {
      console.warn(`[${T}] Cinematic: error applying cinematic-level landing:`, i);
    }
  canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
}
c(fo, "applyAllSegmentLandingStates");
async function Ir(t, e = "default", n = null) {
  var w, S, I, A, O, x, M, D;
  const i = t ?? ((w = canvas.scene) == null ? void 0 : w.id);
  if (!i) return;
  const r = `${i}:${e}`;
  if (n || (n = /* @__PURE__ */ new Set()), n.has(r)) {
    console.warn(`[${T}] Cinematic: circular transition detected at "${r}". Stopping chain.`), (I = (S = ui.notifications) == null ? void 0 : S.warn) == null || I.call(S, "Cinematic: circular transition detected, stopping.");
    return;
  }
  n.add(r), (Te == null ? void 0 : Te.status) === "running" && Te.cancel("replaced"), Te = null, cn && (cn.abort("replaced"), cn = null);
  const a = uo(i, e);
  if (!a) {
    console.warn(`[${T}] Cinematic: no cinematic "${e}" on scene ${i}.`);
    return;
  }
  const o = await $b();
  if (!o || ((A = canvas.scene) == null ? void 0 : A.id) !== i || (await tc(), ((O = canvas.scene) == null ? void 0 : O.id) !== i)) return;
  const { targets: s, unresolved: l } = io(a);
  if (console.log(`[${T}] Cinematic "${e}": resolved ${s.size} targets`), l.length && console.warn(`[${T}] Cinematic "${e}": skipping ${l.length} unresolved: ${l.join(", ")}`), s.size === 0) {
    console.warn(`[${T}] Cinematic "${e}": no targets could be resolved on scene ${i}.`);
    return;
  }
  const u = Dy(a);
  Tr = Fy(u, s), Lr = s;
  const d = ym(i, e), m = new AbortController();
  cn = m;
  const f = a.synchronized === !0 && game.user.isGM, g = bm(a);
  if (g.length === 0) {
    console.warn(`[${T}] Cinematic "${e}": no segments to execute.`);
    return;
  }
  let p = 0;
  const y = /* @__PURE__ */ new Set();
  if (d) {
    const F = d.completedSegments ?? [];
    for (const _ of F) y.add(_);
    const P = g.indexOf(d.currentSegment);
    P >= 0 && (p = P, console.log(`[${T}] Cinematic "${e}": resuming from segment "${d.currentSegment}" (${F.length} completed)`));
  }
  if (a.setup)
    try {
      Ae(a.setup, s), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    } catch (F) {
      console.error(`[${T}] Cinematic "${e}": error applying cinematic-level setup:`, F);
    }
  for (let F = 0; F < p; F++) {
    const P = g[F], _ = a.segments[P];
    if (_.setup)
      try {
        Ae(_.setup, s);
      } catch (H) {
        console.warn(`[${T}] Cinematic: error applying setup for completed segment "${P}":`, H);
      }
    if (_.landing)
      try {
        Ae(_.landing, s);
      } catch (H) {
        console.warn(`[${T}] Cinematic: error applying landing for completed segment "${P}":`, H);
      }
  }
  let b = !1, v = !1;
  rn({ type: "playback-start", sceneName: ((x = canvas.scene) == null ? void 0 : x.name) ?? i });
  try {
    for (let F = p; F < g.length; F++) {
      if (m.signal.aborted) {
        b = !0;
        break;
      }
      if (((M = canvas.scene) == null ? void 0 : M.id) !== i) {
        b = !0;
        break;
      }
      const P = g[F], _ = a.segments[P];
      if (console.log(`[${T}] Cinematic "${e}": entering segment "${P}"`), rn({ type: "segment-start", segmentName: P }), Mb(i, e, P, [...y]), _.gate) {
        rn({ type: "gate-wait", segmentName: P, gate: _.gate });
        try {
          await Fb(_.gate, s, m);
        } catch (q) {
          if (m.signal.aborted) {
            b = !0;
            break;
          }
          throw q;
        }
        rn({ type: "gate-resolved", segmentName: P });
      }
      if (m.signal.aborted) {
        b = !0;
        break;
      }
      if (_.setup)
        try {
          Ae(_.setup, s), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
        } catch (q) {
          console.error(`[${T}] Cinematic "${e}": error applying setup for segment "${P}":`, q);
        }
      if ((D = _.timeline) != null && D.length) {
        const q = Tc(_.timeline);
        rn({ type: "timeline-start", segmentName: P, durationMs: q });
        const { tl: j } = Uy(
          { setup: {}, timeline: _.timeline },
          s,
          o,
          {
            timelineName: `cinematic-${i}-${e}-${P}`,
            onStepComplete: /* @__PURE__ */ c((V) => {
              rn({ type: "step-complete", segmentName: P, stepIndex: V });
            }, "onStepComplete")
          }
        );
        Te = j.run({
          broadcast: f,
          commit: f
        });
        try {
          await new Promise((V, J) => {
            j.onComplete(() => V()), j.onCancel(() => J(new Error("cancelled"))), j.onError((Q) => J(new Error(`timeline error: ${Q}`)));
            const ae = /* @__PURE__ */ c(() => J(new Error("cancelled")), "onAbort");
            m.signal.addEventListener("abort", ae, { once: !0 });
          });
        } catch (V) {
          if (V.message === "cancelled" || m.signal.aborted) {
            b = !0;
            break;
          }
          throw V;
        }
        rn({ type: "timeline-end", segmentName: P });
      }
      if (m.signal.aborted) {
        b = !0;
        break;
      }
      if (_.landing)
        try {
          Ae(_.landing, s), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
        } catch (q) {
          console.error(`[${T}] Cinematic "${e}": error applying landing for segment "${P}":`, q);
        }
      rn({ type: "segment-complete", segmentName: P }), y.add(P);
      const H = _.next;
      if (H && typeof H == "object" && H.scene) {
        const q = H.scene, j = H.segment ?? a.entry;
        console.log(`[${T}] Cinematic "${e}": cross-scene transition to scene ${q}, segment "${j}"`), Te = null, cn = null, ec(i, e), bu(), a.tracking !== !1 && await game.user.setFlag(T, Oi(i, e), !0), ii = { sceneId: q, cinematicName: e, visitedChain: n };
        const B = game.scenes.get(q);
        B ? B.view() : (console.warn(`[${T}] Cinematic: cross-scene transition target scene "${q}" not found.`), ii = null);
        return;
      }
    }
  } catch (F) {
    v = !0, console.error(`[${T}] Cinematic "${e}" error on scene ${i}:`, F);
  }
  if (Te = null, cn = null, ec(i, e), bu(), Tr = null, Lr = null, rn({ type: "playback-end", cancelled: !!b }), b) {
    console.log(`[${T}] Cinematic "${e}" cancelled on scene ${i}.`), fo(a, s);
    return;
  }
  if (v) {
    fo(a, s);
    return;
  }
  a.tracking !== !1 && await game.user.setFlag(T, Oi(i, e), !0), console.log(`[${T}] Cinematic "${e}" complete on scene ${i}.`);
}
c(Ir, "playCinematic");
async function Db(t, e = "default") {
  var i;
  const n = t ?? ((i = canvas.scene) == null ? void 0 : i.id);
  n && (await game.user.unsetFlag(T, Oi(n, e)), console.log(`[${T}] Cinematic: cleared seen flag for "${e}" on scene ${n}.`));
}
c(Db, "resetCinematic");
async function Pb(t, e, n = "default") {
  var a;
  if (!game.user.isGM) return;
  const i = t ?? ((a = canvas.scene) == null ? void 0 : a.id);
  if (!i || !e) return;
  const r = game.users.get(e);
  r && (await r.unsetFlag(T, Oi(i, n)), console.log(`[${T}] Cinematic: cleared seen flag for user ${r.name} on "${n}" scene ${i}.`));
}
c(Pb, "resetCinematicForUser");
async function Rb(t, e = "default") {
  var a;
  if (!game.user.isGM) return;
  const n = t ?? ((a = canvas.scene) == null ? void 0 : a.id);
  if (!n) return;
  const i = Oi(n, e), r = game.users.map((o) => o.getFlag(T, i) ? o.unsetFlag(T, i) : Promise.resolve());
  await Promise.all(r), console.log(`[${T}] Cinematic: cleared seen flag for all users on "${e}" scene ${n}.`);
}
c(Rb, "resetCinematicForAll");
function Hb(t, e = "default") {
  var r;
  const n = t ?? ((r = canvas.scene) == null ? void 0 : r.id);
  if (!n) return [];
  const i = Oi(n, e);
  return game.users.map((a) => ({
    userId: a.id,
    name: a.name,
    color: a.color ?? "#888888",
    isGM: a.isGM,
    seen: !!a.getFlag(T, i)
  }));
}
c(Hb, "getSeenStatus");
function qb(t, e) {
  var i;
  const n = t ?? ((i = canvas.scene) == null ? void 0 : i.id);
  return e ? uo(n, e) != null : ss(n) != null;
}
c(qb, "hasCinematic");
function jb() {
  if (!Tr || !Lr) {
    console.warn(`[${T}] Cinematic: no snapshot available for revert.`);
    return;
  }
  (Te == null ? void 0 : Te.status) === "running" && Te.cancel("reverted"), Te = null, cn && (cn.abort("reverted"), cn = null);
  try {
    Ae(Tr, Lr), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 }), console.log(`[${T}] Cinematic: reverted to pre-cinematic state.`);
  } catch (t) {
    console.error(`[${T}] Cinematic: error during revert:`, t);
  }
  Tr = null, Lr = null;
}
c(jb, "revertCinematic");
async function Bb() {
  const t = ++_i;
  if (console.log(`[${T}] Cinematic: canvasReady fired, gen=${t}, game.ready=${game.ready}`), await xb(), t !== _i) return;
  console.log(`[${T}] Cinematic: game is ready`);
  const e = canvas.scene;
  if (!e) {
    console.log(`[${T}] Cinematic: no canvas.scene, exiting`);
    return;
  }
  if (ii && ii.sceneId === e.id) {
    const a = ii;
    ii = null, console.log(`[${T}] Cinematic: picking up pending transition to "${a.cinematicName}" on scene ${e.id}`);
    try {
      await Ir(e.id, a.cinematicName, a.visitedChain);
    } catch (o) {
      console.error(`[${T}] Cinematic: error during pending transition playback on scene ${e.id}:`, o);
    }
    return;
  }
  ii = null;
  const n = ss(e.id);
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
    const o = ym(e.id, a);
    if (t !== _i) return;
    if (o) {
      console.log(`[${T}] Cinematic "${a}": found saved progress at segment "${o.currentSegment}", resuming...`);
      try {
        await Ir(e.id, a);
      } catch (s) {
        console.error(`[${T}] Cinematic "${a}": error during resumed playback on scene ${e.id}:`, s);
      }
      return;
    }
  }
  let r = null;
  for (const { name: a, data: o } of i)
    if (!(o.tracking !== !1 && Mu(e.id, a))) {
      r = { name: a, data: o };
      break;
    }
  if (!r) {
    if (console.log(`[${T}] Cinematic: all canvasReady cinematics already seen on scene ${e.id}`), Ub(e.id, i), (Te == null ? void 0 : Te.status) === "running" && Te.cancel("already-seen"), Te = null, await tc(), t !== _i) return;
    for (const { name: a, data: o } of i)
      try {
        const { targets: s } = io(o);
        fo(o, s);
      } catch (s) {
        console.error(`[${T}] Cinematic "${a}": error applying landing states (already seen) on scene ${e.id}:`, s);
      }
    canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    return;
  }
  if (t === _i && (console.log(`[${T}] Cinematic: playing first unseen cinematic "${r.name}"...`), await tc(), t === _i)) {
    for (const { name: a, data: o } of i) {
      if (a === r.name) continue;
      if (o.tracking !== !1 && Mu(e.id, a))
        try {
          const { targets: l } = io(o);
          fo(o, l);
        } catch (l) {
          console.error(`[${T}] Cinematic "${a}": error applying landing states (already seen) on scene ${e.id}:`, l);
        }
    }
    try {
      await Ir(e.id, r.name);
    } catch (a) {
      console.error(`[${T}] Cinematic "${r.name}": error during playback on scene ${e.id}:`, a);
    }
  }
}
c(Bb, "onCanvasReady$1");
function Ub(t, e) {
  for (const { name: n } of e)
    ec(t, n);
}
c(Ub, "clearAllCanvasReadyProgress");
function Vb(t = 3e5) {
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
c(Vb, "cleanupStaleProgressFlags");
function zb() {
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
        new Gl({ scene: canvas.scene }).render(!0);
      }, "onClick")
    };
    Array.isArray(i) ? i.push(a) : i instanceof Map ? i.set(r, a) : i && typeof i == "object" ? i[r] = a : n.tools = [a];
  });
}
c(zb, "registerEditorButton");
function Gb() {
  Hooks.on("canvasReady", Bb), zb(), Hooks.once("ready", () => {
    Vb();
    const t = game.modules.get(T);
    t.api || (t.api = {}), t.api.cinematic = {
      play: Ir,
      reset: Db,
      resetForUser: Pb,
      resetForAll: Rb,
      getSeenStatus: Hb,
      has: qb,
      get: uo,
      list: Nb,
      revert: jb,
      onPlaybackProgress: kb,
      TileAnimator: Ii,
      registerBehaviour: he,
      getBehaviour: Ra,
      trigger: /* @__PURE__ */ c(async (e, n, i = "default") => {
        var o;
        const r = n ?? ((o = canvas.scene) == null ? void 0 : o.id);
        if (!r) return;
        const a = uo(r, i);
        a && (a.trigger && a.trigger !== e || await Ir(r, i));
      }, "trigger")
    }, console.log(`[${T}] Cinematic API registered (v5).`);
  });
}
c(Gb, "registerCinematicHooks");
function nc(t, e) {
  const n = Math.abs(t.width), i = Math.abs(t.height), r = n / 2, a = i / 2;
  let o = e.x - (t.x + r), s = e.y - (t.y + a);
  if (t.rotation !== 0) {
    const l = Math.toRadians(t.rotation), u = Math.cos(l), d = Math.sin(l), m = u * o + d * s, f = u * s - d * o;
    o = m, s = f;
  }
  return o += r, s += a, o >= 0 && o <= n && s >= 0 && s <= i;
}
c(nc, "pointWithinTile");
is("tile-click", (t, e) => t.target ? new Promise((n, i) => {
  var g;
  if (e.signal.aborted) return i(e.signal.reason ?? "aborted");
  const r = as(t.target);
  if (!((g = r == null ? void 0 : r.placeables) != null && g.length))
    return i(new Error(`await tile-click: no placeables found for "${t.target}"`));
  const a = r.placeables, o = [];
  for (const { placeable: p } of a) {
    const y = new Ii(p, t.animation);
    y.start("idle"), o.push({ placeable: p, animator: y });
  }
  const s = document.getElementById("board");
  let l = null;
  const u = /* @__PURE__ */ c((p) => {
    const y = canvas.activeLayer;
    if (!y) return;
    const b = y.toLocal(p);
    if (!b || isNaN(b.x) || isNaN(b.y)) return;
    let v = !1;
    for (const { placeable: w, animator: S } of o)
      nc(w.document, b) ? (v = !0, S.state !== "hover" && S.setState("hover")) : S.state === "hover" && S.setState("idle");
    v ? l === null && (l = document.body.style.cursor, document.body.style.cursor = "pointer") : l !== null && (document.body.style.cursor = l, l = null);
  }, "onPointerMove");
  s == null || s.addEventListener("pointermove", u);
  const d = /* @__PURE__ */ c((p) => {
    if (p.button !== 0) return;
    const y = canvas.activeLayer;
    if (!y) return;
    const b = y.toLocal(p);
    isNaN(b.x) || isNaN(b.y) || !a.filter(({ doc: w }) => nc(w, b)).sort((w, S) => (S.doc.sort ?? 0) - (w.doc.sort ?? 0))[0] || (p.stopPropagation(), p.preventDefault(), f(), n());
  }, "onPointerDown");
  s == null || s.addEventListener("pointerdown", d, { capture: !0 });
  const m = /* @__PURE__ */ c(() => {
    f(), i(e.signal.reason ?? "aborted");
  }, "onAbort");
  e.signal.addEventListener("abort", m, { once: !0 });
  function f() {
    s == null || s.removeEventListener("pointerdown", d, { capture: !0 }), s == null || s.removeEventListener("pointermove", u), e.signal.removeEventListener("abort", m);
    for (const { animator: p } of o)
      p.detach();
    l !== null ? (document.body.style.cursor = l, l = null) : document.body.style.cursor = "";
  }
  c(f, "cleanup");
}) : Promise.reject(new Error('await tile-click: "target" is required')));
Gb();
function Wb() {
  Hooks.once("ready", () => {
    const t = game.modules.get(T);
    t.api || (t.api = {}), t.api.picker = {
      /** Open the picker window. Returns Promise<string[] | null>. */
      open: /* @__PURE__ */ c((e) => co.open(e), "open"),
      /** Resolve a selector string to documents. */
      resolveSelector: as,
      /** Parse a selector string into { type, value }. */
      parseSelector: Sc,
      /** Build a selector string from { type, value }. */
      buildSelector: My,
      /** Build a tag selector from tags array + mode. */
      buildTagSelector: $f,
      /** Canvas highlight utilities. */
      highlight: {
        add: lo,
        remove: tr,
        has: zf,
        clearAll: Pa
      }
    }, console.log(`[${T}] Placeable Picker API registered.`);
  });
}
c(Wb, "registerPlaceablePickerHooks");
Wb();
const fr = "canvas-popup", Yb = 100;
function Jb(t) {
  const e = canvas.stage.worldTransform, n = document.getElementById("board"), i = n == null ? void 0 : n.getBoundingClientRect(), r = (i == null ? void 0 : i.left) ?? 0, a = (i == null ? void 0 : i.top) ?? 0;
  return {
    x: e.a * t.x + e.c * t.y + e.tx + r,
    y: e.b * t.x + e.d * t.y + e.ty + a
  };
}
c(Jb, "canvasToScreen");
function Kb() {
  var t, e;
  return ((e = (t = canvas.stage) == null ? void 0 : t.scale) == null ? void 0 : e.x) ?? 1;
}
c(Kb, "getZoom");
function ks(t, e) {
  var n;
  return e === "grid" ? t * (((n = canvas.grid) == null ? void 0 : n.size) ?? 100) : t;
}
c(ks, "resolveUnit");
function Xb(t, e) {
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
c(Xb, "attachClickOutside");
function Qb(t, e) {
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
c(Qb, "attachRightClickOutside");
function Zb(t, e) {
  function n(i) {
    i.key === "Escape" && (i.preventDefault(), i.stopPropagation(), e());
  }
  return c(n, "handler"), document.addEventListener("keydown", n, !0), () => {
    document.removeEventListener("keydown", n, !0);
  };
}
c(Zb, "attachEscape");
const Ms = /* @__PURE__ */ new Set(), va = 8, _u = 0.5, $c = class $c {
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
    var n, i, r, a, o;
    this._anchor = this._resolveAnchor(e.anchor), this._offset = { x: ((n = e.offset) == null ? void 0 : n.x) ?? 0, y: ((i = e.offset) == null ? void 0 : i.y) ?? 0 }, this._anchorX = e.anchorX ?? "left", this._anchorY = e.anchorY ?? "top", this._sizeUnit = e.sizeUnit ?? "grid", this._dismiss = {
      clickOutside: ((r = e.dismiss) == null ? void 0 : r.clickOutside) ?? !0,
      rightClickOutside: ((a = e.dismiss) == null ? void 0 : a.rightClickOutside) ?? !1,
      escape: ((o = e.dismiss) == null ? void 0 : o.escape) ?? !0
    }, this._cssClass = e.cssClass ?? "", this._animate = e.animate ?? !0, this._width = e.width ?? null, this._clampToViewport = e.clampToViewport ?? !0, this._initialContent = e.content ?? null, this.element = null, this.isOpen = !1, this._cleanups = [], this._listeners = /* @__PURE__ */ new Map(), this._hookId = null, this._tickerFn = null, this._lastScreenPos = { x: -99999, y: -99999 };
  }
  // ── Public API ────────────────────────────────────────────────────────
  /**
   * Append popup to the DOM and start tracking.
   * @returns {this}
   */
  mount() {
    var a;
    if (this.isOpen) return this;
    const e = document.createElement("div");
    e.className = fr, this._cssClass && e.classList.add(...this._cssClass.split(/\s+/)), e.style.position = "fixed", e.style.zIndex = Yb;
    const n = document.createElement("div");
    n.className = `${fr}__content`, e.appendChild(n), this.element = e, this._contentWrap = n;
    const i = this._resolveWidth();
    i != null && (n.style.width = `${i}px`, n.style.minWidth = "0", n.style.boxSizing = "border-box"), this._initialContent && this.setContent(this._initialContent), document.body.appendChild(e), this.reposition(), this._animate ? requestAnimationFrame(() => {
      this.element && this.element.classList.add(`${fr}--visible`);
    }) : e.classList.add(`${fr}--visible`), this._hookId = Hooks.on("canvasPan", () => this.reposition()), this._anchor.placeable && ((a = canvas.app) != null && a.ticker) && (this._tickerFn = () => this.reposition(), canvas.app.ticker.add(this._tickerFn));
    const r = /* @__PURE__ */ c((o) => {
      this._emit("dismiss", o), this.destroy();
    }, "dismissFn");
    return this._dismiss.clickOutside && this._cleanups.push(Xb(e, () => r("clickOutside"))), this._dismiss.rightClickOutside && this._cleanups.push(Qb(e, () => r("rightClickOutside"))), this._dismiss.escape && this._cleanups.push(Zb(e, () => r("escape"))), this.isOpen = !0, Ms.add(this), this._emit("open"), this;
  }
  /**
   * Remove from DOM and clean up everything. Idempotent.
   */
  destroy() {
    var n;
    if (!this.isOpen) return;
    this.isOpen = !1, Ms.delete(this);
    for (const i of this._cleanups) i();
    this._cleanups.length = 0, this._hookId != null && (Hooks.off("canvasPan", this._hookId), this._hookId = null), this._tickerFn && ((n = canvas.app) != null && n.ticker) && (canvas.app.ticker.remove(this._tickerFn), this._tickerFn = null);
    const e = this.element;
    if (e) {
      if (this._animate) {
        e.classList.remove(`${fr}--visible`);
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
    var r, a;
    const n = !!this._anchor.placeable;
    this._anchor = this._resolveAnchor(e);
    const i = !!this._anchor.placeable;
    n && !i && this._tickerFn && ((r = canvas.app) != null && r.ticker) ? (canvas.app.ticker.remove(this._tickerFn), this._tickerFn = null) : !n && i && this.isOpen && ((a = canvas.app) != null && a.ticker) && !this._tickerFn && (this._tickerFn = () => this.reposition(), canvas.app.ticker.add(this._tickerFn)), this._lastScreenPos = { x: -99999, y: -99999 }, this.reposition();
  }
  /**
   * Force recalculate position. Auto-called on canvasPan and ticker.
   */
  reposition() {
    if (!this.element) return;
    const e = this._getAnchorCanvasPoint();
    if (!e) return;
    const n = Kb(), i = this._sizeUnit !== "screen", r = ks(this._offset.x, this._sizeUnit), a = ks(this._offset.y, this._sizeUnit), o = {
      x: e.x + r,
      y: e.y + a
    }, s = Jb(o);
    if (Math.abs(s.x - this._lastScreenPos.x) < _u && Math.abs(s.y - this._lastScreenPos.y) < _u)
      return;
    this._lastScreenPos = { x: s.x, y: s.y };
    const l = this.element, u = i ? n : 1;
    i ? (l.style.transformOrigin = `${this._anchorX} ${this._anchorY}`, l.style.transform = `scale(${u})`) : (l.style.transform = "", l.style.transformOrigin = "");
    let d = 0, m = 0;
    const f = l.getBoundingClientRect();
    this._anchorX === "center" ? d = -f.width / 2 : this._anchorX === "right" && (d = -f.width), this._anchorY === "center" ? m = -f.height / 2 : this._anchorY === "bottom" && (m = -f.height);
    let g = s.x + d, p = s.y + m;
    if (this._clampToViewport) {
      const y = window.innerWidth - f.width - va, b = window.innerHeight - f.height - va;
      g = Math.max(va, Math.min(g, y)), p = Math.max(va, Math.min(p, b));
    }
    l.style.left = `${g}px`, l.style.top = `${p}px`, this._emit("reposition", { x: g, y: p });
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
    for (const e of [...Ms])
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
    return this._width == null ? null : this._width === "anchor" ? this._getAnchorSize().width : ks(this._width, this._sizeUnit);
  }
  /**
   * Get the anchor placeable's canvas-pixel size.
   * Works across tiles, drawings, tokens, etc.
   * @returns {{ width: number, height: number }}
   */
  _getAnchorSize() {
    var i, r, a;
    const e = this._anchor.placeable;
    if (!e) return { width: 0, height: 0 };
    const n = e.document;
    return ((i = n == null ? void 0 : n.shape) == null ? void 0 : i.width) != null ? { width: n.shape.width, height: n.shape.height } : (n == null ? void 0 : n.width) != null ? { width: n.width, height: n.height } : (n == null ? void 0 : n.width) != null ? { width: n.width * (((r = canvas.grid) == null ? void 0 : r.size) ?? 100), height: n.height * (((a = canvas.grid) == null ? void 0 : a.size) ?? 100) } : { width: 0, height: 0 };
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
        } catch (a) {
          console.error(`[CanvasPopup] Error in '${e}' listener:`, a);
        }
  }
};
c($c, "CanvasPopup");
let mo = $c;
const ei = "canvas-popup-options";
function ev({ sections: t = [] } = {}) {
  const e = /* @__PURE__ */ new Map(), n = document.createElement("div");
  n.className = ei;
  for (const s of t) {
    const l = document.createElement("div");
    l.className = `${ei}__section`;
    const u = document.createElement("div");
    u.className = `${ei}__header`, u.textContent = s.label, l.appendChild(u);
    for (const d of s.items) {
      const m = document.createElement("div");
      m.className = `${ei}__item`, d.active && m.classList.add(`${ei}__item--active`), m.dataset.key = s.key, m.dataset.value = d.value;
      const f = document.createElement("span");
      f.className = `${ei}__dot`, m.appendChild(f);
      const g = document.createElement("span");
      g.className = `${ei}__label`, g.textContent = d.label, m.appendChild(g), m.addEventListener("click", (p) => {
        i("select", s.key, d.value, d, p);
      }), m.addEventListener("mouseenter", () => {
        i("hover", s.key, d.value, d);
      }), m.addEventListener("mouseleave", () => {
        i("hoverEnd", s.key, d.value, d);
      }), l.appendChild(m);
    }
    n.appendChild(l);
  }
  function i(s, ...l) {
    const u = e.get(s);
    if (u)
      for (const d of u)
        try {
          d(...l);
        } catch (m) {
          console.error(`[OptionList] Error in '${s}' listener:`, m);
        }
  }
  c(i, "emit");
  function r(s, l) {
    e.has(s) || e.set(s, /* @__PURE__ */ new Set()), e.get(s).add(l);
  }
  c(r, "on");
  function a(s, l) {
    var u;
    (u = e.get(s)) == null || u.delete(l);
  }
  c(a, "off");
  function o() {
    e.clear(), n.remove();
  }
  return c(o, "destroy"), { element: n, on: r, off: a, destroy: o };
}
c(ev, "createOptionList");
function tv() {
  Hooks.once("ready", () => {
    const t = game.modules.get(T);
    t.api || (t.api = {}), t.api.canvasPopup = {
      CanvasPopup: mo,
      content: { createOptionList: ev }
    }, console.log(`[${T}] Canvas Popup API registered.`);
  }), Hooks.on("canvasTearDown", () => mo.destroyAll());
}
c(tv, "registerCanvasPopupHooks");
tv();
function nv(t, e) {
  const n = t.shape;
  if (!n) return !1;
  const i = t.x ?? 0, r = t.y ?? 0, a = n.width ?? 0, o = n.height ?? 0, s = t.rotation ?? 0, l = i + a / 2, u = r + o / 2;
  let d = e.x - l, m = e.y - u;
  if (s !== 0) {
    const f = Math.toRadians(s), g = Math.cos(f), p = Math.sin(f), y = g * d + p * m, b = g * m - p * d;
    d = y, m = b;
  }
  switch (d += a / 2, m += o / 2, n.type) {
    case "r":
      return d >= 0 && d <= a && m >= 0 && m <= o;
    case "e": {
      const f = a / 2, g = o / 2;
      if (f <= 0 || g <= 0) return !1;
      const p = (d - f) / f, y = (m - g) / g;
      return p * p + y * y <= 1;
    }
    case "p": {
      const f = n.points;
      return !Array.isArray(f) || f.length < 6 ? !1 : iv(d, m, f);
    }
    case "f":
      return d >= 0 && d <= a && m >= 0 && m <= o;
    default:
      return !1;
  }
}
c(nv, "pointWithinDrawing");
function iv(t, e, n) {
  let i = !1;
  const r = n.length;
  for (let a = 0, o = r - 2; a < r; o = a, a += 2) {
    const s = n[a], l = n[a + 1], u = n[o], d = n[o + 1];
    l > e != d > e && t < (u - s) * (e - l) / (d - l) + s && (i = !i);
  }
  return i;
}
c(iv, "pointInPolygon");
const Or = "eidolon-utilities", rv = "tile-interactions", av = "tile-animations", ov = "idle-animation";
function sv(t) {
  const e = t.type ?? "tile-prop";
  return e === "tile-tint" ? { name: "tween-tint", fromColor: t.fromColor, toColor: t.toColor, mode: t.mode, period: t.period, easing: t.easing } : e === "tile-scale" ? { name: "tween-scale", fromScale: t.fromScale, toScale: t.toScale, period: t.period, easing: t.easing } : { name: "tween-prop", attribute: t.attribute, from: t.from, to: t.to, period: t.period, easing: t.easing };
}
c(sv, "migrateIdleTweenToAlways");
function Ic(t) {
  var u, d, m;
  const e = (u = t == null ? void 0 : t.getFlag) == null ? void 0 : u.call(t, Or, av);
  if (e) return e;
  const n = (d = t == null ? void 0 : t.getFlag) == null ? void 0 : d.call(t, Or, ov), i = (m = t == null ? void 0 : t.getFlag) == null ? void 0 : m.call(t, Or, rv);
  let r = [], a = [], o = [], s = [];
  if (n) {
    let f;
    Array.isArray(n) ? f = n : typeof n == "object" && "0" in n ? f = Object.values(n) : typeof n == "object" && (n.type || n.attribute) ? f = [n] : f = [], r = f.filter((g) => g && typeof g == "object").map(sv);
  }
  return i && (i.hover && (Array.isArray(i.hover) ? o = i.hover : typeof i.hover == "object" && (a = Array.isArray(i.hover.idle) ? i.hover.idle : [], o = Array.isArray(i.hover.enter) ? i.hover.enter : [])), Array.isArray(i.click) && i.click.length && (s = i.click)), r.length > 0 || a.length > 0 || o.length > 0 || s.length > 0 ? { always: r, idle: a, hover: o, click: s } : null;
}
c(Ic, "readUnifiedConfig");
const hn = /* @__PURE__ */ new Map(), zn = /* @__PURE__ */ new Map(), Nu = /* @__PURE__ */ new WeakMap(), Ar = /* @__PURE__ */ new Set();
let Dt = null, Je = null, $t = null, Wt = null, Yt = null;
function vm(t) {
  const e = canvas.activeLayer;
  if (!e) return null;
  const n = e.toLocal(t);
  return !n || Number.isNaN(n.x) || Number.isNaN(n.y) ? null : n;
}
c(vm, "canvasToLocal");
function wm(t) {
  let e = null, n = -1 / 0;
  for (const [i, r] of hn) {
    if (!(r.placeableType === "drawing" ? nv(r.doc, t) : nc(r.doc, t))) continue;
    const o = (r.doc.sort ?? 0) + (r.placeableType === "drawing" ? 1e9 : 0);
    o > n && (e = r, n = o);
  }
  return e;
}
c(wm, "hitTest");
function lv(t) {
  var e, n;
  return {
    always: t.always ?? [],
    idle: (e = t.idle) != null && e.length ? t.idle : ["none"],
    hover: (n = t.hover) != null && n.length ? t.hover : ["none"]
  };
}
c(lv, "buildAnimatorConfig");
function Oc(t, e, n) {
  sa(t);
  const i = lv(n), r = new Ii(e, i);
  r.start("idle"), zn.set(t, r);
}
c(Oc, "startHoverAnimator");
function sa(t) {
  const e = zn.get(t);
  e && (e.detach(), zn.delete(t));
}
c(sa, "stopHoverAnimator");
function _s(t, e, n, i) {
  return e.type === "tile-tint" ? { uuid: t, toColor: n ? e.toColor : e.fromColor, mode: e.mode } : e.type === "tile-scale" ? {
    uuid: t,
    toScale: n ? e.toScale : e.fromScale,
    ...i
  } : { uuid: t, attribute: e.attribute, value: n ? e.to : e.from };
}
c(_s, "buildClickParams");
function cv(t) {
  const e = t._source.width, n = t._source.height, i = t._source.x, r = t._source.y;
  return {
    baseWidth: e,
    baseHeight: n,
    centerX: i + e / 2,
    centerY: r + n / 2
  };
}
c(cv, "captureRefGeometry");
async function uv(t, e) {
  const n = t.uuid, i = e.type ?? "tile-prop", r = rr(i);
  if (!r) {
    console.warn(`[${Or}] tile-interactions: unknown tween type "${i}"`);
    return;
  }
  const a = e.period ?? 300, o = e.easing ?? "easeOutCubic", s = e.mode ?? "bounce", l = i === "tile-scale" ? cv(t) : null;
  if (s === "toggle") {
    const d = !(Nu.get(t) ?? !1);
    await r.execute(
      _s(n, e, d, l),
      { durationMS: a, easing: o, commit: !0 }
    ), Nu.set(t, d);
  } else {
    const u = a / 2;
    await r.execute(
      _s(n, e, !0, l),
      { durationMS: u, easing: o, commit: !1 }
    ), await r.execute(
      _s(n, e, !1, l),
      { durationMS: u, easing: o, commit: !1 }
    );
  }
}
c(uv, "playClickAnimation");
async function dv(t) {
  var n, i, r, a, o;
  const e = t.doc.id;
  if (!Ar.has(e)) {
    Ar.add(e);
    try {
      if (sa(e), (n = t.clickConfig) != null && n.length) {
        const s = t.clickConfig.map((l) => uv(t.doc, l));
        await Promise.all(s);
      }
      if (t.macroUuid) {
        const s = await fromUuid(t.macroUuid);
        s ? s.execute({ placeable: t.placeable }) : console.warn(`[${Or}] tile-interactions: macro not found: ${t.macroUuid}`);
      }
    } finally {
      Ar.delete(e), t.animConfig && (((i = t.animConfig.always) == null ? void 0 : i.length) > 0 || ((r = t.animConfig.idle) == null ? void 0 : r.length) > 0 || ((a = t.animConfig.hover) == null ? void 0 : a.length) > 0) && (Oc(e, t.placeable, t.animConfig), Dt === e && ((o = zn.get(e)) == null || o.setState("hover")));
    }
  }
}
c(dv, "handleClick");
function Em(t) {
  var r;
  const e = vm(t);
  if (!e) return;
  const n = wm(e), i = (n == null ? void 0 : n.doc.id) ?? null;
  if (i !== Dt) {
    if (Dt) {
      const a = zn.get(Dt);
      a && a.setState("idle");
    }
    if (i) {
      const a = zn.get(i);
      a && a.setState("hover");
    }
    Dt = i, i && (n.animConfig || (r = n.clickConfig) != null && r.length || n.macroUuid) ? (Je === null && (Je = document.body.style.cursor), document.body.style.cursor = "pointer") : Je !== null && (document.body.style.cursor = Je, Je = null);
  }
}
c(Em, "onPointerMove");
function Cm(t) {
  var i;
  if (t.button !== 0) return;
  const e = vm(t);
  if (!e) return;
  const n = wm(e);
  n && (!((i = n.clickConfig) != null && i.length) && !n.macroUuid || dv(n));
}
c(Cm, "onPointerDown");
function Sm() {
  if (Dt) {
    const t = zn.get(Dt);
    t && t.setState("idle"), Dt = null;
  }
  Je !== null && (document.body.style.cursor = Je, Je = null);
}
c(Sm, "onPointerLeave");
function xu(t, e, n) {
  var s, l, u;
  const i = Ic(t);
  if (!i) return;
  const r = ((s = i.always) == null ? void 0 : s.length) > 0 || ((l = i.idle) == null ? void 0 : l.length) > 0 || ((u = i.hover) == null ? void 0 : u.length) > 0, a = Array.isArray(i.click) && i.click.length ? i.click : null, o = i.macro || null;
  !r && !a && !o || (hn.set(t.id, { doc: t, placeable: e, animConfig: i, clickConfig: a, macroUuid: o, placeableType: n }), r && Oc(t.id, e, i));
}
c(xu, "registerPlaceable");
function Tm() {
  var i, r;
  for (const a of zn.keys())
    sa(a);
  hn.clear(), Ar.clear(), Dt = null, Je !== null && (document.body.style.cursor = Je, Je = null);
  const t = document.getElementById("board");
  $t && (t == null || t.removeEventListener("pointermove", $t), $t = null), Wt && (t == null || t.removeEventListener("pointerdown", Wt), Wt = null), Yt && (t == null || t.removeEventListener("pointerleave", Yt), Yt = null);
  const e = (i = canvas.tiles) == null ? void 0 : i.placeables;
  if (Array.isArray(e))
    for (const a of e)
      xu(a.document, a, "tile");
  const n = (r = canvas.drawings) == null ? void 0 : r.placeables;
  if (Array.isArray(n))
    for (const a of n)
      xu(a.document, a, "drawing");
  hn.size !== 0 && ($t = Em, Wt = Cm, Yt = Sm, t == null || t.addEventListener("pointermove", $t), t == null || t.addEventListener("pointerdown", Wt), t == null || t.addEventListener("pointerleave", Yt));
}
c(Tm, "rebuild");
function fv(t) {
  Lm(t, "tile");
}
c(fv, "updateTile");
function mv(t) {
  Ac(t);
}
c(mv, "removeTile");
function hv(t) {
  Lm(t, "drawing");
}
c(hv, "updateDrawing");
function gv(t) {
  Ac(t);
}
c(gv, "removeDrawing");
function Lm(t, e) {
  var l, u, d;
  const n = t.id, i = Ic(t), r = i && (((l = i.always) == null ? void 0 : l.length) > 0 || ((u = i.idle) == null ? void 0 : u.length) > 0 || ((d = i.hover) == null ? void 0 : d.length) > 0), a = i && Array.isArray(i.click) && i.click.length ? i.click : null, o = (i == null ? void 0 : i.macro) || null;
  if (!r && !a && !o) {
    Ac(t);
    return;
  }
  sa(n);
  const s = t.object;
  if (!s) {
    hn.delete(n);
    return;
  }
  hn.set(n, { doc: t, placeable: s, animConfig: i, clickConfig: a, macroUuid: o, placeableType: e }), r && Oc(n, s, i), pv();
}
c(Lm, "updatePlaceable");
function Ac(t) {
  const e = t.id;
  if (sa(e), hn.delete(e), Ar.delete(e), Dt === e && (Dt = null, Je !== null && (document.body.style.cursor = Je, Je = null)), hn.size === 0) {
    const n = document.getElementById("board");
    $t && (n == null || n.removeEventListener("pointermove", $t), $t = null), Wt && (n == null || n.removeEventListener("pointerdown", Wt), Wt = null), Yt && (n == null || n.removeEventListener("pointerleave", Yt), Yt = null);
  }
}
c(Ac, "removePlaceable");
function pv() {
  if (hn.size === 0 || $t) return;
  const t = document.getElementById("board");
  t && ($t = Em, Wt = Cm, Yt = Sm, t.addEventListener("pointermove", $t), t.addEventListener("pointerdown", Wt), t.addEventListener("pointerleave", Yt));
}
c(pv, "ensureListeners");
function $i(t, e, n) {
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
c($i, "buildSelectGroup");
function Fi(t, e, n, i = {}) {
  const r = document.createElement("div");
  r.classList.add("form-group");
  const a = document.createElement("label");
  a.textContent = t;
  const o = document.createElement("input");
  o.type = "number", o.classList.add(e), o.value = String(n);
  for (const [s, l] of Object.entries(i)) o.setAttribute(s, l);
  return r.append(a, o), r;
}
c(Fi, "buildNumberGroup");
function ic(t, e, n) {
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
c(ic, "buildColorGroup");
let oe = null;
function Ns() {
  for (const t of document.querySelectorAll(".idle-anim__slot--insert-before, .idle-anim__slot--insert-after"))
    t.classList.remove("idle-anim__slot--insert-before", "idle-anim__slot--insert-after");
}
c(Ns, "clearInsertIndicators");
function $u(t) {
  for (const e of document.querySelectorAll(".idle-anim__slots"))
    e.classList.toggle("idle-anim__slots--drag-active", t);
}
c($u, "setDragActive");
function ho(t, e) {
  t.dispatchEvent(new CustomEvent("slot-reorder", { detail: { card: e } }));
}
c(ho, "notifyReorder");
function Im(t, { dropGroup: e, handleSelector: n = ".idle-anim__slot-header" }) {
  t.setAttribute("draggable", "true");
  let i = !1;
  t.addEventListener("pointerdown", (r) => {
    i = !!r.target.closest(n);
  }), t.addEventListener("dragstart", (r) => {
    if (!i) {
      r.preventDefault();
      return;
    }
    oe = { card: t, sourceContainer: t.parentElement, group: e, insertMode: null, insertTarget: null }, t.classList.add("is-dragging"), $u(!0), r.dataTransfer.effectAllowed = "move", r.dataTransfer.setData("text/plain", "");
  }), t.addEventListener("dragover", (r) => {
    if (!oe || oe.group !== e || oe.card === t) return;
    r.preventDefault(), r.dataTransfer.dropEffect = "move";
    const a = t.getBoundingClientRect(), o = a.top + a.height / 2, s = r.clientY < o ? "before" : "after";
    (oe.insertTarget !== t || oe.insertMode !== s) && (Ns(), t.classList.add(s === "before" ? "idle-anim__slot--insert-before" : "idle-anim__slot--insert-after"), oe.insertTarget = t, oe.insertMode = s);
  }), t.addEventListener("dragleave", () => {
    t.classList.remove("idle-anim__slot--insert-before", "idle-anim__slot--insert-after"), (oe == null ? void 0 : oe.insertTarget) === t && (oe.insertTarget = null, oe.insertMode = null);
  }), t.addEventListener("drop", (r) => {
    if (r.preventDefault(), r.stopPropagation(), Ns(), !oe || oe.group !== e || oe.card === t) return;
    const a = oe.card, o = oe.sourceContainer, s = t.parentElement;
    oe.insertMode === "after" ? s.insertBefore(a, t.nextSibling) : s.insertBefore(a, t), ho(s, a), o !== s && ho(o, a), oe = null;
  }), t.addEventListener("dragend", () => {
    t.classList.remove("is-dragging"), Ns(), $u(!1);
    for (const r of document.querySelectorAll(".idle-anim__slots--drag-over"))
      r.classList.remove("idle-anim__slots--drag-over");
    oe = null;
  });
}
c(Im, "makeDraggable");
function Om(t, { dropGroup: e, onDrop: n }) {
  t.addEventListener("dragover", (i) => {
    !oe || oe.group !== e || (i.preventDefault(), i.dataTransfer.dropEffect = "move");
  }), t.addEventListener("dragenter", (i) => {
    !oe || oe.group !== e || (i.preventDefault(), t.classList.add("idle-anim__slots--drag-over"));
  }), t.addEventListener("dragleave", (i) => {
    i.relatedTarget && t.contains(i.relatedTarget) || t.classList.remove("idle-anim__slots--drag-over");
  }), t.addEventListener("drop", (i) => {
    if (i.preventDefault(), t.classList.remove("idle-anim__slots--drag-over"), !oe || oe.group !== e) return;
    const r = oe.card, a = oe.sourceContainer;
    t.appendChild(r), ho(t, r), a !== t && ho(a, r), oe = null;
  }), t.addEventListener("slot-reorder", (i) => {
    n == null || n(i.detail.card, t);
  });
}
c(Om, "makeDropContainer");
const wa = "eidolon-utilities", Fu = "tile-animations", yv = "tile-interactions", bv = "idle-animation", vv = "eidolon-idle-animation", wv = "fa-solid fa-wave-pulse", Am = [
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
], Ev = [
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
}, Di = {
  attribute: "alpha",
  from: 1,
  to: 0.5,
  period: 300,
  mode: "bounce"
}, ji = {
  fromColor: "#ffffff",
  toColor: "#ffaa00",
  period: 500,
  mode: "bounce"
}, qa = {
  type: "tile-scale",
  fromScale: 1,
  toScale: 1.2,
  period: 300,
  easing: "easeOutCubic",
  mode: "bounce"
}, Mm = [
  { value: "alpha", label: "Alpha (Opacity)" },
  { value: "rotation", label: "Rotation" },
  { value: "texture.rotation", label: "Texture Rotation" }
];
let En = null;
function Cv(t) {
  var e;
  return (t == null ? void 0 : t.document) ?? ((e = t == null ? void 0 : t.object) == null ? void 0 : e.document) ?? (t == null ? void 0 : t.object) ?? null;
}
c(Cv, "getPlaceableDocument");
function Sv(t, e) {
  const n = document.createElement("div");
  n.classList.add("form-group");
  const i = document.createElement("label");
  i.textContent = "Type", n.appendChild(i);
  const r = document.createElement("select");
  r.classList.add(e);
  const a = document.createElement("optgroup");
  a.label = "Effects";
  for (const s of Am) {
    const l = document.createElement("option");
    l.value = s.value, l.textContent = s.label, s.value === t && (l.selected = !0), a.appendChild(l);
  }
  r.appendChild(a);
  const o = document.createElement("optgroup");
  o.label = "Tweens";
  for (const s of Ev) {
    const l = document.createElement("option");
    l.value = s.value, l.textContent = s.label, s.value === t && (l.selected = !0), o.appendChild(l);
  }
  return r.appendChild(o), n.appendChild(r), n;
}
c(Sv, "buildEffectTypeSelect");
function Du(t) {
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
  const n = Am.find((i) => i.value === e);
  return (n == null ? void 0 : n.label) ?? e;
}
c(Du, "summarizeEffectConfig");
function Pu(t, e, n, i) {
  const r = t.name ?? "float", a = vc(), o = Zi(), s = document.createElement("div");
  s.classList.add("idle-anim__slot", "is-collapsed", n), s.dataset.index = String(e);
  const l = document.createElement("div");
  l.classList.add("idle-anim__slot-header");
  const u = document.createElement("i");
  u.classList.add("fa-solid", "fa-chevron-right", "idle-anim__slot-chevron");
  const d = document.createElement("span");
  d.classList.add("idle-anim__slot-title"), d.textContent = `${i} ${e + 1}`;
  const m = document.createElement("span");
  m.classList.add("idle-anim__slot-summary"), m.textContent = Du(t);
  const f = document.createElement("button");
  f.type = "button", f.classList.add("idle-anim__slot-remove"), f.innerHTML = '<i class="fa-solid fa-xmark"></i>', f.title = "Remove effect", l.append(u, d, m, f), s.appendChild(l);
  const g = document.createElement("div");
  g.classList.add("idle-anim__slot-body");
  const p = Sv(r, "ti-effect__type");
  g.appendChild(p);
  const y = document.createElement("div");
  y.classList.add("idle-anim__type-fields"), g.appendChild(y);
  function b(w, S) {
    y.innerHTML = "";
    const I = km[w];
    if (I)
      for (const A of I) {
        const O = S[A.key] ?? A.default;
        if (A.type === "color")
          y.appendChild(ic(A.label, `ti-effect__${A.key}`, O));
        else if (A.type === "select") {
          let x;
          A.options === "interpolation" ? x = o.map((M) => ({ value: M, label: M, selected: M === O })) : Array.isArray(A.options) ? x = A.options.map((M) => ({ value: M.value, label: M.label, selected: M.value === O })) : x = a.map((M) => ({ value: M, label: M, selected: M === O })), y.appendChild($i(A.label, `ti-effect__${A.key}`, x));
        } else
          y.appendChild(Fi(A.label, `ti-effect__${A.key}`, O, A.attrs ?? {}));
      }
  }
  c(b, "renderParams"), b(r, t), s.appendChild(g);
  const v = s.querySelector(".ti-effect__type");
  return v == null || v.addEventListener("change", () => {
    b(v.value, {});
  }), l.addEventListener("click", (w) => {
    if (!w.target.closest(".idle-anim__slot-remove") && (s.classList.toggle("is-collapsed"), s.classList.contains("is-collapsed"))) {
      const S = _m(s);
      S && (m.textContent = Du(S));
    }
  }), f.addEventListener("click", (w) => {
    w.stopPropagation();
    const S = s.parentElement;
    s.remove(), S && ls(S, n, i);
  }), Im(s, { dropGroup: "effect" }), s;
}
c(Pu, "buildEffectSlot");
function _m(t) {
  var r;
  const e = ((r = t.querySelector(".ti-effect__type")) == null ? void 0 : r.value) ?? "float", n = km[e], i = { name: e };
  if (n)
    for (const a of n) {
      const o = t.querySelector(`.ti-effect__${a.key}`);
      if (o)
        if (a.type === "color")
          i[a.key] = o.value;
        else if (a.type === "select")
          i[a.key] = o.value;
        else {
          const s = Number.parseFloat(o.value);
          Number.isNaN(s) || (i[a.key] = s);
        }
    }
  return i;
}
c(_m, "readEffectSlot");
function Ru(t) {
  if (!t) return "";
  const e = t.type ?? "tile-prop", n = t.mode ?? "bounce", i = n.charAt(0).toUpperCase() + n.slice(1);
  if (e === "tile-tint")
    return `${i} Tint ${t.fromColor ?? "?"} → ${t.toColor ?? "?"} (${t.period ?? "?"}ms)`;
  if (e === "tile-scale") {
    const o = t.fromScale != null ? `${Math.round(t.fromScale * 100)}%` : "?", s = t.toScale != null ? `${Math.round(t.toScale * 100)}%` : "?";
    return `${i} Scale ${o} → ${s} (${t.period ?? "?"}ms)`;
  }
  const r = Mm.find((o) => o.value === t.attribute), a = (r == null ? void 0 : r.label) ?? t.attribute ?? "?";
  return `${i} ${a} ${t.from ?? "?"} → ${t.to ?? "?"} (${t.period ?? "?"}ms)`;
}
c(Ru, "summarizeClickConfig");
function Hu(t, e) {
  const n = t.type ?? "tile-prop", i = t.mode ?? "bounce", r = vc(), a = document.createElement("div");
  a.classList.add("idle-anim__slot", "is-collapsed", "ti-click-slot"), a.dataset.index = String(e);
  const o = document.createElement("div");
  o.classList.add("idle-anim__slot-header");
  const s = document.createElement("i");
  s.classList.add("fa-solid", "fa-chevron-right", "idle-anim__slot-chevron");
  const l = document.createElement("span");
  l.classList.add("idle-anim__slot-title"), l.textContent = `Animation ${e + 1}`;
  const u = document.createElement("span");
  u.classList.add("idle-anim__slot-summary"), u.textContent = Ru(t);
  const d = document.createElement("button");
  d.type = "button", d.classList.add("idle-anim__slot-remove"), d.innerHTML = '<i class="fa-solid fa-xmark"></i>', d.title = "Remove animation", o.append(s, l, u, d), a.appendChild(o);
  const m = document.createElement("div");
  m.classList.add("idle-anim__slot-body");
  const f = document.createElement("div");
  f.classList.add("idle-anim__range-row"), f.appendChild($i("Mode", "ti-click__mode", [
    { value: "bounce", label: "Bounce", selected: i === "bounce" },
    { value: "toggle", label: "Toggle", selected: i === "toggle" }
  ])), f.appendChild($i("Type", "ti-click__type", [
    { value: "tile-prop", label: "Numeric", selected: n === "tile-prop" },
    { value: "tile-tint", label: "Tint", selected: n === "tile-tint" },
    { value: "tile-scale", label: "Scale", selected: n === "tile-scale" }
  ])), m.appendChild(f);
  const g = document.createElement("div");
  g.classList.add("idle-anim__type-fields"), m.appendChild(g);
  function p(w, S) {
    if (g.innerHTML = "", w === "tile-tint") {
      const I = Zi(), A = S.fromColor ?? ji.fromColor, O = S.toColor ?? ji.toColor, x = S.mode ?? "oklch", M = document.createElement("div");
      M.classList.add("idle-anim__range-row"), M.appendChild(ic("From", "ti-click__from-color", A)), M.appendChild(ic("To", "ti-click__to-color", O)), g.appendChild(M), g.appendChild($i(
        "Interpolation",
        "ti-click__color-mode",
        I.map((D) => ({ value: D, label: D, selected: D === x }))
      ));
    } else if (w === "tile-scale") {
      const I = S.fromScale ?? qa.fromScale, A = S.toScale ?? qa.toScale, O = document.createElement("div");
      O.classList.add("idle-anim__range-row"), O.appendChild(Fi("From", "ti-click__from-scale", I, { step: "0.01", min: "0.01" })), O.appendChild(Fi("To", "ti-click__to-scale", A, { step: "0.01", min: "0.01" })), g.appendChild(O);
      const x = document.createElement("p");
      x.classList.add("idle-anim__hint"), x.textContent = "1.0 = original size. Scales from center.", g.appendChild(x);
    } else {
      const I = S.attribute ?? Di.attribute, A = S.from ?? Di.from, O = S.to ?? Di.to;
      g.appendChild($i(
        "Attribute",
        "ti-click__attribute",
        Mm.map((M) => ({ value: M.value, label: M.label, selected: M.value === I }))
      ));
      const x = document.createElement("div");
      x.classList.add("idle-anim__range-row"), x.appendChild(Fi("From", "ti-click__from", A, { step: "0.01" })), x.appendChild(Fi("To", "ti-click__to", O, { step: "0.01" })), g.appendChild(x);
    }
  }
  c(p, "renderTypeFields"), p(n, t);
  const y = t.period ?? (n === "tile-tint" ? ji.period : Di.period), b = t.easing ?? "easeOutCubic";
  m.appendChild(Fi("Period (ms)", "ti-click__period", y, { min: "50", step: "50" })), m.appendChild($i(
    "Easing",
    "ti-click__easing",
    r.map((w) => ({ value: w, label: w, selected: w === b }))
  )), a.appendChild(m);
  const v = a.querySelector(".ti-click__type");
  return v == null || v.addEventListener("change", () => {
    const w = v.value;
    p(w, w === "tile-tint" ? ji : w === "tile-scale" ? qa : Di);
  }), o.addEventListener("click", (w) => {
    if (!w.target.closest(".idle-anim__slot-remove") && (a.classList.toggle("is-collapsed"), a.classList.contains("is-collapsed"))) {
      const S = Nm(a);
      S && (u.textContent = Ru(S));
    }
  }), d.addEventListener("click", (w) => {
    w.stopPropagation();
    const S = a.parentElement;
    a.remove(), S && ls(S, "ti-click-slot", "Animation");
  }), Im(a, { dropGroup: "click" }), a;
}
c(Hu, "buildClickSlot");
function Nm(t) {
  var u, d, m, f, g, p, y, b, v, w, S, I, A, O;
  const e = ((u = t.querySelector(".ti-click__type")) == null ? void 0 : u.value) ?? "tile-prop", n = ((d = t.querySelector(".ti-click__mode")) == null ? void 0 : d.value) ?? "bounce", i = Number.parseInt((m = t.querySelector(".ti-click__period")) == null ? void 0 : m.value, 10), r = ((f = t.querySelector(".ti-click__easing")) == null ? void 0 : f.value) ?? "easeOutCubic";
  if (!i || i <= 0) return null;
  const a = { mode: n, period: i, easing: r };
  if (e === "tile-tint") {
    const x = ((g = t.querySelector(".ti-click__from-color")) == null ? void 0 : g.value) ?? ((p = t.querySelector(".ti-click__from-color-text")) == null ? void 0 : p.value) ?? ji.fromColor, M = ((y = t.querySelector(".ti-click__to-color")) == null ? void 0 : y.value) ?? ((b = t.querySelector(".ti-click__to-color-text")) == null ? void 0 : b.value) ?? ji.toColor, D = ((v = t.querySelector(".ti-click__color-mode")) == null ? void 0 : v.value) ?? "oklch";
    return { type: "tile-tint", fromColor: x, toColor: M, mode: D, ...a };
  }
  if (e === "tile-scale") {
    const x = Number.parseFloat((w = t.querySelector(".ti-click__from-scale")) == null ? void 0 : w.value), M = Number.parseFloat((S = t.querySelector(".ti-click__to-scale")) == null ? void 0 : S.value);
    return Number.isNaN(x) || Number.isNaN(M) || x <= 0 || M <= 0 ? null : { type: "tile-scale", fromScale: x, toScale: M, ...a };
  }
  const o = ((I = t.querySelector(".ti-click__attribute")) == null ? void 0 : I.value) ?? Di.attribute, s = Number.parseFloat((A = t.querySelector(".ti-click__from")) == null ? void 0 : A.value), l = Number.parseFloat((O = t.querySelector(".ti-click__to")) == null ? void 0 : O.value);
  return Number.isNaN(s) || Number.isNaN(l) ? null : { type: "tile-prop", attribute: o, from: s, to: l, ...a };
}
c(Nm, "readClickSlot");
function ls(t, e, n) {
  t.querySelectorAll(`.${e}`).forEach((r, a) => {
    r.dataset.index = String(a);
    const o = r.querySelector(".idle-anim__slot-title");
    o && (o.textContent = `${n} ${a + 1}`);
  });
}
c(ls, "renumberSlots");
function xs(t, { heading: e, hint: n, configs: i, slotClass: r, titlePrefix: a, dropGroup: o, defaultEffect: s, addLabel: l }) {
  const u = document.createElement("h3");
  u.classList.add("ti-section-heading"), u.textContent = e, t.appendChild(u);
  const d = document.createElement("p");
  d.classList.add("idle-anim__hint"), d.textContent = n, t.appendChild(d);
  const m = document.createElement("div");
  m.classList.add("idle-anim__slots", `${r}s`);
  for (let p = 0; p < i.length; p++)
    m.appendChild(Pu(i[p], p, r, a));
  t.appendChild(m);
  const f = ["ti-always-slot", "ti-idle-slot", "ti-hover-slot"];
  Om(m, {
    dropGroup: o,
    onDrop(p) {
      if (p.parentElement === m)
        for (const y of f)
          y !== r && p.classList.contains(y) && p.classList.replace(y, r);
      ls(m, r, a);
    }
  });
  const g = document.createElement("button");
  return g.type = "button", g.classList.add("idle-anim__add"), g.innerHTML = `<i class="fa-solid fa-plus"></i> ${l}`, g.addEventListener("click", () => {
    const p = m.querySelectorAll(`.${r}`).length, y = Pu(s, p, r, a);
    y.classList.remove("is-collapsed"), m.appendChild(y);
  }), t.appendChild(g), m;
}
c(xs, "buildEffectCategory");
function Tv(t) {
  const e = Ic(t) ?? { always: [], idle: [], hover: [], click: [] }, n = document.createElement("section");
  n.classList.add("eidolon-tile-interactions"), xs(n, {
    heading: "Always",
    hint: "Runs continuously, ignores pointer state.",
    configs: e.always ?? [],
    slotClass: "ti-always-slot",
    titlePrefix: "Effect",
    dropGroup: "effect",
    defaultEffect: { name: "embers" },
    addLabel: "Add Effect"
  }), xs(n, {
    heading: "Idle",
    hint: "Plays by default. Stops when pointer enters the tile.",
    configs: e.idle ?? [],
    slotClass: "ti-idle-slot",
    titlePrefix: "Effect",
    dropGroup: "effect",
    defaultEffect: { name: "float" },
    addLabel: "Add Idle Effect"
  }), xs(n, {
    heading: "Hover",
    hint: "Plays while pointer is over the tile.",
    configs: e.hover ?? [],
    slotClass: "ti-hover-slot",
    titlePrefix: "Effect",
    dropGroup: "effect",
    defaultEffect: { name: "scale" },
    addLabel: "Add Hover Effect"
  });
  const i = document.createElement("h3");
  i.classList.add("ti-section-heading"), i.textContent = "Click", n.appendChild(i);
  const r = document.createElement("p");
  r.classList.add("idle-anim__hint"), r.textContent = "One-shot animation on click.", n.appendChild(r);
  const a = e.click ?? [], o = document.createElement("div");
  o.classList.add("idle-anim__slots", "ti-click-slots");
  for (let b = 0; b < a.length; b++)
    o.appendChild(Hu(a[b], b));
  n.appendChild(o), Om(o, {
    dropGroup: "click",
    onDrop() {
      ls(o, "ti-click-slot", "Animation");
    }
  });
  const s = document.createElement("button");
  s.type = "button", s.classList.add("idle-anim__add"), s.innerHTML = '<i class="fa-solid fa-plus"></i> Add Animation', s.addEventListener("click", () => {
    const b = o.querySelectorAll(".ti-click-slot").length, v = Hu(qa, b);
    v.classList.remove("is-collapsed"), o.appendChild(v);
  }), n.appendChild(s);
  const l = document.createElement("h3");
  l.classList.add("ti-section-heading"), l.textContent = "Click Macro", n.appendChild(l);
  const u = document.createElement("p");
  u.classList.add("idle-anim__hint"), u.textContent = "Execute a macro when clicked. Drag a macro here or paste its UUID.", n.appendChild(u);
  const d = document.createElement("div");
  d.classList.add("form-group", "ti-macro");
  const m = document.createElement("label");
  m.textContent = "Macro", d.appendChild(m);
  const f = document.createElement("input");
  f.type = "text", f.classList.add("ti-macro__uuid"), f.placeholder = "Drag a macro here or paste UUID", f.value = e.macro ?? "", d.appendChild(f);
  const g = document.createElement("button");
  g.type = "button", g.classList.add("ti-macro__clear"), g.innerHTML = '<i class="fa-solid fa-xmark"></i>', g.title = "Clear macro", g.addEventListener("click", () => {
    f.value = "";
  }), d.appendChild(g), d.addEventListener("dragover", (b) => {
    b.preventDefault(), b.dataTransfer.dropEffect = "link";
  }), d.addEventListener("drop", (b) => {
    b.preventDefault();
    try {
      const v = b.dataTransfer.getData("text/plain"), w = JSON.parse(v);
      w.type === "Macro" && w.uuid && (f.value = w.uuid);
    } catch {
    }
  }), n.appendChild(d);
  const p = document.createElement("div");
  p.classList.add("idle-anim__actions");
  const y = document.createElement("button");
  return y.type = "button", y.classList.add("idle-anim__preview"), y.innerHTML = '<i class="fa-solid fa-play"></i> Preview', p.append(y), n.appendChild(p), n;
}
c(Tv, "buildSectionContent");
function $s(t, e) {
  const n = [];
  for (const i of t.querySelectorAll(`.${e}`)) {
    const r = _m(i);
    r && n.push(r);
  }
  return n;
}
c($s, "readAllEffectSlots");
function Lv(t) {
  const e = [];
  for (const n of t.querySelectorAll(".ti-click-slot")) {
    const i = Nm(n);
    i && e.push(i);
  }
  return e;
}
c(Lv, "readAllClickConfigs");
function qu(t) {
  var i, r;
  const e = ((r = (i = t.querySelector(".ti-macro__uuid")) == null ? void 0 : i.value) == null ? void 0 : r.trim()) || null, n = {
    always: $s(t, "ti-always-slot"),
    idle: $s(t, "ti-idle-slot"),
    hover: $s(t, "ti-hover-slot"),
    click: Lv(t)
  };
  return e && (n.macro = e), n;
}
c(qu, "readFormConfig");
function xm(t, e) {
  var l;
  const n = Xt(e);
  if (!n) return;
  const i = Cv(t);
  if (!i) return;
  const r = mf(t, n, vv, "Animations", wv);
  if (!r || r.querySelector(".eidolon-tile-interactions")) return;
  const a = r.closest("form");
  a && (a.noValidate = !0);
  const o = Tv(i);
  r.appendChild(o), (l = t.setPosition) == null || l.call(t, { height: "auto" });
  const s = r.querySelector(".idle-anim__preview");
  s == null || s.addEventListener("click", () => {
    const u = i.object;
    if (!u) return;
    if (En) {
      En.detach(), En = null, s.classList.remove("is-active"), s.innerHTML = '<i class="fa-solid fa-play"></i> Preview';
      return;
    }
    const d = qu(o);
    (d.always.length > 0 || d.idle.length > 0 || d.hover.length > 0) && (En = new Ii(u, d), En.start("idle"), s.classList.add("is-active"), s.innerHTML = '<i class="fa-solid fa-stop"></i> Stop');
  }), a && a.addEventListener("submit", () => {
    En && (En.detach(), En = null);
    const u = qu(o), d = u.always.length > 0 || u.idle.length > 0 || u.hover.length > 0 || u.click.length > 0 || !!u.macro, m = {
      [`flags.${wa}.-=${Fu}`]: null,
      [`flags.${wa}.-=${yv}`]: null,
      [`flags.${wa}.-=${bv}`]: null
    };
    i.update(m).then(() => {
      if (d)
        return i.update({ [`flags.${wa}.${Fu}`]: u });
    });
  });
}
c(xm, "renderAnimationSection");
const go = /* @__PURE__ */ new Map();
function $m(t) {
  const e = go.get(t);
  e && (e.controller.abort(), go.delete(t), e.restore());
}
c($m, "stopLoopByKey");
function Fm(t) {
  const e = `${t}::`;
  for (const n of [...go.keys()])
    n.startsWith(e) && $m(n);
}
c(Fm, "stopLoopsForTile");
function Dm() {
  for (const t of [...go.keys()])
    $m(t);
}
c(Dm, "stopAllLoops");
const Pm = "eidolon-utilities", Rm = ["tile-animations", "tile-interactions", "idle-animation"];
function Iv() {
  Dm(), Tm();
}
c(Iv, "onCanvasTearDown");
function Ov() {
  Dm(), Tm();
}
c(Ov, "onCanvasReady");
function Av(t, e) {
  var r;
  const n = (r = e == null ? void 0 : e.flags) == null ? void 0 : r[Pm];
  !n || !Rm.some((a) => a in n || `-=${a}` in n) || (Fm(t.id), fv(t));
}
c(Av, "onUpdateTile");
function kv(t) {
  Fm(t.id), mv(t);
}
c(kv, "onDeleteTile");
function Mv(t, e) {
  xm(t, e);
}
c(Mv, "onRenderTileConfig");
function _v(t, e) {
  var r;
  const n = (r = e == null ? void 0 : e.flags) == null ? void 0 : r[Pm];
  !n || !Rm.some((a) => a in n || `-=${a}` in n) || hv(t);
}
c(_v, "onUpdateDrawing");
function Nv(t) {
  gv(t);
}
c(Nv, "onDeleteDrawing");
function xv(t, e) {
  xm(t, e);
}
c(xv, "onRenderDrawingConfig");
function $v() {
  Hooks.on("canvasTearDown", Iv), Hooks.on("canvasReady", Ov), Hooks.on("updateTile", Av), Hooks.on("deleteTile", kv), Hooks.on("renderTileConfig", Mv), Hooks.on("updateDrawing", _v), Hooks.on("deleteDrawing", Nv), Hooks.on("renderDrawingConfig", xv);
}
c($v, "registerTileInteractionHooks");
$v();
//# sourceMappingURL=eidolon-utilities.js.map
