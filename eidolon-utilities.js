var Fc = Object.defineProperty;
var km = Object.getPrototypeOf;
var Mm = Reflect.get;
var Dc = (t) => {
  throw TypeError(t);
};
var _m = (t, e, n) => e in t ? Fc(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var c = (t, e) => Fc(t, "name", { value: e, configurable: !0 });
var pe = (t, e, n) => _m(t, typeof e != "symbol" ? e + "" : e, n), os = (t, e, n) => e.has(t) || Dc("Cannot " + n);
var m = (t, e, n) => (os(t, e, "read from private field"), n ? n.call(t) : e.get(t)), k = (t, e, n) => e.has(t) ? Dc("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, n), I = (t, e, n, i) => (os(t, e, "write to private field"), i ? i.call(t, n) : e.set(t, n), n), C = (t, e, n) => (os(t, e, "access private method"), n);
var ss = (t, e, n, i) => ({
  set _(r) {
    I(t, e, r, n);
  },
  get _() {
    return m(t, e, i);
  }
}), Re = (t, e, n) => Mm(km(t), n, e);
const T = "eidolon-utilities", Pa = "timeTriggerActive", ks = "timeTriggerHideWindow", Ms = "timeTriggerShowPlayerWindow", _s = "timeTriggerAllowRealTime", Ju = "timeTriggers", ya = "timeTriggerHistory", Ns = "debug", $s = "timeFormat", xs = "manageTime", Fs = "secondsPerRound";
const Nm = [-30, -15, -5, 5, 15, 30], Pi = 1440 * 60, ba = "playSound", Jr = 6;
function S(t, e) {
  var n, i;
  return (i = (n = game.i18n) == null ? void 0 : n.has) != null && i.call(n, t) ? game.i18n.localize(t) : e;
}
c(S, "localize");
function _t(t) {
  return typeof t != "string" ? "" : t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
c(_t, "escapeHtml");
function Wt(t) {
  var e;
  return t == null ? t : (e = foundry == null ? void 0 : foundry.utils) != null && e.duplicate ? foundry.utils.duplicate(t) : JSON.parse(JSON.stringify(t));
}
c(Wt, "duplicateData");
function $m() {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
c($m, "generateTriggerId");
function Xu(t) {
  if (typeof t != "string") return null;
  const e = t.trim();
  if (!e) return null;
  const n = e.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (!n) return null;
  const i = Number(n[1]), r = Number(n[2]), a = n[3] !== void 0 ? Number(n[3]) : 0;
  return !Number.isInteger(i) || !Number.isInteger(r) || !Number.isInteger(a) || i < 0 || i > 23 || r < 0 || r > 59 || a < 0 || a > 59 ? null : i * 3600 + r * 60 + a;
}
c(Xu, "parseTriggerTimeToSeconds");
function sr() {
  var t, e;
  return ((t = game.scenes) == null ? void 0 : t.current) ?? ((e = game.scenes) == null ? void 0 : e.active) ?? null;
}
c(sr, "getActiveScene");
function Yt(t) {
  return (t == null ? void 0 : t.object) ?? (t == null ? void 0 : t.document) ?? null;
}
c(Yt, "getSceneFromApplication");
function Ye(t) {
  return t && typeof t.getFlag == "function" && typeof t.setFlag == "function";
}
c(Ye, "hasSceneDocument");
const Ds = /* @__PURE__ */ new Set(), Ps = /* @__PURE__ */ new Set(), Rs = /* @__PURE__ */ new Set(), Hs = /* @__PURE__ */ new Set();
let bi = !1, Tr = !1, Ra = Jr, Ha = "12h", Pc = !1;
function ls(t) {
  bi = !!t;
  for (const e of Ds)
    try {
      e(bi);
    } catch (n) {
      console.error(`${T} | Debug change handler failed`, n);
    }
}
c(ls, "notifyDebugChange");
function cs(t) {
  Tr = !!t;
  for (const e of Ps)
    try {
      e(Tr);
    } catch (n) {
      console.error(`${T} | Manage time change handler failed`, n);
    }
}
c(cs, "notifyManageTimeChange");
function Qu(t) {
  return t === "24h" ? "24h" : "12h";
}
c(Qu, "normalizeTimeFormatValue");
function tc(t) {
  const e = Number(t);
  return !Number.isFinite(e) || e <= 0 ? Jr : e;
}
c(tc, "normalizeSecondsPerRoundValue");
function us(t) {
  const e = tc(t);
  Ra = e;
  for (const n of Rs)
    try {
      n(e);
    } catch (i) {
      console.error(`${T} | Seconds-per-round change handler failed`, i);
    }
}
c(us, "notifySecondsPerRoundChange");
function ds(t) {
  const e = Qu(t);
  Ha = e;
  for (const n of Hs)
    try {
      n(e);
    } catch (i) {
      console.error(`${T} | Time format change handler failed`, i);
    }
}
c(ds, "notifyTimeFormatChange");
function xm() {
  var e;
  if (Pc) return;
  if (Pc = !0, !((e = game == null ? void 0 : game.settings) != null && e.register)) {
    console.warn(
      `${T} | game.settings.register is unavailable. Module settings could not be registered.`
    );
    return;
  }
  const t = typeof game.settings.registerChange == "function";
  game.settings.register(T, Ns, {
    name: S("EIDOLON.TimeTrigger.DebugSettingName", "Enable debug logging"),
    hint: S(
      "EIDOLON.TimeTrigger.DebugSettingHint",
      "Write detailed time-trigger diagnostics to the browser console."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: t ? void 0 : ls
  }), t && game.settings.registerChange(T, Ns, ls), bi = nc(), ls(bi), game.settings.register(T, xs, {
    name: S("EIDOLON.TimeTrigger.ManageTimeSettingName", "Manage Game Time"),
    hint: S(
      "EIDOLON.TimeTrigger.ManageTimeSettingHint",
      "Allow Eidolon Utilities to advance world time automatically while the game is unpaused. Warning: This may conflict with other time-management modules."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: t ? void 0 : cs
  }), t && game.settings.registerChange(T, xs, cs), Tr = Dm(), cs(Tr), game.settings.register(T, Fs, {
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
    default: Jr,
    range: { min: 1, max: 3600, step: 1 },
    onChange: t ? void 0 : us
  }), t && game.settings.registerChange(
    T,
    Fs,
    us
  ), Ra = tc(Pm()), us(Ra), game.settings.register(T, $s, {
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
    onChange: t ? void 0 : ds
  }), t && game.settings.registerChange(T, $s, ds), Ha = Qu(Zu()), ds(Ha);
}
c(xm, "registerTimeTriggerSettings");
function nc() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return !!game.settings.get(T, Ns);
  } catch (e) {
    console.error(`${T} | Failed to read debug setting`, e);
  }
  return !1;
}
c(nc, "getDebugSetting");
function Fm() {
  return bi = nc(), bi;
}
c(Fm, "refreshDebugSettingCache");
function Dm() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return !!game.settings.get(T, xs);
  } catch (e) {
    console.error(`${T} | Failed to read manage time setting`, e);
  }
  return !1;
}
c(Dm, "getManageTimeSetting");
function Zu() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return game.settings.get(T, $s) === "24h" ? "24h" : "12h";
  } catch (e) {
    console.error(`${T} | Failed to read time format setting`, e);
  }
  return "12h";
}
c(Zu, "getTimeFormatSetting");
function Pm() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get) {
      const e = game.settings.get(T, Fs);
      return tc(e);
    }
  } catch (e) {
    console.error(`${T} | Failed to read seconds-per-round setting`, e);
  }
  return Jr;
}
c(Pm, "getSecondsPerRoundSetting");
function Rm(t) {
  if (typeof t != "function")
    return () => {
    };
  Ds.add(t);
  try {
    t(bi);
  } catch (e) {
    console.error(`${T} | Debug change handler failed`, e);
  }
  return () => {
    Ds.delete(t);
  };
}
c(Rm, "onDebugSettingChange");
function ed(t) {
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
c(ed, "onManageTimeSettingChange");
function ic(t) {
  if (typeof t != "function")
    return () => {
    };
  Hs.add(t);
  try {
    t(Ha);
  } catch (e) {
    console.error(`${T} | Time format change handler failed`, e);
  }
  return () => {
    Hs.delete(t);
  };
}
c(ic, "onTimeFormatSettingChange");
function Hm(t) {
  if (typeof t != "function")
    return () => {
    };
  Rs.add(t);
  try {
    t(Ra);
  } catch (e) {
    console.error(`${T} | Seconds-per-round change handler failed`, e);
  }
  return () => {
    Rs.delete(t);
  };
}
c(Hm, "onSecondsPerRoundSettingChange");
let jo = !1, qs = !1;
function js(t) {
  jo = !!t;
}
c(js, "updateDebugState");
function td() {
  qs || (qs = !0, js(nc()), Rm((t) => {
    js(t), console.info(`${T} | Debug ${jo ? "enabled" : "disabled"}`);
  }));
}
c(td, "ensureInitialized");
function rc() {
  return qs || td(), jo;
}
c(rc, "shouldLog");
function nd(t) {
  if (!t.length)
    return [`${T} |`];
  const [e, ...n] = t;
  return typeof e == "string" ? [`${T} | ${e}`, ...n] : [`${T} |`, e, ...n];
}
c(nd, "formatArgs");
function qm() {
  td();
}
c(qm, "initializeDebug");
function jm() {
  return js(Fm()), jo;
}
c(jm, "syncDebugState");
function _(...t) {
  rc() && console.debug(...nd(t));
}
c(_, "debugLog");
function Wi(...t) {
  rc() && console.group(...nd(t));
}
c(Wi, "debugGroup");
function $n() {
  rc() && console.groupEnd();
}
c($n, "debugGroupEnd");
function Ri(t) {
  var r;
  const e = (r = t == null ? void 0 : t.getFlag) == null ? void 0 : r.call(t, T, Ju);
  if (!e) return [];
  const n = Wt(e), i = Array.isArray(n) ? n : [];
  return _("Loaded time triggers", {
    sceneId: (t == null ? void 0 : t.id) ?? null,
    count: i.length
  }), i;
}
c(Ri, "getTimeTriggers");
async function id(t, e) {
  t != null && t.setFlag && (_("Persisting time triggers", {
    sceneId: t.id,
    count: Array.isArray(e) ? e.length : 0
  }), await t.setFlag(T, Ju, e));
}
c(id, "setTimeTriggers");
function Bm(t) {
  var r;
  const e = (r = t == null ? void 0 : t.getFlag) == null ? void 0 : r.call(t, T, ya);
  if (!e) return {};
  const n = Wt(e);
  if (!n || typeof n != "object") return {};
  const i = {};
  for (const [a, o] of Object.entries(n))
    typeof o == "number" && Number.isFinite(o) && (i[a] = o);
  return _("Loaded time trigger history", {
    sceneId: (t == null ? void 0 : t.id) ?? null,
    keys: Object.keys(i)
  }), i;
}
c(Bm, "getTimeTriggerHistory");
async function fs(t, e) {
  var l, u, d, h;
  if (!t) return;
  const n = {};
  if (e && typeof e == "object")
    for (const [f, g] of Object.entries(e))
      typeof g == "number" && Number.isFinite(g) && (n[f] = g);
  const i = ((l = t.getFlag) == null ? void 0 : l.call(t, T, ya)) ?? {}, r = {};
  if (i && typeof i == "object")
    for (const [f, g] of Object.entries(i))
      typeof g == "number" && Number.isFinite(g) && (r[f] = g);
  const a = Object.keys(n), o = Object.keys(r);
  if (typeof ((u = foundry == null ? void 0 : foundry.utils) == null ? void 0 : u.deepEqual) == "function" ? foundry.utils.deepEqual(r, n) : JSON.stringify(r) === JSON.stringify(n)) {
    _("Skip history update because state is unchanged", {
      sceneId: (t == null ? void 0 : t.id) ?? null
    });
    return;
  }
  _("Updating time trigger history", {
    sceneId: (t == null ? void 0 : t.id) ?? null,
    keys: a,
    removedKeys: o.filter((f) => !a.includes(f))
  });
  try {
    o.length && typeof t.unsetFlag == "function" && await t.unsetFlag(T, ya), a.length && await t.setFlag(T, ya, n);
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
c(fs, "updateTimeTriggerHistory");
const qa = /* @__PURE__ */ new Map(), Rc = /* @__PURE__ */ new Set();
function Um(t) {
  if (!(t != null && t.id))
    throw new Error(`${T} | Action definitions require an id.`);
  if (qa.has(t.id))
    throw new Error(`${T} | Duplicate time trigger action id: ${t.id}`);
  qa.set(t.id, {
    ...t
  }), _("Registered time trigger action", { actionId: t.id });
}
c(Um, "registerAction");
function Xr(t) {
  return qa.get(t) ?? null;
}
c(Xr, "getAction");
function Vm(t) {
  const e = Xr(t);
  return e ? typeof e.label == "function" ? e.label() : e.label : t;
}
c(Vm, "getActionLabel");
function Hc() {
  return Array.from(qa.values());
}
c(Hc, "listActions");
async function rd(t, e) {
  var i, r;
  const n = Xr(e == null ? void 0 : e.action);
  if (!n || typeof n.execute != "function") {
    const a = S(
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
    actionId: n.id,
    triggerId: (e == null ? void 0 : e.id) ?? null,
    sceneId: (t == null ? void 0 : t.id) ?? null
  }), await n.execute({ scene: t, trigger: e });
}
c(rd, "executeTriggerAction");
function Gm(t) {
  const e = Xr(t == null ? void 0 : t.action);
  return !e || typeof e.buildSummaryParts != "function" ? [] : e.buildSummaryParts({ trigger: t, escapeHtml: _t, localize: S }) ?? [];
}
c(Gm, "buildActionSummaryParts");
function zm(t) {
  const e = Xr(t == null ? void 0 : t.action);
  return !e || typeof e.buildFormContent != "function" ? "" : e.buildFormContent({ trigger: t, escapeHtml: _t, localize: S }) ?? "";
}
c(zm, "buildActionFormSection");
function Wm(t, e) {
  const n = Xr(t == null ? void 0 : t.action);
  !n || typeof n.prepareFormData != "function" || n.prepareFormData({ trigger: t, formData: e });
}
c(Wm, "applyActionFormData");
function Ym(t, e, n) {
  var a, o;
  const i = `${(t == null ? void 0 : t.id) ?? "unknown"}:${(e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.action) ?? "unknown"}:${n}`;
  if (Rc.has(i)) return;
  Rc.add(i);
  const r = S(
    "EIDOLON.TimeTrigger.MissingDataWarning",
    "A scene time trigger is missing required data and was skipped."
  );
  (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, r), console.warn(`${T} | Missing trigger data (${n})`, { scene: t == null ? void 0 : t.id, trigger: e });
}
c(Ym, "warnMissingTriggerData");
async function Km({ scene: t, trigger: e }) {
  var a, o, s, l, u;
  const n = (s = (o = (a = e == null ? void 0 : e.data) == null ? void 0 : a.path) == null ? void 0 : o.trim) == null ? void 0 : s.call(o);
  if (!n) {
    Ym(t, e, "missing-audio-path");
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
c(Km, "executePlaySoundAction");
Um({
  id: ba,
  label: /* @__PURE__ */ c(() => S("EIDOLON.TimeTrigger.ActionPlaySound", "Play Sound"), "label"),
  execute: Km,
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
var Uu;
const { ApplicationV2: Un, HandlebarsApplicationMixin: Vn } = ((Uu = foundry.applications) == null ? void 0 : Uu.api) ?? {};
if (!Un || !Vn)
  throw new Error(
    `${T} | ApplicationV2 API unavailable. Update Foundry VTT to v13 or newer.`
  );
const Pn = "AM", vi = "PM";
function xn() {
  return Zu();
}
c(xn, "getConfiguredTimeFormat");
function Bo(t) {
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
c(Bo, "parseCanonicalTimeString");
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
function Jm(t, { format: e } = {}) {
  if (!t || typeof t != "object") return null;
  const n = Number(t.hour), i = Number(t.minute), r = t.second !== void 0 && t.second !== null, a = r ? Number(t.second) : null, o = r && Number.isFinite(a) ? Math.floor(Math.max(0, Math.min(59, a))) : null;
  if (!Number.isFinite(n) || !Number.isFinite(i)) return null;
  const s = e ?? xn();
  return ja(
    {
      hours: n,
      minutes: i,
      seconds: o
    },
    s
  );
}
c(Jm, "formatTimeComponentsForDisplay");
function Xm(t, { format: e } = {}) {
  const n = Bo(t);
  if (!n) return "";
  const i = e ?? xn();
  return ja(n, i);
}
c(Xm, "formatTriggerTimeForDisplay");
function ja(t, e = "12h") {
  if (!t) return "";
  const { hours: n, minutes: i, seconds: r = null } = t;
  if (!Number.isInteger(n) || !Number.isInteger(i)) return "";
  const a = Number.isInteger(r);
  if (e === "24h") {
    const f = `${String(n).padStart(2, "0")}:${String(i).padStart(2, "0")}`;
    return a ? `${f}:${String(r).padStart(2, "0")}` : f;
  }
  const o = n >= 12 ? vi : Pn, s = n % 12 === 0 ? 12 : n % 12, l = String(s), u = String(i).padStart(2, "0"), d = `${l}:${u}`, h = o === Pn ? S("EIDOLON.TimeTrigger.TimePeriodAM", Pn) : S("EIDOLON.TimeTrigger.TimePeriodPM", vi);
  if (a) {
    const f = String(r).padStart(2, "0");
    return `${d}:${f} ${h}`;
  }
  return `${d} ${h}`;
}
c(ja, "formatTimeParts");
function qc(t, e = xn()) {
  const n = Bo(t);
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
      period: Pn
    };
  const i = n.hours >= 12 ? vi : Pn, r = n.hours % 12 === 0 ? 12 : n.hours % 12;
  return {
    format: e,
    canonical: Vt(n) ?? "",
    hour: String(r),
    minute: String(n.minutes).padStart(2, "0"),
    period: i
  };
}
c(qc, "getTimeFormValues");
function Qm({ hour: t, minute: e, period: n, time: i }, r = xn()) {
  if (r === "24h") {
    const g = typeof t == "string" ? t.trim() : "", p = typeof e == "string" ? e.trim() : "", y = typeof i == "string" ? i.trim() : "";
    if (!g && !p && y) {
      const E = Bo(y);
      return E ? { canonical: Vt(E) ?? "", error: null } : {
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
    const b = Number(g), v = Number(p);
    return !Number.isInteger(b) || b < 0 || b > 23 ? {
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
    } : { canonical: Vt({
      hours: b,
      minutes: v
    }) ?? "", error: null };
  }
  const a = typeof t == "string" ? t.trim() : "", o = typeof e == "string" ? e.trim() : "", s = typeof n == "string" ? n.trim().toUpperCase() : "";
  if (!a || !o || !s)
    return { canonical: "", error: S("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.") };
  if (s !== Pn && s !== vi)
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
    hours: s === vi ? d + 12 : d,
    minutes: u
  };
  return {
    canonical: Vt(f) ?? "",
    error: null
  };
}
c(Qm, "normalizeFormTimeInput");
function Zm() {
  return [
    {
      value: Pn,
      label: S("EIDOLON.TimeTrigger.TimePeriodAM", Pn)
    },
    {
      value: vi,
      label: S("EIDOLON.TimeTrigger.TimePeriodPM", vi)
    }
  ];
}
c(Zm, "getPeriodOptions");
var ni, ii, re, ad, fo, mo, od, Us, Vs, ho, go, sd, ld, cd, Gs, zs, Ws, po, yo, Ys, bo, ud, dd;
const ei = class ei extends Vn(Un) {
  constructor(n = {}) {
    var o;
    const { scene: i, showControls: r, ...a } = n ?? {};
    super(a);
    k(this, re);
    k(this, ni, null);
    k(this, ii, null);
    k(this, fo, /* @__PURE__ */ c((n) => {
      var r, a;
      n.preventDefault();
      const i = Number((a = (r = n.currentTarget) == null ? void 0 : r.dataset) == null ? void 0 : a.delta);
      Number.isFinite(i) && (_("Time delta button clicked", { delta: i }), this._advanceTime(i));
    }, "#onDeltaClick"));
    k(this, mo, /* @__PURE__ */ c((n) => {
      var i, r;
      n.preventDefault(), !(!this.showControls || !((i = game.user) != null && i.isGM)) && (_("Time value double clicked", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null }), C(this, re, od).call(this));
    }, "#onTimeDoubleClick"));
    k(this, ho, /* @__PURE__ */ c((n) => {
      if (this.isEditingTime && !this._commitTimeInProgress)
        if (n.key === "Enter") {
          n.preventDefault();
          const i = n.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
          C(this, re, Vs).call(this, r);
        } else n.key === "Escape" && (n.preventDefault(), C(this, re, Us).call(this));
    }, "#onTimeInputKeydown"));
    k(this, go, /* @__PURE__ */ c((n) => {
      if (!this.isEditingTime || this._commitTimeInProgress || this._suppressBlurCommit) return;
      const i = n.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
      C(this, re, Vs).call(this, r);
    }, "#onTimeInputBlur"));
    k(this, po, /* @__PURE__ */ c((n) => {
      const i = !!n;
      if (this.manageTimeEnabled === i) return;
      this.manageTimeEnabled = i, (this.rendered ?? this.isRendered ?? !1) && this.render({ force: !0 });
    }, "#handleManageTimeChange"));
    k(this, yo, /* @__PURE__ */ c(async (n) => {
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
        await i.setFlag(T, _s, r), this.sceneAllowsRealTime = r;
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
    k(this, bo, /* @__PURE__ */ c(() => {
      (this.rendered ?? this.isRendered ?? !1) && (this.isEditingTime && (this.editValue = C(this, re, Gs).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    this.scene = i ?? null, this.showControls = typeof r == "boolean" ? r : !!((o = game.user) != null && o.isGM), this.isEditingTime = !1, this.editValue = "", this._commitTimeInProgress = !1, this._suppressBlurCommit = !1, this.manageTimeEnabled = !1, this.sceneAllowsRealTime = C(this, re, Ys).call(this), I(this, ni, ic(m(this, bo))), I(this, ii, ed(m(this, po)));
  }
  async _prepareContext() {
    var v, w;
    const n = ((v = game.time) == null ? void 0 : v.components) ?? {}, r = ((n == null ? void 0 : n.second) !== void 0 && (n == null ? void 0 : n.second) !== null ? Jm(n) : null) ?? C(this, re, ad).call(this), a = xn(), o = a === "24h", s = o ? S("EIDOLON.TimeTrigger.EditTimePlaceholder24", "HH:MM") : S("EIDOLON.TimeTrigger.EditTimePlaceholder12", "HH:MM AM/PM"), l = this.showControls ? S(
      "EIDOLON.TimeTrigger.EditTimeHint",
      "Double-click to set a specific time."
    ) : "", u = this.showControls ? S(
      "EIDOLON.TimeTrigger.EditTimeLabel",
      "New time (HH:MM or HH:MM AM/PM)"
    ) : "", d = Nm.map((E) => ({
      minutes: E,
      label: E > 0 ? `+${E}` : `${E}`
    })), h = !!this.manageTimeEnabled, f = C(this, re, Ys).call(this);
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
      return (this.rendered ?? this.isRendered ?? !1) || (_("TimeTriggerWindow close request rerendering", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null
      }), this.render({ force: !0 })), this;
    _("Closing time trigger window", { sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null, force: !0 });
    const i = await super.close(n);
    return C(this, re, ud).call(this), C(this, re, dd).call(this), i;
  }
  async _advanceTime(n) {
    var r, a, o, s, l, u, d;
    const i = n * 60;
    if (_("Advancing world time", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null, minutes: n, seconds: i }), !((a = game.user) != null && a.isGM)) {
      (s = (o = ui.notifications) == null ? void 0 : o.warn) == null || s.call(o, S("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time."));
      return;
    }
    try {
      await game.time.advance(i);
    } catch (h) {
      console.error(`${T} | Failed to advance time`, h), (u = (l = ui.notifications) == null ? void 0 : l.error) == null || u.call(
        l,
        S("EIDOLON.TimeTrigger.Error", "Failed to update the world time.")
      ), _("Failed to advance time from window", {
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
        _("Binding time trigger interactions", {
          sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
          buttonCount: r.querySelectorAll("[data-delta]").length
        }), r.querySelectorAll("[data-delta]").forEach((u) => {
          u.addEventListener("click", m(this, fo));
        });
        const o = r.querySelector('.time-trigger-window__time-value[data-editable="true"]');
        o && o.addEventListener("dblclick", m(this, mo), { once: !1 });
        const s = r.querySelector(".time-trigger-window__time-input");
        s && (s.addEventListener("keydown", m(this, ho)), s.addEventListener("blur", m(this, go)), typeof s.focus == "function" && (s.focus(), typeof s.select == "function" && s.select()));
        const l = r.querySelector('[data-action="toggle-real-time"]');
        l && l.addEventListener("click", m(this, yo));
      }
      this._suppressBlurCommit = !1;
    }
  }
};
ni = new WeakMap(), ii = new WeakMap(), re = new WeakSet(), ad = /* @__PURE__ */ c(function() {
  var l;
  const n = (l = game.time) == null ? void 0 : l.worldTime;
  if (typeof n != "number" || !Number.isFinite(n)) return "";
  const i = 1440 * 60, r = (Math.floor(n) % i + i) % i, a = Math.floor(r / 3600), o = Math.floor(r % 3600 / 60), s = r % 60;
  return ja({ hours: a, minutes: o, seconds: s }, xn());
}, "#formatFallbackTime"), fo = new WeakMap(), mo = new WeakMap(), od = /* @__PURE__ */ c(function() {
  var n;
  (n = game.user) != null && n.isGM && (this.isEditingTime = !0, this._suppressBlurCommit = !1, this.editValue = C(this, re, Gs).call(this), this.render({ force: !0 }));
}, "#enterTimeEditMode"), Us = /* @__PURE__ */ c(function() {
  this.isEditingTime = !1, this.editValue = "", this._suppressBlurCommit = !1, this.render({ force: !0 });
}, "#cancelTimeEdit"), Vs = /* @__PURE__ */ c(async function(n) {
  var a, o, s;
  if (!((a = game.user) != null && a.isGM) || !this.isEditingTime || this._commitTimeInProgress) return;
  this._commitTimeInProgress = !0;
  const i = typeof n == "string" ? n.trim() : "";
  if (!i) {
    C(this, re, Us).call(this), this._commitTimeInProgress = !1;
    return;
  }
  const r = C(this, re, cd).call(this, i);
  if (r.error) {
    (s = (o = ui.notifications) == null ? void 0 : o.error) == null || s.call(o, r.error), this._suppressBlurCommit = !0, this.editValue = i, this.render({ force: !0 }), this._commitTimeInProgress = !1;
    return;
  }
  try {
    await C(this, re, ld).call(this, r.seconds, r.includeSeconds) ? (this.isEditingTime = !1, this.editValue = "", this.render({ force: !0 })) : (this.editValue = i, this.render({ force: !0 }));
  } finally {
    this._commitTimeInProgress = !1;
  }
}, "#commitTimeInput"), ho = new WeakMap(), go = new WeakMap(), sd = /* @__PURE__ */ c(function() {
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
}, "#getCurrentCanonicalTime"), ld = /* @__PURE__ */ c(async function(n, i) {
  var f, g, p, y, b, v, w, E, L, A;
  const r = (f = game.time) == null ? void 0 : f.worldTime;
  if (typeof r != "number" || !Number.isFinite(r))
    return (p = (g = ui.notifications) == null ? void 0 : g.error) == null || p.call(
      g,
      S(
        "EIDOLON.TimeTrigger.EditTimeUnavailable",
        "The world time is unavailable, so it can't be updated."
      )
    ), !1;
  if (!Number.isInteger(n) || n < 0 || n >= Pi)
    return (b = (y = ui.notifications) == null ? void 0 : y.error) == null || b.call(
      y,
      S(
        "EIDOLON.TimeTrigger.EditTimeInvalidRange",
        "Enter a time within the current day."
      )
    ), !1;
  const s = Math.floor(r / Pi) * Pi + n - r;
  if (!Number.isFinite(s) || s === 0)
    return !0;
  const l = Math.floor(n / 3600), u = Math.floor(n % 3600 / 60), d = n % 60, h = Vt({
    hours: l,
    minutes: u,
    seconds: i ? d : void 0
  });
  try {
    _("Updating world time directly", {
      sceneId: ((v = this.scene) == null ? void 0 : v.id) ?? null,
      targetCanonical: h ?? null,
      diff: s
    }), await game.time.advance(s);
    const O = ja(
      {
        hours: l,
        minutes: u,
        seconds: i ? d : null
      },
      xn()
    );
    (E = (w = ui.notifications) == null ? void 0 : w.info) == null || E.call(
      w,
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
}, "#applyTargetSeconds"), cd = /* @__PURE__ */ c(function(n) {
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
        canonical: Vt({ hours: f, minutes: g, seconds: p }),
        seconds: y,
        includeSeconds: p !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const { amLower: o, pmLower: s, periodPattern: l } = C(this, re, zs).call(this), u = r.match(
    new RegExp(
      `^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?\\s*(${l})$`,
      "i"
    )
  );
  if (u) {
    let f = Number(u[1]);
    const g = Number(u[2]), p = u[3] !== void 0 ? Number(u[3]) : void 0, y = u[4] ?? "", b = typeof y == "string" ? ((h = y.toLocaleLowerCase) == null ? void 0 : h.call(y)) ?? y.toLowerCase() : "";
    if (Number.isInteger(f) && f >= 1 && f <= 12 && Number.isInteger(g) && g >= 0 && g <= 59 && (p === void 0 || Number.isInteger(p) && p >= 0 && p <= 59) && (b === o || b === s || b === "am" || b === "pm")) {
      f = f % 12, (b === s || b === "pm") && (f += 12);
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
  const d = Xu(r);
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
  const n = C(this, re, sd).call(this);
  if (!n) return "";
  if (xn() === "24h")
    return n;
  const r = Bo(n);
  if (!r) return n;
  const a = Number(r.hours), o = Number(r.minutes), s = r.seconds !== null && r.seconds !== void 0 ? Number(r.seconds) : void 0;
  if (!Number.isFinite(a) || !Number.isFinite(o)) return n;
  const l = Number.isFinite(s), u = a % 12 === 0 ? 12 : a % 12, d = String(o).padStart(2, "0"), h = l ? `:${String(s).padStart(2, "0")}` : "", { amLabel: f, pmLabel: g } = C(this, re, zs).call(this), p = a >= 12 ? g : f;
  return `${u}:${d}${h} ${p}`.trim();
}, "#getInitialEditValue"), zs = /* @__PURE__ */ c(function() {
  var u, d;
  const n = S("EIDOLON.TimeTrigger.TimePeriodAM", "AM"), i = S("EIDOLON.TimeTrigger.TimePeriodPM", "PM"), r = ((u = n.toLocaleLowerCase) == null ? void 0 : u.call(n)) ?? n.toLowerCase(), a = ((d = i.toLocaleLowerCase) == null ? void 0 : d.call(i)) ?? i.toLowerCase(), o = C(this, re, Ws).call(this, n), s = C(this, re, Ws).call(this, i), l = `${o}|${s}|AM|PM`;
  return {
    amLabel: n,
    pmLabel: i,
    amLower: r,
    pmLower: a,
    periodPattern: l
  };
}, "#getPeriodMatchData"), Ws = /* @__PURE__ */ c(function(n) {
  return typeof n != "string" ? "" : n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}, "#escapeForRegex"), po = new WeakMap(), yo = new WeakMap(), Ys = /* @__PURE__ */ c(function() {
  const n = this.scene;
  if (!n || typeof n.getFlag != "function") return !1;
  try {
    return !!n.getFlag(T, _s);
  } catch (i) {
    _("TimeTriggerWindow | Failed to read scene real-time flag", {
      sceneId: (n == null ? void 0 : n.id) ?? null,
      message: (i == null ? void 0 : i.message) ?? String(i)
    });
  }
  return !1;
}, "#readSceneRealTimeFlag"), bo = new WeakMap(), ud = /* @__PURE__ */ c(function() {
  if (typeof m(this, ni) == "function")
    try {
      m(this, ni).call(this);
    } catch (n) {
      console.error(`${T} | Failed to dispose time format subscription`, n);
    }
  I(this, ni, null);
}, "#disposeTimeFormatSubscription"), dd = /* @__PURE__ */ c(function() {
  if (typeof m(this, ii) == "function")
    try {
      m(this, ii).call(this);
    } catch (n) {
      console.error(`${T} | Failed to dispose manage time subscription`, n);
    }
  I(this, ii, null);
}, "#disposeManageTimeSubscription"), c(ei, "TimeTriggerWindow"), pe(ei, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Re(ei, ei, "DEFAULT_OPTIONS"),
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
)), pe(ei, "PARTS", {
  content: {
    template: `modules/${T}/templates/time-trigger.html`
  }
});
let Bs = ei;
function Uo(t, e = {}) {
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
c(Uo, "createApplicationFactory");
const jc = /* @__PURE__ */ new Set();
var we, Xe, ri, Zi, fd, md;
const Oc = class Oc {
  constructor({ windowFactory: e } = {}) {
    k(this, Zi);
    k(this, we, null);
    k(this, Xe, null);
    k(this, ri);
    const n = Uo(Bs);
    typeof e == "function" ? e.__eidolonFactorySignature === "options" ? I(this, ri, (r, a = {}) => e({ scene: r, ...a ?? {} })) : I(this, ri, e) : I(this, ri, /* @__PURE__ */ c((r, a = {}) => n({ scene: r, ...a ?? {} }), "fallbackFactory"));
  }
  onReady() {
    var n;
    const e = typeof ((n = game.time) == null ? void 0 : n.worldTime) == "number" && Number.isFinite(game.time.worldTime) ? game.time.worldTime : null;
    _("TimeTriggerManager#onReady", { worldTime: e }), e !== null && I(this, Xe, e);
  }
  onCanvasReady(e) {
    const n = (e == null ? void 0 : e.scene) ?? sr();
    _("TimeTriggerManager#onCanvasReady", { sceneId: (n == null ? void 0 : n.id) ?? null }), this.refreshTimeTriggerWindow(n), this.handleTimeTriggerEvaluation(n);
  }
  onUpdateScene(e) {
    const n = sr();
    _("TimeTriggerManager#onUpdateScene", {
      sceneId: (e == null ? void 0 : e.id) ?? null,
      activeSceneId: (n == null ? void 0 : n.id) ?? null
    }), !(!n || e.id !== n.id) && (this.refreshTimeTriggerWindow(e), this.handleTimeTriggerEvaluation(e));
  }
  onUpdateWorldTime(e, n) {
    _("TimeTriggerManager#onUpdateWorldTime", {
      worldTime: e,
      diff: n,
      hasWindow: !!m(this, we)
    }), m(this, we) && m(this, we).render();
    const i = sr(), r = C(this, Zi, fd).call(this, e, n);
    this.handleTimeTriggerEvaluation(i, e, r);
  }
  refreshTimeTriggerWindow(e) {
    var l, u, d;
    if (!e) return;
    const n = !!((l = game.user) != null && l.isGM), i = !!e.getFlag(T, Pa), r = !!e.getFlag(T, ks), a = !!e.getFlag(T, Ms);
    if (_("TimeTriggerManager#refreshTimeTriggerWindow", {
      sceneId: e.id,
      isGM: n,
      isActive: i,
      hideWindow: r,
      showPlayerWindow: a
    }), !(i && !r && (n || a))) {
      m(this, we) && (_("Closing time trigger window", { reason: "not-visible" }), m(this, we).close({ force: !0 }), I(this, we, null));
      return;
    }
    const s = !!n;
    if (m(this, we) && ((u = m(this, we).scene) == null ? void 0 : u.id) === e.id) {
      _("Refreshing existing time trigger window", { sceneId: e.id }), m(this, we).showControls = s, m(this, we).render();
      return;
    }
    m(this, we) && (_("Closing existing window before creating new instance", {
      previousSceneId: ((d = m(this, we).scene) == null ? void 0 : d.id) ?? null
    }), m(this, we).close({ force: !0 })), I(this, we, m(this, ri).call(this, e, { showControls: s })), _("Rendering new time trigger window", { sceneId: e.id }), m(this, we).render({ force: !0 });
  }
  async handleTimeTriggerEvaluation(e, n, i) {
    var l;
    const r = e ?? sr();
    if (!r) {
      _("handleTimeTriggerEvaluation skipped", {
        reason: "no-active-scene",
        providedSceneId: (e == null ? void 0 : e.id) ?? null,
        currentWorldTime: n
      }), typeof n == "number" && Number.isFinite(n) && I(this, Xe, n);
      return;
    }
    const a = typeof n == "number" && Number.isFinite(n) ? n : typeof ((l = game.time) == null ? void 0 : l.worldTime) == "number" ? game.time.worldTime : null;
    if (a === null) return;
    const o = typeof i == "number" && Number.isFinite(i) ? i : null, s = o !== null ? o : typeof m(this, Xe) == "number" && Number.isFinite(m(this, Xe)) ? m(this, Xe) : a;
    Wi("handleTimeTriggerEvaluation", {
      sceneId: r.id,
      previousWorldTime: s,
      currentWorldTime: a,
      overrideProvided: o !== null
    });
    try {
      await C(this, Zi, md).call(this, r, s, a);
    } catch (u) {
      console.error(`${T} | Unexpected error while evaluating time triggers`, u), _("handleTimeTriggerEvaluation error", { message: (u == null ? void 0 : u.message) ?? String(u) });
    } finally {
      I(this, Xe, a), $n();
    }
  }
};
we = new WeakMap(), Xe = new WeakMap(), ri = new WeakMap(), Zi = new WeakSet(), fd = /* @__PURE__ */ c(function(e, n) {
  return typeof m(this, Xe) == "number" && Number.isFinite(m(this, Xe)) ? (_("Resolved previous world time from cache", {
    previousWorldTime: m(this, Xe)
  }), m(this, Xe)) : typeof e == "number" && Number.isFinite(e) && typeof n == "number" && Number.isFinite(n) ? (_("Resolved previous world time using diff", {
    worldTime: e,
    diff: n,
    resolved: e - n
  }), e - n) : typeof e == "number" && Number.isFinite(e) ? e : null;
}, "#resolvePreviousWorldTime"), md = /* @__PURE__ */ c(async function(e, n, i) {
  var p, y, b;
  if (!((p = game.user) != null && p.isGM)) {
    _("Skipping trigger evaluation because user is not a GM");
    return;
  }
  if (!(e != null && e.id)) {
    _("Skipping trigger evaluation because the scene is missing an id");
    return;
  }
  if (!!!e.getFlag(T, Pa)) {
    _("Skipping trigger evaluation because scene is inactive", { sceneId: e.id });
    return;
  }
  if (typeof i != "number" || !Number.isFinite(i)) return;
  (typeof n != "number" || !Number.isFinite(n)) && (n = i);
  const a = Ri(e);
  if (!a.length) {
    _("No time triggers configured for scene", { sceneId: e.id });
    return;
  }
  const o = Bm(e), s = /* @__PURE__ */ new Set();
  for (const v of a)
    v != null && v.id && s.add(v.id);
  let l = !1;
  for (const v of Object.keys(o))
    s.has(v) || (delete o[v], l = !0);
  if (Wi("Evaluating scene time triggers", {
    sceneId: e.id,
    previousWorldTime: n,
    currentWorldTime: i,
    triggerCount: a.length
  }), i <= n) {
    _("Detected world time rewind", {
      previousWorldTime: n,
      currentWorldTime: i
    });
    for (const v of a) {
      if (!(v != null && v.id) || !v.allowReplayOnRewind) continue;
      const w = o[v.id];
      typeof w == "number" ? i < w ? (_("Clearing trigger history due to rewind", {
        triggerId: v.id,
        lastFired: w,
        currentWorldTime: i
      }), delete o[v.id], l = !0) : _("Preserving trigger history after rewind", {
        triggerId: v.id,
        lastFired: w,
        currentWorldTime: i
      }) : _("No history stored for rewind-enabled trigger", {
        triggerId: v.id
      });
    }
    l && (_("Persisting history cleanup after rewind", {
      sceneId: e.id
    }), await fs(e, o)), $n();
    return;
  }
  const u = n, d = i, h = [], f = Math.floor(u / Pi), g = Math.floor(d / Pi);
  for (const v of a) {
    if (!(v != null && v.id)) continue;
    const w = Xu(v.time);
    if (w === null) {
      eh(e, v), _("Skipping trigger with invalid time", {
        triggerId: v.id,
        time: v.time
      });
      continue;
    }
    for (let E = f; E <= g; E++) {
      const L = E * Pi + w;
      if (L < u || L > d) continue;
      const O = o[v.id];
      if (typeof O == "number" && O >= L) {
        _("Skipping trigger because it already fired within window", {
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
    l && await fs(e, o), _("No triggers scheduled to fire within evaluation window", {
      sceneId: e.id
    }), $n();
    return;
  }
  h.sort((v, w) => v.absoluteTime - w.absoluteTime), _("Queued triggers for execution", {
    entries: h.map((v) => ({
      triggerId: v.trigger.id,
      absoluteTime: v.absoluteTime
    }))
  });
  for (const v of h)
    try {
      _("Executing time trigger action", {
        triggerId: v.trigger.id,
        absoluteTime: v.absoluteTime
      }), await rd(e, v.trigger);
    } catch (w) {
      console.error(`${T} | Failed to execute time trigger action`, w), (b = (y = ui.notifications) == null ? void 0 : y.error) == null || b.call(
        y,
        S(
          "EIDOLON.TimeTrigger.TriggerActionError",
          "Failed to execute a scene time trigger action. Check the console for details."
        )
      ), _("Trigger execution failed", {
        triggerId: v.trigger.id,
        message: (w == null ? void 0 : w.message) ?? String(w)
      });
    } finally {
      o[v.trigger.id] = v.absoluteTime, l = !0, _("Recorded trigger execution", {
        triggerId: v.trigger.id,
        absoluteTime: v.absoluteTime
      });
    }
  l && (_("Persisting trigger history updates", { sceneId: e.id }), await fs(e, o)), $n();
}, "#evaluateSceneTimeTriggers"), c(Oc, "TimeTriggerManager");
let Ks = Oc;
function eh(t, e) {
  var r, a;
  const n = `${(t == null ? void 0 : t.id) ?? "unknown"}:${(e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.time) ?? "unknown"}`;
  if (jc.has(n)) return;
  jc.add(n);
  const i = S(
    "EIDOLON.TimeTrigger.InvalidTimeWarning",
    "A scene time trigger has an invalid time value and was skipped."
  );
  (a = (r = ui.notifications) == null ? void 0 : r.warn) == null || a.call(r, i), console.warn(`${T} | Invalid time for trigger`, { scene: t == null ? void 0 : t.id, trigger: e });
}
c(eh, "warnInvalidTriggerTime");
var St, _r, Ct, En, ai, Rt, Ui, vo, wo, Nr, $r, oi, Ht, V, Xs, ki, va, Qs, wa, Zs, Dt, hd, el, gd, tl, pd, Eo, So, Co, To, Lo, Io, nl, yd, Ea, Oo, Ao;
const Ac = class Ac {
  constructor() {
    k(this, V);
    k(this, St, !1);
    k(this, _r, Jr);
    k(this, Ct, /* @__PURE__ */ new Map());
    k(this, En, null);
    k(this, ai, null);
    k(this, Rt, 0);
    k(this, Ui, null);
    k(this, vo, null);
    k(this, wo, null);
    k(this, Nr, !1);
    k(this, $r, !1);
    k(this, oi, !1);
    k(this, Ht, !1);
    k(this, Eo, /* @__PURE__ */ c((e, n = {}) => {
      _("GameTimeAutomation | Pause state changed", {
        paused: e,
        userId: (n == null ? void 0 : n.userId) ?? null,
        broadcast: (n == null ? void 0 : n.broadcast) ?? null
      }), C(this, V, Dt).call(this, { pausedOverride: e });
    }, "#handlePause"));
    k(this, So, /* @__PURE__ */ c((e) => {
      e != null && e.id && (m(this, Ct).set(e.id, Math.max(e.round ?? 0, 1)), _("GameTimeAutomation | Combat started", { combatId: e.id, round: e.round ?? 0 }), C(this, V, Dt).call(this));
    }, "#handleCombatStart"));
    k(this, Co, /* @__PURE__ */ c((e, n) => {
      if (!(e != null && e.id)) return;
      const i = typeof n == "number" && Number.isFinite(n) ? n : typeof e.round == "number" && Number.isFinite(e.round) ? e.round : 0, r = i > 0 ? i : 1, a = m(this, Ct).get(e.id), o = a ? Math.max(a, 1) : 1, s = r > 1 ? Math.max(r - o, 0) : 0;
      if (_("GameTimeAutomation | Combat round change detected", {
        combatId: e.id,
        effectiveRound: r,
        completedRounds: s,
        enabled: m(this, St),
        paused: (game == null ? void 0 : game.paused) ?? null
      }), s > 0 && m(this, St) && m(this, Ht) && !(game != null && game.paused) && C(this, V, ki).call(this) && C(this, V, va).call(this, e)) {
        const l = s * m(this, _r);
        l > 0 && (_("GameTimeAutomation | Advancing time for completed combat rounds", {
          combatId: e.id,
          completedRounds: s,
          delta: l
        }), C(this, V, tl).call(this, l));
      }
      m(this, Ct).set(e.id, Math.max(r, 1));
    }, "#handleCombatRound"));
    k(this, To, /* @__PURE__ */ c((e) => {
      e != null && e.id && (m(this, Ct).delete(e.id), _("GameTimeAutomation | Combat ended", { combatId: e.id }), C(this, V, Dt).call(this));
    }, "#handleCombatEnd"));
    k(this, Lo, /* @__PURE__ */ c((e) => {
      e != null && e.id && (m(this, Ct).delete(e.id), _("GameTimeAutomation | Combat deleted", { combatId: e.id }), C(this, V, Dt).call(this));
    }, "#handleCombatDelete"));
    k(this, Io, /* @__PURE__ */ c((e, n) => {
      if (e != null && e.id) {
        if (typeof (n == null ? void 0 : n.round) == "number" && Number.isFinite(n.round)) {
          const i = Math.max(n.round, 1);
          m(this, Ct).set(e.id, i), _("GameTimeAutomation | Combat round manually updated", {
            combatId: e.id,
            round: i
          });
        }
        (Object.prototype.hasOwnProperty.call(n ?? {}, "active") || (n == null ? void 0 : n.round) !== void 0) && C(this, V, Dt).call(this);
      }
    }, "#handleCombatUpdate"));
    k(this, Oo, /* @__PURE__ */ c((e) => {
      C(this, V, Ea).call(this, e == null ? void 0 : e.scene), C(this, V, Dt).call(this);
    }, "#handleCanvasReady"));
    k(this, Ao, /* @__PURE__ */ c((e) => {
      if (!Ye(e)) return;
      const n = C(this, V, nl).call(this);
      if (!n || n.id !== e.id) return;
      C(this, V, Ea).call(this, e) && C(this, V, Dt).call(this);
    }, "#handleSceneUpdate"));
  }
  registerHooks() {
    m(this, Nr) || (I(this, Nr, !0), Hooks.on("pauseGame", m(this, Eo)), Hooks.on("combatStart", m(this, So)), Hooks.on("combatRound", m(this, Co)), Hooks.on("combatEnd", m(this, To)), Hooks.on("deleteCombat", m(this, Lo)), Hooks.on("updateCombat", m(this, Io)), Hooks.on("canvasReady", m(this, Oo)), Hooks.on("updateScene", m(this, Ao)));
  }
  initialize() {
    m(this, $r) || (I(this, $r, !0), I(this, vo, ed((e) => {
      const n = !!e, i = n !== m(this, St);
      I(this, St, n), _("GameTimeAutomation | Manage time toggled", { enabled: n }), i && n && C(this, V, Zs).call(this), C(this, V, Dt).call(this);
    })), I(this, wo, Hm((e) => {
      I(this, _r, e), _("GameTimeAutomation | Seconds per round updated", { value: e });
    })), C(this, V, Zs).call(this), C(this, V, Ea).call(this), C(this, V, Dt).call(this));
  }
};
St = new WeakMap(), _r = new WeakMap(), Ct = new WeakMap(), En = new WeakMap(), ai = new WeakMap(), Rt = new WeakMap(), Ui = new WeakMap(), vo = new WeakMap(), wo = new WeakMap(), Nr = new WeakMap(), $r = new WeakMap(), oi = new WeakMap(), Ht = new WeakMap(), V = new WeakSet(), Xs = /* @__PURE__ */ c(function() {
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
}, "#currentTimestamp"), ki = /* @__PURE__ */ c(function() {
  var e;
  return !!((e = game == null ? void 0 : game.user) != null && e.isGM && game.user.active !== !1);
}, "#canControlTime"), va = /* @__PURE__ */ c(function(e) {
  var i, r;
  if (!e) return !1;
  if (e.active === !0) return !0;
  if (e.active === !1) return !1;
  const n = (i = game == null ? void 0 : game.combats) == null ? void 0 : i.active;
  return (n == null ? void 0 : n.id) === e.id ? !0 : ((r = game == null ? void 0 : game.combat) == null ? void 0 : r.id) === e.id ? game.combat.active ?? !0 : !1;
}, "#isCombatDocumentActive"), Qs = /* @__PURE__ */ c(function(e) {
  return e ? typeof e.started == "boolean" ? e.started : (e.round ?? 0) > 0 : !1;
}, "#hasCombatStarted"), wa = /* @__PURE__ */ c(function() {
  var i;
  const e = Array.isArray((i = game == null ? void 0 : game.combats) == null ? void 0 : i.contents) ? game.combats.contents : [];
  for (const r of e)
    if (C(this, V, va).call(this, r) && C(this, V, Qs).call(this, r))
      return !0;
  const n = game == null ? void 0 : game.combat;
  return !!(n && C(this, V, va).call(this, n) && C(this, V, Qs).call(this, n));
}, "#isCombatRunning"), Zs = /* @__PURE__ */ c(function() {
  var n;
  m(this, Ct).clear();
  const e = Array.isArray((n = game == null ? void 0 : game.combats) == null ? void 0 : n.contents) ? game.combats.contents : [];
  for (const i of e)
    i != null && i.id && m(this, Ct).set(i.id, Math.max(i.round ?? 0, 1));
}, "#hydrateRoundTracking"), Dt = /* @__PURE__ */ c(function({ pausedOverride: e } = {}) {
  const n = typeof e == "boolean" ? e : !!(game != null && game.paused), i = m(this, St), r = m(this, Ht), a = i && r, o = {
    manageTimeEnabled: i,
    sceneAllowsRealTime: r,
    effectiveEnabled: a,
    paused: n,
    canControl: C(this, V, ki).call(this),
    combatRunning: C(this, V, wa).call(this),
    overrideApplied: typeof e == "boolean"
  };
  if (_("GameTimeAutomation | Sync running state", o), !a || !C(this, V, ki).call(this)) {
    C(this, V, el).call(this);
    return;
  }
  C(this, V, hd).call(this);
}, "#syncRunningState"), hd = /* @__PURE__ */ c(function() {
  m(this, En) === null && (I(this, ai, C(this, V, Xs).call(this)), I(this, En, globalThis.setInterval(() => C(this, V, gd).call(this), 1e3)), _("GameTimeAutomation | Started real-time ticker"));
}, "#startRealTimeTicker"), el = /* @__PURE__ */ c(function() {
  m(this, En) !== null && (globalThis.clearInterval(m(this, En)), I(this, En, null), _("GameTimeAutomation | Stopped real-time ticker")), I(this, ai, null), I(this, Rt, 0), I(this, oi, !1);
}, "#stopRealTimeTicker"), gd = /* @__PURE__ */ c(function() {
  if (!m(this, St) || !m(this, Ht) || !C(this, V, ki).call(this)) {
    C(this, V, el).call(this);
    return;
  }
  const e = C(this, V, Xs).call(this);
  if (typeof e != "number" || !Number.isFinite(e)) return;
  const n = m(this, ai) ?? e, i = (e - n) / 1e3;
  if (I(this, ai, e), !Number.isFinite(i) || i <= 0) return;
  const r = !!(game != null && game.paused), a = C(this, V, wa).call(this);
  if (r || a) {
    m(this, oi) || _("GameTimeAutomation | Tick skipped", { paused: r, combatRunning: a }), I(this, oi, !0), I(this, Rt, 0);
    return;
  }
  I(this, oi, !1), _("GameTimeAutomation | Real-time tick", { deltaSeconds: i }), C(this, V, tl).call(this, i);
}, "#tickRealTime"), tl = /* @__PURE__ */ c(function(e) {
  if (!m(this, St) || !m(this, Ht)) return;
  const n = Number(e);
  !Number.isFinite(n) || n <= 0 || (I(this, Rt, m(this, Rt) + n), !m(this, Ui) && I(this, Ui, C(this, V, pd).call(this)));
}, "#queueAdvance"), pd = /* @__PURE__ */ c(async function() {
  var e, n;
  for (; m(this, Rt) > 0; ) {
    if (!m(this, St) || !m(this, Ht) || game != null && game.paused || !C(this, V, ki).call(this) || C(this, V, wa).call(this)) {
      I(this, Rt, 0);
      break;
    }
    const i = m(this, Rt);
    I(this, Rt, 0);
    try {
      if (typeof ((e = game == null ? void 0 : game.time) == null ? void 0 : e.advance) == "function")
        _("GameTimeAutomation | Advancing world time", { delta: i }), await game.time.advance(i), _("GameTimeAutomation | World time advanced", {
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
  I(this, Ui, null);
}, "#flushAdvanceQueue"), Eo = new WeakMap(), So = new WeakMap(), Co = new WeakMap(), To = new WeakMap(), Lo = new WeakMap(), Io = new WeakMap(), nl = /* @__PURE__ */ c(function() {
  const e = sr();
  return Ye(e) ? e : null;
}, "#getActiveSceneDocument"), yd = /* @__PURE__ */ c(function(e) {
  if (!Ye(e)) return !1;
  try {
    return !!e.getFlag(T, _s);
  } catch (n) {
    return _("GameTimeAutomation | Failed to read scene real-time flag", {
      sceneId: (e == null ? void 0 : e.id) ?? null,
      message: (n == null ? void 0 : n.message) ?? String(n)
    }), !1;
  }
}, "#isSceneRealTimeAllowed"), Ea = /* @__PURE__ */ c(function(e) {
  const n = Ye(e) ? e : C(this, V, nl).call(this), i = C(this, V, yd).call(this, n), r = m(this, Ht);
  return I(this, Ht, i), r !== i ? (_("GameTimeAutomation | Scene real-time allowance changed", {
    sceneId: (n == null ? void 0 : n.id) ?? null,
    allows: i
  }), !0) : !1;
}, "#refreshSceneAutomationState"), Oo = new WeakMap(), Ao = new WeakMap(), c(Ac, "GameTimeAutomation");
let Js = Ac;
var Vu, Sn, He, si, sn, ko, ve, bd, vd, wd, Ed, Mo, rl, _o, Sd, No, Cd, Td;
const nn = class nn extends Vn(Un) {
  constructor(n = {}) {
    const { scene: i, trigger: r, triggerIndex: a, onSave: o, ...s } = n ?? {};
    super(s);
    k(this, ve);
    k(this, Sn, null);
    k(this, He, null);
    k(this, si, null);
    k(this, sn, null);
    k(this, ko, /* @__PURE__ */ c(() => {
      (this.rendered ?? this.isRendered ?? !1) && (I(this, sn, C(this, ve, bd).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    k(this, Mo, /* @__PURE__ */ c((n) => {
      var a, o;
      const i = n.currentTarget, r = i == null ? void 0 : i.closest("form");
      r && (_("Trigger action selection changed", {
        sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
        triggerId: ((o = this.trigger) == null ? void 0 : o.id) ?? null,
        actionId: (i == null ? void 0 : i.value) ?? null
      }), C(this, ve, rl).call(this, i.value, r));
    }, "#onActionSelectChange"));
    k(this, _o, /* @__PURE__ */ c((n) => {
      var u, d, h, f;
      n.preventDefault();
      const i = n.currentTarget, r = i == null ? void 0 : i.closest("form");
      if (!r) return;
      const a = (u = i.dataset) == null ? void 0 : u.target;
      if (!a) return;
      const o = typeof (CSS == null ? void 0 : CSS.escape) == "function" ? CSS.escape : (g) => g, s = r.querySelector(`[name="${o(a)}"]`);
      if (!s) return;
      _("Opening file picker for trigger", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        triggerId: ((h = this.trigger) == null ? void 0 : h.id) ?? null,
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
    k(this, No, /* @__PURE__ */ c(async (n) => {
      var r, a;
      n.preventDefault();
      const i = n.currentTarget;
      i instanceof HTMLFormElement && (_("Trigger form submitted", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null,
        triggerId: ((a = this.trigger) == null ? void 0 : a.id) ?? null
      }), await C(this, ve, Cd).call(this, i));
    }, "#onSubmit"));
    this.scene = i ?? null, this.trigger = r ?? null, this.triggerIndex = Number.isInteger(a) ? Number(a) : null, this.onSave = typeof o == "function" ? o : null, I(this, si, ic(m(this, ko)));
  }
  async _prepareContext() {
    var n, i;
    Wi("TriggerFormApplication#_prepareContext", {
      sceneId: ((n = this.scene) == null ? void 0 : n.id) ?? null,
      triggerId: ((i = this.trigger) == null ? void 0 : i.id) ?? null,
      triggerIndex: this.triggerIndex
    });
    try {
      const r = this.trigger ?? { action: ba, data: {} }, a = r.action ?? ba, o = qc(r.time), s = o.format ?? "12h", l = s === "12h" ? Zm() : [], u = o.period ?? (l.length > 0 ? l[0].value : null), d = s === "12h" ? l.map((g) => ({
        ...g,
        selected: g.value === u
      })) : [], h = Hc().map((g) => ({
        id: g.id,
        label: typeof g.label == "function" ? g.label() : g.label,
        selected: g.id === a
      })), f = Hc().map((g) => {
        const p = g.id === r.action ? r : { ...r, action: g.id }, y = zm(p);
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
      $n();
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
    const a = Array.from(((d = document == null ? void 0 : document.body) == null ? void 0 : d.classList) ?? []).find(
      (h) => h.startsWith("theme-")
    );
    a && r.classList.add(a);
    const o = r.querySelector("form");
    if (!o) return;
    C(this, ve, Sd).call(this, o), C(this, ve, vd).call(this, o), o.addEventListener("submit", m(this, No));
    const s = o.querySelector("[data-action-select]");
    s && (s.addEventListener("change", m(this, Mo)), C(this, ve, rl).call(this, s.value, o)), o.querySelectorAll("[data-action-file-picker]").forEach((h) => {
      h.addEventListener("click", m(this, _o));
    });
  }
  async close(n = {}) {
    var i;
    if ((i = m(this, Sn)) == null || i.call(this), I(this, Sn, null), I(this, He, null), I(this, sn, null), typeof m(this, si) == "function")
      try {
        m(this, si).call(this);
      } catch (r) {
        console.error(`${T} | Failed to dispose trigger form time format subscription`, r);
      }
    return I(this, si, null), super.close(n);
  }
};
Sn = new WeakMap(), He = new WeakMap(), si = new WeakMap(), sn = new WeakMap(), ko = new WeakMap(), ve = new WeakSet(), bd = /* @__PURE__ */ c(function() {
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
}, "#captureFormState"), vd = /* @__PURE__ */ c(function(n) {
  if (!m(this, sn)) return;
  if (!(n instanceof HTMLFormElement)) {
    I(this, sn, null);
    return;
  }
  const { fields: i = [], time: r = null } = m(this, sn) ?? {};
  I(this, sn, null), C(this, ve, wd).call(this, n, i), C(this, ve, Ed).call(this, n, r);
}, "#restorePendingFormState"), wd = /* @__PURE__ */ c(function(n, i) {
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
}, "#restoreFieldValues"), Ed = /* @__PURE__ */ c(function(n, i) {
  var w, E, L;
  const r = n.querySelector("[data-time-format]");
  if (!(r instanceof HTMLElement)) {
    typeof m(this, He) == "function" && m(this, He).call(this);
    return;
  }
  const a = ((w = r.dataset) == null ? void 0 : w.timeFormat) === "24h" ? "24h" : "12h", o = r.querySelector("[data-time-hour]"), s = r.querySelector("[data-time-minute]"), l = r.querySelector("[data-time-period]"), u = r.querySelector("[data-time-hidden]");
  if (!i) {
    if (o instanceof HTMLInputElement && (o.value = ""), s instanceof HTMLInputElement && (s.value = ""), l instanceof HTMLSelectElement) {
      const A = ((L = (E = l.options) == null ? void 0 : E[0]) == null ? void 0 : L.value) ?? "";
      l.value = A;
    }
    u instanceof HTMLInputElement && (u.value = ""), typeof m(this, He) == "function" && m(this, He).call(this);
    return;
  }
  const d = typeof i.canonical == "string" ? i.canonical : "", h = typeof i.period == "string" ? i.period : "", f = typeof i.hour == "string" ? i.hour : "", g = typeof i.minute == "string" ? i.minute : "";
  let p = "", y = "", b = h, v = d;
  if (d) {
    const A = qc(d, a);
    p = A.hour ?? "", y = A.minute ?? "", v = A.canonical ?? d, a === "12h" ? b = A.period ?? h : b = "";
  } else
    p = f, y = g, a !== "12h" && (b = "");
  if (o instanceof HTMLInputElement && (o.value = p ?? ""), s instanceof HTMLInputElement && (s.value = y ?? ""), l instanceof HTMLSelectElement)
    if (a === "12h") {
      const A = Array.from(l.options ?? []);
      A.find((M) => M.value === b) ? l.value = b : A.length > 0 ? l.value = A[0].value : l.value = "";
    } else
      l.value = "";
  u instanceof HTMLInputElement && (u.value = v ?? ""), typeof m(this, He) == "function" && m(this, He).call(this);
}, "#restoreTimeInputs"), Mo = new WeakMap(), rl = /* @__PURE__ */ c(function(n, i) {
  i && i.querySelectorAll("[data-action-config]").forEach((r) => {
    const a = r.dataset.actionConfig === n;
    r.style.display = a ? "" : "none";
  });
}, "#updateActionSections"), _o = new WeakMap(), Sd = /* @__PURE__ */ c(function(n) {
  var h, f, g, p;
  if ((h = m(this, Sn)) == null || h.call(this), I(this, Sn, null), I(this, He, null), !(n instanceof HTMLFormElement)) return;
  const i = n.querySelector("[data-time-format]"), r = ((f = i == null ? void 0 : i.dataset) == null ? void 0 : f.timeFormat) ?? null;
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
    const { canonical: y, error: b } = Qm(
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
  }), d(), I(this, Sn, () => {
    u.forEach((y) => {
      y.removeEventListener("input", d), y.removeEventListener("change", d);
    });
  }), I(this, He, d), _("Trigger form configured for time input", {
    format: r,
    sceneId: ((g = this.scene) == null ? void 0 : g.id) ?? null,
    triggerId: ((p = this.trigger) == null ? void 0 : p.id) ?? null
  });
}, "#setupTimeInput"), No = new WeakMap(), Cd = /* @__PURE__ */ c(async function(n) {
  var a, o, s, l, u;
  if (typeof m(this, He) == "function" && m(this, He).call(this), typeof n.checkValidity == "function" && !n.checkValidity()) {
    typeof n.reportValidity == "function" && n.reportValidity(), _("Trigger form submission blocked by validity check", {
      sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
      triggerId: ((o = this.trigger) == null ? void 0 : o.id) ?? null
    });
    return;
  }
  const i = new FormData(n), r = Object.fromEntries(i.entries());
  delete r.timeHour, delete r.timeMinute, delete r.timePeriod, r.allowReplayOnRewind = ((s = n.querySelector('input[name="allowReplayOnRewind"]')) == null ? void 0 : s.checked) ?? !1, _("Processing trigger form submission", {
    sceneId: ((l = this.scene) == null ? void 0 : l.id) ?? null,
    triggerId: ((u = this.trigger) == null ? void 0 : u.id) ?? null,
    allowReplayOnRewind: r.allowReplayOnRewind
  }), await C(this, ve, Td).call(this, r), await this.close();
}, "#handleSubmit"), Td = /* @__PURE__ */ c(async function(n) {
  var a, o, s, l, u, d;
  const i = {
    id: ((a = this.trigger) == null ? void 0 : a.id) ?? $m(),
    time: n.time ?? "",
    action: n.action ?? ba,
    allowReplayOnRewind: !!n.allowReplayOnRewind,
    data: {}
  };
  _("Persisting trigger from form", {
    sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
    triggerId: i.id,
    existingIndex: this.triggerIndex
  }), Wm(i, n);
  const r = Ri(this.scene);
  this.triggerIndex !== null && r[this.triggerIndex] ? r[this.triggerIndex] = i : r.push(i);
  try {
    await id(this.scene, r), _("Trigger list saved", {
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
      console.error(`${T} | Trigger onSave callback failed`, h), _("Trigger onSave callback failed", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        message: (h == null ? void 0 : h.message) ?? String(h)
      });
    }
}, "#persistTrigger"), c(nn, "TriggerFormApplication"), pe(nn, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Re(nn, nn, "DEFAULT_OPTIONS"),
  {
    id: `${T}-trigger-form`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Vu = Re(nn, nn, "DEFAULT_OPTIONS")) == null ? void 0 : Vu.classes) ?? [], "standard-form", "themed"])
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
)), pe(nn, "PARTS", {
  content: {
    template: `modules/${T}/templates/time-trigger-form.html`
  }
});
let il = nn;
function $t(t) {
  return t instanceof HTMLElement ? t : (t == null ? void 0 : t[0]) instanceof HTMLElement ? t[0] : null;
}
c($t, "asHTMLElement");
function Sa(t) {
  return typeof (t == null ? void 0 : t.changeTab) == "function";
}
c(Sa, "isAppV2");
function Ld(t, e, n, i = {}) {
  if (Sa(t)) {
    t.changeTab(e, n, i);
    return;
  }
  if (typeof (t == null ? void 0 : t.activateTab) == "function") {
    const r = { ...i };
    n != null && (r.group = n), r.triggerCallback == null && (r.triggerCallback = !0), t.activateTab(e, r);
  }
}
c(Ld, "setActiveTab");
function th(t) {
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
c(th, "readFormData");
const Bc = Symbol.for("eidolon.sceneConfig.v13PatchedTabs");
function Id(t = {}) {
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
  const g = typeof d.log == "function" ? d.log.bind(d) : (...N) => {
    var H;
    return (H = console.debug) == null ? void 0 : H.call(console, `${o}`, ...N);
  }, p = typeof d.group == "function" ? d.group.bind(d) : (...N) => {
    var H;
    return (H = console.groupCollapsed) == null ? void 0 : H.call(console, `${o}`, ...N);
  }, y = typeof d.groupEnd == "function" ? d.groupEnd.bind(d) : () => {
    var N;
    return (N = console.groupEnd) == null ? void 0 : N.call(console);
  }, b = Symbol(`EIDOLON_SCENE_CONFIG_TAB_CLEANUP_${e}`), v = typeof i == "function" ? i : () => null, w = typeof r == "function" ? r : () => !0, E = typeof n == "function" ? n : () => typeof n == "string" ? n : e;
  function L() {
    var W, q, U, K, ae;
    const N = ((q = (W = foundry == null ? void 0 : foundry.applications) == null ? void 0 : W.sheets) == null ? void 0 : q.SceneConfig) ?? ((U = CONFIG == null ? void 0 : CONFIG.Scene) == null ? void 0 : U.sheetClass);
    if (!N || !Sa({ changeTab: (K = N.prototype) == null ? void 0 : K.changeTab })) return;
    const H = N[Bc] ?? /* @__PURE__ */ new Set();
    if (H.has(e)) return;
    H.add(e), N[Bc] = H;
    const B = (ae = N.TABS) == null ? void 0 : ae.sheet;
    if (B && Array.isArray(B.tabs) && !B.tabs.some((Q) => Q.id === e)) {
      const Q = E({ app: null, scene: null }) ?? e;
      B.tabs.push({
        id: e,
        icon: f,
        label: Q
      });
    }
    N.PARTS && !N.PARTS[e] && (N.PARTS[e] = {
      template: `modules/${h}/templates/scene-config-tab-mount.hbs`,
      scrollable: [`.tab[data-tab="${e}"]`]
    }), g("Patched v13 SceneConfig TABS/PARTS", { tabId: e });
  }
  c(L, "patchV13SceneConfig");
  function A(N, H) {
    var W, q;
    const B = v(N);
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
      constructor: ((q = N == null ? void 0 : N.constructor) == null ? void 0 : q.name) ?? null
    });
    try {
      const U = $t(H) ?? $t(N.element);
      if (!U) {
        g("Missing root element", { tabId: e });
        return;
      }
      Sa(N) ? x(N, U, B) : M(N, U, B);
    } finally {
      y();
    }
  }
  c(A, "handleRender");
  function O(N, H, B) {
    var U;
    if (!f) {
      N.textContent = H;
      return;
    }
    const W = (U = N.querySelector("i")) == null ? void 0 : U.cloneNode(!0);
    N.textContent = "";
    const q = W ?? document.createElement("i");
    if (W || (q.className = f, B && (q.inert = !0)), N.append(q, " "), B) {
      const K = document.createElement("span");
      K.textContent = H, N.append(K);
    } else
      N.append(document.createTextNode(H));
  }
  c(O, "setButtonContent");
  function M(N, H, B) {
    var rt, Xt, Ke, Ie, Li, Qt, Gn, at, Zt, P, na, X, pt, _e, tr, ia;
    const q = [
      "nav.sheet-tabs[data-group]",
      "nav.tabs[data-group]",
      "nav.sheet-tabs",
      "nav.tabs"
    ].map((Ne) => H.querySelector(Ne)).find((Ne) => Ne instanceof HTMLElement), K = [
      (rt = H.querySelector(".tab[data-tab]")) == null ? void 0 : rt.parentElement,
      H.querySelector(".sheet-body"),
      (Ke = (Xt = q == null ? void 0 : q.parentElement) == null ? void 0 : Xt.querySelector) == null ? void 0 : Ke.call(Xt, ":scope > .sheet-body"),
      q == null ? void 0 : q.parentElement
    ].find((Ne) => Ne instanceof HTMLElement), ae = ((Ie = q == null ? void 0 : q.dataset) == null ? void 0 : Ie.group) ?? ((Gn = (Qt = (Li = q == null ? void 0 : q.querySelector) == null ? void 0 : Li.call(q, "a[data-group]")) == null ? void 0 : Qt.dataset) == null ? void 0 : Gn.group) ?? ((P = (Zt = (at = q == null ? void 0 : q.querySelector) == null ? void 0 : at.call(q, "[data-group]")) == null ? void 0 : Zt.dataset) == null ? void 0 : P.group) ?? ((pt = (X = (na = K == null ? void 0 : K.querySelector) == null ? void 0 : na.call(K, ".tab[data-group]")) == null ? void 0 : X.dataset) == null ? void 0 : pt.group) ?? "main";
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
      (_e = Ne == null ? void 0 : Ne.classList) != null && _e.contains("item") && Q.classList.add("item"), q.appendChild(Q), typeof s == "function" && s({ app: N, button: Q, nav: q, scene: B }), g("Created tab button", { tabId: e, group: ae });
    }
    O(Q, E({ app: N, scene: B }) ?? e, Sa(N));
    let te = K.querySelector(`.tab[data-tab="${e}"]`);
    if (!te) {
      te = document.createElement("div"), te.classList.add("tab"), te.dataset.tab = e, te.dataset.group = ae;
      const Ne = Od(K);
      K.insertBefore(te, Ne ?? null), typeof l == "function" && l({ app: N, tab: te, body: K, scene: B }), g("Created tab container", { tabId: e, group: ae });
    }
    ((tr = Q.classList) == null ? void 0 : tr.contains("active")) || te.classList.contains("active") ? (Q.classList.add("active"), te.classList.add("active"), te.removeAttribute("hidden")) : (Q.classList.remove("active"), te.classList.remove("active"), te.setAttribute("hidden", "true"));
    const gt = /* @__PURE__ */ c(() => {
      var zn, nr;
      ((zn = Q.classList) != null && zn.contains("active") || te.classList.contains("active")) && ((nr = Q.classList) == null || nr.add("active"), te.classList.add("active"), te.removeAttribute("hidden"), te.removeAttribute("aria-hidden"), te.style.display === "none" && (te.style.display = ""));
    }, "ensureTabVisible"), Pe = /* @__PURE__ */ c(() => {
      gt(), requestAnimationFrame(gt);
    }, "scheduleEnsureTabVisible");
    Q.dataset.eidolonEnsureSceneTabVisibility || (Q.addEventListener("click", () => {
      Ld(N, e, ae), requestAnimationFrame(gt);
    }), Q.dataset.eidolonEnsureSceneTabVisibility = "true"), ms(N, b, g);
    const it = a({
      app: N,
      scene: B,
      tab: te,
      tabButton: Q,
      ensureTabVisible: gt,
      scheduleEnsureTabVisible: Pe
    });
    typeof it == "function" && Uc(N, b, it), typeof u == "function" && u({
      app: N,
      scene: B,
      tab: te,
      tabButton: Q,
      ensureTabVisible: gt,
      scheduleEnsureTabVisible: Pe
    }), (ia = N.setPosition) == null || ia.call(N, { height: "auto" });
  }
  c(M, "handleRenderV1");
  function x(N, H, B) {
    const W = H.querySelector(`.tab[data-tab="${e}"]`), q = H.querySelector(`nav [data-tab="${e}"]`);
    if (!W || !q) {
      g("v2 mount not found, falling back to v1 injection", { tabId: e }), M(N, H, B);
      return;
    }
    O(q, E({ app: N, scene: B }) ?? e, !0);
    const U = /* @__PURE__ */ c(() => {
      var Q;
      !((Q = q.classList) != null && Q.contains("active")) && !W.classList.contains("active") || (W.classList.add("active"), W.removeAttribute("hidden"), W.removeAttribute("aria-hidden"), W.style.display === "none" && (W.style.display = ""));
    }, "ensureTabVisible"), K = /* @__PURE__ */ c(() => {
      U(), requestAnimationFrame(U);
    }, "scheduleEnsureTabVisible");
    ms(N, b, g);
    const ae = a({
      app: N,
      scene: B,
      tab: W,
      tabButton: q,
      ensureTabVisible: U,
      scheduleEnsureTabVisible: K
    });
    typeof ae == "function" && Uc(N, b, ae), typeof u == "function" && u({
      app: N,
      scene: B,
      tab: W,
      tabButton: q,
      ensureTabVisible: U,
      scheduleEnsureTabVisible: K
    });
  }
  c(x, "handleRenderV2");
  function R(N) {
    ms(N, b, g);
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
c(Id, "createSceneConfigTabFactory");
function Uc(t, e, n) {
  if (!t || typeof n != "function") return;
  const i = t == null ? void 0 : t[e];
  Array.isArray(i) || (t[e] = []), t[e].push(n);
}
c(Uc, "registerCleanup");
function ms(t, e, n) {
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
c(ms, "invokeCleanup");
function Od(t) {
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
c(Od, "findFooterElement");
const nh = Uo(il), ih = `modules/${T}/templates/time-trigger-scene-tab.html`, rh = Id({
  tabId: "time-triggers",
  tabLabel: /* @__PURE__ */ c(() => S("EIDOLON.TimeTrigger.Tab", "Time Triggers"), "tabLabel"),
  getScene: Yt,
  isApplicable: lh,
  renderContent: /* @__PURE__ */ c(({ app: t, scene: e, tab: n }) => oh(t, n, e), "renderContent"),
  logger: {
    log: _,
    group: Wi,
    groupEnd: $n
  }
});
function ah() {
  return _("Registering SceneConfig render hook"), rh.register();
}
c(ah, "registerSceneConfigHook");
function oh(t, e, n) {
  if (!(e instanceof HTMLElement)) return;
  const i = Ye(n) ? n : Yt(t);
  Ba(t, e, i);
  const r = ic(() => {
    Ba(t, e, i);
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
c(oh, "renderTimeTriggerTab");
async function Ba(t, e, n) {
  var r, a;
  const i = n ?? Yt(t);
  Wi("renderTimeTriggersTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!Ye(i)) {
      const W = S(
        "EIDOLON.TimeTrigger.Unavailable",
        "Time triggers are unavailable for this configuration sheet."
      );
      e.innerHTML = `<p class="notes">${W}</p>`, _("Scene lacks document for time triggers", { sceneId: (i == null ? void 0 : i.id) ?? null });
      return;
    }
    const o = `flags.${T}.${Pa}`, s = `flags.${T}.${ks}`, l = `flags.${T}.${Ms}`, u = !!i.getFlag(T, Pa), d = !!i.getFlag(T, ks), h = !!i.getFlag(T, Ms), f = Ri(i);
    _("Rendering time trigger list", {
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
    ), b = S(
      "EIDOLON.TimeTrigger.HideWindowDescription",
      "Keep the floating time control window hidden while leaving time triggers active."
    ), v = S(
      "EIDOLON.TimeTrigger.ShowPlayerWindowLabel",
      "Share Floating Time Window with Players"
    ), w = S(
      "EIDOLON.TimeTrigger.ShowPlayerWindowDescription",
      "Let non-GM players see the floating time window (without time controls)."
    ), E = S(
      "EIDOLON.TimeTrigger.TriggerListLabel",
      "Scene Time Triggers"
    ), L = S(
      "EIDOLON.TimeTrigger.TriggerListEmpty",
      "No time triggers configured for this scene."
    ), A = S("EIDOLON.TimeTrigger.AddTrigger", "Add Trigger"), O = S("EIDOLON.TimeTrigger.EditTrigger", "Edit"), M = S("EIDOLON.TimeTrigger.DeleteTrigger", "Remove"), x = S("EIDOLON.TimeTrigger.TriggerNow", "Trigger Now"), R = S("EIDOLON.TimeTrigger.AtLabel", "At"), D = S("EIDOLON.TimeTrigger.DoLabel", "Do"), F = S("EIDOLON.TimeTrigger.MissingTime", "(No time set)"), N = f.map((W, q) => {
      const ae = (W.time ? Xm(W.time) : "") || W.time || "" || F, Q = Vm(W.action), te = [
        `${R} ${ae}`,
        `${D} ${Q}`,
        ...Gm(W)
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
      B = await H(ih, {
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
          hideWindow: b,
          showPlayerWindow: w
        },
        triggers: N,
        hasTriggers: N.length > 0
      });
    } catch (W) {
      console.error(`${T} | Failed to render time trigger scene tab template`, W), e.innerHTML = `<p class="notes">${L}</p>`;
      return;
    }
    e.innerHTML = B, sh(t, e, i);
  } finally {
    $n();
  }
}
c(Ba, "renderTimeTriggersTabContent");
function sh(t, e, n) {
  const i = n ?? Yt(t);
  if (!Ye(i)) return;
  const r = e.querySelector('[data-action="add-trigger"]');
  r && r.addEventListener("click", () => {
    _("Add trigger button clicked", { sceneId: i.id }), Vc(t, { scene: i });
  }), e.querySelectorAll('[data-action="edit-trigger"]').forEach((a) => {
    a.addEventListener("click", () => {
      const o = Number(a.dataset.index);
      if (!Number.isInteger(o)) return;
      const l = Ri(i)[o];
      l && (_("Edit trigger button clicked", { sceneId: i.id, triggerId: l.id, index: o }), Vc(t, { trigger: l, triggerIndex: o, scene: i }));
    });
  }), e.querySelectorAll('[data-action="delete-trigger"]').forEach((a) => {
    a.addEventListener("click", async () => {
      var u, d;
      const o = Number(a.dataset.index);
      if (!Number.isInteger(o)) return;
      const s = Ri(i), l = s[o];
      if (l) {
        s.splice(o, 1);
        try {
          _("Deleting trigger", {
            sceneId: i.id,
            index: o,
            triggerId: (l == null ? void 0 : l.id) ?? null
          }), await id(i, s), await Ba(t, e, i);
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
      const l = Ri(i)[o];
      if (l) {
        if (!((u = game.user) != null && u.isGM)) {
          (h = (d = ui.notifications) == null ? void 0 : d.warn) == null || h.call(
            d,
            S("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time.")
          );
          return;
        }
        try {
          _("Manually firing trigger", { sceneId: i.id, triggerId: l.id, index: o }), await rd(i, l), (g = (f = ui.notifications) == null ? void 0 : f.info) == null || g.call(
            f,
            S(
              "EIDOLON.TimeTrigger.TriggerNowSuccess",
              "Triggered the selected time trigger."
            )
          );
        } catch (b) {
          console.error(`${T} | Failed to execute time trigger manually`, b), (y = (p = ui.notifications) == null ? void 0 : p.error) == null || y.call(
            p,
            S(
              "EIDOLON.TimeTrigger.TriggerNowError",
              "Failed to execute the selected time trigger."
            )
          ), _("Manual trigger execution failed", {
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
c(sh, "bindTimeTriggerTabEvents");
function Vc(t, e = {}) {
  var o;
  const n = e.scene ?? null, i = n && Ye(n) ? n : Yt(t);
  if (!Ye(i)) {
    console.warn(`${T} | Unable to open trigger form because no scene document is available.`);
    return;
  }
  _("Opening trigger form", {
    sceneId: i.id,
    triggerId: ((o = e.trigger) == null ? void 0 : o.id) ?? null,
    index: Number.isInteger(e.triggerIndex) ? Number(e.triggerIndex) : null
  }), nh({
    scene: i,
    trigger: e.trigger ?? null,
    triggerIndex: e.triggerIndex ?? null,
    onSave: /* @__PURE__ */ c(() => {
      var l, u;
      const s = (u = (l = t.element) == null ? void 0 : l[0]) == null ? void 0 : u.querySelector('.tab[data-tab="time-triggers"]');
      s && Ba(t, s, i);
    }, "onSave")
  }).render({ force: !0 });
}
c(Vc, "openTriggerForm");
function lh(t, e) {
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
c(lh, "isRecognizedSceneConfig");
const sa = new Ks(), Gc = new Js();
function ch() {
  _("Registering time trigger hooks"), Hooks.once("init", () => {
    xm(), qm(), _("Time trigger settings registered during init");
  }), ah(), _("Scene config hook registered"), Gc.registerHooks(), _("Time automation hooks registered"), Hooks.once("ready", () => {
    jm(), _("Ready hook fired"), sa.onReady(), Gc.initialize();
  }), Hooks.on("canvasReady", (t) => {
    var e;
    _("canvasReady hook received", { scene: ((e = t == null ? void 0 : t.scene) == null ? void 0 : e.id) ?? null }), sa.onCanvasReady(t);
  }), Hooks.on("updateScene", (t) => {
    _("updateScene hook received", { scene: (t == null ? void 0 : t.id) ?? null }), sa.onUpdateScene(t);
  }), Hooks.on("updateWorldTime", (t, e) => {
    _("updateWorldTime hook received", { worldTime: t, diff: e }), sa.onUpdateWorldTime(t, e);
  });
}
c(ch, "registerTimeTriggerHooks");
ch();
const Se = T, Ad = "criteria", ac = "state", uh = "criteriaVersion", dh = 1, kd = "enableCriteriaSurfaces";
let zc = !1;
function fh() {
  var t;
  if (!zc) {
    if (zc = !0, !((t = game == null ? void 0 : game.settings) != null && t.register)) {
      console.warn(`${Se} | game.settings.register unavailable; scene criteria setting skipped.`);
      return;
    }
    game.settings.register(Se, kd, {
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
        mh();
      }, "onChange")
    });
  }
}
c(fh, "registerSceneCriteriaSettings");
function Vo() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return !!game.settings.get(Se, kd);
  } catch (e) {
    console.error(`${Se} | Failed to read criteria surfaces setting`, e);
  }
  return !0;
}
c(Vo, "getCriteriaSurfacesEnabled");
function mh() {
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
c(mh, "promptReloadForCriteriaSurfaces");
const Ua = "Standard";
function ht(t) {
  var n;
  const e = (n = t == null ? void 0 : t.getFlag) == null ? void 0 : n.call(t, Se, Ad);
  return e ? Md(e) : [];
}
c(ht, "getSceneCriteria");
async function Go(t, e) {
  if (!(t != null && t.setFlag)) return;
  const n = Md(e);
  await t.setFlag(Se, Ad, n), await t.setFlag(Se, uh, dh);
  const i = Qr(t, n);
  await t.setFlag(Se, ac, i);
}
c(Go, "setSceneCriteria");
function Qr(t, e = null) {
  var r;
  const n = Array.isArray(e) ? e : ht(t), i = Wt(((r = t == null ? void 0 : t.getFlag) == null ? void 0 : r.call(t, Se, ac)) ?? {});
  return sc(i, n);
}
c(Qr, "getSceneCriteriaState");
async function hh(t, e, n = null) {
  if (!(t != null && t.setFlag)) return;
  const i = Array.isArray(n) ? n : ht(t), r = sc(e, i);
  await t.setFlag(Se, ac, r);
}
c(hh, "setSceneCriteriaState");
function oc(t = "") {
  const e = typeof t == "string" ? t.trim() : "", n = _d(ol(e || "criterion"), /* @__PURE__ */ new Set());
  return {
    id: Nd(),
    key: n,
    label: e,
    values: [Ua],
    default: Ua,
    order: 0
  };
}
c(oc, "createSceneCriterion");
function Md(t) {
  const e = Array.isArray(t) ? Wt(t) : [], n = [], i = /* @__PURE__ */ new Set();
  return e.forEach((r, a) => {
    const o = al(r, a, i);
    o && (n.push(o), i.add(o.key));
  }), n;
}
c(Md, "sanitizeCriteria$1");
function al(t, e = 0, n = /* @__PURE__ */ new Set()) {
  if (!t || typeof t != "object") return null;
  const i = typeof t.id == "string" && t.id.trim() ? t.id.trim() : Nd(), a = (typeof t.label == "string" ? t.label : typeof t.name == "string" ? t.name : "").trim(), o = typeof t.key == "string" && t.key.trim() ? ol(t.key) : ol(a || `criterion-${Number(e) + 1}`), s = _d(o, n), l = ph(t.values);
  let u = typeof t.default == "string" ? t.default.trim() : "";
  u || (u = l[0] ?? Ua), l.includes(u) || l.unshift(u);
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
function sc(t, e = []) {
  const n = t && typeof t == "object" ? Wt(t) : {}, i = {};
  for (const r of e) {
    const a = n == null ? void 0 : n[r.key], o = typeof a == "string" ? a.trim() : "";
    o && r.values.includes(o) ? i[r.key] = o : i[r.key] = r.default;
  }
  return i;
}
c(sc, "sanitizeSceneCriteriaState");
function gh(t) {
  return ht(t).map((n) => ({
    id: n.key,
    key: n.key,
    name: n.label,
    values: [...n.values]
  }));
}
c(gh, "getSceneCriteriaCategories");
function ph(t) {
  const e = Array.isArray(t) ? t : [], n = [];
  for (const i of e) {
    if (typeof i != "string") continue;
    const r = i.trim();
    !r || n.includes(r) || n.push(r);
  }
  return n.length || n.push(Ua), n;
}
c(ph, "sanitizeCriterionValues");
function ol(t) {
  return String(t ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
c(ol, "slugifyCriterionKey");
function _d(t, e) {
  if (!e.has(t)) return t;
  let n = 2;
  for (; e.has(`${t}-${n}`); )
    n += 1;
  return `${t}-${n}`;
}
c(_d, "ensureUniqueCriterionKey");
function Nd() {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 11);
}
c(Nd, "generateCriterionId");
function $d(t) {
  var e, n;
  console.error(`${Se} | Failed to persist scene criteria`, t), (n = (e = ui.notifications) == null ? void 0 : e.error) == null || n.call(
    e,
    S(
      "EIDOLON.SceneCriteria.PersistError",
      "Failed to persist the scene criteria."
    )
  );
}
c($d, "notifyPersistError");
var Gu, he, ln, De, xd, $o, xo, Fo, Do, Ca, Po, xr, Fr, lr, Fd;
const rn = class rn extends Vn(Un) {
  constructor(n = {}) {
    const { scene: i, criterion: r, isNew: a, onSave: o, ...s } = n ?? {};
    super(s);
    k(this, De);
    k(this, he, null);
    k(this, ln, !1);
    k(this, $o, /* @__PURE__ */ c(async (n) => {
      n.preventDefault();
      const i = n.currentTarget;
      if (!(i instanceof HTMLFormElement)) return;
      const r = new FormData(i), a = String(r.get("criterionLabel") ?? "").trim(), o = String(r.get("criterionKey") ?? "").trim(), s = Array.from(i.querySelectorAll('[name="criterionValues"]')).map((h) => h instanceof HTMLInputElement ? h.value.trim() : "").filter((h, f, g) => h && g.indexOf(h) === f), u = String(r.get("criterionDefault") ?? "").trim() || s[0] || "Standard", d = al(
        {
          id: m(this, he).id,
          key: o,
          label: a,
          values: s,
          default: u,
          order: Number(m(this, he).order ?? 0)
        },
        0,
        /* @__PURE__ */ new Set()
      );
      d && (I(this, he, d), await C(this, De, Fd).call(this), this.close());
    }, "#onSubmit"));
    k(this, xo, /* @__PURE__ */ c((n) => {
      var o;
      if (m(this, ln)) return;
      const i = n.currentTarget, r = (i == null ? void 0 : i.form) ?? ((o = this.element) == null ? void 0 : o.querySelector("form"));
      if (!(r instanceof HTMLFormElement)) return;
      const a = r.querySelector('input[name="criterionKey"]');
      a instanceof HTMLInputElement && (a.value = ar(i.value));
    }, "#onLabelInput"));
    k(this, Fo, /* @__PURE__ */ c((n) => {
      var l;
      const i = n.currentTarget, r = (i == null ? void 0 : i.form) ?? ((l = this.element) == null ? void 0 : l.querySelector("form"));
      if (!(r instanceof HTMLFormElement) || !(i instanceof HTMLInputElement)) return;
      const a = r.querySelector('input[name="criterionLabel"]'), o = ar(a instanceof HTMLInputElement ? a.value : ""), s = ar(i.value);
      I(this, ln, s !== o), i.value = s, C(this, De, Ca).call(this, r);
    }, "#onKeyInput"));
    k(this, Do, /* @__PURE__ */ c((n) => {
      var o, s;
      n.preventDefault();
      const i = ((o = n.currentTarget) == null ? void 0 : o.form) ?? ((s = this.element) == null ? void 0 : s.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector('input[name="criterionLabel"]'), a = i.querySelector('input[name="criterionKey"]');
      a instanceof HTMLInputElement && (a.value = ar(r instanceof HTMLInputElement ? r.value : ""), I(this, ln, !1), C(this, De, Ca).call(this, i));
    }, "#onResetAutoKey"));
    k(this, Po, /* @__PURE__ */ c((n) => {
      var l, u, d, h, f, g;
      n.preventDefault();
      const i = ((l = n.currentTarget) == null ? void 0 : l.form) ?? ((u = this.element) == null ? void 0 : u.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector(".scene-criterion-editor__values");
      if (!(r instanceof HTMLElement)) return;
      (d = r.querySelector(".scene-criterion-editor__empty")) == null || d.remove();
      const a = document.createElement("div");
      a.classList.add("scene-criterion-editor__value");
      const o = _t(S("EIDOLON.SceneCriteria.ValuePlaceholder", "Allowed value")), s = _t(S("EIDOLON.SceneCriteria.RemoveValue", "Remove Value"));
      a.innerHTML = `
      <input type="text" name="criterionValues" value="" placeholder="${o}" class="form-control">
      <button type="button" class="icon" data-action="remove-value" aria-label="${s}" title="${s}">
        <i class="fa-solid fa-trash"></i>
      </button>
    `, r.appendChild(a), (h = a.querySelector('[data-action="remove-value"]')) == null || h.addEventListener("click", m(this, xr)), (f = a.querySelector('input[name="criterionValues"]')) == null || f.addEventListener("input", m(this, Fr)), C(this, De, lr).call(this, i), (g = a.querySelector('input[name="criterionValues"]')) == null || g.focus();
    }, "#onAddValue"));
    k(this, xr, /* @__PURE__ */ c((n) => {
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
        C(this, De, lr).call(this, i);
      }
    }, "#onRemoveValue"));
    k(this, Fr, /* @__PURE__ */ c((n) => {
      var r, a;
      const i = ((r = n.currentTarget) == null ? void 0 : r.form) ?? ((a = this.element) == null ? void 0 : a.querySelector("form"));
      i instanceof HTMLFormElement && C(this, De, lr).call(this, i);
    }, "#onValuesChanged"));
    this.scene = i ?? null, this.criterion = r ?? null, this.onSave = typeof o == "function" ? o : null, this.isNew = !!a, I(this, he, C(this, De, xd).call(this)), I(this, ln, m(this, he).key !== ar(m(this, he).label));
  }
  async _prepareContext() {
    var i, r, a, o;
    const n = Array.isArray((i = m(this, he)) == null ? void 0 : i.values) ? m(this, he).values : [];
    return {
      isNew: this.isNew,
      key: ((r = m(this, he)) == null ? void 0 : r.key) ?? "",
      label: ((a = m(this, he)) == null ? void 0 : a.label) ?? "",
      defaultValue: ((o = m(this, he)) == null ? void 0 : o.default) ?? "",
      values: n.map((s, l) => {
        var u;
        return {
          index: l,
          value: s,
          selected: s === ((u = m(this, he)) == null ? void 0 : u.default)
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
      keyIsCustom: m(this, ln)
    };
  }
  _onRender(n, i) {
    var a, o, s, l, u, d;
    super._onRender(n, i);
    const r = (a = this.element) == null ? void 0 : a.querySelector("form");
    r && (r.addEventListener("submit", m(this, $o)), (o = r.querySelector('[data-action="add-value"]')) == null || o.addEventListener("click", m(this, Po)), (s = r.querySelector('input[name="criterionLabel"]')) == null || s.addEventListener("input", m(this, xo)), (l = r.querySelector('input[name="criterionKey"]')) == null || l.addEventListener("input", m(this, Fo)), (u = r.querySelector('[data-action="reset-auto-key"]')) == null || u.addEventListener("click", m(this, Do)), r.querySelectorAll('[data-action="remove-value"]').forEach((h) => {
      h.addEventListener("click", m(this, xr));
    }), r.querySelectorAll('input[name="criterionValues"]').forEach((h) => {
      h.addEventListener("input", m(this, Fr));
    }), (d = r.querySelector('[data-action="cancel"]')) == null || d.addEventListener("click", (h) => {
      h.preventDefault(), this.close();
    }), C(this, De, Ca).call(this, r), C(this, De, lr).call(this, r));
  }
};
he = new WeakMap(), ln = new WeakMap(), De = new WeakSet(), xd = /* @__PURE__ */ c(function() {
  const n = al(this.criterion, 0, /* @__PURE__ */ new Set()) ?? oc(S("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion"));
  return {
    id: n.id,
    key: n.key,
    label: n.label ?? "",
    values: Array.isArray(n.values) ? [...n.values] : [],
    default: n.default
  };
}, "#initializeState"), $o = new WeakMap(), xo = new WeakMap(), Fo = new WeakMap(), Do = new WeakMap(), Ca = /* @__PURE__ */ c(function(n) {
  const i = n.querySelector('[data-action="reset-auto-key"]');
  i instanceof HTMLButtonElement && (i.disabled = !m(this, ln));
}, "#syncAutoKeyButton"), Po = new WeakMap(), xr = new WeakMap(), Fr = new WeakMap(), lr = /* @__PURE__ */ c(function(n) {
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
}, "#syncDefaultOptions"), Fd = /* @__PURE__ */ c(async function() {
  if (!this.scene) return;
  const n = ht(this.scene).sort((r, a) => r.order - a.order), i = n.findIndex((r) => r.id === m(this, he).id);
  i < 0 ? (m(this, he).order = n.length, n.push(m(this, he))) : (m(this, he).order = n[i].order, n.splice(i, 1, m(this, he)));
  try {
    await Go(this.scene, n), this.onSave && await this.onSave(m(this, he));
  } catch (r) {
    $d(r);
  }
}, "#persist"), c(rn, "CategoryEditorApplication"), pe(rn, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Re(rn, rn, "DEFAULT_OPTIONS"),
  {
    id: `${Se}-criterion-editor`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Gu = Re(rn, rn, "DEFAULT_OPTIONS")) == null ? void 0 : Gu.classes) ?? [], "standard-form", "themed"])
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
)), pe(rn, "PARTS", {
  content: {
    template: `modules/${Se}/templates/scene-criteria-editor.html`
  }
});
let sl = rn;
function ar(t) {
  return String(t ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
c(ar, "slugifyKey");
const yh = `modules/${Se}/templates/scene-criteria-tab.html`, ll = {
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
}, bh = Uo(sl), vh = Id({
  tabId: "criteria",
  tabLabel: /* @__PURE__ */ c(() => S("EIDOLON.SceneCriteria.TabLabel", "Criteria"), "tabLabel"),
  getScene: Yt,
  isApplicable: /* @__PURE__ */ c(() => Vo(), "isApplicable"),
  renderContent: /* @__PURE__ */ c(({ app: t, tab: e, scene: n }) => Eh(t, e, n), "renderContent"),
  logger: ll
});
function wh() {
  return vh.register();
}
c(wh, "registerSceneCriteriaConfigHook");
function Eh(t, e, n) {
  if (!(e instanceof HTMLElement)) return;
  const i = Ye(n) ? n : Yt(t);
  Mi(t, e, i);
}
c(Eh, "renderCriteriaTab");
async function Mi(t, e, n) {
  var r, a;
  const i = n ?? Yt(t);
  ll.group("renderCriteriaTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!Ye(i)) {
      const d = S(
        "EIDOLON.SceneCriteria.Unavailable",
        "Scene criteria are unavailable for this configuration sheet."
      );
      e.innerHTML = `<p class="notes">${d}</p>`;
      return;
    }
    const o = ht(i).sort((d, h) => d.order - h.order), s = Qr(i, o), l = ((a = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : a.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof l != "function") {
      e.innerHTML = `<p class="notes">${S("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
      return;
    }
    const u = await l(yh, {
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
          valueCountLabel: Ch(d.values.length),
          canMoveUp: h > 0,
          canMoveDown: h < o.length - 1
        };
      }),
      hasCriteria: o.length > 0
    });
    e.innerHTML = u, Sh(t, e, i);
  } catch (o) {
    console.error(`${Se} | Failed to render criteria tab`, o), e.innerHTML = `<p class="notes">${S("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
  } finally {
    ll.groupEnd();
  }
}
c(Mi, "renderCriteriaTabContent");
function Sh(t, e, n) {
  const i = n ?? Yt(t);
  if (!Ye(i)) return;
  const r = e.querySelector('[data-criteria-action="add"]');
  r && r.addEventListener("click", () => {
    Wc(t, {
      scene: i,
      criterion: oc(
        S("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion")
      ),
      isNew: !0,
      onSave: /* @__PURE__ */ c(() => Mi(t, e, i), "onSave")
    });
  }), e.querySelectorAll('[data-criteria-action="edit"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", () => {
      const s = ht(i).find((l) => l.id === o);
      s && Wc(t, {
        scene: i,
        criterion: s,
        onSave: /* @__PURE__ */ c(() => Mi(t, e, i), "onSave")
      });
    });
  }), e.querySelectorAll('[data-criteria-action="remove"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await hs(i, (l) => {
        const u = l.findIndex((d) => d.id === o);
        return u < 0 ? !1 : (l.splice(u, 1), gs(l), !0);
      }) && await Mi(t, e, i);
    });
  }), e.querySelectorAll('[data-criteria-action="move-up"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await hs(i, (l) => {
        const u = l.findIndex((h) => h.id === o);
        if (u <= 0) return !1;
        const [d] = l.splice(u, 1);
        return l.splice(u - 1, 0, d), gs(l), !0;
      }) && await Mi(t, e, i);
    });
  }), e.querySelectorAll('[data-criteria-action="move-down"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await hs(i, (l) => {
        const u = l.findIndex((h) => h.id === o);
        if (u < 0 || u >= l.length - 1) return !1;
        const [d] = l.splice(u, 1);
        return l.splice(u + 1, 0, d), gs(l), !0;
      }) && await Mi(t, e, i);
    });
  });
}
c(Sh, "bindCriteriaTabEvents");
async function hs(t, e) {
  const n = ht(t).sort((r, a) => r.order - a.order);
  if (e(n) === !1) return !1;
  try {
    return await Go(t, n), !0;
  } catch (r) {
    return $d(r), !1;
  }
}
c(hs, "mutateCriteria");
function Wc(t, e = {}) {
  const n = e.scene ?? null, i = n && Ye(n) ? n : Yt(t);
  if (!Ye(i))
    return;
  bh({
    scene: i,
    criterion: e.criterion ?? null,
    isNew: !!e.isNew,
    onSave: typeof e.onSave == "function" ? e.onSave : null
  }).render({ force: !0 });
}
c(Wc, "openCriterionEditor");
function gs(t) {
  t.forEach((e, n) => {
    e.order = n;
  });
}
c(gs, "reindexCriteriaOrder");
function Ch(t) {
  var e, n;
  if ((n = (e = game.i18n) == null ? void 0 : e.has) != null && n.call(e, "EIDOLON.SceneCriteria.ValueCountLabel"))
    try {
      return game.i18n.format("EIDOLON.SceneCriteria.ValueCountLabel", { count: t });
    } catch (i) {
      console.error(`${Se} | Failed to format value count label`, i);
    }
  return t === 0 ? "No values configured" : t === 1 ? "1 value" : `${t} values`;
}
c(Ch, "formatValueCount");
let Yc = !1;
function Th() {
  Hooks.once("init", () => {
    fh();
  }), Hooks.once("ready", () => {
    Vo() && (Yc || (wh(), Yc = !0));
  });
}
c(Th, "registerSceneCriteriaHooks");
Th();
const ie = T, Dd = "criteriaEngineVersion", hi = "fileIndex", gi = "tileCriteria", lc = {
  LEGACY: 1,
  CRITERIA: 2
}, Pd = lc.CRITERIA;
function Rd(t) {
  var e;
  return ((e = t == null ? void 0 : t.getFlag) == null ? void 0 : e.call(t, ie, Dd)) ?? lc.LEGACY;
}
c(Rd, "getSceneEngineVersion");
function Lh(t, e, n, i, r) {
  if (!(t != null && t.length) || !(n != null && n.length)) return -1;
  const a = {};
  for (const s of n)
    a[s] = e[s];
  const o = Kc(t, a, n);
  if (o >= 0) return o;
  if (i != null && i.length && r) {
    const s = { ...a };
    for (const l of i) {
      if (!(l in s)) continue;
      s[l] = r[l] ?? "Standard";
      const u = Kc(t, s, n);
      if (u >= 0) return u;
    }
  }
  return -1;
}
c(Lh, "findBestMatch");
function Kc(t, e, n) {
  return t.findIndex((i) => {
    for (const r of n)
      if (i[r] !== e[r]) return !1;
    return !0;
  });
}
c(Kc, "findExactMatch");
function Ih(t, e) {
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
c(Ih, "findFileIndex");
function Ta(t) {
  return t && typeof t == "object" && !Array.isArray(t);
}
c(Ta, "isPlainObject$2");
function Jc(t) {
  return t == null ? t : typeof structuredClone == "function" ? structuredClone(t) : JSON.parse(JSON.stringify(t));
}
c(Jc, "deepClone");
function Oh(t, e) {
  if (!e) return;
  const n = e.split(".").filter(Boolean);
  if (!n.length) return;
  let i = t;
  for (let r = 0; r < n.length - 1; r += 1) {
    if (!Ta(i == null ? void 0 : i[n[r]])) return;
    i = i[n[r]];
  }
  delete i[n.at(-1)];
}
c(Oh, "deletePath");
function Hd(t, e) {
  const n = Jc(t ?? {});
  if (!Ta(e)) return n;
  for (const [i, r] of Object.entries(e)) {
    if (i.startsWith("-=") && r === !0) {
      Oh(n, i.slice(2));
      continue;
    }
    Ta(r) && Ta(n[i]) ? n[i] = Hd(n[i], r) : n[i] = Jc(r);
  }
  return n;
}
c(Hd, "fallbackMerge");
function Ah(t, e) {
  var n, i;
  return (n = foundry == null ? void 0 : foundry.utils) != null && n.mergeObject && ((i = foundry == null ? void 0 : foundry.utils) != null && i.deepClone) ? foundry.utils.mergeObject(t, foundry.utils.deepClone(e), {
    inplace: !1
  }) : Hd(t, e);
}
c(Ah, "defaultMerge");
function kh(t, e) {
  if (!t) return !0;
  for (const n of Object.keys(t))
    if (t[n] !== e[n]) return !1;
  return !0;
}
c(kh, "criteriaMatch");
function qd(t, e, n, i) {
  const r = i ?? Ah;
  let a = r({}, t ?? {});
  if (!(e != null && e.length)) return a;
  const o = [];
  for (let s = 0; s < e.length; s += 1) {
    const l = e[s];
    if (kh(l == null ? void 0 : l.criteria, n)) {
      const u = l != null && l.criteria ? Object.keys(l.criteria).length : 0;
      o.push({ specificity: u, index: s, delta: l == null ? void 0 : l.delta });
    }
  }
  o.sort((s, l) => s.specificity - l.specificity || s.index - l.index);
  for (const s of o)
    s.delta && (a = r(a, s.delta));
  return a;
}
c(qd, "resolveRules");
function zo(t = null) {
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
c(zo, "canManageCriteria");
function Mh(t = null) {
  if (!zo(t))
    throw new Error(`${ie} | You do not have permission to manage scene criteria.`);
}
c(Mh, "requireCriteriaAccess");
const _h = /* @__PURE__ */ c((...t) => console.log(`${ie} | criteria tiles:`, ...t), "log$1");
let Va = /* @__PURE__ */ new WeakMap(), Ga = /* @__PURE__ */ new WeakMap();
const Xc = 200;
function Nh(t) {
  return t ? Number.isInteger(t.size) ? t.size : Array.isArray(t) || typeof t.length == "number" ? t.length : Array.from(t).length : 0;
}
c(Nh, "getCollectionSize$1");
function la() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
c(la, "nowMs$2");
function $h(t) {
  if (!Array.isArray(t)) return [];
  const e = /* @__PURE__ */ new Set();
  for (const n of t) {
    if (typeof n != "string") continue;
    const i = n.trim();
    i && e.add(i);
  }
  return Array.from(e);
}
c($h, "uniqueStringKeys$1");
function xh(t, e = Xc) {
  if (!Array.isArray(t) || t.length === 0) return [];
  const n = Number.isInteger(e) && e > 0 ? e : Xc, i = [];
  for (let r = 0; r < t.length; r += n)
    i.push(t.slice(r, r + n));
  return i;
}
c(xh, "chunkArray$1");
async function Fh(t, e, n) {
  const i = xh(e, n);
  for (const r of i)
    await t.updateEmbeddedDocuments("Tile", r), i.length > 1 && await Promise.resolve();
  return i.length;
}
c(Fh, "updateTilesInChunks");
function Dh(t) {
  var i;
  const e = wi(t, { files: null });
  if (!((i = e == null ? void 0 : e.variants) != null && i.length)) return [];
  const n = /* @__PURE__ */ new Set();
  for (const r of e.variants)
    for (const a of Object.keys(r.criteria ?? {}))
      a && n.add(a);
  return Array.from(n);
}
c(Dh, "getTileCriteriaDependencyKeys");
function Ph(t, e) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
  for (const r of e) {
    const a = r.getFlag(ie, gi) ?? r.getFlag(ie, hi);
    if (a) {
      i.add(r.id);
      for (const o of Dh(a))
        n.has(o) || n.set(o, /* @__PURE__ */ new Set()), n.get(o).add(r.id);
    }
  }
  return {
    collection: e,
    keyToTileIds: n,
    allTileIds: i
  };
}
c(Ph, "buildTileDependencyIndex");
function Rh(t, e) {
  const n = Ga.get(t);
  if ((n == null ? void 0 : n.collection) === e) return n;
  const i = Ph(t, e);
  return Ga.set(t, i), i;
}
c(Rh, "getTileDependencyIndex");
function Hh(t, e, n) {
  const i = $h(n);
  if (!i.length)
    return Array.from(e ?? []);
  const r = Rh(t, e), a = /* @__PURE__ */ new Set();
  for (const o of i) {
    const s = r.keyToTileIds.get(o);
    if (s)
      for (const l of s)
        a.add(l);
  }
  return a.size ? typeof (e == null ? void 0 : e.get) == "function" ? Array.from(a).map((o) => e.get(o)).filter(Boolean) : Array.from(e ?? []).filter((o) => a.has(o.id)) : [];
}
c(Hh, "getTilesForChangedKeys");
function jd(t) {
  return typeof (t == null ? void 0 : t.name) == "string" ? t.name : typeof (t == null ? void 0 : t.src) == "string" ? t.src : "";
}
c(jd, "getFilePath");
function za(t) {
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
c(za, "normalizeFilePath");
function cc(t) {
  if (!Array.isArray(t)) return [];
  const e = /* @__PURE__ */ new Map();
  return t.map((n, i) => {
    const r = za(jd(n)), a = r || `__index:${i}`, o = e.get(a) ?? 0;
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
c(cc, "buildTileFileEntries");
function Hn(t, e) {
  if (!Number.isInteger(e) || e < 0) return null;
  const i = cc(t).find((r) => r.index === e);
  return i ? { ...i.target } : { indexHint: e };
}
c(Hn, "createTileTargetFromIndex");
function Wo(t) {
  if (!t || typeof t != "object") return null;
  const e = za(t.path), n = Number(t.indexHint ?? t.fileIndex), i = Number(t.occurrence), r = {};
  return e && (r.path = e, r.occurrence = Number.isInteger(i) && i >= 0 ? i : 0), Number.isInteger(n) && n >= 0 && (r.indexHint = n), !r.path && !Number.isInteger(r.indexHint) ? null : r;
}
c(Wo, "normalizeTileTarget");
function Lr(t, e) {
  const n = Wo(t);
  if (!n) return -1;
  const i = cc(e);
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
function qn(t) {
  if (!t || typeof t != "object" || Array.isArray(t)) return {};
  const e = {};
  for (const [n, i] of Object.entries(t))
    typeof n != "string" || !n || typeof i != "string" || !i.trim() || (e[n] = i.trim());
  return e;
}
c(qn, "sanitizeCriteria");
function qh(t) {
  return Object.entries(qn(t)).sort(([n], [i]) => n.localeCompare(i)).map(([n, i]) => `${n}=${i}`).join("");
}
c(qh, "serializeCriteria");
function jh(t) {
  return Object.keys(qn(t)).length;
}
c(jh, "getCriteriaSpecificity");
function Bh(t, e) {
  const n = qn(t), i = qn(e);
  for (const [r, a] of Object.entries(n))
    if (r in i && i[r] !== a)
      return !1;
  return !0;
}
c(Bh, "areCriteriaCompatible");
function Uh(t, e) {
  const n = Lr(t, e);
  if (Number.isInteger(n) && n >= 0)
    return `index:${n}`;
  const i = Wo(t);
  if (!i) return "";
  if (i.path) {
    const r = Number.isInteger(i.occurrence) ? i.occurrence : 0;
    return `path:${i.path}#${r}`;
  }
  return Number.isInteger(i.indexHint) ? `hint:${i.indexHint}` : "";
}
c(Uh, "getTargetIdentity");
function Bd(t, e = {}) {
  var s;
  const n = Array.isArray(e.files) ? e.files : [], i = wi(t, { files: n });
  if (!((s = i == null ? void 0 : i.variants) != null && s.length))
    return {
      errors: [],
      warnings: []
    };
  const r = i.variants.map((l, u) => ({
    index: u,
    criteria: qn(l.criteria),
    specificity: jh(l.criteria),
    criteriaSignature: qh(l.criteria),
    targetIdentity: Uh(l.target, n)
  })), a = [], o = [];
  for (let l = 0; l < r.length; l += 1) {
    const u = r[l];
    for (let d = l + 1; d < r.length; d += 1) {
      const h = r[d];
      if (u.specificity !== h.specificity || !Bh(u.criteria, h.criteria)) continue;
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
c(Bd, "detectTileCriteriaConflicts");
function Vh(t, e) {
  if (!t || typeof t != "object") return null;
  let n = Wo(t.target);
  if (!n) {
    const i = Number(t.fileIndex);
    Number.isInteger(i) && i >= 0 && (n = Hn(e, i));
  }
  return n ? {
    criteria: qn(t.criteria),
    target: n
  } : null;
}
c(Vh, "normalizeTileVariant");
function Ud(t, e = {}) {
  if (!Array.isArray(t) || t.length === 0) return null;
  const n = Array.isArray(e.files) ? e.files : null, i = t.map((l, u) => ({
    criteria: qn(l),
    target: Hn(n, u)
  })).filter((l) => l.target);
  if (!i.length) return null;
  const r = i.find((l) => Object.keys(l.criteria).length === 0), a = (r == null ? void 0 : r.target) ?? i[0].target;
  let o = null;
  const s = Number(e.defaultFileIndex);
  return Number.isInteger(s) && s >= 0 && (o = Hn(n, s)), o || (o = a), {
    strategy: "select-one",
    variants: i,
    defaultTarget: o
  };
}
c(Ud, "buildTileCriteriaFromFileIndex");
function wi(t, e = {}) {
  const n = Array.isArray(e.files) ? e.files : null;
  if (Array.isArray(t))
    return Ud(t, { files: n });
  if (!t || typeof t != "object") return null;
  const i = Array.isArray(t.variants) ? t.variants.map((a) => Vh(a, n)).filter(Boolean) : [];
  if (!i.length) return null;
  let r = Wo(t.defaultTarget);
  if (!r) {
    const a = Number(t.defaultFileIndex);
    Number.isInteger(a) && a >= 0 && (r = Hn(n, a));
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
c(wi, "normalizeTileCriteria");
function Gh(t, e) {
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
c(Gh, "selectTileFileIndexFromCompiled");
function zh(t, e) {
  const n = wi(t, { files: e });
  if (!n) return null;
  const i = n.variants.map((a) => {
    const o = qn(a.criteria), s = Lr(a.target, e);
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
c(zh, "compileTileMatcher");
function Wh(t, e, n) {
  const i = Va.get(t);
  if (i && i.tileCriteria === e && i.files === n)
    return i.compiled;
  const r = zh(e, n);
  return Va.set(t, {
    tileCriteria: e,
    files: n,
    compiled: r
  }), r;
}
c(Wh, "getCompiledTileMatcher");
function Yh(t = null, e = null) {
  t ? Ga.delete(t) : Ga = /* @__PURE__ */ new WeakMap(), e ? Va.delete(e) : t || (Va = /* @__PURE__ */ new WeakMap());
}
c(Yh, "invalidateTileCriteriaCaches");
async function Vd(t, e, n = {}) {
  var l, u, d, h;
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
  r.total = Nh(a);
  const o = Hh(e, a, n.changedKeys);
  if (r.scanned = o.length, !o.length)
    return r.skipped.unaffected = r.total, r.durationMs = la() - i, r;
  const s = [];
  for (const f of o) {
    const g = f.getFlag(ie, gi) ?? f.getFlag(ie, hi);
    if (!g) {
      r.skipped.noCriteria += 1;
      continue;
    }
    const p = f.getFlag("monks-active-tiles", "files");
    if (!(p != null && p.length)) {
      r.skipped.noFiles += 1;
      continue;
    }
    const y = Wh(f, g, p), b = Gh(y, t);
    if (!Number.isInteger(b) || b < 0 || b >= p.length) {
      console.warn(`${ie} | Tile ${f.id} has no valid file match for state`, t), r.skipped.noMatch += 1;
      continue;
    }
    const v = b + 1, E = Number(f.getFlag("monks-active-tiles", "fileindex")) !== v, L = p.some((D, F) => !!(D != null && D.selected) != (F === b)), A = za(((u = f.texture) == null ? void 0 : u.src) ?? ((h = (d = f._source) == null ? void 0 : d.texture) == null ? void 0 : h.src) ?? ""), O = jd(p[b]), M = za(O), x = !!M && M !== A;
    if (!L && !E && !x) {
      r.skipped.unchanged += 1;
      continue;
    }
    const R = {
      _id: f._id
    };
    L && (R["flags.monks-active-tiles.files"] = p.map((D, F) => ({
      ...D,
      selected: F === b
    }))), E && (R["flags.monks-active-tiles.fileindex"] = v), x && (R.texture = { src: O }), s.push(R), _h(`Tile ${f.id} -> ${O}`);
  }
  return s.length > 0 && (r.chunks = await Fh(e, s, n.chunkSize), r.updated = s.length), r.durationMs = la() - i, r;
}
c(Vd, "updateTiles");
function Kh() {
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
c(Kh, "buildLightControlsMap");
const pi = T, Hi = "lightCriteria", uc = Object.freeze({
  base: null,
  mappings: [],
  current: null
});
function ps(t) {
  return t && typeof t == "object" && !Array.isArray(t);
}
c(ps, "isPlainObject$1");
function Gd(t, e) {
  if (!ps(e)) return {};
  const n = {};
  for (const [i, r] of Object.entries(e)) {
    const a = t == null ? void 0 : t[i];
    if (ps(r) && ps(a)) {
      const o = Gd(a, r);
      Object.keys(o).length > 0 && (n[i] = o);
    } else r !== a && (n[i] = Wt(r));
  }
  return n;
}
c(Gd, "computeDelta");
function zd(t) {
  var n;
  const e = ((n = t == null ? void 0 : t.getFlag) == null ? void 0 : n.call(t, pi, Hi)) ?? uc;
  return Ir(e);
}
c(zd, "getLightCriteriaState");
async function Wd(t, e) {
  const n = Ir(e);
  if (!(t != null && t.setFlag))
    return n;
  const i = n.base !== null, r = n.mappings.length > 0, a = n.current !== null;
  return !i && !r && !a ? (typeof t.unsetFlag == "function" ? await t.unsetFlag(pi, Hi) : await t.setFlag(pi, Hi, null), uc) : (await t.setFlag(pi, Hi, n), n);
}
c(Wd, "setLightCriteriaState");
async function Zr(t, e) {
  if (typeof e != "function")
    throw new TypeError("updateLightCriteriaState requires an updater function.");
  const n = Wt(zd(t)), i = await e(n);
  return Wd(t, i);
}
c(Zr, "updateLightCriteriaState");
async function Qc(t, e) {
  const n = Ei(e);
  if (!n)
    throw new Error("Invalid light configuration payload.");
  return Zr(t, (i) => ({
    ...i,
    base: n
  }));
}
c(Qc, "storeBaseLighting");
async function Zc(t, e, n, { label: i } = {}) {
  const r = ea(e);
  if (!r)
    throw new Error("Cannot create a mapping without at least one category selection.");
  const a = Ei(n);
  if (!a)
    throw new Error("Invalid light configuration payload.");
  return Zr(t, (o) => {
    const s = er(r), l = Array.isArray(o == null ? void 0 : o.mappings) ? [...o.mappings] : [], u = l.findIndex((g) => (g == null ? void 0 : g.key) === s), d = u >= 0 ? l[u] : null, h = typeof (d == null ? void 0 : d.id) == "string" && d.id.trim() ? d.id.trim() : Kd(), f = Yo({
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
c(Zc, "upsertLightCriteriaMapping");
async function Jh(t, e, n, i, { replaceExisting: r = !1 } = {}) {
  const a = typeof e == "string" ? e.trim() : "";
  if (!a)
    throw new Error("A mapping id is required to retarget criteria.");
  const o = ea(n);
  if (!o)
    throw new Error("Cannot retarget mapping without at least one category selection.");
  const s = Ei(i);
  if (!s)
    throw new Error("Invalid light configuration payload.");
  return Zr(t, (l) => {
    const u = Array.isArray(l == null ? void 0 : l.mappings) ? [...l.mappings] : [], d = u.findIndex((v) => (v == null ? void 0 : v.id) === a);
    if (d < 0)
      throw new Error("The selected mapping no longer exists.");
    const h = er(o), f = u.findIndex(
      (v, w) => w !== d && (v == null ? void 0 : v.key) === h
    );
    if (f >= 0 && !r)
      throw new Error("A mapping already exists for the selected criteria.");
    const g = u[d], p = Yo({
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
c(Jh, "retargetLightCriteriaMapping");
async function Xh(t, e) {
  const n = typeof e == "string" ? e.trim() : "";
  if (!n)
    throw new Error("A mapping id is required to remove a mapping.");
  return Zr(t, (i) => {
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
c(Xh, "removeLightCriteriaMapping");
async function hr(t, e) {
  const n = Yd(e);
  return Zr(t, (i) => ({
    ...i,
    current: n
  }));
}
c(hr, "storeCurrentCriteriaSelection");
function Qh(t) {
  const e = Ir(t), n = e.base ?? {}, i = [];
  for (const r of e.mappings) {
    const a = ea(r == null ? void 0 : r.categories);
    if (!a) continue;
    const o = Gd(n, (r == null ? void 0 : r.config) ?? {});
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
c(Qh, "convertLightCriteriaStateToPresets");
function Zh(t, e = []) {
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
    return u ? Yo({
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
c(Zh, "migrateLightCriteriaCategoriesToKeys");
function Ir(t) {
  var l;
  const e = Wt(t);
  if (!e || typeof e != "object")
    return Wt(uc);
  const n = Ei(e.base), i = Array.isArray(e.mappings) ? e.mappings : [], r = /* @__PURE__ */ new Map();
  for (const u of i) {
    const d = Yo(u);
    d && r.set(d.key, d);
  }
  const a = Array.from(r.values()), o = new Map(a.map((u) => [u.id, u]));
  let s = Yd(e.current);
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
function Ei(t) {
  const e = Wt(t);
  if (!e || typeof e != "object") return null;
  "_id" in e && delete e._id, "id" in e && delete e.id;
  const n = e.flags;
  if (n && typeof n == "object") {
    const i = n[pi];
    i && typeof i == "object" && (delete i[Hi], Object.keys(i).length === 0 && delete n[pi]), Object.keys(n).length === 0 && delete e.flags;
  }
  return e;
}
c(Ei, "sanitizeLightConfigPayload");
function Yo(t) {
  if (!t || typeof t != "object") return null;
  const e = ea(t.categories);
  if (!e) return null;
  const n = Ei(t.config);
  if (!n) return null;
  const i = typeof t.id == "string" && t.id.trim() ? t.id.trim() : Kd(), r = er(e), a = {
    id: i,
    key: r,
    categories: e,
    config: n,
    updatedAt: Number.isFinite(t.updatedAt) ? Number(t.updatedAt) : Date.now()
  };
  return typeof t.label == "string" && t.label.trim() && (a.label = t.label.trim()), a;
}
c(Yo, "sanitizeCriteriaMappingEntry");
function Yd(t) {
  if (!t || typeof t != "object") return null;
  const e = typeof t.mappingId == "string" && t.mappingId.trim() ? t.mappingId.trim() : null, n = ea(t.categories);
  return !e && !n ? null : {
    mappingId: e,
    categories: n,
    updatedAt: Number.isFinite(t.updatedAt) ? Number(t.updatedAt) : Date.now()
  };
}
c(Yd, "sanitizeCurrentSelection");
function ea(t) {
  const e = {};
  if (Array.isArray(t))
    for (const n of t) {
      const i = eu((n == null ? void 0 : n.id) ?? (n == null ? void 0 : n.categoryId) ?? (n == null ? void 0 : n.category)), r = tu((n == null ? void 0 : n.value) ?? (n == null ? void 0 : n.selection) ?? (n == null ? void 0 : n.label));
      !i || !r || (e[i] = r);
    }
  else if (t && typeof t == "object")
    for (const [n, i] of Object.entries(t)) {
      const r = eu(n), a = tu(i);
      !r || !a || (e[r] = a);
    }
  return Object.keys(e).length > 0 ? e : null;
}
c(ea, "sanitizeCriteriaCategories");
function er(t) {
  if (!t || typeof t != "object") return "";
  const e = Object.entries(t).filter(([, n]) => typeof n == "string" && n).map(([n, i]) => `${n}:${i}`);
  return e.sort((n, i) => n < i ? -1 : n > i ? 1 : 0), e.join("|");
}
c(er, "computeCriteriaMappingKey");
function Kd() {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
c(Kd, "generateLightMappingId");
function eu(t) {
  if (typeof t != "string") return null;
  const e = t.trim();
  return e || null;
}
c(eu, "normalizeCategoryId");
function tu(t) {
  if (typeof t != "string") return null;
  const e = t.trim();
  return e || null;
}
c(tu, "normalizeCategoryValue");
const Wa = ["AmbientLight", "Wall", "AmbientSound"];
let Ya = /* @__PURE__ */ new WeakMap(), Ka = /* @__PURE__ */ new WeakMap();
const nu = 200;
function eg(t) {
  return t ? Number.isInteger(t.size) ? t.size : Array.isArray(t) || typeof t.length == "number" ? t.length : Array.from(t).length : 0;
}
c(eg, "getCollectionSize");
function ys() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
c(ys, "nowMs$1");
function tg(t) {
  if (!Array.isArray(t)) return [];
  const e = /* @__PURE__ */ new Set();
  for (const n of t) {
    if (typeof n != "string") continue;
    const i = n.trim();
    i && e.add(i);
  }
  return Array.from(e);
}
c(tg, "uniqueStringKeys");
function ng(t, e = nu) {
  if (!Array.isArray(t) || t.length === 0) return [];
  const n = Number.isInteger(e) && e > 0 ? e : nu, i = [];
  for (let r = 0; r < t.length; r += n)
    i.push(t.slice(r, r + n));
  return i;
}
c(ng, "chunkArray");
async function ig(t, e, n, i) {
  const r = ng(n, i);
  for (const a of r)
    await t.updateEmbeddedDocuments(e, a), r.length > 1 && await Promise.resolve();
  return r.length;
}
c(ig, "updatePlaceablesInChunks");
function rg(t) {
  const e = /* @__PURE__ */ new Set();
  for (const n of (t == null ? void 0 : t.rules) ?? [])
    for (const i of Object.keys((n == null ? void 0 : n.criteria) ?? {}))
      i && e.add(i);
  return Array.from(e);
}
c(rg, "getPresetDependencyKeys");
function ag(t, e) {
  const n = /* @__PURE__ */ new Map();
  for (const i of Wa) {
    const r = e.get(i) ?? [], a = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Map();
    for (const s of r) {
      const l = Xd(s, i);
      if (l != null && l.base) {
        a.add(s.id);
        for (const u of rg(l))
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
c(ag, "buildPlaceableDependencyIndex");
function og(t, e) {
  const n = Ka.get(t);
  if (n && Wa.every((r) => n.collectionsByType.get(r) === e.get(r)))
    return n;
  const i = ag(t, e);
  return Ka.set(t, i), i;
}
c(og, "getPlaceableDependencyIndex");
function sg(t, e, n) {
  if (!e || !t) return [];
  const i = tg(n);
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
c(sg, "getDocsForChangedKeys");
function Ni(t) {
  return !!t && typeof t == "object" && !Array.isArray(t);
}
c(Ni, "isPlainObject");
function cl(t, e) {
  if (Object.is(t, e)) return !0;
  if (Array.isArray(t) || Array.isArray(e)) {
    if (!Array.isArray(t) || !Array.isArray(e) || t.length !== e.length) return !1;
    for (let n = 0; n < t.length; n += 1)
      if (!cl(t[n], e[n])) return !1;
    return !0;
  }
  if (Ni(t) || Ni(e)) {
    if (!Ni(t) || !Ni(e)) return !1;
    const n = Object.keys(e);
    for (const i of n)
      if (!cl(t[i], e[i])) return !1;
    return !0;
  }
  return !1;
}
c(cl, "areValuesEqual");
function Jd(t, e) {
  const n = { _id: e._id };
  for (const [r, a] of Object.entries(e)) {
    if (r === "_id") continue;
    const o = t == null ? void 0 : t[r];
    if (Ni(a) && Ni(o)) {
      const s = Jd(o, { _id: e._id, ...a });
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
c(Jd, "buildChangedPayload");
function Xd(t, e) {
  var s;
  const n = ((s = t == null ? void 0 : t.flags) == null ? void 0 : s[ie]) ?? {}, i = (n == null ? void 0 : n.presets) ?? null, r = e === "AmbientLight" ? (n == null ? void 0 : n.lightCriteria) ?? null : null, a = Ya.get(t);
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
    const l = Qh(n.lightCriteria);
    (l.base && Object.keys(l.base).length > 0 || l.rules.length > 0) && (o = {
      base: l.base,
      rules: l.rules
    });
  }
  return Ya.set(t, {
    type: e,
    rawPresets: i,
    rawLightCriteria: r,
    presets: o
  }), o;
}
c(Xd, "getPresetsForDocument");
function lg(t = null, e = null) {
  t ? Ka.delete(t) : Ka = /* @__PURE__ */ new WeakMap(), e ? Ya.delete(e) : t || (Ya = /* @__PURE__ */ new WeakMap());
}
c(lg, "invalidatePlaceableCriteriaCaches");
async function Qd(t, e, n = {}) {
  var l, u;
  const i = ys(), r = {
    total: 0,
    scanned: 0,
    updated: 0,
    chunks: 0,
    byType: {},
    durationMs: 0
  };
  if (e = e ?? ((l = game.scenes) == null ? void 0 : l.viewed), !e)
    return r.durationMs = ys() - i, r;
  const a = new Set(Kh()), o = new Map(
    Wa.map((d) => [d, e.getEmbeddedCollection(d) ?? []])
  ), s = og(e, o);
  for (const d of Wa) {
    const h = o.get(d) ?? [], f = {
      total: eg(h),
      scanned: 0,
      updated: 0,
      chunks: 0
    }, g = s.byType.get(d) ?? null, p = sg(h, g, n.changedKeys);
    if (f.scanned = p.length, r.total += f.total, r.scanned += f.scanned, r.byType[d] = f, !p.length) continue;
    const y = [];
    for (const b of p) {
      const v = Xd(b, d);
      if (!(v != null && v.base)) continue;
      const w = qd(v.base, v.rules ?? [], t);
      w._id = b._id, d === "AmbientLight" && a.has(b._id) && (w.hidden = !0);
      const E = (b == null ? void 0 : b._source) ?? ((u = b == null ? void 0 : b.toObject) == null ? void 0 : u.call(b)) ?? {}, L = Jd(E, w);
      L && y.push(L);
    }
    y.length > 0 && (f.chunks = await ig(e, d, y, n.chunkSize), f.updated = y.length, r.updated += y.length, r.chunks += f.chunks, console.log(`${ie} | Updated ${y.length} ${d}(s)`));
  }
  return r.durationMs = ys() - i, r;
}
c(Qd, "updatePlaceables");
function Ja() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
c(Ja, "nowMs");
const ca = /* @__PURE__ */ new Map();
function cg(t) {
  var e;
  return t = t ?? ((e = game.scenes) == null ? void 0 : e.viewed), t ? Qr(t) : null;
}
c(cg, "getState");
async function ug(t, e, n = 0) {
  var g;
  const i = Ja();
  if (e = e ?? ((g = game.scenes) == null ? void 0 : g.viewed), !e) return null;
  Mh(e);
  const r = ht(e);
  if (!r.length)
    return console.warn(`${ie} | applyState skipped: scene has no criteria.`), null;
  const a = Qr(e, r), o = sc({ ...a, ...t ?? {} }, r), s = r.filter((p) => (a == null ? void 0 : a[p.key]) !== (o == null ? void 0 : o[p.key])).map((p) => p.key), l = s.length > 0;
  l && await hh(e, o, r);
  const u = l ? o : a, [d, h] = await Promise.all([
    Vd(u, e, { changedKeys: s }),
    Qd(u, e, { changedKeys: s })
  ]), f = Ja() - i;
  return _("Criteria apply telemetry", {
    sceneId: e.id,
    changedKeys: s,
    didChange: l,
    queuedMs: n,
    durationMs: f,
    tiles: d,
    placeables: h
  }), Hooks.callAll("eidolon-utilities.criteriaStateApplied", e, u), u;
}
c(ug, "applyStateInternal");
async function Zd(t, e) {
  var l;
  if (e = e ?? ((l = game.scenes) == null ? void 0 : l.viewed), !e) return null;
  const n = e.id ?? "__viewed__", i = Ja(), r = ca.get(n) ?? Promise.resolve();
  let a = null;
  const o = r.catch(() => null).then(async () => {
    const u = Ja() - i;
    return ug(t, e, u);
  });
  a = o;
  const s = o.finally(() => {
    ca.get(n) === s && ca.delete(n);
  });
  return ca.set(n, s), a;
}
c(Zd, "applyState$1");
function dg(t) {
  var e;
  return t = t ?? ((e = game.scenes) == null ? void 0 : e.viewed), t ? Rd(t) : null;
}
c(dg, "getVersion");
async function ef(t, e) {
  var n;
  e = e ?? ((n = game.scenes) == null ? void 0 : n.viewed), e != null && e.setFlag && await e.setFlag(ie, Dd, Number(t));
}
c(ef, "setVersion");
async function fg(t) {
  return ef(Pd, t);
}
c(fg, "markCurrentVersion");
const cr = "Standard", mg = /* @__PURE__ */ c((...t) => console.log(`${ie} | criteria indexer:`, ...t), "log");
function dc(t) {
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
c(dc, "parseFileTags");
function hg(t, e, n = cr) {
  return t != null && t.length ? t.map((i) => {
    const r = dc(i == null ? void 0 : i.name);
    if (!r) return {};
    const a = {};
    for (const [o, s] of Object.entries(e)) {
      const l = r[Number(o)];
      l != null && l !== n && (a[s] = l);
    }
    return a;
  }) : [];
}
c(hg, "buildFileIndex");
function gg(t, e) {
  return t.map((n, i) => {
    const r = [...e[n] ?? /* @__PURE__ */ new Set()].sort(), o = r.includes(cr) ? cr : r[0] ?? cr, s = oc(n);
    return s.key = n, s.label = n.charAt(0).toUpperCase() + n.slice(1), s.values = r.length ? r : [cr], s.default = s.values.includes(o) ? o : s.values[0], s.order = i, s;
  });
}
c(gg, "buildCriteriaDefinitions");
async function ua(t, e, n, { dryRun: i = !1 } = {}) {
  const r = t.getFlag("monks-active-tiles", "files");
  if (!(r != null && r.length)) return null;
  const a = hg(r, e), o = Ud(a, { files: r });
  for (const s of r) {
    const l = dc(s == null ? void 0 : s.name);
    if (l)
      for (const [u, d] of Object.entries(e)) {
        const h = l[Number(u)];
        h != null && n[d] && n[d].add(h);
      }
  }
  return i || (await t.setFlag(ie, gi, o), typeof t.unsetFlag == "function" && await t.unsetFlag(ie, hi)), { files: r.length };
}
c(ua, "indexTile");
async function pg(t, e = {}) {
  var w, E, L, A;
  const {
    dryRun: n = !1,
    force: i = !1
  } = e;
  if (t = t ?? ((w = game.scenes) == null ? void 0 : w.viewed), !t) throw new Error("No scene provided to indexScene.");
  if (!globalThis.Tagger) throw new Error("Tagger is required to index scene criteria.");
  if (!i && Rd(t) >= Pd)
    throw new Error(
      `Scene "${t.name}" is already criteria-indexed. Use force: true to re-index.`
    );
  const r = { sceneId: t.id }, a = Tagger.getByTag("Map", r) ?? [];
  if (!a.length) throw new Error("No Map tile found.");
  if (a.length > 1) throw new Error(`Expected 1 Map tile, found ${a.length}.`);
  const o = a[0], s = o.getFlag("monks-active-tiles", "files");
  if (!(s != null && s.length)) throw new Error("Map tile has no MATT files.");
  const l = dc((E = s[0]) == null ? void 0 : E.name);
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
  const b = {
    map: null,
    floor: [],
    roof: [],
    weather: []
  };
  b.map = await ua(o, f, y, { dryRun: n });
  for (const O of u) {
    const M = await ua(O, f, y, { dryRun: n });
    M && b.floor.push(M);
  }
  for (const O of d) {
    const M = await ua(O, f, y, { dryRun: n });
    M && b.roof.push(M);
  }
  for (const O of h) {
    const M = await ua(O, p, y, { dryRun: n });
    M && b.weather.push(M);
  }
  const v = gg(g, y);
  return n || (await Go(t, v), await fg(t)), mg(
    n ? "Dry run complete" : "Indexing complete",
    `- ${v.length} criteria,`,
    `${((A = b.map) == null ? void 0 : A.files) ?? 0} map files`
  ), {
    criteria: v,
    state: v.reduce((O, M) => (O[M.key] = M.default, O), {}),
    tiles: b,
    overlayMode: h.length > 0
  };
}
c(pg, "indexScene");
var zu, qe, ut, dt, li, Qe, qt, Cn, Ro, ce, tf, nf, rf, dl, af, fl, of, ur, ml;
const vt = class vt extends Vn(Un) {
  constructor(n = {}) {
    var i;
    super(n);
    k(this, ce);
    k(this, qe, null);
    k(this, ut, []);
    k(this, dt, {});
    k(this, li, !1);
    k(this, Qe, null);
    k(this, qt, null);
    k(this, Cn, null);
    k(this, Ro, 120);
    this.setScene(n.scene ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null);
  }
  setScene(n) {
    var i;
    I(this, qe, n ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null), C(this, ce, tf).call(this);
  }
  get scene() {
    return m(this, qe);
  }
  async _prepareContext() {
    var r;
    const n = !!m(this, qe), i = n && m(this, ut).length > 0;
    return {
      hasScene: n,
      hasCriteria: i,
      sceneName: ((r = m(this, qe)) == null ? void 0 : r.name) ?? S("EIDOLON.CriteriaSwitcher.NoScene", "No active scene"),
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
      criteria: m(this, ut).map((a) => ({
        key: a.key,
        label: a.label || a.key,
        values: a.values.map((o) => {
          var s;
          return {
            value: o,
            selected: ((s = m(this, dt)) == null ? void 0 : s[a.key]) === o
          };
        }),
        defaultValue: a.default
      })),
      stateSummary: C(this, ce, ml).call(this)
    };
  }
  _onRender(n, i) {
    super._onRender(n, i), C(this, ce, nf).call(this), C(this, ce, rf).call(this);
  }
  async _onClose(n) {
    return m(this, Qe) !== null && (clearTimeout(m(this, Qe)), I(this, Qe, null)), m(this, Cn) !== null && (Hooks.off("eidolon-utilities.criteriaStateApplied", m(this, Cn)), I(this, Cn, null)), super._onClose(n);
  }
};
qe = new WeakMap(), ut = new WeakMap(), dt = new WeakMap(), li = new WeakMap(), Qe = new WeakMap(), qt = new WeakMap(), Cn = new WeakMap(), Ro = new WeakMap(), ce = new WeakSet(), tf = /* @__PURE__ */ c(function() {
  if (!m(this, qe)) {
    I(this, ut, []), I(this, dt, {});
    return;
  }
  I(this, ut, ht(m(this, qe)).sort((n, i) => n.order - i.order)), I(this, dt, Qr(m(this, qe), m(this, ut)));
}, "#hydrateFromScene"), nf = /* @__PURE__ */ c(function() {
  var i, r;
  const n = this.element;
  n instanceof HTMLElement && (n.querySelectorAll("[data-criteria-key]").forEach((a) => {
    a.addEventListener("change", (o) => {
      const s = o.currentTarget;
      if (!(s instanceof HTMLSelectElement)) return;
      const l = s.dataset.criteriaKey;
      l && (I(this, dt, {
        ...m(this, dt),
        [l]: s.value
      }), C(this, ce, af).call(this, { [l]: s.value }));
    });
  }), (i = n.querySelector("[data-action='reset-defaults']")) == null || i.addEventListener("click", () => {
    C(this, ce, of).call(this);
  }), (r = n.querySelector("[data-action='close-switcher']")) == null || r.addEventListener("click", () => {
    this.close();
  }));
}, "#bindEvents"), rf = /* @__PURE__ */ c(function() {
  m(this, Cn) === null && I(this, Cn, Hooks.on("eidolon-utilities.criteriaStateApplied", (n, i) => {
    !m(this, qe) || (n == null ? void 0 : n.id) !== m(this, qe).id || m(this, li) || (I(this, dt, { ...i ?? {} }), this.render({ force: !0 }));
  }));
}, "#ensureSyncHook"), dl = /* @__PURE__ */ c(async function(n) {
  var i, r;
  if (m(this, qe)) {
    C(this, ce, ur).call(this, "applying"), I(this, li, !0);
    try {
      const a = await Zd(n, m(this, qe));
      a && I(this, dt, a), C(this, ce, ur).call(this, "ready"), this.render({ force: !0 });
    } catch (a) {
      console.error(`${ie} | Failed to apply criteria state`, a), (r = (i = ui.notifications) == null ? void 0 : i.error) == null || r.call(
        i,
        S(
          "EIDOLON.CriteriaSwitcher.ApplyError",
          "Failed to apply the selected criteria state."
        )
      ), C(this, ce, ur).call(this, "error", (a == null ? void 0 : a.message) ?? "Unknown error");
    } finally {
      I(this, li, !1), m(this, qt) && C(this, ce, fl).call(this);
    }
  }
}, "#applyPartialState"), af = /* @__PURE__ */ c(function(n) {
  I(this, qt, {
    ...m(this, qt) ?? {},
    ...n ?? {}
  }), m(this, Qe) !== null && clearTimeout(m(this, Qe)), C(this, ce, ur).call(this, "applying"), I(this, Qe, setTimeout(() => {
    I(this, Qe, null), C(this, ce, fl).call(this);
  }, m(this, Ro)));
}, "#queuePartialState"), fl = /* @__PURE__ */ c(async function() {
  if (m(this, li) || !m(this, qt)) return;
  const n = m(this, qt);
  I(this, qt, null), await C(this, ce, dl).call(this, n);
}, "#flushPendingState"), of = /* @__PURE__ */ c(async function() {
  if (!m(this, ut).length) return;
  const n = m(this, ut).reduce((i, r) => (i[r.key] = r.default, i), {});
  I(this, dt, n), m(this, Qe) !== null && (clearTimeout(m(this, Qe)), I(this, Qe, null)), I(this, qt, null), await C(this, ce, dl).call(this, n);
}, "#resetToDefaults"), ur = /* @__PURE__ */ c(function(n, i = "") {
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
        a.textContent = `${S("EIDOLON.CriteriaSwitcher.Ready", "Ready")}: ${C(this, ce, ml).call(this)}`;
        break;
    }
}, "#setStatus"), ml = /* @__PURE__ */ c(function() {
  return m(this, ut).length ? `[${m(this, ut).map((n) => {
    var i;
    return ((i = m(this, dt)) == null ? void 0 : i[n.key]) ?? n.default;
  }).join(" | ")}]` : "-";
}, "#formatStateSummary"), c(vt, "CriteriaSwitcherApplication"), pe(vt, "APP_ID", `${ie}-criteria-switcher`), pe(vt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Re(vt, vt, "DEFAULT_OPTIONS"),
  {
    id: vt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((zu = Re(vt, vt, "DEFAULT_OPTIONS")) == null ? void 0 : zu.classes) ?? [], "eidolon-criteria-switcher-window", "themed"])
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
)), pe(vt, "PARTS", {
  content: {
    template: `modules/${ie}/templates/criteria-switcher.html`
  }
});
let ul = vt;
const yg = Uo(ul);
let yi = null;
function bg(t) {
  var e;
  return t ?? ((e = game.scenes) == null ? void 0 : e.viewed) ?? null;
}
c(bg, "resolveScene");
function vg(t) {
  var e;
  return !!(t != null && t.rendered && ((e = t == null ? void 0 : t.element) != null && e.isConnected));
}
c(vg, "isRendered");
function Ko() {
  return vg(yi) ? yi : (yi = null, null);
}
c(Ko, "getCriteriaSwitcher");
function sf(t) {
  var i, r, a, o, s;
  const e = bg(t);
  if (!e)
    return (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "No active scene to open the criteria switcher."), null;
  if (!zo(e))
    return (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, "You do not have permission to manage scene criteria."), null;
  const n = Ko();
  return n ? (n.setScene(e), n.render({ force: !0 }), (s = n.bringToFront) == null || s.call(n), n) : (yi = yg({ scene: e }), yi.render({ force: !0 }), yi);
}
c(sf, "openCriteriaSwitcher");
function lf() {
  const t = Ko();
  t && (t.close(), yi = null);
}
c(lf, "closeCriteriaSwitcher");
function fc(t) {
  return Ko() ? (lf(), null) : sf(t);
}
c(fc, "toggleCriteriaSwitcher");
const wg = {
  SCHEMA_VERSION: lc,
  applyState: Zd,
  getState: cg,
  getVersion: dg,
  setVersion: ef,
  getCriteria(t) {
    var e;
    return ht(t ?? ((e = game.scenes) == null ? void 0 : e.viewed));
  },
  setCriteria(t, e) {
    var n;
    return Go(e ?? ((n = game.scenes) == null ? void 0 : n.viewed), t);
  },
  updateTiles: Vd,
  updatePlaceables: Qd,
  indexScene: pg,
  openCriteriaSwitcher: sf,
  closeCriteriaSwitcher: lf,
  toggleCriteriaSwitcher: fc,
  findBestMatch: Lh,
  findFileIndex: Ih,
  resolveRules: qd
};
function Eg(t) {
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
c(Eg, "findTabNav");
function Sg(t, e) {
  var i, r, a;
  return t instanceof HTMLElement ? [
    (i = t.querySelector(".tab[data-tab]")) == null ? void 0 : i.parentElement,
    t.querySelector(".sheet-body"),
    (a = (r = e == null ? void 0 : e.parentElement) == null ? void 0 : r.querySelector) == null ? void 0 : a.call(r, ":scope > .sheet-body"),
    e == null ? void 0 : e.parentElement
  ].find((o) => o instanceof HTMLElement) ?? null : null;
}
c(Sg, "findTabBody");
function Cg(t, e) {
  var n, i, r, a, o, s, l;
  return ((n = t == null ? void 0 : t.dataset) == null ? void 0 : n.group) ?? ((a = (r = (i = t == null ? void 0 : t.querySelector) == null ? void 0 : i.call(t, "[data-group]")) == null ? void 0 : r.dataset) == null ? void 0 : a.group) ?? ((l = (s = (o = e == null ? void 0 : e.querySelector) == null ? void 0 : o.call(e, ".tab[data-group]")) == null ? void 0 : s.dataset) == null ? void 0 : l.group) ?? "main";
}
c(Cg, "getTabGroup");
function Tg(t, e, n) {
  if (!(t instanceof HTMLElement)) return;
  t.textContent = "";
  const i = document.createElement("i");
  i.className = n, i.setAttribute("inert", ""), t.append(i, " ");
  const r = document.createElement("span");
  r.textContent = e, t.append(r);
}
c(Tg, "setTabButtonContent");
function Lg(t, e, n) {
  const i = t.querySelector("[data-tab]"), r = (i == null ? void 0 : i.tagName) || "A", a = document.createElement(r);
  return i instanceof HTMLElement && (a.className = i.className), a.classList.remove("active"), r === "BUTTON" && (a.type = "button"), a.dataset.action = "tab", a.dataset.tab = n, a.dataset.group = e, a.setAttribute("aria-selected", "false"), a.setAttribute("aria-pressed", "false"), a;
}
c(Lg, "createTabButton");
function Ig(t, e, n) {
  const i = document.createElement("div");
  i.classList.add("tab"), i.dataset.tab = n, i.dataset.group = e, i.dataset.applicationPart = n, i.setAttribute("hidden", "true");
  const r = Od(t);
  return t.insertBefore(i, r ?? null), i;
}
c(Ig, "createTabPanel");
function bs(t, e, n, i, r) {
  var s;
  if (!(i instanceof HTMLElement) || !(r instanceof HTMLElement)) return;
  const a = (s = t == null ? void 0 : t.tabGroups) == null ? void 0 : s[e];
  if (typeof a == "string" ? a === n : i.classList.contains("active") || r.classList.contains("active")) {
    i.classList.add("active"), i.setAttribute("aria-selected", "true"), i.setAttribute("aria-pressed", "true"), r.classList.add("active"), r.removeAttribute("hidden"), r.removeAttribute("aria-hidden");
    return;
  }
  i.classList.remove("active"), i.setAttribute("aria-selected", "false"), i.setAttribute("aria-pressed", "false"), r.classList.remove("active"), r.setAttribute("hidden", "true");
}
c(bs, "syncTabVisibility");
function mc(t, e, n, i, r) {
  const a = Eg(e), o = Sg(e, a);
  if (!(a instanceof HTMLElement) || !(o instanceof HTMLElement)) return null;
  const s = Cg(a, o);
  let l = a.querySelector(`[data-tab="${n}"]`);
  l instanceof HTMLElement || (l = Lg(a, s, n), a.appendChild(l)), Tg(l, i, r);
  let u = o.querySelector(`.tab[data-tab="${n}"]`);
  u instanceof HTMLElement || (u = Ig(o, s, n));
  const d = `data-eidolon-bound-${n}`;
  return l.hasAttribute(d) || (l.addEventListener("click", () => {
    Ld(t, n, s), requestAnimationFrame(() => {
      bs(t, s, n, l, u);
    });
  }), l.setAttribute(d, "true")), bs(t, s, n, l, u), requestAnimationFrame(() => {
    bs(t, s, n, l, u);
  }), Og(t, a), u;
}
c(mc, "ensureTileConfigTab");
function Og(t, e) {
  !(t != null && t.setPosition) || !(e instanceof HTMLElement) || requestAnimationFrame(() => {
    var a;
    if (e.scrollWidth <= e.clientWidth) return;
    const n = e.scrollWidth - e.clientWidth, i = t.element instanceof HTMLElement ? t.element : (a = t.element) == null ? void 0 : a[0];
    if (!i) return;
    const r = i.offsetWidth || 480;
    t.setPosition({ width: r + n + 16 });
  });
}
c(Og, "fitNavWidth");
function cf(t) {
  var e;
  return ((e = t == null ? void 0 : t.getFlag) == null ? void 0 : e.call(t, "monks-active-tiles", "files")) ?? [];
}
c(cf, "getTileFiles$1");
function Ag(t = []) {
  return {
    strategy: "select-one",
    defaultTarget: Hn(t, 0) ?? { indexHint: 0 },
    variants: [
      {
        criteria: {},
        target: Hn(t, 0) ?? { indexHint: 0 }
      }
    ]
  };
}
c(Ag, "createDefaultTileCriteria");
function kg(t, e = {}) {
  var o, s;
  const { allowLegacy: n = !0 } = e, i = cf(t), r = (o = t == null ? void 0 : t.getFlag) == null ? void 0 : o.call(t, ie, gi);
  if (r) return wi(r, { files: i });
  if (!n) return null;
  const a = (s = t == null ? void 0 : t.getFlag) == null ? void 0 : s.call(t, ie, hi);
  return a ? wi(a, { files: i }) : null;
}
c(kg, "getTileCriteria");
async function iu(t, e, n = {}) {
  if (!(t != null && t.setFlag)) return null;
  const {
    strictValidation: i = !0
  } = n, r = cf(t), a = wi(e, { files: r });
  if (!a)
    return typeof t.unsetFlag == "function" ? (await t.unsetFlag(ie, gi), await t.unsetFlag(ie, hi)) : (await t.setFlag(ie, gi, null), await t.setFlag(ie, hi, null)), null;
  if (i) {
    const o = Bd(a, { files: r });
    if (o.errors.length > 0)
      throw new Error(
        `Tile criteria contains ${o.errors.length} conflicting rule pair(s). Resolve clashes before saving.`
      );
  }
  return await t.setFlag(ie, gi, a), typeof t.unsetFlag == "function" && await t.unsetFlag(ie, hi), a;
}
c(iu, "setTileCriteria");
const hl = "__eidolon_any__", gl = "eidolon-tile-criteria", Mg = "fa-solid fa-sliders", uf = Symbol.for("eidolon.tileCriteriaUiState"), Jo = ["all", "unmapped", "mapped", "conflicts"];
function _g(t) {
  const e = t == null ? void 0 : t[uf];
  return !e || typeof e != "object" ? {
    filterQuery: "",
    filterMode: "all",
    selectedFileIndex: null
  } : {
    filterQuery: typeof e.filterQuery == "string" ? e.filterQuery : "",
    filterMode: Jo.includes(e.filterMode) ? e.filterMode : "all",
    selectedFileIndex: Number.isInteger(e.selectedFileIndex) ? e.selectedFileIndex : null
  };
}
c(_g, "readUiState");
function Ng(t, e) {
  if (!t || !e) return;
  typeof e.filterQuery == "string" && (t.filterQuery = e.filterQuery), Jo.includes(e.filterMode) && (t.filterMode = e.filterMode), Number.isInteger(e.selectedFileIndex) && t.fileEntries.some((i) => i.index === e.selectedFileIndex) && (t.selectedFileIndex = e.selectedFileIndex);
}
c(Ng, "applyUiState");
function $g(t) {
  const e = t == null ? void 0 : t.app, n = t == null ? void 0 : t.state;
  !e || !n || (e[uf] = {
    filterQuery: typeof n.filterQuery == "string" ? n.filterQuery : "",
    filterMode: Jo.includes(n.filterMode) ? n.filterMode : "all",
    selectedFileIndex: Number.isInteger(n.selectedFileIndex) ? n.selectedFileIndex : null
  });
}
c($g, "persistUiState");
function xg(t) {
  const e = (t == null ? void 0 : t.object) ?? (t == null ? void 0 : t.document) ?? null;
  return !(e != null && e.isEmbedded) || e.documentName !== "Tile" ? null : e;
}
c(xg, "getTileDocument$2");
function Fg(t) {
  var e;
  return ((e = t == null ? void 0 : t.getFlag) == null ? void 0 : e.call(t, "monks-active-tiles", "files")) ?? [];
}
c(Fg, "getTileFiles");
function Dg(t, e) {
  var s;
  const n = (t == null ? void 0 : t.parent) ?? ((s = game.scenes) == null ? void 0 : s.viewed) ?? null, r = ht(n).sort((l, u) => l.order - u.order).map((l) => ({
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
c(Dg, "getCriteriaDefinitions");
function Pg(t) {
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
c(Pg, "buildTree");
function Rg(t, e) {
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
c(Rg, "collapseFolderBranch");
function Hg(t, e) {
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
c(Hg, "getRuleSummariesForFile");
function pl(t) {
  var g, p;
  const e = Fg(t), n = cc(e), i = kg(t, { allowLegacy: !0 }) ?? Ag(e), r = Dg(t, i), a = new Map(r.map((y) => [y.key, y.label])), o = new Map(
    n.map((y) => [
      y.index,
      y.path || y.label
    ])
  ), s = Lr(i.defaultTarget, e), l = ((g = n[0]) == null ? void 0 : g.index) ?? 0, u = s >= 0 ? s : l, d = new Map(n.map((y) => [y.index, []]));
  let h = 1;
  for (const y of i.variants ?? []) {
    const b = Lr(y.target, e);
    b < 0 || (d.has(b) || d.set(b, []), d.get(b).push({
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
c(pl, "buildEditorState");
function yl(t, e) {
  return t.rulesByFile.has(e) || t.rulesByFile.set(e, []), t.rulesByFile.get(e);
}
c(yl, "getRulesForFile");
function qg(t) {
  return Object.fromEntries(
    Object.entries(t ?? {}).filter(([e, n]) => typeof e == "string" && e && typeof n == "string" && n.trim()).map(([e, n]) => [e, n.trim()])
  );
}
c(qg, "sanitizeRuleCriteria");
function df(t) {
  const e = Hn(t.files, t.defaultIndex);
  if (!e) return null;
  const n = [], i = [];
  for (const [a, o] of t.rulesByFile.entries()) {
    const s = Hn(t.files, a);
    if (s)
      for (const [l, u] of o.entries()) {
        const d = qg(u.criteria);
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
    normalized: wi(
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
c(df, "buildTileCriteriaDraft");
function jg(t) {
  var e;
  return ((e = df(t)) == null ? void 0 : e.normalized) ?? null;
}
c(jg, "exportTileCriteria");
function ru(t) {
  const e = df(t);
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
c(ru, "analyzeRuleConflicts");
function da(t, e = "neutral") {
  const n = document.createElement("span");
  return n.classList.add("eidolon-tile-criteria__badge"), n.dataset.kind = e, n.textContent = t, n;
}
c(da, "createBadge");
function Bg(t, e = {}) {
  const n = typeof t == "string" ? t : "", {
    maxLength: i = 42,
    headLength: r = 20,
    tailLength: a = 16
  } = e;
  if (!n || n.length <= i) return n;
  const o = n.slice(0, r).trimEnd(), s = n.slice(-a).trimStart();
  return `${o}...${s}`;
}
c(Bg, "middleEllipsis");
function Ug(t) {
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
c(Ug, "createRegexFilter");
function Vg(t, e) {
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
c(Vg, "createCriterionSelect");
function Gg(t, e, n, i) {
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
    const h = Vg(l, (s = t.criteria) == null ? void 0 : s[l.key]);
    h.addEventListener("change", () => {
      h.value === hl ? delete t.criteria[l.key] : t.criteria[l.key] = h.value, i();
    }), u.appendChild(h), a.appendChild(u);
  }
  r.appendChild(a);
  const o = document.createElement("button");
  return o.type = "button", o.classList.add("control", "ui-control", "eidolon-tile-criteria__rule-remove"), o.textContent = S("EIDOLON.TileCriteria.RemoveRule", "Remove"), o.addEventListener("click", () => {
    const u = yl(e, n).filter((d) => d.id !== t.id);
    e.rulesByFile.set(n, u), i();
  }), r.appendChild(o), r;
}
c(Gg, "renderRuleEditor");
const La = /* @__PURE__ */ new WeakMap();
function ff(t) {
  return (t == null ? void 0 : t.app) ?? (t == null ? void 0 : t.tile) ?? null;
}
c(ff, "getDialogOwner");
function zg(t) {
  for (const e of t) {
    const n = $t(e);
    if (n) return n;
    const i = $t(e == null ? void 0 : e.element);
    if (i) return i;
  }
  return null;
}
c(zg, "findDialogRoot$1");
function Wg(t, e, n) {
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
    i.defaultIndex = r.index, We(t), n();
  })), u.appendChild(d);
  const h = document.createElement("button");
  h.type = "button", h.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action", "secondary"), h.textContent = S("EIDOLON.TileCriteria.ClearFileRules", "Clear File Rules"), h.addEventListener("click", () => {
    i.rulesByFile.set(r.index, []), We(t), n();
  }), u.appendChild(h), a.appendChild(u);
  const f = document.createElement("div");
  f.classList.add("eidolon-tile-criteria__rule-editors");
  const g = yl(i, r.index);
  if (g.length)
    for (const y of g)
      f.appendChild(
        Gg(y, i, r.index, () => {
          We(t), n();
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
    yl(i, r.index).push({
      id: i.nextRuleId,
      criteria: {}
    }), i.nextRuleId += 1, We(t), n();
  }), a.appendChild(p), a;
}
c(Wg, "buildRuleEditorContent");
function Yg(t, e) {
  var h, f, g;
  const n = ff(t);
  if (!n) return;
  const i = La.get(n);
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
  La.set(n, r);
  const a = /* @__PURE__ */ c(() => {
    La.delete(n);
  }, "closeDialog"), o = /* @__PURE__ */ c(() => {
    r.host instanceof HTMLElement && r.host.replaceChildren(
      Wg(r.controller, r.fileIndex, o)
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
        const y = zg(p), b = (v = y == null ? void 0 : y.querySelector) == null ? void 0 : v.call(y, ".eidolon-tile-criteria-editor-host");
        b instanceof HTMLElement && (r.host = b, o());
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
c(Yg, "openRuleEditorDialog");
function au(t) {
  var i;
  const e = ff(t);
  if (!e) return;
  const n = La.get(e);
  (i = n == null ? void 0 : n.refresh) == null || i.call(n);
}
c(au, "refreshOpenRuleEditor");
function bl(t, e) {
  return (t.rulesByFile.get(e) ?? []).length > 0;
}
c(bl, "hasRulesForFile");
function mf(t, e) {
  var n, i;
  return ((n = t == null ? void 0 : t.errorFileIndexes) == null ? void 0 : n.includes(e)) || ((i = t == null ? void 0 : t.warningFileIndexes) == null ? void 0 : i.includes(e));
}
c(mf, "hasConflictForFile");
function Kg(t, e, n) {
  switch (t.filterMode) {
    case "unmapped":
      return !bl(t, e.index);
    case "mapped":
      return bl(t, e.index);
    case "conflicts":
      return mf(n, e.index);
    case "all":
    default:
      return !0;
  }
}
c(Kg, "matchesFilterMode");
function Jg(t, e) {
  let n = 0, i = 0, r = 0;
  for (const a of t.fileEntries)
    bl(t, a.index) ? n += 1 : i += 1, mf(e, a.index) && (r += 1);
  return {
    all: t.fileEntries.length,
    mapped: n,
    unmapped: i,
    conflicts: r
  };
}
c(Jg, "getFilterModeCounts");
function Xg(t) {
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
c(Xg, "getFilterModeLabel");
function hf(t, e, n, i, r) {
  var u, d;
  const a = [...t.folders.keys()].sort((h, f) => h.localeCompare(f));
  for (const h of a) {
    const f = Rg(h, t.folders.get(h)), g = document.createElement("li");
    g.classList.add("eidolon-tile-criteria__tree-branch");
    const p = document.createElement("div");
    p.classList.add("document", "folder", "update", "eidolon-tile-criteria__folder-row");
    const y = document.createElement("i");
    y.classList.add("fa-solid", "fa-folder-open"), p.appendChild(y);
    const b = document.createElement("span");
    b.classList.add("eidolon-tile-criteria__tree-folder-label"), b.textContent = f.label, b.title = f.label, p.appendChild(b), g.appendChild(p);
    const v = document.createElement("ul");
    v.classList.add("eidolon-tile-criteria__tree"), v.dataset.folder = f.label, hf(f.node, e, n, i, v), v.childElementCount > 0 && g.appendChild(v), r.appendChild(g);
  }
  const o = [...t.files].sort((h, f) => h.name.localeCompare(f.name));
  if (!o.length) return;
  const s = document.createElement("li"), l = document.createElement("ul");
  l.classList.add("document-list", "eidolon-tile-criteria__document-list");
  for (const h of o) {
    const f = h.entry, g = f.index === e.selectedFileIndex, p = f.index === e.defaultIndex, y = Hg(e, f.index), b = document.createElement("li");
    b.classList.add("document", "update", "eidolon-tile-criteria__tree-file");
    const v = document.createElement("button");
    v.type = "button", v.classList.add("eidolon-tile-criteria__file-row");
    const w = (u = i == null ? void 0 : i.errorFileIndexes) == null ? void 0 : u.includes(f.index), E = (d = i == null ? void 0 : i.warningFileIndexes) == null ? void 0 : d.includes(f.index);
    w ? v.classList.add("has-conflict") : E && v.classList.add("has-warning");
    const L = e.relativePaths.get(f.index) || f.path || h.name, A = [L];
    w ? A.push(
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
      e.selectedFileIndex = f.index, We(n), Yg(n, f.index);
    });
    const O = document.createElement("span");
    O.classList.add("eidolon-tile-criteria__indicator"), O.dataset.kind = p ? "default" : y.length ? "mapped" : "unmapped", v.appendChild(O);
    const M = document.createElement("span");
    M.classList.add("eidolon-tile-criteria__file-content");
    const x = document.createElement("span");
    x.classList.add("eidolon-tile-criteria__file-heading");
    const R = document.createElement("span");
    R.classList.add("eidolon-tile-criteria__file-title"), R.textContent = Bg(h.name || f.label), R.title = L, x.appendChild(R);
    const D = da(`#${f.index + 1}`, "meta");
    D.classList.add("eidolon-tile-criteria__index-badge"), x.appendChild(D), M.appendChild(x);
    const F = document.createElement("span");
    F.classList.add("eidolon-tile-criteria__badges"), p && F.appendChild(da(S("EIDOLON.TileCriteria.DefaultBadge", "Default"), "default"));
    const N = y.slice(0, 2);
    for (const H of N)
      F.appendChild(da(H, "rule"));
    if (y.length > N.length && F.appendChild(da(`+${y.length - N.length}`, "meta")), M.appendChild(F), v.appendChild(M), w || E) {
      const H = document.createElement("span");
      H.classList.add("eidolon-tile-criteria__row-warning"), H.dataset.mode = w ? "error" : "warning", H.innerHTML = '<i class="fa-solid fa-triangle-exclamation" inert=""></i>', v.appendChild(H);
    }
    b.appendChild(v), l.appendChild(b);
  }
  s.appendChild(l), r.appendChild(s);
}
c(hf, "renderTreeNode");
function Qg(t, e, n, i = {}) {
  const r = document.createElement("section");
  r.classList.add("eidolon-tile-criteria__tree-panel");
  const a = Ug(t.filterQuery), o = Jg(t, n);
  t.filterMode !== "all" && o[t.filterMode] === 0 && (t.filterMode = "all");
  const s = document.createElement("div");
  s.classList.add("eidolon-tile-criteria__toolbar");
  const l = document.createElement("div");
  l.classList.add("eidolon-tile-criteria__mode-bar");
  for (const w of Jo) {
    const E = document.createElement("button");
    E.type = "button", E.classList.add("control", "ui-control", "eidolon-tile-criteria__mode-button"), E.dataset.mode = w, E.textContent = Xg(w);
    const L = w === "all" || o[w] > 0;
    E.disabled = !L, L || (E.dataset.tooltip = S(
      "EIDOLON.TileCriteria.FilterModeUnavailable",
      "No entries currently match this filter."
    ), E.title = E.dataset.tooltip), t.filterMode === w ? (E.classList.add("is-active"), E.setAttribute("aria-pressed", "true")) : E.setAttribute("aria-pressed", "false"), E.addEventListener("click", () => {
      t.filterMode !== w && (t.filterMode = w, We(e));
    }), l.appendChild(E);
  }
  s.appendChild(l);
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
    const E = d.selectionStart ?? d.value.length, L = d.selectionEnd ?? E;
    t.filterQuery = d.value, We(e), requestAnimationFrame(() => {
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
    var w;
    (w = i.onSave) == null || w.call(i);
  }), h.appendChild(f);
  const p = document.createElement("button");
  p.type = "button";
  const y = S("EIDOLON.TileCriteria.Clear", "Clear Rules");
  if (p.classList.add("control", "ui-control", "secondary", "eidolon-tile-criteria__toolbar-action", "icon-only"), p.dataset.tooltip = y, p.setAttribute("aria-label", y), p.title = y, p.innerHTML = '<i class="fa-solid fa-trash" inert=""></i>', p.addEventListener("click", () => {
    var w;
    (w = i.onClear) == null || w.call(i);
  }), h.appendChild(p), u.appendChild(h), s.appendChild(u), r.appendChild(s), a.error) {
    const w = document.createElement("p");
    w.classList.add("notes", "eidolon-tile-criteria__filter-error"), w.textContent = `${S("EIDOLON.TileCriteria.InvalidRegex", "Invalid regex")}: ${a.error}`, r.appendChild(w);
  }
  const b = document.createElement("div");
  b.classList.add("eidolon-tile-criteria__library-tree");
  const v = t.fileEntries.filter((w) => {
    const E = t.relativePaths.get(w.index) || w.path || w.label;
    return Kg(t, w, n) && a.matches(E);
  });
  if (t.fileEntries.length)
    if (v.length) {
      const w = document.createElement("ul");
      w.classList.add("eidolon-tile-criteria__tree"), hf(Pg(v), t, e, n, w), b.appendChild(w);
    } else {
      const w = document.createElement("p");
      w.classList.add("notes"), w.textContent = S("EIDOLON.TileCriteria.NoMatches", "No variants match this filter."), b.appendChild(w);
    }
  else {
    const w = document.createElement("p");
    w.classList.add("notes"), w.textContent = S("EIDOLON.TileCriteria.NoVariants", "No MATT variants found"), b.appendChild(w);
  }
  return r.appendChild(b), r;
}
c(Qg, "renderTreePanel");
function We(t) {
  const { section: e, state: n } = t, i = ru(n);
  $g(t), e.replaceChildren();
  const r = /* @__PURE__ */ c(async () => {
    try {
      const o = ru(n);
      if (o.errors.length) {
        n.status = {
          mode: "error",
          message: S(
            "EIDOLON.TileCriteria.ConflictSaveBlocked",
            `Resolve ${o.errors.length} conflict(s) before saving tile criteria rules.`
          )
        }, We(t);
        return;
      }
      const s = jg(n);
      if (!s) {
        n.status = {
          mode: "error",
          message: S("EIDOLON.TileCriteria.Invalid", "Invalid rules. Select valid target variants.")
        }, We(t);
        return;
      }
      await iu(t.tile, s);
      const l = n.filterQuery, u = n.filterMode, d = n.selectedFileIndex;
      t.state = pl(t.tile), t.state.filterQuery = l, t.state.filterMode = u, Number.isInteger(d) && (t.state.selectedFileIndex = d), t.state.status = {
        mode: "ready",
        message: S("EIDOLON.TileCriteria.Saved", "Tile criteria rules saved.")
      }, We(t), au(t);
    } catch (o) {
      console.error(`${ie} | Failed to save tile criteria`, o), n.status = {
        mode: "error",
        message: (o == null ? void 0 : o.message) ?? "Failed to save tile criteria rules."
      }, We(t);
    }
  }, "handleSave"), a = /* @__PURE__ */ c(async () => {
    try {
      await iu(t.tile, null);
      const o = n.filterQuery, s = n.filterMode, l = n.selectedFileIndex;
      t.state = pl(t.tile), t.state.filterQuery = o, t.state.filterMode = s, Number.isInteger(l) && (t.state.selectedFileIndex = l), t.state.status = {
        mode: "ready",
        message: S("EIDOLON.TileCriteria.Cleared", "Tile criteria rules cleared.")
      }, We(t), au(t);
    } catch (o) {
      console.error(`${ie} | Failed to clear tile criteria`, o), n.status = {
        mode: "error",
        message: (o == null ? void 0 : o.message) ?? "Failed to clear tile criteria rules."
      }, We(t);
    }
  }, "handleClear");
  if (e.appendChild(Qg(n, t, i, {
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
c(We, "renderController");
function Zg(t, e = null) {
  const n = document.createElement("section");
  n.classList.add("eidolon-tile-criteria");
  const i = pl(t);
  Ng(i, _g(e));
  const r = {
    app: e,
    tile: t,
    section: n,
    state: i
  };
  return We(r), r;
}
c(Zg, "createController");
function ep(t, e) {
  return mc(
    t,
    e,
    gl,
    S("EIDOLON.TileCriteria.TabLabel", "Criteria"),
    Mg
  );
}
c(ep, "ensureTileCriteriaTab");
function tp() {
  Hooks.on("renderTileConfig", (t, e) => {
    var l, u, d, h;
    const n = $t(e);
    if (!n) return;
    const i = xg(t);
    if (!i) return;
    if ((l = n.querySelector(".eidolon-tile-criteria")) == null || l.remove(), !Vo()) {
      (u = n.querySelector(`.item[data-tab='${gl}']`)) == null || u.remove(), (d = n.querySelector(`.tab[data-tab='${gl}']`)) == null || d.remove();
      return;
    }
    const r = Zg(i, t), a = ep(t, n);
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
c(tp, "registerTileCriteriaConfigControls");
function np(t) {
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
c(np, "toList");
function ip(t, e) {
  const n = t == null ? void 0 : t.tools;
  return Array.isArray(n) ? n.some((i) => (i == null ? void 0 : i.name) === e) : n instanceof Map ? n.has(e) : n && typeof n == "object" ? e in n ? !0 : Object.values(n).some((i) => (i == null ? void 0 : i.name) === e) : !1;
}
c(ip, "hasTool");
function rp(t, e) {
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
c(rp, "addTool");
function ap() {
  Hooks.on("getSceneControlButtons", (t) => {
    var i;
    const e = np(t);
    if (!e.length) return;
    const n = e.find((r) => (r == null ? void 0 : r.name) === "tiles") ?? e.find((r) => (r == null ? void 0 : r.name) === "tokens" || (r == null ? void 0 : r.name) === "token") ?? e[0];
    n && (ip(n, "eidolonCriteriaSwitcher") || rp(n, {
      name: "eidolonCriteriaSwitcher",
      title: "Criteria Switcher",
      icon: "fa-solid fa-sliders",
      button: !0,
      toggle: !1,
      visible: zo(((i = game.scenes) == null ? void 0 : i.viewed) ?? null),
      onClick: /* @__PURE__ */ c(() => fc(), "onClick")
    }));
  });
}
c(ap, "registerSceneControlButton");
function fa(t, e) {
  if (!t || typeof t != "object") return !1;
  const n = String(e).split(".");
  let i = t;
  for (const r of n) {
    if (!i || typeof i != "object" || !Object.prototype.hasOwnProperty.call(i, r)) return !1;
    i = i[r];
  }
  return !0;
}
c(fa, "hasOwnPath");
function op() {
  const t = /* @__PURE__ */ c((i, r = null) => {
    i && Yh(i, r);
  }, "invalidateTileScene"), e = /* @__PURE__ */ c((i, r = null) => {
    i && lg(i, r);
  }, "invalidatePlaceableScene");
  Hooks.on("createTile", (i) => {
    t((i == null ? void 0 : i.parent) ?? null, i ?? null);
  }), Hooks.on("deleteTile", (i) => {
    t((i == null ? void 0 : i.parent) ?? null, i ?? null);
  }), Hooks.on("updateTile", (i, r) => {
    (fa(r, `flags.${ie}.tileCriteria`) || fa(r, `flags.${ie}.fileIndex`)) && t((i == null ? void 0 : i.parent) ?? null, i ?? null);
  });
  const n = /* @__PURE__ */ c((i) => {
    Hooks.on(`create${i}`, (r) => {
      e((r == null ? void 0 : r.parent) ?? null, r ?? null);
    }), Hooks.on(`delete${i}`, (r) => {
      e((r == null ? void 0 : r.parent) ?? null, r ?? null);
    }), Hooks.on(`update${i}`, (r, a) => {
      const o = fa(a, `flags.${ie}.presets`), s = i === "AmbientLight" && fa(a, `flags.${ie}.lightCriteria`);
      !o && !s || e((r == null ? void 0 : r.parent) ?? null, r ?? null);
    });
  }, "registerPlaceableHooks");
  n("AmbientLight"), n("Wall"), n("AmbientSound"), Hooks.on("canvasReady", (i) => {
    const r = (i == null ? void 0 : i.scene) ?? null;
    r && (t(r), e(r));
  });
}
c(op, "registerCriteriaCacheInvalidationHooks");
function sp() {
  ap(), tp(), op(), Hooks.once("init", () => {
    var t, e;
    (e = (t = game.keybindings) == null ? void 0 : t.register) == null || e.call(t, ie, "toggleCriteriaSwitcher", {
      name: "Toggle Criteria Switcher",
      hint: "Open or close the criteria switcher window for live scene state updates.",
      editable: [{ key: "KeyM", modifiers: ["Alt"] }],
      onDown: /* @__PURE__ */ c(() => {
        var n, i, r;
        return zo(((n = game.scenes) == null ? void 0 : n.viewed) ?? null) ? (fc(), !0) : ((r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "You do not have permission to manage scene criteria."), !0);
      }, "onDown"),
      restricted: !0,
      precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
    });
  }), Hooks.on("canvasReady", (t) => {
    var n;
    const e = Ko();
    e && (e.setScene((t == null ? void 0 : t.scene) ?? ((n = game.scenes) == null ? void 0 : n.viewed) ?? null), e.render({ force: !0 }));
  }), Hooks.once("ready", () => {
    var e, n;
    const t = (n = (e = game.modules) == null ? void 0 : e.get) == null ? void 0 : n.call(e, ie);
    t && (t.api || (t.api = {}), t.api.criteria = wg, console.log(`${ie} | Criteria engine API registered`));
  });
}
c(sp, "registerCriteriaEngineHooks");
sp();
const Ia = /* @__PURE__ */ new WeakMap(), ma = /* @__PURE__ */ new WeakMap(), ye = "__eidolon_default__";
function lp() {
  Hooks.on("renderAmbientLightConfig", cp), _("LightCriteria | AmbientLightConfig controls registered");
}
c(lp, "registerAmbientLightCriteriaControls");
function cp(t, e) {
  var n;
  Wi("LightCriteria | renderAmbientLightConfig", {
    appId: (t == null ? void 0 : t.id) ?? null,
    constructor: ((n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) ?? null,
    isRendered: (t == null ? void 0 : t.rendered) ?? !1
  });
  try {
    const i = $t(e);
    if (!i) return;
    if (!Vo()) {
      i.querySelectorAll(".eidolon-light-criteria, .eidolon-light-criteria-main-switcher").forEach((r) => r.remove());
      return;
    }
    up(t, i);
  } catch (i) {
    console.error("eidolon-utilities | Failed to enhance AmbientLightConfig UI", i);
  } finally {
    $n();
  }
}
c(cp, "handleAmbientLightConfigRender");
function up(t, e) {
  var Ne, zn, nr, ra, Nc;
  const n = (t == null ? void 0 : t.form) instanceof HTMLFormElement ? t.form : e instanceof HTMLFormElement ? e : (Ne = e == null ? void 0 : e.closest) == null ? void 0 : Ne.call(e, "form");
  if (!(n instanceof HTMLFormElement)) return;
  const i = n.querySelector(".window-content");
  if (!(i instanceof HTMLElement)) return;
  const r = pf(t);
  if (!r) return;
  const a = Np(r);
  _("LightCriteria | Resolved ambient light", {
    sheetId: (r == null ? void 0 : r.id) ?? null,
    persistedId: (a == null ? void 0 : a.id) ?? null,
    sameRef: r === a
  });
  const o = (a == null ? void 0 : a.parent) ?? r.parent ?? null, s = o ? gh(o) : [], l = s.filter(
    ($) => Array.isArray($ == null ? void 0 : $.values) && $.values.length > 0
  ), u = Sp(s), d = s.map(($) => typeof ($ == null ? void 0 : $.id) == "string" ? $.id : null).filter(($) => !!$), h = a ?? r, f = o ? ht(o) : [];
  let g = zd(h);
  const p = Zh(g, f);
  JSON.stringify(p) !== JSON.stringify(g) && (g = p, Wd(h, p).catch(($) => {
    console.warn("eidolon-utilities | Failed to persist migrated light criteria keys", $);
  })), _("LightCriteria | Loaded mapping state", {
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
  v.textContent = S("EIDOLON.LightCriteria.Legend", "Scene Criteria Lighting"), b.appendChild(v);
  const w = document.createElement("p");
  w.classList.add("notes"), w.textContent = S(
    "EIDOLON.LightCriteria.Description",
    "Capture a base lighting state, then map criteria values to lighting configurations."
  ), b.appendChild(w);
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
  ), A.setAttribute("aria-expanded", "false"), E.appendChild(A), b.appendChild(E);
  const O = document.createElement("p");
  O.classList.add("notes", "eidolon-light-criteria__status"), b.appendChild(O);
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
  const N = document.createElement("span");
  N.classList.add("eidolon-light-criteria__filter-summary-label"), N.textContent = S(
    "EIDOLON.LightCriteria.FilterHeading",
    "Filter mappings"
  ), F.appendChild(N);
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
    Z.classList.add("eidolon-light-criteria__filter-name"), Z.textContent = (nr = (zn = $.name) == null ? void 0 : zn.trim) != null && nr.call(zn) ? $.name.trim() : S("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), G.appendChild(Z);
    const ee = document.createElement("select");
    ee.dataset.filterCategoryId = $.id, ee.classList.add("eidolon-light-criteria__filter-select");
    const ne = document.createElement("option");
    ne.value = "", ne.textContent = S("EIDOLON.LightCriteria.FilterAny", "Any"), ee.appendChild(ne);
    for (const ue of $.values) {
      const de = document.createElement("option");
      de.value = ue, de.textContent = ue, ee.appendChild(de);
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
  const Jt = document.createElement("summary");
  Jt.classList.add("eidolon-light-criteria__menu-toggle"), Jt.innerHTML = '<i class="fa-solid fa-ellipsis-vertical" inert=""></i>', Jt.setAttribute(
    "aria-label",
    S("EIDOLON.LightCriteria.MoreActions", "More actions")
  ), Jt.dataset.tooltip = S("EIDOLON.LightCriteria.MoreActions", "More actions"), te.appendChild(Jt);
  const gt = document.createElement("div");
  gt.classList.add("eidolon-light-criteria__menu-list"), te.appendChild(gt);
  const Pe = document.createElement("button");
  Pe.type = "button", Pe.dataset.action = "update-selected-mapping", Pe.classList.add("eidolon-light-criteria__menu-item"), Pe.textContent = S(
    "EIDOLON.LightCriteria.UpdateSelected",
    "Save current config to selected"
  ), gt.appendChild(Pe);
  const it = document.createElement("button");
  it.type = "button", it.dataset.action = "edit-selected-mapping-criteria", it.classList.add("eidolon-light-criteria__menu-item"), it.textContent = S(
    "EIDOLON.LightCriteria.EditSelectedCriteria",
    "Edit selected mapping criteria"
  ), gt.appendChild(it);
  const rt = document.createElement("button");
  rt.type = "button", rt.dataset.action = "remove-selected-mapping", rt.classList.add("eidolon-light-criteria__menu-item", "danger"), rt.textContent = S(
    "EIDOLON.LightCriteria.RemoveSelected",
    "Delete selected mapping"
  ), gt.appendChild(rt), K.appendChild(te);
  const Xt = document.createElement("div");
  Xt.classList.add("eidolon-light-criteria-main-switcher"), Xt.appendChild(M);
  const Ke = document.createElement("p");
  if (Ke.classList.add("notes", "eidolon-light-criteria-main-switcher__empty"), Ke.textContent = S(
    "EIDOLON.LightCriteria.ActiveRequiresBase",
    "Set Base Lighting to enable mapping selection and actions."
  ), Xt.appendChild(Ke), s.length === 0) {
    const $ = document.createElement("p");
    $.classList.add("notification", "warning", "eidolon-light-criteria__warning"), $.textContent = S(
      "EIDOLON.LightCriteria.NoCategoriesWarning",
      "This scene has no criteria configured. Add criteria under Scene -> Criteria to enable criteria-driven lighting."
    ), b.appendChild($);
  } else if (l.length === 0) {
    const $ = document.createElement("p");
    $.classList.add("notification", "warning", "eidolon-light-criteria__warning"), $.textContent = S(
      "EIDOLON.LightCriteria.NoValuesWarning",
      "Criteria exist, but none define selectable values. Add values in Scene -> Criteria."
    ), b.appendChild($);
  }
  const Ie = document.createElement("div");
  Ie.classList.add("eidolon-light-criteria__creation"), Ie.dataset.section = "creation", Ie.hidden = !0;
  const Li = document.createElement("p");
  Li.classList.add("notes"), Li.textContent = S(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ), Ie.appendChild(Li);
  const Qt = document.createElement("div");
  Qt.classList.add("eidolon-light-criteria__category-list"), Ie.appendChild(Qt);
  for (const $ of l) {
    const G = document.createElement("label");
    G.classList.add("eidolon-light-criteria__category");
    const Z = document.createElement("span");
    Z.classList.add("eidolon-light-criteria__category-name"), Z.textContent = (Nc = (ra = $.name) == null ? void 0 : ra.trim) != null && Nc.call(ra) ? $.name.trim() : S("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), G.appendChild(Z);
    const ee = document.createElement("select");
    ee.dataset.categoryId = $.id, ee.classList.add("eidolon-light-criteria__category-select");
    const ne = document.createElement("option");
    ne.value = "", ne.textContent = S(
      "EIDOLON.LightCriteria.IgnoreCategory",
      "Ignore"
    ), ee.appendChild(ne);
    for (const ue of $.values) {
      const de = document.createElement("option");
      de.value = ue, de.textContent = ue, ee.appendChild(de);
    }
    G.appendChild(ee), Qt.appendChild(G);
  }
  const Gn = document.createElement("div");
  Gn.classList.add("eidolon-light-criteria__creation-actions");
  const at = document.createElement("button");
  at.type = "button", at.dataset.action = "save-mapping", at.classList.add("eidolon-light-criteria__button", "primary"), at.textContent = S(
    "EIDOLON.LightCriteria.SaveMapping",
    "Save Mapping"
  ), Gn.appendChild(at);
  const Zt = document.createElement("button");
  Zt.type = "button", Zt.dataset.action = "cancel-create", Zt.classList.add("eidolon-light-criteria__button", "secondary"), Zt.textContent = S(
    "EIDOLON.LightCriteria.Cancel",
    "Cancel"
  ), Gn.appendChild(Zt), Ie.appendChild(Gn), b.appendChild(Ie), i.prepend(Xt), i.appendChild(b), b.hidden = !0, mp(t, {
    fieldset: b,
    homeContainer: i
  }), requestAnimationFrame(() => {
    var $;
    ($ = t.setPosition) == null || $.call(t, { height: "auto" });
  });
  let P = g;
  Kn({ switcher: M, emptyState: Ke, state: P }), Yn(O, P), or(A, {
    state: P,
    hasCategories: l.length > 0
  }), _("LightCriteria | Controls injected", {
    sceneId: (o == null ? void 0 : o.id) ?? null,
    lightId: (r == null ? void 0 : r.id) ?? null,
    hasBase: !!(P != null && P.base),
    mappingCount: Array.isArray(P == null ? void 0 : P.mappings) ? P.mappings.length : 0,
    categories: l.length
  });
  const na = Ap(P), X = {
    restoreConfig: null,
    app: t,
    selectedMapping: na,
    editorMode: "create",
    editingMappingId: null,
    mappingFilters: {}
  };
  Ia.set(b, X);
  const pt = /* @__PURE__ */ c(() => {
    te.open = !1;
  }, "closeActionsMenu");
  Jt.addEventListener("click", ($) => {
    te.classList.contains("is-disabled") && ($.preventDefault(), pt());
  });
  const _e = /* @__PURE__ */ c(($ = X.selectedMapping) => {
    const G = Cp(W), Z = Array.isArray(P == null ? void 0 : P.mappings) ? P.mappings : [], ee = Lp(Z, G), ne = Object.keys(G).length;
    X.mappingFilters = G, U.disabled = ne === 0, Ip(H, {
      totalCount: Z.length,
      visibleCount: ee.length,
      hasFilters: ne > 0,
      activeFilterCount: ne
    }), D.classList.toggle("has-active-filters", ne > 0), Op(ae, P, u, $, {
      mappings: ee,
      categoryOrder: d
    }), X.selectedMapping = ae.value ?? "", vs({
      mappingSelect: ae,
      applyMappingButton: Q,
      updateMappingButton: Pe,
      editCriteriaButton: it,
      removeMappingButton: rt,
      actionsMenu: te,
      state: P
    }), te.classList.contains("is-disabled") && pt();
  }, "refreshMappingSelector");
  W.querySelectorAll("select[data-filter-category-id]").forEach(($) => {
    $.addEventListener("change", () => {
      const G = X.selectedMapping;
      _e(G), X.selectedMapping !== G && ws(
        a ?? r,
        P,
        X.selectedMapping
      ).then((Z) => {
        Z && (P = Z);
      });
    });
  }), U.addEventListener("click", () => {
    Tp(W);
    const $ = X.selectedMapping;
    _e($), D.open = !1, X.selectedMapping !== $ && ws(
      a ?? r,
      P,
      X.selectedMapping
    ).then((G) => {
      G && (P = G);
    });
  }), ae.addEventListener("change", () => {
    X.selectedMapping = ae.value ?? "", vs({
      mappingSelect: ae,
      applyMappingButton: Q,
      updateMappingButton: Pe,
      editCriteriaButton: it,
      removeMappingButton: rt,
      actionsMenu: te,
      state: P
    }), ws(
      a ?? r,
      P,
      X.selectedMapping
    ).then(($) => {
      $ && (P = $);
    });
  });
  const tr = /* @__PURE__ */ c(async () => {
    var ee, ne, ue, de, ot, mn, st, hn, ge, gn, pn, Ft, Wn, ir;
    const $ = ae.value ?? "";
    if (!$) {
      (ne = (ee = ui.notifications) == null ? void 0 : ee.warn) == null || ne.call(
        ee,
        S(
          "EIDOLON.LightCriteria.SelectMappingWarning",
          "Choose a criteria mapping before applying."
        )
      ), _e(X.selectedMapping);
      return;
    }
    if ($ === ye) {
      if (!(P != null && P.base)) {
        (de = (ue = ui.notifications) == null ? void 0 : ue.warn) == null || de.call(
          ue,
          S(
            "EIDOLON.LightCriteria.BaseUnavailable",
            "Set a base lighting state before applying it."
          )
        );
        return;
      }
      ha(b, Ie, A), Aa(t, n, P.base), P = await hr(a ?? r, {
        mappingId: ye,
        categories: null,
        updatedAt: Date.now()
      }), X.selectedMapping = ye, _e(X.selectedMapping), Yn(O, P), Kn({ switcher: M, emptyState: Ke, state: P }), or(A, {
        state: P,
        hasCategories: l.length > 0
      }), su(n, {
        mappingId: ye,
        color: ((mn = (ot = P.base) == null ? void 0 : ot.config) == null ? void 0 : mn.color) ?? null
      }), (hn = (st = ui.notifications) == null ? void 0 : st.info) == null || hn.call(
        st,
        S(
          "EIDOLON.LightCriteria.BaseApplied",
          "Applied the base lighting state to the form."
        )
      ), pt();
      return;
    }
    const G = Array.isArray(P == null ? void 0 : P.mappings) && P.mappings.length ? P.mappings.find((Ii) => (Ii == null ? void 0 : Ii.id) === $) : null;
    if (!G) {
      (gn = (ge = ui.notifications) == null ? void 0 : ge.warn) == null || gn.call(
        ge,
        S(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      ), X.selectedMapping = "", _e(X.selectedMapping);
      return;
    }
    ha(b, Ie, A), Aa(t, n, G.config), P = await hr(a ?? r, {
      mappingId: G.id,
      categories: G.categories,
      updatedAt: Date.now()
    }), X.selectedMapping = G.id, _e(X.selectedMapping), Yn(O, P), Kn({ switcher: M, emptyState: Ke, state: P }), or(A, {
      state: P,
      hasCategories: l.length > 0
    }), su(n, {
      mappingId: G.id,
      color: ((Ft = (pn = G.config) == null ? void 0 : pn.config) == null ? void 0 : Ft.color) ?? null
    });
    const Z = qi(G, u, d);
    (ir = (Wn = ui.notifications) == null ? void 0 : Wn.info) == null || ir.call(
      Wn,
      S(
        "EIDOLON.LightCriteria.MappingApplied",
        "Applied mapping: {label}"
      ).replace("{label}", Z)
    ), pt();
  }, "applySelectedMapping");
  Q.addEventListener("click", () => {
    tr();
  }), ae.addEventListener("keydown", ($) => {
    $.key === "Enter" && ($.preventDefault(), tr());
  });
  const ia = /* @__PURE__ */ c(async () => {
    var G, Z, ee, ne, ue, de, ot, mn, st, hn, ge, gn, pn, Ft, Wn, ir, Ii, aa, $c, oa, xc;
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
    Pe.disabled = !0;
    try {
      const Je = Oa(t, a);
      if ($ === ye)
        P = await Qc(a ?? r, Je), _("LightCriteria | Base lighting updated", {
          lightId: ((ee = a ?? r) == null ? void 0 : ee.id) ?? null,
          configColor: ((ne = Je == null ? void 0 : Je.config) == null ? void 0 : ne.color) ?? null
        }), (de = (ue = ui.notifications) == null ? void 0 : ue.info) == null || de.call(
          ue,
          S(
            "EIDOLON.LightCriteria.BaseUpdated",
            "Updated the base lighting state with the current configuration."
          )
        ), X.selectedMapping = ye;
      else {
        const Oi = gr(P, $);
        if (!Oi) {
          (mn = (ot = ui.notifications) == null ? void 0 : ot.warn) == null || mn.call(
            ot,
            S(
              "EIDOLON.LightCriteria.MappingUnavailable",
              "The selected criteria mapping is no longer available."
            )
          ), X.selectedMapping = "", _e(X.selectedMapping);
          return;
        }
        P = await Zc(
          a ?? r,
          Oi.categories,
          Je,
          { label: Oi.label ?? null }
        ), _("LightCriteria | Mapping updated", {
          mappingId: $,
          hasColor: !!((st = Je == null ? void 0 : Je.config) != null && st.color),
          stored: Array.isArray(P == null ? void 0 : P.mappings) ? ((hn = P.mappings.find((as) => (as == null ? void 0 : as.id) === $)) == null ? void 0 : hn.config) ?? null : null,
          persisted: (gn = (ge = a ?? r) == null ? void 0 : ge.getFlag) == null ? void 0 : gn.call(ge, pi, Hi)
        });
        const rr = gr(P, $), Am = qi(rr || Oi, u, d);
        _("LightCriteria | Mapping updated", {
          mappingId: $,
          categories: Oi.categories,
          updatedColor: ((pn = Je == null ? void 0 : Je.config) == null ? void 0 : pn.color) ?? null,
          storedColor: ((Wn = (Ft = rr == null ? void 0 : rr.config) == null ? void 0 : Ft.config) == null ? void 0 : Wn.color) ?? ((Ii = (ir = Oi.config) == null ? void 0 : ir.config) == null ? void 0 : Ii.color) ?? null
        }), ($c = (aa = ui.notifications) == null ? void 0 : aa.info) == null || $c.call(
          aa,
          S(
            "EIDOLON.LightCriteria.MappingUpdated",
            "Saved changes to mapping: {label}"
          ).replace("{label}", Am)
        ), X.selectedMapping = $;
      }
      Yn(O, P), Kn({ switcher: M, emptyState: Ke, state: P }), or(A, {
        state: P,
        hasCategories: l.length > 0
      }), _e(X.selectedMapping), pt();
    } catch (Je) {
      console.error("eidolon-utilities | Failed to update light criteria mapping", Je), (xc = (oa = ui.notifications) == null ? void 0 : oa.error) == null || xc.call(
        oa,
        S(
          "EIDOLON.LightCriteria.MappingUpdateError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      Pe.disabled = !1, vs({
        mappingSelect: ae,
        applyMappingButton: Q,
        updateMappingButton: Pe,
        editCriteriaButton: it,
        removeMappingButton: rt,
        actionsMenu: te,
        state: P
      });
    }
  }, "updateSelectedMapping");
  Pe.addEventListener("click", () => {
    ia();
  }), _e(X.selectedMapping), L.addEventListener("click", async () => {
    var $, G, Z, ee, ne, ue;
    L.disabled = !0;
    try {
      const de = Oa(t, a);
      P = await Qc(a ?? r, de), _("LightCriteria | Base lighting stored", {
        lightId: (($ = a ?? r) == null ? void 0 : $.id) ?? null,
        configColor: ((G = de == null ? void 0 : de.config) == null ? void 0 : G.color) ?? null
      }), (ee = (Z = ui.notifications) == null ? void 0 : Z.info) == null || ee.call(
        Z,
        S(
          "EIDOLON.LightCriteria.BaseStored",
          "Saved the current configuration as the base lighting state."
        )
      ), Yn(O, P), Kn({ switcher: M, emptyState: Ke, state: P }), or(A, {
        state: P,
        hasCategories: l.length > 0
      }), X.selectedMapping = ye, _e(X.selectedMapping);
    } catch (de) {
      console.error("eidolon-utilities | Failed to store base light criteria state", de), (ue = (ne = ui.notifications) == null ? void 0 : ne.error) == null || ue.call(
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
    const $ = Ia.get(b);
    ou({
      app: t,
      fieldset: b,
      createButton: A,
      creationSection: Ie,
      categoryList: Qt,
      form: n,
      persistedLight: a,
      stateEntry: $,
      mode: "create",
      mapping: null,
      preloadConfig: P.base
    });
  }), it.addEventListener("click", () => {
    var Z, ee, ne, ue;
    const $ = X.selectedMapping;
    if (!$ || $ === ye) {
      (ee = (Z = ui.notifications) == null ? void 0 : Z.warn) == null || ee.call(
        Z,
        S(
          "EIDOLON.LightCriteria.SelectMappingForCriteriaEdit",
          "Select a mapping before editing criteria."
        )
      );
      return;
    }
    const G = gr(P, $);
    if (!G) {
      (ue = (ne = ui.notifications) == null ? void 0 : ne.warn) == null || ue.call(
        ne,
        S(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      );
      return;
    }
    pt(), gf(t, { fieldset: b, homeContainer: i }), ou({
      app: t,
      fieldset: b,
      createButton: A,
      creationSection: Ie,
      categoryList: Qt,
      form: n,
      persistedLight: a,
      stateEntry: X,
      mode: "retarget",
      mapping: G,
      preloadConfig: G.config
    });
  }), at.addEventListener("click", async () => {
    var G, Z, ee, ne, ue, de, ot, mn, st, hn;
    const $ = _p(Qt);
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
    at.disabled = !0;
    try {
      const ge = Oa(t, a);
      if (X.editorMode === "retarget" && X.editingMappingId) {
        const pn = vl(P, $);
        let Ft = !1;
        if (pn && pn !== X.editingMappingId && (Ft = await dp(), !Ft)) {
          at.disabled = !1;
          return;
        }
        P = await Jh(
          a ?? r,
          X.editingMappingId,
          $,
          ge,
          { replaceExisting: Ft }
        ), _("LightCriteria | Mapping criteria retargeted", {
          mappingId: X.editingMappingId,
          categories: $,
          replaced: Ft,
          configColor: ((ee = ge == null ? void 0 : ge.config) == null ? void 0 : ee.color) ?? null
        }), (ue = (ne = ui.notifications) == null ? void 0 : ne.info) == null || ue.call(
          ne,
          S(
            "EIDOLON.LightCriteria.MappingCriteriaUpdated",
            "Updated mapping criteria for the selected mapping."
          )
        );
      } else
        P = await Zc(
          a ?? r,
          $,
          ge,
          {}
        ), _("LightCriteria | Mapping saved from editor", {
          categories: $,
          configColor: ((de = ge == null ? void 0 : ge.config) == null ? void 0 : de.color) ?? null
        }), (mn = (ot = ui.notifications) == null ? void 0 : ot.info) == null || mn.call(
          ot,
          S(
            "EIDOLON.LightCriteria.MappingSaved",
            "Updated lighting mapping for the selected scene criteria."
          )
        );
      Yn(O, P), Kn({ switcher: M, emptyState: Ke, state: P });
      const gn = vl(P, $);
      gn && (X.selectedMapping = gn), _e(X.selectedMapping), ha(b, Ie, A), pt();
    } catch (ge) {
      console.error("eidolon-utilities | Failed to persist light criteria mapping", ge), (hn = (st = ui.notifications) == null ? void 0 : st.error) == null || hn.call(
        st,
        S(
          "EIDOLON.LightCriteria.MappingError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      at.disabled = !1;
    }
  }), Zt.addEventListener("click", () => {
    const $ = Ia.get(b);
    $ != null && $.restoreConfig && Aa(t, n, $.restoreConfig), ha(b, Ie, A);
  }), rt.addEventListener("click", async () => {
    var Z, ee;
    const $ = X.selectedMapping;
    !$ || $ === ye || !await fp() || (P = await Xh(a ?? r, $), X.selectedMapping = "", Yn(O, P), Kn({ switcher: M, emptyState: Ke, state: P }), _e(X.selectedMapping), pt(), (ee = (Z = ui.notifications) == null ? void 0 : Z.info) == null || ee.call(
      Z,
      S("EIDOLON.LightCriteria.MappingRemoved", "Removed selected mapping.")
    ));
  });
}
c(up, "enhanceAmbientLightConfig");
function ou({
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
  s && (s.restoreConfig = Oa(t, o), s.editorMode = l, s.editingMappingId = l === "retarget" ? (u == null ? void 0 : u.id) ?? null : null), d && Aa(t, a, d), l === "retarget" && (u != null && u.categories) ? Mp(r, u.categories) : kp(r);
  const h = i.querySelector("p.notes");
  h instanceof HTMLElement && (h.textContent = l === "retarget" ? S(
    "EIDOLON.LightCriteria.EditCriteriaDescription",
    "Adjust criteria values for the selected mapping."
  ) : S(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const f = i.querySelector('button[data-action="save-mapping"]');
  f instanceof HTMLButtonElement && (f.textContent = l === "retarget" ? S("EIDOLON.LightCriteria.SaveCriteriaChanges", "Save Criteria Changes") : S("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), i.hidden = !1, n.setAttribute("aria-expanded", "true"), hc(e, i), requestAnimationFrame(() => {
    var g;
    (g = t.setPosition) == null || g.call(t, { height: "auto" });
  });
}
c(ou, "openMappingEditor");
async function dp() {
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
c(dp, "confirmCriteriaConflict");
async function fp() {
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
c(fp, "confirmRemoveMapping");
function mp(t, { fieldset: e, homeContainer: n }) {
  const i = pp(t, n);
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
    o.preventDefault(), gf(t, { fieldset: e, homeContainer: n });
  };
}
c(mp, "ensureManagerHeaderButton");
function gf(t, { fieldset: e, homeContainer: n }) {
  var f, g, p;
  const i = ma.get(t);
  if (i != null && i.rendered) {
    (f = i.bringToTop) == null || f.call(i);
    return;
  }
  const r = /* @__PURE__ */ c((...y) => {
    var w;
    const b = hp(y), v = (w = b == null ? void 0 : b.querySelector) == null ? void 0 : w.call(b, ".eidolon-light-criteria-manager-host");
    v instanceof HTMLElement && (gp(e), e.hidden = !1, v.appendChild(e));
  }, "onRender"), a = /* @__PURE__ */ c(() => {
    n instanceof HTMLElement && n.appendChild(e), e.hidden = !0, ma.delete(t), requestAnimationFrame(() => {
      var y;
      (y = t.setPosition) == null || y.call(t, { height: "auto" });
    });
  }, "onClose"), o = S("EIDOLON.LightCriteria.ManagerTitle", "Scene Criteria Lighting"), s = '<div class="eidolon-light-criteria-manager-host"></div>', l = S("EIDOLON.LightCriteria.Close", "Close"), u = (p = (g = foundry == null ? void 0 : foundry.applications) == null ? void 0 : g.api) == null ? void 0 : p.DialogV2;
  if (typeof (u == null ? void 0 : u.wait) == "function")
    try {
      let y = !1;
      const b = /* @__PURE__ */ c(() => {
        y || (y = !0, a());
      }, "closeOnce");
      ma.set(t, {
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
  ma.set(t, h), h.render(!0);
}
c(gf, "openManagerDialog");
function hp(t) {
  for (const e of t) {
    const n = $t(e);
    if (n) return n;
    const i = $t(e == null ? void 0 : e.element);
    if (i) return i;
  }
  return null;
}
c(hp, "findDialogRoot");
function gp(t) {
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
  h.classList.add("eidolon-light-criteria-manager__header"), h.textContent = S("EIDOLON.LightCriteria.ManagerAuthoring", "Create or Update Mapping"), u.appendChild(h), a && u.appendChild(a), t.innerHTML = "", e && t.appendChild(e), n && t.appendChild(n), t.appendChild(s), hc(t, a);
}
c(gp, "applyManagerLayout");
function pp(t, e) {
  var i;
  const n = $t(t == null ? void 0 : t.element);
  return n || (((i = e == null ? void 0 : e.closest) == null ? void 0 : i.call(e, ".application")) ?? null);
}
c(pp, "resolveApplicationRoot");
function ha(t, e, n) {
  const i = Ia.get(t);
  i && (i.restoreConfig = null, i.editorMode = "create", i.editingMappingId = null), e.hidden = !0, n.setAttribute("aria-expanded", "false");
  const r = e.querySelector("p.notes");
  r instanceof HTMLElement && (r.textContent = S(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const a = e.querySelector('button[data-action="save-mapping"]');
  a instanceof HTMLButtonElement && (a.textContent = S("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), hc(t, e), requestAnimationFrame(() => {
    var o, s;
    (s = (o = i == null ? void 0 : i.app) == null ? void 0 : o.setPosition) == null || s.call(o, { height: "auto" });
  });
}
c(ha, "hideCreationSection");
function Yn(t, e) {
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
c(Yn, "updateStatusLine");
function or(t, { state: e, hasCategories: n }) {
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
c(or, "updateCreateButtonState");
function Oa(t, e) {
  var l, u, d;
  const n = e ?? pf(t);
  if (!n)
    throw new Error("Ambient light document unavailable.");
  const i = Ei(((l = n.toObject) == null ? void 0 : l.call(n)) ?? {});
  if (!i)
    throw new Error("Unable to duplicate ambient light data.");
  const r = (t == null ? void 0 : t.form) instanceof HTMLFormElement ? t.form : null, a = r ? th(r) : {}, o = foundry.utils.mergeObject(i, a, {
    inplace: !1,
    performDeletions: !0
  });
  r && (r.querySelectorAll("color-picker[name]").forEach((h) => {
    var v, w;
    const f = h.getAttribute("name");
    if (!f) return;
    const g = typeof h.value == "string" ? h.value : "", p = ((v = h.ui) == null ? void 0 : v.input) ?? ((w = h.querySelector) == null ? void 0 : w.call(h, 'input[type="color"]')), y = (p == null ? void 0 : p.value) ?? "", b = g || y;
    typeof b != "string" || !b || (foundry.utils.setProperty(o, f, b), _("LightCriteria | Captured color-picker value", {
      path: f,
      pickerValue: g,
      swatchValue: y,
      chosenValue: b
    }));
  }), r.querySelectorAll("range-picker[name]").forEach((h) => {
    var A, O;
    const f = h.getAttribute("name");
    if (!f) return;
    const g = h.value !== void 0 && h.value !== null ? String(h.value) : "", p = (A = h.querySelector) == null ? void 0 : A.call(h, 'input[type="range"]'), y = (O = h.querySelector) == null ? void 0 : O.call(h, 'input[type="number"]'), b = p instanceof HTMLInputElement ? p.value : "", v = y instanceof HTMLInputElement ? y.value : "", w = g || v || b;
    if (typeof w != "string" || !w.length) return;
    const E = Number(w), L = Number.isFinite(E) ? E : w;
    foundry.utils.setProperty(o, f, L), _("LightCriteria | Captured range-picker value", {
      path: f,
      elementValue: g,
      numberValue: v,
      rangeValue: b,
      chosenValue: L
    });
  }));
  const s = Ei(o);
  return _("LightCriteria | Captured form config", {
    lightId: (n == null ? void 0 : n.id) ?? null,
    hasColor: !!((u = s == null ? void 0 : s.config) != null && u.color),
    color: ((d = s == null ? void 0 : s.config) == null ? void 0 : d.color) ?? null
  }), s;
}
c(Oa, "captureAmbientLightFormConfig");
function Aa(t, e, n) {
  if (!n || typeof n != "object") return;
  const i = foundry.utils.flattenObject(n, { safe: !0 });
  for (const [r, a] of Object.entries(i)) {
    const o = e.querySelectorAll(`[name="${r}"]`);
    if (o.length) {
      _("LightCriteria | Applying field", {
        path: r,
        value: a,
        elementCount: o.length
      });
      for (const s of o)
        s instanceof HTMLElement && s.tagName === "COLOR-PICKER" ? bp(s, a) : s instanceof HTMLElement && s.tagName === "RANGE-PICKER" ? vp(s, a) : s instanceof HTMLInputElement ? yp(s, a) : s instanceof HTMLSelectElement ? wp(s, a) : s instanceof HTMLTextAreaElement && Ep(s, a);
    }
  }
  requestAnimationFrame(() => {
    var r;
    return (r = t._previewChanges) == null ? void 0 : r.call(t);
  });
}
c(Aa, "applyConfigToForm");
function yp(t, e, n) {
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
c(yp, "applyValueToInput");
function bp(t, e, n) {
  var s, l, u, d, h, f;
  const i = e == null ? "" : String(e);
  let r = !1;
  t.value !== i && (t.value = i, t.setAttribute("value", i), (s = t.ui) != null && s.setValue && t.ui.setValue(i), r = !0);
  const a = ((l = t.ui) == null ? void 0 : l.input) ?? ((u = t.querySelector) == null ? void 0 : u.call(t, 'input[type="color"]'));
  a instanceof HTMLInputElement && a.value !== i && (a.value = i, Nt(a));
  const o = ((d = t.ui) == null ? void 0 : d.text) ?? ((h = t.querySelector) == null ? void 0 : h.call(t, 'input[type="text"]'));
  o instanceof HTMLInputElement && o.value !== i && (o.value = i, Nt(o)), (f = t.ui) != null && f.commit ? t.ui.commit() : (t.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), t.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }))), _("LightCriteria | Color picker applied", {
    value: i,
    pickerValue: t.value ?? null,
    swatchValue: (a == null ? void 0 : a.value) ?? null,
    textValue: (o == null ? void 0 : o.value) ?? null
  }), r && Nt(t);
}
c(bp, "applyValueToColorPicker");
function vp(t, e, n) {
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
  _("LightCriteria | Range picker applied", {
    value: i,
    resolvedValue: a,
    rangeValue: (s == null ? void 0 : s.value) ?? null,
    numberValue: (l == null ? void 0 : l.value) ?? null
  }), o && Nt(t);
}
c(vp, "applyValueToRangePicker");
function wp(t, e, n) {
  const i = e == null ? "" : String(e);
  t.value !== i && (t.value = i, Nt(t));
}
c(wp, "applyValueToSelect");
function Ep(t, e, n) {
  const i = e == null ? "" : String(e);
  t.value !== i && (t.value = i, Nt(t));
}
c(Ep, "applyValueToTextarea");
function Nt(t) {
  t.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), t.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }));
}
c(Nt, "triggerInputChange");
function vs({
  mappingSelect: t,
  applyMappingButton: e,
  updateMappingButton: n,
  editCriteriaButton: i,
  removeMappingButton: r,
  actionsMenu: a,
  state: o
}) {
  const s = (t == null ? void 0 : t.value) ?? "", l = !!(o != null && o.base), u = s && s !== ye ? !!gr(o, s) : !1;
  if (e instanceof HTMLButtonElement && (s ? s === ye ? e.disabled = !l : e.disabled = !u : e.disabled = !0), n instanceof HTMLButtonElement && (s ? s === ye ? n.disabled = !1 : n.disabled = !u : n.disabled = !0), i instanceof HTMLButtonElement && (i.disabled = !s || s === ye || !u), r instanceof HTMLButtonElement && (r.disabled = !s || s === ye || !u), a instanceof HTMLElement) {
    const d = n instanceof HTMLButtonElement && !n.disabled || i instanceof HTMLButtonElement && !i.disabled || r instanceof HTMLButtonElement && !r.disabled;
    a.classList.toggle("is-disabled", !d), !d && "open" in a && (a.open = !1);
  }
}
c(vs, "syncMappingSwitcherState");
function Sp(t) {
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
c(Sp, "buildCategoryNameLookup");
function Cp(t) {
  const e = {};
  return t instanceof HTMLElement && t.querySelectorAll("select[data-filter-category-id]").forEach((n) => {
    var a, o;
    const i = n.dataset.filterCategoryId, r = (o = (a = n.value) == null ? void 0 : a.trim) == null ? void 0 : o.call(a);
    !i || !r || (e[i] = r);
  }), e;
}
c(Cp, "readMappingFilterSelections");
function Tp(t) {
  t instanceof HTMLElement && t.querySelectorAll("select[data-filter-category-id]").forEach((e) => {
    e.value = "";
  });
}
c(Tp, "resetMappingFilterSelections");
function Lp(t, e) {
  const n = Array.isArray(t) ? t : [], i = Object.entries(e ?? {}).filter(([, r]) => !!r);
  return i.length ? n.filter((r) => {
    if (!r || typeof r != "object") return !1;
    const a = r.categories ?? {};
    for (const [o, s] of i)
      if ((a == null ? void 0 : a[o]) !== s) return !1;
    return !0;
  }) : n.slice();
}
c(Lp, "filterMappingsByCriteria");
function Ip(t, { totalCount: e = 0, visibleCount: n = 0, hasFilters: i = !1, activeFilterCount: r = 0 } = {}) {
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
c(Ip, "updateMappingFilterMeta");
function Op(t, e, n, i, r = {}) {
  if (!(t instanceof HTMLSelectElement)) return;
  const a = typeof i == "string" ? i : "", o = !!(e != null && e.base), s = Array.isArray(r == null ? void 0 : r.categoryOrder) ? r.categoryOrder : [], l = Array.isArray(r == null ? void 0 : r.mappings) ? r.mappings.slice() : Array.isArray(e == null ? void 0 : e.mappings) ? e.mappings.slice() : [], u = t.value;
  t.innerHTML = "";
  const d = document.createElement("option");
  d.value = "", d.textContent = S(
    "EIDOLON.LightCriteria.SelectPlaceholder",
    "Select a mapping"
  ), d.disabled = o, t.appendChild(d);
  const h = document.createElement("option");
  h.value = ye, h.textContent = S(
    "EIDOLON.LightCriteria.BaseOption",
    "Base Lighting"
  ), h.disabled = !o, t.appendChild(h), l.slice().sort((y, b) => {
    var E;
    const v = qi(y, n, s), w = qi(b, n, s);
    return v.localeCompare(w, ((E = game.i18n) == null ? void 0 : E.lang) ?? void 0, {
      sensitivity: "base"
    });
  }).forEach((y) => {
    if (!(y != null && y.id)) return;
    const b = document.createElement("option");
    b.value = y.id, b.textContent = qi(y, n, s), t.appendChild(b);
  });
  const f = new Set(
    Array.from(t.options).filter((y) => !y.disabled).map((y) => y.value)
  ), g = o && u === "" ? "" : u, p = a || (f.has(g) ? g : "");
  p && f.has(p) ? t.value = p : o ? t.value = ye : t.value = "";
}
c(Op, "populateMappingSelector");
function qi(t, e, n = []) {
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
c(qi, "formatMappingOptionLabel");
function vl(t, e) {
  if (!t || typeof t != "object" || !Array.isArray(t.mappings)) return null;
  const n = er(e);
  if (!n) return null;
  const i = t.mappings.find((r) => (r == null ? void 0 : r.key) === n);
  return (i == null ? void 0 : i.id) ?? null;
}
c(vl, "findMappingIdByCategories");
function gr(t, e) {
  return !e || !t || typeof t != "object" || !Array.isArray(t.mappings) ? null : t.mappings.find((n) => (n == null ? void 0 : n.id) === e) ?? null;
}
c(gr, "getMappingById");
function Ap(t) {
  if (!t || typeof t != "object") return "";
  const e = t.current;
  if (e != null && e.mappingId) {
    if (e.mappingId === ye)
      return t != null && t.base ? ye : "";
    if (Array.isArray(t.mappings) && t.mappings.some((n) => n.id === e.mappingId))
      return e.mappingId;
  }
  if (e != null && e.categories) {
    const n = vl(t, e.categories);
    if (n) return n;
  }
  return "";
}
c(Ap, "resolveInitialMappingSelection");
function su(t, e = {}) {
  var o, s, l, u;
  if (!(t instanceof HTMLFormElement)) return;
  const n = t.querySelector('color-picker[name="config.color"]'), i = (n == null ? void 0 : n.value) ?? null, r = ((o = n == null ? void 0 : n.ui) == null ? void 0 : o.text) ?? ((s = n == null ? void 0 : n.querySelector) == null ? void 0 : s.call(n, 'input[type="text"]')), a = ((l = n == null ? void 0 : n.ui) == null ? void 0 : l.input) ?? ((u = n == null ? void 0 : n.querySelector) == null ? void 0 : u.call(n, 'input[type="color"]'));
  _("LightCriteria | Color state after apply", {
    ...e,
    textValue: (r == null ? void 0 : r.value) ?? null,
    pickerValue: i,
    swatchValue: (a == null ? void 0 : a.value) ?? null
  });
}
c(su, "logAppliedColorState");
function kp(t) {
  t.querySelectorAll("select[data-category-id]").forEach((e) => {
    e.value = "";
  });
}
c(kp, "resetCategorySelections");
function Mp(t, e) {
  const n = e && typeof e == "object" ? e : {};
  t.querySelectorAll("select[data-category-id]").forEach((i) => {
    const r = i.dataset.categoryId;
    if (!r) return;
    const a = n[r];
    i.value = typeof a == "string" ? a : "";
  });
}
c(Mp, "setCategorySelections");
function _p(t) {
  const e = {};
  return t.querySelectorAll("select[data-category-id]").forEach((n) => {
    var a, o;
    const i = n.dataset.categoryId, r = (o = (a = n.value) == null ? void 0 : a.trim) == null ? void 0 : o.call(a);
    !i || !r || (e[i] = r);
  }), Object.keys(e).length > 0 ? e : null;
}
c(_p, "readCategorySelections");
async function ws(t, e, n) {
  if (!t) return null;
  try {
    if (!n)
      return await hr(t, {});
    if (n === ye)
      return await hr(t, {
        mappingId: ye,
        categories: null,
        updatedAt: Date.now()
      });
    const i = gr(e, n);
    return i ? await hr(t, {
      mappingId: i.id,
      categories: i.categories,
      updatedAt: Date.now()
    }) : null;
  } catch (i) {
    return console.warn("eidolon-utilities | Failed to persist mapping selection", i), null;
  }
}
c(ws, "persistCurrentSelection");
function hc(t, e) {
  if (!(t instanceof HTMLElement)) return;
  const n = t.querySelector(".eidolon-light-criteria-manager__section.is-bottom");
  n instanceof HTMLElement && (n.hidden = !!(e != null && e.hidden));
}
c(hc, "updateManagerSectionVisibility");
function Kn({ switcher: t, emptyState: e, state: n }) {
  const i = !!(n != null && n.base);
  t instanceof HTMLElement && (t.hidden = !i), e instanceof HTMLElement && (e.hidden = i);
}
c(Kn, "updateActiveMappingVisibility");
function pf(t) {
  const e = (t == null ? void 0 : t.object) ?? (t == null ? void 0 : t.document) ?? null;
  return !(e != null && e.isEmbedded) || e.documentName !== "AmbientLight" ? null : e;
}
c(pf, "getAmbientLightDocument");
function Np(t) {
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
c(Np, "getPersistedAmbientLightDocument");
function $p() {
  lp();
}
c($p, "registerLightCriteriaHooks");
$p();
const wl = /* @__PURE__ */ new Map();
let El = !1;
function gc(t, e) {
  wl.has(t) && console.warn(`[${T}] Socket handler for type "${t}" already registered, overwriting.`), wl.set(t, e);
}
c(gc, "registerSocketHandler");
function ka(t, e) {
  if (!El) {
    console.error(`[${T}] Socket not initialized. Call initializeSocket() first.`);
    return;
  }
  game.socket.emit(`module.${T}`, { type: t, payload: e });
}
c(ka, "emitSocket");
function xp() {
  El || (game.socket.on(`module.${T}`, (t) => {
    const { type: e, payload: n } = t ?? {}, i = wl.get(e);
    i ? i(n) : console.warn(`[${T}] No socket handler for type "${e}"`);
  }), El = !0, console.log(`[${T}] Socket initialized on channel module.${T}`));
}
c(xp, "initializeSocket");
const yf = "tween", bf = "tween-sequence", Sl = "tween-sequence-cancel", Te = Object.freeze({
  ABORT: "abort",
  CONTINUE: "continue"
}), yn = Object.freeze({
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  FAILED: "failed"
}), yt = Object.freeze({
  BEFORE_ALL: "beforeAll",
  BEFORE_STEP: "before",
  ENTRY: "entry",
  AFTER_STEP: "after",
  RUNTIME: "runtime",
  VALIDATION: "validation",
  AWAIT: "await",
  EMIT: "emit",
  PARALLEL: "parallel"
}), Xa = /* @__PURE__ */ new Map();
function xt({ type: t, execute: e, validate: n }) {
  Xa.has(t) && console.warn(`[tween-registry] Type "${t}" already registered, overwriting.`), Xa.set(t, { type: t, execute: e, validate: n ?? (() => {
  }) });
}
c(xt, "registerTweenType");
function Ti(t) {
  return Xa.get(t);
}
c(Ti, "getTweenType");
function Fp(t, e = {}) {
  const n = Ti(t);
  if (!n)
    throw new Error(`Unknown tween type: "${t}".`);
  return n.validate(e ?? {}), n;
}
c(Fp, "validateTweenEntry");
function Cl() {
  return [...Xa.keys()];
}
c(Cl, "listTweenTypes");
const ji = {
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
  easeInBounce: /* @__PURE__ */ c((t) => 1 - ji.easeOutBounce(1 - t), "easeInBounce"),
  easeInOutBounce: /* @__PURE__ */ c((t) => t < 0.5 ? (1 - ji.easeOutBounce(1 - 2 * t)) / 2 : (1 + ji.easeOutBounce(2 * t - 1)) / 2, "easeInOutBounce"),
  easeInElastic: /* @__PURE__ */ c((t) => t === 0 || t === 1 ? t : -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI), "easeInElastic"),
  easeOutElastic: /* @__PURE__ */ c((t) => t === 0 || t === 1 ? t : Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1, "easeOutElastic")
};
function Kt(t) {
  if (t && ji[t])
    return ji[t];
  const e = foundry.canvas.animation.CanvasAnimation;
  return {
    linear: e.easeLinear,
    easeInOutCosine: e.easeInOutCosine
  }[t] ?? e.easeInOutCosine;
}
c(Kt, "resolveEasing");
function Xo() {
  return ["linear", "easeInOutCosine", ...Object.keys(ji)];
}
c(Xo, "listEasingNames");
function Qa(t) {
  return t <= 0.04045 ? t / 12.92 : ((t + 0.055) / 1.055) ** 2.4;
}
c(Qa, "srgbToLinear");
function Bi(t) {
  return t <= 31308e-7 ? 12.92 * t : 1.055 * t ** (1 / 2.4) - 0.055;
}
c(Bi, "linearToSrgb");
function lu(t, e, n) {
  const i = 0.4122214708 * t + 0.5363325363 * e + 0.0514459929 * n, r = 0.2119034982 * t + 0.6806995451 * e + 0.1073969566 * n, a = 0.0883024619 * t + 0.2817188376 * e + 0.6299787005 * n, o = Math.cbrt(i), s = Math.cbrt(r), l = Math.cbrt(a);
  return [
    0.2104542553 * o + 0.793617785 * s - 0.0040720468 * l,
    1.9779984951 * o - 2.428592205 * s + 0.4505937099 * l,
    0.0259040371 * o + 0.7827717662 * s - 0.808675766 * l
  ];
}
c(lu, "linearRgbToOklab");
function Dp(t, e, n) {
  const i = (t + 0.3963377774 * e + 0.2158037573 * n) ** 3, r = (t - 0.1055613458 * e - 0.0638541728 * n) ** 3, a = (t - 0.0894841775 * e - 1.291485548 * n) ** 3;
  return [
    4.0767416621 * i - 3.3077115913 * r + 0.2309699292 * a,
    -1.2684380046 * i + 2.6097574011 * r - 0.3413193965 * a,
    -0.0041960863 * i - 0.7034186147 * r + 1.707614701 * a
  ];
}
c(Dp, "oklabToLinearRgb");
function Za(t) {
  return [t.r, t.g, t.b];
}
c(Za, "colorToRgb");
function vf(t, e, n) {
  const i = /* @__PURE__ */ c((a) => Math.max(0, Math.min(1, a)), "clamp"), r = /* @__PURE__ */ c((a) => Math.round(i(a) * 255).toString(16).padStart(2, "0"), "toHex");
  return `#${r(t)}${r(e)}${r(n)}`;
}
c(vf, "rgbToHex");
function Pp(t, e, n) {
  if (n <= 0) return t.toHTML();
  if (n >= 1) return e.toHTML();
  const i = foundry.utils.Color, [r, a, o] = t.hsl, [s, l, u] = e.hsl, d = (s - r + 0.5) % 1 - 0.5, h = (r + d * n + 1) % 1, f = a + (l - a) * n, g = o + (u - o) * n;
  return i.fromHSL([h, f, g]).toHTML();
}
c(Pp, "interpolateHsl");
function Rp(t, e, n) {
  if (n <= 0) return t.toHTML();
  if (n >= 1) return e.toHTML();
  const [i, r, a] = Za(t).map(Qa), [o, s, l] = Za(e).map(Qa), u = Bi(i + (o - i) * n), d = Bi(r + (s - r) * n), h = Bi(a + (l - a) * n);
  return vf(u, d, h);
}
c(Rp, "interpolateRgb");
function Hp(t, e, n) {
  if (n <= 0) return t.toHTML();
  if (n >= 1) return e.toHTML();
  const [i, r, a] = Za(t).map(Qa), [o, s, l] = Za(e).map(Qa), [u, d, h] = lu(i, r, a), [f, g, p] = lu(o, s, l), y = 0.02, b = Math.sqrt(d * d + h * h), v = Math.sqrt(g * g + p * p);
  let w, E, L;
  if (b < y || v < y)
    w = u + (f - u) * n, E = d + (g - d) * n, L = h + (p - h) * n;
  else {
    const x = Math.atan2(h, d);
    let D = Math.atan2(p, g) - x;
    D > Math.PI && (D -= 2 * Math.PI), D < -Math.PI && (D += 2 * Math.PI), w = u + (f - u) * n;
    const F = b + (v - b) * n, N = x + D * n;
    E = F * Math.cos(N), L = F * Math.sin(N);
  }
  const [A, O, M] = Dp(w, E, L);
  return vf(Bi(A), Bi(O), Bi(M));
}
c(Hp, "interpolateOklch");
const Tl = {
  hsl: Pp,
  rgb: Rp,
  oklch: Hp
};
function wf(t = "hsl") {
  return Tl[t] ?? Tl.hsl;
}
c(wf, "getInterpolator");
function Yi() {
  return Object.keys(Tl);
}
c(Yi, "listInterpolationModes");
function qp(t) {
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
  if (t.mode && !Yi().includes(t.mode))
    throw new Error(
      `light-color tween: unknown mode "${t.mode}". Available: ${Yi().join(", ")}`
    );
}
c(qp, "validate$7");
async function jp(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { Color: i } = foundry.utils, { uuid: r, toColor: a, toAlpha: o, mode: s = "oklch" } = t, l = Array.isArray(r) ? r : [r];
  if (l.length === 0)
    return console.warn("light-color tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: u = 2e3,
    easing: d = "easeInOutCosine",
    commit: h = !0,
    startEpochMS: f = null,
    signal: g = null
  } = e, p = Kt(d), y = a != null, b = o != null, v = y ? wf(s) : null, w = y ? i.fromString(a) : null;
  if (y && !w.valid) throw new Error(`light-color tween: invalid target color "${a}".`);
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
    const R = b ? ((q = O._source.config) == null ? void 0 : q.alpha) ?? 0.5 : null, D = { t: 0 }, F = `ambient-hue-tween:${A}`;
    n.terminateAnimation(F), g && g.addEventListener("abort", () => {
      n.terminateAnimation(F);
    }, { once: !0 });
    const N = typeof f == "number" ? Math.max(0, Math.min(u, Date.now() - f)) : 0, H = /* @__PURE__ */ c((U) => {
      const K = {};
      y && (K.color = v(x, w, U)), b && (K.alpha = R + (o - R) * U), O.updateSource({ config: K }), M.initializeLightSource();
    }, "applyFrame");
    N > 0 && (D.t = N / u, H(D.t));
    const B = await n.animate(
      [{ parent: D, attribute: "t", to: 1 }],
      {
        name: F,
        duration: u,
        easing: p,
        time: N,
        ontick: /* @__PURE__ */ c(() => H(D.t), "ontick")
      }
    );
    if (B !== !1) {
      if (g != null && g.aborted) return !1;
      const U = {};
      y && (U.color = w.toHTML()), b && (U.alpha = o), O.updateSource({ config: U }), M.initializeLightSource();
    }
    if (h && B !== !1 && O.canUserModify(game.user, "update")) {
      if (g != null && g.aborted) return !1;
      const U = {}, K = {};
      y && (U.color = x.toHTML(), K["config.color"] = w.toHTML()), b && (U.alpha = R, K["config.alpha"] = o), O.updateSource({ config: U }), await O.update(K);
    }
    return B !== !1;
  }
  return c(E, "animateOne"), (await Promise.all(l.map(E))).every(Boolean);
}
c(jp, "execute$7");
function Bp() {
  xt({ type: "light-color", execute: jp, validate: qp });
}
c(Bp, "registerLightColorTween");
const bn = /* @__PURE__ */ new WeakMap();
function Up(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("light-state tween: 'uuid' is required (string or array of AmbientLight document UUIDs).");
  if (typeof t.enabled != "boolean")
    throw new Error("light-state tween: 'enabled' (boolean) is required.");
}
c(Up, "validate$6");
async function Vp(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, enabled: r } = t, a = Array.isArray(i) ? i : [i];
  if (a.length === 0)
    return console.warn("light-state tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: o = 2e3,
    easing: s = "easeInOutCosine",
    commit: l = !0,
    startEpochMS: u = null,
    signal: d = null
  } = e, h = Kt(s);
  async function f(p) {
    var O, M, x, R;
    if (d != null && d.aborted) return !1;
    const y = await fromUuid(p);
    if (!y) return !1;
    const b = y.object;
    if (!b) return !1;
    const v = `ambient-state-tween:${p}`;
    n.terminateAnimation(v), d && d.addEventListener("abort", () => {
      n.terminateAnimation(v);
    }, { once: !0 });
    const w = bn.get(y) ?? {
      hidden: y._source.hidden,
      alpha: ((O = y._source.config) == null ? void 0 : O.alpha) ?? 0.5
    };
    if (bn.set(y, w), _(`light-state START ${r ? "ON" : "OFF"} | snap: ${JSON.stringify(w)} | _source.hidden=${y._source.hidden}, _source.config.alpha=${(M = y._source.config) == null ? void 0 : M.alpha}`), r && !w.hidden || !r && w.hidden)
      return bn.delete(y), !0;
    const E = w.alpha, L = typeof u == "number" ? Math.max(0, Math.min(o, Date.now() - u)) : 0, A = /* @__PURE__ */ c((D) => {
      y.updateSource({ config: { alpha: D } }), b.initializeLightSource();
    }, "applyAlpha");
    if (r) {
      y.updateSource({ hidden: !1, config: { alpha: 0 } }), b.initializeLightSource(), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
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
      return F !== !1 && !(d != null && d.aborted) && l && y.canUserModify(game.user, "update") ? (y.updateSource({ hidden: !0, config: { alpha: E } }), await y.update({ hidden: !1 }), _(`light-state FADE-IN committed. _source.hidden=${y._source.hidden}, _source.config.alpha=${(x = y._source.config) == null ? void 0 : x.alpha}`), bn.delete(y)) : F === !1 || bn.delete(y), F !== !1;
    } else {
      y.updateSource({ hidden: !1, config: { alpha: w.alpha } }), b.initializeLightSource();
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
      return F !== !1 && !(d != null && d.aborted) && l && y.canUserModify(game.user, "update") ? (await y.update({ hidden: !0 }), y.updateSource({ config: { alpha: E } }), b.initializeLightSource(), _(`light-state FADE-OUT committed+restored. _source.hidden=${y._source.hidden}, _source.config.alpha=${(R = y._source.config) == null ? void 0 : R.alpha}`), bn.delete(y)) : F === !1 || (y.updateSource({ hidden: !0, config: { alpha: E } }), b.initializeLightSource(), bn.delete(y)), F !== !1;
    }
  }
  return c(f, "animateOne"), (await Promise.all(a.map(f))).every(Boolean);
}
c(Vp, "execute$6");
function Gp() {
  xt({ type: "light-state", execute: Vp, validate: Up });
}
c(Gp, "registerLightStateTween");
function Qo(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("tile-prop tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (!t.attribute || typeof t.attribute != "string")
    throw new Error("tile-prop tween: 'attribute' (string) is required — dot-path to a numeric property (e.g. 'alpha', 'rotation').");
  if (typeof t.value != "number")
    throw new Error("tile-prop tween: 'value' (number) is required — the target value to animate to.");
}
c(Qo, "validate$5");
async function Zo(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, attribute: r, value: a } = t, o = Array.isArray(i) ? i : [i];
  if (o.length === 0)
    return console.warn("tile-prop tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: s = 2e3,
    easing: l = "easeInOutCosine",
    commit: u = !0,
    startEpochMS: d = null,
    signal: h = null
  } = e, f = Kt(l);
  async function g(y) {
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
    const L = typeof d == "number" ? Math.max(0, Math.min(s, Date.now() - d)) : 0, A = /* @__PURE__ */ c((x) => {
      const R = w + (a - w) * x;
      b.updateSource(foundry.utils.expandObject({ [r]: R })), v.refresh();
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
      b.updateSource(foundry.utils.expandObject({ [r]: a })), v.refresh();
    }
    if (u && M !== !1 && b.canUserModify(game.user, "update")) {
      if (h != null && h.aborted) return !1;
      b.updateSource(foundry.utils.expandObject({ [r]: w })), await b.update({ [r]: a });
    }
    return M !== !1;
  }
  return c(g, "animateOne"), (await Promise.all(o.map(g))).every(Boolean);
}
c(Zo, "execute$5");
function zp() {
  xt({ type: "tile-prop", execute: Zo, validate: Qo });
}
c(zp, "registerTilePropTween");
function Wp(t) {
  if (!t.attribute || typeof t.attribute != "string")
    throw new Error("particles-prop tween: 'attribute' (string) is required — property name on canvas.particleeffects (e.g. 'alpha').");
  if (typeof t.value != "number")
    throw new Error("particles-prop tween: 'value' (number) is required — the target value to animate to.");
}
c(Wp, "validate$4");
async function Yp(t, e = {}) {
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
  const h = Kt(o), f = `particles-prop-tween:${i}`;
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
      easing: h,
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
c(Yp, "execute$4");
function Kp() {
  xt({ type: "particles-prop", execute: Yp, validate: Wp });
}
c(Kp, "registerParticlesPropTween");
var Tn, Dr, Pr, Rr, Hr, qr, Vi;
const kc = class kc {
  /**
   * @param {AbortController} controller
   */
  constructor(e) {
    k(this, Tn);
    k(this, Dr);
    k(this, Pr);
    k(this, Rr);
    k(this, Hr);
    k(this, qr, !1);
    k(this, Vi, null);
    I(this, Tn, e), I(this, Rr, new Promise((n) => {
      I(this, Dr, n);
    })), I(this, Hr, new Promise((n) => {
      I(this, Pr, n);
    }));
  }
  /** @returns {Promise<boolean>} Resolves true (completed) or false (cancelled/failed). */
  get finished() {
    return m(this, Rr);
  }
  /** @returns {Promise<{status: string, [k: string]: unknown}>} */
  get result() {
    return m(this, Hr);
  }
  /** @returns {boolean} */
  get cancelled() {
    return m(this, Tn).signal.aborted;
  }
  /** @returns {AbortSignal} */
  get signal() {
    return m(this, Tn).signal;
  }
  /** @returns {string} */
  get status() {
    return m(this, Vi) ? m(this, Vi).status : this.cancelled ? "cancelled" : "running";
  }
  /** Abort the timeline, triggering onCancel callbacks. */
  cancel(e = "cancelled") {
    m(this, Tn).signal.aborted || m(this, Tn).abort(e);
  }
  /**
   * Called internally by the execution engine when the timeline finishes.
   * @param {boolean} completed - true if all steps ran, false if cancelled
   */
  _resolve(e) {
    if (m(this, qr)) return;
    I(this, qr, !0);
    const n = typeof e == "boolean" ? { status: e ? "completed" : "cancelled" } : e ?? { status: "cancelled" };
    I(this, Vi, n), m(this, Dr).call(this, n.status === "completed"), m(this, Pr).call(this, n);
  }
};
Tn = new WeakMap(), Dr = new WeakMap(), Pr = new WeakMap(), Rr = new WeakMap(), Hr = new WeakMap(), qr = new WeakMap(), Vi = new WeakMap(), c(kc, "TimelineHandle");
let Ll = kc;
var ci, Gi, di;
const Mc = class Mc {
  constructor() {
    /** @type {Map<string, Set<Function>>} */
    k(this, ci, /* @__PURE__ */ new Map());
    /** @type {Set<string>} Signals that have been emitted (sticky) */
    k(this, Gi, /* @__PURE__ */ new Set());
    k(this, di, !1);
  }
  /**
   * Subscribe to a named signal.
   * @param {string} signal
   * @param {Function} listener
   * @returns {() => void} Unsubscribe function
   */
  on(e, n) {
    if (m(this, di)) return () => {
    };
    let i = m(this, ci).get(e);
    return i || (i = /* @__PURE__ */ new Set(), m(this, ci).set(e, i)), i.add(n), () => i.delete(n);
  }
  /**
   * Fire a named signal synchronously. All registered listeners are invoked.
   * The signal is recorded so that future waitFor() calls resolve immediately.
   * @param {string} signal
   */
  emit(e) {
    if (m(this, di)) return;
    m(this, Gi).add(e);
    const n = m(this, ci).get(e);
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
    return m(this, di) ? Promise.reject(new Error("EventBus destroyed")) : m(this, Gi).has(e) ? Promise.resolve() : new Promise((i, r) => {
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
    I(this, di, !0), m(this, ci).clear(), m(this, Gi).clear();
  }
};
ci = new WeakMap(), Gi = new WeakMap(), di = new WeakMap(), c(Mc, "EventBus");
let Il = Mc;
const Ef = /* @__PURE__ */ new Map();
function es(t, e) {
  Ef.set(t, e);
}
c(es, "registerAwaitProvider");
function Ol(t, e) {
  const n = Ef.get(t.event);
  return n ? n(t, e) : Promise.reject(new Error(`Unknown await event type: "${t.event}"`));
}
c(Ol, "createAwaitPromise");
es("signal", (t, e) => t.name ? e.eventBus.waitFor(t.name, e.signal) : Promise.reject(new Error('await signal: "name" is required')));
es("click", (t, e) => new Promise((n, i) => {
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
es("keypress", (t, e) => new Promise((n, i) => {
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
const $i = /* @__PURE__ */ new Map();
function Jp(t, e) {
  const n = $i.get(t);
  n && !n.cancelled && n.cancel("replaced-by-name"), $i.set(t, e), e.finished.then(() => {
    $i.get(t) === e && $i.delete(t);
  });
}
c(Jp, "registerTimeline");
function Sf(t) {
  const e = $i.get(t);
  return e && !e.cancelled ? (e.cancel("cancelled-by-name"), !0) : !1;
}
c(Sf, "cancelTimeline");
function Xp(t) {
  return $i.get(t);
}
c(Xp, "getTimeline");
function cu(t, e) {
  return t <= 0 ? Promise.resolve() : new Promise((n, i) => {
    if (e.aborted) return i(e.reason);
    const r = setTimeout(n, t);
    e.addEventListener("abort", () => {
      clearTimeout(r), i(e.reason);
    }, { once: !0 });
  });
}
c(cu, "cancellableDelay");
var je, Ln, jr, Br;
const _c = class _c {
  constructor(e) {
    /** @type {TweenTimeline} */
    k(this, je);
    /** @type {Array<{ type: string, params: object, opts?: object, detach: boolean }>} */
    k(this, Ln, []);
    /** @type {Function|null} */
    k(this, jr, null);
    /** @type {Function|null} */
    k(this, Br, null);
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
    return m(this, Ln).push({ type: e, params: n, opts: i ?? {}, detach: !1 }), this;
  }
  /**
   * Mark the last entry as fire-and-forget (does not block step progression).
   * @returns {StepBuilder} this
   */
  detach() {
    if (m(this, Ln).length === 0)
      throw new Error("StepBuilder.detach(): no entry to detach.");
    return m(this, Ln)[m(this, Ln).length - 1].detach = !0, this;
  }
  /**
   * Callback invoked before this step's tweens start.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  before(e) {
    return I(this, jr, e), this;
  }
  /**
   * Callback invoked after this step's awaited tweens complete.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  after(e) {
    return I(this, Br, e), this;
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
      entries: m(this, Ln),
      before: m(this, jr),
      after: m(this, Br)
    };
  }
};
je = new WeakMap(), Ln = new WeakMap(), jr = new WeakMap(), Br = new WeakMap(), c(_c, "StepBuilder");
let Al = _c;
var Be, Oe, Tt, In, Ur, Vr, Gr, zr, Bn, kl, J, tn, Ml, Cf, _l, Tf, Lf, Ma, lt, Pt;
const an = class an {
  constructor() {
    k(this, J);
    /** @type {string|null} */
    k(this, Be, null);
    /** @type {string} */
    k(this, Oe, Te.ABORT);
    /** @type {Array<object>} */
    k(this, Tt, []);
    /** @type {StepBuilder|null} */
    k(this, In, null);
    /** @type {Function|null} */
    k(this, Ur, null);
    /** @type {Function|null} */
    k(this, Vr, null);
    /** @type {Function|null} */
    k(this, Gr, null);
    /** @type {Function|null} */
    k(this, zr, null);
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
    if (e !== Te.ABORT && e !== Te.CONTINUE)
      throw new Error(`Invalid error policy: "${e}". Use "abort" or "continue".`);
    return I(this, Oe, e), this;
  }
  /**
   * Start a new step. Finalizes the previous step if one is open.
   * @returns {StepBuilder}
   */
  step() {
    return C(this, J, tn).call(this), I(this, In, new Al(this)), m(this, In);
  }
  /**
   * Insert a delay (in ms) between the previous step and the next.
   * @param {number} ms
   * @returns {TweenTimeline} this
   */
  delay(e) {
    return C(this, J, tn).call(this), m(this, Tt).push({ kind: "delay", ms: e }), this;
  }
  /**
   * Pause execution until an event occurs.
   * @param {object} config  e.g. { event: "click" }, { event: "signal", name: "fog-done" }
   * @returns {TweenTimeline} this
   */
  await(e) {
    return C(this, J, tn).call(this), m(this, Tt).push({ kind: "await", config: e }), this;
  }
  /**
   * Fire a named signal (instant, non-blocking).
   * @param {string} signal  Signal name
   * @returns {TweenTimeline} this
   */
  emit(e) {
    return C(this, J, tn).call(this), m(this, Tt).push({ kind: "emit", signal: e }), this;
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
    C(this, J, tn).call(this);
    const i = n.join ?? "all", r = n.overflow ?? "detach";
    if (i !== "all" && i !== "any" && (typeof i != "number" || i < 1 || i > e.length))
      throw new Error(`parallel: join must be "all", "any", or 1..${e.length}, got ${JSON.stringify(i)}`);
    if (r !== "detach" && r !== "cancel")
      throw new Error(`parallel: overflow must be "detach" or "cancel", got ${JSON.stringify(r)}`);
    const a = e.map((o) => {
      var l;
      const s = new an();
      return o(s), C(l = s, J, tn).call(l), m(s, Tt);
    });
    return m(this, Tt).push({ kind: "parallel", branches: a, join: i, overflow: r }), this;
  }
  /**
   * Callback invoked before the first step runs.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  beforeAll(e) {
    return I(this, Ur, e), this;
  }
  /**
   * Callback invoked on successful completion.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onComplete(e) {
    return I(this, Vr, e), this;
  }
  /**
   * Callback invoked on cancellation (mutually exclusive with onComplete).
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onCancel(e) {
    return I(this, Gr, e), this;
  }
  /**
   * Callback invoked on runtime failure (mutually exclusive with onComplete/onCancel).
   * @param {(outcome: object) => void} fn
   * @returns {TweenTimeline} this
   */
  onError(e) {
    return I(this, zr, e), this;
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
    C(this, J, tn).call(this);
    const n = new AbortController();
    e.signal && (e.signal.aborted ? n.abort(e.signal.reason ?? "parent-aborted") : e.signal.addEventListener("abort", () => {
      n.signal.aborted || n.abort(e.signal.reason ?? "parent-aborted");
    }, { once: !0 }));
    const i = new Ll(n);
    m(this, Be) && Jp(m(this, Be), i);
    const r = e.broadcast ?? game.user.isGM, a = e.commit ?? game.user.isGM, o = e.startEpochMS ?? Date.now();
    r && m(this, Be) && ka(bf, {
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
    return C(this, J, Cf).call(this, i, l).then((u) => {
      var d, h, f;
      s.destroy(), i._resolve(u), u.status === yn.COMPLETED ? (d = m(this, Vr)) == null || d.call(this) : u.status === yn.CANCELLED ? ((h = m(this, Gr)) == null || h.call(this), r && m(this, Be) && ka(Sl, {
        name: m(this, Be),
        reason: u.reason
      })) : ((f = m(this, zr)) == null || f.call(this, u), r && m(this, Be) && ka(Sl, {
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
    C(this, J, tn).call(this);
    const n = { timeline: C(i = an, Bn, kl).call(i, m(this, Tt)) };
    return m(this, Be) && (n.name = m(this, Be)), m(this, Oe) !== Te.ABORT && (n.errorPolicy = m(this, Oe)), n;
  }
};
Be = new WeakMap(), Oe = new WeakMap(), Tt = new WeakMap(), In = new WeakMap(), Ur = new WeakMap(), Vr = new WeakMap(), Gr = new WeakMap(), zr = new WeakMap(), Bn = new WeakSet(), kl = /* @__PURE__ */ c(function(e) {
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
            return C(a = an, Bn, kl).call(a, r);
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
tn = /* @__PURE__ */ c(function() {
  m(this, In) && (m(this, Tt).push({ kind: "step", data: m(this, In)._finalize() }), I(this, In, null));
}, "#finalizeCurrentStep"), Ml = /* @__PURE__ */ c(function(e) {
  e.length !== 0 && Promise.allSettled(e).catch(() => {
  });
}, "#drainDetached"), Cf = /* @__PURE__ */ c(async function(e, n) {
  var i, r;
  try {
    if (n.signal.aborted) return C(this, J, lt).call(this, n.signal.reason);
    const a = await C(this, J, Ma).call(this, m(this, Ur), yt.BEFORE_ALL, null);
    if (a) {
      if (m(this, Oe) === Te.ABORT) return a;
      n.errors.push(a);
    }
    const o = await C(this, J, _l).call(this, m(this, Tt), n);
    if (o)
      return C(i = an, Bn, Ml).call(i, n.detachedPromises), o;
    if (!n.signal.aborted) {
      const s = await Promise.allSettled(n.detachedPromises);
      for (const l of s)
        if (l.status === "rejected") {
          const u = C(this, J, Pt).call(this, l.reason, yt.ENTRY);
          if (m(this, Oe) === Te.ABORT) return u;
          n.errors.push(u);
        }
    }
    return n.signal.aborted ? C(this, J, lt).call(this, n.signal.reason) : {
      status: yn.COMPLETED,
      ...n.errors.length > 0 ? { errors: n.errors } : {}
    };
  } catch (a) {
    return C(r = an, Bn, Ml).call(r, n.detachedPromises), n.signal.aborted ? C(this, J, lt).call(this, n.signal.reason) : (console.error("TweenTimeline execution error:", a), C(this, J, Pt).call(this, a, yt.RUNTIME));
  }
}, "#execute"), _l = /* @__PURE__ */ c(async function(e, n) {
  let i = -1, r = 0;
  for (const a of e) {
    if (n.signal.aborted) return C(this, J, lt).call(this, n.signal.reason);
    if (a.kind === "delay") {
      try {
        await cu(a.ms, n.signal);
      } catch {
        return C(this, J, lt).call(this, n.signal.reason);
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
          cu(y, n.signal)
        ])), await p;
      } catch (p) {
        if (n.signal.aborted) return C(this, J, lt).call(this, n.signal.reason);
        const y = C(this, J, Pt).call(this, p, yt.AWAIT);
        if (m(this, Oe) === Te.ABORT) return y;
        n.errors.push(y);
      }
      continue;
    }
    if (a.kind === "emit") {
      try {
        n.eventBus.emit(a.signal);
      } catch (p) {
        const y = C(this, J, Pt).call(this, p, yt.EMIT);
        if (m(this, Oe) === Te.ABORT) return y;
        n.errors.push(y);
      }
      continue;
    }
    if (a.kind === "parallel") {
      const p = await C(this, J, Tf).call(this, a, n, r);
      if (p) return p;
      continue;
    }
    i += 1;
    const { entries: o, before: s, after: l } = a.data, u = await C(this, J, Ma).call(this, s, yt.BEFORE_STEP, i);
    if (u) {
      if (m(this, Oe) === Te.ABORT) return u;
      n.errors.push(u);
      continue;
    }
    if (n.signal.aborted) return C(this, J, lt).call(this, n.signal.reason);
    const d = [];
    let h = 0;
    for (const p of o) {
      const y = Ti(p.type);
      if (!y) {
        const E = C(this, J, Pt).call(this, new Error(`TweenTimeline: unknown tween type "${p.type}"`), yt.ENTRY, i, p.type);
        if (m(this, Oe) === Te.ABORT) return E;
        n.errors.push(E), console.warn(E.error.message);
        continue;
      }
      const b = {
        ...p.opts,
        commit: n.commit,
        startEpochMS: n.startEpochMS + r,
        signal: n.signal
      }, v = b.durationMS ?? 2e3, w = Promise.resolve().then(() => y.execute(p.params, b)).then((E) => E === !1 ? {
        ok: !1,
        failure: C(this, J, Pt).call(this, new Error("Tween entry returned false."), yt.ENTRY, i, p.type)
      } : { ok: !0 }).catch((E) => ({
        ok: !1,
        failure: C(this, J, Pt).call(this, E, yt.ENTRY, i, p.type)
      }));
      p.detach ? n.detachedPromises.push(w) : (d.push(w), h = Math.max(h, v));
    }
    const f = await C(this, J, Lf).call(this, d, n.signal);
    if (f === null) return C(this, J, lt).call(this, n.signal.reason);
    for (const p of f)
      if (!p.ok) {
        if (m(this, Oe) === Te.ABORT) return p.failure;
        n.errors.push(p.failure), console.warn("TweenTimeline: entry failed:", p.failure.error);
      }
    const g = await C(this, J, Ma).call(this, l, yt.AFTER_STEP, i);
    if (g) {
      if (m(this, Oe) === Te.ABORT) return g;
      n.errors.push(g);
    }
    if (n.signal.aborted) return C(this, J, lt).call(this, n.signal.reason);
    r += h;
  }
  return null;
}, "#executeSegments"), Tf = /* @__PURE__ */ c(async function(e, n, i = 0) {
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
    const b = /* @__PURE__ */ c(() => {
      if (y) return;
      if (d >= l) {
        y = !0, v(), p(null);
        return;
      }
      const w = s - d - h;
      if (d + w < l) {
        y = !0, v();
        const E = f.filter((A) => A && A.status === yn.FAILED).map((A) => A), L = C(this, J, Pt).call(this, new Error(`parallel: join target ${l} impossible (${d} completed, ${h} failed)`), yt.PARALLEL);
        m(this, Oe) === Te.ABORT ? p(L) : (n.errors.push(L), n.errors.push(...E), p(null));
      }
    }, "checkJoin"), v = /* @__PURE__ */ c(() => {
      if (o === "cancel")
        for (let w = 0; w < s; w++)
          !f[w] && !u[w].signal.aborted && u[w].abort("overflow-cancel");
      for (let w = 0; w < s; w++)
        f[w] || n.detachedPromises.push(g[w]);
    }, "applyOverflow");
    if (g = r.map((w, E) => {
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
      return C(this, J, _l).call(this, w, L).then((A) => {
        if (A)
          if (A.status === yn.CANCELLED) {
            if (u[E].signal.aborted) {
              f[E] = A;
              return;
            }
            f[E] = A, h++;
          } else
            f[E] = A, h++;
        else
          f[E] = { status: yn.COMPLETED }, d++;
        b();
      });
    }), n.signal.aborted) {
      y = !0, p(C(this, J, lt).call(this, n.signal.reason));
      return;
    }
    n.signal.addEventListener("abort", () => {
      y || (y = !0, p(C(this, J, lt).call(this, n.signal.reason)));
    }, { once: !0 });
  });
}, "#executeParallel"), /**
 * @param {Array<Promise<{ok: boolean, failure?: object}>>} stepPromises
 * @param {AbortSignal} signal
 * @returns {Promise<Array<{ok: boolean, failure?: object}>|null>}
 */
Lf = /* @__PURE__ */ c(function(e, n) {
  return e.length === 0 ? Promise.resolve([]) : n.aborted ? Promise.resolve(null) : new Promise((i, r) => {
    const a = /* @__PURE__ */ c(() => i(null), "onAbort");
    n.addEventListener("abort", a, { once: !0 }), Promise.all(e).then((o) => {
      n.removeEventListener("abort", a), i(o);
    }).catch((o) => {
      n.removeEventListener("abort", a), r(o);
    });
  });
}, "#waitForStep"), Ma = /* @__PURE__ */ c(async function(e, n, i) {
  if (!e) return null;
  try {
    return await e(), null;
  } catch (r) {
    const a = C(this, J, Pt).call(this, r, n, i ?? void 0);
    return m(this, Oe) === Te.CONTINUE && console.warn(`TweenTimeline: hook failure in ${n}:`, r), a;
  }
}, "#runHook"), /** @param {unknown} reason */
lt = /* @__PURE__ */ c(function(e) {
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
Pt = /* @__PURE__ */ c(function(e, n, i, r) {
  const a = e instanceof Error ? e : new Error(String(e));
  return {
    status: yn.FAILED,
    error: a,
    phase: n,
    ...typeof i == "number" ? { stepIndex: i } : {},
    ...r ? { entryType: r } : {}
  };
}, "#failedOutcome"), k(an, Bn), c(an, "TweenTimeline");
let eo = an;
function pc(t) {
  if (!t || typeof t != "object")
    throw new Error("Sequence JSON: data must be an object.");
  if (!Array.isArray(t.timeline))
    throw new Error("Sequence JSON: 'timeline' must be an array.");
  if (t.name != null && typeof t.name != "string")
    throw new Error("Sequence JSON: 'name' must be a string.");
  if (t.errorPolicy != null && t.errorPolicy !== Te.ABORT && t.errorPolicy !== Te.CONTINUE)
    throw new Error(`Sequence JSON: 'errorPolicy' must be "abort" or "continue".`);
  If(t.timeline, "timeline", 0);
}
c(pc, "validateSequenceJSON");
function If(t, e, n = 0) {
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
        If(d, `${a}.parallel.branches[${u}]`, n + 1);
      }
      continue;
    }
    throw new Error(`Sequence JSON: ${a} is not a recognized segment (step array, delay, await, emit, or parallel).`);
  }
}
c(If, "validateSegmentsJSON");
function Of(t) {
  pc(t), Af(t.timeline, "timeline");
}
c(Of, "validateSequenceSemantics");
function Af(t, e) {
  for (let n = 0; n < t.length; n++) {
    const i = t[n], r = `${e}[${n}]`;
    if (Array.isArray(i))
      for (let a = 0; a < i.length; a++) {
        const o = i[a];
        try {
          Fp(o.type, o.params ?? {});
        } catch (s) {
          throw new Error(`Sequence JSON: ${r}[${a}] failed semantic validation: ${s.message}`);
        }
      }
    else if (i.parallel)
      for (let a = 0; a < i.parallel.branches.length; a++)
        Af(i.parallel.branches[a], `${r}.parallel.branches[${a}]`);
  }
}
c(Af, "validateSegmentsSemantics");
function yc(t, e = {}) {
  pc(t), e.validateSemantics && Of(t);
  const n = new eo();
  return t.name && n.name(t.name), t.errorPolicy && n.errorPolicy(t.errorPolicy), kf(t.timeline, n), n;
}
c(yc, "compileSequence");
function kf(t, e) {
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
      const i = n.parallel, r = i.branches.map((a) => (o) => kf(a, o));
      e.parallel(r, {
        join: i.join ?? "all",
        overflow: i.overflow ?? "detach"
      });
    }
  }
}
c(kf, "compileSegments");
function Qp(t) {
  pc(t), Of(t);
}
c(Qp, "validate$3");
async function Zp(t, e = {}) {
  return yc(t, { validateSemantics: !0 }).run({
    broadcast: !1,
    commit: e.commit,
    startEpochMS: e.startEpochMS,
    signal: e.signal
  }).finished;
}
c(Zp, "execute$3");
function ey() {
  xt({ type: "sequence", execute: Zp, validate: Qp });
}
c(ey, "registerSequenceTween");
function ty(t) {
  if (t.x == null && t.y == null && t.scale == null)
    throw new Error("camera-pan tween: at least one of 'x', 'y', or 'scale' is required.");
  if (t.x != null && typeof t.x != "number")
    throw new Error("camera-pan tween: 'x' must be a number.");
  if (t.y != null && typeof t.y != "number")
    throw new Error("camera-pan tween: 'y' must be a number.");
  if (t.scale != null && (typeof t.scale != "number" || t.scale <= 0))
    throw new Error("camera-pan tween: 'scale' must be a positive number.");
}
c(ty, "validate$2");
async function ny(t, e = {}) {
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
c(ny, "execute$2");
function iy() {
  xt({ type: "camera-pan", execute: ny, validate: ty });
}
c(iy, "registerCameraPanTween");
function ry(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((i) => !i || typeof i != "string"))
    throw new Error("tile-tint tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (t.toColor == null || typeof t.toColor != "string")
    throw new Error("tile-tint tween: 'toColor' (CSS color string) is required.");
  if (!foundry.utils.Color.fromString(t.toColor).valid)
    throw new Error(`tile-tint tween: invalid target color "${t.toColor}".`);
  if (t.mode && !Yi().includes(t.mode))
    throw new Error(
      `tile-tint tween: unknown mode "${t.mode}". Available: ${Yi().join(", ")}`
    );
}
c(ry, "validate$1");
async function ay(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { Color: i } = foundry.utils, { uuid: r, toColor: a, mode: o = "oklch" } = t, s = Array.isArray(r) ? r : [r];
  if (s.length === 0)
    return console.warn("tile-tint tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: l = 2e3,
    easing: u = "easeInOutCosine",
    commit: d = !0,
    startEpochMS: h = null,
    signal: f = null
  } = e, g = Kt(u), p = wf(o), y = i.fromString(a);
  if (!y.valid) throw new Error(`tile-tint tween: invalid target color "${a}".`);
  async function b(w) {
    var H, B;
    if (f != null && f.aborted) return !1;
    const E = await fromUuid(w);
    if (!E) return !1;
    const L = E.object;
    if (!L) return !1;
    const A = ((B = (H = E._source) == null ? void 0 : H.texture) == null ? void 0 : B.tint) ?? "#ffffff", O = i.fromString(A);
    O.valid || console.warn(`tile-tint tween: source tint invalid on ${w}, using white.`);
    const M = O.valid ? O : i.fromString("#ffffff"), x = { t: 0 }, R = `tile-tint-tween:${w}`;
    n.terminateAnimation(R), f && f.addEventListener("abort", () => {
      n.terminateAnimation(R);
    }, { once: !0 });
    const D = typeof h == "number" ? Math.max(0, Math.min(l, Date.now() - h)) : 0, F = /* @__PURE__ */ c((W) => {
      const q = p(M, y, W);
      E.updateSource({ texture: { tint: q } }), L.refresh();
    }, "applyFrame");
    D > 0 && (x.t = D / l, F(x.t));
    const N = await n.animate(
      [{ parent: x, attribute: "t", to: 1 }],
      {
        name: R,
        duration: l,
        easing: g,
        time: D,
        ontick: /* @__PURE__ */ c(() => F(x.t), "ontick")
      }
    );
    if (N !== !1) {
      if (f != null && f.aborted) return !1;
      E.updateSource({ texture: { tint: y.toHTML() } }), L.refresh();
    }
    if (d && N !== !1 && E.canUserModify(game.user, "update")) {
      if (f != null && f.aborted) return !1;
      E.updateSource({ texture: { tint: M.toHTML() } }), await E.update({ "texture.tint": y.toHTML() });
    }
    return N !== !1;
  }
  return c(b, "animateOne"), (await Promise.all(s.map(b))).every(Boolean);
}
c(ay, "execute$1");
function oy() {
  xt({ type: "tile-tint", execute: ay, validate: ry });
}
c(oy, "registerTileTintTween");
function sy(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("tile-scale tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (typeof t.toScale != "number" || t.toScale <= 0)
    throw new Error("tile-scale tween: 'toScale' must be a positive number.");
  for (const n of ["baseWidth", "baseHeight", "centerX", "centerY"])
    if (typeof t[n] != "number")
      throw new Error(`tile-scale tween: '${n}' (number) is required.`);
}
c(sy, "validate");
async function ly(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, toScale: r, baseWidth: a, baseHeight: o, centerX: s, centerY: l } = t, u = Array.isArray(i) ? i : [i];
  if (u.length === 0) return !0;
  const {
    durationMS: d = 2e3,
    easing: h = "easeInOutCosine",
    commit: f = !0,
    startEpochMS: g = null,
    signal: p = null
  } = e, y = Kt(h), b = a * r, v = o * r, w = s - b / 2, E = l - v / 2;
  async function L(O) {
    if (p != null && p.aborted) return !1;
    const M = await fromUuid(O);
    if (!M) return !1;
    const x = M.object;
    if (!x) return !1;
    const R = M._source.width, D = M._source.height, F = M._source.x, N = M._source.y, H = `tile-scale-tween:${O}`;
    n.terminateAnimation(H), p && p.addEventListener("abort", () => {
      n.terminateAnimation(H);
    }, { once: !0 });
    const B = typeof g == "number" ? Math.max(0, Math.min(d, Date.now() - g)) : 0, W = /* @__PURE__ */ c((K) => {
      const ae = R + (b - R) * K, Q = D + (v - D) * K, te = F + (w - F) * K, Jt = N + (E - N) * K;
      M.updateSource({ width: ae, height: Q, x: te, y: Jt }), x.refresh();
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
      M.updateSource({ width: b, height: v, x: w, y: E }), x.refresh();
    }
    if (f && U !== !1 && M.canUserModify(game.user, "update")) {
      if (p != null && p.aborted) return !1;
      M.updateSource({ width: R, height: D, x: F, y: N }), await M.update({ width: b, height: v, x: w, y: E });
    }
    return U !== !1;
  }
  return c(L, "animateOne"), (await Promise.all(u.map(L))).every(Boolean);
}
c(ly, "execute");
function cy() {
  xt({ type: "tile-scale", execute: ly, validate: sy });
}
c(cy, "registerTileScaleTween");
async function uy(t, e, n = {}) {
  if (!game.user.isGM)
    return ui.notifications.warn("Only the GM can dispatch tweens."), !1;
  const i = Ti(t);
  if (!i)
    throw new Error(`Unknown tween type: "${t}". Registered types: ${Cl().join(", ")}`);
  i.validate(e);
  const { durationMS: r = 2e3, easing: a = "easeInOutCosine", commit: o = !0 } = n, s = Date.now();
  return ka(yf, {
    type: t,
    params: e,
    durationMS: r,
    easing: a,
    startEpochMS: s,
    commit: !1
  }), i.execute(e, { durationMS: r, easing: a, commit: o, startEpochMS: s });
}
c(uy, "dispatchTween");
function dy(t) {
  const { type: e, params: n, durationMS: i, easing: r, startEpochMS: a, commit: o } = t ?? {}, s = Ti(e);
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
c(dy, "handleTweenSocketMessage");
Bp();
Gp();
zp();
Kp();
ey();
iy();
oy();
cy();
xt({ type: "token-prop", execute: Zo, validate: Qo });
xt({ type: "drawing-prop", execute: Zo, validate: Qo });
xt({ type: "sound-prop", execute: Zo, validate: Qo });
gc(yf, dy);
gc(bf, fy);
gc(Sl, my);
function fy(t) {
  const { data: e, startEpochMS: n } = t ?? {};
  if (!e) {
    console.warn(`[${T}] Received empty tween-sequence socket message.`);
    return;
  }
  try {
    yc(e, { validateSemantics: !0 }).run({ commit: !1, startEpochMS: n, broadcast: !1 });
  } catch (i) {
    console.error(`[${T}] Failed to run received tween sequence:`, i);
  }
}
c(fy, "handleSequenceSocketMessage");
function my(t) {
  const { name: e } = t ?? {};
  e && Sf(e);
}
c(my, "handleSequenceCancelMessage");
function hy() {
  Hooks.once("ready", () => {
    xp();
    const t = game.modules.get(T);
    t.api || (t.api = {}), t.api.tween = {
      dispatch: uy,
      types: Cl,
      Timeline: eo,
      ErrorPolicy: Te,
      compileSequence: yc,
      cancelTimeline: Sf,
      getTimeline: Xp
    }, console.log(`[${T}] Tween API registered. Types: ${Cl().join(", ")}`);
  });
}
c(hy, "registerTweenHooks");
hy();
const gy = ["tag", "tag-all", "id", "tags-any", "tags-all"], py = /* @__PURE__ */ new Set(["tags-any", "tags-all"]);
function bc(t) {
  if (!t || typeof t != "string")
    return { type: "unknown", value: t ?? "" };
  if (t.startsWith("$"))
    return { type: "special", value: t };
  for (const e of gy)
    if (t.startsWith(`${e}:`)) {
      const n = t.slice(e.length + 1), i = py.has(e) ? n.split(",").map((r) => r.trim()) : n;
      return { type: e, value: i };
    }
  return t.includes(".") ? { type: "uuid", value: t } : { type: "unknown", value: t };
}
c(bc, "parseSelector");
function yy(t) {
  if (!t) return "";
  const { type: e, value: n } = t;
  if (e === "special" || e === "uuid" || e === "unknown")
    return Array.isArray(n) ? n.join(",") : n ?? "";
  const i = Array.isArray(n) ? n.join(",") : n ?? "";
  return `${e}:${i}`;
}
c(yy, "buildSelector");
function Mf(t, e = "first") {
  return t != null && t.length ? t.length === 1 ? e === "first-all" || e === "all" ? `tag-all:${t[0]}` : `tag:${t[0]}` : e === "any" ? `tags-any:${t.join(",")}` : e === "all" ? `tags-all:${t.join(",")}` : e === "first-all" ? `tags-all:${t.join(",")}` : `tags-any:${t.join(",")}` : "";
}
c(Mf, "buildTagSelector");
function ts(t) {
  if (!t) return null;
  if (t.documentName || t._source !== void 0) {
    const e = t.object;
    return e ? { placeable: e, doc: t } : null;
  }
  return t.document ? { placeable: t, doc: t.document } : null;
}
c(ts, "normalizePlaceable");
function _f() {
  var t;
  return window.Tagger ?? ((t = game.modules.get("tagger")) == null ? void 0 : t.api) ?? null;
}
c(_f, "getTaggerAPI");
function ns(t, e) {
  if (!t) return null;
  const n = e ?? canvas.scene;
  if (!n) return null;
  const i = bc(t);
  switch (i.type) {
    case "special":
      return by(i.value);
    case "tag":
      return uu(i.value, n);
    case "tag-all":
      return uu(i.value, n);
    case "id":
      return vy(i.value, n);
    case "tags-any":
      return du(i.value, n, !0);
    case "tags-all":
      return du(i.value, n, !1);
    case "uuid":
      return wy(i.value);
    default:
      return null;
  }
}
c(ns, "resolveSelector");
function by(t) {
  var e;
  if (t === "$particles") {
    if (!((e = game.modules.get("fxmaster")) != null && e.active))
      return console.warn(`[${T}] Picker: FXMaster not active, cannot resolve "$particles".`), null;
    const n = canvas.particleeffects;
    return n ? { kind: "particles", documents: [], placeables: [], target: n } : null;
  }
  return null;
}
c(by, "resolveSpecial");
function uu(t, e, n) {
  const i = _f();
  if (!i)
    return console.warn(`[${T}] Picker: Tagger not available, cannot resolve tag "${t}".`), null;
  const r = i.getByTag(t, { sceneId: e.id });
  if (!(r != null && r.length)) return null;
  const a = [];
  for (const o of r) {
    const s = ts(o);
    s && a.push(s);
  }
  return a.length === 0 ? null : {
    kind: a.length === 1 ? "placeable" : "multi-placeable",
    documents: a.map((o) => o.doc),
    placeables: a
  };
}
c(uu, "resolveTag");
function vy(t, e) {
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
      const a = ts(r);
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
c(vy, "resolveById");
function du(t, e, n) {
  const i = _f();
  if (!i)
    return console.warn(`[${T}] Picker: Tagger not available, cannot resolve multi-tag.`), null;
  const r = i.getByTag(t, {
    sceneId: e.id,
    matchAny: n
  });
  if (!(r != null && r.length)) return null;
  const a = [];
  for (const o of r) {
    const s = ts(o);
    s && a.push(s);
  }
  return a.length === 0 ? null : {
    kind: a.length === 1 ? "placeable" : "multi-placeable",
    documents: a.map((o) => o.doc),
    placeables: a
  };
}
c(du, "resolveMultiTag");
function wy(t) {
  const e = fromUuidSync(t);
  if (!e) return null;
  const n = ts(e);
  return n ? {
    kind: "placeable",
    documents: [n.doc],
    placeables: [n]
  } : null;
}
c(wy, "resolveUUID");
function Ey(t) {
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
c(Ey, "adaptResolved");
function to(t) {
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
    const o = ns(a), s = Ey(o);
    s ? n.set(a, s) : i.push(a);
  }
  return i.length && console.warn(`[${T}] Cinematic: ${i.length} unresolved target(s): ${i.join(", ")}`), { targets: n, unresolved: i };
}
c(to, "resolveAllTargets");
function Sy(t, e) {
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
c(Sy, "captureSnapshot");
function Cy(t) {
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
c(Cy, "gatherAllStateMaps");
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
const fu = {
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
}, Ty = /* @__PURE__ */ new Set([
  "alpha",
  "visible",
  "x",
  "y",
  "scale",
  "rotation"
]);
function Es(t, e, n) {
  const i = {};
  for (const [r, a] of Object.entries(t))
    e.has(r) ? i[r] = a : console.warn(`[${T}] Cinematic: blocked property "${r}" on ${n}.`);
  return i;
}
c(Es, "filterOverrides");
function Le(t, e) {
  var i, r;
  if (!t) return;
  const n = [];
  for (const [a, o] of Object.entries(t)) {
    const s = e.get(a);
    if (s)
      if (s.kind === "particles") {
        if (s.target.destroyed) continue;
        const l = Es(o, Ty, "$particles");
        for (const [u, d] of Object.entries(l))
          s.target[u] = d;
      } else if (s.kind === "multi-placeable")
        for (const { placeable: l, doc: u } of s.placeables) {
          if (!(u != null && u.parent) || !(l != null && l.scene)) continue;
          const d = u.documentName, h = fu[d];
          if (!h) {
            console.warn(`[${T}] Cinematic: no allowlist for document type "${d}" on "${a}", skipping.`);
            continue;
          }
          const f = Es(o, h, `${d} "${a}"`);
          u.updateSource(f), n.push(l);
        }
      else {
        if (!((i = s.doc) != null && i.parent) || !((r = s.placeable) != null && r.scene)) continue;
        const l = s.doc.documentName, u = fu[l];
        if (!u) {
          console.warn(`[${T}] Cinematic: no allowlist for document type "${l}" on "${a}", skipping.`);
          continue;
        }
        const d = Es(o, u, `${l} "${a}"`);
        s.doc.updateSource(d), n.push(s.placeable);
      }
  }
  for (const a of n)
    a.refresh();
}
c(Le, "applyState");
function xi(t, e) {
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
c(xi, "refreshPerceptionIfNeeded");
const Ly = {
  "tile-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "light-color": /* @__PURE__ */ new Set(["uuid", "toColor", "toAlpha", "mode"]),
  "light-state": /* @__PURE__ */ new Set(["uuid", "enabled"]),
  "particles-prop": /* @__PURE__ */ new Set(["attribute", "value"]),
  "camera-pan": /* @__PURE__ */ new Set(["x", "y", "scale"]),
  "token-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "drawing-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "sound-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"])
}, Iy = /* @__PURE__ */ new Set(["easing"]), Oy = /* @__PURE__ */ new Set(["type", "target"]);
function Nf(t, e) {
  const { type: n, target: i, ...r } = t;
  if (!n)
    return console.warn(`[${T}] Cinematic: tween entry missing 'type', skipping.`), null;
  const a = {}, o = {}, s = Ly[n];
  if (i === "$particles")
    a.target = "$particles";
  else if (i) {
    const l = e.get(i);
    if (!l) return null;
    l.kind === "multi-placeable" ? a.uuid = l.placeables.map((u) => u.doc.uuid) : a.uuid = l.doc.uuid;
  }
  for (const [l, u] of Object.entries(r))
    Oy.has(l) || (Iy.has(l) ? o[l] = u : (s != null && s.has(l), a[l] = u));
  return { type: n, params: a, opts: o };
}
c(Nf, "compileTween");
const Or = /* @__PURE__ */ new Map();
let Ay = 0;
async function ky(t) {
  var u, d, h, f, g;
  const { id: e, src: n, volume: i = 0.8, loop: r = !1, fadeIn: a } = t;
  if (!n) {
    console.warn(`[${T}] Cinematic sound: missing 'src', skipping.`);
    return;
  }
  const o = e || `__auto_${++Ay}`, s = {
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
c(ky, "playLocalSound");
function Ss(t) {
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
c(Ss, "stopCinematicSound");
function mu() {
  var t, e;
  for (const [n, i] of Or)
    try {
      (e = (t = i.sound).stop) == null || e.call(t);
    } catch (r) {
      console.warn(`[${T}] Cinematic sound: error stopping "${n}" during cleanup:`, r);
    }
  Or.clear();
}
c(mu, "stopAllCinematicSounds");
function My(t, e, n, i = {}) {
  const { skipToStep: r, onStepComplete: a, timelineName: o } = i, s = new n().name(o ?? `cinematic-${canvas.scene.id}`);
  return s.beforeAll(() => {
    var l;
    try {
      Le(t.setup, e), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    } catch (u) {
      throw console.error(`[${T}] Cinematic: error in beforeAll (setup state) on scene ${(l = canvas.scene) == null ? void 0 : l.id}:`, u), u;
    }
  }), xf(t.timeline, s, e, { skipToStep: r, onStepComplete: a }), { tl: s };
}
c(My, "buildTimeline");
function $f(t, e) {
  var n;
  if (t)
    for (const i of t)
      for (const r of i) {
        if (r.before)
          try {
            Le(r.before, e), xi(r.before, e);
          } catch (a) {
            console.warn(`[${T}] Cinematic: error in skipped parallel before:`, a);
          }
        if (r.after)
          try {
            Le(r.after, e), xi(r.after, e);
          } catch (a) {
            console.warn(`[${T}] Cinematic: error in skipped parallel after:`, a);
          }
        (n = r.parallel) != null && n.branches && $f(r.parallel.branches, e);
      }
}
c($f, "applyParallelStatesForSkip");
function xf(t, e, n, i = {}) {
  const { skipToStep: r, onStepComplete: a } = i;
  let o = -1;
  for (const s of t) {
    if (s.sound != null) {
      if (r != null && o < r) continue;
      const h = s.sound, { duration: f, loop: g, fireAndForget: p } = h, y = e.step();
      if (y.before(() => {
        ky(h);
      }), f && f > 0)
        if (p) {
          if (g && h.id) {
            const b = h.id, v = f;
            y.before(() => {
              setTimeout(() => Ss(b), v);
            });
          }
        } else
          e.delay(f), g && e.step().before(() => {
            Ss(h.id);
          });
      continue;
    }
    if (s.stopSound != null) {
      if (r != null && o < r) continue;
      const h = s.stopSound;
      e.step().before(() => {
        Ss(h);
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
        $f(s.parallel.branches, n);
        continue;
      }
      const h = s.parallel, f = h.branches.map((g) => (p) => xf(g, p, n));
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
          Le(s.before, n), xi(s.before, n);
        } catch (h) {
          console.warn(`[${T}] Cinematic: error applying skipped step.before:`, h);
        }
      if (s.after)
        try {
          Le(s.after, n), xi(s.after, n);
        } catch (h) {
          console.warn(`[${T}] Cinematic: error applying skipped step.after:`, h);
        }
      continue;
    }
    const l = o, u = e.step();
    s.before && u.before(() => {
      var h;
      try {
        Le(s.before, n), xi(s.before, n);
      } catch (f) {
        throw console.error(`[${T}] Cinematic: error in step.before callback on scene ${(h = canvas.scene) == null ? void 0 : h.id}:`, f), f;
      }
    });
    const d = s.duration ?? 500;
    for (const h of s.tweens) {
      const f = Nf(h, n);
      f && u.add(f.type, f.params, { ...f.opts, durationMS: d });
    }
    u.after(() => {
      var h;
      try {
        s.after && (Le(s.after, n), xi(s.after, n)), a == null || a(l);
      } catch (f) {
        throw console.error(`[${T}] Cinematic: error in step.after callback on scene ${(h = canvas.scene) == null ? void 0 : h.id}:`, f), f;
      }
    });
  }
}
c(xf, "compileCinematicEntries");
function Fi(t, e, n) {
  if (t != null) {
    if (typeof t != "object" || Array.isArray(t)) {
      n.push({ path: e, level: "error", message: `Expected object, got ${Array.isArray(t) ? "array" : typeof t}` });
      return;
    }
    for (const [i, r] of Object.entries(t))
      (typeof r != "object" || r === null || Array.isArray(r)) && n.push({ path: `${e}["${i}"]`, level: "error", message: `Expected property overrides object, got ${Array.isArray(r) ? "array" : typeof r}` });
  }
}
c(Fi, "validateStateMap");
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
      if (Fi(o.before, `${s}.before`, i), Fi(o.after, `${s}.after`, i), o.tweens)
        for (let l = 0; l < o.tweens.length; l++) {
          const u = o.tweens[l], d = `${s}.tweens[${l}]`;
          if (!u.type) {
            i.push({ path: d, level: "error", message: "Missing 'type' field" });
            continue;
          }
          const h = Ti(u.type);
          if (!h) {
            i.push({ path: d, level: "error", message: `Unknown tween type: "${u.type}"` });
            continue;
          }
          if (n)
            try {
              const f = Nf(u, n);
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
function _y(t, e = null) {
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
      Fi(s.setup, `${l}.setup`, n), Fi(s.landing, `${l}.landing`, n), s.timeline && Array.isArray(s.timeline) && xl(s.timeline, `${l}.timeline`, e, n), s.next && typeof s.next == "string" && !t.segments[s.next] && n.push({ path: `${l}.next`, level: "error", message: `Next segment "${s.next}" not found` });
    }
  } else
    Fi(t.setup, "setup", n), Fi(t.landing, "landing", n), t.timeline && Array.isArray(t.timeline) && xl(t.timeline, "timeline", e, n);
  return n;
}
c(_y, "validateCinematicDeep");
const Cs = 5, hu = /* @__PURE__ */ new Set(["click", "tile-click", "keypress"]);
var le, me, Ue, Ae, mt, dr, Fl, Ff, Y, $e, _a, Ce, bt;
const se = class se {
  constructor(e = null, { loadedHash: n = null, cinematicName: i = "default", segmentName: r = null } = {}) {
    k(this, Y);
    k(this, le);
    k(this, me);
    k(this, Ue);
    k(this, Ae);
    var o;
    I(this, le, e ?? se.empty()), I(this, me, i), I(this, Ae, n);
    const a = (o = m(this, le).cinematics) == null ? void 0 : o[m(this, me)];
    I(this, Ue, r ?? (a == null ? void 0 : a.entry) ?? "main");
  }
  static empty() {
    return {
      version: Cs,
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
        return v.await != null && hu.has(((w = v.await) == null ? void 0 : w.event) ?? "click");
      }
    )) {
      const v = s.filter((L) => L.transitionTo == null), w = s.find((L) => L.transitionTo != null), E = { timeline: v };
      if (a && Object.keys(a).length && (E.setup = a), o && Object.keys(o).length && (E.landing = o), w) {
        const L = w.transitionTo;
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
      const v = `segment-${h++}`, w = { timeline: [...d] };
      return f && (w.gate = f), u[v] = w, g.push(v), d = [], f = null, v;
    }
    c(p, "flushSegment");
    for (const v of s)
      if (v.transitionTo == null) {
        if (v.await != null && hu.has(((b = v.await) == null ? void 0 : b.event) ?? "click")) {
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
      (i = a.timeline) != null && i.length && (a.timeline = C(r = se, mt, Fl).call(r, a.timeline));
    return n;
  }
  static fromScene(e, n = "default") {
    var o;
    const i = e == null ? void 0 : e.getFlag(T, "cinematic");
    let r = i ? foundry.utils.deepClone(i) : null;
    const a = i ? C(o = se, mt, Ff).call(o, i) : null;
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
      r.version = Cs;
    }
    return new se(r, { loadedHash: a, cinematicName: n });
  }
  /**
   * Check if the scene's cinematic flag has been modified since this state was loaded.
   * @param {object} scene  The Foundry scene document
   * @returns {boolean} true if scene data differs from what was loaded
   */
  isStale(e) {
    if (!m(this, Ae)) return !1;
    const n = e == null ? void 0 : e.getFlag(T, "cinematic");
    return n ? !foundry.utils.objectsEqual(n, m(this, Ae)) : !1;
  }
  // ── Read ──────────────────────────────────────────────────────────────
  get data() {
    return m(this, le);
  }
  get trigger() {
    return m(this, Y, $e).trigger;
  }
  get tracking() {
    return m(this, Y, $e).tracking;
  }
  get synchronized() {
    return m(this, Y, $e).synchronized ?? !1;
  }
  get activeCinematicName() {
    return m(this, me);
  }
  // ── Segment accessors ────────────────────────────────────────────────
  get segments() {
    return m(this, Y, $e).segments;
  }
  get entry() {
    return m(this, Y, $e).entry;
  }
  get activeSegmentName() {
    return m(this, Ue);
  }
  get activeSegment() {
    var e;
    return ((e = m(this, Y, $e).segments) == null ? void 0 : e[m(this, Ue)]) ?? null;
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
      loadedHash: m(this, Ae),
      cinematicName: e,
      segmentName: n.entry ?? "main"
    });
  }
  addCinematic(e) {
    if (!e || m(this, le).cinematics[e]) return this;
    const n = foundry.utils.deepClone(m(this, le));
    return n.cinematics[e] = se.emptyCinematic(), new se(n, {
      loadedHash: m(this, Ae),
      cinematicName: e,
      segmentName: "main"
    });
  }
  removeCinematic(e) {
    if (Object.keys(m(this, le).cinematics).length <= 1) return this;
    if (!m(this, le).cinematics[e]) return this;
    const i = foundry.utils.deepClone(m(this, le));
    delete i.cinematics[e];
    const r = m(this, me) === e ? Object.keys(i.cinematics)[0] : m(this, me), a = i.cinematics[r];
    return new se(i, {
      loadedHash: m(this, Ae),
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
    const a = m(this, me) === e ? n : m(this, me);
    return new se(i, {
      loadedHash: m(this, Ae),
      cinematicName: a,
      segmentName: m(this, Ue)
    });
  }
  // ── Cinematic-level mutations ─────────────────────────────────────────
  setTrigger(e) {
    return C(this, Y, _a).call(this, { trigger: e });
  }
  setTracking(e) {
    return C(this, Y, _a).call(this, { tracking: e });
  }
  setSynchronized(e) {
    return C(this, Y, _a).call(this, { synchronized: e });
  }
  // ── Segment-level mutations (setup/landing now live on segments) ──────
  setSetup(e) {
    return C(this, Y, Ce).call(this, { setup: e });
  }
  setLanding(e) {
    return C(this, Y, Ce).call(this, { landing: e });
  }
  // ── Segment management methods ────────────────────────────────────────
  switchSegment(e) {
    var n;
    return (n = m(this, Y, $e).segments) != null && n[e] ? new se(foundry.utils.deepClone(m(this, le)), {
      loadedHash: m(this, Ae),
      cinematicName: m(this, me),
      segmentName: e
    }) : this;
  }
  addSegment(e, n = null) {
    var a;
    if (!e || (a = m(this, Y, $e).segments) != null && a[e]) return this;
    const i = foundry.utils.deepClone(m(this, le)), r = i.cinematics[m(this, me)];
    if (r.segments[e] = se.emptySegment(), n && r.segments[n]) {
      const o = r.segments[n].next;
      r.segments[n].next = e, o && (r.segments[e].next = o);
    }
    return new se(i, {
      loadedHash: m(this, Ae),
      cinematicName: m(this, me),
      segmentName: e
    });
  }
  removeSegment(e) {
    var s, l;
    if (Object.keys(m(this, Y, $e).segments ?? {}).length <= 1) return this;
    if (!((s = m(this, Y, $e).segments) != null && s[e])) return this;
    const i = foundry.utils.deepClone(m(this, le)), r = i.cinematics[m(this, me)], a = r.segments[e].next;
    for (const [, u] of Object.entries(r.segments))
      (u.next === e || typeof u.next == "object" && ((l = u.next) == null ? void 0 : l.segment) === e) && (u.next = a ?? void 0, u.next || delete u.next);
    delete r.segments[e], r.entry === e && (r.entry = Object.keys(r.segments)[0]);
    const o = m(this, Ue) === e ? r.entry : m(this, Ue);
    return new se(i, {
      loadedHash: m(this, Ae),
      cinematicName: m(this, me),
      segmentName: o
    });
  }
  renameSegment(e, n) {
    var s, l, u;
    if (!e || !n || e === n) return this;
    if (!((s = m(this, Y, $e).segments) != null && s[e])) return this;
    if ((l = m(this, Y, $e).segments) != null && l[n]) return this;
    const i = foundry.utils.deepClone(m(this, le)), r = i.cinematics[m(this, me)], a = {};
    for (const [d, h] of Object.entries(r.segments))
      a[d === e ? n : d] = h;
    r.segments = a;
    for (const [, d] of Object.entries(r.segments))
      d.next === e ? d.next = n : typeof d.next == "object" && ((u = d.next) == null ? void 0 : u.segment) === e && (d.next.segment = n);
    r.entry === e && (r.entry = n);
    const o = m(this, Ue) === e ? n : m(this, Ue);
    return new se(i, {
      loadedHash: m(this, Ae),
      cinematicName: m(this, me),
      segmentName: o
    });
  }
  setSegmentGate(e) {
    return C(this, Y, Ce).call(this, { gate: e ?? void 0 });
  }
  setSegmentNext(e) {
    return C(this, Y, Ce).call(this, { next: e ?? void 0 });
  }
  setSegmentSetup(e) {
    return C(this, Y, Ce).call(this, { setup: e });
  }
  setSegmentLanding(e) {
    return C(this, Y, Ce).call(this, { landing: e });
  }
  listSegmentNames() {
    return Object.keys(m(this, Y, $e).segments ?? {});
  }
  // ── Timeline entry mutations (scoped to active segment) ──────────────
  addStep(e = -1) {
    const n = [...this.activeSegment.timeline], i = { duration: 1e3, tweens: [] };
    return e < 0 || e >= n.length ? n.push(i) : n.splice(e, 0, i), C(this, Y, Ce).call(this, { timeline: n });
  }
  addDelay(e = -1, n = 1e3) {
    const i = [...this.activeSegment.timeline], r = { delay: n };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), C(this, Y, Ce).call(this, { timeline: i });
  }
  addAwait(e = -1, n = null) {
    return console.warn(`[${T}] CinematicState.addAwait() is deprecated in v4. Use segment gates instead.`), this;
  }
  addEmit(e = -1, n = "") {
    const i = [...this.activeSegment.timeline], r = { emit: n };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), C(this, Y, Ce).call(this, { timeline: i });
  }
  addParallel(e = -1) {
    const n = [...this.activeSegment.timeline], i = { parallel: { branches: [[], []], join: "all", overflow: "detach" } };
    return e < 0 || e >= n.length ? n.push(i) : n.splice(e, 0, i), C(this, Y, Ce).call(this, { timeline: n });
  }
  addTransitionTo(e = -1, n = null) {
    return console.warn(`[${T}] CinematicState.addTransitionTo() is deprecated in v4. Use segment next edges instead.`), this;
  }
  addSound(e = -1, n = null) {
    const i = [...this.activeSegment.timeline], r = { sound: n ?? { src: "", volume: 0.8, loop: !1, duration: 0, fireAndForget: !1 } };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), C(this, Y, Ce).call(this, { timeline: i });
  }
  addStopSound(e = -1, n = "") {
    const i = [...this.activeSegment.timeline], r = { stopSound: n };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), C(this, Y, Ce).call(this, { timeline: i });
  }
  moveEntry(e, n) {
    if (e === n) return this;
    const i = [...this.activeSegment.timeline];
    if (e < 0 || e >= i.length) return this;
    if (n < 0 || n >= i.length) return this;
    const [r] = i.splice(e, 1);
    return i.splice(n, 0, r), C(this, Y, Ce).call(this, { timeline: i });
  }
  removeEntry(e) {
    const n = [...this.activeSegment.timeline];
    return e < 0 || e >= n.length ? this : (n.splice(e, 1), C(this, Y, Ce).call(this, { timeline: n }));
  }
  updateEntry(e, n) {
    const i = this.activeSegment.timeline.map((r, a) => a !== e ? r : { ...foundry.utils.deepClone(r), ...n });
    return C(this, Y, Ce).call(this, { timeline: i });
  }
  // ── Tween mutations ──────────────────────────────────────────────────
  addTween(e, n = null) {
    const i = { type: "tile-prop", target: "", attribute: "alpha", value: 1 };
    return C(this, Y, bt).call(this, e, (r) => {
      const a = [...r.tweens ?? [], n ?? i];
      return { ...r, tweens: a };
    });
  }
  updateTween(e, n, i) {
    return C(this, Y, bt).call(this, e, (r) => {
      const a = (r.tweens ?? []).map((o, s) => s !== n ? o : { ...o, ...i });
      return { ...r, tweens: a };
    });
  }
  removeTween(e, n) {
    return C(this, Y, bt).call(this, e, (i) => {
      const r = (i.tweens ?? []).filter((a, o) => o !== n);
      return { ...i, tweens: r };
    });
  }
  updateStepDuration(e, n) {
    return C(this, Y, bt).call(this, e, (i) => ({ ...i, duration: Math.max(0, n) }));
  }
  // ── Parallel branch mutations ────────────────────────────────────────
  addBranch(e) {
    return C(this, Y, bt).call(this, e, (n) => {
      if (!n.parallel) return n;
      const i = [...n.parallel.branches, []];
      return { ...n, parallel: { ...n.parallel, branches: i } };
    });
  }
  removeBranch(e, n) {
    return C(this, Y, bt).call(this, e, (i) => {
      if (!i.parallel) return i;
      const r = i.parallel.branches.filter((a, o) => o !== n);
      return r.length < 1 ? i : { ...i, parallel: { ...i.parallel, branches: r } };
    });
  }
  addBranchEntry(e, n, i = null) {
    const r = { duration: 1e3, tweens: [] };
    return C(this, Y, bt).call(this, e, (a) => {
      if (!a.parallel) return a;
      const o = a.parallel.branches.map((s, l) => l !== n ? s : [...s, i ?? r]);
      return { ...a, parallel: { ...a.parallel, branches: o } };
    });
  }
  removeBranchEntry(e, n, i) {
    return C(this, Y, bt).call(this, e, (r) => {
      if (!r.parallel) return r;
      const a = r.parallel.branches.map((o, s) => s !== n ? o : o.filter((l, u) => u !== i));
      return { ...r, parallel: { ...r.parallel, branches: a } };
    });
  }
  updateBranchEntry(e, n, i, r) {
    return C(this, Y, bt).call(this, e, (a) => {
      if (!a.parallel) return a;
      const o = a.parallel.branches.map((s, l) => l !== n ? s : s.map((u, d) => d !== i ? u : { ...foundry.utils.deepClone(u), ...r }));
      return { ...a, parallel: { ...a.parallel, branches: o } };
    });
  }
  moveBranchEntry(e, n, i, r) {
    return i === r ? this : C(this, Y, bt).call(this, e, (a) => {
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
    const n = { ...foundry.utils.deepClone(m(this, le)), version: Cs };
    await e.setFlag(T, "cinematic", n);
  }
  /** Returns the active cinematic's data (for validation/export). */
  toJSON() {
    return foundry.utils.deepClone(m(this, Y, $e));
  }
  /** Returns the entire v4 flag structure. */
  toFullJSON() {
    return foundry.utils.deepClone(m(this, le));
  }
};
le = new WeakMap(), me = new WeakMap(), Ue = new WeakMap(), Ae = new WeakMap(), mt = new WeakSet(), dr = /* @__PURE__ */ c(function(e) {
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
          return C(d = se, mt, Fl).call(d, u);
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
        tweens: u.map(C(se, mt, dr))
      });
    } else if (o.length === 0) {
      const l = Math.max(500, ...s.map((h) => h.duration ?? 0)), { tweens: u, ...d } = a;
      n.push({
        ...d,
        duration: l,
        tweens: s.map(C(se, mt, dr))
      });
    } else {
      const l = Math.max(500, ...o.map((f) => f.duration ?? 0)), u = Math.max(500, ...s.map((f) => f.duration ?? 0)), { tweens: d, ...h } = a;
      n.push({
        parallel: {
          branches: [
            [{ ...h, duration: l, tweens: o.map(C(se, mt, dr)) }],
            [{ duration: u, tweens: s.map(C(se, mt, dr)) }]
          ],
          join: "all",
          overflow: "detach"
        }
      });
    }
  }
  return n;
}, "#migrateTimelineV5"), Ff = /* @__PURE__ */ c(function(e) {
  return foundry.utils.deepClone(e);
}, "#computeHash"), Y = new WeakSet(), $e = /* @__PURE__ */ c(function() {
  return m(this, le).cinematics[m(this, me)];
}, "#active"), // ── Internal ─────────────────────────────────────────────────────────
/** Clone the full state with a patch to the active cinematic (cinematic-level props). */
_a = /* @__PURE__ */ c(function(e) {
  const n = foundry.utils.deepClone(m(this, le));
  return Object.assign(n.cinematics[m(this, me)], e), new se(n, {
    loadedHash: m(this, Ae),
    cinematicName: m(this, me),
    segmentName: m(this, Ue)
  });
}, "#cloneActive"), /** Clone the full state with a patch to the active segment within the active cinematic. */
Ce = /* @__PURE__ */ c(function(e) {
  const n = foundry.utils.deepClone(m(this, le)), i = n.cinematics[m(this, me)].segments[m(this, Ue)];
  if (!i) return this;
  Object.assign(i, e);
  for (const [r, a] of Object.entries(i))
    a === void 0 && delete i[r];
  return new se(n, {
    loadedHash: m(this, Ae),
    cinematicName: m(this, me),
    segmentName: m(this, Ue)
  });
}, "#cloneActiveSegment"), /** Mutate a single timeline entry within the active segment. */
bt = /* @__PURE__ */ c(function(e, n) {
  const i = this.activeSegment;
  if (!i || e < 0 || e >= i.timeline.length) return this;
  const r = i.timeline.map((a, o) => o !== e ? a : n(foundry.utils.deepClone(a)));
  return C(this, Y, Ce).call(this, { timeline: r });
}, "#mutateEntry"), k(se, mt), c(se, "CinematicState");
let zt = se;
const gu = [
  { value: "tile-prop", label: "Tile Prop" },
  { value: "light-color", label: "Light Color" },
  { value: "light-state", label: "Light State" },
  { value: "particles-prop", label: "Particles Prop" },
  { value: "camera-pan", label: "Camera Pan" },
  { value: "token-prop", label: "Token Prop" },
  { value: "drawing-prop", label: "Drawing Prop" },
  { value: "sound-prop", label: "Sound Prop" }
], Df = {
  "tile-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y, width, height" },
  "token-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y" },
  "drawing-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y" },
  "sound-prop": { form: "prop", attribute: "volume", value: 0.5, placeholder: "volume, radius" },
  "particles-prop": { form: "particles", attribute: "alpha", value: 1, placeholder: "alpha, rate, speed, size" },
  "camera-pan": { form: "camera", x: 0, y: 0, scale: 1 },
  "light-color": { form: "lightColor", toColor: "#ffffff", toAlpha: "", mode: "oklch" },
  "light-state": { form: "lightState", enabled: !0 }
}, Ny = [
  { value: "canvasReady", label: "Canvas Ready" },
  { value: "manual", label: "Manual Only" }
];
function pu(t) {
  return t && (t.split("/").pop() || "").replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "-") || "";
}
c(pu, "soundIdFromPath");
function yu(t) {
  return t ? new Promise((e) => {
    const n = new Audio(t);
    n.addEventListener("loadedmetadata", () => {
      e(Math.round(n.duration * 1e3));
    }), n.addEventListener("error", () => e(0));
  }) : Promise.resolve(0);
}
c(yu, "loadAudioDurationMs");
const Fn = 40, pr = 24, Ar = 50, bu = 50, Jn = 60, ti = 10, Ts = 16, Pf = 40, Rf = 20, $y = 90, vu = 70, wu = 8;
function is(t) {
  return { stepDuration: Math.max(500, t.duration ?? 500), detachOverflow: 0 };
}
c(is, "computeStepDurations");
function xy(t) {
  var i;
  const e = ((i = t.parallel) == null ? void 0 : i.branches) ?? [];
  let n = 0;
  for (const r of e) {
    let a = 0;
    for (const o of r)
      o.delay != null ? a += o.delay : o.await != null || o.emit != null || (o.sound != null ? a += o.sound.fireAndForget ? 0 : o.sound.duration ?? 0 : o.stopSound != null || (a += is(o).stepDuration));
    n = Math.max(n, a);
  }
  return Math.max(500, n);
}
c(xy, "computeParallelDuration");
function vc(t) {
  return t.reduce((e, n) => n.delay != null ? e + n.delay : n.await != null || n.emit != null || n.transitionTo != null ? e : n.sound != null ? e + (n.sound.fireAndForget ? 0 : n.sound.duration ?? 0) : n.stopSound != null ? e : n.parallel != null ? e + xy(n) : e + is(n).stepDuration, 0);
}
c(vc, "computeTotalDuration");
function Fy(t, e) {
  if (t <= 0) return 0.1;
  const n = e / t;
  return Math.max(0.03, Math.min(0.5, n));
}
c(Fy, "computeScale");
function Hf(t) {
  const e = t.tweens ?? [];
  if (e.length === 0) return "Empty";
  const n = e[0], i = (n.target ?? "").replace(/^tag:/, "#"), r = n.attribute ?? "";
  return n.type === "camera-pan" ? "Pan" : r === "alpha" ? `Fade ${i}` : r === "x" || r === "y" ? `Move ${i}` : n.type === "light-color" ? `Light ${i}` : n.type === "sound-prop" ? `Sound ${i}` : i ? `${i}` : "Step";
}
c(Hf, "deriveStepLabel");
function Dy(t, e, n, i, r) {
  var u, d;
  const a = [], o = [], s = [];
  let l = e;
  for (let h = 0; h < t.length; h++) {
    const f = t[h], g = `${i}.${h}`, p = r === g;
    if (f.delay != null) {
      const y = Math.max(Rf, f.delay * n);
      a.push({ type: "delay", leftPx: l, widthPx: y, label: `${f.delay}ms`, entryPath: g, selected: p }), l += y;
    } else if (f.await != null) {
      const y = ((u = f.await) == null ? void 0 : u.event) ?? "click", b = y === "tile-click" ? "fa-hand-pointer" : y === "signal" ? "fa-bolt" : "fa-pause";
      a.push({ type: "await", leftPx: l, widthPx: Ts, label: y, entryPath: g, selected: p, isGate: !0, gateIcon: b }), ((d = f.await) == null ? void 0 : d.event) === "signal" && s.push({ signal: f.await.signal, centerPx: l + Ts / 2 }), l += Ts;
    } else if (f.emit != null)
      a.push({ type: "emit", leftPx: l, widthPx: ti, label: "emit", entryPath: g, selected: p, isMarker: !0 }), o.push({ signal: f.emit, centerPx: l + ti / 2 });
    else if (f.sound != null) {
      const y = (f.sound.src || "").split("/").pop() || "Sound", b = f.sound.duration ?? 0;
      if (f.sound.fireAndForget ?? !1)
        a.push({ type: "sound", leftPx: l, widthPx: ti, label: y, entryPath: g, selected: p, isMarker: !0 });
      else {
        const w = b > 0 ? Math.max(Jn, b * n) : Jn, E = (f.sound.loop ?? !1) && b <= 0;
        a.push({ type: "sound", leftPx: l, widthPx: w, label: y, entryPath: g, selected: p, hasTrailingArrow: E }), l += w;
      }
    } else if (f.stopSound != null)
      a.push({ type: "stopSound", leftPx: l, widthPx: ti, label: "Stop", entryPath: g, selected: p, isMarker: !0 });
    else {
      const { stepDuration: y } = is(f), b = Math.max(Pf, y * n), v = Hf(f);
      a.push({ type: "step", leftPx: l, widthPx: b, label: v, entryPath: g, selected: p }), l += b;
    }
  }
  return { blocks: a, width: l - e, emits: o, awaits: s };
}
c(Dy, "computeBranchLane");
function Eu(t) {
  return pr + t * Fn;
}
c(Eu, "laneIndexToY");
function Py(t, e) {
  const n = [];
  for (const i of t.emits)
    for (const r of t.awaits) {
      if (i.signal !== r.signal) continue;
      const a = i.centerPx, o = Eu(i.laneIndex) + Fn / 2, s = r.centerPx, l = Eu(r.laneIndex) + Fn / 2, u = l - o, d = (a + s) / 2, h = o + Math.sign(u || 1) * Math.min(40, Math.abs(u) * 0.5 + 20), f = l - Math.sign(u || 1) * Math.min(40, Math.abs(u) * 0.5 + 20);
      n.push({
        pathD: `M ${a} ${o} C ${d} ${h}, ${d} ${f}, ${s} ${l}`,
        signal: i.signal
      });
    }
  return n;
}
c(Py, "computeSignalArcs");
function Ry(t, e) {
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
c(Ry, "computeTimeMarkers");
function Hy(t) {
  const e = [];
  for (let n = 0; n < t.length - 1; n++) {
    const i = t[n], r = t[n + 1], a = i.leftPx + i.widthPx + (r.leftPx - (i.leftPx + i.widthPx)) / 2, o = pr + Fn / 2;
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
c(Hy, "computeInsertionPoints");
function qy(t, { selectedPath: e, windowWidth: n }) {
  const i = vc(t), r = n - 70 - 100, a = Fy(i, r), o = [], s = [], l = { emits: [], awaits: [] }, u = [];
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
    const E = t[w], L = `timeline.${w}`, A = e === L;
    if (E.delay != null) {
      const O = Math.max(Rf, E.delay * a);
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
        widthPx: ti,
        label: "Emit",
        entryPath: L,
        selected: A,
        isMarker: !0
      }), l.emits.push({
        signal: E.emit,
        centerPx: d + ti / 2,
        laneIndex: 0
      });
    else if (E.sound != null) {
      const O = (E.sound.src || "").split("/").pop() || "Sound", M = E.sound.duration ?? 0;
      if (E.sound.fireAndForget ?? !1) {
        const R = M > 0 ? Math.max(Jn, M * a) : Jn, D = (E.sound.loop ?? !1) && M <= 0, F = {
          type: "sound",
          leftPx: d,
          widthPx: R,
          label: O,
          entryPath: L,
          selected: A,
          hasTrailingArrow: D
        };
        let N = !1;
        for (const H of u)
          if (H.rightEdgePx <= d) {
            H.blocks.push(F), H.rightEdgePx = d + R, N = !0;
            break;
          }
        N || u.push({
          label: "♫ F&F",
          blocks: [F],
          rightEdgePx: d + R
        });
      } else {
        const R = M > 0 ? Math.max(Jn, M * a) : Jn, D = (E.sound.loop ?? !1) && M <= 0;
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
        widthPx: ti,
        label: "Stop",
        entryPath: L,
        selected: A,
        isMarker: !0
      });
    else if (E.parallel != null) {
      const O = E.parallel.branches ?? [], M = d, x = [];
      let R = 0;
      for (let F = 0; F < O.length; F++) {
        const N = `timeline.${w}.parallel.branches.${F}`, { blocks: H, width: B, emits: W, awaits: q } = Dy(O[F], M, a, N, e);
        x.push({ label: `Br ${F + 1}`, blocks: H }), R = Math.max(R, B);
        const U = s.length * 10 + F + 1;
        for (const K of W) l.emits.push({ ...K, laneIndex: U });
        for (const K of q) l.awaits.push({ ...K, laneIndex: U });
      }
      const D = Math.max(Jn, R);
      o.push({
        type: "parallel",
        leftPx: M,
        widthPx: D,
        label: `${O.length} br`,
        entryPath: L,
        selected: A
      }), s.push({ parallelEntryIndex: w, startPx: M, lanes: x }), d += D;
    } else {
      const { stepDuration: O } = is(E), M = Math.max(Pf, O * a), x = Hf(E);
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
    widthPx: bu,
    label: "Landing",
    entryPath: "landing",
    selected: e === "landing"
  }), d += bu;
  const h = s.flatMap((w) => w.lanes), f = h.length;
  for (const w of u)
    h.push({ label: w.label, blocks: w.blocks });
  const g = Py(l, h.length), p = [];
  for (let w = 0; w < u.length; w++) {
    const E = f + w;
    for (const L of u[w].blocks) {
      const A = L.leftPx, O = pr + Fn, M = pr + (1 + E) * Fn + Fn / 2;
      p.push({ x: A, y1: O, y2: M });
    }
  }
  const y = Ry(i, a), b = Hy(o), v = pr + (1 + h.length) * Fn;
  return {
    mainBlocks: o,
    subLanes: h,
    signalArcs: g,
    fafConnectors: p,
    timeMarkers: y,
    insertionPoints: b,
    totalWidthPx: Math.max(d, 200),
    swimlaneHeightPx: v,
    totalDurationMs: i
  };
}
c(qy, "computeLanes");
function jy(t) {
  if (t <= 0) return "0s";
  if (t < 1e3) return `${t}ms`;
  const e = t / 1e3;
  return e % 1 === 0 ? `${e}s` : `${e.toFixed(1)}s`;
}
c(jy, "formatDuration");
function By(t, e) {
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
  let u = wu;
  for (const v of o) {
    const w = n[v], E = vc(w.timeline ?? []), L = jy(E), A = v === i, O = v === e, M = !a.has(v), x = $y;
    l.push({
      name: v,
      durationMs: E,
      durationLabel: L,
      isEntry: A,
      isActive: O,
      isOrphan: M,
      leftPx: u,
      widthPx: x,
      hasGate: !!w.gate,
      gateEvent: ((g = w.gate) == null ? void 0 : g.event) ?? null
    }), u += x + vu;
  }
  const d = [], h = new Map(l.map((v) => [v.name, v]));
  for (const v of o) {
    const w = n[v];
    if (!w.next) continue;
    const E = typeof w.next == "string" ? w.next : (p = w.next) == null ? void 0 : p.segment;
    if (!E) continue;
    const L = h.get(v), A = h.get(E);
    if (!L || !A) continue;
    const O = n[E], M = ((y = O == null ? void 0 : O.gate) == null ? void 0 : y.event) ?? null, x = typeof w.next == "object" && ((b = w.next) == null ? void 0 : b.scene);
    d.push({
      fromName: v,
      toName: E,
      gateLabel: M,
      isCrossScene: x,
      fromRightPx: L.leftPx + L.widthPx,
      toLeftPx: A.leftPx
    });
  }
  const f = u - vu + wu;
  return { nodes: l, edges: d, totalWidthPx: f };
}
c(By, "computeSegmentGraph");
function jn(t) {
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
c(jn, "parseEntryPath");
function no(t, e) {
  var i, r, a, o;
  const n = jn(t);
  return n ? n.type === "setup" ? e.setup : n.type === "landing" ? e.landing : n.type === "timeline" ? e.timeline[n.index] : n.type === "branch" ? (o = (a = (r = (i = e.timeline[n.index]) == null ? void 0 : i.parallel) == null ? void 0 : r.branches) == null ? void 0 : a[n.branchIndex]) == null ? void 0 : o[n.branchEntryIndex] : null : null;
}
c(no, "getEntryAtPath");
function Su(t) {
  const e = jn(t);
  return !e || e.type !== "timeline" ? null : e.index;
}
c(Su, "getTimelineIndexFromPath");
function Uy(t) {
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
c(Uy, "countUniqueTargets");
function Vy(t, e) {
  var i, r, a;
  const n = jn(t);
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
c(Vy, "stepNumberForPath");
function Gy(t) {
  return {
    isSetup: !0,
    targetCount: Object.keys(t.setup ?? {}).length
  };
}
c(Gy, "buildSetupDetail");
function zy(t) {
  return {
    isLanding: !0,
    targetCount: Object.keys(t.landing ?? {}).length
  };
}
c(zy, "buildLandingDetail");
function Wy(t) {
  return { type: "delay", isDelay: !0, delay: t.delay };
}
c(Wy, "buildDelayDetail");
function Yy(t) {
  return { type: "emit", isEmit: !0, signal: t.emit };
}
c(Yy, "buildEmitDetail");
function Ky(t) {
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
c(Ky, "buildSoundDetail");
function Jy(t) {
  return {
    type: "stopSound",
    isStopSound: !0,
    stopSoundId: t.stopSound
  };
}
c(Jy, "buildStopSoundDetail");
function Xy(t, e) {
  var o;
  const n = t.parallel, i = n.join ?? "all", r = n.overflow ?? "detach", a = (n.branches ?? []).map((s, l) => ({
    branchIndex: l,
    label: `Branch ${l + 1}`,
    entries: (s ?? []).map((u, d) => {
      var E, L;
      const h = u.delay != null, f = u.await != null, g = u.emit != null, p = u.sound != null, y = u.stopSound != null, b = !h && !f && !g && !p && !y;
      let v, w;
      return h ? (v = `${u.delay}ms`, w = "delay") : f ? (v = "Await", w = ((E = u.await) == null ? void 0 : E.event) ?? "click") : g ? (v = "Emit", w = u.emit || "(unnamed)") : p ? (v = "Sound", w = (u.sound.src || "").split("/").pop() || "(none)") : y ? (v = "Stop Sound", w = u.stopSound || "(no id)") : (v = "Step", w = `${((L = u.tweens) == null ? void 0 : L.length) ?? 0} tweens`), { branchEntryIndex: d, isDelay: h, isAwait: f, isEmit: g, isSound: p, isStopSound: y, isStep: b, label: v, sub: w };
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
c(Xy, "buildParallelDetail");
function Qy(t, e, n, i) {
  const r = Xo(), a = (t.tweens ?? []).map((l, u) => {
    const d = `${e}.tweens.${u}`, h = n.has(d), f = l.type ?? "tile-prop", g = gu.find((v) => v.value === f), p = Df[f], y = (p == null ? void 0 : p.form) ?? "prop", b = l.mode ?? "oklch";
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
      colorMode: b,
      colorModeIsOklch: b === "oklch",
      colorModeIsHsl: b === "hsl",
      colorModeIsRgb: b === "rgb",
      // Light-state fields
      enabled: l.enabled ?? !0,
      typeOptions: gu.map((v) => ({
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
    stepNumber: Vy(e, i),
    stepDuration: t.duration ?? 1e3,
    tweens: a,
    beforeSummary: o.length ? `${o.length} target${o.length !== 1 ? "s" : ""}` : "(none)",
    afterSummary: s.length ? `${s.length} target${s.length !== 1 ? "s" : ""}` : "(none)"
  };
}
c(Qy, "buildStepDetail");
function Zy(t, { state: e, expandedTweens: n }) {
  const i = jn(t);
  if (!i) return null;
  if (i.type === "setup") return Gy(e);
  if (i.type === "landing") return zy(e);
  const r = no(t, e);
  return r ? r.delay != null ? Wy(r) : r.emit != null ? Yy(r) : r.sound != null ? Ky(r) : r.stopSound != null ? Jy(r) : r.parallel != null && i.type === "timeline" ? Xy(r) : Qy(r, t, n, e) : null;
}
c(Zy, "buildDetail");
function eb({ state: t, mutate: e }) {
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
              e(() => new zt(l));
            else if (l.segments !== void 0) {
              const u = { version: 4, cinematics: { [t.activeCinematicName]: l } };
              e(() => new zt(u, { cinematicName: t.activeCinematicName }));
            } else if (l.timeline !== void 0) {
              const u = { version: 3, cinematics: { [t.activeCinematicName]: l } };
              e(() => new zt(u, { cinematicName: t.activeCinematicName }));
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
c(eb, "showImportDialog");
function io(t, { state: e, mutate: n }) {
  const i = t === "setup" ? e.setup : e.landing, r = JSON.stringify(i ?? {}, null, 2);
  new Dialog({
    title: `Edit ${t.charAt(0).toUpperCase() + t.slice(1)}`,
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON map of target selector → property overrides:</p>
			<textarea id="cinematic-json-edit" style="width:100%;height:200px;font-family:monospace;font-size:0.8rem">${_t(r)}</textarea>
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
c(io, "showEditJsonDialog");
function Cu(t, { selectedPath: e, state: n, mutate: i }) {
  const r = no(e, n);
  if (!r || r.delay != null) return;
  const a = r[t] ?? {}, o = JSON.stringify(a, null, 2);
  new Dialog({
    title: `Edit Step ${t.charAt(0).toUpperCase() + t.slice(1)}`,
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON map of target selector → property overrides:</p>
			<textarea id="cinematic-json-edit" style="width:100%;height:200px;font-family:monospace;font-size:0.8rem">${_t(o)}</textarea>
		`,
    buttons: {
      save: {
        label: "Apply",
        callback: /* @__PURE__ */ c((s) => {
          var u, d;
          const l = s.find("#cinematic-json-edit").val();
          try {
            const h = JSON.parse(l), f = jn(e);
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
c(Cu, "showEditStepStateDialog");
function tb({ selectedPath: t, state: e, mutate: n }) {
  const i = jn(t);
  if (!i || i.type !== "timeline") return;
  const r = e.timeline[i.index];
  if (!(r != null && r.parallel)) return;
  const a = JSON.stringify(r.parallel.branches ?? [], null, 2);
  new Dialog({
    title: "Edit Parallel Branches",
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON array of branch timelines:</p>
			<textarea id="cinematic-json-edit" style="width:100%;height:250px;font-family:monospace;font-size:0.8rem">${_t(a)}</textarea>
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
c(tb, "showEditParallelJsonDialog");
var Wu, On, Rn, Na, qf;
const wt = class wt extends Vn(Un) {
  constructor(n = {}) {
    super(n);
    k(this, Rn);
    k(this, On, null);
    I(this, On, n.scene ?? canvas.scene ?? null);
  }
  async _prepareContext() {
    var r, a, o;
    const n = m(this, Rn, Na), i = ((a = n == null ? void 0 : n.getSeenStatus) == null ? void 0 : a.call(n, (r = m(this, On)) == null ? void 0 : r.id)) ?? [];
    return {
      sceneName: ((o = m(this, On)) == null ? void 0 : o.name) ?? "No scene",
      users: i.map((s) => ({
        ...s,
        statusLabel: s.seen ? "Seen" : "Not seen",
        statusClass: s.seen ? "cinematic-tracking__status--seen" : "cinematic-tracking__status--unseen"
      })),
      hasAnyTracked: i.some((s) => s.seen)
    };
  }
  _onRender(n, i) {
    super._onRender(n, i), C(this, Rn, qf).call(this);
  }
};
On = new WeakMap(), Rn = new WeakSet(), Na = /* @__PURE__ */ c(function() {
  var n, i;
  return (i = (n = game.modules.get(T)) == null ? void 0 : n.api) == null ? void 0 : i.cinematic;
}, "#api"), qf = /* @__PURE__ */ c(function() {
  var i, r;
  const n = this.element;
  n instanceof HTMLElement && (n.querySelectorAll("[data-action='reset-user']").forEach((a) => {
    a.addEventListener("click", async () => {
      var l;
      const o = a.dataset.userId;
      if (!o) return;
      const s = m(this, Rn, Na);
      s != null && s.resetForUser && (await s.resetForUser((l = m(this, On)) == null ? void 0 : l.id, o), this.render({ force: !0 }));
    });
  }), (i = n.querySelector("[data-action='reset-all']")) == null || i.addEventListener("click", async () => {
    var o;
    const a = m(this, Rn, Na);
    a != null && a.resetForAll && (await a.resetForAll((o = m(this, On)) == null ? void 0 : o.id), this.render({ force: !0 }));
  }), (r = n.querySelector("[data-action='refresh']")) == null || r.addEventListener("click", () => {
    this.render({ force: !0 });
  }));
}, "#bindEvents"), c(wt, "CinematicTrackingApplication"), pe(wt, "APP_ID", `${T}-cinematic-tracking`), pe(wt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Re(wt, wt, "DEFAULT_OPTIONS"),
  {
    id: wt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Wu = Re(wt, wt, "DEFAULT_OPTIONS")) == null ? void 0 : Wu.classes) ?? [], "eidolon-cinematic-tracking-window", "themed"])
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
)), pe(wt, "PARTS", {
  content: {
    template: `modules/${T}/templates/cinematic-tracking.html`
  }
});
let Dl = wt;
function nb(t, e) {
  var n, i, r, a, o, s, l, u, d;
  (n = t.querySelector("[data-action='save']")) == null || n.addEventListener("click", () => e.save()), (i = t.querySelector("[data-action='play-preview']")) == null || i.addEventListener("click", () => e.play()), (r = t.querySelector("[data-action='reset-tracking']")) == null || r.addEventListener("click", () => e.resetTracking()), (a = t.querySelector("[data-action='export-json']")) == null || a.addEventListener("click", () => e.exportJSON()), (o = t.querySelector("[data-action='undo']")) == null || o.addEventListener("click", () => e.undo()), (s = t.querySelector("[data-action='redo']")) == null || s.addEventListener("click", () => e.redo()), (l = t.querySelector("[data-action='validate']")) == null || l.addEventListener("click", () => e.validate()), (u = t.querySelector("[data-action='import-json']")) == null || u.addEventListener("click", () => e.importJSON()), (d = t.querySelector("[data-action='open-tracking']")) == null || d.addEventListener("click", () => {
    new Dl({ scene: e.scene }).render(!0);
  });
}
c(nb, "bindToolbarEvents");
function ib(t, e) {
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
      content: `<label style="display:flex;align-items:center;gap:0.5rem"><span>Name:</span><input id="cinematic-rename" type="text" style="flex:1" value="${_t(o)}" /></label>`,
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
c(ib, "bindCinematicSelectorEvents");
function rb(t, e) {
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
        const s = Su(n), l = Su(o);
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
c(rb, "bindSwimlaneEvents");
function ab(t, e) {
  var n, i, r, a, o, s, l, u, d, h, f;
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
    io("setup", { state: e.state, mutate: e.mutate });
  }), (s = t.querySelector("[data-action='edit-landing']")) == null || s.addEventListener("click", () => {
    io("landing", { state: e.state, mutate: e.mutate });
  }), (l = t.querySelector("[data-action='edit-before']")) == null || l.addEventListener("click", () => {
    Cu("before", { selectedPath: e.selectedPath, state: e.state, mutate: e.mutate });
  }), (u = t.querySelector("[data-action='edit-after']")) == null || u.addEventListener("click", () => {
    Cu("after", { selectedPath: e.selectedPath, state: e.state, mutate: e.mutate });
  }), (d = t.querySelector("[data-action='change-trigger']")) == null || d.addEventListener("change", (g) => {
    e.mutate((p) => p.setTrigger(g.target.value));
  }), (h = t.querySelector("[data-action='change-tracking']")) == null || h.addEventListener("change", (g) => {
    e.mutate((p) => p.setTracking(g.target.checked));
  }), (f = t.querySelector("[data-action='change-synchronized']")) == null || f.addEventListener("change", (g) => {
    e.mutate((p) => p.setSynchronized(g.target.checked));
  });
}
c(ab, "bindDetailPanelEvents");
const Ki = /* @__PURE__ */ new WeakMap(), ro = /* @__PURE__ */ new Set(), ao = /* @__PURE__ */ new Set(), Tu = {
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
function oo(t, e = {}) {
  var p, y, b;
  if (!t) return !1;
  Ji(t);
  const n = e.mode ?? (e.color != null ? "custom" : "hover"), i = Tu[n] ?? Tu.hover, r = e.color ?? i.borderColor, a = e.alpha ?? i.borderAlpha, o = e.color ?? i.spriteTint, s = i.spriteAlpha, l = e.pulse ?? i.pulse, u = { border: null, sprite: null, pulseData: null, mode: n }, d = ((p = t.document) == null ? void 0 : p.width) ?? t.w ?? 100, h = ((y = t.document) == null ? void 0 : y.height) ?? t.h ?? 100, f = new PIXI.Graphics();
  f.lineStyle(i.borderWidth, r, a), f.drawRect(0, 0, d, h), t.addChild(f), u.border = f;
  const g = ob(t, o, s);
  if (g && (canvas.controls.debug.addChild(g), ao.add(g), u.sprite = g), l && ((b = canvas.app) != null && b.ticker)) {
    const v = {
      elapsed: 0,
      fn: /* @__PURE__ */ c((w) => {
        v.elapsed += w;
        const E = (Math.sin(v.elapsed * 0.05) + 1) / 2;
        u.border && (u.border.alpha = a * (0.4 + 0.6 * E)), u.sprite && (u.sprite.alpha = s * (0.5 + 0.5 * E));
      }, "fn")
    };
    canvas.app.ticker.add(v.fn), u.pulseData = v, ro.add(v);
  }
  return Ki.set(t, u), !0;
}
c(oo, "addHighlight");
function Ji(t) {
  var n, i;
  if (!t) return;
  const e = Ki.get(t);
  e && (e.pulseData && ((i = (n = canvas.app) == null ? void 0 : n.ticker) == null || i.remove(e.pulseData.fn), ro.delete(e.pulseData)), e.border && (e.border.parent && e.border.parent.removeChild(e.border), e.border.destroy({ children: !0 })), e.sprite && (e.sprite.parent && e.sprite.parent.removeChild(e.sprite), e.sprite.destroy({ children: !0 }), ao.delete(e.sprite)), Ki.delete(t));
}
c(Ji, "removeHighlight");
function jf(t) {
  return Ki.has(t);
}
c(jf, "hasHighlight");
function $a() {
  var e, n, i, r, a, o, s;
  for (const l of ro)
    (n = (e = canvas.app) == null ? void 0 : e.ticker) == null || n.remove(l.fn);
  ro.clear();
  for (const l of ao)
    l.parent && l.parent.removeChild(l), l.destroy({ children: !0 });
  ao.clear();
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
        const d = Ki.get(u);
        d && (d.border && (d.border.parent && d.border.parent.removeChild(d.border), d.border.destroy({ children: !0 })), Ki.delete(u));
      }
}
c($a, "clearAllHighlights");
function ob(t, e, n) {
  var a;
  const i = t.mesh;
  if (!((a = i == null ? void 0 : i.texture) != null && a.baseTexture)) return null;
  const r = PIXI.Sprite.from(i.texture);
  return r.isSprite = !0, r.anchor.set(i.anchor.x, i.anchor.y), r.width = i.width, r.height = i.height, r.scale = i.scale, r.position = t.center, r.angle = i.angle, r.alpha = n, r.tint = e, r.name = "eidolonPickerHighlight", r;
}
c(ob, "createTintSprite");
let Xn = null;
function Bf(t) {
  var p, y, b;
  Xn && Xn.cancel();
  const { placeableType: e = "Tile", onPick: n, onCancel: i } = t;
  let r = null;
  const a = `control${e}`, o = `hover${e}`, s = /* @__PURE__ */ c((v, w) => {
    var L;
    if (!w) return;
    const E = v.document ?? v;
    (L = v.release) == null || L.call(v), n(E);
  }, "onControl"), l = /* @__PURE__ */ c((v, w) => {
    w ? (r = v, oo(v, { mode: "pick" })) : r === v && (Ji(v), r = null);
  }, "onHoverIn"), u = /* @__PURE__ */ c((v) => {
    v.key === "Escape" && (v.preventDefault(), v.stopPropagation(), g());
  }, "onKeydown"), d = /* @__PURE__ */ c((v) => {
    v.preventDefault(), g();
  }, "onContextMenu"), h = Hooks.on(a, s), f = Hooks.on(o, l);
  document.addEventListener("keydown", u, { capture: !0 }), (p = canvas.stage) == null || p.addEventListener("rightclick", d), (b = (y = ui.notifications) == null ? void 0 : y.info) == null || b.call(y, `Pick mode active — click a ${e.toLowerCase()} on the canvas, or press ESC to cancel.`, { permanent: !1 });
  function g() {
    var v;
    Xn && (Xn = null, Hooks.off(a, h), Hooks.off(o, f), document.removeEventListener("keydown", u, { capture: !0 }), (v = canvas.stage) == null || v.removeEventListener("rightclick", d), r && (Ji(r), r = null), i == null || i());
  }
  return c(g, "cancel"), Xn = { cancel: g }, { cancel: g };
}
c(Bf, "enterPickMode");
function fr() {
  Xn && Xn.cancel();
}
c(fr, "cancelPickMode");
const sb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cancelPickMode: fr,
  enterPickMode: Bf
}, Symbol.toStringTag, { value: "Module" }));
var Yu, ke, Ve, Wr, An, Yr, Kr, Ze, kn, fe, Uf, Pl, Vf, Gf, zf, Rl, Hl, Wf, Yf;
const ct = class ct extends Vn(Un) {
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
    k(this, ke, []);
    /** @type {boolean} Whether pick mode is active. */
    k(this, Ve, !1);
    /** @type {string} Placeable type (Tile, Token, etc.). */
    k(this, Wr, "Tile");
    /** @type {string} Current tag match mode. */
    k(this, An, "any");
    /** @type {((selectors: string[]) => void) | null} */
    k(this, Yr, null);
    /** @type {(() => void) | null} */
    k(this, Kr, null);
    /** @type {Promise resolve function for the open() API. */
    k(this, Ze, null);
    /** @type {PlaceableObject | null} Currently hovered tile in the browser. */
    k(this, kn, null);
    I(this, ke, [...n.selections ?? []]), I(this, Wr, n.placeableType ?? "Tile"), I(this, Yr, n.onApply ?? null), I(this, Kr, n.onCancel ?? null);
  }
  // ── Context ───────────────────────────────────────────────────────────
  async _prepareContext() {
    var r;
    const n = C(this, fe, Rl).call(this), i = (((r = canvas.tiles) == null ? void 0 : r.placeables) ?? []).map((a, o) => {
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
      selections: m(this, ke),
      selectionCount: m(this, ke).length,
      pickModeActive: m(this, Ve),
      tagModeIsAny: m(this, An) === "any",
      tagModeIsAll: m(this, An) === "all",
      tagPreviewCount: 0,
      tiles: i,
      tileCount: i.length
    };
  }
  // ── Render & Events ───────────────────────────────────────────────────
  _onRender(n, i) {
    super._onRender(n, i), C(this, fe, Uf).call(this), C(this, fe, Hl).call(this);
  }
  async _onClose(n) {
    return m(this, Ve) && (fr(), I(this, Ve, !1)), $a(), m(this, Ze) && (m(this, Ze).call(this, null), I(this, Ze, null)), super._onClose(n);
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
      const r = new ct({
        ...n,
        onApply: /* @__PURE__ */ c((a) => i(a), "onApply"),
        onCancel: /* @__PURE__ */ c(() => i(null), "onCancel")
      });
      I(r, Ze, i), r.render(!0);
    });
  }
};
ke = new WeakMap(), Ve = new WeakMap(), Wr = new WeakMap(), An = new WeakMap(), Yr = new WeakMap(), Kr = new WeakMap(), Ze = new WeakMap(), kn = new WeakMap(), fe = new WeakSet(), Uf = /* @__PURE__ */ c(function() {
  var a, o, s, l;
  const n = this.element;
  if (!(n instanceof HTMLElement)) return;
  const i = n.querySelector("[data-role='tag-input']"), r = n.querySelector("[data-role='tag-mode']");
  r == null || r.addEventListener("change", (u) => {
    I(this, An, u.target.value);
  }), i == null || i.addEventListener("input", () => {
    C(this, fe, Vf).call(this, n);
  }), i == null || i.addEventListener("keydown", (u) => {
    u.key === "Enter" && (u.preventDefault(), C(this, fe, Pl).call(this, n));
  }), (a = n.querySelector("[data-action='add-tag-selector']")) == null || a.addEventListener("click", () => {
    C(this, fe, Pl).call(this, n);
  }), (o = n.querySelector("[data-action='toggle-pick-mode']")) == null || o.addEventListener("click", () => {
    m(this, Ve) ? (fr(), I(this, Ve, !1)) : (I(this, Ve, !0), Bf({
      placeableType: m(this, Wr),
      onPick: /* @__PURE__ */ c((u) => {
        C(this, fe, Gf).call(this, u.id);
      }, "onPick"),
      onCancel: /* @__PURE__ */ c(() => {
        I(this, Ve, !1), this.render({ force: !0 });
      }, "onCancel")
    })), this.render({ force: !0 });
  }), n.querySelectorAll("[data-action='toggle-tile']").forEach((u) => {
    u.addEventListener("click", () => {
      const d = u.dataset.docId;
      d && C(this, fe, zf).call(this, d);
    }), u.addEventListener("mouseenter", () => {
      var f, g;
      const d = u.dataset.docId;
      if (!d) return;
      const h = (g = (f = canvas.tiles) == null ? void 0 : f.placeables) == null ? void 0 : g.find((p) => p.document.id === d);
      h && (I(this, kn, h), oo(h, { mode: "hover" }));
    }), u.addEventListener("mouseleave", () => {
      m(this, kn) && (Ji(m(this, kn)), I(this, kn, null), C(this, fe, Hl).call(this));
    });
  }), n.querySelectorAll("[data-action='remove-selection']").forEach((u) => {
    u.addEventListener("click", () => {
      const d = Number(u.dataset.selectionIndex);
      Number.isNaN(d) || (m(this, ke).splice(d, 1), this.render({ force: !0 }));
    });
  }), (s = n.querySelector("[data-action='apply']")) == null || s.addEventListener("click", () => {
    C(this, fe, Wf).call(this);
  }), (l = n.querySelector("[data-action='cancel']")) == null || l.addEventListener("click", () => {
    C(this, fe, Yf).call(this);
  });
}, "#bindEvents"), // ── Tag helpers ───────────────────────────────────────────────────────
Pl = /* @__PURE__ */ c(function(n) {
  var s;
  const i = n.querySelector("[data-role='tag-input']"), r = (s = i == null ? void 0 : i.value) == null ? void 0 : s.trim();
  if (!r) return;
  const a = r.split(",").map((l) => l.trim()).filter(Boolean);
  if (a.length === 0) return;
  const o = Mf(a, m(this, An));
  o && !m(this, ke).includes(o) && m(this, ke).push(o), i && (i.value = ""), this.render({ force: !0 });
}, "#addTagSelector"), Vf = /* @__PURE__ */ c(function(n) {
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
  const l = m(this, An) === "any", u = s.getByTag(o, {
    sceneId: (f = canvas.scene) == null ? void 0 : f.id,
    matchAny: l
  }), d = (u == null ? void 0 : u.length) ?? 0;
  r.textContent = `${d} matching placeable(s)`;
}, "#updateTagPreview"), // ── ID selector helpers ──────────────────────────────────────────────
Gf = /* @__PURE__ */ c(function(n) {
  const i = `id:${n}`;
  m(this, ke).includes(i) || (m(this, ke).push(i), this.render({ force: !0 }));
}, "#addIdSelector"), zf = /* @__PURE__ */ c(function(n) {
  const i = `id:${n}`, r = m(this, ke).indexOf(i);
  r >= 0 ? m(this, ke).splice(r, 1) : m(this, ke).push(i), this.render({ force: !0 });
}, "#toggleIdSelector"), /**
 * Get the set of document IDs that are currently selected across all selector types.
 * Resolves tag/tags-any/tags-all selectors to find matching document IDs.
 * @returns {Set<string>}
 */
Rl = /* @__PURE__ */ c(function() {
  const n = /* @__PURE__ */ new Set();
  for (const i of m(this, ke)) {
    const r = bc(i);
    if (r.type === "id") {
      n.add(r.value);
      continue;
    }
    const a = ns(i);
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
  const n = C(this, fe, Rl).call(this), i = ((r = canvas.tiles) == null ? void 0 : r.placeables) ?? [];
  for (const o of i) {
    const s = (a = o.document) == null ? void 0 : a.id;
    if (!s) continue;
    const l = n.has(s), u = o === m(this, kn), d = jf(o);
    l && !u && !d ? oo(o, { mode: "selected" }) : !l && d && !u && Ji(o);
  }
}, "#refreshSelectionHighlights"), // ── Apply / Cancel ──────────────────────────────────────────────────
Wf = /* @__PURE__ */ c(function() {
  var i;
  m(this, Ve) && (fr(), I(this, Ve, !1)), $a();
  const n = [...m(this, ke)];
  (i = m(this, Yr)) == null || i.call(this, n), m(this, Ze) && (m(this, Ze).call(this, n), I(this, Ze, null)), this.close({ force: !0 });
}, "#doApply"), Yf = /* @__PURE__ */ c(function() {
  var n;
  m(this, Ve) && (fr(), I(this, Ve, !1)), $a(), (n = m(this, Kr)) == null || n.call(this), m(this, Ze) && (m(this, Ze).call(this, null), I(this, Ze, null)), this.close({ force: !0 });
}, "#doCancel"), c(ct, "PlaceablePickerApplication"), pe(ct, "APP_ID", `${T}-placeable-picker`), pe(ct, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Re(ct, ct, "DEFAULT_OPTIONS"),
  {
    id: ct.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Yu = Re(ct, ct, "DEFAULT_OPTIONS")) == null ? void 0 : Yu.classes) ?? [], "eidolon-placeable-picker-window", "themed"])
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
)), pe(ct, "PARTS", {
  content: {
    template: `modules/${T}/templates/placeable-picker.html`
  }
});
let so = ct;
function lb(t, e) {
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
      const a = e.getEntryAtPath(e.selectedPath), o = ((d = (u = a == null ? void 0 : a.tweens) == null ? void 0 : u[i]) == null ? void 0 : d.target) ?? "", s = o ? [o] : [], l = await so.open({ selections: s });
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
          const l = Df[s], u = { type: s };
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
c(lb, "bindTweenFieldEvents");
function cb(t, e) {
  var i, r, a, o, s, l, u, d, h, f;
  function n(g, p, y) {
    g.type === "timeline" ? e.mutate((b) => b.updateEntry(g.index, { sound: y })) : g.type === "branch" && e.mutate((b) => b.updateBranchEntry(g.index, g.branchIndex, g.branchEntryIndex, { sound: y }));
  }
  c(n, "applySoundPatch"), (i = t.querySelector("[data-action='change-sound-src']")) == null || i.addEventListener("change", async (g) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = e.getEntryAtPath(e.selectedPath);
    if (!(y != null && y.sound)) return;
    const b = g.target.value, v = { ...y.sound, src: b };
    v.id || (v.id = pu(b));
    const w = await yu(b);
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
        v.id || (v.id = pu(b));
        const w = await yu(b);
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
c(cb, "bindSoundFieldEvents");
function ub(t, e) {
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
    tb({ selectedPath: e.selectedPath, state: e.state, mutate: e.mutate });
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
c(ub, "bindSpecialEntryEvents");
function db(t, e) {
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
c(db, "bindSegmentGraphEvents");
function fb(t, e) {
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
    const { enterPickMode: d } = await Promise.resolve().then(() => sb);
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
    (a = t.querySelector(`[data-action='${u}']`)) == null || a.addEventListener("change", (h) => {
      var v;
      const f = (v = e.state.activeSegment) == null ? void 0 : v.gate;
      if (!f) return;
      const g = h.target.value.trim(), p = g ? g.split(",").map((w) => w.trim()).filter(Boolean) : void 0, y = { ...f.animation ?? {} };
      p != null && p.length ? y[d] = p.length === 1 ? p[0] : p : delete y[d];
      const b = { ...f, animation: Object.keys(y).length ? y : void 0 };
      b.animation || delete b.animation, e.setSegmentGate(b);
    });
  (o = t.querySelector("[data-action='change-segment-next']")) == null || o.addEventListener("change", (u) => {
    const d = u.target.value;
    e.setSegmentNext(d || null);
  }), (s = t.querySelector("[data-action='edit-segment-setup']")) == null || s.addEventListener("click", () => {
    io("setup", { state: e.state, mutate: e.mutate });
  }), (l = t.querySelector("[data-action='edit-segment-landing']")) == null || l.addEventListener("click", () => {
    io("landing", { state: e.state, mutate: e.mutate });
  });
}
c(fb, "bindSegmentDetailEvents");
var Ku, Ge, z, et, Mn, Lt, tt, ze, Ho, xe, nt, qo, cn, zi, ft, fi, _n, mi, j, Kf, Jf, Xf, Qf, vn, jl, Bl, Ul, Vl, Zf, wn, Gl, em, tm, nm, im, rm, zl, mr;
const Et = class Et extends Vn(Un) {
  constructor(n = {}) {
    super(n);
    k(this, j);
    k(this, Ge, null);
    k(this, z, null);
    k(this, et, null);
    k(this, Mn, /* @__PURE__ */ new Set());
    k(this, Lt, !1);
    k(this, tt, null);
    k(this, ze, null);
    k(this, Ho, 120);
    k(this, xe, []);
    k(this, nt, -1);
    k(this, qo, 50);
    k(this, cn, null);
    k(this, zi, null);
    k(this, ft, null);
    k(this, fi, null);
    k(this, _n, null);
    k(this, mi, null);
    I(this, Ge, n.scene ?? canvas.scene ?? null), I(this, z, zt.fromScene(m(this, Ge)));
  }
  // ── Context ───────────────────────────────────────────────────────────
  async _prepareContext() {
    var g, p;
    const n = By(m(this, z), m(this, z).activeSegmentName), i = qy(m(this, z).timeline, {
      selectedPath: m(this, et),
      windowWidth: ((g = this.position) == null ? void 0 : g.width) ?? 1100
    }), r = m(this, et) != null ? Zy(m(this, et), { state: m(this, z), expandedTweens: m(this, Mn) }) : null, a = m(this, z).listCinematicNames(), o = m(this, z).activeCinematicName, l = m(this, z).listSegmentNames().length > 1, u = m(this, z).activeSegment, d = (u == null ? void 0 : u.gate) ?? null, h = (u == null ? void 0 : u.next) ?? null, f = typeof h == "string" ? h : (h == null ? void 0 : h.segment) ?? null;
    return {
      // Toolbar
      sceneName: ((p = m(this, Ge)) == null ? void 0 : p.name) ?? "No scene",
      dirty: m(this, Lt),
      canUndo: m(this, j, jl),
      canRedo: m(this, j, Bl),
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
      triggerOptions: Ny.map((y) => ({
        ...y,
        selected: y.value === m(this, z).trigger
      })),
      entryCount: m(this, z).timeline.length,
      totalDuration: i.totalDurationMs,
      targetCount: Uy(m(this, z)),
      setupCount: Object.keys(m(this, z).setup ?? {}).length,
      landingCount: Object.keys(m(this, z).landing ?? {}).length
    };
  }
  // ── Render & Events ───────────────────────────────────────────────────
  _onRender(n, i) {
    var r, a, o;
    if (super._onRender(n, i), C(this, j, Kf).call(this), !m(this, fi)) {
      const s = (a = (r = game.modules.get(T)) == null ? void 0 : r.api) == null ? void 0 : a.cinematic;
      s != null && s.onPlaybackProgress ? (I(this, fi, s.onPlaybackProgress((l) => C(this, j, rm).call(this, l))), console.log("[cinematic-editor] Subscribed to playback progress events")) : console.warn("[cinematic-editor] onPlaybackProgress not available on API", s);
    }
    if (m(this, mi) && ((o = this.element) == null || o.querySelectorAll(".cinematic-editor__segment-node").forEach((s) => {
      s.classList.toggle("cinematic-editor__segment-node--playing", s.dataset.segmentName === m(this, mi));
    }), m(this, ft) && m(this, ft).segmentName === m(this, z).activeSegmentName)) {
      const s = performance.now() - m(this, ft).startTime;
      m(this, ft).durationMs - s > 0 && C(this, j, zl).call(this, m(this, ft).durationMs, m(this, ft).startTime);
    }
    m(this, cn) || (I(this, cn, (s) => {
      !s.ctrlKey && !s.metaKey || (s.key === "z" && !s.shiftKey ? (s.preventDefault(), C(this, j, Ul).call(this)) : (s.key === "z" && s.shiftKey || s.key === "y") && (s.preventDefault(), C(this, j, Vl).call(this)));
    }), document.addEventListener("keydown", m(this, cn)));
  }
  async close(n = {}) {
    if (m(this, ze) && C(this, j, wn).call(this), m(this, Lt) && !n.force) {
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
      i === "save" && await C(this, j, Gl).call(this);
    }
    return super.close(n);
  }
  async _onClose(n) {
    var i;
    return m(this, tt) !== null && (clearTimeout(m(this, tt)), I(this, tt, null)), m(this, cn) && (document.removeEventListener("keydown", m(this, cn)), I(this, cn, null)), (i = m(this, fi)) == null || i.call(this), I(this, fi, null), C(this, j, mr).call(this), super._onClose(n);
  }
};
Ge = new WeakMap(), z = new WeakMap(), et = new WeakMap(), Mn = new WeakMap(), Lt = new WeakMap(), tt = new WeakMap(), ze = new WeakMap(), Ho = new WeakMap(), xe = new WeakMap(), nt = new WeakMap(), qo = new WeakMap(), cn = new WeakMap(), zi = new WeakMap(), ft = new WeakMap(), fi = new WeakMap(), _n = new WeakMap(), mi = new WeakMap(), j = new WeakSet(), // ── Event binding ─────────────────────────────────────────────────────
Kf = /* @__PURE__ */ c(function() {
  const n = this.element;
  if (!(n instanceof HTMLElement)) return;
  const i = C(this, j, Jf).call(this);
  nb(n, i), ib(n, i), db(n, i), rb(n, i), ab(n, i), lb(n, i), cb(n, i), ub(n, i), fb(n, i);
}, "#bindEvents"), Jf = /* @__PURE__ */ c(function() {
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
      return m(n, Mn);
    },
    get insertMenuState() {
      return m(n, zi);
    },
    // Mutations
    mutate: /* @__PURE__ */ c((i) => C(this, j, vn).call(this, i), "mutate"),
    setSelectedPath: /* @__PURE__ */ c((i) => {
      I(this, et, i), this.render({ force: !0 });
    }, "setSelectedPath"),
    render: /* @__PURE__ */ c(() => this.render({ force: !0 }), "render"),
    // Cinematic switching (needs full state swap + clear)
    switchCinematic: /* @__PURE__ */ c((i) => {
      m(this, ze) && C(this, j, wn).call(this), I(this, z, m(this, z).switchCinematic(i)), I(this, et, null), m(this, Mn).clear(), this.render({ force: !0 });
    }, "switchCinematic"),
    // Segment management
    selectSegment: /* @__PURE__ */ c((i) => {
      m(this, ze) && C(this, j, wn).call(this), I(this, z, m(this, z).switchSegment(i)), I(this, et, null), m(this, Mn).clear(), this.render({ force: !0 });
    }, "selectSegment"),
    addSegment: /* @__PURE__ */ c((i) => {
      C(this, j, vn).call(this, (r) => r.addSegment(i, r.activeSegmentName));
    }, "addSegment"),
    removeSegment: /* @__PURE__ */ c((i) => {
      C(this, j, vn).call(this, (r) => r.removeSegment(i));
    }, "removeSegment"),
    renameSegment: /* @__PURE__ */ c((i, r) => {
      C(this, j, vn).call(this, (a) => a.renameSegment(i, r));
    }, "renameSegment"),
    setSegmentGate: /* @__PURE__ */ c((i) => {
      C(this, j, vn).call(this, (r) => r.setSegmentGate(i));
    }, "setSegmentGate"),
    setSegmentNext: /* @__PURE__ */ c((i) => {
      C(this, j, vn).call(this, (r) => r.setSegmentNext(i));
    }, "setSegmentNext"),
    // Tween debouncing
    queueTweenChange: /* @__PURE__ */ c((i, r) => C(this, j, Zf).call(this, i, r), "queueTweenChange"),
    flushTweenChanges: /* @__PURE__ */ c(() => {
      m(this, ze) && C(this, j, wn).call(this);
    }, "flushTweenChanges"),
    flushTweenChangesImmediate: /* @__PURE__ */ c(() => {
      m(this, tt) !== null && clearTimeout(m(this, tt)), I(this, tt, null), C(this, j, wn).call(this);
    }, "flushTweenChangesImmediate"),
    // Path utilities
    parseEntryPath: jn,
    getEntryAtPath: /* @__PURE__ */ c((i) => no(i, m(this, z)), "getEntryAtPath"),
    // Insert menu
    showInsertMenu: /* @__PURE__ */ c((i, r, a) => C(this, j, Xf).call(this, i, r, a), "showInsertMenu"),
    hideInsertMenu: /* @__PURE__ */ c(() => C(this, j, Qf).call(this), "hideInsertMenu"),
    // Toolbar actions
    save: /* @__PURE__ */ c(() => C(this, j, Gl).call(this), "save"),
    play: /* @__PURE__ */ c(() => C(this, j, em).call(this), "play"),
    resetTracking: /* @__PURE__ */ c(() => C(this, j, tm).call(this), "resetTracking"),
    exportJSON: /* @__PURE__ */ c(() => C(this, j, nm).call(this), "exportJSON"),
    validate: /* @__PURE__ */ c(() => C(this, j, im).call(this), "validate"),
    importJSON: /* @__PURE__ */ c(() => eb({ state: m(this, z), mutate: /* @__PURE__ */ c((i) => C(this, j, vn).call(this, i), "mutate") }), "importJSON"),
    undo: /* @__PURE__ */ c(() => C(this, j, Ul).call(this), "undo"),
    redo: /* @__PURE__ */ c(() => C(this, j, Vl).call(this), "redo")
  };
}, "#createEventContext"), // ── Insert menu ───────────────────────────────────────────────────────
Xf = /* @__PURE__ */ c(function(n, i, r) {
  var l;
  const a = (l = this.element) == null ? void 0 : l.querySelector(".cinematic-editor__insert-menu");
  if (!a) return;
  const o = n.getBoundingClientRect();
  document.body.appendChild(a), a.style.display = "", a.style.position = "fixed", a.style.left = `${o.left}px`;
  const s = a.offsetHeight || 200;
  o.bottom + 4 + s > window.innerHeight ? a.style.top = `${o.top - s - 4}px` : a.style.top = `${o.bottom + 4}px`, I(this, zi, { insertIndex: i, lane: r });
}, "#showInsertMenu"), Qf = /* @__PURE__ */ c(function() {
  var i, r;
  const n = document.body.querySelector(".cinematic-editor__insert-menu") ?? ((i = this.element) == null ? void 0 : i.querySelector(".cinematic-editor__insert-menu"));
  if (n) {
    n.style.display = "none";
    const a = (r = this.element) == null ? void 0 : r.querySelector(".cinematic-editor");
    a && n.parentNode !== a && a.appendChild(n);
  }
  I(this, zi, null);
}, "#hideInsertMenu"), // ── State mutation ────────────────────────────────────────────────────
vn = /* @__PURE__ */ c(function(n) {
  I(this, xe, m(this, xe).slice(0, m(this, nt) + 1)), m(this, xe).push(m(this, z)), m(this, xe).length > m(this, qo) && m(this, xe).shift(), I(this, nt, m(this, xe).length - 1), I(this, z, n(m(this, z))), I(this, Lt, !0), this.render({ force: !0 });
}, "#mutate"), jl = /* @__PURE__ */ c(function() {
  return m(this, nt) >= 0;
}, "#canUndo"), Bl = /* @__PURE__ */ c(function() {
  return m(this, nt) < m(this, xe).length - 1;
}, "#canRedo"), Ul = /* @__PURE__ */ c(function() {
  m(this, j, jl) && (m(this, nt) === m(this, xe).length - 1 && m(this, xe).push(m(this, z)), I(this, z, m(this, xe)[m(this, nt)]), ss(this, nt)._--, I(this, Lt, !0), this.render({ force: !0 }));
}, "#undo"), Vl = /* @__PURE__ */ c(function() {
  m(this, j, Bl) && (ss(this, nt)._++, I(this, z, m(this, xe)[m(this, nt) + 1]), I(this, Lt, !0), this.render({ force: !0 }));
}, "#redo"), Zf = /* @__PURE__ */ c(function(n, i) {
  var r;
  m(this, et) != null && (I(this, ze, {
    ...m(this, ze) ?? {},
    entryPath: m(this, et),
    tweenIndex: n,
    patch: { ...((r = m(this, ze)) == null ? void 0 : r.patch) ?? {}, ...i }
  }), m(this, tt) !== null && clearTimeout(m(this, tt)), I(this, tt, setTimeout(() => {
    I(this, tt, null), C(this, j, wn).call(this);
  }, m(this, Ho))));
}, "#queueTweenChange"), wn = /* @__PURE__ */ c(function() {
  if (!m(this, ze)) return;
  const { entryPath: n, tweenIndex: i, patch: r } = m(this, ze);
  I(this, ze, null);
  const a = jn(n);
  if (a) {
    if (a.type === "timeline")
      I(this, z, m(this, z).updateTween(a.index, i, r));
    else if (a.type === "branch") {
      const o = no(n, m(this, z));
      if (o) {
        const s = (o.tweens ?? []).map((l, u) => u === i ? { ...l, ...r } : l);
        I(this, z, m(this, z).updateBranchEntry(a.index, a.branchIndex, a.branchEntryIndex, { tweens: s }));
      }
    }
    I(this, Lt, !0);
  }
}, "#flushTweenChanges"), Gl = /* @__PURE__ */ c(async function() {
  var n, i, r, a, o, s;
  if (m(this, Ge)) {
    if (m(this, ze) && C(this, j, wn).call(this), m(this, z).isStale(m(this, Ge))) {
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
        I(this, z, zt.fromScene(m(this, Ge), m(this, z).activeCinematicName)), I(this, Lt, !1), I(this, xe, []), I(this, nt, -1), this.render({ force: !0 }), (i = (n = ui.notifications) == null ? void 0 : n.info) == null || i.call(n, "Cinematic reloaded from scene.");
        return;
      }
      if (!l) return;
    }
    try {
      await m(this, z).save(m(this, Ge)), I(this, z, zt.fromScene(m(this, Ge), m(this, z).activeCinematicName)), I(this, Lt, !1), (a = (r = ui.notifications) == null ? void 0 : r.info) == null || a.call(r, "Cinematic saved."), this.render({ force: !0 });
    } catch (l) {
      console.error(`${T} | Cinematic save failed`, l), (s = (o = ui.notifications) == null ? void 0 : o.error) == null || s.call(o, "Failed to save cinematic data.");
    }
  }
}, "#onSave"), em = /* @__PURE__ */ c(async function() {
  var i, r, a, o, s;
  const n = (r = (i = game.modules.get(T)) == null ? void 0 : i.api) == null ? void 0 : r.cinematic;
  if (!(n != null && n.play)) {
    (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, "Cinematic API not available.");
    return;
  }
  await n.play((s = m(this, Ge)) == null ? void 0 : s.id, m(this, z).activeCinematicName);
}, "#onPlay"), tm = /* @__PURE__ */ c(async function() {
  var i, r, a, o, s;
  const n = (r = (i = game.modules.get(T)) == null ? void 0 : i.api) == null ? void 0 : r.cinematic;
  n != null && n.reset && (await n.reset((a = m(this, Ge)) == null ? void 0 : a.id, m(this, z).activeCinematicName), (s = (o = ui.notifications) == null ? void 0 : o.info) == null || s.call(o, "Cinematic tracking reset."));
}, "#onResetTracking"), nm = /* @__PURE__ */ c(async function() {
  var i, r;
  const n = JSON.stringify(m(this, z).toJSON(), null, 2);
  try {
    await navigator.clipboard.writeText(n), (r = (i = ui.notifications) == null ? void 0 : i.info) == null || r.call(i, "Cinematic JSON copied to clipboard.");
  } catch {
    new Dialog({
      title: "Cinematic JSON",
      content: `<textarea style="width:100%;height:300px;font-family:monospace;font-size:0.8rem">${_t(n)}</textarea>`,
      buttons: { ok: { label: "Close" } }
    }).render(!0);
  }
}, "#onExportJSON"), im = /* @__PURE__ */ c(function() {
  var l, u;
  const n = m(this, z).toJSON(), { targets: i, unresolved: r } = to(n), a = _y(n, i), o = [
    ...r.map((d) => ({ path: "targets", level: "warn", message: `Unresolved target: "${d}"` })),
    ...a
  ];
  if (o.length === 0) {
    (u = (l = ui.notifications) == null ? void 0 : l.info) == null || u.call(l, "Cinematic validation passed — no issues found.");
    return;
  }
  const s = o.map((d) => {
    const h = d.level === "error" ? "fa-circle-xmark" : "fa-triangle-exclamation", f = d.level === "error" ? "#e74c3c" : "#f39c12";
    return `<li style="margin:0.3rem 0"><i class="fa-solid ${h}" style="color:${f};margin-right:0.3rem"></i><strong>${_t(d.path)}</strong>: ${_t(d.message)}</li>`;
  });
  new Dialog({
    title: "Cinematic Validation",
    content: `<p>${o.length} issue(s) found:</p><ul style="list-style:none;padding:0;max-height:300px;overflow:auto">${s.join("")}</ul>`,
    buttons: { ok: { label: "Close" } }
  }).render(!0);
}, "#onValidate"), // ── Playback progress ────────────────────────────────────────────────
rm = /* @__PURE__ */ c(function(n) {
  var i, r, a, o, s, l;
  switch (console.log(`[cinematic-editor] playback event: ${n.type}`, n), n.type) {
    case "segment-start":
      I(this, mi, n.segmentName), n.segmentName !== m(this, z).activeSegmentName ? (I(this, z, m(this, z).switchSegment(n.segmentName)), I(this, et, null), m(this, Mn).clear(), this.render({ force: !0 })) : (i = this.element) == null || i.querySelectorAll(".cinematic-editor__segment-node").forEach((u) => {
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
      I(this, ft, { segmentName: n.segmentName, startTime: performance.now(), durationMs: n.durationMs }), n.segmentName === m(this, z).activeSegmentName && C(this, j, zl).call(this, n.durationMs);
      break;
    case "timeline-end":
      C(this, j, mr).call(this), I(this, ft, null);
      break;
    case "playback-end":
      C(this, j, mr).call(this), I(this, ft, null), I(this, mi, null), (l = this.element) == null || l.querySelectorAll(".cinematic-editor__segment-node--playing, .cinematic-editor__segment-node--gate-waiting").forEach((u) => {
        u.classList.remove("cinematic-editor__segment-node--playing", "cinematic-editor__segment-node--gate-waiting");
      });
      break;
  }
}, "#onPlaybackEvent"), zl = /* @__PURE__ */ c(function(n, i = null) {
  var u, d;
  C(this, j, mr).call(this);
  const r = (u = this.element) == null ? void 0 : u.querySelector(".cinematic-editor__playback-cursor"), a = (d = this.element) == null ? void 0 : d.querySelector(".cinematic-editor__swimlane");
  if (console.log(`[cinematic-editor] startCursor: duration=${n}, cursor=${!!r}, swimlane=${!!a}, width=${a == null ? void 0 : a.scrollWidth}`), !r || !a || n <= 0) return;
  r.style.display = "block";
  const o = i ?? performance.now(), s = a.scrollWidth, l = /* @__PURE__ */ c(() => {
    const h = performance.now() - o, f = Math.min(h / n, 1), g = Ar + f * (s - Ar);
    r.style.left = `${g}px`, f < 1 && I(this, _n, requestAnimationFrame(l));
  }, "tick");
  I(this, _n, requestAnimationFrame(l));
}, "#startCursorAnimation"), mr = /* @__PURE__ */ c(function() {
  var i;
  m(this, _n) && (cancelAnimationFrame(m(this, _n)), I(this, _n, null));
  const n = (i = this.element) == null ? void 0 : i.querySelector(".cinematic-editor__playback-cursor");
  n && (n.style.display = "none");
}, "#stopCursorAnimation"), c(Et, "CinematicEditorApplication"), pe(Et, "APP_ID", `${T}-cinematic-editor`), pe(Et, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Re(Et, Et, "DEFAULT_OPTIONS"),
  {
    id: Et.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Ku = Re(Et, Et, "DEFAULT_OPTIONS")) == null ? void 0 : Ku.classes) ?? [], "eidolon-cinematic-editor-window", "themed"])
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
)), pe(Et, "PARTS", {
  content: {
    template: `modules/${T}/templates/cinematic-editor.html`
  }
});
let ql = Et;
const am = /* @__PURE__ */ new Map();
function be(t, e) {
  am.set(t, e);
}
c(be, "registerBehaviour");
function Wl(t) {
  return am.get(t);
}
c(Wl, "getBehaviour");
function mb(t, e, n) {
  let i, r, a;
  if (e === 0)
    i = r = a = n;
  else {
    const o = /* @__PURE__ */ c((u, d, h) => (h < 0 && (h += 1), h > 1 && (h -= 1), h < 0.16666666666666666 ? u + (d - u) * 6 * h : h < 0.5 ? d : h < 0.6666666666666666 ? u + (d - u) * (0.6666666666666666 - h) * 6 : u), "hue2rgb"), s = n < 0.5 ? n * (1 + e) : n + e - n * e, l = 2 * n - s;
    i = o(l, s, t + 1 / 3), r = o(l, s, t), a = o(l, s, t - 1 / 3);
  }
  return Math.round(i * 255) << 16 | Math.round(r * 255) << 8 | Math.round(a * 255);
}
c(mb, "hslToInt");
be("float", (t, e = {}) => {
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
be("pulse", (t, e = {}) => {
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
be("scale", (t, e = {}) => {
  const n = t.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.factor ?? 1.12, r = e.durationFrames ?? 15, a = Kt(e.easing ?? "easeOutCubic"), o = n.scale.x, s = n.scale.y, l = o * i, u = s * i;
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
be("glow", (t, e = {}) => {
  var y, b;
  const n = t.mesh;
  if (!((y = n == null ? void 0 : n.texture) != null && y.baseTexture)) return { update() {
  }, detach() {
  } };
  const i = t.document, r = e.color ?? 4513279, a = e.alpha ?? 0.5, o = e.blur ?? 8, s = e.pulseSpeed ?? 0.03, l = Math.abs(i.width), u = Math.abs(i.height), d = PIXI.Sprite.from(n.texture);
  d.anchor.set(0.5, 0.5), d.scale.set(n.scale.x, n.scale.y), d.position.set(l / 2, u / 2), d.angle = i.rotation ?? 0, d.alpha = a, d.tint = r;
  const h = PIXI.BlurFilter ?? ((b = PIXI.filters) == null ? void 0 : b.BlurFilter), f = new h(o);
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
be("wobble", (t, e = {}) => {
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
be("colorCycle", (t, e = {}) => {
  const n = t.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.speed ?? 5e-3, r = e.saturation ?? 0.6, a = e.lightness ?? 0.6, o = n.tint;
  let s = 0;
  return {
    update(l) {
      s = (s + l * i) % 1, n.tint = mb(s, r, a);
    },
    detach() {
      n.tint = o;
    }
  };
});
be("spin", (t, e = {}) => {
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
be("bounce", (t, e = {}) => {
  const n = t.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.speed ?? 0.02, r = e.amplitude ?? 6, a = Kt("easeOutBounce"), o = n.position.y;
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
be("borderTrace", (t, e = {}) => {
  const n = t.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), a = Math.abs(i.height), o = 2 * (r + a), s = e.speed ?? 1.5, l = e.length ?? 60, u = e.color ?? 4513279, d = e.alpha ?? 0.8, h = e.lineWidth ?? 2, f = new PIXI.Graphics();
  f.alpha = d, f.pivot.set(r / 2, a / 2), f.position.set(r / 2, a / 2), t.addChildAt(f, 0);
  const g = n.scale.x, p = n.scale.y, y = n.angle;
  let b = 0;
  function v(w) {
    return w = (w % o + o) % o, w < r ? { x: w, y: 0 } : (w -= r, w < a ? { x: r, y: w } : (w -= a, w < r ? { x: r - w, y: a } : (w -= r, { x: 0, y: a - w })));
  }
  return c(v, "perimeterPoint"), {
    update(w) {
      b = (b + w * s) % o, f.visible = n.visible !== !1, f.alpha = d * (n.alpha ?? 1), f.scale.set(n.scale.x / g, n.scale.y / p), f.angle = n.angle - y, f.clear(), f.lineStyle(h, u, 1);
      const E = 16, L = l / E, A = v(b);
      f.moveTo(A.x, A.y);
      for (let O = 1; O <= E; O++) {
        const M = v(b + O * L);
        f.lineTo(M.x, M.y);
      }
    },
    detach() {
      f.parent && f.parent.removeChild(f), f.destroy({ children: !0 });
    }
  };
});
be("shimmer", (t, e = {}) => {
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
  const y = n.scale.x, b = n.scale.y, v = n.angle;
  let w = 0;
  return {
    update(E) {
      if (w = (w + E * o) % h, f.visible = n.visible !== !1, f.scale.set(n.scale.x / y, n.scale.y / b), f.angle = n.angle - v, g.alpha = l * (n.alpha ?? 1), g.clear(), w < d) {
        const L = w - s;
        g.beginFill(16777215, 1), g.moveTo(L, 0), g.lineTo(L + s, 0), g.lineTo(L + s - a, a), g.lineTo(L - a, a), g.closePath(), g.endFill();
      }
    },
    detach() {
      g.mask = null, f.parent && f.parent.removeChild(f), f.destroy({ children: !0 });
    }
  };
});
be("breathe", (t, e = {}) => {
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
be("tiltFollow", (t, e = {}) => {
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
be("slideReveal", (t, e = {}, n) => {
  const i = t.mesh;
  if (!i) return { update() {
  }, detach() {
  } };
  if (n) return { update() {
  }, detach() {
  } };
  const r = e.offsetX ?? 0, a = e.offsetY ?? 20, o = e.durationFrames ?? 20, s = Kt(e.easing ?? "easeOutCubic"), l = e.delay ?? 0, u = i.position.x, d = i.position.y, h = i.alpha;
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
be("embers", (t, e = {}) => {
  const n = t.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), a = Math.abs(i.height), o = e.count ?? 12, s = e.speed ?? 0.5, l = e.color ?? 16737792, u = e.alpha ?? 0.6, d = e.size ?? 2, h = new PIXI.Container();
  h.pivot.set(r / 2, a / 2), h.position.set(r / 2, a / 2);
  const f = new PIXI.Graphics();
  h.addChild(f), t.addChild(h);
  const g = n.scale.x, p = n.scale.y, y = n.angle, b = [];
  function v() {
    const w = Math.random();
    let E, L;
    return w < 0.7 ? (E = Math.random() * r, L = a) : w < 0.85 ? (E = 0, L = a * 0.5 + Math.random() * a * 0.5) : (E = r, L = a * 0.5 + Math.random() * a * 0.5), {
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
    update(w) {
      h.visible = n.visible !== !1, h.scale.set(n.scale.x / g, n.scale.y / p), h.angle = n.angle - y, b.length < o && b.push(v());
      for (let E = b.length - 1; E >= 0; E--) {
        const L = b[E];
        if (L.life += w, L.life >= L.maxLife) {
          b.splice(E, 1);
          continue;
        }
        L.x += L.vx * w, L.y += L.vy * w, L.vx += (Math.random() - 0.5) * 0.05 * w;
      }
      f.clear();
      for (const E of b) {
        const L = 1 - E.life / E.maxLife;
        f.beginFill(l, u * L * (n.alpha ?? 1)), f.drawCircle(E.x, E.y, E.size), f.endFill();
      }
    },
    detach() {
      h.parent && h.parent.removeChild(h), h.destroy({ children: !0 });
    }
  };
});
be("runeGlow", (t, e = {}) => {
  const n = t.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), a = Math.abs(i.height), o = 2 * (r + a), s = e.dots ?? 3, l = e.speed ?? 1.2, u = e.color ?? 4513279, d = e.color2 ?? 8930559, h = e.radius ?? 3, f = e.alpha ?? 0.7, g = new PIXI.Graphics();
  g.pivot.set(r / 2, a / 2), g.position.set(r / 2, a / 2), t.addChildAt(g, 0);
  const p = n.scale.x, y = n.scale.y, b = n.angle, v = [];
  for (let L = 0; L < s; L++)
    v.push({
      phase: L / s * o,
      speedMul: 0.7 + Math.random() * 0.6,
      color: L % 2 === 0 ? u : d
    });
  function w(L) {
    return L = (L % o + o) % o, L < r ? { x: L, y: 0 } : (L -= r, L < a ? { x: r, y: L } : (L -= a, L < r ? { x: r - L, y: a } : (L -= r, { x: 0, y: a - L })));
  }
  c(w, "perimeterPoint");
  let E = 0;
  return {
    update(L) {
      E += L, g.visible = n.visible !== !1, g.alpha = f * (n.alpha ?? 1), g.scale.set(n.scale.x / p, n.scale.y / y), g.angle = n.angle - b, g.clear();
      for (const A of v) {
        const O = w(A.phase + E * l * A.speedMul);
        g.beginFill(A.color, 1), g.drawCircle(O.x, O.y, h), g.endFill();
      }
    },
    detach() {
      g.parent && g.parent.removeChild(g), g.destroy({ children: !0 });
    }
  };
});
be("ripple", (t, e = {}) => {
  const n = t.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), a = Math.abs(i.height), o = e.maxRadius ?? Math.sqrt(r * r + a * a) / 2, s = e.rings ?? 3, l = e.interval ?? 30, u = e.speed ?? 1.5, d = e.color ?? 4513279, h = e.alpha ?? 0.4, f = e.lineWidth ?? 1.5, g = new PIXI.Container();
  g.pivot.set(r / 2, a / 2), g.position.set(r / 2, a / 2);
  const p = new PIXI.Graphics();
  g.addChild(p), t.addChild(g);
  const y = n.scale.x, b = n.scale.y, v = n.angle, w = [];
  let E = 0, L = 0;
  return {
    update(A) {
      E += A, g.visible = n.visible !== !1, g.scale.set(n.scale.x / y, n.scale.y / b), g.angle = n.angle - v, E >= L && w.length < s && (w.push({ radius: 0, alpha: h }), L = E + l);
      for (let x = w.length - 1; x >= 0; x--) {
        const R = w[x];
        R.radius += u * A, R.alpha = h * (1 - R.radius / o), R.radius >= o && w.splice(x, 1);
      }
      p.clear();
      const O = r / 2, M = a / 2;
      for (const x of w)
        p.lineStyle(f, d, x.alpha * (n.alpha ?? 1)), p.drawCircle(O, M, x.radius);
    },
    detach() {
      g.parent && g.parent.removeChild(g), g.destroy({ children: !0 });
    }
  };
});
be("frostEdge", (t, e = {}) => {
  const n = t.mesh;
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), a = Math.abs(i.height), o = e.segments ?? 20, s = e.maxLength ?? 15, l = e.color ?? 11197951, u = e.alpha ?? 0.5, d = e.growSpeed ?? 0.02, h = new PIXI.Container();
  h.pivot.set(r / 2, a / 2), h.position.set(r / 2, a / 2);
  const f = new PIXI.Graphics(), g = new PIXI.Graphics();
  g.beginFill(16777215), g.drawRect(0, 0, r, a), g.endFill(), h.addChild(g), f.mask = g, h.addChild(f), t.addChild(h);
  const p = n.scale.x, y = n.scale.y, b = n.angle, v = [];
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
  let w = !1, E = 0;
  return {
    update(L) {
      if (h.visible = n.visible !== !1, h.scale.set(n.scale.x / p, n.scale.y / y), h.angle = n.angle - b, w)
        E += L * 0.03;
      else {
        w = !0;
        for (const O of v)
          O.grown || (O.currentLength += (O.targetLength - O.currentLength) * d * L, O.currentLength >= O.targetLength * 0.99 ? (O.currentLength = O.targetLength, O.grown = !0) : w = !1);
      }
      const A = w ? u * (0.7 + 0.3 * Math.sin(E)) : u;
      f.clear(), f.lineStyle(1.5, l, A * (n.alpha ?? 1));
      for (const O of v)
        O.currentLength <= 0 || (f.moveTo(O.sx, O.sy), f.lineTo(O.sx + Math.cos(O.angle) * O.currentLength, O.sy + Math.sin(O.angle) * O.currentLength));
    },
    detach() {
      f.mask = null, h.parent && h.parent.removeChild(h), h.destroy({ children: !0 });
    }
  };
});
be("shadowLift", (t, e = {}) => {
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
  const r = e.offsetY ?? 6, a = e.blur ?? 6, o = e.alpha ?? 0.35, s = e.color ?? 0, l = e.durationFrames ?? 12, u = Kt(e.easing ?? "easeOutCubic"), d = new i();
  d.blur = a, d.alpha = 0, d.color = s, d.quality = 3, d.distance = 0, d.rotation = 90;
  const h = n.filters ? [...n.filters] : [];
  n.filters = [...h, d];
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
be("none", () => ({ update() {
}, detach() {
} }));
const ga = {
  idle: ["float", "glow"],
  hover: ["scale"],
  dim: ["none"]
};
function hb(t) {
  if (!t) return { ...ga };
  const e = /* @__PURE__ */ c((n, i) => n === void 0 ? i : typeof n == "string" ? [n] : typeof n == "object" && !Array.isArray(n) && n.name ? [n] : Array.isArray(n) ? n : i, "normalize");
  return {
    idle: e(t.idle, ga.idle),
    hover: e(t.hover, ga.hover),
    dim: e(t.dim, ga.dim)
  };
}
c(hb, "normalizeConfig");
var Fe, jt, un, Bt, Nn, Ut, It, dn, Me, om, xa, sm, lm, cm, um;
const Cr = class Cr {
  /**
   * @param {PlaceableObject} placeable
   * @param {object|undefined} animationConfig  Raw animation config from the await entry
   */
  constructor(e, n) {
    k(this, Me);
    k(this, Fe);
    k(this, jt);
    k(this, un, null);
    k(this, Bt, []);
    k(this, Nn, null);
    k(this, Ut, null);
    k(this, It, null);
    k(this, dn, 0);
    I(this, Fe, e), I(this, jt, hb(n));
  }
  /** Current animation state name. */
  get state() {
    return m(this, un);
  }
  /**
   * Start animating in the given state.
   * @param {string} [state="idle"]
   */
  start(e = "idle") {
    var r;
    C(this, Me, om).call(this);
    const n = ((r = m(this, Fe).document) == null ? void 0 : r.id) ?? "?", i = m(this, Ut);
    i && console.log(`%c[TileAnimator ${n}] start("${e}") canonical: pos=(${i.x.toFixed(2)}, ${i.y.toFixed(2)}) scale=(${i.scaleX.toFixed(4)}, ${i.scaleY.toFixed(4)}) alpha=${i.alpha.toFixed(4)} angle=${i.angle.toFixed(2)}`, "color: #FFAA44; font-weight: bold"), C(this, Me, cm).call(this, e), I(this, Nn, (a) => {
      m(this, It) && C(this, Me, xa).call(this);
      for (const o of m(this, Bt)) o.update(a);
      C(this, Me, lm).call(this, a);
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
    if (e === m(this, un)) return;
    const n = ((h = m(this, Fe).document) == null ? void 0 : h.id) ?? "?", i = m(this, Fe).mesh, r = m(this, jt)[m(this, un)] ?? m(this, jt).idle ?? ["none"], a = m(this, jt)[e] ?? m(this, jt).idle ?? ["none"], o = r.map((f) => typeof f == "string" ? f : f == null ? void 0 : f.name), s = a.map((f) => typeof f == "string" ? f : f == null ? void 0 : f.name);
    if (console.log(`%c[TileAnimator ${n}] setState: ${m(this, un)} → ${e}`, "color: #44DDFF; font-weight: bold"), console.log(`  old behaviours: [${o.join(", ")}]  →  new: [${s.join(", ")}]`), i && console.log(`  mesh BEFORE detach: pos=(${i.position.x.toFixed(2)}, ${i.position.y.toFixed(2)}) scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)} angle=${i.angle.toFixed(2)}`), m(this, Ut)) {
      const f = m(this, Ut);
      console.log(`  canonical: pos=(${f.x.toFixed(2)}, ${f.y.toFixed(2)}) scale=(${f.scaleX.toFixed(4)}, ${f.scaleY.toFixed(4)}) alpha=${f.alpha.toFixed(4)} angle=${f.angle.toFixed(2)}`);
    }
    const l = /* @__PURE__ */ new Map();
    for (let f = 0; f < m(this, Bt).length; f++) {
      const g = r[f], p = typeof g == "string" ? g : g == null ? void 0 : g.name;
      p && l.set(p, m(this, Bt)[f]);
    }
    const u = [], d = /* @__PURE__ */ new Set();
    for (const f of a) {
      const g = typeof f == "string" ? f : f.name;
      l.has(g) && !d.has(g) && d.add(g);
    }
    console.log(`  reused: [${[...d].join(", ")}]  detaching: [${[...l.keys()].filter((f) => !d.has(f)).join(", ")}]`), C(this, Me, sm).call(this);
    for (const [f, g] of l)
      d.has(f) || (g.detach(), i && console.log(`  mesh AFTER detach("${f}"): scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)}`));
    C(this, Me, xa).call(this), i && console.log(`  mesh AFTER canonical restore: scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)}`);
    for (const f of a) {
      const g = typeof f == "string" ? f : f.name;
      if (l.has(g) && d.has(g))
        u.push(l.get(g)), d.delete(g), console.log(`  → reuse "${g}"`);
      else {
        const p = typeof f == "string" ? void 0 : f, y = Wl(g);
        if (!y) {
          console.warn(`TileAnimator: unknown behaviour "${g}"`);
          continue;
        }
        u.push(y(m(this, Fe), p, m(this, Ut))), i && console.log(`  → create "${g}" — mesh after factory: scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)} pos=(${i.position.x.toFixed(2)}, ${i.position.y.toFixed(2)})`);
      }
    }
    if (m(this, It)) {
      const f = m(this, It);
      console.log(`  blend FROM: pos=(${f.x.toFixed(2)}, ${f.y.toFixed(2)}) scale=(${f.scaleX.toFixed(4)}, ${f.scaleY.toFixed(4)}) alpha=${f.alpha.toFixed(4)}`);
    }
    I(this, un, e), I(this, Bt, u);
  }
  /**
   * Full cleanup — detach all behaviours, restore canonical, and remove ticker.
   */
  detach() {
    var e, n;
    C(this, Me, um).call(this), C(this, Me, xa).call(this), I(this, It, null), m(this, Nn) && ((n = (e = canvas.app) == null ? void 0 : e.ticker) == null || n.remove(m(this, Nn)), I(this, Nn, null));
  }
};
Fe = new WeakMap(), jt = new WeakMap(), un = new WeakMap(), Bt = new WeakMap(), Nn = new WeakMap(), Ut = new WeakMap(), It = new WeakMap(), dn = new WeakMap(), Me = new WeakSet(), // ── Private ──────────────────────────────────────────────────────────
om = /* @__PURE__ */ c(function() {
  const e = m(this, Fe).mesh;
  e && I(this, Ut, {
    x: e.position.x,
    y: e.position.y,
    scaleX: e.scale.x,
    scaleY: e.scale.y,
    angle: e.angle,
    alpha: e.alpha,
    tint: e.tint
  });
}, "#captureCanonical"), xa = /* @__PURE__ */ c(function() {
  const e = m(this, Fe).mesh;
  if (!e || !m(this, Ut)) return;
  const n = m(this, Ut);
  e.position.x = n.x, e.position.y = n.y, e.scale.x = n.scaleX, e.scale.y = n.scaleY, e.angle = n.angle, e.alpha = n.alpha, e.tint = n.tint;
}, "#restoreCanonical"), /**
 * Snapshot the current (animated) mesh values so the transition blend
 * can lerp FROM here toward the new state's computed values.
 */
sm = /* @__PURE__ */ c(function() {
  const e = m(this, Fe).mesh;
  e && (I(this, It, {
    x: e.position.x,
    y: e.position.y,
    scaleX: e.scale.x,
    scaleY: e.scale.y,
    angle: e.angle,
    alpha: e.alpha
  }), I(this, dn, 0));
}, "#captureBlendStart"), /**
 * After behaviours compute the new state's mesh values, blend from the
 * pre-transition snapshot toward those values over BLEND_FRAMES using
 * easeOutCubic. This hides the canonical-restore snap entirely.
 */
lm = /* @__PURE__ */ c(function(e) {
  var o, s;
  if (!m(this, It)) return;
  I(this, dn, m(this, dn) + e);
  const n = Math.min(m(this, dn) / Cr.BLEND_FRAMES, 1);
  if (n >= 1) {
    const l = ((o = m(this, Fe).document) == null ? void 0 : o.id) ?? "?";
    console.log(`%c[TileAnimator ${l}] blend complete`, "color: #88FF88"), I(this, It, null);
    return;
  }
  const i = 1 - (1 - n) ** 3, r = m(this, Fe).mesh;
  if (!r) return;
  const a = m(this, It);
  if (m(this, dn) <= e * 3) {
    const l = ((s = m(this, Fe).document) == null ? void 0 : s.id) ?? "?", u = Math.round(m(this, dn) / e);
    console.log(`  [blend ${l} f${u}] t=${n.toFixed(3)} eased=${i.toFixed(3)} | behaviour→scale=(${r.scale.x.toFixed(4)},${r.scale.y.toFixed(4)}) alpha=${r.alpha.toFixed(4)} | blendFrom→scale=(${a.scaleX.toFixed(4)},${a.scaleY.toFixed(4)}) alpha=${a.alpha.toFixed(4)}`);
  }
  r.position.x = a.x + (r.position.x - a.x) * i, r.position.y = a.y + (r.position.y - a.y) * i, r.scale.x = a.scaleX + (r.scale.x - a.scaleX) * i, r.scale.y = a.scaleY + (r.scale.y - a.scaleY) * i, r.angle = a.angle + (r.angle - a.angle) * i, r.alpha = a.alpha + (r.alpha - a.alpha) * i, m(this, dn) <= e * 3 && console.log(`  [blend result] scale=(${r.scale.x.toFixed(4)},${r.scale.y.toFixed(4)}) alpha=${r.alpha.toFixed(4)} pos=(${r.position.x.toFixed(2)},${r.position.y.toFixed(2)})`);
}, "#applyBlend"), cm = /* @__PURE__ */ c(function(e) {
  I(this, un, e);
  const n = m(this, jt)[e] ?? m(this, jt).idle ?? ["none"];
  for (const i of n) {
    const r = typeof i == "string" ? i : i.name, a = typeof i == "string" ? void 0 : i, o = Wl(r);
    if (!o) {
      console.warn(`TileAnimator: unknown behaviour "${r}"`);
      continue;
    }
    m(this, Bt).push(o(m(this, Fe), a));
  }
}, "#attachBehaviours"), um = /* @__PURE__ */ c(function() {
  for (const e of m(this, Bt)) e.detach();
  I(this, Bt, []);
}, "#detachBehaviours"), c(Cr, "TileAnimator"), /** Frames over which state transitions are blended (easeOutCubic). */
pe(Cr, "BLEND_FRAMES", 8);
let Xi = Cr;
const gb = "cinematic", Ls = 5, Yl = /* @__PURE__ */ new Set();
function en(t) {
  for (const e of Yl)
    try {
      e(t);
    } catch (n) {
      console.error("[cinematic] playback listener error:", n);
    }
}
c(en, "emitPlaybackEvent");
function pb(t) {
  return Yl.add(t), () => Yl.delete(t);
}
c(pb, "onPlaybackProgress");
let Ee = null, on = null, yr = null, br = null, Ai = 0, Qn = null;
function wc(t, e = "default") {
  return `cinematic-progress-${t}-${e}`;
}
c(wc, "progressFlagKey");
function yb(t, e, n, i) {
  game.user.setFlag(T, wc(t, e), {
    currentSegment: n,
    completedSegments: [...i],
    timestamp: Date.now()
  }).catch(() => {
  });
}
c(yb, "saveSegmentProgress");
function Kl(t, e = "default") {
  game.user.unsetFlag(T, wc(t, e)).catch(() => {
  });
}
c(Kl, "clearProgress");
function dm(t, e = "default", n = 3e5) {
  const i = game.user.getFlag(T, wc(t, e));
  return !i || typeof i.timestamp != "number" || Date.now() - i.timestamp > n ? null : i.currentSegment ? i : null;
}
c(dm, "getSavedProgress");
function Si(t, e = "default") {
  return `cinematic-seen-${t}-${e}`;
}
c(Si, "seenFlagKey");
function Lu(t, e = "default") {
  return !!game.user.getFlag(T, Si(t, e));
}
c(Lu, "hasSeenCinematic");
function bb(t, e) {
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
c(bb, "validateSingleCinematic");
function rs(t) {
  const e = t ? game.scenes.get(t) : canvas.scene;
  let n = (e == null ? void 0 : e.getFlag(T, gb)) ?? null;
  if (n == null) return null;
  if (typeof n != "object" || Array.isArray(n))
    return console.warn(`[${T}] Cinematic: invalid flag data on scene ${e == null ? void 0 : e.id} (expected object). Ignoring.`), null;
  if ((n.version ?? 1) < 3) {
    const { version: i, ...r } = n;
    n = { version: 3, cinematics: { default: r } };
  }
  if (n.version === 3) {
    for (const [i, r] of Object.entries(n.cinematics ?? {}))
      n.cinematics[i] = zt.migrateV3toV4(r);
    n.version = 4;
  }
  if (n.version === 4) {
    for (const [i, r] of Object.entries(n.cinematics ?? {}))
      n.cinematics[i] = zt.migrateV4toV5(r);
    n.version = Ls;
  }
  if (n.version > Ls)
    return console.warn(`[${T}] Cinematic: scene ${e == null ? void 0 : e.id} has version ${n.version}, runtime supports up to ${Ls}. Skipping.`), null;
  if (!n.cinematics || typeof n.cinematics != "object")
    return console.warn(`[${T}] Cinematic: no 'cinematics' map on scene ${e == null ? void 0 : e.id}. Ignoring.`), null;
  for (const [i, r] of Object.entries(n.cinematics)) {
    const a = bb(r, `scene ${e == null ? void 0 : e.id} cinematic "${i}"`);
    a ? n.cinematics[i] = a : delete n.cinematics[i];
  }
  return Object.keys(n.cinematics).length === 0 ? null : n;
}
c(rs, "getCinematicData");
function lo(t, e = "default") {
  var i;
  const n = rs(t);
  return ((i = n == null ? void 0 : n.cinematics) == null ? void 0 : i[e]) ?? null;
}
c(lo, "getNamedCinematic");
function vb(t) {
  const e = rs(t);
  return e ? Object.keys(e.cinematics) : [];
}
c(vb, "listCinematicNames");
function wb() {
  return game.ready ? Promise.resolve() : new Promise((t) => Hooks.once("ready", t));
}
c(wb, "waitForReady");
async function Eb(t = 1e4) {
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
c(Eb, "waitForTweenAPI");
async function Jl(t = 5e3) {
  var e;
  return window.Tagger ?? ((e = game.modules.get("tagger")) == null ? void 0 : e.api) ? !0 : new Promise((n) => {
    const i = Date.now(), r = setInterval(() => {
      var a;
      window.Tagger ?? ((a = game.modules.get("tagger")) == null ? void 0 : a.api) ? (clearInterval(r), n(!0)) : Date.now() - i > t && (clearInterval(r), console.warn(`[${T}] Cinematic: Tagger API not available after ${t}ms.`), n(!1));
    }, 200);
  });
}
c(Jl, "waitForTagger");
async function Sb(t, e, n) {
  if (!t || !t.event) return;
  const i = { ...t };
  console.log(`[${T}] Cinematic: waiting for gate: ${t.event}`);
  let r = null;
  if (t.event === "tile-click" && t.target && t.animation) {
    const a = e.get(t.target);
    (a == null ? void 0 : a.kind) === "placeable" && a.placeable && (r = new Xi(a.placeable, t.animation), r.start());
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
c(Sb, "processGate");
function fm(t) {
  if (!t.segments) return [];
  const e = [], n = /* @__PURE__ */ new Set();
  let i = t.entry;
  for (; i && typeof i == "string" && t.segments[i] && !n.has(i); )
    n.add(i), e.push(i), i = t.segments[i].next;
  return e;
}
c(fm, "getSegmentOrder");
function co(t, e) {
  if (t.setup)
    try {
      Le(t.setup, e);
    } catch (i) {
      console.warn(`[${T}] Cinematic: error applying cinematic-level setup:`, i);
    }
  const n = fm(t);
  for (const i of n) {
    const r = t.segments[i];
    if (r.setup)
      try {
        Le(r.setup, e);
      } catch (a) {
        console.warn(`[${T}] Cinematic: error applying setup for segment "${i}":`, a);
      }
    if (r.landing)
      try {
        Le(r.landing, e);
      } catch (a) {
        console.warn(`[${T}] Cinematic: error applying landing for segment "${i}":`, a);
      }
  }
  if (t.landing)
    try {
      Le(t.landing, e);
    } catch (i) {
      console.warn(`[${T}] Cinematic: error applying cinematic-level landing:`, i);
    }
  canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
}
c(co, "applyAllSegmentLandingStates");
async function vr(t, e = "default", n = null) {
  var w, E, L, A, O, M, x, R;
  const i = t ?? ((w = canvas.scene) == null ? void 0 : w.id);
  if (!i) return;
  const r = `${i}:${e}`;
  if (n || (n = /* @__PURE__ */ new Set()), n.has(r)) {
    console.warn(`[${T}] Cinematic: circular transition detected at "${r}". Stopping chain.`), (L = (E = ui.notifications) == null ? void 0 : E.warn) == null || L.call(E, "Cinematic: circular transition detected, stopping.");
    return;
  }
  n.add(r), (Ee == null ? void 0 : Ee.status) === "running" && Ee.cancel("replaced"), Ee = null, on && (on.abort("replaced"), on = null);
  const a = lo(i, e);
  if (!a) {
    console.warn(`[${T}] Cinematic: no cinematic "${e}" on scene ${i}.`);
    return;
  }
  const o = await Eb();
  if (!o || ((A = canvas.scene) == null ? void 0 : A.id) !== i || (await Jl(), ((O = canvas.scene) == null ? void 0 : O.id) !== i)) return;
  const { targets: s, unresolved: l } = to(a);
  if (console.log(`[${T}] Cinematic "${e}": resolved ${s.size} targets`), l.length && console.warn(`[${T}] Cinematic "${e}": skipping ${l.length} unresolved: ${l.join(", ")}`), s.size === 0) {
    console.warn(`[${T}] Cinematic "${e}": no targets could be resolved on scene ${i}.`);
    return;
  }
  const u = Cy(a);
  yr = Sy(u, s), br = s;
  const d = dm(i, e), h = new AbortController();
  on = h;
  const f = a.synchronized === !0 && game.user.isGM, g = fm(a);
  if (g.length === 0) {
    console.warn(`[${T}] Cinematic "${e}": no segments to execute.`);
    return;
  }
  let p = 0;
  const y = /* @__PURE__ */ new Set();
  if (d) {
    const D = d.completedSegments ?? [];
    for (const N of D) y.add(N);
    const F = g.indexOf(d.currentSegment);
    F >= 0 && (p = F, console.log(`[${T}] Cinematic "${e}": resuming from segment "${d.currentSegment}" (${D.length} completed)`));
  }
  if (a.setup)
    try {
      Le(a.setup, s), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    } catch (D) {
      console.error(`[${T}] Cinematic "${e}": error applying cinematic-level setup:`, D);
    }
  for (let D = 0; D < p; D++) {
    const F = g[D], N = a.segments[F];
    if (N.setup)
      try {
        Le(N.setup, s);
      } catch (H) {
        console.warn(`[${T}] Cinematic: error applying setup for completed segment "${F}":`, H);
      }
    if (N.landing)
      try {
        Le(N.landing, s);
      } catch (H) {
        console.warn(`[${T}] Cinematic: error applying landing for completed segment "${F}":`, H);
      }
  }
  let b = !1, v = !1;
  en({ type: "playback-start", sceneName: ((M = canvas.scene) == null ? void 0 : M.name) ?? i });
  try {
    for (let D = p; D < g.length; D++) {
      if (h.signal.aborted) {
        b = !0;
        break;
      }
      if (((x = canvas.scene) == null ? void 0 : x.id) !== i) {
        b = !0;
        break;
      }
      const F = g[D], N = a.segments[F];
      if (console.log(`[${T}] Cinematic "${e}": entering segment "${F}"`), en({ type: "segment-start", segmentName: F }), yb(i, e, F, [...y]), N.gate) {
        en({ type: "gate-wait", segmentName: F, gate: N.gate });
        try {
          await Sb(N.gate, s, h);
        } catch (B) {
          if (h.signal.aborted) {
            b = !0;
            break;
          }
          throw B;
        }
        en({ type: "gate-resolved", segmentName: F });
      }
      if (h.signal.aborted) {
        b = !0;
        break;
      }
      if (N.setup)
        try {
          Le(N.setup, s), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
        } catch (B) {
          console.error(`[${T}] Cinematic "${e}": error applying setup for segment "${F}":`, B);
        }
      if ((R = N.timeline) != null && R.length) {
        const B = vc(N.timeline);
        en({ type: "timeline-start", segmentName: F, durationMs: B });
        const { tl: W } = My(
          { setup: {}, timeline: N.timeline },
          s,
          o,
          {
            timelineName: `cinematic-${i}-${e}-${F}`,
            onStepComplete: /* @__PURE__ */ c((U) => {
              en({ type: "step-complete", segmentName: F, stepIndex: U });
            }, "onStepComplete")
          }
        );
        Ee = W.run({
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
            b = !0;
            break;
          }
          throw U;
        }
        en({ type: "timeline-end", segmentName: F });
      }
      if (h.signal.aborted) {
        b = !0;
        break;
      }
      if (N.landing)
        try {
          Le(N.landing, s), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
        } catch (B) {
          console.error(`[${T}] Cinematic "${e}": error applying landing for segment "${F}":`, B);
        }
      en({ type: "segment-complete", segmentName: F }), y.add(F);
      const H = N.next;
      if (H && typeof H == "object" && H.scene) {
        const B = H.scene, W = H.segment ?? a.entry;
        console.log(`[${T}] Cinematic "${e}": cross-scene transition to scene ${B}, segment "${W}"`), Ee = null, on = null, Kl(i, e), mu(), a.tracking !== !1 && await game.user.setFlag(T, Si(i, e), !0), Qn = { sceneId: B, cinematicName: e, visitedChain: n };
        const q = game.scenes.get(B);
        q ? q.view() : (console.warn(`[${T}] Cinematic: cross-scene transition target scene "${B}" not found.`), Qn = null);
        return;
      }
    }
  } catch (D) {
    v = !0, console.error(`[${T}] Cinematic "${e}" error on scene ${i}:`, D);
  }
  if (Ee = null, on = null, Kl(i, e), mu(), yr = null, br = null, en({ type: "playback-end", cancelled: !!b }), b) {
    console.log(`[${T}] Cinematic "${e}" cancelled on scene ${i}.`), co(a, s);
    return;
  }
  if (v) {
    co(a, s);
    return;
  }
  a.tracking !== !1 && await game.user.setFlag(T, Si(i, e), !0), console.log(`[${T}] Cinematic "${e}" complete on scene ${i}.`);
}
c(vr, "playCinematic");
async function Cb(t, e = "default") {
  var i;
  const n = t ?? ((i = canvas.scene) == null ? void 0 : i.id);
  n && (await game.user.unsetFlag(T, Si(n, e)), console.log(`[${T}] Cinematic: cleared seen flag for "${e}" on scene ${n}.`));
}
c(Cb, "resetCinematic");
async function Tb(t, e, n = "default") {
  var a;
  if (!game.user.isGM) return;
  const i = t ?? ((a = canvas.scene) == null ? void 0 : a.id);
  if (!i || !e) return;
  const r = game.users.get(e);
  r && (await r.unsetFlag(T, Si(i, n)), console.log(`[${T}] Cinematic: cleared seen flag for user ${r.name} on "${n}" scene ${i}.`));
}
c(Tb, "resetCinematicForUser");
async function Lb(t, e = "default") {
  var a;
  if (!game.user.isGM) return;
  const n = t ?? ((a = canvas.scene) == null ? void 0 : a.id);
  if (!n) return;
  const i = Si(n, e), r = game.users.map((o) => o.getFlag(T, i) ? o.unsetFlag(T, i) : Promise.resolve());
  await Promise.all(r), console.log(`[${T}] Cinematic: cleared seen flag for all users on "${e}" scene ${n}.`);
}
c(Lb, "resetCinematicForAll");
function Ib(t, e = "default") {
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
c(Ib, "getSeenStatus");
function Ob(t, e) {
  var i;
  const n = t ?? ((i = canvas.scene) == null ? void 0 : i.id);
  return e ? lo(n, e) != null : rs(n) != null;
}
c(Ob, "hasCinematic");
function Ab() {
  if (!yr || !br) {
    console.warn(`[${T}] Cinematic: no snapshot available for revert.`);
    return;
  }
  (Ee == null ? void 0 : Ee.status) === "running" && Ee.cancel("reverted"), Ee = null, on && (on.abort("reverted"), on = null);
  try {
    Le(yr, br), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 }), console.log(`[${T}] Cinematic: reverted to pre-cinematic state.`);
  } catch (t) {
    console.error(`[${T}] Cinematic: error during revert:`, t);
  }
  yr = null, br = null;
}
c(Ab, "revertCinematic");
async function kb() {
  const t = ++Ai;
  if (console.log(`[${T}] Cinematic: canvasReady fired, gen=${t}, game.ready=${game.ready}`), await wb(), t !== Ai) return;
  console.log(`[${T}] Cinematic: game is ready`);
  const e = canvas.scene;
  if (!e) {
    console.log(`[${T}] Cinematic: no canvas.scene, exiting`);
    return;
  }
  if (Qn && Qn.sceneId === e.id) {
    const a = Qn;
    Qn = null, console.log(`[${T}] Cinematic: picking up pending transition to "${a.cinematicName}" on scene ${e.id}`);
    try {
      await vr(e.id, a.cinematicName, a.visitedChain);
    } catch (o) {
      console.error(`[${T}] Cinematic: error during pending transition playback on scene ${e.id}:`, o);
    }
    return;
  }
  Qn = null;
  const n = rs(e.id);
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
    const o = dm(e.id, a);
    if (t !== Ai) return;
    if (o) {
      console.log(`[${T}] Cinematic "${a}": found saved progress at segment "${o.currentSegment}", resuming...`);
      try {
        await vr(e.id, a);
      } catch (s) {
        console.error(`[${T}] Cinematic "${a}": error during resumed playback on scene ${e.id}:`, s);
      }
      return;
    }
  }
  let r = null;
  for (const { name: a, data: o } of i)
    if (!(o.tracking !== !1 && Lu(e.id, a))) {
      r = { name: a, data: o };
      break;
    }
  if (!r) {
    if (console.log(`[${T}] Cinematic: all canvasReady cinematics already seen on scene ${e.id}`), Mb(e.id, i), (Ee == null ? void 0 : Ee.status) === "running" && Ee.cancel("already-seen"), Ee = null, await Jl(), t !== Ai) return;
    for (const { name: a, data: o } of i)
      try {
        const { targets: s } = to(o);
        co(o, s);
      } catch (s) {
        console.error(`[${T}] Cinematic "${a}": error applying landing states (already seen) on scene ${e.id}:`, s);
      }
    canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    return;
  }
  if (t === Ai && (console.log(`[${T}] Cinematic: playing first unseen cinematic "${r.name}"...`), await Jl(), t === Ai)) {
    for (const { name: a, data: o } of i) {
      if (a === r.name) continue;
      if (o.tracking !== !1 && Lu(e.id, a))
        try {
          const { targets: l } = to(o);
          co(o, l);
        } catch (l) {
          console.error(`[${T}] Cinematic "${a}": error applying landing states (already seen) on scene ${e.id}:`, l);
        }
    }
    try {
      await vr(e.id, r.name);
    } catch (a) {
      console.error(`[${T}] Cinematic "${r.name}": error during playback on scene ${e.id}:`, a);
    }
  }
}
c(kb, "onCanvasReady$2");
function Mb(t, e) {
  for (const { name: n } of e)
    Kl(t, n);
}
c(Mb, "clearAllCanvasReadyProgress");
function _b(t = 3e5) {
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
c(_b, "cleanupStaleProgressFlags");
function Nb() {
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
c(Nb, "registerEditorButton");
function $b() {
  Hooks.on("canvasReady", kb), Nb(), Hooks.once("ready", () => {
    _b();
    const t = game.modules.get(T);
    t.api || (t.api = {}), t.api.cinematic = {
      play: vr,
      reset: Cb,
      resetForUser: Tb,
      resetForAll: Lb,
      getSeenStatus: Ib,
      has: Ob,
      get: lo,
      list: vb,
      revert: Ab,
      onPlaybackProgress: pb,
      TileAnimator: Xi,
      registerBehaviour: be,
      getBehaviour: Wl,
      trigger: /* @__PURE__ */ c(async (e, n, i = "default") => {
        var o;
        const r = n ?? ((o = canvas.scene) == null ? void 0 : o.id);
        if (!r) return;
        const a = lo(r, i);
        a && (a.trigger && a.trigger !== e || await vr(r, i));
      }, "trigger")
    }, console.log(`[${T}] Cinematic API registered (v5).`);
  });
}
c($b, "registerCinematicHooks");
function Xl(t, e) {
  const n = Math.abs(t.width), i = Math.abs(t.height), r = n / 2, a = i / 2;
  let o = e.x - (t.x + r), s = e.y - (t.y + a);
  if (t.rotation !== 0) {
    const l = Math.toRadians(t.rotation), u = Math.cos(l), d = Math.sin(l), h = u * o + d * s, f = u * s - d * o;
    o = h, s = f;
  }
  return o += r, s += a, o >= 0 && o <= n && s >= 0 && s <= i;
}
c(Xl, "pointWithinTile");
es("tile-click", (t, e) => t.target ? new Promise((n, i) => {
  var g;
  if (e.signal.aborted) return i(e.signal.reason ?? "aborted");
  const r = ns(t.target);
  if (!((g = r == null ? void 0 : r.placeables) != null && g.length))
    return i(new Error(`await tile-click: no placeables found for "${t.target}"`));
  const a = r.placeables, o = [];
  for (const { placeable: p } of a) {
    const y = new Xi(p, t.animation);
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
    for (const { placeable: w, animator: E } of o)
      Xl(w.document, b) ? (v = !0, E.state !== "hover" && E.setState("hover")) : E.state === "hover" && E.setState("idle");
    v ? l === null && (l = document.body.style.cursor, document.body.style.cursor = "pointer") : l !== null && (document.body.style.cursor = l, l = null);
  }, "onPointerMove");
  s == null || s.addEventListener("pointermove", u);
  const d = /* @__PURE__ */ c((p) => {
    if (p.button !== 0) return;
    const y = canvas.activeLayer;
    if (!y) return;
    const b = y.toLocal(p);
    isNaN(b.x) || isNaN(b.y) || !a.filter(({ doc: w }) => Xl(w, b)).sort((w, E) => (E.doc.sort ?? 0) - (w.doc.sort ?? 0))[0] || (p.stopPropagation(), p.preventDefault(), f(), n());
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
$b();
function xb() {
  Hooks.once("ready", () => {
    const t = game.modules.get(T);
    t.api || (t.api = {}), t.api.picker = {
      /** Open the picker window. Returns Promise<string[] | null>. */
      open: /* @__PURE__ */ c((e) => so.open(e), "open"),
      /** Resolve a selector string to documents. */
      resolveSelector: ns,
      /** Parse a selector string into { type, value }. */
      parseSelector: bc,
      /** Build a selector string from { type, value }. */
      buildSelector: yy,
      /** Build a tag selector from tags array + mode. */
      buildTagSelector: Mf,
      /** Canvas highlight utilities. */
      highlight: {
        add: oo,
        remove: Ji,
        has: jf,
        clearAll: $a
      }
    }, console.log(`[${T}] Placeable Picker API registered.`);
  });
}
c(xb, "registerPlaceablePickerHooks");
xb();
const Ql = "eidolon-utilities", Fb = "idle-animation", Qi = /* @__PURE__ */ new Map();
function Db(t) {
  return typeof t.attribute == "string" && typeof t.from == "number" && typeof t.to == "number" && typeof t.period == "number" && t.period > 0;
}
c(Db, "isValidTilePropConfig");
function Pb(t) {
  return typeof t.fromColor == "string" && typeof t.toColor == "string" && typeof t.period == "number" && t.period > 0;
}
c(Pb, "isValidTileTintConfig");
function Rb(t) {
  return typeof t.fromScale == "number" && typeof t.toScale == "number" && t.fromScale > 0 && t.toScale > 0 && typeof t.period == "number" && t.period > 0;
}
c(Rb, "isValidTileScaleConfig");
function Iu(t) {
  if (!t || typeof t != "object") return !1;
  const e = t.type ?? "tile-prop";
  return e === "tile-tint" ? Pb(t) : e === "tile-scale" ? Rb(t) : Db(t);
}
c(Iu, "isValidConfig");
function Ec(t) {
  var i;
  const e = (i = t == null ? void 0 : t.getFlag) == null ? void 0 : i.call(t, Ql, Fb);
  if (!e) return [];
  let n;
  if (Array.isArray(e))
    n = e;
  else if (typeof e == "object" && "0" in e)
    n = Object.values(e);
  else return typeof e == "object" && Iu(e) ? [e] : [];
  return n.filter(Iu);
}
c(Ec, "getIdleAnimationConfigs");
function Hb(t, e) {
  const n = e.type ?? "tile-prop";
  return n === "tile-tint" ? `${t}::tint` : n === "tile-scale" ? `${t}::scale` : `${t}::${e.attribute}`;
}
c(Hb, "loopKey");
function Ou(t, e, n, i) {
  return e.type === "tile-tint" ? { uuid: t, toColor: n ? e.toColor : e.fromColor, mode: e.mode } : e.type === "tile-scale" ? {
    uuid: t,
    toScale: n ? e.toScale : e.fromScale,
    ...i
  } : { uuid: t, attribute: e.attribute, value: n ? e.to : e.from };
}
c(Ou, "buildExecuteParams");
function qb(t, e) {
  var g, p;
  const n = t == null ? void 0 : t.document;
  if (!n) return;
  const i = n.id, r = Hb(i, e);
  Sc(r);
  const a = e.type ?? "tile-prop", o = Ti(a);
  if (!o) {
    console.warn(`[${Ql}] idle-animation: unknown tween type "${a}"`);
    return;
  }
  const s = new AbortController();
  let l, u = null;
  if (a === "tile-tint") {
    const y = ((p = (g = n._source) == null ? void 0 : g.texture) == null ? void 0 : p.tint) ?? "#ffffff";
    l = /* @__PURE__ */ c(() => {
      var v, w, E;
      const b = (w = (v = canvas.scene) == null ? void 0 : v.tiles) == null ? void 0 : w.get(i);
      b && (b.updateSource({ texture: { tint: y } }), (E = b.object) == null || E.refresh());
    }, "restore"), n.updateSource({ texture: { tint: e.fromColor } }), t.refresh();
  } else if (a === "tile-scale") {
    const y = n._source.width, b = n._source.height, v = n._source.x, w = n._source.y;
    u = {
      baseWidth: y,
      baseHeight: b,
      centerX: v + y / 2,
      centerY: w + b / 2
    }, l = /* @__PURE__ */ c(() => {
      var x, R, D;
      const M = (R = (x = canvas.scene) == null ? void 0 : x.tiles) == null ? void 0 : R.get(i);
      M && (M.updateSource({ width: y, height: b, x: v, y: w }), (D = M.object) == null || D.refresh());
    }, "restore");
    const E = y * e.fromScale, L = b * e.fromScale, A = u.centerX - E / 2, O = u.centerY - L / 2;
    n.updateSource({ width: E, height: L, x: A, y: O }), t.refresh();
  } else {
    const y = foundry.utils.getProperty(n._source, e.attribute);
    if (typeof y != "number") {
      console.warn(`[${Ql}] idle-animation: attribute "${e.attribute}" is not a number on tile ${i}`);
      return;
    }
    l = /* @__PURE__ */ c(() => {
      var v, w, E;
      const b = (w = (v = canvas.scene) == null ? void 0 : v.tiles) == null ? void 0 : w.get(i);
      b && (b.updateSource(foundry.utils.expandObject({ [e.attribute]: y })), (E = b.object) == null || E.refresh());
    }, "restore"), n.updateSource(foundry.utils.expandObject({ [e.attribute]: e.from })), t.refresh();
  }
  Qi.set(r, { controller: s, restore: l });
  const d = n.uuid, h = e.period / 2, f = e.easing ?? "easeInOutCosine";
  (async () => {
    const { signal: y } = s;
    for (; !y.aborted && !(await o.execute(
      Ou(d, e, !0, u),
      { durationMS: h, easing: f, commit: !1, signal: y }
    ) === !1 || y.aborted || await o.execute(
      Ou(d, e, !1, u),
      { durationMS: h, easing: f, commit: !1, signal: y }
    ) === !1 || y.aborted); )
      ;
  })();
}
c(qb, "startLoop");
function Sc(t) {
  const e = Qi.get(t);
  e && (e.controller.abort(), Qi.delete(t), e.restore());
}
c(Sc, "stopLoopByKey");
function kr(t) {
  const e = `${t}::`;
  for (const n of [...Qi.keys()])
    n.startsWith(e) && Sc(n);
}
c(kr, "stopLoopsForTile");
function Cc(t, e) {
  if (t != null && t.document) {
    kr(t.document.id);
    for (const n of e)
      qb(t, n);
  }
}
c(Cc, "startAllLoops");
function jb() {
  for (const t of [...Qi.keys()])
    Sc(t);
}
c(jb, "stopAllLoops");
function Au(t) {
  const e = `${t}::`;
  for (const n of Qi.keys())
    if (n.startsWith(e)) return !0;
  return !1;
}
c(Au, "isLooping");
function Ot(t, e, n) {
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
c(Ot, "buildSelectGroup");
function At(t, e, n, i = {}) {
  const r = document.createElement("div");
  r.classList.add("form-group");
  const a = document.createElement("label");
  a.textContent = t;
  const o = document.createElement("input");
  o.type = "number", o.classList.add(e), o.value = String(n);
  for (const [s, l] of Object.entries(i)) o.setAttribute(s, l);
  return r.append(a, o), r;
}
c(At, "buildNumberGroup");
function Mr(t, e, n) {
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
c(Mr, "buildColorGroup");
let oe = null;
function Is() {
  for (const t of document.querySelectorAll(".idle-anim__slot--insert-before, .idle-anim__slot--insert-after"))
    t.classList.remove("idle-anim__slot--insert-before", "idle-anim__slot--insert-after");
}
c(Is, "clearInsertIndicators");
function ku(t) {
  for (const e of document.querySelectorAll(".idle-anim__slots"))
    e.classList.toggle("idle-anim__slots--drag-active", t);
}
c(ku, "setDragActive");
function uo(t, e) {
  t.dispatchEvent(new CustomEvent("slot-reorder", { detail: { card: e } }));
}
c(uo, "notifyReorder");
function Tc(t, { dropGroup: e, handleSelector: n = ".idle-anim__slot-header" }) {
  t.setAttribute("draggable", "true");
  let i = !1;
  t.addEventListener("pointerdown", (r) => {
    i = !!r.target.closest(n);
  }), t.addEventListener("dragstart", (r) => {
    if (!i) {
      r.preventDefault();
      return;
    }
    oe = { card: t, sourceContainer: t.parentElement, group: e, insertMode: null, insertTarget: null }, t.classList.add("is-dragging"), ku(!0), r.dataTransfer.effectAllowed = "move", r.dataTransfer.setData("text/plain", "");
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
    oe.insertMode === "after" ? s.insertBefore(a, t.nextSibling) : s.insertBefore(a, t), uo(s, a), o !== s && uo(o, a), oe = null;
  }), t.addEventListener("dragend", () => {
    t.classList.remove("is-dragging"), Is(), ku(!1);
    for (const r of document.querySelectorAll(".idle-anim__slots--drag-over"))
      r.classList.remove("idle-anim__slots--drag-over");
    oe = null;
  });
}
c(Tc, "makeDraggable");
function Fa(t, { dropGroup: e, onDrop: n }) {
  t.addEventListener("dragover", (i) => {
    !oe || oe.group !== e || (i.preventDefault(), i.dataTransfer.dropEffect = "move");
  }), t.addEventListener("dragenter", (i) => {
    !oe || oe.group !== e || (i.preventDefault(), t.classList.add("idle-anim__slots--drag-over"));
  }), t.addEventListener("dragleave", (i) => {
    i.relatedTarget && t.contains(i.relatedTarget) || t.classList.remove("idle-anim__slots--drag-over");
  }), t.addEventListener("drop", (i) => {
    if (i.preventDefault(), t.classList.remove("idle-anim__slots--drag-over"), !oe || oe.group !== e) return;
    const r = oe.card, a = oe.sourceContainer;
    t.appendChild(r), uo(t, r), a !== t && uo(a, r), oe = null;
  }), t.addEventListener("slot-reorder", (i) => {
    n == null || n(i.detail.card, t);
  });
}
c(Fa, "makeDropContainer");
const Mu = "eidolon-utilities", _u = "idle-animation", Bb = "eidolon-idle-animation", Ub = "fa-solid fa-wave-pulse", Lc = [
  { value: "alpha", label: "Alpha (Opacity)", from: 0.85, to: 1, step: "0.01" },
  { value: "rotation", label: "Rotation", from: -5, to: 5, step: "1" },
  { value: "texture.rotation", label: "Texture Rotation", from: -5, to: 5, step: "1" }
], wr = {
  type: "tile-prop",
  attribute: "alpha",
  from: 0.85,
  to: 1,
  period: 1500,
  easing: "easeInOutCosine"
}, Zn = {
  fromColor: "#ffffff",
  toColor: "#ffcc88",
  mode: "oklch",
  period: 3e3
}, Os = {
  fromScale: 0.95,
  toScale: 1.05
};
function Nu(t, e) {
  const n = Lc.find((r) => r.value === t);
  if (n && n.from !== null) return { from: n.from, to: n.to, step: n.step };
  const i = foundry.utils.getProperty((e == null ? void 0 : e._source) ?? {}, t);
  return typeof i == "number" && i > 0 ? { from: Math.round(i * 0.95), to: Math.round(i * 1.05), step: "1" } : { from: 0, to: 100, step: "1" };
}
c(Nu, "getAttributeDefaults");
function Vb(t) {
  var e;
  return (t == null ? void 0 : t.document) ?? ((e = t == null ? void 0 : t.object) == null ? void 0 : e.document) ?? (t == null ? void 0 : t.object) ?? null;
}
c(Vb, "getTileDocument$1");
function $u(t) {
  if (!t) return "";
  const e = t.type ?? "tile-prop";
  if (e === "tile-tint")
    return `Tint ${t.fromColor ?? "?"} → ${t.toColor ?? "?"} (${t.period ?? "?"}ms)`;
  if (e === "tile-scale") {
    const r = t.fromScale != null ? `${Math.round(t.fromScale * 100)}%` : "?", a = t.toScale != null ? `${Math.round(t.toScale * 100)}%` : "?";
    return `Scale ${r} → ${a} (${t.period ?? "?"}ms)`;
  }
  const n = Lc.find((r) => r.value === t.attribute);
  return `${(n == null ? void 0 : n.label) ?? t.attribute ?? "?"} ${t.from ?? "?"} → ${t.to ?? "?"} (${t.period ?? "?"}ms)`;
}
c($u, "summarizeConfig");
function xu(t, e, n) {
  const i = e.type ?? "tile-prop", r = Xo(), a = document.createElement("div");
  a.classList.add("idle-anim__slot", "is-collapsed"), a.dataset.index = String(n);
  const o = document.createElement("div");
  o.classList.add("idle-anim__slot-header");
  const s = document.createElement("i");
  s.classList.add("fa-solid", "fa-chevron-right", "idle-anim__slot-chevron");
  const l = document.createElement("span");
  l.classList.add("idle-anim__slot-title"), l.textContent = `Animation ${n + 1}`;
  const u = document.createElement("span");
  u.classList.add("idle-anim__slot-summary"), u.textContent = $u(e);
  const d = document.createElement("button");
  d.type = "button", d.classList.add("idle-anim__slot-remove"), d.innerHTML = '<i class="fa-solid fa-xmark"></i>', d.title = "Remove animation", o.append(s, l, u, d), a.appendChild(o);
  const h = document.createElement("div");
  h.classList.add("idle-anim__slot-body");
  const f = Ot("Type", "idle-anim__type", [
    { value: "tile-prop", label: "Numeric", selected: i === "tile-prop" || i !== "tile-tint" && i !== "tile-scale" },
    { value: "tile-tint", label: "Tint", selected: i === "tile-tint" },
    { value: "tile-scale", label: "Scale", selected: i === "tile-scale" }
  ]);
  h.appendChild(f);
  const g = document.createElement("div");
  g.classList.add("idle-anim__type-fields"), h.appendChild(g);
  function p(w, E) {
    if (g.innerHTML = "", w === "tile-tint") {
      const L = Yi(), A = E.fromColor ?? Zn.fromColor, O = E.toColor ?? Zn.toColor, M = E.mode ?? Zn.mode, x = document.createElement("div");
      x.classList.add("idle-anim__range-row"), x.appendChild(Mr("From", "idle-anim__from-color", A)), x.appendChild(Mr("To", "idle-anim__to-color", O)), g.appendChild(x), g.appendChild(Ot(
        "Mode",
        "idle-anim__mode",
        L.map((R) => ({ value: R, label: R, selected: R === M }))
      ));
    } else if (w === "tile-scale") {
      const L = E.fromScale ?? Os.fromScale, A = E.toScale ?? Os.toScale, O = document.createElement("div");
      O.classList.add("idle-anim__range-row"), O.appendChild(At("From", "idle-anim__from-scale", L, { step: "0.01", min: "0.01" })), O.appendChild(At("To", "idle-anim__to-scale", A, { step: "0.01", min: "0.01" })), g.appendChild(O);
      const M = document.createElement("p");
      M.classList.add("idle-anim__hint"), M.textContent = "1.0 = original size. Scales from center.", g.appendChild(M);
    } else {
      const L = E.attribute ?? wr.attribute, A = Nu(L, t), O = E.from ?? A.from, M = E.to ?? A.to, x = A.step;
      g.appendChild(Ot(
        "Attribute",
        "idle-anim__attribute",
        Lc.map((F) => ({ value: F.value, label: F.label, selected: F.value === L }))
      ));
      const R = document.createElement("div");
      R.classList.add("idle-anim__range-row"), R.appendChild(At("From", "idle-anim__from", O, { step: x })), R.appendChild(At("To", "idle-anim__to", M, { step: x })), g.appendChild(R);
      const D = g.querySelector(".idle-anim__attribute");
      D == null || D.addEventListener("change", () => {
        const F = Nu(D.value, t), N = g.querySelector(".idle-anim__from"), H = g.querySelector(".idle-anim__to");
        N && (N.value = String(F.from), N.step = F.step), H && (H.value = String(F.to), H.step = F.step);
      });
    }
  }
  c(p, "renderTypeFields"), p(i, e);
  const y = e.period ?? (i === "tile-tint" ? Zn.period : wr.period), b = e.easing ?? "easeInOutCosine";
  h.appendChild(At("Period (ms)", "idle-anim__period", y, { min: "100", step: "100" })), h.appendChild(Ot(
    "Easing",
    "idle-anim__easing",
    r.map((w) => ({ value: w, label: w, selected: w === b }))
  )), a.appendChild(h);
  const v = a.querySelector(".idle-anim__type");
  return v == null || v.addEventListener("change", () => {
    const w = v.value;
    p(w, w === "tile-tint" ? Zn : w === "tile-scale" ? Os : wr);
  }), o.addEventListener("click", (w) => {
    if (!w.target.closest(".idle-anim__slot-remove") && (a.classList.toggle("is-collapsed"), a.classList.contains("is-collapsed"))) {
      const E = hm(a);
      E && (u.textContent = $u(E));
    }
  }), d.addEventListener("click", (w) => {
    w.stopPropagation();
    const E = a.parentElement;
    a.remove(), E && mm(E);
  }), Tc(a, { dropGroup: "idle-anim" }), a;
}
c(xu, "buildSlot");
function mm(t) {
  t.querySelectorAll(".idle-anim__slot").forEach((n, i) => {
    n.dataset.index = String(i);
    const r = n.querySelector(".idle-anim__slot-title");
    r && (r.textContent = `Animation ${i + 1}`);
  });
}
c(mm, "renumberSlots$1");
function Gb(t) {
  const e = Ec(t), n = document.createElement("section");
  n.classList.add("eidolon-idle-animation");
  const i = document.createElement("div");
  i.classList.add("idle-anim__slots");
  for (let s = 0; s < e.length; s++)
    i.appendChild(xu(t, e[s], s));
  n.appendChild(i), Fa(i, {
    dropGroup: "idle-anim",
    onDrop() {
      mm(i);
    }
  });
  const r = document.createElement("button");
  r.type = "button", r.classList.add("idle-anim__add"), r.innerHTML = '<i class="fa-solid fa-plus"></i> Add Animation', r.addEventListener("click", () => {
    const s = i.querySelectorAll(".idle-anim__slot").length, l = xu(t, wr, s);
    l.classList.remove("is-collapsed"), i.appendChild(l);
  }), n.appendChild(r);
  const a = document.createElement("div");
  a.classList.add("idle-anim__actions");
  const o = document.createElement("button");
  return o.type = "button", o.classList.add("idle-anim__preview"), o.innerHTML = '<i class="fa-solid fa-play"></i> Preview All', a.append(o), n.appendChild(a), n;
}
c(Gb, "buildTabContent");
function hm(t) {
  var l, u, d, h, f, g, p, y, b, v, w, E;
  const e = t.querySelector(".idle-anim__type"), n = (e == null ? void 0 : e.value) ?? "tile-prop", i = Number.parseInt((l = t.querySelector(".idle-anim__period")) == null ? void 0 : l.value, 10), r = ((u = t.querySelector(".idle-anim__easing")) == null ? void 0 : u.value) ?? "easeInOutCosine";
  if (!i || i <= 0) return null;
  if (n === "tile-tint") {
    const L = ((d = t.querySelector(".idle-anim__from-color")) == null ? void 0 : d.value) ?? ((h = t.querySelector(".idle-anim__from-color-text")) == null ? void 0 : h.value) ?? Zn.fromColor, A = ((f = t.querySelector(".idle-anim__to-color")) == null ? void 0 : f.value) ?? ((g = t.querySelector(".idle-anim__to-color-text")) == null ? void 0 : g.value) ?? Zn.toColor, O = ((p = t.querySelector(".idle-anim__mode")) == null ? void 0 : p.value) ?? "oklch";
    return { type: "tile-tint", fromColor: L, toColor: A, mode: O, period: i, easing: r };
  }
  if (n === "tile-scale") {
    const L = Number.parseFloat((y = t.querySelector(".idle-anim__from-scale")) == null ? void 0 : y.value), A = Number.parseFloat((b = t.querySelector(".idle-anim__to-scale")) == null ? void 0 : b.value);
    return Number.isNaN(L) || Number.isNaN(A) || L <= 0 || A <= 0 ? null : { type: "tile-scale", fromScale: L, toScale: A, period: i, easing: r };
  }
  const a = ((v = t.querySelector(".idle-anim__attribute")) == null ? void 0 : v.value) ?? wr.attribute, o = Number.parseFloat((w = t.querySelector(".idle-anim__from")) == null ? void 0 : w.value), s = Number.parseFloat((E = t.querySelector(".idle-anim__to")) == null ? void 0 : E.value);
  return Number.isNaN(o) || Number.isNaN(s) ? null : { type: "tile-prop", attribute: a, from: o, to: s, period: i, easing: r };
}
c(hm, "readSlotConfig");
function Fu(t) {
  const e = t.querySelectorAll(".idle-anim__slot"), n = [];
  for (const i of e) {
    const r = hm(i);
    r && n.push(r);
  }
  return n;
}
c(Fu, "readAllFormValues");
function zb(t, e) {
  var s;
  const n = $t(e);
  if (!n) return;
  const i = Vb(t);
  if (!i) return;
  const r = mc(t, n, Bb, "Animations", Ub);
  if (!r || r.querySelector(".eidolon-idle-animation")) return;
  const a = r.closest("form");
  a && (a.noValidate = !0), r.appendChild(Gb(i)), (s = t.setPosition) == null || s.call(t, { height: "auto" });
  const o = r.querySelector(".idle-anim__preview");
  o == null || o.addEventListener("click", () => {
    const l = i.object;
    if (!l) return;
    if (Au(i.id)) {
      kr(i.id), o.classList.remove("is-active"), o.innerHTML = '<i class="fa-solid fa-play"></i> Preview All';
      return;
    }
    const u = Fu(r);
    u.length !== 0 && (Cc(l, u), o.classList.add("is-active"), o.innerHTML = '<i class="fa-solid fa-stop"></i> Stop');
  }), a && a.addEventListener("submit", () => {
    Au(i.id) && kr(i.id);
    const l = Fu(r);
    i.update({ [`flags.${Mu}.-=${_u}`]: null }).then(() => {
      if (l.length > 0)
        return i.update({ [`flags.${Mu}.${_u}`]: l });
    });
  });
}
c(zb, "renderAnimationTab");
const Wb = "eidolon-utilities", Du = "idle-animation";
function Yb() {
  var e;
  jb();
  const t = (e = canvas.tiles) == null ? void 0 : e.placeables;
  if (Array.isArray(t))
    for (const n of t) {
      const i = Ec(n.document);
      i.length > 0 && Cc(n, i);
    }
}
c(Yb, "onCanvasReady$1");
function Kb(t, e) {
  var r;
  const n = (r = e == null ? void 0 : e.flags) == null ? void 0 : r[Wb];
  if (!n || !(Du in n || `-=${Du}` in n)) return;
  const i = Ec(t);
  i.length > 0 && t.object ? Cc(t.object, i) : kr(t.id);
}
c(Kb, "onUpdateTile$1");
function Jb(t) {
  kr(t.id);
}
c(Jb, "onDeleteTile$1");
function Xb(t, e) {
  zb(t, e);
}
c(Xb, "onRenderTileConfig$1");
function Qb() {
  Hooks.on("canvasReady", Yb), Hooks.on("updateTile", Kb), Hooks.on("deleteTile", Jb), Hooks.on("renderTileConfig", Xb);
}
c(Qb, "registerIdleAnimationHooks");
Qb();
const gm = "eidolon-utilities", Zb = "tile-interactions", fn = /* @__PURE__ */ new Map(), Ci = /* @__PURE__ */ new Map(), Pu = /* @__PURE__ */ new WeakMap(), Er = /* @__PURE__ */ new Set();
let Dn = null, kt = null, Mt = null, Gt = null;
function pm(t) {
  if (!t) return null;
  if (!Array.isArray(t) && typeof t == "object") {
    const e = Array.isArray(t.idle) && t.idle.length ? t.idle : null, n = Array.isArray(t.enter) && t.enter.length ? t.enter : null;
    return !e && !n ? null : { idle: e, enter: n };
  }
  return Array.isArray(t) && t.length ? { idle: null, enter: t } : null;
}
c(pm, "parseHoverConfig");
function ym(t) {
  var e;
  return ((e = t == null ? void 0 : t.getFlag) == null ? void 0 : e.call(t, gm, Zb)) ?? null;
}
c(ym, "getInteractionFlag");
function bm(t) {
  const e = canvas.activeLayer;
  if (!e) return null;
  const n = e.toLocal(t);
  return !n || Number.isNaN(n.x) || Number.isNaN(n.y) ? null : n;
}
c(bm, "canvasToLocal");
function vm(t) {
  let e = null, n = -1 / 0;
  for (const [i, r] of fn)
    if (Xl(r.doc, t)) {
      const a = r.doc.sort ?? 0;
      a > n && (e = r, n = a);
    }
  return e;
}
c(vm, "hitTest");
function ev(t) {
  return {
    idle: t.idle ?? ["none"],
    hover: t.enter ?? ["none"]
  };
}
c(ev, "buildAnimatorConfig");
function Ic(t, e, n) {
  ta(t);
  const i = ev(n), r = new Xi(e, i);
  r.start("idle"), Ci.set(t, r);
}
c(Ic, "startHoverAnimator");
function ta(t) {
  const e = Ci.get(t);
  e && (e.detach(), Ci.delete(t));
}
c(ta, "stopHoverAnimator");
function As(t, e, n, i) {
  return e.type === "tile-tint" ? { uuid: t, toColor: n ? e.toColor : e.fromColor, mode: e.mode } : e.type === "tile-scale" ? {
    uuid: t,
    toScale: n ? e.toScale : e.fromScale,
    ...i
  } : { uuid: t, attribute: e.attribute, value: n ? e.to : e.from };
}
c(As, "buildClickParams");
function tv(t) {
  const e = t._source.width, n = t._source.height, i = t._source.x, r = t._source.y;
  return {
    baseWidth: e,
    baseHeight: n,
    centerX: i + e / 2,
    centerY: r + n / 2
  };
}
c(tv, "captureRefGeometry");
async function nv(t, e) {
  const n = t.uuid, i = e.type ?? "tile-prop", r = Ti(i);
  if (!r) {
    console.warn(`[${gm}] tile-interactions: unknown tween type "${i}"`);
    return;
  }
  const a = e.period ?? 300, o = e.easing ?? "easeOutCubic", s = e.mode ?? "bounce", l = i === "tile-scale" ? tv(t) : null;
  if (s === "toggle") {
    const d = !(Pu.get(t) ?? !1);
    await r.execute(
      As(n, e, d, l),
      { durationMS: a, easing: o, commit: !0 }
    ), Pu.set(t, d);
  } else {
    const u = a / 2;
    await r.execute(
      As(n, e, !0, l),
      { durationMS: u, easing: o, commit: !1 }
    ), await r.execute(
      As(n, e, !1, l),
      { durationMS: u, easing: o, commit: !1 }
    );
  }
}
c(nv, "playClickAnimation");
async function iv(t) {
  var n;
  const e = t.doc.id;
  if (!Er.has(e)) {
    Er.add(e);
    try {
      ta(e);
      const i = t.clickConfig.map((r) => nv(t.doc, r));
      await Promise.all(i);
    } finally {
      Er.delete(e), t.hoverConfig && (Ic(e, t.placeable, t.hoverConfig), Dn === e && ((n = Ci.get(e)) == null || n.setState("hover")));
    }
  }
}
c(iv, "handleClick");
function wm(t) {
  var r;
  const e = bm(t);
  if (!e) return;
  const n = vm(e), i = (n == null ? void 0 : n.doc.id) ?? null;
  if (i !== Dn) {
    if (Dn) {
      const a = Ci.get(Dn);
      a && a.setState("idle");
    }
    if (i) {
      const a = Ci.get(i);
      a && a.setState("hover");
    }
    Dn = i, i && (n.hoverConfig || (r = n.clickConfig) != null && r.length) ? (kt === null && (kt = document.body.style.cursor), document.body.style.cursor = "pointer") : kt !== null && (document.body.style.cursor = kt, kt = null);
  }
}
c(wm, "onPointerMove");
function Em(t) {
  var i;
  if (t.button !== 0) return;
  const e = bm(t);
  if (!e) return;
  const n = vm(e);
  !n || !((i = n.clickConfig) != null && i.length) || iv(n);
}
c(Em, "onPointerDown");
function rv() {
  var n;
  for (const i of Ci.keys())
    ta(i);
  fn.clear(), Er.clear(), Dn = null, kt !== null && (document.body.style.cursor = kt, kt = null);
  const t = document.getElementById("board");
  Mt && (t == null || t.removeEventListener("pointermove", Mt), Mt = null), Gt && (t == null || t.removeEventListener("pointerdown", Gt), Gt = null);
  const e = (n = canvas.tiles) == null ? void 0 : n.placeables;
  if (Array.isArray(e)) {
    for (const i of e) {
      const r = i.document, a = ym(r);
      if (!a) continue;
      const o = pm(a.hover), s = Array.isArray(a.click) && a.click.length ? a.click : null;
      !o && !s || (fn.set(r.id, { doc: r, placeable: i, hoverConfig: o, clickConfig: s }), o && Ic(r.id, i, o));
    }
    fn.size !== 0 && (Mt = wm, Gt = Em, t == null || t.addEventListener("pointermove", Mt), t == null || t.addEventListener("pointerdown", Gt));
  }
}
c(rv, "rebuild");
function av(t) {
  const e = t.id, n = ym(t), i = n ? pm(n.hover) : null, r = n && Array.isArray(n.click) && n.click.length ? n.click : null;
  if (!i && !r) {
    Sm(t);
    return;
  }
  ta(e);
  const a = t.object;
  if (!a) {
    fn.delete(e);
    return;
  }
  fn.set(e, { doc: t, placeable: a, hoverConfig: i, clickConfig: r }), i && Ic(e, a, i), ov();
}
c(av, "updateTile");
function Sm(t) {
  const e = t.id;
  if (ta(e), fn.delete(e), Er.delete(e), Dn === e && (Dn = null, kt !== null && (document.body.style.cursor = kt, kt = null)), fn.size === 0) {
    const n = document.getElementById("board");
    Mt && (n == null || n.removeEventListener("pointermove", Mt), Mt = null), Gt && (n == null || n.removeEventListener("pointerdown", Gt), Gt = null);
  }
}
c(Sm, "removeTile");
function ov() {
  if (fn.size === 0 || Mt) return;
  const t = document.getElementById("board");
  t && (Mt = wm, Gt = Em, t.addEventListener("pointermove", Mt), t.addEventListener("pointerdown", Gt));
}
c(ov, "ensureListeners");
const Zl = "eidolon-utilities", ec = "tile-interactions", sv = "eidolon-idle-animation", lv = "fa-solid fa-wave-pulse", Cm = [
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
], Tm = {
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
}, _i = {
  attribute: "alpha",
  from: 1,
  to: 0.5,
  period: 300,
  mode: "bounce"
}, Di = {
  fromColor: "#ffffff",
  toColor: "#ffaa00",
  period: 500,
  mode: "bounce"
}, Da = {
  type: "tile-scale",
  fromScale: 1,
  toScale: 1.2,
  period: 300,
  easing: "easeOutCubic",
  mode: "bounce"
}, Lm = [
  { value: "alpha", label: "Alpha (Opacity)" },
  { value: "rotation", label: "Rotation" },
  { value: "texture.rotation", label: "Texture Rotation" }
];
function cv(t) {
  var e;
  return (t == null ? void 0 : t.document) ?? ((e = t == null ? void 0 : t.object) == null ? void 0 : e.document) ?? (t == null ? void 0 : t.object) ?? null;
}
c(cv, "getTileDocument");
function uv(t) {
  var r;
  const e = (r = t == null ? void 0 : t.getFlag) == null ? void 0 : r.call(t, Zl, ec);
  if (!e) return { hoverIdle: [], hoverEnter: [], click: [] };
  let n = [], i = [];
  return e.hover && (Array.isArray(e.hover) ? i = e.hover : typeof e.hover == "object" && (n = Array.isArray(e.hover.idle) ? e.hover.idle : [], i = Array.isArray(e.hover.enter) ? e.hover.enter : [])), {
    hoverIdle: n,
    hoverEnter: i,
    click: Array.isArray(e.click) ? e.click : []
  };
}
c(uv, "getInteractionConfigs");
function Ru(t) {
  if (!t) return "";
  const e = t.name ?? "float", n = Cm.find((i) => i.value === e);
  return (n == null ? void 0 : n.label) ?? e;
}
c(Ru, "summarizeHoverConfig");
function pa(t, e, n, i) {
  const r = t.name ?? "float", a = Xo(), o = document.createElement("div");
  o.classList.add("idle-anim__slot", "is-collapsed", n), o.dataset.index = String(e);
  const s = document.createElement("div");
  s.classList.add("idle-anim__slot-header");
  const l = document.createElement("i");
  l.classList.add("fa-solid", "fa-chevron-right", "idle-anim__slot-chevron");
  const u = document.createElement("span");
  u.classList.add("idle-anim__slot-title"), u.textContent = `${i} ${e + 1}`;
  const d = document.createElement("span");
  d.classList.add("idle-anim__slot-summary"), d.textContent = Ru(t);
  const h = document.createElement("button");
  h.type = "button", h.classList.add("idle-anim__slot-remove"), h.innerHTML = '<i class="fa-solid fa-xmark"></i>', h.title = "Remove effect", s.append(l, u, d, h), o.appendChild(s);
  const f = document.createElement("div");
  f.classList.add("idle-anim__slot-body");
  const g = Ot(
    "Behaviour",
    "ti-hover__behaviour",
    Cm.map((v) => ({ value: v.value, label: v.label, selected: v.value === r }))
  );
  f.appendChild(g);
  const p = document.createElement("div");
  p.classList.add("idle-anim__type-fields"), f.appendChild(p);
  function y(v, w) {
    p.innerHTML = "";
    const E = Tm[v];
    if (E)
      for (const L of E) {
        const A = w[L.key] ?? L.default;
        L.type === "color" ? p.appendChild(Mr(L.label, `ti-hover__${L.key}`, A)) : L.type === "select" && L.key === "easing" ? p.appendChild(Ot(
          L.label,
          `ti-hover__${L.key}`,
          a.map((O) => ({ value: O, label: O, selected: O === A }))
        )) : p.appendChild(At(L.label, `ti-hover__${L.key}`, A, L.attrs ?? {}));
      }
  }
  c(y, "renderParams"), y(r, t), o.appendChild(f);
  const b = o.querySelector(".ti-hover__behaviour");
  return b == null || b.addEventListener("change", () => {
    y(b.value, {});
  }), s.addEventListener("click", (v) => {
    if (!v.target.closest(".idle-anim__slot-remove") && (o.classList.toggle("is-collapsed"), o.classList.contains("is-collapsed"))) {
      const w = Im(o);
      w && (d.textContent = Ru(w));
    }
  }), h.addEventListener("click", (v) => {
    v.stopPropagation();
    const w = o.parentElement;
    o.remove(), w && Sr(w, n, i);
  }), Tc(o, { dropGroup: "hover" }), o;
}
c(pa, "buildHoverSlot");
function Im(t) {
  var r;
  const e = ((r = t.querySelector(".ti-hover__behaviour")) == null ? void 0 : r.value) ?? "float", n = Tm[e], i = { name: e };
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
c(Im, "readHoverSlot");
function Hu(t) {
  if (!t) return "";
  const e = t.type ?? "tile-prop", n = t.mode ?? "bounce", i = n.charAt(0).toUpperCase() + n.slice(1);
  if (e === "tile-tint")
    return `${i} Tint ${t.fromColor ?? "?"} → ${t.toColor ?? "?"} (${t.period ?? "?"}ms)`;
  if (e === "tile-scale") {
    const o = t.fromScale != null ? `${Math.round(t.fromScale * 100)}%` : "?", s = t.toScale != null ? `${Math.round(t.toScale * 100)}%` : "?";
    return `${i} Scale ${o} → ${s} (${t.period ?? "?"}ms)`;
  }
  const r = Lm.find((o) => o.value === t.attribute), a = (r == null ? void 0 : r.label) ?? t.attribute ?? "?";
  return `${i} ${a} ${t.from ?? "?"} → ${t.to ?? "?"} (${t.period ?? "?"}ms)`;
}
c(Hu, "summarizeClickConfig");
function qu(t, e) {
  const n = t.type ?? "tile-prop", i = t.mode ?? "bounce", r = Xo(), a = document.createElement("div");
  a.classList.add("idle-anim__slot", "is-collapsed", "ti-click-slot"), a.dataset.index = String(e);
  const o = document.createElement("div");
  o.classList.add("idle-anim__slot-header");
  const s = document.createElement("i");
  s.classList.add("fa-solid", "fa-chevron-right", "idle-anim__slot-chevron");
  const l = document.createElement("span");
  l.classList.add("idle-anim__slot-title"), l.textContent = `Animation ${e + 1}`;
  const u = document.createElement("span");
  u.classList.add("idle-anim__slot-summary"), u.textContent = Hu(t);
  const d = document.createElement("button");
  d.type = "button", d.classList.add("idle-anim__slot-remove"), d.innerHTML = '<i class="fa-solid fa-xmark"></i>', d.title = "Remove animation", o.append(s, l, u, d), a.appendChild(o);
  const h = document.createElement("div");
  h.classList.add("idle-anim__slot-body");
  const f = document.createElement("div");
  f.classList.add("idle-anim__range-row"), f.appendChild(Ot("Mode", "ti-click__mode", [
    { value: "bounce", label: "Bounce", selected: i === "bounce" },
    { value: "toggle", label: "Toggle", selected: i === "toggle" }
  ])), f.appendChild(Ot("Type", "ti-click__type", [
    { value: "tile-prop", label: "Numeric", selected: n === "tile-prop" },
    { value: "tile-tint", label: "Tint", selected: n === "tile-tint" },
    { value: "tile-scale", label: "Scale", selected: n === "tile-scale" }
  ])), h.appendChild(f);
  const g = document.createElement("div");
  g.classList.add("idle-anim__type-fields"), h.appendChild(g);
  function p(w, E) {
    if (g.innerHTML = "", w === "tile-tint") {
      const L = Yi(), A = E.fromColor ?? Di.fromColor, O = E.toColor ?? Di.toColor, M = E.mode ?? "oklch", x = document.createElement("div");
      x.classList.add("idle-anim__range-row"), x.appendChild(Mr("From", "ti-click__from-color", A)), x.appendChild(Mr("To", "ti-click__to-color", O)), g.appendChild(x), g.appendChild(Ot(
        "Interpolation",
        "ti-click__color-mode",
        L.map((R) => ({ value: R, label: R, selected: R === M }))
      ));
    } else if (w === "tile-scale") {
      const L = E.fromScale ?? Da.fromScale, A = E.toScale ?? Da.toScale, O = document.createElement("div");
      O.classList.add("idle-anim__range-row"), O.appendChild(At("From", "ti-click__from-scale", L, { step: "0.01", min: "0.01" })), O.appendChild(At("To", "ti-click__to-scale", A, { step: "0.01", min: "0.01" })), g.appendChild(O);
      const M = document.createElement("p");
      M.classList.add("idle-anim__hint"), M.textContent = "1.0 = original size. Scales from center.", g.appendChild(M);
    } else {
      const L = E.attribute ?? _i.attribute, A = E.from ?? _i.from, O = E.to ?? _i.to;
      g.appendChild(Ot(
        "Attribute",
        "ti-click__attribute",
        Lm.map((x) => ({ value: x.value, label: x.label, selected: x.value === L }))
      ));
      const M = document.createElement("div");
      M.classList.add("idle-anim__range-row"), M.appendChild(At("From", "ti-click__from", A, { step: "0.01" })), M.appendChild(At("To", "ti-click__to", O, { step: "0.01" })), g.appendChild(M);
    }
  }
  c(p, "renderTypeFields"), p(n, t);
  const y = t.period ?? (n === "tile-tint" ? Di.period : _i.period), b = t.easing ?? "easeOutCubic";
  h.appendChild(At("Period (ms)", "ti-click__period", y, { min: "50", step: "50" })), h.appendChild(Ot(
    "Easing",
    "ti-click__easing",
    r.map((w) => ({ value: w, label: w, selected: w === b }))
  )), a.appendChild(h);
  const v = a.querySelector(".ti-click__type");
  return v == null || v.addEventListener("change", () => {
    const w = v.value;
    p(w, w === "tile-tint" ? Di : w === "tile-scale" ? Da : _i);
  }), o.addEventListener("click", (w) => {
    if (!w.target.closest(".idle-anim__slot-remove") && (a.classList.toggle("is-collapsed"), a.classList.contains("is-collapsed"))) {
      const E = Om(a);
      E && (u.textContent = Hu(E));
    }
  }), d.addEventListener("click", (w) => {
    w.stopPropagation();
    const E = a.parentElement;
    a.remove(), E && Sr(E, "ti-click-slot", "Animation");
  }), Tc(a, { dropGroup: "click" }), a;
}
c(qu, "buildClickSlot");
function Om(t) {
  var u, d, h, f, g, p, y, b, v, w, E, L, A, O;
  const e = ((u = t.querySelector(".ti-click__type")) == null ? void 0 : u.value) ?? "tile-prop", n = ((d = t.querySelector(".ti-click__mode")) == null ? void 0 : d.value) ?? "bounce", i = Number.parseInt((h = t.querySelector(".ti-click__period")) == null ? void 0 : h.value, 10), r = ((f = t.querySelector(".ti-click__easing")) == null ? void 0 : f.value) ?? "easeOutCubic";
  if (!i || i <= 0) return null;
  const a = { mode: n, period: i, easing: r };
  if (e === "tile-tint") {
    const M = ((g = t.querySelector(".ti-click__from-color")) == null ? void 0 : g.value) ?? ((p = t.querySelector(".ti-click__from-color-text")) == null ? void 0 : p.value) ?? Di.fromColor, x = ((y = t.querySelector(".ti-click__to-color")) == null ? void 0 : y.value) ?? ((b = t.querySelector(".ti-click__to-color-text")) == null ? void 0 : b.value) ?? Di.toColor, R = ((v = t.querySelector(".ti-click__color-mode")) == null ? void 0 : v.value) ?? "oklch";
    return { type: "tile-tint", fromColor: M, toColor: x, mode: R, ...a };
  }
  if (e === "tile-scale") {
    const M = Number.parseFloat((w = t.querySelector(".ti-click__from-scale")) == null ? void 0 : w.value), x = Number.parseFloat((E = t.querySelector(".ti-click__to-scale")) == null ? void 0 : E.value);
    return Number.isNaN(M) || Number.isNaN(x) || M <= 0 || x <= 0 ? null : { type: "tile-scale", fromScale: M, toScale: x, ...a };
  }
  const o = ((L = t.querySelector(".ti-click__attribute")) == null ? void 0 : L.value) ?? _i.attribute, s = Number.parseFloat((A = t.querySelector(".ti-click__from")) == null ? void 0 : A.value), l = Number.parseFloat((O = t.querySelector(".ti-click__to")) == null ? void 0 : O.value);
  return Number.isNaN(s) || Number.isNaN(l) ? null : { type: "tile-prop", attribute: o, from: s, to: l, ...a };
}
c(Om, "readClickSlot");
function Sr(t, e, n) {
  t.querySelectorAll(`.${e}`).forEach((r, a) => {
    r.dataset.index = String(a);
    const o = r.querySelector(".idle-anim__slot-title");
    o && (o.textContent = `${n} ${a + 1}`);
  });
}
c(Sr, "renumberSlots");
function dv(t) {
  const { hoverIdle: e, hoverEnter: n, click: i } = uv(t), r = document.createElement("section");
  r.classList.add("eidolon-tile-interactions");
  const a = document.createElement("h3");
  a.classList.add("ti-section-heading"), a.textContent = "Idle", r.appendChild(a);
  const o = document.createElement("p");
  o.classList.add("idle-anim__hint"), o.textContent = "Plays continuously. Stops when pointer enters the tile.", r.appendChild(o);
  const s = document.createElement("div");
  s.classList.add("idle-anim__slots", "ti-hover-idle-slots");
  for (let b = 0; b < e.length; b++)
    s.appendChild(pa(e[b], b, "ti-hover-idle-slot", "Effect"));
  r.appendChild(s), Fa(s, {
    dropGroup: "hover",
    onDrop(b) {
      b.parentElement === s && b.classList.contains("ti-hover-enter-slot") && b.classList.replace("ti-hover-enter-slot", "ti-hover-idle-slot"), Sr(s, "ti-hover-idle-slot", "Effect");
    }
  });
  const l = document.createElement("button");
  l.type = "button", l.classList.add("idle-anim__add"), l.innerHTML = '<i class="fa-solid fa-plus"></i> Add Idle Effect', l.addEventListener("click", () => {
    const b = s.querySelectorAll(".ti-hover-idle-slot").length, v = pa({ name: "float" }, b, "ti-hover-idle-slot", "Effect");
    v.classList.remove("is-collapsed"), s.appendChild(v);
  }), r.appendChild(l);
  const u = document.createElement("h3");
  u.classList.add("ti-section-heading"), u.textContent = "Hover", r.appendChild(u);
  const d = document.createElement("p");
  d.classList.add("idle-anim__hint"), d.textContent = "Plays while pointer is over the tile. Stops when pointer leaves.", r.appendChild(d);
  const h = document.createElement("div");
  h.classList.add("idle-anim__slots", "ti-hover-enter-slots");
  for (let b = 0; b < n.length; b++)
    h.appendChild(pa(n[b], b, "ti-hover-enter-slot", "Effect"));
  r.appendChild(h), Fa(h, {
    dropGroup: "hover",
    onDrop(b) {
      b.parentElement === h && b.classList.contains("ti-hover-idle-slot") && b.classList.replace("ti-hover-idle-slot", "ti-hover-enter-slot"), Sr(h, "ti-hover-enter-slot", "Effect");
    }
  });
  const f = document.createElement("button");
  f.type = "button", f.classList.add("idle-anim__add"), f.innerHTML = '<i class="fa-solid fa-plus"></i> Add Hover Effect', f.addEventListener("click", () => {
    const b = h.querySelectorAll(".ti-hover-enter-slot").length, v = pa({ name: "scale" }, b, "ti-hover-enter-slot", "Effect");
    v.classList.remove("is-collapsed"), h.appendChild(v);
  }), r.appendChild(f);
  const g = document.createElement("h3");
  g.classList.add("ti-section-heading"), g.textContent = "Click", r.appendChild(g);
  const p = document.createElement("div");
  p.classList.add("idle-anim__slots", "ti-click-slots");
  for (let b = 0; b < i.length; b++)
    p.appendChild(qu(i[b], b));
  r.appendChild(p), Fa(p, {
    dropGroup: "click",
    onDrop() {
      Sr(p, "ti-click-slot", "Animation");
    }
  });
  const y = document.createElement("button");
  return y.type = "button", y.classList.add("idle-anim__add"), y.innerHTML = '<i class="fa-solid fa-plus"></i> Add Animation', y.addEventListener("click", () => {
    const b = p.querySelectorAll(".ti-click-slot").length, v = qu(Da, b);
    v.classList.remove("is-collapsed"), p.appendChild(v);
  }), r.appendChild(y), r;
}
c(dv, "buildSectionContent");
function ju(t, e) {
  const n = [];
  for (const i of t.querySelectorAll(`.${e}`)) {
    const r = Im(i);
    r && n.push(r);
  }
  return n;
}
c(ju, "readAllHoverSlots");
function fv(t) {
  const e = [];
  for (const n of t.querySelectorAll(".ti-click-slot")) {
    const i = Om(n);
    i && e.push(i);
  }
  return e;
}
c(fv, "readAllClickConfigs");
function mv(t, e) {
  var l;
  const n = $t(e);
  if (!n) return;
  const i = cv(t);
  if (!i) return;
  const r = mc(t, n, sv, "Animations", lv);
  if (!r || r.querySelector(".eidolon-tile-interactions")) return;
  const a = r.closest("form");
  a && (a.noValidate = !0);
  const o = document.createElement("hr");
  o.classList.add("ti-divider"), r.appendChild(o);
  const s = dv(i);
  r.appendChild(s), (l = t.setPosition) == null || l.call(t, { height: "auto" }), a && a.addEventListener("submit", () => {
    const u = ju(s, "ti-hover-idle-slot"), d = ju(s, "ti-hover-enter-slot"), h = fv(s), f = u.length > 0 || d.length > 0, g = f || h.length > 0;
    i.update({ [`flags.${Zl}.-=${ec}`]: null }).then(() => {
      if (g) {
        const p = {};
        return f && (p.hover = {}, u.length > 0 && (p.hover.idle = u), d.length > 0 && (p.hover.enter = d)), h.length > 0 && (p.click = h), i.update({ [`flags.${Zl}.${ec}`]: p });
      }
    });
  });
}
c(mv, "renderInteractionSection");
const hv = "eidolon-utilities", Bu = "tile-interactions";
function gv() {
  rv();
}
c(gv, "onCanvasReady");
function pv(t, e) {
  var i;
  const n = (i = e == null ? void 0 : e.flags) == null ? void 0 : i[hv];
  !n || !(Bu in n || `-=${Bu}` in n) || av(t);
}
c(pv, "onUpdateTile");
function yv(t) {
  Sm(t);
}
c(yv, "onDeleteTile");
function bv(t, e) {
  mv(t, e);
}
c(bv, "onRenderTileConfig");
function vv() {
  Hooks.on("canvasReady", gv), Hooks.on("updateTile", pv), Hooks.on("deleteTile", yv), Hooks.on("renderTileConfig", bv);
}
c(vv, "registerTileInteractionHooks");
vv();
//# sourceMappingURL=eidolon-utilities.js.map
