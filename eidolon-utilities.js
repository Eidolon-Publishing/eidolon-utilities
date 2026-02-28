var kc = Object.defineProperty;
var bm = Object.getPrototypeOf;
var vm = Reflect.get;
var Mc = (t) => {
  throw TypeError(t);
};
var wm = (t, e, n) => e in t ? kc(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var c = (t, e) => kc(t, "name", { value: e, configurable: !0 });
var ye = (t, e, n) => wm(t, typeof e != "symbol" ? e + "" : e, n), as = (t, e, n) => e.has(t) || Mc("Cannot " + n);
var m = (t, e, n) => (as(t, e, "read from private field"), n ? n.call(t) : e.get(t)), k = (t, e, n) => e.has(t) ? Mc("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, n), L = (t, e, n, i) => (as(t, e, "write to private field"), i ? i.call(t, n) : e.set(t, n), n), S = (t, e, n) => (as(t, e, "access private method"), n);
var os = (t, e, n, i) => ({
  set _(r) {
    L(t, e, r, n);
  },
  get _() {
    return m(t, e, i);
  }
}), Re = (t, e, n) => vm(bm(t), n, e);
const T = "eidolon-utilities", Fa = "timeTriggerActive", ks = "timeTriggerHideWindow", Ms = "timeTriggerShowPlayerWindow", Ns = "timeTriggerAllowRealTime", Fu = "timeTriggers", ha = "timeTriggerHistory", $s = "debug", xs = "timeFormat", _s = "manageTime", Fs = "secondsPerRound";
const Em = [-30, -15, -5, 5, 15, 30], Hi = 1440 * 60, ga = "playSound", Yr = 6;
function E(t, e) {
  var n, i;
  return (i = (n = game.i18n) == null ? void 0 : n.has) != null && i.call(n, t) ? game.i18n.localize(t) : e;
}
c(E, "localize");
function xt(t) {
  return typeof t != "string" ? "" : t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
c(xt, "escapeHtml");
function Yt(t) {
  var e;
  return t == null ? t : (e = foundry == null ? void 0 : foundry.utils) != null && e.duplicate ? foundry.utils.duplicate(t) : JSON.parse(JSON.stringify(t));
}
c(Yt, "duplicateData");
function Sm() {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
c(Sm, "generateTriggerId");
function Du(t) {
  if (typeof t != "string") return null;
  const e = t.trim();
  if (!e) return null;
  const n = e.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (!n) return null;
  const i = Number(n[1]), r = Number(n[2]), a = n[3] !== void 0 ? Number(n[3]) : 0;
  return !Number.isInteger(i) || !Number.isInteger(r) || !Number.isInteger(a) || i < 0 || i > 23 || r < 0 || r > 59 || a < 0 || a > 59 ? null : i * 3600 + r * 60 + a;
}
c(Du, "parseTriggerTimeToSeconds");
function cr() {
  var t, e;
  return ((t = game.scenes) == null ? void 0 : t.current) ?? ((e = game.scenes) == null ? void 0 : e.active) ?? null;
}
c(cr, "getActiveScene");
function Jt(t) {
  return (t == null ? void 0 : t.object) ?? (t == null ? void 0 : t.document) ?? null;
}
c(Jt, "getSceneFromApplication");
function Ke(t) {
  return t && typeof t.getFlag == "function" && typeof t.setFlag == "function";
}
c(Ke, "hasSceneDocument");
const Ds = /* @__PURE__ */ new Set(), Ps = /* @__PURE__ */ new Set(), Rs = /* @__PURE__ */ new Set(), Hs = /* @__PURE__ */ new Set();
let vi = !1, Tr = !1, Da = Yr, Pa = "12h", Nc = !1;
function ss(t) {
  vi = !!t;
  for (const e of Ds)
    try {
      e(vi);
    } catch (n) {
      console.error(`${T} | Debug change handler failed`, n);
    }
}
c(ss, "notifyDebugChange");
function ls(t) {
  Tr = !!t;
  for (const e of Ps)
    try {
      e(Tr);
    } catch (n) {
      console.error(`${T} | Manage time change handler failed`, n);
    }
}
c(ls, "notifyManageTimeChange");
function Pu(t) {
  return t === "24h" ? "24h" : "12h";
}
c(Pu, "normalizeTimeFormatValue");
function Ql(t) {
  const e = Number(t);
  return !Number.isFinite(e) || e <= 0 ? Yr : e;
}
c(Ql, "normalizeSecondsPerRoundValue");
function cs(t) {
  const e = Ql(t);
  Da = e;
  for (const n of Rs)
    try {
      n(e);
    } catch (i) {
      console.error(`${T} | Seconds-per-round change handler failed`, i);
    }
}
c(cs, "notifySecondsPerRoundChange");
function us(t) {
  const e = Pu(t);
  Pa = e;
  for (const n of Hs)
    try {
      n(e);
    } catch (i) {
      console.error(`${T} | Time format change handler failed`, i);
    }
}
c(us, "notifyTimeFormatChange");
function Cm() {
  var e;
  if (Nc) return;
  if (Nc = !0, !((e = game == null ? void 0 : game.settings) != null && e.register)) {
    console.warn(
      `${T} | game.settings.register is unavailable. Module settings could not be registered.`
    );
    return;
  }
  const t = typeof game.settings.registerChange == "function";
  game.settings.register(T, $s, {
    name: E("EIDOLON.TimeTrigger.DebugSettingName", "Enable debug logging"),
    hint: E(
      "EIDOLON.TimeTrigger.DebugSettingHint",
      "Write detailed time-trigger diagnostics to the browser console."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: t ? void 0 : ss
  }), t && game.settings.registerChange(T, $s, ss), vi = Zl(), ss(vi), game.settings.register(T, _s, {
    name: E("EIDOLON.TimeTrigger.ManageTimeSettingName", "Manage Game Time"),
    hint: E(
      "EIDOLON.TimeTrigger.ManageTimeSettingHint",
      "Allow Eidolon Utilities to advance world time automatically while the game is unpaused. Warning: This may conflict with other time-management modules."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: t ? void 0 : ls
  }), t && game.settings.registerChange(T, _s, ls), Tr = Lm(), ls(Tr), game.settings.register(T, Fs, {
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
    default: Yr,
    range: { min: 1, max: 3600, step: 1 },
    onChange: t ? void 0 : cs
  }), t && game.settings.registerChange(
    T,
    Fs,
    cs
  ), Da = Ql(Im()), cs(Da), game.settings.register(T, xs, {
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
    onChange: t ? void 0 : us
  }), t && game.settings.registerChange(T, xs, us), Pa = Pu(Ru()), us(Pa);
}
c(Cm, "registerTimeTriggerSettings");
function Zl() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return !!game.settings.get(T, $s);
  } catch (e) {
    console.error(`${T} | Failed to read debug setting`, e);
  }
  return !1;
}
c(Zl, "getDebugSetting");
function Tm() {
  return vi = Zl(), vi;
}
c(Tm, "refreshDebugSettingCache");
function Lm() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return !!game.settings.get(T, _s);
  } catch (e) {
    console.error(`${T} | Failed to read manage time setting`, e);
  }
  return !1;
}
c(Lm, "getManageTimeSetting");
function Ru() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return game.settings.get(T, xs) === "24h" ? "24h" : "12h";
  } catch (e) {
    console.error(`${T} | Failed to read time format setting`, e);
  }
  return "12h";
}
c(Ru, "getTimeFormatSetting");
function Im() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get) {
      const e = game.settings.get(T, Fs);
      return Ql(e);
    }
  } catch (e) {
    console.error(`${T} | Failed to read seconds-per-round setting`, e);
  }
  return Yr;
}
c(Im, "getSecondsPerRoundSetting");
function Om(t) {
  if (typeof t != "function")
    return () => {
    };
  Ds.add(t);
  try {
    t(vi);
  } catch (e) {
    console.error(`${T} | Debug change handler failed`, e);
  }
  return () => {
    Ds.delete(t);
  };
}
c(Om, "onDebugSettingChange");
function Hu(t) {
  if (typeof t != "function")
    return () => {
    };
  Ps.add(t);
  try {
    t(Tr);
  } catch (e) {
    console.error(`${T} | Manage time change handler failed`, e);
  }
  return () => {
    Ps.delete(t);
  };
}
c(Hu, "onManageTimeSettingChange");
function ec(t) {
  if (typeof t != "function")
    return () => {
    };
  Hs.add(t);
  try {
    t(Pa);
  } catch (e) {
    console.error(`${T} | Time format change handler failed`, e);
  }
  return () => {
    Hs.delete(t);
  };
}
c(ec, "onTimeFormatSettingChange");
function Am(t) {
  if (typeof t != "function")
    return () => {
    };
  Rs.add(t);
  try {
    t(Da);
  } catch (e) {
    console.error(`${T} | Seconds-per-round change handler failed`, e);
  }
  return () => {
    Rs.delete(t);
  };
}
c(Am, "onSecondsPerRoundSettingChange");
let qo = !1, qs = !1;
function js(t) {
  qo = !!t;
}
c(js, "updateDebugState");
function qu() {
  qs || (qs = !0, js(Zl()), Om((t) => {
    js(t), console.info(`${T} | Debug ${qo ? "enabled" : "disabled"}`);
  }));
}
c(qu, "ensureInitialized");
function tc() {
  return qs || qu(), qo;
}
c(tc, "shouldLog");
function ju(t) {
  if (!t.length)
    return [`${T} |`];
  const [e, ...n] = t;
  return typeof e == "string" ? [`${T} | ${e}`, ...n] : [`${T} |`, e, ...n];
}
c(ju, "formatArgs");
function km() {
  qu();
}
c(km, "initializeDebug");
function Mm() {
  return js(Tm()), qo;
}
c(Mm, "syncDebugState");
function N(...t) {
  tc() && console.debug(...ju(t));
}
c(N, "debugLog");
function Ki(...t) {
  tc() && console.group(...ju(t));
}
c(Ki, "debugGroup");
function Fn() {
  tc() && console.groupEnd();
}
c(Fn, "debugGroupEnd");
function qi(t) {
  var r;
  const e = (r = t == null ? void 0 : t.getFlag) == null ? void 0 : r.call(t, T, Fu);
  if (!e) return [];
  const n = Yt(e), i = Array.isArray(n) ? n : [];
  return N("Loaded time triggers", {
    sceneId: (t == null ? void 0 : t.id) ?? null,
    count: i.length
  }), i;
}
c(qi, "getTimeTriggers");
async function Bu(t, e) {
  t != null && t.setFlag && (N("Persisting time triggers", {
    sceneId: t.id,
    count: Array.isArray(e) ? e.length : 0
  }), await t.setFlag(T, Fu, e));
}
c(Bu, "setTimeTriggers");
function Nm(t) {
  var r;
  const e = (r = t == null ? void 0 : t.getFlag) == null ? void 0 : r.call(t, T, ha);
  if (!e) return {};
  const n = Yt(e);
  if (!n || typeof n != "object") return {};
  const i = {};
  for (const [a, o] of Object.entries(n))
    typeof o == "number" && Number.isFinite(o) && (i[a] = o);
  return N("Loaded time trigger history", {
    sceneId: (t == null ? void 0 : t.id) ?? null,
    keys: Object.keys(i)
  }), i;
}
c(Nm, "getTimeTriggerHistory");
async function ds(t, e) {
  var l, u, d, h;
  if (!t) return;
  const n = {};
  if (e && typeof e == "object")
    for (const [f, g] of Object.entries(e))
      typeof g == "number" && Number.isFinite(g) && (n[f] = g);
  const i = ((l = t.getFlag) == null ? void 0 : l.call(t, T, ha)) ?? {}, r = {};
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
    o.length && typeof t.unsetFlag == "function" && await t.unsetFlag(T, ha), a.length && await t.setFlag(T, ha, n);
  } catch (f) {
    console.error(`${T} | Failed to persist time trigger history`, f), (h = (d = ui.notifications) == null ? void 0 : d.error) == null || h.call(
      d,
      E(
        "EIDOLON.TimeTrigger.HistoryPersistError",
        "Failed to persist the scene's time trigger history."
      )
    );
  }
}
c(ds, "updateTimeTriggerHistory");
const Ra = /* @__PURE__ */ new Map(), $c = /* @__PURE__ */ new Set();
function $m(t) {
  if (!(t != null && t.id))
    throw new Error(`${T} | Action definitions require an id.`);
  if (Ra.has(t.id))
    throw new Error(`${T} | Duplicate time trigger action id: ${t.id}`);
  Ra.set(t.id, {
    ...t
  }), N("Registered time trigger action", { actionId: t.id });
}
c($m, "registerAction");
function Kr(t) {
  return Ra.get(t) ?? null;
}
c(Kr, "getAction");
function xm(t) {
  const e = Kr(t);
  return e ? typeof e.label == "function" ? e.label() : e.label : t;
}
c(xm, "getActionLabel");
function xc() {
  return Array.from(Ra.values());
}
c(xc, "listActions");
async function Uu(t, e) {
  var i, r;
  const n = Kr(e == null ? void 0 : e.action);
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
c(Uu, "executeTriggerAction");
function _m(t) {
  const e = Kr(t == null ? void 0 : t.action);
  return !e || typeof e.buildSummaryParts != "function" ? [] : e.buildSummaryParts({ trigger: t, escapeHtml: xt, localize: E }) ?? [];
}
c(_m, "buildActionSummaryParts");
function Fm(t) {
  const e = Kr(t == null ? void 0 : t.action);
  return !e || typeof e.buildFormContent != "function" ? "" : e.buildFormContent({ trigger: t, escapeHtml: xt, localize: E }) ?? "";
}
c(Fm, "buildActionFormSection");
function Dm(t, e) {
  const n = Kr(t == null ? void 0 : t.action);
  !n || typeof n.prepareFormData != "function" || n.prepareFormData({ trigger: t, formData: e });
}
c(Dm, "applyActionFormData");
function Pm(t, e, n) {
  var a, o;
  const i = `${(t == null ? void 0 : t.id) ?? "unknown"}:${(e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.action) ?? "unknown"}:${n}`;
  if ($c.has(i)) return;
  $c.add(i);
  const r = E(
    "EIDOLON.TimeTrigger.MissingDataWarning",
    "A scene time trigger is missing required data and was skipped."
  );
  (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, r), console.warn(`${T} | Missing trigger data (${n})`, { scene: t == null ? void 0 : t.id, trigger: e });
}
c(Pm, "warnMissingTriggerData");
async function Rm({ scene: t, trigger: e }) {
  var a, o, s, l, u;
  const n = (s = (o = (a = e == null ? void 0 : e.data) == null ? void 0 : a.path) == null ? void 0 : o.trim) == null ? void 0 : s.call(o);
  if (!n) {
    Pm(t, e, "missing-audio-path");
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
      E(
        "EIDOLON.TimeTrigger.AudioHelperUnavailable",
        "Unable to play audio for a time trigger because the Foundry audio helper is unavailable."
      )
    );
    return;
  }
  await r;
}
c(Rm, "executePlaySoundAction");
$m({
  id: ga,
  label: /* @__PURE__ */ c(() => E("EIDOLON.TimeTrigger.ActionPlaySound", "Play Sound"), "label"),
  execute: Rm,
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
var Au;
const { ApplicationV2: Gn, HandlebarsApplicationMixin: zn } = ((Au = foundry.applications) == null ? void 0 : Au.api) ?? {};
if (!Gn || !zn)
  throw new Error(
    `${T} | ApplicationV2 API unavailable. Update Foundry VTT to v13 or newer.`
  );
const Rn = "AM", wi = "PM";
function Dn() {
  return Ru();
}
c(Dn, "getConfiguredTimeFormat");
function jo(t) {
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
c(jo, "parseCanonicalTimeString");
function Vt({ hours: t, minutes: e, seconds: n }) {
  if (!Number.isInteger(t) || !Number.isInteger(e) || t < 0 || t > 23 || e < 0 || e > 59) return null;
  const i = String(t).padStart(2, "0"), r = String(e).padStart(2, "0");
  if (Number.isInteger(n)) {
    if (n < 0 || n > 59) return null;
    const a = String(n).padStart(2, "0");
    return `${i}:${r}:${a}`;
  }
  return `${i}:${r}`;
}
c(Vt, "formatCanonicalTime");
function Hm(t, { format: e } = {}) {
  if (!t || typeof t != "object") return null;
  const n = Number(t.hour), i = Number(t.minute), r = t.second !== void 0 && t.second !== null, a = r ? Number(t.second) : null, o = r && Number.isFinite(a) ? Math.floor(Math.max(0, Math.min(59, a))) : null;
  if (!Number.isFinite(n) || !Number.isFinite(i)) return null;
  const s = e ?? Dn();
  return Ha(
    {
      hours: n,
      minutes: i,
      seconds: o
    },
    s
  );
}
c(Hm, "formatTimeComponentsForDisplay");
function qm(t, { format: e } = {}) {
  const n = jo(t);
  if (!n) return "";
  const i = e ?? Dn();
  return Ha(n, i);
}
c(qm, "formatTriggerTimeForDisplay");
function Ha(t, e = "12h") {
  if (!t) return "";
  const { hours: n, minutes: i, seconds: r = null } = t;
  if (!Number.isInteger(n) || !Number.isInteger(i)) return "";
  const a = Number.isInteger(r);
  if (e === "24h") {
    const f = `${String(n).padStart(2, "0")}:${String(i).padStart(2, "0")}`;
    return a ? `${f}:${String(r).padStart(2, "0")}` : f;
  }
  const o = n >= 12 ? wi : Rn, s = n % 12 === 0 ? 12 : n % 12, l = String(s), u = String(i).padStart(2, "0"), d = `${l}:${u}`, h = o === Rn ? E("EIDOLON.TimeTrigger.TimePeriodAM", Rn) : E("EIDOLON.TimeTrigger.TimePeriodPM", wi);
  if (a) {
    const f = String(r).padStart(2, "0");
    return `${d}:${f} ${h}`;
  }
  return `${d} ${h}`;
}
c(Ha, "formatTimeParts");
function _c(t, e = Dn()) {
  const n = jo(t);
  if (e === "24h")
    return {
      format: e,
      canonical: n ? Vt(n) ?? "" : "",
      hour: n ? String(n.hours).padStart(2, "0") : "",
      minute: n ? String(n.minutes).padStart(2, "0") : ""
    };
  if (!n)
    return {
      format: e,
      canonical: "",
      hour: "",
      minute: "",
      period: Rn
    };
  const i = n.hours >= 12 ? wi : Rn, r = n.hours % 12 === 0 ? 12 : n.hours % 12;
  return {
    format: e,
    canonical: Vt(n) ?? "",
    hour: String(r),
    minute: String(n.minutes).padStart(2, "0"),
    period: i
  };
}
c(_c, "getTimeFormValues");
function jm({ hour: t, minute: e, period: n, time: i }, r = Dn()) {
  if (r === "24h") {
    const g = typeof t == "string" ? t.trim() : "", p = typeof e == "string" ? e.trim() : "", y = typeof i == "string" ? i.trim() : "";
    if (!g && !p && y) {
      const C = jo(y);
      return C ? { canonical: Vt(C) ?? "", error: null } : {
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
    const v = Number(g), b = Number(p);
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
    } : { canonical: Vt({
      hours: v,
      minutes: b
    }) ?? "", error: null };
  }
  const a = typeof t == "string" ? t.trim() : "", o = typeof e == "string" ? e.trim() : "", s = typeof n == "string" ? n.trim().toUpperCase() : "";
  if (!a || !o || !s)
    return { canonical: "", error: E("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.") };
  if (s !== Rn && s !== wi)
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
    hours: s === wi ? d + 12 : d,
    minutes: u
  };
  return {
    canonical: Vt(f) ?? "",
    error: null
  };
}
c(jm, "normalizeFormTimeInput");
function Bm() {
  return [
    {
      value: Rn,
      label: E("EIDOLON.TimeTrigger.TimePeriodAM", Rn)
    },
    {
      value: wi,
      label: E("EIDOLON.TimeTrigger.TimePeriodPM", wi)
    }
  ];
}
c(Bm, "getPeriodOptions");
var ii, ri, re, Vu, uo, fo, Gu, Us, Vs, mo, ho, zu, Wu, Yu, Gs, zs, Ws, go, po, Ys, yo, Ku, Ju;
const ti = class ti extends zn(Gn) {
  constructor(n = {}) {
    var o;
    const { scene: i, showControls: r, ...a } = n ?? {};
    super(a);
    k(this, re);
    k(this, ii, null);
    k(this, ri, null);
    k(this, uo, /* @__PURE__ */ c((n) => {
      var r, a;
      n.preventDefault();
      const i = Number((a = (r = n.currentTarget) == null ? void 0 : r.dataset) == null ? void 0 : a.delta);
      Number.isFinite(i) && (N("Time delta button clicked", { delta: i }), this._advanceTime(i));
    }, "#onDeltaClick"));
    k(this, fo, /* @__PURE__ */ c((n) => {
      var i, r;
      n.preventDefault(), !(!this.showControls || !((i = game.user) != null && i.isGM)) && (N("Time value double clicked", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null }), S(this, re, Gu).call(this));
    }, "#onTimeDoubleClick"));
    k(this, mo, /* @__PURE__ */ c((n) => {
      if (this.isEditingTime && !this._commitTimeInProgress)
        if (n.key === "Enter") {
          n.preventDefault();
          const i = n.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
          S(this, re, Vs).call(this, r);
        } else n.key === "Escape" && (n.preventDefault(), S(this, re, Us).call(this));
    }, "#onTimeInputKeydown"));
    k(this, ho, /* @__PURE__ */ c((n) => {
      if (!this.isEditingTime || this._commitTimeInProgress || this._suppressBlurCommit) return;
      const i = n.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
      S(this, re, Vs).call(this, r);
    }, "#onTimeInputBlur"));
    k(this, go, /* @__PURE__ */ c((n) => {
      const i = !!n;
      if (this.manageTimeEnabled === i) return;
      this.manageTimeEnabled = i, (this.rendered ?? this.isRendered ?? !1) && this.render({ force: !0 });
    }, "#handleManageTimeChange"));
    k(this, po, /* @__PURE__ */ c(async (n) => {
      var a, o, s, l, u, d, h, f, g;
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
        await i.setFlag(T, Ns, r), this.sceneAllowsRealTime = r;
        const p = r ? E(
          "EIDOLON.TimeTrigger.SceneRealTimeEnabled",
          "Automatic real-time flow enabled for this scene."
        ) : E(
          "EIDOLON.TimeTrigger.SceneRealTimeDisabled",
          "Automatic real-time flow disabled for this scene."
        );
        (h = (d = ui.notifications) == null ? void 0 : d.info) == null || h.call(d, p);
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
    k(this, yo, /* @__PURE__ */ c(() => {
      (this.rendered ?? this.isRendered ?? !1) && (this.isEditingTime && (this.editValue = S(this, re, Gs).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    this.scene = i ?? null, this.showControls = typeof r == "boolean" ? r : !!((o = game.user) != null && o.isGM), this.isEditingTime = !1, this.editValue = "", this._commitTimeInProgress = !1, this._suppressBlurCommit = !1, this.manageTimeEnabled = !1, this.sceneAllowsRealTime = S(this, re, Ys).call(this), L(this, ii, ec(m(this, yo))), L(this, ri, Hu(m(this, go)));
  }
  async _prepareContext() {
    var b, w;
    const n = ((b = game.time) == null ? void 0 : b.components) ?? {}, r = ((n == null ? void 0 : n.second) !== void 0 && (n == null ? void 0 : n.second) !== null ? Hm(n) : null) ?? S(this, re, Vu).call(this), a = Dn(), o = a === "24h", s = o ? E("EIDOLON.TimeTrigger.EditTimePlaceholder24", "HH:MM") : E("EIDOLON.TimeTrigger.EditTimePlaceholder12", "HH:MM AM/PM"), l = this.showControls ? E(
      "EIDOLON.TimeTrigger.EditTimeHint",
      "Double-click to set a specific time."
    ) : "", u = this.showControls ? E(
      "EIDOLON.TimeTrigger.EditTimeLabel",
      "New time (HH:MM or HH:MM AM/PM)"
    ) : "", d = Em.map((C) => ({
      minutes: C,
      label: C > 0 ? `+${C}` : `${C}`
    })), h = !!this.manageTimeEnabled, f = S(this, re, Ys).call(this);
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
      manageTimeEnabled: h,
      sceneAllowsRealTime: f,
      realTimeButtonLabel: h ? f ? p : g : y,
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
    return S(this, re, Ku).call(this), S(this, re, Ju).call(this), i;
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
    } catch (h) {
      console.error(`${T} | Failed to advance time`, h), (u = (l = ui.notifications) == null ? void 0 : l.error) == null || u.call(
        l,
        E("EIDOLON.TimeTrigger.Error", "Failed to update the world time.")
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
          u.addEventListener("click", m(this, uo));
        });
        const o = r.querySelector('.time-trigger-window__time-value[data-editable="true"]');
        o && o.addEventListener("dblclick", m(this, fo), { once: !1 });
        const s = r.querySelector(".time-trigger-window__time-input");
        s && (s.addEventListener("keydown", m(this, mo)), s.addEventListener("blur", m(this, ho)), typeof s.focus == "function" && (s.focus(), typeof s.select == "function" && s.select()));
        const l = r.querySelector('[data-action="toggle-real-time"]');
        l && l.addEventListener("click", m(this, po));
      }
      this._suppressBlurCommit = !1;
    }
  }
};
ii = new WeakMap(), ri = new WeakMap(), re = new WeakSet(), Vu = /* @__PURE__ */ c(function() {
  var l;
  const n = (l = game.time) == null ? void 0 : l.worldTime;
  if (typeof n != "number" || !Number.isFinite(n)) return "";
  const i = 1440 * 60, r = (Math.floor(n) % i + i) % i, a = Math.floor(r / 3600), o = Math.floor(r % 3600 / 60), s = r % 60;
  return Ha({ hours: a, minutes: o, seconds: s }, Dn());
}, "#formatFallbackTime"), uo = new WeakMap(), fo = new WeakMap(), Gu = /* @__PURE__ */ c(function() {
  var n;
  (n = game.user) != null && n.isGM && (this.isEditingTime = !0, this._suppressBlurCommit = !1, this.editValue = S(this, re, Gs).call(this), this.render({ force: !0 }));
}, "#enterTimeEditMode"), Us = /* @__PURE__ */ c(function() {
  this.isEditingTime = !1, this.editValue = "", this._suppressBlurCommit = !1, this.render({ force: !0 });
}, "#cancelTimeEdit"), Vs = /* @__PURE__ */ c(async function(n) {
  var a, o, s;
  if (!((a = game.user) != null && a.isGM) || !this.isEditingTime || this._commitTimeInProgress) return;
  this._commitTimeInProgress = !0;
  const i = typeof n == "string" ? n.trim() : "";
  if (!i) {
    S(this, re, Us).call(this), this._commitTimeInProgress = !1;
    return;
  }
  const r = S(this, re, Yu).call(this, i);
  if (r.error) {
    (s = (o = ui.notifications) == null ? void 0 : o.error) == null || s.call(o, r.error), this._suppressBlurCommit = !0, this.editValue = i, this.render({ force: !0 }), this._commitTimeInProgress = !1;
    return;
  }
  try {
    await S(this, re, Wu).call(this, r.seconds, r.includeSeconds) ? (this.isEditingTime = !1, this.editValue = "", this.render({ force: !0 })) : (this.editValue = i, this.render({ force: !0 }));
  } finally {
    this._commitTimeInProgress = !1;
  }
}, "#commitTimeInput"), mo = new WeakMap(), ho = new WeakMap(), zu = /* @__PURE__ */ c(function() {
  var u, d;
  const n = (u = game.time) == null ? void 0 : u.worldTime;
  if (typeof n != "number" || !Number.isFinite(n))
    return "";
  const i = ((d = game.time) == null ? void 0 : d.components) ?? {}, r = Number(i.hour), a = Number(i.minute), o = i.second !== void 0 ? Number(i.second) : null, s = Number.isInteger(o);
  return (Number.isFinite(r) && Number.isFinite(a) ? Vt({
    hours: Math.max(0, Math.min(23, Number(r))),
    minutes: Math.max(0, Math.min(59, Number(a))),
    seconds: s && Number.isFinite(o) ? Math.max(0, Math.min(59, Number(o))) : void 0
  }) ?? "" : "") ?? "";
}, "#getCurrentCanonicalTime"), Wu = /* @__PURE__ */ c(async function(n, i) {
  var f, g, p, y, v, b, w, C, I, A;
  const r = (f = game.time) == null ? void 0 : f.worldTime;
  if (typeof r != "number" || !Number.isFinite(r))
    return (p = (g = ui.notifications) == null ? void 0 : g.error) == null || p.call(
      g,
      E(
        "EIDOLON.TimeTrigger.EditTimeUnavailable",
        "The world time is unavailable, so it can't be updated."
      )
    ), !1;
  if (!Number.isInteger(n) || n < 0 || n >= Hi)
    return (v = (y = ui.notifications) == null ? void 0 : y.error) == null || v.call(
      y,
      E(
        "EIDOLON.TimeTrigger.EditTimeInvalidRange",
        "Enter a time within the current day."
      )
    ), !1;
  const s = Math.floor(r / Hi) * Hi + n - r;
  if (!Number.isFinite(s) || s === 0)
    return !0;
  const l = Math.floor(n / 3600), u = Math.floor(n % 3600 / 60), d = n % 60, h = Vt({
    hours: l,
    minutes: u,
    seconds: i ? d : void 0
  });
  try {
    N("Updating world time directly", {
      sceneId: ((b = this.scene) == null ? void 0 : b.id) ?? null,
      targetCanonical: h ?? null,
      diff: s
    }), await game.time.advance(s);
    const O = Ha(
      {
        hours: l,
        minutes: u,
        seconds: i ? d : null
      },
      Dn()
    );
    (C = (w = ui.notifications) == null ? void 0 : w.info) == null || C.call(
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
}, "#applyTargetSeconds"), Yu = /* @__PURE__ */ c(function(n) {
  var h;
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
        canonical: Vt({ hours: f, minutes: g, seconds: p }),
        seconds: y,
        includeSeconds: p !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const { amLower: o, pmLower: s, periodPattern: l } = S(this, re, zs).call(this), u = r.match(
    new RegExp(
      `^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?\\s*(${l})$`,
      "i"
    )
  );
  if (u) {
    let f = Number(u[1]);
    const g = Number(u[2]), p = u[3] !== void 0 ? Number(u[3]) : void 0, y = u[4] ?? "", v = typeof y == "string" ? ((h = y.toLocaleLowerCase) == null ? void 0 : h.call(y)) ?? y.toLowerCase() : "";
    if (Number.isInteger(f) && f >= 1 && f <= 12 && Number.isInteger(g) && g >= 0 && g <= 59 && (p === void 0 || Number.isInteger(p) && p >= 0 && p <= 59) && (v === o || v === s || v === "am" || v === "pm")) {
      f = f % 12, (v === s || v === "pm") && (f += 12);
      const w = f * 3600 + g * 60 + (p ?? 0);
      return {
        canonical: Vt({ hours: f, minutes: g, seconds: p }),
        seconds: w,
        includeSeconds: p !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const d = Du(r);
  if (d !== null) {
    const f = Math.floor(d / 3600), g = Math.floor(d % 3600 / 60), p = d % 60, y = p !== 0;
    return {
      canonical: Vt({
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
}, "#parseInputTime"), Gs = /* @__PURE__ */ c(function() {
  const n = S(this, re, zu).call(this);
  if (!n) return "";
  if (Dn() === "24h")
    return n;
  const r = jo(n);
  if (!r) return n;
  const a = Number(r.hours), o = Number(r.minutes), s = r.seconds !== null && r.seconds !== void 0 ? Number(r.seconds) : void 0;
  if (!Number.isFinite(a) || !Number.isFinite(o)) return n;
  const l = Number.isFinite(s), u = a % 12 === 0 ? 12 : a % 12, d = String(o).padStart(2, "0"), h = l ? `:${String(s).padStart(2, "0")}` : "", { amLabel: f, pmLabel: g } = S(this, re, zs).call(this), p = a >= 12 ? g : f;
  return `${u}:${d}${h} ${p}`.trim();
}, "#getInitialEditValue"), zs = /* @__PURE__ */ c(function() {
  var u, d;
  const n = E("EIDOLON.TimeTrigger.TimePeriodAM", "AM"), i = E("EIDOLON.TimeTrigger.TimePeriodPM", "PM"), r = ((u = n.toLocaleLowerCase) == null ? void 0 : u.call(n)) ?? n.toLowerCase(), a = ((d = i.toLocaleLowerCase) == null ? void 0 : d.call(i)) ?? i.toLowerCase(), o = S(this, re, Ws).call(this, n), s = S(this, re, Ws).call(this, i), l = `${o}|${s}|AM|PM`;
  return {
    amLabel: n,
    pmLabel: i,
    amLower: r,
    pmLower: a,
    periodPattern: l
  };
}, "#getPeriodMatchData"), Ws = /* @__PURE__ */ c(function(n) {
  return typeof n != "string" ? "" : n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}, "#escapeForRegex"), go = new WeakMap(), po = new WeakMap(), Ys = /* @__PURE__ */ c(function() {
  const n = this.scene;
  if (!n || typeof n.getFlag != "function") return !1;
  try {
    return !!n.getFlag(T, Ns);
  } catch (i) {
    N("TimeTriggerWindow | Failed to read scene real-time flag", {
      sceneId: (n == null ? void 0 : n.id) ?? null,
      message: (i == null ? void 0 : i.message) ?? String(i)
    });
  }
  return !1;
}, "#readSceneRealTimeFlag"), yo = new WeakMap(), Ku = /* @__PURE__ */ c(function() {
  if (typeof m(this, ii) == "function")
    try {
      m(this, ii).call(this);
    } catch (n) {
      console.error(`${T} | Failed to dispose time format subscription`, n);
    }
  L(this, ii, null);
}, "#disposeTimeFormatSubscription"), Ju = /* @__PURE__ */ c(function() {
  if (typeof m(this, ri) == "function")
    try {
      m(this, ri).call(this);
    } catch (n) {
      console.error(`${T} | Failed to dispose manage time subscription`, n);
    }
  L(this, ri, null);
}, "#disposeManageTimeSubscription"), c(ti, "TimeTriggerWindow"), ye(ti, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Re(ti, ti, "DEFAULT_OPTIONS"),
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
)), ye(ti, "PARTS", {
  content: {
    template: `modules/${T}/templates/time-trigger.html`
  }
});
let Bs = ti;
function Bo(t, e = {}) {
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
c(Bo, "createApplicationFactory");
const Fc = /* @__PURE__ */ new Set();
var Se, Qe, ai, Zi, Xu, Qu;
const Ec = class Ec {
  constructor({ windowFactory: e } = {}) {
    k(this, Zi);
    k(this, Se, null);
    k(this, Qe, null);
    k(this, ai);
    const n = Bo(Bs);
    typeof e == "function" ? e.__eidolonFactorySignature === "options" ? L(this, ai, (r, a = {}) => e({ scene: r, ...a ?? {} })) : L(this, ai, e) : L(this, ai, /* @__PURE__ */ c((r, a = {}) => n({ scene: r, ...a ?? {} }), "fallbackFactory"));
  }
  onReady() {
    var n;
    const e = typeof ((n = game.time) == null ? void 0 : n.worldTime) == "number" && Number.isFinite(game.time.worldTime) ? game.time.worldTime : null;
    N("TimeTriggerManager#onReady", { worldTime: e }), e !== null && L(this, Qe, e);
  }
  onCanvasReady(e) {
    const n = (e == null ? void 0 : e.scene) ?? cr();
    N("TimeTriggerManager#onCanvasReady", { sceneId: (n == null ? void 0 : n.id) ?? null }), this.refreshTimeTriggerWindow(n), this.handleTimeTriggerEvaluation(n);
  }
  onUpdateScene(e) {
    const n = cr();
    N("TimeTriggerManager#onUpdateScene", {
      sceneId: (e == null ? void 0 : e.id) ?? null,
      activeSceneId: (n == null ? void 0 : n.id) ?? null
    }), !(!n || e.id !== n.id) && (this.refreshTimeTriggerWindow(e), this.handleTimeTriggerEvaluation(e));
  }
  onUpdateWorldTime(e, n) {
    N("TimeTriggerManager#onUpdateWorldTime", {
      worldTime: e,
      diff: n,
      hasWindow: !!m(this, Se)
    }), m(this, Se) && m(this, Se).render();
    const i = cr(), r = S(this, Zi, Xu).call(this, e, n);
    this.handleTimeTriggerEvaluation(i, e, r);
  }
  refreshTimeTriggerWindow(e) {
    var l, u, d;
    if (!e) return;
    const n = !!((l = game.user) != null && l.isGM), i = !!e.getFlag(T, Fa), r = !!e.getFlag(T, ks), a = !!e.getFlag(T, Ms);
    if (N("TimeTriggerManager#refreshTimeTriggerWindow", {
      sceneId: e.id,
      isGM: n,
      isActive: i,
      hideWindow: r,
      showPlayerWindow: a
    }), !(i && !r && (n || a))) {
      m(this, Se) && (N("Closing time trigger window", { reason: "not-visible" }), m(this, Se).close({ force: !0 }), L(this, Se, null));
      return;
    }
    const s = !!n;
    if (m(this, Se) && ((u = m(this, Se).scene) == null ? void 0 : u.id) === e.id) {
      N("Refreshing existing time trigger window", { sceneId: e.id }), m(this, Se).showControls = s, m(this, Se).render();
      return;
    }
    m(this, Se) && (N("Closing existing window before creating new instance", {
      previousSceneId: ((d = m(this, Se).scene) == null ? void 0 : d.id) ?? null
    }), m(this, Se).close({ force: !0 })), L(this, Se, m(this, ai).call(this, e, { showControls: s })), N("Rendering new time trigger window", { sceneId: e.id }), m(this, Se).render({ force: !0 });
  }
  async handleTimeTriggerEvaluation(e, n, i) {
    var l;
    const r = e ?? cr();
    if (!r) {
      N("handleTimeTriggerEvaluation skipped", {
        reason: "no-active-scene",
        providedSceneId: (e == null ? void 0 : e.id) ?? null,
        currentWorldTime: n
      }), typeof n == "number" && Number.isFinite(n) && L(this, Qe, n);
      return;
    }
    const a = typeof n == "number" && Number.isFinite(n) ? n : typeof ((l = game.time) == null ? void 0 : l.worldTime) == "number" ? game.time.worldTime : null;
    if (a === null) return;
    const o = typeof i == "number" && Number.isFinite(i) ? i : null, s = o !== null ? o : typeof m(this, Qe) == "number" && Number.isFinite(m(this, Qe)) ? m(this, Qe) : a;
    Ki("handleTimeTriggerEvaluation", {
      sceneId: r.id,
      previousWorldTime: s,
      currentWorldTime: a,
      overrideProvided: o !== null
    });
    try {
      await S(this, Zi, Qu).call(this, r, s, a);
    } catch (u) {
      console.error(`${T} | Unexpected error while evaluating time triggers`, u), N("handleTimeTriggerEvaluation error", { message: (u == null ? void 0 : u.message) ?? String(u) });
    } finally {
      L(this, Qe, a), Fn();
    }
  }
};
Se = new WeakMap(), Qe = new WeakMap(), ai = new WeakMap(), Zi = new WeakSet(), Xu = /* @__PURE__ */ c(function(e, n) {
  return typeof m(this, Qe) == "number" && Number.isFinite(m(this, Qe)) ? (N("Resolved previous world time from cache", {
    previousWorldTime: m(this, Qe)
  }), m(this, Qe)) : typeof e == "number" && Number.isFinite(e) && typeof n == "number" && Number.isFinite(n) ? (N("Resolved previous world time using diff", {
    worldTime: e,
    diff: n,
    resolved: e - n
  }), e - n) : typeof e == "number" && Number.isFinite(e) ? e : null;
}, "#resolvePreviousWorldTime"), Qu = /* @__PURE__ */ c(async function(e, n, i) {
  var p, y, v;
  if (!((p = game.user) != null && p.isGM)) {
    N("Skipping trigger evaluation because user is not a GM");
    return;
  }
  if (!(e != null && e.id)) {
    N("Skipping trigger evaluation because the scene is missing an id");
    return;
  }
  if (!!!e.getFlag(T, Fa)) {
    N("Skipping trigger evaluation because scene is inactive", { sceneId: e.id });
    return;
  }
  if (typeof i != "number" || !Number.isFinite(i)) return;
  (typeof n != "number" || !Number.isFinite(n)) && (n = i);
  const a = qi(e);
  if (!a.length) {
    N("No time triggers configured for scene", { sceneId: e.id });
    return;
  }
  const o = Nm(e), s = /* @__PURE__ */ new Set();
  for (const b of a)
    b != null && b.id && s.add(b.id);
  let l = !1;
  for (const b of Object.keys(o))
    s.has(b) || (delete o[b], l = !0);
  if (Ki("Evaluating scene time triggers", {
    sceneId: e.id,
    previousWorldTime: n,
    currentWorldTime: i,
    triggerCount: a.length
  }), i <= n) {
    N("Detected world time rewind", {
      previousWorldTime: n,
      currentWorldTime: i
    });
    for (const b of a) {
      if (!(b != null && b.id) || !b.allowReplayOnRewind) continue;
      const w = o[b.id];
      typeof w == "number" ? i < w ? (N("Clearing trigger history due to rewind", {
        triggerId: b.id,
        lastFired: w,
        currentWorldTime: i
      }), delete o[b.id], l = !0) : N("Preserving trigger history after rewind", {
        triggerId: b.id,
        lastFired: w,
        currentWorldTime: i
      }) : N("No history stored for rewind-enabled trigger", {
        triggerId: b.id
      });
    }
    l && (N("Persisting history cleanup after rewind", {
      sceneId: e.id
    }), await ds(e, o)), Fn();
    return;
  }
  const u = n, d = i, h = [], f = Math.floor(u / Hi), g = Math.floor(d / Hi);
  for (const b of a) {
    if (!(b != null && b.id)) continue;
    const w = Du(b.time);
    if (w === null) {
      Um(e, b), N("Skipping trigger with invalid time", {
        triggerId: b.id,
        time: b.time
      });
      continue;
    }
    for (let C = f; C <= g; C++) {
      const I = C * Hi + w;
      if (I < u || I > d) continue;
      const O = o[b.id];
      if (typeof O == "number" && O >= I) {
        N("Skipping trigger because it already fired within window", {
          triggerId: b.id,
          lastFired: O,
          absoluteTime: I
        });
        continue;
      }
      h.push({ trigger: b, absoluteTime: I });
    }
  }
  if (!h.length) {
    l && await ds(e, o), N("No triggers scheduled to fire within evaluation window", {
      sceneId: e.id
    }), Fn();
    return;
  }
  h.sort((b, w) => b.absoluteTime - w.absoluteTime), N("Queued triggers for execution", {
    entries: h.map((b) => ({
      triggerId: b.trigger.id,
      absoluteTime: b.absoluteTime
    }))
  });
  for (const b of h)
    try {
      N("Executing time trigger action", {
        triggerId: b.trigger.id,
        absoluteTime: b.absoluteTime
      }), await Uu(e, b.trigger);
    } catch (w) {
      console.error(`${T} | Failed to execute time trigger action`, w), (v = (y = ui.notifications) == null ? void 0 : y.error) == null || v.call(
        y,
        E(
          "EIDOLON.TimeTrigger.TriggerActionError",
          "Failed to execute a scene time trigger action. Check the console for details."
        )
      ), N("Trigger execution failed", {
        triggerId: b.trigger.id,
        message: (w == null ? void 0 : w.message) ?? String(w)
      });
    } finally {
      o[b.trigger.id] = b.absoluteTime, l = !0, N("Recorded trigger execution", {
        triggerId: b.trigger.id,
        absoluteTime: b.absoluteTime
      });
    }
  l && (N("Persisting trigger history updates", { sceneId: e.id }), await ds(e, o)), Fn();
}, "#evaluateSceneTimeTriggers"), c(Ec, "TimeTriggerManager");
let Ks = Ec;
function Um(t, e) {
  var r, a;
  const n = `${(t == null ? void 0 : t.id) ?? "unknown"}:${(e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.time) ?? "unknown"}`;
  if (Fc.has(n)) return;
  Fc.add(n);
  const i = E(
    "EIDOLON.TimeTrigger.InvalidTimeWarning",
    "A scene time trigger has an invalid time value and was skipped."
  );
  (a = (r = ui.notifications) == null ? void 0 : r.warn) == null || a.call(r, i), console.warn(`${T} | Invalid time for trigger`, { scene: t == null ? void 0 : t.id, trigger: e });
}
c(Um, "warnInvalidTriggerTime");
var Tt, kr, Lt, Sn, oi, Ht, Gi, bo, vo, Mr, Nr, si, qt, V, Xs, ki, pa, Qs, ya, Zs, Pt, Zu, el, ed, tl, td, wo, Eo, So, Co, To, Lo, nl, nd, ba, Io, Oo;
const Sc = class Sc {
  constructor() {
    k(this, V);
    k(this, Tt, !1);
    k(this, kr, Yr);
    k(this, Lt, /* @__PURE__ */ new Map());
    k(this, Sn, null);
    k(this, oi, null);
    k(this, Ht, 0);
    k(this, Gi, null);
    k(this, bo, null);
    k(this, vo, null);
    k(this, Mr, !1);
    k(this, Nr, !1);
    k(this, si, !1);
    k(this, qt, !1);
    k(this, wo, /* @__PURE__ */ c((e, n = {}) => {
      N("GameTimeAutomation | Pause state changed", {
        paused: e,
        userId: (n == null ? void 0 : n.userId) ?? null,
        broadcast: (n == null ? void 0 : n.broadcast) ?? null
      }), S(this, V, Pt).call(this, { pausedOverride: e });
    }, "#handlePause"));
    k(this, Eo, /* @__PURE__ */ c((e) => {
      e != null && e.id && (m(this, Lt).set(e.id, Math.max(e.round ?? 0, 1)), N("GameTimeAutomation | Combat started", { combatId: e.id, round: e.round ?? 0 }), S(this, V, Pt).call(this));
    }, "#handleCombatStart"));
    k(this, So, /* @__PURE__ */ c((e, n) => {
      if (!(e != null && e.id)) return;
      const i = typeof n == "number" && Number.isFinite(n) ? n : typeof e.round == "number" && Number.isFinite(e.round) ? e.round : 0, r = i > 0 ? i : 1, a = m(this, Lt).get(e.id), o = a ? Math.max(a, 1) : 1, s = r > 1 ? Math.max(r - o, 0) : 0;
      if (N("GameTimeAutomation | Combat round change detected", {
        combatId: e.id,
        effectiveRound: r,
        completedRounds: s,
        enabled: m(this, Tt),
        paused: (game == null ? void 0 : game.paused) ?? null
      }), s > 0 && m(this, Tt) && m(this, qt) && !(game != null && game.paused) && S(this, V, ki).call(this) && S(this, V, pa).call(this, e)) {
        const l = s * m(this, kr);
        l > 0 && (N("GameTimeAutomation | Advancing time for completed combat rounds", {
          combatId: e.id,
          completedRounds: s,
          delta: l
        }), S(this, V, tl).call(this, l));
      }
      m(this, Lt).set(e.id, Math.max(r, 1));
    }, "#handleCombatRound"));
    k(this, Co, /* @__PURE__ */ c((e) => {
      e != null && e.id && (m(this, Lt).delete(e.id), N("GameTimeAutomation | Combat ended", { combatId: e.id }), S(this, V, Pt).call(this));
    }, "#handleCombatEnd"));
    k(this, To, /* @__PURE__ */ c((e) => {
      e != null && e.id && (m(this, Lt).delete(e.id), N("GameTimeAutomation | Combat deleted", { combatId: e.id }), S(this, V, Pt).call(this));
    }, "#handleCombatDelete"));
    k(this, Lo, /* @__PURE__ */ c((e, n) => {
      if (e != null && e.id) {
        if (typeof (n == null ? void 0 : n.round) == "number" && Number.isFinite(n.round)) {
          const i = Math.max(n.round, 1);
          m(this, Lt).set(e.id, i), N("GameTimeAutomation | Combat round manually updated", {
            combatId: e.id,
            round: i
          });
        }
        (Object.prototype.hasOwnProperty.call(n ?? {}, "active") || (n == null ? void 0 : n.round) !== void 0) && S(this, V, Pt).call(this);
      }
    }, "#handleCombatUpdate"));
    k(this, Io, /* @__PURE__ */ c((e) => {
      S(this, V, ba).call(this, e == null ? void 0 : e.scene), S(this, V, Pt).call(this);
    }, "#handleCanvasReady"));
    k(this, Oo, /* @__PURE__ */ c((e) => {
      if (!Ke(e)) return;
      const n = S(this, V, nl).call(this);
      if (!n || n.id !== e.id) return;
      S(this, V, ba).call(this, e) && S(this, V, Pt).call(this);
    }, "#handleSceneUpdate"));
  }
  registerHooks() {
    m(this, Mr) || (L(this, Mr, !0), Hooks.on("pauseGame", m(this, wo)), Hooks.on("combatStart", m(this, Eo)), Hooks.on("combatRound", m(this, So)), Hooks.on("combatEnd", m(this, Co)), Hooks.on("deleteCombat", m(this, To)), Hooks.on("updateCombat", m(this, Lo)), Hooks.on("canvasReady", m(this, Io)), Hooks.on("updateScene", m(this, Oo)));
  }
  initialize() {
    m(this, Nr) || (L(this, Nr, !0), L(this, bo, Hu((e) => {
      const n = !!e, i = n !== m(this, Tt);
      L(this, Tt, n), N("GameTimeAutomation | Manage time toggled", { enabled: n }), i && n && S(this, V, Zs).call(this), S(this, V, Pt).call(this);
    })), L(this, vo, Am((e) => {
      L(this, kr, e), N("GameTimeAutomation | Seconds per round updated", { value: e });
    })), S(this, V, Zs).call(this), S(this, V, ba).call(this), S(this, V, Pt).call(this));
  }
};
Tt = new WeakMap(), kr = new WeakMap(), Lt = new WeakMap(), Sn = new WeakMap(), oi = new WeakMap(), Ht = new WeakMap(), Gi = new WeakMap(), bo = new WeakMap(), vo = new WeakMap(), Mr = new WeakMap(), Nr = new WeakMap(), si = new WeakMap(), qt = new WeakMap(), V = new WeakSet(), Xs = /* @__PURE__ */ c(function() {
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
}, "#currentTimestamp"), ki = /* @__PURE__ */ c(function() {
  var e;
  return !!((e = game == null ? void 0 : game.user) != null && e.isGM && game.user.active !== !1);
}, "#canControlTime"), pa = /* @__PURE__ */ c(function(e) {
  var i, r;
  if (!e) return !1;
  if (e.active === !0) return !0;
  if (e.active === !1) return !1;
  const n = (i = game == null ? void 0 : game.combats) == null ? void 0 : i.active;
  return (n == null ? void 0 : n.id) === e.id ? !0 : ((r = game == null ? void 0 : game.combat) == null ? void 0 : r.id) === e.id ? game.combat.active ?? !0 : !1;
}, "#isCombatDocumentActive"), Qs = /* @__PURE__ */ c(function(e) {
  return e ? typeof e.started == "boolean" ? e.started : (e.round ?? 0) > 0 : !1;
}, "#hasCombatStarted"), ya = /* @__PURE__ */ c(function() {
  var i;
  const e = Array.isArray((i = game == null ? void 0 : game.combats) == null ? void 0 : i.contents) ? game.combats.contents : [];
  for (const r of e)
    if (S(this, V, pa).call(this, r) && S(this, V, Qs).call(this, r))
      return !0;
  const n = game == null ? void 0 : game.combat;
  return !!(n && S(this, V, pa).call(this, n) && S(this, V, Qs).call(this, n));
}, "#isCombatRunning"), Zs = /* @__PURE__ */ c(function() {
  var n;
  m(this, Lt).clear();
  const e = Array.isArray((n = game == null ? void 0 : game.combats) == null ? void 0 : n.contents) ? game.combats.contents : [];
  for (const i of e)
    i != null && i.id && m(this, Lt).set(i.id, Math.max(i.round ?? 0, 1));
}, "#hydrateRoundTracking"), Pt = /* @__PURE__ */ c(function({ pausedOverride: e } = {}) {
  const n = typeof e == "boolean" ? e : !!(game != null && game.paused), i = m(this, Tt), r = m(this, qt), a = i && r, o = {
    manageTimeEnabled: i,
    sceneAllowsRealTime: r,
    effectiveEnabled: a,
    paused: n,
    canControl: S(this, V, ki).call(this),
    combatRunning: S(this, V, ya).call(this),
    overrideApplied: typeof e == "boolean"
  };
  if (N("GameTimeAutomation | Sync running state", o), !a || !S(this, V, ki).call(this)) {
    S(this, V, el).call(this);
    return;
  }
  S(this, V, Zu).call(this);
}, "#syncRunningState"), Zu = /* @__PURE__ */ c(function() {
  m(this, Sn) === null && (L(this, oi, S(this, V, Xs).call(this)), L(this, Sn, globalThis.setInterval(() => S(this, V, ed).call(this), 1e3)), N("GameTimeAutomation | Started real-time ticker"));
}, "#startRealTimeTicker"), el = /* @__PURE__ */ c(function() {
  m(this, Sn) !== null && (globalThis.clearInterval(m(this, Sn)), L(this, Sn, null), N("GameTimeAutomation | Stopped real-time ticker")), L(this, oi, null), L(this, Ht, 0), L(this, si, !1);
}, "#stopRealTimeTicker"), ed = /* @__PURE__ */ c(function() {
  if (!m(this, Tt) || !m(this, qt) || !S(this, V, ki).call(this)) {
    S(this, V, el).call(this);
    return;
  }
  const e = S(this, V, Xs).call(this);
  if (typeof e != "number" || !Number.isFinite(e)) return;
  const n = m(this, oi) ?? e, i = (e - n) / 1e3;
  if (L(this, oi, e), !Number.isFinite(i) || i <= 0) return;
  const r = !!(game != null && game.paused), a = S(this, V, ya).call(this);
  if (r || a) {
    m(this, si) || N("GameTimeAutomation | Tick skipped", { paused: r, combatRunning: a }), L(this, si, !0), L(this, Ht, 0);
    return;
  }
  L(this, si, !1), N("GameTimeAutomation | Real-time tick", { deltaSeconds: i }), S(this, V, tl).call(this, i);
}, "#tickRealTime"), tl = /* @__PURE__ */ c(function(e) {
  if (!m(this, Tt) || !m(this, qt)) return;
  const n = Number(e);
  !Number.isFinite(n) || n <= 0 || (L(this, Ht, m(this, Ht) + n), !m(this, Gi) && L(this, Gi, S(this, V, td).call(this)));
}, "#queueAdvance"), td = /* @__PURE__ */ c(async function() {
  var e, n;
  for (; m(this, Ht) > 0; ) {
    if (!m(this, Tt) || !m(this, qt) || game != null && game.paused || !S(this, V, ki).call(this) || S(this, V, ya).call(this)) {
      L(this, Ht, 0);
      break;
    }
    const i = m(this, Ht);
    L(this, Ht, 0);
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
  L(this, Gi, null);
}, "#flushAdvanceQueue"), wo = new WeakMap(), Eo = new WeakMap(), So = new WeakMap(), Co = new WeakMap(), To = new WeakMap(), Lo = new WeakMap(), nl = /* @__PURE__ */ c(function() {
  const e = cr();
  return Ke(e) ? e : null;
}, "#getActiveSceneDocument"), nd = /* @__PURE__ */ c(function(e) {
  if (!Ke(e)) return !1;
  try {
    return !!e.getFlag(T, Ns);
  } catch (n) {
    return N("GameTimeAutomation | Failed to read scene real-time flag", {
      sceneId: (e == null ? void 0 : e.id) ?? null,
      message: (n == null ? void 0 : n.message) ?? String(n)
    }), !1;
  }
}, "#isSceneRealTimeAllowed"), ba = /* @__PURE__ */ c(function(e) {
  const n = Ke(e) ? e : S(this, V, nl).call(this), i = S(this, V, nd).call(this, n), r = m(this, qt);
  return L(this, qt, i), r !== i ? (N("GameTimeAutomation | Scene real-time allowance changed", {
    sceneId: (n == null ? void 0 : n.id) ?? null,
    allows: i
  }), !0) : !1;
}, "#refreshSceneAutomationState"), Io = new WeakMap(), Oo = new WeakMap(), c(Sc, "GameTimeAutomation");
let Js = Sc;
var ku, Cn, He, li, ln, Ao, Ee, id, rd, ad, od, ko, rl, Mo, sd, No, ld, cd;
const rn = class rn extends zn(Gn) {
  constructor(n = {}) {
    const { scene: i, trigger: r, triggerIndex: a, onSave: o, ...s } = n ?? {};
    super(s);
    k(this, Ee);
    k(this, Cn, null);
    k(this, He, null);
    k(this, li, null);
    k(this, ln, null);
    k(this, Ao, /* @__PURE__ */ c(() => {
      (this.rendered ?? this.isRendered ?? !1) && (L(this, ln, S(this, Ee, id).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    k(this, ko, /* @__PURE__ */ c((n) => {
      var a, o;
      const i = n.currentTarget, r = i == null ? void 0 : i.closest("form");
      r && (N("Trigger action selection changed", {
        sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
        triggerId: ((o = this.trigger) == null ? void 0 : o.id) ?? null,
        actionId: (i == null ? void 0 : i.value) ?? null
      }), S(this, Ee, rl).call(this, i.value, r));
    }, "#onActionSelectChange"));
    k(this, Mo, /* @__PURE__ */ c((n) => {
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
    k(this, No, /* @__PURE__ */ c(async (n) => {
      var r, a;
      n.preventDefault();
      const i = n.currentTarget;
      i instanceof HTMLFormElement && (N("Trigger form submitted", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null,
        triggerId: ((a = this.trigger) == null ? void 0 : a.id) ?? null
      }), await S(this, Ee, ld).call(this, i));
    }, "#onSubmit"));
    this.scene = i ?? null, this.trigger = r ?? null, this.triggerIndex = Number.isInteger(a) ? Number(a) : null, this.onSave = typeof o == "function" ? o : null, L(this, li, ec(m(this, Ao)));
  }
  async _prepareContext() {
    var n, i;
    Ki("TriggerFormApplication#_prepareContext", {
      sceneId: ((n = this.scene) == null ? void 0 : n.id) ?? null,
      triggerId: ((i = this.trigger) == null ? void 0 : i.id) ?? null,
      triggerIndex: this.triggerIndex
    });
    try {
      const r = this.trigger ?? { action: ga, data: {} }, a = r.action ?? ga, o = _c(r.time), s = o.format ?? "12h", l = s === "12h" ? Bm() : [], u = o.period ?? (l.length > 0 ? l[0].value : null), d = s === "12h" ? l.map((g) => ({
        ...g,
        selected: g.value === u
      })) : [], h = xc().map((g) => ({
        id: g.id,
        label: typeof g.label == "function" ? g.label() : g.label,
        selected: g.id === a
      })), f = xc().map((g) => {
        const p = g.id === r.action ? r : { ...r, action: g.id }, y = Fm(p);
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
      Fn();
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
    S(this, Ee, sd).call(this, o), S(this, Ee, rd).call(this, o), o.addEventListener("submit", m(this, No));
    const s = o.querySelector("[data-action-select]");
    s && (s.addEventListener("change", m(this, ko)), S(this, Ee, rl).call(this, s.value, o)), o.querySelectorAll("[data-action-file-picker]").forEach((h) => {
      h.addEventListener("click", m(this, Mo));
    });
  }
  async close(n = {}) {
    var i;
    if ((i = m(this, Cn)) == null || i.call(this), L(this, Cn, null), L(this, He, null), L(this, ln, null), typeof m(this, li) == "function")
      try {
        m(this, li).call(this);
      } catch (r) {
        console.error(`${T} | Failed to dispose trigger form time format subscription`, r);
      }
    return L(this, li, null), super.close(n);
  }
};
Cn = new WeakMap(), He = new WeakMap(), li = new WeakMap(), ln = new WeakMap(), Ao = new WeakMap(), Ee = new WeakSet(), id = /* @__PURE__ */ c(function() {
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
    const p = a.querySelector("[data-time-hidden]"), y = a.querySelector("[data-time-hour]"), v = a.querySelector("[data-time-minute]"), b = a.querySelector("[data-time-period]");
    o = {
      format: ((g = a.dataset) == null ? void 0 : g.timeFormat) ?? null,
      canonical: p instanceof HTMLInputElement ? p.value : "",
      hour: y instanceof HTMLInputElement ? y.value : "",
      minute: v instanceof HTMLInputElement ? v.value : "",
      period: b instanceof HTMLSelectElement ? b.value : ""
    };
  }
  return {
    fields: r,
    time: o
  };
}, "#captureFormState"), rd = /* @__PURE__ */ c(function(n) {
  if (!m(this, ln)) return;
  if (!(n instanceof HTMLFormElement)) {
    L(this, ln, null);
    return;
  }
  const { fields: i = [], time: r = null } = m(this, ln) ?? {};
  L(this, ln, null), S(this, Ee, ad).call(this, n, i), S(this, Ee, od).call(this, n, r);
}, "#restorePendingFormState"), ad = /* @__PURE__ */ c(function(n, i) {
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
}, "#restoreFieldValues"), od = /* @__PURE__ */ c(function(n, i) {
  var w, C, I;
  const r = n.querySelector("[data-time-format]");
  if (!(r instanceof HTMLElement)) {
    typeof m(this, He) == "function" && m(this, He).call(this);
    return;
  }
  const a = ((w = r.dataset) == null ? void 0 : w.timeFormat) === "24h" ? "24h" : "12h", o = r.querySelector("[data-time-hour]"), s = r.querySelector("[data-time-minute]"), l = r.querySelector("[data-time-period]"), u = r.querySelector("[data-time-hidden]");
  if (!i) {
    if (o instanceof HTMLInputElement && (o.value = ""), s instanceof HTMLInputElement && (s.value = ""), l instanceof HTMLSelectElement) {
      const A = ((I = (C = l.options) == null ? void 0 : C[0]) == null ? void 0 : I.value) ?? "";
      l.value = A;
    }
    u instanceof HTMLInputElement && (u.value = ""), typeof m(this, He) == "function" && m(this, He).call(this);
    return;
  }
  const d = typeof i.canonical == "string" ? i.canonical : "", h = typeof i.period == "string" ? i.period : "", f = typeof i.hour == "string" ? i.hour : "", g = typeof i.minute == "string" ? i.minute : "";
  let p = "", y = "", v = h, b = d;
  if (d) {
    const A = _c(d, a);
    p = A.hour ?? "", y = A.minute ?? "", b = A.canonical ?? d, a === "12h" ? v = A.period ?? h : v = "";
  } else
    p = f, y = g, a !== "12h" && (v = "");
  if (o instanceof HTMLInputElement && (o.value = p ?? ""), s instanceof HTMLInputElement && (s.value = y ?? ""), l instanceof HTMLSelectElement)
    if (a === "12h") {
      const A = Array.from(l.options ?? []);
      A.find((M) => M.value === v) ? l.value = v : A.length > 0 ? l.value = A[0].value : l.value = "";
    } else
      l.value = "";
  u instanceof HTMLInputElement && (u.value = b ?? ""), typeof m(this, He) == "function" && m(this, He).call(this);
}, "#restoreTimeInputs"), ko = new WeakMap(), rl = /* @__PURE__ */ c(function(n, i) {
  i && i.querySelectorAll("[data-action-config]").forEach((r) => {
    const a = r.dataset.actionConfig === n;
    r.style.display = a ? "" : "none";
  });
}, "#updateActionSections"), Mo = new WeakMap(), sd = /* @__PURE__ */ c(function(n) {
  var h, f, g, p;
  if ((h = m(this, Cn)) == null || h.call(this), L(this, Cn, null), L(this, He, null), !(n instanceof HTMLFormElement)) return;
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
    const { canonical: y, error: v } = jm(
      {
        hour: o.value,
        minute: s.value,
        period: (l == null ? void 0 : l.value) ?? null,
        time: a.value
      },
      r
    );
    a.value = y ?? "";
    const b = v ?? "";
    a.setCustomValidity(b), u.forEach((w) => {
      w.setCustomValidity(b);
    });
  }, "update");
  u.forEach((y) => {
    y.addEventListener("input", d), y.addEventListener("change", d);
  }), d(), L(this, Cn, () => {
    u.forEach((y) => {
      y.removeEventListener("input", d), y.removeEventListener("change", d);
    });
  }), L(this, He, d), N("Trigger form configured for time input", {
    format: r,
    sceneId: ((g = this.scene) == null ? void 0 : g.id) ?? null,
    triggerId: ((p = this.trigger) == null ? void 0 : p.id) ?? null
  });
}, "#setupTimeInput"), No = new WeakMap(), ld = /* @__PURE__ */ c(async function(n) {
  var a, o, s, l, u;
  if (typeof m(this, He) == "function" && m(this, He).call(this), typeof n.checkValidity == "function" && !n.checkValidity()) {
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
  }), await S(this, Ee, cd).call(this, r), await this.close();
}, "#handleSubmit"), cd = /* @__PURE__ */ c(async function(n) {
  var a, o, s, l, u, d;
  const i = {
    id: ((a = this.trigger) == null ? void 0 : a.id) ?? Sm(),
    time: n.time ?? "",
    action: n.action ?? ga,
    allowReplayOnRewind: !!n.allowReplayOnRewind,
    data: {}
  };
  N("Persisting trigger from form", {
    sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
    triggerId: i.id,
    existingIndex: this.triggerIndex
  }), Dm(i, n);
  const r = qi(this.scene);
  this.triggerIndex !== null && r[this.triggerIndex] ? r[this.triggerIndex] = i : r.push(i);
  try {
    await Bu(this.scene, r), N("Trigger list saved", {
      sceneId: ((s = this.scene) == null ? void 0 : s.id) ?? null,
      triggerCount: r.length
    });
  } catch (h) {
    throw console.error(`${T} | Failed to save time trigger`, h), (u = (l = ui.notifications) == null ? void 0 : l.error) == null || u.call(
      l,
      E(
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
}, "#persistTrigger"), c(rn, "TriggerFormApplication"), ye(rn, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Re(rn, rn, "DEFAULT_OPTIONS"),
  {
    id: `${T}-trigger-form`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((ku = Re(rn, rn, "DEFAULT_OPTIONS")) == null ? void 0 : ku.classes) ?? [], "standard-form", "themed"])
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
)), ye(rn, "PARTS", {
  content: {
    template: `modules/${T}/templates/time-trigger-form.html`
  }
});
let il = rn;
function Kt(t) {
  return t instanceof HTMLElement ? t : (t == null ? void 0 : t[0]) instanceof HTMLElement ? t[0] : null;
}
c(Kt, "asHTMLElement");
function va(t) {
  return typeof (t == null ? void 0 : t.changeTab) == "function";
}
c(va, "isAppV2");
function ud(t, e, n, i = {}) {
  if (va(t)) {
    t.changeTab(e, n, i);
    return;
  }
  if (typeof (t == null ? void 0 : t.activateTab) == "function") {
    const r = { ...i };
    n != null && (r.group = n), r.triggerCallback == null && (r.triggerCallback = !0), t.activateTab(e, r);
  }
}
c(ud, "setActiveTab");
function Vm(t) {
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
c(Vm, "readFormData");
const Dc = Symbol.for("eidolon.sceneConfig.v13PatchedTabs");
function dd(t = {}) {
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
  const g = typeof d.log == "function" ? d.log.bind(d) : (...$) => {
    var R;
    return (R = console.debug) == null ? void 0 : R.call(console, `${o}`, ...$);
  }, p = typeof d.group == "function" ? d.group.bind(d) : (...$) => {
    var R;
    return (R = console.groupCollapsed) == null ? void 0 : R.call(console, `${o}`, ...$);
  }, y = typeof d.groupEnd == "function" ? d.groupEnd.bind(d) : () => {
    var $;
    return ($ = console.groupEnd) == null ? void 0 : $.call(console);
  }, v = Symbol(`EIDOLON_SCENE_CONFIG_TAB_CLEANUP_${e}`), b = typeof i == "function" ? i : () => null, w = typeof r == "function" ? r : () => !0, C = typeof n == "function" ? n : () => typeof n == "string" ? n : e;
  function I() {
    var W, H, U, K, ae;
    const $ = ((H = (W = foundry == null ? void 0 : foundry.applications) == null ? void 0 : W.sheets) == null ? void 0 : H.SceneConfig) ?? ((U = CONFIG == null ? void 0 : CONFIG.Scene) == null ? void 0 : U.sheetClass);
    if (!$ || !va({ changeTab: (K = $.prototype) == null ? void 0 : K.changeTab })) return;
    const R = $[Dc] ?? /* @__PURE__ */ new Set();
    if (R.has(e)) return;
    R.add(e), $[Dc] = R;
    const B = (ae = $.TABS) == null ? void 0 : ae.sheet;
    if (B && Array.isArray(B.tabs) && !B.tabs.some((Q) => Q.id === e)) {
      const Q = C({ app: null, scene: null }) ?? e;
      B.tabs.push({
        id: e,
        icon: f,
        label: Q
      });
    }
    $.PARTS && !$.PARTS[e] && ($.PARTS[e] = {
      template: `modules/${h}/templates/scene-config-tab-mount.hbs`,
      scrollable: [`.tab[data-tab="${e}"]`]
    }), g("Patched v13 SceneConfig TABS/PARTS", { tabId: e });
  }
  c(I, "patchV13SceneConfig");
  function A($, R) {
    var W, H;
    const B = b($);
    if (!w($, B)) {
      g("Skipped render", {
        tabId: e,
        reason: "inapplicable",
        constructor: ((W = $ == null ? void 0 : $.constructor) == null ? void 0 : W.name) ?? null
      });
      return;
    }
    p("render", {
      tabId: e,
      sceneId: (B == null ? void 0 : B.id) ?? null,
      constructor: ((H = $ == null ? void 0 : $.constructor) == null ? void 0 : H.name) ?? null
    });
    try {
      const U = Kt(R) ?? Kt($.element);
      if (!U) {
        g("Missing root element", { tabId: e });
        return;
      }
      va($) ? _($, U, B) : M($, U, B);
    } finally {
      y();
    }
  }
  c(A, "handleRender");
  function O($, R, B) {
    var U;
    if (!f) {
      $.textContent = R;
      return;
    }
    const W = (U = $.querySelector("i")) == null ? void 0 : U.cloneNode(!0);
    $.textContent = "";
    const H = W ?? document.createElement("i");
    if (W || (H.className = f, B && (H.inert = !0)), $.append(H, " "), B) {
      const K = document.createElement("span");
      K.textContent = R, $.append(K);
    } else
      $.append(document.createTextNode(R));
  }
  c(O, "setButtonContent");
  function M($, R, B) {
    var ot, Qt, Je, Ae, Li, Zt, Wn, st, en, F, ea, X, bt, $e, nr, ta;
    const H = [
      "nav.sheet-tabs[data-group]",
      "nav.tabs[data-group]",
      "nav.sheet-tabs",
      "nav.tabs"
    ].map((xe) => R.querySelector(xe)).find((xe) => xe instanceof HTMLElement), K = [
      (ot = R.querySelector(".tab[data-tab]")) == null ? void 0 : ot.parentElement,
      R.querySelector(".sheet-body"),
      (Je = (Qt = H == null ? void 0 : H.parentElement) == null ? void 0 : Qt.querySelector) == null ? void 0 : Je.call(Qt, ":scope > .sheet-body"),
      H == null ? void 0 : H.parentElement
    ].find((xe) => xe instanceof HTMLElement), ae = ((Ae = H == null ? void 0 : H.dataset) == null ? void 0 : Ae.group) ?? ((Wn = (Zt = (Li = H == null ? void 0 : H.querySelector) == null ? void 0 : Li.call(H, "a[data-group]")) == null ? void 0 : Zt.dataset) == null ? void 0 : Wn.group) ?? ((F = (en = (st = H == null ? void 0 : H.querySelector) == null ? void 0 : st.call(H, "[data-group]")) == null ? void 0 : en.dataset) == null ? void 0 : F.group) ?? ((bt = (X = (ea = K == null ? void 0 : K.querySelector) == null ? void 0 : ea.call(K, ".tab[data-group]")) == null ? void 0 : X.dataset) == null ? void 0 : bt.group) ?? "main";
    if (!H || !K) {
      g("Missing navigation elements", {
        tabId: e,
        hasNav: !!H,
        hasBody: !!K
      });
      return;
    }
    let Q = H.querySelector(`[data-tab="${e}"]`);
    if (!Q) {
      Q = document.createElement("a"), Q.dataset.action = "tab", Q.dataset.group = ae, Q.dataset.tab = e;
      const xe = H.querySelector("a[data-tab]");
      ($e = xe == null ? void 0 : xe.classList) != null && $e.contains("item") && Q.classList.add("item"), H.appendChild(Q), typeof s == "function" && s({ app: $, button: Q, nav: H, scene: B }), g("Created tab button", { tabId: e, group: ae });
    }
    O(Q, C({ app: $, scene: B }) ?? e, va($));
    let te = K.querySelector(`.tab[data-tab="${e}"]`);
    if (!te) {
      te = document.createElement("div"), te.classList.add("tab"), te.dataset.tab = e, te.dataset.group = ae;
      const xe = fd(K);
      K.insertBefore(te, xe ?? null), typeof l == "function" && l({ app: $, tab: te, body: K, scene: B }), g("Created tab container", { tabId: e, group: ae });
    }
    ((nr = Q.classList) == null ? void 0 : nr.contains("active")) || te.classList.contains("active") ? (Q.classList.add("active"), te.classList.add("active"), te.removeAttribute("hidden")) : (Q.classList.remove("active"), te.classList.remove("active"), te.setAttribute("hidden", "true"));
    const yt = /* @__PURE__ */ c(() => {
      var Yn, ir;
      ((Yn = Q.classList) != null && Yn.contains("active") || te.classList.contains("active")) && ((ir = Q.classList) == null || ir.add("active"), te.classList.add("active"), te.removeAttribute("hidden"), te.removeAttribute("aria-hidden"), te.style.display === "none" && (te.style.display = ""));
    }, "ensureTabVisible"), Pe = /* @__PURE__ */ c(() => {
      yt(), requestAnimationFrame(yt);
    }, "scheduleEnsureTabVisible");
    Q.dataset.eidolonEnsureSceneTabVisibility || (Q.addEventListener("click", () => {
      ud($, e, ae), requestAnimationFrame(yt);
    }), Q.dataset.eidolonEnsureSceneTabVisibility = "true"), fs($, v, g);
    const at = a({
      app: $,
      scene: B,
      tab: te,
      tabButton: Q,
      ensureTabVisible: yt,
      scheduleEnsureTabVisible: Pe
    });
    typeof at == "function" && Pc($, v, at), typeof u == "function" && u({
      app: $,
      scene: B,
      tab: te,
      tabButton: Q,
      ensureTabVisible: yt,
      scheduleEnsureTabVisible: Pe
    }), (ta = $.setPosition) == null || ta.call($, { height: "auto" });
  }
  c(M, "handleRenderV1");
  function _($, R, B) {
    const W = R.querySelector(`.tab[data-tab="${e}"]`), H = R.querySelector(`nav [data-tab="${e}"]`);
    if (!W || !H) {
      g("v2 mount not found, falling back to v1 injection", { tabId: e }), M($, R, B);
      return;
    }
    O(H, C({ app: $, scene: B }) ?? e, !0);
    const U = /* @__PURE__ */ c(() => {
      var Q;
      !((Q = H.classList) != null && Q.contains("active")) && !W.classList.contains("active") || (W.classList.add("active"), W.removeAttribute("hidden"), W.removeAttribute("aria-hidden"), W.style.display === "none" && (W.style.display = ""));
    }, "ensureTabVisible"), K = /* @__PURE__ */ c(() => {
      U(), requestAnimationFrame(U);
    }, "scheduleEnsureTabVisible");
    fs($, v, g);
    const ae = a({
      app: $,
      scene: B,
      tab: W,
      tabButton: H,
      ensureTabVisible: U,
      scheduleEnsureTabVisible: K
    });
    typeof ae == "function" && Pc($, v, ae), typeof u == "function" && u({
      app: $,
      scene: B,
      tab: W,
      tabButton: H,
      ensureTabVisible: U,
      scheduleEnsureTabVisible: K
    });
  }
  c(_, "handleRenderV2");
  function j($) {
    fs($, v, g);
  }
  c(j, "handleClose");
  function D() {
    return Hooks.once("init", () => {
      I();
    }), Hooks.on("renderSceneConfig", A), Hooks.on("closeSceneConfig", j), () => P();
  }
  c(D, "register");
  function P() {
    Hooks.off("renderSceneConfig", A), Hooks.off("closeSceneConfig", j);
  }
  return c(P, "unregister"), { register: D, unregister: P };
}
c(dd, "createSceneConfigTabFactory");
function Pc(t, e, n) {
  if (!t || typeof n != "function") return;
  const i = t == null ? void 0 : t[e];
  Array.isArray(i) || (t[e] = []), t[e].push(n);
}
c(Pc, "registerCleanup");
function fs(t, e, n) {
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
c(fs, "invokeCleanup");
function fd(t) {
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
c(fd, "findFooterElement");
const Gm = Bo(il), zm = `modules/${T}/templates/time-trigger-scene-tab.html`, Wm = dd({
  tabId: "time-triggers",
  tabLabel: /* @__PURE__ */ c(() => E("EIDOLON.TimeTrigger.Tab", "Time Triggers"), "tabLabel"),
  getScene: Jt,
  isApplicable: Xm,
  renderContent: /* @__PURE__ */ c(({ app: t, scene: e, tab: n }) => Km(t, n, e), "renderContent"),
  logger: {
    log: N,
    group: Ki,
    groupEnd: Fn
  }
});
function Ym() {
  return N("Registering SceneConfig render hook"), Wm.register();
}
c(Ym, "registerSceneConfigHook");
function Km(t, e, n) {
  if (!(e instanceof HTMLElement)) return;
  const i = Ke(n) ? n : Jt(t);
  qa(t, e, i);
  const r = ec(() => {
    qa(t, e, i);
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
c(Km, "renderTimeTriggerTab");
async function qa(t, e, n) {
  var r, a;
  const i = n ?? Jt(t);
  Ki("renderTimeTriggersTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!Ke(i)) {
      const W = E(
        "EIDOLON.TimeTrigger.Unavailable",
        "Time triggers are unavailable for this configuration sheet."
      );
      e.innerHTML = `<p class="notes">${W}</p>`, N("Scene lacks document for time triggers", { sceneId: (i == null ? void 0 : i.id) ?? null });
      return;
    }
    const o = `flags.${T}.${Fa}`, s = `flags.${T}.${ks}`, l = `flags.${T}.${Ms}`, u = !!i.getFlag(T, Fa), d = !!i.getFlag(T, ks), h = !!i.getFlag(T, Ms), f = qi(i);
    N("Rendering time trigger list", {
      sceneId: i.id,
      isActive: u,
      shouldHideWindow: d,
      shouldShowPlayerWindow: h,
      triggerCount: f.length
    });
    const g = E("EIDOLON.TimeTrigger.Activate", "Activate Time Trigger"), p = E(
      "EIDOLON.TimeTrigger.Description",
      "Enable scene time triggers so scheduled actions can run automatically."
    ), y = E(
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
    ), I = E(
      "EIDOLON.TimeTrigger.TriggerListEmpty",
      "No time triggers configured for this scene."
    ), A = E("EIDOLON.TimeTrigger.AddTrigger", "Add Trigger"), O = E("EIDOLON.TimeTrigger.EditTrigger", "Edit"), M = E("EIDOLON.TimeTrigger.DeleteTrigger", "Remove"), _ = E("EIDOLON.TimeTrigger.TriggerNow", "Trigger Now"), j = E("EIDOLON.TimeTrigger.AtLabel", "At"), D = E("EIDOLON.TimeTrigger.DoLabel", "Do"), P = E("EIDOLON.TimeTrigger.MissingTime", "(No time set)"), $ = f.map((W, H) => {
      const ae = (W.time ? qm(W.time) : "") || W.time || "" || P, Q = xm(W.action), te = [
        `${j} ${ae}`,
        `${D} ${Q}`,
        ..._m(W)
      ];
      return {
        index: H,
        summaryParts: te,
        tooltips: {
          triggerNow: _,
          edit: O,
          delete: M
        }
      };
    }), R = ((a = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : a.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof R != "function") {
      console.error(`${T} | renderTemplate is unavailable; cannot render scene tab.`), e.innerHTML = `<p class="notes">${I}</p>`;
      return;
    }
    let B = "";
    try {
      B = await R(zm, {
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
          showPlayerWindow: b,
          triggerList: C,
          empty: I,
          add: A
        },
        hints: {
          activate: p,
          hideWindow: v,
          showPlayerWindow: w
        },
        triggers: $,
        hasTriggers: $.length > 0
      });
    } catch (W) {
      console.error(`${T} | Failed to render time trigger scene tab template`, W), e.innerHTML = `<p class="notes">${I}</p>`;
      return;
    }
    e.innerHTML = B, Jm(t, e, i);
  } finally {
    Fn();
  }
}
c(qa, "renderTimeTriggersTabContent");
function Jm(t, e, n) {
  const i = n ?? Jt(t);
  if (!Ke(i)) return;
  const r = e.querySelector('[data-action="add-trigger"]');
  r && r.addEventListener("click", () => {
    N("Add trigger button clicked", { sceneId: i.id }), Rc(t, { scene: i });
  }), e.querySelectorAll('[data-action="edit-trigger"]').forEach((a) => {
    a.addEventListener("click", () => {
      const o = Number(a.dataset.index);
      if (!Number.isInteger(o)) return;
      const l = qi(i)[o];
      l && (N("Edit trigger button clicked", { sceneId: i.id, triggerId: l.id, index: o }), Rc(t, { trigger: l, triggerIndex: o, scene: i }));
    });
  }), e.querySelectorAll('[data-action="delete-trigger"]').forEach((a) => {
    a.addEventListener("click", async () => {
      var u, d;
      const o = Number(a.dataset.index);
      if (!Number.isInteger(o)) return;
      const s = qi(i), l = s[o];
      if (l) {
        s.splice(o, 1);
        try {
          N("Deleting trigger", {
            sceneId: i.id,
            index: o,
            triggerId: (l == null ? void 0 : l.id) ?? null
          }), await Bu(i, s), await qa(t, e, i);
        } catch (h) {
          console.error(`${T} | Failed to delete time trigger`, h), (d = (u = ui.notifications) == null ? void 0 : u.error) == null || d.call(
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
      var u, d, h, f, g, p, y;
      const o = Number(a.dataset.index);
      if (!Number.isInteger(o)) return;
      const l = qi(i)[o];
      if (l) {
        if (!((u = game.user) != null && u.isGM)) {
          (h = (d = ui.notifications) == null ? void 0 : d.warn) == null || h.call(
            d,
            E("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time.")
          );
          return;
        }
        try {
          N("Manually firing trigger", { sceneId: i.id, triggerId: l.id, index: o }), await Uu(i, l), (g = (f = ui.notifications) == null ? void 0 : f.info) == null || g.call(
            f,
            E(
              "EIDOLON.TimeTrigger.TriggerNowSuccess",
              "Triggered the selected time trigger."
            )
          );
        } catch (v) {
          console.error(`${T} | Failed to execute time trigger manually`, v), (y = (p = ui.notifications) == null ? void 0 : p.error) == null || y.call(
            p,
            E(
              "EIDOLON.TimeTrigger.TriggerNowError",
              "Failed to execute the selected time trigger."
            )
          ), N("Manual trigger execution failed", {
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
c(Jm, "bindTimeTriggerTabEvents");
function Rc(t, e = {}) {
  var o;
  const n = e.scene ?? null, i = n && Ke(n) ? n : Jt(t);
  if (!Ke(i)) {
    console.warn(`${T} | Unable to open trigger form because no scene document is available.`);
    return;
  }
  N("Opening trigger form", {
    sceneId: i.id,
    triggerId: ((o = e.trigger) == null ? void 0 : o.id) ?? null,
    index: Number.isInteger(e.triggerIndex) ? Number(e.triggerIndex) : null
  }), Gm({
    scene: i,
    trigger: e.trigger ?? null,
    triggerIndex: e.triggerIndex ?? null,
    onSave: /* @__PURE__ */ c(() => {
      var l, u;
      const s = (u = (l = t.element) == null ? void 0 : l[0]) == null ? void 0 : u.querySelector('.tab[data-tab="time-triggers"]');
      s && qa(t, s, i);
    }, "onSave")
  }).render({ force: !0 });
}
c(Rc, "openTriggerForm");
function Xm(t, e) {
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
c(Xm, "isRecognizedSceneConfig");
const aa = new Ks(), Hc = new Js();
function Qm() {
  N("Registering time trigger hooks"), Hooks.once("init", () => {
    Cm(), km(), N("Time trigger settings registered during init");
  }), Ym(), N("Scene config hook registered"), Hc.registerHooks(), N("Time automation hooks registered"), Hooks.once("ready", () => {
    Mm(), N("Ready hook fired"), aa.onReady(), Hc.initialize();
  }), Hooks.on("canvasReady", (t) => {
    var e;
    N("canvasReady hook received", { scene: ((e = t == null ? void 0 : t.scene) == null ? void 0 : e.id) ?? null }), aa.onCanvasReady(t);
  }), Hooks.on("updateScene", (t) => {
    N("updateScene hook received", { scene: (t == null ? void 0 : t.id) ?? null }), aa.onUpdateScene(t);
  }), Hooks.on("updateWorldTime", (t, e) => {
    N("updateWorldTime hook received", { worldTime: t, diff: e }), aa.onUpdateWorldTime(t, e);
  });
}
c(Qm, "registerTimeTriggerHooks");
Qm();
const Te = T, md = "criteria", nc = "state", Zm = "criteriaVersion", eh = 1, hd = "enableCriteriaSurfaces";
let qc = !1;
function th() {
  var t;
  if (!qc) {
    if (qc = !0, !((t = game == null ? void 0 : game.settings) != null && t.register)) {
      console.warn(`${Te} | game.settings.register unavailable; scene criteria setting skipped.`);
      return;
    }
    game.settings.register(Te, hd, {
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
        nh();
      }, "onChange")
    });
  }
}
c(th, "registerSceneCriteriaSettings");
function Uo() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return !!game.settings.get(Te, hd);
  } catch (e) {
    console.error(`${Te} | Failed to read criteria surfaces setting`, e);
  }
  return !0;
}
c(Uo, "getCriteriaSurfacesEnabled");
function nh() {
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
c(nh, "promptReloadForCriteriaSurfaces");
const ja = "Standard";
function pt(t) {
  var n;
  const e = (n = t == null ? void 0 : t.getFlag) == null ? void 0 : n.call(t, Te, md);
  return e ? gd(e) : [];
}
c(pt, "getSceneCriteria");
async function Vo(t, e) {
  if (!(t != null && t.setFlag)) return;
  const n = gd(e);
  await t.setFlag(Te, md, n), await t.setFlag(Te, Zm, eh);
  const i = Jr(t, n);
  await t.setFlag(Te, nc, i);
}
c(Vo, "setSceneCriteria");
function Jr(t, e = null) {
  var r;
  const n = Array.isArray(e) ? e : pt(t), i = Yt(((r = t == null ? void 0 : t.getFlag) == null ? void 0 : r.call(t, Te, nc)) ?? {});
  return rc(i, n);
}
c(Jr, "getSceneCriteriaState");
async function ih(t, e, n = null) {
  if (!(t != null && t.setFlag)) return;
  const i = Array.isArray(n) ? n : pt(t), r = rc(e, i);
  await t.setFlag(Te, nc, r);
}
c(ih, "setSceneCriteriaState");
function ic(t = "") {
  const e = typeof t == "string" ? t.trim() : "", n = pd(ol(e || "criterion"), /* @__PURE__ */ new Set());
  return {
    id: yd(),
    key: n,
    label: e,
    values: [ja],
    default: ja,
    order: 0
  };
}
c(ic, "createSceneCriterion");
function gd(t) {
  const e = Array.isArray(t) ? Yt(t) : [], n = [], i = /* @__PURE__ */ new Set();
  return e.forEach((r, a) => {
    const o = al(r, a, i);
    o && (n.push(o), i.add(o.key));
  }), n;
}
c(gd, "sanitizeCriteria$1");
function al(t, e = 0, n = /* @__PURE__ */ new Set()) {
  if (!t || typeof t != "object") return null;
  const i = typeof t.id == "string" && t.id.trim() ? t.id.trim() : yd(), a = (typeof t.label == "string" ? t.label : typeof t.name == "string" ? t.name : "").trim(), o = typeof t.key == "string" && t.key.trim() ? ol(t.key) : ol(a || `criterion-${Number(e) + 1}`), s = pd(o, n), l = ah(t.values);
  let u = typeof t.default == "string" ? t.default.trim() : "";
  u || (u = l[0] ?? ja), l.includes(u) || l.unshift(u);
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
c(al, "sanitizeCriterion");
function rc(t, e = []) {
  const n = t && typeof t == "object" ? Yt(t) : {}, i = {};
  for (const r of e) {
    const a = n == null ? void 0 : n[r.key], o = typeof a == "string" ? a.trim() : "";
    o && r.values.includes(o) ? i[r.key] = o : i[r.key] = r.default;
  }
  return i;
}
c(rc, "sanitizeSceneCriteriaState");
function rh(t) {
  return pt(t).map((n) => ({
    id: n.key,
    key: n.key,
    name: n.label,
    values: [...n.values]
  }));
}
c(rh, "getSceneCriteriaCategories");
function ah(t) {
  const e = Array.isArray(t) ? t : [], n = [];
  for (const i of e) {
    if (typeof i != "string") continue;
    const r = i.trim();
    !r || n.includes(r) || n.push(r);
  }
  return n.length || n.push(ja), n;
}
c(ah, "sanitizeCriterionValues");
function ol(t) {
  return String(t ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
c(ol, "slugifyCriterionKey");
function pd(t, e) {
  if (!e.has(t)) return t;
  let n = 2;
  for (; e.has(`${t}-${n}`); )
    n += 1;
  return `${t}-${n}`;
}
c(pd, "ensureUniqueCriterionKey");
function yd() {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 11);
}
c(yd, "generateCriterionId");
function bd(t) {
  var e, n;
  console.error(`${Te} | Failed to persist scene criteria`, t), (n = (e = ui.notifications) == null ? void 0 : e.error) == null || n.call(
    e,
    E(
      "EIDOLON.SceneCriteria.PersistError",
      "Failed to persist the scene criteria."
    )
  );
}
c(bd, "notifyPersistError");
var Mu, ge, cn, De, vd, $o, xo, _o, Fo, wa, Do, $r, xr, ur, wd;
const an = class an extends zn(Gn) {
  constructor(n = {}) {
    const { scene: i, criterion: r, isNew: a, onSave: o, ...s } = n ?? {};
    super(s);
    k(this, De);
    k(this, ge, null);
    k(this, cn, !1);
    k(this, $o, /* @__PURE__ */ c(async (n) => {
      n.preventDefault();
      const i = n.currentTarget;
      if (!(i instanceof HTMLFormElement)) return;
      const r = new FormData(i), a = String(r.get("criterionLabel") ?? "").trim(), o = String(r.get("criterionKey") ?? "").trim(), s = Array.from(i.querySelectorAll('[name="criterionValues"]')).map((h) => h instanceof HTMLInputElement ? h.value.trim() : "").filter((h, f, g) => h && g.indexOf(h) === f), u = String(r.get("criterionDefault") ?? "").trim() || s[0] || "Standard", d = al(
        {
          id: m(this, ge).id,
          key: o,
          label: a,
          values: s,
          default: u,
          order: Number(m(this, ge).order ?? 0)
        },
        0,
        /* @__PURE__ */ new Set()
      );
      d && (L(this, ge, d), await S(this, De, wd).call(this), this.close());
    }, "#onSubmit"));
    k(this, xo, /* @__PURE__ */ c((n) => {
      var o;
      if (m(this, cn)) return;
      const i = n.currentTarget, r = (i == null ? void 0 : i.form) ?? ((o = this.element) == null ? void 0 : o.querySelector("form"));
      if (!(r instanceof HTMLFormElement)) return;
      const a = r.querySelector('input[name="criterionKey"]');
      a instanceof HTMLInputElement && (a.value = or(i.value));
    }, "#onLabelInput"));
    k(this, _o, /* @__PURE__ */ c((n) => {
      var l;
      const i = n.currentTarget, r = (i == null ? void 0 : i.form) ?? ((l = this.element) == null ? void 0 : l.querySelector("form"));
      if (!(r instanceof HTMLFormElement) || !(i instanceof HTMLInputElement)) return;
      const a = r.querySelector('input[name="criterionLabel"]'), o = or(a instanceof HTMLInputElement ? a.value : ""), s = or(i.value);
      L(this, cn, s !== o), i.value = s, S(this, De, wa).call(this, r);
    }, "#onKeyInput"));
    k(this, Fo, /* @__PURE__ */ c((n) => {
      var o, s;
      n.preventDefault();
      const i = ((o = n.currentTarget) == null ? void 0 : o.form) ?? ((s = this.element) == null ? void 0 : s.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector('input[name="criterionLabel"]'), a = i.querySelector('input[name="criterionKey"]');
      a instanceof HTMLInputElement && (a.value = or(r instanceof HTMLInputElement ? r.value : ""), L(this, cn, !1), S(this, De, wa).call(this, i));
    }, "#onResetAutoKey"));
    k(this, Do, /* @__PURE__ */ c((n) => {
      var l, u, d, h, f, g;
      n.preventDefault();
      const i = ((l = n.currentTarget) == null ? void 0 : l.form) ?? ((u = this.element) == null ? void 0 : u.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector(".scene-criterion-editor__values");
      if (!(r instanceof HTMLElement)) return;
      (d = r.querySelector(".scene-criterion-editor__empty")) == null || d.remove();
      const a = document.createElement("div");
      a.classList.add("scene-criterion-editor__value");
      const o = xt(E("EIDOLON.SceneCriteria.ValuePlaceholder", "Allowed value")), s = xt(E("EIDOLON.SceneCriteria.RemoveValue", "Remove Value"));
      a.innerHTML = `
      <input type="text" name="criterionValues" value="" placeholder="${o}" class="form-control">
      <button type="button" class="icon" data-action="remove-value" aria-label="${s}" title="${s}">
        <i class="fa-solid fa-trash"></i>
      </button>
    `, r.appendChild(a), (h = a.querySelector('[data-action="remove-value"]')) == null || h.addEventListener("click", m(this, $r)), (f = a.querySelector('input[name="criterionValues"]')) == null || f.addEventListener("input", m(this, xr)), S(this, De, ur).call(this, i), (g = a.querySelector('input[name="criterionValues"]')) == null || g.focus();
    }, "#onAddValue"));
    k(this, $r, /* @__PURE__ */ c((n) => {
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
        S(this, De, ur).call(this, i);
      }
    }, "#onRemoveValue"));
    k(this, xr, /* @__PURE__ */ c((n) => {
      var r, a;
      const i = ((r = n.currentTarget) == null ? void 0 : r.form) ?? ((a = this.element) == null ? void 0 : a.querySelector("form"));
      i instanceof HTMLFormElement && S(this, De, ur).call(this, i);
    }, "#onValuesChanged"));
    this.scene = i ?? null, this.criterion = r ?? null, this.onSave = typeof o == "function" ? o : null, this.isNew = !!a, L(this, ge, S(this, De, vd).call(this)), L(this, cn, m(this, ge).key !== or(m(this, ge).label));
  }
  async _prepareContext() {
    var i, r, a, o;
    const n = Array.isArray((i = m(this, ge)) == null ? void 0 : i.values) ? m(this, ge).values : [];
    return {
      isNew: this.isNew,
      key: ((r = m(this, ge)) == null ? void 0 : r.key) ?? "",
      label: ((a = m(this, ge)) == null ? void 0 : a.label) ?? "",
      defaultValue: ((o = m(this, ge)) == null ? void 0 : o.default) ?? "",
      values: n.map((s, l) => {
        var u;
        return {
          index: l,
          value: s,
          selected: s === ((u = m(this, ge)) == null ? void 0 : u.default)
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
      keyIsCustom: m(this, cn)
    };
  }
  _onRender(n, i) {
    var a, o, s, l, u, d;
    super._onRender(n, i);
    const r = (a = this.element) == null ? void 0 : a.querySelector("form");
    r && (r.addEventListener("submit", m(this, $o)), (o = r.querySelector('[data-action="add-value"]')) == null || o.addEventListener("click", m(this, Do)), (s = r.querySelector('input[name="criterionLabel"]')) == null || s.addEventListener("input", m(this, xo)), (l = r.querySelector('input[name="criterionKey"]')) == null || l.addEventListener("input", m(this, _o)), (u = r.querySelector('[data-action="reset-auto-key"]')) == null || u.addEventListener("click", m(this, Fo)), r.querySelectorAll('[data-action="remove-value"]').forEach((h) => {
      h.addEventListener("click", m(this, $r));
    }), r.querySelectorAll('input[name="criterionValues"]').forEach((h) => {
      h.addEventListener("input", m(this, xr));
    }), (d = r.querySelector('[data-action="cancel"]')) == null || d.addEventListener("click", (h) => {
      h.preventDefault(), this.close();
    }), S(this, De, wa).call(this, r), S(this, De, ur).call(this, r));
  }
};
ge = new WeakMap(), cn = new WeakMap(), De = new WeakSet(), vd = /* @__PURE__ */ c(function() {
  const n = al(this.criterion, 0, /* @__PURE__ */ new Set()) ?? ic(E("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion"));
  return {
    id: n.id,
    key: n.key,
    label: n.label ?? "",
    values: Array.isArray(n.values) ? [...n.values] : [],
    default: n.default
  };
}, "#initializeState"), $o = new WeakMap(), xo = new WeakMap(), _o = new WeakMap(), Fo = new WeakMap(), wa = /* @__PURE__ */ c(function(n) {
  const i = n.querySelector('[data-action="reset-auto-key"]');
  i instanceof HTMLButtonElement && (i.disabled = !m(this, cn));
}, "#syncAutoKeyButton"), Do = new WeakMap(), $r = new WeakMap(), xr = new WeakMap(), ur = /* @__PURE__ */ c(function(n) {
  var l, u;
  const i = n.querySelector('select[name="criterionDefault"]');
  if (!(i instanceof HTMLSelectElement)) return;
  const r = ((u = (l = i.value) == null ? void 0 : l.trim) == null ? void 0 : u.call(l)) ?? "", a = Array.from(n.querySelectorAll('input[name="criterionValues"]')).map((d) => d instanceof HTMLInputElement ? d.value.trim() : "").filter((d, h, f) => d && f.indexOf(d) === h), o = i.dataset.emptyLabel || E("EIDOLON.SceneCriteria.ValueListEmpty", "No values have been added to this criterion.");
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
}, "#syncDefaultOptions"), wd = /* @__PURE__ */ c(async function() {
  if (!this.scene) return;
  const n = pt(this.scene).sort((r, a) => r.order - a.order), i = n.findIndex((r) => r.id === m(this, ge).id);
  i < 0 ? (m(this, ge).order = n.length, n.push(m(this, ge))) : (m(this, ge).order = n[i].order, n.splice(i, 1, m(this, ge)));
  try {
    await Vo(this.scene, n), this.onSave && await this.onSave(m(this, ge));
  } catch (r) {
    bd(r);
  }
}, "#persist"), c(an, "CategoryEditorApplication"), ye(an, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Re(an, an, "DEFAULT_OPTIONS"),
  {
    id: `${Te}-criterion-editor`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Mu = Re(an, an, "DEFAULT_OPTIONS")) == null ? void 0 : Mu.classes) ?? [], "standard-form", "themed"])
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
)), ye(an, "PARTS", {
  content: {
    template: `modules/${Te}/templates/scene-criteria-editor.html`
  }
});
let sl = an;
function or(t) {
  return String(t ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
c(or, "slugifyKey");
const oh = `modules/${Te}/templates/scene-criteria-tab.html`, ll = {
  log: /* @__PURE__ */ c((...t) => {
    var e;
    return (e = console.debug) == null ? void 0 : e.call(console, `${Te} | Criteria`, ...t);
  }, "log"),
  group: /* @__PURE__ */ c((...t) => {
    var e;
    return (e = console.groupCollapsed) == null ? void 0 : e.call(console, `${Te} | Criteria`, ...t);
  }, "group"),
  groupEnd: /* @__PURE__ */ c(() => {
    var t;
    return (t = console.groupEnd) == null ? void 0 : t.call(console);
  }, "groupEnd")
}, sh = Bo(sl), lh = dd({
  tabId: "criteria",
  tabLabel: /* @__PURE__ */ c(() => E("EIDOLON.SceneCriteria.TabLabel", "Criteria"), "tabLabel"),
  getScene: Jt,
  isApplicable: /* @__PURE__ */ c(() => Uo(), "isApplicable"),
  renderContent: /* @__PURE__ */ c(({ app: t, tab: e, scene: n }) => uh(t, e, n), "renderContent"),
  logger: ll
});
function ch() {
  return lh.register();
}
c(ch, "registerSceneCriteriaConfigHook");
function uh(t, e, n) {
  if (!(e instanceof HTMLElement)) return;
  const i = Ke(n) ? n : Jt(t);
  Mi(t, e, i);
}
c(uh, "renderCriteriaTab");
async function Mi(t, e, n) {
  var r, a;
  const i = n ?? Jt(t);
  ll.group("renderCriteriaTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!Ke(i)) {
      const d = E(
        "EIDOLON.SceneCriteria.Unavailable",
        "Scene criteria are unavailable for this configuration sheet."
      );
      e.innerHTML = `<p class="notes">${d}</p>`;
      return;
    }
    const o = pt(i).sort((d, h) => d.order - h.order), s = Jr(i, o), l = ((a = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : a.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof l != "function") {
      e.innerHTML = `<p class="notes">${E("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
      return;
    }
    const u = await l(oh, {
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
        valueCount: o.reduce((d, h) => d + h.values.length, 0)
      },
      criteria: o.map((d, h) => {
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
          valueCountLabel: fh(d.values.length),
          canMoveUp: h > 0,
          canMoveDown: h < o.length - 1
        };
      }),
      hasCriteria: o.length > 0
    });
    e.innerHTML = u, dh(t, e, i);
  } catch (o) {
    console.error(`${Te} | Failed to render criteria tab`, o), e.innerHTML = `<p class="notes">${E("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
  } finally {
    ll.groupEnd();
  }
}
c(Mi, "renderCriteriaTabContent");
function dh(t, e, n) {
  const i = n ?? Jt(t);
  if (!Ke(i)) return;
  const r = e.querySelector('[data-criteria-action="add"]');
  r && r.addEventListener("click", () => {
    jc(t, {
      scene: i,
      criterion: ic(
        E("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion")
      ),
      isNew: !0,
      onSave: /* @__PURE__ */ c(() => Mi(t, e, i), "onSave")
    });
  }), e.querySelectorAll('[data-criteria-action="edit"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", () => {
      const s = pt(i).find((l) => l.id === o);
      s && jc(t, {
        scene: i,
        criterion: s,
        onSave: /* @__PURE__ */ c(() => Mi(t, e, i), "onSave")
      });
    });
  }), e.querySelectorAll('[data-criteria-action="remove"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await ms(i, (l) => {
        const u = l.findIndex((d) => d.id === o);
        return u < 0 ? !1 : (l.splice(u, 1), hs(l), !0);
      }) && await Mi(t, e, i);
    });
  }), e.querySelectorAll('[data-criteria-action="move-up"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await ms(i, (l) => {
        const u = l.findIndex((h) => h.id === o);
        if (u <= 0) return !1;
        const [d] = l.splice(u, 1);
        return l.splice(u - 1, 0, d), hs(l), !0;
      }) && await Mi(t, e, i);
    });
  }), e.querySelectorAll('[data-criteria-action="move-down"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await ms(i, (l) => {
        const u = l.findIndex((h) => h.id === o);
        if (u < 0 || u >= l.length - 1) return !1;
        const [d] = l.splice(u, 1);
        return l.splice(u + 1, 0, d), hs(l), !0;
      }) && await Mi(t, e, i);
    });
  });
}
c(dh, "bindCriteriaTabEvents");
async function ms(t, e) {
  const n = pt(t).sort((r, a) => r.order - a.order);
  if (e(n) === !1) return !1;
  try {
    return await Vo(t, n), !0;
  } catch (r) {
    return bd(r), !1;
  }
}
c(ms, "mutateCriteria");
function jc(t, e = {}) {
  const n = e.scene ?? null, i = n && Ke(n) ? n : Jt(t);
  if (!Ke(i))
    return;
  sh({
    scene: i,
    criterion: e.criterion ?? null,
    isNew: !!e.isNew,
    onSave: typeof e.onSave == "function" ? e.onSave : null
  }).render({ force: !0 });
}
c(jc, "openCriterionEditor");
function hs(t) {
  t.forEach((e, n) => {
    e.order = n;
  });
}
c(hs, "reindexCriteriaOrder");
function fh(t) {
  var e, n;
  if ((n = (e = game.i18n) == null ? void 0 : e.has) != null && n.call(e, "EIDOLON.SceneCriteria.ValueCountLabel"))
    try {
      return game.i18n.format("EIDOLON.SceneCriteria.ValueCountLabel", { count: t });
    } catch (i) {
      console.error(`${Te} | Failed to format value count label`, i);
    }
  return t === 0 ? "No values configured" : t === 1 ? "1 value" : `${t} values`;
}
c(fh, "formatValueCount");
let Bc = !1;
function mh() {
  Hooks.once("init", () => {
    th();
  }), Hooks.once("ready", () => {
    Uo() && (Bc || (ch(), Bc = !0));
  });
}
c(mh, "registerSceneCriteriaHooks");
mh();
const ie = T, Ed = "criteriaEngineVersion", gi = "fileIndex", pi = "tileCriteria", ac = {
  LEGACY: 1,
  CRITERIA: 2
}, Sd = ac.CRITERIA;
function Cd(t) {
  var e;
  return ((e = t == null ? void 0 : t.getFlag) == null ? void 0 : e.call(t, ie, Ed)) ?? ac.LEGACY;
}
c(Cd, "getSceneEngineVersion");
function hh(t, e, n, i, r) {
  if (!(t != null && t.length) || !(n != null && n.length)) return -1;
  const a = {};
  for (const s of n)
    a[s] = e[s];
  const o = Uc(t, a, n);
  if (o >= 0) return o;
  if (i != null && i.length && r) {
    const s = { ...a };
    for (const l of i) {
      if (!(l in s)) continue;
      s[l] = r[l] ?? "Standard";
      const u = Uc(t, s, n);
      if (u >= 0) return u;
    }
  }
  return -1;
}
c(hh, "findBestMatch");
function Uc(t, e, n) {
  return t.findIndex((i) => {
    for (const r of n)
      if (i[r] !== e[r]) return !1;
    return !0;
  });
}
c(Uc, "findExactMatch");
function gh(t, e) {
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
c(gh, "findFileIndex");
function Ea(t) {
  return t && typeof t == "object" && !Array.isArray(t);
}
c(Ea, "isPlainObject$2");
function Vc(t) {
  return t == null ? t : typeof structuredClone == "function" ? structuredClone(t) : JSON.parse(JSON.stringify(t));
}
c(Vc, "deepClone");
function ph(t, e) {
  if (!e) return;
  const n = e.split(".").filter(Boolean);
  if (!n.length) return;
  let i = t;
  for (let r = 0; r < n.length - 1; r += 1) {
    if (!Ea(i == null ? void 0 : i[n[r]])) return;
    i = i[n[r]];
  }
  delete i[n.at(-1)];
}
c(ph, "deletePath");
function Td(t, e) {
  const n = Vc(t ?? {});
  if (!Ea(e)) return n;
  for (const [i, r] of Object.entries(e)) {
    if (i.startsWith("-=") && r === !0) {
      ph(n, i.slice(2));
      continue;
    }
    Ea(r) && Ea(n[i]) ? n[i] = Td(n[i], r) : n[i] = Vc(r);
  }
  return n;
}
c(Td, "fallbackMerge");
function yh(t, e) {
  var n, i;
  return (n = foundry == null ? void 0 : foundry.utils) != null && n.mergeObject && ((i = foundry == null ? void 0 : foundry.utils) != null && i.deepClone) ? foundry.utils.mergeObject(t, foundry.utils.deepClone(e), {
    inplace: !1
  }) : Td(t, e);
}
c(yh, "defaultMerge");
function bh(t, e) {
  if (!t) return !0;
  for (const n of Object.keys(t))
    if (t[n] !== e[n]) return !1;
  return !0;
}
c(bh, "criteriaMatch");
function Ld(t, e, n, i) {
  const r = i ?? yh;
  let a = r({}, t ?? {});
  if (!(e != null && e.length)) return a;
  const o = [];
  for (let s = 0; s < e.length; s += 1) {
    const l = e[s];
    if (bh(l == null ? void 0 : l.criteria, n)) {
      const u = l != null && l.criteria ? Object.keys(l.criteria).length : 0;
      o.push({ specificity: u, index: s, delta: l == null ? void 0 : l.delta });
    }
  }
  o.sort((s, l) => s.specificity - l.specificity || s.index - l.index);
  for (const s of o)
    s.delta && (a = r(a, s.delta));
  return a;
}
c(Ld, "resolveRules");
function Go(t = null) {
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
c(Go, "canManageCriteria");
function vh(t = null) {
  if (!Go(t))
    throw new Error(`${ie} | You do not have permission to manage scene criteria.`);
}
c(vh, "requireCriteriaAccess");
const wh = /* @__PURE__ */ c((...t) => console.log(`${ie} | criteria tiles:`, ...t), "log$1");
let Ba = /* @__PURE__ */ new WeakMap(), Ua = /* @__PURE__ */ new WeakMap();
const Gc = 200;
function Eh(t) {
  return t ? Number.isInteger(t.size) ? t.size : Array.isArray(t) || typeof t.length == "number" ? t.length : Array.from(t).length : 0;
}
c(Eh, "getCollectionSize$1");
function oa() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
c(oa, "nowMs$2");
function Sh(t) {
  if (!Array.isArray(t)) return [];
  const e = /* @__PURE__ */ new Set();
  for (const n of t) {
    if (typeof n != "string") continue;
    const i = n.trim();
    i && e.add(i);
  }
  return Array.from(e);
}
c(Sh, "uniqueStringKeys$1");
function Ch(t, e = Gc) {
  if (!Array.isArray(t) || t.length === 0) return [];
  const n = Number.isInteger(e) && e > 0 ? e : Gc, i = [];
  for (let r = 0; r < t.length; r += n)
    i.push(t.slice(r, r + n));
  return i;
}
c(Ch, "chunkArray$1");
async function Th(t, e, n) {
  const i = Ch(e, n);
  for (const r of i)
    await t.updateEmbeddedDocuments("Tile", r), i.length > 1 && await Promise.resolve();
  return i.length;
}
c(Th, "updateTilesInChunks");
function Lh(t) {
  var i;
  const e = Ei(t, { files: null });
  if (!((i = e == null ? void 0 : e.variants) != null && i.length)) return [];
  const n = /* @__PURE__ */ new Set();
  for (const r of e.variants)
    for (const a of Object.keys(r.criteria ?? {}))
      a && n.add(a);
  return Array.from(n);
}
c(Lh, "getTileCriteriaDependencyKeys");
function Ih(t, e) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
  for (const r of e) {
    const a = r.getFlag(ie, pi) ?? r.getFlag(ie, gi);
    if (a) {
      i.add(r.id);
      for (const o of Lh(a))
        n.has(o) || n.set(o, /* @__PURE__ */ new Set()), n.get(o).add(r.id);
    }
  }
  return {
    collection: e,
    keyToTileIds: n,
    allTileIds: i
  };
}
c(Ih, "buildTileDependencyIndex");
function Oh(t, e) {
  const n = Ua.get(t);
  if ((n == null ? void 0 : n.collection) === e) return n;
  const i = Ih(t, e);
  return Ua.set(t, i), i;
}
c(Oh, "getTileDependencyIndex");
function Ah(t, e, n) {
  const i = Sh(n);
  if (!i.length)
    return Array.from(e ?? []);
  const r = Oh(t, e), a = /* @__PURE__ */ new Set();
  for (const o of i) {
    const s = r.keyToTileIds.get(o);
    if (s)
      for (const l of s)
        a.add(l);
  }
  return a.size ? typeof (e == null ? void 0 : e.get) == "function" ? Array.from(a).map((o) => e.get(o)).filter(Boolean) : Array.from(e ?? []).filter((o) => a.has(o.id)) : [];
}
c(Ah, "getTilesForChangedKeys");
function Id(t) {
  return typeof (t == null ? void 0 : t.name) == "string" ? t.name : typeof (t == null ? void 0 : t.src) == "string" ? t.src : "";
}
c(Id, "getFilePath");
function Va(t) {
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
c(Va, "normalizeFilePath");
function oc(t) {
  if (!Array.isArray(t)) return [];
  const e = /* @__PURE__ */ new Map();
  return t.map((n, i) => {
    const r = Va(Id(n)), a = r || `__index:${i}`, o = e.get(a) ?? 0;
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
function qn(t, e) {
  if (!Number.isInteger(e) || e < 0) return null;
  const i = oc(t).find((r) => r.index === e);
  return i ? { ...i.target } : { indexHint: e };
}
c(qn, "createTileTargetFromIndex");
function zo(t) {
  if (!t || typeof t != "object") return null;
  const e = Va(t.path), n = Number(t.indexHint ?? t.fileIndex), i = Number(t.occurrence), r = {};
  return e && (r.path = e, r.occurrence = Number.isInteger(i) && i >= 0 ? i : 0), Number.isInteger(n) && n >= 0 && (r.indexHint = n), !r.path && !Number.isInteger(r.indexHint) ? null : r;
}
c(zo, "normalizeTileTarget");
function Lr(t, e) {
  const n = zo(t);
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
c(Lr, "resolveTileTargetIndex");
function jn(t) {
  if (!t || typeof t != "object" || Array.isArray(t)) return {};
  const e = {};
  for (const [n, i] of Object.entries(t))
    typeof n != "string" || !n || typeof i != "string" || !i.trim() || (e[n] = i.trim());
  return e;
}
c(jn, "sanitizeCriteria");
function kh(t) {
  return Object.entries(jn(t)).sort(([n], [i]) => n.localeCompare(i)).map(([n, i]) => `${n}=${i}`).join("");
}
c(kh, "serializeCriteria");
function Mh(t) {
  return Object.keys(jn(t)).length;
}
c(Mh, "getCriteriaSpecificity");
function Nh(t, e) {
  const n = jn(t), i = jn(e);
  for (const [r, a] of Object.entries(n))
    if (r in i && i[r] !== a)
      return !1;
  return !0;
}
c(Nh, "areCriteriaCompatible");
function $h(t, e) {
  const n = Lr(t, e);
  if (Number.isInteger(n) && n >= 0)
    return `index:${n}`;
  const i = zo(t);
  if (!i) return "";
  if (i.path) {
    const r = Number.isInteger(i.occurrence) ? i.occurrence : 0;
    return `path:${i.path}#${r}`;
  }
  return Number.isInteger(i.indexHint) ? `hint:${i.indexHint}` : "";
}
c($h, "getTargetIdentity");
function Od(t, e = {}) {
  var s;
  const n = Array.isArray(e.files) ? e.files : [], i = Ei(t, { files: n });
  if (!((s = i == null ? void 0 : i.variants) != null && s.length))
    return {
      errors: [],
      warnings: []
    };
  const r = i.variants.map((l, u) => ({
    index: u,
    criteria: jn(l.criteria),
    specificity: Mh(l.criteria),
    criteriaSignature: kh(l.criteria),
    targetIdentity: $h(l.target, n)
  })), a = [], o = [];
  for (let l = 0; l < r.length; l += 1) {
    const u = r[l];
    for (let d = l + 1; d < r.length; d += 1) {
      const h = r[d];
      if (u.specificity !== h.specificity || !Nh(u.criteria, h.criteria)) continue;
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
c(Od, "detectTileCriteriaConflicts");
function xh(t, e) {
  if (!t || typeof t != "object") return null;
  let n = zo(t.target);
  if (!n) {
    const i = Number(t.fileIndex);
    Number.isInteger(i) && i >= 0 && (n = qn(e, i));
  }
  return n ? {
    criteria: jn(t.criteria),
    target: n
  } : null;
}
c(xh, "normalizeTileVariant");
function Ad(t, e = {}) {
  if (!Array.isArray(t) || t.length === 0) return null;
  const n = Array.isArray(e.files) ? e.files : null, i = t.map((l, u) => ({
    criteria: jn(l),
    target: qn(n, u)
  })).filter((l) => l.target);
  if (!i.length) return null;
  const r = i.find((l) => Object.keys(l.criteria).length === 0), a = (r == null ? void 0 : r.target) ?? i[0].target;
  let o = null;
  const s = Number(e.defaultFileIndex);
  return Number.isInteger(s) && s >= 0 && (o = qn(n, s)), o || (o = a), {
    strategy: "select-one",
    variants: i,
    defaultTarget: o
  };
}
c(Ad, "buildTileCriteriaFromFileIndex");
function Ei(t, e = {}) {
  const n = Array.isArray(e.files) ? e.files : null;
  if (Array.isArray(t))
    return Ad(t, { files: n });
  if (!t || typeof t != "object") return null;
  const i = Array.isArray(t.variants) ? t.variants.map((a) => xh(a, n)).filter(Boolean) : [];
  if (!i.length) return null;
  let r = zo(t.defaultTarget);
  if (!r) {
    const a = Number(t.defaultFileIndex);
    Number.isInteger(a) && a >= 0 && (r = qn(n, a));
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
c(Ei, "normalizeTileCriteria");
function _h(t, e) {
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
c(_h, "selectTileFileIndexFromCompiled");
function Fh(t, e) {
  const n = Ei(t, { files: e });
  if (!n) return null;
  const i = n.variants.map((a) => {
    const o = jn(a.criteria), s = Lr(a.target, e);
    return !Number.isInteger(s) || s < 0 ? null : {
      criteria: o,
      keys: Object.keys(o),
      targetIndex: s
    };
  }).filter(Boolean), r = Lr(n.defaultTarget, e);
  return !i.length && (!Number.isInteger(r) || r < 0) ? null : {
    variants: i,
    defaultIndex: r
  };
}
c(Fh, "compileTileMatcher");
function Dh(t, e, n) {
  const i = Ba.get(t);
  if (i && i.tileCriteria === e && i.files === n)
    return i.compiled;
  const r = Fh(e, n);
  return Ba.set(t, {
    tileCriteria: e,
    files: n,
    compiled: r
  }), r;
}
c(Dh, "getCompiledTileMatcher");
function Ph(t = null, e = null) {
  t ? Ua.delete(t) : Ua = /* @__PURE__ */ new WeakMap(), e ? Ba.delete(e) : t || (Ba = /* @__PURE__ */ new WeakMap());
}
c(Ph, "invalidateTileCriteriaCaches");
async function kd(t, e, n = {}) {
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
  r.total = Eh(a);
  const o = Ah(e, a, n.changedKeys);
  if (r.scanned = o.length, !o.length)
    return r.skipped.unaffected = r.total, r.durationMs = oa() - i, r;
  const s = [];
  for (const f of o) {
    const g = f.getFlag(ie, pi) ?? f.getFlag(ie, gi);
    if (!g) {
      r.skipped.noCriteria += 1;
      continue;
    }
    const p = f.getFlag("monks-active-tiles", "files");
    if (!(p != null && p.length)) {
      r.skipped.noFiles += 1;
      continue;
    }
    const y = Dh(f, g, p), v = _h(y, t);
    if (!Number.isInteger(v) || v < 0 || v >= p.length) {
      console.warn(`${ie} | Tile ${f.id} has no valid file match for state`, t), r.skipped.noMatch += 1;
      continue;
    }
    const b = v + 1, C = Number(f.getFlag("monks-active-tiles", "fileindex")) !== b, I = p.some((D, P) => !!(D != null && D.selected) != (P === v)), A = Va(((u = f.texture) == null ? void 0 : u.src) ?? ((h = (d = f._source) == null ? void 0 : d.texture) == null ? void 0 : h.src) ?? ""), O = Id(p[v]), M = Va(O), _ = !!M && M !== A;
    if (!I && !C && !_) {
      r.skipped.unchanged += 1;
      continue;
    }
    const j = {
      _id: f._id
    };
    I && (j["flags.monks-active-tiles.files"] = p.map((D, P) => ({
      ...D,
      selected: P === v
    }))), C && (j["flags.monks-active-tiles.fileindex"] = b), _ && (j.texture = { src: O }), s.push(j), wh(`Tile ${f.id} -> ${O}`);
  }
  return s.length > 0 && (r.chunks = await Th(e, s, n.chunkSize), r.updated = s.length), r.durationMs = oa() - i, r;
}
c(kd, "updateTiles");
function Rh() {
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
c(Rh, "buildLightControlsMap");
const yi = T, ji = "lightCriteria", sc = Object.freeze({
  base: null,
  mappings: [],
  current: null
});
function gs(t) {
  return t && typeof t == "object" && !Array.isArray(t);
}
c(gs, "isPlainObject$1");
function Md(t, e) {
  if (!gs(e)) return {};
  const n = {};
  for (const [i, r] of Object.entries(e)) {
    const a = t == null ? void 0 : t[i];
    if (gs(r) && gs(a)) {
      const o = Md(a, r);
      Object.keys(o).length > 0 && (n[i] = o);
    } else r !== a && (n[i] = Yt(r));
  }
  return n;
}
c(Md, "computeDelta");
function Nd(t) {
  var n;
  const e = ((n = t == null ? void 0 : t.getFlag) == null ? void 0 : n.call(t, yi, ji)) ?? sc;
  return Ir(e);
}
c(Nd, "getLightCriteriaState");
async function $d(t, e) {
  const n = Ir(e);
  if (!(t != null && t.setFlag))
    return n;
  const i = n.base !== null, r = n.mappings.length > 0, a = n.current !== null;
  return !i && !r && !a ? (typeof t.unsetFlag == "function" ? await t.unsetFlag(yi, ji) : await t.setFlag(yi, ji, null), sc) : (await t.setFlag(yi, ji, n), n);
}
c($d, "setLightCriteriaState");
async function Xr(t, e) {
  if (typeof e != "function")
    throw new TypeError("updateLightCriteriaState requires an updater function.");
  const n = Yt(Nd(t)), i = await e(n);
  return $d(t, i);
}
c(Xr, "updateLightCriteriaState");
async function zc(t, e) {
  const n = Si(e);
  if (!n)
    throw new Error("Invalid light configuration payload.");
  return Xr(t, (i) => ({
    ...i,
    base: n
  }));
}
c(zc, "storeBaseLighting");
async function Wc(t, e, n, { label: i } = {}) {
  const r = Qr(e);
  if (!r)
    throw new Error("Cannot create a mapping without at least one category selection.");
  const a = Si(n);
  if (!a)
    throw new Error("Invalid light configuration payload.");
  return Xr(t, (o) => {
    const s = er(r), l = Array.isArray(o == null ? void 0 : o.mappings) ? [...o.mappings] : [], u = l.findIndex((g) => (g == null ? void 0 : g.key) === s), d = u >= 0 ? l[u] : null, h = typeof (d == null ? void 0 : d.id) == "string" && d.id.trim() ? d.id.trim() : _d(), f = Wo({
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
c(Wc, "upsertLightCriteriaMapping");
async function Hh(t, e, n, i, { replaceExisting: r = !1 } = {}) {
  const a = typeof e == "string" ? e.trim() : "";
  if (!a)
    throw new Error("A mapping id is required to retarget criteria.");
  const o = Qr(n);
  if (!o)
    throw new Error("Cannot retarget mapping without at least one category selection.");
  const s = Si(i);
  if (!s)
    throw new Error("Invalid light configuration payload.");
  return Xr(t, (l) => {
    const u = Array.isArray(l == null ? void 0 : l.mappings) ? [...l.mappings] : [], d = u.findIndex((b) => (b == null ? void 0 : b.id) === a);
    if (d < 0)
      throw new Error("The selected mapping no longer exists.");
    const h = er(o), f = u.findIndex(
      (b, w) => w !== d && (b == null ? void 0 : b.key) === h
    );
    if (f >= 0 && !r)
      throw new Error("A mapping already exists for the selected criteria.");
    const g = u[d], p = Wo({
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
      const [b] = u.splice(f, 1);
      y = (b == null ? void 0 : b.id) ?? null;
    }
    let v = (l == null ? void 0 : l.current) ?? null;
    return v && typeof v == "object" && (v.mappingId === a ? v = {
      ...v,
      mappingId: a,
      categories: o,
      updatedAt: Date.now()
    } : y && v.mappingId === y && (v = {
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
c(Hh, "retargetLightCriteriaMapping");
async function qh(t, e) {
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
c(qh, "removeLightCriteriaMapping");
async function pr(t, e) {
  const n = xd(e);
  return Xr(t, (i) => ({
    ...i,
    current: n
  }));
}
c(pr, "storeCurrentCriteriaSelection");
function jh(t) {
  const e = Ir(t), n = e.base ?? {}, i = [];
  for (const r of e.mappings) {
    const a = Qr(r == null ? void 0 : r.categories);
    if (!a) continue;
    const o = Md(n, (r == null ? void 0 : r.config) ?? {});
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
c(jh, "convertLightCriteriaStateToPresets");
function Bh(t, e = []) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
  for (const l of e)
    typeof (l == null ? void 0 : l.key) == "string" && l.key.trim() && i.add(l.key.trim()), typeof (l == null ? void 0 : l.id) == "string" && l.id.trim() && typeof (l == null ? void 0 : l.key) == "string" && n.set(l.id.trim(), l.key.trim());
  const r = Ir(t), a = /* @__PURE__ */ c((l) => {
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
    return u ? Wo({
      ...l,
      categories: u,
      key: er(u)
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
  return Ir({
    ...r,
    mappings: o,
    current: s
  });
}
c(Bh, "migrateLightCriteriaCategoriesToKeys");
function Ir(t) {
  var l;
  const e = Yt(t);
  if (!e || typeof e != "object")
    return Yt(sc);
  const n = Si(e.base), i = Array.isArray(e.mappings) ? e.mappings : [], r = /* @__PURE__ */ new Map();
  for (const u of i) {
    const d = Wo(u);
    d && r.set(d.key, d);
  }
  const a = Array.from(r.values()), o = new Map(a.map((u) => [u.id, u]));
  let s = xd(e.current);
  if (s) {
    const u = s.categories && Object.keys(s.categories).length > 0;
    if (s.mappingId && !o.has(s.mappingId)) {
      const d = u ? ((l = a.find((h) => h.key === er(s.categories))) == null ? void 0 : l.id) ?? null : null;
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
c(Ir, "sanitizeLightCriteriaState");
function Si(t) {
  const e = Yt(t);
  if (!e || typeof e != "object") return null;
  "_id" in e && delete e._id, "id" in e && delete e.id;
  const n = e.flags;
  if (n && typeof n == "object") {
    const i = n[yi];
    i && typeof i == "object" && (delete i[ji], Object.keys(i).length === 0 && delete n[yi]), Object.keys(n).length === 0 && delete e.flags;
  }
  return e;
}
c(Si, "sanitizeLightConfigPayload");
function Wo(t) {
  if (!t || typeof t != "object") return null;
  const e = Qr(t.categories);
  if (!e) return null;
  const n = Si(t.config);
  if (!n) return null;
  const i = typeof t.id == "string" && t.id.trim() ? t.id.trim() : _d(), r = er(e), a = {
    id: i,
    key: r,
    categories: e,
    config: n,
    updatedAt: Number.isFinite(t.updatedAt) ? Number(t.updatedAt) : Date.now()
  };
  return typeof t.label == "string" && t.label.trim() && (a.label = t.label.trim()), a;
}
c(Wo, "sanitizeCriteriaMappingEntry");
function xd(t) {
  if (!t || typeof t != "object") return null;
  const e = typeof t.mappingId == "string" && t.mappingId.trim() ? t.mappingId.trim() : null, n = Qr(t.categories);
  return !e && !n ? null : {
    mappingId: e,
    categories: n,
    updatedAt: Number.isFinite(t.updatedAt) ? Number(t.updatedAt) : Date.now()
  };
}
c(xd, "sanitizeCurrentSelection");
function Qr(t) {
  const e = {};
  if (Array.isArray(t))
    for (const n of t) {
      const i = Yc((n == null ? void 0 : n.id) ?? (n == null ? void 0 : n.categoryId) ?? (n == null ? void 0 : n.category)), r = Kc((n == null ? void 0 : n.value) ?? (n == null ? void 0 : n.selection) ?? (n == null ? void 0 : n.label));
      !i || !r || (e[i] = r);
    }
  else if (t && typeof t == "object")
    for (const [n, i] of Object.entries(t)) {
      const r = Yc(n), a = Kc(i);
      !r || !a || (e[r] = a);
    }
  return Object.keys(e).length > 0 ? e : null;
}
c(Qr, "sanitizeCriteriaCategories");
function er(t) {
  if (!t || typeof t != "object") return "";
  const e = Object.entries(t).filter(([, n]) => typeof n == "string" && n).map(([n, i]) => `${n}:${i}`);
  return e.sort((n, i) => n < i ? -1 : n > i ? 1 : 0), e.join("|");
}
c(er, "computeCriteriaMappingKey");
function _d() {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
c(_d, "generateLightMappingId");
function Yc(t) {
  if (typeof t != "string") return null;
  const e = t.trim();
  return e || null;
}
c(Yc, "normalizeCategoryId");
function Kc(t) {
  if (typeof t != "string") return null;
  const e = t.trim();
  return e || null;
}
c(Kc, "normalizeCategoryValue");
const Ga = ["AmbientLight", "Wall", "AmbientSound"];
let za = /* @__PURE__ */ new WeakMap(), Wa = /* @__PURE__ */ new WeakMap();
const Jc = 200;
function Uh(t) {
  return t ? Number.isInteger(t.size) ? t.size : Array.isArray(t) || typeof t.length == "number" ? t.length : Array.from(t).length : 0;
}
c(Uh, "getCollectionSize");
function ps() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
c(ps, "nowMs$1");
function Vh(t) {
  if (!Array.isArray(t)) return [];
  const e = /* @__PURE__ */ new Set();
  for (const n of t) {
    if (typeof n != "string") continue;
    const i = n.trim();
    i && e.add(i);
  }
  return Array.from(e);
}
c(Vh, "uniqueStringKeys");
function Gh(t, e = Jc) {
  if (!Array.isArray(t) || t.length === 0) return [];
  const n = Number.isInteger(e) && e > 0 ? e : Jc, i = [];
  for (let r = 0; r < t.length; r += n)
    i.push(t.slice(r, r + n));
  return i;
}
c(Gh, "chunkArray");
async function zh(t, e, n, i) {
  const r = Gh(n, i);
  for (const a of r)
    await t.updateEmbeddedDocuments(e, a), r.length > 1 && await Promise.resolve();
  return r.length;
}
c(zh, "updatePlaceablesInChunks");
function Wh(t) {
  const e = /* @__PURE__ */ new Set();
  for (const n of (t == null ? void 0 : t.rules) ?? [])
    for (const i of Object.keys((n == null ? void 0 : n.criteria) ?? {}))
      i && e.add(i);
  return Array.from(e);
}
c(Wh, "getPresetDependencyKeys");
function Yh(t, e) {
  const n = /* @__PURE__ */ new Map();
  for (const i of Ga) {
    const r = e.get(i) ?? [], a = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Map();
    for (const s of r) {
      const l = Dd(s, i);
      if (l != null && l.base) {
        a.add(s.id);
        for (const u of Wh(l))
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
c(Yh, "buildPlaceableDependencyIndex");
function Kh(t, e) {
  const n = Wa.get(t);
  if (n && Ga.every((r) => n.collectionsByType.get(r) === e.get(r)))
    return n;
  const i = Yh(t, e);
  return Wa.set(t, i), i;
}
c(Kh, "getPlaceableDependencyIndex");
function Jh(t, e, n) {
  if (!e || !t) return [];
  const i = Vh(n);
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
c(Jh, "getDocsForChangedKeys");
function _i(t) {
  return !!t && typeof t == "object" && !Array.isArray(t);
}
c(_i, "isPlainObject");
function cl(t, e) {
  if (Object.is(t, e)) return !0;
  if (Array.isArray(t) || Array.isArray(e)) {
    if (!Array.isArray(t) || !Array.isArray(e) || t.length !== e.length) return !1;
    for (let n = 0; n < t.length; n += 1)
      if (!cl(t[n], e[n])) return !1;
    return !0;
  }
  if (_i(t) || _i(e)) {
    if (!_i(t) || !_i(e)) return !1;
    const n = Object.keys(e);
    for (const i of n)
      if (!cl(t[i], e[i])) return !1;
    return !0;
  }
  return !1;
}
c(cl, "areValuesEqual");
function Fd(t, e) {
  const n = { _id: e._id };
  for (const [r, a] of Object.entries(e)) {
    if (r === "_id") continue;
    const o = t == null ? void 0 : t[r];
    if (_i(a) && _i(o)) {
      const s = Fd(o, { _id: e._id, ...a });
      if (!s) continue;
      const l = Object.keys(s).filter((u) => u !== "_id");
      if (l.length > 0) {
        n[r] = {};
        for (const u of l)
          n[r][u] = s[u];
      }
      continue;
    }
    cl(o, a) || (n[r] = a);
  }
  return Object.keys(n).filter((r) => r !== "_id").length > 0 ? n : null;
}
c(Fd, "buildChangedPayload");
function Dd(t, e) {
  var s;
  const n = ((s = t == null ? void 0 : t.flags) == null ? void 0 : s[ie]) ?? {}, i = (n == null ? void 0 : n.presets) ?? null, r = e === "AmbientLight" ? (n == null ? void 0 : n.lightCriteria) ?? null : null, a = za.get(t);
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
    const l = jh(n.lightCriteria);
    (l.base && Object.keys(l.base).length > 0 || l.rules.length > 0) && (o = {
      base: l.base,
      rules: l.rules
    });
  }
  return za.set(t, {
    type: e,
    rawPresets: i,
    rawLightCriteria: r,
    presets: o
  }), o;
}
c(Dd, "getPresetsForDocument");
function Xh(t = null, e = null) {
  t ? Wa.delete(t) : Wa = /* @__PURE__ */ new WeakMap(), e ? za.delete(e) : t || (za = /* @__PURE__ */ new WeakMap());
}
c(Xh, "invalidatePlaceableCriteriaCaches");
async function Pd(t, e, n = {}) {
  var l, u;
  const i = ps(), r = {
    total: 0,
    scanned: 0,
    updated: 0,
    chunks: 0,
    byType: {},
    durationMs: 0
  };
  if (e = e ?? ((l = game.scenes) == null ? void 0 : l.viewed), !e)
    return r.durationMs = ps() - i, r;
  const a = new Set(Rh()), o = new Map(
    Ga.map((d) => [d, e.getEmbeddedCollection(d) ?? []])
  ), s = Kh(e, o);
  for (const d of Ga) {
    const h = o.get(d) ?? [], f = {
      total: Uh(h),
      scanned: 0,
      updated: 0,
      chunks: 0
    }, g = s.byType.get(d) ?? null, p = Jh(h, g, n.changedKeys);
    if (f.scanned = p.length, r.total += f.total, r.scanned += f.scanned, r.byType[d] = f, !p.length) continue;
    const y = [];
    for (const v of p) {
      const b = Dd(v, d);
      if (!(b != null && b.base)) continue;
      const w = Ld(b.base, b.rules ?? [], t);
      w._id = v._id, d === "AmbientLight" && a.has(v._id) && (w.hidden = !0);
      const C = (v == null ? void 0 : v._source) ?? ((u = v == null ? void 0 : v.toObject) == null ? void 0 : u.call(v)) ?? {}, I = Fd(C, w);
      I && y.push(I);
    }
    y.length > 0 && (f.chunks = await zh(e, d, y, n.chunkSize), f.updated = y.length, r.updated += y.length, r.chunks += f.chunks, console.log(`${ie} | Updated ${y.length} ${d}(s)`));
  }
  return r.durationMs = ps() - i, r;
}
c(Pd, "updatePlaceables");
function Ya() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
c(Ya, "nowMs");
const sa = /* @__PURE__ */ new Map();
function Qh(t) {
  var e;
  return t = t ?? ((e = game.scenes) == null ? void 0 : e.viewed), t ? Jr(t) : null;
}
c(Qh, "getState");
async function Zh(t, e, n = 0) {
  var g;
  const i = Ya();
  if (e = e ?? ((g = game.scenes) == null ? void 0 : g.viewed), !e) return null;
  vh(e);
  const r = pt(e);
  if (!r.length)
    return console.warn(`${ie} | applyState skipped: scene has no criteria.`), null;
  const a = Jr(e, r), o = rc({ ...a, ...t ?? {} }, r), s = r.filter((p) => (a == null ? void 0 : a[p.key]) !== (o == null ? void 0 : o[p.key])).map((p) => p.key), l = s.length > 0;
  l && await ih(e, o, r);
  const u = l ? o : a, [d, h] = await Promise.all([
    kd(u, e, { changedKeys: s }),
    Pd(u, e, { changedKeys: s })
  ]), f = Ya() - i;
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
c(Zh, "applyStateInternal");
async function Rd(t, e) {
  var l;
  if (e = e ?? ((l = game.scenes) == null ? void 0 : l.viewed), !e) return null;
  const n = e.id ?? "__viewed__", i = Ya(), r = sa.get(n) ?? Promise.resolve();
  let a = null;
  const o = r.catch(() => null).then(async () => {
    const u = Ya() - i;
    return Zh(t, e, u);
  });
  a = o;
  const s = o.finally(() => {
    sa.get(n) === s && sa.delete(n);
  });
  return sa.set(n, s), a;
}
c(Rd, "applyState$1");
function eg(t) {
  var e;
  return t = t ?? ((e = game.scenes) == null ? void 0 : e.viewed), t ? Cd(t) : null;
}
c(eg, "getVersion");
async function Hd(t, e) {
  var n;
  e = e ?? ((n = game.scenes) == null ? void 0 : n.viewed), e != null && e.setFlag && await e.setFlag(ie, Ed, Number(t));
}
c(Hd, "setVersion");
async function tg(t) {
  return Hd(Sd, t);
}
c(tg, "markCurrentVersion");
const dr = "Standard", ng = /* @__PURE__ */ c((...t) => console.log(`${ie} | criteria indexer:`, ...t), "log");
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
function ig(t, e, n = dr) {
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
c(ig, "buildFileIndex");
function rg(t, e) {
  return t.map((n, i) => {
    const r = [...e[n] ?? /* @__PURE__ */ new Set()].sort(), o = r.includes(dr) ? dr : r[0] ?? dr, s = ic(n);
    return s.key = n, s.label = n.charAt(0).toUpperCase() + n.slice(1), s.values = r.length ? r : [dr], s.default = s.values.includes(o) ? o : s.values[0], s.order = i, s;
  });
}
c(rg, "buildCriteriaDefinitions");
async function la(t, e, n, { dryRun: i = !1 } = {}) {
  const r = t.getFlag("monks-active-tiles", "files");
  if (!(r != null && r.length)) return null;
  const a = ig(r, e), o = Ad(a, { files: r });
  for (const s of r) {
    const l = lc(s == null ? void 0 : s.name);
    if (l)
      for (const [u, d] of Object.entries(e)) {
        const h = l[Number(u)];
        h != null && n[d] && n[d].add(h);
      }
  }
  return i || (await t.setFlag(ie, pi, o), typeof t.unsetFlag == "function" && await t.unsetFlag(ie, gi)), { files: r.length };
}
c(la, "indexTile");
async function ag(t, e = {}) {
  var w, C, I, A;
  const {
    dryRun: n = !1,
    force: i = !1
  } = e;
  if (t = t ?? ((w = game.scenes) == null ? void 0 : w.viewed), !t) throw new Error("No scene provided to indexScene.");
  if (!globalThis.Tagger) throw new Error("Tagger is required to index scene criteria.");
  if (!i && Cd(t) >= Sd)
    throw new Error(
      `Scene "${t.name}" is already criteria-indexed. Use force: true to re-index.`
    );
  const r = { sceneId: t.id }, a = Tagger.getByTag("Map", r) ?? [];
  if (!a.length) throw new Error("No Map tile found.");
  if (a.length > 1) throw new Error(`Expected 1 Map tile, found ${a.length}.`);
  const o = a[0], s = o.getFlag("monks-active-tiles", "files");
  if (!(s != null && s.length)) throw new Error("Map tile has no MATT files.");
  const l = lc((C = s[0]) == null ? void 0 : C.name);
  if (!(l != null && l.length))
    throw new Error(`Cannot parse bracket tags from: ${((I = s[0]) == null ? void 0 : I.name) ?? "<unknown>"}`);
  if (l.length < 3)
    throw new Error(`Expected 3+ bracket tags, found ${l.length}.`);
  const u = Tagger.getByTag("Floor", r) ?? [], d = Tagger.getByTag("Roof", r) ?? [], h = Tagger.getByTag("Weather", r) ?? [];
  let f;
  const g = [];
  l.length >= 4 ? (f = { 0: "mood", 1: "stage", 2: "variant", 3: "effect" }, g.push("mood", "stage", "variant", "effect")) : (f = { 0: "mood", 1: "variant", 2: "effect" }, g.push("mood", "variant", "effect"));
  const p = { 1: "effect" }, y = {};
  for (const O of g)
    y[O] = /* @__PURE__ */ new Set();
  const v = {
    map: null,
    floor: [],
    roof: [],
    weather: []
  };
  v.map = await la(o, f, y, { dryRun: n });
  for (const O of u) {
    const M = await la(O, f, y, { dryRun: n });
    M && v.floor.push(M);
  }
  for (const O of d) {
    const M = await la(O, f, y, { dryRun: n });
    M && v.roof.push(M);
  }
  for (const O of h) {
    const M = await la(O, p, y, { dryRun: n });
    M && v.weather.push(M);
  }
  const b = rg(g, y);
  return n || (await Vo(t, b), await tg(t)), ng(
    n ? "Dry run complete" : "Indexing complete",
    `- ${b.length} criteria,`,
    `${((A = v.map) == null ? void 0 : A.files) ?? 0} map files`
  ), {
    criteria: b,
    state: b.reduce((O, M) => (O[M.key] = M.default, O), {}),
    tiles: v,
    overlayMode: h.length > 0
  };
}
c(ag, "indexScene");
var Nu, qe, ft, mt, ci, Ze, jt, Tn, Po, ce, qd, jd, Bd, dl, Ud, fl, Vd, fr, ml;
const Et = class Et extends zn(Gn) {
  constructor(n = {}) {
    var i;
    super(n);
    k(this, ce);
    k(this, qe, null);
    k(this, ft, []);
    k(this, mt, {});
    k(this, ci, !1);
    k(this, Ze, null);
    k(this, jt, null);
    k(this, Tn, null);
    k(this, Po, 120);
    this.setScene(n.scene ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null);
  }
  setScene(n) {
    var i;
    L(this, qe, n ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null), S(this, ce, qd).call(this);
  }
  get scene() {
    return m(this, qe);
  }
  async _prepareContext() {
    var r;
    const n = !!m(this, qe), i = n && m(this, ft).length > 0;
    return {
      hasScene: n,
      hasCriteria: i,
      sceneName: ((r = m(this, qe)) == null ? void 0 : r.name) ?? E("EIDOLON.CriteriaSwitcher.NoScene", "No active scene"),
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
      criteria: m(this, ft).map((a) => ({
        key: a.key,
        label: a.label || a.key,
        values: a.values.map((o) => {
          var s;
          return {
            value: o,
            selected: ((s = m(this, mt)) == null ? void 0 : s[a.key]) === o
          };
        }),
        defaultValue: a.default
      })),
      stateSummary: S(this, ce, ml).call(this)
    };
  }
  _onRender(n, i) {
    super._onRender(n, i), S(this, ce, jd).call(this), S(this, ce, Bd).call(this);
  }
  async _onClose(n) {
    return m(this, Ze) !== null && (clearTimeout(m(this, Ze)), L(this, Ze, null)), m(this, Tn) !== null && (Hooks.off("eidolon-utilities.criteriaStateApplied", m(this, Tn)), L(this, Tn, null)), super._onClose(n);
  }
};
qe = new WeakMap(), ft = new WeakMap(), mt = new WeakMap(), ci = new WeakMap(), Ze = new WeakMap(), jt = new WeakMap(), Tn = new WeakMap(), Po = new WeakMap(), ce = new WeakSet(), qd = /* @__PURE__ */ c(function() {
  if (!m(this, qe)) {
    L(this, ft, []), L(this, mt, {});
    return;
  }
  L(this, ft, pt(m(this, qe)).sort((n, i) => n.order - i.order)), L(this, mt, Jr(m(this, qe), m(this, ft)));
}, "#hydrateFromScene"), jd = /* @__PURE__ */ c(function() {
  var i, r;
  const n = this.element;
  n instanceof HTMLElement && (n.querySelectorAll("[data-criteria-key]").forEach((a) => {
    a.addEventListener("change", (o) => {
      const s = o.currentTarget;
      if (!(s instanceof HTMLSelectElement)) return;
      const l = s.dataset.criteriaKey;
      l && (L(this, mt, {
        ...m(this, mt),
        [l]: s.value
      }), S(this, ce, Ud).call(this, { [l]: s.value }));
    });
  }), (i = n.querySelector("[data-action='reset-defaults']")) == null || i.addEventListener("click", () => {
    S(this, ce, Vd).call(this);
  }), (r = n.querySelector("[data-action='close-switcher']")) == null || r.addEventListener("click", () => {
    this.close();
  }));
}, "#bindEvents"), Bd = /* @__PURE__ */ c(function() {
  m(this, Tn) === null && L(this, Tn, Hooks.on("eidolon-utilities.criteriaStateApplied", (n, i) => {
    !m(this, qe) || (n == null ? void 0 : n.id) !== m(this, qe).id || m(this, ci) || (L(this, mt, { ...i ?? {} }), this.render({ force: !0 }));
  }));
}, "#ensureSyncHook"), dl = /* @__PURE__ */ c(async function(n) {
  var i, r;
  if (m(this, qe)) {
    S(this, ce, fr).call(this, "applying"), L(this, ci, !0);
    try {
      const a = await Rd(n, m(this, qe));
      a && L(this, mt, a), S(this, ce, fr).call(this, "ready"), this.render({ force: !0 });
    } catch (a) {
      console.error(`${ie} | Failed to apply criteria state`, a), (r = (i = ui.notifications) == null ? void 0 : i.error) == null || r.call(
        i,
        E(
          "EIDOLON.CriteriaSwitcher.ApplyError",
          "Failed to apply the selected criteria state."
        )
      ), S(this, ce, fr).call(this, "error", (a == null ? void 0 : a.message) ?? "Unknown error");
    } finally {
      L(this, ci, !1), m(this, jt) && S(this, ce, fl).call(this);
    }
  }
}, "#applyPartialState"), Ud = /* @__PURE__ */ c(function(n) {
  L(this, jt, {
    ...m(this, jt) ?? {},
    ...n ?? {}
  }), m(this, Ze) !== null && clearTimeout(m(this, Ze)), S(this, ce, fr).call(this, "applying"), L(this, Ze, setTimeout(() => {
    L(this, Ze, null), S(this, ce, fl).call(this);
  }, m(this, Po)));
}, "#queuePartialState"), fl = /* @__PURE__ */ c(async function() {
  if (m(this, ci) || !m(this, jt)) return;
  const n = m(this, jt);
  L(this, jt, null), await S(this, ce, dl).call(this, n);
}, "#flushPendingState"), Vd = /* @__PURE__ */ c(async function() {
  if (!m(this, ft).length) return;
  const n = m(this, ft).reduce((i, r) => (i[r.key] = r.default, i), {});
  L(this, mt, n), m(this, Ze) !== null && (clearTimeout(m(this, Ze)), L(this, Ze, null)), L(this, jt, null), await S(this, ce, dl).call(this, n);
}, "#resetToDefaults"), fr = /* @__PURE__ */ c(function(n, i = "") {
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
        a.textContent = `${E("EIDOLON.CriteriaSwitcher.Ready", "Ready")}: ${S(this, ce, ml).call(this)}`;
        break;
    }
}, "#setStatus"), ml = /* @__PURE__ */ c(function() {
  return m(this, ft).length ? `[${m(this, ft).map((n) => {
    var i;
    return ((i = m(this, mt)) == null ? void 0 : i[n.key]) ?? n.default;
  }).join(" | ")}]` : "-";
}, "#formatStateSummary"), c(Et, "CriteriaSwitcherApplication"), ye(Et, "APP_ID", `${ie}-criteria-switcher`), ye(Et, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Re(Et, Et, "DEFAULT_OPTIONS"),
  {
    id: Et.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Nu = Re(Et, Et, "DEFAULT_OPTIONS")) == null ? void 0 : Nu.classes) ?? [], "eidolon-criteria-switcher-window", "themed"])
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
)), ye(Et, "PARTS", {
  content: {
    template: `modules/${ie}/templates/criteria-switcher.html`
  }
});
let ul = Et;
const og = Bo(ul);
let bi = null;
function sg(t) {
  var e;
  return t ?? ((e = game.scenes) == null ? void 0 : e.viewed) ?? null;
}
c(sg, "resolveScene");
function lg(t) {
  var e;
  return !!(t != null && t.rendered && ((e = t == null ? void 0 : t.element) != null && e.isConnected));
}
c(lg, "isRendered");
function Yo() {
  return lg(bi) ? bi : (bi = null, null);
}
c(Yo, "getCriteriaSwitcher");
function Gd(t) {
  var i, r, a, o, s;
  const e = sg(t);
  if (!e)
    return (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "No active scene to open the criteria switcher."), null;
  if (!Go(e))
    return (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, "You do not have permission to manage scene criteria."), null;
  const n = Yo();
  return n ? (n.setScene(e), n.render({ force: !0 }), (s = n.bringToFront) == null || s.call(n), n) : (bi = og({ scene: e }), bi.render({ force: !0 }), bi);
}
c(Gd, "openCriteriaSwitcher");
function zd() {
  const t = Yo();
  t && (t.close(), bi = null);
}
c(zd, "closeCriteriaSwitcher");
function cc(t) {
  return Yo() ? (zd(), null) : Gd(t);
}
c(cc, "toggleCriteriaSwitcher");
const cg = {
  SCHEMA_VERSION: ac,
  applyState: Rd,
  getState: Qh,
  getVersion: eg,
  setVersion: Hd,
  getCriteria(t) {
    var e;
    return pt(t ?? ((e = game.scenes) == null ? void 0 : e.viewed));
  },
  setCriteria(t, e) {
    var n;
    return Vo(e ?? ((n = game.scenes) == null ? void 0 : n.viewed), t);
  },
  updateTiles: kd,
  updatePlaceables: Pd,
  indexScene: ag,
  openCriteriaSwitcher: Gd,
  closeCriteriaSwitcher: zd,
  toggleCriteriaSwitcher: cc,
  findBestMatch: hh,
  findFileIndex: gh,
  resolveRules: Ld
};
function ug(t) {
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
c(ug, "findTabNav");
function dg(t, e) {
  var i, r, a;
  return t instanceof HTMLElement ? [
    (i = t.querySelector(".tab[data-tab]")) == null ? void 0 : i.parentElement,
    t.querySelector(".sheet-body"),
    (a = (r = e == null ? void 0 : e.parentElement) == null ? void 0 : r.querySelector) == null ? void 0 : a.call(r, ":scope > .sheet-body"),
    e == null ? void 0 : e.parentElement
  ].find((o) => o instanceof HTMLElement) ?? null : null;
}
c(dg, "findTabBody");
function fg(t, e) {
  var n, i, r, a, o, s, l;
  return ((n = t == null ? void 0 : t.dataset) == null ? void 0 : n.group) ?? ((a = (r = (i = t == null ? void 0 : t.querySelector) == null ? void 0 : i.call(t, "[data-group]")) == null ? void 0 : r.dataset) == null ? void 0 : a.group) ?? ((l = (s = (o = e == null ? void 0 : e.querySelector) == null ? void 0 : o.call(e, ".tab[data-group]")) == null ? void 0 : s.dataset) == null ? void 0 : l.group) ?? "main";
}
c(fg, "getTabGroup");
function mg(t, e, n) {
  if (!(t instanceof HTMLElement)) return;
  t.textContent = "";
  const i = document.createElement("i");
  i.className = n, i.setAttribute("inert", ""), t.append(i, " ");
  const r = document.createElement("span");
  r.textContent = e, t.append(r);
}
c(mg, "setTabButtonContent");
function hg(t, e, n) {
  const i = t.querySelector("[data-tab]"), r = (i == null ? void 0 : i.tagName) || "A", a = document.createElement(r);
  return i instanceof HTMLElement && (a.className = i.className), a.classList.remove("active"), r === "BUTTON" && (a.type = "button"), a.dataset.action = "tab", a.dataset.tab = n, a.dataset.group = e, a.setAttribute("aria-selected", "false"), a.setAttribute("aria-pressed", "false"), a;
}
c(hg, "createTabButton");
function gg(t, e, n) {
  const i = document.createElement("div");
  i.classList.add("tab"), i.dataset.tab = n, i.dataset.group = e, i.dataset.applicationPart = n, i.setAttribute("hidden", "true");
  const r = fd(t);
  return t.insertBefore(i, r ?? null), i;
}
c(gg, "createTabPanel");
function ys(t, e, n, i, r) {
  var s;
  if (!(i instanceof HTMLElement) || !(r instanceof HTMLElement)) return;
  const a = (s = t == null ? void 0 : t.tabGroups) == null ? void 0 : s[e];
  if (typeof a == "string" ? a === n : i.classList.contains("active") || r.classList.contains("active")) {
    i.classList.add("active"), i.setAttribute("aria-selected", "true"), i.setAttribute("aria-pressed", "true"), r.classList.add("active"), r.removeAttribute("hidden"), r.removeAttribute("aria-hidden");
    return;
  }
  i.classList.remove("active"), i.setAttribute("aria-selected", "false"), i.setAttribute("aria-pressed", "false"), r.classList.remove("active"), r.setAttribute("hidden", "true");
}
c(ys, "syncTabVisibility");
function Wd(t, e, n, i, r) {
  const a = ug(e), o = dg(e, a);
  if (!(a instanceof HTMLElement) || !(o instanceof HTMLElement)) return null;
  const s = fg(a, o);
  let l = a.querySelector(`[data-tab="${n}"]`);
  l instanceof HTMLElement || (l = hg(a, s, n), a.appendChild(l)), mg(l, i, r);
  let u = o.querySelector(`.tab[data-tab="${n}"]`);
  u instanceof HTMLElement || (u = gg(o, s, n));
  const d = `data-eidolon-bound-${n}`;
  return l.hasAttribute(d) || (l.addEventListener("click", () => {
    ud(t, n, s), requestAnimationFrame(() => {
      ys(t, s, n, l, u);
    });
  }), l.setAttribute(d, "true")), ys(t, s, n, l, u), requestAnimationFrame(() => {
    ys(t, s, n, l, u);
  }), pg(t, a), u;
}
c(Wd, "ensureTileConfigTab");
function pg(t, e) {
  !(t != null && t.setPosition) || !(e instanceof HTMLElement) || requestAnimationFrame(() => {
    var a;
    if (e.scrollWidth <= e.clientWidth) return;
    const n = e.scrollWidth - e.clientWidth, i = t.element instanceof HTMLElement ? t.element : (a = t.element) == null ? void 0 : a[0];
    if (!i) return;
    const r = i.offsetWidth || 480;
    t.setPosition({ width: r + n + 16 });
  });
}
c(pg, "fitNavWidth");
function Yd(t) {
  var e;
  return ((e = t == null ? void 0 : t.getFlag) == null ? void 0 : e.call(t, "monks-active-tiles", "files")) ?? [];
}
c(Yd, "getTileFiles$1");
function yg(t = []) {
  return {
    strategy: "select-one",
    defaultTarget: qn(t, 0) ?? { indexHint: 0 },
    variants: [
      {
        criteria: {},
        target: qn(t, 0) ?? { indexHint: 0 }
      }
    ]
  };
}
c(yg, "createDefaultTileCriteria");
function bg(t, e = {}) {
  var o, s;
  const { allowLegacy: n = !0 } = e, i = Yd(t), r = (o = t == null ? void 0 : t.getFlag) == null ? void 0 : o.call(t, ie, pi);
  if (r) return Ei(r, { files: i });
  if (!n) return null;
  const a = (s = t == null ? void 0 : t.getFlag) == null ? void 0 : s.call(t, ie, gi);
  return a ? Ei(a, { files: i }) : null;
}
c(bg, "getTileCriteria");
async function Xc(t, e, n = {}) {
  if (!(t != null && t.setFlag)) return null;
  const {
    strictValidation: i = !0
  } = n, r = Yd(t), a = Ei(e, { files: r });
  if (!a)
    return typeof t.unsetFlag == "function" ? (await t.unsetFlag(ie, pi), await t.unsetFlag(ie, gi)) : (await t.setFlag(ie, pi, null), await t.setFlag(ie, gi, null)), null;
  if (i) {
    const o = Od(a, { files: r });
    if (o.errors.length > 0)
      throw new Error(
        `Tile criteria contains ${o.errors.length} conflicting rule pair(s). Resolve clashes before saving.`
      );
  }
  return await t.setFlag(ie, pi, a), typeof t.unsetFlag == "function" && await t.unsetFlag(ie, gi), a;
}
c(Xc, "setTileCriteria");
const hl = "__eidolon_any__", gl = "eidolon-tile-criteria", vg = "fa-solid fa-sliders", Kd = Symbol.for("eidolon.tileCriteriaUiState"), Ko = ["all", "unmapped", "mapped", "conflicts"];
function wg(t) {
  const e = t == null ? void 0 : t[Kd];
  return !e || typeof e != "object" ? {
    filterQuery: "",
    filterMode: "all",
    selectedFileIndex: null
  } : {
    filterQuery: typeof e.filterQuery == "string" ? e.filterQuery : "",
    filterMode: Ko.includes(e.filterMode) ? e.filterMode : "all",
    selectedFileIndex: Number.isInteger(e.selectedFileIndex) ? e.selectedFileIndex : null
  };
}
c(wg, "readUiState");
function Eg(t, e) {
  if (!t || !e) return;
  typeof e.filterQuery == "string" && (t.filterQuery = e.filterQuery), Ko.includes(e.filterMode) && (t.filterMode = e.filterMode), Number.isInteger(e.selectedFileIndex) && t.fileEntries.some((i) => i.index === e.selectedFileIndex) && (t.selectedFileIndex = e.selectedFileIndex);
}
c(Eg, "applyUiState");
function Sg(t) {
  const e = t == null ? void 0 : t.app, n = t == null ? void 0 : t.state;
  !e || !n || (e[Kd] = {
    filterQuery: typeof n.filterQuery == "string" ? n.filterQuery : "",
    filterMode: Ko.includes(n.filterMode) ? n.filterMode : "all",
    selectedFileIndex: Number.isInteger(n.selectedFileIndex) ? n.selectedFileIndex : null
  });
}
c(Sg, "persistUiState");
function Cg(t) {
  const e = (t == null ? void 0 : t.object) ?? (t == null ? void 0 : t.document) ?? null;
  return !(e != null && e.isEmbedded) || e.documentName !== "Tile" ? null : e;
}
c(Cg, "getTileDocument$1");
function Tg(t) {
  var e;
  return ((e = t == null ? void 0 : t.getFlag) == null ? void 0 : e.call(t, "monks-active-tiles", "files")) ?? [];
}
c(Tg, "getTileFiles");
function Lg(t, e) {
  var s;
  const n = (t == null ? void 0 : t.parent) ?? ((s = game.scenes) == null ? void 0 : s.viewed) ?? null, r = pt(n).sort((l, u) => l.order - u.order).map((l) => ({
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
c(Lg, "getCriteriaDefinitions");
function Ig(t) {
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
c(Ig, "buildTree");
function Og(t, e) {
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
c(Og, "collapseFolderBranch");
function Ag(t, e) {
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
c(Ag, "getRuleSummariesForFile");
function pl(t) {
  var g, p;
  const e = Tg(t), n = oc(e), i = bg(t, { allowLegacy: !0 }) ?? yg(e), r = Lg(t, i), a = new Map(r.map((y) => [y.key, y.label])), o = new Map(
    n.map((y) => [
      y.index,
      y.path || y.label
    ])
  ), s = Lr(i.defaultTarget, e), l = ((g = n[0]) == null ? void 0 : g.index) ?? 0, u = s >= 0 ? s : l, d = new Map(n.map((y) => [y.index, []]));
  let h = 1;
  for (const y of i.variants ?? []) {
    const v = Lr(y.target, e);
    v < 0 || (d.has(v) || d.set(v, []), d.get(v).push({
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
      message: E("EIDOLON.TileCriteria.Ready", "Ready")
    }
  };
}
c(pl, "buildEditorState");
function yl(t, e) {
  return t.rulesByFile.has(e) || t.rulesByFile.set(e, []), t.rulesByFile.get(e);
}
c(yl, "getRulesForFile");
function kg(t) {
  return Object.fromEntries(
    Object.entries(t ?? {}).filter(([e, n]) => typeof e == "string" && e && typeof n == "string" && n.trim()).map(([e, n]) => [e, n.trim()])
  );
}
c(kg, "sanitizeRuleCriteria");
function Jd(t) {
  const e = qn(t.files, t.defaultIndex);
  if (!e) return null;
  const n = [], i = [];
  for (const [a, o] of t.rulesByFile.entries()) {
    const s = qn(t.files, a);
    if (s)
      for (const [l, u] of o.entries()) {
        const d = kg(u.criteria);
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
    normalized: Ei(
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
c(Jd, "buildTileCriteriaDraft");
function Mg(t) {
  var e;
  return ((e = Jd(t)) == null ? void 0 : e.normalized) ?? null;
}
c(Mg, "exportTileCriteria");
function Qc(t) {
  const e = Jd(t);
  if (!(e != null && e.normalized))
    return {
      errors: [],
      warnings: [],
      errorFileIndexes: [],
      warningFileIndexes: []
    };
  const n = Od(e.normalized, { files: t.files }), i = /* @__PURE__ */ c((s) => {
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
c(Qc, "analyzeRuleConflicts");
function ca(t, e = "neutral") {
  const n = document.createElement("span");
  return n.classList.add("eidolon-tile-criteria__badge"), n.dataset.kind = e, n.textContent = t, n;
}
c(ca, "createBadge");
function Ng(t, e = {}) {
  const n = typeof t == "string" ? t : "", {
    maxLength: i = 42,
    headLength: r = 20,
    tailLength: a = 16
  } = e;
  if (!n || n.length <= i) return n;
  const o = n.slice(0, r).trimEnd(), s = n.slice(-a).trimStart();
  return `${o}...${s}`;
}
c(Ng, "middleEllipsis");
function $g(t) {
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
c($g, "createRegexFilter");
function xg(t, e) {
  const n = document.createElement("select");
  n.dataset.criteriaKey = t.key;
  const i = document.createElement("option");
  i.value = hl, i.textContent = "*", n.appendChild(i);
  const r = new Set(t.values ?? []);
  e && !r.has(e) && r.add(e);
  for (const a of r) {
    const o = document.createElement("option");
    o.value = a, o.textContent = a, n.appendChild(o);
  }
  return n.value = e ?? hl, n;
}
c(xg, "createCriterionSelect");
function _g(t, e, n, i) {
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
    const h = xg(l, (s = t.criteria) == null ? void 0 : s[l.key]);
    h.addEventListener("change", () => {
      h.value === hl ? delete t.criteria[l.key] : t.criteria[l.key] = h.value, i();
    }), u.appendChild(h), a.appendChild(u);
  }
  r.appendChild(a);
  const o = document.createElement("button");
  return o.type = "button", o.classList.add("control", "ui-control", "eidolon-tile-criteria__rule-remove"), o.textContent = E("EIDOLON.TileCriteria.RemoveRule", "Remove"), o.addEventListener("click", () => {
    const u = yl(e, n).filter((d) => d.id !== t.id);
    e.rulesByFile.set(n, u), i();
  }), r.appendChild(o), r;
}
c(_g, "renderRuleEditor");
const Sa = /* @__PURE__ */ new WeakMap();
function Xd(t) {
  return (t == null ? void 0 : t.app) ?? (t == null ? void 0 : t.tile) ?? null;
}
c(Xd, "getDialogOwner");
function Fg(t) {
  for (const e of t) {
    const n = Kt(e);
    if (n) return n;
    const i = Kt(e == null ? void 0 : e.element);
    if (i) return i;
  }
  return null;
}
c(Fg, "findDialogRoot$1");
function Dg(t, e, n) {
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
    i.defaultIndex = r.index, We(t), n();
  })), u.appendChild(d);
  const h = document.createElement("button");
  h.type = "button", h.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action", "secondary"), h.textContent = E("EIDOLON.TileCriteria.ClearFileRules", "Clear File Rules"), h.addEventListener("click", () => {
    i.rulesByFile.set(r.index, []), We(t), n();
  }), u.appendChild(h), a.appendChild(u);
  const f = document.createElement("div");
  f.classList.add("eidolon-tile-criteria__rule-editors");
  const g = yl(i, r.index);
  if (g.length)
    for (const y of g)
      f.appendChild(
        _g(y, i, r.index, () => {
          We(t), n();
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
    yl(i, r.index).push({
      id: i.nextRuleId,
      criteria: {}
    }), i.nextRuleId += 1, We(t), n();
  }), a.appendChild(p), a;
}
c(Dg, "buildRuleEditorContent");
function Pg(t, e) {
  var h, f, g;
  const n = Xd(t);
  if (!n) return;
  const i = Sa.get(n);
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
  Sa.set(n, r);
  const a = /* @__PURE__ */ c(() => {
    Sa.delete(n);
  }, "closeDialog"), o = /* @__PURE__ */ c(() => {
    r.host instanceof HTMLElement && r.host.replaceChildren(
      Dg(r.controller, r.fileIndex, o)
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
        var b;
        const y = Fg(p), v = (b = y == null ? void 0 : y.querySelector) == null ? void 0 : b.call(y, ".eidolon-tile-criteria-editor-host");
        v instanceof HTMLElement && (r.host = v, o());
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
c(Pg, "openRuleEditorDialog");
function Zc(t) {
  var i;
  const e = Xd(t);
  if (!e) return;
  const n = Sa.get(e);
  (i = n == null ? void 0 : n.refresh) == null || i.call(n);
}
c(Zc, "refreshOpenRuleEditor");
function bl(t, e) {
  return (t.rulesByFile.get(e) ?? []).length > 0;
}
c(bl, "hasRulesForFile");
function Qd(t, e) {
  var n, i;
  return ((n = t == null ? void 0 : t.errorFileIndexes) == null ? void 0 : n.includes(e)) || ((i = t == null ? void 0 : t.warningFileIndexes) == null ? void 0 : i.includes(e));
}
c(Qd, "hasConflictForFile");
function Rg(t, e, n) {
  switch (t.filterMode) {
    case "unmapped":
      return !bl(t, e.index);
    case "mapped":
      return bl(t, e.index);
    case "conflicts":
      return Qd(n, e.index);
    case "all":
    default:
      return !0;
  }
}
c(Rg, "matchesFilterMode");
function Hg(t, e) {
  let n = 0, i = 0, r = 0;
  for (const a of t.fileEntries)
    bl(t, a.index) ? n += 1 : i += 1, Qd(e, a.index) && (r += 1);
  return {
    all: t.fileEntries.length,
    mapped: n,
    unmapped: i,
    conflicts: r
  };
}
c(Hg, "getFilterModeCounts");
function qg(t) {
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
c(qg, "getFilterModeLabel");
function Zd(t, e, n, i, r) {
  var u, d;
  const a = [...t.folders.keys()].sort((h, f) => h.localeCompare(f));
  for (const h of a) {
    const f = Og(h, t.folders.get(h)), g = document.createElement("li");
    g.classList.add("eidolon-tile-criteria__tree-branch");
    const p = document.createElement("div");
    p.classList.add("document", "folder", "update", "eidolon-tile-criteria__folder-row");
    const y = document.createElement("i");
    y.classList.add("fa-solid", "fa-folder-open"), p.appendChild(y);
    const v = document.createElement("span");
    v.classList.add("eidolon-tile-criteria__tree-folder-label"), v.textContent = f.label, v.title = f.label, p.appendChild(v), g.appendChild(p);
    const b = document.createElement("ul");
    b.classList.add("eidolon-tile-criteria__tree"), b.dataset.folder = f.label, Zd(f.node, e, n, i, b), b.childElementCount > 0 && g.appendChild(b), r.appendChild(g);
  }
  const o = [...t.files].sort((h, f) => h.name.localeCompare(f.name));
  if (!o.length) return;
  const s = document.createElement("li"), l = document.createElement("ul");
  l.classList.add("document-list", "eidolon-tile-criteria__document-list");
  for (const h of o) {
    const f = h.entry, g = f.index === e.selectedFileIndex, p = f.index === e.defaultIndex, y = Ag(e, f.index), v = document.createElement("li");
    v.classList.add("document", "update", "eidolon-tile-criteria__tree-file");
    const b = document.createElement("button");
    b.type = "button", b.classList.add("eidolon-tile-criteria__file-row");
    const w = (u = i == null ? void 0 : i.errorFileIndexes) == null ? void 0 : u.includes(f.index), C = (d = i == null ? void 0 : i.warningFileIndexes) == null ? void 0 : d.includes(f.index);
    w ? b.classList.add("has-conflict") : C && b.classList.add("has-warning");
    const I = e.relativePaths.get(f.index) || f.path || h.name, A = [I];
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
    ), y.length || A.push(
      E(
        "EIDOLON.TileCriteria.UnmappedHint",
        "No criteria rules map to this file."
      )
    ), b.title = A.join(`
`), g && b.classList.add("is-selected"), b.addEventListener("click", () => {
      e.selectedFileIndex = f.index, We(n), Pg(n, f.index);
    });
    const O = document.createElement("span");
    O.classList.add("eidolon-tile-criteria__indicator"), O.dataset.kind = p ? "default" : y.length ? "mapped" : "unmapped", b.appendChild(O);
    const M = document.createElement("span");
    M.classList.add("eidolon-tile-criteria__file-content");
    const _ = document.createElement("span");
    _.classList.add("eidolon-tile-criteria__file-heading");
    const j = document.createElement("span");
    j.classList.add("eidolon-tile-criteria__file-title"), j.textContent = Ng(h.name || f.label), j.title = I, _.appendChild(j);
    const D = ca(`#${f.index + 1}`, "meta");
    D.classList.add("eidolon-tile-criteria__index-badge"), _.appendChild(D), M.appendChild(_);
    const P = document.createElement("span");
    P.classList.add("eidolon-tile-criteria__badges"), p && P.appendChild(ca(E("EIDOLON.TileCriteria.DefaultBadge", "Default"), "default"));
    const $ = y.slice(0, 2);
    for (const R of $)
      P.appendChild(ca(R, "rule"));
    if (y.length > $.length && P.appendChild(ca(`+${y.length - $.length}`, "meta")), M.appendChild(P), b.appendChild(M), w || C) {
      const R = document.createElement("span");
      R.classList.add("eidolon-tile-criteria__row-warning"), R.dataset.mode = w ? "error" : "warning", R.innerHTML = '<i class="fa-solid fa-triangle-exclamation" inert=""></i>', b.appendChild(R);
    }
    v.appendChild(b), l.appendChild(v);
  }
  s.appendChild(l), r.appendChild(s);
}
c(Zd, "renderTreeNode");
function jg(t, e, n, i = {}) {
  const r = document.createElement("section");
  r.classList.add("eidolon-tile-criteria__tree-panel");
  const a = $g(t.filterQuery), o = Hg(t, n);
  t.filterMode !== "all" && o[t.filterMode] === 0 && (t.filterMode = "all");
  const s = document.createElement("div");
  s.classList.add("eidolon-tile-criteria__toolbar");
  const l = document.createElement("div");
  l.classList.add("eidolon-tile-criteria__mode-bar");
  for (const w of Ko) {
    const C = document.createElement("button");
    C.type = "button", C.classList.add("control", "ui-control", "eidolon-tile-criteria__mode-button"), C.dataset.mode = w, C.textContent = qg(w);
    const I = w === "all" || o[w] > 0;
    C.disabled = !I, I || (C.dataset.tooltip = E(
      "EIDOLON.TileCriteria.FilterModeUnavailable",
      "No entries currently match this filter."
    ), C.title = C.dataset.tooltip), t.filterMode === w ? (C.classList.add("is-active"), C.setAttribute("aria-pressed", "true")) : C.setAttribute("aria-pressed", "false"), C.addEventListener("click", () => {
      t.filterMode !== w && (t.filterMode = w, We(e));
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
    const C = d.selectionStart ?? d.value.length, I = d.selectionEnd ?? C;
    t.filterQuery = d.value, We(e), requestAnimationFrame(() => {
      const A = e.section.querySelector(".eidolon-tile-criteria__filter-input");
      if (A instanceof HTMLInputElement) {
        A.focus();
        try {
          A.setSelectionRange(C, I);
        } catch {
        }
      }
    });
  }), u.appendChild(d);
  const h = document.createElement("div");
  h.classList.add("eidolon-tile-criteria__toolbar-actions");
  const f = document.createElement("button");
  f.type = "button";
  const g = E("EIDOLON.TileCriteria.Save", "Save Rules");
  f.classList.add("control", "ui-control", "eidolon-tile-criteria__toolbar-action", "icon-only"), f.dataset.tooltip = g, f.setAttribute("aria-label", g), f.title = g, f.innerHTML = '<i class="fa-solid fa-floppy-disk" inert=""></i>', f.disabled = n.errors.length > 0, f.addEventListener("click", () => {
    var w;
    (w = i.onSave) == null || w.call(i);
  }), h.appendChild(f);
  const p = document.createElement("button");
  p.type = "button";
  const y = E("EIDOLON.TileCriteria.Clear", "Clear Rules");
  if (p.classList.add("control", "ui-control", "secondary", "eidolon-tile-criteria__toolbar-action", "icon-only"), p.dataset.tooltip = y, p.setAttribute("aria-label", y), p.title = y, p.innerHTML = '<i class="fa-solid fa-trash" inert=""></i>', p.addEventListener("click", () => {
    var w;
    (w = i.onClear) == null || w.call(i);
  }), h.appendChild(p), u.appendChild(h), s.appendChild(u), r.appendChild(s), a.error) {
    const w = document.createElement("p");
    w.classList.add("notes", "eidolon-tile-criteria__filter-error"), w.textContent = `${E("EIDOLON.TileCriteria.InvalidRegex", "Invalid regex")}: ${a.error}`, r.appendChild(w);
  }
  const v = document.createElement("div");
  v.classList.add("eidolon-tile-criteria__library-tree");
  const b = t.fileEntries.filter((w) => {
    const C = t.relativePaths.get(w.index) || w.path || w.label;
    return Rg(t, w, n) && a.matches(C);
  });
  if (t.fileEntries.length)
    if (b.length) {
      const w = document.createElement("ul");
      w.classList.add("eidolon-tile-criteria__tree"), Zd(Ig(b), t, e, n, w), v.appendChild(w);
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
c(jg, "renderTreePanel");
function We(t) {
  const { section: e, state: n } = t, i = Qc(n);
  Sg(t), e.replaceChildren();
  const r = /* @__PURE__ */ c(async () => {
    try {
      const o = Qc(n);
      if (o.errors.length) {
        n.status = {
          mode: "error",
          message: E(
            "EIDOLON.TileCriteria.ConflictSaveBlocked",
            `Resolve ${o.errors.length} conflict(s) before saving tile criteria rules.`
          )
        }, We(t);
        return;
      }
      const s = Mg(n);
      if (!s) {
        n.status = {
          mode: "error",
          message: E("EIDOLON.TileCriteria.Invalid", "Invalid rules. Select valid target variants.")
        }, We(t);
        return;
      }
      await Xc(t.tile, s);
      const l = n.filterQuery, u = n.filterMode, d = n.selectedFileIndex;
      t.state = pl(t.tile), t.state.filterQuery = l, t.state.filterMode = u, Number.isInteger(d) && (t.state.selectedFileIndex = d), t.state.status = {
        mode: "ready",
        message: E("EIDOLON.TileCriteria.Saved", "Tile criteria rules saved.")
      }, We(t), Zc(t);
    } catch (o) {
      console.error(`${ie} | Failed to save tile criteria`, o), n.status = {
        mode: "error",
        message: (o == null ? void 0 : o.message) ?? "Failed to save tile criteria rules."
      }, We(t);
    }
  }, "handleSave"), a = /* @__PURE__ */ c(async () => {
    try {
      await Xc(t.tile, null);
      const o = n.filterQuery, s = n.filterMode, l = n.selectedFileIndex;
      t.state = pl(t.tile), t.state.filterQuery = o, t.state.filterMode = s, Number.isInteger(l) && (t.state.selectedFileIndex = l), t.state.status = {
        mode: "ready",
        message: E("EIDOLON.TileCriteria.Cleared", "Tile criteria rules cleared.")
      }, We(t), Zc(t);
    } catch (o) {
      console.error(`${ie} | Failed to clear tile criteria`, o), n.status = {
        mode: "error",
        message: (o == null ? void 0 : o.message) ?? "Failed to clear tile criteria rules."
      }, We(t);
    }
  }, "handleClear");
  if (e.appendChild(jg(n, t, i, {
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
c(We, "renderController");
function Bg(t, e = null) {
  const n = document.createElement("section");
  n.classList.add("eidolon-tile-criteria");
  const i = pl(t);
  Eg(i, wg(e));
  const r = {
    app: e,
    tile: t,
    section: n,
    state: i
  };
  return We(r), r;
}
c(Bg, "createController");
function Ug(t, e) {
  return Wd(
    t,
    e,
    gl,
    E("EIDOLON.TileCriteria.TabLabel", "Criteria"),
    vg
  );
}
c(Ug, "ensureTileCriteriaTab");
function Vg() {
  Hooks.on("renderTileConfig", (t, e) => {
    var l, u, d, h;
    const n = Kt(e);
    if (!n) return;
    const i = Cg(t);
    if (!i) return;
    if ((l = n.querySelector(".eidolon-tile-criteria")) == null || l.remove(), !Uo()) {
      (u = n.querySelector(`.item[data-tab='${gl}']`)) == null || u.remove(), (d = n.querySelector(`.tab[data-tab='${gl}']`)) == null || d.remove();
      return;
    }
    const r = Bg(i, t), a = Ug(t, n);
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
c(Vg, "registerTileCriteriaConfigControls");
function Gg(t) {
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
c(Gg, "toList");
function zg(t, e) {
  const n = t == null ? void 0 : t.tools;
  return Array.isArray(n) ? n.some((i) => (i == null ? void 0 : i.name) === e) : n instanceof Map ? n.has(e) : n && typeof n == "object" ? e in n ? !0 : Object.values(n).some((i) => (i == null ? void 0 : i.name) === e) : !1;
}
c(zg, "hasTool");
function Wg(t, e) {
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
c(Wg, "addTool");
function Yg() {
  Hooks.on("getSceneControlButtons", (t) => {
    var i;
    const e = Gg(t);
    if (!e.length) return;
    const n = e.find((r) => (r == null ? void 0 : r.name) === "tiles") ?? e.find((r) => (r == null ? void 0 : r.name) === "tokens" || (r == null ? void 0 : r.name) === "token") ?? e[0];
    n && (zg(n, "eidolonCriteriaSwitcher") || Wg(n, {
      name: "eidolonCriteriaSwitcher",
      title: "Criteria Switcher",
      icon: "fa-solid fa-sliders",
      button: !0,
      toggle: !1,
      visible: Go(((i = game.scenes) == null ? void 0 : i.viewed) ?? null),
      onClick: /* @__PURE__ */ c(() => cc(), "onClick")
    }));
  });
}
c(Yg, "registerSceneControlButton");
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
function Kg() {
  const t = /* @__PURE__ */ c((i, r = null) => {
    i && Ph(i, r);
  }, "invalidateTileScene"), e = /* @__PURE__ */ c((i, r = null) => {
    i && Xh(i, r);
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
c(Kg, "registerCriteriaCacheInvalidationHooks");
function Jg() {
  Yg(), Vg(), Kg(), Hooks.once("init", () => {
    var t, e;
    (e = (t = game.keybindings) == null ? void 0 : t.register) == null || e.call(t, ie, "toggleCriteriaSwitcher", {
      name: "Toggle Criteria Switcher",
      hint: "Open or close the criteria switcher window for live scene state updates.",
      editable: [{ key: "KeyM", modifiers: ["Alt"] }],
      onDown: /* @__PURE__ */ c(() => {
        var n, i, r;
        return Go(((n = game.scenes) == null ? void 0 : n.viewed) ?? null) ? (cc(), !0) : ((r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "You do not have permission to manage scene criteria."), !0);
      }, "onDown"),
      restricted: !0,
      precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
    });
  }), Hooks.on("canvasReady", (t) => {
    var n;
    const e = Yo();
    e && (e.setScene((t == null ? void 0 : t.scene) ?? ((n = game.scenes) == null ? void 0 : n.viewed) ?? null), e.render({ force: !0 }));
  }), Hooks.once("ready", () => {
    var e, n;
    const t = (n = (e = game.modules) == null ? void 0 : e.get) == null ? void 0 : n.call(e, ie);
    t && (t.api || (t.api = {}), t.api.criteria = cg, console.log(`${ie} | Criteria engine API registered`));
  });
}
c(Jg, "registerCriteriaEngineHooks");
Jg();
const Ca = /* @__PURE__ */ new WeakMap(), da = /* @__PURE__ */ new WeakMap(), ve = "__eidolon_default__";
function Xg() {
  Hooks.on("renderAmbientLightConfig", Qg), N("LightCriteria | AmbientLightConfig controls registered");
}
c(Xg, "registerAmbientLightCriteriaControls");
function Qg(t, e) {
  var n;
  Ki("LightCriteria | renderAmbientLightConfig", {
    appId: (t == null ? void 0 : t.id) ?? null,
    constructor: ((n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) ?? null,
    isRendered: (t == null ? void 0 : t.rendered) ?? !1
  });
  try {
    const i = Kt(e);
    if (!i) return;
    if (!Uo()) {
      i.querySelectorAll(".eidolon-light-criteria, .eidolon-light-criteria-main-switcher").forEach((r) => r.remove());
      return;
    }
    Zg(t, i);
  } catch (i) {
    console.error("eidolon-utilities | Failed to enhance AmbientLightConfig UI", i);
  } finally {
    Fn();
  }
}
c(Qg, "handleAmbientLightConfigRender");
function Zg(t, e) {
  var xe, Yn, ir, na, Ic;
  const n = (t == null ? void 0 : t.form) instanceof HTMLFormElement ? t.form : e instanceof HTMLFormElement ? e : (xe = e == null ? void 0 : e.closest) == null ? void 0 : xe.call(e, "form");
  if (!(n instanceof HTMLFormElement)) return;
  const i = n.querySelector(".window-content");
  if (!(i instanceof HTMLElement)) return;
  const r = tf(t);
  if (!r) return;
  const a = Ep(r);
  N("LightCriteria | Resolved ambient light", {
    sheetId: (r == null ? void 0 : r.id) ?? null,
    persistedId: (a == null ? void 0 : a.id) ?? null,
    sameRef: r === a
  });
  const o = (a == null ? void 0 : a.parent) ?? r.parent ?? null, s = o ? rh(o) : [], l = s.filter(
    (x) => Array.isArray(x == null ? void 0 : x.values) && x.values.length > 0
  ), u = dp(s), d = s.map((x) => typeof (x == null ? void 0 : x.id) == "string" ? x.id : null).filter((x) => !!x), h = a ?? r, f = o ? pt(o) : [];
  let g = Nd(h);
  const p = Bh(g, f);
  JSON.stringify(p) !== JSON.stringify(g) && (g = p, $d(h, p).catch((x) => {
    console.warn("eidolon-utilities | Failed to persist migrated light criteria keys", x);
  })), N("LightCriteria | Loaded mapping state", {
    hasBase: !!(g != null && g.base),
    mappingCount: Array.isArray(g == null ? void 0 : g.mappings) ? g.mappings.length : 0,
    mappings: Array.isArray(g == null ? void 0 : g.mappings) ? g.mappings.map((x) => {
      var G, Z;
      return {
        id: x.id,
        key: x.key,
        hasColor: !!((Z = (G = x.config) == null ? void 0 : G.config) != null && Z.color)
      };
    }) : []
  });
  const y = i.querySelector(".eidolon-light-criteria");
  y && y.remove(), i.querySelectorAll(".eidolon-light-criteria-main-switcher").forEach((x) => x.remove());
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
  const I = document.createElement("button");
  I.type = "button", I.dataset.action = "make-default", I.classList.add("eidolon-light-criteria__button"), I.textContent = E(
    "EIDOLON.LightCriteria.SetBase",
    "Set Base"
  ), C.appendChild(I);
  const A = document.createElement("button");
  A.type = "button", A.dataset.action = "create-mapping", A.classList.add("eidolon-light-criteria__button"), A.textContent = E(
    "EIDOLON.LightCriteria.CreateMapping",
    "Add Criteria Mapping"
  ), A.setAttribute("aria-expanded", "false"), C.appendChild(A), v.appendChild(C);
  const O = document.createElement("p");
  O.classList.add("notes", "eidolon-light-criteria__status"), v.appendChild(O);
  const M = document.createElement("div");
  M.classList.add("eidolon-light-criteria__switcher");
  const _ = document.createElement("label");
  _.classList.add("eidolon-light-criteria__switcher-label");
  const j = `${(t == null ? void 0 : t.id) ?? (r == null ? void 0 : r.id) ?? "eidolon-light"}-mapping-select`;
  _.htmlFor = j, _.textContent = E("EIDOLON.LightCriteria.SelectLabel", "Criteria Mapping"), M.appendChild(_);
  const D = document.createElement("details");
  D.classList.add("eidolon-light-criteria__filter-details");
  const P = document.createElement("summary");
  P.classList.add("eidolon-light-criteria__filter-summary");
  const $ = document.createElement("span");
  $.classList.add("eidolon-light-criteria__filter-summary-label"), $.textContent = E(
    "EIDOLON.LightCriteria.FilterHeading",
    "Filter mappings"
  ), P.appendChild($);
  const R = document.createElement("span");
  R.classList.add("eidolon-light-criteria__filter-meta"), P.appendChild(R), D.appendChild(P);
  const B = document.createElement("div");
  B.classList.add("eidolon-light-criteria__filter-panel");
  const W = document.createElement("div");
  W.classList.add("eidolon-light-criteria__filter-grid");
  for (const x of l) {
    const G = document.createElement("label");
    G.classList.add("eidolon-light-criteria__filter");
    const Z = document.createElement("span");
    Z.classList.add("eidolon-light-criteria__filter-name"), Z.textContent = (ir = (Yn = x.name) == null ? void 0 : Yn.trim) != null && ir.call(Yn) ? x.name.trim() : E("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), G.appendChild(Z);
    const ee = document.createElement("select");
    ee.dataset.filterCategoryId = x.id, ee.classList.add("eidolon-light-criteria__filter-select");
    const ne = document.createElement("option");
    ne.value = "", ne.textContent = E("EIDOLON.LightCriteria.FilterAny", "Any"), ee.appendChild(ne);
    for (const ue of x.values) {
      const de = document.createElement("option");
      de.value = ue, de.textContent = ue, ee.appendChild(de);
    }
    G.appendChild(ee), W.appendChild(G);
  }
  B.appendChild(W);
  const H = document.createElement("div");
  H.classList.add("eidolon-light-criteria__filter-actions");
  const U = document.createElement("button");
  U.type = "button", U.dataset.action = "clear-mapping-filters", U.classList.add("eidolon-light-criteria__button", "secondary", "compact"), U.textContent = E("EIDOLON.LightCriteria.ClearFilters", "Clear Filters"), H.appendChild(U), B.appendChild(H), D.appendChild(B), D.hidden = l.length === 0, M.appendChild(D);
  const K = document.createElement("div");
  K.classList.add("eidolon-light-criteria__switcher-controls"), M.appendChild(K);
  const ae = document.createElement("select");
  ae.id = j, ae.classList.add("eidolon-light-criteria__select"), ae.dataset.action = "select-mapping", K.appendChild(ae);
  const Q = document.createElement("button");
  Q.type = "button", Q.dataset.action = "apply-selected-mapping", Q.classList.add("eidolon-light-criteria__button", "secondary"), Q.textContent = E("EIDOLON.LightCriteria.ApplyButton", "Apply"), K.appendChild(Q);
  const te = document.createElement("details");
  te.classList.add("eidolon-light-criteria__menu"), te.dataset.action = "mapping-actions-menu";
  const Xt = document.createElement("summary");
  Xt.classList.add("eidolon-light-criteria__menu-toggle"), Xt.innerHTML = '<i class="fa-solid fa-ellipsis-vertical" inert=""></i>', Xt.setAttribute(
    "aria-label",
    E("EIDOLON.LightCriteria.MoreActions", "More actions")
  ), Xt.dataset.tooltip = E("EIDOLON.LightCriteria.MoreActions", "More actions"), te.appendChild(Xt);
  const yt = document.createElement("div");
  yt.classList.add("eidolon-light-criteria__menu-list"), te.appendChild(yt);
  const Pe = document.createElement("button");
  Pe.type = "button", Pe.dataset.action = "update-selected-mapping", Pe.classList.add("eidolon-light-criteria__menu-item"), Pe.textContent = E(
    "EIDOLON.LightCriteria.UpdateSelected",
    "Save current config to selected"
  ), yt.appendChild(Pe);
  const at = document.createElement("button");
  at.type = "button", at.dataset.action = "edit-selected-mapping-criteria", at.classList.add("eidolon-light-criteria__menu-item"), at.textContent = E(
    "EIDOLON.LightCriteria.EditSelectedCriteria",
    "Edit selected mapping criteria"
  ), yt.appendChild(at);
  const ot = document.createElement("button");
  ot.type = "button", ot.dataset.action = "remove-selected-mapping", ot.classList.add("eidolon-light-criteria__menu-item", "danger"), ot.textContent = E(
    "EIDOLON.LightCriteria.RemoveSelected",
    "Delete selected mapping"
  ), yt.appendChild(ot), K.appendChild(te);
  const Qt = document.createElement("div");
  Qt.classList.add("eidolon-light-criteria-main-switcher"), Qt.appendChild(M);
  const Je = document.createElement("p");
  if (Je.classList.add("notes", "eidolon-light-criteria-main-switcher__empty"), Je.textContent = E(
    "EIDOLON.LightCriteria.ActiveRequiresBase",
    "Set Base Lighting to enable mapping selection and actions."
  ), Qt.appendChild(Je), s.length === 0) {
    const x = document.createElement("p");
    x.classList.add("notification", "warning", "eidolon-light-criteria__warning"), x.textContent = E(
      "EIDOLON.LightCriteria.NoCategoriesWarning",
      "This scene has no criteria configured. Add criteria under Scene -> Criteria to enable criteria-driven lighting."
    ), v.appendChild(x);
  } else if (l.length === 0) {
    const x = document.createElement("p");
    x.classList.add("notification", "warning", "eidolon-light-criteria__warning"), x.textContent = E(
      "EIDOLON.LightCriteria.NoValuesWarning",
      "Criteria exist, but none define selectable values. Add values in Scene -> Criteria."
    ), v.appendChild(x);
  }
  const Ae = document.createElement("div");
  Ae.classList.add("eidolon-light-criteria__creation"), Ae.dataset.section = "creation", Ae.hidden = !0;
  const Li = document.createElement("p");
  Li.classList.add("notes"), Li.textContent = E(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ), Ae.appendChild(Li);
  const Zt = document.createElement("div");
  Zt.classList.add("eidolon-light-criteria__category-list"), Ae.appendChild(Zt);
  for (const x of l) {
    const G = document.createElement("label");
    G.classList.add("eidolon-light-criteria__category");
    const Z = document.createElement("span");
    Z.classList.add("eidolon-light-criteria__category-name"), Z.textContent = (Ic = (na = x.name) == null ? void 0 : na.trim) != null && Ic.call(na) ? x.name.trim() : E("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), G.appendChild(Z);
    const ee = document.createElement("select");
    ee.dataset.categoryId = x.id, ee.classList.add("eidolon-light-criteria__category-select");
    const ne = document.createElement("option");
    ne.value = "", ne.textContent = E(
      "EIDOLON.LightCriteria.IgnoreCategory",
      "Ignore"
    ), ee.appendChild(ne);
    for (const ue of x.values) {
      const de = document.createElement("option");
      de.value = ue, de.textContent = ue, ee.appendChild(de);
    }
    G.appendChild(ee), Zt.appendChild(G);
  }
  const Wn = document.createElement("div");
  Wn.classList.add("eidolon-light-criteria__creation-actions");
  const st = document.createElement("button");
  st.type = "button", st.dataset.action = "save-mapping", st.classList.add("eidolon-light-criteria__button", "primary"), st.textContent = E(
    "EIDOLON.LightCriteria.SaveMapping",
    "Save Mapping"
  ), Wn.appendChild(st);
  const en = document.createElement("button");
  en.type = "button", en.dataset.action = "cancel-create", en.classList.add("eidolon-light-criteria__button", "secondary"), en.textContent = E(
    "EIDOLON.LightCriteria.Cancel",
    "Cancel"
  ), Wn.appendChild(en), Ae.appendChild(Wn), v.appendChild(Ae), i.prepend(Qt), i.appendChild(v), v.hidden = !0, np(t, {
    fieldset: v,
    homeContainer: i
  }), requestAnimationFrame(() => {
    var x;
    (x = t.setPosition) == null || x.call(t, { height: "auto" });
  });
  let F = g;
  Xn({ switcher: M, emptyState: Je, state: F }), Jn(O, F), sr(A, {
    state: F,
    hasCategories: l.length > 0
  }), N("LightCriteria | Controls injected", {
    sceneId: (o == null ? void 0 : o.id) ?? null,
    lightId: (r == null ? void 0 : r.id) ?? null,
    hasBase: !!(F != null && F.base),
    mappingCount: Array.isArray(F == null ? void 0 : F.mappings) ? F.mappings.length : 0,
    categories: l.length
  });
  const ea = yp(F), X = {
    restoreConfig: null,
    app: t,
    selectedMapping: ea,
    editorMode: "create",
    editingMappingId: null,
    mappingFilters: {}
  };
  Ca.set(v, X);
  const bt = /* @__PURE__ */ c(() => {
    te.open = !1;
  }, "closeActionsMenu");
  Xt.addEventListener("click", (x) => {
    te.classList.contains("is-disabled") && (x.preventDefault(), bt());
  });
  const $e = /* @__PURE__ */ c((x = X.selectedMapping) => {
    const G = fp(W), Z = Array.isArray(F == null ? void 0 : F.mappings) ? F.mappings : [], ee = hp(Z, G), ne = Object.keys(G).length;
    X.mappingFilters = G, U.disabled = ne === 0, gp(R, {
      totalCount: Z.length,
      visibleCount: ee.length,
      hasFilters: ne > 0,
      activeFilterCount: ne
    }), D.classList.toggle("has-active-filters", ne > 0), pp(ae, F, u, x, {
      mappings: ee,
      categoryOrder: d
    }), X.selectedMapping = ae.value ?? "", bs({
      mappingSelect: ae,
      applyMappingButton: Q,
      updateMappingButton: Pe,
      editCriteriaButton: at,
      removeMappingButton: ot,
      actionsMenu: te,
      state: F
    }), te.classList.contains("is-disabled") && bt();
  }, "refreshMappingSelector");
  W.querySelectorAll("select[data-filter-category-id]").forEach((x) => {
    x.addEventListener("change", () => {
      const G = X.selectedMapping;
      $e(G), X.selectedMapping !== G && vs(
        a ?? r,
        F,
        X.selectedMapping
      ).then((Z) => {
        Z && (F = Z);
      });
    });
  }), U.addEventListener("click", () => {
    mp(W);
    const x = X.selectedMapping;
    $e(x), D.open = !1, X.selectedMapping !== x && vs(
      a ?? r,
      F,
      X.selectedMapping
    ).then((G) => {
      G && (F = G);
    });
  }), ae.addEventListener("change", () => {
    X.selectedMapping = ae.value ?? "", bs({
      mappingSelect: ae,
      applyMappingButton: Q,
      updateMappingButton: Pe,
      editCriteriaButton: at,
      removeMappingButton: ot,
      actionsMenu: te,
      state: F
    }), vs(
      a ?? r,
      F,
      X.selectedMapping
    ).then((x) => {
      x && (F = x);
    });
  });
  const nr = /* @__PURE__ */ c(async () => {
    var ee, ne, ue, de, lt, mn, ct, hn, pe, gn, pn, Dt, Kn, rr;
    const x = ae.value ?? "";
    if (!x) {
      (ne = (ee = ui.notifications) == null ? void 0 : ee.warn) == null || ne.call(
        ee,
        E(
          "EIDOLON.LightCriteria.SelectMappingWarning",
          "Choose a criteria mapping before applying."
        )
      ), $e(X.selectedMapping);
      return;
    }
    if (x === ve) {
      if (!(F != null && F.base)) {
        (de = (ue = ui.notifications) == null ? void 0 : ue.warn) == null || de.call(
          ue,
          E(
            "EIDOLON.LightCriteria.BaseUnavailable",
            "Set a base lighting state before applying it."
          )
        );
        return;
      }
      fa(v, Ae, A), La(t, n, F.base), F = await pr(a ?? r, {
        mappingId: ve,
        categories: null,
        updatedAt: Date.now()
      }), X.selectedMapping = ve, $e(X.selectedMapping), Jn(O, F), Xn({ switcher: M, emptyState: Je, state: F }), sr(A, {
        state: F,
        hasCategories: l.length > 0
      }), tu(n, {
        mappingId: ve,
        color: ((mn = (lt = F.base) == null ? void 0 : lt.config) == null ? void 0 : mn.color) ?? null
      }), (hn = (ct = ui.notifications) == null ? void 0 : ct.info) == null || hn.call(
        ct,
        E(
          "EIDOLON.LightCriteria.BaseApplied",
          "Applied the base lighting state to the form."
        )
      ), bt();
      return;
    }
    const G = Array.isArray(F == null ? void 0 : F.mappings) && F.mappings.length ? F.mappings.find((Ii) => (Ii == null ? void 0 : Ii.id) === x) : null;
    if (!G) {
      (gn = (pe = ui.notifications) == null ? void 0 : pe.warn) == null || gn.call(
        pe,
        E(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      ), X.selectedMapping = "", $e(X.selectedMapping);
      return;
    }
    fa(v, Ae, A), La(t, n, G.config), F = await pr(a ?? r, {
      mappingId: G.id,
      categories: G.categories,
      updatedAt: Date.now()
    }), X.selectedMapping = G.id, $e(X.selectedMapping), Jn(O, F), Xn({ switcher: M, emptyState: Je, state: F }), sr(A, {
      state: F,
      hasCategories: l.length > 0
    }), tu(n, {
      mappingId: G.id,
      color: ((Dt = (pn = G.config) == null ? void 0 : pn.config) == null ? void 0 : Dt.color) ?? null
    });
    const Z = Bi(G, u, d);
    (rr = (Kn = ui.notifications) == null ? void 0 : Kn.info) == null || rr.call(
      Kn,
      E(
        "EIDOLON.LightCriteria.MappingApplied",
        "Applied mapping: {label}"
      ).replace("{label}", Z)
    ), bt();
  }, "applySelectedMapping");
  Q.addEventListener("click", () => {
    nr();
  }), ae.addEventListener("keydown", (x) => {
    x.key === "Enter" && (x.preventDefault(), nr());
  });
  const ta = /* @__PURE__ */ c(async () => {
    var G, Z, ee, ne, ue, de, lt, mn, ct, hn, pe, gn, pn, Dt, Kn, rr, Ii, ia, Oc, ra, Ac;
    const x = X.selectedMapping;
    if (!x) {
      (Z = (G = ui.notifications) == null ? void 0 : G.warn) == null || Z.call(
        G,
        E(
          "EIDOLON.LightCriteria.SelectMappingWarning",
          "Choose a criteria mapping before applying."
        )
      );
      return;
    }
    Pe.disabled = !0;
    try {
      const Xe = Ta(t, a);
      if (x === ve)
        F = await zc(a ?? r, Xe), N("LightCriteria | Base lighting updated", {
          lightId: ((ee = a ?? r) == null ? void 0 : ee.id) ?? null,
          configColor: ((ne = Xe == null ? void 0 : Xe.config) == null ? void 0 : ne.color) ?? null
        }), (de = (ue = ui.notifications) == null ? void 0 : ue.info) == null || de.call(
          ue,
          E(
            "EIDOLON.LightCriteria.BaseUpdated",
            "Updated the base lighting state with the current configuration."
          )
        ), X.selectedMapping = ve;
      else {
        const Oi = yr(F, x);
        if (!Oi) {
          (mn = (lt = ui.notifications) == null ? void 0 : lt.warn) == null || mn.call(
            lt,
            E(
              "EIDOLON.LightCriteria.MappingUnavailable",
              "The selected criteria mapping is no longer available."
            )
          ), X.selectedMapping = "", $e(X.selectedMapping);
          return;
        }
        F = await Wc(
          a ?? r,
          Oi.categories,
          Xe,
          { label: Oi.label ?? null }
        ), N("LightCriteria | Mapping updated", {
          mappingId: x,
          hasColor: !!((ct = Xe == null ? void 0 : Xe.config) != null && ct.color),
          stored: Array.isArray(F == null ? void 0 : F.mappings) ? ((hn = F.mappings.find((rs) => (rs == null ? void 0 : rs.id) === x)) == null ? void 0 : hn.config) ?? null : null,
          persisted: (gn = (pe = a ?? r) == null ? void 0 : pe.getFlag) == null ? void 0 : gn.call(pe, yi, ji)
        });
        const ar = yr(F, x), ym = Bi(ar || Oi, u, d);
        N("LightCriteria | Mapping updated", {
          mappingId: x,
          categories: Oi.categories,
          updatedColor: ((pn = Xe == null ? void 0 : Xe.config) == null ? void 0 : pn.color) ?? null,
          storedColor: ((Kn = (Dt = ar == null ? void 0 : ar.config) == null ? void 0 : Dt.config) == null ? void 0 : Kn.color) ?? ((Ii = (rr = Oi.config) == null ? void 0 : rr.config) == null ? void 0 : Ii.color) ?? null
        }), (Oc = (ia = ui.notifications) == null ? void 0 : ia.info) == null || Oc.call(
          ia,
          E(
            "EIDOLON.LightCriteria.MappingUpdated",
            "Saved changes to mapping: {label}"
          ).replace("{label}", ym)
        ), X.selectedMapping = x;
      }
      Jn(O, F), Xn({ switcher: M, emptyState: Je, state: F }), sr(A, {
        state: F,
        hasCategories: l.length > 0
      }), $e(X.selectedMapping), bt();
    } catch (Xe) {
      console.error("eidolon-utilities | Failed to update light criteria mapping", Xe), (Ac = (ra = ui.notifications) == null ? void 0 : ra.error) == null || Ac.call(
        ra,
        E(
          "EIDOLON.LightCriteria.MappingUpdateError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      Pe.disabled = !1, bs({
        mappingSelect: ae,
        applyMappingButton: Q,
        updateMappingButton: Pe,
        editCriteriaButton: at,
        removeMappingButton: ot,
        actionsMenu: te,
        state: F
      });
    }
  }, "updateSelectedMapping");
  Pe.addEventListener("click", () => {
    ta();
  }), $e(X.selectedMapping), I.addEventListener("click", async () => {
    var x, G, Z, ee, ne, ue;
    I.disabled = !0;
    try {
      const de = Ta(t, a);
      F = await zc(a ?? r, de), N("LightCriteria | Base lighting stored", {
        lightId: ((x = a ?? r) == null ? void 0 : x.id) ?? null,
        configColor: ((G = de == null ? void 0 : de.config) == null ? void 0 : G.color) ?? null
      }), (ee = (Z = ui.notifications) == null ? void 0 : Z.info) == null || ee.call(
        Z,
        E(
          "EIDOLON.LightCriteria.BaseStored",
          "Saved the current configuration as the base lighting state."
        )
      ), Jn(O, F), Xn({ switcher: M, emptyState: Je, state: F }), sr(A, {
        state: F,
        hasCategories: l.length > 0
      }), X.selectedMapping = ve, $e(X.selectedMapping);
    } catch (de) {
      console.error("eidolon-utilities | Failed to store base light criteria state", de), (ue = (ne = ui.notifications) == null ? void 0 : ne.error) == null || ue.call(
        ne,
        E(
          "EIDOLON.LightCriteria.BaseError",
          "Failed to save the base lighting state. Check the console for details."
        )
      );
    } finally {
      I.disabled = !1;
    }
  }), A.addEventListener("click", () => {
    var G, Z, ee, ne;
    if (!(F != null && F.base)) {
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
      (ne = (ee = ui.notifications) == null ? void 0 : ee.warn) == null || ne.call(
        ee,
        E(
          "EIDOLON.LightCriteria.NoCategoriesAvailable",
          "Add scene criteria with values in the Scene configuration before creating mappings."
        )
      );
      return;
    }
    const x = Ca.get(v);
    eu({
      app: t,
      fieldset: v,
      createButton: A,
      creationSection: Ae,
      categoryList: Zt,
      form: n,
      persistedLight: a,
      stateEntry: x,
      mode: "create",
      mapping: null,
      preloadConfig: F.base
    });
  }), at.addEventListener("click", () => {
    var Z, ee, ne, ue;
    const x = X.selectedMapping;
    if (!x || x === ve) {
      (ee = (Z = ui.notifications) == null ? void 0 : Z.warn) == null || ee.call(
        Z,
        E(
          "EIDOLON.LightCriteria.SelectMappingForCriteriaEdit",
          "Select a mapping before editing criteria."
        )
      );
      return;
    }
    const G = yr(F, x);
    if (!G) {
      (ue = (ne = ui.notifications) == null ? void 0 : ne.warn) == null || ue.call(
        ne,
        E(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      );
      return;
    }
    bt(), ef(t, { fieldset: v, homeContainer: i }), eu({
      app: t,
      fieldset: v,
      createButton: A,
      creationSection: Ae,
      categoryList: Zt,
      form: n,
      persistedLight: a,
      stateEntry: X,
      mode: "retarget",
      mapping: G,
      preloadConfig: G.config
    });
  }), st.addEventListener("click", async () => {
    var G, Z, ee, ne, ue, de, lt, mn, ct, hn;
    const x = wp(Zt);
    if (!x) {
      (Z = (G = ui.notifications) == null ? void 0 : G.warn) == null || Z.call(
        G,
        E(
          "EIDOLON.LightCriteria.SelectionRequired",
          "Select at least one criteria value to identify the mapping."
        )
      );
      return;
    }
    st.disabled = !0;
    try {
      const pe = Ta(t, a);
      if (X.editorMode === "retarget" && X.editingMappingId) {
        const pn = vl(F, x);
        let Dt = !1;
        if (pn && pn !== X.editingMappingId && (Dt = await ep(), !Dt)) {
          st.disabled = !1;
          return;
        }
        F = await Hh(
          a ?? r,
          X.editingMappingId,
          x,
          pe,
          { replaceExisting: Dt }
        ), N("LightCriteria | Mapping criteria retargeted", {
          mappingId: X.editingMappingId,
          categories: x,
          replaced: Dt,
          configColor: ((ee = pe == null ? void 0 : pe.config) == null ? void 0 : ee.color) ?? null
        }), (ue = (ne = ui.notifications) == null ? void 0 : ne.info) == null || ue.call(
          ne,
          E(
            "EIDOLON.LightCriteria.MappingCriteriaUpdated",
            "Updated mapping criteria for the selected mapping."
          )
        );
      } else
        F = await Wc(
          a ?? r,
          x,
          pe,
          {}
        ), N("LightCriteria | Mapping saved from editor", {
          categories: x,
          configColor: ((de = pe == null ? void 0 : pe.config) == null ? void 0 : de.color) ?? null
        }), (mn = (lt = ui.notifications) == null ? void 0 : lt.info) == null || mn.call(
          lt,
          E(
            "EIDOLON.LightCriteria.MappingSaved",
            "Updated lighting mapping for the selected scene criteria."
          )
        );
      Jn(O, F), Xn({ switcher: M, emptyState: Je, state: F });
      const gn = vl(F, x);
      gn && (X.selectedMapping = gn), $e(X.selectedMapping), fa(v, Ae, A), bt();
    } catch (pe) {
      console.error("eidolon-utilities | Failed to persist light criteria mapping", pe), (hn = (ct = ui.notifications) == null ? void 0 : ct.error) == null || hn.call(
        ct,
        E(
          "EIDOLON.LightCriteria.MappingError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      st.disabled = !1;
    }
  }), en.addEventListener("click", () => {
    const x = Ca.get(v);
    x != null && x.restoreConfig && La(t, n, x.restoreConfig), fa(v, Ae, A);
  }), ot.addEventListener("click", async () => {
    var Z, ee;
    const x = X.selectedMapping;
    !x || x === ve || !await tp() || (F = await qh(a ?? r, x), X.selectedMapping = "", Jn(O, F), Xn({ switcher: M, emptyState: Je, state: F }), $e(X.selectedMapping), bt(), (ee = (Z = ui.notifications) == null ? void 0 : Z.info) == null || ee.call(
      Z,
      E("EIDOLON.LightCriteria.MappingRemoved", "Removed selected mapping.")
    ));
  });
}
c(Zg, "enhanceAmbientLightConfig");
function eu({
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
  s && (s.restoreConfig = Ta(t, o), s.editorMode = l, s.editingMappingId = l === "retarget" ? (u == null ? void 0 : u.id) ?? null : null), d && La(t, a, d), l === "retarget" && (u != null && u.categories) ? vp(r, u.categories) : bp(r);
  const h = i.querySelector("p.notes");
  h instanceof HTMLElement && (h.textContent = l === "retarget" ? E(
    "EIDOLON.LightCriteria.EditCriteriaDescription",
    "Adjust criteria values for the selected mapping."
  ) : E(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const f = i.querySelector('button[data-action="save-mapping"]');
  f instanceof HTMLButtonElement && (f.textContent = l === "retarget" ? E("EIDOLON.LightCriteria.SaveCriteriaChanges", "Save Criteria Changes") : E("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), i.hidden = !1, n.setAttribute("aria-expanded", "true"), uc(e, i), requestAnimationFrame(() => {
    var g;
    (g = t.setPosition) == null || g.call(t, { height: "auto" });
  });
}
c(eu, "openMappingEditor");
async function ep() {
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
c(ep, "confirmCriteriaConflict");
async function tp() {
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
c(tp, "confirmRemoveMapping");
function np(t, { fieldset: e, homeContainer: n }) {
  const i = ap(t, n);
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
    o.preventDefault(), ef(t, { fieldset: e, homeContainer: n });
  };
}
c(np, "ensureManagerHeaderButton");
function ef(t, { fieldset: e, homeContainer: n }) {
  var f, g, p;
  const i = da.get(t);
  if (i != null && i.rendered) {
    (f = i.bringToTop) == null || f.call(i);
    return;
  }
  const r = /* @__PURE__ */ c((...y) => {
    var w;
    const v = ip(y), b = (w = v == null ? void 0 : v.querySelector) == null ? void 0 : w.call(v, ".eidolon-light-criteria-manager-host");
    b instanceof HTMLElement && (rp(e), e.hidden = !1, b.appendChild(e));
  }, "onRender"), a = /* @__PURE__ */ c(() => {
    n instanceof HTMLElement && n.appendChild(e), e.hidden = !0, da.delete(t), requestAnimationFrame(() => {
      var y;
      (y = t.setPosition) == null || y.call(t, { height: "auto" });
    });
  }, "onClose"), o = E("EIDOLON.LightCriteria.ManagerTitle", "Scene Criteria Lighting"), s = '<div class="eidolon-light-criteria-manager-host"></div>', l = E("EIDOLON.LightCriteria.Close", "Close"), u = (p = (g = foundry == null ? void 0 : foundry.applications) == null ? void 0 : g.api) == null ? void 0 : p.DialogV2;
  if (typeof (u == null ? void 0 : u.wait) == "function")
    try {
      let y = !1;
      const v = /* @__PURE__ */ c(() => {
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
        render: /* @__PURE__ */ c((...b) => r(...b), "render"),
        close: v,
        rejectClose: !1
      }).catch((b) => {
        console.warn("eidolon-utilities | DialogV2 manager failed, falling back to Dialog", b), v();
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
c(ef, "openManagerDialog");
function ip(t) {
  for (const e of t) {
    const n = Kt(e);
    if (n) return n;
    const i = Kt(e == null ? void 0 : e.element);
    if (i) return i;
  }
  return null;
}
c(ip, "findDialogRoot");
function rp(t) {
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
  const h = document.createElement("div");
  h.classList.add("eidolon-light-criteria-manager__header"), h.textContent = E("EIDOLON.LightCriteria.ManagerAuthoring", "Create or Update Mapping"), u.appendChild(h), a && u.appendChild(a), t.innerHTML = "", e && t.appendChild(e), n && t.appendChild(n), t.appendChild(s), uc(t, a);
}
c(rp, "applyManagerLayout");
function ap(t, e) {
  var i;
  const n = Kt(t == null ? void 0 : t.element);
  return n || (((i = e == null ? void 0 : e.closest) == null ? void 0 : i.call(e, ".application")) ?? null);
}
c(ap, "resolveApplicationRoot");
function fa(t, e, n) {
  const i = Ca.get(t);
  i && (i.restoreConfig = null, i.editorMode = "create", i.editingMappingId = null), e.hidden = !0, n.setAttribute("aria-expanded", "false");
  const r = e.querySelector("p.notes");
  r instanceof HTMLElement && (r.textContent = E(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const a = e.querySelector('button[data-action="save-mapping"]');
  a instanceof HTMLButtonElement && (a.textContent = E("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), uc(t, e), requestAnimationFrame(() => {
    var o, s;
    (s = (o = i == null ? void 0 : i.app) == null ? void 0 : o.setPosition) == null || s.call(o, { height: "auto" });
  });
}
c(fa, "hideCreationSection");
function Jn(t, e) {
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
c(Jn, "updateStatusLine");
function sr(t, { state: e, hasCategories: n }) {
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
c(sr, "updateCreateButtonState");
function Ta(t, e) {
  var l, u, d;
  const n = e ?? tf(t);
  if (!n)
    throw new Error("Ambient light document unavailable.");
  const i = Si(((l = n.toObject) == null ? void 0 : l.call(n)) ?? {});
  if (!i)
    throw new Error("Unable to duplicate ambient light data.");
  const r = (t == null ? void 0 : t.form) instanceof HTMLFormElement ? t.form : null, a = r ? Vm(r) : {}, o = foundry.utils.mergeObject(i, a, {
    inplace: !1,
    performDeletions: !0
  });
  r && (r.querySelectorAll("color-picker[name]").forEach((h) => {
    var b, w;
    const f = h.getAttribute("name");
    if (!f) return;
    const g = typeof h.value == "string" ? h.value : "", p = ((b = h.ui) == null ? void 0 : b.input) ?? ((w = h.querySelector) == null ? void 0 : w.call(h, 'input[type="color"]')), y = (p == null ? void 0 : p.value) ?? "", v = g || y;
    typeof v != "string" || !v || (foundry.utils.setProperty(o, f, v), N("LightCriteria | Captured color-picker value", {
      path: f,
      pickerValue: g,
      swatchValue: y,
      chosenValue: v
    }));
  }), r.querySelectorAll("range-picker[name]").forEach((h) => {
    var A, O;
    const f = h.getAttribute("name");
    if (!f) return;
    const g = h.value !== void 0 && h.value !== null ? String(h.value) : "", p = (A = h.querySelector) == null ? void 0 : A.call(h, 'input[type="range"]'), y = (O = h.querySelector) == null ? void 0 : O.call(h, 'input[type="number"]'), v = p instanceof HTMLInputElement ? p.value : "", b = y instanceof HTMLInputElement ? y.value : "", w = g || b || v;
    if (typeof w != "string" || !w.length) return;
    const C = Number(w), I = Number.isFinite(C) ? C : w;
    foundry.utils.setProperty(o, f, I), N("LightCriteria | Captured range-picker value", {
      path: f,
      elementValue: g,
      numberValue: b,
      rangeValue: v,
      chosenValue: I
    });
  }));
  const s = Si(o);
  return N("LightCriteria | Captured form config", {
    lightId: (n == null ? void 0 : n.id) ?? null,
    hasColor: !!((u = s == null ? void 0 : s.config) != null && u.color),
    color: ((d = s == null ? void 0 : s.config) == null ? void 0 : d.color) ?? null
  }), s;
}
c(Ta, "captureAmbientLightFormConfig");
function La(t, e, n) {
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
        s instanceof HTMLElement && s.tagName === "COLOR-PICKER" ? sp(s, a) : s instanceof HTMLElement && s.tagName === "RANGE-PICKER" ? lp(s, a) : s instanceof HTMLInputElement ? op(s, a) : s instanceof HTMLSelectElement ? cp(s, a) : s instanceof HTMLTextAreaElement && up(s, a);
    }
  }
  requestAnimationFrame(() => {
    var r;
    return (r = t._previewChanges) == null ? void 0 : r.call(t);
  });
}
c(La, "applyConfigToForm");
function op(t, e, n) {
  const i = t.type;
  if (i === "checkbox") {
    const o = !!e;
    t.checked !== o && (t.checked = o, _t(t));
    return;
  }
  if (i === "radio") {
    const o = e == null ? "" : String(e), s = t.value === o;
    t.checked !== s && (t.checked = s, s && _t(t));
    return;
  }
  const r = e == null ? "" : String(e);
  let a = !1;
  t.value !== r && (t.value = r, a = !0), a && _t(t);
}
c(op, "applyValueToInput");
function sp(t, e, n) {
  var s, l, u, d, h, f;
  const i = e == null ? "" : String(e);
  let r = !1;
  t.value !== i && (t.value = i, t.setAttribute("value", i), (s = t.ui) != null && s.setValue && t.ui.setValue(i), r = !0);
  const a = ((l = t.ui) == null ? void 0 : l.input) ?? ((u = t.querySelector) == null ? void 0 : u.call(t, 'input[type="color"]'));
  a instanceof HTMLInputElement && a.value !== i && (a.value = i, _t(a));
  const o = ((d = t.ui) == null ? void 0 : d.text) ?? ((h = t.querySelector) == null ? void 0 : h.call(t, 'input[type="text"]'));
  o instanceof HTMLInputElement && o.value !== i && (o.value = i, _t(o)), (f = t.ui) != null && f.commit ? t.ui.commit() : (t.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), t.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }))), N("LightCriteria | Color picker applied", {
    value: i,
    pickerValue: t.value ?? null,
    swatchValue: (a == null ? void 0 : a.value) ?? null,
    textValue: (o == null ? void 0 : o.value) ?? null
  }), r && _t(t);
}
c(sp, "applyValueToColorPicker");
function lp(t, e, n) {
  var u, d;
  const i = e == null ? "" : String(e), r = Number(i), a = Number.isFinite(r) ? r : i;
  let o = !1;
  t.value !== void 0 && t.value !== a && (t.value = a, o = !0), t.getAttribute("value") !== i && (t.setAttribute("value", i), o = !0);
  const s = (u = t.querySelector) == null ? void 0 : u.call(t, 'input[type="range"]');
  s instanceof HTMLInputElement && s.value !== i && (s.value = i, _t(s));
  const l = (d = t.querySelector) == null ? void 0 : d.call(t, 'input[type="number"]');
  if (l instanceof HTMLInputElement && l.value !== i && (l.value = i, _t(l)), typeof t.commit == "function")
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
  }), o && _t(t);
}
c(lp, "applyValueToRangePicker");
function cp(t, e, n) {
  const i = e == null ? "" : String(e);
  t.value !== i && (t.value = i, _t(t));
}
c(cp, "applyValueToSelect");
function up(t, e, n) {
  const i = e == null ? "" : String(e);
  t.value !== i && (t.value = i, _t(t));
}
c(up, "applyValueToTextarea");
function _t(t) {
  t.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), t.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }));
}
c(_t, "triggerInputChange");
function bs({
  mappingSelect: t,
  applyMappingButton: e,
  updateMappingButton: n,
  editCriteriaButton: i,
  removeMappingButton: r,
  actionsMenu: a,
  state: o
}) {
  const s = (t == null ? void 0 : t.value) ?? "", l = !!(o != null && o.base), u = s && s !== ve ? !!yr(o, s) : !1;
  if (e instanceof HTMLButtonElement && (s ? s === ve ? e.disabled = !l : e.disabled = !u : e.disabled = !0), n instanceof HTMLButtonElement && (s ? s === ve ? n.disabled = !1 : n.disabled = !u : n.disabled = !0), i instanceof HTMLButtonElement && (i.disabled = !s || s === ve || !u), r instanceof HTMLButtonElement && (r.disabled = !s || s === ve || !u), a instanceof HTMLElement) {
    const d = n instanceof HTMLButtonElement && !n.disabled || i instanceof HTMLButtonElement && !i.disabled || r instanceof HTMLButtonElement && !r.disabled;
    a.classList.toggle("is-disabled", !d), !d && "open" in a && (a.open = !1);
  }
}
c(bs, "syncMappingSwitcherState");
function dp(t) {
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
c(dp, "buildCategoryNameLookup");
function fp(t) {
  const e = {};
  return t instanceof HTMLElement && t.querySelectorAll("select[data-filter-category-id]").forEach((n) => {
    var a, o;
    const i = n.dataset.filterCategoryId, r = (o = (a = n.value) == null ? void 0 : a.trim) == null ? void 0 : o.call(a);
    !i || !r || (e[i] = r);
  }), e;
}
c(fp, "readMappingFilterSelections");
function mp(t) {
  t instanceof HTMLElement && t.querySelectorAll("select[data-filter-category-id]").forEach((e) => {
    e.value = "";
  });
}
c(mp, "resetMappingFilterSelections");
function hp(t, e) {
  const n = Array.isArray(t) ? t : [], i = Object.entries(e ?? {}).filter(([, r]) => !!r);
  return i.length ? n.filter((r) => {
    if (!r || typeof r != "object") return !1;
    const a = r.categories ?? {};
    for (const [o, s] of i)
      if ((a == null ? void 0 : a[o]) !== s) return !1;
    return !0;
  }) : n.slice();
}
c(hp, "filterMappingsByCriteria");
function gp(t, { totalCount: e = 0, visibleCount: n = 0, hasFilters: i = !1, activeFilterCount: r = 0 } = {}) {
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
c(gp, "updateMappingFilterMeta");
function pp(t, e, n, i, r = {}) {
  if (!(t instanceof HTMLSelectElement)) return;
  const a = typeof i == "string" ? i : "", o = !!(e != null && e.base), s = Array.isArray(r == null ? void 0 : r.categoryOrder) ? r.categoryOrder : [], l = Array.isArray(r == null ? void 0 : r.mappings) ? r.mappings.slice() : Array.isArray(e == null ? void 0 : e.mappings) ? e.mappings.slice() : [], u = t.value;
  t.innerHTML = "";
  const d = document.createElement("option");
  d.value = "", d.textContent = E(
    "EIDOLON.LightCriteria.SelectPlaceholder",
    "Select a mapping"
  ), d.disabled = o, t.appendChild(d);
  const h = document.createElement("option");
  h.value = ve, h.textContent = E(
    "EIDOLON.LightCriteria.BaseOption",
    "Base Lighting"
  ), h.disabled = !o, t.appendChild(h), l.slice().sort((y, v) => {
    var C;
    const b = Bi(y, n, s), w = Bi(v, n, s);
    return b.localeCompare(w, ((C = game.i18n) == null ? void 0 : C.lang) ?? void 0, {
      sensitivity: "base"
    });
  }).forEach((y) => {
    if (!(y != null && y.id)) return;
    const v = document.createElement("option");
    v.value = y.id, v.textContent = Bi(y, n, s), t.appendChild(v);
  });
  const f = new Set(
    Array.from(t.options).filter((y) => !y.disabled).map((y) => y.value)
  ), g = o && u === "" ? "" : u, p = a || (f.has(g) ? g : "");
  p && f.has(p) ? t.value = p : o ? t.value = ve : t.value = "";
}
c(pp, "populateMappingSelector");
function Bi(t, e, n = []) {
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
c(Bi, "formatMappingOptionLabel");
function vl(t, e) {
  if (!t || typeof t != "object" || !Array.isArray(t.mappings)) return null;
  const n = er(e);
  if (!n) return null;
  const i = t.mappings.find((r) => (r == null ? void 0 : r.key) === n);
  return (i == null ? void 0 : i.id) ?? null;
}
c(vl, "findMappingIdByCategories");
function yr(t, e) {
  return !e || !t || typeof t != "object" || !Array.isArray(t.mappings) ? null : t.mappings.find((n) => (n == null ? void 0 : n.id) === e) ?? null;
}
c(yr, "getMappingById");
function yp(t) {
  if (!t || typeof t != "object") return "";
  const e = t.current;
  if (e != null && e.mappingId) {
    if (e.mappingId === ve)
      return t != null && t.base ? ve : "";
    if (Array.isArray(t.mappings) && t.mappings.some((n) => n.id === e.mappingId))
      return e.mappingId;
  }
  if (e != null && e.categories) {
    const n = vl(t, e.categories);
    if (n) return n;
  }
  return "";
}
c(yp, "resolveInitialMappingSelection");
function tu(t, e = {}) {
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
c(tu, "logAppliedColorState");
function bp(t) {
  t.querySelectorAll("select[data-category-id]").forEach((e) => {
    e.value = "";
  });
}
c(bp, "resetCategorySelections");
function vp(t, e) {
  const n = e && typeof e == "object" ? e : {};
  t.querySelectorAll("select[data-category-id]").forEach((i) => {
    const r = i.dataset.categoryId;
    if (!r) return;
    const a = n[r];
    i.value = typeof a == "string" ? a : "";
  });
}
c(vp, "setCategorySelections");
function wp(t) {
  const e = {};
  return t.querySelectorAll("select[data-category-id]").forEach((n) => {
    var a, o;
    const i = n.dataset.categoryId, r = (o = (a = n.value) == null ? void 0 : a.trim) == null ? void 0 : o.call(a);
    !i || !r || (e[i] = r);
  }), Object.keys(e).length > 0 ? e : null;
}
c(wp, "readCategorySelections");
async function vs(t, e, n) {
  if (!t) return null;
  try {
    if (!n)
      return await pr(t, {});
    if (n === ve)
      return await pr(t, {
        mappingId: ve,
        categories: null,
        updatedAt: Date.now()
      });
    const i = yr(e, n);
    return i ? await pr(t, {
      mappingId: i.id,
      categories: i.categories,
      updatedAt: Date.now()
    }) : null;
  } catch (i) {
    return console.warn("eidolon-utilities | Failed to persist mapping selection", i), null;
  }
}
c(vs, "persistCurrentSelection");
function uc(t, e) {
  if (!(t instanceof HTMLElement)) return;
  const n = t.querySelector(".eidolon-light-criteria-manager__section.is-bottom");
  n instanceof HTMLElement && (n.hidden = !!(e != null && e.hidden));
}
c(uc, "updateManagerSectionVisibility");
function Xn({ switcher: t, emptyState: e, state: n }) {
  const i = !!(n != null && n.base);
  t instanceof HTMLElement && (t.hidden = !i), e instanceof HTMLElement && (e.hidden = i);
}
c(Xn, "updateActiveMappingVisibility");
function tf(t) {
  const e = (t == null ? void 0 : t.object) ?? (t == null ? void 0 : t.document) ?? null;
  return !(e != null && e.isEmbedded) || e.documentName !== "AmbientLight" ? null : e;
}
c(tf, "getAmbientLightDocument");
function Ep(t) {
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
c(Ep, "getPersistedAmbientLightDocument");
function Sp() {
  Xg();
}
c(Sp, "registerLightCriteriaHooks");
Sp();
const wl = /* @__PURE__ */ new Map();
let El = !1;
function dc(t, e) {
  wl.has(t) && console.warn(`[${T}] Socket handler for type "${t}" already registered, overwriting.`), wl.set(t, e);
}
c(dc, "registerSocketHandler");
function Ia(t, e) {
  if (!El) {
    console.error(`[${T}] Socket not initialized. Call initializeSocket() first.`);
    return;
  }
  game.socket.emit(`module.${T}`, { type: t, payload: e });
}
c(Ia, "emitSocket");
function Cp() {
  El || (game.socket.on(`module.${T}`, (t) => {
    const { type: e, payload: n } = t ?? {}, i = wl.get(e);
    i ? i(n) : console.warn(`[${T}] No socket handler for type "${e}"`);
  }), El = !0, console.log(`[${T}] Socket initialized on channel module.${T}`));
}
c(Cp, "initializeSocket");
const nf = "tween", rf = "tween-sequence", Sl = "tween-sequence-cancel", Ie = Object.freeze({
  ABORT: "abort",
  CONTINUE: "continue"
}), yn = Object.freeze({
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  FAILED: "failed"
}), vt = Object.freeze({
  BEFORE_ALL: "beforeAll",
  BEFORE_STEP: "before",
  ENTRY: "entry",
  AFTER_STEP: "after",
  RUNTIME: "runtime",
  VALIDATION: "validation",
  AWAIT: "await",
  EMIT: "emit",
  PARALLEL: "parallel"
}), Ka = /* @__PURE__ */ new Map();
function Ft({ type: t, execute: e, validate: n }) {
  Ka.has(t) && console.warn(`[tween-registry] Type "${t}" already registered, overwriting.`), Ka.set(t, { type: t, execute: e, validate: n ?? (() => {
  }) });
}
c(Ft, "registerTweenType");
function tr(t) {
  return Ka.get(t);
}
c(tr, "getTweenType");
function Tp(t, e = {}) {
  const n = tr(t);
  if (!n)
    throw new Error(`Unknown tween type: "${t}".`);
  return n.validate(e ?? {}), n;
}
c(Tp, "validateTweenEntry");
function Cl() {
  return [...Ka.keys()];
}
c(Cl, "listTweenTypes");
const Ui = {
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
  easeInBounce: /* @__PURE__ */ c((t) => 1 - Ui.easeOutBounce(1 - t), "easeInBounce"),
  easeInOutBounce: /* @__PURE__ */ c((t) => t < 0.5 ? (1 - Ui.easeOutBounce(1 - 2 * t)) / 2 : (1 + Ui.easeOutBounce(2 * t - 1)) / 2, "easeInOutBounce"),
  easeInElastic: /* @__PURE__ */ c((t) => t === 0 || t === 1 ? t : -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI), "easeInElastic"),
  easeOutElastic: /* @__PURE__ */ c((t) => t === 0 || t === 1 ? t : Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1, "easeOutElastic")
};
function rt(t) {
  if (t && Ui[t])
    return Ui[t];
  const e = foundry.canvas.animation.CanvasAnimation;
  return {
    linear: e.easeLinear,
    easeInOutCosine: e.easeInOutCosine
  }[t] ?? e.easeInOutCosine;
}
c(rt, "resolveEasing");
function fc() {
  return ["linear", "easeInOutCosine", ...Object.keys(Ui)];
}
c(fc, "listEasingNames");
function Ja(t) {
  return t <= 0.04045 ? t / 12.92 : ((t + 0.055) / 1.055) ** 2.4;
}
c(Ja, "srgbToLinear");
function Vi(t) {
  return t <= 31308e-7 ? 12.92 * t : 1.055 * t ** (1 / 2.4) - 0.055;
}
c(Vi, "linearToSrgb");
function nu(t, e, n) {
  const i = 0.4122214708 * t + 0.5363325363 * e + 0.0514459929 * n, r = 0.2119034982 * t + 0.6806995451 * e + 0.1073969566 * n, a = 0.0883024619 * t + 0.2817188376 * e + 0.6299787005 * n, o = Math.cbrt(i), s = Math.cbrt(r), l = Math.cbrt(a);
  return [
    0.2104542553 * o + 0.793617785 * s - 0.0040720468 * l,
    1.9779984951 * o - 2.428592205 * s + 0.4505937099 * l,
    0.0259040371 * o + 0.7827717662 * s - 0.808675766 * l
  ];
}
c(nu, "linearRgbToOklab");
function Lp(t, e, n) {
  const i = (t + 0.3963377774 * e + 0.2158037573 * n) ** 3, r = (t - 0.1055613458 * e - 0.0638541728 * n) ** 3, a = (t - 0.0894841775 * e - 1.291485548 * n) ** 3;
  return [
    4.0767416621 * i - 3.3077115913 * r + 0.2309699292 * a,
    -1.2684380046 * i + 2.6097574011 * r - 0.3413193965 * a,
    -0.0041960863 * i - 0.7034186147 * r + 1.707614701 * a
  ];
}
c(Lp, "oklabToLinearRgb");
function Xa(t) {
  return [t.r, t.g, t.b];
}
c(Xa, "colorToRgb");
function af(t, e, n) {
  const i = /* @__PURE__ */ c((a) => Math.max(0, Math.min(1, a)), "clamp"), r = /* @__PURE__ */ c((a) => Math.round(i(a) * 255).toString(16).padStart(2, "0"), "toHex");
  return `#${r(t)}${r(e)}${r(n)}`;
}
c(af, "rgbToHex");
function Ip(t, e, n) {
  if (n <= 0) return t.toHTML();
  if (n >= 1) return e.toHTML();
  const i = foundry.utils.Color, [r, a, o] = t.hsl, [s, l, u] = e.hsl, d = (s - r + 0.5) % 1 - 0.5, h = (r + d * n + 1) % 1, f = a + (l - a) * n, g = o + (u - o) * n;
  return i.fromHSL([h, f, g]).toHTML();
}
c(Ip, "interpolateHsl");
function Op(t, e, n) {
  if (n <= 0) return t.toHTML();
  if (n >= 1) return e.toHTML();
  const [i, r, a] = Xa(t).map(Ja), [o, s, l] = Xa(e).map(Ja), u = Vi(i + (o - i) * n), d = Vi(r + (s - r) * n), h = Vi(a + (l - a) * n);
  return af(u, d, h);
}
c(Op, "interpolateRgb");
function Ap(t, e, n) {
  if (n <= 0) return t.toHTML();
  if (n >= 1) return e.toHTML();
  const [i, r, a] = Xa(t).map(Ja), [o, s, l] = Xa(e).map(Ja), [u, d, h] = nu(i, r, a), [f, g, p] = nu(o, s, l), y = 0.02, v = Math.sqrt(d * d + h * h), b = Math.sqrt(g * g + p * p);
  let w, C, I;
  if (v < y || b < y)
    w = u + (f - u) * n, C = d + (g - d) * n, I = h + (p - h) * n;
  else {
    const _ = Math.atan2(h, d);
    let D = Math.atan2(p, g) - _;
    D > Math.PI && (D -= 2 * Math.PI), D < -Math.PI && (D += 2 * Math.PI), w = u + (f - u) * n;
    const P = v + (b - v) * n, $ = _ + D * n;
    C = P * Math.cos($), I = P * Math.sin($);
  }
  const [A, O, M] = Lp(w, C, I);
  return af(Vi(A), Vi(O), Vi(M));
}
c(Ap, "interpolateOklch");
const Tl = {
  hsl: Ip,
  rgb: Op,
  oklch: Ap
};
function mc(t = "hsl") {
  return Tl[t] ?? Tl.hsl;
}
c(mc, "getInterpolator");
function Ji() {
  return Object.keys(Tl);
}
c(Ji, "listInterpolationModes");
function kp(t) {
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
  if (t.mode && !Ji().includes(t.mode))
    throw new Error(
      `light-color tween: unknown mode "${t.mode}". Available: ${Ji().join(", ")}`
    );
}
c(kp, "validate$7");
async function Mp(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { Color: i } = foundry.utils, { uuid: r, toColor: a, toAlpha: o, mode: s = "oklch" } = t, l = Array.isArray(r) ? r : [r];
  if (l.length === 0)
    return console.warn("light-color tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: u = 2e3,
    easing: d = "easeInOutCosine",
    commit: h = !0,
    startEpochMS: f = null,
    signal: g = null
  } = e, p = rt(d), y = a != null, v = o != null, b = y ? mc(s) : null, w = y ? i.fromString(a) : null;
  if (y && !w.valid) throw new Error(`light-color tween: invalid target color "${a}".`);
  async function C(A) {
    var W, H;
    if (g != null && g.aborted) return !1;
    const O = await fromUuid(A);
    if (!O) return !1;
    const M = O.object;
    if (!M) return !1;
    let _;
    if (y) {
      const U = (W = O.config) == null ? void 0 : W.color;
      U != null && U.valid || console.warn(`light-color tween: source color invalid on ${A}, using white.`), _ = U != null && U.valid ? U : i.fromString("#ffffff");
    }
    const j = v ? ((H = O._source.config) == null ? void 0 : H.alpha) ?? 0.5 : null, D = { t: 0 }, P = `ambient-hue-tween:${A}`;
    n.terminateAnimation(P), g && g.addEventListener("abort", () => {
      n.terminateAnimation(P);
    }, { once: !0 });
    const $ = typeof f == "number" ? Math.max(0, Math.min(u, Date.now() - f)) : 0, R = /* @__PURE__ */ c((U) => {
      const K = {};
      y && (K.color = b(_, w, U)), v && (K.alpha = j + (o - j) * U), O.updateSource({ config: K }), M.initializeLightSource();
    }, "applyFrame");
    $ > 0 && (D.t = $ / u, R(D.t));
    const B = await n.animate(
      [{ parent: D, attribute: "t", to: 1 }],
      {
        name: P,
        duration: u,
        easing: p,
        time: $,
        ontick: /* @__PURE__ */ c(() => R(D.t), "ontick")
      }
    );
    if (B !== !1) {
      if (g != null && g.aborted) return !1;
      const U = {};
      y && (U.color = w.toHTML()), v && (U.alpha = o), O.updateSource({ config: U }), M.initializeLightSource();
    }
    if (h && B !== !1 && O.canUserModify(game.user, "update")) {
      if (g != null && g.aborted) return !1;
      const U = {}, K = {};
      y && (U.color = _.toHTML(), K["config.color"] = w.toHTML()), v && (U.alpha = j, K["config.alpha"] = o), O.updateSource({ config: U }), await O.update(K);
    }
    return B !== !1;
  }
  return c(C, "animateOne"), (await Promise.all(l.map(C))).every(Boolean);
}
c(Mp, "execute$7");
function Np() {
  Ft({ type: "light-color", execute: Mp, validate: kp });
}
c(Np, "registerLightColorTween");
const bn = /* @__PURE__ */ new WeakMap();
function $p(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("light-state tween: 'uuid' is required (string or array of AmbientLight document UUIDs).");
  if (typeof t.enabled != "boolean")
    throw new Error("light-state tween: 'enabled' (boolean) is required.");
}
c($p, "validate$6");
async function xp(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, enabled: r } = t, a = Array.isArray(i) ? i : [i];
  if (a.length === 0)
    return console.warn("light-state tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: o = 2e3,
    easing: s = "easeInOutCosine",
    commit: l = !0,
    startEpochMS: u = null,
    signal: d = null
  } = e, h = rt(s);
  async function f(p) {
    var O, M, _, j;
    if (d != null && d.aborted) return !1;
    const y = await fromUuid(p);
    if (!y) return !1;
    const v = y.object;
    if (!v) return !1;
    const b = `ambient-state-tween:${p}`;
    n.terminateAnimation(b), d && d.addEventListener("abort", () => {
      n.terminateAnimation(b);
    }, { once: !0 });
    const w = bn.get(y) ?? {
      hidden: y._source.hidden,
      alpha: ((O = y._source.config) == null ? void 0 : O.alpha) ?? 0.5
    };
    if (bn.set(y, w), N(`light-state START ${r ? "ON" : "OFF"} | snap: ${JSON.stringify(w)} | _source.hidden=${y._source.hidden}, _source.config.alpha=${(M = y._source.config) == null ? void 0 : M.alpha}`), r && !w.hidden || !r && w.hidden)
      return bn.delete(y), !0;
    const C = w.alpha, I = typeof u == "number" ? Math.max(0, Math.min(o, Date.now() - u)) : 0, A = /* @__PURE__ */ c((D) => {
      y.updateSource({ config: { alpha: D } }), v.initializeLightSource();
    }, "applyAlpha");
    if (r) {
      y.updateSource({ hidden: !1, config: { alpha: 0 } }), v.initializeLightSource(), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
      const D = { t: 0 };
      I > 0 && (D.t = I / o, A(C * D.t));
      const P = await n.animate(
        [{ parent: D, attribute: "t", to: 1 }],
        {
          name: b,
          duration: o,
          easing: h,
          time: I,
          ontick: /* @__PURE__ */ c(() => A(C * D.t), "ontick")
        }
      );
      return P !== !1 && !(d != null && d.aborted) && l && y.canUserModify(game.user, "update") ? (y.updateSource({ hidden: !0, config: { alpha: C } }), await y.update({ hidden: !1 }), N(`light-state FADE-IN committed. _source.hidden=${y._source.hidden}, _source.config.alpha=${(_ = y._source.config) == null ? void 0 : _.alpha}`), bn.delete(y)) : P === !1 || bn.delete(y), P !== !1;
    } else {
      y.updateSource({ hidden: !1, config: { alpha: w.alpha } }), v.initializeLightSource();
      const D = { t: 0 };
      I > 0 && (D.t = I / o, A(C * (1 - D.t)));
      const P = await n.animate(
        [{ parent: D, attribute: "t", to: 1 }],
        {
          name: b,
          duration: o,
          easing: h,
          time: I,
          ontick: /* @__PURE__ */ c(() => A(C * (1 - D.t)), "ontick")
        }
      );
      return P !== !1 && !(d != null && d.aborted) && l && y.canUserModify(game.user, "update") ? (await y.update({ hidden: !0 }), y.updateSource({ config: { alpha: C } }), v.initializeLightSource(), N(`light-state FADE-OUT committed+restored. _source.hidden=${y._source.hidden}, _source.config.alpha=${(j = y._source.config) == null ? void 0 : j.alpha}`), bn.delete(y)) : P === !1 || (y.updateSource({ hidden: !0, config: { alpha: C } }), v.initializeLightSource(), bn.delete(y)), P !== !1;
    }
  }
  return c(f, "animateOne"), (await Promise.all(a.map(f))).every(Boolean);
}
c(xp, "execute$6");
function _p() {
  Ft({ type: "light-state", execute: xp, validate: $p });
}
c(_p, "registerLightStateTween");
function Jo(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("tile-prop tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (!t.attribute || typeof t.attribute != "string")
    throw new Error("tile-prop tween: 'attribute' (string) is required — dot-path to a numeric property (e.g. 'alpha', 'rotation').");
  if (typeof t.value != "number")
    throw new Error("tile-prop tween: 'value' (number) is required — the target value to animate to.");
}
c(Jo, "validate$5");
async function Xo(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, attribute: r, value: a } = t, o = Array.isArray(i) ? i : [i];
  if (o.length === 0)
    return console.warn("tile-prop tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: s = 2e3,
    easing: l = "easeInOutCosine",
    commit: u = !0,
    startEpochMS: d = null,
    signal: h = null
  } = e, f = rt(l);
  async function g(y) {
    if (h != null && h.aborted) return !1;
    const v = await fromUuid(y);
    if (!v) return !1;
    const b = v.object;
    if (!b) return !1;
    const w = foundry.utils.getProperty(v._source, r);
    if (typeof w != "number")
      return console.warn(`tile-prop tween: source value at '${r}' on ${y} is not a number (got ${typeof w}). Skipping.`), !1;
    const C = `tile-prop-tween:${r}:${y}`;
    n.terminateAnimation(C), h && h.addEventListener("abort", () => {
      n.terminateAnimation(C);
    }, { once: !0 });
    const I = typeof d == "number" ? Math.max(0, Math.min(s, Date.now() - d)) : 0, A = /* @__PURE__ */ c((_) => {
      const j = w + (a - w) * _;
      v.updateSource(foundry.utils.expandObject({ [r]: j })), b.refresh();
    }, "applyFrame"), O = { t: 0 };
    I > 0 && (O.t = I / s, A(O.t));
    const M = await n.animate(
      [{ parent: O, attribute: "t", to: 1 }],
      {
        name: C,
        duration: s,
        easing: f,
        time: I,
        ontick: /* @__PURE__ */ c(() => A(O.t), "ontick")
      }
    );
    if (M !== !1) {
      if (h != null && h.aborted) return !1;
      v.updateSource(foundry.utils.expandObject({ [r]: a })), b.refresh();
    }
    if (u && M !== !1 && v.canUserModify(game.user, "update")) {
      if (h != null && h.aborted) return !1;
      v.updateSource(foundry.utils.expandObject({ [r]: w })), await v.update({ [r]: a });
    }
    return M !== !1;
  }
  return c(g, "animateOne"), (await Promise.all(o.map(g))).every(Boolean);
}
c(Xo, "execute$5");
function Fp() {
  Ft({ type: "tile-prop", execute: Xo, validate: Jo });
}
c(Fp, "registerTilePropTween");
function Dp(t) {
  if (!t.attribute || typeof t.attribute != "string")
    throw new Error("particles-prop tween: 'attribute' (string) is required — property name on canvas.particleeffects (e.g. 'alpha').");
  if (typeof t.value != "number")
    throw new Error("particles-prop tween: 'value' (number) is required — the target value to animate to.");
}
c(Dp, "validate$4");
async function Pp(t, e = {}) {
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
  const h = rt(o), f = `particles-prop-tween:${i}`;
  n.terminateAnimation(f), l && l.addEventListener("abort", () => {
    n.terminateAnimation(f);
  }, { once: !0 });
  const g = typeof s == "number" ? Math.max(0, Math.min(a, Date.now() - s)) : 0, p = /* @__PURE__ */ c((b) => {
    u[i] = d + (r - d) * b;
  }, "applyFrame"), y = { t: 0 };
  g > 0 && (y.t = g / a, p(y.t));
  const v = await n.animate(
    [{ parent: y, attribute: "t", to: 1 }],
    {
      name: f,
      duration: a,
      easing: h,
      time: g,
      ontick: /* @__PURE__ */ c(() => p(y.t), "ontick")
    }
  );
  if (v !== !1) {
    if (l != null && l.aborted) return !1;
    u[i] = r;
  }
  return v !== !1;
}
c(Pp, "execute$4");
function Rp() {
  Ft({ type: "particles-prop", execute: Pp, validate: Dp });
}
c(Rp, "registerParticlesPropTween");
var Ln, _r, Fr, Dr, Pr, Rr, zi;
const Cc = class Cc {
  /**
   * @param {AbortController} controller
   */
  constructor(e) {
    k(this, Ln);
    k(this, _r);
    k(this, Fr);
    k(this, Dr);
    k(this, Pr);
    k(this, Rr, !1);
    k(this, zi, null);
    L(this, Ln, e), L(this, Dr, new Promise((n) => {
      L(this, _r, n);
    })), L(this, Pr, new Promise((n) => {
      L(this, Fr, n);
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
    return m(this, Ln).signal.aborted;
  }
  /** @returns {AbortSignal} */
  get signal() {
    return m(this, Ln).signal;
  }
  /** @returns {string} */
  get status() {
    return m(this, zi) ? m(this, zi).status : this.cancelled ? "cancelled" : "running";
  }
  /** Abort the timeline, triggering onCancel callbacks. */
  cancel(e = "cancelled") {
    m(this, Ln).signal.aborted || m(this, Ln).abort(e);
  }
  /**
   * Called internally by the execution engine when the timeline finishes.
   * @param {boolean} completed - true if all steps ran, false if cancelled
   */
  _resolve(e) {
    if (m(this, Rr)) return;
    L(this, Rr, !0);
    const n = typeof e == "boolean" ? { status: e ? "completed" : "cancelled" } : e ?? { status: "cancelled" };
    L(this, zi, n), m(this, _r).call(this, n.status === "completed"), m(this, Fr).call(this, n);
  }
};
Ln = new WeakMap(), _r = new WeakMap(), Fr = new WeakMap(), Dr = new WeakMap(), Pr = new WeakMap(), Rr = new WeakMap(), zi = new WeakMap(), c(Cc, "TimelineHandle");
let Ll = Cc;
var di, Wi, fi;
const Tc = class Tc {
  constructor() {
    /** @type {Map<string, Set<Function>>} */
    k(this, di, /* @__PURE__ */ new Map());
    /** @type {Set<string>} Signals that have been emitted (sticky) */
    k(this, Wi, /* @__PURE__ */ new Set());
    k(this, fi, !1);
  }
  /**
   * Subscribe to a named signal.
   * @param {string} signal
   * @param {Function} listener
   * @returns {() => void} Unsubscribe function
   */
  on(e, n) {
    if (m(this, fi)) return () => {
    };
    let i = m(this, di).get(e);
    return i || (i = /* @__PURE__ */ new Set(), m(this, di).set(e, i)), i.add(n), () => i.delete(n);
  }
  /**
   * Fire a named signal synchronously. All registered listeners are invoked.
   * The signal is recorded so that future waitFor() calls resolve immediately.
   * @param {string} signal
   */
  emit(e) {
    if (m(this, fi)) return;
    m(this, Wi).add(e);
    const n = m(this, di).get(e);
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
    return m(this, fi) ? Promise.reject(new Error("EventBus destroyed")) : m(this, Wi).has(e) ? Promise.resolve() : new Promise((i, r) => {
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
    L(this, fi, !0), m(this, di).clear(), m(this, Wi).clear();
  }
};
di = new WeakMap(), Wi = new WeakMap(), fi = new WeakMap(), c(Tc, "EventBus");
let Il = Tc;
const of = /* @__PURE__ */ new Map();
function Qo(t, e) {
  of.set(t, e);
}
c(Qo, "registerAwaitProvider");
function Ol(t, e) {
  const n = of.get(t.event);
  return n ? n(t, e) : Promise.reject(new Error(`Unknown await event type: "${t.event}"`));
}
c(Ol, "createAwaitPromise");
Qo("signal", (t, e) => t.name ? e.eventBus.waitFor(t.name, e.signal) : Promise.reject(new Error('await signal: "name" is required')));
Qo("click", (t, e) => new Promise((n, i) => {
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
Qo("keypress", (t, e) => new Promise((n, i) => {
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
const Fi = /* @__PURE__ */ new Map();
function Hp(t, e) {
  const n = Fi.get(t);
  n && !n.cancelled && n.cancel("replaced-by-name"), Fi.set(t, e), e.finished.then(() => {
    Fi.get(t) === e && Fi.delete(t);
  });
}
c(Hp, "registerTimeline");
function sf(t) {
  const e = Fi.get(t);
  return e && !e.cancelled ? (e.cancel("cancelled-by-name"), !0) : !1;
}
c(sf, "cancelTimeline");
function qp(t) {
  return Fi.get(t);
}
c(qp, "getTimeline");
function iu(t, e) {
  return t <= 0 ? Promise.resolve() : new Promise((n, i) => {
    if (e.aborted) return i(e.reason);
    const r = setTimeout(n, t);
    e.addEventListener("abort", () => {
      clearTimeout(r), i(e.reason);
    }, { once: !0 });
  });
}
c(iu, "cancellableDelay");
var je, In, Hr, qr;
const Lc = class Lc {
  constructor(e) {
    /** @type {TweenTimeline} */
    k(this, je);
    /** @type {Array<{ type: string, params: object, opts?: object, detach: boolean }>} */
    k(this, In, []);
    /** @type {Function|null} */
    k(this, Hr, null);
    /** @type {Function|null} */
    k(this, qr, null);
    L(this, je, e);
  }
  /**
   * Add a tween entry to this step.
   * @param {string} type  Registered tween type name
   * @param {object} params  Type-specific parameters
   * @param {object} [opts]  Options (durationMS, easing, etc.)
   * @returns {StepBuilder} this
   */
  add(e, n, i) {
    return m(this, In).push({ type: e, params: n, opts: i ?? {}, detach: !1 }), this;
  }
  /**
   * Mark the last entry as fire-and-forget (does not block step progression).
   * @returns {StepBuilder} this
   */
  detach() {
    if (m(this, In).length === 0)
      throw new Error("StepBuilder.detach(): no entry to detach.");
    return m(this, In)[m(this, In).length - 1].detach = !0, this;
  }
  /**
   * Callback invoked before this step's tweens start.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  before(e) {
    return L(this, Hr, e), this;
  }
  /**
   * Callback invoked after this step's awaited tweens complete.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  after(e) {
    return L(this, qr, e), this;
  }
  // ── Delegation to parent TweenTimeline for fluent chaining ──
  /** Start a new step (finalizes this one). */
  step() {
    return m(this, je).step();
  }
  /** Insert a delay between steps. */
  delay(e) {
    return m(this, je).delay(e);
  }
  /** Insert an await segment. */
  await(e) {
    return m(this, je).await(e);
  }
  /** Insert an emit segment. */
  emit(e) {
    return m(this, je).emit(e);
  }
  /** Insert a parallel segment. */
  parallel(e, n) {
    return m(this, je).parallel(e, n);
  }
  /** Register onComplete callback. */
  onComplete(e) {
    return m(this, je).onComplete(e);
  }
  /** Register onCancel callback. */
  onCancel(e) {
    return m(this, je).onCancel(e);
  }
  /** Register onError callback. */
  onError(e) {
    return m(this, je).onError(e);
  }
  /** Execute the timeline. */
  run(e) {
    return m(this, je).run(e);
  }
  /** Serialize the timeline. */
  toJSON() {
    return m(this, je).toJSON();
  }
  // ── Internal access ──
  /** @returns {{ entries: Array, before: Function|null, after: Function|null }} */
  _finalize() {
    return {
      entries: m(this, In),
      before: m(this, Hr),
      after: m(this, qr)
    };
  }
};
je = new WeakMap(), In = new WeakMap(), Hr = new WeakMap(), qr = new WeakMap(), c(Lc, "StepBuilder");
let Al = Lc;
var Be, ke, It, On, jr, Br, Ur, Vr, Vn, kl, J, nn, Ml, lf, Nl, cf, uf, Oa, ut, Rt;
const on = class on {
  constructor() {
    k(this, J);
    /** @type {string|null} */
    k(this, Be, null);
    /** @type {string} */
    k(this, ke, Ie.ABORT);
    /** @type {Array<object>} */
    k(this, It, []);
    /** @type {StepBuilder|null} */
    k(this, On, null);
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
    return L(this, Be, e), this;
  }
  /**
   * Set the error policy for step execution.
   * @param {"abort"|"continue"} policy
   * @returns {TweenTimeline} this
   */
  errorPolicy(e) {
    if (e !== Ie.ABORT && e !== Ie.CONTINUE)
      throw new Error(`Invalid error policy: "${e}". Use "abort" or "continue".`);
    return L(this, ke, e), this;
  }
  /**
   * Start a new step. Finalizes the previous step if one is open.
   * @returns {StepBuilder}
   */
  step() {
    return S(this, J, nn).call(this), L(this, On, new Al(this)), m(this, On);
  }
  /**
   * Insert a delay (in ms) between the previous step and the next.
   * @param {number} ms
   * @returns {TweenTimeline} this
   */
  delay(e) {
    return S(this, J, nn).call(this), m(this, It).push({ kind: "delay", ms: e }), this;
  }
  /**
   * Pause execution until an event occurs.
   * @param {object} config  e.g. { event: "click" }, { event: "signal", name: "fog-done" }
   * @returns {TweenTimeline} this
   */
  await(e) {
    return S(this, J, nn).call(this), m(this, It).push({ kind: "await", config: e }), this;
  }
  /**
   * Fire a named signal (instant, non-blocking).
   * @param {string} signal  Signal name
   * @returns {TweenTimeline} this
   */
  emit(e) {
    return S(this, J, nn).call(this), m(this, It).push({ kind: "emit", signal: e }), this;
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
    S(this, J, nn).call(this);
    const i = n.join ?? "all", r = n.overflow ?? "detach";
    if (i !== "all" && i !== "any" && (typeof i != "number" || i < 1 || i > e.length))
      throw new Error(`parallel: join must be "all", "any", or 1..${e.length}, got ${JSON.stringify(i)}`);
    if (r !== "detach" && r !== "cancel")
      throw new Error(`parallel: overflow must be "detach" or "cancel", got ${JSON.stringify(r)}`);
    const a = e.map((o) => {
      var l;
      const s = new on();
      return o(s), S(l = s, J, nn).call(l), m(s, It);
    });
    return m(this, It).push({ kind: "parallel", branches: a, join: i, overflow: r }), this;
  }
  /**
   * Callback invoked before the first step runs.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  beforeAll(e) {
    return L(this, jr, e), this;
  }
  /**
   * Callback invoked on successful completion.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onComplete(e) {
    return L(this, Br, e), this;
  }
  /**
   * Callback invoked on cancellation (mutually exclusive with onComplete).
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onCancel(e) {
    return L(this, Ur, e), this;
  }
  /**
   * Callback invoked on runtime failure (mutually exclusive with onComplete/onCancel).
   * @param {(outcome: object) => void} fn
   * @returns {TweenTimeline} this
   */
  onError(e) {
    return L(this, Vr, e), this;
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
    S(this, J, nn).call(this);
    const n = new AbortController();
    e.signal && (e.signal.aborted ? n.abort(e.signal.reason ?? "parent-aborted") : e.signal.addEventListener("abort", () => {
      n.signal.aborted || n.abort(e.signal.reason ?? "parent-aborted");
    }, { once: !0 }));
    const i = new Ll(n);
    m(this, Be) && Hp(m(this, Be), i);
    const r = e.broadcast ?? game.user.isGM, a = e.commit ?? game.user.isGM, o = e.startEpochMS ?? Date.now();
    r && m(this, Be) && Ia(rf, {
      name: m(this, Be),
      data: this.toJSON(),
      startEpochMS: o
    });
    const s = new Il(), l = {
      signal: i.signal,
      commit: a,
      startEpochMS: o,
      eventBus: s,
      errors: [],
      detachedPromises: []
    };
    return S(this, J, lf).call(this, i, l).then((u) => {
      var d, h, f;
      s.destroy(), i._resolve(u), u.status === yn.COMPLETED ? (d = m(this, Br)) == null || d.call(this) : u.status === yn.CANCELLED ? ((h = m(this, Ur)) == null || h.call(this), r && m(this, Be) && Ia(Sl, {
        name: m(this, Be),
        reason: u.reason
      })) : ((f = m(this, Vr)) == null || f.call(this, u), r && m(this, Be) && Ia(Sl, {
        name: m(this, Be),
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
    S(this, J, nn).call(this);
    const n = { timeline: S(i = on, Vn, kl).call(i, m(this, It)) };
    return m(this, Be) && (n.name = m(this, Be)), m(this, ke) !== Ie.ABORT && (n.errorPolicy = m(this, ke)), n;
  }
};
Be = new WeakMap(), ke = new WeakMap(), It = new WeakMap(), On = new WeakMap(), jr = new WeakMap(), Br = new WeakMap(), Ur = new WeakMap(), Vr = new WeakMap(), Vn = new WeakSet(), kl = /* @__PURE__ */ c(function(e) {
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
            return S(a = on, Vn, kl).call(a, r);
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
nn = /* @__PURE__ */ c(function() {
  m(this, On) && (m(this, It).push({ kind: "step", data: m(this, On)._finalize() }), L(this, On, null));
}, "#finalizeCurrentStep"), Ml = /* @__PURE__ */ c(function(e) {
  e.length !== 0 && Promise.allSettled(e).catch(() => {
  });
}, "#drainDetached"), lf = /* @__PURE__ */ c(async function(e, n) {
  var i, r;
  try {
    if (n.signal.aborted) return S(this, J, ut).call(this, n.signal.reason);
    const a = await S(this, J, Oa).call(this, m(this, jr), vt.BEFORE_ALL, null);
    if (a) {
      if (m(this, ke) === Ie.ABORT) return a;
      n.errors.push(a);
    }
    const o = await S(this, J, Nl).call(this, m(this, It), n);
    if (o)
      return S(i = on, Vn, Ml).call(i, n.detachedPromises), o;
    if (!n.signal.aborted) {
      const s = await Promise.allSettled(n.detachedPromises);
      for (const l of s)
        if (l.status === "rejected") {
          const u = S(this, J, Rt).call(this, l.reason, vt.ENTRY);
          if (m(this, ke) === Ie.ABORT) return u;
          n.errors.push(u);
        }
    }
    return n.signal.aborted ? S(this, J, ut).call(this, n.signal.reason) : {
      status: yn.COMPLETED,
      ...n.errors.length > 0 ? { errors: n.errors } : {}
    };
  } catch (a) {
    return S(r = on, Vn, Ml).call(r, n.detachedPromises), n.signal.aborted ? S(this, J, ut).call(this, n.signal.reason) : (console.error("TweenTimeline execution error:", a), S(this, J, Rt).call(this, a, vt.RUNTIME));
  }
}, "#execute"), Nl = /* @__PURE__ */ c(async function(e, n) {
  let i = -1, r = 0;
  for (const a of e) {
    if (n.signal.aborted) return S(this, J, ut).call(this, n.signal.reason);
    if (a.kind === "delay") {
      try {
        await iu(a.ms, n.signal);
      } catch {
        return S(this, J, ut).call(this, n.signal.reason);
      }
      r += a.ms;
      continue;
    }
    if (a.kind === "await") {
      try {
        let p = Ol(a.config, {
          signal: n.signal,
          eventBus: n.eventBus
        });
        const y = a.config.timeout;
        typeof y == "number" && y > 0 && (p = Promise.race([
          p,
          iu(y, n.signal)
        ])), await p;
      } catch (p) {
        if (n.signal.aborted) return S(this, J, ut).call(this, n.signal.reason);
        const y = S(this, J, Rt).call(this, p, vt.AWAIT);
        if (m(this, ke) === Ie.ABORT) return y;
        n.errors.push(y);
      }
      continue;
    }
    if (a.kind === "emit") {
      try {
        n.eventBus.emit(a.signal);
      } catch (p) {
        const y = S(this, J, Rt).call(this, p, vt.EMIT);
        if (m(this, ke) === Ie.ABORT) return y;
        n.errors.push(y);
      }
      continue;
    }
    if (a.kind === "parallel") {
      const p = await S(this, J, cf).call(this, a, n, r);
      if (p) return p;
      continue;
    }
    i += 1;
    const { entries: o, before: s, after: l } = a.data, u = await S(this, J, Oa).call(this, s, vt.BEFORE_STEP, i);
    if (u) {
      if (m(this, ke) === Ie.ABORT) return u;
      n.errors.push(u);
      continue;
    }
    if (n.signal.aborted) return S(this, J, ut).call(this, n.signal.reason);
    const d = [];
    let h = 0;
    for (const p of o) {
      const y = tr(p.type);
      if (!y) {
        const C = S(this, J, Rt).call(this, new Error(`TweenTimeline: unknown tween type "${p.type}"`), vt.ENTRY, i, p.type);
        if (m(this, ke) === Ie.ABORT) return C;
        n.errors.push(C), console.warn(C.error.message);
        continue;
      }
      const v = {
        ...p.opts,
        commit: n.commit,
        startEpochMS: n.startEpochMS + r,
        signal: n.signal
      }, b = v.durationMS ?? 2e3, w = Promise.resolve().then(() => y.execute(p.params, v)).then((C) => C === !1 ? {
        ok: !1,
        failure: S(this, J, Rt).call(this, new Error("Tween entry returned false."), vt.ENTRY, i, p.type)
      } : { ok: !0 }).catch((C) => ({
        ok: !1,
        failure: S(this, J, Rt).call(this, C, vt.ENTRY, i, p.type)
      }));
      p.detach ? n.detachedPromises.push(w) : (d.push(w), h = Math.max(h, b));
    }
    const f = await S(this, J, uf).call(this, d, n.signal);
    if (f === null) return S(this, J, ut).call(this, n.signal.reason);
    for (const p of f)
      if (!p.ok) {
        if (m(this, ke) === Ie.ABORT) return p.failure;
        n.errors.push(p.failure), console.warn("TweenTimeline: entry failed:", p.failure.error);
      }
    const g = await S(this, J, Oa).call(this, l, vt.AFTER_STEP, i);
    if (g) {
      if (m(this, ke) === Ie.ABORT) return g;
      n.errors.push(g);
    }
    if (n.signal.aborted) return S(this, J, ut).call(this, n.signal.reason);
    r += h;
  }
  return null;
}, "#executeSegments"), cf = /* @__PURE__ */ c(async function(e, n, i = 0) {
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
    const v = /* @__PURE__ */ c(() => {
      if (y) return;
      if (d >= l) {
        y = !0, b(), p(null);
        return;
      }
      const w = s - d - h;
      if (d + w < l) {
        y = !0, b();
        const C = f.filter((A) => A && A.status === yn.FAILED).map((A) => A), I = S(this, J, Rt).call(this, new Error(`parallel: join target ${l} impossible (${d} completed, ${h} failed)`), vt.PARALLEL);
        m(this, ke) === Ie.ABORT ? p(I) : (n.errors.push(I), n.errors.push(...C), p(null));
      }
    }, "checkJoin"), b = /* @__PURE__ */ c(() => {
      if (o === "cancel")
        for (let w = 0; w < s; w++)
          !f[w] && !u[w].signal.aborted && u[w].abort("overflow-cancel");
      for (let w = 0; w < s; w++)
        f[w] || n.detachedPromises.push(g[w]);
    }, "applyOverflow");
    if (g = r.map((w, C) => {
      const I = {
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
      return S(this, J, Nl).call(this, w, I).then((A) => {
        if (A)
          if (A.status === yn.CANCELLED) {
            if (u[C].signal.aborted) {
              f[C] = A;
              return;
            }
            f[C] = A, h++;
          } else
            f[C] = A, h++;
        else
          f[C] = { status: yn.COMPLETED }, d++;
        v();
      });
    }), n.signal.aborted) {
      y = !0, p(S(this, J, ut).call(this, n.signal.reason));
      return;
    }
    n.signal.addEventListener("abort", () => {
      y || (y = !0, p(S(this, J, ut).call(this, n.signal.reason)));
    }, { once: !0 });
  });
}, "#executeParallel"), /**
 * @param {Array<Promise<{ok: boolean, failure?: object}>>} stepPromises
 * @param {AbortSignal} signal
 * @returns {Promise<Array<{ok: boolean, failure?: object}>|null>}
 */
uf = /* @__PURE__ */ c(function(e, n) {
  return e.length === 0 ? Promise.resolve([]) : n.aborted ? Promise.resolve(null) : new Promise((i, r) => {
    const a = /* @__PURE__ */ c(() => i(null), "onAbort");
    n.addEventListener("abort", a, { once: !0 }), Promise.all(e).then((o) => {
      n.removeEventListener("abort", a), i(o);
    }).catch((o) => {
      n.removeEventListener("abort", a), r(o);
    });
  });
}, "#waitForStep"), Oa = /* @__PURE__ */ c(async function(e, n, i) {
  if (!e) return null;
  try {
    return await e(), null;
  } catch (r) {
    const a = S(this, J, Rt).call(this, r, n, i ?? void 0);
    return m(this, ke) === Ie.CONTINUE && console.warn(`TweenTimeline: hook failure in ${n}:`, r), a;
  }
}, "#runHook"), /** @param {unknown} reason */
ut = /* @__PURE__ */ c(function(e) {
  let n;
  return typeof e == "string" ? n = e : e instanceof Error && (n = e.message), {
    status: yn.CANCELLED,
    ...n ? { reason: n } : {}
  };
}, "#cancelledOutcome"), /**
 * @param {unknown} err
 * @param {string} phase
 * @param {number} [stepIndex]
 * @param {string} [entryType]
 */
Rt = /* @__PURE__ */ c(function(e, n, i, r) {
  const a = e instanceof Error ? e : new Error(String(e));
  return {
    status: yn.FAILED,
    error: a,
    phase: n,
    ...typeof i == "number" ? { stepIndex: i } : {},
    ...r ? { entryType: r } : {}
  };
}, "#failedOutcome"), k(on, Vn), c(on, "TweenTimeline");
let Qa = on;
function hc(t) {
  if (!t || typeof t != "object")
    throw new Error("Sequence JSON: data must be an object.");
  if (!Array.isArray(t.timeline))
    throw new Error("Sequence JSON: 'timeline' must be an array.");
  if (t.name != null && typeof t.name != "string")
    throw new Error("Sequence JSON: 'name' must be a string.");
  if (t.errorPolicy != null && t.errorPolicy !== Ie.ABORT && t.errorPolicy !== Ie.CONTINUE)
    throw new Error(`Sequence JSON: 'errorPolicy' must be "abort" or "continue".`);
  df(t.timeline, "timeline", 0);
}
c(hc, "validateSequenceJSON");
function df(t, e, n = 0) {
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
        df(d, `${a}.parallel.branches[${u}]`, n + 1);
      }
      continue;
    }
    throw new Error(`Sequence JSON: ${a} is not a recognized segment (step array, delay, await, emit, or parallel).`);
  }
}
c(df, "validateSegmentsJSON");
function ff(t) {
  hc(t), mf(t.timeline, "timeline");
}
c(ff, "validateSequenceSemantics");
function mf(t, e) {
  for (let n = 0; n < t.length; n++) {
    const i = t[n], r = `${e}[${n}]`;
    if (Array.isArray(i))
      for (let a = 0; a < i.length; a++) {
        const o = i[a];
        try {
          Tp(o.type, o.params ?? {});
        } catch (s) {
          throw new Error(`Sequence JSON: ${r}[${a}] failed semantic validation: ${s.message}`);
        }
      }
    else if (i.parallel)
      for (let a = 0; a < i.parallel.branches.length; a++)
        mf(i.parallel.branches[a], `${r}.parallel.branches[${a}]`);
  }
}
c(mf, "validateSegmentsSemantics");
function gc(t, e = {}) {
  hc(t), e.validateSemantics && ff(t);
  const n = new Qa();
  return t.name && n.name(t.name), t.errorPolicy && n.errorPolicy(t.errorPolicy), hf(t.timeline, n), n;
}
c(gc, "compileSequence");
function hf(t, e) {
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
      const i = n.parallel, r = i.branches.map((a) => (o) => hf(a, o));
      e.parallel(r, {
        join: i.join ?? "all",
        overflow: i.overflow ?? "detach"
      });
    }
  }
}
c(hf, "compileSegments");
function jp(t) {
  hc(t), ff(t);
}
c(jp, "validate$3");
async function Bp(t, e = {}) {
  return gc(t, { validateSemantics: !0 }).run({
    broadcast: !1,
    commit: e.commit,
    startEpochMS: e.startEpochMS,
    signal: e.signal
  }).finished;
}
c(Bp, "execute$3");
function Up() {
  Ft({ type: "sequence", execute: Bp, validate: jp });
}
c(Up, "registerSequenceTween");
function Vp(t) {
  if (t.x == null && t.y == null && t.scale == null)
    throw new Error("camera-pan tween: at least one of 'x', 'y', or 'scale' is required.");
  if (t.x != null && typeof t.x != "number")
    throw new Error("camera-pan tween: 'x' must be a number.");
  if (t.y != null && typeof t.y != "number")
    throw new Error("camera-pan tween: 'y' must be a number.");
  if (t.scale != null && (typeof t.scale != "number" || t.scale <= 0))
    throw new Error("camera-pan tween: 'scale' must be a positive number.");
}
c(Vp, "validate$2");
async function Gp(t, e = {}) {
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
c(Gp, "execute$2");
function zp() {
  Ft({ type: "camera-pan", execute: Gp, validate: Vp });
}
c(zp, "registerCameraPanTween");
function Wp(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((i) => !i || typeof i != "string"))
    throw new Error("tile-tint tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (t.toColor == null || typeof t.toColor != "string")
    throw new Error("tile-tint tween: 'toColor' (CSS color string) is required.");
  if (!foundry.utils.Color.fromString(t.toColor).valid)
    throw new Error(`tile-tint tween: invalid target color "${t.toColor}".`);
  if (t.mode && !Ji().includes(t.mode))
    throw new Error(
      `tile-tint tween: unknown mode "${t.mode}". Available: ${Ji().join(", ")}`
    );
}
c(Wp, "validate$1");
async function Yp(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { Color: i } = foundry.utils, { uuid: r, toColor: a, mode: o = "oklch" } = t, s = Array.isArray(r) ? r : [r];
  if (s.length === 0)
    return console.warn("tile-tint tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: l = 2e3,
    easing: u = "easeInOutCosine",
    commit: d = !0,
    startEpochMS: h = null,
    signal: f = null
  } = e, g = rt(u), p = mc(o), y = i.fromString(a);
  if (!y.valid) throw new Error(`tile-tint tween: invalid target color "${a}".`);
  async function v(w) {
    var R, B;
    if (f != null && f.aborted) return !1;
    const C = await fromUuid(w);
    if (!C) return !1;
    const I = C.object;
    if (!I) return !1;
    const A = ((B = (R = C._source) == null ? void 0 : R.texture) == null ? void 0 : B.tint) ?? "#ffffff", O = i.fromString(A);
    O.valid || console.warn(`tile-tint tween: source tint invalid on ${w}, using white.`);
    const M = O.valid ? O : i.fromString("#ffffff"), _ = { t: 0 }, j = `tile-tint-tween:${w}`;
    n.terminateAnimation(j), f && f.addEventListener("abort", () => {
      n.terminateAnimation(j);
    }, { once: !0 });
    const D = typeof h == "number" ? Math.max(0, Math.min(l, Date.now() - h)) : 0, P = /* @__PURE__ */ c((W) => {
      const H = p(M, y, W);
      C.updateSource({ texture: { tint: H } }), I.refresh();
    }, "applyFrame");
    D > 0 && (_.t = D / l, P(_.t));
    const $ = await n.animate(
      [{ parent: _, attribute: "t", to: 1 }],
      {
        name: j,
        duration: l,
        easing: g,
        time: D,
        ontick: /* @__PURE__ */ c(() => P(_.t), "ontick")
      }
    );
    if ($ !== !1) {
      if (f != null && f.aborted) return !1;
      C.updateSource({ texture: { tint: y.toHTML() } }), I.refresh();
    }
    if (d && $ !== !1 && C.canUserModify(game.user, "update")) {
      if (f != null && f.aborted) return !1;
      C.updateSource({ texture: { tint: M.toHTML() } }), await C.update({ "texture.tint": y.toHTML() });
    }
    return $ !== !1;
  }
  return c(v, "animateOne"), (await Promise.all(s.map(v))).every(Boolean);
}
c(Yp, "execute$1");
function Kp() {
  Ft({ type: "tile-tint", execute: Yp, validate: Wp });
}
c(Kp, "registerTileTintTween");
function Jp(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("tile-scale tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (typeof t.toScale != "number" || t.toScale <= 0)
    throw new Error("tile-scale tween: 'toScale' must be a positive number.");
  for (const n of ["baseWidth", "baseHeight", "centerX", "centerY"])
    if (typeof t[n] != "number")
      throw new Error(`tile-scale tween: '${n}' (number) is required.`);
}
c(Jp, "validate");
async function Xp(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, toScale: r, baseWidth: a, baseHeight: o, centerX: s, centerY: l } = t, u = Array.isArray(i) ? i : [i];
  if (u.length === 0) return !0;
  const {
    durationMS: d = 2e3,
    easing: h = "easeInOutCosine",
    commit: f = !0,
    startEpochMS: g = null,
    signal: p = null
  } = e, y = rt(h), v = a * r, b = o * r, w = s - v / 2, C = l - b / 2;
  async function I(O) {
    if (p != null && p.aborted) return !1;
    const M = await fromUuid(O);
    if (!M) return !1;
    const _ = M.object;
    if (!_) return !1;
    const j = M._source.width, D = M._source.height, P = M._source.x, $ = M._source.y, R = `tile-scale-tween:${O}`;
    n.terminateAnimation(R), p && p.addEventListener("abort", () => {
      n.terminateAnimation(R);
    }, { once: !0 });
    const B = typeof g == "number" ? Math.max(0, Math.min(d, Date.now() - g)) : 0, W = /* @__PURE__ */ c((K) => {
      const ae = j + (v - j) * K, Q = D + (b - D) * K, te = P + (w - P) * K, Xt = $ + (C - $) * K;
      M.updateSource({ width: ae, height: Q, x: te, y: Xt }), _.refresh();
    }, "applyFrame"), H = { t: 0 };
    B > 0 && (H.t = B / d, W(H.t));
    const U = await n.animate(
      [{ parent: H, attribute: "t", to: 1 }],
      {
        name: R,
        duration: d,
        easing: y,
        time: B,
        ontick: /* @__PURE__ */ c(() => W(H.t), "ontick")
      }
    );
    if (U !== !1) {
      if (p != null && p.aborted) return !1;
      M.updateSource({ width: v, height: b, x: w, y: C }), _.refresh();
    }
    if (f && U !== !1 && M.canUserModify(game.user, "update")) {
      if (p != null && p.aborted) return !1;
      M.updateSource({ width: j, height: D, x: P, y: $ }), await M.update({ width: v, height: b, x: w, y: C });
    }
    return U !== !1;
  }
  return c(I, "animateOne"), (await Promise.all(u.map(I))).every(Boolean);
}
c(Xp, "execute");
function Qp() {
  Ft({ type: "tile-scale", execute: Xp, validate: Jp });
}
c(Qp, "registerTileScaleTween");
async function Zp(t, e, n = {}) {
  if (!game.user.isGM)
    return ui.notifications.warn("Only the GM can dispatch tweens."), !1;
  const i = tr(t);
  if (!i)
    throw new Error(`Unknown tween type: "${t}". Registered types: ${Cl().join(", ")}`);
  i.validate(e);
  const { durationMS: r = 2e3, easing: a = "easeInOutCosine", commit: o = !0 } = n, s = Date.now();
  return Ia(nf, {
    type: t,
    params: e,
    durationMS: r,
    easing: a,
    startEpochMS: s,
    commit: !1
  }), i.execute(e, { durationMS: r, easing: a, commit: o, startEpochMS: s });
}
c(Zp, "dispatchTween");
function ey(t) {
  const { type: e, params: n, durationMS: i, easing: r, startEpochMS: a, commit: o } = t ?? {}, s = tr(e);
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
c(ey, "handleTweenSocketMessage");
Np();
_p();
Fp();
Rp();
Up();
zp();
Kp();
Qp();
Ft({ type: "token-prop", execute: Xo, validate: Jo });
Ft({ type: "drawing-prop", execute: Xo, validate: Jo });
Ft({ type: "sound-prop", execute: Xo, validate: Jo });
dc(nf, ey);
dc(rf, ty);
dc(Sl, ny);
function ty(t) {
  const { data: e, startEpochMS: n } = t ?? {};
  if (!e) {
    console.warn(`[${T}] Received empty tween-sequence socket message.`);
    return;
  }
  try {
    gc(e, { validateSemantics: !0 }).run({ commit: !1, startEpochMS: n, broadcast: !1 });
  } catch (i) {
    console.error(`[${T}] Failed to run received tween sequence:`, i);
  }
}
c(ty, "handleSequenceSocketMessage");
function ny(t) {
  const { name: e } = t ?? {};
  e && sf(e);
}
c(ny, "handleSequenceCancelMessage");
function iy() {
  Hooks.once("ready", () => {
    Cp();
    const t = game.modules.get(T);
    t.api || (t.api = {}), t.api.tween = {
      dispatch: Zp,
      types: Cl,
      Timeline: Qa,
      ErrorPolicy: Ie,
      compileSequence: gc,
      cancelTimeline: sf,
      getTimeline: qp
    }, console.log(`[${T}] Tween API registered. Types: ${Cl().join(", ")}`);
  });
}
c(iy, "registerTweenHooks");
iy();
const ry = ["tag", "tag-all", "id", "tags-any", "tags-all"], ay = /* @__PURE__ */ new Set(["tags-any", "tags-all"]);
function pc(t) {
  if (!t || typeof t != "string")
    return { type: "unknown", value: t ?? "" };
  if (t.startsWith("$"))
    return { type: "special", value: t };
  for (const e of ry)
    if (t.startsWith(`${e}:`)) {
      const n = t.slice(e.length + 1), i = ay.has(e) ? n.split(",").map((r) => r.trim()) : n;
      return { type: e, value: i };
    }
  return t.includes(".") ? { type: "uuid", value: t } : { type: "unknown", value: t };
}
c(pc, "parseSelector");
function oy(t) {
  if (!t) return "";
  const { type: e, value: n } = t;
  if (e === "special" || e === "uuid" || e === "unknown")
    return Array.isArray(n) ? n.join(",") : n ?? "";
  const i = Array.isArray(n) ? n.join(",") : n ?? "";
  return `${e}:${i}`;
}
c(oy, "buildSelector");
function gf(t, e = "first") {
  return t != null && t.length ? t.length === 1 ? e === "first-all" || e === "all" ? `tag-all:${t[0]}` : `tag:${t[0]}` : e === "any" ? `tags-any:${t.join(",")}` : e === "all" ? `tags-all:${t.join(",")}` : e === "first-all" ? `tags-all:${t.join(",")}` : `tags-any:${t.join(",")}` : "";
}
c(gf, "buildTagSelector");
function Zo(t) {
  if (!t) return null;
  if (t.documentName || t._source !== void 0) {
    const e = t.object;
    return e ? { placeable: e, doc: t } : null;
  }
  return t.document ? { placeable: t, doc: t.document } : null;
}
c(Zo, "normalizePlaceable");
function pf() {
  var t;
  return window.Tagger ?? ((t = game.modules.get("tagger")) == null ? void 0 : t.api) ?? null;
}
c(pf, "getTaggerAPI");
function es(t, e) {
  if (!t) return null;
  const n = e ?? canvas.scene;
  if (!n) return null;
  const i = pc(t);
  switch (i.type) {
    case "special":
      return sy(i.value);
    case "tag":
      return ru(i.value, n);
    case "tag-all":
      return ru(i.value, n);
    case "id":
      return ly(i.value, n);
    case "tags-any":
      return au(i.value, n, !0);
    case "tags-all":
      return au(i.value, n, !1);
    case "uuid":
      return cy(i.value);
    default:
      return null;
  }
}
c(es, "resolveSelector");
function sy(t) {
  var e;
  if (t === "$particles") {
    if (!((e = game.modules.get("fxmaster")) != null && e.active))
      return console.warn(`[${T}] Picker: FXMaster not active, cannot resolve "$particles".`), null;
    const n = canvas.particleeffects;
    return n ? { kind: "particles", documents: [], placeables: [], target: n } : null;
  }
  return null;
}
c(sy, "resolveSpecial");
function ru(t, e, n) {
  const i = pf();
  if (!i)
    return console.warn(`[${T}] Picker: Tagger not available, cannot resolve tag "${t}".`), null;
  const r = i.getByTag(t, { sceneId: e.id });
  if (!(r != null && r.length)) return null;
  const a = [];
  for (const o of r) {
    const s = Zo(o);
    s && a.push(s);
  }
  return a.length === 0 ? null : {
    kind: a.length === 1 ? "placeable" : "multi-placeable",
    documents: a.map((o) => o.doc),
    placeables: a
  };
}
c(ru, "resolveTag");
function ly(t, e) {
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
      const a = Zo(r);
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
c(ly, "resolveById");
function au(t, e, n) {
  const i = pf();
  if (!i)
    return console.warn(`[${T}] Picker: Tagger not available, cannot resolve multi-tag.`), null;
  const r = i.getByTag(t, {
    sceneId: e.id,
    matchAny: n
  });
  if (!(r != null && r.length)) return null;
  const a = [];
  for (const o of r) {
    const s = Zo(o);
    s && a.push(s);
  }
  return a.length === 0 ? null : {
    kind: a.length === 1 ? "placeable" : "multi-placeable",
    documents: a.map((o) => o.doc),
    placeables: a
  };
}
c(au, "resolveMultiTag");
function cy(t) {
  const e = fromUuidSync(t);
  if (!e) return null;
  const n = Zo(e);
  return n ? {
    kind: "placeable",
    documents: [n.doc],
    placeables: [n]
  } : null;
}
c(cy, "resolveUUID");
function uy(t) {
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
c(uy, "adaptResolved");
function Za(t) {
  var r;
  const e = /* @__PURE__ */ new Set();
  if (t.segments) {
    if (t.setup) for (const a of Object.keys(t.setup)) e.add(a);
    if (t.landing) for (const a of Object.keys(t.landing)) e.add(a);
    for (const a of Object.values(t.segments)) {
      if (a.setup) for (const o of Object.keys(a.setup)) e.add(o);
      if (a.landing) for (const o of Object.keys(a.landing)) e.add(o);
      a.timeline && xl(a.timeline, e), (r = a.gate) != null && r.target && e.add(a.gate.target);
    }
  } else {
    if (t.setup) for (const a of Object.keys(t.setup)) e.add(a);
    if (t.landing) for (const a of Object.keys(t.landing)) e.add(a);
    t.timeline && xl(t.timeline, e);
  }
  const n = /* @__PURE__ */ new Map(), i = [];
  for (const a of e) {
    const o = es(a), s = uy(o);
    s ? n.set(a, s) : i.push(a);
  }
  return i.length && console.warn(`[${T}] Cinematic: ${i.length} unresolved target(s): ${i.join(", ")}`), { targets: n, unresolved: i };
}
c(Za, "resolveAllTargets");
function dy(t, e) {
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
c(dy, "captureSnapshot");
function fy(t) {
  const e = {};
  function n(i) {
    if (i)
      for (const [r, a] of Object.entries(i))
        e[r] || (e[r] = {}), Object.assign(e[r], a);
  }
  if (c(n, "mergeMap"), t.segments) {
    n(t.setup), n(t.landing);
    for (const i of Object.values(t.segments))
      n(i.setup), n(i.landing), i.timeline && $l(i.timeline, e, n);
  } else
    n(t.setup), n(t.landing), t.timeline && $l(t.timeline, e, n);
  return e;
}
c(fy, "gatherAllStateMaps");
function $l(t, e, n) {
  var i;
  for (const r of t)
    if (!(r.delay != null || r.await != null || r.emit != null) && !(r.transitionTo != null || r.sound != null || r.stopSound != null)) {
      if ((i = r.parallel) != null && i.branches) {
        for (const a of r.parallel.branches)
          $l(a, e, n);
        continue;
      }
      if (n(r.before), n(r.after), r.tweens)
        for (const a of r.tweens)
          a.target && a.attribute && (e[a.target] || (e[a.target] = {}), e[a.target][a.attribute] = "__snapshot__");
    }
}
c($l, "gatherFromEntries");
function xl(t, e) {
  for (const n of t)
    if (n.delay == null && n.await == null && n.emit == null && n.transitionTo == null && n.sound == null && n.stopSound == null) {
      if (n.parallel) {
        const i = n.parallel;
        if (i.branches)
          for (const r of i.branches)
            xl(r, e);
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
c(xl, "collectSelectorsFromEntries");
const ou = {
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
}, my = /* @__PURE__ */ new Set([
  "alpha",
  "visible",
  "x",
  "y",
  "scale",
  "rotation"
]);
function ws(t, e, n) {
  const i = {};
  for (const [r, a] of Object.entries(t))
    e.has(r) ? i[r] = a : console.warn(`[${T}] Cinematic: blocked property "${r}" on ${n}.`);
  return i;
}
c(ws, "filterOverrides");
function Oe(t, e) {
  var i, r;
  if (!t) return;
  const n = [];
  for (const [a, o] of Object.entries(t)) {
    const s = e.get(a);
    if (s)
      if (s.kind === "particles") {
        if (s.target.destroyed) continue;
        const l = ws(o, my, "$particles");
        for (const [u, d] of Object.entries(l))
          s.target[u] = d;
      } else if (s.kind === "multi-placeable")
        for (const { placeable: l, doc: u } of s.placeables) {
          if (!(u != null && u.parent) || !(l != null && l.scene)) continue;
          const d = u.documentName, h = ou[d];
          if (!h) {
            console.warn(`[${T}] Cinematic: no allowlist for document type "${d}" on "${a}", skipping.`);
            continue;
          }
          const f = ws(o, h, `${d} "${a}"`);
          u.updateSource(f), n.push(l);
        }
      else {
        if (!((i = s.doc) != null && i.parent) || !((r = s.placeable) != null && r.scene)) continue;
        const l = s.doc.documentName, u = ou[l];
        if (!u) {
          console.warn(`[${T}] Cinematic: no allowlist for document type "${l}" on "${a}", skipping.`);
          continue;
        }
        const d = ws(o, u, `${l} "${a}"`);
        s.doc.updateSource(d), n.push(s.placeable);
      }
  }
  for (const a of n)
    a.refresh();
}
c(Oe, "applyState");
function Di(t, e) {
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
c(Di, "refreshPerceptionIfNeeded");
const hy = {
  "tile-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "light-color": /* @__PURE__ */ new Set(["uuid", "toColor", "toAlpha", "mode"]),
  "light-state": /* @__PURE__ */ new Set(["uuid", "enabled"]),
  "particles-prop": /* @__PURE__ */ new Set(["attribute", "value"]),
  "camera-pan": /* @__PURE__ */ new Set(["x", "y", "scale"]),
  "token-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "drawing-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "sound-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"])
}, gy = /* @__PURE__ */ new Set(["easing"]), py = /* @__PURE__ */ new Set(["type", "target"]);
function yf(t, e) {
  const { type: n, target: i, ...r } = t;
  if (!n)
    return console.warn(`[${T}] Cinematic: tween entry missing 'type', skipping.`), null;
  const a = {}, o = {}, s = hy[n];
  if (i === "$particles")
    a.target = "$particles";
  else if (i) {
    const l = e.get(i);
    if (!l) return null;
    l.kind === "multi-placeable" ? a.uuid = l.placeables.map((u) => u.doc.uuid) : a.uuid = l.doc.uuid;
  }
  for (const [l, u] of Object.entries(r))
    py.has(l) || (gy.has(l) ? o[l] = u : (s != null && s.has(l), a[l] = u));
  return { type: n, params: a, opts: o };
}
c(yf, "compileTween");
const Or = /* @__PURE__ */ new Map();
let yy = 0;
async function by(t) {
  var u, d, h, f, g;
  const { id: e, src: n, volume: i = 0.8, loop: r = !1, fadeIn: a } = t;
  if (!n) {
    console.warn(`[${T}] Cinematic sound: missing 'src', skipping.`);
    return;
  }
  const o = e || `__auto_${++yy}`, s = {
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
  a && a > 0 && l.fade && l.fade(i, { duration: a, from: 0 }), Or.set(o, { sound: l, config: t }), console.log(`[${T}] Cinematic sound: playing "${n}" as "${o}" (loop=${r}, vol=${i})`);
}
c(by, "playLocalSound");
function Es(t) {
  var i, r;
  const e = Or.get(t);
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
  Or.delete(t);
}
c(Es, "stopCinematicSound");
function su() {
  var t, e;
  for (const [n, i] of Or)
    try {
      (e = (t = i.sound).stop) == null || e.call(t);
    } catch (r) {
      console.warn(`[${T}] Cinematic sound: error stopping "${n}" during cleanup:`, r);
    }
  Or.clear();
}
c(su, "stopAllCinematicSounds");
function vy(t, e, n, i = {}) {
  const { skipToStep: r, onStepComplete: a, timelineName: o } = i, s = new n().name(o ?? `cinematic-${canvas.scene.id}`);
  return s.beforeAll(() => {
    var l;
    try {
      Oe(t.setup, e), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    } catch (u) {
      throw console.error(`[${T}] Cinematic: error in beforeAll (setup state) on scene ${(l = canvas.scene) == null ? void 0 : l.id}:`, u), u;
    }
  }), vf(t.timeline, s, e, { skipToStep: r, onStepComplete: a }), { tl: s };
}
c(vy, "buildTimeline");
function bf(t, e) {
  var n;
  if (t)
    for (const i of t)
      for (const r of i) {
        if (r.before)
          try {
            Oe(r.before, e), Di(r.before, e);
          } catch (a) {
            console.warn(`[${T}] Cinematic: error in skipped parallel before:`, a);
          }
        if (r.after)
          try {
            Oe(r.after, e), Di(r.after, e);
          } catch (a) {
            console.warn(`[${T}] Cinematic: error in skipped parallel after:`, a);
          }
        (n = r.parallel) != null && n.branches && bf(r.parallel.branches, e);
      }
}
c(bf, "applyParallelStatesForSkip");
function vf(t, e, n, i = {}) {
  const { skipToStep: r, onStepComplete: a } = i;
  let o = -1;
  for (const s of t) {
    if (s.sound != null) {
      if (r != null && o < r) continue;
      const h = s.sound, { duration: f, loop: g, fireAndForget: p } = h, y = e.step();
      if (y.before(() => {
        by(h);
      }), f && f > 0)
        if (p) {
          if (g && h.id) {
            const v = h.id, b = f;
            y.before(() => {
              setTimeout(() => Es(v), b);
            });
          }
        } else
          e.delay(f), g && e.step().before(() => {
            Es(h.id);
          });
      continue;
    }
    if (s.stopSound != null) {
      if (r != null && o < r) continue;
      const h = s.stopSound;
      e.step().before(() => {
        Es(h);
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
        bf(s.parallel.branches, n);
        continue;
      }
      const h = s.parallel, f = h.branches.map((g) => (p) => vf(g, p, n));
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
          Oe(s.before, n), Di(s.before, n);
        } catch (h) {
          console.warn(`[${T}] Cinematic: error applying skipped step.before:`, h);
        }
      if (s.after)
        try {
          Oe(s.after, n), Di(s.after, n);
        } catch (h) {
          console.warn(`[${T}] Cinematic: error applying skipped step.after:`, h);
        }
      continue;
    }
    const l = o, u = e.step();
    s.before && u.before(() => {
      var h;
      try {
        Oe(s.before, n), Di(s.before, n);
      } catch (f) {
        throw console.error(`[${T}] Cinematic: error in step.before callback on scene ${(h = canvas.scene) == null ? void 0 : h.id}:`, f), f;
      }
    });
    const d = s.duration ?? 500;
    for (const h of s.tweens) {
      const f = yf(h, n);
      f && u.add(f.type, f.params, { ...f.opts, durationMS: d });
    }
    u.after(() => {
      var h;
      try {
        s.after && (Oe(s.after, n), Di(s.after, n)), a == null || a(l);
      } catch (f) {
        throw console.error(`[${T}] Cinematic: error in step.after callback on scene ${(h = canvas.scene) == null ? void 0 : h.id}:`, f), f;
      }
    });
  }
}
c(vf, "compileCinematicEntries");
function Pi(t, e, n) {
  if (t != null) {
    if (typeof t != "object" || Array.isArray(t)) {
      n.push({ path: e, level: "error", message: `Expected object, got ${Array.isArray(t) ? "array" : typeof t}` });
      return;
    }
    for (const [i, r] of Object.entries(t))
      (typeof r != "object" || r === null || Array.isArray(r)) && n.push({ path: `${e}["${i}"]`, level: "error", message: `Expected property overrides object, got ${Array.isArray(r) ? "array" : typeof r}` });
  }
}
c(Pi, "validateStateMap");
function _l(t, e, n, i) {
  var r;
  for (let a = 0; a < t.length; a++) {
    const o = t[a], s = `${e}[${a}]`;
    if (!(o.delay != null || o.await != null || o.emit != null) && !(o.transitionTo != null || o.sound != null || o.stopSound != null)) {
      if ((r = o.parallel) != null && r.branches) {
        for (let l = 0; l < o.parallel.branches.length; l++)
          _l(o.parallel.branches[l], `${s}.parallel.branches[${l}]`, n, i);
        continue;
      }
      if (Pi(o.before, `${s}.before`, i), Pi(o.after, `${s}.after`, i), o.tweens)
        for (let l = 0; l < o.tweens.length; l++) {
          const u = o.tweens[l], d = `${s}.tweens[${l}]`;
          if (!u.type) {
            i.push({ path: d, level: "error", message: "Missing 'type' field" });
            continue;
          }
          const h = tr(u.type);
          if (!h) {
            i.push({ path: d, level: "error", message: `Unknown tween type: "${u.type}"` });
            continue;
          }
          if (n)
            try {
              const f = yf(u, n);
              f ? h.validate(f.params) : u.target && i.push({ path: d, level: "warn", message: `Target "${u.target}" could not be resolved for compilation` });
            } catch (f) {
              i.push({ path: d, level: "error", message: f.message });
            }
          n && u.target && !n.has(u.target) && i.push({ path: `${d}.target`, level: "warn", message: `Target "${u.target}" is not resolved` });
        }
    }
  }
}
c(_l, "validateEntries");
function wy(t, e = null) {
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
      Pi(s.setup, `${l}.setup`, n), Pi(s.landing, `${l}.landing`, n), s.timeline && Array.isArray(s.timeline) && _l(s.timeline, `${l}.timeline`, e, n), s.next && typeof s.next == "string" && !t.segments[s.next] && n.push({ path: `${l}.next`, level: "error", message: `Next segment "${s.next}" not found` });
    }
  } else
    Pi(t.setup, "setup", n), Pi(t.landing, "landing", n), t.timeline && Array.isArray(t.timeline) && _l(t.timeline, "timeline", e, n);
  return n;
}
c(wy, "validateCinematicDeep");
const Ss = 5, lu = /* @__PURE__ */ new Set(["click", "tile-click", "keypress"]);
var le, he, Ue, Me, gt, mr, Fl, wf, Y, _e, Aa, Le, wt;
const se = class se {
  constructor(e = null, { loadedHash: n = null, cinematicName: i = "default", segmentName: r = null } = {}) {
    k(this, Y);
    k(this, le);
    k(this, he);
    k(this, Ue);
    k(this, Me);
    var o;
    L(this, le, e ?? se.empty()), L(this, he, i), L(this, Me, n);
    const a = (o = m(this, le).cinematics) == null ? void 0 : o[m(this, he)];
    L(this, Ue, r ?? (a == null ? void 0 : a.entry) ?? "main");
  }
  static empty() {
    return {
      version: Ss,
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
    var v;
    const { trigger: n, tracking: i, synchronized: r, setup: a, landing: o, timeline: s = [] } = e;
    if (!s.some(
      (b) => {
        var w;
        return b.await != null && lu.has(((w = b.await) == null ? void 0 : w.event) ?? "click");
      }
    )) {
      const b = s.filter((I) => I.transitionTo == null), w = s.find((I) => I.transitionTo != null), C = { timeline: b };
      if (a && Object.keys(a).length && (C.setup = a), o && Object.keys(o).length && (C.landing = o), w) {
        const I = w.transitionTo;
        I.scene && I.cinematic ? C.next = { segment: I.cinematic, scene: I.scene } : I.cinematic;
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
    let d = [], h = 1, f = null;
    const g = [];
    function p() {
      const b = `segment-${h++}`, w = { timeline: [...d] };
      return f && (w.gate = f), u[b] = w, g.push(b), d = [], f = null, b;
    }
    c(p, "flushSegment");
    for (const b of s)
      if (b.transitionTo == null) {
        if (b.await != null && lu.has(((v = b.await) == null ? void 0 : v.event) ?? "click")) {
          p(), f = { ...b.await }, delete f.event, f = { event: b.await.event ?? "click", ...f };
          continue;
        }
        d.push(b);
      }
    (d.length > 0 || f) && p();
    for (let b = 0; b < g.length - 1; b++)
      u[g[b]].next = g[b + 1];
    g.length > 0 && (a && Object.keys(a).length && (u[g[0]].setup = a), o && Object.keys(o).length && (u[g[g.length - 1]].landing = o));
    const y = s.find((b) => b.transitionTo != null);
    if (y && g.length > 0) {
      const b = y.transitionTo, w = u[g[g.length - 1]];
      b.scene && b.cinematic && (w.next = { segment: b.cinematic, scene: b.scene });
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
      (i = a.timeline) != null && i.length && (a.timeline = S(r = se, gt, Fl).call(r, a.timeline));
    return n;
  }
  static fromScene(e, n = "default") {
    var o;
    const i = e == null ? void 0 : e.getFlag(T, "cinematic");
    let r = i ? foundry.utils.deepClone(i) : null;
    const a = i ? S(o = se, gt, wf).call(o, i) : null;
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
      r.version = Ss;
    }
    return new se(r, { loadedHash: a, cinematicName: n });
  }
  /**
   * Check if the scene's cinematic flag has been modified since this state was loaded.
   * @param {object} scene  The Foundry scene document
   * @returns {boolean} true if scene data differs from what was loaded
   */
  isStale(e) {
    if (!m(this, Me)) return !1;
    const n = e == null ? void 0 : e.getFlag(T, "cinematic");
    return n ? !foundry.utils.objectsEqual(n, m(this, Me)) : !1;
  }
  // ── Read ──────────────────────────────────────────────────────────────
  get data() {
    return m(this, le);
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
    return m(this, he);
  }
  // ── Segment accessors ────────────────────────────────────────────────
  get segments() {
    return m(this, Y, _e).segments;
  }
  get entry() {
    return m(this, Y, _e).entry;
  }
  get activeSegmentName() {
    return m(this, Ue);
  }
  get activeSegment() {
    var e;
    return ((e = m(this, Y, _e).segments) == null ? void 0 : e[m(this, Ue)]) ?? null;
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
    return Object.keys(m(this, le).cinematics);
  }
  switchCinematic(e) {
    if (!m(this, le).cinematics[e]) return this;
    const n = m(this, le).cinematics[e];
    return new se(foundry.utils.deepClone(m(this, le)), {
      loadedHash: m(this, Me),
      cinematicName: e,
      segmentName: n.entry ?? "main"
    });
  }
  addCinematic(e) {
    if (!e || m(this, le).cinematics[e]) return this;
    const n = foundry.utils.deepClone(m(this, le));
    return n.cinematics[e] = se.emptyCinematic(), new se(n, {
      loadedHash: m(this, Me),
      cinematicName: e,
      segmentName: "main"
    });
  }
  removeCinematic(e) {
    if (Object.keys(m(this, le).cinematics).length <= 1) return this;
    if (!m(this, le).cinematics[e]) return this;
    const i = foundry.utils.deepClone(m(this, le));
    delete i.cinematics[e];
    const r = m(this, he) === e ? Object.keys(i.cinematics)[0] : m(this, he), a = i.cinematics[r];
    return new se(i, {
      loadedHash: m(this, Me),
      cinematicName: r,
      segmentName: (a == null ? void 0 : a.entry) ?? "main"
    });
  }
  renameCinematic(e, n) {
    if (!e || !n || e === n) return this;
    if (!m(this, le).cinematics[e]) return this;
    if (m(this, le).cinematics[n]) return this;
    const i = foundry.utils.deepClone(m(this, le)), r = {};
    for (const [o, s] of Object.entries(i.cinematics))
      r[o === e ? n : o] = s;
    i.cinematics = r;
    const a = m(this, he) === e ? n : m(this, he);
    return new se(i, {
      loadedHash: m(this, Me),
      cinematicName: a,
      segmentName: m(this, Ue)
    });
  }
  // ── Cinematic-level mutations ─────────────────────────────────────────
  setTrigger(e) {
    return S(this, Y, Aa).call(this, { trigger: e });
  }
  setTracking(e) {
    return S(this, Y, Aa).call(this, { tracking: e });
  }
  setSynchronized(e) {
    return S(this, Y, Aa).call(this, { synchronized: e });
  }
  // ── Segment-level mutations (setup/landing now live on segments) ──────
  setSetup(e) {
    return S(this, Y, Le).call(this, { setup: e });
  }
  setLanding(e) {
    return S(this, Y, Le).call(this, { landing: e });
  }
  // ── Segment management methods ────────────────────────────────────────
  switchSegment(e) {
    var n;
    return (n = m(this, Y, _e).segments) != null && n[e] ? new se(foundry.utils.deepClone(m(this, le)), {
      loadedHash: m(this, Me),
      cinematicName: m(this, he),
      segmentName: e
    }) : this;
  }
  addSegment(e, n = null) {
    var a;
    if (!e || (a = m(this, Y, _e).segments) != null && a[e]) return this;
    const i = foundry.utils.deepClone(m(this, le)), r = i.cinematics[m(this, he)];
    if (r.segments[e] = se.emptySegment(), n && r.segments[n]) {
      const o = r.segments[n].next;
      r.segments[n].next = e, o && (r.segments[e].next = o);
    }
    return new se(i, {
      loadedHash: m(this, Me),
      cinematicName: m(this, he),
      segmentName: e
    });
  }
  removeSegment(e) {
    var s, l;
    if (Object.keys(m(this, Y, _e).segments ?? {}).length <= 1) return this;
    if (!((s = m(this, Y, _e).segments) != null && s[e])) return this;
    const i = foundry.utils.deepClone(m(this, le)), r = i.cinematics[m(this, he)], a = r.segments[e].next;
    for (const [, u] of Object.entries(r.segments))
      (u.next === e || typeof u.next == "object" && ((l = u.next) == null ? void 0 : l.segment) === e) && (u.next = a ?? void 0, u.next || delete u.next);
    delete r.segments[e], r.entry === e && (r.entry = Object.keys(r.segments)[0]);
    const o = m(this, Ue) === e ? r.entry : m(this, Ue);
    return new se(i, {
      loadedHash: m(this, Me),
      cinematicName: m(this, he),
      segmentName: o
    });
  }
  renameSegment(e, n) {
    var s, l, u;
    if (!e || !n || e === n) return this;
    if (!((s = m(this, Y, _e).segments) != null && s[e])) return this;
    if ((l = m(this, Y, _e).segments) != null && l[n]) return this;
    const i = foundry.utils.deepClone(m(this, le)), r = i.cinematics[m(this, he)], a = {};
    for (const [d, h] of Object.entries(r.segments))
      a[d === e ? n : d] = h;
    r.segments = a;
    for (const [, d] of Object.entries(r.segments))
      d.next === e ? d.next = n : typeof d.next == "object" && ((u = d.next) == null ? void 0 : u.segment) === e && (d.next.segment = n);
    r.entry === e && (r.entry = n);
    const o = m(this, Ue) === e ? n : m(this, Ue);
    return new se(i, {
      loadedHash: m(this, Me),
      cinematicName: m(this, he),
      segmentName: o
    });
  }
  setSegmentGate(e) {
    return S(this, Y, Le).call(this, { gate: e ?? void 0 });
  }
  setSegmentNext(e) {
    return S(this, Y, Le).call(this, { next: e ?? void 0 });
  }
  setSegmentSetup(e) {
    return S(this, Y, Le).call(this, { setup: e });
  }
  setSegmentLanding(e) {
    return S(this, Y, Le).call(this, { landing: e });
  }
  listSegmentNames() {
    return Object.keys(m(this, Y, _e).segments ?? {});
  }
  // ── Timeline entry mutations (scoped to active segment) ──────────────
  addStep(e = -1) {
    const n = [...this.activeSegment.timeline], i = { duration: 1e3, tweens: [] };
    return e < 0 || e >= n.length ? n.push(i) : n.splice(e, 0, i), S(this, Y, Le).call(this, { timeline: n });
  }
  addDelay(e = -1, n = 1e3) {
    const i = [...this.activeSegment.timeline], r = { delay: n };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), S(this, Y, Le).call(this, { timeline: i });
  }
  addAwait(e = -1, n = null) {
    return console.warn(`[${T}] CinematicState.addAwait() is deprecated in v4. Use segment gates instead.`), this;
  }
  addEmit(e = -1, n = "") {
    const i = [...this.activeSegment.timeline], r = { emit: n };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), S(this, Y, Le).call(this, { timeline: i });
  }
  addParallel(e = -1) {
    const n = [...this.activeSegment.timeline], i = { parallel: { branches: [[], []], join: "all", overflow: "detach" } };
    return e < 0 || e >= n.length ? n.push(i) : n.splice(e, 0, i), S(this, Y, Le).call(this, { timeline: n });
  }
  addTransitionTo(e = -1, n = null) {
    return console.warn(`[${T}] CinematicState.addTransitionTo() is deprecated in v4. Use segment next edges instead.`), this;
  }
  addSound(e = -1, n = null) {
    const i = [...this.activeSegment.timeline], r = { sound: n ?? { src: "", volume: 0.8, loop: !1, duration: 0, fireAndForget: !1 } };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), S(this, Y, Le).call(this, { timeline: i });
  }
  addStopSound(e = -1, n = "") {
    const i = [...this.activeSegment.timeline], r = { stopSound: n };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), S(this, Y, Le).call(this, { timeline: i });
  }
  moveEntry(e, n) {
    if (e === n) return this;
    const i = [...this.activeSegment.timeline];
    if (e < 0 || e >= i.length) return this;
    if (n < 0 || n >= i.length) return this;
    const [r] = i.splice(e, 1);
    return i.splice(n, 0, r), S(this, Y, Le).call(this, { timeline: i });
  }
  removeEntry(e) {
    const n = [...this.activeSegment.timeline];
    return e < 0 || e >= n.length ? this : (n.splice(e, 1), S(this, Y, Le).call(this, { timeline: n }));
  }
  updateEntry(e, n) {
    const i = this.activeSegment.timeline.map((r, a) => a !== e ? r : { ...foundry.utils.deepClone(r), ...n });
    return S(this, Y, Le).call(this, { timeline: i });
  }
  // ── Tween mutations ──────────────────────────────────────────────────
  addTween(e, n = null) {
    const i = { type: "tile-prop", target: "", attribute: "alpha", value: 1 };
    return S(this, Y, wt).call(this, e, (r) => {
      const a = [...r.tweens ?? [], n ?? i];
      return { ...r, tweens: a };
    });
  }
  updateTween(e, n, i) {
    return S(this, Y, wt).call(this, e, (r) => {
      const a = (r.tweens ?? []).map((o, s) => s !== n ? o : { ...o, ...i });
      return { ...r, tweens: a };
    });
  }
  removeTween(e, n) {
    return S(this, Y, wt).call(this, e, (i) => {
      const r = (i.tweens ?? []).filter((a, o) => o !== n);
      return { ...i, tweens: r };
    });
  }
  updateStepDuration(e, n) {
    return S(this, Y, wt).call(this, e, (i) => ({ ...i, duration: Math.max(0, n) }));
  }
  // ── Parallel branch mutations ────────────────────────────────────────
  addBranch(e) {
    return S(this, Y, wt).call(this, e, (n) => {
      if (!n.parallel) return n;
      const i = [...n.parallel.branches, []];
      return { ...n, parallel: { ...n.parallel, branches: i } };
    });
  }
  removeBranch(e, n) {
    return S(this, Y, wt).call(this, e, (i) => {
      if (!i.parallel) return i;
      const r = i.parallel.branches.filter((a, o) => o !== n);
      return r.length < 1 ? i : { ...i, parallel: { ...i.parallel, branches: r } };
    });
  }
  addBranchEntry(e, n, i = null) {
    const r = { duration: 1e3, tweens: [] };
    return S(this, Y, wt).call(this, e, (a) => {
      if (!a.parallel) return a;
      const o = a.parallel.branches.map((s, l) => l !== n ? s : [...s, i ?? r]);
      return { ...a, parallel: { ...a.parallel, branches: o } };
    });
  }
  removeBranchEntry(e, n, i) {
    return S(this, Y, wt).call(this, e, (r) => {
      if (!r.parallel) return r;
      const a = r.parallel.branches.map((o, s) => s !== n ? o : o.filter((l, u) => u !== i));
      return { ...r, parallel: { ...r.parallel, branches: a } };
    });
  }
  updateBranchEntry(e, n, i, r) {
    return S(this, Y, wt).call(this, e, (a) => {
      if (!a.parallel) return a;
      const o = a.parallel.branches.map((s, l) => l !== n ? s : s.map((u, d) => d !== i ? u : { ...foundry.utils.deepClone(u), ...r }));
      return { ...a, parallel: { ...a.parallel, branches: o } };
    });
  }
  moveBranchEntry(e, n, i, r) {
    return i === r ? this : S(this, Y, wt).call(this, e, (a) => {
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
    const n = { ...foundry.utils.deepClone(m(this, le)), version: Ss };
    await e.setFlag(T, "cinematic", n);
  }
  /** Returns the active cinematic's data (for validation/export). */
  toJSON() {
    return foundry.utils.deepClone(m(this, Y, _e));
  }
  /** Returns the entire v4 flag structure. */
  toFullJSON() {
    return foundry.utils.deepClone(m(this, le));
  }
};
le = new WeakMap(), he = new WeakMap(), Ue = new WeakMap(), Me = new WeakMap(), gt = new WeakSet(), mr = /* @__PURE__ */ c(function(e) {
  const { duration: n, detach: i, ...r } = e;
  return r;
}, "#stripTween"), Fl = /* @__PURE__ */ c(function(e) {
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
          return S(d = se, gt, Fl).call(d, u);
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
        tweens: u.map(S(se, gt, mr))
      });
    } else if (o.length === 0) {
      const l = Math.max(500, ...s.map((h) => h.duration ?? 0)), { tweens: u, ...d } = a;
      n.push({
        ...d,
        duration: l,
        tweens: s.map(S(se, gt, mr))
      });
    } else {
      const l = Math.max(500, ...o.map((f) => f.duration ?? 0)), u = Math.max(500, ...s.map((f) => f.duration ?? 0)), { tweens: d, ...h } = a;
      n.push({
        parallel: {
          branches: [
            [{ ...h, duration: l, tweens: o.map(S(se, gt, mr)) }],
            [{ duration: u, tweens: s.map(S(se, gt, mr)) }]
          ],
          join: "all",
          overflow: "detach"
        }
      });
    }
  }
  return n;
}, "#migrateTimelineV5"), wf = /* @__PURE__ */ c(function(e) {
  return foundry.utils.deepClone(e);
}, "#computeHash"), Y = new WeakSet(), _e = /* @__PURE__ */ c(function() {
  return m(this, le).cinematics[m(this, he)];
}, "#active"), // ── Internal ─────────────────────────────────────────────────────────
/** Clone the full state with a patch to the active cinematic (cinematic-level props). */
Aa = /* @__PURE__ */ c(function(e) {
  const n = foundry.utils.deepClone(m(this, le));
  return Object.assign(n.cinematics[m(this, he)], e), new se(n, {
    loadedHash: m(this, Me),
    cinematicName: m(this, he),
    segmentName: m(this, Ue)
  });
}, "#cloneActive"), /** Clone the full state with a patch to the active segment within the active cinematic. */
Le = /* @__PURE__ */ c(function(e) {
  const n = foundry.utils.deepClone(m(this, le)), i = n.cinematics[m(this, he)].segments[m(this, Ue)];
  if (!i) return this;
  Object.assign(i, e);
  for (const [r, a] of Object.entries(i))
    a === void 0 && delete i[r];
  return new se(n, {
    loadedHash: m(this, Me),
    cinematicName: m(this, he),
    segmentName: m(this, Ue)
  });
}, "#cloneActiveSegment"), /** Mutate a single timeline entry within the active segment. */
wt = /* @__PURE__ */ c(function(e, n) {
  const i = this.activeSegment;
  if (!i || e < 0 || e >= i.timeline.length) return this;
  const r = i.timeline.map((a, o) => o !== e ? a : n(foundry.utils.deepClone(a)));
  return S(this, Y, Le).call(this, { timeline: r });
}, "#mutateEntry"), k(se, gt), c(se, "CinematicState");
let Wt = se;
const cu = [
  { value: "tile-prop", label: "Tile Prop" },
  { value: "light-color", label: "Light Color" },
  { value: "light-state", label: "Light State" },
  { value: "particles-prop", label: "Particles Prop" },
  { value: "camera-pan", label: "Camera Pan" },
  { value: "token-prop", label: "Token Prop" },
  { value: "drawing-prop", label: "Drawing Prop" },
  { value: "sound-prop", label: "Sound Prop" }
], Ef = {
  "tile-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y, width, height" },
  "token-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y" },
  "drawing-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y" },
  "sound-prop": { form: "prop", attribute: "volume", value: 0.5, placeholder: "volume, radius" },
  "particles-prop": { form: "particles", attribute: "alpha", value: 1, placeholder: "alpha, rate, speed, size" },
  "camera-pan": { form: "camera", x: 0, y: 0, scale: 1 },
  "light-color": { form: "lightColor", toColor: "#ffffff", toAlpha: "", mode: "oklch" },
  "light-state": { form: "lightState", enabled: !0 }
}, Ey = [
  { value: "canvasReady", label: "Canvas Ready" },
  { value: "manual", label: "Manual Only" }
];
function uu(t) {
  return t && (t.split("/").pop() || "").replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "-") || "";
}
c(uu, "soundIdFromPath");
function du(t) {
  return t ? new Promise((e) => {
    const n = new Audio(t);
    n.addEventListener("loadedmetadata", () => {
      e(Math.round(n.duration * 1e3));
    }), n.addEventListener("error", () => e(0));
  }) : Promise.resolve(0);
}
c(du, "loadAudioDurationMs");
const Pn = 40, br = 24, Ar = 50, fu = 50, Qn = 60, ni = 10, Cs = 16, Sf = 40, Cf = 20, Sy = 90, mu = 70, hu = 8;
function ts(t) {
  return { stepDuration: Math.max(500, t.duration ?? 500), detachOverflow: 0 };
}
c(ts, "computeStepDurations");
function Cy(t) {
  var i;
  const e = ((i = t.parallel) == null ? void 0 : i.branches) ?? [];
  let n = 0;
  for (const r of e) {
    let a = 0;
    for (const o of r)
      o.delay != null ? a += o.delay : o.await != null || o.emit != null || (o.sound != null ? a += o.sound.fireAndForget ? 0 : o.sound.duration ?? 0 : o.stopSound != null || (a += ts(o).stepDuration));
    n = Math.max(n, a);
  }
  return Math.max(500, n);
}
c(Cy, "computeParallelDuration");
function yc(t) {
  return t.reduce((e, n) => n.delay != null ? e + n.delay : n.await != null || n.emit != null || n.transitionTo != null ? e : n.sound != null ? e + (n.sound.fireAndForget ? 0 : n.sound.duration ?? 0) : n.stopSound != null ? e : n.parallel != null ? e + Cy(n) : e + ts(n).stepDuration, 0);
}
c(yc, "computeTotalDuration");
function Ty(t, e) {
  if (t <= 0) return 0.1;
  const n = e / t;
  return Math.max(0.03, Math.min(0.5, n));
}
c(Ty, "computeScale");
function Tf(t) {
  const e = t.tweens ?? [];
  if (e.length === 0) return "Empty";
  const n = e[0], i = (n.target ?? "").replace(/^tag:/, "#"), r = n.attribute ?? "";
  return n.type === "camera-pan" ? "Pan" : r === "alpha" ? `Fade ${i}` : r === "x" || r === "y" ? `Move ${i}` : n.type === "light-color" ? `Light ${i}` : n.type === "sound-prop" ? `Sound ${i}` : i ? `${i}` : "Step";
}
c(Tf, "deriveStepLabel");
function Ly(t, e, n, i, r) {
  var u, d;
  const a = [], o = [], s = [];
  let l = e;
  for (let h = 0; h < t.length; h++) {
    const f = t[h], g = `${i}.${h}`, p = r === g;
    if (f.delay != null) {
      const y = Math.max(Cf, f.delay * n);
      a.push({ type: "delay", leftPx: l, widthPx: y, label: `${f.delay}ms`, entryPath: g, selected: p }), l += y;
    } else if (f.await != null) {
      const y = ((u = f.await) == null ? void 0 : u.event) ?? "click", v = y === "tile-click" ? "fa-hand-pointer" : y === "signal" ? "fa-bolt" : "fa-pause";
      a.push({ type: "await", leftPx: l, widthPx: Cs, label: y, entryPath: g, selected: p, isGate: !0, gateIcon: v }), ((d = f.await) == null ? void 0 : d.event) === "signal" && s.push({ signal: f.await.signal, centerPx: l + Cs / 2 }), l += Cs;
    } else if (f.emit != null)
      a.push({ type: "emit", leftPx: l, widthPx: ni, label: "emit", entryPath: g, selected: p, isMarker: !0 }), o.push({ signal: f.emit, centerPx: l + ni / 2 });
    else if (f.sound != null) {
      const y = (f.sound.src || "").split("/").pop() || "Sound", v = f.sound.duration ?? 0;
      if (f.sound.fireAndForget ?? !1)
        a.push({ type: "sound", leftPx: l, widthPx: ni, label: y, entryPath: g, selected: p, isMarker: !0 });
      else {
        const w = v > 0 ? Math.max(Qn, v * n) : Qn, C = (f.sound.loop ?? !1) && v <= 0;
        a.push({ type: "sound", leftPx: l, widthPx: w, label: y, entryPath: g, selected: p, hasTrailingArrow: C }), l += w;
      }
    } else if (f.stopSound != null)
      a.push({ type: "stopSound", leftPx: l, widthPx: ni, label: "Stop", entryPath: g, selected: p, isMarker: !0 });
    else {
      const { stepDuration: y } = ts(f), v = Math.max(Sf, y * n), b = Tf(f);
      a.push({ type: "step", leftPx: l, widthPx: v, label: b, entryPath: g, selected: p }), l += v;
    }
  }
  return { blocks: a, width: l - e, emits: o, awaits: s };
}
c(Ly, "computeBranchLane");
function gu(t) {
  return br + t * Pn;
}
c(gu, "laneIndexToY");
function Iy(t, e) {
  const n = [];
  for (const i of t.emits)
    for (const r of t.awaits) {
      if (i.signal !== r.signal) continue;
      const a = i.centerPx, o = gu(i.laneIndex) + Pn / 2, s = r.centerPx, l = gu(r.laneIndex) + Pn / 2, u = l - o, d = (a + s) / 2, h = o + Math.sign(u || 1) * Math.min(40, Math.abs(u) * 0.5 + 20), f = l - Math.sign(u || 1) * Math.min(40, Math.abs(u) * 0.5 + 20);
      n.push({
        pathD: `M ${a} ${o} C ${d} ${h}, ${d} ${f}, ${s} ${l}`,
        signal: i.signal
      });
    }
  return n;
}
c(Iy, "computeSignalArcs");
function Oy(t, e) {
  const n = [];
  if (t <= 0) return n;
  const i = e * 1e3;
  let r;
  i >= 200 ? r = 500 : i >= 80 ? r = 1e3 : i >= 40 ? r = 2e3 : r = 5e3;
  for (let a = 0; a <= t + r; a += r) {
    const o = a >= 1e3 ? `${(a / 1e3).toFixed(a % 1e3 === 0 ? 0 : 1)}s` : `${a}ms`;
    n.push({ px: Ar + a * e, label: o });
  }
  return n;
}
c(Oy, "computeTimeMarkers");
function Ay(t) {
  const e = [];
  for (let n = 0; n < t.length - 1; n++) {
    const i = t[n], r = t[n + 1], a = i.leftPx + i.widthPx + (r.leftPx - (i.leftPx + i.widthPx)) / 2, o = br + Pn / 2;
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
c(Ay, "computeInsertionPoints");
function ky(t, { selectedPath: e, windowWidth: n }) {
  const i = yc(t), r = n - 70 - 100, a = Ty(i, r), o = [], s = [], l = { emits: [], awaits: [] }, u = [];
  o.push({
    type: "setup",
    leftPx: 0,
    widthPx: Ar,
    label: "Setup",
    entryPath: "setup",
    selected: e === "setup"
  });
  let d = Ar;
  for (let w = 0; w < t.length; w++) {
    const C = t[w], I = `timeline.${w}`, A = e === I;
    if (C.delay != null) {
      const O = Math.max(Cf, C.delay * a);
      o.push({
        type: "delay",
        leftPx: d,
        widthPx: O,
        label: `${C.delay}ms`,
        entryPath: I,
        selected: A
      }), d += O;
    } else if (C.emit != null)
      o.push({
        type: "emit",
        leftPx: d,
        widthPx: ni,
        label: "Emit",
        entryPath: I,
        selected: A,
        isMarker: !0
      }), l.emits.push({
        signal: C.emit,
        centerPx: d + ni / 2,
        laneIndex: 0
      });
    else if (C.sound != null) {
      const O = (C.sound.src || "").split("/").pop() || "Sound", M = C.sound.duration ?? 0;
      if (C.sound.fireAndForget ?? !1) {
        const j = M > 0 ? Math.max(Qn, M * a) : Qn, D = (C.sound.loop ?? !1) && M <= 0, P = {
          type: "sound",
          leftPx: d,
          widthPx: j,
          label: O,
          entryPath: I,
          selected: A,
          hasTrailingArrow: D
        };
        let $ = !1;
        for (const R of u)
          if (R.rightEdgePx <= d) {
            R.blocks.push(P), R.rightEdgePx = d + j, $ = !0;
            break;
          }
        $ || u.push({
          label: "♫ F&F",
          blocks: [P],
          rightEdgePx: d + j
        });
      } else {
        const j = M > 0 ? Math.max(Qn, M * a) : Qn, D = (C.sound.loop ?? !1) && M <= 0;
        o.push({
          type: "sound",
          leftPx: d,
          widthPx: j,
          label: O,
          entryPath: I,
          selected: A,
          hasTrailingArrow: D
        }), d += j;
      }
    } else if (C.stopSound != null)
      o.push({
        type: "stopSound",
        leftPx: d,
        widthPx: ni,
        label: "Stop",
        entryPath: I,
        selected: A,
        isMarker: !0
      });
    else if (C.parallel != null) {
      const O = C.parallel.branches ?? [], M = d, _ = [];
      let j = 0;
      for (let P = 0; P < O.length; P++) {
        const $ = `timeline.${w}.parallel.branches.${P}`, { blocks: R, width: B, emits: W, awaits: H } = Ly(O[P], M, a, $, e);
        _.push({ label: `Br ${P + 1}`, blocks: R }), j = Math.max(j, B);
        const U = s.length * 10 + P + 1;
        for (const K of W) l.emits.push({ ...K, laneIndex: U });
        for (const K of H) l.awaits.push({ ...K, laneIndex: U });
      }
      const D = Math.max(Qn, j);
      o.push({
        type: "parallel",
        leftPx: M,
        widthPx: D,
        label: `${O.length} br`,
        entryPath: I,
        selected: A
      }), s.push({ parallelEntryIndex: w, startPx: M, lanes: _ }), d += D;
    } else {
      const { stepDuration: O } = ts(C), M = Math.max(Sf, O * a), _ = Tf(C);
      o.push({
        type: "step",
        leftPx: d,
        widthPx: M,
        label: _,
        entryPath: I,
        selected: A
      }), d += M;
    }
  }
  o.push({
    type: "landing",
    leftPx: d,
    widthPx: fu,
    label: "Landing",
    entryPath: "landing",
    selected: e === "landing"
  }), d += fu;
  const h = s.flatMap((w) => w.lanes), f = h.length;
  for (const w of u)
    h.push({ label: w.label, blocks: w.blocks });
  const g = Iy(l, h.length), p = [];
  for (let w = 0; w < u.length; w++) {
    const C = f + w;
    for (const I of u[w].blocks) {
      const A = I.leftPx, O = br + Pn, M = br + (1 + C) * Pn + Pn / 2;
      p.push({ x: A, y1: O, y2: M });
    }
  }
  const y = Oy(i, a), v = Ay(o), b = br + (1 + h.length) * Pn;
  return {
    mainBlocks: o,
    subLanes: h,
    signalArcs: g,
    fafConnectors: p,
    timeMarkers: y,
    insertionPoints: v,
    totalWidthPx: Math.max(d, 200),
    swimlaneHeightPx: b,
    totalDurationMs: i
  };
}
c(ky, "computeLanes");
function My(t) {
  if (t <= 0) return "0s";
  if (t < 1e3) return `${t}ms`;
  const e = t / 1e3;
  return e % 1 === 0 ? `${e}s` : `${e.toFixed(1)}s`;
}
c(My, "formatDuration");
function Ny(t, e) {
  var g, p, y, v;
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
  let u = hu;
  for (const b of o) {
    const w = n[b], C = yc(w.timeline ?? []), I = My(C), A = b === i, O = b === e, M = !a.has(b), _ = Sy;
    l.push({
      name: b,
      durationMs: C,
      durationLabel: I,
      isEntry: A,
      isActive: O,
      isOrphan: M,
      leftPx: u,
      widthPx: _,
      hasGate: !!w.gate,
      gateEvent: ((g = w.gate) == null ? void 0 : g.event) ?? null
    }), u += _ + mu;
  }
  const d = [], h = new Map(l.map((b) => [b.name, b]));
  for (const b of o) {
    const w = n[b];
    if (!w.next) continue;
    const C = typeof w.next == "string" ? w.next : (p = w.next) == null ? void 0 : p.segment;
    if (!C) continue;
    const I = h.get(b), A = h.get(C);
    if (!I || !A) continue;
    const O = n[C], M = ((y = O == null ? void 0 : O.gate) == null ? void 0 : y.event) ?? null, _ = typeof w.next == "object" && ((v = w.next) == null ? void 0 : v.scene);
    d.push({
      fromName: b,
      toName: C,
      gateLabel: M,
      isCrossScene: _,
      fromRightPx: I.leftPx + I.widthPx,
      toLeftPx: A.leftPx
    });
  }
  const f = u - mu + hu;
  return { nodes: l, edges: d, totalWidthPx: f };
}
c(Ny, "computeSegmentGraph");
function Bn(t) {
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
c(Bn, "parseEntryPath");
function eo(t, e) {
  var i, r, a, o;
  const n = Bn(t);
  return n ? n.type === "setup" ? e.setup : n.type === "landing" ? e.landing : n.type === "timeline" ? e.timeline[n.index] : n.type === "branch" ? (o = (a = (r = (i = e.timeline[n.index]) == null ? void 0 : i.parallel) == null ? void 0 : r.branches) == null ? void 0 : a[n.branchIndex]) == null ? void 0 : o[n.branchEntryIndex] : null : null;
}
c(eo, "getEntryAtPath");
function pu(t) {
  const e = Bn(t);
  return !e || e.type !== "timeline" ? null : e.index;
}
c(pu, "getTimelineIndexFromPath");
function $y(t) {
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
c($y, "countUniqueTargets");
function xy(t, e) {
  var i, r, a;
  const n = Bn(t);
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
c(xy, "stepNumberForPath");
function _y(t) {
  return {
    isSetup: !0,
    targetCount: Object.keys(t.setup ?? {}).length
  };
}
c(_y, "buildSetupDetail");
function Fy(t) {
  return {
    isLanding: !0,
    targetCount: Object.keys(t.landing ?? {}).length
  };
}
c(Fy, "buildLandingDetail");
function Dy(t) {
  return { type: "delay", isDelay: !0, delay: t.delay };
}
c(Dy, "buildDelayDetail");
function Py(t) {
  return { type: "emit", isEmit: !0, signal: t.emit };
}
c(Py, "buildEmitDetail");
function Ry(t) {
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
c(Ry, "buildSoundDetail");
function Hy(t) {
  return {
    type: "stopSound",
    isStopSound: !0,
    stopSoundId: t.stopSound
  };
}
c(Hy, "buildStopSoundDetail");
function qy(t, e) {
  var o;
  const n = t.parallel, i = n.join ?? "all", r = n.overflow ?? "detach", a = (n.branches ?? []).map((s, l) => ({
    branchIndex: l,
    label: `Branch ${l + 1}`,
    entries: (s ?? []).map((u, d) => {
      var C, I;
      const h = u.delay != null, f = u.await != null, g = u.emit != null, p = u.sound != null, y = u.stopSound != null, v = !h && !f && !g && !p && !y;
      let b, w;
      return h ? (b = `${u.delay}ms`, w = "delay") : f ? (b = "Await", w = ((C = u.await) == null ? void 0 : C.event) ?? "click") : g ? (b = "Emit", w = u.emit || "(unnamed)") : p ? (b = "Sound", w = (u.sound.src || "").split("/").pop() || "(none)") : y ? (b = "Stop Sound", w = u.stopSound || "(no id)") : (b = "Step", w = `${((I = u.tweens) == null ? void 0 : I.length) ?? 0} tweens`), { branchEntryIndex: d, isDelay: h, isAwait: f, isEmit: g, isSound: p, isStopSound: y, isStep: v, label: b, sub: w };
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
c(qy, "buildParallelDetail");
function jy(t, e, n, i) {
  const r = fc(), a = (t.tweens ?? []).map((l, u) => {
    const d = `${e}.tweens.${u}`, h = n.has(d), f = l.type ?? "tile-prop", g = cu.find((b) => b.value === f), p = Ef[f], y = (p == null ? void 0 : p.form) ?? "prop", v = l.mode ?? "oklch";
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
      colorMode: v,
      colorModeIsOklch: v === "oklch",
      colorModeIsHsl: v === "hsl",
      colorModeIsRgb: v === "rgb",
      // Light-state fields
      enabled: l.enabled ?? !0,
      typeOptions: cu.map((b) => ({
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
    stepNumber: xy(e, i),
    stepDuration: t.duration ?? 1e3,
    tweens: a,
    beforeSummary: o.length ? `${o.length} target${o.length !== 1 ? "s" : ""}` : "(none)",
    afterSummary: s.length ? `${s.length} target${s.length !== 1 ? "s" : ""}` : "(none)"
  };
}
c(jy, "buildStepDetail");
function By(t, { state: e, expandedTweens: n }) {
  const i = Bn(t);
  if (!i) return null;
  if (i.type === "setup") return _y(e);
  if (i.type === "landing") return Fy(e);
  const r = eo(t, e);
  return r ? r.delay != null ? Dy(r) : r.emit != null ? Py(r) : r.sound != null ? Ry(r) : r.stopSound != null ? Hy(r) : r.parallel != null && i.type === "timeline" ? qy(r) : jy(r, t, n, e) : null;
}
c(By, "buildDetail");
function Uy({ state: t, mutate: e }) {
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
              e(() => new Wt(l));
            else if (l.segments !== void 0) {
              const u = { version: 4, cinematics: { [t.activeCinematicName]: l } };
              e(() => new Wt(u, { cinematicName: t.activeCinematicName }));
            } else if (l.timeline !== void 0) {
              const u = { version: 3, cinematics: { [t.activeCinematicName]: l } };
              e(() => new Wt(u, { cinematicName: t.activeCinematicName }));
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
c(Uy, "showImportDialog");
function to(t, { state: e, mutate: n }) {
  const i = t === "setup" ? e.setup : e.landing, r = JSON.stringify(i ?? {}, null, 2);
  new Dialog({
    title: `Edit ${t.charAt(0).toUpperCase() + t.slice(1)}`,
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON map of target selector → property overrides:</p>
			<textarea id="cinematic-json-edit" style="width:100%;height:200px;font-family:monospace;font-size:0.8rem">${xt(r)}</textarea>
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
c(to, "showEditJsonDialog");
function yu(t, { selectedPath: e, state: n, mutate: i }) {
  const r = eo(e, n);
  if (!r || r.delay != null) return;
  const a = r[t] ?? {}, o = JSON.stringify(a, null, 2);
  new Dialog({
    title: `Edit Step ${t.charAt(0).toUpperCase() + t.slice(1)}`,
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON map of target selector → property overrides:</p>
			<textarea id="cinematic-json-edit" style="width:100%;height:200px;font-family:monospace;font-size:0.8rem">${xt(o)}</textarea>
		`,
    buttons: {
      save: {
        label: "Apply",
        callback: /* @__PURE__ */ c((s) => {
          var u, d;
          const l = s.find("#cinematic-json-edit").val();
          try {
            const h = JSON.parse(l), f = Bn(e);
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
c(yu, "showEditStepStateDialog");
function Vy({ selectedPath: t, state: e, mutate: n }) {
  const i = Bn(t);
  if (!i || i.type !== "timeline") return;
  const r = e.timeline[i.index];
  if (!(r != null && r.parallel)) return;
  const a = JSON.stringify(r.parallel.branches ?? [], null, 2);
  new Dialog({
    title: "Edit Parallel Branches",
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON array of branch timelines:</p>
			<textarea id="cinematic-json-edit" style="width:100%;height:250px;font-family:monospace;font-size:0.8rem">${xt(a)}</textarea>
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
c(Vy, "showEditParallelJsonDialog");
var $u, An, Hn, ka, Lf;
const St = class St extends zn(Gn) {
  constructor(n = {}) {
    super(n);
    k(this, Hn);
    k(this, An, null);
    L(this, An, n.scene ?? canvas.scene ?? null);
  }
  async _prepareContext() {
    var r, a, o;
    const n = m(this, Hn, ka), i = ((a = n == null ? void 0 : n.getSeenStatus) == null ? void 0 : a.call(n, (r = m(this, An)) == null ? void 0 : r.id)) ?? [];
    return {
      sceneName: ((o = m(this, An)) == null ? void 0 : o.name) ?? "No scene",
      users: i.map((s) => ({
        ...s,
        statusLabel: s.seen ? "Seen" : "Not seen",
        statusClass: s.seen ? "cinematic-tracking__status--seen" : "cinematic-tracking__status--unseen"
      })),
      hasAnyTracked: i.some((s) => s.seen)
    };
  }
  _onRender(n, i) {
    super._onRender(n, i), S(this, Hn, Lf).call(this);
  }
};
An = new WeakMap(), Hn = new WeakSet(), ka = /* @__PURE__ */ c(function() {
  var n, i;
  return (i = (n = game.modules.get(T)) == null ? void 0 : n.api) == null ? void 0 : i.cinematic;
}, "#api"), Lf = /* @__PURE__ */ c(function() {
  var i, r;
  const n = this.element;
  n instanceof HTMLElement && (n.querySelectorAll("[data-action='reset-user']").forEach((a) => {
    a.addEventListener("click", async () => {
      var l;
      const o = a.dataset.userId;
      if (!o) return;
      const s = m(this, Hn, ka);
      s != null && s.resetForUser && (await s.resetForUser((l = m(this, An)) == null ? void 0 : l.id, o), this.render({ force: !0 }));
    });
  }), (i = n.querySelector("[data-action='reset-all']")) == null || i.addEventListener("click", async () => {
    var o;
    const a = m(this, Hn, ka);
    a != null && a.resetForAll && (await a.resetForAll((o = m(this, An)) == null ? void 0 : o.id), this.render({ force: !0 }));
  }), (r = n.querySelector("[data-action='refresh']")) == null || r.addEventListener("click", () => {
    this.render({ force: !0 });
  }));
}, "#bindEvents"), c(St, "CinematicTrackingApplication"), ye(St, "APP_ID", `${T}-cinematic-tracking`), ye(St, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Re(St, St, "DEFAULT_OPTIONS"),
  {
    id: St.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...(($u = Re(St, St, "DEFAULT_OPTIONS")) == null ? void 0 : $u.classes) ?? [], "eidolon-cinematic-tracking-window", "themed"])
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
)), ye(St, "PARTS", {
  content: {
    template: `modules/${T}/templates/cinematic-tracking.html`
  }
});
let Dl = St;
function Gy(t, e) {
  var n, i, r, a, o, s, l, u, d;
  (n = t.querySelector("[data-action='save']")) == null || n.addEventListener("click", () => e.save()), (i = t.querySelector("[data-action='play-preview']")) == null || i.addEventListener("click", () => e.play()), (r = t.querySelector("[data-action='reset-tracking']")) == null || r.addEventListener("click", () => e.resetTracking()), (a = t.querySelector("[data-action='export-json']")) == null || a.addEventListener("click", () => e.exportJSON()), (o = t.querySelector("[data-action='undo']")) == null || o.addEventListener("click", () => e.undo()), (s = t.querySelector("[data-action='redo']")) == null || s.addEventListener("click", () => e.redo()), (l = t.querySelector("[data-action='validate']")) == null || l.addEventListener("click", () => e.validate()), (u = t.querySelector("[data-action='import-json']")) == null || u.addEventListener("click", () => e.importJSON()), (d = t.querySelector("[data-action='open-tracking']")) == null || d.addEventListener("click", () => {
    new Dl({ scene: e.scene }).render(!0);
  });
}
c(Gy, "bindToolbarEvents");
function zy(t, e) {
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
      content: `<label style="display:flex;align-items:center;gap:0.5rem"><span>Name:</span><input id="cinematic-rename" type="text" style="flex:1" value="${xt(o)}" /></label>`,
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
c(zy, "bindCinematicSelectorEvents");
function Wy(t, e) {
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
        const s = pu(n), l = pu(o);
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
c(Wy, "bindSwimlaneEvents");
function Yy(t, e) {
  var n, i, r, a, o, s, l, u, d, h, f;
  (n = t.querySelector("[data-action='delete-entry']")) == null || n.addEventListener("click", () => {
    const g = e.parseEntryPath(e.selectedPath);
    g && (g.type === "timeline" ? (e.mutate((p) => p.removeEntry(g.index)), e.setSelectedPath(null)) : g.type === "branch" && (e.mutate((p) => p.removeBranchEntry(g.index, g.branchIndex, g.branchEntryIndex)), e.setSelectedPath(null)));
  }), (i = t.querySelector("[data-action='step-duration']")) == null || i.addEventListener("input", (g) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = Number(g.target.value) || 0;
    p.type === "timeline" ? e.mutate((v) => v.updateStepDuration(p.index, y)) : p.type === "branch" && e.mutate((v) => v.updateBranchEntry(p.index, p.branchIndex, p.branchEntryIndex, { duration: Math.max(0, y) }));
  }), (r = t.querySelector("[data-action='add-tween']")) == null || r.addEventListener("click", () => {
    const g = e.parseEntryPath(e.selectedPath);
    if (g) {
      if (g.type === "timeline")
        e.mutate((p) => p.addTween(g.index));
      else if (g.type === "branch") {
        const p = e.getEntryAtPath(e.selectedPath);
        if (!p) return;
        const y = { type: "tile-prop", target: "", attribute: "alpha", value: 1 }, v = [...p.tweens ?? [], y];
        e.mutate((b) => b.updateBranchEntry(g.index, g.branchIndex, g.branchEntryIndex, { tweens: v }));
      }
    }
  }), (a = t.querySelector("[data-action='change-delay']")) == null || a.addEventListener("change", (g) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = Number(g.target.value) || 0;
    p.type === "timeline" ? e.mutate((v) => v.updateEntry(p.index, { delay: y })) : p.type === "branch" && e.mutate((v) => v.updateBranchEntry(p.index, p.branchIndex, p.branchEntryIndex, { delay: y }));
  }), (o = t.querySelector("[data-action='edit-setup']")) == null || o.addEventListener("click", () => {
    to("setup", { state: e.state, mutate: e.mutate });
  }), (s = t.querySelector("[data-action='edit-landing']")) == null || s.addEventListener("click", () => {
    to("landing", { state: e.state, mutate: e.mutate });
  }), (l = t.querySelector("[data-action='edit-before']")) == null || l.addEventListener("click", () => {
    yu("before", { selectedPath: e.selectedPath, state: e.state, mutate: e.mutate });
  }), (u = t.querySelector("[data-action='edit-after']")) == null || u.addEventListener("click", () => {
    yu("after", { selectedPath: e.selectedPath, state: e.state, mutate: e.mutate });
  }), (d = t.querySelector("[data-action='change-trigger']")) == null || d.addEventListener("change", (g) => {
    e.mutate((p) => p.setTrigger(g.target.value));
  }), (h = t.querySelector("[data-action='change-tracking']")) == null || h.addEventListener("change", (g) => {
    e.mutate((p) => p.setTracking(g.target.checked));
  }), (f = t.querySelector("[data-action='change-synchronized']")) == null || f.addEventListener("change", (g) => {
    e.mutate((p) => p.setSynchronized(g.target.checked));
  });
}
c(Yy, "bindDetailPanelEvents");
const Xi = /* @__PURE__ */ new WeakMap(), no = /* @__PURE__ */ new Set(), io = /* @__PURE__ */ new Set(), bu = {
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
function ro(t, e = {}) {
  var p, y, v;
  if (!t) return !1;
  Qi(t);
  const n = e.mode ?? (e.color != null ? "custom" : "hover"), i = bu[n] ?? bu.hover, r = e.color ?? i.borderColor, a = e.alpha ?? i.borderAlpha, o = e.color ?? i.spriteTint, s = i.spriteAlpha, l = e.pulse ?? i.pulse, u = { border: null, sprite: null, pulseData: null, mode: n }, d = ((p = t.document) == null ? void 0 : p.width) ?? t.w ?? 100, h = ((y = t.document) == null ? void 0 : y.height) ?? t.h ?? 100, f = new PIXI.Graphics();
  f.lineStyle(i.borderWidth, r, a), f.drawRect(0, 0, d, h), t.addChild(f), u.border = f;
  const g = Ky(t, o, s);
  if (g && (canvas.controls.debug.addChild(g), io.add(g), u.sprite = g), l && ((v = canvas.app) != null && v.ticker)) {
    const b = {
      elapsed: 0,
      fn: /* @__PURE__ */ c((w) => {
        b.elapsed += w;
        const C = (Math.sin(b.elapsed * 0.05) + 1) / 2;
        u.border && (u.border.alpha = a * (0.4 + 0.6 * C)), u.sprite && (u.sprite.alpha = s * (0.5 + 0.5 * C));
      }, "fn")
    };
    canvas.app.ticker.add(b.fn), u.pulseData = b, no.add(b);
  }
  return Xi.set(t, u), !0;
}
c(ro, "addHighlight");
function Qi(t) {
  var n, i;
  if (!t) return;
  const e = Xi.get(t);
  e && (e.pulseData && ((i = (n = canvas.app) == null ? void 0 : n.ticker) == null || i.remove(e.pulseData.fn), no.delete(e.pulseData)), e.border && (e.border.parent && e.border.parent.removeChild(e.border), e.border.destroy({ children: !0 })), e.sprite && (e.sprite.parent && e.sprite.parent.removeChild(e.sprite), e.sprite.destroy({ children: !0 }), io.delete(e.sprite)), Xi.delete(t));
}
c(Qi, "removeHighlight");
function If(t) {
  return Xi.has(t);
}
c(If, "hasHighlight");
function Ma() {
  var e, n, i, r, a, o, s;
  for (const l of no)
    (n = (e = canvas.app) == null ? void 0 : e.ticker) == null || n.remove(l.fn);
  no.clear();
  for (const l of io)
    l.parent && l.parent.removeChild(l), l.destroy({ children: !0 });
  io.clear();
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
        const d = Xi.get(u);
        d && (d.border && (d.border.parent && d.border.parent.removeChild(d.border), d.border.destroy({ children: !0 })), Xi.delete(u));
      }
}
c(Ma, "clearAllHighlights");
function Ky(t, e, n) {
  var a;
  const i = t.mesh;
  if (!((a = i == null ? void 0 : i.texture) != null && a.baseTexture)) return null;
  const r = PIXI.Sprite.from(i.texture);
  return r.isSprite = !0, r.anchor.set(i.anchor.x, i.anchor.y), r.width = i.width, r.height = i.height, r.scale = i.scale, r.position = t.center, r.angle = i.angle, r.alpha = n, r.tint = e, r.name = "eidolonPickerHighlight", r;
}
c(Ky, "createTintSprite");
let Zn = null;
function Of(t) {
  var p, y, v;
  Zn && Zn.cancel();
  const { placeableType: e = "Tile", onPick: n, onCancel: i } = t;
  let r = null;
  const a = `control${e}`, o = `hover${e}`, s = /* @__PURE__ */ c((b, w) => {
    var I;
    if (!w) return;
    const C = b.document ?? b;
    (I = b.release) == null || I.call(b), n(C);
  }, "onControl"), l = /* @__PURE__ */ c((b, w) => {
    w ? (r = b, ro(b, { mode: "pick" })) : r === b && (Qi(b), r = null);
  }, "onHoverIn"), u = /* @__PURE__ */ c((b) => {
    b.key === "Escape" && (b.preventDefault(), b.stopPropagation(), g());
  }, "onKeydown"), d = /* @__PURE__ */ c((b) => {
    b.preventDefault(), g();
  }, "onContextMenu"), h = Hooks.on(a, s), f = Hooks.on(o, l);
  document.addEventListener("keydown", u, { capture: !0 }), (p = canvas.stage) == null || p.addEventListener("rightclick", d), (v = (y = ui.notifications) == null ? void 0 : y.info) == null || v.call(y, `Pick mode active — click a ${e.toLowerCase()} on the canvas, or press ESC to cancel.`, { permanent: !1 });
  function g() {
    var b;
    Zn && (Zn = null, Hooks.off(a, h), Hooks.off(o, f), document.removeEventListener("keydown", u, { capture: !0 }), (b = canvas.stage) == null || b.removeEventListener("rightclick", d), r && (Qi(r), r = null), i == null || i());
  }
  return c(g, "cancel"), Zn = { cancel: g }, { cancel: g };
}
c(Of, "enterPickMode");
function hr() {
  Zn && Zn.cancel();
}
c(hr, "cancelPickMode");
const Jy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cancelPickMode: hr,
  enterPickMode: Of
}, Symbol.toStringTag, { value: "Module" }));
var xu, Ne, Ve, Gr, kn, zr, Wr, et, Mn, fe, Af, Pl, kf, Mf, Nf, Rl, Hl, $f, xf;
const dt = class dt extends zn(Gn) {
  /**
   * @param {object} options
   * @param {string[]} [options.selections]  Initial selections
   * @param {string} [options.placeableType]  "Tile", "Token", etc.
   * @param {(selectors: string[]) => void} [options.onApply]
   * @param {() => void} [options.onCancel]
   */
  constructor(n = {}) {
    super(n);
    k(this, fe);
    /** @type {string[]} Current selections (selector strings). */
    k(this, Ne, []);
    /** @type {boolean} Whether pick mode is active. */
    k(this, Ve, !1);
    /** @type {string} Placeable type (Tile, Token, etc.). */
    k(this, Gr, "Tile");
    /** @type {string} Current tag match mode. */
    k(this, kn, "any");
    /** @type {((selectors: string[]) => void) | null} */
    k(this, zr, null);
    /** @type {(() => void) | null} */
    k(this, Wr, null);
    /** @type {Promise resolve function for the open() API. */
    k(this, et, null);
    /** @type {PlaceableObject | null} Currently hovered tile in the browser. */
    k(this, Mn, null);
    L(this, Ne, [...n.selections ?? []]), L(this, Gr, n.placeableType ?? "Tile"), L(this, zr, n.onApply ?? null), L(this, Wr, n.onCancel ?? null);
  }
  // ── Context ───────────────────────────────────────────────────────────
  async _prepareContext() {
    var r;
    const n = S(this, fe, Rl).call(this), i = (((r = canvas.tiles) == null ? void 0 : r.placeables) ?? []).map((a, o) => {
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
      selections: m(this, Ne),
      selectionCount: m(this, Ne).length,
      pickModeActive: m(this, Ve),
      tagModeIsAny: m(this, kn) === "any",
      tagModeIsAll: m(this, kn) === "all",
      tagPreviewCount: 0,
      tiles: i,
      tileCount: i.length
    };
  }
  // ── Render & Events ───────────────────────────────────────────────────
  _onRender(n, i) {
    super._onRender(n, i), S(this, fe, Af).call(this), S(this, fe, Hl).call(this);
  }
  async _onClose(n) {
    return m(this, Ve) && (hr(), L(this, Ve, !1)), Ma(), m(this, et) && (m(this, et).call(this, null), L(this, et, null)), super._onClose(n);
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
      const r = new dt({
        ...n,
        onApply: /* @__PURE__ */ c((a) => i(a), "onApply"),
        onCancel: /* @__PURE__ */ c(() => i(null), "onCancel")
      });
      L(r, et, i), r.render(!0);
    });
  }
};
Ne = new WeakMap(), Ve = new WeakMap(), Gr = new WeakMap(), kn = new WeakMap(), zr = new WeakMap(), Wr = new WeakMap(), et = new WeakMap(), Mn = new WeakMap(), fe = new WeakSet(), Af = /* @__PURE__ */ c(function() {
  var a, o, s, l;
  const n = this.element;
  if (!(n instanceof HTMLElement)) return;
  const i = n.querySelector("[data-role='tag-input']"), r = n.querySelector("[data-role='tag-mode']");
  r == null || r.addEventListener("change", (u) => {
    L(this, kn, u.target.value);
  }), i == null || i.addEventListener("input", () => {
    S(this, fe, kf).call(this, n);
  }), i == null || i.addEventListener("keydown", (u) => {
    u.key === "Enter" && (u.preventDefault(), S(this, fe, Pl).call(this, n));
  }), (a = n.querySelector("[data-action='add-tag-selector']")) == null || a.addEventListener("click", () => {
    S(this, fe, Pl).call(this, n);
  }), (o = n.querySelector("[data-action='toggle-pick-mode']")) == null || o.addEventListener("click", () => {
    m(this, Ve) ? (hr(), L(this, Ve, !1)) : (L(this, Ve, !0), Of({
      placeableType: m(this, Gr),
      onPick: /* @__PURE__ */ c((u) => {
        S(this, fe, Mf).call(this, u.id);
      }, "onPick"),
      onCancel: /* @__PURE__ */ c(() => {
        L(this, Ve, !1), this.render({ force: !0 });
      }, "onCancel")
    })), this.render({ force: !0 });
  }), n.querySelectorAll("[data-action='toggle-tile']").forEach((u) => {
    u.addEventListener("click", () => {
      const d = u.dataset.docId;
      d && S(this, fe, Nf).call(this, d);
    }), u.addEventListener("mouseenter", () => {
      var f, g;
      const d = u.dataset.docId;
      if (!d) return;
      const h = (g = (f = canvas.tiles) == null ? void 0 : f.placeables) == null ? void 0 : g.find((p) => p.document.id === d);
      h && (L(this, Mn, h), ro(h, { mode: "hover" }));
    }), u.addEventListener("mouseleave", () => {
      m(this, Mn) && (Qi(m(this, Mn)), L(this, Mn, null), S(this, fe, Hl).call(this));
    });
  }), n.querySelectorAll("[data-action='remove-selection']").forEach((u) => {
    u.addEventListener("click", () => {
      const d = Number(u.dataset.selectionIndex);
      Number.isNaN(d) || (m(this, Ne).splice(d, 1), this.render({ force: !0 }));
    });
  }), (s = n.querySelector("[data-action='apply']")) == null || s.addEventListener("click", () => {
    S(this, fe, $f).call(this);
  }), (l = n.querySelector("[data-action='cancel']")) == null || l.addEventListener("click", () => {
    S(this, fe, xf).call(this);
  });
}, "#bindEvents"), // ── Tag helpers ───────────────────────────────────────────────────────
Pl = /* @__PURE__ */ c(function(n) {
  var s;
  const i = n.querySelector("[data-role='tag-input']"), r = (s = i == null ? void 0 : i.value) == null ? void 0 : s.trim();
  if (!r) return;
  const a = r.split(",").map((l) => l.trim()).filter(Boolean);
  if (a.length === 0) return;
  const o = gf(a, m(this, kn));
  o && !m(this, Ne).includes(o) && m(this, Ne).push(o), i && (i.value = ""), this.render({ force: !0 });
}, "#addTagSelector"), kf = /* @__PURE__ */ c(function(n) {
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
  const l = m(this, kn) === "any", u = s.getByTag(o, {
    sceneId: (f = canvas.scene) == null ? void 0 : f.id,
    matchAny: l
  }), d = (u == null ? void 0 : u.length) ?? 0;
  r.textContent = `${d} matching placeable(s)`;
}, "#updateTagPreview"), // ── ID selector helpers ──────────────────────────────────────────────
Mf = /* @__PURE__ */ c(function(n) {
  const i = `id:${n}`;
  m(this, Ne).includes(i) || (m(this, Ne).push(i), this.render({ force: !0 }));
}, "#addIdSelector"), Nf = /* @__PURE__ */ c(function(n) {
  const i = `id:${n}`, r = m(this, Ne).indexOf(i);
  r >= 0 ? m(this, Ne).splice(r, 1) : m(this, Ne).push(i), this.render({ force: !0 });
}, "#toggleIdSelector"), /**
 * Get the set of document IDs that are currently selected across all selector types.
 * Resolves tag/tags-any/tags-all selectors to find matching document IDs.
 * @returns {Set<string>}
 */
Rl = /* @__PURE__ */ c(function() {
  const n = /* @__PURE__ */ new Set();
  for (const i of m(this, Ne)) {
    const r = pc(i);
    if (r.type === "id") {
      n.add(r.value);
      continue;
    }
    const a = es(i);
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
Hl = /* @__PURE__ */ c(function() {
  var r, a;
  const n = S(this, fe, Rl).call(this), i = ((r = canvas.tiles) == null ? void 0 : r.placeables) ?? [];
  for (const o of i) {
    const s = (a = o.document) == null ? void 0 : a.id;
    if (!s) continue;
    const l = n.has(s), u = o === m(this, Mn), d = If(o);
    l && !u && !d ? ro(o, { mode: "selected" }) : !l && d && !u && Qi(o);
  }
}, "#refreshSelectionHighlights"), // ── Apply / Cancel ──────────────────────────────────────────────────
$f = /* @__PURE__ */ c(function() {
  var i;
  m(this, Ve) && (hr(), L(this, Ve, !1)), Ma();
  const n = [...m(this, Ne)];
  (i = m(this, zr)) == null || i.call(this, n), m(this, et) && (m(this, et).call(this, n), L(this, et, null)), this.close({ force: !0 });
}, "#doApply"), xf = /* @__PURE__ */ c(function() {
  var n;
  m(this, Ve) && (hr(), L(this, Ve, !1)), Ma(), (n = m(this, Wr)) == null || n.call(this), m(this, et) && (m(this, et).call(this, null), L(this, et, null)), this.close({ force: !0 });
}, "#doCancel"), c(dt, "PlaceablePickerApplication"), ye(dt, "APP_ID", `${T}-placeable-picker`), ye(dt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Re(dt, dt, "DEFAULT_OPTIONS"),
  {
    id: dt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((xu = Re(dt, dt, "DEFAULT_OPTIONS")) == null ? void 0 : xu.classes) ?? [], "eidolon-placeable-picker-window", "themed"])
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
)), ye(dt, "PARTS", {
  content: {
    template: `modules/${T}/templates/placeable-picker.html`
  }
});
let ao = dt;
function Xy(t, e) {
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
      const a = e.getEntryAtPath(e.selectedPath), o = ((d = (u = a == null ? void 0 : a.tweens) == null ? void 0 : u[i]) == null ? void 0 : d.target) ?? "", s = o ? [o] : [], l = await ao.open({ selections: s });
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
          const l = Ef[s], u = { type: s };
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
c(Xy, "bindTweenFieldEvents");
function Qy(t, e) {
  var i, r, a, o, s, l, u, d, h, f;
  function n(g, p, y) {
    g.type === "timeline" ? e.mutate((v) => v.updateEntry(g.index, { sound: y })) : g.type === "branch" && e.mutate((v) => v.updateBranchEntry(g.index, g.branchIndex, g.branchEntryIndex, { sound: y }));
  }
  c(n, "applySoundPatch"), (i = t.querySelector("[data-action='change-sound-src']")) == null || i.addEventListener("change", async (g) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = e.getEntryAtPath(e.selectedPath);
    if (!(y != null && y.sound)) return;
    const v = g.target.value, b = { ...y.sound, src: v };
    b.id || (b.id = uu(v));
    const w = await du(v);
    w > 0 && (b.duration = w), n(p, y, b);
  }), (r = t.querySelector("[data-action='pick-sound-src']")) == null || r.addEventListener("click", () => {
    const g = e.parseEntryPath(e.selectedPath);
    if (!g) return;
    const p = e.getEntryAtPath(e.selectedPath);
    if (!(p != null && p.sound)) return;
    new FilePicker({
      type: "audio",
      current: p.sound.src || "",
      callback: /* @__PURE__ */ c(async (v) => {
        const b = { ...p.sound, src: v };
        b.id || (b.id = uu(v));
        const w = await du(v);
        w > 0 && (b.duration = w), n(g, p, b);
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
c(Qy, "bindSoundFieldEvents");
function Zy(t, e) {
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
    Vy({ selectedPath: e.selectedPath, state: e.state, mutate: e.mutate });
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
c(Zy, "bindSpecialEntryEvents");
function eb(t, e) {
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
c(eb, "bindSegmentGraphEvents");
function tb(t, e) {
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
    const { enterPickMode: d } = await Promise.resolve().then(() => Jy);
    d({
      placeableType: "Tile",
      onPick: /* @__PURE__ */ c((f) => {
        var y, v;
        const g = (v = (y = f.flags) == null ? void 0 : y.tagger) == null ? void 0 : v.tags, p = g != null && g.length ? `tag:${g[0]}` : `id:${f.id}`;
        e.setSegmentGate({ ...u, target: p });
      }, "onPick")
    });
  });
  for (const [u, d] of [["change-gate-anim-idle", "idle"], ["change-gate-anim-hover", "hover"], ["change-gate-anim-dim", "dim"]])
    (a = t.querySelector(`[data-action='${u}']`)) == null || a.addEventListener("change", (h) => {
      var b;
      const f = (b = e.state.activeSegment) == null ? void 0 : b.gate;
      if (!f) return;
      const g = h.target.value.trim(), p = g ? g.split(",").map((w) => w.trim()).filter(Boolean) : void 0, y = { ...f.animation ?? {} };
      p != null && p.length ? y[d] = p.length === 1 ? p[0] : p : delete y[d];
      const v = { ...f, animation: Object.keys(y).length ? y : void 0 };
      v.animation || delete v.animation, e.setSegmentGate(v);
    });
  (o = t.querySelector("[data-action='change-segment-next']")) == null || o.addEventListener("change", (u) => {
    const d = u.target.value;
    e.setSegmentNext(d || null);
  }), (s = t.querySelector("[data-action='edit-segment-setup']")) == null || s.addEventListener("click", () => {
    to("setup", { state: e.state, mutate: e.mutate });
  }), (l = t.querySelector("[data-action='edit-segment-landing']")) == null || l.addEventListener("click", () => {
    to("landing", { state: e.state, mutate: e.mutate });
  });
}
c(tb, "bindSegmentDetailEvents");
var _u, Ge, z, tt, Nn, Ot, nt, ze, Ro, Fe, it, Ho, un, Yi, ht, mi, $n, hi, q, _f, Ff, Df, Pf, wn, jl, Bl, Ul, Vl, Rf, En, Gl, Hf, qf, jf, Bf, Uf, zl, gr;
const Ct = class Ct extends zn(Gn) {
  constructor(n = {}) {
    super(n);
    k(this, q);
    k(this, Ge, null);
    k(this, z, null);
    k(this, tt, null);
    k(this, Nn, /* @__PURE__ */ new Set());
    k(this, Ot, !1);
    k(this, nt, null);
    k(this, ze, null);
    k(this, Ro, 120);
    k(this, Fe, []);
    k(this, it, -1);
    k(this, Ho, 50);
    k(this, un, null);
    k(this, Yi, null);
    k(this, ht, null);
    k(this, mi, null);
    k(this, $n, null);
    k(this, hi, null);
    L(this, Ge, n.scene ?? canvas.scene ?? null), L(this, z, Wt.fromScene(m(this, Ge)));
  }
  // ── Context ───────────────────────────────────────────────────────────
  async _prepareContext() {
    var g, p;
    const n = Ny(m(this, z), m(this, z).activeSegmentName), i = ky(m(this, z).timeline, {
      selectedPath: m(this, tt),
      windowWidth: ((g = this.position) == null ? void 0 : g.width) ?? 1100
    }), r = m(this, tt) != null ? By(m(this, tt), { state: m(this, z), expandedTweens: m(this, Nn) }) : null, a = m(this, z).listCinematicNames(), o = m(this, z).activeCinematicName, l = m(this, z).listSegmentNames().length > 1, u = m(this, z).activeSegment, d = (u == null ? void 0 : u.gate) ?? null, h = (u == null ? void 0 : u.next) ?? null, f = typeof h == "string" ? h : (h == null ? void 0 : h.segment) ?? null;
    return {
      // Toolbar
      sceneName: ((p = m(this, Ge)) == null ? void 0 : p.name) ?? "No scene",
      dirty: m(this, Ot),
      canUndo: m(this, q, jl),
      canRedo: m(this, q, Bl),
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
      triggerOptions: Ey.map((y) => ({
        ...y,
        selected: y.value === m(this, z).trigger
      })),
      entryCount: m(this, z).timeline.length,
      totalDuration: i.totalDurationMs,
      targetCount: $y(m(this, z)),
      setupCount: Object.keys(m(this, z).setup ?? {}).length,
      landingCount: Object.keys(m(this, z).landing ?? {}).length
    };
  }
  // ── Render & Events ───────────────────────────────────────────────────
  _onRender(n, i) {
    var r, a, o;
    if (super._onRender(n, i), S(this, q, _f).call(this), !m(this, mi)) {
      const s = (a = (r = game.modules.get(T)) == null ? void 0 : r.api) == null ? void 0 : a.cinematic;
      s != null && s.onPlaybackProgress ? (L(this, mi, s.onPlaybackProgress((l) => S(this, q, Uf).call(this, l))), console.log("[cinematic-editor] Subscribed to playback progress events")) : console.warn("[cinematic-editor] onPlaybackProgress not available on API", s);
    }
    if (m(this, hi) && ((o = this.element) == null || o.querySelectorAll(".cinematic-editor__segment-node").forEach((s) => {
      s.classList.toggle("cinematic-editor__segment-node--playing", s.dataset.segmentName === m(this, hi));
    }), m(this, ht) && m(this, ht).segmentName === m(this, z).activeSegmentName)) {
      const s = performance.now() - m(this, ht).startTime;
      m(this, ht).durationMs - s > 0 && S(this, q, zl).call(this, m(this, ht).durationMs, m(this, ht).startTime);
    }
    m(this, un) || (L(this, un, (s) => {
      !s.ctrlKey && !s.metaKey || (s.key === "z" && !s.shiftKey ? (s.preventDefault(), S(this, q, Ul).call(this)) : (s.key === "z" && s.shiftKey || s.key === "y") && (s.preventDefault(), S(this, q, Vl).call(this)));
    }), document.addEventListener("keydown", m(this, un)));
  }
  async close(n = {}) {
    if (m(this, ze) && S(this, q, En).call(this), m(this, Ot) && !n.force) {
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
      i === "save" && await S(this, q, Gl).call(this);
    }
    return super.close(n);
  }
  async _onClose(n) {
    var i;
    return m(this, nt) !== null && (clearTimeout(m(this, nt)), L(this, nt, null)), m(this, un) && (document.removeEventListener("keydown", m(this, un)), L(this, un, null)), (i = m(this, mi)) == null || i.call(this), L(this, mi, null), S(this, q, gr).call(this), super._onClose(n);
  }
};
Ge = new WeakMap(), z = new WeakMap(), tt = new WeakMap(), Nn = new WeakMap(), Ot = new WeakMap(), nt = new WeakMap(), ze = new WeakMap(), Ro = new WeakMap(), Fe = new WeakMap(), it = new WeakMap(), Ho = new WeakMap(), un = new WeakMap(), Yi = new WeakMap(), ht = new WeakMap(), mi = new WeakMap(), $n = new WeakMap(), hi = new WeakMap(), q = new WeakSet(), // ── Event binding ─────────────────────────────────────────────────────
_f = /* @__PURE__ */ c(function() {
  const n = this.element;
  if (!(n instanceof HTMLElement)) return;
  const i = S(this, q, Ff).call(this);
  Gy(n, i), zy(n, i), eb(n, i), Wy(n, i), Yy(n, i), Xy(n, i), Qy(n, i), Zy(n, i), tb(n, i);
}, "#bindEvents"), Ff = /* @__PURE__ */ c(function() {
  const n = this;
  return {
    // State access (read-only getters — closures over `self` for private field access)
    get state() {
      return m(n, z);
    },
    get selectedPath() {
      return m(n, tt);
    },
    get scene() {
      return m(n, Ge);
    },
    get expandedTweens() {
      return m(n, Nn);
    },
    get insertMenuState() {
      return m(n, Yi);
    },
    // Mutations
    mutate: /* @__PURE__ */ c((i) => S(this, q, wn).call(this, i), "mutate"),
    setSelectedPath: /* @__PURE__ */ c((i) => {
      L(this, tt, i), this.render({ force: !0 });
    }, "setSelectedPath"),
    render: /* @__PURE__ */ c(() => this.render({ force: !0 }), "render"),
    // Cinematic switching (needs full state swap + clear)
    switchCinematic: /* @__PURE__ */ c((i) => {
      m(this, ze) && S(this, q, En).call(this), L(this, z, m(this, z).switchCinematic(i)), L(this, tt, null), m(this, Nn).clear(), this.render({ force: !0 });
    }, "switchCinematic"),
    // Segment management
    selectSegment: /* @__PURE__ */ c((i) => {
      m(this, ze) && S(this, q, En).call(this), L(this, z, m(this, z).switchSegment(i)), L(this, tt, null), m(this, Nn).clear(), this.render({ force: !0 });
    }, "selectSegment"),
    addSegment: /* @__PURE__ */ c((i) => {
      S(this, q, wn).call(this, (r) => r.addSegment(i, r.activeSegmentName));
    }, "addSegment"),
    removeSegment: /* @__PURE__ */ c((i) => {
      S(this, q, wn).call(this, (r) => r.removeSegment(i));
    }, "removeSegment"),
    renameSegment: /* @__PURE__ */ c((i, r) => {
      S(this, q, wn).call(this, (a) => a.renameSegment(i, r));
    }, "renameSegment"),
    setSegmentGate: /* @__PURE__ */ c((i) => {
      S(this, q, wn).call(this, (r) => r.setSegmentGate(i));
    }, "setSegmentGate"),
    setSegmentNext: /* @__PURE__ */ c((i) => {
      S(this, q, wn).call(this, (r) => r.setSegmentNext(i));
    }, "setSegmentNext"),
    // Tween debouncing
    queueTweenChange: /* @__PURE__ */ c((i, r) => S(this, q, Rf).call(this, i, r), "queueTweenChange"),
    flushTweenChanges: /* @__PURE__ */ c(() => {
      m(this, ze) && S(this, q, En).call(this);
    }, "flushTweenChanges"),
    flushTweenChangesImmediate: /* @__PURE__ */ c(() => {
      m(this, nt) !== null && clearTimeout(m(this, nt)), L(this, nt, null), S(this, q, En).call(this);
    }, "flushTweenChangesImmediate"),
    // Path utilities
    parseEntryPath: Bn,
    getEntryAtPath: /* @__PURE__ */ c((i) => eo(i, m(this, z)), "getEntryAtPath"),
    // Insert menu
    showInsertMenu: /* @__PURE__ */ c((i, r, a) => S(this, q, Df).call(this, i, r, a), "showInsertMenu"),
    hideInsertMenu: /* @__PURE__ */ c(() => S(this, q, Pf).call(this), "hideInsertMenu"),
    // Toolbar actions
    save: /* @__PURE__ */ c(() => S(this, q, Gl).call(this), "save"),
    play: /* @__PURE__ */ c(() => S(this, q, Hf).call(this), "play"),
    resetTracking: /* @__PURE__ */ c(() => S(this, q, qf).call(this), "resetTracking"),
    exportJSON: /* @__PURE__ */ c(() => S(this, q, jf).call(this), "exportJSON"),
    validate: /* @__PURE__ */ c(() => S(this, q, Bf).call(this), "validate"),
    importJSON: /* @__PURE__ */ c(() => Uy({ state: m(this, z), mutate: /* @__PURE__ */ c((i) => S(this, q, wn).call(this, i), "mutate") }), "importJSON"),
    undo: /* @__PURE__ */ c(() => S(this, q, Ul).call(this), "undo"),
    redo: /* @__PURE__ */ c(() => S(this, q, Vl).call(this), "redo")
  };
}, "#createEventContext"), // ── Insert menu ───────────────────────────────────────────────────────
Df = /* @__PURE__ */ c(function(n, i, r) {
  var l;
  const a = (l = this.element) == null ? void 0 : l.querySelector(".cinematic-editor__insert-menu");
  if (!a) return;
  const o = n.getBoundingClientRect();
  document.body.appendChild(a), a.style.display = "", a.style.position = "fixed", a.style.left = `${o.left}px`;
  const s = a.offsetHeight || 200;
  o.bottom + 4 + s > window.innerHeight ? a.style.top = `${o.top - s - 4}px` : a.style.top = `${o.bottom + 4}px`, L(this, Yi, { insertIndex: i, lane: r });
}, "#showInsertMenu"), Pf = /* @__PURE__ */ c(function() {
  var i, r;
  const n = document.body.querySelector(".cinematic-editor__insert-menu") ?? ((i = this.element) == null ? void 0 : i.querySelector(".cinematic-editor__insert-menu"));
  if (n) {
    n.style.display = "none";
    const a = (r = this.element) == null ? void 0 : r.querySelector(".cinematic-editor");
    a && n.parentNode !== a && a.appendChild(n);
  }
  L(this, Yi, null);
}, "#hideInsertMenu"), // ── State mutation ────────────────────────────────────────────────────
wn = /* @__PURE__ */ c(function(n) {
  L(this, Fe, m(this, Fe).slice(0, m(this, it) + 1)), m(this, Fe).push(m(this, z)), m(this, Fe).length > m(this, Ho) && m(this, Fe).shift(), L(this, it, m(this, Fe).length - 1), L(this, z, n(m(this, z))), L(this, Ot, !0), this.render({ force: !0 });
}, "#mutate"), jl = /* @__PURE__ */ c(function() {
  return m(this, it) >= 0;
}, "#canUndo"), Bl = /* @__PURE__ */ c(function() {
  return m(this, it) < m(this, Fe).length - 1;
}, "#canRedo"), Ul = /* @__PURE__ */ c(function() {
  m(this, q, jl) && (m(this, it) === m(this, Fe).length - 1 && m(this, Fe).push(m(this, z)), L(this, z, m(this, Fe)[m(this, it)]), os(this, it)._--, L(this, Ot, !0), this.render({ force: !0 }));
}, "#undo"), Vl = /* @__PURE__ */ c(function() {
  m(this, q, Bl) && (os(this, it)._++, L(this, z, m(this, Fe)[m(this, it) + 1]), L(this, Ot, !0), this.render({ force: !0 }));
}, "#redo"), Rf = /* @__PURE__ */ c(function(n, i) {
  var r;
  m(this, tt) != null && (L(this, ze, {
    ...m(this, ze) ?? {},
    entryPath: m(this, tt),
    tweenIndex: n,
    patch: { ...((r = m(this, ze)) == null ? void 0 : r.patch) ?? {}, ...i }
  }), m(this, nt) !== null && clearTimeout(m(this, nt)), L(this, nt, setTimeout(() => {
    L(this, nt, null), S(this, q, En).call(this);
  }, m(this, Ro))));
}, "#queueTweenChange"), En = /* @__PURE__ */ c(function() {
  if (!m(this, ze)) return;
  const { entryPath: n, tweenIndex: i, patch: r } = m(this, ze);
  L(this, ze, null);
  const a = Bn(n);
  if (a) {
    if (a.type === "timeline")
      L(this, z, m(this, z).updateTween(a.index, i, r));
    else if (a.type === "branch") {
      const o = eo(n, m(this, z));
      if (o) {
        const s = (o.tweens ?? []).map((l, u) => u === i ? { ...l, ...r } : l);
        L(this, z, m(this, z).updateBranchEntry(a.index, a.branchIndex, a.branchEntryIndex, { tweens: s }));
      }
    }
    L(this, Ot, !0);
  }
}, "#flushTweenChanges"), Gl = /* @__PURE__ */ c(async function() {
  var n, i, r, a, o, s;
  if (m(this, Ge)) {
    if (m(this, ze) && S(this, q, En).call(this), m(this, z).isStale(m(this, Ge))) {
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
        L(this, z, Wt.fromScene(m(this, Ge), m(this, z).activeCinematicName)), L(this, Ot, !1), L(this, Fe, []), L(this, it, -1), this.render({ force: !0 }), (i = (n = ui.notifications) == null ? void 0 : n.info) == null || i.call(n, "Cinematic reloaded from scene.");
        return;
      }
      if (!l) return;
    }
    try {
      await m(this, z).save(m(this, Ge)), L(this, z, Wt.fromScene(m(this, Ge), m(this, z).activeCinematicName)), L(this, Ot, !1), (a = (r = ui.notifications) == null ? void 0 : r.info) == null || a.call(r, "Cinematic saved."), this.render({ force: !0 });
    } catch (l) {
      console.error(`${T} | Cinematic save failed`, l), (s = (o = ui.notifications) == null ? void 0 : o.error) == null || s.call(o, "Failed to save cinematic data.");
    }
  }
}, "#onSave"), Hf = /* @__PURE__ */ c(async function() {
  var i, r, a, o, s;
  const n = (r = (i = game.modules.get(T)) == null ? void 0 : i.api) == null ? void 0 : r.cinematic;
  if (!(n != null && n.play)) {
    (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, "Cinematic API not available.");
    return;
  }
  await n.play((s = m(this, Ge)) == null ? void 0 : s.id, m(this, z).activeCinematicName);
}, "#onPlay"), qf = /* @__PURE__ */ c(async function() {
  var i, r, a, o, s;
  const n = (r = (i = game.modules.get(T)) == null ? void 0 : i.api) == null ? void 0 : r.cinematic;
  n != null && n.reset && (await n.reset((a = m(this, Ge)) == null ? void 0 : a.id, m(this, z).activeCinematicName), (s = (o = ui.notifications) == null ? void 0 : o.info) == null || s.call(o, "Cinematic tracking reset."));
}, "#onResetTracking"), jf = /* @__PURE__ */ c(async function() {
  var i, r;
  const n = JSON.stringify(m(this, z).toJSON(), null, 2);
  try {
    await navigator.clipboard.writeText(n), (r = (i = ui.notifications) == null ? void 0 : i.info) == null || r.call(i, "Cinematic JSON copied to clipboard.");
  } catch {
    new Dialog({
      title: "Cinematic JSON",
      content: `<textarea style="width:100%;height:300px;font-family:monospace;font-size:0.8rem">${xt(n)}</textarea>`,
      buttons: { ok: { label: "Close" } }
    }).render(!0);
  }
}, "#onExportJSON"), Bf = /* @__PURE__ */ c(function() {
  var l, u;
  const n = m(this, z).toJSON(), { targets: i, unresolved: r } = Za(n), a = wy(n, i), o = [
    ...r.map((d) => ({ path: "targets", level: "warn", message: `Unresolved target: "${d}"` })),
    ...a
  ];
  if (o.length === 0) {
    (u = (l = ui.notifications) == null ? void 0 : l.info) == null || u.call(l, "Cinematic validation passed — no issues found.");
    return;
  }
  const s = o.map((d) => {
    const h = d.level === "error" ? "fa-circle-xmark" : "fa-triangle-exclamation", f = d.level === "error" ? "#e74c3c" : "#f39c12";
    return `<li style="margin:0.3rem 0"><i class="fa-solid ${h}" style="color:${f};margin-right:0.3rem"></i><strong>${xt(d.path)}</strong>: ${xt(d.message)}</li>`;
  });
  new Dialog({
    title: "Cinematic Validation",
    content: `<p>${o.length} issue(s) found:</p><ul style="list-style:none;padding:0;max-height:300px;overflow:auto">${s.join("")}</ul>`,
    buttons: { ok: { label: "Close" } }
  }).render(!0);
}, "#onValidate"), // ── Playback progress ────────────────────────────────────────────────
Uf = /* @__PURE__ */ c(function(n) {
  var i, r, a, o, s, l;
  switch (console.log(`[cinematic-editor] playback event: ${n.type}`, n), n.type) {
    case "segment-start":
      L(this, hi, n.segmentName), n.segmentName !== m(this, z).activeSegmentName ? (L(this, z, m(this, z).switchSegment(n.segmentName)), L(this, tt, null), m(this, Nn).clear(), this.render({ force: !0 })) : (i = this.element) == null || i.querySelectorAll(".cinematic-editor__segment-node").forEach((u) => {
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
      L(this, ht, { segmentName: n.segmentName, startTime: performance.now(), durationMs: n.durationMs }), n.segmentName === m(this, z).activeSegmentName && S(this, q, zl).call(this, n.durationMs);
      break;
    case "timeline-end":
      S(this, q, gr).call(this), L(this, ht, null);
      break;
    case "playback-end":
      S(this, q, gr).call(this), L(this, ht, null), L(this, hi, null), (l = this.element) == null || l.querySelectorAll(".cinematic-editor__segment-node--playing, .cinematic-editor__segment-node--gate-waiting").forEach((u) => {
        u.classList.remove("cinematic-editor__segment-node--playing", "cinematic-editor__segment-node--gate-waiting");
      });
      break;
  }
}, "#onPlaybackEvent"), zl = /* @__PURE__ */ c(function(n, i = null) {
  var u, d;
  S(this, q, gr).call(this);
  const r = (u = this.element) == null ? void 0 : u.querySelector(".cinematic-editor__playback-cursor"), a = (d = this.element) == null ? void 0 : d.querySelector(".cinematic-editor__swimlane");
  if (console.log(`[cinematic-editor] startCursor: duration=${n}, cursor=${!!r}, swimlane=${!!a}, width=${a == null ? void 0 : a.scrollWidth}`), !r || !a || n <= 0) return;
  r.style.display = "block";
  const o = i ?? performance.now(), s = a.scrollWidth, l = /* @__PURE__ */ c(() => {
    const h = performance.now() - o, f = Math.min(h / n, 1), g = Ar + f * (s - Ar);
    r.style.left = `${g}px`, f < 1 && L(this, $n, requestAnimationFrame(l));
  }, "tick");
  L(this, $n, requestAnimationFrame(l));
}, "#startCursorAnimation"), gr = /* @__PURE__ */ c(function() {
  var i;
  m(this, $n) && (cancelAnimationFrame(m(this, $n)), L(this, $n, null));
  const n = (i = this.element) == null ? void 0 : i.querySelector(".cinematic-editor__playback-cursor");
  n && (n.style.display = "none");
}, "#stopCursorAnimation"), c(Ct, "CinematicEditorApplication"), ye(Ct, "APP_ID", `${T}-cinematic-editor`), ye(Ct, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Re(Ct, Ct, "DEFAULT_OPTIONS"),
  {
    id: Ct.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((_u = Re(Ct, Ct, "DEFAULT_OPTIONS")) == null ? void 0 : _u.classes) ?? [], "eidolon-cinematic-editor-window", "themed"])
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
)), ye(Ct, "PARTS", {
  content: {
    template: `modules/${T}/templates/cinematic-editor.html`
  }
});
let ql = Ct;
const Vf = /* @__PURE__ */ new Map();
function me(t, e) {
  Vf.set(t, e);
}
c(me, "registerBehaviour");
function Na(t) {
  return Vf.get(t);
}
c(Na, "getBehaviour");
function nb(t, e, n) {
  let i, r, a;
  if (e === 0)
    i = r = a = n;
  else {
    const o = /* @__PURE__ */ c((u, d, h) => (h < 0 && (h += 1), h > 1 && (h -= 1), h < 0.16666666666666666 ? u + (d - u) * 6 * h : h < 0.5 ? d : h < 0.6666666666666666 ? u + (d - u) * (0.6666666666666666 - h) * 6 : u), "hue2rgb"), s = n < 0.5 ? n * (1 + e) : n + e - n * e, l = 2 * n - s;
    i = o(l, s, t + 1 / 3), r = o(l, s, t), a = o(l, s, t - 1 / 3);
  }
  return Math.round(i * 255) << 16 | Math.round(r * 255) << 8 | Math.round(a * 255);
}
c(nb, "hslToInt");
me("float", (t, e = {}) => {
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
me("pulse", (t, e = {}) => {
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
me("scale", (t, e = {}) => {
  const n = t.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.factor ?? 1.12, r = e.durationFrames ?? 15, a = rt(e.easing ?? "easeOutCubic"), o = n.scale.x, s = n.scale.y, l = o * i, u = s * i;
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
me("glow", (t, e = {}) => {
  var y, v;
  const n = t.mesh;
  if (!((y = n == null ? void 0 : n.texture) != null && y.baseTexture)) return { update() {
  }, detach() {
  } };
  const i = t.document, r = e.color ?? 4513279, a = e.alpha ?? 0.5, o = e.blur ?? 8, s = e.pulseSpeed ?? 0.03, l = Math.abs(i.width), u = Math.abs(i.height), d = PIXI.Sprite.from(n.texture);
  d.anchor.set(0.5, 0.5), d.scale.set(n.scale.x, n.scale.y), d.position.set(l / 2, u / 2), d.angle = i.rotation ?? 0, d.alpha = a, d.tint = r;
  const h = PIXI.BlurFilter ?? ((v = PIXI.filters) == null ? void 0 : v.BlurFilter), f = new h(o);
  d.filters = [f], t.addChildAt(d, 0);
  const g = n.angle;
  let p = 0;
  return {
    update(b) {
      p += b;
      const w = (Math.sin(p * s) + 1) / 2;
      d.visible = n.visible !== !1, d.alpha = a * (0.5 + 0.5 * w) * (n.alpha ?? 1), d.scale.set(n.scale.x, n.scale.y), d.angle = (i.rotation ?? 0) + (n.angle - g);
    },
    detach() {
      d.parent && d.parent.removeChild(d), d.destroy({ children: !0 });
    }
  };
});
me("wobble", (t, e = {}) => {
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
me("colorCycle", (t, e = {}) => {
  const n = t.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.speed ?? 5e-3, r = e.saturation ?? 0.6, a = e.lightness ?? 0.6, o = n.tint;
  let s = 0;
  return {
    update(l) {
      s = (s + l * i) % 1, n.tint = nb(s, r, a);
    },
    detach() {
      n.tint = o;
    }
  };
});
me("spin", (t, e = {}) => {
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
me("bounce", (t, e = {}) => {
  const n = t.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.speed ?? 0.02, r = e.amplitude ?? 6, a = rt("easeOutBounce"), o = n.position.y;
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
me("borderTrace", (t, e = {}) => {
  const n = t.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), a = Math.abs(i.height), o = 2 * (r + a), s = e.speed ?? 1.5, l = e.length ?? 60, u = e.color ?? 4513279, d = e.alpha ?? 0.8, h = e.lineWidth ?? 2, f = new PIXI.Graphics();
  f.alpha = d, f.pivot.set(r / 2, a / 2), f.position.set(r / 2, a / 2), t.addChildAt(f, 0);
  const g = n.scale.x, p = n.scale.y, y = n.angle;
  let v = 0;
  function b(w) {
    return w = (w % o + o) % o, w < r ? { x: w, y: 0 } : (w -= r, w < a ? { x: r, y: w } : (w -= a, w < r ? { x: r - w, y: a } : (w -= r, { x: 0, y: a - w })));
  }
  return c(b, "perimeterPoint"), {
    update(w) {
      v = (v + w * s) % o, f.visible = n.visible !== !1, f.alpha = d * (n.alpha ?? 1), f.scale.set(n.scale.x / g, n.scale.y / p), f.angle = n.angle - y, f.clear(), f.lineStyle(h, u, 1);
      const C = 16, I = l / C, A = b(v);
      f.moveTo(A.x, A.y);
      for (let O = 1; O <= C; O++) {
        const M = b(v + O * I);
        f.lineTo(M.x, M.y);
      }
    },
    detach() {
      f.parent && f.parent.removeChild(f), f.destroy({ children: !0 });
    }
  };
});
me("shimmer", (t, e = {}) => {
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
  const y = n.scale.x, v = n.scale.y, b = n.angle;
  let w = 0;
  return {
    update(C) {
      if (w = (w + C * o) % h, f.visible = n.visible !== !1, f.scale.set(n.scale.x / y, n.scale.y / v), f.angle = n.angle - b, g.alpha = l * (n.alpha ?? 1), g.clear(), w < d) {
        const I = w - s;
        g.beginFill(16777215, 1), g.moveTo(I, 0), g.lineTo(I + s, 0), g.lineTo(I + s - a, a), g.lineTo(I - a, a), g.closePath(), g.endFill();
      }
    },
    detach() {
      g.mask = null, f.parent && f.parent.removeChild(f), f.destroy({ children: !0 });
    }
  };
});
me("breathe", (t, e = {}) => {
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
me("tiltFollow", (t, e = {}) => {
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
me("slideReveal", (t, e = {}, n) => {
  const i = t.mesh;
  if (!i) return { update() {
  }, detach() {
  } };
  if (n) return { update() {
  }, detach() {
  } };
  const r = e.offsetX ?? 0, a = e.offsetY ?? 20, o = e.durationFrames ?? 20, s = rt(e.easing ?? "easeOutCubic"), l = e.delay ?? 0, u = i.position.x, d = i.position.y, h = i.alpha;
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
me("embers", (t, e = {}) => {
  const n = t.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), a = Math.abs(i.height), o = e.count ?? 12, s = e.speed ?? 0.5, l = e.color ?? 16737792, u = e.alpha ?? 0.6, d = e.size ?? 2, h = new PIXI.Container();
  h.pivot.set(r / 2, a / 2), h.position.set(r / 2, a / 2);
  const f = new PIXI.Graphics();
  h.addChild(f), t.addChild(h);
  const g = n.scale.x, p = n.scale.y, y = n.angle, v = [];
  function b() {
    const w = Math.random();
    let C, I;
    return w < 0.7 ? (C = Math.random() * r, I = a) : w < 0.85 ? (C = 0, I = a * 0.5 + Math.random() * a * 0.5) : (C = r, I = a * 0.5 + Math.random() * a * 0.5), {
      x: C,
      y: I,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -s * (0.5 + Math.random() * 0.5),
      life: 0,
      maxLife: 40 + Math.random() * 60,
      size: d * (0.5 + Math.random() * 0.5)
    };
  }
  return c(b, "spawnParticle"), {
    update(w) {
      h.visible = n.visible !== !1, h.scale.set(n.scale.x / g, n.scale.y / p), h.angle = n.angle - y, v.length < o && v.push(b());
      for (let C = v.length - 1; C >= 0; C--) {
        const I = v[C];
        if (I.life += w, I.life >= I.maxLife) {
          v.splice(C, 1);
          continue;
        }
        I.x += I.vx * w, I.y += I.vy * w, I.vx += (Math.random() - 0.5) * 0.05 * w;
      }
      f.clear();
      for (const C of v) {
        const I = 1 - C.life / C.maxLife;
        f.beginFill(l, u * I * (n.alpha ?? 1)), f.drawCircle(C.x, C.y, C.size), f.endFill();
      }
    },
    detach() {
      h.parent && h.parent.removeChild(h), h.destroy({ children: !0 });
    }
  };
});
me("runeGlow", (t, e = {}) => {
  const n = t.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), a = Math.abs(i.height), o = 2 * (r + a), s = e.dots ?? 3, l = e.speed ?? 1.2, u = e.color ?? 4513279, d = e.color2 ?? 8930559, h = e.radius ?? 3, f = e.alpha ?? 0.7, g = new PIXI.Graphics();
  g.pivot.set(r / 2, a / 2), g.position.set(r / 2, a / 2), t.addChildAt(g, 0);
  const p = n.scale.x, y = n.scale.y, v = n.angle, b = [];
  for (let I = 0; I < s; I++)
    b.push({
      phase: I / s * o,
      speedMul: 0.7 + Math.random() * 0.6,
      color: I % 2 === 0 ? u : d
    });
  function w(I) {
    return I = (I % o + o) % o, I < r ? { x: I, y: 0 } : (I -= r, I < a ? { x: r, y: I } : (I -= a, I < r ? { x: r - I, y: a } : (I -= r, { x: 0, y: a - I })));
  }
  c(w, "perimeterPoint");
  let C = 0;
  return {
    update(I) {
      C += I, g.visible = n.visible !== !1, g.alpha = f * (n.alpha ?? 1), g.scale.set(n.scale.x / p, n.scale.y / y), g.angle = n.angle - v, g.clear();
      for (const A of b) {
        const O = w(A.phase + C * l * A.speedMul);
        g.beginFill(A.color, 1), g.drawCircle(O.x, O.y, h), g.endFill();
      }
    },
    detach() {
      g.parent && g.parent.removeChild(g), g.destroy({ children: !0 });
    }
  };
});
me("ripple", (t, e = {}) => {
  const n = t.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), a = Math.abs(i.height), o = e.maxRadius ?? Math.sqrt(r * r + a * a) / 2, s = e.rings ?? 3, l = e.interval ?? 30, u = e.speed ?? 1.5, d = e.color ?? 4513279, h = e.alpha ?? 0.4, f = e.lineWidth ?? 1.5, g = new PIXI.Container();
  g.pivot.set(r / 2, a / 2), g.position.set(r / 2, a / 2);
  const p = new PIXI.Graphics();
  g.addChild(p), t.addChild(g);
  const y = n.scale.x, v = n.scale.y, b = n.angle, w = [];
  let C = 0, I = 0;
  return {
    update(A) {
      C += A, g.visible = n.visible !== !1, g.scale.set(n.scale.x / y, n.scale.y / v), g.angle = n.angle - b, C >= I && w.length < s && (w.push({ radius: 0, alpha: h }), I = C + l);
      for (let _ = w.length - 1; _ >= 0; _--) {
        const j = w[_];
        j.radius += u * A, j.alpha = h * (1 - j.radius / o), j.radius >= o && w.splice(_, 1);
      }
      p.clear();
      const O = r / 2, M = a / 2;
      for (const _ of w)
        p.lineStyle(f, d, _.alpha * (n.alpha ?? 1)), p.drawCircle(O, M, _.radius);
    },
    detach() {
      g.parent && g.parent.removeChild(g), g.destroy({ children: !0 });
    }
  };
});
me("frostEdge", (t, e = {}) => {
  const n = t.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), a = Math.abs(i.height), o = e.segments ?? 20, s = e.maxLength ?? 15, l = e.color ?? 11197951, u = e.alpha ?? 0.5, d = e.growSpeed ?? 0.02, h = new PIXI.Container();
  h.pivot.set(r / 2, a / 2), h.position.set(r / 2, a / 2);
  const f = new PIXI.Graphics(), g = new PIXI.Graphics();
  g.beginFill(16777215), g.drawRect(0, 0, r, a), g.endFill(), h.addChild(g), f.mask = g, h.addChild(f), t.addChild(h);
  const p = n.scale.x, y = n.scale.y, v = n.angle, b = [];
  for (let I = 0; I < o; I++) {
    const A = Math.floor(Math.random() * 4);
    let O, M, _;
    switch (A) {
      case 0:
        O = Math.random() * r, M = 0, _ = Math.PI / 2 + (Math.random() - 0.5) * 0.6;
        break;
      case 1:
        O = r, M = Math.random() * a, _ = Math.PI + (Math.random() - 0.5) * 0.6;
        break;
      case 2:
        O = Math.random() * r, M = a, _ = -Math.PI / 2 + (Math.random() - 0.5) * 0.6;
        break;
      default:
        O = 0, M = Math.random() * a, _ = (Math.random() - 0.5) * 0.6;
        break;
    }
    b.push({ sx: O, sy: M, angle: _, targetLength: s * (0.4 + Math.random() * 0.6), currentLength: 0, grown: !1 });
  }
  let w = !1, C = 0;
  return {
    update(I) {
      if (h.visible = n.visible !== !1, h.scale.set(n.scale.x / p, n.scale.y / y), h.angle = n.angle - v, w)
        C += I * 0.03;
      else {
        w = !0;
        for (const O of b)
          O.grown || (O.currentLength += (O.targetLength - O.currentLength) * d * I, O.currentLength >= O.targetLength * 0.99 ? (O.currentLength = O.targetLength, O.grown = !0) : w = !1);
      }
      const A = w ? u * (0.7 + 0.3 * Math.sin(C)) : u;
      f.clear(), f.lineStyle(1.5, l, A * (n.alpha ?? 1));
      for (const O of b)
        O.currentLength <= 0 || (f.moveTo(O.sx, O.sy), f.lineTo(O.sx + Math.cos(O.angle) * O.currentLength, O.sy + Math.sin(O.angle) * O.currentLength));
    },
    detach() {
      f.mask = null, h.parent && h.parent.removeChild(h), h.destroy({ children: !0 });
    }
  };
});
me("shadowLift", (t, e = {}) => {
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
  const r = e.offsetY ?? 6, a = e.blur ?? 6, o = e.alpha ?? 0.35, s = e.color ?? 0, l = e.durationFrames ?? 12, u = rt(e.easing ?? "easeOutCubic"), d = new i();
  d.blur = a, d.alpha = 0, d.color = s, d.quality = 3, d.distance = 0, d.rotation = 90;
  const h = n.filters ? [...n.filters] : [];
  n.filters = [...h, d];
  let f = 0;
  return {
    update(v) {
      if (f < l) {
        f += v;
        const b = Math.min(f / l, 1), w = u(b);
        d.distance = r * w, d.alpha = o * w;
      }
    },
    detach() {
      n.filters && (n.filters = n.filters.filter((v) => v !== d), n.filters.length === 0 && (n.filters = null)), d.destroy();
    }
  };
});
me("none", () => ({ update() {
}, detach() {
} }));
me("tween-prop", (t, e = {}) => {
  const n = t.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.attribute ?? "alpha", r = e.from ?? 0.85, a = e.to ?? 1, o = e.period ?? 1500, s = rt(e.easing ?? "easeInOutCosine"), u = { alpha: "alpha", rotation: "angle" }[i] ?? i, d = n[u];
  let h = 0;
  return {
    update(f) {
      h += f;
      const g = o / 16.667, p = Math.abs(h / g % 2 - 1), y = s(p);
      n[u] = r + (a - r) * y;
    },
    detach() {
      n[u] = d;
    }
  };
});
me("tween-tint", (t, e = {}) => {
  const n = t.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.fromColor ?? "#ffffff", r = e.toColor ?? "#ffcc88", a = e.mode ?? "oklch", o = e.period ?? 3e3, s = rt(e.easing ?? "easeInOutCosine"), l = mc(a), u = foundry.utils.Color, d = u.from(i), h = u.from(r), f = n.tint;
  let g = 0;
  return {
    update(p) {
      g += p;
      const y = o / 16.667, v = Math.abs(g / y % 2 - 1), b = s(v), w = l(d, h, b);
      n.tint = u.from(w).valueOf();
    },
    detach() {
      n.tint = f;
    }
  };
});
me("tween-scale", (t, e = {}) => {
  const n = t.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.fromScale ?? 0.95, r = e.toScale ?? 1.05, a = e.period ?? 2e3, o = rt(e.easing ?? "easeInOutCosine"), s = n.scale.x, l = n.scale.y;
  let u = 0;
  return {
    update(d) {
      u += d;
      const h = a / 16.667, f = Math.abs(u / h % 2 - 1), g = o(f), p = i + (r - i) * g;
      n.scale.set(s * p, l * p);
    },
    detach() {
      n.scale.set(s, l);
    }
  };
});
const lr = {
  always: [],
  idle: ["float", "glow"],
  hover: ["scale"],
  dim: ["none"]
};
function ib(t) {
  if (!t) return { ...lr };
  const e = /* @__PURE__ */ c((n, i) => n === void 0 ? i : typeof n == "string" ? [n] : typeof n == "object" && !Array.isArray(n) && n.name ? [n] : Array.isArray(n) ? n : i, "normalize");
  return {
    always: e(t.always, lr.always),
    idle: e(t.idle, lr.idle),
    hover: e(t.hover, lr.hover),
    dim: e(t.dim, lr.dim)
  };
}
c(ib, "normalizeConfig");
var be, At, Bt, kt, xn, _n, Ut, Mt, dn, we, Gf, $a, zf, Wf, Yf, Kf, Jf, Xf;
const Cr = class Cr {
  /**
   * @param {PlaceableObject} placeable
   * @param {object|undefined} animationConfig  Raw animation config from the await entry
   */
  constructor(e, n) {
    k(this, we);
    k(this, be);
    k(this, At);
    k(this, Bt, null);
    k(this, kt, []);
    k(this, xn, []);
    k(this, _n, null);
    k(this, Ut, null);
    k(this, Mt, null);
    k(this, dn, 0);
    L(this, be, e), L(this, At, ib(n));
  }
  /** Current animation state name. */
  get state() {
    return m(this, Bt);
  }
  /**
   * Start animating in the given state.
   * @param {string} [state="idle"]
   */
  start(e = "idle") {
    var r;
    S(this, we, Gf).call(this);
    const n = ((r = m(this, be).document) == null ? void 0 : r.id) ?? "?", i = m(this, Ut);
    i && console.log(`%c[TileAnimator ${n}] start("${e}") canonical: pos=(${i.x.toFixed(2)}, ${i.y.toFixed(2)}) scale=(${i.scaleX.toFixed(4)}, ${i.scaleY.toFixed(4)}) alpha=${i.alpha.toFixed(4)} angle=${i.angle.toFixed(2)}`, "color: #FFAA44; font-weight: bold"), S(this, we, Jf).call(this), S(this, we, Yf).call(this, e), L(this, _n, (a) => {
      if (m(this, be).destroyed || !m(this, be).transform) {
        this.detach();
        return;
      }
      m(this, Mt) && S(this, we, $a).call(this);
      for (const o of m(this, xn)) o.update(a);
      for (const o of m(this, kt)) o.update(a);
      S(this, we, Wf).call(this, a);
    }), canvas.app.ticker.add(m(this, _n));
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
    if (e === m(this, Bt)) return;
    const n = ((h = m(this, be).document) == null ? void 0 : h.id) ?? "?", i = m(this, be).mesh, r = m(this, At)[m(this, Bt)] ?? m(this, At).idle ?? ["none"], a = m(this, At)[e] ?? m(this, At).idle ?? ["none"], o = r.map((f) => typeof f == "string" ? f : f == null ? void 0 : f.name), s = a.map((f) => typeof f == "string" ? f : f == null ? void 0 : f.name);
    if (console.log(`%c[TileAnimator ${n}] setState: ${m(this, Bt)} → ${e}`, "color: #44DDFF; font-weight: bold"), console.log(`  old behaviours: [${o.join(", ")}]  →  new: [${s.join(", ")}]`), i && console.log(`  mesh BEFORE detach: pos=(${i.position.x.toFixed(2)}, ${i.position.y.toFixed(2)}) scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)} angle=${i.angle.toFixed(2)}`), m(this, Ut)) {
      const f = m(this, Ut);
      console.log(`  canonical: pos=(${f.x.toFixed(2)}, ${f.y.toFixed(2)}) scale=(${f.scaleX.toFixed(4)}, ${f.scaleY.toFixed(4)}) alpha=${f.alpha.toFixed(4)} angle=${f.angle.toFixed(2)}`);
    }
    const l = /* @__PURE__ */ new Map();
    for (let f = 0; f < m(this, kt).length; f++) {
      const g = r[f], p = typeof g == "string" ? g : g == null ? void 0 : g.name;
      p && l.set(p, m(this, kt)[f]);
    }
    const u = [], d = /* @__PURE__ */ new Set();
    for (const f of a) {
      const g = typeof f == "string" ? f : f.name;
      l.has(g) && !d.has(g) && d.add(g);
    }
    console.log(`  reused: [${[...d].join(", ")}]  detaching: [${[...l.keys()].filter((f) => !d.has(f)).join(", ")}]`), S(this, we, zf).call(this);
    for (const [f, g] of l)
      d.has(f) || (g.detach(), i && console.log(`  mesh AFTER detach("${f}"): scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)}`));
    S(this, we, $a).call(this), i && console.log(`  mesh AFTER canonical restore: scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)}`);
    for (const f of a) {
      const g = typeof f == "string" ? f : f.name;
      if (l.has(g) && d.has(g))
        u.push(l.get(g)), d.delete(g), console.log(`  → reuse "${g}"`);
      else {
        const p = typeof f == "string" ? void 0 : f, y = Na(g);
        if (!y) {
          console.warn(`TileAnimator: unknown behaviour "${g}"`);
          continue;
        }
        u.push(y(m(this, be), p, m(this, Ut))), i && console.log(`  → create "${g}" — mesh after factory: scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)} pos=(${i.position.x.toFixed(2)}, ${i.position.y.toFixed(2)})`);
      }
    }
    if (m(this, Mt)) {
      const f = m(this, Mt);
      console.log(`  blend FROM: pos=(${f.x.toFixed(2)}, ${f.y.toFixed(2)}) scale=(${f.scaleX.toFixed(4)}, ${f.scaleY.toFixed(4)}) alpha=${f.alpha.toFixed(4)}`);
    }
    L(this, Bt, e), L(this, kt, u);
  }
  /**
   * Full cleanup — detach all behaviours, restore canonical, and remove ticker.
   */
  detach() {
    var n, i;
    m(this, be).destroyed || !m(this, be).transform ? (L(this, kt, []), L(this, xn, [])) : (S(this, we, Kf).call(this), S(this, we, Xf).call(this), S(this, we, $a).call(this)), L(this, Mt, null), L(this, Bt, null), m(this, _n) && ((i = (n = canvas.app) == null ? void 0 : n.ticker) == null || i.remove(m(this, _n)), L(this, _n, null));
  }
};
be = new WeakMap(), At = new WeakMap(), Bt = new WeakMap(), kt = new WeakMap(), xn = new WeakMap(), _n = new WeakMap(), Ut = new WeakMap(), Mt = new WeakMap(), dn = new WeakMap(), we = new WeakSet(), // ── Private ──────────────────────────────────────────────────────────
Gf = /* @__PURE__ */ c(function() {
  const e = m(this, be).mesh;
  e && L(this, Ut, {
    x: e.position.x,
    y: e.position.y,
    scaleX: e.scale.x,
    scaleY: e.scale.y,
    angle: e.angle,
    alpha: e.alpha,
    tint: e.tint
  });
}, "#captureCanonical"), $a = /* @__PURE__ */ c(function() {
  const e = m(this, be).mesh;
  if (!e || !m(this, Ut)) return;
  const n = m(this, Ut);
  e.position.x = n.x, e.position.y = n.y, e.scale.x = n.scaleX, e.scale.y = n.scaleY, e.angle = n.angle, e.alpha = n.alpha, e.tint = n.tint;
}, "#restoreCanonical"), /**
 * Snapshot the current (animated) mesh values so the transition blend
 * can lerp FROM here toward the new state's computed values.
 */
zf = /* @__PURE__ */ c(function() {
  const e = m(this, be).mesh;
  e && (L(this, Mt, {
    x: e.position.x,
    y: e.position.y,
    scaleX: e.scale.x,
    scaleY: e.scale.y,
    angle: e.angle,
    alpha: e.alpha
  }), L(this, dn, 0));
}, "#captureBlendStart"), /**
 * After behaviours compute the new state's mesh values, blend from the
 * pre-transition snapshot toward those values over BLEND_FRAMES using
 * easeOutCubic. This hides the canonical-restore snap entirely.
 */
Wf = /* @__PURE__ */ c(function(e) {
  var o, s;
  if (!m(this, Mt)) return;
  L(this, dn, m(this, dn) + e);
  const n = Math.min(m(this, dn) / Cr.BLEND_FRAMES, 1);
  if (n >= 1) {
    const l = ((o = m(this, be).document) == null ? void 0 : o.id) ?? "?";
    console.log(`%c[TileAnimator ${l}] blend complete`, "color: #88FF88"), L(this, Mt, null);
    return;
  }
  const i = 1 - (1 - n) ** 3, r = m(this, be).mesh;
  if (!r) return;
  const a = m(this, Mt);
  if (m(this, dn) <= e * 3) {
    const l = ((s = m(this, be).document) == null ? void 0 : s.id) ?? "?", u = Math.round(m(this, dn) / e);
    console.log(`  [blend ${l} f${u}] t=${n.toFixed(3)} eased=${i.toFixed(3)} | behaviour→scale=(${r.scale.x.toFixed(4)},${r.scale.y.toFixed(4)}) alpha=${r.alpha.toFixed(4)} | blendFrom→scale=(${a.scaleX.toFixed(4)},${a.scaleY.toFixed(4)}) alpha=${a.alpha.toFixed(4)}`);
  }
  r.position.x = a.x + (r.position.x - a.x) * i, r.position.y = a.y + (r.position.y - a.y) * i, r.scale.x = a.scaleX + (r.scale.x - a.scaleX) * i, r.scale.y = a.scaleY + (r.scale.y - a.scaleY) * i, r.angle = a.angle + (r.angle - a.angle) * i, r.alpha = a.alpha + (r.alpha - a.alpha) * i, m(this, dn) <= e * 3 && console.log(`  [blend result] scale=(${r.scale.x.toFixed(4)},${r.scale.y.toFixed(4)}) alpha=${r.alpha.toFixed(4)} pos=(${r.position.x.toFixed(2)},${r.position.y.toFixed(2)})`);
}, "#applyBlend"), Yf = /* @__PURE__ */ c(function(e) {
  L(this, Bt, e);
  const n = m(this, At)[e] ?? m(this, At).idle ?? ["none"];
  for (const i of n) {
    const r = typeof i == "string" ? i : i.name, a = typeof i == "string" ? void 0 : i, o = Na(r);
    if (!o) {
      console.warn(`TileAnimator: unknown behaviour "${r}"`);
      continue;
    }
    m(this, kt).push(o(m(this, be), a));
  }
}, "#attachBehaviours"), Kf = /* @__PURE__ */ c(function() {
  for (const e of m(this, kt)) e.detach();
  L(this, kt, []);
}, "#detachBehaviours"), Jf = /* @__PURE__ */ c(function() {
  const e = m(this, At).always ?? [];
  for (const n of e) {
    const i = typeof n == "string" ? n : n.name, r = typeof n == "string" ? void 0 : n, a = Na(i);
    if (!a) {
      console.warn(`TileAnimator: unknown always behaviour "${i}"`);
      continue;
    }
    m(this, xn).push(a(m(this, be), r));
  }
}, "#attachAlwaysBehaviours"), Xf = /* @__PURE__ */ c(function() {
  for (const e of m(this, xn)) e.detach();
  L(this, xn, []);
}, "#detachAlwaysBehaviours"), c(Cr, "TileAnimator"), /** Frames over which state transitions are blended (easeOutCubic). */
ye(Cr, "BLEND_FRAMES", 8);
let Ci = Cr;
const rb = "cinematic", Ts = 5, Wl = /* @__PURE__ */ new Set();
function tn(t) {
  for (const e of Wl)
    try {
      e(t);
    } catch (n) {
      console.error("[cinematic] playback listener error:", n);
    }
}
c(tn, "emitPlaybackEvent");
function ab(t) {
  return Wl.add(t), () => Wl.delete(t);
}
c(ab, "onPlaybackProgress");
let Ce = null, sn = null, vr = null, wr = null, Ai = 0, ei = null;
function bc(t, e = "default") {
  return `cinematic-progress-${t}-${e}`;
}
c(bc, "progressFlagKey");
function ob(t, e, n, i) {
  game.user.setFlag(T, bc(t, e), {
    currentSegment: n,
    completedSegments: [...i],
    timestamp: Date.now()
  }).catch(() => {
  });
}
c(ob, "saveSegmentProgress");
function Yl(t, e = "default") {
  game.user.unsetFlag(T, bc(t, e)).catch(() => {
  });
}
c(Yl, "clearProgress");
function Qf(t, e = "default", n = 3e5) {
  const i = game.user.getFlag(T, bc(t, e));
  return !i || typeof i.timestamp != "number" || Date.now() - i.timestamp > n ? null : i.currentSegment ? i : null;
}
c(Qf, "getSavedProgress");
function Ti(t, e = "default") {
  return `cinematic-seen-${t}-${e}`;
}
c(Ti, "seenFlagKey");
function vu(t, e = "default") {
  return !!game.user.getFlag(T, Ti(t, e));
}
c(vu, "hasSeenCinematic");
function sb(t, e) {
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
c(sb, "validateSingleCinematic");
function ns(t) {
  const e = t ? game.scenes.get(t) : canvas.scene;
  let n = (e == null ? void 0 : e.getFlag(T, rb)) ?? null;
  if (n == null) return null;
  if (typeof n != "object" || Array.isArray(n))
    return console.warn(`[${T}] Cinematic: invalid flag data on scene ${e == null ? void 0 : e.id} (expected object). Ignoring.`), null;
  if ((n.version ?? 1) < 3) {
    const { version: i, ...r } = n;
    n = { version: 3, cinematics: { default: r } };
  }
  if (n.version === 3) {
    for (const [i, r] of Object.entries(n.cinematics ?? {}))
      n.cinematics[i] = Wt.migrateV3toV4(r);
    n.version = 4;
  }
  if (n.version === 4) {
    for (const [i, r] of Object.entries(n.cinematics ?? {}))
      n.cinematics[i] = Wt.migrateV4toV5(r);
    n.version = Ts;
  }
  if (n.version > Ts)
    return console.warn(`[${T}] Cinematic: scene ${e == null ? void 0 : e.id} has version ${n.version}, runtime supports up to ${Ts}. Skipping.`), null;
  if (!n.cinematics || typeof n.cinematics != "object")
    return console.warn(`[${T}] Cinematic: no 'cinematics' map on scene ${e == null ? void 0 : e.id}. Ignoring.`), null;
  for (const [i, r] of Object.entries(n.cinematics)) {
    const a = sb(r, `scene ${e == null ? void 0 : e.id} cinematic "${i}"`);
    a ? n.cinematics[i] = a : delete n.cinematics[i];
  }
  return Object.keys(n.cinematics).length === 0 ? null : n;
}
c(ns, "getCinematicData");
function oo(t, e = "default") {
  var i;
  const n = ns(t);
  return ((i = n == null ? void 0 : n.cinematics) == null ? void 0 : i[e]) ?? null;
}
c(oo, "getNamedCinematic");
function lb(t) {
  const e = ns(t);
  return e ? Object.keys(e.cinematics) : [];
}
c(lb, "listCinematicNames");
function cb() {
  return game.ready ? Promise.resolve() : new Promise((t) => Hooks.once("ready", t));
}
c(cb, "waitForReady");
async function ub(t = 1e4) {
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
c(ub, "waitForTweenAPI");
async function Kl(t = 5e3) {
  var e;
  return window.Tagger ?? ((e = game.modules.get("tagger")) == null ? void 0 : e.api) ? !0 : new Promise((n) => {
    const i = Date.now(), r = setInterval(() => {
      var a;
      window.Tagger ?? ((a = game.modules.get("tagger")) == null ? void 0 : a.api) ? (clearInterval(r), n(!0)) : Date.now() - i > t && (clearInterval(r), console.warn(`[${T}] Cinematic: Tagger API not available after ${t}ms.`), n(!1));
    }, 200);
  });
}
c(Kl, "waitForTagger");
async function db(t, e, n) {
  if (!t || !t.event) return;
  const i = { ...t };
  console.log(`[${T}] Cinematic: waiting for gate: ${t.event}`);
  let r = null;
  if (t.event === "tile-click" && t.target && t.animation) {
    const a = e.get(t.target);
    (a == null ? void 0 : a.kind) === "placeable" && a.placeable && (r = new Ci(a.placeable, t.animation), r.start());
  }
  try {
    if (t.timeout && t.timeout > 0) {
      const a = new Promise((s) => setTimeout(s, t.timeout)), o = Ol(i, { signal: n.signal, eventBus: null });
      await Promise.race([o, a]);
    } else
      await Ol(i, { signal: n.signal, eventBus: null });
  } finally {
    r && r.detach();
  }
}
c(db, "processGate");
function Zf(t) {
  if (!t.segments) return [];
  const e = [], n = /* @__PURE__ */ new Set();
  let i = t.entry;
  for (; i && typeof i == "string" && t.segments[i] && !n.has(i); )
    n.add(i), e.push(i), i = t.segments[i].next;
  return e;
}
c(Zf, "getSegmentOrder");
function so(t, e) {
  if (t.setup)
    try {
      Oe(t.setup, e);
    } catch (i) {
      console.warn(`[${T}] Cinematic: error applying cinematic-level setup:`, i);
    }
  const n = Zf(t);
  for (const i of n) {
    const r = t.segments[i];
    if (r.setup)
      try {
        Oe(r.setup, e);
      } catch (a) {
        console.warn(`[${T}] Cinematic: error applying setup for segment "${i}":`, a);
      }
    if (r.landing)
      try {
        Oe(r.landing, e);
      } catch (a) {
        console.warn(`[${T}] Cinematic: error applying landing for segment "${i}":`, a);
      }
  }
  if (t.landing)
    try {
      Oe(t.landing, e);
    } catch (i) {
      console.warn(`[${T}] Cinematic: error applying cinematic-level landing:`, i);
    }
  canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
}
c(so, "applyAllSegmentLandingStates");
async function Er(t, e = "default", n = null) {
  var w, C, I, A, O, M, _, j;
  const i = t ?? ((w = canvas.scene) == null ? void 0 : w.id);
  if (!i) return;
  const r = `${i}:${e}`;
  if (n || (n = /* @__PURE__ */ new Set()), n.has(r)) {
    console.warn(`[${T}] Cinematic: circular transition detected at "${r}". Stopping chain.`), (I = (C = ui.notifications) == null ? void 0 : C.warn) == null || I.call(C, "Cinematic: circular transition detected, stopping.");
    return;
  }
  n.add(r), (Ce == null ? void 0 : Ce.status) === "running" && Ce.cancel("replaced"), Ce = null, sn && (sn.abort("replaced"), sn = null);
  const a = oo(i, e);
  if (!a) {
    console.warn(`[${T}] Cinematic: no cinematic "${e}" on scene ${i}.`);
    return;
  }
  const o = await ub();
  if (!o || ((A = canvas.scene) == null ? void 0 : A.id) !== i || (await Kl(), ((O = canvas.scene) == null ? void 0 : O.id) !== i)) return;
  const { targets: s, unresolved: l } = Za(a);
  if (console.log(`[${T}] Cinematic "${e}": resolved ${s.size} targets`), l.length && console.warn(`[${T}] Cinematic "${e}": skipping ${l.length} unresolved: ${l.join(", ")}`), s.size === 0) {
    console.warn(`[${T}] Cinematic "${e}": no targets could be resolved on scene ${i}.`);
    return;
  }
  const u = fy(a);
  vr = dy(u, s), wr = s;
  const d = Qf(i, e), h = new AbortController();
  sn = h;
  const f = a.synchronized === !0 && game.user.isGM, g = Zf(a);
  if (g.length === 0) {
    console.warn(`[${T}] Cinematic "${e}": no segments to execute.`);
    return;
  }
  let p = 0;
  const y = /* @__PURE__ */ new Set();
  if (d) {
    const D = d.completedSegments ?? [];
    for (const $ of D) y.add($);
    const P = g.indexOf(d.currentSegment);
    P >= 0 && (p = P, console.log(`[${T}] Cinematic "${e}": resuming from segment "${d.currentSegment}" (${D.length} completed)`));
  }
  if (a.setup)
    try {
      Oe(a.setup, s), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    } catch (D) {
      console.error(`[${T}] Cinematic "${e}": error applying cinematic-level setup:`, D);
    }
  for (let D = 0; D < p; D++) {
    const P = g[D], $ = a.segments[P];
    if ($.setup)
      try {
        Oe($.setup, s);
      } catch (R) {
        console.warn(`[${T}] Cinematic: error applying setup for completed segment "${P}":`, R);
      }
    if ($.landing)
      try {
        Oe($.landing, s);
      } catch (R) {
        console.warn(`[${T}] Cinematic: error applying landing for completed segment "${P}":`, R);
      }
  }
  let v = !1, b = !1;
  tn({ type: "playback-start", sceneName: ((M = canvas.scene) == null ? void 0 : M.name) ?? i });
  try {
    for (let D = p; D < g.length; D++) {
      if (h.signal.aborted) {
        v = !0;
        break;
      }
      if (((_ = canvas.scene) == null ? void 0 : _.id) !== i) {
        v = !0;
        break;
      }
      const P = g[D], $ = a.segments[P];
      if (console.log(`[${T}] Cinematic "${e}": entering segment "${P}"`), tn({ type: "segment-start", segmentName: P }), ob(i, e, P, [...y]), $.gate) {
        tn({ type: "gate-wait", segmentName: P, gate: $.gate });
        try {
          await db($.gate, s, h);
        } catch (B) {
          if (h.signal.aborted) {
            v = !0;
            break;
          }
          throw B;
        }
        tn({ type: "gate-resolved", segmentName: P });
      }
      if (h.signal.aborted) {
        v = !0;
        break;
      }
      if ($.setup)
        try {
          Oe($.setup, s), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
        } catch (B) {
          console.error(`[${T}] Cinematic "${e}": error applying setup for segment "${P}":`, B);
        }
      if ((j = $.timeline) != null && j.length) {
        const B = yc($.timeline);
        tn({ type: "timeline-start", segmentName: P, durationMs: B });
        const { tl: W } = vy(
          { setup: {}, timeline: $.timeline },
          s,
          o,
          {
            timelineName: `cinematic-${i}-${e}-${P}`,
            onStepComplete: /* @__PURE__ */ c((U) => {
              tn({ type: "step-complete", segmentName: P, stepIndex: U });
            }, "onStepComplete")
          }
        );
        Ce = W.run({
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
            v = !0;
            break;
          }
          throw U;
        }
        tn({ type: "timeline-end", segmentName: P });
      }
      if (h.signal.aborted) {
        v = !0;
        break;
      }
      if ($.landing)
        try {
          Oe($.landing, s), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
        } catch (B) {
          console.error(`[${T}] Cinematic "${e}": error applying landing for segment "${P}":`, B);
        }
      tn({ type: "segment-complete", segmentName: P }), y.add(P);
      const R = $.next;
      if (R && typeof R == "object" && R.scene) {
        const B = R.scene, W = R.segment ?? a.entry;
        console.log(`[${T}] Cinematic "${e}": cross-scene transition to scene ${B}, segment "${W}"`), Ce = null, sn = null, Yl(i, e), su(), a.tracking !== !1 && await game.user.setFlag(T, Ti(i, e), !0), ei = { sceneId: B, cinematicName: e, visitedChain: n };
        const H = game.scenes.get(B);
        H ? H.view() : (console.warn(`[${T}] Cinematic: cross-scene transition target scene "${B}" not found.`), ei = null);
        return;
      }
    }
  } catch (D) {
    b = !0, console.error(`[${T}] Cinematic "${e}" error on scene ${i}:`, D);
  }
  if (Ce = null, sn = null, Yl(i, e), su(), vr = null, wr = null, tn({ type: "playback-end", cancelled: !!v }), v) {
    console.log(`[${T}] Cinematic "${e}" cancelled on scene ${i}.`), so(a, s);
    return;
  }
  if (b) {
    so(a, s);
    return;
  }
  a.tracking !== !1 && await game.user.setFlag(T, Ti(i, e), !0), console.log(`[${T}] Cinematic "${e}" complete on scene ${i}.`);
}
c(Er, "playCinematic");
async function fb(t, e = "default") {
  var i;
  const n = t ?? ((i = canvas.scene) == null ? void 0 : i.id);
  n && (await game.user.unsetFlag(T, Ti(n, e)), console.log(`[${T}] Cinematic: cleared seen flag for "${e}" on scene ${n}.`));
}
c(fb, "resetCinematic");
async function mb(t, e, n = "default") {
  var a;
  if (!game.user.isGM) return;
  const i = t ?? ((a = canvas.scene) == null ? void 0 : a.id);
  if (!i || !e) return;
  const r = game.users.get(e);
  r && (await r.unsetFlag(T, Ti(i, n)), console.log(`[${T}] Cinematic: cleared seen flag for user ${r.name} on "${n}" scene ${i}.`));
}
c(mb, "resetCinematicForUser");
async function hb(t, e = "default") {
  var a;
  if (!game.user.isGM) return;
  const n = t ?? ((a = canvas.scene) == null ? void 0 : a.id);
  if (!n) return;
  const i = Ti(n, e), r = game.users.map((o) => o.getFlag(T, i) ? o.unsetFlag(T, i) : Promise.resolve());
  await Promise.all(r), console.log(`[${T}] Cinematic: cleared seen flag for all users on "${e}" scene ${n}.`);
}
c(hb, "resetCinematicForAll");
function gb(t, e = "default") {
  var r;
  const n = t ?? ((r = canvas.scene) == null ? void 0 : r.id);
  if (!n) return [];
  const i = Ti(n, e);
  return game.users.map((a) => ({
    userId: a.id,
    name: a.name,
    color: a.color ?? "#888888",
    isGM: a.isGM,
    seen: !!a.getFlag(T, i)
  }));
}
c(gb, "getSeenStatus");
function pb(t, e) {
  var i;
  const n = t ?? ((i = canvas.scene) == null ? void 0 : i.id);
  return e ? oo(n, e) != null : ns(n) != null;
}
c(pb, "hasCinematic");
function yb() {
  if (!vr || !wr) {
    console.warn(`[${T}] Cinematic: no snapshot available for revert.`);
    return;
  }
  (Ce == null ? void 0 : Ce.status) === "running" && Ce.cancel("reverted"), Ce = null, sn && (sn.abort("reverted"), sn = null);
  try {
    Oe(vr, wr), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 }), console.log(`[${T}] Cinematic: reverted to pre-cinematic state.`);
  } catch (t) {
    console.error(`[${T}] Cinematic: error during revert:`, t);
  }
  vr = null, wr = null;
}
c(yb, "revertCinematic");
async function bb() {
  const t = ++Ai;
  if (console.log(`[${T}] Cinematic: canvasReady fired, gen=${t}, game.ready=${game.ready}`), await cb(), t !== Ai) return;
  console.log(`[${T}] Cinematic: game is ready`);
  const e = canvas.scene;
  if (!e) {
    console.log(`[${T}] Cinematic: no canvas.scene, exiting`);
    return;
  }
  if (ei && ei.sceneId === e.id) {
    const a = ei;
    ei = null, console.log(`[${T}] Cinematic: picking up pending transition to "${a.cinematicName}" on scene ${e.id}`);
    try {
      await Er(e.id, a.cinematicName, a.visitedChain);
    } catch (o) {
      console.error(`[${T}] Cinematic: error during pending transition playback on scene ${e.id}:`, o);
    }
    return;
  }
  ei = null;
  const n = ns(e.id);
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
    const o = Qf(e.id, a);
    if (t !== Ai) return;
    if (o) {
      console.log(`[${T}] Cinematic "${a}": found saved progress at segment "${o.currentSegment}", resuming...`);
      try {
        await Er(e.id, a);
      } catch (s) {
        console.error(`[${T}] Cinematic "${a}": error during resumed playback on scene ${e.id}:`, s);
      }
      return;
    }
  }
  let r = null;
  for (const { name: a, data: o } of i)
    if (!(o.tracking !== !1 && vu(e.id, a))) {
      r = { name: a, data: o };
      break;
    }
  if (!r) {
    if (console.log(`[${T}] Cinematic: all canvasReady cinematics already seen on scene ${e.id}`), vb(e.id, i), (Ce == null ? void 0 : Ce.status) === "running" && Ce.cancel("already-seen"), Ce = null, await Kl(), t !== Ai) return;
    for (const { name: a, data: o } of i)
      try {
        const { targets: s } = Za(o);
        so(o, s);
      } catch (s) {
        console.error(`[${T}] Cinematic "${a}": error applying landing states (already seen) on scene ${e.id}:`, s);
      }
    canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    return;
  }
  if (t === Ai && (console.log(`[${T}] Cinematic: playing first unseen cinematic "${r.name}"...`), await Kl(), t === Ai)) {
    for (const { name: a, data: o } of i) {
      if (a === r.name) continue;
      if (o.tracking !== !1 && vu(e.id, a))
        try {
          const { targets: l } = Za(o);
          so(o, l);
        } catch (l) {
          console.error(`[${T}] Cinematic "${a}": error applying landing states (already seen) on scene ${e.id}:`, l);
        }
    }
    try {
      await Er(e.id, r.name);
    } catch (a) {
      console.error(`[${T}] Cinematic "${r.name}": error during playback on scene ${e.id}:`, a);
    }
  }
}
c(bb, "onCanvasReady$1");
function vb(t, e) {
  for (const { name: n } of e)
    Yl(t, n);
}
c(vb, "clearAllCanvasReadyProgress");
function wb(t = 3e5) {
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
c(wb, "cleanupStaleProgressFlags");
function Eb() {
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
        new ql({ scene: canvas.scene }).render(!0);
      }, "onClick")
    };
    Array.isArray(i) ? i.push(a) : i instanceof Map ? i.set(r, a) : i && typeof i == "object" ? i[r] = a : n.tools = [a];
  });
}
c(Eb, "registerEditorButton");
function Sb() {
  Hooks.on("canvasReady", bb), Eb(), Hooks.once("ready", () => {
    wb();
    const t = game.modules.get(T);
    t.api || (t.api = {}), t.api.cinematic = {
      play: Er,
      reset: fb,
      resetForUser: mb,
      resetForAll: hb,
      getSeenStatus: gb,
      has: pb,
      get: oo,
      list: lb,
      revert: yb,
      onPlaybackProgress: ab,
      TileAnimator: Ci,
      registerBehaviour: me,
      getBehaviour: Na,
      trigger: /* @__PURE__ */ c(async (e, n, i = "default") => {
        var o;
        const r = n ?? ((o = canvas.scene) == null ? void 0 : o.id);
        if (!r) return;
        const a = oo(r, i);
        a && (a.trigger && a.trigger !== e || await Er(r, i));
      }, "trigger")
    }, console.log(`[${T}] Cinematic API registered (v5).`);
  });
}
c(Sb, "registerCinematicHooks");
function Jl(t, e) {
  const n = Math.abs(t.width), i = Math.abs(t.height), r = n / 2, a = i / 2;
  let o = e.x - (t.x + r), s = e.y - (t.y + a);
  if (t.rotation !== 0) {
    const l = Math.toRadians(t.rotation), u = Math.cos(l), d = Math.sin(l), h = u * o + d * s, f = u * s - d * o;
    o = h, s = f;
  }
  return o += r, s += a, o >= 0 && o <= n && s >= 0 && s <= i;
}
c(Jl, "pointWithinTile");
Qo("tile-click", (t, e) => t.target ? new Promise((n, i) => {
  var g;
  if (e.signal.aborted) return i(e.signal.reason ?? "aborted");
  const r = es(t.target);
  if (!((g = r == null ? void 0 : r.placeables) != null && g.length))
    return i(new Error(`await tile-click: no placeables found for "${t.target}"`));
  const a = r.placeables, o = [];
  for (const { placeable: p } of a) {
    const y = new Ci(p, t.animation);
    y.start("idle"), o.push({ placeable: p, animator: y });
  }
  const s = document.getElementById("board");
  let l = null;
  const u = /* @__PURE__ */ c((p) => {
    const y = canvas.activeLayer;
    if (!y) return;
    const v = y.toLocal(p);
    if (!v || isNaN(v.x) || isNaN(v.y)) return;
    let b = !1;
    for (const { placeable: w, animator: C } of o)
      Jl(w.document, v) ? (b = !0, C.state !== "hover" && C.setState("hover")) : C.state === "hover" && C.setState("idle");
    b ? l === null && (l = document.body.style.cursor, document.body.style.cursor = "pointer") : l !== null && (document.body.style.cursor = l, l = null);
  }, "onPointerMove");
  s == null || s.addEventListener("pointermove", u);
  const d = /* @__PURE__ */ c((p) => {
    if (p.button !== 0) return;
    const y = canvas.activeLayer;
    if (!y) return;
    const v = y.toLocal(p);
    isNaN(v.x) || isNaN(v.y) || !a.filter(({ doc: w }) => Jl(w, v)).sort((w, C) => (C.doc.sort ?? 0) - (w.doc.sort ?? 0))[0] || (p.stopPropagation(), p.preventDefault(), f(), n());
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
Sb();
function Cb() {
  Hooks.once("ready", () => {
    const t = game.modules.get(T);
    t.api || (t.api = {}), t.api.picker = {
      /** Open the picker window. Returns Promise<string[] | null>. */
      open: /* @__PURE__ */ c((e) => ao.open(e), "open"),
      /** Resolve a selector string to documents. */
      resolveSelector: es,
      /** Parse a selector string into { type, value }. */
      parseSelector: pc,
      /** Build a selector string from { type, value }. */
      buildSelector: oy,
      /** Build a tag selector from tags array + mode. */
      buildTagSelector: gf,
      /** Canvas highlight utilities. */
      highlight: {
        add: ro,
        remove: Qi,
        has: If,
        clearAll: Ma
      }
    }, console.log(`[${T}] Placeable Picker API registered.`);
  });
}
c(Cb, "registerPlaceablePickerHooks");
Cb();
const xa = "eidolon-utilities", Tb = "tile-interactions", Lb = "tile-animations", Ib = "idle-animation";
function Ob(t) {
  const e = t.type ?? "tile-prop";
  return e === "tile-tint" ? { name: "tween-tint", fromColor: t.fromColor, toColor: t.toColor, mode: t.mode, period: t.period, easing: t.easing } : e === "tile-scale" ? { name: "tween-scale", fromScale: t.fromScale, toScale: t.toScale, period: t.period, easing: t.easing } : { name: "tween-prop", attribute: t.attribute, from: t.from, to: t.to, period: t.period, easing: t.easing };
}
c(Ob, "migrateIdleTweenToAlways");
function vc(t) {
  var u, d, h;
  const e = (u = t == null ? void 0 : t.getFlag) == null ? void 0 : u.call(t, xa, Lb);
  if (e) return e;
  const n = (d = t == null ? void 0 : t.getFlag) == null ? void 0 : d.call(t, xa, Ib), i = (h = t == null ? void 0 : t.getFlag) == null ? void 0 : h.call(t, xa, Tb);
  let r = [], a = [], o = [], s = [];
  if (n) {
    let f;
    Array.isArray(n) ? f = n : typeof n == "object" && "0" in n ? f = Object.values(n) : typeof n == "object" && (n.type || n.attribute) ? f = [n] : f = [], r = f.filter((g) => g && typeof g == "object").map(Ob);
  }
  return i && (i.hover && (Array.isArray(i.hover) ? o = i.hover : typeof i.hover == "object" && (a = Array.isArray(i.hover.idle) ? i.hover.idle : [], o = Array.isArray(i.hover.enter) ? i.hover.enter : [])), Array.isArray(i.click) && i.click.length && (s = i.click)), r.length > 0 || a.length > 0 || o.length > 0 || s.length > 0 ? { always: r, idle: a, hover: o, click: s } : null;
}
c(vc, "readUnifiedConfig");
const fn = /* @__PURE__ */ new Map(), Un = /* @__PURE__ */ new Map(), wu = /* @__PURE__ */ new WeakMap(), Sr = /* @__PURE__ */ new Set();
let $t = null, Ye = null, Nt = null, Gt = null, zt = null;
function em(t) {
  const e = canvas.activeLayer;
  if (!e) return null;
  const n = e.toLocal(t);
  return !n || Number.isNaN(n.x) || Number.isNaN(n.y) ? null : n;
}
c(em, "canvasToLocal");
function tm(t) {
  let e = null, n = -1 / 0;
  for (const [i, r] of fn)
    if (Jl(r.doc, t)) {
      const a = r.doc.sort ?? 0;
      a > n && (e = r, n = a);
    }
  return e;
}
c(tm, "hitTest");
function Ab(t) {
  var e, n;
  return {
    always: t.always ?? [],
    idle: (e = t.idle) != null && e.length ? t.idle : ["none"],
    hover: (n = t.hover) != null && n.length ? t.hover : ["none"]
  };
}
c(Ab, "buildAnimatorConfig");
function wc(t, e, n) {
  Zr(t);
  const i = Ab(n), r = new Ci(e, i);
  r.start("idle"), Un.set(t, r);
}
c(wc, "startHoverAnimator");
function Zr(t) {
  const e = Un.get(t);
  e && (e.detach(), Un.delete(t));
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
function kb(t) {
  const e = t._source.width, n = t._source.height, i = t._source.x, r = t._source.y;
  return {
    baseWidth: e,
    baseHeight: n,
    centerX: i + e / 2,
    centerY: r + n / 2
  };
}
c(kb, "captureRefGeometry");
async function Mb(t, e) {
  const n = t.uuid, i = e.type ?? "tile-prop", r = tr(i);
  if (!r) {
    console.warn(`[${xa}] tile-interactions: unknown tween type "${i}"`);
    return;
  }
  const a = e.period ?? 300, o = e.easing ?? "easeOutCubic", s = e.mode ?? "bounce", l = i === "tile-scale" ? kb(t) : null;
  if (s === "toggle") {
    const d = !(wu.get(t) ?? !1);
    await r.execute(
      Ls(n, e, d, l),
      { durationMS: a, easing: o, commit: !0 }
    ), wu.set(t, d);
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
c(Mb, "playClickAnimation");
async function Nb(t) {
  var n, i, r, a;
  const e = t.doc.id;
  if (!Sr.has(e)) {
    Sr.add(e);
    try {
      Zr(e);
      const o = t.clickConfig.map((s) => Mb(t.doc, s));
      await Promise.all(o);
    } finally {
      Sr.delete(e), t.animConfig && (((n = t.animConfig.always) == null ? void 0 : n.length) > 0 || ((i = t.animConfig.idle) == null ? void 0 : i.length) > 0 || ((r = t.animConfig.hover) == null ? void 0 : r.length) > 0) && (wc(e, t.placeable, t.animConfig), $t === e && ((a = Un.get(e)) == null || a.setState("hover")));
    }
  }
}
c(Nb, "handleClick");
function nm(t) {
  var r;
  const e = em(t);
  if (!e) return;
  const n = tm(e), i = (n == null ? void 0 : n.doc.id) ?? null;
  if (i !== $t) {
    if ($t) {
      const a = Un.get($t);
      a && a.setState("idle");
    }
    if (i) {
      const a = Un.get(i);
      a && a.setState("hover");
    }
    $t = i, i && (n.animConfig || (r = n.clickConfig) != null && r.length) ? (Ye === null && (Ye = document.body.style.cursor), document.body.style.cursor = "pointer") : Ye !== null && (document.body.style.cursor = Ye, Ye = null);
  }
}
c(nm, "onPointerMove");
function im(t) {
  var i;
  if (t.button !== 0) return;
  const e = em(t);
  if (!e) return;
  const n = tm(e);
  !n || !((i = n.clickConfig) != null && i.length) || Nb(n);
}
c(im, "onPointerDown");
function rm() {
  if ($t) {
    const t = Un.get($t);
    t && t.setState("idle"), $t = null;
  }
  Ye !== null && (document.body.style.cursor = Ye, Ye = null);
}
c(rm, "onPointerLeave");
function am() {
  var n, i, r, a;
  for (const o of Un.keys())
    Zr(o);
  fn.clear(), Sr.clear(), $t = null, Ye !== null && (document.body.style.cursor = Ye, Ye = null);
  const t = document.getElementById("board");
  Nt && (t == null || t.removeEventListener("pointermove", Nt), Nt = null), Gt && (t == null || t.removeEventListener("pointerdown", Gt), Gt = null), zt && (t == null || t.removeEventListener("pointerleave", zt), zt = null);
  const e = (n = canvas.tiles) == null ? void 0 : n.placeables;
  if (Array.isArray(e)) {
    for (const o of e) {
      const s = o.document, l = vc(s);
      if (!l) continue;
      const u = ((i = l.always) == null ? void 0 : i.length) > 0 || ((r = l.idle) == null ? void 0 : r.length) > 0 || ((a = l.hover) == null ? void 0 : a.length) > 0, d = Array.isArray(l.click) && l.click.length ? l.click : null;
      !u && !d || (fn.set(s.id, { doc: s, placeable: o, animConfig: l, clickConfig: d }), u && wc(s.id, o, l));
    }
    fn.size !== 0 && (Nt = nm, Gt = im, zt = rm, t == null || t.addEventListener("pointermove", Nt), t == null || t.addEventListener("pointerdown", Gt), t == null || t.addEventListener("pointerleave", zt));
  }
}
c(am, "rebuild");
function $b(t) {
  var o, s, l;
  const e = t.id, n = vc(t), i = n && (((o = n.always) == null ? void 0 : o.length) > 0 || ((s = n.idle) == null ? void 0 : s.length) > 0 || ((l = n.hover) == null ? void 0 : l.length) > 0), r = n && Array.isArray(n.click) && n.click.length ? n.click : null;
  if (!i && !r) {
    om(t);
    return;
  }
  Zr(e);
  const a = t.object;
  if (!a) {
    fn.delete(e);
    return;
  }
  fn.set(e, { doc: t, placeable: a, animConfig: n, clickConfig: r }), i && wc(e, a, n), xb();
}
c($b, "updateTile");
function om(t) {
  const e = t.id;
  if (Zr(e), fn.delete(e), Sr.delete(e), $t === e && ($t = null, Ye !== null && (document.body.style.cursor = Ye, Ye = null)), fn.size === 0) {
    const n = document.getElementById("board");
    Nt && (n == null || n.removeEventListener("pointermove", Nt), Nt = null), Gt && (n == null || n.removeEventListener("pointerdown", Gt), Gt = null), zt && (n == null || n.removeEventListener("pointerleave", zt), zt = null);
  }
}
c(om, "removeTile");
function xb() {
  if (fn.size === 0 || Nt) return;
  const t = document.getElementById("board");
  t && (Nt = nm, Gt = im, zt = rm, t.addEventListener("pointermove", Nt), t.addEventListener("pointerdown", Gt), t.addEventListener("pointerleave", zt));
}
c(xb, "ensureListeners");
function Ni(t, e, n) {
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
c(Ni, "buildSelectGroup");
function $i(t, e, n, i = {}) {
  const r = document.createElement("div");
  r.classList.add("form-group");
  const a = document.createElement("label");
  a.textContent = t;
  const o = document.createElement("input");
  o.type = "number", o.classList.add(e), o.value = String(n);
  for (const [s, l] of Object.entries(i)) o.setAttribute(s, l);
  return r.append(a, o), r;
}
c($i, "buildNumberGroup");
function Xl(t, e, n) {
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
c(Xl, "buildColorGroup");
let oe = null;
function Is() {
  for (const t of document.querySelectorAll(".idle-anim__slot--insert-before, .idle-anim__slot--insert-after"))
    t.classList.remove("idle-anim__slot--insert-before", "idle-anim__slot--insert-after");
}
c(Is, "clearInsertIndicators");
function Eu(t) {
  for (const e of document.querySelectorAll(".idle-anim__slots"))
    e.classList.toggle("idle-anim__slots--drag-active", t);
}
c(Eu, "setDragActive");
function lo(t, e) {
  t.dispatchEvent(new CustomEvent("slot-reorder", { detail: { card: e } }));
}
c(lo, "notifyReorder");
function sm(t, { dropGroup: e, handleSelector: n = ".idle-anim__slot-header" }) {
  t.setAttribute("draggable", "true");
  let i = !1;
  t.addEventListener("pointerdown", (r) => {
    i = !!r.target.closest(n);
  }), t.addEventListener("dragstart", (r) => {
    if (!i) {
      r.preventDefault();
      return;
    }
    oe = { card: t, sourceContainer: t.parentElement, group: e, insertMode: null, insertTarget: null }, t.classList.add("is-dragging"), Eu(!0), r.dataTransfer.effectAllowed = "move", r.dataTransfer.setData("text/plain", "");
  }), t.addEventListener("dragover", (r) => {
    if (!oe || oe.group !== e || oe.card === t) return;
    r.preventDefault(), r.dataTransfer.dropEffect = "move";
    const a = t.getBoundingClientRect(), o = a.top + a.height / 2, s = r.clientY < o ? "before" : "after";
    (oe.insertTarget !== t || oe.insertMode !== s) && (Is(), t.classList.add(s === "before" ? "idle-anim__slot--insert-before" : "idle-anim__slot--insert-after"), oe.insertTarget = t, oe.insertMode = s);
  }), t.addEventListener("dragleave", () => {
    t.classList.remove("idle-anim__slot--insert-before", "idle-anim__slot--insert-after"), (oe == null ? void 0 : oe.insertTarget) === t && (oe.insertTarget = null, oe.insertMode = null);
  }), t.addEventListener("drop", (r) => {
    if (r.preventDefault(), r.stopPropagation(), Is(), !oe || oe.group !== e || oe.card === t) return;
    const a = oe.card, o = oe.sourceContainer, s = t.parentElement;
    oe.insertMode === "after" ? s.insertBefore(a, t.nextSibling) : s.insertBefore(a, t), lo(s, a), o !== s && lo(o, a), oe = null;
  }), t.addEventListener("dragend", () => {
    t.classList.remove("is-dragging"), Is(), Eu(!1);
    for (const r of document.querySelectorAll(".idle-anim__slots--drag-over"))
      r.classList.remove("idle-anim__slots--drag-over");
    oe = null;
  });
}
c(sm, "makeDraggable");
function lm(t, { dropGroup: e, onDrop: n }) {
  t.addEventListener("dragover", (i) => {
    !oe || oe.group !== e || (i.preventDefault(), i.dataTransfer.dropEffect = "move");
  }), t.addEventListener("dragenter", (i) => {
    !oe || oe.group !== e || (i.preventDefault(), t.classList.add("idle-anim__slots--drag-over"));
  }), t.addEventListener("dragleave", (i) => {
    i.relatedTarget && t.contains(i.relatedTarget) || t.classList.remove("idle-anim__slots--drag-over");
  }), t.addEventListener("drop", (i) => {
    if (i.preventDefault(), t.classList.remove("idle-anim__slots--drag-over"), !oe || oe.group !== e) return;
    const r = oe.card, a = oe.sourceContainer;
    t.appendChild(r), lo(t, r), a !== t && lo(a, r), oe = null;
  }), t.addEventListener("slot-reorder", (i) => {
    n == null || n(i.detail.card, t);
  });
}
c(lm, "makeDropContainer");
const ma = "eidolon-utilities", Su = "tile-animations", _b = "tile-interactions", Fb = "idle-animation", Db = "eidolon-idle-animation", Pb = "fa-solid fa-wave-pulse", cm = [
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
], Rb = [
  { value: "tween-prop", label: "Numeric" },
  { value: "tween-tint", label: "Tint" },
  { value: "tween-scale", label: "Scale" }
], um = {
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
}, xi = {
  attribute: "alpha",
  from: 1,
  to: 0.5,
  period: 300,
  mode: "bounce"
}, Ri = {
  fromColor: "#ffffff",
  toColor: "#ffaa00",
  period: 500,
  mode: "bounce"
}, _a = {
  type: "tile-scale",
  fromScale: 1,
  toScale: 1.2,
  period: 300,
  easing: "easeOutCubic",
  mode: "bounce"
}, dm = [
  { value: "alpha", label: "Alpha (Opacity)" },
  { value: "rotation", label: "Rotation" },
  { value: "texture.rotation", label: "Texture Rotation" }
];
let vn = null;
function Hb(t) {
  var e;
  return (t == null ? void 0 : t.document) ?? ((e = t == null ? void 0 : t.object) == null ? void 0 : e.document) ?? (t == null ? void 0 : t.object) ?? null;
}
c(Hb, "getTileDocument");
function qb(t, e) {
  const n = document.createElement("div");
  n.classList.add("form-group");
  const i = document.createElement("label");
  i.textContent = "Type", n.appendChild(i);
  const r = document.createElement("select");
  r.classList.add(e);
  const a = document.createElement("optgroup");
  a.label = "Effects";
  for (const s of cm) {
    const l = document.createElement("option");
    l.value = s.value, l.textContent = s.label, s.value === t && (l.selected = !0), a.appendChild(l);
  }
  r.appendChild(a);
  const o = document.createElement("optgroup");
  o.label = "Tweens";
  for (const s of Rb) {
    const l = document.createElement("option");
    l.value = s.value, l.textContent = s.label, s.value === t && (l.selected = !0), o.appendChild(l);
  }
  return r.appendChild(o), n.appendChild(r), n;
}
c(qb, "buildEffectTypeSelect");
function Cu(t) {
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
  const n = cm.find((i) => i.value === e);
  return (n == null ? void 0 : n.label) ?? e;
}
c(Cu, "summarizeEffectConfig");
function Tu(t, e, n, i) {
  const r = t.name ?? "float", a = fc(), o = Ji(), s = document.createElement("div");
  s.classList.add("idle-anim__slot", "is-collapsed", n), s.dataset.index = String(e);
  const l = document.createElement("div");
  l.classList.add("idle-anim__slot-header");
  const u = document.createElement("i");
  u.classList.add("fa-solid", "fa-chevron-right", "idle-anim__slot-chevron");
  const d = document.createElement("span");
  d.classList.add("idle-anim__slot-title"), d.textContent = `${i} ${e + 1}`;
  const h = document.createElement("span");
  h.classList.add("idle-anim__slot-summary"), h.textContent = Cu(t);
  const f = document.createElement("button");
  f.type = "button", f.classList.add("idle-anim__slot-remove"), f.innerHTML = '<i class="fa-solid fa-xmark"></i>', f.title = "Remove effect", l.append(u, d, h, f), s.appendChild(l);
  const g = document.createElement("div");
  g.classList.add("idle-anim__slot-body");
  const p = qb(r, "ti-effect__type");
  g.appendChild(p);
  const y = document.createElement("div");
  y.classList.add("idle-anim__type-fields"), g.appendChild(y);
  function v(w, C) {
    y.innerHTML = "";
    const I = um[w];
    if (I)
      for (const A of I) {
        const O = C[A.key] ?? A.default;
        if (A.type === "color")
          y.appendChild(Xl(A.label, `ti-effect__${A.key}`, O));
        else if (A.type === "select") {
          let M;
          A.options === "interpolation" ? M = o.map((_) => ({ value: _, label: _, selected: _ === O })) : Array.isArray(A.options) ? M = A.options.map((_) => ({ value: _.value, label: _.label, selected: _.value === O })) : M = a.map((_) => ({ value: _, label: _, selected: _ === O })), y.appendChild(Ni(A.label, `ti-effect__${A.key}`, M));
        } else
          y.appendChild($i(A.label, `ti-effect__${A.key}`, O, A.attrs ?? {}));
      }
  }
  c(v, "renderParams"), v(r, t), s.appendChild(g);
  const b = s.querySelector(".ti-effect__type");
  return b == null || b.addEventListener("change", () => {
    v(b.value, {});
  }), l.addEventListener("click", (w) => {
    if (!w.target.closest(".idle-anim__slot-remove") && (s.classList.toggle("is-collapsed"), s.classList.contains("is-collapsed"))) {
      const C = fm(s);
      C && (h.textContent = Cu(C));
    }
  }), f.addEventListener("click", (w) => {
    w.stopPropagation();
    const C = s.parentElement;
    s.remove(), C && is(C, n, i);
  }), sm(s, { dropGroup: "effect" }), s;
}
c(Tu, "buildEffectSlot");
function fm(t) {
  var r;
  const e = ((r = t.querySelector(".ti-effect__type")) == null ? void 0 : r.value) ?? "float", n = um[e], i = { name: e };
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
c(fm, "readEffectSlot");
function Lu(t) {
  if (!t) return "";
  const e = t.type ?? "tile-prop", n = t.mode ?? "bounce", i = n.charAt(0).toUpperCase() + n.slice(1);
  if (e === "tile-tint")
    return `${i} Tint ${t.fromColor ?? "?"} → ${t.toColor ?? "?"} (${t.period ?? "?"}ms)`;
  if (e === "tile-scale") {
    const o = t.fromScale != null ? `${Math.round(t.fromScale * 100)}%` : "?", s = t.toScale != null ? `${Math.round(t.toScale * 100)}%` : "?";
    return `${i} Scale ${o} → ${s} (${t.period ?? "?"}ms)`;
  }
  const r = dm.find((o) => o.value === t.attribute), a = (r == null ? void 0 : r.label) ?? t.attribute ?? "?";
  return `${i} ${a} ${t.from ?? "?"} → ${t.to ?? "?"} (${t.period ?? "?"}ms)`;
}
c(Lu, "summarizeClickConfig");
function Iu(t, e) {
  const n = t.type ?? "tile-prop", i = t.mode ?? "bounce", r = fc(), a = document.createElement("div");
  a.classList.add("idle-anim__slot", "is-collapsed", "ti-click-slot"), a.dataset.index = String(e);
  const o = document.createElement("div");
  o.classList.add("idle-anim__slot-header");
  const s = document.createElement("i");
  s.classList.add("fa-solid", "fa-chevron-right", "idle-anim__slot-chevron");
  const l = document.createElement("span");
  l.classList.add("idle-anim__slot-title"), l.textContent = `Animation ${e + 1}`;
  const u = document.createElement("span");
  u.classList.add("idle-anim__slot-summary"), u.textContent = Lu(t);
  const d = document.createElement("button");
  d.type = "button", d.classList.add("idle-anim__slot-remove"), d.innerHTML = '<i class="fa-solid fa-xmark"></i>', d.title = "Remove animation", o.append(s, l, u, d), a.appendChild(o);
  const h = document.createElement("div");
  h.classList.add("idle-anim__slot-body");
  const f = document.createElement("div");
  f.classList.add("idle-anim__range-row"), f.appendChild(Ni("Mode", "ti-click__mode", [
    { value: "bounce", label: "Bounce", selected: i === "bounce" },
    { value: "toggle", label: "Toggle", selected: i === "toggle" }
  ])), f.appendChild(Ni("Type", "ti-click__type", [
    { value: "tile-prop", label: "Numeric", selected: n === "tile-prop" },
    { value: "tile-tint", label: "Tint", selected: n === "tile-tint" },
    { value: "tile-scale", label: "Scale", selected: n === "tile-scale" }
  ])), h.appendChild(f);
  const g = document.createElement("div");
  g.classList.add("idle-anim__type-fields"), h.appendChild(g);
  function p(w, C) {
    if (g.innerHTML = "", w === "tile-tint") {
      const I = Ji(), A = C.fromColor ?? Ri.fromColor, O = C.toColor ?? Ri.toColor, M = C.mode ?? "oklch", _ = document.createElement("div");
      _.classList.add("idle-anim__range-row"), _.appendChild(Xl("From", "ti-click__from-color", A)), _.appendChild(Xl("To", "ti-click__to-color", O)), g.appendChild(_), g.appendChild(Ni(
        "Interpolation",
        "ti-click__color-mode",
        I.map((j) => ({ value: j, label: j, selected: j === M }))
      ));
    } else if (w === "tile-scale") {
      const I = C.fromScale ?? _a.fromScale, A = C.toScale ?? _a.toScale, O = document.createElement("div");
      O.classList.add("idle-anim__range-row"), O.appendChild($i("From", "ti-click__from-scale", I, { step: "0.01", min: "0.01" })), O.appendChild($i("To", "ti-click__to-scale", A, { step: "0.01", min: "0.01" })), g.appendChild(O);
      const M = document.createElement("p");
      M.classList.add("idle-anim__hint"), M.textContent = "1.0 = original size. Scales from center.", g.appendChild(M);
    } else {
      const I = C.attribute ?? xi.attribute, A = C.from ?? xi.from, O = C.to ?? xi.to;
      g.appendChild(Ni(
        "Attribute",
        "ti-click__attribute",
        dm.map((_) => ({ value: _.value, label: _.label, selected: _.value === I }))
      ));
      const M = document.createElement("div");
      M.classList.add("idle-anim__range-row"), M.appendChild($i("From", "ti-click__from", A, { step: "0.01" })), M.appendChild($i("To", "ti-click__to", O, { step: "0.01" })), g.appendChild(M);
    }
  }
  c(p, "renderTypeFields"), p(n, t);
  const y = t.period ?? (n === "tile-tint" ? Ri.period : xi.period), v = t.easing ?? "easeOutCubic";
  h.appendChild($i("Period (ms)", "ti-click__period", y, { min: "50", step: "50" })), h.appendChild(Ni(
    "Easing",
    "ti-click__easing",
    r.map((w) => ({ value: w, label: w, selected: w === v }))
  )), a.appendChild(h);
  const b = a.querySelector(".ti-click__type");
  return b == null || b.addEventListener("change", () => {
    const w = b.value;
    p(w, w === "tile-tint" ? Ri : w === "tile-scale" ? _a : xi);
  }), o.addEventListener("click", (w) => {
    if (!w.target.closest(".idle-anim__slot-remove") && (a.classList.toggle("is-collapsed"), a.classList.contains("is-collapsed"))) {
      const C = mm(a);
      C && (u.textContent = Lu(C));
    }
  }), d.addEventListener("click", (w) => {
    w.stopPropagation();
    const C = a.parentElement;
    a.remove(), C && is(C, "ti-click-slot", "Animation");
  }), sm(a, { dropGroup: "click" }), a;
}
c(Iu, "buildClickSlot");
function mm(t) {
  var u, d, h, f, g, p, y, v, b, w, C, I, A, O;
  const e = ((u = t.querySelector(".ti-click__type")) == null ? void 0 : u.value) ?? "tile-prop", n = ((d = t.querySelector(".ti-click__mode")) == null ? void 0 : d.value) ?? "bounce", i = Number.parseInt((h = t.querySelector(".ti-click__period")) == null ? void 0 : h.value, 10), r = ((f = t.querySelector(".ti-click__easing")) == null ? void 0 : f.value) ?? "easeOutCubic";
  if (!i || i <= 0) return null;
  const a = { mode: n, period: i, easing: r };
  if (e === "tile-tint") {
    const M = ((g = t.querySelector(".ti-click__from-color")) == null ? void 0 : g.value) ?? ((p = t.querySelector(".ti-click__from-color-text")) == null ? void 0 : p.value) ?? Ri.fromColor, _ = ((y = t.querySelector(".ti-click__to-color")) == null ? void 0 : y.value) ?? ((v = t.querySelector(".ti-click__to-color-text")) == null ? void 0 : v.value) ?? Ri.toColor, j = ((b = t.querySelector(".ti-click__color-mode")) == null ? void 0 : b.value) ?? "oklch";
    return { type: "tile-tint", fromColor: M, toColor: _, mode: j, ...a };
  }
  if (e === "tile-scale") {
    const M = Number.parseFloat((w = t.querySelector(".ti-click__from-scale")) == null ? void 0 : w.value), _ = Number.parseFloat((C = t.querySelector(".ti-click__to-scale")) == null ? void 0 : C.value);
    return Number.isNaN(M) || Number.isNaN(_) || M <= 0 || _ <= 0 ? null : { type: "tile-scale", fromScale: M, toScale: _, ...a };
  }
  const o = ((I = t.querySelector(".ti-click__attribute")) == null ? void 0 : I.value) ?? xi.attribute, s = Number.parseFloat((A = t.querySelector(".ti-click__from")) == null ? void 0 : A.value), l = Number.parseFloat((O = t.querySelector(".ti-click__to")) == null ? void 0 : O.value);
  return Number.isNaN(s) || Number.isNaN(l) ? null : { type: "tile-prop", attribute: o, from: s, to: l, ...a };
}
c(mm, "readClickSlot");
function is(t, e, n) {
  t.querySelectorAll(`.${e}`).forEach((r, a) => {
    r.dataset.index = String(a);
    const o = r.querySelector(".idle-anim__slot-title");
    o && (o.textContent = `${n} ${a + 1}`);
  });
}
c(is, "renumberSlots");
function Os(t, { heading: e, hint: n, configs: i, slotClass: r, titlePrefix: a, dropGroup: o, defaultEffect: s, addLabel: l }) {
  const u = document.createElement("h3");
  u.classList.add("ti-section-heading"), u.textContent = e, t.appendChild(u);
  const d = document.createElement("p");
  d.classList.add("idle-anim__hint"), d.textContent = n, t.appendChild(d);
  const h = document.createElement("div");
  h.classList.add("idle-anim__slots", `${r}s`);
  for (let p = 0; p < i.length; p++)
    h.appendChild(Tu(i[p], p, r, a));
  t.appendChild(h);
  const f = ["ti-always-slot", "ti-idle-slot", "ti-hover-slot"];
  lm(h, {
    dropGroup: o,
    onDrop(p) {
      if (p.parentElement === h)
        for (const y of f)
          y !== r && p.classList.contains(y) && p.classList.replace(y, r);
      is(h, r, a);
    }
  });
  const g = document.createElement("button");
  return g.type = "button", g.classList.add("idle-anim__add"), g.innerHTML = `<i class="fa-solid fa-plus"></i> ${l}`, g.addEventListener("click", () => {
    const p = h.querySelectorAll(`.${r}`).length, y = Tu(s, p, r, a);
    y.classList.remove("is-collapsed"), h.appendChild(y);
  }), t.appendChild(g), h;
}
c(Os, "buildEffectCategory");
function jb(t) {
  const e = vc(t) ?? { always: [], idle: [], hover: [], click: [] }, n = document.createElement("section");
  n.classList.add("eidolon-tile-interactions"), Os(n, {
    heading: "Always",
    hint: "Runs continuously, ignores pointer state.",
    configs: e.always ?? [],
    slotClass: "ti-always-slot",
    titlePrefix: "Effect",
    dropGroup: "effect",
    defaultEffect: { name: "embers" },
    addLabel: "Add Effect"
  }), Os(n, {
    heading: "Idle",
    hint: "Plays by default. Stops when pointer enters the tile.",
    configs: e.idle ?? [],
    slotClass: "ti-idle-slot",
    titlePrefix: "Effect",
    dropGroup: "effect",
    defaultEffect: { name: "float" },
    addLabel: "Add Idle Effect"
  }), Os(n, {
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
  for (let d = 0; d < a.length; d++)
    o.appendChild(Iu(a[d], d));
  n.appendChild(o), lm(o, {
    dropGroup: "click",
    onDrop() {
      is(o, "ti-click-slot", "Animation");
    }
  });
  const s = document.createElement("button");
  s.type = "button", s.classList.add("idle-anim__add"), s.innerHTML = '<i class="fa-solid fa-plus"></i> Add Animation', s.addEventListener("click", () => {
    const d = o.querySelectorAll(".ti-click-slot").length, h = Iu(_a, d);
    h.classList.remove("is-collapsed"), o.appendChild(h);
  }), n.appendChild(s);
  const l = document.createElement("div");
  l.classList.add("idle-anim__actions");
  const u = document.createElement("button");
  return u.type = "button", u.classList.add("idle-anim__preview"), u.innerHTML = '<i class="fa-solid fa-play"></i> Preview', l.append(u), n.appendChild(l), n;
}
c(jb, "buildSectionContent");
function As(t, e) {
  const n = [];
  for (const i of t.querySelectorAll(`.${e}`)) {
    const r = fm(i);
    r && n.push(r);
  }
  return n;
}
c(As, "readAllEffectSlots");
function Bb(t) {
  const e = [];
  for (const n of t.querySelectorAll(".ti-click-slot")) {
    const i = mm(n);
    i && e.push(i);
  }
  return e;
}
c(Bb, "readAllClickConfigs");
function Ou(t) {
  return {
    always: As(t, "ti-always-slot"),
    idle: As(t, "ti-idle-slot"),
    hover: As(t, "ti-hover-slot"),
    click: Bb(t)
  };
}
c(Ou, "readFormConfig");
function Ub(t, e) {
  var l;
  const n = Kt(e);
  if (!n) return;
  const i = Hb(t);
  if (!i) return;
  const r = Wd(t, n, Db, "Animations", Pb);
  if (!r || r.querySelector(".eidolon-tile-interactions")) return;
  const a = r.closest("form");
  a && (a.noValidate = !0);
  const o = jb(i);
  r.appendChild(o), (l = t.setPosition) == null || l.call(t, { height: "auto" });
  const s = r.querySelector(".idle-anim__preview");
  s == null || s.addEventListener("click", () => {
    const u = i.object;
    if (!u) return;
    if (vn) {
      vn.detach(), vn = null, s.classList.remove("is-active"), s.innerHTML = '<i class="fa-solid fa-play"></i> Preview';
      return;
    }
    const d = Ou(o);
    (d.always.length > 0 || d.idle.length > 0 || d.hover.length > 0) && (vn = new Ci(u, d), vn.start("idle"), s.classList.add("is-active"), s.innerHTML = '<i class="fa-solid fa-stop"></i> Stop');
  }), a && a.addEventListener("submit", () => {
    vn && (vn.detach(), vn = null);
    const u = Ou(o), d = u.always.length > 0 || u.idle.length > 0 || u.hover.length > 0 || u.click.length > 0, h = {
      [`flags.${ma}.-=${Su}`]: null,
      [`flags.${ma}.-=${_b}`]: null,
      [`flags.${ma}.-=${Fb}`]: null
    };
    i.update(h).then(() => {
      if (d)
        return i.update({ [`flags.${ma}.${Su}`]: u });
    });
  });
}
c(Ub, "renderAnimationSection");
const co = /* @__PURE__ */ new Map();
function hm(t) {
  const e = co.get(t);
  e && (e.controller.abort(), co.delete(t), e.restore());
}
c(hm, "stopLoopByKey");
function gm(t) {
  const e = `${t}::`;
  for (const n of [...co.keys()])
    n.startsWith(e) && hm(n);
}
c(gm, "stopLoopsForTile");
function pm() {
  for (const t of [...co.keys()])
    hm(t);
}
c(pm, "stopAllLoops");
const Vb = "eidolon-utilities", Gb = ["tile-animations", "tile-interactions", "idle-animation"];
function zb() {
  pm(), am();
}
c(zb, "onCanvasTearDown");
function Wb() {
  pm(), am();
}
c(Wb, "onCanvasReady");
function Yb(t, e) {
  var r;
  const n = (r = e == null ? void 0 : e.flags) == null ? void 0 : r[Vb];
  !n || !Gb.some((a) => a in n || `-=${a}` in n) || (gm(t.id), $b(t));
}
c(Yb, "onUpdateTile");
function Kb(t) {
  gm(t.id), om(t);
}
c(Kb, "onDeleteTile");
function Jb(t, e) {
  Ub(t, e);
}
c(Jb, "onRenderTileConfig");
function Xb() {
  Hooks.on("canvasTearDown", zb), Hooks.on("canvasReady", Wb), Hooks.on("updateTile", Yb), Hooks.on("deleteTile", Kb), Hooks.on("renderTileConfig", Jb);
}
c(Xb, "registerTileInteractionHooks");
Xb();
//# sourceMappingURL=eidolon-utilities.js.map
