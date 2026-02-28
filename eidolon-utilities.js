var Nc = Object.defineProperty;
var Sm = Object.getPrototypeOf;
var Cm = Reflect.get;
var _c = (t) => {
  throw TypeError(t);
};
var Tm = (t, e, n) => e in t ? Nc(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var c = (t, e) => Nc(t, "name", { value: e, configurable: !0 });
var ge = (t, e, n) => Tm(t, typeof e != "symbol" ? e + "" : e, n), ns = (t, e, n) => e.has(t) || _c("Cannot " + n);
var m = (t, e, n) => (ns(t, e, "read from private field"), n ? n.call(t) : e.get(t)), k = (t, e, n) => e.has(t) ? _c("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, n), I = (t, e, n, i) => (ns(t, e, "write to private field"), i ? i.call(t, n) : e.set(t, n), n), C = (t, e, n) => (ns(t, e, "access private method"), n);
var is = (t, e, n, i) => ({
  set _(r) {
    I(t, e, r, n);
  },
  get _() {
    return m(t, e, i);
  }
}), Pe = (t, e, n) => Cm(Sm(t), n, e);
const T = "eidolon-utilities", xa = "timeTriggerActive", Is = "timeTriggerHideWindow", Os = "timeTriggerShowPlayerWindow", As = "timeTriggerAllowRealTime", Uu = "timeTriggers", ga = "timeTriggerHistory", ks = "debug", Ms = "timeFormat", Ns = "manageTime", _s = "secondsPerRound";
const Lm = [-30, -15, -5, 5, 15, 30], Di = 1440 * 60, pa = "playSound", Yr = 6;
function S(t, e) {
  var n, i;
  return (i = (n = game.i18n) == null ? void 0 : n.has) != null && i.call(n, t) ? game.i18n.localize(t) : e;
}
c(S, "localize");
function Mt(t) {
  return typeof t != "string" ? "" : t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
c(Mt, "escapeHtml");
function zt(t) {
  var e;
  return t == null ? t : (e = foundry == null ? void 0 : foundry.utils) != null && e.duplicate ? foundry.utils.duplicate(t) : JSON.parse(JSON.stringify(t));
}
c(zt, "duplicateData");
function Im() {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
c(Im, "generateTriggerId");
function Vu(t) {
  if (typeof t != "string") return null;
  const e = t.trim();
  if (!e) return null;
  const n = e.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (!n) return null;
  const i = Number(n[1]), r = Number(n[2]), a = n[3] !== void 0 ? Number(n[3]) : 0;
  return !Number.isInteger(i) || !Number.isInteger(r) || !Number.isInteger(a) || i < 0 || i > 23 || r < 0 || r > 59 || a < 0 || a > 59 ? null : i * 3600 + r * 60 + a;
}
c(Vu, "parseTriggerTimeToSeconds");
function or() {
  var t, e;
  return ((t = game.scenes) == null ? void 0 : t.current) ?? ((e = game.scenes) == null ? void 0 : e.active) ?? null;
}
c(or, "getActiveScene");
function Wt(t) {
  return (t == null ? void 0 : t.object) ?? (t == null ? void 0 : t.document) ?? null;
}
c(Wt, "getSceneFromApplication");
function We(t) {
  return t && typeof t.getFlag == "function" && typeof t.setFlag == "function";
}
c(We, "hasSceneDocument");
const $s = /* @__PURE__ */ new Set(), xs = /* @__PURE__ */ new Set(), Fs = /* @__PURE__ */ new Set(), Ds = /* @__PURE__ */ new Set();
let yi = !1, Sr = !1, Fa = Yr, Da = "12h", $c = !1;
function rs(t) {
  yi = !!t;
  for (const e of $s)
    try {
      e(yi);
    } catch (n) {
      console.error(`${T} | Debug change handler failed`, n);
    }
}
c(rs, "notifyDebugChange");
function as(t) {
  Sr = !!t;
  for (const e of xs)
    try {
      e(Sr);
    } catch (n) {
      console.error(`${T} | Manage time change handler failed`, n);
    }
}
c(as, "notifyManageTimeChange");
function Gu(t) {
  return t === "24h" ? "24h" : "12h";
}
c(Gu, "normalizeTimeFormatValue");
function Ql(t) {
  const e = Number(t);
  return !Number.isFinite(e) || e <= 0 ? Yr : e;
}
c(Ql, "normalizeSecondsPerRoundValue");
function os(t) {
  const e = Ql(t);
  Fa = e;
  for (const n of Fs)
    try {
      n(e);
    } catch (i) {
      console.error(`${T} | Seconds-per-round change handler failed`, i);
    }
}
c(os, "notifySecondsPerRoundChange");
function ss(t) {
  const e = Gu(t);
  Da = e;
  for (const n of Ds)
    try {
      n(e);
    } catch (i) {
      console.error(`${T} | Time format change handler failed`, i);
    }
}
c(ss, "notifyTimeFormatChange");
function Om() {
  var e;
  if ($c) return;
  if ($c = !0, !((e = game == null ? void 0 : game.settings) != null && e.register)) {
    console.warn(
      `${T} | game.settings.register is unavailable. Module settings could not be registered.`
    );
    return;
  }
  const t = typeof game.settings.registerChange == "function";
  game.settings.register(T, ks, {
    name: S("EIDOLON.TimeTrigger.DebugSettingName", "Enable debug logging"),
    hint: S(
      "EIDOLON.TimeTrigger.DebugSettingHint",
      "Write detailed time-trigger diagnostics to the browser console."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: t ? void 0 : rs
  }), t && game.settings.registerChange(T, ks, rs), yi = Zl(), rs(yi), game.settings.register(T, Ns, {
    name: S("EIDOLON.TimeTrigger.ManageTimeSettingName", "Manage Game Time"),
    hint: S(
      "EIDOLON.TimeTrigger.ManageTimeSettingHint",
      "Allow Eidolon Utilities to advance world time automatically while the game is unpaused. Warning: This may conflict with other time-management modules."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: t ? void 0 : as
  }), t && game.settings.registerChange(T, Ns, as), Sr = km(), as(Sr), game.settings.register(T, _s, {
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
    default: Yr,
    range: { min: 1, max: 3600, step: 1 },
    onChange: t ? void 0 : os
  }), t && game.settings.registerChange(
    T,
    _s,
    os
  ), Fa = Ql(Mm()), os(Fa), game.settings.register(T, Ms, {
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
    onChange: t ? void 0 : ss
  }), t && game.settings.registerChange(T, Ms, ss), Da = Gu(zu()), ss(Da);
}
c(Om, "registerTimeTriggerSettings");
function Zl() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return !!game.settings.get(T, ks);
  } catch (e) {
    console.error(`${T} | Failed to read debug setting`, e);
  }
  return !1;
}
c(Zl, "getDebugSetting");
function Am() {
  return yi = Zl(), yi;
}
c(Am, "refreshDebugSettingCache");
function km() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return !!game.settings.get(T, Ns);
  } catch (e) {
    console.error(`${T} | Failed to read manage time setting`, e);
  }
  return !1;
}
c(km, "getManageTimeSetting");
function zu() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return game.settings.get(T, Ms) === "24h" ? "24h" : "12h";
  } catch (e) {
    console.error(`${T} | Failed to read time format setting`, e);
  }
  return "12h";
}
c(zu, "getTimeFormatSetting");
function Mm() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get) {
      const e = game.settings.get(T, _s);
      return Ql(e);
    }
  } catch (e) {
    console.error(`${T} | Failed to read seconds-per-round setting`, e);
  }
  return Yr;
}
c(Mm, "getSecondsPerRoundSetting");
function Nm(t) {
  if (typeof t != "function")
    return () => {
    };
  $s.add(t);
  try {
    t(yi);
  } catch (e) {
    console.error(`${T} | Debug change handler failed`, e);
  }
  return () => {
    $s.delete(t);
  };
}
c(Nm, "onDebugSettingChange");
function Wu(t) {
  if (typeof t != "function")
    return () => {
    };
  xs.add(t);
  try {
    t(Sr);
  } catch (e) {
    console.error(`${T} | Manage time change handler failed`, e);
  }
  return () => {
    xs.delete(t);
  };
}
c(Wu, "onManageTimeSettingChange");
function ec(t) {
  if (typeof t != "function")
    return () => {
    };
  Ds.add(t);
  try {
    t(Da);
  } catch (e) {
    console.error(`${T} | Time format change handler failed`, e);
  }
  return () => {
    Ds.delete(t);
  };
}
c(ec, "onTimeFormatSettingChange");
function _m(t) {
  if (typeof t != "function")
    return () => {
    };
  Fs.add(t);
  try {
    t(Fa);
  } catch (e) {
    console.error(`${T} | Seconds-per-round change handler failed`, e);
  }
  return () => {
    Fs.delete(t);
  };
}
c(_m, "onSecondsPerRoundSettingChange");
let Po = !1, Ps = !1;
function Rs(t) {
  Po = !!t;
}
c(Rs, "updateDebugState");
function Yu() {
  Ps || (Ps = !0, Rs(Zl()), Nm((t) => {
    Rs(t), console.info(`${T} | Debug ${Po ? "enabled" : "disabled"}`);
  }));
}
c(Yu, "ensureInitialized");
function tc() {
  return Ps || Yu(), Po;
}
c(tc, "shouldLog");
function Ku(t) {
  if (!t.length)
    return [`${T} |`];
  const [e, ...n] = t;
  return typeof e == "string" ? [`${T} | ${e}`, ...n] : [`${T} |`, e, ...n];
}
c(Ku, "formatArgs");
function $m() {
  Yu();
}
c($m, "initializeDebug");
function xm() {
  return Rs(Am()), Po;
}
c(xm, "syncDebugState");
function N(...t) {
  tc() && console.debug(...Ku(t));
}
c(N, "debugLog");
function zi(...t) {
  tc() && console.group(...Ku(t));
}
c(zi, "debugGroup");
function _n() {
  tc() && console.groupEnd();
}
c(_n, "debugGroupEnd");
function Pi(t) {
  var r;
  const e = (r = t == null ? void 0 : t.getFlag) == null ? void 0 : r.call(t, T, Uu);
  if (!e) return [];
  const n = zt(e), i = Array.isArray(n) ? n : [];
  return N("Loaded time triggers", {
    sceneId: (t == null ? void 0 : t.id) ?? null,
    count: i.length
  }), i;
}
c(Pi, "getTimeTriggers");
async function Ju(t, e) {
  t != null && t.setFlag && (N("Persisting time triggers", {
    sceneId: t.id,
    count: Array.isArray(e) ? e.length : 0
  }), await t.setFlag(T, Uu, e));
}
c(Ju, "setTimeTriggers");
function Fm(t) {
  var r;
  const e = (r = t == null ? void 0 : t.getFlag) == null ? void 0 : r.call(t, T, ga);
  if (!e) return {};
  const n = zt(e);
  if (!n || typeof n != "object") return {};
  const i = {};
  for (const [a, o] of Object.entries(n))
    typeof o == "number" && Number.isFinite(o) && (i[a] = o);
  return N("Loaded time trigger history", {
    sceneId: (t == null ? void 0 : t.id) ?? null,
    keys: Object.keys(i)
  }), i;
}
c(Fm, "getTimeTriggerHistory");
async function ls(t, e) {
  var l, u, d, h;
  if (!t) return;
  const n = {};
  if (e && typeof e == "object")
    for (const [f, g] of Object.entries(e))
      typeof g == "number" && Number.isFinite(g) && (n[f] = g);
  const i = ((l = t.getFlag) == null ? void 0 : l.call(t, T, ga)) ?? {}, r = {};
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
    o.length && typeof t.unsetFlag == "function" && await t.unsetFlag(T, ga), a.length && await t.setFlag(T, ga, n);
  } catch (f) {
    console.error(`${T} | Failed to persist time trigger history`, f), (h = (d = ui.notifications) == null ? void 0 : d.error) == null || h.call(
      d,
      S(
        "EIDOLON.TimeTrigger.HistoryPersistError",
        "Failed to persist the scene's time trigger history."
      )
    );
  }
}
c(ls, "updateTimeTriggerHistory");
const Pa = /* @__PURE__ */ new Map(), xc = /* @__PURE__ */ new Set();
function Dm(t) {
  if (!(t != null && t.id))
    throw new Error(`${T} | Action definitions require an id.`);
  if (Pa.has(t.id))
    throw new Error(`${T} | Duplicate time trigger action id: ${t.id}`);
  Pa.set(t.id, {
    ...t
  }), N("Registered time trigger action", { actionId: t.id });
}
c(Dm, "registerAction");
function Kr(t) {
  return Pa.get(t) ?? null;
}
c(Kr, "getAction");
function Pm(t) {
  const e = Kr(t);
  return e ? typeof e.label == "function" ? e.label() : e.label : t;
}
c(Pm, "getActionLabel");
function Fc() {
  return Array.from(Pa.values());
}
c(Fc, "listActions");
async function Xu(t, e) {
  var i, r;
  const n = Kr(e == null ? void 0 : e.action);
  if (!n || typeof n.execute != "function") {
    const a = S(
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
c(Xu, "executeTriggerAction");
function Rm(t) {
  const e = Kr(t == null ? void 0 : t.action);
  return !e || typeof e.buildSummaryParts != "function" ? [] : e.buildSummaryParts({ trigger: t, escapeHtml: Mt, localize: S }) ?? [];
}
c(Rm, "buildActionSummaryParts");
function Hm(t) {
  const e = Kr(t == null ? void 0 : t.action);
  return !e || typeof e.buildFormContent != "function" ? "" : e.buildFormContent({ trigger: t, escapeHtml: Mt, localize: S }) ?? "";
}
c(Hm, "buildActionFormSection");
function qm(t, e) {
  const n = Kr(t == null ? void 0 : t.action);
  !n || typeof n.prepareFormData != "function" || n.prepareFormData({ trigger: t, formData: e });
}
c(qm, "applyActionFormData");
function jm(t, e, n) {
  var a, o;
  const i = `${(t == null ? void 0 : t.id) ?? "unknown"}:${(e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.action) ?? "unknown"}:${n}`;
  if (xc.has(i)) return;
  xc.add(i);
  const r = S(
    "EIDOLON.TimeTrigger.MissingDataWarning",
    "A scene time trigger is missing required data and was skipped."
  );
  (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, r), console.warn(`${T} | Missing trigger data (${n})`, { scene: t == null ? void 0 : t.id, trigger: e });
}
c(jm, "warnMissingTriggerData");
async function Bm({ scene: t, trigger: e }) {
  var a, o, s, l, u;
  const n = (s = (o = (a = e == null ? void 0 : e.data) == null ? void 0 : a.path) == null ? void 0 : o.trim) == null ? void 0 : s.call(o);
  if (!n) {
    jm(t, e, "missing-audio-path");
    return;
  }
  const i = {
    src: n,
    autoplay: !0,
    loop: !1
  }, r = (() => {
    var d, h, f, g, p;
    return typeof ((h = (d = foundry == null ? void 0 : foundry.audio) == null ? void 0 : d.AudioHelper) == null ? void 0 : h.play) == "function" ? foundry.audio.AudioHelper.play(i, !0) : typeof ((g = (f = game == null ? void 0 : game.audio) == null ? void 0 : f.constructor) == null ? void 0 : g.play) == "function" ? game.audio.constructor.play(i, !0) : typeof ((p = game == null ? void 0 : game.audio) == null ? void 0 : p.play) == "function" ? game.audio.play(i, !0) : null;
  })();
  if (!r) {
    console.error(`${T} | Foundry audio helper is unavailable`), (u = (l = ui.notifications) == null ? void 0 : l.error) == null || u.call(
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
c(Bm, "executePlaySoundAction");
Dm({
  id: pa,
  label: /* @__PURE__ */ c(() => S("EIDOLON.TimeTrigger.ActionPlaySound", "Play Sound"), "label"),
  execute: Bm,
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
var Du;
const { ApplicationV2: Bn, HandlebarsApplicationMixin: Un } = ((Du = foundry.applications) == null ? void 0 : Du.api) ?? {};
if (!Bn || !Un)
  throw new Error(
    `${T} | ApplicationV2 API unavailable. Update Foundry VTT to v13 or newer.`
  );
const Dn = "AM", bi = "PM";
function $n() {
  return zu();
}
c($n, "getConfiguredTimeFormat");
function Ro(t) {
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
c(Ro, "parseCanonicalTimeString");
function Ut({ hours: t, minutes: e, seconds: n }) {
  if (!Number.isInteger(t) || !Number.isInteger(e) || t < 0 || t > 23 || e < 0 || e > 59) return null;
  const i = String(t).padStart(2, "0"), r = String(e).padStart(2, "0");
  if (Number.isInteger(n)) {
    if (n < 0 || n > 59) return null;
    const a = String(n).padStart(2, "0");
    return `${i}:${r}:${a}`;
  }
  return `${i}:${r}`;
}
c(Ut, "formatCanonicalTime");
function Um(t, { format: e } = {}) {
  if (!t || typeof t != "object") return null;
  const n = Number(t.hour), i = Number(t.minute), r = t.second !== void 0 && t.second !== null, a = r ? Number(t.second) : null, o = r && Number.isFinite(a) ? Math.floor(Math.max(0, Math.min(59, a))) : null;
  if (!Number.isFinite(n) || !Number.isFinite(i)) return null;
  const s = e ?? $n();
  return Ra(
    {
      hours: n,
      minutes: i,
      seconds: o
    },
    s
  );
}
c(Um, "formatTimeComponentsForDisplay");
function Vm(t, { format: e } = {}) {
  const n = Ro(t);
  if (!n) return "";
  const i = e ?? $n();
  return Ra(n, i);
}
c(Vm, "formatTriggerTimeForDisplay");
function Ra(t, e = "12h") {
  if (!t) return "";
  const { hours: n, minutes: i, seconds: r = null } = t;
  if (!Number.isInteger(n) || !Number.isInteger(i)) return "";
  const a = Number.isInteger(r);
  if (e === "24h") {
    const f = `${String(n).padStart(2, "0")}:${String(i).padStart(2, "0")}`;
    return a ? `${f}:${String(r).padStart(2, "0")}` : f;
  }
  const o = n >= 12 ? bi : Dn, s = n % 12 === 0 ? 12 : n % 12, l = String(s), u = String(i).padStart(2, "0"), d = `${l}:${u}`, h = o === Dn ? S("EIDOLON.TimeTrigger.TimePeriodAM", Dn) : S("EIDOLON.TimeTrigger.TimePeriodPM", bi);
  if (a) {
    const f = String(r).padStart(2, "0");
    return `${d}:${f} ${h}`;
  }
  return `${d} ${h}`;
}
c(Ra, "formatTimeParts");
function Dc(t, e = $n()) {
  const n = Ro(t);
  if (e === "24h")
    return {
      format: e,
      canonical: n ? Ut(n) ?? "" : "",
      hour: n ? String(n.hours).padStart(2, "0") : "",
      minute: n ? String(n.minutes).padStart(2, "0") : ""
    };
  if (!n)
    return {
      format: e,
      canonical: "",
      hour: "",
      minute: "",
      period: Dn
    };
  const i = n.hours >= 12 ? bi : Dn, r = n.hours % 12 === 0 ? 12 : n.hours % 12;
  return {
    format: e,
    canonical: Ut(n) ?? "",
    hour: String(r),
    minute: String(n.minutes).padStart(2, "0"),
    period: i
  };
}
c(Dc, "getTimeFormValues");
function Gm({ hour: t, minute: e, period: n, time: i }, r = $n()) {
  if (r === "24h") {
    const g = typeof t == "string" ? t.trim() : "", p = typeof e == "string" ? e.trim() : "", y = typeof i == "string" ? i.trim() : "";
    if (!g && !p && y) {
      const E = Ro(y);
      return E ? { canonical: Ut(E) ?? "", error: null } : {
        canonical: "",
        error: S(
          "EIDOLON.TimeTrigger.TimeFormatInvalid24",
          "Enter a valid time in HH:MM format."
        )
      };
    }
    if (!g || !p)
      return {
        canonical: "",
        error: S("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.")
      };
    const w = Number(g), v = Number(p);
    return !Number.isInteger(w) || w < 0 || w > 23 ? {
      canonical: "",
      error: S(
        "EIDOLON.TimeTrigger.TimeFormatInvalid24",
        "Enter a valid time in HH:MM format."
      )
    } : !Number.isInteger(v) || v < 0 || v > 59 ? {
      canonical: "",
      error: S(
        "EIDOLON.TimeTrigger.TimeFormatInvalid24",
        "Enter a valid time in HH:MM format."
      )
    } : { canonical: Ut({
      hours: w,
      minutes: v
    }) ?? "", error: null };
  }
  const a = typeof t == "string" ? t.trim() : "", o = typeof e == "string" ? e.trim() : "", s = typeof n == "string" ? n.trim().toUpperCase() : "";
  if (!a || !o || !s)
    return { canonical: "", error: S("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.") };
  if (s !== Dn && s !== bi)
    return { canonical: "", error: S("EIDOLON.TimeTrigger.TimeFormatInvalidPeriod", "Select AM or PM.") };
  const l = Number(a), u = Number(o);
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
  const d = l % 12, f = {
    hours: s === bi ? d + 12 : d,
    minutes: u
  };
  return {
    canonical: Ut(f) ?? "",
    error: null
  };
}
c(Gm, "normalizeFormTimeInput");
function zm() {
  return [
    {
      value: Dn,
      label: S("EIDOLON.TimeTrigger.TimePeriodAM", Dn)
    },
    {
      value: bi,
      label: S("EIDOLON.TimeTrigger.TimePeriodPM", bi)
    }
  ];
}
c(zm, "getPeriodOptions");
var ti, ni, re, Qu, so, lo, Zu, qs, js, co, uo, ed, td, nd, Bs, Us, Vs, fo, mo, Gs, ho, id, rd;
const Zn = class Zn extends Un(Bn) {
  constructor(n = {}) {
    var o;
    const { scene: i, showControls: r, ...a } = n ?? {};
    super(a);
    k(this, re);
    k(this, ti, null);
    k(this, ni, null);
    k(this, so, /* @__PURE__ */ c((n) => {
      var r, a;
      n.preventDefault();
      const i = Number((a = (r = n.currentTarget) == null ? void 0 : r.dataset) == null ? void 0 : a.delta);
      Number.isFinite(i) && (N("Time delta button clicked", { delta: i }), this._advanceTime(i));
    }, "#onDeltaClick"));
    k(this, lo, /* @__PURE__ */ c((n) => {
      var i, r;
      n.preventDefault(), !(!this.showControls || !((i = game.user) != null && i.isGM)) && (N("Time value double clicked", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null }), C(this, re, Zu).call(this));
    }, "#onTimeDoubleClick"));
    k(this, co, /* @__PURE__ */ c((n) => {
      if (this.isEditingTime && !this._commitTimeInProgress)
        if (n.key === "Enter") {
          n.preventDefault();
          const i = n.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
          C(this, re, js).call(this, r);
        } else n.key === "Escape" && (n.preventDefault(), C(this, re, qs).call(this));
    }, "#onTimeInputKeydown"));
    k(this, uo, /* @__PURE__ */ c((n) => {
      if (!this.isEditingTime || this._commitTimeInProgress || this._suppressBlurCommit) return;
      const i = n.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
      C(this, re, js).call(this, r);
    }, "#onTimeInputBlur"));
    k(this, fo, /* @__PURE__ */ c((n) => {
      const i = !!n;
      if (this.manageTimeEnabled === i) return;
      this.manageTimeEnabled = i, (this.rendered ?? this.isRendered ?? !1) && this.render({ force: !0 });
    }, "#handleManageTimeChange"));
    k(this, mo, /* @__PURE__ */ c(async (n) => {
      var a, o, s, l, u, d, h, f, g;
      if (n.preventDefault(), !this.showControls || !((a = game.user) != null && a.isGM)) return;
      if (!this.manageTimeEnabled) {
        (s = (o = ui.notifications) == null ? void 0 : o.error) == null || s.call(
          o,
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
        await i.setFlag(T, As, r), this.sceneAllowsRealTime = r;
        const p = r ? S(
          "EIDOLON.TimeTrigger.SceneRealTimeEnabled",
          "Automatic real-time flow enabled for this scene."
        ) : S(
          "EIDOLON.TimeTrigger.SceneRealTimeDisabled",
          "Automatic real-time flow disabled for this scene."
        );
        (h = (d = ui.notifications) == null ? void 0 : d.info) == null || h.call(d, p);
      } catch (p) {
        console.error(`${T} | Failed to toggle scene real-time flow`, p), (g = (f = ui.notifications) == null ? void 0 : f.error) == null || g.call(
          f,
          S(
            "EIDOLON.TimeTrigger.SceneRealTimeToggleError",
            "Failed to update the scene's real-time flow setting."
          )
        );
      } finally {
        this.render({ force: !0 });
      }
    }, "#onRealTimeToggleClick"));
    k(this, ho, /* @__PURE__ */ c(() => {
      (this.rendered ?? this.isRendered ?? !1) && (this.isEditingTime && (this.editValue = C(this, re, Bs).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    this.scene = i ?? null, this.showControls = typeof r == "boolean" ? r : !!((o = game.user) != null && o.isGM), this.isEditingTime = !1, this.editValue = "", this._commitTimeInProgress = !1, this._suppressBlurCommit = !1, this.manageTimeEnabled = !1, this.sceneAllowsRealTime = C(this, re, Gs).call(this), I(this, ti, ec(m(this, ho))), I(this, ni, Wu(m(this, fo)));
  }
  async _prepareContext() {
    var v, b;
    const n = ((v = game.time) == null ? void 0 : v.components) ?? {}, r = ((n == null ? void 0 : n.second) !== void 0 && (n == null ? void 0 : n.second) !== null ? Um(n) : null) ?? C(this, re, Qu).call(this), a = $n(), o = a === "24h", s = o ? S("EIDOLON.TimeTrigger.EditTimePlaceholder24", "HH:MM") : S("EIDOLON.TimeTrigger.EditTimePlaceholder12", "HH:MM AM/PM"), l = this.showControls ? S(
      "EIDOLON.TimeTrigger.EditTimeHint",
      "Double-click to set a specific time."
    ) : "", u = this.showControls ? S(
      "EIDOLON.TimeTrigger.EditTimeLabel",
      "New time (HH:MM or HH:MM AM/PM)"
    ) : "", d = Lm.map((E) => ({
      minutes: E,
      label: E > 0 ? `+${E}` : `${E}`
    })), h = !!this.manageTimeEnabled, f = C(this, re, Gs).call(this);
    this.sceneAllowsRealTime = f;
    const g = S(
      "EIDOLON.TimeTrigger.SceneRealTimeEnable",
      "Enable automatic real-time flow for this scene."
    ), p = S(
      "EIDOLON.TimeTrigger.SceneRealTimeDisable",
      "Disable automatic real-time flow for this scene."
    ), y = S(
      "EIDOLON.TimeTrigger.SceneRealTimeManageDisabled",
      "Enable Manage Time in module settings to allow automatic real-time flow."
    );
    return {
      formattedTime: r,
      deltas: d,
      manageTimeEnabled: h,
      sceneAllowsRealTime: f,
      realTimeButtonLabel: h ? f ? p : g : y,
      isGM: ((b = game.user) == null ? void 0 : b.isGM) ?? !1,
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
    return C(this, re, id).call(this), C(this, re, rd).call(this), i;
  }
  async _advanceTime(n) {
    var r, a, o, s, l, u, d;
    const i = n * 60;
    if (N("Advancing world time", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null, minutes: n, seconds: i }), !((a = game.user) != null && a.isGM)) {
      (s = (o = ui.notifications) == null ? void 0 : o.warn) == null || s.call(o, S("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time."));
      return;
    }
    try {
      await game.time.advance(i);
    } catch (h) {
      console.error(`${T} | Failed to advance time`, h), (u = (l = ui.notifications) == null ? void 0 : l.error) == null || u.call(
        l,
        S("EIDOLON.TimeTrigger.Error", "Failed to update the world time.")
      ), N("Failed to advance time from window", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        minutes: n,
        message: (h == null ? void 0 : h.message) ?? String(h)
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
          u.addEventListener("click", m(this, so));
        });
        const o = r.querySelector('.time-trigger-window__time-value[data-editable="true"]');
        o && o.addEventListener("dblclick", m(this, lo), { once: !1 });
        const s = r.querySelector(".time-trigger-window__time-input");
        s && (s.addEventListener("keydown", m(this, co)), s.addEventListener("blur", m(this, uo)), typeof s.focus == "function" && (s.focus(), typeof s.select == "function" && s.select()));
        const l = r.querySelector('[data-action="toggle-real-time"]');
        l && l.addEventListener("click", m(this, mo));
      }
      this._suppressBlurCommit = !1;
    }
  }
};
ti = new WeakMap(), ni = new WeakMap(), re = new WeakSet(), Qu = /* @__PURE__ */ c(function() {
  var l;
  const n = (l = game.time) == null ? void 0 : l.worldTime;
  if (typeof n != "number" || !Number.isFinite(n)) return "";
  const i = 1440 * 60, r = (Math.floor(n) % i + i) % i, a = Math.floor(r / 3600), o = Math.floor(r % 3600 / 60), s = r % 60;
  return Ra({ hours: a, minutes: o, seconds: s }, $n());
}, "#formatFallbackTime"), so = new WeakMap(), lo = new WeakMap(), Zu = /* @__PURE__ */ c(function() {
  var n;
  (n = game.user) != null && n.isGM && (this.isEditingTime = !0, this._suppressBlurCommit = !1, this.editValue = C(this, re, Bs).call(this), this.render({ force: !0 }));
}, "#enterTimeEditMode"), qs = /* @__PURE__ */ c(function() {
  this.isEditingTime = !1, this.editValue = "", this._suppressBlurCommit = !1, this.render({ force: !0 });
}, "#cancelTimeEdit"), js = /* @__PURE__ */ c(async function(n) {
  var a, o, s;
  if (!((a = game.user) != null && a.isGM) || !this.isEditingTime || this._commitTimeInProgress) return;
  this._commitTimeInProgress = !0;
  const i = typeof n == "string" ? n.trim() : "";
  if (!i) {
    C(this, re, qs).call(this), this._commitTimeInProgress = !1;
    return;
  }
  const r = C(this, re, nd).call(this, i);
  if (r.error) {
    (s = (o = ui.notifications) == null ? void 0 : o.error) == null || s.call(o, r.error), this._suppressBlurCommit = !0, this.editValue = i, this.render({ force: !0 }), this._commitTimeInProgress = !1;
    return;
  }
  try {
    await C(this, re, td).call(this, r.seconds, r.includeSeconds) ? (this.isEditingTime = !1, this.editValue = "", this.render({ force: !0 })) : (this.editValue = i, this.render({ force: !0 }));
  } finally {
    this._commitTimeInProgress = !1;
  }
}, "#commitTimeInput"), co = new WeakMap(), uo = new WeakMap(), ed = /* @__PURE__ */ c(function() {
  var u, d;
  const n = (u = game.time) == null ? void 0 : u.worldTime;
  if (typeof n != "number" || !Number.isFinite(n))
    return "";
  const i = ((d = game.time) == null ? void 0 : d.components) ?? {}, r = Number(i.hour), a = Number(i.minute), o = i.second !== void 0 ? Number(i.second) : null, s = Number.isInteger(o);
  return (Number.isFinite(r) && Number.isFinite(a) ? Ut({
    hours: Math.max(0, Math.min(23, Number(r))),
    minutes: Math.max(0, Math.min(59, Number(a))),
    seconds: s && Number.isFinite(o) ? Math.max(0, Math.min(59, Number(o))) : void 0
  }) ?? "" : "") ?? "";
}, "#getCurrentCanonicalTime"), td = /* @__PURE__ */ c(async function(n, i) {
  var f, g, p, y, w, v, b, E, L, A;
  const r = (f = game.time) == null ? void 0 : f.worldTime;
  if (typeof r != "number" || !Number.isFinite(r))
    return (p = (g = ui.notifications) == null ? void 0 : g.error) == null || p.call(
      g,
      S(
        "EIDOLON.TimeTrigger.EditTimeUnavailable",
        "The world time is unavailable, so it can't be updated."
      )
    ), !1;
  if (!Number.isInteger(n) || n < 0 || n >= Di)
    return (w = (y = ui.notifications) == null ? void 0 : y.error) == null || w.call(
      y,
      S(
        "EIDOLON.TimeTrigger.EditTimeInvalidRange",
        "Enter a time within the current day."
      )
    ), !1;
  const s = Math.floor(r / Di) * Di + n - r;
  if (!Number.isFinite(s) || s === 0)
    return !0;
  const l = Math.floor(n / 3600), u = Math.floor(n % 3600 / 60), d = n % 60, h = Ut({
    hours: l,
    minutes: u,
    seconds: i ? d : void 0
  });
  try {
    N("Updating world time directly", {
      sceneId: ((v = this.scene) == null ? void 0 : v.id) ?? null,
      targetCanonical: h ?? null,
      diff: s
    }), await game.time.advance(s);
    const O = Ra(
      {
        hours: l,
        minutes: u,
        seconds: i ? d : null
      },
      $n()
    );
    (E = (b = ui.notifications) == null ? void 0 : b.info) == null || E.call(
      b,
      S(
        "EIDOLON.TimeTrigger.EditTimeSuccess",
        "World time updated."
      ) + (O ? ` ${O}` : "")
    );
  } catch (O) {
    return console.error(`${T} | Failed to set world time`, O), (A = (L = ui.notifications) == null ? void 0 : L.error) == null || A.call(
      L,
      S(
        "EIDOLON.TimeTrigger.EditTimeError",
        "Failed to update the world time."
      )
    ), !1;
  }
  return !0;
}, "#applyTargetSeconds"), nd = /* @__PURE__ */ c(function(n) {
  var h;
  const i = S(
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
        canonical: Ut({ hours: f, minutes: g, seconds: p }),
        seconds: y,
        includeSeconds: p !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const { amLower: o, pmLower: s, periodPattern: l } = C(this, re, Us).call(this), u = r.match(
    new RegExp(
      `^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?\\s*(${l})$`,
      "i"
    )
  );
  if (u) {
    let f = Number(u[1]);
    const g = Number(u[2]), p = u[3] !== void 0 ? Number(u[3]) : void 0, y = u[4] ?? "", w = typeof y == "string" ? ((h = y.toLocaleLowerCase) == null ? void 0 : h.call(y)) ?? y.toLowerCase() : "";
    if (Number.isInteger(f) && f >= 1 && f <= 12 && Number.isInteger(g) && g >= 0 && g <= 59 && (p === void 0 || Number.isInteger(p) && p >= 0 && p <= 59) && (w === o || w === s || w === "am" || w === "pm")) {
      f = f % 12, (w === s || w === "pm") && (f += 12);
      const b = f * 3600 + g * 60 + (p ?? 0);
      return {
        canonical: Ut({ hours: f, minutes: g, seconds: p }),
        seconds: b,
        includeSeconds: p !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const d = Vu(r);
  if (d !== null) {
    const f = Math.floor(d / 3600), g = Math.floor(d % 3600 / 60), p = d % 60, y = p !== 0;
    return {
      canonical: Ut({
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
}, "#parseInputTime"), Bs = /* @__PURE__ */ c(function() {
  const n = C(this, re, ed).call(this);
  if (!n) return "";
  if ($n() === "24h")
    return n;
  const r = Ro(n);
  if (!r) return n;
  const a = Number(r.hours), o = Number(r.minutes), s = r.seconds !== null && r.seconds !== void 0 ? Number(r.seconds) : void 0;
  if (!Number.isFinite(a) || !Number.isFinite(o)) return n;
  const l = Number.isFinite(s), u = a % 12 === 0 ? 12 : a % 12, d = String(o).padStart(2, "0"), h = l ? `:${String(s).padStart(2, "0")}` : "", { amLabel: f, pmLabel: g } = C(this, re, Us).call(this), p = a >= 12 ? g : f;
  return `${u}:${d}${h} ${p}`.trim();
}, "#getInitialEditValue"), Us = /* @__PURE__ */ c(function() {
  var u, d;
  const n = S("EIDOLON.TimeTrigger.TimePeriodAM", "AM"), i = S("EIDOLON.TimeTrigger.TimePeriodPM", "PM"), r = ((u = n.toLocaleLowerCase) == null ? void 0 : u.call(n)) ?? n.toLowerCase(), a = ((d = i.toLocaleLowerCase) == null ? void 0 : d.call(i)) ?? i.toLowerCase(), o = C(this, re, Vs).call(this, n), s = C(this, re, Vs).call(this, i), l = `${o}|${s}|AM|PM`;
  return {
    amLabel: n,
    pmLabel: i,
    amLower: r,
    pmLower: a,
    periodPattern: l
  };
}, "#getPeriodMatchData"), Vs = /* @__PURE__ */ c(function(n) {
  return typeof n != "string" ? "" : n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}, "#escapeForRegex"), fo = new WeakMap(), mo = new WeakMap(), Gs = /* @__PURE__ */ c(function() {
  const n = this.scene;
  if (!n || typeof n.getFlag != "function") return !1;
  try {
    return !!n.getFlag(T, As);
  } catch (i) {
    N("TimeTriggerWindow | Failed to read scene real-time flag", {
      sceneId: (n == null ? void 0 : n.id) ?? null,
      message: (i == null ? void 0 : i.message) ?? String(i)
    });
  }
  return !1;
}, "#readSceneRealTimeFlag"), ho = new WeakMap(), id = /* @__PURE__ */ c(function() {
  if (typeof m(this, ti) == "function")
    try {
      m(this, ti).call(this);
    } catch (n) {
      console.error(`${T} | Failed to dispose time format subscription`, n);
    }
  I(this, ti, null);
}, "#disposeTimeFormatSubscription"), rd = /* @__PURE__ */ c(function() {
  if (typeof m(this, ni) == "function")
    try {
      m(this, ni).call(this);
    } catch (n) {
      console.error(`${T} | Failed to dispose manage time subscription`, n);
    }
  I(this, ni, null);
}, "#disposeManageTimeSubscription"), c(Zn, "TimeTriggerWindow"), ge(Zn, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Pe(Zn, Zn, "DEFAULT_OPTIONS"),
  {
    id: `${T}-time-trigger`,
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
)), ge(Zn, "PARTS", {
  content: {
    template: `modules/${T}/templates/time-trigger.html`
  }
});
let Hs = Zn;
function Ho(t, e = {}) {
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
c(Ho, "createApplicationFactory");
const Pc = /* @__PURE__ */ new Set();
var ve, Je, ii, Qi, ad, od;
const Cc = class Cc {
  constructor({ windowFactory: e } = {}) {
    k(this, Qi);
    k(this, ve, null);
    k(this, Je, null);
    k(this, ii);
    const n = Ho(Hs);
    typeof e == "function" ? e.__eidolonFactorySignature === "options" ? I(this, ii, (r, a = {}) => e({ scene: r, ...a ?? {} })) : I(this, ii, e) : I(this, ii, /* @__PURE__ */ c((r, a = {}) => n({ scene: r, ...a ?? {} }), "fallbackFactory"));
  }
  onReady() {
    var n;
    const e = typeof ((n = game.time) == null ? void 0 : n.worldTime) == "number" && Number.isFinite(game.time.worldTime) ? game.time.worldTime : null;
    N("TimeTriggerManager#onReady", { worldTime: e }), e !== null && I(this, Je, e);
  }
  onCanvasReady(e) {
    const n = (e == null ? void 0 : e.scene) ?? or();
    N("TimeTriggerManager#onCanvasReady", { sceneId: (n == null ? void 0 : n.id) ?? null }), this.refreshTimeTriggerWindow(n), this.handleTimeTriggerEvaluation(n);
  }
  onUpdateScene(e) {
    const n = or();
    N("TimeTriggerManager#onUpdateScene", {
      sceneId: (e == null ? void 0 : e.id) ?? null,
      activeSceneId: (n == null ? void 0 : n.id) ?? null
    }), !(!n || e.id !== n.id) && (this.refreshTimeTriggerWindow(e), this.handleTimeTriggerEvaluation(e));
  }
  onUpdateWorldTime(e, n) {
    N("TimeTriggerManager#onUpdateWorldTime", {
      worldTime: e,
      diff: n,
      hasWindow: !!m(this, ve)
    }), m(this, ve) && m(this, ve).render();
    const i = or(), r = C(this, Qi, ad).call(this, e, n);
    this.handleTimeTriggerEvaluation(i, e, r);
  }
  refreshTimeTriggerWindow(e) {
    var l, u, d;
    if (!e) return;
    const n = !!((l = game.user) != null && l.isGM), i = !!e.getFlag(T, xa), r = !!e.getFlag(T, Is), a = !!e.getFlag(T, Os);
    if (N("TimeTriggerManager#refreshTimeTriggerWindow", {
      sceneId: e.id,
      isGM: n,
      isActive: i,
      hideWindow: r,
      showPlayerWindow: a
    }), !(i && !r && (n || a))) {
      m(this, ve) && (N("Closing time trigger window", { reason: "not-visible" }), m(this, ve).close({ force: !0 }), I(this, ve, null));
      return;
    }
    const s = !!n;
    if (m(this, ve) && ((u = m(this, ve).scene) == null ? void 0 : u.id) === e.id) {
      N("Refreshing existing time trigger window", { sceneId: e.id }), m(this, ve).showControls = s, m(this, ve).render();
      return;
    }
    m(this, ve) && (N("Closing existing window before creating new instance", {
      previousSceneId: ((d = m(this, ve).scene) == null ? void 0 : d.id) ?? null
    }), m(this, ve).close({ force: !0 })), I(this, ve, m(this, ii).call(this, e, { showControls: s })), N("Rendering new time trigger window", { sceneId: e.id }), m(this, ve).render({ force: !0 });
  }
  async handleTimeTriggerEvaluation(e, n, i) {
    var l;
    const r = e ?? or();
    if (!r) {
      N("handleTimeTriggerEvaluation skipped", {
        reason: "no-active-scene",
        providedSceneId: (e == null ? void 0 : e.id) ?? null,
        currentWorldTime: n
      }), typeof n == "number" && Number.isFinite(n) && I(this, Je, n);
      return;
    }
    const a = typeof n == "number" && Number.isFinite(n) ? n : typeof ((l = game.time) == null ? void 0 : l.worldTime) == "number" ? game.time.worldTime : null;
    if (a === null) return;
    const o = typeof i == "number" && Number.isFinite(i) ? i : null, s = o !== null ? o : typeof m(this, Je) == "number" && Number.isFinite(m(this, Je)) ? m(this, Je) : a;
    zi("handleTimeTriggerEvaluation", {
      sceneId: r.id,
      previousWorldTime: s,
      currentWorldTime: a,
      overrideProvided: o !== null
    });
    try {
      await C(this, Qi, od).call(this, r, s, a);
    } catch (u) {
      console.error(`${T} | Unexpected error while evaluating time triggers`, u), N("handleTimeTriggerEvaluation error", { message: (u == null ? void 0 : u.message) ?? String(u) });
    } finally {
      I(this, Je, a), _n();
    }
  }
};
ve = new WeakMap(), Je = new WeakMap(), ii = new WeakMap(), Qi = new WeakSet(), ad = /* @__PURE__ */ c(function(e, n) {
  return typeof m(this, Je) == "number" && Number.isFinite(m(this, Je)) ? (N("Resolved previous world time from cache", {
    previousWorldTime: m(this, Je)
  }), m(this, Je)) : typeof e == "number" && Number.isFinite(e) && typeof n == "number" && Number.isFinite(n) ? (N("Resolved previous world time using diff", {
    worldTime: e,
    diff: n,
    resolved: e - n
  }), e - n) : typeof e == "number" && Number.isFinite(e) ? e : null;
}, "#resolvePreviousWorldTime"), od = /* @__PURE__ */ c(async function(e, n, i) {
  var p, y, w;
  if (!((p = game.user) != null && p.isGM)) {
    N("Skipping trigger evaluation because user is not a GM");
    return;
  }
  if (!(e != null && e.id)) {
    N("Skipping trigger evaluation because the scene is missing an id");
    return;
  }
  if (!!!e.getFlag(T, xa)) {
    N("Skipping trigger evaluation because scene is inactive", { sceneId: e.id });
    return;
  }
  if (typeof i != "number" || !Number.isFinite(i)) return;
  (typeof n != "number" || !Number.isFinite(n)) && (n = i);
  const a = Pi(e);
  if (!a.length) {
    N("No time triggers configured for scene", { sceneId: e.id });
    return;
  }
  const o = Fm(e), s = /* @__PURE__ */ new Set();
  for (const v of a)
    v != null && v.id && s.add(v.id);
  let l = !1;
  for (const v of Object.keys(o))
    s.has(v) || (delete o[v], l = !0);
  if (zi("Evaluating scene time triggers", {
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
      const b = o[v.id];
      typeof b == "number" ? i < b ? (N("Clearing trigger history due to rewind", {
        triggerId: v.id,
        lastFired: b,
        currentWorldTime: i
      }), delete o[v.id], l = !0) : N("Preserving trigger history after rewind", {
        triggerId: v.id,
        lastFired: b,
        currentWorldTime: i
      }) : N("No history stored for rewind-enabled trigger", {
        triggerId: v.id
      });
    }
    l && (N("Persisting history cleanup after rewind", {
      sceneId: e.id
    }), await ls(e, o)), _n();
    return;
  }
  const u = n, d = i, h = [], f = Math.floor(u / Di), g = Math.floor(d / Di);
  for (const v of a) {
    if (!(v != null && v.id)) continue;
    const b = Vu(v.time);
    if (b === null) {
      Wm(e, v), N("Skipping trigger with invalid time", {
        triggerId: v.id,
        time: v.time
      });
      continue;
    }
    for (let E = f; E <= g; E++) {
      const L = E * Di + b;
      if (L < u || L > d) continue;
      const O = o[v.id];
      if (typeof O == "number" && O >= L) {
        N("Skipping trigger because it already fired within window", {
          triggerId: v.id,
          lastFired: O,
          absoluteTime: L
        });
        continue;
      }
      h.push({ trigger: v, absoluteTime: L });
    }
  }
  if (!h.length) {
    l && await ls(e, o), N("No triggers scheduled to fire within evaluation window", {
      sceneId: e.id
    }), _n();
    return;
  }
  h.sort((v, b) => v.absoluteTime - b.absoluteTime), N("Queued triggers for execution", {
    entries: h.map((v) => ({
      triggerId: v.trigger.id,
      absoluteTime: v.absoluteTime
    }))
  });
  for (const v of h)
    try {
      N("Executing time trigger action", {
        triggerId: v.trigger.id,
        absoluteTime: v.absoluteTime
      }), await Xu(e, v.trigger);
    } catch (b) {
      console.error(`${T} | Failed to execute time trigger action`, b), (w = (y = ui.notifications) == null ? void 0 : y.error) == null || w.call(
        y,
        S(
          "EIDOLON.TimeTrigger.TriggerActionError",
          "Failed to execute a scene time trigger action. Check the console for details."
        )
      ), N("Trigger execution failed", {
        triggerId: v.trigger.id,
        message: (b == null ? void 0 : b.message) ?? String(b)
      });
    } finally {
      o[v.trigger.id] = v.absoluteTime, l = !0, N("Recorded trigger execution", {
        triggerId: v.trigger.id,
        absoluteTime: v.absoluteTime
      });
    }
  l && (N("Persisting trigger history updates", { sceneId: e.id }), await ls(e, o)), _n();
}, "#evaluateSceneTimeTriggers"), c(Cc, "TimeTriggerManager");
let zs = Cc;
function Wm(t, e) {
  var r, a;
  const n = `${(t == null ? void 0 : t.id) ?? "unknown"}:${(e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.time) ?? "unknown"}`;
  if (Pc.has(n)) return;
  Pc.add(n);
  const i = S(
    "EIDOLON.TimeTrigger.InvalidTimeWarning",
    "A scene time trigger has an invalid time value and was skipped."
  );
  (a = (r = ui.notifications) == null ? void 0 : r.warn) == null || a.call(r, i), console.warn(`${T} | Invalid time for trigger`, { scene: t == null ? void 0 : t.id, trigger: e });
}
c(Wm, "warnInvalidTriggerTime");
var Et, kr, St, wn, ri, Pt, Bi, go, po, Mr, Nr, ai, Rt, V, Ys, Ai, ya, Ks, ba, Js, Ft, sd, Xs, ld, Qs, cd, yo, bo, vo, wo, Eo, So, Zs, ud, va, Co, To;
const Tc = class Tc {
  constructor() {
    k(this, V);
    k(this, Et, !1);
    k(this, kr, Yr);
    k(this, St, /* @__PURE__ */ new Map());
    k(this, wn, null);
    k(this, ri, null);
    k(this, Pt, 0);
    k(this, Bi, null);
    k(this, go, null);
    k(this, po, null);
    k(this, Mr, !1);
    k(this, Nr, !1);
    k(this, ai, !1);
    k(this, Rt, !1);
    k(this, yo, /* @__PURE__ */ c((e, n = {}) => {
      N("GameTimeAutomation | Pause state changed", {
        paused: e,
        userId: (n == null ? void 0 : n.userId) ?? null,
        broadcast: (n == null ? void 0 : n.broadcast) ?? null
      }), C(this, V, Ft).call(this, { pausedOverride: e });
    }, "#handlePause"));
    k(this, bo, /* @__PURE__ */ c((e) => {
      e != null && e.id && (m(this, St).set(e.id, Math.max(e.round ?? 0, 1)), N("GameTimeAutomation | Combat started", { combatId: e.id, round: e.round ?? 0 }), C(this, V, Ft).call(this));
    }, "#handleCombatStart"));
    k(this, vo, /* @__PURE__ */ c((e, n) => {
      if (!(e != null && e.id)) return;
      const i = typeof n == "number" && Number.isFinite(n) ? n : typeof e.round == "number" && Number.isFinite(e.round) ? e.round : 0, r = i > 0 ? i : 1, a = m(this, St).get(e.id), o = a ? Math.max(a, 1) : 1, s = r > 1 ? Math.max(r - o, 0) : 0;
      if (N("GameTimeAutomation | Combat round change detected", {
        combatId: e.id,
        effectiveRound: r,
        completedRounds: s,
        enabled: m(this, Et),
        paused: (game == null ? void 0 : game.paused) ?? null
      }), s > 0 && m(this, Et) && m(this, Rt) && !(game != null && game.paused) && C(this, V, Ai).call(this) && C(this, V, ya).call(this, e)) {
        const l = s * m(this, kr);
        l > 0 && (N("GameTimeAutomation | Advancing time for completed combat rounds", {
          combatId: e.id,
          completedRounds: s,
          delta: l
        }), C(this, V, Qs).call(this, l));
      }
      m(this, St).set(e.id, Math.max(r, 1));
    }, "#handleCombatRound"));
    k(this, wo, /* @__PURE__ */ c((e) => {
      e != null && e.id && (m(this, St).delete(e.id), N("GameTimeAutomation | Combat ended", { combatId: e.id }), C(this, V, Ft).call(this));
    }, "#handleCombatEnd"));
    k(this, Eo, /* @__PURE__ */ c((e) => {
      e != null && e.id && (m(this, St).delete(e.id), N("GameTimeAutomation | Combat deleted", { combatId: e.id }), C(this, V, Ft).call(this));
    }, "#handleCombatDelete"));
    k(this, So, /* @__PURE__ */ c((e, n) => {
      if (e != null && e.id) {
        if (typeof (n == null ? void 0 : n.round) == "number" && Number.isFinite(n.round)) {
          const i = Math.max(n.round, 1);
          m(this, St).set(e.id, i), N("GameTimeAutomation | Combat round manually updated", {
            combatId: e.id,
            round: i
          });
        }
        (Object.prototype.hasOwnProperty.call(n ?? {}, "active") || (n == null ? void 0 : n.round) !== void 0) && C(this, V, Ft).call(this);
      }
    }, "#handleCombatUpdate"));
    k(this, Co, /* @__PURE__ */ c((e) => {
      C(this, V, va).call(this, e == null ? void 0 : e.scene), C(this, V, Ft).call(this);
    }, "#handleCanvasReady"));
    k(this, To, /* @__PURE__ */ c((e) => {
      if (!We(e)) return;
      const n = C(this, V, Zs).call(this);
      if (!n || n.id !== e.id) return;
      C(this, V, va).call(this, e) && C(this, V, Ft).call(this);
    }, "#handleSceneUpdate"));
  }
  registerHooks() {
    m(this, Mr) || (I(this, Mr, !0), Hooks.on("pauseGame", m(this, yo)), Hooks.on("combatStart", m(this, bo)), Hooks.on("combatRound", m(this, vo)), Hooks.on("combatEnd", m(this, wo)), Hooks.on("deleteCombat", m(this, Eo)), Hooks.on("updateCombat", m(this, So)), Hooks.on("canvasReady", m(this, Co)), Hooks.on("updateScene", m(this, To)));
  }
  initialize() {
    m(this, Nr) || (I(this, Nr, !0), I(this, go, Wu((e) => {
      const n = !!e, i = n !== m(this, Et);
      I(this, Et, n), N("GameTimeAutomation | Manage time toggled", { enabled: n }), i && n && C(this, V, Js).call(this), C(this, V, Ft).call(this);
    })), I(this, po, _m((e) => {
      I(this, kr, e), N("GameTimeAutomation | Seconds per round updated", { value: e });
    })), C(this, V, Js).call(this), C(this, V, va).call(this), C(this, V, Ft).call(this));
  }
};
Et = new WeakMap(), kr = new WeakMap(), St = new WeakMap(), wn = new WeakMap(), ri = new WeakMap(), Pt = new WeakMap(), Bi = new WeakMap(), go = new WeakMap(), po = new WeakMap(), Mr = new WeakMap(), Nr = new WeakMap(), ai = new WeakMap(), Rt = new WeakMap(), V = new WeakSet(), Ys = /* @__PURE__ */ c(function() {
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
}, "#currentTimestamp"), Ai = /* @__PURE__ */ c(function() {
  var e;
  return !!((e = game == null ? void 0 : game.user) != null && e.isGM && game.user.active !== !1);
}, "#canControlTime"), ya = /* @__PURE__ */ c(function(e) {
  var i, r;
  if (!e) return !1;
  if (e.active === !0) return !0;
  if (e.active === !1) return !1;
  const n = (i = game == null ? void 0 : game.combats) == null ? void 0 : i.active;
  return (n == null ? void 0 : n.id) === e.id ? !0 : ((r = game == null ? void 0 : game.combat) == null ? void 0 : r.id) === e.id ? game.combat.active ?? !0 : !1;
}, "#isCombatDocumentActive"), Ks = /* @__PURE__ */ c(function(e) {
  return e ? typeof e.started == "boolean" ? e.started : (e.round ?? 0) > 0 : !1;
}, "#hasCombatStarted"), ba = /* @__PURE__ */ c(function() {
  var i;
  const e = Array.isArray((i = game == null ? void 0 : game.combats) == null ? void 0 : i.contents) ? game.combats.contents : [];
  for (const r of e)
    if (C(this, V, ya).call(this, r) && C(this, V, Ks).call(this, r))
      return !0;
  const n = game == null ? void 0 : game.combat;
  return !!(n && C(this, V, ya).call(this, n) && C(this, V, Ks).call(this, n));
}, "#isCombatRunning"), Js = /* @__PURE__ */ c(function() {
  var n;
  m(this, St).clear();
  const e = Array.isArray((n = game == null ? void 0 : game.combats) == null ? void 0 : n.contents) ? game.combats.contents : [];
  for (const i of e)
    i != null && i.id && m(this, St).set(i.id, Math.max(i.round ?? 0, 1));
}, "#hydrateRoundTracking"), Ft = /* @__PURE__ */ c(function({ pausedOverride: e } = {}) {
  const n = typeof e == "boolean" ? e : !!(game != null && game.paused), i = m(this, Et), r = m(this, Rt), a = i && r, o = {
    manageTimeEnabled: i,
    sceneAllowsRealTime: r,
    effectiveEnabled: a,
    paused: n,
    canControl: C(this, V, Ai).call(this),
    combatRunning: C(this, V, ba).call(this),
    overrideApplied: typeof e == "boolean"
  };
  if (N("GameTimeAutomation | Sync running state", o), !a || !C(this, V, Ai).call(this)) {
    C(this, V, Xs).call(this);
    return;
  }
  C(this, V, sd).call(this);
}, "#syncRunningState"), sd = /* @__PURE__ */ c(function() {
  m(this, wn) === null && (I(this, ri, C(this, V, Ys).call(this)), I(this, wn, globalThis.setInterval(() => C(this, V, ld).call(this), 1e3)), N("GameTimeAutomation | Started real-time ticker"));
}, "#startRealTimeTicker"), Xs = /* @__PURE__ */ c(function() {
  m(this, wn) !== null && (globalThis.clearInterval(m(this, wn)), I(this, wn, null), N("GameTimeAutomation | Stopped real-time ticker")), I(this, ri, null), I(this, Pt, 0), I(this, ai, !1);
}, "#stopRealTimeTicker"), ld = /* @__PURE__ */ c(function() {
  if (!m(this, Et) || !m(this, Rt) || !C(this, V, Ai).call(this)) {
    C(this, V, Xs).call(this);
    return;
  }
  const e = C(this, V, Ys).call(this);
  if (typeof e != "number" || !Number.isFinite(e)) return;
  const n = m(this, ri) ?? e, i = (e - n) / 1e3;
  if (I(this, ri, e), !Number.isFinite(i) || i <= 0) return;
  const r = !!(game != null && game.paused), a = C(this, V, ba).call(this);
  if (r || a) {
    m(this, ai) || N("GameTimeAutomation | Tick skipped", { paused: r, combatRunning: a }), I(this, ai, !0), I(this, Pt, 0);
    return;
  }
  I(this, ai, !1), N("GameTimeAutomation | Real-time tick", { deltaSeconds: i }), C(this, V, Qs).call(this, i);
}, "#tickRealTime"), Qs = /* @__PURE__ */ c(function(e) {
  if (!m(this, Et) || !m(this, Rt)) return;
  const n = Number(e);
  !Number.isFinite(n) || n <= 0 || (I(this, Pt, m(this, Pt) + n), !m(this, Bi) && I(this, Bi, C(this, V, cd).call(this)));
}, "#queueAdvance"), cd = /* @__PURE__ */ c(async function() {
  var e, n;
  for (; m(this, Pt) > 0; ) {
    if (!m(this, Et) || !m(this, Rt) || game != null && game.paused || !C(this, V, Ai).call(this) || C(this, V, ba).call(this)) {
      I(this, Pt, 0);
      break;
    }
    const i = m(this, Pt);
    I(this, Pt, 0);
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
  I(this, Bi, null);
}, "#flushAdvanceQueue"), yo = new WeakMap(), bo = new WeakMap(), vo = new WeakMap(), wo = new WeakMap(), Eo = new WeakMap(), So = new WeakMap(), Zs = /* @__PURE__ */ c(function() {
  const e = or();
  return We(e) ? e : null;
}, "#getActiveSceneDocument"), ud = /* @__PURE__ */ c(function(e) {
  if (!We(e)) return !1;
  try {
    return !!e.getFlag(T, As);
  } catch (n) {
    return N("GameTimeAutomation | Failed to read scene real-time flag", {
      sceneId: (e == null ? void 0 : e.id) ?? null,
      message: (n == null ? void 0 : n.message) ?? String(n)
    }), !1;
  }
}, "#isSceneRealTimeAllowed"), va = /* @__PURE__ */ c(function(e) {
  const n = We(e) ? e : C(this, V, Zs).call(this), i = C(this, V, ud).call(this, n), r = m(this, Rt);
  return I(this, Rt, i), r !== i ? (N("GameTimeAutomation | Scene real-time allowance changed", {
    sceneId: (n == null ? void 0 : n.id) ?? null,
    allows: i
  }), !0) : !1;
}, "#refreshSceneAutomationState"), Co = new WeakMap(), To = new WeakMap(), c(Tc, "GameTimeAutomation");
let Ws = Tc;
var Pu, En, Re, oi, on, Lo, be, dd, fd, md, hd, Io, tl, Oo, gd, Ao, pd, yd;
const tn = class tn extends Un(Bn) {
  constructor(n = {}) {
    const { scene: i, trigger: r, triggerIndex: a, onSave: o, ...s } = n ?? {};
    super(s);
    k(this, be);
    k(this, En, null);
    k(this, Re, null);
    k(this, oi, null);
    k(this, on, null);
    k(this, Lo, /* @__PURE__ */ c(() => {
      (this.rendered ?? this.isRendered ?? !1) && (I(this, on, C(this, be, dd).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    k(this, Io, /* @__PURE__ */ c((n) => {
      var a, o;
      const i = n.currentTarget, r = i == null ? void 0 : i.closest("form");
      r && (N("Trigger action selection changed", {
        sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
        triggerId: ((o = this.trigger) == null ? void 0 : o.id) ?? null,
        actionId: (i == null ? void 0 : i.value) ?? null
      }), C(this, be, tl).call(this, i.value, r));
    }, "#onActionSelectChange"));
    k(this, Oo, /* @__PURE__ */ c((n) => {
      var u, d, h, f;
      n.preventDefault();
      const i = n.currentTarget, r = i == null ? void 0 : i.closest("form");
      if (!r) return;
      const a = (u = i.dataset) == null ? void 0 : u.target;
      if (!a) return;
      const o = typeof (CSS == null ? void 0 : CSS.escape) == "function" ? CSS.escape : (g) => g, s = r.querySelector(`[name="${o(a)}"]`);
      if (!s) return;
      N("Opening file picker for trigger", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        triggerId: ((h = this.trigger) == null ? void 0 : h.id) ?? null,
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
    k(this, Ao, /* @__PURE__ */ c(async (n) => {
      var r, a;
      n.preventDefault();
      const i = n.currentTarget;
      i instanceof HTMLFormElement && (N("Trigger form submitted", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null,
        triggerId: ((a = this.trigger) == null ? void 0 : a.id) ?? null
      }), await C(this, be, pd).call(this, i));
    }, "#onSubmit"));
    this.scene = i ?? null, this.trigger = r ?? null, this.triggerIndex = Number.isInteger(a) ? Number(a) : null, this.onSave = typeof o == "function" ? o : null, I(this, oi, ec(m(this, Lo)));
  }
  async _prepareContext() {
    var n, i;
    zi("TriggerFormApplication#_prepareContext", {
      sceneId: ((n = this.scene) == null ? void 0 : n.id) ?? null,
      triggerId: ((i = this.trigger) == null ? void 0 : i.id) ?? null,
      triggerIndex: this.triggerIndex
    });
    try {
      const r = this.trigger ?? { action: pa, data: {} }, a = r.action ?? pa, o = Dc(r.time), s = o.format ?? "12h", l = s === "12h" ? zm() : [], u = o.period ?? (l.length > 0 ? l[0].value : null), d = s === "12h" ? l.map((g) => ({
        ...g,
        selected: g.value === u
      })) : [], h = Fc().map((g) => ({
        id: g.id,
        label: typeof g.label == "function" ? g.label() : g.label,
        selected: g.id === a
      })), f = Fc().map((g) => {
        const p = g.id === r.action ? r : { ...r, action: g.id }, y = Hm(p);
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
        actions: h,
        actionSections: f,
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
      _n();
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
      (h) => h.startsWith("theme-")
    );
    a && r.classList.add(a);
    const o = r.querySelector("form");
    if (!o) return;
    C(this, be, gd).call(this, o), C(this, be, fd).call(this, o), o.addEventListener("submit", m(this, Ao));
    const s = o.querySelector("[data-action-select]");
    s && (s.addEventListener("change", m(this, Io)), C(this, be, tl).call(this, s.value, o)), o.querySelectorAll("[data-action-file-picker]").forEach((h) => {
      h.addEventListener("click", m(this, Oo));
    });
  }
  async close(n = {}) {
    var i;
    if ((i = m(this, En)) == null || i.call(this), I(this, En, null), I(this, Re, null), I(this, on, null), typeof m(this, oi) == "function")
      try {
        m(this, oi).call(this);
      } catch (r) {
        console.error(`${T} | Failed to dispose trigger form time format subscription`, r);
      }
    return I(this, oi, null), super.close(n);
  }
};
En = new WeakMap(), Re = new WeakMap(), oi = new WeakMap(), on = new WeakMap(), Lo = new WeakMap(), be = new WeakSet(), dd = /* @__PURE__ */ c(function() {
  var s, l, u, d, h, f, g;
  const n = (l = (s = this.element) == null ? void 0 : s.querySelector) == null ? void 0 : l.call(s, "form");
  if (!(n instanceof HTMLFormElement)) return null;
  const i = Array.from(n.elements ?? []), r = [];
  for (const p of i)
    if ((p instanceof HTMLInputElement || p instanceof HTMLSelectElement || p instanceof HTMLTextAreaElement) && p.name && !(((u = p.dataset) == null ? void 0 : u.timeHidden) !== void 0 || ((d = p.dataset) == null ? void 0 : d.timeHour) !== void 0 || ((h = p.dataset) == null ? void 0 : h.timeMinute) !== void 0 || ((f = p.dataset) == null ? void 0 : f.timePeriod) !== void 0)) {
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
    const p = a.querySelector("[data-time-hidden]"), y = a.querySelector("[data-time-hour]"), w = a.querySelector("[data-time-minute]"), v = a.querySelector("[data-time-period]");
    o = {
      format: ((g = a.dataset) == null ? void 0 : g.timeFormat) ?? null,
      canonical: p instanceof HTMLInputElement ? p.value : "",
      hour: y instanceof HTMLInputElement ? y.value : "",
      minute: w instanceof HTMLInputElement ? w.value : "",
      period: v instanceof HTMLSelectElement ? v.value : ""
    };
  }
  return {
    fields: r,
    time: o
  };
}, "#captureFormState"), fd = /* @__PURE__ */ c(function(n) {
  if (!m(this, on)) return;
  if (!(n instanceof HTMLFormElement)) {
    I(this, on, null);
    return;
  }
  const { fields: i = [], time: r = null } = m(this, on) ?? {};
  I(this, on, null), C(this, be, md).call(this, n, i), C(this, be, hd).call(this, n, r);
}, "#restorePendingFormState"), md = /* @__PURE__ */ c(function(n, i) {
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
}, "#restoreFieldValues"), hd = /* @__PURE__ */ c(function(n, i) {
  var b, E, L;
  const r = n.querySelector("[data-time-format]");
  if (!(r instanceof HTMLElement)) {
    typeof m(this, Re) == "function" && m(this, Re).call(this);
    return;
  }
  const a = ((b = r.dataset) == null ? void 0 : b.timeFormat) === "24h" ? "24h" : "12h", o = r.querySelector("[data-time-hour]"), s = r.querySelector("[data-time-minute]"), l = r.querySelector("[data-time-period]"), u = r.querySelector("[data-time-hidden]");
  if (!i) {
    if (o instanceof HTMLInputElement && (o.value = ""), s instanceof HTMLInputElement && (s.value = ""), l instanceof HTMLSelectElement) {
      const A = ((L = (E = l.options) == null ? void 0 : E[0]) == null ? void 0 : L.value) ?? "";
      l.value = A;
    }
    u instanceof HTMLInputElement && (u.value = ""), typeof m(this, Re) == "function" && m(this, Re).call(this);
    return;
  }
  const d = typeof i.canonical == "string" ? i.canonical : "", h = typeof i.period == "string" ? i.period : "", f = typeof i.hour == "string" ? i.hour : "", g = typeof i.minute == "string" ? i.minute : "";
  let p = "", y = "", w = h, v = d;
  if (d) {
    const A = Dc(d, a);
    p = A.hour ?? "", y = A.minute ?? "", v = A.canonical ?? d, a === "12h" ? w = A.period ?? h : w = "";
  } else
    p = f, y = g, a !== "12h" && (w = "");
  if (o instanceof HTMLInputElement && (o.value = p ?? ""), s instanceof HTMLInputElement && (s.value = y ?? ""), l instanceof HTMLSelectElement)
    if (a === "12h") {
      const A = Array.from(l.options ?? []);
      A.find((M) => M.value === w) ? l.value = w : A.length > 0 ? l.value = A[0].value : l.value = "";
    } else
      l.value = "";
  u instanceof HTMLInputElement && (u.value = v ?? ""), typeof m(this, Re) == "function" && m(this, Re).call(this);
}, "#restoreTimeInputs"), Io = new WeakMap(), tl = /* @__PURE__ */ c(function(n, i) {
  i && i.querySelectorAll("[data-action-config]").forEach((r) => {
    const a = r.dataset.actionConfig === n;
    r.style.display = a ? "" : "none";
  });
}, "#updateActionSections"), Oo = new WeakMap(), gd = /* @__PURE__ */ c(function(n) {
  var h, f, g, p;
  if ((h = m(this, En)) == null || h.call(this), I(this, En, null), I(this, Re, null), !(n instanceof HTMLFormElement)) return;
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
    const { canonical: y, error: w } = Gm(
      {
        hour: o.value,
        minute: s.value,
        period: (l == null ? void 0 : l.value) ?? null,
        time: a.value
      },
      r
    );
    a.value = y ?? "";
    const v = w ?? "";
    a.setCustomValidity(v), u.forEach((b) => {
      b.setCustomValidity(v);
    });
  }, "update");
  u.forEach((y) => {
    y.addEventListener("input", d), y.addEventListener("change", d);
  }), d(), I(this, En, () => {
    u.forEach((y) => {
      y.removeEventListener("input", d), y.removeEventListener("change", d);
    });
  }), I(this, Re, d), N("Trigger form configured for time input", {
    format: r,
    sceneId: ((g = this.scene) == null ? void 0 : g.id) ?? null,
    triggerId: ((p = this.trigger) == null ? void 0 : p.id) ?? null
  });
}, "#setupTimeInput"), Ao = new WeakMap(), pd = /* @__PURE__ */ c(async function(n) {
  var a, o, s, l, u;
  if (typeof m(this, Re) == "function" && m(this, Re).call(this), typeof n.checkValidity == "function" && !n.checkValidity()) {
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
  }), await C(this, be, yd).call(this, r), await this.close();
}, "#handleSubmit"), yd = /* @__PURE__ */ c(async function(n) {
  var a, o, s, l, u, d;
  const i = {
    id: ((a = this.trigger) == null ? void 0 : a.id) ?? Im(),
    time: n.time ?? "",
    action: n.action ?? pa,
    allowReplayOnRewind: !!n.allowReplayOnRewind,
    data: {}
  };
  N("Persisting trigger from form", {
    sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
    triggerId: i.id,
    existingIndex: this.triggerIndex
  }), qm(i, n);
  const r = Pi(this.scene);
  this.triggerIndex !== null && r[this.triggerIndex] ? r[this.triggerIndex] = i : r.push(i);
  try {
    await Ju(this.scene, r), N("Trigger list saved", {
      sceneId: ((s = this.scene) == null ? void 0 : s.id) ?? null,
      triggerCount: r.length
    });
  } catch (h) {
    throw console.error(`${T} | Failed to save time trigger`, h), (u = (l = ui.notifications) == null ? void 0 : l.error) == null || u.call(
      l,
      S(
        "EIDOLON.TimeTrigger.TriggerSaveError",
        "Failed to save the scene's time triggers."
      )
    ), h;
  }
  if (this.onSave)
    try {
      this.onSave(r);
    } catch (h) {
      console.error(`${T} | Trigger onSave callback failed`, h), N("Trigger onSave callback failed", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        message: (h == null ? void 0 : h.message) ?? String(h)
      });
    }
}, "#persistTrigger"), c(tn, "TriggerFormApplication"), ge(tn, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Pe(tn, tn, "DEFAULT_OPTIONS"),
  {
    id: `${T}-trigger-form`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Pu = Pe(tn, tn, "DEFAULT_OPTIONS")) == null ? void 0 : Pu.classes) ?? [], "standard-form", "themed"])
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
)), ge(tn, "PARTS", {
  content: {
    template: `modules/${T}/templates/time-trigger-form.html`
  }
});
let el = tn;
function _t(t) {
  return t instanceof HTMLElement ? t : (t == null ? void 0 : t[0]) instanceof HTMLElement ? t[0] : null;
}
c(_t, "asHTMLElement");
function wa(t) {
  return typeof (t == null ? void 0 : t.changeTab) == "function";
}
c(wa, "isAppV2");
function bd(t, e, n, i = {}) {
  if (wa(t)) {
    t.changeTab(e, n, i);
    return;
  }
  if (typeof (t == null ? void 0 : t.activateTab) == "function") {
    const r = { ...i };
    n != null && (r.group = n), r.triggerCallback == null && (r.triggerCallback = !0), t.activateTab(e, r);
  }
}
c(bd, "setActiveTab");
function Ym(t) {
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
c(Ym, "readFormData");
const Rc = Symbol.for("eidolon.sceneConfig.v13PatchedTabs");
function vd(t = {}) {
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
    moduleId: h = "eidolon-utilities",
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
  }, w = Symbol(`EIDOLON_SCENE_CONFIG_TAB_CLEANUP_${e}`), v = typeof i == "function" ? i : () => null, b = typeof r == "function" ? r : () => !0, E = typeof n == "function" ? n : () => typeof n == "string" ? n : e;
  function L() {
    var W, q, U, K, ae;
    const _ = ((q = (W = foundry == null ? void 0 : foundry.applications) == null ? void 0 : W.sheets) == null ? void 0 : q.SceneConfig) ?? ((U = CONFIG == null ? void 0 : CONFIG.Scene) == null ? void 0 : U.sheetClass);
    if (!_ || !wa({ changeTab: (K = _.prototype) == null ? void 0 : K.changeTab })) return;
    const H = _[Rc] ?? /* @__PURE__ */ new Set();
    if (H.has(e)) return;
    H.add(e), _[Rc] = H;
    const B = (ae = _.TABS) == null ? void 0 : ae.sheet;
    if (B && Array.isArray(B.tabs) && !B.tabs.some((Q) => Q.id === e)) {
      const Q = E({ app: null, scene: null }) ?? e;
      B.tabs.push({
        id: e,
        icon: f,
        label: Q
      });
    }
    _.PARTS && !_.PARTS[e] && (_.PARTS[e] = {
      template: `modules/${h}/templates/scene-config-tab-mount.hbs`,
      scrollable: [`.tab[data-tab="${e}"]`]
    }), g("Patched v13 SceneConfig TABS/PARTS", { tabId: e });
  }
  c(L, "patchV13SceneConfig");
  function A(_, H) {
    var W, q;
    const B = v(_);
    if (!b(_, B)) {
      g("Skipped render", {
        tabId: e,
        reason: "inapplicable",
        constructor: ((W = _ == null ? void 0 : _.constructor) == null ? void 0 : W.name) ?? null
      });
      return;
    }
    p("render", {
      tabId: e,
      sceneId: (B == null ? void 0 : B.id) ?? null,
      constructor: ((q = _ == null ? void 0 : _.constructor) == null ? void 0 : q.name) ?? null
    });
    try {
      const U = _t(H) ?? _t(_.element);
      if (!U) {
        g("Missing root element", { tabId: e });
        return;
      }
      wa(_) ? x(_, U, B) : M(_, U, B);
    } finally {
      y();
    }
  }
  c(A, "handleRender");
  function O(_, H, B) {
    var U;
    if (!f) {
      _.textContent = H;
      return;
    }
    const W = (U = _.querySelector("i")) == null ? void 0 : U.cloneNode(!0);
    _.textContent = "";
    const q = W ?? document.createElement("i");
    if (W || (q.className = f, B && (q.inert = !0)), _.append(q, " "), B) {
      const K = document.createElement("span");
      K.textContent = H, _.append(K);
    } else
      _.append(document.createTextNode(H));
  }
  c(O, "setButtonContent");
  function M(_, H, B) {
    var it, Jt, Ye, Le, Ti, Xt, Vn, rt, Qt, P, ea, X, gt, Me, er, ta;
    const q = [
      "nav.sheet-tabs[data-group]",
      "nav.tabs[data-group]",
      "nav.sheet-tabs",
      "nav.tabs"
    ].map((Ne) => H.querySelector(Ne)).find((Ne) => Ne instanceof HTMLElement), K = [
      (it = H.querySelector(".tab[data-tab]")) == null ? void 0 : it.parentElement,
      H.querySelector(".sheet-body"),
      (Ye = (Jt = q == null ? void 0 : q.parentElement) == null ? void 0 : Jt.querySelector) == null ? void 0 : Ye.call(Jt, ":scope > .sheet-body"),
      q == null ? void 0 : q.parentElement
    ].find((Ne) => Ne instanceof HTMLElement), ae = ((Le = q == null ? void 0 : q.dataset) == null ? void 0 : Le.group) ?? ((Vn = (Xt = (Ti = q == null ? void 0 : q.querySelector) == null ? void 0 : Ti.call(q, "a[data-group]")) == null ? void 0 : Xt.dataset) == null ? void 0 : Vn.group) ?? ((P = (Qt = (rt = q == null ? void 0 : q.querySelector) == null ? void 0 : rt.call(q, "[data-group]")) == null ? void 0 : Qt.dataset) == null ? void 0 : P.group) ?? ((gt = (X = (ea = K == null ? void 0 : K.querySelector) == null ? void 0 : ea.call(K, ".tab[data-group]")) == null ? void 0 : X.dataset) == null ? void 0 : gt.group) ?? "main";
    if (!q || !K) {
      g("Missing navigation elements", {
        tabId: e,
        hasNav: !!q,
        hasBody: !!K
      });
      return;
    }
    let Q = q.querySelector(`[data-tab="${e}"]`);
    if (!Q) {
      Q = document.createElement("a"), Q.dataset.action = "tab", Q.dataset.group = ae, Q.dataset.tab = e;
      const Ne = q.querySelector("a[data-tab]");
      (Me = Ne == null ? void 0 : Ne.classList) != null && Me.contains("item") && Q.classList.add("item"), q.appendChild(Q), typeof s == "function" && s({ app: _, button: Q, nav: q, scene: B }), g("Created tab button", { tabId: e, group: ae });
    }
    O(Q, E({ app: _, scene: B }) ?? e, wa(_));
    let te = K.querySelector(`.tab[data-tab="${e}"]`);
    if (!te) {
      te = document.createElement("div"), te.classList.add("tab"), te.dataset.tab = e, te.dataset.group = ae;
      const Ne = wd(K);
      K.insertBefore(te, Ne ?? null), typeof l == "function" && l({ app: _, tab: te, body: K, scene: B }), g("Created tab container", { tabId: e, group: ae });
    }
    ((er = Q.classList) == null ? void 0 : er.contains("active")) || te.classList.contains("active") ? (Q.classList.add("active"), te.classList.add("active"), te.removeAttribute("hidden")) : (Q.classList.remove("active"), te.classList.remove("active"), te.setAttribute("hidden", "true"));
    const ht = /* @__PURE__ */ c(() => {
      var Gn, tr;
      ((Gn = Q.classList) != null && Gn.contains("active") || te.classList.contains("active")) && ((tr = Q.classList) == null || tr.add("active"), te.classList.add("active"), te.removeAttribute("hidden"), te.removeAttribute("aria-hidden"), te.style.display === "none" && (te.style.display = ""));
    }, "ensureTabVisible"), De = /* @__PURE__ */ c(() => {
      ht(), requestAnimationFrame(ht);
    }, "scheduleEnsureTabVisible");
    Q.dataset.eidolonEnsureSceneTabVisibility || (Q.addEventListener("click", () => {
      bd(_, e, ae), requestAnimationFrame(ht);
    }), Q.dataset.eidolonEnsureSceneTabVisibility = "true"), cs(_, w, g);
    const nt = a({
      app: _,
      scene: B,
      tab: te,
      tabButton: Q,
      ensureTabVisible: ht,
      scheduleEnsureTabVisible: De
    });
    typeof nt == "function" && Hc(_, w, nt), typeof u == "function" && u({
      app: _,
      scene: B,
      tab: te,
      tabButton: Q,
      ensureTabVisible: ht,
      scheduleEnsureTabVisible: De
    }), (ta = _.setPosition) == null || ta.call(_, { height: "auto" });
  }
  c(M, "handleRenderV1");
  function x(_, H, B) {
    const W = H.querySelector(`.tab[data-tab="${e}"]`), q = H.querySelector(`nav [data-tab="${e}"]`);
    if (!W || !q) {
      g("v2 mount not found, falling back to v1 injection", { tabId: e }), M(_, H, B);
      return;
    }
    O(q, E({ app: _, scene: B }) ?? e, !0);
    const U = /* @__PURE__ */ c(() => {
      var Q;
      !((Q = q.classList) != null && Q.contains("active")) && !W.classList.contains("active") || (W.classList.add("active"), W.removeAttribute("hidden"), W.removeAttribute("aria-hidden"), W.style.display === "none" && (W.style.display = ""));
    }, "ensureTabVisible"), K = /* @__PURE__ */ c(() => {
      U(), requestAnimationFrame(U);
    }, "scheduleEnsureTabVisible");
    cs(_, w, g);
    const ae = a({
      app: _,
      scene: B,
      tab: W,
      tabButton: q,
      ensureTabVisible: U,
      scheduleEnsureTabVisible: K
    });
    typeof ae == "function" && Hc(_, w, ae), typeof u == "function" && u({
      app: _,
      scene: B,
      tab: W,
      tabButton: q,
      ensureTabVisible: U,
      scheduleEnsureTabVisible: K
    });
  }
  c(x, "handleRenderV2");
  function R(_) {
    cs(_, w, g);
  }
  c(R, "handleClose");
  function D() {
    return Hooks.once("init", () => {
      L();
    }), Hooks.on("renderSceneConfig", A), Hooks.on("closeSceneConfig", R), () => F();
  }
  c(D, "register");
  function F() {
    Hooks.off("renderSceneConfig", A), Hooks.off("closeSceneConfig", R);
  }
  return c(F, "unregister"), { register: D, unregister: F };
}
c(vd, "createSceneConfigTabFactory");
function Hc(t, e, n) {
  if (!t || typeof n != "function") return;
  const i = t == null ? void 0 : t[e];
  Array.isArray(i) || (t[e] = []), t[e].push(n);
}
c(Hc, "registerCleanup");
function cs(t, e, n) {
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
c(cs, "invokeCleanup");
function wd(t) {
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
c(wd, "findFooterElement");
const Km = Ho(el), Jm = `modules/${T}/templates/time-trigger-scene-tab.html`, Xm = vd({
  tabId: "time-triggers",
  tabLabel: /* @__PURE__ */ c(() => S("EIDOLON.TimeTrigger.Tab", "Time Triggers"), "tabLabel"),
  getScene: Wt,
  isApplicable: th,
  renderContent: /* @__PURE__ */ c(({ app: t, scene: e, tab: n }) => Zm(t, n, e), "renderContent"),
  logger: {
    log: N,
    group: zi,
    groupEnd: _n
  }
});
function Qm() {
  return N("Registering SceneConfig render hook"), Xm.register();
}
c(Qm, "registerSceneConfigHook");
function Zm(t, e, n) {
  if (!(e instanceof HTMLElement)) return;
  const i = We(n) ? n : Wt(t);
  Ha(t, e, i);
  const r = ec(() => {
    Ha(t, e, i);
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
c(Zm, "renderTimeTriggerTab");
async function Ha(t, e, n) {
  var r, a;
  const i = n ?? Wt(t);
  zi("renderTimeTriggersTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!We(i)) {
      const W = S(
        "EIDOLON.TimeTrigger.Unavailable",
        "Time triggers are unavailable for this configuration sheet."
      );
      e.innerHTML = `<p class="notes">${W}</p>`, N("Scene lacks document for time triggers", { sceneId: (i == null ? void 0 : i.id) ?? null });
      return;
    }
    const o = `flags.${T}.${xa}`, s = `flags.${T}.${Is}`, l = `flags.${T}.${Os}`, u = !!i.getFlag(T, xa), d = !!i.getFlag(T, Is), h = !!i.getFlag(T, Os), f = Pi(i);
    N("Rendering time trigger list", {
      sceneId: i.id,
      isActive: u,
      shouldHideWindow: d,
      shouldShowPlayerWindow: h,
      triggerCount: f.length
    });
    const g = S("EIDOLON.TimeTrigger.Activate", "Activate Time Trigger"), p = S(
      "EIDOLON.TimeTrigger.Description",
      "Enable scene time triggers so scheduled actions can run automatically."
    ), y = S(
      "EIDOLON.TimeTrigger.HideWindowLabel",
      "Hide Floating Time Window"
    ), w = S(
      "EIDOLON.TimeTrigger.HideWindowDescription",
      "Keep the floating time control window hidden while leaving time triggers active."
    ), v = S(
      "EIDOLON.TimeTrigger.ShowPlayerWindowLabel",
      "Share Floating Time Window with Players"
    ), b = S(
      "EIDOLON.TimeTrigger.ShowPlayerWindowDescription",
      "Let non-GM players see the floating time window (without time controls)."
    ), E = S(
      "EIDOLON.TimeTrigger.TriggerListLabel",
      "Scene Time Triggers"
    ), L = S(
      "EIDOLON.TimeTrigger.TriggerListEmpty",
      "No time triggers configured for this scene."
    ), A = S("EIDOLON.TimeTrigger.AddTrigger", "Add Trigger"), O = S("EIDOLON.TimeTrigger.EditTrigger", "Edit"), M = S("EIDOLON.TimeTrigger.DeleteTrigger", "Remove"), x = S("EIDOLON.TimeTrigger.TriggerNow", "Trigger Now"), R = S("EIDOLON.TimeTrigger.AtLabel", "At"), D = S("EIDOLON.TimeTrigger.DoLabel", "Do"), F = S("EIDOLON.TimeTrigger.MissingTime", "(No time set)"), _ = f.map((W, q) => {
      const ae = (W.time ? Vm(W.time) : "") || W.time || "" || F, Q = Pm(W.action), te = [
        `${R} ${ae}`,
        `${D} ${Q}`,
        ...Rm(W)
      ];
      return {
        index: q,
        summaryParts: te,
        tooltips: {
          triggerNow: x,
          edit: O,
          delete: M
        }
      };
    }), H = ((a = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : a.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof H != "function") {
      console.error(`${T} | renderTemplate is unavailable; cannot render scene tab.`), e.innerHTML = `<p class="notes">${L}</p>`;
      return;
    }
    let B = "";
    try {
      B = await H(Jm, {
        flags: {
          active: o,
          hideWindow: s,
          showPlayerWindow: l
        },
        states: {
          isActive: u,
          hideWindow: d,
          showPlayerWindow: h
        },
        labels: {
          activate: g,
          hideWindow: y,
          showPlayerWindow: v,
          triggerList: E,
          empty: L,
          add: A
        },
        hints: {
          activate: p,
          hideWindow: w,
          showPlayerWindow: b
        },
        triggers: _,
        hasTriggers: _.length > 0
      });
    } catch (W) {
      console.error(`${T} | Failed to render time trigger scene tab template`, W), e.innerHTML = `<p class="notes">${L}</p>`;
      return;
    }
    e.innerHTML = B, eh(t, e, i);
  } finally {
    _n();
  }
}
c(Ha, "renderTimeTriggersTabContent");
function eh(t, e, n) {
  const i = n ?? Wt(t);
  if (!We(i)) return;
  const r = e.querySelector('[data-action="add-trigger"]');
  r && r.addEventListener("click", () => {
    N("Add trigger button clicked", { sceneId: i.id }), qc(t, { scene: i });
  }), e.querySelectorAll('[data-action="edit-trigger"]').forEach((a) => {
    a.addEventListener("click", () => {
      const o = Number(a.dataset.index);
      if (!Number.isInteger(o)) return;
      const l = Pi(i)[o];
      l && (N("Edit trigger button clicked", { sceneId: i.id, triggerId: l.id, index: o }), qc(t, { trigger: l, triggerIndex: o, scene: i }));
    });
  }), e.querySelectorAll('[data-action="delete-trigger"]').forEach((a) => {
    a.addEventListener("click", async () => {
      var u, d;
      const o = Number(a.dataset.index);
      if (!Number.isInteger(o)) return;
      const s = Pi(i), l = s[o];
      if (l) {
        s.splice(o, 1);
        try {
          N("Deleting trigger", {
            sceneId: i.id,
            index: o,
            triggerId: (l == null ? void 0 : l.id) ?? null
          }), await Ju(i, s), await Ha(t, e, i);
        } catch (h) {
          console.error(`${T} | Failed to delete time trigger`, h), (d = (u = ui.notifications) == null ? void 0 : u.error) == null || d.call(
            u,
            S(
              "EIDOLON.TimeTrigger.TriggerDeleteError",
              "Failed to remove the selected time trigger."
            )
          );
        }
      }
    });
  }), e.querySelectorAll('[data-action="fire-trigger"]').forEach((a) => {
    a.addEventListener("click", async () => {
      var u, d, h, f, g, p, y;
      const o = Number(a.dataset.index);
      if (!Number.isInteger(o)) return;
      const l = Pi(i)[o];
      if (l) {
        if (!((u = game.user) != null && u.isGM)) {
          (h = (d = ui.notifications) == null ? void 0 : d.warn) == null || h.call(
            d,
            S("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time.")
          );
          return;
        }
        try {
          N("Manually firing trigger", { sceneId: i.id, triggerId: l.id, index: o }), await Xu(i, l), (g = (f = ui.notifications) == null ? void 0 : f.info) == null || g.call(
            f,
            S(
              "EIDOLON.TimeTrigger.TriggerNowSuccess",
              "Triggered the selected time trigger."
            )
          );
        } catch (w) {
          console.error(`${T} | Failed to execute time trigger manually`, w), (y = (p = ui.notifications) == null ? void 0 : p.error) == null || y.call(
            p,
            S(
              "EIDOLON.TimeTrigger.TriggerNowError",
              "Failed to execute the selected time trigger."
            )
          ), N("Manual trigger execution failed", {
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
c(eh, "bindTimeTriggerTabEvents");
function qc(t, e = {}) {
  var o;
  const n = e.scene ?? null, i = n && We(n) ? n : Wt(t);
  if (!We(i)) {
    console.warn(`${T} | Unable to open trigger form because no scene document is available.`);
    return;
  }
  N("Opening trigger form", {
    sceneId: i.id,
    triggerId: ((o = e.trigger) == null ? void 0 : o.id) ?? null,
    index: Number.isInteger(e.triggerIndex) ? Number(e.triggerIndex) : null
  }), Km({
    scene: i,
    trigger: e.trigger ?? null,
    triggerIndex: e.triggerIndex ?? null,
    onSave: /* @__PURE__ */ c(() => {
      var l, u;
      const s = (u = (l = t.element) == null ? void 0 : l[0]) == null ? void 0 : u.querySelector('.tab[data-tab="time-triggers"]');
      s && Ha(t, s, i);
    }, "onSave")
  }).render({ force: !0 });
}
c(qc, "openTriggerForm");
function th(t, e) {
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
c(th, "isRecognizedSceneConfig");
const aa = new zs(), jc = new Ws();
function nh() {
  N("Registering time trigger hooks"), Hooks.once("init", () => {
    Om(), $m(), N("Time trigger settings registered during init");
  }), Qm(), N("Scene config hook registered"), jc.registerHooks(), N("Time automation hooks registered"), Hooks.once("ready", () => {
    xm(), N("Ready hook fired"), aa.onReady(), jc.initialize();
  }), Hooks.on("canvasReady", (t) => {
    var e;
    N("canvasReady hook received", { scene: ((e = t == null ? void 0 : t.scene) == null ? void 0 : e.id) ?? null }), aa.onCanvasReady(t);
  }), Hooks.on("updateScene", (t) => {
    N("updateScene hook received", { scene: (t == null ? void 0 : t.id) ?? null }), aa.onUpdateScene(t);
  }), Hooks.on("updateWorldTime", (t, e) => {
    N("updateWorldTime hook received", { worldTime: t, diff: e }), aa.onUpdateWorldTime(t, e);
  });
}
c(nh, "registerTimeTriggerHooks");
nh();
const Ee = T, Ed = "criteria", nc = "state", ih = "criteriaVersion", rh = 1, Sd = "enableCriteriaSurfaces";
let Bc = !1;
function ah() {
  var t;
  if (!Bc) {
    if (Bc = !0, !((t = game == null ? void 0 : game.settings) != null && t.register)) {
      console.warn(`${Ee} | game.settings.register unavailable; scene criteria setting skipped.`);
      return;
    }
    game.settings.register(Ee, Sd, {
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
        oh();
      }, "onChange")
    });
  }
}
c(ah, "registerSceneCriteriaSettings");
function qo() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return !!game.settings.get(Ee, Sd);
  } catch (e) {
    console.error(`${Ee} | Failed to read criteria surfaces setting`, e);
  }
  return !0;
}
c(qo, "getCriteriaSurfacesEnabled");
function oh() {
  var a, o, s, l, u;
  const t = S("EIDOLON.SceneCriteria.ReloadPromptTitle", "Reload Required"), e = `<p>${S(
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
    S(
      "EIDOLON.SceneCriteria.ReloadNotice",
      "Please reload the world to apply criteria editor surface changes."
    )
  );
}
c(oh, "promptReloadForCriteriaSurfaces");
const qa = "Standard";
function mt(t) {
  var n;
  const e = (n = t == null ? void 0 : t.getFlag) == null ? void 0 : n.call(t, Ee, Ed);
  return e ? Cd(e) : [];
}
c(mt, "getSceneCriteria");
async function jo(t, e) {
  if (!(t != null && t.setFlag)) return;
  const n = Cd(e);
  await t.setFlag(Ee, Ed, n), await t.setFlag(Ee, ih, rh);
  const i = Jr(t, n);
  await t.setFlag(Ee, nc, i);
}
c(jo, "setSceneCriteria");
function Jr(t, e = null) {
  var r;
  const n = Array.isArray(e) ? e : mt(t), i = zt(((r = t == null ? void 0 : t.getFlag) == null ? void 0 : r.call(t, Ee, nc)) ?? {});
  return rc(i, n);
}
c(Jr, "getSceneCriteriaState");
async function sh(t, e, n = null) {
  if (!(t != null && t.setFlag)) return;
  const i = Array.isArray(n) ? n : mt(t), r = rc(e, i);
  await t.setFlag(Ee, nc, r);
}
c(sh, "setSceneCriteriaState");
function ic(t = "") {
  const e = typeof t == "string" ? t.trim() : "", n = Td(il(e || "criterion"), /* @__PURE__ */ new Set());
  return {
    id: Ld(),
    key: n,
    label: e,
    values: [qa],
    default: qa,
    order: 0
  };
}
c(ic, "createSceneCriterion");
function Cd(t) {
  const e = Array.isArray(t) ? zt(t) : [], n = [], i = /* @__PURE__ */ new Set();
  return e.forEach((r, a) => {
    const o = nl(r, a, i);
    o && (n.push(o), i.add(o.key));
  }), n;
}
c(Cd, "sanitizeCriteria$1");
function nl(t, e = 0, n = /* @__PURE__ */ new Set()) {
  if (!t || typeof t != "object") return null;
  const i = typeof t.id == "string" && t.id.trim() ? t.id.trim() : Ld(), a = (typeof t.label == "string" ? t.label : typeof t.name == "string" ? t.name : "").trim(), o = typeof t.key == "string" && t.key.trim() ? il(t.key) : il(a || `criterion-${Number(e) + 1}`), s = Td(o, n), l = ch(t.values);
  let u = typeof t.default == "string" ? t.default.trim() : "";
  u || (u = l[0] ?? qa), l.includes(u) || l.unshift(u);
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
c(nl, "sanitizeCriterion");
function rc(t, e = []) {
  const n = t && typeof t == "object" ? zt(t) : {}, i = {};
  for (const r of e) {
    const a = n == null ? void 0 : n[r.key], o = typeof a == "string" ? a.trim() : "";
    o && r.values.includes(o) ? i[r.key] = o : i[r.key] = r.default;
  }
  return i;
}
c(rc, "sanitizeSceneCriteriaState");
function lh(t) {
  return mt(t).map((n) => ({
    id: n.key,
    key: n.key,
    name: n.label,
    values: [...n.values]
  }));
}
c(lh, "getSceneCriteriaCategories");
function ch(t) {
  const e = Array.isArray(t) ? t : [], n = [];
  for (const i of e) {
    if (typeof i != "string") continue;
    const r = i.trim();
    !r || n.includes(r) || n.push(r);
  }
  return n.length || n.push(qa), n;
}
c(ch, "sanitizeCriterionValues");
function il(t) {
  return String(t ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
c(il, "slugifyCriterionKey");
function Td(t, e) {
  if (!e.has(t)) return t;
  let n = 2;
  for (; e.has(`${t}-${n}`); )
    n += 1;
  return `${t}-${n}`;
}
c(Td, "ensureUniqueCriterionKey");
function Ld() {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 11);
}
c(Ld, "generateCriterionId");
function Id(t) {
  var e, n;
  console.error(`${Ee} | Failed to persist scene criteria`, t), (n = (e = ui.notifications) == null ? void 0 : e.error) == null || n.call(
    e,
    S(
      "EIDOLON.SceneCriteria.PersistError",
      "Failed to persist the scene criteria."
    )
  );
}
c(Id, "notifyPersistError");
var Ru, me, sn, Fe, Od, ko, Mo, No, _o, Ea, $o, _r, $r, sr, Ad;
const nn = class nn extends Un(Bn) {
  constructor(n = {}) {
    const { scene: i, criterion: r, isNew: a, onSave: o, ...s } = n ?? {};
    super(s);
    k(this, Fe);
    k(this, me, null);
    k(this, sn, !1);
    k(this, ko, /* @__PURE__ */ c(async (n) => {
      n.preventDefault();
      const i = n.currentTarget;
      if (!(i instanceof HTMLFormElement)) return;
      const r = new FormData(i), a = String(r.get("criterionLabel") ?? "").trim(), o = String(r.get("criterionKey") ?? "").trim(), s = Array.from(i.querySelectorAll('[name="criterionValues"]')).map((h) => h instanceof HTMLInputElement ? h.value.trim() : "").filter((h, f, g) => h && g.indexOf(h) === f), u = String(r.get("criterionDefault") ?? "").trim() || s[0] || "Standard", d = nl(
        {
          id: m(this, me).id,
          key: o,
          label: a,
          values: s,
          default: u,
          order: Number(m(this, me).order ?? 0)
        },
        0,
        /* @__PURE__ */ new Set()
      );
      d && (I(this, me, d), await C(this, Fe, Ad).call(this), this.close());
    }, "#onSubmit"));
    k(this, Mo, /* @__PURE__ */ c((n) => {
      var o;
      if (m(this, sn)) return;
      const i = n.currentTarget, r = (i == null ? void 0 : i.form) ?? ((o = this.element) == null ? void 0 : o.querySelector("form"));
      if (!(r instanceof HTMLFormElement)) return;
      const a = r.querySelector('input[name="criterionKey"]');
      a instanceof HTMLInputElement && (a.value = rr(i.value));
    }, "#onLabelInput"));
    k(this, No, /* @__PURE__ */ c((n) => {
      var l;
      const i = n.currentTarget, r = (i == null ? void 0 : i.form) ?? ((l = this.element) == null ? void 0 : l.querySelector("form"));
      if (!(r instanceof HTMLFormElement) || !(i instanceof HTMLInputElement)) return;
      const a = r.querySelector('input[name="criterionLabel"]'), o = rr(a instanceof HTMLInputElement ? a.value : ""), s = rr(i.value);
      I(this, sn, s !== o), i.value = s, C(this, Fe, Ea).call(this, r);
    }, "#onKeyInput"));
    k(this, _o, /* @__PURE__ */ c((n) => {
      var o, s;
      n.preventDefault();
      const i = ((o = n.currentTarget) == null ? void 0 : o.form) ?? ((s = this.element) == null ? void 0 : s.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector('input[name="criterionLabel"]'), a = i.querySelector('input[name="criterionKey"]');
      a instanceof HTMLInputElement && (a.value = rr(r instanceof HTMLInputElement ? r.value : ""), I(this, sn, !1), C(this, Fe, Ea).call(this, i));
    }, "#onResetAutoKey"));
    k(this, $o, /* @__PURE__ */ c((n) => {
      var l, u, d, h, f, g;
      n.preventDefault();
      const i = ((l = n.currentTarget) == null ? void 0 : l.form) ?? ((u = this.element) == null ? void 0 : u.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector(".scene-criterion-editor__values");
      if (!(r instanceof HTMLElement)) return;
      (d = r.querySelector(".scene-criterion-editor__empty")) == null || d.remove();
      const a = document.createElement("div");
      a.classList.add("scene-criterion-editor__value");
      const o = Mt(S("EIDOLON.SceneCriteria.ValuePlaceholder", "Allowed value")), s = Mt(S("EIDOLON.SceneCriteria.RemoveValue", "Remove Value"));
      a.innerHTML = `
      <input type="text" name="criterionValues" value="" placeholder="${o}" class="form-control">
      <button type="button" class="icon" data-action="remove-value" aria-label="${s}" title="${s}">
        <i class="fa-solid fa-trash"></i>
      </button>
    `, r.appendChild(a), (h = a.querySelector('[data-action="remove-value"]')) == null || h.addEventListener("click", m(this, _r)), (f = a.querySelector('input[name="criterionValues"]')) == null || f.addEventListener("input", m(this, $r)), C(this, Fe, sr).call(this, i), (g = a.querySelector('input[name="criterionValues"]')) == null || g.focus();
    }, "#onAddValue"));
    k(this, _r, /* @__PURE__ */ c((n) => {
      var a, o, s, l;
      n.preventDefault(), (o = (a = n.currentTarget) == null ? void 0 : a.closest(".scene-criterion-editor__value")) == null || o.remove();
      const i = ((s = n.currentTarget) == null ? void 0 : s.form) ?? ((l = this.element) == null ? void 0 : l.querySelector("form"));
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
        C(this, Fe, sr).call(this, i);
      }
    }, "#onRemoveValue"));
    k(this, $r, /* @__PURE__ */ c((n) => {
      var r, a;
      const i = ((r = n.currentTarget) == null ? void 0 : r.form) ?? ((a = this.element) == null ? void 0 : a.querySelector("form"));
      i instanceof HTMLFormElement && C(this, Fe, sr).call(this, i);
    }, "#onValuesChanged"));
    this.scene = i ?? null, this.criterion = r ?? null, this.onSave = typeof o == "function" ? o : null, this.isNew = !!a, I(this, me, C(this, Fe, Od).call(this)), I(this, sn, m(this, me).key !== rr(m(this, me).label));
  }
  async _prepareContext() {
    var i, r, a, o;
    const n = Array.isArray((i = m(this, me)) == null ? void 0 : i.values) ? m(this, me).values : [];
    return {
      isNew: this.isNew,
      key: ((r = m(this, me)) == null ? void 0 : r.key) ?? "",
      label: ((a = m(this, me)) == null ? void 0 : a.label) ?? "",
      defaultValue: ((o = m(this, me)) == null ? void 0 : o.default) ?? "",
      values: n.map((s, l) => {
        var u;
        return {
          index: l,
          value: s,
          selected: s === ((u = m(this, me)) == null ? void 0 : u.default)
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
      keyIsCustom: m(this, sn)
    };
  }
  _onRender(n, i) {
    var a, o, s, l, u, d;
    super._onRender(n, i);
    const r = (a = this.element) == null ? void 0 : a.querySelector("form");
    r && (r.addEventListener("submit", m(this, ko)), (o = r.querySelector('[data-action="add-value"]')) == null || o.addEventListener("click", m(this, $o)), (s = r.querySelector('input[name="criterionLabel"]')) == null || s.addEventListener("input", m(this, Mo)), (l = r.querySelector('input[name="criterionKey"]')) == null || l.addEventListener("input", m(this, No)), (u = r.querySelector('[data-action="reset-auto-key"]')) == null || u.addEventListener("click", m(this, _o)), r.querySelectorAll('[data-action="remove-value"]').forEach((h) => {
      h.addEventListener("click", m(this, _r));
    }), r.querySelectorAll('input[name="criterionValues"]').forEach((h) => {
      h.addEventListener("input", m(this, $r));
    }), (d = r.querySelector('[data-action="cancel"]')) == null || d.addEventListener("click", (h) => {
      h.preventDefault(), this.close();
    }), C(this, Fe, Ea).call(this, r), C(this, Fe, sr).call(this, r));
  }
};
me = new WeakMap(), sn = new WeakMap(), Fe = new WeakSet(), Od = /* @__PURE__ */ c(function() {
  const n = nl(this.criterion, 0, /* @__PURE__ */ new Set()) ?? ic(S("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion"));
  return {
    id: n.id,
    key: n.key,
    label: n.label ?? "",
    values: Array.isArray(n.values) ? [...n.values] : [],
    default: n.default
  };
}, "#initializeState"), ko = new WeakMap(), Mo = new WeakMap(), No = new WeakMap(), _o = new WeakMap(), Ea = /* @__PURE__ */ c(function(n) {
  const i = n.querySelector('[data-action="reset-auto-key"]');
  i instanceof HTMLButtonElement && (i.disabled = !m(this, sn));
}, "#syncAutoKeyButton"), $o = new WeakMap(), _r = new WeakMap(), $r = new WeakMap(), sr = /* @__PURE__ */ c(function(n) {
  var l, u;
  const i = n.querySelector('select[name="criterionDefault"]');
  if (!(i instanceof HTMLSelectElement)) return;
  const r = ((u = (l = i.value) == null ? void 0 : l.trim) == null ? void 0 : u.call(l)) ?? "", a = Array.from(n.querySelectorAll('input[name="criterionValues"]')).map((d) => d instanceof HTMLInputElement ? d.value.trim() : "").filter((d, h, f) => d && f.indexOf(d) === h), o = i.dataset.emptyLabel || S("EIDOLON.SceneCriteria.ValueListEmpty", "No values have been added to this criterion.");
  if (i.innerHTML = "", !a.length) {
    const d = document.createElement("option");
    d.value = "", d.textContent = o, d.selected = !0, i.appendChild(d);
    return;
  }
  const s = a.includes(r) ? r : a[0];
  for (const d of a) {
    const h = document.createElement("option");
    h.value = d, h.textContent = d, h.selected = d === s, i.appendChild(h);
  }
}, "#syncDefaultOptions"), Ad = /* @__PURE__ */ c(async function() {
  if (!this.scene) return;
  const n = mt(this.scene).sort((r, a) => r.order - a.order), i = n.findIndex((r) => r.id === m(this, me).id);
  i < 0 ? (m(this, me).order = n.length, n.push(m(this, me))) : (m(this, me).order = n[i].order, n.splice(i, 1, m(this, me)));
  try {
    await jo(this.scene, n), this.onSave && await this.onSave(m(this, me));
  } catch (r) {
    Id(r);
  }
}, "#persist"), c(nn, "CategoryEditorApplication"), ge(nn, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Pe(nn, nn, "DEFAULT_OPTIONS"),
  {
    id: `${Ee}-criterion-editor`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Ru = Pe(nn, nn, "DEFAULT_OPTIONS")) == null ? void 0 : Ru.classes) ?? [], "standard-form", "themed"])
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
)), ge(nn, "PARTS", {
  content: {
    template: `modules/${Ee}/templates/scene-criteria-editor.html`
  }
});
let rl = nn;
function rr(t) {
  return String(t ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
c(rr, "slugifyKey");
const uh = `modules/${Ee}/templates/scene-criteria-tab.html`, al = {
  log: /* @__PURE__ */ c((...t) => {
    var e;
    return (e = console.debug) == null ? void 0 : e.call(console, `${Ee} | Criteria`, ...t);
  }, "log"),
  group: /* @__PURE__ */ c((...t) => {
    var e;
    return (e = console.groupCollapsed) == null ? void 0 : e.call(console, `${Ee} | Criteria`, ...t);
  }, "group"),
  groupEnd: /* @__PURE__ */ c(() => {
    var t;
    return (t = console.groupEnd) == null ? void 0 : t.call(console);
  }, "groupEnd")
}, dh = Ho(rl), fh = vd({
  tabId: "criteria",
  tabLabel: /* @__PURE__ */ c(() => S("EIDOLON.SceneCriteria.TabLabel", "Criteria"), "tabLabel"),
  getScene: Wt,
  isApplicable: /* @__PURE__ */ c(() => qo(), "isApplicable"),
  renderContent: /* @__PURE__ */ c(({ app: t, tab: e, scene: n }) => hh(t, e, n), "renderContent"),
  logger: al
});
function mh() {
  return fh.register();
}
c(mh, "registerSceneCriteriaConfigHook");
function hh(t, e, n) {
  if (!(e instanceof HTMLElement)) return;
  const i = We(n) ? n : Wt(t);
  ki(t, e, i);
}
c(hh, "renderCriteriaTab");
async function ki(t, e, n) {
  var r, a;
  const i = n ?? Wt(t);
  al.group("renderCriteriaTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!We(i)) {
      const d = S(
        "EIDOLON.SceneCriteria.Unavailable",
        "Scene criteria are unavailable for this configuration sheet."
      );
      e.innerHTML = `<p class="notes">${d}</p>`;
      return;
    }
    const o = mt(i).sort((d, h) => d.order - h.order), s = Jr(i, o), l = ((a = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : a.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof l != "function") {
      e.innerHTML = `<p class="notes">${S("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
      return;
    }
    const u = await l(uh, {
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
        criteriaCount: o.length,
        valueCount: o.reduce((d, h) => d + h.values.length, 0)
      },
      criteria: o.map((d, h) => {
        var f, g;
        return {
          id: d.id,
          label: d.label,
          displayName: ((g = (f = d.label) == null ? void 0 : f.trim) == null ? void 0 : g.call(f)) || S("EIDOLON.SceneCriteria.UnnamedCategory", "Unnamed Criterion"),
          hasValues: d.values.length > 0,
          values: d.values.map((p) => ({
            value: p,
            isCurrent: (s[d.key] ?? d.default) === p
          })),
          valueCountLabel: ph(d.values.length),
          canMoveUp: h > 0,
          canMoveDown: h < o.length - 1
        };
      }),
      hasCriteria: o.length > 0
    });
    e.innerHTML = u, gh(t, e, i);
  } catch (o) {
    console.error(`${Ee} | Failed to render criteria tab`, o), e.innerHTML = `<p class="notes">${S("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
  } finally {
    al.groupEnd();
  }
}
c(ki, "renderCriteriaTabContent");
function gh(t, e, n) {
  const i = n ?? Wt(t);
  if (!We(i)) return;
  const r = e.querySelector('[data-criteria-action="add"]');
  r && r.addEventListener("click", () => {
    Uc(t, {
      scene: i,
      criterion: ic(
        S("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion")
      ),
      isNew: !0,
      onSave: /* @__PURE__ */ c(() => ki(t, e, i), "onSave")
    });
  }), e.querySelectorAll('[data-criteria-action="edit"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", () => {
      const s = mt(i).find((l) => l.id === o);
      s && Uc(t, {
        scene: i,
        criterion: s,
        onSave: /* @__PURE__ */ c(() => ki(t, e, i), "onSave")
      });
    });
  }), e.querySelectorAll('[data-criteria-action="remove"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await us(i, (l) => {
        const u = l.findIndex((d) => d.id === o);
        return u < 0 ? !1 : (l.splice(u, 1), ds(l), !0);
      }) && await ki(t, e, i);
    });
  }), e.querySelectorAll('[data-criteria-action="move-up"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await us(i, (l) => {
        const u = l.findIndex((h) => h.id === o);
        if (u <= 0) return !1;
        const [d] = l.splice(u, 1);
        return l.splice(u - 1, 0, d), ds(l), !0;
      }) && await ki(t, e, i);
    });
  }), e.querySelectorAll('[data-criteria-action="move-down"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await us(i, (l) => {
        const u = l.findIndex((h) => h.id === o);
        if (u < 0 || u >= l.length - 1) return !1;
        const [d] = l.splice(u, 1);
        return l.splice(u + 1, 0, d), ds(l), !0;
      }) && await ki(t, e, i);
    });
  });
}
c(gh, "bindCriteriaTabEvents");
async function us(t, e) {
  const n = mt(t).sort((r, a) => r.order - a.order);
  if (e(n) === !1) return !1;
  try {
    return await jo(t, n), !0;
  } catch (r) {
    return Id(r), !1;
  }
}
c(us, "mutateCriteria");
function Uc(t, e = {}) {
  const n = e.scene ?? null, i = n && We(n) ? n : Wt(t);
  if (!We(i))
    return;
  dh({
    scene: i,
    criterion: e.criterion ?? null,
    isNew: !!e.isNew,
    onSave: typeof e.onSave == "function" ? e.onSave : null
  }).render({ force: !0 });
}
c(Uc, "openCriterionEditor");
function ds(t) {
  t.forEach((e, n) => {
    e.order = n;
  });
}
c(ds, "reindexCriteriaOrder");
function ph(t) {
  var e, n;
  if ((n = (e = game.i18n) == null ? void 0 : e.has) != null && n.call(e, "EIDOLON.SceneCriteria.ValueCountLabel"))
    try {
      return game.i18n.format("EIDOLON.SceneCriteria.ValueCountLabel", { count: t });
    } catch (i) {
      console.error(`${Ee} | Failed to format value count label`, i);
    }
  return t === 0 ? "No values configured" : t === 1 ? "1 value" : `${t} values`;
}
c(ph, "formatValueCount");
let Vc = !1;
function yh() {
  Hooks.once("init", () => {
    ah();
  }), Hooks.once("ready", () => {
    qo() && (Vc || (mh(), Vc = !0));
  });
}
c(yh, "registerSceneCriteriaHooks");
yh();
const ie = T, kd = "criteriaEngineVersion", mi = "fileIndex", hi = "tileCriteria", ac = {
  LEGACY: 1,
  CRITERIA: 2
}, Md = ac.CRITERIA;
function Nd(t) {
  var e;
  return ((e = t == null ? void 0 : t.getFlag) == null ? void 0 : e.call(t, ie, kd)) ?? ac.LEGACY;
}
c(Nd, "getSceneEngineVersion");
function bh(t, e, n, i, r) {
  if (!(t != null && t.length) || !(n != null && n.length)) return -1;
  const a = {};
  for (const s of n)
    a[s] = e[s];
  const o = Gc(t, a, n);
  if (o >= 0) return o;
  if (i != null && i.length && r) {
    const s = { ...a };
    for (const l of i) {
      if (!(l in s)) continue;
      s[l] = r[l] ?? "Standard";
      const u = Gc(t, s, n);
      if (u >= 0) return u;
    }
  }
  return -1;
}
c(bh, "findBestMatch");
function Gc(t, e, n) {
  return t.findIndex((i) => {
    for (const r of n)
      if (i[r] !== e[r]) return !1;
    return !0;
  });
}
c(Gc, "findExactMatch");
function vh(t, e) {
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
c(vh, "findFileIndex");
function Sa(t) {
  return t && typeof t == "object" && !Array.isArray(t);
}
c(Sa, "isPlainObject$2");
function zc(t) {
  return t == null ? t : typeof structuredClone == "function" ? structuredClone(t) : JSON.parse(JSON.stringify(t));
}
c(zc, "deepClone");
function wh(t, e) {
  if (!e) return;
  const n = e.split(".").filter(Boolean);
  if (!n.length) return;
  let i = t;
  for (let r = 0; r < n.length - 1; r += 1) {
    if (!Sa(i == null ? void 0 : i[n[r]])) return;
    i = i[n[r]];
  }
  delete i[n.at(-1)];
}
c(wh, "deletePath");
function _d(t, e) {
  const n = zc(t ?? {});
  if (!Sa(e)) return n;
  for (const [i, r] of Object.entries(e)) {
    if (i.startsWith("-=") && r === !0) {
      wh(n, i.slice(2));
      continue;
    }
    Sa(r) && Sa(n[i]) ? n[i] = _d(n[i], r) : n[i] = zc(r);
  }
  return n;
}
c(_d, "fallbackMerge");
function Eh(t, e) {
  var n, i;
  return (n = foundry == null ? void 0 : foundry.utils) != null && n.mergeObject && ((i = foundry == null ? void 0 : foundry.utils) != null && i.deepClone) ? foundry.utils.mergeObject(t, foundry.utils.deepClone(e), {
    inplace: !1
  }) : _d(t, e);
}
c(Eh, "defaultMerge");
function Sh(t, e) {
  if (!t) return !0;
  for (const n of Object.keys(t))
    if (t[n] !== e[n]) return !1;
  return !0;
}
c(Sh, "criteriaMatch");
function $d(t, e, n, i) {
  const r = i ?? Eh;
  let a = r({}, t ?? {});
  if (!(e != null && e.length)) return a;
  const o = [];
  for (let s = 0; s < e.length; s += 1) {
    const l = e[s];
    if (Sh(l == null ? void 0 : l.criteria, n)) {
      const u = l != null && l.criteria ? Object.keys(l.criteria).length : 0;
      o.push({ specificity: u, index: s, delta: l == null ? void 0 : l.delta });
    }
  }
  o.sort((s, l) => s.specificity - l.specificity || s.index - l.index);
  for (const s of o)
    s.delta && (a = r(a, s.delta));
  return a;
}
c($d, "resolveRules");
function Bo(t = null) {
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
c(Bo, "canManageCriteria");
function Ch(t = null) {
  if (!Bo(t))
    throw new Error(`${ie} | You do not have permission to manage scene criteria.`);
}
c(Ch, "requireCriteriaAccess");
const Th = /* @__PURE__ */ c((...t) => console.log(`${ie} | criteria tiles:`, ...t), "log$1");
let ja = /* @__PURE__ */ new WeakMap(), Ba = /* @__PURE__ */ new WeakMap();
const Wc = 200;
function Lh(t) {
  return t ? Number.isInteger(t.size) ? t.size : Array.isArray(t) || typeof t.length == "number" ? t.length : Array.from(t).length : 0;
}
c(Lh, "getCollectionSize$1");
function oa() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
c(oa, "nowMs$2");
function Ih(t) {
  if (!Array.isArray(t)) return [];
  const e = /* @__PURE__ */ new Set();
  for (const n of t) {
    if (typeof n != "string") continue;
    const i = n.trim();
    i && e.add(i);
  }
  return Array.from(e);
}
c(Ih, "uniqueStringKeys$1");
function Oh(t, e = Wc) {
  if (!Array.isArray(t) || t.length === 0) return [];
  const n = Number.isInteger(e) && e > 0 ? e : Wc, i = [];
  for (let r = 0; r < t.length; r += n)
    i.push(t.slice(r, r + n));
  return i;
}
c(Oh, "chunkArray$1");
async function Ah(t, e, n) {
  const i = Oh(e, n);
  for (const r of i)
    await t.updateEmbeddedDocuments("Tile", r), i.length > 1 && await Promise.resolve();
  return i.length;
}
c(Ah, "updateTilesInChunks");
function kh(t) {
  var i;
  const e = vi(t, { files: null });
  if (!((i = e == null ? void 0 : e.variants) != null && i.length)) return [];
  const n = /* @__PURE__ */ new Set();
  for (const r of e.variants)
    for (const a of Object.keys(r.criteria ?? {}))
      a && n.add(a);
  return Array.from(n);
}
c(kh, "getTileCriteriaDependencyKeys");
function Mh(t, e) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
  for (const r of e) {
    const a = r.getFlag(ie, hi) ?? r.getFlag(ie, mi);
    if (a) {
      i.add(r.id);
      for (const o of kh(a))
        n.has(o) || n.set(o, /* @__PURE__ */ new Set()), n.get(o).add(r.id);
    }
  }
  return {
    collection: e,
    keyToTileIds: n,
    allTileIds: i
  };
}
c(Mh, "buildTileDependencyIndex");
function Nh(t, e) {
  const n = Ba.get(t);
  if ((n == null ? void 0 : n.collection) === e) return n;
  const i = Mh(t, e);
  return Ba.set(t, i), i;
}
c(Nh, "getTileDependencyIndex");
function _h(t, e, n) {
  const i = Ih(n);
  if (!i.length)
    return Array.from(e ?? []);
  const r = Nh(t, e), a = /* @__PURE__ */ new Set();
  for (const o of i) {
    const s = r.keyToTileIds.get(o);
    if (s)
      for (const l of s)
        a.add(l);
  }
  return a.size ? typeof (e == null ? void 0 : e.get) == "function" ? Array.from(a).map((o) => e.get(o)).filter(Boolean) : Array.from(e ?? []).filter((o) => a.has(o.id)) : [];
}
c(_h, "getTilesForChangedKeys");
function xd(t) {
  return typeof (t == null ? void 0 : t.name) == "string" ? t.name : typeof (t == null ? void 0 : t.src) == "string" ? t.src : "";
}
c(xd, "getFilePath");
function Ua(t) {
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
c(Ua, "normalizeFilePath");
function oc(t) {
  if (!Array.isArray(t)) return [];
  const e = /* @__PURE__ */ new Map();
  return t.map((n, i) => {
    const r = Ua(xd(n)), a = r || `__index:${i}`, o = e.get(a) ?? 0;
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
c(oc, "buildTileFileEntries");
function Rn(t, e) {
  if (!Number.isInteger(e) || e < 0) return null;
  const i = oc(t).find((r) => r.index === e);
  return i ? { ...i.target } : { indexHint: e };
}
c(Rn, "createTileTargetFromIndex");
function Uo(t) {
  if (!t || typeof t != "object") return null;
  const e = Ua(t.path), n = Number(t.indexHint ?? t.fileIndex), i = Number(t.occurrence), r = {};
  return e && (r.path = e, r.occurrence = Number.isInteger(i) && i >= 0 ? i : 0), Number.isInteger(n) && n >= 0 && (r.indexHint = n), !r.path && !Number.isInteger(r.indexHint) ? null : r;
}
c(Uo, "normalizeTileTarget");
function Cr(t, e) {
  const n = Uo(t);
  if (!n) return -1;
  const i = oc(e);
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
c(Cr, "resolveTileTargetIndex");
function Hn(t) {
  if (!t || typeof t != "object" || Array.isArray(t)) return {};
  const e = {};
  for (const [n, i] of Object.entries(t))
    typeof n != "string" || !n || typeof i != "string" || !i.trim() || (e[n] = i.trim());
  return e;
}
c(Hn, "sanitizeCriteria");
function $h(t) {
  return Object.entries(Hn(t)).sort(([n], [i]) => n.localeCompare(i)).map(([n, i]) => `${n}=${i}`).join("");
}
c($h, "serializeCriteria");
function xh(t) {
  return Object.keys(Hn(t)).length;
}
c(xh, "getCriteriaSpecificity");
function Fh(t, e) {
  const n = Hn(t), i = Hn(e);
  for (const [r, a] of Object.entries(n))
    if (r in i && i[r] !== a)
      return !1;
  return !0;
}
c(Fh, "areCriteriaCompatible");
function Dh(t, e) {
  const n = Cr(t, e);
  if (Number.isInteger(n) && n >= 0)
    return `index:${n}`;
  const i = Uo(t);
  if (!i) return "";
  if (i.path) {
    const r = Number.isInteger(i.occurrence) ? i.occurrence : 0;
    return `path:${i.path}#${r}`;
  }
  return Number.isInteger(i.indexHint) ? `hint:${i.indexHint}` : "";
}
c(Dh, "getTargetIdentity");
function Fd(t, e = {}) {
  var s;
  const n = Array.isArray(e.files) ? e.files : [], i = vi(t, { files: n });
  if (!((s = i == null ? void 0 : i.variants) != null && s.length))
    return {
      errors: [],
      warnings: []
    };
  const r = i.variants.map((l, u) => ({
    index: u,
    criteria: Hn(l.criteria),
    specificity: xh(l.criteria),
    criteriaSignature: $h(l.criteria),
    targetIdentity: Dh(l.target, n)
  })), a = [], o = [];
  for (let l = 0; l < r.length; l += 1) {
    const u = r[l];
    for (let d = l + 1; d < r.length; d += 1) {
      const h = r[d];
      if (u.specificity !== h.specificity || !Fh(u.criteria, h.criteria)) continue;
      if (!(!!u.targetIdentity && u.targetIdentity === h.targetIdentity)) {
        a.push({
          leftIndex: u.index,
          rightIndex: h.index,
          type: u.criteriaSignature === h.criteriaSignature ? "equivalent" : "overlap",
          specificity: u.specificity
        });
        continue;
      }
      u.criteriaSignature === h.criteriaSignature && o.push({
        leftIndex: u.index,
        rightIndex: h.index,
        type: "duplicate"
      });
    }
  }
  return {
    errors: a,
    warnings: o
  };
}
c(Fd, "detectTileCriteriaConflicts");
function Ph(t, e) {
  if (!t || typeof t != "object") return null;
  let n = Uo(t.target);
  if (!n) {
    const i = Number(t.fileIndex);
    Number.isInteger(i) && i >= 0 && (n = Rn(e, i));
  }
  return n ? {
    criteria: Hn(t.criteria),
    target: n
  } : null;
}
c(Ph, "normalizeTileVariant");
function Dd(t, e = {}) {
  if (!Array.isArray(t) || t.length === 0) return null;
  const n = Array.isArray(e.files) ? e.files : null, i = t.map((l, u) => ({
    criteria: Hn(l),
    target: Rn(n, u)
  })).filter((l) => l.target);
  if (!i.length) return null;
  const r = i.find((l) => Object.keys(l.criteria).length === 0), a = (r == null ? void 0 : r.target) ?? i[0].target;
  let o = null;
  const s = Number(e.defaultFileIndex);
  return Number.isInteger(s) && s >= 0 && (o = Rn(n, s)), o || (o = a), {
    strategy: "select-one",
    variants: i,
    defaultTarget: o
  };
}
c(Dd, "buildTileCriteriaFromFileIndex");
function vi(t, e = {}) {
  const n = Array.isArray(e.files) ? e.files : null;
  if (Array.isArray(t))
    return Dd(t, { files: n });
  if (!t || typeof t != "object") return null;
  const i = Array.isArray(t.variants) ? t.variants.map((a) => Ph(a, n)).filter(Boolean) : [];
  if (!i.length) return null;
  let r = Uo(t.defaultTarget);
  if (!r) {
    const a = Number(t.defaultFileIndex);
    Number.isInteger(a) && a >= 0 && (r = Rn(n, a));
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
c(vi, "normalizeTileCriteria");
function Rh(t, e) {
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
c(Rh, "selectTileFileIndexFromCompiled");
function Hh(t, e) {
  const n = vi(t, { files: e });
  if (!n) return null;
  const i = n.variants.map((a) => {
    const o = Hn(a.criteria), s = Cr(a.target, e);
    return !Number.isInteger(s) || s < 0 ? null : {
      criteria: o,
      keys: Object.keys(o),
      targetIndex: s
    };
  }).filter(Boolean), r = Cr(n.defaultTarget, e);
  return !i.length && (!Number.isInteger(r) || r < 0) ? null : {
    variants: i,
    defaultIndex: r
  };
}
c(Hh, "compileTileMatcher");
function qh(t, e, n) {
  const i = ja.get(t);
  if (i && i.tileCriteria === e && i.files === n)
    return i.compiled;
  const r = Hh(e, n);
  return ja.set(t, {
    tileCriteria: e,
    files: n,
    compiled: r
  }), r;
}
c(qh, "getCompiledTileMatcher");
function jh(t = null, e = null) {
  t ? Ba.delete(t) : Ba = /* @__PURE__ */ new WeakMap(), e ? ja.delete(e) : t || (ja = /* @__PURE__ */ new WeakMap());
}
c(jh, "invalidateTileCriteriaCaches");
async function Pd(t, e, n = {}) {
  var l, u, d, h;
  const i = oa(), r = {
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
    return r.durationMs = oa() - i, r;
  const a = e.getEmbeddedCollection("Tile") ?? [];
  r.total = Lh(a);
  const o = _h(e, a, n.changedKeys);
  if (r.scanned = o.length, !o.length)
    return r.skipped.unaffected = r.total, r.durationMs = oa() - i, r;
  const s = [];
  for (const f of o) {
    const g = f.getFlag(ie, hi) ?? f.getFlag(ie, mi);
    if (!g) {
      r.skipped.noCriteria += 1;
      continue;
    }
    const p = f.getFlag("monks-active-tiles", "files");
    if (!(p != null && p.length)) {
      r.skipped.noFiles += 1;
      continue;
    }
    const y = qh(f, g, p), w = Rh(y, t);
    if (!Number.isInteger(w) || w < 0 || w >= p.length) {
      console.warn(`${ie} | Tile ${f.id} has no valid file match for state`, t), r.skipped.noMatch += 1;
      continue;
    }
    const v = w + 1, E = Number(f.getFlag("monks-active-tiles", "fileindex")) !== v, L = p.some((D, F) => !!(D != null && D.selected) != (F === w)), A = Ua(((u = f.texture) == null ? void 0 : u.src) ?? ((h = (d = f._source) == null ? void 0 : d.texture) == null ? void 0 : h.src) ?? ""), O = xd(p[w]), M = Ua(O), x = !!M && M !== A;
    if (!L && !E && !x) {
      r.skipped.unchanged += 1;
      continue;
    }
    const R = {
      _id: f._id
    };
    L && (R["flags.monks-active-tiles.files"] = p.map((D, F) => ({
      ...D,
      selected: F === w
    }))), E && (R["flags.monks-active-tiles.fileindex"] = v), x && (R.texture = { src: O }), s.push(R), Th(`Tile ${f.id} -> ${O}`);
  }
  return s.length > 0 && (r.chunks = await Ah(e, s, n.chunkSize), r.updated = s.length), r.durationMs = oa() - i, r;
}
c(Pd, "updateTiles");
function Bh() {
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
c(Bh, "buildLightControlsMap");
const gi = T, Ri = "lightCriteria", sc = Object.freeze({
  base: null,
  mappings: [],
  current: null
});
function fs(t) {
  return t && typeof t == "object" && !Array.isArray(t);
}
c(fs, "isPlainObject$1");
function Rd(t, e) {
  if (!fs(e)) return {};
  const n = {};
  for (const [i, r] of Object.entries(e)) {
    const a = t == null ? void 0 : t[i];
    if (fs(r) && fs(a)) {
      const o = Rd(a, r);
      Object.keys(o).length > 0 && (n[i] = o);
    } else r !== a && (n[i] = zt(r));
  }
  return n;
}
c(Rd, "computeDelta");
function Hd(t) {
  var n;
  const e = ((n = t == null ? void 0 : t.getFlag) == null ? void 0 : n.call(t, gi, Ri)) ?? sc;
  return Tr(e);
}
c(Hd, "getLightCriteriaState");
async function qd(t, e) {
  const n = Tr(e);
  if (!(t != null && t.setFlag))
    return n;
  const i = n.base !== null, r = n.mappings.length > 0, a = n.current !== null;
  return !i && !r && !a ? (typeof t.unsetFlag == "function" ? await t.unsetFlag(gi, Ri) : await t.setFlag(gi, Ri, null), sc) : (await t.setFlag(gi, Ri, n), n);
}
c(qd, "setLightCriteriaState");
async function Xr(t, e) {
  if (typeof e != "function")
    throw new TypeError("updateLightCriteriaState requires an updater function.");
  const n = zt(Hd(t)), i = await e(n);
  return qd(t, i);
}
c(Xr, "updateLightCriteriaState");
async function Yc(t, e) {
  const n = wi(e);
  if (!n)
    throw new Error("Invalid light configuration payload.");
  return Xr(t, (i) => ({
    ...i,
    base: n
  }));
}
c(Yc, "storeBaseLighting");
async function Kc(t, e, n, { label: i } = {}) {
  const r = Qr(e);
  if (!r)
    throw new Error("Cannot create a mapping without at least one category selection.");
  const a = wi(n);
  if (!a)
    throw new Error("Invalid light configuration payload.");
  return Xr(t, (o) => {
    const s = Zi(r), l = Array.isArray(o == null ? void 0 : o.mappings) ? [...o.mappings] : [], u = l.findIndex((g) => (g == null ? void 0 : g.key) === s), d = u >= 0 ? l[u] : null, h = typeof (d == null ? void 0 : d.id) == "string" && d.id.trim() ? d.id.trim() : Bd(), f = Vo({
      id: h,
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
c(Kc, "upsertLightCriteriaMapping");
async function Uh(t, e, n, i, { replaceExisting: r = !1 } = {}) {
  const a = typeof e == "string" ? e.trim() : "";
  if (!a)
    throw new Error("A mapping id is required to retarget criteria.");
  const o = Qr(n);
  if (!o)
    throw new Error("Cannot retarget mapping without at least one category selection.");
  const s = wi(i);
  if (!s)
    throw new Error("Invalid light configuration payload.");
  return Xr(t, (l) => {
    const u = Array.isArray(l == null ? void 0 : l.mappings) ? [...l.mappings] : [], d = u.findIndex((v) => (v == null ? void 0 : v.id) === a);
    if (d < 0)
      throw new Error("The selected mapping no longer exists.");
    const h = Zi(o), f = u.findIndex(
      (v, b) => b !== d && (v == null ? void 0 : v.key) === h
    );
    if (f >= 0 && !r)
      throw new Error("A mapping already exists for the selected criteria.");
    const g = u[d], p = Vo({
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
c(Uh, "retargetLightCriteriaMapping");
async function Vh(t, e) {
  const n = typeof e == "string" ? e.trim() : "";
  if (!n)
    throw new Error("A mapping id is required to remove a mapping.");
  return Xr(t, (i) => {
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
c(Vh, "removeLightCriteriaMapping");
async function mr(t, e) {
  const n = jd(e);
  return Xr(t, (i) => ({
    ...i,
    current: n
  }));
}
c(mr, "storeCurrentCriteriaSelection");
function Gh(t) {
  const e = Tr(t), n = e.base ?? {}, i = [];
  for (const r of e.mappings) {
    const a = Qr(r == null ? void 0 : r.categories);
    if (!a) continue;
    const o = Rd(n, (r == null ? void 0 : r.config) ?? {});
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
c(Gh, "convertLightCriteriaStateToPresets");
function zh(t, e = []) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
  for (const l of e)
    typeof (l == null ? void 0 : l.key) == "string" && l.key.trim() && i.add(l.key.trim()), typeof (l == null ? void 0 : l.id) == "string" && l.id.trim() && typeof (l == null ? void 0 : l.key) == "string" && n.set(l.id.trim(), l.key.trim());
  const r = Tr(t), a = /* @__PURE__ */ c((l) => {
    const u = {};
    for (const [d, h] of Object.entries(l ?? {})) {
      const f = String(d ?? "").trim(), g = typeof h == "string" ? h.trim() : "";
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
    return u ? Vo({
      ...l,
      categories: u,
      key: Zi(u)
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
  return Tr({
    ...r,
    mappings: o,
    current: s
  });
}
c(zh, "migrateLightCriteriaCategoriesToKeys");
function Tr(t) {
  var l;
  const e = zt(t);
  if (!e || typeof e != "object")
    return zt(sc);
  const n = wi(e.base), i = Array.isArray(e.mappings) ? e.mappings : [], r = /* @__PURE__ */ new Map();
  for (const u of i) {
    const d = Vo(u);
    d && r.set(d.key, d);
  }
  const a = Array.from(r.values()), o = new Map(a.map((u) => [u.id, u]));
  let s = jd(e.current);
  if (s) {
    const u = s.categories && Object.keys(s.categories).length > 0;
    if (s.mappingId && !o.has(s.mappingId)) {
      const d = u ? ((l = a.find((h) => h.key === Zi(s.categories))) == null ? void 0 : l.id) ?? null : null;
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
c(Tr, "sanitizeLightCriteriaState");
function wi(t) {
  const e = zt(t);
  if (!e || typeof e != "object") return null;
  "_id" in e && delete e._id, "id" in e && delete e.id;
  const n = e.flags;
  if (n && typeof n == "object") {
    const i = n[gi];
    i && typeof i == "object" && (delete i[Ri], Object.keys(i).length === 0 && delete n[gi]), Object.keys(n).length === 0 && delete e.flags;
  }
  return e;
}
c(wi, "sanitizeLightConfigPayload");
function Vo(t) {
  if (!t || typeof t != "object") return null;
  const e = Qr(t.categories);
  if (!e) return null;
  const n = wi(t.config);
  if (!n) return null;
  const i = typeof t.id == "string" && t.id.trim() ? t.id.trim() : Bd(), r = Zi(e), a = {
    id: i,
    key: r,
    categories: e,
    config: n,
    updatedAt: Number.isFinite(t.updatedAt) ? Number(t.updatedAt) : Date.now()
  };
  return typeof t.label == "string" && t.label.trim() && (a.label = t.label.trim()), a;
}
c(Vo, "sanitizeCriteriaMappingEntry");
function jd(t) {
  if (!t || typeof t != "object") return null;
  const e = typeof t.mappingId == "string" && t.mappingId.trim() ? t.mappingId.trim() : null, n = Qr(t.categories);
  return !e && !n ? null : {
    mappingId: e,
    categories: n,
    updatedAt: Number.isFinite(t.updatedAt) ? Number(t.updatedAt) : Date.now()
  };
}
c(jd, "sanitizeCurrentSelection");
function Qr(t) {
  const e = {};
  if (Array.isArray(t))
    for (const n of t) {
      const i = Jc((n == null ? void 0 : n.id) ?? (n == null ? void 0 : n.categoryId) ?? (n == null ? void 0 : n.category)), r = Xc((n == null ? void 0 : n.value) ?? (n == null ? void 0 : n.selection) ?? (n == null ? void 0 : n.label));
      !i || !r || (e[i] = r);
    }
  else if (t && typeof t == "object")
    for (const [n, i] of Object.entries(t)) {
      const r = Jc(n), a = Xc(i);
      !r || !a || (e[r] = a);
    }
  return Object.keys(e).length > 0 ? e : null;
}
c(Qr, "sanitizeCriteriaCategories");
function Zi(t) {
  if (!t || typeof t != "object") return "";
  const e = Object.entries(t).filter(([, n]) => typeof n == "string" && n).map(([n, i]) => `${n}:${i}`);
  return e.sort((n, i) => n < i ? -1 : n > i ? 1 : 0), e.join("|");
}
c(Zi, "computeCriteriaMappingKey");
function Bd() {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
c(Bd, "generateLightMappingId");
function Jc(t) {
  if (typeof t != "string") return null;
  const e = t.trim();
  return e || null;
}
c(Jc, "normalizeCategoryId");
function Xc(t) {
  if (typeof t != "string") return null;
  const e = t.trim();
  return e || null;
}
c(Xc, "normalizeCategoryValue");
const Va = ["AmbientLight", "Wall", "AmbientSound"];
let Ga = /* @__PURE__ */ new WeakMap(), za = /* @__PURE__ */ new WeakMap();
const Qc = 200;
function Wh(t) {
  return t ? Number.isInteger(t.size) ? t.size : Array.isArray(t) || typeof t.length == "number" ? t.length : Array.from(t).length : 0;
}
c(Wh, "getCollectionSize");
function ms() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
c(ms, "nowMs$1");
function Yh(t) {
  if (!Array.isArray(t)) return [];
  const e = /* @__PURE__ */ new Set();
  for (const n of t) {
    if (typeof n != "string") continue;
    const i = n.trim();
    i && e.add(i);
  }
  return Array.from(e);
}
c(Yh, "uniqueStringKeys");
function Kh(t, e = Qc) {
  if (!Array.isArray(t) || t.length === 0) return [];
  const n = Number.isInteger(e) && e > 0 ? e : Qc, i = [];
  for (let r = 0; r < t.length; r += n)
    i.push(t.slice(r, r + n));
  return i;
}
c(Kh, "chunkArray");
async function Jh(t, e, n, i) {
  const r = Kh(n, i);
  for (const a of r)
    await t.updateEmbeddedDocuments(e, a), r.length > 1 && await Promise.resolve();
  return r.length;
}
c(Jh, "updatePlaceablesInChunks");
function Xh(t) {
  const e = /* @__PURE__ */ new Set();
  for (const n of (t == null ? void 0 : t.rules) ?? [])
    for (const i of Object.keys((n == null ? void 0 : n.criteria) ?? {}))
      i && e.add(i);
  return Array.from(e);
}
c(Xh, "getPresetDependencyKeys");
function Qh(t, e) {
  const n = /* @__PURE__ */ new Map();
  for (const i of Va) {
    const r = e.get(i) ?? [], a = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Map();
    for (const s of r) {
      const l = Vd(s, i);
      if (l != null && l.base) {
        a.add(s.id);
        for (const u of Xh(l))
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
c(Qh, "buildPlaceableDependencyIndex");
function Zh(t, e) {
  const n = za.get(t);
  if (n && Va.every((r) => n.collectionsByType.get(r) === e.get(r)))
    return n;
  const i = Qh(t, e);
  return za.set(t, i), i;
}
c(Zh, "getPlaceableDependencyIndex");
function eg(t, e, n) {
  if (!e || !t) return [];
  const i = Yh(n);
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
c(eg, "getDocsForChangedKeys");
function Ni(t) {
  return !!t && typeof t == "object" && !Array.isArray(t);
}
c(Ni, "isPlainObject");
function ol(t, e) {
  if (Object.is(t, e)) return !0;
  if (Array.isArray(t) || Array.isArray(e)) {
    if (!Array.isArray(t) || !Array.isArray(e) || t.length !== e.length) return !1;
    for (let n = 0; n < t.length; n += 1)
      if (!ol(t[n], e[n])) return !1;
    return !0;
  }
  if (Ni(t) || Ni(e)) {
    if (!Ni(t) || !Ni(e)) return !1;
    const n = Object.keys(e);
    for (const i of n)
      if (!ol(t[i], e[i])) return !1;
    return !0;
  }
  return !1;
}
c(ol, "areValuesEqual");
function Ud(t, e) {
  const n = { _id: e._id };
  for (const [r, a] of Object.entries(e)) {
    if (r === "_id") continue;
    const o = t == null ? void 0 : t[r];
    if (Ni(a) && Ni(o)) {
      const s = Ud(o, { _id: e._id, ...a });
      if (!s) continue;
      const l = Object.keys(s).filter((u) => u !== "_id");
      if (l.length > 0) {
        n[r] = {};
        for (const u of l)
          n[r][u] = s[u];
      }
      continue;
    }
    ol(o, a) || (n[r] = a);
  }
  return Object.keys(n).filter((r) => r !== "_id").length > 0 ? n : null;
}
c(Ud, "buildChangedPayload");
function Vd(t, e) {
  var s;
  const n = ((s = t == null ? void 0 : t.flags) == null ? void 0 : s[ie]) ?? {}, i = (n == null ? void 0 : n.presets) ?? null, r = e === "AmbientLight" ? (n == null ? void 0 : n.lightCriteria) ?? null : null, a = Ga.get(t);
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
    const l = Gh(n.lightCriteria);
    (l.base && Object.keys(l.base).length > 0 || l.rules.length > 0) && (o = {
      base: l.base,
      rules: l.rules
    });
  }
  return Ga.set(t, {
    type: e,
    rawPresets: i,
    rawLightCriteria: r,
    presets: o
  }), o;
}
c(Vd, "getPresetsForDocument");
function tg(t = null, e = null) {
  t ? za.delete(t) : za = /* @__PURE__ */ new WeakMap(), e ? Ga.delete(e) : t || (Ga = /* @__PURE__ */ new WeakMap());
}
c(tg, "invalidatePlaceableCriteriaCaches");
async function Gd(t, e, n = {}) {
  var l, u;
  const i = ms(), r = {
    total: 0,
    scanned: 0,
    updated: 0,
    chunks: 0,
    byType: {},
    durationMs: 0
  };
  if (e = e ?? ((l = game.scenes) == null ? void 0 : l.viewed), !e)
    return r.durationMs = ms() - i, r;
  const a = new Set(Bh()), o = new Map(
    Va.map((d) => [d, e.getEmbeddedCollection(d) ?? []])
  ), s = Zh(e, o);
  for (const d of Va) {
    const h = o.get(d) ?? [], f = {
      total: Wh(h),
      scanned: 0,
      updated: 0,
      chunks: 0
    }, g = s.byType.get(d) ?? null, p = eg(h, g, n.changedKeys);
    if (f.scanned = p.length, r.total += f.total, r.scanned += f.scanned, r.byType[d] = f, !p.length) continue;
    const y = [];
    for (const w of p) {
      const v = Vd(w, d);
      if (!(v != null && v.base)) continue;
      const b = $d(v.base, v.rules ?? [], t);
      b._id = w._id, d === "AmbientLight" && a.has(w._id) && (b.hidden = !0);
      const E = (w == null ? void 0 : w._source) ?? ((u = w == null ? void 0 : w.toObject) == null ? void 0 : u.call(w)) ?? {}, L = Ud(E, b);
      L && y.push(L);
    }
    y.length > 0 && (f.chunks = await Jh(e, d, y, n.chunkSize), f.updated = y.length, r.updated += y.length, r.chunks += f.chunks, console.log(`${ie} | Updated ${y.length} ${d}(s)`));
  }
  return r.durationMs = ms() - i, r;
}
c(Gd, "updatePlaceables");
function Wa() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
c(Wa, "nowMs");
const sa = /* @__PURE__ */ new Map();
function ng(t) {
  var e;
  return t = t ?? ((e = game.scenes) == null ? void 0 : e.viewed), t ? Jr(t) : null;
}
c(ng, "getState");
async function ig(t, e, n = 0) {
  var g;
  const i = Wa();
  if (e = e ?? ((g = game.scenes) == null ? void 0 : g.viewed), !e) return null;
  Ch(e);
  const r = mt(e);
  if (!r.length)
    return console.warn(`${ie} | applyState skipped: scene has no criteria.`), null;
  const a = Jr(e, r), o = rc({ ...a, ...t ?? {} }, r), s = r.filter((p) => (a == null ? void 0 : a[p.key]) !== (o == null ? void 0 : o[p.key])).map((p) => p.key), l = s.length > 0;
  l && await sh(e, o, r);
  const u = l ? o : a, [d, h] = await Promise.all([
    Pd(u, e, { changedKeys: s }),
    Gd(u, e, { changedKeys: s })
  ]), f = Wa() - i;
  return N("Criteria apply telemetry", {
    sceneId: e.id,
    changedKeys: s,
    didChange: l,
    queuedMs: n,
    durationMs: f,
    tiles: d,
    placeables: h
  }), Hooks.callAll("eidolon-utilities.criteriaStateApplied", e, u), u;
}
c(ig, "applyStateInternal");
async function zd(t, e) {
  var l;
  if (e = e ?? ((l = game.scenes) == null ? void 0 : l.viewed), !e) return null;
  const n = e.id ?? "__viewed__", i = Wa(), r = sa.get(n) ?? Promise.resolve();
  let a = null;
  const o = r.catch(() => null).then(async () => {
    const u = Wa() - i;
    return ig(t, e, u);
  });
  a = o;
  const s = o.finally(() => {
    sa.get(n) === s && sa.delete(n);
  });
  return sa.set(n, s), a;
}
c(zd, "applyState$1");
function rg(t) {
  var e;
  return t = t ?? ((e = game.scenes) == null ? void 0 : e.viewed), t ? Nd(t) : null;
}
c(rg, "getVersion");
async function Wd(t, e) {
  var n;
  e = e ?? ((n = game.scenes) == null ? void 0 : n.viewed), e != null && e.setFlag && await e.setFlag(ie, kd, Number(t));
}
c(Wd, "setVersion");
async function ag(t) {
  return Wd(Md, t);
}
c(ag, "markCurrentVersion");
const lr = "Standard", og = /* @__PURE__ */ c((...t) => console.log(`${ie} | criteria indexer:`, ...t), "log");
function lc(t) {
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
c(lc, "parseFileTags");
function sg(t, e, n = lr) {
  return t != null && t.length ? t.map((i) => {
    const r = lc(i == null ? void 0 : i.name);
    if (!r) return {};
    const a = {};
    for (const [o, s] of Object.entries(e)) {
      const l = r[Number(o)];
      l != null && l !== n && (a[s] = l);
    }
    return a;
  }) : [];
}
c(sg, "buildFileIndex");
function lg(t, e) {
  return t.map((n, i) => {
    const r = [...e[n] ?? /* @__PURE__ */ new Set()].sort(), o = r.includes(lr) ? lr : r[0] ?? lr, s = ic(n);
    return s.key = n, s.label = n.charAt(0).toUpperCase() + n.slice(1), s.values = r.length ? r : [lr], s.default = s.values.includes(o) ? o : s.values[0], s.order = i, s;
  });
}
c(lg, "buildCriteriaDefinitions");
async function la(t, e, n, { dryRun: i = !1 } = {}) {
  const r = t.getFlag("monks-active-tiles", "files");
  if (!(r != null && r.length)) return null;
  const a = sg(r, e), o = Dd(a, { files: r });
  for (const s of r) {
    const l = lc(s == null ? void 0 : s.name);
    if (l)
      for (const [u, d] of Object.entries(e)) {
        const h = l[Number(u)];
        h != null && n[d] && n[d].add(h);
      }
  }
  return i || (await t.setFlag(ie, hi, o), typeof t.unsetFlag == "function" && await t.unsetFlag(ie, mi)), { files: r.length };
}
c(la, "indexTile");
async function cg(t, e = {}) {
  var b, E, L, A;
  const {
    dryRun: n = !1,
    force: i = !1
  } = e;
  if (t = t ?? ((b = game.scenes) == null ? void 0 : b.viewed), !t) throw new Error("No scene provided to indexScene.");
  if (!globalThis.Tagger) throw new Error("Tagger is required to index scene criteria.");
  if (!i && Nd(t) >= Md)
    throw new Error(
      `Scene "${t.name}" is already criteria-indexed. Use force: true to re-index.`
    );
  const r = { sceneId: t.id }, a = Tagger.getByTag("Map", r) ?? [];
  if (!a.length) throw new Error("No Map tile found.");
  if (a.length > 1) throw new Error(`Expected 1 Map tile, found ${a.length}.`);
  const o = a[0], s = o.getFlag("monks-active-tiles", "files");
  if (!(s != null && s.length)) throw new Error("Map tile has no MATT files.");
  const l = lc((E = s[0]) == null ? void 0 : E.name);
  if (!(l != null && l.length))
    throw new Error(`Cannot parse bracket tags from: ${((L = s[0]) == null ? void 0 : L.name) ?? "<unknown>"}`);
  if (l.length < 3)
    throw new Error(`Expected 3+ bracket tags, found ${l.length}.`);
  const u = Tagger.getByTag("Floor", r) ?? [], d = Tagger.getByTag("Roof", r) ?? [], h = Tagger.getByTag("Weather", r) ?? [];
  let f;
  const g = [];
  l.length >= 4 ? (f = { 0: "mood", 1: "stage", 2: "variant", 3: "effect" }, g.push("mood", "stage", "variant", "effect")) : (f = { 0: "mood", 1: "variant", 2: "effect" }, g.push("mood", "variant", "effect"));
  const p = { 1: "effect" }, y = {};
  for (const O of g)
    y[O] = /* @__PURE__ */ new Set();
  const w = {
    map: null,
    floor: [],
    roof: [],
    weather: []
  };
  w.map = await la(o, f, y, { dryRun: n });
  for (const O of u) {
    const M = await la(O, f, y, { dryRun: n });
    M && w.floor.push(M);
  }
  for (const O of d) {
    const M = await la(O, f, y, { dryRun: n });
    M && w.roof.push(M);
  }
  for (const O of h) {
    const M = await la(O, p, y, { dryRun: n });
    M && w.weather.push(M);
  }
  const v = lg(g, y);
  return n || (await jo(t, v), await ag(t)), og(
    n ? "Dry run complete" : "Indexing complete",
    `- ${v.length} criteria,`,
    `${((A = w.map) == null ? void 0 : A.files) ?? 0} map files`
  ), {
    criteria: v,
    state: v.reduce((O, M) => (O[M.key] = M.default, O), {}),
    tiles: w,
    overlayMode: h.length > 0
  };
}
c(cg, "indexScene");
var Hu, He, ct, ut, si, Xe, Ht, Sn, xo, le, Yd, Kd, Jd, ll, Xd, cl, Qd, cr, ul;
const bt = class bt extends Un(Bn) {
  constructor(n = {}) {
    var i;
    super(n);
    k(this, le);
    k(this, He, null);
    k(this, ct, []);
    k(this, ut, {});
    k(this, si, !1);
    k(this, Xe, null);
    k(this, Ht, null);
    k(this, Sn, null);
    k(this, xo, 120);
    this.setScene(n.scene ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null);
  }
  setScene(n) {
    var i;
    I(this, He, n ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null), C(this, le, Yd).call(this);
  }
  get scene() {
    return m(this, He);
  }
  async _prepareContext() {
    var r;
    const n = !!m(this, He), i = n && m(this, ct).length > 0;
    return {
      hasScene: n,
      hasCriteria: i,
      sceneName: ((r = m(this, He)) == null ? void 0 : r.name) ?? S("EIDOLON.CriteriaSwitcher.NoScene", "No active scene"),
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
      criteria: m(this, ct).map((a) => ({
        key: a.key,
        label: a.label || a.key,
        values: a.values.map((o) => {
          var s;
          return {
            value: o,
            selected: ((s = m(this, ut)) == null ? void 0 : s[a.key]) === o
          };
        }),
        defaultValue: a.default
      })),
      stateSummary: C(this, le, ul).call(this)
    };
  }
  _onRender(n, i) {
    super._onRender(n, i), C(this, le, Kd).call(this), C(this, le, Jd).call(this);
  }
  async _onClose(n) {
    return m(this, Xe) !== null && (clearTimeout(m(this, Xe)), I(this, Xe, null)), m(this, Sn) !== null && (Hooks.off("eidolon-utilities.criteriaStateApplied", m(this, Sn)), I(this, Sn, null)), super._onClose(n);
  }
};
He = new WeakMap(), ct = new WeakMap(), ut = new WeakMap(), si = new WeakMap(), Xe = new WeakMap(), Ht = new WeakMap(), Sn = new WeakMap(), xo = new WeakMap(), le = new WeakSet(), Yd = /* @__PURE__ */ c(function() {
  if (!m(this, He)) {
    I(this, ct, []), I(this, ut, {});
    return;
  }
  I(this, ct, mt(m(this, He)).sort((n, i) => n.order - i.order)), I(this, ut, Jr(m(this, He), m(this, ct)));
}, "#hydrateFromScene"), Kd = /* @__PURE__ */ c(function() {
  var i, r;
  const n = this.element;
  n instanceof HTMLElement && (n.querySelectorAll("[data-criteria-key]").forEach((a) => {
    a.addEventListener("change", (o) => {
      const s = o.currentTarget;
      if (!(s instanceof HTMLSelectElement)) return;
      const l = s.dataset.criteriaKey;
      l && (I(this, ut, {
        ...m(this, ut),
        [l]: s.value
      }), C(this, le, Xd).call(this, { [l]: s.value }));
    });
  }), (i = n.querySelector("[data-action='reset-defaults']")) == null || i.addEventListener("click", () => {
    C(this, le, Qd).call(this);
  }), (r = n.querySelector("[data-action='close-switcher']")) == null || r.addEventListener("click", () => {
    this.close();
  }));
}, "#bindEvents"), Jd = /* @__PURE__ */ c(function() {
  m(this, Sn) === null && I(this, Sn, Hooks.on("eidolon-utilities.criteriaStateApplied", (n, i) => {
    !m(this, He) || (n == null ? void 0 : n.id) !== m(this, He).id || m(this, si) || (I(this, ut, { ...i ?? {} }), this.render({ force: !0 }));
  }));
}, "#ensureSyncHook"), ll = /* @__PURE__ */ c(async function(n) {
  var i, r;
  if (m(this, He)) {
    C(this, le, cr).call(this, "applying"), I(this, si, !0);
    try {
      const a = await zd(n, m(this, He));
      a && I(this, ut, a), C(this, le, cr).call(this, "ready"), this.render({ force: !0 });
    } catch (a) {
      console.error(`${ie} | Failed to apply criteria state`, a), (r = (i = ui.notifications) == null ? void 0 : i.error) == null || r.call(
        i,
        S(
          "EIDOLON.CriteriaSwitcher.ApplyError",
          "Failed to apply the selected criteria state."
        )
      ), C(this, le, cr).call(this, "error", (a == null ? void 0 : a.message) ?? "Unknown error");
    } finally {
      I(this, si, !1), m(this, Ht) && C(this, le, cl).call(this);
    }
  }
}, "#applyPartialState"), Xd = /* @__PURE__ */ c(function(n) {
  I(this, Ht, {
    ...m(this, Ht) ?? {},
    ...n ?? {}
  }), m(this, Xe) !== null && clearTimeout(m(this, Xe)), C(this, le, cr).call(this, "applying"), I(this, Xe, setTimeout(() => {
    I(this, Xe, null), C(this, le, cl).call(this);
  }, m(this, xo)));
}, "#queuePartialState"), cl = /* @__PURE__ */ c(async function() {
  if (m(this, si) || !m(this, Ht)) return;
  const n = m(this, Ht);
  I(this, Ht, null), await C(this, le, ll).call(this, n);
}, "#flushPendingState"), Qd = /* @__PURE__ */ c(async function() {
  if (!m(this, ct).length) return;
  const n = m(this, ct).reduce((i, r) => (i[r.key] = r.default, i), {});
  I(this, ut, n), m(this, Xe) !== null && (clearTimeout(m(this, Xe)), I(this, Xe, null)), I(this, Ht, null), await C(this, le, ll).call(this, n);
}, "#resetToDefaults"), cr = /* @__PURE__ */ c(function(n, i = "") {
  const r = this.element;
  if (!(r instanceof HTMLElement)) return;
  const a = r.querySelector("[data-role='status']");
  if (a instanceof HTMLElement)
    switch (a.dataset.mode = n, n) {
      case "applying":
        a.textContent = S("EIDOLON.CriteriaSwitcher.Applying", "Applying changes...");
        break;
      case "error":
        a.textContent = `${S("EIDOLON.CriteriaSwitcher.Error", "Error")}: ${i}`;
        break;
      case "ready":
      default:
        a.textContent = `${S("EIDOLON.CriteriaSwitcher.Ready", "Ready")}: ${C(this, le, ul).call(this)}`;
        break;
    }
}, "#setStatus"), ul = /* @__PURE__ */ c(function() {
  return m(this, ct).length ? `[${m(this, ct).map((n) => {
    var i;
    return ((i = m(this, ut)) == null ? void 0 : i[n.key]) ?? n.default;
  }).join(" | ")}]` : "-";
}, "#formatStateSummary"), c(bt, "CriteriaSwitcherApplication"), ge(bt, "APP_ID", `${ie}-criteria-switcher`), ge(bt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Pe(bt, bt, "DEFAULT_OPTIONS"),
  {
    id: bt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Hu = Pe(bt, bt, "DEFAULT_OPTIONS")) == null ? void 0 : Hu.classes) ?? [], "eidolon-criteria-switcher-window", "themed"])
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
)), ge(bt, "PARTS", {
  content: {
    template: `modules/${ie}/templates/criteria-switcher.html`
  }
});
let sl = bt;
const ug = Ho(sl);
let pi = null;
function dg(t) {
  var e;
  return t ?? ((e = game.scenes) == null ? void 0 : e.viewed) ?? null;
}
c(dg, "resolveScene");
function fg(t) {
  var e;
  return !!(t != null && t.rendered && ((e = t == null ? void 0 : t.element) != null && e.isConnected));
}
c(fg, "isRendered");
function Go() {
  return fg(pi) ? pi : (pi = null, null);
}
c(Go, "getCriteriaSwitcher");
function Zd(t) {
  var i, r, a, o, s;
  const e = dg(t);
  if (!e)
    return (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "No active scene to open the criteria switcher."), null;
  if (!Bo(e))
    return (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, "You do not have permission to manage scene criteria."), null;
  const n = Go();
  return n ? (n.setScene(e), n.render({ force: !0 }), (s = n.bringToFront) == null || s.call(n), n) : (pi = ug({ scene: e }), pi.render({ force: !0 }), pi);
}
c(Zd, "openCriteriaSwitcher");
function ef() {
  const t = Go();
  t && (t.close(), pi = null);
}
c(ef, "closeCriteriaSwitcher");
function cc(t) {
  return Go() ? (ef(), null) : Zd(t);
}
c(cc, "toggleCriteriaSwitcher");
const mg = {
  SCHEMA_VERSION: ac,
  applyState: zd,
  getState: ng,
  getVersion: rg,
  setVersion: Wd,
  getCriteria(t) {
    var e;
    return mt(t ?? ((e = game.scenes) == null ? void 0 : e.viewed));
  },
  setCriteria(t, e) {
    var n;
    return jo(e ?? ((n = game.scenes) == null ? void 0 : n.viewed), t);
  },
  updateTiles: Pd,
  updatePlaceables: Gd,
  indexScene: cg,
  openCriteriaSwitcher: Zd,
  closeCriteriaSwitcher: ef,
  toggleCriteriaSwitcher: cc,
  findBestMatch: bh,
  findFileIndex: vh,
  resolveRules: $d
};
function hg(t) {
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
c(hg, "findTabNav");
function gg(t, e) {
  var i, r, a;
  return t instanceof HTMLElement ? [
    (i = t.querySelector(".tab[data-tab]")) == null ? void 0 : i.parentElement,
    t.querySelector(".sheet-body"),
    (a = (r = e == null ? void 0 : e.parentElement) == null ? void 0 : r.querySelector) == null ? void 0 : a.call(r, ":scope > .sheet-body"),
    e == null ? void 0 : e.parentElement
  ].find((o) => o instanceof HTMLElement) ?? null : null;
}
c(gg, "findTabBody");
function pg(t, e) {
  var n, i, r, a, o, s, l;
  return ((n = t == null ? void 0 : t.dataset) == null ? void 0 : n.group) ?? ((a = (r = (i = t == null ? void 0 : t.querySelector) == null ? void 0 : i.call(t, "[data-group]")) == null ? void 0 : r.dataset) == null ? void 0 : a.group) ?? ((l = (s = (o = e == null ? void 0 : e.querySelector) == null ? void 0 : o.call(e, ".tab[data-group]")) == null ? void 0 : s.dataset) == null ? void 0 : l.group) ?? "main";
}
c(pg, "getTabGroup");
function yg(t, e, n) {
  if (!(t instanceof HTMLElement)) return;
  t.textContent = "";
  const i = document.createElement("i");
  i.className = n, i.setAttribute("inert", ""), t.append(i, " ");
  const r = document.createElement("span");
  r.textContent = e, t.append(r);
}
c(yg, "setTabButtonContent");
function bg(t, e, n) {
  const i = t.querySelector("[data-tab]"), r = (i == null ? void 0 : i.tagName) || "A", a = document.createElement(r);
  return i instanceof HTMLElement && (a.className = i.className), a.classList.remove("active"), r === "BUTTON" && (a.type = "button"), a.dataset.action = "tab", a.dataset.tab = n, a.dataset.group = e, a.setAttribute("aria-selected", "false"), a.setAttribute("aria-pressed", "false"), a;
}
c(bg, "createTabButton");
function vg(t, e, n) {
  const i = document.createElement("div");
  i.classList.add("tab"), i.dataset.tab = n, i.dataset.group = e, i.dataset.applicationPart = n, i.setAttribute("hidden", "true");
  const r = wd(t);
  return t.insertBefore(i, r ?? null), i;
}
c(vg, "createTabPanel");
function hs(t, e, n, i, r) {
  var s;
  if (!(i instanceof HTMLElement) || !(r instanceof HTMLElement)) return;
  const a = (s = t == null ? void 0 : t.tabGroups) == null ? void 0 : s[e];
  if (typeof a == "string" ? a === n : i.classList.contains("active") || r.classList.contains("active")) {
    i.classList.add("active"), i.setAttribute("aria-selected", "true"), i.setAttribute("aria-pressed", "true"), r.classList.add("active"), r.removeAttribute("hidden"), r.removeAttribute("aria-hidden");
    return;
  }
  i.classList.remove("active"), i.setAttribute("aria-selected", "false"), i.setAttribute("aria-pressed", "false"), r.classList.remove("active"), r.setAttribute("hidden", "true");
}
c(hs, "syncTabVisibility");
function uc(t, e, n, i, r) {
  const a = hg(e), o = gg(e, a);
  if (!(a instanceof HTMLElement) || !(o instanceof HTMLElement)) return null;
  const s = pg(a, o);
  let l = a.querySelector(`[data-tab="${n}"]`);
  l instanceof HTMLElement || (l = bg(a, s, n), a.appendChild(l)), yg(l, i, r);
  let u = o.querySelector(`.tab[data-tab="${n}"]`);
  u instanceof HTMLElement || (u = vg(o, s, n));
  const d = `data-eidolon-bound-${n}`;
  return l.hasAttribute(d) || (l.addEventListener("click", () => {
    bd(t, n, s), requestAnimationFrame(() => {
      hs(t, s, n, l, u);
    });
  }), l.setAttribute(d, "true")), hs(t, s, n, l, u), requestAnimationFrame(() => {
    hs(t, s, n, l, u);
  }), wg(t, a), u;
}
c(uc, "ensureTileConfigTab");
function wg(t, e) {
  !(t != null && t.setPosition) || !(e instanceof HTMLElement) || requestAnimationFrame(() => {
    var a;
    if (e.scrollWidth <= e.clientWidth) return;
    const n = e.scrollWidth - e.clientWidth, i = t.element instanceof HTMLElement ? t.element : (a = t.element) == null ? void 0 : a[0];
    if (!i) return;
    const r = i.offsetWidth || 480;
    t.setPosition({ width: r + n + 16 });
  });
}
c(wg, "fitNavWidth");
function tf(t) {
  var e;
  return ((e = t == null ? void 0 : t.getFlag) == null ? void 0 : e.call(t, "monks-active-tiles", "files")) ?? [];
}
c(tf, "getTileFiles$1");
function Eg(t = []) {
  return {
    strategy: "select-one",
    defaultTarget: Rn(t, 0) ?? { indexHint: 0 },
    variants: [
      {
        criteria: {},
        target: Rn(t, 0) ?? { indexHint: 0 }
      }
    ]
  };
}
c(Eg, "createDefaultTileCriteria");
function Sg(t, e = {}) {
  var o, s;
  const { allowLegacy: n = !0 } = e, i = tf(t), r = (o = t == null ? void 0 : t.getFlag) == null ? void 0 : o.call(t, ie, hi);
  if (r) return vi(r, { files: i });
  if (!n) return null;
  const a = (s = t == null ? void 0 : t.getFlag) == null ? void 0 : s.call(t, ie, mi);
  return a ? vi(a, { files: i }) : null;
}
c(Sg, "getTileCriteria");
async function Zc(t, e, n = {}) {
  if (!(t != null && t.setFlag)) return null;
  const {
    strictValidation: i = !0
  } = n, r = tf(t), a = vi(e, { files: r });
  if (!a)
    return typeof t.unsetFlag == "function" ? (await t.unsetFlag(ie, hi), await t.unsetFlag(ie, mi)) : (await t.setFlag(ie, hi, null), await t.setFlag(ie, mi, null)), null;
  if (i) {
    const o = Fd(a, { files: r });
    if (o.errors.length > 0)
      throw new Error(
        `Tile criteria contains ${o.errors.length} conflicting rule pair(s). Resolve clashes before saving.`
      );
  }
  return await t.setFlag(ie, hi, a), typeof t.unsetFlag == "function" && await t.unsetFlag(ie, mi), a;
}
c(Zc, "setTileCriteria");
const dl = "__eidolon_any__", fl = "eidolon-tile-criteria", Cg = "fa-solid fa-sliders", nf = Symbol.for("eidolon.tileCriteriaUiState"), zo = ["all", "unmapped", "mapped", "conflicts"];
function Tg(t) {
  const e = t == null ? void 0 : t[nf];
  return !e || typeof e != "object" ? {
    filterQuery: "",
    filterMode: "all",
    selectedFileIndex: null
  } : {
    filterQuery: typeof e.filterQuery == "string" ? e.filterQuery : "",
    filterMode: zo.includes(e.filterMode) ? e.filterMode : "all",
    selectedFileIndex: Number.isInteger(e.selectedFileIndex) ? e.selectedFileIndex : null
  };
}
c(Tg, "readUiState");
function Lg(t, e) {
  if (!t || !e) return;
  typeof e.filterQuery == "string" && (t.filterQuery = e.filterQuery), zo.includes(e.filterMode) && (t.filterMode = e.filterMode), Number.isInteger(e.selectedFileIndex) && t.fileEntries.some((i) => i.index === e.selectedFileIndex) && (t.selectedFileIndex = e.selectedFileIndex);
}
c(Lg, "applyUiState");
function Ig(t) {
  const e = t == null ? void 0 : t.app, n = t == null ? void 0 : t.state;
  !e || !n || (e[nf] = {
    filterQuery: typeof n.filterQuery == "string" ? n.filterQuery : "",
    filterMode: zo.includes(n.filterMode) ? n.filterMode : "all",
    selectedFileIndex: Number.isInteger(n.selectedFileIndex) ? n.selectedFileIndex : null
  });
}
c(Ig, "persistUiState");
function Og(t) {
  const e = (t == null ? void 0 : t.object) ?? (t == null ? void 0 : t.document) ?? null;
  return !(e != null && e.isEmbedded) || e.documentName !== "Tile" ? null : e;
}
c(Og, "getTileDocument$2");
function Ag(t) {
  var e;
  return ((e = t == null ? void 0 : t.getFlag) == null ? void 0 : e.call(t, "monks-active-tiles", "files")) ?? [];
}
c(Ag, "getTileFiles");
function kg(t, e) {
  var s;
  const n = (t == null ? void 0 : t.parent) ?? ((s = game.scenes) == null ? void 0 : s.viewed) ?? null, r = mt(n).sort((l, u) => l.order - u.order).map((l) => ({
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
c(kg, "getCriteriaDefinitions");
function Mg(t) {
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
c(Mg, "buildTree");
function Ng(t, e) {
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
c(Ng, "collapseFolderBranch");
function _g(t, e) {
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
c(_g, "getRuleSummariesForFile");
function ml(t) {
  var g, p;
  const e = Ag(t), n = oc(e), i = Sg(t, { allowLegacy: !0 }) ?? Eg(e), r = kg(t, i), a = new Map(r.map((y) => [y.key, y.label])), o = new Map(
    n.map((y) => [
      y.index,
      y.path || y.label
    ])
  ), s = Cr(i.defaultTarget, e), l = ((g = n[0]) == null ? void 0 : g.index) ?? 0, u = s >= 0 ? s : l, d = new Map(n.map((y) => [y.index, []]));
  let h = 1;
  for (const y of i.variants ?? []) {
    const w = Cr(y.target, e);
    w < 0 || (d.has(w) || d.set(w, []), d.get(w).push({
      id: h,
      criteria: { ...y.criteria ?? {} }
    }), h += 1);
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
    nextRuleId: h,
    rulesByFile: d,
    status: {
      mode: "ready",
      message: S("EIDOLON.TileCriteria.Ready", "Ready")
    }
  };
}
c(ml, "buildEditorState");
function hl(t, e) {
  return t.rulesByFile.has(e) || t.rulesByFile.set(e, []), t.rulesByFile.get(e);
}
c(hl, "getRulesForFile");
function $g(t) {
  return Object.fromEntries(
    Object.entries(t ?? {}).filter(([e, n]) => typeof e == "string" && e && typeof n == "string" && n.trim()).map(([e, n]) => [e, n.trim()])
  );
}
c($g, "sanitizeRuleCriteria");
function rf(t) {
  const e = Rn(t.files, t.defaultIndex);
  if (!e) return null;
  const n = [], i = [];
  for (const [a, o] of t.rulesByFile.entries()) {
    const s = Rn(t.files, a);
    if (s)
      for (const [l, u] of o.entries()) {
        const d = $g(u.criteria);
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
    normalized: vi(
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
c(rf, "buildTileCriteriaDraft");
function xg(t) {
  var e;
  return ((e = rf(t)) == null ? void 0 : e.normalized) ?? null;
}
c(xg, "exportTileCriteria");
function eu(t) {
  const e = rf(t);
  if (!(e != null && e.normalized))
    return {
      errors: [],
      warnings: [],
      errorFileIndexes: [],
      warningFileIndexes: []
    };
  const n = Fd(e.normalized, { files: t.files }), i = /* @__PURE__ */ c((s) => {
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
c(eu, "analyzeRuleConflicts");
function ca(t, e = "neutral") {
  const n = document.createElement("span");
  return n.classList.add("eidolon-tile-criteria__badge"), n.dataset.kind = e, n.textContent = t, n;
}
c(ca, "createBadge");
function Fg(t, e = {}) {
  const n = typeof t == "string" ? t : "", {
    maxLength: i = 42,
    headLength: r = 20,
    tailLength: a = 16
  } = e;
  if (!n || n.length <= i) return n;
  const o = n.slice(0, r).trimEnd(), s = n.slice(-a).trimStart();
  return `${o}...${s}`;
}
c(Fg, "middleEllipsis");
function Dg(t) {
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
      error: (r == null ? void 0 : r.message) ?? S("EIDOLON.TileCriteria.InvalidRegex", "Invalid regex."),
      matches: /* @__PURE__ */ c(() => !0, "matches")
    };
  }
}
c(Dg, "createRegexFilter");
function Pg(t, e) {
  const n = document.createElement("select");
  n.dataset.criteriaKey = t.key;
  const i = document.createElement("option");
  i.value = dl, i.textContent = "*", n.appendChild(i);
  const r = new Set(t.values ?? []);
  e && !r.has(e) && r.add(e);
  for (const a of r) {
    const o = document.createElement("option");
    o.value = a, o.textContent = a, n.appendChild(o);
  }
  return n.value = e ?? dl, n;
}
c(Pg, "createCriterionSelect");
function Rg(t, e, n, i) {
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
    const h = Pg(l, (s = t.criteria) == null ? void 0 : s[l.key]);
    h.addEventListener("change", () => {
      h.value === dl ? delete t.criteria[l.key] : t.criteria[l.key] = h.value, i();
    }), u.appendChild(h), a.appendChild(u);
  }
  r.appendChild(a);
  const o = document.createElement("button");
  return o.type = "button", o.classList.add("control", "ui-control", "eidolon-tile-criteria__rule-remove"), o.textContent = S("EIDOLON.TileCriteria.RemoveRule", "Remove"), o.addEventListener("click", () => {
    const u = hl(e, n).filter((d) => d.id !== t.id);
    e.rulesByFile.set(n, u), i();
  }), r.appendChild(o), r;
}
c(Rg, "renderRuleEditor");
const Ca = /* @__PURE__ */ new WeakMap();
function af(t) {
  return (t == null ? void 0 : t.app) ?? (t == null ? void 0 : t.tile) ?? null;
}
c(af, "getDialogOwner");
function Hg(t) {
  for (const e of t) {
    const n = _t(e);
    if (n) return n;
    const i = _t(e == null ? void 0 : e.element);
    if (i) return i;
  }
  return null;
}
c(Hg, "findDialogRoot$1");
function qg(t, e, n) {
  const i = t.state, r = i.fileEntries.find((y) => y.index === e);
  if (!r) return document.createElement("div");
  const a = document.createElement("section");
  a.classList.add("eidolon-tile-criteria__dialog-content");
  const o = document.createElement("header");
  o.classList.add("eidolon-tile-criteria__editor-header");
  const s = document.createElement("h4");
  s.textContent = i.relativePaths.get(r.index) || r.label, o.appendChild(s);
  const l = document.createElement("p");
  l.classList.add("notes"), l.textContent = `#${r.index + 1} · ${r.path || S("EIDOLON.TileCriteria.UnknownPath", "Unknown path")}`, o.appendChild(l), a.appendChild(o);
  const u = document.createElement("div");
  u.classList.add("eidolon-tile-criteria__editor-controls");
  const d = document.createElement("button");
  d.type = "button", d.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action"), i.defaultIndex === r.index ? (d.textContent = S("EIDOLON.TileCriteria.IsDefault", "Default Target"), d.disabled = !0) : (d.textContent = S("EIDOLON.TileCriteria.SetDefault", "Set As Default"), d.addEventListener("click", () => {
    i.defaultIndex = r.index, ze(t), n();
  })), u.appendChild(d);
  const h = document.createElement("button");
  h.type = "button", h.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action", "secondary"), h.textContent = S("EIDOLON.TileCriteria.ClearFileRules", "Clear File Rules"), h.addEventListener("click", () => {
    i.rulesByFile.set(r.index, []), ze(t), n();
  }), u.appendChild(h), a.appendChild(u);
  const f = document.createElement("div");
  f.classList.add("eidolon-tile-criteria__rule-editors");
  const g = hl(i, r.index);
  if (g.length)
    for (const y of g)
      f.appendChild(
        Rg(y, i, r.index, () => {
          ze(t), n();
        })
      );
  else {
    const y = document.createElement("p");
    y.classList.add("notes"), y.textContent = S(
      "EIDOLON.TileCriteria.NoRulesForFile",
      "No rules map to this file yet. Add one to define when this variant should be active."
    ), f.appendChild(y);
  }
  a.appendChild(f);
  const p = document.createElement("button");
  return p.type = "button", p.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action"), p.textContent = S("EIDOLON.TileCriteria.AddRule", "Add Rule"), p.disabled = !i.criteriaDefinitions.length, p.addEventListener("click", () => {
    hl(i, r.index).push({
      id: i.nextRuleId,
      criteria: {}
    }), i.nextRuleId += 1, ze(t), n();
  }), a.appendChild(p), a;
}
c(qg, "buildRuleEditorContent");
function jg(t, e) {
  var h, f, g;
  const n = af(t);
  if (!n) return;
  const i = Ca.get(n);
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
  Ca.set(n, r);
  const a = /* @__PURE__ */ c(() => {
    Ca.delete(n);
  }, "closeDialog"), o = /* @__PURE__ */ c(() => {
    r.host instanceof HTMLElement && r.host.replaceChildren(
      qg(r.controller, r.fileIndex, o)
    );
  }, "refreshDialog");
  r.refresh = o;
  const s = S("EIDOLON.TileCriteria.EditorTitle", "Edit Tile Criteria Rules"), l = '<div class="eidolon-tile-criteria-editor-host"></div>', u = S("EIDOLON.TileCriteria.CloseEditor", "Close"), d = (g = (f = foundry == null ? void 0 : foundry.applications) == null ? void 0 : f.api) == null ? void 0 : g.DialogV2;
  if (typeof (d == null ? void 0 : d.wait) == "function") {
    d.wait({
      window: { title: s },
      content: l,
      buttons: [{ action: "close", label: u, default: !0 }],
      render: /* @__PURE__ */ c((...p) => {
        var v;
        const y = Hg(p), w = (v = y == null ? void 0 : y.querySelector) == null ? void 0 : v.call(y, ".eidolon-tile-criteria-editor-host");
        w instanceof HTMLElement && (r.host = w, o());
      }, "render"),
      close: a,
      rejectClose: !1
    }).catch((p) => {
      console.warn(`${ie} | Rule editor dialog failed`, p), a();
    });
    return;
  }
  a();
}
c(jg, "openRuleEditorDialog");
function tu(t) {
  var i;
  const e = af(t);
  if (!e) return;
  const n = Ca.get(e);
  (i = n == null ? void 0 : n.refresh) == null || i.call(n);
}
c(tu, "refreshOpenRuleEditor");
function gl(t, e) {
  return (t.rulesByFile.get(e) ?? []).length > 0;
}
c(gl, "hasRulesForFile");
function of(t, e) {
  var n, i;
  return ((n = t == null ? void 0 : t.errorFileIndexes) == null ? void 0 : n.includes(e)) || ((i = t == null ? void 0 : t.warningFileIndexes) == null ? void 0 : i.includes(e));
}
c(of, "hasConflictForFile");
function Bg(t, e, n) {
  switch (t.filterMode) {
    case "unmapped":
      return !gl(t, e.index);
    case "mapped":
      return gl(t, e.index);
    case "conflicts":
      return of(n, e.index);
    case "all":
    default:
      return !0;
  }
}
c(Bg, "matchesFilterMode");
function Ug(t, e) {
  let n = 0, i = 0, r = 0;
  for (const a of t.fileEntries)
    gl(t, a.index) ? n += 1 : i += 1, of(e, a.index) && (r += 1);
  return {
    all: t.fileEntries.length,
    mapped: n,
    unmapped: i,
    conflicts: r
  };
}
c(Ug, "getFilterModeCounts");
function Vg(t) {
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
c(Vg, "getFilterModeLabel");
function sf(t, e, n, i, r) {
  var u, d;
  const a = [...t.folders.keys()].sort((h, f) => h.localeCompare(f));
  for (const h of a) {
    const f = Ng(h, t.folders.get(h)), g = document.createElement("li");
    g.classList.add("eidolon-tile-criteria__tree-branch");
    const p = document.createElement("div");
    p.classList.add("document", "folder", "update", "eidolon-tile-criteria__folder-row");
    const y = document.createElement("i");
    y.classList.add("fa-solid", "fa-folder-open"), p.appendChild(y);
    const w = document.createElement("span");
    w.classList.add("eidolon-tile-criteria__tree-folder-label"), w.textContent = f.label, w.title = f.label, p.appendChild(w), g.appendChild(p);
    const v = document.createElement("ul");
    v.classList.add("eidolon-tile-criteria__tree"), v.dataset.folder = f.label, sf(f.node, e, n, i, v), v.childElementCount > 0 && g.appendChild(v), r.appendChild(g);
  }
  const o = [...t.files].sort((h, f) => h.name.localeCompare(f.name));
  if (!o.length) return;
  const s = document.createElement("li"), l = document.createElement("ul");
  l.classList.add("document-list", "eidolon-tile-criteria__document-list");
  for (const h of o) {
    const f = h.entry, g = f.index === e.selectedFileIndex, p = f.index === e.defaultIndex, y = _g(e, f.index), w = document.createElement("li");
    w.classList.add("document", "update", "eidolon-tile-criteria__tree-file");
    const v = document.createElement("button");
    v.type = "button", v.classList.add("eidolon-tile-criteria__file-row");
    const b = (u = i == null ? void 0 : i.errorFileIndexes) == null ? void 0 : u.includes(f.index), E = (d = i == null ? void 0 : i.warningFileIndexes) == null ? void 0 : d.includes(f.index);
    b ? v.classList.add("has-conflict") : E && v.classList.add("has-warning");
    const L = e.relativePaths.get(f.index) || f.path || h.name, A = [L];
    b ? A.push(
      S(
        "EIDOLON.TileCriteria.ConflictFileHint",
        "This file participates in one or more conflicting rules."
      )
    ) : E && A.push(
      S(
        "EIDOLON.TileCriteria.WarningFileHint",
        "This file has potentially redundant rules."
      )
    ), y.length || A.push(
      S(
        "EIDOLON.TileCriteria.UnmappedHint",
        "No criteria rules map to this file."
      )
    ), v.title = A.join(`
`), g && v.classList.add("is-selected"), v.addEventListener("click", () => {
      e.selectedFileIndex = f.index, ze(n), jg(n, f.index);
    });
    const O = document.createElement("span");
    O.classList.add("eidolon-tile-criteria__indicator"), O.dataset.kind = p ? "default" : y.length ? "mapped" : "unmapped", v.appendChild(O);
    const M = document.createElement("span");
    M.classList.add("eidolon-tile-criteria__file-content");
    const x = document.createElement("span");
    x.classList.add("eidolon-tile-criteria__file-heading");
    const R = document.createElement("span");
    R.classList.add("eidolon-tile-criteria__file-title"), R.textContent = Fg(h.name || f.label), R.title = L, x.appendChild(R);
    const D = ca(`#${f.index + 1}`, "meta");
    D.classList.add("eidolon-tile-criteria__index-badge"), x.appendChild(D), M.appendChild(x);
    const F = document.createElement("span");
    F.classList.add("eidolon-tile-criteria__badges"), p && F.appendChild(ca(S("EIDOLON.TileCriteria.DefaultBadge", "Default"), "default"));
    const _ = y.slice(0, 2);
    for (const H of _)
      F.appendChild(ca(H, "rule"));
    if (y.length > _.length && F.appendChild(ca(`+${y.length - _.length}`, "meta")), M.appendChild(F), v.appendChild(M), b || E) {
      const H = document.createElement("span");
      H.classList.add("eidolon-tile-criteria__row-warning"), H.dataset.mode = b ? "error" : "warning", H.innerHTML = '<i class="fa-solid fa-triangle-exclamation" inert=""></i>', v.appendChild(H);
    }
    w.appendChild(v), l.appendChild(w);
  }
  s.appendChild(l), r.appendChild(s);
}
c(sf, "renderTreeNode");
function Gg(t, e, n, i = {}) {
  const r = document.createElement("section");
  r.classList.add("eidolon-tile-criteria__tree-panel");
  const a = Dg(t.filterQuery), o = Ug(t, n);
  t.filterMode !== "all" && o[t.filterMode] === 0 && (t.filterMode = "all");
  const s = document.createElement("div");
  s.classList.add("eidolon-tile-criteria__toolbar");
  const l = document.createElement("div");
  l.classList.add("eidolon-tile-criteria__mode-bar");
  for (const b of zo) {
    const E = document.createElement("button");
    E.type = "button", E.classList.add("control", "ui-control", "eidolon-tile-criteria__mode-button"), E.dataset.mode = b, E.textContent = Vg(b);
    const L = b === "all" || o[b] > 0;
    E.disabled = !L, L || (E.dataset.tooltip = S(
      "EIDOLON.TileCriteria.FilterModeUnavailable",
      "No entries currently match this filter."
    ), E.title = E.dataset.tooltip), t.filterMode === b ? (E.classList.add("is-active"), E.setAttribute("aria-pressed", "true")) : E.setAttribute("aria-pressed", "false"), E.addEventListener("click", () => {
      t.filterMode !== b && (t.filterMode = b, ze(e));
    }), l.appendChild(E);
  }
  s.appendChild(l);
  const u = document.createElement("div");
  u.classList.add("eidolon-tile-criteria__filter-row");
  const d = document.createElement("input");
  d.type = "text", d.classList.add("eidolon-tile-criteria__filter-input"), d.placeholder = S("EIDOLON.TileCriteria.FilterPlaceholder", "Regex filter (path)"), d.value = t.filterQuery, d.autocomplete = "off", d.addEventListener("keydown", (b) => {
    b.stopPropagation(), b.key === "Enter" && b.preventDefault();
  }), d.addEventListener("keyup", (b) => {
    b.stopPropagation();
  }), d.addEventListener("change", (b) => {
    b.stopPropagation();
  }), d.addEventListener("input", (b) => {
    b.stopPropagation();
    const E = d.selectionStart ?? d.value.length, L = d.selectionEnd ?? E;
    t.filterQuery = d.value, ze(e), requestAnimationFrame(() => {
      const A = e.section.querySelector(".eidolon-tile-criteria__filter-input");
      if (A instanceof HTMLInputElement) {
        A.focus();
        try {
          A.setSelectionRange(E, L);
        } catch {
        }
      }
    });
  }), u.appendChild(d);
  const h = document.createElement("div");
  h.classList.add("eidolon-tile-criteria__toolbar-actions");
  const f = document.createElement("button");
  f.type = "button";
  const g = S("EIDOLON.TileCriteria.Save", "Save Rules");
  f.classList.add("control", "ui-control", "eidolon-tile-criteria__toolbar-action", "icon-only"), f.dataset.tooltip = g, f.setAttribute("aria-label", g), f.title = g, f.innerHTML = '<i class="fa-solid fa-floppy-disk" inert=""></i>', f.disabled = n.errors.length > 0, f.addEventListener("click", () => {
    var b;
    (b = i.onSave) == null || b.call(i);
  }), h.appendChild(f);
  const p = document.createElement("button");
  p.type = "button";
  const y = S("EIDOLON.TileCriteria.Clear", "Clear Rules");
  if (p.classList.add("control", "ui-control", "secondary", "eidolon-tile-criteria__toolbar-action", "icon-only"), p.dataset.tooltip = y, p.setAttribute("aria-label", y), p.title = y, p.innerHTML = '<i class="fa-solid fa-trash" inert=""></i>', p.addEventListener("click", () => {
    var b;
    (b = i.onClear) == null || b.call(i);
  }), h.appendChild(p), u.appendChild(h), s.appendChild(u), r.appendChild(s), a.error) {
    const b = document.createElement("p");
    b.classList.add("notes", "eidolon-tile-criteria__filter-error"), b.textContent = `${S("EIDOLON.TileCriteria.InvalidRegex", "Invalid regex")}: ${a.error}`, r.appendChild(b);
  }
  const w = document.createElement("div");
  w.classList.add("eidolon-tile-criteria__library-tree");
  const v = t.fileEntries.filter((b) => {
    const E = t.relativePaths.get(b.index) || b.path || b.label;
    return Bg(t, b, n) && a.matches(E);
  });
  if (t.fileEntries.length)
    if (v.length) {
      const b = document.createElement("ul");
      b.classList.add("eidolon-tile-criteria__tree"), sf(Mg(v), t, e, n, b), w.appendChild(b);
    } else {
      const b = document.createElement("p");
      b.classList.add("notes"), b.textContent = S("EIDOLON.TileCriteria.NoMatches", "No variants match this filter."), w.appendChild(b);
    }
  else {
    const b = document.createElement("p");
    b.classList.add("notes"), b.textContent = S("EIDOLON.TileCriteria.NoVariants", "No MATT variants found"), w.appendChild(b);
  }
  return r.appendChild(w), r;
}
c(Gg, "renderTreePanel");
function ze(t) {
  const { section: e, state: n } = t, i = eu(n);
  Ig(t), e.replaceChildren();
  const r = /* @__PURE__ */ c(async () => {
    try {
      const o = eu(n);
      if (o.errors.length) {
        n.status = {
          mode: "error",
          message: S(
            "EIDOLON.TileCriteria.ConflictSaveBlocked",
            `Resolve ${o.errors.length} conflict(s) before saving tile criteria rules.`
          )
        }, ze(t);
        return;
      }
      const s = xg(n);
      if (!s) {
        n.status = {
          mode: "error",
          message: S("EIDOLON.TileCriteria.Invalid", "Invalid rules. Select valid target variants.")
        }, ze(t);
        return;
      }
      await Zc(t.tile, s);
      const l = n.filterQuery, u = n.filterMode, d = n.selectedFileIndex;
      t.state = ml(t.tile), t.state.filterQuery = l, t.state.filterMode = u, Number.isInteger(d) && (t.state.selectedFileIndex = d), t.state.status = {
        mode: "ready",
        message: S("EIDOLON.TileCriteria.Saved", "Tile criteria rules saved.")
      }, ze(t), tu(t);
    } catch (o) {
      console.error(`${ie} | Failed to save tile criteria`, o), n.status = {
        mode: "error",
        message: (o == null ? void 0 : o.message) ?? "Failed to save tile criteria rules."
      }, ze(t);
    }
  }, "handleSave"), a = /* @__PURE__ */ c(async () => {
    try {
      await Zc(t.tile, null);
      const o = n.filterQuery, s = n.filterMode, l = n.selectedFileIndex;
      t.state = ml(t.tile), t.state.filterQuery = o, t.state.filterMode = s, Number.isInteger(l) && (t.state.selectedFileIndex = l), t.state.status = {
        mode: "ready",
        message: S("EIDOLON.TileCriteria.Cleared", "Tile criteria rules cleared.")
      }, ze(t), tu(t);
    } catch (o) {
      console.error(`${ie} | Failed to clear tile criteria`, o), n.status = {
        mode: "error",
        message: (o == null ? void 0 : o.message) ?? "Failed to clear tile criteria rules."
      }, ze(t);
    }
  }, "handleClear");
  if (e.appendChild(Gg(n, t, i, {
    onSave: r,
    onClear: a
  })), i.errors.length || i.warnings.length) {
    const o = document.createElement("section");
    o.classList.add("eidolon-tile-criteria__conflicts");
    const s = document.createElement("p");
    s.classList.add("eidolon-tile-criteria__conflict-summary", "notes"), i.errors.length ? (s.dataset.mode = "error", s.textContent = S(
      "EIDOLON.TileCriteria.ConflictSummary",
      `${i.errors.length} conflict(s) must be resolved before saving${i.warnings.length ? ` (${i.warnings.length} warning(s))` : ""}.`
    )) : (s.dataset.mode = "warning", s.textContent = S(
      "EIDOLON.TileCriteria.WarningSummary",
      `${i.warnings.length} potential issue(s) detected.`
    )), o.appendChild(s);
    const l = document.createElement("p");
    l.classList.add("eidolon-tile-criteria__conflict-hint", "notes"), l.textContent = S(
      "EIDOLON.TileCriteria.ConflictHint",
      "Files involved in clashes are marked in red with a warning icon."
    ), o.appendChild(l), e.appendChild(o);
  }
  if (n.status.mode === "error" || n.status.mode === "warning") {
    const o = document.createElement("p");
    o.classList.add("eidolon-tile-criteria__status", "notes"), o.dataset.mode = n.status.mode, o.textContent = n.status.message, e.appendChild(o);
  }
}
c(ze, "renderController");
function zg(t, e = null) {
  const n = document.createElement("section");
  n.classList.add("eidolon-tile-criteria");
  const i = ml(t);
  Lg(i, Tg(e));
  const r = {
    app: e,
    tile: t,
    section: n,
    state: i
  };
  return ze(r), r;
}
c(zg, "createController");
function Wg(t, e) {
  return uc(
    t,
    e,
    fl,
    S("EIDOLON.TileCriteria.TabLabel", "Criteria"),
    Cg
  );
}
c(Wg, "ensureTileCriteriaTab");
function Yg() {
  Hooks.on("renderTileConfig", (t, e) => {
    var l, u, d, h;
    const n = _t(e);
    if (!n) return;
    const i = Og(t);
    if (!i) return;
    if ((l = n.querySelector(".eidolon-tile-criteria")) == null || l.remove(), !qo()) {
      (u = n.querySelector(`.item[data-tab='${fl}']`)) == null || u.remove(), (d = n.querySelector(`.tab[data-tab='${fl}']`)) == null || d.remove();
      return;
    }
    const r = zg(i, t), a = Wg(t, n);
    if (a instanceof HTMLElement) {
      a.replaceChildren(r.section), (h = t.setPosition) == null || h.call(t, { height: "auto" });
      return;
    }
    const o = (t == null ? void 0 : t.form) instanceof HTMLFormElement ? t.form : n instanceof HTMLFormElement ? n : n.querySelector("form");
    if (!(o instanceof HTMLFormElement)) return;
    const s = o.querySelector("button[type='submit']");
    s != null && s.parentElement ? s.parentElement.insertAdjacentElement("beforebegin", r.section) : o.appendChild(r.section);
  });
}
c(Yg, "registerTileCriteriaConfigControls");
function Kg(t) {
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
c(Kg, "toList");
function Jg(t, e) {
  const n = t == null ? void 0 : t.tools;
  return Array.isArray(n) ? n.some((i) => (i == null ? void 0 : i.name) === e) : n instanceof Map ? n.has(e) : n && typeof n == "object" ? e in n ? !0 : Object.values(n).some((i) => (i == null ? void 0 : i.name) === e) : !1;
}
c(Jg, "hasTool");
function Xg(t, e) {
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
c(Xg, "addTool");
function Qg() {
  Hooks.on("getSceneControlButtons", (t) => {
    var i;
    const e = Kg(t);
    if (!e.length) return;
    const n = e.find((r) => (r == null ? void 0 : r.name) === "tiles") ?? e.find((r) => (r == null ? void 0 : r.name) === "tokens" || (r == null ? void 0 : r.name) === "token") ?? e[0];
    n && (Jg(n, "eidolonCriteriaSwitcher") || Xg(n, {
      name: "eidolonCriteriaSwitcher",
      title: "Criteria Switcher",
      icon: "fa-solid fa-sliders",
      button: !0,
      toggle: !1,
      visible: Bo(((i = game.scenes) == null ? void 0 : i.viewed) ?? null),
      onClick: /* @__PURE__ */ c(() => cc(), "onClick")
    }));
  });
}
c(Qg, "registerSceneControlButton");
function ua(t, e) {
  if (!t || typeof t != "object") return !1;
  const n = String(e).split(".");
  let i = t;
  for (const r of n) {
    if (!i || typeof i != "object" || !Object.prototype.hasOwnProperty.call(i, r)) return !1;
    i = i[r];
  }
  return !0;
}
c(ua, "hasOwnPath");
function Zg() {
  const t = /* @__PURE__ */ c((i, r = null) => {
    i && jh(i, r);
  }, "invalidateTileScene"), e = /* @__PURE__ */ c((i, r = null) => {
    i && tg(i, r);
  }, "invalidatePlaceableScene");
  Hooks.on("createTile", (i) => {
    t((i == null ? void 0 : i.parent) ?? null, i ?? null);
  }), Hooks.on("deleteTile", (i) => {
    t((i == null ? void 0 : i.parent) ?? null, i ?? null);
  }), Hooks.on("updateTile", (i, r) => {
    (ua(r, `flags.${ie}.tileCriteria`) || ua(r, `flags.${ie}.fileIndex`)) && t((i == null ? void 0 : i.parent) ?? null, i ?? null);
  });
  const n = /* @__PURE__ */ c((i) => {
    Hooks.on(`create${i}`, (r) => {
      e((r == null ? void 0 : r.parent) ?? null, r ?? null);
    }), Hooks.on(`delete${i}`, (r) => {
      e((r == null ? void 0 : r.parent) ?? null, r ?? null);
    }), Hooks.on(`update${i}`, (r, a) => {
      const o = ua(a, `flags.${ie}.presets`), s = i === "AmbientLight" && ua(a, `flags.${ie}.lightCriteria`);
      !o && !s || e((r == null ? void 0 : r.parent) ?? null, r ?? null);
    });
  }, "registerPlaceableHooks");
  n("AmbientLight"), n("Wall"), n("AmbientSound"), Hooks.on("canvasReady", (i) => {
    const r = (i == null ? void 0 : i.scene) ?? null;
    r && (t(r), e(r));
  });
}
c(Zg, "registerCriteriaCacheInvalidationHooks");
function ep() {
  Qg(), Yg(), Zg(), Hooks.once("init", () => {
    var t, e;
    (e = (t = game.keybindings) == null ? void 0 : t.register) == null || e.call(t, ie, "toggleCriteriaSwitcher", {
      name: "Toggle Criteria Switcher",
      hint: "Open or close the criteria switcher window for live scene state updates.",
      editable: [{ key: "KeyM", modifiers: ["Alt"] }],
      onDown: /* @__PURE__ */ c(() => {
        var n, i, r;
        return Bo(((n = game.scenes) == null ? void 0 : n.viewed) ?? null) ? (cc(), !0) : ((r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "You do not have permission to manage scene criteria."), !0);
      }, "onDown"),
      restricted: !0,
      precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
    });
  }), Hooks.on("canvasReady", (t) => {
    var n;
    const e = Go();
    e && (e.setScene((t == null ? void 0 : t.scene) ?? ((n = game.scenes) == null ? void 0 : n.viewed) ?? null), e.render({ force: !0 }));
  }), Hooks.once("ready", () => {
    var e, n;
    const t = (n = (e = game.modules) == null ? void 0 : e.get) == null ? void 0 : n.call(e, ie);
    t && (t.api || (t.api = {}), t.api.criteria = mg, console.log(`${ie} | Criteria engine API registered`));
  });
}
c(ep, "registerCriteriaEngineHooks");
ep();
const Ta = /* @__PURE__ */ new WeakMap(), da = /* @__PURE__ */ new WeakMap(), pe = "__eidolon_default__";
function tp() {
  Hooks.on("renderAmbientLightConfig", np), N("LightCriteria | AmbientLightConfig controls registered");
}
c(tp, "registerAmbientLightCriteriaControls");
function np(t, e) {
  var n;
  zi("LightCriteria | renderAmbientLightConfig", {
    appId: (t == null ? void 0 : t.id) ?? null,
    constructor: ((n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) ?? null,
    isRendered: (t == null ? void 0 : t.rendered) ?? !1
  });
  try {
    const i = _t(e);
    if (!i) return;
    if (!qo()) {
      i.querySelectorAll(".eidolon-light-criteria, .eidolon-light-criteria-main-switcher").forEach((r) => r.remove());
      return;
    }
    ip(t, i);
  } catch (i) {
    console.error("eidolon-utilities | Failed to enhance AmbientLightConfig UI", i);
  } finally {
    _n();
  }
}
c(np, "handleAmbientLightConfigRender");
function ip(t, e) {
  var Ne, Gn, tr, na, Ac;
  const n = (t == null ? void 0 : t.form) instanceof HTMLFormElement ? t.form : e instanceof HTMLFormElement ? e : (Ne = e == null ? void 0 : e.closest) == null ? void 0 : Ne.call(e, "form");
  if (!(n instanceof HTMLFormElement)) return;
  const i = n.querySelector(".window-content");
  if (!(i instanceof HTMLElement)) return;
  const r = cf(t);
  if (!r) return;
  const a = Lp(r);
  N("LightCriteria | Resolved ambient light", {
    sheetId: (r == null ? void 0 : r.id) ?? null,
    persistedId: (a == null ? void 0 : a.id) ?? null,
    sameRef: r === a
  });
  const o = (a == null ? void 0 : a.parent) ?? r.parent ?? null, s = o ? lh(o) : [], l = s.filter(
    ($) => Array.isArray($ == null ? void 0 : $.values) && $.values.length > 0
  ), u = gp(s), d = s.map(($) => typeof ($ == null ? void 0 : $.id) == "string" ? $.id : null).filter(($) => !!$), h = a ?? r, f = o ? mt(o) : [];
  let g = Hd(h);
  const p = zh(g, f);
  JSON.stringify(p) !== JSON.stringify(g) && (g = p, qd(h, p).catch(($) => {
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
  const w = document.createElement("fieldset");
  w.classList.add("eidolon-light-criteria");
  const v = document.createElement("legend");
  v.textContent = S("EIDOLON.LightCriteria.Legend", "Scene Criteria Lighting"), w.appendChild(v);
  const b = document.createElement("p");
  b.classList.add("notes"), b.textContent = S(
    "EIDOLON.LightCriteria.Description",
    "Capture a base lighting state, then map criteria values to lighting configurations."
  ), w.appendChild(b);
  const E = document.createElement("div");
  E.classList.add("eidolon-light-criteria__controls");
  const L = document.createElement("button");
  L.type = "button", L.dataset.action = "make-default", L.classList.add("eidolon-light-criteria__button"), L.textContent = S(
    "EIDOLON.LightCriteria.SetBase",
    "Set Base"
  ), E.appendChild(L);
  const A = document.createElement("button");
  A.type = "button", A.dataset.action = "create-mapping", A.classList.add("eidolon-light-criteria__button"), A.textContent = S(
    "EIDOLON.LightCriteria.CreateMapping",
    "Add Criteria Mapping"
  ), A.setAttribute("aria-expanded", "false"), E.appendChild(A), w.appendChild(E);
  const O = document.createElement("p");
  O.classList.add("notes", "eidolon-light-criteria__status"), w.appendChild(O);
  const M = document.createElement("div");
  M.classList.add("eidolon-light-criteria__switcher");
  const x = document.createElement("label");
  x.classList.add("eidolon-light-criteria__switcher-label");
  const R = `${(t == null ? void 0 : t.id) ?? (r == null ? void 0 : r.id) ?? "eidolon-light"}-mapping-select`;
  x.htmlFor = R, x.textContent = S("EIDOLON.LightCriteria.SelectLabel", "Criteria Mapping"), M.appendChild(x);
  const D = document.createElement("details");
  D.classList.add("eidolon-light-criteria__filter-details");
  const F = document.createElement("summary");
  F.classList.add("eidolon-light-criteria__filter-summary");
  const _ = document.createElement("span");
  _.classList.add("eidolon-light-criteria__filter-summary-label"), _.textContent = S(
    "EIDOLON.LightCriteria.FilterHeading",
    "Filter mappings"
  ), F.appendChild(_);
  const H = document.createElement("span");
  H.classList.add("eidolon-light-criteria__filter-meta"), F.appendChild(H), D.appendChild(F);
  const B = document.createElement("div");
  B.classList.add("eidolon-light-criteria__filter-panel");
  const W = document.createElement("div");
  W.classList.add("eidolon-light-criteria__filter-grid");
  for (const $ of l) {
    const G = document.createElement("label");
    G.classList.add("eidolon-light-criteria__filter");
    const Z = document.createElement("span");
    Z.classList.add("eidolon-light-criteria__filter-name"), Z.textContent = (tr = (Gn = $.name) == null ? void 0 : Gn.trim) != null && tr.call(Gn) ? $.name.trim() : S("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), G.appendChild(Z);
    const ee = document.createElement("select");
    ee.dataset.filterCategoryId = $.id, ee.classList.add("eidolon-light-criteria__filter-select");
    const ne = document.createElement("option");
    ne.value = "", ne.textContent = S("EIDOLON.LightCriteria.FilterAny", "Any"), ee.appendChild(ne);
    for (const ce of $.values) {
      const ue = document.createElement("option");
      ue.value = ce, ue.textContent = ce, ee.appendChild(ue);
    }
    G.appendChild(ee), W.appendChild(G);
  }
  B.appendChild(W);
  const q = document.createElement("div");
  q.classList.add("eidolon-light-criteria__filter-actions");
  const U = document.createElement("button");
  U.type = "button", U.dataset.action = "clear-mapping-filters", U.classList.add("eidolon-light-criteria__button", "secondary", "compact"), U.textContent = S("EIDOLON.LightCriteria.ClearFilters", "Clear Filters"), q.appendChild(U), B.appendChild(q), D.appendChild(B), D.hidden = l.length === 0, M.appendChild(D);
  const K = document.createElement("div");
  K.classList.add("eidolon-light-criteria__switcher-controls"), M.appendChild(K);
  const ae = document.createElement("select");
  ae.id = R, ae.classList.add("eidolon-light-criteria__select"), ae.dataset.action = "select-mapping", K.appendChild(ae);
  const Q = document.createElement("button");
  Q.type = "button", Q.dataset.action = "apply-selected-mapping", Q.classList.add("eidolon-light-criteria__button", "secondary"), Q.textContent = S("EIDOLON.LightCriteria.ApplyButton", "Apply"), K.appendChild(Q);
  const te = document.createElement("details");
  te.classList.add("eidolon-light-criteria__menu"), te.dataset.action = "mapping-actions-menu";
  const Kt = document.createElement("summary");
  Kt.classList.add("eidolon-light-criteria__menu-toggle"), Kt.innerHTML = '<i class="fa-solid fa-ellipsis-vertical" inert=""></i>', Kt.setAttribute(
    "aria-label",
    S("EIDOLON.LightCriteria.MoreActions", "More actions")
  ), Kt.dataset.tooltip = S("EIDOLON.LightCriteria.MoreActions", "More actions"), te.appendChild(Kt);
  const ht = document.createElement("div");
  ht.classList.add("eidolon-light-criteria__menu-list"), te.appendChild(ht);
  const De = document.createElement("button");
  De.type = "button", De.dataset.action = "update-selected-mapping", De.classList.add("eidolon-light-criteria__menu-item"), De.textContent = S(
    "EIDOLON.LightCriteria.UpdateSelected",
    "Save current config to selected"
  ), ht.appendChild(De);
  const nt = document.createElement("button");
  nt.type = "button", nt.dataset.action = "edit-selected-mapping-criteria", nt.classList.add("eidolon-light-criteria__menu-item"), nt.textContent = S(
    "EIDOLON.LightCriteria.EditSelectedCriteria",
    "Edit selected mapping criteria"
  ), ht.appendChild(nt);
  const it = document.createElement("button");
  it.type = "button", it.dataset.action = "remove-selected-mapping", it.classList.add("eidolon-light-criteria__menu-item", "danger"), it.textContent = S(
    "EIDOLON.LightCriteria.RemoveSelected",
    "Delete selected mapping"
  ), ht.appendChild(it), K.appendChild(te);
  const Jt = document.createElement("div");
  Jt.classList.add("eidolon-light-criteria-main-switcher"), Jt.appendChild(M);
  const Ye = document.createElement("p");
  if (Ye.classList.add("notes", "eidolon-light-criteria-main-switcher__empty"), Ye.textContent = S(
    "EIDOLON.LightCriteria.ActiveRequiresBase",
    "Set Base Lighting to enable mapping selection and actions."
  ), Jt.appendChild(Ye), s.length === 0) {
    const $ = document.createElement("p");
    $.classList.add("notification", "warning", "eidolon-light-criteria__warning"), $.textContent = S(
      "EIDOLON.LightCriteria.NoCategoriesWarning",
      "This scene has no criteria configured. Add criteria under Scene -> Criteria to enable criteria-driven lighting."
    ), w.appendChild($);
  } else if (l.length === 0) {
    const $ = document.createElement("p");
    $.classList.add("notification", "warning", "eidolon-light-criteria__warning"), $.textContent = S(
      "EIDOLON.LightCriteria.NoValuesWarning",
      "Criteria exist, but none define selectable values. Add values in Scene -> Criteria."
    ), w.appendChild($);
  }
  const Le = document.createElement("div");
  Le.classList.add("eidolon-light-criteria__creation"), Le.dataset.section = "creation", Le.hidden = !0;
  const Ti = document.createElement("p");
  Ti.classList.add("notes"), Ti.textContent = S(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ), Le.appendChild(Ti);
  const Xt = document.createElement("div");
  Xt.classList.add("eidolon-light-criteria__category-list"), Le.appendChild(Xt);
  for (const $ of l) {
    const G = document.createElement("label");
    G.classList.add("eidolon-light-criteria__category");
    const Z = document.createElement("span");
    Z.classList.add("eidolon-light-criteria__category-name"), Z.textContent = (Ac = (na = $.name) == null ? void 0 : na.trim) != null && Ac.call(na) ? $.name.trim() : S("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), G.appendChild(Z);
    const ee = document.createElement("select");
    ee.dataset.categoryId = $.id, ee.classList.add("eidolon-light-criteria__category-select");
    const ne = document.createElement("option");
    ne.value = "", ne.textContent = S(
      "EIDOLON.LightCriteria.IgnoreCategory",
      "Ignore"
    ), ee.appendChild(ne);
    for (const ce of $.values) {
      const ue = document.createElement("option");
      ue.value = ce, ue.textContent = ce, ee.appendChild(ue);
    }
    G.appendChild(ee), Xt.appendChild(G);
  }
  const Vn = document.createElement("div");
  Vn.classList.add("eidolon-light-criteria__creation-actions");
  const rt = document.createElement("button");
  rt.type = "button", rt.dataset.action = "save-mapping", rt.classList.add("eidolon-light-criteria__button", "primary"), rt.textContent = S(
    "EIDOLON.LightCriteria.SaveMapping",
    "Save Mapping"
  ), Vn.appendChild(rt);
  const Qt = document.createElement("button");
  Qt.type = "button", Qt.dataset.action = "cancel-create", Qt.classList.add("eidolon-light-criteria__button", "secondary"), Qt.textContent = S(
    "EIDOLON.LightCriteria.Cancel",
    "Cancel"
  ), Vn.appendChild(Qt), Le.appendChild(Vn), w.appendChild(Le), i.prepend(Jt), i.appendChild(w), w.hidden = !0, op(t, {
    fieldset: w,
    homeContainer: i
  }), requestAnimationFrame(() => {
    var $;
    ($ = t.setPosition) == null || $.call(t, { height: "auto" });
  });
  let P = g;
  Yn({ switcher: M, emptyState: Ye, state: P }), Wn(O, P), ar(A, {
    state: P,
    hasCategories: l.length > 0
  }), N("LightCriteria | Controls injected", {
    sceneId: (o == null ? void 0 : o.id) ?? null,
    lightId: (r == null ? void 0 : r.id) ?? null,
    hasBase: !!(P != null && P.base),
    mappingCount: Array.isArray(P == null ? void 0 : P.mappings) ? P.mappings.length : 0,
    categories: l.length
  });
  const ea = Ep(P), X = {
    restoreConfig: null,
    app: t,
    selectedMapping: ea,
    editorMode: "create",
    editingMappingId: null,
    mappingFilters: {}
  };
  Ta.set(w, X);
  const gt = /* @__PURE__ */ c(() => {
    te.open = !1;
  }, "closeActionsMenu");
  Kt.addEventListener("click", ($) => {
    te.classList.contains("is-disabled") && ($.preventDefault(), gt());
  });
  const Me = /* @__PURE__ */ c(($ = X.selectedMapping) => {
    const G = pp(W), Z = Array.isArray(P == null ? void 0 : P.mappings) ? P.mappings : [], ee = bp(Z, G), ne = Object.keys(G).length;
    X.mappingFilters = G, U.disabled = ne === 0, vp(H, {
      totalCount: Z.length,
      visibleCount: ee.length,
      hasFilters: ne > 0,
      activeFilterCount: ne
    }), D.classList.toggle("has-active-filters", ne > 0), wp(ae, P, u, $, {
      mappings: ee,
      categoryOrder: d
    }), X.selectedMapping = ae.value ?? "", gs({
      mappingSelect: ae,
      applyMappingButton: Q,
      updateMappingButton: De,
      editCriteriaButton: nt,
      removeMappingButton: it,
      actionsMenu: te,
      state: P
    }), te.classList.contains("is-disabled") && gt();
  }, "refreshMappingSelector");
  W.querySelectorAll("select[data-filter-category-id]").forEach(($) => {
    $.addEventListener("change", () => {
      const G = X.selectedMapping;
      Me(G), X.selectedMapping !== G && ps(
        a ?? r,
        P,
        X.selectedMapping
      ).then((Z) => {
        Z && (P = Z);
      });
    });
  }), U.addEventListener("click", () => {
    yp(W);
    const $ = X.selectedMapping;
    Me($), D.open = !1, X.selectedMapping !== $ && ps(
      a ?? r,
      P,
      X.selectedMapping
    ).then((G) => {
      G && (P = G);
    });
  }), ae.addEventListener("change", () => {
    X.selectedMapping = ae.value ?? "", gs({
      mappingSelect: ae,
      applyMappingButton: Q,
      updateMappingButton: De,
      editCriteriaButton: nt,
      removeMappingButton: it,
      actionsMenu: te,
      state: P
    }), ps(
      a ?? r,
      P,
      X.selectedMapping
    ).then(($) => {
      $ && (P = $);
    });
  });
  const er = /* @__PURE__ */ c(async () => {
    var ee, ne, ce, ue, at, fn, ot, mn, he, hn, gn, xt, zn, nr;
    const $ = ae.value ?? "";
    if (!$) {
      (ne = (ee = ui.notifications) == null ? void 0 : ee.warn) == null || ne.call(
        ee,
        S(
          "EIDOLON.LightCriteria.SelectMappingWarning",
          "Choose a criteria mapping before applying."
        )
      ), Me(X.selectedMapping);
      return;
    }
    if ($ === pe) {
      if (!(P != null && P.base)) {
        (ue = (ce = ui.notifications) == null ? void 0 : ce.warn) == null || ue.call(
          ce,
          S(
            "EIDOLON.LightCriteria.BaseUnavailable",
            "Set a base lighting state before applying it."
          )
        );
        return;
      }
      fa(w, Le, A), Ia(t, n, P.base), P = await mr(a ?? r, {
        mappingId: pe,
        categories: null,
        updatedAt: Date.now()
      }), X.selectedMapping = pe, Me(X.selectedMapping), Wn(O, P), Yn({ switcher: M, emptyState: Ye, state: P }), ar(A, {
        state: P,
        hasCategories: l.length > 0
      }), iu(n, {
        mappingId: pe,
        color: ((fn = (at = P.base) == null ? void 0 : at.config) == null ? void 0 : fn.color) ?? null
      }), (mn = (ot = ui.notifications) == null ? void 0 : ot.info) == null || mn.call(
        ot,
        S(
          "EIDOLON.LightCriteria.BaseApplied",
          "Applied the base lighting state to the form."
        )
      ), gt();
      return;
    }
    const G = Array.isArray(P == null ? void 0 : P.mappings) && P.mappings.length ? P.mappings.find((Li) => (Li == null ? void 0 : Li.id) === $) : null;
    if (!G) {
      (hn = (he = ui.notifications) == null ? void 0 : he.warn) == null || hn.call(
        he,
        S(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      ), X.selectedMapping = "", Me(X.selectedMapping);
      return;
    }
    fa(w, Le, A), Ia(t, n, G.config), P = await mr(a ?? r, {
      mappingId: G.id,
      categories: G.categories,
      updatedAt: Date.now()
    }), X.selectedMapping = G.id, Me(X.selectedMapping), Wn(O, P), Yn({ switcher: M, emptyState: Ye, state: P }), ar(A, {
      state: P,
      hasCategories: l.length > 0
    }), iu(n, {
      mappingId: G.id,
      color: ((xt = (gn = G.config) == null ? void 0 : gn.config) == null ? void 0 : xt.color) ?? null
    });
    const Z = Hi(G, u, d);
    (nr = (zn = ui.notifications) == null ? void 0 : zn.info) == null || nr.call(
      zn,
      S(
        "EIDOLON.LightCriteria.MappingApplied",
        "Applied mapping: {label}"
      ).replace("{label}", Z)
    ), gt();
  }, "applySelectedMapping");
  Q.addEventListener("click", () => {
    er();
  }), ae.addEventListener("keydown", ($) => {
    $.key === "Enter" && ($.preventDefault(), er());
  });
  const ta = /* @__PURE__ */ c(async () => {
    var G, Z, ee, ne, ce, ue, at, fn, ot, mn, he, hn, gn, xt, zn, nr, Li, ia, kc, ra, Mc;
    const $ = X.selectedMapping;
    if (!$) {
      (Z = (G = ui.notifications) == null ? void 0 : G.warn) == null || Z.call(
        G,
        S(
          "EIDOLON.LightCriteria.SelectMappingWarning",
          "Choose a criteria mapping before applying."
        )
      );
      return;
    }
    De.disabled = !0;
    try {
      const Ke = La(t, a);
      if ($ === pe)
        P = await Yc(a ?? r, Ke), N("LightCriteria | Base lighting updated", {
          lightId: ((ee = a ?? r) == null ? void 0 : ee.id) ?? null,
          configColor: ((ne = Ke == null ? void 0 : Ke.config) == null ? void 0 : ne.color) ?? null
        }), (ue = (ce = ui.notifications) == null ? void 0 : ce.info) == null || ue.call(
          ce,
          S(
            "EIDOLON.LightCriteria.BaseUpdated",
            "Updated the base lighting state with the current configuration."
          )
        ), X.selectedMapping = pe;
      else {
        const Ii = hr(P, $);
        if (!Ii) {
          (fn = (at = ui.notifications) == null ? void 0 : at.warn) == null || fn.call(
            at,
            S(
              "EIDOLON.LightCriteria.MappingUnavailable",
              "The selected criteria mapping is no longer available."
            )
          ), X.selectedMapping = "", Me(X.selectedMapping);
          return;
        }
        P = await Kc(
          a ?? r,
          Ii.categories,
          Ke,
          { label: Ii.label ?? null }
        ), N("LightCriteria | Mapping updated", {
          mappingId: $,
          hasColor: !!((ot = Ke == null ? void 0 : Ke.config) != null && ot.color),
          stored: Array.isArray(P == null ? void 0 : P.mappings) ? ((mn = P.mappings.find((ts) => (ts == null ? void 0 : ts.id) === $)) == null ? void 0 : mn.config) ?? null : null,
          persisted: (hn = (he = a ?? r) == null ? void 0 : he.getFlag) == null ? void 0 : hn.call(he, gi, Ri)
        });
        const ir = hr(P, $), Em = Hi(ir || Ii, u, d);
        N("LightCriteria | Mapping updated", {
          mappingId: $,
          categories: Ii.categories,
          updatedColor: ((gn = Ke == null ? void 0 : Ke.config) == null ? void 0 : gn.color) ?? null,
          storedColor: ((zn = (xt = ir == null ? void 0 : ir.config) == null ? void 0 : xt.config) == null ? void 0 : zn.color) ?? ((Li = (nr = Ii.config) == null ? void 0 : nr.config) == null ? void 0 : Li.color) ?? null
        }), (kc = (ia = ui.notifications) == null ? void 0 : ia.info) == null || kc.call(
          ia,
          S(
            "EIDOLON.LightCriteria.MappingUpdated",
            "Saved changes to mapping: {label}"
          ).replace("{label}", Em)
        ), X.selectedMapping = $;
      }
      Wn(O, P), Yn({ switcher: M, emptyState: Ye, state: P }), ar(A, {
        state: P,
        hasCategories: l.length > 0
      }), Me(X.selectedMapping), gt();
    } catch (Ke) {
      console.error("eidolon-utilities | Failed to update light criteria mapping", Ke), (Mc = (ra = ui.notifications) == null ? void 0 : ra.error) == null || Mc.call(
        ra,
        S(
          "EIDOLON.LightCriteria.MappingUpdateError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      De.disabled = !1, gs({
        mappingSelect: ae,
        applyMappingButton: Q,
        updateMappingButton: De,
        editCriteriaButton: nt,
        removeMappingButton: it,
        actionsMenu: te,
        state: P
      });
    }
  }, "updateSelectedMapping");
  De.addEventListener("click", () => {
    ta();
  }), Me(X.selectedMapping), L.addEventListener("click", async () => {
    var $, G, Z, ee, ne, ce;
    L.disabled = !0;
    try {
      const ue = La(t, a);
      P = await Yc(a ?? r, ue), N("LightCriteria | Base lighting stored", {
        lightId: (($ = a ?? r) == null ? void 0 : $.id) ?? null,
        configColor: ((G = ue == null ? void 0 : ue.config) == null ? void 0 : G.color) ?? null
      }), (ee = (Z = ui.notifications) == null ? void 0 : Z.info) == null || ee.call(
        Z,
        S(
          "EIDOLON.LightCriteria.BaseStored",
          "Saved the current configuration as the base lighting state."
        )
      ), Wn(O, P), Yn({ switcher: M, emptyState: Ye, state: P }), ar(A, {
        state: P,
        hasCategories: l.length > 0
      }), X.selectedMapping = pe, Me(X.selectedMapping);
    } catch (ue) {
      console.error("eidolon-utilities | Failed to store base light criteria state", ue), (ce = (ne = ui.notifications) == null ? void 0 : ne.error) == null || ce.call(
        ne,
        S(
          "EIDOLON.LightCriteria.BaseError",
          "Failed to save the base lighting state. Check the console for details."
        )
      );
    } finally {
      L.disabled = !1;
    }
  }), A.addEventListener("click", () => {
    var G, Z, ee, ne;
    if (!(P != null && P.base)) {
      (Z = (G = ui.notifications) == null ? void 0 : G.warn) == null || Z.call(
        G,
        S(
          "EIDOLON.LightCriteria.RequiresBase",
          "Set a base lighting state before adding criteria mappings."
        )
      );
      return;
    }
    if (l.length === 0) {
      (ne = (ee = ui.notifications) == null ? void 0 : ee.warn) == null || ne.call(
        ee,
        S(
          "EIDOLON.LightCriteria.NoCategoriesAvailable",
          "Add scene criteria with values in the Scene configuration before creating mappings."
        )
      );
      return;
    }
    const $ = Ta.get(w);
    nu({
      app: t,
      fieldset: w,
      createButton: A,
      creationSection: Le,
      categoryList: Xt,
      form: n,
      persistedLight: a,
      stateEntry: $,
      mode: "create",
      mapping: null,
      preloadConfig: P.base
    });
  }), nt.addEventListener("click", () => {
    var Z, ee, ne, ce;
    const $ = X.selectedMapping;
    if (!$ || $ === pe) {
      (ee = (Z = ui.notifications) == null ? void 0 : Z.warn) == null || ee.call(
        Z,
        S(
          "EIDOLON.LightCriteria.SelectMappingForCriteriaEdit",
          "Select a mapping before editing criteria."
        )
      );
      return;
    }
    const G = hr(P, $);
    if (!G) {
      (ce = (ne = ui.notifications) == null ? void 0 : ne.warn) == null || ce.call(
        ne,
        S(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      );
      return;
    }
    gt(), lf(t, { fieldset: w, homeContainer: i }), nu({
      app: t,
      fieldset: w,
      createButton: A,
      creationSection: Le,
      categoryList: Xt,
      form: n,
      persistedLight: a,
      stateEntry: X,
      mode: "retarget",
      mapping: G,
      preloadConfig: G.config
    });
  }), rt.addEventListener("click", async () => {
    var G, Z, ee, ne, ce, ue, at, fn, ot, mn;
    const $ = Tp(Xt);
    if (!$) {
      (Z = (G = ui.notifications) == null ? void 0 : G.warn) == null || Z.call(
        G,
        S(
          "EIDOLON.LightCriteria.SelectionRequired",
          "Select at least one criteria value to identify the mapping."
        )
      );
      return;
    }
    rt.disabled = !0;
    try {
      const he = La(t, a);
      if (X.editorMode === "retarget" && X.editingMappingId) {
        const gn = pl(P, $);
        let xt = !1;
        if (gn && gn !== X.editingMappingId && (xt = await rp(), !xt)) {
          rt.disabled = !1;
          return;
        }
        P = await Uh(
          a ?? r,
          X.editingMappingId,
          $,
          he,
          { replaceExisting: xt }
        ), N("LightCriteria | Mapping criteria retargeted", {
          mappingId: X.editingMappingId,
          categories: $,
          replaced: xt,
          configColor: ((ee = he == null ? void 0 : he.config) == null ? void 0 : ee.color) ?? null
        }), (ce = (ne = ui.notifications) == null ? void 0 : ne.info) == null || ce.call(
          ne,
          S(
            "EIDOLON.LightCriteria.MappingCriteriaUpdated",
            "Updated mapping criteria for the selected mapping."
          )
        );
      } else
        P = await Kc(
          a ?? r,
          $,
          he,
          {}
        ), N("LightCriteria | Mapping saved from editor", {
          categories: $,
          configColor: ((ue = he == null ? void 0 : he.config) == null ? void 0 : ue.color) ?? null
        }), (fn = (at = ui.notifications) == null ? void 0 : at.info) == null || fn.call(
          at,
          S(
            "EIDOLON.LightCriteria.MappingSaved",
            "Updated lighting mapping for the selected scene criteria."
          )
        );
      Wn(O, P), Yn({ switcher: M, emptyState: Ye, state: P });
      const hn = pl(P, $);
      hn && (X.selectedMapping = hn), Me(X.selectedMapping), fa(w, Le, A), gt();
    } catch (he) {
      console.error("eidolon-utilities | Failed to persist light criteria mapping", he), (mn = (ot = ui.notifications) == null ? void 0 : ot.error) == null || mn.call(
        ot,
        S(
          "EIDOLON.LightCriteria.MappingError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      rt.disabled = !1;
    }
  }), Qt.addEventListener("click", () => {
    const $ = Ta.get(w);
    $ != null && $.restoreConfig && Ia(t, n, $.restoreConfig), fa(w, Le, A);
  }), it.addEventListener("click", async () => {
    var Z, ee;
    const $ = X.selectedMapping;
    !$ || $ === pe || !await ap() || (P = await Vh(a ?? r, $), X.selectedMapping = "", Wn(O, P), Yn({ switcher: M, emptyState: Ye, state: P }), Me(X.selectedMapping), gt(), (ee = (Z = ui.notifications) == null ? void 0 : Z.info) == null || ee.call(
      Z,
      S("EIDOLON.LightCriteria.MappingRemoved", "Removed selected mapping.")
    ));
  });
}
c(ip, "enhanceAmbientLightConfig");
function nu({
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
  s && (s.restoreConfig = La(t, o), s.editorMode = l, s.editingMappingId = l === "retarget" ? (u == null ? void 0 : u.id) ?? null : null), d && Ia(t, a, d), l === "retarget" && (u != null && u.categories) ? Cp(r, u.categories) : Sp(r);
  const h = i.querySelector("p.notes");
  h instanceof HTMLElement && (h.textContent = l === "retarget" ? S(
    "EIDOLON.LightCriteria.EditCriteriaDescription",
    "Adjust criteria values for the selected mapping."
  ) : S(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const f = i.querySelector('button[data-action="save-mapping"]');
  f instanceof HTMLButtonElement && (f.textContent = l === "retarget" ? S("EIDOLON.LightCriteria.SaveCriteriaChanges", "Save Criteria Changes") : S("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), i.hidden = !1, n.setAttribute("aria-expanded", "true"), dc(e, i), requestAnimationFrame(() => {
    var g;
    (g = t.setPosition) == null || g.call(t, { height: "auto" });
  });
}
c(nu, "openMappingEditor");
async function rp() {
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
c(rp, "confirmCriteriaConflict");
async function ap() {
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
c(ap, "confirmRemoveMapping");
function op(t, { fieldset: e, homeContainer: n }) {
  const i = cp(t, n);
  if (!(i instanceof HTMLElement)) return;
  const r = i.querySelector(".window-header");
  if (!(r instanceof HTMLElement)) return;
  let a = r.querySelector('[data-eidolon-action="open-light-criteria-manager"]');
  if (!(a instanceof HTMLButtonElement)) {
    a = document.createElement("button"), a.type = "button", a.classList.add("header-control", "icon"), a.dataset.eidolonAction = "open-light-criteria-manager", a.dataset.tooltip = S("EIDOLON.LightCriteria.OpenManager", "Open Scene Criteria Lighting"), a.setAttribute("aria-label", S("EIDOLON.LightCriteria.OpenManager", "Open Scene Criteria Lighting")), a.innerHTML = '<i class="fa-solid fa-sliders" inert=""></i>';
    const o = r.querySelector(".window-controls") ?? r, s = o.querySelector('[data-action="toggleControls"]');
    if ((s == null ? void 0 : s.parentElement) === o)
      o.insertBefore(a, s);
    else {
      const l = o.querySelector('[data-action="close"]');
      (l == null ? void 0 : l.parentElement) === o ? o.insertBefore(a, l) : o.appendChild(a);
    }
  }
  a.onclick = (o) => {
    o.preventDefault(), lf(t, { fieldset: e, homeContainer: n });
  };
}
c(op, "ensureManagerHeaderButton");
function lf(t, { fieldset: e, homeContainer: n }) {
  var f, g, p;
  const i = da.get(t);
  if (i != null && i.rendered) {
    (f = i.bringToTop) == null || f.call(i);
    return;
  }
  const r = /* @__PURE__ */ c((...y) => {
    var b;
    const w = sp(y), v = (b = w == null ? void 0 : w.querySelector) == null ? void 0 : b.call(w, ".eidolon-light-criteria-manager-host");
    v instanceof HTMLElement && (lp(e), e.hidden = !1, v.appendChild(e));
  }, "onRender"), a = /* @__PURE__ */ c(() => {
    n instanceof HTMLElement && n.appendChild(e), e.hidden = !0, da.delete(t), requestAnimationFrame(() => {
      var y;
      (y = t.setPosition) == null || y.call(t, { height: "auto" });
    });
  }, "onClose"), o = S("EIDOLON.LightCriteria.ManagerTitle", "Scene Criteria Lighting"), s = '<div class="eidolon-light-criteria-manager-host"></div>', l = S("EIDOLON.LightCriteria.Close", "Close"), u = (p = (g = foundry == null ? void 0 : foundry.applications) == null ? void 0 : g.api) == null ? void 0 : p.DialogV2;
  if (typeof (u == null ? void 0 : u.wait) == "function")
    try {
      let y = !1;
      const w = /* @__PURE__ */ c(() => {
        y || (y = !0, a());
      }, "closeOnce");
      da.set(t, {
        rendered: !0,
        bringToTop: /* @__PURE__ */ c(() => {
        }, "bringToTop")
      }), u.wait({
        window: { title: o },
        content: s,
        buttons: [{ action: "close", label: l, default: !0 }],
        render: /* @__PURE__ */ c((...v) => r(...v), "render"),
        close: w,
        rejectClose: !1
      }).catch((v) => {
        console.warn("eidolon-utilities | DialogV2 manager failed, falling back to Dialog", v), w();
      });
      return;
    } catch (y) {
      console.warn("eidolon-utilities | DialogV2 manager failed, falling back to Dialog", y), a();
    }
  const d = globalThis.Dialog;
  if (typeof d != "function") return;
  const h = new d(
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
  da.set(t, h), h.render(!0);
}
c(lf, "openManagerDialog");
function sp(t) {
  for (const e of t) {
    const n = _t(e);
    if (n) return n;
    const i = _t(e == null ? void 0 : e.element);
    if (i) return i;
  }
  return null;
}
c(sp, "findDialogRoot");
function lp(t) {
  if (!(t instanceof HTMLElement) || t.dataset.managerLayout === "true") return;
  t.dataset.managerLayout = "true", t.classList.add("is-manager");
  const e = t.querySelector("legend"), n = t.querySelector("p.notes:not(.eidolon-light-criteria__status)"), i = t.querySelector(".eidolon-light-criteria__controls"), r = t.querySelector(".eidolon-light-criteria__status"), a = t.querySelector(".eidolon-light-criteria__creation"), o = Array.from(t.querySelectorAll(".eidolon-light-criteria__warning")), s = document.createElement("div");
  s.classList.add("eidolon-light-criteria-manager");
  const l = document.createElement("section");
  l.classList.add("eidolon-light-criteria-manager__section", "is-top"), s.appendChild(l);
  const u = document.createElement("section");
  u.classList.add("eidolon-light-criteria-manager__section", "is-bottom"), s.appendChild(u);
  const d = document.createElement("div");
  if (d.classList.add("eidolon-light-criteria-manager__header"), d.textContent = S("EIDOLON.LightCriteria.ManagerHeader", "Base State"), l.appendChild(d), r && l.appendChild(r), i && l.appendChild(i), o.length) {
    const f = document.createElement("div");
    f.classList.add("eidolon-light-criteria-manager__warnings");
    for (const g of o) f.appendChild(g);
    l.appendChild(f);
  }
  const h = document.createElement("div");
  h.classList.add("eidolon-light-criteria-manager__header"), h.textContent = S("EIDOLON.LightCriteria.ManagerAuthoring", "Create or Update Mapping"), u.appendChild(h), a && u.appendChild(a), t.innerHTML = "", e && t.appendChild(e), n && t.appendChild(n), t.appendChild(s), dc(t, a);
}
c(lp, "applyManagerLayout");
function cp(t, e) {
  var i;
  const n = _t(t == null ? void 0 : t.element);
  return n || (((i = e == null ? void 0 : e.closest) == null ? void 0 : i.call(e, ".application")) ?? null);
}
c(cp, "resolveApplicationRoot");
function fa(t, e, n) {
  const i = Ta.get(t);
  i && (i.restoreConfig = null, i.editorMode = "create", i.editingMappingId = null), e.hidden = !0, n.setAttribute("aria-expanded", "false");
  const r = e.querySelector("p.notes");
  r instanceof HTMLElement && (r.textContent = S(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const a = e.querySelector('button[data-action="save-mapping"]');
  a instanceof HTMLButtonElement && (a.textContent = S("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), dc(t, e), requestAnimationFrame(() => {
    var o, s;
    (s = (o = i == null ? void 0 : i.app) == null ? void 0 : o.setPosition) == null || s.call(o, { height: "auto" });
  });
}
c(fa, "hideCreationSection");
function Wn(t, e) {
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
c(Wn, "updateStatusLine");
function ar(t, { state: e, hasCategories: n }) {
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
c(ar, "updateCreateButtonState");
function La(t, e) {
  var l, u, d;
  const n = e ?? cf(t);
  if (!n)
    throw new Error("Ambient light document unavailable.");
  const i = wi(((l = n.toObject) == null ? void 0 : l.call(n)) ?? {});
  if (!i)
    throw new Error("Unable to duplicate ambient light data.");
  const r = (t == null ? void 0 : t.form) instanceof HTMLFormElement ? t.form : null, a = r ? Ym(r) : {}, o = foundry.utils.mergeObject(i, a, {
    inplace: !1,
    performDeletions: !0
  });
  r && (r.querySelectorAll("color-picker[name]").forEach((h) => {
    var v, b;
    const f = h.getAttribute("name");
    if (!f) return;
    const g = typeof h.value == "string" ? h.value : "", p = ((v = h.ui) == null ? void 0 : v.input) ?? ((b = h.querySelector) == null ? void 0 : b.call(h, 'input[type="color"]')), y = (p == null ? void 0 : p.value) ?? "", w = g || y;
    typeof w != "string" || !w || (foundry.utils.setProperty(o, f, w), N("LightCriteria | Captured color-picker value", {
      path: f,
      pickerValue: g,
      swatchValue: y,
      chosenValue: w
    }));
  }), r.querySelectorAll("range-picker[name]").forEach((h) => {
    var A, O;
    const f = h.getAttribute("name");
    if (!f) return;
    const g = h.value !== void 0 && h.value !== null ? String(h.value) : "", p = (A = h.querySelector) == null ? void 0 : A.call(h, 'input[type="range"]'), y = (O = h.querySelector) == null ? void 0 : O.call(h, 'input[type="number"]'), w = p instanceof HTMLInputElement ? p.value : "", v = y instanceof HTMLInputElement ? y.value : "", b = g || v || w;
    if (typeof b != "string" || !b.length) return;
    const E = Number(b), L = Number.isFinite(E) ? E : b;
    foundry.utils.setProperty(o, f, L), N("LightCriteria | Captured range-picker value", {
      path: f,
      elementValue: g,
      numberValue: v,
      rangeValue: w,
      chosenValue: L
    });
  }));
  const s = wi(o);
  return N("LightCriteria | Captured form config", {
    lightId: (n == null ? void 0 : n.id) ?? null,
    hasColor: !!((u = s == null ? void 0 : s.config) != null && u.color),
    color: ((d = s == null ? void 0 : s.config) == null ? void 0 : d.color) ?? null
  }), s;
}
c(La, "captureAmbientLightFormConfig");
function Ia(t, e, n) {
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
        s instanceof HTMLElement && s.tagName === "COLOR-PICKER" ? dp(s, a) : s instanceof HTMLElement && s.tagName === "RANGE-PICKER" ? fp(s, a) : s instanceof HTMLInputElement ? up(s, a) : s instanceof HTMLSelectElement ? mp(s, a) : s instanceof HTMLTextAreaElement && hp(s, a);
    }
  }
  requestAnimationFrame(() => {
    var r;
    return (r = t._previewChanges) == null ? void 0 : r.call(t);
  });
}
c(Ia, "applyConfigToForm");
function up(t, e, n) {
  const i = t.type;
  if (i === "checkbox") {
    const o = !!e;
    t.checked !== o && (t.checked = o, Nt(t));
    return;
  }
  if (i === "radio") {
    const o = e == null ? "" : String(e), s = t.value === o;
    t.checked !== s && (t.checked = s, s && Nt(t));
    return;
  }
  const r = e == null ? "" : String(e);
  let a = !1;
  t.value !== r && (t.value = r, a = !0), a && Nt(t);
}
c(up, "applyValueToInput");
function dp(t, e, n) {
  var s, l, u, d, h, f;
  const i = e == null ? "" : String(e);
  let r = !1;
  t.value !== i && (t.value = i, t.setAttribute("value", i), (s = t.ui) != null && s.setValue && t.ui.setValue(i), r = !0);
  const a = ((l = t.ui) == null ? void 0 : l.input) ?? ((u = t.querySelector) == null ? void 0 : u.call(t, 'input[type="color"]'));
  a instanceof HTMLInputElement && a.value !== i && (a.value = i, Nt(a));
  const o = ((d = t.ui) == null ? void 0 : d.text) ?? ((h = t.querySelector) == null ? void 0 : h.call(t, 'input[type="text"]'));
  o instanceof HTMLInputElement && o.value !== i && (o.value = i, Nt(o)), (f = t.ui) != null && f.commit ? t.ui.commit() : (t.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), t.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }))), N("LightCriteria | Color picker applied", {
    value: i,
    pickerValue: t.value ?? null,
    swatchValue: (a == null ? void 0 : a.value) ?? null,
    textValue: (o == null ? void 0 : o.value) ?? null
  }), r && Nt(t);
}
c(dp, "applyValueToColorPicker");
function fp(t, e, n) {
  var u, d;
  const i = e == null ? "" : String(e), r = Number(i), a = Number.isFinite(r) ? r : i;
  let o = !1;
  t.value !== void 0 && t.value !== a && (t.value = a, o = !0), t.getAttribute("value") !== i && (t.setAttribute("value", i), o = !0);
  const s = (u = t.querySelector) == null ? void 0 : u.call(t, 'input[type="range"]');
  s instanceof HTMLInputElement && s.value !== i && (s.value = i, Nt(s));
  const l = (d = t.querySelector) == null ? void 0 : d.call(t, 'input[type="number"]');
  if (l instanceof HTMLInputElement && l.value !== i && (l.value = i, Nt(l)), typeof t.commit == "function")
    try {
      t.commit();
    } catch (h) {
      console.error("eidolon-utilities | range-picker commit failed", h);
    }
  N("LightCriteria | Range picker applied", {
    value: i,
    resolvedValue: a,
    rangeValue: (s == null ? void 0 : s.value) ?? null,
    numberValue: (l == null ? void 0 : l.value) ?? null
  }), o && Nt(t);
}
c(fp, "applyValueToRangePicker");
function mp(t, e, n) {
  const i = e == null ? "" : String(e);
  t.value !== i && (t.value = i, Nt(t));
}
c(mp, "applyValueToSelect");
function hp(t, e, n) {
  const i = e == null ? "" : String(e);
  t.value !== i && (t.value = i, Nt(t));
}
c(hp, "applyValueToTextarea");
function Nt(t) {
  t.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), t.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }));
}
c(Nt, "triggerInputChange");
function gs({
  mappingSelect: t,
  applyMappingButton: e,
  updateMappingButton: n,
  editCriteriaButton: i,
  removeMappingButton: r,
  actionsMenu: a,
  state: o
}) {
  const s = (t == null ? void 0 : t.value) ?? "", l = !!(o != null && o.base), u = s && s !== pe ? !!hr(o, s) : !1;
  if (e instanceof HTMLButtonElement && (s ? s === pe ? e.disabled = !l : e.disabled = !u : e.disabled = !0), n instanceof HTMLButtonElement && (s ? s === pe ? n.disabled = !1 : n.disabled = !u : n.disabled = !0), i instanceof HTMLButtonElement && (i.disabled = !s || s === pe || !u), r instanceof HTMLButtonElement && (r.disabled = !s || s === pe || !u), a instanceof HTMLElement) {
    const d = n instanceof HTMLButtonElement && !n.disabled || i instanceof HTMLButtonElement && !i.disabled || r instanceof HTMLButtonElement && !r.disabled;
    a.classList.toggle("is-disabled", !d), !d && "open" in a && (a.open = !1);
  }
}
c(gs, "syncMappingSwitcherState");
function gp(t) {
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
c(gp, "buildCategoryNameLookup");
function pp(t) {
  const e = {};
  return t instanceof HTMLElement && t.querySelectorAll("select[data-filter-category-id]").forEach((n) => {
    var a, o;
    const i = n.dataset.filterCategoryId, r = (o = (a = n.value) == null ? void 0 : a.trim) == null ? void 0 : o.call(a);
    !i || !r || (e[i] = r);
  }), e;
}
c(pp, "readMappingFilterSelections");
function yp(t) {
  t instanceof HTMLElement && t.querySelectorAll("select[data-filter-category-id]").forEach((e) => {
    e.value = "";
  });
}
c(yp, "resetMappingFilterSelections");
function bp(t, e) {
  const n = Array.isArray(t) ? t : [], i = Object.entries(e ?? {}).filter(([, r]) => !!r);
  return i.length ? n.filter((r) => {
    if (!r || typeof r != "object") return !1;
    const a = r.categories ?? {};
    for (const [o, s] of i)
      if ((a == null ? void 0 : a[o]) !== s) return !1;
    return !0;
  }) : n.slice();
}
c(bp, "filterMappingsByCriteria");
function vp(t, { totalCount: e = 0, visibleCount: n = 0, hasFilters: i = !1, activeFilterCount: r = 0 } = {}) {
  if (!(t instanceof HTMLElement)) return;
  if (!i) {
    t.textContent = S(
      "EIDOLON.LightCriteria.FilterSummaryAll",
      "All ({count})"
    ).replace("{count}", String(e));
    return;
  }
  const a = S(
    "EIDOLON.LightCriteria.FilterSummaryActive",
    "{active} filters · {visible}/{total}"
  ).replace("{active}", String(r)).replace("{visible}", String(n)).replace("{total}", String(e));
  t.textContent = a;
}
c(vp, "updateMappingFilterMeta");
function wp(t, e, n, i, r = {}) {
  if (!(t instanceof HTMLSelectElement)) return;
  const a = typeof i == "string" ? i : "", o = !!(e != null && e.base), s = Array.isArray(r == null ? void 0 : r.categoryOrder) ? r.categoryOrder : [], l = Array.isArray(r == null ? void 0 : r.mappings) ? r.mappings.slice() : Array.isArray(e == null ? void 0 : e.mappings) ? e.mappings.slice() : [], u = t.value;
  t.innerHTML = "";
  const d = document.createElement("option");
  d.value = "", d.textContent = S(
    "EIDOLON.LightCriteria.SelectPlaceholder",
    "Select a mapping"
  ), d.disabled = o, t.appendChild(d);
  const h = document.createElement("option");
  h.value = pe, h.textContent = S(
    "EIDOLON.LightCriteria.BaseOption",
    "Base Lighting"
  ), h.disabled = !o, t.appendChild(h), l.slice().sort((y, w) => {
    var E;
    const v = Hi(y, n, s), b = Hi(w, n, s);
    return v.localeCompare(b, ((E = game.i18n) == null ? void 0 : E.lang) ?? void 0, {
      sensitivity: "base"
    });
  }).forEach((y) => {
    if (!(y != null && y.id)) return;
    const w = document.createElement("option");
    w.value = y.id, w.textContent = Hi(y, n, s), t.appendChild(w);
  });
  const f = new Set(
    Array.from(t.options).filter((y) => !y.disabled).map((y) => y.value)
  ), g = o && u === "" ? "" : u, p = a || (f.has(g) ? g : "");
  p && f.has(p) ? t.value = p : o ? t.value = pe : t.value = "";
}
c(wp, "populateMappingSelector");
function Hi(t, e, n = []) {
  if (!t || typeof t != "object")
    return S("EIDOLON.LightCriteria.UnnamedMapping", "Unnamed Mapping");
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
    return `${e.get(s) ?? S("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category")}=${u}`;
  }).filter(Boolean);
  return o.length === 0 ? S("EIDOLON.LightCriteria.UnnamedMapping", "Unnamed Mapping") : o.join(" | ");
}
c(Hi, "formatMappingOptionLabel");
function pl(t, e) {
  if (!t || typeof t != "object" || !Array.isArray(t.mappings)) return null;
  const n = Zi(e);
  if (!n) return null;
  const i = t.mappings.find((r) => (r == null ? void 0 : r.key) === n);
  return (i == null ? void 0 : i.id) ?? null;
}
c(pl, "findMappingIdByCategories");
function hr(t, e) {
  return !e || !t || typeof t != "object" || !Array.isArray(t.mappings) ? null : t.mappings.find((n) => (n == null ? void 0 : n.id) === e) ?? null;
}
c(hr, "getMappingById");
function Ep(t) {
  if (!t || typeof t != "object") return "";
  const e = t.current;
  if (e != null && e.mappingId) {
    if (e.mappingId === pe)
      return t != null && t.base ? pe : "";
    if (Array.isArray(t.mappings) && t.mappings.some((n) => n.id === e.mappingId))
      return e.mappingId;
  }
  if (e != null && e.categories) {
    const n = pl(t, e.categories);
    if (n) return n;
  }
  return "";
}
c(Ep, "resolveInitialMappingSelection");
function iu(t, e = {}) {
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
c(iu, "logAppliedColorState");
function Sp(t) {
  t.querySelectorAll("select[data-category-id]").forEach((e) => {
    e.value = "";
  });
}
c(Sp, "resetCategorySelections");
function Cp(t, e) {
  const n = e && typeof e == "object" ? e : {};
  t.querySelectorAll("select[data-category-id]").forEach((i) => {
    const r = i.dataset.categoryId;
    if (!r) return;
    const a = n[r];
    i.value = typeof a == "string" ? a : "";
  });
}
c(Cp, "setCategorySelections");
function Tp(t) {
  const e = {};
  return t.querySelectorAll("select[data-category-id]").forEach((n) => {
    var a, o;
    const i = n.dataset.categoryId, r = (o = (a = n.value) == null ? void 0 : a.trim) == null ? void 0 : o.call(a);
    !i || !r || (e[i] = r);
  }), Object.keys(e).length > 0 ? e : null;
}
c(Tp, "readCategorySelections");
async function ps(t, e, n) {
  if (!t) return null;
  try {
    if (!n)
      return await mr(t, {});
    if (n === pe)
      return await mr(t, {
        mappingId: pe,
        categories: null,
        updatedAt: Date.now()
      });
    const i = hr(e, n);
    return i ? await mr(t, {
      mappingId: i.id,
      categories: i.categories,
      updatedAt: Date.now()
    }) : null;
  } catch (i) {
    return console.warn("eidolon-utilities | Failed to persist mapping selection", i), null;
  }
}
c(ps, "persistCurrentSelection");
function dc(t, e) {
  if (!(t instanceof HTMLElement)) return;
  const n = t.querySelector(".eidolon-light-criteria-manager__section.is-bottom");
  n instanceof HTMLElement && (n.hidden = !!(e != null && e.hidden));
}
c(dc, "updateManagerSectionVisibility");
function Yn({ switcher: t, emptyState: e, state: n }) {
  const i = !!(n != null && n.base);
  t instanceof HTMLElement && (t.hidden = !i), e instanceof HTMLElement && (e.hidden = i);
}
c(Yn, "updateActiveMappingVisibility");
function cf(t) {
  const e = (t == null ? void 0 : t.object) ?? (t == null ? void 0 : t.document) ?? null;
  return !(e != null && e.isEmbedded) || e.documentName !== "AmbientLight" ? null : e;
}
c(cf, "getAmbientLightDocument");
function Lp(t) {
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
c(Lp, "getPersistedAmbientLightDocument");
function Ip() {
  tp();
}
c(Ip, "registerLightCriteriaHooks");
Ip();
const yl = /* @__PURE__ */ new Map();
let bl = !1;
function fc(t, e) {
  yl.has(t) && console.warn(`[${T}] Socket handler for type "${t}" already registered, overwriting.`), yl.set(t, e);
}
c(fc, "registerSocketHandler");
function Oa(t, e) {
  if (!bl) {
    console.error(`[${T}] Socket not initialized. Call initializeSocket() first.`);
    return;
  }
  game.socket.emit(`module.${T}`, { type: t, payload: e });
}
c(Oa, "emitSocket");
function Op() {
  bl || (game.socket.on(`module.${T}`, (t) => {
    const { type: e, payload: n } = t ?? {}, i = yl.get(e);
    i ? i(n) : console.warn(`[${T}] No socket handler for type "${e}"`);
  }), bl = !0, console.log(`[${T}] Socket initialized on channel module.${T}`));
}
c(Op, "initializeSocket");
const uf = "tween", df = "tween-sequence", vl = "tween-sequence-cancel", Ce = Object.freeze({
  ABORT: "abort",
  CONTINUE: "continue"
}), pn = Object.freeze({
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  FAILED: "failed"
}), pt = Object.freeze({
  BEFORE_ALL: "beforeAll",
  BEFORE_STEP: "before",
  ENTRY: "entry",
  AFTER_STEP: "after",
  RUNTIME: "runtime",
  VALIDATION: "validation",
  AWAIT: "await",
  EMIT: "emit",
  PARALLEL: "parallel"
}), Ya = /* @__PURE__ */ new Map();
function $t({ type: t, execute: e, validate: n }) {
  Ya.has(t) && console.warn(`[tween-registry] Type "${t}" already registered, overwriting.`), Ya.set(t, { type: t, execute: e, validate: n ?? (() => {
  }) });
}
c($t, "registerTweenType");
function Ci(t) {
  return Ya.get(t);
}
c(Ci, "getTweenType");
function Ap(t, e = {}) {
  const n = Ci(t);
  if (!n)
    throw new Error(`Unknown tween type: "${t}".`);
  return n.validate(e ?? {}), n;
}
c(Ap, "validateTweenEntry");
function wl() {
  return [...Ya.keys()];
}
c(wl, "listTweenTypes");
const qi = {
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
  easeInBounce: /* @__PURE__ */ c((t) => 1 - qi.easeOutBounce(1 - t), "easeInBounce"),
  easeInOutBounce: /* @__PURE__ */ c((t) => t < 0.5 ? (1 - qi.easeOutBounce(1 - 2 * t)) / 2 : (1 + qi.easeOutBounce(2 * t - 1)) / 2, "easeInOutBounce"),
  easeInElastic: /* @__PURE__ */ c((t) => t === 0 || t === 1 ? t : -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI), "easeInElastic"),
  easeOutElastic: /* @__PURE__ */ c((t) => t === 0 || t === 1 ? t : Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1, "easeOutElastic")
};
function Yt(t) {
  if (t && qi[t])
    return qi[t];
  const e = foundry.canvas.animation.CanvasAnimation;
  return {
    linear: e.easeLinear,
    easeInOutCosine: e.easeInOutCosine
  }[t] ?? e.easeInOutCosine;
}
c(Yt, "resolveEasing");
function Wo() {
  return ["linear", "easeInOutCosine", ...Object.keys(qi)];
}
c(Wo, "listEasingNames");
function Ka(t) {
  return t <= 0.04045 ? t / 12.92 : ((t + 0.055) / 1.055) ** 2.4;
}
c(Ka, "srgbToLinear");
function ji(t) {
  return t <= 31308e-7 ? 12.92 * t : 1.055 * t ** (1 / 2.4) - 0.055;
}
c(ji, "linearToSrgb");
function ru(t, e, n) {
  const i = 0.4122214708 * t + 0.5363325363 * e + 0.0514459929 * n, r = 0.2119034982 * t + 0.6806995451 * e + 0.1073969566 * n, a = 0.0883024619 * t + 0.2817188376 * e + 0.6299787005 * n, o = Math.cbrt(i), s = Math.cbrt(r), l = Math.cbrt(a);
  return [
    0.2104542553 * o + 0.793617785 * s - 0.0040720468 * l,
    1.9779984951 * o - 2.428592205 * s + 0.4505937099 * l,
    0.0259040371 * o + 0.7827717662 * s - 0.808675766 * l
  ];
}
c(ru, "linearRgbToOklab");
function kp(t, e, n) {
  const i = (t + 0.3963377774 * e + 0.2158037573 * n) ** 3, r = (t - 0.1055613458 * e - 0.0638541728 * n) ** 3, a = (t - 0.0894841775 * e - 1.291485548 * n) ** 3;
  return [
    4.0767416621 * i - 3.3077115913 * r + 0.2309699292 * a,
    -1.2684380046 * i + 2.6097574011 * r - 0.3413193965 * a,
    -0.0041960863 * i - 0.7034186147 * r + 1.707614701 * a
  ];
}
c(kp, "oklabToLinearRgb");
function Ja(t) {
  return [t.r, t.g, t.b];
}
c(Ja, "colorToRgb");
function ff(t, e, n) {
  const i = /* @__PURE__ */ c((a) => Math.max(0, Math.min(1, a)), "clamp"), r = /* @__PURE__ */ c((a) => Math.round(i(a) * 255).toString(16).padStart(2, "0"), "toHex");
  return `#${r(t)}${r(e)}${r(n)}`;
}
c(ff, "rgbToHex");
function Mp(t, e, n) {
  if (n <= 0) return t.toHTML();
  if (n >= 1) return e.toHTML();
  const i = foundry.utils.Color, [r, a, o] = t.hsl, [s, l, u] = e.hsl, d = (s - r + 0.5) % 1 - 0.5, h = (r + d * n + 1) % 1, f = a + (l - a) * n, g = o + (u - o) * n;
  return i.fromHSL([h, f, g]).toHTML();
}
c(Mp, "interpolateHsl");
function Np(t, e, n) {
  if (n <= 0) return t.toHTML();
  if (n >= 1) return e.toHTML();
  const [i, r, a] = Ja(t).map(Ka), [o, s, l] = Ja(e).map(Ka), u = ji(i + (o - i) * n), d = ji(r + (s - r) * n), h = ji(a + (l - a) * n);
  return ff(u, d, h);
}
c(Np, "interpolateRgb");
function _p(t, e, n) {
  if (n <= 0) return t.toHTML();
  if (n >= 1) return e.toHTML();
  const [i, r, a] = Ja(t).map(Ka), [o, s, l] = Ja(e).map(Ka), [u, d, h] = ru(i, r, a), [f, g, p] = ru(o, s, l), y = 0.02, w = Math.sqrt(d * d + h * h), v = Math.sqrt(g * g + p * p);
  let b, E, L;
  if (w < y || v < y)
    b = u + (f - u) * n, E = d + (g - d) * n, L = h + (p - h) * n;
  else {
    const x = Math.atan2(h, d);
    let D = Math.atan2(p, g) - x;
    D > Math.PI && (D -= 2 * Math.PI), D < -Math.PI && (D += 2 * Math.PI), b = u + (f - u) * n;
    const F = w + (v - w) * n, _ = x + D * n;
    E = F * Math.cos(_), L = F * Math.sin(_);
  }
  const [A, O, M] = kp(b, E, L);
  return ff(ji(A), ji(O), ji(M));
}
c(_p, "interpolateOklch");
const El = {
  hsl: Mp,
  rgb: Np,
  oklch: _p
};
function mf(t = "hsl") {
  return El[t] ?? El.hsl;
}
c(mf, "getInterpolator");
function Wi() {
  return Object.keys(El);
}
c(Wi, "listInterpolationModes");
function $p(t) {
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
  if (t.mode && !Wi().includes(t.mode))
    throw new Error(
      `light-color tween: unknown mode "${t.mode}". Available: ${Wi().join(", ")}`
    );
}
c($p, "validate$7");
async function xp(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { Color: i } = foundry.utils, { uuid: r, toColor: a, toAlpha: o, mode: s = "oklch" } = t, l = Array.isArray(r) ? r : [r];
  if (l.length === 0)
    return console.warn("light-color tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: u = 2e3,
    easing: d = "easeInOutCosine",
    commit: h = !0,
    startEpochMS: f = null,
    signal: g = null
  } = e, p = Yt(d), y = a != null, w = o != null, v = y ? mf(s) : null, b = y ? i.fromString(a) : null;
  if (y && !b.valid) throw new Error(`light-color tween: invalid target color "${a}".`);
  async function E(A) {
    var W, q;
    if (g != null && g.aborted) return !1;
    const O = await fromUuid(A);
    if (!O) return !1;
    const M = O.object;
    if (!M) return !1;
    let x;
    if (y) {
      const U = (W = O.config) == null ? void 0 : W.color;
      U != null && U.valid || console.warn(`light-color tween: source color invalid on ${A}, using white.`), x = U != null && U.valid ? U : i.fromString("#ffffff");
    }
    const R = w ? ((q = O._source.config) == null ? void 0 : q.alpha) ?? 0.5 : null, D = { t: 0 }, F = `ambient-hue-tween:${A}`;
    n.terminateAnimation(F), g && g.addEventListener("abort", () => {
      n.terminateAnimation(F);
    }, { once: !0 });
    const _ = typeof f == "number" ? Math.max(0, Math.min(u, Date.now() - f)) : 0, H = /* @__PURE__ */ c((U) => {
      const K = {};
      y && (K.color = v(x, b, U)), w && (K.alpha = R + (o - R) * U), O.updateSource({ config: K }), M.initializeLightSource();
    }, "applyFrame");
    _ > 0 && (D.t = _ / u, H(D.t));
    const B = await n.animate(
      [{ parent: D, attribute: "t", to: 1 }],
      {
        name: F,
        duration: u,
        easing: p,
        time: _,
        ontick: /* @__PURE__ */ c(() => H(D.t), "ontick")
      }
    );
    if (B !== !1) {
      if (g != null && g.aborted) return !1;
      const U = {};
      y && (U.color = b.toHTML()), w && (U.alpha = o), O.updateSource({ config: U }), M.initializeLightSource();
    }
    if (h && B !== !1 && O.canUserModify(game.user, "update")) {
      if (g != null && g.aborted) return !1;
      const U = {}, K = {};
      y && (U.color = x.toHTML(), K["config.color"] = b.toHTML()), w && (U.alpha = R, K["config.alpha"] = o), O.updateSource({ config: U }), await O.update(K);
    }
    return B !== !1;
  }
  return c(E, "animateOne"), (await Promise.all(l.map(E))).every(Boolean);
}
c(xp, "execute$7");
function Fp() {
  $t({ type: "light-color", execute: xp, validate: $p });
}
c(Fp, "registerLightColorTween");
const yn = /* @__PURE__ */ new WeakMap();
function Dp(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("light-state tween: 'uuid' is required (string or array of AmbientLight document UUIDs).");
  if (typeof t.enabled != "boolean")
    throw new Error("light-state tween: 'enabled' (boolean) is required.");
}
c(Dp, "validate$6");
async function Pp(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, enabled: r } = t, a = Array.isArray(i) ? i : [i];
  if (a.length === 0)
    return console.warn("light-state tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: o = 2e3,
    easing: s = "easeInOutCosine",
    commit: l = !0,
    startEpochMS: u = null,
    signal: d = null
  } = e, h = Yt(s);
  async function f(p) {
    var O, M, x, R;
    if (d != null && d.aborted) return !1;
    const y = await fromUuid(p);
    if (!y) return !1;
    const w = y.object;
    if (!w) return !1;
    const v = `ambient-state-tween:${p}`;
    n.terminateAnimation(v), d && d.addEventListener("abort", () => {
      n.terminateAnimation(v);
    }, { once: !0 });
    const b = yn.get(y) ?? {
      hidden: y._source.hidden,
      alpha: ((O = y._source.config) == null ? void 0 : O.alpha) ?? 0.5
    };
    if (yn.set(y, b), N(`light-state START ${r ? "ON" : "OFF"} | snap: ${JSON.stringify(b)} | _source.hidden=${y._source.hidden}, _source.config.alpha=${(M = y._source.config) == null ? void 0 : M.alpha}`), r && !b.hidden || !r && b.hidden)
      return yn.delete(y), !0;
    const E = b.alpha, L = typeof u == "number" ? Math.max(0, Math.min(o, Date.now() - u)) : 0, A = /* @__PURE__ */ c((D) => {
      y.updateSource({ config: { alpha: D } }), w.initializeLightSource();
    }, "applyAlpha");
    if (r) {
      y.updateSource({ hidden: !1, config: { alpha: 0 } }), w.initializeLightSource(), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
      const D = { t: 0 };
      L > 0 && (D.t = L / o, A(E * D.t));
      const F = await n.animate(
        [{ parent: D, attribute: "t", to: 1 }],
        {
          name: v,
          duration: o,
          easing: h,
          time: L,
          ontick: /* @__PURE__ */ c(() => A(E * D.t), "ontick")
        }
      );
      return F !== !1 && !(d != null && d.aborted) && l && y.canUserModify(game.user, "update") ? (y.updateSource({ hidden: !0, config: { alpha: E } }), await y.update({ hidden: !1 }), N(`light-state FADE-IN committed. _source.hidden=${y._source.hidden}, _source.config.alpha=${(x = y._source.config) == null ? void 0 : x.alpha}`), yn.delete(y)) : F === !1 || yn.delete(y), F !== !1;
    } else {
      y.updateSource({ hidden: !1, config: { alpha: b.alpha } }), w.initializeLightSource();
      const D = { t: 0 };
      L > 0 && (D.t = L / o, A(E * (1 - D.t)));
      const F = await n.animate(
        [{ parent: D, attribute: "t", to: 1 }],
        {
          name: v,
          duration: o,
          easing: h,
          time: L,
          ontick: /* @__PURE__ */ c(() => A(E * (1 - D.t)), "ontick")
        }
      );
      return F !== !1 && !(d != null && d.aborted) && l && y.canUserModify(game.user, "update") ? (await y.update({ hidden: !0 }), y.updateSource({ config: { alpha: E } }), w.initializeLightSource(), N(`light-state FADE-OUT committed+restored. _source.hidden=${y._source.hidden}, _source.config.alpha=${(R = y._source.config) == null ? void 0 : R.alpha}`), yn.delete(y)) : F === !1 || (y.updateSource({ hidden: !0, config: { alpha: E } }), w.initializeLightSource(), yn.delete(y)), F !== !1;
    }
  }
  return c(f, "animateOne"), (await Promise.all(a.map(f))).every(Boolean);
}
c(Pp, "execute$6");
function Rp() {
  $t({ type: "light-state", execute: Pp, validate: Dp });
}
c(Rp, "registerLightStateTween");
function Yo(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("tile-prop tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (!t.attribute || typeof t.attribute != "string")
    throw new Error("tile-prop tween: 'attribute' (string) is required — dot-path to a numeric property (e.g. 'alpha', 'rotation').");
  if (typeof t.value != "number")
    throw new Error("tile-prop tween: 'value' (number) is required — the target value to animate to.");
}
c(Yo, "validate$5");
async function Ko(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, attribute: r, value: a } = t, o = Array.isArray(i) ? i : [i];
  if (o.length === 0)
    return console.warn("tile-prop tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: s = 2e3,
    easing: l = "easeInOutCosine",
    commit: u = !0,
    startEpochMS: d = null,
    signal: h = null
  } = e, f = Yt(l);
  async function g(y) {
    if (h != null && h.aborted) return !1;
    const w = await fromUuid(y);
    if (!w) return !1;
    const v = w.object;
    if (!v) return !1;
    const b = foundry.utils.getProperty(w._source, r);
    if (typeof b != "number")
      return console.warn(`tile-prop tween: source value at '${r}' on ${y} is not a number (got ${typeof b}). Skipping.`), !1;
    const E = `tile-prop-tween:${r}:${y}`;
    n.terminateAnimation(E), h && h.addEventListener("abort", () => {
      n.terminateAnimation(E);
    }, { once: !0 });
    const L = typeof d == "number" ? Math.max(0, Math.min(s, Date.now() - d)) : 0, A = /* @__PURE__ */ c((x) => {
      const R = b + (a - b) * x;
      w.updateSource(foundry.utils.expandObject({ [r]: R })), v.refresh();
    }, "applyFrame"), O = { t: 0 };
    L > 0 && (O.t = L / s, A(O.t));
    const M = await n.animate(
      [{ parent: O, attribute: "t", to: 1 }],
      {
        name: E,
        duration: s,
        easing: f,
        time: L,
        ontick: /* @__PURE__ */ c(() => A(O.t), "ontick")
      }
    );
    if (M !== !1) {
      if (h != null && h.aborted) return !1;
      w.updateSource(foundry.utils.expandObject({ [r]: a })), v.refresh();
    }
    if (u && M !== !1 && w.canUserModify(game.user, "update")) {
      if (h != null && h.aborted) return !1;
      w.updateSource(foundry.utils.expandObject({ [r]: b })), await w.update({ [r]: a });
    }
    return M !== !1;
  }
  return c(g, "animateOne"), (await Promise.all(o.map(g))).every(Boolean);
}
c(Ko, "execute$5");
function Hp() {
  $t({ type: "tile-prop", execute: Ko, validate: Yo });
}
c(Hp, "registerTilePropTween");
function qp(t) {
  if (!t.attribute || typeof t.attribute != "string")
    throw new Error("particles-prop tween: 'attribute' (string) is required — property name on canvas.particleeffects (e.g. 'alpha').");
  if (typeof t.value != "number")
    throw new Error("particles-prop tween: 'value' (number) is required — the target value to animate to.");
}
c(qp, "validate$4");
async function jp(t, e = {}) {
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
  const h = Yt(o), f = `particles-prop-tween:${i}`;
  n.terminateAnimation(f), l && l.addEventListener("abort", () => {
    n.terminateAnimation(f);
  }, { once: !0 });
  const g = typeof s == "number" ? Math.max(0, Math.min(a, Date.now() - s)) : 0, p = /* @__PURE__ */ c((v) => {
    u[i] = d + (r - d) * v;
  }, "applyFrame"), y = { t: 0 };
  g > 0 && (y.t = g / a, p(y.t));
  const w = await n.animate(
    [{ parent: y, attribute: "t", to: 1 }],
    {
      name: f,
      duration: a,
      easing: h,
      time: g,
      ontick: /* @__PURE__ */ c(() => p(y.t), "ontick")
    }
  );
  if (w !== !1) {
    if (l != null && l.aborted) return !1;
    u[i] = r;
  }
  return w !== !1;
}
c(jp, "execute$4");
function Bp() {
  $t({ type: "particles-prop", execute: jp, validate: qp });
}
c(Bp, "registerParticlesPropTween");
var Cn, xr, Fr, Dr, Pr, Rr, Ui;
const Lc = class Lc {
  /**
   * @param {AbortController} controller
   */
  constructor(e) {
    k(this, Cn);
    k(this, xr);
    k(this, Fr);
    k(this, Dr);
    k(this, Pr);
    k(this, Rr, !1);
    k(this, Ui, null);
    I(this, Cn, e), I(this, Dr, new Promise((n) => {
      I(this, xr, n);
    })), I(this, Pr, new Promise((n) => {
      I(this, Fr, n);
    }));
  }
  /** @returns {Promise<boolean>} Resolves true (completed) or false (cancelled/failed). */
  get finished() {
    return m(this, Dr);
  }
  /** @returns {Promise<{status: string, [k: string]: unknown}>} */
  get result() {
    return m(this, Pr);
  }
  /** @returns {boolean} */
  get cancelled() {
    return m(this, Cn).signal.aborted;
  }
  /** @returns {AbortSignal} */
  get signal() {
    return m(this, Cn).signal;
  }
  /** @returns {string} */
  get status() {
    return m(this, Ui) ? m(this, Ui).status : this.cancelled ? "cancelled" : "running";
  }
  /** Abort the timeline, triggering onCancel callbacks. */
  cancel(e = "cancelled") {
    m(this, Cn).signal.aborted || m(this, Cn).abort(e);
  }
  /**
   * Called internally by the execution engine when the timeline finishes.
   * @param {boolean} completed - true if all steps ran, false if cancelled
   */
  _resolve(e) {
    if (m(this, Rr)) return;
    I(this, Rr, !0);
    const n = typeof e == "boolean" ? { status: e ? "completed" : "cancelled" } : e ?? { status: "cancelled" };
    I(this, Ui, n), m(this, xr).call(this, n.status === "completed"), m(this, Fr).call(this, n);
  }
};
Cn = new WeakMap(), xr = new WeakMap(), Fr = new WeakMap(), Dr = new WeakMap(), Pr = new WeakMap(), Rr = new WeakMap(), Ui = new WeakMap(), c(Lc, "TimelineHandle");
let Sl = Lc;
var li, Vi, ci;
const Ic = class Ic {
  constructor() {
    /** @type {Map<string, Set<Function>>} */
    k(this, li, /* @__PURE__ */ new Map());
    /** @type {Set<string>} Signals that have been emitted (sticky) */
    k(this, Vi, /* @__PURE__ */ new Set());
    k(this, ci, !1);
  }
  /**
   * Subscribe to a named signal.
   * @param {string} signal
   * @param {Function} listener
   * @returns {() => void} Unsubscribe function
   */
  on(e, n) {
    if (m(this, ci)) return () => {
    };
    let i = m(this, li).get(e);
    return i || (i = /* @__PURE__ */ new Set(), m(this, li).set(e, i)), i.add(n), () => i.delete(n);
  }
  /**
   * Fire a named signal synchronously. All registered listeners are invoked.
   * The signal is recorded so that future waitFor() calls resolve immediately.
   * @param {string} signal
   */
  emit(e) {
    if (m(this, ci)) return;
    m(this, Vi).add(e);
    const n = m(this, li).get(e);
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
    return m(this, ci) ? Promise.reject(new Error("EventBus destroyed")) : m(this, Vi).has(e) ? Promise.resolve() : new Promise((i, r) => {
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
    I(this, ci, !0), m(this, li).clear(), m(this, Vi).clear();
  }
};
li = new WeakMap(), Vi = new WeakMap(), ci = new WeakMap(), c(Ic, "EventBus");
let Cl = Ic;
const hf = /* @__PURE__ */ new Map();
function Jo(t, e) {
  hf.set(t, e);
}
c(Jo, "registerAwaitProvider");
function Tl(t, e) {
  const n = hf.get(t.event);
  return n ? n(t, e) : Promise.reject(new Error(`Unknown await event type: "${t.event}"`));
}
c(Tl, "createAwaitPromise");
Jo("signal", (t, e) => t.name ? e.eventBus.waitFor(t.name, e.signal) : Promise.reject(new Error('await signal: "name" is required')));
Jo("click", (t, e) => new Promise((n, i) => {
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
Jo("keypress", (t, e) => new Promise((n, i) => {
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
const _i = /* @__PURE__ */ new Map();
function Up(t, e) {
  const n = _i.get(t);
  n && !n.cancelled && n.cancel("replaced-by-name"), _i.set(t, e), e.finished.then(() => {
    _i.get(t) === e && _i.delete(t);
  });
}
c(Up, "registerTimeline");
function gf(t) {
  const e = _i.get(t);
  return e && !e.cancelled ? (e.cancel("cancelled-by-name"), !0) : !1;
}
c(gf, "cancelTimeline");
function Vp(t) {
  return _i.get(t);
}
c(Vp, "getTimeline");
function au(t, e) {
  return t <= 0 ? Promise.resolve() : new Promise((n, i) => {
    if (e.aborted) return i(e.reason);
    const r = setTimeout(n, t);
    e.addEventListener("abort", () => {
      clearTimeout(r), i(e.reason);
    }, { once: !0 });
  });
}
c(au, "cancellableDelay");
var qe, Tn, Hr, qr;
const Oc = class Oc {
  constructor(e) {
    /** @type {TweenTimeline} */
    k(this, qe);
    /** @type {Array<{ type: string, params: object, opts?: object, detach: boolean }>} */
    k(this, Tn, []);
    /** @type {Function|null} */
    k(this, Hr, null);
    /** @type {Function|null} */
    k(this, qr, null);
    I(this, qe, e);
  }
  /**
   * Add a tween entry to this step.
   * @param {string} type  Registered tween type name
   * @param {object} params  Type-specific parameters
   * @param {object} [opts]  Options (durationMS, easing, etc.)
   * @returns {StepBuilder} this
   */
  add(e, n, i) {
    return m(this, Tn).push({ type: e, params: n, opts: i ?? {}, detach: !1 }), this;
  }
  /**
   * Mark the last entry as fire-and-forget (does not block step progression).
   * @returns {StepBuilder} this
   */
  detach() {
    if (m(this, Tn).length === 0)
      throw new Error("StepBuilder.detach(): no entry to detach.");
    return m(this, Tn)[m(this, Tn).length - 1].detach = !0, this;
  }
  /**
   * Callback invoked before this step's tweens start.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  before(e) {
    return I(this, Hr, e), this;
  }
  /**
   * Callback invoked after this step's awaited tweens complete.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  after(e) {
    return I(this, qr, e), this;
  }
  // ── Delegation to parent TweenTimeline for fluent chaining ──
  /** Start a new step (finalizes this one). */
  step() {
    return m(this, qe).step();
  }
  /** Insert a delay between steps. */
  delay(e) {
    return m(this, qe).delay(e);
  }
  /** Insert an await segment. */
  await(e) {
    return m(this, qe).await(e);
  }
  /** Insert an emit segment. */
  emit(e) {
    return m(this, qe).emit(e);
  }
  /** Insert a parallel segment. */
  parallel(e, n) {
    return m(this, qe).parallel(e, n);
  }
  /** Register onComplete callback. */
  onComplete(e) {
    return m(this, qe).onComplete(e);
  }
  /** Register onCancel callback. */
  onCancel(e) {
    return m(this, qe).onCancel(e);
  }
  /** Register onError callback. */
  onError(e) {
    return m(this, qe).onError(e);
  }
  /** Execute the timeline. */
  run(e) {
    return m(this, qe).run(e);
  }
  /** Serialize the timeline. */
  toJSON() {
    return m(this, qe).toJSON();
  }
  // ── Internal access ──
  /** @returns {{ entries: Array, before: Function|null, after: Function|null }} */
  _finalize() {
    return {
      entries: m(this, Tn),
      before: m(this, Hr),
      after: m(this, qr)
    };
  }
};
qe = new WeakMap(), Tn = new WeakMap(), Hr = new WeakMap(), qr = new WeakMap(), c(Oc, "StepBuilder");
let Ll = Oc;
var je, Ie, Ct, Ln, jr, Br, Ur, Vr, jn, Il, J, en, Ol, pf, Al, yf, bf, Aa, st, Dt;
const rn = class rn {
  constructor() {
    k(this, J);
    /** @type {string|null} */
    k(this, je, null);
    /** @type {string} */
    k(this, Ie, Ce.ABORT);
    /** @type {Array<object>} */
    k(this, Ct, []);
    /** @type {StepBuilder|null} */
    k(this, Ln, null);
    /** @type {Function|null} */
    k(this, jr, null);
    /** @type {Function|null} */
    k(this, Br, null);
    /** @type {Function|null} */
    k(this, Ur, null);
    /** @type {Function|null} */
    k(this, Vr, null);
  }
  /**
   * Register this timeline in the named registry. Starting a new
   * timeline with the same name cancels the previous one.
   * @param {string} name
   * @returns {TweenTimeline} this
   */
  name(e) {
    return I(this, je, e), this;
  }
  /**
   * Set the error policy for step execution.
   * @param {"abort"|"continue"} policy
   * @returns {TweenTimeline} this
   */
  errorPolicy(e) {
    if (e !== Ce.ABORT && e !== Ce.CONTINUE)
      throw new Error(`Invalid error policy: "${e}". Use "abort" or "continue".`);
    return I(this, Ie, e), this;
  }
  /**
   * Start a new step. Finalizes the previous step if one is open.
   * @returns {StepBuilder}
   */
  step() {
    return C(this, J, en).call(this), I(this, Ln, new Ll(this)), m(this, Ln);
  }
  /**
   * Insert a delay (in ms) between the previous step and the next.
   * @param {number} ms
   * @returns {TweenTimeline} this
   */
  delay(e) {
    return C(this, J, en).call(this), m(this, Ct).push({ kind: "delay", ms: e }), this;
  }
  /**
   * Pause execution until an event occurs.
   * @param {object} config  e.g. { event: "click" }, { event: "signal", name: "fog-done" }
   * @returns {TweenTimeline} this
   */
  await(e) {
    return C(this, J, en).call(this), m(this, Ct).push({ kind: "await", config: e }), this;
  }
  /**
   * Fire a named signal (instant, non-blocking).
   * @param {string} signal  Signal name
   * @returns {TweenTimeline} this
   */
  emit(e) {
    return C(this, J, en).call(this), m(this, Ct).push({ kind: "emit", signal: e }), this;
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
    C(this, J, en).call(this);
    const i = n.join ?? "all", r = n.overflow ?? "detach";
    if (i !== "all" && i !== "any" && (typeof i != "number" || i < 1 || i > e.length))
      throw new Error(`parallel: join must be "all", "any", or 1..${e.length}, got ${JSON.stringify(i)}`);
    if (r !== "detach" && r !== "cancel")
      throw new Error(`parallel: overflow must be "detach" or "cancel", got ${JSON.stringify(r)}`);
    const a = e.map((o) => {
      var l;
      const s = new rn();
      return o(s), C(l = s, J, en).call(l), m(s, Ct);
    });
    return m(this, Ct).push({ kind: "parallel", branches: a, join: i, overflow: r }), this;
  }
  /**
   * Callback invoked before the first step runs.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  beforeAll(e) {
    return I(this, jr, e), this;
  }
  /**
   * Callback invoked on successful completion.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onComplete(e) {
    return I(this, Br, e), this;
  }
  /**
   * Callback invoked on cancellation (mutually exclusive with onComplete).
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onCancel(e) {
    return I(this, Ur, e), this;
  }
  /**
   * Callback invoked on runtime failure (mutually exclusive with onComplete/onCancel).
   * @param {(outcome: object) => void} fn
   * @returns {TweenTimeline} this
   */
  onError(e) {
    return I(this, Vr, e), this;
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
    C(this, J, en).call(this);
    const n = new AbortController();
    e.signal && (e.signal.aborted ? n.abort(e.signal.reason ?? "parent-aborted") : e.signal.addEventListener("abort", () => {
      n.signal.aborted || n.abort(e.signal.reason ?? "parent-aborted");
    }, { once: !0 }));
    const i = new Sl(n);
    m(this, je) && Up(m(this, je), i);
    const r = e.broadcast ?? game.user.isGM, a = e.commit ?? game.user.isGM, o = e.startEpochMS ?? Date.now();
    r && m(this, je) && Oa(df, {
      name: m(this, je),
      data: this.toJSON(),
      startEpochMS: o
    });
    const s = new Cl(), l = {
      signal: i.signal,
      commit: a,
      startEpochMS: o,
      eventBus: s,
      errors: [],
      detachedPromises: []
    };
    return C(this, J, pf).call(this, i, l).then((u) => {
      var d, h, f;
      s.destroy(), i._resolve(u), u.status === pn.COMPLETED ? (d = m(this, Br)) == null || d.call(this) : u.status === pn.CANCELLED ? ((h = m(this, Ur)) == null || h.call(this), r && m(this, je) && Oa(vl, {
        name: m(this, je),
        reason: u.reason
      })) : ((f = m(this, Vr)) == null || f.call(this, u), r && m(this, je) && Oa(vl, {
        name: m(this, je),
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
    C(this, J, en).call(this);
    const n = { timeline: C(i = rn, jn, Il).call(i, m(this, Ct)) };
    return m(this, je) && (n.name = m(this, je)), m(this, Ie) !== Ce.ABORT && (n.errorPolicy = m(this, Ie)), n;
  }
};
je = new WeakMap(), Ie = new WeakMap(), Ct = new WeakMap(), Ln = new WeakMap(), jr = new WeakMap(), Br = new WeakMap(), Ur = new WeakMap(), Vr = new WeakMap(), jn = new WeakSet(), Il = /* @__PURE__ */ c(function(e) {
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
            return C(a = rn, jn, Il).call(a, r);
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
en = /* @__PURE__ */ c(function() {
  m(this, Ln) && (m(this, Ct).push({ kind: "step", data: m(this, Ln)._finalize() }), I(this, Ln, null));
}, "#finalizeCurrentStep"), Ol = /* @__PURE__ */ c(function(e) {
  e.length !== 0 && Promise.allSettled(e).catch(() => {
  });
}, "#drainDetached"), pf = /* @__PURE__ */ c(async function(e, n) {
  var i, r;
  try {
    if (n.signal.aborted) return C(this, J, st).call(this, n.signal.reason);
    const a = await C(this, J, Aa).call(this, m(this, jr), pt.BEFORE_ALL, null);
    if (a) {
      if (m(this, Ie) === Ce.ABORT) return a;
      n.errors.push(a);
    }
    const o = await C(this, J, Al).call(this, m(this, Ct), n);
    if (o)
      return C(i = rn, jn, Ol).call(i, n.detachedPromises), o;
    if (!n.signal.aborted) {
      const s = await Promise.allSettled(n.detachedPromises);
      for (const l of s)
        if (l.status === "rejected") {
          const u = C(this, J, Dt).call(this, l.reason, pt.ENTRY);
          if (m(this, Ie) === Ce.ABORT) return u;
          n.errors.push(u);
        }
    }
    return n.signal.aborted ? C(this, J, st).call(this, n.signal.reason) : {
      status: pn.COMPLETED,
      ...n.errors.length > 0 ? { errors: n.errors } : {}
    };
  } catch (a) {
    return C(r = rn, jn, Ol).call(r, n.detachedPromises), n.signal.aborted ? C(this, J, st).call(this, n.signal.reason) : (console.error("TweenTimeline execution error:", a), C(this, J, Dt).call(this, a, pt.RUNTIME));
  }
}, "#execute"), Al = /* @__PURE__ */ c(async function(e, n) {
  let i = -1, r = 0;
  for (const a of e) {
    if (n.signal.aborted) return C(this, J, st).call(this, n.signal.reason);
    if (a.kind === "delay") {
      try {
        await au(a.ms, n.signal);
      } catch {
        return C(this, J, st).call(this, n.signal.reason);
      }
      r += a.ms;
      continue;
    }
    if (a.kind === "await") {
      try {
        let p = Tl(a.config, {
          signal: n.signal,
          eventBus: n.eventBus
        });
        const y = a.config.timeout;
        typeof y == "number" && y > 0 && (p = Promise.race([
          p,
          au(y, n.signal)
        ])), await p;
      } catch (p) {
        if (n.signal.aborted) return C(this, J, st).call(this, n.signal.reason);
        const y = C(this, J, Dt).call(this, p, pt.AWAIT);
        if (m(this, Ie) === Ce.ABORT) return y;
        n.errors.push(y);
      }
      continue;
    }
    if (a.kind === "emit") {
      try {
        n.eventBus.emit(a.signal);
      } catch (p) {
        const y = C(this, J, Dt).call(this, p, pt.EMIT);
        if (m(this, Ie) === Ce.ABORT) return y;
        n.errors.push(y);
      }
      continue;
    }
    if (a.kind === "parallel") {
      const p = await C(this, J, yf).call(this, a, n, r);
      if (p) return p;
      continue;
    }
    i += 1;
    const { entries: o, before: s, after: l } = a.data, u = await C(this, J, Aa).call(this, s, pt.BEFORE_STEP, i);
    if (u) {
      if (m(this, Ie) === Ce.ABORT) return u;
      n.errors.push(u);
      continue;
    }
    if (n.signal.aborted) return C(this, J, st).call(this, n.signal.reason);
    const d = [];
    let h = 0;
    for (const p of o) {
      const y = Ci(p.type);
      if (!y) {
        const E = C(this, J, Dt).call(this, new Error(`TweenTimeline: unknown tween type "${p.type}"`), pt.ENTRY, i, p.type);
        if (m(this, Ie) === Ce.ABORT) return E;
        n.errors.push(E), console.warn(E.error.message);
        continue;
      }
      const w = {
        ...p.opts,
        commit: n.commit,
        startEpochMS: n.startEpochMS + r,
        signal: n.signal
      }, v = w.durationMS ?? 2e3, b = Promise.resolve().then(() => y.execute(p.params, w)).then((E) => E === !1 ? {
        ok: !1,
        failure: C(this, J, Dt).call(this, new Error("Tween entry returned false."), pt.ENTRY, i, p.type)
      } : { ok: !0 }).catch((E) => ({
        ok: !1,
        failure: C(this, J, Dt).call(this, E, pt.ENTRY, i, p.type)
      }));
      p.detach ? n.detachedPromises.push(b) : (d.push(b), h = Math.max(h, v));
    }
    const f = await C(this, J, bf).call(this, d, n.signal);
    if (f === null) return C(this, J, st).call(this, n.signal.reason);
    for (const p of f)
      if (!p.ok) {
        if (m(this, Ie) === Ce.ABORT) return p.failure;
        n.errors.push(p.failure), console.warn("TweenTimeline: entry failed:", p.failure.error);
      }
    const g = await C(this, J, Aa).call(this, l, pt.AFTER_STEP, i);
    if (g) {
      if (m(this, Ie) === Ce.ABORT) return g;
      n.errors.push(g);
    }
    if (n.signal.aborted) return C(this, J, st).call(this, n.signal.reason);
    r += h;
  }
  return null;
}, "#executeSegments"), yf = /* @__PURE__ */ c(async function(e, n, i = 0) {
  const { branches: r, join: a, overflow: o } = e, s = r.length, l = a === "all" ? s : a === "any" ? 1 : a, u = r.map(() => {
    const p = new AbortController();
    return n.signal.aborted ? p.abort(n.signal.reason ?? "parent-aborted") : n.signal.addEventListener("abort", () => {
      p.signal.aborted || p.abort(n.signal.reason ?? "parent-aborted");
    }, { once: !0 }), p;
  });
  let d = 0, h = 0;
  const f = new Array(s).fill(null);
  let g;
  return new Promise((p) => {
    let y = !1;
    const w = /* @__PURE__ */ c(() => {
      if (y) return;
      if (d >= l) {
        y = !0, v(), p(null);
        return;
      }
      const b = s - d - h;
      if (d + b < l) {
        y = !0, v();
        const E = f.filter((A) => A && A.status === pn.FAILED).map((A) => A), L = C(this, J, Dt).call(this, new Error(`parallel: join target ${l} impossible (${d} completed, ${h} failed)`), pt.PARALLEL);
        m(this, Ie) === Ce.ABORT ? p(L) : (n.errors.push(L), n.errors.push(...E), p(null));
      }
    }, "checkJoin"), v = /* @__PURE__ */ c(() => {
      if (o === "cancel")
        for (let b = 0; b < s; b++)
          !f[b] && !u[b].signal.aborted && u[b].abort("overflow-cancel");
      for (let b = 0; b < s; b++)
        f[b] || n.detachedPromises.push(g[b]);
    }, "applyOverflow");
    if (g = r.map((b, E) => {
      const L = {
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
      return C(this, J, Al).call(this, b, L).then((A) => {
        if (A)
          if (A.status === pn.CANCELLED) {
            if (u[E].signal.aborted) {
              f[E] = A;
              return;
            }
            f[E] = A, h++;
          } else
            f[E] = A, h++;
        else
          f[E] = { status: pn.COMPLETED }, d++;
        w();
      });
    }), n.signal.aborted) {
      y = !0, p(C(this, J, st).call(this, n.signal.reason));
      return;
    }
    n.signal.addEventListener("abort", () => {
      y || (y = !0, p(C(this, J, st).call(this, n.signal.reason)));
    }, { once: !0 });
  });
}, "#executeParallel"), /**
 * @param {Array<Promise<{ok: boolean, failure?: object}>>} stepPromises
 * @param {AbortSignal} signal
 * @returns {Promise<Array<{ok: boolean, failure?: object}>|null>}
 */
bf = /* @__PURE__ */ c(function(e, n) {
  return e.length === 0 ? Promise.resolve([]) : n.aborted ? Promise.resolve(null) : new Promise((i, r) => {
    const a = /* @__PURE__ */ c(() => i(null), "onAbort");
    n.addEventListener("abort", a, { once: !0 }), Promise.all(e).then((o) => {
      n.removeEventListener("abort", a), i(o);
    }).catch((o) => {
      n.removeEventListener("abort", a), r(o);
    });
  });
}, "#waitForStep"), Aa = /* @__PURE__ */ c(async function(e, n, i) {
  if (!e) return null;
  try {
    return await e(), null;
  } catch (r) {
    const a = C(this, J, Dt).call(this, r, n, i ?? void 0);
    return m(this, Ie) === Ce.CONTINUE && console.warn(`TweenTimeline: hook failure in ${n}:`, r), a;
  }
}, "#runHook"), /** @param {unknown} reason */
st = /* @__PURE__ */ c(function(e) {
  let n;
  return typeof e == "string" ? n = e : e instanceof Error && (n = e.message), {
    status: pn.CANCELLED,
    ...n ? { reason: n } : {}
  };
}, "#cancelledOutcome"), /**
 * @param {unknown} err
 * @param {string} phase
 * @param {number} [stepIndex]
 * @param {string} [entryType]
 */
Dt = /* @__PURE__ */ c(function(e, n, i, r) {
  const a = e instanceof Error ? e : new Error(String(e));
  return {
    status: pn.FAILED,
    error: a,
    phase: n,
    ...typeof i == "number" ? { stepIndex: i } : {},
    ...r ? { entryType: r } : {}
  };
}, "#failedOutcome"), k(rn, jn), c(rn, "TweenTimeline");
let Xa = rn;
function mc(t) {
  if (!t || typeof t != "object")
    throw new Error("Sequence JSON: data must be an object.");
  if (!Array.isArray(t.timeline))
    throw new Error("Sequence JSON: 'timeline' must be an array.");
  if (t.name != null && typeof t.name != "string")
    throw new Error("Sequence JSON: 'name' must be a string.");
  if (t.errorPolicy != null && t.errorPolicy !== Ce.ABORT && t.errorPolicy !== Ce.CONTINUE)
    throw new Error(`Sequence JSON: 'errorPolicy' must be "abort" or "continue".`);
  vf(t.timeline, "timeline", 0);
}
c(mc, "validateSequenceJSON");
function vf(t, e, n = 0) {
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
        vf(d, `${a}.parallel.branches[${u}]`, n + 1);
      }
      continue;
    }
    throw new Error(`Sequence JSON: ${a} is not a recognized segment (step array, delay, await, emit, or parallel).`);
  }
}
c(vf, "validateSegmentsJSON");
function wf(t) {
  mc(t), Ef(t.timeline, "timeline");
}
c(wf, "validateSequenceSemantics");
function Ef(t, e) {
  for (let n = 0; n < t.length; n++) {
    const i = t[n], r = `${e}[${n}]`;
    if (Array.isArray(i))
      for (let a = 0; a < i.length; a++) {
        const o = i[a];
        try {
          Ap(o.type, o.params ?? {});
        } catch (s) {
          throw new Error(`Sequence JSON: ${r}[${a}] failed semantic validation: ${s.message}`);
        }
      }
    else if (i.parallel)
      for (let a = 0; a < i.parallel.branches.length; a++)
        Ef(i.parallel.branches[a], `${r}.parallel.branches[${a}]`);
  }
}
c(Ef, "validateSegmentsSemantics");
function hc(t, e = {}) {
  mc(t), e.validateSemantics && wf(t);
  const n = new Xa();
  return t.name && n.name(t.name), t.errorPolicy && n.errorPolicy(t.errorPolicy), Sf(t.timeline, n), n;
}
c(hc, "compileSequence");
function Sf(t, e) {
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
      const i = n.parallel, r = i.branches.map((a) => (o) => Sf(a, o));
      e.parallel(r, {
        join: i.join ?? "all",
        overflow: i.overflow ?? "detach"
      });
    }
  }
}
c(Sf, "compileSegments");
function Gp(t) {
  mc(t), wf(t);
}
c(Gp, "validate$3");
async function zp(t, e = {}) {
  return hc(t, { validateSemantics: !0 }).run({
    broadcast: !1,
    commit: e.commit,
    startEpochMS: e.startEpochMS,
    signal: e.signal
  }).finished;
}
c(zp, "execute$3");
function Wp() {
  $t({ type: "sequence", execute: zp, validate: Gp });
}
c(Wp, "registerSequenceTween");
function Yp(t) {
  if (t.x == null && t.y == null && t.scale == null)
    throw new Error("camera-pan tween: at least one of 'x', 'y', or 'scale' is required.");
  if (t.x != null && typeof t.x != "number")
    throw new Error("camera-pan tween: 'x' must be a number.");
  if (t.y != null && typeof t.y != "number")
    throw new Error("camera-pan tween: 'y' must be a number.");
  if (t.scale != null && (typeof t.scale != "number" || t.scale <= 0))
    throw new Error("camera-pan tween: 'scale' must be a positive number.");
}
c(Yp, "validate$2");
async function Kp(t, e = {}) {
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
c(Kp, "execute$2");
function Jp() {
  $t({ type: "camera-pan", execute: Kp, validate: Yp });
}
c(Jp, "registerCameraPanTween");
function Xp(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((i) => !i || typeof i != "string"))
    throw new Error("tile-tint tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (t.toColor == null || typeof t.toColor != "string")
    throw new Error("tile-tint tween: 'toColor' (CSS color string) is required.");
  if (!foundry.utils.Color.fromString(t.toColor).valid)
    throw new Error(`tile-tint tween: invalid target color "${t.toColor}".`);
  if (t.mode && !Wi().includes(t.mode))
    throw new Error(
      `tile-tint tween: unknown mode "${t.mode}". Available: ${Wi().join(", ")}`
    );
}
c(Xp, "validate$1");
async function Qp(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { Color: i } = foundry.utils, { uuid: r, toColor: a, mode: o = "oklch" } = t, s = Array.isArray(r) ? r : [r];
  if (s.length === 0)
    return console.warn("tile-tint tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: l = 2e3,
    easing: u = "easeInOutCosine",
    commit: d = !0,
    startEpochMS: h = null,
    signal: f = null
  } = e, g = Yt(u), p = mf(o), y = i.fromString(a);
  if (!y.valid) throw new Error(`tile-tint tween: invalid target color "${a}".`);
  async function w(b) {
    var H, B;
    if (f != null && f.aborted) return !1;
    const E = await fromUuid(b);
    if (!E) return !1;
    const L = E.object;
    if (!L) return !1;
    const A = ((B = (H = E._source) == null ? void 0 : H.texture) == null ? void 0 : B.tint) ?? "#ffffff", O = i.fromString(A);
    O.valid || console.warn(`tile-tint tween: source tint invalid on ${b}, using white.`);
    const M = O.valid ? O : i.fromString("#ffffff"), x = { t: 0 }, R = `tile-tint-tween:${b}`;
    n.terminateAnimation(R), f && f.addEventListener("abort", () => {
      n.terminateAnimation(R);
    }, { once: !0 });
    const D = typeof h == "number" ? Math.max(0, Math.min(l, Date.now() - h)) : 0, F = /* @__PURE__ */ c((W) => {
      const q = p(M, y, W);
      E.updateSource({ texture: { tint: q } }), L.refresh();
    }, "applyFrame");
    D > 0 && (x.t = D / l, F(x.t));
    const _ = await n.animate(
      [{ parent: x, attribute: "t", to: 1 }],
      {
        name: R,
        duration: l,
        easing: g,
        time: D,
        ontick: /* @__PURE__ */ c(() => F(x.t), "ontick")
      }
    );
    if (_ !== !1) {
      if (f != null && f.aborted) return !1;
      E.updateSource({ texture: { tint: y.toHTML() } }), L.refresh();
    }
    if (d && _ !== !1 && E.canUserModify(game.user, "update")) {
      if (f != null && f.aborted) return !1;
      E.updateSource({ texture: { tint: M.toHTML() } }), await E.update({ "texture.tint": y.toHTML() });
    }
    return _ !== !1;
  }
  return c(w, "animateOne"), (await Promise.all(s.map(w))).every(Boolean);
}
c(Qp, "execute$1");
function Zp() {
  $t({ type: "tile-tint", execute: Qp, validate: Xp });
}
c(Zp, "registerTileTintTween");
function ey(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("tile-scale tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (typeof t.toScale != "number" || t.toScale <= 0)
    throw new Error("tile-scale tween: 'toScale' must be a positive number.");
  for (const n of ["baseWidth", "baseHeight", "centerX", "centerY"])
    if (typeof t[n] != "number")
      throw new Error(`tile-scale tween: '${n}' (number) is required.`);
}
c(ey, "validate");
async function ty(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, toScale: r, baseWidth: a, baseHeight: o, centerX: s, centerY: l } = t, u = Array.isArray(i) ? i : [i];
  if (u.length === 0) return !0;
  const {
    durationMS: d = 2e3,
    easing: h = "easeInOutCosine",
    commit: f = !0,
    startEpochMS: g = null,
    signal: p = null
  } = e, y = Yt(h), w = a * r, v = o * r, b = s - w / 2, E = l - v / 2;
  async function L(O) {
    if (p != null && p.aborted) return !1;
    const M = await fromUuid(O);
    if (!M) return !1;
    const x = M.object;
    if (!x) return !1;
    const R = M._source.width, D = M._source.height, F = M._source.x, _ = M._source.y, H = `tile-scale-tween:${O}`;
    n.terminateAnimation(H), p && p.addEventListener("abort", () => {
      n.terminateAnimation(H);
    }, { once: !0 });
    const B = typeof g == "number" ? Math.max(0, Math.min(d, Date.now() - g)) : 0, W = /* @__PURE__ */ c((K) => {
      const ae = R + (w - R) * K, Q = D + (v - D) * K, te = F + (b - F) * K, Kt = _ + (E - _) * K;
      M.updateSource({ width: ae, height: Q, x: te, y: Kt }), x.refresh();
    }, "applyFrame"), q = { t: 0 };
    B > 0 && (q.t = B / d, W(q.t));
    const U = await n.animate(
      [{ parent: q, attribute: "t", to: 1 }],
      {
        name: H,
        duration: d,
        easing: y,
        time: B,
        ontick: /* @__PURE__ */ c(() => W(q.t), "ontick")
      }
    );
    if (U !== !1) {
      if (p != null && p.aborted) return !1;
      M.updateSource({ width: w, height: v, x: b, y: E }), x.refresh();
    }
    if (f && U !== !1 && M.canUserModify(game.user, "update")) {
      if (p != null && p.aborted) return !1;
      M.updateSource({ width: R, height: D, x: F, y: _ }), await M.update({ width: w, height: v, x: b, y: E });
    }
    return U !== !1;
  }
  return c(L, "animateOne"), (await Promise.all(u.map(L))).every(Boolean);
}
c(ty, "execute");
function ny() {
  $t({ type: "tile-scale", execute: ty, validate: ey });
}
c(ny, "registerTileScaleTween");
async function iy(t, e, n = {}) {
  if (!game.user.isGM)
    return ui.notifications.warn("Only the GM can dispatch tweens."), !1;
  const i = Ci(t);
  if (!i)
    throw new Error(`Unknown tween type: "${t}". Registered types: ${wl().join(", ")}`);
  i.validate(e);
  const { durationMS: r = 2e3, easing: a = "easeInOutCosine", commit: o = !0 } = n, s = Date.now();
  return Oa(uf, {
    type: t,
    params: e,
    durationMS: r,
    easing: a,
    startEpochMS: s,
    commit: !1
  }), i.execute(e, { durationMS: r, easing: a, commit: o, startEpochMS: s });
}
c(iy, "dispatchTween");
function ry(t) {
  const { type: e, params: n, durationMS: i, easing: r, startEpochMS: a, commit: o } = t ?? {}, s = Ci(e);
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
c(ry, "handleTweenSocketMessage");
Fp();
Rp();
Hp();
Bp();
Wp();
Jp();
Zp();
ny();
$t({ type: "token-prop", execute: Ko, validate: Yo });
$t({ type: "drawing-prop", execute: Ko, validate: Yo });
$t({ type: "sound-prop", execute: Ko, validate: Yo });
fc(uf, ry);
fc(df, ay);
fc(vl, oy);
function ay(t) {
  const { data: e, startEpochMS: n } = t ?? {};
  if (!e) {
    console.warn(`[${T}] Received empty tween-sequence socket message.`);
    return;
  }
  try {
    hc(e, { validateSemantics: !0 }).run({ commit: !1, startEpochMS: n, broadcast: !1 });
  } catch (i) {
    console.error(`[${T}] Failed to run received tween sequence:`, i);
  }
}
c(ay, "handleSequenceSocketMessage");
function oy(t) {
  const { name: e } = t ?? {};
  e && gf(e);
}
c(oy, "handleSequenceCancelMessage");
function sy() {
  Hooks.once("ready", () => {
    Op();
    const t = game.modules.get(T);
    t.api || (t.api = {}), t.api.tween = {
      dispatch: iy,
      types: wl,
      Timeline: Xa,
      ErrorPolicy: Ce,
      compileSequence: hc,
      cancelTimeline: gf,
      getTimeline: Vp
    }, console.log(`[${T}] Tween API registered. Types: ${wl().join(", ")}`);
  });
}
c(sy, "registerTweenHooks");
sy();
const ly = ["tag", "tag-all", "id", "tags-any", "tags-all"], cy = /* @__PURE__ */ new Set(["tags-any", "tags-all"]);
function gc(t) {
  if (!t || typeof t != "string")
    return { type: "unknown", value: t ?? "" };
  if (t.startsWith("$"))
    return { type: "special", value: t };
  for (const e of ly)
    if (t.startsWith(`${e}:`)) {
      const n = t.slice(e.length + 1), i = cy.has(e) ? n.split(",").map((r) => r.trim()) : n;
      return { type: e, value: i };
    }
  return t.includes(".") ? { type: "uuid", value: t } : { type: "unknown", value: t };
}
c(gc, "parseSelector");
function uy(t) {
  if (!t) return "";
  const { type: e, value: n } = t;
  if (e === "special" || e === "uuid" || e === "unknown")
    return Array.isArray(n) ? n.join(",") : n ?? "";
  const i = Array.isArray(n) ? n.join(",") : n ?? "";
  return `${e}:${i}`;
}
c(uy, "buildSelector");
function Cf(t, e = "first") {
  return t != null && t.length ? t.length === 1 ? e === "first-all" || e === "all" ? `tag-all:${t[0]}` : `tag:${t[0]}` : e === "any" ? `tags-any:${t.join(",")}` : e === "all" ? `tags-all:${t.join(",")}` : e === "first-all" ? `tags-all:${t.join(",")}` : `tags-any:${t.join(",")}` : "";
}
c(Cf, "buildTagSelector");
function Xo(t) {
  if (!t) return null;
  if (t.documentName || t._source !== void 0) {
    const e = t.object;
    return e ? { placeable: e, doc: t } : null;
  }
  return t.document ? { placeable: t, doc: t.document } : null;
}
c(Xo, "normalizePlaceable");
function Tf() {
  var t;
  return window.Tagger ?? ((t = game.modules.get("tagger")) == null ? void 0 : t.api) ?? null;
}
c(Tf, "getTaggerAPI");
function Qo(t, e) {
  if (!t) return null;
  const n = e ?? canvas.scene;
  if (!n) return null;
  const i = gc(t);
  switch (i.type) {
    case "special":
      return dy(i.value);
    case "tag":
      return ou(i.value, n);
    case "tag-all":
      return ou(i.value, n);
    case "id":
      return fy(i.value, n);
    case "tags-any":
      return su(i.value, n, !0);
    case "tags-all":
      return su(i.value, n, !1);
    case "uuid":
      return my(i.value);
    default:
      return null;
  }
}
c(Qo, "resolveSelector");
function dy(t) {
  var e;
  if (t === "$particles") {
    if (!((e = game.modules.get("fxmaster")) != null && e.active))
      return console.warn(`[${T}] Picker: FXMaster not active, cannot resolve "$particles".`), null;
    const n = canvas.particleeffects;
    return n ? { kind: "particles", documents: [], placeables: [], target: n } : null;
  }
  return null;
}
c(dy, "resolveSpecial");
function ou(t, e, n) {
  const i = Tf();
  if (!i)
    return console.warn(`[${T}] Picker: Tagger not available, cannot resolve tag "${t}".`), null;
  const r = i.getByTag(t, { sceneId: e.id });
  if (!(r != null && r.length)) return null;
  const a = [];
  for (const o of r) {
    const s = Xo(o);
    s && a.push(s);
  }
  return a.length === 0 ? null : {
    kind: a.length === 1 ? "placeable" : "multi-placeable",
    documents: a.map((o) => o.doc),
    placeables: a
  };
}
c(ou, "resolveTag");
function fy(t, e) {
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
      const a = Xo(r);
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
c(fy, "resolveById");
function su(t, e, n) {
  const i = Tf();
  if (!i)
    return console.warn(`[${T}] Picker: Tagger not available, cannot resolve multi-tag.`), null;
  const r = i.getByTag(t, {
    sceneId: e.id,
    matchAny: n
  });
  if (!(r != null && r.length)) return null;
  const a = [];
  for (const o of r) {
    const s = Xo(o);
    s && a.push(s);
  }
  return a.length === 0 ? null : {
    kind: a.length === 1 ? "placeable" : "multi-placeable",
    documents: a.map((o) => o.doc),
    placeables: a
  };
}
c(su, "resolveMultiTag");
function my(t) {
  const e = fromUuidSync(t);
  if (!e) return null;
  const n = Xo(e);
  return n ? {
    kind: "placeable",
    documents: [n.doc],
    placeables: [n]
  } : null;
}
c(my, "resolveUUID");
function hy(t) {
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
c(hy, "adaptResolved");
function Qa(t) {
  var r;
  const e = /* @__PURE__ */ new Set();
  if (t.segments) {
    if (t.setup) for (const a of Object.keys(t.setup)) e.add(a);
    if (t.landing) for (const a of Object.keys(t.landing)) e.add(a);
    for (const a of Object.values(t.segments)) {
      if (a.setup) for (const o of Object.keys(a.setup)) e.add(o);
      if (a.landing) for (const o of Object.keys(a.landing)) e.add(o);
      a.timeline && Ml(a.timeline, e), (r = a.gate) != null && r.target && e.add(a.gate.target);
    }
  } else {
    if (t.setup) for (const a of Object.keys(t.setup)) e.add(a);
    if (t.landing) for (const a of Object.keys(t.landing)) e.add(a);
    t.timeline && Ml(t.timeline, e);
  }
  const n = /* @__PURE__ */ new Map(), i = [];
  for (const a of e) {
    const o = Qo(a), s = hy(o);
    s ? n.set(a, s) : i.push(a);
  }
  return i.length && console.warn(`[${T}] Cinematic: ${i.length} unresolved target(s): ${i.join(", ")}`), { targets: n, unresolved: i };
}
c(Qa, "resolveAllTargets");
function gy(t, e) {
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
c(gy, "captureSnapshot");
function py(t) {
  const e = {};
  function n(i) {
    if (i)
      for (const [r, a] of Object.entries(i))
        e[r] || (e[r] = {}), Object.assign(e[r], a);
  }
  if (c(n, "mergeMap"), t.segments) {
    n(t.setup), n(t.landing);
    for (const i of Object.values(t.segments))
      n(i.setup), n(i.landing), i.timeline && kl(i.timeline, e, n);
  } else
    n(t.setup), n(t.landing), t.timeline && kl(t.timeline, e, n);
  return e;
}
c(py, "gatherAllStateMaps");
function kl(t, e, n) {
  var i;
  for (const r of t)
    if (!(r.delay != null || r.await != null || r.emit != null) && !(r.transitionTo != null || r.sound != null || r.stopSound != null)) {
      if ((i = r.parallel) != null && i.branches) {
        for (const a of r.parallel.branches)
          kl(a, e, n);
        continue;
      }
      if (n(r.before), n(r.after), r.tweens)
        for (const a of r.tweens)
          a.target && a.attribute && (e[a.target] || (e[a.target] = {}), e[a.target][a.attribute] = "__snapshot__");
    }
}
c(kl, "gatherFromEntries");
function Ml(t, e) {
  for (const n of t)
    if (n.delay == null && n.await == null && n.emit == null && n.transitionTo == null && n.sound == null && n.stopSound == null) {
      if (n.parallel) {
        const i = n.parallel;
        if (i.branches)
          for (const r of i.branches)
            Ml(r, e);
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
c(Ml, "collectSelectorsFromEntries");
const lu = {
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
}, yy = /* @__PURE__ */ new Set([
  "alpha",
  "visible",
  "x",
  "y",
  "scale",
  "rotation"
]);
function ys(t, e, n) {
  const i = {};
  for (const [r, a] of Object.entries(t))
    e.has(r) ? i[r] = a : console.warn(`[${T}] Cinematic: blocked property "${r}" on ${n}.`);
  return i;
}
c(ys, "filterOverrides");
function Te(t, e) {
  var i, r;
  if (!t) return;
  const n = [];
  for (const [a, o] of Object.entries(t)) {
    const s = e.get(a);
    if (s)
      if (s.kind === "particles") {
        if (s.target.destroyed) continue;
        const l = ys(o, yy, "$particles");
        for (const [u, d] of Object.entries(l))
          s.target[u] = d;
      } else if (s.kind === "multi-placeable")
        for (const { placeable: l, doc: u } of s.placeables) {
          if (!(u != null && u.parent) || !(l != null && l.scene)) continue;
          const d = u.documentName, h = lu[d];
          if (!h) {
            console.warn(`[${T}] Cinematic: no allowlist for document type "${d}" on "${a}", skipping.`);
            continue;
          }
          const f = ys(o, h, `${d} "${a}"`);
          u.updateSource(f), n.push(l);
        }
      else {
        if (!((i = s.doc) != null && i.parent) || !((r = s.placeable) != null && r.scene)) continue;
        const l = s.doc.documentName, u = lu[l];
        if (!u) {
          console.warn(`[${T}] Cinematic: no allowlist for document type "${l}" on "${a}", skipping.`);
          continue;
        }
        const d = ys(o, u, `${l} "${a}"`);
        s.doc.updateSource(d), n.push(s.placeable);
      }
  }
  for (const a of n)
    a.refresh();
}
c(Te, "applyState");
function $i(t, e) {
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
c($i, "refreshPerceptionIfNeeded");
const by = {
  "tile-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "light-color": /* @__PURE__ */ new Set(["uuid", "toColor", "toAlpha", "mode"]),
  "light-state": /* @__PURE__ */ new Set(["uuid", "enabled"]),
  "particles-prop": /* @__PURE__ */ new Set(["attribute", "value"]),
  "camera-pan": /* @__PURE__ */ new Set(["x", "y", "scale"]),
  "token-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "drawing-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "sound-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"])
}, vy = /* @__PURE__ */ new Set(["easing"]), wy = /* @__PURE__ */ new Set(["type", "target"]);
function Lf(t, e) {
  const { type: n, target: i, ...r } = t;
  if (!n)
    return console.warn(`[${T}] Cinematic: tween entry missing 'type', skipping.`), null;
  const a = {}, o = {}, s = by[n];
  if (i === "$particles")
    a.target = "$particles";
  else if (i) {
    const l = e.get(i);
    if (!l) return null;
    l.kind === "multi-placeable" ? a.uuid = l.placeables.map((u) => u.doc.uuid) : a.uuid = l.doc.uuid;
  }
  for (const [l, u] of Object.entries(r))
    wy.has(l) || (vy.has(l) ? o[l] = u : (s != null && s.has(l), a[l] = u));
  return { type: n, params: a, opts: o };
}
c(Lf, "compileTween");
const Lr = /* @__PURE__ */ new Map();
let Ey = 0;
async function Sy(t) {
  var u, d, h, f, g;
  const { id: e, src: n, volume: i = 0.8, loop: r = !1, fadeIn: a } = t;
  if (!n) {
    console.warn(`[${T}] Cinematic sound: missing 'src', skipping.`);
    return;
  }
  const o = e || `__auto_${++Ey}`, s = {
    src: n,
    autoplay: !0,
    loop: r,
    volume: i
  };
  let l = null;
  try {
    typeof ((d = (u = foundry == null ? void 0 : foundry.audio) == null ? void 0 : u.AudioHelper) == null ? void 0 : d.play) == "function" ? l = await foundry.audio.AudioHelper.play(s, !1) : typeof ((f = (h = game == null ? void 0 : game.audio) == null ? void 0 : h.constructor) == null ? void 0 : f.play) == "function" ? l = await game.audio.constructor.play(s, !1) : typeof ((g = game == null ? void 0 : game.audio) == null ? void 0 : g.play) == "function" && (l = await game.audio.play(s, !1));
  } catch (p) {
    console.error(`[${T}] Cinematic sound: failed to play "${n}":`, p);
    return;
  }
  if (!l) {
    console.warn(`[${T}] Cinematic sound: audio helper unavailable for "${n}".`);
    return;
  }
  a && a > 0 && l.fade && l.fade(i, { duration: a, from: 0 }), Lr.set(o, { sound: l, config: t }), console.log(`[${T}] Cinematic sound: playing "${n}" as "${o}" (loop=${r}, vol=${i})`);
}
c(Sy, "playLocalSound");
function bs(t) {
  var i, r;
  const e = Lr.get(t);
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
  Lr.delete(t);
}
c(bs, "stopCinematicSound");
function cu() {
  var t, e;
  for (const [n, i] of Lr)
    try {
      (e = (t = i.sound).stop) == null || e.call(t);
    } catch (r) {
      console.warn(`[${T}] Cinematic sound: error stopping "${n}" during cleanup:`, r);
    }
  Lr.clear();
}
c(cu, "stopAllCinematicSounds");
function Cy(t, e, n, i = {}) {
  const { skipToStep: r, onStepComplete: a, timelineName: o } = i, s = new n().name(o ?? `cinematic-${canvas.scene.id}`);
  return s.beforeAll(() => {
    var l;
    try {
      Te(t.setup, e), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    } catch (u) {
      throw console.error(`[${T}] Cinematic: error in beforeAll (setup state) on scene ${(l = canvas.scene) == null ? void 0 : l.id}:`, u), u;
    }
  }), Of(t.timeline, s, e, { skipToStep: r, onStepComplete: a }), { tl: s };
}
c(Cy, "buildTimeline");
function If(t, e) {
  var n;
  if (t)
    for (const i of t)
      for (const r of i) {
        if (r.before)
          try {
            Te(r.before, e), $i(r.before, e);
          } catch (a) {
            console.warn(`[${T}] Cinematic: error in skipped parallel before:`, a);
          }
        if (r.after)
          try {
            Te(r.after, e), $i(r.after, e);
          } catch (a) {
            console.warn(`[${T}] Cinematic: error in skipped parallel after:`, a);
          }
        (n = r.parallel) != null && n.branches && If(r.parallel.branches, e);
      }
}
c(If, "applyParallelStatesForSkip");
function Of(t, e, n, i = {}) {
  const { skipToStep: r, onStepComplete: a } = i;
  let o = -1;
  for (const s of t) {
    if (s.sound != null) {
      if (r != null && o < r) continue;
      const h = s.sound, { duration: f, loop: g, fireAndForget: p } = h, y = e.step();
      if (y.before(() => {
        Sy(h);
      }), f && f > 0)
        if (p) {
          if (g && h.id) {
            const w = h.id, v = f;
            y.before(() => {
              setTimeout(() => bs(w), v);
            });
          }
        } else
          e.delay(f), g && e.step().before(() => {
            bs(h.id);
          });
      continue;
    }
    if (s.stopSound != null) {
      if (r != null && o < r) continue;
      const h = s.stopSound;
      e.step().before(() => {
        bs(h);
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
        If(s.parallel.branches, n);
        continue;
      }
      const h = s.parallel, f = h.branches.map((g) => (p) => Of(g, p, n));
      e.parallel(f, {
        join: h.join ?? "all",
        overflow: h.overflow ?? "detach"
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
          Te(s.before, n), $i(s.before, n);
        } catch (h) {
          console.warn(`[${T}] Cinematic: error applying skipped step.before:`, h);
        }
      if (s.after)
        try {
          Te(s.after, n), $i(s.after, n);
        } catch (h) {
          console.warn(`[${T}] Cinematic: error applying skipped step.after:`, h);
        }
      continue;
    }
    const l = o, u = e.step();
    s.before && u.before(() => {
      var h;
      try {
        Te(s.before, n), $i(s.before, n);
      } catch (f) {
        throw console.error(`[${T}] Cinematic: error in step.before callback on scene ${(h = canvas.scene) == null ? void 0 : h.id}:`, f), f;
      }
    });
    const d = s.duration ?? 500;
    for (const h of s.tweens) {
      const f = Lf(h, n);
      f && u.add(f.type, f.params, { ...f.opts, durationMS: d });
    }
    u.after(() => {
      var h;
      try {
        s.after && (Te(s.after, n), $i(s.after, n)), a == null || a(l);
      } catch (f) {
        throw console.error(`[${T}] Cinematic: error in step.after callback on scene ${(h = canvas.scene) == null ? void 0 : h.id}:`, f), f;
      }
    });
  }
}
c(Of, "compileCinematicEntries");
function xi(t, e, n) {
  if (t != null) {
    if (typeof t != "object" || Array.isArray(t)) {
      n.push({ path: e, level: "error", message: `Expected object, got ${Array.isArray(t) ? "array" : typeof t}` });
      return;
    }
    for (const [i, r] of Object.entries(t))
      (typeof r != "object" || r === null || Array.isArray(r)) && n.push({ path: `${e}["${i}"]`, level: "error", message: `Expected property overrides object, got ${Array.isArray(r) ? "array" : typeof r}` });
  }
}
c(xi, "validateStateMap");
function Nl(t, e, n, i) {
  var r;
  for (let a = 0; a < t.length; a++) {
    const o = t[a], s = `${e}[${a}]`;
    if (!(o.delay != null || o.await != null || o.emit != null) && !(o.transitionTo != null || o.sound != null || o.stopSound != null)) {
      if ((r = o.parallel) != null && r.branches) {
        for (let l = 0; l < o.parallel.branches.length; l++)
          Nl(o.parallel.branches[l], `${s}.parallel.branches[${l}]`, n, i);
        continue;
      }
      if (xi(o.before, `${s}.before`, i), xi(o.after, `${s}.after`, i), o.tweens)
        for (let l = 0; l < o.tweens.length; l++) {
          const u = o.tweens[l], d = `${s}.tweens[${l}]`;
          if (!u.type) {
            i.push({ path: d, level: "error", message: "Missing 'type' field" });
            continue;
          }
          const h = Ci(u.type);
          if (!h) {
            i.push({ path: d, level: "error", message: `Unknown tween type: "${u.type}"` });
            continue;
          }
          if (n)
            try {
              const f = Lf(u, n);
              f ? h.validate(f.params) : u.target && i.push({ path: d, level: "warn", message: `Target "${u.target}" could not be resolved for compilation` });
            } catch (f) {
              i.push({ path: d, level: "error", message: f.message });
            }
          n && u.target && !n.has(u.target) && i.push({ path: `${d}.target`, level: "warn", message: `Target "${u.target}" is not resolved` });
        }
    }
  }
}
c(Nl, "validateEntries");
function Ty(t, e = null) {
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
      xi(s.setup, `${l}.setup`, n), xi(s.landing, `${l}.landing`, n), s.timeline && Array.isArray(s.timeline) && Nl(s.timeline, `${l}.timeline`, e, n), s.next && typeof s.next == "string" && !t.segments[s.next] && n.push({ path: `${l}.next`, level: "error", message: `Next segment "${s.next}" not found` });
    }
  } else
    xi(t.setup, "setup", n), xi(t.landing, "landing", n), t.timeline && Array.isArray(t.timeline) && Nl(t.timeline, "timeline", e, n);
  return n;
}
c(Ty, "validateCinematicDeep");
const vs = 5, uu = /* @__PURE__ */ new Set(["click", "tile-click", "keypress"]);
var se, fe, Be, Oe, ft, ur, _l, Af, Y, _e, ka, Se, yt;
const oe = class oe {
  constructor(e = null, { loadedHash: n = null, cinematicName: i = "default", segmentName: r = null } = {}) {
    k(this, Y);
    k(this, se);
    k(this, fe);
    k(this, Be);
    k(this, Oe);
    var o;
    I(this, se, e ?? oe.empty()), I(this, fe, i), I(this, Oe, n);
    const a = (o = m(this, se).cinematics) == null ? void 0 : o[m(this, fe)];
    I(this, Be, r ?? (a == null ? void 0 : a.entry) ?? "main");
  }
  static empty() {
    return {
      version: vs,
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
    var w;
    const { trigger: n, tracking: i, synchronized: r, setup: a, landing: o, timeline: s = [] } = e;
    if (!s.some(
      (v) => {
        var b;
        return v.await != null && uu.has(((b = v.await) == null ? void 0 : b.event) ?? "click");
      }
    )) {
      const v = s.filter((L) => L.transitionTo == null), b = s.find((L) => L.transitionTo != null), E = { timeline: v };
      if (a && Object.keys(a).length && (E.setup = a), o && Object.keys(o).length && (E.landing = o), b) {
        const L = b.transitionTo;
        L.scene && L.cinematic ? E.next = { segment: L.cinematic, scene: L.scene } : L.cinematic;
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
    let d = [], h = 1, f = null;
    const g = [];
    function p() {
      const v = `segment-${h++}`, b = { timeline: [...d] };
      return f && (b.gate = f), u[v] = b, g.push(v), d = [], f = null, v;
    }
    c(p, "flushSegment");
    for (const v of s)
      if (v.transitionTo == null) {
        if (v.await != null && uu.has(((w = v.await) == null ? void 0 : w.event) ?? "click")) {
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
      const v = y.transitionTo, b = u[g[g.length - 1]];
      v.scene && v.cinematic && (b.next = { segment: v.cinematic, scene: v.scene });
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
      (i = a.timeline) != null && i.length && (a.timeline = C(r = oe, ft, _l).call(r, a.timeline));
    return n;
  }
  static fromScene(e, n = "default") {
    var o;
    const i = e == null ? void 0 : e.getFlag(T, "cinematic");
    let r = i ? foundry.utils.deepClone(i) : null;
    const a = i ? C(o = oe, ft, Af).call(o, i) : null;
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
      r.version = vs;
    }
    return new oe(r, { loadedHash: a, cinematicName: n });
  }
  /**
   * Check if the scene's cinematic flag has been modified since this state was loaded.
   * @param {object} scene  The Foundry scene document
   * @returns {boolean} true if scene data differs from what was loaded
   */
  isStale(e) {
    if (!m(this, Oe)) return !1;
    const n = e == null ? void 0 : e.getFlag(T, "cinematic");
    return n ? !foundry.utils.objectsEqual(n, m(this, Oe)) : !1;
  }
  // ── Read ──────────────────────────────────────────────────────────────
  get data() {
    return m(this, se);
  }
  get trigger() {
    return m(this, Y, _e).trigger;
  }
  get tracking() {
    return m(this, Y, _e).tracking;
  }
  get synchronized() {
    return m(this, Y, _e).synchronized ?? !1;
  }
  get activeCinematicName() {
    return m(this, fe);
  }
  // ── Segment accessors ────────────────────────────────────────────────
  get segments() {
    return m(this, Y, _e).segments;
  }
  get entry() {
    return m(this, Y, _e).entry;
  }
  get activeSegmentName() {
    return m(this, Be);
  }
  get activeSegment() {
    var e;
    return ((e = m(this, Y, _e).segments) == null ? void 0 : e[m(this, Be)]) ?? null;
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
    return Object.keys(m(this, se).cinematics);
  }
  switchCinematic(e) {
    if (!m(this, se).cinematics[e]) return this;
    const n = m(this, se).cinematics[e];
    return new oe(foundry.utils.deepClone(m(this, se)), {
      loadedHash: m(this, Oe),
      cinematicName: e,
      segmentName: n.entry ?? "main"
    });
  }
  addCinematic(e) {
    if (!e || m(this, se).cinematics[e]) return this;
    const n = foundry.utils.deepClone(m(this, se));
    return n.cinematics[e] = oe.emptyCinematic(), new oe(n, {
      loadedHash: m(this, Oe),
      cinematicName: e,
      segmentName: "main"
    });
  }
  removeCinematic(e) {
    if (Object.keys(m(this, se).cinematics).length <= 1) return this;
    if (!m(this, se).cinematics[e]) return this;
    const i = foundry.utils.deepClone(m(this, se));
    delete i.cinematics[e];
    const r = m(this, fe) === e ? Object.keys(i.cinematics)[0] : m(this, fe), a = i.cinematics[r];
    return new oe(i, {
      loadedHash: m(this, Oe),
      cinematicName: r,
      segmentName: (a == null ? void 0 : a.entry) ?? "main"
    });
  }
  renameCinematic(e, n) {
    if (!e || !n || e === n) return this;
    if (!m(this, se).cinematics[e]) return this;
    if (m(this, se).cinematics[n]) return this;
    const i = foundry.utils.deepClone(m(this, se)), r = {};
    for (const [o, s] of Object.entries(i.cinematics))
      r[o === e ? n : o] = s;
    i.cinematics = r;
    const a = m(this, fe) === e ? n : m(this, fe);
    return new oe(i, {
      loadedHash: m(this, Oe),
      cinematicName: a,
      segmentName: m(this, Be)
    });
  }
  // ── Cinematic-level mutations ─────────────────────────────────────────
  setTrigger(e) {
    return C(this, Y, ka).call(this, { trigger: e });
  }
  setTracking(e) {
    return C(this, Y, ka).call(this, { tracking: e });
  }
  setSynchronized(e) {
    return C(this, Y, ka).call(this, { synchronized: e });
  }
  // ── Segment-level mutations (setup/landing now live on segments) ──────
  setSetup(e) {
    return C(this, Y, Se).call(this, { setup: e });
  }
  setLanding(e) {
    return C(this, Y, Se).call(this, { landing: e });
  }
  // ── Segment management methods ────────────────────────────────────────
  switchSegment(e) {
    var n;
    return (n = m(this, Y, _e).segments) != null && n[e] ? new oe(foundry.utils.deepClone(m(this, se)), {
      loadedHash: m(this, Oe),
      cinematicName: m(this, fe),
      segmentName: e
    }) : this;
  }
  addSegment(e, n = null) {
    var a;
    if (!e || (a = m(this, Y, _e).segments) != null && a[e]) return this;
    const i = foundry.utils.deepClone(m(this, se)), r = i.cinematics[m(this, fe)];
    if (r.segments[e] = oe.emptySegment(), n && r.segments[n]) {
      const o = r.segments[n].next;
      r.segments[n].next = e, o && (r.segments[e].next = o);
    }
    return new oe(i, {
      loadedHash: m(this, Oe),
      cinematicName: m(this, fe),
      segmentName: e
    });
  }
  removeSegment(e) {
    var s, l;
    if (Object.keys(m(this, Y, _e).segments ?? {}).length <= 1) return this;
    if (!((s = m(this, Y, _e).segments) != null && s[e])) return this;
    const i = foundry.utils.deepClone(m(this, se)), r = i.cinematics[m(this, fe)], a = r.segments[e].next;
    for (const [, u] of Object.entries(r.segments))
      (u.next === e || typeof u.next == "object" && ((l = u.next) == null ? void 0 : l.segment) === e) && (u.next = a ?? void 0, u.next || delete u.next);
    delete r.segments[e], r.entry === e && (r.entry = Object.keys(r.segments)[0]);
    const o = m(this, Be) === e ? r.entry : m(this, Be);
    return new oe(i, {
      loadedHash: m(this, Oe),
      cinematicName: m(this, fe),
      segmentName: o
    });
  }
  renameSegment(e, n) {
    var s, l, u;
    if (!e || !n || e === n) return this;
    if (!((s = m(this, Y, _e).segments) != null && s[e])) return this;
    if ((l = m(this, Y, _e).segments) != null && l[n]) return this;
    const i = foundry.utils.deepClone(m(this, se)), r = i.cinematics[m(this, fe)], a = {};
    for (const [d, h] of Object.entries(r.segments))
      a[d === e ? n : d] = h;
    r.segments = a;
    for (const [, d] of Object.entries(r.segments))
      d.next === e ? d.next = n : typeof d.next == "object" && ((u = d.next) == null ? void 0 : u.segment) === e && (d.next.segment = n);
    r.entry === e && (r.entry = n);
    const o = m(this, Be) === e ? n : m(this, Be);
    return new oe(i, {
      loadedHash: m(this, Oe),
      cinematicName: m(this, fe),
      segmentName: o
    });
  }
  setSegmentGate(e) {
    return C(this, Y, Se).call(this, { gate: e ?? void 0 });
  }
  setSegmentNext(e) {
    return C(this, Y, Se).call(this, { next: e ?? void 0 });
  }
  setSegmentSetup(e) {
    return C(this, Y, Se).call(this, { setup: e });
  }
  setSegmentLanding(e) {
    return C(this, Y, Se).call(this, { landing: e });
  }
  listSegmentNames() {
    return Object.keys(m(this, Y, _e).segments ?? {});
  }
  // ── Timeline entry mutations (scoped to active segment) ──────────────
  addStep(e = -1) {
    const n = [...this.activeSegment.timeline], i = { duration: 1e3, tweens: [] };
    return e < 0 || e >= n.length ? n.push(i) : n.splice(e, 0, i), C(this, Y, Se).call(this, { timeline: n });
  }
  addDelay(e = -1, n = 1e3) {
    const i = [...this.activeSegment.timeline], r = { delay: n };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), C(this, Y, Se).call(this, { timeline: i });
  }
  addAwait(e = -1, n = null) {
    return console.warn(`[${T}] CinematicState.addAwait() is deprecated in v4. Use segment gates instead.`), this;
  }
  addEmit(e = -1, n = "") {
    const i = [...this.activeSegment.timeline], r = { emit: n };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), C(this, Y, Se).call(this, { timeline: i });
  }
  addParallel(e = -1) {
    const n = [...this.activeSegment.timeline], i = { parallel: { branches: [[], []], join: "all", overflow: "detach" } };
    return e < 0 || e >= n.length ? n.push(i) : n.splice(e, 0, i), C(this, Y, Se).call(this, { timeline: n });
  }
  addTransitionTo(e = -1, n = null) {
    return console.warn(`[${T}] CinematicState.addTransitionTo() is deprecated in v4. Use segment next edges instead.`), this;
  }
  addSound(e = -1, n = null) {
    const i = [...this.activeSegment.timeline], r = { sound: n ?? { src: "", volume: 0.8, loop: !1, duration: 0, fireAndForget: !1 } };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), C(this, Y, Se).call(this, { timeline: i });
  }
  addStopSound(e = -1, n = "") {
    const i = [...this.activeSegment.timeline], r = { stopSound: n };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), C(this, Y, Se).call(this, { timeline: i });
  }
  moveEntry(e, n) {
    if (e === n) return this;
    const i = [...this.activeSegment.timeline];
    if (e < 0 || e >= i.length) return this;
    if (n < 0 || n >= i.length) return this;
    const [r] = i.splice(e, 1);
    return i.splice(n, 0, r), C(this, Y, Se).call(this, { timeline: i });
  }
  removeEntry(e) {
    const n = [...this.activeSegment.timeline];
    return e < 0 || e >= n.length ? this : (n.splice(e, 1), C(this, Y, Se).call(this, { timeline: n }));
  }
  updateEntry(e, n) {
    const i = this.activeSegment.timeline.map((r, a) => a !== e ? r : { ...foundry.utils.deepClone(r), ...n });
    return C(this, Y, Se).call(this, { timeline: i });
  }
  // ── Tween mutations ──────────────────────────────────────────────────
  addTween(e, n = null) {
    const i = { type: "tile-prop", target: "", attribute: "alpha", value: 1 };
    return C(this, Y, yt).call(this, e, (r) => {
      const a = [...r.tweens ?? [], n ?? i];
      return { ...r, tweens: a };
    });
  }
  updateTween(e, n, i) {
    return C(this, Y, yt).call(this, e, (r) => {
      const a = (r.tweens ?? []).map((o, s) => s !== n ? o : { ...o, ...i });
      return { ...r, tweens: a };
    });
  }
  removeTween(e, n) {
    return C(this, Y, yt).call(this, e, (i) => {
      const r = (i.tweens ?? []).filter((a, o) => o !== n);
      return { ...i, tweens: r };
    });
  }
  updateStepDuration(e, n) {
    return C(this, Y, yt).call(this, e, (i) => ({ ...i, duration: Math.max(0, n) }));
  }
  // ── Parallel branch mutations ────────────────────────────────────────
  addBranch(e) {
    return C(this, Y, yt).call(this, e, (n) => {
      if (!n.parallel) return n;
      const i = [...n.parallel.branches, []];
      return { ...n, parallel: { ...n.parallel, branches: i } };
    });
  }
  removeBranch(e, n) {
    return C(this, Y, yt).call(this, e, (i) => {
      if (!i.parallel) return i;
      const r = i.parallel.branches.filter((a, o) => o !== n);
      return r.length < 1 ? i : { ...i, parallel: { ...i.parallel, branches: r } };
    });
  }
  addBranchEntry(e, n, i = null) {
    const r = { duration: 1e3, tweens: [] };
    return C(this, Y, yt).call(this, e, (a) => {
      if (!a.parallel) return a;
      const o = a.parallel.branches.map((s, l) => l !== n ? s : [...s, i ?? r]);
      return { ...a, parallel: { ...a.parallel, branches: o } };
    });
  }
  removeBranchEntry(e, n, i) {
    return C(this, Y, yt).call(this, e, (r) => {
      if (!r.parallel) return r;
      const a = r.parallel.branches.map((o, s) => s !== n ? o : o.filter((l, u) => u !== i));
      return { ...r, parallel: { ...r.parallel, branches: a } };
    });
  }
  updateBranchEntry(e, n, i, r) {
    return C(this, Y, yt).call(this, e, (a) => {
      if (!a.parallel) return a;
      const o = a.parallel.branches.map((s, l) => l !== n ? s : s.map((u, d) => d !== i ? u : { ...foundry.utils.deepClone(u), ...r }));
      return { ...a, parallel: { ...a.parallel, branches: o } };
    });
  }
  moveBranchEntry(e, n, i, r) {
    return i === r ? this : C(this, Y, yt).call(this, e, (a) => {
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
    const n = { ...foundry.utils.deepClone(m(this, se)), version: vs };
    await e.setFlag(T, "cinematic", n);
  }
  /** Returns the active cinematic's data (for validation/export). */
  toJSON() {
    return foundry.utils.deepClone(m(this, Y, _e));
  }
  /** Returns the entire v4 flag structure. */
  toFullJSON() {
    return foundry.utils.deepClone(m(this, se));
  }
};
se = new WeakMap(), fe = new WeakMap(), Be = new WeakMap(), Oe = new WeakMap(), ft = new WeakSet(), ur = /* @__PURE__ */ c(function(e) {
  const { duration: n, detach: i, ...r } = e;
  return r;
}, "#stripTween"), _l = /* @__PURE__ */ c(function(e) {
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
          return C(d = oe, ft, _l).call(d, u);
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
      const l = Math.max(500, ...a.tweens.map((h) => h.duration ?? 0)), { tweens: u, ...d } = a;
      n.push({
        ...d,
        duration: l,
        tweens: u.map(C(oe, ft, ur))
      });
    } else if (o.length === 0) {
      const l = Math.max(500, ...s.map((h) => h.duration ?? 0)), { tweens: u, ...d } = a;
      n.push({
        ...d,
        duration: l,
        tweens: s.map(C(oe, ft, ur))
      });
    } else {
      const l = Math.max(500, ...o.map((f) => f.duration ?? 0)), u = Math.max(500, ...s.map((f) => f.duration ?? 0)), { tweens: d, ...h } = a;
      n.push({
        parallel: {
          branches: [
            [{ ...h, duration: l, tweens: o.map(C(oe, ft, ur)) }],
            [{ duration: u, tweens: s.map(C(oe, ft, ur)) }]
          ],
          join: "all",
          overflow: "detach"
        }
      });
    }
  }
  return n;
}, "#migrateTimelineV5"), Af = /* @__PURE__ */ c(function(e) {
  return foundry.utils.deepClone(e);
}, "#computeHash"), Y = new WeakSet(), _e = /* @__PURE__ */ c(function() {
  return m(this, se).cinematics[m(this, fe)];
}, "#active"), // ── Internal ─────────────────────────────────────────────────────────
/** Clone the full state with a patch to the active cinematic (cinematic-level props). */
ka = /* @__PURE__ */ c(function(e) {
  const n = foundry.utils.deepClone(m(this, se));
  return Object.assign(n.cinematics[m(this, fe)], e), new oe(n, {
    loadedHash: m(this, Oe),
    cinematicName: m(this, fe),
    segmentName: m(this, Be)
  });
}, "#cloneActive"), /** Clone the full state with a patch to the active segment within the active cinematic. */
Se = /* @__PURE__ */ c(function(e) {
  const n = foundry.utils.deepClone(m(this, se)), i = n.cinematics[m(this, fe)].segments[m(this, Be)];
  if (!i) return this;
  Object.assign(i, e);
  for (const [r, a] of Object.entries(i))
    a === void 0 && delete i[r];
  return new oe(n, {
    loadedHash: m(this, Oe),
    cinematicName: m(this, fe),
    segmentName: m(this, Be)
  });
}, "#cloneActiveSegment"), /** Mutate a single timeline entry within the active segment. */
yt = /* @__PURE__ */ c(function(e, n) {
  const i = this.activeSegment;
  if (!i || e < 0 || e >= i.timeline.length) return this;
  const r = i.timeline.map((a, o) => o !== e ? a : n(foundry.utils.deepClone(a)));
  return C(this, Y, Se).call(this, { timeline: r });
}, "#mutateEntry"), k(oe, ft), c(oe, "CinematicState");
let Gt = oe;
const du = [
  { value: "tile-prop", label: "Tile Prop" },
  { value: "light-color", label: "Light Color" },
  { value: "light-state", label: "Light State" },
  { value: "particles-prop", label: "Particles Prop" },
  { value: "camera-pan", label: "Camera Pan" },
  { value: "token-prop", label: "Token Prop" },
  { value: "drawing-prop", label: "Drawing Prop" },
  { value: "sound-prop", label: "Sound Prop" }
], kf = {
  "tile-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y, width, height" },
  "token-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y" },
  "drawing-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y" },
  "sound-prop": { form: "prop", attribute: "volume", value: 0.5, placeholder: "volume, radius" },
  "particles-prop": { form: "particles", attribute: "alpha", value: 1, placeholder: "alpha, rate, speed, size" },
  "camera-pan": { form: "camera", x: 0, y: 0, scale: 1 },
  "light-color": { form: "lightColor", toColor: "#ffffff", toAlpha: "", mode: "oklch" },
  "light-state": { form: "lightState", enabled: !0 }
}, Ly = [
  { value: "canvasReady", label: "Canvas Ready" },
  { value: "manual", label: "Manual Only" }
];
function fu(t) {
  return t && (t.split("/").pop() || "").replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "-") || "";
}
c(fu, "soundIdFromPath");
function mu(t) {
  return t ? new Promise((e) => {
    const n = new Audio(t);
    n.addEventListener("loadedmetadata", () => {
      e(Math.round(n.duration * 1e3));
    }), n.addEventListener("error", () => e(0));
  }) : Promise.resolve(0);
}
c(mu, "loadAudioDurationMs");
const xn = 40, gr = 24, Ir = 50, hu = 50, Kn = 60, ei = 10, ws = 16, Mf = 40, Nf = 20, Iy = 90, gu = 70, pu = 8;
function Zo(t) {
  return { stepDuration: Math.max(500, t.duration ?? 500), detachOverflow: 0 };
}
c(Zo, "computeStepDurations");
function Oy(t) {
  var i;
  const e = ((i = t.parallel) == null ? void 0 : i.branches) ?? [];
  let n = 0;
  for (const r of e) {
    let a = 0;
    for (const o of r)
      o.delay != null ? a += o.delay : o.await != null || o.emit != null || (o.sound != null ? a += o.sound.fireAndForget ? 0 : o.sound.duration ?? 0 : o.stopSound != null || (a += Zo(o).stepDuration));
    n = Math.max(n, a);
  }
  return Math.max(500, n);
}
c(Oy, "computeParallelDuration");
function pc(t) {
  return t.reduce((e, n) => n.delay != null ? e + n.delay : n.await != null || n.emit != null || n.transitionTo != null ? e : n.sound != null ? e + (n.sound.fireAndForget ? 0 : n.sound.duration ?? 0) : n.stopSound != null ? e : n.parallel != null ? e + Oy(n) : e + Zo(n).stepDuration, 0);
}
c(pc, "computeTotalDuration");
function Ay(t, e) {
  if (t <= 0) return 0.1;
  const n = e / t;
  return Math.max(0.03, Math.min(0.5, n));
}
c(Ay, "computeScale");
function _f(t) {
  const e = t.tweens ?? [];
  if (e.length === 0) return "Empty";
  const n = e[0], i = (n.target ?? "").replace(/^tag:/, "#"), r = n.attribute ?? "";
  return n.type === "camera-pan" ? "Pan" : r === "alpha" ? `Fade ${i}` : r === "x" || r === "y" ? `Move ${i}` : n.type === "light-color" ? `Light ${i}` : n.type === "sound-prop" ? `Sound ${i}` : i ? `${i}` : "Step";
}
c(_f, "deriveStepLabel");
function ky(t, e, n, i, r) {
  var u, d;
  const a = [], o = [], s = [];
  let l = e;
  for (let h = 0; h < t.length; h++) {
    const f = t[h], g = `${i}.${h}`, p = r === g;
    if (f.delay != null) {
      const y = Math.max(Nf, f.delay * n);
      a.push({ type: "delay", leftPx: l, widthPx: y, label: `${f.delay}ms`, entryPath: g, selected: p }), l += y;
    } else if (f.await != null) {
      const y = ((u = f.await) == null ? void 0 : u.event) ?? "click", w = y === "tile-click" ? "fa-hand-pointer" : y === "signal" ? "fa-bolt" : "fa-pause";
      a.push({ type: "await", leftPx: l, widthPx: ws, label: y, entryPath: g, selected: p, isGate: !0, gateIcon: w }), ((d = f.await) == null ? void 0 : d.event) === "signal" && s.push({ signal: f.await.signal, centerPx: l + ws / 2 }), l += ws;
    } else if (f.emit != null)
      a.push({ type: "emit", leftPx: l, widthPx: ei, label: "emit", entryPath: g, selected: p, isMarker: !0 }), o.push({ signal: f.emit, centerPx: l + ei / 2 });
    else if (f.sound != null) {
      const y = (f.sound.src || "").split("/").pop() || "Sound", w = f.sound.duration ?? 0;
      if (f.sound.fireAndForget ?? !1)
        a.push({ type: "sound", leftPx: l, widthPx: ei, label: y, entryPath: g, selected: p, isMarker: !0 });
      else {
        const b = w > 0 ? Math.max(Kn, w * n) : Kn, E = (f.sound.loop ?? !1) && w <= 0;
        a.push({ type: "sound", leftPx: l, widthPx: b, label: y, entryPath: g, selected: p, hasTrailingArrow: E }), l += b;
      }
    } else if (f.stopSound != null)
      a.push({ type: "stopSound", leftPx: l, widthPx: ei, label: "Stop", entryPath: g, selected: p, isMarker: !0 });
    else {
      const { stepDuration: y } = Zo(f), w = Math.max(Mf, y * n), v = _f(f);
      a.push({ type: "step", leftPx: l, widthPx: w, label: v, entryPath: g, selected: p }), l += w;
    }
  }
  return { blocks: a, width: l - e, emits: o, awaits: s };
}
c(ky, "computeBranchLane");
function yu(t) {
  return gr + t * xn;
}
c(yu, "laneIndexToY");
function My(t, e) {
  const n = [];
  for (const i of t.emits)
    for (const r of t.awaits) {
      if (i.signal !== r.signal) continue;
      const a = i.centerPx, o = yu(i.laneIndex) + xn / 2, s = r.centerPx, l = yu(r.laneIndex) + xn / 2, u = l - o, d = (a + s) / 2, h = o + Math.sign(u || 1) * Math.min(40, Math.abs(u) * 0.5 + 20), f = l - Math.sign(u || 1) * Math.min(40, Math.abs(u) * 0.5 + 20);
      n.push({
        pathD: `M ${a} ${o} C ${d} ${h}, ${d} ${f}, ${s} ${l}`,
        signal: i.signal
      });
    }
  return n;
}
c(My, "computeSignalArcs");
function Ny(t, e) {
  const n = [];
  if (t <= 0) return n;
  const i = e * 1e3;
  let r;
  i >= 200 ? r = 500 : i >= 80 ? r = 1e3 : i >= 40 ? r = 2e3 : r = 5e3;
  for (let a = 0; a <= t + r; a += r) {
    const o = a >= 1e3 ? `${(a / 1e3).toFixed(a % 1e3 === 0 ? 0 : 1)}s` : `${a}ms`;
    n.push({ px: Ir + a * e, label: o });
  }
  return n;
}
c(Ny, "computeTimeMarkers");
function _y(t) {
  const e = [];
  for (let n = 0; n < t.length - 1; n++) {
    const i = t[n], r = t[n + 1], a = i.leftPx + i.widthPx + (r.leftPx - (i.leftPx + i.widthPx)) / 2, o = gr + xn / 2;
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
c(_y, "computeInsertionPoints");
function $y(t, { selectedPath: e, windowWidth: n }) {
  const i = pc(t), r = n - 70 - 100, a = Ay(i, r), o = [], s = [], l = { emits: [], awaits: [] }, u = [];
  o.push({
    type: "setup",
    leftPx: 0,
    widthPx: Ir,
    label: "Setup",
    entryPath: "setup",
    selected: e === "setup"
  });
  let d = Ir;
  for (let b = 0; b < t.length; b++) {
    const E = t[b], L = `timeline.${b}`, A = e === L;
    if (E.delay != null) {
      const O = Math.max(Nf, E.delay * a);
      o.push({
        type: "delay",
        leftPx: d,
        widthPx: O,
        label: `${E.delay}ms`,
        entryPath: L,
        selected: A
      }), d += O;
    } else if (E.emit != null)
      o.push({
        type: "emit",
        leftPx: d,
        widthPx: ei,
        label: "Emit",
        entryPath: L,
        selected: A,
        isMarker: !0
      }), l.emits.push({
        signal: E.emit,
        centerPx: d + ei / 2,
        laneIndex: 0
      });
    else if (E.sound != null) {
      const O = (E.sound.src || "").split("/").pop() || "Sound", M = E.sound.duration ?? 0;
      if (E.sound.fireAndForget ?? !1) {
        const R = M > 0 ? Math.max(Kn, M * a) : Kn, D = (E.sound.loop ?? !1) && M <= 0, F = {
          type: "sound",
          leftPx: d,
          widthPx: R,
          label: O,
          entryPath: L,
          selected: A,
          hasTrailingArrow: D
        };
        let _ = !1;
        for (const H of u)
          if (H.rightEdgePx <= d) {
            H.blocks.push(F), H.rightEdgePx = d + R, _ = !0;
            break;
          }
        _ || u.push({
          label: "♫ F&F",
          blocks: [F],
          rightEdgePx: d + R
        });
      } else {
        const R = M > 0 ? Math.max(Kn, M * a) : Kn, D = (E.sound.loop ?? !1) && M <= 0;
        o.push({
          type: "sound",
          leftPx: d,
          widthPx: R,
          label: O,
          entryPath: L,
          selected: A,
          hasTrailingArrow: D
        }), d += R;
      }
    } else if (E.stopSound != null)
      o.push({
        type: "stopSound",
        leftPx: d,
        widthPx: ei,
        label: "Stop",
        entryPath: L,
        selected: A,
        isMarker: !0
      });
    else if (E.parallel != null) {
      const O = E.parallel.branches ?? [], M = d, x = [];
      let R = 0;
      for (let F = 0; F < O.length; F++) {
        const _ = `timeline.${b}.parallel.branches.${F}`, { blocks: H, width: B, emits: W, awaits: q } = ky(O[F], M, a, _, e);
        x.push({ label: `Br ${F + 1}`, blocks: H }), R = Math.max(R, B);
        const U = s.length * 10 + F + 1;
        for (const K of W) l.emits.push({ ...K, laneIndex: U });
        for (const K of q) l.awaits.push({ ...K, laneIndex: U });
      }
      const D = Math.max(Kn, R);
      o.push({
        type: "parallel",
        leftPx: M,
        widthPx: D,
        label: `${O.length} br`,
        entryPath: L,
        selected: A
      }), s.push({ parallelEntryIndex: b, startPx: M, lanes: x }), d += D;
    } else {
      const { stepDuration: O } = Zo(E), M = Math.max(Mf, O * a), x = _f(E);
      o.push({
        type: "step",
        leftPx: d,
        widthPx: M,
        label: x,
        entryPath: L,
        selected: A
      }), d += M;
    }
  }
  o.push({
    type: "landing",
    leftPx: d,
    widthPx: hu,
    label: "Landing",
    entryPath: "landing",
    selected: e === "landing"
  }), d += hu;
  const h = s.flatMap((b) => b.lanes), f = h.length;
  for (const b of u)
    h.push({ label: b.label, blocks: b.blocks });
  const g = My(l, h.length), p = [];
  for (let b = 0; b < u.length; b++) {
    const E = f + b;
    for (const L of u[b].blocks) {
      const A = L.leftPx, O = gr + xn, M = gr + (1 + E) * xn + xn / 2;
      p.push({ x: A, y1: O, y2: M });
    }
  }
  const y = Ny(i, a), w = _y(o), v = gr + (1 + h.length) * xn;
  return {
    mainBlocks: o,
    subLanes: h,
    signalArcs: g,
    fafConnectors: p,
    timeMarkers: y,
    insertionPoints: w,
    totalWidthPx: Math.max(d, 200),
    swimlaneHeightPx: v,
    totalDurationMs: i
  };
}
c($y, "computeLanes");
function xy(t) {
  if (t <= 0) return "0s";
  if (t < 1e3) return `${t}ms`;
  const e = t / 1e3;
  return e % 1 === 0 ? `${e}s` : `${e.toFixed(1)}s`;
}
c(xy, "formatDuration");
function Fy(t, e) {
  var g, p, y, w;
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
  let u = pu;
  for (const v of o) {
    const b = n[v], E = pc(b.timeline ?? []), L = xy(E), A = v === i, O = v === e, M = !a.has(v), x = Iy;
    l.push({
      name: v,
      durationMs: E,
      durationLabel: L,
      isEntry: A,
      isActive: O,
      isOrphan: M,
      leftPx: u,
      widthPx: x,
      hasGate: !!b.gate,
      gateEvent: ((g = b.gate) == null ? void 0 : g.event) ?? null
    }), u += x + gu;
  }
  const d = [], h = new Map(l.map((v) => [v.name, v]));
  for (const v of o) {
    const b = n[v];
    if (!b.next) continue;
    const E = typeof b.next == "string" ? b.next : (p = b.next) == null ? void 0 : p.segment;
    if (!E) continue;
    const L = h.get(v), A = h.get(E);
    if (!L || !A) continue;
    const O = n[E], M = ((y = O == null ? void 0 : O.gate) == null ? void 0 : y.event) ?? null, x = typeof b.next == "object" && ((w = b.next) == null ? void 0 : w.scene);
    d.push({
      fromName: v,
      toName: E,
      gateLabel: M,
      isCrossScene: x,
      fromRightPx: L.leftPx + L.widthPx,
      toLeftPx: A.leftPx
    });
  }
  const f = u - gu + pu;
  return { nodes: l, edges: d, totalWidthPx: f };
}
c(Fy, "computeSegmentGraph");
function qn(t) {
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
c(qn, "parseEntryPath");
function Za(t, e) {
  var i, r, a, o;
  const n = qn(t);
  return n ? n.type === "setup" ? e.setup : n.type === "landing" ? e.landing : n.type === "timeline" ? e.timeline[n.index] : n.type === "branch" ? (o = (a = (r = (i = e.timeline[n.index]) == null ? void 0 : i.parallel) == null ? void 0 : r.branches) == null ? void 0 : a[n.branchIndex]) == null ? void 0 : o[n.branchEntryIndex] : null : null;
}
c(Za, "getEntryAtPath");
function bu(t) {
  const e = qn(t);
  return !e || e.type !== "timeline" ? null : e.index;
}
c(bu, "getTimelineIndexFromPath");
function Dy(t) {
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
c(Dy, "countUniqueTargets");
function Py(t, e) {
  var i, r, a;
  const n = qn(t);
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
c(Py, "stepNumberForPath");
function Ry(t) {
  return {
    isSetup: !0,
    targetCount: Object.keys(t.setup ?? {}).length
  };
}
c(Ry, "buildSetupDetail");
function Hy(t) {
  return {
    isLanding: !0,
    targetCount: Object.keys(t.landing ?? {}).length
  };
}
c(Hy, "buildLandingDetail");
function qy(t) {
  return { type: "delay", isDelay: !0, delay: t.delay };
}
c(qy, "buildDelayDetail");
function jy(t) {
  return { type: "emit", isEmit: !0, signal: t.emit };
}
c(jy, "buildEmitDetail");
function By(t) {
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
c(By, "buildSoundDetail");
function Uy(t) {
  return {
    type: "stopSound",
    isStopSound: !0,
    stopSoundId: t.stopSound
  };
}
c(Uy, "buildStopSoundDetail");
function Vy(t, e) {
  var o;
  const n = t.parallel, i = n.join ?? "all", r = n.overflow ?? "detach", a = (n.branches ?? []).map((s, l) => ({
    branchIndex: l,
    label: `Branch ${l + 1}`,
    entries: (s ?? []).map((u, d) => {
      var E, L;
      const h = u.delay != null, f = u.await != null, g = u.emit != null, p = u.sound != null, y = u.stopSound != null, w = !h && !f && !g && !p && !y;
      let v, b;
      return h ? (v = `${u.delay}ms`, b = "delay") : f ? (v = "Await", b = ((E = u.await) == null ? void 0 : E.event) ?? "click") : g ? (v = "Emit", b = u.emit || "(unnamed)") : p ? (v = "Sound", b = (u.sound.src || "").split("/").pop() || "(none)") : y ? (v = "Stop Sound", b = u.stopSound || "(no id)") : (v = "Step", b = `${((L = u.tweens) == null ? void 0 : L.length) ?? 0} tweens`), { branchEntryIndex: d, isDelay: h, isAwait: f, isEmit: g, isSound: p, isStopSound: y, isStep: w, label: v, sub: b };
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
c(Vy, "buildParallelDetail");
function Gy(t, e, n, i) {
  const r = Wo(), a = (t.tweens ?? []).map((l, u) => {
    const d = `${e}.tweens.${u}`, h = n.has(d), f = l.type ?? "tile-prop", g = du.find((v) => v.value === f), p = kf[f], y = (p == null ? void 0 : p.form) ?? "prop", w = l.mode ?? "oklch";
    return {
      tweenIndex: u,
      isExpanded: h,
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
      colorMode: w,
      colorModeIsOklch: w === "oklch",
      colorModeIsHsl: w === "hsl",
      colorModeIsRgb: w === "rgb",
      // Light-state fields
      enabled: l.enabled ?? !0,
      typeOptions: du.map((v) => ({
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
    stepNumber: Py(e, i),
    stepDuration: t.duration ?? 1e3,
    tweens: a,
    beforeSummary: o.length ? `${o.length} target${o.length !== 1 ? "s" : ""}` : "(none)",
    afterSummary: s.length ? `${s.length} target${s.length !== 1 ? "s" : ""}` : "(none)"
  };
}
c(Gy, "buildStepDetail");
function zy(t, { state: e, expandedTweens: n }) {
  const i = qn(t);
  if (!i) return null;
  if (i.type === "setup") return Ry(e);
  if (i.type === "landing") return Hy(e);
  const r = Za(t, e);
  return r ? r.delay != null ? qy(r) : r.emit != null ? jy(r) : r.sound != null ? By(r) : r.stopSound != null ? Uy(r) : r.parallel != null && i.type === "timeline" ? Vy(r) : Gy(r, t, n, e) : null;
}
c(zy, "buildDetail");
function Wy({ state: t, mutate: e }) {
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
              e(() => new Gt(l));
            else if (l.segments !== void 0) {
              const u = { version: 4, cinematics: { [t.activeCinematicName]: l } };
              e(() => new Gt(u, { cinematicName: t.activeCinematicName }));
            } else if (l.timeline !== void 0) {
              const u = { version: 3, cinematics: { [t.activeCinematicName]: l } };
              e(() => new Gt(u, { cinematicName: t.activeCinematicName }));
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
c(Wy, "showImportDialog");
function eo(t, { state: e, mutate: n }) {
  const i = t === "setup" ? e.setup : e.landing, r = JSON.stringify(i ?? {}, null, 2);
  new Dialog({
    title: `Edit ${t.charAt(0).toUpperCase() + t.slice(1)}`,
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON map of target selector → property overrides:</p>
			<textarea id="cinematic-json-edit" style="width:100%;height:200px;font-family:monospace;font-size:0.8rem">${Mt(r)}</textarea>
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
c(eo, "showEditJsonDialog");
function vu(t, { selectedPath: e, state: n, mutate: i }) {
  const r = Za(e, n);
  if (!r || r.delay != null) return;
  const a = r[t] ?? {}, o = JSON.stringify(a, null, 2);
  new Dialog({
    title: `Edit Step ${t.charAt(0).toUpperCase() + t.slice(1)}`,
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON map of target selector → property overrides:</p>
			<textarea id="cinematic-json-edit" style="width:100%;height:200px;font-family:monospace;font-size:0.8rem">${Mt(o)}</textarea>
		`,
    buttons: {
      save: {
        label: "Apply",
        callback: /* @__PURE__ */ c((s) => {
          var u, d;
          const l = s.find("#cinematic-json-edit").val();
          try {
            const h = JSON.parse(l), f = qn(e);
            (f == null ? void 0 : f.type) === "timeline" ? i((g) => g.updateEntry(f.index, { [t]: h })) : (f == null ? void 0 : f.type) === "branch" && i((g) => g.updateBranchEntry(f.index, f.branchIndex, f.branchEntryIndex, { [t]: h }));
          } catch (h) {
            (d = (u = ui.notifications) == null ? void 0 : u.error) == null || d.call(u, `Invalid JSON: ${h.message}`);
          }
        }, "callback")
      },
      cancel: { label: "Cancel" }
    },
    default: "save"
  }).render(!0);
}
c(vu, "showEditStepStateDialog");
function Yy({ selectedPath: t, state: e, mutate: n }) {
  const i = qn(t);
  if (!i || i.type !== "timeline") return;
  const r = e.timeline[i.index];
  if (!(r != null && r.parallel)) return;
  const a = JSON.stringify(r.parallel.branches ?? [], null, 2);
  new Dialog({
    title: "Edit Parallel Branches",
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON array of branch timelines:</p>
			<textarea id="cinematic-json-edit" style="width:100%;height:250px;font-family:monospace;font-size:0.8rem">${Mt(a)}</textarea>
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
            n((h) => h.updateEntry(i.index, {
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
c(Yy, "showEditParallelJsonDialog");
var qu, In, Pn, Ma, $f;
const vt = class vt extends Un(Bn) {
  constructor(n = {}) {
    super(n);
    k(this, Pn);
    k(this, In, null);
    I(this, In, n.scene ?? canvas.scene ?? null);
  }
  async _prepareContext() {
    var r, a, o;
    const n = m(this, Pn, Ma), i = ((a = n == null ? void 0 : n.getSeenStatus) == null ? void 0 : a.call(n, (r = m(this, In)) == null ? void 0 : r.id)) ?? [];
    return {
      sceneName: ((o = m(this, In)) == null ? void 0 : o.name) ?? "No scene",
      users: i.map((s) => ({
        ...s,
        statusLabel: s.seen ? "Seen" : "Not seen",
        statusClass: s.seen ? "cinematic-tracking__status--seen" : "cinematic-tracking__status--unseen"
      })),
      hasAnyTracked: i.some((s) => s.seen)
    };
  }
  _onRender(n, i) {
    super._onRender(n, i), C(this, Pn, $f).call(this);
  }
};
In = new WeakMap(), Pn = new WeakSet(), Ma = /* @__PURE__ */ c(function() {
  var n, i;
  return (i = (n = game.modules.get(T)) == null ? void 0 : n.api) == null ? void 0 : i.cinematic;
}, "#api"), $f = /* @__PURE__ */ c(function() {
  var i, r;
  const n = this.element;
  n instanceof HTMLElement && (n.querySelectorAll("[data-action='reset-user']").forEach((a) => {
    a.addEventListener("click", async () => {
      var l;
      const o = a.dataset.userId;
      if (!o) return;
      const s = m(this, Pn, Ma);
      s != null && s.resetForUser && (await s.resetForUser((l = m(this, In)) == null ? void 0 : l.id, o), this.render({ force: !0 }));
    });
  }), (i = n.querySelector("[data-action='reset-all']")) == null || i.addEventListener("click", async () => {
    var o;
    const a = m(this, Pn, Ma);
    a != null && a.resetForAll && (await a.resetForAll((o = m(this, In)) == null ? void 0 : o.id), this.render({ force: !0 }));
  }), (r = n.querySelector("[data-action='refresh']")) == null || r.addEventListener("click", () => {
    this.render({ force: !0 });
  }));
}, "#bindEvents"), c(vt, "CinematicTrackingApplication"), ge(vt, "APP_ID", `${T}-cinematic-tracking`), ge(vt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Pe(vt, vt, "DEFAULT_OPTIONS"),
  {
    id: vt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((qu = Pe(vt, vt, "DEFAULT_OPTIONS")) == null ? void 0 : qu.classes) ?? [], "eidolon-cinematic-tracking-window", "themed"])
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
)), ge(vt, "PARTS", {
  content: {
    template: `modules/${T}/templates/cinematic-tracking.html`
  }
});
let $l = vt;
function Ky(t, e) {
  var n, i, r, a, o, s, l, u, d;
  (n = t.querySelector("[data-action='save']")) == null || n.addEventListener("click", () => e.save()), (i = t.querySelector("[data-action='play-preview']")) == null || i.addEventListener("click", () => e.play()), (r = t.querySelector("[data-action='reset-tracking']")) == null || r.addEventListener("click", () => e.resetTracking()), (a = t.querySelector("[data-action='export-json']")) == null || a.addEventListener("click", () => e.exportJSON()), (o = t.querySelector("[data-action='undo']")) == null || o.addEventListener("click", () => e.undo()), (s = t.querySelector("[data-action='redo']")) == null || s.addEventListener("click", () => e.redo()), (l = t.querySelector("[data-action='validate']")) == null || l.addEventListener("click", () => e.validate()), (u = t.querySelector("[data-action='import-json']")) == null || u.addEventListener("click", () => e.importJSON()), (d = t.querySelector("[data-action='open-tracking']")) == null || d.addEventListener("click", () => {
    new $l({ scene: e.scene }).render(!0);
  });
}
c(Ky, "bindToolbarEvents");
function Jy(t, e) {
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
            var l, u, d, h, f, g, p;
            const s = (l = o.find("#cinematic-new-name").val()) == null ? void 0 : l.trim();
            if (!s) {
              (d = (u = ui.notifications) == null ? void 0 : u.warn) == null || d.call(u, "Name cannot be empty.");
              return;
            }
            if (/[.\s]/.test(s)) {
              (f = (h = ui.notifications) == null ? void 0 : h.warn) == null || f.call(h, "Name cannot contain dots or spaces.");
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
      content: `<label style="display:flex;align-items:center;gap:0.5rem"><span>Name:</span><input id="cinematic-rename" type="text" style="flex:1" value="${Mt(o)}" /></label>`,
      buttons: {
        ok: {
          label: "Rename",
          callback: /* @__PURE__ */ c((s) => {
            var u, d, h, f, g, p, y;
            const l = (u = s.find("#cinematic-rename").val()) == null ? void 0 : u.trim();
            if (!l) {
              (h = (d = ui.notifications) == null ? void 0 : d.warn) == null || h.call(d, "Name cannot be empty.");
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
c(Jy, "bindCinematicSelectorEvents");
function Xy(t, e) {
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
        const s = bu(n), l = bu(o);
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
c(Xy, "bindSwimlaneEvents");
function Qy(t, e) {
  var n, i, r, a, o, s, l, u, d, h, f;
  (n = t.querySelector("[data-action='delete-entry']")) == null || n.addEventListener("click", () => {
    const g = e.parseEntryPath(e.selectedPath);
    g && (g.type === "timeline" ? (e.mutate((p) => p.removeEntry(g.index)), e.setSelectedPath(null)) : g.type === "branch" && (e.mutate((p) => p.removeBranchEntry(g.index, g.branchIndex, g.branchEntryIndex)), e.setSelectedPath(null)));
  }), (i = t.querySelector("[data-action='step-duration']")) == null || i.addEventListener("input", (g) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = Number(g.target.value) || 0;
    p.type === "timeline" ? e.mutate((w) => w.updateStepDuration(p.index, y)) : p.type === "branch" && e.mutate((w) => w.updateBranchEntry(p.index, p.branchIndex, p.branchEntryIndex, { duration: Math.max(0, y) }));
  }), (r = t.querySelector("[data-action='add-tween']")) == null || r.addEventListener("click", () => {
    const g = e.parseEntryPath(e.selectedPath);
    if (g) {
      if (g.type === "timeline")
        e.mutate((p) => p.addTween(g.index));
      else if (g.type === "branch") {
        const p = e.getEntryAtPath(e.selectedPath);
        if (!p) return;
        const y = { type: "tile-prop", target: "", attribute: "alpha", value: 1 }, w = [...p.tweens ?? [], y];
        e.mutate((v) => v.updateBranchEntry(g.index, g.branchIndex, g.branchEntryIndex, { tweens: w }));
      }
    }
  }), (a = t.querySelector("[data-action='change-delay']")) == null || a.addEventListener("change", (g) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = Number(g.target.value) || 0;
    p.type === "timeline" ? e.mutate((w) => w.updateEntry(p.index, { delay: y })) : p.type === "branch" && e.mutate((w) => w.updateBranchEntry(p.index, p.branchIndex, p.branchEntryIndex, { delay: y }));
  }), (o = t.querySelector("[data-action='edit-setup']")) == null || o.addEventListener("click", () => {
    eo("setup", { state: e.state, mutate: e.mutate });
  }), (s = t.querySelector("[data-action='edit-landing']")) == null || s.addEventListener("click", () => {
    eo("landing", { state: e.state, mutate: e.mutate });
  }), (l = t.querySelector("[data-action='edit-before']")) == null || l.addEventListener("click", () => {
    vu("before", { selectedPath: e.selectedPath, state: e.state, mutate: e.mutate });
  }), (u = t.querySelector("[data-action='edit-after']")) == null || u.addEventListener("click", () => {
    vu("after", { selectedPath: e.selectedPath, state: e.state, mutate: e.mutate });
  }), (d = t.querySelector("[data-action='change-trigger']")) == null || d.addEventListener("change", (g) => {
    e.mutate((p) => p.setTrigger(g.target.value));
  }), (h = t.querySelector("[data-action='change-tracking']")) == null || h.addEventListener("change", (g) => {
    e.mutate((p) => p.setTracking(g.target.checked));
  }), (f = t.querySelector("[data-action='change-synchronized']")) == null || f.addEventListener("change", (g) => {
    e.mutate((p) => p.setSynchronized(g.target.checked));
  });
}
c(Qy, "bindDetailPanelEvents");
const Yi = /* @__PURE__ */ new WeakMap(), to = /* @__PURE__ */ new Set(), no = /* @__PURE__ */ new Set(), wu = {
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
function io(t, e = {}) {
  var p, y, w;
  if (!t) return !1;
  Ki(t);
  const n = e.mode ?? (e.color != null ? "custom" : "hover"), i = wu[n] ?? wu.hover, r = e.color ?? i.borderColor, a = e.alpha ?? i.borderAlpha, o = e.color ?? i.spriteTint, s = i.spriteAlpha, l = e.pulse ?? i.pulse, u = { border: null, sprite: null, pulseData: null, mode: n }, d = ((p = t.document) == null ? void 0 : p.width) ?? t.w ?? 100, h = ((y = t.document) == null ? void 0 : y.height) ?? t.h ?? 100, f = new PIXI.Graphics();
  f.lineStyle(i.borderWidth, r, a), f.drawRect(0, 0, d, h), t.addChild(f), u.border = f;
  const g = Zy(t, o, s);
  if (g && (canvas.controls.debug.addChild(g), no.add(g), u.sprite = g), l && ((w = canvas.app) != null && w.ticker)) {
    const v = {
      elapsed: 0,
      fn: /* @__PURE__ */ c((b) => {
        v.elapsed += b;
        const E = (Math.sin(v.elapsed * 0.05) + 1) / 2;
        u.border && (u.border.alpha = a * (0.4 + 0.6 * E)), u.sprite && (u.sprite.alpha = s * (0.5 + 0.5 * E));
      }, "fn")
    };
    canvas.app.ticker.add(v.fn), u.pulseData = v, to.add(v);
  }
  return Yi.set(t, u), !0;
}
c(io, "addHighlight");
function Ki(t) {
  var n, i;
  if (!t) return;
  const e = Yi.get(t);
  e && (e.pulseData && ((i = (n = canvas.app) == null ? void 0 : n.ticker) == null || i.remove(e.pulseData.fn), to.delete(e.pulseData)), e.border && (e.border.parent && e.border.parent.removeChild(e.border), e.border.destroy({ children: !0 })), e.sprite && (e.sprite.parent && e.sprite.parent.removeChild(e.sprite), e.sprite.destroy({ children: !0 }), no.delete(e.sprite)), Yi.delete(t));
}
c(Ki, "removeHighlight");
function xf(t) {
  return Yi.has(t);
}
c(xf, "hasHighlight");
function Na() {
  var e, n, i, r, a, o, s;
  for (const l of to)
    (n = (e = canvas.app) == null ? void 0 : e.ticker) == null || n.remove(l.fn);
  to.clear();
  for (const l of no)
    l.parent && l.parent.removeChild(l), l.destroy({ children: !0 });
  no.clear();
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
        const d = Yi.get(u);
        d && (d.border && (d.border.parent && d.border.parent.removeChild(d.border), d.border.destroy({ children: !0 })), Yi.delete(u));
      }
}
c(Na, "clearAllHighlights");
function Zy(t, e, n) {
  var a;
  const i = t.mesh;
  if (!((a = i == null ? void 0 : i.texture) != null && a.baseTexture)) return null;
  const r = PIXI.Sprite.from(i.texture);
  return r.isSprite = !0, r.anchor.set(i.anchor.x, i.anchor.y), r.width = i.width, r.height = i.height, r.scale = i.scale, r.position = t.center, r.angle = i.angle, r.alpha = n, r.tint = e, r.name = "eidolonPickerHighlight", r;
}
c(Zy, "createTintSprite");
let Jn = null;
function Ff(t) {
  var p, y, w;
  Jn && Jn.cancel();
  const { placeableType: e = "Tile", onPick: n, onCancel: i } = t;
  let r = null;
  const a = `control${e}`, o = `hover${e}`, s = /* @__PURE__ */ c((v, b) => {
    var L;
    if (!b) return;
    const E = v.document ?? v;
    (L = v.release) == null || L.call(v), n(E);
  }, "onControl"), l = /* @__PURE__ */ c((v, b) => {
    b ? (r = v, io(v, { mode: "pick" })) : r === v && (Ki(v), r = null);
  }, "onHoverIn"), u = /* @__PURE__ */ c((v) => {
    v.key === "Escape" && (v.preventDefault(), v.stopPropagation(), g());
  }, "onKeydown"), d = /* @__PURE__ */ c((v) => {
    v.preventDefault(), g();
  }, "onContextMenu"), h = Hooks.on(a, s), f = Hooks.on(o, l);
  document.addEventListener("keydown", u, { capture: !0 }), (p = canvas.stage) == null || p.addEventListener("rightclick", d), (w = (y = ui.notifications) == null ? void 0 : y.info) == null || w.call(y, `Pick mode active — click a ${e.toLowerCase()} on the canvas, or press ESC to cancel.`, { permanent: !1 });
  function g() {
    var v;
    Jn && (Jn = null, Hooks.off(a, h), Hooks.off(o, f), document.removeEventListener("keydown", u, { capture: !0 }), (v = canvas.stage) == null || v.removeEventListener("rightclick", d), r && (Ki(r), r = null), i == null || i());
  }
  return c(g, "cancel"), Jn = { cancel: g }, { cancel: g };
}
c(Ff, "enterPickMode");
function dr() {
  Jn && Jn.cancel();
}
c(dr, "cancelPickMode");
const eb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cancelPickMode: dr,
  enterPickMode: Ff
}, Symbol.toStringTag, { value: "Module" }));
var ju, Ae, Ue, Gr, On, zr, Wr, Qe, An, de, Df, xl, Pf, Rf, Hf, Fl, Dl, qf, jf;
const lt = class lt extends Un(Bn) {
  /**
   * @param {object} options
   * @param {string[]} [options.selections]  Initial selections
   * @param {string} [options.placeableType]  "Tile", "Token", etc.
   * @param {(selectors: string[]) => void} [options.onApply]
   * @param {() => void} [options.onCancel]
   */
  constructor(n = {}) {
    super(n);
    k(this, de);
    /** @type {string[]} Current selections (selector strings). */
    k(this, Ae, []);
    /** @type {boolean} Whether pick mode is active. */
    k(this, Ue, !1);
    /** @type {string} Placeable type (Tile, Token, etc.). */
    k(this, Gr, "Tile");
    /** @type {string} Current tag match mode. */
    k(this, On, "any");
    /** @type {((selectors: string[]) => void) | null} */
    k(this, zr, null);
    /** @type {(() => void) | null} */
    k(this, Wr, null);
    /** @type {Promise resolve function for the open() API. */
    k(this, Qe, null);
    /** @type {PlaceableObject | null} Currently hovered tile in the browser. */
    k(this, An, null);
    I(this, Ae, [...n.selections ?? []]), I(this, Gr, n.placeableType ?? "Tile"), I(this, zr, n.onApply ?? null), I(this, Wr, n.onCancel ?? null);
  }
  // ── Context ───────────────────────────────────────────────────────────
  async _prepareContext() {
    var r;
    const n = C(this, de, Fl).call(this), i = (((r = canvas.tiles) == null ? void 0 : r.placeables) ?? []).map((a, o) => {
      var d, h;
      const s = a.document, l = s.id, u = (d = s.texture) != null && d.src ? s.texture.src.split("/").pop().replace(/\.[^.]+$/, "") : `Tile ${o + 1}`;
      return {
        id: l,
        name: u.length > 20 ? u.slice(0, 18) + "..." : u,
        thumbnailSrc: ((h = s.texture) == null ? void 0 : h.src) ?? null,
        selected: n.has(l)
      };
    });
    return {
      selections: m(this, Ae),
      selectionCount: m(this, Ae).length,
      pickModeActive: m(this, Ue),
      tagModeIsAny: m(this, On) === "any",
      tagModeIsAll: m(this, On) === "all",
      tagPreviewCount: 0,
      tiles: i,
      tileCount: i.length
    };
  }
  // ── Render & Events ───────────────────────────────────────────────────
  _onRender(n, i) {
    super._onRender(n, i), C(this, de, Df).call(this), C(this, de, Dl).call(this);
  }
  async _onClose(n) {
    return m(this, Ue) && (dr(), I(this, Ue, !1)), Na(), m(this, Qe) && (m(this, Qe).call(this, null), I(this, Qe, null)), super._onClose(n);
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
      const r = new lt({
        ...n,
        onApply: /* @__PURE__ */ c((a) => i(a), "onApply"),
        onCancel: /* @__PURE__ */ c(() => i(null), "onCancel")
      });
      I(r, Qe, i), r.render(!0);
    });
  }
};
Ae = new WeakMap(), Ue = new WeakMap(), Gr = new WeakMap(), On = new WeakMap(), zr = new WeakMap(), Wr = new WeakMap(), Qe = new WeakMap(), An = new WeakMap(), de = new WeakSet(), Df = /* @__PURE__ */ c(function() {
  var a, o, s, l;
  const n = this.element;
  if (!(n instanceof HTMLElement)) return;
  const i = n.querySelector("[data-role='tag-input']"), r = n.querySelector("[data-role='tag-mode']");
  r == null || r.addEventListener("change", (u) => {
    I(this, On, u.target.value);
  }), i == null || i.addEventListener("input", () => {
    C(this, de, Pf).call(this, n);
  }), i == null || i.addEventListener("keydown", (u) => {
    u.key === "Enter" && (u.preventDefault(), C(this, de, xl).call(this, n));
  }), (a = n.querySelector("[data-action='add-tag-selector']")) == null || a.addEventListener("click", () => {
    C(this, de, xl).call(this, n);
  }), (o = n.querySelector("[data-action='toggle-pick-mode']")) == null || o.addEventListener("click", () => {
    m(this, Ue) ? (dr(), I(this, Ue, !1)) : (I(this, Ue, !0), Ff({
      placeableType: m(this, Gr),
      onPick: /* @__PURE__ */ c((u) => {
        C(this, de, Rf).call(this, u.id);
      }, "onPick"),
      onCancel: /* @__PURE__ */ c(() => {
        I(this, Ue, !1), this.render({ force: !0 });
      }, "onCancel")
    })), this.render({ force: !0 });
  }), n.querySelectorAll("[data-action='toggle-tile']").forEach((u) => {
    u.addEventListener("click", () => {
      const d = u.dataset.docId;
      d && C(this, de, Hf).call(this, d);
    }), u.addEventListener("mouseenter", () => {
      var f, g;
      const d = u.dataset.docId;
      if (!d) return;
      const h = (g = (f = canvas.tiles) == null ? void 0 : f.placeables) == null ? void 0 : g.find((p) => p.document.id === d);
      h && (I(this, An, h), io(h, { mode: "hover" }));
    }), u.addEventListener("mouseleave", () => {
      m(this, An) && (Ki(m(this, An)), I(this, An, null), C(this, de, Dl).call(this));
    });
  }), n.querySelectorAll("[data-action='remove-selection']").forEach((u) => {
    u.addEventListener("click", () => {
      const d = Number(u.dataset.selectionIndex);
      Number.isNaN(d) || (m(this, Ae).splice(d, 1), this.render({ force: !0 }));
    });
  }), (s = n.querySelector("[data-action='apply']")) == null || s.addEventListener("click", () => {
    C(this, de, qf).call(this);
  }), (l = n.querySelector("[data-action='cancel']")) == null || l.addEventListener("click", () => {
    C(this, de, jf).call(this);
  });
}, "#bindEvents"), // ── Tag helpers ───────────────────────────────────────────────────────
xl = /* @__PURE__ */ c(function(n) {
  var s;
  const i = n.querySelector("[data-role='tag-input']"), r = (s = i == null ? void 0 : i.value) == null ? void 0 : s.trim();
  if (!r) return;
  const a = r.split(",").map((l) => l.trim()).filter(Boolean);
  if (a.length === 0) return;
  const o = Cf(a, m(this, On));
  o && !m(this, Ae).includes(o) && m(this, Ae).push(o), i && (i.value = ""), this.render({ force: !0 });
}, "#addTagSelector"), Pf = /* @__PURE__ */ c(function(n) {
  var h, f;
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
  const s = window.Tagger ?? ((h = game.modules.get("tagger")) == null ? void 0 : h.api);
  if (!s) {
    r.textContent = "Tagger not available";
    return;
  }
  const l = m(this, On) === "any", u = s.getByTag(o, {
    sceneId: (f = canvas.scene) == null ? void 0 : f.id,
    matchAny: l
  }), d = (u == null ? void 0 : u.length) ?? 0;
  r.textContent = `${d} matching placeable(s)`;
}, "#updateTagPreview"), // ── ID selector helpers ──────────────────────────────────────────────
Rf = /* @__PURE__ */ c(function(n) {
  const i = `id:${n}`;
  m(this, Ae).includes(i) || (m(this, Ae).push(i), this.render({ force: !0 }));
}, "#addIdSelector"), Hf = /* @__PURE__ */ c(function(n) {
  const i = `id:${n}`, r = m(this, Ae).indexOf(i);
  r >= 0 ? m(this, Ae).splice(r, 1) : m(this, Ae).push(i), this.render({ force: !0 });
}, "#toggleIdSelector"), /**
 * Get the set of document IDs that are currently selected across all selector types.
 * Resolves tag/tags-any/tags-all selectors to find matching document IDs.
 * @returns {Set<string>}
 */
Fl = /* @__PURE__ */ c(function() {
  const n = /* @__PURE__ */ new Set();
  for (const i of m(this, Ae)) {
    const r = gc(i);
    if (r.type === "id") {
      n.add(r.value);
      continue;
    }
    const a = Qo(i);
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
Dl = /* @__PURE__ */ c(function() {
  var r, a;
  const n = C(this, de, Fl).call(this), i = ((r = canvas.tiles) == null ? void 0 : r.placeables) ?? [];
  for (const o of i) {
    const s = (a = o.document) == null ? void 0 : a.id;
    if (!s) continue;
    const l = n.has(s), u = o === m(this, An), d = xf(o);
    l && !u && !d ? io(o, { mode: "selected" }) : !l && d && !u && Ki(o);
  }
}, "#refreshSelectionHighlights"), // ── Apply / Cancel ──────────────────────────────────────────────────
qf = /* @__PURE__ */ c(function() {
  var i;
  m(this, Ue) && (dr(), I(this, Ue, !1)), Na();
  const n = [...m(this, Ae)];
  (i = m(this, zr)) == null || i.call(this, n), m(this, Qe) && (m(this, Qe).call(this, n), I(this, Qe, null)), this.close({ force: !0 });
}, "#doApply"), jf = /* @__PURE__ */ c(function() {
  var n;
  m(this, Ue) && (dr(), I(this, Ue, !1)), Na(), (n = m(this, Wr)) == null || n.call(this), m(this, Qe) && (m(this, Qe).call(this, null), I(this, Qe, null)), this.close({ force: !0 });
}, "#doCancel"), c(lt, "PlaceablePickerApplication"), ge(lt, "APP_ID", `${T}-placeable-picker`), ge(lt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Pe(lt, lt, "DEFAULT_OPTIONS"),
  {
    id: lt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((ju = Pe(lt, lt, "DEFAULT_OPTIONS")) == null ? void 0 : ju.classes) ?? [], "eidolon-placeable-picker-window", "themed"])
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
)), ge(lt, "PARTS", {
  content: {
    template: `modules/${T}/templates/placeable-picker.html`
  }
});
let ro = lt;
function tb(t, e) {
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
      const a = e.getEntryAtPath(e.selectedPath), o = ((d = (u = a == null ? void 0 : a.tweens) == null ? void 0 : u[i]) == null ? void 0 : d.target) ?? "", s = o ? [o] : [], l = await ro.open({ selections: s });
      if (l && l.length > 0) {
        if (r.type === "timeline")
          e.mutate((h) => h.updateTween(r.index, i, { target: l[0] }));
        else if (r.type === "branch") {
          const h = (a.tweens ?? []).map((f, g) => g === i ? { ...f, target: l[0] } : f);
          e.mutate((f) => f.updateBranchEntry(r.index, r.branchIndex, r.branchEntryIndex, { tweens: h }));
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
          const l = kf[s], u = { type: s };
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
c(tb, "bindTweenFieldEvents");
function nb(t, e) {
  var i, r, a, o, s, l, u, d, h, f;
  function n(g, p, y) {
    g.type === "timeline" ? e.mutate((w) => w.updateEntry(g.index, { sound: y })) : g.type === "branch" && e.mutate((w) => w.updateBranchEntry(g.index, g.branchIndex, g.branchEntryIndex, { sound: y }));
  }
  c(n, "applySoundPatch"), (i = t.querySelector("[data-action='change-sound-src']")) == null || i.addEventListener("change", async (g) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = e.getEntryAtPath(e.selectedPath);
    if (!(y != null && y.sound)) return;
    const w = g.target.value, v = { ...y.sound, src: w };
    v.id || (v.id = fu(w));
    const b = await mu(w);
    b > 0 && (v.duration = b), n(p, y, v);
  }), (r = t.querySelector("[data-action='pick-sound-src']")) == null || r.addEventListener("click", () => {
    const g = e.parseEntryPath(e.selectedPath);
    if (!g) return;
    const p = e.getEntryAtPath(e.selectedPath);
    if (!(p != null && p.sound)) return;
    new FilePicker({
      type: "audio",
      current: p.sound.src || "",
      callback: /* @__PURE__ */ c(async (w) => {
        const v = { ...p.sound, src: w };
        v.id || (v.id = fu(w));
        const b = await mu(w);
        b > 0 && (v.duration = b), n(g, p, v);
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
  }), (h = t.querySelector("[data-action='change-sound-fireandforget']")) == null || h.addEventListener("change", (g) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = e.getEntryAtPath(e.selectedPath);
    y != null && y.sound && n(p, y, { ...y.sound, fireAndForget: g.target.checked });
  }), (f = t.querySelector("[data-action='change-stopsound-id']")) == null || f.addEventListener("change", (g) => {
    const p = e.parseEntryPath(e.selectedPath);
    p && (p.type === "timeline" ? e.mutate((y) => y.updateEntry(p.index, { stopSound: g.target.value })) : p.type === "branch" && e.mutate((y) => y.updateBranchEntry(p.index, p.branchIndex, p.branchEntryIndex, { stopSound: g.target.value })));
  });
}
c(nb, "bindSoundFieldEvents");
function ib(t, e) {
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
    Yy({ selectedPath: e.selectedPath, state: e.state, mutate: e.mutate });
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
      !d || d.type !== "timeline" || Number.isNaN(l) || Number.isNaN(u) || e.mutate((h) => h.removeBranchEntry(d.index, l, u));
    });
  });
}
c(ib, "bindSpecialEntryEvents");
function rb(t, e) {
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
c(rb, "bindSegmentGraphEvents");
function ab(t, e) {
  var n, i, r, a, o, s, l;
  (n = t.querySelector("[data-action='change-gate-event']")) == null || n.addEventListener("change", (u) => {
    var h;
    const d = u.target.value;
    if (!d)
      e.setSegmentGate(null);
    else {
      const f = ((h = e.state.activeSegment) == null ? void 0 : h.gate) ?? {};
      e.setSegmentGate({ ...f, event: d });
    }
  }), (i = t.querySelector("[data-action='change-gate-target']")) == null || i.addEventListener("change", (u) => {
    var h;
    const d = (h = e.state.activeSegment) == null ? void 0 : h.gate;
    d && e.setSegmentGate({ ...d, target: u.target.value || void 0 });
  }), (r = t.querySelector("[data-action='pick-gate-target']")) == null || r.addEventListener("click", async () => {
    var h;
    const u = (h = e.state.activeSegment) == null ? void 0 : h.gate;
    if (!u) return;
    const { enterPickMode: d } = await Promise.resolve().then(() => eb);
    d({
      placeableType: "Tile",
      onPick: /* @__PURE__ */ c((f) => {
        var y, w;
        const g = (w = (y = f.flags) == null ? void 0 : y.tagger) == null ? void 0 : w.tags, p = g != null && g.length ? `tag:${g[0]}` : `id:${f.id}`;
        e.setSegmentGate({ ...u, target: p });
      }, "onPick")
    });
  });
  for (const [u, d] of [["change-gate-anim-idle", "idle"], ["change-gate-anim-hover", "hover"], ["change-gate-anim-dim", "dim"]])
    (a = t.querySelector(`[data-action='${u}']`)) == null || a.addEventListener("change", (h) => {
      var v;
      const f = (v = e.state.activeSegment) == null ? void 0 : v.gate;
      if (!f) return;
      const g = h.target.value.trim(), p = g ? g.split(",").map((b) => b.trim()).filter(Boolean) : void 0, y = { ...f.animation ?? {} };
      p != null && p.length ? y[d] = p.length === 1 ? p[0] : p : delete y[d];
      const w = { ...f, animation: Object.keys(y).length ? y : void 0 };
      w.animation || delete w.animation, e.setSegmentGate(w);
    });
  (o = t.querySelector("[data-action='change-segment-next']")) == null || o.addEventListener("change", (u) => {
    const d = u.target.value;
    e.setSegmentNext(d || null);
  }), (s = t.querySelector("[data-action='edit-segment-setup']")) == null || s.addEventListener("click", () => {
    eo("setup", { state: e.state, mutate: e.mutate });
  }), (l = t.querySelector("[data-action='edit-segment-landing']")) == null || l.addEventListener("click", () => {
    eo("landing", { state: e.state, mutate: e.mutate });
  });
}
c(ab, "bindSegmentDetailEvents");
var Bu, Ve, z, Ze, kn, Tt, et, Ge, Fo, $e, tt, Do, ln, Gi, dt, di, Mn, fi, j, Bf, Uf, Vf, Gf, bn, Rl, Hl, ql, jl, zf, vn, Bl, Wf, Yf, Kf, Jf, Xf, Ul, fr;
const wt = class wt extends Un(Bn) {
  constructor(n = {}) {
    super(n);
    k(this, j);
    k(this, Ve, null);
    k(this, z, null);
    k(this, Ze, null);
    k(this, kn, /* @__PURE__ */ new Set());
    k(this, Tt, !1);
    k(this, et, null);
    k(this, Ge, null);
    k(this, Fo, 120);
    k(this, $e, []);
    k(this, tt, -1);
    k(this, Do, 50);
    k(this, ln, null);
    k(this, Gi, null);
    k(this, dt, null);
    k(this, di, null);
    k(this, Mn, null);
    k(this, fi, null);
    I(this, Ve, n.scene ?? canvas.scene ?? null), I(this, z, Gt.fromScene(m(this, Ve)));
  }
  // ── Context ───────────────────────────────────────────────────────────
  async _prepareContext() {
    var g, p;
    const n = Fy(m(this, z), m(this, z).activeSegmentName), i = $y(m(this, z).timeline, {
      selectedPath: m(this, Ze),
      windowWidth: ((g = this.position) == null ? void 0 : g.width) ?? 1100
    }), r = m(this, Ze) != null ? zy(m(this, Ze), { state: m(this, z), expandedTweens: m(this, kn) }) : null, a = m(this, z).listCinematicNames(), o = m(this, z).activeCinematicName, l = m(this, z).listSegmentNames().length > 1, u = m(this, z).activeSegment, d = (u == null ? void 0 : u.gate) ?? null, h = (u == null ? void 0 : u.next) ?? null, f = typeof h == "string" ? h : (h == null ? void 0 : h.segment) ?? null;
    return {
      // Toolbar
      sceneName: ((p = m(this, Ve)) == null ? void 0 : p.name) ?? "No scene",
      dirty: m(this, Tt),
      canUndo: m(this, j, Rl),
      canRedo: m(this, j, Hl),
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
      activeSegmentName: m(this, z).activeSegmentName,
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
      trigger: m(this, z).trigger,
      tracking: m(this, z).tracking,
      synchronized: m(this, z).synchronized,
      triggerOptions: Ly.map((y) => ({
        ...y,
        selected: y.value === m(this, z).trigger
      })),
      entryCount: m(this, z).timeline.length,
      totalDuration: i.totalDurationMs,
      targetCount: Dy(m(this, z)),
      setupCount: Object.keys(m(this, z).setup ?? {}).length,
      landingCount: Object.keys(m(this, z).landing ?? {}).length
    };
  }
  // ── Render & Events ───────────────────────────────────────────────────
  _onRender(n, i) {
    var r, a, o;
    if (super._onRender(n, i), C(this, j, Bf).call(this), !m(this, di)) {
      const s = (a = (r = game.modules.get(T)) == null ? void 0 : r.api) == null ? void 0 : a.cinematic;
      s != null && s.onPlaybackProgress ? (I(this, di, s.onPlaybackProgress((l) => C(this, j, Xf).call(this, l))), console.log("[cinematic-editor] Subscribed to playback progress events")) : console.warn("[cinematic-editor] onPlaybackProgress not available on API", s);
    }
    if (m(this, fi) && ((o = this.element) == null || o.querySelectorAll(".cinematic-editor__segment-node").forEach((s) => {
      s.classList.toggle("cinematic-editor__segment-node--playing", s.dataset.segmentName === m(this, fi));
    }), m(this, dt) && m(this, dt).segmentName === m(this, z).activeSegmentName)) {
      const s = performance.now() - m(this, dt).startTime;
      m(this, dt).durationMs - s > 0 && C(this, j, Ul).call(this, m(this, dt).durationMs, m(this, dt).startTime);
    }
    m(this, ln) || (I(this, ln, (s) => {
      !s.ctrlKey && !s.metaKey || (s.key === "z" && !s.shiftKey ? (s.preventDefault(), C(this, j, ql).call(this)) : (s.key === "z" && s.shiftKey || s.key === "y") && (s.preventDefault(), C(this, j, jl).call(this)));
    }), document.addEventListener("keydown", m(this, ln)));
  }
  async close(n = {}) {
    if (m(this, Ge) && C(this, j, vn).call(this), m(this, Tt) && !n.force) {
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
      i === "save" && await C(this, j, Bl).call(this);
    }
    return super.close(n);
  }
  async _onClose(n) {
    var i;
    return m(this, et) !== null && (clearTimeout(m(this, et)), I(this, et, null)), m(this, ln) && (document.removeEventListener("keydown", m(this, ln)), I(this, ln, null)), (i = m(this, di)) == null || i.call(this), I(this, di, null), C(this, j, fr).call(this), super._onClose(n);
  }
};
Ve = new WeakMap(), z = new WeakMap(), Ze = new WeakMap(), kn = new WeakMap(), Tt = new WeakMap(), et = new WeakMap(), Ge = new WeakMap(), Fo = new WeakMap(), $e = new WeakMap(), tt = new WeakMap(), Do = new WeakMap(), ln = new WeakMap(), Gi = new WeakMap(), dt = new WeakMap(), di = new WeakMap(), Mn = new WeakMap(), fi = new WeakMap(), j = new WeakSet(), // ── Event binding ─────────────────────────────────────────────────────
Bf = /* @__PURE__ */ c(function() {
  const n = this.element;
  if (!(n instanceof HTMLElement)) return;
  const i = C(this, j, Uf).call(this);
  Ky(n, i), Jy(n, i), rb(n, i), Xy(n, i), Qy(n, i), tb(n, i), nb(n, i), ib(n, i), ab(n, i);
}, "#bindEvents"), Uf = /* @__PURE__ */ c(function() {
  const n = this;
  return {
    // State access (read-only getters — closures over `self` for private field access)
    get state() {
      return m(n, z);
    },
    get selectedPath() {
      return m(n, Ze);
    },
    get scene() {
      return m(n, Ve);
    },
    get expandedTweens() {
      return m(n, kn);
    },
    get insertMenuState() {
      return m(n, Gi);
    },
    // Mutations
    mutate: /* @__PURE__ */ c((i) => C(this, j, bn).call(this, i), "mutate"),
    setSelectedPath: /* @__PURE__ */ c((i) => {
      I(this, Ze, i), this.render({ force: !0 });
    }, "setSelectedPath"),
    render: /* @__PURE__ */ c(() => this.render({ force: !0 }), "render"),
    // Cinematic switching (needs full state swap + clear)
    switchCinematic: /* @__PURE__ */ c((i) => {
      m(this, Ge) && C(this, j, vn).call(this), I(this, z, m(this, z).switchCinematic(i)), I(this, Ze, null), m(this, kn).clear(), this.render({ force: !0 });
    }, "switchCinematic"),
    // Segment management
    selectSegment: /* @__PURE__ */ c((i) => {
      m(this, Ge) && C(this, j, vn).call(this), I(this, z, m(this, z).switchSegment(i)), I(this, Ze, null), m(this, kn).clear(), this.render({ force: !0 });
    }, "selectSegment"),
    addSegment: /* @__PURE__ */ c((i) => {
      C(this, j, bn).call(this, (r) => r.addSegment(i, r.activeSegmentName));
    }, "addSegment"),
    removeSegment: /* @__PURE__ */ c((i) => {
      C(this, j, bn).call(this, (r) => r.removeSegment(i));
    }, "removeSegment"),
    renameSegment: /* @__PURE__ */ c((i, r) => {
      C(this, j, bn).call(this, (a) => a.renameSegment(i, r));
    }, "renameSegment"),
    setSegmentGate: /* @__PURE__ */ c((i) => {
      C(this, j, bn).call(this, (r) => r.setSegmentGate(i));
    }, "setSegmentGate"),
    setSegmentNext: /* @__PURE__ */ c((i) => {
      C(this, j, bn).call(this, (r) => r.setSegmentNext(i));
    }, "setSegmentNext"),
    // Tween debouncing
    queueTweenChange: /* @__PURE__ */ c((i, r) => C(this, j, zf).call(this, i, r), "queueTweenChange"),
    flushTweenChanges: /* @__PURE__ */ c(() => {
      m(this, Ge) && C(this, j, vn).call(this);
    }, "flushTweenChanges"),
    flushTweenChangesImmediate: /* @__PURE__ */ c(() => {
      m(this, et) !== null && clearTimeout(m(this, et)), I(this, et, null), C(this, j, vn).call(this);
    }, "flushTweenChangesImmediate"),
    // Path utilities
    parseEntryPath: qn,
    getEntryAtPath: /* @__PURE__ */ c((i) => Za(i, m(this, z)), "getEntryAtPath"),
    // Insert menu
    showInsertMenu: /* @__PURE__ */ c((i, r, a) => C(this, j, Vf).call(this, i, r, a), "showInsertMenu"),
    hideInsertMenu: /* @__PURE__ */ c(() => C(this, j, Gf).call(this), "hideInsertMenu"),
    // Toolbar actions
    save: /* @__PURE__ */ c(() => C(this, j, Bl).call(this), "save"),
    play: /* @__PURE__ */ c(() => C(this, j, Wf).call(this), "play"),
    resetTracking: /* @__PURE__ */ c(() => C(this, j, Yf).call(this), "resetTracking"),
    exportJSON: /* @__PURE__ */ c(() => C(this, j, Kf).call(this), "exportJSON"),
    validate: /* @__PURE__ */ c(() => C(this, j, Jf).call(this), "validate"),
    importJSON: /* @__PURE__ */ c(() => Wy({ state: m(this, z), mutate: /* @__PURE__ */ c((i) => C(this, j, bn).call(this, i), "mutate") }), "importJSON"),
    undo: /* @__PURE__ */ c(() => C(this, j, ql).call(this), "undo"),
    redo: /* @__PURE__ */ c(() => C(this, j, jl).call(this), "redo")
  };
}, "#createEventContext"), // ── Insert menu ───────────────────────────────────────────────────────
Vf = /* @__PURE__ */ c(function(n, i, r) {
  var l;
  const a = (l = this.element) == null ? void 0 : l.querySelector(".cinematic-editor__insert-menu");
  if (!a) return;
  const o = n.getBoundingClientRect();
  document.body.appendChild(a), a.style.display = "", a.style.position = "fixed", a.style.left = `${o.left}px`;
  const s = a.offsetHeight || 200;
  o.bottom + 4 + s > window.innerHeight ? a.style.top = `${o.top - s - 4}px` : a.style.top = `${o.bottom + 4}px`, I(this, Gi, { insertIndex: i, lane: r });
}, "#showInsertMenu"), Gf = /* @__PURE__ */ c(function() {
  var i, r;
  const n = document.body.querySelector(".cinematic-editor__insert-menu") ?? ((i = this.element) == null ? void 0 : i.querySelector(".cinematic-editor__insert-menu"));
  if (n) {
    n.style.display = "none";
    const a = (r = this.element) == null ? void 0 : r.querySelector(".cinematic-editor");
    a && n.parentNode !== a && a.appendChild(n);
  }
  I(this, Gi, null);
}, "#hideInsertMenu"), // ── State mutation ────────────────────────────────────────────────────
bn = /* @__PURE__ */ c(function(n) {
  I(this, $e, m(this, $e).slice(0, m(this, tt) + 1)), m(this, $e).push(m(this, z)), m(this, $e).length > m(this, Do) && m(this, $e).shift(), I(this, tt, m(this, $e).length - 1), I(this, z, n(m(this, z))), I(this, Tt, !0), this.render({ force: !0 });
}, "#mutate"), Rl = /* @__PURE__ */ c(function() {
  return m(this, tt) >= 0;
}, "#canUndo"), Hl = /* @__PURE__ */ c(function() {
  return m(this, tt) < m(this, $e).length - 1;
}, "#canRedo"), ql = /* @__PURE__ */ c(function() {
  m(this, j, Rl) && (m(this, tt) === m(this, $e).length - 1 && m(this, $e).push(m(this, z)), I(this, z, m(this, $e)[m(this, tt)]), is(this, tt)._--, I(this, Tt, !0), this.render({ force: !0 }));
}, "#undo"), jl = /* @__PURE__ */ c(function() {
  m(this, j, Hl) && (is(this, tt)._++, I(this, z, m(this, $e)[m(this, tt) + 1]), I(this, Tt, !0), this.render({ force: !0 }));
}, "#redo"), zf = /* @__PURE__ */ c(function(n, i) {
  var r;
  m(this, Ze) != null && (I(this, Ge, {
    ...m(this, Ge) ?? {},
    entryPath: m(this, Ze),
    tweenIndex: n,
    patch: { ...((r = m(this, Ge)) == null ? void 0 : r.patch) ?? {}, ...i }
  }), m(this, et) !== null && clearTimeout(m(this, et)), I(this, et, setTimeout(() => {
    I(this, et, null), C(this, j, vn).call(this);
  }, m(this, Fo))));
}, "#queueTweenChange"), vn = /* @__PURE__ */ c(function() {
  if (!m(this, Ge)) return;
  const { entryPath: n, tweenIndex: i, patch: r } = m(this, Ge);
  I(this, Ge, null);
  const a = qn(n);
  if (a) {
    if (a.type === "timeline")
      I(this, z, m(this, z).updateTween(a.index, i, r));
    else if (a.type === "branch") {
      const o = Za(n, m(this, z));
      if (o) {
        const s = (o.tweens ?? []).map((l, u) => u === i ? { ...l, ...r } : l);
        I(this, z, m(this, z).updateBranchEntry(a.index, a.branchIndex, a.branchEntryIndex, { tweens: s }));
      }
    }
    I(this, Tt, !0);
  }
}, "#flushTweenChanges"), Bl = /* @__PURE__ */ c(async function() {
  var n, i, r, a, o, s;
  if (m(this, Ve)) {
    if (m(this, Ge) && C(this, j, vn).call(this), m(this, z).isStale(m(this, Ve))) {
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
        I(this, z, Gt.fromScene(m(this, Ve), m(this, z).activeCinematicName)), I(this, Tt, !1), I(this, $e, []), I(this, tt, -1), this.render({ force: !0 }), (i = (n = ui.notifications) == null ? void 0 : n.info) == null || i.call(n, "Cinematic reloaded from scene.");
        return;
      }
      if (!l) return;
    }
    try {
      await m(this, z).save(m(this, Ve)), I(this, z, Gt.fromScene(m(this, Ve), m(this, z).activeCinematicName)), I(this, Tt, !1), (a = (r = ui.notifications) == null ? void 0 : r.info) == null || a.call(r, "Cinematic saved."), this.render({ force: !0 });
    } catch (l) {
      console.error(`${T} | Cinematic save failed`, l), (s = (o = ui.notifications) == null ? void 0 : o.error) == null || s.call(o, "Failed to save cinematic data.");
    }
  }
}, "#onSave"), Wf = /* @__PURE__ */ c(async function() {
  var i, r, a, o, s;
  const n = (r = (i = game.modules.get(T)) == null ? void 0 : i.api) == null ? void 0 : r.cinematic;
  if (!(n != null && n.play)) {
    (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, "Cinematic API not available.");
    return;
  }
  await n.play((s = m(this, Ve)) == null ? void 0 : s.id, m(this, z).activeCinematicName);
}, "#onPlay"), Yf = /* @__PURE__ */ c(async function() {
  var i, r, a, o, s;
  const n = (r = (i = game.modules.get(T)) == null ? void 0 : i.api) == null ? void 0 : r.cinematic;
  n != null && n.reset && (await n.reset((a = m(this, Ve)) == null ? void 0 : a.id, m(this, z).activeCinematicName), (s = (o = ui.notifications) == null ? void 0 : o.info) == null || s.call(o, "Cinematic tracking reset."));
}, "#onResetTracking"), Kf = /* @__PURE__ */ c(async function() {
  var i, r;
  const n = JSON.stringify(m(this, z).toJSON(), null, 2);
  try {
    await navigator.clipboard.writeText(n), (r = (i = ui.notifications) == null ? void 0 : i.info) == null || r.call(i, "Cinematic JSON copied to clipboard.");
  } catch {
    new Dialog({
      title: "Cinematic JSON",
      content: `<textarea style="width:100%;height:300px;font-family:monospace;font-size:0.8rem">${Mt(n)}</textarea>`,
      buttons: { ok: { label: "Close" } }
    }).render(!0);
  }
}, "#onExportJSON"), Jf = /* @__PURE__ */ c(function() {
  var l, u;
  const n = m(this, z).toJSON(), { targets: i, unresolved: r } = Qa(n), a = Ty(n, i), o = [
    ...r.map((d) => ({ path: "targets", level: "warn", message: `Unresolved target: "${d}"` })),
    ...a
  ];
  if (o.length === 0) {
    (u = (l = ui.notifications) == null ? void 0 : l.info) == null || u.call(l, "Cinematic validation passed — no issues found.");
    return;
  }
  const s = o.map((d) => {
    const h = d.level === "error" ? "fa-circle-xmark" : "fa-triangle-exclamation", f = d.level === "error" ? "#e74c3c" : "#f39c12";
    return `<li style="margin:0.3rem 0"><i class="fa-solid ${h}" style="color:${f};margin-right:0.3rem"></i><strong>${Mt(d.path)}</strong>: ${Mt(d.message)}</li>`;
  });
  new Dialog({
    title: "Cinematic Validation",
    content: `<p>${o.length} issue(s) found:</p><ul style="list-style:none;padding:0;max-height:300px;overflow:auto">${s.join("")}</ul>`,
    buttons: { ok: { label: "Close" } }
  }).render(!0);
}, "#onValidate"), // ── Playback progress ────────────────────────────────────────────────
Xf = /* @__PURE__ */ c(function(n) {
  var i, r, a, o, s, l;
  switch (console.log(`[cinematic-editor] playback event: ${n.type}`, n), n.type) {
    case "segment-start":
      I(this, fi, n.segmentName), n.segmentName !== m(this, z).activeSegmentName ? (I(this, z, m(this, z).switchSegment(n.segmentName)), I(this, Ze, null), m(this, kn).clear(), this.render({ force: !0 })) : (i = this.element) == null || i.querySelectorAll(".cinematic-editor__segment-node").forEach((u) => {
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
      I(this, dt, { segmentName: n.segmentName, startTime: performance.now(), durationMs: n.durationMs }), n.segmentName === m(this, z).activeSegmentName && C(this, j, Ul).call(this, n.durationMs);
      break;
    case "timeline-end":
      C(this, j, fr).call(this), I(this, dt, null);
      break;
    case "playback-end":
      C(this, j, fr).call(this), I(this, dt, null), I(this, fi, null), (l = this.element) == null || l.querySelectorAll(".cinematic-editor__segment-node--playing, .cinematic-editor__segment-node--gate-waiting").forEach((u) => {
        u.classList.remove("cinematic-editor__segment-node--playing", "cinematic-editor__segment-node--gate-waiting");
      });
      break;
  }
}, "#onPlaybackEvent"), Ul = /* @__PURE__ */ c(function(n, i = null) {
  var u, d;
  C(this, j, fr).call(this);
  const r = (u = this.element) == null ? void 0 : u.querySelector(".cinematic-editor__playback-cursor"), a = (d = this.element) == null ? void 0 : d.querySelector(".cinematic-editor__swimlane");
  if (console.log(`[cinematic-editor] startCursor: duration=${n}, cursor=${!!r}, swimlane=${!!a}, width=${a == null ? void 0 : a.scrollWidth}`), !r || !a || n <= 0) return;
  r.style.display = "block";
  const o = i ?? performance.now(), s = a.scrollWidth, l = /* @__PURE__ */ c(() => {
    const h = performance.now() - o, f = Math.min(h / n, 1), g = Ir + f * (s - Ir);
    r.style.left = `${g}px`, f < 1 && I(this, Mn, requestAnimationFrame(l));
  }, "tick");
  I(this, Mn, requestAnimationFrame(l));
}, "#startCursorAnimation"), fr = /* @__PURE__ */ c(function() {
  var i;
  m(this, Mn) && (cancelAnimationFrame(m(this, Mn)), I(this, Mn, null));
  const n = (i = this.element) == null ? void 0 : i.querySelector(".cinematic-editor__playback-cursor");
  n && (n.style.display = "none");
}, "#stopCursorAnimation"), c(wt, "CinematicEditorApplication"), ge(wt, "APP_ID", `${T}-cinematic-editor`), ge(wt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Pe(wt, wt, "DEFAULT_OPTIONS"),
  {
    id: wt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Bu = Pe(wt, wt, "DEFAULT_OPTIONS")) == null ? void 0 : Bu.classes) ?? [], "eidolon-cinematic-editor-window", "themed"])
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
)), ge(wt, "PARTS", {
  content: {
    template: `modules/${T}/templates/cinematic-editor.html`
  }
});
let Pl = wt;
const Qf = /* @__PURE__ */ new Map();
function ye(t, e) {
  Qf.set(t, e);
}
c(ye, "registerBehaviour");
function Vl(t) {
  return Qf.get(t);
}
c(Vl, "getBehaviour");
function ob(t, e, n) {
  let i, r, a;
  if (e === 0)
    i = r = a = n;
  else {
    const o = /* @__PURE__ */ c((u, d, h) => (h < 0 && (h += 1), h > 1 && (h -= 1), h < 0.16666666666666666 ? u + (d - u) * 6 * h : h < 0.5 ? d : h < 0.6666666666666666 ? u + (d - u) * (0.6666666666666666 - h) * 6 : u), "hue2rgb"), s = n < 0.5 ? n * (1 + e) : n + e - n * e, l = 2 * n - s;
    i = o(l, s, t + 1 / 3), r = o(l, s, t), a = o(l, s, t - 1 / 3);
  }
  return Math.round(i * 255) << 16 | Math.round(r * 255) << 8 | Math.round(a * 255);
}
c(ob, "hslToInt");
ye("float", (t, e = {}) => {
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
ye("pulse", (t, e = {}) => {
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
ye("scale", (t, e = {}) => {
  const n = t.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.factor ?? 1.12, r = e.durationFrames ?? 15, a = Yt(e.easing ?? "easeOutCubic"), o = n.scale.x, s = n.scale.y, l = o * i, u = s * i;
  let d = 0;
  return {
    update(h) {
      if (d < r) {
        d += h;
        const f = Math.min(d / r, 1), g = a(f);
        n.scale.x = o + (l - o) * g, n.scale.y = s + (u - s) * g;
      }
    },
    detach() {
      n.scale.x = o, n.scale.y = s;
    }
  };
});
ye("glow", (t, e = {}) => {
  var y, w;
  const n = t.mesh;
  if (!((y = n == null ? void 0 : n.texture) != null && y.baseTexture)) return { update() {
  }, detach() {
  } };
  const i = t.document, r = e.color ?? 4513279, a = e.alpha ?? 0.5, o = e.blur ?? 8, s = e.pulseSpeed ?? 0.03, l = Math.abs(i.width), u = Math.abs(i.height), d = PIXI.Sprite.from(n.texture);
  d.anchor.set(0.5, 0.5), d.scale.set(n.scale.x, n.scale.y), d.position.set(l / 2, u / 2), d.angle = i.rotation ?? 0, d.alpha = a, d.tint = r;
  const h = PIXI.BlurFilter ?? ((w = PIXI.filters) == null ? void 0 : w.BlurFilter), f = new h(o);
  d.filters = [f], t.addChildAt(d, 0);
  const g = n.angle;
  let p = 0;
  return {
    update(v) {
      p += v;
      const b = (Math.sin(p * s) + 1) / 2;
      d.visible = n.visible !== !1, d.alpha = a * (0.5 + 0.5 * b) * (n.alpha ?? 1), d.scale.set(n.scale.x, n.scale.y), d.angle = (i.rotation ?? 0) + (n.angle - g);
    },
    detach() {
      d.parent && d.parent.removeChild(d), d.destroy({ children: !0 });
    }
  };
});
ye("wobble", (t, e = {}) => {
  const n = t.mesh;
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
ye("colorCycle", (t, e = {}) => {
  const n = t.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.speed ?? 5e-3, r = e.saturation ?? 0.6, a = e.lightness ?? 0.6, o = n.tint;
  let s = 0;
  return {
    update(l) {
      s = (s + l * i) % 1, n.tint = ob(s, r, a);
    },
    detach() {
      n.tint = o;
    }
  };
});
ye("spin", (t, e = {}) => {
  const n = t.mesh;
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
ye("bounce", (t, e = {}) => {
  const n = t.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.speed ?? 0.02, r = e.amplitude ?? 6, a = Yt("easeOutBounce"), o = n.position.y;
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
ye("borderTrace", (t, e = {}) => {
  const n = t.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), a = Math.abs(i.height), o = 2 * (r + a), s = e.speed ?? 1.5, l = e.length ?? 60, u = e.color ?? 4513279, d = e.alpha ?? 0.8, h = e.lineWidth ?? 2, f = new PIXI.Graphics();
  f.alpha = d, f.pivot.set(r / 2, a / 2), f.position.set(r / 2, a / 2), t.addChildAt(f, 0);
  const g = n.scale.x, p = n.scale.y, y = n.angle;
  let w = 0;
  function v(b) {
    return b = (b % o + o) % o, b < r ? { x: b, y: 0 } : (b -= r, b < a ? { x: r, y: b } : (b -= a, b < r ? { x: r - b, y: a } : (b -= r, { x: 0, y: a - b })));
  }
  return c(v, "perimeterPoint"), {
    update(b) {
      w = (w + b * s) % o, f.visible = n.visible !== !1, f.alpha = d * (n.alpha ?? 1), f.scale.set(n.scale.x / g, n.scale.y / p), f.angle = n.angle - y, f.clear(), f.lineStyle(h, u, 1);
      const E = 16, L = l / E, A = v(w);
      f.moveTo(A.x, A.y);
      for (let O = 1; O <= E; O++) {
        const M = v(w + O * L);
        f.lineTo(M.x, M.y);
      }
    },
    detach() {
      f.parent && f.parent.removeChild(f), f.destroy({ children: !0 });
    }
  };
});
ye("shimmer", (t, e = {}) => {
  const n = t.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), a = Math.abs(i.height), o = e.speed ?? 1, s = e.bandWidth ?? 40, l = e.alpha ?? 0.15, u = e.pause ?? 120, d = r + a + s, h = d + u * o, f = new PIXI.Container();
  f.pivot.set(r / 2, a / 2), f.position.set(r / 2, a / 2);
  const g = new PIXI.Graphics();
  g.alpha = l;
  const p = new PIXI.Graphics();
  p.beginFill(16777215), p.drawRect(0, 0, r, a), p.endFill(), f.addChild(p), g.mask = p, f.addChild(g), t.addChild(f);
  const y = n.scale.x, w = n.scale.y, v = n.angle;
  let b = 0;
  return {
    update(E) {
      if (b = (b + E * o) % h, f.visible = n.visible !== !1, f.scale.set(n.scale.x / y, n.scale.y / w), f.angle = n.angle - v, g.alpha = l * (n.alpha ?? 1), g.clear(), b < d) {
        const L = b - s;
        g.beginFill(16777215, 1), g.moveTo(L, 0), g.lineTo(L + s, 0), g.lineTo(L + s - a, a), g.lineTo(L - a, a), g.closePath(), g.endFill();
      }
    },
    detach() {
      g.mask = null, f.parent && f.parent.removeChild(f), f.destroy({ children: !0 });
    }
  };
});
ye("breathe", (t, e = {}) => {
  const n = t.mesh;
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
ye("tiltFollow", (t, e = {}) => {
  const n = t.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.maxAngle ?? 3, r = e.smoothing ?? 0.15, a = t.document, o = n.angle;
  let s = 0;
  return {
    update() {
      const l = canvas.mousePosition;
      if (!l) return;
      const u = Math.abs(a.width), d = a.x + u / 2, h = l.x - d, f = Math.max(-i, Math.min(i, h / (u / 2) * i));
      s += (f - s) * r, n.angle = o + s;
    },
    detach() {
      n.angle = o;
    }
  };
});
ye("slideReveal", (t, e = {}, n) => {
  const i = t.mesh;
  if (!i) return { update() {
  }, detach() {
  } };
  if (n) return { update() {
  }, detach() {
  } };
  const r = e.offsetX ?? 0, a = e.offsetY ?? 20, o = e.durationFrames ?? 20, s = Yt(e.easing ?? "easeOutCubic"), l = e.delay ?? 0, u = i.position.x, d = i.position.y, h = i.alpha;
  i.position.x = u + r, i.position.y = d + a, i.alpha = 0;
  let f = -l;
  return {
    update(g) {
      if (f += g, f < 0) return;
      if (f >= o) {
        i.position.x = u, i.position.y = d, i.alpha = h;
        return;
      }
      const p = Math.min(f / o, 1), y = s(p);
      i.position.x = u + r * (1 - y), i.position.y = d + a * (1 - y), i.alpha = h * y;
    },
    detach() {
      i.position.x = u, i.position.y = d, i.alpha = h;
    }
  };
});
ye("embers", (t, e = {}) => {
  const n = t.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), a = Math.abs(i.height), o = e.count ?? 12, s = e.speed ?? 0.5, l = e.color ?? 16737792, u = e.alpha ?? 0.6, d = e.size ?? 2, h = new PIXI.Container();
  h.pivot.set(r / 2, a / 2), h.position.set(r / 2, a / 2);
  const f = new PIXI.Graphics();
  h.addChild(f), t.addChild(h);
  const g = n.scale.x, p = n.scale.y, y = n.angle, w = [];
  function v() {
    const b = Math.random();
    let E, L;
    return b < 0.7 ? (E = Math.random() * r, L = a) : b < 0.85 ? (E = 0, L = a * 0.5 + Math.random() * a * 0.5) : (E = r, L = a * 0.5 + Math.random() * a * 0.5), {
      x: E,
      y: L,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -s * (0.5 + Math.random() * 0.5),
      life: 0,
      maxLife: 40 + Math.random() * 60,
      size: d * (0.5 + Math.random() * 0.5)
    };
  }
  return c(v, "spawnParticle"), {
    update(b) {
      h.visible = n.visible !== !1, h.scale.set(n.scale.x / g, n.scale.y / p), h.angle = n.angle - y, w.length < o && w.push(v());
      for (let E = w.length - 1; E >= 0; E--) {
        const L = w[E];
        if (L.life += b, L.life >= L.maxLife) {
          w.splice(E, 1);
          continue;
        }
        L.x += L.vx * b, L.y += L.vy * b, L.vx += (Math.random() - 0.5) * 0.05 * b;
      }
      f.clear();
      for (const E of w) {
        const L = 1 - E.life / E.maxLife;
        f.beginFill(l, u * L * (n.alpha ?? 1)), f.drawCircle(E.x, E.y, E.size), f.endFill();
      }
    },
    detach() {
      h.parent && h.parent.removeChild(h), h.destroy({ children: !0 });
    }
  };
});
ye("runeGlow", (t, e = {}) => {
  const n = t.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), a = Math.abs(i.height), o = 2 * (r + a), s = e.dots ?? 3, l = e.speed ?? 1.2, u = e.color ?? 4513279, d = e.color2 ?? 8930559, h = e.radius ?? 3, f = e.alpha ?? 0.7, g = new PIXI.Graphics();
  g.pivot.set(r / 2, a / 2), g.position.set(r / 2, a / 2), t.addChildAt(g, 0);
  const p = n.scale.x, y = n.scale.y, w = n.angle, v = [];
  for (let L = 0; L < s; L++)
    v.push({
      phase: L / s * o,
      speedMul: 0.7 + Math.random() * 0.6,
      color: L % 2 === 0 ? u : d
    });
  function b(L) {
    return L = (L % o + o) % o, L < r ? { x: L, y: 0 } : (L -= r, L < a ? { x: r, y: L } : (L -= a, L < r ? { x: r - L, y: a } : (L -= r, { x: 0, y: a - L })));
  }
  c(b, "perimeterPoint");
  let E = 0;
  return {
    update(L) {
      E += L, g.visible = n.visible !== !1, g.alpha = f * (n.alpha ?? 1), g.scale.set(n.scale.x / p, n.scale.y / y), g.angle = n.angle - w, g.clear();
      for (const A of v) {
        const O = b(A.phase + E * l * A.speedMul);
        g.beginFill(A.color, 1), g.drawCircle(O.x, O.y, h), g.endFill();
      }
    },
    detach() {
      g.parent && g.parent.removeChild(g), g.destroy({ children: !0 });
    }
  };
});
ye("ripple", (t, e = {}) => {
  const n = t.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), a = Math.abs(i.height), o = e.maxRadius ?? Math.sqrt(r * r + a * a) / 2, s = e.rings ?? 3, l = e.interval ?? 30, u = e.speed ?? 1.5, d = e.color ?? 4513279, h = e.alpha ?? 0.4, f = e.lineWidth ?? 1.5, g = new PIXI.Container();
  g.pivot.set(r / 2, a / 2), g.position.set(r / 2, a / 2);
  const p = new PIXI.Graphics();
  g.addChild(p), t.addChild(g);
  const y = n.scale.x, w = n.scale.y, v = n.angle, b = [];
  let E = 0, L = 0;
  return {
    update(A) {
      E += A, g.visible = n.visible !== !1, g.scale.set(n.scale.x / y, n.scale.y / w), g.angle = n.angle - v, E >= L && b.length < s && (b.push({ radius: 0, alpha: h }), L = E + l);
      for (let x = b.length - 1; x >= 0; x--) {
        const R = b[x];
        R.radius += u * A, R.alpha = h * (1 - R.radius / o), R.radius >= o && b.splice(x, 1);
      }
      p.clear();
      const O = r / 2, M = a / 2;
      for (const x of b)
        p.lineStyle(f, d, x.alpha * (n.alpha ?? 1)), p.drawCircle(O, M, x.radius);
    },
    detach() {
      g.parent && g.parent.removeChild(g), g.destroy({ children: !0 });
    }
  };
});
ye("frostEdge", (t, e = {}) => {
  const n = t.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), a = Math.abs(i.height), o = e.segments ?? 20, s = e.maxLength ?? 15, l = e.color ?? 11197951, u = e.alpha ?? 0.5, d = e.growSpeed ?? 0.02, h = new PIXI.Container();
  h.pivot.set(r / 2, a / 2), h.position.set(r / 2, a / 2);
  const f = new PIXI.Graphics(), g = new PIXI.Graphics();
  g.beginFill(16777215), g.drawRect(0, 0, r, a), g.endFill(), h.addChild(g), f.mask = g, h.addChild(f), t.addChild(h);
  const p = n.scale.x, y = n.scale.y, w = n.angle, v = [];
  for (let L = 0; L < o; L++) {
    const A = Math.floor(Math.random() * 4);
    let O, M, x;
    switch (A) {
      case 0:
        O = Math.random() * r, M = 0, x = Math.PI / 2 + (Math.random() - 0.5) * 0.6;
        break;
      case 1:
        O = r, M = Math.random() * a, x = Math.PI + (Math.random() - 0.5) * 0.6;
        break;
      case 2:
        O = Math.random() * r, M = a, x = -Math.PI / 2 + (Math.random() - 0.5) * 0.6;
        break;
      default:
        O = 0, M = Math.random() * a, x = (Math.random() - 0.5) * 0.6;
        break;
    }
    v.push({ sx: O, sy: M, angle: x, targetLength: s * (0.4 + Math.random() * 0.6), currentLength: 0, grown: !1 });
  }
  let b = !1, E = 0;
  return {
    update(L) {
      if (h.visible = n.visible !== !1, h.scale.set(n.scale.x / p, n.scale.y / y), h.angle = n.angle - w, b)
        E += L * 0.03;
      else {
        b = !0;
        for (const O of v)
          O.grown || (O.currentLength += (O.targetLength - O.currentLength) * d * L, O.currentLength >= O.targetLength * 0.99 ? (O.currentLength = O.targetLength, O.grown = !0) : b = !1);
      }
      const A = b ? u * (0.7 + 0.3 * Math.sin(E)) : u;
      f.clear(), f.lineStyle(1.5, l, A * (n.alpha ?? 1));
      for (const O of v)
        O.currentLength <= 0 || (f.moveTo(O.sx, O.sy), f.lineTo(O.sx + Math.cos(O.angle) * O.currentLength, O.sy + Math.sin(O.angle) * O.currentLength));
    },
    detach() {
      f.mask = null, h.parent && h.parent.removeChild(h), h.destroy({ children: !0 });
    }
  };
});
ye("shadowLift", (t, e = {}) => {
  var g, p, y;
  const n = t.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = PIXI.DropShadowFilter ?? ((g = PIXI.filters) == null ? void 0 : g.DropShadowFilter) ?? ((y = (p = globalThis.PIXI) == null ? void 0 : p.filters) == null ? void 0 : y.DropShadowFilter);
  if (!i)
    return console.warn("shadowLift: DropShadowFilter not available in this PIXI build"), { update() {
    }, detach() {
    } };
  const r = e.offsetY ?? 6, a = e.blur ?? 6, o = e.alpha ?? 0.35, s = e.color ?? 0, l = e.durationFrames ?? 12, u = Yt(e.easing ?? "easeOutCubic"), d = new i();
  d.blur = a, d.alpha = 0, d.color = s, d.quality = 3, d.distance = 0, d.rotation = 90;
  const h = n.filters ? [...n.filters] : [];
  n.filters = [...h, d];
  let f = 0;
  return {
    update(w) {
      if (f < l) {
        f += w;
        const v = Math.min(f / l, 1), b = u(v);
        d.distance = r * b, d.alpha = o * b;
      }
    },
    detach() {
      n.filters && (n.filters = n.filters.filter((w) => w !== d), n.filters.length === 0 && (n.filters = null)), d.destroy();
    }
  };
});
ye("none", () => ({ update() {
}, detach() {
} }));
const ma = {
  idle: ["float", "glow"],
  hover: ["scale"],
  dim: ["none"]
};
function sb(t) {
  if (!t) return { ...ma };
  const e = /* @__PURE__ */ c((n, i) => n === void 0 ? i : typeof n == "string" ? [n] : typeof n == "object" && !Array.isArray(n) && n.name ? [n] : Array.isArray(n) ? n : i, "normalize");
  return {
    idle: e(t.idle, ma.idle),
    hover: e(t.hover, ma.hover),
    dim: e(t.dim, ma.dim)
  };
}
c(sb, "normalizeConfig");
var xe, qt, cn, jt, Nn, Bt, Lt, un, ke, Zf, _a, em, tm, nm, im;
const Er = class Er {
  /**
   * @param {PlaceableObject} placeable
   * @param {object|undefined} animationConfig  Raw animation config from the await entry
   */
  constructor(e, n) {
    k(this, ke);
    k(this, xe);
    k(this, qt);
    k(this, cn, null);
    k(this, jt, []);
    k(this, Nn, null);
    k(this, Bt, null);
    k(this, Lt, null);
    k(this, un, 0);
    I(this, xe, e), I(this, qt, sb(n));
  }
  /** Current animation state name. */
  get state() {
    return m(this, cn);
  }
  /**
   * Start animating in the given state.
   * @param {string} [state="idle"]
   */
  start(e = "idle") {
    var r;
    C(this, ke, Zf).call(this);
    const n = ((r = m(this, xe).document) == null ? void 0 : r.id) ?? "?", i = m(this, Bt);
    i && console.log(`%c[TileAnimator ${n}] start("${e}") canonical: pos=(${i.x.toFixed(2)}, ${i.y.toFixed(2)}) scale=(${i.scaleX.toFixed(4)}, ${i.scaleY.toFixed(4)}) alpha=${i.alpha.toFixed(4)} angle=${i.angle.toFixed(2)}`, "color: #FFAA44; font-weight: bold"), C(this, ke, nm).call(this, e), I(this, Nn, (a) => {
      m(this, Lt) && C(this, ke, _a).call(this);
      for (const o of m(this, jt)) o.update(a);
      C(this, ke, tm).call(this, a);
    }), canvas.app.ticker.add(m(this, Nn));
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
    if (e === m(this, cn)) return;
    const n = ((h = m(this, xe).document) == null ? void 0 : h.id) ?? "?", i = m(this, xe).mesh, r = m(this, qt)[m(this, cn)] ?? m(this, qt).idle ?? ["none"], a = m(this, qt)[e] ?? m(this, qt).idle ?? ["none"], o = r.map((f) => typeof f == "string" ? f : f == null ? void 0 : f.name), s = a.map((f) => typeof f == "string" ? f : f == null ? void 0 : f.name);
    if (console.log(`%c[TileAnimator ${n}] setState: ${m(this, cn)} → ${e}`, "color: #44DDFF; font-weight: bold"), console.log(`  old behaviours: [${o.join(", ")}]  →  new: [${s.join(", ")}]`), i && console.log(`  mesh BEFORE detach: pos=(${i.position.x.toFixed(2)}, ${i.position.y.toFixed(2)}) scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)} angle=${i.angle.toFixed(2)}`), m(this, Bt)) {
      const f = m(this, Bt);
      console.log(`  canonical: pos=(${f.x.toFixed(2)}, ${f.y.toFixed(2)}) scale=(${f.scaleX.toFixed(4)}, ${f.scaleY.toFixed(4)}) alpha=${f.alpha.toFixed(4)} angle=${f.angle.toFixed(2)}`);
    }
    const l = /* @__PURE__ */ new Map();
    for (let f = 0; f < m(this, jt).length; f++) {
      const g = r[f], p = typeof g == "string" ? g : g == null ? void 0 : g.name;
      p && l.set(p, m(this, jt)[f]);
    }
    const u = [], d = /* @__PURE__ */ new Set();
    for (const f of a) {
      const g = typeof f == "string" ? f : f.name;
      l.has(g) && !d.has(g) && d.add(g);
    }
    console.log(`  reused: [${[...d].join(", ")}]  detaching: [${[...l.keys()].filter((f) => !d.has(f)).join(", ")}]`), C(this, ke, em).call(this);
    for (const [f, g] of l)
      d.has(f) || (g.detach(), i && console.log(`  mesh AFTER detach("${f}"): scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)}`));
    C(this, ke, _a).call(this), i && console.log(`  mesh AFTER canonical restore: scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)}`);
    for (const f of a) {
      const g = typeof f == "string" ? f : f.name;
      if (l.has(g) && d.has(g))
        u.push(l.get(g)), d.delete(g), console.log(`  → reuse "${g}"`);
      else {
        const p = typeof f == "string" ? void 0 : f, y = Vl(g);
        if (!y) {
          console.warn(`TileAnimator: unknown behaviour "${g}"`);
          continue;
        }
        u.push(y(m(this, xe), p, m(this, Bt))), i && console.log(`  → create "${g}" — mesh after factory: scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)} pos=(${i.position.x.toFixed(2)}, ${i.position.y.toFixed(2)})`);
      }
    }
    if (m(this, Lt)) {
      const f = m(this, Lt);
      console.log(`  blend FROM: pos=(${f.x.toFixed(2)}, ${f.y.toFixed(2)}) scale=(${f.scaleX.toFixed(4)}, ${f.scaleY.toFixed(4)}) alpha=${f.alpha.toFixed(4)}`);
    }
    I(this, cn, e), I(this, jt, u);
  }
  /**
   * Full cleanup — detach all behaviours, restore canonical, and remove ticker.
   */
  detach() {
    var e, n;
    C(this, ke, im).call(this), C(this, ke, _a).call(this), I(this, Lt, null), m(this, Nn) && ((n = (e = canvas.app) == null ? void 0 : e.ticker) == null || n.remove(m(this, Nn)), I(this, Nn, null));
  }
};
xe = new WeakMap(), qt = new WeakMap(), cn = new WeakMap(), jt = new WeakMap(), Nn = new WeakMap(), Bt = new WeakMap(), Lt = new WeakMap(), un = new WeakMap(), ke = new WeakSet(), // ── Private ──────────────────────────────────────────────────────────
Zf = /* @__PURE__ */ c(function() {
  const e = m(this, xe).mesh;
  e && I(this, Bt, {
    x: e.position.x,
    y: e.position.y,
    scaleX: e.scale.x,
    scaleY: e.scale.y,
    angle: e.angle,
    alpha: e.alpha,
    tint: e.tint
  });
}, "#captureCanonical"), _a = /* @__PURE__ */ c(function() {
  const e = m(this, xe).mesh;
  if (!e || !m(this, Bt)) return;
  const n = m(this, Bt);
  e.position.x = n.x, e.position.y = n.y, e.scale.x = n.scaleX, e.scale.y = n.scaleY, e.angle = n.angle, e.alpha = n.alpha, e.tint = n.tint;
}, "#restoreCanonical"), /**
 * Snapshot the current (animated) mesh values so the transition blend
 * can lerp FROM here toward the new state's computed values.
 */
em = /* @__PURE__ */ c(function() {
  const e = m(this, xe).mesh;
  e && (I(this, Lt, {
    x: e.position.x,
    y: e.position.y,
    scaleX: e.scale.x,
    scaleY: e.scale.y,
    angle: e.angle,
    alpha: e.alpha
  }), I(this, un, 0));
}, "#captureBlendStart"), /**
 * After behaviours compute the new state's mesh values, blend from the
 * pre-transition snapshot toward those values over BLEND_FRAMES using
 * easeOutCubic. This hides the canonical-restore snap entirely.
 */
tm = /* @__PURE__ */ c(function(e) {
  var o, s;
  if (!m(this, Lt)) return;
  I(this, un, m(this, un) + e);
  const n = Math.min(m(this, un) / Er.BLEND_FRAMES, 1);
  if (n >= 1) {
    const l = ((o = m(this, xe).document) == null ? void 0 : o.id) ?? "?";
    console.log(`%c[TileAnimator ${l}] blend complete`, "color: #88FF88"), I(this, Lt, null);
    return;
  }
  const i = 1 - (1 - n) ** 3, r = m(this, xe).mesh;
  if (!r) return;
  const a = m(this, Lt);
  if (m(this, un) <= e * 3) {
    const l = ((s = m(this, xe).document) == null ? void 0 : s.id) ?? "?", u = Math.round(m(this, un) / e);
    console.log(`  [blend ${l} f${u}] t=${n.toFixed(3)} eased=${i.toFixed(3)} | behaviour→scale=(${r.scale.x.toFixed(4)},${r.scale.y.toFixed(4)}) alpha=${r.alpha.toFixed(4)} | blendFrom→scale=(${a.scaleX.toFixed(4)},${a.scaleY.toFixed(4)}) alpha=${a.alpha.toFixed(4)}`);
  }
  r.position.x = a.x + (r.position.x - a.x) * i, r.position.y = a.y + (r.position.y - a.y) * i, r.scale.x = a.scaleX + (r.scale.x - a.scaleX) * i, r.scale.y = a.scaleY + (r.scale.y - a.scaleY) * i, r.angle = a.angle + (r.angle - a.angle) * i, r.alpha = a.alpha + (r.alpha - a.alpha) * i, m(this, un) <= e * 3 && console.log(`  [blend result] scale=(${r.scale.x.toFixed(4)},${r.scale.y.toFixed(4)}) alpha=${r.alpha.toFixed(4)} pos=(${r.position.x.toFixed(2)},${r.position.y.toFixed(2)})`);
}, "#applyBlend"), nm = /* @__PURE__ */ c(function(e) {
  I(this, cn, e);
  const n = m(this, qt)[e] ?? m(this, qt).idle ?? ["none"];
  for (const i of n) {
    const r = typeof i == "string" ? i : i.name, a = typeof i == "string" ? void 0 : i, o = Vl(r);
    if (!o) {
      console.warn(`TileAnimator: unknown behaviour "${r}"`);
      continue;
    }
    m(this, jt).push(o(m(this, xe), a));
  }
}, "#attachBehaviours"), im = /* @__PURE__ */ c(function() {
  for (const e of m(this, jt)) e.detach();
  I(this, jt, []);
}, "#detachBehaviours"), c(Er, "TileAnimator"), /** Frames over which state transitions are blended (easeOutCubic). */
ge(Er, "BLEND_FRAMES", 8);
let Ji = Er;
const lb = "cinematic", Es = 5, Gl = /* @__PURE__ */ new Set();
function Zt(t) {
  for (const e of Gl)
    try {
      e(t);
    } catch (n) {
      console.error("[cinematic] playback listener error:", n);
    }
}
c(Zt, "emitPlaybackEvent");
function cb(t) {
  return Gl.add(t), () => Gl.delete(t);
}
c(cb, "onPlaybackProgress");
let we = null, an = null, pr = null, yr = null, Oi = 0, Xn = null;
function yc(t, e = "default") {
  return `cinematic-progress-${t}-${e}`;
}
c(yc, "progressFlagKey");
function ub(t, e, n, i) {
  game.user.setFlag(T, yc(t, e), {
    currentSegment: n,
    completedSegments: [...i],
    timestamp: Date.now()
  }).catch(() => {
  });
}
c(ub, "saveSegmentProgress");
function zl(t, e = "default") {
  game.user.unsetFlag(T, yc(t, e)).catch(() => {
  });
}
c(zl, "clearProgress");
function rm(t, e = "default", n = 3e5) {
  const i = game.user.getFlag(T, yc(t, e));
  return !i || typeof i.timestamp != "number" || Date.now() - i.timestamp > n ? null : i.currentSegment ? i : null;
}
c(rm, "getSavedProgress");
function Ei(t, e = "default") {
  return `cinematic-seen-${t}-${e}`;
}
c(Ei, "seenFlagKey");
function Eu(t, e = "default") {
  return !!game.user.getFlag(T, Ei(t, e));
}
c(Eu, "hasSeenCinematic");
function db(t, e) {
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
c(db, "validateSingleCinematic");
function es(t) {
  const e = t ? game.scenes.get(t) : canvas.scene;
  let n = (e == null ? void 0 : e.getFlag(T, lb)) ?? null;
  if (n == null) return null;
  if (typeof n != "object" || Array.isArray(n))
    return console.warn(`[${T}] Cinematic: invalid flag data on scene ${e == null ? void 0 : e.id} (expected object). Ignoring.`), null;
  if ((n.version ?? 1) < 3) {
    const { version: i, ...r } = n;
    n = { version: 3, cinematics: { default: r } };
  }
  if (n.version === 3) {
    for (const [i, r] of Object.entries(n.cinematics ?? {}))
      n.cinematics[i] = Gt.migrateV3toV4(r);
    n.version = 4;
  }
  if (n.version === 4) {
    for (const [i, r] of Object.entries(n.cinematics ?? {}))
      n.cinematics[i] = Gt.migrateV4toV5(r);
    n.version = Es;
  }
  if (n.version > Es)
    return console.warn(`[${T}] Cinematic: scene ${e == null ? void 0 : e.id} has version ${n.version}, runtime supports up to ${Es}. Skipping.`), null;
  if (!n.cinematics || typeof n.cinematics != "object")
    return console.warn(`[${T}] Cinematic: no 'cinematics' map on scene ${e == null ? void 0 : e.id}. Ignoring.`), null;
  for (const [i, r] of Object.entries(n.cinematics)) {
    const a = db(r, `scene ${e == null ? void 0 : e.id} cinematic "${i}"`);
    a ? n.cinematics[i] = a : delete n.cinematics[i];
  }
  return Object.keys(n.cinematics).length === 0 ? null : n;
}
c(es, "getCinematicData");
function ao(t, e = "default") {
  var i;
  const n = es(t);
  return ((i = n == null ? void 0 : n.cinematics) == null ? void 0 : i[e]) ?? null;
}
c(ao, "getNamedCinematic");
function fb(t) {
  const e = es(t);
  return e ? Object.keys(e.cinematics) : [];
}
c(fb, "listCinematicNames");
function mb() {
  return game.ready ? Promise.resolve() : new Promise((t) => Hooks.once("ready", t));
}
c(mb, "waitForReady");
async function hb(t = 1e4) {
  var n, i;
  const e = (i = (n = game.modules.get(T)) == null ? void 0 : n.api) == null ? void 0 : i.tween;
  return e != null && e.Timeline ? e.Timeline : new Promise((r) => {
    const a = Date.now(), o = setTimeout(() => {
      var l, u;
      (u = (l = ui.notifications) == null ? void 0 : l.info) == null || u.call(l, `[${T}] Cinematic: waiting for tween engine...`);
    }, 2e3), s = setInterval(() => {
      var u, d, h, f;
      const l = (d = (u = game.modules.get(T)) == null ? void 0 : u.api) == null ? void 0 : d.tween;
      l != null && l.Timeline ? (clearInterval(s), clearTimeout(o), r(l.Timeline)) : Date.now() - a > t && (clearInterval(s), clearTimeout(o), console.warn(`[${T}] Cinematic: tween API not available after ${t}ms.`), (f = (h = ui.notifications) == null ? void 0 : h.warn) == null || f.call(h, `[${T}] Cinematic: tween engine unavailable — cinematic cannot play.`), r(null));
    }, 200);
  });
}
c(hb, "waitForTweenAPI");
async function Wl(t = 5e3) {
  var e;
  return window.Tagger ?? ((e = game.modules.get("tagger")) == null ? void 0 : e.api) ? !0 : new Promise((n) => {
    const i = Date.now(), r = setInterval(() => {
      var a;
      window.Tagger ?? ((a = game.modules.get("tagger")) == null ? void 0 : a.api) ? (clearInterval(r), n(!0)) : Date.now() - i > t && (clearInterval(r), console.warn(`[${T}] Cinematic: Tagger API not available after ${t}ms.`), n(!1));
    }, 200);
  });
}
c(Wl, "waitForTagger");
async function gb(t, e, n) {
  if (!t || !t.event) return;
  const i = { ...t };
  console.log(`[${T}] Cinematic: waiting for gate: ${t.event}`);
  let r = null;
  if (t.event === "tile-click" && t.target && t.animation) {
    const a = e.get(t.target);
    (a == null ? void 0 : a.kind) === "placeable" && a.placeable && (r = new Ji(a.placeable, t.animation), r.start());
  }
  try {
    if (t.timeout && t.timeout > 0) {
      const a = new Promise((s) => setTimeout(s, t.timeout)), o = Tl(i, { signal: n.signal, eventBus: null });
      await Promise.race([o, a]);
    } else
      await Tl(i, { signal: n.signal, eventBus: null });
  } finally {
    r && r.detach();
  }
}
c(gb, "processGate");
function am(t) {
  if (!t.segments) return [];
  const e = [], n = /* @__PURE__ */ new Set();
  let i = t.entry;
  for (; i && typeof i == "string" && t.segments[i] && !n.has(i); )
    n.add(i), e.push(i), i = t.segments[i].next;
  return e;
}
c(am, "getSegmentOrder");
function oo(t, e) {
  if (t.setup)
    try {
      Te(t.setup, e);
    } catch (i) {
      console.warn(`[${T}] Cinematic: error applying cinematic-level setup:`, i);
    }
  const n = am(t);
  for (const i of n) {
    const r = t.segments[i];
    if (r.setup)
      try {
        Te(r.setup, e);
      } catch (a) {
        console.warn(`[${T}] Cinematic: error applying setup for segment "${i}":`, a);
      }
    if (r.landing)
      try {
        Te(r.landing, e);
      } catch (a) {
        console.warn(`[${T}] Cinematic: error applying landing for segment "${i}":`, a);
      }
  }
  if (t.landing)
    try {
      Te(t.landing, e);
    } catch (i) {
      console.warn(`[${T}] Cinematic: error applying cinematic-level landing:`, i);
    }
  canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
}
c(oo, "applyAllSegmentLandingStates");
async function br(t, e = "default", n = null) {
  var b, E, L, A, O, M, x, R;
  const i = t ?? ((b = canvas.scene) == null ? void 0 : b.id);
  if (!i) return;
  const r = `${i}:${e}`;
  if (n || (n = /* @__PURE__ */ new Set()), n.has(r)) {
    console.warn(`[${T}] Cinematic: circular transition detected at "${r}". Stopping chain.`), (L = (E = ui.notifications) == null ? void 0 : E.warn) == null || L.call(E, "Cinematic: circular transition detected, stopping.");
    return;
  }
  n.add(r), (we == null ? void 0 : we.status) === "running" && we.cancel("replaced"), we = null, an && (an.abort("replaced"), an = null);
  const a = ao(i, e);
  if (!a) {
    console.warn(`[${T}] Cinematic: no cinematic "${e}" on scene ${i}.`);
    return;
  }
  const o = await hb();
  if (!o || ((A = canvas.scene) == null ? void 0 : A.id) !== i || (await Wl(), ((O = canvas.scene) == null ? void 0 : O.id) !== i)) return;
  const { targets: s, unresolved: l } = Qa(a);
  if (console.log(`[${T}] Cinematic "${e}": resolved ${s.size} targets`), l.length && console.warn(`[${T}] Cinematic "${e}": skipping ${l.length} unresolved: ${l.join(", ")}`), s.size === 0) {
    console.warn(`[${T}] Cinematic "${e}": no targets could be resolved on scene ${i}.`);
    return;
  }
  const u = py(a);
  pr = gy(u, s), yr = s;
  const d = rm(i, e), h = new AbortController();
  an = h;
  const f = a.synchronized === !0 && game.user.isGM, g = am(a);
  if (g.length === 0) {
    console.warn(`[${T}] Cinematic "${e}": no segments to execute.`);
    return;
  }
  let p = 0;
  const y = /* @__PURE__ */ new Set();
  if (d) {
    const D = d.completedSegments ?? [];
    for (const _ of D) y.add(_);
    const F = g.indexOf(d.currentSegment);
    F >= 0 && (p = F, console.log(`[${T}] Cinematic "${e}": resuming from segment "${d.currentSegment}" (${D.length} completed)`));
  }
  if (a.setup)
    try {
      Te(a.setup, s), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    } catch (D) {
      console.error(`[${T}] Cinematic "${e}": error applying cinematic-level setup:`, D);
    }
  for (let D = 0; D < p; D++) {
    const F = g[D], _ = a.segments[F];
    if (_.setup)
      try {
        Te(_.setup, s);
      } catch (H) {
        console.warn(`[${T}] Cinematic: error applying setup for completed segment "${F}":`, H);
      }
    if (_.landing)
      try {
        Te(_.landing, s);
      } catch (H) {
        console.warn(`[${T}] Cinematic: error applying landing for completed segment "${F}":`, H);
      }
  }
  let w = !1, v = !1;
  Zt({ type: "playback-start", sceneName: ((M = canvas.scene) == null ? void 0 : M.name) ?? i });
  try {
    for (let D = p; D < g.length; D++) {
      if (h.signal.aborted) {
        w = !0;
        break;
      }
      if (((x = canvas.scene) == null ? void 0 : x.id) !== i) {
        w = !0;
        break;
      }
      const F = g[D], _ = a.segments[F];
      if (console.log(`[${T}] Cinematic "${e}": entering segment "${F}"`), Zt({ type: "segment-start", segmentName: F }), ub(i, e, F, [...y]), _.gate) {
        Zt({ type: "gate-wait", segmentName: F, gate: _.gate });
        try {
          await gb(_.gate, s, h);
        } catch (B) {
          if (h.signal.aborted) {
            w = !0;
            break;
          }
          throw B;
        }
        Zt({ type: "gate-resolved", segmentName: F });
      }
      if (h.signal.aborted) {
        w = !0;
        break;
      }
      if (_.setup)
        try {
          Te(_.setup, s), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
        } catch (B) {
          console.error(`[${T}] Cinematic "${e}": error applying setup for segment "${F}":`, B);
        }
      if ((R = _.timeline) != null && R.length) {
        const B = pc(_.timeline);
        Zt({ type: "timeline-start", segmentName: F, durationMs: B });
        const { tl: W } = Cy(
          { setup: {}, timeline: _.timeline },
          s,
          o,
          {
            timelineName: `cinematic-${i}-${e}-${F}`,
            onStepComplete: /* @__PURE__ */ c((U) => {
              Zt({ type: "step-complete", segmentName: F, stepIndex: U });
            }, "onStepComplete")
          }
        );
        we = W.run({
          broadcast: f,
          commit: f
        });
        try {
          await new Promise((U, K) => {
            W.onComplete(() => U()), W.onCancel(() => K(new Error("cancelled"))), W.onError((Q) => K(new Error(`timeline error: ${Q}`)));
            const ae = /* @__PURE__ */ c(() => K(new Error("cancelled")), "onAbort");
            h.signal.addEventListener("abort", ae, { once: !0 });
          });
        } catch (U) {
          if (U.message === "cancelled" || h.signal.aborted) {
            w = !0;
            break;
          }
          throw U;
        }
        Zt({ type: "timeline-end", segmentName: F });
      }
      if (h.signal.aborted) {
        w = !0;
        break;
      }
      if (_.landing)
        try {
          Te(_.landing, s), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
        } catch (B) {
          console.error(`[${T}] Cinematic "${e}": error applying landing for segment "${F}":`, B);
        }
      Zt({ type: "segment-complete", segmentName: F }), y.add(F);
      const H = _.next;
      if (H && typeof H == "object" && H.scene) {
        const B = H.scene, W = H.segment ?? a.entry;
        console.log(`[${T}] Cinematic "${e}": cross-scene transition to scene ${B}, segment "${W}"`), we = null, an = null, zl(i, e), cu(), a.tracking !== !1 && await game.user.setFlag(T, Ei(i, e), !0), Xn = { sceneId: B, cinematicName: e, visitedChain: n };
        const q = game.scenes.get(B);
        q ? q.view() : (console.warn(`[${T}] Cinematic: cross-scene transition target scene "${B}" not found.`), Xn = null);
        return;
      }
    }
  } catch (D) {
    v = !0, console.error(`[${T}] Cinematic "${e}" error on scene ${i}:`, D);
  }
  if (we = null, an = null, zl(i, e), cu(), pr = null, yr = null, Zt({ type: "playback-end", cancelled: !!w }), w) {
    console.log(`[${T}] Cinematic "${e}" cancelled on scene ${i}.`), oo(a, s);
    return;
  }
  if (v) {
    oo(a, s);
    return;
  }
  a.tracking !== !1 && await game.user.setFlag(T, Ei(i, e), !0), console.log(`[${T}] Cinematic "${e}" complete on scene ${i}.`);
}
c(br, "playCinematic");
async function pb(t, e = "default") {
  var i;
  const n = t ?? ((i = canvas.scene) == null ? void 0 : i.id);
  n && (await game.user.unsetFlag(T, Ei(n, e)), console.log(`[${T}] Cinematic: cleared seen flag for "${e}" on scene ${n}.`));
}
c(pb, "resetCinematic");
async function yb(t, e, n = "default") {
  var a;
  if (!game.user.isGM) return;
  const i = t ?? ((a = canvas.scene) == null ? void 0 : a.id);
  if (!i || !e) return;
  const r = game.users.get(e);
  r && (await r.unsetFlag(T, Ei(i, n)), console.log(`[${T}] Cinematic: cleared seen flag for user ${r.name} on "${n}" scene ${i}.`));
}
c(yb, "resetCinematicForUser");
async function bb(t, e = "default") {
  var a;
  if (!game.user.isGM) return;
  const n = t ?? ((a = canvas.scene) == null ? void 0 : a.id);
  if (!n) return;
  const i = Ei(n, e), r = game.users.map((o) => o.getFlag(T, i) ? o.unsetFlag(T, i) : Promise.resolve());
  await Promise.all(r), console.log(`[${T}] Cinematic: cleared seen flag for all users on "${e}" scene ${n}.`);
}
c(bb, "resetCinematicForAll");
function vb(t, e = "default") {
  var r;
  const n = t ?? ((r = canvas.scene) == null ? void 0 : r.id);
  if (!n) return [];
  const i = Ei(n, e);
  return game.users.map((a) => ({
    userId: a.id,
    name: a.name,
    color: a.color ?? "#888888",
    isGM: a.isGM,
    seen: !!a.getFlag(T, i)
  }));
}
c(vb, "getSeenStatus");
function wb(t, e) {
  var i;
  const n = t ?? ((i = canvas.scene) == null ? void 0 : i.id);
  return e ? ao(n, e) != null : es(n) != null;
}
c(wb, "hasCinematic");
function Eb() {
  if (!pr || !yr) {
    console.warn(`[${T}] Cinematic: no snapshot available for revert.`);
    return;
  }
  (we == null ? void 0 : we.status) === "running" && we.cancel("reverted"), we = null, an && (an.abort("reverted"), an = null);
  try {
    Te(pr, yr), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 }), console.log(`[${T}] Cinematic: reverted to pre-cinematic state.`);
  } catch (t) {
    console.error(`[${T}] Cinematic: error during revert:`, t);
  }
  pr = null, yr = null;
}
c(Eb, "revertCinematic");
async function Sb() {
  const t = ++Oi;
  if (console.log(`[${T}] Cinematic: canvasReady fired, gen=${t}, game.ready=${game.ready}`), await mb(), t !== Oi) return;
  console.log(`[${T}] Cinematic: game is ready`);
  const e = canvas.scene;
  if (!e) {
    console.log(`[${T}] Cinematic: no canvas.scene, exiting`);
    return;
  }
  if (Xn && Xn.sceneId === e.id) {
    const a = Xn;
    Xn = null, console.log(`[${T}] Cinematic: picking up pending transition to "${a.cinematicName}" on scene ${e.id}`);
    try {
      await br(e.id, a.cinematicName, a.visitedChain);
    } catch (o) {
      console.error(`[${T}] Cinematic: error during pending transition playback on scene ${e.id}:`, o);
    }
    return;
  }
  Xn = null;
  const n = es(e.id);
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
    const o = rm(e.id, a);
    if (t !== Oi) return;
    if (o) {
      console.log(`[${T}] Cinematic "${a}": found saved progress at segment "${o.currentSegment}", resuming...`);
      try {
        await br(e.id, a);
      } catch (s) {
        console.error(`[${T}] Cinematic "${a}": error during resumed playback on scene ${e.id}:`, s);
      }
      return;
    }
  }
  let r = null;
  for (const { name: a, data: o } of i)
    if (!(o.tracking !== !1 && Eu(e.id, a))) {
      r = { name: a, data: o };
      break;
    }
  if (!r) {
    if (console.log(`[${T}] Cinematic: all canvasReady cinematics already seen on scene ${e.id}`), Cb(e.id, i), (we == null ? void 0 : we.status) === "running" && we.cancel("already-seen"), we = null, await Wl(), t !== Oi) return;
    for (const { name: a, data: o } of i)
      try {
        const { targets: s } = Qa(o);
        oo(o, s);
      } catch (s) {
        console.error(`[${T}] Cinematic "${a}": error applying landing states (already seen) on scene ${e.id}:`, s);
      }
    canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    return;
  }
  if (t === Oi && (console.log(`[${T}] Cinematic: playing first unseen cinematic "${r.name}"...`), await Wl(), t === Oi)) {
    for (const { name: a, data: o } of i) {
      if (a === r.name) continue;
      if (o.tracking !== !1 && Eu(e.id, a))
        try {
          const { targets: l } = Qa(o);
          oo(o, l);
        } catch (l) {
          console.error(`[${T}] Cinematic "${a}": error applying landing states (already seen) on scene ${e.id}:`, l);
        }
    }
    try {
      await br(e.id, r.name);
    } catch (a) {
      console.error(`[${T}] Cinematic "${r.name}": error during playback on scene ${e.id}:`, a);
    }
  }
}
c(Sb, "onCanvasReady$2");
function Cb(t, e) {
  for (const { name: n } of e)
    zl(t, n);
}
c(Cb, "clearAllCanvasReadyProgress");
function Tb(t = 3e5) {
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
c(Tb, "cleanupStaleProgressFlags");
function Lb() {
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
        new Pl({ scene: canvas.scene }).render(!0);
      }, "onClick")
    };
    Array.isArray(i) ? i.push(a) : i instanceof Map ? i.set(r, a) : i && typeof i == "object" ? i[r] = a : n.tools = [a];
  });
}
c(Lb, "registerEditorButton");
function Ib() {
  Hooks.on("canvasReady", Sb), Lb(), Hooks.once("ready", () => {
    Tb();
    const t = game.modules.get(T);
    t.api || (t.api = {}), t.api.cinematic = {
      play: br,
      reset: pb,
      resetForUser: yb,
      resetForAll: bb,
      getSeenStatus: vb,
      has: wb,
      get: ao,
      list: fb,
      revert: Eb,
      onPlaybackProgress: cb,
      TileAnimator: Ji,
      registerBehaviour: ye,
      getBehaviour: Vl,
      trigger: /* @__PURE__ */ c(async (e, n, i = "default") => {
        var o;
        const r = n ?? ((o = canvas.scene) == null ? void 0 : o.id);
        if (!r) return;
        const a = ao(r, i);
        a && (a.trigger && a.trigger !== e || await br(r, i));
      }, "trigger")
    }, console.log(`[${T}] Cinematic API registered (v5).`);
  });
}
c(Ib, "registerCinematicHooks");
function Yl(t, e) {
  const n = Math.abs(t.width), i = Math.abs(t.height), r = n / 2, a = i / 2;
  let o = e.x - (t.x + r), s = e.y - (t.y + a);
  if (t.rotation !== 0) {
    const l = Math.toRadians(t.rotation), u = Math.cos(l), d = Math.sin(l), h = u * o + d * s, f = u * s - d * o;
    o = h, s = f;
  }
  return o += r, s += a, o >= 0 && o <= n && s >= 0 && s <= i;
}
c(Yl, "pointWithinTile");
Jo("tile-click", (t, e) => t.target ? new Promise((n, i) => {
  var g;
  if (e.signal.aborted) return i(e.signal.reason ?? "aborted");
  const r = Qo(t.target);
  if (!((g = r == null ? void 0 : r.placeables) != null && g.length))
    return i(new Error(`await tile-click: no placeables found for "${t.target}"`));
  const a = r.placeables, o = [];
  for (const { placeable: p } of a) {
    const y = new Ji(p, t.animation);
    y.start("idle"), o.push({ placeable: p, animator: y });
  }
  const s = document.getElementById("board");
  let l = null;
  const u = /* @__PURE__ */ c((p) => {
    const y = canvas.activeLayer;
    if (!y) return;
    const w = y.toLocal(p);
    if (!w || isNaN(w.x) || isNaN(w.y)) return;
    let v = !1;
    for (const { placeable: b, animator: E } of o)
      Yl(b.document, w) ? (v = !0, E.state !== "hover" && E.setState("hover")) : E.state === "hover" && E.setState("idle");
    v ? l === null && (l = document.body.style.cursor, document.body.style.cursor = "pointer") : l !== null && (document.body.style.cursor = l, l = null);
  }, "onPointerMove");
  s == null || s.addEventListener("pointermove", u);
  const d = /* @__PURE__ */ c((p) => {
    if (p.button !== 0) return;
    const y = canvas.activeLayer;
    if (!y) return;
    const w = y.toLocal(p);
    isNaN(w.x) || isNaN(w.y) || !a.filter(({ doc: b }) => Yl(b, w)).sort((b, E) => (E.doc.sort ?? 0) - (b.doc.sort ?? 0))[0] || (p.stopPropagation(), p.preventDefault(), f(), n());
  }, "onPointerDown");
  s == null || s.addEventListener("pointerdown", d, { capture: !0 });
  const h = /* @__PURE__ */ c(() => {
    f(), i(e.signal.reason ?? "aborted");
  }, "onAbort");
  e.signal.addEventListener("abort", h, { once: !0 });
  function f() {
    s == null || s.removeEventListener("pointerdown", d, { capture: !0 }), s == null || s.removeEventListener("pointermove", u), e.signal.removeEventListener("abort", h);
    for (const { animator: p } of o)
      p.detach();
    l !== null ? (document.body.style.cursor = l, l = null) : document.body.style.cursor = "";
  }
  c(f, "cleanup");
}) : Promise.reject(new Error('await tile-click: "target" is required')));
Ib();
function Ob() {
  Hooks.once("ready", () => {
    const t = game.modules.get(T);
    t.api || (t.api = {}), t.api.picker = {
      /** Open the picker window. Returns Promise<string[] | null>. */
      open: /* @__PURE__ */ c((e) => ro.open(e), "open"),
      /** Resolve a selector string to documents. */
      resolveSelector: Qo,
      /** Parse a selector string into { type, value }. */
      parseSelector: gc,
      /** Build a selector string from { type, value }. */
      buildSelector: uy,
      /** Build a tag selector from tags array + mode. */
      buildTagSelector: Cf,
      /** Canvas highlight utilities. */
      highlight: {
        add: io,
        remove: Ki,
        has: xf,
        clearAll: Na
      }
    }, console.log(`[${T}] Placeable Picker API registered.`);
  });
}
c(Ob, "registerPlaceablePickerHooks");
Ob();
const Kl = "eidolon-utilities", Ab = "idle-animation", Xi = /* @__PURE__ */ new Map();
function kb(t) {
  return typeof t.attribute == "string" && typeof t.from == "number" && typeof t.to == "number" && typeof t.period == "number" && t.period > 0;
}
c(kb, "isValidTilePropConfig");
function Mb(t) {
  return typeof t.fromColor == "string" && typeof t.toColor == "string" && typeof t.period == "number" && t.period > 0;
}
c(Mb, "isValidTileTintConfig");
function Nb(t) {
  return typeof t.fromScale == "number" && typeof t.toScale == "number" && t.fromScale > 0 && t.toScale > 0 && typeof t.period == "number" && t.period > 0;
}
c(Nb, "isValidTileScaleConfig");
function Su(t) {
  if (!t || typeof t != "object") return !1;
  const e = t.type ?? "tile-prop";
  return e === "tile-tint" ? Mb(t) : e === "tile-scale" ? Nb(t) : kb(t);
}
c(Su, "isValidConfig");
function bc(t) {
  var i;
  const e = (i = t == null ? void 0 : t.getFlag) == null ? void 0 : i.call(t, Kl, Ab);
  if (!e) return [];
  let n;
  if (Array.isArray(e))
    n = e;
  else if (typeof e == "object" && "0" in e)
    n = Object.values(e);
  else return typeof e == "object" && Su(e) ? [e] : [];
  return n.filter(Su);
}
c(bc, "getIdleAnimationConfigs");
function _b(t, e) {
  const n = e.type ?? "tile-prop";
  return n === "tile-tint" ? `${t}::tint` : n === "tile-scale" ? `${t}::scale` : `${t}::${e.attribute}`;
}
c(_b, "loopKey");
function Cu(t, e, n, i) {
  return e.type === "tile-tint" ? { uuid: t, toColor: n ? e.toColor : e.fromColor, mode: e.mode } : e.type === "tile-scale" ? {
    uuid: t,
    toScale: n ? e.toScale : e.fromScale,
    ...i
  } : { uuid: t, attribute: e.attribute, value: n ? e.to : e.from };
}
c(Cu, "buildExecuteParams");
function $b(t, e) {
  var g, p;
  const n = t == null ? void 0 : t.document;
  if (!n) return;
  const i = n.id, r = _b(i, e);
  vc(r);
  const a = e.type ?? "tile-prop", o = Ci(a);
  if (!o) {
    console.warn(`[${Kl}] idle-animation: unknown tween type "${a}"`);
    return;
  }
  const s = new AbortController();
  let l, u = null;
  if (a === "tile-tint") {
    const y = ((p = (g = n._source) == null ? void 0 : g.texture) == null ? void 0 : p.tint) ?? "#ffffff";
    l = /* @__PURE__ */ c(() => {
      var v, b, E;
      const w = (b = (v = canvas.scene) == null ? void 0 : v.tiles) == null ? void 0 : b.get(i);
      w && (w.updateSource({ texture: { tint: y } }), (E = w.object) == null || E.refresh());
    }, "restore"), n.updateSource({ texture: { tint: e.fromColor } }), t.refresh();
  } else if (a === "tile-scale") {
    const y = n._source.width, w = n._source.height, v = n._source.x, b = n._source.y;
    u = {
      baseWidth: y,
      baseHeight: w,
      centerX: v + y / 2,
      centerY: b + w / 2
    }, l = /* @__PURE__ */ c(() => {
      var x, R, D;
      const M = (R = (x = canvas.scene) == null ? void 0 : x.tiles) == null ? void 0 : R.get(i);
      M && (M.updateSource({ width: y, height: w, x: v, y: b }), (D = M.object) == null || D.refresh());
    }, "restore");
    const E = y * e.fromScale, L = w * e.fromScale, A = u.centerX - E / 2, O = u.centerY - L / 2;
    n.updateSource({ width: E, height: L, x: A, y: O }), t.refresh();
  } else {
    const y = foundry.utils.getProperty(n._source, e.attribute);
    if (typeof y != "number") {
      console.warn(`[${Kl}] idle-animation: attribute "${e.attribute}" is not a number on tile ${i}`);
      return;
    }
    l = /* @__PURE__ */ c(() => {
      var v, b, E;
      const w = (b = (v = canvas.scene) == null ? void 0 : v.tiles) == null ? void 0 : b.get(i);
      w && (w.updateSource(foundry.utils.expandObject({ [e.attribute]: y })), (E = w.object) == null || E.refresh());
    }, "restore"), n.updateSource(foundry.utils.expandObject({ [e.attribute]: e.from })), t.refresh();
  }
  Xi.set(r, { controller: s, restore: l });
  const d = n.uuid, h = e.period / 2, f = e.easing ?? "easeInOutCosine";
  (async () => {
    const { signal: y } = s;
    for (; !y.aborted && !(await o.execute(
      Cu(d, e, !0, u),
      { durationMS: h, easing: f, commit: !1, signal: y }
    ) === !1 || y.aborted || await o.execute(
      Cu(d, e, !1, u),
      { durationMS: h, easing: f, commit: !1, signal: y }
    ) === !1 || y.aborted); )
      ;
  })();
}
c($b, "startLoop");
function vc(t) {
  const e = Xi.get(t);
  e && (e.controller.abort(), Xi.delete(t), e.restore());
}
c(vc, "stopLoopByKey");
function Or(t) {
  const e = `${t}::`;
  for (const n of [...Xi.keys()])
    n.startsWith(e) && vc(n);
}
c(Or, "stopLoopsForTile");
function wc(t, e) {
  if (t != null && t.document) {
    Or(t.document.id);
    for (const n of e)
      $b(t, n);
  }
}
c(wc, "startAllLoops");
function xb() {
  for (const t of [...Xi.keys()])
    vc(t);
}
c(xb, "stopAllLoops");
function Tu(t) {
  const e = `${t}::`;
  for (const n of Xi.keys())
    if (n.startsWith(e)) return !0;
  return !1;
}
c(Tu, "isLooping");
function It(t, e, n) {
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
c(It, "buildSelectGroup");
function Ot(t, e, n, i = {}) {
  const r = document.createElement("div");
  r.classList.add("form-group");
  const a = document.createElement("label");
  a.textContent = t;
  const o = document.createElement("input");
  o.type = "number", o.classList.add(e), o.value = String(n);
  for (const [s, l] of Object.entries(i)) o.setAttribute(s, l);
  return r.append(a, o), r;
}
c(Ot, "buildNumberGroup");
function Ar(t, e, n) {
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
c(Ar, "buildColorGroup");
const Ss = "eidolon-utilities", Cs = "idle-animation", Fb = "eidolon-idle-animation", Db = "fa-solid fa-wave-pulse", Ec = [
  { value: "alpha", label: "Alpha (Opacity)", from: 0.85, to: 1, step: "0.01" },
  { value: "rotation", label: "Rotation", from: -5, to: 5, step: "1" },
  { value: "texture.rotation", label: "Texture Rotation", from: -5, to: 5, step: "1" }
], vr = {
  type: "tile-prop",
  attribute: "alpha",
  from: 0.85,
  to: 1,
  period: 1500,
  easing: "easeInOutCosine"
}, Qn = {
  fromColor: "#ffffff",
  toColor: "#ffcc88",
  mode: "oklch",
  period: 3e3
}, Ts = {
  fromScale: 0.95,
  toScale: 1.05
};
function Lu(t, e) {
  const n = Ec.find((r) => r.value === t);
  if (n && n.from !== null) return { from: n.from, to: n.to, step: n.step };
  const i = foundry.utils.getProperty((e == null ? void 0 : e._source) ?? {}, t);
  return typeof i == "number" && i > 0 ? { from: Math.round(i * 0.95), to: Math.round(i * 1.05), step: "1" } : { from: 0, to: 100, step: "1" };
}
c(Lu, "getAttributeDefaults");
function Pb(t) {
  var e;
  return (t == null ? void 0 : t.document) ?? ((e = t == null ? void 0 : t.object) == null ? void 0 : e.document) ?? (t == null ? void 0 : t.object) ?? null;
}
c(Pb, "getTileDocument$1");
function Iu(t) {
  if (!t) return "";
  const e = t.type ?? "tile-prop";
  if (e === "tile-tint")
    return `Tint ${t.fromColor ?? "?"} → ${t.toColor ?? "?"} (${t.period ?? "?"}ms)`;
  if (e === "tile-scale") {
    const r = t.fromScale != null ? `${Math.round(t.fromScale * 100)}%` : "?", a = t.toScale != null ? `${Math.round(t.toScale * 100)}%` : "?";
    return `Scale ${r} → ${a} (${t.period ?? "?"}ms)`;
  }
  const n = Ec.find((r) => r.value === t.attribute);
  return `${(n == null ? void 0 : n.label) ?? t.attribute ?? "?"} ${t.from ?? "?"} → ${t.to ?? "?"} (${t.period ?? "?"}ms)`;
}
c(Iu, "summarizeConfig");
function Ou(t, e, n) {
  const i = e.type ?? "tile-prop", r = Wo(), a = document.createElement("div");
  a.classList.add("idle-anim__slot", "is-collapsed"), a.dataset.index = String(n);
  const o = document.createElement("div");
  o.classList.add("idle-anim__slot-header");
  const s = document.createElement("i");
  s.classList.add("fa-solid", "fa-chevron-right", "idle-anim__slot-chevron");
  const l = document.createElement("span");
  l.classList.add("idle-anim__slot-title"), l.textContent = `Animation ${n + 1}`;
  const u = document.createElement("span");
  u.classList.add("idle-anim__slot-summary"), u.textContent = Iu(e);
  const d = document.createElement("button");
  d.type = "button", d.classList.add("idle-anim__slot-remove"), d.innerHTML = '<i class="fa-solid fa-xmark"></i>', d.title = "Remove animation", o.append(s, l, u, d), a.appendChild(o);
  const h = document.createElement("div");
  h.classList.add("idle-anim__slot-body");
  const f = It("Type", "idle-anim__type", [
    { value: "tile-prop", label: "Numeric", selected: i === "tile-prop" || i !== "tile-tint" && i !== "tile-scale" },
    { value: "tile-tint", label: "Tint", selected: i === "tile-tint" },
    { value: "tile-scale", label: "Scale", selected: i === "tile-scale" }
  ]);
  h.appendChild(f);
  const g = document.createElement("div");
  g.classList.add("idle-anim__type-fields"), h.appendChild(g);
  function p(b, E) {
    if (g.innerHTML = "", b === "tile-tint") {
      const L = Wi(), A = E.fromColor ?? Qn.fromColor, O = E.toColor ?? Qn.toColor, M = E.mode ?? Qn.mode, x = document.createElement("div");
      x.classList.add("idle-anim__range-row"), x.appendChild(Ar("From", "idle-anim__from-color", A)), x.appendChild(Ar("To", "idle-anim__to-color", O)), g.appendChild(x), g.appendChild(It(
        "Mode",
        "idle-anim__mode",
        L.map((R) => ({ value: R, label: R, selected: R === M }))
      ));
    } else if (b === "tile-scale") {
      const L = E.fromScale ?? Ts.fromScale, A = E.toScale ?? Ts.toScale, O = document.createElement("div");
      O.classList.add("idle-anim__range-row"), O.appendChild(Ot("From", "idle-anim__from-scale", L, { step: "0.01", min: "0.01" })), O.appendChild(Ot("To", "idle-anim__to-scale", A, { step: "0.01", min: "0.01" })), g.appendChild(O);
      const M = document.createElement("p");
      M.classList.add("idle-anim__hint"), M.textContent = "1.0 = original size. Scales from center.", g.appendChild(M);
    } else {
      const L = E.attribute ?? vr.attribute, A = Lu(L, t), O = E.from ?? A.from, M = E.to ?? A.to, x = A.step;
      g.appendChild(It(
        "Attribute",
        "idle-anim__attribute",
        Ec.map((F) => ({ value: F.value, label: F.label, selected: F.value === L }))
      ));
      const R = document.createElement("div");
      R.classList.add("idle-anim__range-row"), R.appendChild(Ot("From", "idle-anim__from", O, { step: x })), R.appendChild(Ot("To", "idle-anim__to", M, { step: x })), g.appendChild(R);
      const D = g.querySelector(".idle-anim__attribute");
      D == null || D.addEventListener("change", () => {
        const F = Lu(D.value, t), _ = g.querySelector(".idle-anim__from"), H = g.querySelector(".idle-anim__to");
        _ && (_.value = String(F.from), _.step = F.step), H && (H.value = String(F.to), H.step = F.step);
      });
    }
  }
  c(p, "renderTypeFields"), p(i, e);
  const y = e.period ?? (i === "tile-tint" ? Qn.period : vr.period), w = e.easing ?? "easeInOutCosine";
  h.appendChild(Ot("Period (ms)", "idle-anim__period", y, { min: "100", step: "100" })), h.appendChild(It(
    "Easing",
    "idle-anim__easing",
    r.map((b) => ({ value: b, label: b, selected: b === w }))
  )), a.appendChild(h);
  const v = a.querySelector(".idle-anim__type");
  return v == null || v.addEventListener("change", () => {
    const b = v.value;
    p(b, b === "tile-tint" ? Qn : b === "tile-scale" ? Ts : vr);
  }), o.addEventListener("click", (b) => {
    if (!b.target.closest(".idle-anim__slot-remove") && (a.classList.toggle("is-collapsed"), a.classList.contains("is-collapsed"))) {
      const E = om(a);
      E && (u.textContent = Iu(E));
    }
  }), d.addEventListener("click", (b) => {
    b.stopPropagation();
    const E = a.parentElement;
    a.remove(), E && Rb(E);
  }), a;
}
c(Ou, "buildSlot");
function Rb(t) {
  t.querySelectorAll(".idle-anim__slot").forEach((n, i) => {
    n.dataset.index = String(i);
    const r = n.querySelector(".idle-anim__slot-title");
    r && (r.textContent = `Animation ${i + 1}`);
  });
}
c(Rb, "renumberSlots$1");
function Hb(t) {
  const e = bc(t), n = document.createElement("section");
  n.classList.add("eidolon-idle-animation");
  const i = document.createElement("div");
  i.classList.add("idle-anim__slots");
  for (let l = 0; l < e.length; l++)
    i.appendChild(Ou(t, e[l], l));
  n.appendChild(i);
  const r = document.createElement("button");
  r.type = "button", r.classList.add("idle-anim__add"), r.innerHTML = '<i class="fa-solid fa-plus"></i> Add Animation', r.addEventListener("click", () => {
    const l = i.querySelectorAll(".idle-anim__slot").length, u = Ou(t, vr, l);
    u.classList.remove("is-collapsed"), i.appendChild(u);
  }), n.appendChild(r);
  const a = document.createElement("div");
  a.classList.add("idle-anim__actions");
  const o = document.createElement("button");
  o.type = "button", o.classList.add("idle-anim__preview"), o.innerHTML = '<i class="fa-solid fa-play"></i> Preview All';
  const s = document.createElement("button");
  return s.type = "button", s.classList.add("idle-anim__save"), s.innerHTML = '<i class="fa-solid fa-save"></i> Save', a.append(o, s), n.appendChild(a), n;
}
c(Hb, "buildTabContent");
function om(t) {
  var l, u, d, h, f, g, p, y, w, v, b, E;
  const e = t.querySelector(".idle-anim__type"), n = (e == null ? void 0 : e.value) ?? "tile-prop", i = Number.parseInt((l = t.querySelector(".idle-anim__period")) == null ? void 0 : l.value, 10), r = ((u = t.querySelector(".idle-anim__easing")) == null ? void 0 : u.value) ?? "easeInOutCosine";
  if (!i || i <= 0) return null;
  if (n === "tile-tint") {
    const L = ((d = t.querySelector(".idle-anim__from-color")) == null ? void 0 : d.value) ?? ((h = t.querySelector(".idle-anim__from-color-text")) == null ? void 0 : h.value) ?? Qn.fromColor, A = ((f = t.querySelector(".idle-anim__to-color")) == null ? void 0 : f.value) ?? ((g = t.querySelector(".idle-anim__to-color-text")) == null ? void 0 : g.value) ?? Qn.toColor, O = ((p = t.querySelector(".idle-anim__mode")) == null ? void 0 : p.value) ?? "oklch";
    return { type: "tile-tint", fromColor: L, toColor: A, mode: O, period: i, easing: r };
  }
  if (n === "tile-scale") {
    const L = Number.parseFloat((y = t.querySelector(".idle-anim__from-scale")) == null ? void 0 : y.value), A = Number.parseFloat((w = t.querySelector(".idle-anim__to-scale")) == null ? void 0 : w.value);
    return Number.isNaN(L) || Number.isNaN(A) || L <= 0 || A <= 0 ? null : { type: "tile-scale", fromScale: L, toScale: A, period: i, easing: r };
  }
  const a = ((v = t.querySelector(".idle-anim__attribute")) == null ? void 0 : v.value) ?? vr.attribute, o = Number.parseFloat((b = t.querySelector(".idle-anim__from")) == null ? void 0 : b.value), s = Number.parseFloat((E = t.querySelector(".idle-anim__to")) == null ? void 0 : E.value);
  return Number.isNaN(o) || Number.isNaN(s) ? null : { type: "tile-prop", attribute: a, from: o, to: s, period: i, easing: r };
}
c(om, "readSlotConfig");
function Au(t) {
  const e = t.querySelectorAll(".idle-anim__slot"), n = [];
  for (const i of e) {
    const r = om(i);
    r && n.push(r);
  }
  return n;
}
c(Au, "readAllFormValues");
function qb(t, e) {
  var s;
  const n = _t(e);
  if (!n) return;
  const i = Pb(t);
  if (!i) return;
  const r = uc(t, n, Fb, "Animations", Db);
  if (!r || r.querySelector(".eidolon-idle-animation")) return;
  r.appendChild(Hb(i)), (s = t.setPosition) == null || s.call(t, { height: "auto" });
  const a = r.querySelector(".idle-anim__preview");
  a == null || a.addEventListener("click", () => {
    const l = i.object;
    if (!l) return;
    if (Tu(i.id)) {
      Or(i.id), a.classList.remove("is-active"), a.innerHTML = '<i class="fa-solid fa-play"></i> Preview All';
      return;
    }
    const u = Au(r);
    u.length !== 0 && (wc(l, u), a.classList.add("is-active"), a.innerHTML = '<i class="fa-solid fa-stop"></i> Stop');
  });
  const o = r.querySelector(".idle-anim__save");
  o == null || o.addEventListener("click", async () => {
    var u;
    Tu(i.id) && (Or(i.id), a && (a.classList.remove("is-active"), a.innerHTML = '<i class="fa-solid fa-play"></i> Preview All'));
    const l = Au(r);
    l.length > 0 ? (await i.update({ [`flags.${Ss}.-=${Cs}`]: null }), await i.update({ [`flags.${Ss}.${Cs}`]: l })) : await i.update({ [`flags.${Ss}.-=${Cs}`]: null }), (u = ui.notifications) == null || u.info("Idle animations saved.");
  });
}
c(qb, "renderAnimationTab");
const jb = "eidolon-utilities", ku = "idle-animation";
function Bb() {
  var e;
  xb();
  const t = (e = canvas.tiles) == null ? void 0 : e.placeables;
  if (Array.isArray(t))
    for (const n of t) {
      const i = bc(n.document);
      i.length > 0 && wc(n, i);
    }
}
c(Bb, "onCanvasReady$1");
function Ub(t, e) {
  var r;
  const n = (r = e == null ? void 0 : e.flags) == null ? void 0 : r[jb];
  if (!n || !(ku in n || `-=${ku}` in n)) return;
  const i = bc(t);
  i.length > 0 && t.object ? wc(t.object, i) : Or(t.id);
}
c(Ub, "onUpdateTile$1");
function Vb(t) {
  Or(t.id);
}
c(Vb, "onDeleteTile$1");
function Gb(t, e) {
  qb(t, e);
}
c(Gb, "onRenderTileConfig$1");
function zb() {
  Hooks.on("canvasReady", Bb), Hooks.on("updateTile", Ub), Hooks.on("deleteTile", Vb), Hooks.on("renderTileConfig", Gb);
}
c(zb, "registerIdleAnimationHooks");
zb();
const sm = "eidolon-utilities", Wb = "tile-interactions", dn = /* @__PURE__ */ new Map(), Si = /* @__PURE__ */ new Map(), Mu = /* @__PURE__ */ new WeakMap(), wr = /* @__PURE__ */ new Set();
let Fn = null, At = null, kt = null, Vt = null;
function lm(t) {
  if (!t) return null;
  if (!Array.isArray(t) && typeof t == "object") {
    const e = Array.isArray(t.idle) && t.idle.length ? t.idle : null, n = Array.isArray(t.enter) && t.enter.length ? t.enter : null;
    return !e && !n ? null : { idle: e, enter: n };
  }
  return Array.isArray(t) && t.length ? { idle: null, enter: t } : null;
}
c(lm, "parseHoverConfig");
function cm(t) {
  var e;
  return ((e = t == null ? void 0 : t.getFlag) == null ? void 0 : e.call(t, sm, Wb)) ?? null;
}
c(cm, "getInteractionFlag");
function um(t) {
  const e = canvas.activeLayer;
  if (!e) return null;
  const n = e.toLocal(t);
  return !n || Number.isNaN(n.x) || Number.isNaN(n.y) ? null : n;
}
c(um, "canvasToLocal");
function dm(t) {
  let e = null, n = -1 / 0;
  for (const [i, r] of dn)
    if (Yl(r.doc, t)) {
      const a = r.doc.sort ?? 0;
      a > n && (e = r, n = a);
    }
  return e;
}
c(dm, "hitTest");
function Yb(t) {
  return {
    idle: t.idle ?? ["none"],
    hover: t.enter ?? ["none"]
  };
}
c(Yb, "buildAnimatorConfig");
function Sc(t, e, n) {
  Zr(t);
  const i = Yb(n), r = new Ji(e, i);
  r.start("idle"), Si.set(t, r);
}
c(Sc, "startHoverAnimator");
function Zr(t) {
  const e = Si.get(t);
  e && (e.detach(), Si.delete(t));
}
c(Zr, "stopHoverAnimator");
function Ls(t, e, n, i) {
  return e.type === "tile-tint" ? { uuid: t, toColor: n ? e.toColor : e.fromColor, mode: e.mode } : e.type === "tile-scale" ? {
    uuid: t,
    toScale: n ? e.toScale : e.fromScale,
    ...i
  } : { uuid: t, attribute: e.attribute, value: n ? e.to : e.from };
}
c(Ls, "buildClickParams");
function Kb(t) {
  const e = t._source.width, n = t._source.height, i = t._source.x, r = t._source.y;
  return {
    baseWidth: e,
    baseHeight: n,
    centerX: i + e / 2,
    centerY: r + n / 2
  };
}
c(Kb, "captureRefGeometry");
async function Jb(t, e) {
  const n = t.uuid, i = e.type ?? "tile-prop", r = Ci(i);
  if (!r) {
    console.warn(`[${sm}] tile-interactions: unknown tween type "${i}"`);
    return;
  }
  const a = e.period ?? 300, o = e.easing ?? "easeOutCubic", s = e.mode ?? "bounce", l = i === "tile-scale" ? Kb(t) : null;
  if (s === "toggle") {
    const d = !(Mu.get(t) ?? !1);
    await r.execute(
      Ls(n, e, d, l),
      { durationMS: a, easing: o, commit: !0 }
    ), Mu.set(t, d);
  } else {
    const u = a / 2;
    await r.execute(
      Ls(n, e, !0, l),
      { durationMS: u, easing: o, commit: !1 }
    ), await r.execute(
      Ls(n, e, !1, l),
      { durationMS: u, easing: o, commit: !1 }
    );
  }
}
c(Jb, "playClickAnimation");
async function Xb(t) {
  var n;
  const e = t.doc.id;
  if (!wr.has(e)) {
    wr.add(e);
    try {
      Zr(e);
      const i = t.clickConfig.map((r) => Jb(t.doc, r));
      await Promise.all(i);
    } finally {
      wr.delete(e), t.hoverConfig && (Sc(e, t.placeable, t.hoverConfig), Fn === e && ((n = Si.get(e)) == null || n.setState("hover")));
    }
  }
}
c(Xb, "handleClick");
function fm(t) {
  var r;
  const e = um(t);
  if (!e) return;
  const n = dm(e), i = (n == null ? void 0 : n.doc.id) ?? null;
  if (i !== Fn) {
    if (Fn) {
      const a = Si.get(Fn);
      a && a.setState("idle");
    }
    if (i) {
      const a = Si.get(i);
      a && a.setState("hover");
    }
    Fn = i, i && (n.hoverConfig || (r = n.clickConfig) != null && r.length) ? (At === null && (At = document.body.style.cursor), document.body.style.cursor = "pointer") : At !== null && (document.body.style.cursor = At, At = null);
  }
}
c(fm, "onPointerMove");
function mm(t) {
  var i;
  if (t.button !== 0) return;
  const e = um(t);
  if (!e) return;
  const n = dm(e);
  !n || !((i = n.clickConfig) != null && i.length) || Xb(n);
}
c(mm, "onPointerDown");
function Qb() {
  var n;
  for (const i of Si.keys())
    Zr(i);
  dn.clear(), wr.clear(), Fn = null, At !== null && (document.body.style.cursor = At, At = null);
  const t = document.getElementById("board");
  kt && (t == null || t.removeEventListener("pointermove", kt), kt = null), Vt && (t == null || t.removeEventListener("pointerdown", Vt), Vt = null);
  const e = (n = canvas.tiles) == null ? void 0 : n.placeables;
  if (Array.isArray(e)) {
    for (const i of e) {
      const r = i.document, a = cm(r);
      if (!a) continue;
      const o = lm(a.hover), s = Array.isArray(a.click) && a.click.length ? a.click : null;
      !o && !s || (dn.set(r.id, { doc: r, placeable: i, hoverConfig: o, clickConfig: s }), o && Sc(r.id, i, o));
    }
    dn.size !== 0 && (kt = fm, Vt = mm, t == null || t.addEventListener("pointermove", kt), t == null || t.addEventListener("pointerdown", Vt));
  }
}
c(Qb, "rebuild");
function Zb(t) {
  const e = t.id, n = cm(t), i = n ? lm(n.hover) : null, r = n && Array.isArray(n.click) && n.click.length ? n.click : null;
  if (!i && !r) {
    hm(t);
    return;
  }
  Zr(e);
  const a = t.object;
  if (!a) {
    dn.delete(e);
    return;
  }
  dn.set(e, { doc: t, placeable: a, hoverConfig: i, clickConfig: r }), i && Sc(e, a, i), ev();
}
c(Zb, "updateTile");
function hm(t) {
  const e = t.id;
  if (Zr(e), dn.delete(e), wr.delete(e), Fn === e && (Fn = null, At !== null && (document.body.style.cursor = At, At = null)), dn.size === 0) {
    const n = document.getElementById("board");
    kt && (n == null || n.removeEventListener("pointermove", kt), kt = null), Vt && (n == null || n.removeEventListener("pointerdown", Vt), Vt = null);
  }
}
c(hm, "removeTile");
function ev() {
  if (dn.size === 0 || kt) return;
  const t = document.getElementById("board");
  t && (kt = fm, Vt = mm, t.addEventListener("pointermove", kt), t.addEventListener("pointerdown", Vt));
}
c(ev, "ensureListeners");
const Jl = "eidolon-utilities", Xl = "tile-interactions", tv = "eidolon-idle-animation", nv = "fa-solid fa-wave-pulse", gm = [
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
], pm = {
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
  ]
}, Mi = {
  attribute: "alpha",
  from: 1,
  to: 0.5,
  period: 300,
  mode: "bounce"
}, Fi = {
  fromColor: "#ffffff",
  toColor: "#ffaa00",
  period: 500,
  mode: "bounce"
}, $a = {
  type: "tile-scale",
  fromScale: 1,
  toScale: 1.2,
  period: 300,
  easing: "easeOutCubic",
  mode: "bounce"
}, ym = [
  { value: "alpha", label: "Alpha (Opacity)" },
  { value: "rotation", label: "Rotation" },
  { value: "texture.rotation", label: "Texture Rotation" }
];
function iv(t) {
  var e;
  return (t == null ? void 0 : t.document) ?? ((e = t == null ? void 0 : t.object) == null ? void 0 : e.document) ?? (t == null ? void 0 : t.object) ?? null;
}
c(iv, "getTileDocument");
function rv(t) {
  var r;
  const e = (r = t == null ? void 0 : t.getFlag) == null ? void 0 : r.call(t, Jl, Xl);
  if (!e) return { hoverIdle: [], hoverEnter: [], click: [] };
  let n = [], i = [];
  return e.hover && (Array.isArray(e.hover) ? i = e.hover : typeof e.hover == "object" && (n = Array.isArray(e.hover.idle) ? e.hover.idle : [], i = Array.isArray(e.hover.enter) ? e.hover.enter : [])), {
    hoverIdle: n,
    hoverEnter: i,
    click: Array.isArray(e.click) ? e.click : []
  };
}
c(rv, "getInteractionConfigs");
function Nu(t) {
  if (!t) return "";
  const e = t.name ?? "float", n = gm.find((i) => i.value === e);
  return (n == null ? void 0 : n.label) ?? e;
}
c(Nu, "summarizeHoverConfig");
function ha(t, e, n, i) {
  const r = t.name ?? "float", a = Wo(), o = document.createElement("div");
  o.classList.add("idle-anim__slot", "is-collapsed", n), o.dataset.index = String(e);
  const s = document.createElement("div");
  s.classList.add("idle-anim__slot-header");
  const l = document.createElement("i");
  l.classList.add("fa-solid", "fa-chevron-right", "idle-anim__slot-chevron");
  const u = document.createElement("span");
  u.classList.add("idle-anim__slot-title"), u.textContent = `${i} ${e + 1}`;
  const d = document.createElement("span");
  d.classList.add("idle-anim__slot-summary"), d.textContent = Nu(t);
  const h = document.createElement("button");
  h.type = "button", h.classList.add("idle-anim__slot-remove"), h.innerHTML = '<i class="fa-solid fa-xmark"></i>', h.title = "Remove effect", s.append(l, u, d, h), o.appendChild(s);
  const f = document.createElement("div");
  f.classList.add("idle-anim__slot-body");
  const g = It(
    "Behaviour",
    "ti-hover__behaviour",
    gm.map((v) => ({ value: v.value, label: v.label, selected: v.value === r }))
  );
  f.appendChild(g);
  const p = document.createElement("div");
  p.classList.add("idle-anim__type-fields"), f.appendChild(p);
  function y(v, b) {
    p.innerHTML = "";
    const E = pm[v];
    if (E)
      for (const L of E) {
        const A = b[L.key] ?? L.default;
        L.type === "color" ? p.appendChild(Ar(L.label, `ti-hover__${L.key}`, A)) : L.type === "select" && L.key === "easing" ? p.appendChild(It(
          L.label,
          `ti-hover__${L.key}`,
          a.map((O) => ({ value: O, label: O, selected: O === A }))
        )) : p.appendChild(Ot(L.label, `ti-hover__${L.key}`, A, L.attrs ?? {}));
      }
  }
  c(y, "renderParams"), y(r, t), o.appendChild(f);
  const w = o.querySelector(".ti-hover__behaviour");
  return w == null || w.addEventListener("change", () => {
    y(w.value, {});
  }), s.addEventListener("click", (v) => {
    if (!v.target.closest(".idle-anim__slot-remove") && (o.classList.toggle("is-collapsed"), o.classList.contains("is-collapsed"))) {
      const b = bm(o);
      b && (d.textContent = Nu(b));
    }
  }), h.addEventListener("click", (v) => {
    v.stopPropagation();
    const b = o.parentElement;
    o.remove(), b && wm(b, n, i);
  }), o;
}
c(ha, "buildHoverSlot");
function bm(t) {
  var r;
  const e = ((r = t.querySelector(".ti-hover__behaviour")) == null ? void 0 : r.value) ?? "float", n = pm[e], i = { name: e };
  if (n)
    for (const a of n) {
      const o = t.querySelector(`.ti-hover__${a.key}`);
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
c(bm, "readHoverSlot");
function _u(t) {
  if (!t) return "";
  const e = t.type ?? "tile-prop", n = t.mode ?? "bounce", i = n.charAt(0).toUpperCase() + n.slice(1);
  if (e === "tile-tint")
    return `${i} Tint ${t.fromColor ?? "?"} → ${t.toColor ?? "?"} (${t.period ?? "?"}ms)`;
  if (e === "tile-scale") {
    const o = t.fromScale != null ? `${Math.round(t.fromScale * 100)}%` : "?", s = t.toScale != null ? `${Math.round(t.toScale * 100)}%` : "?";
    return `${i} Scale ${o} → ${s} (${t.period ?? "?"}ms)`;
  }
  const r = ym.find((o) => o.value === t.attribute), a = (r == null ? void 0 : r.label) ?? t.attribute ?? "?";
  return `${i} ${a} ${t.from ?? "?"} → ${t.to ?? "?"} (${t.period ?? "?"}ms)`;
}
c(_u, "summarizeClickConfig");
function $u(t, e) {
  const n = t.type ?? "tile-prop", i = t.mode ?? "bounce", r = Wo(), a = document.createElement("div");
  a.classList.add("idle-anim__slot", "is-collapsed", "ti-click-slot"), a.dataset.index = String(e);
  const o = document.createElement("div");
  o.classList.add("idle-anim__slot-header");
  const s = document.createElement("i");
  s.classList.add("fa-solid", "fa-chevron-right", "idle-anim__slot-chevron");
  const l = document.createElement("span");
  l.classList.add("idle-anim__slot-title"), l.textContent = `Animation ${e + 1}`;
  const u = document.createElement("span");
  u.classList.add("idle-anim__slot-summary"), u.textContent = _u(t);
  const d = document.createElement("button");
  d.type = "button", d.classList.add("idle-anim__slot-remove"), d.innerHTML = '<i class="fa-solid fa-xmark"></i>', d.title = "Remove animation", o.append(s, l, u, d), a.appendChild(o);
  const h = document.createElement("div");
  h.classList.add("idle-anim__slot-body");
  const f = document.createElement("div");
  f.classList.add("idle-anim__range-row"), f.appendChild(It("Mode", "ti-click__mode", [
    { value: "bounce", label: "Bounce", selected: i === "bounce" },
    { value: "toggle", label: "Toggle", selected: i === "toggle" }
  ])), f.appendChild(It("Type", "ti-click__type", [
    { value: "tile-prop", label: "Numeric", selected: n === "tile-prop" },
    { value: "tile-tint", label: "Tint", selected: n === "tile-tint" },
    { value: "tile-scale", label: "Scale", selected: n === "tile-scale" }
  ])), h.appendChild(f);
  const g = document.createElement("div");
  g.classList.add("idle-anim__type-fields"), h.appendChild(g);
  function p(b, E) {
    if (g.innerHTML = "", b === "tile-tint") {
      const L = Wi(), A = E.fromColor ?? Fi.fromColor, O = E.toColor ?? Fi.toColor, M = E.mode ?? "oklch", x = document.createElement("div");
      x.classList.add("idle-anim__range-row"), x.appendChild(Ar("From", "ti-click__from-color", A)), x.appendChild(Ar("To", "ti-click__to-color", O)), g.appendChild(x), g.appendChild(It(
        "Interpolation",
        "ti-click__color-mode",
        L.map((R) => ({ value: R, label: R, selected: R === M }))
      ));
    } else if (b === "tile-scale") {
      const L = E.fromScale ?? $a.fromScale, A = E.toScale ?? $a.toScale, O = document.createElement("div");
      O.classList.add("idle-anim__range-row"), O.appendChild(Ot("From", "ti-click__from-scale", L, { step: "0.01", min: "0.01" })), O.appendChild(Ot("To", "ti-click__to-scale", A, { step: "0.01", min: "0.01" })), g.appendChild(O);
      const M = document.createElement("p");
      M.classList.add("idle-anim__hint"), M.textContent = "1.0 = original size. Scales from center.", g.appendChild(M);
    } else {
      const L = E.attribute ?? Mi.attribute, A = E.from ?? Mi.from, O = E.to ?? Mi.to;
      g.appendChild(It(
        "Attribute",
        "ti-click__attribute",
        ym.map((x) => ({ value: x.value, label: x.label, selected: x.value === L }))
      ));
      const M = document.createElement("div");
      M.classList.add("idle-anim__range-row"), M.appendChild(Ot("From", "ti-click__from", A, { step: "0.01" })), M.appendChild(Ot("To", "ti-click__to", O, { step: "0.01" })), g.appendChild(M);
    }
  }
  c(p, "renderTypeFields"), p(n, t);
  const y = t.period ?? (n === "tile-tint" ? Fi.period : Mi.period), w = t.easing ?? "easeOutCubic";
  h.appendChild(Ot("Period (ms)", "ti-click__period", y, { min: "50", step: "50" })), h.appendChild(It(
    "Easing",
    "ti-click__easing",
    r.map((b) => ({ value: b, label: b, selected: b === w }))
  )), a.appendChild(h);
  const v = a.querySelector(".ti-click__type");
  return v == null || v.addEventListener("change", () => {
    const b = v.value;
    p(b, b === "tile-tint" ? Fi : b === "tile-scale" ? $a : Mi);
  }), o.addEventListener("click", (b) => {
    if (!b.target.closest(".idle-anim__slot-remove") && (a.classList.toggle("is-collapsed"), a.classList.contains("is-collapsed"))) {
      const E = vm(a);
      E && (u.textContent = _u(E));
    }
  }), d.addEventListener("click", (b) => {
    b.stopPropagation();
    const E = a.parentElement;
    a.remove(), E && wm(E, "ti-click-slot", "Animation");
  }), a;
}
c($u, "buildClickSlot");
function vm(t) {
  var u, d, h, f, g, p, y, w, v, b, E, L, A, O;
  const e = ((u = t.querySelector(".ti-click__type")) == null ? void 0 : u.value) ?? "tile-prop", n = ((d = t.querySelector(".ti-click__mode")) == null ? void 0 : d.value) ?? "bounce", i = Number.parseInt((h = t.querySelector(".ti-click__period")) == null ? void 0 : h.value, 10), r = ((f = t.querySelector(".ti-click__easing")) == null ? void 0 : f.value) ?? "easeOutCubic";
  if (!i || i <= 0) return null;
  const a = { mode: n, period: i, easing: r };
  if (e === "tile-tint") {
    const M = ((g = t.querySelector(".ti-click__from-color")) == null ? void 0 : g.value) ?? ((p = t.querySelector(".ti-click__from-color-text")) == null ? void 0 : p.value) ?? Fi.fromColor, x = ((y = t.querySelector(".ti-click__to-color")) == null ? void 0 : y.value) ?? ((w = t.querySelector(".ti-click__to-color-text")) == null ? void 0 : w.value) ?? Fi.toColor, R = ((v = t.querySelector(".ti-click__color-mode")) == null ? void 0 : v.value) ?? "oklch";
    return { type: "tile-tint", fromColor: M, toColor: x, mode: R, ...a };
  }
  if (e === "tile-scale") {
    const M = Number.parseFloat((b = t.querySelector(".ti-click__from-scale")) == null ? void 0 : b.value), x = Number.parseFloat((E = t.querySelector(".ti-click__to-scale")) == null ? void 0 : E.value);
    return Number.isNaN(M) || Number.isNaN(x) || M <= 0 || x <= 0 ? null : { type: "tile-scale", fromScale: M, toScale: x, ...a };
  }
  const o = ((L = t.querySelector(".ti-click__attribute")) == null ? void 0 : L.value) ?? Mi.attribute, s = Number.parseFloat((A = t.querySelector(".ti-click__from")) == null ? void 0 : A.value), l = Number.parseFloat((O = t.querySelector(".ti-click__to")) == null ? void 0 : O.value);
  return Number.isNaN(s) || Number.isNaN(l) ? null : { type: "tile-prop", attribute: o, from: s, to: l, ...a };
}
c(vm, "readClickSlot");
function wm(t, e, n) {
  t.querySelectorAll(`.${e}`).forEach((r, a) => {
    r.dataset.index = String(a);
    const o = r.querySelector(".idle-anim__slot-title");
    o && (o.textContent = `${n} ${a + 1}`);
  });
}
c(wm, "renumberSlots");
function av(t) {
  const { hoverIdle: e, hoverEnter: n, click: i } = rv(t), r = document.createElement("section");
  r.classList.add("eidolon-tile-interactions");
  const a = document.createElement("h3");
  a.classList.add("ti-section-heading"), a.textContent = "Hover — Idle", r.appendChild(a);
  const o = document.createElement("p");
  o.classList.add("idle-anim__hint"), o.textContent = "Plays continuously. Stops when pointer enters the tile.", r.appendChild(o);
  const s = document.createElement("div");
  s.classList.add("idle-anim__slots", "ti-hover-idle-slots");
  for (let b = 0; b < e.length; b++)
    s.appendChild(ha(e[b], b, "ti-hover-idle-slot", "Effect"));
  r.appendChild(s);
  const l = document.createElement("button");
  l.type = "button", l.classList.add("idle-anim__add"), l.innerHTML = '<i class="fa-solid fa-plus"></i> Add Idle Effect', l.addEventListener("click", () => {
    const b = s.querySelectorAll(".ti-hover-idle-slot").length, E = ha({ name: "float" }, b, "ti-hover-idle-slot", "Effect");
    E.classList.remove("is-collapsed"), s.appendChild(E);
  }), r.appendChild(l);
  const u = document.createElement("h3");
  u.classList.add("ti-section-heading"), u.textContent = "Hover — On Enter", r.appendChild(u);
  const d = document.createElement("p");
  d.classList.add("idle-anim__hint"), d.textContent = "Plays while pointer is over the tile. Stops when pointer leaves.", r.appendChild(d);
  const h = document.createElement("div");
  h.classList.add("idle-anim__slots", "ti-hover-enter-slots");
  for (let b = 0; b < n.length; b++)
    h.appendChild(ha(n[b], b, "ti-hover-enter-slot", "Effect"));
  r.appendChild(h);
  const f = document.createElement("button");
  f.type = "button", f.classList.add("idle-anim__add"), f.innerHTML = '<i class="fa-solid fa-plus"></i> Add Hover Effect', f.addEventListener("click", () => {
    const b = h.querySelectorAll(".ti-hover-enter-slot").length, E = ha({ name: "scale" }, b, "ti-hover-enter-slot", "Effect");
    E.classList.remove("is-collapsed"), h.appendChild(E);
  }), r.appendChild(f);
  const g = document.createElement("h3");
  g.classList.add("ti-section-heading"), g.textContent = "Click Animations", r.appendChild(g);
  const p = document.createElement("div");
  p.classList.add("idle-anim__slots", "ti-click-slots");
  for (let b = 0; b < i.length; b++)
    p.appendChild($u(i[b], b));
  r.appendChild(p);
  const y = document.createElement("button");
  y.type = "button", y.classList.add("idle-anim__add"), y.innerHTML = '<i class="fa-solid fa-plus"></i> Add Animation', y.addEventListener("click", () => {
    const b = p.querySelectorAll(".ti-click-slot").length, E = $u($a, b);
    E.classList.remove("is-collapsed"), p.appendChild(E);
  }), r.appendChild(y);
  const w = document.createElement("div");
  w.classList.add("idle-anim__actions");
  const v = document.createElement("button");
  return v.type = "button", v.classList.add("idle-anim__save"), v.innerHTML = '<i class="fa-solid fa-save"></i> Save Interactions', w.appendChild(v), r.appendChild(w), r;
}
c(av, "buildSectionContent");
function xu(t, e) {
  const n = [];
  for (const i of t.querySelectorAll(`.${e}`)) {
    const r = bm(i);
    r && n.push(r);
  }
  return n;
}
c(xu, "readAllHoverSlots");
function ov(t) {
  const e = [];
  for (const n of t.querySelectorAll(".ti-click-slot")) {
    const i = vm(n);
    i && e.push(i);
  }
  return e;
}
c(ov, "readAllClickConfigs");
function sv(t, e) {
  var l;
  const n = _t(e);
  if (!n) return;
  const i = iv(t);
  if (!i) return;
  const r = uc(t, n, tv, "Animations", nv);
  if (!r || r.querySelector(".eidolon-tile-interactions")) return;
  const a = document.createElement("hr");
  a.classList.add("ti-divider"), r.appendChild(a);
  const o = av(i);
  r.appendChild(o), (l = t.setPosition) == null || l.call(t, { height: "auto" });
  const s = o.querySelector(".idle-anim__save");
  s == null || s.addEventListener("click", async () => {
    var p;
    const u = xu(o, "ti-hover-idle-slot"), d = xu(o, "ti-hover-enter-slot"), h = ov(o), f = u.length > 0 || d.length > 0, g = f || h.length > 0;
    if (await i.update({ [`flags.${Jl}.-=${Xl}`]: null }), g) {
      const y = {};
      f && (y.hover = {}, u.length > 0 && (y.hover.idle = u), d.length > 0 && (y.hover.enter = d)), h.length > 0 && (y.click = h), await i.update({ [`flags.${Jl}.${Xl}`]: y });
    }
    (p = ui.notifications) == null || p.info("Tile interactions saved.");
  });
}
c(sv, "renderInteractionSection");
const lv = "eidolon-utilities", Fu = "tile-interactions";
function cv() {
  Qb();
}
c(cv, "onCanvasReady");
function uv(t, e) {
  var i;
  const n = (i = e == null ? void 0 : e.flags) == null ? void 0 : i[lv];
  !n || !(Fu in n || `-=${Fu}` in n) || Zb(t);
}
c(uv, "onUpdateTile");
function dv(t) {
  hm(t);
}
c(dv, "onDeleteTile");
function fv(t, e) {
  sv(t, e);
}
c(fv, "onRenderTileConfig");
function mv() {
  Hooks.on("canvasReady", cv), Hooks.on("updateTile", uv), Hooks.on("deleteTile", dv), Hooks.on("renderTileConfig", fv);
}
c(mv, "registerTileInteractionHooks");
mv();
//# sourceMappingURL=eidolon-utilities.js.map
