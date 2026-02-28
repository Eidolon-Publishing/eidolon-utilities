var Dc = Object.defineProperty;
var Im = Object.getPrototypeOf;
var Om = Reflect.get;
var Pc = (n) => {
  throw TypeError(n);
};
var Am = (n, e, t) => e in n ? Dc(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var c = (n, e) => Dc(n, "name", { value: e, configurable: !0 });
var ye = (n, e, t) => Am(n, typeof e != "symbol" ? e + "" : e, t), cs = (n, e, t) => e.has(n) || Pc("Cannot " + t);
var h = (n, e, t) => (cs(n, e, "read from private field"), t ? t.call(n) : e.get(n)), k = (n, e, t) => e.has(n) ? Pc("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(n) : e.set(n, t), L = (n, e, t, i) => (cs(n, e, "write to private field"), i ? i.call(n, t) : e.set(n, t), t), S = (n, e, t) => (cs(n, e, "access private method"), t);
var us = (n, e, t, i) => ({
  set _(r) {
    L(n, e, r, t);
  },
  get _() {
    return h(n, e, i);
  }
}), Re = (n, e, t) => Om(Im(n), t, e);
const T = "eidolon-utilities", Ra = "timeTriggerActive", Fs = "timeTriggerHideWindow", Ds = "timeTriggerShowPlayerWindow", Ps = "timeTriggerAllowRealTime", Uu = "timeTriggers", ya = "timeTriggerHistory", Rs = "debug", Hs = "timeFormat", qs = "manageTime", js = "secondsPerRound";
const km = [-30, -15, -5, 5, 15, 30], qi = 1440 * 60, ba = "playSound", Jr = 6;
function E(n, e) {
  var t, i;
  return (i = (t = game.i18n) == null ? void 0 : t.has) != null && i.call(t, n) ? game.i18n.localize(n) : e;
}
c(E, "localize");
function xt(n) {
  return typeof n != "string" ? "" : n.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
c(xt, "escapeHtml");
function Yt(n) {
  var e;
  return n == null ? n : (e = foundry == null ? void 0 : foundry.utils) != null && e.duplicate ? foundry.utils.duplicate(n) : JSON.parse(JSON.stringify(n));
}
c(Yt, "duplicateData");
function Mm() {
  var n;
  return (n = foundry == null ? void 0 : foundry.utils) != null && n.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
c(Mm, "generateTriggerId");
function Vu(n) {
  if (typeof n != "string") return null;
  const e = n.trim();
  if (!e) return null;
  const t = e.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (!t) return null;
  const i = Number(t[1]), r = Number(t[2]), a = t[3] !== void 0 ? Number(t[3]) : 0;
  return !Number.isInteger(i) || !Number.isInteger(r) || !Number.isInteger(a) || i < 0 || i > 23 || r < 0 || r > 59 || a < 0 || a > 59 ? null : i * 3600 + r * 60 + a;
}
c(Vu, "parseTriggerTimeToSeconds");
function dr() {
  var n, e;
  return ((n = game.scenes) == null ? void 0 : n.current) ?? ((e = game.scenes) == null ? void 0 : e.active) ?? null;
}
c(dr, "getActiveScene");
function Jt(n) {
  return (n == null ? void 0 : n.object) ?? (n == null ? void 0 : n.document) ?? null;
}
c(Jt, "getSceneFromApplication");
function Ke(n) {
  return n && typeof n.getFlag == "function" && typeof n.setFlag == "function";
}
c(Ke, "hasSceneDocument");
const Bs = /* @__PURE__ */ new Set(), Us = /* @__PURE__ */ new Set(), Vs = /* @__PURE__ */ new Set(), zs = /* @__PURE__ */ new Set();
let wi = !1, Ir = !1, Ha = Jr, qa = "12h", Rc = !1;
function ds(n) {
  wi = !!n;
  for (const e of Bs)
    try {
      e(wi);
    } catch (t) {
      console.error(`${T} | Debug change handler failed`, t);
    }
}
c(ds, "notifyDebugChange");
function fs(n) {
  Ir = !!n;
  for (const e of Us)
    try {
      e(Ir);
    } catch (t) {
      console.error(`${T} | Manage time change handler failed`, t);
    }
}
c(fs, "notifyManageTimeChange");
function zu(n) {
  return n === "24h" ? "24h" : "12h";
}
c(zu, "normalizeTimeFormatValue");
function rc(n) {
  const e = Number(n);
  return !Number.isFinite(e) || e <= 0 ? Jr : e;
}
c(rc, "normalizeSecondsPerRoundValue");
function ms(n) {
  const e = rc(n);
  Ha = e;
  for (const t of Vs)
    try {
      t(e);
    } catch (i) {
      console.error(`${T} | Seconds-per-round change handler failed`, i);
    }
}
c(ms, "notifySecondsPerRoundChange");
function hs(n) {
  const e = zu(n);
  qa = e;
  for (const t of zs)
    try {
      t(e);
    } catch (i) {
      console.error(`${T} | Time format change handler failed`, i);
    }
}
c(hs, "notifyTimeFormatChange");
function _m() {
  var e;
  if (Rc) return;
  if (Rc = !0, !((e = game == null ? void 0 : game.settings) != null && e.register)) {
    console.warn(
      `${T} | game.settings.register is unavailable. Module settings could not be registered.`
    );
    return;
  }
  const n = typeof game.settings.registerChange == "function";
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
    onChange: n ? void 0 : ds
  }), n && game.settings.registerChange(T, Rs, ds), wi = ac(), ds(wi), game.settings.register(T, qs, {
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
  }), n && game.settings.registerChange(T, qs, fs), Ir = xm(), fs(Ir), game.settings.register(T, js, {
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
    default: Jr,
    range: { min: 1, max: 3600, step: 1 },
    onChange: n ? void 0 : ms
  }), n && game.settings.registerChange(
    T,
    js,
    ms
  ), Ha = rc($m()), ms(Ha), game.settings.register(T, Hs, {
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
  }), n && game.settings.registerChange(T, Hs, hs), qa = zu(Gu()), hs(qa);
}
c(_m, "registerTimeTriggerSettings");
function ac() {
  var n;
  try {
    if ((n = game == null ? void 0 : game.settings) != null && n.get)
      return !!game.settings.get(T, Rs);
  } catch (e) {
    console.error(`${T} | Failed to read debug setting`, e);
  }
  return !1;
}
c(ac, "getDebugSetting");
function Nm() {
  return wi = ac(), wi;
}
c(Nm, "refreshDebugSettingCache");
function xm() {
  var n;
  try {
    if ((n = game == null ? void 0 : game.settings) != null && n.get)
      return !!game.settings.get(T, qs);
  } catch (e) {
    console.error(`${T} | Failed to read manage time setting`, e);
  }
  return !1;
}
c(xm, "getManageTimeSetting");
function Gu() {
  var n;
  try {
    if ((n = game == null ? void 0 : game.settings) != null && n.get)
      return game.settings.get(T, Hs) === "24h" ? "24h" : "12h";
  } catch (e) {
    console.error(`${T} | Failed to read time format setting`, e);
  }
  return "12h";
}
c(Gu, "getTimeFormatSetting");
function $m() {
  var n;
  try {
    if ((n = game == null ? void 0 : game.settings) != null && n.get) {
      const e = game.settings.get(T, js);
      return rc(e);
    }
  } catch (e) {
    console.error(`${T} | Failed to read seconds-per-round setting`, e);
  }
  return Jr;
}
c($m, "getSecondsPerRoundSetting");
function Fm(n) {
  if (typeof n != "function")
    return () => {
    };
  Bs.add(n);
  try {
    n(wi);
  } catch (e) {
    console.error(`${T} | Debug change handler failed`, e);
  }
  return () => {
    Bs.delete(n);
  };
}
c(Fm, "onDebugSettingChange");
function Wu(n) {
  if (typeof n != "function")
    return () => {
    };
  Us.add(n);
  try {
    n(Ir);
  } catch (e) {
    console.error(`${T} | Manage time change handler failed`, e);
  }
  return () => {
    Us.delete(n);
  };
}
c(Wu, "onManageTimeSettingChange");
function oc(n) {
  if (typeof n != "function")
    return () => {
    };
  zs.add(n);
  try {
    n(qa);
  } catch (e) {
    console.error(`${T} | Time format change handler failed`, e);
  }
  return () => {
    zs.delete(n);
  };
}
c(oc, "onTimeFormatSettingChange");
function Dm(n) {
  if (typeof n != "function")
    return () => {
    };
  Vs.add(n);
  try {
    n(Ha);
  } catch (e) {
    console.error(`${T} | Seconds-per-round change handler failed`, e);
  }
  return () => {
    Vs.delete(n);
  };
}
c(Dm, "onSecondsPerRoundSettingChange");
let Vo = !1, Gs = !1;
function Ws(n) {
  Vo = !!n;
}
c(Ws, "updateDebugState");
function Yu() {
  Gs || (Gs = !0, Ws(ac()), Fm((n) => {
    Ws(n), console.info(`${T} | Debug ${Vo ? "enabled" : "disabled"}`);
  }));
}
c(Yu, "ensureInitialized");
function sc() {
  return Gs || Yu(), Vo;
}
c(sc, "shouldLog");
function Ku(n) {
  if (!n.length)
    return [`${T} |`];
  const [e, ...t] = n;
  return typeof e == "string" ? [`${T} | ${e}`, ...t] : [`${T} |`, e, ...t];
}
c(Ku, "formatArgs");
function Pm() {
  Yu();
}
c(Pm, "initializeDebug");
function Rm() {
  return Ws(Nm()), Vo;
}
c(Rm, "syncDebugState");
function _(...n) {
  sc() && console.debug(...Ku(n));
}
c(_, "debugLog");
function Ji(...n) {
  sc() && console.group(...Ku(n));
}
c(Ji, "debugGroup");
function Fn() {
  sc() && console.groupEnd();
}
c(Fn, "debugGroupEnd");
function ji(n) {
  var r;
  const e = (r = n == null ? void 0 : n.getFlag) == null ? void 0 : r.call(n, T, Uu);
  if (!e) return [];
  const t = Yt(e), i = Array.isArray(t) ? t : [];
  return _("Loaded time triggers", {
    sceneId: (n == null ? void 0 : n.id) ?? null,
    count: i.length
  }), i;
}
c(ji, "getTimeTriggers");
async function Ju(n, e) {
  n != null && n.setFlag && (_("Persisting time triggers", {
    sceneId: n.id,
    count: Array.isArray(e) ? e.length : 0
  }), await n.setFlag(T, Uu, e));
}
c(Ju, "setTimeTriggers");
function Hm(n) {
  var r;
  const e = (r = n == null ? void 0 : n.getFlag) == null ? void 0 : r.call(n, T, ya);
  if (!e) return {};
  const t = Yt(e);
  if (!t || typeof t != "object") return {};
  const i = {};
  for (const [a, o] of Object.entries(t))
    typeof o == "number" && Number.isFinite(o) && (i[a] = o);
  return _("Loaded time trigger history", {
    sceneId: (n == null ? void 0 : n.id) ?? null,
    keys: Object.keys(i)
  }), i;
}
c(Hm, "getTimeTriggerHistory");
async function gs(n, e) {
  var l, u, d, m;
  if (!n) return;
  const t = {};
  if (e && typeof e == "object")
    for (const [f, g] of Object.entries(e))
      typeof g == "number" && Number.isFinite(g) && (t[f] = g);
  const i = ((l = n.getFlag) == null ? void 0 : l.call(n, T, ya)) ?? {}, r = {};
  if (i && typeof i == "object")
    for (const [f, g] of Object.entries(i))
      typeof g == "number" && Number.isFinite(g) && (r[f] = g);
  const a = Object.keys(t), o = Object.keys(r);
  if (typeof ((u = foundry == null ? void 0 : foundry.utils) == null ? void 0 : u.deepEqual) == "function" ? foundry.utils.deepEqual(r, t) : JSON.stringify(r) === JSON.stringify(t)) {
    _("Skip history update because state is unchanged", {
      sceneId: (n == null ? void 0 : n.id) ?? null
    });
    return;
  }
  _("Updating time trigger history", {
    sceneId: (n == null ? void 0 : n.id) ?? null,
    keys: a,
    removedKeys: o.filter((f) => !a.includes(f))
  });
  try {
    o.length && typeof n.unsetFlag == "function" && await n.unsetFlag(T, ya), a.length && await n.setFlag(T, ya, t);
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
const ja = /* @__PURE__ */ new Map(), Hc = /* @__PURE__ */ new Set();
function qm(n) {
  if (!(n != null && n.id))
    throw new Error(`${T} | Action definitions require an id.`);
  if (ja.has(n.id))
    throw new Error(`${T} | Duplicate time trigger action id: ${n.id}`);
  ja.set(n.id, {
    ...n
  }), _("Registered time trigger action", { actionId: n.id });
}
c(qm, "registerAction");
function Xr(n) {
  return ja.get(n) ?? null;
}
c(Xr, "getAction");
function jm(n) {
  const e = Xr(n);
  return e ? typeof e.label == "function" ? e.label() : e.label : n;
}
c(jm, "getActionLabel");
function qc() {
  return Array.from(ja.values());
}
c(qc, "listActions");
async function Xu(n, e) {
  var i, r;
  const t = Xr(e == null ? void 0 : e.action);
  if (!t || typeof t.execute != "function") {
    const a = E(
      "EIDOLON.TimeTrigger.UnknownAction",
      "Encountered an unknown time trigger action and skipped it."
    );
    (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, a), console.warn(`${T} | Unknown time trigger action`, e), _("Encountered unknown time trigger action", {
      triggerId: (e == null ? void 0 : e.id) ?? null,
      actionId: (e == null ? void 0 : e.action) ?? null
    });
    return;
  }
  _("Executing action handler", {
    actionId: t.id,
    triggerId: (e == null ? void 0 : e.id) ?? null,
    sceneId: (n == null ? void 0 : n.id) ?? null
  }), await t.execute({ scene: n, trigger: e });
}
c(Xu, "executeTriggerAction");
function Bm(n) {
  const e = Xr(n == null ? void 0 : n.action);
  return !e || typeof e.buildSummaryParts != "function" ? [] : e.buildSummaryParts({ trigger: n, escapeHtml: xt, localize: E }) ?? [];
}
c(Bm, "buildActionSummaryParts");
function Um(n) {
  const e = Xr(n == null ? void 0 : n.action);
  return !e || typeof e.buildFormContent != "function" ? "" : e.buildFormContent({ trigger: n, escapeHtml: xt, localize: E }) ?? "";
}
c(Um, "buildActionFormSection");
function Vm(n, e) {
  const t = Xr(n == null ? void 0 : n.action);
  !t || typeof t.prepareFormData != "function" || t.prepareFormData({ trigger: n, formData: e });
}
c(Vm, "applyActionFormData");
function zm(n, e, t) {
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
c(zm, "warnMissingTriggerData");
async function Gm({ scene: n, trigger: e }) {
  var a, o, s, l, u;
  const t = (s = (o = (a = e == null ? void 0 : e.data) == null ? void 0 : a.path) == null ? void 0 : o.trim) == null ? void 0 : s.call(o);
  if (!t) {
    zm(n, e, "missing-audio-path");
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
c(Gm, "executePlaySoundAction");
qm({
  id: ba,
  label: /* @__PURE__ */ c(() => E("EIDOLON.TimeTrigger.ActionPlaySound", "Play Sound"), "label"),
  execute: Gm,
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
var Du;
const { ApplicationV2: zn, HandlebarsApplicationMixin: Gn } = ((Du = foundry.applications) == null ? void 0 : Du.api) ?? {};
if (!zn || !Gn)
  throw new Error(
    `${T} | ApplicationV2 API unavailable. Update Foundry VTT to v13 or newer.`
  );
const Rn = "AM", Ei = "PM";
function Dn() {
  return Gu();
}
c(Dn, "getConfiguredTimeFormat");
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
function Vt({ hours: n, minutes: e, seconds: t }) {
  if (!Number.isInteger(n) || !Number.isInteger(e) || n < 0 || n > 23 || e < 0 || e > 59) return null;
  const i = String(n).padStart(2, "0"), r = String(e).padStart(2, "0");
  if (Number.isInteger(t)) {
    if (t < 0 || t > 59) return null;
    const a = String(t).padStart(2, "0");
    return `${i}:${r}:${a}`;
  }
  return `${i}:${r}`;
}
c(Vt, "formatCanonicalTime");
function Wm(n, { format: e } = {}) {
  if (!n || typeof n != "object") return null;
  const t = Number(n.hour), i = Number(n.minute), r = n.second !== void 0 && n.second !== null, a = r ? Number(n.second) : null, o = r && Number.isFinite(a) ? Math.floor(Math.max(0, Math.min(59, a))) : null;
  if (!Number.isFinite(t) || !Number.isFinite(i)) return null;
  const s = e ?? Dn();
  return Ba(
    {
      hours: t,
      minutes: i,
      seconds: o
    },
    s
  );
}
c(Wm, "formatTimeComponentsForDisplay");
function Ym(n, { format: e } = {}) {
  const t = zo(n);
  if (!t) return "";
  const i = e ?? Dn();
  return Ba(t, i);
}
c(Ym, "formatTriggerTimeForDisplay");
function Ba(n, e = "12h") {
  if (!n) return "";
  const { hours: t, minutes: i, seconds: r = null } = n;
  if (!Number.isInteger(t) || !Number.isInteger(i)) return "";
  const a = Number.isInteger(r);
  if (e === "24h") {
    const f = `${String(t).padStart(2, "0")}:${String(i).padStart(2, "0")}`;
    return a ? `${f}:${String(r).padStart(2, "0")}` : f;
  }
  const o = t >= 12 ? Ei : Rn, s = t % 12 === 0 ? 12 : t % 12, l = String(s), u = String(i).padStart(2, "0"), d = `${l}:${u}`, m = o === Rn ? E("EIDOLON.TimeTrigger.TimePeriodAM", Rn) : E("EIDOLON.TimeTrigger.TimePeriodPM", Ei);
  if (a) {
    const f = String(r).padStart(2, "0");
    return `${d}:${f} ${m}`;
  }
  return `${d} ${m}`;
}
c(Ba, "formatTimeParts");
function jc(n, e = Dn()) {
  const t = zo(n);
  if (e === "24h")
    return {
      format: e,
      canonical: t ? Vt(t) ?? "" : "",
      hour: t ? String(t.hours).padStart(2, "0") : "",
      minute: t ? String(t.minutes).padStart(2, "0") : ""
    };
  if (!t)
    return {
      format: e,
      canonical: "",
      hour: "",
      minute: "",
      period: Rn
    };
  const i = t.hours >= 12 ? Ei : Rn, r = t.hours % 12 === 0 ? 12 : t.hours % 12;
  return {
    format: e,
    canonical: Vt(t) ?? "",
    hour: String(r),
    minute: String(t.minutes).padStart(2, "0"),
    period: i
  };
}
c(jc, "getTimeFormValues");
function Km({ hour: n, minute: e, period: t, time: i }, r = Dn()) {
  if (r === "24h") {
    const g = typeof n == "string" ? n.trim() : "", p = typeof e == "string" ? e.trim() : "", y = typeof i == "string" ? i.trim() : "";
    if (!g && !p && y) {
      const C = zo(y);
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
  const a = typeof n == "string" ? n.trim() : "", o = typeof e == "string" ? e.trim() : "", s = typeof t == "string" ? t.trim().toUpperCase() : "";
  if (!a || !o || !s)
    return { canonical: "", error: E("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.") };
  if (s !== Rn && s !== Ei)
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
    hours: s === Ei ? d + 12 : d,
    minutes: u
  };
  return {
    canonical: Vt(f) ?? "",
    error: null
  };
}
c(Km, "normalizeFormTimeInput");
function Jm() {
  return [
    {
      value: Rn,
      label: E("EIDOLON.TimeTrigger.TimePeriodAM", Rn)
    },
    {
      value: Ei,
      label: E("EIDOLON.TimeTrigger.TimePeriodPM", Ei)
    }
  ];
}
c(Jm, "getPeriodOptions");
var ri, ai, re, Qu, go, po, Zu, Ks, Js, yo, bo, ed, td, nd, Xs, Qs, Zs, vo, wo, el, Eo, id, rd;
const ni = class ni extends Gn(zn) {
  constructor(t = {}) {
    var o;
    const { scene: i, showControls: r, ...a } = t ?? {};
    super(a);
    k(this, re);
    k(this, ri, null);
    k(this, ai, null);
    k(this, go, /* @__PURE__ */ c((t) => {
      var r, a;
      t.preventDefault();
      const i = Number((a = (r = t.currentTarget) == null ? void 0 : r.dataset) == null ? void 0 : a.delta);
      Number.isFinite(i) && (_("Time delta button clicked", { delta: i }), this._advanceTime(i));
    }, "#onDeltaClick"));
    k(this, po, /* @__PURE__ */ c((t) => {
      var i, r;
      t.preventDefault(), !(!this.showControls || !((i = game.user) != null && i.isGM)) && (_("Time value double clicked", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null }), S(this, re, Zu).call(this));
    }, "#onTimeDoubleClick"));
    k(this, yo, /* @__PURE__ */ c((t) => {
      if (this.isEditingTime && !this._commitTimeInProgress)
        if (t.key === "Enter") {
          t.preventDefault();
          const i = t.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
          S(this, re, Js).call(this, r);
        } else t.key === "Escape" && (t.preventDefault(), S(this, re, Ks).call(this));
    }, "#onTimeInputKeydown"));
    k(this, bo, /* @__PURE__ */ c((t) => {
      if (!this.isEditingTime || this._commitTimeInProgress || this._suppressBlurCommit) return;
      const i = t.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
      S(this, re, Js).call(this, r);
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
    k(this, Eo, /* @__PURE__ */ c(() => {
      (this.rendered ?? this.isRendered ?? !1) && (this.isEditingTime && (this.editValue = S(this, re, Xs).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    this.scene = i ?? null, this.showControls = typeof r == "boolean" ? r : !!((o = game.user) != null && o.isGM), this.isEditingTime = !1, this.editValue = "", this._commitTimeInProgress = !1, this._suppressBlurCommit = !1, this.manageTimeEnabled = !1, this.sceneAllowsRealTime = S(this, re, el).call(this), L(this, ri, oc(h(this, Eo))), L(this, ai, Wu(h(this, vo)));
  }
  async _prepareContext() {
    var b, w;
    const t = ((b = game.time) == null ? void 0 : b.components) ?? {}, r = ((t == null ? void 0 : t.second) !== void 0 && (t == null ? void 0 : t.second) !== null ? Wm(t) : null) ?? S(this, re, Qu).call(this), a = Dn(), o = a === "24h", s = o ? E("EIDOLON.TimeTrigger.EditTimePlaceholder24", "HH:MM") : E("EIDOLON.TimeTrigger.EditTimePlaceholder12", "HH:MM AM/PM"), l = this.showControls ? E(
      "EIDOLON.TimeTrigger.EditTimeHint",
      "Double-click to set a specific time."
    ) : "", u = this.showControls ? E(
      "EIDOLON.TimeTrigger.EditTimeLabel",
      "New time (HH:MM or HH:MM AM/PM)"
    ) : "", d = km.map((C) => ({
      minutes: C,
      label: C > 0 ? `+${C}` : `${C}`
    })), m = !!this.manageTimeEnabled, f = S(this, re, el).call(this);
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
  async close(t = {}) {
    var r, a;
    if (!t.force)
      return (this.rendered ?? this.isRendered ?? !1) || (_("TimeTriggerWindow close request rerendering", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null
      }), this.render({ force: !0 })), this;
    _("Closing time trigger window", { sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null, force: !0 });
    const i = await super.close(t);
    return S(this, re, id).call(this), S(this, re, rd).call(this), i;
  }
  async _advanceTime(t) {
    var r, a, o, s, l, u, d;
    const i = t * 60;
    if (_("Advancing world time", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null, minutes: t, seconds: i }), !((a = game.user) != null && a.isGM)) {
      (s = (o = ui.notifications) == null ? void 0 : o.warn) == null || s.call(o, E("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time."));
      return;
    }
    try {
      await game.time.advance(i);
    } catch (m) {
      console.error(`${T} | Failed to advance time`, m), (u = (l = ui.notifications) == null ? void 0 : l.error) == null || u.call(
        l,
        E("EIDOLON.TimeTrigger.Error", "Failed to update the world time.")
      ), _("Failed to advance time from window", {
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
        _("Binding time trigger interactions", {
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
ri = new WeakMap(), ai = new WeakMap(), re = new WeakSet(), Qu = /* @__PURE__ */ c(function() {
  var l;
  const t = (l = game.time) == null ? void 0 : l.worldTime;
  if (typeof t != "number" || !Number.isFinite(t)) return "";
  const i = 1440 * 60, r = (Math.floor(t) % i + i) % i, a = Math.floor(r / 3600), o = Math.floor(r % 3600 / 60), s = r % 60;
  return Ba({ hours: a, minutes: o, seconds: s }, Dn());
}, "#formatFallbackTime"), go = new WeakMap(), po = new WeakMap(), Zu = /* @__PURE__ */ c(function() {
  var t;
  (t = game.user) != null && t.isGM && (this.isEditingTime = !0, this._suppressBlurCommit = !1, this.editValue = S(this, re, Xs).call(this), this.render({ force: !0 }));
}, "#enterTimeEditMode"), Ks = /* @__PURE__ */ c(function() {
  this.isEditingTime = !1, this.editValue = "", this._suppressBlurCommit = !1, this.render({ force: !0 });
}, "#cancelTimeEdit"), Js = /* @__PURE__ */ c(async function(t) {
  var a, o, s;
  if (!((a = game.user) != null && a.isGM) || !this.isEditingTime || this._commitTimeInProgress) return;
  this._commitTimeInProgress = !0;
  const i = typeof t == "string" ? t.trim() : "";
  if (!i) {
    S(this, re, Ks).call(this), this._commitTimeInProgress = !1;
    return;
  }
  const r = S(this, re, nd).call(this, i);
  if (r.error) {
    (s = (o = ui.notifications) == null ? void 0 : o.error) == null || s.call(o, r.error), this._suppressBlurCommit = !0, this.editValue = i, this.render({ force: !0 }), this._commitTimeInProgress = !1;
    return;
  }
  try {
    await S(this, re, td).call(this, r.seconds, r.includeSeconds) ? (this.isEditingTime = !1, this.editValue = "", this.render({ force: !0 })) : (this.editValue = i, this.render({ force: !0 }));
  } finally {
    this._commitTimeInProgress = !1;
  }
}, "#commitTimeInput"), yo = new WeakMap(), bo = new WeakMap(), ed = /* @__PURE__ */ c(function() {
  var u, d;
  const t = (u = game.time) == null ? void 0 : u.worldTime;
  if (typeof t != "number" || !Number.isFinite(t))
    return "";
  const i = ((d = game.time) == null ? void 0 : d.components) ?? {}, r = Number(i.hour), a = Number(i.minute), o = i.second !== void 0 ? Number(i.second) : null, s = Number.isInteger(o);
  return (Number.isFinite(r) && Number.isFinite(a) ? Vt({
    hours: Math.max(0, Math.min(23, Number(r))),
    minutes: Math.max(0, Math.min(59, Number(a))),
    seconds: s && Number.isFinite(o) ? Math.max(0, Math.min(59, Number(o))) : void 0
  }) ?? "" : "") ?? "";
}, "#getCurrentCanonicalTime"), td = /* @__PURE__ */ c(async function(t, i) {
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
  if (!Number.isInteger(t) || t < 0 || t >= qi)
    return (v = (y = ui.notifications) == null ? void 0 : y.error) == null || v.call(
      y,
      E(
        "EIDOLON.TimeTrigger.EditTimeInvalidRange",
        "Enter a time within the current day."
      )
    ), !1;
  const s = Math.floor(r / qi) * qi + t - r;
  if (!Number.isFinite(s) || s === 0)
    return !0;
  const l = Math.floor(t / 3600), u = Math.floor(t % 3600 / 60), d = t % 60, m = Vt({
    hours: l,
    minutes: u,
    seconds: i ? d : void 0
  });
  try {
    _("Updating world time directly", {
      sceneId: ((b = this.scene) == null ? void 0 : b.id) ?? null,
      targetCanonical: m ?? null,
      diff: s
    }), await game.time.advance(s);
    const O = Ba(
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
}, "#applyTargetSeconds"), nd = /* @__PURE__ */ c(function(t) {
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
        canonical: Vt({ hours: f, minutes: g, seconds: p }),
        seconds: y,
        includeSeconds: p !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const { amLower: o, pmLower: s, periodPattern: l } = S(this, re, Qs).call(this), u = r.match(
    new RegExp(
      `^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?\\s*(${l})$`,
      "i"
    )
  );
  if (u) {
    let f = Number(u[1]);
    const g = Number(u[2]), p = u[3] !== void 0 ? Number(u[3]) : void 0, y = u[4] ?? "", v = typeof y == "string" ? ((m = y.toLocaleLowerCase) == null ? void 0 : m.call(y)) ?? y.toLowerCase() : "";
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
  const d = Vu(r);
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
}, "#parseInputTime"), Xs = /* @__PURE__ */ c(function() {
  const t = S(this, re, ed).call(this);
  if (!t) return "";
  if (Dn() === "24h")
    return t;
  const r = zo(t);
  if (!r) return t;
  const a = Number(r.hours), o = Number(r.minutes), s = r.seconds !== null && r.seconds !== void 0 ? Number(r.seconds) : void 0;
  if (!Number.isFinite(a) || !Number.isFinite(o)) return t;
  const l = Number.isFinite(s), u = a % 12 === 0 ? 12 : a % 12, d = String(o).padStart(2, "0"), m = l ? `:${String(s).padStart(2, "0")}` : "", { amLabel: f, pmLabel: g } = S(this, re, Qs).call(this), p = a >= 12 ? g : f;
  return `${u}:${d}${m} ${p}`.trim();
}, "#getInitialEditValue"), Qs = /* @__PURE__ */ c(function() {
  var u, d;
  const t = E("EIDOLON.TimeTrigger.TimePeriodAM", "AM"), i = E("EIDOLON.TimeTrigger.TimePeriodPM", "PM"), r = ((u = t.toLocaleLowerCase) == null ? void 0 : u.call(t)) ?? t.toLowerCase(), a = ((d = i.toLocaleLowerCase) == null ? void 0 : d.call(i)) ?? i.toLowerCase(), o = S(this, re, Zs).call(this, t), s = S(this, re, Zs).call(this, i), l = `${o}|${s}|AM|PM`;
  return {
    amLabel: t,
    pmLabel: i,
    amLower: r,
    pmLower: a,
    periodPattern: l
  };
}, "#getPeriodMatchData"), Zs = /* @__PURE__ */ c(function(t) {
  return typeof t != "string" ? "" : t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}, "#escapeForRegex"), vo = new WeakMap(), wo = new WeakMap(), el = /* @__PURE__ */ c(function() {
  const t = this.scene;
  if (!t || typeof t.getFlag != "function") return !1;
  try {
    return !!t.getFlag(T, Ps);
  } catch (i) {
    _("TimeTriggerWindow | Failed to read scene real-time flag", {
      sceneId: (t == null ? void 0 : t.id) ?? null,
      message: (i == null ? void 0 : i.message) ?? String(i)
    });
  }
  return !1;
}, "#readSceneRealTimeFlag"), Eo = new WeakMap(), id = /* @__PURE__ */ c(function() {
  if (typeof h(this, ri) == "function")
    try {
      h(this, ri).call(this);
    } catch (t) {
      console.error(`${T} | Failed to dispose time format subscription`, t);
    }
  L(this, ri, null);
}, "#disposeTimeFormatSubscription"), rd = /* @__PURE__ */ c(function() {
  if (typeof h(this, ai) == "function")
    try {
      h(this, ai).call(this);
    } catch (t) {
      console.error(`${T} | Failed to dispose manage time subscription`, t);
    }
  L(this, ai, null);
}, "#disposeManageTimeSubscription"), c(ni, "TimeTriggerWindow"), ye(ni, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Re(ni, ni, "DEFAULT_OPTIONS"),
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
)), ye(ni, "PARTS", {
  content: {
    template: `modules/${T}/templates/time-trigger.html`
  }
});
let Ys = ni;
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
var Se, Qe, oi, er, ad, od;
const Oc = class Oc {
  constructor({ windowFactory: e } = {}) {
    k(this, er);
    k(this, Se, null);
    k(this, Qe, null);
    k(this, oi);
    const t = Go(Ys);
    typeof e == "function" ? e.__eidolonFactorySignature === "options" ? L(this, oi, (r, a = {}) => e({ scene: r, ...a ?? {} })) : L(this, oi, e) : L(this, oi, /* @__PURE__ */ c((r, a = {}) => t({ scene: r, ...a ?? {} }), "fallbackFactory"));
  }
  onReady() {
    var t;
    const e = typeof ((t = game.time) == null ? void 0 : t.worldTime) == "number" && Number.isFinite(game.time.worldTime) ? game.time.worldTime : null;
    _("TimeTriggerManager#onReady", { worldTime: e }), e !== null && L(this, Qe, e);
  }
  onCanvasReady(e) {
    const t = (e == null ? void 0 : e.scene) ?? dr();
    _("TimeTriggerManager#onCanvasReady", { sceneId: (t == null ? void 0 : t.id) ?? null }), this.refreshTimeTriggerWindow(t), this.handleTimeTriggerEvaluation(t);
  }
  onUpdateScene(e) {
    const t = dr();
    _("TimeTriggerManager#onUpdateScene", {
      sceneId: (e == null ? void 0 : e.id) ?? null,
      activeSceneId: (t == null ? void 0 : t.id) ?? null
    }), !(!t || e.id !== t.id) && (this.refreshTimeTriggerWindow(e), this.handleTimeTriggerEvaluation(e));
  }
  onUpdateWorldTime(e, t) {
    _("TimeTriggerManager#onUpdateWorldTime", {
      worldTime: e,
      diff: t,
      hasWindow: !!h(this, Se)
    }), h(this, Se) && h(this, Se).render();
    const i = dr(), r = S(this, er, ad).call(this, e, t);
    this.handleTimeTriggerEvaluation(i, e, r);
  }
  refreshTimeTriggerWindow(e) {
    var l, u, d;
    if (!e) return;
    const t = !!((l = game.user) != null && l.isGM), i = !!e.getFlag(T, Ra), r = !!e.getFlag(T, Fs), a = !!e.getFlag(T, Ds);
    if (_("TimeTriggerManager#refreshTimeTriggerWindow", {
      sceneId: e.id,
      isGM: t,
      isActive: i,
      hideWindow: r,
      showPlayerWindow: a
    }), !(i && !r && (t || a))) {
      h(this, Se) && (_("Closing time trigger window", { reason: "not-visible" }), h(this, Se).close({ force: !0 }), L(this, Se, null));
      return;
    }
    const s = !!t;
    if (h(this, Se) && ((u = h(this, Se).scene) == null ? void 0 : u.id) === e.id) {
      _("Refreshing existing time trigger window", { sceneId: e.id }), h(this, Se).showControls = s, h(this, Se).render();
      return;
    }
    h(this, Se) && (_("Closing existing window before creating new instance", {
      previousSceneId: ((d = h(this, Se).scene) == null ? void 0 : d.id) ?? null
    }), h(this, Se).close({ force: !0 })), L(this, Se, h(this, oi).call(this, e, { showControls: s })), _("Rendering new time trigger window", { sceneId: e.id }), h(this, Se).render({ force: !0 });
  }
  async handleTimeTriggerEvaluation(e, t, i) {
    var l;
    const r = e ?? dr();
    if (!r) {
      _("handleTimeTriggerEvaluation skipped", {
        reason: "no-active-scene",
        providedSceneId: (e == null ? void 0 : e.id) ?? null,
        currentWorldTime: t
      }), typeof t == "number" && Number.isFinite(t) && L(this, Qe, t);
      return;
    }
    const a = typeof t == "number" && Number.isFinite(t) ? t : typeof ((l = game.time) == null ? void 0 : l.worldTime) == "number" ? game.time.worldTime : null;
    if (a === null) return;
    const o = typeof i == "number" && Number.isFinite(i) ? i : null, s = o !== null ? o : typeof h(this, Qe) == "number" && Number.isFinite(h(this, Qe)) ? h(this, Qe) : a;
    Ji("handleTimeTriggerEvaluation", {
      sceneId: r.id,
      previousWorldTime: s,
      currentWorldTime: a,
      overrideProvided: o !== null
    });
    try {
      await S(this, er, od).call(this, r, s, a);
    } catch (u) {
      console.error(`${T} | Unexpected error while evaluating time triggers`, u), _("handleTimeTriggerEvaluation error", { message: (u == null ? void 0 : u.message) ?? String(u) });
    } finally {
      L(this, Qe, a), Fn();
    }
  }
};
Se = new WeakMap(), Qe = new WeakMap(), oi = new WeakMap(), er = new WeakSet(), ad = /* @__PURE__ */ c(function(e, t) {
  return typeof h(this, Qe) == "number" && Number.isFinite(h(this, Qe)) ? (_("Resolved previous world time from cache", {
    previousWorldTime: h(this, Qe)
  }), h(this, Qe)) : typeof e == "number" && Number.isFinite(e) && typeof t == "number" && Number.isFinite(t) ? (_("Resolved previous world time using diff", {
    worldTime: e,
    diff: t,
    resolved: e - t
  }), e - t) : typeof e == "number" && Number.isFinite(e) ? e : null;
}, "#resolvePreviousWorldTime"), od = /* @__PURE__ */ c(async function(e, t, i) {
  var p, y, v;
  if (!((p = game.user) != null && p.isGM)) {
    _("Skipping trigger evaluation because user is not a GM");
    return;
  }
  if (!(e != null && e.id)) {
    _("Skipping trigger evaluation because the scene is missing an id");
    return;
  }
  if (!!!e.getFlag(T, Ra)) {
    _("Skipping trigger evaluation because scene is inactive", { sceneId: e.id });
    return;
  }
  if (typeof i != "number" || !Number.isFinite(i)) return;
  (typeof t != "number" || !Number.isFinite(t)) && (t = i);
  const a = ji(e);
  if (!a.length) {
    _("No time triggers configured for scene", { sceneId: e.id });
    return;
  }
  const o = Hm(e), s = /* @__PURE__ */ new Set();
  for (const b of a)
    b != null && b.id && s.add(b.id);
  let l = !1;
  for (const b of Object.keys(o))
    s.has(b) || (delete o[b], l = !0);
  if (Ji("Evaluating scene time triggers", {
    sceneId: e.id,
    previousWorldTime: t,
    currentWorldTime: i,
    triggerCount: a.length
  }), i <= t) {
    _("Detected world time rewind", {
      previousWorldTime: t,
      currentWorldTime: i
    });
    for (const b of a) {
      if (!(b != null && b.id) || !b.allowReplayOnRewind) continue;
      const w = o[b.id];
      typeof w == "number" ? i < w ? (_("Clearing trigger history due to rewind", {
        triggerId: b.id,
        lastFired: w,
        currentWorldTime: i
      }), delete o[b.id], l = !0) : _("Preserving trigger history after rewind", {
        triggerId: b.id,
        lastFired: w,
        currentWorldTime: i
      }) : _("No history stored for rewind-enabled trigger", {
        triggerId: b.id
      });
    }
    l && (_("Persisting history cleanup after rewind", {
      sceneId: e.id
    }), await gs(e, o)), Fn();
    return;
  }
  const u = t, d = i, m = [], f = Math.floor(u / qi), g = Math.floor(d / qi);
  for (const b of a) {
    if (!(b != null && b.id)) continue;
    const w = Vu(b.time);
    if (w === null) {
      Xm(e, b), _("Skipping trigger with invalid time", {
        triggerId: b.id,
        time: b.time
      });
      continue;
    }
    for (let C = f; C <= g; C++) {
      const I = C * qi + w;
      if (I < u || I > d) continue;
      const O = o[b.id];
      if (typeof O == "number" && O >= I) {
        _("Skipping trigger because it already fired within window", {
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
    l && await gs(e, o), _("No triggers scheduled to fire within evaluation window", {
      sceneId: e.id
    }), Fn();
    return;
  }
  m.sort((b, w) => b.absoluteTime - w.absoluteTime), _("Queued triggers for execution", {
    entries: m.map((b) => ({
      triggerId: b.trigger.id,
      absoluteTime: b.absoluteTime
    }))
  });
  for (const b of m)
    try {
      _("Executing time trigger action", {
        triggerId: b.trigger.id,
        absoluteTime: b.absoluteTime
      }), await Xu(e, b.trigger);
    } catch (w) {
      console.error(`${T} | Failed to execute time trigger action`, w), (v = (y = ui.notifications) == null ? void 0 : y.error) == null || v.call(
        y,
        E(
          "EIDOLON.TimeTrigger.TriggerActionError",
          "Failed to execute a scene time trigger action. Check the console for details."
        )
      ), _("Trigger execution failed", {
        triggerId: b.trigger.id,
        message: (w == null ? void 0 : w.message) ?? String(w)
      });
    } finally {
      o[b.trigger.id] = b.absoluteTime, l = !0, _("Recorded trigger execution", {
        triggerId: b.trigger.id,
        absoluteTime: b.absoluteTime
      });
    }
  l && (_("Persisting trigger history updates", { sceneId: e.id }), await gs(e, o)), Fn();
}, "#evaluateSceneTimeTriggers"), c(Oc, "TimeTriggerManager");
let tl = Oc;
function Xm(n, e) {
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
c(Xm, "warnInvalidTriggerTime");
var Tt, _r, Lt, Sn, si, Ht, Gi, So, Co, Nr, xr, li, qt, V, il, Mi, va, rl, wa, al, Pt, sd, ol, ld, sl, cd, To, Lo, Io, Oo, Ao, ko, ll, ud, Ea, Mo, _o;
const Ac = class Ac {
  constructor() {
    k(this, V);
    k(this, Tt, !1);
    k(this, _r, Jr);
    k(this, Lt, /* @__PURE__ */ new Map());
    k(this, Sn, null);
    k(this, si, null);
    k(this, Ht, 0);
    k(this, Gi, null);
    k(this, So, null);
    k(this, Co, null);
    k(this, Nr, !1);
    k(this, xr, !1);
    k(this, li, !1);
    k(this, qt, !1);
    k(this, To, /* @__PURE__ */ c((e, t = {}) => {
      _("GameTimeAutomation | Pause state changed", {
        paused: e,
        userId: (t == null ? void 0 : t.userId) ?? null,
        broadcast: (t == null ? void 0 : t.broadcast) ?? null
      }), S(this, V, Pt).call(this, { pausedOverride: e });
    }, "#handlePause"));
    k(this, Lo, /* @__PURE__ */ c((e) => {
      e != null && e.id && (h(this, Lt).set(e.id, Math.max(e.round ?? 0, 1)), _("GameTimeAutomation | Combat started", { combatId: e.id, round: e.round ?? 0 }), S(this, V, Pt).call(this));
    }, "#handleCombatStart"));
    k(this, Io, /* @__PURE__ */ c((e, t) => {
      if (!(e != null && e.id)) return;
      const i = typeof t == "number" && Number.isFinite(t) ? t : typeof e.round == "number" && Number.isFinite(e.round) ? e.round : 0, r = i > 0 ? i : 1, a = h(this, Lt).get(e.id), o = a ? Math.max(a, 1) : 1, s = r > 1 ? Math.max(r - o, 0) : 0;
      if (_("GameTimeAutomation | Combat round change detected", {
        combatId: e.id,
        effectiveRound: r,
        completedRounds: s,
        enabled: h(this, Tt),
        paused: (game == null ? void 0 : game.paused) ?? null
      }), s > 0 && h(this, Tt) && h(this, qt) && !(game != null && game.paused) && S(this, V, Mi).call(this) && S(this, V, va).call(this, e)) {
        const l = s * h(this, _r);
        l > 0 && (_("GameTimeAutomation | Advancing time for completed combat rounds", {
          combatId: e.id,
          completedRounds: s,
          delta: l
        }), S(this, V, sl).call(this, l));
      }
      h(this, Lt).set(e.id, Math.max(r, 1));
    }, "#handleCombatRound"));
    k(this, Oo, /* @__PURE__ */ c((e) => {
      e != null && e.id && (h(this, Lt).delete(e.id), _("GameTimeAutomation | Combat ended", { combatId: e.id }), S(this, V, Pt).call(this));
    }, "#handleCombatEnd"));
    k(this, Ao, /* @__PURE__ */ c((e) => {
      e != null && e.id && (h(this, Lt).delete(e.id), _("GameTimeAutomation | Combat deleted", { combatId: e.id }), S(this, V, Pt).call(this));
    }, "#handleCombatDelete"));
    k(this, ko, /* @__PURE__ */ c((e, t) => {
      if (e != null && e.id) {
        if (typeof (t == null ? void 0 : t.round) == "number" && Number.isFinite(t.round)) {
          const i = Math.max(t.round, 1);
          h(this, Lt).set(e.id, i), _("GameTimeAutomation | Combat round manually updated", {
            combatId: e.id,
            round: i
          });
        }
        (Object.prototype.hasOwnProperty.call(t ?? {}, "active") || (t == null ? void 0 : t.round) !== void 0) && S(this, V, Pt).call(this);
      }
    }, "#handleCombatUpdate"));
    k(this, Mo, /* @__PURE__ */ c((e) => {
      S(this, V, Ea).call(this, e == null ? void 0 : e.scene), S(this, V, Pt).call(this);
    }, "#handleCanvasReady"));
    k(this, _o, /* @__PURE__ */ c((e) => {
      if (!Ke(e)) return;
      const t = S(this, V, ll).call(this);
      if (!t || t.id !== e.id) return;
      S(this, V, Ea).call(this, e) && S(this, V, Pt).call(this);
    }, "#handleSceneUpdate"));
  }
  registerHooks() {
    h(this, Nr) || (L(this, Nr, !0), Hooks.on("pauseGame", h(this, To)), Hooks.on("combatStart", h(this, Lo)), Hooks.on("combatRound", h(this, Io)), Hooks.on("combatEnd", h(this, Oo)), Hooks.on("deleteCombat", h(this, Ao)), Hooks.on("updateCombat", h(this, ko)), Hooks.on("canvasReady", h(this, Mo)), Hooks.on("updateScene", h(this, _o)));
  }
  initialize() {
    h(this, xr) || (L(this, xr, !0), L(this, So, Wu((e) => {
      const t = !!e, i = t !== h(this, Tt);
      L(this, Tt, t), _("GameTimeAutomation | Manage time toggled", { enabled: t }), i && t && S(this, V, al).call(this), S(this, V, Pt).call(this);
    })), L(this, Co, Dm((e) => {
      L(this, _r, e), _("GameTimeAutomation | Seconds per round updated", { value: e });
    })), S(this, V, al).call(this), S(this, V, Ea).call(this), S(this, V, Pt).call(this));
  }
};
Tt = new WeakMap(), _r = new WeakMap(), Lt = new WeakMap(), Sn = new WeakMap(), si = new WeakMap(), Ht = new WeakMap(), Gi = new WeakMap(), So = new WeakMap(), Co = new WeakMap(), Nr = new WeakMap(), xr = new WeakMap(), li = new WeakMap(), qt = new WeakMap(), V = new WeakSet(), il = /* @__PURE__ */ c(function() {
  var e;
  try {
    if (typeof ((e = globalThis.performance) == null ? void 0 : e.now) == "function")
      return globalThis.performance.now();
  } catch (t) {
    _("GameTimeAutomation | Failed to read high-resolution timestamp", {
      message: (t == null ? void 0 : t.message) ?? String(t)
    });
  }
  return Date.now();
}, "#currentTimestamp"), Mi = /* @__PURE__ */ c(function() {
  var e;
  return !!((e = game == null ? void 0 : game.user) != null && e.isGM && game.user.active !== !1);
}, "#canControlTime"), va = /* @__PURE__ */ c(function(e) {
  var i, r;
  if (!e) return !1;
  if (e.active === !0) return !0;
  if (e.active === !1) return !1;
  const t = (i = game == null ? void 0 : game.combats) == null ? void 0 : i.active;
  return (t == null ? void 0 : t.id) === e.id ? !0 : ((r = game == null ? void 0 : game.combat) == null ? void 0 : r.id) === e.id ? game.combat.active ?? !0 : !1;
}, "#isCombatDocumentActive"), rl = /* @__PURE__ */ c(function(e) {
  return e ? typeof e.started == "boolean" ? e.started : (e.round ?? 0) > 0 : !1;
}, "#hasCombatStarted"), wa = /* @__PURE__ */ c(function() {
  var i;
  const e = Array.isArray((i = game == null ? void 0 : game.combats) == null ? void 0 : i.contents) ? game.combats.contents : [];
  for (const r of e)
    if (S(this, V, va).call(this, r) && S(this, V, rl).call(this, r))
      return !0;
  const t = game == null ? void 0 : game.combat;
  return !!(t && S(this, V, va).call(this, t) && S(this, V, rl).call(this, t));
}, "#isCombatRunning"), al = /* @__PURE__ */ c(function() {
  var t;
  h(this, Lt).clear();
  const e = Array.isArray((t = game == null ? void 0 : game.combats) == null ? void 0 : t.contents) ? game.combats.contents : [];
  for (const i of e)
    i != null && i.id && h(this, Lt).set(i.id, Math.max(i.round ?? 0, 1));
}, "#hydrateRoundTracking"), Pt = /* @__PURE__ */ c(function({ pausedOverride: e } = {}) {
  const t = typeof e == "boolean" ? e : !!(game != null && game.paused), i = h(this, Tt), r = h(this, qt), a = i && r, o = {
    manageTimeEnabled: i,
    sceneAllowsRealTime: r,
    effectiveEnabled: a,
    paused: t,
    canControl: S(this, V, Mi).call(this),
    combatRunning: S(this, V, wa).call(this),
    overrideApplied: typeof e == "boolean"
  };
  if (_("GameTimeAutomation | Sync running state", o), !a || !S(this, V, Mi).call(this)) {
    S(this, V, ol).call(this);
    return;
  }
  S(this, V, sd).call(this);
}, "#syncRunningState"), sd = /* @__PURE__ */ c(function() {
  h(this, Sn) === null && (L(this, si, S(this, V, il).call(this)), L(this, Sn, globalThis.setInterval(() => S(this, V, ld).call(this), 1e3)), _("GameTimeAutomation | Started real-time ticker"));
}, "#startRealTimeTicker"), ol = /* @__PURE__ */ c(function() {
  h(this, Sn) !== null && (globalThis.clearInterval(h(this, Sn)), L(this, Sn, null), _("GameTimeAutomation | Stopped real-time ticker")), L(this, si, null), L(this, Ht, 0), L(this, li, !1);
}, "#stopRealTimeTicker"), ld = /* @__PURE__ */ c(function() {
  if (!h(this, Tt) || !h(this, qt) || !S(this, V, Mi).call(this)) {
    S(this, V, ol).call(this);
    return;
  }
  const e = S(this, V, il).call(this);
  if (typeof e != "number" || !Number.isFinite(e)) return;
  const t = h(this, si) ?? e, i = (e - t) / 1e3;
  if (L(this, si, e), !Number.isFinite(i) || i <= 0) return;
  const r = !!(game != null && game.paused), a = S(this, V, wa).call(this);
  if (r || a) {
    h(this, li) || _("GameTimeAutomation | Tick skipped", { paused: r, combatRunning: a }), L(this, li, !0), L(this, Ht, 0);
    return;
  }
  L(this, li, !1), _("GameTimeAutomation | Real-time tick", { deltaSeconds: i }), S(this, V, sl).call(this, i);
}, "#tickRealTime"), sl = /* @__PURE__ */ c(function(e) {
  if (!h(this, Tt) || !h(this, qt)) return;
  const t = Number(e);
  !Number.isFinite(t) || t <= 0 || (L(this, Ht, h(this, Ht) + t), !h(this, Gi) && L(this, Gi, S(this, V, cd).call(this)));
}, "#queueAdvance"), cd = /* @__PURE__ */ c(async function() {
  var e, t;
  for (; h(this, Ht) > 0; ) {
    if (!h(this, Tt) || !h(this, qt) || game != null && game.paused || !S(this, V, Mi).call(this) || S(this, V, wa).call(this)) {
      L(this, Ht, 0);
      break;
    }
    const i = h(this, Ht);
    L(this, Ht, 0);
    try {
      if (typeof ((e = game == null ? void 0 : game.time) == null ? void 0 : e.advance) == "function")
        _("GameTimeAutomation | Advancing world time", { delta: i }), await game.time.advance(i), _("GameTimeAutomation | World time advanced", {
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
  L(this, Gi, null);
}, "#flushAdvanceQueue"), To = new WeakMap(), Lo = new WeakMap(), Io = new WeakMap(), Oo = new WeakMap(), Ao = new WeakMap(), ko = new WeakMap(), ll = /* @__PURE__ */ c(function() {
  const e = dr();
  return Ke(e) ? e : null;
}, "#getActiveSceneDocument"), ud = /* @__PURE__ */ c(function(e) {
  if (!Ke(e)) return !1;
  try {
    return !!e.getFlag(T, Ps);
  } catch (t) {
    return _("GameTimeAutomation | Failed to read scene real-time flag", {
      sceneId: (e == null ? void 0 : e.id) ?? null,
      message: (t == null ? void 0 : t.message) ?? String(t)
    }), !1;
  }
}, "#isSceneRealTimeAllowed"), Ea = /* @__PURE__ */ c(function(e) {
  const t = Ke(e) ? e : S(this, V, ll).call(this), i = S(this, V, ud).call(this, t), r = h(this, qt);
  return L(this, qt, i), r !== i ? (_("GameTimeAutomation | Scene real-time allowance changed", {
    sceneId: (t == null ? void 0 : t.id) ?? null,
    allows: i
  }), !0) : !1;
}, "#refreshSceneAutomationState"), Mo = new WeakMap(), _o = new WeakMap(), c(Ac, "GameTimeAutomation");
let nl = Ac;
var Pu, Cn, He, ci, ln, No, Ee, dd, fd, md, hd, xo, ul, $o, gd, Fo, pd, yd;
const rn = class rn extends Gn(zn) {
  constructor(t = {}) {
    const { scene: i, trigger: r, triggerIndex: a, onSave: o, ...s } = t ?? {};
    super(s);
    k(this, Ee);
    k(this, Cn, null);
    k(this, He, null);
    k(this, ci, null);
    k(this, ln, null);
    k(this, No, /* @__PURE__ */ c(() => {
      (this.rendered ?? this.isRendered ?? !1) && (L(this, ln, S(this, Ee, dd).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    k(this, xo, /* @__PURE__ */ c((t) => {
      var a, o;
      const i = t.currentTarget, r = i == null ? void 0 : i.closest("form");
      r && (_("Trigger action selection changed", {
        sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
        triggerId: ((o = this.trigger) == null ? void 0 : o.id) ?? null,
        actionId: (i == null ? void 0 : i.value) ?? null
      }), S(this, Ee, ul).call(this, i.value, r));
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
      _("Opening file picker for trigger", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        triggerId: ((m = this.trigger) == null ? void 0 : m.id) ?? null,
        target: a
      }), new FilePicker({
        type: ((f = i.dataset) == null ? void 0 : f.type) || "audio",
        current: s.value,
        callback: /* @__PURE__ */ c((g) => {
          var p, y;
          s.value = g, s.dispatchEvent(new Event("change")), _("Trigger form file selected", {
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
      i instanceof HTMLFormElement && (_("Trigger form submitted", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null,
        triggerId: ((a = this.trigger) == null ? void 0 : a.id) ?? null
      }), await S(this, Ee, pd).call(this, i));
    }, "#onSubmit"));
    this.scene = i ?? null, this.trigger = r ?? null, this.triggerIndex = Number.isInteger(a) ? Number(a) : null, this.onSave = typeof o == "function" ? o : null, L(this, ci, oc(h(this, No)));
  }
  async _prepareContext() {
    var t, i;
    Ji("TriggerFormApplication#_prepareContext", {
      sceneId: ((t = this.scene) == null ? void 0 : t.id) ?? null,
      triggerId: ((i = this.trigger) == null ? void 0 : i.id) ?? null,
      triggerIndex: this.triggerIndex
    });
    try {
      const r = this.trigger ?? { action: ba, data: {} }, a = r.action ?? ba, o = jc(r.time), s = o.format ?? "12h", l = s === "12h" ? Jm() : [], u = o.period ?? (l.length > 0 ? l[0].value : null), d = s === "12h" ? l.map((g) => ({
        ...g,
        selected: g.value === u
      })) : [], m = qc().map((g) => ({
        id: g.id,
        label: typeof g.label == "function" ? g.label() : g.label,
        selected: g.id === a
      })), f = qc().map((g) => {
        const p = g.id === r.action ? r : { ...r, action: g.id }, y = Um(p);
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
      Fn();
    }
  }
  _onRender(t, i) {
    var l, u, d;
    super._onRender(t, i);
    const r = this.element;
    if (!r) return;
    _("Trigger form rendered", {
      sceneId: ((l = this.scene) == null ? void 0 : l.id) ?? null,
      triggerId: ((u = this.trigger) == null ? void 0 : u.id) ?? null
    });
    const a = Array.from(((d = document == null ? void 0 : document.body) == null ? void 0 : d.classList) ?? []).find(
      (m) => m.startsWith("theme-")
    );
    a && r.classList.add(a);
    const o = r.querySelector("form");
    if (!o) return;
    S(this, Ee, gd).call(this, o), S(this, Ee, fd).call(this, o), o.addEventListener("submit", h(this, Fo));
    const s = o.querySelector("[data-action-select]");
    s && (s.addEventListener("change", h(this, xo)), S(this, Ee, ul).call(this, s.value, o)), o.querySelectorAll("[data-action-file-picker]").forEach((m) => {
      m.addEventListener("click", h(this, $o));
    });
  }
  async close(t = {}) {
    var i;
    if ((i = h(this, Cn)) == null || i.call(this), L(this, Cn, null), L(this, He, null), L(this, ln, null), typeof h(this, ci) == "function")
      try {
        h(this, ci).call(this);
      } catch (r) {
        console.error(`${T} | Failed to dispose trigger form time format subscription`, r);
      }
    return L(this, ci, null), super.close(t);
  }
};
Cn = new WeakMap(), He = new WeakMap(), ci = new WeakMap(), ln = new WeakMap(), No = new WeakMap(), Ee = new WeakSet(), dd = /* @__PURE__ */ c(function() {
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
}, "#captureFormState"), fd = /* @__PURE__ */ c(function(t) {
  if (!h(this, ln)) return;
  if (!(t instanceof HTMLFormElement)) {
    L(this, ln, null);
    return;
  }
  const { fields: i = [], time: r = null } = h(this, ln) ?? {};
  L(this, ln, null), S(this, Ee, md).call(this, t, i), S(this, Ee, hd).call(this, t, r);
}, "#restorePendingFormState"), md = /* @__PURE__ */ c(function(t, i) {
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
}, "#restoreFieldValues"), hd = /* @__PURE__ */ c(function(t, i) {
  var w, C, I;
  const r = t.querySelector("[data-time-format]");
  if (!(r instanceof HTMLElement)) {
    typeof h(this, He) == "function" && h(this, He).call(this);
    return;
  }
  const a = ((w = r.dataset) == null ? void 0 : w.timeFormat) === "24h" ? "24h" : "12h", o = r.querySelector("[data-time-hour]"), s = r.querySelector("[data-time-minute]"), l = r.querySelector("[data-time-period]"), u = r.querySelector("[data-time-hidden]");
  if (!i) {
    if (o instanceof HTMLInputElement && (o.value = ""), s instanceof HTMLInputElement && (s.value = ""), l instanceof HTMLSelectElement) {
      const A = ((I = (C = l.options) == null ? void 0 : C[0]) == null ? void 0 : I.value) ?? "";
      l.value = A;
    }
    u instanceof HTMLInputElement && (u.value = ""), typeof h(this, He) == "function" && h(this, He).call(this);
    return;
  }
  const d = typeof i.canonical == "string" ? i.canonical : "", m = typeof i.period == "string" ? i.period : "", f = typeof i.hour == "string" ? i.hour : "", g = typeof i.minute == "string" ? i.minute : "";
  let p = "", y = "", v = m, b = d;
  if (d) {
    const A = jc(d, a);
    p = A.hour ?? "", y = A.minute ?? "", b = A.canonical ?? d, a === "12h" ? v = A.period ?? m : v = "";
  } else
    p = f, y = g, a !== "12h" && (v = "");
  if (o instanceof HTMLInputElement && (o.value = p ?? ""), s instanceof HTMLInputElement && (s.value = y ?? ""), l instanceof HTMLSelectElement)
    if (a === "12h") {
      const A = Array.from(l.options ?? []);
      A.find((M) => M.value === v) ? l.value = v : A.length > 0 ? l.value = A[0].value : l.value = "";
    } else
      l.value = "";
  u instanceof HTMLInputElement && (u.value = b ?? ""), typeof h(this, He) == "function" && h(this, He).call(this);
}, "#restoreTimeInputs"), xo = new WeakMap(), ul = /* @__PURE__ */ c(function(t, i) {
  i && i.querySelectorAll("[data-action-config]").forEach((r) => {
    const a = r.dataset.actionConfig === t;
    r.style.display = a ? "" : "none";
  });
}, "#updateActionSections"), $o = new WeakMap(), gd = /* @__PURE__ */ c(function(t) {
  var m, f, g, p;
  if ((m = h(this, Cn)) == null || m.call(this), L(this, Cn, null), L(this, He, null), !(t instanceof HTMLFormElement)) return;
  const i = t.querySelector("[data-time-format]"), r = ((f = i == null ? void 0 : i.dataset) == null ? void 0 : f.timeFormat) ?? null;
  if (r !== "12h" && r !== "24h")
    return;
  const a = i.querySelector("[data-time-hidden]"), o = i.querySelector("[data-time-hour]"), s = i.querySelector("[data-time-minute]"), l = r === "12h" ? i.querySelector("[data-time-period]") : null;
  if (!a || !o || !s || r === "12h" && !l) {
    _("Trigger form time inputs missing elements", {
      format: r,
      hasHidden: !!a,
      hasHour: !!o,
      hasMinute: !!s,
      hasPeriod: !!l
    });
    return;
  }
  const u = [o, s, ...l ? [l] : []], d = /* @__PURE__ */ c(() => {
    const { canonical: y, error: v } = Km(
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
  }), L(this, He, d), _("Trigger form configured for time input", {
    format: r,
    sceneId: ((g = this.scene) == null ? void 0 : g.id) ?? null,
    triggerId: ((p = this.trigger) == null ? void 0 : p.id) ?? null
  });
}, "#setupTimeInput"), Fo = new WeakMap(), pd = /* @__PURE__ */ c(async function(t) {
  var a, o, s, l, u;
  if (typeof h(this, He) == "function" && h(this, He).call(this), typeof t.checkValidity == "function" && !t.checkValidity()) {
    typeof t.reportValidity == "function" && t.reportValidity(), _("Trigger form submission blocked by validity check", {
      sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
      triggerId: ((o = this.trigger) == null ? void 0 : o.id) ?? null
    });
    return;
  }
  const i = new FormData(t), r = Object.fromEntries(i.entries());
  delete r.timeHour, delete r.timeMinute, delete r.timePeriod, r.allowReplayOnRewind = ((s = t.querySelector('input[name="allowReplayOnRewind"]')) == null ? void 0 : s.checked) ?? !1, _("Processing trigger form submission", {
    sceneId: ((l = this.scene) == null ? void 0 : l.id) ?? null,
    triggerId: ((u = this.trigger) == null ? void 0 : u.id) ?? null,
    allowReplayOnRewind: r.allowReplayOnRewind
  }), await S(this, Ee, yd).call(this, r), await this.close();
}, "#handleSubmit"), yd = /* @__PURE__ */ c(async function(t) {
  var a, o, s, l, u, d;
  const i = {
    id: ((a = this.trigger) == null ? void 0 : a.id) ?? Mm(),
    time: t.time ?? "",
    action: t.action ?? ba,
    allowReplayOnRewind: !!t.allowReplayOnRewind,
    data: {}
  };
  _("Persisting trigger from form", {
    sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
    triggerId: i.id,
    existingIndex: this.triggerIndex
  }), Vm(i, t);
  const r = ji(this.scene);
  this.triggerIndex !== null && r[this.triggerIndex] ? r[this.triggerIndex] = i : r.push(i);
  try {
    await Ju(this.scene, r), _("Trigger list saved", {
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
      console.error(`${T} | Trigger onSave callback failed`, m), _("Trigger onSave callback failed", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        message: (m == null ? void 0 : m.message) ?? String(m)
      });
    }
}, "#persistTrigger"), c(rn, "TriggerFormApplication"), ye(rn, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Re(rn, rn, "DEFAULT_OPTIONS"),
  {
    id: `${T}-trigger-form`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Pu = Re(rn, rn, "DEFAULT_OPTIONS")) == null ? void 0 : Pu.classes) ?? [], "standard-form", "themed"])
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
let cl = rn;
function Kt(n) {
  return n instanceof HTMLElement ? n : (n == null ? void 0 : n[0]) instanceof HTMLElement ? n[0] : null;
}
c(Kt, "asHTMLElement");
function Sa(n) {
  return typeof (n == null ? void 0 : n.changeTab) == "function";
}
c(Sa, "isAppV2");
function bd(n, e, t, i = {}) {
  if (Sa(n)) {
    n.changeTab(e, t, i);
    return;
  }
  if (typeof (n == null ? void 0 : n.activateTab) == "function") {
    const r = { ...i };
    t != null && (r.group = t), r.triggerCallback == null && (r.triggerCallback = !0), n.activateTab(e, r);
  }
}
c(bd, "setActiveTab");
function Qm(n) {
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
c(Qm, "readFormData");
const Uc = Symbol.for("eidolon.sceneConfig.v13PatchedTabs");
function vd(n = {}) {
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
  const g = typeof d.log == "function" ? d.log.bind(d) : (...N) => {
    var R;
    return (R = console.debug) == null ? void 0 : R.call(console, `${o}`, ...N);
  }, p = typeof d.group == "function" ? d.group.bind(d) : (...N) => {
    var R;
    return (R = console.groupCollapsed) == null ? void 0 : R.call(console, `${o}`, ...N);
  }, y = typeof d.groupEnd == "function" ? d.groupEnd.bind(d) : () => {
    var N;
    return (N = console.groupEnd) == null ? void 0 : N.call(console);
  }, v = Symbol(`EIDOLON_SCENE_CONFIG_TAB_CLEANUP_${e}`), b = typeof i == "function" ? i : () => null, w = typeof r == "function" ? r : () => !0, C = typeof t == "function" ? t : () => typeof t == "string" ? t : e;
  function I() {
    var W, H, U, K, ae;
    const N = ((H = (W = foundry == null ? void 0 : foundry.applications) == null ? void 0 : W.sheets) == null ? void 0 : H.SceneConfig) ?? ((U = CONFIG == null ? void 0 : CONFIG.Scene) == null ? void 0 : U.sheetClass);
    if (!N || !Sa({ changeTab: (K = N.prototype) == null ? void 0 : K.changeTab })) return;
    const R = N[Uc] ?? /* @__PURE__ */ new Set();
    if (R.has(e)) return;
    R.add(e), N[Uc] = R;
    const B = (ae = N.TABS) == null ? void 0 : ae.sheet;
    if (B && Array.isArray(B.tabs) && !B.tabs.some((Q) => Q.id === e)) {
      const Q = C({ app: null, scene: null }) ?? e;
      B.tabs.push({
        id: e,
        icon: f,
        label: Q
      });
    }
    N.PARTS && !N.PARTS[e] && (N.PARTS[e] = {
      template: `modules/${m}/templates/scene-config-tab-mount.hbs`,
      scrollable: [`.tab[data-tab="${e}"]`]
    }), g("Patched v13 SceneConfig TABS/PARTS", { tabId: e });
  }
  c(I, "patchV13SceneConfig");
  function A(N, R) {
    var W, H;
    const B = b(N);
    if (!w(N, B)) {
      g("Skipped render", {
        tabId: e,
        reason: "inapplicable",
        constructor: ((W = N == null ? void 0 : N.constructor) == null ? void 0 : W.name) ?? null
      });
      return;
    }
    p("render", {
      tabId: e,
      sceneId: (B == null ? void 0 : B.id) ?? null,
      constructor: ((H = N == null ? void 0 : N.constructor) == null ? void 0 : H.name) ?? null
    });
    try {
      const U = Kt(R) ?? Kt(N.element);
      if (!U) {
        g("Missing root element", { tabId: e });
        return;
      }
      Sa(N) ? $(N, U, B) : M(N, U, B);
    } finally {
      y();
    }
  }
  c(A, "handleRender");
  function O(N, R, B) {
    var U;
    if (!f) {
      N.textContent = R;
      return;
    }
    const W = (U = N.querySelector("i")) == null ? void 0 : U.cloneNode(!0);
    N.textContent = "";
    const H = W ?? document.createElement("i");
    if (W || (H.className = f, B && (H.inert = !0)), N.append(H, " "), B) {
      const K = document.createElement("span");
      K.textContent = R, N.append(K);
    } else
      N.append(document.createTextNode(R));
  }
  c(O, "setButtonContent");
  function M(N, R, B) {
    var ot, Qt, Je, Ae, Ii, Zt, Wn, st, en, F, na, X, bt, Ne, ir, ia;
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
    ].find((xe) => xe instanceof HTMLElement), ae = ((Ae = H == null ? void 0 : H.dataset) == null ? void 0 : Ae.group) ?? ((Wn = (Zt = (Ii = H == null ? void 0 : H.querySelector) == null ? void 0 : Ii.call(H, "a[data-group]")) == null ? void 0 : Zt.dataset) == null ? void 0 : Wn.group) ?? ((F = (en = (st = H == null ? void 0 : H.querySelector) == null ? void 0 : st.call(H, "[data-group]")) == null ? void 0 : en.dataset) == null ? void 0 : F.group) ?? ((bt = (X = (na = K == null ? void 0 : K.querySelector) == null ? void 0 : na.call(K, ".tab[data-group]")) == null ? void 0 : X.dataset) == null ? void 0 : bt.group) ?? "main";
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
      (Ne = xe == null ? void 0 : xe.classList) != null && Ne.contains("item") && Q.classList.add("item"), H.appendChild(Q), typeof s == "function" && s({ app: N, button: Q, nav: H, scene: B }), g("Created tab button", { tabId: e, group: ae });
    }
    O(Q, C({ app: N, scene: B }) ?? e, Sa(N));
    let te = K.querySelector(`.tab[data-tab="${e}"]`);
    if (!te) {
      te = document.createElement("div"), te.classList.add("tab"), te.dataset.tab = e, te.dataset.group = ae;
      const xe = wd(K);
      K.insertBefore(te, xe ?? null), typeof l == "function" && l({ app: N, tab: te, body: K, scene: B }), g("Created tab container", { tabId: e, group: ae });
    }
    ((ir = Q.classList) == null ? void 0 : ir.contains("active")) || te.classList.contains("active") ? (Q.classList.add("active"), te.classList.add("active"), te.removeAttribute("hidden")) : (Q.classList.remove("active"), te.classList.remove("active"), te.setAttribute("hidden", "true"));
    const yt = /* @__PURE__ */ c(() => {
      var Yn, rr;
      ((Yn = Q.classList) != null && Yn.contains("active") || te.classList.contains("active")) && ((rr = Q.classList) == null || rr.add("active"), te.classList.add("active"), te.removeAttribute("hidden"), te.removeAttribute("aria-hidden"), te.style.display === "none" && (te.style.display = ""));
    }, "ensureTabVisible"), Pe = /* @__PURE__ */ c(() => {
      yt(), requestAnimationFrame(yt);
    }, "scheduleEnsureTabVisible");
    Q.dataset.eidolonEnsureSceneTabVisibility || (Q.addEventListener("click", () => {
      bd(N, e, ae), requestAnimationFrame(yt);
    }), Q.dataset.eidolonEnsureSceneTabVisibility = "true"), ps(N, v, g);
    const at = a({
      app: N,
      scene: B,
      tab: te,
      tabButton: Q,
      ensureTabVisible: yt,
      scheduleEnsureTabVisible: Pe
    });
    typeof at == "function" && Vc(N, v, at), typeof u == "function" && u({
      app: N,
      scene: B,
      tab: te,
      tabButton: Q,
      ensureTabVisible: yt,
      scheduleEnsureTabVisible: Pe
    }), (ia = N.setPosition) == null || ia.call(N, { height: "auto" });
  }
  c(M, "handleRenderV1");
  function $(N, R, B) {
    const W = R.querySelector(`.tab[data-tab="${e}"]`), H = R.querySelector(`nav [data-tab="${e}"]`);
    if (!W || !H) {
      g("v2 mount not found, falling back to v1 injection", { tabId: e }), M(N, R, B);
      return;
    }
    O(H, C({ app: N, scene: B }) ?? e, !0);
    const U = /* @__PURE__ */ c(() => {
      var Q;
      !((Q = H.classList) != null && Q.contains("active")) && !W.classList.contains("active") || (W.classList.add("active"), W.removeAttribute("hidden"), W.removeAttribute("aria-hidden"), W.style.display === "none" && (W.style.display = ""));
    }, "ensureTabVisible"), K = /* @__PURE__ */ c(() => {
      U(), requestAnimationFrame(U);
    }, "scheduleEnsureTabVisible");
    ps(N, v, g);
    const ae = a({
      app: N,
      scene: B,
      tab: W,
      tabButton: H,
      ensureTabVisible: U,
      scheduleEnsureTabVisible: K
    });
    typeof ae == "function" && Vc(N, v, ae), typeof u == "function" && u({
      app: N,
      scene: B,
      tab: W,
      tabButton: H,
      ensureTabVisible: U,
      scheduleEnsureTabVisible: K
    });
  }
  c($, "handleRenderV2");
  function j(N) {
    ps(N, v, g);
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
c(vd, "createSceneConfigTabFactory");
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
function wd(n) {
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
c(wd, "findFooterElement");
const Zm = Go(cl), eh = `modules/${T}/templates/time-trigger-scene-tab.html`, th = vd({
  tabId: "time-triggers",
  tabLabel: /* @__PURE__ */ c(() => E("EIDOLON.TimeTrigger.Tab", "Time Triggers"), "tabLabel"),
  getScene: Jt,
  isApplicable: ah,
  renderContent: /* @__PURE__ */ c(({ app: n, scene: e, tab: t }) => ih(n, t, e), "renderContent"),
  logger: {
    log: _,
    group: Ji,
    groupEnd: Fn
  }
});
function nh() {
  return _("Registering SceneConfig render hook"), th.register();
}
c(nh, "registerSceneConfigHook");
function ih(n, e, t) {
  if (!(e instanceof HTMLElement)) return;
  const i = Ke(t) ? t : Jt(n);
  Ua(n, e, i);
  const r = oc(() => {
    Ua(n, e, i);
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
c(ih, "renderTimeTriggerTab");
async function Ua(n, e, t) {
  var r, a;
  const i = t ?? Jt(n);
  Ji("renderTimeTriggersTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!Ke(i)) {
      const W = E(
        "EIDOLON.TimeTrigger.Unavailable",
        "Time triggers are unavailable for this configuration sheet."
      );
      e.innerHTML = `<p class="notes">${W}</p>`, _("Scene lacks document for time triggers", { sceneId: (i == null ? void 0 : i.id) ?? null });
      return;
    }
    const o = `flags.${T}.${Ra}`, s = `flags.${T}.${Fs}`, l = `flags.${T}.${Ds}`, u = !!i.getFlag(T, Ra), d = !!i.getFlag(T, Fs), m = !!i.getFlag(T, Ds), f = ji(i);
    _("Rendering time trigger list", {
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
    ), A = E("EIDOLON.TimeTrigger.AddTrigger", "Add Trigger"), O = E("EIDOLON.TimeTrigger.EditTrigger", "Edit"), M = E("EIDOLON.TimeTrigger.DeleteTrigger", "Remove"), $ = E("EIDOLON.TimeTrigger.TriggerNow", "Trigger Now"), j = E("EIDOLON.TimeTrigger.AtLabel", "At"), D = E("EIDOLON.TimeTrigger.DoLabel", "Do"), P = E("EIDOLON.TimeTrigger.MissingTime", "(No time set)"), N = f.map((W, H) => {
      const ae = (W.time ? Ym(W.time) : "") || W.time || "" || P, Q = jm(W.action), te = [
        `${j} ${ae}`,
        `${D} ${Q}`,
        ...Bm(W)
      ];
      return {
        index: H,
        summaryParts: te,
        tooltips: {
          triggerNow: $,
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
      B = await R(eh, {
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
          triggerList: C,
          empty: I,
          add: A
        },
        hints: {
          activate: p,
          hideWindow: v,
          showPlayerWindow: w
        },
        triggers: N,
        hasTriggers: N.length > 0
      });
    } catch (W) {
      console.error(`${T} | Failed to render time trigger scene tab template`, W), e.innerHTML = `<p class="notes">${I}</p>`;
      return;
    }
    e.innerHTML = B, rh(n, e, i);
  } finally {
    Fn();
  }
}
c(Ua, "renderTimeTriggersTabContent");
function rh(n, e, t) {
  const i = t ?? Jt(n);
  if (!Ke(i)) return;
  const r = e.querySelector('[data-action="add-trigger"]');
  r && r.addEventListener("click", () => {
    _("Add trigger button clicked", { sceneId: i.id }), zc(n, { scene: i });
  }), e.querySelectorAll('[data-action="edit-trigger"]').forEach((a) => {
    a.addEventListener("click", () => {
      const o = Number(a.dataset.index);
      if (!Number.isInteger(o)) return;
      const l = ji(i)[o];
      l && (_("Edit trigger button clicked", { sceneId: i.id, triggerId: l.id, index: o }), zc(n, { trigger: l, triggerIndex: o, scene: i }));
    });
  }), e.querySelectorAll('[data-action="delete-trigger"]').forEach((a) => {
    a.addEventListener("click", async () => {
      var u, d;
      const o = Number(a.dataset.index);
      if (!Number.isInteger(o)) return;
      const s = ji(i), l = s[o];
      if (l) {
        s.splice(o, 1);
        try {
          _("Deleting trigger", {
            sceneId: i.id,
            index: o,
            triggerId: (l == null ? void 0 : l.id) ?? null
          }), await Ju(i, s), await Ua(n, e, i);
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
      const l = ji(i)[o];
      if (l) {
        if (!((u = game.user) != null && u.isGM)) {
          (m = (d = ui.notifications) == null ? void 0 : d.warn) == null || m.call(
            d,
            E("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time.")
          );
          return;
        }
        try {
          _("Manually firing trigger", { sceneId: i.id, triggerId: l.id, index: o }), await Xu(i, l), (g = (f = ui.notifications) == null ? void 0 : f.info) == null || g.call(
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
          ), _("Manual trigger execution failed", {
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
c(rh, "bindTimeTriggerTabEvents");
function zc(n, e = {}) {
  var o;
  const t = e.scene ?? null, i = t && Ke(t) ? t : Jt(n);
  if (!Ke(i)) {
    console.warn(`${T} | Unable to open trigger form because no scene document is available.`);
    return;
  }
  _("Opening trigger form", {
    sceneId: i.id,
    triggerId: ((o = e.trigger) == null ? void 0 : o.id) ?? null,
    index: Number.isInteger(e.triggerIndex) ? Number(e.triggerIndex) : null
  }), Zm({
    scene: i,
    trigger: e.trigger ?? null,
    triggerIndex: e.triggerIndex ?? null,
    onSave: /* @__PURE__ */ c(() => {
      var l, u;
      const s = (u = (l = n.element) == null ? void 0 : l[0]) == null ? void 0 : u.querySelector('.tab[data-tab="time-triggers"]');
      s && Ua(n, s, i);
    }, "onSave")
  }).render({ force: !0 });
}
c(zc, "openTriggerForm");
function ah(n, e) {
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
c(ah, "isRecognizedSceneConfig");
const sa = new tl(), Gc = new nl();
function oh() {
  _("Registering time trigger hooks"), Hooks.once("init", () => {
    _m(), Pm(), _("Time trigger settings registered during init");
  }), nh(), _("Scene config hook registered"), Gc.registerHooks(), _("Time automation hooks registered"), Hooks.once("ready", () => {
    Rm(), _("Ready hook fired"), sa.onReady(), Gc.initialize();
  }), Hooks.on("canvasReady", (n) => {
    var e;
    _("canvasReady hook received", { scene: ((e = n == null ? void 0 : n.scene) == null ? void 0 : e.id) ?? null }), sa.onCanvasReady(n);
  }), Hooks.on("updateScene", (n) => {
    _("updateScene hook received", { scene: (n == null ? void 0 : n.id) ?? null }), sa.onUpdateScene(n);
  }), Hooks.on("updateWorldTime", (n, e) => {
    _("updateWorldTime hook received", { worldTime: n, diff: e }), sa.onUpdateWorldTime(n, e);
  });
}
c(oh, "registerTimeTriggerHooks");
oh();
const Te = T, Ed = "criteria", lc = "state", sh = "criteriaVersion", lh = 1, Sd = "enableCriteriaSurfaces";
let Wc = !1;
function ch() {
  var n;
  if (!Wc) {
    if (Wc = !0, !((n = game == null ? void 0 : game.settings) != null && n.register)) {
      console.warn(`${Te} | game.settings.register unavailable; scene criteria setting skipped.`);
      return;
    }
    game.settings.register(Te, Sd, {
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
        uh();
      }, "onChange")
    });
  }
}
c(ch, "registerSceneCriteriaSettings");
function Wo() {
  var n;
  try {
    if ((n = game == null ? void 0 : game.settings) != null && n.get)
      return !!game.settings.get(Te, Sd);
  } catch (e) {
    console.error(`${Te} | Failed to read criteria surfaces setting`, e);
  }
  return !0;
}
c(Wo, "getCriteriaSurfacesEnabled");
function uh() {
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
c(uh, "promptReloadForCriteriaSurfaces");
const Va = "Standard";
function pt(n) {
  var t;
  const e = (t = n == null ? void 0 : n.getFlag) == null ? void 0 : t.call(n, Te, Ed);
  return e ? Cd(e) : [];
}
c(pt, "getSceneCriteria");
async function Yo(n, e) {
  if (!(n != null && n.setFlag)) return;
  const t = Cd(e);
  await n.setFlag(Te, Ed, t), await n.setFlag(Te, sh, lh);
  const i = Qr(n, t);
  await n.setFlag(Te, lc, i);
}
c(Yo, "setSceneCriteria");
function Qr(n, e = null) {
  var r;
  const t = Array.isArray(e) ? e : pt(n), i = Yt(((r = n == null ? void 0 : n.getFlag) == null ? void 0 : r.call(n, Te, lc)) ?? {});
  return uc(i, t);
}
c(Qr, "getSceneCriteriaState");
async function dh(n, e, t = null) {
  if (!(n != null && n.setFlag)) return;
  const i = Array.isArray(t) ? t : pt(n), r = uc(e, i);
  await n.setFlag(Te, lc, r);
}
c(dh, "setSceneCriteriaState");
function cc(n = "") {
  const e = typeof n == "string" ? n.trim() : "", t = Td(fl(e || "criterion"), /* @__PURE__ */ new Set());
  return {
    id: Ld(),
    key: t,
    label: e,
    values: [Va],
    default: Va,
    order: 0
  };
}
c(cc, "createSceneCriterion");
function Cd(n) {
  const e = Array.isArray(n) ? Yt(n) : [], t = [], i = /* @__PURE__ */ new Set();
  return e.forEach((r, a) => {
    const o = dl(r, a, i);
    o && (t.push(o), i.add(o.key));
  }), t;
}
c(Cd, "sanitizeCriteria$1");
function dl(n, e = 0, t = /* @__PURE__ */ new Set()) {
  if (!n || typeof n != "object") return null;
  const i = typeof n.id == "string" && n.id.trim() ? n.id.trim() : Ld(), a = (typeof n.label == "string" ? n.label : typeof n.name == "string" ? n.name : "").trim(), o = typeof n.key == "string" && n.key.trim() ? fl(n.key) : fl(a || `criterion-${Number(e) + 1}`), s = Td(o, t), l = mh(n.values);
  let u = typeof n.default == "string" ? n.default.trim() : "";
  u || (u = l[0] ?? Va), l.includes(u) || l.unshift(u);
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
c(dl, "sanitizeCriterion");
function uc(n, e = []) {
  const t = n && typeof n == "object" ? Yt(n) : {}, i = {};
  for (const r of e) {
    const a = t == null ? void 0 : t[r.key], o = typeof a == "string" ? a.trim() : "";
    o && r.values.includes(o) ? i[r.key] = o : i[r.key] = r.default;
  }
  return i;
}
c(uc, "sanitizeSceneCriteriaState");
function fh(n) {
  return pt(n).map((t) => ({
    id: t.key,
    key: t.key,
    name: t.label,
    values: [...t.values]
  }));
}
c(fh, "getSceneCriteriaCategories");
function mh(n) {
  const e = Array.isArray(n) ? n : [], t = [];
  for (const i of e) {
    if (typeof i != "string") continue;
    const r = i.trim();
    !r || t.includes(r) || t.push(r);
  }
  return t.length || t.push(Va), t;
}
c(mh, "sanitizeCriterionValues");
function fl(n) {
  return String(n ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
c(fl, "slugifyCriterionKey");
function Td(n, e) {
  if (!e.has(n)) return n;
  let t = 2;
  for (; e.has(`${n}-${t}`); )
    t += 1;
  return `${n}-${t}`;
}
c(Td, "ensureUniqueCriterionKey");
function Ld() {
  var n;
  return (n = foundry == null ? void 0 : foundry.utils) != null && n.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 11);
}
c(Ld, "generateCriterionId");
function Id(n) {
  var e, t;
  console.error(`${Te} | Failed to persist scene criteria`, n), (t = (e = ui.notifications) == null ? void 0 : e.error) == null || t.call(
    e,
    E(
      "EIDOLON.SceneCriteria.PersistError",
      "Failed to persist the scene criteria."
    )
  );
}
c(Id, "notifyPersistError");
var Ru, ge, cn, De, Od, Do, Po, Ro, Ho, Ca, qo, $r, Fr, fr, Ad;
const an = class an extends Gn(zn) {
  constructor(t = {}) {
    const { scene: i, criterion: r, isNew: a, onSave: o, ...s } = t ?? {};
    super(s);
    k(this, De);
    k(this, ge, null);
    k(this, cn, !1);
    k(this, Do, /* @__PURE__ */ c(async (t) => {
      t.preventDefault();
      const i = t.currentTarget;
      if (!(i instanceof HTMLFormElement)) return;
      const r = new FormData(i), a = String(r.get("criterionLabel") ?? "").trim(), o = String(r.get("criterionKey") ?? "").trim(), s = Array.from(i.querySelectorAll('[name="criterionValues"]')).map((m) => m instanceof HTMLInputElement ? m.value.trim() : "").filter((m, f, g) => m && g.indexOf(m) === f), u = String(r.get("criterionDefault") ?? "").trim() || s[0] || "Standard", d = dl(
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
      d && (L(this, ge, d), await S(this, De, Ad).call(this), this.close());
    }, "#onSubmit"));
    k(this, Po, /* @__PURE__ */ c((t) => {
      var o;
      if (h(this, cn)) return;
      const i = t.currentTarget, r = (i == null ? void 0 : i.form) ?? ((o = this.element) == null ? void 0 : o.querySelector("form"));
      if (!(r instanceof HTMLFormElement)) return;
      const a = r.querySelector('input[name="criterionKey"]');
      a instanceof HTMLInputElement && (a.value = sr(i.value));
    }, "#onLabelInput"));
    k(this, Ro, /* @__PURE__ */ c((t) => {
      var l;
      const i = t.currentTarget, r = (i == null ? void 0 : i.form) ?? ((l = this.element) == null ? void 0 : l.querySelector("form"));
      if (!(r instanceof HTMLFormElement) || !(i instanceof HTMLInputElement)) return;
      const a = r.querySelector('input[name="criterionLabel"]'), o = sr(a instanceof HTMLInputElement ? a.value : ""), s = sr(i.value);
      L(this, cn, s !== o), i.value = s, S(this, De, Ca).call(this, r);
    }, "#onKeyInput"));
    k(this, Ho, /* @__PURE__ */ c((t) => {
      var o, s;
      t.preventDefault();
      const i = ((o = t.currentTarget) == null ? void 0 : o.form) ?? ((s = this.element) == null ? void 0 : s.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector('input[name="criterionLabel"]'), a = i.querySelector('input[name="criterionKey"]');
      a instanceof HTMLInputElement && (a.value = sr(r instanceof HTMLInputElement ? r.value : ""), L(this, cn, !1), S(this, De, Ca).call(this, i));
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
      const o = xt(E("EIDOLON.SceneCriteria.ValuePlaceholder", "Allowed value")), s = xt(E("EIDOLON.SceneCriteria.RemoveValue", "Remove Value"));
      a.innerHTML = `
      <input type="text" name="criterionValues" value="" placeholder="${o}" class="form-control">
      <button type="button" class="icon" data-action="remove-value" aria-label="${s}" title="${s}">
        <i class="fa-solid fa-trash"></i>
      </button>
    `, r.appendChild(a), (m = a.querySelector('[data-action="remove-value"]')) == null || m.addEventListener("click", h(this, $r)), (f = a.querySelector('input[name="criterionValues"]')) == null || f.addEventListener("input", h(this, Fr)), S(this, De, fr).call(this, i), (g = a.querySelector('input[name="criterionValues"]')) == null || g.focus();
    }, "#onAddValue"));
    k(this, $r, /* @__PURE__ */ c((t) => {
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
        S(this, De, fr).call(this, i);
      }
    }, "#onRemoveValue"));
    k(this, Fr, /* @__PURE__ */ c((t) => {
      var r, a;
      const i = ((r = t.currentTarget) == null ? void 0 : r.form) ?? ((a = this.element) == null ? void 0 : a.querySelector("form"));
      i instanceof HTMLFormElement && S(this, De, fr).call(this, i);
    }, "#onValuesChanged"));
    this.scene = i ?? null, this.criterion = r ?? null, this.onSave = typeof o == "function" ? o : null, this.isNew = !!a, L(this, ge, S(this, De, Od).call(this)), L(this, cn, h(this, ge).key !== sr(h(this, ge).label));
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
      keyIsCustom: h(this, cn)
    };
  }
  _onRender(t, i) {
    var a, o, s, l, u, d;
    super._onRender(t, i);
    const r = (a = this.element) == null ? void 0 : a.querySelector("form");
    r && (r.addEventListener("submit", h(this, Do)), (o = r.querySelector('[data-action="add-value"]')) == null || o.addEventListener("click", h(this, qo)), (s = r.querySelector('input[name="criterionLabel"]')) == null || s.addEventListener("input", h(this, Po)), (l = r.querySelector('input[name="criterionKey"]')) == null || l.addEventListener("input", h(this, Ro)), (u = r.querySelector('[data-action="reset-auto-key"]')) == null || u.addEventListener("click", h(this, Ho)), r.querySelectorAll('[data-action="remove-value"]').forEach((m) => {
      m.addEventListener("click", h(this, $r));
    }), r.querySelectorAll('input[name="criterionValues"]').forEach((m) => {
      m.addEventListener("input", h(this, Fr));
    }), (d = r.querySelector('[data-action="cancel"]')) == null || d.addEventListener("click", (m) => {
      m.preventDefault(), this.close();
    }), S(this, De, Ca).call(this, r), S(this, De, fr).call(this, r));
  }
};
ge = new WeakMap(), cn = new WeakMap(), De = new WeakSet(), Od = /* @__PURE__ */ c(function() {
  const t = dl(this.criterion, 0, /* @__PURE__ */ new Set()) ?? cc(E("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion"));
  return {
    id: t.id,
    key: t.key,
    label: t.label ?? "",
    values: Array.isArray(t.values) ? [...t.values] : [],
    default: t.default
  };
}, "#initializeState"), Do = new WeakMap(), Po = new WeakMap(), Ro = new WeakMap(), Ho = new WeakMap(), Ca = /* @__PURE__ */ c(function(t) {
  const i = t.querySelector('[data-action="reset-auto-key"]');
  i instanceof HTMLButtonElement && (i.disabled = !h(this, cn));
}, "#syncAutoKeyButton"), qo = new WeakMap(), $r = new WeakMap(), Fr = new WeakMap(), fr = /* @__PURE__ */ c(function(t) {
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
}, "#syncDefaultOptions"), Ad = /* @__PURE__ */ c(async function() {
  if (!this.scene) return;
  const t = pt(this.scene).sort((r, a) => r.order - a.order), i = t.findIndex((r) => r.id === h(this, ge).id);
  i < 0 ? (h(this, ge).order = t.length, t.push(h(this, ge))) : (h(this, ge).order = t[i].order, t.splice(i, 1, h(this, ge)));
  try {
    await Yo(this.scene, t), this.onSave && await this.onSave(h(this, ge));
  } catch (r) {
    Id(r);
  }
}, "#persist"), c(an, "CategoryEditorApplication"), ye(an, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Re(an, an, "DEFAULT_OPTIONS"),
  {
    id: `${Te}-criterion-editor`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Ru = Re(an, an, "DEFAULT_OPTIONS")) == null ? void 0 : Ru.classes) ?? [], "standard-form", "themed"])
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
let ml = an;
function sr(n) {
  return String(n ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
c(sr, "slugifyKey");
const hh = `modules/${Te}/templates/scene-criteria-tab.html`, hl = {
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
}, gh = Go(ml), ph = vd({
  tabId: "criteria",
  tabLabel: /* @__PURE__ */ c(() => E("EIDOLON.SceneCriteria.TabLabel", "Criteria"), "tabLabel"),
  getScene: Jt,
  isApplicable: /* @__PURE__ */ c(() => Wo(), "isApplicable"),
  renderContent: /* @__PURE__ */ c(({ app: n, tab: e, scene: t }) => bh(n, e, t), "renderContent"),
  logger: hl
});
function yh() {
  return ph.register();
}
c(yh, "registerSceneCriteriaConfigHook");
function bh(n, e, t) {
  if (!(e instanceof HTMLElement)) return;
  const i = Ke(t) ? t : Jt(n);
  _i(n, e, i);
}
c(bh, "renderCriteriaTab");
async function _i(n, e, t) {
  var r, a;
  const i = t ?? Jt(n);
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
    const o = pt(i).sort((d, m) => d.order - m.order), s = Qr(i, o), l = ((a = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : a.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof l != "function") {
      e.innerHTML = `<p class="notes">${E("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
      return;
    }
    const u = await l(hh, {
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
          valueCountLabel: wh(d.values.length),
          canMoveUp: m > 0,
          canMoveDown: m < o.length - 1
        };
      }),
      hasCriteria: o.length > 0
    });
    e.innerHTML = u, vh(n, e, i);
  } catch (o) {
    console.error(`${Te} | Failed to render criteria tab`, o), e.innerHTML = `<p class="notes">${E("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
  } finally {
    hl.groupEnd();
  }
}
c(_i, "renderCriteriaTabContent");
function vh(n, e, t) {
  const i = t ?? Jt(n);
  if (!Ke(i)) return;
  const r = e.querySelector('[data-criteria-action="add"]');
  r && r.addEventListener("click", () => {
    Yc(n, {
      scene: i,
      criterion: cc(
        E("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion")
      ),
      isNew: !0,
      onSave: /* @__PURE__ */ c(() => _i(n, e, i), "onSave")
    });
  }), e.querySelectorAll('[data-criteria-action="edit"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", () => {
      const s = pt(i).find((l) => l.id === o);
      s && Yc(n, {
        scene: i,
        criterion: s,
        onSave: /* @__PURE__ */ c(() => _i(n, e, i), "onSave")
      });
    });
  }), e.querySelectorAll('[data-criteria-action="remove"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await ys(i, (l) => {
        const u = l.findIndex((d) => d.id === o);
        return u < 0 ? !1 : (l.splice(u, 1), bs(l), !0);
      }) && await _i(n, e, i);
    });
  }), e.querySelectorAll('[data-criteria-action="move-up"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await ys(i, (l) => {
        const u = l.findIndex((m) => m.id === o);
        if (u <= 0) return !1;
        const [d] = l.splice(u, 1);
        return l.splice(u - 1, 0, d), bs(l), !0;
      }) && await _i(n, e, i);
    });
  }), e.querySelectorAll('[data-criteria-action="move-down"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await ys(i, (l) => {
        const u = l.findIndex((m) => m.id === o);
        if (u < 0 || u >= l.length - 1) return !1;
        const [d] = l.splice(u, 1);
        return l.splice(u + 1, 0, d), bs(l), !0;
      }) && await _i(n, e, i);
    });
  });
}
c(vh, "bindCriteriaTabEvents");
async function ys(n, e) {
  const t = pt(n).sort((r, a) => r.order - a.order);
  if (e(t) === !1) return !1;
  try {
    return await Yo(n, t), !0;
  } catch (r) {
    return Id(r), !1;
  }
}
c(ys, "mutateCriteria");
function Yc(n, e = {}) {
  const t = e.scene ?? null, i = t && Ke(t) ? t : Jt(n);
  if (!Ke(i))
    return;
  gh({
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
function wh(n) {
  var e, t;
  if ((t = (e = game.i18n) == null ? void 0 : e.has) != null && t.call(e, "EIDOLON.SceneCriteria.ValueCountLabel"))
    try {
      return game.i18n.format("EIDOLON.SceneCriteria.ValueCountLabel", { count: n });
    } catch (i) {
      console.error(`${Te} | Failed to format value count label`, i);
    }
  return n === 0 ? "No values configured" : n === 1 ? "1 value" : `${n} values`;
}
c(wh, "formatValueCount");
let Kc = !1;
function Eh() {
  Hooks.once("init", () => {
    ch();
  }), Hooks.once("ready", () => {
    Wo() && (Kc || (yh(), Kc = !0));
  });
}
c(Eh, "registerSceneCriteriaHooks");
Eh();
const ie = T, kd = "criteriaEngineVersion", pi = "fileIndex", yi = "tileCriteria", dc = {
  LEGACY: 1,
  CRITERIA: 2
}, Md = dc.CRITERIA;
function _d(n) {
  var e;
  return ((e = n == null ? void 0 : n.getFlag) == null ? void 0 : e.call(n, ie, kd)) ?? dc.LEGACY;
}
c(_d, "getSceneEngineVersion");
function Sh(n, e, t, i, r) {
  if (!(n != null && n.length) || !(t != null && t.length)) return -1;
  const a = {};
  for (const s of t)
    a[s] = e[s];
  const o = Jc(n, a, t);
  if (o >= 0) return o;
  if (i != null && i.length && r) {
    const s = { ...a };
    for (const l of i) {
      if (!(l in s)) continue;
      s[l] = r[l] ?? "Standard";
      const u = Jc(n, s, t);
      if (u >= 0) return u;
    }
  }
  return -1;
}
c(Sh, "findBestMatch");
function Jc(n, e, t) {
  return n.findIndex((i) => {
    for (const r of t)
      if (i[r] !== e[r]) return !1;
    return !0;
  });
}
c(Jc, "findExactMatch");
function Ch(n, e) {
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
c(Ch, "findFileIndex");
function Ta(n) {
  return n && typeof n == "object" && !Array.isArray(n);
}
c(Ta, "isPlainObject$2");
function Xc(n) {
  return n == null ? n : typeof structuredClone == "function" ? structuredClone(n) : JSON.parse(JSON.stringify(n));
}
c(Xc, "deepClone");
function Th(n, e) {
  if (!e) return;
  const t = e.split(".").filter(Boolean);
  if (!t.length) return;
  let i = n;
  for (let r = 0; r < t.length - 1; r += 1) {
    if (!Ta(i == null ? void 0 : i[t[r]])) return;
    i = i[t[r]];
  }
  delete i[t.at(-1)];
}
c(Th, "deletePath");
function Nd(n, e) {
  const t = Xc(n ?? {});
  if (!Ta(e)) return t;
  for (const [i, r] of Object.entries(e)) {
    if (i.startsWith("-=") && r === !0) {
      Th(t, i.slice(2));
      continue;
    }
    Ta(r) && Ta(t[i]) ? t[i] = Nd(t[i], r) : t[i] = Xc(r);
  }
  return t;
}
c(Nd, "fallbackMerge");
function Lh(n, e) {
  var t, i;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.mergeObject && ((i = foundry == null ? void 0 : foundry.utils) != null && i.deepClone) ? foundry.utils.mergeObject(n, foundry.utils.deepClone(e), {
    inplace: !1
  }) : Nd(n, e);
}
c(Lh, "defaultMerge");
function Ih(n, e) {
  if (!n) return !0;
  for (const t of Object.keys(n))
    if (n[t] !== e[t]) return !1;
  return !0;
}
c(Ih, "criteriaMatch");
function xd(n, e, t, i) {
  const r = i ?? Lh;
  let a = r({}, n ?? {});
  if (!(e != null && e.length)) return a;
  const o = [];
  for (let s = 0; s < e.length; s += 1) {
    const l = e[s];
    if (Ih(l == null ? void 0 : l.criteria, t)) {
      const u = l != null && l.criteria ? Object.keys(l.criteria).length : 0;
      o.push({ specificity: u, index: s, delta: l == null ? void 0 : l.delta });
    }
  }
  o.sort((s, l) => s.specificity - l.specificity || s.index - l.index);
  for (const s of o)
    s.delta && (a = r(a, s.delta));
  return a;
}
c(xd, "resolveRules");
function Ko(n = null) {
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
c(Ko, "canManageCriteria");
function Oh(n = null) {
  if (!Ko(n))
    throw new Error(`${ie} | You do not have permission to manage scene criteria.`);
}
c(Oh, "requireCriteriaAccess");
const Ah = /* @__PURE__ */ c((...n) => console.log(`${ie} | criteria tiles:`, ...n), "log$1");
let za = /* @__PURE__ */ new WeakMap(), Ga = /* @__PURE__ */ new WeakMap();
const Qc = 200;
function kh(n) {
  return n ? Number.isInteger(n.size) ? n.size : Array.isArray(n) || typeof n.length == "number" ? n.length : Array.from(n).length : 0;
}
c(kh, "getCollectionSize$1");
function la() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
c(la, "nowMs$2");
function Mh(n) {
  if (!Array.isArray(n)) return [];
  const e = /* @__PURE__ */ new Set();
  for (const t of n) {
    if (typeof t != "string") continue;
    const i = t.trim();
    i && e.add(i);
  }
  return Array.from(e);
}
c(Mh, "uniqueStringKeys$1");
function _h(n, e = Qc) {
  if (!Array.isArray(n) || n.length === 0) return [];
  const t = Number.isInteger(e) && e > 0 ? e : Qc, i = [];
  for (let r = 0; r < n.length; r += t)
    i.push(n.slice(r, r + t));
  return i;
}
c(_h, "chunkArray$1");
async function Nh(n, e, t) {
  const i = _h(e, t);
  for (const r of i)
    await n.updateEmbeddedDocuments("Tile", r), i.length > 1 && await Promise.resolve();
  return i.length;
}
c(Nh, "updateTilesInChunks");
function xh(n) {
  var i;
  const e = Si(n, { files: null });
  if (!((i = e == null ? void 0 : e.variants) != null && i.length)) return [];
  const t = /* @__PURE__ */ new Set();
  for (const r of e.variants)
    for (const a of Object.keys(r.criteria ?? {}))
      a && t.add(a);
  return Array.from(t);
}
c(xh, "getTileCriteriaDependencyKeys");
function $h(n, e) {
  const t = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
  for (const r of e) {
    const a = r.getFlag(ie, yi) ?? r.getFlag(ie, pi);
    if (a) {
      i.add(r.id);
      for (const o of xh(a))
        t.has(o) || t.set(o, /* @__PURE__ */ new Set()), t.get(o).add(r.id);
    }
  }
  return {
    collection: e,
    keyToTileIds: t,
    allTileIds: i
  };
}
c($h, "buildTileDependencyIndex");
function Fh(n, e) {
  const t = Ga.get(n);
  if ((t == null ? void 0 : t.collection) === e) return t;
  const i = $h(n, e);
  return Ga.set(n, i), i;
}
c(Fh, "getTileDependencyIndex");
function Dh(n, e, t) {
  const i = Mh(t);
  if (!i.length)
    return Array.from(e ?? []);
  const r = Fh(n, e), a = /* @__PURE__ */ new Set();
  for (const o of i) {
    const s = r.keyToTileIds.get(o);
    if (s)
      for (const l of s)
        a.add(l);
  }
  return a.size ? typeof (e == null ? void 0 : e.get) == "function" ? Array.from(a).map((o) => e.get(o)).filter(Boolean) : Array.from(e ?? []).filter((o) => a.has(o.id)) : [];
}
c(Dh, "getTilesForChangedKeys");
function $d(n) {
  return typeof (n == null ? void 0 : n.name) == "string" ? n.name : typeof (n == null ? void 0 : n.src) == "string" ? n.src : "";
}
c($d, "getFilePath");
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
function fc(n) {
  if (!Array.isArray(n)) return [];
  const e = /* @__PURE__ */ new Map();
  return n.map((t, i) => {
    const r = Wa($d(t)), a = r || `__index:${i}`, o = e.get(a) ?? 0;
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
function qn(n, e) {
  if (!Number.isInteger(e) || e < 0) return null;
  const i = fc(n).find((r) => r.index === e);
  return i ? { ...i.target } : { indexHint: e };
}
c(qn, "createTileTargetFromIndex");
function Jo(n) {
  if (!n || typeof n != "object") return null;
  const e = Wa(n.path), t = Number(n.indexHint ?? n.fileIndex), i = Number(n.occurrence), r = {};
  return e && (r.path = e, r.occurrence = Number.isInteger(i) && i >= 0 ? i : 0), Number.isInteger(t) && t >= 0 && (r.indexHint = t), !r.path && !Number.isInteger(r.indexHint) ? null : r;
}
c(Jo, "normalizeTileTarget");
function Or(n, e) {
  const t = Jo(n);
  if (!t) return -1;
  const i = fc(e);
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
c(Or, "resolveTileTargetIndex");
function jn(n) {
  if (!n || typeof n != "object" || Array.isArray(n)) return {};
  const e = {};
  for (const [t, i] of Object.entries(n))
    typeof t != "string" || !t || typeof i != "string" || !i.trim() || (e[t] = i.trim());
  return e;
}
c(jn, "sanitizeCriteria");
function Ph(n) {
  return Object.entries(jn(n)).sort(([t], [i]) => t.localeCompare(i)).map(([t, i]) => `${t}=${i}`).join("");
}
c(Ph, "serializeCriteria");
function Rh(n) {
  return Object.keys(jn(n)).length;
}
c(Rh, "getCriteriaSpecificity");
function Hh(n, e) {
  const t = jn(n), i = jn(e);
  for (const [r, a] of Object.entries(t))
    if (r in i && i[r] !== a)
      return !1;
  return !0;
}
c(Hh, "areCriteriaCompatible");
function qh(n, e) {
  const t = Or(n, e);
  if (Number.isInteger(t) && t >= 0)
    return `index:${t}`;
  const i = Jo(n);
  if (!i) return "";
  if (i.path) {
    const r = Number.isInteger(i.occurrence) ? i.occurrence : 0;
    return `path:${i.path}#${r}`;
  }
  return Number.isInteger(i.indexHint) ? `hint:${i.indexHint}` : "";
}
c(qh, "getTargetIdentity");
function Fd(n, e = {}) {
  var s;
  const t = Array.isArray(e.files) ? e.files : [], i = Si(n, { files: t });
  if (!((s = i == null ? void 0 : i.variants) != null && s.length))
    return {
      errors: [],
      warnings: []
    };
  const r = i.variants.map((l, u) => ({
    index: u,
    criteria: jn(l.criteria),
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
c(Fd, "detectTileCriteriaConflicts");
function jh(n, e) {
  if (!n || typeof n != "object") return null;
  let t = Jo(n.target);
  if (!t) {
    const i = Number(n.fileIndex);
    Number.isInteger(i) && i >= 0 && (t = qn(e, i));
  }
  return t ? {
    criteria: jn(n.criteria),
    target: t
  } : null;
}
c(jh, "normalizeTileVariant");
function Dd(n, e = {}) {
  if (!Array.isArray(n) || n.length === 0) return null;
  const t = Array.isArray(e.files) ? e.files : null, i = n.map((l, u) => ({
    criteria: jn(l),
    target: qn(t, u)
  })).filter((l) => l.target);
  if (!i.length) return null;
  const r = i.find((l) => Object.keys(l.criteria).length === 0), a = (r == null ? void 0 : r.target) ?? i[0].target;
  let o = null;
  const s = Number(e.defaultFileIndex);
  return Number.isInteger(s) && s >= 0 && (o = qn(t, s)), o || (o = a), {
    strategy: "select-one",
    variants: i,
    defaultTarget: o
  };
}
c(Dd, "buildTileCriteriaFromFileIndex");
function Si(n, e = {}) {
  const t = Array.isArray(e.files) ? e.files : null;
  if (Array.isArray(n))
    return Dd(n, { files: t });
  if (!n || typeof n != "object") return null;
  const i = Array.isArray(n.variants) ? n.variants.map((a) => jh(a, t)).filter(Boolean) : [];
  if (!i.length) return null;
  let r = Jo(n.defaultTarget);
  if (!r) {
    const a = Number(n.defaultFileIndex);
    Number.isInteger(a) && a >= 0 && (r = qn(t, a));
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
function Bh(n, e) {
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
c(Bh, "selectTileFileIndexFromCompiled");
function Uh(n, e) {
  const t = Si(n, { files: e });
  if (!t) return null;
  const i = t.variants.map((a) => {
    const o = jn(a.criteria), s = Or(a.target, e);
    return !Number.isInteger(s) || s < 0 ? null : {
      criteria: o,
      keys: Object.keys(o),
      targetIndex: s
    };
  }).filter(Boolean), r = Or(t.defaultTarget, e);
  return !i.length && (!Number.isInteger(r) || r < 0) ? null : {
    variants: i,
    defaultIndex: r
  };
}
c(Uh, "compileTileMatcher");
function Vh(n, e, t) {
  const i = za.get(n);
  if (i && i.tileCriteria === e && i.files === t)
    return i.compiled;
  const r = Uh(e, t);
  return za.set(n, {
    tileCriteria: e,
    files: t,
    compiled: r
  }), r;
}
c(Vh, "getCompiledTileMatcher");
function zh(n = null, e = null) {
  n ? Ga.delete(n) : Ga = /* @__PURE__ */ new WeakMap(), e ? za.delete(e) : n || (za = /* @__PURE__ */ new WeakMap());
}
c(zh, "invalidateTileCriteriaCaches");
async function Pd(n, e, t = {}) {
  var l, u, d, m;
  const i = la(), r = {
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
    return r.durationMs = la() - i, r;
  const a = e.getEmbeddedCollection("Tile") ?? [];
  r.total = kh(a);
  const o = Dh(e, a, t.changedKeys);
  if (r.scanned = o.length, !o.length)
    return r.skipped.unaffected = r.total, r.durationMs = la() - i, r;
  const s = [];
  for (const f of o) {
    const g = f.getFlag(ie, yi) ?? f.getFlag(ie, pi);
    if (!g) {
      r.skipped.noCriteria += 1;
      continue;
    }
    const p = f.getFlag("monks-active-tiles", "files");
    if (!(p != null && p.length)) {
      r.skipped.noFiles += 1;
      continue;
    }
    const y = Vh(f, g, p), v = Bh(y, n);
    if (!Number.isInteger(v) || v < 0 || v >= p.length) {
      console.warn(`${ie} | Tile ${f.id} has no valid file match for state`, n), r.skipped.noMatch += 1;
      continue;
    }
    const b = v, C = Number(f.getFlag("monks-active-tiles", "fileindex")) !== b, I = p.some((D, P) => !!(D != null && D.selected) != (P === v)), A = Wa(((u = f.texture) == null ? void 0 : u.src) ?? ((m = (d = f._source) == null ? void 0 : d.texture) == null ? void 0 : m.src) ?? ""), O = $d(p[v]), M = Wa(O), $ = !!M && M !== A;
    if (!I && !C && !$) {
      r.skipped.unchanged += 1;
      continue;
    }
    const j = {
      _id: f._id
    };
    I && (j["flags.monks-active-tiles.files"] = p.map((D, P) => ({
      ...D,
      selected: P === v
    }))), C && (j["flags.monks-active-tiles.fileindex"] = b), $ && (j.texture = { src: O }), s.push(j), Ah(`Tile ${f.id} -> ${O}`);
  }
  return s.length > 0 && (r.chunks = await Nh(e, s, t.chunkSize), r.updated = s.length), r.durationMs = la() - i, r;
}
c(Pd, "updateTiles");
function Gh() {
  if (!globalThis.Tagger) return [];
  const n = ["Checkbox", "Tile", "Settings", "Toggleable Lights"], e = [
    "Checkbox",
    "Tile",
    "Settings",
    "Toggleable Lights",
    "Checked",
    "Unchecked",
    "Individual"
  ], t = Tagger.getByTag(n) ?? [], i = [];
  for (const r of t) {
    if (r.getFlag("monks-active-tiles", "variables.state") !== "unchecked") continue;
    const a = (Tagger.getTags(r) ?? []).filter((l) => !e.includes(l)), o = (Tagger.getByTag("Disable Automation") ?? []).concat(Tagger.getByTag("Settings") ?? []), s = Tagger.getByTag(a, { ignore: o }) ?? [];
    for (const l of s)
      l != null && l._id && i.push(l._id);
  }
  return i;
}
c(Gh, "buildLightControlsMap");
const bi = T, Bi = "lightCriteria", mc = Object.freeze({
  base: null,
  mappings: [],
  current: null
});
function vs(n) {
  return n && typeof n == "object" && !Array.isArray(n);
}
c(vs, "isPlainObject$1");
function Rd(n, e) {
  if (!vs(e)) return {};
  const t = {};
  for (const [i, r] of Object.entries(e)) {
    const a = n == null ? void 0 : n[i];
    if (vs(r) && vs(a)) {
      const o = Rd(a, r);
      Object.keys(o).length > 0 && (t[i] = o);
    } else r !== a && (t[i] = Yt(r));
  }
  return t;
}
c(Rd, "computeDelta");
function Hd(n) {
  var t;
  const e = ((t = n == null ? void 0 : n.getFlag) == null ? void 0 : t.call(n, bi, Bi)) ?? mc;
  return Ar(e);
}
c(Hd, "getLightCriteriaState");
async function qd(n, e) {
  const t = Ar(e);
  if (!(n != null && n.setFlag))
    return t;
  const i = t.base !== null, r = t.mappings.length > 0, a = t.current !== null;
  return !i && !r && !a ? (typeof n.unsetFlag == "function" ? await n.unsetFlag(bi, Bi) : await n.setFlag(bi, Bi, null), mc) : (await n.setFlag(bi, Bi, t), t);
}
c(qd, "setLightCriteriaState");
async function Zr(n, e) {
  if (typeof e != "function")
    throw new TypeError("updateLightCriteriaState requires an updater function.");
  const t = Yt(Hd(n)), i = await e(t);
  return qd(n, i);
}
c(Zr, "updateLightCriteriaState");
async function Zc(n, e) {
  const t = Ci(e);
  if (!t)
    throw new Error("Invalid light configuration payload.");
  return Zr(n, (i) => ({
    ...i,
    base: t
  }));
}
c(Zc, "storeBaseLighting");
async function eu(n, e, t, { label: i } = {}) {
  const r = ea(e);
  if (!r)
    throw new Error("Cannot create a mapping without at least one category selection.");
  const a = Ci(t);
  if (!a)
    throw new Error("Invalid light configuration payload.");
  return Zr(n, (o) => {
    const s = tr(r), l = Array.isArray(o == null ? void 0 : o.mappings) ? [...o.mappings] : [], u = l.findIndex((g) => (g == null ? void 0 : g.key) === s), d = u >= 0 ? l[u] : null, m = typeof (d == null ? void 0 : d.id) == "string" && d.id.trim() ? d.id.trim() : Bd(), f = Xo({
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
c(eu, "upsertLightCriteriaMapping");
async function Wh(n, e, t, i, { replaceExisting: r = !1 } = {}) {
  const a = typeof e == "string" ? e.trim() : "";
  if (!a)
    throw new Error("A mapping id is required to retarget criteria.");
  const o = ea(t);
  if (!o)
    throw new Error("Cannot retarget mapping without at least one category selection.");
  const s = Ci(i);
  if (!s)
    throw new Error("Invalid light configuration payload.");
  return Zr(n, (l) => {
    const u = Array.isArray(l == null ? void 0 : l.mappings) ? [...l.mappings] : [], d = u.findIndex((b) => (b == null ? void 0 : b.id) === a);
    if (d < 0)
      throw new Error("The selected mapping no longer exists.");
    const m = tr(o), f = u.findIndex(
      (b, w) => w !== d && (b == null ? void 0 : b.key) === m
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
c(Wh, "retargetLightCriteriaMapping");
async function Yh(n, e) {
  const t = typeof e == "string" ? e.trim() : "";
  if (!t)
    throw new Error("A mapping id is required to remove a mapping.");
  return Zr(n, (i) => {
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
c(Yh, "removeLightCriteriaMapping");
async function br(n, e) {
  const t = jd(e);
  return Zr(n, (i) => ({
    ...i,
    current: t
  }));
}
c(br, "storeCurrentCriteriaSelection");
function Kh(n) {
  const e = Ar(n), t = e.base ?? {}, i = [];
  for (const r of e.mappings) {
    const a = ea(r == null ? void 0 : r.categories);
    if (!a) continue;
    const o = Rd(t, (r == null ? void 0 : r.config) ?? {});
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
function Jh(n, e = []) {
  const t = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
  for (const l of e)
    typeof (l == null ? void 0 : l.key) == "string" && l.key.trim() && i.add(l.key.trim()), typeof (l == null ? void 0 : l.id) == "string" && l.id.trim() && typeof (l == null ? void 0 : l.key) == "string" && t.set(l.id.trim(), l.key.trim());
  const r = Ar(n), a = /* @__PURE__ */ c((l) => {
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
      key: tr(u)
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
  return Ar({
    ...r,
    mappings: o,
    current: s
  });
}
c(Jh, "migrateLightCriteriaCategoriesToKeys");
function Ar(n) {
  var l;
  const e = Yt(n);
  if (!e || typeof e != "object")
    return Yt(mc);
  const t = Ci(e.base), i = Array.isArray(e.mappings) ? e.mappings : [], r = /* @__PURE__ */ new Map();
  for (const u of i) {
    const d = Xo(u);
    d && r.set(d.key, d);
  }
  const a = Array.from(r.values()), o = new Map(a.map((u) => [u.id, u]));
  let s = jd(e.current);
  if (s) {
    const u = s.categories && Object.keys(s.categories).length > 0;
    if (s.mappingId && !o.has(s.mappingId)) {
      const d = u ? ((l = a.find((m) => m.key === tr(s.categories))) == null ? void 0 : l.id) ?? null : null;
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
c(Ar, "sanitizeLightCriteriaState");
function Ci(n) {
  const e = Yt(n);
  if (!e || typeof e != "object") return null;
  "_id" in e && delete e._id, "id" in e && delete e.id;
  const t = e.flags;
  if (t && typeof t == "object") {
    const i = t[bi];
    i && typeof i == "object" && (delete i[Bi], Object.keys(i).length === 0 && delete t[bi]), Object.keys(t).length === 0 && delete e.flags;
  }
  return e;
}
c(Ci, "sanitizeLightConfigPayload");
function Xo(n) {
  if (!n || typeof n != "object") return null;
  const e = ea(n.categories);
  if (!e) return null;
  const t = Ci(n.config);
  if (!t) return null;
  const i = typeof n.id == "string" && n.id.trim() ? n.id.trim() : Bd(), r = tr(e), a = {
    id: i,
    key: r,
    categories: e,
    config: t,
    updatedAt: Number.isFinite(n.updatedAt) ? Number(n.updatedAt) : Date.now()
  };
  return typeof n.label == "string" && n.label.trim() && (a.label = n.label.trim()), a;
}
c(Xo, "sanitizeCriteriaMappingEntry");
function jd(n) {
  if (!n || typeof n != "object") return null;
  const e = typeof n.mappingId == "string" && n.mappingId.trim() ? n.mappingId.trim() : null, t = ea(n.categories);
  return !e && !t ? null : {
    mappingId: e,
    categories: t,
    updatedAt: Number.isFinite(n.updatedAt) ? Number(n.updatedAt) : Date.now()
  };
}
c(jd, "sanitizeCurrentSelection");
function ea(n) {
  const e = {};
  if (Array.isArray(n))
    for (const t of n) {
      const i = tu((t == null ? void 0 : t.id) ?? (t == null ? void 0 : t.categoryId) ?? (t == null ? void 0 : t.category)), r = nu((t == null ? void 0 : t.value) ?? (t == null ? void 0 : t.selection) ?? (t == null ? void 0 : t.label));
      !i || !r || (e[i] = r);
    }
  else if (n && typeof n == "object")
    for (const [t, i] of Object.entries(n)) {
      const r = tu(t), a = nu(i);
      !r || !a || (e[r] = a);
    }
  return Object.keys(e).length > 0 ? e : null;
}
c(ea, "sanitizeCriteriaCategories");
function tr(n) {
  if (!n || typeof n != "object") return "";
  const e = Object.entries(n).filter(([, t]) => typeof t == "string" && t).map(([t, i]) => `${t}:${i}`);
  return e.sort((t, i) => t < i ? -1 : t > i ? 1 : 0), e.join("|");
}
c(tr, "computeCriteriaMappingKey");
function Bd() {
  var n;
  return (n = foundry == null ? void 0 : foundry.utils) != null && n.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
c(Bd, "generateLightMappingId");
function tu(n) {
  if (typeof n != "string") return null;
  const e = n.trim();
  return e || null;
}
c(tu, "normalizeCategoryId");
function nu(n) {
  if (typeof n != "string") return null;
  const e = n.trim();
  return e || null;
}
c(nu, "normalizeCategoryValue");
const Ya = ["AmbientLight", "Wall", "AmbientSound"];
let Ka = /* @__PURE__ */ new WeakMap(), Ja = /* @__PURE__ */ new WeakMap();
const iu = 200;
function Xh(n) {
  return n ? Number.isInteger(n.size) ? n.size : Array.isArray(n) || typeof n.length == "number" ? n.length : Array.from(n).length : 0;
}
c(Xh, "getCollectionSize");
function ws() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
c(ws, "nowMs$1");
function Qh(n) {
  if (!Array.isArray(n)) return [];
  const e = /* @__PURE__ */ new Set();
  for (const t of n) {
    if (typeof t != "string") continue;
    const i = t.trim();
    i && e.add(i);
  }
  return Array.from(e);
}
c(Qh, "uniqueStringKeys");
function Zh(n, e = iu) {
  if (!Array.isArray(n) || n.length === 0) return [];
  const t = Number.isInteger(e) && e > 0 ? e : iu, i = [];
  for (let r = 0; r < n.length; r += t)
    i.push(n.slice(r, r + t));
  return i;
}
c(Zh, "chunkArray");
async function eg(n, e, t, i) {
  const r = Zh(t, i);
  for (const a of r)
    await n.updateEmbeddedDocuments(e, a), r.length > 1 && await Promise.resolve();
  return r.length;
}
c(eg, "updatePlaceablesInChunks");
function tg(n) {
  const e = /* @__PURE__ */ new Set();
  for (const t of (n == null ? void 0 : n.rules) ?? [])
    for (const i of Object.keys((t == null ? void 0 : t.criteria) ?? {}))
      i && e.add(i);
  return Array.from(e);
}
c(tg, "getPresetDependencyKeys");
function ng(n, e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of Ya) {
    const r = e.get(i) ?? [], a = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Map();
    for (const s of r) {
      const l = Vd(s, i);
      if (l != null && l.base) {
        a.add(s.id);
        for (const u of tg(l))
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
c(ng, "buildPlaceableDependencyIndex");
function ig(n, e) {
  const t = Ja.get(n);
  if (t && Ya.every((r) => t.collectionsByType.get(r) === e.get(r)))
    return t;
  const i = ng(n, e);
  return Ja.set(n, i), i;
}
c(ig, "getPlaceableDependencyIndex");
function rg(n, e, t) {
  if (!e || !n) return [];
  const i = Qh(t);
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
c(rg, "getDocsForChangedKeys");
function Fi(n) {
  return !!n && typeof n == "object" && !Array.isArray(n);
}
c(Fi, "isPlainObject");
function gl(n, e) {
  if (Object.is(n, e)) return !0;
  if (Array.isArray(n) || Array.isArray(e)) {
    if (!Array.isArray(n) || !Array.isArray(e) || n.length !== e.length) return !1;
    for (let t = 0; t < n.length; t += 1)
      if (!gl(n[t], e[t])) return !1;
    return !0;
  }
  if (Fi(n) || Fi(e)) {
    if (!Fi(n) || !Fi(e)) return !1;
    const t = Object.keys(e);
    for (const i of t)
      if (!gl(n[i], e[i])) return !1;
    return !0;
  }
  return !1;
}
c(gl, "areValuesEqual");
function Ud(n, e) {
  const t = { _id: e._id };
  for (const [r, a] of Object.entries(e)) {
    if (r === "_id") continue;
    const o = n == null ? void 0 : n[r];
    if (Fi(a) && Fi(o)) {
      const s = Ud(o, { _id: e._id, ...a });
      if (!s) continue;
      const l = Object.keys(s).filter((u) => u !== "_id");
      if (l.length > 0) {
        t[r] = {};
        for (const u of l)
          t[r][u] = s[u];
      }
      continue;
    }
    gl(o, a) || (t[r] = a);
  }
  return Object.keys(t).filter((r) => r !== "_id").length > 0 ? t : null;
}
c(Ud, "buildChangedPayload");
function Vd(n, e) {
  var s;
  const t = ((s = n == null ? void 0 : n.flags) == null ? void 0 : s[ie]) ?? {}, i = (t == null ? void 0 : t.presets) ?? null, r = e === "AmbientLight" ? (t == null ? void 0 : t.lightCriteria) ?? null : null, a = Ka.get(n);
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
c(Vd, "getPresetsForDocument");
function ag(n = null, e = null) {
  n ? Ja.delete(n) : Ja = /* @__PURE__ */ new WeakMap(), e ? Ka.delete(e) : n || (Ka = /* @__PURE__ */ new WeakMap());
}
c(ag, "invalidatePlaceableCriteriaCaches");
async function zd(n, e, t = {}) {
  var l, u;
  const i = ws(), r = {
    total: 0,
    scanned: 0,
    updated: 0,
    chunks: 0,
    byType: {},
    durationMs: 0
  };
  if (e = e ?? ((l = game.scenes) == null ? void 0 : l.viewed), !e)
    return r.durationMs = ws() - i, r;
  const a = new Set(Gh()), o = new Map(
    Ya.map((d) => [d, e.getEmbeddedCollection(d) ?? []])
  ), s = ig(e, o);
  for (const d of Ya) {
    const m = o.get(d) ?? [], f = {
      total: Xh(m),
      scanned: 0,
      updated: 0,
      chunks: 0
    }, g = s.byType.get(d) ?? null, p = rg(m, g, t.changedKeys);
    if (f.scanned = p.length, r.total += f.total, r.scanned += f.scanned, r.byType[d] = f, !p.length) continue;
    const y = [];
    for (const v of p) {
      const b = Vd(v, d);
      if (!(b != null && b.base)) continue;
      const w = xd(b.base, b.rules ?? [], n);
      w._id = v._id, d === "AmbientLight" && a.has(v._id) && (w.hidden = !0);
      const C = (v == null ? void 0 : v._source) ?? ((u = v == null ? void 0 : v.toObject) == null ? void 0 : u.call(v)) ?? {}, I = Ud(C, w);
      I && y.push(I);
    }
    y.length > 0 && (f.chunks = await eg(e, d, y, t.chunkSize), f.updated = y.length, r.updated += y.length, r.chunks += f.chunks, console.log(`${ie} | Updated ${y.length} ${d}(s)`));
  }
  return r.durationMs = ws() - i, r;
}
c(zd, "updatePlaceables");
function Xa() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
c(Xa, "nowMs");
const ca = /* @__PURE__ */ new Map();
function og(n) {
  var e;
  return n = n ?? ((e = game.scenes) == null ? void 0 : e.viewed), n ? Qr(n) : null;
}
c(og, "getState");
async function sg(n, e, t = 0) {
  var g;
  const i = Xa();
  if (e = e ?? ((g = game.scenes) == null ? void 0 : g.viewed), !e) return null;
  Oh(e);
  const r = pt(e);
  if (!r.length)
    return console.warn(`${ie} | applyState skipped: scene has no criteria.`), null;
  const a = Qr(e, r), o = uc({ ...a, ...n ?? {} }, r), s = r.filter((p) => (a == null ? void 0 : a[p.key]) !== (o == null ? void 0 : o[p.key])).map((p) => p.key), l = s.length > 0;
  l && await dh(e, o, r);
  const u = l ? o : a, [d, m] = await Promise.all([
    Pd(u, e, { changedKeys: s }),
    zd(u, e, { changedKeys: s })
  ]), f = Xa() - i;
  return _("Criteria apply telemetry", {
    sceneId: e.id,
    changedKeys: s,
    didChange: l,
    queuedMs: t,
    durationMs: f,
    tiles: d,
    placeables: m
  }), Hooks.callAll("eidolon-utilities.criteriaStateApplied", e, u), u;
}
c(sg, "applyStateInternal");
async function Gd(n, e) {
  var l;
  if (e = e ?? ((l = game.scenes) == null ? void 0 : l.viewed), !e) return null;
  const t = e.id ?? "__viewed__", i = Xa(), r = ca.get(t) ?? Promise.resolve();
  let a = null;
  const o = r.catch(() => null).then(async () => {
    const u = Xa() - i;
    return sg(n, e, u);
  });
  a = o;
  const s = o.finally(() => {
    ca.get(t) === s && ca.delete(t);
  });
  return ca.set(t, s), a;
}
c(Gd, "applyState$1");
function lg(n) {
  var e;
  return n = n ?? ((e = game.scenes) == null ? void 0 : e.viewed), n ? _d(n) : null;
}
c(lg, "getVersion");
async function Wd(n, e) {
  var t;
  e = e ?? ((t = game.scenes) == null ? void 0 : t.viewed), e != null && e.setFlag && await e.setFlag(ie, kd, Number(n));
}
c(Wd, "setVersion");
async function cg(n) {
  return Wd(Md, n);
}
c(cg, "markCurrentVersion");
const mr = "Standard", ug = /* @__PURE__ */ c((...n) => console.log(`${ie} | criteria indexer:`, ...n), "log");
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
function dg(n, e, t = mr) {
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
c(dg, "buildFileIndex");
function fg(n, e) {
  return n.map((t, i) => {
    const r = [...e[t] ?? /* @__PURE__ */ new Set()].sort(), o = r.includes(mr) ? mr : r[0] ?? mr, s = cc(t);
    return s.key = t, s.label = t.charAt(0).toUpperCase() + t.slice(1), s.values = r.length ? r : [mr], s.default = s.values.includes(o) ? o : s.values[0], s.order = i, s;
  });
}
c(fg, "buildCriteriaDefinitions");
async function ua(n, e, t, { dryRun: i = !1 } = {}) {
  const r = n.getFlag("monks-active-tiles", "files");
  if (!(r != null && r.length)) return null;
  const a = dg(r, e), o = Dd(a, { files: r });
  for (const s of r) {
    const l = hc(s == null ? void 0 : s.name);
    if (l)
      for (const [u, d] of Object.entries(e)) {
        const m = l[Number(u)];
        m != null && t[d] && t[d].add(m);
      }
  }
  return i || (await n.setFlag(ie, yi, o), typeof n.unsetFlag == "function" && await n.unsetFlag(ie, pi)), { files: r.length };
}
c(ua, "indexTile");
async function mg(n, e = {}) {
  var w, C, I, A;
  const {
    dryRun: t = !1,
    force: i = !1
  } = e;
  if (n = n ?? ((w = game.scenes) == null ? void 0 : w.viewed), !n) throw new Error("No scene provided to indexScene.");
  if (!globalThis.Tagger) throw new Error("Tagger is required to index scene criteria.");
  if (!i && _d(n) >= Md)
    throw new Error(
      `Scene "${n.name}" is already criteria-indexed. Use force: true to re-index.`
    );
  const r = { sceneId: n.id }, a = Tagger.getByTag("Map", r) ?? [];
  if (!a.length) throw new Error("No Map tile found.");
  if (a.length > 1) throw new Error(`Expected 1 Map tile, found ${a.length}.`);
  const o = a[0], s = o.getFlag("monks-active-tiles", "files");
  if (!(s != null && s.length)) throw new Error("Map tile has no MATT files.");
  const l = hc((C = s[0]) == null ? void 0 : C.name);
  if (!(l != null && l.length))
    throw new Error(`Cannot parse bracket tags from: ${((I = s[0]) == null ? void 0 : I.name) ?? "<unknown>"}`);
  if (l.length < 3)
    throw new Error(`Expected 3+ bracket tags, found ${l.length}.`);
  const u = Tagger.getByTag("Floor", r) ?? [], d = Tagger.getByTag("Roof", r) ?? [], m = Tagger.getByTag("Weather", r) ?? [];
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
  v.map = await ua(o, f, y, { dryRun: t });
  for (const O of u) {
    const M = await ua(O, f, y, { dryRun: t });
    M && v.floor.push(M);
  }
  for (const O of d) {
    const M = await ua(O, f, y, { dryRun: t });
    M && v.roof.push(M);
  }
  for (const O of m) {
    const M = await ua(O, p, y, { dryRun: t });
    M && v.weather.push(M);
  }
  const b = fg(g, y);
  return t || (await Yo(n, b), await cg(n)), ug(
    t ? "Dry run complete" : "Indexing complete",
    `- ${b.length} criteria,`,
    `${((A = v.map) == null ? void 0 : A.files) ?? 0} map files`
  ), {
    criteria: b,
    state: b.reduce((O, M) => (O[M.key] = M.default, O), {}),
    tiles: v,
    overlayMode: m.length > 0
  };
}
c(mg, "indexScene");
var Hu, qe, ft, mt, di, Ze, jt, Tn, jo, ce, Yd, Kd, Jd, yl, Xd, bl, Qd, hr, vl;
const Et = class Et extends Gn(zn) {
  constructor(t = {}) {
    var i;
    super(t);
    k(this, ce);
    k(this, qe, null);
    k(this, ft, []);
    k(this, mt, {});
    k(this, di, !1);
    k(this, Ze, null);
    k(this, jt, null);
    k(this, Tn, null);
    k(this, jo, 120);
    this.setScene(t.scene ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null);
  }
  setScene(t) {
    var i;
    L(this, qe, t ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null), S(this, ce, Yd).call(this);
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
      stateSummary: S(this, ce, vl).call(this)
    };
  }
  _onRender(t, i) {
    super._onRender(t, i), S(this, ce, Kd).call(this), S(this, ce, Jd).call(this);
  }
  async _onClose(t) {
    return h(this, Ze) !== null && (clearTimeout(h(this, Ze)), L(this, Ze, null)), h(this, Tn) !== null && (Hooks.off("eidolon-utilities.criteriaStateApplied", h(this, Tn)), L(this, Tn, null)), super._onClose(t);
  }
};
qe = new WeakMap(), ft = new WeakMap(), mt = new WeakMap(), di = new WeakMap(), Ze = new WeakMap(), jt = new WeakMap(), Tn = new WeakMap(), jo = new WeakMap(), ce = new WeakSet(), Yd = /* @__PURE__ */ c(function() {
  if (!h(this, qe)) {
    L(this, ft, []), L(this, mt, {});
    return;
  }
  L(this, ft, pt(h(this, qe)).sort((t, i) => t.order - i.order)), L(this, mt, Qr(h(this, qe), h(this, ft)));
}, "#hydrateFromScene"), Kd = /* @__PURE__ */ c(function() {
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
      }), S(this, ce, Xd).call(this, { [l]: s.value }));
    });
  }), (i = t.querySelector("[data-action='reset-defaults']")) == null || i.addEventListener("click", () => {
    S(this, ce, Qd).call(this);
  }), (r = t.querySelector("[data-action='close-switcher']")) == null || r.addEventListener("click", () => {
    this.close();
  }));
}, "#bindEvents"), Jd = /* @__PURE__ */ c(function() {
  h(this, Tn) === null && L(this, Tn, Hooks.on("eidolon-utilities.criteriaStateApplied", (t, i) => {
    !h(this, qe) || (t == null ? void 0 : t.id) !== h(this, qe).id || h(this, di) || (L(this, mt, { ...i ?? {} }), this.render({ force: !0 }));
  }));
}, "#ensureSyncHook"), yl = /* @__PURE__ */ c(async function(t) {
  var i, r;
  if (h(this, qe)) {
    S(this, ce, hr).call(this, "applying"), L(this, di, !0);
    try {
      const a = await Gd(t, h(this, qe));
      a && L(this, mt, a), S(this, ce, hr).call(this, "ready"), this.render({ force: !0 });
    } catch (a) {
      console.error(`${ie} | Failed to apply criteria state`, a), (r = (i = ui.notifications) == null ? void 0 : i.error) == null || r.call(
        i,
        E(
          "EIDOLON.CriteriaSwitcher.ApplyError",
          "Failed to apply the selected criteria state."
        )
      ), S(this, ce, hr).call(this, "error", (a == null ? void 0 : a.message) ?? "Unknown error");
    } finally {
      L(this, di, !1), h(this, jt) && S(this, ce, bl).call(this);
    }
  }
}, "#applyPartialState"), Xd = /* @__PURE__ */ c(function(t) {
  L(this, jt, {
    ...h(this, jt) ?? {},
    ...t ?? {}
  }), h(this, Ze) !== null && clearTimeout(h(this, Ze)), S(this, ce, hr).call(this, "applying"), L(this, Ze, setTimeout(() => {
    L(this, Ze, null), S(this, ce, bl).call(this);
  }, h(this, jo)));
}, "#queuePartialState"), bl = /* @__PURE__ */ c(async function() {
  if (h(this, di) || !h(this, jt)) return;
  const t = h(this, jt);
  L(this, jt, null), await S(this, ce, yl).call(this, t);
}, "#flushPendingState"), Qd = /* @__PURE__ */ c(async function() {
  if (!h(this, ft).length) return;
  const t = h(this, ft).reduce((i, r) => (i[r.key] = r.default, i), {});
  L(this, mt, t), h(this, Ze) !== null && (clearTimeout(h(this, Ze)), L(this, Ze, null)), L(this, jt, null), await S(this, ce, yl).call(this, t);
}, "#resetToDefaults"), hr = /* @__PURE__ */ c(function(t, i = "") {
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
        a.textContent = `${E("EIDOLON.CriteriaSwitcher.Ready", "Ready")}: ${S(this, ce, vl).call(this)}`;
        break;
    }
}, "#setStatus"), vl = /* @__PURE__ */ c(function() {
  return h(this, ft).length ? `[${h(this, ft).map((t) => {
    var i;
    return ((i = h(this, mt)) == null ? void 0 : i[t.key]) ?? t.default;
  }).join(" | ")}]` : "-";
}, "#formatStateSummary"), c(Et, "CriteriaSwitcherApplication"), ye(Et, "APP_ID", `${ie}-criteria-switcher`), ye(Et, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Re(Et, Et, "DEFAULT_OPTIONS"),
  {
    id: Et.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Hu = Re(Et, Et, "DEFAULT_OPTIONS")) == null ? void 0 : Hu.classes) ?? [], "eidolon-criteria-switcher-window", "themed"])
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
let pl = Et;
const hg = Go(pl);
let vi = null;
function gg(n) {
  var e;
  return n ?? ((e = game.scenes) == null ? void 0 : e.viewed) ?? null;
}
c(gg, "resolveScene");
function pg(n) {
  var e;
  return !!(n != null && n.rendered && ((e = n == null ? void 0 : n.element) != null && e.isConnected));
}
c(pg, "isRendered");
function Qo() {
  return pg(vi) ? vi : (vi = null, null);
}
c(Qo, "getCriteriaSwitcher");
function Zd(n) {
  var i, r, a, o, s;
  const e = gg(n);
  if (!e)
    return (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "No active scene to open the criteria switcher."), null;
  if (!Ko(e))
    return (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, "You do not have permission to manage scene criteria."), null;
  const t = Qo();
  return t ? (t.setScene(e), t.render({ force: !0 }), (s = t.bringToFront) == null || s.call(t), t) : (vi = hg({ scene: e }), vi.render({ force: !0 }), vi);
}
c(Zd, "openCriteriaSwitcher");
function ef() {
  const n = Qo();
  n && (n.close(), vi = null);
}
c(ef, "closeCriteriaSwitcher");
function gc(n) {
  return Qo() ? (ef(), null) : Zd(n);
}
c(gc, "toggleCriteriaSwitcher");
const yg = {
  SCHEMA_VERSION: dc,
  applyState: Gd,
  getState: og,
  getVersion: lg,
  setVersion: Wd,
  getCriteria(n) {
    var e;
    return pt(n ?? ((e = game.scenes) == null ? void 0 : e.viewed));
  },
  setCriteria(n, e) {
    var t;
    return Yo(e ?? ((t = game.scenes) == null ? void 0 : t.viewed), n);
  },
  updateTiles: Pd,
  updatePlaceables: zd,
  indexScene: mg,
  openCriteriaSwitcher: Zd,
  closeCriteriaSwitcher: ef,
  toggleCriteriaSwitcher: gc,
  findBestMatch: Sh,
  findFileIndex: Ch,
  resolveRules: xd
};
function bg(n) {
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
c(bg, "findTabNav");
function vg(n, e) {
  var i, r, a;
  return n instanceof HTMLElement ? [
    (i = n.querySelector(".tab[data-tab]")) == null ? void 0 : i.parentElement,
    n.querySelector(".sheet-body"),
    (a = (r = e == null ? void 0 : e.parentElement) == null ? void 0 : r.querySelector) == null ? void 0 : a.call(r, ":scope > .sheet-body"),
    e == null ? void 0 : e.parentElement
  ].find((o) => o instanceof HTMLElement) ?? null : null;
}
c(vg, "findTabBody");
function wg(n, e) {
  var t, i, r, a, o, s, l;
  return ((t = n == null ? void 0 : n.dataset) == null ? void 0 : t.group) ?? ((a = (r = (i = n == null ? void 0 : n.querySelector) == null ? void 0 : i.call(n, "[data-group]")) == null ? void 0 : r.dataset) == null ? void 0 : a.group) ?? ((l = (s = (o = e == null ? void 0 : e.querySelector) == null ? void 0 : o.call(e, ".tab[data-group]")) == null ? void 0 : s.dataset) == null ? void 0 : l.group) ?? "main";
}
c(wg, "getTabGroup");
function Eg(n, e, t) {
  if (!(n instanceof HTMLElement)) return;
  n.textContent = "";
  const i = document.createElement("i");
  i.className = t, i.setAttribute("inert", ""), n.append(i, " ");
  const r = document.createElement("span");
  r.textContent = e, n.append(r);
}
c(Eg, "setTabButtonContent");
function Sg(n, e, t) {
  const i = n.querySelector("[data-tab]"), r = (i == null ? void 0 : i.tagName) || "A", a = document.createElement(r);
  return i instanceof HTMLElement && (a.className = i.className), a.classList.remove("active"), r === "BUTTON" && (a.type = "button"), a.dataset.action = "tab", a.dataset.tab = t, a.dataset.group = e, a.setAttribute("aria-selected", "false"), a.setAttribute("aria-pressed", "false"), a;
}
c(Sg, "createTabButton");
function Cg(n, e, t) {
  const i = document.createElement("div");
  i.classList.add("tab"), i.dataset.tab = t, i.dataset.group = e, i.dataset.applicationPart = t, i.setAttribute("hidden", "true");
  const r = wd(n);
  return n.insertBefore(i, r ?? null), i;
}
c(Cg, "createTabPanel");
function Es(n, e, t, i, r) {
  var s;
  if (!(i instanceof HTMLElement) || !(r instanceof HTMLElement)) return;
  const a = (s = n == null ? void 0 : n.tabGroups) == null ? void 0 : s[e];
  if (typeof a == "string" ? a === t : i.classList.contains("active") || r.classList.contains("active")) {
    i.classList.add("active"), i.setAttribute("aria-selected", "true"), i.setAttribute("aria-pressed", "true"), r.classList.add("active"), r.removeAttribute("hidden"), r.removeAttribute("aria-hidden");
    return;
  }
  i.classList.remove("active"), i.setAttribute("aria-selected", "false"), i.setAttribute("aria-pressed", "false"), r.classList.remove("active"), r.setAttribute("hidden", "true");
}
c(Es, "syncTabVisibility");
function tf(n, e, t, i, r) {
  const a = bg(e), o = vg(e, a);
  if (!(a instanceof HTMLElement) || !(o instanceof HTMLElement)) return null;
  const s = wg(a, o);
  let l = a.querySelector(`[data-tab="${t}"]`);
  l instanceof HTMLElement || (l = Sg(a, s, t), a.appendChild(l)), Eg(l, i, r);
  let u = o.querySelector(`.tab[data-tab="${t}"]`);
  u instanceof HTMLElement || (u = Cg(o, s, t));
  const d = `data-eidolon-bound-${t}`;
  return l.hasAttribute(d) || (l.addEventListener("click", () => {
    bd(n, t, s), requestAnimationFrame(() => {
      Es(n, s, t, l, u);
    });
  }), l.setAttribute(d, "true")), Es(n, s, t, l, u), requestAnimationFrame(() => {
    Es(n, s, t, l, u);
  }), Tg(n, a), u;
}
c(tf, "ensureTileConfigTab");
function Tg(n, e) {
  !(n != null && n.setPosition) || !(e instanceof HTMLElement) || requestAnimationFrame(() => {
    var a;
    if (e.scrollWidth <= e.clientWidth) return;
    const t = e.scrollWidth - e.clientWidth, i = n.element instanceof HTMLElement ? n.element : (a = n.element) == null ? void 0 : a[0];
    if (!i) return;
    const r = i.offsetWidth || 480;
    n.setPosition({ width: r + t + 16 });
  });
}
c(Tg, "fitNavWidth");
function nf(n) {
  var e;
  return ((e = n == null ? void 0 : n.getFlag) == null ? void 0 : e.call(n, "monks-active-tiles", "files")) ?? [];
}
c(nf, "getTileFiles$1");
function Lg(n = []) {
  return {
    strategy: "select-one",
    defaultTarget: qn(n, 0) ?? { indexHint: 0 },
    variants: [
      {
        criteria: {},
        target: qn(n, 0) ?? { indexHint: 0 }
      }
    ]
  };
}
c(Lg, "createDefaultTileCriteria");
function Ig(n, e = {}) {
  var o, s;
  const { allowLegacy: t = !0 } = e, i = nf(n), r = (o = n == null ? void 0 : n.getFlag) == null ? void 0 : o.call(n, ie, yi);
  if (r) return Si(r, { files: i });
  if (!t) return null;
  const a = (s = n == null ? void 0 : n.getFlag) == null ? void 0 : s.call(n, ie, pi);
  return a ? Si(a, { files: i }) : null;
}
c(Ig, "getTileCriteria");
async function ru(n, e, t = {}) {
  if (!(n != null && n.setFlag)) return null;
  const {
    strictValidation: i = !0
  } = t, r = nf(n), a = Si(e, { files: r });
  if (!a)
    return typeof n.unsetFlag == "function" ? (await n.unsetFlag(ie, yi), await n.unsetFlag(ie, pi)) : (await n.setFlag(ie, yi, null), await n.setFlag(ie, pi, null)), null;
  if (i) {
    const o = Fd(a, { files: r });
    if (o.errors.length > 0)
      throw new Error(
        `Tile criteria contains ${o.errors.length} conflicting rule pair(s). Resolve clashes before saving.`
      );
  }
  return await n.setFlag(ie, yi, a), typeof n.unsetFlag == "function" && await n.unsetFlag(ie, pi), a;
}
c(ru, "setTileCriteria");
const wl = "__eidolon_any__", El = "eidolon-tile-criteria", Og = "fa-solid fa-sliders", rf = Symbol.for("eidolon.tileCriteriaUiState"), Zo = ["all", "unmapped", "mapped", "conflicts"];
function Ag(n) {
  const e = n == null ? void 0 : n[rf];
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
c(Ag, "readUiState");
function kg(n, e) {
  if (!n || !e) return;
  typeof e.filterQuery == "string" && (n.filterQuery = e.filterQuery), Zo.includes(e.filterMode) && (n.filterMode = e.filterMode), Number.isInteger(e.selectedFileIndex) && n.fileEntries.some((i) => i.index === e.selectedFileIndex) && (n.selectedFileIndex = e.selectedFileIndex);
}
c(kg, "applyUiState");
function Mg(n) {
  const e = n == null ? void 0 : n.app, t = n == null ? void 0 : n.state;
  !e || !t || (e[rf] = {
    filterQuery: typeof t.filterQuery == "string" ? t.filterQuery : "",
    filterMode: Zo.includes(t.filterMode) ? t.filterMode : "all",
    selectedFileIndex: Number.isInteger(t.selectedFileIndex) ? t.selectedFileIndex : null
  });
}
c(Mg, "persistUiState");
function _g(n) {
  const e = (n == null ? void 0 : n.object) ?? (n == null ? void 0 : n.document) ?? null;
  return !(e != null && e.isEmbedded) || e.documentName !== "Tile" ? null : e;
}
c(_g, "getTileDocument$1");
function Ng(n) {
  var e;
  return ((e = n == null ? void 0 : n.getFlag) == null ? void 0 : e.call(n, "monks-active-tiles", "files")) ?? [];
}
c(Ng, "getTileFiles");
function xg(n, e) {
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
c(xg, "getCriteriaDefinitions");
function $g(n) {
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
c($g, "buildTree");
function Fg(n, e) {
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
c(Fg, "collapseFolderBranch");
function Dg(n, e) {
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
c(Dg, "getRuleSummariesForFile");
function Sl(n) {
  var g, p;
  const e = Ng(n), t = fc(e), i = Ig(n, { allowLegacy: !0 }) ?? Lg(e), r = xg(n, i), a = new Map(r.map((y) => [y.key, y.label])), o = new Map(
    t.map((y) => [
      y.index,
      y.path || y.label
    ])
  ), s = Or(i.defaultTarget, e), l = ((g = t[0]) == null ? void 0 : g.index) ?? 0, u = s >= 0 ? s : l, d = new Map(t.map((y) => [y.index, []]));
  let m = 1;
  for (const y of i.variants ?? []) {
    const v = Or(y.target, e);
    v < 0 || (d.has(v) || d.set(v, []), d.get(v).push({
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
c(Sl, "buildEditorState");
function Cl(n, e) {
  return n.rulesByFile.has(e) || n.rulesByFile.set(e, []), n.rulesByFile.get(e);
}
c(Cl, "getRulesForFile");
function Pg(n) {
  return Object.fromEntries(
    Object.entries(n ?? {}).filter(([e, t]) => typeof e == "string" && e && typeof t == "string" && t.trim()).map(([e, t]) => [e, t.trim()])
  );
}
c(Pg, "sanitizeRuleCriteria");
function af(n) {
  const e = qn(n.files, n.defaultIndex);
  if (!e) return null;
  const t = [], i = [];
  for (const [a, o] of n.rulesByFile.entries()) {
    const s = qn(n.files, a);
    if (s)
      for (const [l, u] of o.entries()) {
        const d = Pg(u.criteria);
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
c(af, "buildTileCriteriaDraft");
function Rg(n) {
  var e;
  return ((e = af(n)) == null ? void 0 : e.normalized) ?? null;
}
c(Rg, "exportTileCriteria");
function au(n) {
  const e = af(n);
  if (!(e != null && e.normalized))
    return {
      errors: [],
      warnings: [],
      errorFileIndexes: [],
      warningFileIndexes: []
    };
  const t = Fd(e.normalized, { files: n.files }), i = /* @__PURE__ */ c((s) => {
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
c(au, "analyzeRuleConflicts");
function da(n, e = "neutral") {
  const t = document.createElement("span");
  return t.classList.add("eidolon-tile-criteria__badge"), t.dataset.kind = e, t.textContent = n, t;
}
c(da, "createBadge");
function Hg(n, e = {}) {
  const t = typeof n == "string" ? n : "", {
    maxLength: i = 42,
    headLength: r = 20,
    tailLength: a = 16
  } = e;
  if (!t || t.length <= i) return t;
  const o = t.slice(0, r).trimEnd(), s = t.slice(-a).trimStart();
  return `${o}...${s}`;
}
c(Hg, "middleEllipsis");
function qg(n) {
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
c(qg, "createRegexFilter");
function jg(n, e) {
  const t = document.createElement("select");
  t.dataset.criteriaKey = n.key;
  const i = document.createElement("option");
  i.value = wl, i.textContent = "*", t.appendChild(i);
  const r = new Set(n.values ?? []);
  e && !r.has(e) && r.add(e);
  for (const a of r) {
    const o = document.createElement("option");
    o.value = a, o.textContent = a, t.appendChild(o);
  }
  return t.value = e ?? wl, t;
}
c(jg, "createCriterionSelect");
function Bg(n, e, t, i) {
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
    const m = jg(l, (s = n.criteria) == null ? void 0 : s[l.key]);
    m.addEventListener("change", () => {
      m.value === wl ? delete n.criteria[l.key] : n.criteria[l.key] = m.value, i();
    }), u.appendChild(m), a.appendChild(u);
  }
  r.appendChild(a);
  const o = document.createElement("button");
  return o.type = "button", o.classList.add("control", "ui-control", "eidolon-tile-criteria__rule-remove"), o.textContent = E("EIDOLON.TileCriteria.RemoveRule", "Remove"), o.addEventListener("click", () => {
    const u = Cl(e, t).filter((d) => d.id !== n.id);
    e.rulesByFile.set(t, u), i();
  }), r.appendChild(o), r;
}
c(Bg, "renderRuleEditor");
const La = /* @__PURE__ */ new WeakMap();
function of(n) {
  return (n == null ? void 0 : n.app) ?? (n == null ? void 0 : n.tile) ?? null;
}
c(of, "getDialogOwner");
function Ug(n) {
  for (const e of n) {
    const t = Kt(e);
    if (t) return t;
    const i = Kt(e == null ? void 0 : e.element);
    if (i) return i;
  }
  return null;
}
c(Ug, "findDialogRoot$1");
function Vg(n, e, t) {
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
        Bg(y, i, r.index, () => {
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
c(Vg, "buildRuleEditorContent");
function zg(n, e) {
  var m, f, g;
  const t = of(n);
  if (!t) return;
  const i = La.get(t);
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
  La.set(t, r);
  const a = /* @__PURE__ */ c(() => {
    La.delete(t);
  }, "closeDialog"), o = /* @__PURE__ */ c(() => {
    r.host instanceof HTMLElement && r.host.replaceChildren(
      Vg(r.controller, r.fileIndex, o)
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
        const y = Ug(p), v = (b = y == null ? void 0 : y.querySelector) == null ? void 0 : b.call(y, ".eidolon-tile-criteria-editor-host");
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
c(zg, "openRuleEditorDialog");
function ou(n) {
  var i;
  const e = of(n);
  if (!e) return;
  const t = La.get(e);
  (i = t == null ? void 0 : t.refresh) == null || i.call(t);
}
c(ou, "refreshOpenRuleEditor");
function Tl(n, e) {
  return (n.rulesByFile.get(e) ?? []).length > 0;
}
c(Tl, "hasRulesForFile");
function sf(n, e) {
  var t, i;
  return ((t = n == null ? void 0 : n.errorFileIndexes) == null ? void 0 : t.includes(e)) || ((i = n == null ? void 0 : n.warningFileIndexes) == null ? void 0 : i.includes(e));
}
c(sf, "hasConflictForFile");
function Gg(n, e, t) {
  switch (n.filterMode) {
    case "unmapped":
      return !Tl(n, e.index);
    case "mapped":
      return Tl(n, e.index);
    case "conflicts":
      return sf(t, e.index);
    case "all":
    default:
      return !0;
  }
}
c(Gg, "matchesFilterMode");
function Wg(n, e) {
  let t = 0, i = 0, r = 0;
  for (const a of n.fileEntries)
    Tl(n, a.index) ? t += 1 : i += 1, sf(e, a.index) && (r += 1);
  return {
    all: n.fileEntries.length,
    mapped: t,
    unmapped: i,
    conflicts: r
  };
}
c(Wg, "getFilterModeCounts");
function Yg(n) {
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
c(Yg, "getFilterModeLabel");
function lf(n, e, t, i, r) {
  var u, d;
  const a = [...n.folders.keys()].sort((m, f) => m.localeCompare(f));
  for (const m of a) {
    const f = Fg(m, n.folders.get(m)), g = document.createElement("li");
    g.classList.add("eidolon-tile-criteria__tree-branch");
    const p = document.createElement("div");
    p.classList.add("document", "folder", "update", "eidolon-tile-criteria__folder-row");
    const y = document.createElement("i");
    y.classList.add("fa-solid", "fa-folder-open"), p.appendChild(y);
    const v = document.createElement("span");
    v.classList.add("eidolon-tile-criteria__tree-folder-label"), v.textContent = f.label, v.title = f.label, p.appendChild(v), g.appendChild(p);
    const b = document.createElement("ul");
    b.classList.add("eidolon-tile-criteria__tree"), b.dataset.folder = f.label, lf(f.node, e, t, i, b), b.childElementCount > 0 && g.appendChild(b), r.appendChild(g);
  }
  const o = [...n.files].sort((m, f) => m.name.localeCompare(f.name));
  if (!o.length) return;
  const s = document.createElement("li"), l = document.createElement("ul");
  l.classList.add("document-list", "eidolon-tile-criteria__document-list");
  for (const m of o) {
    const f = m.entry, g = f.index === e.selectedFileIndex, p = f.index === e.defaultIndex, y = Dg(e, f.index), v = document.createElement("li");
    v.classList.add("document", "update", "eidolon-tile-criteria__tree-file");
    const b = document.createElement("button");
    b.type = "button", b.classList.add("eidolon-tile-criteria__file-row");
    const w = (u = i == null ? void 0 : i.errorFileIndexes) == null ? void 0 : u.includes(f.index), C = (d = i == null ? void 0 : i.warningFileIndexes) == null ? void 0 : d.includes(f.index);
    w ? b.classList.add("has-conflict") : C && b.classList.add("has-warning");
    const I = e.relativePaths.get(f.index) || f.path || m.name, A = [I];
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
      e.selectedFileIndex = f.index, We(t), zg(t, f.index);
    });
    const O = document.createElement("span");
    O.classList.add("eidolon-tile-criteria__indicator"), O.dataset.kind = p ? "default" : y.length ? "mapped" : "unmapped", b.appendChild(O);
    const M = document.createElement("span");
    M.classList.add("eidolon-tile-criteria__file-content");
    const $ = document.createElement("span");
    $.classList.add("eidolon-tile-criteria__file-heading");
    const j = document.createElement("span");
    j.classList.add("eidolon-tile-criteria__file-title"), j.textContent = Hg(m.name || f.label), j.title = I, $.appendChild(j);
    const D = da(`#${f.index + 1}`, "meta");
    D.classList.add("eidolon-tile-criteria__index-badge"), $.appendChild(D), M.appendChild($);
    const P = document.createElement("span");
    P.classList.add("eidolon-tile-criteria__badges"), p && P.appendChild(da(E("EIDOLON.TileCriteria.DefaultBadge", "Default"), "default"));
    const N = y.slice(0, 2);
    for (const R of N)
      P.appendChild(da(R, "rule"));
    if (y.length > N.length && P.appendChild(da(`+${y.length - N.length}`, "meta")), M.appendChild(P), b.appendChild(M), w || C) {
      const R = document.createElement("span");
      R.classList.add("eidolon-tile-criteria__row-warning"), R.dataset.mode = w ? "error" : "warning", R.innerHTML = '<i class="fa-solid fa-triangle-exclamation" inert=""></i>', b.appendChild(R);
    }
    v.appendChild(b), l.appendChild(v);
  }
  s.appendChild(l), r.appendChild(s);
}
c(lf, "renderTreeNode");
function Kg(n, e, t, i = {}) {
  const r = document.createElement("section");
  r.classList.add("eidolon-tile-criteria__tree-panel");
  const a = qg(n.filterQuery), o = Wg(n, t);
  n.filterMode !== "all" && o[n.filterMode] === 0 && (n.filterMode = "all");
  const s = document.createElement("div");
  s.classList.add("eidolon-tile-criteria__toolbar");
  const l = document.createElement("div");
  l.classList.add("eidolon-tile-criteria__mode-bar");
  for (const w of Zo) {
    const C = document.createElement("button");
    C.type = "button", C.classList.add("control", "ui-control", "eidolon-tile-criteria__mode-button"), C.dataset.mode = w, C.textContent = Yg(w);
    const I = w === "all" || o[w] > 0;
    C.disabled = !I, I || (C.dataset.tooltip = E(
      "EIDOLON.TileCriteria.FilterModeUnavailable",
      "No entries currently match this filter."
    ), C.title = C.dataset.tooltip), n.filterMode === w ? (C.classList.add("is-active"), C.setAttribute("aria-pressed", "true")) : C.setAttribute("aria-pressed", "false"), C.addEventListener("click", () => {
      n.filterMode !== w && (n.filterMode = w, We(e));
    }), l.appendChild(C);
  }
  s.appendChild(l);
  const u = document.createElement("div");
  u.classList.add("eidolon-tile-criteria__filter-row");
  const d = document.createElement("input");
  d.type = "text", d.classList.add("eidolon-tile-criteria__filter-input"), d.placeholder = E("EIDOLON.TileCriteria.FilterPlaceholder", "Regex filter (path)"), d.value = n.filterQuery, d.autocomplete = "off", d.addEventListener("keydown", (w) => {
    w.stopPropagation(), w.key === "Enter" && w.preventDefault();
  }), d.addEventListener("keyup", (w) => {
    w.stopPropagation();
  }), d.addEventListener("change", (w) => {
    w.stopPropagation();
  }), d.addEventListener("input", (w) => {
    w.stopPropagation();
    const C = d.selectionStart ?? d.value.length, I = d.selectionEnd ?? C;
    n.filterQuery = d.value, We(e), requestAnimationFrame(() => {
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
  const m = document.createElement("div");
  m.classList.add("eidolon-tile-criteria__toolbar-actions");
  const f = document.createElement("button");
  f.type = "button";
  const g = E("EIDOLON.TileCriteria.Save", "Save Rules");
  f.classList.add("control", "ui-control", "eidolon-tile-criteria__toolbar-action", "icon-only"), f.dataset.tooltip = g, f.setAttribute("aria-label", g), f.title = g, f.innerHTML = '<i class="fa-solid fa-floppy-disk" inert=""></i>', f.disabled = t.errors.length > 0, f.addEventListener("click", () => {
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
  const v = document.createElement("div");
  v.classList.add("eidolon-tile-criteria__library-tree");
  const b = n.fileEntries.filter((w) => {
    const C = n.relativePaths.get(w.index) || w.path || w.label;
    return Gg(n, w, t) && a.matches(C);
  });
  if (n.fileEntries.length)
    if (b.length) {
      const w = document.createElement("ul");
      w.classList.add("eidolon-tile-criteria__tree"), lf($g(b), n, e, t, w), v.appendChild(w);
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
c(Kg, "renderTreePanel");
function We(n) {
  const { section: e, state: t } = n, i = au(t);
  Mg(n), e.replaceChildren();
  const r = /* @__PURE__ */ c(async () => {
    try {
      const o = au(t);
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
      const s = Rg(t);
      if (!s) {
        t.status = {
          mode: "error",
          message: E("EIDOLON.TileCriteria.Invalid", "Invalid rules. Select valid target variants.")
        }, We(n);
        return;
      }
      await ru(n.tile, s);
      const l = t.filterQuery, u = t.filterMode, d = t.selectedFileIndex;
      n.state = Sl(n.tile), n.state.filterQuery = l, n.state.filterMode = u, Number.isInteger(d) && (n.state.selectedFileIndex = d), n.state.status = {
        mode: "ready",
        message: E("EIDOLON.TileCriteria.Saved", "Tile criteria rules saved.")
      }, We(n), ou(n);
    } catch (o) {
      console.error(`${ie} | Failed to save tile criteria`, o), t.status = {
        mode: "error",
        message: (o == null ? void 0 : o.message) ?? "Failed to save tile criteria rules."
      }, We(n);
    }
  }, "handleSave"), a = /* @__PURE__ */ c(async () => {
    try {
      await ru(n.tile, null);
      const o = t.filterQuery, s = t.filterMode, l = t.selectedFileIndex;
      n.state = Sl(n.tile), n.state.filterQuery = o, n.state.filterMode = s, Number.isInteger(l) && (n.state.selectedFileIndex = l), n.state.status = {
        mode: "ready",
        message: E("EIDOLON.TileCriteria.Cleared", "Tile criteria rules cleared.")
      }, We(n), ou(n);
    } catch (o) {
      console.error(`${ie} | Failed to clear tile criteria`, o), t.status = {
        mode: "error",
        message: (o == null ? void 0 : o.message) ?? "Failed to clear tile criteria rules."
      }, We(n);
    }
  }, "handleClear");
  if (e.appendChild(Kg(t, n, i, {
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
function Jg(n, e = null) {
  const t = document.createElement("section");
  t.classList.add("eidolon-tile-criteria");
  const i = Sl(n);
  kg(i, Ag(e));
  const r = {
    app: e,
    tile: n,
    section: t,
    state: i
  };
  return We(r), r;
}
c(Jg, "createController");
function Xg(n, e) {
  return tf(
    n,
    e,
    El,
    E("EIDOLON.TileCriteria.TabLabel", "Criteria"),
    Og
  );
}
c(Xg, "ensureTileCriteriaTab");
function Qg() {
  Hooks.on("renderTileConfig", (n, e) => {
    var l, u, d, m;
    const t = Kt(e);
    if (!t) return;
    const i = _g(n);
    if (!i) return;
    if ((l = t.querySelector(".eidolon-tile-criteria")) == null || l.remove(), !Wo()) {
      (u = t.querySelector(`.item[data-tab='${El}']`)) == null || u.remove(), (d = t.querySelector(`.tab[data-tab='${El}']`)) == null || d.remove();
      return;
    }
    const r = Jg(i, n), a = Xg(n, t);
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
c(Qg, "registerTileCriteriaConfigControls");
function Zg(n) {
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
c(Zg, "toList");
function ep(n, e) {
  const t = n == null ? void 0 : n.tools;
  return Array.isArray(t) ? t.some((i) => (i == null ? void 0 : i.name) === e) : t instanceof Map ? t.has(e) : t && typeof t == "object" ? e in t ? !0 : Object.values(t).some((i) => (i == null ? void 0 : i.name) === e) : !1;
}
c(ep, "hasTool");
function tp(n, e) {
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
c(tp, "addTool");
function np() {
  Hooks.on("getSceneControlButtons", (n) => {
    var i;
    const e = Zg(n);
    if (!e.length) return;
    const t = e.find((r) => (r == null ? void 0 : r.name) === "tiles") ?? e.find((r) => (r == null ? void 0 : r.name) === "tokens" || (r == null ? void 0 : r.name) === "token") ?? e[0];
    t && (ep(t, "eidolonCriteriaSwitcher") || tp(t, {
      name: "eidolonCriteriaSwitcher",
      title: "Criteria Switcher",
      icon: "fa-solid fa-sliders",
      button: !0,
      toggle: !1,
      visible: Ko(((i = game.scenes) == null ? void 0 : i.viewed) ?? null),
      onClick: /* @__PURE__ */ c(() => gc(), "onClick")
    }));
  });
}
c(np, "registerSceneControlButton");
function fa(n, e) {
  if (!n || typeof n != "object") return !1;
  const t = String(e).split(".");
  let i = n;
  for (const r of t) {
    if (!i || typeof i != "object" || !Object.prototype.hasOwnProperty.call(i, r)) return !1;
    i = i[r];
  }
  return !0;
}
c(fa, "hasOwnPath");
function ip() {
  const n = /* @__PURE__ */ c((i, r = null) => {
    i && zh(i, r);
  }, "invalidateTileScene"), e = /* @__PURE__ */ c((i, r = null) => {
    i && ag(i, r);
  }, "invalidatePlaceableScene");
  Hooks.on("createTile", (i) => {
    n((i == null ? void 0 : i.parent) ?? null, i ?? null);
  }), Hooks.on("deleteTile", (i) => {
    n((i == null ? void 0 : i.parent) ?? null, i ?? null);
  }), Hooks.on("updateTile", (i, r) => {
    (fa(r, `flags.${ie}.tileCriteria`) || fa(r, `flags.${ie}.fileIndex`)) && n((i == null ? void 0 : i.parent) ?? null, i ?? null);
  });
  const t = /* @__PURE__ */ c((i) => {
    Hooks.on(`create${i}`, (r) => {
      e((r == null ? void 0 : r.parent) ?? null, r ?? null);
    }), Hooks.on(`delete${i}`, (r) => {
      e((r == null ? void 0 : r.parent) ?? null, r ?? null);
    }), Hooks.on(`update${i}`, (r, a) => {
      const o = fa(a, `flags.${ie}.presets`), s = i === "AmbientLight" && fa(a, `flags.${ie}.lightCriteria`);
      !o && !s || e((r == null ? void 0 : r.parent) ?? null, r ?? null);
    });
  }, "registerPlaceableHooks");
  t("AmbientLight"), t("Wall"), t("AmbientSound"), Hooks.on("canvasReady", (i) => {
    const r = (i == null ? void 0 : i.scene) ?? null;
    r && (n(r), e(r));
  });
}
c(ip, "registerCriteriaCacheInvalidationHooks");
function rp() {
  np(), Qg(), ip(), Hooks.once("init", () => {
    var n, e;
    (e = (n = game.keybindings) == null ? void 0 : n.register) == null || e.call(n, ie, "toggleCriteriaSwitcher", {
      name: "Toggle Criteria Switcher",
      hint: "Open or close the criteria switcher window for live scene state updates.",
      editable: [{ key: "KeyM", modifiers: ["Alt"] }],
      onDown: /* @__PURE__ */ c(() => {
        var t, i, r;
        return Ko(((t = game.scenes) == null ? void 0 : t.viewed) ?? null) ? (gc(), !0) : ((r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "You do not have permission to manage scene criteria."), !0);
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
    const n = (t = (e = game.modules) == null ? void 0 : e.get) == null ? void 0 : t.call(e, ie);
    n && (n.api || (n.api = {}), n.api.criteria = yg, console.log(`${ie} | Criteria engine API registered`));
  });
}
c(rp, "registerCriteriaEngineHooks");
rp();
const Ia = /* @__PURE__ */ new WeakMap(), ma = /* @__PURE__ */ new WeakMap(), ve = "__eidolon_default__";
function ap() {
  Hooks.on("renderAmbientLightConfig", op), _("LightCriteria | AmbientLightConfig controls registered");
}
c(ap, "registerAmbientLightCriteriaControls");
function op(n, e) {
  var t;
  Ji("LightCriteria | renderAmbientLightConfig", {
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
    sp(n, i);
  } catch (i) {
    console.error("eidolon-utilities | Failed to enhance AmbientLightConfig UI", i);
  } finally {
    Fn();
  }
}
c(op, "handleAmbientLightConfigRender");
function sp(n, e) {
  var xe, Yn, rr, ra, xc;
  const t = (n == null ? void 0 : n.form) instanceof HTMLFormElement ? n.form : e instanceof HTMLFormElement ? e : (xe = e == null ? void 0 : e.closest) == null ? void 0 : xe.call(e, "form");
  if (!(t instanceof HTMLFormElement)) return;
  const i = t.querySelector(".window-content");
  if (!(i instanceof HTMLElement)) return;
  const r = uf(n);
  if (!r) return;
  const a = kp(r);
  _("LightCriteria | Resolved ambient light", {
    sheetId: (r == null ? void 0 : r.id) ?? null,
    persistedId: (a == null ? void 0 : a.id) ?? null,
    sameRef: r === a
  });
  const o = (a == null ? void 0 : a.parent) ?? r.parent ?? null, s = o ? fh(o) : [], l = s.filter(
    (x) => Array.isArray(x == null ? void 0 : x.values) && x.values.length > 0
  ), u = vp(s), d = s.map((x) => typeof (x == null ? void 0 : x.id) == "string" ? x.id : null).filter((x) => !!x), m = a ?? r, f = o ? pt(o) : [];
  let g = Hd(m);
  const p = Jh(g, f);
  JSON.stringify(p) !== JSON.stringify(g) && (g = p, qd(m, p).catch((x) => {
    console.warn("eidolon-utilities | Failed to persist migrated light criteria keys", x);
  })), _("LightCriteria | Loaded mapping state", {
    hasBase: !!(g != null && g.base),
    mappingCount: Array.isArray(g == null ? void 0 : g.mappings) ? g.mappings.length : 0,
    mappings: Array.isArray(g == null ? void 0 : g.mappings) ? g.mappings.map((x) => {
      var z, Z;
      return {
        id: x.id,
        key: x.key,
        hasColor: !!((Z = (z = x.config) == null ? void 0 : z.config) != null && Z.color)
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
  const $ = document.createElement("label");
  $.classList.add("eidolon-light-criteria__switcher-label");
  const j = `${(n == null ? void 0 : n.id) ?? (r == null ? void 0 : r.id) ?? "eidolon-light"}-mapping-select`;
  $.htmlFor = j, $.textContent = E("EIDOLON.LightCriteria.SelectLabel", "Criteria Mapping"), M.appendChild($);
  const D = document.createElement("details");
  D.classList.add("eidolon-light-criteria__filter-details");
  const P = document.createElement("summary");
  P.classList.add("eidolon-light-criteria__filter-summary");
  const N = document.createElement("span");
  N.classList.add("eidolon-light-criteria__filter-summary-label"), N.textContent = E(
    "EIDOLON.LightCriteria.FilterHeading",
    "Filter mappings"
  ), P.appendChild(N);
  const R = document.createElement("span");
  R.classList.add("eidolon-light-criteria__filter-meta"), P.appendChild(R), D.appendChild(P);
  const B = document.createElement("div");
  B.classList.add("eidolon-light-criteria__filter-panel");
  const W = document.createElement("div");
  W.classList.add("eidolon-light-criteria__filter-grid");
  for (const x of l) {
    const z = document.createElement("label");
    z.classList.add("eidolon-light-criteria__filter");
    const Z = document.createElement("span");
    Z.classList.add("eidolon-light-criteria__filter-name"), Z.textContent = (rr = (Yn = x.name) == null ? void 0 : Yn.trim) != null && rr.call(Yn) ? x.name.trim() : E("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), z.appendChild(Z);
    const ee = document.createElement("select");
    ee.dataset.filterCategoryId = x.id, ee.classList.add("eidolon-light-criteria__filter-select");
    const ne = document.createElement("option");
    ne.value = "", ne.textContent = E("EIDOLON.LightCriteria.FilterAny", "Any"), ee.appendChild(ne);
    for (const ue of x.values) {
      const de = document.createElement("option");
      de.value = ue, de.textContent = ue, ee.appendChild(de);
    }
    z.appendChild(ee), W.appendChild(z);
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
  const Ii = document.createElement("p");
  Ii.classList.add("notes"), Ii.textContent = E(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ), Ae.appendChild(Ii);
  const Zt = document.createElement("div");
  Zt.classList.add("eidolon-light-criteria__category-list"), Ae.appendChild(Zt);
  for (const x of l) {
    const z = document.createElement("label");
    z.classList.add("eidolon-light-criteria__category");
    const Z = document.createElement("span");
    Z.classList.add("eidolon-light-criteria__category-name"), Z.textContent = (xc = (ra = x.name) == null ? void 0 : ra.trim) != null && xc.call(ra) ? x.name.trim() : E("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), z.appendChild(Z);
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
    z.appendChild(ee), Zt.appendChild(z);
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
  ), Wn.appendChild(en), Ae.appendChild(Wn), v.appendChild(Ae), i.prepend(Qt), i.appendChild(v), v.hidden = !0, up(n, {
    fieldset: v,
    homeContainer: i
  }), requestAnimationFrame(() => {
    var x;
    (x = n.setPosition) == null || x.call(n, { height: "auto" });
  });
  let F = g;
  Xn({ switcher: M, emptyState: Je, state: F }), Jn(O, F), lr(A, {
    state: F,
    hasCategories: l.length > 0
  }), _("LightCriteria | Controls injected", {
    sceneId: (o == null ? void 0 : o.id) ?? null,
    lightId: (r == null ? void 0 : r.id) ?? null,
    hasBase: !!(F != null && F.base),
    mappingCount: Array.isArray(F == null ? void 0 : F.mappings) ? F.mappings.length : 0,
    categories: l.length
  });
  const na = Lp(F), X = {
    restoreConfig: null,
    app: n,
    selectedMapping: na,
    editorMode: "create",
    editingMappingId: null,
    mappingFilters: {}
  };
  Ia.set(v, X);
  const bt = /* @__PURE__ */ c(() => {
    te.open = !1;
  }, "closeActionsMenu");
  Xt.addEventListener("click", (x) => {
    te.classList.contains("is-disabled") && (x.preventDefault(), bt());
  });
  const Ne = /* @__PURE__ */ c((x = X.selectedMapping) => {
    const z = wp(W), Z = Array.isArray(F == null ? void 0 : F.mappings) ? F.mappings : [], ee = Sp(Z, z), ne = Object.keys(z).length;
    X.mappingFilters = z, U.disabled = ne === 0, Cp(R, {
      totalCount: Z.length,
      visibleCount: ee.length,
      hasFilters: ne > 0,
      activeFilterCount: ne
    }), D.classList.toggle("has-active-filters", ne > 0), Tp(ae, F, u, x, {
      mappings: ee,
      categoryOrder: d
    }), X.selectedMapping = ae.value ?? "", Ss({
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
      const z = X.selectedMapping;
      Ne(z), X.selectedMapping !== z && Cs(
        a ?? r,
        F,
        X.selectedMapping
      ).then((Z) => {
        Z && (F = Z);
      });
    });
  }), U.addEventListener("click", () => {
    Ep(W);
    const x = X.selectedMapping;
    Ne(x), D.open = !1, X.selectedMapping !== x && Cs(
      a ?? r,
      F,
      X.selectedMapping
    ).then((z) => {
      z && (F = z);
    });
  }), ae.addEventListener("change", () => {
    X.selectedMapping = ae.value ?? "", Ss({
      mappingSelect: ae,
      applyMappingButton: Q,
      updateMappingButton: Pe,
      editCriteriaButton: at,
      removeMappingButton: ot,
      actionsMenu: te,
      state: F
    }), Cs(
      a ?? r,
      F,
      X.selectedMapping
    ).then((x) => {
      x && (F = x);
    });
  });
  const ir = /* @__PURE__ */ c(async () => {
    var ee, ne, ue, de, lt, mn, ct, hn, pe, gn, pn, Dt, Kn, ar;
    const x = ae.value ?? "";
    if (!x) {
      (ne = (ee = ui.notifications) == null ? void 0 : ee.warn) == null || ne.call(
        ee,
        E(
          "EIDOLON.LightCriteria.SelectMappingWarning",
          "Choose a criteria mapping before applying."
        )
      ), Ne(X.selectedMapping);
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
      ha(v, Ae, A), Aa(n, t, F.base), F = await br(a ?? r, {
        mappingId: ve,
        categories: null,
        updatedAt: Date.now()
      }), X.selectedMapping = ve, Ne(X.selectedMapping), Jn(O, F), Xn({ switcher: M, emptyState: Je, state: F }), lr(A, {
        state: F,
        hasCategories: l.length > 0
      }), lu(t, {
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
    const z = Array.isArray(F == null ? void 0 : F.mappings) && F.mappings.length ? F.mappings.find((Oi) => (Oi == null ? void 0 : Oi.id) === x) : null;
    if (!z) {
      (gn = (pe = ui.notifications) == null ? void 0 : pe.warn) == null || gn.call(
        pe,
        E(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      ), X.selectedMapping = "", Ne(X.selectedMapping);
      return;
    }
    ha(v, Ae, A), Aa(n, t, z.config), F = await br(a ?? r, {
      mappingId: z.id,
      categories: z.categories,
      updatedAt: Date.now()
    }), X.selectedMapping = z.id, Ne(X.selectedMapping), Jn(O, F), Xn({ switcher: M, emptyState: Je, state: F }), lr(A, {
      state: F,
      hasCategories: l.length > 0
    }), lu(t, {
      mappingId: z.id,
      color: ((Dt = (pn = z.config) == null ? void 0 : pn.config) == null ? void 0 : Dt.color) ?? null
    });
    const Z = Ui(z, u, d);
    (ar = (Kn = ui.notifications) == null ? void 0 : Kn.info) == null || ar.call(
      Kn,
      E(
        "EIDOLON.LightCriteria.MappingApplied",
        "Applied mapping: {label}"
      ).replace("{label}", Z)
    ), bt();
  }, "applySelectedMapping");
  Q.addEventListener("click", () => {
    ir();
  }), ae.addEventListener("keydown", (x) => {
    x.key === "Enter" && (x.preventDefault(), ir());
  });
  const ia = /* @__PURE__ */ c(async () => {
    var z, Z, ee, ne, ue, de, lt, mn, ct, hn, pe, gn, pn, Dt, Kn, ar, Oi, aa, $c, oa, Fc;
    const x = X.selectedMapping;
    if (!x) {
      (Z = (z = ui.notifications) == null ? void 0 : z.warn) == null || Z.call(
        z,
        E(
          "EIDOLON.LightCriteria.SelectMappingWarning",
          "Choose a criteria mapping before applying."
        )
      );
      return;
    }
    Pe.disabled = !0;
    try {
      const Xe = Oa(n, a);
      if (x === ve)
        F = await Zc(a ?? r, Xe), _("LightCriteria | Base lighting updated", {
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
        const Ai = vr(F, x);
        if (!Ai) {
          (mn = (lt = ui.notifications) == null ? void 0 : lt.warn) == null || mn.call(
            lt,
            E(
              "EIDOLON.LightCriteria.MappingUnavailable",
              "The selected criteria mapping is no longer available."
            )
          ), X.selectedMapping = "", Ne(X.selectedMapping);
          return;
        }
        F = await eu(
          a ?? r,
          Ai.categories,
          Xe,
          { label: Ai.label ?? null }
        ), _("LightCriteria | Mapping updated", {
          mappingId: x,
          hasColor: !!((ct = Xe == null ? void 0 : Xe.config) != null && ct.color),
          stored: Array.isArray(F == null ? void 0 : F.mappings) ? ((hn = F.mappings.find((ls) => (ls == null ? void 0 : ls.id) === x)) == null ? void 0 : hn.config) ?? null : null,
          persisted: (gn = (pe = a ?? r) == null ? void 0 : pe.getFlag) == null ? void 0 : gn.call(pe, bi, Bi)
        });
        const or = vr(F, x), Lm = Ui(or || Ai, u, d);
        _("LightCriteria | Mapping updated", {
          mappingId: x,
          categories: Ai.categories,
          updatedColor: ((pn = Xe == null ? void 0 : Xe.config) == null ? void 0 : pn.color) ?? null,
          storedColor: ((Kn = (Dt = or == null ? void 0 : or.config) == null ? void 0 : Dt.config) == null ? void 0 : Kn.color) ?? ((Oi = (ar = Ai.config) == null ? void 0 : ar.config) == null ? void 0 : Oi.color) ?? null
        }), ($c = (aa = ui.notifications) == null ? void 0 : aa.info) == null || $c.call(
          aa,
          E(
            "EIDOLON.LightCriteria.MappingUpdated",
            "Saved changes to mapping: {label}"
          ).replace("{label}", Lm)
        ), X.selectedMapping = x;
      }
      Jn(O, F), Xn({ switcher: M, emptyState: Je, state: F }), lr(A, {
        state: F,
        hasCategories: l.length > 0
      }), Ne(X.selectedMapping), bt();
    } catch (Xe) {
      console.error("eidolon-utilities | Failed to update light criteria mapping", Xe), (Fc = (oa = ui.notifications) == null ? void 0 : oa.error) == null || Fc.call(
        oa,
        E(
          "EIDOLON.LightCriteria.MappingUpdateError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      Pe.disabled = !1, Ss({
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
    ia();
  }), Ne(X.selectedMapping), I.addEventListener("click", async () => {
    var x, z, Z, ee, ne, ue;
    I.disabled = !0;
    try {
      const de = Oa(n, a);
      F = await Zc(a ?? r, de), _("LightCriteria | Base lighting stored", {
        lightId: ((x = a ?? r) == null ? void 0 : x.id) ?? null,
        configColor: ((z = de == null ? void 0 : de.config) == null ? void 0 : z.color) ?? null
      }), (ee = (Z = ui.notifications) == null ? void 0 : Z.info) == null || ee.call(
        Z,
        E(
          "EIDOLON.LightCriteria.BaseStored",
          "Saved the current configuration as the base lighting state."
        )
      ), Jn(O, F), Xn({ switcher: M, emptyState: Je, state: F }), lr(A, {
        state: F,
        hasCategories: l.length > 0
      }), X.selectedMapping = ve, Ne(X.selectedMapping);
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
    var z, Z, ee, ne;
    if (!(F != null && F.base)) {
      (Z = (z = ui.notifications) == null ? void 0 : z.warn) == null || Z.call(
        z,
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
    const x = Ia.get(v);
    su({
      app: n,
      fieldset: v,
      createButton: A,
      creationSection: Ae,
      categoryList: Zt,
      form: t,
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
    const z = vr(F, x);
    if (!z) {
      (ue = (ne = ui.notifications) == null ? void 0 : ne.warn) == null || ue.call(
        ne,
        E(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      );
      return;
    }
    bt(), cf(n, { fieldset: v, homeContainer: i }), su({
      app: n,
      fieldset: v,
      createButton: A,
      creationSection: Ae,
      categoryList: Zt,
      form: t,
      persistedLight: a,
      stateEntry: X,
      mode: "retarget",
      mapping: z,
      preloadConfig: z.config
    });
  }), st.addEventListener("click", async () => {
    var z, Z, ee, ne, ue, de, lt, mn, ct, hn;
    const x = Ap(Zt);
    if (!x) {
      (Z = (z = ui.notifications) == null ? void 0 : z.warn) == null || Z.call(
        z,
        E(
          "EIDOLON.LightCriteria.SelectionRequired",
          "Select at least one criteria value to identify the mapping."
        )
      );
      return;
    }
    st.disabled = !0;
    try {
      const pe = Oa(n, a);
      if (X.editorMode === "retarget" && X.editingMappingId) {
        const pn = Ll(F, x);
        let Dt = !1;
        if (pn && pn !== X.editingMappingId && (Dt = await lp(), !Dt)) {
          st.disabled = !1;
          return;
        }
        F = await Wh(
          a ?? r,
          X.editingMappingId,
          x,
          pe,
          { replaceExisting: Dt }
        ), _("LightCriteria | Mapping criteria retargeted", {
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
        F = await eu(
          a ?? r,
          x,
          pe,
          {}
        ), _("LightCriteria | Mapping saved from editor", {
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
      const gn = Ll(F, x);
      gn && (X.selectedMapping = gn), Ne(X.selectedMapping), ha(v, Ae, A), bt();
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
    const x = Ia.get(v);
    x != null && x.restoreConfig && Aa(n, t, x.restoreConfig), ha(v, Ae, A);
  }), ot.addEventListener("click", async () => {
    var Z, ee;
    const x = X.selectedMapping;
    !x || x === ve || !await cp() || (F = await Yh(a ?? r, x), X.selectedMapping = "", Jn(O, F), Xn({ switcher: M, emptyState: Je, state: F }), Ne(X.selectedMapping), bt(), (ee = (Z = ui.notifications) == null ? void 0 : Z.info) == null || ee.call(
      Z,
      E("EIDOLON.LightCriteria.MappingRemoved", "Removed selected mapping.")
    ));
  });
}
c(sp, "enhanceAmbientLightConfig");
function su({
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
  s && (s.restoreConfig = Oa(n, o), s.editorMode = l, s.editingMappingId = l === "retarget" ? (u == null ? void 0 : u.id) ?? null : null), d && Aa(n, a, d), l === "retarget" && (u != null && u.categories) ? Op(r, u.categories) : Ip(r);
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
c(su, "openMappingEditor");
async function lp() {
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
c(lp, "confirmCriteriaConflict");
async function cp() {
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
c(cp, "confirmRemoveMapping");
function up(n, { fieldset: e, homeContainer: t }) {
  const i = mp(n, t);
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
    o.preventDefault(), cf(n, { fieldset: e, homeContainer: t });
  };
}
c(up, "ensureManagerHeaderButton");
function cf(n, { fieldset: e, homeContainer: t }) {
  var f, g, p;
  const i = ma.get(n);
  if (i != null && i.rendered) {
    (f = i.bringToTop) == null || f.call(i);
    return;
  }
  const r = /* @__PURE__ */ c((...y) => {
    var w;
    const v = dp(y), b = (w = v == null ? void 0 : v.querySelector) == null ? void 0 : w.call(v, ".eidolon-light-criteria-manager-host");
    b instanceof HTMLElement && (fp(e), e.hidden = !1, b.appendChild(e));
  }, "onRender"), a = /* @__PURE__ */ c(() => {
    t instanceof HTMLElement && t.appendChild(e), e.hidden = !0, ma.delete(n), requestAnimationFrame(() => {
      var y;
      (y = n.setPosition) == null || y.call(n, { height: "auto" });
    });
  }, "onClose"), o = E("EIDOLON.LightCriteria.ManagerTitle", "Scene Criteria Lighting"), s = '<div class="eidolon-light-criteria-manager-host"></div>', l = E("EIDOLON.LightCriteria.Close", "Close"), u = (p = (g = foundry == null ? void 0 : foundry.applications) == null ? void 0 : g.api) == null ? void 0 : p.DialogV2;
  if (typeof (u == null ? void 0 : u.wait) == "function")
    try {
      let y = !1;
      const v = /* @__PURE__ */ c(() => {
        y || (y = !0, a());
      }, "closeOnce");
      ma.set(n, {
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
  ma.set(n, m), m.render(!0);
}
c(cf, "openManagerDialog");
function dp(n) {
  for (const e of n) {
    const t = Kt(e);
    if (t) return t;
    const i = Kt(e == null ? void 0 : e.element);
    if (i) return i;
  }
  return null;
}
c(dp, "findDialogRoot");
function fp(n) {
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
c(fp, "applyManagerLayout");
function mp(n, e) {
  var i;
  const t = Kt(n == null ? void 0 : n.element);
  return t || (((i = e == null ? void 0 : e.closest) == null ? void 0 : i.call(e, ".application")) ?? null);
}
c(mp, "resolveApplicationRoot");
function ha(n, e, t) {
  const i = Ia.get(n);
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
c(ha, "hideCreationSection");
function Jn(n, e) {
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
c(Jn, "updateStatusLine");
function lr(n, { state: e, hasCategories: t }) {
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
c(lr, "updateCreateButtonState");
function Oa(n, e) {
  var l, u, d;
  const t = e ?? uf(n);
  if (!t)
    throw new Error("Ambient light document unavailable.");
  const i = Ci(((l = t.toObject) == null ? void 0 : l.call(t)) ?? {});
  if (!i)
    throw new Error("Unable to duplicate ambient light data.");
  const r = (n == null ? void 0 : n.form) instanceof HTMLFormElement ? n.form : null, a = r ? Qm(r) : {}, o = foundry.utils.mergeObject(i, a, {
    inplace: !1,
    performDeletions: !0
  });
  r && (r.querySelectorAll("color-picker[name]").forEach((m) => {
    var b, w;
    const f = m.getAttribute("name");
    if (!f) return;
    const g = typeof m.value == "string" ? m.value : "", p = ((b = m.ui) == null ? void 0 : b.input) ?? ((w = m.querySelector) == null ? void 0 : w.call(m, 'input[type="color"]')), y = (p == null ? void 0 : p.value) ?? "", v = g || y;
    typeof v != "string" || !v || (foundry.utils.setProperty(o, f, v), _("LightCriteria | Captured color-picker value", {
      path: f,
      pickerValue: g,
      swatchValue: y,
      chosenValue: v
    }));
  }), r.querySelectorAll("range-picker[name]").forEach((m) => {
    var A, O;
    const f = m.getAttribute("name");
    if (!f) return;
    const g = m.value !== void 0 && m.value !== null ? String(m.value) : "", p = (A = m.querySelector) == null ? void 0 : A.call(m, 'input[type="range"]'), y = (O = m.querySelector) == null ? void 0 : O.call(m, 'input[type="number"]'), v = p instanceof HTMLInputElement ? p.value : "", b = y instanceof HTMLInputElement ? y.value : "", w = g || b || v;
    if (typeof w != "string" || !w.length) return;
    const C = Number(w), I = Number.isFinite(C) ? C : w;
    foundry.utils.setProperty(o, f, I), _("LightCriteria | Captured range-picker value", {
      path: f,
      elementValue: g,
      numberValue: b,
      rangeValue: v,
      chosenValue: I
    });
  }));
  const s = Ci(o);
  return _("LightCriteria | Captured form config", {
    lightId: (t == null ? void 0 : t.id) ?? null,
    hasColor: !!((u = s == null ? void 0 : s.config) != null && u.color),
    color: ((d = s == null ? void 0 : s.config) == null ? void 0 : d.color) ?? null
  }), s;
}
c(Oa, "captureAmbientLightFormConfig");
function Aa(n, e, t) {
  if (!t || typeof t != "object") return;
  const i = foundry.utils.flattenObject(t, { safe: !0 });
  for (const [r, a] of Object.entries(i)) {
    const o = e.querySelectorAll(`[name="${r}"]`);
    if (o.length) {
      _("LightCriteria | Applying field", {
        path: r,
        value: a,
        elementCount: o.length
      });
      for (const s of o)
        s instanceof HTMLElement && s.tagName === "COLOR-PICKER" ? gp(s, a) : s instanceof HTMLElement && s.tagName === "RANGE-PICKER" ? pp(s, a) : s instanceof HTMLInputElement ? hp(s, a) : s instanceof HTMLSelectElement ? yp(s, a) : s instanceof HTMLTextAreaElement && bp(s, a);
    }
  }
  requestAnimationFrame(() => {
    var r;
    return (r = n._previewChanges) == null ? void 0 : r.call(n);
  });
}
c(Aa, "applyConfigToForm");
function hp(n, e, t) {
  const i = n.type;
  if (i === "checkbox") {
    const o = !!e;
    n.checked !== o && (n.checked = o, $t(n));
    return;
  }
  if (i === "radio") {
    const o = e == null ? "" : String(e), s = n.value === o;
    n.checked !== s && (n.checked = s, s && $t(n));
    return;
  }
  const r = e == null ? "" : String(e);
  let a = !1;
  n.value !== r && (n.value = r, a = !0), a && $t(n);
}
c(hp, "applyValueToInput");
function gp(n, e, t) {
  var s, l, u, d, m, f;
  const i = e == null ? "" : String(e);
  let r = !1;
  n.value !== i && (n.value = i, n.setAttribute("value", i), (s = n.ui) != null && s.setValue && n.ui.setValue(i), r = !0);
  const a = ((l = n.ui) == null ? void 0 : l.input) ?? ((u = n.querySelector) == null ? void 0 : u.call(n, 'input[type="color"]'));
  a instanceof HTMLInputElement && a.value !== i && (a.value = i, $t(a));
  const o = ((d = n.ui) == null ? void 0 : d.text) ?? ((m = n.querySelector) == null ? void 0 : m.call(n, 'input[type="text"]'));
  o instanceof HTMLInputElement && o.value !== i && (o.value = i, $t(o)), (f = n.ui) != null && f.commit ? n.ui.commit() : (n.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), n.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }))), _("LightCriteria | Color picker applied", {
    value: i,
    pickerValue: n.value ?? null,
    swatchValue: (a == null ? void 0 : a.value) ?? null,
    textValue: (o == null ? void 0 : o.value) ?? null
  }), r && $t(n);
}
c(gp, "applyValueToColorPicker");
function pp(n, e, t) {
  var u, d;
  const i = e == null ? "" : String(e), r = Number(i), a = Number.isFinite(r) ? r : i;
  let o = !1;
  n.value !== void 0 && n.value !== a && (n.value = a, o = !0), n.getAttribute("value") !== i && (n.setAttribute("value", i), o = !0);
  const s = (u = n.querySelector) == null ? void 0 : u.call(n, 'input[type="range"]');
  s instanceof HTMLInputElement && s.value !== i && (s.value = i, $t(s));
  const l = (d = n.querySelector) == null ? void 0 : d.call(n, 'input[type="number"]');
  if (l instanceof HTMLInputElement && l.value !== i && (l.value = i, $t(l)), typeof n.commit == "function")
    try {
      n.commit();
    } catch (m) {
      console.error("eidolon-utilities | range-picker commit failed", m);
    }
  _("LightCriteria | Range picker applied", {
    value: i,
    resolvedValue: a,
    rangeValue: (s == null ? void 0 : s.value) ?? null,
    numberValue: (l == null ? void 0 : l.value) ?? null
  }), o && $t(n);
}
c(pp, "applyValueToRangePicker");
function yp(n, e, t) {
  const i = e == null ? "" : String(e);
  n.value !== i && (n.value = i, $t(n));
}
c(yp, "applyValueToSelect");
function bp(n, e, t) {
  const i = e == null ? "" : String(e);
  n.value !== i && (n.value = i, $t(n));
}
c(bp, "applyValueToTextarea");
function $t(n) {
  n.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), n.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }));
}
c($t, "triggerInputChange");
function Ss({
  mappingSelect: n,
  applyMappingButton: e,
  updateMappingButton: t,
  editCriteriaButton: i,
  removeMappingButton: r,
  actionsMenu: a,
  state: o
}) {
  const s = (n == null ? void 0 : n.value) ?? "", l = !!(o != null && o.base), u = s && s !== ve ? !!vr(o, s) : !1;
  if (e instanceof HTMLButtonElement && (s ? s === ve ? e.disabled = !l : e.disabled = !u : e.disabled = !0), t instanceof HTMLButtonElement && (s ? s === ve ? t.disabled = !1 : t.disabled = !u : t.disabled = !0), i instanceof HTMLButtonElement && (i.disabled = !s || s === ve || !u), r instanceof HTMLButtonElement && (r.disabled = !s || s === ve || !u), a instanceof HTMLElement) {
    const d = t instanceof HTMLButtonElement && !t.disabled || i instanceof HTMLButtonElement && !i.disabled || r instanceof HTMLButtonElement && !r.disabled;
    a.classList.toggle("is-disabled", !d), !d && "open" in a && (a.open = !1);
  }
}
c(Ss, "syncMappingSwitcherState");
function vp(n) {
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
c(vp, "buildCategoryNameLookup");
function wp(n) {
  const e = {};
  return n instanceof HTMLElement && n.querySelectorAll("select[data-filter-category-id]").forEach((t) => {
    var a, o;
    const i = t.dataset.filterCategoryId, r = (o = (a = t.value) == null ? void 0 : a.trim) == null ? void 0 : o.call(a);
    !i || !r || (e[i] = r);
  }), e;
}
c(wp, "readMappingFilterSelections");
function Ep(n) {
  n instanceof HTMLElement && n.querySelectorAll("select[data-filter-category-id]").forEach((e) => {
    e.value = "";
  });
}
c(Ep, "resetMappingFilterSelections");
function Sp(n, e) {
  const t = Array.isArray(n) ? n : [], i = Object.entries(e ?? {}).filter(([, r]) => !!r);
  return i.length ? t.filter((r) => {
    if (!r || typeof r != "object") return !1;
    const a = r.categories ?? {};
    for (const [o, s] of i)
      if ((a == null ? void 0 : a[o]) !== s) return !1;
    return !0;
  }) : t.slice();
}
c(Sp, "filterMappingsByCriteria");
function Cp(n, { totalCount: e = 0, visibleCount: t = 0, hasFilters: i = !1, activeFilterCount: r = 0 } = {}) {
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
c(Cp, "updateMappingFilterMeta");
function Tp(n, e, t, i, r = {}) {
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
  ), m.disabled = !o, n.appendChild(m), l.slice().sort((y, v) => {
    var C;
    const b = Ui(y, t, s), w = Ui(v, t, s);
    return b.localeCompare(w, ((C = game.i18n) == null ? void 0 : C.lang) ?? void 0, {
      sensitivity: "base"
    });
  }).forEach((y) => {
    if (!(y != null && y.id)) return;
    const v = document.createElement("option");
    v.value = y.id, v.textContent = Ui(y, t, s), n.appendChild(v);
  });
  const f = new Set(
    Array.from(n.options).filter((y) => !y.disabled).map((y) => y.value)
  ), g = o && u === "" ? "" : u, p = a || (f.has(g) ? g : "");
  p && f.has(p) ? n.value = p : o ? n.value = ve : n.value = "";
}
c(Tp, "populateMappingSelector");
function Ui(n, e, t = []) {
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
c(Ui, "formatMappingOptionLabel");
function Ll(n, e) {
  if (!n || typeof n != "object" || !Array.isArray(n.mappings)) return null;
  const t = tr(e);
  if (!t) return null;
  const i = n.mappings.find((r) => (r == null ? void 0 : r.key) === t);
  return (i == null ? void 0 : i.id) ?? null;
}
c(Ll, "findMappingIdByCategories");
function vr(n, e) {
  return !e || !n || typeof n != "object" || !Array.isArray(n.mappings) ? null : n.mappings.find((t) => (t == null ? void 0 : t.id) === e) ?? null;
}
c(vr, "getMappingById");
function Lp(n) {
  if (!n || typeof n != "object") return "";
  const e = n.current;
  if (e != null && e.mappingId) {
    if (e.mappingId === ve)
      return n != null && n.base ? ve : "";
    if (Array.isArray(n.mappings) && n.mappings.some((t) => t.id === e.mappingId))
      return e.mappingId;
  }
  if (e != null && e.categories) {
    const t = Ll(n, e.categories);
    if (t) return t;
  }
  return "";
}
c(Lp, "resolveInitialMappingSelection");
function lu(n, e = {}) {
  var o, s, l, u;
  if (!(n instanceof HTMLFormElement)) return;
  const t = n.querySelector('color-picker[name="config.color"]'), i = (t == null ? void 0 : t.value) ?? null, r = ((o = t == null ? void 0 : t.ui) == null ? void 0 : o.text) ?? ((s = t == null ? void 0 : t.querySelector) == null ? void 0 : s.call(t, 'input[type="text"]')), a = ((l = t == null ? void 0 : t.ui) == null ? void 0 : l.input) ?? ((u = t == null ? void 0 : t.querySelector) == null ? void 0 : u.call(t, 'input[type="color"]'));
  _("LightCriteria | Color state after apply", {
    ...e,
    textValue: (r == null ? void 0 : r.value) ?? null,
    pickerValue: i,
    swatchValue: (a == null ? void 0 : a.value) ?? null
  });
}
c(lu, "logAppliedColorState");
function Ip(n) {
  n.querySelectorAll("select[data-category-id]").forEach((e) => {
    e.value = "";
  });
}
c(Ip, "resetCategorySelections");
function Op(n, e) {
  const t = e && typeof e == "object" ? e : {};
  n.querySelectorAll("select[data-category-id]").forEach((i) => {
    const r = i.dataset.categoryId;
    if (!r) return;
    const a = t[r];
    i.value = typeof a == "string" ? a : "";
  });
}
c(Op, "setCategorySelections");
function Ap(n) {
  const e = {};
  return n.querySelectorAll("select[data-category-id]").forEach((t) => {
    var a, o;
    const i = t.dataset.categoryId, r = (o = (a = t.value) == null ? void 0 : a.trim) == null ? void 0 : o.call(a);
    !i || !r || (e[i] = r);
  }), Object.keys(e).length > 0 ? e : null;
}
c(Ap, "readCategorySelections");
async function Cs(n, e, t) {
  if (!n) return null;
  try {
    if (!t)
      return await br(n, {});
    if (t === ve)
      return await br(n, {
        mappingId: ve,
        categories: null,
        updatedAt: Date.now()
      });
    const i = vr(e, t);
    return i ? await br(n, {
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
function Xn({ switcher: n, emptyState: e, state: t }) {
  const i = !!(t != null && t.base);
  n instanceof HTMLElement && (n.hidden = !i), e instanceof HTMLElement && (e.hidden = i);
}
c(Xn, "updateActiveMappingVisibility");
function uf(n) {
  const e = (n == null ? void 0 : n.object) ?? (n == null ? void 0 : n.document) ?? null;
  return !(e != null && e.isEmbedded) || e.documentName !== "AmbientLight" ? null : e;
}
c(uf, "getAmbientLightDocument");
function kp(n) {
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
c(kp, "getPersistedAmbientLightDocument");
function Mp() {
  ap();
}
c(Mp, "registerLightCriteriaHooks");
Mp();
const Il = /* @__PURE__ */ new Map();
let Ol = !1;
function yc(n, e) {
  Il.has(n) && console.warn(`[${T}] Socket handler for type "${n}" already registered, overwriting.`), Il.set(n, e);
}
c(yc, "registerSocketHandler");
function ka(n, e) {
  if (!Ol) {
    console.error(`[${T}] Socket not initialized. Call initializeSocket() first.`);
    return;
  }
  game.socket.emit(`module.${T}`, { type: n, payload: e });
}
c(ka, "emitSocket");
function _p() {
  Ol || (game.socket.on(`module.${T}`, (n) => {
    const { type: e, payload: t } = n ?? {}, i = Il.get(e);
    i ? i(t) : console.warn(`[${T}] No socket handler for type "${e}"`);
  }), Ol = !0, console.log(`[${T}] Socket initialized on channel module.${T}`));
}
c(_p, "initializeSocket");
const df = "tween", ff = "tween-sequence", Al = "tween-sequence-cancel", Ie = Object.freeze({
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
}), Qa = /* @__PURE__ */ new Map();
function Ft({ type: n, execute: e, validate: t }) {
  Qa.has(n) && console.warn(`[tween-registry] Type "${n}" already registered, overwriting.`), Qa.set(n, { type: n, execute: e, validate: t ?? (() => {
  }) });
}
c(Ft, "registerTweenType");
function nr(n) {
  return Qa.get(n);
}
c(nr, "getTweenType");
function Np(n, e = {}) {
  const t = nr(n);
  if (!t)
    throw new Error(`Unknown tween type: "${n}".`);
  return t.validate(e ?? {}), t;
}
c(Np, "validateTweenEntry");
function kl() {
  return [...Qa.keys()];
}
c(kl, "listTweenTypes");
const Vi = {
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
  easeInBounce: /* @__PURE__ */ c((n) => 1 - Vi.easeOutBounce(1 - n), "easeInBounce"),
  easeInOutBounce: /* @__PURE__ */ c((n) => n < 0.5 ? (1 - Vi.easeOutBounce(1 - 2 * n)) / 2 : (1 + Vi.easeOutBounce(2 * n - 1)) / 2, "easeInOutBounce"),
  easeInElastic: /* @__PURE__ */ c((n) => n === 0 || n === 1 ? n : -Math.pow(2, 10 * (n - 1)) * Math.sin((n - 1.1) * 5 * Math.PI), "easeInElastic"),
  easeOutElastic: /* @__PURE__ */ c((n) => n === 0 || n === 1 ? n : Math.pow(2, -10 * n) * Math.sin((n - 0.1) * 5 * Math.PI) + 1, "easeOutElastic")
};
function rt(n) {
  if (n && Vi[n])
    return Vi[n];
  const e = foundry.canvas.animation.CanvasAnimation;
  return {
    linear: e.easeLinear,
    easeInOutCosine: e.easeInOutCosine
  }[n] ?? e.easeInOutCosine;
}
c(rt, "resolveEasing");
function bc() {
  return ["linear", "easeInOutCosine", ...Object.keys(Vi)];
}
c(bc, "listEasingNames");
function Za(n) {
  return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
}
c(Za, "srgbToLinear");
function zi(n) {
  return n <= 31308e-7 ? 12.92 * n : 1.055 * n ** (1 / 2.4) - 0.055;
}
c(zi, "linearToSrgb");
function cu(n, e, t) {
  const i = 0.4122214708 * n + 0.5363325363 * e + 0.0514459929 * t, r = 0.2119034982 * n + 0.6806995451 * e + 0.1073969566 * t, a = 0.0883024619 * n + 0.2817188376 * e + 0.6299787005 * t, o = Math.cbrt(i), s = Math.cbrt(r), l = Math.cbrt(a);
  return [
    0.2104542553 * o + 0.793617785 * s - 0.0040720468 * l,
    1.9779984951 * o - 2.428592205 * s + 0.4505937099 * l,
    0.0259040371 * o + 0.7827717662 * s - 0.808675766 * l
  ];
}
c(cu, "linearRgbToOklab");
function xp(n, e, t) {
  const i = (n + 0.3963377774 * e + 0.2158037573 * t) ** 3, r = (n - 0.1055613458 * e - 0.0638541728 * t) ** 3, a = (n - 0.0894841775 * e - 1.291485548 * t) ** 3;
  return [
    4.0767416621 * i - 3.3077115913 * r + 0.2309699292 * a,
    -1.2684380046 * i + 2.6097574011 * r - 0.3413193965 * a,
    -0.0041960863 * i - 0.7034186147 * r + 1.707614701 * a
  ];
}
c(xp, "oklabToLinearRgb");
function eo(n) {
  return [n.r, n.g, n.b];
}
c(eo, "colorToRgb");
function mf(n, e, t) {
  const i = /* @__PURE__ */ c((a) => Math.max(0, Math.min(1, a)), "clamp"), r = /* @__PURE__ */ c((a) => Math.round(i(a) * 255).toString(16).padStart(2, "0"), "toHex");
  return `#${r(n)}${r(e)}${r(t)}`;
}
c(mf, "rgbToHex");
function $p(n, e, t) {
  if (t <= 0) return n.toHTML();
  if (t >= 1) return e.toHTML();
  const i = foundry.utils.Color, [r, a, o] = n.hsl, [s, l, u] = e.hsl, d = (s - r + 0.5) % 1 - 0.5, m = (r + d * t + 1) % 1, f = a + (l - a) * t, g = o + (u - o) * t;
  return i.fromHSL([m, f, g]).toHTML();
}
c($p, "interpolateHsl");
function Fp(n, e, t) {
  if (t <= 0) return n.toHTML();
  if (t >= 1) return e.toHTML();
  const [i, r, a] = eo(n).map(Za), [o, s, l] = eo(e).map(Za), u = zi(i + (o - i) * t), d = zi(r + (s - r) * t), m = zi(a + (l - a) * t);
  return mf(u, d, m);
}
c(Fp, "interpolateRgb");
function Dp(n, e, t) {
  if (t <= 0) return n.toHTML();
  if (t >= 1) return e.toHTML();
  const [i, r, a] = eo(n).map(Za), [o, s, l] = eo(e).map(Za), [u, d, m] = cu(i, r, a), [f, g, p] = cu(o, s, l), y = 0.02, v = Math.sqrt(d * d + m * m), b = Math.sqrt(g * g + p * p);
  let w, C, I;
  if (v < y || b < y)
    w = u + (f - u) * t, C = d + (g - d) * t, I = m + (p - m) * t;
  else {
    const $ = Math.atan2(m, d);
    let D = Math.atan2(p, g) - $;
    D > Math.PI && (D -= 2 * Math.PI), D < -Math.PI && (D += 2 * Math.PI), w = u + (f - u) * t;
    const P = v + (b - v) * t, N = $ + D * t;
    C = P * Math.cos(N), I = P * Math.sin(N);
  }
  const [A, O, M] = xp(w, C, I);
  return mf(zi(A), zi(O), zi(M));
}
c(Dp, "interpolateOklch");
const Ml = {
  hsl: $p,
  rgb: Fp,
  oklch: Dp
};
function vc(n = "hsl") {
  return Ml[n] ?? Ml.hsl;
}
c(vc, "getInterpolator");
function Xi() {
  return Object.keys(Ml);
}
c(Xi, "listInterpolationModes");
function Pp(n) {
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
  if (n.mode && !Xi().includes(n.mode))
    throw new Error(
      `light-color tween: unknown mode "${n.mode}". Available: ${Xi().join(", ")}`
    );
}
c(Pp, "validate$7");
async function Rp(n, e = {}) {
  const { CanvasAnimation: t } = foundry.canvas.animation, { Color: i } = foundry.utils, { uuid: r, toColor: a, toAlpha: o, mode: s = "oklch" } = n, l = Array.isArray(r) ? r : [r];
  if (l.length === 0)
    return console.warn("light-color tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: u = 2e3,
    easing: d = "easeInOutCosine",
    commit: m = !0,
    startEpochMS: f = null,
    signal: g = null
  } = e, p = rt(d), y = a != null, v = o != null, b = y ? vc(s) : null, w = y ? i.fromString(a) : null;
  if (y && !w.valid) throw new Error(`light-color tween: invalid target color "${a}".`);
  async function C(A) {
    var W, H;
    if (g != null && g.aborted) return !1;
    const O = await fromUuid(A);
    if (!O) return !1;
    const M = O.object;
    if (!M) return !1;
    let $;
    if (y) {
      const U = (W = O.config) == null ? void 0 : W.color;
      U != null && U.valid || console.warn(`light-color tween: source color invalid on ${A}, using white.`), $ = U != null && U.valid ? U : i.fromString("#ffffff");
    }
    const j = v ? ((H = O._source.config) == null ? void 0 : H.alpha) ?? 0.5 : null, D = { t: 0 }, P = `ambient-hue-tween:${A}`;
    t.terminateAnimation(P), g && g.addEventListener("abort", () => {
      t.terminateAnimation(P);
    }, { once: !0 });
    const N = typeof f == "number" ? Math.max(0, Math.min(u, Date.now() - f)) : 0, R = /* @__PURE__ */ c((U) => {
      const K = {};
      y && (K.color = b($, w, U)), v && (K.alpha = j + (o - j) * U), O.updateSource({ config: K }), M.initializeLightSource();
    }, "applyFrame");
    N > 0 && (D.t = N / u, R(D.t));
    const B = await t.animate(
      [{ parent: D, attribute: "t", to: 1 }],
      {
        name: P,
        duration: u,
        easing: p,
        time: N,
        ontick: /* @__PURE__ */ c(() => R(D.t), "ontick")
      }
    );
    if (B !== !1) {
      if (g != null && g.aborted) return !1;
      const U = {};
      y && (U.color = w.toHTML()), v && (U.alpha = o), O.updateSource({ config: U }), M.initializeLightSource();
    }
    if (m && B !== !1 && O.canUserModify(game.user, "update")) {
      if (g != null && g.aborted) return !1;
      const U = {}, K = {};
      y && (U.color = $.toHTML(), K["config.color"] = w.toHTML()), v && (U.alpha = j, K["config.alpha"] = o), O.updateSource({ config: U }), await O.update(K);
    }
    return B !== !1;
  }
  return c(C, "animateOne"), (await Promise.all(l.map(C))).every(Boolean);
}
c(Rp, "execute$7");
function Hp() {
  Ft({ type: "light-color", execute: Rp, validate: Pp });
}
c(Hp, "registerLightColorTween");
const bn = /* @__PURE__ */ new WeakMap();
function qp(n) {
  if ((Array.isArray(n.uuid) ? n.uuid : [n.uuid]).some((t) => !t || typeof t != "string"))
    throw new Error("light-state tween: 'uuid' is required (string or array of AmbientLight document UUIDs).");
  if (typeof n.enabled != "boolean")
    throw new Error("light-state tween: 'enabled' (boolean) is required.");
}
c(qp, "validate$6");
async function jp(n, e = {}) {
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
    var O, M, $, j;
    if (d != null && d.aborted) return !1;
    const y = await fromUuid(p);
    if (!y) return !1;
    const v = y.object;
    if (!v) return !1;
    const b = `ambient-state-tween:${p}`;
    t.terminateAnimation(b), d && d.addEventListener("abort", () => {
      t.terminateAnimation(b);
    }, { once: !0 });
    const w = bn.get(y) ?? {
      hidden: y._source.hidden,
      alpha: ((O = y._source.config) == null ? void 0 : O.alpha) ?? 0.5
    };
    if (bn.set(y, w), _(`light-state START ${r ? "ON" : "OFF"} | snap: ${JSON.stringify(w)} | _source.hidden=${y._source.hidden}, _source.config.alpha=${(M = y._source.config) == null ? void 0 : M.alpha}`), r && !w.hidden || !r && w.hidden)
      return bn.delete(y), !0;
    const C = w.alpha, I = typeof u == "number" ? Math.max(0, Math.min(o, Date.now() - u)) : 0, A = /* @__PURE__ */ c((D) => {
      y.updateSource({ config: { alpha: D } }), v.initializeLightSource();
    }, "applyAlpha");
    if (r) {
      y.updateSource({ hidden: !1, config: { alpha: 0 } }), v.initializeLightSource(), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
      const D = { t: 0 };
      I > 0 && (D.t = I / o, A(C * D.t));
      const P = await t.animate(
        [{ parent: D, attribute: "t", to: 1 }],
        {
          name: b,
          duration: o,
          easing: m,
          time: I,
          ontick: /* @__PURE__ */ c(() => A(C * D.t), "ontick")
        }
      );
      return P !== !1 && !(d != null && d.aborted) && l && y.canUserModify(game.user, "update") ? (y.updateSource({ hidden: !0, config: { alpha: C } }), await y.update({ hidden: !1 }), _(`light-state FADE-IN committed. _source.hidden=${y._source.hidden}, _source.config.alpha=${($ = y._source.config) == null ? void 0 : $.alpha}`), bn.delete(y)) : P === !1 || bn.delete(y), P !== !1;
    } else {
      y.updateSource({ hidden: !1, config: { alpha: w.alpha } }), v.initializeLightSource();
      const D = { t: 0 };
      I > 0 && (D.t = I / o, A(C * (1 - D.t)));
      const P = await t.animate(
        [{ parent: D, attribute: "t", to: 1 }],
        {
          name: b,
          duration: o,
          easing: m,
          time: I,
          ontick: /* @__PURE__ */ c(() => A(C * (1 - D.t)), "ontick")
        }
      );
      return P !== !1 && !(d != null && d.aborted) && l && y.canUserModify(game.user, "update") ? (await y.update({ hidden: !0 }), y.updateSource({ config: { alpha: C } }), v.initializeLightSource(), _(`light-state FADE-OUT committed+restored. _source.hidden=${y._source.hidden}, _source.config.alpha=${(j = y._source.config) == null ? void 0 : j.alpha}`), bn.delete(y)) : P === !1 || (y.updateSource({ hidden: !0, config: { alpha: C } }), v.initializeLightSource(), bn.delete(y)), P !== !1;
    }
  }
  return c(f, "animateOne"), (await Promise.all(a.map(f))).every(Boolean);
}
c(jp, "execute$6");
function Bp() {
  Ft({ type: "light-state", execute: jp, validate: qp });
}
c(Bp, "registerLightStateTween");
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
    const v = await fromUuid(y);
    if (!v) return !1;
    const b = v.object;
    if (!b) return !1;
    const w = foundry.utils.getProperty(v._source, r);
    if (typeof w != "number")
      return console.warn(`tile-prop tween: source value at '${r}' on ${y} is not a number (got ${typeof w}). Skipping.`), !1;
    const C = `tile-prop-tween:${r}:${y}`;
    t.terminateAnimation(C), m && m.addEventListener("abort", () => {
      t.terminateAnimation(C);
    }, { once: !0 });
    const I = typeof d == "number" ? Math.max(0, Math.min(s, Date.now() - d)) : 0, A = /* @__PURE__ */ c(($) => {
      const j = w + (a - w) * $;
      v.updateSource(foundry.utils.expandObject({ [r]: j })), b.refresh();
    }, "applyFrame"), O = { t: 0 };
    I > 0 && (O.t = I / s, A(O.t));
    const M = await t.animate(
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
      if (m != null && m.aborted) return !1;
      v.updateSource(foundry.utils.expandObject({ [r]: a })), b.refresh();
    }
    if (u && M !== !1 && v.canUserModify(game.user, "update")) {
      if (m != null && m.aborted) return !1;
      v.updateSource(foundry.utils.expandObject({ [r]: w })), await v.update({ [r]: a });
    }
    return M !== !1;
  }
  return c(g, "animateOne"), (await Promise.all(o.map(g))).every(Boolean);
}
c(ts, "execute$5");
function Up() {
  Ft({ type: "tile-prop", execute: ts, validate: es });
}
c(Up, "registerTilePropTween");
function Vp(n) {
  if (!n.attribute || typeof n.attribute != "string")
    throw new Error("particles-prop tween: 'attribute' (string) is required — property name on canvas.particleeffects (e.g. 'alpha').");
  if (typeof n.value != "number")
    throw new Error("particles-prop tween: 'value' (number) is required — the target value to animate to.");
}
c(Vp, "validate$4");
async function zp(n, e = {}) {
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
  const v = await t.animate(
    [{ parent: y, attribute: "t", to: 1 }],
    {
      name: f,
      duration: a,
      easing: m,
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
c(zp, "execute$4");
function Gp() {
  Ft({ type: "particles-prop", execute: zp, validate: Vp });
}
c(Gp, "registerParticlesPropTween");
var Ln, Dr, Pr, Rr, Hr, qr, Wi;
const kc = class kc {
  /**
   * @param {AbortController} controller
   */
  constructor(e) {
    k(this, Ln);
    k(this, Dr);
    k(this, Pr);
    k(this, Rr);
    k(this, Hr);
    k(this, qr, !1);
    k(this, Wi, null);
    L(this, Ln, e), L(this, Rr, new Promise((t) => {
      L(this, Dr, t);
    })), L(this, Hr, new Promise((t) => {
      L(this, Pr, t);
    }));
  }
  /** @returns {Promise<boolean>} Resolves true (completed) or false (cancelled/failed). */
  get finished() {
    return h(this, Rr);
  }
  /** @returns {Promise<{status: string, [k: string]: unknown}>} */
  get result() {
    return h(this, Hr);
  }
  /** @returns {boolean} */
  get cancelled() {
    return h(this, Ln).signal.aborted;
  }
  /** @returns {AbortSignal} */
  get signal() {
    return h(this, Ln).signal;
  }
  /** @returns {string} */
  get status() {
    return h(this, Wi) ? h(this, Wi).status : this.cancelled ? "cancelled" : "running";
  }
  /** Abort the timeline, triggering onCancel callbacks. */
  cancel(e = "cancelled") {
    h(this, Ln).signal.aborted || h(this, Ln).abort(e);
  }
  /**
   * Called internally by the execution engine when the timeline finishes.
   * @param {boolean} completed - true if all steps ran, false if cancelled
   */
  _resolve(e) {
    if (h(this, qr)) return;
    L(this, qr, !0);
    const t = typeof e == "boolean" ? { status: e ? "completed" : "cancelled" } : e ?? { status: "cancelled" };
    L(this, Wi, t), h(this, Dr).call(this, t.status === "completed"), h(this, Pr).call(this, t);
  }
};
Ln = new WeakMap(), Dr = new WeakMap(), Pr = new WeakMap(), Rr = new WeakMap(), Hr = new WeakMap(), qr = new WeakMap(), Wi = new WeakMap(), c(kc, "TimelineHandle");
let _l = kc;
var fi, Yi, mi;
const Mc = class Mc {
  constructor() {
    /** @type {Map<string, Set<Function>>} */
    k(this, fi, /* @__PURE__ */ new Map());
    /** @type {Set<string>} Signals that have been emitted (sticky) */
    k(this, Yi, /* @__PURE__ */ new Set());
    k(this, mi, !1);
  }
  /**
   * Subscribe to a named signal.
   * @param {string} signal
   * @param {Function} listener
   * @returns {() => void} Unsubscribe function
   */
  on(e, t) {
    if (h(this, mi)) return () => {
    };
    let i = h(this, fi).get(e);
    return i || (i = /* @__PURE__ */ new Set(), h(this, fi).set(e, i)), i.add(t), () => i.delete(t);
  }
  /**
   * Fire a named signal synchronously. All registered listeners are invoked.
   * The signal is recorded so that future waitFor() calls resolve immediately.
   * @param {string} signal
   */
  emit(e) {
    if (h(this, mi)) return;
    h(this, Yi).add(e);
    const t = h(this, fi).get(e);
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
    return h(this, mi) ? Promise.reject(new Error("EventBus destroyed")) : h(this, Yi).has(e) ? Promise.resolve() : new Promise((i, r) => {
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
    L(this, mi, !0), h(this, fi).clear(), h(this, Yi).clear();
  }
};
fi = new WeakMap(), Yi = new WeakMap(), mi = new WeakMap(), c(Mc, "EventBus");
let Nl = Mc;
const hf = /* @__PURE__ */ new Map();
function ns(n, e) {
  hf.set(n, e);
}
c(ns, "registerAwaitProvider");
function xl(n, e) {
  const t = hf.get(n.event);
  return t ? t(n, e) : Promise.reject(new Error(`Unknown await event type: "${n.event}"`));
}
c(xl, "createAwaitPromise");
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
const Di = /* @__PURE__ */ new Map();
function Wp(n, e) {
  const t = Di.get(n);
  t && !t.cancelled && t.cancel("replaced-by-name"), Di.set(n, e), e.finished.then(() => {
    Di.get(n) === e && Di.delete(n);
  });
}
c(Wp, "registerTimeline");
function gf(n) {
  const e = Di.get(n);
  return e && !e.cancelled ? (e.cancel("cancelled-by-name"), !0) : !1;
}
c(gf, "cancelTimeline");
function Yp(n) {
  return Di.get(n);
}
c(Yp, "getTimeline");
function uu(n, e) {
  return n <= 0 ? Promise.resolve() : new Promise((t, i) => {
    if (e.aborted) return i(e.reason);
    const r = setTimeout(t, n);
    e.addEventListener("abort", () => {
      clearTimeout(r), i(e.reason);
    }, { once: !0 });
  });
}
c(uu, "cancellableDelay");
var je, In, jr, Br;
const _c = class _c {
  constructor(e) {
    /** @type {TweenTimeline} */
    k(this, je);
    /** @type {Array<{ type: string, params: object, opts?: object, detach: boolean }>} */
    k(this, In, []);
    /** @type {Function|null} */
    k(this, jr, null);
    /** @type {Function|null} */
    k(this, Br, null);
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
    return h(this, In).push({ type: e, params: t, opts: i ?? {}, detach: !1 }), this;
  }
  /**
   * Mark the last entry as fire-and-forget (does not block step progression).
   * @returns {StepBuilder} this
   */
  detach() {
    if (h(this, In).length === 0)
      throw new Error("StepBuilder.detach(): no entry to detach.");
    return h(this, In)[h(this, In).length - 1].detach = !0, this;
  }
  /**
   * Callback invoked before this step's tweens start.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  before(e) {
    return L(this, jr, e), this;
  }
  /**
   * Callback invoked after this step's awaited tweens complete.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  after(e) {
    return L(this, Br, e), this;
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
      entries: h(this, In),
      before: h(this, jr),
      after: h(this, Br)
    };
  }
};
je = new WeakMap(), In = new WeakMap(), jr = new WeakMap(), Br = new WeakMap(), c(_c, "StepBuilder");
let $l = _c;
var Be, ke, It, On, Ur, Vr, zr, Gr, Vn, Fl, J, nn, Dl, pf, Pl, yf, bf, Ma, ut, Rt;
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
    k(this, Ur, null);
    /** @type {Function|null} */
    k(this, Vr, null);
    /** @type {Function|null} */
    k(this, zr, null);
    /** @type {Function|null} */
    k(this, Gr, null);
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
    return S(this, J, nn).call(this), L(this, On, new $l(this)), h(this, On);
  }
  /**
   * Insert a delay (in ms) between the previous step and the next.
   * @param {number} ms
   * @returns {TweenTimeline} this
   */
  delay(e) {
    return S(this, J, nn).call(this), h(this, It).push({ kind: "delay", ms: e }), this;
  }
  /**
   * Pause execution until an event occurs.
   * @param {object} config  e.g. { event: "click" }, { event: "signal", name: "fog-done" }
   * @returns {TweenTimeline} this
   */
  await(e) {
    return S(this, J, nn).call(this), h(this, It).push({ kind: "await", config: e }), this;
  }
  /**
   * Fire a named signal (instant, non-blocking).
   * @param {string} signal  Signal name
   * @returns {TweenTimeline} this
   */
  emit(e) {
    return S(this, J, nn).call(this), h(this, It).push({ kind: "emit", signal: e }), this;
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
    S(this, J, nn).call(this);
    const i = t.join ?? "all", r = t.overflow ?? "detach";
    if (i !== "all" && i !== "any" && (typeof i != "number" || i < 1 || i > e.length))
      throw new Error(`parallel: join must be "all", "any", or 1..${e.length}, got ${JSON.stringify(i)}`);
    if (r !== "detach" && r !== "cancel")
      throw new Error(`parallel: overflow must be "detach" or "cancel", got ${JSON.stringify(r)}`);
    const a = e.map((o) => {
      var l;
      const s = new on();
      return o(s), S(l = s, J, nn).call(l), h(s, It);
    });
    return h(this, It).push({ kind: "parallel", branches: a, join: i, overflow: r }), this;
  }
  /**
   * Callback invoked before the first step runs.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  beforeAll(e) {
    return L(this, Ur, e), this;
  }
  /**
   * Callback invoked on successful completion.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onComplete(e) {
    return L(this, Vr, e), this;
  }
  /**
   * Callback invoked on cancellation (mutually exclusive with onComplete).
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onCancel(e) {
    return L(this, zr, e), this;
  }
  /**
   * Callback invoked on runtime failure (mutually exclusive with onComplete/onCancel).
   * @param {(outcome: object) => void} fn
   * @returns {TweenTimeline} this
   */
  onError(e) {
    return L(this, Gr, e), this;
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
    const t = new AbortController();
    e.signal && (e.signal.aborted ? t.abort(e.signal.reason ?? "parent-aborted") : e.signal.addEventListener("abort", () => {
      t.signal.aborted || t.abort(e.signal.reason ?? "parent-aborted");
    }, { once: !0 }));
    const i = new _l(t);
    h(this, Be) && Wp(h(this, Be), i);
    const r = e.broadcast ?? game.user.isGM, a = e.commit ?? game.user.isGM, o = e.startEpochMS ?? Date.now();
    r && h(this, Be) && ka(ff, {
      name: h(this, Be),
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
    return S(this, J, pf).call(this, i, l).then((u) => {
      var d, m, f;
      s.destroy(), i._resolve(u), u.status === yn.COMPLETED ? (d = h(this, Vr)) == null || d.call(this) : u.status === yn.CANCELLED ? ((m = h(this, zr)) == null || m.call(this), r && h(this, Be) && ka(Al, {
        name: h(this, Be),
        reason: u.reason
      })) : ((f = h(this, Gr)) == null || f.call(this, u), r && h(this, Be) && ka(Al, {
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
    S(this, J, nn).call(this);
    const t = { timeline: S(i = on, Vn, Fl).call(i, h(this, It)) };
    return h(this, Be) && (t.name = h(this, Be)), h(this, ke) !== Ie.ABORT && (t.errorPolicy = h(this, ke)), t;
  }
};
Be = new WeakMap(), ke = new WeakMap(), It = new WeakMap(), On = new WeakMap(), Ur = new WeakMap(), Vr = new WeakMap(), zr = new WeakMap(), Gr = new WeakMap(), Vn = new WeakSet(), Fl = /* @__PURE__ */ c(function(e) {
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
            return S(a = on, Vn, Fl).call(a, r);
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
}, "#serializeSegments"), J = new WeakSet(), // ── Private ─────────────────────────────────────────────────────────
nn = /* @__PURE__ */ c(function() {
  h(this, On) && (h(this, It).push({ kind: "step", data: h(this, On)._finalize() }), L(this, On, null));
}, "#finalizeCurrentStep"), Dl = /* @__PURE__ */ c(function(e) {
  e.length !== 0 && Promise.allSettled(e).catch(() => {
  });
}, "#drainDetached"), pf = /* @__PURE__ */ c(async function(e, t) {
  var i, r;
  try {
    if (t.signal.aborted) return S(this, J, ut).call(this, t.signal.reason);
    const a = await S(this, J, Ma).call(this, h(this, Ur), vt.BEFORE_ALL, null);
    if (a) {
      if (h(this, ke) === Ie.ABORT) return a;
      t.errors.push(a);
    }
    const o = await S(this, J, Pl).call(this, h(this, It), t);
    if (o)
      return S(i = on, Vn, Dl).call(i, t.detachedPromises), o;
    if (!t.signal.aborted) {
      const s = await Promise.allSettled(t.detachedPromises);
      for (const l of s)
        if (l.status === "rejected") {
          const u = S(this, J, Rt).call(this, l.reason, vt.ENTRY);
          if (h(this, ke) === Ie.ABORT) return u;
          t.errors.push(u);
        }
    }
    return t.signal.aborted ? S(this, J, ut).call(this, t.signal.reason) : {
      status: yn.COMPLETED,
      ...t.errors.length > 0 ? { errors: t.errors } : {}
    };
  } catch (a) {
    return S(r = on, Vn, Dl).call(r, t.detachedPromises), t.signal.aborted ? S(this, J, ut).call(this, t.signal.reason) : (console.error("TweenTimeline execution error:", a), S(this, J, Rt).call(this, a, vt.RUNTIME));
  }
}, "#execute"), Pl = /* @__PURE__ */ c(async function(e, t) {
  let i = -1, r = 0;
  for (const a of e) {
    if (t.signal.aborted) return S(this, J, ut).call(this, t.signal.reason);
    if (a.kind === "delay") {
      try {
        await uu(a.ms, t.signal);
      } catch {
        return S(this, J, ut).call(this, t.signal.reason);
      }
      r += a.ms;
      continue;
    }
    if (a.kind === "await") {
      try {
        let p = xl(a.config, {
          signal: t.signal,
          eventBus: t.eventBus
        });
        const y = a.config.timeout;
        typeof y == "number" && y > 0 && (p = Promise.race([
          p,
          uu(y, t.signal)
        ])), await p;
      } catch (p) {
        if (t.signal.aborted) return S(this, J, ut).call(this, t.signal.reason);
        const y = S(this, J, Rt).call(this, p, vt.AWAIT);
        if (h(this, ke) === Ie.ABORT) return y;
        t.errors.push(y);
      }
      continue;
    }
    if (a.kind === "emit") {
      try {
        t.eventBus.emit(a.signal);
      } catch (p) {
        const y = S(this, J, Rt).call(this, p, vt.EMIT);
        if (h(this, ke) === Ie.ABORT) return y;
        t.errors.push(y);
      }
      continue;
    }
    if (a.kind === "parallel") {
      const p = await S(this, J, yf).call(this, a, t, r);
      if (p) return p;
      continue;
    }
    i += 1;
    const { entries: o, before: s, after: l } = a.data, u = await S(this, J, Ma).call(this, s, vt.BEFORE_STEP, i);
    if (u) {
      if (h(this, ke) === Ie.ABORT) return u;
      t.errors.push(u);
      continue;
    }
    if (t.signal.aborted) return S(this, J, ut).call(this, t.signal.reason);
    const d = [];
    let m = 0;
    for (const p of o) {
      const y = nr(p.type);
      if (!y) {
        const C = S(this, J, Rt).call(this, new Error(`TweenTimeline: unknown tween type "${p.type}"`), vt.ENTRY, i, p.type);
        if (h(this, ke) === Ie.ABORT) return C;
        t.errors.push(C), console.warn(C.error.message);
        continue;
      }
      const v = {
        ...p.opts,
        commit: t.commit,
        startEpochMS: t.startEpochMS + r,
        signal: t.signal
      }, b = v.durationMS ?? 2e3, w = Promise.resolve().then(() => y.execute(p.params, v)).then((C) => C === !1 ? {
        ok: !1,
        failure: S(this, J, Rt).call(this, new Error("Tween entry returned false."), vt.ENTRY, i, p.type)
      } : { ok: !0 }).catch((C) => ({
        ok: !1,
        failure: S(this, J, Rt).call(this, C, vt.ENTRY, i, p.type)
      }));
      p.detach ? t.detachedPromises.push(w) : (d.push(w), m = Math.max(m, b));
    }
    const f = await S(this, J, bf).call(this, d, t.signal);
    if (f === null) return S(this, J, ut).call(this, t.signal.reason);
    for (const p of f)
      if (!p.ok) {
        if (h(this, ke) === Ie.ABORT) return p.failure;
        t.errors.push(p.failure), console.warn("TweenTimeline: entry failed:", p.failure.error);
      }
    const g = await S(this, J, Ma).call(this, l, vt.AFTER_STEP, i);
    if (g) {
      if (h(this, ke) === Ie.ABORT) return g;
      t.errors.push(g);
    }
    if (t.signal.aborted) return S(this, J, ut).call(this, t.signal.reason);
    r += m;
  }
  return null;
}, "#executeSegments"), yf = /* @__PURE__ */ c(async function(e, t, i = 0) {
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
    const v = /* @__PURE__ */ c(() => {
      if (y) return;
      if (d >= l) {
        y = !0, b(), p(null);
        return;
      }
      const w = s - d - m;
      if (d + w < l) {
        y = !0, b();
        const C = f.filter((A) => A && A.status === yn.FAILED).map((A) => A), I = S(this, J, Rt).call(this, new Error(`parallel: join target ${l} impossible (${d} completed, ${m} failed)`), vt.PARALLEL);
        h(this, ke) === Ie.ABORT ? p(I) : (t.errors.push(I), t.errors.push(...C), p(null));
      }
    }, "checkJoin"), b = /* @__PURE__ */ c(() => {
      if (o === "cancel")
        for (let w = 0; w < s; w++)
          !f[w] && !u[w].signal.aborted && u[w].abort("overflow-cancel");
      for (let w = 0; w < s; w++)
        f[w] || t.detachedPromises.push(g[w]);
    }, "applyOverflow");
    if (g = r.map((w, C) => {
      const I = {
        signal: u[C].signal,
        commit: t.commit,
        startEpochMS: t.startEpochMS + i,
        eventBus: t.eventBus,
        // shared
        errors: t.errors,
        // shared
        detachedPromises: t.detachedPromises
        // shared
      };
      return S(this, J, Pl).call(this, w, I).then((A) => {
        if (A)
          if (A.status === yn.CANCELLED) {
            if (u[C].signal.aborted) {
              f[C] = A;
              return;
            }
            f[C] = A, m++;
          } else
            f[C] = A, m++;
        else
          f[C] = { status: yn.COMPLETED }, d++;
        v();
      });
    }), t.signal.aborted) {
      y = !0, p(S(this, J, ut).call(this, t.signal.reason));
      return;
    }
    t.signal.addEventListener("abort", () => {
      y || (y = !0, p(S(this, J, ut).call(this, t.signal.reason)));
    }, { once: !0 });
  });
}, "#executeParallel"), /**
 * @param {Array<Promise<{ok: boolean, failure?: object}>>} stepPromises
 * @param {AbortSignal} signal
 * @returns {Promise<Array<{ok: boolean, failure?: object}>|null>}
 */
bf = /* @__PURE__ */ c(function(e, t) {
  return e.length === 0 ? Promise.resolve([]) : t.aborted ? Promise.resolve(null) : new Promise((i, r) => {
    const a = /* @__PURE__ */ c(() => i(null), "onAbort");
    t.addEventListener("abort", a, { once: !0 }), Promise.all(e).then((o) => {
      t.removeEventListener("abort", a), i(o);
    }).catch((o) => {
      t.removeEventListener("abort", a), r(o);
    });
  });
}, "#waitForStep"), Ma = /* @__PURE__ */ c(async function(e, t, i) {
  if (!e) return null;
  try {
    return await e(), null;
  } catch (r) {
    const a = S(this, J, Rt).call(this, r, t, i ?? void 0);
    return h(this, ke) === Ie.CONTINUE && console.warn(`TweenTimeline: hook failure in ${t}:`, r), a;
  }
}, "#runHook"), /** @param {unknown} reason */
ut = /* @__PURE__ */ c(function(e) {
  let t;
  return typeof e == "string" ? t = e : e instanceof Error && (t = e.message), {
    status: yn.CANCELLED,
    ...t ? { reason: t } : {}
  };
}, "#cancelledOutcome"), /**
 * @param {unknown} err
 * @param {string} phase
 * @param {number} [stepIndex]
 * @param {string} [entryType]
 */
Rt = /* @__PURE__ */ c(function(e, t, i, r) {
  const a = e instanceof Error ? e : new Error(String(e));
  return {
    status: yn.FAILED,
    error: a,
    phase: t,
    ...typeof i == "number" ? { stepIndex: i } : {},
    ...r ? { entryType: r } : {}
  };
}, "#failedOutcome"), k(on, Vn), c(on, "TweenTimeline");
let to = on;
function wc(n) {
  if (!n || typeof n != "object")
    throw new Error("Sequence JSON: data must be an object.");
  if (!Array.isArray(n.timeline))
    throw new Error("Sequence JSON: 'timeline' must be an array.");
  if (n.name != null && typeof n.name != "string")
    throw new Error("Sequence JSON: 'name' must be a string.");
  if (n.errorPolicy != null && n.errorPolicy !== Ie.ABORT && n.errorPolicy !== Ie.CONTINUE)
    throw new Error(`Sequence JSON: 'errorPolicy' must be "abort" or "continue".`);
  vf(n.timeline, "timeline", 0);
}
c(wc, "validateSequenceJSON");
function vf(n, e, t = 0) {
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
        vf(d, `${a}.parallel.branches[${u}]`, t + 1);
      }
      continue;
    }
    throw new Error(`Sequence JSON: ${a} is not a recognized segment (step array, delay, await, emit, or parallel).`);
  }
}
c(vf, "validateSegmentsJSON");
function wf(n) {
  wc(n), Ef(n.timeline, "timeline");
}
c(wf, "validateSequenceSemantics");
function Ef(n, e) {
  for (let t = 0; t < n.length; t++) {
    const i = n[t], r = `${e}[${t}]`;
    if (Array.isArray(i))
      for (let a = 0; a < i.length; a++) {
        const o = i[a];
        try {
          Np(o.type, o.params ?? {});
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
function Ec(n, e = {}) {
  wc(n), e.validateSemantics && wf(n);
  const t = new to();
  return n.name && t.name(n.name), n.errorPolicy && t.errorPolicy(n.errorPolicy), Sf(n.timeline, t), t;
}
c(Ec, "compileSequence");
function Sf(n, e) {
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
      const i = t.parallel, r = i.branches.map((a) => (o) => Sf(a, o));
      e.parallel(r, {
        join: i.join ?? "all",
        overflow: i.overflow ?? "detach"
      });
    }
  }
}
c(Sf, "compileSegments");
function Kp(n) {
  wc(n), wf(n);
}
c(Kp, "validate$3");
async function Jp(n, e = {}) {
  return Ec(n, { validateSemantics: !0 }).run({
    broadcast: !1,
    commit: e.commit,
    startEpochMS: e.startEpochMS,
    signal: e.signal
  }).finished;
}
c(Jp, "execute$3");
function Xp() {
  Ft({ type: "sequence", execute: Jp, validate: Kp });
}
c(Xp, "registerSequenceTween");
function Qp(n) {
  if (n.x == null && n.y == null && n.scale == null)
    throw new Error("camera-pan tween: at least one of 'x', 'y', or 'scale' is required.");
  if (n.x != null && typeof n.x != "number")
    throw new Error("camera-pan tween: 'x' must be a number.");
  if (n.y != null && typeof n.y != "number")
    throw new Error("camera-pan tween: 'y' must be a number.");
  if (n.scale != null && (typeof n.scale != "number" || n.scale <= 0))
    throw new Error("camera-pan tween: 'scale' must be a positive number.");
}
c(Qp, "validate$2");
async function Zp(n, e = {}) {
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
c(Zp, "execute$2");
function ey() {
  Ft({ type: "camera-pan", execute: Zp, validate: Qp });
}
c(ey, "registerCameraPanTween");
function ty(n) {
  if ((Array.isArray(n.uuid) ? n.uuid : [n.uuid]).some((i) => !i || typeof i != "string"))
    throw new Error("tile-tint tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (n.toColor == null || typeof n.toColor != "string")
    throw new Error("tile-tint tween: 'toColor' (CSS color string) is required.");
  if (!foundry.utils.Color.fromString(n.toColor).valid)
    throw new Error(`tile-tint tween: invalid target color "${n.toColor}".`);
  if (n.mode && !Xi().includes(n.mode))
    throw new Error(
      `tile-tint tween: unknown mode "${n.mode}". Available: ${Xi().join(", ")}`
    );
}
c(ty, "validate$1");
async function ny(n, e = {}) {
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
  async function v(w) {
    var R, B;
    if (f != null && f.aborted) return !1;
    const C = await fromUuid(w);
    if (!C) return !1;
    const I = C.object;
    if (!I) return !1;
    const A = ((B = (R = C._source) == null ? void 0 : R.texture) == null ? void 0 : B.tint) ?? "#ffffff", O = i.fromString(A);
    O.valid || console.warn(`tile-tint tween: source tint invalid on ${w}, using white.`);
    const M = O.valid ? O : i.fromString("#ffffff"), $ = { t: 0 }, j = `tile-tint-tween:${w}`;
    t.terminateAnimation(j), f && f.addEventListener("abort", () => {
      t.terminateAnimation(j);
    }, { once: !0 });
    const D = typeof m == "number" ? Math.max(0, Math.min(l, Date.now() - m)) : 0, P = /* @__PURE__ */ c((W) => {
      const H = p(M, y, W);
      C.updateSource({ texture: { tint: H } }), I.refresh();
    }, "applyFrame");
    D > 0 && ($.t = D / l, P($.t));
    const N = await t.animate(
      [{ parent: $, attribute: "t", to: 1 }],
      {
        name: j,
        duration: l,
        easing: g,
        time: D,
        ontick: /* @__PURE__ */ c(() => P($.t), "ontick")
      }
    );
    if (N !== !1) {
      if (f != null && f.aborted) return !1;
      C.updateSource({ texture: { tint: y.toHTML() } }), I.refresh();
    }
    if (d && N !== !1 && C.canUserModify(game.user, "update")) {
      if (f != null && f.aborted) return !1;
      C.updateSource({ texture: { tint: M.toHTML() } }), await C.update({ "texture.tint": y.toHTML() });
    }
    return N !== !1;
  }
  return c(v, "animateOne"), (await Promise.all(s.map(v))).every(Boolean);
}
c(ny, "execute$1");
function iy() {
  Ft({ type: "tile-tint", execute: ny, validate: ty });
}
c(iy, "registerTileTintTween");
function ry(n) {
  if ((Array.isArray(n.uuid) ? n.uuid : [n.uuid]).some((t) => !t || typeof t != "string"))
    throw new Error("tile-scale tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (typeof n.toScale != "number" || n.toScale <= 0)
    throw new Error("tile-scale tween: 'toScale' must be a positive number.");
  for (const t of ["baseWidth", "baseHeight", "centerX", "centerY"])
    if (typeof n[t] != "number")
      throw new Error(`tile-scale tween: '${t}' (number) is required.`);
}
c(ry, "validate");
async function ay(n, e = {}) {
  const { CanvasAnimation: t } = foundry.canvas.animation, { uuid: i, toScale: r, baseWidth: a, baseHeight: o, centerX: s, centerY: l } = n, u = Array.isArray(i) ? i : [i];
  if (u.length === 0) return !0;
  const {
    durationMS: d = 2e3,
    easing: m = "easeInOutCosine",
    commit: f = !0,
    startEpochMS: g = null,
    signal: p = null
  } = e, y = rt(m), v = a * r, b = o * r, w = s - v / 2, C = l - b / 2;
  async function I(O) {
    if (p != null && p.aborted) return !1;
    const M = await fromUuid(O);
    if (!M) return !1;
    const $ = M.object;
    if (!$) return !1;
    const j = M._source.width, D = M._source.height, P = M._source.x, N = M._source.y, R = `tile-scale-tween:${O}`;
    t.terminateAnimation(R), p && p.addEventListener("abort", () => {
      t.terminateAnimation(R);
    }, { once: !0 });
    const B = typeof g == "number" ? Math.max(0, Math.min(d, Date.now() - g)) : 0, W = /* @__PURE__ */ c((K) => {
      const ae = j + (v - j) * K, Q = D + (b - D) * K, te = P + (w - P) * K, Xt = N + (C - N) * K;
      M.updateSource({ width: ae, height: Q, x: te, y: Xt }), $.refresh();
    }, "applyFrame"), H = { t: 0 };
    B > 0 && (H.t = B / d, W(H.t));
    const U = await t.animate(
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
      M.updateSource({ width: v, height: b, x: w, y: C }), $.refresh();
    }
    if (f && U !== !1 && M.canUserModify(game.user, "update")) {
      if (p != null && p.aborted) return !1;
      M.updateSource({ width: j, height: D, x: P, y: N }), await M.update({ width: v, height: b, x: w, y: C });
    }
    return U !== !1;
  }
  return c(I, "animateOne"), (await Promise.all(u.map(I))).every(Boolean);
}
c(ay, "execute");
function oy() {
  Ft({ type: "tile-scale", execute: ay, validate: ry });
}
c(oy, "registerTileScaleTween");
async function sy(n, e, t = {}) {
  if (!game.user.isGM)
    return ui.notifications.warn("Only the GM can dispatch tweens."), !1;
  const i = nr(n);
  if (!i)
    throw new Error(`Unknown tween type: "${n}". Registered types: ${kl().join(", ")}`);
  i.validate(e);
  const { durationMS: r = 2e3, easing: a = "easeInOutCosine", commit: o = !0 } = t, s = Date.now();
  return ka(df, {
    type: n,
    params: e,
    durationMS: r,
    easing: a,
    startEpochMS: s,
    commit: !1
  }), i.execute(e, { durationMS: r, easing: a, commit: o, startEpochMS: s });
}
c(sy, "dispatchTween");
function ly(n) {
  const { type: e, params: t, durationMS: i, easing: r, startEpochMS: a, commit: o } = n ?? {}, s = nr(e);
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
c(ly, "handleTweenSocketMessage");
Hp();
Bp();
Up();
Gp();
Xp();
ey();
iy();
oy();
Ft({ type: "token-prop", execute: ts, validate: es });
Ft({ type: "drawing-prop", execute: ts, validate: es });
Ft({ type: "sound-prop", execute: ts, validate: es });
yc(df, ly);
yc(ff, cy);
yc(Al, uy);
function cy(n) {
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
c(cy, "handleSequenceSocketMessage");
function uy(n) {
  const { name: e } = n ?? {};
  e && gf(e);
}
c(uy, "handleSequenceCancelMessage");
function dy() {
  Hooks.once("ready", () => {
    _p();
    const n = game.modules.get(T);
    n.api || (n.api = {}), n.api.tween = {
      dispatch: sy,
      types: kl,
      Timeline: to,
      ErrorPolicy: Ie,
      compileSequence: Ec,
      cancelTimeline: gf,
      getTimeline: Yp
    }, console.log(`[${T}] Tween API registered. Types: ${kl().join(", ")}`);
  });
}
c(dy, "registerTweenHooks");
dy();
const fy = ["tag", "tag-all", "id", "tags-any", "tags-all"], my = /* @__PURE__ */ new Set(["tags-any", "tags-all"]);
function Sc(n) {
  if (!n || typeof n != "string")
    return { type: "unknown", value: n ?? "" };
  if (n.startsWith("$"))
    return { type: "special", value: n };
  for (const e of fy)
    if (n.startsWith(`${e}:`)) {
      const t = n.slice(e.length + 1), i = my.has(e) ? t.split(",").map((r) => r.trim()) : t;
      return { type: e, value: i };
    }
  return n.includes(".") ? { type: "uuid", value: n } : { type: "unknown", value: n };
}
c(Sc, "parseSelector");
function hy(n) {
  if (!n) return "";
  const { type: e, value: t } = n;
  if (e === "special" || e === "uuid" || e === "unknown")
    return Array.isArray(t) ? t.join(",") : t ?? "";
  const i = Array.isArray(t) ? t.join(",") : t ?? "";
  return `${e}:${i}`;
}
c(hy, "buildSelector");
function Cf(n, e = "first") {
  return n != null && n.length ? n.length === 1 ? e === "first-all" || e === "all" ? `tag-all:${n[0]}` : `tag:${n[0]}` : e === "any" ? `tags-any:${n.join(",")}` : e === "all" ? `tags-all:${n.join(",")}` : e === "first-all" ? `tags-all:${n.join(",")}` : `tags-any:${n.join(",")}` : "";
}
c(Cf, "buildTagSelector");
function is(n) {
  if (!n) return null;
  if (n.documentName || n._source !== void 0) {
    const e = n.object;
    return e ? { placeable: e, doc: n } : null;
  }
  return n.document ? { placeable: n, doc: n.document } : null;
}
c(is, "normalizePlaceable");
function Tf() {
  var n;
  return window.Tagger ?? ((n = game.modules.get("tagger")) == null ? void 0 : n.api) ?? null;
}
c(Tf, "getTaggerAPI");
function rs(n, e) {
  if (!n) return null;
  const t = e ?? canvas.scene;
  if (!t) return null;
  const i = Sc(n);
  switch (i.type) {
    case "special":
      return gy(i.value);
    case "tag":
      return du(i.value, t);
    case "tag-all":
      return du(i.value, t);
    case "id":
      return py(i.value, t);
    case "tags-any":
      return fu(i.value, t, !0);
    case "tags-all":
      return fu(i.value, t, !1);
    case "uuid":
      return yy(i.value);
    default:
      return null;
  }
}
c(rs, "resolveSelector");
function gy(n) {
  var e;
  if (n === "$particles") {
    if (!((e = game.modules.get("fxmaster")) != null && e.active))
      return console.warn(`[${T}] Picker: FXMaster not active, cannot resolve "$particles".`), null;
    const t = canvas.particleeffects;
    return t ? { kind: "particles", documents: [], placeables: [], target: t } : null;
  }
  return null;
}
c(gy, "resolveSpecial");
function du(n, e, t) {
  const i = Tf();
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
c(du, "resolveTag");
function py(n, e) {
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
c(py, "resolveById");
function fu(n, e, t) {
  const i = Tf();
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
c(fu, "resolveMultiTag");
function yy(n) {
  const e = fromUuidSync(n);
  if (!e) return null;
  const t = is(e);
  return t ? {
    kind: "placeable",
    documents: [t.doc],
    placeables: [t]
  } : null;
}
c(yy, "resolveUUID");
function by(n) {
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
c(by, "adaptResolved");
function no(n) {
  var r;
  const e = /* @__PURE__ */ new Set();
  if (n.segments) {
    if (n.setup) for (const a of Object.keys(n.setup)) e.add(a);
    if (n.landing) for (const a of Object.keys(n.landing)) e.add(a);
    for (const a of Object.values(n.segments)) {
      if (a.setup) for (const o of Object.keys(a.setup)) e.add(o);
      if (a.landing) for (const o of Object.keys(a.landing)) e.add(o);
      a.timeline && Hl(a.timeline, e), (r = a.gate) != null && r.target && e.add(a.gate.target);
    }
  } else {
    if (n.setup) for (const a of Object.keys(n.setup)) e.add(a);
    if (n.landing) for (const a of Object.keys(n.landing)) e.add(a);
    n.timeline && Hl(n.timeline, e);
  }
  const t = /* @__PURE__ */ new Map(), i = [];
  for (const a of e) {
    const o = rs(a), s = by(o);
    s ? t.set(a, s) : i.push(a);
  }
  return i.length && console.warn(`[${T}] Cinematic: ${i.length} unresolved target(s): ${i.join(", ")}`), { targets: t, unresolved: i };
}
c(no, "resolveAllTargets");
function vy(n, e) {
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
c(vy, "captureSnapshot");
function wy(n) {
  const e = {};
  function t(i) {
    if (i)
      for (const [r, a] of Object.entries(i))
        e[r] || (e[r] = {}), Object.assign(e[r], a);
  }
  if (c(t, "mergeMap"), n.segments) {
    t(n.setup), t(n.landing);
    for (const i of Object.values(n.segments))
      t(i.setup), t(i.landing), i.timeline && Rl(i.timeline, e, t);
  } else
    t(n.setup), t(n.landing), n.timeline && Rl(n.timeline, e, t);
  return e;
}
c(wy, "gatherAllStateMaps");
function Rl(n, e, t) {
  var i;
  for (const r of n)
    if (!(r.delay != null || r.await != null || r.emit != null) && !(r.transitionTo != null || r.sound != null || r.stopSound != null)) {
      if ((i = r.parallel) != null && i.branches) {
        for (const a of r.parallel.branches)
          Rl(a, e, t);
        continue;
      }
      if (t(r.before), t(r.after), r.tweens)
        for (const a of r.tweens)
          a.target && a.attribute && (e[a.target] || (e[a.target] = {}), e[a.target][a.attribute] = "__snapshot__");
    }
}
c(Rl, "gatherFromEntries");
function Hl(n, e) {
  for (const t of n)
    if (t.delay == null && t.await == null && t.emit == null && t.transitionTo == null && t.sound == null && t.stopSound == null) {
      if (t.parallel) {
        const i = t.parallel;
        if (i.branches)
          for (const r of i.branches)
            Hl(r, e);
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
c(Hl, "collectSelectorsFromEntries");
const mu = {
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
}, Ey = /* @__PURE__ */ new Set([
  "alpha",
  "visible",
  "x",
  "y",
  "scale",
  "rotation"
]);
function Ts(n, e, t) {
  const i = {};
  for (const [r, a] of Object.entries(n))
    e.has(r) ? i[r] = a : console.warn(`[${T}] Cinematic: blocked property "${r}" on ${t}.`);
  return i;
}
c(Ts, "filterOverrides");
function Oe(n, e) {
  var i, r;
  if (!n) return;
  const t = [];
  for (const [a, o] of Object.entries(n)) {
    const s = e.get(a);
    if (s)
      if (s.kind === "particles") {
        if (s.target.destroyed) continue;
        const l = Ts(o, Ey, "$particles");
        for (const [u, d] of Object.entries(l))
          s.target[u] = d;
      } else if (s.kind === "multi-placeable")
        for (const { placeable: l, doc: u } of s.placeables) {
          if (!(u != null && u.parent) || !(l != null && l.scene)) continue;
          const d = u.documentName, m = mu[d];
          if (!m) {
            console.warn(`[${T}] Cinematic: no allowlist for document type "${d}" on "${a}", skipping.`);
            continue;
          }
          const f = Ts(o, m, `${d} "${a}"`);
          u.updateSource(f), t.push(l);
        }
      else {
        if (!((i = s.doc) != null && i.parent) || !((r = s.placeable) != null && r.scene)) continue;
        const l = s.doc.documentName, u = mu[l];
        if (!u) {
          console.warn(`[${T}] Cinematic: no allowlist for document type "${l}" on "${a}", skipping.`);
          continue;
        }
        const d = Ts(o, u, `${l} "${a}"`);
        s.doc.updateSource(d), t.push(s.placeable);
      }
  }
  for (const a of t)
    a.refresh();
}
c(Oe, "applyState");
function Pi(n, e) {
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
c(Pi, "refreshPerceptionIfNeeded");
const Sy = {
  "tile-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "light-color": /* @__PURE__ */ new Set(["uuid", "toColor", "toAlpha", "mode"]),
  "light-state": /* @__PURE__ */ new Set(["uuid", "enabled"]),
  "particles-prop": /* @__PURE__ */ new Set(["attribute", "value"]),
  "camera-pan": /* @__PURE__ */ new Set(["x", "y", "scale"]),
  "token-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "drawing-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "sound-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"])
}, Cy = /* @__PURE__ */ new Set(["easing"]), Ty = /* @__PURE__ */ new Set(["type", "target"]);
function Lf(n, e) {
  const { type: t, target: i, ...r } = n;
  if (!t)
    return console.warn(`[${T}] Cinematic: tween entry missing 'type', skipping.`), null;
  const a = {}, o = {}, s = Sy[t];
  if (i === "$particles")
    a.target = "$particles";
  else if (i) {
    const l = e.get(i);
    if (!l) return null;
    l.kind === "multi-placeable" ? a.uuid = l.placeables.map((u) => u.doc.uuid) : a.uuid = l.doc.uuid;
  }
  for (const [l, u] of Object.entries(r))
    Ty.has(l) || (Cy.has(l) ? o[l] = u : (s != null && s.has(l), a[l] = u));
  return { type: t, params: a, opts: o };
}
c(Lf, "compileTween");
const kr = /* @__PURE__ */ new Map();
let Ly = 0;
async function Iy(n) {
  var u, d, m, f, g;
  const { id: e, src: t, volume: i = 0.8, loop: r = !1, fadeIn: a } = n;
  if (!t) {
    console.warn(`[${T}] Cinematic sound: missing 'src', skipping.`);
    return;
  }
  const o = e || `__auto_${++Ly}`, s = {
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
  a && a > 0 && l.fade && l.fade(i, { duration: a, from: 0 }), kr.set(o, { sound: l, config: n }), console.log(`[${T}] Cinematic sound: playing "${t}" as "${o}" (loop=${r}, vol=${i})`);
}
c(Iy, "playLocalSound");
function Ls(n) {
  var i, r;
  const e = kr.get(n);
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
  kr.delete(n);
}
c(Ls, "stopCinematicSound");
function hu() {
  var n, e;
  for (const [t, i] of kr)
    try {
      (e = (n = i.sound).stop) == null || e.call(n);
    } catch (r) {
      console.warn(`[${T}] Cinematic sound: error stopping "${t}" during cleanup:`, r);
    }
  kr.clear();
}
c(hu, "stopAllCinematicSounds");
function Oy(n, e, t, i = {}) {
  const { skipToStep: r, onStepComplete: a, timelineName: o } = i, s = new t().name(o ?? `cinematic-${canvas.scene.id}`);
  return s.beforeAll(() => {
    var l;
    try {
      Oe(n.setup, e), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    } catch (u) {
      throw console.error(`[${T}] Cinematic: error in beforeAll (setup state) on scene ${(l = canvas.scene) == null ? void 0 : l.id}:`, u), u;
    }
  }), Of(n.timeline, s, e, { skipToStep: r, onStepComplete: a }), { tl: s };
}
c(Oy, "buildTimeline");
function If(n, e) {
  var t;
  if (n)
    for (const i of n)
      for (const r of i) {
        if (r.before)
          try {
            Oe(r.before, e), Pi(r.before, e);
          } catch (a) {
            console.warn(`[${T}] Cinematic: error in skipped parallel before:`, a);
          }
        if (r.after)
          try {
            Oe(r.after, e), Pi(r.after, e);
          } catch (a) {
            console.warn(`[${T}] Cinematic: error in skipped parallel after:`, a);
          }
        (t = r.parallel) != null && t.branches && If(r.parallel.branches, e);
      }
}
c(If, "applyParallelStatesForSkip");
function Of(n, e, t, i = {}) {
  const { skipToStep: r, onStepComplete: a } = i;
  let o = -1;
  for (const s of n) {
    if (s.sound != null) {
      if (r != null && o < r) continue;
      const m = s.sound, { duration: f, loop: g, fireAndForget: p } = m, y = e.step();
      if (y.before(() => {
        Iy(m);
      }), f && f > 0)
        if (p) {
          if (g && m.id) {
            const v = m.id, b = f;
            y.before(() => {
              setTimeout(() => Ls(v), b);
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
        If(s.parallel.branches, t);
        continue;
      }
      const m = s.parallel, f = m.branches.map((g) => (p) => Of(g, p, t));
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
          Oe(s.before, t), Pi(s.before, t);
        } catch (m) {
          console.warn(`[${T}] Cinematic: error applying skipped step.before:`, m);
        }
      if (s.after)
        try {
          Oe(s.after, t), Pi(s.after, t);
        } catch (m) {
          console.warn(`[${T}] Cinematic: error applying skipped step.after:`, m);
        }
      continue;
    }
    const l = o, u = e.step();
    s.before && u.before(() => {
      var m;
      try {
        Oe(s.before, t), Pi(s.before, t);
      } catch (f) {
        throw console.error(`[${T}] Cinematic: error in step.before callback on scene ${(m = canvas.scene) == null ? void 0 : m.id}:`, f), f;
      }
    });
    const d = s.duration ?? 500;
    for (const m of s.tweens) {
      const f = Lf(m, t);
      f && u.add(f.type, f.params, { ...f.opts, durationMS: d });
    }
    u.after(() => {
      var m;
      try {
        s.after && (Oe(s.after, t), Pi(s.after, t)), a == null || a(l);
      } catch (f) {
        throw console.error(`[${T}] Cinematic: error in step.after callback on scene ${(m = canvas.scene) == null ? void 0 : m.id}:`, f), f;
      }
    });
  }
}
c(Of, "compileCinematicEntries");
function Ri(n, e, t) {
  if (n != null) {
    if (typeof n != "object" || Array.isArray(n)) {
      t.push({ path: e, level: "error", message: `Expected object, got ${Array.isArray(n) ? "array" : typeof n}` });
      return;
    }
    for (const [i, r] of Object.entries(n))
      (typeof r != "object" || r === null || Array.isArray(r)) && t.push({ path: `${e}["${i}"]`, level: "error", message: `Expected property overrides object, got ${Array.isArray(r) ? "array" : typeof r}` });
  }
}
c(Ri, "validateStateMap");
function ql(n, e, t, i) {
  var r;
  for (let a = 0; a < n.length; a++) {
    const o = n[a], s = `${e}[${a}]`;
    if (!(o.delay != null || o.await != null || o.emit != null) && !(o.transitionTo != null || o.sound != null || o.stopSound != null)) {
      if ((r = o.parallel) != null && r.branches) {
        for (let l = 0; l < o.parallel.branches.length; l++)
          ql(o.parallel.branches[l], `${s}.parallel.branches[${l}]`, t, i);
        continue;
      }
      if (Ri(o.before, `${s}.before`, i), Ri(o.after, `${s}.after`, i), o.tweens)
        for (let l = 0; l < o.tweens.length; l++) {
          const u = o.tweens[l], d = `${s}.tweens[${l}]`;
          if (!u.type) {
            i.push({ path: d, level: "error", message: "Missing 'type' field" });
            continue;
          }
          const m = nr(u.type);
          if (!m) {
            i.push({ path: d, level: "error", message: `Unknown tween type: "${u.type}"` });
            continue;
          }
          if (t)
            try {
              const f = Lf(u, t);
              f ? m.validate(f.params) : u.target && i.push({ path: d, level: "warn", message: `Target "${u.target}" could not be resolved for compilation` });
            } catch (f) {
              i.push({ path: d, level: "error", message: f.message });
            }
          t && u.target && !t.has(u.target) && i.push({ path: `${d}.target`, level: "warn", message: `Target "${u.target}" is not resolved` });
        }
    }
  }
}
c(ql, "validateEntries");
function Ay(n, e = null) {
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
      Ri(s.setup, `${l}.setup`, t), Ri(s.landing, `${l}.landing`, t), s.timeline && Array.isArray(s.timeline) && ql(s.timeline, `${l}.timeline`, e, t), s.next && typeof s.next == "string" && !n.segments[s.next] && t.push({ path: `${l}.next`, level: "error", message: `Next segment "${s.next}" not found` });
    }
  } else
    Ri(n.setup, "setup", t), Ri(n.landing, "landing", t), n.timeline && Array.isArray(n.timeline) && ql(n.timeline, "timeline", e, t);
  return t;
}
c(Ay, "validateCinematicDeep");
const Is = 5, gu = /* @__PURE__ */ new Set(["click", "tile-click", "keypress"]);
var le, he, Ue, Me, gt, gr, jl, Af, Y, $e, _a, Le, wt;
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
    var v;
    const { trigger: t, tracking: i, synchronized: r, setup: a, landing: o, timeline: s = [] } = e;
    if (!s.some(
      (b) => {
        var w;
        return b.await != null && gu.has(((w = b.await) == null ? void 0 : w.event) ?? "click");
      }
    )) {
      const b = s.filter((I) => I.transitionTo == null), w = s.find((I) => I.transitionTo != null), C = { timeline: b };
      if (a && Object.keys(a).length && (C.setup = a), o && Object.keys(o).length && (C.landing = o), w) {
        const I = w.transitionTo;
        I.scene && I.cinematic ? C.next = { segment: I.cinematic, scene: I.scene } : I.cinematic;
      }
      return {
        trigger: t,
        tracking: i,
        ...r ? { synchronized: r } : {},
        entry: "main",
        segments: { main: C }
      };
    }
    const u = {};
    let d = [], m = 1, f = null;
    const g = [];
    function p() {
      const b = `segment-${m++}`, w = { timeline: [...d] };
      return f && (w.gate = f), u[b] = w, g.push(b), d = [], f = null, b;
    }
    c(p, "flushSegment");
    for (const b of s)
      if (b.transitionTo == null) {
        if (b.await != null && gu.has(((v = b.await) == null ? void 0 : v.event) ?? "click")) {
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
      (i = a.timeline) != null && i.length && (a.timeline = S(r = se, gt, jl).call(r, a.timeline));
    return t;
  }
  static fromScene(e, t = "default") {
    var o;
    const i = e == null ? void 0 : e.getFlag(T, "cinematic");
    let r = i ? foundry.utils.deepClone(i) : null;
    const a = i ? S(o = se, gt, Af).call(o, i) : null;
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
    return S(this, Y, _a).call(this, { trigger: e });
  }
  setTracking(e) {
    return S(this, Y, _a).call(this, { tracking: e });
  }
  setSynchronized(e) {
    return S(this, Y, _a).call(this, { synchronized: e });
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
    return Object.keys(h(this, Y, $e).segments ?? {});
  }
  // ── Timeline entry mutations (scoped to active segment) ──────────────
  addStep(e = -1) {
    const t = [...this.activeSegment.timeline], i = { duration: 1e3, tweens: [] };
    return e < 0 || e >= t.length ? t.push(i) : t.splice(e, 0, i), S(this, Y, Le).call(this, { timeline: t });
  }
  addDelay(e = -1, t = 1e3) {
    const i = [...this.activeSegment.timeline], r = { delay: t };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), S(this, Y, Le).call(this, { timeline: i });
  }
  addAwait(e = -1, t = null) {
    return console.warn(`[${T}] CinematicState.addAwait() is deprecated in v4. Use segment gates instead.`), this;
  }
  addEmit(e = -1, t = "") {
    const i = [...this.activeSegment.timeline], r = { emit: t };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), S(this, Y, Le).call(this, { timeline: i });
  }
  addParallel(e = -1) {
    const t = [...this.activeSegment.timeline], i = { parallel: { branches: [[], []], join: "all", overflow: "detach" } };
    return e < 0 || e >= t.length ? t.push(i) : t.splice(e, 0, i), S(this, Y, Le).call(this, { timeline: t });
  }
  addTransitionTo(e = -1, t = null) {
    return console.warn(`[${T}] CinematicState.addTransitionTo() is deprecated in v4. Use segment next edges instead.`), this;
  }
  addSound(e = -1, t = null) {
    const i = [...this.activeSegment.timeline], r = { sound: t ?? { src: "", volume: 0.8, loop: !1, duration: 0, fireAndForget: !1 } };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), S(this, Y, Le).call(this, { timeline: i });
  }
  addStopSound(e = -1, t = "") {
    const i = [...this.activeSegment.timeline], r = { stopSound: t };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), S(this, Y, Le).call(this, { timeline: i });
  }
  moveEntry(e, t) {
    if (e === t) return this;
    const i = [...this.activeSegment.timeline];
    if (e < 0 || e >= i.length) return this;
    if (t < 0 || t >= i.length) return this;
    const [r] = i.splice(e, 1);
    return i.splice(t, 0, r), S(this, Y, Le).call(this, { timeline: i });
  }
  removeEntry(e) {
    const t = [...this.activeSegment.timeline];
    return e < 0 || e >= t.length ? this : (t.splice(e, 1), S(this, Y, Le).call(this, { timeline: t }));
  }
  updateEntry(e, t) {
    const i = this.activeSegment.timeline.map((r, a) => a !== e ? r : { ...foundry.utils.deepClone(r), ...t });
    return S(this, Y, Le).call(this, { timeline: i });
  }
  // ── Tween mutations ──────────────────────────────────────────────────
  addTween(e, t = null) {
    const i = { type: "tile-prop", target: "", attribute: "alpha", value: 1 };
    return S(this, Y, wt).call(this, e, (r) => {
      const a = [...r.tweens ?? [], t ?? i];
      return { ...r, tweens: a };
    });
  }
  updateTween(e, t, i) {
    return S(this, Y, wt).call(this, e, (r) => {
      const a = (r.tweens ?? []).map((o, s) => s !== t ? o : { ...o, ...i });
      return { ...r, tweens: a };
    });
  }
  removeTween(e, t) {
    return S(this, Y, wt).call(this, e, (i) => {
      const r = (i.tweens ?? []).filter((a, o) => o !== t);
      return { ...i, tweens: r };
    });
  }
  updateStepDuration(e, t) {
    return S(this, Y, wt).call(this, e, (i) => ({ ...i, duration: Math.max(0, t) }));
  }
  // ── Parallel branch mutations ────────────────────────────────────────
  addBranch(e) {
    return S(this, Y, wt).call(this, e, (t) => {
      if (!t.parallel) return t;
      const i = [...t.parallel.branches, []];
      return { ...t, parallel: { ...t.parallel, branches: i } };
    });
  }
  removeBranch(e, t) {
    return S(this, Y, wt).call(this, e, (i) => {
      if (!i.parallel) return i;
      const r = i.parallel.branches.filter((a, o) => o !== t);
      return r.length < 1 ? i : { ...i, parallel: { ...i.parallel, branches: r } };
    });
  }
  addBranchEntry(e, t, i = null) {
    const r = { duration: 1e3, tweens: [] };
    return S(this, Y, wt).call(this, e, (a) => {
      if (!a.parallel) return a;
      const o = a.parallel.branches.map((s, l) => l !== t ? s : [...s, i ?? r]);
      return { ...a, parallel: { ...a.parallel, branches: o } };
    });
  }
  removeBranchEntry(e, t, i) {
    return S(this, Y, wt).call(this, e, (r) => {
      if (!r.parallel) return r;
      const a = r.parallel.branches.map((o, s) => s !== t ? o : o.filter((l, u) => u !== i));
      return { ...r, parallel: { ...r.parallel, branches: a } };
    });
  }
  updateBranchEntry(e, t, i, r) {
    return S(this, Y, wt).call(this, e, (a) => {
      if (!a.parallel) return a;
      const o = a.parallel.branches.map((s, l) => l !== t ? s : s.map((u, d) => d !== i ? u : { ...foundry.utils.deepClone(u), ...r }));
      return { ...a, parallel: { ...a.parallel, branches: o } };
    });
  }
  moveBranchEntry(e, t, i, r) {
    return i === r ? this : S(this, Y, wt).call(this, e, (a) => {
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
    const t = { ...foundry.utils.deepClone(h(this, le)), version: Is };
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
le = new WeakMap(), he = new WeakMap(), Ue = new WeakMap(), Me = new WeakMap(), gt = new WeakSet(), gr = /* @__PURE__ */ c(function(e) {
  const { duration: t, detach: i, ...r } = e;
  return r;
}, "#stripTween"), jl = /* @__PURE__ */ c(function(e) {
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
          return S(d = se, gt, jl).call(d, u);
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
        tweens: u.map(S(se, gt, gr))
      });
    } else if (o.length === 0) {
      const l = Math.max(500, ...s.map((m) => m.duration ?? 0)), { tweens: u, ...d } = a;
      t.push({
        ...d,
        duration: l,
        tweens: s.map(S(se, gt, gr))
      });
    } else {
      const l = Math.max(500, ...o.map((f) => f.duration ?? 0)), u = Math.max(500, ...s.map((f) => f.duration ?? 0)), { tweens: d, ...m } = a;
      t.push({
        parallel: {
          branches: [
            [{ ...m, duration: l, tweens: o.map(S(se, gt, gr)) }],
            [{ duration: u, tweens: s.map(S(se, gt, gr)) }]
          ],
          join: "all",
          overflow: "detach"
        }
      });
    }
  }
  return t;
}, "#migrateTimelineV5"), Af = /* @__PURE__ */ c(function(e) {
  return foundry.utils.deepClone(e);
}, "#computeHash"), Y = new WeakSet(), $e = /* @__PURE__ */ c(function() {
  return h(this, le).cinematics[h(this, he)];
}, "#active"), // ── Internal ─────────────────────────────────────────────────────────
/** Clone the full state with a patch to the active cinematic (cinematic-level props). */
_a = /* @__PURE__ */ c(function(e) {
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
  return S(this, Y, Le).call(this, { timeline: r });
}, "#mutateEntry"), k(se, gt), c(se, "CinematicState");
let Wt = se;
const pu = [
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
}, ky = [
  { value: "canvasReady", label: "Canvas Ready" },
  { value: "manual", label: "Manual Only" }
];
function yu(n) {
  return n && (n.split("/").pop() || "").replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "-") || "";
}
c(yu, "soundIdFromPath");
function bu(n) {
  return n ? new Promise((e) => {
    const t = new Audio(n);
    t.addEventListener("loadedmetadata", () => {
      e(Math.round(t.duration * 1e3));
    }), t.addEventListener("error", () => e(0));
  }) : Promise.resolve(0);
}
c(bu, "loadAudioDurationMs");
const Pn = 40, wr = 24, Mr = 50, vu = 50, Zn = 60, ii = 10, Os = 16, Mf = 40, _f = 20, My = 90, wu = 70, Eu = 8;
function as(n) {
  return { stepDuration: Math.max(500, n.duration ?? 500), detachOverflow: 0 };
}
c(as, "computeStepDurations");
function _y(n) {
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
c(_y, "computeParallelDuration");
function Cc(n) {
  return n.reduce((e, t) => t.delay != null ? e + t.delay : t.await != null || t.emit != null || t.transitionTo != null ? e : t.sound != null ? e + (t.sound.fireAndForget ? 0 : t.sound.duration ?? 0) : t.stopSound != null ? e : t.parallel != null ? e + _y(t) : e + as(t).stepDuration, 0);
}
c(Cc, "computeTotalDuration");
function Ny(n, e) {
  if (n <= 0) return 0.1;
  const t = e / n;
  return Math.max(0.03, Math.min(0.5, t));
}
c(Ny, "computeScale");
function Nf(n) {
  const e = n.tweens ?? [];
  if (e.length === 0) return "Empty";
  const t = e[0], i = (t.target ?? "").replace(/^tag:/, "#"), r = t.attribute ?? "";
  return t.type === "camera-pan" ? "Pan" : r === "alpha" ? `Fade ${i}` : r === "x" || r === "y" ? `Move ${i}` : t.type === "light-color" ? `Light ${i}` : t.type === "sound-prop" ? `Sound ${i}` : i ? `${i}` : "Step";
}
c(Nf, "deriveStepLabel");
function xy(n, e, t, i, r) {
  var u, d;
  const a = [], o = [], s = [];
  let l = e;
  for (let m = 0; m < n.length; m++) {
    const f = n[m], g = `${i}.${m}`, p = r === g;
    if (f.delay != null) {
      const y = Math.max(_f, f.delay * t);
      a.push({ type: "delay", leftPx: l, widthPx: y, label: `${f.delay}ms`, entryPath: g, selected: p }), l += y;
    } else if (f.await != null) {
      const y = ((u = f.await) == null ? void 0 : u.event) ?? "click", v = y === "tile-click" ? "fa-hand-pointer" : y === "signal" ? "fa-bolt" : "fa-pause";
      a.push({ type: "await", leftPx: l, widthPx: Os, label: y, entryPath: g, selected: p, isGate: !0, gateIcon: v }), ((d = f.await) == null ? void 0 : d.event) === "signal" && s.push({ signal: f.await.signal, centerPx: l + Os / 2 }), l += Os;
    } else if (f.emit != null)
      a.push({ type: "emit", leftPx: l, widthPx: ii, label: "emit", entryPath: g, selected: p, isMarker: !0 }), o.push({ signal: f.emit, centerPx: l + ii / 2 });
    else if (f.sound != null) {
      const y = (f.sound.src || "").split("/").pop() || "Sound", v = f.sound.duration ?? 0;
      if (f.sound.fireAndForget ?? !1)
        a.push({ type: "sound", leftPx: l, widthPx: ii, label: y, entryPath: g, selected: p, isMarker: !0 });
      else {
        const w = v > 0 ? Math.max(Zn, v * t) : Zn, C = (f.sound.loop ?? !1) && v <= 0;
        a.push({ type: "sound", leftPx: l, widthPx: w, label: y, entryPath: g, selected: p, hasTrailingArrow: C }), l += w;
      }
    } else if (f.stopSound != null)
      a.push({ type: "stopSound", leftPx: l, widthPx: ii, label: "Stop", entryPath: g, selected: p, isMarker: !0 });
    else {
      const { stepDuration: y } = as(f), v = Math.max(Mf, y * t), b = Nf(f);
      a.push({ type: "step", leftPx: l, widthPx: v, label: b, entryPath: g, selected: p }), l += v;
    }
  }
  return { blocks: a, width: l - e, emits: o, awaits: s };
}
c(xy, "computeBranchLane");
function Su(n) {
  return wr + n * Pn;
}
c(Su, "laneIndexToY");
function $y(n, e) {
  const t = [];
  for (const i of n.emits)
    for (const r of n.awaits) {
      if (i.signal !== r.signal) continue;
      const a = i.centerPx, o = Su(i.laneIndex) + Pn / 2, s = r.centerPx, l = Su(r.laneIndex) + Pn / 2, u = l - o, d = (a + s) / 2, m = o + Math.sign(u || 1) * Math.min(40, Math.abs(u) * 0.5 + 20), f = l - Math.sign(u || 1) * Math.min(40, Math.abs(u) * 0.5 + 20);
      t.push({
        pathD: `M ${a} ${o} C ${d} ${m}, ${d} ${f}, ${s} ${l}`,
        signal: i.signal
      });
    }
  return t;
}
c($y, "computeSignalArcs");
function Fy(n, e) {
  const t = [];
  if (n <= 0) return t;
  const i = e * 1e3;
  let r;
  i >= 200 ? r = 500 : i >= 80 ? r = 1e3 : i >= 40 ? r = 2e3 : r = 5e3;
  for (let a = 0; a <= n + r; a += r) {
    const o = a >= 1e3 ? `${(a / 1e3).toFixed(a % 1e3 === 0 ? 0 : 1)}s` : `${a}ms`;
    t.push({ px: Mr + a * e, label: o });
  }
  return t;
}
c(Fy, "computeTimeMarkers");
function Dy(n) {
  const e = [];
  for (let t = 0; t < n.length - 1; t++) {
    const i = n[t], r = n[t + 1], a = i.leftPx + i.widthPx + (r.leftPx - (i.leftPx + i.widthPx)) / 2, o = wr + Pn / 2;
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
c(Dy, "computeInsertionPoints");
function Py(n, { selectedPath: e, windowWidth: t }) {
  const i = Cc(n), r = t - 70 - 100, a = Ny(i, r), o = [], s = [], l = { emits: [], awaits: [] }, u = [];
  o.push({
    type: "setup",
    leftPx: 0,
    widthPx: Mr,
    label: "Setup",
    entryPath: "setup",
    selected: e === "setup"
  });
  let d = Mr;
  for (let w = 0; w < n.length; w++) {
    const C = n[w], I = `timeline.${w}`, A = e === I;
    if (C.delay != null) {
      const O = Math.max(_f, C.delay * a);
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
        widthPx: ii,
        label: "Emit",
        entryPath: I,
        selected: A,
        isMarker: !0
      }), l.emits.push({
        signal: C.emit,
        centerPx: d + ii / 2,
        laneIndex: 0
      });
    else if (C.sound != null) {
      const O = (C.sound.src || "").split("/").pop() || "Sound", M = C.sound.duration ?? 0;
      if (C.sound.fireAndForget ?? !1) {
        const j = M > 0 ? Math.max(Zn, M * a) : Zn, D = (C.sound.loop ?? !1) && M <= 0, P = {
          type: "sound",
          leftPx: d,
          widthPx: j,
          label: O,
          entryPath: I,
          selected: A,
          hasTrailingArrow: D
        };
        let N = !1;
        for (const R of u)
          if (R.rightEdgePx <= d) {
            R.blocks.push(P), R.rightEdgePx = d + j, N = !0;
            break;
          }
        N || u.push({
          label: "♫ F&F",
          blocks: [P],
          rightEdgePx: d + j
        });
      } else {
        const j = M > 0 ? Math.max(Zn, M * a) : Zn, D = (C.sound.loop ?? !1) && M <= 0;
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
        widthPx: ii,
        label: "Stop",
        entryPath: I,
        selected: A,
        isMarker: !0
      });
    else if (C.parallel != null) {
      const O = C.parallel.branches ?? [], M = d, $ = [];
      let j = 0;
      for (let P = 0; P < O.length; P++) {
        const N = `timeline.${w}.parallel.branches.${P}`, { blocks: R, width: B, emits: W, awaits: H } = xy(O[P], M, a, N, e);
        $.push({ label: `Br ${P + 1}`, blocks: R }), j = Math.max(j, B);
        const U = s.length * 10 + P + 1;
        for (const K of W) l.emits.push({ ...K, laneIndex: U });
        for (const K of H) l.awaits.push({ ...K, laneIndex: U });
      }
      const D = Math.max(Zn, j);
      o.push({
        type: "parallel",
        leftPx: M,
        widthPx: D,
        label: `${O.length} br`,
        entryPath: I,
        selected: A
      }), s.push({ parallelEntryIndex: w, startPx: M, lanes: $ }), d += D;
    } else {
      const { stepDuration: O } = as(C), M = Math.max(Mf, O * a), $ = Nf(C);
      o.push({
        type: "step",
        leftPx: d,
        widthPx: M,
        label: $,
        entryPath: I,
        selected: A
      }), d += M;
    }
  }
  o.push({
    type: "landing",
    leftPx: d,
    widthPx: vu,
    label: "Landing",
    entryPath: "landing",
    selected: e === "landing"
  }), d += vu;
  const m = s.flatMap((w) => w.lanes), f = m.length;
  for (const w of u)
    m.push({ label: w.label, blocks: w.blocks });
  const g = $y(l, m.length), p = [];
  for (let w = 0; w < u.length; w++) {
    const C = f + w;
    for (const I of u[w].blocks) {
      const A = I.leftPx, O = wr + Pn, M = wr + (1 + C) * Pn + Pn / 2;
      p.push({ x: A, y1: O, y2: M });
    }
  }
  const y = Fy(i, a), v = Dy(o), b = wr + (1 + m.length) * Pn;
  return {
    mainBlocks: o,
    subLanes: m,
    signalArcs: g,
    fafConnectors: p,
    timeMarkers: y,
    insertionPoints: v,
    totalWidthPx: Math.max(d, 200),
    swimlaneHeightPx: b,
    totalDurationMs: i
  };
}
c(Py, "computeLanes");
function Ry(n) {
  if (n <= 0) return "0s";
  if (n < 1e3) return `${n}ms`;
  const e = n / 1e3;
  return e % 1 === 0 ? `${e}s` : `${e.toFixed(1)}s`;
}
c(Ry, "formatDuration");
function Hy(n, e) {
  var g, p, y, v;
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
  let u = Eu;
  for (const b of o) {
    const w = t[b], C = Cc(w.timeline ?? []), I = Ry(C), A = b === i, O = b === e, M = !a.has(b), $ = My;
    l.push({
      name: b,
      durationMs: C,
      durationLabel: I,
      isEntry: A,
      isActive: O,
      isOrphan: M,
      leftPx: u,
      widthPx: $,
      hasGate: !!w.gate,
      gateEvent: ((g = w.gate) == null ? void 0 : g.event) ?? null
    }), u += $ + wu;
  }
  const d = [], m = new Map(l.map((b) => [b.name, b]));
  for (const b of o) {
    const w = t[b];
    if (!w.next) continue;
    const C = typeof w.next == "string" ? w.next : (p = w.next) == null ? void 0 : p.segment;
    if (!C) continue;
    const I = m.get(b), A = m.get(C);
    if (!I || !A) continue;
    const O = t[C], M = ((y = O == null ? void 0 : O.gate) == null ? void 0 : y.event) ?? null, $ = typeof w.next == "object" && ((v = w.next) == null ? void 0 : v.scene);
    d.push({
      fromName: b,
      toName: C,
      gateLabel: M,
      isCrossScene: $,
      fromRightPx: I.leftPx + I.widthPx,
      toLeftPx: A.leftPx
    });
  }
  const f = u - wu + Eu;
  return { nodes: l, edges: d, totalWidthPx: f };
}
c(Hy, "computeSegmentGraph");
function Bn(n) {
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
c(Bn, "parseEntryPath");
function io(n, e) {
  var i, r, a, o;
  const t = Bn(n);
  return t ? t.type === "setup" ? e.setup : t.type === "landing" ? e.landing : t.type === "timeline" ? e.timeline[t.index] : t.type === "branch" ? (o = (a = (r = (i = e.timeline[t.index]) == null ? void 0 : i.parallel) == null ? void 0 : r.branches) == null ? void 0 : a[t.branchIndex]) == null ? void 0 : o[t.branchEntryIndex] : null : null;
}
c(io, "getEntryAtPath");
function Cu(n) {
  const e = Bn(n);
  return !e || e.type !== "timeline" ? null : e.index;
}
c(Cu, "getTimelineIndexFromPath");
function qy(n) {
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
c(qy, "countUniqueTargets");
function jy(n, e) {
  var i, r, a;
  const t = Bn(n);
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
c(jy, "stepNumberForPath");
function By(n) {
  return {
    isSetup: !0,
    targetCount: Object.keys(n.setup ?? {}).length
  };
}
c(By, "buildSetupDetail");
function Uy(n) {
  return {
    isLanding: !0,
    targetCount: Object.keys(n.landing ?? {}).length
  };
}
c(Uy, "buildLandingDetail");
function Vy(n) {
  return { type: "delay", isDelay: !0, delay: n.delay };
}
c(Vy, "buildDelayDetail");
function zy(n) {
  return { type: "emit", isEmit: !0, signal: n.emit };
}
c(zy, "buildEmitDetail");
function Gy(n) {
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
c(Gy, "buildSoundDetail");
function Wy(n) {
  return {
    type: "stopSound",
    isStopSound: !0,
    stopSoundId: n.stopSound
  };
}
c(Wy, "buildStopSoundDetail");
function Yy(n, e) {
  var o;
  const t = n.parallel, i = t.join ?? "all", r = t.overflow ?? "detach", a = (t.branches ?? []).map((s, l) => ({
    branchIndex: l,
    label: `Branch ${l + 1}`,
    entries: (s ?? []).map((u, d) => {
      var C, I;
      const m = u.delay != null, f = u.await != null, g = u.emit != null, p = u.sound != null, y = u.stopSound != null, v = !m && !f && !g && !p && !y;
      let b, w;
      return m ? (b = `${u.delay}ms`, w = "delay") : f ? (b = "Await", w = ((C = u.await) == null ? void 0 : C.event) ?? "click") : g ? (b = "Emit", w = u.emit || "(unnamed)") : p ? (b = "Sound", w = (u.sound.src || "").split("/").pop() || "(none)") : y ? (b = "Stop Sound", w = u.stopSound || "(no id)") : (b = "Step", w = `${((I = u.tweens) == null ? void 0 : I.length) ?? 0} tweens`), { branchEntryIndex: d, isDelay: m, isAwait: f, isEmit: g, isSound: p, isStopSound: y, isStep: v, label: b, sub: w };
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
c(Yy, "buildParallelDetail");
function Ky(n, e, t, i) {
  const r = bc(), a = (n.tweens ?? []).map((l, u) => {
    const d = `${e}.tweens.${u}`, m = t.has(d), f = l.type ?? "tile-prop", g = pu.find((b) => b.value === f), p = kf[f], y = (p == null ? void 0 : p.form) ?? "prop", v = l.mode ?? "oklch";
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
      colorMode: v,
      colorModeIsOklch: v === "oklch",
      colorModeIsHsl: v === "hsl",
      colorModeIsRgb: v === "rgb",
      // Light-state fields
      enabled: l.enabled ?? !0,
      typeOptions: pu.map((b) => ({
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
    stepNumber: jy(e, i),
    stepDuration: n.duration ?? 1e3,
    tweens: a,
    beforeSummary: o.length ? `${o.length} target${o.length !== 1 ? "s" : ""}` : "(none)",
    afterSummary: s.length ? `${s.length} target${s.length !== 1 ? "s" : ""}` : "(none)"
  };
}
c(Ky, "buildStepDetail");
function Jy(n, { state: e, expandedTweens: t }) {
  const i = Bn(n);
  if (!i) return null;
  if (i.type === "setup") return By(e);
  if (i.type === "landing") return Uy(e);
  const r = io(n, e);
  return r ? r.delay != null ? Vy(r) : r.emit != null ? zy(r) : r.sound != null ? Gy(r) : r.stopSound != null ? Wy(r) : r.parallel != null && i.type === "timeline" ? Yy(r) : Ky(r, n, t, e) : null;
}
c(Jy, "buildDetail");
function Xy({ state: n, mutate: e }) {
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
              e(() => new Wt(l));
            else if (l.segments !== void 0) {
              const u = { version: 4, cinematics: { [n.activeCinematicName]: l } };
              e(() => new Wt(u, { cinematicName: n.activeCinematicName }));
            } else if (l.timeline !== void 0) {
              const u = { version: 3, cinematics: { [n.activeCinematicName]: l } };
              e(() => new Wt(u, { cinematicName: n.activeCinematicName }));
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
c(Xy, "showImportDialog");
function ro(n, { state: e, mutate: t }) {
  const i = n === "setup" ? e.setup : e.landing, r = JSON.stringify(i ?? {}, null, 2);
  new Dialog({
    title: `Edit ${n.charAt(0).toUpperCase() + n.slice(1)}`,
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
function Tu(n, { selectedPath: e, state: t, mutate: i }) {
  const r = io(e, t);
  if (!r || r.delay != null) return;
  const a = r[n] ?? {}, o = JSON.stringify(a, null, 2);
  new Dialog({
    title: `Edit Step ${n.charAt(0).toUpperCase() + n.slice(1)}`,
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
            const m = JSON.parse(l), f = Bn(e);
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
c(Tu, "showEditStepStateDialog");
function Qy({ selectedPath: n, state: e, mutate: t }) {
  const i = Bn(n);
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
c(Qy, "showEditParallelJsonDialog");
var qu, An, Hn, Na, xf;
const St = class St extends Gn(zn) {
  constructor(t = {}) {
    super(t);
    k(this, Hn);
    k(this, An, null);
    L(this, An, t.scene ?? canvas.scene ?? null);
  }
  async _prepareContext() {
    var r, a, o;
    const t = h(this, Hn, Na), i = ((a = t == null ? void 0 : t.getSeenStatus) == null ? void 0 : a.call(t, (r = h(this, An)) == null ? void 0 : r.id)) ?? [];
    return {
      sceneName: ((o = h(this, An)) == null ? void 0 : o.name) ?? "No scene",
      users: i.map((s) => ({
        ...s,
        statusLabel: s.seen ? "Seen" : "Not seen",
        statusClass: s.seen ? "cinematic-tracking__status--seen" : "cinematic-tracking__status--unseen"
      })),
      hasAnyTracked: i.some((s) => s.seen)
    };
  }
  _onRender(t, i) {
    super._onRender(t, i), S(this, Hn, xf).call(this);
  }
};
An = new WeakMap(), Hn = new WeakSet(), Na = /* @__PURE__ */ c(function() {
  var t, i;
  return (i = (t = game.modules.get(T)) == null ? void 0 : t.api) == null ? void 0 : i.cinematic;
}, "#api"), xf = /* @__PURE__ */ c(function() {
  var i, r;
  const t = this.element;
  t instanceof HTMLElement && (t.querySelectorAll("[data-action='reset-user']").forEach((a) => {
    a.addEventListener("click", async () => {
      var l;
      const o = a.dataset.userId;
      if (!o) return;
      const s = h(this, Hn, Na);
      s != null && s.resetForUser && (await s.resetForUser((l = h(this, An)) == null ? void 0 : l.id, o), this.render({ force: !0 }));
    });
  }), (i = t.querySelector("[data-action='reset-all']")) == null || i.addEventListener("click", async () => {
    var o;
    const a = h(this, Hn, Na);
    a != null && a.resetForAll && (await a.resetForAll((o = h(this, An)) == null ? void 0 : o.id), this.render({ force: !0 }));
  }), (r = t.querySelector("[data-action='refresh']")) == null || r.addEventListener("click", () => {
    this.render({ force: !0 });
  }));
}, "#bindEvents"), c(St, "CinematicTrackingApplication"), ye(St, "APP_ID", `${T}-cinematic-tracking`), ye(St, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Re(St, St, "DEFAULT_OPTIONS"),
  {
    id: St.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((qu = Re(St, St, "DEFAULT_OPTIONS")) == null ? void 0 : qu.classes) ?? [], "eidolon-cinematic-tracking-window", "themed"])
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
let Bl = St;
function Zy(n, e) {
  var t, i, r, a, o, s, l, u, d;
  (t = n.querySelector("[data-action='save']")) == null || t.addEventListener("click", () => e.save()), (i = n.querySelector("[data-action='play-preview']")) == null || i.addEventListener("click", () => e.play()), (r = n.querySelector("[data-action='reset-tracking']")) == null || r.addEventListener("click", () => e.resetTracking()), (a = n.querySelector("[data-action='export-json']")) == null || a.addEventListener("click", () => e.exportJSON()), (o = n.querySelector("[data-action='undo']")) == null || o.addEventListener("click", () => e.undo()), (s = n.querySelector("[data-action='redo']")) == null || s.addEventListener("click", () => e.redo()), (l = n.querySelector("[data-action='validate']")) == null || l.addEventListener("click", () => e.validate()), (u = n.querySelector("[data-action='import-json']")) == null || u.addEventListener("click", () => e.importJSON()), (d = n.querySelector("[data-action='open-tracking']")) == null || d.addEventListener("click", () => {
    new Bl({ scene: e.scene }).render(!0);
  });
}
c(Zy, "bindToolbarEvents");
function eb(n, e) {
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
      content: `<label style="display:flex;align-items:center;gap:0.5rem"><span>Name:</span><input id="cinematic-rename" type="text" style="flex:1" value="${xt(o)}" /></label>`,
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
c(eb, "bindCinematicSelectorEvents");
function tb(n, e) {
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
        const s = Cu(t), l = Cu(o);
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
c(tb, "bindSwimlaneEvents");
function nb(n, e) {
  var t, i, r, a, o, s, l, u, d, m, f;
  (t = n.querySelector("[data-action='delete-entry']")) == null || t.addEventListener("click", () => {
    const g = e.parseEntryPath(e.selectedPath);
    g && (g.type === "timeline" ? (e.mutate((p) => p.removeEntry(g.index)), e.setSelectedPath(null)) : g.type === "branch" && (e.mutate((p) => p.removeBranchEntry(g.index, g.branchIndex, g.branchEntryIndex)), e.setSelectedPath(null)));
  }), (i = n.querySelector("[data-action='step-duration']")) == null || i.addEventListener("input", (g) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = Number(g.target.value) || 0;
    p.type === "timeline" ? e.mutate((v) => v.updateStepDuration(p.index, y)) : p.type === "branch" && e.mutate((v) => v.updateBranchEntry(p.index, p.branchIndex, p.branchEntryIndex, { duration: Math.max(0, y) }));
  }), (r = n.querySelector("[data-action='add-tween']")) == null || r.addEventListener("click", () => {
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
  }), (a = n.querySelector("[data-action='change-delay']")) == null || a.addEventListener("change", (g) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = Number(g.target.value) || 0;
    p.type === "timeline" ? e.mutate((v) => v.updateEntry(p.index, { delay: y })) : p.type === "branch" && e.mutate((v) => v.updateBranchEntry(p.index, p.branchIndex, p.branchEntryIndex, { delay: y }));
  }), (o = n.querySelector("[data-action='edit-setup']")) == null || o.addEventListener("click", () => {
    ro("setup", { state: e.state, mutate: e.mutate });
  }), (s = n.querySelector("[data-action='edit-landing']")) == null || s.addEventListener("click", () => {
    ro("landing", { state: e.state, mutate: e.mutate });
  }), (l = n.querySelector("[data-action='edit-before']")) == null || l.addEventListener("click", () => {
    Tu("before", { selectedPath: e.selectedPath, state: e.state, mutate: e.mutate });
  }), (u = n.querySelector("[data-action='edit-after']")) == null || u.addEventListener("click", () => {
    Tu("after", { selectedPath: e.selectedPath, state: e.state, mutate: e.mutate });
  }), (d = n.querySelector("[data-action='change-trigger']")) == null || d.addEventListener("change", (g) => {
    e.mutate((p) => p.setTrigger(g.target.value));
  }), (m = n.querySelector("[data-action='change-tracking']")) == null || m.addEventListener("change", (g) => {
    e.mutate((p) => p.setTracking(g.target.checked));
  }), (f = n.querySelector("[data-action='change-synchronized']")) == null || f.addEventListener("change", (g) => {
    e.mutate((p) => p.setSynchronized(g.target.checked));
  });
}
c(nb, "bindDetailPanelEvents");
const Qi = /* @__PURE__ */ new WeakMap(), ao = /* @__PURE__ */ new Set(), oo = /* @__PURE__ */ new Set(), Lu = {
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
  var p, y, v;
  if (!n) return !1;
  Zi(n);
  const t = e.mode ?? (e.color != null ? "custom" : "hover"), i = Lu[t] ?? Lu.hover, r = e.color ?? i.borderColor, a = e.alpha ?? i.borderAlpha, o = e.color ?? i.spriteTint, s = i.spriteAlpha, l = e.pulse ?? i.pulse, u = { border: null, sprite: null, pulseData: null, mode: t }, d = ((p = n.document) == null ? void 0 : p.width) ?? n.w ?? 100, m = ((y = n.document) == null ? void 0 : y.height) ?? n.h ?? 100, f = new PIXI.Graphics();
  f.lineStyle(i.borderWidth, r, a), f.drawRect(0, 0, d, m), n.addChild(f), u.border = f;
  const g = ib(n, o, s);
  if (g && (canvas.controls.debug.addChild(g), oo.add(g), u.sprite = g), l && ((v = canvas.app) != null && v.ticker)) {
    const b = {
      elapsed: 0,
      fn: /* @__PURE__ */ c((w) => {
        b.elapsed += w;
        const C = (Math.sin(b.elapsed * 0.05) + 1) / 2;
        u.border && (u.border.alpha = a * (0.4 + 0.6 * C)), u.sprite && (u.sprite.alpha = s * (0.5 + 0.5 * C));
      }, "fn")
    };
    canvas.app.ticker.add(b.fn), u.pulseData = b, ao.add(b);
  }
  return Qi.set(n, u), !0;
}
c(so, "addHighlight");
function Zi(n) {
  var t, i;
  if (!n) return;
  const e = Qi.get(n);
  e && (e.pulseData && ((i = (t = canvas.app) == null ? void 0 : t.ticker) == null || i.remove(e.pulseData.fn), ao.delete(e.pulseData)), e.border && (e.border.parent && e.border.parent.removeChild(e.border), e.border.destroy({ children: !0 })), e.sprite && (e.sprite.parent && e.sprite.parent.removeChild(e.sprite), e.sprite.destroy({ children: !0 }), oo.delete(e.sprite)), Qi.delete(n));
}
c(Zi, "removeHighlight");
function $f(n) {
  return Qi.has(n);
}
c($f, "hasHighlight");
function xa() {
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
        const d = Qi.get(u);
        d && (d.border && (d.border.parent && d.border.parent.removeChild(d.border), d.border.destroy({ children: !0 })), Qi.delete(u));
      }
}
c(xa, "clearAllHighlights");
function ib(n, e, t) {
  var a;
  const i = n.mesh;
  if (!((a = i == null ? void 0 : i.texture) != null && a.baseTexture)) return null;
  const r = PIXI.Sprite.from(i.texture);
  return r.isSprite = !0, r.anchor.set(i.anchor.x, i.anchor.y), r.width = i.width, r.height = i.height, r.scale = i.scale, r.position = n.center, r.angle = i.angle, r.alpha = t, r.tint = e, r.name = "eidolonPickerHighlight", r;
}
c(ib, "createTintSprite");
let ei = null;
function Ff(n) {
  var p, y, v;
  ei && ei.cancel();
  const { placeableType: e = "Tile", onPick: t, onCancel: i } = n;
  let r = null;
  const a = `control${e}`, o = `hover${e}`, s = /* @__PURE__ */ c((b, w) => {
    var I;
    if (!w) return;
    const C = b.document ?? b;
    (I = b.release) == null || I.call(b), t(C);
  }, "onControl"), l = /* @__PURE__ */ c((b, w) => {
    w ? (r = b, so(b, { mode: "pick" })) : r === b && (Zi(b), r = null);
  }, "onHoverIn"), u = /* @__PURE__ */ c((b) => {
    b.key === "Escape" && (b.preventDefault(), b.stopPropagation(), g());
  }, "onKeydown"), d = /* @__PURE__ */ c((b) => {
    b.preventDefault(), g();
  }, "onContextMenu"), m = Hooks.on(a, s), f = Hooks.on(o, l);
  document.addEventListener("keydown", u, { capture: !0 }), (p = canvas.stage) == null || p.addEventListener("rightclick", d), (v = (y = ui.notifications) == null ? void 0 : y.info) == null || v.call(y, `Pick mode active — click a ${e.toLowerCase()} on the canvas, or press ESC to cancel.`, { permanent: !1 });
  function g() {
    var b;
    ei && (ei = null, Hooks.off(a, m), Hooks.off(o, f), document.removeEventListener("keydown", u, { capture: !0 }), (b = canvas.stage) == null || b.removeEventListener("rightclick", d), r && (Zi(r), r = null), i == null || i());
  }
  return c(g, "cancel"), ei = { cancel: g }, { cancel: g };
}
c(Ff, "enterPickMode");
function pr() {
  ei && ei.cancel();
}
c(pr, "cancelPickMode");
const rb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cancelPickMode: pr,
  enterPickMode: Ff
}, Symbol.toStringTag, { value: "Module" }));
var ju, _e, Ve, Wr, kn, Yr, Kr, et, Mn, fe, Df, Ul, Pf, Rf, Hf, Vl, zl, qf, jf;
const dt = class dt extends Gn(zn) {
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
    k(this, Wr, "Tile");
    /** @type {string} Current tag match mode. */
    k(this, kn, "any");
    /** @type {((selectors: string[]) => void) | null} */
    k(this, Yr, null);
    /** @type {(() => void) | null} */
    k(this, Kr, null);
    /** @type {Promise resolve function for the open() API. */
    k(this, et, null);
    /** @type {PlaceableObject | null} Currently hovered tile in the browser. */
    k(this, Mn, null);
    L(this, _e, [...t.selections ?? []]), L(this, Wr, t.placeableType ?? "Tile"), L(this, Yr, t.onApply ?? null), L(this, Kr, t.onCancel ?? null);
  }
  // ── Context ───────────────────────────────────────────────────────────
  async _prepareContext() {
    var r;
    const t = S(this, fe, Vl).call(this), i = (((r = canvas.tiles) == null ? void 0 : r.placeables) ?? []).map((a, o) => {
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
      tagModeIsAny: h(this, kn) === "any",
      tagModeIsAll: h(this, kn) === "all",
      tagPreviewCount: 0,
      tiles: i,
      tileCount: i.length
    };
  }
  // ── Render & Events ───────────────────────────────────────────────────
  _onRender(t, i) {
    super._onRender(t, i), S(this, fe, Df).call(this), S(this, fe, zl).call(this);
  }
  async _onClose(t) {
    return h(this, Ve) && (pr(), L(this, Ve, !1)), xa(), h(this, et) && (h(this, et).call(this, null), L(this, et, null)), super._onClose(t);
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
_e = new WeakMap(), Ve = new WeakMap(), Wr = new WeakMap(), kn = new WeakMap(), Yr = new WeakMap(), Kr = new WeakMap(), et = new WeakMap(), Mn = new WeakMap(), fe = new WeakSet(), Df = /* @__PURE__ */ c(function() {
  var a, o, s, l;
  const t = this.element;
  if (!(t instanceof HTMLElement)) return;
  const i = t.querySelector("[data-role='tag-input']"), r = t.querySelector("[data-role='tag-mode']");
  r == null || r.addEventListener("change", (u) => {
    L(this, kn, u.target.value);
  }), i == null || i.addEventListener("input", () => {
    S(this, fe, Pf).call(this, t);
  }), i == null || i.addEventListener("keydown", (u) => {
    u.key === "Enter" && (u.preventDefault(), S(this, fe, Ul).call(this, t));
  }), (a = t.querySelector("[data-action='add-tag-selector']")) == null || a.addEventListener("click", () => {
    S(this, fe, Ul).call(this, t);
  }), (o = t.querySelector("[data-action='toggle-pick-mode']")) == null || o.addEventListener("click", () => {
    h(this, Ve) ? (pr(), L(this, Ve, !1)) : (L(this, Ve, !0), Ff({
      placeableType: h(this, Wr),
      onPick: /* @__PURE__ */ c((u) => {
        S(this, fe, Rf).call(this, u.id);
      }, "onPick"),
      onCancel: /* @__PURE__ */ c(() => {
        L(this, Ve, !1), this.render({ force: !0 });
      }, "onCancel")
    })), this.render({ force: !0 });
  }), t.querySelectorAll("[data-action='toggle-tile']").forEach((u) => {
    u.addEventListener("click", () => {
      const d = u.dataset.docId;
      d && S(this, fe, Hf).call(this, d);
    }), u.addEventListener("mouseenter", () => {
      var f, g;
      const d = u.dataset.docId;
      if (!d) return;
      const m = (g = (f = canvas.tiles) == null ? void 0 : f.placeables) == null ? void 0 : g.find((p) => p.document.id === d);
      m && (L(this, Mn, m), so(m, { mode: "hover" }));
    }), u.addEventListener("mouseleave", () => {
      h(this, Mn) && (Zi(h(this, Mn)), L(this, Mn, null), S(this, fe, zl).call(this));
    });
  }), t.querySelectorAll("[data-action='remove-selection']").forEach((u) => {
    u.addEventListener("click", () => {
      const d = Number(u.dataset.selectionIndex);
      Number.isNaN(d) || (h(this, _e).splice(d, 1), this.render({ force: !0 }));
    });
  }), (s = t.querySelector("[data-action='apply']")) == null || s.addEventListener("click", () => {
    S(this, fe, qf).call(this);
  }), (l = t.querySelector("[data-action='cancel']")) == null || l.addEventListener("click", () => {
    S(this, fe, jf).call(this);
  });
}, "#bindEvents"), // ── Tag helpers ───────────────────────────────────────────────────────
Ul = /* @__PURE__ */ c(function(t) {
  var s;
  const i = t.querySelector("[data-role='tag-input']"), r = (s = i == null ? void 0 : i.value) == null ? void 0 : s.trim();
  if (!r) return;
  const a = r.split(",").map((l) => l.trim()).filter(Boolean);
  if (a.length === 0) return;
  const o = Cf(a, h(this, kn));
  o && !h(this, _e).includes(o) && h(this, _e).push(o), i && (i.value = ""), this.render({ force: !0 });
}, "#addTagSelector"), Pf = /* @__PURE__ */ c(function(t) {
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
  const l = h(this, kn) === "any", u = s.getByTag(o, {
    sceneId: (f = canvas.scene) == null ? void 0 : f.id,
    matchAny: l
  }), d = (u == null ? void 0 : u.length) ?? 0;
  r.textContent = `${d} matching placeable(s)`;
}, "#updateTagPreview"), // ── ID selector helpers ──────────────────────────────────────────────
Rf = /* @__PURE__ */ c(function(t) {
  const i = `id:${t}`;
  h(this, _e).includes(i) || (h(this, _e).push(i), this.render({ force: !0 }));
}, "#addIdSelector"), Hf = /* @__PURE__ */ c(function(t) {
  const i = `id:${t}`, r = h(this, _e).indexOf(i);
  r >= 0 ? h(this, _e).splice(r, 1) : h(this, _e).push(i), this.render({ force: !0 });
}, "#toggleIdSelector"), /**
 * Get the set of document IDs that are currently selected across all selector types.
 * Resolves tag/tags-any/tags-all selectors to find matching document IDs.
 * @returns {Set<string>}
 */
Vl = /* @__PURE__ */ c(function() {
  const t = /* @__PURE__ */ new Set();
  for (const i of h(this, _e)) {
    const r = Sc(i);
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
zl = /* @__PURE__ */ c(function() {
  var r, a;
  const t = S(this, fe, Vl).call(this), i = ((r = canvas.tiles) == null ? void 0 : r.placeables) ?? [];
  for (const o of i) {
    const s = (a = o.document) == null ? void 0 : a.id;
    if (!s) continue;
    const l = t.has(s), u = o === h(this, Mn), d = $f(o);
    l && !u && !d ? so(o, { mode: "selected" }) : !l && d && !u && Zi(o);
  }
}, "#refreshSelectionHighlights"), // ── Apply / Cancel ──────────────────────────────────────────────────
qf = /* @__PURE__ */ c(function() {
  var i;
  h(this, Ve) && (pr(), L(this, Ve, !1)), xa();
  const t = [...h(this, _e)];
  (i = h(this, Yr)) == null || i.call(this, t), h(this, et) && (h(this, et).call(this, t), L(this, et, null)), this.close({ force: !0 });
}, "#doApply"), jf = /* @__PURE__ */ c(function() {
  var t;
  h(this, Ve) && (pr(), L(this, Ve, !1)), xa(), (t = h(this, Kr)) == null || t.call(this), h(this, et) && (h(this, et).call(this, null), L(this, et, null)), this.close({ force: !0 });
}, "#doCancel"), c(dt, "PlaceablePickerApplication"), ye(dt, "APP_ID", `${T}-placeable-picker`), ye(dt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Re(dt, dt, "DEFAULT_OPTIONS"),
  {
    id: dt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((ju = Re(dt, dt, "DEFAULT_OPTIONS")) == null ? void 0 : ju.classes) ?? [], "eidolon-placeable-picker-window", "themed"])
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
function ab(n, e) {
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
c(ab, "bindTweenFieldEvents");
function ob(n, e) {
  var i, r, a, o, s, l, u, d, m, f;
  function t(g, p, y) {
    g.type === "timeline" ? e.mutate((v) => v.updateEntry(g.index, { sound: y })) : g.type === "branch" && e.mutate((v) => v.updateBranchEntry(g.index, g.branchIndex, g.branchEntryIndex, { sound: y }));
  }
  c(t, "applySoundPatch"), (i = n.querySelector("[data-action='change-sound-src']")) == null || i.addEventListener("change", async (g) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = e.getEntryAtPath(e.selectedPath);
    if (!(y != null && y.sound)) return;
    const v = g.target.value, b = { ...y.sound, src: v };
    b.id || (b.id = yu(v));
    const w = await bu(v);
    w > 0 && (b.duration = w), t(p, y, b);
  }), (r = n.querySelector("[data-action='pick-sound-src']")) == null || r.addEventListener("click", () => {
    const g = e.parseEntryPath(e.selectedPath);
    if (!g) return;
    const p = e.getEntryAtPath(e.selectedPath);
    if (!(p != null && p.sound)) return;
    new FilePicker({
      type: "audio",
      current: p.sound.src || "",
      callback: /* @__PURE__ */ c(async (v) => {
        const b = { ...p.sound, src: v };
        b.id || (b.id = yu(v));
        const w = await bu(v);
        w > 0 && (b.duration = w), t(g, p, b);
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
c(ob, "bindSoundFieldEvents");
function sb(n, e) {
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
    Qy({ selectedPath: e.selectedPath, state: e.state, mutate: e.mutate });
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
c(sb, "bindSpecialEntryEvents");
function lb(n, e) {
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
c(lb, "bindSegmentGraphEvents");
function cb(n, e) {
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
    const { enterPickMode: d } = await Promise.resolve().then(() => rb);
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
    (a = n.querySelector(`[data-action='${u}']`)) == null || a.addEventListener("change", (m) => {
      var b;
      const f = (b = e.state.activeSegment) == null ? void 0 : b.gate;
      if (!f) return;
      const g = m.target.value.trim(), p = g ? g.split(",").map((w) => w.trim()).filter(Boolean) : void 0, y = { ...f.animation ?? {} };
      p != null && p.length ? y[d] = p.length === 1 ? p[0] : p : delete y[d];
      const v = { ...f, animation: Object.keys(y).length ? y : void 0 };
      v.animation || delete v.animation, e.setSegmentGate(v);
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
c(cb, "bindSegmentDetailEvents");
var Bu, ze, G, tt, _n, Ot, nt, Ge, Bo, Fe, it, Uo, un, Ki, ht, hi, Nn, gi, q, Bf, Uf, Vf, zf, wn, Wl, Yl, Kl, Jl, Gf, En, Xl, Wf, Yf, Kf, Jf, Xf, Ql, yr;
const Ct = class Ct extends Gn(zn) {
  constructor(t = {}) {
    super(t);
    k(this, q);
    k(this, ze, null);
    k(this, G, null);
    k(this, tt, null);
    k(this, _n, /* @__PURE__ */ new Set());
    k(this, Ot, !1);
    k(this, nt, null);
    k(this, Ge, null);
    k(this, Bo, 120);
    k(this, Fe, []);
    k(this, it, -1);
    k(this, Uo, 50);
    k(this, un, null);
    k(this, Ki, null);
    k(this, ht, null);
    k(this, hi, null);
    k(this, Nn, null);
    k(this, gi, null);
    L(this, ze, t.scene ?? canvas.scene ?? null), L(this, G, Wt.fromScene(h(this, ze)));
  }
  // ── Context ───────────────────────────────────────────────────────────
  async _prepareContext() {
    var g, p;
    const t = Hy(h(this, G), h(this, G).activeSegmentName), i = Py(h(this, G).timeline, {
      selectedPath: h(this, tt),
      windowWidth: ((g = this.position) == null ? void 0 : g.width) ?? 1100
    }), r = h(this, tt) != null ? Jy(h(this, tt), { state: h(this, G), expandedTweens: h(this, _n) }) : null, a = h(this, G).listCinematicNames(), o = h(this, G).activeCinematicName, l = h(this, G).listSegmentNames().length > 1, u = h(this, G).activeSegment, d = (u == null ? void 0 : u.gate) ?? null, m = (u == null ? void 0 : u.next) ?? null, f = typeof m == "string" ? m : (m == null ? void 0 : m.segment) ?? null;
    return {
      // Toolbar
      sceneName: ((p = h(this, ze)) == null ? void 0 : p.name) ?? "No scene",
      dirty: h(this, Ot),
      canUndo: h(this, q, Wl),
      canRedo: h(this, q, Yl),
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
      activeSegmentName: h(this, G).activeSegmentName,
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
      trigger: h(this, G).trigger,
      tracking: h(this, G).tracking,
      synchronized: h(this, G).synchronized,
      triggerOptions: ky.map((y) => ({
        ...y,
        selected: y.value === h(this, G).trigger
      })),
      entryCount: h(this, G).timeline.length,
      totalDuration: i.totalDurationMs,
      targetCount: qy(h(this, G)),
      setupCount: Object.keys(h(this, G).setup ?? {}).length,
      landingCount: Object.keys(h(this, G).landing ?? {}).length
    };
  }
  // ── Render & Events ───────────────────────────────────────────────────
  _onRender(t, i) {
    var r, a, o;
    if (super._onRender(t, i), S(this, q, Bf).call(this), !h(this, hi)) {
      const s = (a = (r = game.modules.get(T)) == null ? void 0 : r.api) == null ? void 0 : a.cinematic;
      s != null && s.onPlaybackProgress ? (L(this, hi, s.onPlaybackProgress((l) => S(this, q, Xf).call(this, l))), console.log("[cinematic-editor] Subscribed to playback progress events")) : console.warn("[cinematic-editor] onPlaybackProgress not available on API", s);
    }
    if (h(this, gi) && ((o = this.element) == null || o.querySelectorAll(".cinematic-editor__segment-node").forEach((s) => {
      s.classList.toggle("cinematic-editor__segment-node--playing", s.dataset.segmentName === h(this, gi));
    }), h(this, ht) && h(this, ht).segmentName === h(this, G).activeSegmentName)) {
      const s = performance.now() - h(this, ht).startTime;
      h(this, ht).durationMs - s > 0 && S(this, q, Ql).call(this, h(this, ht).durationMs, h(this, ht).startTime);
    }
    h(this, un) || (L(this, un, (s) => {
      !s.ctrlKey && !s.metaKey || (s.key === "z" && !s.shiftKey ? (s.preventDefault(), S(this, q, Kl).call(this)) : (s.key === "z" && s.shiftKey || s.key === "y") && (s.preventDefault(), S(this, q, Jl).call(this)));
    }), document.addEventListener("keydown", h(this, un)));
  }
  async close(t = {}) {
    if (h(this, Ge) && S(this, q, En).call(this), h(this, Ot) && !t.force) {
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
      i === "save" && await S(this, q, Xl).call(this);
    }
    return super.close(t);
  }
  async _onClose(t) {
    var i;
    return h(this, nt) !== null && (clearTimeout(h(this, nt)), L(this, nt, null)), h(this, un) && (document.removeEventListener("keydown", h(this, un)), L(this, un, null)), (i = h(this, hi)) == null || i.call(this), L(this, hi, null), S(this, q, yr).call(this), super._onClose(t);
  }
};
ze = new WeakMap(), G = new WeakMap(), tt = new WeakMap(), _n = new WeakMap(), Ot = new WeakMap(), nt = new WeakMap(), Ge = new WeakMap(), Bo = new WeakMap(), Fe = new WeakMap(), it = new WeakMap(), Uo = new WeakMap(), un = new WeakMap(), Ki = new WeakMap(), ht = new WeakMap(), hi = new WeakMap(), Nn = new WeakMap(), gi = new WeakMap(), q = new WeakSet(), // ── Event binding ─────────────────────────────────────────────────────
Bf = /* @__PURE__ */ c(function() {
  const t = this.element;
  if (!(t instanceof HTMLElement)) return;
  const i = S(this, q, Uf).call(this);
  Zy(t, i), eb(t, i), lb(t, i), tb(t, i), nb(t, i), ab(t, i), ob(t, i), sb(t, i), cb(t, i);
}, "#bindEvents"), Uf = /* @__PURE__ */ c(function() {
  const t = this;
  return {
    // State access (read-only getters — closures over `self` for private field access)
    get state() {
      return h(t, G);
    },
    get selectedPath() {
      return h(t, tt);
    },
    get scene() {
      return h(t, ze);
    },
    get expandedTweens() {
      return h(t, _n);
    },
    get insertMenuState() {
      return h(t, Ki);
    },
    // Mutations
    mutate: /* @__PURE__ */ c((i) => S(this, q, wn).call(this, i), "mutate"),
    setSelectedPath: /* @__PURE__ */ c((i) => {
      L(this, tt, i), this.render({ force: !0 });
    }, "setSelectedPath"),
    render: /* @__PURE__ */ c(() => this.render({ force: !0 }), "render"),
    // Cinematic switching (needs full state swap + clear)
    switchCinematic: /* @__PURE__ */ c((i) => {
      h(this, Ge) && S(this, q, En).call(this), L(this, G, h(this, G).switchCinematic(i)), L(this, tt, null), h(this, _n).clear(), this.render({ force: !0 });
    }, "switchCinematic"),
    // Segment management
    selectSegment: /* @__PURE__ */ c((i) => {
      h(this, Ge) && S(this, q, En).call(this), L(this, G, h(this, G).switchSegment(i)), L(this, tt, null), h(this, _n).clear(), this.render({ force: !0 });
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
    queueTweenChange: /* @__PURE__ */ c((i, r) => S(this, q, Gf).call(this, i, r), "queueTweenChange"),
    flushTweenChanges: /* @__PURE__ */ c(() => {
      h(this, Ge) && S(this, q, En).call(this);
    }, "flushTweenChanges"),
    flushTweenChangesImmediate: /* @__PURE__ */ c(() => {
      h(this, nt) !== null && clearTimeout(h(this, nt)), L(this, nt, null), S(this, q, En).call(this);
    }, "flushTweenChangesImmediate"),
    // Path utilities
    parseEntryPath: Bn,
    getEntryAtPath: /* @__PURE__ */ c((i) => io(i, h(this, G)), "getEntryAtPath"),
    // Insert menu
    showInsertMenu: /* @__PURE__ */ c((i, r, a) => S(this, q, Vf).call(this, i, r, a), "showInsertMenu"),
    hideInsertMenu: /* @__PURE__ */ c(() => S(this, q, zf).call(this), "hideInsertMenu"),
    // Toolbar actions
    save: /* @__PURE__ */ c(() => S(this, q, Xl).call(this), "save"),
    play: /* @__PURE__ */ c(() => S(this, q, Wf).call(this), "play"),
    resetTracking: /* @__PURE__ */ c(() => S(this, q, Yf).call(this), "resetTracking"),
    exportJSON: /* @__PURE__ */ c(() => S(this, q, Kf).call(this), "exportJSON"),
    validate: /* @__PURE__ */ c(() => S(this, q, Jf).call(this), "validate"),
    importJSON: /* @__PURE__ */ c(() => Xy({ state: h(this, G), mutate: /* @__PURE__ */ c((i) => S(this, q, wn).call(this, i), "mutate") }), "importJSON"),
    undo: /* @__PURE__ */ c(() => S(this, q, Kl).call(this), "undo"),
    redo: /* @__PURE__ */ c(() => S(this, q, Jl).call(this), "redo")
  };
}, "#createEventContext"), // ── Insert menu ───────────────────────────────────────────────────────
Vf = /* @__PURE__ */ c(function(t, i, r) {
  var l;
  const a = (l = this.element) == null ? void 0 : l.querySelector(".cinematic-editor__insert-menu");
  if (!a) return;
  const o = t.getBoundingClientRect();
  document.body.appendChild(a), a.style.display = "", a.style.position = "fixed", a.style.left = `${o.left}px`;
  const s = a.offsetHeight || 200;
  o.bottom + 4 + s > window.innerHeight ? a.style.top = `${o.top - s - 4}px` : a.style.top = `${o.bottom + 4}px`, L(this, Ki, { insertIndex: i, lane: r });
}, "#showInsertMenu"), zf = /* @__PURE__ */ c(function() {
  var i, r;
  const t = document.body.querySelector(".cinematic-editor__insert-menu") ?? ((i = this.element) == null ? void 0 : i.querySelector(".cinematic-editor__insert-menu"));
  if (t) {
    t.style.display = "none";
    const a = (r = this.element) == null ? void 0 : r.querySelector(".cinematic-editor");
    a && t.parentNode !== a && a.appendChild(t);
  }
  L(this, Ki, null);
}, "#hideInsertMenu"), // ── State mutation ────────────────────────────────────────────────────
wn = /* @__PURE__ */ c(function(t) {
  L(this, Fe, h(this, Fe).slice(0, h(this, it) + 1)), h(this, Fe).push(h(this, G)), h(this, Fe).length > h(this, Uo) && h(this, Fe).shift(), L(this, it, h(this, Fe).length - 1), L(this, G, t(h(this, G))), L(this, Ot, !0), this.render({ force: !0 });
}, "#mutate"), Wl = /* @__PURE__ */ c(function() {
  return h(this, it) >= 0;
}, "#canUndo"), Yl = /* @__PURE__ */ c(function() {
  return h(this, it) < h(this, Fe).length - 1;
}, "#canRedo"), Kl = /* @__PURE__ */ c(function() {
  h(this, q, Wl) && (h(this, it) === h(this, Fe).length - 1 && h(this, Fe).push(h(this, G)), L(this, G, h(this, Fe)[h(this, it)]), us(this, it)._--, L(this, Ot, !0), this.render({ force: !0 }));
}, "#undo"), Jl = /* @__PURE__ */ c(function() {
  h(this, q, Yl) && (us(this, it)._++, L(this, G, h(this, Fe)[h(this, it) + 1]), L(this, Ot, !0), this.render({ force: !0 }));
}, "#redo"), Gf = /* @__PURE__ */ c(function(t, i) {
  var r;
  h(this, tt) != null && (L(this, Ge, {
    ...h(this, Ge) ?? {},
    entryPath: h(this, tt),
    tweenIndex: t,
    patch: { ...((r = h(this, Ge)) == null ? void 0 : r.patch) ?? {}, ...i }
  }), h(this, nt) !== null && clearTimeout(h(this, nt)), L(this, nt, setTimeout(() => {
    L(this, nt, null), S(this, q, En).call(this);
  }, h(this, Bo))));
}, "#queueTweenChange"), En = /* @__PURE__ */ c(function() {
  if (!h(this, Ge)) return;
  const { entryPath: t, tweenIndex: i, patch: r } = h(this, Ge);
  L(this, Ge, null);
  const a = Bn(t);
  if (a) {
    if (a.type === "timeline")
      L(this, G, h(this, G).updateTween(a.index, i, r));
    else if (a.type === "branch") {
      const o = io(t, h(this, G));
      if (o) {
        const s = (o.tweens ?? []).map((l, u) => u === i ? { ...l, ...r } : l);
        L(this, G, h(this, G).updateBranchEntry(a.index, a.branchIndex, a.branchEntryIndex, { tweens: s }));
      }
    }
    L(this, Ot, !0);
  }
}, "#flushTweenChanges"), Xl = /* @__PURE__ */ c(async function() {
  var t, i, r, a, o, s;
  if (h(this, ze)) {
    if (h(this, Ge) && S(this, q, En).call(this), h(this, G).isStale(h(this, ze))) {
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
        L(this, G, Wt.fromScene(h(this, ze), h(this, G).activeCinematicName)), L(this, Ot, !1), L(this, Fe, []), L(this, it, -1), this.render({ force: !0 }), (i = (t = ui.notifications) == null ? void 0 : t.info) == null || i.call(t, "Cinematic reloaded from scene.");
        return;
      }
      if (!l) return;
    }
    try {
      await h(this, G).save(h(this, ze)), L(this, G, Wt.fromScene(h(this, ze), h(this, G).activeCinematicName)), L(this, Ot, !1), (a = (r = ui.notifications) == null ? void 0 : r.info) == null || a.call(r, "Cinematic saved."), this.render({ force: !0 });
    } catch (l) {
      console.error(`${T} | Cinematic save failed`, l), (s = (o = ui.notifications) == null ? void 0 : o.error) == null || s.call(o, "Failed to save cinematic data.");
    }
  }
}, "#onSave"), Wf = /* @__PURE__ */ c(async function() {
  var i, r, a, o, s;
  const t = (r = (i = game.modules.get(T)) == null ? void 0 : i.api) == null ? void 0 : r.cinematic;
  if (!(t != null && t.play)) {
    (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, "Cinematic API not available.");
    return;
  }
  await t.play((s = h(this, ze)) == null ? void 0 : s.id, h(this, G).activeCinematicName);
}, "#onPlay"), Yf = /* @__PURE__ */ c(async function() {
  var i, r, a, o, s;
  const t = (r = (i = game.modules.get(T)) == null ? void 0 : i.api) == null ? void 0 : r.cinematic;
  t != null && t.reset && (await t.reset((a = h(this, ze)) == null ? void 0 : a.id, h(this, G).activeCinematicName), (s = (o = ui.notifications) == null ? void 0 : o.info) == null || s.call(o, "Cinematic tracking reset."));
}, "#onResetTracking"), Kf = /* @__PURE__ */ c(async function() {
  var i, r;
  const t = JSON.stringify(h(this, G).toJSON(), null, 2);
  try {
    await navigator.clipboard.writeText(t), (r = (i = ui.notifications) == null ? void 0 : i.info) == null || r.call(i, "Cinematic JSON copied to clipboard.");
  } catch {
    new Dialog({
      title: "Cinematic JSON",
      content: `<textarea style="width:100%;height:300px;font-family:monospace;font-size:0.8rem">${xt(t)}</textarea>`,
      buttons: { ok: { label: "Close" } }
    }).render(!0);
  }
}, "#onExportJSON"), Jf = /* @__PURE__ */ c(function() {
  var l, u;
  const t = h(this, G).toJSON(), { targets: i, unresolved: r } = no(t), a = Ay(t, i), o = [
    ...r.map((d) => ({ path: "targets", level: "warn", message: `Unresolved target: "${d}"` })),
    ...a
  ];
  if (o.length === 0) {
    (u = (l = ui.notifications) == null ? void 0 : l.info) == null || u.call(l, "Cinematic validation passed — no issues found.");
    return;
  }
  const s = o.map((d) => {
    const m = d.level === "error" ? "fa-circle-xmark" : "fa-triangle-exclamation", f = d.level === "error" ? "#e74c3c" : "#f39c12";
    return `<li style="margin:0.3rem 0"><i class="fa-solid ${m}" style="color:${f};margin-right:0.3rem"></i><strong>${xt(d.path)}</strong>: ${xt(d.message)}</li>`;
  });
  new Dialog({
    title: "Cinematic Validation",
    content: `<p>${o.length} issue(s) found:</p><ul style="list-style:none;padding:0;max-height:300px;overflow:auto">${s.join("")}</ul>`,
    buttons: { ok: { label: "Close" } }
  }).render(!0);
}, "#onValidate"), // ── Playback progress ────────────────────────────────────────────────
Xf = /* @__PURE__ */ c(function(t) {
  var i, r, a, o, s, l;
  switch (console.log(`[cinematic-editor] playback event: ${t.type}`, t), t.type) {
    case "segment-start":
      L(this, gi, t.segmentName), t.segmentName !== h(this, G).activeSegmentName ? (L(this, G, h(this, G).switchSegment(t.segmentName)), L(this, tt, null), h(this, _n).clear(), this.render({ force: !0 })) : (i = this.element) == null || i.querySelectorAll(".cinematic-editor__segment-node").forEach((u) => {
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
      L(this, ht, { segmentName: t.segmentName, startTime: performance.now(), durationMs: t.durationMs }), t.segmentName === h(this, G).activeSegmentName && S(this, q, Ql).call(this, t.durationMs);
      break;
    case "timeline-end":
      S(this, q, yr).call(this), L(this, ht, null);
      break;
    case "playback-end":
      S(this, q, yr).call(this), L(this, ht, null), L(this, gi, null), (l = this.element) == null || l.querySelectorAll(".cinematic-editor__segment-node--playing, .cinematic-editor__segment-node--gate-waiting").forEach((u) => {
        u.classList.remove("cinematic-editor__segment-node--playing", "cinematic-editor__segment-node--gate-waiting");
      });
      break;
  }
}, "#onPlaybackEvent"), Ql = /* @__PURE__ */ c(function(t, i = null) {
  var u, d;
  S(this, q, yr).call(this);
  const r = (u = this.element) == null ? void 0 : u.querySelector(".cinematic-editor__playback-cursor"), a = (d = this.element) == null ? void 0 : d.querySelector(".cinematic-editor__swimlane");
  if (console.log(`[cinematic-editor] startCursor: duration=${t}, cursor=${!!r}, swimlane=${!!a}, width=${a == null ? void 0 : a.scrollWidth}`), !r || !a || t <= 0) return;
  r.style.display = "block";
  const o = i ?? performance.now(), s = a.scrollWidth, l = /* @__PURE__ */ c(() => {
    const m = performance.now() - o, f = Math.min(m / t, 1), g = Mr + f * (s - Mr);
    r.style.left = `${g}px`, f < 1 && L(this, Nn, requestAnimationFrame(l));
  }, "tick");
  L(this, Nn, requestAnimationFrame(l));
}, "#startCursorAnimation"), yr = /* @__PURE__ */ c(function() {
  var i;
  h(this, Nn) && (cancelAnimationFrame(h(this, Nn)), L(this, Nn, null));
  const t = (i = this.element) == null ? void 0 : i.querySelector(".cinematic-editor__playback-cursor");
  t && (t.style.display = "none");
}, "#stopCursorAnimation"), c(Ct, "CinematicEditorApplication"), ye(Ct, "APP_ID", `${T}-cinematic-editor`), ye(Ct, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Re(Ct, Ct, "DEFAULT_OPTIONS"),
  {
    id: Ct.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Bu = Re(Ct, Ct, "DEFAULT_OPTIONS")) == null ? void 0 : Bu.classes) ?? [], "eidolon-cinematic-editor-window", "themed"])
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
let Gl = Ct;
const Qf = /* @__PURE__ */ new Map();
function me(n, e) {
  Qf.set(n, e);
}
c(me, "registerBehaviour");
function $a(n) {
  return Qf.get(n);
}
c($a, "getBehaviour");
function ub(n, e, t) {
  let i, r, a;
  if (e === 0)
    i = r = a = t;
  else {
    const o = /* @__PURE__ */ c((u, d, m) => (m < 0 && (m += 1), m > 1 && (m -= 1), m < 0.16666666666666666 ? u + (d - u) * 6 * m : m < 0.5 ? d : m < 0.6666666666666666 ? u + (d - u) * (0.6666666666666666 - m) * 6 : u), "hue2rgb"), s = t < 0.5 ? t * (1 + e) : t + e - t * e, l = 2 * t - s;
    i = o(l, s, n + 1 / 3), r = o(l, s, n), a = o(l, s, n - 1 / 3);
  }
  return Math.round(i * 255) << 16 | Math.round(r * 255) << 8 | Math.round(a * 255);
}
c(ub, "hslToInt");
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
  var y, v;
  const t = n.mesh;
  if (!((y = t == null ? void 0 : t.texture) != null && y.baseTexture)) return { update() {
  }, detach() {
  } };
  const i = n.document, r = e.color ?? 4513279, a = e.alpha ?? 0.5, o = e.blur ?? 8, s = e.pulseSpeed ?? 0.03, l = Math.abs(i.width), u = Math.abs(i.height), d = PIXI.Sprite.from(t.texture);
  d.anchor.set(0.5, 0.5), d.scale.set(t.scale.x, t.scale.y), d.position.set(l / 2, u / 2), d.angle = i.rotation ?? 0, d.alpha = a, d.tint = r;
  const m = PIXI.BlurFilter ?? ((v = PIXI.filters) == null ? void 0 : v.BlurFilter), f = new m(o);
  d.filters = [f], n.addChildAt(d, 0);
  const g = t.angle;
  let p = 0;
  return {
    update(b) {
      p += b;
      const w = (Math.sin(p * s) + 1) / 2;
      d.visible = t.visible !== !1, d.alpha = a * (0.5 + 0.5 * w) * (t.alpha ?? 1), d.scale.set(t.scale.x, t.scale.y), d.angle = (i.rotation ?? 0) + (t.angle - g);
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
      s = (s + l * i) % 1, t.tint = ub(s, r, a);
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
  let v = 0;
  function b(w) {
    return w = (w % o + o) % o, w < r ? { x: w, y: 0 } : (w -= r, w < a ? { x: r, y: w } : (w -= a, w < r ? { x: r - w, y: a } : (w -= r, { x: 0, y: a - w })));
  }
  return c(b, "perimeterPoint"), {
    update(w) {
      v = (v + w * s) % o, f.visible = t.visible !== !1, f.alpha = d * (t.alpha ?? 1), f.scale.set(t.scale.x / g, t.scale.y / p), f.angle = t.angle - y, f.clear(), f.lineStyle(m, u, 1);
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
  const y = t.scale.x, v = t.scale.y, b = t.angle;
  let w = 0;
  return {
    update(C) {
      if (w = (w + C * o) % m, f.visible = t.visible !== !1, f.scale.set(t.scale.x / y, t.scale.y / v), f.angle = t.angle - b, g.alpha = l * (t.alpha ?? 1), g.clear(), w < d) {
        const I = w - s;
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
  const g = t.scale.x, p = t.scale.y, y = t.angle, v = [];
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
      m.visible = t.visible !== !1, m.scale.set(t.scale.x / g, t.scale.y / p), m.angle = t.angle - y, v.length < o && v.push(b());
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
        f.beginFill(l, u * I * (t.alpha ?? 1)), f.drawCircle(C.x, C.y, C.size), f.endFill();
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
  const p = t.scale.x, y = t.scale.y, v = t.angle, b = [];
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
      C += I, g.visible = t.visible !== !1, g.alpha = f * (t.alpha ?? 1), g.scale.set(t.scale.x / p, t.scale.y / y), g.angle = t.angle - v, g.clear();
      for (const A of b) {
        const O = w(A.phase + C * l * A.speedMul);
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
  const y = t.scale.x, v = t.scale.y, b = t.angle, w = [];
  let C = 0, I = 0;
  return {
    update(A) {
      C += A, g.visible = t.visible !== !1, g.scale.set(t.scale.x / y, t.scale.y / v), g.angle = t.angle - b, C >= I && w.length < s && (w.push({ radius: 0, alpha: m }), I = C + l);
      for (let $ = w.length - 1; $ >= 0; $--) {
        const j = w[$];
        j.radius += u * A, j.alpha = m * (1 - j.radius / o), j.radius >= o && w.splice($, 1);
      }
      p.clear();
      const O = r / 2, M = a / 2;
      for (const $ of w)
        p.lineStyle(f, d, $.alpha * (t.alpha ?? 1)), p.drawCircle(O, M, $.radius);
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
  const p = t.scale.x, y = t.scale.y, v = t.angle, b = [];
  for (let I = 0; I < o; I++) {
    const A = Math.floor(Math.random() * 4);
    let O, M, $;
    switch (A) {
      case 0:
        O = Math.random() * r, M = 0, $ = Math.PI / 2 + (Math.random() - 0.5) * 0.6;
        break;
      case 1:
        O = r, M = Math.random() * a, $ = Math.PI + (Math.random() - 0.5) * 0.6;
        break;
      case 2:
        O = Math.random() * r, M = a, $ = -Math.PI / 2 + (Math.random() - 0.5) * 0.6;
        break;
      default:
        O = 0, M = Math.random() * a, $ = (Math.random() - 0.5) * 0.6;
        break;
    }
    b.push({ sx: O, sy: M, angle: $, targetLength: s * (0.4 + Math.random() * 0.6), currentLength: 0, grown: !1 });
  }
  let w = !1, C = 0;
  return {
    update(I) {
      if (m.visible = t.visible !== !1, m.scale.set(t.scale.x / p, t.scale.y / y), m.angle = t.angle - v, w)
        C += I * 0.03;
      else {
        w = !0;
        for (const O of b)
          O.grown || (O.currentLength += (O.targetLength - O.currentLength) * d * I, O.currentLength >= O.targetLength * 0.99 ? (O.currentLength = O.targetLength, O.grown = !0) : w = !1);
      }
      const A = w ? u * (0.7 + 0.3 * Math.sin(C)) : u;
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
    update(v) {
      if (f < l) {
        f += v;
        const b = Math.min(f / l, 1), w = u(b);
        d.distance = r * w, d.alpha = o * w;
      }
    },
    detach() {
      t.filters && (t.filters = t.filters.filter((v) => v !== d), t.filters.length === 0 && (t.filters = null)), d.destroy();
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
      const y = o / 16.667, v = Math.abs(g / y % 2 - 1), b = s(v), w = l(d, m, b);
      t.tint = u.from(w).valueOf();
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
const cr = {
  always: [],
  idle: ["float", "glow"],
  hover: ["scale"],
  dim: ["none"]
};
function db(n) {
  if (!n) return { ...cr };
  const e = /* @__PURE__ */ c((t, i) => t === void 0 ? i : typeof t == "string" ? [t] : typeof t == "object" && !Array.isArray(t) && t.name ? [t] : Array.isArray(t) ? t : i, "normalize");
  return {
    always: e(n.always, cr.always),
    idle: e(n.idle, cr.idle),
    hover: e(n.hover, cr.hover),
    dim: e(n.dim, cr.dim)
  };
}
c(db, "normalizeConfig");
var be, At, Bt, kt, xn, $n, Ut, Mt, dn, we, Zf, Fa, em, tm, nm, im, rm, am;
const Lr = class Lr {
  /**
   * @param {PlaceableObject} placeable
   * @param {object|undefined} animationConfig  Raw animation config from the await entry
   */
  constructor(e, t) {
    k(this, we);
    k(this, be);
    k(this, At);
    k(this, Bt, null);
    k(this, kt, []);
    k(this, xn, []);
    k(this, $n, null);
    k(this, Ut, null);
    k(this, Mt, null);
    k(this, dn, 0);
    L(this, be, e), L(this, At, db(t));
  }
  /** Current animation state name. */
  get state() {
    return h(this, Bt);
  }
  /**
   * Start animating in the given state.
   * @param {string} [state="idle"]
   */
  start(e = "idle") {
    var r;
    S(this, we, Zf).call(this);
    const t = ((r = h(this, be).document) == null ? void 0 : r.id) ?? "?", i = h(this, Ut);
    i && console.log(`%c[TileAnimator ${t}] start("${e}") canonical: pos=(${i.x.toFixed(2)}, ${i.y.toFixed(2)}) scale=(${i.scaleX.toFixed(4)}, ${i.scaleY.toFixed(4)}) alpha=${i.alpha.toFixed(4)} angle=${i.angle.toFixed(2)}`, "color: #FFAA44; font-weight: bold"), S(this, we, rm).call(this), S(this, we, nm).call(this, e), L(this, $n, (a) => {
      if (h(this, be).destroyed || !h(this, be).transform) {
        this.detach();
        return;
      }
      h(this, Mt) && S(this, we, Fa).call(this);
      for (const o of h(this, xn)) o.update(a);
      for (const o of h(this, kt)) o.update(a);
      S(this, we, tm).call(this, a);
    }), canvas.app.ticker.add(h(this, $n));
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
    if (e === h(this, Bt)) return;
    const t = ((m = h(this, be).document) == null ? void 0 : m.id) ?? "?", i = h(this, be).mesh, r = h(this, At)[h(this, Bt)] ?? h(this, At).idle ?? ["none"], a = h(this, At)[e] ?? h(this, At).idle ?? ["none"], o = r.map((f) => typeof f == "string" ? f : f == null ? void 0 : f.name), s = a.map((f) => typeof f == "string" ? f : f == null ? void 0 : f.name);
    if (console.log(`%c[TileAnimator ${t}] setState: ${h(this, Bt)} → ${e}`, "color: #44DDFF; font-weight: bold"), console.log(`  old behaviours: [${o.join(", ")}]  →  new: [${s.join(", ")}]`), i && console.log(`  mesh BEFORE detach: pos=(${i.position.x.toFixed(2)}, ${i.position.y.toFixed(2)}) scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)} angle=${i.angle.toFixed(2)}`), h(this, Ut)) {
      const f = h(this, Ut);
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
    console.log(`  reused: [${[...d].join(", ")}]  detaching: [${[...l.keys()].filter((f) => !d.has(f)).join(", ")}]`), S(this, we, em).call(this);
    for (const [f, g] of l)
      d.has(f) || (g.detach(), i && console.log(`  mesh AFTER detach("${f}"): scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)}`));
    S(this, we, Fa).call(this), i && console.log(`  mesh AFTER canonical restore: scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)}`);
    for (const f of a) {
      const g = typeof f == "string" ? f : f.name;
      if (l.has(g) && d.has(g))
        u.push(l.get(g)), d.delete(g), console.log(`  → reuse "${g}"`);
      else {
        const p = typeof f == "string" ? void 0 : f, y = $a(g);
        if (!y) {
          console.warn(`TileAnimator: unknown behaviour "${g}"`);
          continue;
        }
        u.push(y(h(this, be), p, h(this, Ut))), i && console.log(`  → create "${g}" — mesh after factory: scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)} pos=(${i.position.x.toFixed(2)}, ${i.position.y.toFixed(2)})`);
      }
    }
    if (h(this, Mt)) {
      const f = h(this, Mt);
      console.log(`  blend FROM: pos=(${f.x.toFixed(2)}, ${f.y.toFixed(2)}) scale=(${f.scaleX.toFixed(4)}, ${f.scaleY.toFixed(4)}) alpha=${f.alpha.toFixed(4)}`);
    }
    L(this, Bt, e), L(this, kt, u);
  }
  /**
   * Full cleanup — detach all behaviours, restore canonical, and remove ticker.
   */
  detach() {
    var t, i;
    h(this, be).destroyed || !h(this, be).transform ? (L(this, kt, []), L(this, xn, [])) : (S(this, we, im).call(this), S(this, we, am).call(this), S(this, we, Fa).call(this)), L(this, Mt, null), L(this, Bt, null), h(this, $n) && ((i = (t = canvas.app) == null ? void 0 : t.ticker) == null || i.remove(h(this, $n)), L(this, $n, null));
  }
};
be = new WeakMap(), At = new WeakMap(), Bt = new WeakMap(), kt = new WeakMap(), xn = new WeakMap(), $n = new WeakMap(), Ut = new WeakMap(), Mt = new WeakMap(), dn = new WeakMap(), we = new WeakSet(), // ── Private ──────────────────────────────────────────────────────────
Zf = /* @__PURE__ */ c(function() {
  const e = h(this, be).mesh;
  e && L(this, Ut, {
    x: e.position.x,
    y: e.position.y,
    scaleX: e.scale.x,
    scaleY: e.scale.y,
    angle: e.angle,
    alpha: e.alpha,
    tint: e.tint
  });
}, "#captureCanonical"), Fa = /* @__PURE__ */ c(function() {
  const e = h(this, be).mesh;
  if (!e || !h(this, Ut)) return;
  const t = h(this, Ut);
  e.position.x = t.x, e.position.y = t.y, e.scale.x = t.scaleX, e.scale.y = t.scaleY, e.angle = t.angle, e.alpha = t.alpha, e.tint = t.tint;
}, "#restoreCanonical"), /**
 * Snapshot the current (animated) mesh values so the transition blend
 * can lerp FROM here toward the new state's computed values.
 */
em = /* @__PURE__ */ c(function() {
  const e = h(this, be).mesh;
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
tm = /* @__PURE__ */ c(function(e) {
  var o, s;
  if (!h(this, Mt)) return;
  L(this, dn, h(this, dn) + e);
  const t = Math.min(h(this, dn) / Lr.BLEND_FRAMES, 1);
  if (t >= 1) {
    const l = ((o = h(this, be).document) == null ? void 0 : o.id) ?? "?";
    console.log(`%c[TileAnimator ${l}] blend complete`, "color: #88FF88"), L(this, Mt, null);
    return;
  }
  const i = 1 - (1 - t) ** 3, r = h(this, be).mesh;
  if (!r) return;
  const a = h(this, Mt);
  if (h(this, dn) <= e * 3) {
    const l = ((s = h(this, be).document) == null ? void 0 : s.id) ?? "?", u = Math.round(h(this, dn) / e);
    console.log(`  [blend ${l} f${u}] t=${t.toFixed(3)} eased=${i.toFixed(3)} | behaviour→scale=(${r.scale.x.toFixed(4)},${r.scale.y.toFixed(4)}) alpha=${r.alpha.toFixed(4)} | blendFrom→scale=(${a.scaleX.toFixed(4)},${a.scaleY.toFixed(4)}) alpha=${a.alpha.toFixed(4)}`);
  }
  r.position.x = a.x + (r.position.x - a.x) * i, r.position.y = a.y + (r.position.y - a.y) * i, r.scale.x = a.scaleX + (r.scale.x - a.scaleX) * i, r.scale.y = a.scaleY + (r.scale.y - a.scaleY) * i, r.angle = a.angle + (r.angle - a.angle) * i, r.alpha = a.alpha + (r.alpha - a.alpha) * i, h(this, dn) <= e * 3 && console.log(`  [blend result] scale=(${r.scale.x.toFixed(4)},${r.scale.y.toFixed(4)}) alpha=${r.alpha.toFixed(4)} pos=(${r.position.x.toFixed(2)},${r.position.y.toFixed(2)})`);
}, "#applyBlend"), nm = /* @__PURE__ */ c(function(e) {
  L(this, Bt, e);
  const t = h(this, At)[e] ?? h(this, At).idle ?? ["none"];
  for (const i of t) {
    const r = typeof i == "string" ? i : i.name, a = typeof i == "string" ? void 0 : i, o = $a(r);
    if (!o) {
      console.warn(`TileAnimator: unknown behaviour "${r}"`);
      continue;
    }
    h(this, kt).push(o(h(this, be), a));
  }
}, "#attachBehaviours"), im = /* @__PURE__ */ c(function() {
  for (const e of h(this, kt)) e.detach();
  L(this, kt, []);
}, "#detachBehaviours"), rm = /* @__PURE__ */ c(function() {
  const e = h(this, At).always ?? [];
  for (const t of e) {
    const i = typeof t == "string" ? t : t.name, r = typeof t == "string" ? void 0 : t, a = $a(i);
    if (!a) {
      console.warn(`TileAnimator: unknown always behaviour "${i}"`);
      continue;
    }
    h(this, xn).push(a(h(this, be), r));
  }
}, "#attachAlwaysBehaviours"), am = /* @__PURE__ */ c(function() {
  for (const e of h(this, xn)) e.detach();
  L(this, xn, []);
}, "#detachAlwaysBehaviours"), c(Lr, "TileAnimator"), /** Frames over which state transitions are blended (easeOutCubic). */
ye(Lr, "BLEND_FRAMES", 8);
let Ti = Lr;
const fb = "cinematic", As = 5, Zl = /* @__PURE__ */ new Set();
function tn(n) {
  for (const e of Zl)
    try {
      e(n);
    } catch (t) {
      console.error("[cinematic] playback listener error:", t);
    }
}
c(tn, "emitPlaybackEvent");
function mb(n) {
  return Zl.add(n), () => Zl.delete(n);
}
c(mb, "onPlaybackProgress");
let Ce = null, sn = null, Er = null, Sr = null, ki = 0, ti = null;
function Tc(n, e = "default") {
  return `cinematic-progress-${n}-${e}`;
}
c(Tc, "progressFlagKey");
function hb(n, e, t, i) {
  game.user.setFlag(T, Tc(n, e), {
    currentSegment: t,
    completedSegments: [...i],
    timestamp: Date.now()
  }).catch(() => {
  });
}
c(hb, "saveSegmentProgress");
function ec(n, e = "default") {
  game.user.unsetFlag(T, Tc(n, e)).catch(() => {
  });
}
c(ec, "clearProgress");
function om(n, e = "default", t = 3e5) {
  const i = game.user.getFlag(T, Tc(n, e));
  return !i || typeof i.timestamp != "number" || Date.now() - i.timestamp > t ? null : i.currentSegment ? i : null;
}
c(om, "getSavedProgress");
function Li(n, e = "default") {
  return `cinematic-seen-${n}-${e}`;
}
c(Li, "seenFlagKey");
function Iu(n, e = "default") {
  return !!game.user.getFlag(T, Li(n, e));
}
c(Iu, "hasSeenCinematic");
function gb(n, e) {
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
c(gb, "validateSingleCinematic");
function os(n) {
  const e = n ? game.scenes.get(n) : canvas.scene;
  let t = (e == null ? void 0 : e.getFlag(T, fb)) ?? null;
  if (t == null) return null;
  if (typeof t != "object" || Array.isArray(t))
    return console.warn(`[${T}] Cinematic: invalid flag data on scene ${e == null ? void 0 : e.id} (expected object). Ignoring.`), null;
  if ((t.version ?? 1) < 3) {
    const { version: i, ...r } = t;
    t = { version: 3, cinematics: { default: r } };
  }
  if (t.version === 3) {
    for (const [i, r] of Object.entries(t.cinematics ?? {}))
      t.cinematics[i] = Wt.migrateV3toV4(r);
    t.version = 4;
  }
  if (t.version === 4) {
    for (const [i, r] of Object.entries(t.cinematics ?? {}))
      t.cinematics[i] = Wt.migrateV4toV5(r);
    t.version = As;
  }
  if (t.version > As)
    return console.warn(`[${T}] Cinematic: scene ${e == null ? void 0 : e.id} has version ${t.version}, runtime supports up to ${As}. Skipping.`), null;
  if (!t.cinematics || typeof t.cinematics != "object")
    return console.warn(`[${T}] Cinematic: no 'cinematics' map on scene ${e == null ? void 0 : e.id}. Ignoring.`), null;
  for (const [i, r] of Object.entries(t.cinematics)) {
    const a = gb(r, `scene ${e == null ? void 0 : e.id} cinematic "${i}"`);
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
function pb(n) {
  const e = os(n);
  return e ? Object.keys(e.cinematics) : [];
}
c(pb, "listCinematicNames");
function yb() {
  return game.ready ? Promise.resolve() : new Promise((n) => Hooks.once("ready", n));
}
c(yb, "waitForReady");
async function bb(n = 1e4) {
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
c(bb, "waitForTweenAPI");
async function tc(n = 5e3) {
  var e;
  return window.Tagger ?? ((e = game.modules.get("tagger")) == null ? void 0 : e.api) ? !0 : new Promise((t) => {
    const i = Date.now(), r = setInterval(() => {
      var a;
      window.Tagger ?? ((a = game.modules.get("tagger")) == null ? void 0 : a.api) ? (clearInterval(r), t(!0)) : Date.now() - i > n && (clearInterval(r), console.warn(`[${T}] Cinematic: Tagger API not available after ${n}ms.`), t(!1));
    }, 200);
  });
}
c(tc, "waitForTagger");
async function vb(n, e, t) {
  if (!n || !n.event) return;
  const i = { ...n };
  console.log(`[${T}] Cinematic: waiting for gate: ${n.event}`);
  let r = null;
  if (n.event === "tile-click" && n.target && n.animation) {
    const a = e.get(n.target);
    (a == null ? void 0 : a.kind) === "placeable" && a.placeable && (r = new Ti(a.placeable, n.animation), r.start());
  }
  try {
    if (n.timeout && n.timeout > 0) {
      const a = new Promise((s) => setTimeout(s, n.timeout)), o = xl(i, { signal: t.signal, eventBus: null });
      await Promise.race([o, a]);
    } else
      await xl(i, { signal: t.signal, eventBus: null });
  } finally {
    r && r.detach();
  }
}
c(vb, "processGate");
function sm(n) {
  if (!n.segments) return [];
  const e = [], t = /* @__PURE__ */ new Set();
  let i = n.entry;
  for (; i && typeof i == "string" && n.segments[i] && !t.has(i); )
    t.add(i), e.push(i), i = n.segments[i].next;
  return e;
}
c(sm, "getSegmentOrder");
function uo(n, e) {
  if (n.setup)
    try {
      Oe(n.setup, e);
    } catch (i) {
      console.warn(`[${T}] Cinematic: error applying cinematic-level setup:`, i);
    }
  const t = sm(n);
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
async function Cr(n, e = "default", t = null) {
  var w, C, I, A, O, M, $, j;
  const i = n ?? ((w = canvas.scene) == null ? void 0 : w.id);
  if (!i) return;
  const r = `${i}:${e}`;
  if (t || (t = /* @__PURE__ */ new Set()), t.has(r)) {
    console.warn(`[${T}] Cinematic: circular transition detected at "${r}". Stopping chain.`), (I = (C = ui.notifications) == null ? void 0 : C.warn) == null || I.call(C, "Cinematic: circular transition detected, stopping.");
    return;
  }
  t.add(r), (Ce == null ? void 0 : Ce.status) === "running" && Ce.cancel("replaced"), Ce = null, sn && (sn.abort("replaced"), sn = null);
  const a = co(i, e);
  if (!a) {
    console.warn(`[${T}] Cinematic: no cinematic "${e}" on scene ${i}.`);
    return;
  }
  const o = await bb();
  if (!o || ((A = canvas.scene) == null ? void 0 : A.id) !== i || (await tc(), ((O = canvas.scene) == null ? void 0 : O.id) !== i)) return;
  const { targets: s, unresolved: l } = no(a);
  if (console.log(`[${T}] Cinematic "${e}": resolved ${s.size} targets`), l.length && console.warn(`[${T}] Cinematic "${e}": skipping ${l.length} unresolved: ${l.join(", ")}`), s.size === 0) {
    console.warn(`[${T}] Cinematic "${e}": no targets could be resolved on scene ${i}.`);
    return;
  }
  const u = wy(a);
  Er = vy(u, s), Sr = s;
  const d = om(i, e), m = new AbortController();
  sn = m;
  const f = a.synchronized === !0 && game.user.isGM, g = sm(a);
  if (g.length === 0) {
    console.warn(`[${T}] Cinematic "${e}": no segments to execute.`);
    return;
  }
  let p = 0;
  const y = /* @__PURE__ */ new Set();
  if (d) {
    const D = d.completedSegments ?? [];
    for (const N of D) y.add(N);
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
    const P = g[D], N = a.segments[P];
    if (N.setup)
      try {
        Oe(N.setup, s);
      } catch (R) {
        console.warn(`[${T}] Cinematic: error applying setup for completed segment "${P}":`, R);
      }
    if (N.landing)
      try {
        Oe(N.landing, s);
      } catch (R) {
        console.warn(`[${T}] Cinematic: error applying landing for completed segment "${P}":`, R);
      }
  }
  let v = !1, b = !1;
  tn({ type: "playback-start", sceneName: ((M = canvas.scene) == null ? void 0 : M.name) ?? i });
  try {
    for (let D = p; D < g.length; D++) {
      if (m.signal.aborted) {
        v = !0;
        break;
      }
      if ((($ = canvas.scene) == null ? void 0 : $.id) !== i) {
        v = !0;
        break;
      }
      const P = g[D], N = a.segments[P];
      if (console.log(`[${T}] Cinematic "${e}": entering segment "${P}"`), tn({ type: "segment-start", segmentName: P }), hb(i, e, P, [...y]), N.gate) {
        tn({ type: "gate-wait", segmentName: P, gate: N.gate });
        try {
          await vb(N.gate, s, m);
        } catch (B) {
          if (m.signal.aborted) {
            v = !0;
            break;
          }
          throw B;
        }
        tn({ type: "gate-resolved", segmentName: P });
      }
      if (m.signal.aborted) {
        v = !0;
        break;
      }
      if (N.setup)
        try {
          Oe(N.setup, s), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
        } catch (B) {
          console.error(`[${T}] Cinematic "${e}": error applying setup for segment "${P}":`, B);
        }
      if ((j = N.timeline) != null && j.length) {
        const B = Cc(N.timeline);
        tn({ type: "timeline-start", segmentName: P, durationMs: B });
        const { tl: W } = Oy(
          { setup: {}, timeline: N.timeline },
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
            m.signal.addEventListener("abort", ae, { once: !0 });
          });
        } catch (U) {
          if (U.message === "cancelled" || m.signal.aborted) {
            v = !0;
            break;
          }
          throw U;
        }
        tn({ type: "timeline-end", segmentName: P });
      }
      if (m.signal.aborted) {
        v = !0;
        break;
      }
      if (N.landing)
        try {
          Oe(N.landing, s), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
        } catch (B) {
          console.error(`[${T}] Cinematic "${e}": error applying landing for segment "${P}":`, B);
        }
      tn({ type: "segment-complete", segmentName: P }), y.add(P);
      const R = N.next;
      if (R && typeof R == "object" && R.scene) {
        const B = R.scene, W = R.segment ?? a.entry;
        console.log(`[${T}] Cinematic "${e}": cross-scene transition to scene ${B}, segment "${W}"`), Ce = null, sn = null, ec(i, e), hu(), a.tracking !== !1 && await game.user.setFlag(T, Li(i, e), !0), ti = { sceneId: B, cinematicName: e, visitedChain: t };
        const H = game.scenes.get(B);
        H ? H.view() : (console.warn(`[${T}] Cinematic: cross-scene transition target scene "${B}" not found.`), ti = null);
        return;
      }
    }
  } catch (D) {
    b = !0, console.error(`[${T}] Cinematic "${e}" error on scene ${i}:`, D);
  }
  if (Ce = null, sn = null, ec(i, e), hu(), Er = null, Sr = null, tn({ type: "playback-end", cancelled: !!v }), v) {
    console.log(`[${T}] Cinematic "${e}" cancelled on scene ${i}.`), uo(a, s);
    return;
  }
  if (b) {
    uo(a, s);
    return;
  }
  a.tracking !== !1 && await game.user.setFlag(T, Li(i, e), !0), console.log(`[${T}] Cinematic "${e}" complete on scene ${i}.`);
}
c(Cr, "playCinematic");
async function wb(n, e = "default") {
  var i;
  const t = n ?? ((i = canvas.scene) == null ? void 0 : i.id);
  t && (await game.user.unsetFlag(T, Li(t, e)), console.log(`[${T}] Cinematic: cleared seen flag for "${e}" on scene ${t}.`));
}
c(wb, "resetCinematic");
async function Eb(n, e, t = "default") {
  var a;
  if (!game.user.isGM) return;
  const i = n ?? ((a = canvas.scene) == null ? void 0 : a.id);
  if (!i || !e) return;
  const r = game.users.get(e);
  r && (await r.unsetFlag(T, Li(i, t)), console.log(`[${T}] Cinematic: cleared seen flag for user ${r.name} on "${t}" scene ${i}.`));
}
c(Eb, "resetCinematicForUser");
async function Sb(n, e = "default") {
  var a;
  if (!game.user.isGM) return;
  const t = n ?? ((a = canvas.scene) == null ? void 0 : a.id);
  if (!t) return;
  const i = Li(t, e), r = game.users.map((o) => o.getFlag(T, i) ? o.unsetFlag(T, i) : Promise.resolve());
  await Promise.all(r), console.log(`[${T}] Cinematic: cleared seen flag for all users on "${e}" scene ${t}.`);
}
c(Sb, "resetCinematicForAll");
function Cb(n, e = "default") {
  var r;
  const t = n ?? ((r = canvas.scene) == null ? void 0 : r.id);
  if (!t) return [];
  const i = Li(t, e);
  return game.users.map((a) => ({
    userId: a.id,
    name: a.name,
    color: a.color ?? "#888888",
    isGM: a.isGM,
    seen: !!a.getFlag(T, i)
  }));
}
c(Cb, "getSeenStatus");
function Tb(n, e) {
  var i;
  const t = n ?? ((i = canvas.scene) == null ? void 0 : i.id);
  return e ? co(t, e) != null : os(t) != null;
}
c(Tb, "hasCinematic");
function Lb() {
  if (!Er || !Sr) {
    console.warn(`[${T}] Cinematic: no snapshot available for revert.`);
    return;
  }
  (Ce == null ? void 0 : Ce.status) === "running" && Ce.cancel("reverted"), Ce = null, sn && (sn.abort("reverted"), sn = null);
  try {
    Oe(Er, Sr), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 }), console.log(`[${T}] Cinematic: reverted to pre-cinematic state.`);
  } catch (n) {
    console.error(`[${T}] Cinematic: error during revert:`, n);
  }
  Er = null, Sr = null;
}
c(Lb, "revertCinematic");
async function Ib() {
  const n = ++ki;
  if (console.log(`[${T}] Cinematic: canvasReady fired, gen=${n}, game.ready=${game.ready}`), await yb(), n !== ki) return;
  console.log(`[${T}] Cinematic: game is ready`);
  const e = canvas.scene;
  if (!e) {
    console.log(`[${T}] Cinematic: no canvas.scene, exiting`);
    return;
  }
  if (ti && ti.sceneId === e.id) {
    const a = ti;
    ti = null, console.log(`[${T}] Cinematic: picking up pending transition to "${a.cinematicName}" on scene ${e.id}`);
    try {
      await Cr(e.id, a.cinematicName, a.visitedChain);
    } catch (o) {
      console.error(`[${T}] Cinematic: error during pending transition playback on scene ${e.id}:`, o);
    }
    return;
  }
  ti = null;
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
    const o = om(e.id, a);
    if (n !== ki) return;
    if (o) {
      console.log(`[${T}] Cinematic "${a}": found saved progress at segment "${o.currentSegment}", resuming...`);
      try {
        await Cr(e.id, a);
      } catch (s) {
        console.error(`[${T}] Cinematic "${a}": error during resumed playback on scene ${e.id}:`, s);
      }
      return;
    }
  }
  let r = null;
  for (const { name: a, data: o } of i)
    if (!(o.tracking !== !1 && Iu(e.id, a))) {
      r = { name: a, data: o };
      break;
    }
  if (!r) {
    if (console.log(`[${T}] Cinematic: all canvasReady cinematics already seen on scene ${e.id}`), Ob(e.id, i), (Ce == null ? void 0 : Ce.status) === "running" && Ce.cancel("already-seen"), Ce = null, await tc(), n !== ki) return;
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
  if (n === ki && (console.log(`[${T}] Cinematic: playing first unseen cinematic "${r.name}"...`), await tc(), n === ki)) {
    for (const { name: a, data: o } of i) {
      if (a === r.name) continue;
      if (o.tracking !== !1 && Iu(e.id, a))
        try {
          const { targets: l } = no(o);
          uo(o, l);
        } catch (l) {
          console.error(`[${T}] Cinematic "${a}": error applying landing states (already seen) on scene ${e.id}:`, l);
        }
    }
    try {
      await Cr(e.id, r.name);
    } catch (a) {
      console.error(`[${T}] Cinematic "${r.name}": error during playback on scene ${e.id}:`, a);
    }
  }
}
c(Ib, "onCanvasReady$1");
function Ob(n, e) {
  for (const { name: t } of e)
    ec(n, t);
}
c(Ob, "clearAllCanvasReadyProgress");
function Ab(n = 3e5) {
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
c(Ab, "cleanupStaleProgressFlags");
function kb() {
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
        new Gl({ scene: canvas.scene }).render(!0);
      }, "onClick")
    };
    Array.isArray(i) ? i.push(a) : i instanceof Map ? i.set(r, a) : i && typeof i == "object" ? i[r] = a : t.tools = [a];
  });
}
c(kb, "registerEditorButton");
function Mb() {
  Hooks.on("canvasReady", Ib), kb(), Hooks.once("ready", () => {
    Ab();
    const n = game.modules.get(T);
    n.api || (n.api = {}), n.api.cinematic = {
      play: Cr,
      reset: wb,
      resetForUser: Eb,
      resetForAll: Sb,
      getSeenStatus: Cb,
      has: Tb,
      get: co,
      list: pb,
      revert: Lb,
      onPlaybackProgress: mb,
      TileAnimator: Ti,
      registerBehaviour: me,
      getBehaviour: $a,
      trigger: /* @__PURE__ */ c(async (e, t, i = "default") => {
        var o;
        const r = t ?? ((o = canvas.scene) == null ? void 0 : o.id);
        if (!r) return;
        const a = co(r, i);
        a && (a.trigger && a.trigger !== e || await Cr(r, i));
      }, "trigger")
    }, console.log(`[${T}] Cinematic API registered (v5).`);
  });
}
c(Mb, "registerCinematicHooks");
function nc(n, e) {
  const t = Math.abs(n.width), i = Math.abs(n.height), r = t / 2, a = i / 2;
  let o = e.x - (n.x + r), s = e.y - (n.y + a);
  if (n.rotation !== 0) {
    const l = Math.toRadians(n.rotation), u = Math.cos(l), d = Math.sin(l), m = u * o + d * s, f = u * s - d * o;
    o = m, s = f;
  }
  return o += r, s += a, o >= 0 && o <= t && s >= 0 && s <= i;
}
c(nc, "pointWithinTile");
ns("tile-click", (n, e) => n.target ? new Promise((t, i) => {
  var g;
  if (e.signal.aborted) return i(e.signal.reason ?? "aborted");
  const r = rs(n.target);
  if (!((g = r == null ? void 0 : r.placeables) != null && g.length))
    return i(new Error(`await tile-click: no placeables found for "${n.target}"`));
  const a = r.placeables, o = [];
  for (const { placeable: p } of a) {
    const y = new Ti(p, n.animation);
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
      nc(w.document, v) ? (b = !0, C.state !== "hover" && C.setState("hover")) : C.state === "hover" && C.setState("idle");
    b ? l === null && (l = document.body.style.cursor, document.body.style.cursor = "pointer") : l !== null && (document.body.style.cursor = l, l = null);
  }, "onPointerMove");
  s == null || s.addEventListener("pointermove", u);
  const d = /* @__PURE__ */ c((p) => {
    if (p.button !== 0) return;
    const y = canvas.activeLayer;
    if (!y) return;
    const v = y.toLocal(p);
    isNaN(v.x) || isNaN(v.y) || !a.filter(({ doc: w }) => nc(w, v)).sort((w, C) => (C.doc.sort ?? 0) - (w.doc.sort ?? 0))[0] || (p.stopPropagation(), p.preventDefault(), f(), t());
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
Mb();
function _b() {
  Hooks.once("ready", () => {
    const n = game.modules.get(T);
    n.api || (n.api = {}), n.api.picker = {
      /** Open the picker window. Returns Promise<string[] | null>. */
      open: /* @__PURE__ */ c((e) => lo.open(e), "open"),
      /** Resolve a selector string to documents. */
      resolveSelector: rs,
      /** Parse a selector string into { type, value }. */
      parseSelector: Sc,
      /** Build a selector string from { type, value }. */
      buildSelector: hy,
      /** Build a tag selector from tags array + mode. */
      buildTagSelector: Cf,
      /** Canvas highlight utilities. */
      highlight: {
        add: so,
        remove: Zi,
        has: $f,
        clearAll: xa
      }
    }, console.log(`[${T}] Placeable Picker API registered.`);
  });
}
c(_b, "registerPlaceablePickerHooks");
_b();
const ur = "canvas-popup", Nb = 100;
function xb(n) {
  const e = canvas.stage.worldTransform, t = document.getElementById("board"), i = t == null ? void 0 : t.getBoundingClientRect(), r = (i == null ? void 0 : i.left) ?? 0, a = (i == null ? void 0 : i.top) ?? 0;
  return {
    x: e.a * n.x + e.c * n.y + e.tx + r,
    y: e.b * n.x + e.d * n.y + e.ty + a
  };
}
c(xb, "canvasToScreen");
function $b() {
  var n, e;
  return ((e = (n = canvas.stage) == null ? void 0 : n.scale) == null ? void 0 : e.x) ?? 1;
}
c($b, "getZoom");
function ks(n, e) {
  var t;
  return e === "grid" ? n * (((t = canvas.grid) == null ? void 0 : t.size) ?? 100) : n;
}
c(ks, "resolveUnit");
function Fb(n, e) {
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
c(Fb, "attachClickOutside");
function Db(n, e) {
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
c(Db, "attachRightClickOutside");
function Pb(n, e) {
  function t(i) {
    i.key === "Escape" && (i.preventDefault(), i.stopPropagation(), e());
  }
  return c(t, "handler"), document.addEventListener("keydown", t, !0), () => {
    document.removeEventListener("keydown", t, !0);
  };
}
c(Pb, "attachEscape");
const Ms = /* @__PURE__ */ new Set(), ga = 8, Ou = 0.5, Nc = class Nc {
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
    e.className = ur, this._cssClass && e.classList.add(...this._cssClass.split(/\s+/)), e.style.position = "fixed", e.style.zIndex = Nb;
    const t = document.createElement("div");
    t.className = `${ur}__content`, e.appendChild(t), this.element = e, this._contentWrap = t;
    const i = this._resolveWidth();
    i != null && (t.style.width = `${i}px`, t.style.minWidth = "0", t.style.boxSizing = "border-box"), this._initialContent && this.setContent(this._initialContent), document.body.appendChild(e), this.reposition(), this._animate ? requestAnimationFrame(() => {
      this.element && this.element.classList.add(`${ur}--visible`);
    }) : e.classList.add(`${ur}--visible`), this._hookId = Hooks.on("canvasPan", () => this.reposition()), this._anchor.placeable && ((a = canvas.app) != null && a.ticker) && (this._tickerFn = () => this.reposition(), canvas.app.ticker.add(this._tickerFn));
    const r = /* @__PURE__ */ c((o) => {
      this._emit("dismiss", o), this.destroy();
    }, "dismissFn");
    return this._dismiss.clickOutside && this._cleanups.push(Fb(e, () => r("clickOutside"))), this._dismiss.rightClickOutside && this._cleanups.push(Db(e, () => r("rightClickOutside"))), this._dismiss.escape && this._cleanups.push(Pb(e, () => r("escape"))), this.isOpen = !0, Ms.add(this), this._emit("open"), this;
  }
  /**
   * Remove from DOM and clean up everything. Idempotent.
   */
  destroy() {
    var t;
    if (!this.isOpen) return;
    this.isOpen = !1, Ms.delete(this);
    for (const i of this._cleanups) i();
    this._cleanups.length = 0, this._hookId != null && (Hooks.off("canvasPan", this._hookId), this._hookId = null), this._tickerFn && ((t = canvas.app) != null && t.ticker) && (canvas.app.ticker.remove(this._tickerFn), this._tickerFn = null);
    const e = this.element;
    if (e) {
      if (this._animate) {
        e.classList.remove(`${ur}--visible`);
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
    const t = $b(), i = this._sizeUnit !== "screen", r = ks(this._offset.x, this._sizeUnit), a = ks(this._offset.y, this._sizeUnit), o = {
      x: e.x + r,
      y: e.y + a
    }, s = xb(o);
    if (Math.abs(s.x - this._lastScreenPos.x) < Ou && Math.abs(s.y - this._lastScreenPos.y) < Ou)
      return;
    this._lastScreenPos = { x: s.x, y: s.y };
    const l = this.element, u = i ? t : 1;
    i ? (l.style.transformOrigin = `${this._anchorX} ${this._anchorY}`, l.style.transform = `scale(${u})`) : (l.style.transform = "", l.style.transformOrigin = "");
    let d = 0, m = 0;
    const f = l.getBoundingClientRect();
    this._anchorX === "center" ? d = -f.width / 2 : this._anchorX === "right" && (d = -f.width), this._anchorY === "center" ? m = -f.height / 2 : this._anchorY === "bottom" && (m = -f.height);
    let g = s.x + d, p = s.y + m;
    if (this._clampToViewport) {
      const y = window.innerWidth - f.width - ga, v = window.innerHeight - f.height - ga;
      g = Math.max(ga, Math.min(g, y)), p = Math.max(ga, Math.min(p, v));
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
const Qn = "canvas-popup-options";
function Rb({ sections: n = [] } = {}) {
  const e = /* @__PURE__ */ new Map(), t = document.createElement("div");
  t.className = Qn;
  for (const s of n) {
    const l = document.createElement("div");
    l.className = `${Qn}__section`;
    const u = document.createElement("div");
    u.className = `${Qn}__header`, u.textContent = s.label, l.appendChild(u);
    for (const d of s.items) {
      const m = document.createElement("div");
      m.className = `${Qn}__item`, d.active && m.classList.add(`${Qn}__item--active`), m.dataset.key = s.key, m.dataset.value = d.value;
      const f = document.createElement("span");
      f.className = `${Qn}__dot`, m.appendChild(f);
      const g = document.createElement("span");
      g.className = `${Qn}__label`, g.textContent = d.label, m.appendChild(g), m.addEventListener("click", (p) => {
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
c(Rb, "createOptionList");
function Hb() {
  Hooks.once("ready", () => {
    const n = game.modules.get(T);
    n.api || (n.api = {}), n.api.canvasPopup = {
      CanvasPopup: fo,
      content: { createOptionList: Rb }
    }, console.log(`[${T}] Canvas Popup API registered.`);
  }), Hooks.on("canvasTearDown", () => fo.destroyAll());
}
c(Hb, "registerCanvasPopupHooks");
Hb();
const Da = "eidolon-utilities", qb = "tile-interactions", jb = "tile-animations", Bb = "idle-animation";
function Ub(n) {
  const e = n.type ?? "tile-prop";
  return e === "tile-tint" ? { name: "tween-tint", fromColor: n.fromColor, toColor: n.toColor, mode: n.mode, period: n.period, easing: n.easing } : e === "tile-scale" ? { name: "tween-scale", fromScale: n.fromScale, toScale: n.toScale, period: n.period, easing: n.easing } : { name: "tween-prop", attribute: n.attribute, from: n.from, to: n.to, period: n.period, easing: n.easing };
}
c(Ub, "migrateIdleTweenToAlways");
function Lc(n) {
  var u, d, m;
  const e = (u = n == null ? void 0 : n.getFlag) == null ? void 0 : u.call(n, Da, jb);
  if (e) return e;
  const t = (d = n == null ? void 0 : n.getFlag) == null ? void 0 : d.call(n, Da, Bb), i = (m = n == null ? void 0 : n.getFlag) == null ? void 0 : m.call(n, Da, qb);
  let r = [], a = [], o = [], s = [];
  if (t) {
    let f;
    Array.isArray(t) ? f = t : typeof t == "object" && "0" in t ? f = Object.values(t) : typeof t == "object" && (t.type || t.attribute) ? f = [t] : f = [], r = f.filter((g) => g && typeof g == "object").map(Ub);
  }
  return i && (i.hover && (Array.isArray(i.hover) ? o = i.hover : typeof i.hover == "object" && (a = Array.isArray(i.hover.idle) ? i.hover.idle : [], o = Array.isArray(i.hover.enter) ? i.hover.enter : [])), Array.isArray(i.click) && i.click.length && (s = i.click)), r.length > 0 || a.length > 0 || o.length > 0 || s.length > 0 ? { always: r, idle: a, hover: o, click: s } : null;
}
c(Lc, "readUnifiedConfig");
const fn = /* @__PURE__ */ new Map(), Un = /* @__PURE__ */ new Map(), Au = /* @__PURE__ */ new WeakMap(), Tr = /* @__PURE__ */ new Set();
let Nt = null, Ye = null, _t = null, zt = null, Gt = null;
function lm(n) {
  const e = canvas.activeLayer;
  if (!e) return null;
  const t = e.toLocal(n);
  return !t || Number.isNaN(t.x) || Number.isNaN(t.y) ? null : t;
}
c(lm, "canvasToLocal");
function cm(n) {
  let e = null, t = -1 / 0;
  for (const [i, r] of fn)
    if (nc(r.doc, n)) {
      const a = r.doc.sort ?? 0;
      a > t && (e = r, t = a);
    }
  return e;
}
c(cm, "hitTest");
function Vb(n) {
  var e, t;
  return {
    always: n.always ?? [],
    idle: (e = n.idle) != null && e.length ? n.idle : ["none"],
    hover: (t = n.hover) != null && t.length ? n.hover : ["none"]
  };
}
c(Vb, "buildAnimatorConfig");
function Ic(n, e, t) {
  ta(n);
  const i = Vb(t), r = new Ti(e, i);
  r.start("idle"), Un.set(n, r);
}
c(Ic, "startHoverAnimator");
function ta(n) {
  const e = Un.get(n);
  e && (e.detach(), Un.delete(n));
}
c(ta, "stopHoverAnimator");
function _s(n, e, t, i) {
  return e.type === "tile-tint" ? { uuid: n, toColor: t ? e.toColor : e.fromColor, mode: e.mode } : e.type === "tile-scale" ? {
    uuid: n,
    toScale: t ? e.toScale : e.fromScale,
    ...i
  } : { uuid: n, attribute: e.attribute, value: t ? e.to : e.from };
}
c(_s, "buildClickParams");
function zb(n) {
  const e = n._source.width, t = n._source.height, i = n._source.x, r = n._source.y;
  return {
    baseWidth: e,
    baseHeight: t,
    centerX: i + e / 2,
    centerY: r + t / 2
  };
}
c(zb, "captureRefGeometry");
async function Gb(n, e) {
  const t = n.uuid, i = e.type ?? "tile-prop", r = nr(i);
  if (!r) {
    console.warn(`[${Da}] tile-interactions: unknown tween type "${i}"`);
    return;
  }
  const a = e.period ?? 300, o = e.easing ?? "easeOutCubic", s = e.mode ?? "bounce", l = i === "tile-scale" ? zb(n) : null;
  if (s === "toggle") {
    const d = !(Au.get(n) ?? !1);
    await r.execute(
      _s(t, e, d, l),
      { durationMS: a, easing: o, commit: !0 }
    ), Au.set(n, d);
  } else {
    const u = a / 2;
    await r.execute(
      _s(t, e, !0, l),
      { durationMS: u, easing: o, commit: !1 }
    ), await r.execute(
      _s(t, e, !1, l),
      { durationMS: u, easing: o, commit: !1 }
    );
  }
}
c(Gb, "playClickAnimation");
async function Wb(n) {
  var t, i, r, a;
  const e = n.doc.id;
  if (!Tr.has(e)) {
    Tr.add(e);
    try {
      ta(e);
      const o = n.clickConfig.map((s) => Gb(n.doc, s));
      await Promise.all(o);
    } finally {
      Tr.delete(e), n.animConfig && (((t = n.animConfig.always) == null ? void 0 : t.length) > 0 || ((i = n.animConfig.idle) == null ? void 0 : i.length) > 0 || ((r = n.animConfig.hover) == null ? void 0 : r.length) > 0) && (Ic(e, n.placeable, n.animConfig), Nt === e && ((a = Un.get(e)) == null || a.setState("hover")));
    }
  }
}
c(Wb, "handleClick");
function um(n) {
  var r;
  const e = lm(n);
  if (!e) return;
  const t = cm(e), i = (t == null ? void 0 : t.doc.id) ?? null;
  if (i !== Nt) {
    if (Nt) {
      const a = Un.get(Nt);
      a && a.setState("idle");
    }
    if (i) {
      const a = Un.get(i);
      a && a.setState("hover");
    }
    Nt = i, i && (t.animConfig || (r = t.clickConfig) != null && r.length) ? (Ye === null && (Ye = document.body.style.cursor), document.body.style.cursor = "pointer") : Ye !== null && (document.body.style.cursor = Ye, Ye = null);
  }
}
c(um, "onPointerMove");
function dm(n) {
  var i;
  if (n.button !== 0) return;
  const e = lm(n);
  if (!e) return;
  const t = cm(e);
  !t || !((i = t.clickConfig) != null && i.length) || Wb(t);
}
c(dm, "onPointerDown");
function fm() {
  if (Nt) {
    const n = Un.get(Nt);
    n && n.setState("idle"), Nt = null;
  }
  Ye !== null && (document.body.style.cursor = Ye, Ye = null);
}
c(fm, "onPointerLeave");
function mm() {
  var t, i, r, a;
  for (const o of Un.keys())
    ta(o);
  fn.clear(), Tr.clear(), Nt = null, Ye !== null && (document.body.style.cursor = Ye, Ye = null);
  const n = document.getElementById("board");
  _t && (n == null || n.removeEventListener("pointermove", _t), _t = null), zt && (n == null || n.removeEventListener("pointerdown", zt), zt = null), Gt && (n == null || n.removeEventListener("pointerleave", Gt), Gt = null);
  const e = (t = canvas.tiles) == null ? void 0 : t.placeables;
  if (Array.isArray(e)) {
    for (const o of e) {
      const s = o.document, l = Lc(s);
      if (!l) continue;
      const u = ((i = l.always) == null ? void 0 : i.length) > 0 || ((r = l.idle) == null ? void 0 : r.length) > 0 || ((a = l.hover) == null ? void 0 : a.length) > 0, d = Array.isArray(l.click) && l.click.length ? l.click : null;
      !u && !d || (fn.set(s.id, { doc: s, placeable: o, animConfig: l, clickConfig: d }), u && Ic(s.id, o, l));
    }
    fn.size !== 0 && (_t = um, zt = dm, Gt = fm, n == null || n.addEventListener("pointermove", _t), n == null || n.addEventListener("pointerdown", zt), n == null || n.addEventListener("pointerleave", Gt));
  }
}
c(mm, "rebuild");
function Yb(n) {
  var o, s, l;
  const e = n.id, t = Lc(n), i = t && (((o = t.always) == null ? void 0 : o.length) > 0 || ((s = t.idle) == null ? void 0 : s.length) > 0 || ((l = t.hover) == null ? void 0 : l.length) > 0), r = t && Array.isArray(t.click) && t.click.length ? t.click : null;
  if (!i && !r) {
    hm(n);
    return;
  }
  ta(e);
  const a = n.object;
  if (!a) {
    fn.delete(e);
    return;
  }
  fn.set(e, { doc: n, placeable: a, animConfig: t, clickConfig: r }), i && Ic(e, a, t), Kb();
}
c(Yb, "updateTile");
function hm(n) {
  const e = n.id;
  if (ta(e), fn.delete(e), Tr.delete(e), Nt === e && (Nt = null, Ye !== null && (document.body.style.cursor = Ye, Ye = null)), fn.size === 0) {
    const t = document.getElementById("board");
    _t && (t == null || t.removeEventListener("pointermove", _t), _t = null), zt && (t == null || t.removeEventListener("pointerdown", zt), zt = null), Gt && (t == null || t.removeEventListener("pointerleave", Gt), Gt = null);
  }
}
c(hm, "removeTile");
function Kb() {
  if (fn.size === 0 || _t) return;
  const n = document.getElementById("board");
  n && (_t = um, zt = dm, Gt = fm, n.addEventListener("pointermove", _t), n.addEventListener("pointerdown", zt), n.addEventListener("pointerleave", Gt));
}
c(Kb, "ensureListeners");
function Ni(n, e, t) {
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
c(Ni, "buildSelectGroup");
function xi(n, e, t, i = {}) {
  const r = document.createElement("div");
  r.classList.add("form-group");
  const a = document.createElement("label");
  a.textContent = n;
  const o = document.createElement("input");
  o.type = "number", o.classList.add(e), o.value = String(t);
  for (const [s, l] of Object.entries(i)) o.setAttribute(s, l);
  return r.append(a, o), r;
}
c(xi, "buildNumberGroup");
function ic(n, e, t) {
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
c(ic, "buildColorGroup");
let oe = null;
function Ns() {
  for (const n of document.querySelectorAll(".idle-anim__slot--insert-before, .idle-anim__slot--insert-after"))
    n.classList.remove("idle-anim__slot--insert-before", "idle-anim__slot--insert-after");
}
c(Ns, "clearInsertIndicators");
function ku(n) {
  for (const e of document.querySelectorAll(".idle-anim__slots"))
    e.classList.toggle("idle-anim__slots--drag-active", n);
}
c(ku, "setDragActive");
function mo(n, e) {
  n.dispatchEvent(new CustomEvent("slot-reorder", { detail: { card: e } }));
}
c(mo, "notifyReorder");
function gm(n, { dropGroup: e, handleSelector: t = ".idle-anim__slot-header" }) {
  n.setAttribute("draggable", "true");
  let i = !1;
  n.addEventListener("pointerdown", (r) => {
    i = !!r.target.closest(t);
  }), n.addEventListener("dragstart", (r) => {
    if (!i) {
      r.preventDefault();
      return;
    }
    oe = { card: n, sourceContainer: n.parentElement, group: e, insertMode: null, insertTarget: null }, n.classList.add("is-dragging"), ku(!0), r.dataTransfer.effectAllowed = "move", r.dataTransfer.setData("text/plain", "");
  }), n.addEventListener("dragover", (r) => {
    if (!oe || oe.group !== e || oe.card === n) return;
    r.preventDefault(), r.dataTransfer.dropEffect = "move";
    const a = n.getBoundingClientRect(), o = a.top + a.height / 2, s = r.clientY < o ? "before" : "after";
    (oe.insertTarget !== n || oe.insertMode !== s) && (Ns(), n.classList.add(s === "before" ? "idle-anim__slot--insert-before" : "idle-anim__slot--insert-after"), oe.insertTarget = n, oe.insertMode = s);
  }), n.addEventListener("dragleave", () => {
    n.classList.remove("idle-anim__slot--insert-before", "idle-anim__slot--insert-after"), (oe == null ? void 0 : oe.insertTarget) === n && (oe.insertTarget = null, oe.insertMode = null);
  }), n.addEventListener("drop", (r) => {
    if (r.preventDefault(), r.stopPropagation(), Ns(), !oe || oe.group !== e || oe.card === n) return;
    const a = oe.card, o = oe.sourceContainer, s = n.parentElement;
    oe.insertMode === "after" ? s.insertBefore(a, n.nextSibling) : s.insertBefore(a, n), mo(s, a), o !== s && mo(o, a), oe = null;
  }), n.addEventListener("dragend", () => {
    n.classList.remove("is-dragging"), Ns(), ku(!1);
    for (const r of document.querySelectorAll(".idle-anim__slots--drag-over"))
      r.classList.remove("idle-anim__slots--drag-over");
    oe = null;
  });
}
c(gm, "makeDraggable");
function pm(n, { dropGroup: e, onDrop: t }) {
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
c(pm, "makeDropContainer");
const pa = "eidolon-utilities", Mu = "tile-animations", Jb = "tile-interactions", Xb = "idle-animation", Qb = "eidolon-idle-animation", Zb = "fa-solid fa-wave-pulse", ym = [
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
], ev = [
  { value: "tween-prop", label: "Numeric" },
  { value: "tween-tint", label: "Tint" },
  { value: "tween-scale", label: "Scale" }
], bm = {
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
}, Hi = {
  fromColor: "#ffffff",
  toColor: "#ffaa00",
  period: 500,
  mode: "bounce"
}, Pa = {
  type: "tile-scale",
  fromScale: 1,
  toScale: 1.2,
  period: 300,
  easing: "easeOutCubic",
  mode: "bounce"
}, vm = [
  { value: "alpha", label: "Alpha (Opacity)" },
  { value: "rotation", label: "Rotation" },
  { value: "texture.rotation", label: "Texture Rotation" }
];
let vn = null;
function tv(n) {
  var e;
  return (n == null ? void 0 : n.document) ?? ((e = n == null ? void 0 : n.object) == null ? void 0 : e.document) ?? (n == null ? void 0 : n.object) ?? null;
}
c(tv, "getTileDocument");
function nv(n, e) {
  const t = document.createElement("div");
  t.classList.add("form-group");
  const i = document.createElement("label");
  i.textContent = "Type", t.appendChild(i);
  const r = document.createElement("select");
  r.classList.add(e);
  const a = document.createElement("optgroup");
  a.label = "Effects";
  for (const s of ym) {
    const l = document.createElement("option");
    l.value = s.value, l.textContent = s.label, s.value === n && (l.selected = !0), a.appendChild(l);
  }
  r.appendChild(a);
  const o = document.createElement("optgroup");
  o.label = "Tweens";
  for (const s of ev) {
    const l = document.createElement("option");
    l.value = s.value, l.textContent = s.label, s.value === n && (l.selected = !0), o.appendChild(l);
  }
  return r.appendChild(o), t.appendChild(r), t;
}
c(nv, "buildEffectTypeSelect");
function _u(n) {
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
  const t = ym.find((i) => i.value === e);
  return (t == null ? void 0 : t.label) ?? e;
}
c(_u, "summarizeEffectConfig");
function Nu(n, e, t, i) {
  const r = n.name ?? "float", a = bc(), o = Xi(), s = document.createElement("div");
  s.classList.add("idle-anim__slot", "is-collapsed", t), s.dataset.index = String(e);
  const l = document.createElement("div");
  l.classList.add("idle-anim__slot-header");
  const u = document.createElement("i");
  u.classList.add("fa-solid", "fa-chevron-right", "idle-anim__slot-chevron");
  const d = document.createElement("span");
  d.classList.add("idle-anim__slot-title"), d.textContent = `${i} ${e + 1}`;
  const m = document.createElement("span");
  m.classList.add("idle-anim__slot-summary"), m.textContent = _u(n);
  const f = document.createElement("button");
  f.type = "button", f.classList.add("idle-anim__slot-remove"), f.innerHTML = '<i class="fa-solid fa-xmark"></i>', f.title = "Remove effect", l.append(u, d, m, f), s.appendChild(l);
  const g = document.createElement("div");
  g.classList.add("idle-anim__slot-body");
  const p = nv(r, "ti-effect__type");
  g.appendChild(p);
  const y = document.createElement("div");
  y.classList.add("idle-anim__type-fields"), g.appendChild(y);
  function v(w, C) {
    y.innerHTML = "";
    const I = bm[w];
    if (I)
      for (const A of I) {
        const O = C[A.key] ?? A.default;
        if (A.type === "color")
          y.appendChild(ic(A.label, `ti-effect__${A.key}`, O));
        else if (A.type === "select") {
          let M;
          A.options === "interpolation" ? M = o.map(($) => ({ value: $, label: $, selected: $ === O })) : Array.isArray(A.options) ? M = A.options.map(($) => ({ value: $.value, label: $.label, selected: $.value === O })) : M = a.map(($) => ({ value: $, label: $, selected: $ === O })), y.appendChild(Ni(A.label, `ti-effect__${A.key}`, M));
        } else
          y.appendChild(xi(A.label, `ti-effect__${A.key}`, O, A.attrs ?? {}));
      }
  }
  c(v, "renderParams"), v(r, n), s.appendChild(g);
  const b = s.querySelector(".ti-effect__type");
  return b == null || b.addEventListener("change", () => {
    v(b.value, {});
  }), l.addEventListener("click", (w) => {
    if (!w.target.closest(".idle-anim__slot-remove") && (s.classList.toggle("is-collapsed"), s.classList.contains("is-collapsed"))) {
      const C = wm(s);
      C && (m.textContent = _u(C));
    }
  }), f.addEventListener("click", (w) => {
    w.stopPropagation();
    const C = s.parentElement;
    s.remove(), C && ss(C, t, i);
  }), gm(s, { dropGroup: "effect" }), s;
}
c(Nu, "buildEffectSlot");
function wm(n) {
  var r;
  const e = ((r = n.querySelector(".ti-effect__type")) == null ? void 0 : r.value) ?? "float", t = bm[e], i = { name: e };
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
c(wm, "readEffectSlot");
function xu(n) {
  if (!n) return "";
  const e = n.type ?? "tile-prop", t = n.mode ?? "bounce", i = t.charAt(0).toUpperCase() + t.slice(1);
  if (e === "tile-tint")
    return `${i} Tint ${n.fromColor ?? "?"} → ${n.toColor ?? "?"} (${n.period ?? "?"}ms)`;
  if (e === "tile-scale") {
    const o = n.fromScale != null ? `${Math.round(n.fromScale * 100)}%` : "?", s = n.toScale != null ? `${Math.round(n.toScale * 100)}%` : "?";
    return `${i} Scale ${o} → ${s} (${n.period ?? "?"}ms)`;
  }
  const r = vm.find((o) => o.value === n.attribute), a = (r == null ? void 0 : r.label) ?? n.attribute ?? "?";
  return `${i} ${a} ${n.from ?? "?"} → ${n.to ?? "?"} (${n.period ?? "?"}ms)`;
}
c(xu, "summarizeClickConfig");
function $u(n, e) {
  const t = n.type ?? "tile-prop", i = n.mode ?? "bounce", r = bc(), a = document.createElement("div");
  a.classList.add("idle-anim__slot", "is-collapsed", "ti-click-slot"), a.dataset.index = String(e);
  const o = document.createElement("div");
  o.classList.add("idle-anim__slot-header");
  const s = document.createElement("i");
  s.classList.add("fa-solid", "fa-chevron-right", "idle-anim__slot-chevron");
  const l = document.createElement("span");
  l.classList.add("idle-anim__slot-title"), l.textContent = `Animation ${e + 1}`;
  const u = document.createElement("span");
  u.classList.add("idle-anim__slot-summary"), u.textContent = xu(n);
  const d = document.createElement("button");
  d.type = "button", d.classList.add("idle-anim__slot-remove"), d.innerHTML = '<i class="fa-solid fa-xmark"></i>', d.title = "Remove animation", o.append(s, l, u, d), a.appendChild(o);
  const m = document.createElement("div");
  m.classList.add("idle-anim__slot-body");
  const f = document.createElement("div");
  f.classList.add("idle-anim__range-row"), f.appendChild(Ni("Mode", "ti-click__mode", [
    { value: "bounce", label: "Bounce", selected: i === "bounce" },
    { value: "toggle", label: "Toggle", selected: i === "toggle" }
  ])), f.appendChild(Ni("Type", "ti-click__type", [
    { value: "tile-prop", label: "Numeric", selected: t === "tile-prop" },
    { value: "tile-tint", label: "Tint", selected: t === "tile-tint" },
    { value: "tile-scale", label: "Scale", selected: t === "tile-scale" }
  ])), m.appendChild(f);
  const g = document.createElement("div");
  g.classList.add("idle-anim__type-fields"), m.appendChild(g);
  function p(w, C) {
    if (g.innerHTML = "", w === "tile-tint") {
      const I = Xi(), A = C.fromColor ?? Hi.fromColor, O = C.toColor ?? Hi.toColor, M = C.mode ?? "oklch", $ = document.createElement("div");
      $.classList.add("idle-anim__range-row"), $.appendChild(ic("From", "ti-click__from-color", A)), $.appendChild(ic("To", "ti-click__to-color", O)), g.appendChild($), g.appendChild(Ni(
        "Interpolation",
        "ti-click__color-mode",
        I.map((j) => ({ value: j, label: j, selected: j === M }))
      ));
    } else if (w === "tile-scale") {
      const I = C.fromScale ?? Pa.fromScale, A = C.toScale ?? Pa.toScale, O = document.createElement("div");
      O.classList.add("idle-anim__range-row"), O.appendChild(xi("From", "ti-click__from-scale", I, { step: "0.01", min: "0.01" })), O.appendChild(xi("To", "ti-click__to-scale", A, { step: "0.01", min: "0.01" })), g.appendChild(O);
      const M = document.createElement("p");
      M.classList.add("idle-anim__hint"), M.textContent = "1.0 = original size. Scales from center.", g.appendChild(M);
    } else {
      const I = C.attribute ?? $i.attribute, A = C.from ?? $i.from, O = C.to ?? $i.to;
      g.appendChild(Ni(
        "Attribute",
        "ti-click__attribute",
        vm.map(($) => ({ value: $.value, label: $.label, selected: $.value === I }))
      ));
      const M = document.createElement("div");
      M.classList.add("idle-anim__range-row"), M.appendChild(xi("From", "ti-click__from", A, { step: "0.01" })), M.appendChild(xi("To", "ti-click__to", O, { step: "0.01" })), g.appendChild(M);
    }
  }
  c(p, "renderTypeFields"), p(t, n);
  const y = n.period ?? (t === "tile-tint" ? Hi.period : $i.period), v = n.easing ?? "easeOutCubic";
  m.appendChild(xi("Period (ms)", "ti-click__period", y, { min: "50", step: "50" })), m.appendChild(Ni(
    "Easing",
    "ti-click__easing",
    r.map((w) => ({ value: w, label: w, selected: w === v }))
  )), a.appendChild(m);
  const b = a.querySelector(".ti-click__type");
  return b == null || b.addEventListener("change", () => {
    const w = b.value;
    p(w, w === "tile-tint" ? Hi : w === "tile-scale" ? Pa : $i);
  }), o.addEventListener("click", (w) => {
    if (!w.target.closest(".idle-anim__slot-remove") && (a.classList.toggle("is-collapsed"), a.classList.contains("is-collapsed"))) {
      const C = Em(a);
      C && (u.textContent = xu(C));
    }
  }), d.addEventListener("click", (w) => {
    w.stopPropagation();
    const C = a.parentElement;
    a.remove(), C && ss(C, "ti-click-slot", "Animation");
  }), gm(a, { dropGroup: "click" }), a;
}
c($u, "buildClickSlot");
function Em(n) {
  var u, d, m, f, g, p, y, v, b, w, C, I, A, O;
  const e = ((u = n.querySelector(".ti-click__type")) == null ? void 0 : u.value) ?? "tile-prop", t = ((d = n.querySelector(".ti-click__mode")) == null ? void 0 : d.value) ?? "bounce", i = Number.parseInt((m = n.querySelector(".ti-click__period")) == null ? void 0 : m.value, 10), r = ((f = n.querySelector(".ti-click__easing")) == null ? void 0 : f.value) ?? "easeOutCubic";
  if (!i || i <= 0) return null;
  const a = { mode: t, period: i, easing: r };
  if (e === "tile-tint") {
    const M = ((g = n.querySelector(".ti-click__from-color")) == null ? void 0 : g.value) ?? ((p = n.querySelector(".ti-click__from-color-text")) == null ? void 0 : p.value) ?? Hi.fromColor, $ = ((y = n.querySelector(".ti-click__to-color")) == null ? void 0 : y.value) ?? ((v = n.querySelector(".ti-click__to-color-text")) == null ? void 0 : v.value) ?? Hi.toColor, j = ((b = n.querySelector(".ti-click__color-mode")) == null ? void 0 : b.value) ?? "oklch";
    return { type: "tile-tint", fromColor: M, toColor: $, mode: j, ...a };
  }
  if (e === "tile-scale") {
    const M = Number.parseFloat((w = n.querySelector(".ti-click__from-scale")) == null ? void 0 : w.value), $ = Number.parseFloat((C = n.querySelector(".ti-click__to-scale")) == null ? void 0 : C.value);
    return Number.isNaN(M) || Number.isNaN($) || M <= 0 || $ <= 0 ? null : { type: "tile-scale", fromScale: M, toScale: $, ...a };
  }
  const o = ((I = n.querySelector(".ti-click__attribute")) == null ? void 0 : I.value) ?? $i.attribute, s = Number.parseFloat((A = n.querySelector(".ti-click__from")) == null ? void 0 : A.value), l = Number.parseFloat((O = n.querySelector(".ti-click__to")) == null ? void 0 : O.value);
  return Number.isNaN(s) || Number.isNaN(l) ? null : { type: "tile-prop", attribute: o, from: s, to: l, ...a };
}
c(Em, "readClickSlot");
function ss(n, e, t) {
  n.querySelectorAll(`.${e}`).forEach((r, a) => {
    r.dataset.index = String(a);
    const o = r.querySelector(".idle-anim__slot-title");
    o && (o.textContent = `${t} ${a + 1}`);
  });
}
c(ss, "renumberSlots");
function xs(n, { heading: e, hint: t, configs: i, slotClass: r, titlePrefix: a, dropGroup: o, defaultEffect: s, addLabel: l }) {
  const u = document.createElement("h3");
  u.classList.add("ti-section-heading"), u.textContent = e, n.appendChild(u);
  const d = document.createElement("p");
  d.classList.add("idle-anim__hint"), d.textContent = t, n.appendChild(d);
  const m = document.createElement("div");
  m.classList.add("idle-anim__slots", `${r}s`);
  for (let p = 0; p < i.length; p++)
    m.appendChild(Nu(i[p], p, r, a));
  n.appendChild(m);
  const f = ["ti-always-slot", "ti-idle-slot", "ti-hover-slot"];
  pm(m, {
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
    const p = m.querySelectorAll(`.${r}`).length, y = Nu(s, p, r, a);
    y.classList.remove("is-collapsed"), m.appendChild(y);
  }), n.appendChild(g), m;
}
c(xs, "buildEffectCategory");
function iv(n) {
  const e = Lc(n) ?? { always: [], idle: [], hover: [], click: [] }, t = document.createElement("section");
  t.classList.add("eidolon-tile-interactions"), xs(t, {
    heading: "Always",
    hint: "Runs continuously, ignores pointer state.",
    configs: e.always ?? [],
    slotClass: "ti-always-slot",
    titlePrefix: "Effect",
    dropGroup: "effect",
    defaultEffect: { name: "embers" },
    addLabel: "Add Effect"
  }), xs(t, {
    heading: "Idle",
    hint: "Plays by default. Stops when pointer enters the tile.",
    configs: e.idle ?? [],
    slotClass: "ti-idle-slot",
    titlePrefix: "Effect",
    dropGroup: "effect",
    defaultEffect: { name: "float" },
    addLabel: "Add Idle Effect"
  }), xs(t, {
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
    o.appendChild($u(a[d], d));
  t.appendChild(o), pm(o, {
    dropGroup: "click",
    onDrop() {
      ss(o, "ti-click-slot", "Animation");
    }
  });
  const s = document.createElement("button");
  s.type = "button", s.classList.add("idle-anim__add"), s.innerHTML = '<i class="fa-solid fa-plus"></i> Add Animation', s.addEventListener("click", () => {
    const d = o.querySelectorAll(".ti-click-slot").length, m = $u(Pa, d);
    m.classList.remove("is-collapsed"), o.appendChild(m);
  }), t.appendChild(s);
  const l = document.createElement("div");
  l.classList.add("idle-anim__actions");
  const u = document.createElement("button");
  return u.type = "button", u.classList.add("idle-anim__preview"), u.innerHTML = '<i class="fa-solid fa-play"></i> Preview', l.append(u), t.appendChild(l), t;
}
c(iv, "buildSectionContent");
function $s(n, e) {
  const t = [];
  for (const i of n.querySelectorAll(`.${e}`)) {
    const r = wm(i);
    r && t.push(r);
  }
  return t;
}
c($s, "readAllEffectSlots");
function rv(n) {
  const e = [];
  for (const t of n.querySelectorAll(".ti-click-slot")) {
    const i = Em(t);
    i && e.push(i);
  }
  return e;
}
c(rv, "readAllClickConfigs");
function Fu(n) {
  return {
    always: $s(n, "ti-always-slot"),
    idle: $s(n, "ti-idle-slot"),
    hover: $s(n, "ti-hover-slot"),
    click: rv(n)
  };
}
c(Fu, "readFormConfig");
function av(n, e) {
  var l;
  const t = Kt(e);
  if (!t) return;
  const i = tv(n);
  if (!i) return;
  const r = tf(n, t, Qb, "Animations", Zb);
  if (!r || r.querySelector(".eidolon-tile-interactions")) return;
  const a = r.closest("form");
  a && (a.noValidate = !0);
  const o = iv(i);
  r.appendChild(o), (l = n.setPosition) == null || l.call(n, { height: "auto" });
  const s = r.querySelector(".idle-anim__preview");
  s == null || s.addEventListener("click", () => {
    const u = i.object;
    if (!u) return;
    if (vn) {
      vn.detach(), vn = null, s.classList.remove("is-active"), s.innerHTML = '<i class="fa-solid fa-play"></i> Preview';
      return;
    }
    const d = Fu(o);
    (d.always.length > 0 || d.idle.length > 0 || d.hover.length > 0) && (vn = new Ti(u, d), vn.start("idle"), s.classList.add("is-active"), s.innerHTML = '<i class="fa-solid fa-stop"></i> Stop');
  }), a && a.addEventListener("submit", () => {
    vn && (vn.detach(), vn = null);
    const u = Fu(o), d = u.always.length > 0 || u.idle.length > 0 || u.hover.length > 0 || u.click.length > 0, m = {
      [`flags.${pa}.-=${Mu}`]: null,
      [`flags.${pa}.-=${Jb}`]: null,
      [`flags.${pa}.-=${Xb}`]: null
    };
    i.update(m).then(() => {
      if (d)
        return i.update({ [`flags.${pa}.${Mu}`]: u });
    });
  });
}
c(av, "renderAnimationSection");
const ho = /* @__PURE__ */ new Map();
function Sm(n) {
  const e = ho.get(n);
  e && (e.controller.abort(), ho.delete(n), e.restore());
}
c(Sm, "stopLoopByKey");
function Cm(n) {
  const e = `${n}::`;
  for (const t of [...ho.keys()])
    t.startsWith(e) && Sm(t);
}
c(Cm, "stopLoopsForTile");
function Tm() {
  for (const n of [...ho.keys()])
    Sm(n);
}
c(Tm, "stopAllLoops");
const ov = "eidolon-utilities", sv = ["tile-animations", "tile-interactions", "idle-animation"];
function lv() {
  Tm(), mm();
}
c(lv, "onCanvasTearDown");
function cv() {
  Tm(), mm();
}
c(cv, "onCanvasReady");
function uv(n, e) {
  var r;
  const t = (r = e == null ? void 0 : e.flags) == null ? void 0 : r[ov];
  !t || !sv.some((a) => a in t || `-=${a}` in t) || (Cm(n.id), Yb(n));
}
c(uv, "onUpdateTile");
function dv(n) {
  Cm(n.id), hm(n);
}
c(dv, "onDeleteTile");
function fv(n, e) {
  av(n, e);
}
c(fv, "onRenderTileConfig");
function mv() {
  Hooks.on("canvasTearDown", lv), Hooks.on("canvasReady", cv), Hooks.on("updateTile", uv), Hooks.on("deleteTile", dv), Hooks.on("renderTileConfig", fv);
}
c(mv, "registerTileInteractionHooks");
mv();
//# sourceMappingURL=eidolon-utilities.js.map
