var kc = Object.defineProperty;
var bm = Object.getPrototypeOf;
var vm = Reflect.get;
var Mc = (t) => {
  throw TypeError(t);
};
var wm = (t, e, n) => e in t ? kc(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var c = (t, e) => kc(t, "name", { value: e, configurable: !0 });
var ye = (t, e, n) => wm(t, typeof e != "symbol" ? e + "" : e, n), Qo = (t, e, n) => e.has(t) || Mc("Cannot " + n);
var m = (t, e, n) => (Qo(t, e, "read from private field"), n ? n.call(t) : e.get(t)), k = (t, e, n) => e.has(t) ? Mc("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, n), I = (t, e, n, i) => (Qo(t, e, "write to private field"), i ? i.call(t, n) : e.set(t, n), n), C = (t, e, n) => (Qo(t, e, "access private method"), n);
var Zo = (t, e, n, i) => ({
  set _(r) {
    I(t, e, r, n);
  },
  get _() {
    return m(t, e, i);
  }
}), Fe = (t, e, n) => vm(bm(t), n, e);
const T = "eidolon-utilities", Ma = "timeTriggerActive", Ss = "timeTriggerHideWindow", Cs = "timeTriggerShowPlayerWindow", Ts = "timeTriggerAllowRealTime", ju = "timeTriggers", fa = "timeTriggerHistory", Ls = "debug", Is = "timeFormat", Os = "manageTime", As = "secondsPerRound";
const Em = [-30, -15, -5, 5, 15, 30], $i = 1440 * 60, ma = "playSound", Gr = 6;
function S(t, e) {
  var n, i;
  return (i = (n = game.i18n) == null ? void 0 : n.has) != null && i.call(n, t) ? game.i18n.localize(t) : e;
}
c(S, "localize");
function Ot(t) {
  return typeof t != "string" ? "" : t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
c(Ot, "escapeHtml");
function Ut(t) {
  var e;
  return t == null ? t : (e = foundry == null ? void 0 : foundry.utils) != null && e.duplicate ? foundry.utils.duplicate(t) : JSON.parse(JSON.stringify(t));
}
c(Ut, "duplicateData");
function Sm() {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
c(Sm, "generateTriggerId");
function Bu(t) {
  if (typeof t != "string") return null;
  const e = t.trim();
  if (!e) return null;
  const n = e.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (!n) return null;
  const i = Number(n[1]), r = Number(n[2]), a = n[3] !== void 0 ? Number(n[3]) : 0;
  return !Number.isInteger(i) || !Number.isInteger(r) || !Number.isInteger(a) || i < 0 || i > 23 || r < 0 || r > 59 || a < 0 || a > 59 ? null : i * 3600 + r * 60 + a;
}
c(Bu, "parseTriggerTimeToSeconds");
function rr() {
  var t, e;
  return ((t = game.scenes) == null ? void 0 : t.current) ?? ((e = game.scenes) == null ? void 0 : e.active) ?? null;
}
c(rr, "getActiveScene");
function Vt(t) {
  return (t == null ? void 0 : t.object) ?? (t == null ? void 0 : t.document) ?? null;
}
c(Vt, "getSceneFromApplication");
function Ge(t) {
  return t && typeof t.getFlag == "function" && typeof t.setFlag == "function";
}
c(Ge, "hasSceneDocument");
const ks = /* @__PURE__ */ new Set(), Ms = /* @__PURE__ */ new Set(), Ns = /* @__PURE__ */ new Set(), _s = /* @__PURE__ */ new Set();
let hi = !1, vr = !1, Na = Gr, _a = "12h", Nc = !1;
function es(t) {
  hi = !!t;
  for (const e of ks)
    try {
      e(hi);
    } catch (n) {
      console.error(`${T} | Debug change handler failed`, n);
    }
}
c(es, "notifyDebugChange");
function ts(t) {
  vr = !!t;
  for (const e of Ms)
    try {
      e(vr);
    } catch (n) {
      console.error(`${T} | Manage time change handler failed`, n);
    }
}
c(ts, "notifyManageTimeChange");
function Uu(t) {
  return t === "24h" ? "24h" : "12h";
}
c(Uu, "normalizeTimeFormatValue");
function Jl(t) {
  const e = Number(t);
  return !Number.isFinite(e) || e <= 0 ? Gr : e;
}
c(Jl, "normalizeSecondsPerRoundValue");
function ns(t) {
  const e = Jl(t);
  Na = e;
  for (const n of Ns)
    try {
      n(e);
    } catch (i) {
      console.error(`${T} | Seconds-per-round change handler failed`, i);
    }
}
c(ns, "notifySecondsPerRoundChange");
function is(t) {
  const e = Uu(t);
  _a = e;
  for (const n of _s)
    try {
      n(e);
    } catch (i) {
      console.error(`${T} | Time format change handler failed`, i);
    }
}
c(is, "notifyTimeFormatChange");
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
  game.settings.register(T, Ls, {
    name: S("EIDOLON.TimeTrigger.DebugSettingName", "Enable debug logging"),
    hint: S(
      "EIDOLON.TimeTrigger.DebugSettingHint",
      "Write detailed time-trigger diagnostics to the browser console."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: t ? void 0 : es
  }), t && game.settings.registerChange(T, Ls, es), hi = Yl(), es(hi), game.settings.register(T, Os, {
    name: S("EIDOLON.TimeTrigger.ManageTimeSettingName", "Manage Game Time"),
    hint: S(
      "EIDOLON.TimeTrigger.ManageTimeSettingHint",
      "Allow Eidolon Utilities to advance world time automatically while the game is unpaused. Warning: This may conflict with other time-management modules."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: t ? void 0 : ts
  }), t && game.settings.registerChange(T, Os, ts), vr = Lm(), ts(vr), game.settings.register(T, As, {
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
    default: Gr,
    range: { min: 1, max: 3600, step: 1 },
    onChange: t ? void 0 : ns
  }), t && game.settings.registerChange(
    T,
    As,
    ns
  ), Na = Jl(Im()), ns(Na), game.settings.register(T, Is, {
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
    onChange: t ? void 0 : is
  }), t && game.settings.registerChange(T, Is, is), _a = Uu(Vu()), is(_a);
}
c(Cm, "registerTimeTriggerSettings");
function Yl() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return !!game.settings.get(T, Ls);
  } catch (e) {
    console.error(`${T} | Failed to read debug setting`, e);
  }
  return !1;
}
c(Yl, "getDebugSetting");
function Tm() {
  return hi = Yl(), hi;
}
c(Tm, "refreshDebugSettingCache");
function Lm() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return !!game.settings.get(T, Os);
  } catch (e) {
    console.error(`${T} | Failed to read manage time setting`, e);
  }
  return !1;
}
c(Lm, "getManageTimeSetting");
function Vu() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return game.settings.get(T, Is) === "24h" ? "24h" : "12h";
  } catch (e) {
    console.error(`${T} | Failed to read time format setting`, e);
  }
  return "12h";
}
c(Vu, "getTimeFormatSetting");
function Im() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get) {
      const e = game.settings.get(T, As);
      return Jl(e);
    }
  } catch (e) {
    console.error(`${T} | Failed to read seconds-per-round setting`, e);
  }
  return Gr;
}
c(Im, "getSecondsPerRoundSetting");
function Om(t) {
  if (typeof t != "function")
    return () => {
    };
  ks.add(t);
  try {
    t(hi);
  } catch (e) {
    console.error(`${T} | Debug change handler failed`, e);
  }
  return () => {
    ks.delete(t);
  };
}
c(Om, "onDebugSettingChange");
function Gu(t) {
  if (typeof t != "function")
    return () => {
    };
  Ms.add(t);
  try {
    t(vr);
  } catch (e) {
    console.error(`${T} | Manage time change handler failed`, e);
  }
  return () => {
    Ms.delete(t);
  };
}
c(Gu, "onManageTimeSettingChange");
function Xl(t) {
  if (typeof t != "function")
    return () => {
    };
  _s.add(t);
  try {
    t(_a);
  } catch (e) {
    console.error(`${T} | Time format change handler failed`, e);
  }
  return () => {
    _s.delete(t);
  };
}
c(Xl, "onTimeFormatSettingChange");
function Am(t) {
  if (typeof t != "function")
    return () => {
    };
  Ns.add(t);
  try {
    t(Na);
  } catch (e) {
    console.error(`${T} | Seconds-per-round change handler failed`, e);
  }
  return () => {
    Ns.delete(t);
  };
}
c(Am, "onSecondsPerRoundSettingChange");
let $o = !1, $s = !1;
function xs(t) {
  $o = !!t;
}
c(xs, "updateDebugState");
function zu() {
  $s || ($s = !0, xs(Yl()), Om((t) => {
    xs(t), console.info(`${T} | Debug ${$o ? "enabled" : "disabled"}`);
  }));
}
c(zu, "ensureInitialized");
function Ql() {
  return $s || zu(), $o;
}
c(Ql, "shouldLog");
function Wu(t) {
  if (!t.length)
    return [`${T} |`];
  const [e, ...n] = t;
  return typeof e == "string" ? [`${T} | ${e}`, ...n] : [`${T} |`, e, ...n];
}
c(Wu, "formatArgs");
function km() {
  zu();
}
c(km, "initializeDebug");
function Mm() {
  return xs(Tm()), $o;
}
c(Mm, "syncDebugState");
function N(...t) {
  Ql() && console.debug(...Wu(t));
}
c(N, "debugLog");
function Vi(...t) {
  Ql() && console.group(...Wu(t));
}
c(Vi, "debugGroup");
function kn() {
  Ql() && console.groupEnd();
}
c(kn, "debugGroupEnd");
function xi(t) {
  var r;
  const e = (r = t == null ? void 0 : t.getFlag) == null ? void 0 : r.call(t, T, ju);
  if (!e) return [];
  const n = Ut(e), i = Array.isArray(n) ? n : [];
  return N("Loaded time triggers", {
    sceneId: (t == null ? void 0 : t.id) ?? null,
    count: i.length
  }), i;
}
c(xi, "getTimeTriggers");
async function Ku(t, e) {
  t != null && t.setFlag && (N("Persisting time triggers", {
    sceneId: t.id,
    count: Array.isArray(e) ? e.length : 0
  }), await t.setFlag(T, ju, e));
}
c(Ku, "setTimeTriggers");
function Nm(t) {
  var r;
  const e = (r = t == null ? void 0 : t.getFlag) == null ? void 0 : r.call(t, T, fa);
  if (!e) return {};
  const n = Ut(e);
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
async function rs(t, e) {
  var l, u, d, f;
  if (!t) return;
  const n = {};
  if (e && typeof e == "object")
    for (const [h, g] of Object.entries(e))
      typeof g == "number" && Number.isFinite(g) && (n[h] = g);
  const i = ((l = t.getFlag) == null ? void 0 : l.call(t, T, fa)) ?? {}, r = {};
  if (i && typeof i == "object")
    for (const [h, g] of Object.entries(i))
      typeof g == "number" && Number.isFinite(g) && (r[h] = g);
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
    removedKeys: o.filter((h) => !a.includes(h))
  });
  try {
    o.length && typeof t.unsetFlag == "function" && await t.unsetFlag(T, fa), a.length && await t.setFlag(T, fa, n);
  } catch (h) {
    console.error(`${T} | Failed to persist time trigger history`, h), (f = (d = ui.notifications) == null ? void 0 : d.error) == null || f.call(
      d,
      S(
        "EIDOLON.TimeTrigger.HistoryPersistError",
        "Failed to persist the scene's time trigger history."
      )
    );
  }
}
c(rs, "updateTimeTriggerHistory");
const $a = /* @__PURE__ */ new Map(), _c = /* @__PURE__ */ new Set();
function _m(t) {
  if (!(t != null && t.id))
    throw new Error(`${T} | Action definitions require an id.`);
  if ($a.has(t.id))
    throw new Error(`${T} | Duplicate time trigger action id: ${t.id}`);
  $a.set(t.id, {
    ...t
  }), N("Registered time trigger action", { actionId: t.id });
}
c(_m, "registerAction");
function zr(t) {
  return $a.get(t) ?? null;
}
c(zr, "getAction");
function $m(t) {
  const e = zr(t);
  return e ? typeof e.label == "function" ? e.label() : e.label : t;
}
c($m, "getActionLabel");
function $c() {
  return Array.from($a.values());
}
c($c, "listActions");
async function Ju(t, e) {
  var i, r;
  const n = zr(e == null ? void 0 : e.action);
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
c(Ju, "executeTriggerAction");
function xm(t) {
  const e = zr(t == null ? void 0 : t.action);
  return !e || typeof e.buildSummaryParts != "function" ? [] : e.buildSummaryParts({ trigger: t, escapeHtml: Ot, localize: S }) ?? [];
}
c(xm, "buildActionSummaryParts");
function Fm(t) {
  const e = zr(t == null ? void 0 : t.action);
  return !e || typeof e.buildFormContent != "function" ? "" : e.buildFormContent({ trigger: t, escapeHtml: Ot, localize: S }) ?? "";
}
c(Fm, "buildActionFormSection");
function Dm(t, e) {
  const n = zr(t == null ? void 0 : t.action);
  !n || typeof n.prepareFormData != "function" || n.prepareFormData({ trigger: t, formData: e });
}
c(Dm, "applyActionFormData");
function Pm(t, e, n) {
  var a, o;
  const i = `${(t == null ? void 0 : t.id) ?? "unknown"}:${(e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.action) ?? "unknown"}:${n}`;
  if (_c.has(i)) return;
  _c.add(i);
  const r = S(
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
    var d, f, h, g, p;
    return typeof ((f = (d = foundry == null ? void 0 : foundry.audio) == null ? void 0 : d.AudioHelper) == null ? void 0 : f.play) == "function" ? foundry.audio.AudioHelper.play(i, !0) : typeof ((g = (h = game == null ? void 0 : game.audio) == null ? void 0 : h.constructor) == null ? void 0 : g.play) == "function" ? game.audio.constructor.play(i, !0) : typeof ((p = game == null ? void 0 : game.audio) == null ? void 0 : p.play) == "function" ? game.audio.play(i, !0) : null;
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
c(Rm, "executePlaySoundAction");
_m({
  id: ma,
  label: /* @__PURE__ */ c(() => S("EIDOLON.TimeTrigger.ActionPlaySound", "Play Sound"), "label"),
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
var xu;
const { ApplicationV2: Hn, HandlebarsApplicationMixin: qn } = ((xu = foundry.applications) == null ? void 0 : xu.api) ?? {};
if (!Hn || !qn)
  throw new Error(
    `${T} | ApplicationV2 API unavailable. Update Foundry VTT to v13 or newer.`
  );
const $n = "AM", gi = "PM";
function Mn() {
  return Vu();
}
c(Mn, "getConfiguredTimeFormat");
function xo(t) {
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
c(xo, "parseCanonicalTimeString");
function qt({ hours: t, minutes: e, seconds: n }) {
  if (!Number.isInteger(t) || !Number.isInteger(e) || t < 0 || t > 23 || e < 0 || e > 59) return null;
  const i = String(t).padStart(2, "0"), r = String(e).padStart(2, "0");
  if (Number.isInteger(n)) {
    if (n < 0 || n > 59) return null;
    const a = String(n).padStart(2, "0");
    return `${i}:${r}:${a}`;
  }
  return `${i}:${r}`;
}
c(qt, "formatCanonicalTime");
function Hm(t, { format: e } = {}) {
  if (!t || typeof t != "object") return null;
  const n = Number(t.hour), i = Number(t.minute), r = t.second !== void 0 && t.second !== null, a = r ? Number(t.second) : null, o = r && Number.isFinite(a) ? Math.floor(Math.max(0, Math.min(59, a))) : null;
  if (!Number.isFinite(n) || !Number.isFinite(i)) return null;
  const s = e ?? Mn();
  return xa(
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
  const n = xo(t);
  if (!n) return "";
  const i = e ?? Mn();
  return xa(n, i);
}
c(qm, "formatTriggerTimeForDisplay");
function xa(t, e = "12h") {
  if (!t) return "";
  const { hours: n, minutes: i, seconds: r = null } = t;
  if (!Number.isInteger(n) || !Number.isInteger(i)) return "";
  const a = Number.isInteger(r);
  if (e === "24h") {
    const h = `${String(n).padStart(2, "0")}:${String(i).padStart(2, "0")}`;
    return a ? `${h}:${String(r).padStart(2, "0")}` : h;
  }
  const o = n >= 12 ? gi : $n, s = n % 12 === 0 ? 12 : n % 12, l = String(s), u = String(i).padStart(2, "0"), d = `${l}:${u}`, f = o === $n ? S("EIDOLON.TimeTrigger.TimePeriodAM", $n) : S("EIDOLON.TimeTrigger.TimePeriodPM", gi);
  if (a) {
    const h = String(r).padStart(2, "0");
    return `${d}:${h} ${f}`;
  }
  return `${d} ${f}`;
}
c(xa, "formatTimeParts");
function xc(t, e = Mn()) {
  const n = xo(t);
  if (e === "24h")
    return {
      format: e,
      canonical: n ? qt(n) ?? "" : "",
      hour: n ? String(n.hours).padStart(2, "0") : "",
      minute: n ? String(n.minutes).padStart(2, "0") : ""
    };
  if (!n)
    return {
      format: e,
      canonical: "",
      hour: "",
      minute: "",
      period: $n
    };
  const i = n.hours >= 12 ? gi : $n, r = n.hours % 12 === 0 ? 12 : n.hours % 12;
  return {
    format: e,
    canonical: qt(n) ?? "",
    hour: String(r),
    minute: String(n.minutes).padStart(2, "0"),
    period: i
  };
}
c(xc, "getTimeFormValues");
function jm({ hour: t, minute: e, period: n, time: i }, r = Mn()) {
  if (r === "24h") {
    const g = typeof t == "string" ? t.trim() : "", p = typeof e == "string" ? e.trim() : "", y = typeof i == "string" ? i.trim() : "";
    if (!g && !p && y) {
      const E = xo(y);
      return E ? { canonical: qt(E) ?? "", error: null } : {
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
    } : { canonical: qt({
      hours: w,
      minutes: v
    }) ?? "", error: null };
  }
  const a = typeof t == "string" ? t.trim() : "", o = typeof e == "string" ? e.trim() : "", s = typeof n == "string" ? n.trim().toUpperCase() : "";
  if (!a || !o || !s)
    return { canonical: "", error: S("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.") };
  if (s !== $n && s !== gi)
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
  const d = l % 12, h = {
    hours: s === gi ? d + 12 : d,
    minutes: u
  };
  return {
    canonical: qt(h) ?? "",
    error: null
  };
}
c(jm, "normalizeFormTimeInput");
function Bm() {
  return [
    {
      value: $n,
      label: S("EIDOLON.TimeTrigger.TimePeriodAM", $n)
    },
    {
      value: gi,
      label: S("EIDOLON.TimeTrigger.TimePeriodPM", gi)
    }
  ];
}
c(Bm, "getPeriodOptions");
var Qn, Zn, re, Yu, io, ro, Xu, Ds, Ps, ao, oo, Qu, Zu, ed, Rs, Hs, qs, so, lo, js, co, td, nd;
const Yn = class Yn extends qn(Hn) {
  constructor(n = {}) {
    var o;
    const { scene: i, showControls: r, ...a } = n ?? {};
    super(a);
    k(this, re);
    k(this, Qn, null);
    k(this, Zn, null);
    k(this, io, /* @__PURE__ */ c((n) => {
      var r, a;
      n.preventDefault();
      const i = Number((a = (r = n.currentTarget) == null ? void 0 : r.dataset) == null ? void 0 : a.delta);
      Number.isFinite(i) && (N("Time delta button clicked", { delta: i }), this._advanceTime(i));
    }, "#onDeltaClick"));
    k(this, ro, /* @__PURE__ */ c((n) => {
      var i, r;
      n.preventDefault(), !(!this.showControls || !((i = game.user) != null && i.isGM)) && (N("Time value double clicked", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null }), C(this, re, Xu).call(this));
    }, "#onTimeDoubleClick"));
    k(this, ao, /* @__PURE__ */ c((n) => {
      if (this.isEditingTime && !this._commitTimeInProgress)
        if (n.key === "Enter") {
          n.preventDefault();
          const i = n.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
          C(this, re, Ps).call(this, r);
        } else n.key === "Escape" && (n.preventDefault(), C(this, re, Ds).call(this));
    }, "#onTimeInputKeydown"));
    k(this, oo, /* @__PURE__ */ c((n) => {
      if (!this.isEditingTime || this._commitTimeInProgress || this._suppressBlurCommit) return;
      const i = n.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
      C(this, re, Ps).call(this, r);
    }, "#onTimeInputBlur"));
    k(this, so, /* @__PURE__ */ c((n) => {
      const i = !!n;
      if (this.manageTimeEnabled === i) return;
      this.manageTimeEnabled = i, (this.rendered ?? this.isRendered ?? !1) && this.render({ force: !0 });
    }, "#handleManageTimeChange"));
    k(this, lo, /* @__PURE__ */ c(async (n) => {
      var a, o, s, l, u, d, f, h, g;
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
        await i.setFlag(T, Ts, r), this.sceneAllowsRealTime = r;
        const p = r ? S(
          "EIDOLON.TimeTrigger.SceneRealTimeEnabled",
          "Automatic real-time flow enabled for this scene."
        ) : S(
          "EIDOLON.TimeTrigger.SceneRealTimeDisabled",
          "Automatic real-time flow disabled for this scene."
        );
        (f = (d = ui.notifications) == null ? void 0 : d.info) == null || f.call(d, p);
      } catch (p) {
        console.error(`${T} | Failed to toggle scene real-time flow`, p), (g = (h = ui.notifications) == null ? void 0 : h.error) == null || g.call(
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
    k(this, co, /* @__PURE__ */ c(() => {
      (this.rendered ?? this.isRendered ?? !1) && (this.isEditingTime && (this.editValue = C(this, re, Rs).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    this.scene = i ?? null, this.showControls = typeof r == "boolean" ? r : !!((o = game.user) != null && o.isGM), this.isEditingTime = !1, this.editValue = "", this._commitTimeInProgress = !1, this._suppressBlurCommit = !1, this.manageTimeEnabled = !1, this.sceneAllowsRealTime = C(this, re, js).call(this), I(this, Qn, Xl(m(this, co))), I(this, Zn, Gu(m(this, so)));
  }
  async _prepareContext() {
    var v, b;
    const n = ((v = game.time) == null ? void 0 : v.components) ?? {}, r = ((n == null ? void 0 : n.second) !== void 0 && (n == null ? void 0 : n.second) !== null ? Hm(n) : null) ?? C(this, re, Yu).call(this), a = Mn(), o = a === "24h", s = o ? S("EIDOLON.TimeTrigger.EditTimePlaceholder24", "HH:MM") : S("EIDOLON.TimeTrigger.EditTimePlaceholder12", "HH:MM AM/PM"), l = this.showControls ? S(
      "EIDOLON.TimeTrigger.EditTimeHint",
      "Double-click to set a specific time."
    ) : "", u = this.showControls ? S(
      "EIDOLON.TimeTrigger.EditTimeLabel",
      "New time (HH:MM or HH:MM AM/PM)"
    ) : "", d = Em.map((E) => ({
      minutes: E,
      label: E > 0 ? `+${E}` : `${E}`
    })), f = !!this.manageTimeEnabled, h = C(this, re, js).call(this);
    this.sceneAllowsRealTime = h;
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
      manageTimeEnabled: f,
      sceneAllowsRealTime: h,
      realTimeButtonLabel: f ? h ? p : g : y,
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
    return C(this, re, td).call(this), C(this, re, nd).call(this), i;
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
    } catch (f) {
      console.error(`${T} | Failed to advance time`, f), (u = (l = ui.notifications) == null ? void 0 : l.error) == null || u.call(
        l,
        S("EIDOLON.TimeTrigger.Error", "Failed to update the world time.")
      ), N("Failed to advance time from window", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        minutes: n,
        message: (f == null ? void 0 : f.message) ?? String(f)
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
          u.addEventListener("click", m(this, io));
        });
        const o = r.querySelector('.time-trigger-window__time-value[data-editable="true"]');
        o && o.addEventListener("dblclick", m(this, ro), { once: !1 });
        const s = r.querySelector(".time-trigger-window__time-input");
        s && (s.addEventListener("keydown", m(this, ao)), s.addEventListener("blur", m(this, oo)), typeof s.focus == "function" && (s.focus(), typeof s.select == "function" && s.select()));
        const l = r.querySelector('[data-action="toggle-real-time"]');
        l && l.addEventListener("click", m(this, lo));
      }
      this._suppressBlurCommit = !1;
    }
  }
};
Qn = new WeakMap(), Zn = new WeakMap(), re = new WeakSet(), Yu = /* @__PURE__ */ c(function() {
  var l;
  const n = (l = game.time) == null ? void 0 : l.worldTime;
  if (typeof n != "number" || !Number.isFinite(n)) return "";
  const i = 1440 * 60, r = (Math.floor(n) % i + i) % i, a = Math.floor(r / 3600), o = Math.floor(r % 3600 / 60), s = r % 60;
  return xa({ hours: a, minutes: o, seconds: s }, Mn());
}, "#formatFallbackTime"), io = new WeakMap(), ro = new WeakMap(), Xu = /* @__PURE__ */ c(function() {
  var n;
  (n = game.user) != null && n.isGM && (this.isEditingTime = !0, this._suppressBlurCommit = !1, this.editValue = C(this, re, Rs).call(this), this.render({ force: !0 }));
}, "#enterTimeEditMode"), Ds = /* @__PURE__ */ c(function() {
  this.isEditingTime = !1, this.editValue = "", this._suppressBlurCommit = !1, this.render({ force: !0 });
}, "#cancelTimeEdit"), Ps = /* @__PURE__ */ c(async function(n) {
  var a, o, s;
  if (!((a = game.user) != null && a.isGM) || !this.isEditingTime || this._commitTimeInProgress) return;
  this._commitTimeInProgress = !0;
  const i = typeof n == "string" ? n.trim() : "";
  if (!i) {
    C(this, re, Ds).call(this), this._commitTimeInProgress = !1;
    return;
  }
  const r = C(this, re, ed).call(this, i);
  if (r.error) {
    (s = (o = ui.notifications) == null ? void 0 : o.error) == null || s.call(o, r.error), this._suppressBlurCommit = !0, this.editValue = i, this.render({ force: !0 }), this._commitTimeInProgress = !1;
    return;
  }
  try {
    await C(this, re, Zu).call(this, r.seconds, r.includeSeconds) ? (this.isEditingTime = !1, this.editValue = "", this.render({ force: !0 })) : (this.editValue = i, this.render({ force: !0 }));
  } finally {
    this._commitTimeInProgress = !1;
  }
}, "#commitTimeInput"), ao = new WeakMap(), oo = new WeakMap(), Qu = /* @__PURE__ */ c(function() {
  var u, d;
  const n = (u = game.time) == null ? void 0 : u.worldTime;
  if (typeof n != "number" || !Number.isFinite(n))
    return "";
  const i = ((d = game.time) == null ? void 0 : d.components) ?? {}, r = Number(i.hour), a = Number(i.minute), o = i.second !== void 0 ? Number(i.second) : null, s = Number.isInteger(o);
  return (Number.isFinite(r) && Number.isFinite(a) ? qt({
    hours: Math.max(0, Math.min(23, Number(r))),
    minutes: Math.max(0, Math.min(59, Number(a))),
    seconds: s && Number.isFinite(o) ? Math.max(0, Math.min(59, Number(o))) : void 0
  }) ?? "" : "") ?? "";
}, "#getCurrentCanonicalTime"), Zu = /* @__PURE__ */ c(async function(n, i) {
  var h, g, p, y, w, v, b, E, L, A;
  const r = (h = game.time) == null ? void 0 : h.worldTime;
  if (typeof r != "number" || !Number.isFinite(r))
    return (p = (g = ui.notifications) == null ? void 0 : g.error) == null || p.call(
      g,
      S(
        "EIDOLON.TimeTrigger.EditTimeUnavailable",
        "The world time is unavailable, so it can't be updated."
      )
    ), !1;
  if (!Number.isInteger(n) || n < 0 || n >= $i)
    return (w = (y = ui.notifications) == null ? void 0 : y.error) == null || w.call(
      y,
      S(
        "EIDOLON.TimeTrigger.EditTimeInvalidRange",
        "Enter a time within the current day."
      )
    ), !1;
  const s = Math.floor(r / $i) * $i + n - r;
  if (!Number.isFinite(s) || s === 0)
    return !0;
  const l = Math.floor(n / 3600), u = Math.floor(n % 3600 / 60), d = n % 60, f = qt({
    hours: l,
    minutes: u,
    seconds: i ? d : void 0
  });
  try {
    N("Updating world time directly", {
      sceneId: ((v = this.scene) == null ? void 0 : v.id) ?? null,
      targetCanonical: f ?? null,
      diff: s
    }), await game.time.advance(s);
    const O = xa(
      {
        hours: l,
        minutes: u,
        seconds: i ? d : null
      },
      Mn()
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
}, "#applyTargetSeconds"), ed = /* @__PURE__ */ c(function(n) {
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
  const a = r.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (a) {
    const h = Number(a[1]), g = Number(a[2]), p = a[3] !== void 0 ? Number(a[3]) : void 0;
    if (Number.isInteger(h) && h >= 0 && h <= 23 && Number.isInteger(g) && g >= 0 && g <= 59 && (p === void 0 || Number.isInteger(p) && p >= 0 && p <= 59)) {
      const y = h * 3600 + g * 60 + (p ?? 0);
      return {
        canonical: qt({ hours: h, minutes: g, seconds: p }),
        seconds: y,
        includeSeconds: p !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const { amLower: o, pmLower: s, periodPattern: l } = C(this, re, Hs).call(this), u = r.match(
    new RegExp(
      `^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?\\s*(${l})$`,
      "i"
    )
  );
  if (u) {
    let h = Number(u[1]);
    const g = Number(u[2]), p = u[3] !== void 0 ? Number(u[3]) : void 0, y = u[4] ?? "", w = typeof y == "string" ? ((f = y.toLocaleLowerCase) == null ? void 0 : f.call(y)) ?? y.toLowerCase() : "";
    if (Number.isInteger(h) && h >= 1 && h <= 12 && Number.isInteger(g) && g >= 0 && g <= 59 && (p === void 0 || Number.isInteger(p) && p >= 0 && p <= 59) && (w === o || w === s || w === "am" || w === "pm")) {
      h = h % 12, (w === s || w === "pm") && (h += 12);
      const b = h * 3600 + g * 60 + (p ?? 0);
      return {
        canonical: qt({ hours: h, minutes: g, seconds: p }),
        seconds: b,
        includeSeconds: p !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const d = Bu(r);
  if (d !== null) {
    const h = Math.floor(d / 3600), g = Math.floor(d % 3600 / 60), p = d % 60, y = p !== 0;
    return {
      canonical: qt({
        hours: h,
        minutes: g,
        seconds: y ? p : void 0
      }),
      seconds: d,
      includeSeconds: y,
      error: null
    };
  }
  return { error: i };
}, "#parseInputTime"), Rs = /* @__PURE__ */ c(function() {
  const n = C(this, re, Qu).call(this);
  if (!n) return "";
  if (Mn() === "24h")
    return n;
  const r = xo(n);
  if (!r) return n;
  const a = Number(r.hours), o = Number(r.minutes), s = r.seconds !== null && r.seconds !== void 0 ? Number(r.seconds) : void 0;
  if (!Number.isFinite(a) || !Number.isFinite(o)) return n;
  const l = Number.isFinite(s), u = a % 12 === 0 ? 12 : a % 12, d = String(o).padStart(2, "0"), f = l ? `:${String(s).padStart(2, "0")}` : "", { amLabel: h, pmLabel: g } = C(this, re, Hs).call(this), p = a >= 12 ? g : h;
  return `${u}:${d}${f} ${p}`.trim();
}, "#getInitialEditValue"), Hs = /* @__PURE__ */ c(function() {
  var u, d;
  const n = S("EIDOLON.TimeTrigger.TimePeriodAM", "AM"), i = S("EIDOLON.TimeTrigger.TimePeriodPM", "PM"), r = ((u = n.toLocaleLowerCase) == null ? void 0 : u.call(n)) ?? n.toLowerCase(), a = ((d = i.toLocaleLowerCase) == null ? void 0 : d.call(i)) ?? i.toLowerCase(), o = C(this, re, qs).call(this, n), s = C(this, re, qs).call(this, i), l = `${o}|${s}|AM|PM`;
  return {
    amLabel: n,
    pmLabel: i,
    amLower: r,
    pmLower: a,
    periodPattern: l
  };
}, "#getPeriodMatchData"), qs = /* @__PURE__ */ c(function(n) {
  return typeof n != "string" ? "" : n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}, "#escapeForRegex"), so = new WeakMap(), lo = new WeakMap(), js = /* @__PURE__ */ c(function() {
  const n = this.scene;
  if (!n || typeof n.getFlag != "function") return !1;
  try {
    return !!n.getFlag(T, Ts);
  } catch (i) {
    N("TimeTriggerWindow | Failed to read scene real-time flag", {
      sceneId: (n == null ? void 0 : n.id) ?? null,
      message: (i == null ? void 0 : i.message) ?? String(i)
    });
  }
  return !1;
}, "#readSceneRealTimeFlag"), co = new WeakMap(), td = /* @__PURE__ */ c(function() {
  if (typeof m(this, Qn) == "function")
    try {
      m(this, Qn).call(this);
    } catch (n) {
      console.error(`${T} | Failed to dispose time format subscription`, n);
    }
  I(this, Qn, null);
}, "#disposeTimeFormatSubscription"), nd = /* @__PURE__ */ c(function() {
  if (typeof m(this, Zn) == "function")
    try {
      m(this, Zn).call(this);
    } catch (n) {
      console.error(`${T} | Failed to dispose manage time subscription`, n);
    }
  I(this, Zn, null);
}, "#disposeManageTimeSubscription"), c(Yn, "TimeTriggerWindow"), ye(Yn, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Fe(Yn, Yn, "DEFAULT_OPTIONS"),
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
)), ye(Yn, "PARTS", {
  content: {
    template: `modules/${T}/templates/time-trigger.html`
  }
});
let Fs = Yn;
function Fo(t, e = {}) {
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
c(Fo, "createApplicationFactory");
const Fc = /* @__PURE__ */ new Set();
var ve, Ke, ei, Yi, id, rd;
const wc = class wc {
  constructor({ windowFactory: e } = {}) {
    k(this, Yi);
    k(this, ve, null);
    k(this, Ke, null);
    k(this, ei);
    const n = Fo(Fs);
    typeof e == "function" ? e.__eidolonFactorySignature === "options" ? I(this, ei, (r, a = {}) => e({ scene: r, ...a ?? {} })) : I(this, ei, e) : I(this, ei, /* @__PURE__ */ c((r, a = {}) => n({ scene: r, ...a ?? {} }), "fallbackFactory"));
  }
  onReady() {
    var n;
    const e = typeof ((n = game.time) == null ? void 0 : n.worldTime) == "number" && Number.isFinite(game.time.worldTime) ? game.time.worldTime : null;
    N("TimeTriggerManager#onReady", { worldTime: e }), e !== null && I(this, Ke, e);
  }
  onCanvasReady(e) {
    const n = (e == null ? void 0 : e.scene) ?? rr();
    N("TimeTriggerManager#onCanvasReady", { sceneId: (n == null ? void 0 : n.id) ?? null }), this.refreshTimeTriggerWindow(n), this.handleTimeTriggerEvaluation(n);
  }
  onUpdateScene(e) {
    const n = rr();
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
    const i = rr(), r = C(this, Yi, id).call(this, e, n);
    this.handleTimeTriggerEvaluation(i, e, r);
  }
  refreshTimeTriggerWindow(e) {
    var l, u, d;
    if (!e) return;
    const n = !!((l = game.user) != null && l.isGM), i = !!e.getFlag(T, Ma), r = !!e.getFlag(T, Ss), a = !!e.getFlag(T, Cs);
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
    }), m(this, ve).close({ force: !0 })), I(this, ve, m(this, ei).call(this, e, { showControls: s })), N("Rendering new time trigger window", { sceneId: e.id }), m(this, ve).render({ force: !0 });
  }
  async handleTimeTriggerEvaluation(e, n, i) {
    var l;
    const r = e ?? rr();
    if (!r) {
      N("handleTimeTriggerEvaluation skipped", {
        reason: "no-active-scene",
        providedSceneId: (e == null ? void 0 : e.id) ?? null,
        currentWorldTime: n
      }), typeof n == "number" && Number.isFinite(n) && I(this, Ke, n);
      return;
    }
    const a = typeof n == "number" && Number.isFinite(n) ? n : typeof ((l = game.time) == null ? void 0 : l.worldTime) == "number" ? game.time.worldTime : null;
    if (a === null) return;
    const o = typeof i == "number" && Number.isFinite(i) ? i : null, s = o !== null ? o : typeof m(this, Ke) == "number" && Number.isFinite(m(this, Ke)) ? m(this, Ke) : a;
    Vi("handleTimeTriggerEvaluation", {
      sceneId: r.id,
      previousWorldTime: s,
      currentWorldTime: a,
      overrideProvided: o !== null
    });
    try {
      await C(this, Yi, rd).call(this, r, s, a);
    } catch (u) {
      console.error(`${T} | Unexpected error while evaluating time triggers`, u), N("handleTimeTriggerEvaluation error", { message: (u == null ? void 0 : u.message) ?? String(u) });
    } finally {
      I(this, Ke, a), kn();
    }
  }
};
ve = new WeakMap(), Ke = new WeakMap(), ei = new WeakMap(), Yi = new WeakSet(), id = /* @__PURE__ */ c(function(e, n) {
  return typeof m(this, Ke) == "number" && Number.isFinite(m(this, Ke)) ? (N("Resolved previous world time from cache", {
    previousWorldTime: m(this, Ke)
  }), m(this, Ke)) : typeof e == "number" && Number.isFinite(e) && typeof n == "number" && Number.isFinite(n) ? (N("Resolved previous world time using diff", {
    worldTime: e,
    diff: n,
    resolved: e - n
  }), e - n) : typeof e == "number" && Number.isFinite(e) ? e : null;
}, "#resolvePreviousWorldTime"), rd = /* @__PURE__ */ c(async function(e, n, i) {
  var p, y, w;
  if (!((p = game.user) != null && p.isGM)) {
    N("Skipping trigger evaluation because user is not a GM");
    return;
  }
  if (!(e != null && e.id)) {
    N("Skipping trigger evaluation because the scene is missing an id");
    return;
  }
  if (!!!e.getFlag(T, Ma)) {
    N("Skipping trigger evaluation because scene is inactive", { sceneId: e.id });
    return;
  }
  if (typeof i != "number" || !Number.isFinite(i)) return;
  (typeof n != "number" || !Number.isFinite(n)) && (n = i);
  const a = xi(e);
  if (!a.length) {
    N("No time triggers configured for scene", { sceneId: e.id });
    return;
  }
  const o = Nm(e), s = /* @__PURE__ */ new Set();
  for (const v of a)
    v != null && v.id && s.add(v.id);
  let l = !1;
  for (const v of Object.keys(o))
    s.has(v) || (delete o[v], l = !0);
  if (Vi("Evaluating scene time triggers", {
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
    }), await rs(e, o)), kn();
    return;
  }
  const u = n, d = i, f = [], h = Math.floor(u / $i), g = Math.floor(d / $i);
  for (const v of a) {
    if (!(v != null && v.id)) continue;
    const b = Bu(v.time);
    if (b === null) {
      Um(e, v), N("Skipping trigger with invalid time", {
        triggerId: v.id,
        time: v.time
      });
      continue;
    }
    for (let E = h; E <= g; E++) {
      const L = E * $i + b;
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
      f.push({ trigger: v, absoluteTime: L });
    }
  }
  if (!f.length) {
    l && await rs(e, o), N("No triggers scheduled to fire within evaluation window", {
      sceneId: e.id
    }), kn();
    return;
  }
  f.sort((v, b) => v.absoluteTime - b.absoluteTime), N("Queued triggers for execution", {
    entries: f.map((v) => ({
      triggerId: v.trigger.id,
      absoluteTime: v.absoluteTime
    }))
  });
  for (const v of f)
    try {
      N("Executing time trigger action", {
        triggerId: v.trigger.id,
        absoluteTime: v.absoluteTime
      }), await Ju(e, v.trigger);
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
  l && (N("Persisting trigger history updates", { sceneId: e.id }), await rs(e, o)), kn();
}, "#evaluateSceneTimeTriggers"), c(wc, "TimeTriggerManager");
let Bs = wc;
function Um(t, e) {
  var r, a;
  const n = `${(t == null ? void 0 : t.id) ?? "unknown"}:${(e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.time) ?? "unknown"}`;
  if (Fc.has(n)) return;
  Fc.add(n);
  const i = S(
    "EIDOLON.TimeTrigger.InvalidTimeWarning",
    "A scene time trigger has an invalid time value and was skipped."
  );
  (a = (r = ui.notifications) == null ? void 0 : r.warn) == null || a.call(r, i), console.warn(`${T} | Invalid time for trigger`, { scene: t == null ? void 0 : t.id, trigger: e });
}
c(Um, "warnInvalidTriggerTime");
var vt, Ir, wt, gn, ti, Ft, Hi, uo, fo, Or, Ar, ni, Dt, V, Vs, Li, ha, Gs, ga, zs, $t, ad, Ws, od, Ks, sd, mo, ho, go, po, yo, bo, Js, ld, pa, vo, wo;
const Ec = class Ec {
  constructor() {
    k(this, V);
    k(this, vt, !1);
    k(this, Ir, Gr);
    k(this, wt, /* @__PURE__ */ new Map());
    k(this, gn, null);
    k(this, ti, null);
    k(this, Ft, 0);
    k(this, Hi, null);
    k(this, uo, null);
    k(this, fo, null);
    k(this, Or, !1);
    k(this, Ar, !1);
    k(this, ni, !1);
    k(this, Dt, !1);
    k(this, mo, /* @__PURE__ */ c((e, n = {}) => {
      N("GameTimeAutomation | Pause state changed", {
        paused: e,
        userId: (n == null ? void 0 : n.userId) ?? null,
        broadcast: (n == null ? void 0 : n.broadcast) ?? null
      }), C(this, V, $t).call(this, { pausedOverride: e });
    }, "#handlePause"));
    k(this, ho, /* @__PURE__ */ c((e) => {
      e != null && e.id && (m(this, wt).set(e.id, Math.max(e.round ?? 0, 1)), N("GameTimeAutomation | Combat started", { combatId: e.id, round: e.round ?? 0 }), C(this, V, $t).call(this));
    }, "#handleCombatStart"));
    k(this, go, /* @__PURE__ */ c((e, n) => {
      if (!(e != null && e.id)) return;
      const i = typeof n == "number" && Number.isFinite(n) ? n : typeof e.round == "number" && Number.isFinite(e.round) ? e.round : 0, r = i > 0 ? i : 1, a = m(this, wt).get(e.id), o = a ? Math.max(a, 1) : 1, s = r > 1 ? Math.max(r - o, 0) : 0;
      if (N("GameTimeAutomation | Combat round change detected", {
        combatId: e.id,
        effectiveRound: r,
        completedRounds: s,
        enabled: m(this, vt),
        paused: (game == null ? void 0 : game.paused) ?? null
      }), s > 0 && m(this, vt) && m(this, Dt) && !(game != null && game.paused) && C(this, V, Li).call(this) && C(this, V, ha).call(this, e)) {
        const l = s * m(this, Ir);
        l > 0 && (N("GameTimeAutomation | Advancing time for completed combat rounds", {
          combatId: e.id,
          completedRounds: s,
          delta: l
        }), C(this, V, Ks).call(this, l));
      }
      m(this, wt).set(e.id, Math.max(r, 1));
    }, "#handleCombatRound"));
    k(this, po, /* @__PURE__ */ c((e) => {
      e != null && e.id && (m(this, wt).delete(e.id), N("GameTimeAutomation | Combat ended", { combatId: e.id }), C(this, V, $t).call(this));
    }, "#handleCombatEnd"));
    k(this, yo, /* @__PURE__ */ c((e) => {
      e != null && e.id && (m(this, wt).delete(e.id), N("GameTimeAutomation | Combat deleted", { combatId: e.id }), C(this, V, $t).call(this));
    }, "#handleCombatDelete"));
    k(this, bo, /* @__PURE__ */ c((e, n) => {
      if (e != null && e.id) {
        if (typeof (n == null ? void 0 : n.round) == "number" && Number.isFinite(n.round)) {
          const i = Math.max(n.round, 1);
          m(this, wt).set(e.id, i), N("GameTimeAutomation | Combat round manually updated", {
            combatId: e.id,
            round: i
          });
        }
        (Object.prototype.hasOwnProperty.call(n ?? {}, "active") || (n == null ? void 0 : n.round) !== void 0) && C(this, V, $t).call(this);
      }
    }, "#handleCombatUpdate"));
    k(this, vo, /* @__PURE__ */ c((e) => {
      C(this, V, pa).call(this, e == null ? void 0 : e.scene), C(this, V, $t).call(this);
    }, "#handleCanvasReady"));
    k(this, wo, /* @__PURE__ */ c((e) => {
      if (!Ge(e)) return;
      const n = C(this, V, Js).call(this);
      if (!n || n.id !== e.id) return;
      C(this, V, pa).call(this, e) && C(this, V, $t).call(this);
    }, "#handleSceneUpdate"));
  }
  registerHooks() {
    m(this, Or) || (I(this, Or, !0), Hooks.on("pauseGame", m(this, mo)), Hooks.on("combatStart", m(this, ho)), Hooks.on("combatRound", m(this, go)), Hooks.on("combatEnd", m(this, po)), Hooks.on("deleteCombat", m(this, yo)), Hooks.on("updateCombat", m(this, bo)), Hooks.on("canvasReady", m(this, vo)), Hooks.on("updateScene", m(this, wo)));
  }
  initialize() {
    m(this, Ar) || (I(this, Ar, !0), I(this, uo, Gu((e) => {
      const n = !!e, i = n !== m(this, vt);
      I(this, vt, n), N("GameTimeAutomation | Manage time toggled", { enabled: n }), i && n && C(this, V, zs).call(this), C(this, V, $t).call(this);
    })), I(this, fo, Am((e) => {
      I(this, Ir, e), N("GameTimeAutomation | Seconds per round updated", { value: e });
    })), C(this, V, zs).call(this), C(this, V, pa).call(this), C(this, V, $t).call(this));
  }
};
vt = new WeakMap(), Ir = new WeakMap(), wt = new WeakMap(), gn = new WeakMap(), ti = new WeakMap(), Ft = new WeakMap(), Hi = new WeakMap(), uo = new WeakMap(), fo = new WeakMap(), Or = new WeakMap(), Ar = new WeakMap(), ni = new WeakMap(), Dt = new WeakMap(), V = new WeakSet(), Vs = /* @__PURE__ */ c(function() {
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
}, "#currentTimestamp"), Li = /* @__PURE__ */ c(function() {
  var e;
  return !!((e = game == null ? void 0 : game.user) != null && e.isGM && game.user.active !== !1);
}, "#canControlTime"), ha = /* @__PURE__ */ c(function(e) {
  var i, r;
  if (!e) return !1;
  if (e.active === !0) return !0;
  if (e.active === !1) return !1;
  const n = (i = game == null ? void 0 : game.combats) == null ? void 0 : i.active;
  return (n == null ? void 0 : n.id) === e.id ? !0 : ((r = game == null ? void 0 : game.combat) == null ? void 0 : r.id) === e.id ? game.combat.active ?? !0 : !1;
}, "#isCombatDocumentActive"), Gs = /* @__PURE__ */ c(function(e) {
  return e ? typeof e.started == "boolean" ? e.started : (e.round ?? 0) > 0 : !1;
}, "#hasCombatStarted"), ga = /* @__PURE__ */ c(function() {
  var i;
  const e = Array.isArray((i = game == null ? void 0 : game.combats) == null ? void 0 : i.contents) ? game.combats.contents : [];
  for (const r of e)
    if (C(this, V, ha).call(this, r) && C(this, V, Gs).call(this, r))
      return !0;
  const n = game == null ? void 0 : game.combat;
  return !!(n && C(this, V, ha).call(this, n) && C(this, V, Gs).call(this, n));
}, "#isCombatRunning"), zs = /* @__PURE__ */ c(function() {
  var n;
  m(this, wt).clear();
  const e = Array.isArray((n = game == null ? void 0 : game.combats) == null ? void 0 : n.contents) ? game.combats.contents : [];
  for (const i of e)
    i != null && i.id && m(this, wt).set(i.id, Math.max(i.round ?? 0, 1));
}, "#hydrateRoundTracking"), $t = /* @__PURE__ */ c(function({ pausedOverride: e } = {}) {
  const n = typeof e == "boolean" ? e : !!(game != null && game.paused), i = m(this, vt), r = m(this, Dt), a = i && r, o = {
    manageTimeEnabled: i,
    sceneAllowsRealTime: r,
    effectiveEnabled: a,
    paused: n,
    canControl: C(this, V, Li).call(this),
    combatRunning: C(this, V, ga).call(this),
    overrideApplied: typeof e == "boolean"
  };
  if (N("GameTimeAutomation | Sync running state", o), !a || !C(this, V, Li).call(this)) {
    C(this, V, Ws).call(this);
    return;
  }
  C(this, V, ad).call(this);
}, "#syncRunningState"), ad = /* @__PURE__ */ c(function() {
  m(this, gn) === null && (I(this, ti, C(this, V, Vs).call(this)), I(this, gn, globalThis.setInterval(() => C(this, V, od).call(this), 1e3)), N("GameTimeAutomation | Started real-time ticker"));
}, "#startRealTimeTicker"), Ws = /* @__PURE__ */ c(function() {
  m(this, gn) !== null && (globalThis.clearInterval(m(this, gn)), I(this, gn, null), N("GameTimeAutomation | Stopped real-time ticker")), I(this, ti, null), I(this, Ft, 0), I(this, ni, !1);
}, "#stopRealTimeTicker"), od = /* @__PURE__ */ c(function() {
  if (!m(this, vt) || !m(this, Dt) || !C(this, V, Li).call(this)) {
    C(this, V, Ws).call(this);
    return;
  }
  const e = C(this, V, Vs).call(this);
  if (typeof e != "number" || !Number.isFinite(e)) return;
  const n = m(this, ti) ?? e, i = (e - n) / 1e3;
  if (I(this, ti, e), !Number.isFinite(i) || i <= 0) return;
  const r = !!(game != null && game.paused), a = C(this, V, ga).call(this);
  if (r || a) {
    m(this, ni) || N("GameTimeAutomation | Tick skipped", { paused: r, combatRunning: a }), I(this, ni, !0), I(this, Ft, 0);
    return;
  }
  I(this, ni, !1), N("GameTimeAutomation | Real-time tick", { deltaSeconds: i }), C(this, V, Ks).call(this, i);
}, "#tickRealTime"), Ks = /* @__PURE__ */ c(function(e) {
  if (!m(this, vt) || !m(this, Dt)) return;
  const n = Number(e);
  !Number.isFinite(n) || n <= 0 || (I(this, Ft, m(this, Ft) + n), !m(this, Hi) && I(this, Hi, C(this, V, sd).call(this)));
}, "#queueAdvance"), sd = /* @__PURE__ */ c(async function() {
  var e, n;
  for (; m(this, Ft) > 0; ) {
    if (!m(this, vt) || !m(this, Dt) || game != null && game.paused || !C(this, V, Li).call(this) || C(this, V, ga).call(this)) {
      I(this, Ft, 0);
      break;
    }
    const i = m(this, Ft);
    I(this, Ft, 0);
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
  I(this, Hi, null);
}, "#flushAdvanceQueue"), mo = new WeakMap(), ho = new WeakMap(), go = new WeakMap(), po = new WeakMap(), yo = new WeakMap(), bo = new WeakMap(), Js = /* @__PURE__ */ c(function() {
  const e = rr();
  return Ge(e) ? e : null;
}, "#getActiveSceneDocument"), ld = /* @__PURE__ */ c(function(e) {
  if (!Ge(e)) return !1;
  try {
    return !!e.getFlag(T, Ts);
  } catch (n) {
    return N("GameTimeAutomation | Failed to read scene real-time flag", {
      sceneId: (e == null ? void 0 : e.id) ?? null,
      message: (n == null ? void 0 : n.message) ?? String(n)
    }), !1;
  }
}, "#isSceneRealTimeAllowed"), pa = /* @__PURE__ */ c(function(e) {
  const n = Ge(e) ? e : C(this, V, Js).call(this), i = C(this, V, ld).call(this, n), r = m(this, Dt);
  return I(this, Dt, i), r !== i ? (N("GameTimeAutomation | Scene real-time allowance changed", {
    sceneId: (n == null ? void 0 : n.id) ?? null,
    allows: i
  }), !0) : !1;
}, "#refreshSceneAutomationState"), vo = new WeakMap(), wo = new WeakMap(), c(Ec, "GameTimeAutomation");
let Us = Ec;
var Fu, pn, De, ii, nn, Eo, be, cd, ud, dd, fd, So, Xs, Co, md, To, hd, gd;
const Qt = class Qt extends qn(Hn) {
  constructor(n = {}) {
    const { scene: i, trigger: r, triggerIndex: a, onSave: o, ...s } = n ?? {};
    super(s);
    k(this, be);
    k(this, pn, null);
    k(this, De, null);
    k(this, ii, null);
    k(this, nn, null);
    k(this, Eo, /* @__PURE__ */ c(() => {
      (this.rendered ?? this.isRendered ?? !1) && (I(this, nn, C(this, be, cd).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    k(this, So, /* @__PURE__ */ c((n) => {
      var a, o;
      const i = n.currentTarget, r = i == null ? void 0 : i.closest("form");
      r && (N("Trigger action selection changed", {
        sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
        triggerId: ((o = this.trigger) == null ? void 0 : o.id) ?? null,
        actionId: (i == null ? void 0 : i.value) ?? null
      }), C(this, be, Xs).call(this, i.value, r));
    }, "#onActionSelectChange"));
    k(this, Co, /* @__PURE__ */ c((n) => {
      var u, d, f, h;
      n.preventDefault();
      const i = n.currentTarget, r = i == null ? void 0 : i.closest("form");
      if (!r) return;
      const a = (u = i.dataset) == null ? void 0 : u.target;
      if (!a) return;
      const o = typeof (CSS == null ? void 0 : CSS.escape) == "function" ? CSS.escape : (g) => g, s = r.querySelector(`[name="${o(a)}"]`);
      if (!s) return;
      N("Opening file picker for trigger", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        triggerId: ((f = this.trigger) == null ? void 0 : f.id) ?? null,
        target: a
      }), new FilePicker({
        type: ((h = i.dataset) == null ? void 0 : h.type) || "audio",
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
    k(this, To, /* @__PURE__ */ c(async (n) => {
      var r, a;
      n.preventDefault();
      const i = n.currentTarget;
      i instanceof HTMLFormElement && (N("Trigger form submitted", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null,
        triggerId: ((a = this.trigger) == null ? void 0 : a.id) ?? null
      }), await C(this, be, hd).call(this, i));
    }, "#onSubmit"));
    this.scene = i ?? null, this.trigger = r ?? null, this.triggerIndex = Number.isInteger(a) ? Number(a) : null, this.onSave = typeof o == "function" ? o : null, I(this, ii, Xl(m(this, Eo)));
  }
  async _prepareContext() {
    var n, i;
    Vi("TriggerFormApplication#_prepareContext", {
      sceneId: ((n = this.scene) == null ? void 0 : n.id) ?? null,
      triggerId: ((i = this.trigger) == null ? void 0 : i.id) ?? null,
      triggerIndex: this.triggerIndex
    });
    try {
      const r = this.trigger ?? { action: ma, data: {} }, a = r.action ?? ma, o = xc(r.time), s = o.format ?? "12h", l = s === "12h" ? Bm() : [], u = o.period ?? (l.length > 0 ? l[0].value : null), d = s === "12h" ? l.map((g) => ({
        ...g,
        selected: g.value === u
      })) : [], f = $c().map((g) => ({
        id: g.id,
        label: typeof g.label == "function" ? g.label() : g.label,
        selected: g.id === a
      })), h = $c().map((g) => {
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
      kn();
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
      (f) => f.startsWith("theme-")
    );
    a && r.classList.add(a);
    const o = r.querySelector("form");
    if (!o) return;
    C(this, be, md).call(this, o), C(this, be, ud).call(this, o), o.addEventListener("submit", m(this, To));
    const s = o.querySelector("[data-action-select]");
    s && (s.addEventListener("change", m(this, So)), C(this, be, Xs).call(this, s.value, o)), o.querySelectorAll("[data-action-file-picker]").forEach((f) => {
      f.addEventListener("click", m(this, Co));
    });
  }
  async close(n = {}) {
    var i;
    if ((i = m(this, pn)) == null || i.call(this), I(this, pn, null), I(this, De, null), I(this, nn, null), typeof m(this, ii) == "function")
      try {
        m(this, ii).call(this);
      } catch (r) {
        console.error(`${T} | Failed to dispose trigger form time format subscription`, r);
      }
    return I(this, ii, null), super.close(n);
  }
};
pn = new WeakMap(), De = new WeakMap(), ii = new WeakMap(), nn = new WeakMap(), Eo = new WeakMap(), be = new WeakSet(), cd = /* @__PURE__ */ c(function() {
  var s, l, u, d, f, h, g;
  const n = (l = (s = this.element) == null ? void 0 : s.querySelector) == null ? void 0 : l.call(s, "form");
  if (!(n instanceof HTMLFormElement)) return null;
  const i = Array.from(n.elements ?? []), r = [];
  for (const p of i)
    if ((p instanceof HTMLInputElement || p instanceof HTMLSelectElement || p instanceof HTMLTextAreaElement) && p.name && !(((u = p.dataset) == null ? void 0 : u.timeHidden) !== void 0 || ((d = p.dataset) == null ? void 0 : d.timeHour) !== void 0 || ((f = p.dataset) == null ? void 0 : f.timeMinute) !== void 0 || ((h = p.dataset) == null ? void 0 : h.timePeriod) !== void 0)) {
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
}, "#captureFormState"), ud = /* @__PURE__ */ c(function(n) {
  if (!m(this, nn)) return;
  if (!(n instanceof HTMLFormElement)) {
    I(this, nn, null);
    return;
  }
  const { fields: i = [], time: r = null } = m(this, nn) ?? {};
  I(this, nn, null), C(this, be, dd).call(this, n, i), C(this, be, fd).call(this, n, r);
}, "#restorePendingFormState"), dd = /* @__PURE__ */ c(function(n, i) {
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
}, "#restoreFieldValues"), fd = /* @__PURE__ */ c(function(n, i) {
  var b, E, L;
  const r = n.querySelector("[data-time-format]");
  if (!(r instanceof HTMLElement)) {
    typeof m(this, De) == "function" && m(this, De).call(this);
    return;
  }
  const a = ((b = r.dataset) == null ? void 0 : b.timeFormat) === "24h" ? "24h" : "12h", o = r.querySelector("[data-time-hour]"), s = r.querySelector("[data-time-minute]"), l = r.querySelector("[data-time-period]"), u = r.querySelector("[data-time-hidden]");
  if (!i) {
    if (o instanceof HTMLInputElement && (o.value = ""), s instanceof HTMLInputElement && (s.value = ""), l instanceof HTMLSelectElement) {
      const A = ((L = (E = l.options) == null ? void 0 : E[0]) == null ? void 0 : L.value) ?? "";
      l.value = A;
    }
    u instanceof HTMLInputElement && (u.value = ""), typeof m(this, De) == "function" && m(this, De).call(this);
    return;
  }
  const d = typeof i.canonical == "string" ? i.canonical : "", f = typeof i.period == "string" ? i.period : "", h = typeof i.hour == "string" ? i.hour : "", g = typeof i.minute == "string" ? i.minute : "";
  let p = "", y = "", w = f, v = d;
  if (d) {
    const A = xc(d, a);
    p = A.hour ?? "", y = A.minute ?? "", v = A.canonical ?? d, a === "12h" ? w = A.period ?? f : w = "";
  } else
    p = h, y = g, a !== "12h" && (w = "");
  if (o instanceof HTMLInputElement && (o.value = p ?? ""), s instanceof HTMLInputElement && (s.value = y ?? ""), l instanceof HTMLSelectElement)
    if (a === "12h") {
      const A = Array.from(l.options ?? []);
      A.find((M) => M.value === w) ? l.value = w : A.length > 0 ? l.value = A[0].value : l.value = "";
    } else
      l.value = "";
  u instanceof HTMLInputElement && (u.value = v ?? ""), typeof m(this, De) == "function" && m(this, De).call(this);
}, "#restoreTimeInputs"), So = new WeakMap(), Xs = /* @__PURE__ */ c(function(n, i) {
  i && i.querySelectorAll("[data-action-config]").forEach((r) => {
    const a = r.dataset.actionConfig === n;
    r.style.display = a ? "" : "none";
  });
}, "#updateActionSections"), Co = new WeakMap(), md = /* @__PURE__ */ c(function(n) {
  var f, h, g, p;
  if ((f = m(this, pn)) == null || f.call(this), I(this, pn, null), I(this, De, null), !(n instanceof HTMLFormElement)) return;
  const i = n.querySelector("[data-time-format]"), r = ((h = i == null ? void 0 : i.dataset) == null ? void 0 : h.timeFormat) ?? null;
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
    const { canonical: y, error: w } = jm(
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
  }), d(), I(this, pn, () => {
    u.forEach((y) => {
      y.removeEventListener("input", d), y.removeEventListener("change", d);
    });
  }), I(this, De, d), N("Trigger form configured for time input", {
    format: r,
    sceneId: ((g = this.scene) == null ? void 0 : g.id) ?? null,
    triggerId: ((p = this.trigger) == null ? void 0 : p.id) ?? null
  });
}, "#setupTimeInput"), To = new WeakMap(), hd = /* @__PURE__ */ c(async function(n) {
  var a, o, s, l, u;
  if (typeof m(this, De) == "function" && m(this, De).call(this), typeof n.checkValidity == "function" && !n.checkValidity()) {
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
  }), await C(this, be, gd).call(this, r), await this.close();
}, "#handleSubmit"), gd = /* @__PURE__ */ c(async function(n) {
  var a, o, s, l, u, d;
  const i = {
    id: ((a = this.trigger) == null ? void 0 : a.id) ?? Sm(),
    time: n.time ?? "",
    action: n.action ?? ma,
    allowReplayOnRewind: !!n.allowReplayOnRewind,
    data: {}
  };
  N("Persisting trigger from form", {
    sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
    triggerId: i.id,
    existingIndex: this.triggerIndex
  }), Dm(i, n);
  const r = xi(this.scene);
  this.triggerIndex !== null && r[this.triggerIndex] ? r[this.triggerIndex] = i : r.push(i);
  try {
    await Ku(this.scene, r), N("Trigger list saved", {
      sceneId: ((s = this.scene) == null ? void 0 : s.id) ?? null,
      triggerCount: r.length
    });
  } catch (f) {
    throw console.error(`${T} | Failed to save time trigger`, f), (u = (l = ui.notifications) == null ? void 0 : l.error) == null || u.call(
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
      console.error(`${T} | Trigger onSave callback failed`, f), N("Trigger onSave callback failed", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        message: (f == null ? void 0 : f.message) ?? String(f)
      });
    }
}, "#persistTrigger"), c(Qt, "TriggerFormApplication"), ye(Qt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Fe(Qt, Qt, "DEFAULT_OPTIONS"),
  {
    id: `${T}-trigger-form`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Fu = Fe(Qt, Qt, "DEFAULT_OPTIONS")) == null ? void 0 : Fu.classes) ?? [], "standard-form", "themed"])
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
)), ye(Qt, "PARTS", {
  content: {
    template: `modules/${T}/templates/time-trigger-form.html`
  }
});
let Ys = Qt;
function kt(t) {
  return t instanceof HTMLElement ? t : (t == null ? void 0 : t[0]) instanceof HTMLElement ? t[0] : null;
}
c(kt, "asHTMLElement");
function ya(t) {
  return typeof (t == null ? void 0 : t.changeTab) == "function";
}
c(ya, "isAppV2");
function pd(t, e, n, i = {}) {
  if (ya(t)) {
    t.changeTab(e, n, i);
    return;
  }
  if (typeof (t == null ? void 0 : t.activateTab) == "function") {
    const r = { ...i };
    n != null && (r.group = n), r.triggerCallback == null && (r.triggerCallback = !0), t.activateTab(e, r);
  }
}
c(pd, "setActiveTab");
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
function yd(t = {}) {
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
    moduleId: f = "eidolon-utilities",
    tabIcon: h = "fa-solid fa-puzzle-piece"
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
    var W, q, U, J, ae;
    const _ = ((q = (W = foundry == null ? void 0 : foundry.applications) == null ? void 0 : W.sheets) == null ? void 0 : q.SceneConfig) ?? ((U = CONFIG == null ? void 0 : CONFIG.Scene) == null ? void 0 : U.sheetClass);
    if (!_ || !ya({ changeTab: (J = _.prototype) == null ? void 0 : J.changeTab })) return;
    const H = _[Dc] ?? /* @__PURE__ */ new Set();
    if (H.has(e)) return;
    H.add(e), _[Dc] = H;
    const B = (ae = _.TABS) == null ? void 0 : ae.sheet;
    if (B && Array.isArray(B.tabs) && !B.tabs.some((Q) => Q.id === e)) {
      const Q = E({ app: null, scene: null }) ?? e;
      B.tabs.push({
        id: e,
        icon: h,
        label: Q
      });
    }
    _.PARTS && !_.PARTS[e] && (_.PARTS[e] = {
      template: `modules/${f}/templates/scene-config-tab-mount.hbs`,
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
      const U = kt(H) ?? kt(_.element);
      if (!U) {
        g("Missing root element", { tabId: e });
        return;
      }
      ya(_) ? x(_, U, B) : M(_, U, B);
    } finally {
      y();
    }
  }
  c(A, "handleRender");
  function O(_, H, B) {
    var U;
    if (!h) {
      _.textContent = H;
      return;
    }
    const W = (U = _.querySelector("i")) == null ? void 0 : U.cloneNode(!0);
    _.textContent = "";
    const q = W ?? document.createElement("i");
    if (W || (q.className = h, B && (q.inert = !0)), _.append(q, " "), B) {
      const J = document.createElement("span");
      J.textContent = H, _.append(J);
    } else
      _.append(document.createTextNode(H));
  }
  c(O, "setButtonContent");
  function M(_, H, B) {
    var tt, Wt, ze, Le, Ei, Kt, jn, nt, Jt, P, Xr, X, mt, ke, Qi, Qr;
    const q = [
      "nav.sheet-tabs[data-group]",
      "nav.tabs[data-group]",
      "nav.sheet-tabs",
      "nav.tabs"
    ].map((Me) => H.querySelector(Me)).find((Me) => Me instanceof HTMLElement), J = [
      (tt = H.querySelector(".tab[data-tab]")) == null ? void 0 : tt.parentElement,
      H.querySelector(".sheet-body"),
      (ze = (Wt = q == null ? void 0 : q.parentElement) == null ? void 0 : Wt.querySelector) == null ? void 0 : ze.call(Wt, ":scope > .sheet-body"),
      q == null ? void 0 : q.parentElement
    ].find((Me) => Me instanceof HTMLElement), ae = ((Le = q == null ? void 0 : q.dataset) == null ? void 0 : Le.group) ?? ((jn = (Kt = (Ei = q == null ? void 0 : q.querySelector) == null ? void 0 : Ei.call(q, "a[data-group]")) == null ? void 0 : Kt.dataset) == null ? void 0 : jn.group) ?? ((P = (Jt = (nt = q == null ? void 0 : q.querySelector) == null ? void 0 : nt.call(q, "[data-group]")) == null ? void 0 : Jt.dataset) == null ? void 0 : P.group) ?? ((mt = (X = (Xr = J == null ? void 0 : J.querySelector) == null ? void 0 : Xr.call(J, ".tab[data-group]")) == null ? void 0 : X.dataset) == null ? void 0 : mt.group) ?? "main";
    if (!q || !J) {
      g("Missing navigation elements", {
        tabId: e,
        hasNav: !!q,
        hasBody: !!J
      });
      return;
    }
    let Q = q.querySelector(`[data-tab="${e}"]`);
    if (!Q) {
      Q = document.createElement("a"), Q.dataset.action = "tab", Q.dataset.group = ae, Q.dataset.tab = e;
      const Me = q.querySelector("a[data-tab]");
      (ke = Me == null ? void 0 : Me.classList) != null && ke.contains("item") && Q.classList.add("item"), q.appendChild(Q), typeof s == "function" && s({ app: _, button: Q, nav: q, scene: B }), g("Created tab button", { tabId: e, group: ae });
    }
    O(Q, E({ app: _, scene: B }) ?? e, ya(_));
    let te = J.querySelector(`.tab[data-tab="${e}"]`);
    if (!te) {
      te = document.createElement("div"), te.classList.add("tab"), te.dataset.tab = e, te.dataset.group = ae;
      const Me = bd(J);
      J.insertBefore(te, Me ?? null), typeof l == "function" && l({ app: _, tab: te, body: J, scene: B }), g("Created tab container", { tabId: e, group: ae });
    }
    ((Qi = Q.classList) == null ? void 0 : Qi.contains("active")) || te.classList.contains("active") ? (Q.classList.add("active"), te.classList.add("active"), te.removeAttribute("hidden")) : (Q.classList.remove("active"), te.classList.remove("active"), te.setAttribute("hidden", "true"));
    const ft = /* @__PURE__ */ c(() => {
      var Bn, Zi;
      ((Bn = Q.classList) != null && Bn.contains("active") || te.classList.contains("active")) && ((Zi = Q.classList) == null || Zi.add("active"), te.classList.add("active"), te.removeAttribute("hidden"), te.removeAttribute("aria-hidden"), te.style.display === "none" && (te.style.display = ""));
    }, "ensureTabVisible"), xe = /* @__PURE__ */ c(() => {
      ft(), requestAnimationFrame(ft);
    }, "scheduleEnsureTabVisible");
    Q.dataset.eidolonEnsureSceneTabVisibility || (Q.addEventListener("click", () => {
      pd(_, e, ae), requestAnimationFrame(ft);
    }), Q.dataset.eidolonEnsureSceneTabVisibility = "true"), as(_, w, g);
    const et = a({
      app: _,
      scene: B,
      tab: te,
      tabButton: Q,
      ensureTabVisible: ft,
      scheduleEnsureTabVisible: xe
    });
    typeof et == "function" && Pc(_, w, et), typeof u == "function" && u({
      app: _,
      scene: B,
      tab: te,
      tabButton: Q,
      ensureTabVisible: ft,
      scheduleEnsureTabVisible: xe
    }), (Qr = _.setPosition) == null || Qr.call(_, { height: "auto" });
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
    }, "ensureTabVisible"), J = /* @__PURE__ */ c(() => {
      U(), requestAnimationFrame(U);
    }, "scheduleEnsureTabVisible");
    as(_, w, g);
    const ae = a({
      app: _,
      scene: B,
      tab: W,
      tabButton: q,
      ensureTabVisible: U,
      scheduleEnsureTabVisible: J
    });
    typeof ae == "function" && Pc(_, w, ae), typeof u == "function" && u({
      app: _,
      scene: B,
      tab: W,
      tabButton: q,
      ensureTabVisible: U,
      scheduleEnsureTabVisible: J
    });
  }
  c(x, "handleRenderV2");
  function R(_) {
    as(_, w, g);
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
c(yd, "createSceneConfigTabFactory");
function Pc(t, e, n) {
  if (!t || typeof n != "function") return;
  const i = t == null ? void 0 : t[e];
  Array.isArray(i) || (t[e] = []), t[e].push(n);
}
c(Pc, "registerCleanup");
function as(t, e, n) {
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
c(as, "invokeCleanup");
function bd(t) {
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
c(bd, "findFooterElement");
const Gm = Fo(Ys), zm = `modules/${T}/templates/time-trigger-scene-tab.html`, Wm = yd({
  tabId: "time-triggers",
  tabLabel: /* @__PURE__ */ c(() => S("EIDOLON.TimeTrigger.Tab", "Time Triggers"), "tabLabel"),
  getScene: Vt,
  isApplicable: Xm,
  renderContent: /* @__PURE__ */ c(({ app: t, scene: e, tab: n }) => Jm(t, n, e), "renderContent"),
  logger: {
    log: N,
    group: Vi,
    groupEnd: kn
  }
});
function Km() {
  return N("Registering SceneConfig render hook"), Wm.register();
}
c(Km, "registerSceneConfigHook");
function Jm(t, e, n) {
  if (!(e instanceof HTMLElement)) return;
  const i = Ge(n) ? n : Vt(t);
  Fa(t, e, i);
  const r = Xl(() => {
    Fa(t, e, i);
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
c(Jm, "renderTimeTriggerTab");
async function Fa(t, e, n) {
  var r, a;
  const i = n ?? Vt(t);
  Vi("renderTimeTriggersTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!Ge(i)) {
      const W = S(
        "EIDOLON.TimeTrigger.Unavailable",
        "Time triggers are unavailable for this configuration sheet."
      );
      e.innerHTML = `<p class="notes">${W}</p>`, N("Scene lacks document for time triggers", { sceneId: (i == null ? void 0 : i.id) ?? null });
      return;
    }
    const o = `flags.${T}.${Ma}`, s = `flags.${T}.${Ss}`, l = `flags.${T}.${Cs}`, u = !!i.getFlag(T, Ma), d = !!i.getFlag(T, Ss), f = !!i.getFlag(T, Cs), h = xi(i);
    N("Rendering time trigger list", {
      sceneId: i.id,
      isActive: u,
      shouldHideWindow: d,
      shouldShowPlayerWindow: f,
      triggerCount: h.length
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
    ), A = S("EIDOLON.TimeTrigger.AddTrigger", "Add Trigger"), O = S("EIDOLON.TimeTrigger.EditTrigger", "Edit"), M = S("EIDOLON.TimeTrigger.DeleteTrigger", "Remove"), x = S("EIDOLON.TimeTrigger.TriggerNow", "Trigger Now"), R = S("EIDOLON.TimeTrigger.AtLabel", "At"), D = S("EIDOLON.TimeTrigger.DoLabel", "Do"), F = S("EIDOLON.TimeTrigger.MissingTime", "(No time set)"), _ = h.map((W, q) => {
      const ae = (W.time ? qm(W.time) : "") || W.time || "" || F, Q = $m(W.action), te = [
        `${R} ${ae}`,
        `${D} ${Q}`,
        ...xm(W)
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
      B = await H(zm, {
        flags: {
          active: o,
          hideWindow: s,
          showPlayerWindow: l
        },
        states: {
          isActive: u,
          hideWindow: d,
          showPlayerWindow: f
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
    e.innerHTML = B, Ym(t, e, i);
  } finally {
    kn();
  }
}
c(Fa, "renderTimeTriggersTabContent");
function Ym(t, e, n) {
  const i = n ?? Vt(t);
  if (!Ge(i)) return;
  const r = e.querySelector('[data-action="add-trigger"]');
  r && r.addEventListener("click", () => {
    N("Add trigger button clicked", { sceneId: i.id }), Rc(t, { scene: i });
  }), e.querySelectorAll('[data-action="edit-trigger"]').forEach((a) => {
    a.addEventListener("click", () => {
      const o = Number(a.dataset.index);
      if (!Number.isInteger(o)) return;
      const l = xi(i)[o];
      l && (N("Edit trigger button clicked", { sceneId: i.id, triggerId: l.id, index: o }), Rc(t, { trigger: l, triggerIndex: o, scene: i }));
    });
  }), e.querySelectorAll('[data-action="delete-trigger"]').forEach((a) => {
    a.addEventListener("click", async () => {
      var u, d;
      const o = Number(a.dataset.index);
      if (!Number.isInteger(o)) return;
      const s = xi(i), l = s[o];
      if (l) {
        s.splice(o, 1);
        try {
          N("Deleting trigger", {
            sceneId: i.id,
            index: o,
            triggerId: (l == null ? void 0 : l.id) ?? null
          }), await Ku(i, s), await Fa(t, e, i);
        } catch (f) {
          console.error(`${T} | Failed to delete time trigger`, f), (d = (u = ui.notifications) == null ? void 0 : u.error) == null || d.call(
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
      var u, d, f, h, g, p, y;
      const o = Number(a.dataset.index);
      if (!Number.isInteger(o)) return;
      const l = xi(i)[o];
      if (l) {
        if (!((u = game.user) != null && u.isGM)) {
          (f = (d = ui.notifications) == null ? void 0 : d.warn) == null || f.call(
            d,
            S("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time.")
          );
          return;
        }
        try {
          N("Manually firing trigger", { sceneId: i.id, triggerId: l.id, index: o }), await Ju(i, l), (g = (h = ui.notifications) == null ? void 0 : h.info) == null || g.call(
            h,
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
c(Ym, "bindTimeTriggerTabEvents");
function Rc(t, e = {}) {
  var o;
  const n = e.scene ?? null, i = n && Ge(n) ? n : Vt(t);
  if (!Ge(i)) {
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
      s && Fa(t, s, i);
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
const na = new Bs(), Hc = new Us();
function Qm() {
  N("Registering time trigger hooks"), Hooks.once("init", () => {
    Cm(), km(), N("Time trigger settings registered during init");
  }), Km(), N("Scene config hook registered"), Hc.registerHooks(), N("Time automation hooks registered"), Hooks.once("ready", () => {
    Mm(), N("Ready hook fired"), na.onReady(), Hc.initialize();
  }), Hooks.on("canvasReady", (t) => {
    var e;
    N("canvasReady hook received", { scene: ((e = t == null ? void 0 : t.scene) == null ? void 0 : e.id) ?? null }), na.onCanvasReady(t);
  }), Hooks.on("updateScene", (t) => {
    N("updateScene hook received", { scene: (t == null ? void 0 : t.id) ?? null }), na.onUpdateScene(t);
  }), Hooks.on("updateWorldTime", (t, e) => {
    N("updateWorldTime hook received", { worldTime: t, diff: e }), na.onUpdateWorldTime(t, e);
  });
}
c(Qm, "registerTimeTriggerHooks");
Qm();
const Ee = T, vd = "criteria", Zl = "state", Zm = "criteriaVersion", eh = 1, wd = "enableCriteriaSurfaces";
let qc = !1;
function th() {
  var t;
  if (!qc) {
    if (qc = !0, !((t = game == null ? void 0 : game.settings) != null && t.register)) {
      console.warn(`${Ee} | game.settings.register unavailable; scene criteria setting skipped.`);
      return;
    }
    game.settings.register(Ee, wd, {
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
        nh();
      }, "onChange")
    });
  }
}
c(th, "registerSceneCriteriaSettings");
function Do() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return !!game.settings.get(Ee, wd);
  } catch (e) {
    console.error(`${Ee} | Failed to read criteria surfaces setting`, e);
  }
  return !0;
}
c(Do, "getCriteriaSurfacesEnabled");
function nh() {
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
c(nh, "promptReloadForCriteriaSurfaces");
const Da = "Standard";
function dt(t) {
  var n;
  const e = (n = t == null ? void 0 : t.getFlag) == null ? void 0 : n.call(t, Ee, vd);
  return e ? Ed(e) : [];
}
c(dt, "getSceneCriteria");
async function Po(t, e) {
  if (!(t != null && t.setFlag)) return;
  const n = Ed(e);
  await t.setFlag(Ee, vd, n), await t.setFlag(Ee, Zm, eh);
  const i = Wr(t, n);
  await t.setFlag(Ee, Zl, i);
}
c(Po, "setSceneCriteria");
function Wr(t, e = null) {
  var r;
  const n = Array.isArray(e) ? e : dt(t), i = Ut(((r = t == null ? void 0 : t.getFlag) == null ? void 0 : r.call(t, Ee, Zl)) ?? {});
  return tc(i, n);
}
c(Wr, "getSceneCriteriaState");
async function ih(t, e, n = null) {
  if (!(t != null && t.setFlag)) return;
  const i = Array.isArray(n) ? n : dt(t), r = tc(e, i);
  await t.setFlag(Ee, Zl, r);
}
c(ih, "setSceneCriteriaState");
function ec(t = "") {
  const e = typeof t == "string" ? t.trim() : "", n = Sd(Zs(e || "criterion"), /* @__PURE__ */ new Set());
  return {
    id: Cd(),
    key: n,
    label: e,
    values: [Da],
    default: Da,
    order: 0
  };
}
c(ec, "createSceneCriterion");
function Ed(t) {
  const e = Array.isArray(t) ? Ut(t) : [], n = [], i = /* @__PURE__ */ new Set();
  return e.forEach((r, a) => {
    const o = Qs(r, a, i);
    o && (n.push(o), i.add(o.key));
  }), n;
}
c(Ed, "sanitizeCriteria$1");
function Qs(t, e = 0, n = /* @__PURE__ */ new Set()) {
  if (!t || typeof t != "object") return null;
  const i = typeof t.id == "string" && t.id.trim() ? t.id.trim() : Cd(), a = (typeof t.label == "string" ? t.label : typeof t.name == "string" ? t.name : "").trim(), o = typeof t.key == "string" && t.key.trim() ? Zs(t.key) : Zs(a || `criterion-${Number(e) + 1}`), s = Sd(o, n), l = ah(t.values);
  let u = typeof t.default == "string" ? t.default.trim() : "";
  u || (u = l[0] ?? Da), l.includes(u) || l.unshift(u);
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
c(Qs, "sanitizeCriterion");
function tc(t, e = []) {
  const n = t && typeof t == "object" ? Ut(t) : {}, i = {};
  for (const r of e) {
    const a = n == null ? void 0 : n[r.key], o = typeof a == "string" ? a.trim() : "";
    o && r.values.includes(o) ? i[r.key] = o : i[r.key] = r.default;
  }
  return i;
}
c(tc, "sanitizeSceneCriteriaState");
function rh(t) {
  return dt(t).map((n) => ({
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
  return n.length || n.push(Da), n;
}
c(ah, "sanitizeCriterionValues");
function Zs(t) {
  return String(t ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
c(Zs, "slugifyCriterionKey");
function Sd(t, e) {
  if (!e.has(t)) return t;
  let n = 2;
  for (; e.has(`${t}-${n}`); )
    n += 1;
  return `${t}-${n}`;
}
c(Sd, "ensureUniqueCriterionKey");
function Cd() {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 11);
}
c(Cd, "generateCriterionId");
function Td(t) {
  var e, n;
  console.error(`${Ee} | Failed to persist scene criteria`, t), (n = (e = ui.notifications) == null ? void 0 : e.error) == null || n.call(
    e,
    S(
      "EIDOLON.SceneCriteria.PersistError",
      "Failed to persist the scene criteria."
    )
  );
}
c(Td, "notifyPersistError");
var Du, me, rn, $e, Ld, Lo, Io, Oo, Ao, ba, ko, kr, Mr, ar, Id;
const Zt = class Zt extends qn(Hn) {
  constructor(n = {}) {
    const { scene: i, criterion: r, isNew: a, onSave: o, ...s } = n ?? {};
    super(s);
    k(this, $e);
    k(this, me, null);
    k(this, rn, !1);
    k(this, Lo, /* @__PURE__ */ c(async (n) => {
      n.preventDefault();
      const i = n.currentTarget;
      if (!(i instanceof HTMLFormElement)) return;
      const r = new FormData(i), a = String(r.get("criterionLabel") ?? "").trim(), o = String(r.get("criterionKey") ?? "").trim(), s = Array.from(i.querySelectorAll('[name="criterionValues"]')).map((f) => f instanceof HTMLInputElement ? f.value.trim() : "").filter((f, h, g) => f && g.indexOf(f) === h), u = String(r.get("criterionDefault") ?? "").trim() || s[0] || "Standard", d = Qs(
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
      d && (I(this, me, d), await C(this, $e, Id).call(this), this.close());
    }, "#onSubmit"));
    k(this, Io, /* @__PURE__ */ c((n) => {
      var o;
      if (m(this, rn)) return;
      const i = n.currentTarget, r = (i == null ? void 0 : i.form) ?? ((o = this.element) == null ? void 0 : o.querySelector("form"));
      if (!(r instanceof HTMLFormElement)) return;
      const a = r.querySelector('input[name="criterionKey"]');
      a instanceof HTMLInputElement && (a.value = nr(i.value));
    }, "#onLabelInput"));
    k(this, Oo, /* @__PURE__ */ c((n) => {
      var l;
      const i = n.currentTarget, r = (i == null ? void 0 : i.form) ?? ((l = this.element) == null ? void 0 : l.querySelector("form"));
      if (!(r instanceof HTMLFormElement) || !(i instanceof HTMLInputElement)) return;
      const a = r.querySelector('input[name="criterionLabel"]'), o = nr(a instanceof HTMLInputElement ? a.value : ""), s = nr(i.value);
      I(this, rn, s !== o), i.value = s, C(this, $e, ba).call(this, r);
    }, "#onKeyInput"));
    k(this, Ao, /* @__PURE__ */ c((n) => {
      var o, s;
      n.preventDefault();
      const i = ((o = n.currentTarget) == null ? void 0 : o.form) ?? ((s = this.element) == null ? void 0 : s.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector('input[name="criterionLabel"]'), a = i.querySelector('input[name="criterionKey"]');
      a instanceof HTMLInputElement && (a.value = nr(r instanceof HTMLInputElement ? r.value : ""), I(this, rn, !1), C(this, $e, ba).call(this, i));
    }, "#onResetAutoKey"));
    k(this, ko, /* @__PURE__ */ c((n) => {
      var l, u, d, f, h, g;
      n.preventDefault();
      const i = ((l = n.currentTarget) == null ? void 0 : l.form) ?? ((u = this.element) == null ? void 0 : u.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector(".scene-criterion-editor__values");
      if (!(r instanceof HTMLElement)) return;
      (d = r.querySelector(".scene-criterion-editor__empty")) == null || d.remove();
      const a = document.createElement("div");
      a.classList.add("scene-criterion-editor__value");
      const o = Ot(S("EIDOLON.SceneCriteria.ValuePlaceholder", "Allowed value")), s = Ot(S("EIDOLON.SceneCriteria.RemoveValue", "Remove Value"));
      a.innerHTML = `
      <input type="text" name="criterionValues" value="" placeholder="${o}" class="form-control">
      <button type="button" class="icon" data-action="remove-value" aria-label="${s}" title="${s}">
        <i class="fa-solid fa-trash"></i>
      </button>
    `, r.appendChild(a), (f = a.querySelector('[data-action="remove-value"]')) == null || f.addEventListener("click", m(this, kr)), (h = a.querySelector('input[name="criterionValues"]')) == null || h.addEventListener("input", m(this, Mr)), C(this, $e, ar).call(this, i), (g = a.querySelector('input[name="criterionValues"]')) == null || g.focus();
    }, "#onAddValue"));
    k(this, kr, /* @__PURE__ */ c((n) => {
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
        C(this, $e, ar).call(this, i);
      }
    }, "#onRemoveValue"));
    k(this, Mr, /* @__PURE__ */ c((n) => {
      var r, a;
      const i = ((r = n.currentTarget) == null ? void 0 : r.form) ?? ((a = this.element) == null ? void 0 : a.querySelector("form"));
      i instanceof HTMLFormElement && C(this, $e, ar).call(this, i);
    }, "#onValuesChanged"));
    this.scene = i ?? null, this.criterion = r ?? null, this.onSave = typeof o == "function" ? o : null, this.isNew = !!a, I(this, me, C(this, $e, Ld).call(this)), I(this, rn, m(this, me).key !== nr(m(this, me).label));
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
      keyIsCustom: m(this, rn)
    };
  }
  _onRender(n, i) {
    var a, o, s, l, u, d;
    super._onRender(n, i);
    const r = (a = this.element) == null ? void 0 : a.querySelector("form");
    r && (r.addEventListener("submit", m(this, Lo)), (o = r.querySelector('[data-action="add-value"]')) == null || o.addEventListener("click", m(this, ko)), (s = r.querySelector('input[name="criterionLabel"]')) == null || s.addEventListener("input", m(this, Io)), (l = r.querySelector('input[name="criterionKey"]')) == null || l.addEventListener("input", m(this, Oo)), (u = r.querySelector('[data-action="reset-auto-key"]')) == null || u.addEventListener("click", m(this, Ao)), r.querySelectorAll('[data-action="remove-value"]').forEach((f) => {
      f.addEventListener("click", m(this, kr));
    }), r.querySelectorAll('input[name="criterionValues"]').forEach((f) => {
      f.addEventListener("input", m(this, Mr));
    }), (d = r.querySelector('[data-action="cancel"]')) == null || d.addEventListener("click", (f) => {
      f.preventDefault(), this.close();
    }), C(this, $e, ba).call(this, r), C(this, $e, ar).call(this, r));
  }
};
me = new WeakMap(), rn = new WeakMap(), $e = new WeakSet(), Ld = /* @__PURE__ */ c(function() {
  const n = Qs(this.criterion, 0, /* @__PURE__ */ new Set()) ?? ec(S("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion"));
  return {
    id: n.id,
    key: n.key,
    label: n.label ?? "",
    values: Array.isArray(n.values) ? [...n.values] : [],
    default: n.default
  };
}, "#initializeState"), Lo = new WeakMap(), Io = new WeakMap(), Oo = new WeakMap(), Ao = new WeakMap(), ba = /* @__PURE__ */ c(function(n) {
  const i = n.querySelector('[data-action="reset-auto-key"]');
  i instanceof HTMLButtonElement && (i.disabled = !m(this, rn));
}, "#syncAutoKeyButton"), ko = new WeakMap(), kr = new WeakMap(), Mr = new WeakMap(), ar = /* @__PURE__ */ c(function(n) {
  var l, u;
  const i = n.querySelector('select[name="criterionDefault"]');
  if (!(i instanceof HTMLSelectElement)) return;
  const r = ((u = (l = i.value) == null ? void 0 : l.trim) == null ? void 0 : u.call(l)) ?? "", a = Array.from(n.querySelectorAll('input[name="criterionValues"]')).map((d) => d instanceof HTMLInputElement ? d.value.trim() : "").filter((d, f, h) => d && h.indexOf(d) === f), o = i.dataset.emptyLabel || S("EIDOLON.SceneCriteria.ValueListEmpty", "No values have been added to this criterion.");
  if (i.innerHTML = "", !a.length) {
    const d = document.createElement("option");
    d.value = "", d.textContent = o, d.selected = !0, i.appendChild(d);
    return;
  }
  const s = a.includes(r) ? r : a[0];
  for (const d of a) {
    const f = document.createElement("option");
    f.value = d, f.textContent = d, f.selected = d === s, i.appendChild(f);
  }
}, "#syncDefaultOptions"), Id = /* @__PURE__ */ c(async function() {
  if (!this.scene) return;
  const n = dt(this.scene).sort((r, a) => r.order - a.order), i = n.findIndex((r) => r.id === m(this, me).id);
  i < 0 ? (m(this, me).order = n.length, n.push(m(this, me))) : (m(this, me).order = n[i].order, n.splice(i, 1, m(this, me)));
  try {
    await Po(this.scene, n), this.onSave && await this.onSave(m(this, me));
  } catch (r) {
    Td(r);
  }
}, "#persist"), c(Zt, "CategoryEditorApplication"), ye(Zt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Fe(Zt, Zt, "DEFAULT_OPTIONS"),
  {
    id: `${Ee}-criterion-editor`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Du = Fe(Zt, Zt, "DEFAULT_OPTIONS")) == null ? void 0 : Du.classes) ?? [], "standard-form", "themed"])
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
)), ye(Zt, "PARTS", {
  content: {
    template: `modules/${Ee}/templates/scene-criteria-editor.html`
  }
});
let el = Zt;
function nr(t) {
  return String(t ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
c(nr, "slugifyKey");
const oh = `modules/${Ee}/templates/scene-criteria-tab.html`, tl = {
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
}, sh = Fo(el), lh = yd({
  tabId: "criteria",
  tabLabel: /* @__PURE__ */ c(() => S("EIDOLON.SceneCriteria.TabLabel", "Criteria"), "tabLabel"),
  getScene: Vt,
  isApplicable: /* @__PURE__ */ c(() => Do(), "isApplicable"),
  renderContent: /* @__PURE__ */ c(({ app: t, tab: e, scene: n }) => uh(t, e, n), "renderContent"),
  logger: tl
});
function ch() {
  return lh.register();
}
c(ch, "registerSceneCriteriaConfigHook");
function uh(t, e, n) {
  if (!(e instanceof HTMLElement)) return;
  const i = Ge(n) ? n : Vt(t);
  Ii(t, e, i);
}
c(uh, "renderCriteriaTab");
async function Ii(t, e, n) {
  var r, a;
  const i = n ?? Vt(t);
  tl.group("renderCriteriaTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!Ge(i)) {
      const d = S(
        "EIDOLON.SceneCriteria.Unavailable",
        "Scene criteria are unavailable for this configuration sheet."
      );
      e.innerHTML = `<p class="notes">${d}</p>`;
      return;
    }
    const o = dt(i).sort((d, f) => d.order - f.order), s = Wr(i, o), l = ((a = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : a.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof l != "function") {
      e.innerHTML = `<p class="notes">${S("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
      return;
    }
    const u = await l(oh, {
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
        valueCount: o.reduce((d, f) => d + f.values.length, 0)
      },
      criteria: o.map((d, f) => {
        var h, g;
        return {
          id: d.id,
          label: d.label,
          displayName: ((g = (h = d.label) == null ? void 0 : h.trim) == null ? void 0 : g.call(h)) || S("EIDOLON.SceneCriteria.UnnamedCategory", "Unnamed Criterion"),
          hasValues: d.values.length > 0,
          values: d.values.map((p) => ({
            value: p,
            isCurrent: (s[d.key] ?? d.default) === p
          })),
          valueCountLabel: fh(d.values.length),
          canMoveUp: f > 0,
          canMoveDown: f < o.length - 1
        };
      }),
      hasCriteria: o.length > 0
    });
    e.innerHTML = u, dh(t, e, i);
  } catch (o) {
    console.error(`${Ee} | Failed to render criteria tab`, o), e.innerHTML = `<p class="notes">${S("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
  } finally {
    tl.groupEnd();
  }
}
c(Ii, "renderCriteriaTabContent");
function dh(t, e, n) {
  const i = n ?? Vt(t);
  if (!Ge(i)) return;
  const r = e.querySelector('[data-criteria-action="add"]');
  r && r.addEventListener("click", () => {
    jc(t, {
      scene: i,
      criterion: ec(
        S("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion")
      ),
      isNew: !0,
      onSave: /* @__PURE__ */ c(() => Ii(t, e, i), "onSave")
    });
  }), e.querySelectorAll('[data-criteria-action="edit"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", () => {
      const s = dt(i).find((l) => l.id === o);
      s && jc(t, {
        scene: i,
        criterion: s,
        onSave: /* @__PURE__ */ c(() => Ii(t, e, i), "onSave")
      });
    });
  }), e.querySelectorAll('[data-criteria-action="remove"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await os(i, (l) => {
        const u = l.findIndex((d) => d.id === o);
        return u < 0 ? !1 : (l.splice(u, 1), ss(l), !0);
      }) && await Ii(t, e, i);
    });
  }), e.querySelectorAll('[data-criteria-action="move-up"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await os(i, (l) => {
        const u = l.findIndex((f) => f.id === o);
        if (u <= 0) return !1;
        const [d] = l.splice(u, 1);
        return l.splice(u - 1, 0, d), ss(l), !0;
      }) && await Ii(t, e, i);
    });
  }), e.querySelectorAll('[data-criteria-action="move-down"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await os(i, (l) => {
        const u = l.findIndex((f) => f.id === o);
        if (u < 0 || u >= l.length - 1) return !1;
        const [d] = l.splice(u, 1);
        return l.splice(u + 1, 0, d), ss(l), !0;
      }) && await Ii(t, e, i);
    });
  });
}
c(dh, "bindCriteriaTabEvents");
async function os(t, e) {
  const n = dt(t).sort((r, a) => r.order - a.order);
  if (e(n) === !1) return !1;
  try {
    return await Po(t, n), !0;
  } catch (r) {
    return Td(r), !1;
  }
}
c(os, "mutateCriteria");
function jc(t, e = {}) {
  const n = e.scene ?? null, i = n && Ge(n) ? n : Vt(t);
  if (!Ge(i))
    return;
  sh({
    scene: i,
    criterion: e.criterion ?? null,
    isNew: !!e.isNew,
    onSave: typeof e.onSave == "function" ? e.onSave : null
  }).render({ force: !0 });
}
c(jc, "openCriterionEditor");
function ss(t) {
  t.forEach((e, n) => {
    e.order = n;
  });
}
c(ss, "reindexCriteriaOrder");
function fh(t) {
  var e, n;
  if ((n = (e = game.i18n) == null ? void 0 : e.has) != null && n.call(e, "EIDOLON.SceneCriteria.ValueCountLabel"))
    try {
      return game.i18n.format("EIDOLON.SceneCriteria.ValueCountLabel", { count: t });
    } catch (i) {
      console.error(`${Ee} | Failed to format value count label`, i);
    }
  return t === 0 ? "No values configured" : t === 1 ? "1 value" : `${t} values`;
}
c(fh, "formatValueCount");
let Bc = !1;
function mh() {
  Hooks.once("init", () => {
    th();
  }), Hooks.once("ready", () => {
    Do() && (Bc || (ch(), Bc = !0));
  });
}
c(mh, "registerSceneCriteriaHooks");
mh();
const ie = T, Od = "criteriaEngineVersion", ci = "fileIndex", di = "tileCriteria", nc = {
  LEGACY: 1,
  CRITERIA: 2
}, Ad = nc.CRITERIA;
function kd(t) {
  var e;
  return ((e = t == null ? void 0 : t.getFlag) == null ? void 0 : e.call(t, ie, Od)) ?? nc.LEGACY;
}
c(kd, "getSceneEngineVersion");
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
function va(t) {
  return t && typeof t == "object" && !Array.isArray(t);
}
c(va, "isPlainObject$2");
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
    if (!va(i == null ? void 0 : i[n[r]])) return;
    i = i[n[r]];
  }
  delete i[n.at(-1)];
}
c(ph, "deletePath");
function Md(t, e) {
  const n = Vc(t ?? {});
  if (!va(e)) return n;
  for (const [i, r] of Object.entries(e)) {
    if (i.startsWith("-=") && r === !0) {
      ph(n, i.slice(2));
      continue;
    }
    va(r) && va(n[i]) ? n[i] = Md(n[i], r) : n[i] = Vc(r);
  }
  return n;
}
c(Md, "fallbackMerge");
function yh(t, e) {
  var n, i;
  return (n = foundry == null ? void 0 : foundry.utils) != null && n.mergeObject && ((i = foundry == null ? void 0 : foundry.utils) != null && i.deepClone) ? foundry.utils.mergeObject(t, foundry.utils.deepClone(e), {
    inplace: !1
  }) : Md(t, e);
}
c(yh, "defaultMerge");
function bh(t, e) {
  if (!t) return !0;
  for (const n of Object.keys(t))
    if (t[n] !== e[n]) return !1;
  return !0;
}
c(bh, "criteriaMatch");
function Nd(t, e, n, i) {
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
c(Nd, "resolveRules");
function Ro(t = null) {
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
c(Ro, "canManageCriteria");
function vh(t = null) {
  if (!Ro(t))
    throw new Error(`${ie} | You do not have permission to manage scene criteria.`);
}
c(vh, "requireCriteriaAccess");
const wh = /* @__PURE__ */ c((...t) => console.log(`${ie} | criteria tiles:`, ...t), "log$1");
let Pa = /* @__PURE__ */ new WeakMap(), Ra = /* @__PURE__ */ new WeakMap();
const Gc = 200;
function Eh(t) {
  return t ? Number.isInteger(t.size) ? t.size : Array.isArray(t) || typeof t.length == "number" ? t.length : Array.from(t).length : 0;
}
c(Eh, "getCollectionSize$1");
function ia() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
c(ia, "nowMs$2");
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
  const e = pi(t, { files: null });
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
    const a = r.getFlag(ie, di) ?? r.getFlag(ie, ci);
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
  const n = Ra.get(t);
  if ((n == null ? void 0 : n.collection) === e) return n;
  const i = Ih(t, e);
  return Ra.set(t, i), i;
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
function _d(t) {
  return typeof (t == null ? void 0 : t.name) == "string" ? t.name : typeof (t == null ? void 0 : t.src) == "string" ? t.src : "";
}
c(_d, "getFilePath");
function Ha(t) {
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
c(Ha, "normalizeFilePath");
function ic(t) {
  if (!Array.isArray(t)) return [];
  const e = /* @__PURE__ */ new Map();
  return t.map((n, i) => {
    const r = Ha(_d(n)), a = r || `__index:${i}`, o = e.get(a) ?? 0;
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
c(ic, "buildTileFileEntries");
function Fn(t, e) {
  if (!Number.isInteger(e) || e < 0) return null;
  const i = ic(t).find((r) => r.index === e);
  return i ? { ...i.target } : { indexHint: e };
}
c(Fn, "createTileTargetFromIndex");
function Ho(t) {
  if (!t || typeof t != "object") return null;
  const e = Ha(t.path), n = Number(t.indexHint ?? t.fileIndex), i = Number(t.occurrence), r = {};
  return e && (r.path = e, r.occurrence = Number.isInteger(i) && i >= 0 ? i : 0), Number.isInteger(n) && n >= 0 && (r.indexHint = n), !r.path && !Number.isInteger(r.indexHint) ? null : r;
}
c(Ho, "normalizeTileTarget");
function wr(t, e) {
  const n = Ho(t);
  if (!n) return -1;
  const i = ic(e);
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
c(wr, "resolveTileTargetIndex");
function Dn(t) {
  if (!t || typeof t != "object" || Array.isArray(t)) return {};
  const e = {};
  for (const [n, i] of Object.entries(t))
    typeof n != "string" || !n || typeof i != "string" || !i.trim() || (e[n] = i.trim());
  return e;
}
c(Dn, "sanitizeCriteria");
function kh(t) {
  return Object.entries(Dn(t)).sort(([n], [i]) => n.localeCompare(i)).map(([n, i]) => `${n}=${i}`).join("");
}
c(kh, "serializeCriteria");
function Mh(t) {
  return Object.keys(Dn(t)).length;
}
c(Mh, "getCriteriaSpecificity");
function Nh(t, e) {
  const n = Dn(t), i = Dn(e);
  for (const [r, a] of Object.entries(n))
    if (r in i && i[r] !== a)
      return !1;
  return !0;
}
c(Nh, "areCriteriaCompatible");
function _h(t, e) {
  const n = wr(t, e);
  if (Number.isInteger(n) && n >= 0)
    return `index:${n}`;
  const i = Ho(t);
  if (!i) return "";
  if (i.path) {
    const r = Number.isInteger(i.occurrence) ? i.occurrence : 0;
    return `path:${i.path}#${r}`;
  }
  return Number.isInteger(i.indexHint) ? `hint:${i.indexHint}` : "";
}
c(_h, "getTargetIdentity");
function $d(t, e = {}) {
  var s;
  const n = Array.isArray(e.files) ? e.files : [], i = pi(t, { files: n });
  if (!((s = i == null ? void 0 : i.variants) != null && s.length))
    return {
      errors: [],
      warnings: []
    };
  const r = i.variants.map((l, u) => ({
    index: u,
    criteria: Dn(l.criteria),
    specificity: Mh(l.criteria),
    criteriaSignature: kh(l.criteria),
    targetIdentity: _h(l.target, n)
  })), a = [], o = [];
  for (let l = 0; l < r.length; l += 1) {
    const u = r[l];
    for (let d = l + 1; d < r.length; d += 1) {
      const f = r[d];
      if (u.specificity !== f.specificity || !Nh(u.criteria, f.criteria)) continue;
      if (!(!!u.targetIdentity && u.targetIdentity === f.targetIdentity)) {
        a.push({
          leftIndex: u.index,
          rightIndex: f.index,
          type: u.criteriaSignature === f.criteriaSignature ? "equivalent" : "overlap",
          specificity: u.specificity
        });
        continue;
      }
      u.criteriaSignature === f.criteriaSignature && o.push({
        leftIndex: u.index,
        rightIndex: f.index,
        type: "duplicate"
      });
    }
  }
  return {
    errors: a,
    warnings: o
  };
}
c($d, "detectTileCriteriaConflicts");
function $h(t, e) {
  if (!t || typeof t != "object") return null;
  let n = Ho(t.target);
  if (!n) {
    const i = Number(t.fileIndex);
    Number.isInteger(i) && i >= 0 && (n = Fn(e, i));
  }
  return n ? {
    criteria: Dn(t.criteria),
    target: n
  } : null;
}
c($h, "normalizeTileVariant");
function xd(t, e = {}) {
  if (!Array.isArray(t) || t.length === 0) return null;
  const n = Array.isArray(e.files) ? e.files : null, i = t.map((l, u) => ({
    criteria: Dn(l),
    target: Fn(n, u)
  })).filter((l) => l.target);
  if (!i.length) return null;
  const r = i.find((l) => Object.keys(l.criteria).length === 0), a = (r == null ? void 0 : r.target) ?? i[0].target;
  let o = null;
  const s = Number(e.defaultFileIndex);
  return Number.isInteger(s) && s >= 0 && (o = Fn(n, s)), o || (o = a), {
    strategy: "select-one",
    variants: i,
    defaultTarget: o
  };
}
c(xd, "buildTileCriteriaFromFileIndex");
function pi(t, e = {}) {
  const n = Array.isArray(e.files) ? e.files : null;
  if (Array.isArray(t))
    return xd(t, { files: n });
  if (!t || typeof t != "object") return null;
  const i = Array.isArray(t.variants) ? t.variants.map((a) => $h(a, n)).filter(Boolean) : [];
  if (!i.length) return null;
  let r = Ho(t.defaultTarget);
  if (!r) {
    const a = Number(t.defaultFileIndex);
    Number.isInteger(a) && a >= 0 && (r = Fn(n, a));
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
c(pi, "normalizeTileCriteria");
function xh(t, e) {
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
c(xh, "selectTileFileIndexFromCompiled");
function Fh(t, e) {
  const n = pi(t, { files: e });
  if (!n) return null;
  const i = n.variants.map((a) => {
    const o = Dn(a.criteria), s = wr(a.target, e);
    return !Number.isInteger(s) || s < 0 ? null : {
      criteria: o,
      keys: Object.keys(o),
      targetIndex: s
    };
  }).filter(Boolean), r = wr(n.defaultTarget, e);
  return !i.length && (!Number.isInteger(r) || r < 0) ? null : {
    variants: i,
    defaultIndex: r
  };
}
c(Fh, "compileTileMatcher");
function Dh(t, e, n) {
  const i = Pa.get(t);
  if (i && i.tileCriteria === e && i.files === n)
    return i.compiled;
  const r = Fh(e, n);
  return Pa.set(t, {
    tileCriteria: e,
    files: n,
    compiled: r
  }), r;
}
c(Dh, "getCompiledTileMatcher");
function Ph(t = null, e = null) {
  t ? Ra.delete(t) : Ra = /* @__PURE__ */ new WeakMap(), e ? Pa.delete(e) : t || (Pa = /* @__PURE__ */ new WeakMap());
}
c(Ph, "invalidateTileCriteriaCaches");
async function Fd(t, e, n = {}) {
  var l, u, d, f;
  const i = ia(), r = {
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
    return r.durationMs = ia() - i, r;
  const a = e.getEmbeddedCollection("Tile") ?? [];
  r.total = Eh(a);
  const o = Ah(e, a, n.changedKeys);
  if (r.scanned = o.length, !o.length)
    return r.skipped.unaffected = r.total, r.durationMs = ia() - i, r;
  const s = [];
  for (const h of o) {
    const g = h.getFlag(ie, di) ?? h.getFlag(ie, ci);
    if (!g) {
      r.skipped.noCriteria += 1;
      continue;
    }
    const p = h.getFlag("monks-active-tiles", "files");
    if (!(p != null && p.length)) {
      r.skipped.noFiles += 1;
      continue;
    }
    const y = Dh(h, g, p), w = xh(y, t);
    if (!Number.isInteger(w) || w < 0 || w >= p.length) {
      console.warn(`${ie} | Tile ${h.id} has no valid file match for state`, t), r.skipped.noMatch += 1;
      continue;
    }
    const v = w + 1, E = Number(h.getFlag("monks-active-tiles", "fileindex")) !== v, L = p.some((D, F) => !!(D != null && D.selected) != (F === w)), A = Ha(((u = h.texture) == null ? void 0 : u.src) ?? ((f = (d = h._source) == null ? void 0 : d.texture) == null ? void 0 : f.src) ?? ""), O = _d(p[w]), M = Ha(O), x = !!M && M !== A;
    if (!L && !E && !x) {
      r.skipped.unchanged += 1;
      continue;
    }
    const R = {
      _id: h._id
    };
    L && (R["flags.monks-active-tiles.files"] = p.map((D, F) => ({
      ...D,
      selected: F === w
    }))), E && (R["flags.monks-active-tiles.fileindex"] = v), x && (R.texture = { src: O }), s.push(R), wh(`Tile ${h.id} -> ${O}`);
  }
  return s.length > 0 && (r.chunks = await Th(e, s, n.chunkSize), r.updated = s.length), r.durationMs = ia() - i, r;
}
c(Fd, "updateTiles");
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
const fi = T, Fi = "lightCriteria", rc = Object.freeze({
  base: null,
  mappings: [],
  current: null
});
function ls(t) {
  return t && typeof t == "object" && !Array.isArray(t);
}
c(ls, "isPlainObject$1");
function Dd(t, e) {
  if (!ls(e)) return {};
  const n = {};
  for (const [i, r] of Object.entries(e)) {
    const a = t == null ? void 0 : t[i];
    if (ls(r) && ls(a)) {
      const o = Dd(a, r);
      Object.keys(o).length > 0 && (n[i] = o);
    } else r !== a && (n[i] = Ut(r));
  }
  return n;
}
c(Dd, "computeDelta");
function Pd(t) {
  var n;
  const e = ((n = t == null ? void 0 : t.getFlag) == null ? void 0 : n.call(t, fi, Fi)) ?? rc;
  return Er(e);
}
c(Pd, "getLightCriteriaState");
async function Rd(t, e) {
  const n = Er(e);
  if (!(t != null && t.setFlag))
    return n;
  const i = n.base !== null, r = n.mappings.length > 0, a = n.current !== null;
  return !i && !r && !a ? (typeof t.unsetFlag == "function" ? await t.unsetFlag(fi, Fi) : await t.setFlag(fi, Fi, null), rc) : (await t.setFlag(fi, Fi, n), n);
}
c(Rd, "setLightCriteriaState");
async function Kr(t, e) {
  if (typeof e != "function")
    throw new TypeError("updateLightCriteriaState requires an updater function.");
  const n = Ut(Pd(t)), i = await e(n);
  return Rd(t, i);
}
c(Kr, "updateLightCriteriaState");
async function zc(t, e) {
  const n = yi(e);
  if (!n)
    throw new Error("Invalid light configuration payload.");
  return Kr(t, (i) => ({
    ...i,
    base: n
  }));
}
c(zc, "storeBaseLighting");
async function Wc(t, e, n, { label: i } = {}) {
  const r = Jr(e);
  if (!r)
    throw new Error("Cannot create a mapping without at least one category selection.");
  const a = yi(n);
  if (!a)
    throw new Error("Invalid light configuration payload.");
  return Kr(t, (o) => {
    const s = Xi(r), l = Array.isArray(o == null ? void 0 : o.mappings) ? [...o.mappings] : [], u = l.findIndex((g) => (g == null ? void 0 : g.key) === s), d = u >= 0 ? l[u] : null, f = typeof (d == null ? void 0 : d.id) == "string" && d.id.trim() ? d.id.trim() : qd(), h = qo({
      id: f,
      categories: r,
      config: a,
      label: typeof i == "string" ? i : (d == null ? void 0 : d.label) ?? null,
      updatedAt: Date.now()
    });
    if (!h)
      throw new Error("Failed to sanitize criteria mapping entry.");
    return u >= 0 ? l[u] = h : l.push(h), {
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
  const o = Jr(n);
  if (!o)
    throw new Error("Cannot retarget mapping without at least one category selection.");
  const s = yi(i);
  if (!s)
    throw new Error("Invalid light configuration payload.");
  return Kr(t, (l) => {
    const u = Array.isArray(l == null ? void 0 : l.mappings) ? [...l.mappings] : [], d = u.findIndex((v) => (v == null ? void 0 : v.id) === a);
    if (d < 0)
      throw new Error("The selected mapping no longer exists.");
    const f = Xi(o), h = u.findIndex(
      (v, b) => b !== d && (v == null ? void 0 : v.key) === f
    );
    if (h >= 0 && !r)
      throw new Error("A mapping already exists for the selected criteria.");
    const g = u[d], p = qo({
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
    if (h >= 0) {
      const [v] = u.splice(h, 1);
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
c(Hh, "retargetLightCriteriaMapping");
async function qh(t, e) {
  const n = typeof e == "string" ? e.trim() : "";
  if (!n)
    throw new Error("A mapping id is required to remove a mapping.");
  return Kr(t, (i) => {
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
async function dr(t, e) {
  const n = Hd(e);
  return Kr(t, (i) => ({
    ...i,
    current: n
  }));
}
c(dr, "storeCurrentCriteriaSelection");
function jh(t) {
  const e = Er(t), n = e.base ?? {}, i = [];
  for (const r of e.mappings) {
    const a = Jr(r == null ? void 0 : r.categories);
    if (!a) continue;
    const o = Dd(n, (r == null ? void 0 : r.config) ?? {});
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
  const r = Er(t), a = /* @__PURE__ */ c((l) => {
    const u = {};
    for (const [d, f] of Object.entries(l ?? {})) {
      const h = String(d ?? "").trim(), g = typeof f == "string" ? f.trim() : "";
      if (!h || !g) continue;
      if (i.has(h)) {
        u[h] = g;
        continue;
      }
      const p = n.get(h);
      p && (u[p] = g);
    }
    return Object.keys(u).length ? u : null;
  }, "remapCategories"), o = r.mappings.map((l) => {
    const u = a(l.categories);
    return u ? qo({
      ...l,
      categories: u,
      key: Xi(u)
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
  return Er({
    ...r,
    mappings: o,
    current: s
  });
}
c(Bh, "migrateLightCriteriaCategoriesToKeys");
function Er(t) {
  var l;
  const e = Ut(t);
  if (!e || typeof e != "object")
    return Ut(rc);
  const n = yi(e.base), i = Array.isArray(e.mappings) ? e.mappings : [], r = /* @__PURE__ */ new Map();
  for (const u of i) {
    const d = qo(u);
    d && r.set(d.key, d);
  }
  const a = Array.from(r.values()), o = new Map(a.map((u) => [u.id, u]));
  let s = Hd(e.current);
  if (s) {
    const u = s.categories && Object.keys(s.categories).length > 0;
    if (s.mappingId && !o.has(s.mappingId)) {
      const d = u ? ((l = a.find((f) => f.key === Xi(s.categories))) == null ? void 0 : l.id) ?? null : null;
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
c(Er, "sanitizeLightCriteriaState");
function yi(t) {
  const e = Ut(t);
  if (!e || typeof e != "object") return null;
  "_id" in e && delete e._id, "id" in e && delete e.id;
  const n = e.flags;
  if (n && typeof n == "object") {
    const i = n[fi];
    i && typeof i == "object" && (delete i[Fi], Object.keys(i).length === 0 && delete n[fi]), Object.keys(n).length === 0 && delete e.flags;
  }
  return e;
}
c(yi, "sanitizeLightConfigPayload");
function qo(t) {
  if (!t || typeof t != "object") return null;
  const e = Jr(t.categories);
  if (!e) return null;
  const n = yi(t.config);
  if (!n) return null;
  const i = typeof t.id == "string" && t.id.trim() ? t.id.trim() : qd(), r = Xi(e), a = {
    id: i,
    key: r,
    categories: e,
    config: n,
    updatedAt: Number.isFinite(t.updatedAt) ? Number(t.updatedAt) : Date.now()
  };
  return typeof t.label == "string" && t.label.trim() && (a.label = t.label.trim()), a;
}
c(qo, "sanitizeCriteriaMappingEntry");
function Hd(t) {
  if (!t || typeof t != "object") return null;
  const e = typeof t.mappingId == "string" && t.mappingId.trim() ? t.mappingId.trim() : null, n = Jr(t.categories);
  return !e && !n ? null : {
    mappingId: e,
    categories: n,
    updatedAt: Number.isFinite(t.updatedAt) ? Number(t.updatedAt) : Date.now()
  };
}
c(Hd, "sanitizeCurrentSelection");
function Jr(t) {
  const e = {};
  if (Array.isArray(t))
    for (const n of t) {
      const i = Kc((n == null ? void 0 : n.id) ?? (n == null ? void 0 : n.categoryId) ?? (n == null ? void 0 : n.category)), r = Jc((n == null ? void 0 : n.value) ?? (n == null ? void 0 : n.selection) ?? (n == null ? void 0 : n.label));
      !i || !r || (e[i] = r);
    }
  else if (t && typeof t == "object")
    for (const [n, i] of Object.entries(t)) {
      const r = Kc(n), a = Jc(i);
      !r || !a || (e[r] = a);
    }
  return Object.keys(e).length > 0 ? e : null;
}
c(Jr, "sanitizeCriteriaCategories");
function Xi(t) {
  if (!t || typeof t != "object") return "";
  const e = Object.entries(t).filter(([, n]) => typeof n == "string" && n).map(([n, i]) => `${n}:${i}`);
  return e.sort((n, i) => n < i ? -1 : n > i ? 1 : 0), e.join("|");
}
c(Xi, "computeCriteriaMappingKey");
function qd() {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
c(qd, "generateLightMappingId");
function Kc(t) {
  if (typeof t != "string") return null;
  const e = t.trim();
  return e || null;
}
c(Kc, "normalizeCategoryId");
function Jc(t) {
  if (typeof t != "string") return null;
  const e = t.trim();
  return e || null;
}
c(Jc, "normalizeCategoryValue");
const qa = ["AmbientLight", "Wall", "AmbientSound"];
let ja = /* @__PURE__ */ new WeakMap(), Ba = /* @__PURE__ */ new WeakMap();
const Yc = 200;
function Uh(t) {
  return t ? Number.isInteger(t.size) ? t.size : Array.isArray(t) || typeof t.length == "number" ? t.length : Array.from(t).length : 0;
}
c(Uh, "getCollectionSize");
function cs() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
c(cs, "nowMs$1");
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
function Gh(t, e = Yc) {
  if (!Array.isArray(t) || t.length === 0) return [];
  const n = Number.isInteger(e) && e > 0 ? e : Yc, i = [];
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
function Kh(t, e) {
  const n = /* @__PURE__ */ new Map();
  for (const i of qa) {
    const r = e.get(i) ?? [], a = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Map();
    for (const s of r) {
      const l = Bd(s, i);
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
c(Kh, "buildPlaceableDependencyIndex");
function Jh(t, e) {
  const n = Ba.get(t);
  if (n && qa.every((r) => n.collectionsByType.get(r) === e.get(r)))
    return n;
  const i = Kh(t, e);
  return Ba.set(t, i), i;
}
c(Jh, "getPlaceableDependencyIndex");
function Yh(t, e, n) {
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
c(Yh, "getDocsForChangedKeys");
function Ai(t) {
  return !!t && typeof t == "object" && !Array.isArray(t);
}
c(Ai, "isPlainObject");
function nl(t, e) {
  if (Object.is(t, e)) return !0;
  if (Array.isArray(t) || Array.isArray(e)) {
    if (!Array.isArray(t) || !Array.isArray(e) || t.length !== e.length) return !1;
    for (let n = 0; n < t.length; n += 1)
      if (!nl(t[n], e[n])) return !1;
    return !0;
  }
  if (Ai(t) || Ai(e)) {
    if (!Ai(t) || !Ai(e)) return !1;
    const n = Object.keys(e);
    for (const i of n)
      if (!nl(t[i], e[i])) return !1;
    return !0;
  }
  return !1;
}
c(nl, "areValuesEqual");
function jd(t, e) {
  const n = { _id: e._id };
  for (const [r, a] of Object.entries(e)) {
    if (r === "_id") continue;
    const o = t == null ? void 0 : t[r];
    if (Ai(a) && Ai(o)) {
      const s = jd(o, { _id: e._id, ...a });
      if (!s) continue;
      const l = Object.keys(s).filter((u) => u !== "_id");
      if (l.length > 0) {
        n[r] = {};
        for (const u of l)
          n[r][u] = s[u];
      }
      continue;
    }
    nl(o, a) || (n[r] = a);
  }
  return Object.keys(n).filter((r) => r !== "_id").length > 0 ? n : null;
}
c(jd, "buildChangedPayload");
function Bd(t, e) {
  var s;
  const n = ((s = t == null ? void 0 : t.flags) == null ? void 0 : s[ie]) ?? {}, i = (n == null ? void 0 : n.presets) ?? null, r = e === "AmbientLight" ? (n == null ? void 0 : n.lightCriteria) ?? null : null, a = ja.get(t);
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
  return ja.set(t, {
    type: e,
    rawPresets: i,
    rawLightCriteria: r,
    presets: o
  }), o;
}
c(Bd, "getPresetsForDocument");
function Xh(t = null, e = null) {
  t ? Ba.delete(t) : Ba = /* @__PURE__ */ new WeakMap(), e ? ja.delete(e) : t || (ja = /* @__PURE__ */ new WeakMap());
}
c(Xh, "invalidatePlaceableCriteriaCaches");
async function Ud(t, e, n = {}) {
  var l, u;
  const i = cs(), r = {
    total: 0,
    scanned: 0,
    updated: 0,
    chunks: 0,
    byType: {},
    durationMs: 0
  };
  if (e = e ?? ((l = game.scenes) == null ? void 0 : l.viewed), !e)
    return r.durationMs = cs() - i, r;
  const a = new Set(Rh()), o = new Map(
    qa.map((d) => [d, e.getEmbeddedCollection(d) ?? []])
  ), s = Jh(e, o);
  for (const d of qa) {
    const f = o.get(d) ?? [], h = {
      total: Uh(f),
      scanned: 0,
      updated: 0,
      chunks: 0
    }, g = s.byType.get(d) ?? null, p = Yh(f, g, n.changedKeys);
    if (h.scanned = p.length, r.total += h.total, r.scanned += h.scanned, r.byType[d] = h, !p.length) continue;
    const y = [];
    for (const w of p) {
      const v = Bd(w, d);
      if (!(v != null && v.base)) continue;
      const b = Nd(v.base, v.rules ?? [], t);
      b._id = w._id, d === "AmbientLight" && a.has(w._id) && (b.hidden = !0);
      const E = (w == null ? void 0 : w._source) ?? ((u = w == null ? void 0 : w.toObject) == null ? void 0 : u.call(w)) ?? {}, L = jd(E, b);
      L && y.push(L);
    }
    y.length > 0 && (h.chunks = await zh(e, d, y, n.chunkSize), h.updated = y.length, r.updated += y.length, r.chunks += h.chunks, console.log(`${ie} | Updated ${y.length} ${d}(s)`));
  }
  return r.durationMs = cs() - i, r;
}
c(Ud, "updatePlaceables");
function Ua() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
c(Ua, "nowMs");
const ra = /* @__PURE__ */ new Map();
function Qh(t) {
  var e;
  return t = t ?? ((e = game.scenes) == null ? void 0 : e.viewed), t ? Wr(t) : null;
}
c(Qh, "getState");
async function Zh(t, e, n = 0) {
  var g;
  const i = Ua();
  if (e = e ?? ((g = game.scenes) == null ? void 0 : g.viewed), !e) return null;
  vh(e);
  const r = dt(e);
  if (!r.length)
    return console.warn(`${ie} | applyState skipped: scene has no criteria.`), null;
  const a = Wr(e, r), o = tc({ ...a, ...t ?? {} }, r), s = r.filter((p) => (a == null ? void 0 : a[p.key]) !== (o == null ? void 0 : o[p.key])).map((p) => p.key), l = s.length > 0;
  l && await ih(e, o, r);
  const u = l ? o : a, [d, f] = await Promise.all([
    Fd(u, e, { changedKeys: s }),
    Ud(u, e, { changedKeys: s })
  ]), h = Ua() - i;
  return N("Criteria apply telemetry", {
    sceneId: e.id,
    changedKeys: s,
    didChange: l,
    queuedMs: n,
    durationMs: h,
    tiles: d,
    placeables: f
  }), Hooks.callAll("eidolon-utilities.criteriaStateApplied", e, u), u;
}
c(Zh, "applyStateInternal");
async function Vd(t, e) {
  var l;
  if (e = e ?? ((l = game.scenes) == null ? void 0 : l.viewed), !e) return null;
  const n = e.id ?? "__viewed__", i = Ua(), r = ra.get(n) ?? Promise.resolve();
  let a = null;
  const o = r.catch(() => null).then(async () => {
    const u = Ua() - i;
    return Zh(t, e, u);
  });
  a = o;
  const s = o.finally(() => {
    ra.get(n) === s && ra.delete(n);
  });
  return ra.set(n, s), a;
}
c(Vd, "applyState$1");
function eg(t) {
  var e;
  return t = t ?? ((e = game.scenes) == null ? void 0 : e.viewed), t ? kd(t) : null;
}
c(eg, "getVersion");
async function Gd(t, e) {
  var n;
  e = e ?? ((n = game.scenes) == null ? void 0 : n.viewed), e != null && e.setFlag && await e.setFlag(ie, Od, Number(t));
}
c(Gd, "setVersion");
async function tg(t) {
  return Gd(Ad, t);
}
c(tg, "markCurrentVersion");
const or = "Standard", ng = /* @__PURE__ */ c((...t) => console.log(`${ie} | criteria indexer:`, ...t), "log");
function ac(t) {
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
c(ac, "parseFileTags");
function ig(t, e, n = or) {
  return t != null && t.length ? t.map((i) => {
    const r = ac(i == null ? void 0 : i.name);
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
    const r = [...e[n] ?? /* @__PURE__ */ new Set()].sort(), o = r.includes(or) ? or : r[0] ?? or, s = ec(n);
    return s.key = n, s.label = n.charAt(0).toUpperCase() + n.slice(1), s.values = r.length ? r : [or], s.default = s.values.includes(o) ? o : s.values[0], s.order = i, s;
  });
}
c(rg, "buildCriteriaDefinitions");
async function aa(t, e, n, { dryRun: i = !1 } = {}) {
  const r = t.getFlag("monks-active-tiles", "files");
  if (!(r != null && r.length)) return null;
  const a = ig(r, e), o = xd(a, { files: r });
  for (const s of r) {
    const l = ac(s == null ? void 0 : s.name);
    if (l)
      for (const [u, d] of Object.entries(e)) {
        const f = l[Number(u)];
        f != null && n[d] && n[d].add(f);
      }
  }
  return i || (await t.setFlag(ie, di, o), typeof t.unsetFlag == "function" && await t.unsetFlag(ie, ci)), { files: r.length };
}
c(aa, "indexTile");
async function ag(t, e = {}) {
  var b, E, L, A;
  const {
    dryRun: n = !1,
    force: i = !1
  } = e;
  if (t = t ?? ((b = game.scenes) == null ? void 0 : b.viewed), !t) throw new Error("No scene provided to indexScene.");
  if (!globalThis.Tagger) throw new Error("Tagger is required to index scene criteria.");
  if (!i && kd(t) >= Ad)
    throw new Error(
      `Scene "${t.name}" is already criteria-indexed. Use force: true to re-index.`
    );
  const r = { sceneId: t.id }, a = Tagger.getByTag("Map", r) ?? [];
  if (!a.length) throw new Error("No Map tile found.");
  if (a.length > 1) throw new Error(`Expected 1 Map tile, found ${a.length}.`);
  const o = a[0], s = o.getFlag("monks-active-tiles", "files");
  if (!(s != null && s.length)) throw new Error("Map tile has no MATT files.");
  const l = ac((E = s[0]) == null ? void 0 : E.name);
  if (!(l != null && l.length))
    throw new Error(`Cannot parse bracket tags from: ${((L = s[0]) == null ? void 0 : L.name) ?? "<unknown>"}`);
  if (l.length < 3)
    throw new Error(`Expected 3+ bracket tags, found ${l.length}.`);
  const u = Tagger.getByTag("Floor", r) ?? [], d = Tagger.getByTag("Roof", r) ?? [], f = Tagger.getByTag("Weather", r) ?? [];
  let h;
  const g = [];
  l.length >= 4 ? (h = { 0: "mood", 1: "stage", 2: "variant", 3: "effect" }, g.push("mood", "stage", "variant", "effect")) : (h = { 0: "mood", 1: "variant", 2: "effect" }, g.push("mood", "variant", "effect"));
  const p = { 1: "effect" }, y = {};
  for (const O of g)
    y[O] = /* @__PURE__ */ new Set();
  const w = {
    map: null,
    floor: [],
    roof: [],
    weather: []
  };
  w.map = await aa(o, h, y, { dryRun: n });
  for (const O of u) {
    const M = await aa(O, h, y, { dryRun: n });
    M && w.floor.push(M);
  }
  for (const O of d) {
    const M = await aa(O, h, y, { dryRun: n });
    M && w.roof.push(M);
  }
  for (const O of f) {
    const M = await aa(O, p, y, { dryRun: n });
    M && w.weather.push(M);
  }
  const v = rg(g, y);
  return n || (await Po(t, v), await tg(t)), ng(
    n ? "Dry run complete" : "Indexing complete",
    `- ${v.length} criteria,`,
    `${((A = w.map) == null ? void 0 : A.files) ?? 0} map files`
  ), {
    criteria: v,
    state: v.reduce((O, M) => (O[M.key] = M.default, O), {}),
    tiles: w,
    overlayMode: f.length > 0
  };
}
c(ag, "indexScene");
var Pu, Pe, st, lt, ri, Je, Pt, yn, Mo, le, zd, Wd, Kd, rl, Jd, al, Yd, sr, ol;
const pt = class pt extends qn(Hn) {
  constructor(n = {}) {
    var i;
    super(n);
    k(this, le);
    k(this, Pe, null);
    k(this, st, []);
    k(this, lt, {});
    k(this, ri, !1);
    k(this, Je, null);
    k(this, Pt, null);
    k(this, yn, null);
    k(this, Mo, 120);
    this.setScene(n.scene ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null);
  }
  setScene(n) {
    var i;
    I(this, Pe, n ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null), C(this, le, zd).call(this);
  }
  get scene() {
    return m(this, Pe);
  }
  async _prepareContext() {
    var r;
    const n = !!m(this, Pe), i = n && m(this, st).length > 0;
    return {
      hasScene: n,
      hasCriteria: i,
      sceneName: ((r = m(this, Pe)) == null ? void 0 : r.name) ?? S("EIDOLON.CriteriaSwitcher.NoScene", "No active scene"),
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
      criteria: m(this, st).map((a) => ({
        key: a.key,
        label: a.label || a.key,
        values: a.values.map((o) => {
          var s;
          return {
            value: o,
            selected: ((s = m(this, lt)) == null ? void 0 : s[a.key]) === o
          };
        }),
        defaultValue: a.default
      })),
      stateSummary: C(this, le, ol).call(this)
    };
  }
  _onRender(n, i) {
    super._onRender(n, i), C(this, le, Wd).call(this), C(this, le, Kd).call(this);
  }
  async _onClose(n) {
    return m(this, Je) !== null && (clearTimeout(m(this, Je)), I(this, Je, null)), m(this, yn) !== null && (Hooks.off("eidolon-utilities.criteriaStateApplied", m(this, yn)), I(this, yn, null)), super._onClose(n);
  }
};
Pe = new WeakMap(), st = new WeakMap(), lt = new WeakMap(), ri = new WeakMap(), Je = new WeakMap(), Pt = new WeakMap(), yn = new WeakMap(), Mo = new WeakMap(), le = new WeakSet(), zd = /* @__PURE__ */ c(function() {
  if (!m(this, Pe)) {
    I(this, st, []), I(this, lt, {});
    return;
  }
  I(this, st, dt(m(this, Pe)).sort((n, i) => n.order - i.order)), I(this, lt, Wr(m(this, Pe), m(this, st)));
}, "#hydrateFromScene"), Wd = /* @__PURE__ */ c(function() {
  var i, r;
  const n = this.element;
  n instanceof HTMLElement && (n.querySelectorAll("[data-criteria-key]").forEach((a) => {
    a.addEventListener("change", (o) => {
      const s = o.currentTarget;
      if (!(s instanceof HTMLSelectElement)) return;
      const l = s.dataset.criteriaKey;
      l && (I(this, lt, {
        ...m(this, lt),
        [l]: s.value
      }), C(this, le, Jd).call(this, { [l]: s.value }));
    });
  }), (i = n.querySelector("[data-action='reset-defaults']")) == null || i.addEventListener("click", () => {
    C(this, le, Yd).call(this);
  }), (r = n.querySelector("[data-action='close-switcher']")) == null || r.addEventListener("click", () => {
    this.close();
  }));
}, "#bindEvents"), Kd = /* @__PURE__ */ c(function() {
  m(this, yn) === null && I(this, yn, Hooks.on("eidolon-utilities.criteriaStateApplied", (n, i) => {
    !m(this, Pe) || (n == null ? void 0 : n.id) !== m(this, Pe).id || m(this, ri) || (I(this, lt, { ...i ?? {} }), this.render({ force: !0 }));
  }));
}, "#ensureSyncHook"), rl = /* @__PURE__ */ c(async function(n) {
  var i, r;
  if (m(this, Pe)) {
    C(this, le, sr).call(this, "applying"), I(this, ri, !0);
    try {
      const a = await Vd(n, m(this, Pe));
      a && I(this, lt, a), C(this, le, sr).call(this, "ready"), this.render({ force: !0 });
    } catch (a) {
      console.error(`${ie} | Failed to apply criteria state`, a), (r = (i = ui.notifications) == null ? void 0 : i.error) == null || r.call(
        i,
        S(
          "EIDOLON.CriteriaSwitcher.ApplyError",
          "Failed to apply the selected criteria state."
        )
      ), C(this, le, sr).call(this, "error", (a == null ? void 0 : a.message) ?? "Unknown error");
    } finally {
      I(this, ri, !1), m(this, Pt) && C(this, le, al).call(this);
    }
  }
}, "#applyPartialState"), Jd = /* @__PURE__ */ c(function(n) {
  I(this, Pt, {
    ...m(this, Pt) ?? {},
    ...n ?? {}
  }), m(this, Je) !== null && clearTimeout(m(this, Je)), C(this, le, sr).call(this, "applying"), I(this, Je, setTimeout(() => {
    I(this, Je, null), C(this, le, al).call(this);
  }, m(this, Mo)));
}, "#queuePartialState"), al = /* @__PURE__ */ c(async function() {
  if (m(this, ri) || !m(this, Pt)) return;
  const n = m(this, Pt);
  I(this, Pt, null), await C(this, le, rl).call(this, n);
}, "#flushPendingState"), Yd = /* @__PURE__ */ c(async function() {
  if (!m(this, st).length) return;
  const n = m(this, st).reduce((i, r) => (i[r.key] = r.default, i), {});
  I(this, lt, n), m(this, Je) !== null && (clearTimeout(m(this, Je)), I(this, Je, null)), I(this, Pt, null), await C(this, le, rl).call(this, n);
}, "#resetToDefaults"), sr = /* @__PURE__ */ c(function(n, i = "") {
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
        a.textContent = `${S("EIDOLON.CriteriaSwitcher.Ready", "Ready")}: ${C(this, le, ol).call(this)}`;
        break;
    }
}, "#setStatus"), ol = /* @__PURE__ */ c(function() {
  return m(this, st).length ? `[${m(this, st).map((n) => {
    var i;
    return ((i = m(this, lt)) == null ? void 0 : i[n.key]) ?? n.default;
  }).join(" | ")}]` : "-";
}, "#formatStateSummary"), c(pt, "CriteriaSwitcherApplication"), ye(pt, "APP_ID", `${ie}-criteria-switcher`), ye(pt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Fe(pt, pt, "DEFAULT_OPTIONS"),
  {
    id: pt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Pu = Fe(pt, pt, "DEFAULT_OPTIONS")) == null ? void 0 : Pu.classes) ?? [], "eidolon-criteria-switcher-window", "themed"])
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
)), ye(pt, "PARTS", {
  content: {
    template: `modules/${ie}/templates/criteria-switcher.html`
  }
});
let il = pt;
const og = Fo(il);
let mi = null;
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
function jo() {
  return lg(mi) ? mi : (mi = null, null);
}
c(jo, "getCriteriaSwitcher");
function Xd(t) {
  var i, r, a, o, s;
  const e = sg(t);
  if (!e)
    return (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "No active scene to open the criteria switcher."), null;
  if (!Ro(e))
    return (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, "You do not have permission to manage scene criteria."), null;
  const n = jo();
  return n ? (n.setScene(e), n.render({ force: !0 }), (s = n.bringToFront) == null || s.call(n), n) : (mi = og({ scene: e }), mi.render({ force: !0 }), mi);
}
c(Xd, "openCriteriaSwitcher");
function Qd() {
  const t = jo();
  t && (t.close(), mi = null);
}
c(Qd, "closeCriteriaSwitcher");
function oc(t) {
  return jo() ? (Qd(), null) : Xd(t);
}
c(oc, "toggleCriteriaSwitcher");
const cg = {
  SCHEMA_VERSION: nc,
  applyState: Vd,
  getState: Qh,
  getVersion: eg,
  setVersion: Gd,
  getCriteria(t) {
    var e;
    return dt(t ?? ((e = game.scenes) == null ? void 0 : e.viewed));
  },
  setCriteria(t, e) {
    var n;
    return Po(e ?? ((n = game.scenes) == null ? void 0 : n.viewed), t);
  },
  updateTiles: Fd,
  updatePlaceables: Ud,
  indexScene: ag,
  openCriteriaSwitcher: Xd,
  closeCriteriaSwitcher: Qd,
  toggleCriteriaSwitcher: oc,
  findBestMatch: hh,
  findFileIndex: gh,
  resolveRules: Nd
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
  const r = bd(t);
  return t.insertBefore(i, r ?? null), i;
}
c(gg, "createTabPanel");
function us(t, e, n, i, r) {
  var s;
  if (!(i instanceof HTMLElement) || !(r instanceof HTMLElement)) return;
  const a = (s = t == null ? void 0 : t.tabGroups) == null ? void 0 : s[e];
  if (typeof a == "string" ? a === n : i.classList.contains("active") || r.classList.contains("active")) {
    i.classList.add("active"), i.setAttribute("aria-selected", "true"), i.setAttribute("aria-pressed", "true"), r.classList.add("active"), r.removeAttribute("hidden"), r.removeAttribute("aria-hidden");
    return;
  }
  i.classList.remove("active"), i.setAttribute("aria-selected", "false"), i.setAttribute("aria-pressed", "false"), r.classList.remove("active"), r.setAttribute("hidden", "true");
}
c(us, "syncTabVisibility");
function sc(t, e, n, i, r) {
  const a = ug(e), o = dg(e, a);
  if (!(a instanceof HTMLElement) || !(o instanceof HTMLElement)) return null;
  const s = fg(a, o);
  let l = a.querySelector(`[data-tab="${n}"]`);
  l instanceof HTMLElement || (l = hg(a, s, n), a.appendChild(l)), mg(l, i, r);
  let u = o.querySelector(`.tab[data-tab="${n}"]`);
  u instanceof HTMLElement || (u = gg(o, s, n));
  const d = `data-eidolon-bound-${n}`;
  return l.hasAttribute(d) || (l.addEventListener("click", () => {
    pd(t, n, s), requestAnimationFrame(() => {
      us(t, s, n, l, u);
    });
  }), l.setAttribute(d, "true")), us(t, s, n, l, u), requestAnimationFrame(() => {
    us(t, s, n, l, u);
  }), pg(t, a), u;
}
c(sc, "ensureTileConfigTab");
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
function Zd(t) {
  var e;
  return ((e = t == null ? void 0 : t.getFlag) == null ? void 0 : e.call(t, "monks-active-tiles", "files")) ?? [];
}
c(Zd, "getTileFiles$1");
function yg(t = []) {
  return {
    strategy: "select-one",
    defaultTarget: Fn(t, 0) ?? { indexHint: 0 },
    variants: [
      {
        criteria: {},
        target: Fn(t, 0) ?? { indexHint: 0 }
      }
    ]
  };
}
c(yg, "createDefaultTileCriteria");
function bg(t, e = {}) {
  var o, s;
  const { allowLegacy: n = !0 } = e, i = Zd(t), r = (o = t == null ? void 0 : t.getFlag) == null ? void 0 : o.call(t, ie, di);
  if (r) return pi(r, { files: i });
  if (!n) return null;
  const a = (s = t == null ? void 0 : t.getFlag) == null ? void 0 : s.call(t, ie, ci);
  return a ? pi(a, { files: i }) : null;
}
c(bg, "getTileCriteria");
async function Xc(t, e, n = {}) {
  if (!(t != null && t.setFlag)) return null;
  const {
    strictValidation: i = !0
  } = n, r = Zd(t), a = pi(e, { files: r });
  if (!a)
    return typeof t.unsetFlag == "function" ? (await t.unsetFlag(ie, di), await t.unsetFlag(ie, ci)) : (await t.setFlag(ie, di, null), await t.setFlag(ie, ci, null)), null;
  if (i) {
    const o = $d(a, { files: r });
    if (o.errors.length > 0)
      throw new Error(
        `Tile criteria contains ${o.errors.length} conflicting rule pair(s). Resolve clashes before saving.`
      );
  }
  return await t.setFlag(ie, di, a), typeof t.unsetFlag == "function" && await t.unsetFlag(ie, ci), a;
}
c(Xc, "setTileCriteria");
const sl = "__eidolon_any__", ll = "eidolon-tile-criteria", vg = "fa-solid fa-sliders", ef = Symbol.for("eidolon.tileCriteriaUiState"), Bo = ["all", "unmapped", "mapped", "conflicts"];
function wg(t) {
  const e = t == null ? void 0 : t[ef];
  return !e || typeof e != "object" ? {
    filterQuery: "",
    filterMode: "all",
    selectedFileIndex: null
  } : {
    filterQuery: typeof e.filterQuery == "string" ? e.filterQuery : "",
    filterMode: Bo.includes(e.filterMode) ? e.filterMode : "all",
    selectedFileIndex: Number.isInteger(e.selectedFileIndex) ? e.selectedFileIndex : null
  };
}
c(wg, "readUiState");
function Eg(t, e) {
  if (!t || !e) return;
  typeof e.filterQuery == "string" && (t.filterQuery = e.filterQuery), Bo.includes(e.filterMode) && (t.filterMode = e.filterMode), Number.isInteger(e.selectedFileIndex) && t.fileEntries.some((i) => i.index === e.selectedFileIndex) && (t.selectedFileIndex = e.selectedFileIndex);
}
c(Eg, "applyUiState");
function Sg(t) {
  const e = t == null ? void 0 : t.app, n = t == null ? void 0 : t.state;
  !e || !n || (e[ef] = {
    filterQuery: typeof n.filterQuery == "string" ? n.filterQuery : "",
    filterMode: Bo.includes(n.filterMode) ? n.filterMode : "all",
    selectedFileIndex: Number.isInteger(n.selectedFileIndex) ? n.selectedFileIndex : null
  });
}
c(Sg, "persistUiState");
function Cg(t) {
  const e = (t == null ? void 0 : t.object) ?? (t == null ? void 0 : t.document) ?? null;
  return !(e != null && e.isEmbedded) || e.documentName !== "Tile" ? null : e;
}
c(Cg, "getTileDocument$2");
function Tg(t) {
  var e;
  return ((e = t == null ? void 0 : t.getFlag) == null ? void 0 : e.call(t, "monks-active-tiles", "files")) ?? [];
}
c(Tg, "getTileFiles");
function Lg(t, e) {
  var s;
  const n = (t == null ? void 0 : t.parent) ?? ((s = game.scenes) == null ? void 0 : s.viewed) ?? null, r = dt(n).sort((l, u) => l.order - u.order).map((l) => ({
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
function cl(t) {
  var g, p;
  const e = Tg(t), n = ic(e), i = bg(t, { allowLegacy: !0 }) ?? yg(e), r = Lg(t, i), a = new Map(r.map((y) => [y.key, y.label])), o = new Map(
    n.map((y) => [
      y.index,
      y.path || y.label
    ])
  ), s = wr(i.defaultTarget, e), l = ((g = n[0]) == null ? void 0 : g.index) ?? 0, u = s >= 0 ? s : l, d = new Map(n.map((y) => [y.index, []]));
  let f = 1;
  for (const y of i.variants ?? []) {
    const w = wr(y.target, e);
    w < 0 || (d.has(w) || d.set(w, []), d.get(w).push({
      id: f,
      criteria: { ...y.criteria ?? {} }
    }), f += 1);
  }
  const h = n.some((y) => y.index === u) ? u : ((p = n[0]) == null ? void 0 : p.index) ?? null;
  return {
    files: e,
    fileEntries: n,
    criteriaDefinitions: r,
    criteriaLabels: a,
    relativePaths: o,
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
c(cl, "buildEditorState");
function ul(t, e) {
  return t.rulesByFile.has(e) || t.rulesByFile.set(e, []), t.rulesByFile.get(e);
}
c(ul, "getRulesForFile");
function kg(t) {
  return Object.fromEntries(
    Object.entries(t ?? {}).filter(([e, n]) => typeof e == "string" && e && typeof n == "string" && n.trim()).map(([e, n]) => [e, n.trim()])
  );
}
c(kg, "sanitizeRuleCriteria");
function tf(t) {
  const e = Fn(t.files, t.defaultIndex);
  if (!e) return null;
  const n = [], i = [];
  for (const [a, o] of t.rulesByFile.entries()) {
    const s = Fn(t.files, a);
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
    normalized: pi(
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
c(tf, "buildTileCriteriaDraft");
function Mg(t) {
  var e;
  return ((e = tf(t)) == null ? void 0 : e.normalized) ?? null;
}
c(Mg, "exportTileCriteria");
function Qc(t) {
  const e = tf(t);
  if (!(e != null && e.normalized))
    return {
      errors: [],
      warnings: [],
      errorFileIndexes: [],
      warningFileIndexes: []
    };
  const n = $d(e.normalized, { files: t.files }), i = /* @__PURE__ */ c((s) => {
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
function oa(t, e = "neutral") {
  const n = document.createElement("span");
  return n.classList.add("eidolon-tile-criteria__badge"), n.dataset.kind = e, n.textContent = t, n;
}
c(oa, "createBadge");
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
function _g(t) {
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
c(_g, "createRegexFilter");
function $g(t, e) {
  const n = document.createElement("select");
  n.dataset.criteriaKey = t.key;
  const i = document.createElement("option");
  i.value = sl, i.textContent = "*", n.appendChild(i);
  const r = new Set(t.values ?? []);
  e && !r.has(e) && r.add(e);
  for (const a of r) {
    const o = document.createElement("option");
    o.value = a, o.textContent = a, n.appendChild(o);
  }
  return n.value = e ?? sl, n;
}
c($g, "createCriterionSelect");
function xg(t, e, n, i) {
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
    const f = $g(l, (s = t.criteria) == null ? void 0 : s[l.key]);
    f.addEventListener("change", () => {
      f.value === sl ? delete t.criteria[l.key] : t.criteria[l.key] = f.value, i();
    }), u.appendChild(f), a.appendChild(u);
  }
  r.appendChild(a);
  const o = document.createElement("button");
  return o.type = "button", o.classList.add("control", "ui-control", "eidolon-tile-criteria__rule-remove"), o.textContent = S("EIDOLON.TileCriteria.RemoveRule", "Remove"), o.addEventListener("click", () => {
    const u = ul(e, n).filter((d) => d.id !== t.id);
    e.rulesByFile.set(n, u), i();
  }), r.appendChild(o), r;
}
c(xg, "renderRuleEditor");
const wa = /* @__PURE__ */ new WeakMap();
function nf(t) {
  return (t == null ? void 0 : t.app) ?? (t == null ? void 0 : t.tile) ?? null;
}
c(nf, "getDialogOwner");
function Fg(t) {
  for (const e of t) {
    const n = kt(e);
    if (n) return n;
    const i = kt(e == null ? void 0 : e.element);
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
  l.classList.add("notes"), l.textContent = `#${r.index + 1} · ${r.path || S("EIDOLON.TileCriteria.UnknownPath", "Unknown path")}`, o.appendChild(l), a.appendChild(o);
  const u = document.createElement("div");
  u.classList.add("eidolon-tile-criteria__editor-controls");
  const d = document.createElement("button");
  d.type = "button", d.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action"), i.defaultIndex === r.index ? (d.textContent = S("EIDOLON.TileCriteria.IsDefault", "Default Target"), d.disabled = !0) : (d.textContent = S("EIDOLON.TileCriteria.SetDefault", "Set As Default"), d.addEventListener("click", () => {
    i.defaultIndex = r.index, Ve(t), n();
  })), u.appendChild(d);
  const f = document.createElement("button");
  f.type = "button", f.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action", "secondary"), f.textContent = S("EIDOLON.TileCriteria.ClearFileRules", "Clear File Rules"), f.addEventListener("click", () => {
    i.rulesByFile.set(r.index, []), Ve(t), n();
  }), u.appendChild(f), a.appendChild(u);
  const h = document.createElement("div");
  h.classList.add("eidolon-tile-criteria__rule-editors");
  const g = ul(i, r.index);
  if (g.length)
    for (const y of g)
      h.appendChild(
        xg(y, i, r.index, () => {
          Ve(t), n();
        })
      );
  else {
    const y = document.createElement("p");
    y.classList.add("notes"), y.textContent = S(
      "EIDOLON.TileCriteria.NoRulesForFile",
      "No rules map to this file yet. Add one to define when this variant should be active."
    ), h.appendChild(y);
  }
  a.appendChild(h);
  const p = document.createElement("button");
  return p.type = "button", p.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action"), p.textContent = S("EIDOLON.TileCriteria.AddRule", "Add Rule"), p.disabled = !i.criteriaDefinitions.length, p.addEventListener("click", () => {
    ul(i, r.index).push({
      id: i.nextRuleId,
      criteria: {}
    }), i.nextRuleId += 1, Ve(t), n();
  }), a.appendChild(p), a;
}
c(Dg, "buildRuleEditorContent");
function Pg(t, e) {
  var f, h, g;
  const n = nf(t);
  if (!n) return;
  const i = wa.get(n);
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
  wa.set(n, r);
  const a = /* @__PURE__ */ c(() => {
    wa.delete(n);
  }, "closeDialog"), o = /* @__PURE__ */ c(() => {
    r.host instanceof HTMLElement && r.host.replaceChildren(
      Dg(r.controller, r.fileIndex, o)
    );
  }, "refreshDialog");
  r.refresh = o;
  const s = S("EIDOLON.TileCriteria.EditorTitle", "Edit Tile Criteria Rules"), l = '<div class="eidolon-tile-criteria-editor-host"></div>', u = S("EIDOLON.TileCriteria.CloseEditor", "Close"), d = (g = (h = foundry == null ? void 0 : foundry.applications) == null ? void 0 : h.api) == null ? void 0 : g.DialogV2;
  if (typeof (d == null ? void 0 : d.wait) == "function") {
    d.wait({
      window: { title: s },
      content: l,
      buttons: [{ action: "close", label: u, default: !0 }],
      render: /* @__PURE__ */ c((...p) => {
        var v;
        const y = Fg(p), w = (v = y == null ? void 0 : y.querySelector) == null ? void 0 : v.call(y, ".eidolon-tile-criteria-editor-host");
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
c(Pg, "openRuleEditorDialog");
function Zc(t) {
  var i;
  const e = nf(t);
  if (!e) return;
  const n = wa.get(e);
  (i = n == null ? void 0 : n.refresh) == null || i.call(n);
}
c(Zc, "refreshOpenRuleEditor");
function dl(t, e) {
  return (t.rulesByFile.get(e) ?? []).length > 0;
}
c(dl, "hasRulesForFile");
function rf(t, e) {
  var n, i;
  return ((n = t == null ? void 0 : t.errorFileIndexes) == null ? void 0 : n.includes(e)) || ((i = t == null ? void 0 : t.warningFileIndexes) == null ? void 0 : i.includes(e));
}
c(rf, "hasConflictForFile");
function Rg(t, e, n) {
  switch (t.filterMode) {
    case "unmapped":
      return !dl(t, e.index);
    case "mapped":
      return dl(t, e.index);
    case "conflicts":
      return rf(n, e.index);
    case "all":
    default:
      return !0;
  }
}
c(Rg, "matchesFilterMode");
function Hg(t, e) {
  let n = 0, i = 0, r = 0;
  for (const a of t.fileEntries)
    dl(t, a.index) ? n += 1 : i += 1, rf(e, a.index) && (r += 1);
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
c(qg, "getFilterModeLabel");
function af(t, e, n, i, r) {
  var u, d;
  const a = [...t.folders.keys()].sort((f, h) => f.localeCompare(h));
  for (const f of a) {
    const h = Og(f, t.folders.get(f)), g = document.createElement("li");
    g.classList.add("eidolon-tile-criteria__tree-branch");
    const p = document.createElement("div");
    p.classList.add("document", "folder", "update", "eidolon-tile-criteria__folder-row");
    const y = document.createElement("i");
    y.classList.add("fa-solid", "fa-folder-open"), p.appendChild(y);
    const w = document.createElement("span");
    w.classList.add("eidolon-tile-criteria__tree-folder-label"), w.textContent = h.label, w.title = h.label, p.appendChild(w), g.appendChild(p);
    const v = document.createElement("ul");
    v.classList.add("eidolon-tile-criteria__tree"), v.dataset.folder = h.label, af(h.node, e, n, i, v), v.childElementCount > 0 && g.appendChild(v), r.appendChild(g);
  }
  const o = [...t.files].sort((f, h) => f.name.localeCompare(h.name));
  if (!o.length) return;
  const s = document.createElement("li"), l = document.createElement("ul");
  l.classList.add("document-list", "eidolon-tile-criteria__document-list");
  for (const f of o) {
    const h = f.entry, g = h.index === e.selectedFileIndex, p = h.index === e.defaultIndex, y = Ag(e, h.index), w = document.createElement("li");
    w.classList.add("document", "update", "eidolon-tile-criteria__tree-file");
    const v = document.createElement("button");
    v.type = "button", v.classList.add("eidolon-tile-criteria__file-row");
    const b = (u = i == null ? void 0 : i.errorFileIndexes) == null ? void 0 : u.includes(h.index), E = (d = i == null ? void 0 : i.warningFileIndexes) == null ? void 0 : d.includes(h.index);
    b ? v.classList.add("has-conflict") : E && v.classList.add("has-warning");
    const L = e.relativePaths.get(h.index) || h.path || f.name, A = [L];
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
      e.selectedFileIndex = h.index, Ve(n), Pg(n, h.index);
    });
    const O = document.createElement("span");
    O.classList.add("eidolon-tile-criteria__indicator"), O.dataset.kind = p ? "default" : y.length ? "mapped" : "unmapped", v.appendChild(O);
    const M = document.createElement("span");
    M.classList.add("eidolon-tile-criteria__file-content");
    const x = document.createElement("span");
    x.classList.add("eidolon-tile-criteria__file-heading");
    const R = document.createElement("span");
    R.classList.add("eidolon-tile-criteria__file-title"), R.textContent = Ng(f.name || h.label), R.title = L, x.appendChild(R);
    const D = oa(`#${h.index + 1}`, "meta");
    D.classList.add("eidolon-tile-criteria__index-badge"), x.appendChild(D), M.appendChild(x);
    const F = document.createElement("span");
    F.classList.add("eidolon-tile-criteria__badges"), p && F.appendChild(oa(S("EIDOLON.TileCriteria.DefaultBadge", "Default"), "default"));
    const _ = y.slice(0, 2);
    for (const H of _)
      F.appendChild(oa(H, "rule"));
    if (y.length > _.length && F.appendChild(oa(`+${y.length - _.length}`, "meta")), M.appendChild(F), v.appendChild(M), b || E) {
      const H = document.createElement("span");
      H.classList.add("eidolon-tile-criteria__row-warning"), H.dataset.mode = b ? "error" : "warning", H.innerHTML = '<i class="fa-solid fa-triangle-exclamation" inert=""></i>', v.appendChild(H);
    }
    w.appendChild(v), l.appendChild(w);
  }
  s.appendChild(l), r.appendChild(s);
}
c(af, "renderTreeNode");
function jg(t, e, n, i = {}) {
  const r = document.createElement("section");
  r.classList.add("eidolon-tile-criteria__tree-panel");
  const a = _g(t.filterQuery), o = Hg(t, n);
  t.filterMode !== "all" && o[t.filterMode] === 0 && (t.filterMode = "all");
  const s = document.createElement("div");
  s.classList.add("eidolon-tile-criteria__toolbar");
  const l = document.createElement("div");
  l.classList.add("eidolon-tile-criteria__mode-bar");
  for (const b of Bo) {
    const E = document.createElement("button");
    E.type = "button", E.classList.add("control", "ui-control", "eidolon-tile-criteria__mode-button"), E.dataset.mode = b, E.textContent = qg(b);
    const L = b === "all" || o[b] > 0;
    E.disabled = !L, L || (E.dataset.tooltip = S(
      "EIDOLON.TileCriteria.FilterModeUnavailable",
      "No entries currently match this filter."
    ), E.title = E.dataset.tooltip), t.filterMode === b ? (E.classList.add("is-active"), E.setAttribute("aria-pressed", "true")) : E.setAttribute("aria-pressed", "false"), E.addEventListener("click", () => {
      t.filterMode !== b && (t.filterMode = b, Ve(e));
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
    t.filterQuery = d.value, Ve(e), requestAnimationFrame(() => {
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
  const f = document.createElement("div");
  f.classList.add("eidolon-tile-criteria__toolbar-actions");
  const h = document.createElement("button");
  h.type = "button";
  const g = S("EIDOLON.TileCriteria.Save", "Save Rules");
  h.classList.add("control", "ui-control", "eidolon-tile-criteria__toolbar-action", "icon-only"), h.dataset.tooltip = g, h.setAttribute("aria-label", g), h.title = g, h.innerHTML = '<i class="fa-solid fa-floppy-disk" inert=""></i>', h.disabled = n.errors.length > 0, h.addEventListener("click", () => {
    var b;
    (b = i.onSave) == null || b.call(i);
  }), f.appendChild(h);
  const p = document.createElement("button");
  p.type = "button";
  const y = S("EIDOLON.TileCriteria.Clear", "Clear Rules");
  if (p.classList.add("control", "ui-control", "secondary", "eidolon-tile-criteria__toolbar-action", "icon-only"), p.dataset.tooltip = y, p.setAttribute("aria-label", y), p.title = y, p.innerHTML = '<i class="fa-solid fa-trash" inert=""></i>', p.addEventListener("click", () => {
    var b;
    (b = i.onClear) == null || b.call(i);
  }), f.appendChild(p), u.appendChild(f), s.appendChild(u), r.appendChild(s), a.error) {
    const b = document.createElement("p");
    b.classList.add("notes", "eidolon-tile-criteria__filter-error"), b.textContent = `${S("EIDOLON.TileCriteria.InvalidRegex", "Invalid regex")}: ${a.error}`, r.appendChild(b);
  }
  const w = document.createElement("div");
  w.classList.add("eidolon-tile-criteria__library-tree");
  const v = t.fileEntries.filter((b) => {
    const E = t.relativePaths.get(b.index) || b.path || b.label;
    return Rg(t, b, n) && a.matches(E);
  });
  if (t.fileEntries.length)
    if (v.length) {
      const b = document.createElement("ul");
      b.classList.add("eidolon-tile-criteria__tree"), af(Ig(v), t, e, n, b), w.appendChild(b);
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
c(jg, "renderTreePanel");
function Ve(t) {
  const { section: e, state: n } = t, i = Qc(n);
  Sg(t), e.replaceChildren();
  const r = /* @__PURE__ */ c(async () => {
    try {
      const o = Qc(n);
      if (o.errors.length) {
        n.status = {
          mode: "error",
          message: S(
            "EIDOLON.TileCriteria.ConflictSaveBlocked",
            `Resolve ${o.errors.length} conflict(s) before saving tile criteria rules.`
          )
        }, Ve(t);
        return;
      }
      const s = Mg(n);
      if (!s) {
        n.status = {
          mode: "error",
          message: S("EIDOLON.TileCriteria.Invalid", "Invalid rules. Select valid target variants.")
        }, Ve(t);
        return;
      }
      await Xc(t.tile, s);
      const l = n.filterQuery, u = n.filterMode, d = n.selectedFileIndex;
      t.state = cl(t.tile), t.state.filterQuery = l, t.state.filterMode = u, Number.isInteger(d) && (t.state.selectedFileIndex = d), t.state.status = {
        mode: "ready",
        message: S("EIDOLON.TileCriteria.Saved", "Tile criteria rules saved.")
      }, Ve(t), Zc(t);
    } catch (o) {
      console.error(`${ie} | Failed to save tile criteria`, o), n.status = {
        mode: "error",
        message: (o == null ? void 0 : o.message) ?? "Failed to save tile criteria rules."
      }, Ve(t);
    }
  }, "handleSave"), a = /* @__PURE__ */ c(async () => {
    try {
      await Xc(t.tile, null);
      const o = n.filterQuery, s = n.filterMode, l = n.selectedFileIndex;
      t.state = cl(t.tile), t.state.filterQuery = o, t.state.filterMode = s, Number.isInteger(l) && (t.state.selectedFileIndex = l), t.state.status = {
        mode: "ready",
        message: S("EIDOLON.TileCriteria.Cleared", "Tile criteria rules cleared.")
      }, Ve(t), Zc(t);
    } catch (o) {
      console.error(`${ie} | Failed to clear tile criteria`, o), n.status = {
        mode: "error",
        message: (o == null ? void 0 : o.message) ?? "Failed to clear tile criteria rules."
      }, Ve(t);
    }
  }, "handleClear");
  if (e.appendChild(jg(n, t, i, {
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
c(Ve, "renderController");
function Bg(t, e = null) {
  const n = document.createElement("section");
  n.classList.add("eidolon-tile-criteria");
  const i = cl(t);
  Eg(i, wg(e));
  const r = {
    app: e,
    tile: t,
    section: n,
    state: i
  };
  return Ve(r), r;
}
c(Bg, "createController");
function Ug(t, e) {
  return sc(
    t,
    e,
    ll,
    S("EIDOLON.TileCriteria.TabLabel", "Criteria"),
    vg
  );
}
c(Ug, "ensureTileCriteriaTab");
function Vg() {
  Hooks.on("renderTileConfig", (t, e) => {
    var l, u, d, f;
    const n = kt(e);
    if (!n) return;
    const i = Cg(t);
    if (!i) return;
    if ((l = n.querySelector(".eidolon-tile-criteria")) == null || l.remove(), !Do()) {
      (u = n.querySelector(`.item[data-tab='${ll}']`)) == null || u.remove(), (d = n.querySelector(`.tab[data-tab='${ll}']`)) == null || d.remove();
      return;
    }
    const r = Bg(i, t), a = Ug(t, n);
    if (a instanceof HTMLElement) {
      a.replaceChildren(r.section), (f = t.setPosition) == null || f.call(t, { height: "auto" });
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
function Kg() {
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
      visible: Ro(((i = game.scenes) == null ? void 0 : i.viewed) ?? null),
      onClick: /* @__PURE__ */ c(() => oc(), "onClick")
    }));
  });
}
c(Kg, "registerSceneControlButton");
function sa(t, e) {
  if (!t || typeof t != "object") return !1;
  const n = String(e).split(".");
  let i = t;
  for (const r of n) {
    if (!i || typeof i != "object" || !Object.prototype.hasOwnProperty.call(i, r)) return !1;
    i = i[r];
  }
  return !0;
}
c(sa, "hasOwnPath");
function Jg() {
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
    (sa(r, `flags.${ie}.tileCriteria`) || sa(r, `flags.${ie}.fileIndex`)) && t((i == null ? void 0 : i.parent) ?? null, i ?? null);
  });
  const n = /* @__PURE__ */ c((i) => {
    Hooks.on(`create${i}`, (r) => {
      e((r == null ? void 0 : r.parent) ?? null, r ?? null);
    }), Hooks.on(`delete${i}`, (r) => {
      e((r == null ? void 0 : r.parent) ?? null, r ?? null);
    }), Hooks.on(`update${i}`, (r, a) => {
      const o = sa(a, `flags.${ie}.presets`), s = i === "AmbientLight" && sa(a, `flags.${ie}.lightCriteria`);
      !o && !s || e((r == null ? void 0 : r.parent) ?? null, r ?? null);
    });
  }, "registerPlaceableHooks");
  n("AmbientLight"), n("Wall"), n("AmbientSound"), Hooks.on("canvasReady", (i) => {
    const r = (i == null ? void 0 : i.scene) ?? null;
    r && (t(r), e(r));
  });
}
c(Jg, "registerCriteriaCacheInvalidationHooks");
function Yg() {
  Kg(), Vg(), Jg(), Hooks.once("init", () => {
    var t, e;
    (e = (t = game.keybindings) == null ? void 0 : t.register) == null || e.call(t, ie, "toggleCriteriaSwitcher", {
      name: "Toggle Criteria Switcher",
      hint: "Open or close the criteria switcher window for live scene state updates.",
      editable: [{ key: "KeyM", modifiers: ["Alt"] }],
      onDown: /* @__PURE__ */ c(() => {
        var n, i, r;
        return Ro(((n = game.scenes) == null ? void 0 : n.viewed) ?? null) ? (oc(), !0) : ((r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "You do not have permission to manage scene criteria."), !0);
      }, "onDown"),
      restricted: !0,
      precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
    });
  }), Hooks.on("canvasReady", (t) => {
    var n;
    const e = jo();
    e && (e.setScene((t == null ? void 0 : t.scene) ?? ((n = game.scenes) == null ? void 0 : n.viewed) ?? null), e.render({ force: !0 }));
  }), Hooks.once("ready", () => {
    var e, n;
    const t = (n = (e = game.modules) == null ? void 0 : e.get) == null ? void 0 : n.call(e, ie);
    t && (t.api || (t.api = {}), t.api.criteria = cg, console.log(`${ie} | Criteria engine API registered`));
  });
}
c(Yg, "registerCriteriaEngineHooks");
Yg();
const Ea = /* @__PURE__ */ new WeakMap(), la = /* @__PURE__ */ new WeakMap(), ge = "__eidolon_default__";
function Xg() {
  Hooks.on("renderAmbientLightConfig", Qg), N("LightCriteria | AmbientLightConfig controls registered");
}
c(Xg, "registerAmbientLightCriteriaControls");
function Qg(t, e) {
  var n;
  Vi("LightCriteria | renderAmbientLightConfig", {
    appId: (t == null ? void 0 : t.id) ?? null,
    constructor: ((n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) ?? null,
    isRendered: (t == null ? void 0 : t.rendered) ?? !1
  });
  try {
    const i = kt(e);
    if (!i) return;
    if (!Do()) {
      i.querySelectorAll(".eidolon-light-criteria, .eidolon-light-criteria-main-switcher").forEach((r) => r.remove());
      return;
    }
    Zg(t, i);
  } catch (i) {
    console.error("eidolon-utilities | Failed to enhance AmbientLightConfig UI", i);
  } finally {
    kn();
  }
}
c(Qg, "handleAmbientLightConfigRender");
function Zg(t, e) {
  var Me, Bn, Zi, Zr, Ic;
  const n = (t == null ? void 0 : t.form) instanceof HTMLFormElement ? t.form : e instanceof HTMLFormElement ? e : (Me = e == null ? void 0 : e.closest) == null ? void 0 : Me.call(e, "form");
  if (!(n instanceof HTMLFormElement)) return;
  const i = n.querySelector(".window-content");
  if (!(i instanceof HTMLElement)) return;
  const r = sf(t);
  if (!r) return;
  const a = Ep(r);
  N("LightCriteria | Resolved ambient light", {
    sheetId: (r == null ? void 0 : r.id) ?? null,
    persistedId: (a == null ? void 0 : a.id) ?? null,
    sameRef: r === a
  });
  const o = (a == null ? void 0 : a.parent) ?? r.parent ?? null, s = o ? rh(o) : [], l = s.filter(
    ($) => Array.isArray($ == null ? void 0 : $.values) && $.values.length > 0
  ), u = dp(s), d = s.map(($) => typeof ($ == null ? void 0 : $.id) == "string" ? $.id : null).filter(($) => !!$), f = a ?? r, h = o ? dt(o) : [];
  let g = Pd(f);
  const p = Bh(g, h);
  JSON.stringify(p) !== JSON.stringify(g) && (g = p, Rd(f, p).catch(($) => {
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
    Z.classList.add("eidolon-light-criteria__filter-name"), Z.textContent = (Zi = (Bn = $.name) == null ? void 0 : Bn.trim) != null && Zi.call(Bn) ? $.name.trim() : S("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), G.appendChild(Z);
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
  const J = document.createElement("div");
  J.classList.add("eidolon-light-criteria__switcher-controls"), M.appendChild(J);
  const ae = document.createElement("select");
  ae.id = R, ae.classList.add("eidolon-light-criteria__select"), ae.dataset.action = "select-mapping", J.appendChild(ae);
  const Q = document.createElement("button");
  Q.type = "button", Q.dataset.action = "apply-selected-mapping", Q.classList.add("eidolon-light-criteria__button", "secondary"), Q.textContent = S("EIDOLON.LightCriteria.ApplyButton", "Apply"), J.appendChild(Q);
  const te = document.createElement("details");
  te.classList.add("eidolon-light-criteria__menu"), te.dataset.action = "mapping-actions-menu";
  const zt = document.createElement("summary");
  zt.classList.add("eidolon-light-criteria__menu-toggle"), zt.innerHTML = '<i class="fa-solid fa-ellipsis-vertical" inert=""></i>', zt.setAttribute(
    "aria-label",
    S("EIDOLON.LightCriteria.MoreActions", "More actions")
  ), zt.dataset.tooltip = S("EIDOLON.LightCriteria.MoreActions", "More actions"), te.appendChild(zt);
  const ft = document.createElement("div");
  ft.classList.add("eidolon-light-criteria__menu-list"), te.appendChild(ft);
  const xe = document.createElement("button");
  xe.type = "button", xe.dataset.action = "update-selected-mapping", xe.classList.add("eidolon-light-criteria__menu-item"), xe.textContent = S(
    "EIDOLON.LightCriteria.UpdateSelected",
    "Save current config to selected"
  ), ft.appendChild(xe);
  const et = document.createElement("button");
  et.type = "button", et.dataset.action = "edit-selected-mapping-criteria", et.classList.add("eidolon-light-criteria__menu-item"), et.textContent = S(
    "EIDOLON.LightCriteria.EditSelectedCriteria",
    "Edit selected mapping criteria"
  ), ft.appendChild(et);
  const tt = document.createElement("button");
  tt.type = "button", tt.dataset.action = "remove-selected-mapping", tt.classList.add("eidolon-light-criteria__menu-item", "danger"), tt.textContent = S(
    "EIDOLON.LightCriteria.RemoveSelected",
    "Delete selected mapping"
  ), ft.appendChild(tt), J.appendChild(te);
  const Wt = document.createElement("div");
  Wt.classList.add("eidolon-light-criteria-main-switcher"), Wt.appendChild(M);
  const ze = document.createElement("p");
  if (ze.classList.add("notes", "eidolon-light-criteria-main-switcher__empty"), ze.textContent = S(
    "EIDOLON.LightCriteria.ActiveRequiresBase",
    "Set Base Lighting to enable mapping selection and actions."
  ), Wt.appendChild(ze), s.length === 0) {
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
  const Ei = document.createElement("p");
  Ei.classList.add("notes"), Ei.textContent = S(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ), Le.appendChild(Ei);
  const Kt = document.createElement("div");
  Kt.classList.add("eidolon-light-criteria__category-list"), Le.appendChild(Kt);
  for (const $ of l) {
    const G = document.createElement("label");
    G.classList.add("eidolon-light-criteria__category");
    const Z = document.createElement("span");
    Z.classList.add("eidolon-light-criteria__category-name"), Z.textContent = (Ic = (Zr = $.name) == null ? void 0 : Zr.trim) != null && Ic.call(Zr) ? $.name.trim() : S("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), G.appendChild(Z);
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
    G.appendChild(ee), Kt.appendChild(G);
  }
  const jn = document.createElement("div");
  jn.classList.add("eidolon-light-criteria__creation-actions");
  const nt = document.createElement("button");
  nt.type = "button", nt.dataset.action = "save-mapping", nt.classList.add("eidolon-light-criteria__button", "primary"), nt.textContent = S(
    "EIDOLON.LightCriteria.SaveMapping",
    "Save Mapping"
  ), jn.appendChild(nt);
  const Jt = document.createElement("button");
  Jt.type = "button", Jt.dataset.action = "cancel-create", Jt.classList.add("eidolon-light-criteria__button", "secondary"), Jt.textContent = S(
    "EIDOLON.LightCriteria.Cancel",
    "Cancel"
  ), jn.appendChild(Jt), Le.appendChild(jn), w.appendChild(Le), i.prepend(Wt), i.appendChild(w), w.hidden = !0, np(t, {
    fieldset: w,
    homeContainer: i
  }), requestAnimationFrame(() => {
    var $;
    ($ = t.setPosition) == null || $.call(t, { height: "auto" });
  });
  let P = g;
  Gn({ switcher: M, emptyState: ze, state: P }), Vn(O, P), ir(A, {
    state: P,
    hasCategories: l.length > 0
  }), N("LightCriteria | Controls injected", {
    sceneId: (o == null ? void 0 : o.id) ?? null,
    lightId: (r == null ? void 0 : r.id) ?? null,
    hasBase: !!(P != null && P.base),
    mappingCount: Array.isArray(P == null ? void 0 : P.mappings) ? P.mappings.length : 0,
    categories: l.length
  });
  const Xr = yp(P), X = {
    restoreConfig: null,
    app: t,
    selectedMapping: Xr,
    editorMode: "create",
    editingMappingId: null,
    mappingFilters: {}
  };
  Ea.set(w, X);
  const mt = /* @__PURE__ */ c(() => {
    te.open = !1;
  }, "closeActionsMenu");
  zt.addEventListener("click", ($) => {
    te.classList.contains("is-disabled") && ($.preventDefault(), mt());
  });
  const ke = /* @__PURE__ */ c(($ = X.selectedMapping) => {
    const G = fp(W), Z = Array.isArray(P == null ? void 0 : P.mappings) ? P.mappings : [], ee = hp(Z, G), ne = Object.keys(G).length;
    X.mappingFilters = G, U.disabled = ne === 0, gp(H, {
      totalCount: Z.length,
      visibleCount: ee.length,
      hasFilters: ne > 0,
      activeFilterCount: ne
    }), D.classList.toggle("has-active-filters", ne > 0), pp(ae, P, u, $, {
      mappings: ee,
      categoryOrder: d
    }), X.selectedMapping = ae.value ?? "", ds({
      mappingSelect: ae,
      applyMappingButton: Q,
      updateMappingButton: xe,
      editCriteriaButton: et,
      removeMappingButton: tt,
      actionsMenu: te,
      state: P
    }), te.classList.contains("is-disabled") && mt();
  }, "refreshMappingSelector");
  W.querySelectorAll("select[data-filter-category-id]").forEach(($) => {
    $.addEventListener("change", () => {
      const G = X.selectedMapping;
      ke(G), X.selectedMapping !== G && fs(
        a ?? r,
        P,
        X.selectedMapping
      ).then((Z) => {
        Z && (P = Z);
      });
    });
  }), U.addEventListener("click", () => {
    mp(W);
    const $ = X.selectedMapping;
    ke($), D.open = !1, X.selectedMapping !== $ && fs(
      a ?? r,
      P,
      X.selectedMapping
    ).then((G) => {
      G && (P = G);
    });
  }), ae.addEventListener("change", () => {
    X.selectedMapping = ae.value ?? "", ds({
      mappingSelect: ae,
      applyMappingButton: Q,
      updateMappingButton: xe,
      editCriteriaButton: et,
      removeMappingButton: tt,
      actionsMenu: te,
      state: P
    }), fs(
      a ?? r,
      P,
      X.selectedMapping
    ).then(($) => {
      $ && (P = $);
    });
  });
  const Qi = /* @__PURE__ */ c(async () => {
    var ee, ne, ce, ue, it, sn, rt, ln, he, cn, un, _t, Un, er;
    const $ = ae.value ?? "";
    if (!$) {
      (ne = (ee = ui.notifications) == null ? void 0 : ee.warn) == null || ne.call(
        ee,
        S(
          "EIDOLON.LightCriteria.SelectMappingWarning",
          "Choose a criteria mapping before applying."
        )
      ), ke(X.selectedMapping);
      return;
    }
    if ($ === ge) {
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
      ca(w, Le, A), Ca(t, n, P.base), P = await dr(a ?? r, {
        mappingId: ge,
        categories: null,
        updatedAt: Date.now()
      }), X.selectedMapping = ge, ke(X.selectedMapping), Vn(O, P), Gn({ switcher: M, emptyState: ze, state: P }), ir(A, {
        state: P,
        hasCategories: l.length > 0
      }), tu(n, {
        mappingId: ge,
        color: ((sn = (it = P.base) == null ? void 0 : it.config) == null ? void 0 : sn.color) ?? null
      }), (ln = (rt = ui.notifications) == null ? void 0 : rt.info) == null || ln.call(
        rt,
        S(
          "EIDOLON.LightCriteria.BaseApplied",
          "Applied the base lighting state to the form."
        )
      ), mt();
      return;
    }
    const G = Array.isArray(P == null ? void 0 : P.mappings) && P.mappings.length ? P.mappings.find((Si) => (Si == null ? void 0 : Si.id) === $) : null;
    if (!G) {
      (cn = (he = ui.notifications) == null ? void 0 : he.warn) == null || cn.call(
        he,
        S(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      ), X.selectedMapping = "", ke(X.selectedMapping);
      return;
    }
    ca(w, Le, A), Ca(t, n, G.config), P = await dr(a ?? r, {
      mappingId: G.id,
      categories: G.categories,
      updatedAt: Date.now()
    }), X.selectedMapping = G.id, ke(X.selectedMapping), Vn(O, P), Gn({ switcher: M, emptyState: ze, state: P }), ir(A, {
      state: P,
      hasCategories: l.length > 0
    }), tu(n, {
      mappingId: G.id,
      color: ((_t = (un = G.config) == null ? void 0 : un.config) == null ? void 0 : _t.color) ?? null
    });
    const Z = Di(G, u, d);
    (er = (Un = ui.notifications) == null ? void 0 : Un.info) == null || er.call(
      Un,
      S(
        "EIDOLON.LightCriteria.MappingApplied",
        "Applied mapping: {label}"
      ).replace("{label}", Z)
    ), mt();
  }, "applySelectedMapping");
  Q.addEventListener("click", () => {
    Qi();
  }), ae.addEventListener("keydown", ($) => {
    $.key === "Enter" && ($.preventDefault(), Qi());
  });
  const Qr = /* @__PURE__ */ c(async () => {
    var G, Z, ee, ne, ce, ue, it, sn, rt, ln, he, cn, un, _t, Un, er, Si, ea, Oc, ta, Ac;
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
    xe.disabled = !0;
    try {
      const We = Sa(t, a);
      if ($ === ge)
        P = await zc(a ?? r, We), N("LightCriteria | Base lighting updated", {
          lightId: ((ee = a ?? r) == null ? void 0 : ee.id) ?? null,
          configColor: ((ne = We == null ? void 0 : We.config) == null ? void 0 : ne.color) ?? null
        }), (ue = (ce = ui.notifications) == null ? void 0 : ce.info) == null || ue.call(
          ce,
          S(
            "EIDOLON.LightCriteria.BaseUpdated",
            "Updated the base lighting state with the current configuration."
          )
        ), X.selectedMapping = ge;
      else {
        const Ci = fr(P, $);
        if (!Ci) {
          (sn = (it = ui.notifications) == null ? void 0 : it.warn) == null || sn.call(
            it,
            S(
              "EIDOLON.LightCriteria.MappingUnavailable",
              "The selected criteria mapping is no longer available."
            )
          ), X.selectedMapping = "", ke(X.selectedMapping);
          return;
        }
        P = await Wc(
          a ?? r,
          Ci.categories,
          We,
          { label: Ci.label ?? null }
        ), N("LightCriteria | Mapping updated", {
          mappingId: $,
          hasColor: !!((rt = We == null ? void 0 : We.config) != null && rt.color),
          stored: Array.isArray(P == null ? void 0 : P.mappings) ? ((ln = P.mappings.find((Xo) => (Xo == null ? void 0 : Xo.id) === $)) == null ? void 0 : ln.config) ?? null : null,
          persisted: (cn = (he = a ?? r) == null ? void 0 : he.getFlag) == null ? void 0 : cn.call(he, fi, Fi)
        });
        const tr = fr(P, $), ym = Di(tr || Ci, u, d);
        N("LightCriteria | Mapping updated", {
          mappingId: $,
          categories: Ci.categories,
          updatedColor: ((un = We == null ? void 0 : We.config) == null ? void 0 : un.color) ?? null,
          storedColor: ((Un = (_t = tr == null ? void 0 : tr.config) == null ? void 0 : _t.config) == null ? void 0 : Un.color) ?? ((Si = (er = Ci.config) == null ? void 0 : er.config) == null ? void 0 : Si.color) ?? null
        }), (Oc = (ea = ui.notifications) == null ? void 0 : ea.info) == null || Oc.call(
          ea,
          S(
            "EIDOLON.LightCriteria.MappingUpdated",
            "Saved changes to mapping: {label}"
          ).replace("{label}", ym)
        ), X.selectedMapping = $;
      }
      Vn(O, P), Gn({ switcher: M, emptyState: ze, state: P }), ir(A, {
        state: P,
        hasCategories: l.length > 0
      }), ke(X.selectedMapping), mt();
    } catch (We) {
      console.error("eidolon-utilities | Failed to update light criteria mapping", We), (Ac = (ta = ui.notifications) == null ? void 0 : ta.error) == null || Ac.call(
        ta,
        S(
          "EIDOLON.LightCriteria.MappingUpdateError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      xe.disabled = !1, ds({
        mappingSelect: ae,
        applyMappingButton: Q,
        updateMappingButton: xe,
        editCriteriaButton: et,
        removeMappingButton: tt,
        actionsMenu: te,
        state: P
      });
    }
  }, "updateSelectedMapping");
  xe.addEventListener("click", () => {
    Qr();
  }), ke(X.selectedMapping), L.addEventListener("click", async () => {
    var $, G, Z, ee, ne, ce;
    L.disabled = !0;
    try {
      const ue = Sa(t, a);
      P = await zc(a ?? r, ue), N("LightCriteria | Base lighting stored", {
        lightId: (($ = a ?? r) == null ? void 0 : $.id) ?? null,
        configColor: ((G = ue == null ? void 0 : ue.config) == null ? void 0 : G.color) ?? null
      }), (ee = (Z = ui.notifications) == null ? void 0 : Z.info) == null || ee.call(
        Z,
        S(
          "EIDOLON.LightCriteria.BaseStored",
          "Saved the current configuration as the base lighting state."
        )
      ), Vn(O, P), Gn({ switcher: M, emptyState: ze, state: P }), ir(A, {
        state: P,
        hasCategories: l.length > 0
      }), X.selectedMapping = ge, ke(X.selectedMapping);
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
    const $ = Ea.get(w);
    eu({
      app: t,
      fieldset: w,
      createButton: A,
      creationSection: Le,
      categoryList: Kt,
      form: n,
      persistedLight: a,
      stateEntry: $,
      mode: "create",
      mapping: null,
      preloadConfig: P.base
    });
  }), et.addEventListener("click", () => {
    var Z, ee, ne, ce;
    const $ = X.selectedMapping;
    if (!$ || $ === ge) {
      (ee = (Z = ui.notifications) == null ? void 0 : Z.warn) == null || ee.call(
        Z,
        S(
          "EIDOLON.LightCriteria.SelectMappingForCriteriaEdit",
          "Select a mapping before editing criteria."
        )
      );
      return;
    }
    const G = fr(P, $);
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
    mt(), of(t, { fieldset: w, homeContainer: i }), eu({
      app: t,
      fieldset: w,
      createButton: A,
      creationSection: Le,
      categoryList: Kt,
      form: n,
      persistedLight: a,
      stateEntry: X,
      mode: "retarget",
      mapping: G,
      preloadConfig: G.config
    });
  }), nt.addEventListener("click", async () => {
    var G, Z, ee, ne, ce, ue, it, sn, rt, ln;
    const $ = wp(Kt);
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
    nt.disabled = !0;
    try {
      const he = Sa(t, a);
      if (X.editorMode === "retarget" && X.editingMappingId) {
        const un = fl(P, $);
        let _t = !1;
        if (un && un !== X.editingMappingId && (_t = await ep(), !_t)) {
          nt.disabled = !1;
          return;
        }
        P = await Hh(
          a ?? r,
          X.editingMappingId,
          $,
          he,
          { replaceExisting: _t }
        ), N("LightCriteria | Mapping criteria retargeted", {
          mappingId: X.editingMappingId,
          categories: $,
          replaced: _t,
          configColor: ((ee = he == null ? void 0 : he.config) == null ? void 0 : ee.color) ?? null
        }), (ce = (ne = ui.notifications) == null ? void 0 : ne.info) == null || ce.call(
          ne,
          S(
            "EIDOLON.LightCriteria.MappingCriteriaUpdated",
            "Updated mapping criteria for the selected mapping."
          )
        );
      } else
        P = await Wc(
          a ?? r,
          $,
          he,
          {}
        ), N("LightCriteria | Mapping saved from editor", {
          categories: $,
          configColor: ((ue = he == null ? void 0 : he.config) == null ? void 0 : ue.color) ?? null
        }), (sn = (it = ui.notifications) == null ? void 0 : it.info) == null || sn.call(
          it,
          S(
            "EIDOLON.LightCriteria.MappingSaved",
            "Updated lighting mapping for the selected scene criteria."
          )
        );
      Vn(O, P), Gn({ switcher: M, emptyState: ze, state: P });
      const cn = fl(P, $);
      cn && (X.selectedMapping = cn), ke(X.selectedMapping), ca(w, Le, A), mt();
    } catch (he) {
      console.error("eidolon-utilities | Failed to persist light criteria mapping", he), (ln = (rt = ui.notifications) == null ? void 0 : rt.error) == null || ln.call(
        rt,
        S(
          "EIDOLON.LightCriteria.MappingError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      nt.disabled = !1;
    }
  }), Jt.addEventListener("click", () => {
    const $ = Ea.get(w);
    $ != null && $.restoreConfig && Ca(t, n, $.restoreConfig), ca(w, Le, A);
  }), tt.addEventListener("click", async () => {
    var Z, ee;
    const $ = X.selectedMapping;
    !$ || $ === ge || !await tp() || (P = await qh(a ?? r, $), X.selectedMapping = "", Vn(O, P), Gn({ switcher: M, emptyState: ze, state: P }), ke(X.selectedMapping), mt(), (ee = (Z = ui.notifications) == null ? void 0 : Z.info) == null || ee.call(
      Z,
      S("EIDOLON.LightCriteria.MappingRemoved", "Removed selected mapping.")
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
  s && (s.restoreConfig = Sa(t, o), s.editorMode = l, s.editingMappingId = l === "retarget" ? (u == null ? void 0 : u.id) ?? null : null), d && Ca(t, a, d), l === "retarget" && (u != null && u.categories) ? vp(r, u.categories) : bp(r);
  const f = i.querySelector("p.notes");
  f instanceof HTMLElement && (f.textContent = l === "retarget" ? S(
    "EIDOLON.LightCriteria.EditCriteriaDescription",
    "Adjust criteria values for the selected mapping."
  ) : S(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const h = i.querySelector('button[data-action="save-mapping"]');
  h instanceof HTMLButtonElement && (h.textContent = l === "retarget" ? S("EIDOLON.LightCriteria.SaveCriteriaChanges", "Save Criteria Changes") : S("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), i.hidden = !1, n.setAttribute("aria-expanded", "true"), lc(e, i), requestAnimationFrame(() => {
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
c(ep, "confirmCriteriaConflict");
async function tp() {
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
c(tp, "confirmRemoveMapping");
function np(t, { fieldset: e, homeContainer: n }) {
  const i = ap(t, n);
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
    o.preventDefault(), of(t, { fieldset: e, homeContainer: n });
  };
}
c(np, "ensureManagerHeaderButton");
function of(t, { fieldset: e, homeContainer: n }) {
  var h, g, p;
  const i = la.get(t);
  if (i != null && i.rendered) {
    (h = i.bringToTop) == null || h.call(i);
    return;
  }
  const r = /* @__PURE__ */ c((...y) => {
    var b;
    const w = ip(y), v = (b = w == null ? void 0 : w.querySelector) == null ? void 0 : b.call(w, ".eidolon-light-criteria-manager-host");
    v instanceof HTMLElement && (rp(e), e.hidden = !1, v.appendChild(e));
  }, "onRender"), a = /* @__PURE__ */ c(() => {
    n instanceof HTMLElement && n.appendChild(e), e.hidden = !0, la.delete(t), requestAnimationFrame(() => {
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
      la.set(t, {
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
  const f = new d(
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
  la.set(t, f), f.render(!0);
}
c(of, "openManagerDialog");
function ip(t) {
  for (const e of t) {
    const n = kt(e);
    if (n) return n;
    const i = kt(e == null ? void 0 : e.element);
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
  if (d.classList.add("eidolon-light-criteria-manager__header"), d.textContent = S("EIDOLON.LightCriteria.ManagerHeader", "Base State"), l.appendChild(d), r && l.appendChild(r), i && l.appendChild(i), o.length) {
    const h = document.createElement("div");
    h.classList.add("eidolon-light-criteria-manager__warnings");
    for (const g of o) h.appendChild(g);
    l.appendChild(h);
  }
  const f = document.createElement("div");
  f.classList.add("eidolon-light-criteria-manager__header"), f.textContent = S("EIDOLON.LightCriteria.ManagerAuthoring", "Create or Update Mapping"), u.appendChild(f), a && u.appendChild(a), t.innerHTML = "", e && t.appendChild(e), n && t.appendChild(n), t.appendChild(s), lc(t, a);
}
c(rp, "applyManagerLayout");
function ap(t, e) {
  var i;
  const n = kt(t == null ? void 0 : t.element);
  return n || (((i = e == null ? void 0 : e.closest) == null ? void 0 : i.call(e, ".application")) ?? null);
}
c(ap, "resolveApplicationRoot");
function ca(t, e, n) {
  const i = Ea.get(t);
  i && (i.restoreConfig = null, i.editorMode = "create", i.editingMappingId = null), e.hidden = !0, n.setAttribute("aria-expanded", "false");
  const r = e.querySelector("p.notes");
  r instanceof HTMLElement && (r.textContent = S(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const a = e.querySelector('button[data-action="save-mapping"]');
  a instanceof HTMLButtonElement && (a.textContent = S("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), lc(t, e), requestAnimationFrame(() => {
    var o, s;
    (s = (o = i == null ? void 0 : i.app) == null ? void 0 : o.setPosition) == null || s.call(o, { height: "auto" });
  });
}
c(ca, "hideCreationSection");
function Vn(t, e) {
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
c(Vn, "updateStatusLine");
function ir(t, { state: e, hasCategories: n }) {
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
c(ir, "updateCreateButtonState");
function Sa(t, e) {
  var l, u, d;
  const n = e ?? sf(t);
  if (!n)
    throw new Error("Ambient light document unavailable.");
  const i = yi(((l = n.toObject) == null ? void 0 : l.call(n)) ?? {});
  if (!i)
    throw new Error("Unable to duplicate ambient light data.");
  const r = (t == null ? void 0 : t.form) instanceof HTMLFormElement ? t.form : null, a = r ? Vm(r) : {}, o = foundry.utils.mergeObject(i, a, {
    inplace: !1,
    performDeletions: !0
  });
  r && (r.querySelectorAll("color-picker[name]").forEach((f) => {
    var v, b;
    const h = f.getAttribute("name");
    if (!h) return;
    const g = typeof f.value == "string" ? f.value : "", p = ((v = f.ui) == null ? void 0 : v.input) ?? ((b = f.querySelector) == null ? void 0 : b.call(f, 'input[type="color"]')), y = (p == null ? void 0 : p.value) ?? "", w = g || y;
    typeof w != "string" || !w || (foundry.utils.setProperty(o, h, w), N("LightCriteria | Captured color-picker value", {
      path: h,
      pickerValue: g,
      swatchValue: y,
      chosenValue: w
    }));
  }), r.querySelectorAll("range-picker[name]").forEach((f) => {
    var A, O;
    const h = f.getAttribute("name");
    if (!h) return;
    const g = f.value !== void 0 && f.value !== null ? String(f.value) : "", p = (A = f.querySelector) == null ? void 0 : A.call(f, 'input[type="range"]'), y = (O = f.querySelector) == null ? void 0 : O.call(f, 'input[type="number"]'), w = p instanceof HTMLInputElement ? p.value : "", v = y instanceof HTMLInputElement ? y.value : "", b = g || v || w;
    if (typeof b != "string" || !b.length) return;
    const E = Number(b), L = Number.isFinite(E) ? E : b;
    foundry.utils.setProperty(o, h, L), N("LightCriteria | Captured range-picker value", {
      path: h,
      elementValue: g,
      numberValue: v,
      rangeValue: w,
      chosenValue: L
    });
  }));
  const s = yi(o);
  return N("LightCriteria | Captured form config", {
    lightId: (n == null ? void 0 : n.id) ?? null,
    hasColor: !!((u = s == null ? void 0 : s.config) != null && u.color),
    color: ((d = s == null ? void 0 : s.config) == null ? void 0 : d.color) ?? null
  }), s;
}
c(Sa, "captureAmbientLightFormConfig");
function Ca(t, e, n) {
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
c(Ca, "applyConfigToForm");
function op(t, e, n) {
  const i = t.type;
  if (i === "checkbox") {
    const o = !!e;
    t.checked !== o && (t.checked = o, At(t));
    return;
  }
  if (i === "radio") {
    const o = e == null ? "" : String(e), s = t.value === o;
    t.checked !== s && (t.checked = s, s && At(t));
    return;
  }
  const r = e == null ? "" : String(e);
  let a = !1;
  t.value !== r && (t.value = r, a = !0), a && At(t);
}
c(op, "applyValueToInput");
function sp(t, e, n) {
  var s, l, u, d, f, h;
  const i = e == null ? "" : String(e);
  let r = !1;
  t.value !== i && (t.value = i, t.setAttribute("value", i), (s = t.ui) != null && s.setValue && t.ui.setValue(i), r = !0);
  const a = ((l = t.ui) == null ? void 0 : l.input) ?? ((u = t.querySelector) == null ? void 0 : u.call(t, 'input[type="color"]'));
  a instanceof HTMLInputElement && a.value !== i && (a.value = i, At(a));
  const o = ((d = t.ui) == null ? void 0 : d.text) ?? ((f = t.querySelector) == null ? void 0 : f.call(t, 'input[type="text"]'));
  o instanceof HTMLInputElement && o.value !== i && (o.value = i, At(o)), (h = t.ui) != null && h.commit ? t.ui.commit() : (t.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), t.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }))), N("LightCriteria | Color picker applied", {
    value: i,
    pickerValue: t.value ?? null,
    swatchValue: (a == null ? void 0 : a.value) ?? null,
    textValue: (o == null ? void 0 : o.value) ?? null
  }), r && At(t);
}
c(sp, "applyValueToColorPicker");
function lp(t, e, n) {
  var u, d;
  const i = e == null ? "" : String(e), r = Number(i), a = Number.isFinite(r) ? r : i;
  let o = !1;
  t.value !== void 0 && t.value !== a && (t.value = a, o = !0), t.getAttribute("value") !== i && (t.setAttribute("value", i), o = !0);
  const s = (u = t.querySelector) == null ? void 0 : u.call(t, 'input[type="range"]');
  s instanceof HTMLInputElement && s.value !== i && (s.value = i, At(s));
  const l = (d = t.querySelector) == null ? void 0 : d.call(t, 'input[type="number"]');
  if (l instanceof HTMLInputElement && l.value !== i && (l.value = i, At(l)), typeof t.commit == "function")
    try {
      t.commit();
    } catch (f) {
      console.error("eidolon-utilities | range-picker commit failed", f);
    }
  N("LightCriteria | Range picker applied", {
    value: i,
    resolvedValue: a,
    rangeValue: (s == null ? void 0 : s.value) ?? null,
    numberValue: (l == null ? void 0 : l.value) ?? null
  }), o && At(t);
}
c(lp, "applyValueToRangePicker");
function cp(t, e, n) {
  const i = e == null ? "" : String(e);
  t.value !== i && (t.value = i, At(t));
}
c(cp, "applyValueToSelect");
function up(t, e, n) {
  const i = e == null ? "" : String(e);
  t.value !== i && (t.value = i, At(t));
}
c(up, "applyValueToTextarea");
function At(t) {
  t.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), t.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }));
}
c(At, "triggerInputChange");
function ds({
  mappingSelect: t,
  applyMappingButton: e,
  updateMappingButton: n,
  editCriteriaButton: i,
  removeMappingButton: r,
  actionsMenu: a,
  state: o
}) {
  const s = (t == null ? void 0 : t.value) ?? "", l = !!(o != null && o.base), u = s && s !== ge ? !!fr(o, s) : !1;
  if (e instanceof HTMLButtonElement && (s ? s === ge ? e.disabled = !l : e.disabled = !u : e.disabled = !0), n instanceof HTMLButtonElement && (s ? s === ge ? n.disabled = !1 : n.disabled = !u : n.disabled = !0), i instanceof HTMLButtonElement && (i.disabled = !s || s === ge || !u), r instanceof HTMLButtonElement && (r.disabled = !s || s === ge || !u), a instanceof HTMLElement) {
    const d = n instanceof HTMLButtonElement && !n.disabled || i instanceof HTMLButtonElement && !i.disabled || r instanceof HTMLButtonElement && !r.disabled;
    a.classList.toggle("is-disabled", !d), !d && "open" in a && (a.open = !1);
  }
}
c(ds, "syncMappingSwitcherState");
function dp(t) {
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
c(gp, "updateMappingFilterMeta");
function pp(t, e, n, i, r = {}) {
  if (!(t instanceof HTMLSelectElement)) return;
  const a = typeof i == "string" ? i : "", o = !!(e != null && e.base), s = Array.isArray(r == null ? void 0 : r.categoryOrder) ? r.categoryOrder : [], l = Array.isArray(r == null ? void 0 : r.mappings) ? r.mappings.slice() : Array.isArray(e == null ? void 0 : e.mappings) ? e.mappings.slice() : [], u = t.value;
  t.innerHTML = "";
  const d = document.createElement("option");
  d.value = "", d.textContent = S(
    "EIDOLON.LightCriteria.SelectPlaceholder",
    "Select a mapping"
  ), d.disabled = o, t.appendChild(d);
  const f = document.createElement("option");
  f.value = ge, f.textContent = S(
    "EIDOLON.LightCriteria.BaseOption",
    "Base Lighting"
  ), f.disabled = !o, t.appendChild(f), l.slice().sort((y, w) => {
    var E;
    const v = Di(y, n, s), b = Di(w, n, s);
    return v.localeCompare(b, ((E = game.i18n) == null ? void 0 : E.lang) ?? void 0, {
      sensitivity: "base"
    });
  }).forEach((y) => {
    if (!(y != null && y.id)) return;
    const w = document.createElement("option");
    w.value = y.id, w.textContent = Di(y, n, s), t.appendChild(w);
  });
  const h = new Set(
    Array.from(t.options).filter((y) => !y.disabled).map((y) => y.value)
  ), g = o && u === "" ? "" : u, p = a || (h.has(g) ? g : "");
  p && h.has(p) ? t.value = p : o ? t.value = ge : t.value = "";
}
c(pp, "populateMappingSelector");
function Di(t, e, n = []) {
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
c(Di, "formatMappingOptionLabel");
function fl(t, e) {
  if (!t || typeof t != "object" || !Array.isArray(t.mappings)) return null;
  const n = Xi(e);
  if (!n) return null;
  const i = t.mappings.find((r) => (r == null ? void 0 : r.key) === n);
  return (i == null ? void 0 : i.id) ?? null;
}
c(fl, "findMappingIdByCategories");
function fr(t, e) {
  return !e || !t || typeof t != "object" || !Array.isArray(t.mappings) ? null : t.mappings.find((n) => (n == null ? void 0 : n.id) === e) ?? null;
}
c(fr, "getMappingById");
function yp(t) {
  if (!t || typeof t != "object") return "";
  const e = t.current;
  if (e != null && e.mappingId) {
    if (e.mappingId === ge)
      return t != null && t.base ? ge : "";
    if (Array.isArray(t.mappings) && t.mappings.some((n) => n.id === e.mappingId))
      return e.mappingId;
  }
  if (e != null && e.categories) {
    const n = fl(t, e.categories);
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
async function fs(t, e, n) {
  if (!t) return null;
  try {
    if (!n)
      return await dr(t, {});
    if (n === ge)
      return await dr(t, {
        mappingId: ge,
        categories: null,
        updatedAt: Date.now()
      });
    const i = fr(e, n);
    return i ? await dr(t, {
      mappingId: i.id,
      categories: i.categories,
      updatedAt: Date.now()
    }) : null;
  } catch (i) {
    return console.warn("eidolon-utilities | Failed to persist mapping selection", i), null;
  }
}
c(fs, "persistCurrentSelection");
function lc(t, e) {
  if (!(t instanceof HTMLElement)) return;
  const n = t.querySelector(".eidolon-light-criteria-manager__section.is-bottom");
  n instanceof HTMLElement && (n.hidden = !!(e != null && e.hidden));
}
c(lc, "updateManagerSectionVisibility");
function Gn({ switcher: t, emptyState: e, state: n }) {
  const i = !!(n != null && n.base);
  t instanceof HTMLElement && (t.hidden = !i), e instanceof HTMLElement && (e.hidden = i);
}
c(Gn, "updateActiveMappingVisibility");
function sf(t) {
  const e = (t == null ? void 0 : t.object) ?? (t == null ? void 0 : t.document) ?? null;
  return !(e != null && e.isEmbedded) || e.documentName !== "AmbientLight" ? null : e;
}
c(sf, "getAmbientLightDocument");
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
const ml = /* @__PURE__ */ new Map();
let hl = !1;
function cc(t, e) {
  ml.has(t) && console.warn(`[${T}] Socket handler for type "${t}" already registered, overwriting.`), ml.set(t, e);
}
c(cc, "registerSocketHandler");
function Ta(t, e) {
  if (!hl) {
    console.error(`[${T}] Socket not initialized. Call initializeSocket() first.`);
    return;
  }
  game.socket.emit(`module.${T}`, { type: t, payload: e });
}
c(Ta, "emitSocket");
function Cp() {
  hl || (game.socket.on(`module.${T}`, (t) => {
    const { type: e, payload: n } = t ?? {}, i = ml.get(e);
    i ? i(n) : console.warn(`[${T}] No socket handler for type "${e}"`);
  }), hl = !0, console.log(`[${T}] Socket initialized on channel module.${T}`));
}
c(Cp, "initializeSocket");
const lf = "tween", cf = "tween-sequence", gl = "tween-sequence-cancel", Ce = Object.freeze({
  ABORT: "abort",
  CONTINUE: "continue"
}), dn = Object.freeze({
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  FAILED: "failed"
}), ht = Object.freeze({
  BEFORE_ALL: "beforeAll",
  BEFORE_STEP: "before",
  ENTRY: "entry",
  AFTER_STEP: "after",
  RUNTIME: "runtime",
  VALIDATION: "validation",
  AWAIT: "await",
  EMIT: "emit",
  PARALLEL: "parallel"
}), Va = /* @__PURE__ */ new Map();
function Nt({ type: t, execute: e, validate: n }) {
  Va.has(t) && console.warn(`[tween-registry] Type "${t}" already registered, overwriting.`), Va.set(t, { type: t, execute: e, validate: n ?? (() => {
  }) });
}
c(Nt, "registerTweenType");
function wi(t) {
  return Va.get(t);
}
c(wi, "getTweenType");
function Tp(t, e = {}) {
  const n = wi(t);
  if (!n)
    throw new Error(`Unknown tween type: "${t}".`);
  return n.validate(e ?? {}), n;
}
c(Tp, "validateTweenEntry");
function pl() {
  return [...Va.keys()];
}
c(pl, "listTweenTypes");
const Pi = {
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
  easeInBounce: /* @__PURE__ */ c((t) => 1 - Pi.easeOutBounce(1 - t), "easeInBounce"),
  easeInOutBounce: /* @__PURE__ */ c((t) => t < 0.5 ? (1 - Pi.easeOutBounce(1 - 2 * t)) / 2 : (1 + Pi.easeOutBounce(2 * t - 1)) / 2, "easeInOutBounce"),
  easeInElastic: /* @__PURE__ */ c((t) => t === 0 || t === 1 ? t : -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI), "easeInElastic"),
  easeOutElastic: /* @__PURE__ */ c((t) => t === 0 || t === 1 ? t : Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1, "easeOutElastic")
};
function Gt(t) {
  if (t && Pi[t])
    return Pi[t];
  const e = foundry.canvas.animation.CanvasAnimation;
  return {
    linear: e.easeLinear,
    easeInOutCosine: e.easeInOutCosine
  }[t] ?? e.easeInOutCosine;
}
c(Gt, "resolveEasing");
function Uo() {
  return ["linear", "easeInOutCosine", ...Object.keys(Pi)];
}
c(Uo, "listEasingNames");
function Ga(t) {
  return t <= 0.04045 ? t / 12.92 : ((t + 0.055) / 1.055) ** 2.4;
}
c(Ga, "srgbToLinear");
function Ri(t) {
  return t <= 31308e-7 ? 12.92 * t : 1.055 * t ** (1 / 2.4) - 0.055;
}
c(Ri, "linearToSrgb");
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
function za(t) {
  return [t.r, t.g, t.b];
}
c(za, "colorToRgb");
function uf(t, e, n) {
  const i = /* @__PURE__ */ c((a) => Math.max(0, Math.min(1, a)), "clamp"), r = /* @__PURE__ */ c((a) => Math.round(i(a) * 255).toString(16).padStart(2, "0"), "toHex");
  return `#${r(t)}${r(e)}${r(n)}`;
}
c(uf, "rgbToHex");
function Ip(t, e, n) {
  if (n <= 0) return t.toHTML();
  if (n >= 1) return e.toHTML();
  const i = foundry.utils.Color, [r, a, o] = t.hsl, [s, l, u] = e.hsl, d = (s - r + 0.5) % 1 - 0.5, f = (r + d * n + 1) % 1, h = a + (l - a) * n, g = o + (u - o) * n;
  return i.fromHSL([f, h, g]).toHTML();
}
c(Ip, "interpolateHsl");
function Op(t, e, n) {
  if (n <= 0) return t.toHTML();
  if (n >= 1) return e.toHTML();
  const [i, r, a] = za(t).map(Ga), [o, s, l] = za(e).map(Ga), u = Ri(i + (o - i) * n), d = Ri(r + (s - r) * n), f = Ri(a + (l - a) * n);
  return uf(u, d, f);
}
c(Op, "interpolateRgb");
function Ap(t, e, n) {
  if (n <= 0) return t.toHTML();
  if (n >= 1) return e.toHTML();
  const [i, r, a] = za(t).map(Ga), [o, s, l] = za(e).map(Ga), [u, d, f] = nu(i, r, a), [h, g, p] = nu(o, s, l), y = 0.02, w = Math.sqrt(d * d + f * f), v = Math.sqrt(g * g + p * p);
  let b, E, L;
  if (w < y || v < y)
    b = u + (h - u) * n, E = d + (g - d) * n, L = f + (p - f) * n;
  else {
    const x = Math.atan2(f, d);
    let D = Math.atan2(p, g) - x;
    D > Math.PI && (D -= 2 * Math.PI), D < -Math.PI && (D += 2 * Math.PI), b = u + (h - u) * n;
    const F = w + (v - w) * n, _ = x + D * n;
    E = F * Math.cos(_), L = F * Math.sin(_);
  }
  const [A, O, M] = Lp(b, E, L);
  return uf(Ri(A), Ri(O), Ri(M));
}
c(Ap, "interpolateOklch");
const yl = {
  hsl: Ip,
  rgb: Op,
  oklch: Ap
};
function df(t = "hsl") {
  return yl[t] ?? yl.hsl;
}
c(df, "getInterpolator");
function Gi() {
  return Object.keys(yl);
}
c(Gi, "listInterpolationModes");
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
  if (t.mode && !Gi().includes(t.mode))
    throw new Error(
      `light-color tween: unknown mode "${t.mode}". Available: ${Gi().join(", ")}`
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
    commit: f = !0,
    startEpochMS: h = null,
    signal: g = null
  } = e, p = Gt(d), y = a != null, w = o != null, v = y ? df(s) : null, b = y ? i.fromString(a) : null;
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
    const _ = typeof h == "number" ? Math.max(0, Math.min(u, Date.now() - h)) : 0, H = /* @__PURE__ */ c((U) => {
      const J = {};
      y && (J.color = v(x, b, U)), w && (J.alpha = R + (o - R) * U), O.updateSource({ config: J }), M.initializeLightSource();
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
    if (f && B !== !1 && O.canUserModify(game.user, "update")) {
      if (g != null && g.aborted) return !1;
      const U = {}, J = {};
      y && (U.color = x.toHTML(), J["config.color"] = b.toHTML()), w && (U.alpha = R, J["config.alpha"] = o), O.updateSource({ config: U }), await O.update(J);
    }
    return B !== !1;
  }
  return c(E, "animateOne"), (await Promise.all(l.map(E))).every(Boolean);
}
c(Mp, "execute$7");
function Np() {
  Nt({ type: "light-color", execute: Mp, validate: kp });
}
c(Np, "registerLightColorTween");
const fn = /* @__PURE__ */ new WeakMap();
function _p(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("light-state tween: 'uuid' is required (string or array of AmbientLight document UUIDs).");
  if (typeof t.enabled != "boolean")
    throw new Error("light-state tween: 'enabled' (boolean) is required.");
}
c(_p, "validate$6");
async function $p(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, enabled: r } = t, a = Array.isArray(i) ? i : [i];
  if (a.length === 0)
    return console.warn("light-state tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: o = 2e3,
    easing: s = "easeInOutCosine",
    commit: l = !0,
    startEpochMS: u = null,
    signal: d = null
  } = e, f = Gt(s);
  async function h(p) {
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
    const b = fn.get(y) ?? {
      hidden: y._source.hidden,
      alpha: ((O = y._source.config) == null ? void 0 : O.alpha) ?? 0.5
    };
    if (fn.set(y, b), N(`light-state START ${r ? "ON" : "OFF"} | snap: ${JSON.stringify(b)} | _source.hidden=${y._source.hidden}, _source.config.alpha=${(M = y._source.config) == null ? void 0 : M.alpha}`), r && !b.hidden || !r && b.hidden)
      return fn.delete(y), !0;
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
          easing: f,
          time: L,
          ontick: /* @__PURE__ */ c(() => A(E * D.t), "ontick")
        }
      );
      return F !== !1 && !(d != null && d.aborted) && l && y.canUserModify(game.user, "update") ? (y.updateSource({ hidden: !0, config: { alpha: E } }), await y.update({ hidden: !1 }), N(`light-state FADE-IN committed. _source.hidden=${y._source.hidden}, _source.config.alpha=${(x = y._source.config) == null ? void 0 : x.alpha}`), fn.delete(y)) : F === !1 || fn.delete(y), F !== !1;
    } else {
      y.updateSource({ hidden: !1, config: { alpha: b.alpha } }), w.initializeLightSource();
      const D = { t: 0 };
      L > 0 && (D.t = L / o, A(E * (1 - D.t)));
      const F = await n.animate(
        [{ parent: D, attribute: "t", to: 1 }],
        {
          name: v,
          duration: o,
          easing: f,
          time: L,
          ontick: /* @__PURE__ */ c(() => A(E * (1 - D.t)), "ontick")
        }
      );
      return F !== !1 && !(d != null && d.aborted) && l && y.canUserModify(game.user, "update") ? (await y.update({ hidden: !0 }), y.updateSource({ config: { alpha: E } }), w.initializeLightSource(), N(`light-state FADE-OUT committed+restored. _source.hidden=${y._source.hidden}, _source.config.alpha=${(R = y._source.config) == null ? void 0 : R.alpha}`), fn.delete(y)) : F === !1 || (y.updateSource({ hidden: !0, config: { alpha: E } }), w.initializeLightSource(), fn.delete(y)), F !== !1;
    }
  }
  return c(h, "animateOne"), (await Promise.all(a.map(h))).every(Boolean);
}
c($p, "execute$6");
function xp() {
  Nt({ type: "light-state", execute: $p, validate: _p });
}
c(xp, "registerLightStateTween");
function Vo(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("tile-prop tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (!t.attribute || typeof t.attribute != "string")
    throw new Error("tile-prop tween: 'attribute' (string) is required — dot-path to a numeric property (e.g. 'alpha', 'rotation').");
  if (typeof t.value != "number")
    throw new Error("tile-prop tween: 'value' (number) is required — the target value to animate to.");
}
c(Vo, "validate$5");
async function Go(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, attribute: r, value: a } = t, o = Array.isArray(i) ? i : [i];
  if (o.length === 0)
    return console.warn("tile-prop tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: s = 2e3,
    easing: l = "easeInOutCosine",
    commit: u = !0,
    startEpochMS: d = null,
    signal: f = null
  } = e, h = Gt(l);
  async function g(y) {
    if (f != null && f.aborted) return !1;
    const w = await fromUuid(y);
    if (!w) return !1;
    const v = w.object;
    if (!v) return !1;
    const b = foundry.utils.getProperty(w._source, r);
    if (typeof b != "number")
      return console.warn(`tile-prop tween: source value at '${r}' on ${y} is not a number (got ${typeof b}). Skipping.`), !1;
    const E = `tile-prop-tween:${r}:${y}`;
    n.terminateAnimation(E), f && f.addEventListener("abort", () => {
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
        easing: h,
        time: L,
        ontick: /* @__PURE__ */ c(() => A(O.t), "ontick")
      }
    );
    if (M !== !1) {
      if (f != null && f.aborted) return !1;
      w.updateSource(foundry.utils.expandObject({ [r]: a })), v.refresh();
    }
    if (u && M !== !1 && w.canUserModify(game.user, "update")) {
      if (f != null && f.aborted) return !1;
      w.updateSource(foundry.utils.expandObject({ [r]: b })), await w.update({ [r]: a });
    }
    return M !== !1;
  }
  return c(g, "animateOne"), (await Promise.all(o.map(g))).every(Boolean);
}
c(Go, "execute$5");
function Fp() {
  Nt({ type: "tile-prop", execute: Go, validate: Vo });
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
  const f = Gt(o), h = `particles-prop-tween:${i}`;
  n.terminateAnimation(h), l && l.addEventListener("abort", () => {
    n.terminateAnimation(h);
  }, { once: !0 });
  const g = typeof s == "number" ? Math.max(0, Math.min(a, Date.now() - s)) : 0, p = /* @__PURE__ */ c((v) => {
    u[i] = d + (r - d) * v;
  }, "applyFrame"), y = { t: 0 };
  g > 0 && (y.t = g / a, p(y.t));
  const w = await n.animate(
    [{ parent: y, attribute: "t", to: 1 }],
    {
      name: h,
      duration: a,
      easing: f,
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
c(Pp, "execute$4");
function Rp() {
  Nt({ type: "particles-prop", execute: Pp, validate: Dp });
}
c(Rp, "registerParticlesPropTween");
var bn, Nr, _r, $r, xr, Fr, qi;
const Sc = class Sc {
  /**
   * @param {AbortController} controller
   */
  constructor(e) {
    k(this, bn);
    k(this, Nr);
    k(this, _r);
    k(this, $r);
    k(this, xr);
    k(this, Fr, !1);
    k(this, qi, null);
    I(this, bn, e), I(this, $r, new Promise((n) => {
      I(this, Nr, n);
    })), I(this, xr, new Promise((n) => {
      I(this, _r, n);
    }));
  }
  /** @returns {Promise<boolean>} Resolves true (completed) or false (cancelled/failed). */
  get finished() {
    return m(this, $r);
  }
  /** @returns {Promise<{status: string, [k: string]: unknown}>} */
  get result() {
    return m(this, xr);
  }
  /** @returns {boolean} */
  get cancelled() {
    return m(this, bn).signal.aborted;
  }
  /** @returns {AbortSignal} */
  get signal() {
    return m(this, bn).signal;
  }
  /** @returns {string} */
  get status() {
    return m(this, qi) ? m(this, qi).status : this.cancelled ? "cancelled" : "running";
  }
  /** Abort the timeline, triggering onCancel callbacks. */
  cancel(e = "cancelled") {
    m(this, bn).signal.aborted || m(this, bn).abort(e);
  }
  /**
   * Called internally by the execution engine when the timeline finishes.
   * @param {boolean} completed - true if all steps ran, false if cancelled
   */
  _resolve(e) {
    if (m(this, Fr)) return;
    I(this, Fr, !0);
    const n = typeof e == "boolean" ? { status: e ? "completed" : "cancelled" } : e ?? { status: "cancelled" };
    I(this, qi, n), m(this, Nr).call(this, n.status === "completed"), m(this, _r).call(this, n);
  }
};
bn = new WeakMap(), Nr = new WeakMap(), _r = new WeakMap(), $r = new WeakMap(), xr = new WeakMap(), Fr = new WeakMap(), qi = new WeakMap(), c(Sc, "TimelineHandle");
let bl = Sc;
var ai, ji, oi;
const Cc = class Cc {
  constructor() {
    /** @type {Map<string, Set<Function>>} */
    k(this, ai, /* @__PURE__ */ new Map());
    /** @type {Set<string>} Signals that have been emitted (sticky) */
    k(this, ji, /* @__PURE__ */ new Set());
    k(this, oi, !1);
  }
  /**
   * Subscribe to a named signal.
   * @param {string} signal
   * @param {Function} listener
   * @returns {() => void} Unsubscribe function
   */
  on(e, n) {
    if (m(this, oi)) return () => {
    };
    let i = m(this, ai).get(e);
    return i || (i = /* @__PURE__ */ new Set(), m(this, ai).set(e, i)), i.add(n), () => i.delete(n);
  }
  /**
   * Fire a named signal synchronously. All registered listeners are invoked.
   * The signal is recorded so that future waitFor() calls resolve immediately.
   * @param {string} signal
   */
  emit(e) {
    if (m(this, oi)) return;
    m(this, ji).add(e);
    const n = m(this, ai).get(e);
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
    return m(this, oi) ? Promise.reject(new Error("EventBus destroyed")) : m(this, ji).has(e) ? Promise.resolve() : new Promise((i, r) => {
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
    I(this, oi, !0), m(this, ai).clear(), m(this, ji).clear();
  }
};
ai = new WeakMap(), ji = new WeakMap(), oi = new WeakMap(), c(Cc, "EventBus");
let vl = Cc;
const ff = /* @__PURE__ */ new Map();
function zo(t, e) {
  ff.set(t, e);
}
c(zo, "registerAwaitProvider");
function wl(t, e) {
  const n = ff.get(t.event);
  return n ? n(t, e) : Promise.reject(new Error(`Unknown await event type: "${t.event}"`));
}
c(wl, "createAwaitPromise");
zo("signal", (t, e) => t.name ? e.eventBus.waitFor(t.name, e.signal) : Promise.reject(new Error('await signal: "name" is required')));
zo("click", (t, e) => new Promise((n, i) => {
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
zo("keypress", (t, e) => new Promise((n, i) => {
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
const ki = /* @__PURE__ */ new Map();
function Hp(t, e) {
  const n = ki.get(t);
  n && !n.cancelled && n.cancel("replaced-by-name"), ki.set(t, e), e.finished.then(() => {
    ki.get(t) === e && ki.delete(t);
  });
}
c(Hp, "registerTimeline");
function mf(t) {
  const e = ki.get(t);
  return e && !e.cancelled ? (e.cancel("cancelled-by-name"), !0) : !1;
}
c(mf, "cancelTimeline");
function qp(t) {
  return ki.get(t);
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
var Re, vn, Dr, Pr;
const Tc = class Tc {
  constructor(e) {
    /** @type {TweenTimeline} */
    k(this, Re);
    /** @type {Array<{ type: string, params: object, opts?: object, detach: boolean }>} */
    k(this, vn, []);
    /** @type {Function|null} */
    k(this, Dr, null);
    /** @type {Function|null} */
    k(this, Pr, null);
    I(this, Re, e);
  }
  /**
   * Add a tween entry to this step.
   * @param {string} type  Registered tween type name
   * @param {object} params  Type-specific parameters
   * @param {object} [opts]  Options (durationMS, easing, etc.)
   * @returns {StepBuilder} this
   */
  add(e, n, i) {
    return m(this, vn).push({ type: e, params: n, opts: i ?? {}, detach: !1 }), this;
  }
  /**
   * Mark the last entry as fire-and-forget (does not block step progression).
   * @returns {StepBuilder} this
   */
  detach() {
    if (m(this, vn).length === 0)
      throw new Error("StepBuilder.detach(): no entry to detach.");
    return m(this, vn)[m(this, vn).length - 1].detach = !0, this;
  }
  /**
   * Callback invoked before this step's tweens start.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  before(e) {
    return I(this, Dr, e), this;
  }
  /**
   * Callback invoked after this step's awaited tweens complete.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  after(e) {
    return I(this, Pr, e), this;
  }
  // ── Delegation to parent TweenTimeline for fluent chaining ──
  /** Start a new step (finalizes this one). */
  step() {
    return m(this, Re).step();
  }
  /** Insert a delay between steps. */
  delay(e) {
    return m(this, Re).delay(e);
  }
  /** Insert an await segment. */
  await(e) {
    return m(this, Re).await(e);
  }
  /** Insert an emit segment. */
  emit(e) {
    return m(this, Re).emit(e);
  }
  /** Insert a parallel segment. */
  parallel(e, n) {
    return m(this, Re).parallel(e, n);
  }
  /** Register onComplete callback. */
  onComplete(e) {
    return m(this, Re).onComplete(e);
  }
  /** Register onCancel callback. */
  onCancel(e) {
    return m(this, Re).onCancel(e);
  }
  /** Register onError callback. */
  onError(e) {
    return m(this, Re).onError(e);
  }
  /** Execute the timeline. */
  run(e) {
    return m(this, Re).run(e);
  }
  /** Serialize the timeline. */
  toJSON() {
    return m(this, Re).toJSON();
  }
  // ── Internal access ──
  /** @returns {{ entries: Array, before: Function|null, after: Function|null }} */
  _finalize() {
    return {
      entries: m(this, vn),
      before: m(this, Dr),
      after: m(this, Pr)
    };
  }
};
Re = new WeakMap(), vn = new WeakMap(), Dr = new WeakMap(), Pr = new WeakMap(), c(Tc, "StepBuilder");
let El = Tc;
var He, Ie, Et, wn, Rr, Hr, qr, jr, Rn, Sl, Y, Xt, Cl, hf, Tl, gf, pf, La, at, xt;
const en = class en {
  constructor() {
    k(this, Y);
    /** @type {string|null} */
    k(this, He, null);
    /** @type {string} */
    k(this, Ie, Ce.ABORT);
    /** @type {Array<object>} */
    k(this, Et, []);
    /** @type {StepBuilder|null} */
    k(this, wn, null);
    /** @type {Function|null} */
    k(this, Rr, null);
    /** @type {Function|null} */
    k(this, Hr, null);
    /** @type {Function|null} */
    k(this, qr, null);
    /** @type {Function|null} */
    k(this, jr, null);
  }
  /**
   * Register this timeline in the named registry. Starting a new
   * timeline with the same name cancels the previous one.
   * @param {string} name
   * @returns {TweenTimeline} this
   */
  name(e) {
    return I(this, He, e), this;
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
    return C(this, Y, Xt).call(this), I(this, wn, new El(this)), m(this, wn);
  }
  /**
   * Insert a delay (in ms) between the previous step and the next.
   * @param {number} ms
   * @returns {TweenTimeline} this
   */
  delay(e) {
    return C(this, Y, Xt).call(this), m(this, Et).push({ kind: "delay", ms: e }), this;
  }
  /**
   * Pause execution until an event occurs.
   * @param {object} config  e.g. { event: "click" }, { event: "signal", name: "fog-done" }
   * @returns {TweenTimeline} this
   */
  await(e) {
    return C(this, Y, Xt).call(this), m(this, Et).push({ kind: "await", config: e }), this;
  }
  /**
   * Fire a named signal (instant, non-blocking).
   * @param {string} signal  Signal name
   * @returns {TweenTimeline} this
   */
  emit(e) {
    return C(this, Y, Xt).call(this), m(this, Et).push({ kind: "emit", signal: e }), this;
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
    C(this, Y, Xt).call(this);
    const i = n.join ?? "all", r = n.overflow ?? "detach";
    if (i !== "all" && i !== "any" && (typeof i != "number" || i < 1 || i > e.length))
      throw new Error(`parallel: join must be "all", "any", or 1..${e.length}, got ${JSON.stringify(i)}`);
    if (r !== "detach" && r !== "cancel")
      throw new Error(`parallel: overflow must be "detach" or "cancel", got ${JSON.stringify(r)}`);
    const a = e.map((o) => {
      var l;
      const s = new en();
      return o(s), C(l = s, Y, Xt).call(l), m(s, Et);
    });
    return m(this, Et).push({ kind: "parallel", branches: a, join: i, overflow: r }), this;
  }
  /**
   * Callback invoked before the first step runs.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  beforeAll(e) {
    return I(this, Rr, e), this;
  }
  /**
   * Callback invoked on successful completion.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onComplete(e) {
    return I(this, Hr, e), this;
  }
  /**
   * Callback invoked on cancellation (mutually exclusive with onComplete).
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onCancel(e) {
    return I(this, qr, e), this;
  }
  /**
   * Callback invoked on runtime failure (mutually exclusive with onComplete/onCancel).
   * @param {(outcome: object) => void} fn
   * @returns {TweenTimeline} this
   */
  onError(e) {
    return I(this, jr, e), this;
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
    C(this, Y, Xt).call(this);
    const n = new AbortController();
    e.signal && (e.signal.aborted ? n.abort(e.signal.reason ?? "parent-aborted") : e.signal.addEventListener("abort", () => {
      n.signal.aborted || n.abort(e.signal.reason ?? "parent-aborted");
    }, { once: !0 }));
    const i = new bl(n);
    m(this, He) && Hp(m(this, He), i);
    const r = e.broadcast ?? game.user.isGM, a = e.commit ?? game.user.isGM, o = e.startEpochMS ?? Date.now();
    r && m(this, He) && Ta(cf, {
      name: m(this, He),
      data: this.toJSON(),
      startEpochMS: o
    });
    const s = new vl(), l = {
      signal: i.signal,
      commit: a,
      startEpochMS: o,
      eventBus: s,
      errors: [],
      detachedPromises: []
    };
    return C(this, Y, hf).call(this, i, l).then((u) => {
      var d, f, h;
      s.destroy(), i._resolve(u), u.status === dn.COMPLETED ? (d = m(this, Hr)) == null || d.call(this) : u.status === dn.CANCELLED ? ((f = m(this, qr)) == null || f.call(this), r && m(this, He) && Ta(gl, {
        name: m(this, He),
        reason: u.reason
      })) : ((h = m(this, jr)) == null || h.call(this, u), r && m(this, He) && Ta(gl, {
        name: m(this, He),
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
    C(this, Y, Xt).call(this);
    const n = { timeline: C(i = en, Rn, Sl).call(i, m(this, Et)) };
    return m(this, He) && (n.name = m(this, He)), m(this, Ie) !== Ce.ABORT && (n.errorPolicy = m(this, Ie)), n;
  }
};
He = new WeakMap(), Ie = new WeakMap(), Et = new WeakMap(), wn = new WeakMap(), Rr = new WeakMap(), Hr = new WeakMap(), qr = new WeakMap(), jr = new WeakMap(), Rn = new WeakSet(), Sl = /* @__PURE__ */ c(function(e) {
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
            return C(a = en, Rn, Sl).call(a, r);
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
Xt = /* @__PURE__ */ c(function() {
  m(this, wn) && (m(this, Et).push({ kind: "step", data: m(this, wn)._finalize() }), I(this, wn, null));
}, "#finalizeCurrentStep"), Cl = /* @__PURE__ */ c(function(e) {
  e.length !== 0 && Promise.allSettled(e).catch(() => {
  });
}, "#drainDetached"), hf = /* @__PURE__ */ c(async function(e, n) {
  var i, r;
  try {
    if (n.signal.aborted) return C(this, Y, at).call(this, n.signal.reason);
    const a = await C(this, Y, La).call(this, m(this, Rr), ht.BEFORE_ALL, null);
    if (a) {
      if (m(this, Ie) === Ce.ABORT) return a;
      n.errors.push(a);
    }
    const o = await C(this, Y, Tl).call(this, m(this, Et), n);
    if (o)
      return C(i = en, Rn, Cl).call(i, n.detachedPromises), o;
    if (!n.signal.aborted) {
      const s = await Promise.allSettled(n.detachedPromises);
      for (const l of s)
        if (l.status === "rejected") {
          const u = C(this, Y, xt).call(this, l.reason, ht.ENTRY);
          if (m(this, Ie) === Ce.ABORT) return u;
          n.errors.push(u);
        }
    }
    return n.signal.aborted ? C(this, Y, at).call(this, n.signal.reason) : {
      status: dn.COMPLETED,
      ...n.errors.length > 0 ? { errors: n.errors } : {}
    };
  } catch (a) {
    return C(r = en, Rn, Cl).call(r, n.detachedPromises), n.signal.aborted ? C(this, Y, at).call(this, n.signal.reason) : (console.error("TweenTimeline execution error:", a), C(this, Y, xt).call(this, a, ht.RUNTIME));
  }
}, "#execute"), Tl = /* @__PURE__ */ c(async function(e, n) {
  let i = -1, r = 0;
  for (const a of e) {
    if (n.signal.aborted) return C(this, Y, at).call(this, n.signal.reason);
    if (a.kind === "delay") {
      try {
        await iu(a.ms, n.signal);
      } catch {
        return C(this, Y, at).call(this, n.signal.reason);
      }
      r += a.ms;
      continue;
    }
    if (a.kind === "await") {
      try {
        let p = wl(a.config, {
          signal: n.signal,
          eventBus: n.eventBus
        });
        const y = a.config.timeout;
        typeof y == "number" && y > 0 && (p = Promise.race([
          p,
          iu(y, n.signal)
        ])), await p;
      } catch (p) {
        if (n.signal.aborted) return C(this, Y, at).call(this, n.signal.reason);
        const y = C(this, Y, xt).call(this, p, ht.AWAIT);
        if (m(this, Ie) === Ce.ABORT) return y;
        n.errors.push(y);
      }
      continue;
    }
    if (a.kind === "emit") {
      try {
        n.eventBus.emit(a.signal);
      } catch (p) {
        const y = C(this, Y, xt).call(this, p, ht.EMIT);
        if (m(this, Ie) === Ce.ABORT) return y;
        n.errors.push(y);
      }
      continue;
    }
    if (a.kind === "parallel") {
      const p = await C(this, Y, gf).call(this, a, n, r);
      if (p) return p;
      continue;
    }
    i += 1;
    const { entries: o, before: s, after: l } = a.data, u = await C(this, Y, La).call(this, s, ht.BEFORE_STEP, i);
    if (u) {
      if (m(this, Ie) === Ce.ABORT) return u;
      n.errors.push(u);
      continue;
    }
    if (n.signal.aborted) return C(this, Y, at).call(this, n.signal.reason);
    const d = [];
    let f = 0;
    for (const p of o) {
      const y = wi(p.type);
      if (!y) {
        const E = C(this, Y, xt).call(this, new Error(`TweenTimeline: unknown tween type "${p.type}"`), ht.ENTRY, i, p.type);
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
        failure: C(this, Y, xt).call(this, new Error("Tween entry returned false."), ht.ENTRY, i, p.type)
      } : { ok: !0 }).catch((E) => ({
        ok: !1,
        failure: C(this, Y, xt).call(this, E, ht.ENTRY, i, p.type)
      }));
      p.detach ? n.detachedPromises.push(b) : (d.push(b), f = Math.max(f, v));
    }
    const h = await C(this, Y, pf).call(this, d, n.signal);
    if (h === null) return C(this, Y, at).call(this, n.signal.reason);
    for (const p of h)
      if (!p.ok) {
        if (m(this, Ie) === Ce.ABORT) return p.failure;
        n.errors.push(p.failure), console.warn("TweenTimeline: entry failed:", p.failure.error);
      }
    const g = await C(this, Y, La).call(this, l, ht.AFTER_STEP, i);
    if (g) {
      if (m(this, Ie) === Ce.ABORT) return g;
      n.errors.push(g);
    }
    if (n.signal.aborted) return C(this, Y, at).call(this, n.signal.reason);
    r += f;
  }
  return null;
}, "#executeSegments"), gf = /* @__PURE__ */ c(async function(e, n, i = 0) {
  const { branches: r, join: a, overflow: o } = e, s = r.length, l = a === "all" ? s : a === "any" ? 1 : a, u = r.map(() => {
    const p = new AbortController();
    return n.signal.aborted ? p.abort(n.signal.reason ?? "parent-aborted") : n.signal.addEventListener("abort", () => {
      p.signal.aborted || p.abort(n.signal.reason ?? "parent-aborted");
    }, { once: !0 }), p;
  });
  let d = 0, f = 0;
  const h = new Array(s).fill(null);
  let g;
  return new Promise((p) => {
    let y = !1;
    const w = /* @__PURE__ */ c(() => {
      if (y) return;
      if (d >= l) {
        y = !0, v(), p(null);
        return;
      }
      const b = s - d - f;
      if (d + b < l) {
        y = !0, v();
        const E = h.filter((A) => A && A.status === dn.FAILED).map((A) => A), L = C(this, Y, xt).call(this, new Error(`parallel: join target ${l} impossible (${d} completed, ${f} failed)`), ht.PARALLEL);
        m(this, Ie) === Ce.ABORT ? p(L) : (n.errors.push(L), n.errors.push(...E), p(null));
      }
    }, "checkJoin"), v = /* @__PURE__ */ c(() => {
      if (o === "cancel")
        for (let b = 0; b < s; b++)
          !h[b] && !u[b].signal.aborted && u[b].abort("overflow-cancel");
      for (let b = 0; b < s; b++)
        h[b] || n.detachedPromises.push(g[b]);
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
      return C(this, Y, Tl).call(this, b, L).then((A) => {
        if (A)
          if (A.status === dn.CANCELLED) {
            if (u[E].signal.aborted) {
              h[E] = A;
              return;
            }
            h[E] = A, f++;
          } else
            h[E] = A, f++;
        else
          h[E] = { status: dn.COMPLETED }, d++;
        w();
      });
    }), n.signal.aborted) {
      y = !0, p(C(this, Y, at).call(this, n.signal.reason));
      return;
    }
    n.signal.addEventListener("abort", () => {
      y || (y = !0, p(C(this, Y, at).call(this, n.signal.reason)));
    }, { once: !0 });
  });
}, "#executeParallel"), /**
 * @param {Array<Promise<{ok: boolean, failure?: object}>>} stepPromises
 * @param {AbortSignal} signal
 * @returns {Promise<Array<{ok: boolean, failure?: object}>|null>}
 */
pf = /* @__PURE__ */ c(function(e, n) {
  return e.length === 0 ? Promise.resolve([]) : n.aborted ? Promise.resolve(null) : new Promise((i, r) => {
    const a = /* @__PURE__ */ c(() => i(null), "onAbort");
    n.addEventListener("abort", a, { once: !0 }), Promise.all(e).then((o) => {
      n.removeEventListener("abort", a), i(o);
    }).catch((o) => {
      n.removeEventListener("abort", a), r(o);
    });
  });
}, "#waitForStep"), La = /* @__PURE__ */ c(async function(e, n, i) {
  if (!e) return null;
  try {
    return await e(), null;
  } catch (r) {
    const a = C(this, Y, xt).call(this, r, n, i ?? void 0);
    return m(this, Ie) === Ce.CONTINUE && console.warn(`TweenTimeline: hook failure in ${n}:`, r), a;
  }
}, "#runHook"), /** @param {unknown} reason */
at = /* @__PURE__ */ c(function(e) {
  let n;
  return typeof e == "string" ? n = e : e instanceof Error && (n = e.message), {
    status: dn.CANCELLED,
    ...n ? { reason: n } : {}
  };
}, "#cancelledOutcome"), /**
 * @param {unknown} err
 * @param {string} phase
 * @param {number} [stepIndex]
 * @param {string} [entryType]
 */
xt = /* @__PURE__ */ c(function(e, n, i, r) {
  const a = e instanceof Error ? e : new Error(String(e));
  return {
    status: dn.FAILED,
    error: a,
    phase: n,
    ...typeof i == "number" ? { stepIndex: i } : {},
    ...r ? { entryType: r } : {}
  };
}, "#failedOutcome"), k(en, Rn), c(en, "TweenTimeline");
let Wa = en;
function uc(t) {
  if (!t || typeof t != "object")
    throw new Error("Sequence JSON: data must be an object.");
  if (!Array.isArray(t.timeline))
    throw new Error("Sequence JSON: 'timeline' must be an array.");
  if (t.name != null && typeof t.name != "string")
    throw new Error("Sequence JSON: 'name' must be a string.");
  if (t.errorPolicy != null && t.errorPolicy !== Ce.ABORT && t.errorPolicy !== Ce.CONTINUE)
    throw new Error(`Sequence JSON: 'errorPolicy' must be "abort" or "continue".`);
  yf(t.timeline, "timeline", 0);
}
c(uc, "validateSequenceJSON");
function yf(t, e, n = 0) {
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
        yf(d, `${a}.parallel.branches[${u}]`, n + 1);
      }
      continue;
    }
    throw new Error(`Sequence JSON: ${a} is not a recognized segment (step array, delay, await, emit, or parallel).`);
  }
}
c(yf, "validateSegmentsJSON");
function bf(t) {
  uc(t), vf(t.timeline, "timeline");
}
c(bf, "validateSequenceSemantics");
function vf(t, e) {
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
        vf(i.parallel.branches[a], `${r}.parallel.branches[${a}]`);
  }
}
c(vf, "validateSegmentsSemantics");
function dc(t, e = {}) {
  uc(t), e.validateSemantics && bf(t);
  const n = new Wa();
  return t.name && n.name(t.name), t.errorPolicy && n.errorPolicy(t.errorPolicy), wf(t.timeline, n), n;
}
c(dc, "compileSequence");
function wf(t, e) {
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
      const i = n.parallel, r = i.branches.map((a) => (o) => wf(a, o));
      e.parallel(r, {
        join: i.join ?? "all",
        overflow: i.overflow ?? "detach"
      });
    }
  }
}
c(wf, "compileSegments");
function jp(t) {
  uc(t), bf(t);
}
c(jp, "validate$3");
async function Bp(t, e = {}) {
  return dc(t, { validateSemantics: !0 }).run({
    broadcast: !1,
    commit: e.commit,
    startEpochMS: e.startEpochMS,
    signal: e.signal
  }).finished;
}
c(Bp, "execute$3");
function Up() {
  Nt({ type: "sequence", execute: Bp, validate: jp });
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
  Nt({ type: "camera-pan", execute: Gp, validate: Vp });
}
c(zp, "registerCameraPanTween");
function Wp(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((i) => !i || typeof i != "string"))
    throw new Error("tile-tint tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (t.toColor == null || typeof t.toColor != "string")
    throw new Error("tile-tint tween: 'toColor' (CSS color string) is required.");
  if (!foundry.utils.Color.fromString(t.toColor).valid)
    throw new Error(`tile-tint tween: invalid target color "${t.toColor}".`);
  if (t.mode && !Gi().includes(t.mode))
    throw new Error(
      `tile-tint tween: unknown mode "${t.mode}". Available: ${Gi().join(", ")}`
    );
}
c(Wp, "validate$1");
async function Kp(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { Color: i } = foundry.utils, { uuid: r, toColor: a, mode: o = "oklch" } = t, s = Array.isArray(r) ? r : [r];
  if (s.length === 0)
    return console.warn("tile-tint tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: l = 2e3,
    easing: u = "easeInOutCosine",
    commit: d = !0,
    startEpochMS: f = null,
    signal: h = null
  } = e, g = Gt(u), p = df(o), y = i.fromString(a);
  if (!y.valid) throw new Error(`tile-tint tween: invalid target color "${a}".`);
  async function w(b) {
    var H, B;
    if (h != null && h.aborted) return !1;
    const E = await fromUuid(b);
    if (!E) return !1;
    const L = E.object;
    if (!L) return !1;
    const A = ((B = (H = E._source) == null ? void 0 : H.texture) == null ? void 0 : B.tint) ?? "#ffffff", O = i.fromString(A);
    O.valid || console.warn(`tile-tint tween: source tint invalid on ${b}, using white.`);
    const M = O.valid ? O : i.fromString("#ffffff"), x = { t: 0 }, R = `tile-tint-tween:${b}`;
    n.terminateAnimation(R), h && h.addEventListener("abort", () => {
      n.terminateAnimation(R);
    }, { once: !0 });
    const D = typeof f == "number" ? Math.max(0, Math.min(l, Date.now() - f)) : 0, F = /* @__PURE__ */ c((W) => {
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
      if (h != null && h.aborted) return !1;
      E.updateSource({ texture: { tint: y.toHTML() } }), L.refresh();
    }
    if (d && _ !== !1 && E.canUserModify(game.user, "update")) {
      if (h != null && h.aborted) return !1;
      E.updateSource({ texture: { tint: M.toHTML() } }), await E.update({ "texture.tint": y.toHTML() });
    }
    return _ !== !1;
  }
  return c(w, "animateOne"), (await Promise.all(s.map(w))).every(Boolean);
}
c(Kp, "execute$1");
function Jp() {
  Nt({ type: "tile-tint", execute: Kp, validate: Wp });
}
c(Jp, "registerTileTintTween");
function Yp(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("tile-scale tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (typeof t.toScale != "number" || t.toScale <= 0)
    throw new Error("tile-scale tween: 'toScale' must be a positive number.");
  for (const n of ["baseWidth", "baseHeight", "centerX", "centerY"])
    if (typeof t[n] != "number")
      throw new Error(`tile-scale tween: '${n}' (number) is required.`);
}
c(Yp, "validate");
async function Xp(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, toScale: r, baseWidth: a, baseHeight: o, centerX: s, centerY: l } = t, u = Array.isArray(i) ? i : [i];
  if (u.length === 0) return !0;
  const {
    durationMS: d = 2e3,
    easing: f = "easeInOutCosine",
    commit: h = !0,
    startEpochMS: g = null,
    signal: p = null
  } = e, y = Gt(f), w = a * r, v = o * r, b = s - w / 2, E = l - v / 2;
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
    const B = typeof g == "number" ? Math.max(0, Math.min(d, Date.now() - g)) : 0, W = /* @__PURE__ */ c((J) => {
      const ae = R + (w - R) * J, Q = D + (v - D) * J, te = F + (b - F) * J, zt = _ + (E - _) * J;
      M.updateSource({ width: ae, height: Q, x: te, y: zt }), x.refresh();
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
    if (h && U !== !1 && M.canUserModify(game.user, "update")) {
      if (p != null && p.aborted) return !1;
      M.updateSource({ width: R, height: D, x: F, y: _ }), await M.update({ width: w, height: v, x: b, y: E });
    }
    return U !== !1;
  }
  return c(L, "animateOne"), (await Promise.all(u.map(L))).every(Boolean);
}
c(Xp, "execute");
function Qp() {
  Nt({ type: "tile-scale", execute: Xp, validate: Yp });
}
c(Qp, "registerTileScaleTween");
async function Zp(t, e, n = {}) {
  if (!game.user.isGM)
    return ui.notifications.warn("Only the GM can dispatch tweens."), !1;
  const i = wi(t);
  if (!i)
    throw new Error(`Unknown tween type: "${t}". Registered types: ${pl().join(", ")}`);
  i.validate(e);
  const { durationMS: r = 2e3, easing: a = "easeInOutCosine", commit: o = !0 } = n, s = Date.now();
  return Ta(lf, {
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
  const { type: e, params: n, durationMS: i, easing: r, startEpochMS: a, commit: o } = t ?? {}, s = wi(e);
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
xp();
Fp();
Rp();
Up();
zp();
Jp();
Qp();
Nt({ type: "token-prop", execute: Go, validate: Vo });
Nt({ type: "drawing-prop", execute: Go, validate: Vo });
Nt({ type: "sound-prop", execute: Go, validate: Vo });
cc(lf, ey);
cc(cf, ty);
cc(gl, ny);
function ty(t) {
  const { data: e, startEpochMS: n } = t ?? {};
  if (!e) {
    console.warn(`[${T}] Received empty tween-sequence socket message.`);
    return;
  }
  try {
    dc(e, { validateSemantics: !0 }).run({ commit: !1, startEpochMS: n, broadcast: !1 });
  } catch (i) {
    console.error(`[${T}] Failed to run received tween sequence:`, i);
  }
}
c(ty, "handleSequenceSocketMessage");
function ny(t) {
  const { name: e } = t ?? {};
  e && mf(e);
}
c(ny, "handleSequenceCancelMessage");
function iy() {
  Hooks.once("ready", () => {
    Cp();
    const t = game.modules.get(T);
    t.api || (t.api = {}), t.api.tween = {
      dispatch: Zp,
      types: pl,
      Timeline: Wa,
      ErrorPolicy: Ce,
      compileSequence: dc,
      cancelTimeline: mf,
      getTimeline: qp
    }, console.log(`[${T}] Tween API registered. Types: ${pl().join(", ")}`);
  });
}
c(iy, "registerTweenHooks");
iy();
const ry = ["tag", "tag-all", "id", "tags-any", "tags-all"], ay = /* @__PURE__ */ new Set(["tags-any", "tags-all"]);
function fc(t) {
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
c(fc, "parseSelector");
function oy(t) {
  if (!t) return "";
  const { type: e, value: n } = t;
  if (e === "special" || e === "uuid" || e === "unknown")
    return Array.isArray(n) ? n.join(",") : n ?? "";
  const i = Array.isArray(n) ? n.join(",") : n ?? "";
  return `${e}:${i}`;
}
c(oy, "buildSelector");
function Ef(t, e = "first") {
  return t != null && t.length ? t.length === 1 ? e === "first-all" || e === "all" ? `tag-all:${t[0]}` : `tag:${t[0]}` : e === "any" ? `tags-any:${t.join(",")}` : e === "all" ? `tags-all:${t.join(",")}` : e === "first-all" ? `tags-all:${t.join(",")}` : `tags-any:${t.join(",")}` : "";
}
c(Ef, "buildTagSelector");
function Wo(t) {
  if (!t) return null;
  if (t.documentName || t._source !== void 0) {
    const e = t.object;
    return e ? { placeable: e, doc: t } : null;
  }
  return t.document ? { placeable: t, doc: t.document } : null;
}
c(Wo, "normalizePlaceable");
function Sf() {
  var t;
  return window.Tagger ?? ((t = game.modules.get("tagger")) == null ? void 0 : t.api) ?? null;
}
c(Sf, "getTaggerAPI");
function Ko(t, e) {
  if (!t) return null;
  const n = e ?? canvas.scene;
  if (!n) return null;
  const i = fc(t);
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
c(Ko, "resolveSelector");
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
  const i = Sf();
  if (!i)
    return console.warn(`[${T}] Picker: Tagger not available, cannot resolve tag "${t}".`), null;
  const r = i.getByTag(t, { sceneId: e.id });
  if (!(r != null && r.length)) return null;
  const a = [];
  for (const o of r) {
    const s = Wo(o);
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
      const a = Wo(r);
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
  const i = Sf();
  if (!i)
    return console.warn(`[${T}] Picker: Tagger not available, cannot resolve multi-tag.`), null;
  const r = i.getByTag(t, {
    sceneId: e.id,
    matchAny: n
  });
  if (!(r != null && r.length)) return null;
  const a = [];
  for (const o of r) {
    const s = Wo(o);
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
  const n = Wo(e);
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
function Ka(t) {
  var r;
  const e = /* @__PURE__ */ new Set();
  if (t.segments) {
    if (t.setup) for (const a of Object.keys(t.setup)) e.add(a);
    if (t.landing) for (const a of Object.keys(t.landing)) e.add(a);
    for (const a of Object.values(t.segments)) {
      if (a.setup) for (const o of Object.keys(a.setup)) e.add(o);
      if (a.landing) for (const o of Object.keys(a.landing)) e.add(o);
      a.timeline && Il(a.timeline, e), (r = a.gate) != null && r.target && e.add(a.gate.target);
    }
  } else {
    if (t.setup) for (const a of Object.keys(t.setup)) e.add(a);
    if (t.landing) for (const a of Object.keys(t.landing)) e.add(a);
    t.timeline && Il(t.timeline, e);
  }
  const n = /* @__PURE__ */ new Map(), i = [];
  for (const a of e) {
    const o = Ko(a), s = uy(o);
    s ? n.set(a, s) : i.push(a);
  }
  return i.length && console.warn(`[${T}] Cinematic: ${i.length} unresolved target(s): ${i.join(", ")}`), { targets: n, unresolved: i };
}
c(Ka, "resolveAllTargets");
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
      n(i.setup), n(i.landing), i.timeline && Ll(i.timeline, e, n);
  } else
    n(t.setup), n(t.landing), t.timeline && Ll(t.timeline, e, n);
  return e;
}
c(fy, "gatherAllStateMaps");
function Ll(t, e, n) {
  var i;
  for (const r of t)
    if (!(r.delay != null || r.await != null || r.emit != null) && !(r.transitionTo != null || r.sound != null || r.stopSound != null)) {
      if ((i = r.parallel) != null && i.branches) {
        for (const a of r.parallel.branches)
          Ll(a, e, n);
        continue;
      }
      if (n(r.before), n(r.after), r.tweens)
        for (const a of r.tweens)
          a.target && a.attribute && (e[a.target] || (e[a.target] = {}), e[a.target][a.attribute] = "__snapshot__");
    }
}
c(Ll, "gatherFromEntries");
function Il(t, e) {
  for (const n of t)
    if (n.delay == null && n.await == null && n.emit == null && n.transitionTo == null && n.sound == null && n.stopSound == null) {
      if (n.parallel) {
        const i = n.parallel;
        if (i.branches)
          for (const r of i.branches)
            Il(r, e);
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
c(Il, "collectSelectorsFromEntries");
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
function ms(t, e, n) {
  const i = {};
  for (const [r, a] of Object.entries(t))
    e.has(r) ? i[r] = a : console.warn(`[${T}] Cinematic: blocked property "${r}" on ${n}.`);
  return i;
}
c(ms, "filterOverrides");
function Te(t, e) {
  var i, r;
  if (!t) return;
  const n = [];
  for (const [a, o] of Object.entries(t)) {
    const s = e.get(a);
    if (s)
      if (s.kind === "particles") {
        if (s.target.destroyed) continue;
        const l = ms(o, my, "$particles");
        for (const [u, d] of Object.entries(l))
          s.target[u] = d;
      } else if (s.kind === "multi-placeable")
        for (const { placeable: l, doc: u } of s.placeables) {
          if (!(u != null && u.parent) || !(l != null && l.scene)) continue;
          const d = u.documentName, f = ou[d];
          if (!f) {
            console.warn(`[${T}] Cinematic: no allowlist for document type "${d}" on "${a}", skipping.`);
            continue;
          }
          const h = ms(o, f, `${d} "${a}"`);
          u.updateSource(h), n.push(l);
        }
      else {
        if (!((i = s.doc) != null && i.parent) || !((r = s.placeable) != null && r.scene)) continue;
        const l = s.doc.documentName, u = ou[l];
        if (!u) {
          console.warn(`[${T}] Cinematic: no allowlist for document type "${l}" on "${a}", skipping.`);
          continue;
        }
        const d = ms(o, u, `${l} "${a}"`);
        s.doc.updateSource(d), n.push(s.placeable);
      }
  }
  for (const a of n)
    a.refresh();
}
c(Te, "applyState");
function Mi(t, e) {
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
c(Mi, "refreshPerceptionIfNeeded");
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
function Cf(t, e) {
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
c(Cf, "compileTween");
const Sr = /* @__PURE__ */ new Map();
let yy = 0;
async function by(t) {
  var u, d, f, h, g;
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
    typeof ((d = (u = foundry == null ? void 0 : foundry.audio) == null ? void 0 : u.AudioHelper) == null ? void 0 : d.play) == "function" ? l = await foundry.audio.AudioHelper.play(s, !1) : typeof ((h = (f = game == null ? void 0 : game.audio) == null ? void 0 : f.constructor) == null ? void 0 : h.play) == "function" ? l = await game.audio.constructor.play(s, !1) : typeof ((g = game == null ? void 0 : game.audio) == null ? void 0 : g.play) == "function" && (l = await game.audio.play(s, !1));
  } catch (p) {
    console.error(`[${T}] Cinematic sound: failed to play "${n}":`, p);
    return;
  }
  if (!l) {
    console.warn(`[${T}] Cinematic sound: audio helper unavailable for "${n}".`);
    return;
  }
  a && a > 0 && l.fade && l.fade(i, { duration: a, from: 0 }), Sr.set(o, { sound: l, config: t }), console.log(`[${T}] Cinematic sound: playing "${n}" as "${o}" (loop=${r}, vol=${i})`);
}
c(by, "playLocalSound");
function hs(t) {
  var i, r;
  const e = Sr.get(t);
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
  Sr.delete(t);
}
c(hs, "stopCinematicSound");
function su() {
  var t, e;
  for (const [n, i] of Sr)
    try {
      (e = (t = i.sound).stop) == null || e.call(t);
    } catch (r) {
      console.warn(`[${T}] Cinematic sound: error stopping "${n}" during cleanup:`, r);
    }
  Sr.clear();
}
c(su, "stopAllCinematicSounds");
function vy(t, e, n, i = {}) {
  const { skipToStep: r, onStepComplete: a, timelineName: o } = i, s = new n().name(o ?? `cinematic-${canvas.scene.id}`);
  return s.beforeAll(() => {
    var l;
    try {
      Te(t.setup, e), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    } catch (u) {
      throw console.error(`[${T}] Cinematic: error in beforeAll (setup state) on scene ${(l = canvas.scene) == null ? void 0 : l.id}:`, u), u;
    }
  }), Lf(t.timeline, s, e, { skipToStep: r, onStepComplete: a }), { tl: s };
}
c(vy, "buildTimeline");
function Tf(t, e) {
  var n;
  if (t)
    for (const i of t)
      for (const r of i) {
        if (r.before)
          try {
            Te(r.before, e), Mi(r.before, e);
          } catch (a) {
            console.warn(`[${T}] Cinematic: error in skipped parallel before:`, a);
          }
        if (r.after)
          try {
            Te(r.after, e), Mi(r.after, e);
          } catch (a) {
            console.warn(`[${T}] Cinematic: error in skipped parallel after:`, a);
          }
        (n = r.parallel) != null && n.branches && Tf(r.parallel.branches, e);
      }
}
c(Tf, "applyParallelStatesForSkip");
function Lf(t, e, n, i = {}) {
  const { skipToStep: r, onStepComplete: a } = i;
  let o = -1;
  for (const s of t) {
    if (s.sound != null) {
      if (r != null && o < r) continue;
      const f = s.sound, { duration: h, loop: g, fireAndForget: p } = f, y = e.step();
      if (y.before(() => {
        by(f);
      }), h && h > 0)
        if (p) {
          if (g && f.id) {
            const w = f.id, v = h;
            y.before(() => {
              setTimeout(() => hs(w), v);
            });
          }
        } else
          e.delay(h), g && e.step().before(() => {
            hs(f.id);
          });
      continue;
    }
    if (s.stopSound != null) {
      if (r != null && o < r) continue;
      const f = s.stopSound;
      e.step().before(() => {
        hs(f);
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
        Tf(s.parallel.branches, n);
        continue;
      }
      const f = s.parallel, h = f.branches.map((g) => (p) => Lf(g, p, n));
      e.parallel(h, {
        join: f.join ?? "all",
        overflow: f.overflow ?? "detach"
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
          Te(s.before, n), Mi(s.before, n);
        } catch (f) {
          console.warn(`[${T}] Cinematic: error applying skipped step.before:`, f);
        }
      if (s.after)
        try {
          Te(s.after, n), Mi(s.after, n);
        } catch (f) {
          console.warn(`[${T}] Cinematic: error applying skipped step.after:`, f);
        }
      continue;
    }
    const l = o, u = e.step();
    s.before && u.before(() => {
      var f;
      try {
        Te(s.before, n), Mi(s.before, n);
      } catch (h) {
        throw console.error(`[${T}] Cinematic: error in step.before callback on scene ${(f = canvas.scene) == null ? void 0 : f.id}:`, h), h;
      }
    });
    const d = s.duration ?? 500;
    for (const f of s.tweens) {
      const h = Cf(f, n);
      h && u.add(h.type, h.params, { ...h.opts, durationMS: d });
    }
    u.after(() => {
      var f;
      try {
        s.after && (Te(s.after, n), Mi(s.after, n)), a == null || a(l);
      } catch (h) {
        throw console.error(`[${T}] Cinematic: error in step.after callback on scene ${(f = canvas.scene) == null ? void 0 : f.id}:`, h), h;
      }
    });
  }
}
c(Lf, "compileCinematicEntries");
function Ni(t, e, n) {
  if (t != null) {
    if (typeof t != "object" || Array.isArray(t)) {
      n.push({ path: e, level: "error", message: `Expected object, got ${Array.isArray(t) ? "array" : typeof t}` });
      return;
    }
    for (const [i, r] of Object.entries(t))
      (typeof r != "object" || r === null || Array.isArray(r)) && n.push({ path: `${e}["${i}"]`, level: "error", message: `Expected property overrides object, got ${Array.isArray(r) ? "array" : typeof r}` });
  }
}
c(Ni, "validateStateMap");
function Ol(t, e, n, i) {
  var r;
  for (let a = 0; a < t.length; a++) {
    const o = t[a], s = `${e}[${a}]`;
    if (!(o.delay != null || o.await != null || o.emit != null) && !(o.transitionTo != null || o.sound != null || o.stopSound != null)) {
      if ((r = o.parallel) != null && r.branches) {
        for (let l = 0; l < o.parallel.branches.length; l++)
          Ol(o.parallel.branches[l], `${s}.parallel.branches[${l}]`, n, i);
        continue;
      }
      if (Ni(o.before, `${s}.before`, i), Ni(o.after, `${s}.after`, i), o.tweens)
        for (let l = 0; l < o.tweens.length; l++) {
          const u = o.tweens[l], d = `${s}.tweens[${l}]`;
          if (!u.type) {
            i.push({ path: d, level: "error", message: "Missing 'type' field" });
            continue;
          }
          const f = wi(u.type);
          if (!f) {
            i.push({ path: d, level: "error", message: `Unknown tween type: "${u.type}"` });
            continue;
          }
          if (n)
            try {
              const h = Cf(u, n);
              h ? f.validate(h.params) : u.target && i.push({ path: d, level: "warn", message: `Target "${u.target}" could not be resolved for compilation` });
            } catch (h) {
              i.push({ path: d, level: "error", message: h.message });
            }
          n && u.target && !n.has(u.target) && i.push({ path: `${d}.target`, level: "warn", message: `Target "${u.target}" is not resolved` });
        }
    }
  }
}
c(Ol, "validateEntries");
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
      Ni(s.setup, `${l}.setup`, n), Ni(s.landing, `${l}.landing`, n), s.timeline && Array.isArray(s.timeline) && Ol(s.timeline, `${l}.timeline`, e, n), s.next && typeof s.next == "string" && !t.segments[s.next] && n.push({ path: `${l}.next`, level: "error", message: `Next segment "${s.next}" not found` });
    }
  } else
    Ni(t.setup, "setup", n), Ni(t.landing, "landing", n), t.timeline && Array.isArray(t.timeline) && Ol(t.timeline, "timeline", e, n);
  return n;
}
c(wy, "validateCinematicDeep");
const gs = 5, lu = /* @__PURE__ */ new Set(["click", "tile-click", "keypress"]);
var se, fe, qe, Oe, ut, lr, Al, If, K, Ne, Ia, Se, gt;
const oe = class oe {
  constructor(e = null, { loadedHash: n = null, cinematicName: i = "default", segmentName: r = null } = {}) {
    k(this, K);
    k(this, se);
    k(this, fe);
    k(this, qe);
    k(this, Oe);
    var o;
    I(this, se, e ?? oe.empty()), I(this, fe, i), I(this, Oe, n);
    const a = (o = m(this, se).cinematics) == null ? void 0 : o[m(this, fe)];
    I(this, qe, r ?? (a == null ? void 0 : a.entry) ?? "main");
  }
  static empty() {
    return {
      version: gs,
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
        return v.await != null && lu.has(((b = v.await) == null ? void 0 : b.event) ?? "click");
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
    let d = [], f = 1, h = null;
    const g = [];
    function p() {
      const v = `segment-${f++}`, b = { timeline: [...d] };
      return h && (b.gate = h), u[v] = b, g.push(v), d = [], h = null, v;
    }
    c(p, "flushSegment");
    for (const v of s)
      if (v.transitionTo == null) {
        if (v.await != null && lu.has(((w = v.await) == null ? void 0 : w.event) ?? "click")) {
          p(), h = { ...v.await }, delete h.event, h = { event: v.await.event ?? "click", ...h };
          continue;
        }
        d.push(v);
      }
    (d.length > 0 || h) && p();
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
      (i = a.timeline) != null && i.length && (a.timeline = C(r = oe, ut, Al).call(r, a.timeline));
    return n;
  }
  static fromScene(e, n = "default") {
    var o;
    const i = e == null ? void 0 : e.getFlag(T, "cinematic");
    let r = i ? foundry.utils.deepClone(i) : null;
    const a = i ? C(o = oe, ut, If).call(o, i) : null;
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
      r.version = gs;
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
    return m(this, K, Ne).trigger;
  }
  get tracking() {
    return m(this, K, Ne).tracking;
  }
  get synchronized() {
    return m(this, K, Ne).synchronized ?? !1;
  }
  get activeCinematicName() {
    return m(this, fe);
  }
  // ── Segment accessors ────────────────────────────────────────────────
  get segments() {
    return m(this, K, Ne).segments;
  }
  get entry() {
    return m(this, K, Ne).entry;
  }
  get activeSegmentName() {
    return m(this, qe);
  }
  get activeSegment() {
    var e;
    return ((e = m(this, K, Ne).segments) == null ? void 0 : e[m(this, qe)]) ?? null;
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
      segmentName: m(this, qe)
    });
  }
  // ── Cinematic-level mutations ─────────────────────────────────────────
  setTrigger(e) {
    return C(this, K, Ia).call(this, { trigger: e });
  }
  setTracking(e) {
    return C(this, K, Ia).call(this, { tracking: e });
  }
  setSynchronized(e) {
    return C(this, K, Ia).call(this, { synchronized: e });
  }
  // ── Segment-level mutations (setup/landing now live on segments) ──────
  setSetup(e) {
    return C(this, K, Se).call(this, { setup: e });
  }
  setLanding(e) {
    return C(this, K, Se).call(this, { landing: e });
  }
  // ── Segment management methods ────────────────────────────────────────
  switchSegment(e) {
    var n;
    return (n = m(this, K, Ne).segments) != null && n[e] ? new oe(foundry.utils.deepClone(m(this, se)), {
      loadedHash: m(this, Oe),
      cinematicName: m(this, fe),
      segmentName: e
    }) : this;
  }
  addSegment(e, n = null) {
    var a;
    if (!e || (a = m(this, K, Ne).segments) != null && a[e]) return this;
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
    if (Object.keys(m(this, K, Ne).segments ?? {}).length <= 1) return this;
    if (!((s = m(this, K, Ne).segments) != null && s[e])) return this;
    const i = foundry.utils.deepClone(m(this, se)), r = i.cinematics[m(this, fe)], a = r.segments[e].next;
    for (const [, u] of Object.entries(r.segments))
      (u.next === e || typeof u.next == "object" && ((l = u.next) == null ? void 0 : l.segment) === e) && (u.next = a ?? void 0, u.next || delete u.next);
    delete r.segments[e], r.entry === e && (r.entry = Object.keys(r.segments)[0]);
    const o = m(this, qe) === e ? r.entry : m(this, qe);
    return new oe(i, {
      loadedHash: m(this, Oe),
      cinematicName: m(this, fe),
      segmentName: o
    });
  }
  renameSegment(e, n) {
    var s, l, u;
    if (!e || !n || e === n) return this;
    if (!((s = m(this, K, Ne).segments) != null && s[e])) return this;
    if ((l = m(this, K, Ne).segments) != null && l[n]) return this;
    const i = foundry.utils.deepClone(m(this, se)), r = i.cinematics[m(this, fe)], a = {};
    for (const [d, f] of Object.entries(r.segments))
      a[d === e ? n : d] = f;
    r.segments = a;
    for (const [, d] of Object.entries(r.segments))
      d.next === e ? d.next = n : typeof d.next == "object" && ((u = d.next) == null ? void 0 : u.segment) === e && (d.next.segment = n);
    r.entry === e && (r.entry = n);
    const o = m(this, qe) === e ? n : m(this, qe);
    return new oe(i, {
      loadedHash: m(this, Oe),
      cinematicName: m(this, fe),
      segmentName: o
    });
  }
  setSegmentGate(e) {
    return C(this, K, Se).call(this, { gate: e ?? void 0 });
  }
  setSegmentNext(e) {
    return C(this, K, Se).call(this, { next: e ?? void 0 });
  }
  setSegmentSetup(e) {
    return C(this, K, Se).call(this, { setup: e });
  }
  setSegmentLanding(e) {
    return C(this, K, Se).call(this, { landing: e });
  }
  listSegmentNames() {
    return Object.keys(m(this, K, Ne).segments ?? {});
  }
  // ── Timeline entry mutations (scoped to active segment) ──────────────
  addStep(e = -1) {
    const n = [...this.activeSegment.timeline], i = { duration: 1e3, tweens: [] };
    return e < 0 || e >= n.length ? n.push(i) : n.splice(e, 0, i), C(this, K, Se).call(this, { timeline: n });
  }
  addDelay(e = -1, n = 1e3) {
    const i = [...this.activeSegment.timeline], r = { delay: n };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), C(this, K, Se).call(this, { timeline: i });
  }
  addAwait(e = -1, n = null) {
    return console.warn(`[${T}] CinematicState.addAwait() is deprecated in v4. Use segment gates instead.`), this;
  }
  addEmit(e = -1, n = "") {
    const i = [...this.activeSegment.timeline], r = { emit: n };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), C(this, K, Se).call(this, { timeline: i });
  }
  addParallel(e = -1) {
    const n = [...this.activeSegment.timeline], i = { parallel: { branches: [[], []], join: "all", overflow: "detach" } };
    return e < 0 || e >= n.length ? n.push(i) : n.splice(e, 0, i), C(this, K, Se).call(this, { timeline: n });
  }
  addTransitionTo(e = -1, n = null) {
    return console.warn(`[${T}] CinematicState.addTransitionTo() is deprecated in v4. Use segment next edges instead.`), this;
  }
  addSound(e = -1, n = null) {
    const i = [...this.activeSegment.timeline], r = { sound: n ?? { src: "", volume: 0.8, loop: !1, duration: 0, fireAndForget: !1 } };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), C(this, K, Se).call(this, { timeline: i });
  }
  addStopSound(e = -1, n = "") {
    const i = [...this.activeSegment.timeline], r = { stopSound: n };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), C(this, K, Se).call(this, { timeline: i });
  }
  moveEntry(e, n) {
    if (e === n) return this;
    const i = [...this.activeSegment.timeline];
    if (e < 0 || e >= i.length) return this;
    if (n < 0 || n >= i.length) return this;
    const [r] = i.splice(e, 1);
    return i.splice(n, 0, r), C(this, K, Se).call(this, { timeline: i });
  }
  removeEntry(e) {
    const n = [...this.activeSegment.timeline];
    return e < 0 || e >= n.length ? this : (n.splice(e, 1), C(this, K, Se).call(this, { timeline: n }));
  }
  updateEntry(e, n) {
    const i = this.activeSegment.timeline.map((r, a) => a !== e ? r : { ...foundry.utils.deepClone(r), ...n });
    return C(this, K, Se).call(this, { timeline: i });
  }
  // ── Tween mutations ──────────────────────────────────────────────────
  addTween(e, n = null) {
    const i = { type: "tile-prop", target: "", attribute: "alpha", value: 1 };
    return C(this, K, gt).call(this, e, (r) => {
      const a = [...r.tweens ?? [], n ?? i];
      return { ...r, tweens: a };
    });
  }
  updateTween(e, n, i) {
    return C(this, K, gt).call(this, e, (r) => {
      const a = (r.tweens ?? []).map((o, s) => s !== n ? o : { ...o, ...i });
      return { ...r, tweens: a };
    });
  }
  removeTween(e, n) {
    return C(this, K, gt).call(this, e, (i) => {
      const r = (i.tweens ?? []).filter((a, o) => o !== n);
      return { ...i, tweens: r };
    });
  }
  updateStepDuration(e, n) {
    return C(this, K, gt).call(this, e, (i) => ({ ...i, duration: Math.max(0, n) }));
  }
  // ── Parallel branch mutations ────────────────────────────────────────
  addBranch(e) {
    return C(this, K, gt).call(this, e, (n) => {
      if (!n.parallel) return n;
      const i = [...n.parallel.branches, []];
      return { ...n, parallel: { ...n.parallel, branches: i } };
    });
  }
  removeBranch(e, n) {
    return C(this, K, gt).call(this, e, (i) => {
      if (!i.parallel) return i;
      const r = i.parallel.branches.filter((a, o) => o !== n);
      return r.length < 1 ? i : { ...i, parallel: { ...i.parallel, branches: r } };
    });
  }
  addBranchEntry(e, n, i = null) {
    const r = { duration: 1e3, tweens: [] };
    return C(this, K, gt).call(this, e, (a) => {
      if (!a.parallel) return a;
      const o = a.parallel.branches.map((s, l) => l !== n ? s : [...s, i ?? r]);
      return { ...a, parallel: { ...a.parallel, branches: o } };
    });
  }
  removeBranchEntry(e, n, i) {
    return C(this, K, gt).call(this, e, (r) => {
      if (!r.parallel) return r;
      const a = r.parallel.branches.map((o, s) => s !== n ? o : o.filter((l, u) => u !== i));
      return { ...r, parallel: { ...r.parallel, branches: a } };
    });
  }
  updateBranchEntry(e, n, i, r) {
    return C(this, K, gt).call(this, e, (a) => {
      if (!a.parallel) return a;
      const o = a.parallel.branches.map((s, l) => l !== n ? s : s.map((u, d) => d !== i ? u : { ...foundry.utils.deepClone(u), ...r }));
      return { ...a, parallel: { ...a.parallel, branches: o } };
    });
  }
  moveBranchEntry(e, n, i, r) {
    return i === r ? this : C(this, K, gt).call(this, e, (a) => {
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
    const n = { ...foundry.utils.deepClone(m(this, se)), version: gs };
    await e.setFlag(T, "cinematic", n);
  }
  /** Returns the active cinematic's data (for validation/export). */
  toJSON() {
    return foundry.utils.deepClone(m(this, K, Ne));
  }
  /** Returns the entire v4 flag structure. */
  toFullJSON() {
    return foundry.utils.deepClone(m(this, se));
  }
};
se = new WeakMap(), fe = new WeakMap(), qe = new WeakMap(), Oe = new WeakMap(), ut = new WeakSet(), lr = /* @__PURE__ */ c(function(e) {
  const { duration: n, detach: i, ...r } = e;
  return r;
}, "#stripTween"), Al = /* @__PURE__ */ c(function(e) {
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
          return C(d = oe, ut, Al).call(d, u);
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
      const l = Math.max(500, ...a.tweens.map((f) => f.duration ?? 0)), { tweens: u, ...d } = a;
      n.push({
        ...d,
        duration: l,
        tweens: u.map(C(oe, ut, lr))
      });
    } else if (o.length === 0) {
      const l = Math.max(500, ...s.map((f) => f.duration ?? 0)), { tweens: u, ...d } = a;
      n.push({
        ...d,
        duration: l,
        tweens: s.map(C(oe, ut, lr))
      });
    } else {
      const l = Math.max(500, ...o.map((h) => h.duration ?? 0)), u = Math.max(500, ...s.map((h) => h.duration ?? 0)), { tweens: d, ...f } = a;
      n.push({
        parallel: {
          branches: [
            [{ ...f, duration: l, tweens: o.map(C(oe, ut, lr)) }],
            [{ duration: u, tweens: s.map(C(oe, ut, lr)) }]
          ],
          join: "all",
          overflow: "detach"
        }
      });
    }
  }
  return n;
}, "#migrateTimelineV5"), If = /* @__PURE__ */ c(function(e) {
  return foundry.utils.deepClone(e);
}, "#computeHash"), K = new WeakSet(), Ne = /* @__PURE__ */ c(function() {
  return m(this, se).cinematics[m(this, fe)];
}, "#active"), // ── Internal ─────────────────────────────────────────────────────────
/** Clone the full state with a patch to the active cinematic (cinematic-level props). */
Ia = /* @__PURE__ */ c(function(e) {
  const n = foundry.utils.deepClone(m(this, se));
  return Object.assign(n.cinematics[m(this, fe)], e), new oe(n, {
    loadedHash: m(this, Oe),
    cinematicName: m(this, fe),
    segmentName: m(this, qe)
  });
}, "#cloneActive"), /** Clone the full state with a patch to the active segment within the active cinematic. */
Se = /* @__PURE__ */ c(function(e) {
  const n = foundry.utils.deepClone(m(this, se)), i = n.cinematics[m(this, fe)].segments[m(this, qe)];
  if (!i) return this;
  Object.assign(i, e);
  for (const [r, a] of Object.entries(i))
    a === void 0 && delete i[r];
  return new oe(n, {
    loadedHash: m(this, Oe),
    cinematicName: m(this, fe),
    segmentName: m(this, qe)
  });
}, "#cloneActiveSegment"), /** Mutate a single timeline entry within the active segment. */
gt = /* @__PURE__ */ c(function(e, n) {
  const i = this.activeSegment;
  if (!i || e < 0 || e >= i.timeline.length) return this;
  const r = i.timeline.map((a, o) => o !== e ? a : n(foundry.utils.deepClone(a)));
  return C(this, K, Se).call(this, { timeline: r });
}, "#mutateEntry"), k(oe, ut), c(oe, "CinematicState");
let Bt = oe;
const cu = [
  { value: "tile-prop", label: "Tile Prop" },
  { value: "light-color", label: "Light Color" },
  { value: "light-state", label: "Light State" },
  { value: "particles-prop", label: "Particles Prop" },
  { value: "camera-pan", label: "Camera Pan" },
  { value: "token-prop", label: "Token Prop" },
  { value: "drawing-prop", label: "Drawing Prop" },
  { value: "sound-prop", label: "Sound Prop" }
], Of = {
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
const Nn = 40, mr = 24, Cr = 50, fu = 50, zn = 60, Xn = 10, ps = 16, Af = 40, kf = 20, Sy = 90, mu = 70, hu = 8;
function Jo(t) {
  return { stepDuration: Math.max(500, t.duration ?? 500), detachOverflow: 0 };
}
c(Jo, "computeStepDurations");
function Cy(t) {
  var i;
  const e = ((i = t.parallel) == null ? void 0 : i.branches) ?? [];
  let n = 0;
  for (const r of e) {
    let a = 0;
    for (const o of r)
      o.delay != null ? a += o.delay : o.await != null || o.emit != null || (o.sound != null ? a += o.sound.fireAndForget ? 0 : o.sound.duration ?? 0 : o.stopSound != null || (a += Jo(o).stepDuration));
    n = Math.max(n, a);
  }
  return Math.max(500, n);
}
c(Cy, "computeParallelDuration");
function mc(t) {
  return t.reduce((e, n) => n.delay != null ? e + n.delay : n.await != null || n.emit != null || n.transitionTo != null ? e : n.sound != null ? e + (n.sound.fireAndForget ? 0 : n.sound.duration ?? 0) : n.stopSound != null ? e : n.parallel != null ? e + Cy(n) : e + Jo(n).stepDuration, 0);
}
c(mc, "computeTotalDuration");
function Ty(t, e) {
  if (t <= 0) return 0.1;
  const n = e / t;
  return Math.max(0.03, Math.min(0.5, n));
}
c(Ty, "computeScale");
function Mf(t) {
  const e = t.tweens ?? [];
  if (e.length === 0) return "Empty";
  const n = e[0], i = (n.target ?? "").replace(/^tag:/, "#"), r = n.attribute ?? "";
  return n.type === "camera-pan" ? "Pan" : r === "alpha" ? `Fade ${i}` : r === "x" || r === "y" ? `Move ${i}` : n.type === "light-color" ? `Light ${i}` : n.type === "sound-prop" ? `Sound ${i}` : i ? `${i}` : "Step";
}
c(Mf, "deriveStepLabel");
function Ly(t, e, n, i, r) {
  var u, d;
  const a = [], o = [], s = [];
  let l = e;
  for (let f = 0; f < t.length; f++) {
    const h = t[f], g = `${i}.${f}`, p = r === g;
    if (h.delay != null) {
      const y = Math.max(kf, h.delay * n);
      a.push({ type: "delay", leftPx: l, widthPx: y, label: `${h.delay}ms`, entryPath: g, selected: p }), l += y;
    } else if (h.await != null) {
      const y = ((u = h.await) == null ? void 0 : u.event) ?? "click", w = y === "tile-click" ? "fa-hand-pointer" : y === "signal" ? "fa-bolt" : "fa-pause";
      a.push({ type: "await", leftPx: l, widthPx: ps, label: y, entryPath: g, selected: p, isGate: !0, gateIcon: w }), ((d = h.await) == null ? void 0 : d.event) === "signal" && s.push({ signal: h.await.signal, centerPx: l + ps / 2 }), l += ps;
    } else if (h.emit != null)
      a.push({ type: "emit", leftPx: l, widthPx: Xn, label: "emit", entryPath: g, selected: p, isMarker: !0 }), o.push({ signal: h.emit, centerPx: l + Xn / 2 });
    else if (h.sound != null) {
      const y = (h.sound.src || "").split("/").pop() || "Sound", w = h.sound.duration ?? 0;
      if (h.sound.fireAndForget ?? !1)
        a.push({ type: "sound", leftPx: l, widthPx: Xn, label: y, entryPath: g, selected: p, isMarker: !0 });
      else {
        const b = w > 0 ? Math.max(zn, w * n) : zn, E = (h.sound.loop ?? !1) && w <= 0;
        a.push({ type: "sound", leftPx: l, widthPx: b, label: y, entryPath: g, selected: p, hasTrailingArrow: E }), l += b;
      }
    } else if (h.stopSound != null)
      a.push({ type: "stopSound", leftPx: l, widthPx: Xn, label: "Stop", entryPath: g, selected: p, isMarker: !0 });
    else {
      const { stepDuration: y } = Jo(h), w = Math.max(Af, y * n), v = Mf(h);
      a.push({ type: "step", leftPx: l, widthPx: w, label: v, entryPath: g, selected: p }), l += w;
    }
  }
  return { blocks: a, width: l - e, emits: o, awaits: s };
}
c(Ly, "computeBranchLane");
function gu(t) {
  return mr + t * Nn;
}
c(gu, "laneIndexToY");
function Iy(t, e) {
  const n = [];
  for (const i of t.emits)
    for (const r of t.awaits) {
      if (i.signal !== r.signal) continue;
      const a = i.centerPx, o = gu(i.laneIndex) + Nn / 2, s = r.centerPx, l = gu(r.laneIndex) + Nn / 2, u = l - o, d = (a + s) / 2, f = o + Math.sign(u || 1) * Math.min(40, Math.abs(u) * 0.5 + 20), h = l - Math.sign(u || 1) * Math.min(40, Math.abs(u) * 0.5 + 20);
      n.push({
        pathD: `M ${a} ${o} C ${d} ${f}, ${d} ${h}, ${s} ${l}`,
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
    n.push({ px: Cr + a * e, label: o });
  }
  return n;
}
c(Oy, "computeTimeMarkers");
function Ay(t) {
  const e = [];
  for (let n = 0; n < t.length - 1; n++) {
    const i = t[n], r = t[n + 1], a = i.leftPx + i.widthPx + (r.leftPx - (i.leftPx + i.widthPx)) / 2, o = mr + Nn / 2;
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
  const i = mc(t), r = n - 70 - 100, a = Ty(i, r), o = [], s = [], l = { emits: [], awaits: [] }, u = [];
  o.push({
    type: "setup",
    leftPx: 0,
    widthPx: Cr,
    label: "Setup",
    entryPath: "setup",
    selected: e === "setup"
  });
  let d = Cr;
  for (let b = 0; b < t.length; b++) {
    const E = t[b], L = `timeline.${b}`, A = e === L;
    if (E.delay != null) {
      const O = Math.max(kf, E.delay * a);
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
        widthPx: Xn,
        label: "Emit",
        entryPath: L,
        selected: A,
        isMarker: !0
      }), l.emits.push({
        signal: E.emit,
        centerPx: d + Xn / 2,
        laneIndex: 0
      });
    else if (E.sound != null) {
      const O = (E.sound.src || "").split("/").pop() || "Sound", M = E.sound.duration ?? 0;
      if (E.sound.fireAndForget ?? !1) {
        const R = M > 0 ? Math.max(zn, M * a) : zn, D = (E.sound.loop ?? !1) && M <= 0, F = {
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
        const R = M > 0 ? Math.max(zn, M * a) : zn, D = (E.sound.loop ?? !1) && M <= 0;
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
        widthPx: Xn,
        label: "Stop",
        entryPath: L,
        selected: A,
        isMarker: !0
      });
    else if (E.parallel != null) {
      const O = E.parallel.branches ?? [], M = d, x = [];
      let R = 0;
      for (let F = 0; F < O.length; F++) {
        const _ = `timeline.${b}.parallel.branches.${F}`, { blocks: H, width: B, emits: W, awaits: q } = Ly(O[F], M, a, _, e);
        x.push({ label: `Br ${F + 1}`, blocks: H }), R = Math.max(R, B);
        const U = s.length * 10 + F + 1;
        for (const J of W) l.emits.push({ ...J, laneIndex: U });
        for (const J of q) l.awaits.push({ ...J, laneIndex: U });
      }
      const D = Math.max(zn, R);
      o.push({
        type: "parallel",
        leftPx: M,
        widthPx: D,
        label: `${O.length} br`,
        entryPath: L,
        selected: A
      }), s.push({ parallelEntryIndex: b, startPx: M, lanes: x }), d += D;
    } else {
      const { stepDuration: O } = Jo(E), M = Math.max(Af, O * a), x = Mf(E);
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
    widthPx: fu,
    label: "Landing",
    entryPath: "landing",
    selected: e === "landing"
  }), d += fu;
  const f = s.flatMap((b) => b.lanes), h = f.length;
  for (const b of u)
    f.push({ label: b.label, blocks: b.blocks });
  const g = Iy(l, f.length), p = [];
  for (let b = 0; b < u.length; b++) {
    const E = h + b;
    for (const L of u[b].blocks) {
      const A = L.leftPx, O = mr + Nn, M = mr + (1 + E) * Nn + Nn / 2;
      p.push({ x: A, y1: O, y2: M });
    }
  }
  const y = Oy(i, a), w = Ay(o), v = mr + (1 + f.length) * Nn;
  return {
    mainBlocks: o,
    subLanes: f,
    signalArcs: g,
    fafConnectors: p,
    timeMarkers: y,
    insertionPoints: w,
    totalWidthPx: Math.max(d, 200),
    swimlaneHeightPx: v,
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
  let u = hu;
  for (const v of o) {
    const b = n[v], E = mc(b.timeline ?? []), L = My(E), A = v === i, O = v === e, M = !a.has(v), x = Sy;
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
    }), u += x + mu;
  }
  const d = [], f = new Map(l.map((v) => [v.name, v]));
  for (const v of o) {
    const b = n[v];
    if (!b.next) continue;
    const E = typeof b.next == "string" ? b.next : (p = b.next) == null ? void 0 : p.segment;
    if (!E) continue;
    const L = f.get(v), A = f.get(E);
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
  const h = u - mu + hu;
  return { nodes: l, edges: d, totalWidthPx: h };
}
c(Ny, "computeSegmentGraph");
function Pn(t) {
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
c(Pn, "parseEntryPath");
function Ja(t, e) {
  var i, r, a, o;
  const n = Pn(t);
  return n ? n.type === "setup" ? e.setup : n.type === "landing" ? e.landing : n.type === "timeline" ? e.timeline[n.index] : n.type === "branch" ? (o = (a = (r = (i = e.timeline[n.index]) == null ? void 0 : i.parallel) == null ? void 0 : r.branches) == null ? void 0 : a[n.branchIndex]) == null ? void 0 : o[n.branchEntryIndex] : null : null;
}
c(Ja, "getEntryAtPath");
function pu(t) {
  const e = Pn(t);
  return !e || e.type !== "timeline" ? null : e.index;
}
c(pu, "getTimelineIndexFromPath");
function _y(t) {
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
c(_y, "countUniqueTargets");
function $y(t, e) {
  var i, r, a;
  const n = Pn(t);
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
c($y, "stepNumberForPath");
function xy(t) {
  return {
    isSetup: !0,
    targetCount: Object.keys(t.setup ?? {}).length
  };
}
c(xy, "buildSetupDetail");
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
      var E, L;
      const f = u.delay != null, h = u.await != null, g = u.emit != null, p = u.sound != null, y = u.stopSound != null, w = !f && !h && !g && !p && !y;
      let v, b;
      return f ? (v = `${u.delay}ms`, b = "delay") : h ? (v = "Await", b = ((E = u.await) == null ? void 0 : E.event) ?? "click") : g ? (v = "Emit", b = u.emit || "(unnamed)") : p ? (v = "Sound", b = (u.sound.src || "").split("/").pop() || "(none)") : y ? (v = "Stop Sound", b = u.stopSound || "(no id)") : (v = "Step", b = `${((L = u.tweens) == null ? void 0 : L.length) ?? 0} tweens`), { branchEntryIndex: d, isDelay: f, isAwait: h, isEmit: g, isSound: p, isStopSound: y, isStep: w, label: v, sub: b };
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
  const r = Uo(), a = (t.tweens ?? []).map((l, u) => {
    const d = `${e}.tweens.${u}`, f = n.has(d), h = l.type ?? "tile-prop", g = cu.find((v) => v.value === h), p = Of[h], y = (p == null ? void 0 : p.form) ?? "prop", w = l.mode ?? "oklch";
    return {
      tweenIndex: u,
      isExpanded: f,
      type: h,
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
      typeOptions: cu.map((v) => ({
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
    stepNumber: $y(e, i),
    stepDuration: t.duration ?? 1e3,
    tweens: a,
    beforeSummary: o.length ? `${o.length} target${o.length !== 1 ? "s" : ""}` : "(none)",
    afterSummary: s.length ? `${s.length} target${s.length !== 1 ? "s" : ""}` : "(none)"
  };
}
c(jy, "buildStepDetail");
function By(t, { state: e, expandedTweens: n }) {
  const i = Pn(t);
  if (!i) return null;
  if (i.type === "setup") return xy(e);
  if (i.type === "landing") return Fy(e);
  const r = Ja(t, e);
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
              e(() => new Bt(l));
            else if (l.segments !== void 0) {
              const u = { version: 4, cinematics: { [t.activeCinematicName]: l } };
              e(() => new Bt(u, { cinematicName: t.activeCinematicName }));
            } else if (l.timeline !== void 0) {
              const u = { version: 3, cinematics: { [t.activeCinematicName]: l } };
              e(() => new Bt(u, { cinematicName: t.activeCinematicName }));
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
function Ya(t, { state: e, mutate: n }) {
  const i = t === "setup" ? e.setup : e.landing, r = JSON.stringify(i ?? {}, null, 2);
  new Dialog({
    title: `Edit ${t.charAt(0).toUpperCase() + t.slice(1)}`,
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON map of target selector → property overrides:</p>
			<textarea id="cinematic-json-edit" style="width:100%;height:200px;font-family:monospace;font-size:0.8rem">${Ot(r)}</textarea>
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
c(Ya, "showEditJsonDialog");
function yu(t, { selectedPath: e, state: n, mutate: i }) {
  const r = Ja(e, n);
  if (!r || r.delay != null) return;
  const a = r[t] ?? {}, o = JSON.stringify(a, null, 2);
  new Dialog({
    title: `Edit Step ${t.charAt(0).toUpperCase() + t.slice(1)}`,
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON map of target selector → property overrides:</p>
			<textarea id="cinematic-json-edit" style="width:100%;height:200px;font-family:monospace;font-size:0.8rem">${Ot(o)}</textarea>
		`,
    buttons: {
      save: {
        label: "Apply",
        callback: /* @__PURE__ */ c((s) => {
          var u, d;
          const l = s.find("#cinematic-json-edit").val();
          try {
            const f = JSON.parse(l), h = Pn(e);
            (h == null ? void 0 : h.type) === "timeline" ? i((g) => g.updateEntry(h.index, { [t]: f })) : (h == null ? void 0 : h.type) === "branch" && i((g) => g.updateBranchEntry(h.index, h.branchIndex, h.branchEntryIndex, { [t]: f }));
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
c(yu, "showEditStepStateDialog");
function Vy({ selectedPath: t, state: e, mutate: n }) {
  const i = Pn(t);
  if (!i || i.type !== "timeline") return;
  const r = e.timeline[i.index];
  if (!(r != null && r.parallel)) return;
  const a = JSON.stringify(r.parallel.branches ?? [], null, 2);
  new Dialog({
    title: "Edit Parallel Branches",
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON array of branch timelines:</p>
			<textarea id="cinematic-json-edit" style="width:100%;height:250px;font-family:monospace;font-size:0.8rem">${Ot(a)}</textarea>
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
c(Vy, "showEditParallelJsonDialog");
var Ru, En, xn, Oa, Nf;
const yt = class yt extends qn(Hn) {
  constructor(n = {}) {
    super(n);
    k(this, xn);
    k(this, En, null);
    I(this, En, n.scene ?? canvas.scene ?? null);
  }
  async _prepareContext() {
    var r, a, o;
    const n = m(this, xn, Oa), i = ((a = n == null ? void 0 : n.getSeenStatus) == null ? void 0 : a.call(n, (r = m(this, En)) == null ? void 0 : r.id)) ?? [];
    return {
      sceneName: ((o = m(this, En)) == null ? void 0 : o.name) ?? "No scene",
      users: i.map((s) => ({
        ...s,
        statusLabel: s.seen ? "Seen" : "Not seen",
        statusClass: s.seen ? "cinematic-tracking__status--seen" : "cinematic-tracking__status--unseen"
      })),
      hasAnyTracked: i.some((s) => s.seen)
    };
  }
  _onRender(n, i) {
    super._onRender(n, i), C(this, xn, Nf).call(this);
  }
};
En = new WeakMap(), xn = new WeakSet(), Oa = /* @__PURE__ */ c(function() {
  var n, i;
  return (i = (n = game.modules.get(T)) == null ? void 0 : n.api) == null ? void 0 : i.cinematic;
}, "#api"), Nf = /* @__PURE__ */ c(function() {
  var i, r;
  const n = this.element;
  n instanceof HTMLElement && (n.querySelectorAll("[data-action='reset-user']").forEach((a) => {
    a.addEventListener("click", async () => {
      var l;
      const o = a.dataset.userId;
      if (!o) return;
      const s = m(this, xn, Oa);
      s != null && s.resetForUser && (await s.resetForUser((l = m(this, En)) == null ? void 0 : l.id, o), this.render({ force: !0 }));
    });
  }), (i = n.querySelector("[data-action='reset-all']")) == null || i.addEventListener("click", async () => {
    var o;
    const a = m(this, xn, Oa);
    a != null && a.resetForAll && (await a.resetForAll((o = m(this, En)) == null ? void 0 : o.id), this.render({ force: !0 }));
  }), (r = n.querySelector("[data-action='refresh']")) == null || r.addEventListener("click", () => {
    this.render({ force: !0 });
  }));
}, "#bindEvents"), c(yt, "CinematicTrackingApplication"), ye(yt, "APP_ID", `${T}-cinematic-tracking`), ye(yt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Fe(yt, yt, "DEFAULT_OPTIONS"),
  {
    id: yt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Ru = Fe(yt, yt, "DEFAULT_OPTIONS")) == null ? void 0 : Ru.classes) ?? [], "eidolon-cinematic-tracking-window", "themed"])
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
)), ye(yt, "PARTS", {
  content: {
    template: `modules/${T}/templates/cinematic-tracking.html`
  }
});
let kl = yt;
function Gy(t, e) {
  var n, i, r, a, o, s, l, u, d;
  (n = t.querySelector("[data-action='save']")) == null || n.addEventListener("click", () => e.save()), (i = t.querySelector("[data-action='play-preview']")) == null || i.addEventListener("click", () => e.play()), (r = t.querySelector("[data-action='reset-tracking']")) == null || r.addEventListener("click", () => e.resetTracking()), (a = t.querySelector("[data-action='export-json']")) == null || a.addEventListener("click", () => e.exportJSON()), (o = t.querySelector("[data-action='undo']")) == null || o.addEventListener("click", () => e.undo()), (s = t.querySelector("[data-action='redo']")) == null || s.addEventListener("click", () => e.redo()), (l = t.querySelector("[data-action='validate']")) == null || l.addEventListener("click", () => e.validate()), (u = t.querySelector("[data-action='import-json']")) == null || u.addEventListener("click", () => e.importJSON()), (d = t.querySelector("[data-action='open-tracking']")) == null || d.addEventListener("click", () => {
    new kl({ scene: e.scene }).render(!0);
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
            var l, u, d, f, h, g, p;
            const s = (l = o.find("#cinematic-new-name").val()) == null ? void 0 : l.trim();
            if (!s) {
              (d = (u = ui.notifications) == null ? void 0 : u.warn) == null || d.call(u, "Name cannot be empty.");
              return;
            }
            if (/[.\s]/.test(s)) {
              (h = (f = ui.notifications) == null ? void 0 : f.warn) == null || h.call(f, "Name cannot contain dots or spaces.");
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
      content: `<label style="display:flex;align-items:center;gap:0.5rem"><span>Name:</span><input id="cinematic-rename" type="text" style="flex:1" value="${Ot(o)}" /></label>`,
      buttons: {
        ok: {
          label: "Rename",
          callback: /* @__PURE__ */ c((s) => {
            var u, d, f, h, g, p, y;
            const l = (u = s.find("#cinematic-rename").val()) == null ? void 0 : u.trim();
            if (!l) {
              (f = (d = ui.notifications) == null ? void 0 : d.warn) == null || f.call(d, "Name cannot be empty.");
              return;
            }
            if (/[.\s]/.test(l)) {
              (g = (h = ui.notifications) == null ? void 0 : h.warn) == null || g.call(h, "Name cannot contain dots or spaces.");
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
function Ky(t, e) {
  var n, i, r, a, o, s, l, u, d, f, h;
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
    Ya("setup", { state: e.state, mutate: e.mutate });
  }), (s = t.querySelector("[data-action='edit-landing']")) == null || s.addEventListener("click", () => {
    Ya("landing", { state: e.state, mutate: e.mutate });
  }), (l = t.querySelector("[data-action='edit-before']")) == null || l.addEventListener("click", () => {
    yu("before", { selectedPath: e.selectedPath, state: e.state, mutate: e.mutate });
  }), (u = t.querySelector("[data-action='edit-after']")) == null || u.addEventListener("click", () => {
    yu("after", { selectedPath: e.selectedPath, state: e.state, mutate: e.mutate });
  }), (d = t.querySelector("[data-action='change-trigger']")) == null || d.addEventListener("change", (g) => {
    e.mutate((p) => p.setTrigger(g.target.value));
  }), (f = t.querySelector("[data-action='change-tracking']")) == null || f.addEventListener("change", (g) => {
    e.mutate((p) => p.setTracking(g.target.checked));
  }), (h = t.querySelector("[data-action='change-synchronized']")) == null || h.addEventListener("change", (g) => {
    e.mutate((p) => p.setSynchronized(g.target.checked));
  });
}
c(Ky, "bindDetailPanelEvents");
const zi = /* @__PURE__ */ new WeakMap(), Xa = /* @__PURE__ */ new Set(), Qa = /* @__PURE__ */ new Set(), bu = {
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
function Za(t, e = {}) {
  var p, y, w;
  if (!t) return !1;
  Wi(t);
  const n = e.mode ?? (e.color != null ? "custom" : "hover"), i = bu[n] ?? bu.hover, r = e.color ?? i.borderColor, a = e.alpha ?? i.borderAlpha, o = e.color ?? i.spriteTint, s = i.spriteAlpha, l = e.pulse ?? i.pulse, u = { border: null, sprite: null, pulseData: null, mode: n }, d = ((p = t.document) == null ? void 0 : p.width) ?? t.w ?? 100, f = ((y = t.document) == null ? void 0 : y.height) ?? t.h ?? 100, h = new PIXI.Graphics();
  h.lineStyle(i.borderWidth, r, a), h.drawRect(0, 0, d, f), t.addChild(h), u.border = h;
  const g = Jy(t, o, s);
  if (g && (canvas.controls.debug.addChild(g), Qa.add(g), u.sprite = g), l && ((w = canvas.app) != null && w.ticker)) {
    const v = {
      elapsed: 0,
      fn: /* @__PURE__ */ c((b) => {
        v.elapsed += b;
        const E = (Math.sin(v.elapsed * 0.05) + 1) / 2;
        u.border && (u.border.alpha = a * (0.4 + 0.6 * E)), u.sprite && (u.sprite.alpha = s * (0.5 + 0.5 * E));
      }, "fn")
    };
    canvas.app.ticker.add(v.fn), u.pulseData = v, Xa.add(v);
  }
  return zi.set(t, u), !0;
}
c(Za, "addHighlight");
function Wi(t) {
  var n, i;
  if (!t) return;
  const e = zi.get(t);
  e && (e.pulseData && ((i = (n = canvas.app) == null ? void 0 : n.ticker) == null || i.remove(e.pulseData.fn), Xa.delete(e.pulseData)), e.border && (e.border.parent && e.border.parent.removeChild(e.border), e.border.destroy({ children: !0 })), e.sprite && (e.sprite.parent && e.sprite.parent.removeChild(e.sprite), e.sprite.destroy({ children: !0 }), Qa.delete(e.sprite)), zi.delete(t));
}
c(Wi, "removeHighlight");
function _f(t) {
  return zi.has(t);
}
c(_f, "hasHighlight");
function Aa() {
  var e, n, i, r, a, o, s;
  for (const l of Xa)
    (n = (e = canvas.app) == null ? void 0 : e.ticker) == null || n.remove(l.fn);
  Xa.clear();
  for (const l of Qa)
    l.parent && l.parent.removeChild(l), l.destroy({ children: !0 });
  Qa.clear();
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
        const d = zi.get(u);
        d && (d.border && (d.border.parent && d.border.parent.removeChild(d.border), d.border.destroy({ children: !0 })), zi.delete(u));
      }
}
c(Aa, "clearAllHighlights");
function Jy(t, e, n) {
  var a;
  const i = t.mesh;
  if (!((a = i == null ? void 0 : i.texture) != null && a.baseTexture)) return null;
  const r = PIXI.Sprite.from(i.texture);
  return r.isSprite = !0, r.anchor.set(i.anchor.x, i.anchor.y), r.width = i.width, r.height = i.height, r.scale = i.scale, r.position = t.center, r.angle = i.angle, r.alpha = n, r.tint = e, r.name = "eidolonPickerHighlight", r;
}
c(Jy, "createTintSprite");
let Wn = null;
function $f(t) {
  var p, y, w;
  Wn && Wn.cancel();
  const { placeableType: e = "Tile", onPick: n, onCancel: i } = t;
  let r = null;
  const a = `control${e}`, o = `hover${e}`, s = /* @__PURE__ */ c((v, b) => {
    var L;
    if (!b) return;
    const E = v.document ?? v;
    (L = v.release) == null || L.call(v), n(E);
  }, "onControl"), l = /* @__PURE__ */ c((v, b) => {
    b ? (r = v, Za(v, { mode: "pick" })) : r === v && (Wi(v), r = null);
  }, "onHoverIn"), u = /* @__PURE__ */ c((v) => {
    v.key === "Escape" && (v.preventDefault(), v.stopPropagation(), g());
  }, "onKeydown"), d = /* @__PURE__ */ c((v) => {
    v.preventDefault(), g();
  }, "onContextMenu"), f = Hooks.on(a, s), h = Hooks.on(o, l);
  document.addEventListener("keydown", u, { capture: !0 }), (p = canvas.stage) == null || p.addEventListener("rightclick", d), (w = (y = ui.notifications) == null ? void 0 : y.info) == null || w.call(y, `Pick mode active — click a ${e.toLowerCase()} on the canvas, or press ESC to cancel.`, { permanent: !1 });
  function g() {
    var v;
    Wn && (Wn = null, Hooks.off(a, f), Hooks.off(o, h), document.removeEventListener("keydown", u, { capture: !0 }), (v = canvas.stage) == null || v.removeEventListener("rightclick", d), r && (Wi(r), r = null), i == null || i());
  }
  return c(g, "cancel"), Wn = { cancel: g }, { cancel: g };
}
c($f, "enterPickMode");
function cr() {
  Wn && Wn.cancel();
}
c(cr, "cancelPickMode");
const Yy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cancelPickMode: cr,
  enterPickMode: $f
}, Symbol.toStringTag, { value: "Module" }));
var Hu, Ae, je, Br, Sn, Ur, Vr, Ye, Cn, de, xf, Ml, Ff, Df, Pf, Nl, _l, Rf, Hf;
const ot = class ot extends qn(Hn) {
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
    k(this, je, !1);
    /** @type {string} Placeable type (Tile, Token, etc.). */
    k(this, Br, "Tile");
    /** @type {string} Current tag match mode. */
    k(this, Sn, "any");
    /** @type {((selectors: string[]) => void) | null} */
    k(this, Ur, null);
    /** @type {(() => void) | null} */
    k(this, Vr, null);
    /** @type {Promise resolve function for the open() API. */
    k(this, Ye, null);
    /** @type {PlaceableObject | null} Currently hovered tile in the browser. */
    k(this, Cn, null);
    I(this, Ae, [...n.selections ?? []]), I(this, Br, n.placeableType ?? "Tile"), I(this, Ur, n.onApply ?? null), I(this, Vr, n.onCancel ?? null);
  }
  // ── Context ───────────────────────────────────────────────────────────
  async _prepareContext() {
    var r;
    const n = C(this, de, Nl).call(this), i = (((r = canvas.tiles) == null ? void 0 : r.placeables) ?? []).map((a, o) => {
      var d, f;
      const s = a.document, l = s.id, u = (d = s.texture) != null && d.src ? s.texture.src.split("/").pop().replace(/\.[^.]+$/, "") : `Tile ${o + 1}`;
      return {
        id: l,
        name: u.length > 20 ? u.slice(0, 18) + "..." : u,
        thumbnailSrc: ((f = s.texture) == null ? void 0 : f.src) ?? null,
        selected: n.has(l)
      };
    });
    return {
      selections: m(this, Ae),
      selectionCount: m(this, Ae).length,
      pickModeActive: m(this, je),
      tagModeIsAny: m(this, Sn) === "any",
      tagModeIsAll: m(this, Sn) === "all",
      tagPreviewCount: 0,
      tiles: i,
      tileCount: i.length
    };
  }
  // ── Render & Events ───────────────────────────────────────────────────
  _onRender(n, i) {
    super._onRender(n, i), C(this, de, xf).call(this), C(this, de, _l).call(this);
  }
  async _onClose(n) {
    return m(this, je) && (cr(), I(this, je, !1)), Aa(), m(this, Ye) && (m(this, Ye).call(this, null), I(this, Ye, null)), super._onClose(n);
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
      const r = new ot({
        ...n,
        onApply: /* @__PURE__ */ c((a) => i(a), "onApply"),
        onCancel: /* @__PURE__ */ c(() => i(null), "onCancel")
      });
      I(r, Ye, i), r.render(!0);
    });
  }
};
Ae = new WeakMap(), je = new WeakMap(), Br = new WeakMap(), Sn = new WeakMap(), Ur = new WeakMap(), Vr = new WeakMap(), Ye = new WeakMap(), Cn = new WeakMap(), de = new WeakSet(), xf = /* @__PURE__ */ c(function() {
  var a, o, s, l;
  const n = this.element;
  if (!(n instanceof HTMLElement)) return;
  const i = n.querySelector("[data-role='tag-input']"), r = n.querySelector("[data-role='tag-mode']");
  r == null || r.addEventListener("change", (u) => {
    I(this, Sn, u.target.value);
  }), i == null || i.addEventListener("input", () => {
    C(this, de, Ff).call(this, n);
  }), i == null || i.addEventListener("keydown", (u) => {
    u.key === "Enter" && (u.preventDefault(), C(this, de, Ml).call(this, n));
  }), (a = n.querySelector("[data-action='add-tag-selector']")) == null || a.addEventListener("click", () => {
    C(this, de, Ml).call(this, n);
  }), (o = n.querySelector("[data-action='toggle-pick-mode']")) == null || o.addEventListener("click", () => {
    m(this, je) ? (cr(), I(this, je, !1)) : (I(this, je, !0), $f({
      placeableType: m(this, Br),
      onPick: /* @__PURE__ */ c((u) => {
        C(this, de, Df).call(this, u.id);
      }, "onPick"),
      onCancel: /* @__PURE__ */ c(() => {
        I(this, je, !1), this.render({ force: !0 });
      }, "onCancel")
    })), this.render({ force: !0 });
  }), n.querySelectorAll("[data-action='toggle-tile']").forEach((u) => {
    u.addEventListener("click", () => {
      const d = u.dataset.docId;
      d && C(this, de, Pf).call(this, d);
    }), u.addEventListener("mouseenter", () => {
      var h, g;
      const d = u.dataset.docId;
      if (!d) return;
      const f = (g = (h = canvas.tiles) == null ? void 0 : h.placeables) == null ? void 0 : g.find((p) => p.document.id === d);
      f && (I(this, Cn, f), Za(f, { mode: "hover" }));
    }), u.addEventListener("mouseleave", () => {
      m(this, Cn) && (Wi(m(this, Cn)), I(this, Cn, null), C(this, de, _l).call(this));
    });
  }), n.querySelectorAll("[data-action='remove-selection']").forEach((u) => {
    u.addEventListener("click", () => {
      const d = Number(u.dataset.selectionIndex);
      Number.isNaN(d) || (m(this, Ae).splice(d, 1), this.render({ force: !0 }));
    });
  }), (s = n.querySelector("[data-action='apply']")) == null || s.addEventListener("click", () => {
    C(this, de, Rf).call(this);
  }), (l = n.querySelector("[data-action='cancel']")) == null || l.addEventListener("click", () => {
    C(this, de, Hf).call(this);
  });
}, "#bindEvents"), // ── Tag helpers ───────────────────────────────────────────────────────
Ml = /* @__PURE__ */ c(function(n) {
  var s;
  const i = n.querySelector("[data-role='tag-input']"), r = (s = i == null ? void 0 : i.value) == null ? void 0 : s.trim();
  if (!r) return;
  const a = r.split(",").map((l) => l.trim()).filter(Boolean);
  if (a.length === 0) return;
  const o = Ef(a, m(this, Sn));
  o && !m(this, Ae).includes(o) && m(this, Ae).push(o), i && (i.value = ""), this.render({ force: !0 });
}, "#addTagSelector"), Ff = /* @__PURE__ */ c(function(n) {
  var f, h;
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
  const s = window.Tagger ?? ((f = game.modules.get("tagger")) == null ? void 0 : f.api);
  if (!s) {
    r.textContent = "Tagger not available";
    return;
  }
  const l = m(this, Sn) === "any", u = s.getByTag(o, {
    sceneId: (h = canvas.scene) == null ? void 0 : h.id,
    matchAny: l
  }), d = (u == null ? void 0 : u.length) ?? 0;
  r.textContent = `${d} matching placeable(s)`;
}, "#updateTagPreview"), // ── ID selector helpers ──────────────────────────────────────────────
Df = /* @__PURE__ */ c(function(n) {
  const i = `id:${n}`;
  m(this, Ae).includes(i) || (m(this, Ae).push(i), this.render({ force: !0 }));
}, "#addIdSelector"), Pf = /* @__PURE__ */ c(function(n) {
  const i = `id:${n}`, r = m(this, Ae).indexOf(i);
  r >= 0 ? m(this, Ae).splice(r, 1) : m(this, Ae).push(i), this.render({ force: !0 });
}, "#toggleIdSelector"), /**
 * Get the set of document IDs that are currently selected across all selector types.
 * Resolves tag/tags-any/tags-all selectors to find matching document IDs.
 * @returns {Set<string>}
 */
Nl = /* @__PURE__ */ c(function() {
  const n = /* @__PURE__ */ new Set();
  for (const i of m(this, Ae)) {
    const r = fc(i);
    if (r.type === "id") {
      n.add(r.value);
      continue;
    }
    const a = Ko(i);
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
_l = /* @__PURE__ */ c(function() {
  var r, a;
  const n = C(this, de, Nl).call(this), i = ((r = canvas.tiles) == null ? void 0 : r.placeables) ?? [];
  for (const o of i) {
    const s = (a = o.document) == null ? void 0 : a.id;
    if (!s) continue;
    const l = n.has(s), u = o === m(this, Cn), d = _f(o);
    l && !u && !d ? Za(o, { mode: "selected" }) : !l && d && !u && Wi(o);
  }
}, "#refreshSelectionHighlights"), // ── Apply / Cancel ──────────────────────────────────────────────────
Rf = /* @__PURE__ */ c(function() {
  var i;
  m(this, je) && (cr(), I(this, je, !1)), Aa();
  const n = [...m(this, Ae)];
  (i = m(this, Ur)) == null || i.call(this, n), m(this, Ye) && (m(this, Ye).call(this, n), I(this, Ye, null)), this.close({ force: !0 });
}, "#doApply"), Hf = /* @__PURE__ */ c(function() {
  var n;
  m(this, je) && (cr(), I(this, je, !1)), Aa(), (n = m(this, Vr)) == null || n.call(this), m(this, Ye) && (m(this, Ye).call(this, null), I(this, Ye, null)), this.close({ force: !0 });
}, "#doCancel"), c(ot, "PlaceablePickerApplication"), ye(ot, "APP_ID", `${T}-placeable-picker`), ye(ot, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Fe(ot, ot, "DEFAULT_OPTIONS"),
  {
    id: ot.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Hu = Fe(ot, ot, "DEFAULT_OPTIONS")) == null ? void 0 : Hu.classes) ?? [], "eidolon-placeable-picker-window", "themed"])
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
)), ye(ot, "PARTS", {
  content: {
    template: `modules/${T}/templates/placeable-picker.html`
  }
});
let eo = ot;
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
      const a = e.getEntryAtPath(e.selectedPath), o = ((d = (u = a == null ? void 0 : a.tweens) == null ? void 0 : u[i]) == null ? void 0 : d.target) ?? "", s = o ? [o] : [], l = await eo.open({ selections: s });
      if (l && l.length > 0) {
        if (r.type === "timeline")
          e.mutate((f) => f.updateTween(r.index, i, { target: l[0] }));
        else if (r.type === "branch") {
          const f = (a.tweens ?? []).map((h, g) => g === i ? { ...h, target: l[0] } : h);
          e.mutate((h) => h.updateBranchEntry(r.index, r.branchIndex, r.branchEntryIndex, { tweens: f }));
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
          const l = Of[s], u = { type: s };
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
  var i, r, a, o, s, l, u, d, f, h;
  function n(g, p, y) {
    g.type === "timeline" ? e.mutate((w) => w.updateEntry(g.index, { sound: y })) : g.type === "branch" && e.mutate((w) => w.updateBranchEntry(g.index, g.branchIndex, g.branchEntryIndex, { sound: y }));
  }
  c(n, "applySoundPatch"), (i = t.querySelector("[data-action='change-sound-src']")) == null || i.addEventListener("change", async (g) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = e.getEntryAtPath(e.selectedPath);
    if (!(y != null && y.sound)) return;
    const w = g.target.value, v = { ...y.sound, src: w };
    v.id || (v.id = uu(w));
    const b = await du(w);
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
        v.id || (v.id = uu(w));
        const b = await du(w);
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
  }), (f = t.querySelector("[data-action='change-sound-fireandforget']")) == null || f.addEventListener("change", (g) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = e.getEntryAtPath(e.selectedPath);
    y != null && y.sound && n(p, y, { ...y.sound, fireAndForget: g.target.checked });
  }), (h = t.querySelector("[data-action='change-stopsound-id']")) == null || h.addEventListener("change", (g) => {
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
      !d || d.type !== "timeline" || Number.isNaN(l) || Number.isNaN(u) || e.mutate((f) => f.removeBranchEntry(d.index, l, u));
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
    const { enterPickMode: d } = await Promise.resolve().then(() => Yy);
    d({
      placeableType: "Tile",
      onPick: /* @__PURE__ */ c((h) => {
        var y, w;
        const g = (w = (y = h.flags) == null ? void 0 : y.tagger) == null ? void 0 : w.tags, p = g != null && g.length ? `tag:${g[0]}` : `id:${h.id}`;
        e.setSegmentGate({ ...u, target: p });
      }, "onPick")
    });
  });
  for (const [u, d] of [["change-gate-anim-idle", "idle"], ["change-gate-anim-hover", "hover"], ["change-gate-anim-dim", "dim"]])
    (a = t.querySelector(`[data-action='${u}']`)) == null || a.addEventListener("change", (f) => {
      var v;
      const h = (v = e.state.activeSegment) == null ? void 0 : v.gate;
      if (!h) return;
      const g = f.target.value.trim(), p = g ? g.split(",").map((b) => b.trim()).filter(Boolean) : void 0, y = { ...h.animation ?? {} };
      p != null && p.length ? y[d] = p.length === 1 ? p[0] : p : delete y[d];
      const w = { ...h, animation: Object.keys(y).length ? y : void 0 };
      w.animation || delete w.animation, e.setSegmentGate(w);
    });
  (o = t.querySelector("[data-action='change-segment-next']")) == null || o.addEventListener("change", (u) => {
    const d = u.target.value;
    e.setSegmentNext(d || null);
  }), (s = t.querySelector("[data-action='edit-segment-setup']")) == null || s.addEventListener("click", () => {
    Ya("setup", { state: e.state, mutate: e.mutate });
  }), (l = t.querySelector("[data-action='edit-segment-landing']")) == null || l.addEventListener("click", () => {
    Ya("landing", { state: e.state, mutate: e.mutate });
  });
}
c(tb, "bindSegmentDetailEvents");
var qu, Be, z, Xe, Tn, St, Qe, Ue, No, _e, Ze, _o, an, Bi, ct, si, Ln, li, j, qf, jf, Bf, Uf, mn, xl, Fl, Dl, Pl, Vf, hn, Rl, Gf, zf, Wf, Kf, Jf, Hl, ur;
const bt = class bt extends qn(Hn) {
  constructor(n = {}) {
    super(n);
    k(this, j);
    k(this, Be, null);
    k(this, z, null);
    k(this, Xe, null);
    k(this, Tn, /* @__PURE__ */ new Set());
    k(this, St, !1);
    k(this, Qe, null);
    k(this, Ue, null);
    k(this, No, 120);
    k(this, _e, []);
    k(this, Ze, -1);
    k(this, _o, 50);
    k(this, an, null);
    k(this, Bi, null);
    k(this, ct, null);
    k(this, si, null);
    k(this, Ln, null);
    k(this, li, null);
    I(this, Be, n.scene ?? canvas.scene ?? null), I(this, z, Bt.fromScene(m(this, Be)));
  }
  // ── Context ───────────────────────────────────────────────────────────
  async _prepareContext() {
    var g, p;
    const n = Ny(m(this, z), m(this, z).activeSegmentName), i = ky(m(this, z).timeline, {
      selectedPath: m(this, Xe),
      windowWidth: ((g = this.position) == null ? void 0 : g.width) ?? 1100
    }), r = m(this, Xe) != null ? By(m(this, Xe), { state: m(this, z), expandedTweens: m(this, Tn) }) : null, a = m(this, z).listCinematicNames(), o = m(this, z).activeCinematicName, l = m(this, z).listSegmentNames().length > 1, u = m(this, z).activeSegment, d = (u == null ? void 0 : u.gate) ?? null, f = (u == null ? void 0 : u.next) ?? null, h = typeof f == "string" ? f : (f == null ? void 0 : f.segment) ?? null;
    return {
      // Toolbar
      sceneName: ((p = m(this, Be)) == null ? void 0 : p.name) ?? "No scene",
      dirty: m(this, St),
      canUndo: m(this, j, xl),
      canRedo: m(this, j, Fl),
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
      activeSegmentNext: h,
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
      targetCount: _y(m(this, z)),
      setupCount: Object.keys(m(this, z).setup ?? {}).length,
      landingCount: Object.keys(m(this, z).landing ?? {}).length
    };
  }
  // ── Render & Events ───────────────────────────────────────────────────
  _onRender(n, i) {
    var r, a, o;
    if (super._onRender(n, i), C(this, j, qf).call(this), !m(this, si)) {
      const s = (a = (r = game.modules.get(T)) == null ? void 0 : r.api) == null ? void 0 : a.cinematic;
      s != null && s.onPlaybackProgress ? (I(this, si, s.onPlaybackProgress((l) => C(this, j, Jf).call(this, l))), console.log("[cinematic-editor] Subscribed to playback progress events")) : console.warn("[cinematic-editor] onPlaybackProgress not available on API", s);
    }
    if (m(this, li) && ((o = this.element) == null || o.querySelectorAll(".cinematic-editor__segment-node").forEach((s) => {
      s.classList.toggle("cinematic-editor__segment-node--playing", s.dataset.segmentName === m(this, li));
    }), m(this, ct) && m(this, ct).segmentName === m(this, z).activeSegmentName)) {
      const s = performance.now() - m(this, ct).startTime;
      m(this, ct).durationMs - s > 0 && C(this, j, Hl).call(this, m(this, ct).durationMs, m(this, ct).startTime);
    }
    m(this, an) || (I(this, an, (s) => {
      !s.ctrlKey && !s.metaKey || (s.key === "z" && !s.shiftKey ? (s.preventDefault(), C(this, j, Dl).call(this)) : (s.key === "z" && s.shiftKey || s.key === "y") && (s.preventDefault(), C(this, j, Pl).call(this)));
    }), document.addEventListener("keydown", m(this, an)));
  }
  async close(n = {}) {
    if (m(this, Ue) && C(this, j, hn).call(this), m(this, St) && !n.force) {
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
      i === "save" && await C(this, j, Rl).call(this);
    }
    return super.close(n);
  }
  async _onClose(n) {
    var i;
    return m(this, Qe) !== null && (clearTimeout(m(this, Qe)), I(this, Qe, null)), m(this, an) && (document.removeEventListener("keydown", m(this, an)), I(this, an, null)), (i = m(this, si)) == null || i.call(this), I(this, si, null), C(this, j, ur).call(this), super._onClose(n);
  }
};
Be = new WeakMap(), z = new WeakMap(), Xe = new WeakMap(), Tn = new WeakMap(), St = new WeakMap(), Qe = new WeakMap(), Ue = new WeakMap(), No = new WeakMap(), _e = new WeakMap(), Ze = new WeakMap(), _o = new WeakMap(), an = new WeakMap(), Bi = new WeakMap(), ct = new WeakMap(), si = new WeakMap(), Ln = new WeakMap(), li = new WeakMap(), j = new WeakSet(), // ── Event binding ─────────────────────────────────────────────────────
qf = /* @__PURE__ */ c(function() {
  const n = this.element;
  if (!(n instanceof HTMLElement)) return;
  const i = C(this, j, jf).call(this);
  Gy(n, i), zy(n, i), eb(n, i), Wy(n, i), Ky(n, i), Xy(n, i), Qy(n, i), Zy(n, i), tb(n, i);
}, "#bindEvents"), jf = /* @__PURE__ */ c(function() {
  const n = this;
  return {
    // State access (read-only getters — closures over `self` for private field access)
    get state() {
      return m(n, z);
    },
    get selectedPath() {
      return m(n, Xe);
    },
    get scene() {
      return m(n, Be);
    },
    get expandedTweens() {
      return m(n, Tn);
    },
    get insertMenuState() {
      return m(n, Bi);
    },
    // Mutations
    mutate: /* @__PURE__ */ c((i) => C(this, j, mn).call(this, i), "mutate"),
    setSelectedPath: /* @__PURE__ */ c((i) => {
      I(this, Xe, i), this.render({ force: !0 });
    }, "setSelectedPath"),
    render: /* @__PURE__ */ c(() => this.render({ force: !0 }), "render"),
    // Cinematic switching (needs full state swap + clear)
    switchCinematic: /* @__PURE__ */ c((i) => {
      m(this, Ue) && C(this, j, hn).call(this), I(this, z, m(this, z).switchCinematic(i)), I(this, Xe, null), m(this, Tn).clear(), this.render({ force: !0 });
    }, "switchCinematic"),
    // Segment management
    selectSegment: /* @__PURE__ */ c((i) => {
      m(this, Ue) && C(this, j, hn).call(this), I(this, z, m(this, z).switchSegment(i)), I(this, Xe, null), m(this, Tn).clear(), this.render({ force: !0 });
    }, "selectSegment"),
    addSegment: /* @__PURE__ */ c((i) => {
      C(this, j, mn).call(this, (r) => r.addSegment(i, r.activeSegmentName));
    }, "addSegment"),
    removeSegment: /* @__PURE__ */ c((i) => {
      C(this, j, mn).call(this, (r) => r.removeSegment(i));
    }, "removeSegment"),
    renameSegment: /* @__PURE__ */ c((i, r) => {
      C(this, j, mn).call(this, (a) => a.renameSegment(i, r));
    }, "renameSegment"),
    setSegmentGate: /* @__PURE__ */ c((i) => {
      C(this, j, mn).call(this, (r) => r.setSegmentGate(i));
    }, "setSegmentGate"),
    setSegmentNext: /* @__PURE__ */ c((i) => {
      C(this, j, mn).call(this, (r) => r.setSegmentNext(i));
    }, "setSegmentNext"),
    // Tween debouncing
    queueTweenChange: /* @__PURE__ */ c((i, r) => C(this, j, Vf).call(this, i, r), "queueTweenChange"),
    flushTweenChanges: /* @__PURE__ */ c(() => {
      m(this, Ue) && C(this, j, hn).call(this);
    }, "flushTweenChanges"),
    flushTweenChangesImmediate: /* @__PURE__ */ c(() => {
      m(this, Qe) !== null && clearTimeout(m(this, Qe)), I(this, Qe, null), C(this, j, hn).call(this);
    }, "flushTweenChangesImmediate"),
    // Path utilities
    parseEntryPath: Pn,
    getEntryAtPath: /* @__PURE__ */ c((i) => Ja(i, m(this, z)), "getEntryAtPath"),
    // Insert menu
    showInsertMenu: /* @__PURE__ */ c((i, r, a) => C(this, j, Bf).call(this, i, r, a), "showInsertMenu"),
    hideInsertMenu: /* @__PURE__ */ c(() => C(this, j, Uf).call(this), "hideInsertMenu"),
    // Toolbar actions
    save: /* @__PURE__ */ c(() => C(this, j, Rl).call(this), "save"),
    play: /* @__PURE__ */ c(() => C(this, j, Gf).call(this), "play"),
    resetTracking: /* @__PURE__ */ c(() => C(this, j, zf).call(this), "resetTracking"),
    exportJSON: /* @__PURE__ */ c(() => C(this, j, Wf).call(this), "exportJSON"),
    validate: /* @__PURE__ */ c(() => C(this, j, Kf).call(this), "validate"),
    importJSON: /* @__PURE__ */ c(() => Uy({ state: m(this, z), mutate: /* @__PURE__ */ c((i) => C(this, j, mn).call(this, i), "mutate") }), "importJSON"),
    undo: /* @__PURE__ */ c(() => C(this, j, Dl).call(this), "undo"),
    redo: /* @__PURE__ */ c(() => C(this, j, Pl).call(this), "redo")
  };
}, "#createEventContext"), // ── Insert menu ───────────────────────────────────────────────────────
Bf = /* @__PURE__ */ c(function(n, i, r) {
  var l;
  const a = (l = this.element) == null ? void 0 : l.querySelector(".cinematic-editor__insert-menu");
  if (!a) return;
  const o = n.getBoundingClientRect();
  document.body.appendChild(a), a.style.display = "", a.style.position = "fixed", a.style.left = `${o.left}px`;
  const s = a.offsetHeight || 200;
  o.bottom + 4 + s > window.innerHeight ? a.style.top = `${o.top - s - 4}px` : a.style.top = `${o.bottom + 4}px`, I(this, Bi, { insertIndex: i, lane: r });
}, "#showInsertMenu"), Uf = /* @__PURE__ */ c(function() {
  var i, r;
  const n = document.body.querySelector(".cinematic-editor__insert-menu") ?? ((i = this.element) == null ? void 0 : i.querySelector(".cinematic-editor__insert-menu"));
  if (n) {
    n.style.display = "none";
    const a = (r = this.element) == null ? void 0 : r.querySelector(".cinematic-editor");
    a && n.parentNode !== a && a.appendChild(n);
  }
  I(this, Bi, null);
}, "#hideInsertMenu"), // ── State mutation ────────────────────────────────────────────────────
mn = /* @__PURE__ */ c(function(n) {
  I(this, _e, m(this, _e).slice(0, m(this, Ze) + 1)), m(this, _e).push(m(this, z)), m(this, _e).length > m(this, _o) && m(this, _e).shift(), I(this, Ze, m(this, _e).length - 1), I(this, z, n(m(this, z))), I(this, St, !0), this.render({ force: !0 });
}, "#mutate"), xl = /* @__PURE__ */ c(function() {
  return m(this, Ze) >= 0;
}, "#canUndo"), Fl = /* @__PURE__ */ c(function() {
  return m(this, Ze) < m(this, _e).length - 1;
}, "#canRedo"), Dl = /* @__PURE__ */ c(function() {
  m(this, j, xl) && (m(this, Ze) === m(this, _e).length - 1 && m(this, _e).push(m(this, z)), I(this, z, m(this, _e)[m(this, Ze)]), Zo(this, Ze)._--, I(this, St, !0), this.render({ force: !0 }));
}, "#undo"), Pl = /* @__PURE__ */ c(function() {
  m(this, j, Fl) && (Zo(this, Ze)._++, I(this, z, m(this, _e)[m(this, Ze) + 1]), I(this, St, !0), this.render({ force: !0 }));
}, "#redo"), Vf = /* @__PURE__ */ c(function(n, i) {
  var r;
  m(this, Xe) != null && (I(this, Ue, {
    ...m(this, Ue) ?? {},
    entryPath: m(this, Xe),
    tweenIndex: n,
    patch: { ...((r = m(this, Ue)) == null ? void 0 : r.patch) ?? {}, ...i }
  }), m(this, Qe) !== null && clearTimeout(m(this, Qe)), I(this, Qe, setTimeout(() => {
    I(this, Qe, null), C(this, j, hn).call(this);
  }, m(this, No))));
}, "#queueTweenChange"), hn = /* @__PURE__ */ c(function() {
  if (!m(this, Ue)) return;
  const { entryPath: n, tweenIndex: i, patch: r } = m(this, Ue);
  I(this, Ue, null);
  const a = Pn(n);
  if (a) {
    if (a.type === "timeline")
      I(this, z, m(this, z).updateTween(a.index, i, r));
    else if (a.type === "branch") {
      const o = Ja(n, m(this, z));
      if (o) {
        const s = (o.tweens ?? []).map((l, u) => u === i ? { ...l, ...r } : l);
        I(this, z, m(this, z).updateBranchEntry(a.index, a.branchIndex, a.branchEntryIndex, { tweens: s }));
      }
    }
    I(this, St, !0);
  }
}, "#flushTweenChanges"), Rl = /* @__PURE__ */ c(async function() {
  var n, i, r, a, o, s;
  if (m(this, Be)) {
    if (m(this, Ue) && C(this, j, hn).call(this), m(this, z).isStale(m(this, Be))) {
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
        I(this, z, Bt.fromScene(m(this, Be), m(this, z).activeCinematicName)), I(this, St, !1), I(this, _e, []), I(this, Ze, -1), this.render({ force: !0 }), (i = (n = ui.notifications) == null ? void 0 : n.info) == null || i.call(n, "Cinematic reloaded from scene.");
        return;
      }
      if (!l) return;
    }
    try {
      await m(this, z).save(m(this, Be)), I(this, z, Bt.fromScene(m(this, Be), m(this, z).activeCinematicName)), I(this, St, !1), (a = (r = ui.notifications) == null ? void 0 : r.info) == null || a.call(r, "Cinematic saved."), this.render({ force: !0 });
    } catch (l) {
      console.error(`${T} | Cinematic save failed`, l), (s = (o = ui.notifications) == null ? void 0 : o.error) == null || s.call(o, "Failed to save cinematic data.");
    }
  }
}, "#onSave"), Gf = /* @__PURE__ */ c(async function() {
  var i, r, a, o, s;
  const n = (r = (i = game.modules.get(T)) == null ? void 0 : i.api) == null ? void 0 : r.cinematic;
  if (!(n != null && n.play)) {
    (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, "Cinematic API not available.");
    return;
  }
  await n.play((s = m(this, Be)) == null ? void 0 : s.id, m(this, z).activeCinematicName);
}, "#onPlay"), zf = /* @__PURE__ */ c(async function() {
  var i, r, a, o, s;
  const n = (r = (i = game.modules.get(T)) == null ? void 0 : i.api) == null ? void 0 : r.cinematic;
  n != null && n.reset && (await n.reset((a = m(this, Be)) == null ? void 0 : a.id, m(this, z).activeCinematicName), (s = (o = ui.notifications) == null ? void 0 : o.info) == null || s.call(o, "Cinematic tracking reset."));
}, "#onResetTracking"), Wf = /* @__PURE__ */ c(async function() {
  var i, r;
  const n = JSON.stringify(m(this, z).toJSON(), null, 2);
  try {
    await navigator.clipboard.writeText(n), (r = (i = ui.notifications) == null ? void 0 : i.info) == null || r.call(i, "Cinematic JSON copied to clipboard.");
  } catch {
    new Dialog({
      title: "Cinematic JSON",
      content: `<textarea style="width:100%;height:300px;font-family:monospace;font-size:0.8rem">${Ot(n)}</textarea>`,
      buttons: { ok: { label: "Close" } }
    }).render(!0);
  }
}, "#onExportJSON"), Kf = /* @__PURE__ */ c(function() {
  var l, u;
  const n = m(this, z).toJSON(), { targets: i, unresolved: r } = Ka(n), a = wy(n, i), o = [
    ...r.map((d) => ({ path: "targets", level: "warn", message: `Unresolved target: "${d}"` })),
    ...a
  ];
  if (o.length === 0) {
    (u = (l = ui.notifications) == null ? void 0 : l.info) == null || u.call(l, "Cinematic validation passed — no issues found.");
    return;
  }
  const s = o.map((d) => {
    const f = d.level === "error" ? "fa-circle-xmark" : "fa-triangle-exclamation", h = d.level === "error" ? "#e74c3c" : "#f39c12";
    return `<li style="margin:0.3rem 0"><i class="fa-solid ${f}" style="color:${h};margin-right:0.3rem"></i><strong>${Ot(d.path)}</strong>: ${Ot(d.message)}</li>`;
  });
  new Dialog({
    title: "Cinematic Validation",
    content: `<p>${o.length} issue(s) found:</p><ul style="list-style:none;padding:0;max-height:300px;overflow:auto">${s.join("")}</ul>`,
    buttons: { ok: { label: "Close" } }
  }).render(!0);
}, "#onValidate"), // ── Playback progress ────────────────────────────────────────────────
Jf = /* @__PURE__ */ c(function(n) {
  var i, r, a, o, s, l;
  switch (console.log(`[cinematic-editor] playback event: ${n.type}`, n), n.type) {
    case "segment-start":
      I(this, li, n.segmentName), n.segmentName !== m(this, z).activeSegmentName ? (I(this, z, m(this, z).switchSegment(n.segmentName)), I(this, Xe, null), m(this, Tn).clear(), this.render({ force: !0 })) : (i = this.element) == null || i.querySelectorAll(".cinematic-editor__segment-node").forEach((u) => {
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
      I(this, ct, { segmentName: n.segmentName, startTime: performance.now(), durationMs: n.durationMs }), n.segmentName === m(this, z).activeSegmentName && C(this, j, Hl).call(this, n.durationMs);
      break;
    case "timeline-end":
      C(this, j, ur).call(this), I(this, ct, null);
      break;
    case "playback-end":
      C(this, j, ur).call(this), I(this, ct, null), I(this, li, null), (l = this.element) == null || l.querySelectorAll(".cinematic-editor__segment-node--playing, .cinematic-editor__segment-node--gate-waiting").forEach((u) => {
        u.classList.remove("cinematic-editor__segment-node--playing", "cinematic-editor__segment-node--gate-waiting");
      });
      break;
  }
}, "#onPlaybackEvent"), Hl = /* @__PURE__ */ c(function(n, i = null) {
  var u, d;
  C(this, j, ur).call(this);
  const r = (u = this.element) == null ? void 0 : u.querySelector(".cinematic-editor__playback-cursor"), a = (d = this.element) == null ? void 0 : d.querySelector(".cinematic-editor__swimlane");
  if (console.log(`[cinematic-editor] startCursor: duration=${n}, cursor=${!!r}, swimlane=${!!a}, width=${a == null ? void 0 : a.scrollWidth}`), !r || !a || n <= 0) return;
  r.style.display = "block";
  const o = i ?? performance.now(), s = a.scrollWidth, l = /* @__PURE__ */ c(() => {
    const f = performance.now() - o, h = Math.min(f / n, 1), g = Cr + h * (s - Cr);
    r.style.left = `${g}px`, h < 1 && I(this, Ln, requestAnimationFrame(l));
  }, "tick");
  I(this, Ln, requestAnimationFrame(l));
}, "#startCursorAnimation"), ur = /* @__PURE__ */ c(function() {
  var i;
  m(this, Ln) && (cancelAnimationFrame(m(this, Ln)), I(this, Ln, null));
  const n = (i = this.element) == null ? void 0 : i.querySelector(".cinematic-editor__playback-cursor");
  n && (n.style.display = "none");
}, "#stopCursorAnimation"), c(bt, "CinematicEditorApplication"), ye(bt, "APP_ID", `${T}-cinematic-editor`), ye(bt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Fe(bt, bt, "DEFAULT_OPTIONS"),
  {
    id: bt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((qu = Fe(bt, bt, "DEFAULT_OPTIONS")) == null ? void 0 : qu.classes) ?? [], "eidolon-cinematic-editor-window", "themed"])
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
)), ye(bt, "PARTS", {
  content: {
    template: `modules/${T}/templates/cinematic-editor.html`
  }
});
let $l = bt;
const Yf = /* @__PURE__ */ new Map();
function pe(t, e) {
  Yf.set(t, e);
}
c(pe, "registerBehaviour");
function ql(t) {
  return Yf.get(t);
}
c(ql, "getBehaviour");
function nb(t, e, n) {
  let i, r, a;
  if (e === 0)
    i = r = a = n;
  else {
    const o = /* @__PURE__ */ c((u, d, f) => (f < 0 && (f += 1), f > 1 && (f -= 1), f < 0.16666666666666666 ? u + (d - u) * 6 * f : f < 0.5 ? d : f < 0.6666666666666666 ? u + (d - u) * (0.6666666666666666 - f) * 6 : u), "hue2rgb"), s = n < 0.5 ? n * (1 + e) : n + e - n * e, l = 2 * n - s;
    i = o(l, s, t + 1 / 3), r = o(l, s, t), a = o(l, s, t - 1 / 3);
  }
  return Math.round(i * 255) << 16 | Math.round(r * 255) << 8 | Math.round(a * 255);
}
c(nb, "hslToInt");
pe("float", (t, e = {}) => {
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
pe("pulse", (t, e = {}) => {
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
pe("scale", (t, e = {}) => {
  const n = t.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.factor ?? 1.12, r = e.durationFrames ?? 15, a = Gt(e.easing ?? "easeOutCubic"), o = n.scale.x, s = n.scale.y, l = o * i, u = s * i;
  let d = 0;
  return {
    update(f) {
      if (d < r) {
        d += f;
        const h = Math.min(d / r, 1), g = a(h);
        n.scale.x = o + (l - o) * g, n.scale.y = s + (u - s) * g;
      }
    },
    detach() {
      n.scale.x = o, n.scale.y = s;
    }
  };
});
pe("glow", (t, e = {}) => {
  var v, b;
  const n = t.mesh;
  if (!((v = n == null ? void 0 : n.texture) != null && v.baseTexture)) return { update() {
  }, detach() {
  } };
  const i = t.document, r = e.color ?? 4513279, a = e.alpha ?? 0.5, o = e.blur ?? 8, s = e.pulseSpeed ?? 0.03, l = Math.abs(i.width), u = Math.abs(i.height), d = PIXI.Sprite.from(n.texture);
  d.anchor.set(0.5, 0.5), d.width = l, d.height = u, d.position.set(l / 2, u / 2), d.angle = i.rotation ?? 0, d.alpha = a, d.tint = r;
  const f = PIXI.BlurFilter ?? ((b = PIXI.filters) == null ? void 0 : b.BlurFilter), h = new f(o);
  d.filters = [h], t.addChildAt(d, 0);
  const g = n.scale.x, p = n.scale.y, y = n.angle;
  let w = 0;
  return {
    update(E) {
      w += E;
      const L = (Math.sin(w * s) + 1) / 2;
      d.visible = n.visible !== !1, d.alpha = a * (0.5 + 0.5 * L) * (n.alpha ?? 1), d.scale.set(n.scale.x / g, n.scale.y / p), d.angle = (i.rotation ?? 0) + (n.angle - y);
    },
    detach() {
      d.parent && d.parent.removeChild(d), d.destroy({ children: !0 });
    }
  };
});
pe("wobble", (t, e = {}) => {
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
pe("colorCycle", (t, e = {}) => {
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
pe("spin", (t, e = {}) => {
  const n = t.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.speed ?? 0.5, r = n.angle;
  return {
    update(a) {
      n.angle += a * i;
    },
    detach() {
      n.angle = r;
    }
  };
});
pe("bounce", (t, e = {}) => {
  const n = t.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.speed ?? 0.02, r = e.amplitude ?? 6, a = Gt("easeOutBounce"), o = n.position.y;
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
pe("borderTrace", (t, e = {}) => {
  const n = t.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), a = Math.abs(i.height), o = 2 * (r + a), s = e.speed ?? 1.5, l = e.length ?? 60, u = e.color ?? 4513279, d = e.alpha ?? 0.8, f = e.lineWidth ?? 2, h = new PIXI.Graphics();
  h.alpha = d, h.pivot.set(r / 2, a / 2), h.position.set(r / 2, a / 2), t.addChildAt(h, 0);
  const g = n.scale.x, p = n.scale.y, y = n.angle;
  let w = 0;
  function v(b) {
    return b = (b % o + o) % o, b < r ? { x: b, y: 0 } : (b -= r, b < a ? { x: r, y: b } : (b -= a, b < r ? { x: r - b, y: a } : (b -= r, { x: 0, y: a - b })));
  }
  return c(v, "perimeterPoint"), {
    update(b) {
      w = (w + b * s) % o, h.visible = n.visible !== !1, h.alpha = d * (n.alpha ?? 1), h.scale.set(n.scale.x / g, n.scale.y / p), h.angle = n.angle - y, h.clear(), h.lineStyle(f, u, 1);
      const E = 16, L = l / E, A = v(w);
      h.moveTo(A.x, A.y);
      for (let O = 1; O <= E; O++) {
        const M = v(w + O * L);
        h.lineTo(M.x, M.y);
      }
    },
    detach() {
      h.parent && h.parent.removeChild(h), h.destroy({ children: !0 });
    }
  };
});
pe("shimmer", (t, e = {}) => {
  const n = t.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), a = Math.abs(i.height), o = e.speed ?? 1, s = e.bandWidth ?? 40, l = e.alpha ?? 0.15, u = e.pause ?? 120, d = r + a + s, f = d + u * o, h = new PIXI.Container();
  h.pivot.set(r / 2, a / 2), h.position.set(r / 2, a / 2);
  const g = new PIXI.Graphics();
  g.alpha = l;
  const p = new PIXI.Graphics();
  p.beginFill(16777215), p.drawRect(0, 0, r, a), p.endFill(), h.addChild(p), g.mask = p, h.addChild(g), t.addChild(h);
  const y = n.scale.x, w = n.scale.y, v = n.angle;
  let b = 0;
  return {
    update(E) {
      if (b = (b + E * o) % f, h.visible = n.visible !== !1, h.scale.set(n.scale.x / y, n.scale.y / w), h.angle = n.angle - v, g.alpha = l * (n.alpha ?? 1), g.clear(), b < d) {
        const L = b - s;
        g.beginFill(16777215, 1), g.moveTo(L, 0), g.lineTo(L + s, 0), g.lineTo(L + s - a, a), g.lineTo(L - a, a), g.closePath(), g.endFill();
      }
    },
    detach() {
      g.mask = null, h.parent && h.parent.removeChild(h), h.destroy({ children: !0 });
    }
  };
});
pe("breathe", (t, e = {}) => {
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
pe("tiltFollow", (t, e = {}) => {
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
      const u = Math.abs(a.width), d = a.x + u / 2, f = l.x - d, h = Math.max(-i, Math.min(i, f / (u / 2) * i));
      s += (h - s) * r, n.angle = o + s;
    },
    detach() {
      n.angle = o;
    }
  };
});
pe("slideReveal", (t, e = {}) => {
  const n = t.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.offsetX ?? 0, r = e.offsetY ?? 20, a = e.durationFrames ?? 20, o = Gt(e.easing ?? "easeOutCubic"), s = e.delay ?? 0, l = n.position.x, u = n.position.y, d = n.alpha;
  n.position.x = l + i, n.position.y = u + r, n.alpha = 0;
  let f = -s;
  return {
    update(h) {
      if (f += h, f < 0) return;
      if (f >= a) {
        n.position.x = l, n.position.y = u, n.alpha = d;
        return;
      }
      const g = Math.min(f / a, 1), p = o(g);
      n.position.x = l + i * (1 - p), n.position.y = u + r * (1 - p), n.alpha = d * p;
    },
    detach() {
      n.position.x = l, n.position.y = u, n.alpha = d;
    }
  };
});
pe("embers", (t, e = {}) => {
  const n = t.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), a = Math.abs(i.height), o = e.count ?? 12, s = e.speed ?? 0.5, l = e.color ?? 16737792, u = e.alpha ?? 0.6, d = e.size ?? 2, f = new PIXI.Container();
  f.pivot.set(r / 2, a / 2), f.position.set(r / 2, a / 2);
  const h = new PIXI.Graphics();
  f.addChild(h), t.addChild(f);
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
      f.visible = n.visible !== !1, f.scale.set(n.scale.x / g, n.scale.y / p), f.angle = n.angle - y, w.length < o && w.push(v());
      for (let E = w.length - 1; E >= 0; E--) {
        const L = w[E];
        if (L.life += b, L.life >= L.maxLife) {
          w.splice(E, 1);
          continue;
        }
        L.x += L.vx * b, L.y += L.vy * b, L.vx += (Math.random() - 0.5) * 0.05 * b;
      }
      h.clear();
      for (const E of w) {
        const L = 1 - E.life / E.maxLife;
        h.beginFill(l, u * L * (n.alpha ?? 1)), h.drawCircle(E.x, E.y, E.size), h.endFill();
      }
    },
    detach() {
      f.parent && f.parent.removeChild(f), f.destroy({ children: !0 });
    }
  };
});
pe("runeGlow", (t, e = {}) => {
  const n = t.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), a = Math.abs(i.height), o = 2 * (r + a), s = e.dots ?? 3, l = e.speed ?? 1.2, u = e.color ?? 4513279, d = e.color2 ?? 8930559, f = e.radius ?? 3, h = e.alpha ?? 0.7, g = new PIXI.Graphics();
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
      E += L, g.visible = n.visible !== !1, g.alpha = h * (n.alpha ?? 1), g.scale.set(n.scale.x / p, n.scale.y / y), g.angle = n.angle - w, g.clear();
      for (const A of v) {
        const O = b(A.phase + E * l * A.speedMul);
        g.beginFill(A.color, 1), g.drawCircle(O.x, O.y, f), g.endFill();
      }
    },
    detach() {
      g.parent && g.parent.removeChild(g), g.destroy({ children: !0 });
    }
  };
});
pe("ripple", (t, e = {}) => {
  const n = t.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), a = Math.abs(i.height), o = e.maxRadius ?? Math.sqrt(r * r + a * a) / 2, s = e.rings ?? 3, l = e.interval ?? 30, u = e.speed ?? 1.5, d = e.color ?? 4513279, f = e.alpha ?? 0.4, h = e.lineWidth ?? 1.5, g = new PIXI.Container();
  g.pivot.set(r / 2, a / 2), g.position.set(r / 2, a / 2);
  const p = new PIXI.Graphics();
  g.addChild(p), t.addChild(g);
  const y = n.scale.x, w = n.scale.y, v = n.angle, b = [];
  let E = 0, L = 0;
  return {
    update(A) {
      E += A, g.visible = n.visible !== !1, g.scale.set(n.scale.x / y, n.scale.y / w), g.angle = n.angle - v, E >= L && b.length < s && (b.push({ radius: 0, alpha: f }), L = E + l);
      for (let x = b.length - 1; x >= 0; x--) {
        const R = b[x];
        R.radius += u * A, R.alpha = f * (1 - R.radius / o), R.radius >= o && b.splice(x, 1);
      }
      p.clear();
      const O = r / 2, M = a / 2;
      for (const x of b)
        p.lineStyle(h, d, x.alpha * (n.alpha ?? 1)), p.drawCircle(O, M, x.radius);
    },
    detach() {
      g.parent && g.parent.removeChild(g), g.destroy({ children: !0 });
    }
  };
});
pe("frostEdge", (t, e = {}) => {
  const n = t.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), a = Math.abs(i.height), o = e.segments ?? 20, s = e.maxLength ?? 15, l = e.color ?? 11197951, u = e.alpha ?? 0.5, d = e.growSpeed ?? 0.02, f = new PIXI.Container();
  f.pivot.set(r / 2, a / 2), f.position.set(r / 2, a / 2);
  const h = new PIXI.Graphics(), g = new PIXI.Graphics();
  g.beginFill(16777215), g.drawRect(0, 0, r, a), g.endFill(), f.addChild(g), h.mask = g, f.addChild(h), t.addChild(f);
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
      if (f.visible = n.visible !== !1, f.scale.set(n.scale.x / p, n.scale.y / y), f.angle = n.angle - w, b)
        E += L * 0.03;
      else {
        b = !0;
        for (const O of v)
          O.grown || (O.currentLength += (O.targetLength - O.currentLength) * d * L, O.currentLength >= O.targetLength * 0.99 ? (O.currentLength = O.targetLength, O.grown = !0) : b = !1);
      }
      const A = b ? u * (0.7 + 0.3 * Math.sin(E)) : u;
      h.clear(), h.lineStyle(1.5, l, A * (n.alpha ?? 1));
      for (const O of v)
        O.currentLength <= 0 || (h.moveTo(O.sx, O.sy), h.lineTo(O.sx + Math.cos(O.angle) * O.currentLength, O.sy + Math.sin(O.angle) * O.currentLength));
    },
    detach() {
      h.mask = null, f.parent && f.parent.removeChild(f), f.destroy({ children: !0 });
    }
  };
});
pe("shadowLift", (t, e = {}) => {
  var E;
  const n = t.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), a = Math.abs(i.height), o = e.offsetY ?? 6, s = e.blur ?? 6, l = e.alpha ?? 0.35, u = e.color ?? 0, d = e.durationFrames ?? 12, f = Gt(e.easing ?? "easeOutCubic"), h = new PIXI.Graphics(), g = 4;
  h.beginFill(u, 1), h.drawRoundedRect(-g, -g, r + g * 2, a + g * 2, 4), h.endFill(), h.alpha = 0;
  const p = PIXI.BlurFilter ?? ((E = PIXI.filters) == null ? void 0 : E.BlurFilter);
  p && (h.filters = [new p(s)]), t.addChildAt(h, 0);
  const y = n.scale.x, w = n.scale.y, v = n.angle;
  let b = 0;
  return {
    update(L) {
      if (h.visible = n.visible !== !1, h.scale.set(n.scale.x / y, n.scale.y / w), h.angle = (i.rotation ?? 0) + (n.angle - v), b < d) {
        b += L;
        const A = Math.min(b / d, 1), O = f(A);
        h.position.y = o * O, h.alpha = l * O * (n.alpha ?? 1);
      }
    },
    detach() {
      h.parent && h.parent.removeChild(h), h.destroy({ children: !0 });
    }
  };
});
pe("none", () => ({ update() {
}, detach() {
} }));
const ua = {
  idle: ["float", "glow"],
  hover: ["scale"],
  dim: ["none"]
};
function ib(t) {
  if (!t) return { ...ua };
  const e = /* @__PURE__ */ c((n, i) => n === void 0 ? i : typeof n == "string" ? [n] : typeof n == "object" && !Array.isArray(n) && n.name ? [n] : Array.isArray(n) ? n : i, "normalize");
  return {
    idle: e(t.idle, ua.idle),
    hover: e(t.hover, ua.hover),
    dim: e(t.dim, ua.dim)
  };
}
c(ib, "normalizeConfig");
var In, Rt, On, Ht, An, Ui, Mt, Xf, jl, Qf, Zf;
const Lc = class Lc {
  /**
   * @param {PlaceableObject} placeable
   * @param {object|undefined} animationConfig  Raw animation config from the await entry
   */
  constructor(e, n) {
    k(this, Mt);
    k(this, In);
    k(this, Rt);
    k(this, On, null);
    k(this, Ht, []);
    k(this, An, null);
    k(this, Ui, null);
    I(this, In, e), I(this, Rt, ib(n));
  }
  /** Current animation state name. */
  get state() {
    return m(this, On);
  }
  /**
   * Start animating in the given state.
   * @param {string} [state="idle"]
   */
  start(e = "idle") {
    C(this, Mt, Xf).call(this), C(this, Mt, Qf).call(this, e), I(this, An, (n) => {
      for (const i of m(this, Ht)) i.update(n);
    }), canvas.app.ticker.add(m(this, An));
  }
  /**
   * Transition to a new state. Behaviours shared between old and new state
   * (matched by name) are kept alive — only the diff is detached/attached.
   * Mesh is restored to canonical before constructing new behaviours so they
   * always capture clean "original" values (no drift).
   * No-op if already in the requested state.
   * @param {string} state
   */
  setState(e) {
    if (e === m(this, On)) return;
    const n = m(this, Rt)[m(this, On)] ?? m(this, Rt).idle ?? ["none"], i = m(this, Rt)[e] ?? m(this, Rt).idle ?? ["none"], r = /* @__PURE__ */ new Map();
    for (let s = 0; s < m(this, Ht).length; s++) {
      const l = n[s], u = typeof l == "string" ? l : l == null ? void 0 : l.name;
      u && r.set(u, m(this, Ht)[s]);
    }
    const a = [], o = /* @__PURE__ */ new Set();
    for (const s of i) {
      const l = typeof s == "string" ? s : s.name;
      r.has(l) && !o.has(l) && o.add(l);
    }
    for (const [s, l] of r)
      o.has(s) || l.detach();
    C(this, Mt, jl).call(this);
    for (const s of i) {
      const l = typeof s == "string" ? s : s.name;
      if (r.has(l) && o.has(l))
        a.push(r.get(l)), o.delete(l);
      else {
        const u = typeof s == "string" ? void 0 : s, d = ql(l);
        if (!d) {
          console.warn(`TileAnimator: unknown behaviour "${l}"`);
          continue;
        }
        a.push(d(m(this, In), u));
      }
    }
    I(this, On, e), I(this, Ht, a);
  }
  /**
   * Full cleanup — detach all behaviours, restore canonical, and remove ticker.
   */
  detach() {
    var e, n;
    C(this, Mt, Zf).call(this), C(this, Mt, jl).call(this), m(this, An) && ((n = (e = canvas.app) == null ? void 0 : e.ticker) == null || n.remove(m(this, An)), I(this, An, null));
  }
};
In = new WeakMap(), Rt = new WeakMap(), On = new WeakMap(), Ht = new WeakMap(), An = new WeakMap(), Ui = new WeakMap(), Mt = new WeakSet(), // ── Private ──────────────────────────────────────────────────────────
Xf = /* @__PURE__ */ c(function() {
  const e = m(this, In).mesh;
  e && I(this, Ui, {
    x: e.position.x,
    y: e.position.y,
    scaleX: e.scale.x,
    scaleY: e.scale.y,
    angle: e.angle,
    alpha: e.alpha,
    tint: e.tint
  });
}, "#captureCanonical"), jl = /* @__PURE__ */ c(function() {
  const e = m(this, In).mesh;
  if (!e || !m(this, Ui)) return;
  const n = m(this, Ui);
  e.position.x = n.x, e.position.y = n.y, e.scale.x = n.scaleX, e.scale.y = n.scaleY, e.angle = n.angle, e.alpha = n.alpha, e.tint = n.tint;
}, "#restoreCanonical"), Qf = /* @__PURE__ */ c(function(e) {
  I(this, On, e);
  const n = m(this, Rt)[e] ?? m(this, Rt).idle ?? ["none"];
  for (const i of n) {
    const r = typeof i == "string" ? i : i.name, a = typeof i == "string" ? void 0 : i, o = ql(r);
    if (!o) {
      console.warn(`TileAnimator: unknown behaviour "${r}"`);
      continue;
    }
    m(this, Ht).push(o(m(this, In), a));
  }
}, "#attachBehaviours"), Zf = /* @__PURE__ */ c(function() {
  for (const e of m(this, Ht)) e.detach();
  I(this, Ht, []);
}, "#detachBehaviours"), c(Lc, "TileAnimator");
let Ki = Lc;
const rb = "cinematic", ys = 5, Bl = /* @__PURE__ */ new Set();
function Yt(t) {
  for (const e of Bl)
    try {
      e(t);
    } catch (n) {
      console.error("[cinematic] playback listener error:", n);
    }
}
c(Yt, "emitPlaybackEvent");
function ab(t) {
  return Bl.add(t), () => Bl.delete(t);
}
c(ab, "onPlaybackProgress");
let we = null, tn = null, hr = null, gr = null, Ti = 0, Kn = null;
function hc(t, e = "default") {
  return `cinematic-progress-${t}-${e}`;
}
c(hc, "progressFlagKey");
function ob(t, e, n, i) {
  game.user.setFlag(T, hc(t, e), {
    currentSegment: n,
    completedSegments: [...i],
    timestamp: Date.now()
  }).catch(() => {
  });
}
c(ob, "saveSegmentProgress");
function Ul(t, e = "default") {
  game.user.unsetFlag(T, hc(t, e)).catch(() => {
  });
}
c(Ul, "clearProgress");
function em(t, e = "default", n = 3e5) {
  const i = game.user.getFlag(T, hc(t, e));
  return !i || typeof i.timestamp != "number" || Date.now() - i.timestamp > n ? null : i.currentSegment ? i : null;
}
c(em, "getSavedProgress");
function bi(t, e = "default") {
  return `cinematic-seen-${t}-${e}`;
}
c(bi, "seenFlagKey");
function vu(t, e = "default") {
  return !!game.user.getFlag(T, bi(t, e));
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
function Yo(t) {
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
      n.cinematics[i] = Bt.migrateV3toV4(r);
    n.version = 4;
  }
  if (n.version === 4) {
    for (const [i, r] of Object.entries(n.cinematics ?? {}))
      n.cinematics[i] = Bt.migrateV4toV5(r);
    n.version = ys;
  }
  if (n.version > ys)
    return console.warn(`[${T}] Cinematic: scene ${e == null ? void 0 : e.id} has version ${n.version}, runtime supports up to ${ys}. Skipping.`), null;
  if (!n.cinematics || typeof n.cinematics != "object")
    return console.warn(`[${T}] Cinematic: no 'cinematics' map on scene ${e == null ? void 0 : e.id}. Ignoring.`), null;
  for (const [i, r] of Object.entries(n.cinematics)) {
    const a = sb(r, `scene ${e == null ? void 0 : e.id} cinematic "${i}"`);
    a ? n.cinematics[i] = a : delete n.cinematics[i];
  }
  return Object.keys(n.cinematics).length === 0 ? null : n;
}
c(Yo, "getCinematicData");
function to(t, e = "default") {
  var i;
  const n = Yo(t);
  return ((i = n == null ? void 0 : n.cinematics) == null ? void 0 : i[e]) ?? null;
}
c(to, "getNamedCinematic");
function lb(t) {
  const e = Yo(t);
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
      var u, d, f, h;
      const l = (d = (u = game.modules.get(T)) == null ? void 0 : u.api) == null ? void 0 : d.tween;
      l != null && l.Timeline ? (clearInterval(s), clearTimeout(o), r(l.Timeline)) : Date.now() - a > t && (clearInterval(s), clearTimeout(o), console.warn(`[${T}] Cinematic: tween API not available after ${t}ms.`), (h = (f = ui.notifications) == null ? void 0 : f.warn) == null || h.call(f, `[${T}] Cinematic: tween engine unavailable — cinematic cannot play.`), r(null));
    }, 200);
  });
}
c(ub, "waitForTweenAPI");
async function Vl(t = 5e3) {
  var e;
  return window.Tagger ?? ((e = game.modules.get("tagger")) == null ? void 0 : e.api) ? !0 : new Promise((n) => {
    const i = Date.now(), r = setInterval(() => {
      var a;
      window.Tagger ?? ((a = game.modules.get("tagger")) == null ? void 0 : a.api) ? (clearInterval(r), n(!0)) : Date.now() - i > t && (clearInterval(r), console.warn(`[${T}] Cinematic: Tagger API not available after ${t}ms.`), n(!1));
    }, 200);
  });
}
c(Vl, "waitForTagger");
async function db(t, e, n) {
  if (!t || !t.event) return;
  const i = { ...t };
  console.log(`[${T}] Cinematic: waiting for gate: ${t.event}`);
  let r = null;
  if (t.event === "tile-click" && t.target && t.animation) {
    const a = e.get(t.target);
    (a == null ? void 0 : a.kind) === "placeable" && a.placeable && (r = new Ki(a.placeable, t.animation), r.start());
  }
  try {
    if (t.timeout && t.timeout > 0) {
      const a = new Promise((s) => setTimeout(s, t.timeout)), o = wl(i, { signal: n.signal, eventBus: null });
      await Promise.race([o, a]);
    } else
      await wl(i, { signal: n.signal, eventBus: null });
  } finally {
    r && r.detach();
  }
}
c(db, "processGate");
function tm(t) {
  if (!t.segments) return [];
  const e = [], n = /* @__PURE__ */ new Set();
  let i = t.entry;
  for (; i && typeof i == "string" && t.segments[i] && !n.has(i); )
    n.add(i), e.push(i), i = t.segments[i].next;
  return e;
}
c(tm, "getSegmentOrder");
function no(t, e) {
  if (t.setup)
    try {
      Te(t.setup, e);
    } catch (i) {
      console.warn(`[${T}] Cinematic: error applying cinematic-level setup:`, i);
    }
  const n = tm(t);
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
c(no, "applyAllSegmentLandingStates");
async function pr(t, e = "default", n = null) {
  var b, E, L, A, O, M, x, R;
  const i = t ?? ((b = canvas.scene) == null ? void 0 : b.id);
  if (!i) return;
  const r = `${i}:${e}`;
  if (n || (n = /* @__PURE__ */ new Set()), n.has(r)) {
    console.warn(`[${T}] Cinematic: circular transition detected at "${r}". Stopping chain.`), (L = (E = ui.notifications) == null ? void 0 : E.warn) == null || L.call(E, "Cinematic: circular transition detected, stopping.");
    return;
  }
  n.add(r), (we == null ? void 0 : we.status) === "running" && we.cancel("replaced"), we = null, tn && (tn.abort("replaced"), tn = null);
  const a = to(i, e);
  if (!a) {
    console.warn(`[${T}] Cinematic: no cinematic "${e}" on scene ${i}.`);
    return;
  }
  const o = await ub();
  if (!o || ((A = canvas.scene) == null ? void 0 : A.id) !== i || (await Vl(), ((O = canvas.scene) == null ? void 0 : O.id) !== i)) return;
  const { targets: s, unresolved: l } = Ka(a);
  if (console.log(`[${T}] Cinematic "${e}": resolved ${s.size} targets`), l.length && console.warn(`[${T}] Cinematic "${e}": skipping ${l.length} unresolved: ${l.join(", ")}`), s.size === 0) {
    console.warn(`[${T}] Cinematic "${e}": no targets could be resolved on scene ${i}.`);
    return;
  }
  const u = fy(a);
  hr = dy(u, s), gr = s;
  const d = em(i, e), f = new AbortController();
  tn = f;
  const h = a.synchronized === !0 && game.user.isGM, g = tm(a);
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
  Yt({ type: "playback-start", sceneName: ((M = canvas.scene) == null ? void 0 : M.name) ?? i });
  try {
    for (let D = p; D < g.length; D++) {
      if (f.signal.aborted) {
        w = !0;
        break;
      }
      if (((x = canvas.scene) == null ? void 0 : x.id) !== i) {
        w = !0;
        break;
      }
      const F = g[D], _ = a.segments[F];
      if (console.log(`[${T}] Cinematic "${e}": entering segment "${F}"`), Yt({ type: "segment-start", segmentName: F }), ob(i, e, F, [...y]), _.gate) {
        Yt({ type: "gate-wait", segmentName: F, gate: _.gate });
        try {
          await db(_.gate, s, f);
        } catch (B) {
          if (f.signal.aborted) {
            w = !0;
            break;
          }
          throw B;
        }
        Yt({ type: "gate-resolved", segmentName: F });
      }
      if (f.signal.aborted) {
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
        const B = mc(_.timeline);
        Yt({ type: "timeline-start", segmentName: F, durationMs: B });
        const { tl: W } = vy(
          { setup: {}, timeline: _.timeline },
          s,
          o,
          {
            timelineName: `cinematic-${i}-${e}-${F}`,
            onStepComplete: /* @__PURE__ */ c((U) => {
              Yt({ type: "step-complete", segmentName: F, stepIndex: U });
            }, "onStepComplete")
          }
        );
        we = W.run({
          broadcast: h,
          commit: h
        });
        try {
          await new Promise((U, J) => {
            W.onComplete(() => U()), W.onCancel(() => J(new Error("cancelled"))), W.onError((Q) => J(new Error(`timeline error: ${Q}`)));
            const ae = /* @__PURE__ */ c(() => J(new Error("cancelled")), "onAbort");
            f.signal.addEventListener("abort", ae, { once: !0 });
          });
        } catch (U) {
          if (U.message === "cancelled" || f.signal.aborted) {
            w = !0;
            break;
          }
          throw U;
        }
        Yt({ type: "timeline-end", segmentName: F });
      }
      if (f.signal.aborted) {
        w = !0;
        break;
      }
      if (_.landing)
        try {
          Te(_.landing, s), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
        } catch (B) {
          console.error(`[${T}] Cinematic "${e}": error applying landing for segment "${F}":`, B);
        }
      Yt({ type: "segment-complete", segmentName: F }), y.add(F);
      const H = _.next;
      if (H && typeof H == "object" && H.scene) {
        const B = H.scene, W = H.segment ?? a.entry;
        console.log(`[${T}] Cinematic "${e}": cross-scene transition to scene ${B}, segment "${W}"`), we = null, tn = null, Ul(i, e), su(), a.tracking !== !1 && await game.user.setFlag(T, bi(i, e), !0), Kn = { sceneId: B, cinematicName: e, visitedChain: n };
        const q = game.scenes.get(B);
        q ? q.view() : (console.warn(`[${T}] Cinematic: cross-scene transition target scene "${B}" not found.`), Kn = null);
        return;
      }
    }
  } catch (D) {
    v = !0, console.error(`[${T}] Cinematic "${e}" error on scene ${i}:`, D);
  }
  if (we = null, tn = null, Ul(i, e), su(), hr = null, gr = null, Yt({ type: "playback-end", cancelled: !!w }), w) {
    console.log(`[${T}] Cinematic "${e}" cancelled on scene ${i}.`), no(a, s);
    return;
  }
  if (v) {
    no(a, s);
    return;
  }
  a.tracking !== !1 && await game.user.setFlag(T, bi(i, e), !0), console.log(`[${T}] Cinematic "${e}" complete on scene ${i}.`);
}
c(pr, "playCinematic");
async function fb(t, e = "default") {
  var i;
  const n = t ?? ((i = canvas.scene) == null ? void 0 : i.id);
  n && (await game.user.unsetFlag(T, bi(n, e)), console.log(`[${T}] Cinematic: cleared seen flag for "${e}" on scene ${n}.`));
}
c(fb, "resetCinematic");
async function mb(t, e, n = "default") {
  var a;
  if (!game.user.isGM) return;
  const i = t ?? ((a = canvas.scene) == null ? void 0 : a.id);
  if (!i || !e) return;
  const r = game.users.get(e);
  r && (await r.unsetFlag(T, bi(i, n)), console.log(`[${T}] Cinematic: cleared seen flag for user ${r.name} on "${n}" scene ${i}.`));
}
c(mb, "resetCinematicForUser");
async function hb(t, e = "default") {
  var a;
  if (!game.user.isGM) return;
  const n = t ?? ((a = canvas.scene) == null ? void 0 : a.id);
  if (!n) return;
  const i = bi(n, e), r = game.users.map((o) => o.getFlag(T, i) ? o.unsetFlag(T, i) : Promise.resolve());
  await Promise.all(r), console.log(`[${T}] Cinematic: cleared seen flag for all users on "${e}" scene ${n}.`);
}
c(hb, "resetCinematicForAll");
function gb(t, e = "default") {
  var r;
  const n = t ?? ((r = canvas.scene) == null ? void 0 : r.id);
  if (!n) return [];
  const i = bi(n, e);
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
  return e ? to(n, e) != null : Yo(n) != null;
}
c(pb, "hasCinematic");
function yb() {
  if (!hr || !gr) {
    console.warn(`[${T}] Cinematic: no snapshot available for revert.`);
    return;
  }
  (we == null ? void 0 : we.status) === "running" && we.cancel("reverted"), we = null, tn && (tn.abort("reverted"), tn = null);
  try {
    Te(hr, gr), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 }), console.log(`[${T}] Cinematic: reverted to pre-cinematic state.`);
  } catch (t) {
    console.error(`[${T}] Cinematic: error during revert:`, t);
  }
  hr = null, gr = null;
}
c(yb, "revertCinematic");
async function bb() {
  const t = ++Ti;
  if (console.log(`[${T}] Cinematic: canvasReady fired, gen=${t}, game.ready=${game.ready}`), await cb(), t !== Ti) return;
  console.log(`[${T}] Cinematic: game is ready`);
  const e = canvas.scene;
  if (!e) {
    console.log(`[${T}] Cinematic: no canvas.scene, exiting`);
    return;
  }
  if (Kn && Kn.sceneId === e.id) {
    const a = Kn;
    Kn = null, console.log(`[${T}] Cinematic: picking up pending transition to "${a.cinematicName}" on scene ${e.id}`);
    try {
      await pr(e.id, a.cinematicName, a.visitedChain);
    } catch (o) {
      console.error(`[${T}] Cinematic: error during pending transition playback on scene ${e.id}:`, o);
    }
    return;
  }
  Kn = null;
  const n = Yo(e.id);
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
    const o = em(e.id, a);
    if (t !== Ti) return;
    if (o) {
      console.log(`[${T}] Cinematic "${a}": found saved progress at segment "${o.currentSegment}", resuming...`);
      try {
        await pr(e.id, a);
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
    if (console.log(`[${T}] Cinematic: all canvasReady cinematics already seen on scene ${e.id}`), vb(e.id, i), (we == null ? void 0 : we.status) === "running" && we.cancel("already-seen"), we = null, await Vl(), t !== Ti) return;
    for (const { name: a, data: o } of i)
      try {
        const { targets: s } = Ka(o);
        no(o, s);
      } catch (s) {
        console.error(`[${T}] Cinematic "${a}": error applying landing states (already seen) on scene ${e.id}:`, s);
      }
    canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    return;
  }
  if (t === Ti && (console.log(`[${T}] Cinematic: playing first unseen cinematic "${r.name}"...`), await Vl(), t === Ti)) {
    for (const { name: a, data: o } of i) {
      if (a === r.name) continue;
      if (o.tracking !== !1 && vu(e.id, a))
        try {
          const { targets: l } = Ka(o);
          no(o, l);
        } catch (l) {
          console.error(`[${T}] Cinematic "${a}": error applying landing states (already seen) on scene ${e.id}:`, l);
        }
    }
    try {
      await pr(e.id, r.name);
    } catch (a) {
      console.error(`[${T}] Cinematic "${r.name}": error during playback on scene ${e.id}:`, a);
    }
  }
}
c(bb, "onCanvasReady$2");
function vb(t, e) {
  for (const { name: n } of e)
    Ul(t, n);
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
        new $l({ scene: canvas.scene }).render(!0);
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
      play: pr,
      reset: fb,
      resetForUser: mb,
      resetForAll: hb,
      getSeenStatus: gb,
      has: pb,
      get: to,
      list: lb,
      revert: yb,
      onPlaybackProgress: ab,
      TileAnimator: Ki,
      registerBehaviour: pe,
      getBehaviour: ql,
      trigger: /* @__PURE__ */ c(async (e, n, i = "default") => {
        var o;
        const r = n ?? ((o = canvas.scene) == null ? void 0 : o.id);
        if (!r) return;
        const a = to(r, i);
        a && (a.trigger && a.trigger !== e || await pr(r, i));
      }, "trigger")
    }, console.log(`[${T}] Cinematic API registered (v5).`);
  });
}
c(Sb, "registerCinematicHooks");
function Gl(t, e) {
  const n = Math.abs(t.width), i = Math.abs(t.height), r = n / 2, a = i / 2;
  let o = e.x - (t.x + r), s = e.y - (t.y + a);
  if (t.rotation !== 0) {
    const l = Math.toRadians(t.rotation), u = Math.cos(l), d = Math.sin(l), f = u * o + d * s, h = u * s - d * o;
    o = f, s = h;
  }
  return o += r, s += a, o >= 0 && o <= n && s >= 0 && s <= i;
}
c(Gl, "pointWithinTile");
zo("tile-click", (t, e) => t.target ? new Promise((n, i) => {
  var g;
  if (e.signal.aborted) return i(e.signal.reason ?? "aborted");
  const r = Ko(t.target);
  if (!((g = r == null ? void 0 : r.placeables) != null && g.length))
    return i(new Error(`await tile-click: no placeables found for "${t.target}"`));
  const a = r.placeables, o = [];
  for (const { placeable: p } of a) {
    const y = new Ki(p, t.animation);
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
      Gl(b.document, w) ? (v = !0, E.state !== "hover" && E.setState("hover")) : E.state === "hover" && E.setState("idle");
    v ? l === null && (l = document.body.style.cursor, document.body.style.cursor = "pointer") : l !== null && (document.body.style.cursor = l, l = null);
  }, "onPointerMove");
  s == null || s.addEventListener("pointermove", u);
  const d = /* @__PURE__ */ c((p) => {
    if (p.button !== 0) return;
    const y = canvas.activeLayer;
    if (!y) return;
    const w = y.toLocal(p);
    isNaN(w.x) || isNaN(w.y) || !a.filter(({ doc: b }) => Gl(b, w)).sort((b, E) => (E.doc.sort ?? 0) - (b.doc.sort ?? 0))[0] || (p.stopPropagation(), p.preventDefault(), h(), n());
  }, "onPointerDown");
  s == null || s.addEventListener("pointerdown", d, { capture: !0 });
  const f = /* @__PURE__ */ c(() => {
    h(), i(e.signal.reason ?? "aborted");
  }, "onAbort");
  e.signal.addEventListener("abort", f, { once: !0 });
  function h() {
    s == null || s.removeEventListener("pointerdown", d, { capture: !0 }), s == null || s.removeEventListener("pointermove", u), e.signal.removeEventListener("abort", f);
    for (const { animator: p } of o)
      p.detach();
    l !== null ? (document.body.style.cursor = l, l = null) : document.body.style.cursor = "";
  }
  c(h, "cleanup");
}) : Promise.reject(new Error('await tile-click: "target" is required')));
Sb();
function Cb() {
  Hooks.once("ready", () => {
    const t = game.modules.get(T);
    t.api || (t.api = {}), t.api.picker = {
      /** Open the picker window. Returns Promise<string[] | null>. */
      open: /* @__PURE__ */ c((e) => eo.open(e), "open"),
      /** Resolve a selector string to documents. */
      resolveSelector: Ko,
      /** Parse a selector string into { type, value }. */
      parseSelector: fc,
      /** Build a selector string from { type, value }. */
      buildSelector: oy,
      /** Build a tag selector from tags array + mode. */
      buildTagSelector: Ef,
      /** Canvas highlight utilities. */
      highlight: {
        add: Za,
        remove: Wi,
        has: _f,
        clearAll: Aa
      }
    }, console.log(`[${T}] Placeable Picker API registered.`);
  });
}
c(Cb, "registerPlaceablePickerHooks");
Cb();
const zl = "eidolon-utilities", Tb = "idle-animation", Ji = /* @__PURE__ */ new Map();
function Lb(t) {
  return typeof t.attribute == "string" && typeof t.from == "number" && typeof t.to == "number" && typeof t.period == "number" && t.period > 0;
}
c(Lb, "isValidTilePropConfig");
function Ib(t) {
  return typeof t.fromColor == "string" && typeof t.toColor == "string" && typeof t.period == "number" && t.period > 0;
}
c(Ib, "isValidTileTintConfig");
function Ob(t) {
  return typeof t.fromScale == "number" && typeof t.toScale == "number" && t.fromScale > 0 && t.toScale > 0 && typeof t.period == "number" && t.period > 0;
}
c(Ob, "isValidTileScaleConfig");
function wu(t) {
  if (!t || typeof t != "object") return !1;
  const e = t.type ?? "tile-prop";
  return e === "tile-tint" ? Ib(t) : e === "tile-scale" ? Ob(t) : Lb(t);
}
c(wu, "isValidConfig");
function gc(t) {
  var i;
  const e = (i = t == null ? void 0 : t.getFlag) == null ? void 0 : i.call(t, zl, Tb);
  if (!e) return [];
  let n;
  if (Array.isArray(e))
    n = e;
  else if (typeof e == "object" && "0" in e)
    n = Object.values(e);
  else return typeof e == "object" && wu(e) ? [e] : [];
  return n.filter(wu);
}
c(gc, "getIdleAnimationConfigs");
function Ab(t, e) {
  const n = e.type ?? "tile-prop";
  return n === "tile-tint" ? `${t}::tint` : n === "tile-scale" ? `${t}::scale` : `${t}::${e.attribute}`;
}
c(Ab, "loopKey");
function Eu(t, e, n, i) {
  return e.type === "tile-tint" ? { uuid: t, toColor: n ? e.toColor : e.fromColor, mode: e.mode } : e.type === "tile-scale" ? {
    uuid: t,
    toScale: n ? e.toScale : e.fromScale,
    ...i
  } : { uuid: t, attribute: e.attribute, value: n ? e.to : e.from };
}
c(Eu, "buildExecuteParams");
function kb(t, e) {
  var g, p;
  const n = t == null ? void 0 : t.document;
  if (!n) return;
  const i = n.id, r = Ab(i, e);
  pc(r);
  const a = e.type ?? "tile-prop", o = wi(a);
  if (!o) {
    console.warn(`[${zl}] idle-animation: unknown tween type "${a}"`);
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
      console.warn(`[${zl}] idle-animation: attribute "${e.attribute}" is not a number on tile ${i}`);
      return;
    }
    l = /* @__PURE__ */ c(() => {
      var v, b, E;
      const w = (b = (v = canvas.scene) == null ? void 0 : v.tiles) == null ? void 0 : b.get(i);
      w && (w.updateSource(foundry.utils.expandObject({ [e.attribute]: y })), (E = w.object) == null || E.refresh());
    }, "restore"), n.updateSource(foundry.utils.expandObject({ [e.attribute]: e.from })), t.refresh();
  }
  Ji.set(r, { controller: s, restore: l });
  const d = n.uuid, f = e.period / 2, h = e.easing ?? "easeInOutCosine";
  (async () => {
    const { signal: y } = s;
    for (; !y.aborted && !(await o.execute(
      Eu(d, e, !0, u),
      { durationMS: f, easing: h, commit: !1, signal: y }
    ) === !1 || y.aborted || await o.execute(
      Eu(d, e, !1, u),
      { durationMS: f, easing: h, commit: !1, signal: y }
    ) === !1 || y.aborted); )
      ;
  })();
}
c(kb, "startLoop");
function pc(t) {
  const e = Ji.get(t);
  e && (e.controller.abort(), Ji.delete(t), e.restore());
}
c(pc, "stopLoopByKey");
function Tr(t) {
  const e = `${t}::`;
  for (const n of [...Ji.keys()])
    n.startsWith(e) && pc(n);
}
c(Tr, "stopLoopsForTile");
function yc(t, e) {
  if (t != null && t.document) {
    Tr(t.document.id);
    for (const n of e)
      kb(t, n);
  }
}
c(yc, "startAllLoops");
function Mb() {
  for (const t of [...Ji.keys()])
    pc(t);
}
c(Mb, "stopAllLoops");
function Su(t) {
  const e = `${t}::`;
  for (const n of Ji.keys())
    if (n.startsWith(e)) return !0;
  return !1;
}
c(Su, "isLooping");
function Ct(t, e, n) {
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
c(Ct, "buildSelectGroup");
function Tt(t, e, n, i = {}) {
  const r = document.createElement("div");
  r.classList.add("form-group");
  const a = document.createElement("label");
  a.textContent = t;
  const o = document.createElement("input");
  o.type = "number", o.classList.add(e), o.value = String(n);
  for (const [s, l] of Object.entries(i)) o.setAttribute(s, l);
  return r.append(a, o), r;
}
c(Tt, "buildNumberGroup");
function Lr(t, e, n) {
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
c(Lr, "buildColorGroup");
const bs = "eidolon-utilities", vs = "idle-animation", Nb = "eidolon-idle-animation", _b = "fa-solid fa-wave-pulse", bc = [
  { value: "alpha", label: "Alpha (Opacity)", from: 0.85, to: 1, step: "0.01" },
  { value: "rotation", label: "Rotation", from: -5, to: 5, step: "1" },
  { value: "texture.rotation", label: "Texture Rotation", from: -5, to: 5, step: "1" }
], yr = {
  type: "tile-prop",
  attribute: "alpha",
  from: 0.85,
  to: 1,
  period: 1500,
  easing: "easeInOutCosine"
}, Jn = {
  fromColor: "#ffffff",
  toColor: "#ffcc88",
  mode: "oklch",
  period: 3e3
}, ws = {
  fromScale: 0.95,
  toScale: 1.05
};
function Cu(t, e) {
  const n = bc.find((r) => r.value === t);
  if (n && n.from !== null) return { from: n.from, to: n.to, step: n.step };
  const i = foundry.utils.getProperty((e == null ? void 0 : e._source) ?? {}, t);
  return typeof i == "number" && i > 0 ? { from: Math.round(i * 0.95), to: Math.round(i * 1.05), step: "1" } : { from: 0, to: 100, step: "1" };
}
c(Cu, "getAttributeDefaults");
function $b(t) {
  var e;
  return (t == null ? void 0 : t.document) ?? ((e = t == null ? void 0 : t.object) == null ? void 0 : e.document) ?? (t == null ? void 0 : t.object) ?? null;
}
c($b, "getTileDocument$1");
function Tu(t) {
  if (!t) return "";
  const e = t.type ?? "tile-prop";
  if (e === "tile-tint")
    return `Tint ${t.fromColor ?? "?"} → ${t.toColor ?? "?"} (${t.period ?? "?"}ms)`;
  if (e === "tile-scale") {
    const r = t.fromScale != null ? `${Math.round(t.fromScale * 100)}%` : "?", a = t.toScale != null ? `${Math.round(t.toScale * 100)}%` : "?";
    return `Scale ${r} → ${a} (${t.period ?? "?"}ms)`;
  }
  const n = bc.find((r) => r.value === t.attribute);
  return `${(n == null ? void 0 : n.label) ?? t.attribute ?? "?"} ${t.from ?? "?"} → ${t.to ?? "?"} (${t.period ?? "?"}ms)`;
}
c(Tu, "summarizeConfig");
function Lu(t, e, n) {
  const i = e.type ?? "tile-prop", r = Uo(), a = document.createElement("div");
  a.classList.add("idle-anim__slot", "is-collapsed"), a.dataset.index = String(n);
  const o = document.createElement("div");
  o.classList.add("idle-anim__slot-header");
  const s = document.createElement("i");
  s.classList.add("fa-solid", "fa-chevron-right", "idle-anim__slot-chevron");
  const l = document.createElement("span");
  l.classList.add("idle-anim__slot-title"), l.textContent = `Animation ${n + 1}`;
  const u = document.createElement("span");
  u.classList.add("idle-anim__slot-summary"), u.textContent = Tu(e);
  const d = document.createElement("button");
  d.type = "button", d.classList.add("idle-anim__slot-remove"), d.innerHTML = '<i class="fa-solid fa-xmark"></i>', d.title = "Remove animation", o.append(s, l, u, d), a.appendChild(o);
  const f = document.createElement("div");
  f.classList.add("idle-anim__slot-body");
  const h = Ct("Type", "idle-anim__type", [
    { value: "tile-prop", label: "Numeric", selected: i === "tile-prop" || i !== "tile-tint" && i !== "tile-scale" },
    { value: "tile-tint", label: "Tint", selected: i === "tile-tint" },
    { value: "tile-scale", label: "Scale", selected: i === "tile-scale" }
  ]);
  f.appendChild(h);
  const g = document.createElement("div");
  g.classList.add("idle-anim__type-fields"), f.appendChild(g);
  function p(b, E) {
    if (g.innerHTML = "", b === "tile-tint") {
      const L = Gi(), A = E.fromColor ?? Jn.fromColor, O = E.toColor ?? Jn.toColor, M = E.mode ?? Jn.mode, x = document.createElement("div");
      x.classList.add("idle-anim__range-row"), x.appendChild(Lr("From", "idle-anim__from-color", A)), x.appendChild(Lr("To", "idle-anim__to-color", O)), g.appendChild(x), g.appendChild(Ct(
        "Mode",
        "idle-anim__mode",
        L.map((R) => ({ value: R, label: R, selected: R === M }))
      ));
    } else if (b === "tile-scale") {
      const L = E.fromScale ?? ws.fromScale, A = E.toScale ?? ws.toScale, O = document.createElement("div");
      O.classList.add("idle-anim__range-row"), O.appendChild(Tt("From", "idle-anim__from-scale", L, { step: "0.01", min: "0.01" })), O.appendChild(Tt("To", "idle-anim__to-scale", A, { step: "0.01", min: "0.01" })), g.appendChild(O);
      const M = document.createElement("p");
      M.classList.add("idle-anim__hint"), M.textContent = "1.0 = original size. Scales from center.", g.appendChild(M);
    } else {
      const L = E.attribute ?? yr.attribute, A = Cu(L, t), O = E.from ?? A.from, M = E.to ?? A.to, x = A.step;
      g.appendChild(Ct(
        "Attribute",
        "idle-anim__attribute",
        bc.map((F) => ({ value: F.value, label: F.label, selected: F.value === L }))
      ));
      const R = document.createElement("div");
      R.classList.add("idle-anim__range-row"), R.appendChild(Tt("From", "idle-anim__from", O, { step: x })), R.appendChild(Tt("To", "idle-anim__to", M, { step: x })), g.appendChild(R);
      const D = g.querySelector(".idle-anim__attribute");
      D == null || D.addEventListener("change", () => {
        const F = Cu(D.value, t), _ = g.querySelector(".idle-anim__from"), H = g.querySelector(".idle-anim__to");
        _ && (_.value = String(F.from), _.step = F.step), H && (H.value = String(F.to), H.step = F.step);
      });
    }
  }
  c(p, "renderTypeFields"), p(i, e);
  const y = e.period ?? (i === "tile-tint" ? Jn.period : yr.period), w = e.easing ?? "easeInOutCosine";
  f.appendChild(Tt("Period (ms)", "idle-anim__period", y, { min: "100", step: "100" })), f.appendChild(Ct(
    "Easing",
    "idle-anim__easing",
    r.map((b) => ({ value: b, label: b, selected: b === w }))
  )), a.appendChild(f);
  const v = a.querySelector(".idle-anim__type");
  return v == null || v.addEventListener("change", () => {
    const b = v.value;
    p(b, b === "tile-tint" ? Jn : b === "tile-scale" ? ws : yr);
  }), o.addEventListener("click", (b) => {
    if (!b.target.closest(".idle-anim__slot-remove") && (a.classList.toggle("is-collapsed"), a.classList.contains("is-collapsed"))) {
      const E = nm(a);
      E && (u.textContent = Tu(E));
    }
  }), d.addEventListener("click", (b) => {
    b.stopPropagation();
    const E = a.parentElement;
    a.remove(), E && xb(E);
  }), a;
}
c(Lu, "buildSlot");
function xb(t) {
  t.querySelectorAll(".idle-anim__slot").forEach((n, i) => {
    n.dataset.index = String(i);
    const r = n.querySelector(".idle-anim__slot-title");
    r && (r.textContent = `Animation ${i + 1}`);
  });
}
c(xb, "renumberSlots$1");
function Fb(t) {
  const e = gc(t), n = document.createElement("section");
  n.classList.add("eidolon-idle-animation");
  const i = document.createElement("div");
  i.classList.add("idle-anim__slots");
  for (let l = 0; l < e.length; l++)
    i.appendChild(Lu(t, e[l], l));
  n.appendChild(i);
  const r = document.createElement("button");
  r.type = "button", r.classList.add("idle-anim__add"), r.innerHTML = '<i class="fa-solid fa-plus"></i> Add Animation', r.addEventListener("click", () => {
    const l = i.querySelectorAll(".idle-anim__slot").length, u = Lu(t, yr, l);
    u.classList.remove("is-collapsed"), i.appendChild(u);
  }), n.appendChild(r);
  const a = document.createElement("div");
  a.classList.add("idle-anim__actions");
  const o = document.createElement("button");
  o.type = "button", o.classList.add("idle-anim__preview"), o.innerHTML = '<i class="fa-solid fa-play"></i> Preview All';
  const s = document.createElement("button");
  return s.type = "button", s.classList.add("idle-anim__save"), s.innerHTML = '<i class="fa-solid fa-save"></i> Save', a.append(o, s), n.appendChild(a), n;
}
c(Fb, "buildTabContent");
function nm(t) {
  var l, u, d, f, h, g, p, y, w, v, b, E;
  const e = t.querySelector(".idle-anim__type"), n = (e == null ? void 0 : e.value) ?? "tile-prop", i = Number.parseInt((l = t.querySelector(".idle-anim__period")) == null ? void 0 : l.value, 10), r = ((u = t.querySelector(".idle-anim__easing")) == null ? void 0 : u.value) ?? "easeInOutCosine";
  if (!i || i <= 0) return null;
  if (n === "tile-tint") {
    const L = ((d = t.querySelector(".idle-anim__from-color")) == null ? void 0 : d.value) ?? ((f = t.querySelector(".idle-anim__from-color-text")) == null ? void 0 : f.value) ?? Jn.fromColor, A = ((h = t.querySelector(".idle-anim__to-color")) == null ? void 0 : h.value) ?? ((g = t.querySelector(".idle-anim__to-color-text")) == null ? void 0 : g.value) ?? Jn.toColor, O = ((p = t.querySelector(".idle-anim__mode")) == null ? void 0 : p.value) ?? "oklch";
    return { type: "tile-tint", fromColor: L, toColor: A, mode: O, period: i, easing: r };
  }
  if (n === "tile-scale") {
    const L = Number.parseFloat((y = t.querySelector(".idle-anim__from-scale")) == null ? void 0 : y.value), A = Number.parseFloat((w = t.querySelector(".idle-anim__to-scale")) == null ? void 0 : w.value);
    return Number.isNaN(L) || Number.isNaN(A) || L <= 0 || A <= 0 ? null : { type: "tile-scale", fromScale: L, toScale: A, period: i, easing: r };
  }
  const a = ((v = t.querySelector(".idle-anim__attribute")) == null ? void 0 : v.value) ?? yr.attribute, o = Number.parseFloat((b = t.querySelector(".idle-anim__from")) == null ? void 0 : b.value), s = Number.parseFloat((E = t.querySelector(".idle-anim__to")) == null ? void 0 : E.value);
  return Number.isNaN(o) || Number.isNaN(s) ? null : { type: "tile-prop", attribute: a, from: o, to: s, period: i, easing: r };
}
c(nm, "readSlotConfig");
function Iu(t) {
  const e = t.querySelectorAll(".idle-anim__slot"), n = [];
  for (const i of e) {
    const r = nm(i);
    r && n.push(r);
  }
  return n;
}
c(Iu, "readAllFormValues");
function Db(t, e) {
  var s;
  const n = kt(e);
  if (!n) return;
  const i = $b(t);
  if (!i) return;
  const r = sc(t, n, Nb, "Animations", _b);
  if (!r || r.querySelector(".eidolon-idle-animation")) return;
  r.appendChild(Fb(i)), (s = t.setPosition) == null || s.call(t, { height: "auto" });
  const a = r.querySelector(".idle-anim__preview");
  a == null || a.addEventListener("click", () => {
    const l = i.object;
    if (!l) return;
    if (Su(i.id)) {
      Tr(i.id), a.classList.remove("is-active"), a.innerHTML = '<i class="fa-solid fa-play"></i> Preview All';
      return;
    }
    const u = Iu(r);
    u.length !== 0 && (yc(l, u), a.classList.add("is-active"), a.innerHTML = '<i class="fa-solid fa-stop"></i> Stop');
  });
  const o = r.querySelector(".idle-anim__save");
  o == null || o.addEventListener("click", async () => {
    var u;
    Su(i.id) && (Tr(i.id), a && (a.classList.remove("is-active"), a.innerHTML = '<i class="fa-solid fa-play"></i> Preview All'));
    const l = Iu(r);
    l.length > 0 ? (await i.update({ [`flags.${bs}.-=${vs}`]: null }), await i.update({ [`flags.${bs}.${vs}`]: l })) : await i.update({ [`flags.${bs}.-=${vs}`]: null }), (u = ui.notifications) == null || u.info("Idle animations saved.");
  });
}
c(Db, "renderAnimationTab");
const Pb = "eidolon-utilities", Ou = "idle-animation";
function Rb() {
  var e;
  Mb();
  const t = (e = canvas.tiles) == null ? void 0 : e.placeables;
  if (Array.isArray(t))
    for (const n of t) {
      const i = gc(n.document);
      i.length > 0 && yc(n, i);
    }
}
c(Rb, "onCanvasReady$1");
function Hb(t, e) {
  var r;
  const n = (r = e == null ? void 0 : e.flags) == null ? void 0 : r[Pb];
  if (!n || !(Ou in n || `-=${Ou}` in n)) return;
  const i = gc(t);
  i.length > 0 && t.object ? yc(t.object, i) : Tr(t.id);
}
c(Hb, "onUpdateTile$1");
function qb(t) {
  Tr(t.id);
}
c(qb, "onDeleteTile$1");
function jb(t, e) {
  Db(t, e);
}
c(jb, "onRenderTileConfig$1");
function Bb() {
  Hooks.on("canvasReady", Rb), Hooks.on("updateTile", Hb), Hooks.on("deleteTile", qb), Hooks.on("renderTileConfig", jb);
}
c(Bb, "registerIdleAnimationHooks");
Bb();
const im = "eidolon-utilities", Ub = "tile-interactions", on = /* @__PURE__ */ new Map(), vi = /* @__PURE__ */ new Map(), Au = /* @__PURE__ */ new WeakMap(), br = /* @__PURE__ */ new Set();
let _n = null, Lt = null, It = null, jt = null;
function rm(t) {
  if (!t) return null;
  if (!Array.isArray(t) && typeof t == "object") {
    const e = Array.isArray(t.idle) && t.idle.length ? t.idle : null, n = Array.isArray(t.enter) && t.enter.length ? t.enter : null;
    return !e && !n ? null : { idle: e, enter: n };
  }
  return Array.isArray(t) && t.length ? { idle: null, enter: t } : null;
}
c(rm, "parseHoverConfig");
function am(t) {
  var e;
  return ((e = t == null ? void 0 : t.getFlag) == null ? void 0 : e.call(t, im, Ub)) ?? null;
}
c(am, "getInteractionFlag");
function om(t) {
  const e = canvas.activeLayer;
  if (!e) return null;
  const n = e.toLocal(t);
  return !n || Number.isNaN(n.x) || Number.isNaN(n.y) ? null : n;
}
c(om, "canvasToLocal");
function sm(t) {
  let e = null, n = -1 / 0;
  for (const [i, r] of on)
    if (Gl(r.doc, t)) {
      const a = r.doc.sort ?? 0;
      a > n && (e = r, n = a);
    }
  return e;
}
c(sm, "hitTest");
function Vb(t) {
  return {
    idle: t.idle ?? ["none"],
    hover: t.enter ?? ["none"]
  };
}
c(Vb, "buildAnimatorConfig");
function vc(t, e, n) {
  Yr(t);
  const i = Vb(n), r = new Ki(e, i);
  r.start("idle"), vi.set(t, r);
}
c(vc, "startHoverAnimator");
function Yr(t) {
  const e = vi.get(t);
  e && (e.detach(), vi.delete(t));
}
c(Yr, "stopHoverAnimator");
function Es(t, e, n, i) {
  return e.type === "tile-tint" ? { uuid: t, toColor: n ? e.toColor : e.fromColor, mode: e.mode } : e.type === "tile-scale" ? {
    uuid: t,
    toScale: n ? e.toScale : e.fromScale,
    ...i
  } : { uuid: t, attribute: e.attribute, value: n ? e.to : e.from };
}
c(Es, "buildClickParams");
function Gb(t) {
  const e = t._source.width, n = t._source.height, i = t._source.x, r = t._source.y;
  return {
    baseWidth: e,
    baseHeight: n,
    centerX: i + e / 2,
    centerY: r + n / 2
  };
}
c(Gb, "captureRefGeometry");
async function zb(t, e) {
  const n = t.uuid, i = e.type ?? "tile-prop", r = wi(i);
  if (!r) {
    console.warn(`[${im}] tile-interactions: unknown tween type "${i}"`);
    return;
  }
  const a = e.period ?? 300, o = e.easing ?? "easeOutCubic", s = e.mode ?? "bounce", l = i === "tile-scale" ? Gb(t) : null;
  if (s === "toggle") {
    const d = !(Au.get(t) ?? !1);
    await r.execute(
      Es(n, e, d, l),
      { durationMS: a, easing: o, commit: !0 }
    ), Au.set(t, d);
  } else {
    const u = a / 2;
    await r.execute(
      Es(n, e, !0, l),
      { durationMS: u, easing: o, commit: !1 }
    ), await r.execute(
      Es(n, e, !1, l),
      { durationMS: u, easing: o, commit: !1 }
    );
  }
}
c(zb, "playClickAnimation");
async function Wb(t) {
  var n;
  const e = t.doc.id;
  if (!br.has(e)) {
    br.add(e);
    try {
      Yr(e);
      const i = t.clickConfig.map((r) => zb(t.doc, r));
      await Promise.all(i);
    } finally {
      br.delete(e), t.hoverConfig && (vc(e, t.placeable, t.hoverConfig), _n === e && ((n = vi.get(e)) == null || n.setState("hover")));
    }
  }
}
c(Wb, "handleClick");
function lm(t) {
  var r;
  const e = om(t);
  if (!e) return;
  const n = sm(e), i = (n == null ? void 0 : n.doc.id) ?? null;
  if (i !== _n) {
    if (_n) {
      const a = vi.get(_n);
      a && a.setState("idle");
    }
    if (i) {
      const a = vi.get(i);
      a && a.setState("hover");
    }
    _n = i, i && (n.hoverConfig || (r = n.clickConfig) != null && r.length) ? (Lt === null && (Lt = document.body.style.cursor), document.body.style.cursor = "pointer") : Lt !== null && (document.body.style.cursor = Lt, Lt = null);
  }
}
c(lm, "onPointerMove");
function cm(t) {
  var i;
  if (t.button !== 0) return;
  const e = om(t);
  if (!e) return;
  const n = sm(e);
  !n || !((i = n.clickConfig) != null && i.length) || Wb(n);
}
c(cm, "onPointerDown");
function Kb() {
  var n;
  for (const i of vi.keys())
    Yr(i);
  on.clear(), br.clear(), _n = null, Lt !== null && (document.body.style.cursor = Lt, Lt = null);
  const t = document.getElementById("board");
  It && (t == null || t.removeEventListener("pointermove", It), It = null), jt && (t == null || t.removeEventListener("pointerdown", jt), jt = null);
  const e = (n = canvas.tiles) == null ? void 0 : n.placeables;
  if (Array.isArray(e)) {
    for (const i of e) {
      const r = i.document, a = am(r);
      if (!a) continue;
      const o = rm(a.hover), s = Array.isArray(a.click) && a.click.length ? a.click : null;
      !o && !s || (on.set(r.id, { doc: r, placeable: i, hoverConfig: o, clickConfig: s }), o && vc(r.id, i, o));
    }
    on.size !== 0 && (It = lm, jt = cm, t == null || t.addEventListener("pointermove", It), t == null || t.addEventListener("pointerdown", jt));
  }
}
c(Kb, "rebuild");
function Jb(t) {
  const e = t.id, n = am(t), i = n ? rm(n.hover) : null, r = n && Array.isArray(n.click) && n.click.length ? n.click : null;
  if (!i && !r) {
    um(t);
    return;
  }
  Yr(e);
  const a = t.object;
  if (!a) {
    on.delete(e);
    return;
  }
  on.set(e, { doc: t, placeable: a, hoverConfig: i, clickConfig: r }), i && vc(e, a, i), Yb();
}
c(Jb, "updateTile");
function um(t) {
  const e = t.id;
  if (Yr(e), on.delete(e), br.delete(e), _n === e && (_n = null, Lt !== null && (document.body.style.cursor = Lt, Lt = null)), on.size === 0) {
    const n = document.getElementById("board");
    It && (n == null || n.removeEventListener("pointermove", It), It = null), jt && (n == null || n.removeEventListener("pointerdown", jt), jt = null);
  }
}
c(um, "removeTile");
function Yb() {
  if (on.size === 0 || It) return;
  const t = document.getElementById("board");
  t && (It = lm, jt = cm, t.addEventListener("pointermove", It), t.addEventListener("pointerdown", jt));
}
c(Yb, "ensureListeners");
const Wl = "eidolon-utilities", Kl = "tile-interactions", Xb = "eidolon-idle-animation", Qb = "fa-solid fa-wave-pulse", dm = [
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
], fm = {
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
}, Oi = {
  attribute: "alpha",
  from: 1,
  to: 0.5,
  period: 300,
  mode: "bounce"
}, _i = {
  fromColor: "#ffffff",
  toColor: "#ffaa00",
  period: 500,
  mode: "bounce"
}, ka = {
  type: "tile-scale",
  fromScale: 1,
  toScale: 1.2,
  period: 300,
  easing: "easeOutCubic",
  mode: "bounce"
}, mm = [
  { value: "alpha", label: "Alpha (Opacity)" },
  { value: "rotation", label: "Rotation" },
  { value: "texture.rotation", label: "Texture Rotation" }
];
function Zb(t) {
  var e;
  return (t == null ? void 0 : t.document) ?? ((e = t == null ? void 0 : t.object) == null ? void 0 : e.document) ?? (t == null ? void 0 : t.object) ?? null;
}
c(Zb, "getTileDocument");
function ev(t) {
  var r;
  const e = (r = t == null ? void 0 : t.getFlag) == null ? void 0 : r.call(t, Wl, Kl);
  if (!e) return { hoverIdle: [], hoverEnter: [], click: [] };
  let n = [], i = [];
  return e.hover && (Array.isArray(e.hover) ? i = e.hover : typeof e.hover == "object" && (n = Array.isArray(e.hover.idle) ? e.hover.idle : [], i = Array.isArray(e.hover.enter) ? e.hover.enter : [])), {
    hoverIdle: n,
    hoverEnter: i,
    click: Array.isArray(e.click) ? e.click : []
  };
}
c(ev, "getInteractionConfigs");
function ku(t) {
  if (!t) return "";
  const e = t.name ?? "float", n = dm.find((i) => i.value === e);
  return (n == null ? void 0 : n.label) ?? e;
}
c(ku, "summarizeHoverConfig");
function da(t, e, n, i) {
  const r = t.name ?? "float", a = Uo(), o = document.createElement("div");
  o.classList.add("idle-anim__slot", "is-collapsed", n), o.dataset.index = String(e);
  const s = document.createElement("div");
  s.classList.add("idle-anim__slot-header");
  const l = document.createElement("i");
  l.classList.add("fa-solid", "fa-chevron-right", "idle-anim__slot-chevron");
  const u = document.createElement("span");
  u.classList.add("idle-anim__slot-title"), u.textContent = `${i} ${e + 1}`;
  const d = document.createElement("span");
  d.classList.add("idle-anim__slot-summary"), d.textContent = ku(t);
  const f = document.createElement("button");
  f.type = "button", f.classList.add("idle-anim__slot-remove"), f.innerHTML = '<i class="fa-solid fa-xmark"></i>', f.title = "Remove effect", s.append(l, u, d, f), o.appendChild(s);
  const h = document.createElement("div");
  h.classList.add("idle-anim__slot-body");
  const g = Ct(
    "Behaviour",
    "ti-hover__behaviour",
    dm.map((v) => ({ value: v.value, label: v.label, selected: v.value === r }))
  );
  h.appendChild(g);
  const p = document.createElement("div");
  p.classList.add("idle-anim__type-fields"), h.appendChild(p);
  function y(v, b) {
    p.innerHTML = "";
    const E = fm[v];
    if (E)
      for (const L of E) {
        const A = b[L.key] ?? L.default;
        L.type === "color" ? p.appendChild(Lr(L.label, `ti-hover__${L.key}`, A)) : L.type === "select" && L.key === "easing" ? p.appendChild(Ct(
          L.label,
          `ti-hover__${L.key}`,
          a.map((O) => ({ value: O, label: O, selected: O === A }))
        )) : p.appendChild(Tt(L.label, `ti-hover__${L.key}`, A, L.attrs ?? {}));
      }
  }
  c(y, "renderParams"), y(r, t), o.appendChild(h);
  const w = o.querySelector(".ti-hover__behaviour");
  return w == null || w.addEventListener("change", () => {
    y(w.value, {});
  }), s.addEventListener("click", (v) => {
    if (!v.target.closest(".idle-anim__slot-remove") && (o.classList.toggle("is-collapsed"), o.classList.contains("is-collapsed"))) {
      const b = hm(o);
      b && (d.textContent = ku(b));
    }
  }), f.addEventListener("click", (v) => {
    v.stopPropagation();
    const b = o.parentElement;
    o.remove(), b && pm(b, n, i);
  }), o;
}
c(da, "buildHoverSlot");
function hm(t) {
  var r;
  const e = ((r = t.querySelector(".ti-hover__behaviour")) == null ? void 0 : r.value) ?? "float", n = fm[e], i = { name: e };
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
c(hm, "readHoverSlot");
function Mu(t) {
  if (!t) return "";
  const e = t.type ?? "tile-prop", n = t.mode ?? "bounce", i = n.charAt(0).toUpperCase() + n.slice(1);
  if (e === "tile-tint")
    return `${i} Tint ${t.fromColor ?? "?"} → ${t.toColor ?? "?"} (${t.period ?? "?"}ms)`;
  if (e === "tile-scale") {
    const o = t.fromScale != null ? `${Math.round(t.fromScale * 100)}%` : "?", s = t.toScale != null ? `${Math.round(t.toScale * 100)}%` : "?";
    return `${i} Scale ${o} → ${s} (${t.period ?? "?"}ms)`;
  }
  const r = mm.find((o) => o.value === t.attribute), a = (r == null ? void 0 : r.label) ?? t.attribute ?? "?";
  return `${i} ${a} ${t.from ?? "?"} → ${t.to ?? "?"} (${t.period ?? "?"}ms)`;
}
c(Mu, "summarizeClickConfig");
function Nu(t, e) {
  const n = t.type ?? "tile-prop", i = t.mode ?? "bounce", r = Uo(), a = document.createElement("div");
  a.classList.add("idle-anim__slot", "is-collapsed", "ti-click-slot"), a.dataset.index = String(e);
  const o = document.createElement("div");
  o.classList.add("idle-anim__slot-header");
  const s = document.createElement("i");
  s.classList.add("fa-solid", "fa-chevron-right", "idle-anim__slot-chevron");
  const l = document.createElement("span");
  l.classList.add("idle-anim__slot-title"), l.textContent = `Animation ${e + 1}`;
  const u = document.createElement("span");
  u.classList.add("idle-anim__slot-summary"), u.textContent = Mu(t);
  const d = document.createElement("button");
  d.type = "button", d.classList.add("idle-anim__slot-remove"), d.innerHTML = '<i class="fa-solid fa-xmark"></i>', d.title = "Remove animation", o.append(s, l, u, d), a.appendChild(o);
  const f = document.createElement("div");
  f.classList.add("idle-anim__slot-body");
  const h = document.createElement("div");
  h.classList.add("idle-anim__range-row"), h.appendChild(Ct("Mode", "ti-click__mode", [
    { value: "bounce", label: "Bounce", selected: i === "bounce" },
    { value: "toggle", label: "Toggle", selected: i === "toggle" }
  ])), h.appendChild(Ct("Type", "ti-click__type", [
    { value: "tile-prop", label: "Numeric", selected: n === "tile-prop" },
    { value: "tile-tint", label: "Tint", selected: n === "tile-tint" },
    { value: "tile-scale", label: "Scale", selected: n === "tile-scale" }
  ])), f.appendChild(h);
  const g = document.createElement("div");
  g.classList.add("idle-anim__type-fields"), f.appendChild(g);
  function p(b, E) {
    if (g.innerHTML = "", b === "tile-tint") {
      const L = Gi(), A = E.fromColor ?? _i.fromColor, O = E.toColor ?? _i.toColor, M = E.mode ?? "oklch", x = document.createElement("div");
      x.classList.add("idle-anim__range-row"), x.appendChild(Lr("From", "ti-click__from-color", A)), x.appendChild(Lr("To", "ti-click__to-color", O)), g.appendChild(x), g.appendChild(Ct(
        "Interpolation",
        "ti-click__color-mode",
        L.map((R) => ({ value: R, label: R, selected: R === M }))
      ));
    } else if (b === "tile-scale") {
      const L = E.fromScale ?? ka.fromScale, A = E.toScale ?? ka.toScale, O = document.createElement("div");
      O.classList.add("idle-anim__range-row"), O.appendChild(Tt("From", "ti-click__from-scale", L, { step: "0.01", min: "0.01" })), O.appendChild(Tt("To", "ti-click__to-scale", A, { step: "0.01", min: "0.01" })), g.appendChild(O);
      const M = document.createElement("p");
      M.classList.add("idle-anim__hint"), M.textContent = "1.0 = original size. Scales from center.", g.appendChild(M);
    } else {
      const L = E.attribute ?? Oi.attribute, A = E.from ?? Oi.from, O = E.to ?? Oi.to;
      g.appendChild(Ct(
        "Attribute",
        "ti-click__attribute",
        mm.map((x) => ({ value: x.value, label: x.label, selected: x.value === L }))
      ));
      const M = document.createElement("div");
      M.classList.add("idle-anim__range-row"), M.appendChild(Tt("From", "ti-click__from", A, { step: "0.01" })), M.appendChild(Tt("To", "ti-click__to", O, { step: "0.01" })), g.appendChild(M);
    }
  }
  c(p, "renderTypeFields"), p(n, t);
  const y = t.period ?? (n === "tile-tint" ? _i.period : Oi.period), w = t.easing ?? "easeOutCubic";
  f.appendChild(Tt("Period (ms)", "ti-click__period", y, { min: "50", step: "50" })), f.appendChild(Ct(
    "Easing",
    "ti-click__easing",
    r.map((b) => ({ value: b, label: b, selected: b === w }))
  )), a.appendChild(f);
  const v = a.querySelector(".ti-click__type");
  return v == null || v.addEventListener("change", () => {
    const b = v.value;
    p(b, b === "tile-tint" ? _i : b === "tile-scale" ? ka : Oi);
  }), o.addEventListener("click", (b) => {
    if (!b.target.closest(".idle-anim__slot-remove") && (a.classList.toggle("is-collapsed"), a.classList.contains("is-collapsed"))) {
      const E = gm(a);
      E && (u.textContent = Mu(E));
    }
  }), d.addEventListener("click", (b) => {
    b.stopPropagation();
    const E = a.parentElement;
    a.remove(), E && pm(E, "ti-click-slot", "Animation");
  }), a;
}
c(Nu, "buildClickSlot");
function gm(t) {
  var u, d, f, h, g, p, y, w, v, b, E, L, A, O;
  const e = ((u = t.querySelector(".ti-click__type")) == null ? void 0 : u.value) ?? "tile-prop", n = ((d = t.querySelector(".ti-click__mode")) == null ? void 0 : d.value) ?? "bounce", i = Number.parseInt((f = t.querySelector(".ti-click__period")) == null ? void 0 : f.value, 10), r = ((h = t.querySelector(".ti-click__easing")) == null ? void 0 : h.value) ?? "easeOutCubic";
  if (!i || i <= 0) return null;
  const a = { mode: n, period: i, easing: r };
  if (e === "tile-tint") {
    const M = ((g = t.querySelector(".ti-click__from-color")) == null ? void 0 : g.value) ?? ((p = t.querySelector(".ti-click__from-color-text")) == null ? void 0 : p.value) ?? _i.fromColor, x = ((y = t.querySelector(".ti-click__to-color")) == null ? void 0 : y.value) ?? ((w = t.querySelector(".ti-click__to-color-text")) == null ? void 0 : w.value) ?? _i.toColor, R = ((v = t.querySelector(".ti-click__color-mode")) == null ? void 0 : v.value) ?? "oklch";
    return { type: "tile-tint", fromColor: M, toColor: x, mode: R, ...a };
  }
  if (e === "tile-scale") {
    const M = Number.parseFloat((b = t.querySelector(".ti-click__from-scale")) == null ? void 0 : b.value), x = Number.parseFloat((E = t.querySelector(".ti-click__to-scale")) == null ? void 0 : E.value);
    return Number.isNaN(M) || Number.isNaN(x) || M <= 0 || x <= 0 ? null : { type: "tile-scale", fromScale: M, toScale: x, ...a };
  }
  const o = ((L = t.querySelector(".ti-click__attribute")) == null ? void 0 : L.value) ?? Oi.attribute, s = Number.parseFloat((A = t.querySelector(".ti-click__from")) == null ? void 0 : A.value), l = Number.parseFloat((O = t.querySelector(".ti-click__to")) == null ? void 0 : O.value);
  return Number.isNaN(s) || Number.isNaN(l) ? null : { type: "tile-prop", attribute: o, from: s, to: l, ...a };
}
c(gm, "readClickSlot");
function pm(t, e, n) {
  t.querySelectorAll(`.${e}`).forEach((r, a) => {
    r.dataset.index = String(a);
    const o = r.querySelector(".idle-anim__slot-title");
    o && (o.textContent = `${n} ${a + 1}`);
  });
}
c(pm, "renumberSlots");
function tv(t) {
  const { hoverIdle: e, hoverEnter: n, click: i } = ev(t), r = document.createElement("section");
  r.classList.add("eidolon-tile-interactions");
  const a = document.createElement("h3");
  a.classList.add("ti-section-heading"), a.textContent = "Hover — Idle", r.appendChild(a);
  const o = document.createElement("p");
  o.classList.add("idle-anim__hint"), o.textContent = "Plays continuously. Stops when pointer enters the tile.", r.appendChild(o);
  const s = document.createElement("div");
  s.classList.add("idle-anim__slots", "ti-hover-idle-slots");
  for (let b = 0; b < e.length; b++)
    s.appendChild(da(e[b], b, "ti-hover-idle-slot", "Effect"));
  r.appendChild(s);
  const l = document.createElement("button");
  l.type = "button", l.classList.add("idle-anim__add"), l.innerHTML = '<i class="fa-solid fa-plus"></i> Add Idle Effect', l.addEventListener("click", () => {
    const b = s.querySelectorAll(".ti-hover-idle-slot").length, E = da({ name: "float" }, b, "ti-hover-idle-slot", "Effect");
    E.classList.remove("is-collapsed"), s.appendChild(E);
  }), r.appendChild(l);
  const u = document.createElement("h3");
  u.classList.add("ti-section-heading"), u.textContent = "Hover — On Enter", r.appendChild(u);
  const d = document.createElement("p");
  d.classList.add("idle-anim__hint"), d.textContent = "Plays while pointer is over the tile. Stops when pointer leaves.", r.appendChild(d);
  const f = document.createElement("div");
  f.classList.add("idle-anim__slots", "ti-hover-enter-slots");
  for (let b = 0; b < n.length; b++)
    f.appendChild(da(n[b], b, "ti-hover-enter-slot", "Effect"));
  r.appendChild(f);
  const h = document.createElement("button");
  h.type = "button", h.classList.add("idle-anim__add"), h.innerHTML = '<i class="fa-solid fa-plus"></i> Add Hover Effect', h.addEventListener("click", () => {
    const b = f.querySelectorAll(".ti-hover-enter-slot").length, E = da({ name: "scale" }, b, "ti-hover-enter-slot", "Effect");
    E.classList.remove("is-collapsed"), f.appendChild(E);
  }), r.appendChild(h);
  const g = document.createElement("h3");
  g.classList.add("ti-section-heading"), g.textContent = "Click Animations", r.appendChild(g);
  const p = document.createElement("div");
  p.classList.add("idle-anim__slots", "ti-click-slots");
  for (let b = 0; b < i.length; b++)
    p.appendChild(Nu(i[b], b));
  r.appendChild(p);
  const y = document.createElement("button");
  y.type = "button", y.classList.add("idle-anim__add"), y.innerHTML = '<i class="fa-solid fa-plus"></i> Add Animation', y.addEventListener("click", () => {
    const b = p.querySelectorAll(".ti-click-slot").length, E = Nu(ka, b);
    E.classList.remove("is-collapsed"), p.appendChild(E);
  }), r.appendChild(y);
  const w = document.createElement("div");
  w.classList.add("idle-anim__actions");
  const v = document.createElement("button");
  return v.type = "button", v.classList.add("idle-anim__save"), v.innerHTML = '<i class="fa-solid fa-save"></i> Save Interactions', w.appendChild(v), r.appendChild(w), r;
}
c(tv, "buildSectionContent");
function _u(t, e) {
  const n = [];
  for (const i of t.querySelectorAll(`.${e}`)) {
    const r = hm(i);
    r && n.push(r);
  }
  return n;
}
c(_u, "readAllHoverSlots");
function nv(t) {
  const e = [];
  for (const n of t.querySelectorAll(".ti-click-slot")) {
    const i = gm(n);
    i && e.push(i);
  }
  return e;
}
c(nv, "readAllClickConfigs");
function iv(t, e) {
  var l;
  const n = kt(e);
  if (!n) return;
  const i = Zb(t);
  if (!i) return;
  const r = sc(t, n, Xb, "Animations", Qb);
  if (!r || r.querySelector(".eidolon-tile-interactions")) return;
  const a = document.createElement("hr");
  a.classList.add("ti-divider"), r.appendChild(a);
  const o = tv(i);
  r.appendChild(o), (l = t.setPosition) == null || l.call(t, { height: "auto" });
  const s = o.querySelector(".idle-anim__save");
  s == null || s.addEventListener("click", async () => {
    var p;
    const u = _u(o, "ti-hover-idle-slot"), d = _u(o, "ti-hover-enter-slot"), f = nv(o), h = u.length > 0 || d.length > 0, g = h || f.length > 0;
    if (await i.update({ [`flags.${Wl}.-=${Kl}`]: null }), g) {
      const y = {};
      h && (y.hover = {}, u.length > 0 && (y.hover.idle = u), d.length > 0 && (y.hover.enter = d)), f.length > 0 && (y.click = f), await i.update({ [`flags.${Wl}.${Kl}`]: y });
    }
    (p = ui.notifications) == null || p.info("Tile interactions saved.");
  });
}
c(iv, "renderInteractionSection");
const rv = "eidolon-utilities", $u = "tile-interactions";
function av() {
  Kb();
}
c(av, "onCanvasReady");
function ov(t, e) {
  var i;
  const n = (i = e == null ? void 0 : e.flags) == null ? void 0 : i[rv];
  !n || !($u in n || `-=${$u}` in n) || Jb(t);
}
c(ov, "onUpdateTile");
function sv(t) {
  um(t);
}
c(sv, "onDeleteTile");
function lv(t, e) {
  iv(t, e);
}
c(lv, "onRenderTileConfig");
function cv() {
  Hooks.on("canvasReady", av), Hooks.on("updateTile", ov), Hooks.on("deleteTile", sv), Hooks.on("renderTileConfig", lv);
}
c(cv, "registerTileInteractionHooks");
cv();
//# sourceMappingURL=eidolon-utilities.js.map
