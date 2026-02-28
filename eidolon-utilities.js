var Dc = Object.defineProperty;
var $m = Object.getPrototypeOf;
var Fm = Reflect.get;
var Pc = (n) => {
  throw TypeError(n);
};
var Dm = (n, e, t) => e in n ? Dc(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var c = (n, e) => Dc(n, "name", { value: e, configurable: !0 });
var ye = (n, e, t) => Dm(n, typeof e != "symbol" ? e + "" : e, t), cs = (n, e, t) => e.has(n) || Pc("Cannot " + t);
var h = (n, e, t) => (cs(n, e, "read from private field"), t ? t.call(n) : e.get(n)), k = (n, e, t) => e.has(n) ? Pc("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(n) : e.set(n, t), L = (n, e, t, i) => (cs(n, e, "write to private field"), i ? i.call(n, t) : e.set(n, t), t), C = (n, e, t) => (cs(n, e, "access private method"), t);
var us = (n, e, t, i) => ({
  set _(r) {
    L(n, e, r, t);
  },
  get _() {
    return h(n, e, i);
  }
}), Re = (n, e, t) => Fm($m(n), t, e);
const T = "eidolon-utilities", qa = "timeTriggerActive", $s = "timeTriggerHideWindow", Fs = "timeTriggerShowPlayerWindow", Ds = "timeTriggerAllowRealTime", zu = "timeTriggers", va = "timeTriggerHistory", Ps = "debug", Rs = "timeFormat", Hs = "manageTime", qs = "secondsPerRound";
const Pm = [-30, -15, -5, 5, 15, 30], ji = 1440 * 60, wa = "playSound", ea = 6;
function E(n, e) {
  var t, i;
  return (i = (t = game.i18n) == null ? void 0 : t.has) != null && i.call(t, n) ? game.i18n.localize(n) : e;
}
c(E, "localize");
function $t(n) {
  return typeof n != "string" ? "" : n.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
c($t, "escapeHtml");
function Jt(n) {
  var e;
  return n == null ? n : (e = foundry == null ? void 0 : foundry.utils) != null && e.duplicate ? foundry.utils.duplicate(n) : JSON.parse(JSON.stringify(n));
}
c(Jt, "duplicateData");
function Rm() {
  var n;
  return (n = foundry == null ? void 0 : foundry.utils) != null && n.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
c(Rm, "generateTriggerId");
function Gu(n) {
  if (typeof n != "string") return null;
  const e = n.trim();
  if (!e) return null;
  const t = e.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (!t) return null;
  const i = Number(t[1]), r = Number(t[2]), a = t[3] !== void 0 ? Number(t[3]) : 0;
  return !Number.isInteger(i) || !Number.isInteger(r) || !Number.isInteger(a) || i < 0 || i > 23 || r < 0 || r > 59 || a < 0 || a > 59 ? null : i * 3600 + r * 60 + a;
}
c(Gu, "parseTriggerTimeToSeconds");
function fr() {
  var n, e;
  return ((n = game.scenes) == null ? void 0 : n.current) ?? ((e = game.scenes) == null ? void 0 : e.active) ?? null;
}
c(fr, "getActiveScene");
function Xt(n) {
  return (n == null ? void 0 : n.object) ?? (n == null ? void 0 : n.document) ?? null;
}
c(Xt, "getSceneFromApplication");
function Je(n) {
  return n && typeof n.getFlag == "function" && typeof n.setFlag == "function";
}
c(Je, "hasSceneDocument");
const js = /* @__PURE__ */ new Set(), Bs = /* @__PURE__ */ new Set(), Us = /* @__PURE__ */ new Set(), Vs = /* @__PURE__ */ new Set();
let Ei = !1, Ar = !1, ja = ea, Ba = "12h", Rc = !1;
function ds(n) {
  Ei = !!n;
  for (const e of js)
    try {
      e(Ei);
    } catch (t) {
      console.error(`${T} | Debug change handler failed`, t);
    }
}
c(ds, "notifyDebugChange");
function fs(n) {
  Ar = !!n;
  for (const e of Bs)
    try {
      e(Ar);
    } catch (t) {
      console.error(`${T} | Manage time change handler failed`, t);
    }
}
c(fs, "notifyManageTimeChange");
function Wu(n) {
  return n === "24h" ? "24h" : "12h";
}
c(Wu, "normalizeTimeFormatValue");
function ic(n) {
  const e = Number(n);
  return !Number.isFinite(e) || e <= 0 ? ea : e;
}
c(ic, "normalizeSecondsPerRoundValue");
function ms(n) {
  const e = ic(n);
  ja = e;
  for (const t of Us)
    try {
      t(e);
    } catch (i) {
      console.error(`${T} | Seconds-per-round change handler failed`, i);
    }
}
c(ms, "notifySecondsPerRoundChange");
function hs(n) {
  const e = Wu(n);
  Ba = e;
  for (const t of Vs)
    try {
      t(e);
    } catch (i) {
      console.error(`${T} | Time format change handler failed`, i);
    }
}
c(hs, "notifyTimeFormatChange");
function Hm() {
  var e;
  if (Rc) return;
  if (Rc = !0, !((e = game == null ? void 0 : game.settings) != null && e.register)) {
    console.warn(
      `${T} | game.settings.register is unavailable. Module settings could not be registered.`
    );
    return;
  }
  const n = typeof game.settings.registerChange == "function";
  game.settings.register(T, Ps, {
    name: E("EIDOLON.TimeTrigger.DebugSettingName", "Enable debug logging"),
    hint: E(
      "EIDOLON.TimeTrigger.DebugSettingHint",
      "Write detailed time-trigger diagnostics to the browser console."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: n ? void 0 : ds
  }), n && game.settings.registerChange(T, Ps, ds), Ei = rc(), ds(Ei), game.settings.register(T, Hs, {
    name: E("EIDOLON.TimeTrigger.ManageTimeSettingName", "Manage Game Time"),
    hint: E(
      "EIDOLON.TimeTrigger.ManageTimeSettingHint",
      "Allow Eidolon Utilities to advance world time automatically while the game is unpaused. Warning: This may conflict with other time-management modules."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: n ? void 0 : fs
  }), n && game.settings.registerChange(T, Hs, fs), Ar = jm(), fs(Ar), game.settings.register(T, qs, {
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
    default: ea,
    range: { min: 1, max: 3600, step: 1 },
    onChange: n ? void 0 : ms
  }), n && game.settings.registerChange(
    T,
    qs,
    ms
  ), ja = ic(Bm()), ms(ja), game.settings.register(T, Rs, {
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
    onChange: n ? void 0 : hs
  }), n && game.settings.registerChange(T, Rs, hs), Ba = Wu(Yu()), hs(Ba);
}
c(Hm, "registerTimeTriggerSettings");
function rc() {
  var n;
  try {
    if ((n = game == null ? void 0 : game.settings) != null && n.get)
      return !!game.settings.get(T, Ps);
  } catch (e) {
    console.error(`${T} | Failed to read debug setting`, e);
  }
  return !1;
}
c(rc, "getDebugSetting");
function qm() {
  return Ei = rc(), Ei;
}
c(qm, "refreshDebugSettingCache");
function jm() {
  var n;
  try {
    if ((n = game == null ? void 0 : game.settings) != null && n.get)
      return !!game.settings.get(T, Hs);
  } catch (e) {
    console.error(`${T} | Failed to read manage time setting`, e);
  }
  return !1;
}
c(jm, "getManageTimeSetting");
function Yu() {
  var n;
  try {
    if ((n = game == null ? void 0 : game.settings) != null && n.get)
      return game.settings.get(T, Rs) === "24h" ? "24h" : "12h";
  } catch (e) {
    console.error(`${T} | Failed to read time format setting`, e);
  }
  return "12h";
}
c(Yu, "getTimeFormatSetting");
function Bm() {
  var n;
  try {
    if ((n = game == null ? void 0 : game.settings) != null && n.get) {
      const e = game.settings.get(T, qs);
      return ic(e);
    }
  } catch (e) {
    console.error(`${T} | Failed to read seconds-per-round setting`, e);
  }
  return ea;
}
c(Bm, "getSecondsPerRoundSetting");
function Um(n) {
  if (typeof n != "function")
    return () => {
    };
  js.add(n);
  try {
    n(Ei);
  } catch (e) {
    console.error(`${T} | Debug change handler failed`, e);
  }
  return () => {
    js.delete(n);
  };
}
c(Um, "onDebugSettingChange");
function Ju(n) {
  if (typeof n != "function")
    return () => {
    };
  Bs.add(n);
  try {
    n(Ar);
  } catch (e) {
    console.error(`${T} | Manage time change handler failed`, e);
  }
  return () => {
    Bs.delete(n);
  };
}
c(Ju, "onManageTimeSettingChange");
function ac(n) {
  if (typeof n != "function")
    return () => {
    };
  Vs.add(n);
  try {
    n(Ba);
  } catch (e) {
    console.error(`${T} | Time format change handler failed`, e);
  }
  return () => {
    Vs.delete(n);
  };
}
c(ac, "onTimeFormatSettingChange");
function Vm(n) {
  if (typeof n != "function")
    return () => {
    };
  Us.add(n);
  try {
    n(ja);
  } catch (e) {
    console.error(`${T} | Seconds-per-round change handler failed`, e);
  }
  return () => {
    Us.delete(n);
  };
}
c(Vm, "onSecondsPerRoundSettingChange");
let Vo = !1, zs = !1;
function Gs(n) {
  Vo = !!n;
}
c(Gs, "updateDebugState");
function Ku() {
  zs || (zs = !0, Gs(rc()), Um((n) => {
    Gs(n), console.info(`${T} | Debug ${Vo ? "enabled" : "disabled"}`);
  }));
}
c(Ku, "ensureInitialized");
function oc() {
  return zs || Ku(), Vo;
}
c(oc, "shouldLog");
function Xu(n) {
  if (!n.length)
    return [`${T} |`];
  const [e, ...t] = n;
  return typeof e == "string" ? [`${T} | ${e}`, ...t] : [`${T} |`, e, ...t];
}
c(Xu, "formatArgs");
function zm() {
  Ku();
}
c(zm, "initializeDebug");
function Gm() {
  return Gs(qm()), Vo;
}
c(Gm, "syncDebugState");
function N(...n) {
  oc() && console.debug(...Xu(n));
}
c(N, "debugLog");
function Xi(...n) {
  oc() && console.group(...Xu(n));
}
c(Xi, "debugGroup");
function Dn() {
  oc() && console.groupEnd();
}
c(Dn, "debugGroupEnd");
function Bi(n) {
  var r;
  const e = (r = n == null ? void 0 : n.getFlag) == null ? void 0 : r.call(n, T, zu);
  if (!e) return [];
  const t = Jt(e), i = Array.isArray(t) ? t : [];
  return N("Loaded time triggers", {
    sceneId: (n == null ? void 0 : n.id) ?? null,
    count: i.length
  }), i;
}
c(Bi, "getTimeTriggers");
async function Qu(n, e) {
  n != null && n.setFlag && (N("Persisting time triggers", {
    sceneId: n.id,
    count: Array.isArray(e) ? e.length : 0
  }), await n.setFlag(T, zu, e));
}
c(Qu, "setTimeTriggers");
function Wm(n) {
  var r;
  const e = (r = n == null ? void 0 : n.getFlag) == null ? void 0 : r.call(n, T, va);
  if (!e) return {};
  const t = Jt(e);
  if (!t || typeof t != "object") return {};
  const i = {};
  for (const [a, o] of Object.entries(t))
    typeof o == "number" && Number.isFinite(o) && (i[a] = o);
  return N("Loaded time trigger history", {
    sceneId: (n == null ? void 0 : n.id) ?? null,
    keys: Object.keys(i)
  }), i;
}
c(Wm, "getTimeTriggerHistory");
async function gs(n, e) {
  var l, u, d, m;
  if (!n) return;
  const t = {};
  if (e && typeof e == "object")
    for (const [f, g] of Object.entries(e))
      typeof g == "number" && Number.isFinite(g) && (t[f] = g);
  const i = ((l = n.getFlag) == null ? void 0 : l.call(n, T, va)) ?? {}, r = {};
  if (i && typeof i == "object")
    for (const [f, g] of Object.entries(i))
      typeof g == "number" && Number.isFinite(g) && (r[f] = g);
  const a = Object.keys(t), o = Object.keys(r);
  if (typeof ((u = foundry == null ? void 0 : foundry.utils) == null ? void 0 : u.deepEqual) == "function" ? foundry.utils.deepEqual(r, t) : JSON.stringify(r) === JSON.stringify(t)) {
    N("Skip history update because state is unchanged", {
      sceneId: (n == null ? void 0 : n.id) ?? null
    });
    return;
  }
  N("Updating time trigger history", {
    sceneId: (n == null ? void 0 : n.id) ?? null,
    keys: a,
    removedKeys: o.filter((f) => !a.includes(f))
  });
  try {
    o.length && typeof n.unsetFlag == "function" && await n.unsetFlag(T, va), a.length && await n.setFlag(T, va, t);
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
c(gs, "updateTimeTriggerHistory");
const Ua = /* @__PURE__ */ new Map(), Hc = /* @__PURE__ */ new Set();
function Ym(n) {
  if (!(n != null && n.id))
    throw new Error(`${T} | Action definitions require an id.`);
  if (Ua.has(n.id))
    throw new Error(`${T} | Duplicate time trigger action id: ${n.id}`);
  Ua.set(n.id, {
    ...n
  }), N("Registered time trigger action", { actionId: n.id });
}
c(Ym, "registerAction");
function ta(n) {
  return Ua.get(n) ?? null;
}
c(ta, "getAction");
function Jm(n) {
  const e = ta(n);
  return e ? typeof e.label == "function" ? e.label() : e.label : n;
}
c(Jm, "getActionLabel");
function qc() {
  return Array.from(Ua.values());
}
c(qc, "listActions");
async function Zu(n, e) {
  var i, r;
  const t = ta(e == null ? void 0 : e.action);
  if (!t || typeof t.execute != "function") {
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
    actionId: t.id,
    triggerId: (e == null ? void 0 : e.id) ?? null,
    sceneId: (n == null ? void 0 : n.id) ?? null
  }), await t.execute({ scene: n, trigger: e });
}
c(Zu, "executeTriggerAction");
function Km(n) {
  const e = ta(n == null ? void 0 : n.action);
  return !e || typeof e.buildSummaryParts != "function" ? [] : e.buildSummaryParts({ trigger: n, escapeHtml: $t, localize: E }) ?? [];
}
c(Km, "buildActionSummaryParts");
function Xm(n) {
  const e = ta(n == null ? void 0 : n.action);
  return !e || typeof e.buildFormContent != "function" ? "" : e.buildFormContent({ trigger: n, escapeHtml: $t, localize: E }) ?? "";
}
c(Xm, "buildActionFormSection");
function Qm(n, e) {
  const t = ta(n == null ? void 0 : n.action);
  !t || typeof t.prepareFormData != "function" || t.prepareFormData({ trigger: n, formData: e });
}
c(Qm, "applyActionFormData");
function Zm(n, e, t) {
  var a, o;
  const i = `${(n == null ? void 0 : n.id) ?? "unknown"}:${(e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.action) ?? "unknown"}:${t}`;
  if (Hc.has(i)) return;
  Hc.add(i);
  const r = E(
    "EIDOLON.TimeTrigger.MissingDataWarning",
    "A scene time trigger is missing required data and was skipped."
  );
  (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, r), console.warn(`${T} | Missing trigger data (${t})`, { scene: n == null ? void 0 : n.id, trigger: e });
}
c(Zm, "warnMissingTriggerData");
async function eh({ scene: n, trigger: e }) {
  var a, o, s, l, u;
  const t = (s = (o = (a = e == null ? void 0 : e.data) == null ? void 0 : a.path) == null ? void 0 : o.trim) == null ? void 0 : s.call(o);
  if (!t) {
    Zm(n, e, "missing-audio-path");
    return;
  }
  const i = {
    src: t,
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
c(eh, "executePlaySoundAction");
Ym({
  id: wa,
  label: /* @__PURE__ */ c(() => E("EIDOLON.TimeTrigger.ActionPlaySound", "Play Sound"), "label"),
  execute: eh,
  buildSummaryParts: /* @__PURE__ */ c(({ trigger: n, escapeHtml: e, localize: t }) => {
    var r;
    return (r = n == null ? void 0 : n.data) != null && r.path ? [`${e(t("EIDOLON.TimeTrigger.TriggerSound", "Sound File"))}: ${e(n.data.path)}`] : [];
  }, "buildSummaryParts"),
  buildFormContent: /* @__PURE__ */ c(({ trigger: n, escapeHtml: e, localize: t }) => {
    var s;
    const i = e(t("EIDOLON.TimeTrigger.TriggerSound", "Sound File")), r = e(
      t("EIDOLON.TimeTrigger.TriggerChooseFile", "Select File")
    ), a = e(
      t(
        "EIDOLON.TimeTrigger.TriggerSoundNotes",
        "Select or upload the audio file that should play when this trigger fires."
      )
    ), o = e(((s = n == null ? void 0 : n.data) == null ? void 0 : s.path) ?? "");
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
  prepareFormData: /* @__PURE__ */ c(({ trigger: n, formData: e }) => {
    var t, i;
    n.data.path = ((i = (t = e.playSoundPath) == null ? void 0 : t.trim) == null ? void 0 : i.call(t)) ?? "";
  }, "prepareFormData")
});
var Ru;
const { ApplicationV2: Gn, HandlebarsApplicationMixin: Wn } = ((Ru = foundry.applications) == null ? void 0 : Ru.api) ?? {};
if (!Gn || !Wn)
  throw new Error(
    `${T} | ApplicationV2 API unavailable. Update Foundry VTT to v13 or newer.`
  );
const Hn = "AM", Ci = "PM";
function Pn() {
  return Yu();
}
c(Pn, "getConfiguredTimeFormat");
function zo(n) {
  if (typeof n != "string") return null;
  const e = n.trim();
  if (!e) return null;
  const t = e.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (!t) return null;
  const i = Number(t[1]), r = Number(t[2]), a = t[3] !== void 0 ? Number(t[3]) : null;
  return !Number.isInteger(i) || !Number.isInteger(r) || i < 0 || i > 23 || r < 0 || r > 59 || a !== null && (!Number.isInteger(a) || a < 0 || a > 59) ? null : {
    hours: i,
    minutes: r,
    seconds: a
  };
}
c(zo, "parseCanonicalTimeString");
function zt({ hours: n, minutes: e, seconds: t }) {
  if (!Number.isInteger(n) || !Number.isInteger(e) || n < 0 || n > 23 || e < 0 || e > 59) return null;
  const i = String(n).padStart(2, "0"), r = String(e).padStart(2, "0");
  if (Number.isInteger(t)) {
    if (t < 0 || t > 59) return null;
    const a = String(t).padStart(2, "0");
    return `${i}:${r}:${a}`;
  }
  return `${i}:${r}`;
}
c(zt, "formatCanonicalTime");
function th(n, { format: e } = {}) {
  if (!n || typeof n != "object") return null;
  const t = Number(n.hour), i = Number(n.minute), r = n.second !== void 0 && n.second !== null, a = r ? Number(n.second) : null, o = r && Number.isFinite(a) ? Math.floor(Math.max(0, Math.min(59, a))) : null;
  if (!Number.isFinite(t) || !Number.isFinite(i)) return null;
  const s = e ?? Pn();
  return Va(
    {
      hours: t,
      minutes: i,
      seconds: o
    },
    s
  );
}
c(th, "formatTimeComponentsForDisplay");
function nh(n, { format: e } = {}) {
  const t = zo(n);
  if (!t) return "";
  const i = e ?? Pn();
  return Va(t, i);
}
c(nh, "formatTriggerTimeForDisplay");
function Va(n, e = "12h") {
  if (!n) return "";
  const { hours: t, minutes: i, seconds: r = null } = n;
  if (!Number.isInteger(t) || !Number.isInteger(i)) return "";
  const a = Number.isInteger(r);
  if (e === "24h") {
    const f = `${String(t).padStart(2, "0")}:${String(i).padStart(2, "0")}`;
    return a ? `${f}:${String(r).padStart(2, "0")}` : f;
  }
  const o = t >= 12 ? Ci : Hn, s = t % 12 === 0 ? 12 : t % 12, l = String(s), u = String(i).padStart(2, "0"), d = `${l}:${u}`, m = o === Hn ? E("EIDOLON.TimeTrigger.TimePeriodAM", Hn) : E("EIDOLON.TimeTrigger.TimePeriodPM", Ci);
  if (a) {
    const f = String(r).padStart(2, "0");
    return `${d}:${f} ${m}`;
  }
  return `${d} ${m}`;
}
c(Va, "formatTimeParts");
function jc(n, e = Pn()) {
  const t = zo(n);
  if (e === "24h")
    return {
      format: e,
      canonical: t ? zt(t) ?? "" : "",
      hour: t ? String(t.hours).padStart(2, "0") : "",
      minute: t ? String(t.minutes).padStart(2, "0") : ""
    };
  if (!t)
    return {
      format: e,
      canonical: "",
      hour: "",
      minute: "",
      period: Hn
    };
  const i = t.hours >= 12 ? Ci : Hn, r = t.hours % 12 === 0 ? 12 : t.hours % 12;
  return {
    format: e,
    canonical: zt(t) ?? "",
    hour: String(r),
    minute: String(t.minutes).padStart(2, "0"),
    period: i
  };
}
c(jc, "getTimeFormValues");
function ih({ hour: n, minute: e, period: t, time: i }, r = Pn()) {
  if (r === "24h") {
    const g = typeof n == "string" ? n.trim() : "", p = typeof e == "string" ? e.trim() : "", y = typeof i == "string" ? i.trim() : "";
    if (!g && !p && y) {
      const S = zo(y);
      return S ? { canonical: zt(S) ?? "", error: null } : {
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
    const w = Number(g), b = Number(p);
    return !Number.isInteger(w) || w < 0 || w > 23 ? {
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
    } : { canonical: zt({
      hours: w,
      minutes: b
    }) ?? "", error: null };
  }
  const a = typeof n == "string" ? n.trim() : "", o = typeof e == "string" ? e.trim() : "", s = typeof t == "string" ? t.trim().toUpperCase() : "";
  if (!a || !o || !s)
    return { canonical: "", error: E("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.") };
  if (s !== Hn && s !== Ci)
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
    hours: s === Ci ? d + 12 : d,
    minutes: u
  };
  return {
    canonical: zt(f) ?? "",
    error: null
  };
}
c(ih, "normalizeFormTimeInput");
function rh() {
  return [
    {
      value: Hn,
      label: E("EIDOLON.TimeTrigger.TimePeriodAM", Hn)
    },
    {
      value: Ci,
      label: E("EIDOLON.TimeTrigger.TimePeriodPM", Ci)
    }
  ];
}
c(rh, "getPeriodOptions");
var ai, oi, re, ed, go, po, td, Ys, Js, yo, bo, nd, id, rd, Ks, Xs, Qs, vo, wo, Zs, Eo, ad, od;
const ii = class ii extends Wn(Gn) {
  constructor(t = {}) {
    var o;
    const { scene: i, showControls: r, ...a } = t ?? {};
    super(a);
    k(this, re);
    k(this, ai, null);
    k(this, oi, null);
    k(this, go, /* @__PURE__ */ c((t) => {
      var r, a;
      t.preventDefault();
      const i = Number((a = (r = t.currentTarget) == null ? void 0 : r.dataset) == null ? void 0 : a.delta);
      Number.isFinite(i) && (N("Time delta button clicked", { delta: i }), this._advanceTime(i));
    }, "#onDeltaClick"));
    k(this, po, /* @__PURE__ */ c((t) => {
      var i, r;
      t.preventDefault(), !(!this.showControls || !((i = game.user) != null && i.isGM)) && (N("Time value double clicked", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null }), C(this, re, td).call(this));
    }, "#onTimeDoubleClick"));
    k(this, yo, /* @__PURE__ */ c((t) => {
      if (this.isEditingTime && !this._commitTimeInProgress)
        if (t.key === "Enter") {
          t.preventDefault();
          const i = t.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
          C(this, re, Js).call(this, r);
        } else t.key === "Escape" && (t.preventDefault(), C(this, re, Ys).call(this));
    }, "#onTimeInputKeydown"));
    k(this, bo, /* @__PURE__ */ c((t) => {
      if (!this.isEditingTime || this._commitTimeInProgress || this._suppressBlurCommit) return;
      const i = t.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
      C(this, re, Js).call(this, r);
    }, "#onTimeInputBlur"));
    k(this, vo, /* @__PURE__ */ c((t) => {
      const i = !!t;
      if (this.manageTimeEnabled === i) return;
      this.manageTimeEnabled = i, (this.rendered ?? this.isRendered ?? !1) && this.render({ force: !0 });
    }, "#handleManageTimeChange"));
    k(this, wo, /* @__PURE__ */ c(async (t) => {
      var a, o, s, l, u, d, m, f, g;
      if (t.preventDefault(), !this.showControls || !((a = game.user) != null && a.isGM)) return;
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
        await i.setFlag(T, Ds, r), this.sceneAllowsRealTime = r;
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
    k(this, Eo, /* @__PURE__ */ c(() => {
      (this.rendered ?? this.isRendered ?? !1) && (this.isEditingTime && (this.editValue = C(this, re, Ks).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    this.scene = i ?? null, this.showControls = typeof r == "boolean" ? r : !!((o = game.user) != null && o.isGM), this.isEditingTime = !1, this.editValue = "", this._commitTimeInProgress = !1, this._suppressBlurCommit = !1, this.manageTimeEnabled = !1, this.sceneAllowsRealTime = C(this, re, Zs).call(this), L(this, ai, ac(h(this, Eo))), L(this, oi, Ju(h(this, vo)));
  }
  async _prepareContext() {
    var b, v;
    const t = ((b = game.time) == null ? void 0 : b.components) ?? {}, r = ((t == null ? void 0 : t.second) !== void 0 && (t == null ? void 0 : t.second) !== null ? th(t) : null) ?? C(this, re, ed).call(this), a = Pn(), o = a === "24h", s = o ? E("EIDOLON.TimeTrigger.EditTimePlaceholder24", "HH:MM") : E("EIDOLON.TimeTrigger.EditTimePlaceholder12", "HH:MM AM/PM"), l = this.showControls ? E(
      "EIDOLON.TimeTrigger.EditTimeHint",
      "Double-click to set a specific time."
    ) : "", u = this.showControls ? E(
      "EIDOLON.TimeTrigger.EditTimeLabel",
      "New time (HH:MM or HH:MM AM/PM)"
    ) : "", d = Pm.map((S) => ({
      minutes: S,
      label: S > 0 ? `+${S}` : `${S}`
    })), m = !!this.manageTimeEnabled, f = C(this, re, Zs).call(this);
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
  async close(t = {}) {
    var r, a;
    if (!t.force)
      return (this.rendered ?? this.isRendered ?? !1) || (N("TimeTriggerWindow close request rerendering", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null
      }), this.render({ force: !0 })), this;
    N("Closing time trigger window", { sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null, force: !0 });
    const i = await super.close(t);
    return C(this, re, ad).call(this), C(this, re, od).call(this), i;
  }
  async _advanceTime(t) {
    var r, a, o, s, l, u, d;
    const i = t * 60;
    if (N("Advancing world time", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null, minutes: t, seconds: i }), !((a = game.user) != null && a.isGM)) {
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
        minutes: t,
        message: (m == null ? void 0 : m.message) ?? String(m)
      });
    }
  }
  _onRender(t, i) {
    var a;
    super._onRender(t, i);
    const r = this.element;
    if (r) {
      if (this.showControls) {
        N("Binding time trigger interactions", {
          sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
          buttonCount: r.querySelectorAll("[data-delta]").length
        }), r.querySelectorAll("[data-delta]").forEach((u) => {
          u.addEventListener("click", h(this, go));
        });
        const o = r.querySelector('.time-trigger-window__time-value[data-editable="true"]');
        o && o.addEventListener("dblclick", h(this, po), { once: !1 });
        const s = r.querySelector(".time-trigger-window__time-input");
        s && (s.addEventListener("keydown", h(this, yo)), s.addEventListener("blur", h(this, bo)), typeof s.focus == "function" && (s.focus(), typeof s.select == "function" && s.select()));
        const l = r.querySelector('[data-action="toggle-real-time"]');
        l && l.addEventListener("click", h(this, wo));
      }
      this._suppressBlurCommit = !1;
    }
  }
};
ai = new WeakMap(), oi = new WeakMap(), re = new WeakSet(), ed = /* @__PURE__ */ c(function() {
  var l;
  const t = (l = game.time) == null ? void 0 : l.worldTime;
  if (typeof t != "number" || !Number.isFinite(t)) return "";
  const i = 1440 * 60, r = (Math.floor(t) % i + i) % i, a = Math.floor(r / 3600), o = Math.floor(r % 3600 / 60), s = r % 60;
  return Va({ hours: a, minutes: o, seconds: s }, Pn());
}, "#formatFallbackTime"), go = new WeakMap(), po = new WeakMap(), td = /* @__PURE__ */ c(function() {
  var t;
  (t = game.user) != null && t.isGM && (this.isEditingTime = !0, this._suppressBlurCommit = !1, this.editValue = C(this, re, Ks).call(this), this.render({ force: !0 }));
}, "#enterTimeEditMode"), Ys = /* @__PURE__ */ c(function() {
  this.isEditingTime = !1, this.editValue = "", this._suppressBlurCommit = !1, this.render({ force: !0 });
}, "#cancelTimeEdit"), Js = /* @__PURE__ */ c(async function(t) {
  var a, o, s;
  if (!((a = game.user) != null && a.isGM) || !this.isEditingTime || this._commitTimeInProgress) return;
  this._commitTimeInProgress = !0;
  const i = typeof t == "string" ? t.trim() : "";
  if (!i) {
    C(this, re, Ys).call(this), this._commitTimeInProgress = !1;
    return;
  }
  const r = C(this, re, rd).call(this, i);
  if (r.error) {
    (s = (o = ui.notifications) == null ? void 0 : o.error) == null || s.call(o, r.error), this._suppressBlurCommit = !0, this.editValue = i, this.render({ force: !0 }), this._commitTimeInProgress = !1;
    return;
  }
  try {
    await C(this, re, id).call(this, r.seconds, r.includeSeconds) ? (this.isEditingTime = !1, this.editValue = "", this.render({ force: !0 })) : (this.editValue = i, this.render({ force: !0 }));
  } finally {
    this._commitTimeInProgress = !1;
  }
}, "#commitTimeInput"), yo = new WeakMap(), bo = new WeakMap(), nd = /* @__PURE__ */ c(function() {
  var u, d;
  const t = (u = game.time) == null ? void 0 : u.worldTime;
  if (typeof t != "number" || !Number.isFinite(t))
    return "";
  const i = ((d = game.time) == null ? void 0 : d.components) ?? {}, r = Number(i.hour), a = Number(i.minute), o = i.second !== void 0 ? Number(i.second) : null, s = Number.isInteger(o);
  return (Number.isFinite(r) && Number.isFinite(a) ? zt({
    hours: Math.max(0, Math.min(23, Number(r))),
    minutes: Math.max(0, Math.min(59, Number(a))),
    seconds: s && Number.isFinite(o) ? Math.max(0, Math.min(59, Number(o))) : void 0
  }) ?? "" : "") ?? "";
}, "#getCurrentCanonicalTime"), id = /* @__PURE__ */ c(async function(t, i) {
  var f, g, p, y, w, b, v, S, I, A;
  const r = (f = game.time) == null ? void 0 : f.worldTime;
  if (typeof r != "number" || !Number.isFinite(r))
    return (p = (g = ui.notifications) == null ? void 0 : g.error) == null || p.call(
      g,
      E(
        "EIDOLON.TimeTrigger.EditTimeUnavailable",
        "The world time is unavailable, so it can't be updated."
      )
    ), !1;
  if (!Number.isInteger(t) || t < 0 || t >= ji)
    return (w = (y = ui.notifications) == null ? void 0 : y.error) == null || w.call(
      y,
      E(
        "EIDOLON.TimeTrigger.EditTimeInvalidRange",
        "Enter a time within the current day."
      )
    ), !1;
  const s = Math.floor(r / ji) * ji + t - r;
  if (!Number.isFinite(s) || s === 0)
    return !0;
  const l = Math.floor(t / 3600), u = Math.floor(t % 3600 / 60), d = t % 60, m = zt({
    hours: l,
    minutes: u,
    seconds: i ? d : void 0
  });
  try {
    N("Updating world time directly", {
      sceneId: ((b = this.scene) == null ? void 0 : b.id) ?? null,
      targetCanonical: m ?? null,
      diff: s
    }), await game.time.advance(s);
    const O = Va(
      {
        hours: l,
        minutes: u,
        seconds: i ? d : null
      },
      Pn()
    );
    (S = (v = ui.notifications) == null ? void 0 : v.info) == null || S.call(
      v,
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
}, "#applyTargetSeconds"), rd = /* @__PURE__ */ c(function(t) {
  var m;
  const i = E(
    "EIDOLON.TimeTrigger.EditTimeInvalid",
    "Enter a valid time like 14:30 or 2:30 PM."
  );
  if (typeof t != "string")
    return { error: i };
  const r = t.trim();
  if (!r)
    return { error: i };
  const a = r.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (a) {
    const f = Number(a[1]), g = Number(a[2]), p = a[3] !== void 0 ? Number(a[3]) : void 0;
    if (Number.isInteger(f) && f >= 0 && f <= 23 && Number.isInteger(g) && g >= 0 && g <= 59 && (p === void 0 || Number.isInteger(p) && p >= 0 && p <= 59)) {
      const y = f * 3600 + g * 60 + (p ?? 0);
      return {
        canonical: zt({ hours: f, minutes: g, seconds: p }),
        seconds: y,
        includeSeconds: p !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const { amLower: o, pmLower: s, periodPattern: l } = C(this, re, Xs).call(this), u = r.match(
    new RegExp(
      `^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?\\s*(${l})$`,
      "i"
    )
  );
  if (u) {
    let f = Number(u[1]);
    const g = Number(u[2]), p = u[3] !== void 0 ? Number(u[3]) : void 0, y = u[4] ?? "", w = typeof y == "string" ? ((m = y.toLocaleLowerCase) == null ? void 0 : m.call(y)) ?? y.toLowerCase() : "";
    if (Number.isInteger(f) && f >= 1 && f <= 12 && Number.isInteger(g) && g >= 0 && g <= 59 && (p === void 0 || Number.isInteger(p) && p >= 0 && p <= 59) && (w === o || w === s || w === "am" || w === "pm")) {
      f = f % 12, (w === s || w === "pm") && (f += 12);
      const v = f * 3600 + g * 60 + (p ?? 0);
      return {
        canonical: zt({ hours: f, minutes: g, seconds: p }),
        seconds: v,
        includeSeconds: p !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const d = Gu(r);
  if (d !== null) {
    const f = Math.floor(d / 3600), g = Math.floor(d % 3600 / 60), p = d % 60, y = p !== 0;
    return {
      canonical: zt({
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
}, "#parseInputTime"), Ks = /* @__PURE__ */ c(function() {
  const t = C(this, re, nd).call(this);
  if (!t) return "";
  if (Pn() === "24h")
    return t;
  const r = zo(t);
  if (!r) return t;
  const a = Number(r.hours), o = Number(r.minutes), s = r.seconds !== null && r.seconds !== void 0 ? Number(r.seconds) : void 0;
  if (!Number.isFinite(a) || !Number.isFinite(o)) return t;
  const l = Number.isFinite(s), u = a % 12 === 0 ? 12 : a % 12, d = String(o).padStart(2, "0"), m = l ? `:${String(s).padStart(2, "0")}` : "", { amLabel: f, pmLabel: g } = C(this, re, Xs).call(this), p = a >= 12 ? g : f;
  return `${u}:${d}${m} ${p}`.trim();
}, "#getInitialEditValue"), Xs = /* @__PURE__ */ c(function() {
  var u, d;
  const t = E("EIDOLON.TimeTrigger.TimePeriodAM", "AM"), i = E("EIDOLON.TimeTrigger.TimePeriodPM", "PM"), r = ((u = t.toLocaleLowerCase) == null ? void 0 : u.call(t)) ?? t.toLowerCase(), a = ((d = i.toLocaleLowerCase) == null ? void 0 : d.call(i)) ?? i.toLowerCase(), o = C(this, re, Qs).call(this, t), s = C(this, re, Qs).call(this, i), l = `${o}|${s}|AM|PM`;
  return {
    amLabel: t,
    pmLabel: i,
    amLower: r,
    pmLower: a,
    periodPattern: l
  };
}, "#getPeriodMatchData"), Qs = /* @__PURE__ */ c(function(t) {
  return typeof t != "string" ? "" : t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}, "#escapeForRegex"), vo = new WeakMap(), wo = new WeakMap(), Zs = /* @__PURE__ */ c(function() {
  const t = this.scene;
  if (!t || typeof t.getFlag != "function") return !1;
  try {
    return !!t.getFlag(T, Ds);
  } catch (i) {
    N("TimeTriggerWindow | Failed to read scene real-time flag", {
      sceneId: (t == null ? void 0 : t.id) ?? null,
      message: (i == null ? void 0 : i.message) ?? String(i)
    });
  }
  return !1;
}, "#readSceneRealTimeFlag"), Eo = new WeakMap(), ad = /* @__PURE__ */ c(function() {
  if (typeof h(this, ai) == "function")
    try {
      h(this, ai).call(this);
    } catch (t) {
      console.error(`${T} | Failed to dispose time format subscription`, t);
    }
  L(this, ai, null);
}, "#disposeTimeFormatSubscription"), od = /* @__PURE__ */ c(function() {
  if (typeof h(this, oi) == "function")
    try {
      h(this, oi).call(this);
    } catch (t) {
      console.error(`${T} | Failed to dispose manage time subscription`, t);
    }
  L(this, oi, null);
}, "#disposeManageTimeSubscription"), c(ii, "TimeTriggerWindow"), ye(ii, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Re(ii, ii, "DEFAULT_OPTIONS"),
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
)), ye(ii, "PARTS", {
  content: {
    template: `modules/${T}/templates/time-trigger.html`
  }
});
let Ws = ii;
function Go(n, e = {}) {
  if (typeof n != "function")
    throw new TypeError("createApplicationFactory requires a constructor function.");
  const t = /* @__PURE__ */ c(function(r = {}) {
    const a = foundry.utils.mergeObject(
      e ?? {},
      r ?? {},
      { inplace: !1 }
    );
    return new n(a);
  }, "applicationFactory");
  return t.__eidolonFactorySignature = "options", t.__eidolonFactoryTarget = n, t;
}
c(Go, "createApplicationFactory");
const Bc = /* @__PURE__ */ new Set();
var Ce, Qe, si, tr, sd, ld;
const Oc = class Oc {
  constructor({ windowFactory: e } = {}) {
    k(this, tr);
    k(this, Ce, null);
    k(this, Qe, null);
    k(this, si);
    const t = Go(Ws);
    typeof e == "function" ? e.__eidolonFactorySignature === "options" ? L(this, si, (r, a = {}) => e({ scene: r, ...a ?? {} })) : L(this, si, e) : L(this, si, /* @__PURE__ */ c((r, a = {}) => t({ scene: r, ...a ?? {} }), "fallbackFactory"));
  }
  onReady() {
    var t;
    const e = typeof ((t = game.time) == null ? void 0 : t.worldTime) == "number" && Number.isFinite(game.time.worldTime) ? game.time.worldTime : null;
    N("TimeTriggerManager#onReady", { worldTime: e }), e !== null && L(this, Qe, e);
  }
  onCanvasReady(e) {
    const t = (e == null ? void 0 : e.scene) ?? fr();
    N("TimeTriggerManager#onCanvasReady", { sceneId: (t == null ? void 0 : t.id) ?? null }), this.refreshTimeTriggerWindow(t), this.handleTimeTriggerEvaluation(t);
  }
  onUpdateScene(e) {
    const t = fr();
    N("TimeTriggerManager#onUpdateScene", {
      sceneId: (e == null ? void 0 : e.id) ?? null,
      activeSceneId: (t == null ? void 0 : t.id) ?? null
    }), !(!t || e.id !== t.id) && (this.refreshTimeTriggerWindow(e), this.handleTimeTriggerEvaluation(e));
  }
  onUpdateWorldTime(e, t) {
    N("TimeTriggerManager#onUpdateWorldTime", {
      worldTime: e,
      diff: t,
      hasWindow: !!h(this, Ce)
    }), h(this, Ce) && h(this, Ce).render();
    const i = fr(), r = C(this, tr, sd).call(this, e, t);
    this.handleTimeTriggerEvaluation(i, e, r);
  }
  refreshTimeTriggerWindow(e) {
    var l, u, d;
    if (!e) return;
    const t = !!((l = game.user) != null && l.isGM), i = !!e.getFlag(T, qa), r = !!e.getFlag(T, $s), a = !!e.getFlag(T, Fs);
    if (N("TimeTriggerManager#refreshTimeTriggerWindow", {
      sceneId: e.id,
      isGM: t,
      isActive: i,
      hideWindow: r,
      showPlayerWindow: a
    }), !(i && !r && (t || a))) {
      h(this, Ce) && (N("Closing time trigger window", { reason: "not-visible" }), h(this, Ce).close({ force: !0 }), L(this, Ce, null));
      return;
    }
    const s = !!t;
    if (h(this, Ce) && ((u = h(this, Ce).scene) == null ? void 0 : u.id) === e.id) {
      N("Refreshing existing time trigger window", { sceneId: e.id }), h(this, Ce).showControls = s, h(this, Ce).render();
      return;
    }
    h(this, Ce) && (N("Closing existing window before creating new instance", {
      previousSceneId: ((d = h(this, Ce).scene) == null ? void 0 : d.id) ?? null
    }), h(this, Ce).close({ force: !0 })), L(this, Ce, h(this, si).call(this, e, { showControls: s })), N("Rendering new time trigger window", { sceneId: e.id }), h(this, Ce).render({ force: !0 });
  }
  async handleTimeTriggerEvaluation(e, t, i) {
    var l;
    const r = e ?? fr();
    if (!r) {
      N("handleTimeTriggerEvaluation skipped", {
        reason: "no-active-scene",
        providedSceneId: (e == null ? void 0 : e.id) ?? null,
        currentWorldTime: t
      }), typeof t == "number" && Number.isFinite(t) && L(this, Qe, t);
      return;
    }
    const a = typeof t == "number" && Number.isFinite(t) ? t : typeof ((l = game.time) == null ? void 0 : l.worldTime) == "number" ? game.time.worldTime : null;
    if (a === null) return;
    const o = typeof i == "number" && Number.isFinite(i) ? i : null, s = o !== null ? o : typeof h(this, Qe) == "number" && Number.isFinite(h(this, Qe)) ? h(this, Qe) : a;
    Xi("handleTimeTriggerEvaluation", {
      sceneId: r.id,
      previousWorldTime: s,
      currentWorldTime: a,
      overrideProvided: o !== null
    });
    try {
      await C(this, tr, ld).call(this, r, s, a);
    } catch (u) {
      console.error(`${T} | Unexpected error while evaluating time triggers`, u), N("handleTimeTriggerEvaluation error", { message: (u == null ? void 0 : u.message) ?? String(u) });
    } finally {
      L(this, Qe, a), Dn();
    }
  }
};
Ce = new WeakMap(), Qe = new WeakMap(), si = new WeakMap(), tr = new WeakSet(), sd = /* @__PURE__ */ c(function(e, t) {
  return typeof h(this, Qe) == "number" && Number.isFinite(h(this, Qe)) ? (N("Resolved previous world time from cache", {
    previousWorldTime: h(this, Qe)
  }), h(this, Qe)) : typeof e == "number" && Number.isFinite(e) && typeof t == "number" && Number.isFinite(t) ? (N("Resolved previous world time using diff", {
    worldTime: e,
    diff: t,
    resolved: e - t
  }), e - t) : typeof e == "number" && Number.isFinite(e) ? e : null;
}, "#resolvePreviousWorldTime"), ld = /* @__PURE__ */ c(async function(e, t, i) {
  var p, y, w;
  if (!((p = game.user) != null && p.isGM)) {
    N("Skipping trigger evaluation because user is not a GM");
    return;
  }
  if (!(e != null && e.id)) {
    N("Skipping trigger evaluation because the scene is missing an id");
    return;
  }
  if (!!!e.getFlag(T, qa)) {
    N("Skipping trigger evaluation because scene is inactive", { sceneId: e.id });
    return;
  }
  if (typeof i != "number" || !Number.isFinite(i)) return;
  (typeof t != "number" || !Number.isFinite(t)) && (t = i);
  const a = Bi(e);
  if (!a.length) {
    N("No time triggers configured for scene", { sceneId: e.id });
    return;
  }
  const o = Wm(e), s = /* @__PURE__ */ new Set();
  for (const b of a)
    b != null && b.id && s.add(b.id);
  let l = !1;
  for (const b of Object.keys(o))
    s.has(b) || (delete o[b], l = !0);
  if (Xi("Evaluating scene time triggers", {
    sceneId: e.id,
    previousWorldTime: t,
    currentWorldTime: i,
    triggerCount: a.length
  }), i <= t) {
    N("Detected world time rewind", {
      previousWorldTime: t,
      currentWorldTime: i
    });
    for (const b of a) {
      if (!(b != null && b.id) || !b.allowReplayOnRewind) continue;
      const v = o[b.id];
      typeof v == "number" ? i < v ? (N("Clearing trigger history due to rewind", {
        triggerId: b.id,
        lastFired: v,
        currentWorldTime: i
      }), delete o[b.id], l = !0) : N("Preserving trigger history after rewind", {
        triggerId: b.id,
        lastFired: v,
        currentWorldTime: i
      }) : N("No history stored for rewind-enabled trigger", {
        triggerId: b.id
      });
    }
    l && (N("Persisting history cleanup after rewind", {
      sceneId: e.id
    }), await gs(e, o)), Dn();
    return;
  }
  const u = t, d = i, m = [], f = Math.floor(u / ji), g = Math.floor(d / ji);
  for (const b of a) {
    if (!(b != null && b.id)) continue;
    const v = Gu(b.time);
    if (v === null) {
      ah(e, b), N("Skipping trigger with invalid time", {
        triggerId: b.id,
        time: b.time
      });
      continue;
    }
    for (let S = f; S <= g; S++) {
      const I = S * ji + v;
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
      m.push({ trigger: b, absoluteTime: I });
    }
  }
  if (!m.length) {
    l && await gs(e, o), N("No triggers scheduled to fire within evaluation window", {
      sceneId: e.id
    }), Dn();
    return;
  }
  m.sort((b, v) => b.absoluteTime - v.absoluteTime), N("Queued triggers for execution", {
    entries: m.map((b) => ({
      triggerId: b.trigger.id,
      absoluteTime: b.absoluteTime
    }))
  });
  for (const b of m)
    try {
      N("Executing time trigger action", {
        triggerId: b.trigger.id,
        absoluteTime: b.absoluteTime
      }), await Zu(e, b.trigger);
    } catch (v) {
      console.error(`${T} | Failed to execute time trigger action`, v), (w = (y = ui.notifications) == null ? void 0 : y.error) == null || w.call(
        y,
        E(
          "EIDOLON.TimeTrigger.TriggerActionError",
          "Failed to execute a scene time trigger action. Check the console for details."
        )
      ), N("Trigger execution failed", {
        triggerId: b.trigger.id,
        message: (v == null ? void 0 : v.message) ?? String(v)
      });
    } finally {
      o[b.trigger.id] = b.absoluteTime, l = !0, N("Recorded trigger execution", {
        triggerId: b.trigger.id,
        absoluteTime: b.absoluteTime
      });
    }
  l && (N("Persisting trigger history updates", { sceneId: e.id }), await gs(e, o)), Dn();
}, "#evaluateSceneTimeTriggers"), c(Oc, "TimeTriggerManager");
let el = Oc;
function ah(n, e) {
  var r, a;
  const t = `${(n == null ? void 0 : n.id) ?? "unknown"}:${(e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.time) ?? "unknown"}`;
  if (Bc.has(t)) return;
  Bc.add(t);
  const i = E(
    "EIDOLON.TimeTrigger.InvalidTimeWarning",
    "A scene time trigger has an invalid time value and was skipped."
  );
  (a = (r = ui.notifications) == null ? void 0 : r.warn) == null || a.call(r, i), console.warn(`${T} | Invalid time for trigger`, { scene: n == null ? void 0 : n.id, trigger: e });
}
c(ah, "warnInvalidTriggerTime");
var Tt, Fr, Lt, Sn, li, qt, Wi, Co, So, Dr, Pr, ci, jt, z, nl, _i, Ea, il, Ca, rl, Rt, cd, al, ud, ol, dd, To, Lo, Io, Oo, Ao, ko, sl, fd, Sa, Mo, _o;
const Ac = class Ac {
  constructor() {
    k(this, z);
    k(this, Tt, !1);
    k(this, Fr, ea);
    k(this, Lt, /* @__PURE__ */ new Map());
    k(this, Sn, null);
    k(this, li, null);
    k(this, qt, 0);
    k(this, Wi, null);
    k(this, Co, null);
    k(this, So, null);
    k(this, Dr, !1);
    k(this, Pr, !1);
    k(this, ci, !1);
    k(this, jt, !1);
    k(this, To, /* @__PURE__ */ c((e, t = {}) => {
      N("GameTimeAutomation | Pause state changed", {
        paused: e,
        userId: (t == null ? void 0 : t.userId) ?? null,
        broadcast: (t == null ? void 0 : t.broadcast) ?? null
      }), C(this, z, Rt).call(this, { pausedOverride: e });
    }, "#handlePause"));
    k(this, Lo, /* @__PURE__ */ c((e) => {
      e != null && e.id && (h(this, Lt).set(e.id, Math.max(e.round ?? 0, 1)), N("GameTimeAutomation | Combat started", { combatId: e.id, round: e.round ?? 0 }), C(this, z, Rt).call(this));
    }, "#handleCombatStart"));
    k(this, Io, /* @__PURE__ */ c((e, t) => {
      if (!(e != null && e.id)) return;
      const i = typeof t == "number" && Number.isFinite(t) ? t : typeof e.round == "number" && Number.isFinite(e.round) ? e.round : 0, r = i > 0 ? i : 1, a = h(this, Lt).get(e.id), o = a ? Math.max(a, 1) : 1, s = r > 1 ? Math.max(r - o, 0) : 0;
      if (N("GameTimeAutomation | Combat round change detected", {
        combatId: e.id,
        effectiveRound: r,
        completedRounds: s,
        enabled: h(this, Tt),
        paused: (game == null ? void 0 : game.paused) ?? null
      }), s > 0 && h(this, Tt) && h(this, jt) && !(game != null && game.paused) && C(this, z, _i).call(this) && C(this, z, Ea).call(this, e)) {
        const l = s * h(this, Fr);
        l > 0 && (N("GameTimeAutomation | Advancing time for completed combat rounds", {
          combatId: e.id,
          completedRounds: s,
          delta: l
        }), C(this, z, ol).call(this, l));
      }
      h(this, Lt).set(e.id, Math.max(r, 1));
    }, "#handleCombatRound"));
    k(this, Oo, /* @__PURE__ */ c((e) => {
      e != null && e.id && (h(this, Lt).delete(e.id), N("GameTimeAutomation | Combat ended", { combatId: e.id }), C(this, z, Rt).call(this));
    }, "#handleCombatEnd"));
    k(this, Ao, /* @__PURE__ */ c((e) => {
      e != null && e.id && (h(this, Lt).delete(e.id), N("GameTimeAutomation | Combat deleted", { combatId: e.id }), C(this, z, Rt).call(this));
    }, "#handleCombatDelete"));
    k(this, ko, /* @__PURE__ */ c((e, t) => {
      if (e != null && e.id) {
        if (typeof (t == null ? void 0 : t.round) == "number" && Number.isFinite(t.round)) {
          const i = Math.max(t.round, 1);
          h(this, Lt).set(e.id, i), N("GameTimeAutomation | Combat round manually updated", {
            combatId: e.id,
            round: i
          });
        }
        (Object.prototype.hasOwnProperty.call(t ?? {}, "active") || (t == null ? void 0 : t.round) !== void 0) && C(this, z, Rt).call(this);
      }
    }, "#handleCombatUpdate"));
    k(this, Mo, /* @__PURE__ */ c((e) => {
      C(this, z, Sa).call(this, e == null ? void 0 : e.scene), C(this, z, Rt).call(this);
    }, "#handleCanvasReady"));
    k(this, _o, /* @__PURE__ */ c((e) => {
      if (!Je(e)) return;
      const t = C(this, z, sl).call(this);
      if (!t || t.id !== e.id) return;
      C(this, z, Sa).call(this, e) && C(this, z, Rt).call(this);
    }, "#handleSceneUpdate"));
  }
  registerHooks() {
    h(this, Dr) || (L(this, Dr, !0), Hooks.on("pauseGame", h(this, To)), Hooks.on("combatStart", h(this, Lo)), Hooks.on("combatRound", h(this, Io)), Hooks.on("combatEnd", h(this, Oo)), Hooks.on("deleteCombat", h(this, Ao)), Hooks.on("updateCombat", h(this, ko)), Hooks.on("canvasReady", h(this, Mo)), Hooks.on("updateScene", h(this, _o)));
  }
  initialize() {
    h(this, Pr) || (L(this, Pr, !0), L(this, Co, Ju((e) => {
      const t = !!e, i = t !== h(this, Tt);
      L(this, Tt, t), N("GameTimeAutomation | Manage time toggled", { enabled: t }), i && t && C(this, z, rl).call(this), C(this, z, Rt).call(this);
    })), L(this, So, Vm((e) => {
      L(this, Fr, e), N("GameTimeAutomation | Seconds per round updated", { value: e });
    })), C(this, z, rl).call(this), C(this, z, Sa).call(this), C(this, z, Rt).call(this));
  }
};
Tt = new WeakMap(), Fr = new WeakMap(), Lt = new WeakMap(), Sn = new WeakMap(), li = new WeakMap(), qt = new WeakMap(), Wi = new WeakMap(), Co = new WeakMap(), So = new WeakMap(), Dr = new WeakMap(), Pr = new WeakMap(), ci = new WeakMap(), jt = new WeakMap(), z = new WeakSet(), nl = /* @__PURE__ */ c(function() {
  var e;
  try {
    if (typeof ((e = globalThis.performance) == null ? void 0 : e.now) == "function")
      return globalThis.performance.now();
  } catch (t) {
    N("GameTimeAutomation | Failed to read high-resolution timestamp", {
      message: (t == null ? void 0 : t.message) ?? String(t)
    });
  }
  return Date.now();
}, "#currentTimestamp"), _i = /* @__PURE__ */ c(function() {
  var e;
  return !!((e = game == null ? void 0 : game.user) != null && e.isGM && game.user.active !== !1);
}, "#canControlTime"), Ea = /* @__PURE__ */ c(function(e) {
  var i, r;
  if (!e) return !1;
  if (e.active === !0) return !0;
  if (e.active === !1) return !1;
  const t = (i = game == null ? void 0 : game.combats) == null ? void 0 : i.active;
  return (t == null ? void 0 : t.id) === e.id ? !0 : ((r = game == null ? void 0 : game.combat) == null ? void 0 : r.id) === e.id ? game.combat.active ?? !0 : !1;
}, "#isCombatDocumentActive"), il = /* @__PURE__ */ c(function(e) {
  return e ? typeof e.started == "boolean" ? e.started : (e.round ?? 0) > 0 : !1;
}, "#hasCombatStarted"), Ca = /* @__PURE__ */ c(function() {
  var i;
  const e = Array.isArray((i = game == null ? void 0 : game.combats) == null ? void 0 : i.contents) ? game.combats.contents : [];
  for (const r of e)
    if (C(this, z, Ea).call(this, r) && C(this, z, il).call(this, r))
      return !0;
  const t = game == null ? void 0 : game.combat;
  return !!(t && C(this, z, Ea).call(this, t) && C(this, z, il).call(this, t));
}, "#isCombatRunning"), rl = /* @__PURE__ */ c(function() {
  var t;
  h(this, Lt).clear();
  const e = Array.isArray((t = game == null ? void 0 : game.combats) == null ? void 0 : t.contents) ? game.combats.contents : [];
  for (const i of e)
    i != null && i.id && h(this, Lt).set(i.id, Math.max(i.round ?? 0, 1));
}, "#hydrateRoundTracking"), Rt = /* @__PURE__ */ c(function({ pausedOverride: e } = {}) {
  const t = typeof e == "boolean" ? e : !!(game != null && game.paused), i = h(this, Tt), r = h(this, jt), a = i && r, o = {
    manageTimeEnabled: i,
    sceneAllowsRealTime: r,
    effectiveEnabled: a,
    paused: t,
    canControl: C(this, z, _i).call(this),
    combatRunning: C(this, z, Ca).call(this),
    overrideApplied: typeof e == "boolean"
  };
  if (N("GameTimeAutomation | Sync running state", o), !a || !C(this, z, _i).call(this)) {
    C(this, z, al).call(this);
    return;
  }
  C(this, z, cd).call(this);
}, "#syncRunningState"), cd = /* @__PURE__ */ c(function() {
  h(this, Sn) === null && (L(this, li, C(this, z, nl).call(this)), L(this, Sn, globalThis.setInterval(() => C(this, z, ud).call(this), 1e3)), N("GameTimeAutomation | Started real-time ticker"));
}, "#startRealTimeTicker"), al = /* @__PURE__ */ c(function() {
  h(this, Sn) !== null && (globalThis.clearInterval(h(this, Sn)), L(this, Sn, null), N("GameTimeAutomation | Stopped real-time ticker")), L(this, li, null), L(this, qt, 0), L(this, ci, !1);
}, "#stopRealTimeTicker"), ud = /* @__PURE__ */ c(function() {
  if (!h(this, Tt) || !h(this, jt) || !C(this, z, _i).call(this)) {
    C(this, z, al).call(this);
    return;
  }
  const e = C(this, z, nl).call(this);
  if (typeof e != "number" || !Number.isFinite(e)) return;
  const t = h(this, li) ?? e, i = (e - t) / 1e3;
  if (L(this, li, e), !Number.isFinite(i) || i <= 0) return;
  const r = !!(game != null && game.paused), a = C(this, z, Ca).call(this);
  if (r || a) {
    h(this, ci) || N("GameTimeAutomation | Tick skipped", { paused: r, combatRunning: a }), L(this, ci, !0), L(this, qt, 0);
    return;
  }
  L(this, ci, !1), N("GameTimeAutomation | Real-time tick", { deltaSeconds: i }), C(this, z, ol).call(this, i);
}, "#tickRealTime"), ol = /* @__PURE__ */ c(function(e) {
  if (!h(this, Tt) || !h(this, jt)) return;
  const t = Number(e);
  !Number.isFinite(t) || t <= 0 || (L(this, qt, h(this, qt) + t), !h(this, Wi) && L(this, Wi, C(this, z, dd).call(this)));
}, "#queueAdvance"), dd = /* @__PURE__ */ c(async function() {
  var e, t;
  for (; h(this, qt) > 0; ) {
    if (!h(this, Tt) || !h(this, jt) || game != null && game.paused || !C(this, z, _i).call(this) || C(this, z, Ca).call(this)) {
      L(this, qt, 0);
      break;
    }
    const i = h(this, qt);
    L(this, qt, 0);
    try {
      if (typeof ((e = game == null ? void 0 : game.time) == null ? void 0 : e.advance) == "function")
        N("GameTimeAutomation | Advancing world time", { delta: i }), await game.time.advance(i), N("GameTimeAutomation | World time advanced", {
          worldTime: ((t = game.time) == null ? void 0 : t.worldTime) ?? null
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
  L(this, Wi, null);
}, "#flushAdvanceQueue"), To = new WeakMap(), Lo = new WeakMap(), Io = new WeakMap(), Oo = new WeakMap(), Ao = new WeakMap(), ko = new WeakMap(), sl = /* @__PURE__ */ c(function() {
  const e = fr();
  return Je(e) ? e : null;
}, "#getActiveSceneDocument"), fd = /* @__PURE__ */ c(function(e) {
  if (!Je(e)) return !1;
  try {
    return !!e.getFlag(T, Ds);
  } catch (t) {
    return N("GameTimeAutomation | Failed to read scene real-time flag", {
      sceneId: (e == null ? void 0 : e.id) ?? null,
      message: (t == null ? void 0 : t.message) ?? String(t)
    }), !1;
  }
}, "#isSceneRealTimeAllowed"), Sa = /* @__PURE__ */ c(function(e) {
  const t = Je(e) ? e : C(this, z, sl).call(this), i = C(this, z, fd).call(this, t), r = h(this, jt);
  return L(this, jt, i), r !== i ? (N("GameTimeAutomation | Scene real-time allowance changed", {
    sceneId: (t == null ? void 0 : t.id) ?? null,
    allows: i
  }), !0) : !1;
}, "#refreshSceneAutomationState"), Mo = new WeakMap(), _o = new WeakMap(), c(Ac, "GameTimeAutomation");
let tl = Ac;
var Hu, Tn, He, di, cn, No, Ee, md, hd, gd, pd, xo, cl, $o, yd, Fo, bd, vd;
const an = class an extends Wn(Gn) {
  constructor(t = {}) {
    const { scene: i, trigger: r, triggerIndex: a, onSave: o, ...s } = t ?? {};
    super(s);
    k(this, Ee);
    k(this, Tn, null);
    k(this, He, null);
    k(this, di, null);
    k(this, cn, null);
    k(this, No, /* @__PURE__ */ c(() => {
      (this.rendered ?? this.isRendered ?? !1) && (L(this, cn, C(this, Ee, md).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    k(this, xo, /* @__PURE__ */ c((t) => {
      var a, o;
      const i = t.currentTarget, r = i == null ? void 0 : i.closest("form");
      r && (N("Trigger action selection changed", {
        sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
        triggerId: ((o = this.trigger) == null ? void 0 : o.id) ?? null,
        actionId: (i == null ? void 0 : i.value) ?? null
      }), C(this, Ee, cl).call(this, i.value, r));
    }, "#onActionSelectChange"));
    k(this, $o, /* @__PURE__ */ c((t) => {
      var u, d, m, f;
      t.preventDefault();
      const i = t.currentTarget, r = i == null ? void 0 : i.closest("form");
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
    k(this, Fo, /* @__PURE__ */ c(async (t) => {
      var r, a;
      t.preventDefault();
      const i = t.currentTarget;
      i instanceof HTMLFormElement && (N("Trigger form submitted", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null,
        triggerId: ((a = this.trigger) == null ? void 0 : a.id) ?? null
      }), await C(this, Ee, bd).call(this, i));
    }, "#onSubmit"));
    this.scene = i ?? null, this.trigger = r ?? null, this.triggerIndex = Number.isInteger(a) ? Number(a) : null, this.onSave = typeof o == "function" ? o : null, L(this, di, ac(h(this, No)));
  }
  async _prepareContext() {
    var t, i;
    Xi("TriggerFormApplication#_prepareContext", {
      sceneId: ((t = this.scene) == null ? void 0 : t.id) ?? null,
      triggerId: ((i = this.trigger) == null ? void 0 : i.id) ?? null,
      triggerIndex: this.triggerIndex
    });
    try {
      const r = this.trigger ?? { action: wa, data: {} }, a = r.action ?? wa, o = jc(r.time), s = o.format ?? "12h", l = s === "12h" ? rh() : [], u = o.period ?? (l.length > 0 ? l[0].value : null), d = s === "12h" ? l.map((g) => ({
        ...g,
        selected: g.value === u
      })) : [], m = qc().map((g) => ({
        id: g.id,
        label: typeof g.label == "function" ? g.label() : g.label,
        selected: g.id === a
      })), f = qc().map((g) => {
        const p = g.id === r.action ? r : { ...r, action: g.id }, y = Xm(p);
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
      Dn();
    }
  }
  _onRender(t, i) {
    var l, u, d;
    super._onRender(t, i);
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
    C(this, Ee, yd).call(this, o), C(this, Ee, hd).call(this, o), o.addEventListener("submit", h(this, Fo));
    const s = o.querySelector("[data-action-select]");
    s && (s.addEventListener("change", h(this, xo)), C(this, Ee, cl).call(this, s.value, o)), o.querySelectorAll("[data-action-file-picker]").forEach((m) => {
      m.addEventListener("click", h(this, $o));
    });
  }
  async close(t = {}) {
    var i;
    if ((i = h(this, Tn)) == null || i.call(this), L(this, Tn, null), L(this, He, null), L(this, cn, null), typeof h(this, di) == "function")
      try {
        h(this, di).call(this);
      } catch (r) {
        console.error(`${T} | Failed to dispose trigger form time format subscription`, r);
      }
    return L(this, di, null), super.close(t);
  }
};
Tn = new WeakMap(), He = new WeakMap(), di = new WeakMap(), cn = new WeakMap(), No = new WeakMap(), Ee = new WeakSet(), md = /* @__PURE__ */ c(function() {
  var s, l, u, d, m, f, g;
  const t = (l = (s = this.element) == null ? void 0 : s.querySelector) == null ? void 0 : l.call(s, "form");
  if (!(t instanceof HTMLFormElement)) return null;
  const i = Array.from(t.elements ?? []), r = [];
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
  const a = t.querySelector("[data-time-format]");
  let o = null;
  if (a instanceof HTMLElement) {
    const p = a.querySelector("[data-time-hidden]"), y = a.querySelector("[data-time-hour]"), w = a.querySelector("[data-time-minute]"), b = a.querySelector("[data-time-period]");
    o = {
      format: ((g = a.dataset) == null ? void 0 : g.timeFormat) ?? null,
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
}, "#captureFormState"), hd = /* @__PURE__ */ c(function(t) {
  if (!h(this, cn)) return;
  if (!(t instanceof HTMLFormElement)) {
    L(this, cn, null);
    return;
  }
  const { fields: i = [], time: r = null } = h(this, cn) ?? {};
  L(this, cn, null), C(this, Ee, gd).call(this, t, i), C(this, Ee, pd).call(this, t, r);
}, "#restorePendingFormState"), gd = /* @__PURE__ */ c(function(t, i) {
  if (!Array.isArray(i) || i.length === 0) return;
  const r = typeof (CSS == null ? void 0 : CSS.escape) == "function" ? CSS.escape : (a) => a;
  for (const a of i) {
    if (!a || typeof a.name != "string") continue;
    const o = r(a.name);
    if (a.kind === "checkbox" || a.kind === "radio") {
      const l = `input[type="${a.kind}"][name="${o}"]`, u = t.querySelectorAll(l);
      u.forEach((d) => {
        d instanceof HTMLInputElement && (u.length === 1 || d.value === a.value) && (d.checked = !!a.checked);
      });
      continue;
    }
    if (a.kind === "select-multiple") {
      const l = t.querySelector(`select[name="${o}"]`);
      if (!(l instanceof HTMLSelectElement)) continue;
      const u = new Set(Array.isArray(a.values) ? a.values : []);
      Array.from(l.options ?? []).forEach((d) => {
        d.selected = u.has(d.value);
      });
      continue;
    }
    const s = t.querySelector(`[name="${o}"]`);
    (s instanceof HTMLInputElement || s instanceof HTMLSelectElement || s instanceof HTMLTextAreaElement) && (s.value = a.value ?? "");
  }
}, "#restoreFieldValues"), pd = /* @__PURE__ */ c(function(t, i) {
  var v, S, I;
  const r = t.querySelector("[data-time-format]");
  if (!(r instanceof HTMLElement)) {
    typeof h(this, He) == "function" && h(this, He).call(this);
    return;
  }
  const a = ((v = r.dataset) == null ? void 0 : v.timeFormat) === "24h" ? "24h" : "12h", o = r.querySelector("[data-time-hour]"), s = r.querySelector("[data-time-minute]"), l = r.querySelector("[data-time-period]"), u = r.querySelector("[data-time-hidden]");
  if (!i) {
    if (o instanceof HTMLInputElement && (o.value = ""), s instanceof HTMLInputElement && (s.value = ""), l instanceof HTMLSelectElement) {
      const A = ((I = (S = l.options) == null ? void 0 : S[0]) == null ? void 0 : I.value) ?? "";
      l.value = A;
    }
    u instanceof HTMLInputElement && (u.value = ""), typeof h(this, He) == "function" && h(this, He).call(this);
    return;
  }
  const d = typeof i.canonical == "string" ? i.canonical : "", m = typeof i.period == "string" ? i.period : "", f = typeof i.hour == "string" ? i.hour : "", g = typeof i.minute == "string" ? i.minute : "";
  let p = "", y = "", w = m, b = d;
  if (d) {
    const A = jc(d, a);
    p = A.hour ?? "", y = A.minute ?? "", b = A.canonical ?? d, a === "12h" ? w = A.period ?? m : w = "";
  } else
    p = f, y = g, a !== "12h" && (w = "");
  if (o instanceof HTMLInputElement && (o.value = p ?? ""), s instanceof HTMLInputElement && (s.value = y ?? ""), l instanceof HTMLSelectElement)
    if (a === "12h") {
      const A = Array.from(l.options ?? []);
      A.find((x) => x.value === w) ? l.value = w : A.length > 0 ? l.value = A[0].value : l.value = "";
    } else
      l.value = "";
  u instanceof HTMLInputElement && (u.value = b ?? ""), typeof h(this, He) == "function" && h(this, He).call(this);
}, "#restoreTimeInputs"), xo = new WeakMap(), cl = /* @__PURE__ */ c(function(t, i) {
  i && i.querySelectorAll("[data-action-config]").forEach((r) => {
    const a = r.dataset.actionConfig === t;
    r.style.display = a ? "" : "none";
  });
}, "#updateActionSections"), $o = new WeakMap(), yd = /* @__PURE__ */ c(function(t) {
  var m, f, g, p;
  if ((m = h(this, Tn)) == null || m.call(this), L(this, Tn, null), L(this, He, null), !(t instanceof HTMLFormElement)) return;
  const i = t.querySelector("[data-time-format]"), r = ((f = i == null ? void 0 : i.dataset) == null ? void 0 : f.timeFormat) ?? null;
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
    const { canonical: y, error: w } = ih(
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
  }), d(), L(this, Tn, () => {
    u.forEach((y) => {
      y.removeEventListener("input", d), y.removeEventListener("change", d);
    });
  }), L(this, He, d), N("Trigger form configured for time input", {
    format: r,
    sceneId: ((g = this.scene) == null ? void 0 : g.id) ?? null,
    triggerId: ((p = this.trigger) == null ? void 0 : p.id) ?? null
  });
}, "#setupTimeInput"), Fo = new WeakMap(), bd = /* @__PURE__ */ c(async function(t) {
  var a, o, s, l, u;
  if (typeof h(this, He) == "function" && h(this, He).call(this), typeof t.checkValidity == "function" && !t.checkValidity()) {
    typeof t.reportValidity == "function" && t.reportValidity(), N("Trigger form submission blocked by validity check", {
      sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
      triggerId: ((o = this.trigger) == null ? void 0 : o.id) ?? null
    });
    return;
  }
  const i = new FormData(t), r = Object.fromEntries(i.entries());
  delete r.timeHour, delete r.timeMinute, delete r.timePeriod, r.allowReplayOnRewind = ((s = t.querySelector('input[name="allowReplayOnRewind"]')) == null ? void 0 : s.checked) ?? !1, N("Processing trigger form submission", {
    sceneId: ((l = this.scene) == null ? void 0 : l.id) ?? null,
    triggerId: ((u = this.trigger) == null ? void 0 : u.id) ?? null,
    allowReplayOnRewind: r.allowReplayOnRewind
  }), await C(this, Ee, vd).call(this, r), await this.close();
}, "#handleSubmit"), vd = /* @__PURE__ */ c(async function(t) {
  var a, o, s, l, u, d;
  const i = {
    id: ((a = this.trigger) == null ? void 0 : a.id) ?? Rm(),
    time: t.time ?? "",
    action: t.action ?? wa,
    allowReplayOnRewind: !!t.allowReplayOnRewind,
    data: {}
  };
  N("Persisting trigger from form", {
    sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
    triggerId: i.id,
    existingIndex: this.triggerIndex
  }), Qm(i, t);
  const r = Bi(this.scene);
  this.triggerIndex !== null && r[this.triggerIndex] ? r[this.triggerIndex] = i : r.push(i);
  try {
    await Qu(this.scene, r), N("Trigger list saved", {
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
}, "#persistTrigger"), c(an, "TriggerFormApplication"), ye(an, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Re(an, an, "DEFAULT_OPTIONS"),
  {
    id: `${T}-trigger-form`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Hu = Re(an, an, "DEFAULT_OPTIONS")) == null ? void 0 : Hu.classes) ?? [], "standard-form", "themed"])
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
)), ye(an, "PARTS", {
  content: {
    template: `modules/${T}/templates/time-trigger-form.html`
  }
});
let ll = an;
function Kt(n) {
  return n instanceof HTMLElement ? n : (n == null ? void 0 : n[0]) instanceof HTMLElement ? n[0] : null;
}
c(Kt, "asHTMLElement");
function Ta(n) {
  return typeof (n == null ? void 0 : n.changeTab) == "function";
}
c(Ta, "isAppV2");
function wd(n, e, t, i = {}) {
  if (Ta(n)) {
    n.changeTab(e, t, i);
    return;
  }
  if (typeof (n == null ? void 0 : n.activateTab) == "function") {
    const r = { ...i };
    t != null && (r.group = t), r.triggerCallback == null && (r.triggerCallback = !0), n.activateTab(e, r);
  }
}
c(wd, "setActiveTab");
function oh(n) {
  var t, i;
  if (!(n instanceof HTMLFormElement)) return {};
  const e = ((i = (t = foundry == null ? void 0 : foundry.applications) == null ? void 0 : t.ux) == null ? void 0 : i.FormDataExtended) ?? globalThis.FormDataExtended ?? null;
  if (!e) return {};
  try {
    const r = new e(n), a = typeof r.object == "object" ? r.object : {};
    return foundry.utils.expandObject(a);
  } catch {
    return {};
  }
}
c(oh, "readFormData");
const Uc = Symbol.for("eidolon.sceneConfig.v13PatchedTabs");
function Ed(n = {}) {
  const {
    tabId: e,
    tabLabel: t,
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
  } = n ?? {};
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
  }, w = Symbol(`EIDOLON_SCENE_CONFIG_TAB_CLEANUP_${e}`), b = typeof i == "function" ? i : () => null, v = typeof r == "function" ? r : () => !0, S = typeof t == "function" ? t : () => typeof t == "string" ? t : e;
  function I() {
    var j, B, V, J, ae;
    const _ = ((B = (j = foundry == null ? void 0 : foundry.applications) == null ? void 0 : j.sheets) == null ? void 0 : B.SceneConfig) ?? ((V = CONFIG == null ? void 0 : CONFIG.Scene) == null ? void 0 : V.sheetClass);
    if (!_ || !Ta({ changeTab: (J = _.prototype) == null ? void 0 : J.changeTab })) return;
    const H = _[Uc] ?? /* @__PURE__ */ new Set();
    if (H.has(e)) return;
    H.add(e), _[Uc] = H;
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
    const q = b(_);
    if (!v(_, q)) {
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
      const V = Kt(H) ?? Kt(_.element);
      if (!V) {
        g("Missing root element", { tabId: e });
        return;
      }
      Ta(_) ? M(_, V, q) : x(_, V, q);
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
    var ot, Zt, Ke, Ae, Oi, en, Yn, st, tn, R, oa, X, bt, Ne, rr, sa;
    const B = [
      "nav.sheet-tabs[data-group]",
      "nav.tabs[data-group]",
      "nav.sheet-tabs",
      "nav.tabs"
    ].map((xe) => H.querySelector(xe)).find((xe) => xe instanceof HTMLElement), J = [
      (ot = H.querySelector(".tab[data-tab]")) == null ? void 0 : ot.parentElement,
      H.querySelector(".sheet-body"),
      (Ke = (Zt = B == null ? void 0 : B.parentElement) == null ? void 0 : Zt.querySelector) == null ? void 0 : Ke.call(Zt, ":scope > .sheet-body"),
      B == null ? void 0 : B.parentElement
    ].find((xe) => xe instanceof HTMLElement), ae = ((Ae = B == null ? void 0 : B.dataset) == null ? void 0 : Ae.group) ?? ((Yn = (en = (Oi = B == null ? void 0 : B.querySelector) == null ? void 0 : Oi.call(B, "a[data-group]")) == null ? void 0 : en.dataset) == null ? void 0 : Yn.group) ?? ((R = (tn = (st = B == null ? void 0 : B.querySelector) == null ? void 0 : st.call(B, "[data-group]")) == null ? void 0 : tn.dataset) == null ? void 0 : R.group) ?? ((bt = (X = (oa = J == null ? void 0 : J.querySelector) == null ? void 0 : oa.call(J, ".tab[data-group]")) == null ? void 0 : X.dataset) == null ? void 0 : bt.group) ?? "main";
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
      const xe = B.querySelector("a[data-tab]");
      (Ne = xe == null ? void 0 : xe.classList) != null && Ne.contains("item") && Q.classList.add("item"), B.appendChild(Q), typeof s == "function" && s({ app: _, button: Q, nav: B, scene: q }), g("Created tab button", { tabId: e, group: ae });
    }
    O(Q, S({ app: _, scene: q }) ?? e, Ta(_));
    let ne = J.querySelector(`.tab[data-tab="${e}"]`);
    if (!ne) {
      ne = document.createElement("div"), ne.classList.add("tab"), ne.dataset.tab = e, ne.dataset.group = ae;
      const xe = Cd(J);
      J.insertBefore(ne, xe ?? null), typeof l == "function" && l({ app: _, tab: ne, body: J, scene: q }), g("Created tab container", { tabId: e, group: ae });
    }
    ((rr = Q.classList) == null ? void 0 : rr.contains("active")) || ne.classList.contains("active") ? (Q.classList.add("active"), ne.classList.add("active"), ne.removeAttribute("hidden")) : (Q.classList.remove("active"), ne.classList.remove("active"), ne.setAttribute("hidden", "true"));
    const yt = /* @__PURE__ */ c(() => {
      var Jn, ar;
      ((Jn = Q.classList) != null && Jn.contains("active") || ne.classList.contains("active")) && ((ar = Q.classList) == null || ar.add("active"), ne.classList.add("active"), ne.removeAttribute("hidden"), ne.removeAttribute("aria-hidden"), ne.style.display === "none" && (ne.style.display = ""));
    }, "ensureTabVisible"), Pe = /* @__PURE__ */ c(() => {
      yt(), requestAnimationFrame(yt);
    }, "scheduleEnsureTabVisible");
    Q.dataset.eidolonEnsureSceneTabVisibility || (Q.addEventListener("click", () => {
      wd(_, e, ae), requestAnimationFrame(yt);
    }), Q.dataset.eidolonEnsureSceneTabVisibility = "true"), ps(_, w, g);
    const at = a({
      app: _,
      scene: q,
      tab: ne,
      tabButton: Q,
      ensureTabVisible: yt,
      scheduleEnsureTabVisible: Pe
    });
    typeof at == "function" && Vc(_, w, at), typeof u == "function" && u({
      app: _,
      scene: q,
      tab: ne,
      tabButton: Q,
      ensureTabVisible: yt,
      scheduleEnsureTabVisible: Pe
    }), (sa = _.setPosition) == null || sa.call(_, { height: "auto" });
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
    ps(_, w, g);
    const ae = a({
      app: _,
      scene: q,
      tab: j,
      tabButton: B,
      ensureTabVisible: V,
      scheduleEnsureTabVisible: J
    });
    typeof ae == "function" && Vc(_, w, ae), typeof u == "function" && u({
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
    ps(_, w, g);
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
c(Ed, "createSceneConfigTabFactory");
function Vc(n, e, t) {
  if (!n || typeof t != "function") return;
  const i = n == null ? void 0 : n[e];
  Array.isArray(i) || (n[e] = []), n[e].push(t);
}
c(Vc, "registerCleanup");
function ps(n, e, t) {
  if (!n) return;
  const i = n == null ? void 0 : n[e];
  if (Array.isArray(i))
    for (; i.length > 0; ) {
      const r = i.pop();
      if (typeof r == "function")
        try {
          r();
        } catch (a) {
          t("Cleanup failed", { message: (a == null ? void 0 : a.message) ?? String(a) });
        }
    }
}
c(ps, "invokeCleanup");
function Cd(n) {
  if (!(n instanceof HTMLElement)) return null;
  const e = [
    ":scope > footer.sheet-footer",
    ":scope > footer.form-footer",
    ":scope > .sheet-footer",
    ":scope > .form-footer",
    ":scope > footer"
  ];
  for (const t of e) {
    const i = n.querySelector(t);
    if (i instanceof HTMLElement) return i;
  }
  return null;
}
c(Cd, "findFooterElement");
const sh = Go(ll), lh = `modules/${T}/templates/time-trigger-scene-tab.html`, ch = Ed({
  tabId: "time-triggers",
  tabLabel: /* @__PURE__ */ c(() => E("EIDOLON.TimeTrigger.Tab", "Time Triggers"), "tabLabel"),
  getScene: Xt,
  isApplicable: mh,
  renderContent: /* @__PURE__ */ c(({ app: n, scene: e, tab: t }) => dh(n, t, e), "renderContent"),
  logger: {
    log: N,
    group: Xi,
    groupEnd: Dn
  }
});
function uh() {
  return N("Registering SceneConfig render hook"), ch.register();
}
c(uh, "registerSceneConfigHook");
function dh(n, e, t) {
  if (!(e instanceof HTMLElement)) return;
  const i = Je(t) ? t : Xt(n);
  za(n, e, i);
  const r = ac(() => {
    za(n, e, i);
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
c(dh, "renderTimeTriggerTab");
async function za(n, e, t) {
  var r, a;
  const i = t ?? Xt(n);
  Xi("renderTimeTriggersTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!Je(i)) {
      const j = E(
        "EIDOLON.TimeTrigger.Unavailable",
        "Time triggers are unavailable for this configuration sheet."
      );
      e.innerHTML = `<p class="notes">${j}</p>`, N("Scene lacks document for time triggers", { sceneId: (i == null ? void 0 : i.id) ?? null });
      return;
    }
    const o = `flags.${T}.${qa}`, s = `flags.${T}.${$s}`, l = `flags.${T}.${Fs}`, u = !!i.getFlag(T, qa), d = !!i.getFlag(T, $s), m = !!i.getFlag(T, Fs), f = Bi(i);
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
    ), w = E(
      "EIDOLON.TimeTrigger.HideWindowDescription",
      "Keep the floating time control window hidden while leaving time triggers active."
    ), b = E(
      "EIDOLON.TimeTrigger.ShowPlayerWindowLabel",
      "Share Floating Time Window with Players"
    ), v = E(
      "EIDOLON.TimeTrigger.ShowPlayerWindowDescription",
      "Let non-GM players see the floating time window (without time controls)."
    ), S = E(
      "EIDOLON.TimeTrigger.TriggerListLabel",
      "Scene Time Triggers"
    ), I = E(
      "EIDOLON.TimeTrigger.TriggerListEmpty",
      "No time triggers configured for this scene."
    ), A = E("EIDOLON.TimeTrigger.AddTrigger", "Add Trigger"), O = E("EIDOLON.TimeTrigger.EditTrigger", "Edit"), x = E("EIDOLON.TimeTrigger.DeleteTrigger", "Remove"), M = E("EIDOLON.TimeTrigger.TriggerNow", "Trigger Now"), D = E("EIDOLON.TimeTrigger.AtLabel", "At"), F = E("EIDOLON.TimeTrigger.DoLabel", "Do"), P = E("EIDOLON.TimeTrigger.MissingTime", "(No time set)"), _ = f.map((j, B) => {
      const ae = (j.time ? nh(j.time) : "") || j.time || "" || P, Q = Jm(j.action), ne = [
        `${D} ${ae}`,
        `${F} ${Q}`,
        ...Km(j)
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
      q = await H(lh, {
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
          showPlayerWindow: b,
          triggerList: S,
          empty: I,
          add: A
        },
        hints: {
          activate: p,
          hideWindow: w,
          showPlayerWindow: v
        },
        triggers: _,
        hasTriggers: _.length > 0
      });
    } catch (j) {
      console.error(`${T} | Failed to render time trigger scene tab template`, j), e.innerHTML = `<p class="notes">${I}</p>`;
      return;
    }
    e.innerHTML = q, fh(n, e, i);
  } finally {
    Dn();
  }
}
c(za, "renderTimeTriggersTabContent");
function fh(n, e, t) {
  const i = t ?? Xt(n);
  if (!Je(i)) return;
  const r = e.querySelector('[data-action="add-trigger"]');
  r && r.addEventListener("click", () => {
    N("Add trigger button clicked", { sceneId: i.id }), zc(n, { scene: i });
  }), e.querySelectorAll('[data-action="edit-trigger"]').forEach((a) => {
    a.addEventListener("click", () => {
      const o = Number(a.dataset.index);
      if (!Number.isInteger(o)) return;
      const l = Bi(i)[o];
      l && (N("Edit trigger button clicked", { sceneId: i.id, triggerId: l.id, index: o }), zc(n, { trigger: l, triggerIndex: o, scene: i }));
    });
  }), e.querySelectorAll('[data-action="delete-trigger"]').forEach((a) => {
    a.addEventListener("click", async () => {
      var u, d;
      const o = Number(a.dataset.index);
      if (!Number.isInteger(o)) return;
      const s = Bi(i), l = s[o];
      if (l) {
        s.splice(o, 1);
        try {
          N("Deleting trigger", {
            sceneId: i.id,
            index: o,
            triggerId: (l == null ? void 0 : l.id) ?? null
          }), await Qu(i, s), await za(n, e, i);
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
      const l = Bi(i)[o];
      if (l) {
        if (!((u = game.user) != null && u.isGM)) {
          (m = (d = ui.notifications) == null ? void 0 : d.warn) == null || m.call(
            d,
            E("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time.")
          );
          return;
        }
        try {
          N("Manually firing trigger", { sceneId: i.id, triggerId: l.id, index: o }), await Zu(i, l), (g = (f = ui.notifications) == null ? void 0 : f.info) == null || g.call(
            f,
            E(
              "EIDOLON.TimeTrigger.TriggerNowSuccess",
              "Triggered the selected time trigger."
            )
          );
        } catch (w) {
          console.error(`${T} | Failed to execute time trigger manually`, w), (y = (p = ui.notifications) == null ? void 0 : p.error) == null || y.call(
            p,
            E(
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
c(fh, "bindTimeTriggerTabEvents");
function zc(n, e = {}) {
  var o;
  const t = e.scene ?? null, i = t && Je(t) ? t : Xt(n);
  if (!Je(i)) {
    console.warn(`${T} | Unable to open trigger form because no scene document is available.`);
    return;
  }
  N("Opening trigger form", {
    sceneId: i.id,
    triggerId: ((o = e.trigger) == null ? void 0 : o.id) ?? null,
    index: Number.isInteger(e.triggerIndex) ? Number(e.triggerIndex) : null
  }), sh({
    scene: i,
    trigger: e.trigger ?? null,
    triggerIndex: e.triggerIndex ?? null,
    onSave: /* @__PURE__ */ c(() => {
      var l, u;
      const s = (u = (l = n.element) == null ? void 0 : l[0]) == null ? void 0 : u.querySelector('.tab[data-tab="time-triggers"]');
      s && za(n, s, i);
    }, "onSave")
  }).render({ force: !0 });
}
c(zc, "openTriggerForm");
function mh(n, e) {
  var a, o, s, l, u;
  if (!n) return !1;
  const t = ((o = (a = foundry == null ? void 0 : foundry.applications) == null ? void 0 : a.sheets) == null ? void 0 : o.SceneConfig) ?? (globalThis == null ? void 0 : globalThis.SceneConfig);
  if (t && n instanceof t) return !0;
  const i = (s = n == null ? void 0 : n.constructor) == null ? void 0 : s.name;
  if (typeof i == "string" && i.includes("SceneConfig")) return !0;
  if (e) {
    const d = globalThis == null ? void 0 : globalThis.Scene;
    if (d && e instanceof d || (e == null ? void 0 : e.documentName) === "Scene" || (e == null ? void 0 : e.documentName) === "scenes" || (e == null ? void 0 : e.collection) === "scenes") return !0;
  }
  const r = ((l = n == null ? void 0 : n.options) == null ? void 0 : l.baseApplication) ?? ((u = n == null ? void 0 : n.options) == null ? void 0 : u.id);
  return !!(typeof r == "string" && r.includes("SceneConfig"));
}
c(mh, "isRecognizedSceneConfig");
const da = new el(), Gc = new tl();
function hh() {
  N("Registering time trigger hooks"), Hooks.once("init", () => {
    Hm(), zm(), N("Time trigger settings registered during init");
  }), uh(), N("Scene config hook registered"), Gc.registerHooks(), N("Time automation hooks registered"), Hooks.once("ready", () => {
    Gm(), N("Ready hook fired"), da.onReady(), Gc.initialize();
  }), Hooks.on("canvasReady", (n) => {
    var e;
    N("canvasReady hook received", { scene: ((e = n == null ? void 0 : n.scene) == null ? void 0 : e.id) ?? null }), da.onCanvasReady(n);
  }), Hooks.on("updateScene", (n) => {
    N("updateScene hook received", { scene: (n == null ? void 0 : n.id) ?? null }), da.onUpdateScene(n);
  }), Hooks.on("updateWorldTime", (n, e) => {
    N("updateWorldTime hook received", { worldTime: n, diff: e }), da.onUpdateWorldTime(n, e);
  });
}
c(hh, "registerTimeTriggerHooks");
hh();
const Te = T, Sd = "criteria", sc = "state", gh = "criteriaVersion", ph = 1, Td = "enableCriteriaSurfaces";
let Wc = !1;
function yh() {
  var n;
  if (!Wc) {
    if (Wc = !0, !((n = game == null ? void 0 : game.settings) != null && n.register)) {
      console.warn(`${Te} | game.settings.register unavailable; scene criteria setting skipped.`);
      return;
    }
    game.settings.register(Te, Td, {
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
        bh();
      }, "onChange")
    });
  }
}
c(yh, "registerSceneCriteriaSettings");
function Wo() {
  var n;
  try {
    if ((n = game == null ? void 0 : game.settings) != null && n.get)
      return !!game.settings.get(Te, Td);
  } catch (e) {
    console.error(`${Te} | Failed to read criteria surfaces setting`, e);
  }
  return !0;
}
c(Wo, "getCriteriaSurfacesEnabled");
function bh() {
  var a, o, s, l, u;
  const n = E("EIDOLON.SceneCriteria.ReloadPromptTitle", "Reload Required"), e = `<p>${E(
    "EIDOLON.SceneCriteria.ReloadPromptBody",
    "Changes to criteria editor surfaces require a reload. Reload now?"
  )}</p>`, t = typeof ((a = foundry == null ? void 0 : foundry.utils) == null ? void 0 : a.debouncedReload) == "function", i = /* @__PURE__ */ c(() => {
    t ? foundry.utils.debouncedReload() : window.location.reload();
  }, "reload"), r = (s = (o = foundry == null ? void 0 : foundry.applications) == null ? void 0 : o.api) == null ? void 0 : s.DialogV2;
  if (typeof (r == null ? void 0 : r.confirm) == "function") {
    r.confirm({
      window: { title: n },
      content: e
    }).then((d) => {
      d && i();
    });
    return;
  }
  if (typeof (Dialog == null ? void 0 : Dialog.confirm) == "function") {
    Dialog.confirm({
      title: n,
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
c(bh, "promptReloadForCriteriaSurfaces");
const Ga = "Standard";
function pt(n) {
  var t;
  const e = (t = n == null ? void 0 : n.getFlag) == null ? void 0 : t.call(n, Te, Sd);
  return e ? Ld(e) : [];
}
c(pt, "getSceneCriteria");
async function Yo(n, e) {
  if (!(n != null && n.setFlag)) return;
  const t = Ld(e);
  await n.setFlag(Te, Sd, t), await n.setFlag(Te, gh, ph);
  const i = na(n, t);
  await n.setFlag(Te, sc, i);
}
c(Yo, "setSceneCriteria");
function na(n, e = null) {
  var r;
  const t = Array.isArray(e) ? e : pt(n), i = Jt(((r = n == null ? void 0 : n.getFlag) == null ? void 0 : r.call(n, Te, sc)) ?? {});
  return cc(i, t);
}
c(na, "getSceneCriteriaState");
async function vh(n, e, t = null) {
  if (!(n != null && n.setFlag)) return;
  const i = Array.isArray(t) ? t : pt(n), r = cc(e, i);
  await n.setFlag(Te, sc, r);
}
c(vh, "setSceneCriteriaState");
function lc(n = "") {
  const e = typeof n == "string" ? n.trim() : "", t = Id(dl(e || "criterion"), /* @__PURE__ */ new Set());
  return {
    id: Od(),
    key: t,
    label: e,
    values: [Ga],
    default: Ga,
    order: 0
  };
}
c(lc, "createSceneCriterion");
function Ld(n) {
  const e = Array.isArray(n) ? Jt(n) : [], t = [], i = /* @__PURE__ */ new Set();
  return e.forEach((r, a) => {
    const o = ul(r, a, i);
    o && (t.push(o), i.add(o.key));
  }), t;
}
c(Ld, "sanitizeCriteria$1");
function ul(n, e = 0, t = /* @__PURE__ */ new Set()) {
  if (!n || typeof n != "object") return null;
  const i = typeof n.id == "string" && n.id.trim() ? n.id.trim() : Od(), a = (typeof n.label == "string" ? n.label : typeof n.name == "string" ? n.name : "").trim(), o = typeof n.key == "string" && n.key.trim() ? dl(n.key) : dl(a || `criterion-${Number(e) + 1}`), s = Id(o, t), l = Eh(n.values);
  let u = typeof n.default == "string" ? n.default.trim() : "";
  u || (u = l[0] ?? Ga), l.includes(u) || l.unshift(u);
  const d = Number.isFinite(n.order) ? Number(n.order) : Number(e);
  return {
    id: i,
    key: s,
    label: a,
    values: l,
    default: u,
    order: d
  };
}
c(ul, "sanitizeCriterion");
function cc(n, e = []) {
  const t = n && typeof n == "object" ? Jt(n) : {}, i = {};
  for (const r of e) {
    const a = t == null ? void 0 : t[r.key], o = typeof a == "string" ? a.trim() : "";
    o && r.values.includes(o) ? i[r.key] = o : i[r.key] = r.default;
  }
  return i;
}
c(cc, "sanitizeSceneCriteriaState");
function wh(n) {
  return pt(n).map((t) => ({
    id: t.key,
    key: t.key,
    name: t.label,
    values: [...t.values]
  }));
}
c(wh, "getSceneCriteriaCategories");
function Eh(n) {
  const e = Array.isArray(n) ? n : [], t = [];
  for (const i of e) {
    if (typeof i != "string") continue;
    const r = i.trim();
    !r || t.includes(r) || t.push(r);
  }
  return t.length || t.push(Ga), t;
}
c(Eh, "sanitizeCriterionValues");
function dl(n) {
  return String(n ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
c(dl, "slugifyCriterionKey");
function Id(n, e) {
  if (!e.has(n)) return n;
  let t = 2;
  for (; e.has(`${n}-${t}`); )
    t += 1;
  return `${n}-${t}`;
}
c(Id, "ensureUniqueCriterionKey");
function Od() {
  var n;
  return (n = foundry == null ? void 0 : foundry.utils) != null && n.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 11);
}
c(Od, "generateCriterionId");
function Ad(n) {
  var e, t;
  console.error(`${Te} | Failed to persist scene criteria`, n), (t = (e = ui.notifications) == null ? void 0 : e.error) == null || t.call(
    e,
    E(
      "EIDOLON.SceneCriteria.PersistError",
      "Failed to persist the scene criteria."
    )
  );
}
c(Ad, "notifyPersistError");
var qu, ge, un, De, kd, Do, Po, Ro, Ho, La, qo, Rr, Hr, mr, Md;
const on = class on extends Wn(Gn) {
  constructor(t = {}) {
    const { scene: i, criterion: r, isNew: a, onSave: o, ...s } = t ?? {};
    super(s);
    k(this, De);
    k(this, ge, null);
    k(this, un, !1);
    k(this, Do, /* @__PURE__ */ c(async (t) => {
      t.preventDefault();
      const i = t.currentTarget;
      if (!(i instanceof HTMLFormElement)) return;
      const r = new FormData(i), a = String(r.get("criterionLabel") ?? "").trim(), o = String(r.get("criterionKey") ?? "").trim(), s = Array.from(i.querySelectorAll('[name="criterionValues"]')).map((m) => m instanceof HTMLInputElement ? m.value.trim() : "").filter((m, f, g) => m && g.indexOf(m) === f), u = String(r.get("criterionDefault") ?? "").trim() || s[0] || "Standard", d = ul(
        {
          id: h(this, ge).id,
          key: o,
          label: a,
          values: s,
          default: u,
          order: Number(h(this, ge).order ?? 0)
        },
        0,
        /* @__PURE__ */ new Set()
      );
      d && (L(this, ge, d), await C(this, De, Md).call(this), this.close());
    }, "#onSubmit"));
    k(this, Po, /* @__PURE__ */ c((t) => {
      var o;
      if (h(this, un)) return;
      const i = t.currentTarget, r = (i == null ? void 0 : i.form) ?? ((o = this.element) == null ? void 0 : o.querySelector("form"));
      if (!(r instanceof HTMLFormElement)) return;
      const a = r.querySelector('input[name="criterionKey"]');
      a instanceof HTMLInputElement && (a.value = lr(i.value));
    }, "#onLabelInput"));
    k(this, Ro, /* @__PURE__ */ c((t) => {
      var l;
      const i = t.currentTarget, r = (i == null ? void 0 : i.form) ?? ((l = this.element) == null ? void 0 : l.querySelector("form"));
      if (!(r instanceof HTMLFormElement) || !(i instanceof HTMLInputElement)) return;
      const a = r.querySelector('input[name="criterionLabel"]'), o = lr(a instanceof HTMLInputElement ? a.value : ""), s = lr(i.value);
      L(this, un, s !== o), i.value = s, C(this, De, La).call(this, r);
    }, "#onKeyInput"));
    k(this, Ho, /* @__PURE__ */ c((t) => {
      var o, s;
      t.preventDefault();
      const i = ((o = t.currentTarget) == null ? void 0 : o.form) ?? ((s = this.element) == null ? void 0 : s.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector('input[name="criterionLabel"]'), a = i.querySelector('input[name="criterionKey"]');
      a instanceof HTMLInputElement && (a.value = lr(r instanceof HTMLInputElement ? r.value : ""), L(this, un, !1), C(this, De, La).call(this, i));
    }, "#onResetAutoKey"));
    k(this, qo, /* @__PURE__ */ c((t) => {
      var l, u, d, m, f, g;
      t.preventDefault();
      const i = ((l = t.currentTarget) == null ? void 0 : l.form) ?? ((u = this.element) == null ? void 0 : u.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector(".scene-criterion-editor__values");
      if (!(r instanceof HTMLElement)) return;
      (d = r.querySelector(".scene-criterion-editor__empty")) == null || d.remove();
      const a = document.createElement("div");
      a.classList.add("scene-criterion-editor__value");
      const o = $t(E("EIDOLON.SceneCriteria.ValuePlaceholder", "Allowed value")), s = $t(E("EIDOLON.SceneCriteria.RemoveValue", "Remove Value"));
      a.innerHTML = `
      <input type="text" name="criterionValues" value="" placeholder="${o}" class="form-control">
      <button type="button" class="icon" data-action="remove-value" aria-label="${s}" title="${s}">
        <i class="fa-solid fa-trash"></i>
      </button>
    `, r.appendChild(a), (m = a.querySelector('[data-action="remove-value"]')) == null || m.addEventListener("click", h(this, Rr)), (f = a.querySelector('input[name="criterionValues"]')) == null || f.addEventListener("input", h(this, Hr)), C(this, De, mr).call(this, i), (g = a.querySelector('input[name="criterionValues"]')) == null || g.focus();
    }, "#onAddValue"));
    k(this, Rr, /* @__PURE__ */ c((t) => {
      var a, o, s, l;
      t.preventDefault(), (o = (a = t.currentTarget) == null ? void 0 : a.closest(".scene-criterion-editor__value")) == null || o.remove();
      const i = ((s = t.currentTarget) == null ? void 0 : s.form) ?? ((l = this.element) == null ? void 0 : l.querySelector("form"));
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
        C(this, De, mr).call(this, i);
      }
    }, "#onRemoveValue"));
    k(this, Hr, /* @__PURE__ */ c((t) => {
      var r, a;
      const i = ((r = t.currentTarget) == null ? void 0 : r.form) ?? ((a = this.element) == null ? void 0 : a.querySelector("form"));
      i instanceof HTMLFormElement && C(this, De, mr).call(this, i);
    }, "#onValuesChanged"));
    this.scene = i ?? null, this.criterion = r ?? null, this.onSave = typeof o == "function" ? o : null, this.isNew = !!a, L(this, ge, C(this, De, kd).call(this)), L(this, un, h(this, ge).key !== lr(h(this, ge).label));
  }
  async _prepareContext() {
    var i, r, a, o;
    const t = Array.isArray((i = h(this, ge)) == null ? void 0 : i.values) ? h(this, ge).values : [];
    return {
      isNew: this.isNew,
      key: ((r = h(this, ge)) == null ? void 0 : r.key) ?? "",
      label: ((a = h(this, ge)) == null ? void 0 : a.label) ?? "",
      defaultValue: ((o = h(this, ge)) == null ? void 0 : o.default) ?? "",
      values: t.map((s, l) => {
        var u;
        return {
          index: l,
          value: s,
          selected: s === ((u = h(this, ge)) == null ? void 0 : u.default)
        };
      }),
      hasValues: t.length > 0,
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
      keyIsCustom: h(this, un)
    };
  }
  _onRender(t, i) {
    var a, o, s, l, u, d;
    super._onRender(t, i);
    const r = (a = this.element) == null ? void 0 : a.querySelector("form");
    r && (r.addEventListener("submit", h(this, Do)), (o = r.querySelector('[data-action="add-value"]')) == null || o.addEventListener("click", h(this, qo)), (s = r.querySelector('input[name="criterionLabel"]')) == null || s.addEventListener("input", h(this, Po)), (l = r.querySelector('input[name="criterionKey"]')) == null || l.addEventListener("input", h(this, Ro)), (u = r.querySelector('[data-action="reset-auto-key"]')) == null || u.addEventListener("click", h(this, Ho)), r.querySelectorAll('[data-action="remove-value"]').forEach((m) => {
      m.addEventListener("click", h(this, Rr));
    }), r.querySelectorAll('input[name="criterionValues"]').forEach((m) => {
      m.addEventListener("input", h(this, Hr));
    }), (d = r.querySelector('[data-action="cancel"]')) == null || d.addEventListener("click", (m) => {
      m.preventDefault(), this.close();
    }), C(this, De, La).call(this, r), C(this, De, mr).call(this, r));
  }
};
ge = new WeakMap(), un = new WeakMap(), De = new WeakSet(), kd = /* @__PURE__ */ c(function() {
  const t = ul(this.criterion, 0, /* @__PURE__ */ new Set()) ?? lc(E("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion"));
  return {
    id: t.id,
    key: t.key,
    label: t.label ?? "",
    values: Array.isArray(t.values) ? [...t.values] : [],
    default: t.default
  };
}, "#initializeState"), Do = new WeakMap(), Po = new WeakMap(), Ro = new WeakMap(), Ho = new WeakMap(), La = /* @__PURE__ */ c(function(t) {
  const i = t.querySelector('[data-action="reset-auto-key"]');
  i instanceof HTMLButtonElement && (i.disabled = !h(this, un));
}, "#syncAutoKeyButton"), qo = new WeakMap(), Rr = new WeakMap(), Hr = new WeakMap(), mr = /* @__PURE__ */ c(function(t) {
  var l, u;
  const i = t.querySelector('select[name="criterionDefault"]');
  if (!(i instanceof HTMLSelectElement)) return;
  const r = ((u = (l = i.value) == null ? void 0 : l.trim) == null ? void 0 : u.call(l)) ?? "", a = Array.from(t.querySelectorAll('input[name="criterionValues"]')).map((d) => d instanceof HTMLInputElement ? d.value.trim() : "").filter((d, m, f) => d && f.indexOf(d) === m), o = i.dataset.emptyLabel || E("EIDOLON.SceneCriteria.ValueListEmpty", "No values have been added to this criterion.");
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
}, "#syncDefaultOptions"), Md = /* @__PURE__ */ c(async function() {
  if (!this.scene) return;
  const t = pt(this.scene).sort((r, a) => r.order - a.order), i = t.findIndex((r) => r.id === h(this, ge).id);
  i < 0 ? (h(this, ge).order = t.length, t.push(h(this, ge))) : (h(this, ge).order = t[i].order, t.splice(i, 1, h(this, ge)));
  try {
    await Yo(this.scene, t), this.onSave && await this.onSave(h(this, ge));
  } catch (r) {
    Ad(r);
  }
}, "#persist"), c(on, "CategoryEditorApplication"), ye(on, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Re(on, on, "DEFAULT_OPTIONS"),
  {
    id: `${Te}-criterion-editor`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((qu = Re(on, on, "DEFAULT_OPTIONS")) == null ? void 0 : qu.classes) ?? [], "standard-form", "themed"])
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
)), ye(on, "PARTS", {
  content: {
    template: `modules/${Te}/templates/scene-criteria-editor.html`
  }
});
let fl = on;
function lr(n) {
  return String(n ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
c(lr, "slugifyKey");
const Ch = `modules/${Te}/templates/scene-criteria-tab.html`, ml = {
  log: /* @__PURE__ */ c((...n) => {
    var e;
    return (e = console.debug) == null ? void 0 : e.call(console, `${Te} | Criteria`, ...n);
  }, "log"),
  group: /* @__PURE__ */ c((...n) => {
    var e;
    return (e = console.groupCollapsed) == null ? void 0 : e.call(console, `${Te} | Criteria`, ...n);
  }, "group"),
  groupEnd: /* @__PURE__ */ c(() => {
    var n;
    return (n = console.groupEnd) == null ? void 0 : n.call(console);
  }, "groupEnd")
}, Sh = Go(fl), Th = Ed({
  tabId: "criteria",
  tabLabel: /* @__PURE__ */ c(() => E("EIDOLON.SceneCriteria.TabLabel", "Criteria"), "tabLabel"),
  getScene: Xt,
  isApplicable: /* @__PURE__ */ c(() => Wo(), "isApplicable"),
  renderContent: /* @__PURE__ */ c(({ app: n, tab: e, scene: t }) => Ih(n, e, t), "renderContent"),
  logger: ml
});
function Lh() {
  return Th.register();
}
c(Lh, "registerSceneCriteriaConfigHook");
function Ih(n, e, t) {
  if (!(e instanceof HTMLElement)) return;
  const i = Je(t) ? t : Xt(n);
  Ni(n, e, i);
}
c(Ih, "renderCriteriaTab");
async function Ni(n, e, t) {
  var r, a;
  const i = t ?? Xt(n);
  ml.group("renderCriteriaTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!Je(i)) {
      const d = E(
        "EIDOLON.SceneCriteria.Unavailable",
        "Scene criteria are unavailable for this configuration sheet."
      );
      e.innerHTML = `<p class="notes">${d}</p>`;
      return;
    }
    const o = pt(i).sort((d, m) => d.order - m.order), s = na(i, o), l = ((a = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : a.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof l != "function") {
      e.innerHTML = `<p class="notes">${E("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
      return;
    }
    const u = await l(Ch, {
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
          valueCountLabel: Ah(d.values.length),
          canMoveUp: m > 0,
          canMoveDown: m < o.length - 1
        };
      }),
      hasCriteria: o.length > 0
    });
    e.innerHTML = u, Oh(n, e, i);
  } catch (o) {
    console.error(`${Te} | Failed to render criteria tab`, o), e.innerHTML = `<p class="notes">${E("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
  } finally {
    ml.groupEnd();
  }
}
c(Ni, "renderCriteriaTabContent");
function Oh(n, e, t) {
  const i = t ?? Xt(n);
  if (!Je(i)) return;
  const r = e.querySelector('[data-criteria-action="add"]');
  r && r.addEventListener("click", () => {
    Yc(n, {
      scene: i,
      criterion: lc(
        E("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion")
      ),
      isNew: !0,
      onSave: /* @__PURE__ */ c(() => Ni(n, e, i), "onSave")
    });
  }), e.querySelectorAll('[data-criteria-action="edit"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", () => {
      const s = pt(i).find((l) => l.id === o);
      s && Yc(n, {
        scene: i,
        criterion: s,
        onSave: /* @__PURE__ */ c(() => Ni(n, e, i), "onSave")
      });
    });
  }), e.querySelectorAll('[data-criteria-action="remove"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await ys(i, (l) => {
        const u = l.findIndex((d) => d.id === o);
        return u < 0 ? !1 : (l.splice(u, 1), bs(l), !0);
      }) && await Ni(n, e, i);
    });
  }), e.querySelectorAll('[data-criteria-action="move-up"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await ys(i, (l) => {
        const u = l.findIndex((m) => m.id === o);
        if (u <= 0) return !1;
        const [d] = l.splice(u, 1);
        return l.splice(u - 1, 0, d), bs(l), !0;
      }) && await Ni(n, e, i);
    });
  }), e.querySelectorAll('[data-criteria-action="move-down"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await ys(i, (l) => {
        const u = l.findIndex((m) => m.id === o);
        if (u < 0 || u >= l.length - 1) return !1;
        const [d] = l.splice(u, 1);
        return l.splice(u + 1, 0, d), bs(l), !0;
      }) && await Ni(n, e, i);
    });
  });
}
c(Oh, "bindCriteriaTabEvents");
async function ys(n, e) {
  const t = pt(n).sort((r, a) => r.order - a.order);
  if (e(t) === !1) return !1;
  try {
    return await Yo(n, t), !0;
  } catch (r) {
    return Ad(r), !1;
  }
}
c(ys, "mutateCriteria");
function Yc(n, e = {}) {
  const t = e.scene ?? null, i = t && Je(t) ? t : Xt(n);
  if (!Je(i))
    return;
  Sh({
    scene: i,
    criterion: e.criterion ?? null,
    isNew: !!e.isNew,
    onSave: typeof e.onSave == "function" ? e.onSave : null
  }).render({ force: !0 });
}
c(Yc, "openCriterionEditor");
function bs(n) {
  n.forEach((e, t) => {
    e.order = t;
  });
}
c(bs, "reindexCriteriaOrder");
function Ah(n) {
  var e, t;
  if ((t = (e = game.i18n) == null ? void 0 : e.has) != null && t.call(e, "EIDOLON.SceneCriteria.ValueCountLabel"))
    try {
      return game.i18n.format("EIDOLON.SceneCriteria.ValueCountLabel", { count: n });
    } catch (i) {
      console.error(`${Te} | Failed to format value count label`, i);
    }
  return n === 0 ? "No values configured" : n === 1 ? "1 value" : `${n} values`;
}
c(Ah, "formatValueCount");
let Jc = !1;
function kh() {
  Hooks.once("init", () => {
    yh();
  }), Hooks.once("ready", () => {
    Wo() && (Jc || (Lh(), Jc = !0));
  });
}
c(kh, "registerSceneCriteriaHooks");
kh();
const te = T, _d = "criteriaEngineVersion", yi = "fileIndex", bi = "tileCriteria", uc = {
  LEGACY: 1,
  CRITERIA: 2
}, Nd = uc.CRITERIA;
function xd(n) {
  var e;
  return ((e = n == null ? void 0 : n.getFlag) == null ? void 0 : e.call(n, te, _d)) ?? uc.LEGACY;
}
c(xd, "getSceneEngineVersion");
function Mh(n, e, t, i, r) {
  if (!(n != null && n.length) || !(t != null && t.length)) return -1;
  const a = {};
  for (const s of t)
    a[s] = e[s];
  const o = Kc(n, a, t);
  if (o >= 0) return o;
  if (i != null && i.length && r) {
    const s = { ...a };
    for (const l of i) {
      if (!(l in s)) continue;
      s[l] = r[l] ?? "Standard";
      const u = Kc(n, s, t);
      if (u >= 0) return u;
    }
  }
  return -1;
}
c(Mh, "findBestMatch");
function Kc(n, e, t) {
  return n.findIndex((i) => {
    for (const r of t)
      if (i[r] !== e[r]) return !1;
    return !0;
  });
}
c(Kc, "findExactMatch");
function _h(n, e) {
  if (!(n != null && n.length)) return -1;
  let t = -1, i = -1;
  for (let r = 0; r < n.length; r += 1) {
    const a = n[r] ?? {}, o = Object.keys(a);
    if (o.length === 0) {
      i < 0 && (t = r, i = 0);
      continue;
    }
    let s = !0;
    for (const l of o)
      if (a[l] !== e[l]) {
        s = !1;
        break;
      }
    s && o.length > i && (t = r, i = o.length);
  }
  return t;
}
c(_h, "findFileIndex");
function Ia(n) {
  return n && typeof n == "object" && !Array.isArray(n);
}
c(Ia, "isPlainObject$2");
function Xc(n) {
  return n == null ? n : typeof structuredClone == "function" ? structuredClone(n) : JSON.parse(JSON.stringify(n));
}
c(Xc, "deepClone");
function Nh(n, e) {
  if (!e) return;
  const t = e.split(".").filter(Boolean);
  if (!t.length) return;
  let i = n;
  for (let r = 0; r < t.length - 1; r += 1) {
    if (!Ia(i == null ? void 0 : i[t[r]])) return;
    i = i[t[r]];
  }
  delete i[t.at(-1)];
}
c(Nh, "deletePath");
function $d(n, e) {
  const t = Xc(n ?? {});
  if (!Ia(e)) return t;
  for (const [i, r] of Object.entries(e)) {
    if (i.startsWith("-=") && r === !0) {
      Nh(t, i.slice(2));
      continue;
    }
    Ia(r) && Ia(t[i]) ? t[i] = $d(t[i], r) : t[i] = Xc(r);
  }
  return t;
}
c($d, "fallbackMerge");
function xh(n, e) {
  var t, i;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.mergeObject && ((i = foundry == null ? void 0 : foundry.utils) != null && i.deepClone) ? foundry.utils.mergeObject(n, foundry.utils.deepClone(e), {
    inplace: !1
  }) : $d(n, e);
}
c(xh, "defaultMerge");
function $h(n, e) {
  if (!n) return !0;
  for (const t of Object.keys(n))
    if (n[t] !== e[t]) return !1;
  return !0;
}
c($h, "criteriaMatch");
function Fd(n, e, t, i) {
  const r = i ?? xh;
  let a = r({}, n ?? {});
  if (!(e != null && e.length)) return a;
  const o = [];
  for (let s = 0; s < e.length; s += 1) {
    const l = e[s];
    if ($h(l == null ? void 0 : l.criteria, t)) {
      const u = l != null && l.criteria ? Object.keys(l.criteria).length : 0;
      o.push({ specificity: u, index: s, delta: l == null ? void 0 : l.delta });
    }
  }
  o.sort((s, l) => s.specificity - l.specificity || s.index - l.index);
  for (const s of o)
    s.delta && (a = r(a, s.delta));
  return a;
}
c(Fd, "resolveRules");
function Jo(n = null) {
  var i;
  const e = (game == null ? void 0 : game.user) ?? null;
  if (!e) return !1;
  if (e.isGM) return !0;
  const t = n ?? ((i = game == null ? void 0 : game.scenes) == null ? void 0 : i.viewed) ?? null;
  if (!t) return !1;
  if (typeof t.canUserModify == "function")
    try {
      return !!t.canUserModify(e, "update");
    } catch {
    }
  if (typeof t.testUserPermission == "function")
    try {
      return !!t.testUserPermission(e, "OWNER");
    } catch {
    }
  return !!t.isOwner;
}
c(Jo, "canManageCriteria");
function Fh(n = null) {
  if (!Jo(n))
    throw new Error(`${te} | You do not have permission to manage scene criteria.`);
}
c(Fh, "requireCriteriaAccess");
const Qc = 200;
function Dd(n) {
  return n ? Number.isInteger(n.size) ? n.size : Array.isArray(n) || typeof n.length == "number" ? n.length : Array.from(n).length : 0;
}
c(Dd, "getCollectionSize");
function Nt() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
c(Nt, "nowMs");
function Pd(n) {
  if (!Array.isArray(n)) return [];
  const e = /* @__PURE__ */ new Set();
  for (const t of n) {
    if (typeof t != "string") continue;
    const i = t.trim();
    i && e.add(i);
  }
  return Array.from(e);
}
c(Pd, "uniqueStringKeys");
function Dh(n, e = Qc) {
  if (!Array.isArray(n) || n.length === 0) return [];
  const t = Number.isInteger(e) && e > 0 ? e : Qc, i = [];
  for (let r = 0; r < n.length; r += t)
    i.push(n.slice(r, r + t));
  return i;
}
c(Dh, "chunkArray");
function Di(n) {
  return !!n && typeof n == "object" && !Array.isArray(n);
}
c(Di, "isPlainObject$1");
function hl(n, e) {
  if (Object.is(n, e)) return !0;
  if (Array.isArray(n) || Array.isArray(e)) {
    if (!Array.isArray(n) || !Array.isArray(e) || n.length !== e.length) return !1;
    for (let t = 0; t < n.length; t += 1)
      if (!hl(n[t], e[t])) return !1;
    return !0;
  }
  if (Di(n) || Di(e)) {
    if (!Di(n) || !Di(e)) return !1;
    const t = Object.keys(e);
    for (const i of t)
      if (!hl(n[i], e[i])) return !1;
    return !0;
  }
  return !1;
}
c(hl, "areValuesEqual");
function Wa(n) {
  if (typeof n != "string") return "";
  const e = n.trim();
  if (!e) return "";
  const t = e.replace(/\\/g, "/");
  try {
    return decodeURIComponent(t);
  } catch {
    return t;
  }
}
c(Wa, "normalizeFilePath");
function Rd(n) {
  return typeof (n == null ? void 0 : n.name) == "string" ? n.name : typeof (n == null ? void 0 : n.src) == "string" ? n.src : "";
}
c(Rd, "getFilePath");
function dc(n) {
  if (!Array.isArray(n)) return [];
  const e = /* @__PURE__ */ new Map();
  return n.map((t, i) => {
    const r = Wa(Rd(t)), a = r || `__index:${i}`, o = e.get(a) ?? 0;
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
c(dc, "buildTileFileEntries");
function jn(n, e) {
  if (!Number.isInteger(e) || e < 0) return null;
  const i = dc(n).find((r) => r.index === e);
  return i ? { ...i.target } : { indexHint: e };
}
c(jn, "createTileTargetFromIndex");
function Ko(n) {
  if (!n || typeof n != "object") return null;
  const e = Wa(n.path), t = Number(n.indexHint ?? n.fileIndex), i = Number(n.occurrence), r = {};
  return e && (r.path = e, r.occurrence = Number.isInteger(i) && i >= 0 ? i : 0), Number.isInteger(t) && t >= 0 && (r.indexHint = t), !r.path && !Number.isInteger(r.indexHint) ? null : r;
}
c(Ko, "normalizeTileTarget");
function kr(n, e) {
  const t = Ko(n);
  if (!t) return -1;
  const i = dc(e);
  if (!i.length) return -1;
  if (t.path) {
    const r = i.filter((a) => a.path === t.path);
    if (r.length > 0) {
      const a = Number.isInteger(t.occurrence) ? t.occurrence : 0;
      if (r[a]) return r[a].index;
      if (Number.isInteger(t.indexHint)) {
        const o = r.find((s) => s.index === t.indexHint);
        if (o) return o.index;
      }
      return r[0].index;
    }
  }
  return Number.isInteger(t.indexHint) && t.indexHint < i.length ? t.indexHint : -1;
}
c(kr, "resolveTileTargetIndex");
function Bn(n) {
  if (!n || typeof n != "object" || Array.isArray(n)) return {};
  const e = {};
  for (const [t, i] of Object.entries(n))
    typeof t != "string" || !t || typeof i != "string" || !i.trim() || (e[t] = i.trim());
  return e;
}
c(Bn, "sanitizeCriteria");
function Ph(n) {
  return Object.entries(Bn(n)).sort(([t], [i]) => t.localeCompare(i)).map(([t, i]) => `${t}=${i}`).join("");
}
c(Ph, "serializeCriteria");
function Rh(n) {
  return Object.keys(Bn(n)).length;
}
c(Rh, "getCriteriaSpecificity");
function Hh(n, e) {
  const t = Bn(n), i = Bn(e);
  for (const [r, a] of Object.entries(t))
    if (r in i && i[r] !== a)
      return !1;
  return !0;
}
c(Hh, "areCriteriaCompatible");
function qh(n, e) {
  const t = kr(n, e);
  if (Number.isInteger(t) && t >= 0)
    return `index:${t}`;
  const i = Ko(n);
  if (!i) return "";
  if (i.path) {
    const r = Number.isInteger(i.occurrence) ? i.occurrence : 0;
    return `path:${i.path}#${r}`;
  }
  return Number.isInteger(i.indexHint) ? `hint:${i.indexHint}` : "";
}
c(qh, "getTargetIdentity");
function Hd(n, e = {}) {
  var s;
  const t = Array.isArray(e.files) ? e.files : [], i = Si(n, { files: t });
  if (!((s = i == null ? void 0 : i.variants) != null && s.length))
    return {
      errors: [],
      warnings: []
    };
  const r = i.variants.map((l, u) => ({
    index: u,
    criteria: Bn(l.criteria),
    specificity: Rh(l.criteria),
    criteriaSignature: Ph(l.criteria),
    targetIdentity: qh(l.target, t)
  })), a = [], o = [];
  for (let l = 0; l < r.length; l += 1) {
    const u = r[l];
    for (let d = l + 1; d < r.length; d += 1) {
      const m = r[d];
      if (u.specificity !== m.specificity || !Hh(u.criteria, m.criteria)) continue;
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
c(Hd, "detectTileCriteriaConflicts");
function jh(n, e) {
  if (!n || typeof n != "object") return null;
  let t = Ko(n.target);
  if (!t) {
    const i = Number(n.fileIndex);
    Number.isInteger(i) && i >= 0 && (t = jn(e, i));
  }
  return t ? {
    criteria: Bn(n.criteria),
    target: t
  } : null;
}
c(jh, "normalizeTileVariant");
function qd(n, e = {}) {
  if (!Array.isArray(n) || n.length === 0) return null;
  const t = Array.isArray(e.files) ? e.files : null, i = n.map((l, u) => ({
    criteria: Bn(l),
    target: jn(t, u)
  })).filter((l) => l.target);
  if (!i.length) return null;
  const r = i.find((l) => Object.keys(l.criteria).length === 0), a = (r == null ? void 0 : r.target) ?? i[0].target;
  let o = null;
  const s = Number(e.defaultFileIndex);
  return Number.isInteger(s) && s >= 0 && (o = jn(t, s)), o || (o = a), {
    strategy: "select-one",
    variants: i,
    defaultTarget: o
  };
}
c(qd, "buildTileCriteriaFromFileIndex");
function Si(n, e = {}) {
  const t = Array.isArray(e.files) ? e.files : null;
  if (Array.isArray(n))
    return qd(n, { files: t });
  if (!n || typeof n != "object") return null;
  const i = Array.isArray(n.variants) ? n.variants.map((a) => jh(a, t)).filter(Boolean) : [];
  if (!i.length) return null;
  let r = Ko(n.defaultTarget);
  if (!r) {
    const a = Number(n.defaultFileIndex);
    Number.isInteger(a) && a >= 0 && (r = jn(t, a));
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
c(Si, "normalizeTileCriteria");
let Ya = /* @__PURE__ */ new WeakMap();
function Bh(n, e) {
  const t = Si(n, { files: e });
  if (!t) return null;
  const i = t.variants.map((a) => {
    const o = Bn(a.criteria), s = kr(a.target, e);
    return !Number.isInteger(s) || s < 0 ? null : {
      criteria: o,
      keys: Object.keys(o),
      targetIndex: s
    };
  }).filter(Boolean), r = kr(t.defaultTarget, e);
  return !i.length && (!Number.isInteger(r) || r < 0) ? null : {
    variants: i,
    defaultIndex: r
  };
}
c(Bh, "compileTileMatcher");
function Uh(n, e, t) {
  const i = Ya.get(n);
  if (i && i.tileCriteria === e && i.files === t)
    return i.compiled;
  const r = Bh(e, t);
  return Ya.set(n, {
    tileCriteria: e,
    files: t,
    compiled: r
  }), r;
}
c(Uh, "getCompiledTileMatcher");
function Vh(n, e) {
  if (!n) return -1;
  let t = -1, i = -1;
  for (const r of n.variants) {
    const a = r.keys;
    let o = !0;
    for (const s of a)
      if (r.criteria[s] !== (e == null ? void 0 : e[s])) {
        o = !1;
        break;
      }
    o && a.length > i && (i = a.length, t = r.targetIndex);
  }
  return t >= 0 ? t : n.defaultIndex;
}
c(Vh, "selectTileFileIndexFromCompiled");
function Zc(n = null) {
  n ? Ya.delete(n) : Ya = /* @__PURE__ */ new WeakMap();
}
c(Zc, "invalidateTileMatcherCache");
function zh({ extractKeys: n, label: e = "doc" }) {
  let t = /* @__PURE__ */ new WeakMap();
  function i(s, l) {
    const u = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Set();
    for (const m of l) {
      const f = n(m);
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
    const u = t.get(s);
    if ((u == null ? void 0 : u.collection) === l) return u;
    const d = i(s, l);
    return t.set(s, d), d;
  }
  c(r, "get");
  function a(s, l, u) {
    const d = Pd(u), m = r(s, l);
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
    s ? t.delete(s) : t = /* @__PURE__ */ new WeakMap();
  }
  return c(o, "invalidate"), { getAffectedDocs: a, invalidate: o };
}
c(zh, "createDependencyIndexManager");
async function jd(n, e, t, i) {
  const r = Dh(t, i);
  for (const a of r)
    await n.updateEmbeddedDocuments(e, a), r.length > 1 && await Promise.resolve();
  return r.length;
}
c(jd, "updateDocumentsInChunks");
const Gh = /* @__PURE__ */ c((...n) => console.log(`${te} | criteria tiles:`, ...n), "log$1"), Bd = zh({
  label: "tile",
  extractKeys(n) {
    var r;
    const e = n.getFlag(te, bi) ?? n.getFlag(te, yi);
    if (!e) return null;
    const t = Si(e, { files: null });
    if (!((r = t == null ? void 0 : t.variants) != null && r.length)) return [];
    const i = [];
    for (const a of t.variants)
      for (const o of Object.keys(a.criteria ?? {}))
        o && i.push(o);
    return i;
  }
});
function Wh(n = null, e = null) {
  Bd.invalidate(n ?? void 0), e ? Zc(e) : n || Zc(null);
}
c(Wh, "invalidateTileCriteriaCaches");
async function Ud(n, e, t = {}) {
  var l, u, d, m;
  const i = Nt(), r = {
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
    return r.durationMs = Nt() - i, r;
  const a = e.getEmbeddedCollection("Tile") ?? [];
  r.total = Dd(a);
  const o = Bd.getAffectedDocs(e, a, t.changedKeys);
  if (r.scanned = o.length, !o.length)
    return r.skipped.unaffected = r.total, r.durationMs = Nt() - i, r;
  const s = [];
  for (const f of o) {
    const g = f.getFlag(te, bi) ?? f.getFlag(te, yi);
    if (!g) {
      r.skipped.noCriteria += 1;
      continue;
    }
    const p = f.getFlag("monks-active-tiles", "files");
    if (!(p != null && p.length)) {
      r.skipped.noFiles += 1;
      continue;
    }
    const y = Uh(f, g, p), w = Vh(y, n);
    if (!Number.isInteger(w) || w < 0 || w >= p.length) {
      console.warn(`${te} | Tile ${f.id} has no valid file match for state`, n), r.skipped.noMatch += 1;
      continue;
    }
    const b = w, S = Number(f.getFlag("monks-active-tiles", "fileindex")) !== b, I = p.some((F, P) => !!(F != null && F.selected) != (P === w)), A = Wa(((u = f.texture) == null ? void 0 : u.src) ?? ((m = (d = f._source) == null ? void 0 : d.texture) == null ? void 0 : m.src) ?? ""), O = Rd(p[w]), x = Wa(O), M = !!x && x !== A;
    if (!I && !S && !M) {
      r.skipped.unchanged += 1;
      continue;
    }
    const D = {
      _id: f._id
    };
    I && (D["flags.monks-active-tiles.files"] = p.map((F, P) => ({
      ...F,
      selected: P === w
    }))), S && (D["flags.monks-active-tiles.fileindex"] = b), M && (D.texture = { src: O }), s.push(D), Gh(`Tile ${f.id} -> ${O}`);
  }
  return s.length > 0 && (r.chunks = await jd(e, "Tile", s, t.chunkSize), r.updated = s.length), r.durationMs = Nt() - i, r;
}
c(Ud, "updateTiles");
const vi = T, Ui = "lightCriteria", fc = Object.freeze({
  base: null,
  mappings: [],
  current: null
});
function vs(n) {
  return n && typeof n == "object" && !Array.isArray(n);
}
c(vs, "isPlainObject");
function Vd(n, e) {
  if (!vs(e)) return {};
  const t = {};
  for (const [i, r] of Object.entries(e)) {
    const a = n == null ? void 0 : n[i];
    if (vs(r) && vs(a)) {
      const o = Vd(a, r);
      Object.keys(o).length > 0 && (t[i] = o);
    } else r !== a && (t[i] = Jt(r));
  }
  return t;
}
c(Vd, "computeDelta");
function zd(n) {
  var t;
  const e = ((t = n == null ? void 0 : n.getFlag) == null ? void 0 : t.call(n, vi, Ui)) ?? fc;
  return Mr(e);
}
c(zd, "getLightCriteriaState");
async function Gd(n, e) {
  const t = Mr(e);
  if (!(n != null && n.setFlag))
    return t;
  const i = t.base !== null, r = t.mappings.length > 0, a = t.current !== null;
  return !i && !r && !a ? (typeof n.unsetFlag == "function" ? await n.unsetFlag(vi, Ui) : await n.setFlag(vi, Ui, null), fc) : (await n.setFlag(vi, Ui, t), t);
}
c(Gd, "setLightCriteriaState");
async function ia(n, e) {
  if (typeof e != "function")
    throw new TypeError("updateLightCriteriaState requires an updater function.");
  const t = Jt(zd(n)), i = await e(t);
  return Gd(n, i);
}
c(ia, "updateLightCriteriaState");
async function eu(n, e) {
  const t = Ti(e);
  if (!t)
    throw new Error("Invalid light configuration payload.");
  return ia(n, (i) => ({
    ...i,
    base: t
  }));
}
c(eu, "storeBaseLighting");
async function tu(n, e, t, { label: i } = {}) {
  const r = ra(e);
  if (!r)
    throw new Error("Cannot create a mapping without at least one category selection.");
  const a = Ti(t);
  if (!a)
    throw new Error("Invalid light configuration payload.");
  return ia(n, (o) => {
    const s = nr(r), l = Array.isArray(o == null ? void 0 : o.mappings) ? [...o.mappings] : [], u = l.findIndex((g) => (g == null ? void 0 : g.key) === s), d = u >= 0 ? l[u] : null, m = typeof (d == null ? void 0 : d.id) == "string" && d.id.trim() ? d.id.trim() : Yd(), f = Xo({
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
c(tu, "upsertLightCriteriaMapping");
async function Yh(n, e, t, i, { replaceExisting: r = !1 } = {}) {
  const a = typeof e == "string" ? e.trim() : "";
  if (!a)
    throw new Error("A mapping id is required to retarget criteria.");
  const o = ra(t);
  if (!o)
    throw new Error("Cannot retarget mapping without at least one category selection.");
  const s = Ti(i);
  if (!s)
    throw new Error("Invalid light configuration payload.");
  return ia(n, (l) => {
    const u = Array.isArray(l == null ? void 0 : l.mappings) ? [...l.mappings] : [], d = u.findIndex((b) => (b == null ? void 0 : b.id) === a);
    if (d < 0)
      throw new Error("The selected mapping no longer exists.");
    const m = nr(o), f = u.findIndex(
      (b, v) => v !== d && (b == null ? void 0 : b.key) === m
    );
    if (f >= 0 && !r)
      throw new Error("A mapping already exists for the selected criteria.");
    const g = u[d], p = Xo({
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
c(Yh, "retargetLightCriteriaMapping");
async function Jh(n, e) {
  const t = typeof e == "string" ? e.trim() : "";
  if (!t)
    throw new Error("A mapping id is required to remove a mapping.");
  return ia(n, (i) => {
    const r = Array.isArray(i == null ? void 0 : i.mappings) ? [...i.mappings] : [], a = r.findIndex((s) => (s == null ? void 0 : s.id) === t);
    if (a < 0) return i;
    r.splice(a, 1);
    let o = (i == null ? void 0 : i.current) ?? null;
    return (o == null ? void 0 : o.mappingId) === t && (o = null), {
      ...i,
      mappings: r,
      current: o
    };
  });
}
c(Jh, "removeLightCriteriaMapping");
async function wr(n, e) {
  const t = Wd(e);
  return ia(n, (i) => ({
    ...i,
    current: t
  }));
}
c(wr, "storeCurrentCriteriaSelection");
function Kh(n) {
  const e = Mr(n), t = e.base ?? {}, i = [];
  for (const r of e.mappings) {
    const a = ra(r == null ? void 0 : r.categories);
    if (!a) continue;
    const o = Vd(t, (r == null ? void 0 : r.config) ?? {});
    Object.keys(o).length !== 0 && i.push({
      criteria: a,
      delta: o
    });
  }
  return {
    base: t,
    rules: i
  };
}
c(Kh, "convertLightCriteriaStateToPresets");
function Xh(n, e = []) {
  const t = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
  for (const l of e)
    typeof (l == null ? void 0 : l.key) == "string" && l.key.trim() && i.add(l.key.trim()), typeof (l == null ? void 0 : l.id) == "string" && l.id.trim() && typeof (l == null ? void 0 : l.key) == "string" && t.set(l.id.trim(), l.key.trim());
  const r = Mr(n), a = /* @__PURE__ */ c((l) => {
    const u = {};
    for (const [d, m] of Object.entries(l ?? {})) {
      const f = String(d ?? "").trim(), g = typeof m == "string" ? m.trim() : "";
      if (!f || !g) continue;
      if (i.has(f)) {
        u[f] = g;
        continue;
      }
      const p = t.get(f);
      p && (u[p] = g);
    }
    return Object.keys(u).length ? u : null;
  }, "remapCategories"), o = r.mappings.map((l) => {
    const u = a(l.categories);
    return u ? Xo({
      ...l,
      categories: u,
      key: nr(u)
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
  return Mr({
    ...r,
    mappings: o,
    current: s
  });
}
c(Xh, "migrateLightCriteriaCategoriesToKeys");
function Mr(n) {
  var l;
  const e = Jt(n);
  if (!e || typeof e != "object")
    return Jt(fc);
  const t = Ti(e.base), i = Array.isArray(e.mappings) ? e.mappings : [], r = /* @__PURE__ */ new Map();
  for (const u of i) {
    const d = Xo(u);
    d && r.set(d.key, d);
  }
  const a = Array.from(r.values()), o = new Map(a.map((u) => [u.id, u]));
  let s = Wd(e.current);
  if (s) {
    const u = s.categories && Object.keys(s.categories).length > 0;
    if (s.mappingId && !o.has(s.mappingId)) {
      const d = u ? ((l = a.find((m) => m.key === nr(s.categories))) == null ? void 0 : l.id) ?? null : null;
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
    base: t ?? null,
    mappings: a,
    current: s
  };
}
c(Mr, "sanitizeLightCriteriaState");
function Ti(n) {
  const e = Jt(n);
  if (!e || typeof e != "object") return null;
  "_id" in e && delete e._id, "id" in e && delete e.id;
  const t = e.flags;
  if (t && typeof t == "object") {
    const i = t[vi];
    i && typeof i == "object" && (delete i[Ui], Object.keys(i).length === 0 && delete t[vi]), Object.keys(t).length === 0 && delete e.flags;
  }
  return e;
}
c(Ti, "sanitizeLightConfigPayload");
function Xo(n) {
  if (!n || typeof n != "object") return null;
  const e = ra(n.categories);
  if (!e) return null;
  const t = Ti(n.config);
  if (!t) return null;
  const i = typeof n.id == "string" && n.id.trim() ? n.id.trim() : Yd(), r = nr(e), a = {
    id: i,
    key: r,
    categories: e,
    config: t,
    updatedAt: Number.isFinite(n.updatedAt) ? Number(n.updatedAt) : Date.now()
  };
  return typeof n.label == "string" && n.label.trim() && (a.label = n.label.trim()), a;
}
c(Xo, "sanitizeCriteriaMappingEntry");
function Wd(n) {
  if (!n || typeof n != "object") return null;
  const e = typeof n.mappingId == "string" && n.mappingId.trim() ? n.mappingId.trim() : null, t = ra(n.categories);
  return !e && !t ? null : {
    mappingId: e,
    categories: t,
    updatedAt: Number.isFinite(n.updatedAt) ? Number(n.updatedAt) : Date.now()
  };
}
c(Wd, "sanitizeCurrentSelection");
function ra(n) {
  const e = {};
  if (Array.isArray(n))
    for (const t of n) {
      const i = nu((t == null ? void 0 : t.id) ?? (t == null ? void 0 : t.categoryId) ?? (t == null ? void 0 : t.category)), r = iu((t == null ? void 0 : t.value) ?? (t == null ? void 0 : t.selection) ?? (t == null ? void 0 : t.label));
      !i || !r || (e[i] = r);
    }
  else if (n && typeof n == "object")
    for (const [t, i] of Object.entries(n)) {
      const r = nu(t), a = iu(i);
      !r || !a || (e[r] = a);
    }
  return Object.keys(e).length > 0 ? e : null;
}
c(ra, "sanitizeCriteriaCategories");
function nr(n) {
  if (!n || typeof n != "object") return "";
  const e = Object.entries(n).filter(([, t]) => typeof t == "string" && t).map(([t, i]) => `${t}:${i}`);
  return e.sort((t, i) => t < i ? -1 : t > i ? 1 : 0), e.join("|");
}
c(nr, "computeCriteriaMappingKey");
function Yd() {
  var n;
  return (n = foundry == null ? void 0 : foundry.utils) != null && n.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
c(Yd, "generateLightMappingId");
function nu(n) {
  if (typeof n != "string") return null;
  const e = n.trim();
  return e || null;
}
c(nu, "normalizeCategoryId");
function iu(n) {
  if (typeof n != "string") return null;
  const e = n.trim();
  return e || null;
}
c(iu, "normalizeCategoryValue");
const _r = [];
function Jd(n) {
  typeof n == "function" && (_r.includes(n) || _r.push(n));
}
c(Jd, "registerHiddenLightProvider");
function Qh(n) {
  const e = _r.indexOf(n);
  e >= 0 && _r.splice(e, 1);
}
c(Qh, "unregisterHiddenLightProvider");
function Zh() {
  const n = /* @__PURE__ */ new Set();
  for (const e of _r)
    try {
      const t = e();
      if (Array.isArray(t))
        for (const i of t)
          i && n.add(i);
    } catch (t) {
      console.warn("eidolon-utilities | Hidden light provider error:", t);
    }
  return n;
}
c(Zh, "getHiddenLightIds");
const mc = /* @__PURE__ */ new Map(), Nr = [];
function hr(n) {
  n != null && n.tag && mc.set(n.tag, { ...n });
}
c(hr, "registerTileConvention");
function eg(n) {
  mc.delete(n);
}
c(eg, "unregisterTileConvention");
function Kd() {
  return mc;
}
c(Kd, "getTileConventions");
function tg(n) {
  typeof n == "function" && (Nr.includes(n) || Nr.push(n));
}
c(tg, "registerIndexingHook");
function ng(n) {
  const e = Nr.indexOf(n);
  e >= 0 && Nr.splice(e, 1);
}
c(ng, "unregisterIndexingHook");
function ig() {
  return Nr;
}
c(ig, "getIndexingHooks");
const Ja = ["AmbientLight", "Wall", "AmbientSound"];
let Ka = /* @__PURE__ */ new WeakMap(), Xa = /* @__PURE__ */ new WeakMap();
function rg(n) {
  const e = /* @__PURE__ */ new Set();
  for (const t of (n == null ? void 0 : n.rules) ?? [])
    for (const i of Object.keys((t == null ? void 0 : t.criteria) ?? {}))
      i && e.add(i);
  return Array.from(e);
}
c(rg, "getPresetDependencyKeys");
function ag(n, e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of Ja) {
    const r = e.get(i) ?? [], a = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Map();
    for (const s of r) {
      const l = Qd(s, i);
      if (l != null && l.base) {
        a.add(s.id);
        for (const u of rg(l))
          o.has(u) || o.set(u, /* @__PURE__ */ new Set()), o.get(u).add(s.id);
      }
    }
    t.set(i, {
      allDocIds: a,
      keyToDocIds: o
    });
  }
  return {
    collectionsByType: e,
    byType: t
  };
}
c(ag, "buildPlaceableDependencyIndex");
function og(n, e) {
  const t = Xa.get(n);
  if (t && Ja.every((r) => t.collectionsByType.get(r) === e.get(r)))
    return t;
  const i = ag(n, e);
  return Xa.set(n, i), i;
}
c(og, "getPlaceableDependencyIndex");
function sg(n, e, t) {
  if (!e || !n) return [];
  const i = Pd(t);
  if (!i.length)
    return typeof n.get == "function" ? Array.from(e.allDocIds).map((a) => n.get(a)).filter(Boolean) : Array.from(n).filter((a) => e.allDocIds.has(a.id));
  const r = /* @__PURE__ */ new Set();
  for (const a of i) {
    const o = e.keyToDocIds.get(a);
    if (o)
      for (const s of o) r.add(s);
  }
  return r.size ? typeof n.get == "function" ? Array.from(r).map((a) => n.get(a)).filter(Boolean) : Array.from(n).filter((a) => r.has(a.id)) : [];
}
c(sg, "getDocsForChangedKeys");
function Xd(n, e) {
  const t = { _id: e._id };
  for (const [r, a] of Object.entries(e)) {
    if (r === "_id") continue;
    const o = n == null ? void 0 : n[r];
    if (Di(a) && Di(o)) {
      const s = Xd(o, { _id: e._id, ...a });
      if (!s) continue;
      const l = Object.keys(s).filter((u) => u !== "_id");
      if (l.length > 0) {
        t[r] = {};
        for (const u of l)
          t[r][u] = s[u];
      }
      continue;
    }
    hl(o, a) || (t[r] = a);
  }
  return Object.keys(t).filter((r) => r !== "_id").length > 0 ? t : null;
}
c(Xd, "buildChangedPayload");
function Qd(n, e) {
  var s;
  const t = ((s = n == null ? void 0 : n.flags) == null ? void 0 : s[te]) ?? {}, i = (t == null ? void 0 : t.presets) ?? null, r = e === "AmbientLight" ? (t == null ? void 0 : t.lightCriteria) ?? null : null, a = Ka.get(n);
  if (a && a.type === e && a.rawPresets === i && a.rawLightCriteria === r)
    return a.presets;
  let o = null;
  if (t != null && t.presets) {
    const l = t.presets.base ?? null, u = Array.isArray(t.presets.rules) ? t.presets.rules : [];
    (l && Object.keys(l).length > 0 || u.length > 0) && (o = {
      base: l ?? {},
      rules: u
    });
  }
  if (!o && e === "AmbientLight" && (t != null && t.lightCriteria)) {
    const l = Kh(t.lightCriteria);
    (l.base && Object.keys(l.base).length > 0 || l.rules.length > 0) && (o = {
      base: l.base,
      rules: l.rules
    });
  }
  return Ka.set(n, {
    type: e,
    rawPresets: i,
    rawLightCriteria: r,
    presets: o
  }), o;
}
c(Qd, "getPresetsForDocument");
function lg(n = null, e = null) {
  n ? Xa.delete(n) : Xa = /* @__PURE__ */ new WeakMap(), e ? Ka.delete(e) : n || (Ka = /* @__PURE__ */ new WeakMap());
}
c(lg, "invalidatePlaceableCriteriaCaches");
async function Zd(n, e, t = {}) {
  var l, u;
  const i = Nt(), r = {
    total: 0,
    scanned: 0,
    updated: 0,
    chunks: 0,
    byType: {},
    durationMs: 0
  };
  if (e = e ?? ((l = game.scenes) == null ? void 0 : l.viewed), !e)
    return r.durationMs = Nt() - i, r;
  const a = Zh(), o = new Map(
    Ja.map((d) => [d, e.getEmbeddedCollection(d) ?? []])
  ), s = og(e, o);
  for (const d of Ja) {
    const m = o.get(d) ?? [], f = {
      total: Dd(m),
      scanned: 0,
      updated: 0,
      chunks: 0
    }, g = s.byType.get(d) ?? null, p = sg(m, g, t.changedKeys);
    if (f.scanned = p.length, r.total += f.total, r.scanned += f.scanned, r.byType[d] = f, !p.length) continue;
    const y = [];
    for (const w of p) {
      const b = Qd(w, d);
      if (!(b != null && b.base)) continue;
      const v = Fd(b.base, b.rules ?? [], n);
      v._id = w._id, d === "AmbientLight" && a.has(w._id) && (v.hidden = !0);
      const S = (w == null ? void 0 : w._source) ?? ((u = w == null ? void 0 : w.toObject) == null ? void 0 : u.call(w)) ?? {}, I = Xd(S, v);
      I && y.push(I);
    }
    y.length > 0 && (f.chunks = await jd(e, d, y, t.chunkSize), f.updated = y.length, r.updated += y.length, r.chunks += f.chunks, console.log(`${te} | Updated ${y.length} ${d}(s)`));
  }
  return r.durationMs = Nt() - i, r;
}
c(Zd, "updatePlaceables");
const fa = /* @__PURE__ */ new Map();
function cg(n) {
  var e;
  return n = n ?? ((e = game.scenes) == null ? void 0 : e.viewed), n ? na(n) : null;
}
c(cg, "getState");
async function ug(n, e, t = 0) {
  var g;
  const i = Nt();
  if (e = e ?? ((g = game.scenes) == null ? void 0 : g.viewed), !e) return null;
  Fh(e);
  const r = pt(e);
  if (!r.length)
    return console.warn(`${te} | applyState skipped: scene has no criteria.`), null;
  const a = na(e, r), o = cc({ ...a, ...n ?? {} }, r), s = r.filter((p) => (a == null ? void 0 : a[p.key]) !== (o == null ? void 0 : o[p.key])).map((p) => p.key), l = s.length > 0;
  l && await vh(e, o, r);
  const u = l ? o : a, [d, m] = await Promise.all([
    Ud(u, e, { changedKeys: s }),
    Zd(u, e, { changedKeys: s })
  ]), f = Nt() - i;
  return N("Criteria apply telemetry", {
    sceneId: e.id,
    changedKeys: s,
    didChange: l,
    queuedMs: t,
    durationMs: f,
    tiles: d,
    placeables: m
  }), Hooks.callAll("eidolon-utilities.criteriaStateApplied", e, u), u;
}
c(ug, "applyStateInternal");
async function ef(n, e) {
  var l;
  if (e = e ?? ((l = game.scenes) == null ? void 0 : l.viewed), !e) return null;
  const t = e.id ?? "__viewed__", i = Nt(), r = fa.get(t) ?? Promise.resolve();
  let a = null;
  const o = r.catch(() => null).then(async () => {
    const u = Nt() - i;
    return ug(n, e, u);
  });
  a = o;
  const s = o.finally(() => {
    fa.get(t) === s && fa.delete(t);
  });
  return fa.set(t, s), a;
}
c(ef, "applyState$1");
function dg(n) {
  var e;
  return n = n ?? ((e = game.scenes) == null ? void 0 : e.viewed), n ? xd(n) : null;
}
c(dg, "getVersion");
async function tf(n, e) {
  var t;
  e = e ?? ((t = game.scenes) == null ? void 0 : t.viewed), e != null && e.setFlag && await e.setFlag(te, _d, Number(n));
}
c(tf, "setVersion");
async function fg(n) {
  return tf(Nd, n);
}
c(fg, "markCurrentVersion");
const gr = "Standard", mg = /* @__PURE__ */ c((...n) => console.log(`${te} | criteria indexer:`, ...n), "log");
function hg() {
  hr({
    tag: "Map",
    positionMap: { 0: "mood", 1: "variant", 2: "effect" },
    positionMap4: { 0: "mood", 1: "stage", 2: "variant", 3: "effect" },
    required: !0,
    maxCount: 1
  }), hr({ tag: "Floor", positionMap: "inherit" }), hr({ tag: "Roof", positionMap: "inherit" }), hr({
    tag: "Weather",
    positionMap: { 1: "effect" }
  });
}
c(hg, "registerDefaultConventions");
function hc(n) {
  if (typeof n != "string") return null;
  let e = n;
  try {
    e = decodeURIComponent(n);
  } catch {
  }
  const t = e.match(/\[([^\]]+)\]/);
  if (!t) return null;
  const i = t[1].split(",").map((r) => r.trim()).filter(Boolean);
  return i.length ? i : null;
}
c(hc, "parseFileTags");
function gg(n, e, t = gr) {
  return n != null && n.length ? n.map((i) => {
    const r = hc(i == null ? void 0 : i.name);
    if (!r) return {};
    const a = {};
    for (const [o, s] of Object.entries(e)) {
      const l = r[Number(o)];
      l != null && l !== t && (a[s] = l);
    }
    return a;
  }) : [];
}
c(gg, "buildFileIndex");
function pg(n, e) {
  return n.map((t, i) => {
    const r = [...e[t] ?? /* @__PURE__ */ new Set()].sort(), o = r.includes(gr) ? gr : r[0] ?? gr, s = lc(t);
    return s.key = t, s.label = t.charAt(0).toUpperCase() + t.slice(1), s.values = r.length ? r : [gr], s.default = s.values.includes(o) ? o : s.values[0], s.order = i, s;
  });
}
c(pg, "buildCriteriaDefinitions");
async function ru(n, e, t, { dryRun: i = !1 } = {}) {
  const r = n.getFlag("monks-active-tiles", "files");
  if (!(r != null && r.length)) return null;
  const a = gg(r, e), o = qd(a, { files: r });
  for (const s of r) {
    const l = hc(s == null ? void 0 : s.name);
    if (l)
      for (const [u, d] of Object.entries(e)) {
        const m = l[Number(u)];
        m != null && t[d] && t[d].add(m);
      }
  }
  return i || (await n.setFlag(te, bi, o), typeof n.unsetFlag == "function" && await n.unsetFlag(te, yi)), { files: r.length };
}
c(ru, "indexTile");
function au(n, e, t) {
  return n.positionMap === "inherit" ? t : e >= 4 && n.positionMap4 ? n.positionMap4 : n.positionMap;
}
c(au, "resolvePositionMap");
function yg(n, e) {
  return e >= 4 && n.positionMap4 ? n.positionMap4 : n.positionMap;
}
c(yg, "resolvePrimaryPositionMap");
function bg(n) {
  if (!Array.isArray(n)) return Kd();
  const e = /* @__PURE__ */ new Map();
  for (const t of n)
    t != null && t.tag && e.set(t.tag, { ...t });
  return e;
}
c(bg, "resolveConventions");
async function vg(n, e = {}) {
  var v, S, I, A, O, x;
  const {
    dryRun: t = !1,
    force: i = !1
  } = e;
  if (n = n ?? ((v = game.scenes) == null ? void 0 : v.viewed), !n) throw new Error("No scene provided to indexScene.");
  if (!globalThis.Tagger) throw new Error("Tagger is required to index scene criteria.");
  if (!i && xd(n) >= Nd)
    throw new Error(
      `Scene "${n.name}" is already criteria-indexed. Use force: true to re-index.`
    );
  const r = bg(e.conventions), a = { sceneId: n.id };
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
    const _ = hc((S = P[0]) == null ? void 0 : S.name);
    if (!(_ != null && _.length))
      throw new Error(`Cannot parse bracket tags from: ${((I = P[0]) == null ? void 0 : I.name) ?? "<unknown>"}`);
    if (_.length < 3)
      throw new Error(`Expected 3+ bracket tags, found ${_.length}.`);
    l = _.length;
    break;
  }
  if (!o)
    throw new Error("No required tile convention registered. Register conventions before indexing.");
  const u = yg(o, l), d = [], m = Object.keys(u).map(Number).sort((M, D) => M - D);
  for (const M of m) {
    const D = u[M];
    d.includes(D) || d.push(D);
  }
  const f = {};
  for (const M of d)
    f[M] = /* @__PURE__ */ new Set();
  for (const [, M] of r) {
    if (M.positionMap === "inherit") continue;
    const D = au(M, l, u);
    for (const F of Object.values(D))
      f[F] || (f[F] = /* @__PURE__ */ new Set(), d.includes(F) || d.push(F));
  }
  const g = {}, p = ig();
  for (const [M, D] of r) {
    const F = Tagger.getByTag(M, a) ?? [], P = au(D, l, u), _ = M.toLowerCase(), H = [];
    for (const q of F) {
      const j = await ru(q, P, f, { dryRun: t });
      j && H.push(j);
    }
    g[_] = D.maxCount === 1 ? H[0] ?? null : H;
  }
  if (p.length > 0) {
    const M = n.getEmbeddedCollection("Tile") ?? [], D = new Set(r.keys());
    for (const F of M) {
      if ((((O = (A = globalThis.Tagger) == null ? void 0 : A.getTags) == null ? void 0 : O.call(A, F)) ?? []).some((q) => D.has(q))) continue;
      const H = F.getFlag("monks-active-tiles", "files");
      if (H != null && H.length)
        for (const q of p)
          try {
            const j = q(n, F, H);
            if (j != null && j.positionMap) {
              await ru(F, j.positionMap, f, { dryRun: t });
              break;
            }
          } catch (j) {
            console.warn(`${te} | Indexing hook error:`, j);
          }
    }
  }
  const y = pg(d, f);
  t || (await Yo(n, y), await fg(n));
  const w = o.tag.toLowerCase();
  mg(
    t ? "Dry run complete" : "Indexing complete",
    `- ${y.length} criteria,`,
    `${((x = g[w]) == null ? void 0 : x.files) ?? 0} ${o.tag.toLowerCase()} files`
  );
  const b = Array.from(r.keys()).filter((M) => M !== o.tag).some((M) => {
    const D = g[M.toLowerCase()];
    return Array.isArray(D) ? D.length > 0 : !!D;
  });
  return {
    criteria: y,
    state: y.reduce((M, D) => (M[D.key] = D.default, M), {}),
    tiles: g,
    overlayMode: b
  };
}
c(vg, "indexScene");
var ju, qe, ft, mt, fi, Ze, Bt, Ln, jo, ce, nf, rf, af, pl, of, yl, sf, pr, bl;
const Et = class Et extends Wn(Gn) {
  constructor(t = {}) {
    var i;
    super(t);
    k(this, ce);
    k(this, qe, null);
    k(this, ft, []);
    k(this, mt, {});
    k(this, fi, !1);
    k(this, Ze, null);
    k(this, Bt, null);
    k(this, Ln, null);
    k(this, jo, 120);
    this.setScene(t.scene ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null);
  }
  setScene(t) {
    var i;
    L(this, qe, t ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null), C(this, ce, nf).call(this);
  }
  get scene() {
    return h(this, qe);
  }
  async _prepareContext() {
    var r;
    const t = !!h(this, qe), i = t && h(this, ft).length > 0;
    return {
      hasScene: t,
      hasCriteria: i,
      sceneName: ((r = h(this, qe)) == null ? void 0 : r.name) ?? E("EIDOLON.CriteriaSwitcher.NoScene", "No active scene"),
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
      criteria: h(this, ft).map((a) => ({
        key: a.key,
        label: a.label || a.key,
        values: a.values.map((o) => {
          var s;
          return {
            value: o,
            selected: ((s = h(this, mt)) == null ? void 0 : s[a.key]) === o
          };
        }),
        defaultValue: a.default
      })),
      stateSummary: C(this, ce, bl).call(this)
    };
  }
  _onRender(t, i) {
    super._onRender(t, i), C(this, ce, rf).call(this), C(this, ce, af).call(this);
  }
  async _onClose(t) {
    return h(this, Ze) !== null && (clearTimeout(h(this, Ze)), L(this, Ze, null)), h(this, Ln) !== null && (Hooks.off("eidolon-utilities.criteriaStateApplied", h(this, Ln)), L(this, Ln, null)), super._onClose(t);
  }
};
qe = new WeakMap(), ft = new WeakMap(), mt = new WeakMap(), fi = new WeakMap(), Ze = new WeakMap(), Bt = new WeakMap(), Ln = new WeakMap(), jo = new WeakMap(), ce = new WeakSet(), nf = /* @__PURE__ */ c(function() {
  if (!h(this, qe)) {
    L(this, ft, []), L(this, mt, {});
    return;
  }
  L(this, ft, pt(h(this, qe)).sort((t, i) => t.order - i.order)), L(this, mt, na(h(this, qe), h(this, ft)));
}, "#hydrateFromScene"), rf = /* @__PURE__ */ c(function() {
  var i, r;
  const t = this.element;
  t instanceof HTMLElement && (t.querySelectorAll("[data-criteria-key]").forEach((a) => {
    a.addEventListener("change", (o) => {
      const s = o.currentTarget;
      if (!(s instanceof HTMLSelectElement)) return;
      const l = s.dataset.criteriaKey;
      l && (L(this, mt, {
        ...h(this, mt),
        [l]: s.value
      }), C(this, ce, of).call(this, { [l]: s.value }));
    });
  }), (i = t.querySelector("[data-action='reset-defaults']")) == null || i.addEventListener("click", () => {
    C(this, ce, sf).call(this);
  }), (r = t.querySelector("[data-action='close-switcher']")) == null || r.addEventListener("click", () => {
    this.close();
  }));
}, "#bindEvents"), af = /* @__PURE__ */ c(function() {
  h(this, Ln) === null && L(this, Ln, Hooks.on("eidolon-utilities.criteriaStateApplied", (t, i) => {
    !h(this, qe) || (t == null ? void 0 : t.id) !== h(this, qe).id || h(this, fi) || (L(this, mt, { ...i ?? {} }), this.render({ force: !0 }));
  }));
}, "#ensureSyncHook"), pl = /* @__PURE__ */ c(async function(t) {
  var i, r;
  if (h(this, qe)) {
    C(this, ce, pr).call(this, "applying"), L(this, fi, !0);
    try {
      const a = await ef(t, h(this, qe));
      a && L(this, mt, a), C(this, ce, pr).call(this, "ready"), this.render({ force: !0 });
    } catch (a) {
      console.error(`${te} | Failed to apply criteria state`, a), (r = (i = ui.notifications) == null ? void 0 : i.error) == null || r.call(
        i,
        E(
          "EIDOLON.CriteriaSwitcher.ApplyError",
          "Failed to apply the selected criteria state."
        )
      ), C(this, ce, pr).call(this, "error", (a == null ? void 0 : a.message) ?? "Unknown error");
    } finally {
      L(this, fi, !1), h(this, Bt) && C(this, ce, yl).call(this);
    }
  }
}, "#applyPartialState"), of = /* @__PURE__ */ c(function(t) {
  L(this, Bt, {
    ...h(this, Bt) ?? {},
    ...t ?? {}
  }), h(this, Ze) !== null && clearTimeout(h(this, Ze)), C(this, ce, pr).call(this, "applying"), L(this, Ze, setTimeout(() => {
    L(this, Ze, null), C(this, ce, yl).call(this);
  }, h(this, jo)));
}, "#queuePartialState"), yl = /* @__PURE__ */ c(async function() {
  if (h(this, fi) || !h(this, Bt)) return;
  const t = h(this, Bt);
  L(this, Bt, null), await C(this, ce, pl).call(this, t);
}, "#flushPendingState"), sf = /* @__PURE__ */ c(async function() {
  if (!h(this, ft).length) return;
  const t = h(this, ft).reduce((i, r) => (i[r.key] = r.default, i), {});
  L(this, mt, t), h(this, Ze) !== null && (clearTimeout(h(this, Ze)), L(this, Ze, null)), L(this, Bt, null), await C(this, ce, pl).call(this, t);
}, "#resetToDefaults"), pr = /* @__PURE__ */ c(function(t, i = "") {
  const r = this.element;
  if (!(r instanceof HTMLElement)) return;
  const a = r.querySelector("[data-role='status']");
  if (a instanceof HTMLElement)
    switch (a.dataset.mode = t, t) {
      case "applying":
        a.textContent = E("EIDOLON.CriteriaSwitcher.Applying", "Applying changes...");
        break;
      case "error":
        a.textContent = `${E("EIDOLON.CriteriaSwitcher.Error", "Error")}: ${i}`;
        break;
      case "ready":
      default:
        a.textContent = `${E("EIDOLON.CriteriaSwitcher.Ready", "Ready")}: ${C(this, ce, bl).call(this)}`;
        break;
    }
}, "#setStatus"), bl = /* @__PURE__ */ c(function() {
  return h(this, ft).length ? `[${h(this, ft).map((t) => {
    var i;
    return ((i = h(this, mt)) == null ? void 0 : i[t.key]) ?? t.default;
  }).join(" | ")}]` : "-";
}, "#formatStateSummary"), c(Et, "CriteriaSwitcherApplication"), ye(Et, "APP_ID", `${te}-criteria-switcher`), ye(Et, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Re(Et, Et, "DEFAULT_OPTIONS"),
  {
    id: Et.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((ju = Re(Et, Et, "DEFAULT_OPTIONS")) == null ? void 0 : ju.classes) ?? [], "eidolon-criteria-switcher-window", "themed"])
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
    template: `modules/${te}/templates/criteria-switcher.html`
  }
});
let gl = Et;
const wg = Go(gl);
let wi = null;
function Eg(n) {
  var e;
  return n ?? ((e = game.scenes) == null ? void 0 : e.viewed) ?? null;
}
c(Eg, "resolveScene");
function Cg(n) {
  var e;
  return !!(n != null && n.rendered && ((e = n == null ? void 0 : n.element) != null && e.isConnected));
}
c(Cg, "isRendered");
function Qo() {
  return Cg(wi) ? wi : (wi = null, null);
}
c(Qo, "getCriteriaSwitcher");
function lf(n) {
  var i, r, a, o, s;
  const e = Eg(n);
  if (!e)
    return (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "No active scene to open the criteria switcher."), null;
  if (!Jo(e))
    return (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, "You do not have permission to manage scene criteria."), null;
  const t = Qo();
  return t ? (t.setScene(e), t.render({ force: !0 }), (s = t.bringToFront) == null || s.call(t), t) : (wi = wg({ scene: e }), wi.render({ force: !0 }), wi);
}
c(lf, "openCriteriaSwitcher");
function cf() {
  const n = Qo();
  n && (n.close(), wi = null);
}
c(cf, "closeCriteriaSwitcher");
function gc(n) {
  return Qo() ? (cf(), null) : lf(n);
}
c(gc, "toggleCriteriaSwitcher");
const Sg = {
  SCHEMA_VERSION: uc,
  applyState: ef,
  getState: cg,
  getVersion: dg,
  setVersion: tf,
  getCriteria(n) {
    var e;
    return pt(n ?? ((e = game.scenes) == null ? void 0 : e.viewed));
  },
  setCriteria(n, e) {
    var t;
    return Yo(e ?? ((t = game.scenes) == null ? void 0 : t.viewed), n);
  },
  updateTiles: Ud,
  updatePlaceables: Zd,
  indexScene: vg,
  openCriteriaSwitcher: lf,
  closeCriteriaSwitcher: cf,
  toggleCriteriaSwitcher: gc,
  findBestMatch: Mh,
  findFileIndex: _h,
  resolveRules: Fd,
  // Convention registration API
  registerTileConvention: hr,
  unregisterTileConvention: eg,
  getTileConventions: Kd,
  // Hidden light provider API
  registerHiddenLightProvider: Jd,
  unregisterHiddenLightProvider: Qh,
  // Indexing hook API
  registerIndexingHook: tg,
  unregisterIndexingHook: ng
};
function Tg(n) {
  if (!(n instanceof HTMLElement)) return null;
  const e = [
    "nav.sheet-tabs[data-group]",
    "nav.tabs[data-group]",
    "nav.sheet-tabs",
    "nav.tabs"
  ];
  for (const t of e) {
    const i = n.querySelector(t);
    if (i instanceof HTMLElement) return i;
  }
  return null;
}
c(Tg, "findTabNav");
function Lg(n, e) {
  var i, r, a;
  return n instanceof HTMLElement ? [
    (i = n.querySelector(".tab[data-tab]")) == null ? void 0 : i.parentElement,
    n.querySelector(".sheet-body"),
    (a = (r = e == null ? void 0 : e.parentElement) == null ? void 0 : r.querySelector) == null ? void 0 : a.call(r, ":scope > .sheet-body"),
    e == null ? void 0 : e.parentElement
  ].find((o) => o instanceof HTMLElement) ?? null : null;
}
c(Lg, "findTabBody");
function Ig(n, e) {
  var t, i, r, a, o, s, l;
  return ((t = n == null ? void 0 : n.dataset) == null ? void 0 : t.group) ?? ((a = (r = (i = n == null ? void 0 : n.querySelector) == null ? void 0 : i.call(n, "[data-group]")) == null ? void 0 : r.dataset) == null ? void 0 : a.group) ?? ((l = (s = (o = e == null ? void 0 : e.querySelector) == null ? void 0 : o.call(e, ".tab[data-group]")) == null ? void 0 : s.dataset) == null ? void 0 : l.group) ?? "main";
}
c(Ig, "getTabGroup");
function Og(n, e, t) {
  if (!(n instanceof HTMLElement)) return;
  n.textContent = "";
  const i = document.createElement("i");
  i.className = t, i.setAttribute("inert", ""), n.append(i, " ");
  const r = document.createElement("span");
  r.textContent = e, n.append(r);
}
c(Og, "setTabButtonContent");
function Ag(n, e, t) {
  const i = n.querySelector("[data-tab]"), r = (i == null ? void 0 : i.tagName) || "A", a = document.createElement(r);
  return i instanceof HTMLElement && (a.className = i.className), a.classList.remove("active"), r === "BUTTON" && (a.type = "button"), a.dataset.action = "tab", a.dataset.tab = t, a.dataset.group = e, a.setAttribute("aria-selected", "false"), a.setAttribute("aria-pressed", "false"), a;
}
c(Ag, "createTabButton");
function kg(n, e, t) {
  const i = document.createElement("div");
  i.classList.add("tab"), i.dataset.tab = t, i.dataset.group = e, i.dataset.applicationPart = t, i.setAttribute("hidden", "true");
  const r = Cd(n);
  return n.insertBefore(i, r ?? null), i;
}
c(kg, "createTabPanel");
function ws(n, e, t, i, r) {
  var s;
  if (!(i instanceof HTMLElement) || !(r instanceof HTMLElement)) return;
  const a = (s = n == null ? void 0 : n.tabGroups) == null ? void 0 : s[e];
  if (typeof a == "string" ? a === t : i.classList.contains("active") || r.classList.contains("active")) {
    i.classList.add("active"), i.setAttribute("aria-selected", "true"), i.setAttribute("aria-pressed", "true"), r.classList.add("active"), r.removeAttribute("hidden"), r.removeAttribute("aria-hidden");
    return;
  }
  i.classList.remove("active"), i.setAttribute("aria-selected", "false"), i.setAttribute("aria-pressed", "false"), r.classList.remove("active"), r.setAttribute("hidden", "true");
}
c(ws, "syncTabVisibility");
function uf(n, e, t, i, r) {
  const a = Tg(e), o = Lg(e, a);
  if (!(a instanceof HTMLElement) || !(o instanceof HTMLElement)) return null;
  const s = Ig(a, o);
  let l = a.querySelector(`[data-tab="${t}"]`);
  l instanceof HTMLElement || (l = Ag(a, s, t), a.appendChild(l)), Og(l, i, r);
  let u = o.querySelector(`.tab[data-tab="${t}"]`);
  u instanceof HTMLElement || (u = kg(o, s, t));
  const d = `data-eidolon-bound-${t}`;
  return l.hasAttribute(d) || (l.addEventListener("click", () => {
    wd(n, t, s), requestAnimationFrame(() => {
      ws(n, s, t, l, u);
    });
  }), l.setAttribute(d, "true")), ws(n, s, t, l, u), requestAnimationFrame(() => {
    ws(n, s, t, l, u);
  }), Mg(n, a), u;
}
c(uf, "ensureTileConfigTab");
function Mg(n, e) {
  !(n != null && n.setPosition) || !(e instanceof HTMLElement) || requestAnimationFrame(() => {
    var a;
    if (e.scrollWidth <= e.clientWidth) return;
    const t = e.scrollWidth - e.clientWidth, i = n.element instanceof HTMLElement ? n.element : (a = n.element) == null ? void 0 : a[0];
    if (!i) return;
    const r = i.offsetWidth || 480;
    n.setPosition({ width: r + t + 16 });
  });
}
c(Mg, "fitNavWidth");
function df(n) {
  var e;
  return ((e = n == null ? void 0 : n.getFlag) == null ? void 0 : e.call(n, "monks-active-tiles", "files")) ?? [];
}
c(df, "getTileFiles$1");
function _g(n = []) {
  return {
    strategy: "select-one",
    defaultTarget: jn(n, 0) ?? { indexHint: 0 },
    variants: [
      {
        criteria: {},
        target: jn(n, 0) ?? { indexHint: 0 }
      }
    ]
  };
}
c(_g, "createDefaultTileCriteria");
function Ng(n, e = {}) {
  var o, s;
  const { allowLegacy: t = !0 } = e, i = df(n), r = (o = n == null ? void 0 : n.getFlag) == null ? void 0 : o.call(n, te, bi);
  if (r) return Si(r, { files: i });
  if (!t) return null;
  const a = (s = n == null ? void 0 : n.getFlag) == null ? void 0 : s.call(n, te, yi);
  return a ? Si(a, { files: i }) : null;
}
c(Ng, "getTileCriteria");
async function ou(n, e, t = {}) {
  if (!(n != null && n.setFlag)) return null;
  const {
    strictValidation: i = !0
  } = t, r = df(n), a = Si(e, { files: r });
  if (!a)
    return typeof n.unsetFlag == "function" ? (await n.unsetFlag(te, bi), await n.unsetFlag(te, yi)) : (await n.setFlag(te, bi, null), await n.setFlag(te, yi, null)), null;
  if (i) {
    const o = Hd(a, { files: r });
    if (o.errors.length > 0)
      throw new Error(
        `Tile criteria contains ${o.errors.length} conflicting rule pair(s). Resolve clashes before saving.`
      );
  }
  return await n.setFlag(te, bi, a), typeof n.unsetFlag == "function" && await n.unsetFlag(te, yi), a;
}
c(ou, "setTileCriteria");
const vl = "__eidolon_any__", wl = "eidolon-tile-criteria", xg = "fa-solid fa-sliders", ff = Symbol.for("eidolon.tileCriteriaUiState"), Zo = ["all", "unmapped", "mapped", "conflicts"];
function $g(n) {
  const e = n == null ? void 0 : n[ff];
  return !e || typeof e != "object" ? {
    filterQuery: "",
    filterMode: "all",
    selectedFileIndex: null
  } : {
    filterQuery: typeof e.filterQuery == "string" ? e.filterQuery : "",
    filterMode: Zo.includes(e.filterMode) ? e.filterMode : "all",
    selectedFileIndex: Number.isInteger(e.selectedFileIndex) ? e.selectedFileIndex : null
  };
}
c($g, "readUiState");
function Fg(n, e) {
  if (!n || !e) return;
  typeof e.filterQuery == "string" && (n.filterQuery = e.filterQuery), Zo.includes(e.filterMode) && (n.filterMode = e.filterMode), Number.isInteger(e.selectedFileIndex) && n.fileEntries.some((i) => i.index === e.selectedFileIndex) && (n.selectedFileIndex = e.selectedFileIndex);
}
c(Fg, "applyUiState");
function Dg(n) {
  const e = n == null ? void 0 : n.app, t = n == null ? void 0 : n.state;
  !e || !t || (e[ff] = {
    filterQuery: typeof t.filterQuery == "string" ? t.filterQuery : "",
    filterMode: Zo.includes(t.filterMode) ? t.filterMode : "all",
    selectedFileIndex: Number.isInteger(t.selectedFileIndex) ? t.selectedFileIndex : null
  });
}
c(Dg, "persistUiState");
function Pg(n) {
  const e = (n == null ? void 0 : n.object) ?? (n == null ? void 0 : n.document) ?? null;
  return !(e != null && e.isEmbedded) || e.documentName !== "Tile" ? null : e;
}
c(Pg, "getTileDocument$1");
function Rg(n) {
  var e;
  return ((e = n == null ? void 0 : n.getFlag) == null ? void 0 : e.call(n, "monks-active-tiles", "files")) ?? [];
}
c(Rg, "getTileFiles");
function Hg(n, e) {
  var s;
  const t = (n == null ? void 0 : n.parent) ?? ((s = game.scenes) == null ? void 0 : s.viewed) ?? null, r = pt(t).sort((l, u) => l.order - u.order).map((l) => ({
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
c(Hg, "getCriteriaDefinitions");
function qg(n) {
  const e = {
    folders: /* @__PURE__ */ new Map(),
    files: []
  };
  for (const t of n) {
    const r = (t.path || t.label).split("/").filter(Boolean);
    if (!r.length) {
      e.files.push({ entry: t, name: t.label });
      continue;
    }
    const a = r.pop();
    let o = e;
    for (const s of r)
      o.folders.has(s) || o.folders.set(s, {
        folders: /* @__PURE__ */ new Map(),
        files: []
      }), o = o.folders.get(s);
    o.files.push({ entry: t, name: a || t.label });
  }
  return e;
}
c(qg, "buildTree");
function jg(n, e) {
  const t = [n];
  let i = e;
  for (; i.files.length === 0 && i.folders.size === 1; ) {
    const [r, a] = i.folders.entries().next().value;
    t.push(r), i = a;
  }
  return {
    label: t.join("/"),
    node: i
  };
}
c(jg, "collapseFolderBranch");
function Bg(n, e) {
  const t = n.rulesByFile.get(e) ?? [], i = [];
  for (const r of t) {
    const a = Object.entries(r.criteria ?? {}).filter(([, s]) => typeof s == "string" && s.trim());
    if (!a.length) {
      i.push("*");
      continue;
    }
    const o = a.map(([s, l]) => `${n.criteriaLabels.get(s) ?? s}: ${l}`).join(" · ");
    i.push(o);
  }
  return i;
}
c(Bg, "getRuleSummariesForFile");
function El(n) {
  var g, p;
  const e = Rg(n), t = dc(e), i = Ng(n, { allowLegacy: !0 }) ?? _g(e), r = Hg(n, i), a = new Map(r.map((y) => [y.key, y.label])), o = new Map(
    t.map((y) => [
      y.index,
      y.path || y.label
    ])
  ), s = kr(i.defaultTarget, e), l = ((g = t[0]) == null ? void 0 : g.index) ?? 0, u = s >= 0 ? s : l, d = new Map(t.map((y) => [y.index, []]));
  let m = 1;
  for (const y of i.variants ?? []) {
    const w = kr(y.target, e);
    w < 0 || (d.has(w) || d.set(w, []), d.get(w).push({
      id: m,
      criteria: { ...y.criteria ?? {} }
    }), m += 1);
  }
  const f = t.some((y) => y.index === u) ? u : ((p = t[0]) == null ? void 0 : p.index) ?? null;
  return {
    files: e,
    fileEntries: t,
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
c(El, "buildEditorState");
function Cl(n, e) {
  return n.rulesByFile.has(e) || n.rulesByFile.set(e, []), n.rulesByFile.get(e);
}
c(Cl, "getRulesForFile");
function Ug(n) {
  return Object.fromEntries(
    Object.entries(n ?? {}).filter(([e, t]) => typeof e == "string" && e && typeof t == "string" && t.trim()).map(([e, t]) => [e, t.trim()])
  );
}
c(Ug, "sanitizeRuleCriteria");
function mf(n) {
  const e = jn(n.files, n.defaultIndex);
  if (!e) return null;
  const t = [], i = [];
  for (const [a, o] of n.rulesByFile.entries()) {
    const s = jn(n.files, a);
    if (s)
      for (const [l, u] of o.entries()) {
        const d = Ug(u.criteria);
        t.push({
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
  return t.length || (t.push({
    criteria: {},
    target: { ...e }
  }), i.push({
    fileIndex: n.defaultIndex,
    ruleId: null,
    rulePosition: null,
    criteria: {},
    isFallback: !0
  })), {
    normalized: Si(
      {
        strategy: "select-one",
        defaultTarget: e,
        variants: t
      },
      { files: n.files }
    ),
    sources: i
  };
}
c(mf, "buildTileCriteriaDraft");
function Vg(n) {
  var e;
  return ((e = mf(n)) == null ? void 0 : e.normalized) ?? null;
}
c(Vg, "exportTileCriteria");
function su(n) {
  const e = mf(n);
  if (!(e != null && e.normalized))
    return {
      errors: [],
      warnings: [],
      errorFileIndexes: [],
      warningFileIndexes: []
    };
  const t = Hd(e.normalized, { files: n.files }), i = /* @__PURE__ */ c((s) => {
    const l = e.sources[s.leftIndex] ?? null, u = e.sources[s.rightIndex] ?? null;
    return {
      ...s,
      leftFileIndex: l == null ? void 0 : l.fileIndex,
      rightFileIndex: u == null ? void 0 : u.fileIndex
    };
  }, "mapConflict"), r = t.errors.map((s) => i(s)), a = t.warnings.map((s) => i(s)), o = /* @__PURE__ */ c((s) => {
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
c(su, "analyzeRuleConflicts");
function ma(n, e = "neutral") {
  const t = document.createElement("span");
  return t.classList.add("eidolon-tile-criteria__badge"), t.dataset.kind = e, t.textContent = n, t;
}
c(ma, "createBadge");
function zg(n, e = {}) {
  const t = typeof n == "string" ? n : "", {
    maxLength: i = 42,
    headLength: r = 20,
    tailLength: a = 16
  } = e;
  if (!t || t.length <= i) return t;
  const o = t.slice(0, r).trimEnd(), s = t.slice(-a).trimStart();
  return `${o}...${s}`;
}
c(zg, "middleEllipsis");
function Gg(n) {
  const e = typeof n == "string" ? n.trim() : "";
  if (!e)
    return {
      error: "",
      matches: /* @__PURE__ */ c(() => !0, "matches")
    };
  let t = e, i = "i";
  if (e.startsWith("/") && e.length > 1) {
    const r = e.lastIndexOf("/");
    r > 0 && (t = e.slice(1, r), i = e.slice(r + 1) || "i");
  }
  i = i.replace(/g/g, "");
  try {
    const r = new RegExp(t, i);
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
c(Gg, "createRegexFilter");
function Wg(n, e) {
  const t = document.createElement("select");
  t.dataset.criteriaKey = n.key;
  const i = document.createElement("option");
  i.value = vl, i.textContent = "*", t.appendChild(i);
  const r = new Set(n.values ?? []);
  e && !r.has(e) && r.add(e);
  for (const a of r) {
    const o = document.createElement("option");
    o.value = a, o.textContent = a, t.appendChild(o);
  }
  return t.value = e ?? vl, t;
}
c(Wg, "createCriterionSelect");
function Yg(n, e, t, i) {
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
    const m = Wg(l, (s = n.criteria) == null ? void 0 : s[l.key]);
    m.addEventListener("change", () => {
      m.value === vl ? delete n.criteria[l.key] : n.criteria[l.key] = m.value, i();
    }), u.appendChild(m), a.appendChild(u);
  }
  r.appendChild(a);
  const o = document.createElement("button");
  return o.type = "button", o.classList.add("control", "ui-control", "eidolon-tile-criteria__rule-remove"), o.textContent = E("EIDOLON.TileCriteria.RemoveRule", "Remove"), o.addEventListener("click", () => {
    const u = Cl(e, t).filter((d) => d.id !== n.id);
    e.rulesByFile.set(t, u), i();
  }), r.appendChild(o), r;
}
c(Yg, "renderRuleEditor");
const Oa = /* @__PURE__ */ new WeakMap();
function hf(n) {
  return (n == null ? void 0 : n.app) ?? (n == null ? void 0 : n.tile) ?? null;
}
c(hf, "getDialogOwner");
function Jg(n) {
  for (const e of n) {
    const t = Kt(e);
    if (t) return t;
    const i = Kt(e == null ? void 0 : e.element);
    if (i) return i;
  }
  return null;
}
c(Jg, "findDialogRoot$1");
function Kg(n, e, t) {
  const i = n.state, r = i.fileEntries.find((y) => y.index === e);
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
    i.defaultIndex = r.index, We(n), t();
  })), u.appendChild(d);
  const m = document.createElement("button");
  m.type = "button", m.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action", "secondary"), m.textContent = E("EIDOLON.TileCriteria.ClearFileRules", "Clear File Rules"), m.addEventListener("click", () => {
    i.rulesByFile.set(r.index, []), We(n), t();
  }), u.appendChild(m), a.appendChild(u);
  const f = document.createElement("div");
  f.classList.add("eidolon-tile-criteria__rule-editors");
  const g = Cl(i, r.index);
  if (g.length)
    for (const y of g)
      f.appendChild(
        Yg(y, i, r.index, () => {
          We(n), t();
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
    Cl(i, r.index).push({
      id: i.nextRuleId,
      criteria: {}
    }), i.nextRuleId += 1, We(n), t();
  }), a.appendChild(p), a;
}
c(Kg, "buildRuleEditorContent");
function Xg(n, e) {
  var m, f, g;
  const t = hf(n);
  if (!t) return;
  const i = Oa.get(t);
  if (i) {
    i.controller = n, i.fileIndex = e, (m = i.refresh) == null || m.call(i);
    return;
  }
  const r = {
    controller: n,
    fileIndex: e,
    host: null,
    refresh: null
  };
  Oa.set(t, r);
  const a = /* @__PURE__ */ c(() => {
    Oa.delete(t);
  }, "closeDialog"), o = /* @__PURE__ */ c(() => {
    r.host instanceof HTMLElement && r.host.replaceChildren(
      Kg(r.controller, r.fileIndex, o)
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
        const y = Jg(p), w = (b = y == null ? void 0 : y.querySelector) == null ? void 0 : b.call(y, ".eidolon-tile-criteria-editor-host");
        w instanceof HTMLElement && (r.host = w, o());
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
c(Xg, "openRuleEditorDialog");
function lu(n) {
  var i;
  const e = hf(n);
  if (!e) return;
  const t = Oa.get(e);
  (i = t == null ? void 0 : t.refresh) == null || i.call(t);
}
c(lu, "refreshOpenRuleEditor");
function Sl(n, e) {
  return (n.rulesByFile.get(e) ?? []).length > 0;
}
c(Sl, "hasRulesForFile");
function gf(n, e) {
  var t, i;
  return ((t = n == null ? void 0 : n.errorFileIndexes) == null ? void 0 : t.includes(e)) || ((i = n == null ? void 0 : n.warningFileIndexes) == null ? void 0 : i.includes(e));
}
c(gf, "hasConflictForFile");
function Qg(n, e, t) {
  switch (n.filterMode) {
    case "unmapped":
      return !Sl(n, e.index);
    case "mapped":
      return Sl(n, e.index);
    case "conflicts":
      return gf(t, e.index);
    case "all":
    default:
      return !0;
  }
}
c(Qg, "matchesFilterMode");
function Zg(n, e) {
  let t = 0, i = 0, r = 0;
  for (const a of n.fileEntries)
    Sl(n, a.index) ? t += 1 : i += 1, gf(e, a.index) && (r += 1);
  return {
    all: n.fileEntries.length,
    mapped: t,
    unmapped: i,
    conflicts: r
  };
}
c(Zg, "getFilterModeCounts");
function ep(n) {
  switch (n) {
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
c(ep, "getFilterModeLabel");
function pf(n, e, t, i, r) {
  var u, d;
  const a = [...n.folders.keys()].sort((m, f) => m.localeCompare(f));
  for (const m of a) {
    const f = jg(m, n.folders.get(m)), g = document.createElement("li");
    g.classList.add("eidolon-tile-criteria__tree-branch");
    const p = document.createElement("div");
    p.classList.add("document", "folder", "update", "eidolon-tile-criteria__folder-row");
    const y = document.createElement("i");
    y.classList.add("fa-solid", "fa-folder-open"), p.appendChild(y);
    const w = document.createElement("span");
    w.classList.add("eidolon-tile-criteria__tree-folder-label"), w.textContent = f.label, w.title = f.label, p.appendChild(w), g.appendChild(p);
    const b = document.createElement("ul");
    b.classList.add("eidolon-tile-criteria__tree"), b.dataset.folder = f.label, pf(f.node, e, t, i, b), b.childElementCount > 0 && g.appendChild(b), r.appendChild(g);
  }
  const o = [...n.files].sort((m, f) => m.name.localeCompare(f.name));
  if (!o.length) return;
  const s = document.createElement("li"), l = document.createElement("ul");
  l.classList.add("document-list", "eidolon-tile-criteria__document-list");
  for (const m of o) {
    const f = m.entry, g = f.index === e.selectedFileIndex, p = f.index === e.defaultIndex, y = Bg(e, f.index), w = document.createElement("li");
    w.classList.add("document", "update", "eidolon-tile-criteria__tree-file");
    const b = document.createElement("button");
    b.type = "button", b.classList.add("eidolon-tile-criteria__file-row");
    const v = (u = i == null ? void 0 : i.errorFileIndexes) == null ? void 0 : u.includes(f.index), S = (d = i == null ? void 0 : i.warningFileIndexes) == null ? void 0 : d.includes(f.index);
    v ? b.classList.add("has-conflict") : S && b.classList.add("has-warning");
    const I = e.relativePaths.get(f.index) || f.path || m.name, A = [I];
    v ? A.push(
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
    ), b.title = A.join(`
`), g && b.classList.add("is-selected"), b.addEventListener("click", () => {
      e.selectedFileIndex = f.index, We(t), Xg(t, f.index);
    });
    const O = document.createElement("span");
    O.classList.add("eidolon-tile-criteria__indicator"), O.dataset.kind = p ? "default" : y.length ? "mapped" : "unmapped", b.appendChild(O);
    const x = document.createElement("span");
    x.classList.add("eidolon-tile-criteria__file-content");
    const M = document.createElement("span");
    M.classList.add("eidolon-tile-criteria__file-heading");
    const D = document.createElement("span");
    D.classList.add("eidolon-tile-criteria__file-title"), D.textContent = zg(m.name || f.label), D.title = I, M.appendChild(D);
    const F = ma(`#${f.index + 1}`, "meta");
    F.classList.add("eidolon-tile-criteria__index-badge"), M.appendChild(F), x.appendChild(M);
    const P = document.createElement("span");
    P.classList.add("eidolon-tile-criteria__badges"), p && P.appendChild(ma(E("EIDOLON.TileCriteria.DefaultBadge", "Default"), "default"));
    const _ = y.slice(0, 2);
    for (const H of _)
      P.appendChild(ma(H, "rule"));
    if (y.length > _.length && P.appendChild(ma(`+${y.length - _.length}`, "meta")), x.appendChild(P), b.appendChild(x), v || S) {
      const H = document.createElement("span");
      H.classList.add("eidolon-tile-criteria__row-warning"), H.dataset.mode = v ? "error" : "warning", H.innerHTML = '<i class="fa-solid fa-triangle-exclamation" inert=""></i>', b.appendChild(H);
    }
    w.appendChild(b), l.appendChild(w);
  }
  s.appendChild(l), r.appendChild(s);
}
c(pf, "renderTreeNode");
function tp(n, e, t, i = {}) {
  const r = document.createElement("section");
  r.classList.add("eidolon-tile-criteria__tree-panel");
  const a = Gg(n.filterQuery), o = Zg(n, t);
  n.filterMode !== "all" && o[n.filterMode] === 0 && (n.filterMode = "all");
  const s = document.createElement("div");
  s.classList.add("eidolon-tile-criteria__toolbar");
  const l = document.createElement("div");
  l.classList.add("eidolon-tile-criteria__mode-bar");
  for (const v of Zo) {
    const S = document.createElement("button");
    S.type = "button", S.classList.add("control", "ui-control", "eidolon-tile-criteria__mode-button"), S.dataset.mode = v, S.textContent = ep(v);
    const I = v === "all" || o[v] > 0;
    S.disabled = !I, I || (S.dataset.tooltip = E(
      "EIDOLON.TileCriteria.FilterModeUnavailable",
      "No entries currently match this filter."
    ), S.title = S.dataset.tooltip), n.filterMode === v ? (S.classList.add("is-active"), S.setAttribute("aria-pressed", "true")) : S.setAttribute("aria-pressed", "false"), S.addEventListener("click", () => {
      n.filterMode !== v && (n.filterMode = v, We(e));
    }), l.appendChild(S);
  }
  s.appendChild(l);
  const u = document.createElement("div");
  u.classList.add("eidolon-tile-criteria__filter-row");
  const d = document.createElement("input");
  d.type = "text", d.classList.add("eidolon-tile-criteria__filter-input"), d.placeholder = E("EIDOLON.TileCriteria.FilterPlaceholder", "Regex filter (path)"), d.value = n.filterQuery, d.autocomplete = "off", d.addEventListener("keydown", (v) => {
    v.stopPropagation(), v.key === "Enter" && v.preventDefault();
  }), d.addEventListener("keyup", (v) => {
    v.stopPropagation();
  }), d.addEventListener("change", (v) => {
    v.stopPropagation();
  }), d.addEventListener("input", (v) => {
    v.stopPropagation();
    const S = d.selectionStart ?? d.value.length, I = d.selectionEnd ?? S;
    n.filterQuery = d.value, We(e), requestAnimationFrame(() => {
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
  f.classList.add("control", "ui-control", "eidolon-tile-criteria__toolbar-action", "icon-only"), f.dataset.tooltip = g, f.setAttribute("aria-label", g), f.title = g, f.innerHTML = '<i class="fa-solid fa-floppy-disk" inert=""></i>', f.disabled = t.errors.length > 0, f.addEventListener("click", () => {
    var v;
    (v = i.onSave) == null || v.call(i);
  }), m.appendChild(f);
  const p = document.createElement("button");
  p.type = "button";
  const y = E("EIDOLON.TileCriteria.Clear", "Clear Rules");
  if (p.classList.add("control", "ui-control", "secondary", "eidolon-tile-criteria__toolbar-action", "icon-only"), p.dataset.tooltip = y, p.setAttribute("aria-label", y), p.title = y, p.innerHTML = '<i class="fa-solid fa-trash" inert=""></i>', p.addEventListener("click", () => {
    var v;
    (v = i.onClear) == null || v.call(i);
  }), m.appendChild(p), u.appendChild(m), s.appendChild(u), r.appendChild(s), a.error) {
    const v = document.createElement("p");
    v.classList.add("notes", "eidolon-tile-criteria__filter-error"), v.textContent = `${E("EIDOLON.TileCriteria.InvalidRegex", "Invalid regex")}: ${a.error}`, r.appendChild(v);
  }
  const w = document.createElement("div");
  w.classList.add("eidolon-tile-criteria__library-tree");
  const b = n.fileEntries.filter((v) => {
    const S = n.relativePaths.get(v.index) || v.path || v.label;
    return Qg(n, v, t) && a.matches(S);
  });
  if (n.fileEntries.length)
    if (b.length) {
      const v = document.createElement("ul");
      v.classList.add("eidolon-tile-criteria__tree"), pf(qg(b), n, e, t, v), w.appendChild(v);
    } else {
      const v = document.createElement("p");
      v.classList.add("notes"), v.textContent = E("EIDOLON.TileCriteria.NoMatches", "No variants match this filter."), w.appendChild(v);
    }
  else {
    const v = document.createElement("p");
    v.classList.add("notes"), v.textContent = E("EIDOLON.TileCriteria.NoVariants", "No MATT variants found"), w.appendChild(v);
  }
  return r.appendChild(w), r;
}
c(tp, "renderTreePanel");
function We(n) {
  const { section: e, state: t } = n, i = su(t);
  Dg(n), e.replaceChildren();
  const r = /* @__PURE__ */ c(async () => {
    try {
      const o = su(t);
      if (o.errors.length) {
        t.status = {
          mode: "error",
          message: E(
            "EIDOLON.TileCriteria.ConflictSaveBlocked",
            `Resolve ${o.errors.length} conflict(s) before saving tile criteria rules.`
          )
        }, We(n);
        return;
      }
      const s = Vg(t);
      if (!s) {
        t.status = {
          mode: "error",
          message: E("EIDOLON.TileCriteria.Invalid", "Invalid rules. Select valid target variants.")
        }, We(n);
        return;
      }
      await ou(n.tile, s);
      const l = t.filterQuery, u = t.filterMode, d = t.selectedFileIndex;
      n.state = El(n.tile), n.state.filterQuery = l, n.state.filterMode = u, Number.isInteger(d) && (n.state.selectedFileIndex = d), n.state.status = {
        mode: "ready",
        message: E("EIDOLON.TileCriteria.Saved", "Tile criteria rules saved.")
      }, We(n), lu(n);
    } catch (o) {
      console.error(`${te} | Failed to save tile criteria`, o), t.status = {
        mode: "error",
        message: (o == null ? void 0 : o.message) ?? "Failed to save tile criteria rules."
      }, We(n);
    }
  }, "handleSave"), a = /* @__PURE__ */ c(async () => {
    try {
      await ou(n.tile, null);
      const o = t.filterQuery, s = t.filterMode, l = t.selectedFileIndex;
      n.state = El(n.tile), n.state.filterQuery = o, n.state.filterMode = s, Number.isInteger(l) && (n.state.selectedFileIndex = l), n.state.status = {
        mode: "ready",
        message: E("EIDOLON.TileCriteria.Cleared", "Tile criteria rules cleared.")
      }, We(n), lu(n);
    } catch (o) {
      console.error(`${te} | Failed to clear tile criteria`, o), t.status = {
        mode: "error",
        message: (o == null ? void 0 : o.message) ?? "Failed to clear tile criteria rules."
      }, We(n);
    }
  }, "handleClear");
  if (e.appendChild(tp(t, n, i, {
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
  if (t.status.mode === "error" || t.status.mode === "warning") {
    const o = document.createElement("p");
    o.classList.add("eidolon-tile-criteria__status", "notes"), o.dataset.mode = t.status.mode, o.textContent = t.status.message, e.appendChild(o);
  }
}
c(We, "renderController");
function np(n, e = null) {
  const t = document.createElement("section");
  t.classList.add("eidolon-tile-criteria");
  const i = El(n);
  Fg(i, $g(e));
  const r = {
    app: e,
    tile: n,
    section: t,
    state: i
  };
  return We(r), r;
}
c(np, "createController");
function ip(n, e) {
  return uf(
    n,
    e,
    wl,
    E("EIDOLON.TileCriteria.TabLabel", "Criteria"),
    xg
  );
}
c(ip, "ensureTileCriteriaTab");
function rp() {
  Hooks.on("renderTileConfig", (n, e) => {
    var l, u, d, m;
    const t = Kt(e);
    if (!t) return;
    const i = Pg(n);
    if (!i) return;
    if ((l = t.querySelector(".eidolon-tile-criteria")) == null || l.remove(), !Wo()) {
      (u = t.querySelector(`.item[data-tab='${wl}']`)) == null || u.remove(), (d = t.querySelector(`.tab[data-tab='${wl}']`)) == null || d.remove();
      return;
    }
    const r = np(i, n), a = ip(n, t);
    if (a instanceof HTMLElement) {
      a.replaceChildren(r.section), (m = n.setPosition) == null || m.call(n, { height: "auto" });
      return;
    }
    const o = (n == null ? void 0 : n.form) instanceof HTMLFormElement ? n.form : t instanceof HTMLFormElement ? t : t.querySelector("form");
    if (!(o instanceof HTMLFormElement)) return;
    const s = o.querySelector("button[type='submit']");
    s != null && s.parentElement ? s.parentElement.insertAdjacentElement("beforebegin", r.section) : o.appendChild(r.section);
  });
}
c(rp, "registerTileCriteriaConfigControls");
const ap = ["Checkbox", "Tile", "Settings", "Toggleable Lights"], op = [
  "Checkbox",
  "Tile",
  "Settings",
  "Toggleable Lights",
  "Checked",
  "Unchecked",
  "Individual"
];
function sp() {
  if (!globalThis.Tagger) return [];
  const n = Tagger.getByTag(ap) ?? [], e = [];
  for (const t of n) {
    if (t.getFlag("monks-active-tiles", "variables.state") !== "unchecked") continue;
    const i = (Tagger.getTags(t) ?? []).filter((o) => !op.includes(o)), r = (Tagger.getByTag("Disable Automation") ?? []).concat(Tagger.getByTag("Settings") ?? []), a = Tagger.getByTag(i, { ignore: r }) ?? [];
    for (const o of a)
      o != null && o._id && e.push(o._id);
  }
  return e;
}
c(sp, "buildLightControlsMap");
function lp() {
  Jd(sp);
}
c(lp, "registerCheckboxLightProvider");
function cp(n) {
  if (Array.isArray(n)) return n;
  if (n instanceof Map) return Array.from(n.values());
  if (n && typeof n == "object") {
    if (typeof n.values == "function")
      try {
        const e = Array.from(n.values());
        if (e.length > 0) return e;
      } catch {
      }
    return Object.values(n);
  }
  return [];
}
c(cp, "toList");
function up(n, e) {
  const t = n == null ? void 0 : n.tools;
  return Array.isArray(t) ? t.some((i) => (i == null ? void 0 : i.name) === e) : t instanceof Map ? t.has(e) : t && typeof t == "object" ? e in t ? !0 : Object.values(t).some((i) => (i == null ? void 0 : i.name) === e) : !1;
}
c(up, "hasTool");
function dp(n, e) {
  if (Array.isArray(n.tools)) {
    n.tools.push(e);
    return;
  }
  if (n.tools instanceof Map) {
    n.tools.set(e.name, e);
    return;
  }
  if (n.tools && typeof n.tools == "object") {
    n.tools[e.name] = e;
    return;
  }
  n.tools = [e];
}
c(dp, "addTool");
function fp() {
  Hooks.on("getSceneControlButtons", (n) => {
    var i;
    const e = cp(n);
    if (!e.length) return;
    const t = e.find((r) => (r == null ? void 0 : r.name) === "tiles") ?? e.find((r) => (r == null ? void 0 : r.name) === "tokens" || (r == null ? void 0 : r.name) === "token") ?? e[0];
    t && (up(t, "eidolonCriteriaSwitcher") || dp(t, {
      name: "eidolonCriteriaSwitcher",
      title: "Criteria Switcher",
      icon: "fa-solid fa-sliders",
      button: !0,
      toggle: !1,
      visible: Jo(((i = game.scenes) == null ? void 0 : i.viewed) ?? null),
      onClick: /* @__PURE__ */ c(() => gc(), "onClick")
    }));
  });
}
c(fp, "registerSceneControlButton");
function ha(n, e) {
  if (!n || typeof n != "object") return !1;
  const t = String(e).split(".");
  let i = n;
  for (const r of t) {
    if (!i || typeof i != "object" || !Object.prototype.hasOwnProperty.call(i, r)) return !1;
    i = i[r];
  }
  return !0;
}
c(ha, "hasOwnPath");
function mp() {
  const n = /* @__PURE__ */ c((i, r = null) => {
    i && Wh(i, r);
  }, "invalidateTileScene"), e = /* @__PURE__ */ c((i, r = null) => {
    i && lg(i, r);
  }, "invalidatePlaceableScene");
  Hooks.on("createTile", (i) => {
    n((i == null ? void 0 : i.parent) ?? null, i ?? null);
  }), Hooks.on("deleteTile", (i) => {
    n((i == null ? void 0 : i.parent) ?? null, i ?? null);
  }), Hooks.on("updateTile", (i, r) => {
    (ha(r, `flags.${te}.tileCriteria`) || ha(r, `flags.${te}.fileIndex`)) && n((i == null ? void 0 : i.parent) ?? null, i ?? null);
  });
  const t = /* @__PURE__ */ c((i) => {
    Hooks.on(`create${i}`, (r) => {
      e((r == null ? void 0 : r.parent) ?? null, r ?? null);
    }), Hooks.on(`delete${i}`, (r) => {
      e((r == null ? void 0 : r.parent) ?? null, r ?? null);
    }), Hooks.on(`update${i}`, (r, a) => {
      const o = ha(a, `flags.${te}.presets`), s = i === "AmbientLight" && ha(a, `flags.${te}.lightCriteria`);
      !o && !s || e((r == null ? void 0 : r.parent) ?? null, r ?? null);
    });
  }, "registerPlaceableHooks");
  t("AmbientLight"), t("Wall"), t("AmbientSound"), Hooks.on("canvasReady", (i) => {
    const r = (i == null ? void 0 : i.scene) ?? null;
    r && (n(r), e(r));
  });
}
c(mp, "registerCriteriaCacheInvalidationHooks");
function hp() {
  hg(), lp(), fp(), rp(), mp(), Hooks.once("init", () => {
    var n, e;
    (e = (n = game.keybindings) == null ? void 0 : n.register) == null || e.call(n, te, "toggleCriteriaSwitcher", {
      name: "Toggle Criteria Switcher",
      hint: "Open or close the criteria switcher window for live scene state updates.",
      editable: [{ key: "KeyM", modifiers: ["Alt"] }],
      onDown: /* @__PURE__ */ c(() => {
        var t, i, r;
        return Jo(((t = game.scenes) == null ? void 0 : t.viewed) ?? null) ? (gc(), !0) : ((r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "You do not have permission to manage scene criteria."), !0);
      }, "onDown"),
      restricted: !0,
      precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
    });
  }), Hooks.on("canvasReady", (n) => {
    var t;
    const e = Qo();
    e && (e.setScene((n == null ? void 0 : n.scene) ?? ((t = game.scenes) == null ? void 0 : t.viewed) ?? null), e.render({ force: !0 }));
  }), Hooks.once("ready", () => {
    var e, t;
    const n = (t = (e = game.modules) == null ? void 0 : e.get) == null ? void 0 : t.call(e, te);
    n && (n.api || (n.api = {}), n.api.criteria = Sg, console.log(`${te} | Criteria engine API registered`));
  });
}
c(hp, "registerCriteriaEngineHooks");
hp();
const Aa = /* @__PURE__ */ new WeakMap(), ga = /* @__PURE__ */ new WeakMap(), ve = "__eidolon_default__";
function gp() {
  Hooks.on("renderAmbientLightConfig", pp), N("LightCriteria | AmbientLightConfig controls registered");
}
c(gp, "registerAmbientLightCriteriaControls");
function pp(n, e) {
  var t;
  Xi("LightCriteria | renderAmbientLightConfig", {
    appId: (n == null ? void 0 : n.id) ?? null,
    constructor: ((t = n == null ? void 0 : n.constructor) == null ? void 0 : t.name) ?? null,
    isRendered: (n == null ? void 0 : n.rendered) ?? !1
  });
  try {
    const i = Kt(e);
    if (!i) return;
    if (!Wo()) {
      i.querySelectorAll(".eidolon-light-criteria, .eidolon-light-criteria-main-switcher").forEach((r) => r.remove());
      return;
    }
    yp(n, i);
  } catch (i) {
    console.error("eidolon-utilities | Failed to enhance AmbientLightConfig UI", i);
  } finally {
    Dn();
  }
}
c(pp, "handleAmbientLightConfigRender");
function yp(n, e) {
  var xe, Jn, ar, la, xc;
  const t = (n == null ? void 0 : n.form) instanceof HTMLFormElement ? n.form : e instanceof HTMLFormElement ? e : (xe = e == null ? void 0 : e.closest) == null ? void 0 : xe.call(e, "form");
  if (!(t instanceof HTMLFormElement)) return;
  const i = t.querySelector(".window-content");
  if (!(i instanceof HTMLElement)) return;
  const r = bf(n);
  if (!r) return;
  const a = Hp(r);
  N("LightCriteria | Resolved ambient light", {
    sheetId: (r == null ? void 0 : r.id) ?? null,
    persistedId: (a == null ? void 0 : a.id) ?? null,
    sameRef: r === a
  });
  const o = (a == null ? void 0 : a.parent) ?? r.parent ?? null, s = o ? wh(o) : [], l = s.filter(
    ($) => Array.isArray($ == null ? void 0 : $.values) && $.values.length > 0
  ), u = kp(s), d = s.map(($) => typeof ($ == null ? void 0 : $.id) == "string" ? $.id : null).filter(($) => !!$), m = a ?? r, f = o ? pt(o) : [];
  let g = zd(m);
  const p = Xh(g, f);
  JSON.stringify(p) !== JSON.stringify(g) && (g = p, Gd(m, p).catch(($) => {
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
  const b = document.createElement("legend");
  b.textContent = E("EIDOLON.LightCriteria.Legend", "Scene Criteria Lighting"), w.appendChild(b);
  const v = document.createElement("p");
  v.classList.add("notes"), v.textContent = E(
    "EIDOLON.LightCriteria.Description",
    "Capture a base lighting state, then map criteria values to lighting configurations."
  ), w.appendChild(v);
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
  ), A.setAttribute("aria-expanded", "false"), S.appendChild(A), w.appendChild(S);
  const O = document.createElement("p");
  O.classList.add("notes", "eidolon-light-criteria__status"), w.appendChild(O);
  const x = document.createElement("div");
  x.classList.add("eidolon-light-criteria__switcher");
  const M = document.createElement("label");
  M.classList.add("eidolon-light-criteria__switcher-label");
  const D = `${(n == null ? void 0 : n.id) ?? (r == null ? void 0 : r.id) ?? "eidolon-light"}-mapping-select`;
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
    Z.classList.add("eidolon-light-criteria__filter-name"), Z.textContent = (ar = (Jn = $.name) == null ? void 0 : Jn.trim) != null && ar.call(Jn) ? $.name.trim() : E("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), G.appendChild(Z);
    const ee = document.createElement("select");
    ee.dataset.filterCategoryId = $.id, ee.classList.add("eidolon-light-criteria__filter-select");
    const ie = document.createElement("option");
    ie.value = "", ie.textContent = E("EIDOLON.LightCriteria.FilterAny", "Any"), ee.appendChild(ie);
    for (const ue of $.values) {
      const de = document.createElement("option");
      de.value = ue, de.textContent = ue, ee.appendChild(de);
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
  const Qt = document.createElement("summary");
  Qt.classList.add("eidolon-light-criteria__menu-toggle"), Qt.innerHTML = '<i class="fa-solid fa-ellipsis-vertical" inert=""></i>', Qt.setAttribute(
    "aria-label",
    E("EIDOLON.LightCriteria.MoreActions", "More actions")
  ), Qt.dataset.tooltip = E("EIDOLON.LightCriteria.MoreActions", "More actions"), ne.appendChild(Qt);
  const yt = document.createElement("div");
  yt.classList.add("eidolon-light-criteria__menu-list"), ne.appendChild(yt);
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
  ), yt.appendChild(ot), J.appendChild(ne);
  const Zt = document.createElement("div");
  Zt.classList.add("eidolon-light-criteria-main-switcher"), Zt.appendChild(x);
  const Ke = document.createElement("p");
  if (Ke.classList.add("notes", "eidolon-light-criteria-main-switcher__empty"), Ke.textContent = E(
    "EIDOLON.LightCriteria.ActiveRequiresBase",
    "Set Base Lighting to enable mapping selection and actions."
  ), Zt.appendChild(Ke), s.length === 0) {
    const $ = document.createElement("p");
    $.classList.add("notification", "warning", "eidolon-light-criteria__warning"), $.textContent = E(
      "EIDOLON.LightCriteria.NoCategoriesWarning",
      "This scene has no criteria configured. Add criteria under Scene -> Criteria to enable criteria-driven lighting."
    ), w.appendChild($);
  } else if (l.length === 0) {
    const $ = document.createElement("p");
    $.classList.add("notification", "warning", "eidolon-light-criteria__warning"), $.textContent = E(
      "EIDOLON.LightCriteria.NoValuesWarning",
      "Criteria exist, but none define selectable values. Add values in Scene -> Criteria."
    ), w.appendChild($);
  }
  const Ae = document.createElement("div");
  Ae.classList.add("eidolon-light-criteria__creation"), Ae.dataset.section = "creation", Ae.hidden = !0;
  const Oi = document.createElement("p");
  Oi.classList.add("notes"), Oi.textContent = E(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ), Ae.appendChild(Oi);
  const en = document.createElement("div");
  en.classList.add("eidolon-light-criteria__category-list"), Ae.appendChild(en);
  for (const $ of l) {
    const G = document.createElement("label");
    G.classList.add("eidolon-light-criteria__category");
    const Z = document.createElement("span");
    Z.classList.add("eidolon-light-criteria__category-name"), Z.textContent = (xc = (la = $.name) == null ? void 0 : la.trim) != null && xc.call(la) ? $.name.trim() : E("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), G.appendChild(Z);
    const ee = document.createElement("select");
    ee.dataset.categoryId = $.id, ee.classList.add("eidolon-light-criteria__category-select");
    const ie = document.createElement("option");
    ie.value = "", ie.textContent = E(
      "EIDOLON.LightCriteria.IgnoreCategory",
      "Ignore"
    ), ee.appendChild(ie);
    for (const ue of $.values) {
      const de = document.createElement("option");
      de.value = ue, de.textContent = ue, ee.appendChild(de);
    }
    G.appendChild(ee), en.appendChild(G);
  }
  const Yn = document.createElement("div");
  Yn.classList.add("eidolon-light-criteria__creation-actions");
  const st = document.createElement("button");
  st.type = "button", st.dataset.action = "save-mapping", st.classList.add("eidolon-light-criteria__button", "primary"), st.textContent = E(
    "EIDOLON.LightCriteria.SaveMapping",
    "Save Mapping"
  ), Yn.appendChild(st);
  const tn = document.createElement("button");
  tn.type = "button", tn.dataset.action = "cancel-create", tn.classList.add("eidolon-light-criteria__button", "secondary"), tn.textContent = E(
    "EIDOLON.LightCriteria.Cancel",
    "Cancel"
  ), Yn.appendChild(tn), Ae.appendChild(Yn), w.appendChild(Ae), i.prepend(Zt), i.appendChild(w), w.hidden = !0, wp(n, {
    fieldset: w,
    homeContainer: i
  }), requestAnimationFrame(() => {
    var $;
    ($ = n.setPosition) == null || $.call(n, { height: "auto" });
  });
  let R = g;
  Qn({ switcher: x, emptyState: Ke, state: R }), Xn(O, R), cr(A, {
    state: R,
    hasCategories: l.length > 0
  }), N("LightCriteria | Controls injected", {
    sceneId: (o == null ? void 0 : o.id) ?? null,
    lightId: (r == null ? void 0 : r.id) ?? null,
    hasBase: !!(R != null && R.base),
    mappingCount: Array.isArray(R == null ? void 0 : R.mappings) ? R.mappings.length : 0,
    categories: l.length
  });
  const oa = Fp(R), X = {
    restoreConfig: null,
    app: n,
    selectedMapping: oa,
    editorMode: "create",
    editingMappingId: null,
    mappingFilters: {}
  };
  Aa.set(w, X);
  const bt = /* @__PURE__ */ c(() => {
    ne.open = !1;
  }, "closeActionsMenu");
  Qt.addEventListener("click", ($) => {
    ne.classList.contains("is-disabled") && ($.preventDefault(), bt());
  });
  const Ne = /* @__PURE__ */ c(($ = X.selectedMapping) => {
    const G = Mp(j), Z = Array.isArray(R == null ? void 0 : R.mappings) ? R.mappings : [], ee = Np(Z, G), ie = Object.keys(G).length;
    X.mappingFilters = G, V.disabled = ie === 0, xp(H, {
      totalCount: Z.length,
      visibleCount: ee.length,
      hasFilters: ie > 0,
      activeFilterCount: ie
    }), F.classList.toggle("has-active-filters", ie > 0), $p(ae, R, u, $, {
      mappings: ee,
      categoryOrder: d
    }), X.selectedMapping = ae.value ?? "", Es({
      mappingSelect: ae,
      applyMappingButton: Q,
      updateMappingButton: Pe,
      editCriteriaButton: at,
      removeMappingButton: ot,
      actionsMenu: ne,
      state: R
    }), ne.classList.contains("is-disabled") && bt();
  }, "refreshMappingSelector");
  j.querySelectorAll("select[data-filter-category-id]").forEach(($) => {
    $.addEventListener("change", () => {
      const G = X.selectedMapping;
      Ne(G), X.selectedMapping !== G && Cs(
        a ?? r,
        R,
        X.selectedMapping
      ).then((Z) => {
        Z && (R = Z);
      });
    });
  }), V.addEventListener("click", () => {
    _p(j);
    const $ = X.selectedMapping;
    Ne($), F.open = !1, X.selectedMapping !== $ && Cs(
      a ?? r,
      R,
      X.selectedMapping
    ).then((G) => {
      G && (R = G);
    });
  }), ae.addEventListener("change", () => {
    X.selectedMapping = ae.value ?? "", Es({
      mappingSelect: ae,
      applyMappingButton: Q,
      updateMappingButton: Pe,
      editCriteriaButton: at,
      removeMappingButton: ot,
      actionsMenu: ne,
      state: R
    }), Cs(
      a ?? r,
      R,
      X.selectedMapping
    ).then(($) => {
      $ && (R = $);
    });
  });
  const rr = /* @__PURE__ */ c(async () => {
    var ee, ie, ue, de, lt, hn, ct, gn, pe, pn, yn, Pt, Kn, or;
    const $ = ae.value ?? "";
    if (!$) {
      (ie = (ee = ui.notifications) == null ? void 0 : ee.warn) == null || ie.call(
        ee,
        E(
          "EIDOLON.LightCriteria.SelectMappingWarning",
          "Choose a criteria mapping before applying."
        )
      ), Ne(X.selectedMapping);
      return;
    }
    if ($ === ve) {
      if (!(R != null && R.base)) {
        (de = (ue = ui.notifications) == null ? void 0 : ue.warn) == null || de.call(
          ue,
          E(
            "EIDOLON.LightCriteria.BaseUnavailable",
            "Set a base lighting state before applying it."
          )
        );
        return;
      }
      pa(w, Ae, A), Ma(n, t, R.base), R = await wr(a ?? r, {
        mappingId: ve,
        categories: null,
        updatedAt: Date.now()
      }), X.selectedMapping = ve, Ne(X.selectedMapping), Xn(O, R), Qn({ switcher: x, emptyState: Ke, state: R }), cr(A, {
        state: R,
        hasCategories: l.length > 0
      }), uu(t, {
        mappingId: ve,
        color: ((hn = (lt = R.base) == null ? void 0 : lt.config) == null ? void 0 : hn.color) ?? null
      }), (gn = (ct = ui.notifications) == null ? void 0 : ct.info) == null || gn.call(
        ct,
        E(
          "EIDOLON.LightCriteria.BaseApplied",
          "Applied the base lighting state to the form."
        )
      ), bt();
      return;
    }
    const G = Array.isArray(R == null ? void 0 : R.mappings) && R.mappings.length ? R.mappings.find((Ai) => (Ai == null ? void 0 : Ai.id) === $) : null;
    if (!G) {
      (pn = (pe = ui.notifications) == null ? void 0 : pe.warn) == null || pn.call(
        pe,
        E(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      ), X.selectedMapping = "", Ne(X.selectedMapping);
      return;
    }
    pa(w, Ae, A), Ma(n, t, G.config), R = await wr(a ?? r, {
      mappingId: G.id,
      categories: G.categories,
      updatedAt: Date.now()
    }), X.selectedMapping = G.id, Ne(X.selectedMapping), Xn(O, R), Qn({ switcher: x, emptyState: Ke, state: R }), cr(A, {
      state: R,
      hasCategories: l.length > 0
    }), uu(t, {
      mappingId: G.id,
      color: ((Pt = (yn = G.config) == null ? void 0 : yn.config) == null ? void 0 : Pt.color) ?? null
    });
    const Z = Vi(G, u, d);
    (or = (Kn = ui.notifications) == null ? void 0 : Kn.info) == null || or.call(
      Kn,
      E(
        "EIDOLON.LightCriteria.MappingApplied",
        "Applied mapping: {label}"
      ).replace("{label}", Z)
    ), bt();
  }, "applySelectedMapping");
  Q.addEventListener("click", () => {
    rr();
  }), ae.addEventListener("keydown", ($) => {
    $.key === "Enter" && ($.preventDefault(), rr());
  });
  const sa = /* @__PURE__ */ c(async () => {
    var G, Z, ee, ie, ue, de, lt, hn, ct, gn, pe, pn, yn, Pt, Kn, or, Ai, ca, $c, ua, Fc;
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
    Pe.disabled = !0;
    try {
      const Xe = ka(n, a);
      if ($ === ve)
        R = await eu(a ?? r, Xe), N("LightCriteria | Base lighting updated", {
          lightId: ((ee = a ?? r) == null ? void 0 : ee.id) ?? null,
          configColor: ((ie = Xe == null ? void 0 : Xe.config) == null ? void 0 : ie.color) ?? null
        }), (de = (ue = ui.notifications) == null ? void 0 : ue.info) == null || de.call(
          ue,
          E(
            "EIDOLON.LightCriteria.BaseUpdated",
            "Updated the base lighting state with the current configuration."
          )
        ), X.selectedMapping = ve;
      else {
        const ki = Er(R, $);
        if (!ki) {
          (hn = (lt = ui.notifications) == null ? void 0 : lt.warn) == null || hn.call(
            lt,
            E(
              "EIDOLON.LightCriteria.MappingUnavailable",
              "The selected criteria mapping is no longer available."
            )
          ), X.selectedMapping = "", Ne(X.selectedMapping);
          return;
        }
        R = await tu(
          a ?? r,
          ki.categories,
          Xe,
          { label: ki.label ?? null }
        ), N("LightCriteria | Mapping updated", {
          mappingId: $,
          hasColor: !!((ct = Xe == null ? void 0 : Xe.config) != null && ct.color),
          stored: Array.isArray(R == null ? void 0 : R.mappings) ? ((gn = R.mappings.find((ls) => (ls == null ? void 0 : ls.id) === $)) == null ? void 0 : gn.config) ?? null : null,
          persisted: (pn = (pe = a ?? r) == null ? void 0 : pe.getFlag) == null ? void 0 : pn.call(pe, vi, Ui)
        });
        const sr = Er(R, $), xm = Vi(sr || ki, u, d);
        N("LightCriteria | Mapping updated", {
          mappingId: $,
          categories: ki.categories,
          updatedColor: ((yn = Xe == null ? void 0 : Xe.config) == null ? void 0 : yn.color) ?? null,
          storedColor: ((Kn = (Pt = sr == null ? void 0 : sr.config) == null ? void 0 : Pt.config) == null ? void 0 : Kn.color) ?? ((Ai = (or = ki.config) == null ? void 0 : or.config) == null ? void 0 : Ai.color) ?? null
        }), ($c = (ca = ui.notifications) == null ? void 0 : ca.info) == null || $c.call(
          ca,
          E(
            "EIDOLON.LightCriteria.MappingUpdated",
            "Saved changes to mapping: {label}"
          ).replace("{label}", xm)
        ), X.selectedMapping = $;
      }
      Xn(O, R), Qn({ switcher: x, emptyState: Ke, state: R }), cr(A, {
        state: R,
        hasCategories: l.length > 0
      }), Ne(X.selectedMapping), bt();
    } catch (Xe) {
      console.error("eidolon-utilities | Failed to update light criteria mapping", Xe), (Fc = (ua = ui.notifications) == null ? void 0 : ua.error) == null || Fc.call(
        ua,
        E(
          "EIDOLON.LightCriteria.MappingUpdateError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      Pe.disabled = !1, Es({
        mappingSelect: ae,
        applyMappingButton: Q,
        updateMappingButton: Pe,
        editCriteriaButton: at,
        removeMappingButton: ot,
        actionsMenu: ne,
        state: R
      });
    }
  }, "updateSelectedMapping");
  Pe.addEventListener("click", () => {
    sa();
  }), Ne(X.selectedMapping), I.addEventListener("click", async () => {
    var $, G, Z, ee, ie, ue;
    I.disabled = !0;
    try {
      const de = ka(n, a);
      R = await eu(a ?? r, de), N("LightCriteria | Base lighting stored", {
        lightId: (($ = a ?? r) == null ? void 0 : $.id) ?? null,
        configColor: ((G = de == null ? void 0 : de.config) == null ? void 0 : G.color) ?? null
      }), (ee = (Z = ui.notifications) == null ? void 0 : Z.info) == null || ee.call(
        Z,
        E(
          "EIDOLON.LightCriteria.BaseStored",
          "Saved the current configuration as the base lighting state."
        )
      ), Xn(O, R), Qn({ switcher: x, emptyState: Ke, state: R }), cr(A, {
        state: R,
        hasCategories: l.length > 0
      }), X.selectedMapping = ve, Ne(X.selectedMapping);
    } catch (de) {
      console.error("eidolon-utilities | Failed to store base light criteria state", de), (ue = (ie = ui.notifications) == null ? void 0 : ie.error) == null || ue.call(
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
    const $ = Aa.get(w);
    cu({
      app: n,
      fieldset: w,
      createButton: A,
      creationSection: Ae,
      categoryList: en,
      form: t,
      persistedLight: a,
      stateEntry: $,
      mode: "create",
      mapping: null,
      preloadConfig: R.base
    });
  }), at.addEventListener("click", () => {
    var Z, ee, ie, ue;
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
    const G = Er(R, $);
    if (!G) {
      (ue = (ie = ui.notifications) == null ? void 0 : ie.warn) == null || ue.call(
        ie,
        E(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      );
      return;
    }
    bt(), yf(n, { fieldset: w, homeContainer: i }), cu({
      app: n,
      fieldset: w,
      createButton: A,
      creationSection: Ae,
      categoryList: en,
      form: t,
      persistedLight: a,
      stateEntry: X,
      mode: "retarget",
      mapping: G,
      preloadConfig: G.config
    });
  }), st.addEventListener("click", async () => {
    var G, Z, ee, ie, ue, de, lt, hn, ct, gn;
    const $ = Rp(en);
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
    st.disabled = !0;
    try {
      const pe = ka(n, a);
      if (X.editorMode === "retarget" && X.editingMappingId) {
        const yn = Tl(R, $);
        let Pt = !1;
        if (yn && yn !== X.editingMappingId && (Pt = await bp(), !Pt)) {
          st.disabled = !1;
          return;
        }
        R = await Yh(
          a ?? r,
          X.editingMappingId,
          $,
          pe,
          { replaceExisting: Pt }
        ), N("LightCriteria | Mapping criteria retargeted", {
          mappingId: X.editingMappingId,
          categories: $,
          replaced: Pt,
          configColor: ((ee = pe == null ? void 0 : pe.config) == null ? void 0 : ee.color) ?? null
        }), (ue = (ie = ui.notifications) == null ? void 0 : ie.info) == null || ue.call(
          ie,
          E(
            "EIDOLON.LightCriteria.MappingCriteriaUpdated",
            "Updated mapping criteria for the selected mapping."
          )
        );
      } else
        R = await tu(
          a ?? r,
          $,
          pe,
          {}
        ), N("LightCriteria | Mapping saved from editor", {
          categories: $,
          configColor: ((de = pe == null ? void 0 : pe.config) == null ? void 0 : de.color) ?? null
        }), (hn = (lt = ui.notifications) == null ? void 0 : lt.info) == null || hn.call(
          lt,
          E(
            "EIDOLON.LightCriteria.MappingSaved",
            "Updated lighting mapping for the selected scene criteria."
          )
        );
      Xn(O, R), Qn({ switcher: x, emptyState: Ke, state: R });
      const pn = Tl(R, $);
      pn && (X.selectedMapping = pn), Ne(X.selectedMapping), pa(w, Ae, A), bt();
    } catch (pe) {
      console.error("eidolon-utilities | Failed to persist light criteria mapping", pe), (gn = (ct = ui.notifications) == null ? void 0 : ct.error) == null || gn.call(
        ct,
        E(
          "EIDOLON.LightCriteria.MappingError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      st.disabled = !1;
    }
  }), tn.addEventListener("click", () => {
    const $ = Aa.get(w);
    $ != null && $.restoreConfig && Ma(n, t, $.restoreConfig), pa(w, Ae, A);
  }), ot.addEventListener("click", async () => {
    var Z, ee;
    const $ = X.selectedMapping;
    !$ || $ === ve || !await vp() || (R = await Jh(a ?? r, $), X.selectedMapping = "", Xn(O, R), Qn({ switcher: x, emptyState: Ke, state: R }), Ne(X.selectedMapping), bt(), (ee = (Z = ui.notifications) == null ? void 0 : Z.info) == null || ee.call(
      Z,
      E("EIDOLON.LightCriteria.MappingRemoved", "Removed selected mapping.")
    ));
  });
}
c(yp, "enhanceAmbientLightConfig");
function cu({
  app: n,
  fieldset: e,
  createButton: t,
  creationSection: i,
  categoryList: r,
  form: a,
  persistedLight: o,
  stateEntry: s,
  mode: l,
  mapping: u,
  preloadConfig: d
}) {
  s && (s.restoreConfig = ka(n, o), s.editorMode = l, s.editingMappingId = l === "retarget" ? (u == null ? void 0 : u.id) ?? null : null), d && Ma(n, a, d), l === "retarget" && (u != null && u.categories) ? Pp(r, u.categories) : Dp(r);
  const m = i.querySelector("p.notes");
  m instanceof HTMLElement && (m.textContent = l === "retarget" ? E(
    "EIDOLON.LightCriteria.EditCriteriaDescription",
    "Adjust criteria values for the selected mapping."
  ) : E(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const f = i.querySelector('button[data-action="save-mapping"]');
  f instanceof HTMLButtonElement && (f.textContent = l === "retarget" ? E("EIDOLON.LightCriteria.SaveCriteriaChanges", "Save Criteria Changes") : E("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), i.hidden = !1, t.setAttribute("aria-expanded", "true"), pc(e, i), requestAnimationFrame(() => {
    var g;
    (g = n.setPosition) == null || g.call(n, { height: "auto" });
  });
}
c(cu, "openMappingEditor");
async function bp() {
  var t, i;
  const n = (i = (t = foundry == null ? void 0 : foundry.applications) == null ? void 0 : t.api) == null ? void 0 : i.DialogV2;
  if (typeof (n == null ? void 0 : n.confirm) == "function")
    return n.confirm({
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
c(bp, "confirmCriteriaConflict");
async function vp() {
  var t, i;
  const n = (i = (t = foundry == null ? void 0 : foundry.applications) == null ? void 0 : t.api) == null ? void 0 : i.DialogV2;
  if (typeof (n == null ? void 0 : n.confirm) == "function")
    return n.confirm({
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
c(vp, "confirmRemoveMapping");
function wp(n, { fieldset: e, homeContainer: t }) {
  const i = Sp(n, t);
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
    o.preventDefault(), yf(n, { fieldset: e, homeContainer: t });
  };
}
c(wp, "ensureManagerHeaderButton");
function yf(n, { fieldset: e, homeContainer: t }) {
  var f, g, p;
  const i = ga.get(n);
  if (i != null && i.rendered) {
    (f = i.bringToTop) == null || f.call(i);
    return;
  }
  const r = /* @__PURE__ */ c((...y) => {
    var v;
    const w = Ep(y), b = (v = w == null ? void 0 : w.querySelector) == null ? void 0 : v.call(w, ".eidolon-light-criteria-manager-host");
    b instanceof HTMLElement && (Cp(e), e.hidden = !1, b.appendChild(e));
  }, "onRender"), a = /* @__PURE__ */ c(() => {
    t instanceof HTMLElement && t.appendChild(e), e.hidden = !0, ga.delete(n), requestAnimationFrame(() => {
      var y;
      (y = n.setPosition) == null || y.call(n, { height: "auto" });
    });
  }, "onClose"), o = E("EIDOLON.LightCriteria.ManagerTitle", "Scene Criteria Lighting"), s = '<div class="eidolon-light-criteria-manager-host"></div>', l = E("EIDOLON.LightCriteria.Close", "Close"), u = (p = (g = foundry == null ? void 0 : foundry.applications) == null ? void 0 : g.api) == null ? void 0 : p.DialogV2;
  if (typeof (u == null ? void 0 : u.wait) == "function")
    try {
      let y = !1;
      const w = /* @__PURE__ */ c(() => {
        y || (y = !0, a());
      }, "closeOnce");
      ga.set(n, {
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
  ga.set(n, m), m.render(!0);
}
c(yf, "openManagerDialog");
function Ep(n) {
  for (const e of n) {
    const t = Kt(e);
    if (t) return t;
    const i = Kt(e == null ? void 0 : e.element);
    if (i) return i;
  }
  return null;
}
c(Ep, "findDialogRoot");
function Cp(n) {
  if (!(n instanceof HTMLElement) || n.dataset.managerLayout === "true") return;
  n.dataset.managerLayout = "true", n.classList.add("is-manager");
  const e = n.querySelector("legend"), t = n.querySelector("p.notes:not(.eidolon-light-criteria__status)"), i = n.querySelector(".eidolon-light-criteria__controls"), r = n.querySelector(".eidolon-light-criteria__status"), a = n.querySelector(".eidolon-light-criteria__creation"), o = Array.from(n.querySelectorAll(".eidolon-light-criteria__warning")), s = document.createElement("div");
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
  m.classList.add("eidolon-light-criteria-manager__header"), m.textContent = E("EIDOLON.LightCriteria.ManagerAuthoring", "Create or Update Mapping"), u.appendChild(m), a && u.appendChild(a), n.innerHTML = "", e && n.appendChild(e), t && n.appendChild(t), n.appendChild(s), pc(n, a);
}
c(Cp, "applyManagerLayout");
function Sp(n, e) {
  var i;
  const t = Kt(n == null ? void 0 : n.element);
  return t || (((i = e == null ? void 0 : e.closest) == null ? void 0 : i.call(e, ".application")) ?? null);
}
c(Sp, "resolveApplicationRoot");
function pa(n, e, t) {
  const i = Aa.get(n);
  i && (i.restoreConfig = null, i.editorMode = "create", i.editingMappingId = null), e.hidden = !0, t.setAttribute("aria-expanded", "false");
  const r = e.querySelector("p.notes");
  r instanceof HTMLElement && (r.textContent = E(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const a = e.querySelector('button[data-action="save-mapping"]');
  a instanceof HTMLButtonElement && (a.textContent = E("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), pc(n, e), requestAnimationFrame(() => {
    var o, s;
    (s = (o = i == null ? void 0 : i.app) == null ? void 0 : o.setPosition) == null || s.call(o, { height: "auto" });
  });
}
c(pa, "hideCreationSection");
function Xn(n, e) {
  if (!n) return;
  const t = !!(e != null && e.base), i = Array.isArray(e == null ? void 0 : e.mappings) ? e.mappings.length : 0, r = [];
  r.push(
    t ? E(
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
  ), n.textContent = r.join(" ");
}
c(Xn, "updateStatusLine");
function cr(n, { state: e, hasCategories: t }) {
  if (!n) return;
  const i = !!(e != null && e.base), r = i && t;
  n.disabled = !r, n.title = r ? "" : i ? E(
    "EIDOLON.LightCriteria.CreateDisabledNoCategories",
    "Add scene criteria with values before creating mappings."
  ) : E(
    "EIDOLON.LightCriteria.CreateDisabledNoBase",
    "Save a base lighting state before creating criteria mappings."
  );
}
c(cr, "updateCreateButtonState");
function ka(n, e) {
  var l, u, d;
  const t = e ?? bf(n);
  if (!t)
    throw new Error("Ambient light document unavailable.");
  const i = Ti(((l = t.toObject) == null ? void 0 : l.call(t)) ?? {});
  if (!i)
    throw new Error("Unable to duplicate ambient light data.");
  const r = (n == null ? void 0 : n.form) instanceof HTMLFormElement ? n.form : null, a = r ? oh(r) : {}, o = foundry.utils.mergeObject(i, a, {
    inplace: !1,
    performDeletions: !0
  });
  r && (r.querySelectorAll("color-picker[name]").forEach((m) => {
    var b, v;
    const f = m.getAttribute("name");
    if (!f) return;
    const g = typeof m.value == "string" ? m.value : "", p = ((b = m.ui) == null ? void 0 : b.input) ?? ((v = m.querySelector) == null ? void 0 : v.call(m, 'input[type="color"]')), y = (p == null ? void 0 : p.value) ?? "", w = g || y;
    typeof w != "string" || !w || (foundry.utils.setProperty(o, f, w), N("LightCriteria | Captured color-picker value", {
      path: f,
      pickerValue: g,
      swatchValue: y,
      chosenValue: w
    }));
  }), r.querySelectorAll("range-picker[name]").forEach((m) => {
    var A, O;
    const f = m.getAttribute("name");
    if (!f) return;
    const g = m.value !== void 0 && m.value !== null ? String(m.value) : "", p = (A = m.querySelector) == null ? void 0 : A.call(m, 'input[type="range"]'), y = (O = m.querySelector) == null ? void 0 : O.call(m, 'input[type="number"]'), w = p instanceof HTMLInputElement ? p.value : "", b = y instanceof HTMLInputElement ? y.value : "", v = g || b || w;
    if (typeof v != "string" || !v.length) return;
    const S = Number(v), I = Number.isFinite(S) ? S : v;
    foundry.utils.setProperty(o, f, I), N("LightCriteria | Captured range-picker value", {
      path: f,
      elementValue: g,
      numberValue: b,
      rangeValue: w,
      chosenValue: I
    });
  }));
  const s = Ti(o);
  return N("LightCriteria | Captured form config", {
    lightId: (t == null ? void 0 : t.id) ?? null,
    hasColor: !!((u = s == null ? void 0 : s.config) != null && u.color),
    color: ((d = s == null ? void 0 : s.config) == null ? void 0 : d.color) ?? null
  }), s;
}
c(ka, "captureAmbientLightFormConfig");
function Ma(n, e, t) {
  if (!t || typeof t != "object") return;
  const i = foundry.utils.flattenObject(t, { safe: !0 });
  for (const [r, a] of Object.entries(i)) {
    const o = e.querySelectorAll(`[name="${r}"]`);
    if (o.length) {
      N("LightCriteria | Applying field", {
        path: r,
        value: a,
        elementCount: o.length
      });
      for (const s of o)
        s instanceof HTMLElement && s.tagName === "COLOR-PICKER" ? Lp(s, a) : s instanceof HTMLElement && s.tagName === "RANGE-PICKER" ? Ip(s, a) : s instanceof HTMLInputElement ? Tp(s, a) : s instanceof HTMLSelectElement ? Op(s, a) : s instanceof HTMLTextAreaElement && Ap(s, a);
    }
  }
  requestAnimationFrame(() => {
    var r;
    return (r = n._previewChanges) == null ? void 0 : r.call(n);
  });
}
c(Ma, "applyConfigToForm");
function Tp(n, e, t) {
  const i = n.type;
  if (i === "checkbox") {
    const o = !!e;
    n.checked !== o && (n.checked = o, Ft(n));
    return;
  }
  if (i === "radio") {
    const o = e == null ? "" : String(e), s = n.value === o;
    n.checked !== s && (n.checked = s, s && Ft(n));
    return;
  }
  const r = e == null ? "" : String(e);
  let a = !1;
  n.value !== r && (n.value = r, a = !0), a && Ft(n);
}
c(Tp, "applyValueToInput");
function Lp(n, e, t) {
  var s, l, u, d, m, f;
  const i = e == null ? "" : String(e);
  let r = !1;
  n.value !== i && (n.value = i, n.setAttribute("value", i), (s = n.ui) != null && s.setValue && n.ui.setValue(i), r = !0);
  const a = ((l = n.ui) == null ? void 0 : l.input) ?? ((u = n.querySelector) == null ? void 0 : u.call(n, 'input[type="color"]'));
  a instanceof HTMLInputElement && a.value !== i && (a.value = i, Ft(a));
  const o = ((d = n.ui) == null ? void 0 : d.text) ?? ((m = n.querySelector) == null ? void 0 : m.call(n, 'input[type="text"]'));
  o instanceof HTMLInputElement && o.value !== i && (o.value = i, Ft(o)), (f = n.ui) != null && f.commit ? n.ui.commit() : (n.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), n.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }))), N("LightCriteria | Color picker applied", {
    value: i,
    pickerValue: n.value ?? null,
    swatchValue: (a == null ? void 0 : a.value) ?? null,
    textValue: (o == null ? void 0 : o.value) ?? null
  }), r && Ft(n);
}
c(Lp, "applyValueToColorPicker");
function Ip(n, e, t) {
  var u, d;
  const i = e == null ? "" : String(e), r = Number(i), a = Number.isFinite(r) ? r : i;
  let o = !1;
  n.value !== void 0 && n.value !== a && (n.value = a, o = !0), n.getAttribute("value") !== i && (n.setAttribute("value", i), o = !0);
  const s = (u = n.querySelector) == null ? void 0 : u.call(n, 'input[type="range"]');
  s instanceof HTMLInputElement && s.value !== i && (s.value = i, Ft(s));
  const l = (d = n.querySelector) == null ? void 0 : d.call(n, 'input[type="number"]');
  if (l instanceof HTMLInputElement && l.value !== i && (l.value = i, Ft(l)), typeof n.commit == "function")
    try {
      n.commit();
    } catch (m) {
      console.error("eidolon-utilities | range-picker commit failed", m);
    }
  N("LightCriteria | Range picker applied", {
    value: i,
    resolvedValue: a,
    rangeValue: (s == null ? void 0 : s.value) ?? null,
    numberValue: (l == null ? void 0 : l.value) ?? null
  }), o && Ft(n);
}
c(Ip, "applyValueToRangePicker");
function Op(n, e, t) {
  const i = e == null ? "" : String(e);
  n.value !== i && (n.value = i, Ft(n));
}
c(Op, "applyValueToSelect");
function Ap(n, e, t) {
  const i = e == null ? "" : String(e);
  n.value !== i && (n.value = i, Ft(n));
}
c(Ap, "applyValueToTextarea");
function Ft(n) {
  n.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), n.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }));
}
c(Ft, "triggerInputChange");
function Es({
  mappingSelect: n,
  applyMappingButton: e,
  updateMappingButton: t,
  editCriteriaButton: i,
  removeMappingButton: r,
  actionsMenu: a,
  state: o
}) {
  const s = (n == null ? void 0 : n.value) ?? "", l = !!(o != null && o.base), u = s && s !== ve ? !!Er(o, s) : !1;
  if (e instanceof HTMLButtonElement && (s ? s === ve ? e.disabled = !l : e.disabled = !u : e.disabled = !0), t instanceof HTMLButtonElement && (s ? s === ve ? t.disabled = !1 : t.disabled = !u : t.disabled = !0), i instanceof HTMLButtonElement && (i.disabled = !s || s === ve || !u), r instanceof HTMLButtonElement && (r.disabled = !s || s === ve || !u), a instanceof HTMLElement) {
    const d = t instanceof HTMLButtonElement && !t.disabled || i instanceof HTMLButtonElement && !i.disabled || r instanceof HTMLButtonElement && !r.disabled;
    a.classList.toggle("is-disabled", !d), !d && "open" in a && (a.open = !1);
  }
}
c(Es, "syncMappingSwitcherState");
function kp(n) {
  const e = /* @__PURE__ */ new Map();
  for (const t of n) {
    if (!t) continue;
    const i = typeof t.id == "string" ? t.id : null;
    if (!i) continue;
    const r = typeof t.name == "string" && t.name.trim() ? t.name.trim() : E("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category");
    e.has(i) || e.set(i, r);
  }
  return e;
}
c(kp, "buildCategoryNameLookup");
function Mp(n) {
  const e = {};
  return n instanceof HTMLElement && n.querySelectorAll("select[data-filter-category-id]").forEach((t) => {
    var a, o;
    const i = t.dataset.filterCategoryId, r = (o = (a = t.value) == null ? void 0 : a.trim) == null ? void 0 : o.call(a);
    !i || !r || (e[i] = r);
  }), e;
}
c(Mp, "readMappingFilterSelections");
function _p(n) {
  n instanceof HTMLElement && n.querySelectorAll("select[data-filter-category-id]").forEach((e) => {
    e.value = "";
  });
}
c(_p, "resetMappingFilterSelections");
function Np(n, e) {
  const t = Array.isArray(n) ? n : [], i = Object.entries(e ?? {}).filter(([, r]) => !!r);
  return i.length ? t.filter((r) => {
    if (!r || typeof r != "object") return !1;
    const a = r.categories ?? {};
    for (const [o, s] of i)
      if ((a == null ? void 0 : a[o]) !== s) return !1;
    return !0;
  }) : t.slice();
}
c(Np, "filterMappingsByCriteria");
function xp(n, { totalCount: e = 0, visibleCount: t = 0, hasFilters: i = !1, activeFilterCount: r = 0 } = {}) {
  if (!(n instanceof HTMLElement)) return;
  if (!i) {
    n.textContent = E(
      "EIDOLON.LightCriteria.FilterSummaryAll",
      "All ({count})"
    ).replace("{count}", String(e));
    return;
  }
  const a = E(
    "EIDOLON.LightCriteria.FilterSummaryActive",
    "{active} filters · {visible}/{total}"
  ).replace("{active}", String(r)).replace("{visible}", String(t)).replace("{total}", String(e));
  n.textContent = a;
}
c(xp, "updateMappingFilterMeta");
function $p(n, e, t, i, r = {}) {
  if (!(n instanceof HTMLSelectElement)) return;
  const a = typeof i == "string" ? i : "", o = !!(e != null && e.base), s = Array.isArray(r == null ? void 0 : r.categoryOrder) ? r.categoryOrder : [], l = Array.isArray(r == null ? void 0 : r.mappings) ? r.mappings.slice() : Array.isArray(e == null ? void 0 : e.mappings) ? e.mappings.slice() : [], u = n.value;
  n.innerHTML = "";
  const d = document.createElement("option");
  d.value = "", d.textContent = E(
    "EIDOLON.LightCriteria.SelectPlaceholder",
    "Select a mapping"
  ), d.disabled = o, n.appendChild(d);
  const m = document.createElement("option");
  m.value = ve, m.textContent = E(
    "EIDOLON.LightCriteria.BaseOption",
    "Base Lighting"
  ), m.disabled = !o, n.appendChild(m), l.slice().sort((y, w) => {
    var S;
    const b = Vi(y, t, s), v = Vi(w, t, s);
    return b.localeCompare(v, ((S = game.i18n) == null ? void 0 : S.lang) ?? void 0, {
      sensitivity: "base"
    });
  }).forEach((y) => {
    if (!(y != null && y.id)) return;
    const w = document.createElement("option");
    w.value = y.id, w.textContent = Vi(y, t, s), n.appendChild(w);
  });
  const f = new Set(
    Array.from(n.options).filter((y) => !y.disabled).map((y) => y.value)
  ), g = o && u === "" ? "" : u, p = a || (f.has(g) ? g : "");
  p && f.has(p) ? n.value = p : o ? n.value = ve : n.value = "";
}
c($p, "populateMappingSelector");
function Vi(n, e, t = []) {
  if (!n || typeof n != "object")
    return E("EIDOLON.LightCriteria.UnnamedMapping", "Unnamed Mapping");
  if (typeof n.label == "string" && n.label.trim())
    return n.label.trim();
  const i = n.categories ?? {}, r = [], a = /* @__PURE__ */ new Set();
  for (const s of t)
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
c(Vi, "formatMappingOptionLabel");
function Tl(n, e) {
  if (!n || typeof n != "object" || !Array.isArray(n.mappings)) return null;
  const t = nr(e);
  if (!t) return null;
  const i = n.mappings.find((r) => (r == null ? void 0 : r.key) === t);
  return (i == null ? void 0 : i.id) ?? null;
}
c(Tl, "findMappingIdByCategories");
function Er(n, e) {
  return !e || !n || typeof n != "object" || !Array.isArray(n.mappings) ? null : n.mappings.find((t) => (t == null ? void 0 : t.id) === e) ?? null;
}
c(Er, "getMappingById");
function Fp(n) {
  if (!n || typeof n != "object") return "";
  const e = n.current;
  if (e != null && e.mappingId) {
    if (e.mappingId === ve)
      return n != null && n.base ? ve : "";
    if (Array.isArray(n.mappings) && n.mappings.some((t) => t.id === e.mappingId))
      return e.mappingId;
  }
  if (e != null && e.categories) {
    const t = Tl(n, e.categories);
    if (t) return t;
  }
  return "";
}
c(Fp, "resolveInitialMappingSelection");
function uu(n, e = {}) {
  var o, s, l, u;
  if (!(n instanceof HTMLFormElement)) return;
  const t = n.querySelector('color-picker[name="config.color"]'), i = (t == null ? void 0 : t.value) ?? null, r = ((o = t == null ? void 0 : t.ui) == null ? void 0 : o.text) ?? ((s = t == null ? void 0 : t.querySelector) == null ? void 0 : s.call(t, 'input[type="text"]')), a = ((l = t == null ? void 0 : t.ui) == null ? void 0 : l.input) ?? ((u = t == null ? void 0 : t.querySelector) == null ? void 0 : u.call(t, 'input[type="color"]'));
  N("LightCriteria | Color state after apply", {
    ...e,
    textValue: (r == null ? void 0 : r.value) ?? null,
    pickerValue: i,
    swatchValue: (a == null ? void 0 : a.value) ?? null
  });
}
c(uu, "logAppliedColorState");
function Dp(n) {
  n.querySelectorAll("select[data-category-id]").forEach((e) => {
    e.value = "";
  });
}
c(Dp, "resetCategorySelections");
function Pp(n, e) {
  const t = e && typeof e == "object" ? e : {};
  n.querySelectorAll("select[data-category-id]").forEach((i) => {
    const r = i.dataset.categoryId;
    if (!r) return;
    const a = t[r];
    i.value = typeof a == "string" ? a : "";
  });
}
c(Pp, "setCategorySelections");
function Rp(n) {
  const e = {};
  return n.querySelectorAll("select[data-category-id]").forEach((t) => {
    var a, o;
    const i = t.dataset.categoryId, r = (o = (a = t.value) == null ? void 0 : a.trim) == null ? void 0 : o.call(a);
    !i || !r || (e[i] = r);
  }), Object.keys(e).length > 0 ? e : null;
}
c(Rp, "readCategorySelections");
async function Cs(n, e, t) {
  if (!n) return null;
  try {
    if (!t)
      return await wr(n, {});
    if (t === ve)
      return await wr(n, {
        mappingId: ve,
        categories: null,
        updatedAt: Date.now()
      });
    const i = Er(e, t);
    return i ? await wr(n, {
      mappingId: i.id,
      categories: i.categories,
      updatedAt: Date.now()
    }) : null;
  } catch (i) {
    return console.warn("eidolon-utilities | Failed to persist mapping selection", i), null;
  }
}
c(Cs, "persistCurrentSelection");
function pc(n, e) {
  if (!(n instanceof HTMLElement)) return;
  const t = n.querySelector(".eidolon-light-criteria-manager__section.is-bottom");
  t instanceof HTMLElement && (t.hidden = !!(e != null && e.hidden));
}
c(pc, "updateManagerSectionVisibility");
function Qn({ switcher: n, emptyState: e, state: t }) {
  const i = !!(t != null && t.base);
  n instanceof HTMLElement && (n.hidden = !i), e instanceof HTMLElement && (e.hidden = i);
}
c(Qn, "updateActiveMappingVisibility");
function bf(n) {
  const e = (n == null ? void 0 : n.object) ?? (n == null ? void 0 : n.document) ?? null;
  return !(e != null && e.isEmbedded) || e.documentName !== "AmbientLight" ? null : e;
}
c(bf, "getAmbientLightDocument");
function Hp(n) {
  if (!(n != null && n.isEmbedded)) return null;
  const e = n.parent ?? null;
  if (!e) return n;
  if (typeof e.getEmbeddedDocument == "function") {
    const i = e.getEmbeddedDocument(n.documentName, n.id);
    if (i) return i;
  }
  const t = e.lights;
  if (t != null && t.get) {
    const i = t.get(n.id);
    if (i) return i;
  }
  return n;
}
c(Hp, "getPersistedAmbientLightDocument");
function qp() {
  gp();
}
c(qp, "registerLightCriteriaHooks");
qp();
const Ll = /* @__PURE__ */ new Map();
let Il = !1;
function yc(n, e) {
  Ll.has(n) && console.warn(`[${T}] Socket handler for type "${n}" already registered, overwriting.`), Ll.set(n, e);
}
c(yc, "registerSocketHandler");
function _a(n, e) {
  if (!Il) {
    console.error(`[${T}] Socket not initialized. Call initializeSocket() first.`);
    return;
  }
  game.socket.emit(`module.${T}`, { type: n, payload: e });
}
c(_a, "emitSocket");
function jp() {
  Il || (game.socket.on(`module.${T}`, (n) => {
    const { type: e, payload: t } = n ?? {}, i = Ll.get(e);
    i ? i(t) : console.warn(`[${T}] No socket handler for type "${e}"`);
  }), Il = !0, console.log(`[${T}] Socket initialized on channel module.${T}`));
}
c(jp, "initializeSocket");
const vf = "tween", wf = "tween-sequence", Ol = "tween-sequence-cancel", Ie = Object.freeze({
  ABORT: "abort",
  CONTINUE: "continue"
}), bn = Object.freeze({
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
}), Qa = /* @__PURE__ */ new Map();
function Dt({ type: n, execute: e, validate: t }) {
  Qa.has(n) && console.warn(`[tween-registry] Type "${n}" already registered, overwriting.`), Qa.set(n, { type: n, execute: e, validate: t ?? (() => {
  }) });
}
c(Dt, "registerTweenType");
function ir(n) {
  return Qa.get(n);
}
c(ir, "getTweenType");
function Bp(n, e = {}) {
  const t = ir(n);
  if (!t)
    throw new Error(`Unknown tween type: "${n}".`);
  return t.validate(e ?? {}), t;
}
c(Bp, "validateTweenEntry");
function Al() {
  return [...Qa.keys()];
}
c(Al, "listTweenTypes");
const zi = {
  easeInQuad: /* @__PURE__ */ c((n) => n * n, "easeInQuad"),
  easeOutQuad: /* @__PURE__ */ c((n) => n * (2 - n), "easeOutQuad"),
  easeInOutQuad: /* @__PURE__ */ c((n) => n < 0.5 ? 2 * n * n : -1 + (4 - 2 * n) * n, "easeInOutQuad"),
  easeInCubic: /* @__PURE__ */ c((n) => n * n * n, "easeInCubic"),
  easeOutCubic: /* @__PURE__ */ c((n) => {
    const e = n - 1;
    return e * e * e + 1;
  }, "easeOutCubic"),
  easeInOutCubic: /* @__PURE__ */ c((n) => n < 0.5 ? 4 * n * n * n : (n - 1) * (2 * n - 2) * (2 * n - 2) + 1, "easeInOutCubic"),
  easeOutBounce: /* @__PURE__ */ c((n) => {
    if (n < 1 / 2.75) return 7.5625 * n * n;
    if (n < 2 / 2.75) {
      const t = n - 0.5454545454545454;
      return 7.5625 * t * t + 0.75;
    }
    if (n < 2.5 / 2.75) {
      const t = n - 0.8181818181818182;
      return 7.5625 * t * t + 0.9375;
    }
    const e = n - 2.625 / 2.75;
    return 7.5625 * e * e + 0.984375;
  }, "easeOutBounce"),
  easeInBounce: /* @__PURE__ */ c((n) => 1 - zi.easeOutBounce(1 - n), "easeInBounce"),
  easeInOutBounce: /* @__PURE__ */ c((n) => n < 0.5 ? (1 - zi.easeOutBounce(1 - 2 * n)) / 2 : (1 + zi.easeOutBounce(2 * n - 1)) / 2, "easeInOutBounce"),
  easeInElastic: /* @__PURE__ */ c((n) => n === 0 || n === 1 ? n : -Math.pow(2, 10 * (n - 1)) * Math.sin((n - 1.1) * 5 * Math.PI), "easeInElastic"),
  easeOutElastic: /* @__PURE__ */ c((n) => n === 0 || n === 1 ? n : Math.pow(2, -10 * n) * Math.sin((n - 0.1) * 5 * Math.PI) + 1, "easeOutElastic")
};
function rt(n) {
  if (n && zi[n])
    return zi[n];
  const e = foundry.canvas.animation.CanvasAnimation;
  return {
    linear: e.easeLinear,
    easeInOutCosine: e.easeInOutCosine
  }[n] ?? e.easeInOutCosine;
}
c(rt, "resolveEasing");
function bc() {
  return ["linear", "easeInOutCosine", ...Object.keys(zi)];
}
c(bc, "listEasingNames");
function Za(n) {
  return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
}
c(Za, "srgbToLinear");
function Gi(n) {
  return n <= 31308e-7 ? 12.92 * n : 1.055 * n ** (1 / 2.4) - 0.055;
}
c(Gi, "linearToSrgb");
function du(n, e, t) {
  const i = 0.4122214708 * n + 0.5363325363 * e + 0.0514459929 * t, r = 0.2119034982 * n + 0.6806995451 * e + 0.1073969566 * t, a = 0.0883024619 * n + 0.2817188376 * e + 0.6299787005 * t, o = Math.cbrt(i), s = Math.cbrt(r), l = Math.cbrt(a);
  return [
    0.2104542553 * o + 0.793617785 * s - 0.0040720468 * l,
    1.9779984951 * o - 2.428592205 * s + 0.4505937099 * l,
    0.0259040371 * o + 0.7827717662 * s - 0.808675766 * l
  ];
}
c(du, "linearRgbToOklab");
function Up(n, e, t) {
  const i = (n + 0.3963377774 * e + 0.2158037573 * t) ** 3, r = (n - 0.1055613458 * e - 0.0638541728 * t) ** 3, a = (n - 0.0894841775 * e - 1.291485548 * t) ** 3;
  return [
    4.0767416621 * i - 3.3077115913 * r + 0.2309699292 * a,
    -1.2684380046 * i + 2.6097574011 * r - 0.3413193965 * a,
    -0.0041960863 * i - 0.7034186147 * r + 1.707614701 * a
  ];
}
c(Up, "oklabToLinearRgb");
function eo(n) {
  return [n.r, n.g, n.b];
}
c(eo, "colorToRgb");
function Ef(n, e, t) {
  const i = /* @__PURE__ */ c((a) => Math.max(0, Math.min(1, a)), "clamp"), r = /* @__PURE__ */ c((a) => Math.round(i(a) * 255).toString(16).padStart(2, "0"), "toHex");
  return `#${r(n)}${r(e)}${r(t)}`;
}
c(Ef, "rgbToHex");
function Vp(n, e, t) {
  if (t <= 0) return n.toHTML();
  if (t >= 1) return e.toHTML();
  const i = foundry.utils.Color, [r, a, o] = n.hsl, [s, l, u] = e.hsl, d = (s - r + 0.5) % 1 - 0.5, m = (r + d * t + 1) % 1, f = a + (l - a) * t, g = o + (u - o) * t;
  return i.fromHSL([m, f, g]).toHTML();
}
c(Vp, "interpolateHsl");
function zp(n, e, t) {
  if (t <= 0) return n.toHTML();
  if (t >= 1) return e.toHTML();
  const [i, r, a] = eo(n).map(Za), [o, s, l] = eo(e).map(Za), u = Gi(i + (o - i) * t), d = Gi(r + (s - r) * t), m = Gi(a + (l - a) * t);
  return Ef(u, d, m);
}
c(zp, "interpolateRgb");
function Gp(n, e, t) {
  if (t <= 0) return n.toHTML();
  if (t >= 1) return e.toHTML();
  const [i, r, a] = eo(n).map(Za), [o, s, l] = eo(e).map(Za), [u, d, m] = du(i, r, a), [f, g, p] = du(o, s, l), y = 0.02, w = Math.sqrt(d * d + m * m), b = Math.sqrt(g * g + p * p);
  let v, S, I;
  if (w < y || b < y)
    v = u + (f - u) * t, S = d + (g - d) * t, I = m + (p - m) * t;
  else {
    const M = Math.atan2(m, d);
    let F = Math.atan2(p, g) - M;
    F > Math.PI && (F -= 2 * Math.PI), F < -Math.PI && (F += 2 * Math.PI), v = u + (f - u) * t;
    const P = w + (b - w) * t, _ = M + F * t;
    S = P * Math.cos(_), I = P * Math.sin(_);
  }
  const [A, O, x] = Up(v, S, I);
  return Ef(Gi(A), Gi(O), Gi(x));
}
c(Gp, "interpolateOklch");
const kl = {
  hsl: Vp,
  rgb: zp,
  oklch: Gp
};
function vc(n = "hsl") {
  return kl[n] ?? kl.hsl;
}
c(vc, "getInterpolator");
function Qi() {
  return Object.keys(kl);
}
c(Qi, "listInterpolationModes");
function Wp(n) {
  if ((Array.isArray(n.uuid) ? n.uuid : [n.uuid]).some((t) => !t || typeof t != "string"))
    throw new Error("light-color tween: 'uuid' is required (string or array of AmbientLight document UUIDs).");
  if (n.toColor == null && n.toAlpha == null)
    throw new Error("light-color tween: at least one of 'toColor' or 'toAlpha' is required.");
  if (n.toColor != null) {
    if (typeof n.toColor != "string")
      throw new Error("light-color tween: 'toColor' must be a CSS color string.");
    if (!foundry.utils.Color.fromString(n.toColor).valid)
      throw new Error(`light-color tween: invalid target color "${n.toColor}".`);
  }
  if (n.toAlpha != null && (typeof n.toAlpha != "number" || n.toAlpha < 0 || n.toAlpha > 1))
    throw new Error("light-color tween: 'toAlpha' must be a number between 0 and 1.");
  if (n.mode && !Qi().includes(n.mode))
    throw new Error(
      `light-color tween: unknown mode "${n.mode}". Available: ${Qi().join(", ")}`
    );
}
c(Wp, "validate$7");
async function Yp(n, e = {}) {
  const { CanvasAnimation: t } = foundry.canvas.animation, { Color: i } = foundry.utils, { uuid: r, toColor: a, toAlpha: o, mode: s = "oklch" } = n, l = Array.isArray(r) ? r : [r];
  if (l.length === 0)
    return console.warn("light-color tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: u = 2e3,
    easing: d = "easeInOutCosine",
    commit: m = !0,
    startEpochMS: f = null,
    signal: g = null
  } = e, p = rt(d), y = a != null, w = o != null, b = y ? vc(s) : null, v = y ? i.fromString(a) : null;
  if (y && !v.valid) throw new Error(`light-color tween: invalid target color "${a}".`);
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
    const D = w ? ((B = O._source.config) == null ? void 0 : B.alpha) ?? 0.5 : null, F = { t: 0 }, P = `ambient-hue-tween:${A}`;
    t.terminateAnimation(P), g && g.addEventListener("abort", () => {
      t.terminateAnimation(P);
    }, { once: !0 });
    const _ = typeof f == "number" ? Math.max(0, Math.min(u, Date.now() - f)) : 0, H = /* @__PURE__ */ c((V) => {
      const J = {};
      y && (J.color = b(M, v, V)), w && (J.alpha = D + (o - D) * V), O.updateSource({ config: J }), x.initializeLightSource();
    }, "applyFrame");
    _ > 0 && (F.t = _ / u, H(F.t));
    const q = await t.animate(
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
      y && (V.color = v.toHTML()), w && (V.alpha = o), O.updateSource({ config: V }), x.initializeLightSource();
    }
    if (m && q !== !1 && O.canUserModify(game.user, "update")) {
      if (g != null && g.aborted) return !1;
      const V = {}, J = {};
      y && (V.color = M.toHTML(), J["config.color"] = v.toHTML()), w && (V.alpha = D, J["config.alpha"] = o), O.updateSource({ config: V }), await O.update(J);
    }
    return q !== !1;
  }
  return c(S, "animateOne"), (await Promise.all(l.map(S))).every(Boolean);
}
c(Yp, "execute$7");
function Jp() {
  Dt({ type: "light-color", execute: Yp, validate: Wp });
}
c(Jp, "registerLightColorTween");
const vn = /* @__PURE__ */ new WeakMap();
function Kp(n) {
  if ((Array.isArray(n.uuid) ? n.uuid : [n.uuid]).some((t) => !t || typeof t != "string"))
    throw new Error("light-state tween: 'uuid' is required (string or array of AmbientLight document UUIDs).");
  if (typeof n.enabled != "boolean")
    throw new Error("light-state tween: 'enabled' (boolean) is required.");
}
c(Kp, "validate$6");
async function Xp(n, e = {}) {
  const { CanvasAnimation: t } = foundry.canvas.animation, { uuid: i, enabled: r } = n, a = Array.isArray(i) ? i : [i];
  if (a.length === 0)
    return console.warn("light-state tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: o = 2e3,
    easing: s = "easeInOutCosine",
    commit: l = !0,
    startEpochMS: u = null,
    signal: d = null
  } = e, m = rt(s);
  async function f(p) {
    var O, x, M, D;
    if (d != null && d.aborted) return !1;
    const y = await fromUuid(p);
    if (!y) return !1;
    const w = y.object;
    if (!w) return !1;
    const b = `ambient-state-tween:${p}`;
    t.terminateAnimation(b), d && d.addEventListener("abort", () => {
      t.terminateAnimation(b);
    }, { once: !0 });
    const v = vn.get(y) ?? {
      hidden: y._source.hidden,
      alpha: ((O = y._source.config) == null ? void 0 : O.alpha) ?? 0.5
    };
    if (vn.set(y, v), N(`light-state START ${r ? "ON" : "OFF"} | snap: ${JSON.stringify(v)} | _source.hidden=${y._source.hidden}, _source.config.alpha=${(x = y._source.config) == null ? void 0 : x.alpha}`), r && !v.hidden || !r && v.hidden)
      return vn.delete(y), !0;
    const S = v.alpha, I = typeof u == "number" ? Math.max(0, Math.min(o, Date.now() - u)) : 0, A = /* @__PURE__ */ c((F) => {
      y.updateSource({ config: { alpha: F } }), w.initializeLightSource();
    }, "applyAlpha");
    if (r) {
      y.updateSource({ hidden: !1, config: { alpha: 0 } }), w.initializeLightSource(), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
      const F = { t: 0 };
      I > 0 && (F.t = I / o, A(S * F.t));
      const P = await t.animate(
        [{ parent: F, attribute: "t", to: 1 }],
        {
          name: b,
          duration: o,
          easing: m,
          time: I,
          ontick: /* @__PURE__ */ c(() => A(S * F.t), "ontick")
        }
      );
      return P !== !1 && !(d != null && d.aborted) && l && y.canUserModify(game.user, "update") ? (y.updateSource({ hidden: !0, config: { alpha: S } }), await y.update({ hidden: !1 }), N(`light-state FADE-IN committed. _source.hidden=${y._source.hidden}, _source.config.alpha=${(M = y._source.config) == null ? void 0 : M.alpha}`), vn.delete(y)) : P === !1 || vn.delete(y), P !== !1;
    } else {
      y.updateSource({ hidden: !1, config: { alpha: v.alpha } }), w.initializeLightSource();
      const F = { t: 0 };
      I > 0 && (F.t = I / o, A(S * (1 - F.t)));
      const P = await t.animate(
        [{ parent: F, attribute: "t", to: 1 }],
        {
          name: b,
          duration: o,
          easing: m,
          time: I,
          ontick: /* @__PURE__ */ c(() => A(S * (1 - F.t)), "ontick")
        }
      );
      return P !== !1 && !(d != null && d.aborted) && l && y.canUserModify(game.user, "update") ? (await y.update({ hidden: !0 }), y.updateSource({ config: { alpha: S } }), w.initializeLightSource(), N(`light-state FADE-OUT committed+restored. _source.hidden=${y._source.hidden}, _source.config.alpha=${(D = y._source.config) == null ? void 0 : D.alpha}`), vn.delete(y)) : P === !1 || (y.updateSource({ hidden: !0, config: { alpha: S } }), w.initializeLightSource(), vn.delete(y)), P !== !1;
    }
  }
  return c(f, "animateOne"), (await Promise.all(a.map(f))).every(Boolean);
}
c(Xp, "execute$6");
function Qp() {
  Dt({ type: "light-state", execute: Xp, validate: Kp });
}
c(Qp, "registerLightStateTween");
function es(n) {
  if ((Array.isArray(n.uuid) ? n.uuid : [n.uuid]).some((t) => !t || typeof t != "string"))
    throw new Error("tile-prop tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (!n.attribute || typeof n.attribute != "string")
    throw new Error("tile-prop tween: 'attribute' (string) is required — dot-path to a numeric property (e.g. 'alpha', 'rotation').");
  if (typeof n.value != "number")
    throw new Error("tile-prop tween: 'value' (number) is required — the target value to animate to.");
}
c(es, "validate$5");
async function ts(n, e = {}) {
  const { CanvasAnimation: t } = foundry.canvas.animation, { uuid: i, attribute: r, value: a } = n, o = Array.isArray(i) ? i : [i];
  if (o.length === 0)
    return console.warn("tile-prop tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: s = 2e3,
    easing: l = "easeInOutCosine",
    commit: u = !0,
    startEpochMS: d = null,
    signal: m = null
  } = e, f = rt(l);
  async function g(y) {
    if (m != null && m.aborted) return !1;
    const w = await fromUuid(y);
    if (!w) return !1;
    const b = w.object;
    if (!b) return !1;
    const v = foundry.utils.getProperty(w._source, r);
    if (typeof v != "number")
      return console.warn(`tile-prop tween: source value at '${r}' on ${y} is not a number (got ${typeof v}). Skipping.`), !1;
    const S = `tile-prop-tween:${r}:${y}`;
    t.terminateAnimation(S), m && m.addEventListener("abort", () => {
      t.terminateAnimation(S);
    }, { once: !0 });
    const I = typeof d == "number" ? Math.max(0, Math.min(s, Date.now() - d)) : 0, A = /* @__PURE__ */ c((M) => {
      const D = v + (a - v) * M;
      w.updateSource(foundry.utils.expandObject({ [r]: D })), b.refresh();
    }, "applyFrame"), O = { t: 0 };
    I > 0 && (O.t = I / s, A(O.t));
    const x = await t.animate(
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
      w.updateSource(foundry.utils.expandObject({ [r]: a })), b.refresh();
    }
    if (u && x !== !1 && w.canUserModify(game.user, "update")) {
      if (m != null && m.aborted) return !1;
      w.updateSource(foundry.utils.expandObject({ [r]: v })), await w.update({ [r]: a });
    }
    return x !== !1;
  }
  return c(g, "animateOne"), (await Promise.all(o.map(g))).every(Boolean);
}
c(ts, "execute$5");
function Zp() {
  Dt({ type: "tile-prop", execute: ts, validate: es });
}
c(Zp, "registerTilePropTween");
function ey(n) {
  if (!n.attribute || typeof n.attribute != "string")
    throw new Error("particles-prop tween: 'attribute' (string) is required — property name on canvas.particleeffects (e.g. 'alpha').");
  if (typeof n.value != "number")
    throw new Error("particles-prop tween: 'value' (number) is required — the target value to animate to.");
}
c(ey, "validate$4");
async function ty(n, e = {}) {
  const { CanvasAnimation: t } = foundry.canvas.animation, { attribute: i, value: r } = n, {
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
  const m = rt(o), f = `particles-prop-tween:${i}`;
  t.terminateAnimation(f), l && l.addEventListener("abort", () => {
    t.terminateAnimation(f);
  }, { once: !0 });
  const g = typeof s == "number" ? Math.max(0, Math.min(a, Date.now() - s)) : 0, p = /* @__PURE__ */ c((b) => {
    u[i] = d + (r - d) * b;
  }, "applyFrame"), y = { t: 0 };
  g > 0 && (y.t = g / a, p(y.t));
  const w = await t.animate(
    [{ parent: y, attribute: "t", to: 1 }],
    {
      name: f,
      duration: a,
      easing: m,
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
c(ty, "execute$4");
function ny() {
  Dt({ type: "particles-prop", execute: ty, validate: ey });
}
c(ny, "registerParticlesPropTween");
var In, qr, jr, Br, Ur, Vr, Yi;
const kc = class kc {
  /**
   * @param {AbortController} controller
   */
  constructor(e) {
    k(this, In);
    k(this, qr);
    k(this, jr);
    k(this, Br);
    k(this, Ur);
    k(this, Vr, !1);
    k(this, Yi, null);
    L(this, In, e), L(this, Br, new Promise((t) => {
      L(this, qr, t);
    })), L(this, Ur, new Promise((t) => {
      L(this, jr, t);
    }));
  }
  /** @returns {Promise<boolean>} Resolves true (completed) or false (cancelled/failed). */
  get finished() {
    return h(this, Br);
  }
  /** @returns {Promise<{status: string, [k: string]: unknown}>} */
  get result() {
    return h(this, Ur);
  }
  /** @returns {boolean} */
  get cancelled() {
    return h(this, In).signal.aborted;
  }
  /** @returns {AbortSignal} */
  get signal() {
    return h(this, In).signal;
  }
  /** @returns {string} */
  get status() {
    return h(this, Yi) ? h(this, Yi).status : this.cancelled ? "cancelled" : "running";
  }
  /** Abort the timeline, triggering onCancel callbacks. */
  cancel(e = "cancelled") {
    h(this, In).signal.aborted || h(this, In).abort(e);
  }
  /**
   * Called internally by the execution engine when the timeline finishes.
   * @param {boolean} completed - true if all steps ran, false if cancelled
   */
  _resolve(e) {
    if (h(this, Vr)) return;
    L(this, Vr, !0);
    const t = typeof e == "boolean" ? { status: e ? "completed" : "cancelled" } : e ?? { status: "cancelled" };
    L(this, Yi, t), h(this, qr).call(this, t.status === "completed"), h(this, jr).call(this, t);
  }
};
In = new WeakMap(), qr = new WeakMap(), jr = new WeakMap(), Br = new WeakMap(), Ur = new WeakMap(), Vr = new WeakMap(), Yi = new WeakMap(), c(kc, "TimelineHandle");
let Ml = kc;
var mi, Ji, hi;
const Mc = class Mc {
  constructor() {
    /** @type {Map<string, Set<Function>>} */
    k(this, mi, /* @__PURE__ */ new Map());
    /** @type {Set<string>} Signals that have been emitted (sticky) */
    k(this, Ji, /* @__PURE__ */ new Set());
    k(this, hi, !1);
  }
  /**
   * Subscribe to a named signal.
   * @param {string} signal
   * @param {Function} listener
   * @returns {() => void} Unsubscribe function
   */
  on(e, t) {
    if (h(this, hi)) return () => {
    };
    let i = h(this, mi).get(e);
    return i || (i = /* @__PURE__ */ new Set(), h(this, mi).set(e, i)), i.add(t), () => i.delete(t);
  }
  /**
   * Fire a named signal synchronously. All registered listeners are invoked.
   * The signal is recorded so that future waitFor() calls resolve immediately.
   * @param {string} signal
   */
  emit(e) {
    if (h(this, hi)) return;
    h(this, Ji).add(e);
    const t = h(this, mi).get(e);
    if (t)
      for (const i of t)
        i();
  }
  /**
   * Returns a promise that resolves when the signal fires, or rejects
   * if the abort signal fires first.
   * @param {string} signal
   * @param {AbortSignal} [abortSignal]
   * @returns {Promise<void>}
   */
  waitFor(e, t) {
    return h(this, hi) ? Promise.reject(new Error("EventBus destroyed")) : h(this, Ji).has(e) ? Promise.resolve() : new Promise((i, r) => {
      if (t != null && t.aborted)
        return r(t.reason ?? "aborted");
      const a = this.on(e, () => {
        a(), o && (t == null || t.removeEventListener("abort", o)), i();
      });
      let o;
      t && (o = /* @__PURE__ */ c(() => {
        a(), r(t.reason ?? "aborted");
      }, "onAbort"), t.addEventListener("abort", o, { once: !0 }));
    });
  }
  /**
   * Tear down the bus, clearing all listeners.
   */
  destroy() {
    L(this, hi, !0), h(this, mi).clear(), h(this, Ji).clear();
  }
};
mi = new WeakMap(), Ji = new WeakMap(), hi = new WeakMap(), c(Mc, "EventBus");
let _l = Mc;
const Cf = /* @__PURE__ */ new Map();
function ns(n, e) {
  Cf.set(n, e);
}
c(ns, "registerAwaitProvider");
function Nl(n, e) {
  const t = Cf.get(n.event);
  return t ? t(n, e) : Promise.reject(new Error(`Unknown await event type: "${n.event}"`));
}
c(Nl, "createAwaitPromise");
ns("signal", (n, e) => n.name ? e.eventBus.waitFor(n.name, e.signal) : Promise.reject(new Error('await signal: "name" is required')));
ns("click", (n, e) => new Promise((t, i) => {
  if (e.signal.aborted) return i(e.signal.reason ?? "aborted");
  const r = /* @__PURE__ */ c(() => {
    o(), t();
  }, "onClick"), a = /* @__PURE__ */ c(() => {
    o(), i(e.signal.reason ?? "aborted");
  }, "onAbort"), o = /* @__PURE__ */ c(() => {
    document.removeEventListener("click", r), e.signal.removeEventListener("abort", a);
  }, "cleanup");
  document.addEventListener("click", r, { once: !0 }), e.signal.addEventListener("abort", a, { once: !0 });
}));
ns("keypress", (n, e) => new Promise((t, i) => {
  if (e.signal.aborted) return i(e.signal.reason ?? "aborted");
  const r = /* @__PURE__ */ c((s) => {
    n.key && s.key !== n.key || (o(), t());
  }, "onKey"), a = /* @__PURE__ */ c(() => {
    o(), i(e.signal.reason ?? "aborted");
  }, "onAbort"), o = /* @__PURE__ */ c(() => {
    document.removeEventListener("keydown", r), e.signal.removeEventListener("abort", a);
  }, "cleanup");
  document.addEventListener("keydown", r), e.signal.addEventListener("abort", a, { once: !0 });
}));
const Pi = /* @__PURE__ */ new Map();
function iy(n, e) {
  const t = Pi.get(n);
  t && !t.cancelled && t.cancel("replaced-by-name"), Pi.set(n, e), e.finished.then(() => {
    Pi.get(n) === e && Pi.delete(n);
  });
}
c(iy, "registerTimeline");
function Sf(n) {
  const e = Pi.get(n);
  return e && !e.cancelled ? (e.cancel("cancelled-by-name"), !0) : !1;
}
c(Sf, "cancelTimeline");
function ry(n) {
  return Pi.get(n);
}
c(ry, "getTimeline");
function fu(n, e) {
  return n <= 0 ? Promise.resolve() : new Promise((t, i) => {
    if (e.aborted) return i(e.reason);
    const r = setTimeout(t, n);
    e.addEventListener("abort", () => {
      clearTimeout(r), i(e.reason);
    }, { once: !0 });
  });
}
c(fu, "cancellableDelay");
var je, On, zr, Gr;
const _c = class _c {
  constructor(e) {
    /** @type {TweenTimeline} */
    k(this, je);
    /** @type {Array<{ type: string, params: object, opts?: object, detach: boolean }>} */
    k(this, On, []);
    /** @type {Function|null} */
    k(this, zr, null);
    /** @type {Function|null} */
    k(this, Gr, null);
    L(this, je, e);
  }
  /**
   * Add a tween entry to this step.
   * @param {string} type  Registered tween type name
   * @param {object} params  Type-specific parameters
   * @param {object} [opts]  Options (durationMS, easing, etc.)
   * @returns {StepBuilder} this
   */
  add(e, t, i) {
    return h(this, On).push({ type: e, params: t, opts: i ?? {}, detach: !1 }), this;
  }
  /**
   * Mark the last entry as fire-and-forget (does not block step progression).
   * @returns {StepBuilder} this
   */
  detach() {
    if (h(this, On).length === 0)
      throw new Error("StepBuilder.detach(): no entry to detach.");
    return h(this, On)[h(this, On).length - 1].detach = !0, this;
  }
  /**
   * Callback invoked before this step's tweens start.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  before(e) {
    return L(this, zr, e), this;
  }
  /**
   * Callback invoked after this step's awaited tweens complete.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  after(e) {
    return L(this, Gr, e), this;
  }
  // ── Delegation to parent TweenTimeline for fluent chaining ──
  /** Start a new step (finalizes this one). */
  step() {
    return h(this, je).step();
  }
  /** Insert a delay between steps. */
  delay(e) {
    return h(this, je).delay(e);
  }
  /** Insert an await segment. */
  await(e) {
    return h(this, je).await(e);
  }
  /** Insert an emit segment. */
  emit(e) {
    return h(this, je).emit(e);
  }
  /** Insert a parallel segment. */
  parallel(e, t) {
    return h(this, je).parallel(e, t);
  }
  /** Register onComplete callback. */
  onComplete(e) {
    return h(this, je).onComplete(e);
  }
  /** Register onCancel callback. */
  onCancel(e) {
    return h(this, je).onCancel(e);
  }
  /** Register onError callback. */
  onError(e) {
    return h(this, je).onError(e);
  }
  /** Execute the timeline. */
  run(e) {
    return h(this, je).run(e);
  }
  /** Serialize the timeline. */
  toJSON() {
    return h(this, je).toJSON();
  }
  // ── Internal access ──
  /** @returns {{ entries: Array, before: Function|null, after: Function|null }} */
  _finalize() {
    return {
      entries: h(this, On),
      before: h(this, zr),
      after: h(this, Gr)
    };
  }
};
je = new WeakMap(), On = new WeakMap(), zr = new WeakMap(), Gr = new WeakMap(), c(_c, "StepBuilder");
let xl = _c;
var Be, ke, It, An, Wr, Yr, Jr, Kr, zn, $l, K, rn, Fl, Tf, Dl, Lf, If, Na, ut, Ht;
const sn = class sn {
  constructor() {
    k(this, K);
    /** @type {string|null} */
    k(this, Be, null);
    /** @type {string} */
    k(this, ke, Ie.ABORT);
    /** @type {Array<object>} */
    k(this, It, []);
    /** @type {StepBuilder|null} */
    k(this, An, null);
    /** @type {Function|null} */
    k(this, Wr, null);
    /** @type {Function|null} */
    k(this, Yr, null);
    /** @type {Function|null} */
    k(this, Jr, null);
    /** @type {Function|null} */
    k(this, Kr, null);
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
    return C(this, K, rn).call(this), L(this, An, new xl(this)), h(this, An);
  }
  /**
   * Insert a delay (in ms) between the previous step and the next.
   * @param {number} ms
   * @returns {TweenTimeline} this
   */
  delay(e) {
    return C(this, K, rn).call(this), h(this, It).push({ kind: "delay", ms: e }), this;
  }
  /**
   * Pause execution until an event occurs.
   * @param {object} config  e.g. { event: "click" }, { event: "signal", name: "fog-done" }
   * @returns {TweenTimeline} this
   */
  await(e) {
    return C(this, K, rn).call(this), h(this, It).push({ kind: "await", config: e }), this;
  }
  /**
   * Fire a named signal (instant, non-blocking).
   * @param {string} signal  Signal name
   * @returns {TweenTimeline} this
   */
  emit(e) {
    return C(this, K, rn).call(this), h(this, It).push({ kind: "emit", signal: e }), this;
  }
  /**
   * Fork N branches with a join strategy.
   * @param {Array<(tl: TweenTimeline) => void>} branchFns  Callbacks that build each branch
   * @param {object} [opts]
   * @param {"all"|"any"|number} [opts.join="all"]  Join strategy
   * @param {"detach"|"cancel"} [opts.overflow="detach"]  What to do with un-joined branches
   * @returns {TweenTimeline} this
   */
  parallel(e, t = {}) {
    C(this, K, rn).call(this);
    const i = t.join ?? "all", r = t.overflow ?? "detach";
    if (i !== "all" && i !== "any" && (typeof i != "number" || i < 1 || i > e.length))
      throw new Error(`parallel: join must be "all", "any", or 1..${e.length}, got ${JSON.stringify(i)}`);
    if (r !== "detach" && r !== "cancel")
      throw new Error(`parallel: overflow must be "detach" or "cancel", got ${JSON.stringify(r)}`);
    const a = e.map((o) => {
      var l;
      const s = new sn();
      return o(s), C(l = s, K, rn).call(l), h(s, It);
    });
    return h(this, It).push({ kind: "parallel", branches: a, join: i, overflow: r }), this;
  }
  /**
   * Callback invoked before the first step runs.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  beforeAll(e) {
    return L(this, Wr, e), this;
  }
  /**
   * Callback invoked on successful completion.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onComplete(e) {
    return L(this, Yr, e), this;
  }
  /**
   * Callback invoked on cancellation (mutually exclusive with onComplete).
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onCancel(e) {
    return L(this, Jr, e), this;
  }
  /**
   * Callback invoked on runtime failure (mutually exclusive with onComplete/onCancel).
   * @param {(outcome: object) => void} fn
   * @returns {TweenTimeline} this
   */
  onError(e) {
    return L(this, Kr, e), this;
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
    C(this, K, rn).call(this);
    const t = new AbortController();
    e.signal && (e.signal.aborted ? t.abort(e.signal.reason ?? "parent-aborted") : e.signal.addEventListener("abort", () => {
      t.signal.aborted || t.abort(e.signal.reason ?? "parent-aborted");
    }, { once: !0 }));
    const i = new Ml(t);
    h(this, Be) && iy(h(this, Be), i);
    const r = e.broadcast ?? game.user.isGM, a = e.commit ?? game.user.isGM, o = e.startEpochMS ?? Date.now();
    r && h(this, Be) && _a(wf, {
      name: h(this, Be),
      data: this.toJSON(),
      startEpochMS: o
    });
    const s = new _l(), l = {
      signal: i.signal,
      commit: a,
      startEpochMS: o,
      eventBus: s,
      errors: [],
      detachedPromises: []
    };
    return C(this, K, Tf).call(this, i, l).then((u) => {
      var d, m, f;
      s.destroy(), i._resolve(u), u.status === bn.COMPLETED ? (d = h(this, Yr)) == null || d.call(this) : u.status === bn.CANCELLED ? ((m = h(this, Jr)) == null || m.call(this), r && h(this, Be) && _a(Ol, {
        name: h(this, Be),
        reason: u.reason
      })) : ((f = h(this, Kr)) == null || f.call(this, u), r && h(this, Be) && _a(Ol, {
        name: h(this, Be),
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
    C(this, K, rn).call(this);
    const t = { timeline: C(i = sn, zn, $l).call(i, h(this, It)) };
    return h(this, Be) && (t.name = h(this, Be)), h(this, ke) !== Ie.ABORT && (t.errorPolicy = h(this, ke)), t;
  }
};
Be = new WeakMap(), ke = new WeakMap(), It = new WeakMap(), An = new WeakMap(), Wr = new WeakMap(), Yr = new WeakMap(), Jr = new WeakMap(), Kr = new WeakMap(), zn = new WeakSet(), $l = /* @__PURE__ */ c(function(e) {
  const t = [];
  for (const i of e)
    if (i.kind === "delay")
      t.push({ delay: i.ms });
    else if (i.kind === "await")
      t.push({ await: i.config });
    else if (i.kind === "emit")
      t.push({ emit: i.signal });
    else if (i.kind === "parallel")
      t.push({
        parallel: {
          branches: i.branches.map((r) => {
            var a;
            return C(a = sn, zn, $l).call(a, r);
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
      t.push(r);
    }
  return t;
}, "#serializeSegments"), K = new WeakSet(), // ── Private ─────────────────────────────────────────────────────────
rn = /* @__PURE__ */ c(function() {
  h(this, An) && (h(this, It).push({ kind: "step", data: h(this, An)._finalize() }), L(this, An, null));
}, "#finalizeCurrentStep"), Fl = /* @__PURE__ */ c(function(e) {
  e.length !== 0 && Promise.allSettled(e).catch(() => {
  });
}, "#drainDetached"), Tf = /* @__PURE__ */ c(async function(e, t) {
  var i, r;
  try {
    if (t.signal.aborted) return C(this, K, ut).call(this, t.signal.reason);
    const a = await C(this, K, Na).call(this, h(this, Wr), vt.BEFORE_ALL, null);
    if (a) {
      if (h(this, ke) === Ie.ABORT) return a;
      t.errors.push(a);
    }
    const o = await C(this, K, Dl).call(this, h(this, It), t);
    if (o)
      return C(i = sn, zn, Fl).call(i, t.detachedPromises), o;
    if (!t.signal.aborted) {
      const s = await Promise.allSettled(t.detachedPromises);
      for (const l of s)
        if (l.status === "rejected") {
          const u = C(this, K, Ht).call(this, l.reason, vt.ENTRY);
          if (h(this, ke) === Ie.ABORT) return u;
          t.errors.push(u);
        }
    }
    return t.signal.aborted ? C(this, K, ut).call(this, t.signal.reason) : {
      status: bn.COMPLETED,
      ...t.errors.length > 0 ? { errors: t.errors } : {}
    };
  } catch (a) {
    return C(r = sn, zn, Fl).call(r, t.detachedPromises), t.signal.aborted ? C(this, K, ut).call(this, t.signal.reason) : (console.error("TweenTimeline execution error:", a), C(this, K, Ht).call(this, a, vt.RUNTIME));
  }
}, "#execute"), Dl = /* @__PURE__ */ c(async function(e, t) {
  let i = -1, r = 0;
  for (const a of e) {
    if (t.signal.aborted) return C(this, K, ut).call(this, t.signal.reason);
    if (a.kind === "delay") {
      try {
        await fu(a.ms, t.signal);
      } catch {
        return C(this, K, ut).call(this, t.signal.reason);
      }
      r += a.ms;
      continue;
    }
    if (a.kind === "await") {
      try {
        let p = Nl(a.config, {
          signal: t.signal,
          eventBus: t.eventBus
        });
        const y = a.config.timeout;
        typeof y == "number" && y > 0 && (p = Promise.race([
          p,
          fu(y, t.signal)
        ])), await p;
      } catch (p) {
        if (t.signal.aborted) return C(this, K, ut).call(this, t.signal.reason);
        const y = C(this, K, Ht).call(this, p, vt.AWAIT);
        if (h(this, ke) === Ie.ABORT) return y;
        t.errors.push(y);
      }
      continue;
    }
    if (a.kind === "emit") {
      try {
        t.eventBus.emit(a.signal);
      } catch (p) {
        const y = C(this, K, Ht).call(this, p, vt.EMIT);
        if (h(this, ke) === Ie.ABORT) return y;
        t.errors.push(y);
      }
      continue;
    }
    if (a.kind === "parallel") {
      const p = await C(this, K, Lf).call(this, a, t, r);
      if (p) return p;
      continue;
    }
    i += 1;
    const { entries: o, before: s, after: l } = a.data, u = await C(this, K, Na).call(this, s, vt.BEFORE_STEP, i);
    if (u) {
      if (h(this, ke) === Ie.ABORT) return u;
      t.errors.push(u);
      continue;
    }
    if (t.signal.aborted) return C(this, K, ut).call(this, t.signal.reason);
    const d = [];
    let m = 0;
    for (const p of o) {
      const y = ir(p.type);
      if (!y) {
        const S = C(this, K, Ht).call(this, new Error(`TweenTimeline: unknown tween type "${p.type}"`), vt.ENTRY, i, p.type);
        if (h(this, ke) === Ie.ABORT) return S;
        t.errors.push(S), console.warn(S.error.message);
        continue;
      }
      const w = {
        ...p.opts,
        commit: t.commit,
        startEpochMS: t.startEpochMS + r,
        signal: t.signal
      }, b = w.durationMS ?? 2e3, v = Promise.resolve().then(() => y.execute(p.params, w)).then((S) => S === !1 ? {
        ok: !1,
        failure: C(this, K, Ht).call(this, new Error("Tween entry returned false."), vt.ENTRY, i, p.type)
      } : { ok: !0 }).catch((S) => ({
        ok: !1,
        failure: C(this, K, Ht).call(this, S, vt.ENTRY, i, p.type)
      }));
      p.detach ? t.detachedPromises.push(v) : (d.push(v), m = Math.max(m, b));
    }
    const f = await C(this, K, If).call(this, d, t.signal);
    if (f === null) return C(this, K, ut).call(this, t.signal.reason);
    for (const p of f)
      if (!p.ok) {
        if (h(this, ke) === Ie.ABORT) return p.failure;
        t.errors.push(p.failure), console.warn("TweenTimeline: entry failed:", p.failure.error);
      }
    const g = await C(this, K, Na).call(this, l, vt.AFTER_STEP, i);
    if (g) {
      if (h(this, ke) === Ie.ABORT) return g;
      t.errors.push(g);
    }
    if (t.signal.aborted) return C(this, K, ut).call(this, t.signal.reason);
    r += m;
  }
  return null;
}, "#executeSegments"), Lf = /* @__PURE__ */ c(async function(e, t, i = 0) {
  const { branches: r, join: a, overflow: o } = e, s = r.length, l = a === "all" ? s : a === "any" ? 1 : a, u = r.map(() => {
    const p = new AbortController();
    return t.signal.aborted ? p.abort(t.signal.reason ?? "parent-aborted") : t.signal.addEventListener("abort", () => {
      p.signal.aborted || p.abort(t.signal.reason ?? "parent-aborted");
    }, { once: !0 }), p;
  });
  let d = 0, m = 0;
  const f = new Array(s).fill(null);
  let g;
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
        const S = f.filter((A) => A && A.status === bn.FAILED).map((A) => A), I = C(this, K, Ht).call(this, new Error(`parallel: join target ${l} impossible (${d} completed, ${m} failed)`), vt.PARALLEL);
        h(this, ke) === Ie.ABORT ? p(I) : (t.errors.push(I), t.errors.push(...S), p(null));
      }
    }, "checkJoin"), b = /* @__PURE__ */ c(() => {
      if (o === "cancel")
        for (let v = 0; v < s; v++)
          !f[v] && !u[v].signal.aborted && u[v].abort("overflow-cancel");
      for (let v = 0; v < s; v++)
        f[v] || t.detachedPromises.push(g[v]);
    }, "applyOverflow");
    if (g = r.map((v, S) => {
      const I = {
        signal: u[S].signal,
        commit: t.commit,
        startEpochMS: t.startEpochMS + i,
        eventBus: t.eventBus,
        // shared
        errors: t.errors,
        // shared
        detachedPromises: t.detachedPromises
        // shared
      };
      return C(this, K, Dl).call(this, v, I).then((A) => {
        if (A)
          if (A.status === bn.CANCELLED) {
            if (u[S].signal.aborted) {
              f[S] = A;
              return;
            }
            f[S] = A, m++;
          } else
            f[S] = A, m++;
        else
          f[S] = { status: bn.COMPLETED }, d++;
        w();
      });
    }), t.signal.aborted) {
      y = !0, p(C(this, K, ut).call(this, t.signal.reason));
      return;
    }
    t.signal.addEventListener("abort", () => {
      y || (y = !0, p(C(this, K, ut).call(this, t.signal.reason)));
    }, { once: !0 });
  });
}, "#executeParallel"), /**
 * @param {Array<Promise<{ok: boolean, failure?: object}>>} stepPromises
 * @param {AbortSignal} signal
 * @returns {Promise<Array<{ok: boolean, failure?: object}>|null>}
 */
If = /* @__PURE__ */ c(function(e, t) {
  return e.length === 0 ? Promise.resolve([]) : t.aborted ? Promise.resolve(null) : new Promise((i, r) => {
    const a = /* @__PURE__ */ c(() => i(null), "onAbort");
    t.addEventListener("abort", a, { once: !0 }), Promise.all(e).then((o) => {
      t.removeEventListener("abort", a), i(o);
    }).catch((o) => {
      t.removeEventListener("abort", a), r(o);
    });
  });
}, "#waitForStep"), Na = /* @__PURE__ */ c(async function(e, t, i) {
  if (!e) return null;
  try {
    return await e(), null;
  } catch (r) {
    const a = C(this, K, Ht).call(this, r, t, i ?? void 0);
    return h(this, ke) === Ie.CONTINUE && console.warn(`TweenTimeline: hook failure in ${t}:`, r), a;
  }
}, "#runHook"), /** @param {unknown} reason */
ut = /* @__PURE__ */ c(function(e) {
  let t;
  return typeof e == "string" ? t = e : e instanceof Error && (t = e.message), {
    status: bn.CANCELLED,
    ...t ? { reason: t } : {}
  };
}, "#cancelledOutcome"), /**
 * @param {unknown} err
 * @param {string} phase
 * @param {number} [stepIndex]
 * @param {string} [entryType]
 */
Ht = /* @__PURE__ */ c(function(e, t, i, r) {
  const a = e instanceof Error ? e : new Error(String(e));
  return {
    status: bn.FAILED,
    error: a,
    phase: t,
    ...typeof i == "number" ? { stepIndex: i } : {},
    ...r ? { entryType: r } : {}
  };
}, "#failedOutcome"), k(sn, zn), c(sn, "TweenTimeline");
let to = sn;
function wc(n) {
  if (!n || typeof n != "object")
    throw new Error("Sequence JSON: data must be an object.");
  if (!Array.isArray(n.timeline))
    throw new Error("Sequence JSON: 'timeline' must be an array.");
  if (n.name != null && typeof n.name != "string")
    throw new Error("Sequence JSON: 'name' must be a string.");
  if (n.errorPolicy != null && n.errorPolicy !== Ie.ABORT && n.errorPolicy !== Ie.CONTINUE)
    throw new Error(`Sequence JSON: 'errorPolicy' must be "abort" or "continue".`);
  Of(n.timeline, "timeline", 0);
}
c(wc, "validateSequenceJSON");
function Of(n, e, t = 0) {
  for (let i = 0; i < n.length; i++) {
    const r = n[i], a = `${e}[${i}]`;
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
      if (t >= 8)
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
        Of(d, `${a}.parallel.branches[${u}]`, t + 1);
      }
      continue;
    }
    throw new Error(`Sequence JSON: ${a} is not a recognized segment (step array, delay, await, emit, or parallel).`);
  }
}
c(Of, "validateSegmentsJSON");
function Af(n) {
  wc(n), kf(n.timeline, "timeline");
}
c(Af, "validateSequenceSemantics");
function kf(n, e) {
  for (let t = 0; t < n.length; t++) {
    const i = n[t], r = `${e}[${t}]`;
    if (Array.isArray(i))
      for (let a = 0; a < i.length; a++) {
        const o = i[a];
        try {
          Bp(o.type, o.params ?? {});
        } catch (s) {
          throw new Error(`Sequence JSON: ${r}[${a}] failed semantic validation: ${s.message}`);
        }
      }
    else if (i.parallel)
      for (let a = 0; a < i.parallel.branches.length; a++)
        kf(i.parallel.branches[a], `${r}.parallel.branches[${a}]`);
  }
}
c(kf, "validateSegmentsSemantics");
function Ec(n, e = {}) {
  wc(n), e.validateSemantics && Af(n);
  const t = new to();
  return n.name && t.name(n.name), n.errorPolicy && t.errorPolicy(n.errorPolicy), Mf(n.timeline, t), t;
}
c(Ec, "compileSequence");
function Mf(n, e) {
  for (const t of n) {
    if (Array.isArray(t)) {
      const i = e.step();
      for (const r of t)
        i.add(r.type, r.params ?? {}, r.opts), r.detach && i.detach();
      continue;
    }
    if (t.delay !== void 0) {
      e.delay(t.delay);
      continue;
    }
    if (t.await !== void 0) {
      e.await(t.await);
      continue;
    }
    if (t.emit !== void 0) {
      e.emit(t.emit);
      continue;
    }
    if (t.parallel !== void 0) {
      const i = t.parallel, r = i.branches.map((a) => (o) => Mf(a, o));
      e.parallel(r, {
        join: i.join ?? "all",
        overflow: i.overflow ?? "detach"
      });
    }
  }
}
c(Mf, "compileSegments");
function ay(n) {
  wc(n), Af(n);
}
c(ay, "validate$3");
async function oy(n, e = {}) {
  return Ec(n, { validateSemantics: !0 }).run({
    broadcast: !1,
    commit: e.commit,
    startEpochMS: e.startEpochMS,
    signal: e.signal
  }).finished;
}
c(oy, "execute$3");
function sy() {
  Dt({ type: "sequence", execute: oy, validate: ay });
}
c(sy, "registerSequenceTween");
function ly(n) {
  if (n.x == null && n.y == null && n.scale == null)
    throw new Error("camera-pan tween: at least one of 'x', 'y', or 'scale' is required.");
  if (n.x != null && typeof n.x != "number")
    throw new Error("camera-pan tween: 'x' must be a number.");
  if (n.y != null && typeof n.y != "number")
    throw new Error("camera-pan tween: 'y' must be a number.");
  if (n.scale != null && (typeof n.scale != "number" || n.scale <= 0))
    throw new Error("camera-pan tween: 'scale' must be a positive number.");
}
c(ly, "validate$2");
async function cy(n, e = {}) {
  const {
    durationMS: t = 2e3,
    startEpochMS: i = null,
    signal: r = null
  } = e;
  if (r != null && r.aborted) return !1;
  const a = typeof i == "number" ? Math.max(0, Math.min(t, Date.now() - i)) : 0, o = Math.max(0, t - a), s = { duration: o };
  if (n.x != null && (s.x = n.x), n.y != null && (s.y = n.y), n.scale != null && (s.scale = n.scale), o <= 0)
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
c(cy, "execute$2");
function uy() {
  Dt({ type: "camera-pan", execute: cy, validate: ly });
}
c(uy, "registerCameraPanTween");
function dy(n) {
  if ((Array.isArray(n.uuid) ? n.uuid : [n.uuid]).some((i) => !i || typeof i != "string"))
    throw new Error("tile-tint tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (n.toColor == null || typeof n.toColor != "string")
    throw new Error("tile-tint tween: 'toColor' (CSS color string) is required.");
  if (!foundry.utils.Color.fromString(n.toColor).valid)
    throw new Error(`tile-tint tween: invalid target color "${n.toColor}".`);
  if (n.mode && !Qi().includes(n.mode))
    throw new Error(
      `tile-tint tween: unknown mode "${n.mode}". Available: ${Qi().join(", ")}`
    );
}
c(dy, "validate$1");
async function fy(n, e = {}) {
  const { CanvasAnimation: t } = foundry.canvas.animation, { Color: i } = foundry.utils, { uuid: r, toColor: a, mode: o = "oklch" } = n, s = Array.isArray(r) ? r : [r];
  if (s.length === 0)
    return console.warn("tile-tint tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: l = 2e3,
    easing: u = "easeInOutCosine",
    commit: d = !0,
    startEpochMS: m = null,
    signal: f = null
  } = e, g = rt(u), p = vc(o), y = i.fromString(a);
  if (!y.valid) throw new Error(`tile-tint tween: invalid target color "${a}".`);
  async function w(v) {
    var H, q;
    if (f != null && f.aborted) return !1;
    const S = await fromUuid(v);
    if (!S) return !1;
    const I = S.object;
    if (!I) return !1;
    const A = ((q = (H = S._source) == null ? void 0 : H.texture) == null ? void 0 : q.tint) ?? "#ffffff", O = i.fromString(A);
    O.valid || console.warn(`tile-tint tween: source tint invalid on ${v}, using white.`);
    const x = O.valid ? O : i.fromString("#ffffff"), M = { t: 0 }, D = `tile-tint-tween:${v}`;
    t.terminateAnimation(D), f && f.addEventListener("abort", () => {
      t.terminateAnimation(D);
    }, { once: !0 });
    const F = typeof m == "number" ? Math.max(0, Math.min(l, Date.now() - m)) : 0, P = /* @__PURE__ */ c((j) => {
      const B = p(x, y, j);
      S.updateSource({ texture: { tint: B } }), I.refresh();
    }, "applyFrame");
    F > 0 && (M.t = F / l, P(M.t));
    const _ = await t.animate(
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
  return c(w, "animateOne"), (await Promise.all(s.map(w))).every(Boolean);
}
c(fy, "execute$1");
function my() {
  Dt({ type: "tile-tint", execute: fy, validate: dy });
}
c(my, "registerTileTintTween");
function hy(n) {
  if ((Array.isArray(n.uuid) ? n.uuid : [n.uuid]).some((t) => !t || typeof t != "string"))
    throw new Error("tile-scale tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (typeof n.toScale != "number" || n.toScale <= 0)
    throw new Error("tile-scale tween: 'toScale' must be a positive number.");
  for (const t of ["baseWidth", "baseHeight", "centerX", "centerY"])
    if (typeof n[t] != "number")
      throw new Error(`tile-scale tween: '${t}' (number) is required.`);
}
c(hy, "validate");
async function gy(n, e = {}) {
  const { CanvasAnimation: t } = foundry.canvas.animation, { uuid: i, toScale: r, baseWidth: a, baseHeight: o, centerX: s, centerY: l } = n, u = Array.isArray(i) ? i : [i];
  if (u.length === 0) return !0;
  const {
    durationMS: d = 2e3,
    easing: m = "easeInOutCosine",
    commit: f = !0,
    startEpochMS: g = null,
    signal: p = null
  } = e, y = rt(m), w = a * r, b = o * r, v = s - w / 2, S = l - b / 2;
  async function I(O) {
    if (p != null && p.aborted) return !1;
    const x = await fromUuid(O);
    if (!x) return !1;
    const M = x.object;
    if (!M) return !1;
    const D = x._source.width, F = x._source.height, P = x._source.x, _ = x._source.y, H = `tile-scale-tween:${O}`;
    t.terminateAnimation(H), p && p.addEventListener("abort", () => {
      t.terminateAnimation(H);
    }, { once: !0 });
    const q = typeof g == "number" ? Math.max(0, Math.min(d, Date.now() - g)) : 0, j = /* @__PURE__ */ c((J) => {
      const ae = D + (w - D) * J, Q = F + (b - F) * J, ne = P + (v - P) * J, Qt = _ + (S - _) * J;
      x.updateSource({ width: ae, height: Q, x: ne, y: Qt }), M.refresh();
    }, "applyFrame"), B = { t: 0 };
    q > 0 && (B.t = q / d, j(B.t));
    const V = await t.animate(
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
      x.updateSource({ width: w, height: b, x: v, y: S }), M.refresh();
    }
    if (f && V !== !1 && x.canUserModify(game.user, "update")) {
      if (p != null && p.aborted) return !1;
      x.updateSource({ width: D, height: F, x: P, y: _ }), await x.update({ width: w, height: b, x: v, y: S });
    }
    return V !== !1;
  }
  return c(I, "animateOne"), (await Promise.all(u.map(I))).every(Boolean);
}
c(gy, "execute");
function py() {
  Dt({ type: "tile-scale", execute: gy, validate: hy });
}
c(py, "registerTileScaleTween");
async function yy(n, e, t = {}) {
  if (!game.user.isGM)
    return ui.notifications.warn("Only the GM can dispatch tweens."), !1;
  const i = ir(n);
  if (!i)
    throw new Error(`Unknown tween type: "${n}". Registered types: ${Al().join(", ")}`);
  i.validate(e);
  const { durationMS: r = 2e3, easing: a = "easeInOutCosine", commit: o = !0 } = t, s = Date.now();
  return _a(vf, {
    type: n,
    params: e,
    durationMS: r,
    easing: a,
    startEpochMS: s,
    commit: !1
  }), i.execute(e, { durationMS: r, easing: a, commit: o, startEpochMS: s });
}
c(yy, "dispatchTween");
function by(n) {
  const { type: e, params: t, durationMS: i, easing: r, startEpochMS: a, commit: o } = n ?? {}, s = ir(e);
  if (!s) {
    console.warn(`[${T}] Received unknown tween type over socket: "${e}"`);
    return;
  }
  s.execute(t, {
    durationMS: i,
    easing: r,
    commit: o ?? !1,
    startEpochMS: a
  });
}
c(by, "handleTweenSocketMessage");
Jp();
Qp();
Zp();
ny();
sy();
uy();
my();
py();
Dt({ type: "token-prop", execute: ts, validate: es });
Dt({ type: "drawing-prop", execute: ts, validate: es });
Dt({ type: "sound-prop", execute: ts, validate: es });
yc(vf, by);
yc(wf, vy);
yc(Ol, wy);
function vy(n) {
  const { data: e, startEpochMS: t } = n ?? {};
  if (!e) {
    console.warn(`[${T}] Received empty tween-sequence socket message.`);
    return;
  }
  try {
    Ec(e, { validateSemantics: !0 }).run({ commit: !1, startEpochMS: t, broadcast: !1 });
  } catch (i) {
    console.error(`[${T}] Failed to run received tween sequence:`, i);
  }
}
c(vy, "handleSequenceSocketMessage");
function wy(n) {
  const { name: e } = n ?? {};
  e && Sf(e);
}
c(wy, "handleSequenceCancelMessage");
function Ey() {
  Hooks.once("ready", () => {
    jp();
    const n = game.modules.get(T);
    n.api || (n.api = {}), n.api.tween = {
      dispatch: yy,
      types: Al,
      Timeline: to,
      ErrorPolicy: Ie,
      compileSequence: Ec,
      cancelTimeline: Sf,
      getTimeline: ry
    }, console.log(`[${T}] Tween API registered. Types: ${Al().join(", ")}`);
  });
}
c(Ey, "registerTweenHooks");
Ey();
const Cy = ["tag", "tag-all", "id", "tags-any", "tags-all"], Sy = /* @__PURE__ */ new Set(["tags-any", "tags-all"]);
function Cc(n) {
  if (!n || typeof n != "string")
    return { type: "unknown", value: n ?? "" };
  if (n.startsWith("$"))
    return { type: "special", value: n };
  for (const e of Cy)
    if (n.startsWith(`${e}:`)) {
      const t = n.slice(e.length + 1), i = Sy.has(e) ? t.split(",").map((r) => r.trim()) : t;
      return { type: e, value: i };
    }
  return n.includes(".") ? { type: "uuid", value: n } : { type: "unknown", value: n };
}
c(Cc, "parseSelector");
function Ty(n) {
  if (!n) return "";
  const { type: e, value: t } = n;
  if (e === "special" || e === "uuid" || e === "unknown")
    return Array.isArray(t) ? t.join(",") : t ?? "";
  const i = Array.isArray(t) ? t.join(",") : t ?? "";
  return `${e}:${i}`;
}
c(Ty, "buildSelector");
function _f(n, e = "first") {
  return n != null && n.length ? n.length === 1 ? e === "first-all" || e === "all" ? `tag-all:${n[0]}` : `tag:${n[0]}` : e === "any" ? `tags-any:${n.join(",")}` : e === "all" ? `tags-all:${n.join(",")}` : e === "first-all" ? `tags-all:${n.join(",")}` : `tags-any:${n.join(",")}` : "";
}
c(_f, "buildTagSelector");
function is(n) {
  if (!n) return null;
  if (n.documentName || n._source !== void 0) {
    const e = n.object;
    return e ? { placeable: e, doc: n } : null;
  }
  return n.document ? { placeable: n, doc: n.document } : null;
}
c(is, "normalizePlaceable");
function Nf() {
  var n;
  return window.Tagger ?? ((n = game.modules.get("tagger")) == null ? void 0 : n.api) ?? null;
}
c(Nf, "getTaggerAPI");
function rs(n, e) {
  if (!n) return null;
  const t = e ?? canvas.scene;
  if (!t) return null;
  const i = Cc(n);
  switch (i.type) {
    case "special":
      return Ly(i.value);
    case "tag":
      return mu(i.value, t);
    case "tag-all":
      return mu(i.value, t);
    case "id":
      return Iy(i.value, t);
    case "tags-any":
      return hu(i.value, t, !0);
    case "tags-all":
      return hu(i.value, t, !1);
    case "uuid":
      return Oy(i.value);
    default:
      return null;
  }
}
c(rs, "resolveSelector");
function Ly(n) {
  var e;
  if (n === "$particles") {
    if (!((e = game.modules.get("fxmaster")) != null && e.active))
      return console.warn(`[${T}] Picker: FXMaster not active, cannot resolve "$particles".`), null;
    const t = canvas.particleeffects;
    return t ? { kind: "particles", documents: [], placeables: [], target: t } : null;
  }
  return null;
}
c(Ly, "resolveSpecial");
function mu(n, e, t) {
  const i = Nf();
  if (!i)
    return console.warn(`[${T}] Picker: Tagger not available, cannot resolve tag "${n}".`), null;
  const r = i.getByTag(n, { sceneId: e.id });
  if (!(r != null && r.length)) return null;
  const a = [];
  for (const o of r) {
    const s = is(o);
    s && a.push(s);
  }
  return a.length === 0 ? null : {
    kind: a.length === 1 ? "placeable" : "multi-placeable",
    documents: a.map((o) => o.doc),
    placeables: a
  };
}
c(mu, "resolveTag");
function Iy(n, e) {
  const t = [
    e.tiles,
    e.lights,
    e.tokens,
    e.drawings,
    e.sounds
  ];
  for (const i of t) {
    const r = i == null ? void 0 : i.get(n);
    if (r) {
      const a = is(r);
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
c(Iy, "resolveById");
function hu(n, e, t) {
  const i = Nf();
  if (!i)
    return console.warn(`[${T}] Picker: Tagger not available, cannot resolve multi-tag.`), null;
  const r = i.getByTag(n, {
    sceneId: e.id,
    matchAny: t
  });
  if (!(r != null && r.length)) return null;
  const a = [];
  for (const o of r) {
    const s = is(o);
    s && a.push(s);
  }
  return a.length === 0 ? null : {
    kind: a.length === 1 ? "placeable" : "multi-placeable",
    documents: a.map((o) => o.doc),
    placeables: a
  };
}
c(hu, "resolveMultiTag");
function Oy(n) {
  const e = fromUuidSync(n);
  if (!e) return null;
  const t = is(e);
  return t ? {
    kind: "placeable",
    documents: [t.doc],
    placeables: [t]
  } : null;
}
c(Oy, "resolveUUID");
function Ay(n) {
  var e;
  if (!n) return null;
  if (n.kind === "particles")
    return { kind: "particles", target: n.target };
  if (n.kind === "multi-placeable")
    return { kind: "multi-placeable", placeables: n.placeables };
  if ((e = n.placeables) != null && e.length) {
    const t = n.placeables[0];
    return { kind: "placeable", placeable: t.placeable, doc: t.doc };
  }
  return null;
}
c(Ay, "adaptResolved");
function no(n) {
  var r;
  const e = /* @__PURE__ */ new Set();
  if (n.segments) {
    if (n.setup) for (const a of Object.keys(n.setup)) e.add(a);
    if (n.landing) for (const a of Object.keys(n.landing)) e.add(a);
    for (const a of Object.values(n.segments)) {
      if (a.setup) for (const o of Object.keys(a.setup)) e.add(o);
      if (a.landing) for (const o of Object.keys(a.landing)) e.add(o);
      a.timeline && Rl(a.timeline, e), (r = a.gate) != null && r.target && e.add(a.gate.target);
    }
  } else {
    if (n.setup) for (const a of Object.keys(n.setup)) e.add(a);
    if (n.landing) for (const a of Object.keys(n.landing)) e.add(a);
    n.timeline && Rl(n.timeline, e);
  }
  const t = /* @__PURE__ */ new Map(), i = [];
  for (const a of e) {
    const o = rs(a), s = Ay(o);
    s ? t.set(a, s) : i.push(a);
  }
  return i.length && console.warn(`[${T}] Cinematic: ${i.length} unresolved target(s): ${i.join(", ")}`), { targets: t, unresolved: i };
}
c(no, "resolveAllTargets");
function ky(n, e) {
  if (!n) return {};
  const t = {};
  for (const [i, r] of Object.entries(n)) {
    const a = e.get(i);
    if (a)
      if (a.kind === "particles") {
        if (a.target.destroyed) continue;
        const o = {};
        for (const s of Object.keys(r))
          o[s] = a.target[s];
        t[i] = o;
      } else if (a.kind === "multi-placeable") {
        const o = a.placeables[0];
        if (!(o != null && o.doc)) continue;
        const s = {};
        for (const l of Object.keys(r))
          s[l] = foundry.utils.getProperty(o.doc._source, l);
        t[i] = s;
      } else {
        if (!a.doc) continue;
        const o = {};
        for (const s of Object.keys(r))
          o[s] = foundry.utils.getProperty(a.doc._source, s);
        t[i] = o;
      }
  }
  return t;
}
c(ky, "captureSnapshot");
function My(n) {
  const e = {};
  function t(i) {
    if (i)
      for (const [r, a] of Object.entries(i))
        e[r] || (e[r] = {}), Object.assign(e[r], a);
  }
  if (c(t, "mergeMap"), n.segments) {
    t(n.setup), t(n.landing);
    for (const i of Object.values(n.segments))
      t(i.setup), t(i.landing), i.timeline && Pl(i.timeline, e, t);
  } else
    t(n.setup), t(n.landing), n.timeline && Pl(n.timeline, e, t);
  return e;
}
c(My, "gatherAllStateMaps");
function Pl(n, e, t) {
  var i;
  for (const r of n)
    if (!(r.delay != null || r.await != null || r.emit != null) && !(r.transitionTo != null || r.sound != null || r.stopSound != null)) {
      if ((i = r.parallel) != null && i.branches) {
        for (const a of r.parallel.branches)
          Pl(a, e, t);
        continue;
      }
      if (t(r.before), t(r.after), r.tweens)
        for (const a of r.tweens)
          a.target && a.attribute && (e[a.target] || (e[a.target] = {}), e[a.target][a.attribute] = "__snapshot__");
    }
}
c(Pl, "gatherFromEntries");
function Rl(n, e) {
  for (const t of n)
    if (t.delay == null && t.await == null && t.emit == null && t.transitionTo == null && t.sound == null && t.stopSound == null) {
      if (t.parallel) {
        const i = t.parallel;
        if (i.branches)
          for (const r of i.branches)
            Rl(r, e);
        continue;
      }
      if (t.before)
        for (const i of Object.keys(t.before)) e.add(i);
      if (t.after)
        for (const i of Object.keys(t.after)) e.add(i);
      if (t.tweens)
        for (const i of t.tweens)
          i.target && e.add(i.target);
    }
}
c(Rl, "collectSelectorsFromEntries");
const gu = {
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
}, _y = /* @__PURE__ */ new Set([
  "alpha",
  "visible",
  "x",
  "y",
  "scale",
  "rotation"
]);
function Ss(n, e, t) {
  const i = {};
  for (const [r, a] of Object.entries(n))
    e.has(r) ? i[r] = a : console.warn(`[${T}] Cinematic: blocked property "${r}" on ${t}.`);
  return i;
}
c(Ss, "filterOverrides");
function Oe(n, e) {
  var i, r;
  if (!n) return;
  const t = [];
  for (const [a, o] of Object.entries(n)) {
    const s = e.get(a);
    if (s)
      if (s.kind === "particles") {
        if (s.target.destroyed) continue;
        const l = Ss(o, _y, "$particles");
        for (const [u, d] of Object.entries(l))
          s.target[u] = d;
      } else if (s.kind === "multi-placeable")
        for (const { placeable: l, doc: u } of s.placeables) {
          if (!(u != null && u.parent) || !(l != null && l.scene)) continue;
          const d = u.documentName, m = gu[d];
          if (!m) {
            console.warn(`[${T}] Cinematic: no allowlist for document type "${d}" on "${a}", skipping.`);
            continue;
          }
          const f = Ss(o, m, `${d} "${a}"`);
          u.updateSource(f), t.push(l);
        }
      else {
        if (!((i = s.doc) != null && i.parent) || !((r = s.placeable) != null && r.scene)) continue;
        const l = s.doc.documentName, u = gu[l];
        if (!u) {
          console.warn(`[${T}] Cinematic: no allowlist for document type "${l}" on "${a}", skipping.`);
          continue;
        }
        const d = Ss(o, u, `${l} "${a}"`);
        s.doc.updateSource(d), t.push(s.placeable);
      }
  }
  for (const a of t)
    a.refresh();
}
c(Oe, "applyState");
function Ri(n, e) {
  var t;
  if (n)
    for (const i of Object.keys(n)) {
      const r = e.get(i);
      if ((r == null ? void 0 : r.kind) === "placeable" && ((t = r.doc) == null ? void 0 : t.documentName) === "AmbientLight") {
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
c(Ri, "refreshPerceptionIfNeeded");
const Ny = {
  "tile-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "light-color": /* @__PURE__ */ new Set(["uuid", "toColor", "toAlpha", "mode"]),
  "light-state": /* @__PURE__ */ new Set(["uuid", "enabled"]),
  "particles-prop": /* @__PURE__ */ new Set(["attribute", "value"]),
  "camera-pan": /* @__PURE__ */ new Set(["x", "y", "scale"]),
  "token-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "drawing-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "sound-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"])
}, xy = /* @__PURE__ */ new Set(["easing"]), $y = /* @__PURE__ */ new Set(["type", "target"]);
function xf(n, e) {
  const { type: t, target: i, ...r } = n;
  if (!t)
    return console.warn(`[${T}] Cinematic: tween entry missing 'type', skipping.`), null;
  const a = {}, o = {}, s = Ny[t];
  if (i === "$particles")
    a.target = "$particles";
  else if (i) {
    const l = e.get(i);
    if (!l) return null;
    l.kind === "multi-placeable" ? a.uuid = l.placeables.map((u) => u.doc.uuid) : a.uuid = l.doc.uuid;
  }
  for (const [l, u] of Object.entries(r))
    $y.has(l) || (xy.has(l) ? o[l] = u : (s != null && s.has(l), a[l] = u));
  return { type: t, params: a, opts: o };
}
c(xf, "compileTween");
const xr = /* @__PURE__ */ new Map();
let Fy = 0;
async function Dy(n) {
  var u, d, m, f, g;
  const { id: e, src: t, volume: i = 0.8, loop: r = !1, fadeIn: a } = n;
  if (!t) {
    console.warn(`[${T}] Cinematic sound: missing 'src', skipping.`);
    return;
  }
  const o = e || `__auto_${++Fy}`, s = {
    src: t,
    autoplay: !0,
    loop: r,
    volume: i
  };
  let l = null;
  try {
    typeof ((d = (u = foundry == null ? void 0 : foundry.audio) == null ? void 0 : u.AudioHelper) == null ? void 0 : d.play) == "function" ? l = await foundry.audio.AudioHelper.play(s, !1) : typeof ((f = (m = game == null ? void 0 : game.audio) == null ? void 0 : m.constructor) == null ? void 0 : f.play) == "function" ? l = await game.audio.constructor.play(s, !1) : typeof ((g = game == null ? void 0 : game.audio) == null ? void 0 : g.play) == "function" && (l = await game.audio.play(s, !1));
  } catch (p) {
    console.error(`[${T}] Cinematic sound: failed to play "${t}":`, p);
    return;
  }
  if (!l) {
    console.warn(`[${T}] Cinematic sound: audio helper unavailable for "${t}".`);
    return;
  }
  a && a > 0 && l.fade && l.fade(i, { duration: a, from: 0 }), xr.set(o, { sound: l, config: n }), console.log(`[${T}] Cinematic sound: playing "${t}" as "${o}" (loop=${r}, vol=${i})`);
}
c(Dy, "playLocalSound");
function Ts(n) {
  var i, r;
  const e = xr.get(n);
  if (!e) {
    console.warn(`[${T}] Cinematic sound: no active sound with id "${n}".`);
    return;
  }
  const t = e.config.fadeOut;
  try {
    t && t > 0 && e.sound.fade ? e.sound.fade(0, { duration: t }).then(() => {
      var a, o;
      return (o = (a = e.sound).stop) == null ? void 0 : o.call(a);
    }) : (r = (i = e.sound).stop) == null || r.call(i);
  } catch (a) {
    console.warn(`[${T}] Cinematic sound: error stopping "${n}":`, a);
  }
  xr.delete(n);
}
c(Ts, "stopCinematicSound");
function pu() {
  var n, e;
  for (const [t, i] of xr)
    try {
      (e = (n = i.sound).stop) == null || e.call(n);
    } catch (r) {
      console.warn(`[${T}] Cinematic sound: error stopping "${t}" during cleanup:`, r);
    }
  xr.clear();
}
c(pu, "stopAllCinematicSounds");
function Py(n, e, t, i = {}) {
  const { skipToStep: r, onStepComplete: a, timelineName: o } = i, s = new t().name(o ?? `cinematic-${canvas.scene.id}`);
  return s.beforeAll(() => {
    var l;
    try {
      Oe(n.setup, e), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    } catch (u) {
      throw console.error(`[${T}] Cinematic: error in beforeAll (setup state) on scene ${(l = canvas.scene) == null ? void 0 : l.id}:`, u), u;
    }
  }), Ff(n.timeline, s, e, { skipToStep: r, onStepComplete: a }), { tl: s };
}
c(Py, "buildTimeline");
function $f(n, e) {
  var t;
  if (n)
    for (const i of n)
      for (const r of i) {
        if (r.before)
          try {
            Oe(r.before, e), Ri(r.before, e);
          } catch (a) {
            console.warn(`[${T}] Cinematic: error in skipped parallel before:`, a);
          }
        if (r.after)
          try {
            Oe(r.after, e), Ri(r.after, e);
          } catch (a) {
            console.warn(`[${T}] Cinematic: error in skipped parallel after:`, a);
          }
        (t = r.parallel) != null && t.branches && $f(r.parallel.branches, e);
      }
}
c($f, "applyParallelStatesForSkip");
function Ff(n, e, t, i = {}) {
  const { skipToStep: r, onStepComplete: a } = i;
  let o = -1;
  for (const s of n) {
    if (s.sound != null) {
      if (r != null && o < r) continue;
      const m = s.sound, { duration: f, loop: g, fireAndForget: p } = m, y = e.step();
      if (y.before(() => {
        Dy(m);
      }), f && f > 0)
        if (p) {
          if (g && m.id) {
            const w = m.id, b = f;
            y.before(() => {
              setTimeout(() => Ts(w), b);
            });
          }
        } else
          e.delay(f), g && e.step().before(() => {
            Ts(m.id);
          });
      continue;
    }
    if (s.stopSound != null) {
      if (r != null && o < r) continue;
      const m = s.stopSound;
      e.step().before(() => {
        Ts(m);
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
        $f(s.parallel.branches, t);
        continue;
      }
      const m = s.parallel, f = m.branches.map((g) => (p) => Ff(g, p, t));
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
          Oe(s.before, t), Ri(s.before, t);
        } catch (m) {
          console.warn(`[${T}] Cinematic: error applying skipped step.before:`, m);
        }
      if (s.after)
        try {
          Oe(s.after, t), Ri(s.after, t);
        } catch (m) {
          console.warn(`[${T}] Cinematic: error applying skipped step.after:`, m);
        }
      continue;
    }
    const l = o, u = e.step();
    s.before && u.before(() => {
      var m;
      try {
        Oe(s.before, t), Ri(s.before, t);
      } catch (f) {
        throw console.error(`[${T}] Cinematic: error in step.before callback on scene ${(m = canvas.scene) == null ? void 0 : m.id}:`, f), f;
      }
    });
    const d = s.duration ?? 500;
    for (const m of s.tweens) {
      const f = xf(m, t);
      f && u.add(f.type, f.params, { ...f.opts, durationMS: d });
    }
    u.after(() => {
      var m;
      try {
        s.after && (Oe(s.after, t), Ri(s.after, t)), a == null || a(l);
      } catch (f) {
        throw console.error(`[${T}] Cinematic: error in step.after callback on scene ${(m = canvas.scene) == null ? void 0 : m.id}:`, f), f;
      }
    });
  }
}
c(Ff, "compileCinematicEntries");
function Hi(n, e, t) {
  if (n != null) {
    if (typeof n != "object" || Array.isArray(n)) {
      t.push({ path: e, level: "error", message: `Expected object, got ${Array.isArray(n) ? "array" : typeof n}` });
      return;
    }
    for (const [i, r] of Object.entries(n))
      (typeof r != "object" || r === null || Array.isArray(r)) && t.push({ path: `${e}["${i}"]`, level: "error", message: `Expected property overrides object, got ${Array.isArray(r) ? "array" : typeof r}` });
  }
}
c(Hi, "validateStateMap");
function Hl(n, e, t, i) {
  var r;
  for (let a = 0; a < n.length; a++) {
    const o = n[a], s = `${e}[${a}]`;
    if (!(o.delay != null || o.await != null || o.emit != null) && !(o.transitionTo != null || o.sound != null || o.stopSound != null)) {
      if ((r = o.parallel) != null && r.branches) {
        for (let l = 0; l < o.parallel.branches.length; l++)
          Hl(o.parallel.branches[l], `${s}.parallel.branches[${l}]`, t, i);
        continue;
      }
      if (Hi(o.before, `${s}.before`, i), Hi(o.after, `${s}.after`, i), o.tweens)
        for (let l = 0; l < o.tweens.length; l++) {
          const u = o.tweens[l], d = `${s}.tweens[${l}]`;
          if (!u.type) {
            i.push({ path: d, level: "error", message: "Missing 'type' field" });
            continue;
          }
          const m = ir(u.type);
          if (!m) {
            i.push({ path: d, level: "error", message: `Unknown tween type: "${u.type}"` });
            continue;
          }
          if (t)
            try {
              const f = xf(u, t);
              f ? m.validate(f.params) : u.target && i.push({ path: d, level: "warn", message: `Target "${u.target}" could not be resolved for compilation` });
            } catch (f) {
              i.push({ path: d, level: "error", message: f.message });
            }
          t && u.target && !t.has(u.target) && i.push({ path: `${d}.target`, level: "warn", message: `Target "${u.target}" is not resolved` });
        }
    }
  }
}
c(Hl, "validateEntries");
function Ry(n, e = null) {
  var i;
  const t = [];
  if (!n || typeof n != "object")
    return t.push({ path: "", level: "error", message: "Cinematic data is not an object" }), t;
  if (n.segments) {
    n.entry ? n.segments[n.entry] || t.push({ path: "entry", level: "error", message: `Entry segment "${n.entry}" not found in segments` }) : t.push({ path: "entry", level: "error", message: "Missing 'entry' field" });
    const r = /* @__PURE__ */ new Set();
    let a = n.entry;
    for (; a && typeof a == "string"; ) {
      if (r.has(a)) {
        t.push({ path: `segments.${a}.next`, level: "error", message: `Cycle detected in segment graph at "${a}"` });
        break;
      }
      r.add(a), a = (i = n.segments[a]) == null ? void 0 : i.next;
    }
    for (const [o, s] of Object.entries(n.segments)) {
      const l = `segments.${o}`;
      Hi(s.setup, `${l}.setup`, t), Hi(s.landing, `${l}.landing`, t), s.timeline && Array.isArray(s.timeline) && Hl(s.timeline, `${l}.timeline`, e, t), s.next && typeof s.next == "string" && !n.segments[s.next] && t.push({ path: `${l}.next`, level: "error", message: `Next segment "${s.next}" not found` });
    }
  } else
    Hi(n.setup, "setup", t), Hi(n.landing, "landing", t), n.timeline && Array.isArray(n.timeline) && Hl(n.timeline, "timeline", e, t);
  return t;
}
c(Ry, "validateCinematicDeep");
const Ls = 5, yu = /* @__PURE__ */ new Set(["click", "tile-click", "keypress"]);
var le, he, Ue, Me, gt, yr, ql, Df, Y, $e, xa, Le, wt;
const se = class se {
  constructor(e = null, { loadedHash: t = null, cinematicName: i = "default", segmentName: r = null } = {}) {
    k(this, Y);
    k(this, le);
    k(this, he);
    k(this, Ue);
    k(this, Me);
    var o;
    L(this, le, e ?? se.empty()), L(this, he, i), L(this, Me, t);
    const a = (o = h(this, le).cinematics) == null ? void 0 : o[h(this, he)];
    L(this, Ue, r ?? (a == null ? void 0 : a.entry) ?? "main");
  }
  static empty() {
    return {
      version: Ls,
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
    const { trigger: t, tracking: i, synchronized: r, setup: a, landing: o, timeline: s = [] } = e;
    if (!s.some(
      (b) => {
        var v;
        return b.await != null && yu.has(((v = b.await) == null ? void 0 : v.event) ?? "click");
      }
    )) {
      const b = s.filter((I) => I.transitionTo == null), v = s.find((I) => I.transitionTo != null), S = { timeline: b };
      if (a && Object.keys(a).length && (S.setup = a), o && Object.keys(o).length && (S.landing = o), v) {
        const I = v.transitionTo;
        I.scene && I.cinematic ? S.next = { segment: I.cinematic, scene: I.scene } : I.cinematic;
      }
      return {
        trigger: t,
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
      const b = `segment-${m++}`, v = { timeline: [...d] };
      return f && (v.gate = f), u[b] = v, g.push(b), d = [], f = null, b;
    }
    c(p, "flushSegment");
    for (const b of s)
      if (b.transitionTo == null) {
        if (b.await != null && yu.has(((w = b.await) == null ? void 0 : w.event) ?? "click")) {
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
      const b = y.transitionTo, v = u[g[g.length - 1]];
      b.scene && b.cinematic && (v.next = { segment: b.cinematic, scene: b.scene });
    }
    return {
      trigger: t,
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
    const t = foundry.utils.deepClone(e);
    for (const a of Object.values(t.segments))
      (i = a.timeline) != null && i.length && (a.timeline = C(r = se, gt, ql).call(r, a.timeline));
    return t;
  }
  static fromScene(e, t = "default") {
    var o;
    const i = e == null ? void 0 : e.getFlag(T, "cinematic");
    let r = i ? foundry.utils.deepClone(i) : null;
    const a = i ? C(o = se, gt, Df).call(o, i) : null;
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
      r.version = Ls;
    }
    return new se(r, { loadedHash: a, cinematicName: t });
  }
  /**
   * Check if the scene's cinematic flag has been modified since this state was loaded.
   * @param {object} scene  The Foundry scene document
   * @returns {boolean} true if scene data differs from what was loaded
   */
  isStale(e) {
    if (!h(this, Me)) return !1;
    const t = e == null ? void 0 : e.getFlag(T, "cinematic");
    return t ? !foundry.utils.objectsEqual(t, h(this, Me)) : !1;
  }
  // ── Read ──────────────────────────────────────────────────────────────
  get data() {
    return h(this, le);
  }
  get trigger() {
    return h(this, Y, $e).trigger;
  }
  get tracking() {
    return h(this, Y, $e).tracking;
  }
  get synchronized() {
    return h(this, Y, $e).synchronized ?? !1;
  }
  get activeCinematicName() {
    return h(this, he);
  }
  // ── Segment accessors ────────────────────────────────────────────────
  get segments() {
    return h(this, Y, $e).segments;
  }
  get entry() {
    return h(this, Y, $e).entry;
  }
  get activeSegmentName() {
    return h(this, Ue);
  }
  get activeSegment() {
    var e;
    return ((e = h(this, Y, $e).segments) == null ? void 0 : e[h(this, Ue)]) ?? null;
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
    var e, t;
    return !((t = (e = this.activeSegment) == null ? void 0 : e.timeline) != null && t.length);
  }
  // ── Multi-cinematic management ────────────────────────────────────────
  listCinematicNames() {
    return Object.keys(h(this, le).cinematics);
  }
  switchCinematic(e) {
    if (!h(this, le).cinematics[e]) return this;
    const t = h(this, le).cinematics[e];
    return new se(foundry.utils.deepClone(h(this, le)), {
      loadedHash: h(this, Me),
      cinematicName: e,
      segmentName: t.entry ?? "main"
    });
  }
  addCinematic(e) {
    if (!e || h(this, le).cinematics[e]) return this;
    const t = foundry.utils.deepClone(h(this, le));
    return t.cinematics[e] = se.emptyCinematic(), new se(t, {
      loadedHash: h(this, Me),
      cinematicName: e,
      segmentName: "main"
    });
  }
  removeCinematic(e) {
    if (Object.keys(h(this, le).cinematics).length <= 1) return this;
    if (!h(this, le).cinematics[e]) return this;
    const i = foundry.utils.deepClone(h(this, le));
    delete i.cinematics[e];
    const r = h(this, he) === e ? Object.keys(i.cinematics)[0] : h(this, he), a = i.cinematics[r];
    return new se(i, {
      loadedHash: h(this, Me),
      cinematicName: r,
      segmentName: (a == null ? void 0 : a.entry) ?? "main"
    });
  }
  renameCinematic(e, t) {
    if (!e || !t || e === t) return this;
    if (!h(this, le).cinematics[e]) return this;
    if (h(this, le).cinematics[t]) return this;
    const i = foundry.utils.deepClone(h(this, le)), r = {};
    for (const [o, s] of Object.entries(i.cinematics))
      r[o === e ? t : o] = s;
    i.cinematics = r;
    const a = h(this, he) === e ? t : h(this, he);
    return new se(i, {
      loadedHash: h(this, Me),
      cinematicName: a,
      segmentName: h(this, Ue)
    });
  }
  // ── Cinematic-level mutations ─────────────────────────────────────────
  setTrigger(e) {
    return C(this, Y, xa).call(this, { trigger: e });
  }
  setTracking(e) {
    return C(this, Y, xa).call(this, { tracking: e });
  }
  setSynchronized(e) {
    return C(this, Y, xa).call(this, { synchronized: e });
  }
  // ── Segment-level mutations (setup/landing now live on segments) ──────
  setSetup(e) {
    return C(this, Y, Le).call(this, { setup: e });
  }
  setLanding(e) {
    return C(this, Y, Le).call(this, { landing: e });
  }
  // ── Segment management methods ────────────────────────────────────────
  switchSegment(e) {
    var t;
    return (t = h(this, Y, $e).segments) != null && t[e] ? new se(foundry.utils.deepClone(h(this, le)), {
      loadedHash: h(this, Me),
      cinematicName: h(this, he),
      segmentName: e
    }) : this;
  }
  addSegment(e, t = null) {
    var a;
    if (!e || (a = h(this, Y, $e).segments) != null && a[e]) return this;
    const i = foundry.utils.deepClone(h(this, le)), r = i.cinematics[h(this, he)];
    if (r.segments[e] = se.emptySegment(), t && r.segments[t]) {
      const o = r.segments[t].next;
      r.segments[t].next = e, o && (r.segments[e].next = o);
    }
    return new se(i, {
      loadedHash: h(this, Me),
      cinematicName: h(this, he),
      segmentName: e
    });
  }
  removeSegment(e) {
    var s, l;
    if (Object.keys(h(this, Y, $e).segments ?? {}).length <= 1) return this;
    if (!((s = h(this, Y, $e).segments) != null && s[e])) return this;
    const i = foundry.utils.deepClone(h(this, le)), r = i.cinematics[h(this, he)], a = r.segments[e].next;
    for (const [, u] of Object.entries(r.segments))
      (u.next === e || typeof u.next == "object" && ((l = u.next) == null ? void 0 : l.segment) === e) && (u.next = a ?? void 0, u.next || delete u.next);
    delete r.segments[e], r.entry === e && (r.entry = Object.keys(r.segments)[0]);
    const o = h(this, Ue) === e ? r.entry : h(this, Ue);
    return new se(i, {
      loadedHash: h(this, Me),
      cinematicName: h(this, he),
      segmentName: o
    });
  }
  renameSegment(e, t) {
    var s, l, u;
    if (!e || !t || e === t) return this;
    if (!((s = h(this, Y, $e).segments) != null && s[e])) return this;
    if ((l = h(this, Y, $e).segments) != null && l[t]) return this;
    const i = foundry.utils.deepClone(h(this, le)), r = i.cinematics[h(this, he)], a = {};
    for (const [d, m] of Object.entries(r.segments))
      a[d === e ? t : d] = m;
    r.segments = a;
    for (const [, d] of Object.entries(r.segments))
      d.next === e ? d.next = t : typeof d.next == "object" && ((u = d.next) == null ? void 0 : u.segment) === e && (d.next.segment = t);
    r.entry === e && (r.entry = t);
    const o = h(this, Ue) === e ? t : h(this, Ue);
    return new se(i, {
      loadedHash: h(this, Me),
      cinematicName: h(this, he),
      segmentName: o
    });
  }
  setSegmentGate(e) {
    return C(this, Y, Le).call(this, { gate: e ?? void 0 });
  }
  setSegmentNext(e) {
    return C(this, Y, Le).call(this, { next: e ?? void 0 });
  }
  setSegmentSetup(e) {
    return C(this, Y, Le).call(this, { setup: e });
  }
  setSegmentLanding(e) {
    return C(this, Y, Le).call(this, { landing: e });
  }
  listSegmentNames() {
    return Object.keys(h(this, Y, $e).segments ?? {});
  }
  // ── Timeline entry mutations (scoped to active segment) ──────────────
  addStep(e = -1) {
    const t = [...this.activeSegment.timeline], i = { duration: 1e3, tweens: [] };
    return e < 0 || e >= t.length ? t.push(i) : t.splice(e, 0, i), C(this, Y, Le).call(this, { timeline: t });
  }
  addDelay(e = -1, t = 1e3) {
    const i = [...this.activeSegment.timeline], r = { delay: t };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), C(this, Y, Le).call(this, { timeline: i });
  }
  addAwait(e = -1, t = null) {
    return console.warn(`[${T}] CinematicState.addAwait() is deprecated in v4. Use segment gates instead.`), this;
  }
  addEmit(e = -1, t = "") {
    const i = [...this.activeSegment.timeline], r = { emit: t };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), C(this, Y, Le).call(this, { timeline: i });
  }
  addParallel(e = -1) {
    const t = [...this.activeSegment.timeline], i = { parallel: { branches: [[], []], join: "all", overflow: "detach" } };
    return e < 0 || e >= t.length ? t.push(i) : t.splice(e, 0, i), C(this, Y, Le).call(this, { timeline: t });
  }
  addTransitionTo(e = -1, t = null) {
    return console.warn(`[${T}] CinematicState.addTransitionTo() is deprecated in v4. Use segment next edges instead.`), this;
  }
  addSound(e = -1, t = null) {
    const i = [...this.activeSegment.timeline], r = { sound: t ?? { src: "", volume: 0.8, loop: !1, duration: 0, fireAndForget: !1 } };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), C(this, Y, Le).call(this, { timeline: i });
  }
  addStopSound(e = -1, t = "") {
    const i = [...this.activeSegment.timeline], r = { stopSound: t };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), C(this, Y, Le).call(this, { timeline: i });
  }
  moveEntry(e, t) {
    if (e === t) return this;
    const i = [...this.activeSegment.timeline];
    if (e < 0 || e >= i.length) return this;
    if (t < 0 || t >= i.length) return this;
    const [r] = i.splice(e, 1);
    return i.splice(t, 0, r), C(this, Y, Le).call(this, { timeline: i });
  }
  removeEntry(e) {
    const t = [...this.activeSegment.timeline];
    return e < 0 || e >= t.length ? this : (t.splice(e, 1), C(this, Y, Le).call(this, { timeline: t }));
  }
  updateEntry(e, t) {
    const i = this.activeSegment.timeline.map((r, a) => a !== e ? r : { ...foundry.utils.deepClone(r), ...t });
    return C(this, Y, Le).call(this, { timeline: i });
  }
  // ── Tween mutations ──────────────────────────────────────────────────
  addTween(e, t = null) {
    const i = { type: "tile-prop", target: "", attribute: "alpha", value: 1 };
    return C(this, Y, wt).call(this, e, (r) => {
      const a = [...r.tweens ?? [], t ?? i];
      return { ...r, tweens: a };
    });
  }
  updateTween(e, t, i) {
    return C(this, Y, wt).call(this, e, (r) => {
      const a = (r.tweens ?? []).map((o, s) => s !== t ? o : { ...o, ...i });
      return { ...r, tweens: a };
    });
  }
  removeTween(e, t) {
    return C(this, Y, wt).call(this, e, (i) => {
      const r = (i.tweens ?? []).filter((a, o) => o !== t);
      return { ...i, tweens: r };
    });
  }
  updateStepDuration(e, t) {
    return C(this, Y, wt).call(this, e, (i) => ({ ...i, duration: Math.max(0, t) }));
  }
  // ── Parallel branch mutations ────────────────────────────────────────
  addBranch(e) {
    return C(this, Y, wt).call(this, e, (t) => {
      if (!t.parallel) return t;
      const i = [...t.parallel.branches, []];
      return { ...t, parallel: { ...t.parallel, branches: i } };
    });
  }
  removeBranch(e, t) {
    return C(this, Y, wt).call(this, e, (i) => {
      if (!i.parallel) return i;
      const r = i.parallel.branches.filter((a, o) => o !== t);
      return r.length < 1 ? i : { ...i, parallel: { ...i.parallel, branches: r } };
    });
  }
  addBranchEntry(e, t, i = null) {
    const r = { duration: 1e3, tweens: [] };
    return C(this, Y, wt).call(this, e, (a) => {
      if (!a.parallel) return a;
      const o = a.parallel.branches.map((s, l) => l !== t ? s : [...s, i ?? r]);
      return { ...a, parallel: { ...a.parallel, branches: o } };
    });
  }
  removeBranchEntry(e, t, i) {
    return C(this, Y, wt).call(this, e, (r) => {
      if (!r.parallel) return r;
      const a = r.parallel.branches.map((o, s) => s !== t ? o : o.filter((l, u) => u !== i));
      return { ...r, parallel: { ...r.parallel, branches: a } };
    });
  }
  updateBranchEntry(e, t, i, r) {
    return C(this, Y, wt).call(this, e, (a) => {
      if (!a.parallel) return a;
      const o = a.parallel.branches.map((s, l) => l !== t ? s : s.map((u, d) => d !== i ? u : { ...foundry.utils.deepClone(u), ...r }));
      return { ...a, parallel: { ...a.parallel, branches: o } };
    });
  }
  moveBranchEntry(e, t, i, r) {
    return i === r ? this : C(this, Y, wt).call(this, e, (a) => {
      if (!a.parallel) return a;
      const o = a.parallel.branches.map((s, l) => {
        if (l !== t) return s;
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
    const t = { ...foundry.utils.deepClone(h(this, le)), version: Ls };
    await e.setFlag(T, "cinematic", t);
  }
  /** Returns the active cinematic's data (for validation/export). */
  toJSON() {
    return foundry.utils.deepClone(h(this, Y, $e));
  }
  /** Returns the entire v4 flag structure. */
  toFullJSON() {
    return foundry.utils.deepClone(h(this, le));
  }
};
le = new WeakMap(), he = new WeakMap(), Ue = new WeakMap(), Me = new WeakMap(), gt = new WeakSet(), yr = /* @__PURE__ */ c(function(e) {
  const { duration: t, detach: i, ...r } = e;
  return r;
}, "#stripTween"), ql = /* @__PURE__ */ c(function(e) {
  var i, r;
  const t = [];
  for (const a of e) {
    if (a.delay != null || a.await != null || a.emit != null || a.transitionTo != null || a.sound != null || a.stopSound != null) {
      t.push(a);
      continue;
    }
    if ((i = a.parallel) != null && i.branches) {
      const l = a.parallel.branches.map(
        (u) => {
          var d;
          return C(d = se, gt, ql).call(d, u);
        }
      );
      t.push({ ...a, parallel: { ...a.parallel, branches: l } });
      continue;
    }
    if (!((r = a.tweens) != null && r.length)) {
      t.push({ duration: 500, ...a });
      continue;
    }
    const o = [], s = [];
    for (const l of a.tweens)
      l.detach ? s.push(l) : o.push(l);
    if (s.length === 0) {
      const l = Math.max(500, ...a.tweens.map((m) => m.duration ?? 0)), { tweens: u, ...d } = a;
      t.push({
        ...d,
        duration: l,
        tweens: u.map(C(se, gt, yr))
      });
    } else if (o.length === 0) {
      const l = Math.max(500, ...s.map((m) => m.duration ?? 0)), { tweens: u, ...d } = a;
      t.push({
        ...d,
        duration: l,
        tweens: s.map(C(se, gt, yr))
      });
    } else {
      const l = Math.max(500, ...o.map((f) => f.duration ?? 0)), u = Math.max(500, ...s.map((f) => f.duration ?? 0)), { tweens: d, ...m } = a;
      t.push({
        parallel: {
          branches: [
            [{ ...m, duration: l, tweens: o.map(C(se, gt, yr)) }],
            [{ duration: u, tweens: s.map(C(se, gt, yr)) }]
          ],
          join: "all",
          overflow: "detach"
        }
      });
    }
  }
  return t;
}, "#migrateTimelineV5"), Df = /* @__PURE__ */ c(function(e) {
  return foundry.utils.deepClone(e);
}, "#computeHash"), Y = new WeakSet(), $e = /* @__PURE__ */ c(function() {
  return h(this, le).cinematics[h(this, he)];
}, "#active"), // ── Internal ─────────────────────────────────────────────────────────
/** Clone the full state with a patch to the active cinematic (cinematic-level props). */
xa = /* @__PURE__ */ c(function(e) {
  const t = foundry.utils.deepClone(h(this, le));
  return Object.assign(t.cinematics[h(this, he)], e), new se(t, {
    loadedHash: h(this, Me),
    cinematicName: h(this, he),
    segmentName: h(this, Ue)
  });
}, "#cloneActive"), /** Clone the full state with a patch to the active segment within the active cinematic. */
Le = /* @__PURE__ */ c(function(e) {
  const t = foundry.utils.deepClone(h(this, le)), i = t.cinematics[h(this, he)].segments[h(this, Ue)];
  if (!i) return this;
  Object.assign(i, e);
  for (const [r, a] of Object.entries(i))
    a === void 0 && delete i[r];
  return new se(t, {
    loadedHash: h(this, Me),
    cinematicName: h(this, he),
    segmentName: h(this, Ue)
  });
}, "#cloneActiveSegment"), /** Mutate a single timeline entry within the active segment. */
wt = /* @__PURE__ */ c(function(e, t) {
  const i = this.activeSegment;
  if (!i || e < 0 || e >= i.timeline.length) return this;
  const r = i.timeline.map((a, o) => o !== e ? a : t(foundry.utils.deepClone(a)));
  return C(this, Y, Le).call(this, { timeline: r });
}, "#mutateEntry"), k(se, gt), c(se, "CinematicState");
let Yt = se;
const bu = [
  { value: "tile-prop", label: "Tile Prop" },
  { value: "light-color", label: "Light Color" },
  { value: "light-state", label: "Light State" },
  { value: "particles-prop", label: "Particles Prop" },
  { value: "camera-pan", label: "Camera Pan" },
  { value: "token-prop", label: "Token Prop" },
  { value: "drawing-prop", label: "Drawing Prop" },
  { value: "sound-prop", label: "Sound Prop" }
], Pf = {
  "tile-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y, width, height" },
  "token-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y" },
  "drawing-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y" },
  "sound-prop": { form: "prop", attribute: "volume", value: 0.5, placeholder: "volume, radius" },
  "particles-prop": { form: "particles", attribute: "alpha", value: 1, placeholder: "alpha, rate, speed, size" },
  "camera-pan": { form: "camera", x: 0, y: 0, scale: 1 },
  "light-color": { form: "lightColor", toColor: "#ffffff", toAlpha: "", mode: "oklch" },
  "light-state": { form: "lightState", enabled: !0 }
}, Hy = [
  { value: "canvasReady", label: "Canvas Ready" },
  { value: "manual", label: "Manual Only" }
];
function vu(n) {
  return n && (n.split("/").pop() || "").replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "-") || "";
}
c(vu, "soundIdFromPath");
function wu(n) {
  return n ? new Promise((e) => {
    const t = new Audio(n);
    t.addEventListener("loadedmetadata", () => {
      e(Math.round(t.duration * 1e3));
    }), t.addEventListener("error", () => e(0));
  }) : Promise.resolve(0);
}
c(wu, "loadAudioDurationMs");
const Rn = 40, Cr = 24, $r = 50, Eu = 50, ei = 60, ri = 10, Is = 16, Rf = 40, Hf = 20, qy = 90, Cu = 70, Su = 8;
function as(n) {
  return { stepDuration: Math.max(500, n.duration ?? 500), detachOverflow: 0 };
}
c(as, "computeStepDurations");
function jy(n) {
  var i;
  const e = ((i = n.parallel) == null ? void 0 : i.branches) ?? [];
  let t = 0;
  for (const r of e) {
    let a = 0;
    for (const o of r)
      o.delay != null ? a += o.delay : o.await != null || o.emit != null || (o.sound != null ? a += o.sound.fireAndForget ? 0 : o.sound.duration ?? 0 : o.stopSound != null || (a += as(o).stepDuration));
    t = Math.max(t, a);
  }
  return Math.max(500, t);
}
c(jy, "computeParallelDuration");
function Sc(n) {
  return n.reduce((e, t) => t.delay != null ? e + t.delay : t.await != null || t.emit != null || t.transitionTo != null ? e : t.sound != null ? e + (t.sound.fireAndForget ? 0 : t.sound.duration ?? 0) : t.stopSound != null ? e : t.parallel != null ? e + jy(t) : e + as(t).stepDuration, 0);
}
c(Sc, "computeTotalDuration");
function By(n, e) {
  if (n <= 0) return 0.1;
  const t = e / n;
  return Math.max(0.03, Math.min(0.5, t));
}
c(By, "computeScale");
function qf(n) {
  const e = n.tweens ?? [];
  if (e.length === 0) return "Empty";
  const t = e[0], i = (t.target ?? "").replace(/^tag:/, "#"), r = t.attribute ?? "";
  return t.type === "camera-pan" ? "Pan" : r === "alpha" ? `Fade ${i}` : r === "x" || r === "y" ? `Move ${i}` : t.type === "light-color" ? `Light ${i}` : t.type === "sound-prop" ? `Sound ${i}` : i ? `${i}` : "Step";
}
c(qf, "deriveStepLabel");
function Uy(n, e, t, i, r) {
  var u, d;
  const a = [], o = [], s = [];
  let l = e;
  for (let m = 0; m < n.length; m++) {
    const f = n[m], g = `${i}.${m}`, p = r === g;
    if (f.delay != null) {
      const y = Math.max(Hf, f.delay * t);
      a.push({ type: "delay", leftPx: l, widthPx: y, label: `${f.delay}ms`, entryPath: g, selected: p }), l += y;
    } else if (f.await != null) {
      const y = ((u = f.await) == null ? void 0 : u.event) ?? "click", w = y === "tile-click" ? "fa-hand-pointer" : y === "signal" ? "fa-bolt" : "fa-pause";
      a.push({ type: "await", leftPx: l, widthPx: Is, label: y, entryPath: g, selected: p, isGate: !0, gateIcon: w }), ((d = f.await) == null ? void 0 : d.event) === "signal" && s.push({ signal: f.await.signal, centerPx: l + Is / 2 }), l += Is;
    } else if (f.emit != null)
      a.push({ type: "emit", leftPx: l, widthPx: ri, label: "emit", entryPath: g, selected: p, isMarker: !0 }), o.push({ signal: f.emit, centerPx: l + ri / 2 });
    else if (f.sound != null) {
      const y = (f.sound.src || "").split("/").pop() || "Sound", w = f.sound.duration ?? 0;
      if (f.sound.fireAndForget ?? !1)
        a.push({ type: "sound", leftPx: l, widthPx: ri, label: y, entryPath: g, selected: p, isMarker: !0 });
      else {
        const v = w > 0 ? Math.max(ei, w * t) : ei, S = (f.sound.loop ?? !1) && w <= 0;
        a.push({ type: "sound", leftPx: l, widthPx: v, label: y, entryPath: g, selected: p, hasTrailingArrow: S }), l += v;
      }
    } else if (f.stopSound != null)
      a.push({ type: "stopSound", leftPx: l, widthPx: ri, label: "Stop", entryPath: g, selected: p, isMarker: !0 });
    else {
      const { stepDuration: y } = as(f), w = Math.max(Rf, y * t), b = qf(f);
      a.push({ type: "step", leftPx: l, widthPx: w, label: b, entryPath: g, selected: p }), l += w;
    }
  }
  return { blocks: a, width: l - e, emits: o, awaits: s };
}
c(Uy, "computeBranchLane");
function Tu(n) {
  return Cr + n * Rn;
}
c(Tu, "laneIndexToY");
function Vy(n, e) {
  const t = [];
  for (const i of n.emits)
    for (const r of n.awaits) {
      if (i.signal !== r.signal) continue;
      const a = i.centerPx, o = Tu(i.laneIndex) + Rn / 2, s = r.centerPx, l = Tu(r.laneIndex) + Rn / 2, u = l - o, d = (a + s) / 2, m = o + Math.sign(u || 1) * Math.min(40, Math.abs(u) * 0.5 + 20), f = l - Math.sign(u || 1) * Math.min(40, Math.abs(u) * 0.5 + 20);
      t.push({
        pathD: `M ${a} ${o} C ${d} ${m}, ${d} ${f}, ${s} ${l}`,
        signal: i.signal
      });
    }
  return t;
}
c(Vy, "computeSignalArcs");
function zy(n, e) {
  const t = [];
  if (n <= 0) return t;
  const i = e * 1e3;
  let r;
  i >= 200 ? r = 500 : i >= 80 ? r = 1e3 : i >= 40 ? r = 2e3 : r = 5e3;
  for (let a = 0; a <= n + r; a += r) {
    const o = a >= 1e3 ? `${(a / 1e3).toFixed(a % 1e3 === 0 ? 0 : 1)}s` : `${a}ms`;
    t.push({ px: $r + a * e, label: o });
  }
  return t;
}
c(zy, "computeTimeMarkers");
function Gy(n) {
  const e = [];
  for (let t = 0; t < n.length - 1; t++) {
    const i = n[t], r = n[t + 1], a = i.leftPx + i.widthPx + (r.leftPx - (i.leftPx + i.widthPx)) / 2, o = Cr + Rn / 2;
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
c(Gy, "computeInsertionPoints");
function Wy(n, { selectedPath: e, windowWidth: t }) {
  const i = Sc(n), r = t - 70 - 100, a = By(i, r), o = [], s = [], l = { emits: [], awaits: [] }, u = [];
  o.push({
    type: "setup",
    leftPx: 0,
    widthPx: $r,
    label: "Setup",
    entryPath: "setup",
    selected: e === "setup"
  });
  let d = $r;
  for (let v = 0; v < n.length; v++) {
    const S = n[v], I = `timeline.${v}`, A = e === I;
    if (S.delay != null) {
      const O = Math.max(Hf, S.delay * a);
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
        widthPx: ri,
        label: "Emit",
        entryPath: I,
        selected: A,
        isMarker: !0
      }), l.emits.push({
        signal: S.emit,
        centerPx: d + ri / 2,
        laneIndex: 0
      });
    else if (S.sound != null) {
      const O = (S.sound.src || "").split("/").pop() || "Sound", x = S.sound.duration ?? 0;
      if (S.sound.fireAndForget ?? !1) {
        const D = x > 0 ? Math.max(ei, x * a) : ei, F = (S.sound.loop ?? !1) && x <= 0, P = {
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
        const D = x > 0 ? Math.max(ei, x * a) : ei, F = (S.sound.loop ?? !1) && x <= 0;
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
        widthPx: ri,
        label: "Stop",
        entryPath: I,
        selected: A,
        isMarker: !0
      });
    else if (S.parallel != null) {
      const O = S.parallel.branches ?? [], x = d, M = [];
      let D = 0;
      for (let P = 0; P < O.length; P++) {
        const _ = `timeline.${v}.parallel.branches.${P}`, { blocks: H, width: q, emits: j, awaits: B } = Uy(O[P], x, a, _, e);
        M.push({ label: `Br ${P + 1}`, blocks: H }), D = Math.max(D, q);
        const V = s.length * 10 + P + 1;
        for (const J of j) l.emits.push({ ...J, laneIndex: V });
        for (const J of B) l.awaits.push({ ...J, laneIndex: V });
      }
      const F = Math.max(ei, D);
      o.push({
        type: "parallel",
        leftPx: x,
        widthPx: F,
        label: `${O.length} br`,
        entryPath: I,
        selected: A
      }), s.push({ parallelEntryIndex: v, startPx: x, lanes: M }), d += F;
    } else {
      const { stepDuration: O } = as(S), x = Math.max(Rf, O * a), M = qf(S);
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
    widthPx: Eu,
    label: "Landing",
    entryPath: "landing",
    selected: e === "landing"
  }), d += Eu;
  const m = s.flatMap((v) => v.lanes), f = m.length;
  for (const v of u)
    m.push({ label: v.label, blocks: v.blocks });
  const g = Vy(l, m.length), p = [];
  for (let v = 0; v < u.length; v++) {
    const S = f + v;
    for (const I of u[v].blocks) {
      const A = I.leftPx, O = Cr + Rn, x = Cr + (1 + S) * Rn + Rn / 2;
      p.push({ x: A, y1: O, y2: x });
    }
  }
  const y = zy(i, a), w = Gy(o), b = Cr + (1 + m.length) * Rn;
  return {
    mainBlocks: o,
    subLanes: m,
    signalArcs: g,
    fafConnectors: p,
    timeMarkers: y,
    insertionPoints: w,
    totalWidthPx: Math.max(d, 200),
    swimlaneHeightPx: b,
    totalDurationMs: i
  };
}
c(Wy, "computeLanes");
function Yy(n) {
  if (n <= 0) return "0s";
  if (n < 1e3) return `${n}ms`;
  const e = n / 1e3;
  return e % 1 === 0 ? `${e}s` : `${e.toFixed(1)}s`;
}
c(Yy, "formatDuration");
function Jy(n, e) {
  var g, p, y, w;
  const t = n.segments ?? {}, i = n.entry ?? "main", r = Object.keys(t);
  if (r.length === 0)
    return { nodes: [], edges: [], totalWidthPx: 0 };
  const a = /* @__PURE__ */ new Set(), o = [];
  let s = i;
  for (; s && typeof s == "string" && t[s] && !a.has(s); )
    a.add(s), o.push(s), s = t[s].next;
  for (const b of r)
    a.has(b) || o.push(b);
  const l = [];
  let u = Su;
  for (const b of o) {
    const v = t[b], S = Sc(v.timeline ?? []), I = Yy(S), A = b === i, O = b === e, x = !a.has(b), M = qy;
    l.push({
      name: b,
      durationMs: S,
      durationLabel: I,
      isEntry: A,
      isActive: O,
      isOrphan: x,
      leftPx: u,
      widthPx: M,
      hasGate: !!v.gate,
      gateEvent: ((g = v.gate) == null ? void 0 : g.event) ?? null
    }), u += M + Cu;
  }
  const d = [], m = new Map(l.map((b) => [b.name, b]));
  for (const b of o) {
    const v = t[b];
    if (!v.next) continue;
    const S = typeof v.next == "string" ? v.next : (p = v.next) == null ? void 0 : p.segment;
    if (!S) continue;
    const I = m.get(b), A = m.get(S);
    if (!I || !A) continue;
    const O = t[S], x = ((y = O == null ? void 0 : O.gate) == null ? void 0 : y.event) ?? null, M = typeof v.next == "object" && ((w = v.next) == null ? void 0 : w.scene);
    d.push({
      fromName: b,
      toName: S,
      gateLabel: x,
      isCrossScene: M,
      fromRightPx: I.leftPx + I.widthPx,
      toLeftPx: A.leftPx
    });
  }
  const f = u - Cu + Su;
  return { nodes: l, edges: d, totalWidthPx: f };
}
c(Jy, "computeSegmentGraph");
function Un(n) {
  if (!n) return null;
  if (n === "setup") return { type: "setup" };
  if (n === "landing") return { type: "landing" };
  const e = n.split(".");
  if (e[0] === "timeline") {
    const t = Number(e[1]);
    if (e.length === 2) return { type: "timeline", index: t };
    if (e[2] === "parallel" && e[3] === "branches" && e.length >= 6)
      return {
        type: "branch",
        index: t,
        branchIndex: Number(e[4]),
        branchEntryIndex: Number(e[5])
      };
  }
  return null;
}
c(Un, "parseEntryPath");
function io(n, e) {
  var i, r, a, o;
  const t = Un(n);
  return t ? t.type === "setup" ? e.setup : t.type === "landing" ? e.landing : t.type === "timeline" ? e.timeline[t.index] : t.type === "branch" ? (o = (a = (r = (i = e.timeline[t.index]) == null ? void 0 : i.parallel) == null ? void 0 : r.branches) == null ? void 0 : a[t.branchIndex]) == null ? void 0 : o[t.branchEntryIndex] : null : null;
}
c(io, "getEntryAtPath");
function Lu(n) {
  const e = Un(n);
  return !e || e.type !== "timeline" ? null : e.index;
}
c(Lu, "getTimelineIndexFromPath");
function Ky(n) {
  var a, o;
  const e = /* @__PURE__ */ new Set(), i = (a = n.data.cinematics) == null ? void 0 : a[n.activeCinematicName];
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
c(Ky, "countUniqueTargets");
function Xy(n, e) {
  var i, r, a;
  const t = Un(n);
  if (!t) return 0;
  if (t.type === "timeline") {
    let o = 0;
    for (let s = 0; s <= t.index; s++) {
      const l = e.timeline[s];
      l && l.delay == null && l.emit == null && l.parallel == null && l.sound == null && l.stopSound == null && o++;
    }
    return o;
  }
  if (t.type === "branch") {
    const o = ((a = (r = (i = e.timeline[t.index]) == null ? void 0 : i.parallel) == null ? void 0 : r.branches) == null ? void 0 : a[t.branchIndex]) ?? [];
    let s = 0;
    for (let l = 0; l <= t.branchEntryIndex; l++) {
      const u = o[l];
      u && u.delay == null && u.emit == null && u.sound == null && u.stopSound == null && s++;
    }
    return s;
  }
  return 0;
}
c(Xy, "stepNumberForPath");
function Qy(n) {
  return {
    isSetup: !0,
    targetCount: Object.keys(n.setup ?? {}).length
  };
}
c(Qy, "buildSetupDetail");
function Zy(n) {
  return {
    isLanding: !0,
    targetCount: Object.keys(n.landing ?? {}).length
  };
}
c(Zy, "buildLandingDetail");
function eb(n) {
  return { type: "delay", isDelay: !0, delay: n.delay };
}
c(eb, "buildDelayDetail");
function tb(n) {
  return { type: "emit", isEmit: !0, signal: n.emit };
}
c(tb, "buildEmitDetail");
function nb(n) {
  const e = (n.sound.src || "").split("/").pop() || "";
  return {
    type: "sound",
    isSound: !0,
    soundSrc: n.sound.src ?? "",
    soundFilename: e,
    soundId: n.sound.id ?? "",
    soundVolume: n.sound.volume ?? 0.8,
    soundLoop: n.sound.loop ?? !1,
    soundFadeIn: n.sound.fadeIn ?? "",
    soundFadeOut: n.sound.fadeOut ?? "",
    soundDuration: n.sound.duration ?? 0,
    soundFireAndForget: n.sound.fireAndForget ?? !1,
    soundModeForever: (n.sound.loop ?? !1) && !((n.sound.duration ?? 0) > 0)
  };
}
c(nb, "buildSoundDetail");
function ib(n) {
  return {
    type: "stopSound",
    isStopSound: !0,
    stopSoundId: n.stopSound
  };
}
c(ib, "buildStopSoundDetail");
function rb(n, e) {
  var o;
  const t = n.parallel, i = t.join ?? "all", r = t.overflow ?? "detach", a = (t.branches ?? []).map((s, l) => ({
    branchIndex: l,
    label: `Branch ${l + 1}`,
    entries: (s ?? []).map((u, d) => {
      var S, I;
      const m = u.delay != null, f = u.await != null, g = u.emit != null, p = u.sound != null, y = u.stopSound != null, w = !m && !f && !g && !p && !y;
      let b, v;
      return m ? (b = `${u.delay}ms`, v = "delay") : f ? (b = "Await", v = ((S = u.await) == null ? void 0 : S.event) ?? "click") : g ? (b = "Emit", v = u.emit || "(unnamed)") : p ? (b = "Sound", v = (u.sound.src || "").split("/").pop() || "(none)") : y ? (b = "Stop Sound", v = u.stopSound || "(no id)") : (b = "Step", v = `${((I = u.tweens) == null ? void 0 : I.length) ?? 0} tweens`), { branchEntryIndex: d, isDelay: m, isAwait: f, isEmit: g, isSound: p, isStopSound: y, isStep: w, label: b, sub: v };
    })
  }));
  return {
    type: "parallel",
    isParallel: !0,
    branchCount: ((o = t.branches) == null ? void 0 : o.length) ?? 0,
    join: i,
    overflow: r,
    joinIsAll: i === "all",
    joinIsAny: i === "any",
    overflowIsDetach: r === "detach",
    overflowIsCancel: r === "cancel",
    branches: a
  };
}
c(rb, "buildParallelDetail");
function ab(n, e, t, i) {
  const r = bc(), a = (n.tweens ?? []).map((l, u) => {
    const d = `${e}.tweens.${u}`, m = t.has(d), f = l.type ?? "tile-prop", g = bu.find((b) => b.value === f), p = Pf[f], y = (p == null ? void 0 : p.form) ?? "prop", w = l.mode ?? "oklch";
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
      colorMode: w,
      colorModeIsOklch: w === "oklch",
      colorModeIsHsl: w === "hsl",
      colorModeIsRgb: w === "rgb",
      // Light-state fields
      enabled: l.enabled ?? !0,
      typeOptions: bu.map((b) => ({
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
  }), o = Object.keys(n.before ?? {}), s = Object.keys(n.after ?? {});
  return {
    type: "step",
    isStep: !0,
    isDelay: !1,
    stepNumber: Xy(e, i),
    stepDuration: n.duration ?? 1e3,
    tweens: a,
    beforeSummary: o.length ? `${o.length} target${o.length !== 1 ? "s" : ""}` : "(none)",
    afterSummary: s.length ? `${s.length} target${s.length !== 1 ? "s" : ""}` : "(none)"
  };
}
c(ab, "buildStepDetail");
function ob(n, { state: e, expandedTweens: t }) {
  const i = Un(n);
  if (!i) return null;
  if (i.type === "setup") return Qy(e);
  if (i.type === "landing") return Zy(e);
  const r = io(n, e);
  return r ? r.delay != null ? eb(r) : r.emit != null ? tb(r) : r.sound != null ? nb(r) : r.stopSound != null ? ib(r) : r.parallel != null && i.type === "timeline" ? rb(r) : ab(r, n, t, e) : null;
}
c(ob, "buildDetail");
function sb({ state: n, mutate: e }) {
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
        callback: /* @__PURE__ */ c((t) => {
          var r, a, o, s;
          const i = t.find("#cinematic-import-json").val();
          try {
            const l = JSON.parse(i);
            if (typeof l != "object" || l === null || Array.isArray(l))
              throw new Error("Expected a JSON object");
            if (l.cinematics)
              e(() => new Yt(l));
            else if (l.segments !== void 0) {
              const u = { version: 4, cinematics: { [n.activeCinematicName]: l } };
              e(() => new Yt(u, { cinematicName: n.activeCinematicName }));
            } else if (l.timeline !== void 0) {
              const u = { version: 3, cinematics: { [n.activeCinematicName]: l } };
              e(() => new Yt(u, { cinematicName: n.activeCinematicName }));
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
c(sb, "showImportDialog");
function ro(n, { state: e, mutate: t }) {
  const i = n === "setup" ? e.setup : e.landing, r = JSON.stringify(i ?? {}, null, 2);
  new Dialog({
    title: `Edit ${n.charAt(0).toUpperCase() + n.slice(1)}`,
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON map of target selector → property overrides:</p>
			<textarea id="cinematic-json-edit" style="width:100%;height:200px;font-family:monospace;font-size:0.8rem">${$t(r)}</textarea>
		`,
    buttons: {
      save: {
        label: "Apply",
        callback: /* @__PURE__ */ c((a) => {
          var s, l;
          const o = a.find("#cinematic-json-edit").val();
          try {
            const u = JSON.parse(o);
            t(n === "setup" ? (d) => d.setSetup(u) : (d) => d.setLanding(u));
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
c(ro, "showEditJsonDialog");
function Iu(n, { selectedPath: e, state: t, mutate: i }) {
  const r = io(e, t);
  if (!r || r.delay != null) return;
  const a = r[n] ?? {}, o = JSON.stringify(a, null, 2);
  new Dialog({
    title: `Edit Step ${n.charAt(0).toUpperCase() + n.slice(1)}`,
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON map of target selector → property overrides:</p>
			<textarea id="cinematic-json-edit" style="width:100%;height:200px;font-family:monospace;font-size:0.8rem">${$t(o)}</textarea>
		`,
    buttons: {
      save: {
        label: "Apply",
        callback: /* @__PURE__ */ c((s) => {
          var u, d;
          const l = s.find("#cinematic-json-edit").val();
          try {
            const m = JSON.parse(l), f = Un(e);
            (f == null ? void 0 : f.type) === "timeline" ? i((g) => g.updateEntry(f.index, { [n]: m })) : (f == null ? void 0 : f.type) === "branch" && i((g) => g.updateBranchEntry(f.index, f.branchIndex, f.branchEntryIndex, { [n]: m }));
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
c(Iu, "showEditStepStateDialog");
function lb({ selectedPath: n, state: e, mutate: t }) {
  const i = Un(n);
  if (!i || i.type !== "timeline") return;
  const r = e.timeline[i.index];
  if (!(r != null && r.parallel)) return;
  const a = JSON.stringify(r.parallel.branches ?? [], null, 2);
  new Dialog({
    title: "Edit Parallel Branches",
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON array of branch timelines:</p>
			<textarea id="cinematic-json-edit" style="width:100%;height:250px;font-family:monospace;font-size:0.8rem">${$t(a)}</textarea>
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
            t((m) => m.updateEntry(i.index, {
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
c(lb, "showEditParallelJsonDialog");
var Bu, kn, qn, $a, jf;
const Ct = class Ct extends Wn(Gn) {
  constructor(t = {}) {
    super(t);
    k(this, qn);
    k(this, kn, null);
    L(this, kn, t.scene ?? canvas.scene ?? null);
  }
  async _prepareContext() {
    var r, a, o;
    const t = h(this, qn, $a), i = ((a = t == null ? void 0 : t.getSeenStatus) == null ? void 0 : a.call(t, (r = h(this, kn)) == null ? void 0 : r.id)) ?? [];
    return {
      sceneName: ((o = h(this, kn)) == null ? void 0 : o.name) ?? "No scene",
      users: i.map((s) => ({
        ...s,
        statusLabel: s.seen ? "Seen" : "Not seen",
        statusClass: s.seen ? "cinematic-tracking__status--seen" : "cinematic-tracking__status--unseen"
      })),
      hasAnyTracked: i.some((s) => s.seen)
    };
  }
  _onRender(t, i) {
    super._onRender(t, i), C(this, qn, jf).call(this);
  }
};
kn = new WeakMap(), qn = new WeakSet(), $a = /* @__PURE__ */ c(function() {
  var t, i;
  return (i = (t = game.modules.get(T)) == null ? void 0 : t.api) == null ? void 0 : i.cinematic;
}, "#api"), jf = /* @__PURE__ */ c(function() {
  var i, r;
  const t = this.element;
  t instanceof HTMLElement && (t.querySelectorAll("[data-action='reset-user']").forEach((a) => {
    a.addEventListener("click", async () => {
      var l;
      const o = a.dataset.userId;
      if (!o) return;
      const s = h(this, qn, $a);
      s != null && s.resetForUser && (await s.resetForUser((l = h(this, kn)) == null ? void 0 : l.id, o), this.render({ force: !0 }));
    });
  }), (i = t.querySelector("[data-action='reset-all']")) == null || i.addEventListener("click", async () => {
    var o;
    const a = h(this, qn, $a);
    a != null && a.resetForAll && (await a.resetForAll((o = h(this, kn)) == null ? void 0 : o.id), this.render({ force: !0 }));
  }), (r = t.querySelector("[data-action='refresh']")) == null || r.addEventListener("click", () => {
    this.render({ force: !0 });
  }));
}, "#bindEvents"), c(Ct, "CinematicTrackingApplication"), ye(Ct, "APP_ID", `${T}-cinematic-tracking`), ye(Ct, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Re(Ct, Ct, "DEFAULT_OPTIONS"),
  {
    id: Ct.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Bu = Re(Ct, Ct, "DEFAULT_OPTIONS")) == null ? void 0 : Bu.classes) ?? [], "eidolon-cinematic-tracking-window", "themed"])
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
)), ye(Ct, "PARTS", {
  content: {
    template: `modules/${T}/templates/cinematic-tracking.html`
  }
});
let jl = Ct;
function cb(n, e) {
  var t, i, r, a, o, s, l, u, d;
  (t = n.querySelector("[data-action='save']")) == null || t.addEventListener("click", () => e.save()), (i = n.querySelector("[data-action='play-preview']")) == null || i.addEventListener("click", () => e.play()), (r = n.querySelector("[data-action='reset-tracking']")) == null || r.addEventListener("click", () => e.resetTracking()), (a = n.querySelector("[data-action='export-json']")) == null || a.addEventListener("click", () => e.exportJSON()), (o = n.querySelector("[data-action='undo']")) == null || o.addEventListener("click", () => e.undo()), (s = n.querySelector("[data-action='redo']")) == null || s.addEventListener("click", () => e.redo()), (l = n.querySelector("[data-action='validate']")) == null || l.addEventListener("click", () => e.validate()), (u = n.querySelector("[data-action='import-json']")) == null || u.addEventListener("click", () => e.importJSON()), (d = n.querySelector("[data-action='open-tracking']")) == null || d.addEventListener("click", () => {
    new jl({ scene: e.scene }).render(!0);
  });
}
c(cb, "bindToolbarEvents");
function ub(n, e) {
  var t, i, r, a;
  (t = n.querySelector("[data-action='change-cinematic']")) == null || t.addEventListener("change", (o) => {
    e.flushTweenChanges(), e.switchCinematic(o.target.value);
  }), (i = n.querySelector("[data-action='add-cinematic']")) == null || i.addEventListener("click", () => {
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
  }), (r = n.querySelector("[data-action='remove-cinematic']")) == null || r.addEventListener("click", () => {
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
  }), (a = n.querySelector("[data-action='rename-cinematic']")) == null || a.addEventListener("click", () => {
    const o = e.state.activeCinematicName;
    new Dialog({
      title: "Rename Cinematic",
      content: `<label style="display:flex;align-items:center;gap:0.5rem"><span>Name:</span><input id="cinematic-rename" type="text" style="flex:1" value="${$t(o)}" /></label>`,
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
c(ub, "bindCinematicSelectorEvents");
function db(n, e) {
  n.querySelectorAll("[data-action='select-block']").forEach((i) => {
    i.addEventListener("click", (r) => {
      if (r.target.closest("button")) return;
      const a = i.dataset.entryPath;
      e.setSelectedPath(e.selectedPath === a ? null : a);
    });
  });
  let t = null;
  n.querySelectorAll(".cinematic-editor__lane--main [data-action='select-block']").forEach((i) => {
    const r = i.dataset.entryPath;
    r === "setup" || r === "landing" || (i.addEventListener("dragstart", (a) => {
      t = r, i.classList.add("dragging"), a.dataTransfer.effectAllowed = "move";
    }), i.addEventListener("dragover", (a) => {
      a.preventDefault(), a.dataTransfer.dropEffect = "move";
    }), i.addEventListener("dragenter", (a) => {
      a.preventDefault(), i.classList.add("cinematic-editor__block--drag-over");
    }), i.addEventListener("dragleave", () => {
      i.classList.remove("cinematic-editor__block--drag-over");
    }), i.addEventListener("drop", (a) => {
      a.preventDefault(), i.classList.remove("cinematic-editor__block--drag-over");
      const o = i.dataset.entryPath;
      if (t && t !== o) {
        const s = Lu(t), l = Lu(o);
        s != null && l != null && (e.selectedPath === t && e.setSelectedPath(o), e.mutate((u) => u.moveEntry(s, l)));
      }
      t = null;
    }), i.addEventListener("dragend", () => {
      i.classList.remove("dragging"), t = null;
    }));
  }), n.querySelectorAll("[data-action='show-insert-menu']").forEach((i) => {
    i.addEventListener("click", (r) => {
      r.stopPropagation();
      const a = Number(i.dataset.insertIndex), o = i.dataset.lane;
      e.showInsertMenu(i, a, o);
    });
  }), n.querySelectorAll("[data-action='insert-entry']").forEach((i) => {
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
c(db, "bindSwimlaneEvents");
function fb(n, e) {
  var t, i, r, a, o, s, l, u, d, m, f;
  (t = n.querySelector("[data-action='delete-entry']")) == null || t.addEventListener("click", () => {
    const g = e.parseEntryPath(e.selectedPath);
    g && (g.type === "timeline" ? (e.mutate((p) => p.removeEntry(g.index)), e.setSelectedPath(null)) : g.type === "branch" && (e.mutate((p) => p.removeBranchEntry(g.index, g.branchIndex, g.branchEntryIndex)), e.setSelectedPath(null)));
  }), (i = n.querySelector("[data-action='step-duration']")) == null || i.addEventListener("input", (g) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = Number(g.target.value) || 0;
    p.type === "timeline" ? e.mutate((w) => w.updateStepDuration(p.index, y)) : p.type === "branch" && e.mutate((w) => w.updateBranchEntry(p.index, p.branchIndex, p.branchEntryIndex, { duration: Math.max(0, y) }));
  }), (r = n.querySelector("[data-action='add-tween']")) == null || r.addEventListener("click", () => {
    const g = e.parseEntryPath(e.selectedPath);
    if (g) {
      if (g.type === "timeline")
        e.mutate((p) => p.addTween(g.index));
      else if (g.type === "branch") {
        const p = e.getEntryAtPath(e.selectedPath);
        if (!p) return;
        const y = { type: "tile-prop", target: "", attribute: "alpha", value: 1 }, w = [...p.tweens ?? [], y];
        e.mutate((b) => b.updateBranchEntry(g.index, g.branchIndex, g.branchEntryIndex, { tweens: w }));
      }
    }
  }), (a = n.querySelector("[data-action='change-delay']")) == null || a.addEventListener("change", (g) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = Number(g.target.value) || 0;
    p.type === "timeline" ? e.mutate((w) => w.updateEntry(p.index, { delay: y })) : p.type === "branch" && e.mutate((w) => w.updateBranchEntry(p.index, p.branchIndex, p.branchEntryIndex, { delay: y }));
  }), (o = n.querySelector("[data-action='edit-setup']")) == null || o.addEventListener("click", () => {
    ro("setup", { state: e.state, mutate: e.mutate });
  }), (s = n.querySelector("[data-action='edit-landing']")) == null || s.addEventListener("click", () => {
    ro("landing", { state: e.state, mutate: e.mutate });
  }), (l = n.querySelector("[data-action='edit-before']")) == null || l.addEventListener("click", () => {
    Iu("before", { selectedPath: e.selectedPath, state: e.state, mutate: e.mutate });
  }), (u = n.querySelector("[data-action='edit-after']")) == null || u.addEventListener("click", () => {
    Iu("after", { selectedPath: e.selectedPath, state: e.state, mutate: e.mutate });
  }), (d = n.querySelector("[data-action='change-trigger']")) == null || d.addEventListener("change", (g) => {
    e.mutate((p) => p.setTrigger(g.target.value));
  }), (m = n.querySelector("[data-action='change-tracking']")) == null || m.addEventListener("change", (g) => {
    e.mutate((p) => p.setTracking(g.target.checked));
  }), (f = n.querySelector("[data-action='change-synchronized']")) == null || f.addEventListener("change", (g) => {
    e.mutate((p) => p.setSynchronized(g.target.checked));
  });
}
c(fb, "bindDetailPanelEvents");
const Zi = /* @__PURE__ */ new WeakMap(), ao = /* @__PURE__ */ new Set(), oo = /* @__PURE__ */ new Set(), Ou = {
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
function so(n, e = {}) {
  var p, y, w;
  if (!n) return !1;
  er(n);
  const t = e.mode ?? (e.color != null ? "custom" : "hover"), i = Ou[t] ?? Ou.hover, r = e.color ?? i.borderColor, a = e.alpha ?? i.borderAlpha, o = e.color ?? i.spriteTint, s = i.spriteAlpha, l = e.pulse ?? i.pulse, u = { border: null, sprite: null, pulseData: null, mode: t }, d = ((p = n.document) == null ? void 0 : p.width) ?? n.w ?? 100, m = ((y = n.document) == null ? void 0 : y.height) ?? n.h ?? 100, f = new PIXI.Graphics();
  f.lineStyle(i.borderWidth, r, a), f.drawRect(0, 0, d, m), n.addChild(f), u.border = f;
  const g = mb(n, o, s);
  if (g && (canvas.controls.debug.addChild(g), oo.add(g), u.sprite = g), l && ((w = canvas.app) != null && w.ticker)) {
    const b = {
      elapsed: 0,
      fn: /* @__PURE__ */ c((v) => {
        b.elapsed += v;
        const S = (Math.sin(b.elapsed * 0.05) + 1) / 2;
        u.border && (u.border.alpha = a * (0.4 + 0.6 * S)), u.sprite && (u.sprite.alpha = s * (0.5 + 0.5 * S));
      }, "fn")
    };
    canvas.app.ticker.add(b.fn), u.pulseData = b, ao.add(b);
  }
  return Zi.set(n, u), !0;
}
c(so, "addHighlight");
function er(n) {
  var t, i;
  if (!n) return;
  const e = Zi.get(n);
  e && (e.pulseData && ((i = (t = canvas.app) == null ? void 0 : t.ticker) == null || i.remove(e.pulseData.fn), ao.delete(e.pulseData)), e.border && (e.border.parent && e.border.parent.removeChild(e.border), e.border.destroy({ children: !0 })), e.sprite && (e.sprite.parent && e.sprite.parent.removeChild(e.sprite), e.sprite.destroy({ children: !0 }), oo.delete(e.sprite)), Zi.delete(n));
}
c(er, "removeHighlight");
function Bf(n) {
  return Zi.has(n);
}
c(Bf, "hasHighlight");
function Fa() {
  var e, t, i, r, a, o, s;
  for (const l of ao)
    (t = (e = canvas.app) == null ? void 0 : e.ticker) == null || t.remove(l.fn);
  ao.clear();
  for (const l of oo)
    l.parent && l.parent.removeChild(l), l.destroy({ children: !0 });
  oo.clear();
  const n = [
    (i = canvas.tiles) == null ? void 0 : i.placeables,
    (r = canvas.tokens) == null ? void 0 : r.placeables,
    (a = canvas.lighting) == null ? void 0 : a.placeables,
    (o = canvas.drawings) == null ? void 0 : o.placeables,
    (s = canvas.sounds) == null ? void 0 : s.placeables
  ];
  for (const l of n)
    if (l)
      for (const u of l) {
        const d = Zi.get(u);
        d && (d.border && (d.border.parent && d.border.parent.removeChild(d.border), d.border.destroy({ children: !0 })), Zi.delete(u));
      }
}
c(Fa, "clearAllHighlights");
function mb(n, e, t) {
  var a;
  const i = n.mesh;
  if (!((a = i == null ? void 0 : i.texture) != null && a.baseTexture)) return null;
  const r = PIXI.Sprite.from(i.texture);
  return r.isSprite = !0, r.anchor.set(i.anchor.x, i.anchor.y), r.width = i.width, r.height = i.height, r.scale = i.scale, r.position = n.center, r.angle = i.angle, r.alpha = t, r.tint = e, r.name = "eidolonPickerHighlight", r;
}
c(mb, "createTintSprite");
let ti = null;
function Uf(n) {
  var p, y, w;
  ti && ti.cancel();
  const { placeableType: e = "Tile", onPick: t, onCancel: i } = n;
  let r = null;
  const a = `control${e}`, o = `hover${e}`, s = /* @__PURE__ */ c((b, v) => {
    var I;
    if (!v) return;
    const S = b.document ?? b;
    (I = b.release) == null || I.call(b), t(S);
  }, "onControl"), l = /* @__PURE__ */ c((b, v) => {
    v ? (r = b, so(b, { mode: "pick" })) : r === b && (er(b), r = null);
  }, "onHoverIn"), u = /* @__PURE__ */ c((b) => {
    b.key === "Escape" && (b.preventDefault(), b.stopPropagation(), g());
  }, "onKeydown"), d = /* @__PURE__ */ c((b) => {
    b.preventDefault(), g();
  }, "onContextMenu"), m = Hooks.on(a, s), f = Hooks.on(o, l);
  document.addEventListener("keydown", u, { capture: !0 }), (p = canvas.stage) == null || p.addEventListener("rightclick", d), (w = (y = ui.notifications) == null ? void 0 : y.info) == null || w.call(y, `Pick mode active — click a ${e.toLowerCase()} on the canvas, or press ESC to cancel.`, { permanent: !1 });
  function g() {
    var b;
    ti && (ti = null, Hooks.off(a, m), Hooks.off(o, f), document.removeEventListener("keydown", u, { capture: !0 }), (b = canvas.stage) == null || b.removeEventListener("rightclick", d), r && (er(r), r = null), i == null || i());
  }
  return c(g, "cancel"), ti = { cancel: g }, { cancel: g };
}
c(Uf, "enterPickMode");
function br() {
  ti && ti.cancel();
}
c(br, "cancelPickMode");
const hb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cancelPickMode: br,
  enterPickMode: Uf
}, Symbol.toStringTag, { value: "Module" }));
var Uu, _e, Ve, Xr, Mn, Qr, Zr, et, _n, fe, Vf, Bl, zf, Gf, Wf, Ul, Vl, Yf, Jf;
const dt = class dt extends Wn(Gn) {
  /**
   * @param {object} options
   * @param {string[]} [options.selections]  Initial selections
   * @param {string} [options.placeableType]  "Tile", "Token", etc.
   * @param {(selectors: string[]) => void} [options.onApply]
   * @param {() => void} [options.onCancel]
   */
  constructor(t = {}) {
    super(t);
    k(this, fe);
    /** @type {string[]} Current selections (selector strings). */
    k(this, _e, []);
    /** @type {boolean} Whether pick mode is active. */
    k(this, Ve, !1);
    /** @type {string} Placeable type (Tile, Token, etc.). */
    k(this, Xr, "Tile");
    /** @type {string} Current tag match mode. */
    k(this, Mn, "any");
    /** @type {((selectors: string[]) => void) | null} */
    k(this, Qr, null);
    /** @type {(() => void) | null} */
    k(this, Zr, null);
    /** @type {Promise resolve function for the open() API. */
    k(this, et, null);
    /** @type {PlaceableObject | null} Currently hovered tile in the browser. */
    k(this, _n, null);
    L(this, _e, [...t.selections ?? []]), L(this, Xr, t.placeableType ?? "Tile"), L(this, Qr, t.onApply ?? null), L(this, Zr, t.onCancel ?? null);
  }
  // ── Context ───────────────────────────────────────────────────────────
  async _prepareContext() {
    var r;
    const t = C(this, fe, Ul).call(this), i = (((r = canvas.tiles) == null ? void 0 : r.placeables) ?? []).map((a, o) => {
      var d, m;
      const s = a.document, l = s.id, u = (d = s.texture) != null && d.src ? s.texture.src.split("/").pop().replace(/\.[^.]+$/, "") : `Tile ${o + 1}`;
      return {
        id: l,
        name: u.length > 20 ? u.slice(0, 18) + "..." : u,
        thumbnailSrc: ((m = s.texture) == null ? void 0 : m.src) ?? null,
        selected: t.has(l)
      };
    });
    return {
      selections: h(this, _e),
      selectionCount: h(this, _e).length,
      pickModeActive: h(this, Ve),
      tagModeIsAny: h(this, Mn) === "any",
      tagModeIsAll: h(this, Mn) === "all",
      tagPreviewCount: 0,
      tiles: i,
      tileCount: i.length
    };
  }
  // ── Render & Events ───────────────────────────────────────────────────
  _onRender(t, i) {
    super._onRender(t, i), C(this, fe, Vf).call(this), C(this, fe, Vl).call(this);
  }
  async _onClose(t) {
    return h(this, Ve) && (br(), L(this, Ve, !1)), Fa(), h(this, et) && (h(this, et).call(this, null), L(this, et, null)), super._onClose(t);
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
  static open(t = {}) {
    return new Promise((i) => {
      const r = new dt({
        ...t,
        onApply: /* @__PURE__ */ c((a) => i(a), "onApply"),
        onCancel: /* @__PURE__ */ c(() => i(null), "onCancel")
      });
      L(r, et, i), r.render(!0);
    });
  }
};
_e = new WeakMap(), Ve = new WeakMap(), Xr = new WeakMap(), Mn = new WeakMap(), Qr = new WeakMap(), Zr = new WeakMap(), et = new WeakMap(), _n = new WeakMap(), fe = new WeakSet(), Vf = /* @__PURE__ */ c(function() {
  var a, o, s, l;
  const t = this.element;
  if (!(t instanceof HTMLElement)) return;
  const i = t.querySelector("[data-role='tag-input']"), r = t.querySelector("[data-role='tag-mode']");
  r == null || r.addEventListener("change", (u) => {
    L(this, Mn, u.target.value);
  }), i == null || i.addEventListener("input", () => {
    C(this, fe, zf).call(this, t);
  }), i == null || i.addEventListener("keydown", (u) => {
    u.key === "Enter" && (u.preventDefault(), C(this, fe, Bl).call(this, t));
  }), (a = t.querySelector("[data-action='add-tag-selector']")) == null || a.addEventListener("click", () => {
    C(this, fe, Bl).call(this, t);
  }), (o = t.querySelector("[data-action='toggle-pick-mode']")) == null || o.addEventListener("click", () => {
    h(this, Ve) ? (br(), L(this, Ve, !1)) : (L(this, Ve, !0), Uf({
      placeableType: h(this, Xr),
      onPick: /* @__PURE__ */ c((u) => {
        C(this, fe, Gf).call(this, u.id);
      }, "onPick"),
      onCancel: /* @__PURE__ */ c(() => {
        L(this, Ve, !1), this.render({ force: !0 });
      }, "onCancel")
    })), this.render({ force: !0 });
  }), t.querySelectorAll("[data-action='toggle-tile']").forEach((u) => {
    u.addEventListener("click", () => {
      const d = u.dataset.docId;
      d && C(this, fe, Wf).call(this, d);
    }), u.addEventListener("mouseenter", () => {
      var f, g;
      const d = u.dataset.docId;
      if (!d) return;
      const m = (g = (f = canvas.tiles) == null ? void 0 : f.placeables) == null ? void 0 : g.find((p) => p.document.id === d);
      m && (L(this, _n, m), so(m, { mode: "hover" }));
    }), u.addEventListener("mouseleave", () => {
      h(this, _n) && (er(h(this, _n)), L(this, _n, null), C(this, fe, Vl).call(this));
    });
  }), t.querySelectorAll("[data-action='remove-selection']").forEach((u) => {
    u.addEventListener("click", () => {
      const d = Number(u.dataset.selectionIndex);
      Number.isNaN(d) || (h(this, _e).splice(d, 1), this.render({ force: !0 }));
    });
  }), (s = t.querySelector("[data-action='apply']")) == null || s.addEventListener("click", () => {
    C(this, fe, Yf).call(this);
  }), (l = t.querySelector("[data-action='cancel']")) == null || l.addEventListener("click", () => {
    C(this, fe, Jf).call(this);
  });
}, "#bindEvents"), // ── Tag helpers ───────────────────────────────────────────────────────
Bl = /* @__PURE__ */ c(function(t) {
  var s;
  const i = t.querySelector("[data-role='tag-input']"), r = (s = i == null ? void 0 : i.value) == null ? void 0 : s.trim();
  if (!r) return;
  const a = r.split(",").map((l) => l.trim()).filter(Boolean);
  if (a.length === 0) return;
  const o = _f(a, h(this, Mn));
  o && !h(this, _e).includes(o) && h(this, _e).push(o), i && (i.value = ""), this.render({ force: !0 });
}, "#addTagSelector"), zf = /* @__PURE__ */ c(function(t) {
  var m, f;
  const i = t.querySelector("[data-role='tag-input']"), r = t.querySelector("[data-role='tag-preview']");
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
  const l = h(this, Mn) === "any", u = s.getByTag(o, {
    sceneId: (f = canvas.scene) == null ? void 0 : f.id,
    matchAny: l
  }), d = (u == null ? void 0 : u.length) ?? 0;
  r.textContent = `${d} matching placeable(s)`;
}, "#updateTagPreview"), // ── ID selector helpers ──────────────────────────────────────────────
Gf = /* @__PURE__ */ c(function(t) {
  const i = `id:${t}`;
  h(this, _e).includes(i) || (h(this, _e).push(i), this.render({ force: !0 }));
}, "#addIdSelector"), Wf = /* @__PURE__ */ c(function(t) {
  const i = `id:${t}`, r = h(this, _e).indexOf(i);
  r >= 0 ? h(this, _e).splice(r, 1) : h(this, _e).push(i), this.render({ force: !0 });
}, "#toggleIdSelector"), /**
 * Get the set of document IDs that are currently selected across all selector types.
 * Resolves tag/tags-any/tags-all selectors to find matching document IDs.
 * @returns {Set<string>}
 */
Ul = /* @__PURE__ */ c(function() {
  const t = /* @__PURE__ */ new Set();
  for (const i of h(this, _e)) {
    const r = Cc(i);
    if (r.type === "id") {
      t.add(r.value);
      continue;
    }
    const a = rs(i);
    if (a != null && a.placeables)
      for (const { doc: o } of a.placeables)
        o != null && o.id && t.add(o.id);
  }
  return t;
}, "#getSelectedIds"), // ── Canvas selection highlights ──────────────────────────────────────
/**
 * Maintain "selected" highlights on canvas tiles that are in the selection list.
 * Clears stale highlights and adds missing ones (skipping the hovered tile).
 */
Vl = /* @__PURE__ */ c(function() {
  var r, a;
  const t = C(this, fe, Ul).call(this), i = ((r = canvas.tiles) == null ? void 0 : r.placeables) ?? [];
  for (const o of i) {
    const s = (a = o.document) == null ? void 0 : a.id;
    if (!s) continue;
    const l = t.has(s), u = o === h(this, _n), d = Bf(o);
    l && !u && !d ? so(o, { mode: "selected" }) : !l && d && !u && er(o);
  }
}, "#refreshSelectionHighlights"), // ── Apply / Cancel ──────────────────────────────────────────────────
Yf = /* @__PURE__ */ c(function() {
  var i;
  h(this, Ve) && (br(), L(this, Ve, !1)), Fa();
  const t = [...h(this, _e)];
  (i = h(this, Qr)) == null || i.call(this, t), h(this, et) && (h(this, et).call(this, t), L(this, et, null)), this.close({ force: !0 });
}, "#doApply"), Jf = /* @__PURE__ */ c(function() {
  var t;
  h(this, Ve) && (br(), L(this, Ve, !1)), Fa(), (t = h(this, Zr)) == null || t.call(this), h(this, et) && (h(this, et).call(this, null), L(this, et, null)), this.close({ force: !0 });
}, "#doCancel"), c(dt, "PlaceablePickerApplication"), ye(dt, "APP_ID", `${T}-placeable-picker`), ye(dt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Re(dt, dt, "DEFAULT_OPTIONS"),
  {
    id: dt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Uu = Re(dt, dt, "DEFAULT_OPTIONS")) == null ? void 0 : Uu.classes) ?? [], "eidolon-placeable-picker-window", "themed"])
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
let lo = dt;
function gb(n, e) {
  n.querySelectorAll("[data-action='toggle-tween-card']").forEach((t) => {
    t.addEventListener("click", (i) => {
      if (i.target.closest("[data-action='delete-tween']")) return;
      const r = Number(t.dataset.tweenIndex), a = `${e.selectedPath}.tweens.${r}`;
      e.expandedTweens.has(a) ? e.expandedTweens.delete(a) : e.expandedTweens.add(a), e.render();
    });
  }), n.querySelectorAll("[data-action='pick-target']").forEach((t) => {
    t.addEventListener("click", async () => {
      var u, d;
      const i = Number(t.dataset.tweenIndex), r = e.parseEntryPath(e.selectedPath);
      if (!r || Number.isNaN(i)) return;
      const a = e.getEntryAtPath(e.selectedPath), o = ((d = (u = a == null ? void 0 : a.tweens) == null ? void 0 : u[i]) == null ? void 0 : d.target) ?? "", s = o ? [o] : [], l = await lo.open({ selections: s });
      if (l && l.length > 0) {
        if (r.type === "timeline")
          e.mutate((m) => m.updateTween(r.index, i, { target: l[0] }));
        else if (r.type === "branch") {
          const m = (a.tweens ?? []).map((f, g) => g === i ? { ...f, target: l[0] } : f);
          e.mutate((f) => f.updateBranchEntry(r.index, r.branchIndex, r.branchEntryIndex, { tweens: m }));
        }
      }
    });
  }), n.querySelectorAll("[data-action='delete-tween']").forEach((t) => {
    t.addEventListener("click", () => {
      const i = Number(t.dataset.tweenIndex), r = e.parseEntryPath(e.selectedPath);
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
  }), n.querySelectorAll(".cinematic-editor__tween-card-body").forEach((t) => {
    const i = Number(t.dataset.tweenIndex);
    t.querySelectorAll("[data-field]").forEach((r) => {
      const a = r.dataset.field, o = r.tagName === "SELECT" || r.type === "checkbox" ? "change" : "input";
      r.addEventListener(o, () => {
        let s;
        if (r.type === "checkbox" ? s = r.checked : a === "x" || a === "y" || a === "scale" || a === "toAlpha" ? s = r.value.trim() === "" ? "" : Number(r.value) || 0 : a === "value" && !Number.isNaN(Number(r.value)) && r.value.trim() !== "" ? s = Number(r.value) : s = r.value, a === "type") {
          const l = Pf[s], u = { type: s };
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
c(gb, "bindTweenFieldEvents");
function pb(n, e) {
  var i, r, a, o, s, l, u, d, m, f;
  function t(g, p, y) {
    g.type === "timeline" ? e.mutate((w) => w.updateEntry(g.index, { sound: y })) : g.type === "branch" && e.mutate((w) => w.updateBranchEntry(g.index, g.branchIndex, g.branchEntryIndex, { sound: y }));
  }
  c(t, "applySoundPatch"), (i = n.querySelector("[data-action='change-sound-src']")) == null || i.addEventListener("change", async (g) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = e.getEntryAtPath(e.selectedPath);
    if (!(y != null && y.sound)) return;
    const w = g.target.value, b = { ...y.sound, src: w };
    b.id || (b.id = vu(w));
    const v = await wu(w);
    v > 0 && (b.duration = v), t(p, y, b);
  }), (r = n.querySelector("[data-action='pick-sound-src']")) == null || r.addEventListener("click", () => {
    const g = e.parseEntryPath(e.selectedPath);
    if (!g) return;
    const p = e.getEntryAtPath(e.selectedPath);
    if (!(p != null && p.sound)) return;
    new FilePicker({
      type: "audio",
      current: p.sound.src || "",
      callback: /* @__PURE__ */ c(async (w) => {
        const b = { ...p.sound, src: w };
        b.id || (b.id = vu(w));
        const v = await wu(w);
        v > 0 && (b.duration = v), t(g, p, b);
      }, "callback")
    }).render(!0);
  }), (a = n.querySelector("[data-action='change-sound-id']")) == null || a.addEventListener("change", (g) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = e.getEntryAtPath(e.selectedPath);
    y != null && y.sound && t(p, y, { ...y.sound, id: g.target.value || void 0 });
  }), (o = n.querySelector("[data-action='change-sound-volume']")) == null || o.addEventListener("input", (g) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = e.getEntryAtPath(e.selectedPath);
    y != null && y.sound && t(p, y, { ...y.sound, volume: Number(g.target.value) || 0.8 });
  }), (s = n.querySelector("[data-action='change-sound-loop']")) == null || s.addEventListener("change", (g) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = e.getEntryAtPath(e.selectedPath);
    y != null && y.sound && t(p, y, { ...y.sound, loop: g.target.checked });
  }), (l = n.querySelector("[data-action='change-sound-fadein']")) == null || l.addEventListener("change", (g) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = e.getEntryAtPath(e.selectedPath);
    y != null && y.sound && t(p, y, { ...y.sound, fadeIn: Number(g.target.value) || void 0 });
  }), (u = n.querySelector("[data-action='change-sound-fadeout']")) == null || u.addEventListener("change", (g) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = e.getEntryAtPath(e.selectedPath);
    y != null && y.sound && t(p, y, { ...y.sound, fadeOut: Number(g.target.value) || void 0 });
  }), (d = n.querySelector("[data-action='change-sound-duration']")) == null || d.addEventListener("change", (g) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = e.getEntryAtPath(e.selectedPath);
    y != null && y.sound && t(p, y, { ...y.sound, duration: Number(g.target.value) || 0 });
  }), (m = n.querySelector("[data-action='change-sound-fireandforget']")) == null || m.addEventListener("change", (g) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = e.getEntryAtPath(e.selectedPath);
    y != null && y.sound && t(p, y, { ...y.sound, fireAndForget: g.target.checked });
  }), (f = n.querySelector("[data-action='change-stopsound-id']")) == null || f.addEventListener("change", (g) => {
    const p = e.parseEntryPath(e.selectedPath);
    p && (p.type === "timeline" ? e.mutate((y) => y.updateEntry(p.index, { stopSound: g.target.value })) : p.type === "branch" && e.mutate((y) => y.updateBranchEntry(p.index, p.branchIndex, p.branchEntryIndex, { stopSound: g.target.value })));
  });
}
c(pb, "bindSoundFieldEvents");
function yb(n, e) {
  var t, i, r, a, o;
  (t = n.querySelector("[data-action='change-emit-signal']")) == null || t.addEventListener("change", (s) => {
    const l = e.parseEntryPath(e.selectedPath);
    l && l.type === "timeline" && e.mutate((u) => u.updateEntry(l.index, { emit: s.target.value }));
  }), (i = n.querySelector("[data-action='change-parallel-join']")) == null || i.addEventListener("change", (s) => {
    const l = e.parseEntryPath(e.selectedPath);
    if (!l || l.type !== "timeline") return;
    const u = e.state.timeline[l.index];
    u != null && u.parallel && e.mutate((d) => d.updateEntry(l.index, { parallel: { ...u.parallel, join: s.target.value } }));
  }), (r = n.querySelector("[data-action='change-parallel-overflow']")) == null || r.addEventListener("change", (s) => {
    const l = e.parseEntryPath(e.selectedPath);
    if (!l || l.type !== "timeline") return;
    const u = e.state.timeline[l.index];
    u != null && u.parallel && e.mutate((d) => d.updateEntry(l.index, { parallel: { ...u.parallel, overflow: s.target.value } }));
  }), (a = n.querySelector("[data-action='edit-parallel-json']")) == null || a.addEventListener("click", () => {
    lb({ selectedPath: e.selectedPath, state: e.state, mutate: e.mutate });
  }), (o = n.querySelector("[data-action='add-branch']")) == null || o.addEventListener("click", () => {
    const s = e.parseEntryPath(e.selectedPath);
    !s || s.type !== "timeline" || e.mutate((l) => l.addBranch(s.index));
  }), n.querySelectorAll("[data-action='remove-branch']").forEach((s) => {
    s.addEventListener("click", () => {
      const l = Number(s.dataset.branchIndex), u = e.parseEntryPath(e.selectedPath);
      !u || u.type !== "timeline" || Number.isNaN(l) || e.mutate((d) => d.removeBranch(u.index, l));
    });
  }), n.querySelectorAll("[data-action='add-branch-step']").forEach((s) => {
    s.addEventListener("click", () => {
      const l = Number(s.dataset.branchIndex), u = e.parseEntryPath(e.selectedPath);
      !u || u.type !== "timeline" || Number.isNaN(l) || e.mutate((d) => d.addBranchEntry(u.index, l, { tweens: [] }));
    });
  }), n.querySelectorAll("[data-action='add-branch-delay']").forEach((s) => {
    s.addEventListener("click", () => {
      const l = Number(s.dataset.branchIndex), u = e.parseEntryPath(e.selectedPath);
      !u || u.type !== "timeline" || Number.isNaN(l) || e.mutate((d) => d.addBranchEntry(u.index, l, { delay: 1e3 }));
    });
  }), n.querySelectorAll("[data-action='add-branch-sound']").forEach((s) => {
    s.addEventListener("click", () => {
      const l = Number(s.dataset.branchIndex), u = e.parseEntryPath(e.selectedPath);
      !u || u.type !== "timeline" || Number.isNaN(l) || e.mutate((d) => d.addBranchEntry(u.index, l, { sound: { src: "", volume: 0.8, loop: !1, duration: 0, fireAndForget: !1 } }));
    });
  }), n.querySelectorAll("[data-action='add-branch-stopSound']").forEach((s) => {
    s.addEventListener("click", () => {
      const l = Number(s.dataset.branchIndex), u = e.parseEntryPath(e.selectedPath);
      !u || u.type !== "timeline" || Number.isNaN(l) || e.mutate((d) => d.addBranchEntry(u.index, l, { stopSound: "" }));
    });
  }), n.querySelectorAll("[data-action='remove-branch-entry']").forEach((s) => {
    s.addEventListener("click", () => {
      const l = Number(s.dataset.branchIndex), u = Number(s.dataset.branchEntryIndex), d = e.parseEntryPath(e.selectedPath);
      !d || d.type !== "timeline" || Number.isNaN(l) || Number.isNaN(u) || e.mutate((m) => m.removeBranchEntry(d.index, l, u));
    });
  });
}
c(yb, "bindSpecialEntryEvents");
function bb(n, e) {
  var t;
  n.querySelectorAll("[data-action='select-segment']").forEach((i) => {
    i.addEventListener("click", () => {
      const r = i.dataset.segmentName;
      r && e.selectSegment(r);
    });
  }), (t = n.querySelector("[data-action='add-segment']")) == null || t.addEventListener("click", async () => {
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
  }), n.querySelectorAll("[data-action='remove-segment']").forEach((i) => {
    i.addEventListener("click", () => {
      const r = i.dataset.segmentName;
      r && e.removeSegment(r);
    });
  }), n.querySelectorAll("[data-action='rename-segment']").forEach((i) => {
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
c(bb, "bindSegmentGraphEvents");
function vb(n, e) {
  var t, i, r, a, o, s, l;
  (t = n.querySelector("[data-action='change-gate-event']")) == null || t.addEventListener("change", (u) => {
    var m;
    const d = u.target.value;
    if (!d)
      e.setSegmentGate(null);
    else {
      const f = ((m = e.state.activeSegment) == null ? void 0 : m.gate) ?? {};
      e.setSegmentGate({ ...f, event: d });
    }
  }), (i = n.querySelector("[data-action='change-gate-target']")) == null || i.addEventListener("change", (u) => {
    var m;
    const d = (m = e.state.activeSegment) == null ? void 0 : m.gate;
    d && e.setSegmentGate({ ...d, target: u.target.value || void 0 });
  }), (r = n.querySelector("[data-action='pick-gate-target']")) == null || r.addEventListener("click", async () => {
    var m;
    const u = (m = e.state.activeSegment) == null ? void 0 : m.gate;
    if (!u) return;
    const { enterPickMode: d } = await Promise.resolve().then(() => hb);
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
    (a = n.querySelector(`[data-action='${u}']`)) == null || a.addEventListener("change", (m) => {
      var b;
      const f = (b = e.state.activeSegment) == null ? void 0 : b.gate;
      if (!f) return;
      const g = m.target.value.trim(), p = g ? g.split(",").map((v) => v.trim()).filter(Boolean) : void 0, y = { ...f.animation ?? {} };
      p != null && p.length ? y[d] = p.length === 1 ? p[0] : p : delete y[d];
      const w = { ...f, animation: Object.keys(y).length ? y : void 0 };
      w.animation || delete w.animation, e.setSegmentGate(w);
    });
  (o = n.querySelector("[data-action='change-segment-next']")) == null || o.addEventListener("change", (u) => {
    const d = u.target.value;
    e.setSegmentNext(d || null);
  }), (s = n.querySelector("[data-action='edit-segment-setup']")) == null || s.addEventListener("click", () => {
    ro("setup", { state: e.state, mutate: e.mutate });
  }), (l = n.querySelector("[data-action='edit-segment-landing']")) == null || l.addEventListener("click", () => {
    ro("landing", { state: e.state, mutate: e.mutate });
  });
}
c(vb, "bindSegmentDetailEvents");
var Vu, ze, W, tt, Nn, Ot, nt, Ge, Bo, Fe, it, Uo, dn, Ki, ht, gi, xn, pi, U, Kf, Xf, Qf, Zf, En, Gl, Wl, Yl, Jl, em, Cn, Kl, tm, nm, im, rm, am, Xl, vr;
const St = class St extends Wn(Gn) {
  constructor(t = {}) {
    super(t);
    k(this, U);
    k(this, ze, null);
    k(this, W, null);
    k(this, tt, null);
    k(this, Nn, /* @__PURE__ */ new Set());
    k(this, Ot, !1);
    k(this, nt, null);
    k(this, Ge, null);
    k(this, Bo, 120);
    k(this, Fe, []);
    k(this, it, -1);
    k(this, Uo, 50);
    k(this, dn, null);
    k(this, Ki, null);
    k(this, ht, null);
    k(this, gi, null);
    k(this, xn, null);
    k(this, pi, null);
    L(this, ze, t.scene ?? canvas.scene ?? null), L(this, W, Yt.fromScene(h(this, ze)));
  }
  // ── Context ───────────────────────────────────────────────────────────
  async _prepareContext() {
    var g, p;
    const t = Jy(h(this, W), h(this, W).activeSegmentName), i = Wy(h(this, W).timeline, {
      selectedPath: h(this, tt),
      windowWidth: ((g = this.position) == null ? void 0 : g.width) ?? 1100
    }), r = h(this, tt) != null ? ob(h(this, tt), { state: h(this, W), expandedTweens: h(this, Nn) }) : null, a = h(this, W).listCinematicNames(), o = h(this, W).activeCinematicName, l = h(this, W).listSegmentNames().length > 1, u = h(this, W).activeSegment, d = (u == null ? void 0 : u.gate) ?? null, m = (u == null ? void 0 : u.next) ?? null, f = typeof m == "string" ? m : (m == null ? void 0 : m.segment) ?? null;
    return {
      // Toolbar
      sceneName: ((p = h(this, ze)) == null ? void 0 : p.name) ?? "No scene",
      dirty: h(this, Ot),
      canUndo: h(this, U, Gl),
      canRedo: h(this, U, Wl),
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
      segmentGraph: t,
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
      triggerOptions: Hy.map((y) => ({
        ...y,
        selected: y.value === h(this, W).trigger
      })),
      entryCount: h(this, W).timeline.length,
      totalDuration: i.totalDurationMs,
      targetCount: Ky(h(this, W)),
      setupCount: Object.keys(h(this, W).setup ?? {}).length,
      landingCount: Object.keys(h(this, W).landing ?? {}).length
    };
  }
  // ── Render & Events ───────────────────────────────────────────────────
  _onRender(t, i) {
    var r, a, o;
    if (super._onRender(t, i), C(this, U, Kf).call(this), !h(this, gi)) {
      const s = (a = (r = game.modules.get(T)) == null ? void 0 : r.api) == null ? void 0 : a.cinematic;
      s != null && s.onPlaybackProgress ? (L(this, gi, s.onPlaybackProgress((l) => C(this, U, am).call(this, l))), console.log("[cinematic-editor] Subscribed to playback progress events")) : console.warn("[cinematic-editor] onPlaybackProgress not available on API", s);
    }
    if (h(this, pi) && ((o = this.element) == null || o.querySelectorAll(".cinematic-editor__segment-node").forEach((s) => {
      s.classList.toggle("cinematic-editor__segment-node--playing", s.dataset.segmentName === h(this, pi));
    }), h(this, ht) && h(this, ht).segmentName === h(this, W).activeSegmentName)) {
      const s = performance.now() - h(this, ht).startTime;
      h(this, ht).durationMs - s > 0 && C(this, U, Xl).call(this, h(this, ht).durationMs, h(this, ht).startTime);
    }
    h(this, dn) || (L(this, dn, (s) => {
      !s.ctrlKey && !s.metaKey || (s.key === "z" && !s.shiftKey ? (s.preventDefault(), C(this, U, Yl).call(this)) : (s.key === "z" && s.shiftKey || s.key === "y") && (s.preventDefault(), C(this, U, Jl).call(this)));
    }), document.addEventListener("keydown", h(this, dn)));
  }
  async close(t = {}) {
    if (h(this, Ge) && C(this, U, Cn).call(this), h(this, Ot) && !t.force) {
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
      i === "save" && await C(this, U, Kl).call(this);
    }
    return super.close(t);
  }
  async _onClose(t) {
    var i;
    return h(this, nt) !== null && (clearTimeout(h(this, nt)), L(this, nt, null)), h(this, dn) && (document.removeEventListener("keydown", h(this, dn)), L(this, dn, null)), (i = h(this, gi)) == null || i.call(this), L(this, gi, null), C(this, U, vr).call(this), super._onClose(t);
  }
};
ze = new WeakMap(), W = new WeakMap(), tt = new WeakMap(), Nn = new WeakMap(), Ot = new WeakMap(), nt = new WeakMap(), Ge = new WeakMap(), Bo = new WeakMap(), Fe = new WeakMap(), it = new WeakMap(), Uo = new WeakMap(), dn = new WeakMap(), Ki = new WeakMap(), ht = new WeakMap(), gi = new WeakMap(), xn = new WeakMap(), pi = new WeakMap(), U = new WeakSet(), // ── Event binding ─────────────────────────────────────────────────────
Kf = /* @__PURE__ */ c(function() {
  const t = this.element;
  if (!(t instanceof HTMLElement)) return;
  const i = C(this, U, Xf).call(this);
  cb(t, i), ub(t, i), bb(t, i), db(t, i), fb(t, i), gb(t, i), pb(t, i), yb(t, i), vb(t, i);
}, "#bindEvents"), Xf = /* @__PURE__ */ c(function() {
  const t = this;
  return {
    // State access (read-only getters — closures over `self` for private field access)
    get state() {
      return h(t, W);
    },
    get selectedPath() {
      return h(t, tt);
    },
    get scene() {
      return h(t, ze);
    },
    get expandedTweens() {
      return h(t, Nn);
    },
    get insertMenuState() {
      return h(t, Ki);
    },
    // Mutations
    mutate: /* @__PURE__ */ c((i) => C(this, U, En).call(this, i), "mutate"),
    setSelectedPath: /* @__PURE__ */ c((i) => {
      L(this, tt, i), this.render({ force: !0 });
    }, "setSelectedPath"),
    render: /* @__PURE__ */ c(() => this.render({ force: !0 }), "render"),
    // Cinematic switching (needs full state swap + clear)
    switchCinematic: /* @__PURE__ */ c((i) => {
      h(this, Ge) && C(this, U, Cn).call(this), L(this, W, h(this, W).switchCinematic(i)), L(this, tt, null), h(this, Nn).clear(), this.render({ force: !0 });
    }, "switchCinematic"),
    // Segment management
    selectSegment: /* @__PURE__ */ c((i) => {
      h(this, Ge) && C(this, U, Cn).call(this), L(this, W, h(this, W).switchSegment(i)), L(this, tt, null), h(this, Nn).clear(), this.render({ force: !0 });
    }, "selectSegment"),
    addSegment: /* @__PURE__ */ c((i) => {
      C(this, U, En).call(this, (r) => r.addSegment(i, r.activeSegmentName));
    }, "addSegment"),
    removeSegment: /* @__PURE__ */ c((i) => {
      C(this, U, En).call(this, (r) => r.removeSegment(i));
    }, "removeSegment"),
    renameSegment: /* @__PURE__ */ c((i, r) => {
      C(this, U, En).call(this, (a) => a.renameSegment(i, r));
    }, "renameSegment"),
    setSegmentGate: /* @__PURE__ */ c((i) => {
      C(this, U, En).call(this, (r) => r.setSegmentGate(i));
    }, "setSegmentGate"),
    setSegmentNext: /* @__PURE__ */ c((i) => {
      C(this, U, En).call(this, (r) => r.setSegmentNext(i));
    }, "setSegmentNext"),
    // Tween debouncing
    queueTweenChange: /* @__PURE__ */ c((i, r) => C(this, U, em).call(this, i, r), "queueTweenChange"),
    flushTweenChanges: /* @__PURE__ */ c(() => {
      h(this, Ge) && C(this, U, Cn).call(this);
    }, "flushTweenChanges"),
    flushTweenChangesImmediate: /* @__PURE__ */ c(() => {
      h(this, nt) !== null && clearTimeout(h(this, nt)), L(this, nt, null), C(this, U, Cn).call(this);
    }, "flushTweenChangesImmediate"),
    // Path utilities
    parseEntryPath: Un,
    getEntryAtPath: /* @__PURE__ */ c((i) => io(i, h(this, W)), "getEntryAtPath"),
    // Insert menu
    showInsertMenu: /* @__PURE__ */ c((i, r, a) => C(this, U, Qf).call(this, i, r, a), "showInsertMenu"),
    hideInsertMenu: /* @__PURE__ */ c(() => C(this, U, Zf).call(this), "hideInsertMenu"),
    // Toolbar actions
    save: /* @__PURE__ */ c(() => C(this, U, Kl).call(this), "save"),
    play: /* @__PURE__ */ c(() => C(this, U, tm).call(this), "play"),
    resetTracking: /* @__PURE__ */ c(() => C(this, U, nm).call(this), "resetTracking"),
    exportJSON: /* @__PURE__ */ c(() => C(this, U, im).call(this), "exportJSON"),
    validate: /* @__PURE__ */ c(() => C(this, U, rm).call(this), "validate"),
    importJSON: /* @__PURE__ */ c(() => sb({ state: h(this, W), mutate: /* @__PURE__ */ c((i) => C(this, U, En).call(this, i), "mutate") }), "importJSON"),
    undo: /* @__PURE__ */ c(() => C(this, U, Yl).call(this), "undo"),
    redo: /* @__PURE__ */ c(() => C(this, U, Jl).call(this), "redo")
  };
}, "#createEventContext"), // ── Insert menu ───────────────────────────────────────────────────────
Qf = /* @__PURE__ */ c(function(t, i, r) {
  var l;
  const a = (l = this.element) == null ? void 0 : l.querySelector(".cinematic-editor__insert-menu");
  if (!a) return;
  const o = t.getBoundingClientRect();
  document.body.appendChild(a), a.style.display = "", a.style.position = "fixed", a.style.left = `${o.left}px`;
  const s = a.offsetHeight || 200;
  o.bottom + 4 + s > window.innerHeight ? a.style.top = `${o.top - s - 4}px` : a.style.top = `${o.bottom + 4}px`, L(this, Ki, { insertIndex: i, lane: r });
}, "#showInsertMenu"), Zf = /* @__PURE__ */ c(function() {
  var i, r;
  const t = document.body.querySelector(".cinematic-editor__insert-menu") ?? ((i = this.element) == null ? void 0 : i.querySelector(".cinematic-editor__insert-menu"));
  if (t) {
    t.style.display = "none";
    const a = (r = this.element) == null ? void 0 : r.querySelector(".cinematic-editor");
    a && t.parentNode !== a && a.appendChild(t);
  }
  L(this, Ki, null);
}, "#hideInsertMenu"), // ── State mutation ────────────────────────────────────────────────────
En = /* @__PURE__ */ c(function(t) {
  L(this, Fe, h(this, Fe).slice(0, h(this, it) + 1)), h(this, Fe).push(h(this, W)), h(this, Fe).length > h(this, Uo) && h(this, Fe).shift(), L(this, it, h(this, Fe).length - 1), L(this, W, t(h(this, W))), L(this, Ot, !0), this.render({ force: !0 });
}, "#mutate"), Gl = /* @__PURE__ */ c(function() {
  return h(this, it) >= 0;
}, "#canUndo"), Wl = /* @__PURE__ */ c(function() {
  return h(this, it) < h(this, Fe).length - 1;
}, "#canRedo"), Yl = /* @__PURE__ */ c(function() {
  h(this, U, Gl) && (h(this, it) === h(this, Fe).length - 1 && h(this, Fe).push(h(this, W)), L(this, W, h(this, Fe)[h(this, it)]), us(this, it)._--, L(this, Ot, !0), this.render({ force: !0 }));
}, "#undo"), Jl = /* @__PURE__ */ c(function() {
  h(this, U, Wl) && (us(this, it)._++, L(this, W, h(this, Fe)[h(this, it) + 1]), L(this, Ot, !0), this.render({ force: !0 }));
}, "#redo"), em = /* @__PURE__ */ c(function(t, i) {
  var r;
  h(this, tt) != null && (L(this, Ge, {
    ...h(this, Ge) ?? {},
    entryPath: h(this, tt),
    tweenIndex: t,
    patch: { ...((r = h(this, Ge)) == null ? void 0 : r.patch) ?? {}, ...i }
  }), h(this, nt) !== null && clearTimeout(h(this, nt)), L(this, nt, setTimeout(() => {
    L(this, nt, null), C(this, U, Cn).call(this);
  }, h(this, Bo))));
}, "#queueTweenChange"), Cn = /* @__PURE__ */ c(function() {
  if (!h(this, Ge)) return;
  const { entryPath: t, tweenIndex: i, patch: r } = h(this, Ge);
  L(this, Ge, null);
  const a = Un(t);
  if (a) {
    if (a.type === "timeline")
      L(this, W, h(this, W).updateTween(a.index, i, r));
    else if (a.type === "branch") {
      const o = io(t, h(this, W));
      if (o) {
        const s = (o.tweens ?? []).map((l, u) => u === i ? { ...l, ...r } : l);
        L(this, W, h(this, W).updateBranchEntry(a.index, a.branchIndex, a.branchEntryIndex, { tweens: s }));
      }
    }
    L(this, Ot, !0);
  }
}, "#flushTweenChanges"), Kl = /* @__PURE__ */ c(async function() {
  var t, i, r, a, o, s;
  if (h(this, ze)) {
    if (h(this, Ge) && C(this, U, Cn).call(this), h(this, W).isStale(h(this, ze))) {
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
        L(this, W, Yt.fromScene(h(this, ze), h(this, W).activeCinematicName)), L(this, Ot, !1), L(this, Fe, []), L(this, it, -1), this.render({ force: !0 }), (i = (t = ui.notifications) == null ? void 0 : t.info) == null || i.call(t, "Cinematic reloaded from scene.");
        return;
      }
      if (!l) return;
    }
    try {
      await h(this, W).save(h(this, ze)), L(this, W, Yt.fromScene(h(this, ze), h(this, W).activeCinematicName)), L(this, Ot, !1), (a = (r = ui.notifications) == null ? void 0 : r.info) == null || a.call(r, "Cinematic saved."), this.render({ force: !0 });
    } catch (l) {
      console.error(`${T} | Cinematic save failed`, l), (s = (o = ui.notifications) == null ? void 0 : o.error) == null || s.call(o, "Failed to save cinematic data.");
    }
  }
}, "#onSave"), tm = /* @__PURE__ */ c(async function() {
  var i, r, a, o, s;
  const t = (r = (i = game.modules.get(T)) == null ? void 0 : i.api) == null ? void 0 : r.cinematic;
  if (!(t != null && t.play)) {
    (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, "Cinematic API not available.");
    return;
  }
  await t.play((s = h(this, ze)) == null ? void 0 : s.id, h(this, W).activeCinematicName);
}, "#onPlay"), nm = /* @__PURE__ */ c(async function() {
  var i, r, a, o, s;
  const t = (r = (i = game.modules.get(T)) == null ? void 0 : i.api) == null ? void 0 : r.cinematic;
  t != null && t.reset && (await t.reset((a = h(this, ze)) == null ? void 0 : a.id, h(this, W).activeCinematicName), (s = (o = ui.notifications) == null ? void 0 : o.info) == null || s.call(o, "Cinematic tracking reset."));
}, "#onResetTracking"), im = /* @__PURE__ */ c(async function() {
  var i, r;
  const t = JSON.stringify(h(this, W).toJSON(), null, 2);
  try {
    await navigator.clipboard.writeText(t), (r = (i = ui.notifications) == null ? void 0 : i.info) == null || r.call(i, "Cinematic JSON copied to clipboard.");
  } catch {
    new Dialog({
      title: "Cinematic JSON",
      content: `<textarea style="width:100%;height:300px;font-family:monospace;font-size:0.8rem">${$t(t)}</textarea>`,
      buttons: { ok: { label: "Close" } }
    }).render(!0);
  }
}, "#onExportJSON"), rm = /* @__PURE__ */ c(function() {
  var l, u;
  const t = h(this, W).toJSON(), { targets: i, unresolved: r } = no(t), a = Ry(t, i), o = [
    ...r.map((d) => ({ path: "targets", level: "warn", message: `Unresolved target: "${d}"` })),
    ...a
  ];
  if (o.length === 0) {
    (u = (l = ui.notifications) == null ? void 0 : l.info) == null || u.call(l, "Cinematic validation passed — no issues found.");
    return;
  }
  const s = o.map((d) => {
    const m = d.level === "error" ? "fa-circle-xmark" : "fa-triangle-exclamation", f = d.level === "error" ? "#e74c3c" : "#f39c12";
    return `<li style="margin:0.3rem 0"><i class="fa-solid ${m}" style="color:${f};margin-right:0.3rem"></i><strong>${$t(d.path)}</strong>: ${$t(d.message)}</li>`;
  });
  new Dialog({
    title: "Cinematic Validation",
    content: `<p>${o.length} issue(s) found:</p><ul style="list-style:none;padding:0;max-height:300px;overflow:auto">${s.join("")}</ul>`,
    buttons: { ok: { label: "Close" } }
  }).render(!0);
}, "#onValidate"), // ── Playback progress ────────────────────────────────────────────────
am = /* @__PURE__ */ c(function(t) {
  var i, r, a, o, s, l;
  switch (console.log(`[cinematic-editor] playback event: ${t.type}`, t), t.type) {
    case "segment-start":
      L(this, pi, t.segmentName), t.segmentName !== h(this, W).activeSegmentName ? (L(this, W, h(this, W).switchSegment(t.segmentName)), L(this, tt, null), h(this, Nn).clear(), this.render({ force: !0 })) : (i = this.element) == null || i.querySelectorAll(".cinematic-editor__segment-node").forEach((u) => {
        u.classList.toggle("cinematic-editor__segment-node--playing", u.dataset.segmentName === t.segmentName);
      });
      break;
    case "gate-wait":
      (a = (r = this.element) == null ? void 0 : r.querySelector(`.cinematic-editor__segment-node[data-segment-name="${CSS.escape(t.segmentName)}"]`)) == null || a.classList.add("cinematic-editor__segment-node--gate-waiting");
      break;
    case "gate-resolved":
      (s = (o = this.element) == null ? void 0 : o.querySelector(`.cinematic-editor__segment-node[data-segment-name="${CSS.escape(t.segmentName)}"]`)) == null || s.classList.remove("cinematic-editor__segment-node--gate-waiting");
      break;
    case "timeline-start":
      L(this, ht, { segmentName: t.segmentName, startTime: performance.now(), durationMs: t.durationMs }), t.segmentName === h(this, W).activeSegmentName && C(this, U, Xl).call(this, t.durationMs);
      break;
    case "timeline-end":
      C(this, U, vr).call(this), L(this, ht, null);
      break;
    case "playback-end":
      C(this, U, vr).call(this), L(this, ht, null), L(this, pi, null), (l = this.element) == null || l.querySelectorAll(".cinematic-editor__segment-node--playing, .cinematic-editor__segment-node--gate-waiting").forEach((u) => {
        u.classList.remove("cinematic-editor__segment-node--playing", "cinematic-editor__segment-node--gate-waiting");
      });
      break;
  }
}, "#onPlaybackEvent"), Xl = /* @__PURE__ */ c(function(t, i = null) {
  var u, d;
  C(this, U, vr).call(this);
  const r = (u = this.element) == null ? void 0 : u.querySelector(".cinematic-editor__playback-cursor"), a = (d = this.element) == null ? void 0 : d.querySelector(".cinematic-editor__swimlane");
  if (console.log(`[cinematic-editor] startCursor: duration=${t}, cursor=${!!r}, swimlane=${!!a}, width=${a == null ? void 0 : a.scrollWidth}`), !r || !a || t <= 0) return;
  r.style.display = "block";
  const o = i ?? performance.now(), s = a.scrollWidth, l = /* @__PURE__ */ c(() => {
    const m = performance.now() - o, f = Math.min(m / t, 1), g = $r + f * (s - $r);
    r.style.left = `${g}px`, f < 1 && L(this, xn, requestAnimationFrame(l));
  }, "tick");
  L(this, xn, requestAnimationFrame(l));
}, "#startCursorAnimation"), vr = /* @__PURE__ */ c(function() {
  var i;
  h(this, xn) && (cancelAnimationFrame(h(this, xn)), L(this, xn, null));
  const t = (i = this.element) == null ? void 0 : i.querySelector(".cinematic-editor__playback-cursor");
  t && (t.style.display = "none");
}, "#stopCursorAnimation"), c(St, "CinematicEditorApplication"), ye(St, "APP_ID", `${T}-cinematic-editor`), ye(St, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Re(St, St, "DEFAULT_OPTIONS"),
  {
    id: St.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Vu = Re(St, St, "DEFAULT_OPTIONS")) == null ? void 0 : Vu.classes) ?? [], "eidolon-cinematic-editor-window", "themed"])
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
let zl = St;
const om = /* @__PURE__ */ new Map();
function me(n, e) {
  om.set(n, e);
}
c(me, "registerBehaviour");
function Da(n) {
  return om.get(n);
}
c(Da, "getBehaviour");
function wb(n, e, t) {
  let i, r, a;
  if (e === 0)
    i = r = a = t;
  else {
    const o = /* @__PURE__ */ c((u, d, m) => (m < 0 && (m += 1), m > 1 && (m -= 1), m < 0.16666666666666666 ? u + (d - u) * 6 * m : m < 0.5 ? d : m < 0.6666666666666666 ? u + (d - u) * (0.6666666666666666 - m) * 6 : u), "hue2rgb"), s = t < 0.5 ? t * (1 + e) : t + e - t * e, l = 2 * t - s;
    i = o(l, s, n + 1 / 3), r = o(l, s, n), a = o(l, s, n - 1 / 3);
  }
  return Math.round(i * 255) << 16 | Math.round(r * 255) << 8 | Math.round(a * 255);
}
c(wb, "hslToInt");
me("float", (n, e = {}) => {
  const t = n.mesh;
  if (!t) return { update() {
  }, detach() {
  } };
  const i = e.speed ?? 0.04, r = e.amplitude ?? 3, a = t.position.y;
  let o = 0;
  return {
    update(s) {
      o += s, t.position.y = a + Math.sin(o * i) * r;
    },
    detach() {
      t.position.y = a;
    }
  };
});
me("pulse", (n, e = {}) => {
  const t = n.mesh;
  if (!t) return { update() {
  }, detach() {
  } };
  const i = e.minAlpha ?? 0.6, r = e.maxAlpha ?? 1, a = e.speed ?? 0.05, o = t.alpha;
  let s = Math.PI / 2;
  return {
    update(l) {
      s += l * a;
      const u = (Math.sin(s) + 1) / 2;
      t.alpha = i + (r - i) * u;
    },
    detach() {
      t.alpha = o;
    }
  };
});
me("scale", (n, e = {}) => {
  const t = n.mesh;
  if (!t) return { update() {
  }, detach() {
  } };
  const i = e.factor ?? 1.12, r = e.durationFrames ?? 15, a = rt(e.easing ?? "easeOutCubic"), o = t.scale.x, s = t.scale.y, l = o * i, u = s * i;
  let d = 0;
  return {
    update(m) {
      if (d < r) {
        d += m;
        const f = Math.min(d / r, 1), g = a(f);
        t.scale.x = o + (l - o) * g, t.scale.y = s + (u - s) * g;
      }
    },
    detach() {
      t.scale.x = o, t.scale.y = s;
    }
  };
});
me("glow", (n, e = {}) => {
  var y, w;
  const t = n.mesh;
  if (!((y = t == null ? void 0 : t.texture) != null && y.baseTexture)) return { update() {
  }, detach() {
  } };
  const i = n.document, r = e.color ?? 4513279, a = e.alpha ?? 0.5, o = e.blur ?? 8, s = e.pulseSpeed ?? 0.03, l = Math.abs(i.width), u = Math.abs(i.height), d = PIXI.Sprite.from(t.texture);
  d.anchor.set(0.5, 0.5), d.scale.set(t.scale.x, t.scale.y), d.position.set(l / 2, u / 2), d.angle = i.rotation ?? 0, d.alpha = a, d.tint = r;
  const m = PIXI.BlurFilter ?? ((w = PIXI.filters) == null ? void 0 : w.BlurFilter), f = new m(o);
  d.filters = [f], n.addChildAt(d, 0);
  const g = t.angle;
  let p = 0;
  return {
    update(b) {
      p += b;
      const v = (Math.sin(p * s) + 1) / 2;
      d.visible = t.visible !== !1, d.alpha = a * (0.5 + 0.5 * v) * (t.alpha ?? 1), d.scale.set(t.scale.x, t.scale.y), d.angle = (i.rotation ?? 0) + (t.angle - g);
    },
    detach() {
      d.parent && d.parent.removeChild(d), d.destroy({ children: !0 });
    }
  };
});
me("wobble", (n, e = {}) => {
  const t = n.mesh;
  if (!t) return { update() {
  }, detach() {
  } };
  const i = e.speed ?? 0.15, r = e.angle ?? 2.5, a = t.angle;
  let o = 0;
  return {
    update(s) {
      o += s, t.angle = a + Math.sin(o * i) * r;
    },
    detach() {
      t.angle = a;
    }
  };
});
me("colorCycle", (n, e = {}) => {
  const t = n.mesh;
  if (!t) return { update() {
  }, detach() {
  } };
  const i = e.speed ?? 5e-3, r = e.saturation ?? 0.6, a = e.lightness ?? 0.6, o = t.tint;
  let s = 0;
  return {
    update(l) {
      s = (s + l * i) % 1, t.tint = wb(s, r, a);
    },
    detach() {
      t.tint = o;
    }
  };
});
me("spin", (n, e = {}) => {
  const t = n.mesh;
  if (!t) return { update() {
  }, detach() {
  } };
  const i = e.speed ?? 0.5, r = t.angle;
  let a = 0;
  return {
    update(o) {
      a += o, t.angle = r + a * i;
    },
    detach() {
      t.angle = r;
    }
  };
});
me("bounce", (n, e = {}) => {
  const t = n.mesh;
  if (!t) return { update() {
  }, detach() {
  } };
  const i = e.speed ?? 0.02, r = e.amplitude ?? 6, a = rt("easeOutBounce"), o = t.position.y;
  let s = 0;
  return {
    update(l) {
      s += l;
      const u = Math.abs(s * i % 2 - 1);
      t.position.y = o + a(u) * r;
    },
    detach() {
      t.position.y = o;
    }
  };
});
me("borderTrace", (n, e = {}) => {
  const t = n.mesh;
  if (!t) return { update() {
  }, detach() {
  } };
  const i = n.document, r = Math.abs(i.width), a = Math.abs(i.height), o = 2 * (r + a), s = e.speed ?? 1.5, l = e.length ?? 60, u = e.color ?? 4513279, d = e.alpha ?? 0.8, m = e.lineWidth ?? 2, f = new PIXI.Graphics();
  f.alpha = d, f.pivot.set(r / 2, a / 2), f.position.set(r / 2, a / 2), n.addChildAt(f, 0);
  const g = t.scale.x, p = t.scale.y, y = t.angle;
  let w = 0;
  function b(v) {
    return v = (v % o + o) % o, v < r ? { x: v, y: 0 } : (v -= r, v < a ? { x: r, y: v } : (v -= a, v < r ? { x: r - v, y: a } : (v -= r, { x: 0, y: a - v })));
  }
  return c(b, "perimeterPoint"), {
    update(v) {
      w = (w + v * s) % o, f.visible = t.visible !== !1, f.alpha = d * (t.alpha ?? 1), f.scale.set(t.scale.x / g, t.scale.y / p), f.angle = t.angle - y, f.clear(), f.lineStyle(m, u, 1);
      const S = 16, I = l / S, A = b(w);
      f.moveTo(A.x, A.y);
      for (let O = 1; O <= S; O++) {
        const x = b(w + O * I);
        f.lineTo(x.x, x.y);
      }
    },
    detach() {
      f.parent && f.parent.removeChild(f), f.destroy({ children: !0 });
    }
  };
});
me("shimmer", (n, e = {}) => {
  const t = n.mesh;
  if (!t) return { update() {
  }, detach() {
  } };
  const i = n.document, r = Math.abs(i.width), a = Math.abs(i.height), o = e.speed ?? 1, s = e.bandWidth ?? 40, l = e.alpha ?? 0.15, u = e.pause ?? 120, d = r + a + s, m = d + u * o, f = new PIXI.Container();
  f.pivot.set(r / 2, a / 2), f.position.set(r / 2, a / 2);
  const g = new PIXI.Graphics();
  g.alpha = l;
  const p = new PIXI.Graphics();
  p.beginFill(16777215), p.drawRect(0, 0, r, a), p.endFill(), f.addChild(p), g.mask = p, f.addChild(g), n.addChild(f);
  const y = t.scale.x, w = t.scale.y, b = t.angle;
  let v = 0;
  return {
    update(S) {
      if (v = (v + S * o) % m, f.visible = t.visible !== !1, f.scale.set(t.scale.x / y, t.scale.y / w), f.angle = t.angle - b, g.alpha = l * (t.alpha ?? 1), g.clear(), v < d) {
        const I = v - s;
        g.beginFill(16777215, 1), g.moveTo(I, 0), g.lineTo(I + s, 0), g.lineTo(I + s - a, a), g.lineTo(I - a, a), g.closePath(), g.endFill();
      }
    },
    detach() {
      g.mask = null, f.parent && f.parent.removeChild(f), f.destroy({ children: !0 });
    }
  };
});
me("breathe", (n, e = {}) => {
  const t = n.mesh;
  if (!t) return { update() {
  }, detach() {
  } };
  const i = e.factor ?? 1.03, r = e.speed ?? 0.02, a = t.scale.x, o = t.scale.y;
  let s = 0;
  return {
    update(l) {
      s += l;
      const u = Math.sin(s * r);
      t.scale.x = a * (1 + (i - 1) * u), t.scale.y = o * (1 + (i - 1) * u);
    },
    detach() {
      t.scale.x = a, t.scale.y = o;
    }
  };
});
me("tiltFollow", (n, e = {}) => {
  const t = n.mesh;
  if (!t) return { update() {
  }, detach() {
  } };
  const i = e.maxAngle ?? 3, r = e.smoothing ?? 0.15, a = n.document, o = t.angle;
  let s = 0;
  return {
    update() {
      const l = canvas.mousePosition;
      if (!l) return;
      const u = Math.abs(a.width), d = a.x + u / 2, m = l.x - d, f = Math.max(-i, Math.min(i, m / (u / 2) * i));
      s += (f - s) * r, t.angle = o + s;
    },
    detach() {
      t.angle = o;
    }
  };
});
me("slideReveal", (n, e = {}, t) => {
  const i = n.mesh;
  if (!i) return { update() {
  }, detach() {
  } };
  if (t) return { update() {
  }, detach() {
  } };
  const r = e.offsetX ?? 0, a = e.offsetY ?? 20, o = e.durationFrames ?? 20, s = rt(e.easing ?? "easeOutCubic"), l = e.delay ?? 0, u = i.position.x, d = i.position.y, m = i.alpha;
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
me("embers", (n, e = {}) => {
  const t = n.mesh;
  if (!t) return { update() {
  }, detach() {
  } };
  const i = n.document, r = Math.abs(i.width), a = Math.abs(i.height), o = e.count ?? 12, s = e.speed ?? 0.5, l = e.color ?? 16737792, u = e.alpha ?? 0.6, d = e.size ?? 2, m = new PIXI.Container();
  m.pivot.set(r / 2, a / 2), m.position.set(r / 2, a / 2);
  const f = new PIXI.Graphics();
  m.addChild(f), n.addChild(m);
  const g = t.scale.x, p = t.scale.y, y = t.angle, w = [];
  function b() {
    const v = Math.random();
    let S, I;
    return v < 0.7 ? (S = Math.random() * r, I = a) : v < 0.85 ? (S = 0, I = a * 0.5 + Math.random() * a * 0.5) : (S = r, I = a * 0.5 + Math.random() * a * 0.5), {
      x: S,
      y: I,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -s * (0.5 + Math.random() * 0.5),
      life: 0,
      maxLife: 40 + Math.random() * 60,
      size: d * (0.5 + Math.random() * 0.5)
    };
  }
  return c(b, "spawnParticle"), {
    update(v) {
      m.visible = t.visible !== !1, m.scale.set(t.scale.x / g, t.scale.y / p), m.angle = t.angle - y, w.length < o && w.push(b());
      for (let S = w.length - 1; S >= 0; S--) {
        const I = w[S];
        if (I.life += v, I.life >= I.maxLife) {
          w.splice(S, 1);
          continue;
        }
        I.x += I.vx * v, I.y += I.vy * v, I.vx += (Math.random() - 0.5) * 0.05 * v;
      }
      f.clear();
      for (const S of w) {
        const I = 1 - S.life / S.maxLife;
        f.beginFill(l, u * I * (t.alpha ?? 1)), f.drawCircle(S.x, S.y, S.size), f.endFill();
      }
    },
    detach() {
      m.parent && m.parent.removeChild(m), m.destroy({ children: !0 });
    }
  };
});
me("runeGlow", (n, e = {}) => {
  const t = n.mesh;
  if (!t) return { update() {
  }, detach() {
  } };
  const i = n.document, r = Math.abs(i.width), a = Math.abs(i.height), o = 2 * (r + a), s = e.dots ?? 3, l = e.speed ?? 1.2, u = e.color ?? 4513279, d = e.color2 ?? 8930559, m = e.radius ?? 3, f = e.alpha ?? 0.7, g = new PIXI.Graphics();
  g.pivot.set(r / 2, a / 2), g.position.set(r / 2, a / 2), n.addChildAt(g, 0);
  const p = t.scale.x, y = t.scale.y, w = t.angle, b = [];
  for (let I = 0; I < s; I++)
    b.push({
      phase: I / s * o,
      speedMul: 0.7 + Math.random() * 0.6,
      color: I % 2 === 0 ? u : d
    });
  function v(I) {
    return I = (I % o + o) % o, I < r ? { x: I, y: 0 } : (I -= r, I < a ? { x: r, y: I } : (I -= a, I < r ? { x: r - I, y: a } : (I -= r, { x: 0, y: a - I })));
  }
  c(v, "perimeterPoint");
  let S = 0;
  return {
    update(I) {
      S += I, g.visible = t.visible !== !1, g.alpha = f * (t.alpha ?? 1), g.scale.set(t.scale.x / p, t.scale.y / y), g.angle = t.angle - w, g.clear();
      for (const A of b) {
        const O = v(A.phase + S * l * A.speedMul);
        g.beginFill(A.color, 1), g.drawCircle(O.x, O.y, m), g.endFill();
      }
    },
    detach() {
      g.parent && g.parent.removeChild(g), g.destroy({ children: !0 });
    }
  };
});
me("ripple", (n, e = {}) => {
  const t = n.mesh;
  if (!t) return { update() {
  }, detach() {
  } };
  const i = n.document, r = Math.abs(i.width), a = Math.abs(i.height), o = e.maxRadius ?? Math.sqrt(r * r + a * a) / 2, s = e.rings ?? 3, l = e.interval ?? 30, u = e.speed ?? 1.5, d = e.color ?? 4513279, m = e.alpha ?? 0.4, f = e.lineWidth ?? 1.5, g = new PIXI.Container();
  g.pivot.set(r / 2, a / 2), g.position.set(r / 2, a / 2);
  const p = new PIXI.Graphics();
  g.addChild(p), n.addChild(g);
  const y = t.scale.x, w = t.scale.y, b = t.angle, v = [];
  let S = 0, I = 0;
  return {
    update(A) {
      S += A, g.visible = t.visible !== !1, g.scale.set(t.scale.x / y, t.scale.y / w), g.angle = t.angle - b, S >= I && v.length < s && (v.push({ radius: 0, alpha: m }), I = S + l);
      for (let M = v.length - 1; M >= 0; M--) {
        const D = v[M];
        D.radius += u * A, D.alpha = m * (1 - D.radius / o), D.radius >= o && v.splice(M, 1);
      }
      p.clear();
      const O = r / 2, x = a / 2;
      for (const M of v)
        p.lineStyle(f, d, M.alpha * (t.alpha ?? 1)), p.drawCircle(O, x, M.radius);
    },
    detach() {
      g.parent && g.parent.removeChild(g), g.destroy({ children: !0 });
    }
  };
});
me("frostEdge", (n, e = {}) => {
  const t = n.mesh;
  if (!t) return { update() {
  }, detach() {
  } };
  const i = n.document, r = Math.abs(i.width), a = Math.abs(i.height), o = e.segments ?? 20, s = e.maxLength ?? 15, l = e.color ?? 11197951, u = e.alpha ?? 0.5, d = e.growSpeed ?? 0.02, m = new PIXI.Container();
  m.pivot.set(r / 2, a / 2), m.position.set(r / 2, a / 2);
  const f = new PIXI.Graphics(), g = new PIXI.Graphics();
  g.beginFill(16777215), g.drawRect(0, 0, r, a), g.endFill(), m.addChild(g), f.mask = g, m.addChild(f), n.addChild(m);
  const p = t.scale.x, y = t.scale.y, w = t.angle, b = [];
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
    b.push({ sx: O, sy: x, angle: M, targetLength: s * (0.4 + Math.random() * 0.6), currentLength: 0, grown: !1 });
  }
  let v = !1, S = 0;
  return {
    update(I) {
      if (m.visible = t.visible !== !1, m.scale.set(t.scale.x / p, t.scale.y / y), m.angle = t.angle - w, v)
        S += I * 0.03;
      else {
        v = !0;
        for (const O of b)
          O.grown || (O.currentLength += (O.targetLength - O.currentLength) * d * I, O.currentLength >= O.targetLength * 0.99 ? (O.currentLength = O.targetLength, O.grown = !0) : v = !1);
      }
      const A = v ? u * (0.7 + 0.3 * Math.sin(S)) : u;
      f.clear(), f.lineStyle(1.5, l, A * (t.alpha ?? 1));
      for (const O of b)
        O.currentLength <= 0 || (f.moveTo(O.sx, O.sy), f.lineTo(O.sx + Math.cos(O.angle) * O.currentLength, O.sy + Math.sin(O.angle) * O.currentLength));
    },
    detach() {
      f.mask = null, m.parent && m.parent.removeChild(m), m.destroy({ children: !0 });
    }
  };
});
me("shadowLift", (n, e = {}) => {
  var g, p, y;
  const t = n.mesh;
  if (!t) return { update() {
  }, detach() {
  } };
  const i = PIXI.DropShadowFilter ?? ((g = PIXI.filters) == null ? void 0 : g.DropShadowFilter) ?? ((y = (p = globalThis.PIXI) == null ? void 0 : p.filters) == null ? void 0 : y.DropShadowFilter);
  if (!i)
    return console.warn("shadowLift: DropShadowFilter not available in this PIXI build"), { update() {
    }, detach() {
    } };
  const r = e.offsetY ?? 6, a = e.blur ?? 6, o = e.alpha ?? 0.35, s = e.color ?? 0, l = e.durationFrames ?? 12, u = rt(e.easing ?? "easeOutCubic"), d = new i();
  d.blur = a, d.alpha = 0, d.color = s, d.quality = 3, d.distance = 0, d.rotation = 90;
  const m = t.filters ? [...t.filters] : [];
  t.filters = [...m, d];
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
      t.filters && (t.filters = t.filters.filter((w) => w !== d), t.filters.length === 0 && (t.filters = null)), d.destroy();
    }
  };
});
me("none", () => ({ update() {
}, detach() {
} }));
me("tween-prop", (n, e = {}) => {
  const t = n.mesh;
  if (!t) return { update() {
  }, detach() {
  } };
  const i = e.attribute ?? "alpha", r = e.from ?? 0.85, a = e.to ?? 1, o = e.period ?? 1500, s = rt(e.easing ?? "easeInOutCosine"), u = { alpha: "alpha", rotation: "angle" }[i] ?? i, d = t[u];
  let m = 0;
  return {
    update(f) {
      m += f;
      const g = o / 16.667, p = Math.abs(m / g % 2 - 1), y = s(p);
      t[u] = r + (a - r) * y;
    },
    detach() {
      t[u] = d;
    }
  };
});
me("tween-tint", (n, e = {}) => {
  const t = n.mesh;
  if (!t) return { update() {
  }, detach() {
  } };
  const i = e.fromColor ?? "#ffffff", r = e.toColor ?? "#ffcc88", a = e.mode ?? "oklch", o = e.period ?? 3e3, s = rt(e.easing ?? "easeInOutCosine"), l = vc(a), u = foundry.utils.Color, d = u.from(i), m = u.from(r), f = t.tint;
  let g = 0;
  return {
    update(p) {
      g += p;
      const y = o / 16.667, w = Math.abs(g / y % 2 - 1), b = s(w), v = l(d, m, b);
      t.tint = u.from(v).valueOf();
    },
    detach() {
      t.tint = f;
    }
  };
});
me("tween-scale", (n, e = {}) => {
  const t = n.mesh;
  if (!t) return { update() {
  }, detach() {
  } };
  const i = e.fromScale ?? 0.95, r = e.toScale ?? 1.05, a = e.period ?? 2e3, o = rt(e.easing ?? "easeInOutCosine"), s = t.scale.x, l = t.scale.y;
  let u = 0;
  return {
    update(d) {
      u += d;
      const m = a / 16.667, f = Math.abs(u / m % 2 - 1), g = o(f), p = i + (r - i) * g;
      t.scale.set(s * p, l * p);
    },
    detach() {
      t.scale.set(s, l);
    }
  };
});
const ur = {
  always: [],
  idle: ["float", "glow"],
  hover: ["scale"],
  dim: ["none"]
};
function Eb(n) {
  if (!n) return { ...ur };
  const e = /* @__PURE__ */ c((t, i) => t === void 0 ? i : typeof t == "string" ? [t] : typeof t == "object" && !Array.isArray(t) && t.name ? [t] : Array.isArray(t) ? t : i, "normalize");
  return {
    always: e(n.always, ur.always),
    idle: e(n.idle, ur.idle),
    hover: e(n.hover, ur.hover),
    dim: e(n.dim, ur.dim)
  };
}
c(Eb, "normalizeConfig");
var be, At, Ut, kt, $n, Fn, Vt, Mt, fn, we, sm, Pa, lm, cm, um, dm, fm, mm;
const Or = class Or {
  /**
   * @param {PlaceableObject} placeable
   * @param {object|undefined} animationConfig  Raw animation config from the await entry
   */
  constructor(e, t) {
    k(this, we);
    k(this, be);
    k(this, At);
    k(this, Ut, null);
    k(this, kt, []);
    k(this, $n, []);
    k(this, Fn, null);
    k(this, Vt, null);
    k(this, Mt, null);
    k(this, fn, 0);
    L(this, be, e), L(this, At, Eb(t));
  }
  /** Current animation state name. */
  get state() {
    return h(this, Ut);
  }
  /**
   * Start animating in the given state.
   * @param {string} [state="idle"]
   */
  start(e = "idle") {
    var r;
    C(this, we, sm).call(this);
    const t = ((r = h(this, be).document) == null ? void 0 : r.id) ?? "?", i = h(this, Vt);
    i && console.log(`%c[TileAnimator ${t}] start("${e}") canonical: pos=(${i.x.toFixed(2)}, ${i.y.toFixed(2)}) scale=(${i.scaleX.toFixed(4)}, ${i.scaleY.toFixed(4)}) alpha=${i.alpha.toFixed(4)} angle=${i.angle.toFixed(2)}`, "color: #FFAA44; font-weight: bold"), C(this, we, fm).call(this), C(this, we, um).call(this, e), L(this, Fn, (a) => {
      if (h(this, be).destroyed || !h(this, be).transform) {
        this.detach();
        return;
      }
      h(this, Mt) && C(this, we, Pa).call(this);
      for (const o of h(this, $n)) o.update(a);
      for (const o of h(this, kt)) o.update(a);
      C(this, we, cm).call(this, a);
    }), canvas.app.ticker.add(h(this, Fn));
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
    if (e === h(this, Ut)) return;
    const t = ((m = h(this, be).document) == null ? void 0 : m.id) ?? "?", i = h(this, be).mesh, r = h(this, At)[h(this, Ut)] ?? h(this, At).idle ?? ["none"], a = h(this, At)[e] ?? h(this, At).idle ?? ["none"], o = r.map((f) => typeof f == "string" ? f : f == null ? void 0 : f.name), s = a.map((f) => typeof f == "string" ? f : f == null ? void 0 : f.name);
    if (console.log(`%c[TileAnimator ${t}] setState: ${h(this, Ut)} → ${e}`, "color: #44DDFF; font-weight: bold"), console.log(`  old behaviours: [${o.join(", ")}]  →  new: [${s.join(", ")}]`), i && console.log(`  mesh BEFORE detach: pos=(${i.position.x.toFixed(2)}, ${i.position.y.toFixed(2)}) scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)} angle=${i.angle.toFixed(2)}`), h(this, Vt)) {
      const f = h(this, Vt);
      console.log(`  canonical: pos=(${f.x.toFixed(2)}, ${f.y.toFixed(2)}) scale=(${f.scaleX.toFixed(4)}, ${f.scaleY.toFixed(4)}) alpha=${f.alpha.toFixed(4)} angle=${f.angle.toFixed(2)}`);
    }
    const l = /* @__PURE__ */ new Map();
    for (let f = 0; f < h(this, kt).length; f++) {
      const g = r[f], p = typeof g == "string" ? g : g == null ? void 0 : g.name;
      p && l.set(p, h(this, kt)[f]);
    }
    const u = [], d = /* @__PURE__ */ new Set();
    for (const f of a) {
      const g = typeof f == "string" ? f : f.name;
      l.has(g) && !d.has(g) && d.add(g);
    }
    console.log(`  reused: [${[...d].join(", ")}]  detaching: [${[...l.keys()].filter((f) => !d.has(f)).join(", ")}]`), C(this, we, lm).call(this);
    for (const [f, g] of l)
      d.has(f) || (g.detach(), i && console.log(`  mesh AFTER detach("${f}"): scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)}`));
    C(this, we, Pa).call(this), i && console.log(`  mesh AFTER canonical restore: scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)}`);
    for (const f of a) {
      const g = typeof f == "string" ? f : f.name;
      if (l.has(g) && d.has(g))
        u.push(l.get(g)), d.delete(g), console.log(`  → reuse "${g}"`);
      else {
        const p = typeof f == "string" ? void 0 : f, y = Da(g);
        if (!y) {
          console.warn(`TileAnimator: unknown behaviour "${g}"`);
          continue;
        }
        u.push(y(h(this, be), p, h(this, Vt))), i && console.log(`  → create "${g}" — mesh after factory: scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)} pos=(${i.position.x.toFixed(2)}, ${i.position.y.toFixed(2)})`);
      }
    }
    if (h(this, Mt)) {
      const f = h(this, Mt);
      console.log(`  blend FROM: pos=(${f.x.toFixed(2)}, ${f.y.toFixed(2)}) scale=(${f.scaleX.toFixed(4)}, ${f.scaleY.toFixed(4)}) alpha=${f.alpha.toFixed(4)}`);
    }
    L(this, Ut, e), L(this, kt, u);
  }
  /**
   * Full cleanup — detach all behaviours, restore canonical, and remove ticker.
   */
  detach() {
    var t, i;
    h(this, be).destroyed || !h(this, be).transform ? (L(this, kt, []), L(this, $n, [])) : (C(this, we, dm).call(this), C(this, we, mm).call(this), C(this, we, Pa).call(this)), L(this, Mt, null), L(this, Ut, null), h(this, Fn) && ((i = (t = canvas.app) == null ? void 0 : t.ticker) == null || i.remove(h(this, Fn)), L(this, Fn, null));
  }
};
be = new WeakMap(), At = new WeakMap(), Ut = new WeakMap(), kt = new WeakMap(), $n = new WeakMap(), Fn = new WeakMap(), Vt = new WeakMap(), Mt = new WeakMap(), fn = new WeakMap(), we = new WeakSet(), // ── Private ──────────────────────────────────────────────────────────
sm = /* @__PURE__ */ c(function() {
  const e = h(this, be).mesh;
  e && L(this, Vt, {
    x: e.position.x,
    y: e.position.y,
    scaleX: e.scale.x,
    scaleY: e.scale.y,
    angle: e.angle,
    alpha: e.alpha,
    tint: e.tint
  });
}, "#captureCanonical"), Pa = /* @__PURE__ */ c(function() {
  const e = h(this, be).mesh;
  if (!e || !h(this, Vt)) return;
  const t = h(this, Vt);
  e.position.x = t.x, e.position.y = t.y, e.scale.x = t.scaleX, e.scale.y = t.scaleY, e.angle = t.angle, e.alpha = t.alpha, e.tint = t.tint;
}, "#restoreCanonical"), /**
 * Snapshot the current (animated) mesh values so the transition blend
 * can lerp FROM here toward the new state's computed values.
 */
lm = /* @__PURE__ */ c(function() {
  const e = h(this, be).mesh;
  e && (L(this, Mt, {
    x: e.position.x,
    y: e.position.y,
    scaleX: e.scale.x,
    scaleY: e.scale.y,
    angle: e.angle,
    alpha: e.alpha
  }), L(this, fn, 0));
}, "#captureBlendStart"), /**
 * After behaviours compute the new state's mesh values, blend from the
 * pre-transition snapshot toward those values over BLEND_FRAMES using
 * easeOutCubic. This hides the canonical-restore snap entirely.
 */
cm = /* @__PURE__ */ c(function(e) {
  var o, s;
  if (!h(this, Mt)) return;
  L(this, fn, h(this, fn) + e);
  const t = Math.min(h(this, fn) / Or.BLEND_FRAMES, 1);
  if (t >= 1) {
    const l = ((o = h(this, be).document) == null ? void 0 : o.id) ?? "?";
    console.log(`%c[TileAnimator ${l}] blend complete`, "color: #88FF88"), L(this, Mt, null);
    return;
  }
  const i = 1 - (1 - t) ** 3, r = h(this, be).mesh;
  if (!r) return;
  const a = h(this, Mt);
  if (h(this, fn) <= e * 3) {
    const l = ((s = h(this, be).document) == null ? void 0 : s.id) ?? "?", u = Math.round(h(this, fn) / e);
    console.log(`  [blend ${l} f${u}] t=${t.toFixed(3)} eased=${i.toFixed(3)} | behaviour→scale=(${r.scale.x.toFixed(4)},${r.scale.y.toFixed(4)}) alpha=${r.alpha.toFixed(4)} | blendFrom→scale=(${a.scaleX.toFixed(4)},${a.scaleY.toFixed(4)}) alpha=${a.alpha.toFixed(4)}`);
  }
  r.position.x = a.x + (r.position.x - a.x) * i, r.position.y = a.y + (r.position.y - a.y) * i, r.scale.x = a.scaleX + (r.scale.x - a.scaleX) * i, r.scale.y = a.scaleY + (r.scale.y - a.scaleY) * i, r.angle = a.angle + (r.angle - a.angle) * i, r.alpha = a.alpha + (r.alpha - a.alpha) * i, h(this, fn) <= e * 3 && console.log(`  [blend result] scale=(${r.scale.x.toFixed(4)},${r.scale.y.toFixed(4)}) alpha=${r.alpha.toFixed(4)} pos=(${r.position.x.toFixed(2)},${r.position.y.toFixed(2)})`);
}, "#applyBlend"), um = /* @__PURE__ */ c(function(e) {
  L(this, Ut, e);
  const t = h(this, At)[e] ?? h(this, At).idle ?? ["none"];
  for (const i of t) {
    const r = typeof i == "string" ? i : i.name, a = typeof i == "string" ? void 0 : i, o = Da(r);
    if (!o) {
      console.warn(`TileAnimator: unknown behaviour "${r}"`);
      continue;
    }
    h(this, kt).push(o(h(this, be), a));
  }
}, "#attachBehaviours"), dm = /* @__PURE__ */ c(function() {
  for (const e of h(this, kt)) e.detach();
  L(this, kt, []);
}, "#detachBehaviours"), fm = /* @__PURE__ */ c(function() {
  const e = h(this, At).always ?? [];
  for (const t of e) {
    const i = typeof t == "string" ? t : t.name, r = typeof t == "string" ? void 0 : t, a = Da(i);
    if (!a) {
      console.warn(`TileAnimator: unknown always behaviour "${i}"`);
      continue;
    }
    h(this, $n).push(a(h(this, be), r));
  }
}, "#attachAlwaysBehaviours"), mm = /* @__PURE__ */ c(function() {
  for (const e of h(this, $n)) e.detach();
  L(this, $n, []);
}, "#detachAlwaysBehaviours"), c(Or, "TileAnimator"), /** Frames over which state transitions are blended (easeOutCubic). */
ye(Or, "BLEND_FRAMES", 8);
let Li = Or;
const Cb = "cinematic", Os = 5, Ql = /* @__PURE__ */ new Set();
function nn(n) {
  for (const e of Ql)
    try {
      e(n);
    } catch (t) {
      console.error("[cinematic] playback listener error:", t);
    }
}
c(nn, "emitPlaybackEvent");
function Sb(n) {
  return Ql.add(n), () => Ql.delete(n);
}
c(Sb, "onPlaybackProgress");
let Se = null, ln = null, Sr = null, Tr = null, Mi = 0, ni = null;
function Tc(n, e = "default") {
  return `cinematic-progress-${n}-${e}`;
}
c(Tc, "progressFlagKey");
function Tb(n, e, t, i) {
  game.user.setFlag(T, Tc(n, e), {
    currentSegment: t,
    completedSegments: [...i],
    timestamp: Date.now()
  }).catch(() => {
  });
}
c(Tb, "saveSegmentProgress");
function Zl(n, e = "default") {
  game.user.unsetFlag(T, Tc(n, e)).catch(() => {
  });
}
c(Zl, "clearProgress");
function hm(n, e = "default", t = 3e5) {
  const i = game.user.getFlag(T, Tc(n, e));
  return !i || typeof i.timestamp != "number" || Date.now() - i.timestamp > t ? null : i.currentSegment ? i : null;
}
c(hm, "getSavedProgress");
function Ii(n, e = "default") {
  return `cinematic-seen-${n}-${e}`;
}
c(Ii, "seenFlagKey");
function Au(n, e = "default") {
  return !!game.user.getFlag(T, Ii(n, e));
}
c(Au, "hasSeenCinematic");
function Lb(n, e) {
  var t;
  if (n == null) return null;
  if (typeof n != "object" || Array.isArray(n))
    return console.warn(`[${T}] Cinematic: invalid data for ${e} (expected object). Ignoring.`), null;
  if (n.trigger !== void 0 && typeof n.trigger != "string")
    return console.warn(`[${T}] Cinematic: invalid 'trigger' on ${e} (expected string). Ignoring.`), null;
  if (n.tracking !== void 0 && typeof n.tracking != "boolean")
    return console.warn(`[${T}] Cinematic: invalid 'tracking' on ${e} (expected boolean). Ignoring.`), null;
  if (n.synchronized !== void 0 && typeof n.synchronized != "boolean")
    return console.warn(`[${T}] Cinematic: invalid 'synchronized' on ${e} (expected boolean). Ignoring.`), null;
  if (n.segments) {
    if (typeof n.segments != "object" || Array.isArray(n.segments))
      return console.warn(`[${T}] Cinematic: invalid 'segments' on ${e} (expected object). Ignoring.`), null;
    for (const [i, r] of Object.entries(n.segments)) {
      if (!r || typeof r != "object" || Array.isArray(r)) {
        console.warn(`[${T}] Cinematic: invalid segment "${i}" on ${e}. Removing.`), delete n.segments[i];
        continue;
      }
      if (r.timeline !== void 0 && !Array.isArray(r.timeline)) {
        console.warn(`[${T}] Cinematic: invalid timeline on segment "${i}" of ${e}. Removing.`), delete n.segments[i];
        continue;
      }
      (t = r.timeline) != null && t.length && (r.timeline = r.timeline.filter((a, o) => !a || typeof a != "object" || Array.isArray(a) ? (console.warn(`[${T}] Cinematic: segment "${i}" timeline[${o}] on ${e} is not a valid object, removing.`), !1) : !0));
    }
    if (Object.keys(n.segments).length === 0)
      return console.warn(`[${T}] Cinematic: no valid segments on ${e}. Ignoring.`), null;
  }
  return n.timeline !== void 0 && !Array.isArray(n.timeline) ? (console.warn(`[${T}] Cinematic: invalid 'timeline' on ${e} (expected array). Ignoring.`), null) : n;
}
c(Lb, "validateSingleCinematic");
function os(n) {
  const e = n ? game.scenes.get(n) : canvas.scene;
  let t = (e == null ? void 0 : e.getFlag(T, Cb)) ?? null;
  if (t == null) return null;
  if (typeof t != "object" || Array.isArray(t))
    return console.warn(`[${T}] Cinematic: invalid flag data on scene ${e == null ? void 0 : e.id} (expected object). Ignoring.`), null;
  if ((t.version ?? 1) < 3) {
    const { version: i, ...r } = t;
    t = { version: 3, cinematics: { default: r } };
  }
  if (t.version === 3) {
    for (const [i, r] of Object.entries(t.cinematics ?? {}))
      t.cinematics[i] = Yt.migrateV3toV4(r);
    t.version = 4;
  }
  if (t.version === 4) {
    for (const [i, r] of Object.entries(t.cinematics ?? {}))
      t.cinematics[i] = Yt.migrateV4toV5(r);
    t.version = Os;
  }
  if (t.version > Os)
    return console.warn(`[${T}] Cinematic: scene ${e == null ? void 0 : e.id} has version ${t.version}, runtime supports up to ${Os}. Skipping.`), null;
  if (!t.cinematics || typeof t.cinematics != "object")
    return console.warn(`[${T}] Cinematic: no 'cinematics' map on scene ${e == null ? void 0 : e.id}. Ignoring.`), null;
  for (const [i, r] of Object.entries(t.cinematics)) {
    const a = Lb(r, `scene ${e == null ? void 0 : e.id} cinematic "${i}"`);
    a ? t.cinematics[i] = a : delete t.cinematics[i];
  }
  return Object.keys(t.cinematics).length === 0 ? null : t;
}
c(os, "getCinematicData");
function co(n, e = "default") {
  var i;
  const t = os(n);
  return ((i = t == null ? void 0 : t.cinematics) == null ? void 0 : i[e]) ?? null;
}
c(co, "getNamedCinematic");
function Ib(n) {
  const e = os(n);
  return e ? Object.keys(e.cinematics) : [];
}
c(Ib, "listCinematicNames");
function Ob() {
  return game.ready ? Promise.resolve() : new Promise((n) => Hooks.once("ready", n));
}
c(Ob, "waitForReady");
async function Ab(n = 1e4) {
  var t, i;
  const e = (i = (t = game.modules.get(T)) == null ? void 0 : t.api) == null ? void 0 : i.tween;
  return e != null && e.Timeline ? e.Timeline : new Promise((r) => {
    const a = Date.now(), o = setTimeout(() => {
      var l, u;
      (u = (l = ui.notifications) == null ? void 0 : l.info) == null || u.call(l, `[${T}] Cinematic: waiting for tween engine...`);
    }, 2e3), s = setInterval(() => {
      var u, d, m, f;
      const l = (d = (u = game.modules.get(T)) == null ? void 0 : u.api) == null ? void 0 : d.tween;
      l != null && l.Timeline ? (clearInterval(s), clearTimeout(o), r(l.Timeline)) : Date.now() - a > n && (clearInterval(s), clearTimeout(o), console.warn(`[${T}] Cinematic: tween API not available after ${n}ms.`), (f = (m = ui.notifications) == null ? void 0 : m.warn) == null || f.call(m, `[${T}] Cinematic: tween engine unavailable — cinematic cannot play.`), r(null));
    }, 200);
  });
}
c(Ab, "waitForTweenAPI");
async function ec(n = 5e3) {
  var e;
  return window.Tagger ?? ((e = game.modules.get("tagger")) == null ? void 0 : e.api) ? !0 : new Promise((t) => {
    const i = Date.now(), r = setInterval(() => {
      var a;
      window.Tagger ?? ((a = game.modules.get("tagger")) == null ? void 0 : a.api) ? (clearInterval(r), t(!0)) : Date.now() - i > n && (clearInterval(r), console.warn(`[${T}] Cinematic: Tagger API not available after ${n}ms.`), t(!1));
    }, 200);
  });
}
c(ec, "waitForTagger");
async function kb(n, e, t) {
  if (!n || !n.event) return;
  const i = { ...n };
  console.log(`[${T}] Cinematic: waiting for gate: ${n.event}`);
  let r = null;
  if (n.event === "tile-click" && n.target && n.animation) {
    const a = e.get(n.target);
    (a == null ? void 0 : a.kind) === "placeable" && a.placeable && (r = new Li(a.placeable, n.animation), r.start());
  }
  try {
    if (n.timeout && n.timeout > 0) {
      const a = new Promise((s) => setTimeout(s, n.timeout)), o = Nl(i, { signal: t.signal, eventBus: null });
      await Promise.race([o, a]);
    } else
      await Nl(i, { signal: t.signal, eventBus: null });
  } finally {
    r && r.detach();
  }
}
c(kb, "processGate");
function gm(n) {
  if (!n.segments) return [];
  const e = [], t = /* @__PURE__ */ new Set();
  let i = n.entry;
  for (; i && typeof i == "string" && n.segments[i] && !t.has(i); )
    t.add(i), e.push(i), i = n.segments[i].next;
  return e;
}
c(gm, "getSegmentOrder");
function uo(n, e) {
  if (n.setup)
    try {
      Oe(n.setup, e);
    } catch (i) {
      console.warn(`[${T}] Cinematic: error applying cinematic-level setup:`, i);
    }
  const t = gm(n);
  for (const i of t) {
    const r = n.segments[i];
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
  if (n.landing)
    try {
      Oe(n.landing, e);
    } catch (i) {
      console.warn(`[${T}] Cinematic: error applying cinematic-level landing:`, i);
    }
  canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
}
c(uo, "applyAllSegmentLandingStates");
async function Lr(n, e = "default", t = null) {
  var v, S, I, A, O, x, M, D;
  const i = n ?? ((v = canvas.scene) == null ? void 0 : v.id);
  if (!i) return;
  const r = `${i}:${e}`;
  if (t || (t = /* @__PURE__ */ new Set()), t.has(r)) {
    console.warn(`[${T}] Cinematic: circular transition detected at "${r}". Stopping chain.`), (I = (S = ui.notifications) == null ? void 0 : S.warn) == null || I.call(S, "Cinematic: circular transition detected, stopping.");
    return;
  }
  t.add(r), (Se == null ? void 0 : Se.status) === "running" && Se.cancel("replaced"), Se = null, ln && (ln.abort("replaced"), ln = null);
  const a = co(i, e);
  if (!a) {
    console.warn(`[${T}] Cinematic: no cinematic "${e}" on scene ${i}.`);
    return;
  }
  const o = await Ab();
  if (!o || ((A = canvas.scene) == null ? void 0 : A.id) !== i || (await ec(), ((O = canvas.scene) == null ? void 0 : O.id) !== i)) return;
  const { targets: s, unresolved: l } = no(a);
  if (console.log(`[${T}] Cinematic "${e}": resolved ${s.size} targets`), l.length && console.warn(`[${T}] Cinematic "${e}": skipping ${l.length} unresolved: ${l.join(", ")}`), s.size === 0) {
    console.warn(`[${T}] Cinematic "${e}": no targets could be resolved on scene ${i}.`);
    return;
  }
  const u = My(a);
  Sr = ky(u, s), Tr = s;
  const d = hm(i, e), m = new AbortController();
  ln = m;
  const f = a.synchronized === !0 && game.user.isGM, g = gm(a);
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
      Oe(a.setup, s), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    } catch (F) {
      console.error(`[${T}] Cinematic "${e}": error applying cinematic-level setup:`, F);
    }
  for (let F = 0; F < p; F++) {
    const P = g[F], _ = a.segments[P];
    if (_.setup)
      try {
        Oe(_.setup, s);
      } catch (H) {
        console.warn(`[${T}] Cinematic: error applying setup for completed segment "${P}":`, H);
      }
    if (_.landing)
      try {
        Oe(_.landing, s);
      } catch (H) {
        console.warn(`[${T}] Cinematic: error applying landing for completed segment "${P}":`, H);
      }
  }
  let w = !1, b = !1;
  nn({ type: "playback-start", sceneName: ((x = canvas.scene) == null ? void 0 : x.name) ?? i });
  try {
    for (let F = p; F < g.length; F++) {
      if (m.signal.aborted) {
        w = !0;
        break;
      }
      if (((M = canvas.scene) == null ? void 0 : M.id) !== i) {
        w = !0;
        break;
      }
      const P = g[F], _ = a.segments[P];
      if (console.log(`[${T}] Cinematic "${e}": entering segment "${P}"`), nn({ type: "segment-start", segmentName: P }), Tb(i, e, P, [...y]), _.gate) {
        nn({ type: "gate-wait", segmentName: P, gate: _.gate });
        try {
          await kb(_.gate, s, m);
        } catch (q) {
          if (m.signal.aborted) {
            w = !0;
            break;
          }
          throw q;
        }
        nn({ type: "gate-resolved", segmentName: P });
      }
      if (m.signal.aborted) {
        w = !0;
        break;
      }
      if (_.setup)
        try {
          Oe(_.setup, s), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
        } catch (q) {
          console.error(`[${T}] Cinematic "${e}": error applying setup for segment "${P}":`, q);
        }
      if ((D = _.timeline) != null && D.length) {
        const q = Sc(_.timeline);
        nn({ type: "timeline-start", segmentName: P, durationMs: q });
        const { tl: j } = Py(
          { setup: {}, timeline: _.timeline },
          s,
          o,
          {
            timelineName: `cinematic-${i}-${e}-${P}`,
            onStepComplete: /* @__PURE__ */ c((V) => {
              nn({ type: "step-complete", segmentName: P, stepIndex: V });
            }, "onStepComplete")
          }
        );
        Se = j.run({
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
            w = !0;
            break;
          }
          throw V;
        }
        nn({ type: "timeline-end", segmentName: P });
      }
      if (m.signal.aborted) {
        w = !0;
        break;
      }
      if (_.landing)
        try {
          Oe(_.landing, s), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
        } catch (q) {
          console.error(`[${T}] Cinematic "${e}": error applying landing for segment "${P}":`, q);
        }
      nn({ type: "segment-complete", segmentName: P }), y.add(P);
      const H = _.next;
      if (H && typeof H == "object" && H.scene) {
        const q = H.scene, j = H.segment ?? a.entry;
        console.log(`[${T}] Cinematic "${e}": cross-scene transition to scene ${q}, segment "${j}"`), Se = null, ln = null, Zl(i, e), pu(), a.tracking !== !1 && await game.user.setFlag(T, Ii(i, e), !0), ni = { sceneId: q, cinematicName: e, visitedChain: t };
        const B = game.scenes.get(q);
        B ? B.view() : (console.warn(`[${T}] Cinematic: cross-scene transition target scene "${q}" not found.`), ni = null);
        return;
      }
    }
  } catch (F) {
    b = !0, console.error(`[${T}] Cinematic "${e}" error on scene ${i}:`, F);
  }
  if (Se = null, ln = null, Zl(i, e), pu(), Sr = null, Tr = null, nn({ type: "playback-end", cancelled: !!w }), w) {
    console.log(`[${T}] Cinematic "${e}" cancelled on scene ${i}.`), uo(a, s);
    return;
  }
  if (b) {
    uo(a, s);
    return;
  }
  a.tracking !== !1 && await game.user.setFlag(T, Ii(i, e), !0), console.log(`[${T}] Cinematic "${e}" complete on scene ${i}.`);
}
c(Lr, "playCinematic");
async function Mb(n, e = "default") {
  var i;
  const t = n ?? ((i = canvas.scene) == null ? void 0 : i.id);
  t && (await game.user.unsetFlag(T, Ii(t, e)), console.log(`[${T}] Cinematic: cleared seen flag for "${e}" on scene ${t}.`));
}
c(Mb, "resetCinematic");
async function _b(n, e, t = "default") {
  var a;
  if (!game.user.isGM) return;
  const i = n ?? ((a = canvas.scene) == null ? void 0 : a.id);
  if (!i || !e) return;
  const r = game.users.get(e);
  r && (await r.unsetFlag(T, Ii(i, t)), console.log(`[${T}] Cinematic: cleared seen flag for user ${r.name} on "${t}" scene ${i}.`));
}
c(_b, "resetCinematicForUser");
async function Nb(n, e = "default") {
  var a;
  if (!game.user.isGM) return;
  const t = n ?? ((a = canvas.scene) == null ? void 0 : a.id);
  if (!t) return;
  const i = Ii(t, e), r = game.users.map((o) => o.getFlag(T, i) ? o.unsetFlag(T, i) : Promise.resolve());
  await Promise.all(r), console.log(`[${T}] Cinematic: cleared seen flag for all users on "${e}" scene ${t}.`);
}
c(Nb, "resetCinematicForAll");
function xb(n, e = "default") {
  var r;
  const t = n ?? ((r = canvas.scene) == null ? void 0 : r.id);
  if (!t) return [];
  const i = Ii(t, e);
  return game.users.map((a) => ({
    userId: a.id,
    name: a.name,
    color: a.color ?? "#888888",
    isGM: a.isGM,
    seen: !!a.getFlag(T, i)
  }));
}
c(xb, "getSeenStatus");
function $b(n, e) {
  var i;
  const t = n ?? ((i = canvas.scene) == null ? void 0 : i.id);
  return e ? co(t, e) != null : os(t) != null;
}
c($b, "hasCinematic");
function Fb() {
  if (!Sr || !Tr) {
    console.warn(`[${T}] Cinematic: no snapshot available for revert.`);
    return;
  }
  (Se == null ? void 0 : Se.status) === "running" && Se.cancel("reverted"), Se = null, ln && (ln.abort("reverted"), ln = null);
  try {
    Oe(Sr, Tr), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 }), console.log(`[${T}] Cinematic: reverted to pre-cinematic state.`);
  } catch (n) {
    console.error(`[${T}] Cinematic: error during revert:`, n);
  }
  Sr = null, Tr = null;
}
c(Fb, "revertCinematic");
async function Db() {
  const n = ++Mi;
  if (console.log(`[${T}] Cinematic: canvasReady fired, gen=${n}, game.ready=${game.ready}`), await Ob(), n !== Mi) return;
  console.log(`[${T}] Cinematic: game is ready`);
  const e = canvas.scene;
  if (!e) {
    console.log(`[${T}] Cinematic: no canvas.scene, exiting`);
    return;
  }
  if (ni && ni.sceneId === e.id) {
    const a = ni;
    ni = null, console.log(`[${T}] Cinematic: picking up pending transition to "${a.cinematicName}" on scene ${e.id}`);
    try {
      await Lr(e.id, a.cinematicName, a.visitedChain);
    } catch (o) {
      console.error(`[${T}] Cinematic: error during pending transition playback on scene ${e.id}:`, o);
    }
    return;
  }
  ni = null;
  const t = os(e.id);
  if (!t) {
    console.log(`[${T}] Cinematic: no cinematic flag on scene ${e.id}, exiting`);
    return;
  }
  console.log(`[${T}] Cinematic: found ${Object.keys(t.cinematics).length} cinematic(s) on scene ${e.id}`);
  const i = [];
  for (const [a, o] of Object.entries(t.cinematics))
    (!o.trigger || o.trigger === "canvasReady") && i.push({ name: a, data: o });
  if (i.length === 0) {
    console.log(`[${T}] Cinematic: no canvasReady cinematics on scene ${e.id}, exiting`);
    return;
  }
  for (const { name: a } of i) {
    const o = hm(e.id, a);
    if (n !== Mi) return;
    if (o) {
      console.log(`[${T}] Cinematic "${a}": found saved progress at segment "${o.currentSegment}", resuming...`);
      try {
        await Lr(e.id, a);
      } catch (s) {
        console.error(`[${T}] Cinematic "${a}": error during resumed playback on scene ${e.id}:`, s);
      }
      return;
    }
  }
  let r = null;
  for (const { name: a, data: o } of i)
    if (!(o.tracking !== !1 && Au(e.id, a))) {
      r = { name: a, data: o };
      break;
    }
  if (!r) {
    if (console.log(`[${T}] Cinematic: all canvasReady cinematics already seen on scene ${e.id}`), Pb(e.id, i), (Se == null ? void 0 : Se.status) === "running" && Se.cancel("already-seen"), Se = null, await ec(), n !== Mi) return;
    for (const { name: a, data: o } of i)
      try {
        const { targets: s } = no(o);
        uo(o, s);
      } catch (s) {
        console.error(`[${T}] Cinematic "${a}": error applying landing states (already seen) on scene ${e.id}:`, s);
      }
    canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    return;
  }
  if (n === Mi && (console.log(`[${T}] Cinematic: playing first unseen cinematic "${r.name}"...`), await ec(), n === Mi)) {
    for (const { name: a, data: o } of i) {
      if (a === r.name) continue;
      if (o.tracking !== !1 && Au(e.id, a))
        try {
          const { targets: l } = no(o);
          uo(o, l);
        } catch (l) {
          console.error(`[${T}] Cinematic "${a}": error applying landing states (already seen) on scene ${e.id}:`, l);
        }
    }
    try {
      await Lr(e.id, r.name);
    } catch (a) {
      console.error(`[${T}] Cinematic "${r.name}": error during playback on scene ${e.id}:`, a);
    }
  }
}
c(Db, "onCanvasReady$1");
function Pb(n, e) {
  for (const { name: t } of e)
    Zl(n, t);
}
c(Pb, "clearAllCanvasReadyProgress");
function Rb(n = 3e5) {
  var i;
  const e = (i = game.user.flags) == null ? void 0 : i[T];
  if (!e) return;
  const t = Date.now();
  for (const r of Object.keys(e)) {
    if (!r.startsWith("cinematic-progress-")) continue;
    const a = e[r];
    if (!a || typeof a.timestamp != "number") {
      game.user.unsetFlag(T, r).catch(() => {
      });
      continue;
    }
    t - a.timestamp > n && (console.log(`[${T}] Cinematic: cleaning up stale progress flag "${r}" (age: ${t - a.timestamp}ms)`), game.user.unsetFlag(T, r).catch(() => {
    }));
  }
}
c(Rb, "cleanupStaleProgressFlags");
function Hb() {
  Hooks.on("getSceneControlButtons", (n) => {
    if (!game.user.isGM) return;
    const e = Array.isArray(n) ? n : n instanceof Map ? Array.from(n.values()) : Object.values(n);
    if (!e.length) return;
    const t = e.find((o) => (o == null ? void 0 : o.name) === "tiles") ?? e.find((o) => (o == null ? void 0 : o.name) === "tokens" || (o == null ? void 0 : o.name) === "token") ?? e[0];
    if (!t) return;
    const i = t.tools, r = "eidolonCinematicEditor";
    if (Array.isArray(i) && i.some((o) => (o == null ? void 0 : o.name) === r) || i instanceof Map && i.has(r)) return;
    const a = {
      name: r,
      title: "Cinematic Editor",
      icon: "fa-solid fa-film",
      button: !0,
      toggle: !1,
      visible: !0,
      onClick: /* @__PURE__ */ c(() => {
        new zl({ scene: canvas.scene }).render(!0);
      }, "onClick")
    };
    Array.isArray(i) ? i.push(a) : i instanceof Map ? i.set(r, a) : i && typeof i == "object" ? i[r] = a : t.tools = [a];
  });
}
c(Hb, "registerEditorButton");
function qb() {
  Hooks.on("canvasReady", Db), Hb(), Hooks.once("ready", () => {
    Rb();
    const n = game.modules.get(T);
    n.api || (n.api = {}), n.api.cinematic = {
      play: Lr,
      reset: Mb,
      resetForUser: _b,
      resetForAll: Nb,
      getSeenStatus: xb,
      has: $b,
      get: co,
      list: Ib,
      revert: Fb,
      onPlaybackProgress: Sb,
      TileAnimator: Li,
      registerBehaviour: me,
      getBehaviour: Da,
      trigger: /* @__PURE__ */ c(async (e, t, i = "default") => {
        var o;
        const r = t ?? ((o = canvas.scene) == null ? void 0 : o.id);
        if (!r) return;
        const a = co(r, i);
        a && (a.trigger && a.trigger !== e || await Lr(r, i));
      }, "trigger")
    }, console.log(`[${T}] Cinematic API registered (v5).`);
  });
}
c(qb, "registerCinematicHooks");
function tc(n, e) {
  const t = Math.abs(n.width), i = Math.abs(n.height), r = t / 2, a = i / 2;
  let o = e.x - (n.x + r), s = e.y - (n.y + a);
  if (n.rotation !== 0) {
    const l = Math.toRadians(n.rotation), u = Math.cos(l), d = Math.sin(l), m = u * o + d * s, f = u * s - d * o;
    o = m, s = f;
  }
  return o += r, s += a, o >= 0 && o <= t && s >= 0 && s <= i;
}
c(tc, "pointWithinTile");
ns("tile-click", (n, e) => n.target ? new Promise((t, i) => {
  var g;
  if (e.signal.aborted) return i(e.signal.reason ?? "aborted");
  const r = rs(n.target);
  if (!((g = r == null ? void 0 : r.placeables) != null && g.length))
    return i(new Error(`await tile-click: no placeables found for "${n.target}"`));
  const a = r.placeables, o = [];
  for (const { placeable: p } of a) {
    const y = new Li(p, n.animation);
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
    for (const { placeable: v, animator: S } of o)
      tc(v.document, w) ? (b = !0, S.state !== "hover" && S.setState("hover")) : S.state === "hover" && S.setState("idle");
    b ? l === null && (l = document.body.style.cursor, document.body.style.cursor = "pointer") : l !== null && (document.body.style.cursor = l, l = null);
  }, "onPointerMove");
  s == null || s.addEventListener("pointermove", u);
  const d = /* @__PURE__ */ c((p) => {
    if (p.button !== 0) return;
    const y = canvas.activeLayer;
    if (!y) return;
    const w = y.toLocal(p);
    isNaN(w.x) || isNaN(w.y) || !a.filter(({ doc: v }) => tc(v, w)).sort((v, S) => (S.doc.sort ?? 0) - (v.doc.sort ?? 0))[0] || (p.stopPropagation(), p.preventDefault(), f(), t());
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
qb();
function jb() {
  Hooks.once("ready", () => {
    const n = game.modules.get(T);
    n.api || (n.api = {}), n.api.picker = {
      /** Open the picker window. Returns Promise<string[] | null>. */
      open: /* @__PURE__ */ c((e) => lo.open(e), "open"),
      /** Resolve a selector string to documents. */
      resolveSelector: rs,
      /** Parse a selector string into { type, value }. */
      parseSelector: Cc,
      /** Build a selector string from { type, value }. */
      buildSelector: Ty,
      /** Build a tag selector from tags array + mode. */
      buildTagSelector: _f,
      /** Canvas highlight utilities. */
      highlight: {
        add: so,
        remove: er,
        has: Bf,
        clearAll: Fa
      }
    }, console.log(`[${T}] Placeable Picker API registered.`);
  });
}
c(jb, "registerPlaceablePickerHooks");
jb();
const dr = "canvas-popup", Bb = 100;
function Ub(n) {
  const e = canvas.stage.worldTransform, t = document.getElementById("board"), i = t == null ? void 0 : t.getBoundingClientRect(), r = (i == null ? void 0 : i.left) ?? 0, a = (i == null ? void 0 : i.top) ?? 0;
  return {
    x: e.a * n.x + e.c * n.y + e.tx + r,
    y: e.b * n.x + e.d * n.y + e.ty + a
  };
}
c(Ub, "canvasToScreen");
function Vb() {
  var n, e;
  return ((e = (n = canvas.stage) == null ? void 0 : n.scale) == null ? void 0 : e.x) ?? 1;
}
c(Vb, "getZoom");
function As(n, e) {
  var t;
  return e === "grid" ? n * (((t = canvas.grid) == null ? void 0 : t.size) ?? 100) : n;
}
c(As, "resolveUnit");
function zb(n, e) {
  let t = !1;
  function i(r) {
    t && r.button === 0 && (n.contains(r.target) || e());
  }
  return c(i, "handler"), requestAnimationFrame(() => {
    t = !0;
  }), document.addEventListener("pointerdown", i, !0), () => {
    document.removeEventListener("pointerdown", i, !0);
  };
}
c(zb, "attachClickOutside");
function Gb(n, e) {
  let t = !1;
  function i(r) {
    t && r.button === 2 && (n.contains(r.target) || e());
  }
  return c(i, "handler"), requestAnimationFrame(() => {
    t = !0;
  }), document.addEventListener("pointerdown", i, !0), () => {
    document.removeEventListener("pointerdown", i, !0);
  };
}
c(Gb, "attachRightClickOutside");
function Wb(n, e) {
  function t(i) {
    i.key === "Escape" && (i.preventDefault(), i.stopPropagation(), e());
  }
  return c(t, "handler"), document.addEventListener("keydown", t, !0), () => {
    document.removeEventListener("keydown", t, !0);
  };
}
c(Wb, "attachEscape");
const ks = /* @__PURE__ */ new Set(), ya = 8, ku = 0.5, Nc = class Nc {
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
    var t, i, r, a, o;
    this._anchor = this._resolveAnchor(e.anchor), this._offset = { x: ((t = e.offset) == null ? void 0 : t.x) ?? 0, y: ((i = e.offset) == null ? void 0 : i.y) ?? 0 }, this._anchorX = e.anchorX ?? "left", this._anchorY = e.anchorY ?? "top", this._sizeUnit = e.sizeUnit ?? "grid", this._dismiss = {
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
    e.className = dr, this._cssClass && e.classList.add(...this._cssClass.split(/\s+/)), e.style.position = "fixed", e.style.zIndex = Bb;
    const t = document.createElement("div");
    t.className = `${dr}__content`, e.appendChild(t), this.element = e, this._contentWrap = t;
    const i = this._resolveWidth();
    i != null && (t.style.width = `${i}px`, t.style.minWidth = "0", t.style.boxSizing = "border-box"), this._initialContent && this.setContent(this._initialContent), document.body.appendChild(e), this.reposition(), this._animate ? requestAnimationFrame(() => {
      this.element && this.element.classList.add(`${dr}--visible`);
    }) : e.classList.add(`${dr}--visible`), this._hookId = Hooks.on("canvasPan", () => this.reposition()), this._anchor.placeable && ((a = canvas.app) != null && a.ticker) && (this._tickerFn = () => this.reposition(), canvas.app.ticker.add(this._tickerFn));
    const r = /* @__PURE__ */ c((o) => {
      this._emit("dismiss", o), this.destroy();
    }, "dismissFn");
    return this._dismiss.clickOutside && this._cleanups.push(zb(e, () => r("clickOutside"))), this._dismiss.rightClickOutside && this._cleanups.push(Gb(e, () => r("rightClickOutside"))), this._dismiss.escape && this._cleanups.push(Wb(e, () => r("escape"))), this.isOpen = !0, ks.add(this), this._emit("open"), this;
  }
  /**
   * Remove from DOM and clean up everything. Idempotent.
   */
  destroy() {
    var t;
    if (!this.isOpen) return;
    this.isOpen = !1, ks.delete(this);
    for (const i of this._cleanups) i();
    this._cleanups.length = 0, this._hookId != null && (Hooks.off("canvasPan", this._hookId), this._hookId = null), this._tickerFn && ((t = canvas.app) != null && t.ticker) && (canvas.app.ticker.remove(this._tickerFn), this._tickerFn = null);
    const e = this.element;
    if (e) {
      if (this._animate) {
        e.classList.remove(`${dr}--visible`);
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
    const t = !!this._anchor.placeable;
    this._anchor = this._resolveAnchor(e);
    const i = !!this._anchor.placeable;
    t && !i && this._tickerFn && ((r = canvas.app) != null && r.ticker) ? (canvas.app.ticker.remove(this._tickerFn), this._tickerFn = null) : !t && i && this.isOpen && ((a = canvas.app) != null && a.ticker) && !this._tickerFn && (this._tickerFn = () => this.reposition(), canvas.app.ticker.add(this._tickerFn)), this._lastScreenPos = { x: -99999, y: -99999 }, this.reposition();
  }
  /**
   * Force recalculate position. Auto-called on canvasPan and ticker.
   */
  reposition() {
    if (!this.element) return;
    const e = this._getAnchorCanvasPoint();
    if (!e) return;
    const t = Vb(), i = this._sizeUnit !== "screen", r = As(this._offset.x, this._sizeUnit), a = As(this._offset.y, this._sizeUnit), o = {
      x: e.x + r,
      y: e.y + a
    }, s = Ub(o);
    if (Math.abs(s.x - this._lastScreenPos.x) < ku && Math.abs(s.y - this._lastScreenPos.y) < ku)
      return;
    this._lastScreenPos = { x: s.x, y: s.y };
    const l = this.element, u = i ? t : 1;
    i ? (l.style.transformOrigin = `${this._anchorX} ${this._anchorY}`, l.style.transform = `scale(${u})`) : (l.style.transform = "", l.style.transformOrigin = "");
    let d = 0, m = 0;
    const f = l.getBoundingClientRect();
    this._anchorX === "center" ? d = -f.width / 2 : this._anchorX === "right" && (d = -f.width), this._anchorY === "center" ? m = -f.height / 2 : this._anchorY === "bottom" && (m = -f.height);
    let g = s.x + d, p = s.y + m;
    if (this._clampToViewport) {
      const y = window.innerWidth - f.width - ya, w = window.innerHeight - f.height - ya;
      g = Math.max(ya, Math.min(g, y)), p = Math.max(ya, Math.min(p, w));
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
  on(e, t) {
    return this._listeners.has(e) || this._listeners.set(e, /* @__PURE__ */ new Set()), this._listeners.get(e).add(t), this;
  }
  /**
   * Unregister a lifecycle callback.
   * @param {"open" | "close" | "dismiss" | "reposition"} event
   * @param {Function} fn
   * @returns {this}
   */
  off(e, t) {
    var i;
    return (i = this._listeners.get(e)) == null || i.delete(t), this;
  }
  // ── Static ────────────────────────────────────────────────────────────
  /**
   * Destroy all mounted popup instances.
   */
  static destroyAll() {
    for (const e of [...ks])
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
      const t = e.document.object;
      if (t) return { placeable: t };
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
    return this._width == null ? null : this._width === "anchor" ? this._getAnchorSize().width : As(this._width, this._sizeUnit);
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
    const t = e.document;
    return ((i = t == null ? void 0 : t.shape) == null ? void 0 : i.width) != null ? { width: t.shape.width, height: t.shape.height } : (t == null ? void 0 : t.width) != null ? { width: t.width, height: t.height } : (t == null ? void 0 : t.width) != null ? { width: t.width * (((r = canvas.grid) == null ? void 0 : r.size) ?? 100), height: t.height * (((a = canvas.grid) == null ? void 0 : a.size) ?? 100) } : { width: 0, height: 0 };
  }
  /**
   * Get the current canvas-space anchor point.
   * @returns {{ x: number, y: number } | null}
   */
  _getAnchorCanvasPoint() {
    if (this._anchor.placeable) {
      const e = this._anchor.placeable, t = e.document;
      return t ? { x: t.x ?? e.x ?? 0, y: t.y ?? e.y ?? 0 } : { x: e.x ?? 0, y: e.y ?? 0 };
    }
    return { x: this._anchor.x, y: this._anchor.y };
  }
  /**
   * Emit a lifecycle event.
   * @param {string} event
   * @param  {...any} args
   */
  _emit(e, ...t) {
    const i = this._listeners.get(e);
    if (i)
      for (const r of i)
        try {
          r(this, ...t);
        } catch (a) {
          console.error(`[CanvasPopup] Error in '${e}' listener:`, a);
        }
  }
};
c(Nc, "CanvasPopup");
let fo = Nc;
const Zn = "canvas-popup-options";
function Yb({ sections: n = [] } = {}) {
  const e = /* @__PURE__ */ new Map(), t = document.createElement("div");
  t.className = Zn;
  for (const s of n) {
    const l = document.createElement("div");
    l.className = `${Zn}__section`;
    const u = document.createElement("div");
    u.className = `${Zn}__header`, u.textContent = s.label, l.appendChild(u);
    for (const d of s.items) {
      const m = document.createElement("div");
      m.className = `${Zn}__item`, d.active && m.classList.add(`${Zn}__item--active`), m.dataset.key = s.key, m.dataset.value = d.value;
      const f = document.createElement("span");
      f.className = `${Zn}__dot`, m.appendChild(f);
      const g = document.createElement("span");
      g.className = `${Zn}__label`, g.textContent = d.label, m.appendChild(g), m.addEventListener("click", (p) => {
        i("select", s.key, d.value, d, p);
      }), m.addEventListener("mouseenter", () => {
        i("hover", s.key, d.value, d);
      }), m.addEventListener("mouseleave", () => {
        i("hoverEnd", s.key, d.value, d);
      }), l.appendChild(m);
    }
    t.appendChild(l);
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
    e.clear(), t.remove();
  }
  return c(o, "destroy"), { element: t, on: r, off: a, destroy: o };
}
c(Yb, "createOptionList");
function Jb() {
  Hooks.once("ready", () => {
    const n = game.modules.get(T);
    n.api || (n.api = {}), n.api.canvasPopup = {
      CanvasPopup: fo,
      content: { createOptionList: Yb }
    }, console.log(`[${T}] Canvas Popup API registered.`);
  }), Hooks.on("canvasTearDown", () => fo.destroyAll());
}
c(Jb, "registerCanvasPopupHooks");
Jb();
const Ra = "eidolon-utilities", Kb = "tile-interactions", Xb = "tile-animations", Qb = "idle-animation";
function Zb(n) {
  const e = n.type ?? "tile-prop";
  return e === "tile-tint" ? { name: "tween-tint", fromColor: n.fromColor, toColor: n.toColor, mode: n.mode, period: n.period, easing: n.easing } : e === "tile-scale" ? { name: "tween-scale", fromScale: n.fromScale, toScale: n.toScale, period: n.period, easing: n.easing } : { name: "tween-prop", attribute: n.attribute, from: n.from, to: n.to, period: n.period, easing: n.easing };
}
c(Zb, "migrateIdleTweenToAlways");
function Lc(n) {
  var u, d, m;
  const e = (u = n == null ? void 0 : n.getFlag) == null ? void 0 : u.call(n, Ra, Xb);
  if (e) return e;
  const t = (d = n == null ? void 0 : n.getFlag) == null ? void 0 : d.call(n, Ra, Qb), i = (m = n == null ? void 0 : n.getFlag) == null ? void 0 : m.call(n, Ra, Kb);
  let r = [], a = [], o = [], s = [];
  if (t) {
    let f;
    Array.isArray(t) ? f = t : typeof t == "object" && "0" in t ? f = Object.values(t) : typeof t == "object" && (t.type || t.attribute) ? f = [t] : f = [], r = f.filter((g) => g && typeof g == "object").map(Zb);
  }
  return i && (i.hover && (Array.isArray(i.hover) ? o = i.hover : typeof i.hover == "object" && (a = Array.isArray(i.hover.idle) ? i.hover.idle : [], o = Array.isArray(i.hover.enter) ? i.hover.enter : [])), Array.isArray(i.click) && i.click.length && (s = i.click)), r.length > 0 || a.length > 0 || o.length > 0 || s.length > 0 ? { always: r, idle: a, hover: o, click: s } : null;
}
c(Lc, "readUnifiedConfig");
const mn = /* @__PURE__ */ new Map(), Vn = /* @__PURE__ */ new Map(), Mu = /* @__PURE__ */ new WeakMap(), Ir = /* @__PURE__ */ new Set();
let xt = null, Ye = null, _t = null, Gt = null, Wt = null;
function pm(n) {
  const e = canvas.activeLayer;
  if (!e) return null;
  const t = e.toLocal(n);
  return !t || Number.isNaN(t.x) || Number.isNaN(t.y) ? null : t;
}
c(pm, "canvasToLocal");
function ym(n) {
  let e = null, t = -1 / 0;
  for (const [i, r] of mn)
    if (tc(r.doc, n)) {
      const a = r.doc.sort ?? 0;
      a > t && (e = r, t = a);
    }
  return e;
}
c(ym, "hitTest");
function ev(n) {
  var e, t;
  return {
    always: n.always ?? [],
    idle: (e = n.idle) != null && e.length ? n.idle : ["none"],
    hover: (t = n.hover) != null && t.length ? n.hover : ["none"]
  };
}
c(ev, "buildAnimatorConfig");
function Ic(n, e, t) {
  aa(n);
  const i = ev(t), r = new Li(e, i);
  r.start("idle"), Vn.set(n, r);
}
c(Ic, "startHoverAnimator");
function aa(n) {
  const e = Vn.get(n);
  e && (e.detach(), Vn.delete(n));
}
c(aa, "stopHoverAnimator");
function Ms(n, e, t, i) {
  return e.type === "tile-tint" ? { uuid: n, toColor: t ? e.toColor : e.fromColor, mode: e.mode } : e.type === "tile-scale" ? {
    uuid: n,
    toScale: t ? e.toScale : e.fromScale,
    ...i
  } : { uuid: n, attribute: e.attribute, value: t ? e.to : e.from };
}
c(Ms, "buildClickParams");
function tv(n) {
  const e = n._source.width, t = n._source.height, i = n._source.x, r = n._source.y;
  return {
    baseWidth: e,
    baseHeight: t,
    centerX: i + e / 2,
    centerY: r + t / 2
  };
}
c(tv, "captureRefGeometry");
async function nv(n, e) {
  const t = n.uuid, i = e.type ?? "tile-prop", r = ir(i);
  if (!r) {
    console.warn(`[${Ra}] tile-interactions: unknown tween type "${i}"`);
    return;
  }
  const a = e.period ?? 300, o = e.easing ?? "easeOutCubic", s = e.mode ?? "bounce", l = i === "tile-scale" ? tv(n) : null;
  if (s === "toggle") {
    const d = !(Mu.get(n) ?? !1);
    await r.execute(
      Ms(t, e, d, l),
      { durationMS: a, easing: o, commit: !0 }
    ), Mu.set(n, d);
  } else {
    const u = a / 2;
    await r.execute(
      Ms(t, e, !0, l),
      { durationMS: u, easing: o, commit: !1 }
    ), await r.execute(
      Ms(t, e, !1, l),
      { durationMS: u, easing: o, commit: !1 }
    );
  }
}
c(nv, "playClickAnimation");
async function iv(n) {
  var t, i, r, a;
  const e = n.doc.id;
  if (!Ir.has(e)) {
    Ir.add(e);
    try {
      aa(e);
      const o = n.clickConfig.map((s) => nv(n.doc, s));
      await Promise.all(o);
    } finally {
      Ir.delete(e), n.animConfig && (((t = n.animConfig.always) == null ? void 0 : t.length) > 0 || ((i = n.animConfig.idle) == null ? void 0 : i.length) > 0 || ((r = n.animConfig.hover) == null ? void 0 : r.length) > 0) && (Ic(e, n.placeable, n.animConfig), xt === e && ((a = Vn.get(e)) == null || a.setState("hover")));
    }
  }
}
c(iv, "handleClick");
function bm(n) {
  var r;
  const e = pm(n);
  if (!e) return;
  const t = ym(e), i = (t == null ? void 0 : t.doc.id) ?? null;
  if (i !== xt) {
    if (xt) {
      const a = Vn.get(xt);
      a && a.setState("idle");
    }
    if (i) {
      const a = Vn.get(i);
      a && a.setState("hover");
    }
    xt = i, i && (t.animConfig || (r = t.clickConfig) != null && r.length) ? (Ye === null && (Ye = document.body.style.cursor), document.body.style.cursor = "pointer") : Ye !== null && (document.body.style.cursor = Ye, Ye = null);
  }
}
c(bm, "onPointerMove");
function vm(n) {
  var i;
  if (n.button !== 0) return;
  const e = pm(n);
  if (!e) return;
  const t = ym(e);
  !t || !((i = t.clickConfig) != null && i.length) || iv(t);
}
c(vm, "onPointerDown");
function wm() {
  if (xt) {
    const n = Vn.get(xt);
    n && n.setState("idle"), xt = null;
  }
  Ye !== null && (document.body.style.cursor = Ye, Ye = null);
}
c(wm, "onPointerLeave");
function Em() {
  var t, i, r, a;
  for (const o of Vn.keys())
    aa(o);
  mn.clear(), Ir.clear(), xt = null, Ye !== null && (document.body.style.cursor = Ye, Ye = null);
  const n = document.getElementById("board");
  _t && (n == null || n.removeEventListener("pointermove", _t), _t = null), Gt && (n == null || n.removeEventListener("pointerdown", Gt), Gt = null), Wt && (n == null || n.removeEventListener("pointerleave", Wt), Wt = null);
  const e = (t = canvas.tiles) == null ? void 0 : t.placeables;
  if (Array.isArray(e)) {
    for (const o of e) {
      const s = o.document, l = Lc(s);
      if (!l) continue;
      const u = ((i = l.always) == null ? void 0 : i.length) > 0 || ((r = l.idle) == null ? void 0 : r.length) > 0 || ((a = l.hover) == null ? void 0 : a.length) > 0, d = Array.isArray(l.click) && l.click.length ? l.click : null;
      !u && !d || (mn.set(s.id, { doc: s, placeable: o, animConfig: l, clickConfig: d }), u && Ic(s.id, o, l));
    }
    mn.size !== 0 && (_t = bm, Gt = vm, Wt = wm, n == null || n.addEventListener("pointermove", _t), n == null || n.addEventListener("pointerdown", Gt), n == null || n.addEventListener("pointerleave", Wt));
  }
}
c(Em, "rebuild");
function rv(n) {
  var o, s, l;
  const e = n.id, t = Lc(n), i = t && (((o = t.always) == null ? void 0 : o.length) > 0 || ((s = t.idle) == null ? void 0 : s.length) > 0 || ((l = t.hover) == null ? void 0 : l.length) > 0), r = t && Array.isArray(t.click) && t.click.length ? t.click : null;
  if (!i && !r) {
    Cm(n);
    return;
  }
  aa(e);
  const a = n.object;
  if (!a) {
    mn.delete(e);
    return;
  }
  mn.set(e, { doc: n, placeable: a, animConfig: t, clickConfig: r }), i && Ic(e, a, t), av();
}
c(rv, "updateTile");
function Cm(n) {
  const e = n.id;
  if (aa(e), mn.delete(e), Ir.delete(e), xt === e && (xt = null, Ye !== null && (document.body.style.cursor = Ye, Ye = null)), mn.size === 0) {
    const t = document.getElementById("board");
    _t && (t == null || t.removeEventListener("pointermove", _t), _t = null), Gt && (t == null || t.removeEventListener("pointerdown", Gt), Gt = null), Wt && (t == null || t.removeEventListener("pointerleave", Wt), Wt = null);
  }
}
c(Cm, "removeTile");
function av() {
  if (mn.size === 0 || _t) return;
  const n = document.getElementById("board");
  n && (_t = bm, Gt = vm, Wt = wm, n.addEventListener("pointermove", _t), n.addEventListener("pointerdown", Gt), n.addEventListener("pointerleave", Wt));
}
c(av, "ensureListeners");
function xi(n, e, t) {
  const i = document.createElement("div");
  i.classList.add("form-group");
  const r = document.createElement("label");
  r.textContent = n;
  const a = document.createElement("select");
  a.classList.add(e);
  for (const o of t) {
    const s = document.createElement("option");
    s.value = o.value, s.textContent = o.label, o.selected && (s.selected = !0), a.appendChild(s);
  }
  return i.append(r, a), i;
}
c(xi, "buildSelectGroup");
function $i(n, e, t, i = {}) {
  const r = document.createElement("div");
  r.classList.add("form-group");
  const a = document.createElement("label");
  a.textContent = n;
  const o = document.createElement("input");
  o.type = "number", o.classList.add(e), o.value = String(t);
  for (const [s, l] of Object.entries(i)) o.setAttribute(s, l);
  return r.append(a, o), r;
}
c($i, "buildNumberGroup");
function nc(n, e, t) {
  const i = document.createElement("div");
  i.classList.add("form-group");
  const r = document.createElement("label");
  r.textContent = n;
  const a = document.createElement("div");
  a.classList.add("idle-anim__color-wrapper");
  const o = document.createElement("input");
  o.type = "color", o.classList.add(e), o.value = t;
  const s = document.createElement("input");
  return s.type = "text", s.classList.add(`${e}-text`), s.value = t, s.maxLength = 7, o.addEventListener("input", () => {
    s.value = o.value;
  }), s.addEventListener("change", () => {
    /^#[0-9a-f]{6}$/i.test(s.value) && (o.value = s.value);
  }), a.append(o, s), i.append(r, a), i;
}
c(nc, "buildColorGroup");
let oe = null;
function _s() {
  for (const n of document.querySelectorAll(".idle-anim__slot--insert-before, .idle-anim__slot--insert-after"))
    n.classList.remove("idle-anim__slot--insert-before", "idle-anim__slot--insert-after");
}
c(_s, "clearInsertIndicators");
function _u(n) {
  for (const e of document.querySelectorAll(".idle-anim__slots"))
    e.classList.toggle("idle-anim__slots--drag-active", n);
}
c(_u, "setDragActive");
function mo(n, e) {
  n.dispatchEvent(new CustomEvent("slot-reorder", { detail: { card: e } }));
}
c(mo, "notifyReorder");
function Sm(n, { dropGroup: e, handleSelector: t = ".idle-anim__slot-header" }) {
  n.setAttribute("draggable", "true");
  let i = !1;
  n.addEventListener("pointerdown", (r) => {
    i = !!r.target.closest(t);
  }), n.addEventListener("dragstart", (r) => {
    if (!i) {
      r.preventDefault();
      return;
    }
    oe = { card: n, sourceContainer: n.parentElement, group: e, insertMode: null, insertTarget: null }, n.classList.add("is-dragging"), _u(!0), r.dataTransfer.effectAllowed = "move", r.dataTransfer.setData("text/plain", "");
  }), n.addEventListener("dragover", (r) => {
    if (!oe || oe.group !== e || oe.card === n) return;
    r.preventDefault(), r.dataTransfer.dropEffect = "move";
    const a = n.getBoundingClientRect(), o = a.top + a.height / 2, s = r.clientY < o ? "before" : "after";
    (oe.insertTarget !== n || oe.insertMode !== s) && (_s(), n.classList.add(s === "before" ? "idle-anim__slot--insert-before" : "idle-anim__slot--insert-after"), oe.insertTarget = n, oe.insertMode = s);
  }), n.addEventListener("dragleave", () => {
    n.classList.remove("idle-anim__slot--insert-before", "idle-anim__slot--insert-after"), (oe == null ? void 0 : oe.insertTarget) === n && (oe.insertTarget = null, oe.insertMode = null);
  }), n.addEventListener("drop", (r) => {
    if (r.preventDefault(), r.stopPropagation(), _s(), !oe || oe.group !== e || oe.card === n) return;
    const a = oe.card, o = oe.sourceContainer, s = n.parentElement;
    oe.insertMode === "after" ? s.insertBefore(a, n.nextSibling) : s.insertBefore(a, n), mo(s, a), o !== s && mo(o, a), oe = null;
  }), n.addEventListener("dragend", () => {
    n.classList.remove("is-dragging"), _s(), _u(!1);
    for (const r of document.querySelectorAll(".idle-anim__slots--drag-over"))
      r.classList.remove("idle-anim__slots--drag-over");
    oe = null;
  });
}
c(Sm, "makeDraggable");
function Tm(n, { dropGroup: e, onDrop: t }) {
  n.addEventListener("dragover", (i) => {
    !oe || oe.group !== e || (i.preventDefault(), i.dataTransfer.dropEffect = "move");
  }), n.addEventListener("dragenter", (i) => {
    !oe || oe.group !== e || (i.preventDefault(), n.classList.add("idle-anim__slots--drag-over"));
  }), n.addEventListener("dragleave", (i) => {
    i.relatedTarget && n.contains(i.relatedTarget) || n.classList.remove("idle-anim__slots--drag-over");
  }), n.addEventListener("drop", (i) => {
    if (i.preventDefault(), n.classList.remove("idle-anim__slots--drag-over"), !oe || oe.group !== e) return;
    const r = oe.card, a = oe.sourceContainer;
    n.appendChild(r), mo(n, r), a !== n && mo(a, r), oe = null;
  }), n.addEventListener("slot-reorder", (i) => {
    t == null || t(i.detail.card, n);
  });
}
c(Tm, "makeDropContainer");
const ba = "eidolon-utilities", Nu = "tile-animations", ov = "tile-interactions", sv = "idle-animation", lv = "eidolon-idle-animation", cv = "fa-solid fa-wave-pulse", Lm = [
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
], uv = [
  { value: "tween-prop", label: "Numeric" },
  { value: "tween-tint", label: "Tint" },
  { value: "tween-scale", label: "Scale" }
], Im = {
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
}, Fi = {
  attribute: "alpha",
  from: 1,
  to: 0.5,
  period: 300,
  mode: "bounce"
}, qi = {
  fromColor: "#ffffff",
  toColor: "#ffaa00",
  period: 500,
  mode: "bounce"
}, Ha = {
  type: "tile-scale",
  fromScale: 1,
  toScale: 1.2,
  period: 300,
  easing: "easeOutCubic",
  mode: "bounce"
}, Om = [
  { value: "alpha", label: "Alpha (Opacity)" },
  { value: "rotation", label: "Rotation" },
  { value: "texture.rotation", label: "Texture Rotation" }
];
let wn = null;
function dv(n) {
  var e;
  return (n == null ? void 0 : n.document) ?? ((e = n == null ? void 0 : n.object) == null ? void 0 : e.document) ?? (n == null ? void 0 : n.object) ?? null;
}
c(dv, "getTileDocument");
function fv(n, e) {
  const t = document.createElement("div");
  t.classList.add("form-group");
  const i = document.createElement("label");
  i.textContent = "Type", t.appendChild(i);
  const r = document.createElement("select");
  r.classList.add(e);
  const a = document.createElement("optgroup");
  a.label = "Effects";
  for (const s of Lm) {
    const l = document.createElement("option");
    l.value = s.value, l.textContent = s.label, s.value === n && (l.selected = !0), a.appendChild(l);
  }
  r.appendChild(a);
  const o = document.createElement("optgroup");
  o.label = "Tweens";
  for (const s of uv) {
    const l = document.createElement("option");
    l.value = s.value, l.textContent = s.label, s.value === n && (l.selected = !0), o.appendChild(l);
  }
  return r.appendChild(o), t.appendChild(r), t;
}
c(fv, "buildEffectTypeSelect");
function xu(n) {
  if (!n) return "";
  const e = n.name ?? "float";
  if (e === "tween-prop")
    return `Tween ${n.attribute ?? "alpha"} ${n.from ?? "?"}→${n.to ?? "?"} (${n.period ?? "?"}ms)`;
  if (e === "tween-tint")
    return `Tween Tint ${n.fromColor ?? "?"}→${n.toColor ?? "?"} (${n.period ?? "?"}ms)`;
  if (e === "tween-scale") {
    const i = n.fromScale != null ? `${Math.round(n.fromScale * 100)}%` : "?", r = n.toScale != null ? `${Math.round(n.toScale * 100)}%` : "?";
    return `Tween Scale ${i}→${r} (${n.period ?? "?"}ms)`;
  }
  const t = Lm.find((i) => i.value === e);
  return (t == null ? void 0 : t.label) ?? e;
}
c(xu, "summarizeEffectConfig");
function $u(n, e, t, i) {
  const r = n.name ?? "float", a = bc(), o = Qi(), s = document.createElement("div");
  s.classList.add("idle-anim__slot", "is-collapsed", t), s.dataset.index = String(e);
  const l = document.createElement("div");
  l.classList.add("idle-anim__slot-header");
  const u = document.createElement("i");
  u.classList.add("fa-solid", "fa-chevron-right", "idle-anim__slot-chevron");
  const d = document.createElement("span");
  d.classList.add("idle-anim__slot-title"), d.textContent = `${i} ${e + 1}`;
  const m = document.createElement("span");
  m.classList.add("idle-anim__slot-summary"), m.textContent = xu(n);
  const f = document.createElement("button");
  f.type = "button", f.classList.add("idle-anim__slot-remove"), f.innerHTML = '<i class="fa-solid fa-xmark"></i>', f.title = "Remove effect", l.append(u, d, m, f), s.appendChild(l);
  const g = document.createElement("div");
  g.classList.add("idle-anim__slot-body");
  const p = fv(r, "ti-effect__type");
  g.appendChild(p);
  const y = document.createElement("div");
  y.classList.add("idle-anim__type-fields"), g.appendChild(y);
  function w(v, S) {
    y.innerHTML = "";
    const I = Im[v];
    if (I)
      for (const A of I) {
        const O = S[A.key] ?? A.default;
        if (A.type === "color")
          y.appendChild(nc(A.label, `ti-effect__${A.key}`, O));
        else if (A.type === "select") {
          let x;
          A.options === "interpolation" ? x = o.map((M) => ({ value: M, label: M, selected: M === O })) : Array.isArray(A.options) ? x = A.options.map((M) => ({ value: M.value, label: M.label, selected: M.value === O })) : x = a.map((M) => ({ value: M, label: M, selected: M === O })), y.appendChild(xi(A.label, `ti-effect__${A.key}`, x));
        } else
          y.appendChild($i(A.label, `ti-effect__${A.key}`, O, A.attrs ?? {}));
      }
  }
  c(w, "renderParams"), w(r, n), s.appendChild(g);
  const b = s.querySelector(".ti-effect__type");
  return b == null || b.addEventListener("change", () => {
    w(b.value, {});
  }), l.addEventListener("click", (v) => {
    if (!v.target.closest(".idle-anim__slot-remove") && (s.classList.toggle("is-collapsed"), s.classList.contains("is-collapsed"))) {
      const S = Am(s);
      S && (m.textContent = xu(S));
    }
  }), f.addEventListener("click", (v) => {
    v.stopPropagation();
    const S = s.parentElement;
    s.remove(), S && ss(S, t, i);
  }), Sm(s, { dropGroup: "effect" }), s;
}
c($u, "buildEffectSlot");
function Am(n) {
  var r;
  const e = ((r = n.querySelector(".ti-effect__type")) == null ? void 0 : r.value) ?? "float", t = Im[e], i = { name: e };
  if (t)
    for (const a of t) {
      const o = n.querySelector(`.ti-effect__${a.key}`);
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
c(Am, "readEffectSlot");
function Fu(n) {
  if (!n) return "";
  const e = n.type ?? "tile-prop", t = n.mode ?? "bounce", i = t.charAt(0).toUpperCase() + t.slice(1);
  if (e === "tile-tint")
    return `${i} Tint ${n.fromColor ?? "?"} → ${n.toColor ?? "?"} (${n.period ?? "?"}ms)`;
  if (e === "tile-scale") {
    const o = n.fromScale != null ? `${Math.round(n.fromScale * 100)}%` : "?", s = n.toScale != null ? `${Math.round(n.toScale * 100)}%` : "?";
    return `${i} Scale ${o} → ${s} (${n.period ?? "?"}ms)`;
  }
  const r = Om.find((o) => o.value === n.attribute), a = (r == null ? void 0 : r.label) ?? n.attribute ?? "?";
  return `${i} ${a} ${n.from ?? "?"} → ${n.to ?? "?"} (${n.period ?? "?"}ms)`;
}
c(Fu, "summarizeClickConfig");
function Du(n, e) {
  const t = n.type ?? "tile-prop", i = n.mode ?? "bounce", r = bc(), a = document.createElement("div");
  a.classList.add("idle-anim__slot", "is-collapsed", "ti-click-slot"), a.dataset.index = String(e);
  const o = document.createElement("div");
  o.classList.add("idle-anim__slot-header");
  const s = document.createElement("i");
  s.classList.add("fa-solid", "fa-chevron-right", "idle-anim__slot-chevron");
  const l = document.createElement("span");
  l.classList.add("idle-anim__slot-title"), l.textContent = `Animation ${e + 1}`;
  const u = document.createElement("span");
  u.classList.add("idle-anim__slot-summary"), u.textContent = Fu(n);
  const d = document.createElement("button");
  d.type = "button", d.classList.add("idle-anim__slot-remove"), d.innerHTML = '<i class="fa-solid fa-xmark"></i>', d.title = "Remove animation", o.append(s, l, u, d), a.appendChild(o);
  const m = document.createElement("div");
  m.classList.add("idle-anim__slot-body");
  const f = document.createElement("div");
  f.classList.add("idle-anim__range-row"), f.appendChild(xi("Mode", "ti-click__mode", [
    { value: "bounce", label: "Bounce", selected: i === "bounce" },
    { value: "toggle", label: "Toggle", selected: i === "toggle" }
  ])), f.appendChild(xi("Type", "ti-click__type", [
    { value: "tile-prop", label: "Numeric", selected: t === "tile-prop" },
    { value: "tile-tint", label: "Tint", selected: t === "tile-tint" },
    { value: "tile-scale", label: "Scale", selected: t === "tile-scale" }
  ])), m.appendChild(f);
  const g = document.createElement("div");
  g.classList.add("idle-anim__type-fields"), m.appendChild(g);
  function p(v, S) {
    if (g.innerHTML = "", v === "tile-tint") {
      const I = Qi(), A = S.fromColor ?? qi.fromColor, O = S.toColor ?? qi.toColor, x = S.mode ?? "oklch", M = document.createElement("div");
      M.classList.add("idle-anim__range-row"), M.appendChild(nc("From", "ti-click__from-color", A)), M.appendChild(nc("To", "ti-click__to-color", O)), g.appendChild(M), g.appendChild(xi(
        "Interpolation",
        "ti-click__color-mode",
        I.map((D) => ({ value: D, label: D, selected: D === x }))
      ));
    } else if (v === "tile-scale") {
      const I = S.fromScale ?? Ha.fromScale, A = S.toScale ?? Ha.toScale, O = document.createElement("div");
      O.classList.add("idle-anim__range-row"), O.appendChild($i("From", "ti-click__from-scale", I, { step: "0.01", min: "0.01" })), O.appendChild($i("To", "ti-click__to-scale", A, { step: "0.01", min: "0.01" })), g.appendChild(O);
      const x = document.createElement("p");
      x.classList.add("idle-anim__hint"), x.textContent = "1.0 = original size. Scales from center.", g.appendChild(x);
    } else {
      const I = S.attribute ?? Fi.attribute, A = S.from ?? Fi.from, O = S.to ?? Fi.to;
      g.appendChild(xi(
        "Attribute",
        "ti-click__attribute",
        Om.map((M) => ({ value: M.value, label: M.label, selected: M.value === I }))
      ));
      const x = document.createElement("div");
      x.classList.add("idle-anim__range-row"), x.appendChild($i("From", "ti-click__from", A, { step: "0.01" })), x.appendChild($i("To", "ti-click__to", O, { step: "0.01" })), g.appendChild(x);
    }
  }
  c(p, "renderTypeFields"), p(t, n);
  const y = n.period ?? (t === "tile-tint" ? qi.period : Fi.period), w = n.easing ?? "easeOutCubic";
  m.appendChild($i("Period (ms)", "ti-click__period", y, { min: "50", step: "50" })), m.appendChild(xi(
    "Easing",
    "ti-click__easing",
    r.map((v) => ({ value: v, label: v, selected: v === w }))
  )), a.appendChild(m);
  const b = a.querySelector(".ti-click__type");
  return b == null || b.addEventListener("change", () => {
    const v = b.value;
    p(v, v === "tile-tint" ? qi : v === "tile-scale" ? Ha : Fi);
  }), o.addEventListener("click", (v) => {
    if (!v.target.closest(".idle-anim__slot-remove") && (a.classList.toggle("is-collapsed"), a.classList.contains("is-collapsed"))) {
      const S = km(a);
      S && (u.textContent = Fu(S));
    }
  }), d.addEventListener("click", (v) => {
    v.stopPropagation();
    const S = a.parentElement;
    a.remove(), S && ss(S, "ti-click-slot", "Animation");
  }), Sm(a, { dropGroup: "click" }), a;
}
c(Du, "buildClickSlot");
function km(n) {
  var u, d, m, f, g, p, y, w, b, v, S, I, A, O;
  const e = ((u = n.querySelector(".ti-click__type")) == null ? void 0 : u.value) ?? "tile-prop", t = ((d = n.querySelector(".ti-click__mode")) == null ? void 0 : d.value) ?? "bounce", i = Number.parseInt((m = n.querySelector(".ti-click__period")) == null ? void 0 : m.value, 10), r = ((f = n.querySelector(".ti-click__easing")) == null ? void 0 : f.value) ?? "easeOutCubic";
  if (!i || i <= 0) return null;
  const a = { mode: t, period: i, easing: r };
  if (e === "tile-tint") {
    const x = ((g = n.querySelector(".ti-click__from-color")) == null ? void 0 : g.value) ?? ((p = n.querySelector(".ti-click__from-color-text")) == null ? void 0 : p.value) ?? qi.fromColor, M = ((y = n.querySelector(".ti-click__to-color")) == null ? void 0 : y.value) ?? ((w = n.querySelector(".ti-click__to-color-text")) == null ? void 0 : w.value) ?? qi.toColor, D = ((b = n.querySelector(".ti-click__color-mode")) == null ? void 0 : b.value) ?? "oklch";
    return { type: "tile-tint", fromColor: x, toColor: M, mode: D, ...a };
  }
  if (e === "tile-scale") {
    const x = Number.parseFloat((v = n.querySelector(".ti-click__from-scale")) == null ? void 0 : v.value), M = Number.parseFloat((S = n.querySelector(".ti-click__to-scale")) == null ? void 0 : S.value);
    return Number.isNaN(x) || Number.isNaN(M) || x <= 0 || M <= 0 ? null : { type: "tile-scale", fromScale: x, toScale: M, ...a };
  }
  const o = ((I = n.querySelector(".ti-click__attribute")) == null ? void 0 : I.value) ?? Fi.attribute, s = Number.parseFloat((A = n.querySelector(".ti-click__from")) == null ? void 0 : A.value), l = Number.parseFloat((O = n.querySelector(".ti-click__to")) == null ? void 0 : O.value);
  return Number.isNaN(s) || Number.isNaN(l) ? null : { type: "tile-prop", attribute: o, from: s, to: l, ...a };
}
c(km, "readClickSlot");
function ss(n, e, t) {
  n.querySelectorAll(`.${e}`).forEach((r, a) => {
    r.dataset.index = String(a);
    const o = r.querySelector(".idle-anim__slot-title");
    o && (o.textContent = `${t} ${a + 1}`);
  });
}
c(ss, "renumberSlots");
function Ns(n, { heading: e, hint: t, configs: i, slotClass: r, titlePrefix: a, dropGroup: o, defaultEffect: s, addLabel: l }) {
  const u = document.createElement("h3");
  u.classList.add("ti-section-heading"), u.textContent = e, n.appendChild(u);
  const d = document.createElement("p");
  d.classList.add("idle-anim__hint"), d.textContent = t, n.appendChild(d);
  const m = document.createElement("div");
  m.classList.add("idle-anim__slots", `${r}s`);
  for (let p = 0; p < i.length; p++)
    m.appendChild($u(i[p], p, r, a));
  n.appendChild(m);
  const f = ["ti-always-slot", "ti-idle-slot", "ti-hover-slot"];
  Tm(m, {
    dropGroup: o,
    onDrop(p) {
      if (p.parentElement === m)
        for (const y of f)
          y !== r && p.classList.contains(y) && p.classList.replace(y, r);
      ss(m, r, a);
    }
  });
  const g = document.createElement("button");
  return g.type = "button", g.classList.add("idle-anim__add"), g.innerHTML = `<i class="fa-solid fa-plus"></i> ${l}`, g.addEventListener("click", () => {
    const p = m.querySelectorAll(`.${r}`).length, y = $u(s, p, r, a);
    y.classList.remove("is-collapsed"), m.appendChild(y);
  }), n.appendChild(g), m;
}
c(Ns, "buildEffectCategory");
function mv(n) {
  const e = Lc(n) ?? { always: [], idle: [], hover: [], click: [] }, t = document.createElement("section");
  t.classList.add("eidolon-tile-interactions"), Ns(t, {
    heading: "Always",
    hint: "Runs continuously, ignores pointer state.",
    configs: e.always ?? [],
    slotClass: "ti-always-slot",
    titlePrefix: "Effect",
    dropGroup: "effect",
    defaultEffect: { name: "embers" },
    addLabel: "Add Effect"
  }), Ns(t, {
    heading: "Idle",
    hint: "Plays by default. Stops when pointer enters the tile.",
    configs: e.idle ?? [],
    slotClass: "ti-idle-slot",
    titlePrefix: "Effect",
    dropGroup: "effect",
    defaultEffect: { name: "float" },
    addLabel: "Add Idle Effect"
  }), Ns(t, {
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
  i.classList.add("ti-section-heading"), i.textContent = "Click", t.appendChild(i);
  const r = document.createElement("p");
  r.classList.add("idle-anim__hint"), r.textContent = "One-shot animation on click.", t.appendChild(r);
  const a = e.click ?? [], o = document.createElement("div");
  o.classList.add("idle-anim__slots", "ti-click-slots");
  for (let d = 0; d < a.length; d++)
    o.appendChild(Du(a[d], d));
  t.appendChild(o), Tm(o, {
    dropGroup: "click",
    onDrop() {
      ss(o, "ti-click-slot", "Animation");
    }
  });
  const s = document.createElement("button");
  s.type = "button", s.classList.add("idle-anim__add"), s.innerHTML = '<i class="fa-solid fa-plus"></i> Add Animation', s.addEventListener("click", () => {
    const d = o.querySelectorAll(".ti-click-slot").length, m = Du(Ha, d);
    m.classList.remove("is-collapsed"), o.appendChild(m);
  }), t.appendChild(s);
  const l = document.createElement("div");
  l.classList.add("idle-anim__actions");
  const u = document.createElement("button");
  return u.type = "button", u.classList.add("idle-anim__preview"), u.innerHTML = '<i class="fa-solid fa-play"></i> Preview', l.append(u), t.appendChild(l), t;
}
c(mv, "buildSectionContent");
function xs(n, e) {
  const t = [];
  for (const i of n.querySelectorAll(`.${e}`)) {
    const r = Am(i);
    r && t.push(r);
  }
  return t;
}
c(xs, "readAllEffectSlots");
function hv(n) {
  const e = [];
  for (const t of n.querySelectorAll(".ti-click-slot")) {
    const i = km(t);
    i && e.push(i);
  }
  return e;
}
c(hv, "readAllClickConfigs");
function Pu(n) {
  return {
    always: xs(n, "ti-always-slot"),
    idle: xs(n, "ti-idle-slot"),
    hover: xs(n, "ti-hover-slot"),
    click: hv(n)
  };
}
c(Pu, "readFormConfig");
function gv(n, e) {
  var l;
  const t = Kt(e);
  if (!t) return;
  const i = dv(n);
  if (!i) return;
  const r = uf(n, t, lv, "Animations", cv);
  if (!r || r.querySelector(".eidolon-tile-interactions")) return;
  const a = r.closest("form");
  a && (a.noValidate = !0);
  const o = mv(i);
  r.appendChild(o), (l = n.setPosition) == null || l.call(n, { height: "auto" });
  const s = r.querySelector(".idle-anim__preview");
  s == null || s.addEventListener("click", () => {
    const u = i.object;
    if (!u) return;
    if (wn) {
      wn.detach(), wn = null, s.classList.remove("is-active"), s.innerHTML = '<i class="fa-solid fa-play"></i> Preview';
      return;
    }
    const d = Pu(o);
    (d.always.length > 0 || d.idle.length > 0 || d.hover.length > 0) && (wn = new Li(u, d), wn.start("idle"), s.classList.add("is-active"), s.innerHTML = '<i class="fa-solid fa-stop"></i> Stop');
  }), a && a.addEventListener("submit", () => {
    wn && (wn.detach(), wn = null);
    const u = Pu(o), d = u.always.length > 0 || u.idle.length > 0 || u.hover.length > 0 || u.click.length > 0, m = {
      [`flags.${ba}.-=${Nu}`]: null,
      [`flags.${ba}.-=${ov}`]: null,
      [`flags.${ba}.-=${sv}`]: null
    };
    i.update(m).then(() => {
      if (d)
        return i.update({ [`flags.${ba}.${Nu}`]: u });
    });
  });
}
c(gv, "renderAnimationSection");
const ho = /* @__PURE__ */ new Map();
function Mm(n) {
  const e = ho.get(n);
  e && (e.controller.abort(), ho.delete(n), e.restore());
}
c(Mm, "stopLoopByKey");
function _m(n) {
  const e = `${n}::`;
  for (const t of [...ho.keys()])
    t.startsWith(e) && Mm(t);
}
c(_m, "stopLoopsForTile");
function Nm() {
  for (const n of [...ho.keys()])
    Mm(n);
}
c(Nm, "stopAllLoops");
const pv = "eidolon-utilities", yv = ["tile-animations", "tile-interactions", "idle-animation"];
function bv() {
  Nm(), Em();
}
c(bv, "onCanvasTearDown");
function vv() {
  Nm(), Em();
}
c(vv, "onCanvasReady");
function wv(n, e) {
  var r;
  const t = (r = e == null ? void 0 : e.flags) == null ? void 0 : r[pv];
  !t || !yv.some((a) => a in t || `-=${a}` in t) || (_m(n.id), rv(n));
}
c(wv, "onUpdateTile");
function Ev(n) {
  _m(n.id), Cm(n);
}
c(Ev, "onDeleteTile");
function Cv(n, e) {
  gv(n, e);
}
c(Cv, "onRenderTileConfig");
function Sv() {
  Hooks.on("canvasTearDown", bv), Hooks.on("canvasReady", vv), Hooks.on("updateTile", wv), Hooks.on("deleteTile", Ev), Hooks.on("renderTileConfig", Cv);
}
c(Sv, "registerTileInteractionHooks");
Sv();
//# sourceMappingURL=eidolon-utilities.js.map
