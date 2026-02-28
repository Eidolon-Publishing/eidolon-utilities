var Ac = Object.defineProperty;
var hm = Object.getPrototypeOf;
var gm = Reflect.get;
var kc = (t) => {
  throw TypeError(t);
};
var pm = (t, e, n) => e in t ? Ac(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var c = (t, e) => Ac(t, "name", { value: e, configurable: !0 });
var ye = (t, e, n) => pm(t, typeof e != "symbol" ? e + "" : e, n), rs = (t, e, n) => e.has(t) || kc("Cannot " + n);
var m = (t, e, n) => (rs(t, e, "read from private field"), n ? n.call(t) : e.get(t)), k = (t, e, n) => e.has(t) ? kc("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, n), I = (t, e, n, i) => (rs(t, e, "write to private field"), i ? i.call(t, n) : e.set(t, n), n), S = (t, e, n) => (rs(t, e, "access private method"), n);
var as = (t, e, n, i) => ({
  set _(r) {
    I(t, e, r, n);
  },
  get _() {
    return m(t, e, i);
  }
}), Re = (t, e, n) => gm(hm(t), n, e);
const T = "eidolon-utilities", _a = "timeTriggerActive", As = "timeTriggerHideWindow", ks = "timeTriggerShowPlayerWindow", Ms = "timeTriggerAllowRealTime", _u = "timeTriggers", ma = "timeTriggerHistory", Ns = "debug", $s = "timeFormat", xs = "manageTime", _s = "secondsPerRound";
const ym = [-30, -15, -5, 5, 15, 30], Ri = 1440 * 60, ha = "playSound", Wr = 6;
function E(t, e) {
  var n, i;
  return (i = (n = game.i18n) == null ? void 0 : n.has) != null && i.call(n, t) ? game.i18n.localize(t) : e;
}
c(E, "localize");
function Nt(t) {
  return typeof t != "string" ? "" : t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
c(Nt, "escapeHtml");
function Gt(t) {
  var e;
  return t == null ? t : (e = foundry == null ? void 0 : foundry.utils) != null && e.duplicate ? foundry.utils.duplicate(t) : JSON.parse(JSON.stringify(t));
}
c(Gt, "duplicateData");
function bm() {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
c(bm, "generateTriggerId");
function Fu(t) {
  if (typeof t != "string") return null;
  const e = t.trim();
  if (!e) return null;
  const n = e.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (!n) return null;
  const i = Number(n[1]), r = Number(n[2]), a = n[3] !== void 0 ? Number(n[3]) : 0;
  return !Number.isInteger(i) || !Number.isInteger(r) || !Number.isInteger(a) || i < 0 || i > 23 || r < 0 || r > 59 || a < 0 || a > 59 ? null : i * 3600 + r * 60 + a;
}
c(Fu, "parseTriggerTimeToSeconds");
function lr() {
  var t, e;
  return ((t = game.scenes) == null ? void 0 : t.current) ?? ((e = game.scenes) == null ? void 0 : e.active) ?? null;
}
c(lr, "getActiveScene");
function Wt(t) {
  return (t == null ? void 0 : t.object) ?? (t == null ? void 0 : t.document) ?? null;
}
c(Wt, "getSceneFromApplication");
function Ye(t) {
  return t && typeof t.getFlag == "function" && typeof t.setFlag == "function";
}
c(Ye, "hasSceneDocument");
const Fs = /* @__PURE__ */ new Set(), Ds = /* @__PURE__ */ new Set(), Ps = /* @__PURE__ */ new Set(), Rs = /* @__PURE__ */ new Set();
let yi = !1, Cr = !1, Fa = Wr, Da = "12h", Mc = !1;
function os(t) {
  yi = !!t;
  for (const e of Fs)
    try {
      e(yi);
    } catch (n) {
      console.error(`${T} | Debug change handler failed`, n);
    }
}
c(os, "notifyDebugChange");
function ss(t) {
  Cr = !!t;
  for (const e of Ds)
    try {
      e(Cr);
    } catch (n) {
      console.error(`${T} | Manage time change handler failed`, n);
    }
}
c(ss, "notifyManageTimeChange");
function Du(t) {
  return t === "24h" ? "24h" : "12h";
}
c(Du, "normalizeTimeFormatValue");
function Xl(t) {
  const e = Number(t);
  return !Number.isFinite(e) || e <= 0 ? Wr : e;
}
c(Xl, "normalizeSecondsPerRoundValue");
function ls(t) {
  const e = Xl(t);
  Fa = e;
  for (const n of Ps)
    try {
      n(e);
    } catch (i) {
      console.error(`${T} | Seconds-per-round change handler failed`, i);
    }
}
c(ls, "notifySecondsPerRoundChange");
function cs(t) {
  const e = Du(t);
  Da = e;
  for (const n of Rs)
    try {
      n(e);
    } catch (i) {
      console.error(`${T} | Time format change handler failed`, i);
    }
}
c(cs, "notifyTimeFormatChange");
function vm() {
  var e;
  if (Mc) return;
  if (Mc = !0, !((e = game == null ? void 0 : game.settings) != null && e.register)) {
    console.warn(
      `${T} | game.settings.register is unavailable. Module settings could not be registered.`
    );
    return;
  }
  const t = typeof game.settings.registerChange == "function";
  game.settings.register(T, Ns, {
    name: E("EIDOLON.TimeTrigger.DebugSettingName", "Enable debug logging"),
    hint: E(
      "EIDOLON.TimeTrigger.DebugSettingHint",
      "Write detailed time-trigger diagnostics to the browser console."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: t ? void 0 : os
  }), t && game.settings.registerChange(T, Ns, os), yi = Ql(), os(yi), game.settings.register(T, xs, {
    name: E("EIDOLON.TimeTrigger.ManageTimeSettingName", "Manage Game Time"),
    hint: E(
      "EIDOLON.TimeTrigger.ManageTimeSettingHint",
      "Allow Eidolon Utilities to advance world time automatically while the game is unpaused. Warning: This may conflict with other time-management modules."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: t ? void 0 : ss
  }), t && game.settings.registerChange(T, xs, ss), Cr = Em(), ss(Cr), game.settings.register(T, _s, {
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
    default: Wr,
    range: { min: 1, max: 3600, step: 1 },
    onChange: t ? void 0 : ls
  }), t && game.settings.registerChange(
    T,
    _s,
    ls
  ), Fa = Xl(Sm()), ls(Fa), game.settings.register(T, $s, {
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
    onChange: t ? void 0 : cs
  }), t && game.settings.registerChange(T, $s, cs), Da = Du(Pu()), cs(Da);
}
c(vm, "registerTimeTriggerSettings");
function Ql() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return !!game.settings.get(T, Ns);
  } catch (e) {
    console.error(`${T} | Failed to read debug setting`, e);
  }
  return !1;
}
c(Ql, "getDebugSetting");
function wm() {
  return yi = Ql(), yi;
}
c(wm, "refreshDebugSettingCache");
function Em() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return !!game.settings.get(T, xs);
  } catch (e) {
    console.error(`${T} | Failed to read manage time setting`, e);
  }
  return !1;
}
c(Em, "getManageTimeSetting");
function Pu() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return game.settings.get(T, $s) === "24h" ? "24h" : "12h";
  } catch (e) {
    console.error(`${T} | Failed to read time format setting`, e);
  }
  return "12h";
}
c(Pu, "getTimeFormatSetting");
function Sm() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get) {
      const e = game.settings.get(T, _s);
      return Xl(e);
    }
  } catch (e) {
    console.error(`${T} | Failed to read seconds-per-round setting`, e);
  }
  return Wr;
}
c(Sm, "getSecondsPerRoundSetting");
function Cm(t) {
  if (typeof t != "function")
    return () => {
    };
  Fs.add(t);
  try {
    t(yi);
  } catch (e) {
    console.error(`${T} | Debug change handler failed`, e);
  }
  return () => {
    Fs.delete(t);
  };
}
c(Cm, "onDebugSettingChange");
function Ru(t) {
  if (typeof t != "function")
    return () => {
    };
  Ds.add(t);
  try {
    t(Cr);
  } catch (e) {
    console.error(`${T} | Manage time change handler failed`, e);
  }
  return () => {
    Ds.delete(t);
  };
}
c(Ru, "onManageTimeSettingChange");
function Zl(t) {
  if (typeof t != "function")
    return () => {
    };
  Rs.add(t);
  try {
    t(Da);
  } catch (e) {
    console.error(`${T} | Time format change handler failed`, e);
  }
  return () => {
    Rs.delete(t);
  };
}
c(Zl, "onTimeFormatSettingChange");
function Tm(t) {
  if (typeof t != "function")
    return () => {
    };
  Ps.add(t);
  try {
    t(Fa);
  } catch (e) {
    console.error(`${T} | Seconds-per-round change handler failed`, e);
  }
  return () => {
    Ps.delete(t);
  };
}
c(Tm, "onSecondsPerRoundSettingChange");
let Ho = !1, Hs = !1;
function qs(t) {
  Ho = !!t;
}
c(qs, "updateDebugState");
function Hu() {
  Hs || (Hs = !0, qs(Ql()), Cm((t) => {
    qs(t), console.info(`${T} | Debug ${Ho ? "enabled" : "disabled"}`);
  }));
}
c(Hu, "ensureInitialized");
function ec() {
  return Hs || Hu(), Ho;
}
c(ec, "shouldLog");
function qu(t) {
  if (!t.length)
    return [`${T} |`];
  const [e, ...n] = t;
  return typeof e == "string" ? [`${T} | ${e}`, ...n] : [`${T} |`, e, ...n];
}
c(qu, "formatArgs");
function Lm() {
  Hu();
}
c(Lm, "initializeDebug");
function Im() {
  return qs(wm()), Ho;
}
c(Im, "syncDebugState");
function N(...t) {
  ec() && console.debug(...qu(t));
}
c(N, "debugLog");
function Yi(...t) {
  ec() && console.group(...qu(t));
}
c(Yi, "debugGroup");
function $n() {
  ec() && console.groupEnd();
}
c($n, "debugGroupEnd");
function Hi(t) {
  var r;
  const e = (r = t == null ? void 0 : t.getFlag) == null ? void 0 : r.call(t, T, _u);
  if (!e) return [];
  const n = Gt(e), i = Array.isArray(n) ? n : [];
  return N("Loaded time triggers", {
    sceneId: (t == null ? void 0 : t.id) ?? null,
    count: i.length
  }), i;
}
c(Hi, "getTimeTriggers");
async function ju(t, e) {
  t != null && t.setFlag && (N("Persisting time triggers", {
    sceneId: t.id,
    count: Array.isArray(e) ? e.length : 0
  }), await t.setFlag(T, _u, e));
}
c(ju, "setTimeTriggers");
function Om(t) {
  var r;
  const e = (r = t == null ? void 0 : t.getFlag) == null ? void 0 : r.call(t, T, ma);
  if (!e) return {};
  const n = Gt(e);
  if (!n || typeof n != "object") return {};
  const i = {};
  for (const [a, o] of Object.entries(n))
    typeof o == "number" && Number.isFinite(o) && (i[a] = o);
  return N("Loaded time trigger history", {
    sceneId: (t == null ? void 0 : t.id) ?? null,
    keys: Object.keys(i)
  }), i;
}
c(Om, "getTimeTriggerHistory");
async function us(t, e) {
  var l, u, d, h;
  if (!t) return;
  const n = {};
  if (e && typeof e == "object")
    for (const [f, g] of Object.entries(e))
      typeof g == "number" && Number.isFinite(g) && (n[f] = g);
  const i = ((l = t.getFlag) == null ? void 0 : l.call(t, T, ma)) ?? {}, r = {};
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
    o.length && typeof t.unsetFlag == "function" && await t.unsetFlag(T, ma), a.length && await t.setFlag(T, ma, n);
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
c(us, "updateTimeTriggerHistory");
const Pa = /* @__PURE__ */ new Map(), Nc = /* @__PURE__ */ new Set();
function Am(t) {
  if (!(t != null && t.id))
    throw new Error(`${T} | Action definitions require an id.`);
  if (Pa.has(t.id))
    throw new Error(`${T} | Duplicate time trigger action id: ${t.id}`);
  Pa.set(t.id, {
    ...t
  }), N("Registered time trigger action", { actionId: t.id });
}
c(Am, "registerAction");
function Yr(t) {
  return Pa.get(t) ?? null;
}
c(Yr, "getAction");
function km(t) {
  const e = Yr(t);
  return e ? typeof e.label == "function" ? e.label() : e.label : t;
}
c(km, "getActionLabel");
function $c() {
  return Array.from(Pa.values());
}
c($c, "listActions");
async function Bu(t, e) {
  var i, r;
  const n = Yr(e == null ? void 0 : e.action);
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
c(Bu, "executeTriggerAction");
function Mm(t) {
  const e = Yr(t == null ? void 0 : t.action);
  return !e || typeof e.buildSummaryParts != "function" ? [] : e.buildSummaryParts({ trigger: t, escapeHtml: Nt, localize: E }) ?? [];
}
c(Mm, "buildActionSummaryParts");
function Nm(t) {
  const e = Yr(t == null ? void 0 : t.action);
  return !e || typeof e.buildFormContent != "function" ? "" : e.buildFormContent({ trigger: t, escapeHtml: Nt, localize: E }) ?? "";
}
c(Nm, "buildActionFormSection");
function $m(t, e) {
  const n = Yr(t == null ? void 0 : t.action);
  !n || typeof n.prepareFormData != "function" || n.prepareFormData({ trigger: t, formData: e });
}
c($m, "applyActionFormData");
function xm(t, e, n) {
  var a, o;
  const i = `${(t == null ? void 0 : t.id) ?? "unknown"}:${(e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.action) ?? "unknown"}:${n}`;
  if (Nc.has(i)) return;
  Nc.add(i);
  const r = E(
    "EIDOLON.TimeTrigger.MissingDataWarning",
    "A scene time trigger is missing required data and was skipped."
  );
  (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, r), console.warn(`${T} | Missing trigger data (${n})`, { scene: t == null ? void 0 : t.id, trigger: e });
}
c(xm, "warnMissingTriggerData");
async function _m({ scene: t, trigger: e }) {
  var a, o, s, l, u;
  const n = (s = (o = (a = e == null ? void 0 : e.data) == null ? void 0 : a.path) == null ? void 0 : o.trim) == null ? void 0 : s.call(o);
  if (!n) {
    xm(t, e, "missing-audio-path");
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
c(_m, "executePlaySoundAction");
Am({
  id: ha,
  label: /* @__PURE__ */ c(() => E("EIDOLON.TimeTrigger.ActionPlaySound", "Play Sound"), "label"),
  execute: _m,
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
var Ou;
const { ApplicationV2: Bn, HandlebarsApplicationMixin: Un } = ((Ou = foundry.applications) == null ? void 0 : Ou.api) ?? {};
if (!Bn || !Un)
  throw new Error(
    `${T} | ApplicationV2 API unavailable. Update Foundry VTT to v13 or newer.`
  );
const Dn = "AM", bi = "PM";
function xn() {
  return Pu();
}
c(xn, "getConfiguredTimeFormat");
function qo(t) {
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
c(qo, "parseCanonicalTimeString");
function Bt({ hours: t, minutes: e, seconds: n }) {
  if (!Number.isInteger(t) || !Number.isInteger(e) || t < 0 || t > 23 || e < 0 || e > 59) return null;
  const i = String(t).padStart(2, "0"), r = String(e).padStart(2, "0");
  if (Number.isInteger(n)) {
    if (n < 0 || n > 59) return null;
    const a = String(n).padStart(2, "0");
    return `${i}:${r}:${a}`;
  }
  return `${i}:${r}`;
}
c(Bt, "formatCanonicalTime");
function Fm(t, { format: e } = {}) {
  if (!t || typeof t != "object") return null;
  const n = Number(t.hour), i = Number(t.minute), r = t.second !== void 0 && t.second !== null, a = r ? Number(t.second) : null, o = r && Number.isFinite(a) ? Math.floor(Math.max(0, Math.min(59, a))) : null;
  if (!Number.isFinite(n) || !Number.isFinite(i)) return null;
  const s = e ?? xn();
  return Ra(
    {
      hours: n,
      minutes: i,
      seconds: o
    },
    s
  );
}
c(Fm, "formatTimeComponentsForDisplay");
function Dm(t, { format: e } = {}) {
  const n = qo(t);
  if (!n) return "";
  const i = e ?? xn();
  return Ra(n, i);
}
c(Dm, "formatTriggerTimeForDisplay");
function Ra(t, e = "12h") {
  if (!t) return "";
  const { hours: n, minutes: i, seconds: r = null } = t;
  if (!Number.isInteger(n) || !Number.isInteger(i)) return "";
  const a = Number.isInteger(r);
  if (e === "24h") {
    const f = `${String(n).padStart(2, "0")}:${String(i).padStart(2, "0")}`;
    return a ? `${f}:${String(r).padStart(2, "0")}` : f;
  }
  const o = n >= 12 ? bi : Dn, s = n % 12 === 0 ? 12 : n % 12, l = String(s), u = String(i).padStart(2, "0"), d = `${l}:${u}`, h = o === Dn ? E("EIDOLON.TimeTrigger.TimePeriodAM", Dn) : E("EIDOLON.TimeTrigger.TimePeriodPM", bi);
  if (a) {
    const f = String(r).padStart(2, "0");
    return `${d}:${f} ${h}`;
  }
  return `${d} ${h}`;
}
c(Ra, "formatTimeParts");
function xc(t, e = xn()) {
  const n = qo(t);
  if (e === "24h")
    return {
      format: e,
      canonical: n ? Bt(n) ?? "" : "",
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
    canonical: Bt(n) ?? "",
    hour: String(r),
    minute: String(n.minutes).padStart(2, "0"),
    period: i
  };
}
c(xc, "getTimeFormValues");
function Pm({ hour: t, minute: e, period: n, time: i }, r = xn()) {
  if (r === "24h") {
    const g = typeof t == "string" ? t.trim() : "", p = typeof e == "string" ? e.trim() : "", y = typeof i == "string" ? i.trim() : "";
    if (!g && !p && y) {
      const C = qo(y);
      return C ? { canonical: Bt(C) ?? "", error: null } : {
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
    } : { canonical: Bt({
      hours: v,
      minutes: b
    }) ?? "", error: null };
  }
  const a = typeof t == "string" ? t.trim() : "", o = typeof e == "string" ? e.trim() : "", s = typeof n == "string" ? n.trim().toUpperCase() : "";
  if (!a || !o || !s)
    return { canonical: "", error: E("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.") };
  if (s !== Dn && s !== bi)
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
    hours: s === bi ? d + 12 : d,
    minutes: u
  };
  return {
    canonical: Bt(f) ?? "",
    error: null
  };
}
c(Pm, "normalizeFormTimeInput");
function Rm() {
  return [
    {
      value: Dn,
      label: E("EIDOLON.TimeTrigger.TimePeriodAM", Dn)
    },
    {
      value: bi,
      label: E("EIDOLON.TimeTrigger.TimePeriodPM", bi)
    }
  ];
}
c(Rm, "getPeriodOptions");
var ei, ti, re, Uu, co, uo, Vu, Bs, Us, fo, mo, Gu, zu, Wu, Vs, Gs, zs, ho, go, Ws, po, Yu, Ku;
const Qn = class Qn extends Un(Bn) {
  constructor(n = {}) {
    var o;
    const { scene: i, showControls: r, ...a } = n ?? {};
    super(a);
    k(this, re);
    k(this, ei, null);
    k(this, ti, null);
    k(this, co, /* @__PURE__ */ c((n) => {
      var r, a;
      n.preventDefault();
      const i = Number((a = (r = n.currentTarget) == null ? void 0 : r.dataset) == null ? void 0 : a.delta);
      Number.isFinite(i) && (N("Time delta button clicked", { delta: i }), this._advanceTime(i));
    }, "#onDeltaClick"));
    k(this, uo, /* @__PURE__ */ c((n) => {
      var i, r;
      n.preventDefault(), !(!this.showControls || !((i = game.user) != null && i.isGM)) && (N("Time value double clicked", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null }), S(this, re, Vu).call(this));
    }, "#onTimeDoubleClick"));
    k(this, fo, /* @__PURE__ */ c((n) => {
      if (this.isEditingTime && !this._commitTimeInProgress)
        if (n.key === "Enter") {
          n.preventDefault();
          const i = n.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
          S(this, re, Us).call(this, r);
        } else n.key === "Escape" && (n.preventDefault(), S(this, re, Bs).call(this));
    }, "#onTimeInputKeydown"));
    k(this, mo, /* @__PURE__ */ c((n) => {
      if (!this.isEditingTime || this._commitTimeInProgress || this._suppressBlurCommit) return;
      const i = n.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
      S(this, re, Us).call(this, r);
    }, "#onTimeInputBlur"));
    k(this, ho, /* @__PURE__ */ c((n) => {
      const i = !!n;
      if (this.manageTimeEnabled === i) return;
      this.manageTimeEnabled = i, (this.rendered ?? this.isRendered ?? !1) && this.render({ force: !0 });
    }, "#handleManageTimeChange"));
    k(this, go, /* @__PURE__ */ c(async (n) => {
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
        await i.setFlag(T, Ms, r), this.sceneAllowsRealTime = r;
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
    k(this, po, /* @__PURE__ */ c(() => {
      (this.rendered ?? this.isRendered ?? !1) && (this.isEditingTime && (this.editValue = S(this, re, Vs).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    this.scene = i ?? null, this.showControls = typeof r == "boolean" ? r : !!((o = game.user) != null && o.isGM), this.isEditingTime = !1, this.editValue = "", this._commitTimeInProgress = !1, this._suppressBlurCommit = !1, this.manageTimeEnabled = !1, this.sceneAllowsRealTime = S(this, re, Ws).call(this), I(this, ei, Zl(m(this, po))), I(this, ti, Ru(m(this, ho)));
  }
  async _prepareContext() {
    var b, w;
    const n = ((b = game.time) == null ? void 0 : b.components) ?? {}, r = ((n == null ? void 0 : n.second) !== void 0 && (n == null ? void 0 : n.second) !== null ? Fm(n) : null) ?? S(this, re, Uu).call(this), a = xn(), o = a === "24h", s = o ? E("EIDOLON.TimeTrigger.EditTimePlaceholder24", "HH:MM") : E("EIDOLON.TimeTrigger.EditTimePlaceholder12", "HH:MM AM/PM"), l = this.showControls ? E(
      "EIDOLON.TimeTrigger.EditTimeHint",
      "Double-click to set a specific time."
    ) : "", u = this.showControls ? E(
      "EIDOLON.TimeTrigger.EditTimeLabel",
      "New time (HH:MM or HH:MM AM/PM)"
    ) : "", d = ym.map((C) => ({
      minutes: C,
      label: C > 0 ? `+${C}` : `${C}`
    })), h = !!this.manageTimeEnabled, f = S(this, re, Ws).call(this);
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
    return S(this, re, Yu).call(this), S(this, re, Ku).call(this), i;
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
          u.addEventListener("click", m(this, co));
        });
        const o = r.querySelector('.time-trigger-window__time-value[data-editable="true"]');
        o && o.addEventListener("dblclick", m(this, uo), { once: !1 });
        const s = r.querySelector(".time-trigger-window__time-input");
        s && (s.addEventListener("keydown", m(this, fo)), s.addEventListener("blur", m(this, mo)), typeof s.focus == "function" && (s.focus(), typeof s.select == "function" && s.select()));
        const l = r.querySelector('[data-action="toggle-real-time"]');
        l && l.addEventListener("click", m(this, go));
      }
      this._suppressBlurCommit = !1;
    }
  }
};
ei = new WeakMap(), ti = new WeakMap(), re = new WeakSet(), Uu = /* @__PURE__ */ c(function() {
  var l;
  const n = (l = game.time) == null ? void 0 : l.worldTime;
  if (typeof n != "number" || !Number.isFinite(n)) return "";
  const i = 1440 * 60, r = (Math.floor(n) % i + i) % i, a = Math.floor(r / 3600), o = Math.floor(r % 3600 / 60), s = r % 60;
  return Ra({ hours: a, minutes: o, seconds: s }, xn());
}, "#formatFallbackTime"), co = new WeakMap(), uo = new WeakMap(), Vu = /* @__PURE__ */ c(function() {
  var n;
  (n = game.user) != null && n.isGM && (this.isEditingTime = !0, this._suppressBlurCommit = !1, this.editValue = S(this, re, Vs).call(this), this.render({ force: !0 }));
}, "#enterTimeEditMode"), Bs = /* @__PURE__ */ c(function() {
  this.isEditingTime = !1, this.editValue = "", this._suppressBlurCommit = !1, this.render({ force: !0 });
}, "#cancelTimeEdit"), Us = /* @__PURE__ */ c(async function(n) {
  var a, o, s;
  if (!((a = game.user) != null && a.isGM) || !this.isEditingTime || this._commitTimeInProgress) return;
  this._commitTimeInProgress = !0;
  const i = typeof n == "string" ? n.trim() : "";
  if (!i) {
    S(this, re, Bs).call(this), this._commitTimeInProgress = !1;
    return;
  }
  const r = S(this, re, Wu).call(this, i);
  if (r.error) {
    (s = (o = ui.notifications) == null ? void 0 : o.error) == null || s.call(o, r.error), this._suppressBlurCommit = !0, this.editValue = i, this.render({ force: !0 }), this._commitTimeInProgress = !1;
    return;
  }
  try {
    await S(this, re, zu).call(this, r.seconds, r.includeSeconds) ? (this.isEditingTime = !1, this.editValue = "", this.render({ force: !0 })) : (this.editValue = i, this.render({ force: !0 }));
  } finally {
    this._commitTimeInProgress = !1;
  }
}, "#commitTimeInput"), fo = new WeakMap(), mo = new WeakMap(), Gu = /* @__PURE__ */ c(function() {
  var u, d;
  const n = (u = game.time) == null ? void 0 : u.worldTime;
  if (typeof n != "number" || !Number.isFinite(n))
    return "";
  const i = ((d = game.time) == null ? void 0 : d.components) ?? {}, r = Number(i.hour), a = Number(i.minute), o = i.second !== void 0 ? Number(i.second) : null, s = Number.isInteger(o);
  return (Number.isFinite(r) && Number.isFinite(a) ? Bt({
    hours: Math.max(0, Math.min(23, Number(r))),
    minutes: Math.max(0, Math.min(59, Number(a))),
    seconds: s && Number.isFinite(o) ? Math.max(0, Math.min(59, Number(o))) : void 0
  }) ?? "" : "") ?? "";
}, "#getCurrentCanonicalTime"), zu = /* @__PURE__ */ c(async function(n, i) {
  var f, g, p, y, v, b, w, C, L, A;
  const r = (f = game.time) == null ? void 0 : f.worldTime;
  if (typeof r != "number" || !Number.isFinite(r))
    return (p = (g = ui.notifications) == null ? void 0 : g.error) == null || p.call(
      g,
      E(
        "EIDOLON.TimeTrigger.EditTimeUnavailable",
        "The world time is unavailable, so it can't be updated."
      )
    ), !1;
  if (!Number.isInteger(n) || n < 0 || n >= Ri)
    return (v = (y = ui.notifications) == null ? void 0 : y.error) == null || v.call(
      y,
      E(
        "EIDOLON.TimeTrigger.EditTimeInvalidRange",
        "Enter a time within the current day."
      )
    ), !1;
  const s = Math.floor(r / Ri) * Ri + n - r;
  if (!Number.isFinite(s) || s === 0)
    return !0;
  const l = Math.floor(n / 3600), u = Math.floor(n % 3600 / 60), d = n % 60, h = Bt({
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
    const O = Ra(
      {
        hours: l,
        minutes: u,
        seconds: i ? d : null
      },
      xn()
    );
    (C = (w = ui.notifications) == null ? void 0 : w.info) == null || C.call(
      w,
      E(
        "EIDOLON.TimeTrigger.EditTimeSuccess",
        "World time updated."
      ) + (O ? ` ${O}` : "")
    );
  } catch (O) {
    return console.error(`${T} | Failed to set world time`, O), (A = (L = ui.notifications) == null ? void 0 : L.error) == null || A.call(
      L,
      E(
        "EIDOLON.TimeTrigger.EditTimeError",
        "Failed to update the world time."
      )
    ), !1;
  }
  return !0;
}, "#applyTargetSeconds"), Wu = /* @__PURE__ */ c(function(n) {
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
        canonical: Bt({ hours: f, minutes: g, seconds: p }),
        seconds: y,
        includeSeconds: p !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const { amLower: o, pmLower: s, periodPattern: l } = S(this, re, Gs).call(this), u = r.match(
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
        canonical: Bt({ hours: f, minutes: g, seconds: p }),
        seconds: w,
        includeSeconds: p !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const d = Fu(r);
  if (d !== null) {
    const f = Math.floor(d / 3600), g = Math.floor(d % 3600 / 60), p = d % 60, y = p !== 0;
    return {
      canonical: Bt({
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
}, "#parseInputTime"), Vs = /* @__PURE__ */ c(function() {
  const n = S(this, re, Gu).call(this);
  if (!n) return "";
  if (xn() === "24h")
    return n;
  const r = qo(n);
  if (!r) return n;
  const a = Number(r.hours), o = Number(r.minutes), s = r.seconds !== null && r.seconds !== void 0 ? Number(r.seconds) : void 0;
  if (!Number.isFinite(a) || !Number.isFinite(o)) return n;
  const l = Number.isFinite(s), u = a % 12 === 0 ? 12 : a % 12, d = String(o).padStart(2, "0"), h = l ? `:${String(s).padStart(2, "0")}` : "", { amLabel: f, pmLabel: g } = S(this, re, Gs).call(this), p = a >= 12 ? g : f;
  return `${u}:${d}${h} ${p}`.trim();
}, "#getInitialEditValue"), Gs = /* @__PURE__ */ c(function() {
  var u, d;
  const n = E("EIDOLON.TimeTrigger.TimePeriodAM", "AM"), i = E("EIDOLON.TimeTrigger.TimePeriodPM", "PM"), r = ((u = n.toLocaleLowerCase) == null ? void 0 : u.call(n)) ?? n.toLowerCase(), a = ((d = i.toLocaleLowerCase) == null ? void 0 : d.call(i)) ?? i.toLowerCase(), o = S(this, re, zs).call(this, n), s = S(this, re, zs).call(this, i), l = `${o}|${s}|AM|PM`;
  return {
    amLabel: n,
    pmLabel: i,
    amLower: r,
    pmLower: a,
    periodPattern: l
  };
}, "#getPeriodMatchData"), zs = /* @__PURE__ */ c(function(n) {
  return typeof n != "string" ? "" : n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}, "#escapeForRegex"), ho = new WeakMap(), go = new WeakMap(), Ws = /* @__PURE__ */ c(function() {
  const n = this.scene;
  if (!n || typeof n.getFlag != "function") return !1;
  try {
    return !!n.getFlag(T, Ms);
  } catch (i) {
    N("TimeTriggerWindow | Failed to read scene real-time flag", {
      sceneId: (n == null ? void 0 : n.id) ?? null,
      message: (i == null ? void 0 : i.message) ?? String(i)
    });
  }
  return !1;
}, "#readSceneRealTimeFlag"), po = new WeakMap(), Yu = /* @__PURE__ */ c(function() {
  if (typeof m(this, ei) == "function")
    try {
      m(this, ei).call(this);
    } catch (n) {
      console.error(`${T} | Failed to dispose time format subscription`, n);
    }
  I(this, ei, null);
}, "#disposeTimeFormatSubscription"), Ku = /* @__PURE__ */ c(function() {
  if (typeof m(this, ti) == "function")
    try {
      m(this, ti).call(this);
    } catch (n) {
      console.error(`${T} | Failed to dispose manage time subscription`, n);
    }
  I(this, ti, null);
}, "#disposeManageTimeSubscription"), c(Qn, "TimeTriggerWindow"), ye(Qn, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Re(Qn, Qn, "DEFAULT_OPTIONS"),
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
)), ye(Qn, "PARTS", {
  content: {
    template: `modules/${T}/templates/time-trigger.html`
  }
});
let js = Qn;
function jo(t, e = {}) {
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
c(jo, "createApplicationFactory");
const _c = /* @__PURE__ */ new Set();
var Ee, Xe, ni, Qi, Ju, Xu;
const wc = class wc {
  constructor({ windowFactory: e } = {}) {
    k(this, Qi);
    k(this, Ee, null);
    k(this, Xe, null);
    k(this, ni);
    const n = jo(js);
    typeof e == "function" ? e.__eidolonFactorySignature === "options" ? I(this, ni, (r, a = {}) => e({ scene: r, ...a ?? {} })) : I(this, ni, e) : I(this, ni, /* @__PURE__ */ c((r, a = {}) => n({ scene: r, ...a ?? {} }), "fallbackFactory"));
  }
  onReady() {
    var n;
    const e = typeof ((n = game.time) == null ? void 0 : n.worldTime) == "number" && Number.isFinite(game.time.worldTime) ? game.time.worldTime : null;
    N("TimeTriggerManager#onReady", { worldTime: e }), e !== null && I(this, Xe, e);
  }
  onCanvasReady(e) {
    const n = (e == null ? void 0 : e.scene) ?? lr();
    N("TimeTriggerManager#onCanvasReady", { sceneId: (n == null ? void 0 : n.id) ?? null }), this.refreshTimeTriggerWindow(n), this.handleTimeTriggerEvaluation(n);
  }
  onUpdateScene(e) {
    const n = lr();
    N("TimeTriggerManager#onUpdateScene", {
      sceneId: (e == null ? void 0 : e.id) ?? null,
      activeSceneId: (n == null ? void 0 : n.id) ?? null
    }), !(!n || e.id !== n.id) && (this.refreshTimeTriggerWindow(e), this.handleTimeTriggerEvaluation(e));
  }
  onUpdateWorldTime(e, n) {
    N("TimeTriggerManager#onUpdateWorldTime", {
      worldTime: e,
      diff: n,
      hasWindow: !!m(this, Ee)
    }), m(this, Ee) && m(this, Ee).render();
    const i = lr(), r = S(this, Qi, Ju).call(this, e, n);
    this.handleTimeTriggerEvaluation(i, e, r);
  }
  refreshTimeTriggerWindow(e) {
    var l, u, d;
    if (!e) return;
    const n = !!((l = game.user) != null && l.isGM), i = !!e.getFlag(T, _a), r = !!e.getFlag(T, As), a = !!e.getFlag(T, ks);
    if (N("TimeTriggerManager#refreshTimeTriggerWindow", {
      sceneId: e.id,
      isGM: n,
      isActive: i,
      hideWindow: r,
      showPlayerWindow: a
    }), !(i && !r && (n || a))) {
      m(this, Ee) && (N("Closing time trigger window", { reason: "not-visible" }), m(this, Ee).close({ force: !0 }), I(this, Ee, null));
      return;
    }
    const s = !!n;
    if (m(this, Ee) && ((u = m(this, Ee).scene) == null ? void 0 : u.id) === e.id) {
      N("Refreshing existing time trigger window", { sceneId: e.id }), m(this, Ee).showControls = s, m(this, Ee).render();
      return;
    }
    m(this, Ee) && (N("Closing existing window before creating new instance", {
      previousSceneId: ((d = m(this, Ee).scene) == null ? void 0 : d.id) ?? null
    }), m(this, Ee).close({ force: !0 })), I(this, Ee, m(this, ni).call(this, e, { showControls: s })), N("Rendering new time trigger window", { sceneId: e.id }), m(this, Ee).render({ force: !0 });
  }
  async handleTimeTriggerEvaluation(e, n, i) {
    var l;
    const r = e ?? lr();
    if (!r) {
      N("handleTimeTriggerEvaluation skipped", {
        reason: "no-active-scene",
        providedSceneId: (e == null ? void 0 : e.id) ?? null,
        currentWorldTime: n
      }), typeof n == "number" && Number.isFinite(n) && I(this, Xe, n);
      return;
    }
    const a = typeof n == "number" && Number.isFinite(n) ? n : typeof ((l = game.time) == null ? void 0 : l.worldTime) == "number" ? game.time.worldTime : null;
    if (a === null) return;
    const o = typeof i == "number" && Number.isFinite(i) ? i : null, s = o !== null ? o : typeof m(this, Xe) == "number" && Number.isFinite(m(this, Xe)) ? m(this, Xe) : a;
    Yi("handleTimeTriggerEvaluation", {
      sceneId: r.id,
      previousWorldTime: s,
      currentWorldTime: a,
      overrideProvided: o !== null
    });
    try {
      await S(this, Qi, Xu).call(this, r, s, a);
    } catch (u) {
      console.error(`${T} | Unexpected error while evaluating time triggers`, u), N("handleTimeTriggerEvaluation error", { message: (u == null ? void 0 : u.message) ?? String(u) });
    } finally {
      I(this, Xe, a), $n();
    }
  }
};
Ee = new WeakMap(), Xe = new WeakMap(), ni = new WeakMap(), Qi = new WeakSet(), Ju = /* @__PURE__ */ c(function(e, n) {
  return typeof m(this, Xe) == "number" && Number.isFinite(m(this, Xe)) ? (N("Resolved previous world time from cache", {
    previousWorldTime: m(this, Xe)
  }), m(this, Xe)) : typeof e == "number" && Number.isFinite(e) && typeof n == "number" && Number.isFinite(n) ? (N("Resolved previous world time using diff", {
    worldTime: e,
    diff: n,
    resolved: e - n
  }), e - n) : typeof e == "number" && Number.isFinite(e) ? e : null;
}, "#resolvePreviousWorldTime"), Xu = /* @__PURE__ */ c(async function(e, n, i) {
  var p, y, v;
  if (!((p = game.user) != null && p.isGM)) {
    N("Skipping trigger evaluation because user is not a GM");
    return;
  }
  if (!(e != null && e.id)) {
    N("Skipping trigger evaluation because the scene is missing an id");
    return;
  }
  if (!!!e.getFlag(T, _a)) {
    N("Skipping trigger evaluation because scene is inactive", { sceneId: e.id });
    return;
  }
  if (typeof i != "number" || !Number.isFinite(i)) return;
  (typeof n != "number" || !Number.isFinite(n)) && (n = i);
  const a = Hi(e);
  if (!a.length) {
    N("No time triggers configured for scene", { sceneId: e.id });
    return;
  }
  const o = Om(e), s = /* @__PURE__ */ new Set();
  for (const b of a)
    b != null && b.id && s.add(b.id);
  let l = !1;
  for (const b of Object.keys(o))
    s.has(b) || (delete o[b], l = !0);
  if (Yi("Evaluating scene time triggers", {
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
    }), await us(e, o)), $n();
    return;
  }
  const u = n, d = i, h = [], f = Math.floor(u / Ri), g = Math.floor(d / Ri);
  for (const b of a) {
    if (!(b != null && b.id)) continue;
    const w = Fu(b.time);
    if (w === null) {
      Hm(e, b), N("Skipping trigger with invalid time", {
        triggerId: b.id,
        time: b.time
      });
      continue;
    }
    for (let C = f; C <= g; C++) {
      const L = C * Ri + w;
      if (L < u || L > d) continue;
      const O = o[b.id];
      if (typeof O == "number" && O >= L) {
        N("Skipping trigger because it already fired within window", {
          triggerId: b.id,
          lastFired: O,
          absoluteTime: L
        });
        continue;
      }
      h.push({ trigger: b, absoluteTime: L });
    }
  }
  if (!h.length) {
    l && await us(e, o), N("No triggers scheduled to fire within evaluation window", {
      sceneId: e.id
    }), $n();
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
      }), await Bu(e, b.trigger);
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
  l && (N("Persisting trigger history updates", { sceneId: e.id }), await us(e, o)), $n();
}, "#evaluateSceneTimeTriggers"), c(wc, "TimeTriggerManager");
let Ys = wc;
function Hm(t, e) {
  var r, a;
  const n = `${(t == null ? void 0 : t.id) ?? "unknown"}:${(e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.time) ?? "unknown"}`;
  if (_c.has(n)) return;
  _c.add(n);
  const i = E(
    "EIDOLON.TimeTrigger.InvalidTimeWarning",
    "A scene time trigger has an invalid time value and was skipped."
  );
  (a = (r = ui.notifications) == null ? void 0 : r.warn) == null || a.call(r, i), console.warn(`${T} | Invalid time for trigger`, { scene: t == null ? void 0 : t.id, trigger: e });
}
c(Hm, "warnInvalidTriggerTime");
var Ct, Ar, Tt, wn, ii, Pt, Vi, yo, bo, kr, Mr, ri, Rt, V, Js, Ai, ga, Xs, pa, Qs, Ft, Qu, Zs, Zu, el, ed, vo, wo, Eo, So, Co, To, tl, td, ya, Lo, Io;
const Ec = class Ec {
  constructor() {
    k(this, V);
    k(this, Ct, !1);
    k(this, Ar, Wr);
    k(this, Tt, /* @__PURE__ */ new Map());
    k(this, wn, null);
    k(this, ii, null);
    k(this, Pt, 0);
    k(this, Vi, null);
    k(this, yo, null);
    k(this, bo, null);
    k(this, kr, !1);
    k(this, Mr, !1);
    k(this, ri, !1);
    k(this, Rt, !1);
    k(this, vo, /* @__PURE__ */ c((e, n = {}) => {
      N("GameTimeAutomation | Pause state changed", {
        paused: e,
        userId: (n == null ? void 0 : n.userId) ?? null,
        broadcast: (n == null ? void 0 : n.broadcast) ?? null
      }), S(this, V, Ft).call(this, { pausedOverride: e });
    }, "#handlePause"));
    k(this, wo, /* @__PURE__ */ c((e) => {
      e != null && e.id && (m(this, Tt).set(e.id, Math.max(e.round ?? 0, 1)), N("GameTimeAutomation | Combat started", { combatId: e.id, round: e.round ?? 0 }), S(this, V, Ft).call(this));
    }, "#handleCombatStart"));
    k(this, Eo, /* @__PURE__ */ c((e, n) => {
      if (!(e != null && e.id)) return;
      const i = typeof n == "number" && Number.isFinite(n) ? n : typeof e.round == "number" && Number.isFinite(e.round) ? e.round : 0, r = i > 0 ? i : 1, a = m(this, Tt).get(e.id), o = a ? Math.max(a, 1) : 1, s = r > 1 ? Math.max(r - o, 0) : 0;
      if (N("GameTimeAutomation | Combat round change detected", {
        combatId: e.id,
        effectiveRound: r,
        completedRounds: s,
        enabled: m(this, Ct),
        paused: (game == null ? void 0 : game.paused) ?? null
      }), s > 0 && m(this, Ct) && m(this, Rt) && !(game != null && game.paused) && S(this, V, Ai).call(this) && S(this, V, ga).call(this, e)) {
        const l = s * m(this, Ar);
        l > 0 && (N("GameTimeAutomation | Advancing time for completed combat rounds", {
          combatId: e.id,
          completedRounds: s,
          delta: l
        }), S(this, V, el).call(this, l));
      }
      m(this, Tt).set(e.id, Math.max(r, 1));
    }, "#handleCombatRound"));
    k(this, So, /* @__PURE__ */ c((e) => {
      e != null && e.id && (m(this, Tt).delete(e.id), N("GameTimeAutomation | Combat ended", { combatId: e.id }), S(this, V, Ft).call(this));
    }, "#handleCombatEnd"));
    k(this, Co, /* @__PURE__ */ c((e) => {
      e != null && e.id && (m(this, Tt).delete(e.id), N("GameTimeAutomation | Combat deleted", { combatId: e.id }), S(this, V, Ft).call(this));
    }, "#handleCombatDelete"));
    k(this, To, /* @__PURE__ */ c((e, n) => {
      if (e != null && e.id) {
        if (typeof (n == null ? void 0 : n.round) == "number" && Number.isFinite(n.round)) {
          const i = Math.max(n.round, 1);
          m(this, Tt).set(e.id, i), N("GameTimeAutomation | Combat round manually updated", {
            combatId: e.id,
            round: i
          });
        }
        (Object.prototype.hasOwnProperty.call(n ?? {}, "active") || (n == null ? void 0 : n.round) !== void 0) && S(this, V, Ft).call(this);
      }
    }, "#handleCombatUpdate"));
    k(this, Lo, /* @__PURE__ */ c((e) => {
      S(this, V, ya).call(this, e == null ? void 0 : e.scene), S(this, V, Ft).call(this);
    }, "#handleCanvasReady"));
    k(this, Io, /* @__PURE__ */ c((e) => {
      if (!Ye(e)) return;
      const n = S(this, V, tl).call(this);
      if (!n || n.id !== e.id) return;
      S(this, V, ya).call(this, e) && S(this, V, Ft).call(this);
    }, "#handleSceneUpdate"));
  }
  registerHooks() {
    m(this, kr) || (I(this, kr, !0), Hooks.on("pauseGame", m(this, vo)), Hooks.on("combatStart", m(this, wo)), Hooks.on("combatRound", m(this, Eo)), Hooks.on("combatEnd", m(this, So)), Hooks.on("deleteCombat", m(this, Co)), Hooks.on("updateCombat", m(this, To)), Hooks.on("canvasReady", m(this, Lo)), Hooks.on("updateScene", m(this, Io)));
  }
  initialize() {
    m(this, Mr) || (I(this, Mr, !0), I(this, yo, Ru((e) => {
      const n = !!e, i = n !== m(this, Ct);
      I(this, Ct, n), N("GameTimeAutomation | Manage time toggled", { enabled: n }), i && n && S(this, V, Qs).call(this), S(this, V, Ft).call(this);
    })), I(this, bo, Tm((e) => {
      I(this, Ar, e), N("GameTimeAutomation | Seconds per round updated", { value: e });
    })), S(this, V, Qs).call(this), S(this, V, ya).call(this), S(this, V, Ft).call(this));
  }
};
Ct = new WeakMap(), Ar = new WeakMap(), Tt = new WeakMap(), wn = new WeakMap(), ii = new WeakMap(), Pt = new WeakMap(), Vi = new WeakMap(), yo = new WeakMap(), bo = new WeakMap(), kr = new WeakMap(), Mr = new WeakMap(), ri = new WeakMap(), Rt = new WeakMap(), V = new WeakSet(), Js = /* @__PURE__ */ c(function() {
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
}, "#canControlTime"), ga = /* @__PURE__ */ c(function(e) {
  var i, r;
  if (!e) return !1;
  if (e.active === !0) return !0;
  if (e.active === !1) return !1;
  const n = (i = game == null ? void 0 : game.combats) == null ? void 0 : i.active;
  return (n == null ? void 0 : n.id) === e.id ? !0 : ((r = game == null ? void 0 : game.combat) == null ? void 0 : r.id) === e.id ? game.combat.active ?? !0 : !1;
}, "#isCombatDocumentActive"), Xs = /* @__PURE__ */ c(function(e) {
  return e ? typeof e.started == "boolean" ? e.started : (e.round ?? 0) > 0 : !1;
}, "#hasCombatStarted"), pa = /* @__PURE__ */ c(function() {
  var i;
  const e = Array.isArray((i = game == null ? void 0 : game.combats) == null ? void 0 : i.contents) ? game.combats.contents : [];
  for (const r of e)
    if (S(this, V, ga).call(this, r) && S(this, V, Xs).call(this, r))
      return !0;
  const n = game == null ? void 0 : game.combat;
  return !!(n && S(this, V, ga).call(this, n) && S(this, V, Xs).call(this, n));
}, "#isCombatRunning"), Qs = /* @__PURE__ */ c(function() {
  var n;
  m(this, Tt).clear();
  const e = Array.isArray((n = game == null ? void 0 : game.combats) == null ? void 0 : n.contents) ? game.combats.contents : [];
  for (const i of e)
    i != null && i.id && m(this, Tt).set(i.id, Math.max(i.round ?? 0, 1));
}, "#hydrateRoundTracking"), Ft = /* @__PURE__ */ c(function({ pausedOverride: e } = {}) {
  const n = typeof e == "boolean" ? e : !!(game != null && game.paused), i = m(this, Ct), r = m(this, Rt), a = i && r, o = {
    manageTimeEnabled: i,
    sceneAllowsRealTime: r,
    effectiveEnabled: a,
    paused: n,
    canControl: S(this, V, Ai).call(this),
    combatRunning: S(this, V, pa).call(this),
    overrideApplied: typeof e == "boolean"
  };
  if (N("GameTimeAutomation | Sync running state", o), !a || !S(this, V, Ai).call(this)) {
    S(this, V, Zs).call(this);
    return;
  }
  S(this, V, Qu).call(this);
}, "#syncRunningState"), Qu = /* @__PURE__ */ c(function() {
  m(this, wn) === null && (I(this, ii, S(this, V, Js).call(this)), I(this, wn, globalThis.setInterval(() => S(this, V, Zu).call(this), 1e3)), N("GameTimeAutomation | Started real-time ticker"));
}, "#startRealTimeTicker"), Zs = /* @__PURE__ */ c(function() {
  m(this, wn) !== null && (globalThis.clearInterval(m(this, wn)), I(this, wn, null), N("GameTimeAutomation | Stopped real-time ticker")), I(this, ii, null), I(this, Pt, 0), I(this, ri, !1);
}, "#stopRealTimeTicker"), Zu = /* @__PURE__ */ c(function() {
  if (!m(this, Ct) || !m(this, Rt) || !S(this, V, Ai).call(this)) {
    S(this, V, Zs).call(this);
    return;
  }
  const e = S(this, V, Js).call(this);
  if (typeof e != "number" || !Number.isFinite(e)) return;
  const n = m(this, ii) ?? e, i = (e - n) / 1e3;
  if (I(this, ii, e), !Number.isFinite(i) || i <= 0) return;
  const r = !!(game != null && game.paused), a = S(this, V, pa).call(this);
  if (r || a) {
    m(this, ri) || N("GameTimeAutomation | Tick skipped", { paused: r, combatRunning: a }), I(this, ri, !0), I(this, Pt, 0);
    return;
  }
  I(this, ri, !1), N("GameTimeAutomation | Real-time tick", { deltaSeconds: i }), S(this, V, el).call(this, i);
}, "#tickRealTime"), el = /* @__PURE__ */ c(function(e) {
  if (!m(this, Ct) || !m(this, Rt)) return;
  const n = Number(e);
  !Number.isFinite(n) || n <= 0 || (I(this, Pt, m(this, Pt) + n), !m(this, Vi) && I(this, Vi, S(this, V, ed).call(this)));
}, "#queueAdvance"), ed = /* @__PURE__ */ c(async function() {
  var e, n;
  for (; m(this, Pt) > 0; ) {
    if (!m(this, Ct) || !m(this, Rt) || game != null && game.paused || !S(this, V, Ai).call(this) || S(this, V, pa).call(this)) {
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
  I(this, Vi, null);
}, "#flushAdvanceQueue"), vo = new WeakMap(), wo = new WeakMap(), Eo = new WeakMap(), So = new WeakMap(), Co = new WeakMap(), To = new WeakMap(), tl = /* @__PURE__ */ c(function() {
  const e = lr();
  return Ye(e) ? e : null;
}, "#getActiveSceneDocument"), td = /* @__PURE__ */ c(function(e) {
  if (!Ye(e)) return !1;
  try {
    return !!e.getFlag(T, Ms);
  } catch (n) {
    return N("GameTimeAutomation | Failed to read scene real-time flag", {
      sceneId: (e == null ? void 0 : e.id) ?? null,
      message: (n == null ? void 0 : n.message) ?? String(n)
    }), !1;
  }
}, "#isSceneRealTimeAllowed"), ya = /* @__PURE__ */ c(function(e) {
  const n = Ye(e) ? e : S(this, V, tl).call(this), i = S(this, V, td).call(this, n), r = m(this, Rt);
  return I(this, Rt, i), r !== i ? (N("GameTimeAutomation | Scene real-time allowance changed", {
    sceneId: (n == null ? void 0 : n.id) ?? null,
    allows: i
  }), !0) : !1;
}, "#refreshSceneAutomationState"), Lo = new WeakMap(), Io = new WeakMap(), c(Ec, "GameTimeAutomation");
let Ks = Ec;
var Au, En, He, ai, an, Oo, we, nd, id, rd, ad, Ao, il, ko, od, Mo, sd, ld;
const en = class en extends Un(Bn) {
  constructor(n = {}) {
    const { scene: i, trigger: r, triggerIndex: a, onSave: o, ...s } = n ?? {};
    super(s);
    k(this, we);
    k(this, En, null);
    k(this, He, null);
    k(this, ai, null);
    k(this, an, null);
    k(this, Oo, /* @__PURE__ */ c(() => {
      (this.rendered ?? this.isRendered ?? !1) && (I(this, an, S(this, we, nd).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    k(this, Ao, /* @__PURE__ */ c((n) => {
      var a, o;
      const i = n.currentTarget, r = i == null ? void 0 : i.closest("form");
      r && (N("Trigger action selection changed", {
        sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
        triggerId: ((o = this.trigger) == null ? void 0 : o.id) ?? null,
        actionId: (i == null ? void 0 : i.value) ?? null
      }), S(this, we, il).call(this, i.value, r));
    }, "#onActionSelectChange"));
    k(this, ko, /* @__PURE__ */ c((n) => {
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
    k(this, Mo, /* @__PURE__ */ c(async (n) => {
      var r, a;
      n.preventDefault();
      const i = n.currentTarget;
      i instanceof HTMLFormElement && (N("Trigger form submitted", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null,
        triggerId: ((a = this.trigger) == null ? void 0 : a.id) ?? null
      }), await S(this, we, sd).call(this, i));
    }, "#onSubmit"));
    this.scene = i ?? null, this.trigger = r ?? null, this.triggerIndex = Number.isInteger(a) ? Number(a) : null, this.onSave = typeof o == "function" ? o : null, I(this, ai, Zl(m(this, Oo)));
  }
  async _prepareContext() {
    var n, i;
    Yi("TriggerFormApplication#_prepareContext", {
      sceneId: ((n = this.scene) == null ? void 0 : n.id) ?? null,
      triggerId: ((i = this.trigger) == null ? void 0 : i.id) ?? null,
      triggerIndex: this.triggerIndex
    });
    try {
      const r = this.trigger ?? { action: ha, data: {} }, a = r.action ?? ha, o = xc(r.time), s = o.format ?? "12h", l = s === "12h" ? Rm() : [], u = o.period ?? (l.length > 0 ? l[0].value : null), d = s === "12h" ? l.map((g) => ({
        ...g,
        selected: g.value === u
      })) : [], h = $c().map((g) => ({
        id: g.id,
        label: typeof g.label == "function" ? g.label() : g.label,
        selected: g.id === a
      })), f = $c().map((g) => {
        const p = g.id === r.action ? r : { ...r, action: g.id }, y = Nm(p);
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
      $n();
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
    S(this, we, od).call(this, o), S(this, we, id).call(this, o), o.addEventListener("submit", m(this, Mo));
    const s = o.querySelector("[data-action-select]");
    s && (s.addEventListener("change", m(this, Ao)), S(this, we, il).call(this, s.value, o)), o.querySelectorAll("[data-action-file-picker]").forEach((h) => {
      h.addEventListener("click", m(this, ko));
    });
  }
  async close(n = {}) {
    var i;
    if ((i = m(this, En)) == null || i.call(this), I(this, En, null), I(this, He, null), I(this, an, null), typeof m(this, ai) == "function")
      try {
        m(this, ai).call(this);
      } catch (r) {
        console.error(`${T} | Failed to dispose trigger form time format subscription`, r);
      }
    return I(this, ai, null), super.close(n);
  }
};
En = new WeakMap(), He = new WeakMap(), ai = new WeakMap(), an = new WeakMap(), Oo = new WeakMap(), we = new WeakSet(), nd = /* @__PURE__ */ c(function() {
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
}, "#captureFormState"), id = /* @__PURE__ */ c(function(n) {
  if (!m(this, an)) return;
  if (!(n instanceof HTMLFormElement)) {
    I(this, an, null);
    return;
  }
  const { fields: i = [], time: r = null } = m(this, an) ?? {};
  I(this, an, null), S(this, we, rd).call(this, n, i), S(this, we, ad).call(this, n, r);
}, "#restorePendingFormState"), rd = /* @__PURE__ */ c(function(n, i) {
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
}, "#restoreFieldValues"), ad = /* @__PURE__ */ c(function(n, i) {
  var w, C, L;
  const r = n.querySelector("[data-time-format]");
  if (!(r instanceof HTMLElement)) {
    typeof m(this, He) == "function" && m(this, He).call(this);
    return;
  }
  const a = ((w = r.dataset) == null ? void 0 : w.timeFormat) === "24h" ? "24h" : "12h", o = r.querySelector("[data-time-hour]"), s = r.querySelector("[data-time-minute]"), l = r.querySelector("[data-time-period]"), u = r.querySelector("[data-time-hidden]");
  if (!i) {
    if (o instanceof HTMLInputElement && (o.value = ""), s instanceof HTMLInputElement && (s.value = ""), l instanceof HTMLSelectElement) {
      const A = ((L = (C = l.options) == null ? void 0 : C[0]) == null ? void 0 : L.value) ?? "";
      l.value = A;
    }
    u instanceof HTMLInputElement && (u.value = ""), typeof m(this, He) == "function" && m(this, He).call(this);
    return;
  }
  const d = typeof i.canonical == "string" ? i.canonical : "", h = typeof i.period == "string" ? i.period : "", f = typeof i.hour == "string" ? i.hour : "", g = typeof i.minute == "string" ? i.minute : "";
  let p = "", y = "", v = h, b = d;
  if (d) {
    const A = xc(d, a);
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
}, "#restoreTimeInputs"), Ao = new WeakMap(), il = /* @__PURE__ */ c(function(n, i) {
  i && i.querySelectorAll("[data-action-config]").forEach((r) => {
    const a = r.dataset.actionConfig === n;
    r.style.display = a ? "" : "none";
  });
}, "#updateActionSections"), ko = new WeakMap(), od = /* @__PURE__ */ c(function(n) {
  var h, f, g, p;
  if ((h = m(this, En)) == null || h.call(this), I(this, En, null), I(this, He, null), !(n instanceof HTMLFormElement)) return;
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
    const { canonical: y, error: v } = Pm(
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
  }), d(), I(this, En, () => {
    u.forEach((y) => {
      y.removeEventListener("input", d), y.removeEventListener("change", d);
    });
  }), I(this, He, d), N("Trigger form configured for time input", {
    format: r,
    sceneId: ((g = this.scene) == null ? void 0 : g.id) ?? null,
    triggerId: ((p = this.trigger) == null ? void 0 : p.id) ?? null
  });
}, "#setupTimeInput"), Mo = new WeakMap(), sd = /* @__PURE__ */ c(async function(n) {
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
  }), await S(this, we, ld).call(this, r), await this.close();
}, "#handleSubmit"), ld = /* @__PURE__ */ c(async function(n) {
  var a, o, s, l, u, d;
  const i = {
    id: ((a = this.trigger) == null ? void 0 : a.id) ?? bm(),
    time: n.time ?? "",
    action: n.action ?? ha,
    allowReplayOnRewind: !!n.allowReplayOnRewind,
    data: {}
  };
  N("Persisting trigger from form", {
    sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
    triggerId: i.id,
    existingIndex: this.triggerIndex
  }), $m(i, n);
  const r = Hi(this.scene);
  this.triggerIndex !== null && r[this.triggerIndex] ? r[this.triggerIndex] = i : r.push(i);
  try {
    await ju(this.scene, r), N("Trigger list saved", {
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
}, "#persistTrigger"), c(en, "TriggerFormApplication"), ye(en, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Re(en, en, "DEFAULT_OPTIONS"),
  {
    id: `${T}-trigger-form`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Au = Re(en, en, "DEFAULT_OPTIONS")) == null ? void 0 : Au.classes) ?? [], "standard-form", "themed"])
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
)), ye(en, "PARTS", {
  content: {
    template: `modules/${T}/templates/time-trigger-form.html`
  }
});
let nl = en;
function zt(t) {
  return t instanceof HTMLElement ? t : (t == null ? void 0 : t[0]) instanceof HTMLElement ? t[0] : null;
}
c(zt, "asHTMLElement");
function ba(t) {
  return typeof (t == null ? void 0 : t.changeTab) == "function";
}
c(ba, "isAppV2");
function cd(t, e, n, i = {}) {
  if (ba(t)) {
    t.changeTab(e, n, i);
    return;
  }
  if (typeof (t == null ? void 0 : t.activateTab) == "function") {
    const r = { ...i };
    n != null && (r.group = n), r.triggerCallback == null && (r.triggerCallback = !0), t.activateTab(e, r);
  }
}
c(cd, "setActiveTab");
function qm(t) {
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
c(qm, "readFormData");
const Fc = Symbol.for("eidolon.sceneConfig.v13PatchedTabs");
function ud(t = {}) {
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
  function L() {
    var W, H, U, K, ae;
    const $ = ((H = (W = foundry == null ? void 0 : foundry.applications) == null ? void 0 : W.sheets) == null ? void 0 : H.SceneConfig) ?? ((U = CONFIG == null ? void 0 : CONFIG.Scene) == null ? void 0 : U.sheetClass);
    if (!$ || !ba({ changeTab: (K = $.prototype) == null ? void 0 : K.changeTab })) return;
    const R = $[Fc] ?? /* @__PURE__ */ new Set();
    if (R.has(e)) return;
    R.add(e), $[Fc] = R;
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
  c(L, "patchV13SceneConfig");
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
      const U = zt(R) ?? zt($.element);
      if (!U) {
        g("Missing root element", { tabId: e });
        return;
      }
      ba($) ? _($, U, B) : M($, U, B);
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
    var at, Kt, Ke, Oe, Ti, Jt, Vn, ot, Xt, F, Zr, X, yt, $e, tr, ea;
    const H = [
      "nav.sheet-tabs[data-group]",
      "nav.tabs[data-group]",
      "nav.sheet-tabs",
      "nav.tabs"
    ].map((xe) => R.querySelector(xe)).find((xe) => xe instanceof HTMLElement), K = [
      (at = R.querySelector(".tab[data-tab]")) == null ? void 0 : at.parentElement,
      R.querySelector(".sheet-body"),
      (Ke = (Kt = H == null ? void 0 : H.parentElement) == null ? void 0 : Kt.querySelector) == null ? void 0 : Ke.call(Kt, ":scope > .sheet-body"),
      H == null ? void 0 : H.parentElement
    ].find((xe) => xe instanceof HTMLElement), ae = ((Oe = H == null ? void 0 : H.dataset) == null ? void 0 : Oe.group) ?? ((Vn = (Jt = (Ti = H == null ? void 0 : H.querySelector) == null ? void 0 : Ti.call(H, "a[data-group]")) == null ? void 0 : Jt.dataset) == null ? void 0 : Vn.group) ?? ((F = (Xt = (ot = H == null ? void 0 : H.querySelector) == null ? void 0 : ot.call(H, "[data-group]")) == null ? void 0 : Xt.dataset) == null ? void 0 : F.group) ?? ((yt = (X = (Zr = K == null ? void 0 : K.querySelector) == null ? void 0 : Zr.call(K, ".tab[data-group]")) == null ? void 0 : X.dataset) == null ? void 0 : yt.group) ?? "main";
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
    O(Q, C({ app: $, scene: B }) ?? e, ba($));
    let te = K.querySelector(`.tab[data-tab="${e}"]`);
    if (!te) {
      te = document.createElement("div"), te.classList.add("tab"), te.dataset.tab = e, te.dataset.group = ae;
      const xe = dd(K);
      K.insertBefore(te, xe ?? null), typeof l == "function" && l({ app: $, tab: te, body: K, scene: B }), g("Created tab container", { tabId: e, group: ae });
    }
    ((tr = Q.classList) == null ? void 0 : tr.contains("active")) || te.classList.contains("active") ? (Q.classList.add("active"), te.classList.add("active"), te.removeAttribute("hidden")) : (Q.classList.remove("active"), te.classList.remove("active"), te.setAttribute("hidden", "true"));
    const pt = /* @__PURE__ */ c(() => {
      var Gn, nr;
      ((Gn = Q.classList) != null && Gn.contains("active") || te.classList.contains("active")) && ((nr = Q.classList) == null || nr.add("active"), te.classList.add("active"), te.removeAttribute("hidden"), te.removeAttribute("aria-hidden"), te.style.display === "none" && (te.style.display = ""));
    }, "ensureTabVisible"), Pe = /* @__PURE__ */ c(() => {
      pt(), requestAnimationFrame(pt);
    }, "scheduleEnsureTabVisible");
    Q.dataset.eidolonEnsureSceneTabVisibility || (Q.addEventListener("click", () => {
      cd($, e, ae), requestAnimationFrame(pt);
    }), Q.dataset.eidolonEnsureSceneTabVisibility = "true"), ds($, v, g);
    const rt = a({
      app: $,
      scene: B,
      tab: te,
      tabButton: Q,
      ensureTabVisible: pt,
      scheduleEnsureTabVisible: Pe
    });
    typeof rt == "function" && Dc($, v, rt), typeof u == "function" && u({
      app: $,
      scene: B,
      tab: te,
      tabButton: Q,
      ensureTabVisible: pt,
      scheduleEnsureTabVisible: Pe
    }), (ea = $.setPosition) == null || ea.call($, { height: "auto" });
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
    ds($, v, g);
    const ae = a({
      app: $,
      scene: B,
      tab: W,
      tabButton: H,
      ensureTabVisible: U,
      scheduleEnsureTabVisible: K
    });
    typeof ae == "function" && Dc($, v, ae), typeof u == "function" && u({
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
    ds($, v, g);
  }
  c(j, "handleClose");
  function D() {
    return Hooks.once("init", () => {
      L();
    }), Hooks.on("renderSceneConfig", A), Hooks.on("closeSceneConfig", j), () => P();
  }
  c(D, "register");
  function P() {
    Hooks.off("renderSceneConfig", A), Hooks.off("closeSceneConfig", j);
  }
  return c(P, "unregister"), { register: D, unregister: P };
}
c(ud, "createSceneConfigTabFactory");
function Dc(t, e, n) {
  if (!t || typeof n != "function") return;
  const i = t == null ? void 0 : t[e];
  Array.isArray(i) || (t[e] = []), t[e].push(n);
}
c(Dc, "registerCleanup");
function ds(t, e, n) {
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
c(ds, "invokeCleanup");
function dd(t) {
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
c(dd, "findFooterElement");
const jm = jo(nl), Bm = `modules/${T}/templates/time-trigger-scene-tab.html`, Um = ud({
  tabId: "time-triggers",
  tabLabel: /* @__PURE__ */ c(() => E("EIDOLON.TimeTrigger.Tab", "Time Triggers"), "tabLabel"),
  getScene: Wt,
  isApplicable: Wm,
  renderContent: /* @__PURE__ */ c(({ app: t, scene: e, tab: n }) => Gm(t, n, e), "renderContent"),
  logger: {
    log: N,
    group: Yi,
    groupEnd: $n
  }
});
function Vm() {
  return N("Registering SceneConfig render hook"), Um.register();
}
c(Vm, "registerSceneConfigHook");
function Gm(t, e, n) {
  if (!(e instanceof HTMLElement)) return;
  const i = Ye(n) ? n : Wt(t);
  Ha(t, e, i);
  const r = Zl(() => {
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
c(Gm, "renderTimeTriggerTab");
async function Ha(t, e, n) {
  var r, a;
  const i = n ?? Wt(t);
  Yi("renderTimeTriggersTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!Ye(i)) {
      const W = E(
        "EIDOLON.TimeTrigger.Unavailable",
        "Time triggers are unavailable for this configuration sheet."
      );
      e.innerHTML = `<p class="notes">${W}</p>`, N("Scene lacks document for time triggers", { sceneId: (i == null ? void 0 : i.id) ?? null });
      return;
    }
    const o = `flags.${T}.${_a}`, s = `flags.${T}.${As}`, l = `flags.${T}.${ks}`, u = !!i.getFlag(T, _a), d = !!i.getFlag(T, As), h = !!i.getFlag(T, ks), f = Hi(i);
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
    ), L = E(
      "EIDOLON.TimeTrigger.TriggerListEmpty",
      "No time triggers configured for this scene."
    ), A = E("EIDOLON.TimeTrigger.AddTrigger", "Add Trigger"), O = E("EIDOLON.TimeTrigger.EditTrigger", "Edit"), M = E("EIDOLON.TimeTrigger.DeleteTrigger", "Remove"), _ = E("EIDOLON.TimeTrigger.TriggerNow", "Trigger Now"), j = E("EIDOLON.TimeTrigger.AtLabel", "At"), D = E("EIDOLON.TimeTrigger.DoLabel", "Do"), P = E("EIDOLON.TimeTrigger.MissingTime", "(No time set)"), $ = f.map((W, H) => {
      const ae = (W.time ? Dm(W.time) : "") || W.time || "" || P, Q = km(W.action), te = [
        `${j} ${ae}`,
        `${D} ${Q}`,
        ...Mm(W)
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
      console.error(`${T} | renderTemplate is unavailable; cannot render scene tab.`), e.innerHTML = `<p class="notes">${L}</p>`;
      return;
    }
    let B = "";
    try {
      B = await R(Bm, {
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
          empty: L,
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
      console.error(`${T} | Failed to render time trigger scene tab template`, W), e.innerHTML = `<p class="notes">${L}</p>`;
      return;
    }
    e.innerHTML = B, zm(t, e, i);
  } finally {
    $n();
  }
}
c(Ha, "renderTimeTriggersTabContent");
function zm(t, e, n) {
  const i = n ?? Wt(t);
  if (!Ye(i)) return;
  const r = e.querySelector('[data-action="add-trigger"]');
  r && r.addEventListener("click", () => {
    N("Add trigger button clicked", { sceneId: i.id }), Pc(t, { scene: i });
  }), e.querySelectorAll('[data-action="edit-trigger"]').forEach((a) => {
    a.addEventListener("click", () => {
      const o = Number(a.dataset.index);
      if (!Number.isInteger(o)) return;
      const l = Hi(i)[o];
      l && (N("Edit trigger button clicked", { sceneId: i.id, triggerId: l.id, index: o }), Pc(t, { trigger: l, triggerIndex: o, scene: i }));
    });
  }), e.querySelectorAll('[data-action="delete-trigger"]').forEach((a) => {
    a.addEventListener("click", async () => {
      var u, d;
      const o = Number(a.dataset.index);
      if (!Number.isInteger(o)) return;
      const s = Hi(i), l = s[o];
      if (l) {
        s.splice(o, 1);
        try {
          N("Deleting trigger", {
            sceneId: i.id,
            index: o,
            triggerId: (l == null ? void 0 : l.id) ?? null
          }), await ju(i, s), await Ha(t, e, i);
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
      const l = Hi(i)[o];
      if (l) {
        if (!((u = game.user) != null && u.isGM)) {
          (h = (d = ui.notifications) == null ? void 0 : d.warn) == null || h.call(
            d,
            E("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time.")
          );
          return;
        }
        try {
          N("Manually firing trigger", { sceneId: i.id, triggerId: l.id, index: o }), await Bu(i, l), (g = (f = ui.notifications) == null ? void 0 : f.info) == null || g.call(
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
c(zm, "bindTimeTriggerTabEvents");
function Pc(t, e = {}) {
  var o;
  const n = e.scene ?? null, i = n && Ye(n) ? n : Wt(t);
  if (!Ye(i)) {
    console.warn(`${T} | Unable to open trigger form because no scene document is available.`);
    return;
  }
  N("Opening trigger form", {
    sceneId: i.id,
    triggerId: ((o = e.trigger) == null ? void 0 : o.id) ?? null,
    index: Number.isInteger(e.triggerIndex) ? Number(e.triggerIndex) : null
  }), jm({
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
c(Pc, "openTriggerForm");
function Wm(t, e) {
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
c(Wm, "isRecognizedSceneConfig");
const ra = new Ys(), Rc = new Ks();
function Ym() {
  N("Registering time trigger hooks"), Hooks.once("init", () => {
    vm(), Lm(), N("Time trigger settings registered during init");
  }), Vm(), N("Scene config hook registered"), Rc.registerHooks(), N("Time automation hooks registered"), Hooks.once("ready", () => {
    Im(), N("Ready hook fired"), ra.onReady(), Rc.initialize();
  }), Hooks.on("canvasReady", (t) => {
    var e;
    N("canvasReady hook received", { scene: ((e = t == null ? void 0 : t.scene) == null ? void 0 : e.id) ?? null }), ra.onCanvasReady(t);
  }), Hooks.on("updateScene", (t) => {
    N("updateScene hook received", { scene: (t == null ? void 0 : t.id) ?? null }), ra.onUpdateScene(t);
  }), Hooks.on("updateWorldTime", (t, e) => {
    N("updateWorldTime hook received", { worldTime: t, diff: e }), ra.onUpdateWorldTime(t, e);
  });
}
c(Ym, "registerTimeTriggerHooks");
Ym();
const Ce = T, fd = "criteria", tc = "state", Km = "criteriaVersion", Jm = 1, md = "enableCriteriaSurfaces";
let Hc = !1;
function Xm() {
  var t;
  if (!Hc) {
    if (Hc = !0, !((t = game == null ? void 0 : game.settings) != null && t.register)) {
      console.warn(`${Ce} | game.settings.register unavailable; scene criteria setting skipped.`);
      return;
    }
    game.settings.register(Ce, md, {
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
        Qm();
      }, "onChange")
    });
  }
}
c(Xm, "registerSceneCriteriaSettings");
function Bo() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return !!game.settings.get(Ce, md);
  } catch (e) {
    console.error(`${Ce} | Failed to read criteria surfaces setting`, e);
  }
  return !0;
}
c(Bo, "getCriteriaSurfacesEnabled");
function Qm() {
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
c(Qm, "promptReloadForCriteriaSurfaces");
const qa = "Standard";
function gt(t) {
  var n;
  const e = (n = t == null ? void 0 : t.getFlag) == null ? void 0 : n.call(t, Ce, fd);
  return e ? hd(e) : [];
}
c(gt, "getSceneCriteria");
async function Uo(t, e) {
  if (!(t != null && t.setFlag)) return;
  const n = hd(e);
  await t.setFlag(Ce, fd, n), await t.setFlag(Ce, Km, Jm);
  const i = Kr(t, n);
  await t.setFlag(Ce, tc, i);
}
c(Uo, "setSceneCriteria");
function Kr(t, e = null) {
  var r;
  const n = Array.isArray(e) ? e : gt(t), i = Gt(((r = t == null ? void 0 : t.getFlag) == null ? void 0 : r.call(t, Ce, tc)) ?? {});
  return ic(i, n);
}
c(Kr, "getSceneCriteriaState");
async function Zm(t, e, n = null) {
  if (!(t != null && t.setFlag)) return;
  const i = Array.isArray(n) ? n : gt(t), r = ic(e, i);
  await t.setFlag(Ce, tc, r);
}
c(Zm, "setSceneCriteriaState");
function nc(t = "") {
  const e = typeof t == "string" ? t.trim() : "", n = gd(al(e || "criterion"), /* @__PURE__ */ new Set());
  return {
    id: pd(),
    key: n,
    label: e,
    values: [qa],
    default: qa,
    order: 0
  };
}
c(nc, "createSceneCriterion");
function hd(t) {
  const e = Array.isArray(t) ? Gt(t) : [], n = [], i = /* @__PURE__ */ new Set();
  return e.forEach((r, a) => {
    const o = rl(r, a, i);
    o && (n.push(o), i.add(o.key));
  }), n;
}
c(hd, "sanitizeCriteria$1");
function rl(t, e = 0, n = /* @__PURE__ */ new Set()) {
  if (!t || typeof t != "object") return null;
  const i = typeof t.id == "string" && t.id.trim() ? t.id.trim() : pd(), a = (typeof t.label == "string" ? t.label : typeof t.name == "string" ? t.name : "").trim(), o = typeof t.key == "string" && t.key.trim() ? al(t.key) : al(a || `criterion-${Number(e) + 1}`), s = gd(o, n), l = th(t.values);
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
c(rl, "sanitizeCriterion");
function ic(t, e = []) {
  const n = t && typeof t == "object" ? Gt(t) : {}, i = {};
  for (const r of e) {
    const a = n == null ? void 0 : n[r.key], o = typeof a == "string" ? a.trim() : "";
    o && r.values.includes(o) ? i[r.key] = o : i[r.key] = r.default;
  }
  return i;
}
c(ic, "sanitizeSceneCriteriaState");
function eh(t) {
  return gt(t).map((n) => ({
    id: n.key,
    key: n.key,
    name: n.label,
    values: [...n.values]
  }));
}
c(eh, "getSceneCriteriaCategories");
function th(t) {
  const e = Array.isArray(t) ? t : [], n = [];
  for (const i of e) {
    if (typeof i != "string") continue;
    const r = i.trim();
    !r || n.includes(r) || n.push(r);
  }
  return n.length || n.push(qa), n;
}
c(th, "sanitizeCriterionValues");
function al(t) {
  return String(t ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
c(al, "slugifyCriterionKey");
function gd(t, e) {
  if (!e.has(t)) return t;
  let n = 2;
  for (; e.has(`${t}-${n}`); )
    n += 1;
  return `${t}-${n}`;
}
c(gd, "ensureUniqueCriterionKey");
function pd() {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 11);
}
c(pd, "generateCriterionId");
function yd(t) {
  var e, n;
  console.error(`${Ce} | Failed to persist scene criteria`, t), (n = (e = ui.notifications) == null ? void 0 : e.error) == null || n.call(
    e,
    E(
      "EIDOLON.SceneCriteria.PersistError",
      "Failed to persist the scene criteria."
    )
  );
}
c(yd, "notifyPersistError");
var ku, ge, on, De, bd, No, $o, xo, _o, va, Fo, Nr, $r, cr, vd;
const tn = class tn extends Un(Bn) {
  constructor(n = {}) {
    const { scene: i, criterion: r, isNew: a, onSave: o, ...s } = n ?? {};
    super(s);
    k(this, De);
    k(this, ge, null);
    k(this, on, !1);
    k(this, No, /* @__PURE__ */ c(async (n) => {
      n.preventDefault();
      const i = n.currentTarget;
      if (!(i instanceof HTMLFormElement)) return;
      const r = new FormData(i), a = String(r.get("criterionLabel") ?? "").trim(), o = String(r.get("criterionKey") ?? "").trim(), s = Array.from(i.querySelectorAll('[name="criterionValues"]')).map((h) => h instanceof HTMLInputElement ? h.value.trim() : "").filter((h, f, g) => h && g.indexOf(h) === f), u = String(r.get("criterionDefault") ?? "").trim() || s[0] || "Standard", d = rl(
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
      d && (I(this, ge, d), await S(this, De, vd).call(this), this.close());
    }, "#onSubmit"));
    k(this, $o, /* @__PURE__ */ c((n) => {
      var o;
      if (m(this, on)) return;
      const i = n.currentTarget, r = (i == null ? void 0 : i.form) ?? ((o = this.element) == null ? void 0 : o.querySelector("form"));
      if (!(r instanceof HTMLFormElement)) return;
      const a = r.querySelector('input[name="criterionKey"]');
      a instanceof HTMLInputElement && (a.value = ar(i.value));
    }, "#onLabelInput"));
    k(this, xo, /* @__PURE__ */ c((n) => {
      var l;
      const i = n.currentTarget, r = (i == null ? void 0 : i.form) ?? ((l = this.element) == null ? void 0 : l.querySelector("form"));
      if (!(r instanceof HTMLFormElement) || !(i instanceof HTMLInputElement)) return;
      const a = r.querySelector('input[name="criterionLabel"]'), o = ar(a instanceof HTMLInputElement ? a.value : ""), s = ar(i.value);
      I(this, on, s !== o), i.value = s, S(this, De, va).call(this, r);
    }, "#onKeyInput"));
    k(this, _o, /* @__PURE__ */ c((n) => {
      var o, s;
      n.preventDefault();
      const i = ((o = n.currentTarget) == null ? void 0 : o.form) ?? ((s = this.element) == null ? void 0 : s.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector('input[name="criterionLabel"]'), a = i.querySelector('input[name="criterionKey"]');
      a instanceof HTMLInputElement && (a.value = ar(r instanceof HTMLInputElement ? r.value : ""), I(this, on, !1), S(this, De, va).call(this, i));
    }, "#onResetAutoKey"));
    k(this, Fo, /* @__PURE__ */ c((n) => {
      var l, u, d, h, f, g;
      n.preventDefault();
      const i = ((l = n.currentTarget) == null ? void 0 : l.form) ?? ((u = this.element) == null ? void 0 : u.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector(".scene-criterion-editor__values");
      if (!(r instanceof HTMLElement)) return;
      (d = r.querySelector(".scene-criterion-editor__empty")) == null || d.remove();
      const a = document.createElement("div");
      a.classList.add("scene-criterion-editor__value");
      const o = Nt(E("EIDOLON.SceneCriteria.ValuePlaceholder", "Allowed value")), s = Nt(E("EIDOLON.SceneCriteria.RemoveValue", "Remove Value"));
      a.innerHTML = `
      <input type="text" name="criterionValues" value="" placeholder="${o}" class="form-control">
      <button type="button" class="icon" data-action="remove-value" aria-label="${s}" title="${s}">
        <i class="fa-solid fa-trash"></i>
      </button>
    `, r.appendChild(a), (h = a.querySelector('[data-action="remove-value"]')) == null || h.addEventListener("click", m(this, Nr)), (f = a.querySelector('input[name="criterionValues"]')) == null || f.addEventListener("input", m(this, $r)), S(this, De, cr).call(this, i), (g = a.querySelector('input[name="criterionValues"]')) == null || g.focus();
    }, "#onAddValue"));
    k(this, Nr, /* @__PURE__ */ c((n) => {
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
        S(this, De, cr).call(this, i);
      }
    }, "#onRemoveValue"));
    k(this, $r, /* @__PURE__ */ c((n) => {
      var r, a;
      const i = ((r = n.currentTarget) == null ? void 0 : r.form) ?? ((a = this.element) == null ? void 0 : a.querySelector("form"));
      i instanceof HTMLFormElement && S(this, De, cr).call(this, i);
    }, "#onValuesChanged"));
    this.scene = i ?? null, this.criterion = r ?? null, this.onSave = typeof o == "function" ? o : null, this.isNew = !!a, I(this, ge, S(this, De, bd).call(this)), I(this, on, m(this, ge).key !== ar(m(this, ge).label));
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
      keyIsCustom: m(this, on)
    };
  }
  _onRender(n, i) {
    var a, o, s, l, u, d;
    super._onRender(n, i);
    const r = (a = this.element) == null ? void 0 : a.querySelector("form");
    r && (r.addEventListener("submit", m(this, No)), (o = r.querySelector('[data-action="add-value"]')) == null || o.addEventListener("click", m(this, Fo)), (s = r.querySelector('input[name="criterionLabel"]')) == null || s.addEventListener("input", m(this, $o)), (l = r.querySelector('input[name="criterionKey"]')) == null || l.addEventListener("input", m(this, xo)), (u = r.querySelector('[data-action="reset-auto-key"]')) == null || u.addEventListener("click", m(this, _o)), r.querySelectorAll('[data-action="remove-value"]').forEach((h) => {
      h.addEventListener("click", m(this, Nr));
    }), r.querySelectorAll('input[name="criterionValues"]').forEach((h) => {
      h.addEventListener("input", m(this, $r));
    }), (d = r.querySelector('[data-action="cancel"]')) == null || d.addEventListener("click", (h) => {
      h.preventDefault(), this.close();
    }), S(this, De, va).call(this, r), S(this, De, cr).call(this, r));
  }
};
ge = new WeakMap(), on = new WeakMap(), De = new WeakSet(), bd = /* @__PURE__ */ c(function() {
  const n = rl(this.criterion, 0, /* @__PURE__ */ new Set()) ?? nc(E("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion"));
  return {
    id: n.id,
    key: n.key,
    label: n.label ?? "",
    values: Array.isArray(n.values) ? [...n.values] : [],
    default: n.default
  };
}, "#initializeState"), No = new WeakMap(), $o = new WeakMap(), xo = new WeakMap(), _o = new WeakMap(), va = /* @__PURE__ */ c(function(n) {
  const i = n.querySelector('[data-action="reset-auto-key"]');
  i instanceof HTMLButtonElement && (i.disabled = !m(this, on));
}, "#syncAutoKeyButton"), Fo = new WeakMap(), Nr = new WeakMap(), $r = new WeakMap(), cr = /* @__PURE__ */ c(function(n) {
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
}, "#syncDefaultOptions"), vd = /* @__PURE__ */ c(async function() {
  if (!this.scene) return;
  const n = gt(this.scene).sort((r, a) => r.order - a.order), i = n.findIndex((r) => r.id === m(this, ge).id);
  i < 0 ? (m(this, ge).order = n.length, n.push(m(this, ge))) : (m(this, ge).order = n[i].order, n.splice(i, 1, m(this, ge)));
  try {
    await Uo(this.scene, n), this.onSave && await this.onSave(m(this, ge));
  } catch (r) {
    yd(r);
  }
}, "#persist"), c(tn, "CategoryEditorApplication"), ye(tn, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Re(tn, tn, "DEFAULT_OPTIONS"),
  {
    id: `${Ce}-criterion-editor`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((ku = Re(tn, tn, "DEFAULT_OPTIONS")) == null ? void 0 : ku.classes) ?? [], "standard-form", "themed"])
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
)), ye(tn, "PARTS", {
  content: {
    template: `modules/${Ce}/templates/scene-criteria-editor.html`
  }
});
let ol = tn;
function ar(t) {
  return String(t ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
c(ar, "slugifyKey");
const nh = `modules/${Ce}/templates/scene-criteria-tab.html`, sl = {
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
}, ih = jo(ol), rh = ud({
  tabId: "criteria",
  tabLabel: /* @__PURE__ */ c(() => E("EIDOLON.SceneCriteria.TabLabel", "Criteria"), "tabLabel"),
  getScene: Wt,
  isApplicable: /* @__PURE__ */ c(() => Bo(), "isApplicable"),
  renderContent: /* @__PURE__ */ c(({ app: t, tab: e, scene: n }) => oh(t, e, n), "renderContent"),
  logger: sl
});
function ah() {
  return rh.register();
}
c(ah, "registerSceneCriteriaConfigHook");
function oh(t, e, n) {
  if (!(e instanceof HTMLElement)) return;
  const i = Ye(n) ? n : Wt(t);
  ki(t, e, i);
}
c(oh, "renderCriteriaTab");
async function ki(t, e, n) {
  var r, a;
  const i = n ?? Wt(t);
  sl.group("renderCriteriaTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!Ye(i)) {
      const d = E(
        "EIDOLON.SceneCriteria.Unavailable",
        "Scene criteria are unavailable for this configuration sheet."
      );
      e.innerHTML = `<p class="notes">${d}</p>`;
      return;
    }
    const o = gt(i).sort((d, h) => d.order - h.order), s = Kr(i, o), l = ((a = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : a.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof l != "function") {
      e.innerHTML = `<p class="notes">${E("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
      return;
    }
    const u = await l(nh, {
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
          valueCountLabel: lh(d.values.length),
          canMoveUp: h > 0,
          canMoveDown: h < o.length - 1
        };
      }),
      hasCriteria: o.length > 0
    });
    e.innerHTML = u, sh(t, e, i);
  } catch (o) {
    console.error(`${Ce} | Failed to render criteria tab`, o), e.innerHTML = `<p class="notes">${E("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
  } finally {
    sl.groupEnd();
  }
}
c(ki, "renderCriteriaTabContent");
function sh(t, e, n) {
  const i = n ?? Wt(t);
  if (!Ye(i)) return;
  const r = e.querySelector('[data-criteria-action="add"]');
  r && r.addEventListener("click", () => {
    qc(t, {
      scene: i,
      criterion: nc(
        E("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion")
      ),
      isNew: !0,
      onSave: /* @__PURE__ */ c(() => ki(t, e, i), "onSave")
    });
  }), e.querySelectorAll('[data-criteria-action="edit"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", () => {
      const s = gt(i).find((l) => l.id === o);
      s && qc(t, {
        scene: i,
        criterion: s,
        onSave: /* @__PURE__ */ c(() => ki(t, e, i), "onSave")
      });
    });
  }), e.querySelectorAll('[data-criteria-action="remove"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await fs(i, (l) => {
        const u = l.findIndex((d) => d.id === o);
        return u < 0 ? !1 : (l.splice(u, 1), ms(l), !0);
      }) && await ki(t, e, i);
    });
  }), e.querySelectorAll('[data-criteria-action="move-up"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await fs(i, (l) => {
        const u = l.findIndex((h) => h.id === o);
        if (u <= 0) return !1;
        const [d] = l.splice(u, 1);
        return l.splice(u - 1, 0, d), ms(l), !0;
      }) && await ki(t, e, i);
    });
  }), e.querySelectorAll('[data-criteria-action="move-down"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await fs(i, (l) => {
        const u = l.findIndex((h) => h.id === o);
        if (u < 0 || u >= l.length - 1) return !1;
        const [d] = l.splice(u, 1);
        return l.splice(u + 1, 0, d), ms(l), !0;
      }) && await ki(t, e, i);
    });
  });
}
c(sh, "bindCriteriaTabEvents");
async function fs(t, e) {
  const n = gt(t).sort((r, a) => r.order - a.order);
  if (e(n) === !1) return !1;
  try {
    return await Uo(t, n), !0;
  } catch (r) {
    return yd(r), !1;
  }
}
c(fs, "mutateCriteria");
function qc(t, e = {}) {
  const n = e.scene ?? null, i = n && Ye(n) ? n : Wt(t);
  if (!Ye(i))
    return;
  ih({
    scene: i,
    criterion: e.criterion ?? null,
    isNew: !!e.isNew,
    onSave: typeof e.onSave == "function" ? e.onSave : null
  }).render({ force: !0 });
}
c(qc, "openCriterionEditor");
function ms(t) {
  t.forEach((e, n) => {
    e.order = n;
  });
}
c(ms, "reindexCriteriaOrder");
function lh(t) {
  var e, n;
  if ((n = (e = game.i18n) == null ? void 0 : e.has) != null && n.call(e, "EIDOLON.SceneCriteria.ValueCountLabel"))
    try {
      return game.i18n.format("EIDOLON.SceneCriteria.ValueCountLabel", { count: t });
    } catch (i) {
      console.error(`${Ce} | Failed to format value count label`, i);
    }
  return t === 0 ? "No values configured" : t === 1 ? "1 value" : `${t} values`;
}
c(lh, "formatValueCount");
let jc = !1;
function ch() {
  Hooks.once("init", () => {
    Xm();
  }), Hooks.once("ready", () => {
    Bo() && (jc || (ah(), jc = !0));
  });
}
c(ch, "registerSceneCriteriaHooks");
ch();
const ie = T, wd = "criteriaEngineVersion", mi = "fileIndex", hi = "tileCriteria", rc = {
  LEGACY: 1,
  CRITERIA: 2
}, Ed = rc.CRITERIA;
function Sd(t) {
  var e;
  return ((e = t == null ? void 0 : t.getFlag) == null ? void 0 : e.call(t, ie, wd)) ?? rc.LEGACY;
}
c(Sd, "getSceneEngineVersion");
function uh(t, e, n, i, r) {
  if (!(t != null && t.length) || !(n != null && n.length)) return -1;
  const a = {};
  for (const s of n)
    a[s] = e[s];
  const o = Bc(t, a, n);
  if (o >= 0) return o;
  if (i != null && i.length && r) {
    const s = { ...a };
    for (const l of i) {
      if (!(l in s)) continue;
      s[l] = r[l] ?? "Standard";
      const u = Bc(t, s, n);
      if (u >= 0) return u;
    }
  }
  return -1;
}
c(uh, "findBestMatch");
function Bc(t, e, n) {
  return t.findIndex((i) => {
    for (const r of n)
      if (i[r] !== e[r]) return !1;
    return !0;
  });
}
c(Bc, "findExactMatch");
function dh(t, e) {
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
c(dh, "findFileIndex");
function wa(t) {
  return t && typeof t == "object" && !Array.isArray(t);
}
c(wa, "isPlainObject$2");
function Uc(t) {
  return t == null ? t : typeof structuredClone == "function" ? structuredClone(t) : JSON.parse(JSON.stringify(t));
}
c(Uc, "deepClone");
function fh(t, e) {
  if (!e) return;
  const n = e.split(".").filter(Boolean);
  if (!n.length) return;
  let i = t;
  for (let r = 0; r < n.length - 1; r += 1) {
    if (!wa(i == null ? void 0 : i[n[r]])) return;
    i = i[n[r]];
  }
  delete i[n.at(-1)];
}
c(fh, "deletePath");
function Cd(t, e) {
  const n = Uc(t ?? {});
  if (!wa(e)) return n;
  for (const [i, r] of Object.entries(e)) {
    if (i.startsWith("-=") && r === !0) {
      fh(n, i.slice(2));
      continue;
    }
    wa(r) && wa(n[i]) ? n[i] = Cd(n[i], r) : n[i] = Uc(r);
  }
  return n;
}
c(Cd, "fallbackMerge");
function mh(t, e) {
  var n, i;
  return (n = foundry == null ? void 0 : foundry.utils) != null && n.mergeObject && ((i = foundry == null ? void 0 : foundry.utils) != null && i.deepClone) ? foundry.utils.mergeObject(t, foundry.utils.deepClone(e), {
    inplace: !1
  }) : Cd(t, e);
}
c(mh, "defaultMerge");
function hh(t, e) {
  if (!t) return !0;
  for (const n of Object.keys(t))
    if (t[n] !== e[n]) return !1;
  return !0;
}
c(hh, "criteriaMatch");
function Td(t, e, n, i) {
  const r = i ?? mh;
  let a = r({}, t ?? {});
  if (!(e != null && e.length)) return a;
  const o = [];
  for (let s = 0; s < e.length; s += 1) {
    const l = e[s];
    if (hh(l == null ? void 0 : l.criteria, n)) {
      const u = l != null && l.criteria ? Object.keys(l.criteria).length : 0;
      o.push({ specificity: u, index: s, delta: l == null ? void 0 : l.delta });
    }
  }
  o.sort((s, l) => s.specificity - l.specificity || s.index - l.index);
  for (const s of o)
    s.delta && (a = r(a, s.delta));
  return a;
}
c(Td, "resolveRules");
function Vo(t = null) {
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
c(Vo, "canManageCriteria");
function gh(t = null) {
  if (!Vo(t))
    throw new Error(`${ie} | You do not have permission to manage scene criteria.`);
}
c(gh, "requireCriteriaAccess");
const ph = /* @__PURE__ */ c((...t) => console.log(`${ie} | criteria tiles:`, ...t), "log$1");
let ja = /* @__PURE__ */ new WeakMap(), Ba = /* @__PURE__ */ new WeakMap();
const Vc = 200;
function yh(t) {
  return t ? Number.isInteger(t.size) ? t.size : Array.isArray(t) || typeof t.length == "number" ? t.length : Array.from(t).length : 0;
}
c(yh, "getCollectionSize$1");
function aa() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
c(aa, "nowMs$2");
function bh(t) {
  if (!Array.isArray(t)) return [];
  const e = /* @__PURE__ */ new Set();
  for (const n of t) {
    if (typeof n != "string") continue;
    const i = n.trim();
    i && e.add(i);
  }
  return Array.from(e);
}
c(bh, "uniqueStringKeys$1");
function vh(t, e = Vc) {
  if (!Array.isArray(t) || t.length === 0) return [];
  const n = Number.isInteger(e) && e > 0 ? e : Vc, i = [];
  for (let r = 0; r < t.length; r += n)
    i.push(t.slice(r, r + n));
  return i;
}
c(vh, "chunkArray$1");
async function wh(t, e, n) {
  const i = vh(e, n);
  for (const r of i)
    await t.updateEmbeddedDocuments("Tile", r), i.length > 1 && await Promise.resolve();
  return i.length;
}
c(wh, "updateTilesInChunks");
function Eh(t) {
  var i;
  const e = vi(t, { files: null });
  if (!((i = e == null ? void 0 : e.variants) != null && i.length)) return [];
  const n = /* @__PURE__ */ new Set();
  for (const r of e.variants)
    for (const a of Object.keys(r.criteria ?? {}))
      a && n.add(a);
  return Array.from(n);
}
c(Eh, "getTileCriteriaDependencyKeys");
function Sh(t, e) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
  for (const r of e) {
    const a = r.getFlag(ie, hi) ?? r.getFlag(ie, mi);
    if (a) {
      i.add(r.id);
      for (const o of Eh(a))
        n.has(o) || n.set(o, /* @__PURE__ */ new Set()), n.get(o).add(r.id);
    }
  }
  return {
    collection: e,
    keyToTileIds: n,
    allTileIds: i
  };
}
c(Sh, "buildTileDependencyIndex");
function Ch(t, e) {
  const n = Ba.get(t);
  if ((n == null ? void 0 : n.collection) === e) return n;
  const i = Sh(t, e);
  return Ba.set(t, i), i;
}
c(Ch, "getTileDependencyIndex");
function Th(t, e, n) {
  const i = bh(n);
  if (!i.length)
    return Array.from(e ?? []);
  const r = Ch(t, e), a = /* @__PURE__ */ new Set();
  for (const o of i) {
    const s = r.keyToTileIds.get(o);
    if (s)
      for (const l of s)
        a.add(l);
  }
  return a.size ? typeof (e == null ? void 0 : e.get) == "function" ? Array.from(a).map((o) => e.get(o)).filter(Boolean) : Array.from(e ?? []).filter((o) => a.has(o.id)) : [];
}
c(Th, "getTilesForChangedKeys");
function Ld(t) {
  return typeof (t == null ? void 0 : t.name) == "string" ? t.name : typeof (t == null ? void 0 : t.src) == "string" ? t.src : "";
}
c(Ld, "getFilePath");
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
function ac(t) {
  if (!Array.isArray(t)) return [];
  const e = /* @__PURE__ */ new Map();
  return t.map((n, i) => {
    const r = Ua(Ld(n)), a = r || `__index:${i}`, o = e.get(a) ?? 0;
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
c(ac, "buildTileFileEntries");
function Rn(t, e) {
  if (!Number.isInteger(e) || e < 0) return null;
  const i = ac(t).find((r) => r.index === e);
  return i ? { ...i.target } : { indexHint: e };
}
c(Rn, "createTileTargetFromIndex");
function Go(t) {
  if (!t || typeof t != "object") return null;
  const e = Ua(t.path), n = Number(t.indexHint ?? t.fileIndex), i = Number(t.occurrence), r = {};
  return e && (r.path = e, r.occurrence = Number.isInteger(i) && i >= 0 ? i : 0), Number.isInteger(n) && n >= 0 && (r.indexHint = n), !r.path && !Number.isInteger(r.indexHint) ? null : r;
}
c(Go, "normalizeTileTarget");
function Tr(t, e) {
  const n = Go(t);
  if (!n) return -1;
  const i = ac(e);
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
c(Tr, "resolveTileTargetIndex");
function Hn(t) {
  if (!t || typeof t != "object" || Array.isArray(t)) return {};
  const e = {};
  for (const [n, i] of Object.entries(t))
    typeof n != "string" || !n || typeof i != "string" || !i.trim() || (e[n] = i.trim());
  return e;
}
c(Hn, "sanitizeCriteria");
function Lh(t) {
  return Object.entries(Hn(t)).sort(([n], [i]) => n.localeCompare(i)).map(([n, i]) => `${n}=${i}`).join("");
}
c(Lh, "serializeCriteria");
function Ih(t) {
  return Object.keys(Hn(t)).length;
}
c(Ih, "getCriteriaSpecificity");
function Oh(t, e) {
  const n = Hn(t), i = Hn(e);
  for (const [r, a] of Object.entries(n))
    if (r in i && i[r] !== a)
      return !1;
  return !0;
}
c(Oh, "areCriteriaCompatible");
function Ah(t, e) {
  const n = Tr(t, e);
  if (Number.isInteger(n) && n >= 0)
    return `index:${n}`;
  const i = Go(t);
  if (!i) return "";
  if (i.path) {
    const r = Number.isInteger(i.occurrence) ? i.occurrence : 0;
    return `path:${i.path}#${r}`;
  }
  return Number.isInteger(i.indexHint) ? `hint:${i.indexHint}` : "";
}
c(Ah, "getTargetIdentity");
function Id(t, e = {}) {
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
    specificity: Ih(l.criteria),
    criteriaSignature: Lh(l.criteria),
    targetIdentity: Ah(l.target, n)
  })), a = [], o = [];
  for (let l = 0; l < r.length; l += 1) {
    const u = r[l];
    for (let d = l + 1; d < r.length; d += 1) {
      const h = r[d];
      if (u.specificity !== h.specificity || !Oh(u.criteria, h.criteria)) continue;
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
c(Id, "detectTileCriteriaConflicts");
function kh(t, e) {
  if (!t || typeof t != "object") return null;
  let n = Go(t.target);
  if (!n) {
    const i = Number(t.fileIndex);
    Number.isInteger(i) && i >= 0 && (n = Rn(e, i));
  }
  return n ? {
    criteria: Hn(t.criteria),
    target: n
  } : null;
}
c(kh, "normalizeTileVariant");
function Od(t, e = {}) {
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
c(Od, "buildTileCriteriaFromFileIndex");
function vi(t, e = {}) {
  const n = Array.isArray(e.files) ? e.files : null;
  if (Array.isArray(t))
    return Od(t, { files: n });
  if (!t || typeof t != "object") return null;
  const i = Array.isArray(t.variants) ? t.variants.map((a) => kh(a, n)).filter(Boolean) : [];
  if (!i.length) return null;
  let r = Go(t.defaultTarget);
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
function Mh(t, e) {
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
c(Mh, "selectTileFileIndexFromCompiled");
function Nh(t, e) {
  const n = vi(t, { files: e });
  if (!n) return null;
  const i = n.variants.map((a) => {
    const o = Hn(a.criteria), s = Tr(a.target, e);
    return !Number.isInteger(s) || s < 0 ? null : {
      criteria: o,
      keys: Object.keys(o),
      targetIndex: s
    };
  }).filter(Boolean), r = Tr(n.defaultTarget, e);
  return !i.length && (!Number.isInteger(r) || r < 0) ? null : {
    variants: i,
    defaultIndex: r
  };
}
c(Nh, "compileTileMatcher");
function $h(t, e, n) {
  const i = ja.get(t);
  if (i && i.tileCriteria === e && i.files === n)
    return i.compiled;
  const r = Nh(e, n);
  return ja.set(t, {
    tileCriteria: e,
    files: n,
    compiled: r
  }), r;
}
c($h, "getCompiledTileMatcher");
function xh(t = null, e = null) {
  t ? Ba.delete(t) : Ba = /* @__PURE__ */ new WeakMap(), e ? ja.delete(e) : t || (ja = /* @__PURE__ */ new WeakMap());
}
c(xh, "invalidateTileCriteriaCaches");
async function Ad(t, e, n = {}) {
  var l, u, d, h;
  const i = aa(), r = {
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
    return r.durationMs = aa() - i, r;
  const a = e.getEmbeddedCollection("Tile") ?? [];
  r.total = yh(a);
  const o = Th(e, a, n.changedKeys);
  if (r.scanned = o.length, !o.length)
    return r.skipped.unaffected = r.total, r.durationMs = aa() - i, r;
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
    const y = $h(f, g, p), v = Mh(y, t);
    if (!Number.isInteger(v) || v < 0 || v >= p.length) {
      console.warn(`${ie} | Tile ${f.id} has no valid file match for state`, t), r.skipped.noMatch += 1;
      continue;
    }
    const b = v + 1, C = Number(f.getFlag("monks-active-tiles", "fileindex")) !== b, L = p.some((D, P) => !!(D != null && D.selected) != (P === v)), A = Ua(((u = f.texture) == null ? void 0 : u.src) ?? ((h = (d = f._source) == null ? void 0 : d.texture) == null ? void 0 : h.src) ?? ""), O = Ld(p[v]), M = Ua(O), _ = !!M && M !== A;
    if (!L && !C && !_) {
      r.skipped.unchanged += 1;
      continue;
    }
    const j = {
      _id: f._id
    };
    L && (j["flags.monks-active-tiles.files"] = p.map((D, P) => ({
      ...D,
      selected: P === v
    }))), C && (j["flags.monks-active-tiles.fileindex"] = b), _ && (j.texture = { src: O }), s.push(j), ph(`Tile ${f.id} -> ${O}`);
  }
  return s.length > 0 && (r.chunks = await wh(e, s, n.chunkSize), r.updated = s.length), r.durationMs = aa() - i, r;
}
c(Ad, "updateTiles");
function _h() {
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
c(_h, "buildLightControlsMap");
const gi = T, qi = "lightCriteria", oc = Object.freeze({
  base: null,
  mappings: [],
  current: null
});
function hs(t) {
  return t && typeof t == "object" && !Array.isArray(t);
}
c(hs, "isPlainObject$1");
function kd(t, e) {
  if (!hs(e)) return {};
  const n = {};
  for (const [i, r] of Object.entries(e)) {
    const a = t == null ? void 0 : t[i];
    if (hs(r) && hs(a)) {
      const o = kd(a, r);
      Object.keys(o).length > 0 && (n[i] = o);
    } else r !== a && (n[i] = Gt(r));
  }
  return n;
}
c(kd, "computeDelta");
function Md(t) {
  var n;
  const e = ((n = t == null ? void 0 : t.getFlag) == null ? void 0 : n.call(t, gi, qi)) ?? oc;
  return Lr(e);
}
c(Md, "getLightCriteriaState");
async function Nd(t, e) {
  const n = Lr(e);
  if (!(t != null && t.setFlag))
    return n;
  const i = n.base !== null, r = n.mappings.length > 0, a = n.current !== null;
  return !i && !r && !a ? (typeof t.unsetFlag == "function" ? await t.unsetFlag(gi, qi) : await t.setFlag(gi, qi, null), oc) : (await t.setFlag(gi, qi, n), n);
}
c(Nd, "setLightCriteriaState");
async function Jr(t, e) {
  if (typeof e != "function")
    throw new TypeError("updateLightCriteriaState requires an updater function.");
  const n = Gt(Md(t)), i = await e(n);
  return Nd(t, i);
}
c(Jr, "updateLightCriteriaState");
async function Gc(t, e) {
  const n = wi(e);
  if (!n)
    throw new Error("Invalid light configuration payload.");
  return Jr(t, (i) => ({
    ...i,
    base: n
  }));
}
c(Gc, "storeBaseLighting");
async function zc(t, e, n, { label: i } = {}) {
  const r = Xr(e);
  if (!r)
    throw new Error("Cannot create a mapping without at least one category selection.");
  const a = wi(n);
  if (!a)
    throw new Error("Invalid light configuration payload.");
  return Jr(t, (o) => {
    const s = Zi(r), l = Array.isArray(o == null ? void 0 : o.mappings) ? [...o.mappings] : [], u = l.findIndex((g) => (g == null ? void 0 : g.key) === s), d = u >= 0 ? l[u] : null, h = typeof (d == null ? void 0 : d.id) == "string" && d.id.trim() ? d.id.trim() : xd(), f = zo({
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
c(zc, "upsertLightCriteriaMapping");
async function Fh(t, e, n, i, { replaceExisting: r = !1 } = {}) {
  const a = typeof e == "string" ? e.trim() : "";
  if (!a)
    throw new Error("A mapping id is required to retarget criteria.");
  const o = Xr(n);
  if (!o)
    throw new Error("Cannot retarget mapping without at least one category selection.");
  const s = wi(i);
  if (!s)
    throw new Error("Invalid light configuration payload.");
  return Jr(t, (l) => {
    const u = Array.isArray(l == null ? void 0 : l.mappings) ? [...l.mappings] : [], d = u.findIndex((b) => (b == null ? void 0 : b.id) === a);
    if (d < 0)
      throw new Error("The selected mapping no longer exists.");
    const h = Zi(o), f = u.findIndex(
      (b, w) => w !== d && (b == null ? void 0 : b.key) === h
    );
    if (f >= 0 && !r)
      throw new Error("A mapping already exists for the selected criteria.");
    const g = u[d], p = zo({
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
c(Fh, "retargetLightCriteriaMapping");
async function Dh(t, e) {
  const n = typeof e == "string" ? e.trim() : "";
  if (!n)
    throw new Error("A mapping id is required to remove a mapping.");
  return Jr(t, (i) => {
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
c(Dh, "removeLightCriteriaMapping");
async function gr(t, e) {
  const n = $d(e);
  return Jr(t, (i) => ({
    ...i,
    current: n
  }));
}
c(gr, "storeCurrentCriteriaSelection");
function Ph(t) {
  const e = Lr(t), n = e.base ?? {}, i = [];
  for (const r of e.mappings) {
    const a = Xr(r == null ? void 0 : r.categories);
    if (!a) continue;
    const o = kd(n, (r == null ? void 0 : r.config) ?? {});
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
c(Ph, "convertLightCriteriaStateToPresets");
function Rh(t, e = []) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
  for (const l of e)
    typeof (l == null ? void 0 : l.key) == "string" && l.key.trim() && i.add(l.key.trim()), typeof (l == null ? void 0 : l.id) == "string" && l.id.trim() && typeof (l == null ? void 0 : l.key) == "string" && n.set(l.id.trim(), l.key.trim());
  const r = Lr(t), a = /* @__PURE__ */ c((l) => {
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
    return u ? zo({
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
  return Lr({
    ...r,
    mappings: o,
    current: s
  });
}
c(Rh, "migrateLightCriteriaCategoriesToKeys");
function Lr(t) {
  var l;
  const e = Gt(t);
  if (!e || typeof e != "object")
    return Gt(oc);
  const n = wi(e.base), i = Array.isArray(e.mappings) ? e.mappings : [], r = /* @__PURE__ */ new Map();
  for (const u of i) {
    const d = zo(u);
    d && r.set(d.key, d);
  }
  const a = Array.from(r.values()), o = new Map(a.map((u) => [u.id, u]));
  let s = $d(e.current);
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
c(Lr, "sanitizeLightCriteriaState");
function wi(t) {
  const e = Gt(t);
  if (!e || typeof e != "object") return null;
  "_id" in e && delete e._id, "id" in e && delete e.id;
  const n = e.flags;
  if (n && typeof n == "object") {
    const i = n[gi];
    i && typeof i == "object" && (delete i[qi], Object.keys(i).length === 0 && delete n[gi]), Object.keys(n).length === 0 && delete e.flags;
  }
  return e;
}
c(wi, "sanitizeLightConfigPayload");
function zo(t) {
  if (!t || typeof t != "object") return null;
  const e = Xr(t.categories);
  if (!e) return null;
  const n = wi(t.config);
  if (!n) return null;
  const i = typeof t.id == "string" && t.id.trim() ? t.id.trim() : xd(), r = Zi(e), a = {
    id: i,
    key: r,
    categories: e,
    config: n,
    updatedAt: Number.isFinite(t.updatedAt) ? Number(t.updatedAt) : Date.now()
  };
  return typeof t.label == "string" && t.label.trim() && (a.label = t.label.trim()), a;
}
c(zo, "sanitizeCriteriaMappingEntry");
function $d(t) {
  if (!t || typeof t != "object") return null;
  const e = typeof t.mappingId == "string" && t.mappingId.trim() ? t.mappingId.trim() : null, n = Xr(t.categories);
  return !e && !n ? null : {
    mappingId: e,
    categories: n,
    updatedAt: Number.isFinite(t.updatedAt) ? Number(t.updatedAt) : Date.now()
  };
}
c($d, "sanitizeCurrentSelection");
function Xr(t) {
  const e = {};
  if (Array.isArray(t))
    for (const n of t) {
      const i = Wc((n == null ? void 0 : n.id) ?? (n == null ? void 0 : n.categoryId) ?? (n == null ? void 0 : n.category)), r = Yc((n == null ? void 0 : n.value) ?? (n == null ? void 0 : n.selection) ?? (n == null ? void 0 : n.label));
      !i || !r || (e[i] = r);
    }
  else if (t && typeof t == "object")
    for (const [n, i] of Object.entries(t)) {
      const r = Wc(n), a = Yc(i);
      !r || !a || (e[r] = a);
    }
  return Object.keys(e).length > 0 ? e : null;
}
c(Xr, "sanitizeCriteriaCategories");
function Zi(t) {
  if (!t || typeof t != "object") return "";
  const e = Object.entries(t).filter(([, n]) => typeof n == "string" && n).map(([n, i]) => `${n}:${i}`);
  return e.sort((n, i) => n < i ? -1 : n > i ? 1 : 0), e.join("|");
}
c(Zi, "computeCriteriaMappingKey");
function xd() {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
c(xd, "generateLightMappingId");
function Wc(t) {
  if (typeof t != "string") return null;
  const e = t.trim();
  return e || null;
}
c(Wc, "normalizeCategoryId");
function Yc(t) {
  if (typeof t != "string") return null;
  const e = t.trim();
  return e || null;
}
c(Yc, "normalizeCategoryValue");
const Va = ["AmbientLight", "Wall", "AmbientSound"];
let Ga = /* @__PURE__ */ new WeakMap(), za = /* @__PURE__ */ new WeakMap();
const Kc = 200;
function Hh(t) {
  return t ? Number.isInteger(t.size) ? t.size : Array.isArray(t) || typeof t.length == "number" ? t.length : Array.from(t).length : 0;
}
c(Hh, "getCollectionSize");
function gs() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
c(gs, "nowMs$1");
function qh(t) {
  if (!Array.isArray(t)) return [];
  const e = /* @__PURE__ */ new Set();
  for (const n of t) {
    if (typeof n != "string") continue;
    const i = n.trim();
    i && e.add(i);
  }
  return Array.from(e);
}
c(qh, "uniqueStringKeys");
function jh(t, e = Kc) {
  if (!Array.isArray(t) || t.length === 0) return [];
  const n = Number.isInteger(e) && e > 0 ? e : Kc, i = [];
  for (let r = 0; r < t.length; r += n)
    i.push(t.slice(r, r + n));
  return i;
}
c(jh, "chunkArray");
async function Bh(t, e, n, i) {
  const r = jh(n, i);
  for (const a of r)
    await t.updateEmbeddedDocuments(e, a), r.length > 1 && await Promise.resolve();
  return r.length;
}
c(Bh, "updatePlaceablesInChunks");
function Uh(t) {
  const e = /* @__PURE__ */ new Set();
  for (const n of (t == null ? void 0 : t.rules) ?? [])
    for (const i of Object.keys((n == null ? void 0 : n.criteria) ?? {}))
      i && e.add(i);
  return Array.from(e);
}
c(Uh, "getPresetDependencyKeys");
function Vh(t, e) {
  const n = /* @__PURE__ */ new Map();
  for (const i of Va) {
    const r = e.get(i) ?? [], a = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Map();
    for (const s of r) {
      const l = Fd(s, i);
      if (l != null && l.base) {
        a.add(s.id);
        for (const u of Uh(l))
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
c(Vh, "buildPlaceableDependencyIndex");
function Gh(t, e) {
  const n = za.get(t);
  if (n && Va.every((r) => n.collectionsByType.get(r) === e.get(r)))
    return n;
  const i = Vh(t, e);
  return za.set(t, i), i;
}
c(Gh, "getPlaceableDependencyIndex");
function zh(t, e, n) {
  if (!e || !t) return [];
  const i = qh(n);
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
c(zh, "getDocsForChangedKeys");
function xi(t) {
  return !!t && typeof t == "object" && !Array.isArray(t);
}
c(xi, "isPlainObject");
function ll(t, e) {
  if (Object.is(t, e)) return !0;
  if (Array.isArray(t) || Array.isArray(e)) {
    if (!Array.isArray(t) || !Array.isArray(e) || t.length !== e.length) return !1;
    for (let n = 0; n < t.length; n += 1)
      if (!ll(t[n], e[n])) return !1;
    return !0;
  }
  if (xi(t) || xi(e)) {
    if (!xi(t) || !xi(e)) return !1;
    const n = Object.keys(e);
    for (const i of n)
      if (!ll(t[i], e[i])) return !1;
    return !0;
  }
  return !1;
}
c(ll, "areValuesEqual");
function _d(t, e) {
  const n = { _id: e._id };
  for (const [r, a] of Object.entries(e)) {
    if (r === "_id") continue;
    const o = t == null ? void 0 : t[r];
    if (xi(a) && xi(o)) {
      const s = _d(o, { _id: e._id, ...a });
      if (!s) continue;
      const l = Object.keys(s).filter((u) => u !== "_id");
      if (l.length > 0) {
        n[r] = {};
        for (const u of l)
          n[r][u] = s[u];
      }
      continue;
    }
    ll(o, a) || (n[r] = a);
  }
  return Object.keys(n).filter((r) => r !== "_id").length > 0 ? n : null;
}
c(_d, "buildChangedPayload");
function Fd(t, e) {
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
    const l = Ph(n.lightCriteria);
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
c(Fd, "getPresetsForDocument");
function Wh(t = null, e = null) {
  t ? za.delete(t) : za = /* @__PURE__ */ new WeakMap(), e ? Ga.delete(e) : t || (Ga = /* @__PURE__ */ new WeakMap());
}
c(Wh, "invalidatePlaceableCriteriaCaches");
async function Dd(t, e, n = {}) {
  var l, u;
  const i = gs(), r = {
    total: 0,
    scanned: 0,
    updated: 0,
    chunks: 0,
    byType: {},
    durationMs: 0
  };
  if (e = e ?? ((l = game.scenes) == null ? void 0 : l.viewed), !e)
    return r.durationMs = gs() - i, r;
  const a = new Set(_h()), o = new Map(
    Va.map((d) => [d, e.getEmbeddedCollection(d) ?? []])
  ), s = Gh(e, o);
  for (const d of Va) {
    const h = o.get(d) ?? [], f = {
      total: Hh(h),
      scanned: 0,
      updated: 0,
      chunks: 0
    }, g = s.byType.get(d) ?? null, p = zh(h, g, n.changedKeys);
    if (f.scanned = p.length, r.total += f.total, r.scanned += f.scanned, r.byType[d] = f, !p.length) continue;
    const y = [];
    for (const v of p) {
      const b = Fd(v, d);
      if (!(b != null && b.base)) continue;
      const w = Td(b.base, b.rules ?? [], t);
      w._id = v._id, d === "AmbientLight" && a.has(v._id) && (w.hidden = !0);
      const C = (v == null ? void 0 : v._source) ?? ((u = v == null ? void 0 : v.toObject) == null ? void 0 : u.call(v)) ?? {}, L = _d(C, w);
      L && y.push(L);
    }
    y.length > 0 && (f.chunks = await Bh(e, d, y, n.chunkSize), f.updated = y.length, r.updated += y.length, r.chunks += f.chunks, console.log(`${ie} | Updated ${y.length} ${d}(s)`));
  }
  return r.durationMs = gs() - i, r;
}
c(Dd, "updatePlaceables");
function Wa() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
c(Wa, "nowMs");
const oa = /* @__PURE__ */ new Map();
function Yh(t) {
  var e;
  return t = t ?? ((e = game.scenes) == null ? void 0 : e.viewed), t ? Kr(t) : null;
}
c(Yh, "getState");
async function Kh(t, e, n = 0) {
  var g;
  const i = Wa();
  if (e = e ?? ((g = game.scenes) == null ? void 0 : g.viewed), !e) return null;
  gh(e);
  const r = gt(e);
  if (!r.length)
    return console.warn(`${ie} | applyState skipped: scene has no criteria.`), null;
  const a = Kr(e, r), o = ic({ ...a, ...t ?? {} }, r), s = r.filter((p) => (a == null ? void 0 : a[p.key]) !== (o == null ? void 0 : o[p.key])).map((p) => p.key), l = s.length > 0;
  l && await Zm(e, o, r);
  const u = l ? o : a, [d, h] = await Promise.all([
    Ad(u, e, { changedKeys: s }),
    Dd(u, e, { changedKeys: s })
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
c(Kh, "applyStateInternal");
async function Pd(t, e) {
  var l;
  if (e = e ?? ((l = game.scenes) == null ? void 0 : l.viewed), !e) return null;
  const n = e.id ?? "__viewed__", i = Wa(), r = oa.get(n) ?? Promise.resolve();
  let a = null;
  const o = r.catch(() => null).then(async () => {
    const u = Wa() - i;
    return Kh(t, e, u);
  });
  a = o;
  const s = o.finally(() => {
    oa.get(n) === s && oa.delete(n);
  });
  return oa.set(n, s), a;
}
c(Pd, "applyState$1");
function Jh(t) {
  var e;
  return t = t ?? ((e = game.scenes) == null ? void 0 : e.viewed), t ? Sd(t) : null;
}
c(Jh, "getVersion");
async function Rd(t, e) {
  var n;
  e = e ?? ((n = game.scenes) == null ? void 0 : n.viewed), e != null && e.setFlag && await e.setFlag(ie, wd, Number(t));
}
c(Rd, "setVersion");
async function Xh(t) {
  return Rd(Ed, t);
}
c(Xh, "markCurrentVersion");
const ur = "Standard", Qh = /* @__PURE__ */ c((...t) => console.log(`${ie} | criteria indexer:`, ...t), "log");
function sc(t) {
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
c(sc, "parseFileTags");
function Zh(t, e, n = ur) {
  return t != null && t.length ? t.map((i) => {
    const r = sc(i == null ? void 0 : i.name);
    if (!r) return {};
    const a = {};
    for (const [o, s] of Object.entries(e)) {
      const l = r[Number(o)];
      l != null && l !== n && (a[s] = l);
    }
    return a;
  }) : [];
}
c(Zh, "buildFileIndex");
function eg(t, e) {
  return t.map((n, i) => {
    const r = [...e[n] ?? /* @__PURE__ */ new Set()].sort(), o = r.includes(ur) ? ur : r[0] ?? ur, s = nc(n);
    return s.key = n, s.label = n.charAt(0).toUpperCase() + n.slice(1), s.values = r.length ? r : [ur], s.default = s.values.includes(o) ? o : s.values[0], s.order = i, s;
  });
}
c(eg, "buildCriteriaDefinitions");
async function sa(t, e, n, { dryRun: i = !1 } = {}) {
  const r = t.getFlag("monks-active-tiles", "files");
  if (!(r != null && r.length)) return null;
  const a = Zh(r, e), o = Od(a, { files: r });
  for (const s of r) {
    const l = sc(s == null ? void 0 : s.name);
    if (l)
      for (const [u, d] of Object.entries(e)) {
        const h = l[Number(u)];
        h != null && n[d] && n[d].add(h);
      }
  }
  return i || (await t.setFlag(ie, hi, o), typeof t.unsetFlag == "function" && await t.unsetFlag(ie, mi)), { files: r.length };
}
c(sa, "indexTile");
async function tg(t, e = {}) {
  var w, C, L, A;
  const {
    dryRun: n = !1,
    force: i = !1
  } = e;
  if (t = t ?? ((w = game.scenes) == null ? void 0 : w.viewed), !t) throw new Error("No scene provided to indexScene.");
  if (!globalThis.Tagger) throw new Error("Tagger is required to index scene criteria.");
  if (!i && Sd(t) >= Ed)
    throw new Error(
      `Scene "${t.name}" is already criteria-indexed. Use force: true to re-index.`
    );
  const r = { sceneId: t.id }, a = Tagger.getByTag("Map", r) ?? [];
  if (!a.length) throw new Error("No Map tile found.");
  if (a.length > 1) throw new Error(`Expected 1 Map tile, found ${a.length}.`);
  const o = a[0], s = o.getFlag("monks-active-tiles", "files");
  if (!(s != null && s.length)) throw new Error("Map tile has no MATT files.");
  const l = sc((C = s[0]) == null ? void 0 : C.name);
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
  const v = {
    map: null,
    floor: [],
    roof: [],
    weather: []
  };
  v.map = await sa(o, f, y, { dryRun: n });
  for (const O of u) {
    const M = await sa(O, f, y, { dryRun: n });
    M && v.floor.push(M);
  }
  for (const O of d) {
    const M = await sa(O, f, y, { dryRun: n });
    M && v.roof.push(M);
  }
  for (const O of h) {
    const M = await sa(O, p, y, { dryRun: n });
    M && v.weather.push(M);
  }
  const b = eg(g, y);
  return n || (await Uo(t, b), await Xh(t)), Qh(
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
c(tg, "indexScene");
var Mu, qe, dt, ft, oi, Qe, Ht, Sn, Do, ce, Hd, qd, jd, ul, Bd, dl, Ud, dr, fl;
const wt = class wt extends Un(Bn) {
  constructor(n = {}) {
    var i;
    super(n);
    k(this, ce);
    k(this, qe, null);
    k(this, dt, []);
    k(this, ft, {});
    k(this, oi, !1);
    k(this, Qe, null);
    k(this, Ht, null);
    k(this, Sn, null);
    k(this, Do, 120);
    this.setScene(n.scene ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null);
  }
  setScene(n) {
    var i;
    I(this, qe, n ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null), S(this, ce, Hd).call(this);
  }
  get scene() {
    return m(this, qe);
  }
  async _prepareContext() {
    var r;
    const n = !!m(this, qe), i = n && m(this, dt).length > 0;
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
      criteria: m(this, dt).map((a) => ({
        key: a.key,
        label: a.label || a.key,
        values: a.values.map((o) => {
          var s;
          return {
            value: o,
            selected: ((s = m(this, ft)) == null ? void 0 : s[a.key]) === o
          };
        }),
        defaultValue: a.default
      })),
      stateSummary: S(this, ce, fl).call(this)
    };
  }
  _onRender(n, i) {
    super._onRender(n, i), S(this, ce, qd).call(this), S(this, ce, jd).call(this);
  }
  async _onClose(n) {
    return m(this, Qe) !== null && (clearTimeout(m(this, Qe)), I(this, Qe, null)), m(this, Sn) !== null && (Hooks.off("eidolon-utilities.criteriaStateApplied", m(this, Sn)), I(this, Sn, null)), super._onClose(n);
  }
};
qe = new WeakMap(), dt = new WeakMap(), ft = new WeakMap(), oi = new WeakMap(), Qe = new WeakMap(), Ht = new WeakMap(), Sn = new WeakMap(), Do = new WeakMap(), ce = new WeakSet(), Hd = /* @__PURE__ */ c(function() {
  if (!m(this, qe)) {
    I(this, dt, []), I(this, ft, {});
    return;
  }
  I(this, dt, gt(m(this, qe)).sort((n, i) => n.order - i.order)), I(this, ft, Kr(m(this, qe), m(this, dt)));
}, "#hydrateFromScene"), qd = /* @__PURE__ */ c(function() {
  var i, r;
  const n = this.element;
  n instanceof HTMLElement && (n.querySelectorAll("[data-criteria-key]").forEach((a) => {
    a.addEventListener("change", (o) => {
      const s = o.currentTarget;
      if (!(s instanceof HTMLSelectElement)) return;
      const l = s.dataset.criteriaKey;
      l && (I(this, ft, {
        ...m(this, ft),
        [l]: s.value
      }), S(this, ce, Bd).call(this, { [l]: s.value }));
    });
  }), (i = n.querySelector("[data-action='reset-defaults']")) == null || i.addEventListener("click", () => {
    S(this, ce, Ud).call(this);
  }), (r = n.querySelector("[data-action='close-switcher']")) == null || r.addEventListener("click", () => {
    this.close();
  }));
}, "#bindEvents"), jd = /* @__PURE__ */ c(function() {
  m(this, Sn) === null && I(this, Sn, Hooks.on("eidolon-utilities.criteriaStateApplied", (n, i) => {
    !m(this, qe) || (n == null ? void 0 : n.id) !== m(this, qe).id || m(this, oi) || (I(this, ft, { ...i ?? {} }), this.render({ force: !0 }));
  }));
}, "#ensureSyncHook"), ul = /* @__PURE__ */ c(async function(n) {
  var i, r;
  if (m(this, qe)) {
    S(this, ce, dr).call(this, "applying"), I(this, oi, !0);
    try {
      const a = await Pd(n, m(this, qe));
      a && I(this, ft, a), S(this, ce, dr).call(this, "ready"), this.render({ force: !0 });
    } catch (a) {
      console.error(`${ie} | Failed to apply criteria state`, a), (r = (i = ui.notifications) == null ? void 0 : i.error) == null || r.call(
        i,
        E(
          "EIDOLON.CriteriaSwitcher.ApplyError",
          "Failed to apply the selected criteria state."
        )
      ), S(this, ce, dr).call(this, "error", (a == null ? void 0 : a.message) ?? "Unknown error");
    } finally {
      I(this, oi, !1), m(this, Ht) && S(this, ce, dl).call(this);
    }
  }
}, "#applyPartialState"), Bd = /* @__PURE__ */ c(function(n) {
  I(this, Ht, {
    ...m(this, Ht) ?? {},
    ...n ?? {}
  }), m(this, Qe) !== null && clearTimeout(m(this, Qe)), S(this, ce, dr).call(this, "applying"), I(this, Qe, setTimeout(() => {
    I(this, Qe, null), S(this, ce, dl).call(this);
  }, m(this, Do)));
}, "#queuePartialState"), dl = /* @__PURE__ */ c(async function() {
  if (m(this, oi) || !m(this, Ht)) return;
  const n = m(this, Ht);
  I(this, Ht, null), await S(this, ce, ul).call(this, n);
}, "#flushPendingState"), Ud = /* @__PURE__ */ c(async function() {
  if (!m(this, dt).length) return;
  const n = m(this, dt).reduce((i, r) => (i[r.key] = r.default, i), {});
  I(this, ft, n), m(this, Qe) !== null && (clearTimeout(m(this, Qe)), I(this, Qe, null)), I(this, Ht, null), await S(this, ce, ul).call(this, n);
}, "#resetToDefaults"), dr = /* @__PURE__ */ c(function(n, i = "") {
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
        a.textContent = `${E("EIDOLON.CriteriaSwitcher.Ready", "Ready")}: ${S(this, ce, fl).call(this)}`;
        break;
    }
}, "#setStatus"), fl = /* @__PURE__ */ c(function() {
  return m(this, dt).length ? `[${m(this, dt).map((n) => {
    var i;
    return ((i = m(this, ft)) == null ? void 0 : i[n.key]) ?? n.default;
  }).join(" | ")}]` : "-";
}, "#formatStateSummary"), c(wt, "CriteriaSwitcherApplication"), ye(wt, "APP_ID", `${ie}-criteria-switcher`), ye(wt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Re(wt, wt, "DEFAULT_OPTIONS"),
  {
    id: wt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Mu = Re(wt, wt, "DEFAULT_OPTIONS")) == null ? void 0 : Mu.classes) ?? [], "eidolon-criteria-switcher-window", "themed"])
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
)), ye(wt, "PARTS", {
  content: {
    template: `modules/${ie}/templates/criteria-switcher.html`
  }
});
let cl = wt;
const ng = jo(cl);
let pi = null;
function ig(t) {
  var e;
  return t ?? ((e = game.scenes) == null ? void 0 : e.viewed) ?? null;
}
c(ig, "resolveScene");
function rg(t) {
  var e;
  return !!(t != null && t.rendered && ((e = t == null ? void 0 : t.element) != null && e.isConnected));
}
c(rg, "isRendered");
function Wo() {
  return rg(pi) ? pi : (pi = null, null);
}
c(Wo, "getCriteriaSwitcher");
function Vd(t) {
  var i, r, a, o, s;
  const e = ig(t);
  if (!e)
    return (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "No active scene to open the criteria switcher."), null;
  if (!Vo(e))
    return (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, "You do not have permission to manage scene criteria."), null;
  const n = Wo();
  return n ? (n.setScene(e), n.render({ force: !0 }), (s = n.bringToFront) == null || s.call(n), n) : (pi = ng({ scene: e }), pi.render({ force: !0 }), pi);
}
c(Vd, "openCriteriaSwitcher");
function Gd() {
  const t = Wo();
  t && (t.close(), pi = null);
}
c(Gd, "closeCriteriaSwitcher");
function lc(t) {
  return Wo() ? (Gd(), null) : Vd(t);
}
c(lc, "toggleCriteriaSwitcher");
const ag = {
  SCHEMA_VERSION: rc,
  applyState: Pd,
  getState: Yh,
  getVersion: Jh,
  setVersion: Rd,
  getCriteria(t) {
    var e;
    return gt(t ?? ((e = game.scenes) == null ? void 0 : e.viewed));
  },
  setCriteria(t, e) {
    var n;
    return Uo(e ?? ((n = game.scenes) == null ? void 0 : n.viewed), t);
  },
  updateTiles: Ad,
  updatePlaceables: Dd,
  indexScene: tg,
  openCriteriaSwitcher: Vd,
  closeCriteriaSwitcher: Gd,
  toggleCriteriaSwitcher: lc,
  findBestMatch: uh,
  findFileIndex: dh,
  resolveRules: Td
};
function og(t) {
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
c(og, "findTabNav");
function sg(t, e) {
  var i, r, a;
  return t instanceof HTMLElement ? [
    (i = t.querySelector(".tab[data-tab]")) == null ? void 0 : i.parentElement,
    t.querySelector(".sheet-body"),
    (a = (r = e == null ? void 0 : e.parentElement) == null ? void 0 : r.querySelector) == null ? void 0 : a.call(r, ":scope > .sheet-body"),
    e == null ? void 0 : e.parentElement
  ].find((o) => o instanceof HTMLElement) ?? null : null;
}
c(sg, "findTabBody");
function lg(t, e) {
  var n, i, r, a, o, s, l;
  return ((n = t == null ? void 0 : t.dataset) == null ? void 0 : n.group) ?? ((a = (r = (i = t == null ? void 0 : t.querySelector) == null ? void 0 : i.call(t, "[data-group]")) == null ? void 0 : r.dataset) == null ? void 0 : a.group) ?? ((l = (s = (o = e == null ? void 0 : e.querySelector) == null ? void 0 : o.call(e, ".tab[data-group]")) == null ? void 0 : s.dataset) == null ? void 0 : l.group) ?? "main";
}
c(lg, "getTabGroup");
function cg(t, e, n) {
  if (!(t instanceof HTMLElement)) return;
  t.textContent = "";
  const i = document.createElement("i");
  i.className = n, i.setAttribute("inert", ""), t.append(i, " ");
  const r = document.createElement("span");
  r.textContent = e, t.append(r);
}
c(cg, "setTabButtonContent");
function ug(t, e, n) {
  const i = t.querySelector("[data-tab]"), r = (i == null ? void 0 : i.tagName) || "A", a = document.createElement(r);
  return i instanceof HTMLElement && (a.className = i.className), a.classList.remove("active"), r === "BUTTON" && (a.type = "button"), a.dataset.action = "tab", a.dataset.tab = n, a.dataset.group = e, a.setAttribute("aria-selected", "false"), a.setAttribute("aria-pressed", "false"), a;
}
c(ug, "createTabButton");
function dg(t, e, n) {
  const i = document.createElement("div");
  i.classList.add("tab"), i.dataset.tab = n, i.dataset.group = e, i.dataset.applicationPart = n, i.setAttribute("hidden", "true");
  const r = dd(t);
  return t.insertBefore(i, r ?? null), i;
}
c(dg, "createTabPanel");
function ps(t, e, n, i, r) {
  var s;
  if (!(i instanceof HTMLElement) || !(r instanceof HTMLElement)) return;
  const a = (s = t == null ? void 0 : t.tabGroups) == null ? void 0 : s[e];
  if (typeof a == "string" ? a === n : i.classList.contains("active") || r.classList.contains("active")) {
    i.classList.add("active"), i.setAttribute("aria-selected", "true"), i.setAttribute("aria-pressed", "true"), r.classList.add("active"), r.removeAttribute("hidden"), r.removeAttribute("aria-hidden");
    return;
  }
  i.classList.remove("active"), i.setAttribute("aria-selected", "false"), i.setAttribute("aria-pressed", "false"), r.classList.remove("active"), r.setAttribute("hidden", "true");
}
c(ps, "syncTabVisibility");
function zd(t, e, n, i, r) {
  const a = og(e), o = sg(e, a);
  if (!(a instanceof HTMLElement) || !(o instanceof HTMLElement)) return null;
  const s = lg(a, o);
  let l = a.querySelector(`[data-tab="${n}"]`);
  l instanceof HTMLElement || (l = ug(a, s, n), a.appendChild(l)), cg(l, i, r);
  let u = o.querySelector(`.tab[data-tab="${n}"]`);
  u instanceof HTMLElement || (u = dg(o, s, n));
  const d = `data-eidolon-bound-${n}`;
  return l.hasAttribute(d) || (l.addEventListener("click", () => {
    cd(t, n, s), requestAnimationFrame(() => {
      ps(t, s, n, l, u);
    });
  }), l.setAttribute(d, "true")), ps(t, s, n, l, u), requestAnimationFrame(() => {
    ps(t, s, n, l, u);
  }), fg(t, a), u;
}
c(zd, "ensureTileConfigTab");
function fg(t, e) {
  !(t != null && t.setPosition) || !(e instanceof HTMLElement) || requestAnimationFrame(() => {
    var a;
    if (e.scrollWidth <= e.clientWidth) return;
    const n = e.scrollWidth - e.clientWidth, i = t.element instanceof HTMLElement ? t.element : (a = t.element) == null ? void 0 : a[0];
    if (!i) return;
    const r = i.offsetWidth || 480;
    t.setPosition({ width: r + n + 16 });
  });
}
c(fg, "fitNavWidth");
function Wd(t) {
  var e;
  return ((e = t == null ? void 0 : t.getFlag) == null ? void 0 : e.call(t, "monks-active-tiles", "files")) ?? [];
}
c(Wd, "getTileFiles$1");
function mg(t = []) {
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
c(mg, "createDefaultTileCriteria");
function hg(t, e = {}) {
  var o, s;
  const { allowLegacy: n = !0 } = e, i = Wd(t), r = (o = t == null ? void 0 : t.getFlag) == null ? void 0 : o.call(t, ie, hi);
  if (r) return vi(r, { files: i });
  if (!n) return null;
  const a = (s = t == null ? void 0 : t.getFlag) == null ? void 0 : s.call(t, ie, mi);
  return a ? vi(a, { files: i }) : null;
}
c(hg, "getTileCriteria");
async function Jc(t, e, n = {}) {
  if (!(t != null && t.setFlag)) return null;
  const {
    strictValidation: i = !0
  } = n, r = Wd(t), a = vi(e, { files: r });
  if (!a)
    return typeof t.unsetFlag == "function" ? (await t.unsetFlag(ie, hi), await t.unsetFlag(ie, mi)) : (await t.setFlag(ie, hi, null), await t.setFlag(ie, mi, null)), null;
  if (i) {
    const o = Id(a, { files: r });
    if (o.errors.length > 0)
      throw new Error(
        `Tile criteria contains ${o.errors.length} conflicting rule pair(s). Resolve clashes before saving.`
      );
  }
  return await t.setFlag(ie, hi, a), typeof t.unsetFlag == "function" && await t.unsetFlag(ie, mi), a;
}
c(Jc, "setTileCriteria");
const ml = "__eidolon_any__", hl = "eidolon-tile-criteria", gg = "fa-solid fa-sliders", Yd = Symbol.for("eidolon.tileCriteriaUiState"), Yo = ["all", "unmapped", "mapped", "conflicts"];
function pg(t) {
  const e = t == null ? void 0 : t[Yd];
  return !e || typeof e != "object" ? {
    filterQuery: "",
    filterMode: "all",
    selectedFileIndex: null
  } : {
    filterQuery: typeof e.filterQuery == "string" ? e.filterQuery : "",
    filterMode: Yo.includes(e.filterMode) ? e.filterMode : "all",
    selectedFileIndex: Number.isInteger(e.selectedFileIndex) ? e.selectedFileIndex : null
  };
}
c(pg, "readUiState");
function yg(t, e) {
  if (!t || !e) return;
  typeof e.filterQuery == "string" && (t.filterQuery = e.filterQuery), Yo.includes(e.filterMode) && (t.filterMode = e.filterMode), Number.isInteger(e.selectedFileIndex) && t.fileEntries.some((i) => i.index === e.selectedFileIndex) && (t.selectedFileIndex = e.selectedFileIndex);
}
c(yg, "applyUiState");
function bg(t) {
  const e = t == null ? void 0 : t.app, n = t == null ? void 0 : t.state;
  !e || !n || (e[Yd] = {
    filterQuery: typeof n.filterQuery == "string" ? n.filterQuery : "",
    filterMode: Yo.includes(n.filterMode) ? n.filterMode : "all",
    selectedFileIndex: Number.isInteger(n.selectedFileIndex) ? n.selectedFileIndex : null
  });
}
c(bg, "persistUiState");
function vg(t) {
  const e = (t == null ? void 0 : t.object) ?? (t == null ? void 0 : t.document) ?? null;
  return !(e != null && e.isEmbedded) || e.documentName !== "Tile" ? null : e;
}
c(vg, "getTileDocument$1");
function wg(t) {
  var e;
  return ((e = t == null ? void 0 : t.getFlag) == null ? void 0 : e.call(t, "monks-active-tiles", "files")) ?? [];
}
c(wg, "getTileFiles");
function Eg(t, e) {
  var s;
  const n = (t == null ? void 0 : t.parent) ?? ((s = game.scenes) == null ? void 0 : s.viewed) ?? null, r = gt(n).sort((l, u) => l.order - u.order).map((l) => ({
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
c(Eg, "getCriteriaDefinitions");
function Sg(t) {
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
c(Sg, "buildTree");
function Cg(t, e) {
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
c(Cg, "collapseFolderBranch");
function Tg(t, e) {
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
c(Tg, "getRuleSummariesForFile");
function gl(t) {
  var g, p;
  const e = wg(t), n = ac(e), i = hg(t, { allowLegacy: !0 }) ?? mg(e), r = Eg(t, i), a = new Map(r.map((y) => [y.key, y.label])), o = new Map(
    n.map((y) => [
      y.index,
      y.path || y.label
    ])
  ), s = Tr(i.defaultTarget, e), l = ((g = n[0]) == null ? void 0 : g.index) ?? 0, u = s >= 0 ? s : l, d = new Map(n.map((y) => [y.index, []]));
  let h = 1;
  for (const y of i.variants ?? []) {
    const v = Tr(y.target, e);
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
c(gl, "buildEditorState");
function pl(t, e) {
  return t.rulesByFile.has(e) || t.rulesByFile.set(e, []), t.rulesByFile.get(e);
}
c(pl, "getRulesForFile");
function Lg(t) {
  return Object.fromEntries(
    Object.entries(t ?? {}).filter(([e, n]) => typeof e == "string" && e && typeof n == "string" && n.trim()).map(([e, n]) => [e, n.trim()])
  );
}
c(Lg, "sanitizeRuleCriteria");
function Kd(t) {
  const e = Rn(t.files, t.defaultIndex);
  if (!e) return null;
  const n = [], i = [];
  for (const [a, o] of t.rulesByFile.entries()) {
    const s = Rn(t.files, a);
    if (s)
      for (const [l, u] of o.entries()) {
        const d = Lg(u.criteria);
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
c(Kd, "buildTileCriteriaDraft");
function Ig(t) {
  var e;
  return ((e = Kd(t)) == null ? void 0 : e.normalized) ?? null;
}
c(Ig, "exportTileCriteria");
function Xc(t) {
  const e = Kd(t);
  if (!(e != null && e.normalized))
    return {
      errors: [],
      warnings: [],
      errorFileIndexes: [],
      warningFileIndexes: []
    };
  const n = Id(e.normalized, { files: t.files }), i = /* @__PURE__ */ c((s) => {
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
c(Xc, "analyzeRuleConflicts");
function la(t, e = "neutral") {
  const n = document.createElement("span");
  return n.classList.add("eidolon-tile-criteria__badge"), n.dataset.kind = e, n.textContent = t, n;
}
c(la, "createBadge");
function Og(t, e = {}) {
  const n = typeof t == "string" ? t : "", {
    maxLength: i = 42,
    headLength: r = 20,
    tailLength: a = 16
  } = e;
  if (!n || n.length <= i) return n;
  const o = n.slice(0, r).trimEnd(), s = n.slice(-a).trimStart();
  return `${o}...${s}`;
}
c(Og, "middleEllipsis");
function Ag(t) {
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
c(Ag, "createRegexFilter");
function kg(t, e) {
  const n = document.createElement("select");
  n.dataset.criteriaKey = t.key;
  const i = document.createElement("option");
  i.value = ml, i.textContent = "*", n.appendChild(i);
  const r = new Set(t.values ?? []);
  e && !r.has(e) && r.add(e);
  for (const a of r) {
    const o = document.createElement("option");
    o.value = a, o.textContent = a, n.appendChild(o);
  }
  return n.value = e ?? ml, n;
}
c(kg, "createCriterionSelect");
function Mg(t, e, n, i) {
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
    const h = kg(l, (s = t.criteria) == null ? void 0 : s[l.key]);
    h.addEventListener("change", () => {
      h.value === ml ? delete t.criteria[l.key] : t.criteria[l.key] = h.value, i();
    }), u.appendChild(h), a.appendChild(u);
  }
  r.appendChild(a);
  const o = document.createElement("button");
  return o.type = "button", o.classList.add("control", "ui-control", "eidolon-tile-criteria__rule-remove"), o.textContent = E("EIDOLON.TileCriteria.RemoveRule", "Remove"), o.addEventListener("click", () => {
    const u = pl(e, n).filter((d) => d.id !== t.id);
    e.rulesByFile.set(n, u), i();
  }), r.appendChild(o), r;
}
c(Mg, "renderRuleEditor");
const Ea = /* @__PURE__ */ new WeakMap();
function Jd(t) {
  return (t == null ? void 0 : t.app) ?? (t == null ? void 0 : t.tile) ?? null;
}
c(Jd, "getDialogOwner");
function Ng(t) {
  for (const e of t) {
    const n = zt(e);
    if (n) return n;
    const i = zt(e == null ? void 0 : e.element);
    if (i) return i;
  }
  return null;
}
c(Ng, "findDialogRoot$1");
function $g(t, e, n) {
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
  const g = pl(i, r.index);
  if (g.length)
    for (const y of g)
      f.appendChild(
        Mg(y, i, r.index, () => {
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
    pl(i, r.index).push({
      id: i.nextRuleId,
      criteria: {}
    }), i.nextRuleId += 1, We(t), n();
  }), a.appendChild(p), a;
}
c($g, "buildRuleEditorContent");
function xg(t, e) {
  var h, f, g;
  const n = Jd(t);
  if (!n) return;
  const i = Ea.get(n);
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
  Ea.set(n, r);
  const a = /* @__PURE__ */ c(() => {
    Ea.delete(n);
  }, "closeDialog"), o = /* @__PURE__ */ c(() => {
    r.host instanceof HTMLElement && r.host.replaceChildren(
      $g(r.controller, r.fileIndex, o)
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
        const y = Ng(p), v = (b = y == null ? void 0 : y.querySelector) == null ? void 0 : b.call(y, ".eidolon-tile-criteria-editor-host");
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
c(xg, "openRuleEditorDialog");
function Qc(t) {
  var i;
  const e = Jd(t);
  if (!e) return;
  const n = Ea.get(e);
  (i = n == null ? void 0 : n.refresh) == null || i.call(n);
}
c(Qc, "refreshOpenRuleEditor");
function yl(t, e) {
  return (t.rulesByFile.get(e) ?? []).length > 0;
}
c(yl, "hasRulesForFile");
function Xd(t, e) {
  var n, i;
  return ((n = t == null ? void 0 : t.errorFileIndexes) == null ? void 0 : n.includes(e)) || ((i = t == null ? void 0 : t.warningFileIndexes) == null ? void 0 : i.includes(e));
}
c(Xd, "hasConflictForFile");
function _g(t, e, n) {
  switch (t.filterMode) {
    case "unmapped":
      return !yl(t, e.index);
    case "mapped":
      return yl(t, e.index);
    case "conflicts":
      return Xd(n, e.index);
    case "all":
    default:
      return !0;
  }
}
c(_g, "matchesFilterMode");
function Fg(t, e) {
  let n = 0, i = 0, r = 0;
  for (const a of t.fileEntries)
    yl(t, a.index) ? n += 1 : i += 1, Xd(e, a.index) && (r += 1);
  return {
    all: t.fileEntries.length,
    mapped: n,
    unmapped: i,
    conflicts: r
  };
}
c(Fg, "getFilterModeCounts");
function Dg(t) {
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
c(Dg, "getFilterModeLabel");
function Qd(t, e, n, i, r) {
  var u, d;
  const a = [...t.folders.keys()].sort((h, f) => h.localeCompare(f));
  for (const h of a) {
    const f = Cg(h, t.folders.get(h)), g = document.createElement("li");
    g.classList.add("eidolon-tile-criteria__tree-branch");
    const p = document.createElement("div");
    p.classList.add("document", "folder", "update", "eidolon-tile-criteria__folder-row");
    const y = document.createElement("i");
    y.classList.add("fa-solid", "fa-folder-open"), p.appendChild(y);
    const v = document.createElement("span");
    v.classList.add("eidolon-tile-criteria__tree-folder-label"), v.textContent = f.label, v.title = f.label, p.appendChild(v), g.appendChild(p);
    const b = document.createElement("ul");
    b.classList.add("eidolon-tile-criteria__tree"), b.dataset.folder = f.label, Qd(f.node, e, n, i, b), b.childElementCount > 0 && g.appendChild(b), r.appendChild(g);
  }
  const o = [...t.files].sort((h, f) => h.name.localeCompare(f.name));
  if (!o.length) return;
  const s = document.createElement("li"), l = document.createElement("ul");
  l.classList.add("document-list", "eidolon-tile-criteria__document-list");
  for (const h of o) {
    const f = h.entry, g = f.index === e.selectedFileIndex, p = f.index === e.defaultIndex, y = Tg(e, f.index), v = document.createElement("li");
    v.classList.add("document", "update", "eidolon-tile-criteria__tree-file");
    const b = document.createElement("button");
    b.type = "button", b.classList.add("eidolon-tile-criteria__file-row");
    const w = (u = i == null ? void 0 : i.errorFileIndexes) == null ? void 0 : u.includes(f.index), C = (d = i == null ? void 0 : i.warningFileIndexes) == null ? void 0 : d.includes(f.index);
    w ? b.classList.add("has-conflict") : C && b.classList.add("has-warning");
    const L = e.relativePaths.get(f.index) || f.path || h.name, A = [L];
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
      e.selectedFileIndex = f.index, We(n), xg(n, f.index);
    });
    const O = document.createElement("span");
    O.classList.add("eidolon-tile-criteria__indicator"), O.dataset.kind = p ? "default" : y.length ? "mapped" : "unmapped", b.appendChild(O);
    const M = document.createElement("span");
    M.classList.add("eidolon-tile-criteria__file-content");
    const _ = document.createElement("span");
    _.classList.add("eidolon-tile-criteria__file-heading");
    const j = document.createElement("span");
    j.classList.add("eidolon-tile-criteria__file-title"), j.textContent = Og(h.name || f.label), j.title = L, _.appendChild(j);
    const D = la(`#${f.index + 1}`, "meta");
    D.classList.add("eidolon-tile-criteria__index-badge"), _.appendChild(D), M.appendChild(_);
    const P = document.createElement("span");
    P.classList.add("eidolon-tile-criteria__badges"), p && P.appendChild(la(E("EIDOLON.TileCriteria.DefaultBadge", "Default"), "default"));
    const $ = y.slice(0, 2);
    for (const R of $)
      P.appendChild(la(R, "rule"));
    if (y.length > $.length && P.appendChild(la(`+${y.length - $.length}`, "meta")), M.appendChild(P), b.appendChild(M), w || C) {
      const R = document.createElement("span");
      R.classList.add("eidolon-tile-criteria__row-warning"), R.dataset.mode = w ? "error" : "warning", R.innerHTML = '<i class="fa-solid fa-triangle-exclamation" inert=""></i>', b.appendChild(R);
    }
    v.appendChild(b), l.appendChild(v);
  }
  s.appendChild(l), r.appendChild(s);
}
c(Qd, "renderTreeNode");
function Pg(t, e, n, i = {}) {
  const r = document.createElement("section");
  r.classList.add("eidolon-tile-criteria__tree-panel");
  const a = Ag(t.filterQuery), o = Fg(t, n);
  t.filterMode !== "all" && o[t.filterMode] === 0 && (t.filterMode = "all");
  const s = document.createElement("div");
  s.classList.add("eidolon-tile-criteria__toolbar");
  const l = document.createElement("div");
  l.classList.add("eidolon-tile-criteria__mode-bar");
  for (const w of Yo) {
    const C = document.createElement("button");
    C.type = "button", C.classList.add("control", "ui-control", "eidolon-tile-criteria__mode-button"), C.dataset.mode = w, C.textContent = Dg(w);
    const L = w === "all" || o[w] > 0;
    C.disabled = !L, L || (C.dataset.tooltip = E(
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
    const C = d.selectionStart ?? d.value.length, L = d.selectionEnd ?? C;
    t.filterQuery = d.value, We(e), requestAnimationFrame(() => {
      const A = e.section.querySelector(".eidolon-tile-criteria__filter-input");
      if (A instanceof HTMLInputElement) {
        A.focus();
        try {
          A.setSelectionRange(C, L);
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
    return _g(t, w, n) && a.matches(C);
  });
  if (t.fileEntries.length)
    if (b.length) {
      const w = document.createElement("ul");
      w.classList.add("eidolon-tile-criteria__tree"), Qd(Sg(b), t, e, n, w), v.appendChild(w);
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
c(Pg, "renderTreePanel");
function We(t) {
  const { section: e, state: n } = t, i = Xc(n);
  bg(t), e.replaceChildren();
  const r = /* @__PURE__ */ c(async () => {
    try {
      const o = Xc(n);
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
      const s = Ig(n);
      if (!s) {
        n.status = {
          mode: "error",
          message: E("EIDOLON.TileCriteria.Invalid", "Invalid rules. Select valid target variants.")
        }, We(t);
        return;
      }
      await Jc(t.tile, s);
      const l = n.filterQuery, u = n.filterMode, d = n.selectedFileIndex;
      t.state = gl(t.tile), t.state.filterQuery = l, t.state.filterMode = u, Number.isInteger(d) && (t.state.selectedFileIndex = d), t.state.status = {
        mode: "ready",
        message: E("EIDOLON.TileCriteria.Saved", "Tile criteria rules saved.")
      }, We(t), Qc(t);
    } catch (o) {
      console.error(`${ie} | Failed to save tile criteria`, o), n.status = {
        mode: "error",
        message: (o == null ? void 0 : o.message) ?? "Failed to save tile criteria rules."
      }, We(t);
    }
  }, "handleSave"), a = /* @__PURE__ */ c(async () => {
    try {
      await Jc(t.tile, null);
      const o = n.filterQuery, s = n.filterMode, l = n.selectedFileIndex;
      t.state = gl(t.tile), t.state.filterQuery = o, t.state.filterMode = s, Number.isInteger(l) && (t.state.selectedFileIndex = l), t.state.status = {
        mode: "ready",
        message: E("EIDOLON.TileCriteria.Cleared", "Tile criteria rules cleared.")
      }, We(t), Qc(t);
    } catch (o) {
      console.error(`${ie} | Failed to clear tile criteria`, o), n.status = {
        mode: "error",
        message: (o == null ? void 0 : o.message) ?? "Failed to clear tile criteria rules."
      }, We(t);
    }
  }, "handleClear");
  if (e.appendChild(Pg(n, t, i, {
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
function Rg(t, e = null) {
  const n = document.createElement("section");
  n.classList.add("eidolon-tile-criteria");
  const i = gl(t);
  yg(i, pg(e));
  const r = {
    app: e,
    tile: t,
    section: n,
    state: i
  };
  return We(r), r;
}
c(Rg, "createController");
function Hg(t, e) {
  return zd(
    t,
    e,
    hl,
    E("EIDOLON.TileCriteria.TabLabel", "Criteria"),
    gg
  );
}
c(Hg, "ensureTileCriteriaTab");
function qg() {
  Hooks.on("renderTileConfig", (t, e) => {
    var l, u, d, h;
    const n = zt(e);
    if (!n) return;
    const i = vg(t);
    if (!i) return;
    if ((l = n.querySelector(".eidolon-tile-criteria")) == null || l.remove(), !Bo()) {
      (u = n.querySelector(`.item[data-tab='${hl}']`)) == null || u.remove(), (d = n.querySelector(`.tab[data-tab='${hl}']`)) == null || d.remove();
      return;
    }
    const r = Rg(i, t), a = Hg(t, n);
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
c(qg, "registerTileCriteriaConfigControls");
function jg(t) {
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
c(jg, "toList");
function Bg(t, e) {
  const n = t == null ? void 0 : t.tools;
  return Array.isArray(n) ? n.some((i) => (i == null ? void 0 : i.name) === e) : n instanceof Map ? n.has(e) : n && typeof n == "object" ? e in n ? !0 : Object.values(n).some((i) => (i == null ? void 0 : i.name) === e) : !1;
}
c(Bg, "hasTool");
function Ug(t, e) {
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
c(Ug, "addTool");
function Vg() {
  Hooks.on("getSceneControlButtons", (t) => {
    var i;
    const e = jg(t);
    if (!e.length) return;
    const n = e.find((r) => (r == null ? void 0 : r.name) === "tiles") ?? e.find((r) => (r == null ? void 0 : r.name) === "tokens" || (r == null ? void 0 : r.name) === "token") ?? e[0];
    n && (Bg(n, "eidolonCriteriaSwitcher") || Ug(n, {
      name: "eidolonCriteriaSwitcher",
      title: "Criteria Switcher",
      icon: "fa-solid fa-sliders",
      button: !0,
      toggle: !1,
      visible: Vo(((i = game.scenes) == null ? void 0 : i.viewed) ?? null),
      onClick: /* @__PURE__ */ c(() => lc(), "onClick")
    }));
  });
}
c(Vg, "registerSceneControlButton");
function ca(t, e) {
  if (!t || typeof t != "object") return !1;
  const n = String(e).split(".");
  let i = t;
  for (const r of n) {
    if (!i || typeof i != "object" || !Object.prototype.hasOwnProperty.call(i, r)) return !1;
    i = i[r];
  }
  return !0;
}
c(ca, "hasOwnPath");
function Gg() {
  const t = /* @__PURE__ */ c((i, r = null) => {
    i && xh(i, r);
  }, "invalidateTileScene"), e = /* @__PURE__ */ c((i, r = null) => {
    i && Wh(i, r);
  }, "invalidatePlaceableScene");
  Hooks.on("createTile", (i) => {
    t((i == null ? void 0 : i.parent) ?? null, i ?? null);
  }), Hooks.on("deleteTile", (i) => {
    t((i == null ? void 0 : i.parent) ?? null, i ?? null);
  }), Hooks.on("updateTile", (i, r) => {
    (ca(r, `flags.${ie}.tileCriteria`) || ca(r, `flags.${ie}.fileIndex`)) && t((i == null ? void 0 : i.parent) ?? null, i ?? null);
  });
  const n = /* @__PURE__ */ c((i) => {
    Hooks.on(`create${i}`, (r) => {
      e((r == null ? void 0 : r.parent) ?? null, r ?? null);
    }), Hooks.on(`delete${i}`, (r) => {
      e((r == null ? void 0 : r.parent) ?? null, r ?? null);
    }), Hooks.on(`update${i}`, (r, a) => {
      const o = ca(a, `flags.${ie}.presets`), s = i === "AmbientLight" && ca(a, `flags.${ie}.lightCriteria`);
      !o && !s || e((r == null ? void 0 : r.parent) ?? null, r ?? null);
    });
  }, "registerPlaceableHooks");
  n("AmbientLight"), n("Wall"), n("AmbientSound"), Hooks.on("canvasReady", (i) => {
    const r = (i == null ? void 0 : i.scene) ?? null;
    r && (t(r), e(r));
  });
}
c(Gg, "registerCriteriaCacheInvalidationHooks");
function zg() {
  Vg(), qg(), Gg(), Hooks.once("init", () => {
    var t, e;
    (e = (t = game.keybindings) == null ? void 0 : t.register) == null || e.call(t, ie, "toggleCriteriaSwitcher", {
      name: "Toggle Criteria Switcher",
      hint: "Open or close the criteria switcher window for live scene state updates.",
      editable: [{ key: "KeyM", modifiers: ["Alt"] }],
      onDown: /* @__PURE__ */ c(() => {
        var n, i, r;
        return Vo(((n = game.scenes) == null ? void 0 : n.viewed) ?? null) ? (lc(), !0) : ((r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "You do not have permission to manage scene criteria."), !0);
      }, "onDown"),
      restricted: !0,
      precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
    });
  }), Hooks.on("canvasReady", (t) => {
    var n;
    const e = Wo();
    e && (e.setScene((t == null ? void 0 : t.scene) ?? ((n = game.scenes) == null ? void 0 : n.viewed) ?? null), e.render({ force: !0 }));
  }), Hooks.once("ready", () => {
    var e, n;
    const t = (n = (e = game.modules) == null ? void 0 : e.get) == null ? void 0 : n.call(e, ie);
    t && (t.api || (t.api = {}), t.api.criteria = ag, console.log(`${ie} | Criteria engine API registered`));
  });
}
c(zg, "registerCriteriaEngineHooks");
zg();
const Sa = /* @__PURE__ */ new WeakMap(), ua = /* @__PURE__ */ new WeakMap(), be = "__eidolon_default__";
function Wg() {
  Hooks.on("renderAmbientLightConfig", Yg), N("LightCriteria | AmbientLightConfig controls registered");
}
c(Wg, "registerAmbientLightCriteriaControls");
function Yg(t, e) {
  var n;
  Yi("LightCriteria | renderAmbientLightConfig", {
    appId: (t == null ? void 0 : t.id) ?? null,
    constructor: ((n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) ?? null,
    isRendered: (t == null ? void 0 : t.rendered) ?? !1
  });
  try {
    const i = zt(e);
    if (!i) return;
    if (!Bo()) {
      i.querySelectorAll(".eidolon-light-criteria, .eidolon-light-criteria-main-switcher").forEach((r) => r.remove());
      return;
    }
    Kg(t, i);
  } catch (i) {
    console.error("eidolon-utilities | Failed to enhance AmbientLightConfig UI", i);
  } finally {
    $n();
  }
}
c(Yg, "handleAmbientLightConfigRender");
function Kg(t, e) {
  var xe, Gn, nr, ta, Lc;
  const n = (t == null ? void 0 : t.form) instanceof HTMLFormElement ? t.form : e instanceof HTMLFormElement ? e : (xe = e == null ? void 0 : e.closest) == null ? void 0 : xe.call(e, "form");
  if (!(n instanceof HTMLFormElement)) return;
  const i = n.querySelector(".window-content");
  if (!(i instanceof HTMLElement)) return;
  const r = ef(t);
  if (!r) return;
  const a = yp(r);
  N("LightCriteria | Resolved ambient light", {
    sheetId: (r == null ? void 0 : r.id) ?? null,
    persistedId: (a == null ? void 0 : a.id) ?? null,
    sameRef: r === a
  });
  const o = (a == null ? void 0 : a.parent) ?? r.parent ?? null, s = o ? eh(o) : [], l = s.filter(
    (x) => Array.isArray(x == null ? void 0 : x.values) && x.values.length > 0
  ), u = sp(s), d = s.map((x) => typeof (x == null ? void 0 : x.id) == "string" ? x.id : null).filter((x) => !!x), h = a ?? r, f = o ? gt(o) : [];
  let g = Md(h);
  const p = Rh(g, f);
  JSON.stringify(p) !== JSON.stringify(g) && (g = p, Nd(h, p).catch((x) => {
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
  const L = document.createElement("button");
  L.type = "button", L.dataset.action = "make-default", L.classList.add("eidolon-light-criteria__button"), L.textContent = E(
    "EIDOLON.LightCriteria.SetBase",
    "Set Base"
  ), C.appendChild(L);
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
    Z.classList.add("eidolon-light-criteria__filter-name"), Z.textContent = (nr = (Gn = x.name) == null ? void 0 : Gn.trim) != null && nr.call(Gn) ? x.name.trim() : E("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), G.appendChild(Z);
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
  const Yt = document.createElement("summary");
  Yt.classList.add("eidolon-light-criteria__menu-toggle"), Yt.innerHTML = '<i class="fa-solid fa-ellipsis-vertical" inert=""></i>', Yt.setAttribute(
    "aria-label",
    E("EIDOLON.LightCriteria.MoreActions", "More actions")
  ), Yt.dataset.tooltip = E("EIDOLON.LightCriteria.MoreActions", "More actions"), te.appendChild(Yt);
  const pt = document.createElement("div");
  pt.classList.add("eidolon-light-criteria__menu-list"), te.appendChild(pt);
  const Pe = document.createElement("button");
  Pe.type = "button", Pe.dataset.action = "update-selected-mapping", Pe.classList.add("eidolon-light-criteria__menu-item"), Pe.textContent = E(
    "EIDOLON.LightCriteria.UpdateSelected",
    "Save current config to selected"
  ), pt.appendChild(Pe);
  const rt = document.createElement("button");
  rt.type = "button", rt.dataset.action = "edit-selected-mapping-criteria", rt.classList.add("eidolon-light-criteria__menu-item"), rt.textContent = E(
    "EIDOLON.LightCriteria.EditSelectedCriteria",
    "Edit selected mapping criteria"
  ), pt.appendChild(rt);
  const at = document.createElement("button");
  at.type = "button", at.dataset.action = "remove-selected-mapping", at.classList.add("eidolon-light-criteria__menu-item", "danger"), at.textContent = E(
    "EIDOLON.LightCriteria.RemoveSelected",
    "Delete selected mapping"
  ), pt.appendChild(at), K.appendChild(te);
  const Kt = document.createElement("div");
  Kt.classList.add("eidolon-light-criteria-main-switcher"), Kt.appendChild(M);
  const Ke = document.createElement("p");
  if (Ke.classList.add("notes", "eidolon-light-criteria-main-switcher__empty"), Ke.textContent = E(
    "EIDOLON.LightCriteria.ActiveRequiresBase",
    "Set Base Lighting to enable mapping selection and actions."
  ), Kt.appendChild(Ke), s.length === 0) {
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
  const Oe = document.createElement("div");
  Oe.classList.add("eidolon-light-criteria__creation"), Oe.dataset.section = "creation", Oe.hidden = !0;
  const Ti = document.createElement("p");
  Ti.classList.add("notes"), Ti.textContent = E(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ), Oe.appendChild(Ti);
  const Jt = document.createElement("div");
  Jt.classList.add("eidolon-light-criteria__category-list"), Oe.appendChild(Jt);
  for (const x of l) {
    const G = document.createElement("label");
    G.classList.add("eidolon-light-criteria__category");
    const Z = document.createElement("span");
    Z.classList.add("eidolon-light-criteria__category-name"), Z.textContent = (Lc = (ta = x.name) == null ? void 0 : ta.trim) != null && Lc.call(ta) ? x.name.trim() : E("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), G.appendChild(Z);
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
    G.appendChild(ee), Jt.appendChild(G);
  }
  const Vn = document.createElement("div");
  Vn.classList.add("eidolon-light-criteria__creation-actions");
  const ot = document.createElement("button");
  ot.type = "button", ot.dataset.action = "save-mapping", ot.classList.add("eidolon-light-criteria__button", "primary"), ot.textContent = E(
    "EIDOLON.LightCriteria.SaveMapping",
    "Save Mapping"
  ), Vn.appendChild(ot);
  const Xt = document.createElement("button");
  Xt.type = "button", Xt.dataset.action = "cancel-create", Xt.classList.add("eidolon-light-criteria__button", "secondary"), Xt.textContent = E(
    "EIDOLON.LightCriteria.Cancel",
    "Cancel"
  ), Vn.appendChild(Xt), Oe.appendChild(Vn), v.appendChild(Oe), i.prepend(Kt), i.appendChild(v), v.hidden = !0, Qg(t, {
    fieldset: v,
    homeContainer: i
  }), requestAnimationFrame(() => {
    var x;
    (x = t.setPosition) == null || x.call(t, { height: "auto" });
  });
  let F = g;
  Yn({ switcher: M, emptyState: Ke, state: F }), Wn(O, F), or(A, {
    state: F,
    hasCategories: l.length > 0
  }), N("LightCriteria | Controls injected", {
    sceneId: (o == null ? void 0 : o.id) ?? null,
    lightId: (r == null ? void 0 : r.id) ?? null,
    hasBase: !!(F != null && F.base),
    mappingCount: Array.isArray(F == null ? void 0 : F.mappings) ? F.mappings.length : 0,
    categories: l.length
  });
  const Zr = mp(F), X = {
    restoreConfig: null,
    app: t,
    selectedMapping: Zr,
    editorMode: "create",
    editingMappingId: null,
    mappingFilters: {}
  };
  Sa.set(v, X);
  const yt = /* @__PURE__ */ c(() => {
    te.open = !1;
  }, "closeActionsMenu");
  Yt.addEventListener("click", (x) => {
    te.classList.contains("is-disabled") && (x.preventDefault(), yt());
  });
  const $e = /* @__PURE__ */ c((x = X.selectedMapping) => {
    const G = lp(W), Z = Array.isArray(F == null ? void 0 : F.mappings) ? F.mappings : [], ee = up(Z, G), ne = Object.keys(G).length;
    X.mappingFilters = G, U.disabled = ne === 0, dp(R, {
      totalCount: Z.length,
      visibleCount: ee.length,
      hasFilters: ne > 0,
      activeFilterCount: ne
    }), D.classList.toggle("has-active-filters", ne > 0), fp(ae, F, u, x, {
      mappings: ee,
      categoryOrder: d
    }), X.selectedMapping = ae.value ?? "", ys({
      mappingSelect: ae,
      applyMappingButton: Q,
      updateMappingButton: Pe,
      editCriteriaButton: rt,
      removeMappingButton: at,
      actionsMenu: te,
      state: F
    }), te.classList.contains("is-disabled") && yt();
  }, "refreshMappingSelector");
  W.querySelectorAll("select[data-filter-category-id]").forEach((x) => {
    x.addEventListener("change", () => {
      const G = X.selectedMapping;
      $e(G), X.selectedMapping !== G && bs(
        a ?? r,
        F,
        X.selectedMapping
      ).then((Z) => {
        Z && (F = Z);
      });
    });
  }), U.addEventListener("click", () => {
    cp(W);
    const x = X.selectedMapping;
    $e(x), D.open = !1, X.selectedMapping !== x && bs(
      a ?? r,
      F,
      X.selectedMapping
    ).then((G) => {
      G && (F = G);
    });
  }), ae.addEventListener("change", () => {
    X.selectedMapping = ae.value ?? "", ys({
      mappingSelect: ae,
      applyMappingButton: Q,
      updateMappingButton: Pe,
      editCriteriaButton: rt,
      removeMappingButton: at,
      actionsMenu: te,
      state: F
    }), bs(
      a ?? r,
      F,
      X.selectedMapping
    ).then((x) => {
      x && (F = x);
    });
  });
  const tr = /* @__PURE__ */ c(async () => {
    var ee, ne, ue, de, st, dn, lt, fn, pe, mn, hn, _t, zn, ir;
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
    if (x === be) {
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
      da(v, Oe, A), Ta(t, n, F.base), F = await gr(a ?? r, {
        mappingId: be,
        categories: null,
        updatedAt: Date.now()
      }), X.selectedMapping = be, $e(X.selectedMapping), Wn(O, F), Yn({ switcher: M, emptyState: Ke, state: F }), or(A, {
        state: F,
        hasCategories: l.length > 0
      }), eu(n, {
        mappingId: be,
        color: ((dn = (st = F.base) == null ? void 0 : st.config) == null ? void 0 : dn.color) ?? null
      }), (fn = (lt = ui.notifications) == null ? void 0 : lt.info) == null || fn.call(
        lt,
        E(
          "EIDOLON.LightCriteria.BaseApplied",
          "Applied the base lighting state to the form."
        )
      ), yt();
      return;
    }
    const G = Array.isArray(F == null ? void 0 : F.mappings) && F.mappings.length ? F.mappings.find((Li) => (Li == null ? void 0 : Li.id) === x) : null;
    if (!G) {
      (mn = (pe = ui.notifications) == null ? void 0 : pe.warn) == null || mn.call(
        pe,
        E(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      ), X.selectedMapping = "", $e(X.selectedMapping);
      return;
    }
    da(v, Oe, A), Ta(t, n, G.config), F = await gr(a ?? r, {
      mappingId: G.id,
      categories: G.categories,
      updatedAt: Date.now()
    }), X.selectedMapping = G.id, $e(X.selectedMapping), Wn(O, F), Yn({ switcher: M, emptyState: Ke, state: F }), or(A, {
      state: F,
      hasCategories: l.length > 0
    }), eu(n, {
      mappingId: G.id,
      color: ((_t = (hn = G.config) == null ? void 0 : hn.config) == null ? void 0 : _t.color) ?? null
    });
    const Z = ji(G, u, d);
    (ir = (zn = ui.notifications) == null ? void 0 : zn.info) == null || ir.call(
      zn,
      E(
        "EIDOLON.LightCriteria.MappingApplied",
        "Applied mapping: {label}"
      ).replace("{label}", Z)
    ), yt();
  }, "applySelectedMapping");
  Q.addEventListener("click", () => {
    tr();
  }), ae.addEventListener("keydown", (x) => {
    x.key === "Enter" && (x.preventDefault(), tr());
  });
  const ea = /* @__PURE__ */ c(async () => {
    var G, Z, ee, ne, ue, de, st, dn, lt, fn, pe, mn, hn, _t, zn, ir, Li, na, Ic, ia, Oc;
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
      const Je = Ca(t, a);
      if (x === be)
        F = await Gc(a ?? r, Je), N("LightCriteria | Base lighting updated", {
          lightId: ((ee = a ?? r) == null ? void 0 : ee.id) ?? null,
          configColor: ((ne = Je == null ? void 0 : Je.config) == null ? void 0 : ne.color) ?? null
        }), (de = (ue = ui.notifications) == null ? void 0 : ue.info) == null || de.call(
          ue,
          E(
            "EIDOLON.LightCriteria.BaseUpdated",
            "Updated the base lighting state with the current configuration."
          )
        ), X.selectedMapping = be;
      else {
        const Ii = pr(F, x);
        if (!Ii) {
          (dn = (st = ui.notifications) == null ? void 0 : st.warn) == null || dn.call(
            st,
            E(
              "EIDOLON.LightCriteria.MappingUnavailable",
              "The selected criteria mapping is no longer available."
            )
          ), X.selectedMapping = "", $e(X.selectedMapping);
          return;
        }
        F = await zc(
          a ?? r,
          Ii.categories,
          Je,
          { label: Ii.label ?? null }
        ), N("LightCriteria | Mapping updated", {
          mappingId: x,
          hasColor: !!((lt = Je == null ? void 0 : Je.config) != null && lt.color),
          stored: Array.isArray(F == null ? void 0 : F.mappings) ? ((fn = F.mappings.find((is) => (is == null ? void 0 : is.id) === x)) == null ? void 0 : fn.config) ?? null : null,
          persisted: (mn = (pe = a ?? r) == null ? void 0 : pe.getFlag) == null ? void 0 : mn.call(pe, gi, qi)
        });
        const rr = pr(F, x), mm = ji(rr || Ii, u, d);
        N("LightCriteria | Mapping updated", {
          mappingId: x,
          categories: Ii.categories,
          updatedColor: ((hn = Je == null ? void 0 : Je.config) == null ? void 0 : hn.color) ?? null,
          storedColor: ((zn = (_t = rr == null ? void 0 : rr.config) == null ? void 0 : _t.config) == null ? void 0 : zn.color) ?? ((Li = (ir = Ii.config) == null ? void 0 : ir.config) == null ? void 0 : Li.color) ?? null
        }), (Ic = (na = ui.notifications) == null ? void 0 : na.info) == null || Ic.call(
          na,
          E(
            "EIDOLON.LightCriteria.MappingUpdated",
            "Saved changes to mapping: {label}"
          ).replace("{label}", mm)
        ), X.selectedMapping = x;
      }
      Wn(O, F), Yn({ switcher: M, emptyState: Ke, state: F }), or(A, {
        state: F,
        hasCategories: l.length > 0
      }), $e(X.selectedMapping), yt();
    } catch (Je) {
      console.error("eidolon-utilities | Failed to update light criteria mapping", Je), (Oc = (ia = ui.notifications) == null ? void 0 : ia.error) == null || Oc.call(
        ia,
        E(
          "EIDOLON.LightCriteria.MappingUpdateError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      Pe.disabled = !1, ys({
        mappingSelect: ae,
        applyMappingButton: Q,
        updateMappingButton: Pe,
        editCriteriaButton: rt,
        removeMappingButton: at,
        actionsMenu: te,
        state: F
      });
    }
  }, "updateSelectedMapping");
  Pe.addEventListener("click", () => {
    ea();
  }), $e(X.selectedMapping), L.addEventListener("click", async () => {
    var x, G, Z, ee, ne, ue;
    L.disabled = !0;
    try {
      const de = Ca(t, a);
      F = await Gc(a ?? r, de), N("LightCriteria | Base lighting stored", {
        lightId: ((x = a ?? r) == null ? void 0 : x.id) ?? null,
        configColor: ((G = de == null ? void 0 : de.config) == null ? void 0 : G.color) ?? null
      }), (ee = (Z = ui.notifications) == null ? void 0 : Z.info) == null || ee.call(
        Z,
        E(
          "EIDOLON.LightCriteria.BaseStored",
          "Saved the current configuration as the base lighting state."
        )
      ), Wn(O, F), Yn({ switcher: M, emptyState: Ke, state: F }), or(A, {
        state: F,
        hasCategories: l.length > 0
      }), X.selectedMapping = be, $e(X.selectedMapping);
    } catch (de) {
      console.error("eidolon-utilities | Failed to store base light criteria state", de), (ue = (ne = ui.notifications) == null ? void 0 : ne.error) == null || ue.call(
        ne,
        E(
          "EIDOLON.LightCriteria.BaseError",
          "Failed to save the base lighting state. Check the console for details."
        )
      );
    } finally {
      L.disabled = !1;
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
    const x = Sa.get(v);
    Zc({
      app: t,
      fieldset: v,
      createButton: A,
      creationSection: Oe,
      categoryList: Jt,
      form: n,
      persistedLight: a,
      stateEntry: x,
      mode: "create",
      mapping: null,
      preloadConfig: F.base
    });
  }), rt.addEventListener("click", () => {
    var Z, ee, ne, ue;
    const x = X.selectedMapping;
    if (!x || x === be) {
      (ee = (Z = ui.notifications) == null ? void 0 : Z.warn) == null || ee.call(
        Z,
        E(
          "EIDOLON.LightCriteria.SelectMappingForCriteriaEdit",
          "Select a mapping before editing criteria."
        )
      );
      return;
    }
    const G = pr(F, x);
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
    yt(), Zd(t, { fieldset: v, homeContainer: i }), Zc({
      app: t,
      fieldset: v,
      createButton: A,
      creationSection: Oe,
      categoryList: Jt,
      form: n,
      persistedLight: a,
      stateEntry: X,
      mode: "retarget",
      mapping: G,
      preloadConfig: G.config
    });
  }), ot.addEventListener("click", async () => {
    var G, Z, ee, ne, ue, de, st, dn, lt, fn;
    const x = pp(Jt);
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
    ot.disabled = !0;
    try {
      const pe = Ca(t, a);
      if (X.editorMode === "retarget" && X.editingMappingId) {
        const hn = bl(F, x);
        let _t = !1;
        if (hn && hn !== X.editingMappingId && (_t = await Jg(), !_t)) {
          ot.disabled = !1;
          return;
        }
        F = await Fh(
          a ?? r,
          X.editingMappingId,
          x,
          pe,
          { replaceExisting: _t }
        ), N("LightCriteria | Mapping criteria retargeted", {
          mappingId: X.editingMappingId,
          categories: x,
          replaced: _t,
          configColor: ((ee = pe == null ? void 0 : pe.config) == null ? void 0 : ee.color) ?? null
        }), (ue = (ne = ui.notifications) == null ? void 0 : ne.info) == null || ue.call(
          ne,
          E(
            "EIDOLON.LightCriteria.MappingCriteriaUpdated",
            "Updated mapping criteria for the selected mapping."
          )
        );
      } else
        F = await zc(
          a ?? r,
          x,
          pe,
          {}
        ), N("LightCriteria | Mapping saved from editor", {
          categories: x,
          configColor: ((de = pe == null ? void 0 : pe.config) == null ? void 0 : de.color) ?? null
        }), (dn = (st = ui.notifications) == null ? void 0 : st.info) == null || dn.call(
          st,
          E(
            "EIDOLON.LightCriteria.MappingSaved",
            "Updated lighting mapping for the selected scene criteria."
          )
        );
      Wn(O, F), Yn({ switcher: M, emptyState: Ke, state: F });
      const mn = bl(F, x);
      mn && (X.selectedMapping = mn), $e(X.selectedMapping), da(v, Oe, A), yt();
    } catch (pe) {
      console.error("eidolon-utilities | Failed to persist light criteria mapping", pe), (fn = (lt = ui.notifications) == null ? void 0 : lt.error) == null || fn.call(
        lt,
        E(
          "EIDOLON.LightCriteria.MappingError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      ot.disabled = !1;
    }
  }), Xt.addEventListener("click", () => {
    const x = Sa.get(v);
    x != null && x.restoreConfig && Ta(t, n, x.restoreConfig), da(v, Oe, A);
  }), at.addEventListener("click", async () => {
    var Z, ee;
    const x = X.selectedMapping;
    !x || x === be || !await Xg() || (F = await Dh(a ?? r, x), X.selectedMapping = "", Wn(O, F), Yn({ switcher: M, emptyState: Ke, state: F }), $e(X.selectedMapping), yt(), (ee = (Z = ui.notifications) == null ? void 0 : Z.info) == null || ee.call(
      Z,
      E("EIDOLON.LightCriteria.MappingRemoved", "Removed selected mapping.")
    ));
  });
}
c(Kg, "enhanceAmbientLightConfig");
function Zc({
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
  s && (s.restoreConfig = Ca(t, o), s.editorMode = l, s.editingMappingId = l === "retarget" ? (u == null ? void 0 : u.id) ?? null : null), d && Ta(t, a, d), l === "retarget" && (u != null && u.categories) ? gp(r, u.categories) : hp(r);
  const h = i.querySelector("p.notes");
  h instanceof HTMLElement && (h.textContent = l === "retarget" ? E(
    "EIDOLON.LightCriteria.EditCriteriaDescription",
    "Adjust criteria values for the selected mapping."
  ) : E(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const f = i.querySelector('button[data-action="save-mapping"]');
  f instanceof HTMLButtonElement && (f.textContent = l === "retarget" ? E("EIDOLON.LightCriteria.SaveCriteriaChanges", "Save Criteria Changes") : E("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), i.hidden = !1, n.setAttribute("aria-expanded", "true"), cc(e, i), requestAnimationFrame(() => {
    var g;
    (g = t.setPosition) == null || g.call(t, { height: "auto" });
  });
}
c(Zc, "openMappingEditor");
async function Jg() {
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
c(Jg, "confirmCriteriaConflict");
async function Xg() {
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
c(Xg, "confirmRemoveMapping");
function Qg(t, { fieldset: e, homeContainer: n }) {
  const i = tp(t, n);
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
    o.preventDefault(), Zd(t, { fieldset: e, homeContainer: n });
  };
}
c(Qg, "ensureManagerHeaderButton");
function Zd(t, { fieldset: e, homeContainer: n }) {
  var f, g, p;
  const i = ua.get(t);
  if (i != null && i.rendered) {
    (f = i.bringToTop) == null || f.call(i);
    return;
  }
  const r = /* @__PURE__ */ c((...y) => {
    var w;
    const v = Zg(y), b = (w = v == null ? void 0 : v.querySelector) == null ? void 0 : w.call(v, ".eidolon-light-criteria-manager-host");
    b instanceof HTMLElement && (ep(e), e.hidden = !1, b.appendChild(e));
  }, "onRender"), a = /* @__PURE__ */ c(() => {
    n instanceof HTMLElement && n.appendChild(e), e.hidden = !0, ua.delete(t), requestAnimationFrame(() => {
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
      ua.set(t, {
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
  ua.set(t, h), h.render(!0);
}
c(Zd, "openManagerDialog");
function Zg(t) {
  for (const e of t) {
    const n = zt(e);
    if (n) return n;
    const i = zt(e == null ? void 0 : e.element);
    if (i) return i;
  }
  return null;
}
c(Zg, "findDialogRoot");
function ep(t) {
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
  h.classList.add("eidolon-light-criteria-manager__header"), h.textContent = E("EIDOLON.LightCriteria.ManagerAuthoring", "Create or Update Mapping"), u.appendChild(h), a && u.appendChild(a), t.innerHTML = "", e && t.appendChild(e), n && t.appendChild(n), t.appendChild(s), cc(t, a);
}
c(ep, "applyManagerLayout");
function tp(t, e) {
  var i;
  const n = zt(t == null ? void 0 : t.element);
  return n || (((i = e == null ? void 0 : e.closest) == null ? void 0 : i.call(e, ".application")) ?? null);
}
c(tp, "resolveApplicationRoot");
function da(t, e, n) {
  const i = Sa.get(t);
  i && (i.restoreConfig = null, i.editorMode = "create", i.editingMappingId = null), e.hidden = !0, n.setAttribute("aria-expanded", "false");
  const r = e.querySelector("p.notes");
  r instanceof HTMLElement && (r.textContent = E(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const a = e.querySelector('button[data-action="save-mapping"]');
  a instanceof HTMLButtonElement && (a.textContent = E("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), cc(t, e), requestAnimationFrame(() => {
    var o, s;
    (s = (o = i == null ? void 0 : i.app) == null ? void 0 : o.setPosition) == null || s.call(o, { height: "auto" });
  });
}
c(da, "hideCreationSection");
function Wn(t, e) {
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
c(Wn, "updateStatusLine");
function or(t, { state: e, hasCategories: n }) {
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
c(or, "updateCreateButtonState");
function Ca(t, e) {
  var l, u, d;
  const n = e ?? ef(t);
  if (!n)
    throw new Error("Ambient light document unavailable.");
  const i = wi(((l = n.toObject) == null ? void 0 : l.call(n)) ?? {});
  if (!i)
    throw new Error("Unable to duplicate ambient light data.");
  const r = (t == null ? void 0 : t.form) instanceof HTMLFormElement ? t.form : null, a = r ? qm(r) : {}, o = foundry.utils.mergeObject(i, a, {
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
    const C = Number(w), L = Number.isFinite(C) ? C : w;
    foundry.utils.setProperty(o, f, L), N("LightCriteria | Captured range-picker value", {
      path: f,
      elementValue: g,
      numberValue: b,
      rangeValue: v,
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
c(Ca, "captureAmbientLightFormConfig");
function Ta(t, e, n) {
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
        s instanceof HTMLElement && s.tagName === "COLOR-PICKER" ? ip(s, a) : s instanceof HTMLElement && s.tagName === "RANGE-PICKER" ? rp(s, a) : s instanceof HTMLInputElement ? np(s, a) : s instanceof HTMLSelectElement ? ap(s, a) : s instanceof HTMLTextAreaElement && op(s, a);
    }
  }
  requestAnimationFrame(() => {
    var r;
    return (r = t._previewChanges) == null ? void 0 : r.call(t);
  });
}
c(Ta, "applyConfigToForm");
function np(t, e, n) {
  const i = t.type;
  if (i === "checkbox") {
    const o = !!e;
    t.checked !== o && (t.checked = o, $t(t));
    return;
  }
  if (i === "radio") {
    const o = e == null ? "" : String(e), s = t.value === o;
    t.checked !== s && (t.checked = s, s && $t(t));
    return;
  }
  const r = e == null ? "" : String(e);
  let a = !1;
  t.value !== r && (t.value = r, a = !0), a && $t(t);
}
c(np, "applyValueToInput");
function ip(t, e, n) {
  var s, l, u, d, h, f;
  const i = e == null ? "" : String(e);
  let r = !1;
  t.value !== i && (t.value = i, t.setAttribute("value", i), (s = t.ui) != null && s.setValue && t.ui.setValue(i), r = !0);
  const a = ((l = t.ui) == null ? void 0 : l.input) ?? ((u = t.querySelector) == null ? void 0 : u.call(t, 'input[type="color"]'));
  a instanceof HTMLInputElement && a.value !== i && (a.value = i, $t(a));
  const o = ((d = t.ui) == null ? void 0 : d.text) ?? ((h = t.querySelector) == null ? void 0 : h.call(t, 'input[type="text"]'));
  o instanceof HTMLInputElement && o.value !== i && (o.value = i, $t(o)), (f = t.ui) != null && f.commit ? t.ui.commit() : (t.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), t.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }))), N("LightCriteria | Color picker applied", {
    value: i,
    pickerValue: t.value ?? null,
    swatchValue: (a == null ? void 0 : a.value) ?? null,
    textValue: (o == null ? void 0 : o.value) ?? null
  }), r && $t(t);
}
c(ip, "applyValueToColorPicker");
function rp(t, e, n) {
  var u, d;
  const i = e == null ? "" : String(e), r = Number(i), a = Number.isFinite(r) ? r : i;
  let o = !1;
  t.value !== void 0 && t.value !== a && (t.value = a, o = !0), t.getAttribute("value") !== i && (t.setAttribute("value", i), o = !0);
  const s = (u = t.querySelector) == null ? void 0 : u.call(t, 'input[type="range"]');
  s instanceof HTMLInputElement && s.value !== i && (s.value = i, $t(s));
  const l = (d = t.querySelector) == null ? void 0 : d.call(t, 'input[type="number"]');
  if (l instanceof HTMLInputElement && l.value !== i && (l.value = i, $t(l)), typeof t.commit == "function")
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
  }), o && $t(t);
}
c(rp, "applyValueToRangePicker");
function ap(t, e, n) {
  const i = e == null ? "" : String(e);
  t.value !== i && (t.value = i, $t(t));
}
c(ap, "applyValueToSelect");
function op(t, e, n) {
  const i = e == null ? "" : String(e);
  t.value !== i && (t.value = i, $t(t));
}
c(op, "applyValueToTextarea");
function $t(t) {
  t.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), t.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }));
}
c($t, "triggerInputChange");
function ys({
  mappingSelect: t,
  applyMappingButton: e,
  updateMappingButton: n,
  editCriteriaButton: i,
  removeMappingButton: r,
  actionsMenu: a,
  state: o
}) {
  const s = (t == null ? void 0 : t.value) ?? "", l = !!(o != null && o.base), u = s && s !== be ? !!pr(o, s) : !1;
  if (e instanceof HTMLButtonElement && (s ? s === be ? e.disabled = !l : e.disabled = !u : e.disabled = !0), n instanceof HTMLButtonElement && (s ? s === be ? n.disabled = !1 : n.disabled = !u : n.disabled = !0), i instanceof HTMLButtonElement && (i.disabled = !s || s === be || !u), r instanceof HTMLButtonElement && (r.disabled = !s || s === be || !u), a instanceof HTMLElement) {
    const d = n instanceof HTMLButtonElement && !n.disabled || i instanceof HTMLButtonElement && !i.disabled || r instanceof HTMLButtonElement && !r.disabled;
    a.classList.toggle("is-disabled", !d), !d && "open" in a && (a.open = !1);
  }
}
c(ys, "syncMappingSwitcherState");
function sp(t) {
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
c(sp, "buildCategoryNameLookup");
function lp(t) {
  const e = {};
  return t instanceof HTMLElement && t.querySelectorAll("select[data-filter-category-id]").forEach((n) => {
    var a, o;
    const i = n.dataset.filterCategoryId, r = (o = (a = n.value) == null ? void 0 : a.trim) == null ? void 0 : o.call(a);
    !i || !r || (e[i] = r);
  }), e;
}
c(lp, "readMappingFilterSelections");
function cp(t) {
  t instanceof HTMLElement && t.querySelectorAll("select[data-filter-category-id]").forEach((e) => {
    e.value = "";
  });
}
c(cp, "resetMappingFilterSelections");
function up(t, e) {
  const n = Array.isArray(t) ? t : [], i = Object.entries(e ?? {}).filter(([, r]) => !!r);
  return i.length ? n.filter((r) => {
    if (!r || typeof r != "object") return !1;
    const a = r.categories ?? {};
    for (const [o, s] of i)
      if ((a == null ? void 0 : a[o]) !== s) return !1;
    return !0;
  }) : n.slice();
}
c(up, "filterMappingsByCriteria");
function dp(t, { totalCount: e = 0, visibleCount: n = 0, hasFilters: i = !1, activeFilterCount: r = 0 } = {}) {
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
c(dp, "updateMappingFilterMeta");
function fp(t, e, n, i, r = {}) {
  if (!(t instanceof HTMLSelectElement)) return;
  const a = typeof i == "string" ? i : "", o = !!(e != null && e.base), s = Array.isArray(r == null ? void 0 : r.categoryOrder) ? r.categoryOrder : [], l = Array.isArray(r == null ? void 0 : r.mappings) ? r.mappings.slice() : Array.isArray(e == null ? void 0 : e.mappings) ? e.mappings.slice() : [], u = t.value;
  t.innerHTML = "";
  const d = document.createElement("option");
  d.value = "", d.textContent = E(
    "EIDOLON.LightCriteria.SelectPlaceholder",
    "Select a mapping"
  ), d.disabled = o, t.appendChild(d);
  const h = document.createElement("option");
  h.value = be, h.textContent = E(
    "EIDOLON.LightCriteria.BaseOption",
    "Base Lighting"
  ), h.disabled = !o, t.appendChild(h), l.slice().sort((y, v) => {
    var C;
    const b = ji(y, n, s), w = ji(v, n, s);
    return b.localeCompare(w, ((C = game.i18n) == null ? void 0 : C.lang) ?? void 0, {
      sensitivity: "base"
    });
  }).forEach((y) => {
    if (!(y != null && y.id)) return;
    const v = document.createElement("option");
    v.value = y.id, v.textContent = ji(y, n, s), t.appendChild(v);
  });
  const f = new Set(
    Array.from(t.options).filter((y) => !y.disabled).map((y) => y.value)
  ), g = o && u === "" ? "" : u, p = a || (f.has(g) ? g : "");
  p && f.has(p) ? t.value = p : o ? t.value = be : t.value = "";
}
c(fp, "populateMappingSelector");
function ji(t, e, n = []) {
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
c(ji, "formatMappingOptionLabel");
function bl(t, e) {
  if (!t || typeof t != "object" || !Array.isArray(t.mappings)) return null;
  const n = Zi(e);
  if (!n) return null;
  const i = t.mappings.find((r) => (r == null ? void 0 : r.key) === n);
  return (i == null ? void 0 : i.id) ?? null;
}
c(bl, "findMappingIdByCategories");
function pr(t, e) {
  return !e || !t || typeof t != "object" || !Array.isArray(t.mappings) ? null : t.mappings.find((n) => (n == null ? void 0 : n.id) === e) ?? null;
}
c(pr, "getMappingById");
function mp(t) {
  if (!t || typeof t != "object") return "";
  const e = t.current;
  if (e != null && e.mappingId) {
    if (e.mappingId === be)
      return t != null && t.base ? be : "";
    if (Array.isArray(t.mappings) && t.mappings.some((n) => n.id === e.mappingId))
      return e.mappingId;
  }
  if (e != null && e.categories) {
    const n = bl(t, e.categories);
    if (n) return n;
  }
  return "";
}
c(mp, "resolveInitialMappingSelection");
function eu(t, e = {}) {
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
c(eu, "logAppliedColorState");
function hp(t) {
  t.querySelectorAll("select[data-category-id]").forEach((e) => {
    e.value = "";
  });
}
c(hp, "resetCategorySelections");
function gp(t, e) {
  const n = e && typeof e == "object" ? e : {};
  t.querySelectorAll("select[data-category-id]").forEach((i) => {
    const r = i.dataset.categoryId;
    if (!r) return;
    const a = n[r];
    i.value = typeof a == "string" ? a : "";
  });
}
c(gp, "setCategorySelections");
function pp(t) {
  const e = {};
  return t.querySelectorAll("select[data-category-id]").forEach((n) => {
    var a, o;
    const i = n.dataset.categoryId, r = (o = (a = n.value) == null ? void 0 : a.trim) == null ? void 0 : o.call(a);
    !i || !r || (e[i] = r);
  }), Object.keys(e).length > 0 ? e : null;
}
c(pp, "readCategorySelections");
async function bs(t, e, n) {
  if (!t) return null;
  try {
    if (!n)
      return await gr(t, {});
    if (n === be)
      return await gr(t, {
        mappingId: be,
        categories: null,
        updatedAt: Date.now()
      });
    const i = pr(e, n);
    return i ? await gr(t, {
      mappingId: i.id,
      categories: i.categories,
      updatedAt: Date.now()
    }) : null;
  } catch (i) {
    return console.warn("eidolon-utilities | Failed to persist mapping selection", i), null;
  }
}
c(bs, "persistCurrentSelection");
function cc(t, e) {
  if (!(t instanceof HTMLElement)) return;
  const n = t.querySelector(".eidolon-light-criteria-manager__section.is-bottom");
  n instanceof HTMLElement && (n.hidden = !!(e != null && e.hidden));
}
c(cc, "updateManagerSectionVisibility");
function Yn({ switcher: t, emptyState: e, state: n }) {
  const i = !!(n != null && n.base);
  t instanceof HTMLElement && (t.hidden = !i), e instanceof HTMLElement && (e.hidden = i);
}
c(Yn, "updateActiveMappingVisibility");
function ef(t) {
  const e = (t == null ? void 0 : t.object) ?? (t == null ? void 0 : t.document) ?? null;
  return !(e != null && e.isEmbedded) || e.documentName !== "AmbientLight" ? null : e;
}
c(ef, "getAmbientLightDocument");
function yp(t) {
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
c(yp, "getPersistedAmbientLightDocument");
function bp() {
  Wg();
}
c(bp, "registerLightCriteriaHooks");
bp();
const vl = /* @__PURE__ */ new Map();
let wl = !1;
function uc(t, e) {
  vl.has(t) && console.warn(`[${T}] Socket handler for type "${t}" already registered, overwriting.`), vl.set(t, e);
}
c(uc, "registerSocketHandler");
function La(t, e) {
  if (!wl) {
    console.error(`[${T}] Socket not initialized. Call initializeSocket() first.`);
    return;
  }
  game.socket.emit(`module.${T}`, { type: t, payload: e });
}
c(La, "emitSocket");
function vp() {
  wl || (game.socket.on(`module.${T}`, (t) => {
    const { type: e, payload: n } = t ?? {}, i = vl.get(e);
    i ? i(n) : console.warn(`[${T}] No socket handler for type "${e}"`);
  }), wl = !0, console.log(`[${T}] Socket initialized on channel module.${T}`));
}
c(vp, "initializeSocket");
const tf = "tween", nf = "tween-sequence", El = "tween-sequence-cancel", Le = Object.freeze({
  ABORT: "abort",
  CONTINUE: "continue"
}), gn = Object.freeze({
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  FAILED: "failed"
}), bt = Object.freeze({
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
function xt({ type: t, execute: e, validate: n }) {
  Ya.has(t) && console.warn(`[tween-registry] Type "${t}" already registered, overwriting.`), Ya.set(t, { type: t, execute: e, validate: n ?? (() => {
  }) });
}
c(xt, "registerTweenType");
function er(t) {
  return Ya.get(t);
}
c(er, "getTweenType");
function wp(t, e = {}) {
  const n = er(t);
  if (!n)
    throw new Error(`Unknown tween type: "${t}".`);
  return n.validate(e ?? {}), n;
}
c(wp, "validateTweenEntry");
function Sl() {
  return [...Ya.keys()];
}
c(Sl, "listTweenTypes");
const Bi = {
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
  easeInBounce: /* @__PURE__ */ c((t) => 1 - Bi.easeOutBounce(1 - t), "easeInBounce"),
  easeInOutBounce: /* @__PURE__ */ c((t) => t < 0.5 ? (1 - Bi.easeOutBounce(1 - 2 * t)) / 2 : (1 + Bi.easeOutBounce(2 * t - 1)) / 2, "easeInOutBounce"),
  easeInElastic: /* @__PURE__ */ c((t) => t === 0 || t === 1 ? t : -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI), "easeInElastic"),
  easeOutElastic: /* @__PURE__ */ c((t) => t === 0 || t === 1 ? t : Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1, "easeOutElastic")
};
function it(t) {
  if (t && Bi[t])
    return Bi[t];
  const e = foundry.canvas.animation.CanvasAnimation;
  return {
    linear: e.easeLinear,
    easeInOutCosine: e.easeInOutCosine
  }[t] ?? e.easeInOutCosine;
}
c(it, "resolveEasing");
function dc() {
  return ["linear", "easeInOutCosine", ...Object.keys(Bi)];
}
c(dc, "listEasingNames");
function Ka(t) {
  return t <= 0.04045 ? t / 12.92 : ((t + 0.055) / 1.055) ** 2.4;
}
c(Ka, "srgbToLinear");
function Ui(t) {
  return t <= 31308e-7 ? 12.92 * t : 1.055 * t ** (1 / 2.4) - 0.055;
}
c(Ui, "linearToSrgb");
function tu(t, e, n) {
  const i = 0.4122214708 * t + 0.5363325363 * e + 0.0514459929 * n, r = 0.2119034982 * t + 0.6806995451 * e + 0.1073969566 * n, a = 0.0883024619 * t + 0.2817188376 * e + 0.6299787005 * n, o = Math.cbrt(i), s = Math.cbrt(r), l = Math.cbrt(a);
  return [
    0.2104542553 * o + 0.793617785 * s - 0.0040720468 * l,
    1.9779984951 * o - 2.428592205 * s + 0.4505937099 * l,
    0.0259040371 * o + 0.7827717662 * s - 0.808675766 * l
  ];
}
c(tu, "linearRgbToOklab");
function Ep(t, e, n) {
  const i = (t + 0.3963377774 * e + 0.2158037573 * n) ** 3, r = (t - 0.1055613458 * e - 0.0638541728 * n) ** 3, a = (t - 0.0894841775 * e - 1.291485548 * n) ** 3;
  return [
    4.0767416621 * i - 3.3077115913 * r + 0.2309699292 * a,
    -1.2684380046 * i + 2.6097574011 * r - 0.3413193965 * a,
    -0.0041960863 * i - 0.7034186147 * r + 1.707614701 * a
  ];
}
c(Ep, "oklabToLinearRgb");
function Ja(t) {
  return [t.r, t.g, t.b];
}
c(Ja, "colorToRgb");
function rf(t, e, n) {
  const i = /* @__PURE__ */ c((a) => Math.max(0, Math.min(1, a)), "clamp"), r = /* @__PURE__ */ c((a) => Math.round(i(a) * 255).toString(16).padStart(2, "0"), "toHex");
  return `#${r(t)}${r(e)}${r(n)}`;
}
c(rf, "rgbToHex");
function Sp(t, e, n) {
  if (n <= 0) return t.toHTML();
  if (n >= 1) return e.toHTML();
  const i = foundry.utils.Color, [r, a, o] = t.hsl, [s, l, u] = e.hsl, d = (s - r + 0.5) % 1 - 0.5, h = (r + d * n + 1) % 1, f = a + (l - a) * n, g = o + (u - o) * n;
  return i.fromHSL([h, f, g]).toHTML();
}
c(Sp, "interpolateHsl");
function Cp(t, e, n) {
  if (n <= 0) return t.toHTML();
  if (n >= 1) return e.toHTML();
  const [i, r, a] = Ja(t).map(Ka), [o, s, l] = Ja(e).map(Ka), u = Ui(i + (o - i) * n), d = Ui(r + (s - r) * n), h = Ui(a + (l - a) * n);
  return rf(u, d, h);
}
c(Cp, "interpolateRgb");
function Tp(t, e, n) {
  if (n <= 0) return t.toHTML();
  if (n >= 1) return e.toHTML();
  const [i, r, a] = Ja(t).map(Ka), [o, s, l] = Ja(e).map(Ka), [u, d, h] = tu(i, r, a), [f, g, p] = tu(o, s, l), y = 0.02, v = Math.sqrt(d * d + h * h), b = Math.sqrt(g * g + p * p);
  let w, C, L;
  if (v < y || b < y)
    w = u + (f - u) * n, C = d + (g - d) * n, L = h + (p - h) * n;
  else {
    const _ = Math.atan2(h, d);
    let D = Math.atan2(p, g) - _;
    D > Math.PI && (D -= 2 * Math.PI), D < -Math.PI && (D += 2 * Math.PI), w = u + (f - u) * n;
    const P = v + (b - v) * n, $ = _ + D * n;
    C = P * Math.cos($), L = P * Math.sin($);
  }
  const [A, O, M] = Ep(w, C, L);
  return rf(Ui(A), Ui(O), Ui(M));
}
c(Tp, "interpolateOklch");
const Cl = {
  hsl: Sp,
  rgb: Cp,
  oklch: Tp
};
function fc(t = "hsl") {
  return Cl[t] ?? Cl.hsl;
}
c(fc, "getInterpolator");
function Ki() {
  return Object.keys(Cl);
}
c(Ki, "listInterpolationModes");
function Lp(t) {
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
  if (t.mode && !Ki().includes(t.mode))
    throw new Error(
      `light-color tween: unknown mode "${t.mode}". Available: ${Ki().join(", ")}`
    );
}
c(Lp, "validate$7");
async function Ip(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { Color: i } = foundry.utils, { uuid: r, toColor: a, toAlpha: o, mode: s = "oklch" } = t, l = Array.isArray(r) ? r : [r];
  if (l.length === 0)
    return console.warn("light-color tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: u = 2e3,
    easing: d = "easeInOutCosine",
    commit: h = !0,
    startEpochMS: f = null,
    signal: g = null
  } = e, p = it(d), y = a != null, v = o != null, b = y ? fc(s) : null, w = y ? i.fromString(a) : null;
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
c(Ip, "execute$7");
function Op() {
  xt({ type: "light-color", execute: Ip, validate: Lp });
}
c(Op, "registerLightColorTween");
const pn = /* @__PURE__ */ new WeakMap();
function Ap(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("light-state tween: 'uuid' is required (string or array of AmbientLight document UUIDs).");
  if (typeof t.enabled != "boolean")
    throw new Error("light-state tween: 'enabled' (boolean) is required.");
}
c(Ap, "validate$6");
async function kp(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, enabled: r } = t, a = Array.isArray(i) ? i : [i];
  if (a.length === 0)
    return console.warn("light-state tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: o = 2e3,
    easing: s = "easeInOutCosine",
    commit: l = !0,
    startEpochMS: u = null,
    signal: d = null
  } = e, h = it(s);
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
    const w = pn.get(y) ?? {
      hidden: y._source.hidden,
      alpha: ((O = y._source.config) == null ? void 0 : O.alpha) ?? 0.5
    };
    if (pn.set(y, w), N(`light-state START ${r ? "ON" : "OFF"} | snap: ${JSON.stringify(w)} | _source.hidden=${y._source.hidden}, _source.config.alpha=${(M = y._source.config) == null ? void 0 : M.alpha}`), r && !w.hidden || !r && w.hidden)
      return pn.delete(y), !0;
    const C = w.alpha, L = typeof u == "number" ? Math.max(0, Math.min(o, Date.now() - u)) : 0, A = /* @__PURE__ */ c((D) => {
      y.updateSource({ config: { alpha: D } }), v.initializeLightSource();
    }, "applyAlpha");
    if (r) {
      y.updateSource({ hidden: !1, config: { alpha: 0 } }), v.initializeLightSource(), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
      const D = { t: 0 };
      L > 0 && (D.t = L / o, A(C * D.t));
      const P = await n.animate(
        [{ parent: D, attribute: "t", to: 1 }],
        {
          name: b,
          duration: o,
          easing: h,
          time: L,
          ontick: /* @__PURE__ */ c(() => A(C * D.t), "ontick")
        }
      );
      return P !== !1 && !(d != null && d.aborted) && l && y.canUserModify(game.user, "update") ? (y.updateSource({ hidden: !0, config: { alpha: C } }), await y.update({ hidden: !1 }), N(`light-state FADE-IN committed. _source.hidden=${y._source.hidden}, _source.config.alpha=${(_ = y._source.config) == null ? void 0 : _.alpha}`), pn.delete(y)) : P === !1 || pn.delete(y), P !== !1;
    } else {
      y.updateSource({ hidden: !1, config: { alpha: w.alpha } }), v.initializeLightSource();
      const D = { t: 0 };
      L > 0 && (D.t = L / o, A(C * (1 - D.t)));
      const P = await n.animate(
        [{ parent: D, attribute: "t", to: 1 }],
        {
          name: b,
          duration: o,
          easing: h,
          time: L,
          ontick: /* @__PURE__ */ c(() => A(C * (1 - D.t)), "ontick")
        }
      );
      return P !== !1 && !(d != null && d.aborted) && l && y.canUserModify(game.user, "update") ? (await y.update({ hidden: !0 }), y.updateSource({ config: { alpha: C } }), v.initializeLightSource(), N(`light-state FADE-OUT committed+restored. _source.hidden=${y._source.hidden}, _source.config.alpha=${(j = y._source.config) == null ? void 0 : j.alpha}`), pn.delete(y)) : P === !1 || (y.updateSource({ hidden: !0, config: { alpha: C } }), v.initializeLightSource(), pn.delete(y)), P !== !1;
    }
  }
  return c(f, "animateOne"), (await Promise.all(a.map(f))).every(Boolean);
}
c(kp, "execute$6");
function Mp() {
  xt({ type: "light-state", execute: kp, validate: Ap });
}
c(Mp, "registerLightStateTween");
function Ko(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("tile-prop tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (!t.attribute || typeof t.attribute != "string")
    throw new Error("tile-prop tween: 'attribute' (string) is required — dot-path to a numeric property (e.g. 'alpha', 'rotation').");
  if (typeof t.value != "number")
    throw new Error("tile-prop tween: 'value' (number) is required — the target value to animate to.");
}
c(Ko, "validate$5");
async function Jo(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, attribute: r, value: a } = t, o = Array.isArray(i) ? i : [i];
  if (o.length === 0)
    return console.warn("tile-prop tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: s = 2e3,
    easing: l = "easeInOutCosine",
    commit: u = !0,
    startEpochMS: d = null,
    signal: h = null
  } = e, f = it(l);
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
    const L = typeof d == "number" ? Math.max(0, Math.min(s, Date.now() - d)) : 0, A = /* @__PURE__ */ c((_) => {
      const j = w + (a - w) * _;
      v.updateSource(foundry.utils.expandObject({ [r]: j })), b.refresh();
    }, "applyFrame"), O = { t: 0 };
    L > 0 && (O.t = L / s, A(O.t));
    const M = await n.animate(
      [{ parent: O, attribute: "t", to: 1 }],
      {
        name: C,
        duration: s,
        easing: f,
        time: L,
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
c(Jo, "execute$5");
function Np() {
  xt({ type: "tile-prop", execute: Jo, validate: Ko });
}
c(Np, "registerTilePropTween");
function $p(t) {
  if (!t.attribute || typeof t.attribute != "string")
    throw new Error("particles-prop tween: 'attribute' (string) is required — property name on canvas.particleeffects (e.g. 'alpha').");
  if (typeof t.value != "number")
    throw new Error("particles-prop tween: 'value' (number) is required — the target value to animate to.");
}
c($p, "validate$4");
async function xp(t, e = {}) {
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
  const h = it(o), f = `particles-prop-tween:${i}`;
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
c(xp, "execute$4");
function _p() {
  xt({ type: "particles-prop", execute: xp, validate: $p });
}
c(_p, "registerParticlesPropTween");
var Cn, xr, _r, Fr, Dr, Pr, Gi;
const Sc = class Sc {
  /**
   * @param {AbortController} controller
   */
  constructor(e) {
    k(this, Cn);
    k(this, xr);
    k(this, _r);
    k(this, Fr);
    k(this, Dr);
    k(this, Pr, !1);
    k(this, Gi, null);
    I(this, Cn, e), I(this, Fr, new Promise((n) => {
      I(this, xr, n);
    })), I(this, Dr, new Promise((n) => {
      I(this, _r, n);
    }));
  }
  /** @returns {Promise<boolean>} Resolves true (completed) or false (cancelled/failed). */
  get finished() {
    return m(this, Fr);
  }
  /** @returns {Promise<{status: string, [k: string]: unknown}>} */
  get result() {
    return m(this, Dr);
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
    return m(this, Gi) ? m(this, Gi).status : this.cancelled ? "cancelled" : "running";
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
    if (m(this, Pr)) return;
    I(this, Pr, !0);
    const n = typeof e == "boolean" ? { status: e ? "completed" : "cancelled" } : e ?? { status: "cancelled" };
    I(this, Gi, n), m(this, xr).call(this, n.status === "completed"), m(this, _r).call(this, n);
  }
};
Cn = new WeakMap(), xr = new WeakMap(), _r = new WeakMap(), Fr = new WeakMap(), Dr = new WeakMap(), Pr = new WeakMap(), Gi = new WeakMap(), c(Sc, "TimelineHandle");
let Tl = Sc;
var si, zi, li;
const Cc = class Cc {
  constructor() {
    /** @type {Map<string, Set<Function>>} */
    k(this, si, /* @__PURE__ */ new Map());
    /** @type {Set<string>} Signals that have been emitted (sticky) */
    k(this, zi, /* @__PURE__ */ new Set());
    k(this, li, !1);
  }
  /**
   * Subscribe to a named signal.
   * @param {string} signal
   * @param {Function} listener
   * @returns {() => void} Unsubscribe function
   */
  on(e, n) {
    if (m(this, li)) return () => {
    };
    let i = m(this, si).get(e);
    return i || (i = /* @__PURE__ */ new Set(), m(this, si).set(e, i)), i.add(n), () => i.delete(n);
  }
  /**
   * Fire a named signal synchronously. All registered listeners are invoked.
   * The signal is recorded so that future waitFor() calls resolve immediately.
   * @param {string} signal
   */
  emit(e) {
    if (m(this, li)) return;
    m(this, zi).add(e);
    const n = m(this, si).get(e);
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
    return m(this, li) ? Promise.reject(new Error("EventBus destroyed")) : m(this, zi).has(e) ? Promise.resolve() : new Promise((i, r) => {
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
    I(this, li, !0), m(this, si).clear(), m(this, zi).clear();
  }
};
si = new WeakMap(), zi = new WeakMap(), li = new WeakMap(), c(Cc, "EventBus");
let Ll = Cc;
const af = /* @__PURE__ */ new Map();
function Xo(t, e) {
  af.set(t, e);
}
c(Xo, "registerAwaitProvider");
function Il(t, e) {
  const n = af.get(t.event);
  return n ? n(t, e) : Promise.reject(new Error(`Unknown await event type: "${t.event}"`));
}
c(Il, "createAwaitPromise");
Xo("signal", (t, e) => t.name ? e.eventBus.waitFor(t.name, e.signal) : Promise.reject(new Error('await signal: "name" is required')));
Xo("click", (t, e) => new Promise((n, i) => {
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
Xo("keypress", (t, e) => new Promise((n, i) => {
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
function Fp(t, e) {
  const n = _i.get(t);
  n && !n.cancelled && n.cancel("replaced-by-name"), _i.set(t, e), e.finished.then(() => {
    _i.get(t) === e && _i.delete(t);
  });
}
c(Fp, "registerTimeline");
function of(t) {
  const e = _i.get(t);
  return e && !e.cancelled ? (e.cancel("cancelled-by-name"), !0) : !1;
}
c(of, "cancelTimeline");
function Dp(t) {
  return _i.get(t);
}
c(Dp, "getTimeline");
function nu(t, e) {
  return t <= 0 ? Promise.resolve() : new Promise((n, i) => {
    if (e.aborted) return i(e.reason);
    const r = setTimeout(n, t);
    e.addEventListener("abort", () => {
      clearTimeout(r), i(e.reason);
    }, { once: !0 });
  });
}
c(nu, "cancellableDelay");
var je, Tn, Rr, Hr;
const Tc = class Tc {
  constructor(e) {
    /** @type {TweenTimeline} */
    k(this, je);
    /** @type {Array<{ type: string, params: object, opts?: object, detach: boolean }>} */
    k(this, Tn, []);
    /** @type {Function|null} */
    k(this, Rr, null);
    /** @type {Function|null} */
    k(this, Hr, null);
    I(this, je, e);
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
    return I(this, Rr, e), this;
  }
  /**
   * Callback invoked after this step's awaited tweens complete.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  after(e) {
    return I(this, Hr, e), this;
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
      entries: m(this, Tn),
      before: m(this, Rr),
      after: m(this, Hr)
    };
  }
};
je = new WeakMap(), Tn = new WeakMap(), Rr = new WeakMap(), Hr = new WeakMap(), c(Tc, "StepBuilder");
let Ol = Tc;
var Be, Ae, Lt, Ln, qr, jr, Br, Ur, jn, Al, J, Zt, kl, sf, Ml, lf, cf, Ia, ct, Dt;
const nn = class nn {
  constructor() {
    k(this, J);
    /** @type {string|null} */
    k(this, Be, null);
    /** @type {string} */
    k(this, Ae, Le.ABORT);
    /** @type {Array<object>} */
    k(this, Lt, []);
    /** @type {StepBuilder|null} */
    k(this, Ln, null);
    /** @type {Function|null} */
    k(this, qr, null);
    /** @type {Function|null} */
    k(this, jr, null);
    /** @type {Function|null} */
    k(this, Br, null);
    /** @type {Function|null} */
    k(this, Ur, null);
  }
  /**
   * Register this timeline in the named registry. Starting a new
   * timeline with the same name cancels the previous one.
   * @param {string} name
   * @returns {TweenTimeline} this
   */
  name(e) {
    return I(this, Be, e), this;
  }
  /**
   * Set the error policy for step execution.
   * @param {"abort"|"continue"} policy
   * @returns {TweenTimeline} this
   */
  errorPolicy(e) {
    if (e !== Le.ABORT && e !== Le.CONTINUE)
      throw new Error(`Invalid error policy: "${e}". Use "abort" or "continue".`);
    return I(this, Ae, e), this;
  }
  /**
   * Start a new step. Finalizes the previous step if one is open.
   * @returns {StepBuilder}
   */
  step() {
    return S(this, J, Zt).call(this), I(this, Ln, new Ol(this)), m(this, Ln);
  }
  /**
   * Insert a delay (in ms) between the previous step and the next.
   * @param {number} ms
   * @returns {TweenTimeline} this
   */
  delay(e) {
    return S(this, J, Zt).call(this), m(this, Lt).push({ kind: "delay", ms: e }), this;
  }
  /**
   * Pause execution until an event occurs.
   * @param {object} config  e.g. { event: "click" }, { event: "signal", name: "fog-done" }
   * @returns {TweenTimeline} this
   */
  await(e) {
    return S(this, J, Zt).call(this), m(this, Lt).push({ kind: "await", config: e }), this;
  }
  /**
   * Fire a named signal (instant, non-blocking).
   * @param {string} signal  Signal name
   * @returns {TweenTimeline} this
   */
  emit(e) {
    return S(this, J, Zt).call(this), m(this, Lt).push({ kind: "emit", signal: e }), this;
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
    S(this, J, Zt).call(this);
    const i = n.join ?? "all", r = n.overflow ?? "detach";
    if (i !== "all" && i !== "any" && (typeof i != "number" || i < 1 || i > e.length))
      throw new Error(`parallel: join must be "all", "any", or 1..${e.length}, got ${JSON.stringify(i)}`);
    if (r !== "detach" && r !== "cancel")
      throw new Error(`parallel: overflow must be "detach" or "cancel", got ${JSON.stringify(r)}`);
    const a = e.map((o) => {
      var l;
      const s = new nn();
      return o(s), S(l = s, J, Zt).call(l), m(s, Lt);
    });
    return m(this, Lt).push({ kind: "parallel", branches: a, join: i, overflow: r }), this;
  }
  /**
   * Callback invoked before the first step runs.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  beforeAll(e) {
    return I(this, qr, e), this;
  }
  /**
   * Callback invoked on successful completion.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onComplete(e) {
    return I(this, jr, e), this;
  }
  /**
   * Callback invoked on cancellation (mutually exclusive with onComplete).
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onCancel(e) {
    return I(this, Br, e), this;
  }
  /**
   * Callback invoked on runtime failure (mutually exclusive with onComplete/onCancel).
   * @param {(outcome: object) => void} fn
   * @returns {TweenTimeline} this
   */
  onError(e) {
    return I(this, Ur, e), this;
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
    S(this, J, Zt).call(this);
    const n = new AbortController();
    e.signal && (e.signal.aborted ? n.abort(e.signal.reason ?? "parent-aborted") : e.signal.addEventListener("abort", () => {
      n.signal.aborted || n.abort(e.signal.reason ?? "parent-aborted");
    }, { once: !0 }));
    const i = new Tl(n);
    m(this, Be) && Fp(m(this, Be), i);
    const r = e.broadcast ?? game.user.isGM, a = e.commit ?? game.user.isGM, o = e.startEpochMS ?? Date.now();
    r && m(this, Be) && La(nf, {
      name: m(this, Be),
      data: this.toJSON(),
      startEpochMS: o
    });
    const s = new Ll(), l = {
      signal: i.signal,
      commit: a,
      startEpochMS: o,
      eventBus: s,
      errors: [],
      detachedPromises: []
    };
    return S(this, J, sf).call(this, i, l).then((u) => {
      var d, h, f;
      s.destroy(), i._resolve(u), u.status === gn.COMPLETED ? (d = m(this, jr)) == null || d.call(this) : u.status === gn.CANCELLED ? ((h = m(this, Br)) == null || h.call(this), r && m(this, Be) && La(El, {
        name: m(this, Be),
        reason: u.reason
      })) : ((f = m(this, Ur)) == null || f.call(this, u), r && m(this, Be) && La(El, {
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
    S(this, J, Zt).call(this);
    const n = { timeline: S(i = nn, jn, Al).call(i, m(this, Lt)) };
    return m(this, Be) && (n.name = m(this, Be)), m(this, Ae) !== Le.ABORT && (n.errorPolicy = m(this, Ae)), n;
  }
};
Be = new WeakMap(), Ae = new WeakMap(), Lt = new WeakMap(), Ln = new WeakMap(), qr = new WeakMap(), jr = new WeakMap(), Br = new WeakMap(), Ur = new WeakMap(), jn = new WeakSet(), Al = /* @__PURE__ */ c(function(e) {
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
            return S(a = nn, jn, Al).call(a, r);
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
Zt = /* @__PURE__ */ c(function() {
  m(this, Ln) && (m(this, Lt).push({ kind: "step", data: m(this, Ln)._finalize() }), I(this, Ln, null));
}, "#finalizeCurrentStep"), kl = /* @__PURE__ */ c(function(e) {
  e.length !== 0 && Promise.allSettled(e).catch(() => {
  });
}, "#drainDetached"), sf = /* @__PURE__ */ c(async function(e, n) {
  var i, r;
  try {
    if (n.signal.aborted) return S(this, J, ct).call(this, n.signal.reason);
    const a = await S(this, J, Ia).call(this, m(this, qr), bt.BEFORE_ALL, null);
    if (a) {
      if (m(this, Ae) === Le.ABORT) return a;
      n.errors.push(a);
    }
    const o = await S(this, J, Ml).call(this, m(this, Lt), n);
    if (o)
      return S(i = nn, jn, kl).call(i, n.detachedPromises), o;
    if (!n.signal.aborted) {
      const s = await Promise.allSettled(n.detachedPromises);
      for (const l of s)
        if (l.status === "rejected") {
          const u = S(this, J, Dt).call(this, l.reason, bt.ENTRY);
          if (m(this, Ae) === Le.ABORT) return u;
          n.errors.push(u);
        }
    }
    return n.signal.aborted ? S(this, J, ct).call(this, n.signal.reason) : {
      status: gn.COMPLETED,
      ...n.errors.length > 0 ? { errors: n.errors } : {}
    };
  } catch (a) {
    return S(r = nn, jn, kl).call(r, n.detachedPromises), n.signal.aborted ? S(this, J, ct).call(this, n.signal.reason) : (console.error("TweenTimeline execution error:", a), S(this, J, Dt).call(this, a, bt.RUNTIME));
  }
}, "#execute"), Ml = /* @__PURE__ */ c(async function(e, n) {
  let i = -1, r = 0;
  for (const a of e) {
    if (n.signal.aborted) return S(this, J, ct).call(this, n.signal.reason);
    if (a.kind === "delay") {
      try {
        await nu(a.ms, n.signal);
      } catch {
        return S(this, J, ct).call(this, n.signal.reason);
      }
      r += a.ms;
      continue;
    }
    if (a.kind === "await") {
      try {
        let p = Il(a.config, {
          signal: n.signal,
          eventBus: n.eventBus
        });
        const y = a.config.timeout;
        typeof y == "number" && y > 0 && (p = Promise.race([
          p,
          nu(y, n.signal)
        ])), await p;
      } catch (p) {
        if (n.signal.aborted) return S(this, J, ct).call(this, n.signal.reason);
        const y = S(this, J, Dt).call(this, p, bt.AWAIT);
        if (m(this, Ae) === Le.ABORT) return y;
        n.errors.push(y);
      }
      continue;
    }
    if (a.kind === "emit") {
      try {
        n.eventBus.emit(a.signal);
      } catch (p) {
        const y = S(this, J, Dt).call(this, p, bt.EMIT);
        if (m(this, Ae) === Le.ABORT) return y;
        n.errors.push(y);
      }
      continue;
    }
    if (a.kind === "parallel") {
      const p = await S(this, J, lf).call(this, a, n, r);
      if (p) return p;
      continue;
    }
    i += 1;
    const { entries: o, before: s, after: l } = a.data, u = await S(this, J, Ia).call(this, s, bt.BEFORE_STEP, i);
    if (u) {
      if (m(this, Ae) === Le.ABORT) return u;
      n.errors.push(u);
      continue;
    }
    if (n.signal.aborted) return S(this, J, ct).call(this, n.signal.reason);
    const d = [];
    let h = 0;
    for (const p of o) {
      const y = er(p.type);
      if (!y) {
        const C = S(this, J, Dt).call(this, new Error(`TweenTimeline: unknown tween type "${p.type}"`), bt.ENTRY, i, p.type);
        if (m(this, Ae) === Le.ABORT) return C;
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
        failure: S(this, J, Dt).call(this, new Error("Tween entry returned false."), bt.ENTRY, i, p.type)
      } : { ok: !0 }).catch((C) => ({
        ok: !1,
        failure: S(this, J, Dt).call(this, C, bt.ENTRY, i, p.type)
      }));
      p.detach ? n.detachedPromises.push(w) : (d.push(w), h = Math.max(h, b));
    }
    const f = await S(this, J, cf).call(this, d, n.signal);
    if (f === null) return S(this, J, ct).call(this, n.signal.reason);
    for (const p of f)
      if (!p.ok) {
        if (m(this, Ae) === Le.ABORT) return p.failure;
        n.errors.push(p.failure), console.warn("TweenTimeline: entry failed:", p.failure.error);
      }
    const g = await S(this, J, Ia).call(this, l, bt.AFTER_STEP, i);
    if (g) {
      if (m(this, Ae) === Le.ABORT) return g;
      n.errors.push(g);
    }
    if (n.signal.aborted) return S(this, J, ct).call(this, n.signal.reason);
    r += h;
  }
  return null;
}, "#executeSegments"), lf = /* @__PURE__ */ c(async function(e, n, i = 0) {
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
        const C = f.filter((A) => A && A.status === gn.FAILED).map((A) => A), L = S(this, J, Dt).call(this, new Error(`parallel: join target ${l} impossible (${d} completed, ${h} failed)`), bt.PARALLEL);
        m(this, Ae) === Le.ABORT ? p(L) : (n.errors.push(L), n.errors.push(...C), p(null));
      }
    }, "checkJoin"), b = /* @__PURE__ */ c(() => {
      if (o === "cancel")
        for (let w = 0; w < s; w++)
          !f[w] && !u[w].signal.aborted && u[w].abort("overflow-cancel");
      for (let w = 0; w < s; w++)
        f[w] || n.detachedPromises.push(g[w]);
    }, "applyOverflow");
    if (g = r.map((w, C) => {
      const L = {
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
      return S(this, J, Ml).call(this, w, L).then((A) => {
        if (A)
          if (A.status === gn.CANCELLED) {
            if (u[C].signal.aborted) {
              f[C] = A;
              return;
            }
            f[C] = A, h++;
          } else
            f[C] = A, h++;
        else
          f[C] = { status: gn.COMPLETED }, d++;
        v();
      });
    }), n.signal.aborted) {
      y = !0, p(S(this, J, ct).call(this, n.signal.reason));
      return;
    }
    n.signal.addEventListener("abort", () => {
      y || (y = !0, p(S(this, J, ct).call(this, n.signal.reason)));
    }, { once: !0 });
  });
}, "#executeParallel"), /**
 * @param {Array<Promise<{ok: boolean, failure?: object}>>} stepPromises
 * @param {AbortSignal} signal
 * @returns {Promise<Array<{ok: boolean, failure?: object}>|null>}
 */
cf = /* @__PURE__ */ c(function(e, n) {
  return e.length === 0 ? Promise.resolve([]) : n.aborted ? Promise.resolve(null) : new Promise((i, r) => {
    const a = /* @__PURE__ */ c(() => i(null), "onAbort");
    n.addEventListener("abort", a, { once: !0 }), Promise.all(e).then((o) => {
      n.removeEventListener("abort", a), i(o);
    }).catch((o) => {
      n.removeEventListener("abort", a), r(o);
    });
  });
}, "#waitForStep"), Ia = /* @__PURE__ */ c(async function(e, n, i) {
  if (!e) return null;
  try {
    return await e(), null;
  } catch (r) {
    const a = S(this, J, Dt).call(this, r, n, i ?? void 0);
    return m(this, Ae) === Le.CONTINUE && console.warn(`TweenTimeline: hook failure in ${n}:`, r), a;
  }
}, "#runHook"), /** @param {unknown} reason */
ct = /* @__PURE__ */ c(function(e) {
  let n;
  return typeof e == "string" ? n = e : e instanceof Error && (n = e.message), {
    status: gn.CANCELLED,
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
    status: gn.FAILED,
    error: a,
    phase: n,
    ...typeof i == "number" ? { stepIndex: i } : {},
    ...r ? { entryType: r } : {}
  };
}, "#failedOutcome"), k(nn, jn), c(nn, "TweenTimeline");
let Xa = nn;
function mc(t) {
  if (!t || typeof t != "object")
    throw new Error("Sequence JSON: data must be an object.");
  if (!Array.isArray(t.timeline))
    throw new Error("Sequence JSON: 'timeline' must be an array.");
  if (t.name != null && typeof t.name != "string")
    throw new Error("Sequence JSON: 'name' must be a string.");
  if (t.errorPolicy != null && t.errorPolicy !== Le.ABORT && t.errorPolicy !== Le.CONTINUE)
    throw new Error(`Sequence JSON: 'errorPolicy' must be "abort" or "continue".`);
  uf(t.timeline, "timeline", 0);
}
c(mc, "validateSequenceJSON");
function uf(t, e, n = 0) {
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
        uf(d, `${a}.parallel.branches[${u}]`, n + 1);
      }
      continue;
    }
    throw new Error(`Sequence JSON: ${a} is not a recognized segment (step array, delay, await, emit, or parallel).`);
  }
}
c(uf, "validateSegmentsJSON");
function df(t) {
  mc(t), ff(t.timeline, "timeline");
}
c(df, "validateSequenceSemantics");
function ff(t, e) {
  for (let n = 0; n < t.length; n++) {
    const i = t[n], r = `${e}[${n}]`;
    if (Array.isArray(i))
      for (let a = 0; a < i.length; a++) {
        const o = i[a];
        try {
          wp(o.type, o.params ?? {});
        } catch (s) {
          throw new Error(`Sequence JSON: ${r}[${a}] failed semantic validation: ${s.message}`);
        }
      }
    else if (i.parallel)
      for (let a = 0; a < i.parallel.branches.length; a++)
        ff(i.parallel.branches[a], `${r}.parallel.branches[${a}]`);
  }
}
c(ff, "validateSegmentsSemantics");
function hc(t, e = {}) {
  mc(t), e.validateSemantics && df(t);
  const n = new Xa();
  return t.name && n.name(t.name), t.errorPolicy && n.errorPolicy(t.errorPolicy), mf(t.timeline, n), n;
}
c(hc, "compileSequence");
function mf(t, e) {
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
      const i = n.parallel, r = i.branches.map((a) => (o) => mf(a, o));
      e.parallel(r, {
        join: i.join ?? "all",
        overflow: i.overflow ?? "detach"
      });
    }
  }
}
c(mf, "compileSegments");
function Pp(t) {
  mc(t), df(t);
}
c(Pp, "validate$3");
async function Rp(t, e = {}) {
  return hc(t, { validateSemantics: !0 }).run({
    broadcast: !1,
    commit: e.commit,
    startEpochMS: e.startEpochMS,
    signal: e.signal
  }).finished;
}
c(Rp, "execute$3");
function Hp() {
  xt({ type: "sequence", execute: Rp, validate: Pp });
}
c(Hp, "registerSequenceTween");
function qp(t) {
  if (t.x == null && t.y == null && t.scale == null)
    throw new Error("camera-pan tween: at least one of 'x', 'y', or 'scale' is required.");
  if (t.x != null && typeof t.x != "number")
    throw new Error("camera-pan tween: 'x' must be a number.");
  if (t.y != null && typeof t.y != "number")
    throw new Error("camera-pan tween: 'y' must be a number.");
  if (t.scale != null && (typeof t.scale != "number" || t.scale <= 0))
    throw new Error("camera-pan tween: 'scale' must be a positive number.");
}
c(qp, "validate$2");
async function jp(t, e = {}) {
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
c(jp, "execute$2");
function Bp() {
  xt({ type: "camera-pan", execute: jp, validate: qp });
}
c(Bp, "registerCameraPanTween");
function Up(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((i) => !i || typeof i != "string"))
    throw new Error("tile-tint tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (t.toColor == null || typeof t.toColor != "string")
    throw new Error("tile-tint tween: 'toColor' (CSS color string) is required.");
  if (!foundry.utils.Color.fromString(t.toColor).valid)
    throw new Error(`tile-tint tween: invalid target color "${t.toColor}".`);
  if (t.mode && !Ki().includes(t.mode))
    throw new Error(
      `tile-tint tween: unknown mode "${t.mode}". Available: ${Ki().join(", ")}`
    );
}
c(Up, "validate$1");
async function Vp(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { Color: i } = foundry.utils, { uuid: r, toColor: a, mode: o = "oklch" } = t, s = Array.isArray(r) ? r : [r];
  if (s.length === 0)
    return console.warn("tile-tint tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: l = 2e3,
    easing: u = "easeInOutCosine",
    commit: d = !0,
    startEpochMS: h = null,
    signal: f = null
  } = e, g = it(u), p = fc(o), y = i.fromString(a);
  if (!y.valid) throw new Error(`tile-tint tween: invalid target color "${a}".`);
  async function v(w) {
    var R, B;
    if (f != null && f.aborted) return !1;
    const C = await fromUuid(w);
    if (!C) return !1;
    const L = C.object;
    if (!L) return !1;
    const A = ((B = (R = C._source) == null ? void 0 : R.texture) == null ? void 0 : B.tint) ?? "#ffffff", O = i.fromString(A);
    O.valid || console.warn(`tile-tint tween: source tint invalid on ${w}, using white.`);
    const M = O.valid ? O : i.fromString("#ffffff"), _ = { t: 0 }, j = `tile-tint-tween:${w}`;
    n.terminateAnimation(j), f && f.addEventListener("abort", () => {
      n.terminateAnimation(j);
    }, { once: !0 });
    const D = typeof h == "number" ? Math.max(0, Math.min(l, Date.now() - h)) : 0, P = /* @__PURE__ */ c((W) => {
      const H = p(M, y, W);
      C.updateSource({ texture: { tint: H } }), L.refresh();
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
      C.updateSource({ texture: { tint: y.toHTML() } }), L.refresh();
    }
    if (d && $ !== !1 && C.canUserModify(game.user, "update")) {
      if (f != null && f.aborted) return !1;
      C.updateSource({ texture: { tint: M.toHTML() } }), await C.update({ "texture.tint": y.toHTML() });
    }
    return $ !== !1;
  }
  return c(v, "animateOne"), (await Promise.all(s.map(v))).every(Boolean);
}
c(Vp, "execute$1");
function Gp() {
  xt({ type: "tile-tint", execute: Vp, validate: Up });
}
c(Gp, "registerTileTintTween");
function zp(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("tile-scale tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (typeof t.toScale != "number" || t.toScale <= 0)
    throw new Error("tile-scale tween: 'toScale' must be a positive number.");
  for (const n of ["baseWidth", "baseHeight", "centerX", "centerY"])
    if (typeof t[n] != "number")
      throw new Error(`tile-scale tween: '${n}' (number) is required.`);
}
c(zp, "validate");
async function Wp(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, toScale: r, baseWidth: a, baseHeight: o, centerX: s, centerY: l } = t, u = Array.isArray(i) ? i : [i];
  if (u.length === 0) return !0;
  const {
    durationMS: d = 2e3,
    easing: h = "easeInOutCosine",
    commit: f = !0,
    startEpochMS: g = null,
    signal: p = null
  } = e, y = it(h), v = a * r, b = o * r, w = s - v / 2, C = l - b / 2;
  async function L(O) {
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
      const ae = j + (v - j) * K, Q = D + (b - D) * K, te = P + (w - P) * K, Yt = $ + (C - $) * K;
      M.updateSource({ width: ae, height: Q, x: te, y: Yt }), _.refresh();
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
  return c(L, "animateOne"), (await Promise.all(u.map(L))).every(Boolean);
}
c(Wp, "execute");
function Yp() {
  xt({ type: "tile-scale", execute: Wp, validate: zp });
}
c(Yp, "registerTileScaleTween");
async function Kp(t, e, n = {}) {
  if (!game.user.isGM)
    return ui.notifications.warn("Only the GM can dispatch tweens."), !1;
  const i = er(t);
  if (!i)
    throw new Error(`Unknown tween type: "${t}". Registered types: ${Sl().join(", ")}`);
  i.validate(e);
  const { durationMS: r = 2e3, easing: a = "easeInOutCosine", commit: o = !0 } = n, s = Date.now();
  return La(tf, {
    type: t,
    params: e,
    durationMS: r,
    easing: a,
    startEpochMS: s,
    commit: !1
  }), i.execute(e, { durationMS: r, easing: a, commit: o, startEpochMS: s });
}
c(Kp, "dispatchTween");
function Jp(t) {
  const { type: e, params: n, durationMS: i, easing: r, startEpochMS: a, commit: o } = t ?? {}, s = er(e);
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
c(Jp, "handleTweenSocketMessage");
Op();
Mp();
Np();
_p();
Hp();
Bp();
Gp();
Yp();
xt({ type: "token-prop", execute: Jo, validate: Ko });
xt({ type: "drawing-prop", execute: Jo, validate: Ko });
xt({ type: "sound-prop", execute: Jo, validate: Ko });
uc(tf, Jp);
uc(nf, Xp);
uc(El, Qp);
function Xp(t) {
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
c(Xp, "handleSequenceSocketMessage");
function Qp(t) {
  const { name: e } = t ?? {};
  e && of(e);
}
c(Qp, "handleSequenceCancelMessage");
function Zp() {
  Hooks.once("ready", () => {
    vp();
    const t = game.modules.get(T);
    t.api || (t.api = {}), t.api.tween = {
      dispatch: Kp,
      types: Sl,
      Timeline: Xa,
      ErrorPolicy: Le,
      compileSequence: hc,
      cancelTimeline: of,
      getTimeline: Dp
    }, console.log(`[${T}] Tween API registered. Types: ${Sl().join(", ")}`);
  });
}
c(Zp, "registerTweenHooks");
Zp();
const ey = ["tag", "tag-all", "id", "tags-any", "tags-all"], ty = /* @__PURE__ */ new Set(["tags-any", "tags-all"]);
function gc(t) {
  if (!t || typeof t != "string")
    return { type: "unknown", value: t ?? "" };
  if (t.startsWith("$"))
    return { type: "special", value: t };
  for (const e of ey)
    if (t.startsWith(`${e}:`)) {
      const n = t.slice(e.length + 1), i = ty.has(e) ? n.split(",").map((r) => r.trim()) : n;
      return { type: e, value: i };
    }
  return t.includes(".") ? { type: "uuid", value: t } : { type: "unknown", value: t };
}
c(gc, "parseSelector");
function ny(t) {
  if (!t) return "";
  const { type: e, value: n } = t;
  if (e === "special" || e === "uuid" || e === "unknown")
    return Array.isArray(n) ? n.join(",") : n ?? "";
  const i = Array.isArray(n) ? n.join(",") : n ?? "";
  return `${e}:${i}`;
}
c(ny, "buildSelector");
function hf(t, e = "first") {
  return t != null && t.length ? t.length === 1 ? e === "first-all" || e === "all" ? `tag-all:${t[0]}` : `tag:${t[0]}` : e === "any" ? `tags-any:${t.join(",")}` : e === "all" ? `tags-all:${t.join(",")}` : e === "first-all" ? `tags-all:${t.join(",")}` : `tags-any:${t.join(",")}` : "";
}
c(hf, "buildTagSelector");
function Qo(t) {
  if (!t) return null;
  if (t.documentName || t._source !== void 0) {
    const e = t.object;
    return e ? { placeable: e, doc: t } : null;
  }
  return t.document ? { placeable: t, doc: t.document } : null;
}
c(Qo, "normalizePlaceable");
function gf() {
  var t;
  return window.Tagger ?? ((t = game.modules.get("tagger")) == null ? void 0 : t.api) ?? null;
}
c(gf, "getTaggerAPI");
function Zo(t, e) {
  if (!t) return null;
  const n = e ?? canvas.scene;
  if (!n) return null;
  const i = gc(t);
  switch (i.type) {
    case "special":
      return iy(i.value);
    case "tag":
      return iu(i.value, n);
    case "tag-all":
      return iu(i.value, n);
    case "id":
      return ry(i.value, n);
    case "tags-any":
      return ru(i.value, n, !0);
    case "tags-all":
      return ru(i.value, n, !1);
    case "uuid":
      return ay(i.value);
    default:
      return null;
  }
}
c(Zo, "resolveSelector");
function iy(t) {
  var e;
  if (t === "$particles") {
    if (!((e = game.modules.get("fxmaster")) != null && e.active))
      return console.warn(`[${T}] Picker: FXMaster not active, cannot resolve "$particles".`), null;
    const n = canvas.particleeffects;
    return n ? { kind: "particles", documents: [], placeables: [], target: n } : null;
  }
  return null;
}
c(iy, "resolveSpecial");
function iu(t, e, n) {
  const i = gf();
  if (!i)
    return console.warn(`[${T}] Picker: Tagger not available, cannot resolve tag "${t}".`), null;
  const r = i.getByTag(t, { sceneId: e.id });
  if (!(r != null && r.length)) return null;
  const a = [];
  for (const o of r) {
    const s = Qo(o);
    s && a.push(s);
  }
  return a.length === 0 ? null : {
    kind: a.length === 1 ? "placeable" : "multi-placeable",
    documents: a.map((o) => o.doc),
    placeables: a
  };
}
c(iu, "resolveTag");
function ry(t, e) {
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
      const a = Qo(r);
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
c(ry, "resolveById");
function ru(t, e, n) {
  const i = gf();
  if (!i)
    return console.warn(`[${T}] Picker: Tagger not available, cannot resolve multi-tag.`), null;
  const r = i.getByTag(t, {
    sceneId: e.id,
    matchAny: n
  });
  if (!(r != null && r.length)) return null;
  const a = [];
  for (const o of r) {
    const s = Qo(o);
    s && a.push(s);
  }
  return a.length === 0 ? null : {
    kind: a.length === 1 ? "placeable" : "multi-placeable",
    documents: a.map((o) => o.doc),
    placeables: a
  };
}
c(ru, "resolveMultiTag");
function ay(t) {
  const e = fromUuidSync(t);
  if (!e) return null;
  const n = Qo(e);
  return n ? {
    kind: "placeable",
    documents: [n.doc],
    placeables: [n]
  } : null;
}
c(ay, "resolveUUID");
function oy(t) {
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
c(oy, "adaptResolved");
function Qa(t) {
  var r;
  const e = /* @__PURE__ */ new Set();
  if (t.segments) {
    if (t.setup) for (const a of Object.keys(t.setup)) e.add(a);
    if (t.landing) for (const a of Object.keys(t.landing)) e.add(a);
    for (const a of Object.values(t.segments)) {
      if (a.setup) for (const o of Object.keys(a.setup)) e.add(o);
      if (a.landing) for (const o of Object.keys(a.landing)) e.add(o);
      a.timeline && $l(a.timeline, e), (r = a.gate) != null && r.target && e.add(a.gate.target);
    }
  } else {
    if (t.setup) for (const a of Object.keys(t.setup)) e.add(a);
    if (t.landing) for (const a of Object.keys(t.landing)) e.add(a);
    t.timeline && $l(t.timeline, e);
  }
  const n = /* @__PURE__ */ new Map(), i = [];
  for (const a of e) {
    const o = Zo(a), s = oy(o);
    s ? n.set(a, s) : i.push(a);
  }
  return i.length && console.warn(`[${T}] Cinematic: ${i.length} unresolved target(s): ${i.join(", ")}`), { targets: n, unresolved: i };
}
c(Qa, "resolveAllTargets");
function sy(t, e) {
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
c(sy, "captureSnapshot");
function ly(t) {
  const e = {};
  function n(i) {
    if (i)
      for (const [r, a] of Object.entries(i))
        e[r] || (e[r] = {}), Object.assign(e[r], a);
  }
  if (c(n, "mergeMap"), t.segments) {
    n(t.setup), n(t.landing);
    for (const i of Object.values(t.segments))
      n(i.setup), n(i.landing), i.timeline && Nl(i.timeline, e, n);
  } else
    n(t.setup), n(t.landing), t.timeline && Nl(t.timeline, e, n);
  return e;
}
c(ly, "gatherAllStateMaps");
function Nl(t, e, n) {
  var i;
  for (const r of t)
    if (!(r.delay != null || r.await != null || r.emit != null) && !(r.transitionTo != null || r.sound != null || r.stopSound != null)) {
      if ((i = r.parallel) != null && i.branches) {
        for (const a of r.parallel.branches)
          Nl(a, e, n);
        continue;
      }
      if (n(r.before), n(r.after), r.tweens)
        for (const a of r.tweens)
          a.target && a.attribute && (e[a.target] || (e[a.target] = {}), e[a.target][a.attribute] = "__snapshot__");
    }
}
c(Nl, "gatherFromEntries");
function $l(t, e) {
  for (const n of t)
    if (n.delay == null && n.await == null && n.emit == null && n.transitionTo == null && n.sound == null && n.stopSound == null) {
      if (n.parallel) {
        const i = n.parallel;
        if (i.branches)
          for (const r of i.branches)
            $l(r, e);
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
c($l, "collectSelectorsFromEntries");
const au = {
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
}, cy = /* @__PURE__ */ new Set([
  "alpha",
  "visible",
  "x",
  "y",
  "scale",
  "rotation"
]);
function vs(t, e, n) {
  const i = {};
  for (const [r, a] of Object.entries(t))
    e.has(r) ? i[r] = a : console.warn(`[${T}] Cinematic: blocked property "${r}" on ${n}.`);
  return i;
}
c(vs, "filterOverrides");
function Ie(t, e) {
  var i, r;
  if (!t) return;
  const n = [];
  for (const [a, o] of Object.entries(t)) {
    const s = e.get(a);
    if (s)
      if (s.kind === "particles") {
        if (s.target.destroyed) continue;
        const l = vs(o, cy, "$particles");
        for (const [u, d] of Object.entries(l))
          s.target[u] = d;
      } else if (s.kind === "multi-placeable")
        for (const { placeable: l, doc: u } of s.placeables) {
          if (!(u != null && u.parent) || !(l != null && l.scene)) continue;
          const d = u.documentName, h = au[d];
          if (!h) {
            console.warn(`[${T}] Cinematic: no allowlist for document type "${d}" on "${a}", skipping.`);
            continue;
          }
          const f = vs(o, h, `${d} "${a}"`);
          u.updateSource(f), n.push(l);
        }
      else {
        if (!((i = s.doc) != null && i.parent) || !((r = s.placeable) != null && r.scene)) continue;
        const l = s.doc.documentName, u = au[l];
        if (!u) {
          console.warn(`[${T}] Cinematic: no allowlist for document type "${l}" on "${a}", skipping.`);
          continue;
        }
        const d = vs(o, u, `${l} "${a}"`);
        s.doc.updateSource(d), n.push(s.placeable);
      }
  }
  for (const a of n)
    a.refresh();
}
c(Ie, "applyState");
function Fi(t, e) {
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
c(Fi, "refreshPerceptionIfNeeded");
const uy = {
  "tile-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "light-color": /* @__PURE__ */ new Set(["uuid", "toColor", "toAlpha", "mode"]),
  "light-state": /* @__PURE__ */ new Set(["uuid", "enabled"]),
  "particles-prop": /* @__PURE__ */ new Set(["attribute", "value"]),
  "camera-pan": /* @__PURE__ */ new Set(["x", "y", "scale"]),
  "token-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "drawing-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "sound-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"])
}, dy = /* @__PURE__ */ new Set(["easing"]), fy = /* @__PURE__ */ new Set(["type", "target"]);
function pf(t, e) {
  const { type: n, target: i, ...r } = t;
  if (!n)
    return console.warn(`[${T}] Cinematic: tween entry missing 'type', skipping.`), null;
  const a = {}, o = {}, s = uy[n];
  if (i === "$particles")
    a.target = "$particles";
  else if (i) {
    const l = e.get(i);
    if (!l) return null;
    l.kind === "multi-placeable" ? a.uuid = l.placeables.map((u) => u.doc.uuid) : a.uuid = l.doc.uuid;
  }
  for (const [l, u] of Object.entries(r))
    fy.has(l) || (dy.has(l) ? o[l] = u : (s != null && s.has(l), a[l] = u));
  return { type: n, params: a, opts: o };
}
c(pf, "compileTween");
const Ir = /* @__PURE__ */ new Map();
let my = 0;
async function hy(t) {
  var u, d, h, f, g;
  const { id: e, src: n, volume: i = 0.8, loop: r = !1, fadeIn: a } = t;
  if (!n) {
    console.warn(`[${T}] Cinematic sound: missing 'src', skipping.`);
    return;
  }
  const o = e || `__auto_${++my}`, s = {
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
  a && a > 0 && l.fade && l.fade(i, { duration: a, from: 0 }), Ir.set(o, { sound: l, config: t }), console.log(`[${T}] Cinematic sound: playing "${n}" as "${o}" (loop=${r}, vol=${i})`);
}
c(hy, "playLocalSound");
function ws(t) {
  var i, r;
  const e = Ir.get(t);
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
  Ir.delete(t);
}
c(ws, "stopCinematicSound");
function ou() {
  var t, e;
  for (const [n, i] of Ir)
    try {
      (e = (t = i.sound).stop) == null || e.call(t);
    } catch (r) {
      console.warn(`[${T}] Cinematic sound: error stopping "${n}" during cleanup:`, r);
    }
  Ir.clear();
}
c(ou, "stopAllCinematicSounds");
function gy(t, e, n, i = {}) {
  const { skipToStep: r, onStepComplete: a, timelineName: o } = i, s = new n().name(o ?? `cinematic-${canvas.scene.id}`);
  return s.beforeAll(() => {
    var l;
    try {
      Ie(t.setup, e), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    } catch (u) {
      throw console.error(`[${T}] Cinematic: error in beforeAll (setup state) on scene ${(l = canvas.scene) == null ? void 0 : l.id}:`, u), u;
    }
  }), bf(t.timeline, s, e, { skipToStep: r, onStepComplete: a }), { tl: s };
}
c(gy, "buildTimeline");
function yf(t, e) {
  var n;
  if (t)
    for (const i of t)
      for (const r of i) {
        if (r.before)
          try {
            Ie(r.before, e), Fi(r.before, e);
          } catch (a) {
            console.warn(`[${T}] Cinematic: error in skipped parallel before:`, a);
          }
        if (r.after)
          try {
            Ie(r.after, e), Fi(r.after, e);
          } catch (a) {
            console.warn(`[${T}] Cinematic: error in skipped parallel after:`, a);
          }
        (n = r.parallel) != null && n.branches && yf(r.parallel.branches, e);
      }
}
c(yf, "applyParallelStatesForSkip");
function bf(t, e, n, i = {}) {
  const { skipToStep: r, onStepComplete: a } = i;
  let o = -1;
  for (const s of t) {
    if (s.sound != null) {
      if (r != null && o < r) continue;
      const h = s.sound, { duration: f, loop: g, fireAndForget: p } = h, y = e.step();
      if (y.before(() => {
        hy(h);
      }), f && f > 0)
        if (p) {
          if (g && h.id) {
            const v = h.id, b = f;
            y.before(() => {
              setTimeout(() => ws(v), b);
            });
          }
        } else
          e.delay(f), g && e.step().before(() => {
            ws(h.id);
          });
      continue;
    }
    if (s.stopSound != null) {
      if (r != null && o < r) continue;
      const h = s.stopSound;
      e.step().before(() => {
        ws(h);
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
        yf(s.parallel.branches, n);
        continue;
      }
      const h = s.parallel, f = h.branches.map((g) => (p) => bf(g, p, n));
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
          Ie(s.before, n), Fi(s.before, n);
        } catch (h) {
          console.warn(`[${T}] Cinematic: error applying skipped step.before:`, h);
        }
      if (s.after)
        try {
          Ie(s.after, n), Fi(s.after, n);
        } catch (h) {
          console.warn(`[${T}] Cinematic: error applying skipped step.after:`, h);
        }
      continue;
    }
    const l = o, u = e.step();
    s.before && u.before(() => {
      var h;
      try {
        Ie(s.before, n), Fi(s.before, n);
      } catch (f) {
        throw console.error(`[${T}] Cinematic: error in step.before callback on scene ${(h = canvas.scene) == null ? void 0 : h.id}:`, f), f;
      }
    });
    const d = s.duration ?? 500;
    for (const h of s.tweens) {
      const f = pf(h, n);
      f && u.add(f.type, f.params, { ...f.opts, durationMS: d });
    }
    u.after(() => {
      var h;
      try {
        s.after && (Ie(s.after, n), Fi(s.after, n)), a == null || a(l);
      } catch (f) {
        throw console.error(`[${T}] Cinematic: error in step.after callback on scene ${(h = canvas.scene) == null ? void 0 : h.id}:`, f), f;
      }
    });
  }
}
c(bf, "compileCinematicEntries");
function Di(t, e, n) {
  if (t != null) {
    if (typeof t != "object" || Array.isArray(t)) {
      n.push({ path: e, level: "error", message: `Expected object, got ${Array.isArray(t) ? "array" : typeof t}` });
      return;
    }
    for (const [i, r] of Object.entries(t))
      (typeof r != "object" || r === null || Array.isArray(r)) && n.push({ path: `${e}["${i}"]`, level: "error", message: `Expected property overrides object, got ${Array.isArray(r) ? "array" : typeof r}` });
  }
}
c(Di, "validateStateMap");
function xl(t, e, n, i) {
  var r;
  for (let a = 0; a < t.length; a++) {
    const o = t[a], s = `${e}[${a}]`;
    if (!(o.delay != null || o.await != null || o.emit != null) && !(o.transitionTo != null || o.sound != null || o.stopSound != null)) {
      if ((r = o.parallel) != null && r.branches) {
        for (let l = 0; l < o.parallel.branches.length; l++)
          xl(o.parallel.branches[l], `${s}.parallel.branches[${l}]`, n, i);
        continue;
      }
      if (Di(o.before, `${s}.before`, i), Di(o.after, `${s}.after`, i), o.tweens)
        for (let l = 0; l < o.tweens.length; l++) {
          const u = o.tweens[l], d = `${s}.tweens[${l}]`;
          if (!u.type) {
            i.push({ path: d, level: "error", message: "Missing 'type' field" });
            continue;
          }
          const h = er(u.type);
          if (!h) {
            i.push({ path: d, level: "error", message: `Unknown tween type: "${u.type}"` });
            continue;
          }
          if (n)
            try {
              const f = pf(u, n);
              f ? h.validate(f.params) : u.target && i.push({ path: d, level: "warn", message: `Target "${u.target}" could not be resolved for compilation` });
            } catch (f) {
              i.push({ path: d, level: "error", message: f.message });
            }
          n && u.target && !n.has(u.target) && i.push({ path: `${d}.target`, level: "warn", message: `Target "${u.target}" is not resolved` });
        }
    }
  }
}
c(xl, "validateEntries");
function py(t, e = null) {
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
      Di(s.setup, `${l}.setup`, n), Di(s.landing, `${l}.landing`, n), s.timeline && Array.isArray(s.timeline) && xl(s.timeline, `${l}.timeline`, e, n), s.next && typeof s.next == "string" && !t.segments[s.next] && n.push({ path: `${l}.next`, level: "error", message: `Next segment "${s.next}" not found` });
    }
  } else
    Di(t.setup, "setup", n), Di(t.landing, "landing", n), t.timeline && Array.isArray(t.timeline) && xl(t.timeline, "timeline", e, n);
  return n;
}
c(py, "validateCinematicDeep");
const Es = 5, su = /* @__PURE__ */ new Set(["click", "tile-click", "keypress"]);
var le, he, Ue, ke, ht, fr, _l, vf, Y, _e, Oa, Te, vt;
const se = class se {
  constructor(e = null, { loadedHash: n = null, cinematicName: i = "default", segmentName: r = null } = {}) {
    k(this, Y);
    k(this, le);
    k(this, he);
    k(this, Ue);
    k(this, ke);
    var o;
    I(this, le, e ?? se.empty()), I(this, he, i), I(this, ke, n);
    const a = (o = m(this, le).cinematics) == null ? void 0 : o[m(this, he)];
    I(this, Ue, r ?? (a == null ? void 0 : a.entry) ?? "main");
  }
  static empty() {
    return {
      version: Es,
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
        return b.await != null && su.has(((w = b.await) == null ? void 0 : w.event) ?? "click");
      }
    )) {
      const b = s.filter((L) => L.transitionTo == null), w = s.find((L) => L.transitionTo != null), C = { timeline: b };
      if (a && Object.keys(a).length && (C.setup = a), o && Object.keys(o).length && (C.landing = o), w) {
        const L = w.transitionTo;
        L.scene && L.cinematic ? C.next = { segment: L.cinematic, scene: L.scene } : L.cinematic;
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
        if (b.await != null && su.has(((v = b.await) == null ? void 0 : v.event) ?? "click")) {
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
      (i = a.timeline) != null && i.length && (a.timeline = S(r = se, ht, _l).call(r, a.timeline));
    return n;
  }
  static fromScene(e, n = "default") {
    var o;
    const i = e == null ? void 0 : e.getFlag(T, "cinematic");
    let r = i ? foundry.utils.deepClone(i) : null;
    const a = i ? S(o = se, ht, vf).call(o, i) : null;
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
      r.version = Es;
    }
    return new se(r, { loadedHash: a, cinematicName: n });
  }
  /**
   * Check if the scene's cinematic flag has been modified since this state was loaded.
   * @param {object} scene  The Foundry scene document
   * @returns {boolean} true if scene data differs from what was loaded
   */
  isStale(e) {
    if (!m(this, ke)) return !1;
    const n = e == null ? void 0 : e.getFlag(T, "cinematic");
    return n ? !foundry.utils.objectsEqual(n, m(this, ke)) : !1;
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
      loadedHash: m(this, ke),
      cinematicName: e,
      segmentName: n.entry ?? "main"
    });
  }
  addCinematic(e) {
    if (!e || m(this, le).cinematics[e]) return this;
    const n = foundry.utils.deepClone(m(this, le));
    return n.cinematics[e] = se.emptyCinematic(), new se(n, {
      loadedHash: m(this, ke),
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
      loadedHash: m(this, ke),
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
      loadedHash: m(this, ke),
      cinematicName: a,
      segmentName: m(this, Ue)
    });
  }
  // ── Cinematic-level mutations ─────────────────────────────────────────
  setTrigger(e) {
    return S(this, Y, Oa).call(this, { trigger: e });
  }
  setTracking(e) {
    return S(this, Y, Oa).call(this, { tracking: e });
  }
  setSynchronized(e) {
    return S(this, Y, Oa).call(this, { synchronized: e });
  }
  // ── Segment-level mutations (setup/landing now live on segments) ──────
  setSetup(e) {
    return S(this, Y, Te).call(this, { setup: e });
  }
  setLanding(e) {
    return S(this, Y, Te).call(this, { landing: e });
  }
  // ── Segment management methods ────────────────────────────────────────
  switchSegment(e) {
    var n;
    return (n = m(this, Y, _e).segments) != null && n[e] ? new se(foundry.utils.deepClone(m(this, le)), {
      loadedHash: m(this, ke),
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
      loadedHash: m(this, ke),
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
      loadedHash: m(this, ke),
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
      loadedHash: m(this, ke),
      cinematicName: m(this, he),
      segmentName: o
    });
  }
  setSegmentGate(e) {
    return S(this, Y, Te).call(this, { gate: e ?? void 0 });
  }
  setSegmentNext(e) {
    return S(this, Y, Te).call(this, { next: e ?? void 0 });
  }
  setSegmentSetup(e) {
    return S(this, Y, Te).call(this, { setup: e });
  }
  setSegmentLanding(e) {
    return S(this, Y, Te).call(this, { landing: e });
  }
  listSegmentNames() {
    return Object.keys(m(this, Y, _e).segments ?? {});
  }
  // ── Timeline entry mutations (scoped to active segment) ──────────────
  addStep(e = -1) {
    const n = [...this.activeSegment.timeline], i = { duration: 1e3, tweens: [] };
    return e < 0 || e >= n.length ? n.push(i) : n.splice(e, 0, i), S(this, Y, Te).call(this, { timeline: n });
  }
  addDelay(e = -1, n = 1e3) {
    const i = [...this.activeSegment.timeline], r = { delay: n };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), S(this, Y, Te).call(this, { timeline: i });
  }
  addAwait(e = -1, n = null) {
    return console.warn(`[${T}] CinematicState.addAwait() is deprecated in v4. Use segment gates instead.`), this;
  }
  addEmit(e = -1, n = "") {
    const i = [...this.activeSegment.timeline], r = { emit: n };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), S(this, Y, Te).call(this, { timeline: i });
  }
  addParallel(e = -1) {
    const n = [...this.activeSegment.timeline], i = { parallel: { branches: [[], []], join: "all", overflow: "detach" } };
    return e < 0 || e >= n.length ? n.push(i) : n.splice(e, 0, i), S(this, Y, Te).call(this, { timeline: n });
  }
  addTransitionTo(e = -1, n = null) {
    return console.warn(`[${T}] CinematicState.addTransitionTo() is deprecated in v4. Use segment next edges instead.`), this;
  }
  addSound(e = -1, n = null) {
    const i = [...this.activeSegment.timeline], r = { sound: n ?? { src: "", volume: 0.8, loop: !1, duration: 0, fireAndForget: !1 } };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), S(this, Y, Te).call(this, { timeline: i });
  }
  addStopSound(e = -1, n = "") {
    const i = [...this.activeSegment.timeline], r = { stopSound: n };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), S(this, Y, Te).call(this, { timeline: i });
  }
  moveEntry(e, n) {
    if (e === n) return this;
    const i = [...this.activeSegment.timeline];
    if (e < 0 || e >= i.length) return this;
    if (n < 0 || n >= i.length) return this;
    const [r] = i.splice(e, 1);
    return i.splice(n, 0, r), S(this, Y, Te).call(this, { timeline: i });
  }
  removeEntry(e) {
    const n = [...this.activeSegment.timeline];
    return e < 0 || e >= n.length ? this : (n.splice(e, 1), S(this, Y, Te).call(this, { timeline: n }));
  }
  updateEntry(e, n) {
    const i = this.activeSegment.timeline.map((r, a) => a !== e ? r : { ...foundry.utils.deepClone(r), ...n });
    return S(this, Y, Te).call(this, { timeline: i });
  }
  // ── Tween mutations ──────────────────────────────────────────────────
  addTween(e, n = null) {
    const i = { type: "tile-prop", target: "", attribute: "alpha", value: 1 };
    return S(this, Y, vt).call(this, e, (r) => {
      const a = [...r.tweens ?? [], n ?? i];
      return { ...r, tweens: a };
    });
  }
  updateTween(e, n, i) {
    return S(this, Y, vt).call(this, e, (r) => {
      const a = (r.tweens ?? []).map((o, s) => s !== n ? o : { ...o, ...i });
      return { ...r, tweens: a };
    });
  }
  removeTween(e, n) {
    return S(this, Y, vt).call(this, e, (i) => {
      const r = (i.tweens ?? []).filter((a, o) => o !== n);
      return { ...i, tweens: r };
    });
  }
  updateStepDuration(e, n) {
    return S(this, Y, vt).call(this, e, (i) => ({ ...i, duration: Math.max(0, n) }));
  }
  // ── Parallel branch mutations ────────────────────────────────────────
  addBranch(e) {
    return S(this, Y, vt).call(this, e, (n) => {
      if (!n.parallel) return n;
      const i = [...n.parallel.branches, []];
      return { ...n, parallel: { ...n.parallel, branches: i } };
    });
  }
  removeBranch(e, n) {
    return S(this, Y, vt).call(this, e, (i) => {
      if (!i.parallel) return i;
      const r = i.parallel.branches.filter((a, o) => o !== n);
      return r.length < 1 ? i : { ...i, parallel: { ...i.parallel, branches: r } };
    });
  }
  addBranchEntry(e, n, i = null) {
    const r = { duration: 1e3, tweens: [] };
    return S(this, Y, vt).call(this, e, (a) => {
      if (!a.parallel) return a;
      const o = a.parallel.branches.map((s, l) => l !== n ? s : [...s, i ?? r]);
      return { ...a, parallel: { ...a.parallel, branches: o } };
    });
  }
  removeBranchEntry(e, n, i) {
    return S(this, Y, vt).call(this, e, (r) => {
      if (!r.parallel) return r;
      const a = r.parallel.branches.map((o, s) => s !== n ? o : o.filter((l, u) => u !== i));
      return { ...r, parallel: { ...r.parallel, branches: a } };
    });
  }
  updateBranchEntry(e, n, i, r) {
    return S(this, Y, vt).call(this, e, (a) => {
      if (!a.parallel) return a;
      const o = a.parallel.branches.map((s, l) => l !== n ? s : s.map((u, d) => d !== i ? u : { ...foundry.utils.deepClone(u), ...r }));
      return { ...a, parallel: { ...a.parallel, branches: o } };
    });
  }
  moveBranchEntry(e, n, i, r) {
    return i === r ? this : S(this, Y, vt).call(this, e, (a) => {
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
    const n = { ...foundry.utils.deepClone(m(this, le)), version: Es };
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
le = new WeakMap(), he = new WeakMap(), Ue = new WeakMap(), ke = new WeakMap(), ht = new WeakSet(), fr = /* @__PURE__ */ c(function(e) {
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
          return S(d = se, ht, _l).call(d, u);
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
        tweens: u.map(S(se, ht, fr))
      });
    } else if (o.length === 0) {
      const l = Math.max(500, ...s.map((h) => h.duration ?? 0)), { tweens: u, ...d } = a;
      n.push({
        ...d,
        duration: l,
        tweens: s.map(S(se, ht, fr))
      });
    } else {
      const l = Math.max(500, ...o.map((f) => f.duration ?? 0)), u = Math.max(500, ...s.map((f) => f.duration ?? 0)), { tweens: d, ...h } = a;
      n.push({
        parallel: {
          branches: [
            [{ ...h, duration: l, tweens: o.map(S(se, ht, fr)) }],
            [{ duration: u, tweens: s.map(S(se, ht, fr)) }]
          ],
          join: "all",
          overflow: "detach"
        }
      });
    }
  }
  return n;
}, "#migrateTimelineV5"), vf = /* @__PURE__ */ c(function(e) {
  return foundry.utils.deepClone(e);
}, "#computeHash"), Y = new WeakSet(), _e = /* @__PURE__ */ c(function() {
  return m(this, le).cinematics[m(this, he)];
}, "#active"), // ── Internal ─────────────────────────────────────────────────────────
/** Clone the full state with a patch to the active cinematic (cinematic-level props). */
Oa = /* @__PURE__ */ c(function(e) {
  const n = foundry.utils.deepClone(m(this, le));
  return Object.assign(n.cinematics[m(this, he)], e), new se(n, {
    loadedHash: m(this, ke),
    cinematicName: m(this, he),
    segmentName: m(this, Ue)
  });
}, "#cloneActive"), /** Clone the full state with a patch to the active segment within the active cinematic. */
Te = /* @__PURE__ */ c(function(e) {
  const n = foundry.utils.deepClone(m(this, le)), i = n.cinematics[m(this, he)].segments[m(this, Ue)];
  if (!i) return this;
  Object.assign(i, e);
  for (const [r, a] of Object.entries(i))
    a === void 0 && delete i[r];
  return new se(n, {
    loadedHash: m(this, ke),
    cinematicName: m(this, he),
    segmentName: m(this, Ue)
  });
}, "#cloneActiveSegment"), /** Mutate a single timeline entry within the active segment. */
vt = /* @__PURE__ */ c(function(e, n) {
  const i = this.activeSegment;
  if (!i || e < 0 || e >= i.timeline.length) return this;
  const r = i.timeline.map((a, o) => o !== e ? a : n(foundry.utils.deepClone(a)));
  return S(this, Y, Te).call(this, { timeline: r });
}, "#mutateEntry"), k(se, ht), c(se, "CinematicState");
let Vt = se;
const lu = [
  { value: "tile-prop", label: "Tile Prop" },
  { value: "light-color", label: "Light Color" },
  { value: "light-state", label: "Light State" },
  { value: "particles-prop", label: "Particles Prop" },
  { value: "camera-pan", label: "Camera Pan" },
  { value: "token-prop", label: "Token Prop" },
  { value: "drawing-prop", label: "Drawing Prop" },
  { value: "sound-prop", label: "Sound Prop" }
], wf = {
  "tile-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y, width, height" },
  "token-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y" },
  "drawing-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y" },
  "sound-prop": { form: "prop", attribute: "volume", value: 0.5, placeholder: "volume, radius" },
  "particles-prop": { form: "particles", attribute: "alpha", value: 1, placeholder: "alpha, rate, speed, size" },
  "camera-pan": { form: "camera", x: 0, y: 0, scale: 1 },
  "light-color": { form: "lightColor", toColor: "#ffffff", toAlpha: "", mode: "oklch" },
  "light-state": { form: "lightState", enabled: !0 }
}, yy = [
  { value: "canvasReady", label: "Canvas Ready" },
  { value: "manual", label: "Manual Only" }
];
function cu(t) {
  return t && (t.split("/").pop() || "").replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "-") || "";
}
c(cu, "soundIdFromPath");
function uu(t) {
  return t ? new Promise((e) => {
    const n = new Audio(t);
    n.addEventListener("loadedmetadata", () => {
      e(Math.round(n.duration * 1e3));
    }), n.addEventListener("error", () => e(0));
  }) : Promise.resolve(0);
}
c(uu, "loadAudioDurationMs");
const _n = 40, yr = 24, Or = 50, du = 50, Kn = 60, Zn = 10, Ss = 16, Ef = 40, Sf = 20, by = 90, fu = 70, mu = 8;
function es(t) {
  return { stepDuration: Math.max(500, t.duration ?? 500), detachOverflow: 0 };
}
c(es, "computeStepDurations");
function vy(t) {
  var i;
  const e = ((i = t.parallel) == null ? void 0 : i.branches) ?? [];
  let n = 0;
  for (const r of e) {
    let a = 0;
    for (const o of r)
      o.delay != null ? a += o.delay : o.await != null || o.emit != null || (o.sound != null ? a += o.sound.fireAndForget ? 0 : o.sound.duration ?? 0 : o.stopSound != null || (a += es(o).stepDuration));
    n = Math.max(n, a);
  }
  return Math.max(500, n);
}
c(vy, "computeParallelDuration");
function pc(t) {
  return t.reduce((e, n) => n.delay != null ? e + n.delay : n.await != null || n.emit != null || n.transitionTo != null ? e : n.sound != null ? e + (n.sound.fireAndForget ? 0 : n.sound.duration ?? 0) : n.stopSound != null ? e : n.parallel != null ? e + vy(n) : e + es(n).stepDuration, 0);
}
c(pc, "computeTotalDuration");
function wy(t, e) {
  if (t <= 0) return 0.1;
  const n = e / t;
  return Math.max(0.03, Math.min(0.5, n));
}
c(wy, "computeScale");
function Cf(t) {
  const e = t.tweens ?? [];
  if (e.length === 0) return "Empty";
  const n = e[0], i = (n.target ?? "").replace(/^tag:/, "#"), r = n.attribute ?? "";
  return n.type === "camera-pan" ? "Pan" : r === "alpha" ? `Fade ${i}` : r === "x" || r === "y" ? `Move ${i}` : n.type === "light-color" ? `Light ${i}` : n.type === "sound-prop" ? `Sound ${i}` : i ? `${i}` : "Step";
}
c(Cf, "deriveStepLabel");
function Ey(t, e, n, i, r) {
  var u, d;
  const a = [], o = [], s = [];
  let l = e;
  for (let h = 0; h < t.length; h++) {
    const f = t[h], g = `${i}.${h}`, p = r === g;
    if (f.delay != null) {
      const y = Math.max(Sf, f.delay * n);
      a.push({ type: "delay", leftPx: l, widthPx: y, label: `${f.delay}ms`, entryPath: g, selected: p }), l += y;
    } else if (f.await != null) {
      const y = ((u = f.await) == null ? void 0 : u.event) ?? "click", v = y === "tile-click" ? "fa-hand-pointer" : y === "signal" ? "fa-bolt" : "fa-pause";
      a.push({ type: "await", leftPx: l, widthPx: Ss, label: y, entryPath: g, selected: p, isGate: !0, gateIcon: v }), ((d = f.await) == null ? void 0 : d.event) === "signal" && s.push({ signal: f.await.signal, centerPx: l + Ss / 2 }), l += Ss;
    } else if (f.emit != null)
      a.push({ type: "emit", leftPx: l, widthPx: Zn, label: "emit", entryPath: g, selected: p, isMarker: !0 }), o.push({ signal: f.emit, centerPx: l + Zn / 2 });
    else if (f.sound != null) {
      const y = (f.sound.src || "").split("/").pop() || "Sound", v = f.sound.duration ?? 0;
      if (f.sound.fireAndForget ?? !1)
        a.push({ type: "sound", leftPx: l, widthPx: Zn, label: y, entryPath: g, selected: p, isMarker: !0 });
      else {
        const w = v > 0 ? Math.max(Kn, v * n) : Kn, C = (f.sound.loop ?? !1) && v <= 0;
        a.push({ type: "sound", leftPx: l, widthPx: w, label: y, entryPath: g, selected: p, hasTrailingArrow: C }), l += w;
      }
    } else if (f.stopSound != null)
      a.push({ type: "stopSound", leftPx: l, widthPx: Zn, label: "Stop", entryPath: g, selected: p, isMarker: !0 });
    else {
      const { stepDuration: y } = es(f), v = Math.max(Ef, y * n), b = Cf(f);
      a.push({ type: "step", leftPx: l, widthPx: v, label: b, entryPath: g, selected: p }), l += v;
    }
  }
  return { blocks: a, width: l - e, emits: o, awaits: s };
}
c(Ey, "computeBranchLane");
function hu(t) {
  return yr + t * _n;
}
c(hu, "laneIndexToY");
function Sy(t, e) {
  const n = [];
  for (const i of t.emits)
    for (const r of t.awaits) {
      if (i.signal !== r.signal) continue;
      const a = i.centerPx, o = hu(i.laneIndex) + _n / 2, s = r.centerPx, l = hu(r.laneIndex) + _n / 2, u = l - o, d = (a + s) / 2, h = o + Math.sign(u || 1) * Math.min(40, Math.abs(u) * 0.5 + 20), f = l - Math.sign(u || 1) * Math.min(40, Math.abs(u) * 0.5 + 20);
      n.push({
        pathD: `M ${a} ${o} C ${d} ${h}, ${d} ${f}, ${s} ${l}`,
        signal: i.signal
      });
    }
  return n;
}
c(Sy, "computeSignalArcs");
function Cy(t, e) {
  const n = [];
  if (t <= 0) return n;
  const i = e * 1e3;
  let r;
  i >= 200 ? r = 500 : i >= 80 ? r = 1e3 : i >= 40 ? r = 2e3 : r = 5e3;
  for (let a = 0; a <= t + r; a += r) {
    const o = a >= 1e3 ? `${(a / 1e3).toFixed(a % 1e3 === 0 ? 0 : 1)}s` : `${a}ms`;
    n.push({ px: Or + a * e, label: o });
  }
  return n;
}
c(Cy, "computeTimeMarkers");
function Ty(t) {
  const e = [];
  for (let n = 0; n < t.length - 1; n++) {
    const i = t[n], r = t[n + 1], a = i.leftPx + i.widthPx + (r.leftPx - (i.leftPx + i.widthPx)) / 2, o = yr + _n / 2;
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
c(Ty, "computeInsertionPoints");
function Ly(t, { selectedPath: e, windowWidth: n }) {
  const i = pc(t), r = n - 70 - 100, a = wy(i, r), o = [], s = [], l = { emits: [], awaits: [] }, u = [];
  o.push({
    type: "setup",
    leftPx: 0,
    widthPx: Or,
    label: "Setup",
    entryPath: "setup",
    selected: e === "setup"
  });
  let d = Or;
  for (let w = 0; w < t.length; w++) {
    const C = t[w], L = `timeline.${w}`, A = e === L;
    if (C.delay != null) {
      const O = Math.max(Sf, C.delay * a);
      o.push({
        type: "delay",
        leftPx: d,
        widthPx: O,
        label: `${C.delay}ms`,
        entryPath: L,
        selected: A
      }), d += O;
    } else if (C.emit != null)
      o.push({
        type: "emit",
        leftPx: d,
        widthPx: Zn,
        label: "Emit",
        entryPath: L,
        selected: A,
        isMarker: !0
      }), l.emits.push({
        signal: C.emit,
        centerPx: d + Zn / 2,
        laneIndex: 0
      });
    else if (C.sound != null) {
      const O = (C.sound.src || "").split("/").pop() || "Sound", M = C.sound.duration ?? 0;
      if (C.sound.fireAndForget ?? !1) {
        const j = M > 0 ? Math.max(Kn, M * a) : Kn, D = (C.sound.loop ?? !1) && M <= 0, P = {
          type: "sound",
          leftPx: d,
          widthPx: j,
          label: O,
          entryPath: L,
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
        const j = M > 0 ? Math.max(Kn, M * a) : Kn, D = (C.sound.loop ?? !1) && M <= 0;
        o.push({
          type: "sound",
          leftPx: d,
          widthPx: j,
          label: O,
          entryPath: L,
          selected: A,
          hasTrailingArrow: D
        }), d += j;
      }
    } else if (C.stopSound != null)
      o.push({
        type: "stopSound",
        leftPx: d,
        widthPx: Zn,
        label: "Stop",
        entryPath: L,
        selected: A,
        isMarker: !0
      });
    else if (C.parallel != null) {
      const O = C.parallel.branches ?? [], M = d, _ = [];
      let j = 0;
      for (let P = 0; P < O.length; P++) {
        const $ = `timeline.${w}.parallel.branches.${P}`, { blocks: R, width: B, emits: W, awaits: H } = Ey(O[P], M, a, $, e);
        _.push({ label: `Br ${P + 1}`, blocks: R }), j = Math.max(j, B);
        const U = s.length * 10 + P + 1;
        for (const K of W) l.emits.push({ ...K, laneIndex: U });
        for (const K of H) l.awaits.push({ ...K, laneIndex: U });
      }
      const D = Math.max(Kn, j);
      o.push({
        type: "parallel",
        leftPx: M,
        widthPx: D,
        label: `${O.length} br`,
        entryPath: L,
        selected: A
      }), s.push({ parallelEntryIndex: w, startPx: M, lanes: _ }), d += D;
    } else {
      const { stepDuration: O } = es(C), M = Math.max(Ef, O * a), _ = Cf(C);
      o.push({
        type: "step",
        leftPx: d,
        widthPx: M,
        label: _,
        entryPath: L,
        selected: A
      }), d += M;
    }
  }
  o.push({
    type: "landing",
    leftPx: d,
    widthPx: du,
    label: "Landing",
    entryPath: "landing",
    selected: e === "landing"
  }), d += du;
  const h = s.flatMap((w) => w.lanes), f = h.length;
  for (const w of u)
    h.push({ label: w.label, blocks: w.blocks });
  const g = Sy(l, h.length), p = [];
  for (let w = 0; w < u.length; w++) {
    const C = f + w;
    for (const L of u[w].blocks) {
      const A = L.leftPx, O = yr + _n, M = yr + (1 + C) * _n + _n / 2;
      p.push({ x: A, y1: O, y2: M });
    }
  }
  const y = Cy(i, a), v = Ty(o), b = yr + (1 + h.length) * _n;
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
c(Ly, "computeLanes");
function Iy(t) {
  if (t <= 0) return "0s";
  if (t < 1e3) return `${t}ms`;
  const e = t / 1e3;
  return e % 1 === 0 ? `${e}s` : `${e.toFixed(1)}s`;
}
c(Iy, "formatDuration");
function Oy(t, e) {
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
  let u = mu;
  for (const b of o) {
    const w = n[b], C = pc(w.timeline ?? []), L = Iy(C), A = b === i, O = b === e, M = !a.has(b), _ = by;
    l.push({
      name: b,
      durationMs: C,
      durationLabel: L,
      isEntry: A,
      isActive: O,
      isOrphan: M,
      leftPx: u,
      widthPx: _,
      hasGate: !!w.gate,
      gateEvent: ((g = w.gate) == null ? void 0 : g.event) ?? null
    }), u += _ + fu;
  }
  const d = [], h = new Map(l.map((b) => [b.name, b]));
  for (const b of o) {
    const w = n[b];
    if (!w.next) continue;
    const C = typeof w.next == "string" ? w.next : (p = w.next) == null ? void 0 : p.segment;
    if (!C) continue;
    const L = h.get(b), A = h.get(C);
    if (!L || !A) continue;
    const O = n[C], M = ((y = O == null ? void 0 : O.gate) == null ? void 0 : y.event) ?? null, _ = typeof w.next == "object" && ((v = w.next) == null ? void 0 : v.scene);
    d.push({
      fromName: b,
      toName: C,
      gateLabel: M,
      isCrossScene: _,
      fromRightPx: L.leftPx + L.widthPx,
      toLeftPx: A.leftPx
    });
  }
  const f = u - fu + mu;
  return { nodes: l, edges: d, totalWidthPx: f };
}
c(Oy, "computeSegmentGraph");
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
function gu(t) {
  const e = qn(t);
  return !e || e.type !== "timeline" ? null : e.index;
}
c(gu, "getTimelineIndexFromPath");
function Ay(t) {
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
c(Ay, "countUniqueTargets");
function ky(t, e) {
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
c(ky, "stepNumberForPath");
function My(t) {
  return {
    isSetup: !0,
    targetCount: Object.keys(t.setup ?? {}).length
  };
}
c(My, "buildSetupDetail");
function Ny(t) {
  return {
    isLanding: !0,
    targetCount: Object.keys(t.landing ?? {}).length
  };
}
c(Ny, "buildLandingDetail");
function $y(t) {
  return { type: "delay", isDelay: !0, delay: t.delay };
}
c($y, "buildDelayDetail");
function xy(t) {
  return { type: "emit", isEmit: !0, signal: t.emit };
}
c(xy, "buildEmitDetail");
function _y(t) {
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
c(_y, "buildSoundDetail");
function Fy(t) {
  return {
    type: "stopSound",
    isStopSound: !0,
    stopSoundId: t.stopSound
  };
}
c(Fy, "buildStopSoundDetail");
function Dy(t, e) {
  var o;
  const n = t.parallel, i = n.join ?? "all", r = n.overflow ?? "detach", a = (n.branches ?? []).map((s, l) => ({
    branchIndex: l,
    label: `Branch ${l + 1}`,
    entries: (s ?? []).map((u, d) => {
      var C, L;
      const h = u.delay != null, f = u.await != null, g = u.emit != null, p = u.sound != null, y = u.stopSound != null, v = !h && !f && !g && !p && !y;
      let b, w;
      return h ? (b = `${u.delay}ms`, w = "delay") : f ? (b = "Await", w = ((C = u.await) == null ? void 0 : C.event) ?? "click") : g ? (b = "Emit", w = u.emit || "(unnamed)") : p ? (b = "Sound", w = (u.sound.src || "").split("/").pop() || "(none)") : y ? (b = "Stop Sound", w = u.stopSound || "(no id)") : (b = "Step", w = `${((L = u.tweens) == null ? void 0 : L.length) ?? 0} tweens`), { branchEntryIndex: d, isDelay: h, isAwait: f, isEmit: g, isSound: p, isStopSound: y, isStep: v, label: b, sub: w };
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
c(Dy, "buildParallelDetail");
function Py(t, e, n, i) {
  const r = dc(), a = (t.tweens ?? []).map((l, u) => {
    const d = `${e}.tweens.${u}`, h = n.has(d), f = l.type ?? "tile-prop", g = lu.find((b) => b.value === f), p = wf[f], y = (p == null ? void 0 : p.form) ?? "prop", v = l.mode ?? "oklch";
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
      typeOptions: lu.map((b) => ({
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
    stepNumber: ky(e, i),
    stepDuration: t.duration ?? 1e3,
    tweens: a,
    beforeSummary: o.length ? `${o.length} target${o.length !== 1 ? "s" : ""}` : "(none)",
    afterSummary: s.length ? `${s.length} target${s.length !== 1 ? "s" : ""}` : "(none)"
  };
}
c(Py, "buildStepDetail");
function Ry(t, { state: e, expandedTweens: n }) {
  const i = qn(t);
  if (!i) return null;
  if (i.type === "setup") return My(e);
  if (i.type === "landing") return Ny(e);
  const r = Za(t, e);
  return r ? r.delay != null ? $y(r) : r.emit != null ? xy(r) : r.sound != null ? _y(r) : r.stopSound != null ? Fy(r) : r.parallel != null && i.type === "timeline" ? Dy(r) : Py(r, t, n, e) : null;
}
c(Ry, "buildDetail");
function Hy({ state: t, mutate: e }) {
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
              e(() => new Vt(l));
            else if (l.segments !== void 0) {
              const u = { version: 4, cinematics: { [t.activeCinematicName]: l } };
              e(() => new Vt(u, { cinematicName: t.activeCinematicName }));
            } else if (l.timeline !== void 0) {
              const u = { version: 3, cinematics: { [t.activeCinematicName]: l } };
              e(() => new Vt(u, { cinematicName: t.activeCinematicName }));
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
c(Hy, "showImportDialog");
function eo(t, { state: e, mutate: n }) {
  const i = t === "setup" ? e.setup : e.landing, r = JSON.stringify(i ?? {}, null, 2);
  new Dialog({
    title: `Edit ${t.charAt(0).toUpperCase() + t.slice(1)}`,
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON map of target selector → property overrides:</p>
			<textarea id="cinematic-json-edit" style="width:100%;height:200px;font-family:monospace;font-size:0.8rem">${Nt(r)}</textarea>
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
function pu(t, { selectedPath: e, state: n, mutate: i }) {
  const r = Za(e, n);
  if (!r || r.delay != null) return;
  const a = r[t] ?? {}, o = JSON.stringify(a, null, 2);
  new Dialog({
    title: `Edit Step ${t.charAt(0).toUpperCase() + t.slice(1)}`,
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON map of target selector → property overrides:</p>
			<textarea id="cinematic-json-edit" style="width:100%;height:200px;font-family:monospace;font-size:0.8rem">${Nt(o)}</textarea>
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
c(pu, "showEditStepStateDialog");
function qy({ selectedPath: t, state: e, mutate: n }) {
  const i = qn(t);
  if (!i || i.type !== "timeline") return;
  const r = e.timeline[i.index];
  if (!(r != null && r.parallel)) return;
  const a = JSON.stringify(r.parallel.branches ?? [], null, 2);
  new Dialog({
    title: "Edit Parallel Branches",
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON array of branch timelines:</p>
			<textarea id="cinematic-json-edit" style="width:100%;height:250px;font-family:monospace;font-size:0.8rem">${Nt(a)}</textarea>
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
c(qy, "showEditParallelJsonDialog");
var Nu, In, Pn, Aa, Tf;
const Et = class Et extends Un(Bn) {
  constructor(n = {}) {
    super(n);
    k(this, Pn);
    k(this, In, null);
    I(this, In, n.scene ?? canvas.scene ?? null);
  }
  async _prepareContext() {
    var r, a, o;
    const n = m(this, Pn, Aa), i = ((a = n == null ? void 0 : n.getSeenStatus) == null ? void 0 : a.call(n, (r = m(this, In)) == null ? void 0 : r.id)) ?? [];
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
    super._onRender(n, i), S(this, Pn, Tf).call(this);
  }
};
In = new WeakMap(), Pn = new WeakSet(), Aa = /* @__PURE__ */ c(function() {
  var n, i;
  return (i = (n = game.modules.get(T)) == null ? void 0 : n.api) == null ? void 0 : i.cinematic;
}, "#api"), Tf = /* @__PURE__ */ c(function() {
  var i, r;
  const n = this.element;
  n instanceof HTMLElement && (n.querySelectorAll("[data-action='reset-user']").forEach((a) => {
    a.addEventListener("click", async () => {
      var l;
      const o = a.dataset.userId;
      if (!o) return;
      const s = m(this, Pn, Aa);
      s != null && s.resetForUser && (await s.resetForUser((l = m(this, In)) == null ? void 0 : l.id, o), this.render({ force: !0 }));
    });
  }), (i = n.querySelector("[data-action='reset-all']")) == null || i.addEventListener("click", async () => {
    var o;
    const a = m(this, Pn, Aa);
    a != null && a.resetForAll && (await a.resetForAll((o = m(this, In)) == null ? void 0 : o.id), this.render({ force: !0 }));
  }), (r = n.querySelector("[data-action='refresh']")) == null || r.addEventListener("click", () => {
    this.render({ force: !0 });
  }));
}, "#bindEvents"), c(Et, "CinematicTrackingApplication"), ye(Et, "APP_ID", `${T}-cinematic-tracking`), ye(Et, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Re(Et, Et, "DEFAULT_OPTIONS"),
  {
    id: Et.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Nu = Re(Et, Et, "DEFAULT_OPTIONS")) == null ? void 0 : Nu.classes) ?? [], "eidolon-cinematic-tracking-window", "themed"])
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
)), ye(Et, "PARTS", {
  content: {
    template: `modules/${T}/templates/cinematic-tracking.html`
  }
});
let Fl = Et;
function jy(t, e) {
  var n, i, r, a, o, s, l, u, d;
  (n = t.querySelector("[data-action='save']")) == null || n.addEventListener("click", () => e.save()), (i = t.querySelector("[data-action='play-preview']")) == null || i.addEventListener("click", () => e.play()), (r = t.querySelector("[data-action='reset-tracking']")) == null || r.addEventListener("click", () => e.resetTracking()), (a = t.querySelector("[data-action='export-json']")) == null || a.addEventListener("click", () => e.exportJSON()), (o = t.querySelector("[data-action='undo']")) == null || o.addEventListener("click", () => e.undo()), (s = t.querySelector("[data-action='redo']")) == null || s.addEventListener("click", () => e.redo()), (l = t.querySelector("[data-action='validate']")) == null || l.addEventListener("click", () => e.validate()), (u = t.querySelector("[data-action='import-json']")) == null || u.addEventListener("click", () => e.importJSON()), (d = t.querySelector("[data-action='open-tracking']")) == null || d.addEventListener("click", () => {
    new Fl({ scene: e.scene }).render(!0);
  });
}
c(jy, "bindToolbarEvents");
function By(t, e) {
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
      content: `<label style="display:flex;align-items:center;gap:0.5rem"><span>Name:</span><input id="cinematic-rename" type="text" style="flex:1" value="${Nt(o)}" /></label>`,
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
c(By, "bindCinematicSelectorEvents");
function Uy(t, e) {
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
        const s = gu(n), l = gu(o);
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
c(Uy, "bindSwimlaneEvents");
function Vy(t, e) {
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
    eo("setup", { state: e.state, mutate: e.mutate });
  }), (s = t.querySelector("[data-action='edit-landing']")) == null || s.addEventListener("click", () => {
    eo("landing", { state: e.state, mutate: e.mutate });
  }), (l = t.querySelector("[data-action='edit-before']")) == null || l.addEventListener("click", () => {
    pu("before", { selectedPath: e.selectedPath, state: e.state, mutate: e.mutate });
  }), (u = t.querySelector("[data-action='edit-after']")) == null || u.addEventListener("click", () => {
    pu("after", { selectedPath: e.selectedPath, state: e.state, mutate: e.mutate });
  }), (d = t.querySelector("[data-action='change-trigger']")) == null || d.addEventListener("change", (g) => {
    e.mutate((p) => p.setTrigger(g.target.value));
  }), (h = t.querySelector("[data-action='change-tracking']")) == null || h.addEventListener("change", (g) => {
    e.mutate((p) => p.setTracking(g.target.checked));
  }), (f = t.querySelector("[data-action='change-synchronized']")) == null || f.addEventListener("change", (g) => {
    e.mutate((p) => p.setSynchronized(g.target.checked));
  });
}
c(Vy, "bindDetailPanelEvents");
const Ji = /* @__PURE__ */ new WeakMap(), to = /* @__PURE__ */ new Set(), no = /* @__PURE__ */ new Set(), yu = {
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
  var p, y, v;
  if (!t) return !1;
  Xi(t);
  const n = e.mode ?? (e.color != null ? "custom" : "hover"), i = yu[n] ?? yu.hover, r = e.color ?? i.borderColor, a = e.alpha ?? i.borderAlpha, o = e.color ?? i.spriteTint, s = i.spriteAlpha, l = e.pulse ?? i.pulse, u = { border: null, sprite: null, pulseData: null, mode: n }, d = ((p = t.document) == null ? void 0 : p.width) ?? t.w ?? 100, h = ((y = t.document) == null ? void 0 : y.height) ?? t.h ?? 100, f = new PIXI.Graphics();
  f.lineStyle(i.borderWidth, r, a), f.drawRect(0, 0, d, h), t.addChild(f), u.border = f;
  const g = Gy(t, o, s);
  if (g && (canvas.controls.debug.addChild(g), no.add(g), u.sprite = g), l && ((v = canvas.app) != null && v.ticker)) {
    const b = {
      elapsed: 0,
      fn: /* @__PURE__ */ c((w) => {
        b.elapsed += w;
        const C = (Math.sin(b.elapsed * 0.05) + 1) / 2;
        u.border && (u.border.alpha = a * (0.4 + 0.6 * C)), u.sprite && (u.sprite.alpha = s * (0.5 + 0.5 * C));
      }, "fn")
    };
    canvas.app.ticker.add(b.fn), u.pulseData = b, to.add(b);
  }
  return Ji.set(t, u), !0;
}
c(io, "addHighlight");
function Xi(t) {
  var n, i;
  if (!t) return;
  const e = Ji.get(t);
  e && (e.pulseData && ((i = (n = canvas.app) == null ? void 0 : n.ticker) == null || i.remove(e.pulseData.fn), to.delete(e.pulseData)), e.border && (e.border.parent && e.border.parent.removeChild(e.border), e.border.destroy({ children: !0 })), e.sprite && (e.sprite.parent && e.sprite.parent.removeChild(e.sprite), e.sprite.destroy({ children: !0 }), no.delete(e.sprite)), Ji.delete(t));
}
c(Xi, "removeHighlight");
function Lf(t) {
  return Ji.has(t);
}
c(Lf, "hasHighlight");
function ka() {
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
        const d = Ji.get(u);
        d && (d.border && (d.border.parent && d.border.parent.removeChild(d.border), d.border.destroy({ children: !0 })), Ji.delete(u));
      }
}
c(ka, "clearAllHighlights");
function Gy(t, e, n) {
  var a;
  const i = t.mesh;
  if (!((a = i == null ? void 0 : i.texture) != null && a.baseTexture)) return null;
  const r = PIXI.Sprite.from(i.texture);
  return r.isSprite = !0, r.anchor.set(i.anchor.x, i.anchor.y), r.width = i.width, r.height = i.height, r.scale = i.scale, r.position = t.center, r.angle = i.angle, r.alpha = n, r.tint = e, r.name = "eidolonPickerHighlight", r;
}
c(Gy, "createTintSprite");
let Jn = null;
function If(t) {
  var p, y, v;
  Jn && Jn.cancel();
  const { placeableType: e = "Tile", onPick: n, onCancel: i } = t;
  let r = null;
  const a = `control${e}`, o = `hover${e}`, s = /* @__PURE__ */ c((b, w) => {
    var L;
    if (!w) return;
    const C = b.document ?? b;
    (L = b.release) == null || L.call(b), n(C);
  }, "onControl"), l = /* @__PURE__ */ c((b, w) => {
    w ? (r = b, io(b, { mode: "pick" })) : r === b && (Xi(b), r = null);
  }, "onHoverIn"), u = /* @__PURE__ */ c((b) => {
    b.key === "Escape" && (b.preventDefault(), b.stopPropagation(), g());
  }, "onKeydown"), d = /* @__PURE__ */ c((b) => {
    b.preventDefault(), g();
  }, "onContextMenu"), h = Hooks.on(a, s), f = Hooks.on(o, l);
  document.addEventListener("keydown", u, { capture: !0 }), (p = canvas.stage) == null || p.addEventListener("rightclick", d), (v = (y = ui.notifications) == null ? void 0 : y.info) == null || v.call(y, `Pick mode active — click a ${e.toLowerCase()} on the canvas, or press ESC to cancel.`, { permanent: !1 });
  function g() {
    var b;
    Jn && (Jn = null, Hooks.off(a, h), Hooks.off(o, f), document.removeEventListener("keydown", u, { capture: !0 }), (b = canvas.stage) == null || b.removeEventListener("rightclick", d), r && (Xi(r), r = null), i == null || i());
  }
  return c(g, "cancel"), Jn = { cancel: g }, { cancel: g };
}
c(If, "enterPickMode");
function mr() {
  Jn && Jn.cancel();
}
c(mr, "cancelPickMode");
const zy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cancelPickMode: mr,
  enterPickMode: If
}, Symbol.toStringTag, { value: "Module" }));
var $u, Me, Ve, Vr, On, Gr, zr, Ze, An, fe, Of, Dl, Af, kf, Mf, Pl, Rl, Nf, $f;
const ut = class ut extends Un(Bn) {
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
    k(this, Me, []);
    /** @type {boolean} Whether pick mode is active. */
    k(this, Ve, !1);
    /** @type {string} Placeable type (Tile, Token, etc.). */
    k(this, Vr, "Tile");
    /** @type {string} Current tag match mode. */
    k(this, On, "any");
    /** @type {((selectors: string[]) => void) | null} */
    k(this, Gr, null);
    /** @type {(() => void) | null} */
    k(this, zr, null);
    /** @type {Promise resolve function for the open() API. */
    k(this, Ze, null);
    /** @type {PlaceableObject | null} Currently hovered tile in the browser. */
    k(this, An, null);
    I(this, Me, [...n.selections ?? []]), I(this, Vr, n.placeableType ?? "Tile"), I(this, Gr, n.onApply ?? null), I(this, zr, n.onCancel ?? null);
  }
  // ── Context ───────────────────────────────────────────────────────────
  async _prepareContext() {
    var r;
    const n = S(this, fe, Pl).call(this), i = (((r = canvas.tiles) == null ? void 0 : r.placeables) ?? []).map((a, o) => {
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
      selections: m(this, Me),
      selectionCount: m(this, Me).length,
      pickModeActive: m(this, Ve),
      tagModeIsAny: m(this, On) === "any",
      tagModeIsAll: m(this, On) === "all",
      tagPreviewCount: 0,
      tiles: i,
      tileCount: i.length
    };
  }
  // ── Render & Events ───────────────────────────────────────────────────
  _onRender(n, i) {
    super._onRender(n, i), S(this, fe, Of).call(this), S(this, fe, Rl).call(this);
  }
  async _onClose(n) {
    return m(this, Ve) && (mr(), I(this, Ve, !1)), ka(), m(this, Ze) && (m(this, Ze).call(this, null), I(this, Ze, null)), super._onClose(n);
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
      const r = new ut({
        ...n,
        onApply: /* @__PURE__ */ c((a) => i(a), "onApply"),
        onCancel: /* @__PURE__ */ c(() => i(null), "onCancel")
      });
      I(r, Ze, i), r.render(!0);
    });
  }
};
Me = new WeakMap(), Ve = new WeakMap(), Vr = new WeakMap(), On = new WeakMap(), Gr = new WeakMap(), zr = new WeakMap(), Ze = new WeakMap(), An = new WeakMap(), fe = new WeakSet(), Of = /* @__PURE__ */ c(function() {
  var a, o, s, l;
  const n = this.element;
  if (!(n instanceof HTMLElement)) return;
  const i = n.querySelector("[data-role='tag-input']"), r = n.querySelector("[data-role='tag-mode']");
  r == null || r.addEventListener("change", (u) => {
    I(this, On, u.target.value);
  }), i == null || i.addEventListener("input", () => {
    S(this, fe, Af).call(this, n);
  }), i == null || i.addEventListener("keydown", (u) => {
    u.key === "Enter" && (u.preventDefault(), S(this, fe, Dl).call(this, n));
  }), (a = n.querySelector("[data-action='add-tag-selector']")) == null || a.addEventListener("click", () => {
    S(this, fe, Dl).call(this, n);
  }), (o = n.querySelector("[data-action='toggle-pick-mode']")) == null || o.addEventListener("click", () => {
    m(this, Ve) ? (mr(), I(this, Ve, !1)) : (I(this, Ve, !0), If({
      placeableType: m(this, Vr),
      onPick: /* @__PURE__ */ c((u) => {
        S(this, fe, kf).call(this, u.id);
      }, "onPick"),
      onCancel: /* @__PURE__ */ c(() => {
        I(this, Ve, !1), this.render({ force: !0 });
      }, "onCancel")
    })), this.render({ force: !0 });
  }), n.querySelectorAll("[data-action='toggle-tile']").forEach((u) => {
    u.addEventListener("click", () => {
      const d = u.dataset.docId;
      d && S(this, fe, Mf).call(this, d);
    }), u.addEventListener("mouseenter", () => {
      var f, g;
      const d = u.dataset.docId;
      if (!d) return;
      const h = (g = (f = canvas.tiles) == null ? void 0 : f.placeables) == null ? void 0 : g.find((p) => p.document.id === d);
      h && (I(this, An, h), io(h, { mode: "hover" }));
    }), u.addEventListener("mouseleave", () => {
      m(this, An) && (Xi(m(this, An)), I(this, An, null), S(this, fe, Rl).call(this));
    });
  }), n.querySelectorAll("[data-action='remove-selection']").forEach((u) => {
    u.addEventListener("click", () => {
      const d = Number(u.dataset.selectionIndex);
      Number.isNaN(d) || (m(this, Me).splice(d, 1), this.render({ force: !0 }));
    });
  }), (s = n.querySelector("[data-action='apply']")) == null || s.addEventListener("click", () => {
    S(this, fe, Nf).call(this);
  }), (l = n.querySelector("[data-action='cancel']")) == null || l.addEventListener("click", () => {
    S(this, fe, $f).call(this);
  });
}, "#bindEvents"), // ── Tag helpers ───────────────────────────────────────────────────────
Dl = /* @__PURE__ */ c(function(n) {
  var s;
  const i = n.querySelector("[data-role='tag-input']"), r = (s = i == null ? void 0 : i.value) == null ? void 0 : s.trim();
  if (!r) return;
  const a = r.split(",").map((l) => l.trim()).filter(Boolean);
  if (a.length === 0) return;
  const o = hf(a, m(this, On));
  o && !m(this, Me).includes(o) && m(this, Me).push(o), i && (i.value = ""), this.render({ force: !0 });
}, "#addTagSelector"), Af = /* @__PURE__ */ c(function(n) {
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
kf = /* @__PURE__ */ c(function(n) {
  const i = `id:${n}`;
  m(this, Me).includes(i) || (m(this, Me).push(i), this.render({ force: !0 }));
}, "#addIdSelector"), Mf = /* @__PURE__ */ c(function(n) {
  const i = `id:${n}`, r = m(this, Me).indexOf(i);
  r >= 0 ? m(this, Me).splice(r, 1) : m(this, Me).push(i), this.render({ force: !0 });
}, "#toggleIdSelector"), /**
 * Get the set of document IDs that are currently selected across all selector types.
 * Resolves tag/tags-any/tags-all selectors to find matching document IDs.
 * @returns {Set<string>}
 */
Pl = /* @__PURE__ */ c(function() {
  const n = /* @__PURE__ */ new Set();
  for (const i of m(this, Me)) {
    const r = gc(i);
    if (r.type === "id") {
      n.add(r.value);
      continue;
    }
    const a = Zo(i);
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
Rl = /* @__PURE__ */ c(function() {
  var r, a;
  const n = S(this, fe, Pl).call(this), i = ((r = canvas.tiles) == null ? void 0 : r.placeables) ?? [];
  for (const o of i) {
    const s = (a = o.document) == null ? void 0 : a.id;
    if (!s) continue;
    const l = n.has(s), u = o === m(this, An), d = Lf(o);
    l && !u && !d ? io(o, { mode: "selected" }) : !l && d && !u && Xi(o);
  }
}, "#refreshSelectionHighlights"), // ── Apply / Cancel ──────────────────────────────────────────────────
Nf = /* @__PURE__ */ c(function() {
  var i;
  m(this, Ve) && (mr(), I(this, Ve, !1)), ka();
  const n = [...m(this, Me)];
  (i = m(this, Gr)) == null || i.call(this, n), m(this, Ze) && (m(this, Ze).call(this, n), I(this, Ze, null)), this.close({ force: !0 });
}, "#doApply"), $f = /* @__PURE__ */ c(function() {
  var n;
  m(this, Ve) && (mr(), I(this, Ve, !1)), ka(), (n = m(this, zr)) == null || n.call(this), m(this, Ze) && (m(this, Ze).call(this, null), I(this, Ze, null)), this.close({ force: !0 });
}, "#doCancel"), c(ut, "PlaceablePickerApplication"), ye(ut, "APP_ID", `${T}-placeable-picker`), ye(ut, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Re(ut, ut, "DEFAULT_OPTIONS"),
  {
    id: ut.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...(($u = Re(ut, ut, "DEFAULT_OPTIONS")) == null ? void 0 : $u.classes) ?? [], "eidolon-placeable-picker-window", "themed"])
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
)), ye(ut, "PARTS", {
  content: {
    template: `modules/${T}/templates/placeable-picker.html`
  }
});
let ro = ut;
function Wy(t, e) {
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
          const l = wf[s], u = { type: s };
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
c(Wy, "bindTweenFieldEvents");
function Yy(t, e) {
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
    b.id || (b.id = cu(v));
    const w = await uu(v);
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
        b.id || (b.id = cu(v));
        const w = await uu(v);
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
c(Yy, "bindSoundFieldEvents");
function Ky(t, e) {
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
    qy({ selectedPath: e.selectedPath, state: e.state, mutate: e.mutate });
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
c(Ky, "bindSpecialEntryEvents");
function Jy(t, e) {
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
c(Jy, "bindSegmentGraphEvents");
function Xy(t, e) {
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
    const { enterPickMode: d } = await Promise.resolve().then(() => zy);
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
    eo("setup", { state: e.state, mutate: e.mutate });
  }), (l = t.querySelector("[data-action='edit-segment-landing']")) == null || l.addEventListener("click", () => {
    eo("landing", { state: e.state, mutate: e.mutate });
  });
}
c(Xy, "bindSegmentDetailEvents");
var xu, Ge, z, et, kn, It, tt, ze, Po, Fe, nt, Ro, sn, Wi, mt, ci, Mn, di, q, xf, _f, Ff, Df, bn, ql, jl, Bl, Ul, Pf, vn, Vl, Rf, Hf, qf, jf, Bf, Gl, hr;
const St = class St extends Un(Bn) {
  constructor(n = {}) {
    super(n);
    k(this, q);
    k(this, Ge, null);
    k(this, z, null);
    k(this, et, null);
    k(this, kn, /* @__PURE__ */ new Set());
    k(this, It, !1);
    k(this, tt, null);
    k(this, ze, null);
    k(this, Po, 120);
    k(this, Fe, []);
    k(this, nt, -1);
    k(this, Ro, 50);
    k(this, sn, null);
    k(this, Wi, null);
    k(this, mt, null);
    k(this, ci, null);
    k(this, Mn, null);
    k(this, di, null);
    I(this, Ge, n.scene ?? canvas.scene ?? null), I(this, z, Vt.fromScene(m(this, Ge)));
  }
  // ── Context ───────────────────────────────────────────────────────────
  async _prepareContext() {
    var g, p;
    const n = Oy(m(this, z), m(this, z).activeSegmentName), i = Ly(m(this, z).timeline, {
      selectedPath: m(this, et),
      windowWidth: ((g = this.position) == null ? void 0 : g.width) ?? 1100
    }), r = m(this, et) != null ? Ry(m(this, et), { state: m(this, z), expandedTweens: m(this, kn) }) : null, a = m(this, z).listCinematicNames(), o = m(this, z).activeCinematicName, l = m(this, z).listSegmentNames().length > 1, u = m(this, z).activeSegment, d = (u == null ? void 0 : u.gate) ?? null, h = (u == null ? void 0 : u.next) ?? null, f = typeof h == "string" ? h : (h == null ? void 0 : h.segment) ?? null;
    return {
      // Toolbar
      sceneName: ((p = m(this, Ge)) == null ? void 0 : p.name) ?? "No scene",
      dirty: m(this, It),
      canUndo: m(this, q, ql),
      canRedo: m(this, q, jl),
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
      triggerOptions: yy.map((y) => ({
        ...y,
        selected: y.value === m(this, z).trigger
      })),
      entryCount: m(this, z).timeline.length,
      totalDuration: i.totalDurationMs,
      targetCount: Ay(m(this, z)),
      setupCount: Object.keys(m(this, z).setup ?? {}).length,
      landingCount: Object.keys(m(this, z).landing ?? {}).length
    };
  }
  // ── Render & Events ───────────────────────────────────────────────────
  _onRender(n, i) {
    var r, a, o;
    if (super._onRender(n, i), S(this, q, xf).call(this), !m(this, ci)) {
      const s = (a = (r = game.modules.get(T)) == null ? void 0 : r.api) == null ? void 0 : a.cinematic;
      s != null && s.onPlaybackProgress ? (I(this, ci, s.onPlaybackProgress((l) => S(this, q, Bf).call(this, l))), console.log("[cinematic-editor] Subscribed to playback progress events")) : console.warn("[cinematic-editor] onPlaybackProgress not available on API", s);
    }
    if (m(this, di) && ((o = this.element) == null || o.querySelectorAll(".cinematic-editor__segment-node").forEach((s) => {
      s.classList.toggle("cinematic-editor__segment-node--playing", s.dataset.segmentName === m(this, di));
    }), m(this, mt) && m(this, mt).segmentName === m(this, z).activeSegmentName)) {
      const s = performance.now() - m(this, mt).startTime;
      m(this, mt).durationMs - s > 0 && S(this, q, Gl).call(this, m(this, mt).durationMs, m(this, mt).startTime);
    }
    m(this, sn) || (I(this, sn, (s) => {
      !s.ctrlKey && !s.metaKey || (s.key === "z" && !s.shiftKey ? (s.preventDefault(), S(this, q, Bl).call(this)) : (s.key === "z" && s.shiftKey || s.key === "y") && (s.preventDefault(), S(this, q, Ul).call(this)));
    }), document.addEventListener("keydown", m(this, sn)));
  }
  async close(n = {}) {
    if (m(this, ze) && S(this, q, vn).call(this), m(this, It) && !n.force) {
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
      i === "save" && await S(this, q, Vl).call(this);
    }
    return super.close(n);
  }
  async _onClose(n) {
    var i;
    return m(this, tt) !== null && (clearTimeout(m(this, tt)), I(this, tt, null)), m(this, sn) && (document.removeEventListener("keydown", m(this, sn)), I(this, sn, null)), (i = m(this, ci)) == null || i.call(this), I(this, ci, null), S(this, q, hr).call(this), super._onClose(n);
  }
};
Ge = new WeakMap(), z = new WeakMap(), et = new WeakMap(), kn = new WeakMap(), It = new WeakMap(), tt = new WeakMap(), ze = new WeakMap(), Po = new WeakMap(), Fe = new WeakMap(), nt = new WeakMap(), Ro = new WeakMap(), sn = new WeakMap(), Wi = new WeakMap(), mt = new WeakMap(), ci = new WeakMap(), Mn = new WeakMap(), di = new WeakMap(), q = new WeakSet(), // ── Event binding ─────────────────────────────────────────────────────
xf = /* @__PURE__ */ c(function() {
  const n = this.element;
  if (!(n instanceof HTMLElement)) return;
  const i = S(this, q, _f).call(this);
  jy(n, i), By(n, i), Jy(n, i), Uy(n, i), Vy(n, i), Wy(n, i), Yy(n, i), Ky(n, i), Xy(n, i);
}, "#bindEvents"), _f = /* @__PURE__ */ c(function() {
  const n = this;
  return {
    // State access (read-only getters — closures over `self` for private field access)
    get state() {
      return m(n, z);
    },
    get selectedPath() {
      return m(n, et);
    },
    get scene() {
      return m(n, Ge);
    },
    get expandedTweens() {
      return m(n, kn);
    },
    get insertMenuState() {
      return m(n, Wi);
    },
    // Mutations
    mutate: /* @__PURE__ */ c((i) => S(this, q, bn).call(this, i), "mutate"),
    setSelectedPath: /* @__PURE__ */ c((i) => {
      I(this, et, i), this.render({ force: !0 });
    }, "setSelectedPath"),
    render: /* @__PURE__ */ c(() => this.render({ force: !0 }), "render"),
    // Cinematic switching (needs full state swap + clear)
    switchCinematic: /* @__PURE__ */ c((i) => {
      m(this, ze) && S(this, q, vn).call(this), I(this, z, m(this, z).switchCinematic(i)), I(this, et, null), m(this, kn).clear(), this.render({ force: !0 });
    }, "switchCinematic"),
    // Segment management
    selectSegment: /* @__PURE__ */ c((i) => {
      m(this, ze) && S(this, q, vn).call(this), I(this, z, m(this, z).switchSegment(i)), I(this, et, null), m(this, kn).clear(), this.render({ force: !0 });
    }, "selectSegment"),
    addSegment: /* @__PURE__ */ c((i) => {
      S(this, q, bn).call(this, (r) => r.addSegment(i, r.activeSegmentName));
    }, "addSegment"),
    removeSegment: /* @__PURE__ */ c((i) => {
      S(this, q, bn).call(this, (r) => r.removeSegment(i));
    }, "removeSegment"),
    renameSegment: /* @__PURE__ */ c((i, r) => {
      S(this, q, bn).call(this, (a) => a.renameSegment(i, r));
    }, "renameSegment"),
    setSegmentGate: /* @__PURE__ */ c((i) => {
      S(this, q, bn).call(this, (r) => r.setSegmentGate(i));
    }, "setSegmentGate"),
    setSegmentNext: /* @__PURE__ */ c((i) => {
      S(this, q, bn).call(this, (r) => r.setSegmentNext(i));
    }, "setSegmentNext"),
    // Tween debouncing
    queueTweenChange: /* @__PURE__ */ c((i, r) => S(this, q, Pf).call(this, i, r), "queueTweenChange"),
    flushTweenChanges: /* @__PURE__ */ c(() => {
      m(this, ze) && S(this, q, vn).call(this);
    }, "flushTweenChanges"),
    flushTweenChangesImmediate: /* @__PURE__ */ c(() => {
      m(this, tt) !== null && clearTimeout(m(this, tt)), I(this, tt, null), S(this, q, vn).call(this);
    }, "flushTweenChangesImmediate"),
    // Path utilities
    parseEntryPath: qn,
    getEntryAtPath: /* @__PURE__ */ c((i) => Za(i, m(this, z)), "getEntryAtPath"),
    // Insert menu
    showInsertMenu: /* @__PURE__ */ c((i, r, a) => S(this, q, Ff).call(this, i, r, a), "showInsertMenu"),
    hideInsertMenu: /* @__PURE__ */ c(() => S(this, q, Df).call(this), "hideInsertMenu"),
    // Toolbar actions
    save: /* @__PURE__ */ c(() => S(this, q, Vl).call(this), "save"),
    play: /* @__PURE__ */ c(() => S(this, q, Rf).call(this), "play"),
    resetTracking: /* @__PURE__ */ c(() => S(this, q, Hf).call(this), "resetTracking"),
    exportJSON: /* @__PURE__ */ c(() => S(this, q, qf).call(this), "exportJSON"),
    validate: /* @__PURE__ */ c(() => S(this, q, jf).call(this), "validate"),
    importJSON: /* @__PURE__ */ c(() => Hy({ state: m(this, z), mutate: /* @__PURE__ */ c((i) => S(this, q, bn).call(this, i), "mutate") }), "importJSON"),
    undo: /* @__PURE__ */ c(() => S(this, q, Bl).call(this), "undo"),
    redo: /* @__PURE__ */ c(() => S(this, q, Ul).call(this), "redo")
  };
}, "#createEventContext"), // ── Insert menu ───────────────────────────────────────────────────────
Ff = /* @__PURE__ */ c(function(n, i, r) {
  var l;
  const a = (l = this.element) == null ? void 0 : l.querySelector(".cinematic-editor__insert-menu");
  if (!a) return;
  const o = n.getBoundingClientRect();
  document.body.appendChild(a), a.style.display = "", a.style.position = "fixed", a.style.left = `${o.left}px`;
  const s = a.offsetHeight || 200;
  o.bottom + 4 + s > window.innerHeight ? a.style.top = `${o.top - s - 4}px` : a.style.top = `${o.bottom + 4}px`, I(this, Wi, { insertIndex: i, lane: r });
}, "#showInsertMenu"), Df = /* @__PURE__ */ c(function() {
  var i, r;
  const n = document.body.querySelector(".cinematic-editor__insert-menu") ?? ((i = this.element) == null ? void 0 : i.querySelector(".cinematic-editor__insert-menu"));
  if (n) {
    n.style.display = "none";
    const a = (r = this.element) == null ? void 0 : r.querySelector(".cinematic-editor");
    a && n.parentNode !== a && a.appendChild(n);
  }
  I(this, Wi, null);
}, "#hideInsertMenu"), // ── State mutation ────────────────────────────────────────────────────
bn = /* @__PURE__ */ c(function(n) {
  I(this, Fe, m(this, Fe).slice(0, m(this, nt) + 1)), m(this, Fe).push(m(this, z)), m(this, Fe).length > m(this, Ro) && m(this, Fe).shift(), I(this, nt, m(this, Fe).length - 1), I(this, z, n(m(this, z))), I(this, It, !0), this.render({ force: !0 });
}, "#mutate"), ql = /* @__PURE__ */ c(function() {
  return m(this, nt) >= 0;
}, "#canUndo"), jl = /* @__PURE__ */ c(function() {
  return m(this, nt) < m(this, Fe).length - 1;
}, "#canRedo"), Bl = /* @__PURE__ */ c(function() {
  m(this, q, ql) && (m(this, nt) === m(this, Fe).length - 1 && m(this, Fe).push(m(this, z)), I(this, z, m(this, Fe)[m(this, nt)]), as(this, nt)._--, I(this, It, !0), this.render({ force: !0 }));
}, "#undo"), Ul = /* @__PURE__ */ c(function() {
  m(this, q, jl) && (as(this, nt)._++, I(this, z, m(this, Fe)[m(this, nt) + 1]), I(this, It, !0), this.render({ force: !0 }));
}, "#redo"), Pf = /* @__PURE__ */ c(function(n, i) {
  var r;
  m(this, et) != null && (I(this, ze, {
    ...m(this, ze) ?? {},
    entryPath: m(this, et),
    tweenIndex: n,
    patch: { ...((r = m(this, ze)) == null ? void 0 : r.patch) ?? {}, ...i }
  }), m(this, tt) !== null && clearTimeout(m(this, tt)), I(this, tt, setTimeout(() => {
    I(this, tt, null), S(this, q, vn).call(this);
  }, m(this, Po))));
}, "#queueTweenChange"), vn = /* @__PURE__ */ c(function() {
  if (!m(this, ze)) return;
  const { entryPath: n, tweenIndex: i, patch: r } = m(this, ze);
  I(this, ze, null);
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
    I(this, It, !0);
  }
}, "#flushTweenChanges"), Vl = /* @__PURE__ */ c(async function() {
  var n, i, r, a, o, s;
  if (m(this, Ge)) {
    if (m(this, ze) && S(this, q, vn).call(this), m(this, z).isStale(m(this, Ge))) {
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
        I(this, z, Vt.fromScene(m(this, Ge), m(this, z).activeCinematicName)), I(this, It, !1), I(this, Fe, []), I(this, nt, -1), this.render({ force: !0 }), (i = (n = ui.notifications) == null ? void 0 : n.info) == null || i.call(n, "Cinematic reloaded from scene.");
        return;
      }
      if (!l) return;
    }
    try {
      await m(this, z).save(m(this, Ge)), I(this, z, Vt.fromScene(m(this, Ge), m(this, z).activeCinematicName)), I(this, It, !1), (a = (r = ui.notifications) == null ? void 0 : r.info) == null || a.call(r, "Cinematic saved."), this.render({ force: !0 });
    } catch (l) {
      console.error(`${T} | Cinematic save failed`, l), (s = (o = ui.notifications) == null ? void 0 : o.error) == null || s.call(o, "Failed to save cinematic data.");
    }
  }
}, "#onSave"), Rf = /* @__PURE__ */ c(async function() {
  var i, r, a, o, s;
  const n = (r = (i = game.modules.get(T)) == null ? void 0 : i.api) == null ? void 0 : r.cinematic;
  if (!(n != null && n.play)) {
    (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, "Cinematic API not available.");
    return;
  }
  await n.play((s = m(this, Ge)) == null ? void 0 : s.id, m(this, z).activeCinematicName);
}, "#onPlay"), Hf = /* @__PURE__ */ c(async function() {
  var i, r, a, o, s;
  const n = (r = (i = game.modules.get(T)) == null ? void 0 : i.api) == null ? void 0 : r.cinematic;
  n != null && n.reset && (await n.reset((a = m(this, Ge)) == null ? void 0 : a.id, m(this, z).activeCinematicName), (s = (o = ui.notifications) == null ? void 0 : o.info) == null || s.call(o, "Cinematic tracking reset."));
}, "#onResetTracking"), qf = /* @__PURE__ */ c(async function() {
  var i, r;
  const n = JSON.stringify(m(this, z).toJSON(), null, 2);
  try {
    await navigator.clipboard.writeText(n), (r = (i = ui.notifications) == null ? void 0 : i.info) == null || r.call(i, "Cinematic JSON copied to clipboard.");
  } catch {
    new Dialog({
      title: "Cinematic JSON",
      content: `<textarea style="width:100%;height:300px;font-family:monospace;font-size:0.8rem">${Nt(n)}</textarea>`,
      buttons: { ok: { label: "Close" } }
    }).render(!0);
  }
}, "#onExportJSON"), jf = /* @__PURE__ */ c(function() {
  var l, u;
  const n = m(this, z).toJSON(), { targets: i, unresolved: r } = Qa(n), a = py(n, i), o = [
    ...r.map((d) => ({ path: "targets", level: "warn", message: `Unresolved target: "${d}"` })),
    ...a
  ];
  if (o.length === 0) {
    (u = (l = ui.notifications) == null ? void 0 : l.info) == null || u.call(l, "Cinematic validation passed — no issues found.");
    return;
  }
  const s = o.map((d) => {
    const h = d.level === "error" ? "fa-circle-xmark" : "fa-triangle-exclamation", f = d.level === "error" ? "#e74c3c" : "#f39c12";
    return `<li style="margin:0.3rem 0"><i class="fa-solid ${h}" style="color:${f};margin-right:0.3rem"></i><strong>${Nt(d.path)}</strong>: ${Nt(d.message)}</li>`;
  });
  new Dialog({
    title: "Cinematic Validation",
    content: `<p>${o.length} issue(s) found:</p><ul style="list-style:none;padding:0;max-height:300px;overflow:auto">${s.join("")}</ul>`,
    buttons: { ok: { label: "Close" } }
  }).render(!0);
}, "#onValidate"), // ── Playback progress ────────────────────────────────────────────────
Bf = /* @__PURE__ */ c(function(n) {
  var i, r, a, o, s, l;
  switch (console.log(`[cinematic-editor] playback event: ${n.type}`, n), n.type) {
    case "segment-start":
      I(this, di, n.segmentName), n.segmentName !== m(this, z).activeSegmentName ? (I(this, z, m(this, z).switchSegment(n.segmentName)), I(this, et, null), m(this, kn).clear(), this.render({ force: !0 })) : (i = this.element) == null || i.querySelectorAll(".cinematic-editor__segment-node").forEach((u) => {
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
      I(this, mt, { segmentName: n.segmentName, startTime: performance.now(), durationMs: n.durationMs }), n.segmentName === m(this, z).activeSegmentName && S(this, q, Gl).call(this, n.durationMs);
      break;
    case "timeline-end":
      S(this, q, hr).call(this), I(this, mt, null);
      break;
    case "playback-end":
      S(this, q, hr).call(this), I(this, mt, null), I(this, di, null), (l = this.element) == null || l.querySelectorAll(".cinematic-editor__segment-node--playing, .cinematic-editor__segment-node--gate-waiting").forEach((u) => {
        u.classList.remove("cinematic-editor__segment-node--playing", "cinematic-editor__segment-node--gate-waiting");
      });
      break;
  }
}, "#onPlaybackEvent"), Gl = /* @__PURE__ */ c(function(n, i = null) {
  var u, d;
  S(this, q, hr).call(this);
  const r = (u = this.element) == null ? void 0 : u.querySelector(".cinematic-editor__playback-cursor"), a = (d = this.element) == null ? void 0 : d.querySelector(".cinematic-editor__swimlane");
  if (console.log(`[cinematic-editor] startCursor: duration=${n}, cursor=${!!r}, swimlane=${!!a}, width=${a == null ? void 0 : a.scrollWidth}`), !r || !a || n <= 0) return;
  r.style.display = "block";
  const o = i ?? performance.now(), s = a.scrollWidth, l = /* @__PURE__ */ c(() => {
    const h = performance.now() - o, f = Math.min(h / n, 1), g = Or + f * (s - Or);
    r.style.left = `${g}px`, f < 1 && I(this, Mn, requestAnimationFrame(l));
  }, "tick");
  I(this, Mn, requestAnimationFrame(l));
}, "#startCursorAnimation"), hr = /* @__PURE__ */ c(function() {
  var i;
  m(this, Mn) && (cancelAnimationFrame(m(this, Mn)), I(this, Mn, null));
  const n = (i = this.element) == null ? void 0 : i.querySelector(".cinematic-editor__playback-cursor");
  n && (n.style.display = "none");
}, "#stopCursorAnimation"), c(St, "CinematicEditorApplication"), ye(St, "APP_ID", `${T}-cinematic-editor`), ye(St, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Re(St, St, "DEFAULT_OPTIONS"),
  {
    id: St.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((xu = Re(St, St, "DEFAULT_OPTIONS")) == null ? void 0 : xu.classes) ?? [], "eidolon-cinematic-editor-window", "themed"])
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
)), ye(St, "PARTS", {
  content: {
    template: `modules/${T}/templates/cinematic-editor.html`
  }
});
let Hl = St;
const Uf = /* @__PURE__ */ new Map();
function me(t, e) {
  Uf.set(t, e);
}
c(me, "registerBehaviour");
function Ma(t) {
  return Uf.get(t);
}
c(Ma, "getBehaviour");
function Qy(t, e, n) {
  let i, r, a;
  if (e === 0)
    i = r = a = n;
  else {
    const o = /* @__PURE__ */ c((u, d, h) => (h < 0 && (h += 1), h > 1 && (h -= 1), h < 0.16666666666666666 ? u + (d - u) * 6 * h : h < 0.5 ? d : h < 0.6666666666666666 ? u + (d - u) * (0.6666666666666666 - h) * 6 : u), "hue2rgb"), s = n < 0.5 ? n * (1 + e) : n + e - n * e, l = 2 * n - s;
    i = o(l, s, t + 1 / 3), r = o(l, s, t), a = o(l, s, t - 1 / 3);
  }
  return Math.round(i * 255) << 16 | Math.round(r * 255) << 8 | Math.round(a * 255);
}
c(Qy, "hslToInt");
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
  const i = e.factor ?? 1.12, r = e.durationFrames ?? 15, a = it(e.easing ?? "easeOutCubic"), o = n.scale.x, s = n.scale.y, l = o * i, u = s * i;
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
      s = (s + l * i) % 1, n.tint = Qy(s, r, a);
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
  const i = e.speed ?? 0.02, r = e.amplitude ?? 6, a = it("easeOutBounce"), o = n.position.y;
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
      const C = 16, L = l / C, A = b(v);
      f.moveTo(A.x, A.y);
      for (let O = 1; O <= C; O++) {
        const M = b(v + O * L);
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
        const L = w - s;
        g.beginFill(16777215, 1), g.moveTo(L, 0), g.lineTo(L + s, 0), g.lineTo(L + s - a, a), g.lineTo(L - a, a), g.closePath(), g.endFill();
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
  const r = e.offsetX ?? 0, a = e.offsetY ?? 20, o = e.durationFrames ?? 20, s = it(e.easing ?? "easeOutCubic"), l = e.delay ?? 0, u = i.position.x, d = i.position.y, h = i.alpha;
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
    let C, L;
    return w < 0.7 ? (C = Math.random() * r, L = a) : w < 0.85 ? (C = 0, L = a * 0.5 + Math.random() * a * 0.5) : (C = r, L = a * 0.5 + Math.random() * a * 0.5), {
      x: C,
      y: L,
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
        const L = v[C];
        if (L.life += w, L.life >= L.maxLife) {
          v.splice(C, 1);
          continue;
        }
        L.x += L.vx * w, L.y += L.vy * w, L.vx += (Math.random() - 0.5) * 0.05 * w;
      }
      f.clear();
      for (const C of v) {
        const L = 1 - C.life / C.maxLife;
        f.beginFill(l, u * L * (n.alpha ?? 1)), f.drawCircle(C.x, C.y, C.size), f.endFill();
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
  for (let L = 0; L < s; L++)
    b.push({
      phase: L / s * o,
      speedMul: 0.7 + Math.random() * 0.6,
      color: L % 2 === 0 ? u : d
    });
  function w(L) {
    return L = (L % o + o) % o, L < r ? { x: L, y: 0 } : (L -= r, L < a ? { x: r, y: L } : (L -= a, L < r ? { x: r - L, y: a } : (L -= r, { x: 0, y: a - L })));
  }
  c(w, "perimeterPoint");
  let C = 0;
  return {
    update(L) {
      C += L, g.visible = n.visible !== !1, g.alpha = f * (n.alpha ?? 1), g.scale.set(n.scale.x / p, n.scale.y / y), g.angle = n.angle - v, g.clear();
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
  let C = 0, L = 0;
  return {
    update(A) {
      C += A, g.visible = n.visible !== !1, g.scale.set(n.scale.x / y, n.scale.y / v), g.angle = n.angle - b, C >= L && w.length < s && (w.push({ radius: 0, alpha: h }), L = C + l);
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
  for (let L = 0; L < o; L++) {
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
    update(L) {
      if (h.visible = n.visible !== !1, h.scale.set(n.scale.x / p, n.scale.y / y), h.angle = n.angle - v, w)
        C += L * 0.03;
      else {
        w = !0;
        for (const O of b)
          O.grown || (O.currentLength += (O.targetLength - O.currentLength) * d * L, O.currentLength >= O.targetLength * 0.99 ? (O.currentLength = O.targetLength, O.grown = !0) : w = !1);
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
  const r = e.offsetY ?? 6, a = e.blur ?? 6, o = e.alpha ?? 0.35, s = e.color ?? 0, l = e.durationFrames ?? 12, u = it(e.easing ?? "easeOutCubic"), d = new i();
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
  const i = e.attribute ?? "alpha", r = e.from ?? 0.85, a = e.to ?? 1, o = e.period ?? 1500, s = it(e.easing ?? "easeInOutCosine"), u = { alpha: "alpha", rotation: "angle" }[i] ?? i, d = n[u];
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
  const i = e.fromColor ?? "#ffffff", r = e.toColor ?? "#ffcc88", a = e.mode ?? "oklch", o = e.period ?? 3e3, s = it(e.easing ?? "easeInOutCosine"), l = fc(a), u = foundry.utils.Color, d = u.from(i), h = u.from(r), f = n.tint;
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
  const i = e.fromScale ?? 0.95, r = e.toScale ?? 1.05, a = e.period ?? 2e3, o = it(e.easing ?? "easeInOutCosine"), s = n.scale.x, l = n.scale.y;
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
const sr = {
  always: [],
  idle: ["float", "glow"],
  hover: ["scale"],
  dim: ["none"]
};
function Zy(t) {
  if (!t) return { ...sr };
  const e = /* @__PURE__ */ c((n, i) => n === void 0 ? i : typeof n == "string" ? [n] : typeof n == "object" && !Array.isArray(n) && n.name ? [n] : Array.isArray(n) ? n : i, "normalize");
  return {
    always: e(t.always, sr.always),
    idle: e(t.idle, sr.idle),
    hover: e(t.hover, sr.hover),
    dim: e(t.dim, sr.dim)
  };
}
c(Zy, "normalizeConfig");
var Ne, Ot, ln, qt, fi, Nn, jt, At, cn, ve, Vf, Na, Gf, zf, Wf, Yf, Kf, Jf;
const Sr = class Sr {
  /**
   * @param {PlaceableObject} placeable
   * @param {object|undefined} animationConfig  Raw animation config from the await entry
   */
  constructor(e, n) {
    k(this, ve);
    k(this, Ne);
    k(this, Ot);
    k(this, ln, null);
    k(this, qt, []);
    k(this, fi, []);
    k(this, Nn, null);
    k(this, jt, null);
    k(this, At, null);
    k(this, cn, 0);
    I(this, Ne, e), I(this, Ot, Zy(n));
  }
  /** Current animation state name. */
  get state() {
    return m(this, ln);
  }
  /**
   * Start animating in the given state.
   * @param {string} [state="idle"]
   */
  start(e = "idle") {
    var r;
    S(this, ve, Vf).call(this);
    const n = ((r = m(this, Ne).document) == null ? void 0 : r.id) ?? "?", i = m(this, jt);
    i && console.log(`%c[TileAnimator ${n}] start("${e}") canonical: pos=(${i.x.toFixed(2)}, ${i.y.toFixed(2)}) scale=(${i.scaleX.toFixed(4)}, ${i.scaleY.toFixed(4)}) alpha=${i.alpha.toFixed(4)} angle=${i.angle.toFixed(2)}`, "color: #FFAA44; font-weight: bold"), S(this, ve, Kf).call(this), S(this, ve, Wf).call(this, e), I(this, Nn, (a) => {
      m(this, At) && S(this, ve, Na).call(this);
      for (const o of m(this, fi)) o.update(a);
      for (const o of m(this, qt)) o.update(a);
      S(this, ve, zf).call(this, a);
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
    if (e === m(this, ln)) return;
    const n = ((h = m(this, Ne).document) == null ? void 0 : h.id) ?? "?", i = m(this, Ne).mesh, r = m(this, Ot)[m(this, ln)] ?? m(this, Ot).idle ?? ["none"], a = m(this, Ot)[e] ?? m(this, Ot).idle ?? ["none"], o = r.map((f) => typeof f == "string" ? f : f == null ? void 0 : f.name), s = a.map((f) => typeof f == "string" ? f : f == null ? void 0 : f.name);
    if (console.log(`%c[TileAnimator ${n}] setState: ${m(this, ln)} → ${e}`, "color: #44DDFF; font-weight: bold"), console.log(`  old behaviours: [${o.join(", ")}]  →  new: [${s.join(", ")}]`), i && console.log(`  mesh BEFORE detach: pos=(${i.position.x.toFixed(2)}, ${i.position.y.toFixed(2)}) scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)} angle=${i.angle.toFixed(2)}`), m(this, jt)) {
      const f = m(this, jt);
      console.log(`  canonical: pos=(${f.x.toFixed(2)}, ${f.y.toFixed(2)}) scale=(${f.scaleX.toFixed(4)}, ${f.scaleY.toFixed(4)}) alpha=${f.alpha.toFixed(4)} angle=${f.angle.toFixed(2)}`);
    }
    const l = /* @__PURE__ */ new Map();
    for (let f = 0; f < m(this, qt).length; f++) {
      const g = r[f], p = typeof g == "string" ? g : g == null ? void 0 : g.name;
      p && l.set(p, m(this, qt)[f]);
    }
    const u = [], d = /* @__PURE__ */ new Set();
    for (const f of a) {
      const g = typeof f == "string" ? f : f.name;
      l.has(g) && !d.has(g) && d.add(g);
    }
    console.log(`  reused: [${[...d].join(", ")}]  detaching: [${[...l.keys()].filter((f) => !d.has(f)).join(", ")}]`), S(this, ve, Gf).call(this);
    for (const [f, g] of l)
      d.has(f) || (g.detach(), i && console.log(`  mesh AFTER detach("${f}"): scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)}`));
    S(this, ve, Na).call(this), i && console.log(`  mesh AFTER canonical restore: scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)}`);
    for (const f of a) {
      const g = typeof f == "string" ? f : f.name;
      if (l.has(g) && d.has(g))
        u.push(l.get(g)), d.delete(g), console.log(`  → reuse "${g}"`);
      else {
        const p = typeof f == "string" ? void 0 : f, y = Ma(g);
        if (!y) {
          console.warn(`TileAnimator: unknown behaviour "${g}"`);
          continue;
        }
        u.push(y(m(this, Ne), p, m(this, jt))), i && console.log(`  → create "${g}" — mesh after factory: scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)} pos=(${i.position.x.toFixed(2)}, ${i.position.y.toFixed(2)})`);
      }
    }
    if (m(this, At)) {
      const f = m(this, At);
      console.log(`  blend FROM: pos=(${f.x.toFixed(2)}, ${f.y.toFixed(2)}) scale=(${f.scaleX.toFixed(4)}, ${f.scaleY.toFixed(4)}) alpha=${f.alpha.toFixed(4)}`);
    }
    I(this, ln, e), I(this, qt, u);
  }
  /**
   * Full cleanup — detach all behaviours, restore canonical, and remove ticker.
   */
  detach() {
    var e, n;
    S(this, ve, Yf).call(this), S(this, ve, Jf).call(this), S(this, ve, Na).call(this), I(this, At, null), m(this, Nn) && ((n = (e = canvas.app) == null ? void 0 : e.ticker) == null || n.remove(m(this, Nn)), I(this, Nn, null));
  }
};
Ne = new WeakMap(), Ot = new WeakMap(), ln = new WeakMap(), qt = new WeakMap(), fi = new WeakMap(), Nn = new WeakMap(), jt = new WeakMap(), At = new WeakMap(), cn = new WeakMap(), ve = new WeakSet(), // ── Private ──────────────────────────────────────────────────────────
Vf = /* @__PURE__ */ c(function() {
  const e = m(this, Ne).mesh;
  e && I(this, jt, {
    x: e.position.x,
    y: e.position.y,
    scaleX: e.scale.x,
    scaleY: e.scale.y,
    angle: e.angle,
    alpha: e.alpha,
    tint: e.tint
  });
}, "#captureCanonical"), Na = /* @__PURE__ */ c(function() {
  const e = m(this, Ne).mesh;
  if (!e || !m(this, jt)) return;
  const n = m(this, jt);
  e.position.x = n.x, e.position.y = n.y, e.scale.x = n.scaleX, e.scale.y = n.scaleY, e.angle = n.angle, e.alpha = n.alpha, e.tint = n.tint;
}, "#restoreCanonical"), /**
 * Snapshot the current (animated) mesh values so the transition blend
 * can lerp FROM here toward the new state's computed values.
 */
Gf = /* @__PURE__ */ c(function() {
  const e = m(this, Ne).mesh;
  e && (I(this, At, {
    x: e.position.x,
    y: e.position.y,
    scaleX: e.scale.x,
    scaleY: e.scale.y,
    angle: e.angle,
    alpha: e.alpha
  }), I(this, cn, 0));
}, "#captureBlendStart"), /**
 * After behaviours compute the new state's mesh values, blend from the
 * pre-transition snapshot toward those values over BLEND_FRAMES using
 * easeOutCubic. This hides the canonical-restore snap entirely.
 */
zf = /* @__PURE__ */ c(function(e) {
  var o, s;
  if (!m(this, At)) return;
  I(this, cn, m(this, cn) + e);
  const n = Math.min(m(this, cn) / Sr.BLEND_FRAMES, 1);
  if (n >= 1) {
    const l = ((o = m(this, Ne).document) == null ? void 0 : o.id) ?? "?";
    console.log(`%c[TileAnimator ${l}] blend complete`, "color: #88FF88"), I(this, At, null);
    return;
  }
  const i = 1 - (1 - n) ** 3, r = m(this, Ne).mesh;
  if (!r) return;
  const a = m(this, At);
  if (m(this, cn) <= e * 3) {
    const l = ((s = m(this, Ne).document) == null ? void 0 : s.id) ?? "?", u = Math.round(m(this, cn) / e);
    console.log(`  [blend ${l} f${u}] t=${n.toFixed(3)} eased=${i.toFixed(3)} | behaviour→scale=(${r.scale.x.toFixed(4)},${r.scale.y.toFixed(4)}) alpha=${r.alpha.toFixed(4)} | blendFrom→scale=(${a.scaleX.toFixed(4)},${a.scaleY.toFixed(4)}) alpha=${a.alpha.toFixed(4)}`);
  }
  r.position.x = a.x + (r.position.x - a.x) * i, r.position.y = a.y + (r.position.y - a.y) * i, r.scale.x = a.scaleX + (r.scale.x - a.scaleX) * i, r.scale.y = a.scaleY + (r.scale.y - a.scaleY) * i, r.angle = a.angle + (r.angle - a.angle) * i, r.alpha = a.alpha + (r.alpha - a.alpha) * i, m(this, cn) <= e * 3 && console.log(`  [blend result] scale=(${r.scale.x.toFixed(4)},${r.scale.y.toFixed(4)}) alpha=${r.alpha.toFixed(4)} pos=(${r.position.x.toFixed(2)},${r.position.y.toFixed(2)})`);
}, "#applyBlend"), Wf = /* @__PURE__ */ c(function(e) {
  I(this, ln, e);
  const n = m(this, Ot)[e] ?? m(this, Ot).idle ?? ["none"];
  for (const i of n) {
    const r = typeof i == "string" ? i : i.name, a = typeof i == "string" ? void 0 : i, o = Ma(r);
    if (!o) {
      console.warn(`TileAnimator: unknown behaviour "${r}"`);
      continue;
    }
    m(this, qt).push(o(m(this, Ne), a));
  }
}, "#attachBehaviours"), Yf = /* @__PURE__ */ c(function() {
  for (const e of m(this, qt)) e.detach();
  I(this, qt, []);
}, "#detachBehaviours"), Kf = /* @__PURE__ */ c(function() {
  const e = m(this, Ot).always ?? [];
  for (const n of e) {
    const i = typeof n == "string" ? n : n.name, r = typeof n == "string" ? void 0 : n, a = Ma(i);
    if (!a) {
      console.warn(`TileAnimator: unknown always behaviour "${i}"`);
      continue;
    }
    m(this, fi).push(a(m(this, Ne), r));
  }
}, "#attachAlwaysBehaviours"), Jf = /* @__PURE__ */ c(function() {
  for (const e of m(this, fi)) e.detach();
  I(this, fi, []);
}, "#detachAlwaysBehaviours"), c(Sr, "TileAnimator"), /** Frames over which state transitions are blended (easeOutCubic). */
ye(Sr, "BLEND_FRAMES", 8);
let Ei = Sr;
const eb = "cinematic", Cs = 5, zl = /* @__PURE__ */ new Set();
function Qt(t) {
  for (const e of zl)
    try {
      e(t);
    } catch (n) {
      console.error("[cinematic] playback listener error:", n);
    }
}
c(Qt, "emitPlaybackEvent");
function tb(t) {
  return zl.add(t), () => zl.delete(t);
}
c(tb, "onPlaybackProgress");
let Se = null, rn = null, br = null, vr = null, Oi = 0, Xn = null;
function yc(t, e = "default") {
  return `cinematic-progress-${t}-${e}`;
}
c(yc, "progressFlagKey");
function nb(t, e, n, i) {
  game.user.setFlag(T, yc(t, e), {
    currentSegment: n,
    completedSegments: [...i],
    timestamp: Date.now()
  }).catch(() => {
  });
}
c(nb, "saveSegmentProgress");
function Wl(t, e = "default") {
  game.user.unsetFlag(T, yc(t, e)).catch(() => {
  });
}
c(Wl, "clearProgress");
function Xf(t, e = "default", n = 3e5) {
  const i = game.user.getFlag(T, yc(t, e));
  return !i || typeof i.timestamp != "number" || Date.now() - i.timestamp > n ? null : i.currentSegment ? i : null;
}
c(Xf, "getSavedProgress");
function Si(t, e = "default") {
  return `cinematic-seen-${t}-${e}`;
}
c(Si, "seenFlagKey");
function bu(t, e = "default") {
  return !!game.user.getFlag(T, Si(t, e));
}
c(bu, "hasSeenCinematic");
function ib(t, e) {
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
c(ib, "validateSingleCinematic");
function ts(t) {
  const e = t ? game.scenes.get(t) : canvas.scene;
  let n = (e == null ? void 0 : e.getFlag(T, eb)) ?? null;
  if (n == null) return null;
  if (typeof n != "object" || Array.isArray(n))
    return console.warn(`[${T}] Cinematic: invalid flag data on scene ${e == null ? void 0 : e.id} (expected object). Ignoring.`), null;
  if ((n.version ?? 1) < 3) {
    const { version: i, ...r } = n;
    n = { version: 3, cinematics: { default: r } };
  }
  if (n.version === 3) {
    for (const [i, r] of Object.entries(n.cinematics ?? {}))
      n.cinematics[i] = Vt.migrateV3toV4(r);
    n.version = 4;
  }
  if (n.version === 4) {
    for (const [i, r] of Object.entries(n.cinematics ?? {}))
      n.cinematics[i] = Vt.migrateV4toV5(r);
    n.version = Cs;
  }
  if (n.version > Cs)
    return console.warn(`[${T}] Cinematic: scene ${e == null ? void 0 : e.id} has version ${n.version}, runtime supports up to ${Cs}. Skipping.`), null;
  if (!n.cinematics || typeof n.cinematics != "object")
    return console.warn(`[${T}] Cinematic: no 'cinematics' map on scene ${e == null ? void 0 : e.id}. Ignoring.`), null;
  for (const [i, r] of Object.entries(n.cinematics)) {
    const a = ib(r, `scene ${e == null ? void 0 : e.id} cinematic "${i}"`);
    a ? n.cinematics[i] = a : delete n.cinematics[i];
  }
  return Object.keys(n.cinematics).length === 0 ? null : n;
}
c(ts, "getCinematicData");
function ao(t, e = "default") {
  var i;
  const n = ts(t);
  return ((i = n == null ? void 0 : n.cinematics) == null ? void 0 : i[e]) ?? null;
}
c(ao, "getNamedCinematic");
function rb(t) {
  const e = ts(t);
  return e ? Object.keys(e.cinematics) : [];
}
c(rb, "listCinematicNames");
function ab() {
  return game.ready ? Promise.resolve() : new Promise((t) => Hooks.once("ready", t));
}
c(ab, "waitForReady");
async function ob(t = 1e4) {
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
c(ob, "waitForTweenAPI");
async function Yl(t = 5e3) {
  var e;
  return window.Tagger ?? ((e = game.modules.get("tagger")) == null ? void 0 : e.api) ? !0 : new Promise((n) => {
    const i = Date.now(), r = setInterval(() => {
      var a;
      window.Tagger ?? ((a = game.modules.get("tagger")) == null ? void 0 : a.api) ? (clearInterval(r), n(!0)) : Date.now() - i > t && (clearInterval(r), console.warn(`[${T}] Cinematic: Tagger API not available after ${t}ms.`), n(!1));
    }, 200);
  });
}
c(Yl, "waitForTagger");
async function sb(t, e, n) {
  if (!t || !t.event) return;
  const i = { ...t };
  console.log(`[${T}] Cinematic: waiting for gate: ${t.event}`);
  let r = null;
  if (t.event === "tile-click" && t.target && t.animation) {
    const a = e.get(t.target);
    (a == null ? void 0 : a.kind) === "placeable" && a.placeable && (r = new Ei(a.placeable, t.animation), r.start());
  }
  try {
    if (t.timeout && t.timeout > 0) {
      const a = new Promise((s) => setTimeout(s, t.timeout)), o = Il(i, { signal: n.signal, eventBus: null });
      await Promise.race([o, a]);
    } else
      await Il(i, { signal: n.signal, eventBus: null });
  } finally {
    r && r.detach();
  }
}
c(sb, "processGate");
function Qf(t) {
  if (!t.segments) return [];
  const e = [], n = /* @__PURE__ */ new Set();
  let i = t.entry;
  for (; i && typeof i == "string" && t.segments[i] && !n.has(i); )
    n.add(i), e.push(i), i = t.segments[i].next;
  return e;
}
c(Qf, "getSegmentOrder");
function oo(t, e) {
  if (t.setup)
    try {
      Ie(t.setup, e);
    } catch (i) {
      console.warn(`[${T}] Cinematic: error applying cinematic-level setup:`, i);
    }
  const n = Qf(t);
  for (const i of n) {
    const r = t.segments[i];
    if (r.setup)
      try {
        Ie(r.setup, e);
      } catch (a) {
        console.warn(`[${T}] Cinematic: error applying setup for segment "${i}":`, a);
      }
    if (r.landing)
      try {
        Ie(r.landing, e);
      } catch (a) {
        console.warn(`[${T}] Cinematic: error applying landing for segment "${i}":`, a);
      }
  }
  if (t.landing)
    try {
      Ie(t.landing, e);
    } catch (i) {
      console.warn(`[${T}] Cinematic: error applying cinematic-level landing:`, i);
    }
  canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
}
c(oo, "applyAllSegmentLandingStates");
async function wr(t, e = "default", n = null) {
  var w, C, L, A, O, M, _, j;
  const i = t ?? ((w = canvas.scene) == null ? void 0 : w.id);
  if (!i) return;
  const r = `${i}:${e}`;
  if (n || (n = /* @__PURE__ */ new Set()), n.has(r)) {
    console.warn(`[${T}] Cinematic: circular transition detected at "${r}". Stopping chain.`), (L = (C = ui.notifications) == null ? void 0 : C.warn) == null || L.call(C, "Cinematic: circular transition detected, stopping.");
    return;
  }
  n.add(r), (Se == null ? void 0 : Se.status) === "running" && Se.cancel("replaced"), Se = null, rn && (rn.abort("replaced"), rn = null);
  const a = ao(i, e);
  if (!a) {
    console.warn(`[${T}] Cinematic: no cinematic "${e}" on scene ${i}.`);
    return;
  }
  const o = await ob();
  if (!o || ((A = canvas.scene) == null ? void 0 : A.id) !== i || (await Yl(), ((O = canvas.scene) == null ? void 0 : O.id) !== i)) return;
  const { targets: s, unresolved: l } = Qa(a);
  if (console.log(`[${T}] Cinematic "${e}": resolved ${s.size} targets`), l.length && console.warn(`[${T}] Cinematic "${e}": skipping ${l.length} unresolved: ${l.join(", ")}`), s.size === 0) {
    console.warn(`[${T}] Cinematic "${e}": no targets could be resolved on scene ${i}.`);
    return;
  }
  const u = ly(a);
  br = sy(u, s), vr = s;
  const d = Xf(i, e), h = new AbortController();
  rn = h;
  const f = a.synchronized === !0 && game.user.isGM, g = Qf(a);
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
      Ie(a.setup, s), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    } catch (D) {
      console.error(`[${T}] Cinematic "${e}": error applying cinematic-level setup:`, D);
    }
  for (let D = 0; D < p; D++) {
    const P = g[D], $ = a.segments[P];
    if ($.setup)
      try {
        Ie($.setup, s);
      } catch (R) {
        console.warn(`[${T}] Cinematic: error applying setup for completed segment "${P}":`, R);
      }
    if ($.landing)
      try {
        Ie($.landing, s);
      } catch (R) {
        console.warn(`[${T}] Cinematic: error applying landing for completed segment "${P}":`, R);
      }
  }
  let v = !1, b = !1;
  Qt({ type: "playback-start", sceneName: ((M = canvas.scene) == null ? void 0 : M.name) ?? i });
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
      if (console.log(`[${T}] Cinematic "${e}": entering segment "${P}"`), Qt({ type: "segment-start", segmentName: P }), nb(i, e, P, [...y]), $.gate) {
        Qt({ type: "gate-wait", segmentName: P, gate: $.gate });
        try {
          await sb($.gate, s, h);
        } catch (B) {
          if (h.signal.aborted) {
            v = !0;
            break;
          }
          throw B;
        }
        Qt({ type: "gate-resolved", segmentName: P });
      }
      if (h.signal.aborted) {
        v = !0;
        break;
      }
      if ($.setup)
        try {
          Ie($.setup, s), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
        } catch (B) {
          console.error(`[${T}] Cinematic "${e}": error applying setup for segment "${P}":`, B);
        }
      if ((j = $.timeline) != null && j.length) {
        const B = pc($.timeline);
        Qt({ type: "timeline-start", segmentName: P, durationMs: B });
        const { tl: W } = gy(
          { setup: {}, timeline: $.timeline },
          s,
          o,
          {
            timelineName: `cinematic-${i}-${e}-${P}`,
            onStepComplete: /* @__PURE__ */ c((U) => {
              Qt({ type: "step-complete", segmentName: P, stepIndex: U });
            }, "onStepComplete")
          }
        );
        Se = W.run({
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
        Qt({ type: "timeline-end", segmentName: P });
      }
      if (h.signal.aborted) {
        v = !0;
        break;
      }
      if ($.landing)
        try {
          Ie($.landing, s), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
        } catch (B) {
          console.error(`[${T}] Cinematic "${e}": error applying landing for segment "${P}":`, B);
        }
      Qt({ type: "segment-complete", segmentName: P }), y.add(P);
      const R = $.next;
      if (R && typeof R == "object" && R.scene) {
        const B = R.scene, W = R.segment ?? a.entry;
        console.log(`[${T}] Cinematic "${e}": cross-scene transition to scene ${B}, segment "${W}"`), Se = null, rn = null, Wl(i, e), ou(), a.tracking !== !1 && await game.user.setFlag(T, Si(i, e), !0), Xn = { sceneId: B, cinematicName: e, visitedChain: n };
        const H = game.scenes.get(B);
        H ? H.view() : (console.warn(`[${T}] Cinematic: cross-scene transition target scene "${B}" not found.`), Xn = null);
        return;
      }
    }
  } catch (D) {
    b = !0, console.error(`[${T}] Cinematic "${e}" error on scene ${i}:`, D);
  }
  if (Se = null, rn = null, Wl(i, e), ou(), br = null, vr = null, Qt({ type: "playback-end", cancelled: !!v }), v) {
    console.log(`[${T}] Cinematic "${e}" cancelled on scene ${i}.`), oo(a, s);
    return;
  }
  if (b) {
    oo(a, s);
    return;
  }
  a.tracking !== !1 && await game.user.setFlag(T, Si(i, e), !0), console.log(`[${T}] Cinematic "${e}" complete on scene ${i}.`);
}
c(wr, "playCinematic");
async function lb(t, e = "default") {
  var i;
  const n = t ?? ((i = canvas.scene) == null ? void 0 : i.id);
  n && (await game.user.unsetFlag(T, Si(n, e)), console.log(`[${T}] Cinematic: cleared seen flag for "${e}" on scene ${n}.`));
}
c(lb, "resetCinematic");
async function cb(t, e, n = "default") {
  var a;
  if (!game.user.isGM) return;
  const i = t ?? ((a = canvas.scene) == null ? void 0 : a.id);
  if (!i || !e) return;
  const r = game.users.get(e);
  r && (await r.unsetFlag(T, Si(i, n)), console.log(`[${T}] Cinematic: cleared seen flag for user ${r.name} on "${n}" scene ${i}.`));
}
c(cb, "resetCinematicForUser");
async function ub(t, e = "default") {
  var a;
  if (!game.user.isGM) return;
  const n = t ?? ((a = canvas.scene) == null ? void 0 : a.id);
  if (!n) return;
  const i = Si(n, e), r = game.users.map((o) => o.getFlag(T, i) ? o.unsetFlag(T, i) : Promise.resolve());
  await Promise.all(r), console.log(`[${T}] Cinematic: cleared seen flag for all users on "${e}" scene ${n}.`);
}
c(ub, "resetCinematicForAll");
function db(t, e = "default") {
  var r;
  const n = t ?? ((r = canvas.scene) == null ? void 0 : r.id);
  if (!n) return [];
  const i = Si(n, e);
  return game.users.map((a) => ({
    userId: a.id,
    name: a.name,
    color: a.color ?? "#888888",
    isGM: a.isGM,
    seen: !!a.getFlag(T, i)
  }));
}
c(db, "getSeenStatus");
function fb(t, e) {
  var i;
  const n = t ?? ((i = canvas.scene) == null ? void 0 : i.id);
  return e ? ao(n, e) != null : ts(n) != null;
}
c(fb, "hasCinematic");
function mb() {
  if (!br || !vr) {
    console.warn(`[${T}] Cinematic: no snapshot available for revert.`);
    return;
  }
  (Se == null ? void 0 : Se.status) === "running" && Se.cancel("reverted"), Se = null, rn && (rn.abort("reverted"), rn = null);
  try {
    Ie(br, vr), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 }), console.log(`[${T}] Cinematic: reverted to pre-cinematic state.`);
  } catch (t) {
    console.error(`[${T}] Cinematic: error during revert:`, t);
  }
  br = null, vr = null;
}
c(mb, "revertCinematic");
async function hb() {
  const t = ++Oi;
  if (console.log(`[${T}] Cinematic: canvasReady fired, gen=${t}, game.ready=${game.ready}`), await ab(), t !== Oi) return;
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
      await wr(e.id, a.cinematicName, a.visitedChain);
    } catch (o) {
      console.error(`[${T}] Cinematic: error during pending transition playback on scene ${e.id}:`, o);
    }
    return;
  }
  Xn = null;
  const n = ts(e.id);
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
    const o = Xf(e.id, a);
    if (t !== Oi) return;
    if (o) {
      console.log(`[${T}] Cinematic "${a}": found saved progress at segment "${o.currentSegment}", resuming...`);
      try {
        await wr(e.id, a);
      } catch (s) {
        console.error(`[${T}] Cinematic "${a}": error during resumed playback on scene ${e.id}:`, s);
      }
      return;
    }
  }
  let r = null;
  for (const { name: a, data: o } of i)
    if (!(o.tracking !== !1 && bu(e.id, a))) {
      r = { name: a, data: o };
      break;
    }
  if (!r) {
    if (console.log(`[${T}] Cinematic: all canvasReady cinematics already seen on scene ${e.id}`), gb(e.id, i), (Se == null ? void 0 : Se.status) === "running" && Se.cancel("already-seen"), Se = null, await Yl(), t !== Oi) return;
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
  if (t === Oi && (console.log(`[${T}] Cinematic: playing first unseen cinematic "${r.name}"...`), await Yl(), t === Oi)) {
    for (const { name: a, data: o } of i) {
      if (a === r.name) continue;
      if (o.tracking !== !1 && bu(e.id, a))
        try {
          const { targets: l } = Qa(o);
          oo(o, l);
        } catch (l) {
          console.error(`[${T}] Cinematic "${a}": error applying landing states (already seen) on scene ${e.id}:`, l);
        }
    }
    try {
      await wr(e.id, r.name);
    } catch (a) {
      console.error(`[${T}] Cinematic "${r.name}": error during playback on scene ${e.id}:`, a);
    }
  }
}
c(hb, "onCanvasReady$1");
function gb(t, e) {
  for (const { name: n } of e)
    Wl(t, n);
}
c(gb, "clearAllCanvasReadyProgress");
function pb(t = 3e5) {
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
c(pb, "cleanupStaleProgressFlags");
function yb() {
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
        new Hl({ scene: canvas.scene }).render(!0);
      }, "onClick")
    };
    Array.isArray(i) ? i.push(a) : i instanceof Map ? i.set(r, a) : i && typeof i == "object" ? i[r] = a : n.tools = [a];
  });
}
c(yb, "registerEditorButton");
function bb() {
  Hooks.on("canvasReady", hb), yb(), Hooks.once("ready", () => {
    pb();
    const t = game.modules.get(T);
    t.api || (t.api = {}), t.api.cinematic = {
      play: wr,
      reset: lb,
      resetForUser: cb,
      resetForAll: ub,
      getSeenStatus: db,
      has: fb,
      get: ao,
      list: rb,
      revert: mb,
      onPlaybackProgress: tb,
      TileAnimator: Ei,
      registerBehaviour: me,
      getBehaviour: Ma,
      trigger: /* @__PURE__ */ c(async (e, n, i = "default") => {
        var o;
        const r = n ?? ((o = canvas.scene) == null ? void 0 : o.id);
        if (!r) return;
        const a = ao(r, i);
        a && (a.trigger && a.trigger !== e || await wr(r, i));
      }, "trigger")
    }, console.log(`[${T}] Cinematic API registered (v5).`);
  });
}
c(bb, "registerCinematicHooks");
function Kl(t, e) {
  const n = Math.abs(t.width), i = Math.abs(t.height), r = n / 2, a = i / 2;
  let o = e.x - (t.x + r), s = e.y - (t.y + a);
  if (t.rotation !== 0) {
    const l = Math.toRadians(t.rotation), u = Math.cos(l), d = Math.sin(l), h = u * o + d * s, f = u * s - d * o;
    o = h, s = f;
  }
  return o += r, s += a, o >= 0 && o <= n && s >= 0 && s <= i;
}
c(Kl, "pointWithinTile");
Xo("tile-click", (t, e) => t.target ? new Promise((n, i) => {
  var g;
  if (e.signal.aborted) return i(e.signal.reason ?? "aborted");
  const r = Zo(t.target);
  if (!((g = r == null ? void 0 : r.placeables) != null && g.length))
    return i(new Error(`await tile-click: no placeables found for "${t.target}"`));
  const a = r.placeables, o = [];
  for (const { placeable: p } of a) {
    const y = new Ei(p, t.animation);
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
      Kl(w.document, v) ? (b = !0, C.state !== "hover" && C.setState("hover")) : C.state === "hover" && C.setState("idle");
    b ? l === null && (l = document.body.style.cursor, document.body.style.cursor = "pointer") : l !== null && (document.body.style.cursor = l, l = null);
  }, "onPointerMove");
  s == null || s.addEventListener("pointermove", u);
  const d = /* @__PURE__ */ c((p) => {
    if (p.button !== 0) return;
    const y = canvas.activeLayer;
    if (!y) return;
    const v = y.toLocal(p);
    isNaN(v.x) || isNaN(v.y) || !a.filter(({ doc: w }) => Kl(w, v)).sort((w, C) => (C.doc.sort ?? 0) - (w.doc.sort ?? 0))[0] || (p.stopPropagation(), p.preventDefault(), f(), n());
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
bb();
function vb() {
  Hooks.once("ready", () => {
    const t = game.modules.get(T);
    t.api || (t.api = {}), t.api.picker = {
      /** Open the picker window. Returns Promise<string[] | null>. */
      open: /* @__PURE__ */ c((e) => ro.open(e), "open"),
      /** Resolve a selector string to documents. */
      resolveSelector: Zo,
      /** Parse a selector string into { type, value }. */
      parseSelector: gc,
      /** Build a selector string from { type, value }. */
      buildSelector: ny,
      /** Build a tag selector from tags array + mode. */
      buildTagSelector: hf,
      /** Canvas highlight utilities. */
      highlight: {
        add: io,
        remove: Xi,
        has: Lf,
        clearAll: ka
      }
    }, console.log(`[${T}] Placeable Picker API registered.`);
  });
}
c(vb, "registerPlaceablePickerHooks");
vb();
const $a = "eidolon-utilities", wb = "tile-interactions", Eb = "tile-animations", Sb = "idle-animation";
function Cb(t) {
  const e = t.type ?? "tile-prop";
  return e === "tile-tint" ? { name: "tween-tint", fromColor: t.fromColor, toColor: t.toColor, mode: t.mode, period: t.period, easing: t.easing } : e === "tile-scale" ? { name: "tween-scale", fromScale: t.fromScale, toScale: t.toScale, period: t.period, easing: t.easing } : { name: "tween-prop", attribute: t.attribute, from: t.from, to: t.to, period: t.period, easing: t.easing };
}
c(Cb, "migrateIdleTweenToAlways");
function bc(t) {
  var u, d, h;
  const e = (u = t == null ? void 0 : t.getFlag) == null ? void 0 : u.call(t, $a, Eb);
  if (e) return e;
  const n = (d = t == null ? void 0 : t.getFlag) == null ? void 0 : d.call(t, $a, Sb), i = (h = t == null ? void 0 : t.getFlag) == null ? void 0 : h.call(t, $a, wb);
  let r = [], a = [], o = [], s = [];
  if (n) {
    let f;
    Array.isArray(n) ? f = n : typeof n == "object" && "0" in n ? f = Object.values(n) : typeof n == "object" && (n.type || n.attribute) ? f = [n] : f = [], r = f.filter((g) => g && typeof g == "object").map(Cb);
  }
  return i && (i.hover && (Array.isArray(i.hover) ? o = i.hover : typeof i.hover == "object" && (a = Array.isArray(i.hover.idle) ? i.hover.idle : [], o = Array.isArray(i.hover.enter) ? i.hover.enter : [])), Array.isArray(i.click) && i.click.length && (s = i.click)), r.length > 0 || a.length > 0 || o.length > 0 || s.length > 0 ? { always: r, idle: a, hover: o, click: s } : null;
}
c(bc, "readUnifiedConfig");
const un = /* @__PURE__ */ new Map(), Ci = /* @__PURE__ */ new Map(), vu = /* @__PURE__ */ new WeakMap(), Er = /* @__PURE__ */ new Set();
let Fn = null, kt = null, Mt = null, Ut = null;
function Zf(t) {
  const e = canvas.activeLayer;
  if (!e) return null;
  const n = e.toLocal(t);
  return !n || Number.isNaN(n.x) || Number.isNaN(n.y) ? null : n;
}
c(Zf, "canvasToLocal");
function em(t) {
  let e = null, n = -1 / 0;
  for (const [i, r] of un)
    if (Kl(r.doc, t)) {
      const a = r.doc.sort ?? 0;
      a > n && (e = r, n = a);
    }
  return e;
}
c(em, "hitTest");
function Tb(t) {
  var e, n;
  return {
    always: t.always ?? [],
    idle: (e = t.idle) != null && e.length ? t.idle : ["none"],
    hover: (n = t.hover) != null && n.length ? t.hover : ["none"]
  };
}
c(Tb, "buildAnimatorConfig");
function vc(t, e, n) {
  Qr(t);
  const i = Tb(n), r = new Ei(e, i);
  r.start("idle"), Ci.set(t, r);
}
c(vc, "startHoverAnimator");
function Qr(t) {
  const e = Ci.get(t);
  e && (e.detach(), Ci.delete(t));
}
c(Qr, "stopHoverAnimator");
function Ts(t, e, n, i) {
  return e.type === "tile-tint" ? { uuid: t, toColor: n ? e.toColor : e.fromColor, mode: e.mode } : e.type === "tile-scale" ? {
    uuid: t,
    toScale: n ? e.toScale : e.fromScale,
    ...i
  } : { uuid: t, attribute: e.attribute, value: n ? e.to : e.from };
}
c(Ts, "buildClickParams");
function Lb(t) {
  const e = t._source.width, n = t._source.height, i = t._source.x, r = t._source.y;
  return {
    baseWidth: e,
    baseHeight: n,
    centerX: i + e / 2,
    centerY: r + n / 2
  };
}
c(Lb, "captureRefGeometry");
async function Ib(t, e) {
  const n = t.uuid, i = e.type ?? "tile-prop", r = er(i);
  if (!r) {
    console.warn(`[${$a}] tile-interactions: unknown tween type "${i}"`);
    return;
  }
  const a = e.period ?? 300, o = e.easing ?? "easeOutCubic", s = e.mode ?? "bounce", l = i === "tile-scale" ? Lb(t) : null;
  if (s === "toggle") {
    const d = !(vu.get(t) ?? !1);
    await r.execute(
      Ts(n, e, d, l),
      { durationMS: a, easing: o, commit: !0 }
    ), vu.set(t, d);
  } else {
    const u = a / 2;
    await r.execute(
      Ts(n, e, !0, l),
      { durationMS: u, easing: o, commit: !1 }
    ), await r.execute(
      Ts(n, e, !1, l),
      { durationMS: u, easing: o, commit: !1 }
    );
  }
}
c(Ib, "playClickAnimation");
async function Ob(t) {
  var n, i, r, a;
  const e = t.doc.id;
  if (!Er.has(e)) {
    Er.add(e);
    try {
      Qr(e);
      const o = t.clickConfig.map((s) => Ib(t.doc, s));
      await Promise.all(o);
    } finally {
      Er.delete(e), t.animConfig && (((n = t.animConfig.always) == null ? void 0 : n.length) > 0 || ((i = t.animConfig.idle) == null ? void 0 : i.length) > 0 || ((r = t.animConfig.hover) == null ? void 0 : r.length) > 0) && (vc(e, t.placeable, t.animConfig), Fn === e && ((a = Ci.get(e)) == null || a.setState("hover")));
    }
  }
}
c(Ob, "handleClick");
function tm(t) {
  var r;
  const e = Zf(t);
  if (!e) return;
  const n = em(e), i = (n == null ? void 0 : n.doc.id) ?? null;
  if (i !== Fn) {
    if (Fn) {
      const a = Ci.get(Fn);
      a && a.setState("idle");
    }
    if (i) {
      const a = Ci.get(i);
      a && a.setState("hover");
    }
    Fn = i, i && (n.animConfig || (r = n.clickConfig) != null && r.length) ? (kt === null && (kt = document.body.style.cursor), document.body.style.cursor = "pointer") : kt !== null && (document.body.style.cursor = kt, kt = null);
  }
}
c(tm, "onPointerMove");
function nm(t) {
  var i;
  if (t.button !== 0) return;
  const e = Zf(t);
  if (!e) return;
  const n = em(e);
  !n || !((i = n.clickConfig) != null && i.length) || Ob(n);
}
c(nm, "onPointerDown");
function Ab() {
  var n, i, r, a;
  for (const o of Ci.keys())
    Qr(o);
  un.clear(), Er.clear(), Fn = null, kt !== null && (document.body.style.cursor = kt, kt = null);
  const t = document.getElementById("board");
  Mt && (t == null || t.removeEventListener("pointermove", Mt), Mt = null), Ut && (t == null || t.removeEventListener("pointerdown", Ut), Ut = null);
  const e = (n = canvas.tiles) == null ? void 0 : n.placeables;
  if (Array.isArray(e)) {
    for (const o of e) {
      const s = o.document, l = bc(s);
      if (!l) continue;
      const u = ((i = l.always) == null ? void 0 : i.length) > 0 || ((r = l.idle) == null ? void 0 : r.length) > 0 || ((a = l.hover) == null ? void 0 : a.length) > 0, d = Array.isArray(l.click) && l.click.length ? l.click : null;
      !u && !d || (un.set(s.id, { doc: s, placeable: o, animConfig: l, clickConfig: d }), u && vc(s.id, o, l));
    }
    un.size !== 0 && (Mt = tm, Ut = nm, t == null || t.addEventListener("pointermove", Mt), t == null || t.addEventListener("pointerdown", Ut));
  }
}
c(Ab, "rebuild");
function kb(t) {
  var o, s, l;
  const e = t.id, n = bc(t), i = n && (((o = n.always) == null ? void 0 : o.length) > 0 || ((s = n.idle) == null ? void 0 : s.length) > 0 || ((l = n.hover) == null ? void 0 : l.length) > 0), r = n && Array.isArray(n.click) && n.click.length ? n.click : null;
  if (!i && !r) {
    im(t);
    return;
  }
  Qr(e);
  const a = t.object;
  if (!a) {
    un.delete(e);
    return;
  }
  un.set(e, { doc: t, placeable: a, animConfig: n, clickConfig: r }), i && vc(e, a, n), Mb();
}
c(kb, "updateTile");
function im(t) {
  const e = t.id;
  if (Qr(e), un.delete(e), Er.delete(e), Fn === e && (Fn = null, kt !== null && (document.body.style.cursor = kt, kt = null)), un.size === 0) {
    const n = document.getElementById("board");
    Mt && (n == null || n.removeEventListener("pointermove", Mt), Mt = null), Ut && (n == null || n.removeEventListener("pointerdown", Ut), Ut = null);
  }
}
c(im, "removeTile");
function Mb() {
  if (un.size === 0 || Mt) return;
  const t = document.getElementById("board");
  t && (Mt = tm, Ut = nm, t.addEventListener("pointermove", Mt), t.addEventListener("pointerdown", Ut));
}
c(Mb, "ensureListeners");
function Mi(t, e, n) {
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
c(Mi, "buildSelectGroup");
function Ni(t, e, n, i = {}) {
  const r = document.createElement("div");
  r.classList.add("form-group");
  const a = document.createElement("label");
  a.textContent = t;
  const o = document.createElement("input");
  o.type = "number", o.classList.add(e), o.value = String(n);
  for (const [s, l] of Object.entries(i)) o.setAttribute(s, l);
  return r.append(a, o), r;
}
c(Ni, "buildNumberGroup");
function Jl(t, e, n) {
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
c(Jl, "buildColorGroup");
let oe = null;
function Ls() {
  for (const t of document.querySelectorAll(".idle-anim__slot--insert-before, .idle-anim__slot--insert-after"))
    t.classList.remove("idle-anim__slot--insert-before", "idle-anim__slot--insert-after");
}
c(Ls, "clearInsertIndicators");
function wu(t) {
  for (const e of document.querySelectorAll(".idle-anim__slots"))
    e.classList.toggle("idle-anim__slots--drag-active", t);
}
c(wu, "setDragActive");
function so(t, e) {
  t.dispatchEvent(new CustomEvent("slot-reorder", { detail: { card: e } }));
}
c(so, "notifyReorder");
function rm(t, { dropGroup: e, handleSelector: n = ".idle-anim__slot-header" }) {
  t.setAttribute("draggable", "true");
  let i = !1;
  t.addEventListener("pointerdown", (r) => {
    i = !!r.target.closest(n);
  }), t.addEventListener("dragstart", (r) => {
    if (!i) {
      r.preventDefault();
      return;
    }
    oe = { card: t, sourceContainer: t.parentElement, group: e, insertMode: null, insertTarget: null }, t.classList.add("is-dragging"), wu(!0), r.dataTransfer.effectAllowed = "move", r.dataTransfer.setData("text/plain", "");
  }), t.addEventListener("dragover", (r) => {
    if (!oe || oe.group !== e || oe.card === t) return;
    r.preventDefault(), r.dataTransfer.dropEffect = "move";
    const a = t.getBoundingClientRect(), o = a.top + a.height / 2, s = r.clientY < o ? "before" : "after";
    (oe.insertTarget !== t || oe.insertMode !== s) && (Ls(), t.classList.add(s === "before" ? "idle-anim__slot--insert-before" : "idle-anim__slot--insert-after"), oe.insertTarget = t, oe.insertMode = s);
  }), t.addEventListener("dragleave", () => {
    t.classList.remove("idle-anim__slot--insert-before", "idle-anim__slot--insert-after"), (oe == null ? void 0 : oe.insertTarget) === t && (oe.insertTarget = null, oe.insertMode = null);
  }), t.addEventListener("drop", (r) => {
    if (r.preventDefault(), r.stopPropagation(), Ls(), !oe || oe.group !== e || oe.card === t) return;
    const a = oe.card, o = oe.sourceContainer, s = t.parentElement;
    oe.insertMode === "after" ? s.insertBefore(a, t.nextSibling) : s.insertBefore(a, t), so(s, a), o !== s && so(o, a), oe = null;
  }), t.addEventListener("dragend", () => {
    t.classList.remove("is-dragging"), Ls(), wu(!1);
    for (const r of document.querySelectorAll(".idle-anim__slots--drag-over"))
      r.classList.remove("idle-anim__slots--drag-over");
    oe = null;
  });
}
c(rm, "makeDraggable");
function am(t, { dropGroup: e, onDrop: n }) {
  t.addEventListener("dragover", (i) => {
    !oe || oe.group !== e || (i.preventDefault(), i.dataTransfer.dropEffect = "move");
  }), t.addEventListener("dragenter", (i) => {
    !oe || oe.group !== e || (i.preventDefault(), t.classList.add("idle-anim__slots--drag-over"));
  }), t.addEventListener("dragleave", (i) => {
    i.relatedTarget && t.contains(i.relatedTarget) || t.classList.remove("idle-anim__slots--drag-over");
  }), t.addEventListener("drop", (i) => {
    if (i.preventDefault(), t.classList.remove("idle-anim__slots--drag-over"), !oe || oe.group !== e) return;
    const r = oe.card, a = oe.sourceContainer;
    t.appendChild(r), so(t, r), a !== t && so(a, r), oe = null;
  }), t.addEventListener("slot-reorder", (i) => {
    n == null || n(i.detail.card, t);
  });
}
c(am, "makeDropContainer");
const fa = "eidolon-utilities", Eu = "tile-animations", Nb = "tile-interactions", $b = "idle-animation", xb = "eidolon-idle-animation", _b = "fa-solid fa-wave-pulse", om = [
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
], Fb = [
  { value: "tween-prop", label: "Numeric" },
  { value: "tween-tint", label: "Tint" },
  { value: "tween-scale", label: "Scale" }
], sm = {
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
}, $i = {
  attribute: "alpha",
  from: 1,
  to: 0.5,
  period: 300,
  mode: "bounce"
}, Pi = {
  fromColor: "#ffffff",
  toColor: "#ffaa00",
  period: 500,
  mode: "bounce"
}, xa = {
  type: "tile-scale",
  fromScale: 1,
  toScale: 1.2,
  period: 300,
  easing: "easeOutCubic",
  mode: "bounce"
}, lm = [
  { value: "alpha", label: "Alpha (Opacity)" },
  { value: "rotation", label: "Rotation" },
  { value: "texture.rotation", label: "Texture Rotation" }
];
let yn = null;
function Db(t) {
  var e;
  return (t == null ? void 0 : t.document) ?? ((e = t == null ? void 0 : t.object) == null ? void 0 : e.document) ?? (t == null ? void 0 : t.object) ?? null;
}
c(Db, "getTileDocument");
function Pb(t, e) {
  const n = document.createElement("div");
  n.classList.add("form-group");
  const i = document.createElement("label");
  i.textContent = "Type", n.appendChild(i);
  const r = document.createElement("select");
  r.classList.add(e);
  const a = document.createElement("optgroup");
  a.label = "Effects";
  for (const s of om) {
    const l = document.createElement("option");
    l.value = s.value, l.textContent = s.label, s.value === t && (l.selected = !0), a.appendChild(l);
  }
  r.appendChild(a);
  const o = document.createElement("optgroup");
  o.label = "Tweens";
  for (const s of Fb) {
    const l = document.createElement("option");
    l.value = s.value, l.textContent = s.label, s.value === t && (l.selected = !0), o.appendChild(l);
  }
  return r.appendChild(o), n.appendChild(r), n;
}
c(Pb, "buildEffectTypeSelect");
function Su(t) {
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
  const n = om.find((i) => i.value === e);
  return (n == null ? void 0 : n.label) ?? e;
}
c(Su, "summarizeEffectConfig");
function Cu(t, e, n, i) {
  const r = t.name ?? "float", a = dc(), o = Ki(), s = document.createElement("div");
  s.classList.add("idle-anim__slot", "is-collapsed", n), s.dataset.index = String(e);
  const l = document.createElement("div");
  l.classList.add("idle-anim__slot-header");
  const u = document.createElement("i");
  u.classList.add("fa-solid", "fa-chevron-right", "idle-anim__slot-chevron");
  const d = document.createElement("span");
  d.classList.add("idle-anim__slot-title"), d.textContent = `${i} ${e + 1}`;
  const h = document.createElement("span");
  h.classList.add("idle-anim__slot-summary"), h.textContent = Su(t);
  const f = document.createElement("button");
  f.type = "button", f.classList.add("idle-anim__slot-remove"), f.innerHTML = '<i class="fa-solid fa-xmark"></i>', f.title = "Remove effect", l.append(u, d, h, f), s.appendChild(l);
  const g = document.createElement("div");
  g.classList.add("idle-anim__slot-body");
  const p = Pb(r, "ti-effect__type");
  g.appendChild(p);
  const y = document.createElement("div");
  y.classList.add("idle-anim__type-fields"), g.appendChild(y);
  function v(w, C) {
    y.innerHTML = "";
    const L = sm[w];
    if (L)
      for (const A of L) {
        const O = C[A.key] ?? A.default;
        if (A.type === "color")
          y.appendChild(Jl(A.label, `ti-effect__${A.key}`, O));
        else if (A.type === "select") {
          let M;
          A.options === "interpolation" ? M = o.map((_) => ({ value: _, label: _, selected: _ === O })) : Array.isArray(A.options) ? M = A.options.map((_) => ({ value: _.value, label: _.label, selected: _.value === O })) : M = a.map((_) => ({ value: _, label: _, selected: _ === O })), y.appendChild(Mi(A.label, `ti-effect__${A.key}`, M));
        } else
          y.appendChild(Ni(A.label, `ti-effect__${A.key}`, O, A.attrs ?? {}));
      }
  }
  c(v, "renderParams"), v(r, t), s.appendChild(g);
  const b = s.querySelector(".ti-effect__type");
  return b == null || b.addEventListener("change", () => {
    v(b.value, {});
  }), l.addEventListener("click", (w) => {
    if (!w.target.closest(".idle-anim__slot-remove") && (s.classList.toggle("is-collapsed"), s.classList.contains("is-collapsed"))) {
      const C = cm(s);
      C && (h.textContent = Su(C));
    }
  }), f.addEventListener("click", (w) => {
    w.stopPropagation();
    const C = s.parentElement;
    s.remove(), C && ns(C, n, i);
  }), rm(s, { dropGroup: "effect" }), s;
}
c(Cu, "buildEffectSlot");
function cm(t) {
  var r;
  const e = ((r = t.querySelector(".ti-effect__type")) == null ? void 0 : r.value) ?? "float", n = sm[e], i = { name: e };
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
c(cm, "readEffectSlot");
function Tu(t) {
  if (!t) return "";
  const e = t.type ?? "tile-prop", n = t.mode ?? "bounce", i = n.charAt(0).toUpperCase() + n.slice(1);
  if (e === "tile-tint")
    return `${i} Tint ${t.fromColor ?? "?"} → ${t.toColor ?? "?"} (${t.period ?? "?"}ms)`;
  if (e === "tile-scale") {
    const o = t.fromScale != null ? `${Math.round(t.fromScale * 100)}%` : "?", s = t.toScale != null ? `${Math.round(t.toScale * 100)}%` : "?";
    return `${i} Scale ${o} → ${s} (${t.period ?? "?"}ms)`;
  }
  const r = lm.find((o) => o.value === t.attribute), a = (r == null ? void 0 : r.label) ?? t.attribute ?? "?";
  return `${i} ${a} ${t.from ?? "?"} → ${t.to ?? "?"} (${t.period ?? "?"}ms)`;
}
c(Tu, "summarizeClickConfig");
function Lu(t, e) {
  const n = t.type ?? "tile-prop", i = t.mode ?? "bounce", r = dc(), a = document.createElement("div");
  a.classList.add("idle-anim__slot", "is-collapsed", "ti-click-slot"), a.dataset.index = String(e);
  const o = document.createElement("div");
  o.classList.add("idle-anim__slot-header");
  const s = document.createElement("i");
  s.classList.add("fa-solid", "fa-chevron-right", "idle-anim__slot-chevron");
  const l = document.createElement("span");
  l.classList.add("idle-anim__slot-title"), l.textContent = `Animation ${e + 1}`;
  const u = document.createElement("span");
  u.classList.add("idle-anim__slot-summary"), u.textContent = Tu(t);
  const d = document.createElement("button");
  d.type = "button", d.classList.add("idle-anim__slot-remove"), d.innerHTML = '<i class="fa-solid fa-xmark"></i>', d.title = "Remove animation", o.append(s, l, u, d), a.appendChild(o);
  const h = document.createElement("div");
  h.classList.add("idle-anim__slot-body");
  const f = document.createElement("div");
  f.classList.add("idle-anim__range-row"), f.appendChild(Mi("Mode", "ti-click__mode", [
    { value: "bounce", label: "Bounce", selected: i === "bounce" },
    { value: "toggle", label: "Toggle", selected: i === "toggle" }
  ])), f.appendChild(Mi("Type", "ti-click__type", [
    { value: "tile-prop", label: "Numeric", selected: n === "tile-prop" },
    { value: "tile-tint", label: "Tint", selected: n === "tile-tint" },
    { value: "tile-scale", label: "Scale", selected: n === "tile-scale" }
  ])), h.appendChild(f);
  const g = document.createElement("div");
  g.classList.add("idle-anim__type-fields"), h.appendChild(g);
  function p(w, C) {
    if (g.innerHTML = "", w === "tile-tint") {
      const L = Ki(), A = C.fromColor ?? Pi.fromColor, O = C.toColor ?? Pi.toColor, M = C.mode ?? "oklch", _ = document.createElement("div");
      _.classList.add("idle-anim__range-row"), _.appendChild(Jl("From", "ti-click__from-color", A)), _.appendChild(Jl("To", "ti-click__to-color", O)), g.appendChild(_), g.appendChild(Mi(
        "Interpolation",
        "ti-click__color-mode",
        L.map((j) => ({ value: j, label: j, selected: j === M }))
      ));
    } else if (w === "tile-scale") {
      const L = C.fromScale ?? xa.fromScale, A = C.toScale ?? xa.toScale, O = document.createElement("div");
      O.classList.add("idle-anim__range-row"), O.appendChild(Ni("From", "ti-click__from-scale", L, { step: "0.01", min: "0.01" })), O.appendChild(Ni("To", "ti-click__to-scale", A, { step: "0.01", min: "0.01" })), g.appendChild(O);
      const M = document.createElement("p");
      M.classList.add("idle-anim__hint"), M.textContent = "1.0 = original size. Scales from center.", g.appendChild(M);
    } else {
      const L = C.attribute ?? $i.attribute, A = C.from ?? $i.from, O = C.to ?? $i.to;
      g.appendChild(Mi(
        "Attribute",
        "ti-click__attribute",
        lm.map((_) => ({ value: _.value, label: _.label, selected: _.value === L }))
      ));
      const M = document.createElement("div");
      M.classList.add("idle-anim__range-row"), M.appendChild(Ni("From", "ti-click__from", A, { step: "0.01" })), M.appendChild(Ni("To", "ti-click__to", O, { step: "0.01" })), g.appendChild(M);
    }
  }
  c(p, "renderTypeFields"), p(n, t);
  const y = t.period ?? (n === "tile-tint" ? Pi.period : $i.period), v = t.easing ?? "easeOutCubic";
  h.appendChild(Ni("Period (ms)", "ti-click__period", y, { min: "50", step: "50" })), h.appendChild(Mi(
    "Easing",
    "ti-click__easing",
    r.map((w) => ({ value: w, label: w, selected: w === v }))
  )), a.appendChild(h);
  const b = a.querySelector(".ti-click__type");
  return b == null || b.addEventListener("change", () => {
    const w = b.value;
    p(w, w === "tile-tint" ? Pi : w === "tile-scale" ? xa : $i);
  }), o.addEventListener("click", (w) => {
    if (!w.target.closest(".idle-anim__slot-remove") && (a.classList.toggle("is-collapsed"), a.classList.contains("is-collapsed"))) {
      const C = um(a);
      C && (u.textContent = Tu(C));
    }
  }), d.addEventListener("click", (w) => {
    w.stopPropagation();
    const C = a.parentElement;
    a.remove(), C && ns(C, "ti-click-slot", "Animation");
  }), rm(a, { dropGroup: "click" }), a;
}
c(Lu, "buildClickSlot");
function um(t) {
  var u, d, h, f, g, p, y, v, b, w, C, L, A, O;
  const e = ((u = t.querySelector(".ti-click__type")) == null ? void 0 : u.value) ?? "tile-prop", n = ((d = t.querySelector(".ti-click__mode")) == null ? void 0 : d.value) ?? "bounce", i = Number.parseInt((h = t.querySelector(".ti-click__period")) == null ? void 0 : h.value, 10), r = ((f = t.querySelector(".ti-click__easing")) == null ? void 0 : f.value) ?? "easeOutCubic";
  if (!i || i <= 0) return null;
  const a = { mode: n, period: i, easing: r };
  if (e === "tile-tint") {
    const M = ((g = t.querySelector(".ti-click__from-color")) == null ? void 0 : g.value) ?? ((p = t.querySelector(".ti-click__from-color-text")) == null ? void 0 : p.value) ?? Pi.fromColor, _ = ((y = t.querySelector(".ti-click__to-color")) == null ? void 0 : y.value) ?? ((v = t.querySelector(".ti-click__to-color-text")) == null ? void 0 : v.value) ?? Pi.toColor, j = ((b = t.querySelector(".ti-click__color-mode")) == null ? void 0 : b.value) ?? "oklch";
    return { type: "tile-tint", fromColor: M, toColor: _, mode: j, ...a };
  }
  if (e === "tile-scale") {
    const M = Number.parseFloat((w = t.querySelector(".ti-click__from-scale")) == null ? void 0 : w.value), _ = Number.parseFloat((C = t.querySelector(".ti-click__to-scale")) == null ? void 0 : C.value);
    return Number.isNaN(M) || Number.isNaN(_) || M <= 0 || _ <= 0 ? null : { type: "tile-scale", fromScale: M, toScale: _, ...a };
  }
  const o = ((L = t.querySelector(".ti-click__attribute")) == null ? void 0 : L.value) ?? $i.attribute, s = Number.parseFloat((A = t.querySelector(".ti-click__from")) == null ? void 0 : A.value), l = Number.parseFloat((O = t.querySelector(".ti-click__to")) == null ? void 0 : O.value);
  return Number.isNaN(s) || Number.isNaN(l) ? null : { type: "tile-prop", attribute: o, from: s, to: l, ...a };
}
c(um, "readClickSlot");
function ns(t, e, n) {
  t.querySelectorAll(`.${e}`).forEach((r, a) => {
    r.dataset.index = String(a);
    const o = r.querySelector(".idle-anim__slot-title");
    o && (o.textContent = `${n} ${a + 1}`);
  });
}
c(ns, "renumberSlots");
function Is(t, { heading: e, hint: n, configs: i, slotClass: r, titlePrefix: a, dropGroup: o, defaultEffect: s, addLabel: l }) {
  const u = document.createElement("h3");
  u.classList.add("ti-section-heading"), u.textContent = e, t.appendChild(u);
  const d = document.createElement("p");
  d.classList.add("idle-anim__hint"), d.textContent = n, t.appendChild(d);
  const h = document.createElement("div");
  h.classList.add("idle-anim__slots", `${r}s`);
  for (let p = 0; p < i.length; p++)
    h.appendChild(Cu(i[p], p, r, a));
  t.appendChild(h);
  const f = ["ti-always-slot", "ti-idle-slot", "ti-hover-slot"];
  am(h, {
    dropGroup: o,
    onDrop(p) {
      if (p.parentElement === h)
        for (const y of f)
          y !== r && p.classList.contains(y) && p.classList.replace(y, r);
      ns(h, r, a);
    }
  });
  const g = document.createElement("button");
  return g.type = "button", g.classList.add("idle-anim__add"), g.innerHTML = `<i class="fa-solid fa-plus"></i> ${l}`, g.addEventListener("click", () => {
    const p = h.querySelectorAll(`.${r}`).length, y = Cu(s, p, r, a);
    y.classList.remove("is-collapsed"), h.appendChild(y);
  }), t.appendChild(g), h;
}
c(Is, "buildEffectCategory");
function Rb(t) {
  const e = bc(t) ?? { always: [], idle: [], hover: [], click: [] }, n = document.createElement("section");
  n.classList.add("eidolon-tile-interactions"), Is(n, {
    heading: "Always",
    hint: "Runs continuously, ignores pointer state.",
    configs: e.always ?? [],
    slotClass: "ti-always-slot",
    titlePrefix: "Effect",
    dropGroup: "effect",
    defaultEffect: { name: "embers" },
    addLabel: "Add Effect"
  }), Is(n, {
    heading: "Idle",
    hint: "Plays by default. Stops when pointer enters the tile.",
    configs: e.idle ?? [],
    slotClass: "ti-idle-slot",
    titlePrefix: "Effect",
    dropGroup: "effect",
    defaultEffect: { name: "float" },
    addLabel: "Add Idle Effect"
  }), Is(n, {
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
    o.appendChild(Lu(a[d], d));
  n.appendChild(o), am(o, {
    dropGroup: "click",
    onDrop() {
      ns(o, "ti-click-slot", "Animation");
    }
  });
  const s = document.createElement("button");
  s.type = "button", s.classList.add("idle-anim__add"), s.innerHTML = '<i class="fa-solid fa-plus"></i> Add Animation', s.addEventListener("click", () => {
    const d = o.querySelectorAll(".ti-click-slot").length, h = Lu(xa, d);
    h.classList.remove("is-collapsed"), o.appendChild(h);
  }), n.appendChild(s);
  const l = document.createElement("div");
  l.classList.add("idle-anim__actions");
  const u = document.createElement("button");
  return u.type = "button", u.classList.add("idle-anim__preview"), u.innerHTML = '<i class="fa-solid fa-play"></i> Preview', l.append(u), n.appendChild(l), n;
}
c(Rb, "buildSectionContent");
function Os(t, e) {
  const n = [];
  for (const i of t.querySelectorAll(`.${e}`)) {
    const r = cm(i);
    r && n.push(r);
  }
  return n;
}
c(Os, "readAllEffectSlots");
function Hb(t) {
  const e = [];
  for (const n of t.querySelectorAll(".ti-click-slot")) {
    const i = um(n);
    i && e.push(i);
  }
  return e;
}
c(Hb, "readAllClickConfigs");
function Iu(t) {
  return {
    always: Os(t, "ti-always-slot"),
    idle: Os(t, "ti-idle-slot"),
    hover: Os(t, "ti-hover-slot"),
    click: Hb(t)
  };
}
c(Iu, "readFormConfig");
function qb(t, e) {
  var l;
  const n = zt(e);
  if (!n) return;
  const i = Db(t);
  if (!i) return;
  const r = zd(t, n, xb, "Animations", _b);
  if (!r || r.querySelector(".eidolon-tile-interactions")) return;
  const a = r.closest("form");
  a && (a.noValidate = !0);
  const o = Rb(i);
  r.appendChild(o), (l = t.setPosition) == null || l.call(t, { height: "auto" });
  const s = r.querySelector(".idle-anim__preview");
  s == null || s.addEventListener("click", () => {
    const u = i.object;
    if (!u) return;
    if (yn) {
      yn.detach(), yn = null, s.classList.remove("is-active"), s.innerHTML = '<i class="fa-solid fa-play"></i> Preview';
      return;
    }
    const d = Iu(o);
    (d.always.length > 0 || d.idle.length > 0 || d.hover.length > 0) && (yn = new Ei(u, d), yn.start("idle"), s.classList.add("is-active"), s.innerHTML = '<i class="fa-solid fa-stop"></i> Stop');
  }), a && a.addEventListener("submit", () => {
    yn && (yn.detach(), yn = null);
    const u = Iu(o), d = u.always.length > 0 || u.idle.length > 0 || u.hover.length > 0 || u.click.length > 0, h = {
      [`flags.${fa}.-=${Eu}`]: null,
      [`flags.${fa}.-=${Nb}`]: null,
      [`flags.${fa}.-=${$b}`]: null
    };
    i.update(h).then(() => {
      if (d)
        return i.update({ [`flags.${fa}.${Eu}`]: u });
    });
  });
}
c(qb, "renderAnimationSection");
const lo = /* @__PURE__ */ new Map();
function dm(t) {
  const e = lo.get(t);
  e && (e.controller.abort(), lo.delete(t), e.restore());
}
c(dm, "stopLoopByKey");
function fm(t) {
  const e = `${t}::`;
  for (const n of [...lo.keys()])
    n.startsWith(e) && dm(n);
}
c(fm, "stopLoopsForTile");
function jb() {
  for (const t of [...lo.keys()])
    dm(t);
}
c(jb, "stopAllLoops");
const Bb = "eidolon-utilities", Ub = ["tile-animations", "tile-interactions", "idle-animation"];
function Vb() {
  jb(), Ab();
}
c(Vb, "onCanvasReady");
function Gb(t, e) {
  var r;
  const n = (r = e == null ? void 0 : e.flags) == null ? void 0 : r[Bb];
  !n || !Ub.some((a) => a in n || `-=${a}` in n) || (fm(t.id), kb(t));
}
c(Gb, "onUpdateTile");
function zb(t) {
  fm(t.id), im(t);
}
c(zb, "onDeleteTile");
function Wb(t, e) {
  qb(t, e);
}
c(Wb, "onRenderTileConfig");
function Yb() {
  Hooks.on("canvasReady", Vb), Hooks.on("updateTile", Gb), Hooks.on("deleteTile", zb), Hooks.on("renderTileConfig", Wb);
}
c(Yb, "registerTileInteractionHooks");
Yb();
//# sourceMappingURL=eidolon-utilities.js.map
