var nu = Object.defineProperty;
var dh = Object.getPrototypeOf;
var fh = Reflect.get;
var iu = (t) => {
  throw TypeError(t);
};
var mh = (t, e, n) => e in t ? nu(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var c = (t, e) => nu(t, "name", { value: e, configurable: !0 });
var ve = (t, e, n) => mh(t, typeof e != "symbol" ? e + "" : e, n), Ts = (t, e, n) => e.has(t) || iu("Cannot " + n);
var g = (t, e, n) => (Ts(t, e, "read from private field"), n ? n.call(t) : e.get(t)), M = (t, e, n) => e.has(t) ? iu("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, n), I = (t, e, n, i) => (Ts(t, e, "write to private field"), i ? i.call(t, n) : e.set(t, n), n), S = (t, e, n) => (Ts(t, e, "access private method"), n);
var Ls = (t, e, n, i) => ({
  set _(r) {
    I(t, e, r, n);
  },
  get _() {
    return g(t, e, i);
  }
}), qe = (t, e, n) => fh(dh(t), n, e);
const L = "eidolon-utilities", Ga = "timeTriggerActive", Js = "timeTriggerHideWindow", Xs = "timeTriggerShowPlayerWindow", Qs = "timeTriggerAllowRealTime", gd = "timeTriggers", Ia = "timeTriggerHistory", Zs = "debug", el = "timeFormat", tl = "manageTime", nl = "secondsPerRound";
const hh = [-30, -15, -5, 5, 15, 30], Wi = 1440 * 60, ka = "playSound", ca = 6;
function C(t, e) {
  var n, i;
  return (i = (n = game.i18n) == null ? void 0 : n.has) != null && i.call(n, t) ? game.i18n.localize(t) : e;
}
c(C, "localize");
function Pt(t) {
  return typeof t != "string" ? "" : t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
c(Pt, "escapeHtml");
function Ht(t) {
  var e;
  return t == null ? t : (e = foundry == null ? void 0 : foundry.utils) != null && e.duplicate ? foundry.utils.duplicate(t) : JSON.parse(JSON.stringify(t));
}
c(Ht, "duplicateData");
function gh() {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
c(gh, "generateTriggerId");
function pd(t) {
  if (typeof t != "string") return null;
  const e = t.trim();
  if (!e) return null;
  const n = e.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (!n) return null;
  const i = Number(n[1]), r = Number(n[2]), a = n[3] !== void 0 ? Number(n[3]) : 0;
  return !Number.isInteger(i) || !Number.isInteger(r) || !Number.isInteger(a) || i < 0 || i > 23 || r < 0 || r > 59 || a < 0 || a > 59 ? null : i * 3600 + r * 60 + a;
}
c(pd, "parseTriggerTimeToSeconds");
function br() {
  var t, e;
  return ((t = game.scenes) == null ? void 0 : t.current) ?? ((e = game.scenes) == null ? void 0 : e.active) ?? null;
}
c(br, "getActiveScene");
function Qt(t) {
  return (t == null ? void 0 : t.object) ?? (t == null ? void 0 : t.document) ?? null;
}
c(Qt, "getSceneFromApplication");
function Xe(t) {
  return t && typeof t.getFlag == "function" && typeof t.setFlag == "function";
}
c(Xe, "hasSceneDocument");
const il = /* @__PURE__ */ new Set(), rl = /* @__PURE__ */ new Set(), al = /* @__PURE__ */ new Set(), ol = /* @__PURE__ */ new Set();
let Li = !1, Fr = !1, za = ca, Ya = "12h", ru = !1;
function Is(t) {
  Li = !!t;
  for (const e of il)
    try {
      e(Li);
    } catch (n) {
      console.error(`${L} | Debug change handler failed`, n);
    }
}
c(Is, "notifyDebugChange");
function ks(t) {
  Fr = !!t;
  for (const e of rl)
    try {
      e(Fr);
    } catch (n) {
      console.error(`${L} | Manage time change handler failed`, n);
    }
}
c(ks, "notifyManageTimeChange");
function yd(t) {
  return t === "24h" ? "24h" : "12h";
}
c(yd, "normalizeTimeFormatValue");
function Ec(t) {
  const e = Number(t);
  return !Number.isFinite(e) || e <= 0 ? ca : e;
}
c(Ec, "normalizeSecondsPerRoundValue");
function Os(t) {
  const e = Ec(t);
  za = e;
  for (const n of al)
    try {
      n(e);
    } catch (i) {
      console.error(`${L} | Seconds-per-round change handler failed`, i);
    }
}
c(Os, "notifySecondsPerRoundChange");
function As(t) {
  const e = yd(t);
  Ya = e;
  for (const n of ol)
    try {
      n(e);
    } catch (i) {
      console.error(`${L} | Time format change handler failed`, i);
    }
}
c(As, "notifyTimeFormatChange");
function ph() {
  var e;
  if (ru) return;
  if (ru = !0, !((e = game == null ? void 0 : game.settings) != null && e.register)) {
    console.warn(
      `${L} | game.settings.register is unavailable. Module settings could not be registered.`
    );
    return;
  }
  const t = typeof game.settings.registerChange == "function";
  game.settings.register(L, Zs, {
    name: C("EIDOLON.TimeTrigger.DebugSettingName", "Enable debug logging"),
    hint: C(
      "EIDOLON.TimeTrigger.DebugSettingHint",
      "Write detailed time-trigger diagnostics to the browser console."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: t ? void 0 : Is
  }), t && game.settings.registerChange(L, Zs, Is), Li = Cc(), Is(Li), game.settings.register(L, tl, {
    name: C("EIDOLON.TimeTrigger.ManageTimeSettingName", "Manage Game Time"),
    hint: C(
      "EIDOLON.TimeTrigger.ManageTimeSettingHint",
      "Allow Eidolon Utilities to advance world time automatically while the game is unpaused. Warning: This may conflict with other time-management modules."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: t ? void 0 : ks
  }), t && game.settings.registerChange(L, tl, ks), Fr = bh(), ks(Fr), game.settings.register(L, nl, {
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
    default: ca,
    range: { min: 1, max: 3600, step: 1 },
    onChange: t ? void 0 : Os
  }), t && game.settings.registerChange(
    L,
    nl,
    Os
  ), za = Ec(vh()), Os(za), game.settings.register(L, el, {
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
    onChange: t ? void 0 : As
  }), t && game.settings.registerChange(L, el, As), Ya = yd(bd()), As(Ya);
}
c(ph, "registerTimeTriggerSettings");
function Cc() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return !!game.settings.get(L, Zs);
  } catch (e) {
    console.error(`${L} | Failed to read debug setting`, e);
  }
  return !1;
}
c(Cc, "getDebugSetting");
function yh() {
  return Li = Cc(), Li;
}
c(yh, "refreshDebugSettingCache");
function bh() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return !!game.settings.get(L, tl);
  } catch (e) {
    console.error(`${L} | Failed to read manage time setting`, e);
  }
  return !1;
}
c(bh, "getManageTimeSetting");
function bd() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return game.settings.get(L, el) === "24h" ? "24h" : "12h";
  } catch (e) {
    console.error(`${L} | Failed to read time format setting`, e);
  }
  return "12h";
}
c(bd, "getTimeFormatSetting");
function vh() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get) {
      const e = game.settings.get(L, nl);
      return Ec(e);
    }
  } catch (e) {
    console.error(`${L} | Failed to read seconds-per-round setting`, e);
  }
  return ca;
}
c(vh, "getSecondsPerRoundSetting");
function wh(t) {
  if (typeof t != "function")
    return () => {
    };
  il.add(t);
  try {
    t(Li);
  } catch (e) {
    console.error(`${L} | Debug change handler failed`, e);
  }
  return () => {
    il.delete(t);
  };
}
c(wh, "onDebugSettingChange");
function vd(t) {
  if (typeof t != "function")
    return () => {
    };
  rl.add(t);
  try {
    t(Fr);
  } catch (e) {
    console.error(`${L} | Manage time change handler failed`, e);
  }
  return () => {
    rl.delete(t);
  };
}
c(vd, "onManageTimeSettingChange");
function Sc(t) {
  if (typeof t != "function")
    return () => {
    };
  ol.add(t);
  try {
    t(Ya);
  } catch (e) {
    console.error(`${L} | Time format change handler failed`, e);
  }
  return () => {
    ol.delete(t);
  };
}
c(Sc, "onTimeFormatSettingChange");
function Eh(t) {
  if (typeof t != "function")
    return () => {
    };
  al.add(t);
  try {
    t(za);
  } catch (e) {
    console.error(`${L} | Seconds-per-round change handler failed`, e);
  }
  return () => {
    al.delete(t);
  };
}
c(Eh, "onSecondsPerRoundSettingChange");
let ns = !1, sl = !1;
function ll(t) {
  ns = !!t;
}
c(ll, "updateDebugState");
function wd() {
  sl || (sl = !0, ll(Cc()), wh((t) => {
    ll(t), console.info(`${L} | Debug ${ns ? "enabled" : "disabled"}`);
  }));
}
c(wd, "ensureInitialized");
function Tc() {
  return sl || wd(), ns;
}
c(Tc, "shouldLog");
function Ed(t) {
  if (!t.length)
    return [`${L} |`];
  const [e, ...n] = t;
  return typeof e == "string" ? [`${L} | ${e}`, ...n] : [`${L} |`, e, ...n];
}
c(Ed, "formatArgs");
function Ch() {
  wd();
}
c(Ch, "initializeDebug");
function Sh() {
  return ll(yh()), ns;
}
c(Sh, "syncDebugState");
function x(...t) {
  Tc() && console.debug(...Ed(t));
}
c(x, "debugLog");
function tr(...t) {
  Tc() && console.group(...Ed(t));
}
c(tr, "debugGroup");
function Rn() {
  Tc() && console.groupEnd();
}
c(Rn, "debugGroupEnd");
function Gi(t) {
  var r;
  const e = (r = t == null ? void 0 : t.getFlag) == null ? void 0 : r.call(t, L, gd);
  if (!e) return [];
  const n = Ht(e), i = Array.isArray(n) ? n : [];
  return x("Loaded time triggers", {
    sceneId: (t == null ? void 0 : t.id) ?? null,
    count: i.length
  }), i;
}
c(Gi, "getTimeTriggers");
async function Cd(t, e) {
  t != null && t.setFlag && (x("Persisting time triggers", {
    sceneId: t.id,
    count: Array.isArray(e) ? e.length : 0
  }), await t.setFlag(L, gd, e));
}
c(Cd, "setTimeTriggers");
function Th(t) {
  var r;
  const e = (r = t == null ? void 0 : t.getFlag) == null ? void 0 : r.call(t, L, Ia);
  if (!e) return {};
  const n = Ht(e);
  if (!n || typeof n != "object") return {};
  const i = {};
  for (const [a, o] of Object.entries(n))
    typeof o == "number" && Number.isFinite(o) && (i[a] = o);
  return x("Loaded time trigger history", {
    sceneId: (t == null ? void 0 : t.id) ?? null,
    keys: Object.keys(i)
  }), i;
}
c(Th, "getTimeTriggerHistory");
async function Ms(t, e) {
  var l, u, d, m;
  if (!t) return;
  const n = {};
  if (e && typeof e == "object")
    for (const [f, h] of Object.entries(e))
      typeof h == "number" && Number.isFinite(h) && (n[f] = h);
  const i = ((l = t.getFlag) == null ? void 0 : l.call(t, L, Ia)) ?? {}, r = {};
  if (i && typeof i == "object")
    for (const [f, h] of Object.entries(i))
      typeof h == "number" && Number.isFinite(h) && (r[f] = h);
  const a = Object.keys(n), o = Object.keys(r);
  if (typeof ((u = foundry == null ? void 0 : foundry.utils) == null ? void 0 : u.deepEqual) == "function" ? foundry.utils.deepEqual(r, n) : JSON.stringify(r) === JSON.stringify(n)) {
    x("Skip history update because state is unchanged", {
      sceneId: (t == null ? void 0 : t.id) ?? null
    });
    return;
  }
  x("Updating time trigger history", {
    sceneId: (t == null ? void 0 : t.id) ?? null,
    keys: a,
    removedKeys: o.filter((f) => !a.includes(f))
  });
  try {
    o.length && typeof t.unsetFlag == "function" && await t.unsetFlag(L, Ia), a.length && await t.setFlag(L, Ia, n);
  } catch (f) {
    console.error(`${L} | Failed to persist time trigger history`, f), (m = (d = ui.notifications) == null ? void 0 : d.error) == null || m.call(
      d,
      C(
        "EIDOLON.TimeTrigger.HistoryPersistError",
        "Failed to persist the scene's time trigger history."
      )
    );
  }
}
c(Ms, "updateTimeTriggerHistory");
const Ka = /* @__PURE__ */ new Map(), au = /* @__PURE__ */ new Set();
function Lh(t) {
  if (!(t != null && t.id))
    throw new Error(`${L} | Action definitions require an id.`);
  if (Ka.has(t.id))
    throw new Error(`${L} | Duplicate time trigger action id: ${t.id}`);
  Ka.set(t.id, {
    ...t
  }), x("Registered time trigger action", { actionId: t.id });
}
c(Lh, "registerAction");
function ua(t) {
  return Ka.get(t) ?? null;
}
c(ua, "getAction");
function Ih(t) {
  const e = ua(t);
  return e ? typeof e.label == "function" ? e.label() : e.label : t;
}
c(Ih, "getActionLabel");
function ou() {
  return Array.from(Ka.values());
}
c(ou, "listActions");
async function Sd(t, e) {
  var i, r;
  const n = ua(e == null ? void 0 : e.action);
  if (!n || typeof n.execute != "function") {
    const a = C(
      "EIDOLON.TimeTrigger.UnknownAction",
      "Encountered an unknown time trigger action and skipped it."
    );
    (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, a), console.warn(`${L} | Unknown time trigger action`, e), x("Encountered unknown time trigger action", {
      triggerId: (e == null ? void 0 : e.id) ?? null,
      actionId: (e == null ? void 0 : e.action) ?? null
    });
    return;
  }
  x("Executing action handler", {
    actionId: n.id,
    triggerId: (e == null ? void 0 : e.id) ?? null,
    sceneId: (t == null ? void 0 : t.id) ?? null
  }), await n.execute({ scene: t, trigger: e });
}
c(Sd, "executeTriggerAction");
function kh(t) {
  const e = ua(t == null ? void 0 : t.action);
  return !e || typeof e.buildSummaryParts != "function" ? [] : e.buildSummaryParts({ trigger: t, escapeHtml: Pt, localize: C }) ?? [];
}
c(kh, "buildActionSummaryParts");
function Oh(t) {
  const e = ua(t == null ? void 0 : t.action);
  return !e || typeof e.buildFormContent != "function" ? "" : e.buildFormContent({ trigger: t, escapeHtml: Pt, localize: C }) ?? "";
}
c(Oh, "buildActionFormSection");
function Ah(t, e) {
  const n = ua(t == null ? void 0 : t.action);
  !n || typeof n.prepareFormData != "function" || n.prepareFormData({ trigger: t, formData: e });
}
c(Ah, "applyActionFormData");
function Mh(t, e, n) {
  var a, o;
  const i = `${(t == null ? void 0 : t.id) ?? "unknown"}:${(e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.action) ?? "unknown"}:${n}`;
  if (au.has(i)) return;
  au.add(i);
  const r = C(
    "EIDOLON.TimeTrigger.MissingDataWarning",
    "A scene time trigger is missing required data and was skipped."
  );
  (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, r), console.warn(`${L} | Missing trigger data (${n})`, { scene: t == null ? void 0 : t.id, trigger: e });
}
c(Mh, "warnMissingTriggerData");
async function _h({ scene: t, trigger: e }) {
  var a, o, s, l, u;
  const n = (s = (o = (a = e == null ? void 0 : e.data) == null ? void 0 : a.path) == null ? void 0 : o.trim) == null ? void 0 : s.call(o);
  if (!n) {
    Mh(t, e, "missing-audio-path");
    return;
  }
  const i = {
    src: n,
    autoplay: !0,
    loop: !1
  }, r = (() => {
    var d, m, f, h, p;
    return typeof ((m = (d = foundry == null ? void 0 : foundry.audio) == null ? void 0 : d.AudioHelper) == null ? void 0 : m.play) == "function" ? foundry.audio.AudioHelper.play(i, !0) : typeof ((h = (f = game == null ? void 0 : game.audio) == null ? void 0 : f.constructor) == null ? void 0 : h.play) == "function" ? game.audio.constructor.play(i, !0) : typeof ((p = game == null ? void 0 : game.audio) == null ? void 0 : p.play) == "function" ? game.audio.play(i, !0) : null;
  })();
  if (!r) {
    console.error(`${L} | Foundry audio helper is unavailable`), (u = (l = ui.notifications) == null ? void 0 : l.error) == null || u.call(
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
c(_h, "executePlaySoundAction");
Lh({
  id: ka,
  label: /* @__PURE__ */ c(() => C("EIDOLON.TimeTrigger.ActionPlaySound", "Play Sound"), "label"),
  execute: _h,
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
var ld;
const { ApplicationV2: Yn, HandlebarsApplicationMixin: Kn } = ((ld = foundry.applications) == null ? void 0 : ld.api) ?? {};
if (!Yn || !Kn)
  throw new Error(
    `${L} | ApplicationV2 API unavailable. Update Foundry VTT to v13 or newer.`
  );
const Bn = "AM", Ii = "PM";
function Hn() {
  return bd();
}
c(Hn, "getConfiguredTimeFormat");
function is(t) {
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
c(is, "parseCanonicalTimeString");
function Yt({ hours: t, minutes: e, seconds: n }) {
  if (!Number.isInteger(t) || !Number.isInteger(e) || t < 0 || t > 23 || e < 0 || e > 59) return null;
  const i = String(t).padStart(2, "0"), r = String(e).padStart(2, "0");
  if (Number.isInteger(n)) {
    if (n < 0 || n > 59) return null;
    const a = String(n).padStart(2, "0");
    return `${i}:${r}:${a}`;
  }
  return `${i}:${r}`;
}
c(Yt, "formatCanonicalTime");
function xh(t, { format: e } = {}) {
  if (!t || typeof t != "object") return null;
  const n = Number(t.hour), i = Number(t.minute), r = t.second !== void 0 && t.second !== null, a = r ? Number(t.second) : null, o = r && Number.isFinite(a) ? Math.floor(Math.max(0, Math.min(59, a))) : null;
  if (!Number.isFinite(n) || !Number.isFinite(i)) return null;
  const s = e ?? Hn();
  return Ja(
    {
      hours: n,
      minutes: i,
      seconds: o
    },
    s
  );
}
c(xh, "formatTimeComponentsForDisplay");
function $h(t, { format: e } = {}) {
  const n = is(t);
  if (!n) return "";
  const i = e ?? Hn();
  return Ja(n, i);
}
c($h, "formatTriggerTimeForDisplay");
function Ja(t, e = "12h") {
  if (!t) return "";
  const { hours: n, minutes: i, seconds: r = null } = t;
  if (!Number.isInteger(n) || !Number.isInteger(i)) return "";
  const a = Number.isInteger(r);
  if (e === "24h") {
    const f = `${String(n).padStart(2, "0")}:${String(i).padStart(2, "0")}`;
    return a ? `${f}:${String(r).padStart(2, "0")}` : f;
  }
  const o = n >= 12 ? Ii : Bn, s = n % 12 === 0 ? 12 : n % 12, l = String(s), u = String(i).padStart(2, "0"), d = `${l}:${u}`, m = o === Bn ? C("EIDOLON.TimeTrigger.TimePeriodAM", Bn) : C("EIDOLON.TimeTrigger.TimePeriodPM", Ii);
  if (a) {
    const f = String(r).padStart(2, "0");
    return `${d}:${f} ${m}`;
  }
  return `${d} ${m}`;
}
c(Ja, "formatTimeParts");
function su(t, e = Hn()) {
  const n = is(t);
  if (e === "24h")
    return {
      format: e,
      canonical: n ? Yt(n) ?? "" : "",
      hour: n ? String(n.hours).padStart(2, "0") : "",
      minute: n ? String(n.minutes).padStart(2, "0") : ""
    };
  if (!n)
    return {
      format: e,
      canonical: "",
      hour: "",
      minute: "",
      period: Bn
    };
  const i = n.hours >= 12 ? Ii : Bn, r = n.hours % 12 === 0 ? 12 : n.hours % 12;
  return {
    format: e,
    canonical: Yt(n) ?? "",
    hour: String(r),
    minute: String(n.minutes).padStart(2, "0"),
    period: i
  };
}
c(su, "getTimeFormValues");
function Nh({ hour: t, minute: e, period: n, time: i }, r = Hn()) {
  if (r === "24h") {
    const h = typeof t == "string" ? t.trim() : "", p = typeof e == "string" ? e.trim() : "", y = typeof i == "string" ? i.trim() : "";
    if (!h && !p && y) {
      const E = is(y);
      return E ? { canonical: Yt(E) ?? "", error: null } : {
        canonical: "",
        error: C(
          "EIDOLON.TimeTrigger.TimeFormatInvalid24",
          "Enter a valid time in HH:MM format."
        )
      };
    }
    if (!h || !p)
      return {
        canonical: "",
        error: C("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.")
      };
    const w = Number(h), b = Number(p);
    return !Number.isInteger(w) || w < 0 || w > 23 ? {
      canonical: "",
      error: C(
        "EIDOLON.TimeTrigger.TimeFormatInvalid24",
        "Enter a valid time in HH:MM format."
      )
    } : !Number.isInteger(b) || b < 0 || b > 59 ? {
      canonical: "",
      error: C(
        "EIDOLON.TimeTrigger.TimeFormatInvalid24",
        "Enter a valid time in HH:MM format."
      )
    } : { canonical: Yt({
      hours: w,
      minutes: b
    }) ?? "", error: null };
  }
  const a = typeof t == "string" ? t.trim() : "", o = typeof e == "string" ? e.trim() : "", s = typeof n == "string" ? n.trim().toUpperCase() : "";
  if (!a || !o || !s)
    return { canonical: "", error: C("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.") };
  if (s !== Bn && s !== Ii)
    return { canonical: "", error: C("EIDOLON.TimeTrigger.TimeFormatInvalidPeriod", "Select AM or PM.") };
  const l = Number(a), u = Number(o);
  if (!Number.isInteger(l) || l < 1 || l > 12)
    return {
      canonical: "",
      error: C("EIDOLON.TimeTrigger.TimeFormatInvalidHour", "Hours must be between 1 and 12.")
    };
  if (!Number.isInteger(u) || u < 0 || u > 59)
    return {
      canonical: "",
      error: C("EIDOLON.TimeTrigger.TimeFormatInvalidMinute", "Minutes must be between 00 and 59.")
    };
  const d = l % 12, f = {
    hours: s === Ii ? d + 12 : d,
    minutes: u
  };
  return {
    canonical: Yt(f) ?? "",
    error: null
  };
}
c(Nh, "normalizeFormTimeInput");
function Fh() {
  return [
    {
      value: Bn,
      label: C("EIDOLON.TimeTrigger.TimePeriodAM", Bn)
    },
    {
      value: Ii,
      label: C("EIDOLON.TimeTrigger.TimePeriodPM", Ii)
    }
  ];
}
c(Fh, "getPeriodOptions");
var ci, di, re, Td, ko, Oo, Ld, ul, dl, Ao, Mo, Id, kd, Od, fl, ml, hl, _o, xo, gl, $o, Ad, Md;
const si = class si extends Kn(Yn) {
  constructor(n = {}) {
    var o;
    const { scene: i, showControls: r, ...a } = n ?? {};
    super(a);
    M(this, re);
    M(this, ci, null);
    M(this, di, null);
    M(this, ko, /* @__PURE__ */ c((n) => {
      var r, a;
      n.preventDefault();
      const i = Number((a = (r = n.currentTarget) == null ? void 0 : r.dataset) == null ? void 0 : a.delta);
      Number.isFinite(i) && (x("Time delta button clicked", { delta: i }), this._advanceTime(i));
    }, "#onDeltaClick"));
    M(this, Oo, /* @__PURE__ */ c((n) => {
      var i, r;
      n.preventDefault(), !(!this.showControls || !((i = game.user) != null && i.isGM)) && (x("Time value double clicked", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null }), S(this, re, Ld).call(this));
    }, "#onTimeDoubleClick"));
    M(this, Ao, /* @__PURE__ */ c((n) => {
      if (this.isEditingTime && !this._commitTimeInProgress)
        if (n.key === "Enter") {
          n.preventDefault();
          const i = n.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
          S(this, re, dl).call(this, r);
        } else n.key === "Escape" && (n.preventDefault(), S(this, re, ul).call(this));
    }, "#onTimeInputKeydown"));
    M(this, Mo, /* @__PURE__ */ c((n) => {
      if (!this.isEditingTime || this._commitTimeInProgress || this._suppressBlurCommit) return;
      const i = n.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
      S(this, re, dl).call(this, r);
    }, "#onTimeInputBlur"));
    M(this, _o, /* @__PURE__ */ c((n) => {
      const i = !!n;
      if (this.manageTimeEnabled === i) return;
      this.manageTimeEnabled = i, (this.rendered ?? this.isRendered ?? !1) && this.render({ force: !0 });
    }, "#handleManageTimeChange"));
    M(this, xo, /* @__PURE__ */ c(async (n) => {
      var a, o, s, l, u, d, m, f, h;
      if (n.preventDefault(), !this.showControls || !((a = game.user) != null && a.isGM)) return;
      if (!this.manageTimeEnabled) {
        (s = (o = ui.notifications) == null ? void 0 : o.error) == null || s.call(
          o,
          C(
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
          C(
            "EIDOLON.TimeTrigger.SceneUnavailable",
            "The active scene is unavailable. Try again after reloading the world."
          )
        );
        return;
      }
      const r = !this.sceneAllowsRealTime;
      try {
        await i.setFlag(L, Qs, r), this.sceneAllowsRealTime = r;
        const p = r ? C(
          "EIDOLON.TimeTrigger.SceneRealTimeEnabled",
          "Automatic real-time flow enabled for this scene."
        ) : C(
          "EIDOLON.TimeTrigger.SceneRealTimeDisabled",
          "Automatic real-time flow disabled for this scene."
        );
        (m = (d = ui.notifications) == null ? void 0 : d.info) == null || m.call(d, p);
      } catch (p) {
        console.error(`${L} | Failed to toggle scene real-time flow`, p), (h = (f = ui.notifications) == null ? void 0 : f.error) == null || h.call(
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
    M(this, $o, /* @__PURE__ */ c(() => {
      (this.rendered ?? this.isRendered ?? !1) && (this.isEditingTime && (this.editValue = S(this, re, fl).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    this.scene = i ?? null, this.showControls = typeof r == "boolean" ? r : !!((o = game.user) != null && o.isGM), this.isEditingTime = !1, this.editValue = "", this._commitTimeInProgress = !1, this._suppressBlurCommit = !1, this.manageTimeEnabled = !1, this.sceneAllowsRealTime = S(this, re, gl).call(this), I(this, ci, Sc(g(this, $o))), I(this, di, vd(g(this, _o)));
  }
  async _prepareContext() {
    var b, v;
    const n = ((b = game.time) == null ? void 0 : b.components) ?? {}, r = ((n == null ? void 0 : n.second) !== void 0 && (n == null ? void 0 : n.second) !== null ? xh(n) : null) ?? S(this, re, Td).call(this), a = Hn(), o = a === "24h", s = o ? C("EIDOLON.TimeTrigger.EditTimePlaceholder24", "HH:MM") : C("EIDOLON.TimeTrigger.EditTimePlaceholder12", "HH:MM AM/PM"), l = this.showControls ? C(
      "EIDOLON.TimeTrigger.EditTimeHint",
      "Double-click to set a specific time."
    ) : "", u = this.showControls ? C(
      "EIDOLON.TimeTrigger.EditTimeLabel",
      "New time (HH:MM or HH:MM AM/PM)"
    ) : "", d = hh.map((E) => ({
      minutes: E,
      label: E > 0 ? `+${E}` : `${E}`
    })), m = !!this.manageTimeEnabled, f = S(this, re, gl).call(this);
    this.sceneAllowsRealTime = f;
    const h = C(
      "EIDOLON.TimeTrigger.SceneRealTimeEnable",
      "Enable automatic real-time flow for this scene."
    ), p = C(
      "EIDOLON.TimeTrigger.SceneRealTimeDisable",
      "Disable automatic real-time flow for this scene."
    ), y = C(
      "EIDOLON.TimeTrigger.SceneRealTimeManageDisabled",
      "Enable Manage Time in module settings to allow automatic real-time flow."
    );
    return {
      formattedTime: r,
      deltas: d,
      manageTimeEnabled: m,
      sceneAllowsRealTime: f,
      realTimeButtonLabel: m ? f ? p : h : y,
      isGM: ((v = game.user) == null ? void 0 : v.isGM) ?? !1,
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
      return (this.rendered ?? this.isRendered ?? !1) || (x("TimeTriggerWindow close request rerendering", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null
      }), this.render({ force: !0 })), this;
    x("Closing time trigger window", { sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null, force: !0 });
    const i = await super.close(n);
    return S(this, re, Ad).call(this), S(this, re, Md).call(this), i;
  }
  async _advanceTime(n) {
    var r, a, o, s, l, u, d;
    const i = n * 60;
    if (x("Advancing world time", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null, minutes: n, seconds: i }), !((a = game.user) != null && a.isGM)) {
      (s = (o = ui.notifications) == null ? void 0 : o.warn) == null || s.call(o, C("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time."));
      return;
    }
    try {
      await game.time.advance(i);
    } catch (m) {
      console.error(`${L} | Failed to advance time`, m), (u = (l = ui.notifications) == null ? void 0 : l.error) == null || u.call(
        l,
        C("EIDOLON.TimeTrigger.Error", "Failed to update the world time.")
      ), x("Failed to advance time from window", {
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
        x("Binding time trigger interactions", {
          sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
          buttonCount: r.querySelectorAll("[data-delta]").length
        }), r.querySelectorAll("[data-delta]").forEach((u) => {
          u.addEventListener("click", g(this, ko));
        });
        const o = r.querySelector('.time-trigger-window__time-value[data-editable="true"]');
        o && o.addEventListener("dblclick", g(this, Oo), { once: !1 });
        const s = r.querySelector(".time-trigger-window__time-input");
        s && (s.addEventListener("keydown", g(this, Ao)), s.addEventListener("blur", g(this, Mo)), typeof s.focus == "function" && (s.focus(), typeof s.select == "function" && s.select()));
        const l = r.querySelector('[data-action="toggle-real-time"]');
        l && l.addEventListener("click", g(this, xo));
      }
      this._suppressBlurCommit = !1;
    }
  }
};
ci = new WeakMap(), di = new WeakMap(), re = new WeakSet(), Td = /* @__PURE__ */ c(function() {
  var l;
  const n = (l = game.time) == null ? void 0 : l.worldTime;
  if (typeof n != "number" || !Number.isFinite(n)) return "";
  const i = 1440 * 60, r = (Math.floor(n) % i + i) % i, a = Math.floor(r / 3600), o = Math.floor(r % 3600 / 60), s = r % 60;
  return Ja({ hours: a, minutes: o, seconds: s }, Hn());
}, "#formatFallbackTime"), ko = new WeakMap(), Oo = new WeakMap(), Ld = /* @__PURE__ */ c(function() {
  var n;
  (n = game.user) != null && n.isGM && (this.isEditingTime = !0, this._suppressBlurCommit = !1, this.editValue = S(this, re, fl).call(this), this.render({ force: !0 }));
}, "#enterTimeEditMode"), ul = /* @__PURE__ */ c(function() {
  this.isEditingTime = !1, this.editValue = "", this._suppressBlurCommit = !1, this.render({ force: !0 });
}, "#cancelTimeEdit"), dl = /* @__PURE__ */ c(async function(n) {
  var a, o, s;
  if (!((a = game.user) != null && a.isGM) || !this.isEditingTime || this._commitTimeInProgress) return;
  this._commitTimeInProgress = !0;
  const i = typeof n == "string" ? n.trim() : "";
  if (!i) {
    S(this, re, ul).call(this), this._commitTimeInProgress = !1;
    return;
  }
  const r = S(this, re, Od).call(this, i);
  if (r.error) {
    (s = (o = ui.notifications) == null ? void 0 : o.error) == null || s.call(o, r.error), this._suppressBlurCommit = !0, this.editValue = i, this.render({ force: !0 }), this._commitTimeInProgress = !1;
    return;
  }
  try {
    await S(this, re, kd).call(this, r.seconds, r.includeSeconds) ? (this.isEditingTime = !1, this.editValue = "", this.render({ force: !0 })) : (this.editValue = i, this.render({ force: !0 }));
  } finally {
    this._commitTimeInProgress = !1;
  }
}, "#commitTimeInput"), Ao = new WeakMap(), Mo = new WeakMap(), Id = /* @__PURE__ */ c(function() {
  var u, d;
  const n = (u = game.time) == null ? void 0 : u.worldTime;
  if (typeof n != "number" || !Number.isFinite(n))
    return "";
  const i = ((d = game.time) == null ? void 0 : d.components) ?? {}, r = Number(i.hour), a = Number(i.minute), o = i.second !== void 0 ? Number(i.second) : null, s = Number.isInteger(o);
  return (Number.isFinite(r) && Number.isFinite(a) ? Yt({
    hours: Math.max(0, Math.min(23, Number(r))),
    minutes: Math.max(0, Math.min(59, Number(a))),
    seconds: s && Number.isFinite(o) ? Math.max(0, Math.min(59, Number(o))) : void 0
  }) ?? "" : "") ?? "";
}, "#getCurrentCanonicalTime"), kd = /* @__PURE__ */ c(async function(n, i) {
  var f, h, p, y, w, b, v, E, T, k;
  const r = (f = game.time) == null ? void 0 : f.worldTime;
  if (typeof r != "number" || !Number.isFinite(r))
    return (p = (h = ui.notifications) == null ? void 0 : h.error) == null || p.call(
      h,
      C(
        "EIDOLON.TimeTrigger.EditTimeUnavailable",
        "The world time is unavailable, so it can't be updated."
      )
    ), !1;
  if (!Number.isInteger(n) || n < 0 || n >= Wi)
    return (w = (y = ui.notifications) == null ? void 0 : y.error) == null || w.call(
      y,
      C(
        "EIDOLON.TimeTrigger.EditTimeInvalidRange",
        "Enter a time within the current day."
      )
    ), !1;
  const s = Math.floor(r / Wi) * Wi + n - r;
  if (!Number.isFinite(s) || s === 0)
    return !0;
  const l = Math.floor(n / 3600), u = Math.floor(n % 3600 / 60), d = n % 60, m = Yt({
    hours: l,
    minutes: u,
    seconds: i ? d : void 0
  });
  try {
    x("Updating world time directly", {
      sceneId: ((b = this.scene) == null ? void 0 : b.id) ?? null,
      targetCanonical: m ?? null,
      diff: s
    }), await game.time.advance(s);
    const O = Ja(
      {
        hours: l,
        minutes: u,
        seconds: i ? d : null
      },
      Hn()
    );
    (E = (v = ui.notifications) == null ? void 0 : v.info) == null || E.call(
      v,
      C(
        "EIDOLON.TimeTrigger.EditTimeSuccess",
        "World time updated."
      ) + (O ? ` ${O}` : "")
    );
  } catch (O) {
    return console.error(`${L} | Failed to set world time`, O), (k = (T = ui.notifications) == null ? void 0 : T.error) == null || k.call(
      T,
      C(
        "EIDOLON.TimeTrigger.EditTimeError",
        "Failed to update the world time."
      )
    ), !1;
  }
  return !0;
}, "#applyTargetSeconds"), Od = /* @__PURE__ */ c(function(n) {
  var m;
  const i = C(
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
    const f = Number(a[1]), h = Number(a[2]), p = a[3] !== void 0 ? Number(a[3]) : void 0;
    if (Number.isInteger(f) && f >= 0 && f <= 23 && Number.isInteger(h) && h >= 0 && h <= 59 && (p === void 0 || Number.isInteger(p) && p >= 0 && p <= 59)) {
      const y = f * 3600 + h * 60 + (p ?? 0);
      return {
        canonical: Yt({ hours: f, minutes: h, seconds: p }),
        seconds: y,
        includeSeconds: p !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const { amLower: o, pmLower: s, periodPattern: l } = S(this, re, ml).call(this), u = r.match(
    new RegExp(
      `^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?\\s*(${l})$`,
      "i"
    )
  );
  if (u) {
    let f = Number(u[1]);
    const h = Number(u[2]), p = u[3] !== void 0 ? Number(u[3]) : void 0, y = u[4] ?? "", w = typeof y == "string" ? ((m = y.toLocaleLowerCase) == null ? void 0 : m.call(y)) ?? y.toLowerCase() : "";
    if (Number.isInteger(f) && f >= 1 && f <= 12 && Number.isInteger(h) && h >= 0 && h <= 59 && (p === void 0 || Number.isInteger(p) && p >= 0 && p <= 59) && (w === o || w === s || w === "am" || w === "pm")) {
      f = f % 12, (w === s || w === "pm") && (f += 12);
      const v = f * 3600 + h * 60 + (p ?? 0);
      return {
        canonical: Yt({ hours: f, minutes: h, seconds: p }),
        seconds: v,
        includeSeconds: p !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const d = pd(r);
  if (d !== null) {
    const f = Math.floor(d / 3600), h = Math.floor(d % 3600 / 60), p = d % 60, y = p !== 0;
    return {
      canonical: Yt({
        hours: f,
        minutes: h,
        seconds: y ? p : void 0
      }),
      seconds: d,
      includeSeconds: y,
      error: null
    };
  }
  return { error: i };
}, "#parseInputTime"), fl = /* @__PURE__ */ c(function() {
  const n = S(this, re, Id).call(this);
  if (!n) return "";
  if (Hn() === "24h")
    return n;
  const r = is(n);
  if (!r) return n;
  const a = Number(r.hours), o = Number(r.minutes), s = r.seconds !== null && r.seconds !== void 0 ? Number(r.seconds) : void 0;
  if (!Number.isFinite(a) || !Number.isFinite(o)) return n;
  const l = Number.isFinite(s), u = a % 12 === 0 ? 12 : a % 12, d = String(o).padStart(2, "0"), m = l ? `:${String(s).padStart(2, "0")}` : "", { amLabel: f, pmLabel: h } = S(this, re, ml).call(this), p = a >= 12 ? h : f;
  return `${u}:${d}${m} ${p}`.trim();
}, "#getInitialEditValue"), ml = /* @__PURE__ */ c(function() {
  var u, d;
  const n = C("EIDOLON.TimeTrigger.TimePeriodAM", "AM"), i = C("EIDOLON.TimeTrigger.TimePeriodPM", "PM"), r = ((u = n.toLocaleLowerCase) == null ? void 0 : u.call(n)) ?? n.toLowerCase(), a = ((d = i.toLocaleLowerCase) == null ? void 0 : d.call(i)) ?? i.toLowerCase(), o = S(this, re, hl).call(this, n), s = S(this, re, hl).call(this, i), l = `${o}|${s}|AM|PM`;
  return {
    amLabel: n,
    pmLabel: i,
    amLower: r,
    pmLower: a,
    periodPattern: l
  };
}, "#getPeriodMatchData"), hl = /* @__PURE__ */ c(function(n) {
  return typeof n != "string" ? "" : n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}, "#escapeForRegex"), _o = new WeakMap(), xo = new WeakMap(), gl = /* @__PURE__ */ c(function() {
  const n = this.scene;
  if (!n || typeof n.getFlag != "function") return !1;
  try {
    return !!n.getFlag(L, Qs);
  } catch (i) {
    x("TimeTriggerWindow | Failed to read scene real-time flag", {
      sceneId: (n == null ? void 0 : n.id) ?? null,
      message: (i == null ? void 0 : i.message) ?? String(i)
    });
  }
  return !1;
}, "#readSceneRealTimeFlag"), $o = new WeakMap(), Ad = /* @__PURE__ */ c(function() {
  if (typeof g(this, ci) == "function")
    try {
      g(this, ci).call(this);
    } catch (n) {
      console.error(`${L} | Failed to dispose time format subscription`, n);
    }
  I(this, ci, null);
}, "#disposeTimeFormatSubscription"), Md = /* @__PURE__ */ c(function() {
  if (typeof g(this, di) == "function")
    try {
      g(this, di).call(this);
    } catch (n) {
      console.error(`${L} | Failed to dispose manage time subscription`, n);
    }
  I(this, di, null);
}, "#disposeManageTimeSubscription"), c(si, "TimeTriggerWindow"), ve(si, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  qe(si, si, "DEFAULT_OPTIONS"),
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
)), ve(si, "PARTS", {
  content: {
    template: `modules/${L}/templates/time-trigger.html`
  }
});
let cl = si;
function rs(t, e = {}) {
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
c(rs, "createApplicationFactory");
const lu = /* @__PURE__ */ new Set();
var Le, Ze, fi, ar, _d, xd;
const Yc = class Yc {
  constructor({ windowFactory: e } = {}) {
    M(this, ar);
    M(this, Le, null);
    M(this, Ze, null);
    M(this, fi);
    const n = rs(cl);
    typeof e == "function" ? e.__eidolonFactorySignature === "options" ? I(this, fi, (r, a = {}) => e({ scene: r, ...a ?? {} })) : I(this, fi, e) : I(this, fi, /* @__PURE__ */ c((r, a = {}) => n({ scene: r, ...a ?? {} }), "fallbackFactory"));
  }
  onReady() {
    var n;
    const e = typeof ((n = game.time) == null ? void 0 : n.worldTime) == "number" && Number.isFinite(game.time.worldTime) ? game.time.worldTime : null;
    x("TimeTriggerManager#onReady", { worldTime: e }), e !== null && I(this, Ze, e);
  }
  onCanvasReady(e) {
    const n = (e == null ? void 0 : e.scene) ?? br();
    x("TimeTriggerManager#onCanvasReady", { sceneId: (n == null ? void 0 : n.id) ?? null }), this.refreshTimeTriggerWindow(n), this.handleTimeTriggerEvaluation(n);
  }
  onUpdateScene(e) {
    const n = br();
    x("TimeTriggerManager#onUpdateScene", {
      sceneId: (e == null ? void 0 : e.id) ?? null,
      activeSceneId: (n == null ? void 0 : n.id) ?? null
    }), !(!n || e.id !== n.id) && (this.refreshTimeTriggerWindow(e), this.handleTimeTriggerEvaluation(e));
  }
  onUpdateWorldTime(e, n) {
    x("TimeTriggerManager#onUpdateWorldTime", {
      worldTime: e,
      diff: n,
      hasWindow: !!g(this, Le)
    }), g(this, Le) && g(this, Le).render();
    const i = br(), r = S(this, ar, _d).call(this, e, n);
    this.handleTimeTriggerEvaluation(i, e, r);
  }
  refreshTimeTriggerWindow(e) {
    var l, u, d;
    if (!e) return;
    const n = !!((l = game.user) != null && l.isGM), i = !!e.getFlag(L, Ga), r = !!e.getFlag(L, Js), a = !!e.getFlag(L, Xs);
    if (x("TimeTriggerManager#refreshTimeTriggerWindow", {
      sceneId: e.id,
      isGM: n,
      isActive: i,
      hideWindow: r,
      showPlayerWindow: a
    }), !(i && !r && (n || a))) {
      g(this, Le) && (x("Closing time trigger window", { reason: "not-visible" }), g(this, Le).close({ force: !0 }), I(this, Le, null));
      return;
    }
    const s = !!n;
    if (g(this, Le) && ((u = g(this, Le).scene) == null ? void 0 : u.id) === e.id) {
      x("Refreshing existing time trigger window", { sceneId: e.id }), g(this, Le).showControls = s, g(this, Le).render();
      return;
    }
    g(this, Le) && (x("Closing existing window before creating new instance", {
      previousSceneId: ((d = g(this, Le).scene) == null ? void 0 : d.id) ?? null
    }), g(this, Le).close({ force: !0 })), I(this, Le, g(this, fi).call(this, e, { showControls: s })), x("Rendering new time trigger window", { sceneId: e.id }), g(this, Le).render({ force: !0 });
  }
  async handleTimeTriggerEvaluation(e, n, i) {
    var l;
    const r = e ?? br();
    if (!r) {
      x("handleTimeTriggerEvaluation skipped", {
        reason: "no-active-scene",
        providedSceneId: (e == null ? void 0 : e.id) ?? null,
        currentWorldTime: n
      }), typeof n == "number" && Number.isFinite(n) && I(this, Ze, n);
      return;
    }
    const a = typeof n == "number" && Number.isFinite(n) ? n : typeof ((l = game.time) == null ? void 0 : l.worldTime) == "number" ? game.time.worldTime : null;
    if (a === null) return;
    const o = typeof i == "number" && Number.isFinite(i) ? i : null, s = o !== null ? o : typeof g(this, Ze) == "number" && Number.isFinite(g(this, Ze)) ? g(this, Ze) : a;
    tr("handleTimeTriggerEvaluation", {
      sceneId: r.id,
      previousWorldTime: s,
      currentWorldTime: a,
      overrideProvided: o !== null
    });
    try {
      await S(this, ar, xd).call(this, r, s, a);
    } catch (u) {
      console.error(`${L} | Unexpected error while evaluating time triggers`, u), x("handleTimeTriggerEvaluation error", { message: (u == null ? void 0 : u.message) ?? String(u) });
    } finally {
      I(this, Ze, a), Rn();
    }
  }
};
Le = new WeakMap(), Ze = new WeakMap(), fi = new WeakMap(), ar = new WeakSet(), _d = /* @__PURE__ */ c(function(e, n) {
  return typeof g(this, Ze) == "number" && Number.isFinite(g(this, Ze)) ? (x("Resolved previous world time from cache", {
    previousWorldTime: g(this, Ze)
  }), g(this, Ze)) : typeof e == "number" && Number.isFinite(e) && typeof n == "number" && Number.isFinite(n) ? (x("Resolved previous world time using diff", {
    worldTime: e,
    diff: n,
    resolved: e - n
  }), e - n) : typeof e == "number" && Number.isFinite(e) ? e : null;
}, "#resolvePreviousWorldTime"), xd = /* @__PURE__ */ c(async function(e, n, i) {
  var p, y, w;
  if (!((p = game.user) != null && p.isGM)) {
    x("Skipping trigger evaluation because user is not a GM");
    return;
  }
  if (!(e != null && e.id)) {
    x("Skipping trigger evaluation because the scene is missing an id");
    return;
  }
  if (!!!e.getFlag(L, Ga)) {
    x("Skipping trigger evaluation because scene is inactive", { sceneId: e.id });
    return;
  }
  if (typeof i != "number" || !Number.isFinite(i)) return;
  (typeof n != "number" || !Number.isFinite(n)) && (n = i);
  const a = Gi(e);
  if (!a.length) {
    x("No time triggers configured for scene", { sceneId: e.id });
    return;
  }
  const o = Th(e), s = /* @__PURE__ */ new Set();
  for (const b of a)
    b != null && b.id && s.add(b.id);
  let l = !1;
  for (const b of Object.keys(o))
    s.has(b) || (delete o[b], l = !0);
  if (tr("Evaluating scene time triggers", {
    sceneId: e.id,
    previousWorldTime: n,
    currentWorldTime: i,
    triggerCount: a.length
  }), i <= n) {
    x("Detected world time rewind", {
      previousWorldTime: n,
      currentWorldTime: i
    });
    for (const b of a) {
      if (!(b != null && b.id) || !b.allowReplayOnRewind) continue;
      const v = o[b.id];
      typeof v == "number" ? i < v ? (x("Clearing trigger history due to rewind", {
        triggerId: b.id,
        lastFired: v,
        currentWorldTime: i
      }), delete o[b.id], l = !0) : x("Preserving trigger history after rewind", {
        triggerId: b.id,
        lastFired: v,
        currentWorldTime: i
      }) : x("No history stored for rewind-enabled trigger", {
        triggerId: b.id
      });
    }
    l && (x("Persisting history cleanup after rewind", {
      sceneId: e.id
    }), await Ms(e, o)), Rn();
    return;
  }
  const u = n, d = i, m = [], f = Math.floor(u / Wi), h = Math.floor(d / Wi);
  for (const b of a) {
    if (!(b != null && b.id)) continue;
    const v = pd(b.time);
    if (v === null) {
      Dh(e, b), x("Skipping trigger with invalid time", {
        triggerId: b.id,
        time: b.time
      });
      continue;
    }
    for (let E = f; E <= h; E++) {
      const T = E * Wi + v;
      if (T < u || T > d) continue;
      const O = o[b.id];
      if (typeof O == "number" && O >= T) {
        x("Skipping trigger because it already fired within window", {
          triggerId: b.id,
          lastFired: O,
          absoluteTime: T
        });
        continue;
      }
      m.push({ trigger: b, absoluteTime: T });
    }
  }
  if (!m.length) {
    l && await Ms(e, o), x("No triggers scheduled to fire within evaluation window", {
      sceneId: e.id
    }), Rn();
    return;
  }
  m.sort((b, v) => b.absoluteTime - v.absoluteTime), x("Queued triggers for execution", {
    entries: m.map((b) => ({
      triggerId: b.trigger.id,
      absoluteTime: b.absoluteTime
    }))
  });
  for (const b of m)
    try {
      x("Executing time trigger action", {
        triggerId: b.trigger.id,
        absoluteTime: b.absoluteTime
      }), await Sd(e, b.trigger);
    } catch (v) {
      console.error(`${L} | Failed to execute time trigger action`, v), (w = (y = ui.notifications) == null ? void 0 : y.error) == null || w.call(
        y,
        C(
          "EIDOLON.TimeTrigger.TriggerActionError",
          "Failed to execute a scene time trigger action. Check the console for details."
        )
      ), x("Trigger execution failed", {
        triggerId: b.trigger.id,
        message: (v == null ? void 0 : v.message) ?? String(v)
      });
    } finally {
      o[b.trigger.id] = b.absoluteTime, l = !0, x("Recorded trigger execution", {
        triggerId: b.trigger.id,
        absoluteTime: b.absoluteTime
      });
    }
  l && (x("Persisting trigger history updates", { sceneId: e.id }), await Ms(e, o)), Rn();
}, "#evaluateSceneTimeTriggers"), c(Yc, "TimeTriggerManager");
let pl = Yc;
function Dh(t, e) {
  var r, a;
  const n = `${(t == null ? void 0 : t.id) ?? "unknown"}:${(e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.time) ?? "unknown"}`;
  if (lu.has(n)) return;
  lu.add(n);
  const i = C(
    "EIDOLON.TimeTrigger.InvalidTimeWarning",
    "A scene time trigger has an invalid time value and was skipped."
  );
  (a = (r = ui.notifications) == null ? void 0 : r.warn) == null || a.call(r, i), console.warn(`${L} | Invalid time for trigger`, { scene: t == null ? void 0 : t.id, trigger: e });
}
c(Dh, "warnInvalidTriggerTime");
var kt, Vr, Ot, Ln, mi, Wt, Xi, No, Fo, Wr, Gr, hi, Gt, W, bl, Fi, Oa, vl, Aa, wl, Ut, $d, El, Nd, Cl, Fd, Do, Po, Ro, Ho, qo, Bo, Sl, Dd, Ma, jo, Uo;
const Kc = class Kc {
  constructor() {
    M(this, W);
    M(this, kt, !1);
    M(this, Vr, ca);
    M(this, Ot, /* @__PURE__ */ new Map());
    M(this, Ln, null);
    M(this, mi, null);
    M(this, Wt, 0);
    M(this, Xi, null);
    M(this, No, null);
    M(this, Fo, null);
    M(this, Wr, !1);
    M(this, Gr, !1);
    M(this, hi, !1);
    M(this, Gt, !1);
    M(this, Do, /* @__PURE__ */ c((e, n = {}) => {
      x("GameTimeAutomation | Pause state changed", {
        paused: e,
        userId: (n == null ? void 0 : n.userId) ?? null,
        broadcast: (n == null ? void 0 : n.broadcast) ?? null
      }), S(this, W, Ut).call(this, { pausedOverride: e });
    }, "#handlePause"));
    M(this, Po, /* @__PURE__ */ c((e) => {
      e != null && e.id && (g(this, Ot).set(e.id, Math.max(e.round ?? 0, 1)), x("GameTimeAutomation | Combat started", { combatId: e.id, round: e.round ?? 0 }), S(this, W, Ut).call(this));
    }, "#handleCombatStart"));
    M(this, Ro, /* @__PURE__ */ c((e, n) => {
      if (!(e != null && e.id)) return;
      const i = typeof n == "number" && Number.isFinite(n) ? n : typeof e.round == "number" && Number.isFinite(e.round) ? e.round : 0, r = i > 0 ? i : 1, a = g(this, Ot).get(e.id), o = a ? Math.max(a, 1) : 1, s = r > 1 ? Math.max(r - o, 0) : 0;
      if (x("GameTimeAutomation | Combat round change detected", {
        combatId: e.id,
        effectiveRound: r,
        completedRounds: s,
        enabled: g(this, kt),
        paused: (game == null ? void 0 : game.paused) ?? null
      }), s > 0 && g(this, kt) && g(this, Gt) && !(game != null && game.paused) && S(this, W, Fi).call(this) && S(this, W, Oa).call(this, e)) {
        const l = s * g(this, Vr);
        l > 0 && (x("GameTimeAutomation | Advancing time for completed combat rounds", {
          combatId: e.id,
          completedRounds: s,
          delta: l
        }), S(this, W, Cl).call(this, l));
      }
      g(this, Ot).set(e.id, Math.max(r, 1));
    }, "#handleCombatRound"));
    M(this, Ho, /* @__PURE__ */ c((e) => {
      e != null && e.id && (g(this, Ot).delete(e.id), x("GameTimeAutomation | Combat ended", { combatId: e.id }), S(this, W, Ut).call(this));
    }, "#handleCombatEnd"));
    M(this, qo, /* @__PURE__ */ c((e) => {
      e != null && e.id && (g(this, Ot).delete(e.id), x("GameTimeAutomation | Combat deleted", { combatId: e.id }), S(this, W, Ut).call(this));
    }, "#handleCombatDelete"));
    M(this, Bo, /* @__PURE__ */ c((e, n) => {
      if (e != null && e.id) {
        if (typeof (n == null ? void 0 : n.round) == "number" && Number.isFinite(n.round)) {
          const i = Math.max(n.round, 1);
          g(this, Ot).set(e.id, i), x("GameTimeAutomation | Combat round manually updated", {
            combatId: e.id,
            round: i
          });
        }
        (Object.prototype.hasOwnProperty.call(n ?? {}, "active") || (n == null ? void 0 : n.round) !== void 0) && S(this, W, Ut).call(this);
      }
    }, "#handleCombatUpdate"));
    M(this, jo, /* @__PURE__ */ c((e) => {
      S(this, W, Ma).call(this, e == null ? void 0 : e.scene), S(this, W, Ut).call(this);
    }, "#handleCanvasReady"));
    M(this, Uo, /* @__PURE__ */ c((e) => {
      if (!Xe(e)) return;
      const n = S(this, W, Sl).call(this);
      if (!n || n.id !== e.id) return;
      S(this, W, Ma).call(this, e) && S(this, W, Ut).call(this);
    }, "#handleSceneUpdate"));
  }
  registerHooks() {
    g(this, Wr) || (I(this, Wr, !0), Hooks.on("pauseGame", g(this, Do)), Hooks.on("combatStart", g(this, Po)), Hooks.on("combatRound", g(this, Ro)), Hooks.on("combatEnd", g(this, Ho)), Hooks.on("deleteCombat", g(this, qo)), Hooks.on("updateCombat", g(this, Bo)), Hooks.on("canvasReady", g(this, jo)), Hooks.on("updateScene", g(this, Uo)));
  }
  initialize() {
    g(this, Gr) || (I(this, Gr, !0), I(this, No, vd((e) => {
      const n = !!e, i = n !== g(this, kt);
      I(this, kt, n), x("GameTimeAutomation | Manage time toggled", { enabled: n }), i && n && S(this, W, wl).call(this), S(this, W, Ut).call(this);
    })), I(this, Fo, Eh((e) => {
      I(this, Vr, e), x("GameTimeAutomation | Seconds per round updated", { value: e });
    })), S(this, W, wl).call(this), S(this, W, Ma).call(this), S(this, W, Ut).call(this));
  }
};
kt = new WeakMap(), Vr = new WeakMap(), Ot = new WeakMap(), Ln = new WeakMap(), mi = new WeakMap(), Wt = new WeakMap(), Xi = new WeakMap(), No = new WeakMap(), Fo = new WeakMap(), Wr = new WeakMap(), Gr = new WeakMap(), hi = new WeakMap(), Gt = new WeakMap(), W = new WeakSet(), bl = /* @__PURE__ */ c(function() {
  var e;
  try {
    if (typeof ((e = globalThis.performance) == null ? void 0 : e.now) == "function")
      return globalThis.performance.now();
  } catch (n) {
    x("GameTimeAutomation | Failed to read high-resolution timestamp", {
      message: (n == null ? void 0 : n.message) ?? String(n)
    });
  }
  return Date.now();
}, "#currentTimestamp"), Fi = /* @__PURE__ */ c(function() {
  var e;
  return !!((e = game == null ? void 0 : game.user) != null && e.isGM && game.user.active !== !1);
}, "#canControlTime"), Oa = /* @__PURE__ */ c(function(e) {
  var i, r;
  if (!e) return !1;
  if (e.active === !0) return !0;
  if (e.active === !1) return !1;
  const n = (i = game == null ? void 0 : game.combats) == null ? void 0 : i.active;
  return (n == null ? void 0 : n.id) === e.id ? !0 : ((r = game == null ? void 0 : game.combat) == null ? void 0 : r.id) === e.id ? game.combat.active ?? !0 : !1;
}, "#isCombatDocumentActive"), vl = /* @__PURE__ */ c(function(e) {
  return e ? typeof e.started == "boolean" ? e.started : (e.round ?? 0) > 0 : !1;
}, "#hasCombatStarted"), Aa = /* @__PURE__ */ c(function() {
  var i;
  const e = Array.isArray((i = game == null ? void 0 : game.combats) == null ? void 0 : i.contents) ? game.combats.contents : [];
  for (const r of e)
    if (S(this, W, Oa).call(this, r) && S(this, W, vl).call(this, r))
      return !0;
  const n = game == null ? void 0 : game.combat;
  return !!(n && S(this, W, Oa).call(this, n) && S(this, W, vl).call(this, n));
}, "#isCombatRunning"), wl = /* @__PURE__ */ c(function() {
  var n;
  g(this, Ot).clear();
  const e = Array.isArray((n = game == null ? void 0 : game.combats) == null ? void 0 : n.contents) ? game.combats.contents : [];
  for (const i of e)
    i != null && i.id && g(this, Ot).set(i.id, Math.max(i.round ?? 0, 1));
}, "#hydrateRoundTracking"), Ut = /* @__PURE__ */ c(function({ pausedOverride: e } = {}) {
  const n = typeof e == "boolean" ? e : !!(game != null && game.paused), i = g(this, kt), r = g(this, Gt), a = i && r, o = {
    manageTimeEnabled: i,
    sceneAllowsRealTime: r,
    effectiveEnabled: a,
    paused: n,
    canControl: S(this, W, Fi).call(this),
    combatRunning: S(this, W, Aa).call(this),
    overrideApplied: typeof e == "boolean"
  };
  if (x("GameTimeAutomation | Sync running state", o), !a || !S(this, W, Fi).call(this)) {
    S(this, W, El).call(this);
    return;
  }
  S(this, W, $d).call(this);
}, "#syncRunningState"), $d = /* @__PURE__ */ c(function() {
  g(this, Ln) === null && (I(this, mi, S(this, W, bl).call(this)), I(this, Ln, globalThis.setInterval(() => S(this, W, Nd).call(this), 1e3)), x("GameTimeAutomation | Started real-time ticker"));
}, "#startRealTimeTicker"), El = /* @__PURE__ */ c(function() {
  g(this, Ln) !== null && (globalThis.clearInterval(g(this, Ln)), I(this, Ln, null), x("GameTimeAutomation | Stopped real-time ticker")), I(this, mi, null), I(this, Wt, 0), I(this, hi, !1);
}, "#stopRealTimeTicker"), Nd = /* @__PURE__ */ c(function() {
  if (!g(this, kt) || !g(this, Gt) || !S(this, W, Fi).call(this)) {
    S(this, W, El).call(this);
    return;
  }
  const e = S(this, W, bl).call(this);
  if (typeof e != "number" || !Number.isFinite(e)) return;
  const n = g(this, mi) ?? e, i = (e - n) / 1e3;
  if (I(this, mi, e), !Number.isFinite(i) || i <= 0) return;
  const r = !!(game != null && game.paused), a = S(this, W, Aa).call(this);
  if (r || a) {
    g(this, hi) || x("GameTimeAutomation | Tick skipped", { paused: r, combatRunning: a }), I(this, hi, !0), I(this, Wt, 0);
    return;
  }
  I(this, hi, !1), x("GameTimeAutomation | Real-time tick", { deltaSeconds: i }), S(this, W, Cl).call(this, i);
}, "#tickRealTime"), Cl = /* @__PURE__ */ c(function(e) {
  if (!g(this, kt) || !g(this, Gt)) return;
  const n = Number(e);
  !Number.isFinite(n) || n <= 0 || (I(this, Wt, g(this, Wt) + n), !g(this, Xi) && I(this, Xi, S(this, W, Fd).call(this)));
}, "#queueAdvance"), Fd = /* @__PURE__ */ c(async function() {
  var e, n;
  for (; g(this, Wt) > 0; ) {
    if (!g(this, kt) || !g(this, Gt) || game != null && game.paused || !S(this, W, Fi).call(this) || S(this, W, Aa).call(this)) {
      I(this, Wt, 0);
      break;
    }
    const i = g(this, Wt);
    I(this, Wt, 0);
    try {
      if (typeof ((e = game == null ? void 0 : game.time) == null ? void 0 : e.advance) == "function")
        x("GameTimeAutomation | Advancing world time", { delta: i }), await game.time.advance(i), x("GameTimeAutomation | World time advanced", {
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
  I(this, Xi, null);
}, "#flushAdvanceQueue"), Do = new WeakMap(), Po = new WeakMap(), Ro = new WeakMap(), Ho = new WeakMap(), qo = new WeakMap(), Bo = new WeakMap(), Sl = /* @__PURE__ */ c(function() {
  const e = br();
  return Xe(e) ? e : null;
}, "#getActiveSceneDocument"), Dd = /* @__PURE__ */ c(function(e) {
  if (!Xe(e)) return !1;
  try {
    return !!e.getFlag(L, Qs);
  } catch (n) {
    return x("GameTimeAutomation | Failed to read scene real-time flag", {
      sceneId: (e == null ? void 0 : e.id) ?? null,
      message: (n == null ? void 0 : n.message) ?? String(n)
    }), !1;
  }
}, "#isSceneRealTimeAllowed"), Ma = /* @__PURE__ */ c(function(e) {
  const n = Xe(e) ? e : S(this, W, Sl).call(this), i = S(this, W, Dd).call(this, n), r = g(this, Gt);
  return I(this, Gt, i), r !== i ? (x("GameTimeAutomation | Scene real-time allowance changed", {
    sceneId: (n == null ? void 0 : n.id) ?? null,
    allows: i
  }), !0) : !1;
}, "#refreshSceneAutomationState"), jo = new WeakMap(), Uo = new WeakMap(), c(Kc, "GameTimeAutomation");
let yl = Kc;
var cd, In, Be, gi, cn, Vo, Te, Pd, Rd, Hd, qd, Wo, Ll, Go, Bd, zo, jd, Ud;
const an = class an extends Kn(Yn) {
  constructor(n = {}) {
    const { scene: i, trigger: r, triggerIndex: a, onSave: o, ...s } = n ?? {};
    super(s);
    M(this, Te);
    M(this, In, null);
    M(this, Be, null);
    M(this, gi, null);
    M(this, cn, null);
    M(this, Vo, /* @__PURE__ */ c(() => {
      (this.rendered ?? this.isRendered ?? !1) && (I(this, cn, S(this, Te, Pd).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    M(this, Wo, /* @__PURE__ */ c((n) => {
      var a, o;
      const i = n.currentTarget, r = i == null ? void 0 : i.closest("form");
      r && (x("Trigger action selection changed", {
        sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
        triggerId: ((o = this.trigger) == null ? void 0 : o.id) ?? null,
        actionId: (i == null ? void 0 : i.value) ?? null
      }), S(this, Te, Ll).call(this, i.value, r));
    }, "#onActionSelectChange"));
    M(this, Go, /* @__PURE__ */ c((n) => {
      var u, d, m, f;
      n.preventDefault();
      const i = n.currentTarget, r = i == null ? void 0 : i.closest("form");
      if (!r) return;
      const a = (u = i.dataset) == null ? void 0 : u.target;
      if (!a) return;
      const o = typeof (CSS == null ? void 0 : CSS.escape) == "function" ? CSS.escape : (h) => h, s = r.querySelector(`[name="${o(a)}"]`);
      if (!s) return;
      x("Opening file picker for trigger", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        triggerId: ((m = this.trigger) == null ? void 0 : m.id) ?? null,
        target: a
      }), new FilePicker({
        type: ((f = i.dataset) == null ? void 0 : f.type) || "audio",
        current: s.value,
        callback: /* @__PURE__ */ c((h) => {
          var p, y;
          s.value = h, s.dispatchEvent(new Event("change")), x("Trigger form file selected", {
            sceneId: ((p = this.scene) == null ? void 0 : p.id) ?? null,
            triggerId: ((y = this.trigger) == null ? void 0 : y.id) ?? null,
            target: a,
            path: h
          });
        }, "callback")
      }).render({ force: !0 });
    }, "#onFilePicker"));
    M(this, zo, /* @__PURE__ */ c(async (n) => {
      var r, a;
      n.preventDefault();
      const i = n.currentTarget;
      i instanceof HTMLFormElement && (x("Trigger form submitted", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null,
        triggerId: ((a = this.trigger) == null ? void 0 : a.id) ?? null
      }), await S(this, Te, jd).call(this, i));
    }, "#onSubmit"));
    this.scene = i ?? null, this.trigger = r ?? null, this.triggerIndex = Number.isInteger(a) ? Number(a) : null, this.onSave = typeof o == "function" ? o : null, I(this, gi, Sc(g(this, Vo)));
  }
  async _prepareContext() {
    var n, i;
    tr("TriggerFormApplication#_prepareContext", {
      sceneId: ((n = this.scene) == null ? void 0 : n.id) ?? null,
      triggerId: ((i = this.trigger) == null ? void 0 : i.id) ?? null,
      triggerIndex: this.triggerIndex
    });
    try {
      const r = this.trigger ?? { action: ka, data: {} }, a = r.action ?? ka, o = su(r.time), s = o.format ?? "12h", l = s === "12h" ? Fh() : [], u = o.period ?? (l.length > 0 ? l[0].value : null), d = s === "12h" ? l.map((h) => ({
        ...h,
        selected: h.value === u
      })) : [], m = ou().map((h) => ({
        id: h.id,
        label: typeof h.label == "function" ? h.label() : h.label,
        selected: h.id === a
      })), f = ou().map((h) => {
        const p = h.id === r.action ? r : { ...r, action: h.id }, y = Oh(p);
        return y ? {
          id: h.id,
          visible: h.id === a,
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
      Rn();
    }
  }
  _onRender(n, i) {
    var l, u, d;
    super._onRender(n, i);
    const r = this.element;
    if (!r) return;
    x("Trigger form rendered", {
      sceneId: ((l = this.scene) == null ? void 0 : l.id) ?? null,
      triggerId: ((u = this.trigger) == null ? void 0 : u.id) ?? null
    });
    const a = Array.from(((d = document == null ? void 0 : document.body) == null ? void 0 : d.classList) ?? []).find(
      (m) => m.startsWith("theme-")
    );
    a && r.classList.add(a);
    const o = r.querySelector("form");
    if (!o) return;
    S(this, Te, Bd).call(this, o), S(this, Te, Rd).call(this, o), o.addEventListener("submit", g(this, zo));
    const s = o.querySelector("[data-action-select]");
    s && (s.addEventListener("change", g(this, Wo)), S(this, Te, Ll).call(this, s.value, o)), o.querySelectorAll("[data-action-file-picker]").forEach((m) => {
      m.addEventListener("click", g(this, Go));
    });
  }
  async close(n = {}) {
    var i;
    if ((i = g(this, In)) == null || i.call(this), I(this, In, null), I(this, Be, null), I(this, cn, null), typeof g(this, gi) == "function")
      try {
        g(this, gi).call(this);
      } catch (r) {
        console.error(`${L} | Failed to dispose trigger form time format subscription`, r);
      }
    return I(this, gi, null), super.close(n);
  }
};
In = new WeakMap(), Be = new WeakMap(), gi = new WeakMap(), cn = new WeakMap(), Vo = new WeakMap(), Te = new WeakSet(), Pd = /* @__PURE__ */ c(function() {
  var s, l, u, d, m, f, h;
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
    const p = a.querySelector("[data-time-hidden]"), y = a.querySelector("[data-time-hour]"), w = a.querySelector("[data-time-minute]"), b = a.querySelector("[data-time-period]");
    o = {
      format: ((h = a.dataset) == null ? void 0 : h.timeFormat) ?? null,
      canonical: p instanceof HTMLInputElement ? p.value : "",
      hour: y instanceof HTMLInputElement ? y.value : "",
      minute: w instanceof HTMLInputElement ? w.value : "",
      period: b instanceof HTMLSelectElement ? b.value : ""
    };
  }
  return {
    fields: r,
    time: o
  };
}, "#captureFormState"), Rd = /* @__PURE__ */ c(function(n) {
  if (!g(this, cn)) return;
  if (!(n instanceof HTMLFormElement)) {
    I(this, cn, null);
    return;
  }
  const { fields: i = [], time: r = null } = g(this, cn) ?? {};
  I(this, cn, null), S(this, Te, Hd).call(this, n, i), S(this, Te, qd).call(this, n, r);
}, "#restorePendingFormState"), Hd = /* @__PURE__ */ c(function(n, i) {
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
}, "#restoreFieldValues"), qd = /* @__PURE__ */ c(function(n, i) {
  var v, E, T;
  const r = n.querySelector("[data-time-format]");
  if (!(r instanceof HTMLElement)) {
    typeof g(this, Be) == "function" && g(this, Be).call(this);
    return;
  }
  const a = ((v = r.dataset) == null ? void 0 : v.timeFormat) === "24h" ? "24h" : "12h", o = r.querySelector("[data-time-hour]"), s = r.querySelector("[data-time-minute]"), l = r.querySelector("[data-time-period]"), u = r.querySelector("[data-time-hidden]");
  if (!i) {
    if (o instanceof HTMLInputElement && (o.value = ""), s instanceof HTMLInputElement && (s.value = ""), l instanceof HTMLSelectElement) {
      const k = ((T = (E = l.options) == null ? void 0 : E[0]) == null ? void 0 : T.value) ?? "";
      l.value = k;
    }
    u instanceof HTMLInputElement && (u.value = ""), typeof g(this, Be) == "function" && g(this, Be).call(this);
    return;
  }
  const d = typeof i.canonical == "string" ? i.canonical : "", m = typeof i.period == "string" ? i.period : "", f = typeof i.hour == "string" ? i.hour : "", h = typeof i.minute == "string" ? i.minute : "";
  let p = "", y = "", w = m, b = d;
  if (d) {
    const k = su(d, a);
    p = k.hour ?? "", y = k.minute ?? "", b = k.canonical ?? d, a === "12h" ? w = k.period ?? m : w = "";
  } else
    p = f, y = h, a !== "12h" && (w = "");
  if (o instanceof HTMLInputElement && (o.value = p ?? ""), s instanceof HTMLInputElement && (s.value = y ?? ""), l instanceof HTMLSelectElement)
    if (a === "12h") {
      const k = Array.from(l.options ?? []);
      k.find((_) => _.value === w) ? l.value = w : k.length > 0 ? l.value = k[0].value : l.value = "";
    } else
      l.value = "";
  u instanceof HTMLInputElement && (u.value = b ?? ""), typeof g(this, Be) == "function" && g(this, Be).call(this);
}, "#restoreTimeInputs"), Wo = new WeakMap(), Ll = /* @__PURE__ */ c(function(n, i) {
  i && i.querySelectorAll("[data-action-config]").forEach((r) => {
    const a = r.dataset.actionConfig === n;
    r.style.display = a ? "" : "none";
  });
}, "#updateActionSections"), Go = new WeakMap(), Bd = /* @__PURE__ */ c(function(n) {
  var m, f, h, p;
  if ((m = g(this, In)) == null || m.call(this), I(this, In, null), I(this, Be, null), !(n instanceof HTMLFormElement)) return;
  const i = n.querySelector("[data-time-format]"), r = ((f = i == null ? void 0 : i.dataset) == null ? void 0 : f.timeFormat) ?? null;
  if (r !== "12h" && r !== "24h")
    return;
  const a = i.querySelector("[data-time-hidden]"), o = i.querySelector("[data-time-hour]"), s = i.querySelector("[data-time-minute]"), l = r === "12h" ? i.querySelector("[data-time-period]") : null;
  if (!a || !o || !s || r === "12h" && !l) {
    x("Trigger form time inputs missing elements", {
      format: r,
      hasHidden: !!a,
      hasHour: !!o,
      hasMinute: !!s,
      hasPeriod: !!l
    });
    return;
  }
  const u = [o, s, ...l ? [l] : []], d = /* @__PURE__ */ c(() => {
    const { canonical: y, error: w } = Nh(
      {
        hour: o.value,
        minute: s.value,
        period: (l == null ? void 0 : l.value) ?? null,
        time: a.value
      },
      r
    );
    a.value = y ?? "";
    const b = w ?? "";
    a.setCustomValidity(b), u.forEach((v) => {
      v.setCustomValidity(b);
    });
  }, "update");
  u.forEach((y) => {
    y.addEventListener("input", d), y.addEventListener("change", d);
  }), d(), I(this, In, () => {
    u.forEach((y) => {
      y.removeEventListener("input", d), y.removeEventListener("change", d);
    });
  }), I(this, Be, d), x("Trigger form configured for time input", {
    format: r,
    sceneId: ((h = this.scene) == null ? void 0 : h.id) ?? null,
    triggerId: ((p = this.trigger) == null ? void 0 : p.id) ?? null
  });
}, "#setupTimeInput"), zo = new WeakMap(), jd = /* @__PURE__ */ c(async function(n) {
  var a, o, s, l, u;
  if (typeof g(this, Be) == "function" && g(this, Be).call(this), typeof n.checkValidity == "function" && !n.checkValidity()) {
    typeof n.reportValidity == "function" && n.reportValidity(), x("Trigger form submission blocked by validity check", {
      sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
      triggerId: ((o = this.trigger) == null ? void 0 : o.id) ?? null
    });
    return;
  }
  const i = new FormData(n), r = Object.fromEntries(i.entries());
  delete r.timeHour, delete r.timeMinute, delete r.timePeriod, r.allowReplayOnRewind = ((s = n.querySelector('input[name="allowReplayOnRewind"]')) == null ? void 0 : s.checked) ?? !1, x("Processing trigger form submission", {
    sceneId: ((l = this.scene) == null ? void 0 : l.id) ?? null,
    triggerId: ((u = this.trigger) == null ? void 0 : u.id) ?? null,
    allowReplayOnRewind: r.allowReplayOnRewind
  }), await S(this, Te, Ud).call(this, r), await this.close();
}, "#handleSubmit"), Ud = /* @__PURE__ */ c(async function(n) {
  var a, o, s, l, u, d;
  const i = {
    id: ((a = this.trigger) == null ? void 0 : a.id) ?? gh(),
    time: n.time ?? "",
    action: n.action ?? ka,
    allowReplayOnRewind: !!n.allowReplayOnRewind,
    data: {}
  };
  x("Persisting trigger from form", {
    sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
    triggerId: i.id,
    existingIndex: this.triggerIndex
  }), Ah(i, n);
  const r = Gi(this.scene);
  this.triggerIndex !== null && r[this.triggerIndex] ? r[this.triggerIndex] = i : r.push(i);
  try {
    await Cd(this.scene, r), x("Trigger list saved", {
      sceneId: ((s = this.scene) == null ? void 0 : s.id) ?? null,
      triggerCount: r.length
    });
  } catch (m) {
    throw console.error(`${L} | Failed to save time trigger`, m), (u = (l = ui.notifications) == null ? void 0 : l.error) == null || u.call(
      l,
      C(
        "EIDOLON.TimeTrigger.TriggerSaveError",
        "Failed to save the scene's time triggers."
      )
    ), m;
  }
  if (this.onSave)
    try {
      this.onSave(r);
    } catch (m) {
      console.error(`${L} | Trigger onSave callback failed`, m), x("Trigger onSave callback failed", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        message: (m == null ? void 0 : m.message) ?? String(m)
      });
    }
}, "#persistTrigger"), c(an, "TriggerFormApplication"), ve(an, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  qe(an, an, "DEFAULT_OPTIONS"),
  {
    id: `${L}-trigger-form`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((cd = qe(an, an, "DEFAULT_OPTIONS")) == null ? void 0 : cd.classes) ?? [], "standard-form", "themed"])
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
)), ve(an, "PARTS", {
  content: {
    template: `modules/${L}/templates/time-trigger-form.html`
  }
});
let Tl = an;
function qt(t) {
  return t instanceof HTMLElement ? t : (t == null ? void 0 : t[0]) instanceof HTMLElement ? t[0] : null;
}
c(qt, "asHTMLElement");
function _a(t) {
  return typeof (t == null ? void 0 : t.changeTab) == "function";
}
c(_a, "isAppV2");
function Vd(t, e, n, i = {}) {
  if (_a(t)) {
    t.changeTab(e, n, i);
    return;
  }
  if (typeof (t == null ? void 0 : t.activateTab) == "function") {
    const r = { ...i };
    n != null && Array.isArray(t._tabs) && t._tabs.some((o) => o._group === n) && (r.group = n), r.triggerCallback == null && (r.triggerCallback = !0);
    try {
      t.activateTab(e, r);
    } catch {
      Ph(t, e);
    }
  }
}
c(Vd, "setActiveTab");
function Ph(t, e) {
  var o;
  const n = ((o = t.element) == null ? void 0 : o[0]) ?? t.element;
  if (!(n instanceof HTMLElement)) return;
  const i = n.querySelector("nav.sheet-tabs") ?? n.querySelector("nav.tabs");
  i && i.querySelectorAll("[data-tab]").forEach((s) => s.classList.remove("active")), n.querySelectorAll(".tab[data-tab]").forEach((s) => {
    s.classList.remove("active"), s.setAttribute("hidden", "true");
  });
  const r = i == null ? void 0 : i.querySelector(`[data-tab="${e}"]`), a = n.querySelector(`.tab[data-tab="${e}"]`);
  r == null || r.classList.add("active"), a && (a.classList.add("active"), a.removeAttribute("hidden"));
}
c(Ph, "_manualTabActivation");
function Rh(t) {
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
c(Rh, "readFormData");
const cu = Symbol.for("eidolon.sceneConfig.v13PatchedTabs");
function Wd(t = {}) {
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
  const h = typeof d.log == "function" ? d.log.bind(d) : (...A) => {
    var R;
    return (R = console.debug) == null ? void 0 : R.call(console, `${o}`, ...A);
  }, p = typeof d.group == "function" ? d.group.bind(d) : (...A) => {
    var R;
    return (R = console.groupCollapsed) == null ? void 0 : R.call(console, `${o}`, ...A);
  }, y = typeof d.groupEnd == "function" ? d.groupEnd.bind(d) : () => {
    var A;
    return (A = console.groupEnd) == null ? void 0 : A.call(console);
  }, w = Symbol(`EIDOLON_SCENE_CONFIG_TAB_CLEANUP_${e}`), b = typeof i == "function" ? i : () => null, v = typeof r == "function" ? r : () => !0, E = typeof n == "function" ? n : () => typeof n == "string" ? n : e;
  function T() {
    var j, H, V, Y, ae;
    const A = ((H = (j = foundry == null ? void 0 : foundry.applications) == null ? void 0 : j.sheets) == null ? void 0 : H.SceneConfig) ?? ((V = CONFIG == null ? void 0 : CONFIG.Scene) == null ? void 0 : V.sheetClass);
    if (!A || !_a({ changeTab: (Y = A.prototype) == null ? void 0 : Y.changeTab })) return;
    const R = A[cu] ?? /* @__PURE__ */ new Set();
    if (R.has(e)) return;
    R.add(e), A[cu] = R;
    const B = (ae = A.TABS) == null ? void 0 : ae.sheet;
    if (B && Array.isArray(B.tabs) && !B.tabs.some((X) => X.id === e)) {
      const X = E({ app: null, scene: null }) ?? e;
      B.tabs.push({
        id: e,
        icon: f,
        label: X
      });
    }
    A.PARTS && !A.PARTS[e] && (A.PARTS[e] = {
      template: `modules/${m}/templates/scene-config-tab-mount.hbs`,
      scrollable: [`.tab[data-tab="${e}"]`]
    }), h("Patched v13 SceneConfig TABS/PARTS", { tabId: e });
  }
  c(T, "patchV13SceneConfig");
  function k(A, R) {
    var j, H;
    const B = b(A);
    if (!v(A, B)) {
      h("Skipped render", {
        tabId: e,
        reason: "inapplicable",
        constructor: ((j = A == null ? void 0 : A.constructor) == null ? void 0 : j.name) ?? null
      });
      return;
    }
    p("render", {
      tabId: e,
      sceneId: (B == null ? void 0 : B.id) ?? null,
      constructor: ((H = A == null ? void 0 : A.constructor) == null ? void 0 : H.name) ?? null
    });
    try {
      const V = qt(R) ?? qt(A.element);
      if (!V) {
        h("Missing root element", { tabId: e });
        return;
      }
      _a(A) ? N(A, V, B) : _(A, V, B);
    } finally {
      y();
    }
  }
  c(k, "handleRender");
  function O(A, R, B) {
    var V;
    if (!f) {
      A.textContent = R;
      return;
    }
    const j = (V = A.querySelector("i")) == null ? void 0 : V.cloneNode(!0);
    A.textContent = "";
    const H = j ?? document.createElement("i");
    if (j || (H.className = f, B && (H.inert = !0)), A.append(H, " "), B) {
      const Y = document.createElement("span");
      Y.textContent = R, A.append(Y);
    } else
      A.append(document.createTextNode(R));
  }
  c(O, "setButtonContent");
  function _(A, R, B) {
    var Jn, Ne, Me, _i, en, Xn, ct, tn, q, ha, Q, Et, Fe, cr, ga, ur, Qn, dr;
    const H = [
      "nav.sheet-tabs[data-group]",
      "nav.tabs[data-group]",
      "nav.sheet-tabs",
      "nav.tabs"
    ].map((ce) => R.querySelector(ce)).find((ce) => ce instanceof HTMLElement), Y = [
      (Jn = R.querySelector(".tab[data-tab]")) == null ? void 0 : Jn.parentElement,
      R.querySelector(".sheet-body"),
      (Me = (Ne = H == null ? void 0 : H.parentElement) == null ? void 0 : Ne.querySelector) == null ? void 0 : Me.call(Ne, ":scope > .sheet-body"),
      H == null ? void 0 : H.parentElement
    ].find((ce) => ce instanceof HTMLElement), ae = ((_i = H == null ? void 0 : H.dataset) == null ? void 0 : _i.group) ?? ((ct = (Xn = (en = H == null ? void 0 : H.querySelector) == null ? void 0 : en.call(H, "a[data-group]")) == null ? void 0 : Xn.dataset) == null ? void 0 : ct.group) ?? ((ha = (q = (tn = H == null ? void 0 : H.querySelector) == null ? void 0 : tn.call(H, "[data-group]")) == null ? void 0 : q.dataset) == null ? void 0 : ha.group) ?? ((Fe = (Et = (Q = Y == null ? void 0 : Y.querySelector) == null ? void 0 : Q.call(Y, ".tab[data-group]")) == null ? void 0 : Et.dataset) == null ? void 0 : Fe.group) ?? ((ga = (cr = A._tabs) == null ? void 0 : cr[0]) == null ? void 0 : ga._group) ?? null;
    if (!H || !Y) {
      h("Missing navigation elements", {
        tabId: e,
        hasNav: !!H,
        hasBody: !!Y
      });
      return;
    }
    let X = H.querySelector(`[data-tab="${e}"]`);
    if (!X) {
      X = document.createElement("a"), X.dataset.action = "tab", ae && (X.dataset.group = ae), X.dataset.tab = e;
      const ce = H.querySelector("a[data-tab]");
      (ur = ce == null ? void 0 : ce.classList) != null && ur.contains("item") && X.classList.add("item"), H.appendChild(X), typeof s == "function" && s({ app: A, button: X, nav: H, scene: B }), h("Created tab button", { tabId: e, group: ae });
    }
    O(X, E({ app: A, scene: B }) ?? e, _a(A));
    let te = Y.querySelector(`.tab[data-tab="${e}"]`);
    if (!te) {
      te = document.createElement("div"), te.classList.add("tab"), te.dataset.tab = e, ae && (te.dataset.group = ae);
      const ce = Gd(Y);
      Y.insertBefore(te, ce ?? null), typeof l == "function" && l({ app: A, tab: te, body: Y, scene: B }), h("Created tab container", { tabId: e, group: ae });
    }
    A._eidolonActiveTab === e || ((Qn = X.classList) == null ? void 0 : Qn.contains("active")) || te.classList.contains("active") ? (H.querySelectorAll("[data-tab].active").forEach((ce) => {
      ce !== X && ce.classList.remove("active");
    }), Y.querySelectorAll(".tab[data-tab].active").forEach((ce) => {
      ce !== te && (ce.classList.remove("active"), ce.setAttribute("hidden", "true"));
    }), X.classList.add("active"), te.classList.add("active"), te.removeAttribute("hidden")) : (X.classList.remove("active"), te.classList.remove("active"), te.setAttribute("hidden", "true"));
    const wt = /* @__PURE__ */ c(() => {
      var gn, P;
      ((gn = X.classList) != null && gn.contains("active") || te.classList.contains("active")) && ((P = X.classList) == null || P.add("active"), te.classList.add("active"), te.removeAttribute("hidden"), te.removeAttribute("aria-hidden"), te.style.display === "none" && (te.style.display = ""));
    }, "ensureTabVisible"), He = /* @__PURE__ */ c(() => {
      wt(), requestAnimationFrame(wt);
    }, "scheduleEnsureTabVisible");
    X.dataset.eidolonEnsureSceneTabVisibility || (X.addEventListener("click", () => {
      A._eidolonActiveTab = e, Vd(A, e, ae), requestAnimationFrame(wt);
    }), X.dataset.eidolonEnsureSceneTabVisibility = "true");
    const st = `data-eidolon-nav-watched-${e}`;
    H.hasAttribute(st) || (H.addEventListener("click", (ce) => {
      const gn = ce.target.closest("[data-tab]");
      gn && gn.dataset.tab !== e && delete A._eidolonActiveTab;
    }), H.setAttribute(st, "true")), _s(A, w, h);
    const lt = a({
      app: A,
      scene: B,
      tab: te,
      tabButton: X,
      ensureTabVisible: wt,
      scheduleEnsureTabVisible: He
    });
    typeof lt == "function" && uu(A, w, lt), typeof u == "function" && u({
      app: A,
      scene: B,
      tab: te,
      tabButton: X,
      ensureTabVisible: wt,
      scheduleEnsureTabVisible: He
    }), (dr = A.setPosition) == null || dr.call(A, { height: "auto" });
  }
  c(_, "handleRenderV1");
  function N(A, R, B) {
    const j = R.querySelector(`.tab[data-tab="${e}"]`), H = R.querySelector(`nav [data-tab="${e}"]`);
    if (!j || !H) {
      h("v2 mount not found, falling back to v1 injection", { tabId: e }), _(A, R, B);
      return;
    }
    O(H, E({ app: A, scene: B }) ?? e, !0);
    const V = /* @__PURE__ */ c(() => {
      var X;
      !((X = H.classList) != null && X.contains("active")) && !j.classList.contains("active") || (j.classList.add("active"), j.removeAttribute("hidden"), j.removeAttribute("aria-hidden"), j.style.display === "none" && (j.style.display = ""));
    }, "ensureTabVisible"), Y = /* @__PURE__ */ c(() => {
      V(), requestAnimationFrame(V);
    }, "scheduleEnsureTabVisible");
    _s(A, w, h);
    const ae = a({
      app: A,
      scene: B,
      tab: j,
      tabButton: H,
      ensureTabVisible: V,
      scheduleEnsureTabVisible: Y
    });
    typeof ae == "function" && uu(A, w, ae), typeof u == "function" && u({
      app: A,
      scene: B,
      tab: j,
      tabButton: H,
      ensureTabVisible: V,
      scheduleEnsureTabVisible: Y
    });
  }
  c(N, "handleRenderV2");
  function D(A) {
    _s(A, w, h);
  }
  c(D, "handleClose");
  function $() {
    return Hooks.once("init", () => {
      T();
    }), Hooks.on("renderSceneConfig", k), Hooks.on("closeSceneConfig", D), () => F();
  }
  c($, "register");
  function F() {
    Hooks.off("renderSceneConfig", k), Hooks.off("closeSceneConfig", D);
  }
  return c(F, "unregister"), { register: $, unregister: F };
}
c(Wd, "createSceneConfigTabFactory");
function uu(t, e, n) {
  if (!t || typeof n != "function") return;
  const i = t == null ? void 0 : t[e];
  Array.isArray(i) || (t[e] = []), t[e].push(n);
}
c(uu, "registerCleanup");
function _s(t, e, n) {
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
c(_s, "invokeCleanup");
function Gd(t) {
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
c(Gd, "findFooterElement");
const Hh = rs(Tl), qh = `modules/${L}/templates/time-trigger-scene-tab.html`, Bh = Wd({
  tabId: "time-triggers",
  tabLabel: /* @__PURE__ */ c(() => C("EIDOLON.TimeTrigger.Tab", "Time Triggers"), "tabLabel"),
  getScene: Qt,
  isApplicable: Wh,
  renderContent: /* @__PURE__ */ c(({ app: t, scene: e, tab: n }) => Uh(t, n, e), "renderContent"),
  logger: {
    log: x,
    group: tr,
    groupEnd: Rn
  }
});
function jh() {
  return x("Registering SceneConfig render hook"), Bh.register();
}
c(jh, "registerSceneConfigHook");
function Uh(t, e, n) {
  if (!(e instanceof HTMLElement)) return;
  const i = Xe(n) ? n : Qt(t);
  Xa(t, e, i);
  const r = Sc(() => {
    Xa(t, e, i);
  });
  return () => {
    if (typeof r == "function")
      try {
        r();
      } catch (a) {
        console.error(
          `${L} | Failed to dispose scene config time format subscription`,
          a
        );
      }
  };
}
c(Uh, "renderTimeTriggerTab");
async function Xa(t, e, n) {
  var r, a;
  const i = n ?? Qt(t);
  tr("renderTimeTriggersTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!Xe(i)) {
      const j = C(
        "EIDOLON.TimeTrigger.Unavailable",
        "Time triggers are unavailable for this configuration sheet."
      );
      e.innerHTML = `<p class="notes">${j}</p>`, x("Scene lacks document for time triggers", { sceneId: (i == null ? void 0 : i.id) ?? null });
      return;
    }
    const o = `flags.${L}.${Ga}`, s = `flags.${L}.${Js}`, l = `flags.${L}.${Xs}`, u = !!i.getFlag(L, Ga), d = !!i.getFlag(L, Js), m = !!i.getFlag(L, Xs), f = Gi(i);
    x("Rendering time trigger list", {
      sceneId: i.id,
      isActive: u,
      shouldHideWindow: d,
      shouldShowPlayerWindow: m,
      triggerCount: f.length
    });
    const h = C("EIDOLON.TimeTrigger.Activate", "Activate Time Trigger"), p = C(
      "EIDOLON.TimeTrigger.Description",
      "Enable scene time triggers so scheduled actions can run automatically."
    ), y = C(
      "EIDOLON.TimeTrigger.HideWindowLabel",
      "Hide Floating Time Window"
    ), w = C(
      "EIDOLON.TimeTrigger.HideWindowDescription",
      "Keep the floating time control window hidden while leaving time triggers active."
    ), b = C(
      "EIDOLON.TimeTrigger.ShowPlayerWindowLabel",
      "Share Floating Time Window with Players"
    ), v = C(
      "EIDOLON.TimeTrigger.ShowPlayerWindowDescription",
      "Let non-GM players see the floating time window (without time controls)."
    ), E = C(
      "EIDOLON.TimeTrigger.TriggerListLabel",
      "Scene Time Triggers"
    ), T = C(
      "EIDOLON.TimeTrigger.TriggerListEmpty",
      "No time triggers configured for this scene."
    ), k = C("EIDOLON.TimeTrigger.AddTrigger", "Add Trigger"), O = C("EIDOLON.TimeTrigger.EditTrigger", "Edit"), _ = C("EIDOLON.TimeTrigger.DeleteTrigger", "Remove"), N = C("EIDOLON.TimeTrigger.TriggerNow", "Trigger Now"), D = C("EIDOLON.TimeTrigger.AtLabel", "At"), $ = C("EIDOLON.TimeTrigger.DoLabel", "Do"), F = C("EIDOLON.TimeTrigger.MissingTime", "(No time set)"), A = f.map((j, H) => {
      const ae = (j.time ? $h(j.time) : "") || j.time || "" || F, X = Ih(j.action), te = [
        `${D} ${ae}`,
        `${$} ${X}`,
        ...kh(j)
      ];
      return {
        index: H,
        summaryParts: te,
        tooltips: {
          triggerNow: N,
          edit: O,
          delete: _
        }
      };
    }), R = ((a = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : a.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof R != "function") {
      console.error(`${L} | renderTemplate is unavailable; cannot render scene tab.`), e.innerHTML = `<p class="notes">${T}</p>`;
      return;
    }
    let B = "";
    try {
      B = await R(qh, {
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
          activate: h,
          hideWindow: y,
          showPlayerWindow: b,
          triggerList: E,
          empty: T,
          add: k
        },
        hints: {
          activate: p,
          hideWindow: w,
          showPlayerWindow: v
        },
        triggers: A,
        hasTriggers: A.length > 0
      });
    } catch (j) {
      console.error(`${L} | Failed to render time trigger scene tab template`, j), e.innerHTML = `<p class="notes">${T}</p>`;
      return;
    }
    e.innerHTML = B, Vh(t, e, i);
  } finally {
    Rn();
  }
}
c(Xa, "renderTimeTriggersTabContent");
function Vh(t, e, n) {
  const i = n ?? Qt(t);
  if (!Xe(i)) return;
  const r = e.querySelector('[data-action="add-trigger"]');
  r && r.addEventListener("click", () => {
    x("Add trigger button clicked", { sceneId: i.id }), du(t, { scene: i });
  }), e.querySelectorAll('[data-action="edit-trigger"]').forEach((a) => {
    a.addEventListener("click", () => {
      const o = Number(a.dataset.index);
      if (!Number.isInteger(o)) return;
      const l = Gi(i)[o];
      l && (x("Edit trigger button clicked", { sceneId: i.id, triggerId: l.id, index: o }), du(t, { trigger: l, triggerIndex: o, scene: i }));
    });
  }), e.querySelectorAll('[data-action="delete-trigger"]').forEach((a) => {
    a.addEventListener("click", async () => {
      var u, d;
      const o = Number(a.dataset.index);
      if (!Number.isInteger(o)) return;
      const s = Gi(i), l = s[o];
      if (l) {
        s.splice(o, 1);
        try {
          x("Deleting trigger", {
            sceneId: i.id,
            index: o,
            triggerId: (l == null ? void 0 : l.id) ?? null
          }), await Cd(i, s), await Xa(t, e, i);
        } catch (m) {
          console.error(`${L} | Failed to delete time trigger`, m), (d = (u = ui.notifications) == null ? void 0 : u.error) == null || d.call(
            u,
            C(
              "EIDOLON.TimeTrigger.TriggerDeleteError",
              "Failed to remove the selected time trigger."
            )
          );
        }
      }
    });
  }), e.querySelectorAll('[data-action="fire-trigger"]').forEach((a) => {
    a.addEventListener("click", async () => {
      var u, d, m, f, h, p, y;
      const o = Number(a.dataset.index);
      if (!Number.isInteger(o)) return;
      const l = Gi(i)[o];
      if (l) {
        if (!((u = game.user) != null && u.isGM)) {
          (m = (d = ui.notifications) == null ? void 0 : d.warn) == null || m.call(
            d,
            C("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time.")
          );
          return;
        }
        try {
          x("Manually firing trigger", { sceneId: i.id, triggerId: l.id, index: o }), await Sd(i, l), (h = (f = ui.notifications) == null ? void 0 : f.info) == null || h.call(
            f,
            C(
              "EIDOLON.TimeTrigger.TriggerNowSuccess",
              "Triggered the selected time trigger."
            )
          );
        } catch (w) {
          console.error(`${L} | Failed to execute time trigger manually`, w), (y = (p = ui.notifications) == null ? void 0 : p.error) == null || y.call(
            p,
            C(
              "EIDOLON.TimeTrigger.TriggerNowError",
              "Failed to execute the selected time trigger."
            )
          ), x("Manual trigger execution failed", {
            sceneId: i.id,
            triggerId: l.id,
            index: o,
            message: (w == null ? void 0 : w.message) ?? String(w)
          });
        }
      }
    });
  });
}
c(Vh, "bindTimeTriggerTabEvents");
function du(t, e = {}) {
  var o;
  const n = e.scene ?? null, i = n && Xe(n) ? n : Qt(t);
  if (!Xe(i)) {
    console.warn(`${L} | Unable to open trigger form because no scene document is available.`);
    return;
  }
  x("Opening trigger form", {
    sceneId: i.id,
    triggerId: ((o = e.trigger) == null ? void 0 : o.id) ?? null,
    index: Number.isInteger(e.triggerIndex) ? Number(e.triggerIndex) : null
  }), Hh({
    scene: i,
    trigger: e.trigger ?? null,
    triggerIndex: e.triggerIndex ?? null,
    onSave: /* @__PURE__ */ c(() => {
      var l, u;
      const s = (u = (l = t.element) == null ? void 0 : l[0]) == null ? void 0 : u.querySelector('.tab[data-tab="time-triggers"]');
      s && Xa(t, s, i);
    }, "onSave")
  }).render({ force: !0 });
}
c(du, "openTriggerForm");
function Wh(t, e) {
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
c(Wh, "isRecognizedSceneConfig");
const ba = new pl(), fu = new yl();
function Gh() {
  x("Registering time trigger hooks"), Hooks.once("init", () => {
    ph(), Ch(), x("Time trigger settings registered during init");
  }), jh(), x("Scene config hook registered"), fu.registerHooks(), x("Time automation hooks registered"), Hooks.once("ready", () => {
    Sh(), x("Ready hook fired"), ba.onReady(), fu.initialize();
  }), Hooks.on("canvasReady", (t) => {
    var e;
    x("canvasReady hook received", { scene: ((e = t == null ? void 0 : t.scene) == null ? void 0 : e.id) ?? null }), ba.onCanvasReady(t);
  }), Hooks.on("updateScene", (t) => {
    x("updateScene hook received", { scene: (t == null ? void 0 : t.id) ?? null }), ba.onUpdateScene(t);
  }), Hooks.on("updateWorldTime", (t, e) => {
    x("updateWorldTime hook received", { worldTime: t, diff: e }), ba.onUpdateWorldTime(t, e);
  });
}
c(Gh, "registerTimeTriggerHooks");
Gh();
const Se = L, zd = "criteria", Qa = "state", zh = "criteriaVersion", Yh = 1, Yd = "enableCriteriaSurfaces";
let mu = !1;
function Kh() {
  var t;
  if (!mu) {
    if (mu = !0, !((t = game == null ? void 0 : game.settings) != null && t.register)) {
      console.warn(`${Se} | game.settings.register unavailable; scene criteria setting skipped.`);
      return;
    }
    game.settings.register(Se, Yd, {
      name: C("EIDOLON.SceneCriteria.EnableSurfacesSettingName", "Enable Criteria Editor Surfaces"),
      hint: C(
        "EIDOLON.SceneCriteria.EnableSurfacesSettingHint",
        "Show criteria authoring surfaces (Scene > Criteria tab and tile/light editor controls). The Criteria Switcher remains available."
      ),
      scope: "world",
      config: !0,
      type: Boolean,
      default: !0,
      onChange: /* @__PURE__ */ c(() => {
        Jh();
      }, "onChange")
    });
  }
}
c(Kh, "registerSceneCriteriaSettings");
function as() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return !!game.settings.get(Se, Yd);
  } catch (e) {
    console.error(`${Se} | Failed to read criteria surfaces setting`, e);
  }
  return !0;
}
c(as, "getCriteriaSurfacesEnabled");
function Jh() {
  var a, o, s, l, u;
  const t = C("EIDOLON.SceneCriteria.ReloadPromptTitle", "Reload Required"), e = `<p>${C(
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
    C(
      "EIDOLON.SceneCriteria.ReloadNotice",
      "Please reload the world to apply criteria editor surface changes."
    )
  );
}
c(Jh, "promptReloadForCriteriaSurfaces");
const Za = "Standard";
function vt(t) {
  var n;
  const e = (n = t == null ? void 0 : t.getFlag) == null ? void 0 : n.call(t, Se, zd);
  return e ? Kd(e) : [];
}
c(vt, "getSceneCriteria");
async function os(t, e, n = {}) {
  var a;
  if (!(t != null && t.update)) return;
  const i = Kd(e), r = ls(
    Ht(((a = t == null ? void 0 : t.getFlag) == null ? void 0 : a.call(t, Se, Qa)) ?? {}),
    i
  );
  await t.update({
    [`flags.${Se}.${zd}`]: i,
    [`flags.${Se}.${zh}`]: Yh,
    [`flags.${Se}.${Qa}`]: r
  }, n);
}
c(os, "setSceneCriteria");
function ss(t, e = null) {
  var r;
  const n = Array.isArray(e) ? e : vt(t), i = Ht(((r = t == null ? void 0 : t.getFlag) == null ? void 0 : r.call(t, Se, Qa)) ?? {});
  return ls(i, n);
}
c(ss, "getSceneCriteriaState");
async function Xh(t, e, n = null) {
  if (!(t != null && t.setFlag)) return;
  const i = Array.isArray(n) ? n : vt(t), r = ls(e, i);
  await t.setFlag(Se, Qa, r);
}
c(Xh, "setSceneCriteriaState");
function Lc(t = "") {
  const e = typeof t == "string" ? t.trim() : "", n = Jd(kl(e || "criterion"), /* @__PURE__ */ new Set());
  return {
    id: Xd(),
    key: n,
    label: e,
    values: [Za],
    default: Za,
    order: 0
  };
}
c(Lc, "createSceneCriterion");
function Kd(t) {
  const e = Array.isArray(t) ? Ht(t) : [], n = [], i = /* @__PURE__ */ new Set();
  return e.forEach((r, a) => {
    const o = Il(r, a, i);
    o && (n.push(o), i.add(o.key));
  }), n;
}
c(Kd, "sanitizeCriteria$1");
function Il(t, e = 0, n = /* @__PURE__ */ new Set()) {
  if (!t || typeof t != "object") return null;
  const i = typeof t.id == "string" && t.id.trim() ? t.id.trim() : Xd(), a = (typeof t.label == "string" ? t.label : typeof t.name == "string" ? t.name : "").trim(), o = typeof t.key == "string" && t.key.trim() ? kl(t.key) : kl(a || `criterion-${Number(e) + 1}`), s = Jd(o, n), l = Zh(t.values);
  let u = typeof t.default == "string" ? t.default.trim() : "";
  u || (u = l[0] ?? Za), l.includes(u) || l.unshift(u);
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
c(Il, "sanitizeCriterion");
function ls(t, e = []) {
  const n = t && typeof t == "object" ? Ht(t) : {}, i = {};
  for (const r of e) {
    const a = n == null ? void 0 : n[r.key], o = typeof a == "string" ? a.trim() : "";
    o && r.values.includes(o) ? i[r.key] = o : i[r.key] = r.default;
  }
  return i;
}
c(ls, "sanitizeSceneCriteriaState");
function Qh(t) {
  return vt(t).map((n) => ({
    id: n.key,
    key: n.key,
    name: n.label,
    values: [...n.values]
  }));
}
c(Qh, "getSceneCriteriaCategories");
function Zh(t) {
  const e = Array.isArray(t) ? t : [], n = [];
  for (const i of e) {
    if (typeof i != "string") continue;
    const r = i.trim();
    !r || n.includes(r) || n.push(r);
  }
  return n.length || n.push(Za), n;
}
c(Zh, "sanitizeCriterionValues");
function kl(t) {
  return String(t ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
c(kl, "slugifyCriterionKey");
function Jd(t, e) {
  if (!e.has(t)) return t;
  let n = 2;
  for (; e.has(`${t}-${n}`); )
    n += 1;
  return `${t}-${n}`;
}
c(Jd, "ensureUniqueCriterionKey");
function Xd() {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 11);
}
c(Xd, "generateCriterionId");
function Qd(t) {
  var e, n;
  console.error(`${Se} | Failed to persist scene criteria`, t), (n = (e = ui.notifications) == null ? void 0 : e.error) == null || n.call(
    e,
    C(
      "EIDOLON.SceneCriteria.PersistError",
      "Failed to persist the scene criteria."
    )
  );
}
c(Qd, "notifyPersistError");
var ud, ye, un, Re, Zd, Yo, Ko, Jo, Xo, xa, Qo, zr, Yr, vr, ef;
const on = class on extends Kn(Yn) {
  constructor(n = {}) {
    const { scene: i, criterion: r, isNew: a, onSave: o, ...s } = n ?? {};
    super(s);
    M(this, Re);
    M(this, ye, null);
    M(this, un, !1);
    M(this, Yo, /* @__PURE__ */ c(async (n) => {
      n.preventDefault();
      const i = n.currentTarget;
      if (!(i instanceof HTMLFormElement)) return;
      const r = new FormData(i), a = String(r.get("criterionLabel") ?? "").trim(), o = String(r.get("criterionKey") ?? "").trim(), s = Array.from(i.querySelectorAll('[name="criterionValues"]')).map((m) => m instanceof HTMLInputElement ? m.value.trim() : "").filter((m, f, h) => m && h.indexOf(m) === f), u = String(r.get("criterionDefault") ?? "").trim() || s[0] || "Standard", d = Il(
        {
          id: g(this, ye).id,
          key: o,
          label: a,
          values: s,
          default: u,
          order: Number(g(this, ye).order ?? 0)
        },
        0,
        /* @__PURE__ */ new Set()
      );
      d && (I(this, ye, d), await S(this, Re, ef).call(this), this.close());
    }, "#onSubmit"));
    M(this, Ko, /* @__PURE__ */ c((n) => {
      var o;
      if (g(this, un)) return;
      const i = n.currentTarget, r = (i == null ? void 0 : i.form) ?? ((o = this.element) == null ? void 0 : o.querySelector("form"));
      if (!(r instanceof HTMLFormElement)) return;
      const a = r.querySelector('input[name="criterionKey"]');
      a instanceof HTMLInputElement && (a.value = hr(i.value));
    }, "#onLabelInput"));
    M(this, Jo, /* @__PURE__ */ c((n) => {
      var l;
      const i = n.currentTarget, r = (i == null ? void 0 : i.form) ?? ((l = this.element) == null ? void 0 : l.querySelector("form"));
      if (!(r instanceof HTMLFormElement) || !(i instanceof HTMLInputElement)) return;
      const a = r.querySelector('input[name="criterionLabel"]'), o = hr(a instanceof HTMLInputElement ? a.value : ""), s = hr(i.value);
      I(this, un, s !== o), i.value = s, S(this, Re, xa).call(this, r);
    }, "#onKeyInput"));
    M(this, Xo, /* @__PURE__ */ c((n) => {
      var o, s;
      n.preventDefault();
      const i = ((o = n.currentTarget) == null ? void 0 : o.form) ?? ((s = this.element) == null ? void 0 : s.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector('input[name="criterionLabel"]'), a = i.querySelector('input[name="criterionKey"]');
      a instanceof HTMLInputElement && (a.value = hr(r instanceof HTMLInputElement ? r.value : ""), I(this, un, !1), S(this, Re, xa).call(this, i));
    }, "#onResetAutoKey"));
    M(this, Qo, /* @__PURE__ */ c((n) => {
      var l, u, d, m, f, h;
      n.preventDefault();
      const i = ((l = n.currentTarget) == null ? void 0 : l.form) ?? ((u = this.element) == null ? void 0 : u.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector(".scene-criterion-editor__values");
      if (!(r instanceof HTMLElement)) return;
      (d = r.querySelector(".scene-criterion-editor__empty")) == null || d.remove();
      const a = document.createElement("div");
      a.classList.add("scene-criterion-editor__value");
      const o = Pt(C("EIDOLON.SceneCriteria.ValuePlaceholder", "Allowed value")), s = Pt(C("EIDOLON.SceneCriteria.RemoveValue", "Remove Value"));
      a.innerHTML = `
      <input type="text" name="criterionValues" value="" placeholder="${o}" class="form-control">
      <button type="button" class="icon" data-action="remove-value" aria-label="${s}" title="${s}">
        <i class="fa-solid fa-trash"></i>
      </button>
    `, r.appendChild(a), (m = a.querySelector('[data-action="remove-value"]')) == null || m.addEventListener("click", g(this, zr)), (f = a.querySelector('input[name="criterionValues"]')) == null || f.addEventListener("input", g(this, Yr)), S(this, Re, vr).call(this, i), (h = a.querySelector('input[name="criterionValues"]')) == null || h.focus();
    }, "#onAddValue"));
    M(this, zr, /* @__PURE__ */ c((n) => {
      var a, o, s, l;
      n.preventDefault(), (o = (a = n.currentTarget) == null ? void 0 : a.closest(".scene-criterion-editor__value")) == null || o.remove();
      const i = ((s = n.currentTarget) == null ? void 0 : s.form) ?? ((l = this.element) == null ? void 0 : l.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector(".scene-criterion-editor__values");
      if (r instanceof HTMLElement) {
        if (!r.querySelector(".scene-criterion-editor__value")) {
          const u = document.createElement("p");
          u.classList.add("notes", "scene-criterion-editor__empty"), u.textContent = C(
            "EIDOLON.SceneCriteria.ValueListEmpty",
            "No values have been added to this criterion."
          ), r.appendChild(u);
        }
        S(this, Re, vr).call(this, i);
      }
    }, "#onRemoveValue"));
    M(this, Yr, /* @__PURE__ */ c((n) => {
      var r, a;
      const i = ((r = n.currentTarget) == null ? void 0 : r.form) ?? ((a = this.element) == null ? void 0 : a.querySelector("form"));
      i instanceof HTMLFormElement && S(this, Re, vr).call(this, i);
    }, "#onValuesChanged"));
    this.scene = i ?? null, this.criterion = r ?? null, this.onSave = typeof o == "function" ? o : null, this.isNew = !!a, I(this, ye, S(this, Re, Zd).call(this)), I(this, un, g(this, ye).key !== hr(g(this, ye).label));
  }
  async _prepareContext() {
    var i, r, a, o;
    const n = Array.isArray((i = g(this, ye)) == null ? void 0 : i.values) ? g(this, ye).values : [];
    return {
      isNew: this.isNew,
      key: ((r = g(this, ye)) == null ? void 0 : r.key) ?? "",
      label: ((a = g(this, ye)) == null ? void 0 : a.label) ?? "",
      defaultValue: ((o = g(this, ye)) == null ? void 0 : o.default) ?? "",
      values: n.map((s, l) => {
        var u;
        return {
          index: l,
          value: s,
          selected: s === ((u = g(this, ye)) == null ? void 0 : u.default)
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
      keyIsCustom: g(this, un)
    };
  }
  _onRender(n, i) {
    var a, o, s, l, u, d;
    super._onRender(n, i);
    const r = (a = this.element) == null ? void 0 : a.querySelector("form");
    r && (r.addEventListener("submit", g(this, Yo)), (o = r.querySelector('[data-action="add-value"]')) == null || o.addEventListener("click", g(this, Qo)), (s = r.querySelector('input[name="criterionLabel"]')) == null || s.addEventListener("input", g(this, Ko)), (l = r.querySelector('input[name="criterionKey"]')) == null || l.addEventListener("input", g(this, Jo)), (u = r.querySelector('[data-action="reset-auto-key"]')) == null || u.addEventListener("click", g(this, Xo)), r.querySelectorAll('[data-action="remove-value"]').forEach((m) => {
      m.addEventListener("click", g(this, zr));
    }), r.querySelectorAll('input[name="criterionValues"]').forEach((m) => {
      m.addEventListener("input", g(this, Yr));
    }), (d = r.querySelector('[data-action="cancel"]')) == null || d.addEventListener("click", (m) => {
      m.preventDefault(), this.close();
    }), S(this, Re, xa).call(this, r), S(this, Re, vr).call(this, r));
  }
};
ye = new WeakMap(), un = new WeakMap(), Re = new WeakSet(), Zd = /* @__PURE__ */ c(function() {
  const n = Il(this.criterion, 0, /* @__PURE__ */ new Set()) ?? Lc(C("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion"));
  return {
    id: n.id,
    key: n.key,
    label: n.label ?? "",
    values: Array.isArray(n.values) ? [...n.values] : [],
    default: n.default
  };
}, "#initializeState"), Yo = new WeakMap(), Ko = new WeakMap(), Jo = new WeakMap(), Xo = new WeakMap(), xa = /* @__PURE__ */ c(function(n) {
  const i = n.querySelector('[data-action="reset-auto-key"]');
  i instanceof HTMLButtonElement && (i.disabled = !g(this, un));
}, "#syncAutoKeyButton"), Qo = new WeakMap(), zr = new WeakMap(), Yr = new WeakMap(), vr = /* @__PURE__ */ c(function(n) {
  var l, u;
  const i = n.querySelector('select[name="criterionDefault"]');
  if (!(i instanceof HTMLSelectElement)) return;
  const r = ((u = (l = i.value) == null ? void 0 : l.trim) == null ? void 0 : u.call(l)) ?? "", a = Array.from(n.querySelectorAll('input[name="criterionValues"]')).map((d) => d instanceof HTMLInputElement ? d.value.trim() : "").filter((d, m, f) => d && f.indexOf(d) === m), o = i.dataset.emptyLabel || C("EIDOLON.SceneCriteria.ValueListEmpty", "No values have been added to this criterion.");
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
}, "#syncDefaultOptions"), ef = /* @__PURE__ */ c(async function() {
  if (!this.scene) return;
  const n = vt(this.scene).sort((r, a) => r.order - a.order), i = n.findIndex((r) => r.id === g(this, ye).id);
  i < 0 ? (g(this, ye).order = n.length, n.push(g(this, ye))) : (g(this, ye).order = n[i].order, n.splice(i, 1, g(this, ye)));
  try {
    await os(this.scene, n), this.onSave && await this.onSave(g(this, ye));
  } catch (r) {
    Qd(r);
  }
}, "#persist"), c(on, "CategoryEditorApplication"), ve(on, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  qe(on, on, "DEFAULT_OPTIONS"),
  {
    id: `${Se}-criterion-editor`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((ud = qe(on, on, "DEFAULT_OPTIONS")) == null ? void 0 : ud.classes) ?? [], "standard-form", "themed"])
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
)), ve(on, "PARTS", {
  content: {
    template: `modules/${Se}/templates/scene-criteria-editor.html`
  }
});
let Ol = on;
function hr(t) {
  return String(t ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
c(hr, "slugifyKey");
const eg = `modules/${Se}/templates/scene-criteria-tab.html`, Al = {
  log: /* @__PURE__ */ c((...t) => {
    var e;
    return (e = console.debug) == null ? void 0 : e.call(console, `${Se} | Criteria`, ...t);
  }, "log"),
  group: /* @__PURE__ */ c((...t) => {
    var e;
    return (e = console.groupCollapsed) == null ? void 0 : e.call(console, `${Se} | Criteria`, ...t);
  }, "group"),
  groupEnd: /* @__PURE__ */ c(() => {
    var t;
    return (t = console.groupEnd) == null ? void 0 : t.call(console);
  }, "groupEnd")
}, tg = rs(Ol), ng = Wd({
  tabId: "criteria",
  tabLabel: /* @__PURE__ */ c(() => C("EIDOLON.SceneCriteria.TabLabel", "Criteria"), "tabLabel"),
  getScene: Qt,
  isApplicable: /* @__PURE__ */ c(() => as(), "isApplicable"),
  renderContent: /* @__PURE__ */ c(({ app: t, tab: e, scene: n }) => rg(t, e, n), "renderContent"),
  logger: Al
});
function ig() {
  return ng.register();
}
c(ig, "registerSceneCriteriaConfigHook");
function rg(t, e, n) {
  if (!(e instanceof HTMLElement)) return;
  const i = Xe(n) ? n : Qt(t);
  Di(t, e, i);
}
c(rg, "renderCriteriaTab");
async function Di(t, e, n) {
  var r, a;
  const i = n ?? Qt(t);
  Al.group("renderCriteriaTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!Xe(i)) {
      const d = C(
        "EIDOLON.SceneCriteria.Unavailable",
        "Scene criteria are unavailable for this configuration sheet."
      );
      e.innerHTML = `<p class="notes">${d}</p>`;
      return;
    }
    const o = vt(i).sort((d, m) => d.order - m.order), s = ss(i, o), l = ((a = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : a.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof l != "function") {
      e.innerHTML = `<p class="notes">${C("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
      return;
    }
    const u = await l(eg, {
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
        criteriaCount: o.length,
        valueCount: o.reduce((d, m) => d + m.values.length, 0)
      },
      criteria: o.map((d, m) => {
        var f, h;
        return {
          id: d.id,
          label: d.label,
          displayName: ((h = (f = d.label) == null ? void 0 : f.trim) == null ? void 0 : h.call(f)) || C("EIDOLON.SceneCriteria.UnnamedCategory", "Unnamed Criterion"),
          hasValues: d.values.length > 0,
          values: d.values.map((p) => ({
            value: p,
            isCurrent: (s[d.key] ?? d.default) === p
          })),
          valueCountLabel: og(d.values.length),
          canMoveUp: m > 0,
          canMoveDown: m < o.length - 1
        };
      }),
      hasCriteria: o.length > 0
    });
    e.innerHTML = u, ag(t, e, i);
  } catch (o) {
    console.error(`${Se} | Failed to render criteria tab`, o), e.innerHTML = `<p class="notes">${C("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
  } finally {
    Al.groupEnd();
  }
}
c(Di, "renderCriteriaTabContent");
function ag(t, e, n) {
  const i = n ?? Qt(t);
  if (!Xe(i)) return;
  const r = e.querySelector('[data-criteria-action="add"]');
  r && r.addEventListener("click", () => {
    hu(t, {
      scene: i,
      criterion: Lc(
        C("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion")
      ),
      isNew: !0,
      onSave: /* @__PURE__ */ c(() => Di(t, e, i), "onSave")
    });
  }), e.querySelectorAll('[data-criteria-action="edit"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", () => {
      const s = vt(i).find((l) => l.id === o);
      s && hu(t, {
        scene: i,
        criterion: s,
        onSave: /* @__PURE__ */ c(() => Di(t, e, i), "onSave")
      });
    });
  }), e.querySelectorAll('[data-criteria-action="remove"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await xs(i, (l) => {
        const u = l.findIndex((d) => d.id === o);
        return u < 0 ? !1 : (l.splice(u, 1), $s(l), !0);
      }) && await Di(t, e, i);
    });
  }), e.querySelectorAll('[data-criteria-action="move-up"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await xs(i, (l) => {
        const u = l.findIndex((m) => m.id === o);
        if (u <= 0) return !1;
        const [d] = l.splice(u, 1);
        return l.splice(u - 1, 0, d), $s(l), !0;
      }) && await Di(t, e, i);
    });
  }), e.querySelectorAll('[data-criteria-action="move-down"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await xs(i, (l) => {
        const u = l.findIndex((m) => m.id === o);
        if (u < 0 || u >= l.length - 1) return !1;
        const [d] = l.splice(u, 1);
        return l.splice(u + 1, 0, d), $s(l), !0;
      }) && await Di(t, e, i);
    });
  });
}
c(ag, "bindCriteriaTabEvents");
async function xs(t, e) {
  const n = vt(t).sort((r, a) => r.order - a.order);
  if (e(n) === !1) return !1;
  try {
    return await os(t, n, { render: !1 }), !0;
  } catch (r) {
    return Qd(r), !1;
  }
}
c(xs, "mutateCriteria");
function hu(t, e = {}) {
  const n = e.scene ?? null, i = n && Xe(n) ? n : Qt(t);
  if (!Xe(i))
    return;
  tg({
    scene: i,
    criterion: e.criterion ?? null,
    isNew: !!e.isNew,
    onSave: typeof e.onSave == "function" ? e.onSave : null
  }).render({ force: !0 });
}
c(hu, "openCriterionEditor");
function $s(t) {
  t.forEach((e, n) => {
    e.order = n;
  });
}
c($s, "reindexCriteriaOrder");
function og(t) {
  var e, n;
  if ((n = (e = game.i18n) == null ? void 0 : e.has) != null && n.call(e, "EIDOLON.SceneCriteria.ValueCountLabel"))
    try {
      return game.i18n.format("EIDOLON.SceneCriteria.ValueCountLabel", { count: t });
    } catch (i) {
      console.error(`${Se} | Failed to format value count label`, i);
    }
  return t === 0 ? "No values configured" : t === 1 ? "1 value" : `${t} values`;
}
c(og, "formatValueCount");
let gu = !1;
function sg() {
  Hooks.once("init", () => {
    Kh();
  }), Hooks.once("ready", () => {
    as() && (gu || (ig(), gu = !0));
  });
}
c(sg, "registerSceneCriteriaHooks");
sg();
const ne = L, tf = "criteriaEngineVersion", Ei = "fileIndex", Ci = "tileCriteria", Ic = {
  LEGACY: 1,
  CRITERIA: 2
}, nf = Ic.CRITERIA;
function rf(t) {
  var e;
  return ((e = t == null ? void 0 : t.getFlag) == null ? void 0 : e.call(t, ne, tf)) ?? Ic.LEGACY;
}
c(rf, "getSceneEngineVersion");
function lg(t, e, n, i, r) {
  if (!(t != null && t.length) || !(n != null && n.length)) return -1;
  const a = {};
  for (const s of n)
    a[s] = e[s];
  const o = pu(t, a, n);
  if (o >= 0) return o;
  if (i != null && i.length && r) {
    const s = { ...a };
    for (const l of i) {
      if (!(l in s)) continue;
      s[l] = r[l] ?? "Standard";
      const u = pu(t, s, n);
      if (u >= 0) return u;
    }
  }
  return -1;
}
c(lg, "findBestMatch");
function pu(t, e, n) {
  return t.findIndex((i) => {
    for (const r of n)
      if (i[r] !== e[r]) return !1;
    return !0;
  });
}
c(pu, "findExactMatch");
function cg(t, e) {
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
c(cg, "findFileIndex");
function $a(t) {
  return t && typeof t == "object" && !Array.isArray(t);
}
c($a, "isPlainObject$2");
function yu(t) {
  return t == null ? t : typeof structuredClone == "function" ? structuredClone(t) : JSON.parse(JSON.stringify(t));
}
c(yu, "deepClone");
function ug(t, e) {
  if (!e) return;
  const n = e.split(".").filter(Boolean);
  if (!n.length) return;
  let i = t;
  for (let r = 0; r < n.length - 1; r += 1) {
    if (!$a(i == null ? void 0 : i[n[r]])) return;
    i = i[n[r]];
  }
  delete i[n.at(-1)];
}
c(ug, "deletePath");
function af(t, e) {
  const n = yu(t ?? {});
  if (!$a(e)) return n;
  for (const [i, r] of Object.entries(e)) {
    if (i.startsWith("-=") && r === !0) {
      ug(n, i.slice(2));
      continue;
    }
    $a(r) && $a(n[i]) ? n[i] = af(n[i], r) : n[i] = yu(r);
  }
  return n;
}
c(af, "fallbackMerge");
function dg(t, e) {
  var n, i;
  return (n = foundry == null ? void 0 : foundry.utils) != null && n.mergeObject && ((i = foundry == null ? void 0 : foundry.utils) != null && i.deepClone) ? foundry.utils.mergeObject(t, foundry.utils.deepClone(e), {
    inplace: !1
  }) : af(t, e);
}
c(dg, "defaultMerge");
function fg(t, e) {
  if (!t) return !0;
  for (const n of Object.keys(t))
    if (t[n] !== e[n]) return !1;
  return !0;
}
c(fg, "criteriaMatch");
function of(t, e, n, i) {
  const r = i ?? dg;
  let a = r({}, t ?? {});
  if (!(e != null && e.length)) return a;
  const o = [];
  for (let s = 0; s < e.length; s += 1) {
    const l = e[s];
    if (fg(l == null ? void 0 : l.criteria, n)) {
      const u = l != null && l.criteria ? Object.keys(l.criteria).length : 0;
      o.push({ specificity: u, index: s, delta: l == null ? void 0 : l.delta });
    }
  }
  o.sort((s, l) => s.specificity - l.specificity || s.index - l.index);
  for (const s of o)
    s.delta && (a = r(a, s.delta));
  return a;
}
c(of, "resolveRules");
function cs(t = null) {
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
c(cs, "canManageCriteria");
function mg(t = null) {
  if (!cs(t))
    throw new Error(`${ne} | You do not have permission to manage scene criteria.`);
}
c(mg, "requireCriteriaAccess");
const bu = 200;
function sf(t) {
  return t ? Number.isInteger(t.size) ? t.size : Array.isArray(t) || typeof t.length == "number" ? t.length : Array.from(t).length : 0;
}
c(sf, "getCollectionSize");
function Ft() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
c(Ft, "nowMs");
function lf(t) {
  if (!Array.isArray(t)) return [];
  const e = /* @__PURE__ */ new Set();
  for (const n of t) {
    if (typeof n != "string") continue;
    const i = n.trim();
    i && e.add(i);
  }
  return Array.from(e);
}
c(lf, "uniqueStringKeys");
function hg(t, e = bu) {
  if (!Array.isArray(t) || t.length === 0) return [];
  const n = Number.isInteger(e) && e > 0 ? e : bu, i = [];
  for (let r = 0; r < t.length; r += n)
    i.push(t.slice(r, r + n));
  return i;
}
c(hg, "chunkArray");
function qi(t) {
  return !!t && typeof t == "object" && !Array.isArray(t);
}
c(qi, "isPlainObject$1");
function Ml(t, e) {
  if (Object.is(t, e)) return !0;
  if (Array.isArray(t) || Array.isArray(e)) {
    if (!Array.isArray(t) || !Array.isArray(e) || t.length !== e.length) return !1;
    for (let n = 0; n < t.length; n += 1)
      if (!Ml(t[n], e[n])) return !1;
    return !0;
  }
  if (qi(t) || qi(e)) {
    if (!qi(t) || !qi(e)) return !1;
    const n = Object.keys(e);
    for (const i of n)
      if (!Ml(t[i], e[i])) return !1;
    return !0;
  }
  return !1;
}
c(Ml, "areValuesEqual");
function eo(t) {
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
c(eo, "normalizeFilePath");
function cf(t) {
  return typeof (t == null ? void 0 : t.name) == "string" ? t.name : typeof (t == null ? void 0 : t.src) == "string" ? t.src : "";
}
c(cf, "getFilePath");
function kc(t) {
  if (!Array.isArray(t)) return [];
  const e = /* @__PURE__ */ new Map();
  return t.map((n, i) => {
    const r = eo(cf(n)), a = r || `__index:${i}`, o = e.get(a) ?? 0;
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
c(kc, "buildTileFileEntries");
function Un(t, e) {
  if (!Number.isInteger(e) || e < 0) return null;
  const i = kc(t).find((r) => r.index === e);
  return i ? { ...i.target } : { indexHint: e };
}
c(Un, "createTileTargetFromIndex");
function us(t) {
  if (!t || typeof t != "object") return null;
  const e = eo(t.path), n = Number(t.indexHint ?? t.fileIndex), i = Number(t.occurrence), r = {};
  return e && (r.path = e, r.occurrence = Number.isInteger(i) && i >= 0 ? i : 0), Number.isInteger(n) && n >= 0 && (r.indexHint = n), !r.path && !Number.isInteger(r.indexHint) ? null : r;
}
c(us, "normalizeTileTarget");
function Dr(t, e) {
  const n = us(t);
  if (!n) return -1;
  const i = kc(e);
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
c(Dr, "resolveTileTargetIndex");
function Vn(t) {
  if (!t || typeof t != "object" || Array.isArray(t)) return {};
  const e = {};
  for (const [n, i] of Object.entries(t))
    typeof n != "string" || !n || typeof i != "string" || !i.trim() || (e[n] = i.trim());
  return e;
}
c(Vn, "sanitizeCriteria");
function gg(t) {
  return Object.entries(Vn(t)).sort(([n], [i]) => n.localeCompare(i)).map(([n, i]) => `${n}=${i}`).join("");
}
c(gg, "serializeCriteria");
function pg(t) {
  return Object.keys(Vn(t)).length;
}
c(pg, "getCriteriaSpecificity");
function yg(t, e) {
  const n = Vn(t), i = Vn(e);
  for (const [r, a] of Object.entries(n))
    if (r in i && i[r] !== a)
      return !1;
  return !0;
}
c(yg, "areCriteriaCompatible");
function bg(t, e) {
  const n = Dr(t, e);
  if (Number.isInteger(n) && n >= 0)
    return `index:${n}`;
  const i = us(t);
  if (!i) return "";
  if (i.path) {
    const r = Number.isInteger(i.occurrence) ? i.occurrence : 0;
    return `path:${i.path}#${r}`;
  }
  return Number.isInteger(i.indexHint) ? `hint:${i.indexHint}` : "";
}
c(bg, "getTargetIdentity");
function uf(t, e = {}) {
  var s;
  const n = Array.isArray(e.files) ? e.files : [], i = ki(t, { files: n });
  if (!((s = i == null ? void 0 : i.variants) != null && s.length))
    return {
      errors: [],
      warnings: []
    };
  const r = i.variants.map((l, u) => ({
    index: u,
    criteria: Vn(l.criteria),
    specificity: pg(l.criteria),
    criteriaSignature: gg(l.criteria),
    targetIdentity: bg(l.target, n)
  })), a = [], o = [];
  for (let l = 0; l < r.length; l += 1) {
    const u = r[l];
    for (let d = l + 1; d < r.length; d += 1) {
      const m = r[d];
      if (u.specificity !== m.specificity || !yg(u.criteria, m.criteria)) continue;
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
c(uf, "detectTileCriteriaConflicts");
function vg(t, e) {
  if (!t || typeof t != "object") return null;
  let n = us(t.target);
  if (!n) {
    const i = Number(t.fileIndex);
    Number.isInteger(i) && i >= 0 && (n = Un(e, i));
  }
  return n ? {
    criteria: Vn(t.criteria),
    target: n
  } : null;
}
c(vg, "normalizeTileVariant");
function df(t, e = {}) {
  if (!Array.isArray(t) || t.length === 0) return null;
  const n = Array.isArray(e.files) ? e.files : null, i = t.map((l, u) => ({
    criteria: Vn(l),
    target: Un(n, u)
  })).filter((l) => l.target);
  if (!i.length) return null;
  const r = i.find((l) => Object.keys(l.criteria).length === 0), a = (r == null ? void 0 : r.target) ?? i[0].target;
  let o = null;
  const s = Number(e.defaultFileIndex);
  return Number.isInteger(s) && s >= 0 && (o = Un(n, s)), o || (o = a), {
    strategy: "select-one",
    variants: i,
    defaultTarget: o
  };
}
c(df, "buildTileCriteriaFromFileIndex");
function ki(t, e = {}) {
  const n = Array.isArray(e.files) ? e.files : null;
  if (Array.isArray(t))
    return df(t, { files: n });
  if (!t || typeof t != "object") return null;
  const i = Array.isArray(t.variants) ? t.variants.map((a) => vg(a, n)).filter(Boolean) : [];
  if (!i.length) return null;
  let r = us(t.defaultTarget);
  if (!r) {
    const a = Number(t.defaultFileIndex);
    Number.isInteger(a) && a >= 0 && (r = Un(n, a));
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
c(ki, "normalizeTileCriteria");
let to = /* @__PURE__ */ new WeakMap();
function wg(t, e) {
  const n = ki(t, { files: e });
  if (!n) return null;
  const i = n.variants.map((a) => {
    const o = Vn(a.criteria), s = Dr(a.target, e);
    return !Number.isInteger(s) || s < 0 ? null : {
      criteria: o,
      keys: Object.keys(o),
      targetIndex: s
    };
  }).filter(Boolean), r = Dr(n.defaultTarget, e);
  return !i.length && (!Number.isInteger(r) || r < 0) ? null : {
    variants: i,
    defaultIndex: r
  };
}
c(wg, "compileTileMatcher");
function Eg(t, e, n) {
  const i = to.get(t);
  if (i && i.tileCriteria === e && i.files === n)
    return i.compiled;
  const r = wg(e, n);
  return to.set(t, {
    tileCriteria: e,
    files: n,
    compiled: r
  }), r;
}
c(Eg, "getCompiledTileMatcher");
function Cg(t, e) {
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
c(Cg, "selectTileFileIndexFromCompiled");
function vu(t = null) {
  t ? to.delete(t) : to = /* @__PURE__ */ new WeakMap();
}
c(vu, "invalidateTileMatcherCache");
function Sg({ extractKeys: t, label: e = "doc" }) {
  let n = /* @__PURE__ */ new WeakMap();
  function i(s, l) {
    const u = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Set();
    for (const m of l) {
      const f = t(m);
      if (f) {
        d.add(m.id);
        for (const h of f)
          u.has(h) || u.set(h, /* @__PURE__ */ new Set()), u.get(h).add(m.id);
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
    const d = lf(u), m = r(s, l);
    if (!d.length)
      return typeof (l == null ? void 0 : l.get) == "function" ? Array.from(m.allDocIds).map((h) => l.get(h)).filter(Boolean) : Array.from(l ?? []).filter((h) => m.allDocIds.has(h.id));
    const f = /* @__PURE__ */ new Set();
    for (const h of d) {
      const p = m.keyToDocIds.get(h);
      if (p)
        for (const y of p) f.add(y);
    }
    return f.size ? typeof (l == null ? void 0 : l.get) == "function" ? Array.from(f).map((h) => l.get(h)).filter(Boolean) : Array.from(l ?? []).filter((h) => f.has(h.id)) : [];
  }
  c(a, "getAffectedDocs");
  function o(s = null) {
    s ? n.delete(s) : n = /* @__PURE__ */ new WeakMap();
  }
  return c(o, "invalidate"), { getAffectedDocs: a, invalidate: o };
}
c(Sg, "createDependencyIndexManager");
async function ff(t, e, n, i) {
  const r = hg(n, i);
  for (const a of r)
    await t.updateEmbeddedDocuments(e, a), r.length > 1 && await Promise.resolve();
  return r.length;
}
c(ff, "updateDocumentsInChunks");
const Tg = /* @__PURE__ */ c((...t) => console.log(`${ne} | criteria tiles:`, ...t), "log$1"), mf = Sg({
  label: "tile",
  extractKeys(t) {
    var r;
    const e = t.getFlag(ne, Ci) ?? t.getFlag(ne, Ei);
    if (!e) return null;
    const n = ki(e, { files: null });
    if (!((r = n == null ? void 0 : n.variants) != null && r.length)) return [];
    const i = [];
    for (const a of n.variants)
      for (const o of Object.keys(a.criteria ?? {}))
        o && i.push(o);
    return i;
  }
});
function Lg(t = null, e = null) {
  mf.invalidate(t ?? void 0), e ? vu(e) : t || vu(null);
}
c(Lg, "invalidateTileCriteriaCaches");
async function hf(t, e, n = {}) {
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
  r.total = sf(a);
  const o = mf.getAffectedDocs(e, a, n.changedKeys);
  if (r.scanned = o.length, !o.length)
    return r.skipped.unaffected = r.total, r.durationMs = Ft() - i, r;
  const s = [];
  for (const f of o) {
    const h = f.getFlag(ne, Ci) ?? f.getFlag(ne, Ei);
    if (!h) {
      r.skipped.noCriteria += 1;
      continue;
    }
    const p = f.getFlag("monks-active-tiles", "files");
    if (!(p != null && p.length)) {
      r.skipped.noFiles += 1;
      continue;
    }
    const y = Eg(f, h, p), w = Cg(y, t);
    if (!Number.isInteger(w) || w < 0 || w >= p.length) {
      console.warn(`${ne} | Tile ${f.id} has no valid file match for state`, t), r.skipped.noMatch += 1;
      continue;
    }
    const b = w, E = Number(f.getFlag("monks-active-tiles", "fileindex")) !== b, T = p.some(($, F) => !!($ != null && $.selected) != (F === w)), k = eo(((u = f.texture) == null ? void 0 : u.src) ?? ((m = (d = f._source) == null ? void 0 : d.texture) == null ? void 0 : m.src) ?? ""), O = cf(p[w]), _ = eo(O), N = !!_ && _ !== k;
    if (!T && !E && !N) {
      r.skipped.unchanged += 1;
      continue;
    }
    const D = {
      _id: f._id
    };
    T && (D["flags.monks-active-tiles.files"] = p.map(($, F) => ({
      ...$,
      selected: F === w
    }))), E && (D["flags.monks-active-tiles.fileindex"] = b), N && (D.texture = { src: O }), s.push(D), Tg(`Tile ${f.id} -> ${O}`);
  }
  return s.length > 0 && (r.chunks = await ff(e, "Tile", s, n.chunkSize), r.updated = s.length), r.durationMs = Ft() - i, r;
}
c(hf, "updateTiles");
const Si = L, zi = "lightCriteria", Oc = Object.freeze({
  base: null,
  mappings: [],
  current: null
});
function Ns(t) {
  return t && typeof t == "object" && !Array.isArray(t);
}
c(Ns, "isPlainObject");
function gf(t, e) {
  if (!Ns(e)) return {};
  const n = {};
  for (const [i, r] of Object.entries(e)) {
    const a = t == null ? void 0 : t[i];
    if (Ns(r) && Ns(a)) {
      const o = gf(a, r);
      Object.keys(o).length > 0 && (n[i] = o);
    } else r !== a && (n[i] = Ht(r));
  }
  return n;
}
c(gf, "computeDelta");
function pf(t) {
  var n;
  const e = ((n = t == null ? void 0 : t.getFlag) == null ? void 0 : n.call(t, Si, zi)) ?? Oc;
  return Pr(e);
}
c(pf, "getLightCriteriaState");
async function yf(t, e) {
  const n = Pr(e);
  if (!(t != null && t.setFlag))
    return n;
  const i = n.base !== null, r = n.mappings.length > 0, a = n.current !== null;
  return !i && !r && !a ? (typeof t.unsetFlag == "function" ? await t.unsetFlag(Si, zi) : await t.setFlag(Si, zi, null), Oc) : (await t.setFlag(Si, zi, n), n);
}
c(yf, "setLightCriteriaState");
async function da(t, e) {
  if (typeof e != "function")
    throw new TypeError("updateLightCriteriaState requires an updater function.");
  const n = Ht(pf(t)), i = await e(n);
  return yf(t, i);
}
c(da, "updateLightCriteriaState");
async function wu(t, e) {
  const n = Oi(e);
  if (!n)
    throw new Error("Invalid light configuration payload.");
  return da(t, (i) => ({
    ...i,
    base: n
  }));
}
c(wu, "storeBaseLighting");
async function Eu(t, e, n, { label: i } = {}) {
  const r = fa(e);
  if (!r)
    throw new Error("Cannot create a mapping without at least one category selection.");
  const a = Oi(n);
  if (!a)
    throw new Error("Invalid light configuration payload.");
  return da(t, (o) => {
    const s = or(r), l = Array.isArray(o == null ? void 0 : o.mappings) ? [...o.mappings] : [], u = l.findIndex((h) => (h == null ? void 0 : h.key) === s), d = u >= 0 ? l[u] : null, m = typeof (d == null ? void 0 : d.id) == "string" && d.id.trim() ? d.id.trim() : vf(), f = ds({
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
c(Eu, "upsertLightCriteriaMapping");
async function Ig(t, e, n, i, { replaceExisting: r = !1 } = {}) {
  const a = typeof e == "string" ? e.trim() : "";
  if (!a)
    throw new Error("A mapping id is required to retarget criteria.");
  const o = fa(n);
  if (!o)
    throw new Error("Cannot retarget mapping without at least one category selection.");
  const s = Oi(i);
  if (!s)
    throw new Error("Invalid light configuration payload.");
  return da(t, (l) => {
    const u = Array.isArray(l == null ? void 0 : l.mappings) ? [...l.mappings] : [], d = u.findIndex((b) => (b == null ? void 0 : b.id) === a);
    if (d < 0)
      throw new Error("The selected mapping no longer exists.");
    const m = or(o), f = u.findIndex(
      (b, v) => v !== d && (b == null ? void 0 : b.key) === m
    );
    if (f >= 0 && !r)
      throw new Error("A mapping already exists for the selected criteria.");
    const h = u[d], p = ds({
      ...h,
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
      const [b] = u.splice(f, 1);
      y = (b == null ? void 0 : b.id) ?? null;
    }
    let w = (l == null ? void 0 : l.current) ?? null;
    return w && typeof w == "object" && (w.mappingId === a ? w = {
      ...w,
      mappingId: a,
      categories: o,
      updatedAt: Date.now()
    } : y && w.mappingId === y && (w = {
      ...w,
      mappingId: a,
      categories: o,
      updatedAt: Date.now()
    })), {
      ...l,
      mappings: u,
      current: w
    };
  });
}
c(Ig, "retargetLightCriteriaMapping");
async function kg(t, e) {
  const n = typeof e == "string" ? e.trim() : "";
  if (!n)
    throw new Error("A mapping id is required to remove a mapping.");
  return da(t, (i) => {
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
c(kg, "removeLightCriteriaMapping");
async function Ir(t, e) {
  const n = bf(e);
  return da(t, (i) => ({
    ...i,
    current: n
  }));
}
c(Ir, "storeCurrentCriteriaSelection");
function Og(t) {
  const e = Pr(t), n = e.base ?? {}, i = [];
  for (const r of e.mappings) {
    const a = fa(r == null ? void 0 : r.categories);
    if (!a) continue;
    const o = gf(n, (r == null ? void 0 : r.config) ?? {});
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
c(Og, "convertLightCriteriaStateToPresets");
function Ag(t, e = []) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
  for (const l of e)
    typeof (l == null ? void 0 : l.key) == "string" && l.key.trim() && i.add(l.key.trim()), typeof (l == null ? void 0 : l.id) == "string" && l.id.trim() && typeof (l == null ? void 0 : l.key) == "string" && n.set(l.id.trim(), l.key.trim());
  const r = Pr(t), a = /* @__PURE__ */ c((l) => {
    const u = {};
    for (const [d, m] of Object.entries(l ?? {})) {
      const f = String(d ?? "").trim(), h = typeof m == "string" ? m.trim() : "";
      if (!f || !h) continue;
      if (i.has(f)) {
        u[f] = h;
        continue;
      }
      const p = n.get(f);
      p && (u[p] = h);
    }
    return Object.keys(u).length ? u : null;
  }, "remapCategories"), o = r.mappings.map((l) => {
    const u = a(l.categories);
    return u ? ds({
      ...l,
      categories: u,
      key: or(u)
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
  return Pr({
    ...r,
    mappings: o,
    current: s
  });
}
c(Ag, "migrateLightCriteriaCategoriesToKeys");
function Pr(t) {
  var l;
  const e = Ht(t);
  if (!e || typeof e != "object")
    return Ht(Oc);
  const n = Oi(e.base), i = Array.isArray(e.mappings) ? e.mappings : [], r = /* @__PURE__ */ new Map();
  for (const u of i) {
    const d = ds(u);
    d && r.set(d.key, d);
  }
  const a = Array.from(r.values()), o = new Map(a.map((u) => [u.id, u]));
  let s = bf(e.current);
  if (s) {
    const u = s.categories && Object.keys(s.categories).length > 0;
    if (s.mappingId && !o.has(s.mappingId)) {
      const d = u ? ((l = a.find((m) => m.key === or(s.categories))) == null ? void 0 : l.id) ?? null : null;
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
c(Pr, "sanitizeLightCriteriaState");
function Oi(t) {
  const e = Ht(t);
  if (!e || typeof e != "object") return null;
  "_id" in e && delete e._id, "id" in e && delete e.id;
  const n = e.flags;
  if (n && typeof n == "object") {
    const i = n[Si];
    i && typeof i == "object" && (delete i[zi], Object.keys(i).length === 0 && delete n[Si]), Object.keys(n).length === 0 && delete e.flags;
  }
  return e;
}
c(Oi, "sanitizeLightConfigPayload");
function ds(t) {
  if (!t || typeof t != "object") return null;
  const e = fa(t.categories);
  if (!e) return null;
  const n = Oi(t.config);
  if (!n) return null;
  const i = typeof t.id == "string" && t.id.trim() ? t.id.trim() : vf(), r = or(e), a = {
    id: i,
    key: r,
    categories: e,
    config: n,
    updatedAt: Number.isFinite(t.updatedAt) ? Number(t.updatedAt) : Date.now()
  };
  return typeof t.label == "string" && t.label.trim() && (a.label = t.label.trim()), a;
}
c(ds, "sanitizeCriteriaMappingEntry");
function bf(t) {
  if (!t || typeof t != "object") return null;
  const e = typeof t.mappingId == "string" && t.mappingId.trim() ? t.mappingId.trim() : null, n = fa(t.categories);
  return !e && !n ? null : {
    mappingId: e,
    categories: n,
    updatedAt: Number.isFinite(t.updatedAt) ? Number(t.updatedAt) : Date.now()
  };
}
c(bf, "sanitizeCurrentSelection");
function fa(t) {
  const e = {};
  if (Array.isArray(t))
    for (const n of t) {
      const i = Cu((n == null ? void 0 : n.id) ?? (n == null ? void 0 : n.categoryId) ?? (n == null ? void 0 : n.category)), r = Su((n == null ? void 0 : n.value) ?? (n == null ? void 0 : n.selection) ?? (n == null ? void 0 : n.label));
      !i || !r || (e[i] = r);
    }
  else if (t && typeof t == "object")
    for (const [n, i] of Object.entries(t)) {
      const r = Cu(n), a = Su(i);
      !r || !a || (e[r] = a);
    }
  return Object.keys(e).length > 0 ? e : null;
}
c(fa, "sanitizeCriteriaCategories");
function or(t) {
  if (!t || typeof t != "object") return "";
  const e = Object.entries(t).filter(([, n]) => typeof n == "string" && n).map(([n, i]) => `${n}:${i}`);
  return e.sort((n, i) => n < i ? -1 : n > i ? 1 : 0), e.join("|");
}
c(or, "computeCriteriaMappingKey");
function vf() {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
c(vf, "generateLightMappingId");
function Cu(t) {
  if (typeof t != "string") return null;
  const e = t.trim();
  return e || null;
}
c(Cu, "normalizeCategoryId");
function Su(t) {
  if (typeof t != "string") return null;
  const e = t.trim();
  return e || null;
}
c(Su, "normalizeCategoryValue");
const Rr = [];
function wf(t) {
  typeof t == "function" && (Rr.includes(t) || Rr.push(t));
}
c(wf, "registerHiddenLightProvider");
function Mg(t) {
  const e = Rr.indexOf(t);
  e >= 0 && Rr.splice(e, 1);
}
c(Mg, "unregisterHiddenLightProvider");
function _g() {
  const t = /* @__PURE__ */ new Set();
  for (const e of Rr)
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
c(_g, "getHiddenLightIds");
const Ac = /* @__PURE__ */ new Map(), Hr = [];
function wr(t) {
  t != null && t.tag && Ac.set(t.tag, { ...t });
}
c(wr, "registerTileConvention");
function xg(t) {
  Ac.delete(t);
}
c(xg, "unregisterTileConvention");
function Ef() {
  return Ac;
}
c(Ef, "getTileConventions");
function $g(t) {
  typeof t == "function" && (Hr.includes(t) || Hr.push(t));
}
c($g, "registerIndexingHook");
function Ng(t) {
  const e = Hr.indexOf(t);
  e >= 0 && Hr.splice(e, 1);
}
c(Ng, "unregisterIndexingHook");
function Fg() {
  return Hr;
}
c(Fg, "getIndexingHooks");
const no = ["AmbientLight", "Wall", "AmbientSound"];
let io = /* @__PURE__ */ new WeakMap(), ro = /* @__PURE__ */ new WeakMap();
function Dg(t) {
  const e = /* @__PURE__ */ new Set();
  for (const n of (t == null ? void 0 : t.rules) ?? [])
    for (const i of Object.keys((n == null ? void 0 : n.criteria) ?? {}))
      i && e.add(i);
  return Array.from(e);
}
c(Dg, "getPresetDependencyKeys");
function Pg(t, e) {
  const n = /* @__PURE__ */ new Map();
  for (const i of no) {
    const r = e.get(i) ?? [], a = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Map();
    for (const s of r) {
      const l = Sf(s, i);
      if (l != null && l.base) {
        a.add(s.id);
        for (const u of Dg(l))
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
c(Pg, "buildPlaceableDependencyIndex");
function Rg(t, e) {
  const n = ro.get(t);
  if (n && no.every((r) => n.collectionsByType.get(r) === e.get(r)))
    return n;
  const i = Pg(t, e);
  return ro.set(t, i), i;
}
c(Rg, "getPlaceableDependencyIndex");
function Hg(t, e, n) {
  if (!e || !t) return [];
  const i = lf(n);
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
c(Hg, "getDocsForChangedKeys");
function Cf(t, e) {
  const n = { _id: e._id };
  for (const [r, a] of Object.entries(e)) {
    if (r === "_id") continue;
    const o = t == null ? void 0 : t[r];
    if (qi(a) && qi(o)) {
      const s = Cf(o, { _id: e._id, ...a });
      if (!s) continue;
      const l = Object.keys(s).filter((u) => u !== "_id");
      if (l.length > 0) {
        n[r] = {};
        for (const u of l)
          n[r][u] = s[u];
      }
      continue;
    }
    Ml(o, a) || (n[r] = a);
  }
  return Object.keys(n).filter((r) => r !== "_id").length > 0 ? n : null;
}
c(Cf, "buildChangedPayload");
function Sf(t, e) {
  var s;
  const n = ((s = t == null ? void 0 : t.flags) == null ? void 0 : s[ne]) ?? {}, i = (n == null ? void 0 : n.presets) ?? null, r = e === "AmbientLight" ? (n == null ? void 0 : n.lightCriteria) ?? null : null, a = io.get(t);
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
    const l = Og(n.lightCriteria);
    (l.base && Object.keys(l.base).length > 0 || l.rules.length > 0) && (o = {
      base: l.base,
      rules: l.rules
    });
  }
  return io.set(t, {
    type: e,
    rawPresets: i,
    rawLightCriteria: r,
    presets: o
  }), o;
}
c(Sf, "getPresetsForDocument");
function qg(t = null, e = null) {
  t ? ro.delete(t) : ro = /* @__PURE__ */ new WeakMap(), e ? io.delete(e) : t || (io = /* @__PURE__ */ new WeakMap());
}
c(qg, "invalidatePlaceableCriteriaCaches");
async function Tf(t, e, n = {}) {
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
  const a = _g(), o = new Map(
    no.map((d) => [d, e.getEmbeddedCollection(d) ?? []])
  ), s = Rg(e, o);
  for (const d of no) {
    const m = o.get(d) ?? [], f = {
      total: sf(m),
      scanned: 0,
      updated: 0,
      chunks: 0
    }, h = s.byType.get(d) ?? null, p = Hg(m, h, n.changedKeys);
    if (f.scanned = p.length, r.total += f.total, r.scanned += f.scanned, r.byType[d] = f, !p.length) continue;
    const y = [];
    for (const w of p) {
      const b = Sf(w, d);
      if (!(b != null && b.base)) continue;
      const v = of(b.base, b.rules ?? [], t);
      v._id = w._id, d === "AmbientLight" && a.has(w._id) && (v.hidden = !0);
      const E = (w == null ? void 0 : w._source) ?? ((u = w == null ? void 0 : w.toObject) == null ? void 0 : u.call(w)) ?? {}, T = Cf(E, v);
      T && y.push(T);
    }
    y.length > 0 && (f.chunks = await ff(e, d, y, n.chunkSize), f.updated = y.length, r.updated += y.length, r.chunks += f.chunks, console.log(`${ne} | Updated ${y.length} ${d}(s)`));
  }
  return r.durationMs = Ft() - i, r;
}
c(Tf, "updatePlaceables");
const va = /* @__PURE__ */ new Map();
function Bg(t) {
  var e;
  return t = t ?? ((e = game.scenes) == null ? void 0 : e.viewed), t ? ss(t) : null;
}
c(Bg, "getState");
async function jg(t, e, n = 0) {
  var h;
  const i = Ft();
  if (e = e ?? ((h = game.scenes) == null ? void 0 : h.viewed), !e) return null;
  mg(e);
  const r = vt(e);
  if (!r.length)
    return console.warn(`${ne} | applyState skipped: scene has no criteria.`), null;
  const a = ss(e, r), o = ls({ ...a, ...t ?? {} }, r), s = r.filter((p) => (a == null ? void 0 : a[p.key]) !== (o == null ? void 0 : o[p.key])).map((p) => p.key), l = s.length > 0;
  l && await Xh(e, o, r);
  const u = l ? o : a, [d, m] = await Promise.all([
    hf(u, e, { changedKeys: s }),
    Tf(u, e, { changedKeys: s })
  ]), f = Ft() - i;
  return x("Criteria apply telemetry", {
    sceneId: e.id,
    changedKeys: s,
    didChange: l,
    queuedMs: n,
    durationMs: f,
    tiles: d,
    placeables: m
  }), Hooks.callAll("eidolon-utilities.criteriaStateApplied", e, u), u;
}
c(jg, "applyStateInternal");
async function Lf(t, e) {
  var l;
  if (e = e ?? ((l = game.scenes) == null ? void 0 : l.viewed), !e) return null;
  const n = e.id ?? "__viewed__", i = Ft(), r = va.get(n) ?? Promise.resolve();
  let a = null;
  const o = r.catch(() => null).then(async () => {
    const u = Ft() - i;
    return jg(t, e, u);
  });
  a = o;
  const s = o.finally(() => {
    va.get(n) === s && va.delete(n);
  });
  return va.set(n, s), a;
}
c(Lf, "applyState$1");
function Ug(t) {
  var e;
  return t = t ?? ((e = game.scenes) == null ? void 0 : e.viewed), t ? rf(t) : null;
}
c(Ug, "getVersion");
async function If(t, e) {
  var n;
  e = e ?? ((n = game.scenes) == null ? void 0 : n.viewed), e != null && e.setFlag && await e.setFlag(ne, tf, Number(t));
}
c(If, "setVersion");
async function Vg(t) {
  return If(nf, t);
}
c(Vg, "markCurrentVersion");
const Er = "Standard", Wg = {
  nolights: "No Lights"
}, Gg = /* @__PURE__ */ c((...t) => console.log(`${ne} | criteria indexer:`, ...t), "log");
function zg() {
  wr({
    tag: "Map",
    positionMap: { 0: "mood", 1: "variant", 2: "effect" },
    positionMap4: { 0: "mood", 1: "stage", 2: "variant", 3: "effect" },
    required: !0,
    maxCount: 1
  }), wr({ tag: "Floor", positionMap: "inherit" }), wr({ tag: "Roof", positionMap: "inherit" }), wr({
    tag: "Weather",
    positionMap: { 1: "effect" }
  });
}
c(zg, "registerDefaultConventions");
function ao(t) {
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
c(ao, "parseFileTags");
function Yg(t, e, n = Er) {
  return t != null && t.length ? t.map((i) => {
    const r = ao(i == null ? void 0 : i.name);
    if (!r) return {};
    const a = {};
    for (const [o, s] of Object.entries(e)) {
      const l = r[Number(o)];
      l != null && l !== n && (a[s] = l);
    }
    return a;
  }) : [];
}
c(Yg, "buildFileIndex");
function Kg(t, e) {
  return t.map((n, i) => {
    const r = [...e[n] ?? /* @__PURE__ */ new Set()].sort(), o = r.includes(Er) ? Er : r[0] ?? Er, s = Lc(n);
    return s.key = n, s.label = Wg[n] ?? n.charAt(0).toUpperCase() + n.slice(1), s.values = r.length ? r : [Er], s.default = s.values.includes(o) ? o : s.values[0], s.order = i, s;
  });
}
c(Kg, "buildCriteriaDefinitions");
async function Tu(t, e, n, { dryRun: i = !1 } = {}) {
  const r = t.getFlag("monks-active-tiles", "files");
  if (!(r != null && r.length)) return null;
  const a = Yg(r, e), o = df(a, { files: r });
  for (const s of r) {
    const l = ao(s == null ? void 0 : s.name);
    if (l)
      for (const [u, d] of Object.entries(e)) {
        const m = l[Number(u)];
        m != null && n[d] && n[d].add(m);
      }
  }
  return i || (await t.setFlag(ne, Ci, o), typeof t.unsetFlag == "function" && await t.unsetFlag(ne, Ei)), { files: r.length };
}
c(Tu, "indexTile");
function Lu(t, e, n) {
  return t.positionMap === "inherit" ? n : e >= 4 && t.positionMap4 ? t.positionMap4 : t.positionMap;
}
c(Lu, "resolvePositionMap");
function Jg(t, e) {
  return e >= 4 && t.positionMap4 ? t.positionMap4 : t.positionMap;
}
c(Jg, "resolvePrimaryPositionMap");
function Xg(t) {
  if (!Array.isArray(t)) return Ef();
  const e = /* @__PURE__ */ new Map();
  for (const n of t)
    n != null && n.tag && e.set(n.tag, { ...n });
  return e;
}
c(Xg, "resolveConventions");
async function Qg(t, e = {}) {
  var v, E, T, k, O, _, N;
  t != null && typeof t == "object" && !t.id && !t.tiles && (e = { ...t, ...e }, t = null);
  const {
    dryRun: n = !1,
    force: i = !1
  } = e;
  if (t = t ?? ((v = game.scenes) == null ? void 0 : v.viewed), !t) throw new Error("No scene provided to indexScene.");
  if (!globalThis.Tagger) throw new Error("Tagger is required to index scene criteria.");
  if (!i && rf(t) >= nf)
    throw new Error(
      `Scene "${t.name}" is already criteria-indexed. Use force: true to re-index.`
    );
  const r = Xg(e.conventions), a = { sceneId: t.id };
  let o = null, s = null, l = 3;
  for (const [D, $] of r) {
    if (!$.required) continue;
    const F = Tagger.getByTag(D, a) ?? [];
    if (!F.length) throw new Error(`No ${D} tile found.`);
    if ($.maxCount && F.length > $.maxCount)
      throw new Error(`Expected ${$.maxCount} ${D} tile(s), found ${F.length}.`);
    o = $, s = F[0];
    const A = s.getFlag("monks-active-tiles", "files");
    if (!(A != null && A.length)) throw new Error(`${D} tile has no MATT files.`);
    const R = ao((E = A[0]) == null ? void 0 : E.name);
    if (!(R != null && R.length))
      throw new Error(`Cannot parse bracket tags from: ${((T = A[0]) == null ? void 0 : T.name) ?? "<unknown>"}`);
    if (R.length < 3)
      throw new Error(`Expected 3+ bracket tags, found ${R.length}.`);
    l = R.length, l === 3 && ((k = o.positionMap) == null ? void 0 : k[2]) === "effect" && A.some((j) => {
      const H = ao(j == null ? void 0 : j.name);
      return (H == null ? void 0 : H[2]) === "No Lights";
    }) && (o = {
      ...o,
      positionMap: { ...o.positionMap, 2: "nolights" }
    }, r.set(D, o));
    break;
  }
  if (!o)
    throw new Error("No required tile convention registered. Register conventions before indexing.");
  const u = Jg(o, l), d = [], m = Object.keys(u).map(Number).sort((D, $) => D - $);
  for (const D of m) {
    const $ = u[D];
    d.includes($) || d.push($);
  }
  const f = {};
  for (const D of d)
    f[D] = /* @__PURE__ */ new Set();
  for (const [, D] of r) {
    if (D.positionMap === "inherit") continue;
    const $ = Lu(D, l, u);
    for (const F of Object.values($))
      f[F] || (f[F] = /* @__PURE__ */ new Set(), d.includes(F) || d.push(F));
  }
  const h = {}, p = Fg();
  for (const [D, $] of r) {
    const F = Tagger.getByTag(D, a) ?? [], A = Lu($, l, u), R = D.toLowerCase(), B = [];
    for (const j of F) {
      const H = await Tu(j, A, f, { dryRun: n });
      H && B.push(H);
    }
    h[R] = $.maxCount === 1 ? B[0] ?? null : B;
  }
  if (p.length > 0) {
    const D = t.getEmbeddedCollection("Tile") ?? [], $ = new Set(r.keys());
    for (const F of D) {
      if ((((_ = (O = globalThis.Tagger) == null ? void 0 : O.getTags) == null ? void 0 : _.call(O, F)) ?? []).some((j) => $.has(j))) continue;
      const B = F.getFlag("monks-active-tiles", "files");
      if (B != null && B.length)
        for (const j of p)
          try {
            const H = j(t, F, B);
            if (H != null && H.positionMap) {
              await Tu(F, H.positionMap, f, { dryRun: n });
              break;
            }
          } catch (H) {
            console.warn(`${ne} | Indexing hook error:`, H);
          }
    }
  }
  const y = Kg(d, f);
  n || (await os(t, y), await Vg(t));
  const w = o.tag.toLowerCase();
  Gg(
    n ? "Dry run complete" : "Indexing complete",
    `- ${y.length} criteria,`,
    `${((N = h[w]) == null ? void 0 : N.files) ?? 0} ${o.tag.toLowerCase()} files`
  );
  const b = Array.from(r.keys()).filter((D) => D !== o.tag).some((D) => {
    const $ = h[D.toLowerCase()];
    return Array.isArray($) ? $.length > 0 : !!$;
  });
  return {
    criteria: y,
    state: y.reduce((D, $) => (D[$.key] = $.default, D), {}),
    tiles: h,
    overlayMode: b
  };
}
c(Qg, "indexScene");
var dd, je, ht, gt, pi, et, zt, kn, Zo, de, kf, Of, Af, xl, Mf, $l, _f, Cr, Nl;
const Tt = class Tt extends Kn(Yn) {
  constructor(n = {}) {
    var i;
    super(n);
    M(this, de);
    M(this, je, null);
    M(this, ht, []);
    M(this, gt, {});
    M(this, pi, !1);
    M(this, et, null);
    M(this, zt, null);
    M(this, kn, null);
    M(this, Zo, 120);
    this.setScene(n.scene ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null);
  }
  setScene(n) {
    var i;
    I(this, je, n ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null), S(this, de, kf).call(this);
  }
  get scene() {
    return g(this, je);
  }
  async _prepareContext() {
    var r;
    const n = !!g(this, je), i = n && g(this, ht).length > 0;
    return {
      hasScene: n,
      hasCriteria: i,
      sceneName: ((r = g(this, je)) == null ? void 0 : r.name) ?? C("EIDOLON.CriteriaSwitcher.NoScene", "No active scene"),
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
      criteria: g(this, ht).map((a) => ({
        key: a.key,
        label: a.label || a.key,
        values: a.values.map((o) => {
          var s;
          return {
            value: o,
            selected: ((s = g(this, gt)) == null ? void 0 : s[a.key]) === o
          };
        }),
        defaultValue: a.default
      })),
      stateSummary: S(this, de, Nl).call(this)
    };
  }
  _onRender(n, i) {
    super._onRender(n, i), S(this, de, Of).call(this), S(this, de, Af).call(this);
  }
  async _onClose(n) {
    return g(this, et) !== null && (clearTimeout(g(this, et)), I(this, et, null)), g(this, kn) !== null && (Hooks.off("eidolon-utilities.criteriaStateApplied", g(this, kn)), I(this, kn, null)), super._onClose(n);
  }
};
je = new WeakMap(), ht = new WeakMap(), gt = new WeakMap(), pi = new WeakMap(), et = new WeakMap(), zt = new WeakMap(), kn = new WeakMap(), Zo = new WeakMap(), de = new WeakSet(), kf = /* @__PURE__ */ c(function() {
  if (!g(this, je)) {
    I(this, ht, []), I(this, gt, {});
    return;
  }
  I(this, ht, vt(g(this, je)).sort((n, i) => n.order - i.order)), I(this, gt, ss(g(this, je), g(this, ht)));
}, "#hydrateFromScene"), Of = /* @__PURE__ */ c(function() {
  var i, r;
  const n = this.element;
  n instanceof HTMLElement && (n.querySelectorAll("[data-criteria-key]").forEach((a) => {
    a.addEventListener("change", (o) => {
      const s = o.currentTarget;
      if (!(s instanceof HTMLSelectElement)) return;
      const l = s.dataset.criteriaKey;
      l && (I(this, gt, {
        ...g(this, gt),
        [l]: s.value
      }), S(this, de, Mf).call(this, { [l]: s.value }));
    });
  }), (i = n.querySelector("[data-action='reset-defaults']")) == null || i.addEventListener("click", () => {
    S(this, de, _f).call(this);
  }), (r = n.querySelector("[data-action='close-switcher']")) == null || r.addEventListener("click", () => {
    this.close();
  }));
}, "#bindEvents"), Af = /* @__PURE__ */ c(function() {
  g(this, kn) === null && I(this, kn, Hooks.on("eidolon-utilities.criteriaStateApplied", (n, i) => {
    !g(this, je) || (n == null ? void 0 : n.id) !== g(this, je).id || g(this, pi) || (I(this, gt, { ...i ?? {} }), this.render({ force: !0 }));
  }));
}, "#ensureSyncHook"), xl = /* @__PURE__ */ c(async function(n) {
  var i, r;
  if (g(this, je)) {
    S(this, de, Cr).call(this, "applying"), I(this, pi, !0);
    try {
      const a = await Lf(n, g(this, je));
      a && I(this, gt, a), S(this, de, Cr).call(this, "ready"), this.render({ force: !0 });
    } catch (a) {
      console.error(`${ne} | Failed to apply criteria state`, a), (r = (i = ui.notifications) == null ? void 0 : i.error) == null || r.call(
        i,
        C(
          "EIDOLON.CriteriaSwitcher.ApplyError",
          "Failed to apply the selected criteria state."
        )
      ), S(this, de, Cr).call(this, "error", (a == null ? void 0 : a.message) ?? "Unknown error");
    } finally {
      I(this, pi, !1), g(this, zt) && S(this, de, $l).call(this);
    }
  }
}, "#applyPartialState"), Mf = /* @__PURE__ */ c(function(n) {
  I(this, zt, {
    ...g(this, zt) ?? {},
    ...n ?? {}
  }), g(this, et) !== null && clearTimeout(g(this, et)), S(this, de, Cr).call(this, "applying"), I(this, et, setTimeout(() => {
    I(this, et, null), S(this, de, $l).call(this);
  }, g(this, Zo)));
}, "#queuePartialState"), $l = /* @__PURE__ */ c(async function() {
  if (g(this, pi) || !g(this, zt)) return;
  const n = g(this, zt);
  I(this, zt, null), await S(this, de, xl).call(this, n);
}, "#flushPendingState"), _f = /* @__PURE__ */ c(async function() {
  if (!g(this, ht).length) return;
  const n = g(this, ht).reduce((i, r) => (i[r.key] = r.default, i), {});
  I(this, gt, n), g(this, et) !== null && (clearTimeout(g(this, et)), I(this, et, null)), I(this, zt, null), await S(this, de, xl).call(this, n);
}, "#resetToDefaults"), Cr = /* @__PURE__ */ c(function(n, i = "") {
  const r = this.element;
  if (!(r instanceof HTMLElement)) return;
  const a = r.querySelector("[data-role='status']");
  if (a instanceof HTMLElement)
    switch (a.dataset.mode = n, n) {
      case "applying":
        a.textContent = C("EIDOLON.CriteriaSwitcher.Applying", "Applying changes...");
        break;
      case "error":
        a.textContent = `${C("EIDOLON.CriteriaSwitcher.Error", "Error")}: ${i}`;
        break;
      case "ready":
      default:
        a.textContent = `${C("EIDOLON.CriteriaSwitcher.Ready", "Ready")}: ${S(this, de, Nl).call(this)}`;
        break;
    }
}, "#setStatus"), Nl = /* @__PURE__ */ c(function() {
  return g(this, ht).length ? `[${g(this, ht).map((n) => {
    var i;
    return ((i = g(this, gt)) == null ? void 0 : i[n.key]) ?? n.default;
  }).join(" | ")}]` : "-";
}, "#formatStateSummary"), c(Tt, "CriteriaSwitcherApplication"), ve(Tt, "APP_ID", `${ne}-criteria-switcher`), ve(Tt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  qe(Tt, Tt, "DEFAULT_OPTIONS"),
  {
    id: Tt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((dd = qe(Tt, Tt, "DEFAULT_OPTIONS")) == null ? void 0 : dd.classes) ?? [], "eidolon-criteria-switcher-window", "themed"])
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
)), ve(Tt, "PARTS", {
  content: {
    template: `modules/${ne}/templates/criteria-switcher.html`
  }
});
let _l = Tt;
const Zg = rs(_l);
let Ti = null;
function ep(t) {
  var e;
  return t ?? ((e = game.scenes) == null ? void 0 : e.viewed) ?? null;
}
c(ep, "resolveScene");
function tp(t) {
  var e;
  return !!(t != null && t.rendered && ((e = t == null ? void 0 : t.element) != null && e.isConnected));
}
c(tp, "isRendered");
function fs() {
  return tp(Ti) ? Ti : (Ti = null, null);
}
c(fs, "getCriteriaSwitcher");
function xf(t) {
  var i, r, a, o, s;
  const e = ep(t);
  if (!e)
    return (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "No active scene to open the criteria switcher."), null;
  if (!cs(e))
    return (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, "You do not have permission to manage scene criteria."), null;
  const n = fs();
  return n ? (n.setScene(e), n.render({ force: !0 }), (s = n.bringToFront) == null || s.call(n), n) : (Ti = Zg({ scene: e }), Ti.render({ force: !0 }), Ti);
}
c(xf, "openCriteriaSwitcher");
function $f() {
  const t = fs();
  t && (t.close(), Ti = null);
}
c($f, "closeCriteriaSwitcher");
function Mc(t) {
  return fs() ? ($f(), null) : xf(t);
}
c(Mc, "toggleCriteriaSwitcher");
const np = {
  SCHEMA_VERSION: Ic,
  applyState: Lf,
  getState: Bg,
  getVersion: Ug,
  setVersion: If,
  getCriteria(t) {
    var e;
    return vt(t ?? ((e = game.scenes) == null ? void 0 : e.viewed));
  },
  setCriteria(t, e) {
    var n;
    return os(e ?? ((n = game.scenes) == null ? void 0 : n.viewed), t);
  },
  updateTiles: hf,
  updatePlaceables: Tf,
  indexScene: Qg,
  openCriteriaSwitcher: xf,
  closeCriteriaSwitcher: $f,
  toggleCriteriaSwitcher: Mc,
  findBestMatch: lg,
  findFileIndex: cg,
  resolveRules: of,
  // Convention registration API
  registerTileConvention: wr,
  unregisterTileConvention: xg,
  getTileConventions: Ef,
  // Hidden light provider API
  registerHiddenLightProvider: wf,
  unregisterHiddenLightProvider: Mg,
  // Indexing hook API
  registerIndexingHook: $g,
  unregisterIndexingHook: Ng
};
function ip(t) {
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
c(ip, "findTabNav");
function rp(t, e) {
  var i, r, a;
  return t instanceof HTMLElement ? [
    (i = t.querySelector(".tab[data-tab]")) == null ? void 0 : i.parentElement,
    t.querySelector(".sheet-body"),
    (a = (r = e == null ? void 0 : e.parentElement) == null ? void 0 : r.querySelector) == null ? void 0 : a.call(r, ":scope > .sheet-body"),
    e == null ? void 0 : e.parentElement
  ].find((o) => o instanceof HTMLElement) ?? null : null;
}
c(rp, "findTabBody");
function ap(t, e) {
  var n, i, r, a, o, s, l;
  return ((n = t == null ? void 0 : t.dataset) == null ? void 0 : n.group) ?? ((a = (r = (i = t == null ? void 0 : t.querySelector) == null ? void 0 : i.call(t, "[data-group]")) == null ? void 0 : r.dataset) == null ? void 0 : a.group) ?? ((l = (s = (o = e == null ? void 0 : e.querySelector) == null ? void 0 : o.call(e, ".tab[data-group]")) == null ? void 0 : s.dataset) == null ? void 0 : l.group) ?? null;
}
c(ap, "getTabGroup");
function op(t, e, n) {
  if (!(t instanceof HTMLElement)) return;
  t.textContent = "";
  const i = document.createElement("i");
  i.className = n, i.setAttribute("inert", ""), t.append(i, " ");
  const r = document.createElement("span");
  r.textContent = e, t.append(r);
}
c(op, "setTabButtonContent");
function sp(t, e, n) {
  const i = t.querySelector("[data-tab]"), r = (i == null ? void 0 : i.tagName) || "A", a = document.createElement(r);
  return i instanceof HTMLElement && (a.className = i.className), a.classList.remove("active"), r === "BUTTON" && (a.type = "button"), a.dataset.action = "tab", a.dataset.tab = n, e && (a.dataset.group = e), a.setAttribute("aria-selected", "false"), a.setAttribute("aria-pressed", "false"), a;
}
c(sp, "createTabButton");
function lp(t, e, n) {
  const i = document.createElement("div");
  i.classList.add("tab"), i.dataset.tab = n, e && (i.dataset.group = e), i.dataset.applicationPart = n, i.setAttribute("hidden", "true");
  const r = Gd(t);
  return t.insertBefore(i, r ?? null), i;
}
c(lp, "createTabPanel");
function Fs(t, e, n, i, r) {
  var s;
  if (!(i instanceof HTMLElement) || !(r instanceof HTMLElement)) return;
  const a = (s = t == null ? void 0 : t.tabGroups) == null ? void 0 : s[e];
  if (typeof a == "string" ? a === n : i.classList.contains("active") || r.classList.contains("active")) {
    i.classList.add("active"), i.setAttribute("aria-selected", "true"), i.setAttribute("aria-pressed", "true"), r.classList.add("active"), r.removeAttribute("hidden"), r.removeAttribute("aria-hidden");
    return;
  }
  i.classList.remove("active"), i.setAttribute("aria-selected", "false"), i.setAttribute("aria-pressed", "false"), r.classList.remove("active"), r.setAttribute("hidden", "true");
}
c(Fs, "syncTabVisibility");
function _c(t, e, n, i, r) {
  const a = ip(e), o = rp(e, a);
  if (!(a instanceof HTMLElement) || !(o instanceof HTMLElement)) return null;
  const s = ap(a, o);
  let l = a.querySelector(`[data-tab="${n}"]`);
  l instanceof HTMLElement || (l = sp(a, s, n), a.appendChild(l)), op(l, i, r);
  let u = o.querySelector(`.tab[data-tab="${n}"]`);
  u instanceof HTMLElement || (u = lp(o, s, n));
  const d = `data-eidolon-bound-${n}`;
  return l.hasAttribute(d) || (l.addEventListener("click", () => {
    Vd(t, n, s), requestAnimationFrame(() => {
      Fs(t, s, n, l, u);
    });
  }), l.setAttribute(d, "true")), Fs(t, s, n, l, u), requestAnimationFrame(() => {
    Fs(t, s, n, l, u);
  }), cp(t, a), u;
}
c(_c, "ensureTileConfigTab");
function cp(t, e) {
  !(t != null && t.setPosition) || !(e instanceof HTMLElement) || requestAnimationFrame(() => {
    var a;
    if (e.scrollWidth <= e.clientWidth) return;
    const n = e.scrollWidth - e.clientWidth, i = t.element instanceof HTMLElement ? t.element : (a = t.element) == null ? void 0 : a[0];
    if (!i) return;
    const r = i.offsetWidth || 480;
    t.setPosition({ width: r + n + 16 });
  });
}
c(cp, "fitNavWidth");
function Nf(t) {
  var e;
  return ((e = t == null ? void 0 : t.getFlag) == null ? void 0 : e.call(t, "monks-active-tiles", "files")) ?? [];
}
c(Nf, "getTileFiles$1");
function up(t = []) {
  return {
    strategy: "select-one",
    defaultTarget: Un(t, 0) ?? { indexHint: 0 },
    variants: [
      {
        criteria: {},
        target: Un(t, 0) ?? { indexHint: 0 }
      }
    ]
  };
}
c(up, "createDefaultTileCriteria");
function dp(t, e = {}) {
  var o, s;
  const { allowLegacy: n = !0 } = e, i = Nf(t), r = (o = t == null ? void 0 : t.getFlag) == null ? void 0 : o.call(t, ne, Ci);
  if (r) return ki(r, { files: i });
  if (!n) return null;
  const a = (s = t == null ? void 0 : t.getFlag) == null ? void 0 : s.call(t, ne, Ei);
  return a ? ki(a, { files: i }) : null;
}
c(dp, "getTileCriteria");
async function Iu(t, e, n = {}) {
  if (!(t != null && t.setFlag)) return null;
  const {
    strictValidation: i = !0
  } = n, r = Nf(t), a = ki(e, { files: r });
  if (!a)
    return typeof t.unsetFlag == "function" ? (await t.unsetFlag(ne, Ci), await t.unsetFlag(ne, Ei)) : (await t.setFlag(ne, Ci, null), await t.setFlag(ne, Ei, null)), null;
  if (i) {
    const o = uf(a, { files: r });
    if (o.errors.length > 0)
      throw new Error(
        `Tile criteria contains ${o.errors.length} conflicting rule pair(s). Resolve clashes before saving.`
      );
  }
  return await t.setFlag(ne, Ci, a), typeof t.unsetFlag == "function" && await t.unsetFlag(ne, Ei), a;
}
c(Iu, "setTileCriteria");
const Fl = "__eidolon_any__", Dl = "eidolon-tile-criteria", fp = "fa-solid fa-sliders", Ff = Symbol.for("eidolon.tileCriteriaUiState"), ms = ["all", "unmapped", "mapped", "conflicts"];
function mp(t) {
  const e = t == null ? void 0 : t[Ff];
  return !e || typeof e != "object" ? {
    filterQuery: "",
    filterMode: "all",
    selectedFileIndex: null
  } : {
    filterQuery: typeof e.filterQuery == "string" ? e.filterQuery : "",
    filterMode: ms.includes(e.filterMode) ? e.filterMode : "all",
    selectedFileIndex: Number.isInteger(e.selectedFileIndex) ? e.selectedFileIndex : null
  };
}
c(mp, "readUiState");
function hp(t, e) {
  if (!t || !e) return;
  typeof e.filterQuery == "string" && (t.filterQuery = e.filterQuery), ms.includes(e.filterMode) && (t.filterMode = e.filterMode), Number.isInteger(e.selectedFileIndex) && t.fileEntries.some((i) => i.index === e.selectedFileIndex) && (t.selectedFileIndex = e.selectedFileIndex);
}
c(hp, "applyUiState");
function gp(t) {
  const e = t == null ? void 0 : t.app, n = t == null ? void 0 : t.state;
  !e || !n || (e[Ff] = {
    filterQuery: typeof n.filterQuery == "string" ? n.filterQuery : "",
    filterMode: ms.includes(n.filterMode) ? n.filterMode : "all",
    selectedFileIndex: Number.isInteger(n.selectedFileIndex) ? n.selectedFileIndex : null
  });
}
c(gp, "persistUiState");
function pp(t) {
  const e = (t == null ? void 0 : t.object) ?? (t == null ? void 0 : t.document) ?? null;
  return !(e != null && e.isEmbedded) || e.documentName !== "Tile" ? null : e;
}
c(pp, "getTileDocument");
function yp(t) {
  var e;
  return ((e = t == null ? void 0 : t.getFlag) == null ? void 0 : e.call(t, "monks-active-tiles", "files")) ?? [];
}
c(yp, "getTileFiles");
function bp(t, e) {
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
c(bp, "getCriteriaDefinitions");
function vp(t) {
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
c(vp, "buildTree");
function wp(t, e) {
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
c(wp, "collapseFolderBranch");
function Ep(t, e) {
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
c(Ep, "getRuleSummariesForFile");
function Pl(t) {
  var h, p;
  const e = yp(t), n = kc(e), i = dp(t, { allowLegacy: !0 }) ?? up(e), r = bp(t, i), a = new Map(r.map((y) => [y.key, y.label])), o = new Map(
    n.map((y) => [
      y.index,
      y.path || y.label
    ])
  ), s = Dr(i.defaultTarget, e), l = ((h = n[0]) == null ? void 0 : h.index) ?? 0, u = s >= 0 ? s : l, d = new Map(n.map((y) => [y.index, []]));
  let m = 1;
  for (const y of i.variants ?? []) {
    const w = Dr(y.target, e);
    w < 0 || (d.has(w) || d.set(w, []), d.get(w).push({
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
      message: C("EIDOLON.TileCriteria.Ready", "Ready")
    }
  };
}
c(Pl, "buildEditorState");
function Rl(t, e) {
  return t.rulesByFile.has(e) || t.rulesByFile.set(e, []), t.rulesByFile.get(e);
}
c(Rl, "getRulesForFile");
function Cp(t) {
  return Object.fromEntries(
    Object.entries(t ?? {}).filter(([e, n]) => typeof e == "string" && e && typeof n == "string" && n.trim()).map(([e, n]) => [e, n.trim()])
  );
}
c(Cp, "sanitizeRuleCriteria");
function Df(t) {
  const e = Un(t.files, t.defaultIndex);
  if (!e) return null;
  const n = [], i = [];
  for (const [a, o] of t.rulesByFile.entries()) {
    const s = Un(t.files, a);
    if (s)
      for (const [l, u] of o.entries()) {
        const d = Cp(u.criteria);
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
    normalized: ki(
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
c(Df, "buildTileCriteriaDraft");
function Sp(t) {
  var e;
  return ((e = Df(t)) == null ? void 0 : e.normalized) ?? null;
}
c(Sp, "exportTileCriteria");
function ku(t) {
  const e = Df(t);
  if (!(e != null && e.normalized))
    return {
      errors: [],
      warnings: [],
      errorFileIndexes: [],
      warningFileIndexes: []
    };
  const n = uf(e.normalized, { files: t.files }), i = /* @__PURE__ */ c((s) => {
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
c(ku, "analyzeRuleConflicts");
function wa(t, e = "neutral") {
  const n = document.createElement("span");
  return n.classList.add("eidolon-tile-criteria__badge"), n.dataset.kind = e, n.textContent = t, n;
}
c(wa, "createBadge");
function Tp(t, e = {}) {
  const n = typeof t == "string" ? t : "", {
    maxLength: i = 42,
    headLength: r = 20,
    tailLength: a = 16
  } = e;
  if (!n || n.length <= i) return n;
  const o = n.slice(0, r).trimEnd(), s = n.slice(-a).trimStart();
  return `${o}...${s}`;
}
c(Tp, "middleEllipsis");
function Lp(t) {
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
      error: (r == null ? void 0 : r.message) ?? C("EIDOLON.TileCriteria.InvalidRegex", "Invalid regex."),
      matches: /* @__PURE__ */ c(() => !0, "matches")
    };
  }
}
c(Lp, "createRegexFilter");
function Ip(t, e) {
  const n = document.createElement("select");
  n.dataset.criteriaKey = t.key;
  const i = document.createElement("option");
  i.value = Fl, i.textContent = "*", n.appendChild(i);
  const r = new Set(t.values ?? []);
  e && !r.has(e) && r.add(e);
  for (const a of r) {
    const o = document.createElement("option");
    o.value = a, o.textContent = a, n.appendChild(o);
  }
  return n.value = e ?? Fl, n;
}
c(Ip, "createCriterionSelect");
function kp(t, e, n, i) {
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
    const m = Ip(l, (s = t.criteria) == null ? void 0 : s[l.key]);
    m.addEventListener("change", () => {
      m.value === Fl ? delete t.criteria[l.key] : t.criteria[l.key] = m.value, i();
    }), u.appendChild(m), a.appendChild(u);
  }
  r.appendChild(a);
  const o = document.createElement("button");
  return o.type = "button", o.classList.add("control", "ui-control", "eidolon-tile-criteria__rule-remove"), o.textContent = C("EIDOLON.TileCriteria.RemoveRule", "Remove"), o.addEventListener("click", () => {
    const u = Rl(e, n).filter((d) => d.id !== t.id);
    e.rulesByFile.set(n, u), i();
  }), r.appendChild(o), r;
}
c(kp, "renderRuleEditor");
const Na = /* @__PURE__ */ new WeakMap();
function Pf(t) {
  return (t == null ? void 0 : t.app) ?? (t == null ? void 0 : t.tile) ?? null;
}
c(Pf, "getDialogOwner");
function Op(t) {
  for (const e of t) {
    const n = qt(e);
    if (n) return n;
    const i = qt(e == null ? void 0 : e.element);
    if (i) return i;
  }
  return null;
}
c(Op, "findDialogRoot$1");
function Ap(t, e, n) {
  const i = t.state, r = i.fileEntries.find((y) => y.index === e);
  if (!r) return document.createElement("div");
  const a = document.createElement("section");
  a.classList.add("eidolon-tile-criteria__dialog-content");
  const o = document.createElement("header");
  o.classList.add("eidolon-tile-criteria__editor-header");
  const s = document.createElement("h4");
  s.textContent = i.relativePaths.get(r.index) || r.label, o.appendChild(s);
  const l = document.createElement("p");
  l.classList.add("notes"), l.textContent = `#${r.index + 1} · ${r.path || C("EIDOLON.TileCriteria.UnknownPath", "Unknown path")}`, o.appendChild(l), a.appendChild(o);
  const u = document.createElement("div");
  u.classList.add("eidolon-tile-criteria__editor-controls");
  const d = document.createElement("button");
  d.type = "button", d.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action"), i.defaultIndex === r.index ? (d.textContent = C("EIDOLON.TileCriteria.IsDefault", "Default Target"), d.disabled = !0) : (d.textContent = C("EIDOLON.TileCriteria.SetDefault", "Set As Default"), d.addEventListener("click", () => {
    i.defaultIndex = r.index, Ke(t), n();
  })), u.appendChild(d);
  const m = document.createElement("button");
  m.type = "button", m.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action", "secondary"), m.textContent = C("EIDOLON.TileCriteria.ClearFileRules", "Clear File Rules"), m.addEventListener("click", () => {
    i.rulesByFile.set(r.index, []), Ke(t), n();
  }), u.appendChild(m), a.appendChild(u);
  const f = document.createElement("div");
  f.classList.add("eidolon-tile-criteria__rule-editors");
  const h = Rl(i, r.index);
  if (h.length)
    for (const y of h)
      f.appendChild(
        kp(y, i, r.index, () => {
          Ke(t), n();
        })
      );
  else {
    const y = document.createElement("p");
    y.classList.add("notes"), y.textContent = C(
      "EIDOLON.TileCriteria.NoRulesForFile",
      "No rules map to this file yet. Add one to define when this variant should be active."
    ), f.appendChild(y);
  }
  a.appendChild(f);
  const p = document.createElement("button");
  return p.type = "button", p.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action"), p.textContent = C("EIDOLON.TileCriteria.AddRule", "Add Rule"), p.disabled = !i.criteriaDefinitions.length, p.addEventListener("click", () => {
    Rl(i, r.index).push({
      id: i.nextRuleId,
      criteria: {}
    }), i.nextRuleId += 1, Ke(t), n();
  }), a.appendChild(p), a;
}
c(Ap, "buildRuleEditorContent");
function Mp(t, e) {
  var m, f, h;
  const n = Pf(t);
  if (!n) return;
  const i = Na.get(n);
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
  Na.set(n, r);
  const a = /* @__PURE__ */ c(() => {
    Na.delete(n);
  }, "closeDialog"), o = /* @__PURE__ */ c(() => {
    r.host instanceof HTMLElement && r.host.replaceChildren(
      Ap(r.controller, r.fileIndex, o)
    );
  }, "refreshDialog");
  r.refresh = o;
  const s = C("EIDOLON.TileCriteria.EditorTitle", "Edit Tile Criteria Rules"), l = '<div class="eidolon-tile-criteria-editor-host"></div>', u = C("EIDOLON.TileCriteria.CloseEditor", "Close"), d = (h = (f = foundry == null ? void 0 : foundry.applications) == null ? void 0 : f.api) == null ? void 0 : h.DialogV2;
  if (typeof (d == null ? void 0 : d.wait) == "function") {
    d.wait({
      window: { title: s },
      content: l,
      buttons: [{ action: "close", label: u, default: !0 }],
      render: /* @__PURE__ */ c((...p) => {
        var b;
        const y = Op(p), w = (b = y == null ? void 0 : y.querySelector) == null ? void 0 : b.call(y, ".eidolon-tile-criteria-editor-host");
        w instanceof HTMLElement && (r.host = w, o());
      }, "render"),
      close: a,
      rejectClose: !1
    }).catch((p) => {
      console.warn(`${ne} | Rule editor dialog failed`, p), a();
    });
    return;
  }
  a();
}
c(Mp, "openRuleEditorDialog");
function Ou(t) {
  var i;
  const e = Pf(t);
  if (!e) return;
  const n = Na.get(e);
  (i = n == null ? void 0 : n.refresh) == null || i.call(n);
}
c(Ou, "refreshOpenRuleEditor");
function Hl(t, e) {
  return (t.rulesByFile.get(e) ?? []).length > 0;
}
c(Hl, "hasRulesForFile");
function Rf(t, e) {
  var n, i;
  return ((n = t == null ? void 0 : t.errorFileIndexes) == null ? void 0 : n.includes(e)) || ((i = t == null ? void 0 : t.warningFileIndexes) == null ? void 0 : i.includes(e));
}
c(Rf, "hasConflictForFile");
function _p(t, e, n) {
  switch (t.filterMode) {
    case "unmapped":
      return !Hl(t, e.index);
    case "mapped":
      return Hl(t, e.index);
    case "conflicts":
      return Rf(n, e.index);
    case "all":
    default:
      return !0;
  }
}
c(_p, "matchesFilterMode");
function xp(t, e) {
  let n = 0, i = 0, r = 0;
  for (const a of t.fileEntries)
    Hl(t, a.index) ? n += 1 : i += 1, Rf(e, a.index) && (r += 1);
  return {
    all: t.fileEntries.length,
    mapped: n,
    unmapped: i,
    conflicts: r
  };
}
c(xp, "getFilterModeCounts");
function $p(t) {
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
c($p, "getFilterModeLabel");
function Hf(t, e, n, i, r) {
  var u, d;
  const a = [...t.folders.keys()].sort((m, f) => m.localeCompare(f));
  for (const m of a) {
    const f = wp(m, t.folders.get(m)), h = document.createElement("li");
    h.classList.add("eidolon-tile-criteria__tree-branch");
    const p = document.createElement("div");
    p.classList.add("document", "folder", "update", "eidolon-tile-criteria__folder-row");
    const y = document.createElement("i");
    y.classList.add("fa-solid", "fa-folder-open"), p.appendChild(y);
    const w = document.createElement("span");
    w.classList.add("eidolon-tile-criteria__tree-folder-label"), w.textContent = f.label, w.title = f.label, p.appendChild(w), h.appendChild(p);
    const b = document.createElement("ul");
    b.classList.add("eidolon-tile-criteria__tree"), b.dataset.folder = f.label, Hf(f.node, e, n, i, b), b.childElementCount > 0 && h.appendChild(b), r.appendChild(h);
  }
  const o = [...t.files].sort((m, f) => m.name.localeCompare(f.name));
  if (!o.length) return;
  const s = document.createElement("li"), l = document.createElement("ul");
  l.classList.add("document-list", "eidolon-tile-criteria__document-list");
  for (const m of o) {
    const f = m.entry, h = f.index === e.selectedFileIndex, p = f.index === e.defaultIndex, y = Ep(e, f.index), w = document.createElement("li");
    w.classList.add("document", "update", "eidolon-tile-criteria__tree-file");
    const b = document.createElement("button");
    b.type = "button", b.classList.add("eidolon-tile-criteria__file-row");
    const v = (u = i == null ? void 0 : i.errorFileIndexes) == null ? void 0 : u.includes(f.index), E = (d = i == null ? void 0 : i.warningFileIndexes) == null ? void 0 : d.includes(f.index);
    v ? b.classList.add("has-conflict") : E && b.classList.add("has-warning");
    const T = e.relativePaths.get(f.index) || f.path || m.name, k = [T];
    v ? k.push(
      C(
        "EIDOLON.TileCriteria.ConflictFileHint",
        "This file participates in one or more conflicting rules."
      )
    ) : E && k.push(
      C(
        "EIDOLON.TileCriteria.WarningFileHint",
        "This file has potentially redundant rules."
      )
    ), y.length || k.push(
      C(
        "EIDOLON.TileCriteria.UnmappedHint",
        "No criteria rules map to this file."
      )
    ), b.title = k.join(`
`), h && b.classList.add("is-selected"), b.addEventListener("click", () => {
      e.selectedFileIndex = f.index, Ke(n), Mp(n, f.index);
    });
    const O = document.createElement("span");
    O.classList.add("eidolon-tile-criteria__indicator"), O.dataset.kind = p ? "default" : y.length ? "mapped" : "unmapped", b.appendChild(O);
    const _ = document.createElement("span");
    _.classList.add("eidolon-tile-criteria__file-content");
    const N = document.createElement("span");
    N.classList.add("eidolon-tile-criteria__file-heading");
    const D = document.createElement("span");
    D.classList.add("eidolon-tile-criteria__file-title"), D.textContent = Tp(m.name || f.label), D.title = T, N.appendChild(D);
    const $ = wa(`#${f.index + 1}`, "meta");
    $.classList.add("eidolon-tile-criteria__index-badge"), N.appendChild($), _.appendChild(N);
    const F = document.createElement("span");
    F.classList.add("eidolon-tile-criteria__badges"), p && F.appendChild(wa(C("EIDOLON.TileCriteria.DefaultBadge", "Default"), "default"));
    const A = y.slice(0, 2);
    for (const R of A)
      F.appendChild(wa(R, "rule"));
    if (y.length > A.length && F.appendChild(wa(`+${y.length - A.length}`, "meta")), _.appendChild(F), b.appendChild(_), v || E) {
      const R = document.createElement("span");
      R.classList.add("eidolon-tile-criteria__row-warning"), R.dataset.mode = v ? "error" : "warning", R.innerHTML = '<i class="fa-solid fa-triangle-exclamation" inert=""></i>', b.appendChild(R);
    }
    w.appendChild(b), l.appendChild(w);
  }
  s.appendChild(l), r.appendChild(s);
}
c(Hf, "renderTreeNode");
function Np(t, e, n, i = {}) {
  const r = document.createElement("section");
  r.classList.add("eidolon-tile-criteria__tree-panel");
  const a = Lp(t.filterQuery), o = xp(t, n);
  t.filterMode !== "all" && o[t.filterMode] === 0 && (t.filterMode = "all");
  const s = document.createElement("div");
  s.classList.add("eidolon-tile-criteria__toolbar");
  const l = document.createElement("div");
  l.classList.add("eidolon-tile-criteria__mode-bar");
  for (const v of ms) {
    const E = document.createElement("button");
    E.type = "button", E.classList.add("control", "ui-control", "eidolon-tile-criteria__mode-button"), E.dataset.mode = v, E.textContent = $p(v);
    const T = v === "all" || o[v] > 0;
    E.disabled = !T, T || (E.dataset.tooltip = C(
      "EIDOLON.TileCriteria.FilterModeUnavailable",
      "No entries currently match this filter."
    ), E.title = E.dataset.tooltip), t.filterMode === v ? (E.classList.add("is-active"), E.setAttribute("aria-pressed", "true")) : E.setAttribute("aria-pressed", "false"), E.addEventListener("click", () => {
      t.filterMode !== v && (t.filterMode = v, Ke(e));
    }), l.appendChild(E);
  }
  s.appendChild(l);
  const u = document.createElement("div");
  u.classList.add("eidolon-tile-criteria__filter-row");
  const d = document.createElement("input");
  d.type = "text", d.classList.add("eidolon-tile-criteria__filter-input"), d.placeholder = C("EIDOLON.TileCriteria.FilterPlaceholder", "Regex filter (path)"), d.value = t.filterQuery, d.autocomplete = "off", d.addEventListener("keydown", (v) => {
    v.stopPropagation(), v.key === "Enter" && v.preventDefault();
  }), d.addEventListener("keyup", (v) => {
    v.stopPropagation();
  }), d.addEventListener("change", (v) => {
    v.stopPropagation();
  }), d.addEventListener("input", (v) => {
    v.stopPropagation();
    const E = d.selectionStart ?? d.value.length, T = d.selectionEnd ?? E;
    t.filterQuery = d.value, Ke(e), requestAnimationFrame(() => {
      const k = e.section.querySelector(".eidolon-tile-criteria__filter-input");
      if (k instanceof HTMLInputElement) {
        k.focus();
        try {
          k.setSelectionRange(E, T);
        } catch {
        }
      }
    });
  }), u.appendChild(d);
  const m = document.createElement("div");
  m.classList.add("eidolon-tile-criteria__toolbar-actions");
  const f = document.createElement("button");
  f.type = "button";
  const h = C("EIDOLON.TileCriteria.Save", "Save Rules");
  f.classList.add("control", "ui-control", "eidolon-tile-criteria__toolbar-action", "icon-only"), f.dataset.tooltip = h, f.setAttribute("aria-label", h), f.title = h, f.innerHTML = '<i class="fa-solid fa-floppy-disk" inert=""></i>', f.disabled = n.errors.length > 0, f.addEventListener("click", () => {
    var v;
    (v = i.onSave) == null || v.call(i);
  }), m.appendChild(f);
  const p = document.createElement("button");
  p.type = "button";
  const y = C("EIDOLON.TileCriteria.Clear", "Clear Rules");
  if (p.classList.add("control", "ui-control", "secondary", "eidolon-tile-criteria__toolbar-action", "icon-only"), p.dataset.tooltip = y, p.setAttribute("aria-label", y), p.title = y, p.innerHTML = '<i class="fa-solid fa-trash" inert=""></i>', p.addEventListener("click", () => {
    var v;
    (v = i.onClear) == null || v.call(i);
  }), m.appendChild(p), u.appendChild(m), s.appendChild(u), r.appendChild(s), a.error) {
    const v = document.createElement("p");
    v.classList.add("notes", "eidolon-tile-criteria__filter-error"), v.textContent = `${C("EIDOLON.TileCriteria.InvalidRegex", "Invalid regex")}: ${a.error}`, r.appendChild(v);
  }
  const w = document.createElement("div");
  w.classList.add("eidolon-tile-criteria__library-tree");
  const b = t.fileEntries.filter((v) => {
    const E = t.relativePaths.get(v.index) || v.path || v.label;
    return _p(t, v, n) && a.matches(E);
  });
  if (t.fileEntries.length)
    if (b.length) {
      const v = document.createElement("ul");
      v.classList.add("eidolon-tile-criteria__tree"), Hf(vp(b), t, e, n, v), w.appendChild(v);
    } else {
      const v = document.createElement("p");
      v.classList.add("notes"), v.textContent = C("EIDOLON.TileCriteria.NoMatches", "No variants match this filter."), w.appendChild(v);
    }
  else {
    const v = document.createElement("p");
    v.classList.add("notes"), v.textContent = C("EIDOLON.TileCriteria.NoVariants", "No MATT variants found"), w.appendChild(v);
  }
  return r.appendChild(w), r;
}
c(Np, "renderTreePanel");
function Ke(t) {
  const { section: e, state: n } = t, i = ku(n);
  gp(t), e.replaceChildren();
  const r = /* @__PURE__ */ c(async () => {
    try {
      const o = ku(n);
      if (o.errors.length) {
        n.status = {
          mode: "error",
          message: C(
            "EIDOLON.TileCriteria.ConflictSaveBlocked",
            `Resolve ${o.errors.length} conflict(s) before saving tile criteria rules.`
          )
        }, Ke(t);
        return;
      }
      const s = Sp(n);
      if (!s) {
        n.status = {
          mode: "error",
          message: C("EIDOLON.TileCriteria.Invalid", "Invalid rules. Select valid target variants.")
        }, Ke(t);
        return;
      }
      await Iu(t.tile, s);
      const l = n.filterQuery, u = n.filterMode, d = n.selectedFileIndex;
      t.state = Pl(t.tile), t.state.filterQuery = l, t.state.filterMode = u, Number.isInteger(d) && (t.state.selectedFileIndex = d), t.state.status = {
        mode: "ready",
        message: C("EIDOLON.TileCriteria.Saved", "Tile criteria rules saved.")
      }, Ke(t), Ou(t);
    } catch (o) {
      console.error(`${ne} | Failed to save tile criteria`, o), n.status = {
        mode: "error",
        message: (o == null ? void 0 : o.message) ?? "Failed to save tile criteria rules."
      }, Ke(t);
    }
  }, "handleSave"), a = /* @__PURE__ */ c(async () => {
    try {
      await Iu(t.tile, null);
      const o = n.filterQuery, s = n.filterMode, l = n.selectedFileIndex;
      t.state = Pl(t.tile), t.state.filterQuery = o, t.state.filterMode = s, Number.isInteger(l) && (t.state.selectedFileIndex = l), t.state.status = {
        mode: "ready",
        message: C("EIDOLON.TileCriteria.Cleared", "Tile criteria rules cleared.")
      }, Ke(t), Ou(t);
    } catch (o) {
      console.error(`${ne} | Failed to clear tile criteria`, o), n.status = {
        mode: "error",
        message: (o == null ? void 0 : o.message) ?? "Failed to clear tile criteria rules."
      }, Ke(t);
    }
  }, "handleClear");
  if (e.appendChild(Np(n, t, i, {
    onSave: r,
    onClear: a
  })), i.errors.length || i.warnings.length) {
    const o = document.createElement("section");
    o.classList.add("eidolon-tile-criteria__conflicts");
    const s = document.createElement("p");
    s.classList.add("eidolon-tile-criteria__conflict-summary", "notes"), i.errors.length ? (s.dataset.mode = "error", s.textContent = C(
      "EIDOLON.TileCriteria.ConflictSummary",
      `${i.errors.length} conflict(s) must be resolved before saving${i.warnings.length ? ` (${i.warnings.length} warning(s))` : ""}.`
    )) : (s.dataset.mode = "warning", s.textContent = C(
      "EIDOLON.TileCriteria.WarningSummary",
      `${i.warnings.length} potential issue(s) detected.`
    )), o.appendChild(s);
    const l = document.createElement("p");
    l.classList.add("eidolon-tile-criteria__conflict-hint", "notes"), l.textContent = C(
      "EIDOLON.TileCriteria.ConflictHint",
      "Files involved in clashes are marked in red with a warning icon."
    ), o.appendChild(l), e.appendChild(o);
  }
  if (n.status.mode === "error" || n.status.mode === "warning") {
    const o = document.createElement("p");
    o.classList.add("eidolon-tile-criteria__status", "notes"), o.dataset.mode = n.status.mode, o.textContent = n.status.message, e.appendChild(o);
  }
}
c(Ke, "renderController");
function Fp(t, e = null) {
  const n = document.createElement("section");
  n.classList.add("eidolon-tile-criteria");
  const i = Pl(t);
  hp(i, mp(e));
  const r = {
    app: e,
    tile: t,
    section: n,
    state: i
  };
  return Ke(r), r;
}
c(Fp, "createController");
function Dp(t, e) {
  return _c(
    t,
    e,
    Dl,
    C("EIDOLON.TileCriteria.TabLabel", "Criteria"),
    fp
  );
}
c(Dp, "ensureTileCriteriaTab");
function Pp() {
  Hooks.on("renderTileConfig", (t, e) => {
    var l, u, d, m;
    const n = qt(e);
    if (!n) return;
    const i = pp(t);
    if (!i) return;
    if ((l = n.querySelector(".eidolon-tile-criteria")) == null || l.remove(), !as()) {
      (u = n.querySelector(`.item[data-tab='${Dl}']`)) == null || u.remove(), (d = n.querySelector(`.tab[data-tab='${Dl}']`)) == null || d.remove();
      return;
    }
    const r = Fp(i, t), a = Dp(t, n);
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
c(Pp, "registerTileCriteriaConfigControls");
const Rp = ["Checkbox", "Tile", "Settings", "Toggleable Lights"], Hp = [
  "Checkbox",
  "Tile",
  "Settings",
  "Toggleable Lights",
  "Checked",
  "Unchecked",
  "Individual"
];
function qp() {
  if (!globalThis.Tagger) return [];
  const t = Tagger.getByTag(Rp) ?? [], e = [];
  for (const n of t) {
    if (n.getFlag("monks-active-tiles", "variables.state") !== "unchecked") continue;
    const i = (Tagger.getTags(n) ?? []).filter((o) => !Hp.includes(o)), r = (Tagger.getByTag("Disable Automation") ?? []).concat(Tagger.getByTag("Settings") ?? []), a = Tagger.getByTag(i, { ignore: r }) ?? [];
    for (const o of a)
      o != null && o._id && e.push(o._id);
  }
  return e;
}
c(qp, "buildLightControlsMap");
function Bp() {
  wf(qp);
}
c(Bp, "registerCheckboxLightProvider");
function jp(t) {
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
c(jp, "toList");
function Up(t, e) {
  const n = t == null ? void 0 : t.tools;
  return Array.isArray(n) ? n.some((i) => (i == null ? void 0 : i.name) === e) : n instanceof Map ? n.has(e) : n && typeof n == "object" ? e in n ? !0 : Object.values(n).some((i) => (i == null ? void 0 : i.name) === e) : !1;
}
c(Up, "hasTool");
function Vp(t, e) {
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
c(Vp, "addTool");
function Wp() {
  Hooks.on("getSceneControlButtons", (t) => {
    var i;
    const e = jp(t);
    if (!e.length) return;
    const n = e.find((r) => (r == null ? void 0 : r.name) === "tiles") ?? e.find((r) => (r == null ? void 0 : r.name) === "tokens" || (r == null ? void 0 : r.name) === "token") ?? e[0];
    n && (Up(n, "eidolonCriteriaSwitcher") || Vp(n, {
      name: "eidolonCriteriaSwitcher",
      title: "Criteria Switcher",
      icon: "fa-solid fa-sliders",
      button: !0,
      toggle: !1,
      visible: cs(((i = game.scenes) == null ? void 0 : i.viewed) ?? null),
      onClick: /* @__PURE__ */ c(() => Mc(), "onClick")
    }));
  });
}
c(Wp, "registerSceneControlButton");
function Ea(t, e) {
  if (!t || typeof t != "object") return !1;
  const n = String(e).split(".");
  let i = t;
  for (const r of n) {
    if (!i || typeof i != "object" || !Object.prototype.hasOwnProperty.call(i, r)) return !1;
    i = i[r];
  }
  return !0;
}
c(Ea, "hasOwnPath");
function Gp() {
  const t = /* @__PURE__ */ c((i, r = null) => {
    i && Lg(i, r);
  }, "invalidateTileScene"), e = /* @__PURE__ */ c((i, r = null) => {
    i && qg(i, r);
  }, "invalidatePlaceableScene");
  Hooks.on("createTile", (i) => {
    t((i == null ? void 0 : i.parent) ?? null, i ?? null);
  }), Hooks.on("deleteTile", (i) => {
    t((i == null ? void 0 : i.parent) ?? null, i ?? null);
  }), Hooks.on("updateTile", (i, r) => {
    (Ea(r, `flags.${ne}.tileCriteria`) || Ea(r, `flags.${ne}.fileIndex`)) && t((i == null ? void 0 : i.parent) ?? null, i ?? null);
  });
  const n = /* @__PURE__ */ c((i) => {
    Hooks.on(`create${i}`, (r) => {
      e((r == null ? void 0 : r.parent) ?? null, r ?? null);
    }), Hooks.on(`delete${i}`, (r) => {
      e((r == null ? void 0 : r.parent) ?? null, r ?? null);
    }), Hooks.on(`update${i}`, (r, a) => {
      const o = Ea(a, `flags.${ne}.presets`), s = i === "AmbientLight" && Ea(a, `flags.${ne}.lightCriteria`);
      !o && !s || e((r == null ? void 0 : r.parent) ?? null, r ?? null);
    });
  }, "registerPlaceableHooks");
  n("AmbientLight"), n("Wall"), n("AmbientSound"), Hooks.on("canvasReady", (i) => {
    const r = (i == null ? void 0 : i.scene) ?? null;
    r && (t(r), e(r));
  });
}
c(Gp, "registerCriteriaCacheInvalidationHooks");
function zp() {
  zg(), Bp(), Wp(), Pp(), Gp(), Hooks.once("init", () => {
    var t, e;
    (e = (t = game.keybindings) == null ? void 0 : t.register) == null || e.call(t, ne, "toggleCriteriaSwitcher", {
      name: "Toggle Criteria Switcher",
      hint: "Open or close the criteria switcher window for live scene state updates.",
      editable: [{ key: "KeyM", modifiers: ["Alt"] }],
      onDown: /* @__PURE__ */ c(() => {
        var n, i, r;
        return cs(((n = game.scenes) == null ? void 0 : n.viewed) ?? null) ? (Mc(), !0) : ((r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "You do not have permission to manage scene criteria."), !0);
      }, "onDown"),
      restricted: !0,
      precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
    });
  }), Hooks.on("canvasReady", (t) => {
    var n;
    const e = fs();
    e && (e.setScene((t == null ? void 0 : t.scene) ?? ((n = game.scenes) == null ? void 0 : n.viewed) ?? null), e.render({ force: !0 }));
  }), Hooks.once("ready", () => {
    var e, n;
    const t = (n = (e = game.modules) == null ? void 0 : e.get) == null ? void 0 : n.call(e, ne);
    t && (t.api || (t.api = {}), t.api.criteria = np, console.log(`${ne} | Criteria engine API registered`));
  });
}
c(zp, "registerCriteriaEngineHooks");
zp();
const Fa = /* @__PURE__ */ new WeakMap(), Ca = /* @__PURE__ */ new WeakMap(), we = "__eidolon_default__";
function Yp() {
  Hooks.on("renderAmbientLightConfig", Kp), x("LightCriteria | AmbientLightConfig controls registered");
}
c(Yp, "registerAmbientLightCriteriaControls");
function Kp(t, e) {
  var n;
  tr("LightCriteria | renderAmbientLightConfig", {
    appId: (t == null ? void 0 : t.id) ?? null,
    constructor: ((n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) ?? null,
    isRendered: (t == null ? void 0 : t.rendered) ?? !1
  });
  try {
    const i = qt(e);
    if (!i) return;
    if (!as()) {
      i.querySelectorAll(".eidolon-light-criteria, .eidolon-light-criteria-main-switcher").forEach((r) => r.remove());
      return;
    }
    Jp(t, i);
  } catch (i) {
    console.error("eidolon-utilities | Failed to enhance AmbientLightConfig UI", i);
  } finally {
    Rn();
  }
}
c(Kp, "handleAmbientLightConfigRender");
function Jp(t, e) {
  var ur, Qn, dr, ce, gn;
  const n = (t == null ? void 0 : t.form) instanceof HTMLFormElement ? t.form : e instanceof HTMLFormElement ? e : (ur = e == null ? void 0 : e.closest) == null ? void 0 : ur.call(e, "form");
  if (!(n instanceof HTMLFormElement)) return;
  const i = n.querySelector(".window-content");
  if (!(i instanceof HTMLElement)) return;
  const r = Bf(t);
  if (!r) return;
  const a = by(r);
  x("LightCriteria | Resolved ambient light", {
    sheetId: (r == null ? void 0 : r.id) ?? null,
    persistedId: (a == null ? void 0 : a.id) ?? null,
    sameRef: r === a
  });
  const o = (a == null ? void 0 : a.parent) ?? r.parent ?? null, s = o ? Qh(o) : [], l = s.filter(
    (P) => Array.isArray(P == null ? void 0 : P.values) && P.values.length > 0
  ), u = ly(s), d = s.map((P) => typeof (P == null ? void 0 : P.id) == "string" ? P.id : null).filter((P) => !!P), m = a ?? r, f = o ? vt(o) : [];
  let h = pf(m);
  const p = Ag(h, f);
  JSON.stringify(p) !== JSON.stringify(h) && (h = p, yf(m, p).catch((P) => {
    console.warn("eidolon-utilities | Failed to persist migrated light criteria keys", P);
  })), x("LightCriteria | Loaded mapping state", {
    hasBase: !!(h != null && h.base),
    mappingCount: Array.isArray(h == null ? void 0 : h.mappings) ? h.mappings.length : 0,
    mappings: Array.isArray(h == null ? void 0 : h.mappings) ? h.mappings.map((P) => {
      var G, Z;
      return {
        id: P.id,
        key: P.key,
        hasColor: !!((Z = (G = P.config) == null ? void 0 : G.config) != null && Z.color)
      };
    }) : []
  });
  const y = i.querySelector(".eidolon-light-criteria");
  y && y.remove(), i.querySelectorAll(".eidolon-light-criteria-main-switcher").forEach((P) => P.remove());
  const w = document.createElement("fieldset");
  w.classList.add("eidolon-light-criteria");
  const b = document.createElement("legend");
  b.textContent = C("EIDOLON.LightCriteria.Legend", "Scene Criteria Lighting"), w.appendChild(b);
  const v = document.createElement("p");
  v.classList.add("notes"), v.textContent = C(
    "EIDOLON.LightCriteria.Description",
    "Capture a base lighting state, then map criteria values to lighting configurations."
  ), w.appendChild(v);
  const E = document.createElement("div");
  E.classList.add("eidolon-light-criteria__controls");
  const T = document.createElement("button");
  T.type = "button", T.dataset.action = "make-default", T.classList.add("eidolon-light-criteria__button"), T.textContent = C(
    "EIDOLON.LightCriteria.SetBase",
    "Set Base"
  ), E.appendChild(T);
  const k = document.createElement("button");
  k.type = "button", k.dataset.action = "create-mapping", k.classList.add("eidolon-light-criteria__button"), k.textContent = C(
    "EIDOLON.LightCriteria.CreateMapping",
    "Add Criteria Mapping"
  ), k.setAttribute("aria-expanded", "false"), E.appendChild(k), w.appendChild(E);
  const O = document.createElement("p");
  O.classList.add("notes", "eidolon-light-criteria__status"), w.appendChild(O);
  const _ = document.createElement("div");
  _.classList.add("eidolon-light-criteria__switcher");
  const N = document.createElement("label");
  N.classList.add("eidolon-light-criteria__switcher-label");
  const D = `${(t == null ? void 0 : t.id) ?? (r == null ? void 0 : r.id) ?? "eidolon-light"}-mapping-select`;
  N.htmlFor = D, N.textContent = C("EIDOLON.LightCriteria.SelectLabel", "Criteria Mapping"), _.appendChild(N);
  const $ = document.createElement("details");
  $.classList.add("eidolon-light-criteria__filter-details");
  const F = document.createElement("summary");
  F.classList.add("eidolon-light-criteria__filter-summary");
  const A = document.createElement("span");
  A.classList.add("eidolon-light-criteria__filter-summary-label"), A.textContent = C(
    "EIDOLON.LightCriteria.FilterHeading",
    "Filter mappings"
  ), F.appendChild(A);
  const R = document.createElement("span");
  R.classList.add("eidolon-light-criteria__filter-meta"), F.appendChild(R), $.appendChild(F);
  const B = document.createElement("div");
  B.classList.add("eidolon-light-criteria__filter-panel");
  const j = document.createElement("div");
  j.classList.add("eidolon-light-criteria__filter-grid");
  for (const P of l) {
    const G = document.createElement("label");
    G.classList.add("eidolon-light-criteria__filter");
    const Z = document.createElement("span");
    Z.classList.add("eidolon-light-criteria__filter-name"), Z.textContent = (dr = (Qn = P.name) == null ? void 0 : Qn.trim) != null && dr.call(Qn) ? P.name.trim() : C("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), G.appendChild(Z);
    const ee = document.createElement("select");
    ee.dataset.filterCategoryId = P.id, ee.classList.add("eidolon-light-criteria__filter-select");
    const ie = document.createElement("option");
    ie.value = "", ie.textContent = C("EIDOLON.LightCriteria.FilterAny", "Any"), ee.appendChild(ie);
    for (const fe of P.values) {
      const me = document.createElement("option");
      me.value = fe, me.textContent = fe, ee.appendChild(me);
    }
    G.appendChild(ee), j.appendChild(G);
  }
  B.appendChild(j);
  const H = document.createElement("div");
  H.classList.add("eidolon-light-criteria__filter-actions");
  const V = document.createElement("button");
  V.type = "button", V.dataset.action = "clear-mapping-filters", V.classList.add("eidolon-light-criteria__button", "secondary", "compact"), V.textContent = C("EIDOLON.LightCriteria.ClearFilters", "Clear Filters"), H.appendChild(V), B.appendChild(H), $.appendChild(B), $.hidden = l.length === 0, _.appendChild($);
  const Y = document.createElement("div");
  Y.classList.add("eidolon-light-criteria__switcher-controls"), _.appendChild(Y);
  const ae = document.createElement("select");
  ae.id = D, ae.classList.add("eidolon-light-criteria__select"), ae.dataset.action = "select-mapping", Y.appendChild(ae);
  const X = document.createElement("button");
  X.type = "button", X.dataset.action = "apply-selected-mapping", X.classList.add("eidolon-light-criteria__button", "secondary"), X.textContent = C("EIDOLON.LightCriteria.ApplyButton", "Apply"), Y.appendChild(X);
  const te = document.createElement("details");
  te.classList.add("eidolon-light-criteria__menu"), te.dataset.action = "mapping-actions-menu";
  const Zt = document.createElement("summary");
  Zt.classList.add("eidolon-light-criteria__menu-toggle"), Zt.innerHTML = '<i class="fa-solid fa-ellipsis-vertical" inert=""></i>', Zt.setAttribute(
    "aria-label",
    C("EIDOLON.LightCriteria.MoreActions", "More actions")
  ), Zt.dataset.tooltip = C("EIDOLON.LightCriteria.MoreActions", "More actions"), te.appendChild(Zt);
  const wt = document.createElement("div");
  wt.classList.add("eidolon-light-criteria__menu-list"), te.appendChild(wt);
  const He = document.createElement("button");
  He.type = "button", He.dataset.action = "update-selected-mapping", He.classList.add("eidolon-light-criteria__menu-item"), He.textContent = C(
    "EIDOLON.LightCriteria.UpdateSelected",
    "Save current config to selected"
  ), wt.appendChild(He);
  const st = document.createElement("button");
  st.type = "button", st.dataset.action = "edit-selected-mapping-criteria", st.classList.add("eidolon-light-criteria__menu-item"), st.textContent = C(
    "EIDOLON.LightCriteria.EditSelectedCriteria",
    "Edit selected mapping criteria"
  ), wt.appendChild(st);
  const lt = document.createElement("button");
  lt.type = "button", lt.dataset.action = "remove-selected-mapping", lt.classList.add("eidolon-light-criteria__menu-item", "danger"), lt.textContent = C(
    "EIDOLON.LightCriteria.RemoveSelected",
    "Delete selected mapping"
  ), wt.appendChild(lt), Y.appendChild(te);
  const Jn = document.createElement("div");
  Jn.classList.add("eidolon-light-criteria-main-switcher"), Jn.appendChild(_);
  const Ne = document.createElement("p");
  if (Ne.classList.add("notes", "eidolon-light-criteria-main-switcher__empty"), Ne.textContent = C(
    "EIDOLON.LightCriteria.ActiveRequiresBase",
    "Set Base Lighting to enable mapping selection and actions."
  ), Jn.appendChild(Ne), s.length === 0) {
    const P = document.createElement("p");
    P.classList.add("notification", "warning", "eidolon-light-criteria__warning"), P.textContent = C(
      "EIDOLON.LightCriteria.NoCategoriesWarning",
      "This scene has no criteria configured. Add criteria under Scene -> Criteria to enable criteria-driven lighting."
    ), w.appendChild(P);
  } else if (l.length === 0) {
    const P = document.createElement("p");
    P.classList.add("notification", "warning", "eidolon-light-criteria__warning"), P.textContent = C(
      "EIDOLON.LightCriteria.NoValuesWarning",
      "Criteria exist, but none define selectable values. Add values in Scene -> Criteria."
    ), w.appendChild(P);
  }
  const Me = document.createElement("div");
  Me.classList.add("eidolon-light-criteria__creation"), Me.dataset.section = "creation", Me.hidden = !0;
  const _i = document.createElement("p");
  _i.classList.add("notes"), _i.textContent = C(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ), Me.appendChild(_i);
  const en = document.createElement("div");
  en.classList.add("eidolon-light-criteria__category-list"), Me.appendChild(en);
  for (const P of l) {
    const G = document.createElement("label");
    G.classList.add("eidolon-light-criteria__category");
    const Z = document.createElement("span");
    Z.classList.add("eidolon-light-criteria__category-name"), Z.textContent = (gn = (ce = P.name) == null ? void 0 : ce.trim) != null && gn.call(ce) ? P.name.trim() : C("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), G.appendChild(Z);
    const ee = document.createElement("select");
    ee.dataset.categoryId = P.id, ee.classList.add("eidolon-light-criteria__category-select");
    const ie = document.createElement("option");
    ie.value = "", ie.textContent = C(
      "EIDOLON.LightCriteria.IgnoreCategory",
      "Ignore"
    ), ee.appendChild(ie);
    for (const fe of P.values) {
      const me = document.createElement("option");
      me.value = fe, me.textContent = fe, ee.appendChild(me);
    }
    G.appendChild(ee), en.appendChild(G);
  }
  const Xn = document.createElement("div");
  Xn.classList.add("eidolon-light-criteria__creation-actions");
  const ct = document.createElement("button");
  ct.type = "button", ct.dataset.action = "save-mapping", ct.classList.add("eidolon-light-criteria__button", "primary"), ct.textContent = C(
    "EIDOLON.LightCriteria.SaveMapping",
    "Save Mapping"
  ), Xn.appendChild(ct);
  const tn = document.createElement("button");
  tn.type = "button", tn.dataset.action = "cancel-create", tn.classList.add("eidolon-light-criteria__button", "secondary"), tn.textContent = C(
    "EIDOLON.LightCriteria.Cancel",
    "Cancel"
  ), Xn.appendChild(tn), Me.appendChild(Xn), w.appendChild(Me), i.prepend(Jn), i.appendChild(w), w.hidden = !0, Zp(t, {
    fieldset: w,
    homeContainer: i
  }), requestAnimationFrame(() => {
    var P;
    (P = t.setPosition) == null || P.call(t, { height: "auto" });
  });
  let q = h;
  ti({ switcher: _, emptyState: Ne, state: q }), ei(O, q), gr(k, {
    state: q,
    hasCategories: l.length > 0
  }), x("LightCriteria | Controls injected", {
    sceneId: (o == null ? void 0 : o.id) ?? null,
    lightId: (r == null ? void 0 : r.id) ?? null,
    hasBase: !!(q != null && q.base),
    mappingCount: Array.isArray(q == null ? void 0 : q.mappings) ? q.mappings.length : 0,
    categories: l.length
  });
  const ha = hy(q), Q = {
    restoreConfig: null,
    app: t,
    selectedMapping: ha,
    editorMode: "create",
    editingMappingId: null,
    mappingFilters: {}
  };
  Fa.set(w, Q);
  const Et = /* @__PURE__ */ c(() => {
    te.open = !1;
  }, "closeActionsMenu");
  Zt.addEventListener("click", (P) => {
    te.classList.contains("is-disabled") && (P.preventDefault(), Et());
  });
  const Fe = /* @__PURE__ */ c((P = Q.selectedMapping) => {
    const G = cy(j), Z = Array.isArray(q == null ? void 0 : q.mappings) ? q.mappings : [], ee = dy(Z, G), ie = Object.keys(G).length;
    Q.mappingFilters = G, V.disabled = ie === 0, fy(R, {
      totalCount: Z.length,
      visibleCount: ee.length,
      hasFilters: ie > 0,
      activeFilterCount: ie
    }), $.classList.toggle("has-active-filters", ie > 0), my(ae, q, u, P, {
      mappings: ee,
      categoryOrder: d
    }), Q.selectedMapping = ae.value ?? "", Ds({
      mappingSelect: ae,
      applyMappingButton: X,
      updateMappingButton: He,
      editCriteriaButton: st,
      removeMappingButton: lt,
      actionsMenu: te,
      state: q
    }), te.classList.contains("is-disabled") && Et();
  }, "refreshMappingSelector");
  j.querySelectorAll("select[data-filter-category-id]").forEach((P) => {
    P.addEventListener("change", () => {
      const G = Q.selectedMapping;
      Fe(G), Q.selectedMapping !== G && Ps(
        a ?? r,
        q,
        Q.selectedMapping
      ).then((Z) => {
        Z && (q = Z);
      });
    });
  }), V.addEventListener("click", () => {
    uy(j);
    const P = Q.selectedMapping;
    Fe(P), $.open = !1, Q.selectedMapping !== P && Ps(
      a ?? r,
      q,
      Q.selectedMapping
    ).then((G) => {
      G && (q = G);
    });
  }), ae.addEventListener("change", () => {
    Q.selectedMapping = ae.value ?? "", Ds({
      mappingSelect: ae,
      applyMappingButton: X,
      updateMappingButton: He,
      editCriteriaButton: st,
      removeMappingButton: lt,
      actionsMenu: te,
      state: q
    }), Ps(
      a ?? r,
      q,
      Q.selectedMapping
    ).then((P) => {
      P && (q = P);
    });
  });
  const cr = /* @__PURE__ */ c(async () => {
    var ee, ie, fe, me, ut, pn, dt, yn, be, bn, vn, jt, Zn, fr;
    const P = ae.value ?? "";
    if (!P) {
      (ie = (ee = ui.notifications) == null ? void 0 : ee.warn) == null || ie.call(
        ee,
        C(
          "EIDOLON.LightCriteria.SelectMappingWarning",
          "Choose a criteria mapping before applying."
        )
      ), Fe(Q.selectedMapping);
      return;
    }
    if (P === we) {
      if (!(q != null && q.base)) {
        (me = (fe = ui.notifications) == null ? void 0 : fe.warn) == null || me.call(
          fe,
          C(
            "EIDOLON.LightCriteria.BaseUnavailable",
            "Set a base lighting state before applying it."
          )
        );
        return;
      }
      Sa(w, Me, k), Pa(t, n, q.base), q = await Ir(a ?? r, {
        mappingId: we,
        categories: null,
        updatedAt: Date.now()
      }), Q.selectedMapping = we, Fe(Q.selectedMapping), ei(O, q), ti({ switcher: _, emptyState: Ne, state: q }), gr(k, {
        state: q,
        hasCategories: l.length > 0
      }), Mu(n, {
        mappingId: we,
        color: ((pn = (ut = q.base) == null ? void 0 : ut.config) == null ? void 0 : pn.color) ?? null
      }), (yn = (dt = ui.notifications) == null ? void 0 : dt.info) == null || yn.call(
        dt,
        C(
          "EIDOLON.LightCriteria.BaseApplied",
          "Applied the base lighting state to the form."
        )
      ), Et();
      return;
    }
    const G = Array.isArray(q == null ? void 0 : q.mappings) && q.mappings.length ? q.mappings.find((xi) => (xi == null ? void 0 : xi.id) === P) : null;
    if (!G) {
      (bn = (be = ui.notifications) == null ? void 0 : be.warn) == null || bn.call(
        be,
        C(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      ), Q.selectedMapping = "", Fe(Q.selectedMapping);
      return;
    }
    Sa(w, Me, k), Pa(t, n, G.config), q = await Ir(a ?? r, {
      mappingId: G.id,
      categories: G.categories,
      updatedAt: Date.now()
    }), Q.selectedMapping = G.id, Fe(Q.selectedMapping), ei(O, q), ti({ switcher: _, emptyState: Ne, state: q }), gr(k, {
      state: q,
      hasCategories: l.length > 0
    }), Mu(n, {
      mappingId: G.id,
      color: ((jt = (vn = G.config) == null ? void 0 : vn.config) == null ? void 0 : jt.color) ?? null
    });
    const Z = Yi(G, u, d);
    (fr = (Zn = ui.notifications) == null ? void 0 : Zn.info) == null || fr.call(
      Zn,
      C(
        "EIDOLON.LightCriteria.MappingApplied",
        "Applied mapping: {label}"
      ).replace("{label}", Z)
    ), Et();
  }, "applySelectedMapping");
  X.addEventListener("click", () => {
    cr();
  }), ae.addEventListener("keydown", (P) => {
    P.key === "Enter" && (P.preventDefault(), cr());
  });
  const ga = /* @__PURE__ */ c(async () => {
    var G, Z, ee, ie, fe, me, ut, pn, dt, yn, be, bn, vn, jt, Zn, fr, xi, pa, eu, ya, tu;
    const P = Q.selectedMapping;
    if (!P) {
      (Z = (G = ui.notifications) == null ? void 0 : G.warn) == null || Z.call(
        G,
        C(
          "EIDOLON.LightCriteria.SelectMappingWarning",
          "Choose a criteria mapping before applying."
        )
      );
      return;
    }
    He.disabled = !0;
    try {
      const Qe = Da(t, a);
      if (P === we)
        q = await wu(a ?? r, Qe), x("LightCriteria | Base lighting updated", {
          lightId: ((ee = a ?? r) == null ? void 0 : ee.id) ?? null,
          configColor: ((ie = Qe == null ? void 0 : Qe.config) == null ? void 0 : ie.color) ?? null
        }), (me = (fe = ui.notifications) == null ? void 0 : fe.info) == null || me.call(
          fe,
          C(
            "EIDOLON.LightCriteria.BaseUpdated",
            "Updated the base lighting state with the current configuration."
          )
        ), Q.selectedMapping = we;
      else {
        const $i = kr(q, P);
        if (!$i) {
          (pn = (ut = ui.notifications) == null ? void 0 : ut.warn) == null || pn.call(
            ut,
            C(
              "EIDOLON.LightCriteria.MappingUnavailable",
              "The selected criteria mapping is no longer available."
            )
          ), Q.selectedMapping = "", Fe(Q.selectedMapping);
          return;
        }
        q = await Eu(
          a ?? r,
          $i.categories,
          Qe,
          { label: $i.label ?? null }
        ), x("LightCriteria | Mapping updated", {
          mappingId: P,
          hasColor: !!((dt = Qe == null ? void 0 : Qe.config) != null && dt.color),
          stored: Array.isArray(q == null ? void 0 : q.mappings) ? ((yn = q.mappings.find((Ss) => (Ss == null ? void 0 : Ss.id) === P)) == null ? void 0 : yn.config) ?? null : null,
          persisted: (bn = (be = a ?? r) == null ? void 0 : be.getFlag) == null ? void 0 : bn.call(be, Si, zi)
        });
        const mr = kr(q, P), uh = Yi(mr || $i, u, d);
        x("LightCriteria | Mapping updated", {
          mappingId: P,
          categories: $i.categories,
          updatedColor: ((vn = Qe == null ? void 0 : Qe.config) == null ? void 0 : vn.color) ?? null,
          storedColor: ((Zn = (jt = mr == null ? void 0 : mr.config) == null ? void 0 : jt.config) == null ? void 0 : Zn.color) ?? ((xi = (fr = $i.config) == null ? void 0 : fr.config) == null ? void 0 : xi.color) ?? null
        }), (eu = (pa = ui.notifications) == null ? void 0 : pa.info) == null || eu.call(
          pa,
          C(
            "EIDOLON.LightCriteria.MappingUpdated",
            "Saved changes to mapping: {label}"
          ).replace("{label}", uh)
        ), Q.selectedMapping = P;
      }
      ei(O, q), ti({ switcher: _, emptyState: Ne, state: q }), gr(k, {
        state: q,
        hasCategories: l.length > 0
      }), Fe(Q.selectedMapping), Et();
    } catch (Qe) {
      console.error("eidolon-utilities | Failed to update light criteria mapping", Qe), (tu = (ya = ui.notifications) == null ? void 0 : ya.error) == null || tu.call(
        ya,
        C(
          "EIDOLON.LightCriteria.MappingUpdateError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      He.disabled = !1, Ds({
        mappingSelect: ae,
        applyMappingButton: X,
        updateMappingButton: He,
        editCriteriaButton: st,
        removeMappingButton: lt,
        actionsMenu: te,
        state: q
      });
    }
  }, "updateSelectedMapping");
  He.addEventListener("click", () => {
    ga();
  }), Fe(Q.selectedMapping), T.addEventListener("click", async () => {
    var P, G, Z, ee, ie, fe;
    T.disabled = !0;
    try {
      const me = Da(t, a);
      q = await wu(a ?? r, me), x("LightCriteria | Base lighting stored", {
        lightId: ((P = a ?? r) == null ? void 0 : P.id) ?? null,
        configColor: ((G = me == null ? void 0 : me.config) == null ? void 0 : G.color) ?? null
      }), (ee = (Z = ui.notifications) == null ? void 0 : Z.info) == null || ee.call(
        Z,
        C(
          "EIDOLON.LightCriteria.BaseStored",
          "Saved the current configuration as the base lighting state."
        )
      ), ei(O, q), ti({ switcher: _, emptyState: Ne, state: q }), gr(k, {
        state: q,
        hasCategories: l.length > 0
      }), Q.selectedMapping = we, Fe(Q.selectedMapping);
    } catch (me) {
      console.error("eidolon-utilities | Failed to store base light criteria state", me), (fe = (ie = ui.notifications) == null ? void 0 : ie.error) == null || fe.call(
        ie,
        C(
          "EIDOLON.LightCriteria.BaseError",
          "Failed to save the base lighting state. Check the console for details."
        )
      );
    } finally {
      T.disabled = !1;
    }
  }), k.addEventListener("click", () => {
    var G, Z, ee, ie;
    if (!(q != null && q.base)) {
      (Z = (G = ui.notifications) == null ? void 0 : G.warn) == null || Z.call(
        G,
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
    const P = Fa.get(w);
    Au({
      app: t,
      fieldset: w,
      createButton: k,
      creationSection: Me,
      categoryList: en,
      form: n,
      persistedLight: a,
      stateEntry: P,
      mode: "create",
      mapping: null,
      preloadConfig: q.base
    });
  }), st.addEventListener("click", () => {
    var Z, ee, ie, fe;
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
    const G = kr(q, P);
    if (!G) {
      (fe = (ie = ui.notifications) == null ? void 0 : ie.warn) == null || fe.call(
        ie,
        C(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      );
      return;
    }
    Et(), qf(t, { fieldset: w, homeContainer: i }), Au({
      app: t,
      fieldset: w,
      createButton: k,
      creationSection: Me,
      categoryList: en,
      form: n,
      persistedLight: a,
      stateEntry: Q,
      mode: "retarget",
      mapping: G,
      preloadConfig: G.config
    });
  }), ct.addEventListener("click", async () => {
    var G, Z, ee, ie, fe, me, ut, pn, dt, yn;
    const P = yy(en);
    if (!P) {
      (Z = (G = ui.notifications) == null ? void 0 : G.warn) == null || Z.call(
        G,
        C(
          "EIDOLON.LightCriteria.SelectionRequired",
          "Select at least one criteria value to identify the mapping."
        )
      );
      return;
    }
    ct.disabled = !0;
    try {
      const be = Da(t, a);
      if (Q.editorMode === "retarget" && Q.editingMappingId) {
        const vn = ql(q, P);
        let jt = !1;
        if (vn && vn !== Q.editingMappingId && (jt = await Xp(), !jt)) {
          ct.disabled = !1;
          return;
        }
        q = await Ig(
          a ?? r,
          Q.editingMappingId,
          P,
          be,
          { replaceExisting: jt }
        ), x("LightCriteria | Mapping criteria retargeted", {
          mappingId: Q.editingMappingId,
          categories: P,
          replaced: jt,
          configColor: ((ee = be == null ? void 0 : be.config) == null ? void 0 : ee.color) ?? null
        }), (fe = (ie = ui.notifications) == null ? void 0 : ie.info) == null || fe.call(
          ie,
          C(
            "EIDOLON.LightCriteria.MappingCriteriaUpdated",
            "Updated mapping criteria for the selected mapping."
          )
        );
      } else
        q = await Eu(
          a ?? r,
          P,
          be,
          {}
        ), x("LightCriteria | Mapping saved from editor", {
          categories: P,
          configColor: ((me = be == null ? void 0 : be.config) == null ? void 0 : me.color) ?? null
        }), (pn = (ut = ui.notifications) == null ? void 0 : ut.info) == null || pn.call(
          ut,
          C(
            "EIDOLON.LightCriteria.MappingSaved",
            "Updated lighting mapping for the selected scene criteria."
          )
        );
      ei(O, q), ti({ switcher: _, emptyState: Ne, state: q });
      const bn = ql(q, P);
      bn && (Q.selectedMapping = bn), Fe(Q.selectedMapping), Sa(w, Me, k), Et();
    } catch (be) {
      console.error("eidolon-utilities | Failed to persist light criteria mapping", be), (yn = (dt = ui.notifications) == null ? void 0 : dt.error) == null || yn.call(
        dt,
        C(
          "EIDOLON.LightCriteria.MappingError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      ct.disabled = !1;
    }
  }), tn.addEventListener("click", () => {
    const P = Fa.get(w);
    P != null && P.restoreConfig && Pa(t, n, P.restoreConfig), Sa(w, Me, k);
  }), lt.addEventListener("click", async () => {
    var Z, ee;
    const P = Q.selectedMapping;
    !P || P === we || !await Qp() || (q = await kg(a ?? r, P), Q.selectedMapping = "", ei(O, q), ti({ switcher: _, emptyState: Ne, state: q }), Fe(Q.selectedMapping), Et(), (ee = (Z = ui.notifications) == null ? void 0 : Z.info) == null || ee.call(
      Z,
      C("EIDOLON.LightCriteria.MappingRemoved", "Removed selected mapping.")
    ));
  });
}
c(Jp, "enhanceAmbientLightConfig");
function Au({
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
  s && (s.restoreConfig = Da(t, o), s.editorMode = l, s.editingMappingId = l === "retarget" ? (u == null ? void 0 : u.id) ?? null : null), d && Pa(t, a, d), l === "retarget" && (u != null && u.categories) ? py(r, u.categories) : gy(r);
  const m = i.querySelector("p.notes");
  m instanceof HTMLElement && (m.textContent = l === "retarget" ? C(
    "EIDOLON.LightCriteria.EditCriteriaDescription",
    "Adjust criteria values for the selected mapping."
  ) : C(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const f = i.querySelector('button[data-action="save-mapping"]');
  f instanceof HTMLButtonElement && (f.textContent = l === "retarget" ? C("EIDOLON.LightCriteria.SaveCriteriaChanges", "Save Criteria Changes") : C("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), i.hidden = !1, n.setAttribute("aria-expanded", "true"), xc(e, i), requestAnimationFrame(() => {
    var h;
    (h = t.setPosition) == null || h.call(t, { height: "auto" });
  });
}
c(Au, "openMappingEditor");
async function Xp() {
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
    yes: /* @__PURE__ */ c(() => !0, "yes"),
    no: /* @__PURE__ */ c(() => !1, "no"),
    defaultYes: !1
  });
}
c(Xp, "confirmCriteriaConflict");
async function Qp() {
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
    yes: /* @__PURE__ */ c(() => !0, "yes"),
    no: /* @__PURE__ */ c(() => !1, "no"),
    defaultYes: !1
  });
}
c(Qp, "confirmRemoveMapping");
function Zp(t, { fieldset: e, homeContainer: n }) {
  const i = ny(t, n);
  if (!(i instanceof HTMLElement)) return;
  const r = i.querySelector(".window-header");
  if (!(r instanceof HTMLElement)) return;
  let a = r.querySelector('[data-eidolon-action="open-light-criteria-manager"]');
  if (!(a instanceof HTMLButtonElement)) {
    a = document.createElement("button"), a.type = "button", a.classList.add("header-control", "icon"), a.dataset.eidolonAction = "open-light-criteria-manager", a.dataset.tooltip = C("EIDOLON.LightCriteria.OpenManager", "Open Scene Criteria Lighting"), a.setAttribute("aria-label", C("EIDOLON.LightCriteria.OpenManager", "Open Scene Criteria Lighting")), a.innerHTML = '<i class="fa-solid fa-sliders" inert=""></i>';
    const o = r.querySelector(".window-controls") ?? r, s = o.querySelector('[data-action="toggleControls"]');
    if ((s == null ? void 0 : s.parentElement) === o)
      o.insertBefore(a, s);
    else {
      const l = o.querySelector('[data-action="close"]');
      (l == null ? void 0 : l.parentElement) === o ? o.insertBefore(a, l) : o.appendChild(a);
    }
  }
  a.onclick = (o) => {
    o.preventDefault(), qf(t, { fieldset: e, homeContainer: n });
  };
}
c(Zp, "ensureManagerHeaderButton");
function qf(t, { fieldset: e, homeContainer: n }) {
  var f, h, p;
  const i = Ca.get(t);
  if (i != null && i.rendered) {
    (f = i.bringToTop) == null || f.call(i);
    return;
  }
  const r = /* @__PURE__ */ c((...y) => {
    var v;
    const w = ey(y), b = (v = w == null ? void 0 : w.querySelector) == null ? void 0 : v.call(w, ".eidolon-light-criteria-manager-host");
    b instanceof HTMLElement && (ty(e), e.hidden = !1, b.appendChild(e));
  }, "onRender"), a = /* @__PURE__ */ c(() => {
    n instanceof HTMLElement && n.appendChild(e), e.hidden = !0, Ca.delete(t), requestAnimationFrame(() => {
      var y;
      (y = t.setPosition) == null || y.call(t, { height: "auto" });
    });
  }, "onClose"), o = C("EIDOLON.LightCriteria.ManagerTitle", "Scene Criteria Lighting"), s = '<div class="eidolon-light-criteria-manager-host"></div>', l = C("EIDOLON.LightCriteria.Close", "Close"), u = (p = (h = foundry == null ? void 0 : foundry.applications) == null ? void 0 : h.api) == null ? void 0 : p.DialogV2;
  if (typeof (u == null ? void 0 : u.wait) == "function")
    try {
      let y = !1;
      const w = /* @__PURE__ */ c(() => {
        y || (y = !0, a());
      }, "closeOnce");
      Ca.set(t, {
        rendered: !0,
        bringToTop: /* @__PURE__ */ c(() => {
        }, "bringToTop")
      }), u.wait({
        window: { title: o },
        content: s,
        buttons: [{ action: "close", label: l, default: !0 }],
        render: /* @__PURE__ */ c((...b) => r(...b), "render"),
        close: w,
        rejectClose: !1
      }).catch((b) => {
        console.warn("eidolon-utilities | DialogV2 manager failed, falling back to Dialog", b), w();
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
  Ca.set(t, m), m.render(!0);
}
c(qf, "openManagerDialog");
function ey(t) {
  for (const e of t) {
    const n = qt(e);
    if (n) return n;
    const i = qt(e == null ? void 0 : e.element);
    if (i) return i;
  }
  return null;
}
c(ey, "findDialogRoot");
function ty(t) {
  if (!(t instanceof HTMLElement) || t.dataset.managerLayout === "true") return;
  t.dataset.managerLayout = "true", t.classList.add("is-manager");
  const e = t.querySelector("legend"), n = t.querySelector("p.notes:not(.eidolon-light-criteria__status)"), i = t.querySelector(".eidolon-light-criteria__controls"), r = t.querySelector(".eidolon-light-criteria__status"), a = t.querySelector(".eidolon-light-criteria__creation"), o = Array.from(t.querySelectorAll(".eidolon-light-criteria__warning")), s = document.createElement("div");
  s.classList.add("eidolon-light-criteria-manager");
  const l = document.createElement("section");
  l.classList.add("eidolon-light-criteria-manager__section", "is-top"), s.appendChild(l);
  const u = document.createElement("section");
  u.classList.add("eidolon-light-criteria-manager__section", "is-bottom"), s.appendChild(u);
  const d = document.createElement("div");
  if (d.classList.add("eidolon-light-criteria-manager__header"), d.textContent = C("EIDOLON.LightCriteria.ManagerHeader", "Base State"), l.appendChild(d), r && l.appendChild(r), i && l.appendChild(i), o.length) {
    const f = document.createElement("div");
    f.classList.add("eidolon-light-criteria-manager__warnings");
    for (const h of o) f.appendChild(h);
    l.appendChild(f);
  }
  const m = document.createElement("div");
  m.classList.add("eidolon-light-criteria-manager__header"), m.textContent = C("EIDOLON.LightCriteria.ManagerAuthoring", "Create or Update Mapping"), u.appendChild(m), a && u.appendChild(a), t.innerHTML = "", e && t.appendChild(e), n && t.appendChild(n), t.appendChild(s), xc(t, a);
}
c(ty, "applyManagerLayout");
function ny(t, e) {
  var i;
  const n = qt(t == null ? void 0 : t.element);
  return n || (((i = e == null ? void 0 : e.closest) == null ? void 0 : i.call(e, ".application")) ?? null);
}
c(ny, "resolveApplicationRoot");
function Sa(t, e, n) {
  const i = Fa.get(t);
  i && (i.restoreConfig = null, i.editorMode = "create", i.editingMappingId = null), e.hidden = !0, n.setAttribute("aria-expanded", "false");
  const r = e.querySelector("p.notes");
  r instanceof HTMLElement && (r.textContent = C(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const a = e.querySelector('button[data-action="save-mapping"]');
  a instanceof HTMLButtonElement && (a.textContent = C("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), xc(t, e), requestAnimationFrame(() => {
    var o, s;
    (s = (o = i == null ? void 0 : i.app) == null ? void 0 : o.setPosition) == null || s.call(o, { height: "auto" });
  });
}
c(Sa, "hideCreationSection");
function ei(t, e) {
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
c(ei, "updateStatusLine");
function gr(t, { state: e, hasCategories: n }) {
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
c(gr, "updateCreateButtonState");
function Da(t, e) {
  var l, u, d;
  const n = e ?? Bf(t);
  if (!n)
    throw new Error("Ambient light document unavailable.");
  const i = Oi(((l = n.toObject) == null ? void 0 : l.call(n)) ?? {});
  if (!i)
    throw new Error("Unable to duplicate ambient light data.");
  const r = (t == null ? void 0 : t.form) instanceof HTMLFormElement ? t.form : null, a = r ? Rh(r) : {}, o = foundry.utils.mergeObject(i, a, {
    inplace: !1,
    performDeletions: !0
  });
  r && (r.querySelectorAll("color-picker[name]").forEach((m) => {
    var b, v;
    const f = m.getAttribute("name");
    if (!f) return;
    const h = typeof m.value == "string" ? m.value : "", p = ((b = m.ui) == null ? void 0 : b.input) ?? ((v = m.querySelector) == null ? void 0 : v.call(m, 'input[type="color"]')), y = (p == null ? void 0 : p.value) ?? "", w = h || y;
    typeof w != "string" || !w || (foundry.utils.setProperty(o, f, w), x("LightCriteria | Captured color-picker value", {
      path: f,
      pickerValue: h,
      swatchValue: y,
      chosenValue: w
    }));
  }), r.querySelectorAll("range-picker[name]").forEach((m) => {
    var k, O;
    const f = m.getAttribute("name");
    if (!f) return;
    const h = m.value !== void 0 && m.value !== null ? String(m.value) : "", p = (k = m.querySelector) == null ? void 0 : k.call(m, 'input[type="range"]'), y = (O = m.querySelector) == null ? void 0 : O.call(m, 'input[type="number"]'), w = p instanceof HTMLInputElement ? p.value : "", b = y instanceof HTMLInputElement ? y.value : "", v = h || b || w;
    if (typeof v != "string" || !v.length) return;
    const E = Number(v), T = Number.isFinite(E) ? E : v;
    foundry.utils.setProperty(o, f, T), x("LightCriteria | Captured range-picker value", {
      path: f,
      elementValue: h,
      numberValue: b,
      rangeValue: w,
      chosenValue: T
    });
  }));
  const s = Oi(o);
  return x("LightCriteria | Captured form config", {
    lightId: (n == null ? void 0 : n.id) ?? null,
    hasColor: !!((u = s == null ? void 0 : s.config) != null && u.color),
    color: ((d = s == null ? void 0 : s.config) == null ? void 0 : d.color) ?? null
  }), s;
}
c(Da, "captureAmbientLightFormConfig");
function Pa(t, e, n) {
  if (!n || typeof n != "object") return;
  const i = foundry.utils.flattenObject(n, { safe: !0 });
  for (const [r, a] of Object.entries(i)) {
    const o = e.querySelectorAll(`[name="${r}"]`);
    if (o.length) {
      x("LightCriteria | Applying field", {
        path: r,
        value: a,
        elementCount: o.length
      });
      for (const s of o)
        s instanceof HTMLElement && s.tagName === "COLOR-PICKER" ? ry(s, a) : s instanceof HTMLElement && s.tagName === "RANGE-PICKER" ? ay(s, a) : s instanceof HTMLInputElement ? iy(s, a) : s instanceof HTMLSelectElement ? oy(s, a) : s instanceof HTMLTextAreaElement && sy(s, a);
    }
  }
  requestAnimationFrame(() => {
    var r;
    return (r = t._previewChanges) == null ? void 0 : r.call(t);
  });
}
c(Pa, "applyConfigToForm");
function iy(t, e, n) {
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
c(iy, "applyValueToInput");
function ry(t, e, n) {
  var s, l, u, d, m, f;
  const i = e == null ? "" : String(e);
  let r = !1;
  t.value !== i && (t.value = i, t.setAttribute("value", i), (s = t.ui) != null && s.setValue && t.ui.setValue(i), r = !0);
  const a = ((l = t.ui) == null ? void 0 : l.input) ?? ((u = t.querySelector) == null ? void 0 : u.call(t, 'input[type="color"]'));
  a instanceof HTMLInputElement && a.value !== i && (a.value = i, Rt(a));
  const o = ((d = t.ui) == null ? void 0 : d.text) ?? ((m = t.querySelector) == null ? void 0 : m.call(t, 'input[type="text"]'));
  o instanceof HTMLInputElement && o.value !== i && (o.value = i, Rt(o)), (f = t.ui) != null && f.commit ? t.ui.commit() : (t.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), t.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }))), x("LightCriteria | Color picker applied", {
    value: i,
    pickerValue: t.value ?? null,
    swatchValue: (a == null ? void 0 : a.value) ?? null,
    textValue: (o == null ? void 0 : o.value) ?? null
  }), r && Rt(t);
}
c(ry, "applyValueToColorPicker");
function ay(t, e, n) {
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
  x("LightCriteria | Range picker applied", {
    value: i,
    resolvedValue: a,
    rangeValue: (s == null ? void 0 : s.value) ?? null,
    numberValue: (l == null ? void 0 : l.value) ?? null
  }), o && Rt(t);
}
c(ay, "applyValueToRangePicker");
function oy(t, e, n) {
  const i = e == null ? "" : String(e);
  t.value !== i && (t.value = i, Rt(t));
}
c(oy, "applyValueToSelect");
function sy(t, e, n) {
  const i = e == null ? "" : String(e);
  t.value !== i && (t.value = i, Rt(t));
}
c(sy, "applyValueToTextarea");
function Rt(t) {
  t.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), t.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }));
}
c(Rt, "triggerInputChange");
function Ds({
  mappingSelect: t,
  applyMappingButton: e,
  updateMappingButton: n,
  editCriteriaButton: i,
  removeMappingButton: r,
  actionsMenu: a,
  state: o
}) {
  const s = (t == null ? void 0 : t.value) ?? "", l = !!(o != null && o.base), u = s && s !== we ? !!kr(o, s) : !1;
  if (e instanceof HTMLButtonElement && (s ? s === we ? e.disabled = !l : e.disabled = !u : e.disabled = !0), n instanceof HTMLButtonElement && (s ? s === we ? n.disabled = !1 : n.disabled = !u : n.disabled = !0), i instanceof HTMLButtonElement && (i.disabled = !s || s === we || !u), r instanceof HTMLButtonElement && (r.disabled = !s || s === we || !u), a instanceof HTMLElement) {
    const d = n instanceof HTMLButtonElement && !n.disabled || i instanceof HTMLButtonElement && !i.disabled || r instanceof HTMLButtonElement && !r.disabled;
    a.classList.toggle("is-disabled", !d), !d && "open" in a && (a.open = !1);
  }
}
c(Ds, "syncMappingSwitcherState");
function ly(t) {
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
c(ly, "buildCategoryNameLookup");
function cy(t) {
  const e = {};
  return t instanceof HTMLElement && t.querySelectorAll("select[data-filter-category-id]").forEach((n) => {
    var a, o;
    const i = n.dataset.filterCategoryId, r = (o = (a = n.value) == null ? void 0 : a.trim) == null ? void 0 : o.call(a);
    !i || !r || (e[i] = r);
  }), e;
}
c(cy, "readMappingFilterSelections");
function uy(t) {
  t instanceof HTMLElement && t.querySelectorAll("select[data-filter-category-id]").forEach((e) => {
    e.value = "";
  });
}
c(uy, "resetMappingFilterSelections");
function dy(t, e) {
  const n = Array.isArray(t) ? t : [], i = Object.entries(e ?? {}).filter(([, r]) => !!r);
  return i.length ? n.filter((r) => {
    if (!r || typeof r != "object") return !1;
    const a = r.categories ?? {};
    for (const [o, s] of i)
      if ((a == null ? void 0 : a[o]) !== s) return !1;
    return !0;
  }) : n.slice();
}
c(dy, "filterMappingsByCriteria");
function fy(t, { totalCount: e = 0, visibleCount: n = 0, hasFilters: i = !1, activeFilterCount: r = 0 } = {}) {
  if (!(t instanceof HTMLElement)) return;
  if (!i) {
    t.textContent = C(
      "EIDOLON.LightCriteria.FilterSummaryAll",
      "All ({count})"
    ).replace("{count}", String(e));
    return;
  }
  const a = C(
    "EIDOLON.LightCriteria.FilterSummaryActive",
    "{active} filters · {visible}/{total}"
  ).replace("{active}", String(r)).replace("{visible}", String(n)).replace("{total}", String(e));
  t.textContent = a;
}
c(fy, "updateMappingFilterMeta");
function my(t, e, n, i, r = {}) {
  if (!(t instanceof HTMLSelectElement)) return;
  const a = typeof i == "string" ? i : "", o = !!(e != null && e.base), s = Array.isArray(r == null ? void 0 : r.categoryOrder) ? r.categoryOrder : [], l = Array.isArray(r == null ? void 0 : r.mappings) ? r.mappings.slice() : Array.isArray(e == null ? void 0 : e.mappings) ? e.mappings.slice() : [], u = t.value;
  t.innerHTML = "";
  const d = document.createElement("option");
  d.value = "", d.textContent = C(
    "EIDOLON.LightCriteria.SelectPlaceholder",
    "Select a mapping"
  ), d.disabled = o, t.appendChild(d);
  const m = document.createElement("option");
  m.value = we, m.textContent = C(
    "EIDOLON.LightCriteria.BaseOption",
    "Base Lighting"
  ), m.disabled = !o, t.appendChild(m), l.slice().sort((y, w) => {
    var E;
    const b = Yi(y, n, s), v = Yi(w, n, s);
    return b.localeCompare(v, ((E = game.i18n) == null ? void 0 : E.lang) ?? void 0, {
      sensitivity: "base"
    });
  }).forEach((y) => {
    if (!(y != null && y.id)) return;
    const w = document.createElement("option");
    w.value = y.id, w.textContent = Yi(y, n, s), t.appendChild(w);
  });
  const f = new Set(
    Array.from(t.options).filter((y) => !y.disabled).map((y) => y.value)
  ), h = o && u === "" ? "" : u, p = a || (f.has(h) ? h : "");
  p && f.has(p) ? t.value = p : o ? t.value = we : t.value = "";
}
c(my, "populateMappingSelector");
function Yi(t, e, n = []) {
  if (!t || typeof t != "object")
    return C("EIDOLON.LightCriteria.UnnamedMapping", "Unnamed Mapping");
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
    return `${e.get(s) ?? C("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category")}=${u}`;
  }).filter(Boolean);
  return o.length === 0 ? C("EIDOLON.LightCriteria.UnnamedMapping", "Unnamed Mapping") : o.join(" | ");
}
c(Yi, "formatMappingOptionLabel");
function ql(t, e) {
  if (!t || typeof t != "object" || !Array.isArray(t.mappings)) return null;
  const n = or(e);
  if (!n) return null;
  const i = t.mappings.find((r) => (r == null ? void 0 : r.key) === n);
  return (i == null ? void 0 : i.id) ?? null;
}
c(ql, "findMappingIdByCategories");
function kr(t, e) {
  return !e || !t || typeof t != "object" || !Array.isArray(t.mappings) ? null : t.mappings.find((n) => (n == null ? void 0 : n.id) === e) ?? null;
}
c(kr, "getMappingById");
function hy(t) {
  if (!t || typeof t != "object") return "";
  const e = t.current;
  if (e != null && e.mappingId) {
    if (e.mappingId === we)
      return t != null && t.base ? we : "";
    if (Array.isArray(t.mappings) && t.mappings.some((n) => n.id === e.mappingId))
      return e.mappingId;
  }
  if (e != null && e.categories) {
    const n = ql(t, e.categories);
    if (n) return n;
  }
  return "";
}
c(hy, "resolveInitialMappingSelection");
function Mu(t, e = {}) {
  var o, s, l, u;
  if (!(t instanceof HTMLFormElement)) return;
  const n = t.querySelector('color-picker[name="config.color"]'), i = (n == null ? void 0 : n.value) ?? null, r = ((o = n == null ? void 0 : n.ui) == null ? void 0 : o.text) ?? ((s = n == null ? void 0 : n.querySelector) == null ? void 0 : s.call(n, 'input[type="text"]')), a = ((l = n == null ? void 0 : n.ui) == null ? void 0 : l.input) ?? ((u = n == null ? void 0 : n.querySelector) == null ? void 0 : u.call(n, 'input[type="color"]'));
  x("LightCriteria | Color state after apply", {
    ...e,
    textValue: (r == null ? void 0 : r.value) ?? null,
    pickerValue: i,
    swatchValue: (a == null ? void 0 : a.value) ?? null
  });
}
c(Mu, "logAppliedColorState");
function gy(t) {
  t.querySelectorAll("select[data-category-id]").forEach((e) => {
    e.value = "";
  });
}
c(gy, "resetCategorySelections");
function py(t, e) {
  const n = e && typeof e == "object" ? e : {};
  t.querySelectorAll("select[data-category-id]").forEach((i) => {
    const r = i.dataset.categoryId;
    if (!r) return;
    const a = n[r];
    i.value = typeof a == "string" ? a : "";
  });
}
c(py, "setCategorySelections");
function yy(t) {
  const e = {};
  return t.querySelectorAll("select[data-category-id]").forEach((n) => {
    var a, o;
    const i = n.dataset.categoryId, r = (o = (a = n.value) == null ? void 0 : a.trim) == null ? void 0 : o.call(a);
    !i || !r || (e[i] = r);
  }), Object.keys(e).length > 0 ? e : null;
}
c(yy, "readCategorySelections");
async function Ps(t, e, n) {
  if (!t) return null;
  try {
    if (!n)
      return await Ir(t, {});
    if (n === we)
      return await Ir(t, {
        mappingId: we,
        categories: null,
        updatedAt: Date.now()
      });
    const i = kr(e, n);
    return i ? await Ir(t, {
      mappingId: i.id,
      categories: i.categories,
      updatedAt: Date.now()
    }) : null;
  } catch (i) {
    return console.warn("eidolon-utilities | Failed to persist mapping selection", i), null;
  }
}
c(Ps, "persistCurrentSelection");
function xc(t, e) {
  if (!(t instanceof HTMLElement)) return;
  const n = t.querySelector(".eidolon-light-criteria-manager__section.is-bottom");
  n instanceof HTMLElement && (n.hidden = !!(e != null && e.hidden));
}
c(xc, "updateManagerSectionVisibility");
function ti({ switcher: t, emptyState: e, state: n }) {
  const i = !!(n != null && n.base);
  t instanceof HTMLElement && (t.hidden = !i), e instanceof HTMLElement && (e.hidden = i);
}
c(ti, "updateActiveMappingVisibility");
function Bf(t) {
  const e = (t == null ? void 0 : t.object) ?? (t == null ? void 0 : t.document) ?? null;
  return !(e != null && e.isEmbedded) || e.documentName !== "AmbientLight" ? null : e;
}
c(Bf, "getAmbientLightDocument");
function by(t) {
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
c(by, "getPersistedAmbientLightDocument");
function vy() {
  Yp();
}
c(vy, "registerLightCriteriaHooks");
vy();
const Bl = /* @__PURE__ */ new Map();
let jl = !1;
function $c(t, e) {
  Bl.has(t) && console.warn(`[${L}] Socket handler for type "${t}" already registered, overwriting.`), Bl.set(t, e);
}
c($c, "registerSocketHandler");
function Ra(t, e) {
  if (!jl) {
    console.error(`[${L}] Socket not initialized. Call initializeSocket() first.`);
    return;
  }
  game.socket.emit(`module.${L}`, { type: t, payload: e });
}
c(Ra, "emitSocket");
function wy() {
  jl || (game.socket.on(`module.${L}`, (t) => {
    const { type: e, payload: n } = t ?? {}, i = Bl.get(e);
    i ? i(n) : console.warn(`[${L}] No socket handler for type "${e}"`);
  }), jl = !0, console.log(`[${L}] Socket initialized on channel module.${L}`));
}
c(wy, "initializeSocket");
const jf = "tween", Uf = "tween-sequence", Ul = "tween-sequence-cancel", Oe = Object.freeze({
  ABORT: "abort",
  CONTINUE: "continue"
}), wn = Object.freeze({
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
}), oo = /* @__PURE__ */ new Map();
function Bt({ type: t, execute: e, validate: n }) {
  oo.has(t) && console.warn(`[tween-registry] Type "${t}" already registered, overwriting.`), oo.set(t, { type: t, execute: e, validate: n ?? (() => {
  }) });
}
c(Bt, "registerTweenType");
function sr(t) {
  return oo.get(t);
}
c(sr, "getTweenType");
function Ey(t, e = {}) {
  const n = sr(t);
  if (!n)
    throw new Error(`Unknown tween type: "${t}".`);
  return n.validate(e ?? {}), n;
}
c(Ey, "validateTweenEntry");
function Vl() {
  return [...oo.keys()];
}
c(Vl, "listTweenTypes");
const Ki = {
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
  easeInBounce: /* @__PURE__ */ c((t) => 1 - Ki.easeOutBounce(1 - t), "easeInBounce"),
  easeInOutBounce: /* @__PURE__ */ c((t) => t < 0.5 ? (1 - Ki.easeOutBounce(1 - 2 * t)) / 2 : (1 + Ki.easeOutBounce(2 * t - 1)) / 2, "easeInOutBounce"),
  easeInElastic: /* @__PURE__ */ c((t) => t === 0 || t === 1 ? t : -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI), "easeInElastic"),
  easeOutElastic: /* @__PURE__ */ c((t) => t === 0 || t === 1 ? t : Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1, "easeOutElastic")
};
function ot(t) {
  if (t && Ki[t])
    return Ki[t];
  const e = foundry.canvas.animation.CanvasAnimation;
  return {
    linear: e.easeLinear,
    easeInOutCosine: e.easeInOutCosine
  }[t] ?? e.easeInOutCosine;
}
c(ot, "resolveEasing");
function Nc() {
  return ["linear", "easeInOutCosine", ...Object.keys(Ki)];
}
c(Nc, "listEasingNames");
function so(t) {
  return t <= 0.04045 ? t / 12.92 : ((t + 0.055) / 1.055) ** 2.4;
}
c(so, "srgbToLinear");
function Ji(t) {
  return t <= 31308e-7 ? 12.92 * t : 1.055 * t ** (1 / 2.4) - 0.055;
}
c(Ji, "linearToSrgb");
function _u(t, e, n) {
  const i = 0.4122214708 * t + 0.5363325363 * e + 0.0514459929 * n, r = 0.2119034982 * t + 0.6806995451 * e + 0.1073969566 * n, a = 0.0883024619 * t + 0.2817188376 * e + 0.6299787005 * n, o = Math.cbrt(i), s = Math.cbrt(r), l = Math.cbrt(a);
  return [
    0.2104542553 * o + 0.793617785 * s - 0.0040720468 * l,
    1.9779984951 * o - 2.428592205 * s + 0.4505937099 * l,
    0.0259040371 * o + 0.7827717662 * s - 0.808675766 * l
  ];
}
c(_u, "linearRgbToOklab");
function Cy(t, e, n) {
  const i = (t + 0.3963377774 * e + 0.2158037573 * n) ** 3, r = (t - 0.1055613458 * e - 0.0638541728 * n) ** 3, a = (t - 0.0894841775 * e - 1.291485548 * n) ** 3;
  return [
    4.0767416621 * i - 3.3077115913 * r + 0.2309699292 * a,
    -1.2684380046 * i + 2.6097574011 * r - 0.3413193965 * a,
    -0.0041960863 * i - 0.7034186147 * r + 1.707614701 * a
  ];
}
c(Cy, "oklabToLinearRgb");
function lo(t) {
  return [t.r, t.g, t.b];
}
c(lo, "colorToRgb");
function Vf(t, e, n) {
  const i = /* @__PURE__ */ c((a) => Math.max(0, Math.min(1, a)), "clamp"), r = /* @__PURE__ */ c((a) => Math.round(i(a) * 255).toString(16).padStart(2, "0"), "toHex");
  return `#${r(t)}${r(e)}${r(n)}`;
}
c(Vf, "rgbToHex");
function Sy(t, e, n) {
  if (n <= 0) return t.toHTML();
  if (n >= 1) return e.toHTML();
  const i = foundry.utils.Color, [r, a, o] = t.hsl, [s, l, u] = e.hsl, d = (s - r + 0.5) % 1 - 0.5, m = (r + d * n + 1) % 1, f = a + (l - a) * n, h = o + (u - o) * n;
  return i.fromHSL([m, f, h]).toHTML();
}
c(Sy, "interpolateHsl");
function Ty(t, e, n) {
  if (n <= 0) return t.toHTML();
  if (n >= 1) return e.toHTML();
  const [i, r, a] = lo(t).map(so), [o, s, l] = lo(e).map(so), u = Ji(i + (o - i) * n), d = Ji(r + (s - r) * n), m = Ji(a + (l - a) * n);
  return Vf(u, d, m);
}
c(Ty, "interpolateRgb");
function Ly(t, e, n) {
  if (n <= 0) return t.toHTML();
  if (n >= 1) return e.toHTML();
  const [i, r, a] = lo(t).map(so), [o, s, l] = lo(e).map(so), [u, d, m] = _u(i, r, a), [f, h, p] = _u(o, s, l), y = 0.02, w = Math.sqrt(d * d + m * m), b = Math.sqrt(h * h + p * p);
  let v, E, T;
  if (w < y || b < y)
    v = u + (f - u) * n, E = d + (h - d) * n, T = m + (p - m) * n;
  else {
    const N = Math.atan2(m, d);
    let $ = Math.atan2(p, h) - N;
    $ > Math.PI && ($ -= 2 * Math.PI), $ < -Math.PI && ($ += 2 * Math.PI), v = u + (f - u) * n;
    const F = w + (b - w) * n, A = N + $ * n;
    E = F * Math.cos(A), T = F * Math.sin(A);
  }
  const [k, O, _] = Cy(v, E, T);
  return Vf(Ji(k), Ji(O), Ji(_));
}
c(Ly, "interpolateOklch");
const Wl = {
  hsl: Sy,
  rgb: Ty,
  oklch: Ly
};
function Fc(t = "hsl") {
  return Wl[t] ?? Wl.hsl;
}
c(Fc, "getInterpolator");
function nr() {
  return Object.keys(Wl);
}
c(nr, "listInterpolationModes");
function Iy(t) {
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
  if (t.mode && !nr().includes(t.mode))
    throw new Error(
      `light-color tween: unknown mode "${t.mode}". Available: ${nr().join(", ")}`
    );
}
c(Iy, "validate$7");
async function ky(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { Color: i } = foundry.utils, { uuid: r, toColor: a, toAlpha: o, mode: s = "oklch" } = t, l = Array.isArray(r) ? r : [r];
  if (l.length === 0)
    return console.warn("light-color tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: u = 2e3,
    easing: d = "easeInOutCosine",
    commit: m = !0,
    startEpochMS: f = null,
    signal: h = null
  } = e, p = ot(d), y = a != null, w = o != null, b = y ? Fc(s) : null, v = y ? i.fromString(a) : null;
  if (y && !v.valid) throw new Error(`light-color tween: invalid target color "${a}".`);
  async function E(k) {
    var j, H;
    if (h != null && h.aborted) return !1;
    const O = await fromUuid(k);
    if (!O) return !1;
    const _ = O.object;
    if (!_) return !1;
    let N;
    if (y) {
      const V = (j = O.config) == null ? void 0 : j.color;
      V != null && V.valid || console.warn(`light-color tween: source color invalid on ${k}, using white.`), N = V != null && V.valid ? V : i.fromString("#ffffff");
    }
    const D = w ? ((H = O._source.config) == null ? void 0 : H.alpha) ?? 0.5 : null, $ = { t: 0 }, F = `ambient-hue-tween:${k}`;
    n.terminateAnimation(F), h && h.addEventListener("abort", () => {
      n.terminateAnimation(F);
    }, { once: !0 });
    const A = typeof f == "number" ? Math.max(0, Math.min(u, Date.now() - f)) : 0, R = /* @__PURE__ */ c((V) => {
      const Y = {};
      y && (Y.color = b(N, v, V)), w && (Y.alpha = D + (o - D) * V), O.updateSource({ config: Y }), _.initializeLightSource();
    }, "applyFrame");
    A > 0 && ($.t = A / u, R($.t));
    const B = await n.animate(
      [{ parent: $, attribute: "t", to: 1 }],
      {
        name: F,
        duration: u,
        easing: p,
        time: A,
        ontick: /* @__PURE__ */ c(() => R($.t), "ontick")
      }
    );
    if (B !== !1) {
      if (h != null && h.aborted) return !1;
      const V = {};
      y && (V.color = v.toHTML()), w && (V.alpha = o), O.updateSource({ config: V }), _.initializeLightSource();
    }
    if (m && B !== !1 && O.canUserModify(game.user, "update")) {
      if (h != null && h.aborted) return !1;
      const V = {}, Y = {};
      y && (V.color = N.toHTML(), Y["config.color"] = v.toHTML()), w && (V.alpha = D, Y["config.alpha"] = o), O.updateSource({ config: V }), await O.update(Y);
    }
    return B !== !1;
  }
  return c(E, "animateOne"), (await Promise.all(l.map(E))).every(Boolean);
}
c(ky, "execute$7");
function Oy() {
  Bt({ type: "light-color", execute: ky, validate: Iy });
}
c(Oy, "registerLightColorTween");
const En = /* @__PURE__ */ new WeakMap();
function Ay(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("light-state tween: 'uuid' is required (string or array of AmbientLight document UUIDs).");
  if (typeof t.enabled != "boolean")
    throw new Error("light-state tween: 'enabled' (boolean) is required.");
}
c(Ay, "validate$6");
async function My(t, e = {}) {
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
    var O, _, N, D;
    if (d != null && d.aborted) return !1;
    const y = await fromUuid(p);
    if (!y) return !1;
    const w = y.object;
    if (!w) return !1;
    const b = `ambient-state-tween:${p}`;
    n.terminateAnimation(b), d && d.addEventListener("abort", () => {
      n.terminateAnimation(b);
    }, { once: !0 });
    const v = En.get(y) ?? {
      hidden: y._source.hidden,
      alpha: ((O = y._source.config) == null ? void 0 : O.alpha) ?? 0.5
    };
    if (En.set(y, v), x(`light-state START ${r ? "ON" : "OFF"} | snap: ${JSON.stringify(v)} | _source.hidden=${y._source.hidden}, _source.config.alpha=${(_ = y._source.config) == null ? void 0 : _.alpha}`), r && !v.hidden || !r && v.hidden)
      return En.delete(y), !0;
    const E = v.alpha, T = typeof u == "number" ? Math.max(0, Math.min(o, Date.now() - u)) : 0, k = /* @__PURE__ */ c(($) => {
      y.updateSource({ config: { alpha: $ } }), w.initializeLightSource();
    }, "applyAlpha");
    if (r) {
      y.updateSource({ hidden: !1, config: { alpha: 0 } }), w.initializeLightSource(), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
      const $ = { t: 0 };
      T > 0 && ($.t = T / o, k(E * $.t));
      const F = await n.animate(
        [{ parent: $, attribute: "t", to: 1 }],
        {
          name: b,
          duration: o,
          easing: m,
          time: T,
          ontick: /* @__PURE__ */ c(() => k(E * $.t), "ontick")
        }
      );
      return F !== !1 && !(d != null && d.aborted) && l && y.canUserModify(game.user, "update") ? (y.updateSource({ hidden: !0, config: { alpha: E } }), await y.update({ hidden: !1 }), x(`light-state FADE-IN committed. _source.hidden=${y._source.hidden}, _source.config.alpha=${(N = y._source.config) == null ? void 0 : N.alpha}`), En.delete(y)) : F === !1 || En.delete(y), F !== !1;
    } else {
      y.updateSource({ hidden: !1, config: { alpha: v.alpha } }), w.initializeLightSource();
      const $ = { t: 0 };
      T > 0 && ($.t = T / o, k(E * (1 - $.t)));
      const F = await n.animate(
        [{ parent: $, attribute: "t", to: 1 }],
        {
          name: b,
          duration: o,
          easing: m,
          time: T,
          ontick: /* @__PURE__ */ c(() => k(E * (1 - $.t)), "ontick")
        }
      );
      return F !== !1 && !(d != null && d.aborted) && l && y.canUserModify(game.user, "update") ? (await y.update({ hidden: !0 }), y.updateSource({ config: { alpha: E } }), w.initializeLightSource(), x(`light-state FADE-OUT committed+restored. _source.hidden=${y._source.hidden}, _source.config.alpha=${(D = y._source.config) == null ? void 0 : D.alpha}`), En.delete(y)) : F === !1 || (y.updateSource({ hidden: !0, config: { alpha: E } }), w.initializeLightSource(), En.delete(y)), F !== !1;
    }
  }
  return c(f, "animateOne"), (await Promise.all(a.map(f))).every(Boolean);
}
c(My, "execute$6");
function _y() {
  Bt({ type: "light-state", execute: My, validate: Ay });
}
c(_y, "registerLightStateTween");
function hs(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("tile-prop tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (!t.attribute || typeof t.attribute != "string")
    throw new Error("tile-prop tween: 'attribute' (string) is required — dot-path to a numeric property (e.g. 'alpha', 'rotation').");
  if (typeof t.value != "number")
    throw new Error("tile-prop tween: 'value' (number) is required — the target value to animate to.");
}
c(hs, "validate$5");
async function gs(t, e = {}) {
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
  async function h(y) {
    if (m != null && m.aborted) return !1;
    const w = await fromUuid(y);
    if (!w) return !1;
    const b = w.object;
    if (!b) return !1;
    const v = foundry.utils.getProperty(w._source, r);
    if (typeof v != "number")
      return console.warn(`tile-prop tween: source value at '${r}' on ${y} is not a number (got ${typeof v}). Skipping.`), !1;
    const E = `tile-prop-tween:${r}:${y}`;
    n.terminateAnimation(E), m && m.addEventListener("abort", () => {
      n.terminateAnimation(E);
    }, { once: !0 });
    const T = typeof d == "number" ? Math.max(0, Math.min(s, Date.now() - d)) : 0, k = /* @__PURE__ */ c((N) => {
      const D = v + (a - v) * N;
      w.updateSource(foundry.utils.expandObject({ [r]: D })), b.refresh();
    }, "applyFrame"), O = { t: 0 };
    T > 0 && (O.t = T / s, k(O.t));
    const _ = await n.animate(
      [{ parent: O, attribute: "t", to: 1 }],
      {
        name: E,
        duration: s,
        easing: f,
        time: T,
        ontick: /* @__PURE__ */ c(() => k(O.t), "ontick")
      }
    );
    if (_ !== !1) {
      if (m != null && m.aborted) return !1;
      w.updateSource(foundry.utils.expandObject({ [r]: a })), b.refresh();
    }
    if (u && _ !== !1 && w.canUserModify(game.user, "update")) {
      if (m != null && m.aborted) return !1;
      w.updateSource(foundry.utils.expandObject({ [r]: v })), await w.update({ [r]: a });
    }
    return _ !== !1;
  }
  return c(h, "animateOne"), (await Promise.all(o.map(h))).every(Boolean);
}
c(gs, "execute$5");
function xy() {
  Bt({ type: "tile-prop", execute: gs, validate: hs });
}
c(xy, "registerTilePropTween");
function $y(t) {
  if (!t.attribute || typeof t.attribute != "string")
    throw new Error("particles-prop tween: 'attribute' (string) is required — property name on canvas.particleeffects (e.g. 'alpha').");
  if (typeof t.value != "number")
    throw new Error("particles-prop tween: 'value' (number) is required — the target value to animate to.");
}
c($y, "validate$4");
async function Ny(t, e = {}) {
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
  const h = typeof s == "number" ? Math.max(0, Math.min(a, Date.now() - s)) : 0, p = /* @__PURE__ */ c((b) => {
    u[i] = d + (r - d) * b;
  }, "applyFrame"), y = { t: 0 };
  h > 0 && (y.t = h / a, p(y.t));
  const w = await n.animate(
    [{ parent: y, attribute: "t", to: 1 }],
    {
      name: f,
      duration: a,
      easing: m,
      time: h,
      ontick: /* @__PURE__ */ c(() => p(y.t), "ontick")
    }
  );
  if (w !== !1) {
    if (l != null && l.aborted) return !1;
    u[i] = r;
  }
  return w !== !1;
}
c(Ny, "execute$4");
function Fy() {
  Bt({ type: "particles-prop", execute: Ny, validate: $y });
}
c(Fy, "registerParticlesPropTween");
var On, Kr, Jr, Xr, Qr, Zr, Qi;
const Jc = class Jc {
  /**
   * @param {AbortController} controller
   */
  constructor(e) {
    M(this, On);
    M(this, Kr);
    M(this, Jr);
    M(this, Xr);
    M(this, Qr);
    M(this, Zr, !1);
    M(this, Qi, null);
    I(this, On, e), I(this, Xr, new Promise((n) => {
      I(this, Kr, n);
    })), I(this, Qr, new Promise((n) => {
      I(this, Jr, n);
    }));
  }
  /** @returns {Promise<boolean>} Resolves true (completed) or false (cancelled/failed). */
  get finished() {
    return g(this, Xr);
  }
  /** @returns {Promise<{status: string, [k: string]: unknown}>} */
  get result() {
    return g(this, Qr);
  }
  /** @returns {boolean} */
  get cancelled() {
    return g(this, On).signal.aborted;
  }
  /** @returns {AbortSignal} */
  get signal() {
    return g(this, On).signal;
  }
  /** @returns {string} */
  get status() {
    return g(this, Qi) ? g(this, Qi).status : this.cancelled ? "cancelled" : "running";
  }
  /** Abort the timeline, triggering onCancel callbacks. */
  cancel(e = "cancelled") {
    g(this, On).signal.aborted || g(this, On).abort(e);
  }
  /**
   * Called internally by the execution engine when the timeline finishes.
   * @param {boolean} completed - true if all steps ran, false if cancelled
   */
  _resolve(e) {
    if (g(this, Zr)) return;
    I(this, Zr, !0);
    const n = typeof e == "boolean" ? { status: e ? "completed" : "cancelled" } : e ?? { status: "cancelled" };
    I(this, Qi, n), g(this, Kr).call(this, n.status === "completed"), g(this, Jr).call(this, n);
  }
};
On = new WeakMap(), Kr = new WeakMap(), Jr = new WeakMap(), Xr = new WeakMap(), Qr = new WeakMap(), Zr = new WeakMap(), Qi = new WeakMap(), c(Jc, "TimelineHandle");
let Gl = Jc;
var yi, Zi, bi;
const Xc = class Xc {
  constructor() {
    /** @type {Map<string, Set<Function>>} */
    M(this, yi, /* @__PURE__ */ new Map());
    /** @type {Set<string>} Signals that have been emitted (sticky) */
    M(this, Zi, /* @__PURE__ */ new Set());
    M(this, bi, !1);
  }
  /**
   * Subscribe to a named signal.
   * @param {string} signal
   * @param {Function} listener
   * @returns {() => void} Unsubscribe function
   */
  on(e, n) {
    if (g(this, bi)) return () => {
    };
    let i = g(this, yi).get(e);
    return i || (i = /* @__PURE__ */ new Set(), g(this, yi).set(e, i)), i.add(n), () => i.delete(n);
  }
  /**
   * Fire a named signal synchronously. All registered listeners are invoked.
   * The signal is recorded so that future waitFor() calls resolve immediately.
   * @param {string} signal
   */
  emit(e) {
    if (g(this, bi)) return;
    g(this, Zi).add(e);
    const n = g(this, yi).get(e);
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
    return g(this, bi) ? Promise.reject(new Error("EventBus destroyed")) : g(this, Zi).has(e) ? Promise.resolve() : new Promise((i, r) => {
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
    I(this, bi, !0), g(this, yi).clear(), g(this, Zi).clear();
  }
};
yi = new WeakMap(), Zi = new WeakMap(), bi = new WeakMap(), c(Xc, "EventBus");
let zl = Xc;
const Wf = /* @__PURE__ */ new Map();
function ps(t, e) {
  Wf.set(t, e);
}
c(ps, "registerAwaitProvider");
function Yl(t, e) {
  const n = Wf.get(t.event);
  return n ? n(t, e) : Promise.reject(new Error(`Unknown await event type: "${t.event}"`));
}
c(Yl, "createAwaitPromise");
ps("signal", (t, e) => t.name ? e.eventBus.waitFor(t.name, e.signal) : Promise.reject(new Error('await signal: "name" is required')));
ps("click", (t, e) => new Promise((n, i) => {
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
ps("keypress", (t, e) => new Promise((n, i) => {
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
const Bi = /* @__PURE__ */ new Map();
function Dy(t, e) {
  const n = Bi.get(t);
  n && !n.cancelled && n.cancel("replaced-by-name"), Bi.set(t, e), e.finished.then(() => {
    Bi.get(t) === e && Bi.delete(t);
  });
}
c(Dy, "registerTimeline");
function Gf(t) {
  const e = Bi.get(t);
  return e && !e.cancelled ? (e.cancel("cancelled-by-name"), !0) : !1;
}
c(Gf, "cancelTimeline");
function Py(t) {
  return Bi.get(t);
}
c(Py, "getTimeline");
function xu(t, e) {
  return t <= 0 ? Promise.resolve() : new Promise((n, i) => {
    if (e.aborted) return i(e.reason);
    const r = setTimeout(n, t);
    e.addEventListener("abort", () => {
      clearTimeout(r), i(e.reason);
    }, { once: !0 });
  });
}
c(xu, "cancellableDelay");
var Ue, An, ea, ta;
const Qc = class Qc {
  constructor(e) {
    /** @type {TweenTimeline} */
    M(this, Ue);
    /** @type {Array<{ type: string, params: object, opts?: object, detach: boolean }>} */
    M(this, An, []);
    /** @type {Function|null} */
    M(this, ea, null);
    /** @type {Function|null} */
    M(this, ta, null);
    I(this, Ue, e);
  }
  /**
   * Add a tween entry to this step.
   * @param {string} type  Registered tween type name
   * @param {object} params  Type-specific parameters
   * @param {object} [opts]  Options (durationMS, easing, etc.)
   * @returns {StepBuilder} this
   */
  add(e, n, i) {
    return g(this, An).push({ type: e, params: n, opts: i ?? {}, detach: !1 }), this;
  }
  /**
   * Mark the last entry as fire-and-forget (does not block step progression).
   * @returns {StepBuilder} this
   */
  detach() {
    if (g(this, An).length === 0)
      throw new Error("StepBuilder.detach(): no entry to detach.");
    return g(this, An)[g(this, An).length - 1].detach = !0, this;
  }
  /**
   * Callback invoked before this step's tweens start.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  before(e) {
    return I(this, ea, e), this;
  }
  /**
   * Callback invoked after this step's awaited tweens complete.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  after(e) {
    return I(this, ta, e), this;
  }
  // ── Delegation to parent TweenTimeline for fluent chaining ──
  /** Start a new step (finalizes this one). */
  step() {
    return g(this, Ue).step();
  }
  /** Insert a delay between steps. */
  delay(e) {
    return g(this, Ue).delay(e);
  }
  /** Insert an await segment. */
  await(e) {
    return g(this, Ue).await(e);
  }
  /** Insert an emit segment. */
  emit(e) {
    return g(this, Ue).emit(e);
  }
  /** Insert a parallel segment. */
  parallel(e, n) {
    return g(this, Ue).parallel(e, n);
  }
  /** Register onComplete callback. */
  onComplete(e) {
    return g(this, Ue).onComplete(e);
  }
  /** Register onCancel callback. */
  onCancel(e) {
    return g(this, Ue).onCancel(e);
  }
  /** Register onError callback. */
  onError(e) {
    return g(this, Ue).onError(e);
  }
  /** Execute the timeline. */
  run(e) {
    return g(this, Ue).run(e);
  }
  /** Serialize the timeline. */
  toJSON() {
    return g(this, Ue).toJSON();
  }
  // ── Internal access ──
  /** @returns {{ entries: Array, before: Function|null, after: Function|null }} */
  _finalize() {
    return {
      entries: g(this, An),
      before: g(this, ea),
      after: g(this, ta)
    };
  }
};
Ue = new WeakMap(), An = new WeakMap(), ea = new WeakMap(), ta = new WeakMap(), c(Qc, "StepBuilder");
let Kl = Qc;
var Ve, _e, At, Mn, na, ia, ra, aa, zn, Jl, J, rn, Xl, zf, Ql, Yf, Kf, Ha, ft, Vt;
const sn = class sn {
  constructor() {
    M(this, J);
    /** @type {string|null} */
    M(this, Ve, null);
    /** @type {string} */
    M(this, _e, Oe.ABORT);
    /** @type {Array<object>} */
    M(this, At, []);
    /** @type {StepBuilder|null} */
    M(this, Mn, null);
    /** @type {Function|null} */
    M(this, na, null);
    /** @type {Function|null} */
    M(this, ia, null);
    /** @type {Function|null} */
    M(this, ra, null);
    /** @type {Function|null} */
    M(this, aa, null);
  }
  /**
   * Register this timeline in the named registry. Starting a new
   * timeline with the same name cancels the previous one.
   * @param {string} name
   * @returns {TweenTimeline} this
   */
  name(e) {
    return I(this, Ve, e), this;
  }
  /**
   * Set the error policy for step execution.
   * @param {"abort"|"continue"} policy
   * @returns {TweenTimeline} this
   */
  errorPolicy(e) {
    if (e !== Oe.ABORT && e !== Oe.CONTINUE)
      throw new Error(`Invalid error policy: "${e}". Use "abort" or "continue".`);
    return I(this, _e, e), this;
  }
  /**
   * Start a new step. Finalizes the previous step if one is open.
   * @returns {StepBuilder}
   */
  step() {
    return S(this, J, rn).call(this), I(this, Mn, new Kl(this)), g(this, Mn);
  }
  /**
   * Insert a delay (in ms) between the previous step and the next.
   * @param {number} ms
   * @returns {TweenTimeline} this
   */
  delay(e) {
    return S(this, J, rn).call(this), g(this, At).push({ kind: "delay", ms: e }), this;
  }
  /**
   * Pause execution until an event occurs.
   * @param {object} config  e.g. { event: "click" }, { event: "signal", name: "fog-done" }
   * @returns {TweenTimeline} this
   */
  await(e) {
    return S(this, J, rn).call(this), g(this, At).push({ kind: "await", config: e }), this;
  }
  /**
   * Fire a named signal (instant, non-blocking).
   * @param {string} signal  Signal name
   * @returns {TweenTimeline} this
   */
  emit(e) {
    return S(this, J, rn).call(this), g(this, At).push({ kind: "emit", signal: e }), this;
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
    S(this, J, rn).call(this);
    const i = n.join ?? "all", r = n.overflow ?? "detach";
    if (i !== "all" && i !== "any" && (typeof i != "number" || i < 1 || i > e.length))
      throw new Error(`parallel: join must be "all", "any", or 1..${e.length}, got ${JSON.stringify(i)}`);
    if (r !== "detach" && r !== "cancel")
      throw new Error(`parallel: overflow must be "detach" or "cancel", got ${JSON.stringify(r)}`);
    const a = e.map((o) => {
      var l;
      const s = new sn();
      return o(s), S(l = s, J, rn).call(l), g(s, At);
    });
    return g(this, At).push({ kind: "parallel", branches: a, join: i, overflow: r }), this;
  }
  /**
   * Callback invoked before the first step runs.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  beforeAll(e) {
    return I(this, na, e), this;
  }
  /**
   * Callback invoked on successful completion.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onComplete(e) {
    return I(this, ia, e), this;
  }
  /**
   * Callback invoked on cancellation (mutually exclusive with onComplete).
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onCancel(e) {
    return I(this, ra, e), this;
  }
  /**
   * Callback invoked on runtime failure (mutually exclusive with onComplete/onCancel).
   * @param {(outcome: object) => void} fn
   * @returns {TweenTimeline} this
   */
  onError(e) {
    return I(this, aa, e), this;
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
    S(this, J, rn).call(this);
    const n = new AbortController();
    e.signal && (e.signal.aborted ? n.abort(e.signal.reason ?? "parent-aborted") : e.signal.addEventListener("abort", () => {
      n.signal.aborted || n.abort(e.signal.reason ?? "parent-aborted");
    }, { once: !0 }));
    const i = new Gl(n);
    g(this, Ve) && Dy(g(this, Ve), i);
    const r = e.broadcast ?? game.user.isGM, a = e.commit ?? game.user.isGM, o = e.startEpochMS ?? Date.now();
    r && g(this, Ve) && Ra(Uf, {
      name: g(this, Ve),
      data: this.toJSON(),
      startEpochMS: o
    });
    const s = new zl(), l = {
      signal: i.signal,
      commit: a,
      startEpochMS: o,
      eventBus: s,
      errors: [],
      detachedPromises: []
    };
    return S(this, J, zf).call(this, i, l).then((u) => {
      var d, m, f;
      s.destroy(), i._resolve(u), u.status === wn.COMPLETED ? (d = g(this, ia)) == null || d.call(this) : u.status === wn.CANCELLED ? ((m = g(this, ra)) == null || m.call(this), r && g(this, Ve) && Ra(Ul, {
        name: g(this, Ve),
        reason: u.reason
      })) : ((f = g(this, aa)) == null || f.call(this, u), r && g(this, Ve) && Ra(Ul, {
        name: g(this, Ve),
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
    S(this, J, rn).call(this);
    const n = { timeline: S(i = sn, zn, Jl).call(i, g(this, At)) };
    return g(this, Ve) && (n.name = g(this, Ve)), g(this, _e) !== Oe.ABORT && (n.errorPolicy = g(this, _e)), n;
  }
};
Ve = new WeakMap(), _e = new WeakMap(), At = new WeakMap(), Mn = new WeakMap(), na = new WeakMap(), ia = new WeakMap(), ra = new WeakMap(), aa = new WeakMap(), zn = new WeakSet(), Jl = /* @__PURE__ */ c(function(e) {
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
            return S(a = sn, zn, Jl).call(a, r);
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
}, "#serializeSegments"), J = new WeakSet(), // ── Private ─────────────────────────────────────────────────────────
rn = /* @__PURE__ */ c(function() {
  g(this, Mn) && (g(this, At).push({ kind: "step", data: g(this, Mn)._finalize() }), I(this, Mn, null));
}, "#finalizeCurrentStep"), Xl = /* @__PURE__ */ c(function(e) {
  e.length !== 0 && Promise.allSettled(e).catch(() => {
  });
}, "#drainDetached"), zf = /* @__PURE__ */ c(async function(e, n) {
  var i, r;
  try {
    if (n.signal.aborted) return S(this, J, ft).call(this, n.signal.reason);
    const a = await S(this, J, Ha).call(this, g(this, na), Ct.BEFORE_ALL, null);
    if (a) {
      if (g(this, _e) === Oe.ABORT) return a;
      n.errors.push(a);
    }
    const o = await S(this, J, Ql).call(this, g(this, At), n);
    if (o)
      return S(i = sn, zn, Xl).call(i, n.detachedPromises), o;
    if (!n.signal.aborted) {
      const s = await Promise.allSettled(n.detachedPromises);
      for (const l of s)
        if (l.status === "rejected") {
          const u = S(this, J, Vt).call(this, l.reason, Ct.ENTRY);
          if (g(this, _e) === Oe.ABORT) return u;
          n.errors.push(u);
        }
    }
    return n.signal.aborted ? S(this, J, ft).call(this, n.signal.reason) : {
      status: wn.COMPLETED,
      ...n.errors.length > 0 ? { errors: n.errors } : {}
    };
  } catch (a) {
    return S(r = sn, zn, Xl).call(r, n.detachedPromises), n.signal.aborted ? S(this, J, ft).call(this, n.signal.reason) : (console.error("TweenTimeline execution error:", a), S(this, J, Vt).call(this, a, Ct.RUNTIME));
  }
}, "#execute"), Ql = /* @__PURE__ */ c(async function(e, n) {
  let i = -1, r = 0;
  for (const a of e) {
    if (n.signal.aborted) return S(this, J, ft).call(this, n.signal.reason);
    if (a.kind === "delay") {
      try {
        await xu(a.ms, n.signal);
      } catch {
        return S(this, J, ft).call(this, n.signal.reason);
      }
      r += a.ms;
      continue;
    }
    if (a.kind === "await") {
      try {
        let p = Yl(a.config, {
          signal: n.signal,
          eventBus: n.eventBus
        });
        const y = a.config.timeout;
        typeof y == "number" && y > 0 && (p = Promise.race([
          p,
          xu(y, n.signal)
        ])), await p;
      } catch (p) {
        if (n.signal.aborted) return S(this, J, ft).call(this, n.signal.reason);
        const y = S(this, J, Vt).call(this, p, Ct.AWAIT);
        if (g(this, _e) === Oe.ABORT) return y;
        n.errors.push(y);
      }
      continue;
    }
    if (a.kind === "emit") {
      try {
        n.eventBus.emit(a.signal);
      } catch (p) {
        const y = S(this, J, Vt).call(this, p, Ct.EMIT);
        if (g(this, _e) === Oe.ABORT) return y;
        n.errors.push(y);
      }
      continue;
    }
    if (a.kind === "parallel") {
      const p = await S(this, J, Yf).call(this, a, n, r);
      if (p) return p;
      continue;
    }
    i += 1;
    const { entries: o, before: s, after: l } = a.data, u = await S(this, J, Ha).call(this, s, Ct.BEFORE_STEP, i);
    if (u) {
      if (g(this, _e) === Oe.ABORT) return u;
      n.errors.push(u);
      continue;
    }
    if (n.signal.aborted) return S(this, J, ft).call(this, n.signal.reason);
    const d = [];
    let m = 0;
    for (const p of o) {
      const y = sr(p.type);
      if (!y) {
        const E = S(this, J, Vt).call(this, new Error(`TweenTimeline: unknown tween type "${p.type}"`), Ct.ENTRY, i, p.type);
        if (g(this, _e) === Oe.ABORT) return E;
        n.errors.push(E), console.warn(E.error.message);
        continue;
      }
      const w = {
        ...p.opts,
        commit: n.commit,
        startEpochMS: n.startEpochMS + r,
        signal: n.signal
      }, b = w.durationMS ?? 2e3, v = Promise.resolve().then(() => y.execute(p.params, w)).then((E) => E === !1 ? {
        ok: !1,
        failure: S(this, J, Vt).call(this, new Error("Tween entry returned false."), Ct.ENTRY, i, p.type)
      } : { ok: !0 }).catch((E) => ({
        ok: !1,
        failure: S(this, J, Vt).call(this, E, Ct.ENTRY, i, p.type)
      }));
      p.detach ? n.detachedPromises.push(v) : (d.push(v), m = Math.max(m, b));
    }
    const f = await S(this, J, Kf).call(this, d, n.signal);
    if (f === null) return S(this, J, ft).call(this, n.signal.reason);
    for (const p of f)
      if (!p.ok) {
        if (g(this, _e) === Oe.ABORT) return p.failure;
        n.errors.push(p.failure), console.warn("TweenTimeline: entry failed:", p.failure.error);
      }
    const h = await S(this, J, Ha).call(this, l, Ct.AFTER_STEP, i);
    if (h) {
      if (g(this, _e) === Oe.ABORT) return h;
      n.errors.push(h);
    }
    if (n.signal.aborted) return S(this, J, ft).call(this, n.signal.reason);
    r += m;
  }
  return null;
}, "#executeSegments"), Yf = /* @__PURE__ */ c(async function(e, n, i = 0) {
  const { branches: r, join: a, overflow: o } = e, s = r.length, l = a === "all" ? s : a === "any" ? 1 : a, u = r.map(() => {
    const p = new AbortController();
    return n.signal.aborted ? p.abort(n.signal.reason ?? "parent-aborted") : n.signal.addEventListener("abort", () => {
      p.signal.aborted || p.abort(n.signal.reason ?? "parent-aborted");
    }, { once: !0 }), p;
  });
  let d = 0, m = 0;
  const f = new Array(s).fill(null);
  let h;
  return new Promise((p) => {
    let y = !1;
    const w = /* @__PURE__ */ c(() => {
      if (y) return;
      if (d >= l) {
        y = !0, b(), p(null);
        return;
      }
      const v = s - d - m;
      if (d + v < l) {
        y = !0, b();
        const E = f.filter((k) => k && k.status === wn.FAILED).map((k) => k), T = S(this, J, Vt).call(this, new Error(`parallel: join target ${l} impossible (${d} completed, ${m} failed)`), Ct.PARALLEL);
        g(this, _e) === Oe.ABORT ? p(T) : (n.errors.push(T), n.errors.push(...E), p(null));
      }
    }, "checkJoin"), b = /* @__PURE__ */ c(() => {
      if (o === "cancel")
        for (let v = 0; v < s; v++)
          !f[v] && !u[v].signal.aborted && u[v].abort("overflow-cancel");
      for (let v = 0; v < s; v++)
        f[v] || n.detachedPromises.push(h[v]);
    }, "applyOverflow");
    if (h = r.map((v, E) => {
      const T = {
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
      return S(this, J, Ql).call(this, v, T).then((k) => {
        if (k)
          if (k.status === wn.CANCELLED) {
            if (u[E].signal.aborted) {
              f[E] = k;
              return;
            }
            f[E] = k, m++;
          } else
            f[E] = k, m++;
        else
          f[E] = { status: wn.COMPLETED }, d++;
        w();
      });
    }), n.signal.aborted) {
      y = !0, p(S(this, J, ft).call(this, n.signal.reason));
      return;
    }
    n.signal.addEventListener("abort", () => {
      y || (y = !0, p(S(this, J, ft).call(this, n.signal.reason)));
    }, { once: !0 });
  });
}, "#executeParallel"), /**
 * @param {Array<Promise<{ok: boolean, failure?: object}>>} stepPromises
 * @param {AbortSignal} signal
 * @returns {Promise<Array<{ok: boolean, failure?: object}>|null>}
 */
Kf = /* @__PURE__ */ c(function(e, n) {
  return e.length === 0 ? Promise.resolve([]) : n.aborted ? Promise.resolve(null) : new Promise((i, r) => {
    const a = /* @__PURE__ */ c(() => i(null), "onAbort");
    n.addEventListener("abort", a, { once: !0 }), Promise.all(e).then((o) => {
      n.removeEventListener("abort", a), i(o);
    }).catch((o) => {
      n.removeEventListener("abort", a), r(o);
    });
  });
}, "#waitForStep"), Ha = /* @__PURE__ */ c(async function(e, n, i) {
  if (!e) return null;
  try {
    return await e(), null;
  } catch (r) {
    const a = S(this, J, Vt).call(this, r, n, i ?? void 0);
    return g(this, _e) === Oe.CONTINUE && console.warn(`TweenTimeline: hook failure in ${n}:`, r), a;
  }
}, "#runHook"), /** @param {unknown} reason */
ft = /* @__PURE__ */ c(function(e) {
  let n;
  return typeof e == "string" ? n = e : e instanceof Error && (n = e.message), {
    status: wn.CANCELLED,
    ...n ? { reason: n } : {}
  };
}, "#cancelledOutcome"), /**
 * @param {unknown} err
 * @param {string} phase
 * @param {number} [stepIndex]
 * @param {string} [entryType]
 */
Vt = /* @__PURE__ */ c(function(e, n, i, r) {
  const a = e instanceof Error ? e : new Error(String(e));
  return {
    status: wn.FAILED,
    error: a,
    phase: n,
    ...typeof i == "number" ? { stepIndex: i } : {},
    ...r ? { entryType: r } : {}
  };
}, "#failedOutcome"), M(sn, zn), c(sn, "TweenTimeline");
let co = sn;
function Dc(t) {
  if (!t || typeof t != "object")
    throw new Error("Sequence JSON: data must be an object.");
  if (!Array.isArray(t.timeline))
    throw new Error("Sequence JSON: 'timeline' must be an array.");
  if (t.name != null && typeof t.name != "string")
    throw new Error("Sequence JSON: 'name' must be a string.");
  if (t.errorPolicy != null && t.errorPolicy !== Oe.ABORT && t.errorPolicy !== Oe.CONTINUE)
    throw new Error(`Sequence JSON: 'errorPolicy' must be "abort" or "continue".`);
  Jf(t.timeline, "timeline", 0);
}
c(Dc, "validateSequenceJSON");
function Jf(t, e, n = 0) {
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
        Jf(d, `${a}.parallel.branches[${u}]`, n + 1);
      }
      continue;
    }
    throw new Error(`Sequence JSON: ${a} is not a recognized segment (step array, delay, await, emit, or parallel).`);
  }
}
c(Jf, "validateSegmentsJSON");
function Xf(t) {
  Dc(t), Qf(t.timeline, "timeline");
}
c(Xf, "validateSequenceSemantics");
function Qf(t, e) {
  for (let n = 0; n < t.length; n++) {
    const i = t[n], r = `${e}[${n}]`;
    if (Array.isArray(i))
      for (let a = 0; a < i.length; a++) {
        const o = i[a];
        try {
          Ey(o.type, o.params ?? {});
        } catch (s) {
          throw new Error(`Sequence JSON: ${r}[${a}] failed semantic validation: ${s.message}`);
        }
      }
    else if (i.parallel)
      for (let a = 0; a < i.parallel.branches.length; a++)
        Qf(i.parallel.branches[a], `${r}.parallel.branches[${a}]`);
  }
}
c(Qf, "validateSegmentsSemantics");
function Pc(t, e = {}) {
  Dc(t), e.validateSemantics && Xf(t);
  const n = new co();
  return t.name && n.name(t.name), t.errorPolicy && n.errorPolicy(t.errorPolicy), Zf(t.timeline, n), n;
}
c(Pc, "compileSequence");
function Zf(t, e) {
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
      const i = n.parallel, r = i.branches.map((a) => (o) => Zf(a, o));
      e.parallel(r, {
        join: i.join ?? "all",
        overflow: i.overflow ?? "detach"
      });
    }
  }
}
c(Zf, "compileSegments");
function Ry(t) {
  Dc(t), Xf(t);
}
c(Ry, "validate$3");
async function Hy(t, e = {}) {
  return Pc(t, { validateSemantics: !0 }).run({
    broadcast: !1,
    commit: e.commit,
    startEpochMS: e.startEpochMS,
    signal: e.signal
  }).finished;
}
c(Hy, "execute$3");
function qy() {
  Bt({ type: "sequence", execute: Hy, validate: Ry });
}
c(qy, "registerSequenceTween");
function By(t) {
  if (t.x == null && t.y == null && t.scale == null)
    throw new Error("camera-pan tween: at least one of 'x', 'y', or 'scale' is required.");
  if (t.x != null && typeof t.x != "number")
    throw new Error("camera-pan tween: 'x' must be a number.");
  if (t.y != null && typeof t.y != "number")
    throw new Error("camera-pan tween: 'y' must be a number.");
  if (t.scale != null && (typeof t.scale != "number" || t.scale <= 0))
    throw new Error("camera-pan tween: 'scale' must be a positive number.");
}
c(By, "validate$2");
async function jy(t, e = {}) {
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
c(jy, "execute$2");
function Uy() {
  Bt({ type: "camera-pan", execute: jy, validate: By });
}
c(Uy, "registerCameraPanTween");
function Vy(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((i) => !i || typeof i != "string"))
    throw new Error("tile-tint tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (t.toColor == null || typeof t.toColor != "string")
    throw new Error("tile-tint tween: 'toColor' (CSS color string) is required.");
  if (!foundry.utils.Color.fromString(t.toColor).valid)
    throw new Error(`tile-tint tween: invalid target color "${t.toColor}".`);
  if (t.mode && !nr().includes(t.mode))
    throw new Error(
      `tile-tint tween: unknown mode "${t.mode}". Available: ${nr().join(", ")}`
    );
}
c(Vy, "validate$1");
async function Wy(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { Color: i } = foundry.utils, { uuid: r, toColor: a, mode: o = "oklch" } = t, s = Array.isArray(r) ? r : [r];
  if (s.length === 0)
    return console.warn("tile-tint tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: l = 2e3,
    easing: u = "easeInOutCosine",
    commit: d = !0,
    startEpochMS: m = null,
    signal: f = null
  } = e, h = ot(u), p = Fc(o), y = i.fromString(a);
  if (!y.valid) throw new Error(`tile-tint tween: invalid target color "${a}".`);
  async function w(v) {
    var R, B;
    if (f != null && f.aborted) return !1;
    const E = await fromUuid(v);
    if (!E) return !1;
    const T = E.object;
    if (!T) return !1;
    const k = ((B = (R = E._source) == null ? void 0 : R.texture) == null ? void 0 : B.tint) ?? "#ffffff", O = i.fromString(k);
    O.valid || console.warn(`tile-tint tween: source tint invalid on ${v}, using white.`);
    const _ = O.valid ? O : i.fromString("#ffffff"), N = { t: 0 }, D = `tile-tint-tween:${v}`;
    n.terminateAnimation(D), f && f.addEventListener("abort", () => {
      n.terminateAnimation(D);
    }, { once: !0 });
    const $ = typeof m == "number" ? Math.max(0, Math.min(l, Date.now() - m)) : 0, F = /* @__PURE__ */ c((j) => {
      const H = p(_, y, j);
      E.updateSource({ texture: { tint: H } }), T.refresh();
    }, "applyFrame");
    $ > 0 && (N.t = $ / l, F(N.t));
    const A = await n.animate(
      [{ parent: N, attribute: "t", to: 1 }],
      {
        name: D,
        duration: l,
        easing: h,
        time: $,
        ontick: /* @__PURE__ */ c(() => F(N.t), "ontick")
      }
    );
    if (A !== !1) {
      if (f != null && f.aborted) return !1;
      E.updateSource({ texture: { tint: y.toHTML() } }), T.refresh();
    }
    if (d && A !== !1 && E.canUserModify(game.user, "update")) {
      if (f != null && f.aborted) return !1;
      E.updateSource({ texture: { tint: _.toHTML() } }), await E.update({ "texture.tint": y.toHTML() });
    }
    return A !== !1;
  }
  return c(w, "animateOne"), (await Promise.all(s.map(w))).every(Boolean);
}
c(Wy, "execute$1");
function Gy() {
  Bt({ type: "tile-tint", execute: Wy, validate: Vy });
}
c(Gy, "registerTileTintTween");
function zy(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("tile-scale tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (typeof t.toScale != "number" || t.toScale <= 0)
    throw new Error("tile-scale tween: 'toScale' must be a positive number.");
  for (const n of ["baseWidth", "baseHeight", "centerX", "centerY"])
    if (typeof t[n] != "number")
      throw new Error(`tile-scale tween: '${n}' (number) is required.`);
}
c(zy, "validate");
async function Yy(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, toScale: r, baseWidth: a, baseHeight: o, centerX: s, centerY: l } = t, u = Array.isArray(i) ? i : [i];
  if (u.length === 0) return !0;
  const {
    durationMS: d = 2e3,
    easing: m = "easeInOutCosine",
    commit: f = !0,
    startEpochMS: h = null,
    signal: p = null
  } = e, y = ot(m), w = a * r, b = o * r, v = s - w / 2, E = l - b / 2;
  async function T(O) {
    if (p != null && p.aborted) return !1;
    const _ = await fromUuid(O);
    if (!_) return !1;
    const N = _.object;
    if (!N) return !1;
    const D = _._source.width, $ = _._source.height, F = _._source.x, A = _._source.y, R = `tile-scale-tween:${O}`;
    n.terminateAnimation(R), p && p.addEventListener("abort", () => {
      n.terminateAnimation(R);
    }, { once: !0 });
    const B = typeof h == "number" ? Math.max(0, Math.min(d, Date.now() - h)) : 0, j = /* @__PURE__ */ c((Y) => {
      const ae = D + (w - D) * Y, X = $ + (b - $) * Y, te = F + (v - F) * Y, Zt = A + (E - A) * Y;
      _.updateSource({ width: ae, height: X, x: te, y: Zt }), N.refresh();
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
      if (p != null && p.aborted) return !1;
      _.updateSource({ width: w, height: b, x: v, y: E }), N.refresh();
    }
    if (f && V !== !1 && _.canUserModify(game.user, "update")) {
      if (p != null && p.aborted) return !1;
      _.updateSource({ width: D, height: $, x: F, y: A }), await _.update({ width: w, height: b, x: v, y: E });
    }
    return V !== !1;
  }
  return c(T, "animateOne"), (await Promise.all(u.map(T))).every(Boolean);
}
c(Yy, "execute");
function Ky() {
  Bt({ type: "tile-scale", execute: Yy, validate: zy });
}
c(Ky, "registerTileScaleTween");
async function Jy(t, e, n = {}) {
  if (!game.user.isGM)
    return ui.notifications.warn("Only the GM can dispatch tweens."), !1;
  const i = sr(t);
  if (!i)
    throw new Error(`Unknown tween type: "${t}". Registered types: ${Vl().join(", ")}`);
  i.validate(e);
  const { durationMS: r = 2e3, easing: a = "easeInOutCosine", commit: o = !0 } = n, s = Date.now();
  return Ra(jf, {
    type: t,
    params: e,
    durationMS: r,
    easing: a,
    startEpochMS: s,
    commit: !1
  }), i.execute(e, { durationMS: r, easing: a, commit: o, startEpochMS: s });
}
c(Jy, "dispatchTween");
function Xy(t) {
  const { type: e, params: n, durationMS: i, easing: r, startEpochMS: a, commit: o } = t ?? {}, s = sr(e);
  if (!s) {
    console.warn(`[${L}] Received unknown tween type over socket: "${e}"`);
    return;
  }
  s.execute(n, {
    durationMS: i,
    easing: r,
    commit: o ?? !1,
    startEpochMS: a
  });
}
c(Xy, "handleTweenSocketMessage");
Oy();
_y();
xy();
Fy();
qy();
Uy();
Gy();
Ky();
Bt({ type: "token-prop", execute: gs, validate: hs });
Bt({ type: "drawing-prop", execute: gs, validate: hs });
Bt({ type: "sound-prop", execute: gs, validate: hs });
$c(jf, Xy);
$c(Uf, Qy);
$c(Ul, Zy);
function Qy(t) {
  const { data: e, startEpochMS: n } = t ?? {};
  if (!e) {
    console.warn(`[${L}] Received empty tween-sequence socket message.`);
    return;
  }
  try {
    Pc(e, { validateSemantics: !0 }).run({ commit: !1, startEpochMS: n, broadcast: !1 });
  } catch (i) {
    console.error(`[${L}] Failed to run received tween sequence:`, i);
  }
}
c(Qy, "handleSequenceSocketMessage");
function Zy(t) {
  const { name: e } = t ?? {};
  e && Gf(e);
}
c(Zy, "handleSequenceCancelMessage");
function eb() {
  Hooks.once("ready", () => {
    wy();
    const t = game.modules.get(L);
    t.api || (t.api = {}), t.api.tween = {
      dispatch: Jy,
      types: Vl,
      Timeline: co,
      ErrorPolicy: Oe,
      compileSequence: Pc,
      cancelTimeline: Gf,
      getTimeline: Py
    }, console.log(`[${L}] Tween API registered. Types: ${Vl().join(", ")}`);
  });
}
c(eb, "registerTweenHooks");
eb();
const tb = ["tag", "tag-all", "id", "tags-any", "tags-all"], nb = /* @__PURE__ */ new Set(["tags-any", "tags-all"]);
function Rc(t) {
  if (!t || typeof t != "string")
    return { type: "unknown", value: t ?? "" };
  if (t.startsWith("$"))
    return { type: "special", value: t };
  for (const e of tb)
    if (t.startsWith(`${e}:`)) {
      const n = t.slice(e.length + 1), i = nb.has(e) ? n.split(",").map((r) => r.trim()) : n;
      return { type: e, value: i };
    }
  return t.includes(".") ? { type: "uuid", value: t } : { type: "unknown", value: t };
}
c(Rc, "parseSelector");
function ib(t) {
  if (!t) return "";
  const { type: e, value: n } = t;
  if (e === "special" || e === "uuid" || e === "unknown")
    return Array.isArray(n) ? n.join(",") : n ?? "";
  const i = Array.isArray(n) ? n.join(",") : n ?? "";
  return `${e}:${i}`;
}
c(ib, "buildSelector");
function em(t, e = "first") {
  return t != null && t.length ? t.length === 1 ? e === "first-all" || e === "all" ? `tag-all:${t[0]}` : `tag:${t[0]}` : e === "any" ? `tags-any:${t.join(",")}` : e === "all" ? `tags-all:${t.join(",")}` : e === "first-all" ? `tags-all:${t.join(",")}` : `tags-any:${t.join(",")}` : "";
}
c(em, "buildTagSelector");
function ys(t) {
  if (!t) return null;
  if (t.documentName || t._source !== void 0) {
    const e = t.object;
    return e ? { placeable: e, doc: t } : null;
  }
  return t.document ? { placeable: t, doc: t.document } : null;
}
c(ys, "normalizePlaceable");
function tm() {
  var t;
  return window.Tagger ?? ((t = game.modules.get("tagger")) == null ? void 0 : t.api) ?? null;
}
c(tm, "getTaggerAPI");
function bs(t, e) {
  if (!t) return null;
  const n = e ?? canvas.scene;
  if (!n) return null;
  const i = Rc(t);
  switch (i.type) {
    case "special":
      return rb(i.value);
    case "tag":
      return $u(i.value, n);
    case "tag-all":
      return $u(i.value, n);
    case "id":
      return ab(i.value, n);
    case "tags-any":
      return Nu(i.value, n, !0);
    case "tags-all":
      return Nu(i.value, n, !1);
    case "uuid":
      return ob(i.value);
    default:
      return null;
  }
}
c(bs, "resolveSelector");
function rb(t) {
  var e;
  if (t === "$particles") {
    if (!((e = game.modules.get("fxmaster")) != null && e.active))
      return console.warn(`[${L}] Picker: FXMaster not active, cannot resolve "$particles".`), null;
    const n = canvas.particleeffects;
    return n ? { kind: "particles", documents: [], placeables: [], target: n } : null;
  }
  return null;
}
c(rb, "resolveSpecial");
function $u(t, e, n) {
  const i = tm();
  if (!i)
    return console.warn(`[${L}] Picker: Tagger not available, cannot resolve tag "${t}".`), null;
  const r = i.getByTag(t, { sceneId: e.id });
  if (!(r != null && r.length)) return null;
  const a = [];
  for (const o of r) {
    const s = ys(o);
    s && a.push(s);
  }
  return a.length === 0 ? null : {
    kind: a.length === 1 ? "placeable" : "multi-placeable",
    documents: a.map((o) => o.doc),
    placeables: a
  };
}
c($u, "resolveTag");
function ab(t, e) {
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
      const a = ys(r);
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
c(ab, "resolveById");
function Nu(t, e, n) {
  const i = tm();
  if (!i)
    return console.warn(`[${L}] Picker: Tagger not available, cannot resolve multi-tag.`), null;
  const r = i.getByTag(t, {
    sceneId: e.id,
    matchAny: n
  });
  if (!(r != null && r.length)) return null;
  const a = [];
  for (const o of r) {
    const s = ys(o);
    s && a.push(s);
  }
  return a.length === 0 ? null : {
    kind: a.length === 1 ? "placeable" : "multi-placeable",
    documents: a.map((o) => o.doc),
    placeables: a
  };
}
c(Nu, "resolveMultiTag");
function ob(t) {
  const e = fromUuidSync(t);
  if (!e) return null;
  const n = ys(e);
  return n ? {
    kind: "placeable",
    documents: [n.doc],
    placeables: [n]
  } : null;
}
c(ob, "resolveUUID");
function sb(t) {
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
c(sb, "adaptResolved");
function uo(t) {
  var r;
  const e = /* @__PURE__ */ new Set();
  if (t.segments) {
    if (t.setup) for (const a of Object.keys(t.setup)) e.add(a);
    if (t.landing) for (const a of Object.keys(t.landing)) e.add(a);
    for (const a of Object.values(t.segments)) {
      if (a.setup) for (const o of Object.keys(a.setup)) e.add(o);
      if (a.landing) for (const o of Object.keys(a.landing)) e.add(o);
      a.timeline && ec(a.timeline, e), (r = a.gate) != null && r.target && e.add(a.gate.target);
    }
  } else {
    if (t.setup) for (const a of Object.keys(t.setup)) e.add(a);
    if (t.landing) for (const a of Object.keys(t.landing)) e.add(a);
    t.timeline && ec(t.timeline, e);
  }
  const n = /* @__PURE__ */ new Map(), i = [];
  for (const a of e) {
    const o = bs(a), s = sb(o);
    s ? n.set(a, s) : i.push(a);
  }
  return i.length && console.warn(`[${L}] Cinematic: ${i.length} unresolved target(s): ${i.join(", ")}`), { targets: n, unresolved: i };
}
c(uo, "resolveAllTargets");
function lb(t, e) {
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
c(lb, "captureSnapshot");
function cb(t) {
  const e = {};
  function n(i) {
    if (i)
      for (const [r, a] of Object.entries(i))
        e[r] || (e[r] = {}), Object.assign(e[r], a);
  }
  if (c(n, "mergeMap"), t.segments) {
    n(t.setup), n(t.landing);
    for (const i of Object.values(t.segments))
      n(i.setup), n(i.landing), i.timeline && Zl(i.timeline, e, n);
  } else
    n(t.setup), n(t.landing), t.timeline && Zl(t.timeline, e, n);
  return e;
}
c(cb, "gatherAllStateMaps");
function Zl(t, e, n) {
  var i;
  for (const r of t)
    if (!(r.delay != null || r.await != null || r.emit != null) && !(r.transitionTo != null || r.sound != null || r.stopSound != null)) {
      if ((i = r.parallel) != null && i.branches) {
        for (const a of r.parallel.branches)
          Zl(a, e, n);
        continue;
      }
      if (n(r.before), n(r.after), r.tweens)
        for (const a of r.tweens)
          a.target && a.attribute && (e[a.target] || (e[a.target] = {}), e[a.target][a.attribute] = "__snapshot__");
    }
}
c(Zl, "gatherFromEntries");
function ec(t, e) {
  for (const n of t)
    if (n.delay == null && n.await == null && n.emit == null && n.transitionTo == null && n.sound == null && n.stopSound == null) {
      if (n.parallel) {
        const i = n.parallel;
        if (i.branches)
          for (const r of i.branches)
            ec(r, e);
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
c(ec, "collectSelectorsFromEntries");
const Fu = {
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
}, ub = /* @__PURE__ */ new Set([
  "alpha",
  "visible",
  "x",
  "y",
  "scale",
  "rotation"
]);
function Rs(t, e, n) {
  const i = {};
  for (const [r, a] of Object.entries(t))
    e.has(r) ? i[r] = a : console.warn(`[${L}] Cinematic: blocked property "${r}" on ${n}.`);
  return i;
}
c(Rs, "filterOverrides");
function Ae(t, e) {
  var i, r;
  if (!t) return;
  const n = [];
  for (const [a, o] of Object.entries(t)) {
    const s = e.get(a);
    if (s)
      if (s.kind === "particles") {
        if (s.target.destroyed) continue;
        const l = Rs(o, ub, "$particles");
        for (const [u, d] of Object.entries(l))
          s.target[u] = d;
      } else if (s.kind === "multi-placeable")
        for (const { placeable: l, doc: u } of s.placeables) {
          if (!(u != null && u.parent) || !(l != null && l.scene)) continue;
          const d = u.documentName, m = Fu[d];
          if (!m) {
            console.warn(`[${L}] Cinematic: no allowlist for document type "${d}" on "${a}", skipping.`);
            continue;
          }
          const f = Rs(o, m, `${d} "${a}"`);
          u.updateSource(f), n.push(l);
        }
      else {
        if (!((i = s.doc) != null && i.parent) || !((r = s.placeable) != null && r.scene)) continue;
        const l = s.doc.documentName, u = Fu[l];
        if (!u) {
          console.warn(`[${L}] Cinematic: no allowlist for document type "${l}" on "${a}", skipping.`);
          continue;
        }
        const d = Rs(o, u, `${l} "${a}"`);
        s.doc.updateSource(d), n.push(s.placeable);
      }
  }
  for (const a of n)
    a.refresh();
}
c(Ae, "applyState");
function ji(t, e) {
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
c(ji, "refreshPerceptionIfNeeded");
const db = {
  "tile-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "light-color": /* @__PURE__ */ new Set(["uuid", "toColor", "toAlpha", "mode"]),
  "light-state": /* @__PURE__ */ new Set(["uuid", "enabled"]),
  "particles-prop": /* @__PURE__ */ new Set(["attribute", "value"]),
  "camera-pan": /* @__PURE__ */ new Set(["x", "y", "scale"]),
  "token-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "drawing-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "sound-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"])
}, fb = /* @__PURE__ */ new Set(["easing"]), mb = /* @__PURE__ */ new Set(["type", "target"]);
function nm(t, e) {
  const { type: n, target: i, ...r } = t;
  if (!n)
    return console.warn(`[${L}] Cinematic: tween entry missing 'type', skipping.`), null;
  const a = {}, o = {}, s = db[n];
  if (i === "$particles")
    a.target = "$particles";
  else if (i) {
    const l = e.get(i);
    if (!l) return null;
    l.kind === "multi-placeable" ? a.uuid = l.placeables.map((u) => u.doc.uuid) : a.uuid = l.doc.uuid;
  }
  for (const [l, u] of Object.entries(r))
    mb.has(l) || (fb.has(l) ? o[l] = u : (s != null && s.has(l), a[l] = u));
  return { type: n, params: a, opts: o };
}
c(nm, "compileTween");
const qr = /* @__PURE__ */ new Map();
let hb = 0;
async function gb(t) {
  var u, d, m, f, h;
  const { id: e, src: n, volume: i = 0.8, loop: r = !1, fadeIn: a } = t;
  if (!n) {
    console.warn(`[${L}] Cinematic sound: missing 'src', skipping.`);
    return;
  }
  const o = e || `__auto_${++hb}`, s = {
    src: n,
    autoplay: !0,
    loop: r,
    volume: i
  };
  let l = null;
  try {
    typeof ((d = (u = foundry == null ? void 0 : foundry.audio) == null ? void 0 : u.AudioHelper) == null ? void 0 : d.play) == "function" ? l = await foundry.audio.AudioHelper.play(s, !1) : typeof ((f = (m = game == null ? void 0 : game.audio) == null ? void 0 : m.constructor) == null ? void 0 : f.play) == "function" ? l = await game.audio.constructor.play(s, !1) : typeof ((h = game == null ? void 0 : game.audio) == null ? void 0 : h.play) == "function" && (l = await game.audio.play(s, !1));
  } catch (p) {
    console.error(`[${L}] Cinematic sound: failed to play "${n}":`, p);
    return;
  }
  if (!l) {
    console.warn(`[${L}] Cinematic sound: audio helper unavailable for "${n}".`);
    return;
  }
  a && a > 0 && l.fade && l.fade(i, { duration: a, from: 0 }), qr.set(o, { sound: l, config: t }), console.log(`[${L}] Cinematic sound: playing "${n}" as "${o}" (loop=${r}, vol=${i})`);
}
c(gb, "playLocalSound");
function Hs(t) {
  var i, r;
  const e = qr.get(t);
  if (!e) {
    console.warn(`[${L}] Cinematic sound: no active sound with id "${t}".`);
    return;
  }
  const n = e.config.fadeOut;
  try {
    n && n > 0 && e.sound.fade ? e.sound.fade(0, { duration: n }).then(() => {
      var a, o;
      return (o = (a = e.sound).stop) == null ? void 0 : o.call(a);
    }) : (r = (i = e.sound).stop) == null || r.call(i);
  } catch (a) {
    console.warn(`[${L}] Cinematic sound: error stopping "${t}":`, a);
  }
  qr.delete(t);
}
c(Hs, "stopCinematicSound");
function Du() {
  var t, e;
  for (const [n, i] of qr)
    try {
      (e = (t = i.sound).stop) == null || e.call(t);
    } catch (r) {
      console.warn(`[${L}] Cinematic sound: error stopping "${n}" during cleanup:`, r);
    }
  qr.clear();
}
c(Du, "stopAllCinematicSounds");
function pb(t, e, n, i = {}) {
  const { skipToStep: r, onStepComplete: a, timelineName: o } = i, s = new n().name(o ?? `cinematic-${canvas.scene.id}`);
  return s.beforeAll(() => {
    var l;
    try {
      Ae(t.setup, e), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    } catch (u) {
      throw console.error(`[${L}] Cinematic: error in beforeAll (setup state) on scene ${(l = canvas.scene) == null ? void 0 : l.id}:`, u), u;
    }
  }), rm(t.timeline, s, e, { skipToStep: r, onStepComplete: a }), { tl: s };
}
c(pb, "buildTimeline");
function im(t, e) {
  var n;
  if (t)
    for (const i of t)
      for (const r of i) {
        if (r.before)
          try {
            Ae(r.before, e), ji(r.before, e);
          } catch (a) {
            console.warn(`[${L}] Cinematic: error in skipped parallel before:`, a);
          }
        if (r.after)
          try {
            Ae(r.after, e), ji(r.after, e);
          } catch (a) {
            console.warn(`[${L}] Cinematic: error in skipped parallel after:`, a);
          }
        (n = r.parallel) != null && n.branches && im(r.parallel.branches, e);
      }
}
c(im, "applyParallelStatesForSkip");
function rm(t, e, n, i = {}) {
  const { skipToStep: r, onStepComplete: a } = i;
  let o = -1;
  for (const s of t) {
    if (s.sound != null) {
      if (r != null && o < r) continue;
      const m = s.sound, { duration: f, loop: h, fireAndForget: p } = m, y = e.step();
      if (y.before(() => {
        gb(m);
      }), f && f > 0)
        if (p) {
          if (h && m.id) {
            const w = m.id, b = f;
            y.before(() => {
              setTimeout(() => Hs(w), b);
            });
          }
        } else
          e.delay(f), h && e.step().before(() => {
            Hs(m.id);
          });
      continue;
    }
    if (s.stopSound != null) {
      if (r != null && o < r) continue;
      const m = s.stopSound;
      e.step().before(() => {
        Hs(m);
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
        im(s.parallel.branches, n);
        continue;
      }
      const m = s.parallel, f = m.branches.map((h) => (p) => rm(h, p, n));
      e.parallel(f, {
        join: m.join ?? "all",
        overflow: m.overflow ?? "detach"
      });
      continue;
    }
    if (!s.tweens || !Array.isArray(s.tweens)) {
      console.warn(`[${L}] Cinematic: timeline entry has no tweens array, skipping.`);
      continue;
    }
    if (o++, r != null && o < r) {
      if (s.before)
        try {
          Ae(s.before, n), ji(s.before, n);
        } catch (m) {
          console.warn(`[${L}] Cinematic: error applying skipped step.before:`, m);
        }
      if (s.after)
        try {
          Ae(s.after, n), ji(s.after, n);
        } catch (m) {
          console.warn(`[${L}] Cinematic: error applying skipped step.after:`, m);
        }
      continue;
    }
    const l = o, u = e.step();
    s.before && u.before(() => {
      var m;
      try {
        Ae(s.before, n), ji(s.before, n);
      } catch (f) {
        throw console.error(`[${L}] Cinematic: error in step.before callback on scene ${(m = canvas.scene) == null ? void 0 : m.id}:`, f), f;
      }
    });
    const d = s.duration ?? 500;
    for (const m of s.tweens) {
      const f = nm(m, n);
      f && u.add(f.type, f.params, { ...f.opts, durationMS: d });
    }
    u.after(() => {
      var m;
      try {
        s.after && (Ae(s.after, n), ji(s.after, n)), a == null || a(l);
      } catch (f) {
        throw console.error(`[${L}] Cinematic: error in step.after callback on scene ${(m = canvas.scene) == null ? void 0 : m.id}:`, f), f;
      }
    });
  }
}
c(rm, "compileCinematicEntries");
function Ui(t, e, n) {
  if (t != null) {
    if (typeof t != "object" || Array.isArray(t)) {
      n.push({ path: e, level: "error", message: `Expected object, got ${Array.isArray(t) ? "array" : typeof t}` });
      return;
    }
    for (const [i, r] of Object.entries(t))
      (typeof r != "object" || r === null || Array.isArray(r)) && n.push({ path: `${e}["${i}"]`, level: "error", message: `Expected property overrides object, got ${Array.isArray(r) ? "array" : typeof r}` });
  }
}
c(Ui, "validateStateMap");
function tc(t, e, n, i) {
  var r;
  for (let a = 0; a < t.length; a++) {
    const o = t[a], s = `${e}[${a}]`;
    if (!(o.delay != null || o.await != null || o.emit != null) && !(o.transitionTo != null || o.sound != null || o.stopSound != null)) {
      if ((r = o.parallel) != null && r.branches) {
        for (let l = 0; l < o.parallel.branches.length; l++)
          tc(o.parallel.branches[l], `${s}.parallel.branches[${l}]`, n, i);
        continue;
      }
      if (Ui(o.before, `${s}.before`, i), Ui(o.after, `${s}.after`, i), o.tweens)
        for (let l = 0; l < o.tweens.length; l++) {
          const u = o.tweens[l], d = `${s}.tweens[${l}]`;
          if (!u.type) {
            i.push({ path: d, level: "error", message: "Missing 'type' field" });
            continue;
          }
          const m = sr(u.type);
          if (!m) {
            i.push({ path: d, level: "error", message: `Unknown tween type: "${u.type}"` });
            continue;
          }
          if (n)
            try {
              const f = nm(u, n);
              f ? m.validate(f.params) : u.target && i.push({ path: d, level: "warn", message: `Target "${u.target}" could not be resolved for compilation` });
            } catch (f) {
              i.push({ path: d, level: "error", message: f.message });
            }
          n && u.target && !n.has(u.target) && i.push({ path: `${d}.target`, level: "warn", message: `Target "${u.target}" is not resolved` });
        }
    }
  }
}
c(tc, "validateEntries");
function yb(t, e = null) {
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
      Ui(s.setup, `${l}.setup`, n), Ui(s.landing, `${l}.landing`, n), s.timeline && Array.isArray(s.timeline) && tc(s.timeline, `${l}.timeline`, e, n), s.next && typeof s.next == "string" && !t.segments[s.next] && n.push({ path: `${l}.next`, level: "error", message: `Next segment "${s.next}" not found` });
    }
  } else
    Ui(t.setup, "setup", n), Ui(t.landing, "landing", n), t.timeline && Array.isArray(t.timeline) && tc(t.timeline, "timeline", e, n);
  return n;
}
c(yb, "validateCinematicDeep");
const qs = 5, Pu = /* @__PURE__ */ new Set(["click", "tile-click", "keypress"]);
var le, pe, We, xe, bt, Sr, nc, am, K, De, qa, ke, St;
const se = class se {
  constructor(e = null, { loadedHash: n = null, cinematicName: i = "default", segmentName: r = null } = {}) {
    M(this, K);
    M(this, le);
    M(this, pe);
    M(this, We);
    M(this, xe);
    var o;
    I(this, le, e ?? se.empty()), I(this, pe, i), I(this, xe, n);
    const a = (o = g(this, le).cinematics) == null ? void 0 : o[g(this, pe)];
    I(this, We, r ?? (a == null ? void 0 : a.entry) ?? "main");
  }
  static empty() {
    return {
      version: qs,
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
    var w;
    const { trigger: n, tracking: i, synchronized: r, setup: a, landing: o, timeline: s = [] } = e;
    if (!s.some(
      (b) => {
        var v;
        return b.await != null && Pu.has(((v = b.await) == null ? void 0 : v.event) ?? "click");
      }
    )) {
      const b = s.filter((T) => T.transitionTo == null), v = s.find((T) => T.transitionTo != null), E = { timeline: b };
      if (a && Object.keys(a).length && (E.setup = a), o && Object.keys(o).length && (E.landing = o), v) {
        const T = v.transitionTo;
        T.scene && T.cinematic ? E.next = { segment: T.cinematic, scene: T.scene } : T.cinematic;
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
    let d = [], m = 1, f = null;
    const h = [];
    function p() {
      const b = `segment-${m++}`, v = { timeline: [...d] };
      return f && (v.gate = f), u[b] = v, h.push(b), d = [], f = null, b;
    }
    c(p, "flushSegment");
    for (const b of s)
      if (b.transitionTo == null) {
        if (b.await != null && Pu.has(((w = b.await) == null ? void 0 : w.event) ?? "click")) {
          p(), f = { ...b.await }, delete f.event, f = { event: b.await.event ?? "click", ...f };
          continue;
        }
        d.push(b);
      }
    (d.length > 0 || f) && p();
    for (let b = 0; b < h.length - 1; b++)
      u[h[b]].next = h[b + 1];
    h.length > 0 && (a && Object.keys(a).length && (u[h[0]].setup = a), o && Object.keys(o).length && (u[h[h.length - 1]].landing = o));
    const y = s.find((b) => b.transitionTo != null);
    if (y && h.length > 0) {
      const b = y.transitionTo, v = u[h[h.length - 1]];
      b.scene && b.cinematic && (v.next = { segment: b.cinematic, scene: b.scene });
    }
    return {
      trigger: n,
      tracking: i,
      ...r ? { synchronized: r } : {},
      entry: h[0] ?? "main",
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
      (i = a.timeline) != null && i.length && (a.timeline = S(r = se, bt, nc).call(r, a.timeline));
    return n;
  }
  static fromScene(e, n = "default") {
    var o;
    const i = e == null ? void 0 : e.getFlag(L, "cinematic");
    let r = i ? foundry.utils.deepClone(i) : null;
    const a = i ? S(o = se, bt, am).call(o, i) : null;
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
      r.version = qs;
    }
    return new se(r, { loadedHash: a, cinematicName: n });
  }
  /**
   * Check if the scene's cinematic flag has been modified since this state was loaded.
   * @param {object} scene  The Foundry scene document
   * @returns {boolean} true if scene data differs from what was loaded
   */
  isStale(e) {
    if (!g(this, xe)) return !1;
    const n = e == null ? void 0 : e.getFlag(L, "cinematic");
    return n ? !foundry.utils.objectsEqual(n, g(this, xe)) : !1;
  }
  // ── Read ──────────────────────────────────────────────────────────────
  get data() {
    return g(this, le);
  }
  get trigger() {
    return g(this, K, De).trigger;
  }
  get tracking() {
    return g(this, K, De).tracking;
  }
  get synchronized() {
    return g(this, K, De).synchronized ?? !1;
  }
  get activeCinematicName() {
    return g(this, pe);
  }
  // ── Segment accessors ────────────────────────────────────────────────
  get segments() {
    return g(this, K, De).segments;
  }
  get entry() {
    return g(this, K, De).entry;
  }
  get activeSegmentName() {
    return g(this, We);
  }
  get activeSegment() {
    var e;
    return ((e = g(this, K, De).segments) == null ? void 0 : e[g(this, We)]) ?? null;
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
    return Object.keys(g(this, le).cinematics);
  }
  switchCinematic(e) {
    if (!g(this, le).cinematics[e]) return this;
    const n = g(this, le).cinematics[e];
    return new se(foundry.utils.deepClone(g(this, le)), {
      loadedHash: g(this, xe),
      cinematicName: e,
      segmentName: n.entry ?? "main"
    });
  }
  addCinematic(e) {
    if (!e || g(this, le).cinematics[e]) return this;
    const n = foundry.utils.deepClone(g(this, le));
    return n.cinematics[e] = se.emptyCinematic(), new se(n, {
      loadedHash: g(this, xe),
      cinematicName: e,
      segmentName: "main"
    });
  }
  removeCinematic(e) {
    if (Object.keys(g(this, le).cinematics).length <= 1) return this;
    if (!g(this, le).cinematics[e]) return this;
    const i = foundry.utils.deepClone(g(this, le));
    delete i.cinematics[e];
    const r = g(this, pe) === e ? Object.keys(i.cinematics)[0] : g(this, pe), a = i.cinematics[r];
    return new se(i, {
      loadedHash: g(this, xe),
      cinematicName: r,
      segmentName: (a == null ? void 0 : a.entry) ?? "main"
    });
  }
  renameCinematic(e, n) {
    if (!e || !n || e === n) return this;
    if (!g(this, le).cinematics[e]) return this;
    if (g(this, le).cinematics[n]) return this;
    const i = foundry.utils.deepClone(g(this, le)), r = {};
    for (const [o, s] of Object.entries(i.cinematics))
      r[o === e ? n : o] = s;
    i.cinematics = r;
    const a = g(this, pe) === e ? n : g(this, pe);
    return new se(i, {
      loadedHash: g(this, xe),
      cinematicName: a,
      segmentName: g(this, We)
    });
  }
  // ── Cinematic-level mutations ─────────────────────────────────────────
  setTrigger(e) {
    return S(this, K, qa).call(this, { trigger: e });
  }
  setTracking(e) {
    return S(this, K, qa).call(this, { tracking: e });
  }
  setSynchronized(e) {
    return S(this, K, qa).call(this, { synchronized: e });
  }
  // ── Segment-level mutations (setup/landing now live on segments) ──────
  setSetup(e) {
    return S(this, K, ke).call(this, { setup: e });
  }
  setLanding(e) {
    return S(this, K, ke).call(this, { landing: e });
  }
  // ── Segment management methods ────────────────────────────────────────
  switchSegment(e) {
    var n;
    return (n = g(this, K, De).segments) != null && n[e] ? new se(foundry.utils.deepClone(g(this, le)), {
      loadedHash: g(this, xe),
      cinematicName: g(this, pe),
      segmentName: e
    }) : this;
  }
  addSegment(e, n = null) {
    var a;
    if (!e || (a = g(this, K, De).segments) != null && a[e]) return this;
    const i = foundry.utils.deepClone(g(this, le)), r = i.cinematics[g(this, pe)];
    if (r.segments[e] = se.emptySegment(), n && r.segments[n]) {
      const o = r.segments[n].next;
      r.segments[n].next = e, o && (r.segments[e].next = o);
    }
    return new se(i, {
      loadedHash: g(this, xe),
      cinematicName: g(this, pe),
      segmentName: e
    });
  }
  removeSegment(e) {
    var s, l;
    if (Object.keys(g(this, K, De).segments ?? {}).length <= 1) return this;
    if (!((s = g(this, K, De).segments) != null && s[e])) return this;
    const i = foundry.utils.deepClone(g(this, le)), r = i.cinematics[g(this, pe)], a = r.segments[e].next;
    for (const [, u] of Object.entries(r.segments))
      (u.next === e || typeof u.next == "object" && ((l = u.next) == null ? void 0 : l.segment) === e) && (u.next = a ?? void 0, u.next || delete u.next);
    delete r.segments[e], r.entry === e && (r.entry = Object.keys(r.segments)[0]);
    const o = g(this, We) === e ? r.entry : g(this, We);
    return new se(i, {
      loadedHash: g(this, xe),
      cinematicName: g(this, pe),
      segmentName: o
    });
  }
  renameSegment(e, n) {
    var s, l, u;
    if (!e || !n || e === n) return this;
    if (!((s = g(this, K, De).segments) != null && s[e])) return this;
    if ((l = g(this, K, De).segments) != null && l[n]) return this;
    const i = foundry.utils.deepClone(g(this, le)), r = i.cinematics[g(this, pe)], a = {};
    for (const [d, m] of Object.entries(r.segments))
      a[d === e ? n : d] = m;
    r.segments = a;
    for (const [, d] of Object.entries(r.segments))
      d.next === e ? d.next = n : typeof d.next == "object" && ((u = d.next) == null ? void 0 : u.segment) === e && (d.next.segment = n);
    r.entry === e && (r.entry = n);
    const o = g(this, We) === e ? n : g(this, We);
    return new se(i, {
      loadedHash: g(this, xe),
      cinematicName: g(this, pe),
      segmentName: o
    });
  }
  setSegmentGate(e) {
    return S(this, K, ke).call(this, { gate: e ?? void 0 });
  }
  setSegmentNext(e) {
    return S(this, K, ke).call(this, { next: e ?? void 0 });
  }
  setSegmentSetup(e) {
    return S(this, K, ke).call(this, { setup: e });
  }
  setSegmentLanding(e) {
    return S(this, K, ke).call(this, { landing: e });
  }
  listSegmentNames() {
    return Object.keys(g(this, K, De).segments ?? {});
  }
  // ── Timeline entry mutations (scoped to active segment) ──────────────
  addStep(e = -1) {
    const n = [...this.activeSegment.timeline], i = { duration: 1e3, tweens: [] };
    return e < 0 || e >= n.length ? n.push(i) : n.splice(e, 0, i), S(this, K, ke).call(this, { timeline: n });
  }
  addDelay(e = -1, n = 1e3) {
    const i = [...this.activeSegment.timeline], r = { delay: n };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), S(this, K, ke).call(this, { timeline: i });
  }
  addAwait(e = -1, n = null) {
    return console.warn(`[${L}] CinematicState.addAwait() is deprecated in v4. Use segment gates instead.`), this;
  }
  addEmit(e = -1, n = "") {
    const i = [...this.activeSegment.timeline], r = { emit: n };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), S(this, K, ke).call(this, { timeline: i });
  }
  addParallel(e = -1) {
    const n = [...this.activeSegment.timeline], i = { parallel: { branches: [[], []], join: "all", overflow: "detach" } };
    return e < 0 || e >= n.length ? n.push(i) : n.splice(e, 0, i), S(this, K, ke).call(this, { timeline: n });
  }
  addTransitionTo(e = -1, n = null) {
    return console.warn(`[${L}] CinematicState.addTransitionTo() is deprecated in v4. Use segment next edges instead.`), this;
  }
  addSound(e = -1, n = null) {
    const i = [...this.activeSegment.timeline], r = { sound: n ?? { src: "", volume: 0.8, loop: !1, duration: 0, fireAndForget: !1 } };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), S(this, K, ke).call(this, { timeline: i });
  }
  addStopSound(e = -1, n = "") {
    const i = [...this.activeSegment.timeline], r = { stopSound: n };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), S(this, K, ke).call(this, { timeline: i });
  }
  moveEntry(e, n) {
    if (e === n) return this;
    const i = [...this.activeSegment.timeline];
    if (e < 0 || e >= i.length) return this;
    if (n < 0 || n >= i.length) return this;
    const [r] = i.splice(e, 1);
    return i.splice(n, 0, r), S(this, K, ke).call(this, { timeline: i });
  }
  removeEntry(e) {
    const n = [...this.activeSegment.timeline];
    return e < 0 || e >= n.length ? this : (n.splice(e, 1), S(this, K, ke).call(this, { timeline: n }));
  }
  updateEntry(e, n) {
    const i = this.activeSegment.timeline.map((r, a) => a !== e ? r : { ...foundry.utils.deepClone(r), ...n });
    return S(this, K, ke).call(this, { timeline: i });
  }
  // ── Tween mutations ──────────────────────────────────────────────────
  addTween(e, n = null) {
    const i = { type: "tile-prop", target: "", attribute: "alpha", value: 1 };
    return S(this, K, St).call(this, e, (r) => {
      const a = [...r.tweens ?? [], n ?? i];
      return { ...r, tweens: a };
    });
  }
  updateTween(e, n, i) {
    return S(this, K, St).call(this, e, (r) => {
      const a = (r.tweens ?? []).map((o, s) => s !== n ? o : { ...o, ...i });
      return { ...r, tweens: a };
    });
  }
  removeTween(e, n) {
    return S(this, K, St).call(this, e, (i) => {
      const r = (i.tweens ?? []).filter((a, o) => o !== n);
      return { ...i, tweens: r };
    });
  }
  updateStepDuration(e, n) {
    return S(this, K, St).call(this, e, (i) => ({ ...i, duration: Math.max(0, n) }));
  }
  // ── Parallel branch mutations ────────────────────────────────────────
  addBranch(e) {
    return S(this, K, St).call(this, e, (n) => {
      if (!n.parallel) return n;
      const i = [...n.parallel.branches, []];
      return { ...n, parallel: { ...n.parallel, branches: i } };
    });
  }
  removeBranch(e, n) {
    return S(this, K, St).call(this, e, (i) => {
      if (!i.parallel) return i;
      const r = i.parallel.branches.filter((a, o) => o !== n);
      return r.length < 1 ? i : { ...i, parallel: { ...i.parallel, branches: r } };
    });
  }
  addBranchEntry(e, n, i = null) {
    const r = { duration: 1e3, tweens: [] };
    return S(this, K, St).call(this, e, (a) => {
      if (!a.parallel) return a;
      const o = a.parallel.branches.map((s, l) => l !== n ? s : [...s, i ?? r]);
      return { ...a, parallel: { ...a.parallel, branches: o } };
    });
  }
  removeBranchEntry(e, n, i) {
    return S(this, K, St).call(this, e, (r) => {
      if (!r.parallel) return r;
      const a = r.parallel.branches.map((o, s) => s !== n ? o : o.filter((l, u) => u !== i));
      return { ...r, parallel: { ...r.parallel, branches: a } };
    });
  }
  updateBranchEntry(e, n, i, r) {
    return S(this, K, St).call(this, e, (a) => {
      if (!a.parallel) return a;
      const o = a.parallel.branches.map((s, l) => l !== n ? s : s.map((u, d) => d !== i ? u : { ...foundry.utils.deepClone(u), ...r }));
      return { ...a, parallel: { ...a.parallel, branches: o } };
    });
  }
  moveBranchEntry(e, n, i, r) {
    return i === r ? this : S(this, K, St).call(this, e, (a) => {
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
    const n = { ...foundry.utils.deepClone(g(this, le)), version: qs };
    await e.setFlag(L, "cinematic", n);
  }
  /** Returns the active cinematic's data (for validation/export). */
  toJSON() {
    return foundry.utils.deepClone(g(this, K, De));
  }
  /** Returns the entire v4 flag structure. */
  toFullJSON() {
    return foundry.utils.deepClone(g(this, le));
  }
};
le = new WeakMap(), pe = new WeakMap(), We = new WeakMap(), xe = new WeakMap(), bt = new WeakSet(), Sr = /* @__PURE__ */ c(function(e) {
  const { duration: n, detach: i, ...r } = e;
  return r;
}, "#stripTween"), nc = /* @__PURE__ */ c(function(e) {
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
          return S(d = se, bt, nc).call(d, u);
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
        tweens: u.map(S(se, bt, Sr))
      });
    } else if (o.length === 0) {
      const l = Math.max(500, ...s.map((m) => m.duration ?? 0)), { tweens: u, ...d } = a;
      n.push({
        ...d,
        duration: l,
        tweens: s.map(S(se, bt, Sr))
      });
    } else {
      const l = Math.max(500, ...o.map((f) => f.duration ?? 0)), u = Math.max(500, ...s.map((f) => f.duration ?? 0)), { tweens: d, ...m } = a;
      n.push({
        parallel: {
          branches: [
            [{ ...m, duration: l, tweens: o.map(S(se, bt, Sr)) }],
            [{ duration: u, tweens: s.map(S(se, bt, Sr)) }]
          ],
          join: "all",
          overflow: "detach"
        }
      });
    }
  }
  return n;
}, "#migrateTimelineV5"), am = /* @__PURE__ */ c(function(e) {
  return foundry.utils.deepClone(e);
}, "#computeHash"), K = new WeakSet(), De = /* @__PURE__ */ c(function() {
  return g(this, le).cinematics[g(this, pe)];
}, "#active"), // ── Internal ─────────────────────────────────────────────────────────
/** Clone the full state with a patch to the active cinematic (cinematic-level props). */
qa = /* @__PURE__ */ c(function(e) {
  const n = foundry.utils.deepClone(g(this, le));
  return Object.assign(n.cinematics[g(this, pe)], e), new se(n, {
    loadedHash: g(this, xe),
    cinematicName: g(this, pe),
    segmentName: g(this, We)
  });
}, "#cloneActive"), /** Clone the full state with a patch to the active segment within the active cinematic. */
ke = /* @__PURE__ */ c(function(e) {
  const n = foundry.utils.deepClone(g(this, le)), i = n.cinematics[g(this, pe)].segments[g(this, We)];
  if (!i) return this;
  Object.assign(i, e);
  for (const [r, a] of Object.entries(i))
    a === void 0 && delete i[r];
  return new se(n, {
    loadedHash: g(this, xe),
    cinematicName: g(this, pe),
    segmentName: g(this, We)
  });
}, "#cloneActiveSegment"), /** Mutate a single timeline entry within the active segment. */
St = /* @__PURE__ */ c(function(e, n) {
  const i = this.activeSegment;
  if (!i || e < 0 || e >= i.timeline.length) return this;
  const r = i.timeline.map((a, o) => o !== e ? a : n(foundry.utils.deepClone(a)));
  return S(this, K, ke).call(this, { timeline: r });
}, "#mutateEntry"), M(se, bt), c(se, "CinematicState");
let Xt = se;
const Ru = [
  { value: "tile-prop", label: "Tile Prop" },
  { value: "light-color", label: "Light Color" },
  { value: "light-state", label: "Light State" },
  { value: "particles-prop", label: "Particles Prop" },
  { value: "camera-pan", label: "Camera Pan" },
  { value: "token-prop", label: "Token Prop" },
  { value: "drawing-prop", label: "Drawing Prop" },
  { value: "sound-prop", label: "Sound Prop" }
], om = {
  "tile-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y, width, height" },
  "token-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y" },
  "drawing-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y" },
  "sound-prop": { form: "prop", attribute: "volume", value: 0.5, placeholder: "volume, radius" },
  "particles-prop": { form: "particles", attribute: "alpha", value: 1, placeholder: "alpha, rate, speed, size" },
  "camera-pan": { form: "camera", x: 0, y: 0, scale: 1 },
  "light-color": { form: "lightColor", toColor: "#ffffff", toAlpha: "", mode: "oklch" },
  "light-state": { form: "lightState", enabled: !0 }
}, bb = [
  { value: "canvasReady", label: "Canvas Ready" },
  { value: "manual", label: "Manual Only" }
];
function Hu(t) {
  return t && (t.split("/").pop() || "").replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "-") || "";
}
c(Hu, "soundIdFromPath");
function qu(t) {
  return t ? new Promise((e) => {
    const n = new Audio(t);
    n.addEventListener("loadedmetadata", () => {
      e(Math.round(n.duration * 1e3));
    }), n.addEventListener("error", () => e(0));
  }) : Promise.resolve(0);
}
c(qu, "loadAudioDurationMs");
const qn = 40, Or = 24, Br = 50, Bu = 50, ii = 60, li = 10, Bs = 16, sm = 40, lm = 20, vb = 90, ju = 70, Uu = 8;
function vs(t) {
  return { stepDuration: Math.max(500, t.duration ?? 500), detachOverflow: 0 };
}
c(vs, "computeStepDurations");
function wb(t) {
  var i;
  const e = ((i = t.parallel) == null ? void 0 : i.branches) ?? [];
  let n = 0;
  for (const r of e) {
    let a = 0;
    for (const o of r)
      o.delay != null ? a += o.delay : o.await != null || o.emit != null || (o.sound != null ? a += o.sound.fireAndForget ? 0 : o.sound.duration ?? 0 : o.stopSound != null || (a += vs(o).stepDuration));
    n = Math.max(n, a);
  }
  return Math.max(500, n);
}
c(wb, "computeParallelDuration");
function Hc(t) {
  return t.reduce((e, n) => n.delay != null ? e + n.delay : n.await != null || n.emit != null || n.transitionTo != null ? e : n.sound != null ? e + (n.sound.fireAndForget ? 0 : n.sound.duration ?? 0) : n.stopSound != null ? e : n.parallel != null ? e + wb(n) : e + vs(n).stepDuration, 0);
}
c(Hc, "computeTotalDuration");
function Eb(t, e) {
  if (t <= 0) return 0.1;
  const n = e / t;
  return Math.max(0.03, Math.min(0.5, n));
}
c(Eb, "computeScale");
function cm(t) {
  const e = t.tweens ?? [];
  if (e.length === 0) return "Empty";
  const n = e[0], i = (n.target ?? "").replace(/^tag:/, "#"), r = n.attribute ?? "";
  return n.type === "camera-pan" ? "Pan" : r === "alpha" ? `Fade ${i}` : r === "x" || r === "y" ? `Move ${i}` : n.type === "light-color" ? `Light ${i}` : n.type === "sound-prop" ? `Sound ${i}` : i ? `${i}` : "Step";
}
c(cm, "deriveStepLabel");
function Cb(t, e, n, i, r) {
  var u, d;
  const a = [], o = [], s = [];
  let l = e;
  for (let m = 0; m < t.length; m++) {
    const f = t[m], h = `${i}.${m}`, p = r === h;
    if (f.delay != null) {
      const y = Math.max(lm, f.delay * n);
      a.push({ type: "delay", leftPx: l, widthPx: y, label: `${f.delay}ms`, entryPath: h, selected: p }), l += y;
    } else if (f.await != null) {
      const y = ((u = f.await) == null ? void 0 : u.event) ?? "click", w = y === "tile-click" ? "fa-hand-pointer" : y === "signal" ? "fa-bolt" : "fa-pause";
      a.push({ type: "await", leftPx: l, widthPx: Bs, label: y, entryPath: h, selected: p, isGate: !0, gateIcon: w }), ((d = f.await) == null ? void 0 : d.event) === "signal" && s.push({ signal: f.await.signal, centerPx: l + Bs / 2 }), l += Bs;
    } else if (f.emit != null)
      a.push({ type: "emit", leftPx: l, widthPx: li, label: "emit", entryPath: h, selected: p, isMarker: !0 }), o.push({ signal: f.emit, centerPx: l + li / 2 });
    else if (f.sound != null) {
      const y = (f.sound.src || "").split("/").pop() || "Sound", w = f.sound.duration ?? 0;
      if (f.sound.fireAndForget ?? !1)
        a.push({ type: "sound", leftPx: l, widthPx: li, label: y, entryPath: h, selected: p, isMarker: !0 });
      else {
        const v = w > 0 ? Math.max(ii, w * n) : ii, E = (f.sound.loop ?? !1) && w <= 0;
        a.push({ type: "sound", leftPx: l, widthPx: v, label: y, entryPath: h, selected: p, hasTrailingArrow: E }), l += v;
      }
    } else if (f.stopSound != null)
      a.push({ type: "stopSound", leftPx: l, widthPx: li, label: "Stop", entryPath: h, selected: p, isMarker: !0 });
    else {
      const { stepDuration: y } = vs(f), w = Math.max(sm, y * n), b = cm(f);
      a.push({ type: "step", leftPx: l, widthPx: w, label: b, entryPath: h, selected: p }), l += w;
    }
  }
  return { blocks: a, width: l - e, emits: o, awaits: s };
}
c(Cb, "computeBranchLane");
function Vu(t) {
  return Or + t * qn;
}
c(Vu, "laneIndexToY");
function Sb(t, e) {
  const n = [];
  for (const i of t.emits)
    for (const r of t.awaits) {
      if (i.signal !== r.signal) continue;
      const a = i.centerPx, o = Vu(i.laneIndex) + qn / 2, s = r.centerPx, l = Vu(r.laneIndex) + qn / 2, u = l - o, d = (a + s) / 2, m = o + Math.sign(u || 1) * Math.min(40, Math.abs(u) * 0.5 + 20), f = l - Math.sign(u || 1) * Math.min(40, Math.abs(u) * 0.5 + 20);
      n.push({
        pathD: `M ${a} ${o} C ${d} ${m}, ${d} ${f}, ${s} ${l}`,
        signal: i.signal
      });
    }
  return n;
}
c(Sb, "computeSignalArcs");
function Tb(t, e) {
  const n = [];
  if (t <= 0) return n;
  const i = e * 1e3;
  let r;
  i >= 200 ? r = 500 : i >= 80 ? r = 1e3 : i >= 40 ? r = 2e3 : r = 5e3;
  for (let a = 0; a <= t + r; a += r) {
    const o = a >= 1e3 ? `${(a / 1e3).toFixed(a % 1e3 === 0 ? 0 : 1)}s` : `${a}ms`;
    n.push({ px: Br + a * e, label: o });
  }
  return n;
}
c(Tb, "computeTimeMarkers");
function Lb(t) {
  const e = [];
  for (let n = 0; n < t.length - 1; n++) {
    const i = t[n], r = t[n + 1], a = i.leftPx + i.widthPx + (r.leftPx - (i.leftPx + i.widthPx)) / 2, o = Or + qn / 2;
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
c(Lb, "computeInsertionPoints");
function Ib(t, { selectedPath: e, windowWidth: n }) {
  const i = Hc(t), r = n - 70 - 100, a = Eb(i, r), o = [], s = [], l = { emits: [], awaits: [] }, u = [];
  o.push({
    type: "setup",
    leftPx: 0,
    widthPx: Br,
    label: "Setup",
    entryPath: "setup",
    selected: e === "setup"
  });
  let d = Br;
  for (let v = 0; v < t.length; v++) {
    const E = t[v], T = `timeline.${v}`, k = e === T;
    if (E.delay != null) {
      const O = Math.max(lm, E.delay * a);
      o.push({
        type: "delay",
        leftPx: d,
        widthPx: O,
        label: `${E.delay}ms`,
        entryPath: T,
        selected: k
      }), d += O;
    } else if (E.emit != null)
      o.push({
        type: "emit",
        leftPx: d,
        widthPx: li,
        label: "Emit",
        entryPath: T,
        selected: k,
        isMarker: !0
      }), l.emits.push({
        signal: E.emit,
        centerPx: d + li / 2,
        laneIndex: 0
      });
    else if (E.sound != null) {
      const O = (E.sound.src || "").split("/").pop() || "Sound", _ = E.sound.duration ?? 0;
      if (E.sound.fireAndForget ?? !1) {
        const D = _ > 0 ? Math.max(ii, _ * a) : ii, $ = (E.sound.loop ?? !1) && _ <= 0, F = {
          type: "sound",
          leftPx: d,
          widthPx: D,
          label: O,
          entryPath: T,
          selected: k,
          hasTrailingArrow: $
        };
        let A = !1;
        for (const R of u)
          if (R.rightEdgePx <= d) {
            R.blocks.push(F), R.rightEdgePx = d + D, A = !0;
            break;
          }
        A || u.push({
          label: "♫ F&F",
          blocks: [F],
          rightEdgePx: d + D
        });
      } else {
        const D = _ > 0 ? Math.max(ii, _ * a) : ii, $ = (E.sound.loop ?? !1) && _ <= 0;
        o.push({
          type: "sound",
          leftPx: d,
          widthPx: D,
          label: O,
          entryPath: T,
          selected: k,
          hasTrailingArrow: $
        }), d += D;
      }
    } else if (E.stopSound != null)
      o.push({
        type: "stopSound",
        leftPx: d,
        widthPx: li,
        label: "Stop",
        entryPath: T,
        selected: k,
        isMarker: !0
      });
    else if (E.parallel != null) {
      const O = E.parallel.branches ?? [], _ = d, N = [];
      let D = 0;
      for (let F = 0; F < O.length; F++) {
        const A = `timeline.${v}.parallel.branches.${F}`, { blocks: R, width: B, emits: j, awaits: H } = Cb(O[F], _, a, A, e);
        N.push({ label: `Br ${F + 1}`, blocks: R }), D = Math.max(D, B);
        const V = s.length * 10 + F + 1;
        for (const Y of j) l.emits.push({ ...Y, laneIndex: V });
        for (const Y of H) l.awaits.push({ ...Y, laneIndex: V });
      }
      const $ = Math.max(ii, D);
      o.push({
        type: "parallel",
        leftPx: _,
        widthPx: $,
        label: `${O.length} br`,
        entryPath: T,
        selected: k
      }), s.push({ parallelEntryIndex: v, startPx: _, lanes: N }), d += $;
    } else {
      const { stepDuration: O } = vs(E), _ = Math.max(sm, O * a), N = cm(E);
      o.push({
        type: "step",
        leftPx: d,
        widthPx: _,
        label: N,
        entryPath: T,
        selected: k
      }), d += _;
    }
  }
  o.push({
    type: "landing",
    leftPx: d,
    widthPx: Bu,
    label: "Landing",
    entryPath: "landing",
    selected: e === "landing"
  }), d += Bu;
  const m = s.flatMap((v) => v.lanes), f = m.length;
  for (const v of u)
    m.push({ label: v.label, blocks: v.blocks });
  const h = Sb(l, m.length), p = [];
  for (let v = 0; v < u.length; v++) {
    const E = f + v;
    for (const T of u[v].blocks) {
      const k = T.leftPx, O = Or + qn, _ = Or + (1 + E) * qn + qn / 2;
      p.push({ x: k, y1: O, y2: _ });
    }
  }
  const y = Tb(i, a), w = Lb(o), b = Or + (1 + m.length) * qn;
  return {
    mainBlocks: o,
    subLanes: m,
    signalArcs: h,
    fafConnectors: p,
    timeMarkers: y,
    insertionPoints: w,
    totalWidthPx: Math.max(d, 200),
    swimlaneHeightPx: b,
    totalDurationMs: i
  };
}
c(Ib, "computeLanes");
function kb(t) {
  if (t <= 0) return "0s";
  if (t < 1e3) return `${t}ms`;
  const e = t / 1e3;
  return e % 1 === 0 ? `${e}s` : `${e.toFixed(1)}s`;
}
c(kb, "formatDuration");
function Ob(t, e) {
  var h, p, y, w;
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
  let u = Uu;
  for (const b of o) {
    const v = n[b], E = Hc(v.timeline ?? []), T = kb(E), k = b === i, O = b === e, _ = !a.has(b), N = vb;
    l.push({
      name: b,
      durationMs: E,
      durationLabel: T,
      isEntry: k,
      isActive: O,
      isOrphan: _,
      leftPx: u,
      widthPx: N,
      hasGate: !!v.gate,
      gateEvent: ((h = v.gate) == null ? void 0 : h.event) ?? null
    }), u += N + ju;
  }
  const d = [], m = new Map(l.map((b) => [b.name, b]));
  for (const b of o) {
    const v = n[b];
    if (!v.next) continue;
    const E = typeof v.next == "string" ? v.next : (p = v.next) == null ? void 0 : p.segment;
    if (!E) continue;
    const T = m.get(b), k = m.get(E);
    if (!T || !k) continue;
    const O = n[E], _ = ((y = O == null ? void 0 : O.gate) == null ? void 0 : y.event) ?? null, N = typeof v.next == "object" && ((w = v.next) == null ? void 0 : w.scene);
    d.push({
      fromName: b,
      toName: E,
      gateLabel: _,
      isCrossScene: N,
      fromRightPx: T.leftPx + T.widthPx,
      toLeftPx: k.leftPx
    });
  }
  const f = u - ju + Uu;
  return { nodes: l, edges: d, totalWidthPx: f };
}
c(Ob, "computeSegmentGraph");
function Wn(t) {
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
c(Wn, "parseEntryPath");
function fo(t, e) {
  var i, r, a, o;
  const n = Wn(t);
  return n ? n.type === "setup" ? e.setup : n.type === "landing" ? e.landing : n.type === "timeline" ? e.timeline[n.index] : n.type === "branch" ? (o = (a = (r = (i = e.timeline[n.index]) == null ? void 0 : i.parallel) == null ? void 0 : r.branches) == null ? void 0 : a[n.branchIndex]) == null ? void 0 : o[n.branchEntryIndex] : null : null;
}
c(fo, "getEntryAtPath");
function Wu(t) {
  const e = Wn(t);
  return !e || e.type !== "timeline" ? null : e.index;
}
c(Wu, "getTimelineIndexFromPath");
function Ab(t) {
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
c(Ab, "countUniqueTargets");
function Mb(t, e) {
  var i, r, a;
  const n = Wn(t);
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
c(Mb, "stepNumberForPath");
function _b(t) {
  return {
    isSetup: !0,
    targetCount: Object.keys(t.setup ?? {}).length
  };
}
c(_b, "buildSetupDetail");
function xb(t) {
  return {
    isLanding: !0,
    targetCount: Object.keys(t.landing ?? {}).length
  };
}
c(xb, "buildLandingDetail");
function $b(t) {
  return { type: "delay", isDelay: !0, delay: t.delay };
}
c($b, "buildDelayDetail");
function Nb(t) {
  return { type: "emit", isEmit: !0, signal: t.emit };
}
c(Nb, "buildEmitDetail");
function Fb(t) {
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
c(Fb, "buildSoundDetail");
function Db(t) {
  return {
    type: "stopSound",
    isStopSound: !0,
    stopSoundId: t.stopSound
  };
}
c(Db, "buildStopSoundDetail");
function Pb(t, e) {
  var o;
  const n = t.parallel, i = n.join ?? "all", r = n.overflow ?? "detach", a = (n.branches ?? []).map((s, l) => ({
    branchIndex: l,
    label: `Branch ${l + 1}`,
    entries: (s ?? []).map((u, d) => {
      var E, T;
      const m = u.delay != null, f = u.await != null, h = u.emit != null, p = u.sound != null, y = u.stopSound != null, w = !m && !f && !h && !p && !y;
      let b, v;
      return m ? (b = `${u.delay}ms`, v = "delay") : f ? (b = "Await", v = ((E = u.await) == null ? void 0 : E.event) ?? "click") : h ? (b = "Emit", v = u.emit || "(unnamed)") : p ? (b = "Sound", v = (u.sound.src || "").split("/").pop() || "(none)") : y ? (b = "Stop Sound", v = u.stopSound || "(no id)") : (b = "Step", v = `${((T = u.tweens) == null ? void 0 : T.length) ?? 0} tweens`), { branchEntryIndex: d, isDelay: m, isAwait: f, isEmit: h, isSound: p, isStopSound: y, isStep: w, label: b, sub: v };
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
c(Pb, "buildParallelDetail");
function Rb(t, e, n, i) {
  const r = Nc(), a = (t.tweens ?? []).map((l, u) => {
    const d = `${e}.tweens.${u}`, m = n.has(d), f = l.type ?? "tile-prop", h = Ru.find((b) => b.value === f), p = om[f], y = (p == null ? void 0 : p.form) ?? "prop", w = l.mode ?? "oklch";
    return {
      tweenIndex: u,
      isExpanded: m,
      type: f,
      typeLabel: (h == null ? void 0 : h.label) ?? l.type ?? "Tile Prop",
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
      colorMode: w,
      colorModeIsOklch: w === "oklch",
      colorModeIsHsl: w === "hsl",
      colorModeIsRgb: w === "rgb",
      // Light-state fields
      enabled: l.enabled ?? !0,
      typeOptions: Ru.map((b) => ({
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
    stepNumber: Mb(e, i),
    stepDuration: t.duration ?? 1e3,
    tweens: a,
    beforeSummary: o.length ? `${o.length} target${o.length !== 1 ? "s" : ""}` : "(none)",
    afterSummary: s.length ? `${s.length} target${s.length !== 1 ? "s" : ""}` : "(none)"
  };
}
c(Rb, "buildStepDetail");
function Hb(t, { state: e, expandedTweens: n }) {
  const i = Wn(t);
  if (!i) return null;
  if (i.type === "setup") return _b(e);
  if (i.type === "landing") return xb(e);
  const r = fo(t, e);
  return r ? r.delay != null ? $b(r) : r.emit != null ? Nb(r) : r.sound != null ? Fb(r) : r.stopSound != null ? Db(r) : r.parallel != null && i.type === "timeline" ? Pb(r) : Rb(r, t, n, e) : null;
}
c(Hb, "buildDetail");
function qb({ state: t, mutate: e }) {
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
              e(() => new Xt(l));
            else if (l.segments !== void 0) {
              const u = { version: 4, cinematics: { [t.activeCinematicName]: l } };
              e(() => new Xt(u, { cinematicName: t.activeCinematicName }));
            } else if (l.timeline !== void 0) {
              const u = { version: 3, cinematics: { [t.activeCinematicName]: l } };
              e(() => new Xt(u, { cinematicName: t.activeCinematicName }));
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
c(qb, "showImportDialog");
function mo(t, { state: e, mutate: n }) {
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
c(mo, "showEditJsonDialog");
function Gu(t, { selectedPath: e, state: n, mutate: i }) {
  const r = fo(e, n);
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
            const m = JSON.parse(l), f = Wn(e);
            (f == null ? void 0 : f.type) === "timeline" ? i((h) => h.updateEntry(f.index, { [t]: m })) : (f == null ? void 0 : f.type) === "branch" && i((h) => h.updateBranchEntry(f.index, f.branchIndex, f.branchEntryIndex, { [t]: m }));
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
c(Gu, "showEditStepStateDialog");
function Bb({ selectedPath: t, state: e, mutate: n }) {
  const i = Wn(t);
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
c(Bb, "showEditParallelJsonDialog");
var fd, _n, jn, Ba, um;
const Lt = class Lt extends Kn(Yn) {
  constructor(n = {}) {
    super(n);
    M(this, jn);
    M(this, _n, null);
    I(this, _n, n.scene ?? canvas.scene ?? null);
  }
  async _prepareContext() {
    var r, a, o;
    const n = g(this, jn, Ba), i = ((a = n == null ? void 0 : n.getSeenStatus) == null ? void 0 : a.call(n, (r = g(this, _n)) == null ? void 0 : r.id)) ?? [];
    return {
      sceneName: ((o = g(this, _n)) == null ? void 0 : o.name) ?? "No scene",
      users: i.map((s) => ({
        ...s,
        statusLabel: s.seen ? "Seen" : "Not seen",
        statusClass: s.seen ? "cinematic-tracking__status--seen" : "cinematic-tracking__status--unseen"
      })),
      hasAnyTracked: i.some((s) => s.seen)
    };
  }
  _onRender(n, i) {
    super._onRender(n, i), S(this, jn, um).call(this);
  }
};
_n = new WeakMap(), jn = new WeakSet(), Ba = /* @__PURE__ */ c(function() {
  var n, i;
  return (i = (n = game.modules.get(L)) == null ? void 0 : n.api) == null ? void 0 : i.cinematic;
}, "#api"), um = /* @__PURE__ */ c(function() {
  var i, r;
  const n = this.element;
  n instanceof HTMLElement && (n.querySelectorAll("[data-action='reset-user']").forEach((a) => {
    a.addEventListener("click", async () => {
      var l;
      const o = a.dataset.userId;
      if (!o) return;
      const s = g(this, jn, Ba);
      s != null && s.resetForUser && (await s.resetForUser((l = g(this, _n)) == null ? void 0 : l.id, o), this.render({ force: !0 }));
    });
  }), (i = n.querySelector("[data-action='reset-all']")) == null || i.addEventListener("click", async () => {
    var o;
    const a = g(this, jn, Ba);
    a != null && a.resetForAll && (await a.resetForAll((o = g(this, _n)) == null ? void 0 : o.id), this.render({ force: !0 }));
  }), (r = n.querySelector("[data-action='refresh']")) == null || r.addEventListener("click", () => {
    this.render({ force: !0 });
  }));
}, "#bindEvents"), c(Lt, "CinematicTrackingApplication"), ve(Lt, "APP_ID", `${L}-cinematic-tracking`), ve(Lt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  qe(Lt, Lt, "DEFAULT_OPTIONS"),
  {
    id: Lt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((fd = qe(Lt, Lt, "DEFAULT_OPTIONS")) == null ? void 0 : fd.classes) ?? [], "eidolon-cinematic-tracking-window", "themed"])
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
)), ve(Lt, "PARTS", {
  content: {
    template: `modules/${L}/templates/cinematic-tracking.html`
  }
});
let ic = Lt;
function jb(t, e) {
  var n, i, r, a, o, s, l, u, d;
  (n = t.querySelector("[data-action='save']")) == null || n.addEventListener("click", () => e.save()), (i = t.querySelector("[data-action='play-preview']")) == null || i.addEventListener("click", () => e.play()), (r = t.querySelector("[data-action='reset-tracking']")) == null || r.addEventListener("click", () => e.resetTracking()), (a = t.querySelector("[data-action='export-json']")) == null || a.addEventListener("click", () => e.exportJSON()), (o = t.querySelector("[data-action='undo']")) == null || o.addEventListener("click", () => e.undo()), (s = t.querySelector("[data-action='redo']")) == null || s.addEventListener("click", () => e.redo()), (l = t.querySelector("[data-action='validate']")) == null || l.addEventListener("click", () => e.validate()), (u = t.querySelector("[data-action='import-json']")) == null || u.addEventListener("click", () => e.importJSON()), (d = t.querySelector("[data-action='open-tracking']")) == null || d.addEventListener("click", () => {
    new ic({ scene: e.scene }).render(!0);
  });
}
c(jb, "bindToolbarEvents");
function Ub(t, e) {
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
            var l, u, d, m, f, h, p;
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
              (p = (h = ui.notifications) == null ? void 0 : h.warn) == null || p.call(h, "Name already exists.");
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
            var u, d, m, f, h, p, y;
            const l = (u = s.find("#cinematic-rename").val()) == null ? void 0 : u.trim();
            if (!l) {
              (m = (d = ui.notifications) == null ? void 0 : d.warn) == null || m.call(d, "Name cannot be empty.");
              return;
            }
            if (/[.\s]/.test(l)) {
              (h = (f = ui.notifications) == null ? void 0 : f.warn) == null || h.call(f, "Name cannot contain dots or spaces.");
              return;
            }
            if (l !== o) {
              if (e.state.listCinematicNames().includes(l)) {
                (y = (p = ui.notifications) == null ? void 0 : p.warn) == null || y.call(p, "Name already exists.");
                return;
              }
              e.mutate((w) => w.renameCinematic(o, l));
            }
          }, "callback")
        },
        cancel: { label: "Cancel" }
      },
      default: "ok"
    }).render(!0);
  });
}
c(Ub, "bindCinematicSelectorEvents");
function Vb(t, e) {
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
        const s = Wu(n), l = Wu(o);
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
c(Vb, "bindSwimlaneEvents");
function Wb(t, e) {
  var n, i, r, a, o, s, l, u, d, m, f;
  (n = t.querySelector("[data-action='delete-entry']")) == null || n.addEventListener("click", () => {
    const h = e.parseEntryPath(e.selectedPath);
    h && (h.type === "timeline" ? (e.mutate((p) => p.removeEntry(h.index)), e.setSelectedPath(null)) : h.type === "branch" && (e.mutate((p) => p.removeBranchEntry(h.index, h.branchIndex, h.branchEntryIndex)), e.setSelectedPath(null)));
  }), (i = t.querySelector("[data-action='step-duration']")) == null || i.addEventListener("input", (h) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = Number(h.target.value) || 0;
    p.type === "timeline" ? e.mutate((w) => w.updateStepDuration(p.index, y)) : p.type === "branch" && e.mutate((w) => w.updateBranchEntry(p.index, p.branchIndex, p.branchEntryIndex, { duration: Math.max(0, y) }));
  }), (r = t.querySelector("[data-action='add-tween']")) == null || r.addEventListener("click", () => {
    const h = e.parseEntryPath(e.selectedPath);
    if (h) {
      if (h.type === "timeline")
        e.mutate((p) => p.addTween(h.index));
      else if (h.type === "branch") {
        const p = e.getEntryAtPath(e.selectedPath);
        if (!p) return;
        const y = { type: "tile-prop", target: "", attribute: "alpha", value: 1 }, w = [...p.tweens ?? [], y];
        e.mutate((b) => b.updateBranchEntry(h.index, h.branchIndex, h.branchEntryIndex, { tweens: w }));
      }
    }
  }), (a = t.querySelector("[data-action='change-delay']")) == null || a.addEventListener("change", (h) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = Number(h.target.value) || 0;
    p.type === "timeline" ? e.mutate((w) => w.updateEntry(p.index, { delay: y })) : p.type === "branch" && e.mutate((w) => w.updateBranchEntry(p.index, p.branchIndex, p.branchEntryIndex, { delay: y }));
  }), (o = t.querySelector("[data-action='edit-setup']")) == null || o.addEventListener("click", () => {
    mo("setup", { state: e.state, mutate: e.mutate });
  }), (s = t.querySelector("[data-action='edit-landing']")) == null || s.addEventListener("click", () => {
    mo("landing", { state: e.state, mutate: e.mutate });
  }), (l = t.querySelector("[data-action='edit-before']")) == null || l.addEventListener("click", () => {
    Gu("before", { selectedPath: e.selectedPath, state: e.state, mutate: e.mutate });
  }), (u = t.querySelector("[data-action='edit-after']")) == null || u.addEventListener("click", () => {
    Gu("after", { selectedPath: e.selectedPath, state: e.state, mutate: e.mutate });
  }), (d = t.querySelector("[data-action='change-trigger']")) == null || d.addEventListener("change", (h) => {
    e.mutate((p) => p.setTrigger(h.target.value));
  }), (m = t.querySelector("[data-action='change-tracking']")) == null || m.addEventListener("change", (h) => {
    e.mutate((p) => p.setTracking(h.target.checked));
  }), (f = t.querySelector("[data-action='change-synchronized']")) == null || f.addEventListener("change", (h) => {
    e.mutate((p) => p.setSynchronized(h.target.checked));
  });
}
c(Wb, "bindDetailPanelEvents");
const ir = /* @__PURE__ */ new WeakMap(), ho = /* @__PURE__ */ new Set(), go = /* @__PURE__ */ new Set(), zu = {
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
function po(t, e = {}) {
  var p, y, w;
  if (!t) return !1;
  rr(t);
  const n = e.mode ?? (e.color != null ? "custom" : "hover"), i = zu[n] ?? zu.hover, r = e.color ?? i.borderColor, a = e.alpha ?? i.borderAlpha, o = e.color ?? i.spriteTint, s = i.spriteAlpha, l = e.pulse ?? i.pulse, u = { border: null, sprite: null, pulseData: null, mode: n }, d = ((p = t.document) == null ? void 0 : p.width) ?? t.w ?? 100, m = ((y = t.document) == null ? void 0 : y.height) ?? t.h ?? 100, f = new PIXI.Graphics();
  f.lineStyle(i.borderWidth, r, a), f.drawRect(0, 0, d, m), t.addChild(f), u.border = f;
  const h = Gb(t, o, s);
  if (h && (canvas.controls.debug.addChild(h), go.add(h), u.sprite = h), l && ((w = canvas.app) != null && w.ticker)) {
    const b = {
      elapsed: 0,
      fn: /* @__PURE__ */ c((v) => {
        b.elapsed += v;
        const E = (Math.sin(b.elapsed * 0.05) + 1) / 2;
        u.border && (u.border.alpha = a * (0.4 + 0.6 * E)), u.sprite && (u.sprite.alpha = s * (0.5 + 0.5 * E));
      }, "fn")
    };
    canvas.app.ticker.add(b.fn), u.pulseData = b, ho.add(b);
  }
  return ir.set(t, u), !0;
}
c(po, "addHighlight");
function rr(t) {
  var n, i;
  if (!t) return;
  const e = ir.get(t);
  e && (e.pulseData && ((i = (n = canvas.app) == null ? void 0 : n.ticker) == null || i.remove(e.pulseData.fn), ho.delete(e.pulseData)), e.border && (e.border.parent && e.border.parent.removeChild(e.border), e.border.destroy({ children: !0 })), e.sprite && (e.sprite.parent && e.sprite.parent.removeChild(e.sprite), e.sprite.destroy({ children: !0 }), go.delete(e.sprite)), ir.delete(t));
}
c(rr, "removeHighlight");
function dm(t) {
  return ir.has(t);
}
c(dm, "hasHighlight");
function ja() {
  var e, n, i, r, a, o, s;
  for (const l of ho)
    (n = (e = canvas.app) == null ? void 0 : e.ticker) == null || n.remove(l.fn);
  ho.clear();
  for (const l of go)
    l.parent && l.parent.removeChild(l), l.destroy({ children: !0 });
  go.clear();
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
        const d = ir.get(u);
        d && (d.border && (d.border.parent && d.border.parent.removeChild(d.border), d.border.destroy({ children: !0 })), ir.delete(u));
      }
}
c(ja, "clearAllHighlights");
function Gb(t, e, n) {
  var a;
  const i = t.mesh;
  if (!((a = i == null ? void 0 : i.texture) != null && a.baseTexture)) return null;
  const r = PIXI.Sprite.from(i.texture);
  return r.isSprite = !0, r.anchor.set(i.anchor.x, i.anchor.y), r.width = i.width, r.height = i.height, r.scale = i.scale, r.position = t.center, r.angle = i.angle, r.alpha = n, r.tint = e, r.name = "eidolonPickerHighlight", r;
}
c(Gb, "createTintSprite");
let ri = null;
function fm(t) {
  var p, y, w;
  ri && ri.cancel();
  const { placeableType: e = "Tile", onPick: n, onCancel: i } = t;
  let r = null;
  const a = `control${e}`, o = `hover${e}`, s = /* @__PURE__ */ c((b, v) => {
    var T;
    if (!v) return;
    const E = b.document ?? b;
    (T = b.release) == null || T.call(b), n(E);
  }, "onControl"), l = /* @__PURE__ */ c((b, v) => {
    v ? (r = b, po(b, { mode: "pick" })) : r === b && (rr(b), r = null);
  }, "onHoverIn"), u = /* @__PURE__ */ c((b) => {
    b.key === "Escape" && (b.preventDefault(), b.stopPropagation(), h());
  }, "onKeydown"), d = /* @__PURE__ */ c((b) => {
    b.preventDefault(), h();
  }, "onContextMenu"), m = Hooks.on(a, s), f = Hooks.on(o, l);
  document.addEventListener("keydown", u, { capture: !0 }), (p = canvas.stage) == null || p.addEventListener("rightclick", d), (w = (y = ui.notifications) == null ? void 0 : y.info) == null || w.call(y, `Pick mode active — click a ${e.toLowerCase()} on the canvas, or press ESC to cancel.`, { permanent: !1 });
  function h() {
    var b;
    ri && (ri = null, Hooks.off(a, m), Hooks.off(o, f), document.removeEventListener("keydown", u, { capture: !0 }), (b = canvas.stage) == null || b.removeEventListener("rightclick", d), r && (rr(r), r = null), i == null || i());
  }
  return c(h, "cancel"), ri = { cancel: h }, { cancel: h };
}
c(fm, "enterPickMode");
function Tr() {
  ri && ri.cancel();
}
c(Tr, "cancelPickMode");
const zb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cancelPickMode: Tr,
  enterPickMode: fm
}, Symbol.toStringTag, { value: "Module" }));
var md, $e, Ge, oa, xn, sa, la, tt, $n, he, mm, rc, hm, gm, pm, ac, oc, ym, bm;
const mt = class mt extends Kn(Yn) {
  /**
   * @param {object} options
   * @param {string[]} [options.selections]  Initial selections
   * @param {string} [options.placeableType]  "Tile", "Token", etc.
   * @param {(selectors: string[]) => void} [options.onApply]
   * @param {() => void} [options.onCancel]
   */
  constructor(n = {}) {
    super(n);
    M(this, he);
    /** @type {string[]} Current selections (selector strings). */
    M(this, $e, []);
    /** @type {boolean} Whether pick mode is active. */
    M(this, Ge, !1);
    /** @type {string} Placeable type (Tile, Token, etc.). */
    M(this, oa, "Tile");
    /** @type {string} Current tag match mode. */
    M(this, xn, "any");
    /** @type {((selectors: string[]) => void) | null} */
    M(this, sa, null);
    /** @type {(() => void) | null} */
    M(this, la, null);
    /** @type {Promise resolve function for the open() API. */
    M(this, tt, null);
    /** @type {PlaceableObject | null} Currently hovered tile in the browser. */
    M(this, $n, null);
    I(this, $e, [...n.selections ?? []]), I(this, oa, n.placeableType ?? "Tile"), I(this, sa, n.onApply ?? null), I(this, la, n.onCancel ?? null);
  }
  // ── Context ───────────────────────────────────────────────────────────
  async _prepareContext() {
    var r;
    const n = S(this, he, ac).call(this), i = (((r = canvas.tiles) == null ? void 0 : r.placeables) ?? []).map((a, o) => {
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
      selections: g(this, $e),
      selectionCount: g(this, $e).length,
      pickModeActive: g(this, Ge),
      tagModeIsAny: g(this, xn) === "any",
      tagModeIsAll: g(this, xn) === "all",
      tagPreviewCount: 0,
      tiles: i,
      tileCount: i.length
    };
  }
  // ── Render & Events ───────────────────────────────────────────────────
  _onRender(n, i) {
    super._onRender(n, i), S(this, he, mm).call(this), S(this, he, oc).call(this);
  }
  async _onClose(n) {
    return g(this, Ge) && (Tr(), I(this, Ge, !1)), ja(), g(this, tt) && (g(this, tt).call(this, null), I(this, tt, null)), super._onClose(n);
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
      I(r, tt, i), r.render(!0);
    });
  }
};
$e = new WeakMap(), Ge = new WeakMap(), oa = new WeakMap(), xn = new WeakMap(), sa = new WeakMap(), la = new WeakMap(), tt = new WeakMap(), $n = new WeakMap(), he = new WeakSet(), mm = /* @__PURE__ */ c(function() {
  var a, o, s, l;
  const n = this.element;
  if (!(n instanceof HTMLElement)) return;
  const i = n.querySelector("[data-role='tag-input']"), r = n.querySelector("[data-role='tag-mode']");
  r == null || r.addEventListener("change", (u) => {
    I(this, xn, u.target.value);
  }), i == null || i.addEventListener("input", () => {
    S(this, he, hm).call(this, n);
  }), i == null || i.addEventListener("keydown", (u) => {
    u.key === "Enter" && (u.preventDefault(), S(this, he, rc).call(this, n));
  }), (a = n.querySelector("[data-action='add-tag-selector']")) == null || a.addEventListener("click", () => {
    S(this, he, rc).call(this, n);
  }), (o = n.querySelector("[data-action='toggle-pick-mode']")) == null || o.addEventListener("click", () => {
    g(this, Ge) ? (Tr(), I(this, Ge, !1)) : (I(this, Ge, !0), fm({
      placeableType: g(this, oa),
      onPick: /* @__PURE__ */ c((u) => {
        S(this, he, gm).call(this, u.id);
      }, "onPick"),
      onCancel: /* @__PURE__ */ c(() => {
        I(this, Ge, !1), this.render({ force: !0 });
      }, "onCancel")
    })), this.render({ force: !0 });
  }), n.querySelectorAll("[data-action='toggle-tile']").forEach((u) => {
    u.addEventListener("click", () => {
      const d = u.dataset.docId;
      d && S(this, he, pm).call(this, d);
    }), u.addEventListener("mouseenter", () => {
      var f, h;
      const d = u.dataset.docId;
      if (!d) return;
      const m = (h = (f = canvas.tiles) == null ? void 0 : f.placeables) == null ? void 0 : h.find((p) => p.document.id === d);
      m && (I(this, $n, m), po(m, { mode: "hover" }));
    }), u.addEventListener("mouseleave", () => {
      g(this, $n) && (rr(g(this, $n)), I(this, $n, null), S(this, he, oc).call(this));
    });
  }), n.querySelectorAll("[data-action='remove-selection']").forEach((u) => {
    u.addEventListener("click", () => {
      const d = Number(u.dataset.selectionIndex);
      Number.isNaN(d) || (g(this, $e).splice(d, 1), this.render({ force: !0 }));
    });
  }), (s = n.querySelector("[data-action='apply']")) == null || s.addEventListener("click", () => {
    S(this, he, ym).call(this);
  }), (l = n.querySelector("[data-action='cancel']")) == null || l.addEventListener("click", () => {
    S(this, he, bm).call(this);
  });
}, "#bindEvents"), // ── Tag helpers ───────────────────────────────────────────────────────
rc = /* @__PURE__ */ c(function(n) {
  var s;
  const i = n.querySelector("[data-role='tag-input']"), r = (s = i == null ? void 0 : i.value) == null ? void 0 : s.trim();
  if (!r) return;
  const a = r.split(",").map((l) => l.trim()).filter(Boolean);
  if (a.length === 0) return;
  const o = em(a, g(this, xn));
  o && !g(this, $e).includes(o) && g(this, $e).push(o), i && (i.value = ""), this.render({ force: !0 });
}, "#addTagSelector"), hm = /* @__PURE__ */ c(function(n) {
  var m, f;
  const i = n.querySelector("[data-role='tag-input']"), r = n.querySelector("[data-role='tag-preview']");
  if (!i || !r) return;
  const a = i.value.trim();
  if (!a) {
    r.textContent = "";
    return;
  }
  const o = a.split(",").map((h) => h.trim()).filter(Boolean);
  if (o.length === 0) {
    r.textContent = "";
    return;
  }
  const s = window.Tagger ?? ((m = game.modules.get("tagger")) == null ? void 0 : m.api);
  if (!s) {
    r.textContent = "Tagger not available";
    return;
  }
  const l = g(this, xn) === "any", u = s.getByTag(o, {
    sceneId: (f = canvas.scene) == null ? void 0 : f.id,
    matchAny: l
  }), d = (u == null ? void 0 : u.length) ?? 0;
  r.textContent = `${d} matching placeable(s)`;
}, "#updateTagPreview"), // ── ID selector helpers ──────────────────────────────────────────────
gm = /* @__PURE__ */ c(function(n) {
  const i = `id:${n}`;
  g(this, $e).includes(i) || (g(this, $e).push(i), this.render({ force: !0 }));
}, "#addIdSelector"), pm = /* @__PURE__ */ c(function(n) {
  const i = `id:${n}`, r = g(this, $e).indexOf(i);
  r >= 0 ? g(this, $e).splice(r, 1) : g(this, $e).push(i), this.render({ force: !0 });
}, "#toggleIdSelector"), /**
 * Get the set of document IDs that are currently selected across all selector types.
 * Resolves tag/tags-any/tags-all selectors to find matching document IDs.
 * @returns {Set<string>}
 */
ac = /* @__PURE__ */ c(function() {
  const n = /* @__PURE__ */ new Set();
  for (const i of g(this, $e)) {
    const r = Rc(i);
    if (r.type === "id") {
      n.add(r.value);
      continue;
    }
    const a = bs(i);
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
oc = /* @__PURE__ */ c(function() {
  var r, a;
  const n = S(this, he, ac).call(this), i = ((r = canvas.tiles) == null ? void 0 : r.placeables) ?? [];
  for (const o of i) {
    const s = (a = o.document) == null ? void 0 : a.id;
    if (!s) continue;
    const l = n.has(s), u = o === g(this, $n), d = dm(o);
    l && !u && !d ? po(o, { mode: "selected" }) : !l && d && !u && rr(o);
  }
}, "#refreshSelectionHighlights"), // ── Apply / Cancel ──────────────────────────────────────────────────
ym = /* @__PURE__ */ c(function() {
  var i;
  g(this, Ge) && (Tr(), I(this, Ge, !1)), ja();
  const n = [...g(this, $e)];
  (i = g(this, sa)) == null || i.call(this, n), g(this, tt) && (g(this, tt).call(this, n), I(this, tt, null)), this.close({ force: !0 });
}, "#doApply"), bm = /* @__PURE__ */ c(function() {
  var n;
  g(this, Ge) && (Tr(), I(this, Ge, !1)), ja(), (n = g(this, la)) == null || n.call(this), g(this, tt) && (g(this, tt).call(this, null), I(this, tt, null)), this.close({ force: !0 });
}, "#doCancel"), c(mt, "PlaceablePickerApplication"), ve(mt, "APP_ID", `${L}-placeable-picker`), ve(mt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  qe(mt, mt, "DEFAULT_OPTIONS"),
  {
    id: mt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((md = qe(mt, mt, "DEFAULT_OPTIONS")) == null ? void 0 : md.classes) ?? [], "eidolon-placeable-picker-window", "themed"])
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
)), ve(mt, "PARTS", {
  content: {
    template: `modules/${L}/templates/placeable-picker.html`
  }
});
let yo = mt;
function Yb(t, e) {
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
      const a = e.getEntryAtPath(e.selectedPath), o = ((d = (u = a == null ? void 0 : a.tweens) == null ? void 0 : u[i]) == null ? void 0 : d.target) ?? "", s = o ? [o] : [], l = await yo.open({ selections: s });
      if (l && l.length > 0) {
        if (r.type === "timeline")
          e.mutate((m) => m.updateTween(r.index, i, { target: l[0] }));
        else if (r.type === "branch") {
          const m = (a.tweens ?? []).map((f, h) => h === i ? { ...f, target: l[0] } : f);
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
          const l = om[s], u = { type: s };
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
c(Yb, "bindTweenFieldEvents");
function Kb(t, e) {
  var i, r, a, o, s, l, u, d, m, f;
  function n(h, p, y) {
    h.type === "timeline" ? e.mutate((w) => w.updateEntry(h.index, { sound: y })) : h.type === "branch" && e.mutate((w) => w.updateBranchEntry(h.index, h.branchIndex, h.branchEntryIndex, { sound: y }));
  }
  c(n, "applySoundPatch"), (i = t.querySelector("[data-action='change-sound-src']")) == null || i.addEventListener("change", async (h) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = e.getEntryAtPath(e.selectedPath);
    if (!(y != null && y.sound)) return;
    const w = h.target.value, b = { ...y.sound, src: w };
    b.id || (b.id = Hu(w));
    const v = await qu(w);
    v > 0 && (b.duration = v), n(p, y, b);
  }), (r = t.querySelector("[data-action='pick-sound-src']")) == null || r.addEventListener("click", () => {
    const h = e.parseEntryPath(e.selectedPath);
    if (!h) return;
    const p = e.getEntryAtPath(e.selectedPath);
    if (!(p != null && p.sound)) return;
    new FilePicker({
      type: "audio",
      current: p.sound.src || "",
      callback: /* @__PURE__ */ c(async (w) => {
        const b = { ...p.sound, src: w };
        b.id || (b.id = Hu(w));
        const v = await qu(w);
        v > 0 && (b.duration = v), n(h, p, b);
      }, "callback")
    }).render(!0);
  }), (a = t.querySelector("[data-action='change-sound-id']")) == null || a.addEventListener("change", (h) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = e.getEntryAtPath(e.selectedPath);
    y != null && y.sound && n(p, y, { ...y.sound, id: h.target.value || void 0 });
  }), (o = t.querySelector("[data-action='change-sound-volume']")) == null || o.addEventListener("input", (h) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = e.getEntryAtPath(e.selectedPath);
    y != null && y.sound && n(p, y, { ...y.sound, volume: Number(h.target.value) || 0.8 });
  }), (s = t.querySelector("[data-action='change-sound-loop']")) == null || s.addEventListener("change", (h) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = e.getEntryAtPath(e.selectedPath);
    y != null && y.sound && n(p, y, { ...y.sound, loop: h.target.checked });
  }), (l = t.querySelector("[data-action='change-sound-fadein']")) == null || l.addEventListener("change", (h) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = e.getEntryAtPath(e.selectedPath);
    y != null && y.sound && n(p, y, { ...y.sound, fadeIn: Number(h.target.value) || void 0 });
  }), (u = t.querySelector("[data-action='change-sound-fadeout']")) == null || u.addEventListener("change", (h) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = e.getEntryAtPath(e.selectedPath);
    y != null && y.sound && n(p, y, { ...y.sound, fadeOut: Number(h.target.value) || void 0 });
  }), (d = t.querySelector("[data-action='change-sound-duration']")) == null || d.addEventListener("change", (h) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = e.getEntryAtPath(e.selectedPath);
    y != null && y.sound && n(p, y, { ...y.sound, duration: Number(h.target.value) || 0 });
  }), (m = t.querySelector("[data-action='change-sound-fireandforget']")) == null || m.addEventListener("change", (h) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = e.getEntryAtPath(e.selectedPath);
    y != null && y.sound && n(p, y, { ...y.sound, fireAndForget: h.target.checked });
  }), (f = t.querySelector("[data-action='change-stopsound-id']")) == null || f.addEventListener("change", (h) => {
    const p = e.parseEntryPath(e.selectedPath);
    p && (p.type === "timeline" ? e.mutate((y) => y.updateEntry(p.index, { stopSound: h.target.value })) : p.type === "branch" && e.mutate((y) => y.updateBranchEntry(p.index, p.branchIndex, p.branchEntryIndex, { stopSound: h.target.value })));
  });
}
c(Kb, "bindSoundFieldEvents");
function Jb(t, e) {
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
    Bb({ selectedPath: e.selectedPath, state: e.state, mutate: e.mutate });
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
c(Jb, "bindSpecialEntryEvents");
function Xb(t, e) {
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
c(Xb, "bindSegmentGraphEvents");
function Qb(t, e) {
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
    const { enterPickMode: d } = await Promise.resolve().then(() => zb);
    d({
      placeableType: "Tile",
      onPick: /* @__PURE__ */ c((f) => {
        var y, w;
        const h = (w = (y = f.flags) == null ? void 0 : y.tagger) == null ? void 0 : w.tags, p = h != null && h.length ? `tag:${h[0]}` : `id:${f.id}`;
        e.setSegmentGate({ ...u, target: p });
      }, "onPick")
    });
  });
  for (const [u, d] of [["change-gate-anim-idle", "idle"], ["change-gate-anim-hover", "hover"], ["change-gate-anim-dim", "dim"]])
    (a = t.querySelector(`[data-action='${u}']`)) == null || a.addEventListener("change", (m) => {
      var b;
      const f = (b = e.state.activeSegment) == null ? void 0 : b.gate;
      if (!f) return;
      const h = m.target.value.trim(), p = h ? h.split(",").map((v) => v.trim()).filter(Boolean) : void 0, y = { ...f.animation ?? {} };
      p != null && p.length ? y[d] = p.length === 1 ? p[0] : p : delete y[d];
      const w = { ...f, animation: Object.keys(y).length ? y : void 0 };
      w.animation || delete w.animation, e.setSegmentGate(w);
    });
  (o = t.querySelector("[data-action='change-segment-next']")) == null || o.addEventListener("change", (u) => {
    const d = u.target.value;
    e.setSegmentNext(d || null);
  }), (s = t.querySelector("[data-action='edit-segment-setup']")) == null || s.addEventListener("click", () => {
    mo("setup", { state: e.state, mutate: e.mutate });
  }), (l = t.querySelector("[data-action='edit-segment-landing']")) == null || l.addEventListener("click", () => {
    mo("landing", { state: e.state, mutate: e.mutate });
  });
}
c(Qb, "bindSegmentDetailEvents");
var hd, ze, z, nt, Nn, Mt, it, Ye, es, Pe, rt, ts, dn, er, pt, vi, Fn, wi, U, vm, wm, Em, Cm, Sn, lc, cc, uc, dc, Sm, Tn, fc, Tm, Lm, Im, km, Om, mc, Lr;
const It = class It extends Kn(Yn) {
  constructor(n = {}) {
    super(n);
    M(this, U);
    M(this, ze, null);
    M(this, z, null);
    M(this, nt, null);
    M(this, Nn, /* @__PURE__ */ new Set());
    M(this, Mt, !1);
    M(this, it, null);
    M(this, Ye, null);
    M(this, es, 120);
    M(this, Pe, []);
    M(this, rt, -1);
    M(this, ts, 50);
    M(this, dn, null);
    M(this, er, null);
    M(this, pt, null);
    M(this, vi, null);
    M(this, Fn, null);
    M(this, wi, null);
    I(this, ze, n.scene ?? canvas.scene ?? null), I(this, z, Xt.fromScene(g(this, ze)));
  }
  // ── Context ───────────────────────────────────────────────────────────
  async _prepareContext() {
    var h, p;
    const n = Ob(g(this, z), g(this, z).activeSegmentName), i = Ib(g(this, z).timeline, {
      selectedPath: g(this, nt),
      windowWidth: ((h = this.position) == null ? void 0 : h.width) ?? 1100
    }), r = g(this, nt) != null ? Hb(g(this, nt), { state: g(this, z), expandedTweens: g(this, Nn) }) : null, a = g(this, z).listCinematicNames(), o = g(this, z).activeCinematicName, l = g(this, z).listSegmentNames().length > 1, u = g(this, z).activeSegment, d = (u == null ? void 0 : u.gate) ?? null, m = (u == null ? void 0 : u.next) ?? null, f = typeof m == "string" ? m : (m == null ? void 0 : m.segment) ?? null;
    return {
      // Toolbar
      sceneName: ((p = g(this, ze)) == null ? void 0 : p.name) ?? "No scene",
      dirty: g(this, Mt),
      canUndo: g(this, U, lc),
      canRedo: g(this, U, cc),
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
      activeSegmentName: g(this, z).activeSegmentName,
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
      trigger: g(this, z).trigger,
      tracking: g(this, z).tracking,
      synchronized: g(this, z).synchronized,
      triggerOptions: bb.map((y) => ({
        ...y,
        selected: y.value === g(this, z).trigger
      })),
      entryCount: g(this, z).timeline.length,
      totalDuration: i.totalDurationMs,
      targetCount: Ab(g(this, z)),
      setupCount: Object.keys(g(this, z).setup ?? {}).length,
      landingCount: Object.keys(g(this, z).landing ?? {}).length
    };
  }
  // ── Render & Events ───────────────────────────────────────────────────
  _onRender(n, i) {
    var r, a, o;
    if (super._onRender(n, i), S(this, U, vm).call(this), !g(this, vi)) {
      const s = (a = (r = game.modules.get(L)) == null ? void 0 : r.api) == null ? void 0 : a.cinematic;
      s != null && s.onPlaybackProgress ? (I(this, vi, s.onPlaybackProgress((l) => S(this, U, Om).call(this, l))), console.log("[cinematic-editor] Subscribed to playback progress events")) : console.warn("[cinematic-editor] onPlaybackProgress not available on API", s);
    }
    if (g(this, wi) && ((o = this.element) == null || o.querySelectorAll(".cinematic-editor__segment-node").forEach((s) => {
      s.classList.toggle("cinematic-editor__segment-node--playing", s.dataset.segmentName === g(this, wi));
    }), g(this, pt) && g(this, pt).segmentName === g(this, z).activeSegmentName)) {
      const s = performance.now() - g(this, pt).startTime;
      g(this, pt).durationMs - s > 0 && S(this, U, mc).call(this, g(this, pt).durationMs, g(this, pt).startTime);
    }
    g(this, dn) || (I(this, dn, (s) => {
      !s.ctrlKey && !s.metaKey || (s.key === "z" && !s.shiftKey ? (s.preventDefault(), S(this, U, uc).call(this)) : (s.key === "z" && s.shiftKey || s.key === "y") && (s.preventDefault(), S(this, U, dc).call(this)));
    }), document.addEventListener("keydown", g(this, dn)));
  }
  async close(n = {}) {
    if (g(this, Ye) && S(this, U, Tn).call(this), g(this, Mt) && !n.force) {
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
      i === "save" && await S(this, U, fc).call(this);
    }
    return super.close(n);
  }
  async _onClose(n) {
    var i;
    return g(this, it) !== null && (clearTimeout(g(this, it)), I(this, it, null)), g(this, dn) && (document.removeEventListener("keydown", g(this, dn)), I(this, dn, null)), (i = g(this, vi)) == null || i.call(this), I(this, vi, null), S(this, U, Lr).call(this), super._onClose(n);
  }
};
ze = new WeakMap(), z = new WeakMap(), nt = new WeakMap(), Nn = new WeakMap(), Mt = new WeakMap(), it = new WeakMap(), Ye = new WeakMap(), es = new WeakMap(), Pe = new WeakMap(), rt = new WeakMap(), ts = new WeakMap(), dn = new WeakMap(), er = new WeakMap(), pt = new WeakMap(), vi = new WeakMap(), Fn = new WeakMap(), wi = new WeakMap(), U = new WeakSet(), // ── Event binding ─────────────────────────────────────────────────────
vm = /* @__PURE__ */ c(function() {
  const n = this.element;
  if (!(n instanceof HTMLElement)) return;
  const i = S(this, U, wm).call(this);
  jb(n, i), Ub(n, i), Xb(n, i), Vb(n, i), Wb(n, i), Yb(n, i), Kb(n, i), Jb(n, i), Qb(n, i);
}, "#bindEvents"), wm = /* @__PURE__ */ c(function() {
  const n = this;
  return {
    // State access (read-only getters — closures over `self` for private field access)
    get state() {
      return g(n, z);
    },
    get selectedPath() {
      return g(n, nt);
    },
    get scene() {
      return g(n, ze);
    },
    get expandedTweens() {
      return g(n, Nn);
    },
    get insertMenuState() {
      return g(n, er);
    },
    // Mutations
    mutate: /* @__PURE__ */ c((i) => S(this, U, Sn).call(this, i), "mutate"),
    setSelectedPath: /* @__PURE__ */ c((i) => {
      I(this, nt, i), this.render({ force: !0 });
    }, "setSelectedPath"),
    render: /* @__PURE__ */ c(() => this.render({ force: !0 }), "render"),
    // Cinematic switching (needs full state swap + clear)
    switchCinematic: /* @__PURE__ */ c((i) => {
      g(this, Ye) && S(this, U, Tn).call(this), I(this, z, g(this, z).switchCinematic(i)), I(this, nt, null), g(this, Nn).clear(), this.render({ force: !0 });
    }, "switchCinematic"),
    // Segment management
    selectSegment: /* @__PURE__ */ c((i) => {
      g(this, Ye) && S(this, U, Tn).call(this), I(this, z, g(this, z).switchSegment(i)), I(this, nt, null), g(this, Nn).clear(), this.render({ force: !0 });
    }, "selectSegment"),
    addSegment: /* @__PURE__ */ c((i) => {
      S(this, U, Sn).call(this, (r) => r.addSegment(i, r.activeSegmentName));
    }, "addSegment"),
    removeSegment: /* @__PURE__ */ c((i) => {
      S(this, U, Sn).call(this, (r) => r.removeSegment(i));
    }, "removeSegment"),
    renameSegment: /* @__PURE__ */ c((i, r) => {
      S(this, U, Sn).call(this, (a) => a.renameSegment(i, r));
    }, "renameSegment"),
    setSegmentGate: /* @__PURE__ */ c((i) => {
      S(this, U, Sn).call(this, (r) => r.setSegmentGate(i));
    }, "setSegmentGate"),
    setSegmentNext: /* @__PURE__ */ c((i) => {
      S(this, U, Sn).call(this, (r) => r.setSegmentNext(i));
    }, "setSegmentNext"),
    // Tween debouncing
    queueTweenChange: /* @__PURE__ */ c((i, r) => S(this, U, Sm).call(this, i, r), "queueTweenChange"),
    flushTweenChanges: /* @__PURE__ */ c(() => {
      g(this, Ye) && S(this, U, Tn).call(this);
    }, "flushTweenChanges"),
    flushTweenChangesImmediate: /* @__PURE__ */ c(() => {
      g(this, it) !== null && clearTimeout(g(this, it)), I(this, it, null), S(this, U, Tn).call(this);
    }, "flushTweenChangesImmediate"),
    // Path utilities
    parseEntryPath: Wn,
    getEntryAtPath: /* @__PURE__ */ c((i) => fo(i, g(this, z)), "getEntryAtPath"),
    // Insert menu
    showInsertMenu: /* @__PURE__ */ c((i, r, a) => S(this, U, Em).call(this, i, r, a), "showInsertMenu"),
    hideInsertMenu: /* @__PURE__ */ c(() => S(this, U, Cm).call(this), "hideInsertMenu"),
    // Toolbar actions
    save: /* @__PURE__ */ c(() => S(this, U, fc).call(this), "save"),
    play: /* @__PURE__ */ c(() => S(this, U, Tm).call(this), "play"),
    resetTracking: /* @__PURE__ */ c(() => S(this, U, Lm).call(this), "resetTracking"),
    exportJSON: /* @__PURE__ */ c(() => S(this, U, Im).call(this), "exportJSON"),
    validate: /* @__PURE__ */ c(() => S(this, U, km).call(this), "validate"),
    importJSON: /* @__PURE__ */ c(() => qb({ state: g(this, z), mutate: /* @__PURE__ */ c((i) => S(this, U, Sn).call(this, i), "mutate") }), "importJSON"),
    undo: /* @__PURE__ */ c(() => S(this, U, uc).call(this), "undo"),
    redo: /* @__PURE__ */ c(() => S(this, U, dc).call(this), "redo")
  };
}, "#createEventContext"), // ── Insert menu ───────────────────────────────────────────────────────
Em = /* @__PURE__ */ c(function(n, i, r) {
  var l;
  const a = (l = this.element) == null ? void 0 : l.querySelector(".cinematic-editor__insert-menu");
  if (!a) return;
  const o = n.getBoundingClientRect();
  document.body.appendChild(a), a.style.display = "", a.style.position = "fixed", a.style.left = `${o.left}px`;
  const s = a.offsetHeight || 200;
  o.bottom + 4 + s > window.innerHeight ? a.style.top = `${o.top - s - 4}px` : a.style.top = `${o.bottom + 4}px`, I(this, er, { insertIndex: i, lane: r });
}, "#showInsertMenu"), Cm = /* @__PURE__ */ c(function() {
  var i, r;
  const n = document.body.querySelector(".cinematic-editor__insert-menu") ?? ((i = this.element) == null ? void 0 : i.querySelector(".cinematic-editor__insert-menu"));
  if (n) {
    n.style.display = "none";
    const a = (r = this.element) == null ? void 0 : r.querySelector(".cinematic-editor");
    a && n.parentNode !== a && a.appendChild(n);
  }
  I(this, er, null);
}, "#hideInsertMenu"), // ── State mutation ────────────────────────────────────────────────────
Sn = /* @__PURE__ */ c(function(n) {
  I(this, Pe, g(this, Pe).slice(0, g(this, rt) + 1)), g(this, Pe).push(g(this, z)), g(this, Pe).length > g(this, ts) && g(this, Pe).shift(), I(this, rt, g(this, Pe).length - 1), I(this, z, n(g(this, z))), I(this, Mt, !0), this.render({ force: !0 });
}, "#mutate"), lc = /* @__PURE__ */ c(function() {
  return g(this, rt) >= 0;
}, "#canUndo"), cc = /* @__PURE__ */ c(function() {
  return g(this, rt) < g(this, Pe).length - 1;
}, "#canRedo"), uc = /* @__PURE__ */ c(function() {
  g(this, U, lc) && (g(this, rt) === g(this, Pe).length - 1 && g(this, Pe).push(g(this, z)), I(this, z, g(this, Pe)[g(this, rt)]), Ls(this, rt)._--, I(this, Mt, !0), this.render({ force: !0 }));
}, "#undo"), dc = /* @__PURE__ */ c(function() {
  g(this, U, cc) && (Ls(this, rt)._++, I(this, z, g(this, Pe)[g(this, rt) + 1]), I(this, Mt, !0), this.render({ force: !0 }));
}, "#redo"), Sm = /* @__PURE__ */ c(function(n, i) {
  var r;
  g(this, nt) != null && (I(this, Ye, {
    ...g(this, Ye) ?? {},
    entryPath: g(this, nt),
    tweenIndex: n,
    patch: { ...((r = g(this, Ye)) == null ? void 0 : r.patch) ?? {}, ...i }
  }), g(this, it) !== null && clearTimeout(g(this, it)), I(this, it, setTimeout(() => {
    I(this, it, null), S(this, U, Tn).call(this);
  }, g(this, es))));
}, "#queueTweenChange"), Tn = /* @__PURE__ */ c(function() {
  if (!g(this, Ye)) return;
  const { entryPath: n, tweenIndex: i, patch: r } = g(this, Ye);
  I(this, Ye, null);
  const a = Wn(n);
  if (a) {
    if (a.type === "timeline")
      I(this, z, g(this, z).updateTween(a.index, i, r));
    else if (a.type === "branch") {
      const o = fo(n, g(this, z));
      if (o) {
        const s = (o.tweens ?? []).map((l, u) => u === i ? { ...l, ...r } : l);
        I(this, z, g(this, z).updateBranchEntry(a.index, a.branchIndex, a.branchEntryIndex, { tweens: s }));
      }
    }
    I(this, Mt, !0);
  }
}, "#flushTweenChanges"), fc = /* @__PURE__ */ c(async function() {
  var n, i, r, a, o, s;
  if (g(this, ze)) {
    if (g(this, Ye) && S(this, U, Tn).call(this), g(this, z).isStale(g(this, ze))) {
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
        I(this, z, Xt.fromScene(g(this, ze), g(this, z).activeCinematicName)), I(this, Mt, !1), I(this, Pe, []), I(this, rt, -1), this.render({ force: !0 }), (i = (n = ui.notifications) == null ? void 0 : n.info) == null || i.call(n, "Cinematic reloaded from scene.");
        return;
      }
      if (!l) return;
    }
    try {
      await g(this, z).save(g(this, ze)), I(this, z, Xt.fromScene(g(this, ze), g(this, z).activeCinematicName)), I(this, Mt, !1), (a = (r = ui.notifications) == null ? void 0 : r.info) == null || a.call(r, "Cinematic saved."), this.render({ force: !0 });
    } catch (l) {
      console.error(`${L} | Cinematic save failed`, l), (s = (o = ui.notifications) == null ? void 0 : o.error) == null || s.call(o, "Failed to save cinematic data.");
    }
  }
}, "#onSave"), Tm = /* @__PURE__ */ c(async function() {
  var i, r, a, o, s;
  const n = (r = (i = game.modules.get(L)) == null ? void 0 : i.api) == null ? void 0 : r.cinematic;
  if (!(n != null && n.play)) {
    (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, "Cinematic API not available.");
    return;
  }
  await n.play((s = g(this, ze)) == null ? void 0 : s.id, g(this, z).activeCinematicName);
}, "#onPlay"), Lm = /* @__PURE__ */ c(async function() {
  var i, r, a, o, s;
  const n = (r = (i = game.modules.get(L)) == null ? void 0 : i.api) == null ? void 0 : r.cinematic;
  n != null && n.reset && (await n.reset((a = g(this, ze)) == null ? void 0 : a.id, g(this, z).activeCinematicName), (s = (o = ui.notifications) == null ? void 0 : o.info) == null || s.call(o, "Cinematic tracking reset."));
}, "#onResetTracking"), Im = /* @__PURE__ */ c(async function() {
  var i, r;
  const n = JSON.stringify(g(this, z).toJSON(), null, 2);
  try {
    await navigator.clipboard.writeText(n), (r = (i = ui.notifications) == null ? void 0 : i.info) == null || r.call(i, "Cinematic JSON copied to clipboard.");
  } catch {
    new Dialog({
      title: "Cinematic JSON",
      content: `<textarea style="width:100%;height:300px;font-family:monospace;font-size:0.8rem">${Pt(n)}</textarea>`,
      buttons: { ok: { label: "Close" } }
    }).render(!0);
  }
}, "#onExportJSON"), km = /* @__PURE__ */ c(function() {
  var l, u;
  const n = g(this, z).toJSON(), { targets: i, unresolved: r } = uo(n), a = yb(n, i), o = [
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
Om = /* @__PURE__ */ c(function(n) {
  var i, r, a, o, s, l;
  switch (console.log(`[cinematic-editor] playback event: ${n.type}`, n), n.type) {
    case "segment-start":
      I(this, wi, n.segmentName), n.segmentName !== g(this, z).activeSegmentName ? (I(this, z, g(this, z).switchSegment(n.segmentName)), I(this, nt, null), g(this, Nn).clear(), this.render({ force: !0 })) : (i = this.element) == null || i.querySelectorAll(".cinematic-editor__segment-node").forEach((u) => {
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
      I(this, pt, { segmentName: n.segmentName, startTime: performance.now(), durationMs: n.durationMs }), n.segmentName === g(this, z).activeSegmentName && S(this, U, mc).call(this, n.durationMs);
      break;
    case "timeline-end":
      S(this, U, Lr).call(this), I(this, pt, null);
      break;
    case "playback-end":
      S(this, U, Lr).call(this), I(this, pt, null), I(this, wi, null), (l = this.element) == null || l.querySelectorAll(".cinematic-editor__segment-node--playing, .cinematic-editor__segment-node--gate-waiting").forEach((u) => {
        u.classList.remove("cinematic-editor__segment-node--playing", "cinematic-editor__segment-node--gate-waiting");
      });
      break;
  }
}, "#onPlaybackEvent"), mc = /* @__PURE__ */ c(function(n, i = null) {
  var u, d;
  S(this, U, Lr).call(this);
  const r = (u = this.element) == null ? void 0 : u.querySelector(".cinematic-editor__playback-cursor"), a = (d = this.element) == null ? void 0 : d.querySelector(".cinematic-editor__swimlane");
  if (console.log(`[cinematic-editor] startCursor: duration=${n}, cursor=${!!r}, swimlane=${!!a}, width=${a == null ? void 0 : a.scrollWidth}`), !r || !a || n <= 0) return;
  r.style.display = "block";
  const o = i ?? performance.now(), s = a.scrollWidth, l = /* @__PURE__ */ c(() => {
    const m = performance.now() - o, f = Math.min(m / n, 1), h = Br + f * (s - Br);
    r.style.left = `${h}px`, f < 1 && I(this, Fn, requestAnimationFrame(l));
  }, "tick");
  I(this, Fn, requestAnimationFrame(l));
}, "#startCursorAnimation"), Lr = /* @__PURE__ */ c(function() {
  var i;
  g(this, Fn) && (cancelAnimationFrame(g(this, Fn)), I(this, Fn, null));
  const n = (i = this.element) == null ? void 0 : i.querySelector(".cinematic-editor__playback-cursor");
  n && (n.style.display = "none");
}, "#stopCursorAnimation"), c(It, "CinematicEditorApplication"), ve(It, "APP_ID", `${L}-cinematic-editor`), ve(It, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  qe(It, It, "DEFAULT_OPTIONS"),
  {
    id: It.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((hd = qe(It, It, "DEFAULT_OPTIONS")) == null ? void 0 : hd.classes) ?? [], "eidolon-cinematic-editor-window", "themed"])
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
)), ve(It, "PARTS", {
  content: {
    template: `modules/${L}/templates/cinematic-editor.html`
  }
});
let sc = It;
const Am = /* @__PURE__ */ new Map();
function ge(t, e) {
  Am.set(t, e);
}
c(ge, "registerBehaviour");
function Ua(t) {
  return Am.get(t);
}
c(Ua, "getBehaviour");
function ue(t) {
  var e;
  return ((e = t.document) == null ? void 0 : e.documentName) === "Drawing" ? t.shape ?? null : t.mesh ? t.mesh : t.destroyed || !t.transform ? null : t;
}
c(ue, "getAnimationTarget");
function Zb(t, e, n) {
  let i, r, a;
  if (e === 0)
    i = r = a = n;
  else {
    const o = /* @__PURE__ */ c((u, d, m) => (m < 0 && (m += 1), m > 1 && (m -= 1), m < 0.16666666666666666 ? u + (d - u) * 6 * m : m < 0.5 ? d : m < 0.6666666666666666 ? u + (d - u) * (0.6666666666666666 - m) * 6 : u), "hue2rgb"), s = n < 0.5 ? n * (1 + e) : n + e - n * e, l = 2 * n - s;
    i = o(l, s, t + 1 / 3), r = o(l, s, t), a = o(l, s, t - 1 / 3);
  }
  return Math.round(i * 255) << 16 | Math.round(r * 255) << 8 | Math.round(a * 255);
}
c(Zb, "hslToInt");
ge("float", (t, e = {}) => {
  const n = ue(t);
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
ge("pulse", (t, e = {}) => {
  const n = ue(t);
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
ge("scale", (t, e = {}, n) => {
  var v, E, T, k, O, _;
  const i = ue(t);
  if (!i) return { update() {
  }, detach() {
  } };
  const r = e.factor ?? 1.12, a = e.durationFrames ?? 15, o = ot(e.easing ?? "easeOutCubic"), s = i.scale.x, l = i.scale.y, u = s * r, d = l * r, f = !(!!t.mesh || ((v = i.pivot) == null ? void 0 : v.x) || ((E = i.pivot) == null ? void 0 : E.y)), h = f ? (((k = (T = t.document) == null ? void 0 : T.shape) == null ? void 0 : k.width) ?? 0) / 2 : 0, p = f ? (((_ = (O = t.document) == null ? void 0 : O.shape) == null ? void 0 : _.height) ?? 0) / 2 : 0, y = (n == null ? void 0 : n.x) ?? i.position.x, w = (n == null ? void 0 : n.y) ?? i.position.y;
  let b = 0;
  return {
    update(N) {
      if (b < a) {
        b += N;
        const D = Math.min(b / a, 1), $ = o(D), F = s + (u - s) * $, A = l + (d - l) * $;
        i.scale.x = F, i.scale.y = A, f && (i.position.x = y - h * (F - s), i.position.y = w - p * (A - l));
      }
    },
    detach() {
      i.scale.x = s, i.scale.y = l, f && (i.position.x = y, i.position.y = w);
    }
  };
});
ge("glow", (t, e = {}) => {
  var y, w;
  const n = ue(t);
  if (!((y = n == null ? void 0 : n.texture) != null && y.baseTexture)) return { update() {
  }, detach() {
  } };
  const i = t.document, r = e.color ?? 4513279, a = e.alpha ?? 0.5, o = e.blur ?? 8, s = e.pulseSpeed ?? 0.03, l = Math.abs(i.width), u = Math.abs(i.height), d = PIXI.Sprite.from(n.texture);
  d.anchor.set(0.5, 0.5), d.scale.set(n.scale.x, n.scale.y), d.position.set(l / 2, u / 2), d.angle = i.rotation ?? 0, d.alpha = a, d.tint = r;
  const m = PIXI.BlurFilter ?? ((w = PIXI.filters) == null ? void 0 : w.BlurFilter), f = new m(o);
  d.filters = [f], t.addChildAt(d, 0);
  const h = n.angle;
  let p = 0;
  return {
    update(b) {
      p += b;
      const v = (Math.sin(p * s) + 1) / 2;
      d.visible = n.visible !== !1, d.alpha = a * (0.5 + 0.5 * v) * (n.alpha ?? 1), d.scale.set(n.scale.x, n.scale.y), d.angle = (i.rotation ?? 0) + (n.angle - h);
    },
    detach() {
      d.parent && d.parent.removeChild(d), d.destroy({ children: !0 });
    }
  };
});
ge("wobble", (t, e = {}) => {
  const n = ue(t);
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
ge("colorCycle", (t, e = {}) => {
  const n = ue(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.speed ?? 5e-3, r = e.saturation ?? 0.6, a = e.lightness ?? 0.6, o = n.tint;
  let s = 0;
  return {
    update(l) {
      s = (s + l * i) % 1, n.tint = Zb(s, r, a);
    },
    detach() {
      n.tint = o;
    }
  };
});
ge("spin", (t, e = {}) => {
  const n = ue(t);
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
ge("bounce", (t, e = {}) => {
  const n = ue(t);
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
ge("borderTrace", (t, e = {}) => {
  const n = ue(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), a = Math.abs(i.height), o = 2 * (r + a), s = e.speed ?? 1.5, l = e.length ?? 60, u = e.color ?? 4513279, d = e.alpha ?? 0.8, m = e.lineWidth ?? 2, f = new PIXI.Graphics();
  f.alpha = d, f.pivot.set(r / 2, a / 2), f.position.set(r / 2, a / 2), t.addChildAt(f, 0);
  const h = n.scale.x, p = n.scale.y, y = n.angle;
  let w = 0;
  function b(v) {
    return v = (v % o + o) % o, v < r ? { x: v, y: 0 } : (v -= r, v < a ? { x: r, y: v } : (v -= a, v < r ? { x: r - v, y: a } : (v -= r, { x: 0, y: a - v })));
  }
  return c(b, "perimeterPoint"), {
    update(v) {
      w = (w + v * s) % o, f.visible = n.visible !== !1, f.alpha = d * (n.alpha ?? 1), f.scale.set(n.scale.x / h, n.scale.y / p), f.angle = n.angle - y, f.clear(), f.lineStyle(m, u, 1);
      const E = 16, T = l / E, k = b(w);
      f.moveTo(k.x, k.y);
      for (let O = 1; O <= E; O++) {
        const _ = b(w + O * T);
        f.lineTo(_.x, _.y);
      }
    },
    detach() {
      f.parent && f.parent.removeChild(f), f.destroy({ children: !0 });
    }
  };
});
ge("shimmer", (t, e = {}) => {
  const n = ue(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), a = Math.abs(i.height), o = e.speed ?? 1, s = e.bandWidth ?? 40, l = e.alpha ?? 0.15, u = e.pause ?? 120, d = r + a + s, m = d + u * o, f = new PIXI.Container();
  f.pivot.set(r / 2, a / 2), f.position.set(r / 2, a / 2);
  const h = new PIXI.Graphics();
  h.alpha = l;
  const p = new PIXI.Graphics();
  p.beginFill(16777215), p.drawRect(0, 0, r, a), p.endFill(), f.addChild(p), h.mask = p, f.addChild(h), t.addChild(f);
  const y = n.scale.x, w = n.scale.y, b = n.angle;
  let v = 0;
  return {
    update(E) {
      if (v = (v + E * o) % m, f.visible = n.visible !== !1, f.scale.set(n.scale.x / y, n.scale.y / w), f.angle = n.angle - b, h.alpha = l * (n.alpha ?? 1), h.clear(), v < d) {
        const T = v - s;
        h.beginFill(16777215, 1), h.moveTo(T, 0), h.lineTo(T + s, 0), h.lineTo(T + s - a, a), h.lineTo(T - a, a), h.closePath(), h.endFill();
      }
    },
    detach() {
      h.mask = null, f.parent && f.parent.removeChild(f), f.destroy({ children: !0 });
    }
  };
});
ge("breathe", (t, e = {}) => {
  const n = ue(t);
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
ge("tiltFollow", (t, e = {}) => {
  const n = ue(t);
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
ge("slideReveal", (t, e = {}, n) => {
  const i = ue(t);
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
    update(h) {
      if (f += h, f < 0) return;
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
ge("embers", (t, e = {}) => {
  const n = ue(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), a = Math.abs(i.height), o = e.count ?? 12, s = e.speed ?? 0.5, l = e.color ?? 16737792, u = e.alpha ?? 0.6, d = e.size ?? 2, m = new PIXI.Container();
  m.pivot.set(r / 2, a / 2), m.position.set(r / 2, a / 2);
  const f = new PIXI.Graphics();
  m.addChild(f), t.addChild(m);
  const h = n.scale.x, p = n.scale.y, y = n.angle, w = [];
  function b() {
    const v = Math.random();
    let E, T;
    return v < 0.7 ? (E = Math.random() * r, T = a) : v < 0.85 ? (E = 0, T = a * 0.5 + Math.random() * a * 0.5) : (E = r, T = a * 0.5 + Math.random() * a * 0.5), {
      x: E,
      y: T,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -s * (0.5 + Math.random() * 0.5),
      life: 0,
      maxLife: 40 + Math.random() * 60,
      size: d * (0.5 + Math.random() * 0.5)
    };
  }
  return c(b, "spawnParticle"), {
    update(v) {
      m.visible = n.visible !== !1, m.scale.set(n.scale.x / h, n.scale.y / p), m.angle = n.angle - y, w.length < o && w.push(b());
      for (let E = w.length - 1; E >= 0; E--) {
        const T = w[E];
        if (T.life += v, T.life >= T.maxLife) {
          w.splice(E, 1);
          continue;
        }
        T.x += T.vx * v, T.y += T.vy * v, T.vx += (Math.random() - 0.5) * 0.05 * v;
      }
      f.clear();
      for (const E of w) {
        const T = 1 - E.life / E.maxLife;
        f.beginFill(l, u * T * (n.alpha ?? 1)), f.drawCircle(E.x, E.y, E.size), f.endFill();
      }
    },
    detach() {
      m.parent && m.parent.removeChild(m), m.destroy({ children: !0 });
    }
  };
});
ge("runeGlow", (t, e = {}) => {
  const n = ue(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), a = Math.abs(i.height), o = 2 * (r + a), s = e.dots ?? 3, l = e.speed ?? 1.2, u = e.color ?? 4513279, d = e.color2 ?? 8930559, m = e.radius ?? 3, f = e.alpha ?? 0.7, h = new PIXI.Graphics();
  h.pivot.set(r / 2, a / 2), h.position.set(r / 2, a / 2), t.addChildAt(h, 0);
  const p = n.scale.x, y = n.scale.y, w = n.angle, b = [];
  for (let T = 0; T < s; T++)
    b.push({
      phase: T / s * o,
      speedMul: 0.7 + Math.random() * 0.6,
      color: T % 2 === 0 ? u : d
    });
  function v(T) {
    return T = (T % o + o) % o, T < r ? { x: T, y: 0 } : (T -= r, T < a ? { x: r, y: T } : (T -= a, T < r ? { x: r - T, y: a } : (T -= r, { x: 0, y: a - T })));
  }
  c(v, "perimeterPoint");
  let E = 0;
  return {
    update(T) {
      E += T, h.visible = n.visible !== !1, h.alpha = f * (n.alpha ?? 1), h.scale.set(n.scale.x / p, n.scale.y / y), h.angle = n.angle - w, h.clear();
      for (const k of b) {
        const O = v(k.phase + E * l * k.speedMul);
        h.beginFill(k.color, 1), h.drawCircle(O.x, O.y, m), h.endFill();
      }
    },
    detach() {
      h.parent && h.parent.removeChild(h), h.destroy({ children: !0 });
    }
  };
});
ge("ripple", (t, e = {}) => {
  const n = ue(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), a = Math.abs(i.height), o = e.maxRadius ?? Math.sqrt(r * r + a * a) / 2, s = e.rings ?? 3, l = e.interval ?? 30, u = e.speed ?? 1.5, d = e.color ?? 4513279, m = e.alpha ?? 0.4, f = e.lineWidth ?? 1.5, h = new PIXI.Container();
  h.pivot.set(r / 2, a / 2), h.position.set(r / 2, a / 2);
  const p = new PIXI.Graphics();
  h.addChild(p), t.addChild(h);
  const y = n.scale.x, w = n.scale.y, b = n.angle, v = [];
  let E = 0, T = 0;
  return {
    update(k) {
      E += k, h.visible = n.visible !== !1, h.scale.set(n.scale.x / y, n.scale.y / w), h.angle = n.angle - b, E >= T && v.length < s && (v.push({ radius: 0, alpha: m }), T = E + l);
      for (let N = v.length - 1; N >= 0; N--) {
        const D = v[N];
        D.radius += u * k, D.alpha = m * (1 - D.radius / o), D.radius >= o && v.splice(N, 1);
      }
      p.clear();
      const O = r / 2, _ = a / 2;
      for (const N of v)
        p.lineStyle(f, d, N.alpha * (n.alpha ?? 1)), p.drawCircle(O, _, N.radius);
    },
    detach() {
      h.parent && h.parent.removeChild(h), h.destroy({ children: !0 });
    }
  };
});
ge("frostEdge", (t, e = {}) => {
  const n = ue(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), a = Math.abs(i.height), o = e.segments ?? 20, s = e.maxLength ?? 15, l = e.color ?? 11197951, u = e.alpha ?? 0.5, d = e.growSpeed ?? 0.02, m = new PIXI.Container();
  m.pivot.set(r / 2, a / 2), m.position.set(r / 2, a / 2);
  const f = new PIXI.Graphics(), h = new PIXI.Graphics();
  h.beginFill(16777215), h.drawRect(0, 0, r, a), h.endFill(), m.addChild(h), f.mask = h, m.addChild(f), t.addChild(m);
  const p = n.scale.x, y = n.scale.y, w = n.angle, b = [];
  for (let T = 0; T < o; T++) {
    const k = Math.floor(Math.random() * 4);
    let O, _, N;
    switch (k) {
      case 0:
        O = Math.random() * r, _ = 0, N = Math.PI / 2 + (Math.random() - 0.5) * 0.6;
        break;
      case 1:
        O = r, _ = Math.random() * a, N = Math.PI + (Math.random() - 0.5) * 0.6;
        break;
      case 2:
        O = Math.random() * r, _ = a, N = -Math.PI / 2 + (Math.random() - 0.5) * 0.6;
        break;
      default:
        O = 0, _ = Math.random() * a, N = (Math.random() - 0.5) * 0.6;
        break;
    }
    b.push({ sx: O, sy: _, angle: N, targetLength: s * (0.4 + Math.random() * 0.6), currentLength: 0, grown: !1 });
  }
  let v = !1, E = 0;
  return {
    update(T) {
      if (m.visible = n.visible !== !1, m.scale.set(n.scale.x / p, n.scale.y / y), m.angle = n.angle - w, v)
        E += T * 0.03;
      else {
        v = !0;
        for (const O of b)
          O.grown || (O.currentLength += (O.targetLength - O.currentLength) * d * T, O.currentLength >= O.targetLength * 0.99 ? (O.currentLength = O.targetLength, O.grown = !0) : v = !1);
      }
      const k = v ? u * (0.7 + 0.3 * Math.sin(E)) : u;
      f.clear(), f.lineStyle(1.5, l, k * (n.alpha ?? 1));
      for (const O of b)
        O.currentLength <= 0 || (f.moveTo(O.sx, O.sy), f.lineTo(O.sx + Math.cos(O.angle) * O.currentLength, O.sy + Math.sin(O.angle) * O.currentLength));
    },
    detach() {
      f.mask = null, m.parent && m.parent.removeChild(m), m.destroy({ children: !0 });
    }
  };
});
ge("shadowLift", (t, e = {}) => {
  var h, p, y;
  const n = ue(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = PIXI.DropShadowFilter ?? ((h = PIXI.filters) == null ? void 0 : h.DropShadowFilter) ?? ((y = (p = globalThis.PIXI) == null ? void 0 : p.filters) == null ? void 0 : y.DropShadowFilter);
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
    update(w) {
      if (f < l) {
        f += w;
        const b = Math.min(f / l, 1), v = u(b);
        d.distance = r * v, d.alpha = o * v;
      }
    },
    detach() {
      n.filters && (n.filters = n.filters.filter((w) => w !== d), n.filters.length === 0 && (n.filters = null)), d.destroy();
    }
  };
});
ge("none", () => ({ update() {
}, detach() {
} }));
ge("tween-prop", (t, e = {}) => {
  const n = ue(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.attribute ?? "alpha", r = e.from ?? 0.85, a = e.to ?? 1, o = e.period ?? 1500, s = ot(e.easing ?? "easeInOutCosine"), u = { alpha: "alpha", rotation: "angle" }[i] ?? i, d = n[u];
  let m = 0;
  return {
    update(f) {
      m += f;
      const h = o / 16.667, p = Math.abs(m / h % 2 - 1), y = s(p);
      n[u] = r + (a - r) * y;
    },
    detach() {
      n[u] = d;
    }
  };
});
ge("tween-tint", (t, e = {}) => {
  const n = ue(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.fromColor ?? "#ffffff", r = e.toColor ?? "#ffcc88", a = e.mode ?? "oklch", o = e.period ?? 3e3, s = ot(e.easing ?? "easeInOutCosine"), l = Fc(a), u = foundry.utils.Color, d = u.from(i), m = u.from(r), f = n.tint;
  let h = 0;
  return {
    update(p) {
      h += p;
      const y = o / 16.667, w = Math.abs(h / y % 2 - 1), b = s(w), v = l(d, m, b);
      n.tint = u.from(v).valueOf();
    },
    detach() {
      n.tint = f;
    }
  };
});
ge("tween-scale", (t, e = {}) => {
  const n = ue(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.fromScale ?? 0.95, r = e.toScale ?? 1.05, a = e.period ?? 2e3, o = ot(e.easing ?? "easeInOutCosine"), s = n.scale.x, l = n.scale.y;
  let u = 0;
  return {
    update(d) {
      u += d;
      const m = a / 16.667, f = Math.abs(u / m % 2 - 1), h = o(f), p = i + (r - i) * h;
      n.scale.set(s * p, l * p);
    },
    detach() {
      n.scale.set(s, l);
    }
  };
});
const pr = {
  always: [],
  idle: ["float", "glow"],
  hover: ["scale"],
  dim: ["none"]
};
function ev(t) {
  if (!t) return { ...pr };
  const e = /* @__PURE__ */ c((n, i) => n === void 0 ? i : typeof n == "string" ? [n] : typeof n == "object" && !Array.isArray(n) && n.name ? [n] : Array.isArray(n) ? n : i, "normalize");
  return {
    always: e(t.always, pr.always),
    idle: e(t.idle, pr.idle),
    hover: e(t.hover, pr.hover),
    dim: e(t.dim, pr.dim)
  };
}
c(ev, "normalizeConfig");
var Ce, _t, at, xt, Dn, Pn, yt, $t, fn, Ee, Mm, Va, _m, xm, $m, Nm, Fm, Dm;
const Nr = class Nr {
  /**
   * @param {PlaceableObject} placeable
   * @param {object|undefined} animationConfig  Raw animation config from the await entry
   */
  constructor(e, n) {
    M(this, Ee);
    M(this, Ce);
    M(this, _t);
    M(this, at, null);
    M(this, xt, []);
    M(this, Dn, []);
    M(this, Pn, null);
    M(this, yt, null);
    M(this, $t, null);
    M(this, fn, 0);
    I(this, Ce, e), I(this, _t, ev(n));
  }
  /** Current animation state name. */
  get state() {
    return g(this, at);
  }
  /**
   * Start animating in the given state.
   * @param {string} [state="idle"]
   */
  start(e = "idle") {
    I(this, at, e), I(this, Pn, (n) => {
      if (g(this, Ce).destroyed || !g(this, Ce).transform) {
        this.detach();
        return;
      }
      if (!g(this, yt)) {
        if (S(this, Ee, Mm).call(this), !g(this, yt)) return;
        S(this, Ee, Fm).call(this), S(this, Ee, $m).call(this, g(this, at));
        return;
      }
      g(this, $t) && S(this, Ee, Va).call(this);
      for (const i of g(this, Dn)) i.update(n);
      for (const i of g(this, xt)) i.update(n);
      S(this, Ee, xm).call(this, n);
    }), canvas.app.ticker.add(g(this, Pn));
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
    if (e === g(this, at)) return;
    if (!g(this, yt)) {
      I(this, at, e);
      return;
    }
    const n = ((m = g(this, Ce).document) == null ? void 0 : m.id) ?? "?", i = ue(g(this, Ce)), r = g(this, _t)[g(this, at)] ?? g(this, _t).idle ?? ["none"], a = g(this, _t)[e] ?? g(this, _t).idle ?? ["none"], o = r.map((f) => typeof f == "string" ? f : f == null ? void 0 : f.name), s = a.map((f) => typeof f == "string" ? f : f == null ? void 0 : f.name);
    if (console.log(`%c[TileAnimator ${n}] setState: ${g(this, at)} → ${e}`, "color: #44DDFF; font-weight: bold"), console.log(`  old behaviours: [${o.join(", ")}]  →  new: [${s.join(", ")}]`), i && console.log(`  mesh BEFORE detach: pos=(${i.position.x.toFixed(2)}, ${i.position.y.toFixed(2)}) scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)} angle=${i.angle.toFixed(2)}`), g(this, yt)) {
      const f = g(this, yt);
      console.log(`  canonical: pos=(${f.x.toFixed(2)}, ${f.y.toFixed(2)}) scale=(${f.scaleX.toFixed(4)}, ${f.scaleY.toFixed(4)}) alpha=${f.alpha.toFixed(4)} angle=${f.angle.toFixed(2)}`);
    }
    const l = /* @__PURE__ */ new Map();
    for (let f = 0; f < g(this, xt).length; f++) {
      const h = r[f], p = typeof h == "string" ? h : h == null ? void 0 : h.name;
      p && l.set(p, g(this, xt)[f]);
    }
    const u = [], d = /* @__PURE__ */ new Set();
    for (const f of a) {
      const h = typeof f == "string" ? f : f.name;
      l.has(h) && !d.has(h) && d.add(h);
    }
    console.log(`  reused: [${[...d].join(", ")}]  detaching: [${[...l.keys()].filter((f) => !d.has(f)).join(", ")}]`), S(this, Ee, _m).call(this);
    for (const [f, h] of l)
      d.has(f) || (h.detach(), i && console.log(`  mesh AFTER detach("${f}"): scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)}`));
    S(this, Ee, Va).call(this), i && console.log(`  mesh AFTER canonical restore: scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)}`);
    for (const f of a) {
      const h = typeof f == "string" ? f : f.name;
      if (l.has(h) && d.has(h))
        u.push(l.get(h)), d.delete(h), console.log(`  → reuse "${h}"`);
      else {
        const p = typeof f == "string" ? void 0 : f, y = Ua(h);
        if (!y) {
          console.warn(`TileAnimator: unknown behaviour "${h}"`);
          continue;
        }
        u.push(y(g(this, Ce), p, g(this, yt))), i && console.log(`  → create "${h}" — mesh after factory: scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)} pos=(${i.position.x.toFixed(2)}, ${i.position.y.toFixed(2)})`);
      }
    }
    if (g(this, $t)) {
      const f = g(this, $t);
      console.log(`  blend FROM: pos=(${f.x.toFixed(2)}, ${f.y.toFixed(2)}) scale=(${f.scaleX.toFixed(4)}, ${f.scaleY.toFixed(4)}) alpha=${f.alpha.toFixed(4)}`);
    }
    I(this, at, e), I(this, xt, u);
  }
  /**
   * Full cleanup — detach all behaviours, restore canonical, and remove ticker.
   */
  detach() {
    var n, i;
    g(this, Ce).destroyed || !g(this, Ce).transform ? (I(this, xt, []), I(this, Dn, [])) : (S(this, Ee, Nm).call(this), S(this, Ee, Dm).call(this), S(this, Ee, Va).call(this)), I(this, $t, null), I(this, at, null), g(this, Pn) && ((i = (n = canvas.app) == null ? void 0 : n.ticker) == null || i.remove(g(this, Pn)), I(this, Pn, null));
  }
};
Ce = new WeakMap(), _t = new WeakMap(), at = new WeakMap(), xt = new WeakMap(), Dn = new WeakMap(), Pn = new WeakMap(), yt = new WeakMap(), $t = new WeakMap(), fn = new WeakMap(), Ee = new WeakSet(), // ── Private ──────────────────────────────────────────────────────────
Mm = /* @__PURE__ */ c(function() {
  const e = ue(g(this, Ce));
  e && I(this, yt, {
    x: e.position.x,
    y: e.position.y,
    scaleX: e.scale.x,
    scaleY: e.scale.y,
    angle: e.angle,
    alpha: e.alpha,
    tint: e.tint
  });
}, "#captureCanonical"), Va = /* @__PURE__ */ c(function() {
  const e = ue(g(this, Ce));
  if (!e || !g(this, yt)) return;
  const n = g(this, yt);
  e.position.x = n.x, e.position.y = n.y, e.scale.x = n.scaleX, e.scale.y = n.scaleY, e.angle = n.angle, e.alpha = n.alpha, e.tint = n.tint;
}, "#restoreCanonical"), /**
 * Snapshot the current (animated) mesh values so the transition blend
 * can lerp FROM here toward the new state's computed values.
 */
_m = /* @__PURE__ */ c(function() {
  const e = ue(g(this, Ce));
  e && (I(this, $t, {
    x: e.position.x,
    y: e.position.y,
    scaleX: e.scale.x,
    scaleY: e.scale.y,
    angle: e.angle,
    alpha: e.alpha
  }), I(this, fn, 0));
}, "#captureBlendStart"), /**
 * After behaviours compute the new state's mesh values, blend from the
 * pre-transition snapshot toward those values over BLEND_FRAMES using
 * easeOutCubic. This hides the canonical-restore snap entirely.
 */
xm = /* @__PURE__ */ c(function(e) {
  var o, s;
  if (!g(this, $t)) return;
  I(this, fn, g(this, fn) + e);
  const n = Math.min(g(this, fn) / Nr.BLEND_FRAMES, 1);
  if (n >= 1) {
    const l = ((o = g(this, Ce).document) == null ? void 0 : o.id) ?? "?";
    console.log(`%c[TileAnimator ${l}] blend complete`, "color: #88FF88"), I(this, $t, null);
    return;
  }
  const i = 1 - (1 - n) ** 3, r = ue(g(this, Ce));
  if (!r) return;
  const a = g(this, $t);
  if (g(this, fn) <= e * 3) {
    const l = ((s = g(this, Ce).document) == null ? void 0 : s.id) ?? "?", u = Math.round(g(this, fn) / e);
    console.log(`  [blend ${l} f${u}] t=${n.toFixed(3)} eased=${i.toFixed(3)} | behaviour→scale=(${r.scale.x.toFixed(4)},${r.scale.y.toFixed(4)}) alpha=${r.alpha.toFixed(4)} | blendFrom→scale=(${a.scaleX.toFixed(4)},${a.scaleY.toFixed(4)}) alpha=${a.alpha.toFixed(4)}`);
  }
  r.position.x = a.x + (r.position.x - a.x) * i, r.position.y = a.y + (r.position.y - a.y) * i, r.scale.x = a.scaleX + (r.scale.x - a.scaleX) * i, r.scale.y = a.scaleY + (r.scale.y - a.scaleY) * i, r.angle = a.angle + (r.angle - a.angle) * i, r.alpha = a.alpha + (r.alpha - a.alpha) * i, g(this, fn) <= e * 3 && console.log(`  [blend result] scale=(${r.scale.x.toFixed(4)},${r.scale.y.toFixed(4)}) alpha=${r.alpha.toFixed(4)} pos=(${r.position.x.toFixed(2)},${r.position.y.toFixed(2)})`);
}, "#applyBlend"), $m = /* @__PURE__ */ c(function(e) {
  I(this, at, e);
  const n = g(this, _t)[e] ?? g(this, _t).idle ?? ["none"];
  for (const i of n) {
    const r = typeof i == "string" ? i : i.name, a = typeof i == "string" ? void 0 : i, o = Ua(r);
    if (!o) {
      console.warn(`TileAnimator: unknown behaviour "${r}"`);
      continue;
    }
    g(this, xt).push(o(g(this, Ce), a));
  }
}, "#attachBehaviours"), Nm = /* @__PURE__ */ c(function() {
  for (const e of g(this, xt)) e.detach();
  I(this, xt, []);
}, "#detachBehaviours"), Fm = /* @__PURE__ */ c(function() {
  const e = g(this, _t).always ?? [];
  for (const n of e) {
    const i = typeof n == "string" ? n : n.name, r = typeof n == "string" ? void 0 : n, a = Ua(i);
    if (!a) {
      console.warn(`TileAnimator: unknown always behaviour "${i}"`);
      continue;
    }
    g(this, Dn).push(a(g(this, Ce), r));
  }
}, "#attachAlwaysBehaviours"), Dm = /* @__PURE__ */ c(function() {
  for (const e of g(this, Dn)) e.detach();
  I(this, Dn, []);
}, "#detachAlwaysBehaviours"), c(Nr, "TileAnimator"), /** Frames over which state transitions are blended (easeOutCubic). */
ve(Nr, "BLEND_FRAMES", 8);
let Ai = Nr;
const tv = "cinematic", js = 5, hc = /* @__PURE__ */ new Set();
function nn(t) {
  for (const e of hc)
    try {
      e(t);
    } catch (n) {
      console.error("[cinematic] playback listener error:", n);
    }
}
c(nn, "emitPlaybackEvent");
function nv(t) {
  return hc.add(t), () => hc.delete(t);
}
c(nv, "onPlaybackProgress");
let Ie = null, ln = null, Ar = null, Mr = null, Ni = 0, ai = null;
function qc(t, e = "default") {
  return `cinematic-progress-${t}-${e}`;
}
c(qc, "progressFlagKey");
function iv(t, e, n, i) {
  game.user.setFlag(L, qc(t, e), {
    currentSegment: n,
    completedSegments: [...i],
    timestamp: Date.now()
  }).catch(() => {
  });
}
c(iv, "saveSegmentProgress");
function gc(t, e = "default") {
  game.user.unsetFlag(L, qc(t, e)).catch(() => {
  });
}
c(gc, "clearProgress");
function Pm(t, e = "default", n = 3e5) {
  const i = game.user.getFlag(L, qc(t, e));
  return !i || typeof i.timestamp != "number" || Date.now() - i.timestamp > n ? null : i.currentSegment ? i : null;
}
c(Pm, "getSavedProgress");
function Mi(t, e = "default") {
  return `cinematic-seen-${t}-${e}`;
}
c(Mi, "seenFlagKey");
function Yu(t, e = "default") {
  return !!game.user.getFlag(L, Mi(t, e));
}
c(Yu, "hasSeenCinematic");
function rv(t, e) {
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
      (n = r.timeline) != null && n.length && (r.timeline = r.timeline.filter((a, o) => !a || typeof a != "object" || Array.isArray(a) ? (console.warn(`[${L}] Cinematic: segment "${i}" timeline[${o}] on ${e} is not a valid object, removing.`), !1) : !0));
    }
    if (Object.keys(t.segments).length === 0)
      return console.warn(`[${L}] Cinematic: no valid segments on ${e}. Ignoring.`), null;
  }
  return t.timeline !== void 0 && !Array.isArray(t.timeline) ? (console.warn(`[${L}] Cinematic: invalid 'timeline' on ${e} (expected array). Ignoring.`), null) : t;
}
c(rv, "validateSingleCinematic");
function ws(t) {
  const e = t ? game.scenes.get(t) : canvas.scene;
  let n = (e == null ? void 0 : e.getFlag(L, tv)) ?? null;
  if (n == null) return null;
  if (typeof n != "object" || Array.isArray(n))
    return console.warn(`[${L}] Cinematic: invalid flag data on scene ${e == null ? void 0 : e.id} (expected object). Ignoring.`), null;
  if ((n.version ?? 1) < 3) {
    const { version: i, ...r } = n;
    n = { version: 3, cinematics: { default: r } };
  }
  if (n.version === 3) {
    for (const [i, r] of Object.entries(n.cinematics ?? {}))
      n.cinematics[i] = Xt.migrateV3toV4(r);
    n.version = 4;
  }
  if (n.version === 4) {
    for (const [i, r] of Object.entries(n.cinematics ?? {}))
      n.cinematics[i] = Xt.migrateV4toV5(r);
    n.version = js;
  }
  if (n.version > js)
    return console.warn(`[${L}] Cinematic: scene ${e == null ? void 0 : e.id} has version ${n.version}, runtime supports up to ${js}. Skipping.`), null;
  if (!n.cinematics || typeof n.cinematics != "object")
    return console.warn(`[${L}] Cinematic: no 'cinematics' map on scene ${e == null ? void 0 : e.id}. Ignoring.`), null;
  for (const [i, r] of Object.entries(n.cinematics)) {
    const a = rv(r, `scene ${e == null ? void 0 : e.id} cinematic "${i}"`);
    a ? n.cinematics[i] = a : delete n.cinematics[i];
  }
  return Object.keys(n.cinematics).length === 0 ? null : n;
}
c(ws, "getCinematicData");
function bo(t, e = "default") {
  var i;
  const n = ws(t);
  return ((i = n == null ? void 0 : n.cinematics) == null ? void 0 : i[e]) ?? null;
}
c(bo, "getNamedCinematic");
function av(t) {
  const e = ws(t);
  return e ? Object.keys(e.cinematics) : [];
}
c(av, "listCinematicNames");
function ov() {
  return game.ready ? Promise.resolve() : new Promise((t) => Hooks.once("ready", t));
}
c(ov, "waitForReady");
async function sv(t = 1e4) {
  var n, i;
  const e = (i = (n = game.modules.get(L)) == null ? void 0 : n.api) == null ? void 0 : i.tween;
  return e != null && e.Timeline ? e.Timeline : new Promise((r) => {
    const a = Date.now(), o = setTimeout(() => {
      var l, u;
      (u = (l = ui.notifications) == null ? void 0 : l.info) == null || u.call(l, `[${L}] Cinematic: waiting for tween engine...`);
    }, 2e3), s = setInterval(() => {
      var u, d, m, f;
      const l = (d = (u = game.modules.get(L)) == null ? void 0 : u.api) == null ? void 0 : d.tween;
      l != null && l.Timeline ? (clearInterval(s), clearTimeout(o), r(l.Timeline)) : Date.now() - a > t && (clearInterval(s), clearTimeout(o), console.warn(`[${L}] Cinematic: tween API not available after ${t}ms.`), (f = (m = ui.notifications) == null ? void 0 : m.warn) == null || f.call(m, `[${L}] Cinematic: tween engine unavailable — cinematic cannot play.`), r(null));
    }, 200);
  });
}
c(sv, "waitForTweenAPI");
async function pc(t = 5e3) {
  var e;
  return window.Tagger ?? ((e = game.modules.get("tagger")) == null ? void 0 : e.api) ? !0 : new Promise((n) => {
    const i = Date.now(), r = setInterval(() => {
      var a;
      window.Tagger ?? ((a = game.modules.get("tagger")) == null ? void 0 : a.api) ? (clearInterval(r), n(!0)) : Date.now() - i > t && (clearInterval(r), console.warn(`[${L}] Cinematic: Tagger API not available after ${t}ms.`), n(!1));
    }, 200);
  });
}
c(pc, "waitForTagger");
async function lv(t, e, n) {
  if (!t || !t.event) return;
  const i = { ...t };
  console.log(`[${L}] Cinematic: waiting for gate: ${t.event}`);
  let r = null;
  if (t.event === "tile-click" && t.target && t.animation) {
    const a = e.get(t.target);
    (a == null ? void 0 : a.kind) === "placeable" && a.placeable && (r = new Ai(a.placeable, t.animation), r.start());
  }
  try {
    if (t.timeout && t.timeout > 0) {
      const a = new Promise((s) => setTimeout(s, t.timeout)), o = Yl(i, { signal: n.signal, eventBus: null });
      await Promise.race([o, a]);
    } else
      await Yl(i, { signal: n.signal, eventBus: null });
  } finally {
    r && r.detach();
  }
}
c(lv, "processGate");
function Rm(t) {
  if (!t.segments) return [];
  const e = [], n = /* @__PURE__ */ new Set();
  let i = t.entry;
  for (; i && typeof i == "string" && t.segments[i] && !n.has(i); )
    n.add(i), e.push(i), i = t.segments[i].next;
  return e;
}
c(Rm, "getSegmentOrder");
function vo(t, e) {
  if (t.setup)
    try {
      Ae(t.setup, e);
    } catch (i) {
      console.warn(`[${L}] Cinematic: error applying cinematic-level setup:`, i);
    }
  const n = Rm(t);
  for (const i of n) {
    const r = t.segments[i];
    if (r.setup)
      try {
        Ae(r.setup, e);
      } catch (a) {
        console.warn(`[${L}] Cinematic: error applying setup for segment "${i}":`, a);
      }
    if (r.landing)
      try {
        Ae(r.landing, e);
      } catch (a) {
        console.warn(`[${L}] Cinematic: error applying landing for segment "${i}":`, a);
      }
  }
  if (t.landing)
    try {
      Ae(t.landing, e);
    } catch (i) {
      console.warn(`[${L}] Cinematic: error applying cinematic-level landing:`, i);
    }
  canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
}
c(vo, "applyAllSegmentLandingStates");
async function _r(t, e = "default", n = null) {
  var v, E, T, k, O, _, N, D;
  const i = t ?? ((v = canvas.scene) == null ? void 0 : v.id);
  if (!i) return;
  const r = `${i}:${e}`;
  if (n || (n = /* @__PURE__ */ new Set()), n.has(r)) {
    console.warn(`[${L}] Cinematic: circular transition detected at "${r}". Stopping chain.`), (T = (E = ui.notifications) == null ? void 0 : E.warn) == null || T.call(E, "Cinematic: circular transition detected, stopping.");
    return;
  }
  n.add(r), (Ie == null ? void 0 : Ie.status) === "running" && Ie.cancel("replaced"), Ie = null, ln && (ln.abort("replaced"), ln = null);
  const a = bo(i, e);
  if (!a) {
    console.warn(`[${L}] Cinematic: no cinematic "${e}" on scene ${i}.`);
    return;
  }
  const o = await sv();
  if (!o || ((k = canvas.scene) == null ? void 0 : k.id) !== i || (await pc(), ((O = canvas.scene) == null ? void 0 : O.id) !== i)) return;
  const { targets: s, unresolved: l } = uo(a);
  if (console.log(`[${L}] Cinematic "${e}": resolved ${s.size} targets`), l.length && console.warn(`[${L}] Cinematic "${e}": skipping ${l.length} unresolved: ${l.join(", ")}`), s.size === 0) {
    console.warn(`[${L}] Cinematic "${e}": no targets could be resolved on scene ${i}.`);
    return;
  }
  const u = cb(a);
  Ar = lb(u, s), Mr = s;
  const d = Pm(i, e), m = new AbortController();
  ln = m;
  const f = a.synchronized === !0 && game.user.isGM, h = Rm(a);
  if (h.length === 0) {
    console.warn(`[${L}] Cinematic "${e}": no segments to execute.`);
    return;
  }
  let p = 0;
  const y = /* @__PURE__ */ new Set();
  if (d) {
    const $ = d.completedSegments ?? [];
    for (const A of $) y.add(A);
    const F = h.indexOf(d.currentSegment);
    F >= 0 && (p = F, console.log(`[${L}] Cinematic "${e}": resuming from segment "${d.currentSegment}" (${$.length} completed)`));
  }
  if (a.setup)
    try {
      Ae(a.setup, s), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    } catch ($) {
      console.error(`[${L}] Cinematic "${e}": error applying cinematic-level setup:`, $);
    }
  for (let $ = 0; $ < p; $++) {
    const F = h[$], A = a.segments[F];
    if (A.setup)
      try {
        Ae(A.setup, s);
      } catch (R) {
        console.warn(`[${L}] Cinematic: error applying setup for completed segment "${F}":`, R);
      }
    if (A.landing)
      try {
        Ae(A.landing, s);
      } catch (R) {
        console.warn(`[${L}] Cinematic: error applying landing for completed segment "${F}":`, R);
      }
  }
  let w = !1, b = !1;
  nn({ type: "playback-start", sceneName: ((_ = canvas.scene) == null ? void 0 : _.name) ?? i });
  try {
    for (let $ = p; $ < h.length; $++) {
      if (m.signal.aborted) {
        w = !0;
        break;
      }
      if (((N = canvas.scene) == null ? void 0 : N.id) !== i) {
        w = !0;
        break;
      }
      const F = h[$], A = a.segments[F];
      if (console.log(`[${L}] Cinematic "${e}": entering segment "${F}"`), nn({ type: "segment-start", segmentName: F }), iv(i, e, F, [...y]), A.gate) {
        nn({ type: "gate-wait", segmentName: F, gate: A.gate });
        try {
          await lv(A.gate, s, m);
        } catch (B) {
          if (m.signal.aborted) {
            w = !0;
            break;
          }
          throw B;
        }
        nn({ type: "gate-resolved", segmentName: F });
      }
      if (m.signal.aborted) {
        w = !0;
        break;
      }
      if (A.setup)
        try {
          Ae(A.setup, s), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
        } catch (B) {
          console.error(`[${L}] Cinematic "${e}": error applying setup for segment "${F}":`, B);
        }
      if ((D = A.timeline) != null && D.length) {
        const B = Hc(A.timeline);
        nn({ type: "timeline-start", segmentName: F, durationMs: B });
        const { tl: j } = pb(
          { setup: {}, timeline: A.timeline },
          s,
          o,
          {
            timelineName: `cinematic-${i}-${e}-${F}`,
            onStepComplete: /* @__PURE__ */ c((V) => {
              nn({ type: "step-complete", segmentName: F, stepIndex: V });
            }, "onStepComplete")
          }
        );
        Ie = j.run({
          broadcast: f,
          commit: f
        });
        try {
          await new Promise((V, Y) => {
            j.onComplete(() => V()), j.onCancel(() => Y(new Error("cancelled"))), j.onError((X) => Y(new Error(`timeline error: ${X}`)));
            const ae = /* @__PURE__ */ c(() => Y(new Error("cancelled")), "onAbort");
            m.signal.addEventListener("abort", ae, { once: !0 });
          });
        } catch (V) {
          if (V.message === "cancelled" || m.signal.aborted) {
            w = !0;
            break;
          }
          throw V;
        }
        nn({ type: "timeline-end", segmentName: F });
      }
      if (m.signal.aborted) {
        w = !0;
        break;
      }
      if (A.landing)
        try {
          Ae(A.landing, s), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
        } catch (B) {
          console.error(`[${L}] Cinematic "${e}": error applying landing for segment "${F}":`, B);
        }
      nn({ type: "segment-complete", segmentName: F }), y.add(F);
      const R = A.next;
      if (R && typeof R == "object" && R.scene) {
        const B = R.scene, j = R.segment ?? a.entry;
        console.log(`[${L}] Cinematic "${e}": cross-scene transition to scene ${B}, segment "${j}"`), Ie = null, ln = null, gc(i, e), Du(), a.tracking !== !1 && await game.user.setFlag(L, Mi(i, e), !0), ai = { sceneId: B, cinematicName: e, visitedChain: n };
        const H = game.scenes.get(B);
        H ? H.view() : (console.warn(`[${L}] Cinematic: cross-scene transition target scene "${B}" not found.`), ai = null);
        return;
      }
    }
  } catch ($) {
    b = !0, console.error(`[${L}] Cinematic "${e}" error on scene ${i}:`, $);
  }
  if (Ie = null, ln = null, gc(i, e), Du(), Ar = null, Mr = null, nn({ type: "playback-end", cancelled: !!w }), w) {
    console.log(`[${L}] Cinematic "${e}" cancelled on scene ${i}.`), vo(a, s);
    return;
  }
  if (b) {
    vo(a, s);
    return;
  }
  a.tracking !== !1 && await game.user.setFlag(L, Mi(i, e), !0), console.log(`[${L}] Cinematic "${e}" complete on scene ${i}.`);
}
c(_r, "playCinematic");
async function cv(t, e = "default") {
  var i;
  const n = t ?? ((i = canvas.scene) == null ? void 0 : i.id);
  n && (await game.user.unsetFlag(L, Mi(n, e)), console.log(`[${L}] Cinematic: cleared seen flag for "${e}" on scene ${n}.`));
}
c(cv, "resetCinematic");
async function uv(t, e, n = "default") {
  var a;
  if (!game.user.isGM) return;
  const i = t ?? ((a = canvas.scene) == null ? void 0 : a.id);
  if (!i || !e) return;
  const r = game.users.get(e);
  r && (await r.unsetFlag(L, Mi(i, n)), console.log(`[${L}] Cinematic: cleared seen flag for user ${r.name} on "${n}" scene ${i}.`));
}
c(uv, "resetCinematicForUser");
async function dv(t, e = "default") {
  var a;
  if (!game.user.isGM) return;
  const n = t ?? ((a = canvas.scene) == null ? void 0 : a.id);
  if (!n) return;
  const i = Mi(n, e), r = game.users.map((o) => o.getFlag(L, i) ? o.unsetFlag(L, i) : Promise.resolve());
  await Promise.all(r), console.log(`[${L}] Cinematic: cleared seen flag for all users on "${e}" scene ${n}.`);
}
c(dv, "resetCinematicForAll");
function fv(t, e = "default") {
  var r;
  const n = t ?? ((r = canvas.scene) == null ? void 0 : r.id);
  if (!n) return [];
  const i = Mi(n, e);
  return game.users.map((a) => ({
    userId: a.id,
    name: a.name,
    color: a.color ?? "#888888",
    isGM: a.isGM,
    seen: !!a.getFlag(L, i)
  }));
}
c(fv, "getSeenStatus");
function mv(t, e) {
  var i;
  const n = t ?? ((i = canvas.scene) == null ? void 0 : i.id);
  return e ? bo(n, e) != null : ws(n) != null;
}
c(mv, "hasCinematic");
function hv() {
  if (!Ar || !Mr) {
    console.warn(`[${L}] Cinematic: no snapshot available for revert.`);
    return;
  }
  (Ie == null ? void 0 : Ie.status) === "running" && Ie.cancel("reverted"), Ie = null, ln && (ln.abort("reverted"), ln = null);
  try {
    Ae(Ar, Mr), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 }), console.log(`[${L}] Cinematic: reverted to pre-cinematic state.`);
  } catch (t) {
    console.error(`[${L}] Cinematic: error during revert:`, t);
  }
  Ar = null, Mr = null;
}
c(hv, "revertCinematic");
async function gv() {
  const t = ++Ni;
  if (console.log(`[${L}] Cinematic: canvasReady fired, gen=${t}, game.ready=${game.ready}`), await ov(), t !== Ni) return;
  console.log(`[${L}] Cinematic: game is ready`);
  const e = canvas.scene;
  if (!e) {
    console.log(`[${L}] Cinematic: no canvas.scene, exiting`);
    return;
  }
  if (ai && ai.sceneId === e.id) {
    const a = ai;
    ai = null, console.log(`[${L}] Cinematic: picking up pending transition to "${a.cinematicName}" on scene ${e.id}`);
    try {
      await _r(e.id, a.cinematicName, a.visitedChain);
    } catch (o) {
      console.error(`[${L}] Cinematic: error during pending transition playback on scene ${e.id}:`, o);
    }
    return;
  }
  ai = null;
  const n = ws(e.id);
  if (!n) {
    console.log(`[${L}] Cinematic: no cinematic flag on scene ${e.id}, exiting`);
    return;
  }
  console.log(`[${L}] Cinematic: found ${Object.keys(n.cinematics).length} cinematic(s) on scene ${e.id}`);
  const i = [];
  for (const [a, o] of Object.entries(n.cinematics))
    (!o.trigger || o.trigger === "canvasReady") && i.push({ name: a, data: o });
  if (i.length === 0) {
    console.log(`[${L}] Cinematic: no canvasReady cinematics on scene ${e.id}, exiting`);
    return;
  }
  for (const { name: a } of i) {
    const o = Pm(e.id, a);
    if (t !== Ni) return;
    if (o) {
      console.log(`[${L}] Cinematic "${a}": found saved progress at segment "${o.currentSegment}", resuming...`);
      try {
        await _r(e.id, a);
      } catch (s) {
        console.error(`[${L}] Cinematic "${a}": error during resumed playback on scene ${e.id}:`, s);
      }
      return;
    }
  }
  let r = null;
  for (const { name: a, data: o } of i)
    if (!(o.tracking !== !1 && Yu(e.id, a))) {
      r = { name: a, data: o };
      break;
    }
  if (!r) {
    if (console.log(`[${L}] Cinematic: all canvasReady cinematics already seen on scene ${e.id}`), pv(e.id, i), (Ie == null ? void 0 : Ie.status) === "running" && Ie.cancel("already-seen"), Ie = null, await pc(), t !== Ni) return;
    for (const { name: a, data: o } of i)
      try {
        const { targets: s } = uo(o);
        vo(o, s);
      } catch (s) {
        console.error(`[${L}] Cinematic "${a}": error applying landing states (already seen) on scene ${e.id}:`, s);
      }
    canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    return;
  }
  if (t === Ni && (console.log(`[${L}] Cinematic: playing first unseen cinematic "${r.name}"...`), await pc(), t === Ni)) {
    for (const { name: a, data: o } of i) {
      if (a === r.name) continue;
      if (o.tracking !== !1 && Yu(e.id, a))
        try {
          const { targets: l } = uo(o);
          vo(o, l);
        } catch (l) {
          console.error(`[${L}] Cinematic "${a}": error applying landing states (already seen) on scene ${e.id}:`, l);
        }
    }
    try {
      await _r(e.id, r.name);
    } catch (a) {
      console.error(`[${L}] Cinematic "${r.name}": error during playback on scene ${e.id}:`, a);
    }
  }
}
c(gv, "onCanvasReady$2");
function pv(t, e) {
  for (const { name: n } of e)
    gc(t, n);
}
c(pv, "clearAllCanvasReadyProgress");
function yv(t = 3e5) {
  var i;
  const e = (i = game.user.flags) == null ? void 0 : i[L];
  if (!e) return;
  const n = Date.now();
  for (const r of Object.keys(e)) {
    if (!r.startsWith("cinematic-progress-")) continue;
    const a = e[r];
    if (!a || typeof a.timestamp != "number") {
      game.user.unsetFlag(L, r).catch(() => {
      });
      continue;
    }
    n - a.timestamp > t && (console.log(`[${L}] Cinematic: cleaning up stale progress flag "${r}" (age: ${n - a.timestamp}ms)`), game.user.unsetFlag(L, r).catch(() => {
    }));
  }
}
c(yv, "cleanupStaleProgressFlags");
function bv() {
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
        new sc({ scene: canvas.scene }).render(!0);
      }, "onClick")
    };
    Array.isArray(i) ? i.push(a) : i instanceof Map ? i.set(r, a) : i && typeof i == "object" ? i[r] = a : n.tools = [a];
  });
}
c(bv, "registerEditorButton");
function vv() {
  Hooks.on("canvasReady", gv), bv(), Hooks.once("ready", () => {
    yv();
    const t = game.modules.get(L);
    t.api || (t.api = {}), t.api.cinematic = {
      play: _r,
      reset: cv,
      resetForUser: uv,
      resetForAll: dv,
      getSeenStatus: fv,
      has: mv,
      get: bo,
      list: av,
      revert: hv,
      onPlaybackProgress: nv,
      TileAnimator: Ai,
      registerBehaviour: ge,
      getBehaviour: Ua,
      trigger: /* @__PURE__ */ c(async (e, n, i = "default") => {
        var o;
        const r = n ?? ((o = canvas.scene) == null ? void 0 : o.id);
        if (!r) return;
        const a = bo(r, i);
        a && (a.trigger && a.trigger !== e || await _r(r, i));
      }, "trigger")
    }, console.log(`[${L}] Cinematic API registered (v5).`);
  });
}
c(vv, "registerCinematicHooks");
function yc(t, e) {
  const n = Math.abs(t.width), i = Math.abs(t.height), r = n / 2, a = i / 2;
  let o = e.x - (t.x + r), s = e.y - (t.y + a);
  if (t.rotation !== 0) {
    const l = Math.toRadians(t.rotation), u = Math.cos(l), d = Math.sin(l), m = u * o + d * s, f = u * s - d * o;
    o = m, s = f;
  }
  return o += r, s += a, o >= 0 && o <= n && s >= 0 && s <= i;
}
c(yc, "pointWithinTile");
ps("tile-click", (t, e) => t.target ? new Promise((n, i) => {
  var h;
  if (e.signal.aborted) return i(e.signal.reason ?? "aborted");
  const r = bs(t.target);
  if (!((h = r == null ? void 0 : r.placeables) != null && h.length))
    return i(new Error(`await tile-click: no placeables found for "${t.target}"`));
  const a = r.placeables, o = [];
  for (const { placeable: p } of a) {
    const y = new Ai(p, t.animation);
    y.start("idle"), o.push({ placeable: p, animator: y });
  }
  const s = document.getElementById("board");
  let l = null;
  const u = /* @__PURE__ */ c((p) => {
    const y = canvas.activeLayer;
    if (!y) return;
    const w = y.toLocal(p);
    if (!w || isNaN(w.x) || isNaN(w.y)) return;
    let b = !1;
    for (const { placeable: v, animator: E } of o)
      yc(v.document, w) ? (b = !0, E.state !== "hover" && E.setState("hover")) : E.state === "hover" && E.setState("idle");
    b ? l === null && (l = document.body.style.cursor, document.body.style.cursor = "pointer") : l !== null && (document.body.style.cursor = l, l = null);
  }, "onPointerMove");
  s == null || s.addEventListener("pointermove", u);
  const d = /* @__PURE__ */ c((p) => {
    if (p.button !== 0) return;
    const y = canvas.activeLayer;
    if (!y) return;
    const w = y.toLocal(p);
    isNaN(w.x) || isNaN(w.y) || !a.filter(({ doc: v }) => yc(v, w)).sort((v, E) => (E.doc.sort ?? 0) - (v.doc.sort ?? 0))[0] || (p.stopPropagation(), p.preventDefault(), f(), n());
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
vv();
function wv() {
  Hooks.once("ready", () => {
    const t = game.modules.get(L);
    t.api || (t.api = {}), t.api.picker = {
      /** Open the picker window. Returns Promise<string[] | null>. */
      open: /* @__PURE__ */ c((e) => yo.open(e), "open"),
      /** Resolve a selector string to documents. */
      resolveSelector: bs,
      /** Parse a selector string into { type, value }. */
      parseSelector: Rc,
      /** Build a selector string from { type, value }. */
      buildSelector: ib,
      /** Build a tag selector from tags array + mode. */
      buildTagSelector: em,
      /** Canvas highlight utilities. */
      highlight: {
        add: po,
        remove: rr,
        has: dm,
        clearAll: ja
      }
    }, console.log(`[${L}] Placeable Picker API registered.`);
  });
}
c(wv, "registerPlaceablePickerHooks");
wv();
const yr = "canvas-popup", Ev = 100;
function Cv(t) {
  const e = canvas.stage.worldTransform, n = document.getElementById("board"), i = n == null ? void 0 : n.getBoundingClientRect(), r = (i == null ? void 0 : i.left) ?? 0, a = (i == null ? void 0 : i.top) ?? 0;
  return {
    x: e.a * t.x + e.c * t.y + e.tx + r,
    y: e.b * t.x + e.d * t.y + e.ty + a
  };
}
c(Cv, "canvasToScreen");
function Sv() {
  var t, e;
  return ((e = (t = canvas.stage) == null ? void 0 : t.scale) == null ? void 0 : e.x) ?? 1;
}
c(Sv, "getZoom");
function Us(t, e) {
  var n;
  return e === "grid" ? t * (((n = canvas.grid) == null ? void 0 : n.size) ?? 100) : t;
}
c(Us, "resolveUnit");
function Tv(t, e) {
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
c(Tv, "attachClickOutside");
function Lv(t, e) {
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
c(Lv, "attachRightClickOutside");
function Iv(t, e) {
  function n(i) {
    i.key === "Escape" && (i.preventDefault(), i.stopPropagation(), e());
  }
  return c(n, "handler"), document.addEventListener("keydown", n, !0), () => {
    document.removeEventListener("keydown", n, !0);
  };
}
c(Iv, "attachEscape");
const Vs = /* @__PURE__ */ new Set(), Ta = 8, Ku = 0.5, Zc = class Zc {
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
    e.className = yr, this._cssClass && e.classList.add(...this._cssClass.split(/\s+/)), e.style.position = "fixed", e.style.zIndex = Ev;
    const n = document.createElement("div");
    n.className = `${yr}__content`, e.appendChild(n), this.element = e, this._contentWrap = n;
    const i = this._resolveWidth();
    i != null && (n.style.width = `${i}px`, n.style.minWidth = "0", n.style.boxSizing = "border-box"), this._initialContent && this.setContent(this._initialContent), document.body.appendChild(e), this.reposition(), this._animate ? requestAnimationFrame(() => {
      this.element && this.element.classList.add(`${yr}--visible`);
    }) : e.classList.add(`${yr}--visible`), this._hookId = Hooks.on("canvasPan", () => this.reposition()), this._anchor.placeable && ((a = canvas.app) != null && a.ticker) && (this._tickerFn = () => this.reposition(), canvas.app.ticker.add(this._tickerFn));
    const r = /* @__PURE__ */ c((o) => {
      this._emit("dismiss", o), this.destroy();
    }, "dismissFn");
    return this._dismiss.clickOutside && this._cleanups.push(Tv(e, () => r("clickOutside"))), this._dismiss.rightClickOutside && this._cleanups.push(Lv(e, () => r("rightClickOutside"))), this._dismiss.escape && this._cleanups.push(Iv(e, () => r("escape"))), this.isOpen = !0, Vs.add(this), this._emit("open"), this;
  }
  /**
   * Remove from DOM and clean up everything. Idempotent.
   */
  destroy() {
    var n;
    if (!this.isOpen) return;
    this.isOpen = !1, Vs.delete(this);
    for (const i of this._cleanups) i();
    this._cleanups.length = 0, this._hookId != null && (Hooks.off("canvasPan", this._hookId), this._hookId = null), this._tickerFn && ((n = canvas.app) != null && n.ticker) && (canvas.app.ticker.remove(this._tickerFn), this._tickerFn = null);
    const e = this.element;
    if (e) {
      if (this._animate) {
        e.classList.remove(`${yr}--visible`);
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
    const n = Sv(), i = this._sizeUnit !== "screen", r = Us(this._offset.x, this._sizeUnit), a = Us(this._offset.y, this._sizeUnit), o = {
      x: e.x + r,
      y: e.y + a
    }, s = Cv(o);
    if (Math.abs(s.x - this._lastScreenPos.x) < Ku && Math.abs(s.y - this._lastScreenPos.y) < Ku)
      return;
    this._lastScreenPos = { x: s.x, y: s.y };
    const l = this.element, u = i ? n : 1;
    i ? (l.style.transformOrigin = `${this._anchorX} ${this._anchorY}`, l.style.transform = `scale(${u})`) : (l.style.transform = "", l.style.transformOrigin = "");
    let d = 0, m = 0;
    const f = l.getBoundingClientRect();
    this._anchorX === "center" ? d = -f.width / 2 : this._anchorX === "right" && (d = -f.width), this._anchorY === "center" ? m = -f.height / 2 : this._anchorY === "bottom" && (m = -f.height);
    let h = s.x + d, p = s.y + m;
    if (this._clampToViewport) {
      const y = window.innerWidth - f.width - Ta, w = window.innerHeight - f.height - Ta;
      h = Math.max(Ta, Math.min(h, y)), p = Math.max(Ta, Math.min(p, w));
    }
    l.style.left = `${h}px`, l.style.top = `${p}px`, this._emit("reposition", { x: h, y: p });
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
    for (const e of [...Vs])
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
    return this._width == null ? null : this._width === "anchor" ? this._getAnchorSize().width : Us(this._width, this._sizeUnit);
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
c(Zc, "CanvasPopup");
let wo = Zc;
const ni = "canvas-popup-options";
function kv({ sections: t = [] } = {}) {
  const e = /* @__PURE__ */ new Map(), n = document.createElement("div");
  n.className = ni;
  for (const s of t) {
    const l = document.createElement("div");
    l.className = `${ni}__section`;
    const u = document.createElement("div");
    u.className = `${ni}__header`, u.textContent = s.label, l.appendChild(u);
    for (const d of s.items) {
      const m = document.createElement("div");
      m.className = `${ni}__item`, d.active && m.classList.add(`${ni}__item--active`), m.dataset.key = s.key, m.dataset.value = d.value;
      const f = document.createElement("span");
      f.className = `${ni}__dot`, m.appendChild(f);
      const h = document.createElement("span");
      h.className = `${ni}__label`, h.textContent = d.label, m.appendChild(h), m.addEventListener("click", (p) => {
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
c(kv, "createOptionList");
function Ov() {
  Hooks.once("ready", () => {
    const t = game.modules.get(L);
    t.api || (t.api = {}), t.api.canvasPopup = {
      CanvasPopup: wo,
      content: { createOptionList: kv }
    }, console.log(`[${L}] Canvas Popup API registered.`);
  }), Hooks.on("canvasTearDown", () => wo.destroyAll());
}
c(Ov, "registerCanvasPopupHooks");
Ov();
function Av(t, e) {
  const n = t.shape;
  if (!n) return !1;
  const i = t.x ?? 0, r = t.y ?? 0, a = n.width ?? 0, o = n.height ?? 0, s = t.rotation ?? 0, l = i + a / 2, u = r + o / 2;
  let d = e.x - l, m = e.y - u;
  if (s !== 0) {
    const f = Math.toRadians(s), h = Math.cos(f), p = Math.sin(f), y = h * d + p * m, w = h * m - p * d;
    d = y, m = w;
  }
  switch (d += a / 2, m += o / 2, n.type) {
    case "r":
      return d >= 0 && d <= a && m >= 0 && m <= o;
    case "e": {
      const f = a / 2, h = o / 2;
      if (f <= 0 || h <= 0) return !1;
      const p = (d - f) / f, y = (m - h) / h;
      return p * p + y * y <= 1;
    }
    case "p": {
      const f = n.points;
      return !Array.isArray(f) || f.length < 6 ? !1 : Mv(d, m, f);
    }
    case "f":
      return d >= 0 && d <= a && m >= 0 && m <= o;
    default:
      return !1;
  }
}
c(Av, "pointWithinDrawing");
function Mv(t, e, n) {
  let i = !1;
  const r = n.length;
  for (let a = 0, o = r - 2; a < r; o = a, a += 2) {
    const s = n[a], l = n[a + 1], u = n[o], d = n[o + 1];
    l > e != d > e && t < (u - s) * (e - l) / (d - l) + s && (i = !i);
  }
  return i;
}
c(Mv, "pointInPolygon");
const xr = "eidolon-utilities", _v = "tile-interactions", xv = "tile-animations", $v = "idle-animation";
function Nv(t) {
  const e = t.type ?? "tile-prop";
  return e === "tile-tint" ? { name: "tween-tint", fromColor: t.fromColor, toColor: t.toColor, mode: t.mode, period: t.period, easing: t.easing } : e === "tile-scale" ? { name: "tween-scale", fromScale: t.fromScale, toScale: t.toScale, period: t.period, easing: t.easing } : { name: "tween-prop", attribute: t.attribute, from: t.from, to: t.to, period: t.period, easing: t.easing };
}
c(Nv, "migrateIdleTweenToAlways");
function Bc(t) {
  var u, d, m;
  const e = (u = t == null ? void 0 : t.getFlag) == null ? void 0 : u.call(t, xr, xv);
  if (e) return e;
  const n = (d = t == null ? void 0 : t.getFlag) == null ? void 0 : d.call(t, xr, $v), i = (m = t == null ? void 0 : t.getFlag) == null ? void 0 : m.call(t, xr, _v);
  let r = [], a = [], o = [], s = [];
  if (n) {
    let f;
    Array.isArray(n) ? f = n : typeof n == "object" && "0" in n ? f = Object.values(n) : typeof n == "object" && (n.type || n.attribute) ? f = [n] : f = [], r = f.filter((h) => h && typeof h == "object").map(Nv);
  }
  return i && (i.hover && (Array.isArray(i.hover) ? o = i.hover : typeof i.hover == "object" && (a = Array.isArray(i.hover.idle) ? i.hover.idle : [], o = Array.isArray(i.hover.enter) ? i.hover.enter : [])), Array.isArray(i.click) && i.click.length && (s = i.click)), r.length > 0 || a.length > 0 || o.length > 0 || s.length > 0 ? { always: r, idle: a, hover: o, click: s } : null;
}
c(Bc, "readUnifiedConfig");
const hn = /* @__PURE__ */ new Map(), Gn = /* @__PURE__ */ new Map(), Ju = /* @__PURE__ */ new WeakMap(), $r = /* @__PURE__ */ new Set();
let Dt = null, Je = null, Nt = null, Kt = null, Jt = null;
function Hm(t) {
  const e = canvas.activeLayer;
  if (!e) return null;
  const n = e.toLocal(t);
  return !n || Number.isNaN(n.x) || Number.isNaN(n.y) ? null : n;
}
c(Hm, "canvasToLocal");
function qm(t) {
  let e = null, n = -1 / 0;
  for (const [i, r] of hn) {
    if (!(r.placeableType === "drawing" ? Av(r.doc, t) : yc(r.doc, t))) continue;
    const o = (r.doc.sort ?? 0) + (r.placeableType === "drawing" ? 1e9 : 0);
    o > n && (e = r, n = o);
  }
  return e;
}
c(qm, "hitTest");
function Fv(t) {
  var e, n;
  return {
    always: t.always ?? [],
    idle: (e = t.idle) != null && e.length ? t.idle : ["none"],
    hover: (n = t.hover) != null && n.length ? t.hover : ["none"]
  };
}
c(Fv, "buildAnimatorConfig");
function jc(t, e, n) {
  ma(t);
  const i = Fv(n), r = new Ai(e, i);
  r.start("idle"), Gn.set(t, r);
}
c(jc, "startHoverAnimator");
function ma(t) {
  const e = Gn.get(t);
  e && (e.detach(), Gn.delete(t));
}
c(ma, "stopHoverAnimator");
function Ws(t, e, n, i) {
  return e.type === "tile-tint" ? { uuid: t, toColor: n ? e.toColor : e.fromColor, mode: e.mode } : e.type === "tile-scale" ? {
    uuid: t,
    toScale: n ? e.toScale : e.fromScale,
    ...i
  } : { uuid: t, attribute: e.attribute, value: n ? e.to : e.from };
}
c(Ws, "buildClickParams");
function Dv(t) {
  const e = t._source.width, n = t._source.height, i = t._source.x, r = t._source.y;
  return {
    baseWidth: e,
    baseHeight: n,
    centerX: i + e / 2,
    centerY: r + n / 2
  };
}
c(Dv, "captureRefGeometry");
async function Pv(t, e) {
  const n = t.uuid, i = e.type ?? "tile-prop", r = sr(i);
  if (!r) {
    console.warn(`[${xr}] tile-interactions: unknown tween type "${i}"`);
    return;
  }
  const a = e.period ?? 300, o = e.easing ?? "easeOutCubic", s = e.mode ?? "bounce", l = i === "tile-scale" ? Dv(t) : null;
  if (s === "toggle") {
    const d = !(Ju.get(t) ?? !1);
    await r.execute(
      Ws(n, e, d, l),
      { durationMS: a, easing: o, commit: !0 }
    ), Ju.set(t, d);
  } else {
    const u = a / 2;
    await r.execute(
      Ws(n, e, !0, l),
      { durationMS: u, easing: o, commit: !1 }
    ), await r.execute(
      Ws(n, e, !1, l),
      { durationMS: u, easing: o, commit: !1 }
    );
  }
}
c(Pv, "playClickAnimation");
async function Rv(t) {
  var n, i, r, a, o;
  const e = t.doc.id;
  if (!$r.has(e)) {
    $r.add(e);
    try {
      if (ma(e), (n = t.clickConfig) != null && n.length) {
        const s = t.clickConfig.map((l) => Pv(t.doc, l));
        await Promise.all(s);
      }
      if (t.macroUuid) {
        const s = await fromUuid(t.macroUuid);
        s ? s.execute({ placeable: t.placeable }) : console.warn(`[${xr}] tile-interactions: macro not found: ${t.macroUuid}`);
      }
    } finally {
      $r.delete(e), t.animConfig && (((i = t.animConfig.always) == null ? void 0 : i.length) > 0 || ((r = t.animConfig.idle) == null ? void 0 : r.length) > 0 || ((a = t.animConfig.hover) == null ? void 0 : a.length) > 0) && (jc(e, t.placeable, t.animConfig), Dt === e && ((o = Gn.get(e)) == null || o.setState("hover")));
    }
  }
}
c(Rv, "handleClick");
function Bm(t) {
  var l, u, d;
  const e = Hm(t);
  if (!e) return;
  const n = qm(e), i = (n == null ? void 0 : n.doc.id) ?? null;
  if (i === Dt) return;
  if (Dt) {
    const m = Gn.get(Dt);
    m && m.setState("idle");
  }
  if (i) {
    const m = Gn.get(i);
    m && m.setState("hover");
  }
  Dt = i;
  const r = (l = canvas.tokens) == null ? void 0 : l.active, a = (u = n == null ? void 0 : n.animConfig) == null ? void 0 : u.cursor, o = r && i && (a === !0 || a !== !1 && (((d = n.clickConfig) == null ? void 0 : d.length) || n.macroUuid)), s = document.getElementById("board");
  o ? (Je === null && (Je = (s == null ? void 0 : s.style.cursor) ?? ""), s && (s.style.cursor = "pointer")) : Je !== null && (s && (s.style.cursor = Je), Je = null);
}
c(Bm, "onPointerMove");
function jm(t) {
  var i, r;
  if (t.button !== 0 || !((i = canvas.tokens) != null && i.active)) return;
  const e = Hm(t);
  if (!e) return;
  const n = qm(e);
  n && (!((r = n.clickConfig) != null && r.length) && !n.macroUuid || Rv(n));
}
c(jm, "onPointerDown");
function Um() {
  if (Dt) {
    const t = Gn.get(Dt);
    t && t.setState("idle"), Dt = null;
  }
  if (Je !== null) {
    const t = document.getElementById("board");
    t && (t.style.cursor = Je), Je = null;
  }
}
c(Um, "onPointerLeave");
function Xu(t, e, n) {
  var s, l, u;
  const i = Bc(t);
  if (!i) return;
  const r = ((s = i.always) == null ? void 0 : s.length) > 0 || ((l = i.idle) == null ? void 0 : l.length) > 0 || ((u = i.hover) == null ? void 0 : u.length) > 0, a = Array.isArray(i.click) && i.click.length ? i.click : null, o = i.macro || null;
  !r && !a && !o || (hn.set(t.id, { doc: t, placeable: e, animConfig: i, clickConfig: a, macroUuid: o, placeableType: n }), r && jc(t.id, e, i));
}
c(Xu, "registerPlaceable");
function Vm() {
  var i, r;
  for (const a of Gn.keys())
    ma(a);
  if (hn.clear(), $r.clear(), Dt = null, Je !== null) {
    const a = document.getElementById("board");
    a && (a.style.cursor = Je), Je = null;
  }
  const t = document.getElementById("board");
  Nt && (t == null || t.removeEventListener("pointermove", Nt), Nt = null), Kt && (t == null || t.removeEventListener("pointerdown", Kt), Kt = null), Jt && (t == null || t.removeEventListener("pointerleave", Jt), Jt = null);
  const e = (i = canvas.tiles) == null ? void 0 : i.placeables;
  if (Array.isArray(e))
    for (const a of e)
      Xu(a.document, a, "tile");
  const n = (r = canvas.drawings) == null ? void 0 : r.placeables;
  if (Array.isArray(n))
    for (const a of n)
      Xu(a.document, a, "drawing");
  hn.size !== 0 && (Nt = Bm, Kt = jm, Jt = Um, t == null || t.addEventListener("pointermove", Nt), t == null || t.addEventListener("pointerdown", Kt), t == null || t.addEventListener("pointerleave", Jt));
}
c(Vm, "rebuild");
function Hv(t) {
  Wm(t, "tile");
}
c(Hv, "updateTile");
function qv(t) {
  Uc(t);
}
c(qv, "removeTile");
function Bv(t) {
  Wm(t, "drawing");
}
c(Bv, "updateDrawing");
function jv(t) {
  Uc(t);
}
c(jv, "removeDrawing");
function Wm(t, e) {
  var l, u, d;
  const n = t.id, i = Bc(t), r = i && (((l = i.always) == null ? void 0 : l.length) > 0 || ((u = i.idle) == null ? void 0 : u.length) > 0 || ((d = i.hover) == null ? void 0 : d.length) > 0), a = i && Array.isArray(i.click) && i.click.length ? i.click : null, o = (i == null ? void 0 : i.macro) || null;
  if (!r && !a && !o) {
    Uc(t);
    return;
  }
  ma(n);
  const s = t.object;
  if (!s) {
    hn.delete(n);
    return;
  }
  hn.set(n, { doc: t, placeable: s, animConfig: i, clickConfig: a, macroUuid: o, placeableType: e }), r && jc(n, s, i), Uv();
}
c(Wm, "updatePlaceable");
function Uc(t) {
  const e = t.id;
  if (ma(e), hn.delete(e), $r.delete(e), Dt === e && (Dt = null, Je !== null)) {
    const n = document.getElementById("board");
    n && (n.style.cursor = Je), Je = null;
  }
  if (hn.size === 0) {
    const n = document.getElementById("board");
    Nt && (n == null || n.removeEventListener("pointermove", Nt), Nt = null), Kt && (n == null || n.removeEventListener("pointerdown", Kt), Kt = null), Jt && (n == null || n.removeEventListener("pointerleave", Jt), Jt = null);
  }
}
c(Uc, "removePlaceable");
function Uv() {
  if (hn.size === 0 || Nt) return;
  const t = document.getElementById("board");
  t && (Nt = Bm, Kt = jm, Jt = Um, t.addEventListener("pointermove", Nt), t.addEventListener("pointerdown", Kt), t.addEventListener("pointerleave", Jt));
}
c(Uv, "ensureListeners");
function Pi(t, e, n) {
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
c(Pi, "buildSelectGroup");
function Ri(t, e, n, i = {}) {
  const r = document.createElement("div");
  r.classList.add("form-group");
  const a = document.createElement("label");
  a.textContent = t;
  const o = document.createElement("input");
  o.type = "number", o.classList.add(e), o.value = String(n);
  for (const [s, l] of Object.entries(i)) o.setAttribute(s, l);
  return r.append(a, o), r;
}
c(Ri, "buildNumberGroup");
function bc(t, e, n) {
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
c(bc, "buildColorGroup");
let oe = null;
function Gs() {
  for (const t of document.querySelectorAll(".idle-anim__slot--insert-before, .idle-anim__slot--insert-after"))
    t.classList.remove("idle-anim__slot--insert-before", "idle-anim__slot--insert-after");
}
c(Gs, "clearInsertIndicators");
function Qu(t) {
  for (const e of document.querySelectorAll(".idle-anim__slots"))
    e.classList.toggle("idle-anim__slots--drag-active", t);
}
c(Qu, "setDragActive");
function Eo(t, e) {
  t.dispatchEvent(new CustomEvent("slot-reorder", { detail: { card: e } }));
}
c(Eo, "notifyReorder");
function Gm(t, { dropGroup: e, handleSelector: n = ".idle-anim__slot-header" }) {
  t.setAttribute("draggable", "true");
  let i = !1;
  t.addEventListener("pointerdown", (r) => {
    i = !!r.target.closest(n);
  }), t.addEventListener("dragstart", (r) => {
    if (!i) {
      r.preventDefault();
      return;
    }
    oe = { card: t, sourceContainer: t.parentElement, group: e, insertMode: null, insertTarget: null }, t.classList.add("is-dragging"), Qu(!0), r.dataTransfer.effectAllowed = "move", r.dataTransfer.setData("text/plain", "");
  }), t.addEventListener("dragover", (r) => {
    if (!oe || oe.group !== e || oe.card === t) return;
    r.preventDefault(), r.dataTransfer.dropEffect = "move";
    const a = t.getBoundingClientRect(), o = a.top + a.height / 2, s = r.clientY < o ? "before" : "after";
    (oe.insertTarget !== t || oe.insertMode !== s) && (Gs(), t.classList.add(s === "before" ? "idle-anim__slot--insert-before" : "idle-anim__slot--insert-after"), oe.insertTarget = t, oe.insertMode = s);
  }), t.addEventListener("dragleave", () => {
    t.classList.remove("idle-anim__slot--insert-before", "idle-anim__slot--insert-after"), (oe == null ? void 0 : oe.insertTarget) === t && (oe.insertTarget = null, oe.insertMode = null);
  }), t.addEventListener("drop", (r) => {
    if (r.preventDefault(), r.stopPropagation(), Gs(), !oe || oe.group !== e || oe.card === t) return;
    const a = oe.card, o = oe.sourceContainer, s = t.parentElement;
    oe.insertMode === "after" ? s.insertBefore(a, t.nextSibling) : s.insertBefore(a, t), Eo(s, a), o !== s && Eo(o, a), oe = null;
  }), t.addEventListener("dragend", () => {
    t.classList.remove("is-dragging"), Gs(), Qu(!1);
    for (const r of document.querySelectorAll(".idle-anim__slots--drag-over"))
      r.classList.remove("idle-anim__slots--drag-over");
    oe = null;
  });
}
c(Gm, "makeDraggable");
function zm(t, { dropGroup: e, onDrop: n }) {
  t.addEventListener("dragover", (i) => {
    !oe || oe.group !== e || (i.preventDefault(), i.dataTransfer.dropEffect = "move");
  }), t.addEventListener("dragenter", (i) => {
    !oe || oe.group !== e || (i.preventDefault(), t.classList.add("idle-anim__slots--drag-over"));
  }), t.addEventListener("dragleave", (i) => {
    i.relatedTarget && t.contains(i.relatedTarget) || t.classList.remove("idle-anim__slots--drag-over");
  }), t.addEventListener("drop", (i) => {
    if (i.preventDefault(), t.classList.remove("idle-anim__slots--drag-over"), !oe || oe.group !== e) return;
    const r = oe.card, a = oe.sourceContainer;
    t.appendChild(r), Eo(t, r), a !== t && Eo(a, r), oe = null;
  }), t.addEventListener("slot-reorder", (i) => {
    n == null || n(i.detail.card, t);
  });
}
c(zm, "makeDropContainer");
const La = "eidolon-utilities", Zu = "tile-animations", Vv = "tile-interactions", Wv = "idle-animation", Gv = "eidolon-idle-animation", zv = "fa-solid fa-wave-pulse", Ym = [
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
], Yv = [
  { value: "tween-prop", label: "Numeric" },
  { value: "tween-tint", label: "Tint" },
  { value: "tween-scale", label: "Scale" }
], Km = {
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
}, Hi = {
  attribute: "alpha",
  from: 1,
  to: 0.5,
  period: 300,
  mode: "bounce"
}, Vi = {
  fromColor: "#ffffff",
  toColor: "#ffaa00",
  period: 500,
  mode: "bounce"
}, Wa = {
  type: "tile-scale",
  fromScale: 1,
  toScale: 1.2,
  period: 300,
  easing: "easeOutCubic",
  mode: "bounce"
}, Jm = [
  { value: "alpha", label: "Alpha (Opacity)" },
  { value: "rotation", label: "Rotation" },
  { value: "texture.rotation", label: "Texture Rotation" }
];
let Cn = null;
function Kv(t) {
  var e;
  return (t == null ? void 0 : t.document) ?? ((e = t == null ? void 0 : t.object) == null ? void 0 : e.document) ?? (t == null ? void 0 : t.object) ?? null;
}
c(Kv, "getPlaceableDocument");
function Jv(t, e) {
  const n = document.createElement("div");
  n.classList.add("form-group");
  const i = document.createElement("label");
  i.textContent = "Type", n.appendChild(i);
  const r = document.createElement("select");
  r.classList.add(e);
  const a = document.createElement("optgroup");
  a.label = "Effects";
  for (const s of Ym) {
    const l = document.createElement("option");
    l.value = s.value, l.textContent = s.label, s.value === t && (l.selected = !0), a.appendChild(l);
  }
  r.appendChild(a);
  const o = document.createElement("optgroup");
  o.label = "Tweens";
  for (const s of Yv) {
    const l = document.createElement("option");
    l.value = s.value, l.textContent = s.label, s.value === t && (l.selected = !0), o.appendChild(l);
  }
  return r.appendChild(o), n.appendChild(r), n;
}
c(Jv, "buildEffectTypeSelect");
function ed(t) {
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
  const n = Ym.find((i) => i.value === e);
  return (n == null ? void 0 : n.label) ?? e;
}
c(ed, "summarizeEffectConfig");
function td(t, e, n, i) {
  const r = t.name ?? "float", a = Nc(), o = nr(), s = document.createElement("div");
  s.classList.add("idle-anim__slot", "is-collapsed", n), s.dataset.index = String(e);
  const l = document.createElement("div");
  l.classList.add("idle-anim__slot-header");
  const u = document.createElement("i");
  u.classList.add("fa-solid", "fa-chevron-right", "idle-anim__slot-chevron");
  const d = document.createElement("span");
  d.classList.add("idle-anim__slot-title"), d.textContent = `${i} ${e + 1}`;
  const m = document.createElement("span");
  m.classList.add("idle-anim__slot-summary"), m.textContent = ed(t);
  const f = document.createElement("button");
  f.type = "button", f.classList.add("idle-anim__slot-remove"), f.innerHTML = '<i class="fa-solid fa-xmark"></i>', f.title = "Remove effect", l.append(u, d, m, f), s.appendChild(l);
  const h = document.createElement("div");
  h.classList.add("idle-anim__slot-body");
  const p = Jv(r, "ti-effect__type");
  h.appendChild(p);
  const y = document.createElement("div");
  y.classList.add("idle-anim__type-fields"), h.appendChild(y);
  function w(v, E) {
    y.innerHTML = "";
    const T = Km[v];
    if (T)
      for (const k of T) {
        const O = E[k.key] ?? k.default;
        if (k.type === "color")
          y.appendChild(bc(k.label, `ti-effect__${k.key}`, O));
        else if (k.type === "select") {
          let _;
          k.options === "interpolation" ? _ = o.map((N) => ({ value: N, label: N, selected: N === O })) : Array.isArray(k.options) ? _ = k.options.map((N) => ({ value: N.value, label: N.label, selected: N.value === O })) : _ = a.map((N) => ({ value: N, label: N, selected: N === O })), y.appendChild(Pi(k.label, `ti-effect__${k.key}`, _));
        } else
          y.appendChild(Ri(k.label, `ti-effect__${k.key}`, O, k.attrs ?? {}));
      }
  }
  c(w, "renderParams"), w(r, t), s.appendChild(h);
  const b = s.querySelector(".ti-effect__type");
  return b == null || b.addEventListener("change", () => {
    w(b.value, {});
  }), l.addEventListener("click", (v) => {
    if (!v.target.closest(".idle-anim__slot-remove") && (s.classList.toggle("is-collapsed"), s.classList.contains("is-collapsed"))) {
      const E = Xm(s);
      E && (m.textContent = ed(E));
    }
  }), f.addEventListener("click", (v) => {
    v.stopPropagation();
    const E = s.parentElement;
    s.remove(), E && Es(E, n, i);
  }), Gm(s, { dropGroup: "effect" }), s;
}
c(td, "buildEffectSlot");
function Xm(t) {
  var r;
  const e = ((r = t.querySelector(".ti-effect__type")) == null ? void 0 : r.value) ?? "float", n = Km[e], i = { name: e };
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
c(Xm, "readEffectSlot");
function nd(t) {
  if (!t) return "";
  const e = t.type ?? "tile-prop", n = t.mode ?? "bounce", i = n.charAt(0).toUpperCase() + n.slice(1);
  if (e === "tile-tint")
    return `${i} Tint ${t.fromColor ?? "?"} → ${t.toColor ?? "?"} (${t.period ?? "?"}ms)`;
  if (e === "tile-scale") {
    const o = t.fromScale != null ? `${Math.round(t.fromScale * 100)}%` : "?", s = t.toScale != null ? `${Math.round(t.toScale * 100)}%` : "?";
    return `${i} Scale ${o} → ${s} (${t.period ?? "?"}ms)`;
  }
  const r = Jm.find((o) => o.value === t.attribute), a = (r == null ? void 0 : r.label) ?? t.attribute ?? "?";
  return `${i} ${a} ${t.from ?? "?"} → ${t.to ?? "?"} (${t.period ?? "?"}ms)`;
}
c(nd, "summarizeClickConfig");
function id(t, e) {
  const n = t.type ?? "tile-prop", i = t.mode ?? "bounce", r = Nc(), a = document.createElement("div");
  a.classList.add("idle-anim__slot", "is-collapsed", "ti-click-slot"), a.dataset.index = String(e);
  const o = document.createElement("div");
  o.classList.add("idle-anim__slot-header");
  const s = document.createElement("i");
  s.classList.add("fa-solid", "fa-chevron-right", "idle-anim__slot-chevron");
  const l = document.createElement("span");
  l.classList.add("idle-anim__slot-title"), l.textContent = `Animation ${e + 1}`;
  const u = document.createElement("span");
  u.classList.add("idle-anim__slot-summary"), u.textContent = nd(t);
  const d = document.createElement("button");
  d.type = "button", d.classList.add("idle-anim__slot-remove"), d.innerHTML = '<i class="fa-solid fa-xmark"></i>', d.title = "Remove animation", o.append(s, l, u, d), a.appendChild(o);
  const m = document.createElement("div");
  m.classList.add("idle-anim__slot-body");
  const f = document.createElement("div");
  f.classList.add("idle-anim__range-row"), f.appendChild(Pi("Mode", "ti-click__mode", [
    { value: "bounce", label: "Bounce", selected: i === "bounce" },
    { value: "toggle", label: "Toggle", selected: i === "toggle" }
  ])), f.appendChild(Pi("Type", "ti-click__type", [
    { value: "tile-prop", label: "Numeric", selected: n === "tile-prop" },
    { value: "tile-tint", label: "Tint", selected: n === "tile-tint" },
    { value: "tile-scale", label: "Scale", selected: n === "tile-scale" }
  ])), m.appendChild(f);
  const h = document.createElement("div");
  h.classList.add("idle-anim__type-fields"), m.appendChild(h);
  function p(v, E) {
    if (h.innerHTML = "", v === "tile-tint") {
      const T = nr(), k = E.fromColor ?? Vi.fromColor, O = E.toColor ?? Vi.toColor, _ = E.mode ?? "oklch", N = document.createElement("div");
      N.classList.add("idle-anim__range-row"), N.appendChild(bc("From", "ti-click__from-color", k)), N.appendChild(bc("To", "ti-click__to-color", O)), h.appendChild(N), h.appendChild(Pi(
        "Interpolation",
        "ti-click__color-mode",
        T.map((D) => ({ value: D, label: D, selected: D === _ }))
      ));
    } else if (v === "tile-scale") {
      const T = E.fromScale ?? Wa.fromScale, k = E.toScale ?? Wa.toScale, O = document.createElement("div");
      O.classList.add("idle-anim__range-row"), O.appendChild(Ri("From", "ti-click__from-scale", T, { step: "0.01", min: "0.01" })), O.appendChild(Ri("To", "ti-click__to-scale", k, { step: "0.01", min: "0.01" })), h.appendChild(O);
      const _ = document.createElement("p");
      _.classList.add("idle-anim__hint"), _.textContent = "1.0 = original size. Scales from center.", h.appendChild(_);
    } else {
      const T = E.attribute ?? Hi.attribute, k = E.from ?? Hi.from, O = E.to ?? Hi.to;
      h.appendChild(Pi(
        "Attribute",
        "ti-click__attribute",
        Jm.map((N) => ({ value: N.value, label: N.label, selected: N.value === T }))
      ));
      const _ = document.createElement("div");
      _.classList.add("idle-anim__range-row"), _.appendChild(Ri("From", "ti-click__from", k, { step: "0.01" })), _.appendChild(Ri("To", "ti-click__to", O, { step: "0.01" })), h.appendChild(_);
    }
  }
  c(p, "renderTypeFields"), p(n, t);
  const y = t.period ?? (n === "tile-tint" ? Vi.period : Hi.period), w = t.easing ?? "easeOutCubic";
  m.appendChild(Ri("Period (ms)", "ti-click__period", y, { min: "50", step: "50" })), m.appendChild(Pi(
    "Easing",
    "ti-click__easing",
    r.map((v) => ({ value: v, label: v, selected: v === w }))
  )), a.appendChild(m);
  const b = a.querySelector(".ti-click__type");
  return b == null || b.addEventListener("change", () => {
    const v = b.value;
    p(v, v === "tile-tint" ? Vi : v === "tile-scale" ? Wa : Hi);
  }), o.addEventListener("click", (v) => {
    if (!v.target.closest(".idle-anim__slot-remove") && (a.classList.toggle("is-collapsed"), a.classList.contains("is-collapsed"))) {
      const E = Qm(a);
      E && (u.textContent = nd(E));
    }
  }), d.addEventListener("click", (v) => {
    v.stopPropagation();
    const E = a.parentElement;
    a.remove(), E && Es(E, "ti-click-slot", "Animation");
  }), Gm(a, { dropGroup: "click" }), a;
}
c(id, "buildClickSlot");
function Qm(t) {
  var u, d, m, f, h, p, y, w, b, v, E, T, k, O;
  const e = ((u = t.querySelector(".ti-click__type")) == null ? void 0 : u.value) ?? "tile-prop", n = ((d = t.querySelector(".ti-click__mode")) == null ? void 0 : d.value) ?? "bounce", i = Number.parseInt((m = t.querySelector(".ti-click__period")) == null ? void 0 : m.value, 10), r = ((f = t.querySelector(".ti-click__easing")) == null ? void 0 : f.value) ?? "easeOutCubic";
  if (!i || i <= 0) return null;
  const a = { mode: n, period: i, easing: r };
  if (e === "tile-tint") {
    const _ = ((h = t.querySelector(".ti-click__from-color")) == null ? void 0 : h.value) ?? ((p = t.querySelector(".ti-click__from-color-text")) == null ? void 0 : p.value) ?? Vi.fromColor, N = ((y = t.querySelector(".ti-click__to-color")) == null ? void 0 : y.value) ?? ((w = t.querySelector(".ti-click__to-color-text")) == null ? void 0 : w.value) ?? Vi.toColor, D = ((b = t.querySelector(".ti-click__color-mode")) == null ? void 0 : b.value) ?? "oklch";
    return { type: "tile-tint", fromColor: _, toColor: N, mode: D, ...a };
  }
  if (e === "tile-scale") {
    const _ = Number.parseFloat((v = t.querySelector(".ti-click__from-scale")) == null ? void 0 : v.value), N = Number.parseFloat((E = t.querySelector(".ti-click__to-scale")) == null ? void 0 : E.value);
    return Number.isNaN(_) || Number.isNaN(N) || _ <= 0 || N <= 0 ? null : { type: "tile-scale", fromScale: _, toScale: N, ...a };
  }
  const o = ((T = t.querySelector(".ti-click__attribute")) == null ? void 0 : T.value) ?? Hi.attribute, s = Number.parseFloat((k = t.querySelector(".ti-click__from")) == null ? void 0 : k.value), l = Number.parseFloat((O = t.querySelector(".ti-click__to")) == null ? void 0 : O.value);
  return Number.isNaN(s) || Number.isNaN(l) ? null : { type: "tile-prop", attribute: o, from: s, to: l, ...a };
}
c(Qm, "readClickSlot");
function Es(t, e, n) {
  t.querySelectorAll(`.${e}`).forEach((r, a) => {
    r.dataset.index = String(a);
    const o = r.querySelector(".idle-anim__slot-title");
    o && (o.textContent = `${n} ${a + 1}`);
  });
}
c(Es, "renumberSlots");
function zs(t, { heading: e, hint: n, configs: i, slotClass: r, titlePrefix: a, dropGroup: o, defaultEffect: s }) {
  const l = document.createElement("div");
  l.classList.add("ti-section-heading");
  const u = document.createElement("h3");
  u.textContent = e, l.appendChild(u);
  const d = document.createElement("div");
  d.classList.add("idle-anim__slots", `${r}s`);
  const m = document.createElement("button");
  m.type = "button", m.classList.add("ti-section-heading__add"), m.innerHTML = '<i class="fa-solid fa-plus"></i>', m.title = `Add ${e.toLowerCase()} effect`, m.addEventListener("click", () => {
    const p = d.querySelectorAll(`.${r}`).length, y = td(s, p, r, a);
    y.classList.remove("is-collapsed"), d.appendChild(y);
  }), l.appendChild(m), t.appendChild(l);
  const f = document.createElement("p");
  f.classList.add("idle-anim__hint"), f.textContent = n, t.appendChild(f);
  for (let p = 0; p < i.length; p++)
    d.appendChild(td(i[p], p, r, a));
  t.appendChild(d);
  const h = ["ti-always-slot", "ti-idle-slot", "ti-hover-slot"];
  return zm(d, {
    dropGroup: o,
    onDrop(p) {
      if (p.parentElement === d)
        for (const y of h)
          y !== r && p.classList.contains(y) && p.classList.replace(y, r);
      Es(d, r, a);
    }
  }), d;
}
c(zs, "buildEffectCategory");
function Xv(t) {
  const e = Bc(t) ?? { always: [], idle: [], hover: [], click: [] }, n = document.createElement("section");
  n.classList.add("eidolon-tile-interactions"), zs(n, {
    heading: "Always",
    hint: "Runs continuously, ignores pointer state.",
    configs: e.always ?? [],
    slotClass: "ti-always-slot",
    titlePrefix: "Effect",
    dropGroup: "effect",
    defaultEffect: { name: "embers" }
  }), zs(n, {
    heading: "Idle",
    hint: "Plays by default. Stops when pointer enters the tile.",
    configs: e.idle ?? [],
    slotClass: "ti-idle-slot",
    titlePrefix: "Effect",
    dropGroup: "effect",
    defaultEffect: { name: "float" }
  }), zs(n, {
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
  const a = e.click ?? [], o = document.createElement("div");
  o.classList.add("idle-anim__slots", "ti-click-slots");
  const s = document.createElement("button");
  s.type = "button", s.classList.add("ti-section-heading__add"), s.innerHTML = '<i class="fa-solid fa-plus"></i>', s.title = "Add click animation", s.addEventListener("click", () => {
    const k = o.querySelectorAll(".ti-click-slot").length, O = id(Wa, k);
    O.classList.remove("is-collapsed"), o.appendChild(O);
  }), i.appendChild(s), n.appendChild(i);
  const l = document.createElement("p");
  l.classList.add("idle-anim__hint"), l.textContent = "One-shot animation on click.", n.appendChild(l);
  for (let k = 0; k < a.length; k++)
    o.appendChild(id(a[k], k));
  n.appendChild(o), zm(o, {
    dropGroup: "click",
    onDrop() {
      Es(o, "ti-click-slot", "Animation");
    }
  });
  const u = document.createElement("div");
  u.classList.add("ti-section-heading");
  const d = document.createElement("h3");
  d.textContent = "Options", u.appendChild(d), n.appendChild(u);
  const m = document.createElement("div");
  m.classList.add("form-group");
  const f = document.createElement("label");
  f.textContent = "Pointer cursor on hover";
  const h = document.createElement("input");
  h.type = "checkbox", h.classList.add("ti-cursor-check"), h.checked = e.cursor ?? !1, m.append(f, h), n.appendChild(m);
  const p = document.createElement("p");
  p.classList.add("idle-anim__hint"), p.textContent = "Execute a macro when clicked. Drag a macro here or paste its UUID.", n.appendChild(p);
  const y = document.createElement("div");
  y.classList.add("form-group", "ti-macro");
  const w = document.createElement("label");
  w.textContent = "Macro", y.appendChild(w);
  const b = document.createElement("input");
  b.type = "text", b.classList.add("ti-macro__uuid"), b.placeholder = "Drag a macro here or paste UUID", b.value = e.macro ?? "", y.appendChild(b);
  const v = document.createElement("button");
  v.type = "button", v.classList.add("ti-macro__clear"), v.innerHTML = '<i class="fa-solid fa-xmark"></i>', v.title = "Clear macro", v.addEventListener("click", () => {
    b.value = "";
  }), y.appendChild(v), y.addEventListener("dragover", (k) => {
    k.preventDefault(), k.dataTransfer.dropEffect = "link";
  }), y.addEventListener("drop", (k) => {
    k.preventDefault();
    try {
      const O = k.dataTransfer.getData("text/plain"), _ = JSON.parse(O);
      _.type === "Macro" && _.uuid && (b.value = _.uuid);
    } catch {
    }
  }), n.appendChild(y);
  const E = document.createElement("div");
  E.classList.add("idle-anim__actions");
  const T = document.createElement("button");
  return T.type = "button", T.classList.add("idle-anim__preview"), T.innerHTML = '<i class="fa-solid fa-play"></i> Preview', E.append(T), n.appendChild(E), n;
}
c(Xv, "buildSectionContent");
function Ys(t, e) {
  const n = [];
  for (const i of t.querySelectorAll(`.${e}`)) {
    const r = Xm(i);
    r && n.push(r);
  }
  return n;
}
c(Ys, "readAllEffectSlots");
function Qv(t) {
  const e = [];
  for (const n of t.querySelectorAll(".ti-click-slot")) {
    const i = Qm(n);
    i && e.push(i);
  }
  return e;
}
c(Qv, "readAllClickConfigs");
function rd(t) {
  var r, a, o;
  const e = ((a = (r = t.querySelector(".ti-macro__uuid")) == null ? void 0 : r.value) == null ? void 0 : a.trim()) || null, n = ((o = t.querySelector(".ti-cursor-check")) == null ? void 0 : o.checked) ?? !1, i = {
    always: Ys(t, "ti-always-slot"),
    idle: Ys(t, "ti-idle-slot"),
    hover: Ys(t, "ti-hover-slot"),
    click: Qv(t)
  };
  return e && (i.macro = e), n && (i.cursor = !0), i;
}
c(rd, "readFormConfig");
function Zm(t, e) {
  var l;
  const n = qt(e);
  if (!n) return;
  const i = Kv(t);
  if (!i) return;
  const r = _c(t, n, Gv, "Animations", zv);
  if (!r || r.querySelector(".eidolon-tile-interactions")) return;
  const a = r.closest("form");
  a && (a.noValidate = !0);
  const o = Xv(i);
  r.appendChild(o), (l = t.setPosition) == null || l.call(t, { height: "auto" });
  const s = r.querySelector(".idle-anim__preview");
  s == null || s.addEventListener("click", () => {
    const u = i.object;
    if (!u) return;
    if (Cn) {
      Cn.detach(), Cn = null, s.classList.remove("is-active"), s.innerHTML = '<i class="fa-solid fa-play"></i> Preview';
      return;
    }
    const d = rd(o);
    (d.always.length > 0 || d.idle.length > 0 || d.hover.length > 0) && (Cn = new Ai(u, d), Cn.start("idle"), s.classList.add("is-active"), s.innerHTML = '<i class="fa-solid fa-stop"></i> Stop');
  }), a && a.addEventListener("submit", () => {
    Cn && (Cn.detach(), Cn = null);
    const u = rd(o), d = u.always.length > 0 || u.idle.length > 0 || u.hover.length > 0 || u.click.length > 0 || !!u.macro || !!u.cursor, m = {
      [`flags.${La}.-=${Zu}`]: null,
      [`flags.${La}.-=${Vv}`]: null,
      [`flags.${La}.-=${Wv}`]: null
    };
    i.update(m).then(() => {
      if (d)
        return i.update({ [`flags.${La}.${Zu}`]: u });
    });
  });
}
c(Zm, "renderAnimationSection");
const Co = /* @__PURE__ */ new Map();
function eh(t) {
  const e = Co.get(t);
  e && (e.controller.abort(), Co.delete(t), e.restore());
}
c(eh, "stopLoopByKey");
function th(t) {
  const e = `${t}::`;
  for (const n of [...Co.keys()])
    n.startsWith(e) && eh(n);
}
c(th, "stopLoopsForTile");
function nh() {
  for (const t of [...Co.keys()])
    eh(t);
}
c(nh, "stopAllLoops");
const ih = "eidolon-utilities", rh = ["tile-animations", "tile-interactions", "idle-animation"];
function Zv() {
  nh(), Vm();
}
c(Zv, "onCanvasTearDown");
function ew() {
  nh(), Vm();
}
c(ew, "onCanvasReady$1");
function tw(t, e) {
  var r;
  const n = (r = e == null ? void 0 : e.flags) == null ? void 0 : r[ih];
  !n || !rh.some((a) => a in n || `-=${a}` in n) || (th(t.id), Hv(t));
}
c(tw, "onUpdateTile");
function nw(t) {
  th(t.id), qv(t);
}
c(nw, "onDeleteTile");
function iw(t, e) {
  Zm(t, e);
}
c(iw, "onRenderTileConfig");
function rw(t, e) {
  var r;
  const n = (r = e == null ? void 0 : e.flags) == null ? void 0 : r[ih];
  !n || !rh.some((a) => a in n || `-=${a}` in n) || Bv(t);
}
c(rw, "onUpdateDrawing");
function aw(t) {
  jv(t);
}
c(aw, "onDeleteDrawing");
function ow(t, e) {
  Zm(t, e);
}
c(ow, "onRenderDrawingConfig");
function sw() {
  Hooks.on("canvasTearDown", Zv), Hooks.on("canvasReady", ew), Hooks.on("updateTile", tw), Hooks.on("deleteTile", nw), Hooks.on("renderTileConfig", iw), Hooks.on("updateDrawing", rw), Hooks.on("deleteDrawing", aw), Hooks.on("renderDrawingConfig", ow);
}
c(sw, "registerTileInteractionHooks");
sw();
const So = /* @__PURE__ */ new Map();
function Vc(t, e) {
  So.has(t) && console.warn(`[eidolon-utilities] Door-link behavior "${t}" is already registered. Overwriting.`), So.set(t, e);
}
c(Vc, "registerBehavior");
function ah(t) {
  return So.get(t);
}
c(ah, "getBehavior");
function Cs() {
  return So;
}
c(Cs, "getAllBehaviors");
const lw = {
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
}, cw = {
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
}, jr = "eidolon-utilities", vc = "door-links", oh = "door-link-default";
function lr(t) {
  var e, n;
  return ((n = (e = t == null ? void 0 : t.flags) == null ? void 0 : e[jr]) == null ? void 0 : n[vc]) ?? {};
}
c(lr, "getDoorLinks");
function Wc(t, e) {
  const n = { [`flags.${jr}.${vc}`]: e }, i = lr(t);
  for (const r of Object.keys(i))
    r in e || (n[`flags.${jr}.${vc}.-=${r}`] = null);
  return t.update(n, { render: !1 });
}
c(Wc, "setDoorLinks");
function uw(t, e) {
  const n = lr(t);
  let i = !1;
  const r = {};
  for (const [a, o] of Object.entries(n)) {
    const s = o.filter((l) => l !== e);
    s.length !== o.length && (i = !0), s.length > 0 && (r[a] = s);
  }
  return i ? Wc(t, r) : null;
}
c(uw, "removeWallFromAllLinks");
function Gc(t) {
  var e, n;
  return ((n = (e = t == null ? void 0 : t.flags) == null ? void 0 : e[jr]) == null ? void 0 : n[oh]) ?? null;
}
c(Gc, "getDefaultState");
function sh(t) {
  const e = {
    light: t.light ?? 20,
    move: t.move ?? 20,
    sight: t.sight ?? 20,
    sound: t.sound ?? 20
  };
  return t.update({ [`flags.${jr}.${oh}`]: e });
}
c(sh, "captureDefaultState");
function ad(t) {
  return Gc(t) ? Promise.resolve() : sh(t);
}
c(ad, "ensureDefaultState");
async function lh(t, e) {
  const n = t.parent;
  if (!n) return;
  const i = lr(t), r = Object.keys(i);
  if (r.length === 0) return;
  const a = e === 1, o = [];
  let s = null;
  for (const l of r) {
    const u = ah(l);
    if (!u) {
      console.warn(`[eidolon-utilities] Unknown door-link behavior: "${l}"`);
      continue;
    }
    const d = i[l];
    if (d != null && d.length)
      for (const m of d) {
        const f = n.walls.get(m);
        if (!f) continue;
        const h = Gc(f);
        if (h)
          if (a) {
            const p = u.apply(f, h);
            o.push({ _id: m, ...p });
          } else {
            s || (s = dw(n, t.id));
            const p = s.get(m);
            if ((p == null ? void 0 : p.length) > 0)
              continue;
            const y = u.revert(f, h);
            o.push({ _id: m, ...y });
          }
      }
  }
  o.length > 0 && await n.updateEmbeddedDocuments("Wall", o);
}
c(lh, "onDoorStateChange");
function dw(t, e) {
  const n = /* @__PURE__ */ new Map();
  for (const i of t.walls) {
    if (i.id === e || i.door === 0 || i.ds !== 1) continue;
    const r = lr(i);
    for (const a of Object.values(r))
      for (const o of a)
        n.has(o) || n.set(o, []), n.get(o).push(i);
  }
  return n;
}
c(dw, "buildReverseIndex");
const Ur = /* @__PURE__ */ new WeakMap(), To = /* @__PURE__ */ new Set();
function zc(t, e = {}) {
  var b;
  if (!(t != null && t.document)) return !1;
  wc(t);
  const n = e.color ?? 16739115, i = e.alpha ?? 0.85, r = e.width ?? 3, a = e.pulse ?? !0, [o, s, l, u] = t.document.c, d = o - t.x, m = s - t.y, f = l - t.x, h = u - t.y, p = new PIXI.Graphics(), y = [
    { w: r + 24, a: i * 0.08 },
    { w: r + 18, a: i * 0.14 },
    { w: r + 12, a: i * 0.25 },
    { w: r + 6, a: i * 0.4 }
  ];
  for (const v of y)
    p.lineStyle(v.w, n, v.a), p.moveTo(d, m), p.lineTo(f, h);
  p.lineStyle(r, n, i), p.moveTo(d, m), p.lineTo(f, h), p.name = "eidolonDoorLinkHighlight", t.addChild(p);
  const w = { gfx: p, pulseData: null };
  if (a && ((b = canvas.app) != null && b.ticker)) {
    const v = {
      elapsed: 0,
      fn: /* @__PURE__ */ c((E) => {
        v.elapsed += E;
        const T = (Math.sin(v.elapsed * 0.05) + 1) / 2;
        p.alpha = i * (0.4 + 0.6 * T);
      }, "fn")
    };
    canvas.app.ticker.add(v.fn), w.pulseData = v, To.add(v);
  }
  return Ur.set(t, w), !0;
}
c(zc, "highlightWall");
function wc(t) {
  var n, i;
  if (!t) return;
  const e = Ur.get(t);
  e && (e.pulseData && ((i = (n = canvas.app) == null ? void 0 : n.ticker) == null || i.remove(e.pulseData.fn), To.delete(e.pulseData)), e.gfx && (e.gfx.parent && e.gfx.parent.removeChild(e.gfx), e.gfx.destroy({ children: !0 })), Ur.delete(t));
}
c(wc, "removeWallHighlight");
function ch() {
  var e, n, i;
  for (const r of To)
    (n = (e = canvas.app) == null ? void 0 : e.ticker) == null || n.remove(r.fn);
  To.clear();
  const t = (i = canvas.walls) == null ? void 0 : i.placeables;
  if (t)
    for (const r of t) {
      const a = Ur.get(r);
      a && (a.gfx && (a.gfx.parent && a.gfx.parent.removeChild(a.gfx), a.gfx.destroy({ children: !0 })), Ur.delete(r));
    }
}
c(ch, "clearWallHighlights");
let oi = null;
function fw(t) {
  var y, w, b, v, E;
  oi && oi.cancel();
  const { onPick: e, onUnpick: n, onCancel: i, excludeIds: r, getExcludeIds: a, sourceDoorId: o } = t;
  let s = null;
  (y = canvas.walls) == null || y.activate();
  for (const T of ((w = canvas.walls) == null ? void 0 : w.controlled) ?? [])
    (b = T.release) == null || b.call(T);
  const l = /* @__PURE__ */ c((T, k) => {
    var N, D, $;
    if (!k) return;
    const O = T.document ?? T;
    if (o && O.id === o) {
      (N = ui.notifications) == null || N.warn("Cannot link a door to itself.");
      return;
    }
    if ((a ? a() : r ?? /* @__PURE__ */ new Set()).has(O.id)) {
      (D = T.release) == null || D.call(T), n == null || n(O);
      return;
    }
    ($ = T.release) == null || $.call(T), e(O);
  }, "onControl"), u = /* @__PURE__ */ c((T, k) => {
    k ? (s = T, zc(T, { color: 65416, alpha: 0.7, width: 4, pulse: !1 })) : s === T && (wc(T), s = null);
  }, "onHover"), d = /* @__PURE__ */ c((T) => {
    T.key === "Escape" && (T.preventDefault(), T.stopPropagation(), p());
  }, "onKeydown"), m = /* @__PURE__ */ c((T) => {
    T.preventDefault(), p();
  }, "onContextMenu"), f = Hooks.on("controlWall", l), h = Hooks.on("hoverWall", u);
  document.addEventListener("keydown", d, { capture: !0 }), (v = canvas.stage) == null || v.addEventListener("rightclick", m), (E = ui.notifications) == null || E.info("Pick mode active — click a wall segment on the canvas, or press ESC to cancel.", { permanent: !1 });
  function p() {
    var T;
    oi && (oi = null, Hooks.off("controlWall", f), Hooks.off("hoverWall", h), document.removeEventListener("keydown", d, { capture: !0 }), (T = canvas.stage) == null || T.removeEventListener("rightclick", m), s && (wc(s), s = null), i == null || i());
  }
  return c(p, "cancel"), oi = { cancel: p }, { cancel: p };
}
c(fw, "enterWallPickMode");
function mw() {
  oi && oi.cancel();
}
c(mw, "cancelWallPickMode");
const hw = "eidolon-door-links", gw = "Links", pw = "fa-solid fa-link", mn = "eidolon-door-links";
function yw(t) {
  const [e, n, i, r] = t.c ?? [0, 0, 0, 0];
  return `(${e},${n}) → (${i},${r})`;
}
c(yw, "formatWallCoords");
function bw(t) {
  return t.length > 8 ? t.slice(0, 8) + "…" : t;
}
c(bw, "shortId");
function od(t) {
  const e = /* @__PURE__ */ new Set();
  for (const n of Object.values(t))
    for (const i of n) e.add(i);
  return e;
}
c(od, "allLinkedIds");
function vw(t) {
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
c(vw, "classifyWall");
function Ks(t, e, n, i) {
  const r = document.createElement("div");
  r.classList.add("dl-wall-entry"), r.dataset.wallId = t.id, r.style.cursor = "pointer", r.title = "Click to select on canvas", r.addEventListener("click", () => {
    var p, y;
    const h = t.object;
    h && ((p = canvas.walls) == null || p.activate(), h.controlled ? h.release() : h.control({ releaseOthers: !((y = globalThis.keyboard) != null && y.isModifierActive(KeyboardManager.MODIFIER_KEYS.SHIFT)) }));
  });
  const { label: a, cssClass: o } = vw(t);
  r.classList.add(o), r.title = a;
  const s = document.createElement("div");
  s.classList.add("dl-wall-entry__info");
  const l = document.createElement("span");
  l.classList.add("dl-wall-entry__coords"), l.textContent = `#${bw(t.id)}  ${yw(t)}`, s.appendChild(l);
  const u = Gc(t);
  if (u) {
    const h = document.createElement("span");
    h.classList.add("dl-wall-entry__defaults"), h.textContent = `L:${u.light} M:${u.move} S:${u.sight} Snd:${u.sound}`, s.appendChild(h);
  }
  const d = document.createElement("span");
  d.classList.add("dl-wall-entry__actions");
  const m = document.createElement("button");
  m.type = "button", m.classList.add("dl-wall-entry__btn"), m.innerHTML = '<i class="fa-solid fa-eye"></i>', m.title = "Highlight on canvas", m.addEventListener("click", (h) => {
    var y;
    h.stopPropagation();
    const p = t.object;
    p && zc(p, { color: ((y = Cs().get(e)) == null ? void 0 : y.highlightColor) ?? 16739115 });
  });
  const f = document.createElement("button");
  return f.type = "button", f.classList.add("dl-wall-entry__btn", "dl-wall-entry__btn--remove"), f.innerHTML = '<i class="fa-solid fa-xmark"></i>', f.title = "Remove link", f.addEventListener("click", (h) => {
    h.stopPropagation(), r.remove(), i(t.id, e);
  }), d.append(m, f), r.append(s, d), r;
}
c(Ks, "buildWallEntry");
function ww(t, e, n, i, r, a) {
  const o = document.createElement("div");
  o.classList.add("dl-behavior-section"), o.dataset.behavior = t;
  const s = document.createElement("div");
  s.classList.add("dl-behavior-section__header");
  const l = document.createElement("i");
  l.className = e.icon;
  const u = document.createElement("span");
  u.classList.add("dl-behavior-section__title"), u.textContent = e.label;
  const d = document.createElement("span");
  d.classList.add("dl-behavior-section__count"), d.textContent = `(${n.length})`;
  const m = document.createElement("span");
  m.classList.add("dl-behavior-section__header-actions");
  const f = document.createElement("button");
  f.type = "button", f.classList.add("dl-header-btn"), f.innerHTML = '<i class="fa-solid fa-crosshairs"></i>', f.title = "Pick from canvas";
  const h = document.createElement("button");
  h.type = "button", h.classList.add("dl-header-btn"), h.innerHTML = '<i class="fa-solid fa-object-group"></i>', h.title = "Add selected walls";
  const p = document.createElement("button");
  p.type = "button", p.classList.add("dl-header-btn"), p.innerHTML = '<i class="fa-solid fa-arrows-to-dot"></i>', p.title = "Select all linked walls on canvas", m.append(p, h, f), s.append(l, u, d, m), o.appendChild(s);
  const y = document.createElement("p");
  y.classList.add("dl-behavior-section__desc"), y.textContent = e.description, o.appendChild(y);
  const w = document.createElement("div");
  w.classList.add("dl-behavior-section__walls");
  function b() {
    const E = w.querySelectorAll(".dl-wall-entry");
    d.textContent = `(${E.length})`;
  }
  c(b, "updateCount");
  function v(E, T) {
    b(), a();
  }
  c(v, "handleRemove");
  for (const E of n) {
    const T = r.walls.get(E);
    T && w.appendChild(Ks(T, t, i, v));
  }
  return o.appendChild(w), f.addEventListener("click", (E) => {
    E.stopPropagation(), fw({
      sourceDoorId: i.id,
      getExcludeIds: /* @__PURE__ */ c(() => od(Lo(o.closest(`.${mn}`))), "getExcludeIds"),
      onPick: /* @__PURE__ */ c(async (T) => {
        await ad(T), w.appendChild(Ks(T, t, i, v)), b(), a();
      }, "onPick"),
      onUnpick: /* @__PURE__ */ c((T) => {
        const k = o.closest(`.${mn}`), O = k == null ? void 0 : k.querySelector(`.dl-wall-entry[data-wall-id="${T.id}"]`);
        if (O) {
          O.remove();
          for (const _ of k.querySelectorAll(".dl-behavior-section")) {
            const N = _.querySelectorAll(".dl-wall-entry");
            _.querySelector(".dl-behavior-section__count").textContent = `(${N.length})`;
          }
          a();
        }
      }, "onUnpick")
    });
  }), h.addEventListener("click", async (E) => {
    var N, D, $, F;
    E.stopPropagation();
    const T = ((N = canvas.walls) == null ? void 0 : N.controlled) ?? [];
    if (T.length === 0) {
      (D = ui.notifications) == null || D.warn("No walls selected. Select walls on the canvas first.");
      return;
    }
    const k = Lo(o.closest(`.${mn}`)), O = od(k);
    let _ = 0;
    for (const A of T) {
      const R = A.document;
      !R || R.id === i.id || O.has(R.id) || (await ad(R), w.appendChild(Ks(R, t, i, v)), O.add(R.id), _++);
    }
    _ > 0 ? (b(), a(), ($ = ui.notifications) == null || $.info(`Added ${_} wall(s) to ${e.label}.`)) : (F = ui.notifications) == null || F.warn("No eligible walls in selection (doors and already-linked walls are excluded).");
  }), p.addEventListener("click", (E) => {
    var N, D, $, F;
    E.stopPropagation();
    const T = [...w.querySelectorAll(".dl-wall-entry")].map((A) => A.dataset.wallId);
    if (T.length === 0) {
      (N = ui.notifications) == null || N.info("No walls to select.");
      return;
    }
    (D = canvas.walls) == null || D.activate();
    const k = T.map((A) => {
      var R;
      return (R = r.walls.get(A)) == null ? void 0 : R.object;
    }).filter(Boolean);
    if (k.length > 0 && k.every((A) => A.controlled)) {
      for (const A of k) A.release();
      return;
    }
    ($ = canvas.walls) == null || $.releaseAll();
    let _ = 0;
    for (const A of k)
      A.control({ releaseOthers: !1 }), _++;
    (F = ui.notifications) == null || F.info(`Selected ${_} wall(s).`);
  }), o;
}
c(ww, "buildBehaviorSection");
function Lo(t) {
  if (!t) return {};
  const e = {};
  for (const n of t.querySelectorAll(".dl-behavior-section")) {
    const i = n.dataset.behavior, r = [];
    for (const a of n.querySelectorAll(".dl-wall-entry"))
      a.dataset.wallId && r.push(a.dataset.wallId);
    r.length > 0 && (e[i] = r);
  }
  return e;
}
c(Lo, "readLinksFromDOM");
function Io(t, e, n) {
  var d;
  const i = document.createElement("div");
  i.classList.add(mn);
  const r = lr(t), a = Cs(), o = /* @__PURE__ */ c(() => {
    const m = Lo(i);
    Wc(t, m);
  }, "onLinksChanged");
  for (const [m, f] of a) {
    const h = r[m] ?? [];
    i.appendChild(ww(m, f, h, t, e, o));
  }
  const s = document.createElement("button");
  s.type = "button", s.classList.add("dl-btn", "dl-btn--recapture"), s.innerHTML = '<i class="fa-solid fa-camera-rotate"></i> Re-capture defaults', s.title = "Snapshot current wall properties as the closed-door default for all linked walls", s.addEventListener("click", async (m) => {
    var p;
    m.stopPropagation();
    const f = Lo(i);
    let h = 0;
    for (const y of Object.values(f))
      for (const w of y) {
        const b = e.walls.get(w);
        b && (await sh(b), h++);
      }
    (p = ui.notifications) == null || p.info(`Re-captured defaults for ${h} linked wall(s).`), n();
  }), i.appendChild(s), Lw(r, e);
  const l = /* @__PURE__ */ c((m, f) => {
    var y;
    const h = ((y = m.document) == null ? void 0 : y.id) ?? m.id, p = i.querySelector(`.dl-wall-entry[data-wall-id="${h}"]`);
    p && p.classList.toggle("dl-wall-entry--selected", f);
  }, "syncSelection"), u = Hooks.on("controlWall", l);
  i._dlSelectionHookId = u;
  for (const m of i.querySelectorAll(".dl-wall-entry")) {
    const f = e.walls.get(m.dataset.wallId);
    (d = f == null ? void 0 : f.object) != null && d.controlled && m.classList.add("dl-wall-entry--selected");
  }
  return i;
}
c(Io, "buildDoorLinksContent");
function Ew(t) {
  return t.querySelector(".standard-form [data-application-part='body']") ?? t.querySelector(".standard-form.scrollable") ?? null;
}
c(Ew, "findV2Body");
function Cw(t, e, n, i) {
  const r = Ew(e);
  if (!r) return !1;
  if (r.querySelector(`.${mn}`)) return !0;
  const a = document.createElement("fieldset");
  a.classList.add("dl-fieldset");
  const o = document.createElement("legend");
  o.textContent = "Door Links", a.appendChild(o);
  const s = /* @__PURE__ */ c(() => {
    var l;
    (l = a.querySelector(`.${mn}`)) == null || l.remove(), a.appendChild(Io(n, i, s));
  }, "refresh");
  return a.appendChild(Io(n, i, s)), r.appendChild(a), !0;
}
c(Cw, "injectAsFieldset");
function Sw(t, e, n, i) {
  var s;
  const r = _c(t, e, hw, gw, pw);
  if (!r) return !1;
  if (r.querySelector(`.${mn}`)) return !0;
  const a = r.closest("form");
  a && (a.noValidate = !0);
  const o = /* @__PURE__ */ c(() => {
    var l;
    (l = r.querySelector(`.${mn}`)) == null || l.remove(), r.appendChild(Io(n, i, o));
  }, "refresh");
  return r.appendChild(Io(n, i, o)), (s = t.setPosition) == null || s.call(t, { height: "auto" }), !0;
}
c(Sw, "injectAsTab");
function Tw(t, e) {
  var l;
  const n = qt(e);
  if (!n) return;
  const i = t.document ?? ((l = t.object) == null ? void 0 : l.document) ?? t.object;
  if (!i || i.door === 0) return;
  const r = i.parent;
  if (!r || !(Cw(t, n, i, r) || Sw(t, n, i, r))) return;
  const o = `close${t.constructor.name}`, s = Hooks.on(o, (u) => {
    if (u === t) {
      ch(), mw();
      const d = n.querySelector(`.${mn}`);
      (d == null ? void 0 : d._dlSelectionHookId) != null && Hooks.off("controlWall", d._dlSelectionHookId), Hooks.off(o, s);
    }
  });
}
c(Tw, "renderDoorLinksTab");
function Lw(t, e) {
  var i;
  const n = Cs();
  for (const [r, a] of Object.entries(t)) {
    const o = ((i = n.get(r)) == null ? void 0 : i.highlightColor) ?? 16739115;
    for (const s of a) {
      const l = e.walls.get(s), u = l == null ? void 0 : l.object;
      u && zc(u, { color: o });
    }
  }
}
c(Lw, "highlightLinkedWalls");
const sd = "eidolon-utilities";
function Iw(t, e) {
  e.ds !== void 0 && t.door !== 0 && lh(t, e.ds);
}
c(Iw, "onUpdateWall");
function kw(t) {
  const e = t.parent;
  if (!e) return;
  const n = t.id;
  for (const i of e.walls)
    i.door !== 0 && uw(i, n);
}
c(kw, "onDeleteWall");
function Ow(t, e) {
  Tw(t, e);
}
c(Ow, "onRenderWallConfig");
function Aw() {
  ch();
}
c(Aw, "onCanvasReady");
function Mw() {
  Hooks.on("updateWall", Iw), Hooks.on("deleteWall", kw), Hooks.on("renderWallConfig", Ow), Hooks.on("canvasReady", Aw), Hooks.once("ready", () => {
    const t = game.modules.get(sd);
    t.api || (t.api = {}), t.api.doorLinks = {
      registerBehavior: Vc,
      getBehavior: ah,
      getAllBehaviors: Cs,
      getDoorLinks: lr,
      setDoorLinks: Wc,
      triggerDoor: lh
    }, console.log(`[${sd}] Door Links API registered.`);
  });
}
c(Mw, "registerDoorLinksHooks");
Vc("reflect", lw);
Vc("passthru", cw);
Mw();
//# sourceMappingURL=eidolon-utilities.js.map
