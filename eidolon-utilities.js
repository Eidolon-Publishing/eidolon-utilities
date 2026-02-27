var Ml = Object.defineProperty;
var Rd = Object.getPrototypeOf;
var Hd = Reflect.get;
var Nl = (n) => {
  throw TypeError(n);
};
var qd = (n, e, t) => e in n ? Ml(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var c = (n, e) => Ml(n, "name", { value: e, configurable: !0 });
var pe = (n, e, t) => qd(n, typeof e != "symbol" ? e + "" : e, t), vo = (n, e, t) => e.has(n) || Nl("Cannot " + t);
var f = (n, e, t) => (vo(n, e, "read from private field"), t ? t.call(n) : e.get(n)), I = (n, e, t) => e.has(n) ? Nl("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(n) : e.set(n, t), S = (n, e, t, i) => (vo(n, e, "write to private field"), i ? i.call(n, t) : e.set(n, t), t), C = (n, e, t) => (vo(n, e, "access private method"), t);
var Eo = (n, e, t, i) => ({
  set _(r) {
    S(n, e, r, t);
  },
  get _() {
    return f(n, e, i);
  }
}), Ne = (n, e, t) => Hd(Rd(n), t, e);
const T = "eidolon-utilities", Xr = "timeTriggerActive", qo = "timeTriggerHideWindow", Bo = "timeTriggerShowPlayerWindow", jo = "timeTriggerAllowRealTime", Ic = "timeTriggers", Fr = "timeTriggerHistory", Uo = "debug", Vo = "timeFormat", zo = "manageTime", Go = "secondsPerRound";
const Bd = [-30, -15, -5, 5, 15, 30], oi = 1440 * 60, Pr = "playSound", hr = 6;
function v(n, e) {
  var t, i;
  return (i = (t = game.i18n) == null ? void 0 : t.has) != null && i.call(t, n) ? game.i18n.localize(n) : e;
}
c(v, "localize");
function bt(n) {
  return typeof n != "string" ? "" : n.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
c(bt, "escapeHtml");
function At(n) {
  var e;
  return n == null ? n : (e = foundry == null ? void 0 : foundry.utils) != null && e.duplicate ? foundry.utils.duplicate(n) : JSON.parse(JSON.stringify(n));
}
c(At, "duplicateData");
function jd() {
  var n;
  return (n = foundry == null ? void 0 : foundry.utils) != null && n.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
c(jd, "generateTriggerId");
function Oc(n) {
  if (typeof n != "string") return null;
  const e = n.trim();
  if (!e) return null;
  const t = e.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (!t) return null;
  const i = Number(t[1]), r = Number(t[2]), a = t[3] !== void 0 ? Number(t[3]) : 0;
  return !Number.isInteger(i) || !Number.isInteger(r) || !Number.isInteger(a) || i < 0 || i > 23 || r < 0 || r > 59 || a < 0 || a > 59 ? null : i * 3600 + r * 60 + a;
}
c(Oc, "parseTriggerTimeToSeconds");
function Pi() {
  var n, e;
  return ((n = game.scenes) == null ? void 0 : n.current) ?? ((e = game.scenes) == null ? void 0 : e.active) ?? null;
}
c(Pi, "getActiveScene");
function Mt(n) {
  return (n == null ? void 0 : n.object) ?? (n == null ? void 0 : n.document) ?? null;
}
c(Mt, "getSceneFromApplication");
function He(n) {
  return n && typeof n.getFlag == "function" && typeof n.setFlag == "function";
}
c(He, "hasSceneDocument");
const Wo = /* @__PURE__ */ new Set(), Jo = /* @__PURE__ */ new Set(), Ko = /* @__PURE__ */ new Set(), Yo = /* @__PURE__ */ new Set();
let Wn = !1, Ui = !1, Zr = hr, ea = "12h", kl = !1;
function To(n) {
  Wn = !!n;
  for (const e of Wo)
    try {
      e(Wn);
    } catch (t) {
      console.error(`${T} | Debug change handler failed`, t);
    }
}
c(To, "notifyDebugChange");
function Co(n) {
  Ui = !!n;
  for (const e of Jo)
    try {
      e(Ui);
    } catch (t) {
      console.error(`${T} | Manage time change handler failed`, t);
    }
}
c(Co, "notifyManageTimeChange");
function Ac(n) {
  return n === "24h" ? "24h" : "12h";
}
c(Ac, "normalizeTimeFormatValue");
function nl(n) {
  const e = Number(n);
  return !Number.isFinite(e) || e <= 0 ? hr : e;
}
c(nl, "normalizeSecondsPerRoundValue");
function So(n) {
  const e = nl(n);
  Zr = e;
  for (const t of Ko)
    try {
      t(e);
    } catch (i) {
      console.error(`${T} | Seconds-per-round change handler failed`, i);
    }
}
c(So, "notifySecondsPerRoundChange");
function Lo(n) {
  const e = Ac(n);
  ea = e;
  for (const t of Yo)
    try {
      t(e);
    } catch (i) {
      console.error(`${T} | Time format change handler failed`, i);
    }
}
c(Lo, "notifyTimeFormatChange");
function Ud() {
  var e;
  if (kl) return;
  if (kl = !0, !((e = game == null ? void 0 : game.settings) != null && e.register)) {
    console.warn(
      `${T} | game.settings.register is unavailable. Module settings could not be registered.`
    );
    return;
  }
  const n = typeof game.settings.registerChange == "function";
  game.settings.register(T, Uo, {
    name: v("EIDOLON.TimeTrigger.DebugSettingName", "Enable debug logging"),
    hint: v(
      "EIDOLON.TimeTrigger.DebugSettingHint",
      "Write detailed time-trigger diagnostics to the browser console."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: n ? void 0 : To
  }), n && game.settings.registerChange(T, Uo, To), Wn = il(), To(Wn), game.settings.register(T, zo, {
    name: v("EIDOLON.TimeTrigger.ManageTimeSettingName", "Manage Game Time"),
    hint: v(
      "EIDOLON.TimeTrigger.ManageTimeSettingHint",
      "Allow Eidolon Utilities to advance world time automatically while the game is unpaused. Warning: This may conflict with other time-management modules."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: n ? void 0 : Co
  }), n && game.settings.registerChange(T, zo, Co), Ui = zd(), Co(Ui), game.settings.register(T, Go, {
    name: v(
      "EIDOLON.TimeTrigger.SecondsPerRoundSettingName",
      "Seconds Per Combat Round"
    ),
    hint: v(
      "EIDOLON.TimeTrigger.SecondsPerRoundSettingHint",
      "Amount of world seconds to add whenever a combat round ends while time management is active."
    ),
    scope: "world",
    config: !0,
    type: Number,
    default: hr,
    range: { min: 1, max: 3600, step: 1 },
    onChange: n ? void 0 : So
  }), n && game.settings.registerChange(
    T,
    Go,
    So
  ), Zr = nl(Gd()), So(Zr), game.settings.register(T, Vo, {
    name: v("EIDOLON.TimeTrigger.TimeFormatSettingName", "Trigger Time Format"),
    hint: v(
      "EIDOLON.TimeTrigger.TimeFormatSettingHint",
      "Control whether trigger times use a 12-hour or 24-hour clock."
    ),
    scope: "world",
    config: !0,
    type: String,
    choices: {
      "12h": v(
        "EIDOLON.TimeTrigger.TimeFormatSettingChoice12Hour",
        "12-hour (e.g. 2:30 PM)"
      ),
      "24h": v(
        "EIDOLON.TimeTrigger.TimeFormatSettingChoice24Hour",
        "24-hour (e.g. 14:30)"
      )
    },
    default: "12h",
    onChange: n ? void 0 : Lo
  }), n && game.settings.registerChange(T, Vo, Lo), ea = Ac(Mc()), Lo(ea);
}
c(Ud, "registerTimeTriggerSettings");
function il() {
  var n;
  try {
    if ((n = game == null ? void 0 : game.settings) != null && n.get)
      return !!game.settings.get(T, Uo);
  } catch (e) {
    console.error(`${T} | Failed to read debug setting`, e);
  }
  return !1;
}
c(il, "getDebugSetting");
function Vd() {
  return Wn = il(), Wn;
}
c(Vd, "refreshDebugSettingCache");
function zd() {
  var n;
  try {
    if ((n = game == null ? void 0 : game.settings) != null && n.get)
      return !!game.settings.get(T, zo);
  } catch (e) {
    console.error(`${T} | Failed to read manage time setting`, e);
  }
  return !1;
}
c(zd, "getManageTimeSetting");
function Mc() {
  var n;
  try {
    if ((n = game == null ? void 0 : game.settings) != null && n.get)
      return game.settings.get(T, Vo) === "24h" ? "24h" : "12h";
  } catch (e) {
    console.error(`${T} | Failed to read time format setting`, e);
  }
  return "12h";
}
c(Mc, "getTimeFormatSetting");
function Gd() {
  var n;
  try {
    if ((n = game == null ? void 0 : game.settings) != null && n.get) {
      const e = game.settings.get(T, Go);
      return nl(e);
    }
  } catch (e) {
    console.error(`${T} | Failed to read seconds-per-round setting`, e);
  }
  return hr;
}
c(Gd, "getSecondsPerRoundSetting");
function Wd(n) {
  if (typeof n != "function")
    return () => {
    };
  Wo.add(n);
  try {
    n(Wn);
  } catch (e) {
    console.error(`${T} | Debug change handler failed`, e);
  }
  return () => {
    Wo.delete(n);
  };
}
c(Wd, "onDebugSettingChange");
function Nc(n) {
  if (typeof n != "function")
    return () => {
    };
  Jo.add(n);
  try {
    n(Ui);
  } catch (e) {
    console.error(`${T} | Manage time change handler failed`, e);
  }
  return () => {
    Jo.delete(n);
  };
}
c(Nc, "onManageTimeSettingChange");
function rl(n) {
  if (typeof n != "function")
    return () => {
    };
  Yo.add(n);
  try {
    n(ea);
  } catch (e) {
    console.error(`${T} | Time format change handler failed`, e);
  }
  return () => {
    Yo.delete(n);
  };
}
c(rl, "onTimeFormatSettingChange");
function Jd(n) {
  if (typeof n != "function")
    return () => {
    };
  Ko.add(n);
  try {
    n(Zr);
  } catch (e) {
    console.error(`${T} | Seconds-per-round change handler failed`, e);
  }
  return () => {
    Ko.delete(n);
  };
}
c(Jd, "onSecondsPerRoundSettingChange");
let to = !1, Qo = !1;
function Xo(n) {
  to = !!n;
}
c(Xo, "updateDebugState");
function kc() {
  Qo || (Qo = !0, Xo(il()), Wd((n) => {
    Xo(n), console.info(`${T} | Debug ${to ? "enabled" : "disabled"}`);
  }));
}
c(kc, "ensureInitialized");
function al() {
  return Qo || kc(), to;
}
c(al, "shouldLog");
function $c(n) {
  if (!n.length)
    return [`${T} |`];
  const [e, ...t] = n;
  return typeof e == "string" ? [`${T} | ${e}`, ...t] : [`${T} |`, e, ...t];
}
c($c, "formatArgs");
function Kd() {
  kc();
}
c(Kd, "initializeDebug");
function Yd() {
  return Xo(Vd()), to;
}
c(Yd, "syncDebugState");
function A(...n) {
  al() && console.debug(...$c(n));
}
c(A, "debugLog");
function Ti(...n) {
  al() && console.group(...$c(n));
}
c(Ti, "debugGroup");
function sn() {
  al() && console.groupEnd();
}
c(sn, "debugGroupEnd");
function si(n) {
  var r;
  const e = (r = n == null ? void 0 : n.getFlag) == null ? void 0 : r.call(n, T, Ic);
  if (!e) return [];
  const t = At(e), i = Array.isArray(t) ? t : [];
  return A("Loaded time triggers", {
    sceneId: (n == null ? void 0 : n.id) ?? null,
    count: i.length
  }), i;
}
c(si, "getTimeTriggers");
async function Dc(n, e) {
  n != null && n.setFlag && (A("Persisting time triggers", {
    sceneId: n.id,
    count: Array.isArray(e) ? e.length : 0
  }), await n.setFlag(T, Ic, e));
}
c(Dc, "setTimeTriggers");
function Qd(n) {
  var r;
  const e = (r = n == null ? void 0 : n.getFlag) == null ? void 0 : r.call(n, T, Fr);
  if (!e) return {};
  const t = At(e);
  if (!t || typeof t != "object") return {};
  const i = {};
  for (const [a, o] of Object.entries(t))
    typeof o == "number" && Number.isFinite(o) && (i[a] = o);
  return A("Loaded time trigger history", {
    sceneId: (n == null ? void 0 : n.id) ?? null,
    keys: Object.keys(i)
  }), i;
}
c(Qd, "getTimeTriggerHistory");
async function Io(n, e) {
  var l, u, d, g;
  if (!n) return;
  const t = {};
  if (e && typeof e == "object")
    for (const [m, y] of Object.entries(e))
      typeof y == "number" && Number.isFinite(y) && (t[m] = y);
  const i = ((l = n.getFlag) == null ? void 0 : l.call(n, T, Fr)) ?? {}, r = {};
  if (i && typeof i == "object")
    for (const [m, y] of Object.entries(i))
      typeof y == "number" && Number.isFinite(y) && (r[m] = y);
  const a = Object.keys(t), o = Object.keys(r);
  if (typeof ((u = foundry == null ? void 0 : foundry.utils) == null ? void 0 : u.deepEqual) == "function" ? foundry.utils.deepEqual(r, t) : JSON.stringify(r) === JSON.stringify(t)) {
    A("Skip history update because state is unchanged", {
      sceneId: (n == null ? void 0 : n.id) ?? null
    });
    return;
  }
  A("Updating time trigger history", {
    sceneId: (n == null ? void 0 : n.id) ?? null,
    keys: a,
    removedKeys: o.filter((m) => !a.includes(m))
  });
  try {
    o.length && typeof n.unsetFlag == "function" && await n.unsetFlag(T, Fr), a.length && await n.setFlag(T, Fr, t);
  } catch (m) {
    console.error(`${T} | Failed to persist time trigger history`, m), (g = (d = ui.notifications) == null ? void 0 : d.error) == null || g.call(
      d,
      v(
        "EIDOLON.TimeTrigger.HistoryPersistError",
        "Failed to persist the scene's time trigger history."
      )
    );
  }
}
c(Io, "updateTimeTriggerHistory");
const ta = /* @__PURE__ */ new Map(), $l = /* @__PURE__ */ new Set();
function Xd(n) {
  if (!(n != null && n.id))
    throw new Error(`${T} | Action definitions require an id.`);
  if (ta.has(n.id))
    throw new Error(`${T} | Duplicate time trigger action id: ${n.id}`);
  ta.set(n.id, {
    ...n
  }), A("Registered time trigger action", { actionId: n.id });
}
c(Xd, "registerAction");
function gr(n) {
  return ta.get(n) ?? null;
}
c(gr, "getAction");
function Zd(n) {
  const e = gr(n);
  return e ? typeof e.label == "function" ? e.label() : e.label : n;
}
c(Zd, "getActionLabel");
function Dl() {
  return Array.from(ta.values());
}
c(Dl, "listActions");
async function Fc(n, e) {
  var i, r;
  const t = gr(e == null ? void 0 : e.action);
  if (!t || typeof t.execute != "function") {
    const a = v(
      "EIDOLON.TimeTrigger.UnknownAction",
      "Encountered an unknown time trigger action and skipped it."
    );
    (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, a), console.warn(`${T} | Unknown time trigger action`, e), A("Encountered unknown time trigger action", {
      triggerId: (e == null ? void 0 : e.id) ?? null,
      actionId: (e == null ? void 0 : e.action) ?? null
    });
    return;
  }
  A("Executing action handler", {
    actionId: t.id,
    triggerId: (e == null ? void 0 : e.id) ?? null,
    sceneId: (n == null ? void 0 : n.id) ?? null
  }), await t.execute({ scene: n, trigger: e });
}
c(Fc, "executeTriggerAction");
function ef(n) {
  const e = gr(n == null ? void 0 : n.action);
  return !e || typeof e.buildSummaryParts != "function" ? [] : e.buildSummaryParts({ trigger: n, escapeHtml: bt, localize: v }) ?? [];
}
c(ef, "buildActionSummaryParts");
function tf(n) {
  const e = gr(n == null ? void 0 : n.action);
  return !e || typeof e.buildFormContent != "function" ? "" : e.buildFormContent({ trigger: n, escapeHtml: bt, localize: v }) ?? "";
}
c(tf, "buildActionFormSection");
function nf(n, e) {
  const t = gr(n == null ? void 0 : n.action);
  !t || typeof t.prepareFormData != "function" || t.prepareFormData({ trigger: n, formData: e });
}
c(nf, "applyActionFormData");
function rf(n, e, t) {
  var a, o;
  const i = `${(n == null ? void 0 : n.id) ?? "unknown"}:${(e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.action) ?? "unknown"}:${t}`;
  if ($l.has(i)) return;
  $l.add(i);
  const r = v(
    "EIDOLON.TimeTrigger.MissingDataWarning",
    "A scene time trigger is missing required data and was skipped."
  );
  (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, r), console.warn(`${T} | Missing trigger data (${t})`, { scene: n == null ? void 0 : n.id, trigger: e });
}
c(rf, "warnMissingTriggerData");
async function af({ scene: n, trigger: e }) {
  var a, o, s, l, u;
  const t = (s = (o = (a = e == null ? void 0 : e.data) == null ? void 0 : a.path) == null ? void 0 : o.trim) == null ? void 0 : s.call(o);
  if (!t) {
    rf(n, e, "missing-audio-path");
    return;
  }
  const i = {
    src: t,
    autoplay: !0,
    loop: !1
  }, r = (() => {
    var d, g, m, y, p;
    return typeof ((g = (d = foundry == null ? void 0 : foundry.audio) == null ? void 0 : d.AudioHelper) == null ? void 0 : g.play) == "function" ? foundry.audio.AudioHelper.play(i, !0) : typeof ((y = (m = game == null ? void 0 : game.audio) == null ? void 0 : m.constructor) == null ? void 0 : y.play) == "function" ? game.audio.constructor.play(i, !0) : typeof ((p = game == null ? void 0 : game.audio) == null ? void 0 : p.play) == "function" ? game.audio.play(i, !0) : null;
  })();
  if (!r) {
    console.error(`${T} | Foundry audio helper is unavailable`), (u = (l = ui.notifications) == null ? void 0 : l.error) == null || u.call(
      l,
      v(
        "EIDOLON.TimeTrigger.AudioHelperUnavailable",
        "Unable to play audio for a time trigger because the Foundry audio helper is unavailable."
      )
    );
    return;
  }
  await r;
}
c(af, "executePlaySoundAction");
Xd({
  id: Pr,
  label: /* @__PURE__ */ c(() => v("EIDOLON.TimeTrigger.ActionPlaySound", "Play Sound"), "label"),
  execute: af,
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
var wc;
const { ApplicationV2: yn, HandlebarsApplicationMixin: bn } = ((wc = foundry.applications) == null ? void 0 : wc.api) ?? {};
if (!yn || !bn)
  throw new Error(
    `${T} | ApplicationV2 API unavailable. Update Foundry VTT to v13 or newer.`
  );
const un = "AM", Jn = "PM";
function ln() {
  return Mc();
}
c(ln, "getConfiguredTimeFormat");
function no(n) {
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
c(no, "parseCanonicalTimeString");
function Ot({ hours: n, minutes: e, seconds: t }) {
  if (!Number.isInteger(n) || !Number.isInteger(e) || n < 0 || n > 23 || e < 0 || e > 59) return null;
  const i = String(n).padStart(2, "0"), r = String(e).padStart(2, "0");
  if (Number.isInteger(t)) {
    if (t < 0 || t > 59) return null;
    const a = String(t).padStart(2, "0");
    return `${i}:${r}:${a}`;
  }
  return `${i}:${r}`;
}
c(Ot, "formatCanonicalTime");
function of(n, { format: e } = {}) {
  if (!n || typeof n != "object") return null;
  const t = Number(n.hour), i = Number(n.minute), r = n.second !== void 0 && n.second !== null, a = r ? Number(n.second) : null, o = r && Number.isFinite(a) ? Math.floor(Math.max(0, Math.min(59, a))) : null;
  if (!Number.isFinite(t) || !Number.isFinite(i)) return null;
  const s = e ?? ln();
  return na(
    {
      hours: t,
      minutes: i,
      seconds: o
    },
    s
  );
}
c(of, "formatTimeComponentsForDisplay");
function sf(n, { format: e } = {}) {
  const t = no(n);
  if (!t) return "";
  const i = e ?? ln();
  return na(t, i);
}
c(sf, "formatTriggerTimeForDisplay");
function na(n, e = "12h") {
  if (!n) return "";
  const { hours: t, minutes: i, seconds: r = null } = n;
  if (!Number.isInteger(t) || !Number.isInteger(i)) return "";
  const a = Number.isInteger(r);
  if (e === "24h") {
    const m = `${String(t).padStart(2, "0")}:${String(i).padStart(2, "0")}`;
    return a ? `${m}:${String(r).padStart(2, "0")}` : m;
  }
  const o = t >= 12 ? Jn : un, s = t % 12 === 0 ? 12 : t % 12, l = String(s), u = String(i).padStart(2, "0"), d = `${l}:${u}`, g = o === un ? v("EIDOLON.TimeTrigger.TimePeriodAM", un) : v("EIDOLON.TimeTrigger.TimePeriodPM", Jn);
  if (a) {
    const m = String(r).padStart(2, "0");
    return `${d}:${m} ${g}`;
  }
  return `${d} ${g}`;
}
c(na, "formatTimeParts");
function Fl(n, e = ln()) {
  const t = no(n);
  if (e === "24h")
    return {
      format: e,
      canonical: t ? Ot(t) ?? "" : "",
      hour: t ? String(t.hours).padStart(2, "0") : "",
      minute: t ? String(t.minutes).padStart(2, "0") : ""
    };
  if (!t)
    return {
      format: e,
      canonical: "",
      hour: "",
      minute: "",
      period: un
    };
  const i = t.hours >= 12 ? Jn : un, r = t.hours % 12 === 0 ? 12 : t.hours % 12;
  return {
    format: e,
    canonical: Ot(t) ?? "",
    hour: String(r),
    minute: String(t.minutes).padStart(2, "0"),
    period: i
  };
}
c(Fl, "getTimeFormValues");
function lf({ hour: n, minute: e, period: t, time: i }, r = ln()) {
  if (r === "24h") {
    const y = typeof n == "string" ? n.trim() : "", p = typeof e == "string" ? e.trim() : "", h = typeof i == "string" ? i.trim() : "";
    if (!y && !p && h) {
      const L = no(h);
      return L ? { canonical: Ot(L) ?? "", error: null } : {
        canonical: "",
        error: v(
          "EIDOLON.TimeTrigger.TimeFormatInvalid24",
          "Enter a valid time in HH:MM format."
        )
      };
    }
    if (!y || !p)
      return {
        canonical: "",
        error: v("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.")
      };
    const b = Number(y), w = Number(p);
    return !Number.isInteger(b) || b < 0 || b > 23 ? {
      canonical: "",
      error: v(
        "EIDOLON.TimeTrigger.TimeFormatInvalid24",
        "Enter a valid time in HH:MM format."
      )
    } : !Number.isInteger(w) || w < 0 || w > 59 ? {
      canonical: "",
      error: v(
        "EIDOLON.TimeTrigger.TimeFormatInvalid24",
        "Enter a valid time in HH:MM format."
      )
    } : { canonical: Ot({
      hours: b,
      minutes: w
    }) ?? "", error: null };
  }
  const a = typeof n == "string" ? n.trim() : "", o = typeof e == "string" ? e.trim() : "", s = typeof t == "string" ? t.trim().toUpperCase() : "";
  if (!a || !o || !s)
    return { canonical: "", error: v("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.") };
  if (s !== un && s !== Jn)
    return { canonical: "", error: v("EIDOLON.TimeTrigger.TimeFormatInvalidPeriod", "Select AM or PM.") };
  const l = Number(a), u = Number(o);
  if (!Number.isInteger(l) || l < 1 || l > 12)
    return {
      canonical: "",
      error: v("EIDOLON.TimeTrigger.TimeFormatInvalidHour", "Hours must be between 1 and 12.")
    };
  if (!Number.isInteger(u) || u < 0 || u > 59)
    return {
      canonical: "",
      error: v("EIDOLON.TimeTrigger.TimeFormatInvalidMinute", "Minutes must be between 00 and 59.")
    };
  const d = l % 12, m = {
    hours: s === Jn ? d + 12 : d,
    minutes: u
  };
  return {
    canonical: Ot(m) ?? "",
    error: null
  };
}
c(lf, "normalizeFormTimeInput");
function cf() {
  return [
    {
      value: un,
      label: v("EIDOLON.TimeTrigger.TimePeriodAM", un)
    },
    {
      value: Jn,
      label: v("EIDOLON.TimeTrigger.TimePeriodPM", Jn)
    }
  ];
}
c(cf, "getPeriodOptions");
var $n, Dn, re, Pc, La, Ia, _c, es, ts, Oa, Aa, xc, Rc, Hc, ns, is, rs, Ma, Na, as, ka, qc, Bc;
const An = class An extends bn(yn) {
  constructor(t = {}) {
    var o;
    const { scene: i, showControls: r, ...a } = t ?? {};
    super(a);
    I(this, re);
    I(this, $n, null);
    I(this, Dn, null);
    I(this, La, /* @__PURE__ */ c((t) => {
      var r, a;
      t.preventDefault();
      const i = Number((a = (r = t.currentTarget) == null ? void 0 : r.dataset) == null ? void 0 : a.delta);
      Number.isFinite(i) && (A("Time delta button clicked", { delta: i }), this._advanceTime(i));
    }, "#onDeltaClick"));
    I(this, Ia, /* @__PURE__ */ c((t) => {
      var i, r;
      t.preventDefault(), !(!this.showControls || !((i = game.user) != null && i.isGM)) && (A("Time value double clicked", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null }), C(this, re, _c).call(this));
    }, "#onTimeDoubleClick"));
    I(this, Oa, /* @__PURE__ */ c((t) => {
      if (this.isEditingTime && !this._commitTimeInProgress)
        if (t.key === "Enter") {
          t.preventDefault();
          const i = t.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
          C(this, re, ts).call(this, r);
        } else t.key === "Escape" && (t.preventDefault(), C(this, re, es).call(this));
    }, "#onTimeInputKeydown"));
    I(this, Aa, /* @__PURE__ */ c((t) => {
      if (!this.isEditingTime || this._commitTimeInProgress || this._suppressBlurCommit) return;
      const i = t.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
      C(this, re, ts).call(this, r);
    }, "#onTimeInputBlur"));
    I(this, Ma, /* @__PURE__ */ c((t) => {
      const i = !!t;
      if (this.manageTimeEnabled === i) return;
      this.manageTimeEnabled = i, (this.rendered ?? this.isRendered ?? !1) && this.render({ force: !0 });
    }, "#handleManageTimeChange"));
    I(this, Na, /* @__PURE__ */ c(async (t) => {
      var a, o, s, l, u, d, g, m, y;
      if (t.preventDefault(), !this.showControls || !((a = game.user) != null && a.isGM)) return;
      if (!this.manageTimeEnabled) {
        (s = (o = ui.notifications) == null ? void 0 : o.error) == null || s.call(
          o,
          v(
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
          v(
            "EIDOLON.TimeTrigger.SceneUnavailable",
            "The active scene is unavailable. Try again after reloading the world."
          )
        );
        return;
      }
      const r = !this.sceneAllowsRealTime;
      try {
        await i.setFlag(T, jo, r), this.sceneAllowsRealTime = r;
        const p = r ? v(
          "EIDOLON.TimeTrigger.SceneRealTimeEnabled",
          "Automatic real-time flow enabled for this scene."
        ) : v(
          "EIDOLON.TimeTrigger.SceneRealTimeDisabled",
          "Automatic real-time flow disabled for this scene."
        );
        (g = (d = ui.notifications) == null ? void 0 : d.info) == null || g.call(d, p);
      } catch (p) {
        console.error(`${T} | Failed to toggle scene real-time flow`, p), (y = (m = ui.notifications) == null ? void 0 : m.error) == null || y.call(
          m,
          v(
            "EIDOLON.TimeTrigger.SceneRealTimeToggleError",
            "Failed to update the scene's real-time flow setting."
          )
        );
      } finally {
        this.render({ force: !0 });
      }
    }, "#onRealTimeToggleClick"));
    I(this, ka, /* @__PURE__ */ c(() => {
      (this.rendered ?? this.isRendered ?? !1) && (this.isEditingTime && (this.editValue = C(this, re, ns).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    this.scene = i ?? null, this.showControls = typeof r == "boolean" ? r : !!((o = game.user) != null && o.isGM), this.isEditingTime = !1, this.editValue = "", this._commitTimeInProgress = !1, this._suppressBlurCommit = !1, this.manageTimeEnabled = !1, this.sceneAllowsRealTime = C(this, re, as).call(this), S(this, $n, rl(f(this, ka))), S(this, Dn, Nc(f(this, Ma)));
  }
  async _prepareContext() {
    var w, E;
    const t = ((w = game.time) == null ? void 0 : w.components) ?? {}, r = ((t == null ? void 0 : t.second) !== void 0 && (t == null ? void 0 : t.second) !== null ? of(t) : null) ?? C(this, re, Pc).call(this), a = ln(), o = a === "24h", s = o ? v("EIDOLON.TimeTrigger.EditTimePlaceholder24", "HH:MM") : v("EIDOLON.TimeTrigger.EditTimePlaceholder12", "HH:MM AM/PM"), l = this.showControls ? v(
      "EIDOLON.TimeTrigger.EditTimeHint",
      "Double-click to set a specific time."
    ) : "", u = this.showControls ? v(
      "EIDOLON.TimeTrigger.EditTimeLabel",
      "New time (HH:MM or HH:MM AM/PM)"
    ) : "", d = Bd.map((L) => ({
      minutes: L,
      label: L > 0 ? `+${L}` : `${L}`
    })), g = !!this.manageTimeEnabled, m = C(this, re, as).call(this);
    this.sceneAllowsRealTime = m;
    const y = v(
      "EIDOLON.TimeTrigger.SceneRealTimeEnable",
      "Enable automatic real-time flow for this scene."
    ), p = v(
      "EIDOLON.TimeTrigger.SceneRealTimeDisable",
      "Disable automatic real-time flow for this scene."
    ), h = v(
      "EIDOLON.TimeTrigger.SceneRealTimeManageDisabled",
      "Enable Manage Time in module settings to allow automatic real-time flow."
    );
    return {
      formattedTime: r,
      deltas: d,
      manageTimeEnabled: g,
      sceneAllowsRealTime: m,
      realTimeButtonLabel: g ? m ? p : y : h,
      isGM: ((E = game.user) == null ? void 0 : E.isGM) ?? !1,
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
      return (this.rendered ?? this.isRendered ?? !1) || (A("TimeTriggerWindow close request rerendering", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null
      }), this.render({ force: !0 })), this;
    A("Closing time trigger window", { sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null, force: !0 });
    const i = await super.close(t);
    return C(this, re, qc).call(this), C(this, re, Bc).call(this), i;
  }
  async _advanceTime(t) {
    var r, a, o, s, l, u, d;
    const i = t * 60;
    if (A("Advancing world time", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null, minutes: t, seconds: i }), !((a = game.user) != null && a.isGM)) {
      (s = (o = ui.notifications) == null ? void 0 : o.warn) == null || s.call(o, v("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time."));
      return;
    }
    try {
      await game.time.advance(i);
    } catch (g) {
      console.error(`${T} | Failed to advance time`, g), (u = (l = ui.notifications) == null ? void 0 : l.error) == null || u.call(
        l,
        v("EIDOLON.TimeTrigger.Error", "Failed to update the world time.")
      ), A("Failed to advance time from window", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        minutes: t,
        message: (g == null ? void 0 : g.message) ?? String(g)
      });
    }
  }
  _onRender(t, i) {
    var a;
    super._onRender(t, i);
    const r = this.element;
    if (r) {
      if (this.showControls) {
        A("Binding time trigger interactions", {
          sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
          buttonCount: r.querySelectorAll("[data-delta]").length
        }), r.querySelectorAll("[data-delta]").forEach((u) => {
          u.addEventListener("click", f(this, La));
        });
        const o = r.querySelector('.time-trigger-window__time-value[data-editable="true"]');
        o && o.addEventListener("dblclick", f(this, Ia), { once: !1 });
        const s = r.querySelector(".time-trigger-window__time-input");
        s && (s.addEventListener("keydown", f(this, Oa)), s.addEventListener("blur", f(this, Aa)), typeof s.focus == "function" && (s.focus(), typeof s.select == "function" && s.select()));
        const l = r.querySelector('[data-action="toggle-real-time"]');
        l && l.addEventListener("click", f(this, Na));
      }
      this._suppressBlurCommit = !1;
    }
  }
};
$n = new WeakMap(), Dn = new WeakMap(), re = new WeakSet(), Pc = /* @__PURE__ */ c(function() {
  var l;
  const t = (l = game.time) == null ? void 0 : l.worldTime;
  if (typeof t != "number" || !Number.isFinite(t)) return "";
  const i = 1440 * 60, r = (Math.floor(t) % i + i) % i, a = Math.floor(r / 3600), o = Math.floor(r % 3600 / 60), s = r % 60;
  return na({ hours: a, minutes: o, seconds: s }, ln());
}, "#formatFallbackTime"), La = new WeakMap(), Ia = new WeakMap(), _c = /* @__PURE__ */ c(function() {
  var t;
  (t = game.user) != null && t.isGM && (this.isEditingTime = !0, this._suppressBlurCommit = !1, this.editValue = C(this, re, ns).call(this), this.render({ force: !0 }));
}, "#enterTimeEditMode"), es = /* @__PURE__ */ c(function() {
  this.isEditingTime = !1, this.editValue = "", this._suppressBlurCommit = !1, this.render({ force: !0 });
}, "#cancelTimeEdit"), ts = /* @__PURE__ */ c(async function(t) {
  var a, o, s;
  if (!((a = game.user) != null && a.isGM) || !this.isEditingTime || this._commitTimeInProgress) return;
  this._commitTimeInProgress = !0;
  const i = typeof t == "string" ? t.trim() : "";
  if (!i) {
    C(this, re, es).call(this), this._commitTimeInProgress = !1;
    return;
  }
  const r = C(this, re, Hc).call(this, i);
  if (r.error) {
    (s = (o = ui.notifications) == null ? void 0 : o.error) == null || s.call(o, r.error), this._suppressBlurCommit = !0, this.editValue = i, this.render({ force: !0 }), this._commitTimeInProgress = !1;
    return;
  }
  try {
    await C(this, re, Rc).call(this, r.seconds, r.includeSeconds) ? (this.isEditingTime = !1, this.editValue = "", this.render({ force: !0 })) : (this.editValue = i, this.render({ force: !0 }));
  } finally {
    this._commitTimeInProgress = !1;
  }
}, "#commitTimeInput"), Oa = new WeakMap(), Aa = new WeakMap(), xc = /* @__PURE__ */ c(function() {
  var u, d;
  const t = (u = game.time) == null ? void 0 : u.worldTime;
  if (typeof t != "number" || !Number.isFinite(t))
    return "";
  const i = ((d = game.time) == null ? void 0 : d.components) ?? {}, r = Number(i.hour), a = Number(i.minute), o = i.second !== void 0 ? Number(i.second) : null, s = Number.isInteger(o);
  return (Number.isFinite(r) && Number.isFinite(a) ? Ot({
    hours: Math.max(0, Math.min(23, Number(r))),
    minutes: Math.max(0, Math.min(59, Number(a))),
    seconds: s && Number.isFinite(o) ? Math.max(0, Math.min(59, Number(o))) : void 0
  }) ?? "" : "") ?? "";
}, "#getCurrentCanonicalTime"), Rc = /* @__PURE__ */ c(async function(t, i) {
  var m, y, p, h, b, w, E, L, O, M;
  const r = (m = game.time) == null ? void 0 : m.worldTime;
  if (typeof r != "number" || !Number.isFinite(r))
    return (p = (y = ui.notifications) == null ? void 0 : y.error) == null || p.call(
      y,
      v(
        "EIDOLON.TimeTrigger.EditTimeUnavailable",
        "The world time is unavailable, so it can't be updated."
      )
    ), !1;
  if (!Number.isInteger(t) || t < 0 || t >= oi)
    return (b = (h = ui.notifications) == null ? void 0 : h.error) == null || b.call(
      h,
      v(
        "EIDOLON.TimeTrigger.EditTimeInvalidRange",
        "Enter a time within the current day."
      )
    ), !1;
  const s = Math.floor(r / oi) * oi + t - r;
  if (!Number.isFinite(s) || s === 0)
    return !0;
  const l = Math.floor(t / 3600), u = Math.floor(t % 3600 / 60), d = t % 60, g = Ot({
    hours: l,
    minutes: u,
    seconds: i ? d : void 0
  });
  try {
    A("Updating world time directly", {
      sceneId: ((w = this.scene) == null ? void 0 : w.id) ?? null,
      targetCanonical: g ?? null,
      diff: s
    }), await game.time.advance(s);
    const N = na(
      {
        hours: l,
        minutes: u,
        seconds: i ? d : null
      },
      ln()
    );
    (L = (E = ui.notifications) == null ? void 0 : E.info) == null || L.call(
      E,
      v(
        "EIDOLON.TimeTrigger.EditTimeSuccess",
        "World time updated."
      ) + (N ? ` ${N}` : "")
    );
  } catch (N) {
    return console.error(`${T} | Failed to set world time`, N), (M = (O = ui.notifications) == null ? void 0 : O.error) == null || M.call(
      O,
      v(
        "EIDOLON.TimeTrigger.EditTimeError",
        "Failed to update the world time."
      )
    ), !1;
  }
  return !0;
}, "#applyTargetSeconds"), Hc = /* @__PURE__ */ c(function(t) {
  var g;
  const i = v(
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
    const m = Number(a[1]), y = Number(a[2]), p = a[3] !== void 0 ? Number(a[3]) : void 0;
    if (Number.isInteger(m) && m >= 0 && m <= 23 && Number.isInteger(y) && y >= 0 && y <= 59 && (p === void 0 || Number.isInteger(p) && p >= 0 && p <= 59)) {
      const h = m * 3600 + y * 60 + (p ?? 0);
      return {
        canonical: Ot({ hours: m, minutes: y, seconds: p }),
        seconds: h,
        includeSeconds: p !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const { amLower: o, pmLower: s, periodPattern: l } = C(this, re, is).call(this), u = r.match(
    new RegExp(
      `^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?\\s*(${l})$`,
      "i"
    )
  );
  if (u) {
    let m = Number(u[1]);
    const y = Number(u[2]), p = u[3] !== void 0 ? Number(u[3]) : void 0, h = u[4] ?? "", b = typeof h == "string" ? ((g = h.toLocaleLowerCase) == null ? void 0 : g.call(h)) ?? h.toLowerCase() : "";
    if (Number.isInteger(m) && m >= 1 && m <= 12 && Number.isInteger(y) && y >= 0 && y <= 59 && (p === void 0 || Number.isInteger(p) && p >= 0 && p <= 59) && (b === o || b === s || b === "am" || b === "pm")) {
      m = m % 12, (b === s || b === "pm") && (m += 12);
      const E = m * 3600 + y * 60 + (p ?? 0);
      return {
        canonical: Ot({ hours: m, minutes: y, seconds: p }),
        seconds: E,
        includeSeconds: p !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const d = Oc(r);
  if (d !== null) {
    const m = Math.floor(d / 3600), y = Math.floor(d % 3600 / 60), p = d % 60, h = p !== 0;
    return {
      canonical: Ot({
        hours: m,
        minutes: y,
        seconds: h ? p : void 0
      }),
      seconds: d,
      includeSeconds: h,
      error: null
    };
  }
  return { error: i };
}, "#parseInputTime"), ns = /* @__PURE__ */ c(function() {
  const t = C(this, re, xc).call(this);
  if (!t) return "";
  if (ln() === "24h")
    return t;
  const r = no(t);
  if (!r) return t;
  const a = Number(r.hours), o = Number(r.minutes), s = r.seconds !== null && r.seconds !== void 0 ? Number(r.seconds) : void 0;
  if (!Number.isFinite(a) || !Number.isFinite(o)) return t;
  const l = Number.isFinite(s), u = a % 12 === 0 ? 12 : a % 12, d = String(o).padStart(2, "0"), g = l ? `:${String(s).padStart(2, "0")}` : "", { amLabel: m, pmLabel: y } = C(this, re, is).call(this), p = a >= 12 ? y : m;
  return `${u}:${d}${g} ${p}`.trim();
}, "#getInitialEditValue"), is = /* @__PURE__ */ c(function() {
  var u, d;
  const t = v("EIDOLON.TimeTrigger.TimePeriodAM", "AM"), i = v("EIDOLON.TimeTrigger.TimePeriodPM", "PM"), r = ((u = t.toLocaleLowerCase) == null ? void 0 : u.call(t)) ?? t.toLowerCase(), a = ((d = i.toLocaleLowerCase) == null ? void 0 : d.call(i)) ?? i.toLowerCase(), o = C(this, re, rs).call(this, t), s = C(this, re, rs).call(this, i), l = `${o}|${s}|AM|PM`;
  return {
    amLabel: t,
    pmLabel: i,
    amLower: r,
    pmLower: a,
    periodPattern: l
  };
}, "#getPeriodMatchData"), rs = /* @__PURE__ */ c(function(t) {
  return typeof t != "string" ? "" : t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}, "#escapeForRegex"), Ma = new WeakMap(), Na = new WeakMap(), as = /* @__PURE__ */ c(function() {
  const t = this.scene;
  if (!t || typeof t.getFlag != "function") return !1;
  try {
    return !!t.getFlag(T, jo);
  } catch (i) {
    A("TimeTriggerWindow | Failed to read scene real-time flag", {
      sceneId: (t == null ? void 0 : t.id) ?? null,
      message: (i == null ? void 0 : i.message) ?? String(i)
    });
  }
  return !1;
}, "#readSceneRealTimeFlag"), ka = new WeakMap(), qc = /* @__PURE__ */ c(function() {
  if (typeof f(this, $n) == "function")
    try {
      f(this, $n).call(this);
    } catch (t) {
      console.error(`${T} | Failed to dispose time format subscription`, t);
    }
  S(this, $n, null);
}, "#disposeTimeFormatSubscription"), Bc = /* @__PURE__ */ c(function() {
  if (typeof f(this, Dn) == "function")
    try {
      f(this, Dn).call(this);
    } catch (t) {
      console.error(`${T} | Failed to dispose manage time subscription`, t);
    }
  S(this, Dn, null);
}, "#disposeManageTimeSubscription"), c(An, "TimeTriggerWindow"), pe(An, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Ne(An, An, "DEFAULT_OPTIONS"),
  {
    id: `${T}-time-trigger`,
    window: {
      title: v("EIDOLON.TimeTrigger.Title", "Time Trigger"),
      resizable: !1
    },
    position: {
      width: "auto",
      height: "auto"
    }
  },
  { inplace: !1 }
)), pe(An, "PARTS", {
  content: {
    template: `modules/${T}/templates/time-trigger.html`
  }
});
let Zo = An;
function io(n, e = {}) {
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
c(io, "createApplicationFactory");
const Pl = /* @__PURE__ */ new Set();
var we, je, Fn, Li, jc, Uc;
const vl = class vl {
  constructor({ windowFactory: e } = {}) {
    I(this, Li);
    I(this, we, null);
    I(this, je, null);
    I(this, Fn);
    const t = io(Zo);
    typeof e == "function" ? e.__eidolonFactorySignature === "options" ? S(this, Fn, (r, a = {}) => e({ scene: r, ...a ?? {} })) : S(this, Fn, e) : S(this, Fn, /* @__PURE__ */ c((r, a = {}) => t({ scene: r, ...a ?? {} }), "fallbackFactory"));
  }
  onReady() {
    var t;
    const e = typeof ((t = game.time) == null ? void 0 : t.worldTime) == "number" && Number.isFinite(game.time.worldTime) ? game.time.worldTime : null;
    A("TimeTriggerManager#onReady", { worldTime: e }), e !== null && S(this, je, e);
  }
  onCanvasReady(e) {
    const t = (e == null ? void 0 : e.scene) ?? Pi();
    A("TimeTriggerManager#onCanvasReady", { sceneId: (t == null ? void 0 : t.id) ?? null }), this.refreshTimeTriggerWindow(t), this.handleTimeTriggerEvaluation(t);
  }
  onUpdateScene(e) {
    const t = Pi();
    A("TimeTriggerManager#onUpdateScene", {
      sceneId: (e == null ? void 0 : e.id) ?? null,
      activeSceneId: (t == null ? void 0 : t.id) ?? null
    }), !(!t || e.id !== t.id) && (this.refreshTimeTriggerWindow(e), this.handleTimeTriggerEvaluation(e));
  }
  onUpdateWorldTime(e, t) {
    A("TimeTriggerManager#onUpdateWorldTime", {
      worldTime: e,
      diff: t,
      hasWindow: !!f(this, we)
    }), f(this, we) && f(this, we).render();
    const i = Pi(), r = C(this, Li, jc).call(this, e, t);
    this.handleTimeTriggerEvaluation(i, e, r);
  }
  refreshTimeTriggerWindow(e) {
    var l, u, d;
    if (!e) return;
    const t = !!((l = game.user) != null && l.isGM), i = !!e.getFlag(T, Xr), r = !!e.getFlag(T, qo), a = !!e.getFlag(T, Bo);
    if (A("TimeTriggerManager#refreshTimeTriggerWindow", {
      sceneId: e.id,
      isGM: t,
      isActive: i,
      hideWindow: r,
      showPlayerWindow: a
    }), !(i && !r && (t || a))) {
      f(this, we) && (A("Closing time trigger window", { reason: "not-visible" }), f(this, we).close({ force: !0 }), S(this, we, null));
      return;
    }
    const s = !!t;
    if (f(this, we) && ((u = f(this, we).scene) == null ? void 0 : u.id) === e.id) {
      A("Refreshing existing time trigger window", { sceneId: e.id }), f(this, we).showControls = s, f(this, we).render();
      return;
    }
    f(this, we) && (A("Closing existing window before creating new instance", {
      previousSceneId: ((d = f(this, we).scene) == null ? void 0 : d.id) ?? null
    }), f(this, we).close({ force: !0 })), S(this, we, f(this, Fn).call(this, e, { showControls: s })), A("Rendering new time trigger window", { sceneId: e.id }), f(this, we).render({ force: !0 });
  }
  async handleTimeTriggerEvaluation(e, t, i) {
    var l;
    const r = e ?? Pi();
    if (!r) {
      A("handleTimeTriggerEvaluation skipped", {
        reason: "no-active-scene",
        providedSceneId: (e == null ? void 0 : e.id) ?? null,
        currentWorldTime: t
      }), typeof t == "number" && Number.isFinite(t) && S(this, je, t);
      return;
    }
    const a = typeof t == "number" && Number.isFinite(t) ? t : typeof ((l = game.time) == null ? void 0 : l.worldTime) == "number" ? game.time.worldTime : null;
    if (a === null) return;
    const o = typeof i == "number" && Number.isFinite(i) ? i : null, s = o !== null ? o : typeof f(this, je) == "number" && Number.isFinite(f(this, je)) ? f(this, je) : a;
    Ti("handleTimeTriggerEvaluation", {
      sceneId: r.id,
      previousWorldTime: s,
      currentWorldTime: a,
      overrideProvided: o !== null
    });
    try {
      await C(this, Li, Uc).call(this, r, s, a);
    } catch (u) {
      console.error(`${T} | Unexpected error while evaluating time triggers`, u), A("handleTimeTriggerEvaluation error", { message: (u == null ? void 0 : u.message) ?? String(u) });
    } finally {
      S(this, je, a), sn();
    }
  }
};
we = new WeakMap(), je = new WeakMap(), Fn = new WeakMap(), Li = new WeakSet(), jc = /* @__PURE__ */ c(function(e, t) {
  return typeof f(this, je) == "number" && Number.isFinite(f(this, je)) ? (A("Resolved previous world time from cache", {
    previousWorldTime: f(this, je)
  }), f(this, je)) : typeof e == "number" && Number.isFinite(e) && typeof t == "number" && Number.isFinite(t) ? (A("Resolved previous world time using diff", {
    worldTime: e,
    diff: t,
    resolved: e - t
  }), e - t) : typeof e == "number" && Number.isFinite(e) ? e : null;
}, "#resolvePreviousWorldTime"), Uc = /* @__PURE__ */ c(async function(e, t, i) {
  var p, h, b;
  if (!((p = game.user) != null && p.isGM)) {
    A("Skipping trigger evaluation because user is not a GM");
    return;
  }
  if (!(e != null && e.id)) {
    A("Skipping trigger evaluation because the scene is missing an id");
    return;
  }
  if (!!!e.getFlag(T, Xr)) {
    A("Skipping trigger evaluation because scene is inactive", { sceneId: e.id });
    return;
  }
  if (typeof i != "number" || !Number.isFinite(i)) return;
  (typeof t != "number" || !Number.isFinite(t)) && (t = i);
  const a = si(e);
  if (!a.length) {
    A("No time triggers configured for scene", { sceneId: e.id });
    return;
  }
  const o = Qd(e), s = /* @__PURE__ */ new Set();
  for (const w of a)
    w != null && w.id && s.add(w.id);
  let l = !1;
  for (const w of Object.keys(o))
    s.has(w) || (delete o[w], l = !0);
  if (Ti("Evaluating scene time triggers", {
    sceneId: e.id,
    previousWorldTime: t,
    currentWorldTime: i,
    triggerCount: a.length
  }), i <= t) {
    A("Detected world time rewind", {
      previousWorldTime: t,
      currentWorldTime: i
    });
    for (const w of a) {
      if (!(w != null && w.id) || !w.allowReplayOnRewind) continue;
      const E = o[w.id];
      typeof E == "number" ? i < E ? (A("Clearing trigger history due to rewind", {
        triggerId: w.id,
        lastFired: E,
        currentWorldTime: i
      }), delete o[w.id], l = !0) : A("Preserving trigger history after rewind", {
        triggerId: w.id,
        lastFired: E,
        currentWorldTime: i
      }) : A("No history stored for rewind-enabled trigger", {
        triggerId: w.id
      });
    }
    l && (A("Persisting history cleanup after rewind", {
      sceneId: e.id
    }), await Io(e, o)), sn();
    return;
  }
  const u = t, d = i, g = [], m = Math.floor(u / oi), y = Math.floor(d / oi);
  for (const w of a) {
    if (!(w != null && w.id)) continue;
    const E = Oc(w.time);
    if (E === null) {
      uf(e, w), A("Skipping trigger with invalid time", {
        triggerId: w.id,
        time: w.time
      });
      continue;
    }
    for (let L = m; L <= y; L++) {
      const O = L * oi + E;
      if (O < u || O > d) continue;
      const N = o[w.id];
      if (typeof N == "number" && N >= O) {
        A("Skipping trigger because it already fired within window", {
          triggerId: w.id,
          lastFired: N,
          absoluteTime: O
        });
        continue;
      }
      g.push({ trigger: w, absoluteTime: O });
    }
  }
  if (!g.length) {
    l && await Io(e, o), A("No triggers scheduled to fire within evaluation window", {
      sceneId: e.id
    }), sn();
    return;
  }
  g.sort((w, E) => w.absoluteTime - E.absoluteTime), A("Queued triggers for execution", {
    entries: g.map((w) => ({
      triggerId: w.trigger.id,
      absoluteTime: w.absoluteTime
    }))
  });
  for (const w of g)
    try {
      A("Executing time trigger action", {
        triggerId: w.trigger.id,
        absoluteTime: w.absoluteTime
      }), await Fc(e, w.trigger);
    } catch (E) {
      console.error(`${T} | Failed to execute time trigger action`, E), (b = (h = ui.notifications) == null ? void 0 : h.error) == null || b.call(
        h,
        v(
          "EIDOLON.TimeTrigger.TriggerActionError",
          "Failed to execute a scene time trigger action. Check the console for details."
        )
      ), A("Trigger execution failed", {
        triggerId: w.trigger.id,
        message: (E == null ? void 0 : E.message) ?? String(E)
      });
    } finally {
      o[w.trigger.id] = w.absoluteTime, l = !0, A("Recorded trigger execution", {
        triggerId: w.trigger.id,
        absoluteTime: w.absoluteTime
      });
    }
  l && (A("Persisting trigger history updates", { sceneId: e.id }), await Io(e, o)), sn();
}, "#evaluateSceneTimeTriggers"), c(vl, "TimeTriggerManager");
let os = vl;
function uf(n, e) {
  var r, a;
  const t = `${(n == null ? void 0 : n.id) ?? "unknown"}:${(e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.time) ?? "unknown"}`;
  if (Pl.has(t)) return;
  Pl.add(t);
  const i = v(
    "EIDOLON.TimeTrigger.InvalidTimeWarning",
    "A scene time trigger has an invalid time value and was skipped."
  );
  (a = (r = ui.notifications) == null ? void 0 : r.warn) == null || a.call(r, i), console.warn(`${T} | Invalid time for trigger`, { scene: n == null ? void 0 : n.id, trigger: e });
}
c(uf, "warnInvalidTriggerTime");
var ft, Wi, ht, Yt, Pn, St, mi, $a, Da, Ji, Ki, _n, Lt, P, ls, ti, _r, cs, xr, us, Et, Vc, ds, zc, fs, Gc, Fa, Pa, _a, xa, Ra, Ha, hs, Wc, Rr, qa, Ba;
const El = class El {
  constructor() {
    I(this, P);
    I(this, ft, !1);
    I(this, Wi, hr);
    I(this, ht, /* @__PURE__ */ new Map());
    I(this, Yt, null);
    I(this, Pn, null);
    I(this, St, 0);
    I(this, mi, null);
    I(this, $a, null);
    I(this, Da, null);
    I(this, Ji, !1);
    I(this, Ki, !1);
    I(this, _n, !1);
    I(this, Lt, !1);
    I(this, Fa, /* @__PURE__ */ c((e, t = {}) => {
      A("GameTimeAutomation | Pause state changed", {
        paused: e,
        userId: (t == null ? void 0 : t.userId) ?? null,
        broadcast: (t == null ? void 0 : t.broadcast) ?? null
      }), C(this, P, Et).call(this, { pausedOverride: e });
    }, "#handlePause"));
    I(this, Pa, /* @__PURE__ */ c((e) => {
      e != null && e.id && (f(this, ht).set(e.id, Math.max(e.round ?? 0, 1)), A("GameTimeAutomation | Combat started", { combatId: e.id, round: e.round ?? 0 }), C(this, P, Et).call(this));
    }, "#handleCombatStart"));
    I(this, _a, /* @__PURE__ */ c((e, t) => {
      if (!(e != null && e.id)) return;
      const i = typeof t == "number" && Number.isFinite(t) ? t : typeof e.round == "number" && Number.isFinite(e.round) ? e.round : 0, r = i > 0 ? i : 1, a = f(this, ht).get(e.id), o = a ? Math.max(a, 1) : 1, s = r > 1 ? Math.max(r - o, 0) : 0;
      if (A("GameTimeAutomation | Combat round change detected", {
        combatId: e.id,
        effectiveRound: r,
        completedRounds: s,
        enabled: f(this, ft),
        paused: (game == null ? void 0 : game.paused) ?? null
      }), s > 0 && f(this, ft) && f(this, Lt) && !(game != null && game.paused) && C(this, P, ti).call(this) && C(this, P, _r).call(this, e)) {
        const l = s * f(this, Wi);
        l > 0 && (A("GameTimeAutomation | Advancing time for completed combat rounds", {
          combatId: e.id,
          completedRounds: s,
          delta: l
        }), C(this, P, fs).call(this, l));
      }
      f(this, ht).set(e.id, Math.max(r, 1));
    }, "#handleCombatRound"));
    I(this, xa, /* @__PURE__ */ c((e) => {
      e != null && e.id && (f(this, ht).delete(e.id), A("GameTimeAutomation | Combat ended", { combatId: e.id }), C(this, P, Et).call(this));
    }, "#handleCombatEnd"));
    I(this, Ra, /* @__PURE__ */ c((e) => {
      e != null && e.id && (f(this, ht).delete(e.id), A("GameTimeAutomation | Combat deleted", { combatId: e.id }), C(this, P, Et).call(this));
    }, "#handleCombatDelete"));
    I(this, Ha, /* @__PURE__ */ c((e, t) => {
      if (e != null && e.id) {
        if (typeof (t == null ? void 0 : t.round) == "number" && Number.isFinite(t.round)) {
          const i = Math.max(t.round, 1);
          f(this, ht).set(e.id, i), A("GameTimeAutomation | Combat round manually updated", {
            combatId: e.id,
            round: i
          });
        }
        (Object.prototype.hasOwnProperty.call(t ?? {}, "active") || (t == null ? void 0 : t.round) !== void 0) && C(this, P, Et).call(this);
      }
    }, "#handleCombatUpdate"));
    I(this, qa, /* @__PURE__ */ c((e) => {
      C(this, P, Rr).call(this, e == null ? void 0 : e.scene), C(this, P, Et).call(this);
    }, "#handleCanvasReady"));
    I(this, Ba, /* @__PURE__ */ c((e) => {
      if (!He(e)) return;
      const t = C(this, P, hs).call(this);
      if (!t || t.id !== e.id) return;
      C(this, P, Rr).call(this, e) && C(this, P, Et).call(this);
    }, "#handleSceneUpdate"));
  }
  registerHooks() {
    f(this, Ji) || (S(this, Ji, !0), Hooks.on("pauseGame", f(this, Fa)), Hooks.on("combatStart", f(this, Pa)), Hooks.on("combatRound", f(this, _a)), Hooks.on("combatEnd", f(this, xa)), Hooks.on("deleteCombat", f(this, Ra)), Hooks.on("updateCombat", f(this, Ha)), Hooks.on("canvasReady", f(this, qa)), Hooks.on("updateScene", f(this, Ba)));
  }
  initialize() {
    f(this, Ki) || (S(this, Ki, !0), S(this, $a, Nc((e) => {
      const t = !!e, i = t !== f(this, ft);
      S(this, ft, t), A("GameTimeAutomation | Manage time toggled", { enabled: t }), i && t && C(this, P, us).call(this), C(this, P, Et).call(this);
    })), S(this, Da, Jd((e) => {
      S(this, Wi, e), A("GameTimeAutomation | Seconds per round updated", { value: e });
    })), C(this, P, us).call(this), C(this, P, Rr).call(this), C(this, P, Et).call(this));
  }
};
ft = new WeakMap(), Wi = new WeakMap(), ht = new WeakMap(), Yt = new WeakMap(), Pn = new WeakMap(), St = new WeakMap(), mi = new WeakMap(), $a = new WeakMap(), Da = new WeakMap(), Ji = new WeakMap(), Ki = new WeakMap(), _n = new WeakMap(), Lt = new WeakMap(), P = new WeakSet(), ls = /* @__PURE__ */ c(function() {
  var e;
  try {
    if (typeof ((e = globalThis.performance) == null ? void 0 : e.now) == "function")
      return globalThis.performance.now();
  } catch (t) {
    A("GameTimeAutomation | Failed to read high-resolution timestamp", {
      message: (t == null ? void 0 : t.message) ?? String(t)
    });
  }
  return Date.now();
}, "#currentTimestamp"), ti = /* @__PURE__ */ c(function() {
  var e;
  return !!((e = game == null ? void 0 : game.user) != null && e.isGM && game.user.active !== !1);
}, "#canControlTime"), _r = /* @__PURE__ */ c(function(e) {
  var i, r;
  if (!e) return !1;
  if (e.active === !0) return !0;
  if (e.active === !1) return !1;
  const t = (i = game == null ? void 0 : game.combats) == null ? void 0 : i.active;
  return (t == null ? void 0 : t.id) === e.id ? !0 : ((r = game == null ? void 0 : game.combat) == null ? void 0 : r.id) === e.id ? game.combat.active ?? !0 : !1;
}, "#isCombatDocumentActive"), cs = /* @__PURE__ */ c(function(e) {
  return e ? typeof e.started == "boolean" ? e.started : (e.round ?? 0) > 0 : !1;
}, "#hasCombatStarted"), xr = /* @__PURE__ */ c(function() {
  var i;
  const e = Array.isArray((i = game == null ? void 0 : game.combats) == null ? void 0 : i.contents) ? game.combats.contents : [];
  for (const r of e)
    if (C(this, P, _r).call(this, r) && C(this, P, cs).call(this, r))
      return !0;
  const t = game == null ? void 0 : game.combat;
  return !!(t && C(this, P, _r).call(this, t) && C(this, P, cs).call(this, t));
}, "#isCombatRunning"), us = /* @__PURE__ */ c(function() {
  var t;
  f(this, ht).clear();
  const e = Array.isArray((t = game == null ? void 0 : game.combats) == null ? void 0 : t.contents) ? game.combats.contents : [];
  for (const i of e)
    i != null && i.id && f(this, ht).set(i.id, Math.max(i.round ?? 0, 1));
}, "#hydrateRoundTracking"), Et = /* @__PURE__ */ c(function({ pausedOverride: e } = {}) {
  const t = typeof e == "boolean" ? e : !!(game != null && game.paused), i = f(this, ft), r = f(this, Lt), a = i && r, o = {
    manageTimeEnabled: i,
    sceneAllowsRealTime: r,
    effectiveEnabled: a,
    paused: t,
    canControl: C(this, P, ti).call(this),
    combatRunning: C(this, P, xr).call(this),
    overrideApplied: typeof e == "boolean"
  };
  if (A("GameTimeAutomation | Sync running state", o), !a || !C(this, P, ti).call(this)) {
    C(this, P, ds).call(this);
    return;
  }
  C(this, P, Vc).call(this);
}, "#syncRunningState"), Vc = /* @__PURE__ */ c(function() {
  f(this, Yt) === null && (S(this, Pn, C(this, P, ls).call(this)), S(this, Yt, globalThis.setInterval(() => C(this, P, zc).call(this), 1e3)), A("GameTimeAutomation | Started real-time ticker"));
}, "#startRealTimeTicker"), ds = /* @__PURE__ */ c(function() {
  f(this, Yt) !== null && (globalThis.clearInterval(f(this, Yt)), S(this, Yt, null), A("GameTimeAutomation | Stopped real-time ticker")), S(this, Pn, null), S(this, St, 0), S(this, _n, !1);
}, "#stopRealTimeTicker"), zc = /* @__PURE__ */ c(function() {
  if (!f(this, ft) || !f(this, Lt) || !C(this, P, ti).call(this)) {
    C(this, P, ds).call(this);
    return;
  }
  const e = C(this, P, ls).call(this);
  if (typeof e != "number" || !Number.isFinite(e)) return;
  const t = f(this, Pn) ?? e, i = (e - t) / 1e3;
  if (S(this, Pn, e), !Number.isFinite(i) || i <= 0) return;
  const r = !!(game != null && game.paused), a = C(this, P, xr).call(this);
  if (r || a) {
    f(this, _n) || A("GameTimeAutomation | Tick skipped", { paused: r, combatRunning: a }), S(this, _n, !0), S(this, St, 0);
    return;
  }
  S(this, _n, !1), A("GameTimeAutomation | Real-time tick", { deltaSeconds: i }), C(this, P, fs).call(this, i);
}, "#tickRealTime"), fs = /* @__PURE__ */ c(function(e) {
  if (!f(this, ft) || !f(this, Lt)) return;
  const t = Number(e);
  !Number.isFinite(t) || t <= 0 || (S(this, St, f(this, St) + t), !f(this, mi) && S(this, mi, C(this, P, Gc).call(this)));
}, "#queueAdvance"), Gc = /* @__PURE__ */ c(async function() {
  var e, t;
  for (; f(this, St) > 0; ) {
    if (!f(this, ft) || !f(this, Lt) || game != null && game.paused || !C(this, P, ti).call(this) || C(this, P, xr).call(this)) {
      S(this, St, 0);
      break;
    }
    const i = f(this, St);
    S(this, St, 0);
    try {
      if (typeof ((e = game == null ? void 0 : game.time) == null ? void 0 : e.advance) == "function")
        A("GameTimeAutomation | Advancing world time", { delta: i }), await game.time.advance(i), A("GameTimeAutomation | World time advanced", {
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
  S(this, mi, null);
}, "#flushAdvanceQueue"), Fa = new WeakMap(), Pa = new WeakMap(), _a = new WeakMap(), xa = new WeakMap(), Ra = new WeakMap(), Ha = new WeakMap(), hs = /* @__PURE__ */ c(function() {
  const e = Pi();
  return He(e) ? e : null;
}, "#getActiveSceneDocument"), Wc = /* @__PURE__ */ c(function(e) {
  if (!He(e)) return !1;
  try {
    return !!e.getFlag(T, jo);
  } catch (t) {
    return A("GameTimeAutomation | Failed to read scene real-time flag", {
      sceneId: (e == null ? void 0 : e.id) ?? null,
      message: (t == null ? void 0 : t.message) ?? String(t)
    }), !1;
  }
}, "#isSceneRealTimeAllowed"), Rr = /* @__PURE__ */ c(function(e) {
  const t = He(e) ? e : C(this, P, hs).call(this), i = C(this, P, Wc).call(this, t), r = f(this, Lt);
  return S(this, Lt, i), r !== i ? (A("GameTimeAutomation | Scene real-time allowance changed", {
    sceneId: (t == null ? void 0 : t.id) ?? null,
    allows: i
  }), !0) : !1;
}, "#refreshSceneAutomationState"), qa = new WeakMap(), Ba = new WeakMap(), c(El, "GameTimeAutomation");
let ss = El;
var vc, Qt, $e, xn, Rt, ja, ye, Jc, Kc, Yc, Qc, Ua, ms, Va, Xc, za, Zc, eu;
const Pt = class Pt extends bn(yn) {
  constructor(t = {}) {
    const { scene: i, trigger: r, triggerIndex: a, onSave: o, ...s } = t ?? {};
    super(s);
    I(this, ye);
    I(this, Qt, null);
    I(this, $e, null);
    I(this, xn, null);
    I(this, Rt, null);
    I(this, ja, /* @__PURE__ */ c(() => {
      (this.rendered ?? this.isRendered ?? !1) && (S(this, Rt, C(this, ye, Jc).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    I(this, Ua, /* @__PURE__ */ c((t) => {
      var a, o;
      const i = t.currentTarget, r = i == null ? void 0 : i.closest("form");
      r && (A("Trigger action selection changed", {
        sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
        triggerId: ((o = this.trigger) == null ? void 0 : o.id) ?? null,
        actionId: (i == null ? void 0 : i.value) ?? null
      }), C(this, ye, ms).call(this, i.value, r));
    }, "#onActionSelectChange"));
    I(this, Va, /* @__PURE__ */ c((t) => {
      var u, d, g, m;
      t.preventDefault();
      const i = t.currentTarget, r = i == null ? void 0 : i.closest("form");
      if (!r) return;
      const a = (u = i.dataset) == null ? void 0 : u.target;
      if (!a) return;
      const o = typeof (CSS == null ? void 0 : CSS.escape) == "function" ? CSS.escape : (y) => y, s = r.querySelector(`[name="${o(a)}"]`);
      if (!s) return;
      A("Opening file picker for trigger", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        triggerId: ((g = this.trigger) == null ? void 0 : g.id) ?? null,
        target: a
      }), new FilePicker({
        type: ((m = i.dataset) == null ? void 0 : m.type) || "audio",
        current: s.value,
        callback: /* @__PURE__ */ c((y) => {
          var p, h;
          s.value = y, s.dispatchEvent(new Event("change")), A("Trigger form file selected", {
            sceneId: ((p = this.scene) == null ? void 0 : p.id) ?? null,
            triggerId: ((h = this.trigger) == null ? void 0 : h.id) ?? null,
            target: a,
            path: y
          });
        }, "callback")
      }).render({ force: !0 });
    }, "#onFilePicker"));
    I(this, za, /* @__PURE__ */ c(async (t) => {
      var r, a;
      t.preventDefault();
      const i = t.currentTarget;
      i instanceof HTMLFormElement && (A("Trigger form submitted", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null,
        triggerId: ((a = this.trigger) == null ? void 0 : a.id) ?? null
      }), await C(this, ye, Zc).call(this, i));
    }, "#onSubmit"));
    this.scene = i ?? null, this.trigger = r ?? null, this.triggerIndex = Number.isInteger(a) ? Number(a) : null, this.onSave = typeof o == "function" ? o : null, S(this, xn, rl(f(this, ja)));
  }
  async _prepareContext() {
    var t, i;
    Ti("TriggerFormApplication#_prepareContext", {
      sceneId: ((t = this.scene) == null ? void 0 : t.id) ?? null,
      triggerId: ((i = this.trigger) == null ? void 0 : i.id) ?? null,
      triggerIndex: this.triggerIndex
    });
    try {
      const r = this.trigger ?? { action: Pr, data: {} }, a = r.action ?? Pr, o = Fl(r.time), s = o.format ?? "12h", l = s === "12h" ? cf() : [], u = o.period ?? (l.length > 0 ? l[0].value : null), d = s === "12h" ? l.map((y) => ({
        ...y,
        selected: y.value === u
      })) : [], g = Dl().map((y) => ({
        id: y.id,
        label: typeof y.label == "function" ? y.label() : y.label,
        selected: y.id === a
      })), m = Dl().map((y) => {
        const p = y.id === r.action ? r : { ...r, action: y.id }, h = tf(p);
        return h ? {
          id: y.id,
          visible: y.id === a,
          content: h
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
        actions: g,
        actionSections: m,
        allowReplayOnRewind: !!r.allowReplayOnRewind,
        labels: {
          time: v("EIDOLON.TimeTrigger.TriggerTime", "Trigger Time"),
          hour: v("EIDOLON.TimeTrigger.TriggerTimeHour", "Hour"),
          minute: v("EIDOLON.TimeTrigger.TriggerTimeMinute", "Minute"),
          period: v("EIDOLON.TimeTrigger.TriggerTimePeriod", "AM / PM"),
          action: v("EIDOLON.TimeTrigger.TriggerAction", "Action"),
          allowReplayOnRewind: v(
            "EIDOLON.TimeTrigger.AllowReplayOnRewind",
            "Allow replay after rewinding time"
          ),
          allowReplayOnRewindHint: v(
            "EIDOLON.TimeTrigger.AllowReplayOnRewindHint",
            "When enabled, this trigger can fire again if world time moves backward."
          ),
          save: v("EIDOLON.TimeTrigger.TriggerSave", "Save Trigger")
        }
      };
    } finally {
      sn();
    }
  }
  _onRender(t, i) {
    var l, u, d;
    super._onRender(t, i);
    const r = this.element;
    if (!r) return;
    A("Trigger form rendered", {
      sceneId: ((l = this.scene) == null ? void 0 : l.id) ?? null,
      triggerId: ((u = this.trigger) == null ? void 0 : u.id) ?? null
    });
    const a = Array.from(((d = document == null ? void 0 : document.body) == null ? void 0 : d.classList) ?? []).find(
      (g) => g.startsWith("theme-")
    );
    a && r.classList.add(a);
    const o = r.querySelector("form");
    if (!o) return;
    C(this, ye, Xc).call(this, o), C(this, ye, Kc).call(this, o), o.addEventListener("submit", f(this, za));
    const s = o.querySelector("[data-action-select]");
    s && (s.addEventListener("change", f(this, Ua)), C(this, ye, ms).call(this, s.value, o)), o.querySelectorAll("[data-action-file-picker]").forEach((g) => {
      g.addEventListener("click", f(this, Va));
    });
  }
  async close(t = {}) {
    var i;
    if ((i = f(this, Qt)) == null || i.call(this), S(this, Qt, null), S(this, $e, null), S(this, Rt, null), typeof f(this, xn) == "function")
      try {
        f(this, xn).call(this);
      } catch (r) {
        console.error(`${T} | Failed to dispose trigger form time format subscription`, r);
      }
    return S(this, xn, null), super.close(t);
  }
};
Qt = new WeakMap(), $e = new WeakMap(), xn = new WeakMap(), Rt = new WeakMap(), ja = new WeakMap(), ye = new WeakSet(), Jc = /* @__PURE__ */ c(function() {
  var s, l, u, d, g, m, y;
  const t = (l = (s = this.element) == null ? void 0 : s.querySelector) == null ? void 0 : l.call(s, "form");
  if (!(t instanceof HTMLFormElement)) return null;
  const i = Array.from(t.elements ?? []), r = [];
  for (const p of i)
    if ((p instanceof HTMLInputElement || p instanceof HTMLSelectElement || p instanceof HTMLTextAreaElement) && p.name && !(((u = p.dataset) == null ? void 0 : u.timeHidden) !== void 0 || ((d = p.dataset) == null ? void 0 : d.timeHour) !== void 0 || ((g = p.dataset) == null ? void 0 : g.timeMinute) !== void 0 || ((m = p.dataset) == null ? void 0 : m.timePeriod) !== void 0)) {
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
          values: Array.from(p.selectedOptions ?? []).map((h) => h.value)
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
    const p = a.querySelector("[data-time-hidden]"), h = a.querySelector("[data-time-hour]"), b = a.querySelector("[data-time-minute]"), w = a.querySelector("[data-time-period]");
    o = {
      format: ((y = a.dataset) == null ? void 0 : y.timeFormat) ?? null,
      canonical: p instanceof HTMLInputElement ? p.value : "",
      hour: h instanceof HTMLInputElement ? h.value : "",
      minute: b instanceof HTMLInputElement ? b.value : "",
      period: w instanceof HTMLSelectElement ? w.value : ""
    };
  }
  return {
    fields: r,
    time: o
  };
}, "#captureFormState"), Kc = /* @__PURE__ */ c(function(t) {
  if (!f(this, Rt)) return;
  if (!(t instanceof HTMLFormElement)) {
    S(this, Rt, null);
    return;
  }
  const { fields: i = [], time: r = null } = f(this, Rt) ?? {};
  S(this, Rt, null), C(this, ye, Yc).call(this, t, i), C(this, ye, Qc).call(this, t, r);
}, "#restorePendingFormState"), Yc = /* @__PURE__ */ c(function(t, i) {
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
}, "#restoreFieldValues"), Qc = /* @__PURE__ */ c(function(t, i) {
  var E, L, O;
  const r = t.querySelector("[data-time-format]");
  if (!(r instanceof HTMLElement)) {
    typeof f(this, $e) == "function" && f(this, $e).call(this);
    return;
  }
  const a = ((E = r.dataset) == null ? void 0 : E.timeFormat) === "24h" ? "24h" : "12h", o = r.querySelector("[data-time-hour]"), s = r.querySelector("[data-time-minute]"), l = r.querySelector("[data-time-period]"), u = r.querySelector("[data-time-hidden]");
  if (!i) {
    if (o instanceof HTMLInputElement && (o.value = ""), s instanceof HTMLInputElement && (s.value = ""), l instanceof HTMLSelectElement) {
      const M = ((O = (L = l.options) == null ? void 0 : L[0]) == null ? void 0 : O.value) ?? "";
      l.value = M;
    }
    u instanceof HTMLInputElement && (u.value = ""), typeof f(this, $e) == "function" && f(this, $e).call(this);
    return;
  }
  const d = typeof i.canonical == "string" ? i.canonical : "", g = typeof i.period == "string" ? i.period : "", m = typeof i.hour == "string" ? i.hour : "", y = typeof i.minute == "string" ? i.minute : "";
  let p = "", h = "", b = g, w = d;
  if (d) {
    const M = Fl(d, a);
    p = M.hour ?? "", h = M.minute ?? "", w = M.canonical ?? d, a === "12h" ? b = M.period ?? g : b = "";
  } else
    p = m, h = y, a !== "12h" && (b = "");
  if (o instanceof HTMLInputElement && (o.value = p ?? ""), s instanceof HTMLInputElement && (s.value = h ?? ""), l instanceof HTMLSelectElement)
    if (a === "12h") {
      const M = Array.from(l.options ?? []);
      M.find((D) => D.value === b) ? l.value = b : M.length > 0 ? l.value = M[0].value : l.value = "";
    } else
      l.value = "";
  u instanceof HTMLInputElement && (u.value = w ?? ""), typeof f(this, $e) == "function" && f(this, $e).call(this);
}, "#restoreTimeInputs"), Ua = new WeakMap(), ms = /* @__PURE__ */ c(function(t, i) {
  i && i.querySelectorAll("[data-action-config]").forEach((r) => {
    const a = r.dataset.actionConfig === t;
    r.style.display = a ? "" : "none";
  });
}, "#updateActionSections"), Va = new WeakMap(), Xc = /* @__PURE__ */ c(function(t) {
  var g, m, y, p;
  if ((g = f(this, Qt)) == null || g.call(this), S(this, Qt, null), S(this, $e, null), !(t instanceof HTMLFormElement)) return;
  const i = t.querySelector("[data-time-format]"), r = ((m = i == null ? void 0 : i.dataset) == null ? void 0 : m.timeFormat) ?? null;
  if (r !== "12h" && r !== "24h")
    return;
  const a = i.querySelector("[data-time-hidden]"), o = i.querySelector("[data-time-hour]"), s = i.querySelector("[data-time-minute]"), l = r === "12h" ? i.querySelector("[data-time-period]") : null;
  if (!a || !o || !s || r === "12h" && !l) {
    A("Trigger form time inputs missing elements", {
      format: r,
      hasHidden: !!a,
      hasHour: !!o,
      hasMinute: !!s,
      hasPeriod: !!l
    });
    return;
  }
  const u = [o, s, ...l ? [l] : []], d = /* @__PURE__ */ c(() => {
    const { canonical: h, error: b } = lf(
      {
        hour: o.value,
        minute: s.value,
        period: (l == null ? void 0 : l.value) ?? null,
        time: a.value
      },
      r
    );
    a.value = h ?? "";
    const w = b ?? "";
    a.setCustomValidity(w), u.forEach((E) => {
      E.setCustomValidity(w);
    });
  }, "update");
  u.forEach((h) => {
    h.addEventListener("input", d), h.addEventListener("change", d);
  }), d(), S(this, Qt, () => {
    u.forEach((h) => {
      h.removeEventListener("input", d), h.removeEventListener("change", d);
    });
  }), S(this, $e, d), A("Trigger form configured for time input", {
    format: r,
    sceneId: ((y = this.scene) == null ? void 0 : y.id) ?? null,
    triggerId: ((p = this.trigger) == null ? void 0 : p.id) ?? null
  });
}, "#setupTimeInput"), za = new WeakMap(), Zc = /* @__PURE__ */ c(async function(t) {
  var a, o, s, l, u;
  if (typeof f(this, $e) == "function" && f(this, $e).call(this), typeof t.checkValidity == "function" && !t.checkValidity()) {
    typeof t.reportValidity == "function" && t.reportValidity(), A("Trigger form submission blocked by validity check", {
      sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
      triggerId: ((o = this.trigger) == null ? void 0 : o.id) ?? null
    });
    return;
  }
  const i = new FormData(t), r = Object.fromEntries(i.entries());
  delete r.timeHour, delete r.timeMinute, delete r.timePeriod, r.allowReplayOnRewind = ((s = t.querySelector('input[name="allowReplayOnRewind"]')) == null ? void 0 : s.checked) ?? !1, A("Processing trigger form submission", {
    sceneId: ((l = this.scene) == null ? void 0 : l.id) ?? null,
    triggerId: ((u = this.trigger) == null ? void 0 : u.id) ?? null,
    allowReplayOnRewind: r.allowReplayOnRewind
  }), await C(this, ye, eu).call(this, r), await this.close();
}, "#handleSubmit"), eu = /* @__PURE__ */ c(async function(t) {
  var a, o, s, l, u, d;
  const i = {
    id: ((a = this.trigger) == null ? void 0 : a.id) ?? jd(),
    time: t.time ?? "",
    action: t.action ?? Pr,
    allowReplayOnRewind: !!t.allowReplayOnRewind,
    data: {}
  };
  A("Persisting trigger from form", {
    sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
    triggerId: i.id,
    existingIndex: this.triggerIndex
  }), nf(i, t);
  const r = si(this.scene);
  this.triggerIndex !== null && r[this.triggerIndex] ? r[this.triggerIndex] = i : r.push(i);
  try {
    await Dc(this.scene, r), A("Trigger list saved", {
      sceneId: ((s = this.scene) == null ? void 0 : s.id) ?? null,
      triggerCount: r.length
    });
  } catch (g) {
    throw console.error(`${T} | Failed to save time trigger`, g), (u = (l = ui.notifications) == null ? void 0 : l.error) == null || u.call(
      l,
      v(
        "EIDOLON.TimeTrigger.TriggerSaveError",
        "Failed to save the scene's time triggers."
      )
    ), g;
  }
  if (this.onSave)
    try {
      this.onSave(r);
    } catch (g) {
      console.error(`${T} | Trigger onSave callback failed`, g), A("Trigger onSave callback failed", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        message: (g == null ? void 0 : g.message) ?? String(g)
      });
    }
}, "#persistTrigger"), c(Pt, "TriggerFormApplication"), pe(Pt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Ne(Pt, Pt, "DEFAULT_OPTIONS"),
  {
    id: `${T}-trigger-form`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((vc = Ne(Pt, Pt, "DEFAULT_OPTIONS")) == null ? void 0 : vc.classes) ?? [], "standard-form", "themed"])
    ),
    window: {
      title: v("EIDOLON.TimeTrigger.TriggerFormTitle", "Configure Time Trigger"),
      resizable: !1
    },
    position: {
      width: 400,
      height: "auto"
    }
  },
  { inplace: !1 }
)), pe(Pt, "PARTS", {
  content: {
    template: `modules/${T}/templates/time-trigger-form.html`
  }
});
let gs = Pt;
function jt(n) {
  return n instanceof HTMLElement ? n : (n == null ? void 0 : n[0]) instanceof HTMLElement ? n[0] : null;
}
c(jt, "asHTMLElement");
function Hr(n) {
  return typeof (n == null ? void 0 : n.changeTab) == "function";
}
c(Hr, "isAppV2");
function tu(n, e, t, i = {}) {
  if (Hr(n)) {
    n.changeTab(e, t, i);
    return;
  }
  if (typeof (n == null ? void 0 : n.activateTab) == "function") {
    const r = { ...i };
    t != null && (r.group = t), r.triggerCallback == null && (r.triggerCallback = !0), n.activateTab(e, r);
  }
}
c(tu, "setActiveTab");
function df(n) {
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
c(df, "readFormData");
const _l = Symbol.for("eidolon.sceneConfig.v13PatchedTabs");
function nu(n = {}) {
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
    moduleId: g = "eidolon-utilities",
    tabIcon: m = "fa-solid fa-puzzle-piece"
  } = n ?? {};
  if (!e)
    throw new Error("createSceneConfigTabFactory requires a tabId.");
  if (typeof a != "function")
    throw new TypeError("createSceneConfigTabFactory requires a renderContent callback.");
  const y = typeof d.log == "function" ? d.log.bind(d) : (...$) => {
    var q;
    return (q = console.debug) == null ? void 0 : q.call(console, `${o}`, ...$);
  }, p = typeof d.group == "function" ? d.group.bind(d) : (...$) => {
    var q;
    return (q = console.groupCollapsed) == null ? void 0 : q.call(console, `${o}`, ...$);
  }, h = typeof d.groupEnd == "function" ? d.groupEnd.bind(d) : () => {
    var $;
    return ($ = console.groupEnd) == null ? void 0 : $.call(console);
  }, b = Symbol(`EIDOLON_SCENE_CONFIG_TAB_CLEANUP_${e}`), w = typeof i == "function" ? i : () => null, E = typeof r == "function" ? r : () => !0, L = typeof t == "function" ? t : () => typeof t == "string" ? t : e;
  function O() {
    var J, R, B, Q, ae;
    const $ = ((R = (J = foundry == null ? void 0 : foundry.applications) == null ? void 0 : J.sheets) == null ? void 0 : R.SceneConfig) ?? ((B = CONFIG == null ? void 0 : CONFIG.Scene) == null ? void 0 : B.sheetClass);
    if (!$ || !Hr({ changeTab: (Q = $.prototype) == null ? void 0 : Q.changeTab })) return;
    const q = $[_l] ?? /* @__PURE__ */ new Set();
    if (q.has(e)) return;
    q.add(e), $[_l] = q;
    const Y = (ae = $.TABS) == null ? void 0 : ae.sheet;
    if (Y && Array.isArray(Y.tabs) && !Y.tabs.some((Z) => Z.id === e)) {
      const Z = L({ app: null, scene: null }) ?? e;
      Y.tabs.push({
        id: e,
        icon: m,
        label: Z
      });
    }
    $.PARTS && !$.PARTS[e] && ($.PARTS[e] = {
      template: `modules/${g}/templates/scene-config-tab-mount.hbs`,
      scrollable: [`.tab[data-tab="${e}"]`]
    }), y("Patched v13 SceneConfig TABS/PARTS", { tabId: e });
  }
  c(O, "patchV13SceneConfig");
  function M($, q) {
    var J, R;
    const Y = w($);
    if (!E($, Y)) {
      y("Skipped render", {
        tabId: e,
        reason: "inapplicable",
        constructor: ((J = $ == null ? void 0 : $.constructor) == null ? void 0 : J.name) ?? null
      });
      return;
    }
    p("render", {
      tabId: e,
      sceneId: (Y == null ? void 0 : Y.id) ?? null,
      constructor: ((R = $ == null ? void 0 : $.constructor) == null ? void 0 : R.name) ?? null
    });
    try {
      const B = jt(q) ?? jt($.element);
      if (!B) {
        y("Missing root element", { tabId: e });
        return;
      }
      Hr($) ? ne($, B, Y) : D($, B, Y);
    } finally {
      h();
    }
  }
  c(M, "handleRender");
  function N($, q, Y) {
    var B;
    if (!m) {
      $.textContent = q;
      return;
    }
    const J = (B = $.querySelector("i")) == null ? void 0 : B.cloneNode(!0);
    $.textContent = "";
    const R = J ?? document.createElement("i");
    if (J || (R.className = m, Y && (R.inert = !0)), $.append(R, " "), Y) {
      const Q = document.createElement("span");
      Q.textContent = q, $.append(Q);
    } else
      $.append(document.createTextNode(q));
  }
  c(N, "setButtonContent");
  function D($, q, Y) {
    var Ye, Nt, qe, Te, Qn, kt, vn, Qe, $t, F, vr, z, st, Le, Mi, Er;
    const R = [
      "nav.sheet-tabs[data-group]",
      "nav.tabs[data-group]",
      "nav.sheet-tabs",
      "nav.tabs"
    ].map((Ie) => q.querySelector(Ie)).find((Ie) => Ie instanceof HTMLElement), Q = [
      (Ye = q.querySelector(".tab[data-tab]")) == null ? void 0 : Ye.parentElement,
      q.querySelector(".sheet-body"),
      (qe = (Nt = R == null ? void 0 : R.parentElement) == null ? void 0 : Nt.querySelector) == null ? void 0 : qe.call(Nt, ":scope > .sheet-body"),
      R == null ? void 0 : R.parentElement
    ].find((Ie) => Ie instanceof HTMLElement), ae = ((Te = R == null ? void 0 : R.dataset) == null ? void 0 : Te.group) ?? ((vn = (kt = (Qn = R == null ? void 0 : R.querySelector) == null ? void 0 : Qn.call(R, "a[data-group]")) == null ? void 0 : kt.dataset) == null ? void 0 : vn.group) ?? ((F = ($t = (Qe = R == null ? void 0 : R.querySelector) == null ? void 0 : Qe.call(R, "[data-group]")) == null ? void 0 : $t.dataset) == null ? void 0 : F.group) ?? ((st = (z = (vr = Q == null ? void 0 : Q.querySelector) == null ? void 0 : vr.call(Q, ".tab[data-group]")) == null ? void 0 : z.dataset) == null ? void 0 : st.group) ?? "main";
    if (!R || !Q) {
      y("Missing navigation elements", {
        tabId: e,
        hasNav: !!R,
        hasBody: !!Q
      });
      return;
    }
    let Z = R.querySelector(`[data-tab="${e}"]`);
    if (!Z) {
      Z = document.createElement("a"), Z.dataset.action = "tab", Z.dataset.group = ae, Z.dataset.tab = e;
      const Ie = R.querySelector("a[data-tab]");
      (Le = Ie == null ? void 0 : Ie.classList) != null && Le.contains("item") && Z.classList.add("item"), R.appendChild(Z), typeof s == "function" && s({ app: $, button: Z, nav: R, scene: Y }), y("Created tab button", { tabId: e, group: ae });
    }
    N(Z, L({ app: $, scene: Y }) ?? e, Hr($));
    let ie = Q.querySelector(`.tab[data-tab="${e}"]`);
    if (!ie) {
      ie = document.createElement("div"), ie.classList.add("tab"), ie.dataset.tab = e, ie.dataset.group = ae;
      const Ie = ff(Q);
      Q.insertBefore(ie, Ie ?? null), typeof l == "function" && l({ app: $, tab: ie, body: Q, scene: Y }), y("Created tab container", { tabId: e, group: ae });
    }
    ((Mi = Z.classList) == null ? void 0 : Mi.contains("active")) || ie.classList.contains("active") ? (Z.classList.add("active"), ie.classList.add("active"), ie.removeAttribute("hidden")) : (Z.classList.remove("active"), ie.classList.remove("active"), ie.setAttribute("hidden", "true"));
    const ot = /* @__PURE__ */ c(() => {
      var En, Ni;
      ((En = Z.classList) != null && En.contains("active") || ie.classList.contains("active")) && ((Ni = Z.classList) == null || Ni.add("active"), ie.classList.add("active"), ie.removeAttribute("hidden"), ie.removeAttribute("aria-hidden"), ie.style.display === "none" && (ie.style.display = ""));
    }, "ensureTabVisible"), Me = /* @__PURE__ */ c(() => {
      ot(), requestAnimationFrame(ot);
    }, "scheduleEnsureTabVisible");
    Z.dataset.eidolonEnsureSceneTabVisibility || (Z.addEventListener("click", () => {
      tu($, e, ae), requestAnimationFrame(ot);
    }), Z.dataset.eidolonEnsureSceneTabVisibility = "true"), Oo($, b, y);
    const Ke = a({
      app: $,
      scene: Y,
      tab: ie,
      tabButton: Z,
      ensureTabVisible: ot,
      scheduleEnsureTabVisible: Me
    });
    typeof Ke == "function" && xl($, b, Ke), typeof u == "function" && u({
      app: $,
      scene: Y,
      tab: ie,
      tabButton: Z,
      ensureTabVisible: ot,
      scheduleEnsureTabVisible: Me
    }), (Er = $.setPosition) == null || Er.call($, { height: "auto" });
  }
  c(D, "handleRenderV1");
  function ne($, q, Y) {
    const J = q.querySelector(`.tab[data-tab="${e}"]`), R = q.querySelector(`nav [data-tab="${e}"]`);
    if (!J || !R) {
      y("v2 mount not found, falling back to v1 injection", { tabId: e }), D($, q, Y);
      return;
    }
    N(R, L({ app: $, scene: Y }) ?? e, !0);
    const B = /* @__PURE__ */ c(() => {
      var Z;
      !((Z = R.classList) != null && Z.contains("active")) && !J.classList.contains("active") || (J.classList.add("active"), J.removeAttribute("hidden"), J.removeAttribute("aria-hidden"), J.style.display === "none" && (J.style.display = ""));
    }, "ensureTabVisible"), Q = /* @__PURE__ */ c(() => {
      B(), requestAnimationFrame(B);
    }, "scheduleEnsureTabVisible");
    Oo($, b, y);
    const ae = a({
      app: $,
      scene: Y,
      tab: J,
      tabButton: R,
      ensureTabVisible: B,
      scheduleEnsureTabVisible: Q
    });
    typeof ae == "function" && xl($, b, ae), typeof u == "function" && u({
      app: $,
      scene: Y,
      tab: J,
      tabButton: R,
      ensureTabVisible: B,
      scheduleEnsureTabVisible: Q
    });
  }
  c(ne, "handleRenderV2");
  function K($) {
    Oo($, b, y);
  }
  c(K, "handleClose");
  function x() {
    return Hooks.once("init", () => {
      O();
    }), Hooks.on("renderSceneConfig", M), Hooks.on("closeSceneConfig", K), () => V();
  }
  c(x, "register");
  function V() {
    Hooks.off("renderSceneConfig", M), Hooks.off("closeSceneConfig", K);
  }
  return c(V, "unregister"), { register: x, unregister: V };
}
c(nu, "createSceneConfigTabFactory");
function xl(n, e, t) {
  if (!n || typeof t != "function") return;
  const i = n == null ? void 0 : n[e];
  Array.isArray(i) || (n[e] = []), n[e].push(t);
}
c(xl, "registerCleanup");
function Oo(n, e, t) {
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
c(Oo, "invokeCleanup");
function ff(n) {
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
c(ff, "findFooterElement$1");
const hf = io(gs), gf = `modules/${T}/templates/time-trigger-scene-tab.html`, mf = nu({
  tabId: "time-triggers",
  tabLabel: /* @__PURE__ */ c(() => v("EIDOLON.TimeTrigger.Tab", "Time Triggers"), "tabLabel"),
  getScene: Mt,
  isApplicable: wf,
  renderContent: /* @__PURE__ */ c(({ app: n, scene: e, tab: t }) => yf(n, t, e), "renderContent"),
  logger: {
    log: A,
    group: Ti,
    groupEnd: sn
  }
});
function pf() {
  return A("Registering SceneConfig render hook"), mf.register();
}
c(pf, "registerSceneConfigHook");
function yf(n, e, t) {
  if (!(e instanceof HTMLElement)) return;
  const i = He(t) ? t : Mt(n);
  ia(n, e, i);
  const r = rl(() => {
    ia(n, e, i);
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
c(yf, "renderTimeTriggerTab");
async function ia(n, e, t) {
  var r, a;
  const i = t ?? Mt(n);
  Ti("renderTimeTriggersTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!He(i)) {
      const J = v(
        "EIDOLON.TimeTrigger.Unavailable",
        "Time triggers are unavailable for this configuration sheet."
      );
      e.innerHTML = `<p class="notes">${J}</p>`, A("Scene lacks document for time triggers", { sceneId: (i == null ? void 0 : i.id) ?? null });
      return;
    }
    const o = `flags.${T}.${Xr}`, s = `flags.${T}.${qo}`, l = `flags.${T}.${Bo}`, u = !!i.getFlag(T, Xr), d = !!i.getFlag(T, qo), g = !!i.getFlag(T, Bo), m = si(i);
    A("Rendering time trigger list", {
      sceneId: i.id,
      isActive: u,
      shouldHideWindow: d,
      shouldShowPlayerWindow: g,
      triggerCount: m.length
    });
    const y = v("EIDOLON.TimeTrigger.Activate", "Activate Time Trigger"), p = v(
      "EIDOLON.TimeTrigger.Description",
      "Enable scene time triggers so scheduled actions can run automatically."
    ), h = v(
      "EIDOLON.TimeTrigger.HideWindowLabel",
      "Hide Floating Time Window"
    ), b = v(
      "EIDOLON.TimeTrigger.HideWindowDescription",
      "Keep the floating time control window hidden while leaving time triggers active."
    ), w = v(
      "EIDOLON.TimeTrigger.ShowPlayerWindowLabel",
      "Share Floating Time Window with Players"
    ), E = v(
      "EIDOLON.TimeTrigger.ShowPlayerWindowDescription",
      "Let non-GM players see the floating time window (without time controls)."
    ), L = v(
      "EIDOLON.TimeTrigger.TriggerListLabel",
      "Scene Time Triggers"
    ), O = v(
      "EIDOLON.TimeTrigger.TriggerListEmpty",
      "No time triggers configured for this scene."
    ), M = v("EIDOLON.TimeTrigger.AddTrigger", "Add Trigger"), N = v("EIDOLON.TimeTrigger.EditTrigger", "Edit"), D = v("EIDOLON.TimeTrigger.DeleteTrigger", "Remove"), ne = v("EIDOLON.TimeTrigger.TriggerNow", "Trigger Now"), K = v("EIDOLON.TimeTrigger.AtLabel", "At"), x = v("EIDOLON.TimeTrigger.DoLabel", "Do"), V = v("EIDOLON.TimeTrigger.MissingTime", "(No time set)"), $ = m.map((J, R) => {
      const ae = (J.time ? sf(J.time) : "") || J.time || "" || V, Z = Zd(J.action), ie = [
        `${K} ${ae}`,
        `${x} ${Z}`,
        ...ef(J)
      ];
      return {
        index: R,
        summaryParts: ie,
        tooltips: {
          triggerNow: ne,
          edit: N,
          delete: D
        }
      };
    }), q = ((a = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : a.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof q != "function") {
      console.error(`${T} | renderTemplate is unavailable; cannot render scene tab.`), e.innerHTML = `<p class="notes">${O}</p>`;
      return;
    }
    let Y = "";
    try {
      Y = await q(gf, {
        flags: {
          active: o,
          hideWindow: s,
          showPlayerWindow: l
        },
        states: {
          isActive: u,
          hideWindow: d,
          showPlayerWindow: g
        },
        labels: {
          activate: y,
          hideWindow: h,
          showPlayerWindow: w,
          triggerList: L,
          empty: O,
          add: M
        },
        hints: {
          activate: p,
          hideWindow: b,
          showPlayerWindow: E
        },
        triggers: $,
        hasTriggers: $.length > 0
      });
    } catch (J) {
      console.error(`${T} | Failed to render time trigger scene tab template`, J), e.innerHTML = `<p class="notes">${O}</p>`;
      return;
    }
    e.innerHTML = Y, bf(n, e, i);
  } finally {
    sn();
  }
}
c(ia, "renderTimeTriggersTabContent");
function bf(n, e, t) {
  const i = t ?? Mt(n);
  if (!He(i)) return;
  const r = e.querySelector('[data-action="add-trigger"]');
  r && r.addEventListener("click", () => {
    A("Add trigger button clicked", { sceneId: i.id }), Rl(n, { scene: i });
  }), e.querySelectorAll('[data-action="edit-trigger"]').forEach((a) => {
    a.addEventListener("click", () => {
      const o = Number(a.dataset.index);
      if (!Number.isInteger(o)) return;
      const l = si(i)[o];
      l && (A("Edit trigger button clicked", { sceneId: i.id, triggerId: l.id, index: o }), Rl(n, { trigger: l, triggerIndex: o, scene: i }));
    });
  }), e.querySelectorAll('[data-action="delete-trigger"]').forEach((a) => {
    a.addEventListener("click", async () => {
      var u, d;
      const o = Number(a.dataset.index);
      if (!Number.isInteger(o)) return;
      const s = si(i), l = s[o];
      if (l) {
        s.splice(o, 1);
        try {
          A("Deleting trigger", {
            sceneId: i.id,
            index: o,
            triggerId: (l == null ? void 0 : l.id) ?? null
          }), await Dc(i, s), await ia(n, e, i);
        } catch (g) {
          console.error(`${T} | Failed to delete time trigger`, g), (d = (u = ui.notifications) == null ? void 0 : u.error) == null || d.call(
            u,
            v(
              "EIDOLON.TimeTrigger.TriggerDeleteError",
              "Failed to remove the selected time trigger."
            )
          );
        }
      }
    });
  }), e.querySelectorAll('[data-action="fire-trigger"]').forEach((a) => {
    a.addEventListener("click", async () => {
      var u, d, g, m, y, p, h;
      const o = Number(a.dataset.index);
      if (!Number.isInteger(o)) return;
      const l = si(i)[o];
      if (l) {
        if (!((u = game.user) != null && u.isGM)) {
          (g = (d = ui.notifications) == null ? void 0 : d.warn) == null || g.call(
            d,
            v("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time.")
          );
          return;
        }
        try {
          A("Manually firing trigger", { sceneId: i.id, triggerId: l.id, index: o }), await Fc(i, l), (y = (m = ui.notifications) == null ? void 0 : m.info) == null || y.call(
            m,
            v(
              "EIDOLON.TimeTrigger.TriggerNowSuccess",
              "Triggered the selected time trigger."
            )
          );
        } catch (b) {
          console.error(`${T} | Failed to execute time trigger manually`, b), (h = (p = ui.notifications) == null ? void 0 : p.error) == null || h.call(
            p,
            v(
              "EIDOLON.TimeTrigger.TriggerNowError",
              "Failed to execute the selected time trigger."
            )
          ), A("Manual trigger execution failed", {
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
c(bf, "bindTimeTriggerTabEvents");
function Rl(n, e = {}) {
  var o;
  const t = e.scene ?? null, i = t && He(t) ? t : Mt(n);
  if (!He(i)) {
    console.warn(`${T} | Unable to open trigger form because no scene document is available.`);
    return;
  }
  A("Opening trigger form", {
    sceneId: i.id,
    triggerId: ((o = e.trigger) == null ? void 0 : o.id) ?? null,
    index: Number.isInteger(e.triggerIndex) ? Number(e.triggerIndex) : null
  }), hf({
    scene: i,
    trigger: e.trigger ?? null,
    triggerIndex: e.triggerIndex ?? null,
    onSave: /* @__PURE__ */ c(() => {
      var l, u;
      const s = (u = (l = n.element) == null ? void 0 : l[0]) == null ? void 0 : u.querySelector('.tab[data-tab="time-triggers"]');
      s && ia(n, s, i);
    }, "onSave")
  }).render({ force: !0 });
}
c(Rl, "openTriggerForm");
function wf(n, e) {
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
c(wf, "isRecognizedSceneConfig");
const Lr = new os(), Hl = new ss();
function vf() {
  A("Registering time trigger hooks"), Hooks.once("init", () => {
    Ud(), Kd(), A("Time trigger settings registered during init");
  }), pf(), A("Scene config hook registered"), Hl.registerHooks(), A("Time automation hooks registered"), Hooks.once("ready", () => {
    Yd(), A("Ready hook fired"), Lr.onReady(), Hl.initialize();
  }), Hooks.on("canvasReady", (n) => {
    var e;
    A("canvasReady hook received", { scene: ((e = n == null ? void 0 : n.scene) == null ? void 0 : e.id) ?? null }), Lr.onCanvasReady(n);
  }), Hooks.on("updateScene", (n) => {
    A("updateScene hook received", { scene: (n == null ? void 0 : n.id) ?? null }), Lr.onUpdateScene(n);
  }), Hooks.on("updateWorldTime", (n, e) => {
    A("updateWorldTime hook received", { worldTime: n, diff: e }), Lr.onUpdateWorldTime(n, e);
  });
}
c(vf, "registerTimeTriggerHooks");
vf();
const ve = T, iu = "criteria", ol = "state", Ef = "criteriaVersion", Tf = 1, ru = "enableCriteriaSurfaces";
let ql = !1;
function Cf() {
  var n;
  if (!ql) {
    if (ql = !0, !((n = game == null ? void 0 : game.settings) != null && n.register)) {
      console.warn(`${ve} | game.settings.register unavailable; scene criteria setting skipped.`);
      return;
    }
    game.settings.register(ve, ru, {
      name: v("EIDOLON.SceneCriteria.EnableSurfacesSettingName", "Enable Criteria Editor Surfaces"),
      hint: v(
        "EIDOLON.SceneCriteria.EnableSurfacesSettingHint",
        "Show criteria authoring surfaces (Scene > Criteria tab and tile/light editor controls). The Criteria Switcher remains available."
      ),
      scope: "world",
      config: !0,
      type: Boolean,
      default: !0,
      onChange: /* @__PURE__ */ c(() => {
        Sf();
      }, "onChange")
    });
  }
}
c(Cf, "registerSceneCriteriaSettings");
function ro() {
  var n;
  try {
    if ((n = game == null ? void 0 : game.settings) != null && n.get)
      return !!game.settings.get(ve, ru);
  } catch (e) {
    console.error(`${ve} | Failed to read criteria surfaces setting`, e);
  }
  return !0;
}
c(ro, "getCriteriaSurfacesEnabled");
function Sf() {
  var a, o, s, l, u;
  const n = v("EIDOLON.SceneCriteria.ReloadPromptTitle", "Reload Required"), e = `<p>${v(
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
    v(
      "EIDOLON.SceneCriteria.ReloadNotice",
      "Please reload the world to apply criteria editor surface changes."
    )
  );
}
c(Sf, "promptReloadForCriteriaSurfaces");
const ra = "Standard";
function at(n) {
  var t;
  const e = (t = n == null ? void 0 : n.getFlag) == null ? void 0 : t.call(n, ve, iu);
  return e ? au(e) : [];
}
c(at, "getSceneCriteria");
async function ao(n, e) {
  if (!(n != null && n.setFlag)) return;
  const t = au(e);
  await n.setFlag(ve, iu, t), await n.setFlag(ve, Ef, Tf);
  const i = mr(n, t);
  await n.setFlag(ve, ol, i);
}
c(ao, "setSceneCriteria");
function mr(n, e = null) {
  var r;
  const t = Array.isArray(e) ? e : at(n), i = At(((r = n == null ? void 0 : n.getFlag) == null ? void 0 : r.call(n, ve, ol)) ?? {});
  return ll(i, t);
}
c(mr, "getSceneCriteriaState");
async function Lf(n, e, t = null) {
  if (!(n != null && n.setFlag)) return;
  const i = Array.isArray(t) ? t : at(n), r = ll(e, i);
  await n.setFlag(ve, ol, r);
}
c(Lf, "setSceneCriteriaState");
function sl(n = "") {
  const e = typeof n == "string" ? n.trim() : "", t = ou(ys(e || "criterion"), /* @__PURE__ */ new Set());
  return {
    id: su(),
    key: t,
    label: e,
    values: [ra],
    default: ra,
    order: 0
  };
}
c(sl, "createSceneCriterion");
function au(n) {
  const e = Array.isArray(n) ? At(n) : [], t = [], i = /* @__PURE__ */ new Set();
  return e.forEach((r, a) => {
    const o = ps(r, a, i);
    o && (t.push(o), i.add(o.key));
  }), t;
}
c(au, "sanitizeCriteria$1");
function ps(n, e = 0, t = /* @__PURE__ */ new Set()) {
  if (!n || typeof n != "object") return null;
  const i = typeof n.id == "string" && n.id.trim() ? n.id.trim() : su(), a = (typeof n.label == "string" ? n.label : typeof n.name == "string" ? n.name : "").trim(), o = typeof n.key == "string" && n.key.trim() ? ys(n.key) : ys(a || `criterion-${Number(e) + 1}`), s = ou(o, t), l = Of(n.values);
  let u = typeof n.default == "string" ? n.default.trim() : "";
  u || (u = l[0] ?? ra), l.includes(u) || l.unshift(u);
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
c(ps, "sanitizeCriterion");
function ll(n, e = []) {
  const t = n && typeof n == "object" ? At(n) : {}, i = {};
  for (const r of e) {
    const a = t == null ? void 0 : t[r.key], o = typeof a == "string" ? a.trim() : "";
    o && r.values.includes(o) ? i[r.key] = o : i[r.key] = r.default;
  }
  return i;
}
c(ll, "sanitizeSceneCriteriaState");
function If(n) {
  return at(n).map((t) => ({
    id: t.key,
    key: t.key,
    name: t.label,
    values: [...t.values]
  }));
}
c(If, "getSceneCriteriaCategories");
function Of(n) {
  const e = Array.isArray(n) ? n : [], t = [];
  for (const i of e) {
    if (typeof i != "string") continue;
    const r = i.trim();
    !r || t.includes(r) || t.push(r);
  }
  return t.length || t.push(ra), t;
}
c(Of, "sanitizeCriterionValues");
function ys(n) {
  return String(n ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
c(ys, "slugifyCriterionKey");
function ou(n, e) {
  if (!e.has(n)) return n;
  let t = 2;
  for (; e.has(`${n}-${t}`); )
    t += 1;
  return `${n}-${t}`;
}
c(ou, "ensureUniqueCriterionKey");
function su() {
  var n;
  return (n = foundry == null ? void 0 : foundry.utils) != null && n.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 11);
}
c(su, "generateCriterionId");
function lu(n) {
  var e, t;
  console.error(`${ve} | Failed to persist scene criteria`, n), (t = (e = ui.notifications) == null ? void 0 : e.error) == null || t.call(
    e,
    v(
      "EIDOLON.SceneCriteria.PersistError",
      "Failed to persist the scene criteria."
    )
  );
}
c(lu, "notifyPersistError");
var Ec, de, Ht, Ae, cu, Ga, Wa, Ja, Ka, qr, Ya, Yi, Qi, _i, uu;
const _t = class _t extends bn(yn) {
  constructor(t = {}) {
    const { scene: i, criterion: r, isNew: a, onSave: o, ...s } = t ?? {};
    super(s);
    I(this, Ae);
    I(this, de, null);
    I(this, Ht, !1);
    I(this, Ga, /* @__PURE__ */ c(async (t) => {
      t.preventDefault();
      const i = t.currentTarget;
      if (!(i instanceof HTMLFormElement)) return;
      const r = new FormData(i), a = String(r.get("criterionLabel") ?? "").trim(), o = String(r.get("criterionKey") ?? "").trim(), s = Array.from(i.querySelectorAll('[name="criterionValues"]')).map((g) => g instanceof HTMLInputElement ? g.value.trim() : "").filter((g, m, y) => g && y.indexOf(g) === m), u = String(r.get("criterionDefault") ?? "").trim() || s[0] || "Standard", d = ps(
        {
          id: f(this, de).id,
          key: o,
          label: a,
          values: s,
          default: u,
          order: Number(f(this, de).order ?? 0)
        },
        0,
        /* @__PURE__ */ new Set()
      );
      d && (S(this, de, d), await C(this, Ae, uu).call(this), this.close());
    }, "#onSubmit"));
    I(this, Wa, /* @__PURE__ */ c((t) => {
      var o;
      if (f(this, Ht)) return;
      const i = t.currentTarget, r = (i == null ? void 0 : i.form) ?? ((o = this.element) == null ? void 0 : o.querySelector("form"));
      if (!(r instanceof HTMLFormElement)) return;
      const a = r.querySelector('input[name="criterionKey"]');
      a instanceof HTMLInputElement && (a.value = Di(i.value));
    }, "#onLabelInput"));
    I(this, Ja, /* @__PURE__ */ c((t) => {
      var l;
      const i = t.currentTarget, r = (i == null ? void 0 : i.form) ?? ((l = this.element) == null ? void 0 : l.querySelector("form"));
      if (!(r instanceof HTMLFormElement) || !(i instanceof HTMLInputElement)) return;
      const a = r.querySelector('input[name="criterionLabel"]'), o = Di(a instanceof HTMLInputElement ? a.value : ""), s = Di(i.value);
      S(this, Ht, s !== o), i.value = s, C(this, Ae, qr).call(this, r);
    }, "#onKeyInput"));
    I(this, Ka, /* @__PURE__ */ c((t) => {
      var o, s;
      t.preventDefault();
      const i = ((o = t.currentTarget) == null ? void 0 : o.form) ?? ((s = this.element) == null ? void 0 : s.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector('input[name="criterionLabel"]'), a = i.querySelector('input[name="criterionKey"]');
      a instanceof HTMLInputElement && (a.value = Di(r instanceof HTMLInputElement ? r.value : ""), S(this, Ht, !1), C(this, Ae, qr).call(this, i));
    }, "#onResetAutoKey"));
    I(this, Ya, /* @__PURE__ */ c((t) => {
      var l, u, d, g, m, y;
      t.preventDefault();
      const i = ((l = t.currentTarget) == null ? void 0 : l.form) ?? ((u = this.element) == null ? void 0 : u.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector(".scene-criterion-editor__values");
      if (!(r instanceof HTMLElement)) return;
      (d = r.querySelector(".scene-criterion-editor__empty")) == null || d.remove();
      const a = document.createElement("div");
      a.classList.add("scene-criterion-editor__value");
      const o = bt(v("EIDOLON.SceneCriteria.ValuePlaceholder", "Allowed value")), s = bt(v("EIDOLON.SceneCriteria.RemoveValue", "Remove Value"));
      a.innerHTML = `
      <input type="text" name="criterionValues" value="" placeholder="${o}" class="form-control">
      <button type="button" class="icon" data-action="remove-value" aria-label="${s}" title="${s}">
        <i class="fa-solid fa-trash"></i>
      </button>
    `, r.appendChild(a), (g = a.querySelector('[data-action="remove-value"]')) == null || g.addEventListener("click", f(this, Yi)), (m = a.querySelector('input[name="criterionValues"]')) == null || m.addEventListener("input", f(this, Qi)), C(this, Ae, _i).call(this, i), (y = a.querySelector('input[name="criterionValues"]')) == null || y.focus();
    }, "#onAddValue"));
    I(this, Yi, /* @__PURE__ */ c((t) => {
      var a, o, s, l;
      t.preventDefault(), (o = (a = t.currentTarget) == null ? void 0 : a.closest(".scene-criterion-editor__value")) == null || o.remove();
      const i = ((s = t.currentTarget) == null ? void 0 : s.form) ?? ((l = this.element) == null ? void 0 : l.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector(".scene-criterion-editor__values");
      if (r instanceof HTMLElement) {
        if (!r.querySelector(".scene-criterion-editor__value")) {
          const u = document.createElement("p");
          u.classList.add("notes", "scene-criterion-editor__empty"), u.textContent = v(
            "EIDOLON.SceneCriteria.ValueListEmpty",
            "No values have been added to this criterion."
          ), r.appendChild(u);
        }
        C(this, Ae, _i).call(this, i);
      }
    }, "#onRemoveValue"));
    I(this, Qi, /* @__PURE__ */ c((t) => {
      var r, a;
      const i = ((r = t.currentTarget) == null ? void 0 : r.form) ?? ((a = this.element) == null ? void 0 : a.querySelector("form"));
      i instanceof HTMLFormElement && C(this, Ae, _i).call(this, i);
    }, "#onValuesChanged"));
    this.scene = i ?? null, this.criterion = r ?? null, this.onSave = typeof o == "function" ? o : null, this.isNew = !!a, S(this, de, C(this, Ae, cu).call(this)), S(this, Ht, f(this, de).key !== Di(f(this, de).label));
  }
  async _prepareContext() {
    var i, r, a, o;
    const t = Array.isArray((i = f(this, de)) == null ? void 0 : i.values) ? f(this, de).values : [];
    return {
      isNew: this.isNew,
      key: ((r = f(this, de)) == null ? void 0 : r.key) ?? "",
      label: ((a = f(this, de)) == null ? void 0 : a.label) ?? "",
      defaultValue: ((o = f(this, de)) == null ? void 0 : o.default) ?? "",
      values: t.map((s, l) => {
        var u;
        return {
          index: l,
          value: s,
          selected: s === ((u = f(this, de)) == null ? void 0 : u.default)
        };
      }),
      hasValues: t.length > 0,
      labels: {
        label: v("EIDOLON.SceneCriteria.CategoryNameLabel", "Criterion Label"),
        key: v("EIDOLON.SceneCriteria.CriteriaKey", "Key"),
        values: v("EIDOLON.SceneCriteria.ValuesLabel", "Allowed Values"),
        default: v("EIDOLON.SceneCriteria.DefaultValue", "Default Value"),
        empty: v(
          "EIDOLON.SceneCriteria.ValueListEmpty",
          "No values have been added to this criterion."
        ),
        addValue: v("EIDOLON.SceneCriteria.AddValue", "Add Value"),
        removeValue: v("EIDOLON.SceneCriteria.RemoveValue", "Remove Value"),
        valuePlaceholder: v("EIDOLON.SceneCriteria.ValuePlaceholder", "Allowed value"),
        resetAutoKey: v("EIDOLON.SceneCriteria.ResetAutoKey", "Reset to Auto"),
        save: this.isNew ? v("EIDOLON.SceneCriteria.CreateCategory", "Add Criterion") : v("EIDOLON.SceneCriteria.SaveCategory", "Save Criterion"),
        cancel: v("EIDOLON.SceneCriteria.CancelEdit", "Cancel")
      },
      keyIsCustom: f(this, Ht)
    };
  }
  _onRender(t, i) {
    var a, o, s, l, u, d;
    super._onRender(t, i);
    const r = (a = this.element) == null ? void 0 : a.querySelector("form");
    r && (r.addEventListener("submit", f(this, Ga)), (o = r.querySelector('[data-action="add-value"]')) == null || o.addEventListener("click", f(this, Ya)), (s = r.querySelector('input[name="criterionLabel"]')) == null || s.addEventListener("input", f(this, Wa)), (l = r.querySelector('input[name="criterionKey"]')) == null || l.addEventListener("input", f(this, Ja)), (u = r.querySelector('[data-action="reset-auto-key"]')) == null || u.addEventListener("click", f(this, Ka)), r.querySelectorAll('[data-action="remove-value"]').forEach((g) => {
      g.addEventListener("click", f(this, Yi));
    }), r.querySelectorAll('input[name="criterionValues"]').forEach((g) => {
      g.addEventListener("input", f(this, Qi));
    }), (d = r.querySelector('[data-action="cancel"]')) == null || d.addEventListener("click", (g) => {
      g.preventDefault(), this.close();
    }), C(this, Ae, qr).call(this, r), C(this, Ae, _i).call(this, r));
  }
};
de = new WeakMap(), Ht = new WeakMap(), Ae = new WeakSet(), cu = /* @__PURE__ */ c(function() {
  const t = ps(this.criterion, 0, /* @__PURE__ */ new Set()) ?? sl(v("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion"));
  return {
    id: t.id,
    key: t.key,
    label: t.label ?? "",
    values: Array.isArray(t.values) ? [...t.values] : [],
    default: t.default
  };
}, "#initializeState"), Ga = new WeakMap(), Wa = new WeakMap(), Ja = new WeakMap(), Ka = new WeakMap(), qr = /* @__PURE__ */ c(function(t) {
  const i = t.querySelector('[data-action="reset-auto-key"]');
  i instanceof HTMLButtonElement && (i.disabled = !f(this, Ht));
}, "#syncAutoKeyButton"), Ya = new WeakMap(), Yi = new WeakMap(), Qi = new WeakMap(), _i = /* @__PURE__ */ c(function(t) {
  var l, u;
  const i = t.querySelector('select[name="criterionDefault"]');
  if (!(i instanceof HTMLSelectElement)) return;
  const r = ((u = (l = i.value) == null ? void 0 : l.trim) == null ? void 0 : u.call(l)) ?? "", a = Array.from(t.querySelectorAll('input[name="criterionValues"]')).map((d) => d instanceof HTMLInputElement ? d.value.trim() : "").filter((d, g, m) => d && m.indexOf(d) === g), o = i.dataset.emptyLabel || v("EIDOLON.SceneCriteria.ValueListEmpty", "No values have been added to this criterion.");
  if (i.innerHTML = "", !a.length) {
    const d = document.createElement("option");
    d.value = "", d.textContent = o, d.selected = !0, i.appendChild(d);
    return;
  }
  const s = a.includes(r) ? r : a[0];
  for (const d of a) {
    const g = document.createElement("option");
    g.value = d, g.textContent = d, g.selected = d === s, i.appendChild(g);
  }
}, "#syncDefaultOptions"), uu = /* @__PURE__ */ c(async function() {
  if (!this.scene) return;
  const t = at(this.scene).sort((r, a) => r.order - a.order), i = t.findIndex((r) => r.id === f(this, de).id);
  i < 0 ? (f(this, de).order = t.length, t.push(f(this, de))) : (f(this, de).order = t[i].order, t.splice(i, 1, f(this, de)));
  try {
    await ao(this.scene, t), this.onSave && await this.onSave(f(this, de));
  } catch (r) {
    lu(r);
  }
}, "#persist"), c(_t, "CategoryEditorApplication"), pe(_t, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Ne(_t, _t, "DEFAULT_OPTIONS"),
  {
    id: `${ve}-criterion-editor`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Ec = Ne(_t, _t, "DEFAULT_OPTIONS")) == null ? void 0 : Ec.classes) ?? [], "standard-form", "themed"])
    ),
    window: {
      title: v("EIDOLON.SceneCriteria.EditCategory", "Edit Criterion"),
      resizable: !1
    },
    position: {
      width: 460,
      height: "auto"
    }
  },
  { inplace: !1 }
)), pe(_t, "PARTS", {
  content: {
    template: `modules/${ve}/templates/scene-criteria-editor.html`
  }
});
let bs = _t;
function Di(n) {
  return String(n ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
c(Di, "slugifyKey");
const Af = `modules/${ve}/templates/scene-criteria-tab.html`, ws = {
  log: /* @__PURE__ */ c((...n) => {
    var e;
    return (e = console.debug) == null ? void 0 : e.call(console, `${ve} | Criteria`, ...n);
  }, "log"),
  group: /* @__PURE__ */ c((...n) => {
    var e;
    return (e = console.groupCollapsed) == null ? void 0 : e.call(console, `${ve} | Criteria`, ...n);
  }, "group"),
  groupEnd: /* @__PURE__ */ c(() => {
    var n;
    return (n = console.groupEnd) == null ? void 0 : n.call(console);
  }, "groupEnd")
}, Mf = io(bs), Nf = nu({
  tabId: "criteria",
  tabLabel: /* @__PURE__ */ c(() => v("EIDOLON.SceneCriteria.TabLabel", "Criteria"), "tabLabel"),
  getScene: Mt,
  isApplicable: /* @__PURE__ */ c(() => ro(), "isApplicable"),
  renderContent: /* @__PURE__ */ c(({ app: n, tab: e, scene: t }) => $f(n, e, t), "renderContent"),
  logger: ws
});
function kf() {
  return Nf.register();
}
c(kf, "registerSceneCriteriaConfigHook");
function $f(n, e, t) {
  if (!(e instanceof HTMLElement)) return;
  const i = He(t) ? t : Mt(n);
  ni(n, e, i);
}
c($f, "renderCriteriaTab");
async function ni(n, e, t) {
  var r, a;
  const i = t ?? Mt(n);
  ws.group("renderCriteriaTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!He(i)) {
      const d = v(
        "EIDOLON.SceneCriteria.Unavailable",
        "Scene criteria are unavailable for this configuration sheet."
      );
      e.innerHTML = `<p class="notes">${d}</p>`;
      return;
    }
    const o = at(i).sort((d, g) => d.order - g.order), s = mr(i, o), l = ((a = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : a.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof l != "function") {
      e.innerHTML = `<p class="notes">${v("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
      return;
    }
    const u = await l(Af, {
      description: v(
        "EIDOLON.SceneCriteria.Description",
        "Define scene criteria dimensions and allowed values used by matching rules."
      ),
      labels: {
        list: v("EIDOLON.SceneCriteria.CategoryListLabel", "Scene Criteria"),
        empty: v(
          "EIDOLON.SceneCriteria.CategoryListEmpty",
          "No criteria configured for this scene."
        ),
        add: v("EIDOLON.SceneCriteria.AddCategory", "Add Criterion"),
        edit: v("EIDOLON.SceneCriteria.EditCategory", "Edit Criterion"),
        remove: v("EIDOLON.SceneCriteria.RemoveCategory", "Remove Criterion"),
        moveUp: v("EIDOLON.SceneCriteria.MoveUp", "Move Up"),
        moveDown: v("EIDOLON.SceneCriteria.MoveDown", "Move Down"),
        values: v("EIDOLON.SceneCriteria.ValuesLabel", "Allowed Values"),
        unnamed: v("EIDOLON.SceneCriteria.UnnamedCategory", "Unnamed Criterion")
      },
      summary: {
        criteriaCount: o.length,
        valueCount: o.reduce((d, g) => d + g.values.length, 0)
      },
      criteria: o.map((d, g) => {
        var m, y;
        return {
          id: d.id,
          label: d.label,
          displayName: ((y = (m = d.label) == null ? void 0 : m.trim) == null ? void 0 : y.call(m)) || v("EIDOLON.SceneCriteria.UnnamedCategory", "Unnamed Criterion"),
          hasValues: d.values.length > 0,
          values: d.values.map((p) => ({
            value: p,
            isCurrent: (s[d.key] ?? d.default) === p
          })),
          valueCountLabel: Ff(d.values.length),
          canMoveUp: g > 0,
          canMoveDown: g < o.length - 1
        };
      }),
      hasCriteria: o.length > 0
    });
    e.innerHTML = u, Df(n, e, i);
  } catch (o) {
    console.error(`${ve} | Failed to render criteria tab`, o), e.innerHTML = `<p class="notes">${v("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
  } finally {
    ws.groupEnd();
  }
}
c(ni, "renderCriteriaTabContent");
function Df(n, e, t) {
  const i = t ?? Mt(n);
  if (!He(i)) return;
  const r = e.querySelector('[data-criteria-action="add"]');
  r && r.addEventListener("click", () => {
    Bl(n, {
      scene: i,
      criterion: sl(
        v("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion")
      ),
      isNew: !0,
      onSave: /* @__PURE__ */ c(() => ni(n, e, i), "onSave")
    });
  }), e.querySelectorAll('[data-criteria-action="edit"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", () => {
      const s = at(i).find((l) => l.id === o);
      s && Bl(n, {
        scene: i,
        criterion: s,
        onSave: /* @__PURE__ */ c(() => ni(n, e, i), "onSave")
      });
    });
  }), e.querySelectorAll('[data-criteria-action="remove"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await Ao(i, (l) => {
        const u = l.findIndex((d) => d.id === o);
        return u < 0 ? !1 : (l.splice(u, 1), Mo(l), !0);
      }) && await ni(n, e, i);
    });
  }), e.querySelectorAll('[data-criteria-action="move-up"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await Ao(i, (l) => {
        const u = l.findIndex((g) => g.id === o);
        if (u <= 0) return !1;
        const [d] = l.splice(u, 1);
        return l.splice(u - 1, 0, d), Mo(l), !0;
      }) && await ni(n, e, i);
    });
  }), e.querySelectorAll('[data-criteria-action="move-down"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await Ao(i, (l) => {
        const u = l.findIndex((g) => g.id === o);
        if (u < 0 || u >= l.length - 1) return !1;
        const [d] = l.splice(u, 1);
        return l.splice(u + 1, 0, d), Mo(l), !0;
      }) && await ni(n, e, i);
    });
  });
}
c(Df, "bindCriteriaTabEvents");
async function Ao(n, e) {
  const t = at(n).sort((r, a) => r.order - a.order);
  if (e(t) === !1) return !1;
  try {
    return await ao(n, t), !0;
  } catch (r) {
    return lu(r), !1;
  }
}
c(Ao, "mutateCriteria");
function Bl(n, e = {}) {
  const t = e.scene ?? null, i = t && He(t) ? t : Mt(n);
  if (!He(i))
    return;
  Mf({
    scene: i,
    criterion: e.criterion ?? null,
    isNew: !!e.isNew,
    onSave: typeof e.onSave == "function" ? e.onSave : null
  }).render({ force: !0 });
}
c(Bl, "openCriterionEditor");
function Mo(n) {
  n.forEach((e, t) => {
    e.order = t;
  });
}
c(Mo, "reindexCriteriaOrder");
function Ff(n) {
  var e, t;
  if ((t = (e = game.i18n) == null ? void 0 : e.has) != null && t.call(e, "EIDOLON.SceneCriteria.ValueCountLabel"))
    try {
      return game.i18n.format("EIDOLON.SceneCriteria.ValueCountLabel", { count: n });
    } catch (i) {
      console.error(`${ve} | Failed to format value count label`, i);
    }
  return n === 0 ? "No values configured" : n === 1 ? "1 value" : `${n} values`;
}
c(Ff, "formatValueCount");
let jl = !1;
function Pf() {
  Hooks.once("init", () => {
    Cf();
  }), Hooks.once("ready", () => {
    ro() && (jl || (kf(), jl = !0));
  });
}
c(Pf, "registerSceneCriteriaHooks");
Pf();
const te = T, du = "criteriaEngineVersion", jn = "fileIndex", Un = "tileCriteria", cl = {
  LEGACY: 1,
  CRITERIA: 2
}, fu = cl.CRITERIA;
function hu(n) {
  var e;
  return ((e = n == null ? void 0 : n.getFlag) == null ? void 0 : e.call(n, te, du)) ?? cl.LEGACY;
}
c(hu, "getSceneEngineVersion");
function _f(n, e, t, i, r) {
  if (!(n != null && n.length) || !(t != null && t.length)) return -1;
  const a = {};
  for (const s of t)
    a[s] = e[s];
  const o = Ul(n, a, t);
  if (o >= 0) return o;
  if (i != null && i.length && r) {
    const s = { ...a };
    for (const l of i) {
      if (!(l in s)) continue;
      s[l] = r[l] ?? "Standard";
      const u = Ul(n, s, t);
      if (u >= 0) return u;
    }
  }
  return -1;
}
c(_f, "findBestMatch");
function Ul(n, e, t) {
  return n.findIndex((i) => {
    for (const r of t)
      if (i[r] !== e[r]) return !1;
    return !0;
  });
}
c(Ul, "findExactMatch");
function xf(n, e) {
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
c(xf, "findFileIndex");
function Br(n) {
  return n && typeof n == "object" && !Array.isArray(n);
}
c(Br, "isPlainObject$2");
function Vl(n) {
  return n == null ? n : typeof structuredClone == "function" ? structuredClone(n) : JSON.parse(JSON.stringify(n));
}
c(Vl, "deepClone");
function Rf(n, e) {
  if (!e) return;
  const t = e.split(".").filter(Boolean);
  if (!t.length) return;
  let i = n;
  for (let r = 0; r < t.length - 1; r += 1) {
    if (!Br(i == null ? void 0 : i[t[r]])) return;
    i = i[t[r]];
  }
  delete i[t.at(-1)];
}
c(Rf, "deletePath");
function gu(n, e) {
  const t = Vl(n ?? {});
  if (!Br(e)) return t;
  for (const [i, r] of Object.entries(e)) {
    if (i.startsWith("-=") && r === !0) {
      Rf(t, i.slice(2));
      continue;
    }
    Br(r) && Br(t[i]) ? t[i] = gu(t[i], r) : t[i] = Vl(r);
  }
  return t;
}
c(gu, "fallbackMerge");
function Hf(n, e) {
  var t, i;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.mergeObject && ((i = foundry == null ? void 0 : foundry.utils) != null && i.deepClone) ? foundry.utils.mergeObject(n, foundry.utils.deepClone(e), {
    inplace: !1
  }) : gu(n, e);
}
c(Hf, "defaultMerge");
function qf(n, e) {
  if (!n) return !0;
  for (const t of Object.keys(n))
    if (n[t] !== e[t]) return !1;
  return !0;
}
c(qf, "criteriaMatch");
function mu(n, e, t, i) {
  const r = i ?? Hf;
  let a = r({}, n ?? {});
  if (!(e != null && e.length)) return a;
  const o = [];
  for (let s = 0; s < e.length; s += 1) {
    const l = e[s];
    if (qf(l == null ? void 0 : l.criteria, t)) {
      const u = l != null && l.criteria ? Object.keys(l.criteria).length : 0;
      o.push({ specificity: u, index: s, delta: l == null ? void 0 : l.delta });
    }
  }
  o.sort((s, l) => s.specificity - l.specificity || s.index - l.index);
  for (const s of o)
    s.delta && (a = r(a, s.delta));
  return a;
}
c(mu, "resolveRules");
function oo(n = null) {
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
c(oo, "canManageCriteria");
function Bf(n = null) {
  if (!oo(n))
    throw new Error(`${te} | You do not have permission to manage scene criteria.`);
}
c(Bf, "requireCriteriaAccess");
const jf = /* @__PURE__ */ c((...n) => console.log(`${te} | criteria tiles:`, ...n), "log$1");
let aa = /* @__PURE__ */ new WeakMap(), oa = /* @__PURE__ */ new WeakMap();
const zl = 200;
function Uf(n) {
  return n ? Number.isInteger(n.size) ? n.size : Array.isArray(n) || typeof n.length == "number" ? n.length : Array.from(n).length : 0;
}
c(Uf, "getCollectionSize$1");
function Ir() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
c(Ir, "nowMs$2");
function Vf(n) {
  if (!Array.isArray(n)) return [];
  const e = /* @__PURE__ */ new Set();
  for (const t of n) {
    if (typeof t != "string") continue;
    const i = t.trim();
    i && e.add(i);
  }
  return Array.from(e);
}
c(Vf, "uniqueStringKeys$1");
function zf(n, e = zl) {
  if (!Array.isArray(n) || n.length === 0) return [];
  const t = Number.isInteger(e) && e > 0 ? e : zl, i = [];
  for (let r = 0; r < n.length; r += t)
    i.push(n.slice(r, r + t));
  return i;
}
c(zf, "chunkArray$1");
async function Gf(n, e, t) {
  const i = zf(e, t);
  for (const r of i)
    await n.updateEmbeddedDocuments("Tile", r), i.length > 1 && await Promise.resolve();
  return i.length;
}
c(Gf, "updateTilesInChunks");
function Wf(n) {
  var i;
  const e = Kn(n, { files: null });
  if (!((i = e == null ? void 0 : e.variants) != null && i.length)) return [];
  const t = /* @__PURE__ */ new Set();
  for (const r of e.variants)
    for (const a of Object.keys(r.criteria ?? {}))
      a && t.add(a);
  return Array.from(t);
}
c(Wf, "getTileCriteriaDependencyKeys");
function Jf(n, e) {
  const t = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
  for (const r of e) {
    const a = r.getFlag(te, Un) ?? r.getFlag(te, jn);
    if (a) {
      i.add(r.id);
      for (const o of Wf(a))
        t.has(o) || t.set(o, /* @__PURE__ */ new Set()), t.get(o).add(r.id);
    }
  }
  return {
    collection: e,
    keyToTileIds: t,
    allTileIds: i
  };
}
c(Jf, "buildTileDependencyIndex");
function Kf(n, e) {
  const t = oa.get(n);
  if ((t == null ? void 0 : t.collection) === e) return t;
  const i = Jf(n, e);
  return oa.set(n, i), i;
}
c(Kf, "getTileDependencyIndex");
function Yf(n, e, t) {
  const i = Vf(t);
  if (!i.length)
    return Array.from(e ?? []);
  const r = Kf(n, e), a = /* @__PURE__ */ new Set();
  for (const o of i) {
    const s = r.keyToTileIds.get(o);
    if (s)
      for (const l of s)
        a.add(l);
  }
  return a.size ? typeof (e == null ? void 0 : e.get) == "function" ? Array.from(a).map((o) => e.get(o)).filter(Boolean) : Array.from(e ?? []).filter((o) => a.has(o.id)) : [];
}
c(Yf, "getTilesForChangedKeys");
function pu(n) {
  return typeof (n == null ? void 0 : n.name) == "string" ? n.name : typeof (n == null ? void 0 : n.src) == "string" ? n.src : "";
}
c(pu, "getFilePath");
function sa(n) {
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
c(sa, "normalizeFilePath");
function ul(n) {
  if (!Array.isArray(n)) return [];
  const e = /* @__PURE__ */ new Map();
  return n.map((t, i) => {
    const r = sa(pu(t)), a = r || `__index:${i}`, o = e.get(a) ?? 0;
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
c(ul, "buildTileFileEntries");
function fn(n, e) {
  if (!Number.isInteger(e) || e < 0) return null;
  const i = ul(n).find((r) => r.index === e);
  return i ? { ...i.target } : { indexHint: e };
}
c(fn, "createTileTargetFromIndex");
function so(n) {
  if (!n || typeof n != "object") return null;
  const e = sa(n.path), t = Number(n.indexHint ?? n.fileIndex), i = Number(n.occurrence), r = {};
  return e && (r.path = e, r.occurrence = Number.isInteger(i) && i >= 0 ? i : 0), Number.isInteger(t) && t >= 0 && (r.indexHint = t), !r.path && !Number.isInteger(r.indexHint) ? null : r;
}
c(so, "normalizeTileTarget");
function Vi(n, e) {
  const t = so(n);
  if (!t) return -1;
  const i = ul(e);
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
c(Vi, "resolveTileTargetIndex");
function hn(n) {
  if (!n || typeof n != "object" || Array.isArray(n)) return {};
  const e = {};
  for (const [t, i] of Object.entries(n))
    typeof t != "string" || !t || typeof i != "string" || !i.trim() || (e[t] = i.trim());
  return e;
}
c(hn, "sanitizeCriteria");
function Qf(n) {
  return Object.entries(hn(n)).sort(([t], [i]) => t.localeCompare(i)).map(([t, i]) => `${t}=${i}`).join("");
}
c(Qf, "serializeCriteria");
function Xf(n) {
  return Object.keys(hn(n)).length;
}
c(Xf, "getCriteriaSpecificity");
function Zf(n, e) {
  const t = hn(n), i = hn(e);
  for (const [r, a] of Object.entries(t))
    if (r in i && i[r] !== a)
      return !1;
  return !0;
}
c(Zf, "areCriteriaCompatible");
function eh(n, e) {
  const t = Vi(n, e);
  if (Number.isInteger(t) && t >= 0)
    return `index:${t}`;
  const i = so(n);
  if (!i) return "";
  if (i.path) {
    const r = Number.isInteger(i.occurrence) ? i.occurrence : 0;
    return `path:${i.path}#${r}`;
  }
  return Number.isInteger(i.indexHint) ? `hint:${i.indexHint}` : "";
}
c(eh, "getTargetIdentity");
function yu(n, e = {}) {
  var s;
  const t = Array.isArray(e.files) ? e.files : [], i = Kn(n, { files: t });
  if (!((s = i == null ? void 0 : i.variants) != null && s.length))
    return {
      errors: [],
      warnings: []
    };
  const r = i.variants.map((l, u) => ({
    index: u,
    criteria: hn(l.criteria),
    specificity: Xf(l.criteria),
    criteriaSignature: Qf(l.criteria),
    targetIdentity: eh(l.target, t)
  })), a = [], o = [];
  for (let l = 0; l < r.length; l += 1) {
    const u = r[l];
    for (let d = l + 1; d < r.length; d += 1) {
      const g = r[d];
      if (u.specificity !== g.specificity || !Zf(u.criteria, g.criteria)) continue;
      if (!(!!u.targetIdentity && u.targetIdentity === g.targetIdentity)) {
        a.push({
          leftIndex: u.index,
          rightIndex: g.index,
          type: u.criteriaSignature === g.criteriaSignature ? "equivalent" : "overlap",
          specificity: u.specificity
        });
        continue;
      }
      u.criteriaSignature === g.criteriaSignature && o.push({
        leftIndex: u.index,
        rightIndex: g.index,
        type: "duplicate"
      });
    }
  }
  return {
    errors: a,
    warnings: o
  };
}
c(yu, "detectTileCriteriaConflicts");
function th(n, e) {
  if (!n || typeof n != "object") return null;
  let t = so(n.target);
  if (!t) {
    const i = Number(n.fileIndex);
    Number.isInteger(i) && i >= 0 && (t = fn(e, i));
  }
  return t ? {
    criteria: hn(n.criteria),
    target: t
  } : null;
}
c(th, "normalizeTileVariant");
function bu(n, e = {}) {
  if (!Array.isArray(n) || n.length === 0) return null;
  const t = Array.isArray(e.files) ? e.files : null, i = n.map((l, u) => ({
    criteria: hn(l),
    target: fn(t, u)
  })).filter((l) => l.target);
  if (!i.length) return null;
  const r = i.find((l) => Object.keys(l.criteria).length === 0), a = (r == null ? void 0 : r.target) ?? i[0].target;
  let o = null;
  const s = Number(e.defaultFileIndex);
  return Number.isInteger(s) && s >= 0 && (o = fn(t, s)), o || (o = a), {
    strategy: "select-one",
    variants: i,
    defaultTarget: o
  };
}
c(bu, "buildTileCriteriaFromFileIndex");
function Kn(n, e = {}) {
  const t = Array.isArray(e.files) ? e.files : null;
  if (Array.isArray(n))
    return bu(n, { files: t });
  if (!n || typeof n != "object") return null;
  const i = Array.isArray(n.variants) ? n.variants.map((a) => th(a, t)).filter(Boolean) : [];
  if (!i.length) return null;
  let r = so(n.defaultTarget);
  if (!r) {
    const a = Number(n.defaultFileIndex);
    Number.isInteger(a) && a >= 0 && (r = fn(t, a));
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
c(Kn, "normalizeTileCriteria");
function nh(n, e) {
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
c(nh, "selectTileFileIndexFromCompiled");
function ih(n, e) {
  const t = Kn(n, { files: e });
  if (!t) return null;
  const i = t.variants.map((a) => {
    const o = hn(a.criteria), s = Vi(a.target, e);
    return !Number.isInteger(s) || s < 0 ? null : {
      criteria: o,
      keys: Object.keys(o),
      targetIndex: s
    };
  }).filter(Boolean), r = Vi(t.defaultTarget, e);
  return !i.length && (!Number.isInteger(r) || r < 0) ? null : {
    variants: i,
    defaultIndex: r
  };
}
c(ih, "compileTileMatcher");
function rh(n, e, t) {
  const i = aa.get(n);
  if (i && i.tileCriteria === e && i.files === t)
    return i.compiled;
  const r = ih(e, t);
  return aa.set(n, {
    tileCriteria: e,
    files: t,
    compiled: r
  }), r;
}
c(rh, "getCompiledTileMatcher");
function ah(n = null, e = null) {
  n ? oa.delete(n) : oa = /* @__PURE__ */ new WeakMap(), e ? aa.delete(e) : n || (aa = /* @__PURE__ */ new WeakMap());
}
c(ah, "invalidateTileCriteriaCaches");
async function wu(n, e, t = {}) {
  var l, u, d, g;
  const i = Ir(), r = {
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
    return r.durationMs = Ir() - i, r;
  const a = e.getEmbeddedCollection("Tile") ?? [];
  r.total = Uf(a);
  const o = Yf(e, a, t.changedKeys);
  if (r.scanned = o.length, !o.length)
    return r.skipped.unaffected = r.total, r.durationMs = Ir() - i, r;
  const s = [];
  for (const m of o) {
    const y = m.getFlag(te, Un) ?? m.getFlag(te, jn);
    if (!y) {
      r.skipped.noCriteria += 1;
      continue;
    }
    const p = m.getFlag("monks-active-tiles", "files");
    if (!(p != null && p.length)) {
      r.skipped.noFiles += 1;
      continue;
    }
    const h = rh(m, y, p), b = nh(h, n);
    if (!Number.isInteger(b) || b < 0 || b >= p.length) {
      console.warn(`${te} | Tile ${m.id} has no valid file match for state`, n), r.skipped.noMatch += 1;
      continue;
    }
    const w = b + 1, L = Number(m.getFlag("monks-active-tiles", "fileindex")) !== w, O = p.some((x, V) => !!(x != null && x.selected) != (V === b)), M = sa(((u = m.texture) == null ? void 0 : u.src) ?? ((g = (d = m._source) == null ? void 0 : d.texture) == null ? void 0 : g.src) ?? ""), N = pu(p[b]), D = sa(N), ne = !!D && D !== M;
    if (!O && !L && !ne) {
      r.skipped.unchanged += 1;
      continue;
    }
    const K = {
      _id: m._id
    };
    O && (K["flags.monks-active-tiles.files"] = p.map((x, V) => ({
      ...x,
      selected: V === b
    }))), L && (K["flags.monks-active-tiles.fileindex"] = w), ne && (K.texture = { src: N }), s.push(K), jf(`Tile ${m.id} -> ${N}`);
  }
  return s.length > 0 && (r.chunks = await Gf(e, s, t.chunkSize), r.updated = s.length), r.durationMs = Ir() - i, r;
}
c(wu, "updateTiles");
function oh() {
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
c(oh, "buildLightControlsMap");
const Vn = T, li = "lightCriteria", dl = Object.freeze({
  base: null,
  mappings: [],
  current: null
});
function No(n) {
  return n && typeof n == "object" && !Array.isArray(n);
}
c(No, "isPlainObject$1");
function vu(n, e) {
  if (!No(e)) return {};
  const t = {};
  for (const [i, r] of Object.entries(e)) {
    const a = n == null ? void 0 : n[i];
    if (No(r) && No(a)) {
      const o = vu(a, r);
      Object.keys(o).length > 0 && (t[i] = o);
    } else r !== a && (t[i] = At(r));
  }
  return t;
}
c(vu, "computeDelta");
function Eu(n) {
  var t;
  const e = ((t = n == null ? void 0 : n.getFlag) == null ? void 0 : t.call(n, Vn, li)) ?? dl;
  return zi(e);
}
c(Eu, "getLightCriteriaState");
async function Tu(n, e) {
  const t = zi(e);
  if (!(n != null && n.setFlag))
    return t;
  const i = t.base !== null, r = t.mappings.length > 0, a = t.current !== null;
  return !i && !r && !a ? (typeof n.unsetFlag == "function" ? await n.unsetFlag(Vn, li) : await n.setFlag(Vn, li, null), dl) : (await n.setFlag(Vn, li, t), t);
}
c(Tu, "setLightCriteriaState");
async function pr(n, e) {
  if (typeof e != "function")
    throw new TypeError("updateLightCriteriaState requires an updater function.");
  const t = At(Eu(n)), i = await e(t);
  return Tu(n, i);
}
c(pr, "updateLightCriteriaState");
async function Gl(n, e) {
  const t = Yn(e);
  if (!t)
    throw new Error("Invalid light configuration payload.");
  return pr(n, (i) => ({
    ...i,
    base: t
  }));
}
c(Gl, "storeBaseLighting");
async function Wl(n, e, t, { label: i } = {}) {
  const r = yr(e);
  if (!r)
    throw new Error("Cannot create a mapping without at least one category selection.");
  const a = Yn(t);
  if (!a)
    throw new Error("Invalid light configuration payload.");
  return pr(n, (o) => {
    const s = Ii(r), l = Array.isArray(o == null ? void 0 : o.mappings) ? [...o.mappings] : [], u = l.findIndex((y) => (y == null ? void 0 : y.key) === s), d = u >= 0 ? l[u] : null, g = typeof (d == null ? void 0 : d.id) == "string" && d.id.trim() ? d.id.trim() : Su(), m = lo({
      id: g,
      categories: r,
      config: a,
      label: typeof i == "string" ? i : (d == null ? void 0 : d.label) ?? null,
      updatedAt: Date.now()
    });
    if (!m)
      throw new Error("Failed to sanitize criteria mapping entry.");
    return u >= 0 ? l[u] = m : l.push(m), {
      ...o,
      mappings: l
    };
  });
}
c(Wl, "upsertLightCriteriaMapping");
async function sh(n, e, t, i, { replaceExisting: r = !1 } = {}) {
  const a = typeof e == "string" ? e.trim() : "";
  if (!a)
    throw new Error("A mapping id is required to retarget criteria.");
  const o = yr(t);
  if (!o)
    throw new Error("Cannot retarget mapping without at least one category selection.");
  const s = Yn(i);
  if (!s)
    throw new Error("Invalid light configuration payload.");
  return pr(n, (l) => {
    const u = Array.isArray(l == null ? void 0 : l.mappings) ? [...l.mappings] : [], d = u.findIndex((w) => (w == null ? void 0 : w.id) === a);
    if (d < 0)
      throw new Error("The selected mapping no longer exists.");
    const g = Ii(o), m = u.findIndex(
      (w, E) => E !== d && (w == null ? void 0 : w.key) === g
    );
    if (m >= 0 && !r)
      throw new Error("A mapping already exists for the selected criteria.");
    const y = u[d], p = lo({
      ...y,
      id: a,
      categories: o,
      config: s,
      updatedAt: Date.now()
    });
    if (!p)
      throw new Error("Failed to sanitize updated mapping.");
    u[d] = p;
    let h = null;
    if (m >= 0) {
      const [w] = u.splice(m, 1);
      h = (w == null ? void 0 : w.id) ?? null;
    }
    let b = (l == null ? void 0 : l.current) ?? null;
    return b && typeof b == "object" && (b.mappingId === a ? b = {
      ...b,
      mappingId: a,
      categories: o,
      updatedAt: Date.now()
    } : h && b.mappingId === h && (b = {
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
c(sh, "retargetLightCriteriaMapping");
async function lh(n, e) {
  const t = typeof e == "string" ? e.trim() : "";
  if (!t)
    throw new Error("A mapping id is required to remove a mapping.");
  return pr(n, (i) => {
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
c(lh, "removeLightCriteriaMapping");
async function qi(n, e) {
  const t = Cu(e);
  return pr(n, (i) => ({
    ...i,
    current: t
  }));
}
c(qi, "storeCurrentCriteriaSelection");
function ch(n) {
  const e = zi(n), t = e.base ?? {}, i = [];
  for (const r of e.mappings) {
    const a = yr(r == null ? void 0 : r.categories);
    if (!a) continue;
    const o = vu(t, (r == null ? void 0 : r.config) ?? {});
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
c(ch, "convertLightCriteriaStateToPresets");
function uh(n, e = []) {
  const t = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
  for (const l of e)
    typeof (l == null ? void 0 : l.key) == "string" && l.key.trim() && i.add(l.key.trim()), typeof (l == null ? void 0 : l.id) == "string" && l.id.trim() && typeof (l == null ? void 0 : l.key) == "string" && t.set(l.id.trim(), l.key.trim());
  const r = zi(n), a = /* @__PURE__ */ c((l) => {
    const u = {};
    for (const [d, g] of Object.entries(l ?? {})) {
      const m = String(d ?? "").trim(), y = typeof g == "string" ? g.trim() : "";
      if (!m || !y) continue;
      if (i.has(m)) {
        u[m] = y;
        continue;
      }
      const p = t.get(m);
      p && (u[p] = y);
    }
    return Object.keys(u).length ? u : null;
  }, "remapCategories"), o = r.mappings.map((l) => {
    const u = a(l.categories);
    return u ? lo({
      ...l,
      categories: u,
      key: Ii(u)
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
  return zi({
    ...r,
    mappings: o,
    current: s
  });
}
c(uh, "migrateLightCriteriaCategoriesToKeys");
function zi(n) {
  var l;
  const e = At(n);
  if (!e || typeof e != "object")
    return At(dl);
  const t = Yn(e.base), i = Array.isArray(e.mappings) ? e.mappings : [], r = /* @__PURE__ */ new Map();
  for (const u of i) {
    const d = lo(u);
    d && r.set(d.key, d);
  }
  const a = Array.from(r.values()), o = new Map(a.map((u) => [u.id, u]));
  let s = Cu(e.current);
  if (s) {
    const u = s.categories && Object.keys(s.categories).length > 0;
    if (s.mappingId && !o.has(s.mappingId)) {
      const d = u ? ((l = a.find((g) => g.key === Ii(s.categories))) == null ? void 0 : l.id) ?? null : null;
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
c(zi, "sanitizeLightCriteriaState");
function Yn(n) {
  const e = At(n);
  if (!e || typeof e != "object") return null;
  "_id" in e && delete e._id, "id" in e && delete e.id;
  const t = e.flags;
  if (t && typeof t == "object") {
    const i = t[Vn];
    i && typeof i == "object" && (delete i[li], Object.keys(i).length === 0 && delete t[Vn]), Object.keys(t).length === 0 && delete e.flags;
  }
  return e;
}
c(Yn, "sanitizeLightConfigPayload");
function lo(n) {
  if (!n || typeof n != "object") return null;
  const e = yr(n.categories);
  if (!e) return null;
  const t = Yn(n.config);
  if (!t) return null;
  const i = typeof n.id == "string" && n.id.trim() ? n.id.trim() : Su(), r = Ii(e), a = {
    id: i,
    key: r,
    categories: e,
    config: t,
    updatedAt: Number.isFinite(n.updatedAt) ? Number(n.updatedAt) : Date.now()
  };
  return typeof n.label == "string" && n.label.trim() && (a.label = n.label.trim()), a;
}
c(lo, "sanitizeCriteriaMappingEntry");
function Cu(n) {
  if (!n || typeof n != "object") return null;
  const e = typeof n.mappingId == "string" && n.mappingId.trim() ? n.mappingId.trim() : null, t = yr(n.categories);
  return !e && !t ? null : {
    mappingId: e,
    categories: t,
    updatedAt: Number.isFinite(n.updatedAt) ? Number(n.updatedAt) : Date.now()
  };
}
c(Cu, "sanitizeCurrentSelection");
function yr(n) {
  const e = {};
  if (Array.isArray(n))
    for (const t of n) {
      const i = Jl((t == null ? void 0 : t.id) ?? (t == null ? void 0 : t.categoryId) ?? (t == null ? void 0 : t.category)), r = Kl((t == null ? void 0 : t.value) ?? (t == null ? void 0 : t.selection) ?? (t == null ? void 0 : t.label));
      !i || !r || (e[i] = r);
    }
  else if (n && typeof n == "object")
    for (const [t, i] of Object.entries(n)) {
      const r = Jl(t), a = Kl(i);
      !r || !a || (e[r] = a);
    }
  return Object.keys(e).length > 0 ? e : null;
}
c(yr, "sanitizeCriteriaCategories");
function Ii(n) {
  if (!n || typeof n != "object") return "";
  const e = Object.entries(n).filter(([, t]) => typeof t == "string" && t).map(([t, i]) => `${t}:${i}`);
  return e.sort((t, i) => t < i ? -1 : t > i ? 1 : 0), e.join("|");
}
c(Ii, "computeCriteriaMappingKey");
function Su() {
  var n;
  return (n = foundry == null ? void 0 : foundry.utils) != null && n.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
c(Su, "generateLightMappingId");
function Jl(n) {
  if (typeof n != "string") return null;
  const e = n.trim();
  return e || null;
}
c(Jl, "normalizeCategoryId");
function Kl(n) {
  if (typeof n != "string") return null;
  const e = n.trim();
  return e || null;
}
c(Kl, "normalizeCategoryValue");
const la = ["AmbientLight", "Wall", "AmbientSound"];
let ca = /* @__PURE__ */ new WeakMap(), ua = /* @__PURE__ */ new WeakMap();
const Yl = 200;
function dh(n) {
  return n ? Number.isInteger(n.size) ? n.size : Array.isArray(n) || typeof n.length == "number" ? n.length : Array.from(n).length : 0;
}
c(dh, "getCollectionSize");
function ko() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
c(ko, "nowMs$1");
function fh(n) {
  if (!Array.isArray(n)) return [];
  const e = /* @__PURE__ */ new Set();
  for (const t of n) {
    if (typeof t != "string") continue;
    const i = t.trim();
    i && e.add(i);
  }
  return Array.from(e);
}
c(fh, "uniqueStringKeys");
function hh(n, e = Yl) {
  if (!Array.isArray(n) || n.length === 0) return [];
  const t = Number.isInteger(e) && e > 0 ? e : Yl, i = [];
  for (let r = 0; r < n.length; r += t)
    i.push(n.slice(r, r + t));
  return i;
}
c(hh, "chunkArray");
async function gh(n, e, t, i) {
  const r = hh(t, i);
  for (const a of r)
    await n.updateEmbeddedDocuments(e, a), r.length > 1 && await Promise.resolve();
  return r.length;
}
c(gh, "updatePlaceablesInChunks");
function mh(n) {
  const e = /* @__PURE__ */ new Set();
  for (const t of (n == null ? void 0 : n.rules) ?? [])
    for (const i of Object.keys((t == null ? void 0 : t.criteria) ?? {}))
      i && e.add(i);
  return Array.from(e);
}
c(mh, "getPresetDependencyKeys");
function ph(n, e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of la) {
    const r = e.get(i) ?? [], a = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Map();
    for (const s of r) {
      const l = Iu(s, i);
      if (l != null && l.base) {
        a.add(s.id);
        for (const u of mh(l))
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
c(ph, "buildPlaceableDependencyIndex");
function yh(n, e) {
  const t = ua.get(n);
  if (t && la.every((r) => t.collectionsByType.get(r) === e.get(r)))
    return t;
  const i = ph(n, e);
  return ua.set(n, i), i;
}
c(yh, "getPlaceableDependencyIndex");
function bh(n, e, t) {
  if (!e || !n) return [];
  const i = fh(t);
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
c(bh, "getDocsForChangedKeys");
function ii(n) {
  return !!n && typeof n == "object" && !Array.isArray(n);
}
c(ii, "isPlainObject");
function vs(n, e) {
  if (Object.is(n, e)) return !0;
  if (Array.isArray(n) || Array.isArray(e)) {
    if (!Array.isArray(n) || !Array.isArray(e) || n.length !== e.length) return !1;
    for (let t = 0; t < n.length; t += 1)
      if (!vs(n[t], e[t])) return !1;
    return !0;
  }
  if (ii(n) || ii(e)) {
    if (!ii(n) || !ii(e)) return !1;
    const t = Object.keys(e);
    for (const i of t)
      if (!vs(n[i], e[i])) return !1;
    return !0;
  }
  return !1;
}
c(vs, "areValuesEqual");
function Lu(n, e) {
  const t = { _id: e._id };
  for (const [r, a] of Object.entries(e)) {
    if (r === "_id") continue;
    const o = n == null ? void 0 : n[r];
    if (ii(a) && ii(o)) {
      const s = Lu(o, { _id: e._id, ...a });
      if (!s) continue;
      const l = Object.keys(s).filter((u) => u !== "_id");
      if (l.length > 0) {
        t[r] = {};
        for (const u of l)
          t[r][u] = s[u];
      }
      continue;
    }
    vs(o, a) || (t[r] = a);
  }
  return Object.keys(t).filter((r) => r !== "_id").length > 0 ? t : null;
}
c(Lu, "buildChangedPayload");
function Iu(n, e) {
  var s;
  const t = ((s = n == null ? void 0 : n.flags) == null ? void 0 : s[te]) ?? {}, i = (t == null ? void 0 : t.presets) ?? null, r = e === "AmbientLight" ? (t == null ? void 0 : t.lightCriteria) ?? null : null, a = ca.get(n);
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
    const l = ch(t.lightCriteria);
    (l.base && Object.keys(l.base).length > 0 || l.rules.length > 0) && (o = {
      base: l.base,
      rules: l.rules
    });
  }
  return ca.set(n, {
    type: e,
    rawPresets: i,
    rawLightCriteria: r,
    presets: o
  }), o;
}
c(Iu, "getPresetsForDocument");
function wh(n = null, e = null) {
  n ? ua.delete(n) : ua = /* @__PURE__ */ new WeakMap(), e ? ca.delete(e) : n || (ca = /* @__PURE__ */ new WeakMap());
}
c(wh, "invalidatePlaceableCriteriaCaches");
async function Ou(n, e, t = {}) {
  var l, u;
  const i = ko(), r = {
    total: 0,
    scanned: 0,
    updated: 0,
    chunks: 0,
    byType: {},
    durationMs: 0
  };
  if (e = e ?? ((l = game.scenes) == null ? void 0 : l.viewed), !e)
    return r.durationMs = ko() - i, r;
  const a = new Set(oh()), o = new Map(
    la.map((d) => [d, e.getEmbeddedCollection(d) ?? []])
  ), s = yh(e, o);
  for (const d of la) {
    const g = o.get(d) ?? [], m = {
      total: dh(g),
      scanned: 0,
      updated: 0,
      chunks: 0
    }, y = s.byType.get(d) ?? null, p = bh(g, y, t.changedKeys);
    if (m.scanned = p.length, r.total += m.total, r.scanned += m.scanned, r.byType[d] = m, !p.length) continue;
    const h = [];
    for (const b of p) {
      const w = Iu(b, d);
      if (!(w != null && w.base)) continue;
      const E = mu(w.base, w.rules ?? [], n);
      E._id = b._id, d === "AmbientLight" && a.has(b._id) && (E.hidden = !0);
      const L = (b == null ? void 0 : b._source) ?? ((u = b == null ? void 0 : b.toObject) == null ? void 0 : u.call(b)) ?? {}, O = Lu(L, E);
      O && h.push(O);
    }
    h.length > 0 && (m.chunks = await gh(e, d, h, t.chunkSize), m.updated = h.length, r.updated += h.length, r.chunks += m.chunks, console.log(`${te} | Updated ${h.length} ${d}(s)`));
  }
  return r.durationMs = ko() - i, r;
}
c(Ou, "updatePlaceables");
function da() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
c(da, "nowMs");
const Or = /* @__PURE__ */ new Map();
function vh(n) {
  var e;
  return n = n ?? ((e = game.scenes) == null ? void 0 : e.viewed), n ? mr(n) : null;
}
c(vh, "getState");
async function Eh(n, e, t = 0) {
  var y;
  const i = da();
  if (e = e ?? ((y = game.scenes) == null ? void 0 : y.viewed), !e) return null;
  Bf(e);
  const r = at(e);
  if (!r.length)
    return console.warn(`${te} | applyState skipped: scene has no criteria.`), null;
  const a = mr(e, r), o = ll({ ...a, ...n ?? {} }, r), s = r.filter((p) => (a == null ? void 0 : a[p.key]) !== (o == null ? void 0 : o[p.key])).map((p) => p.key), l = s.length > 0;
  l && await Lf(e, o, r);
  const u = l ? o : a, [d, g] = await Promise.all([
    wu(u, e, { changedKeys: s }),
    Ou(u, e, { changedKeys: s })
  ]), m = da() - i;
  return A("Criteria apply telemetry", {
    sceneId: e.id,
    changedKeys: s,
    didChange: l,
    queuedMs: t,
    durationMs: m,
    tiles: d,
    placeables: g
  }), Hooks.callAll("eidolon-utilities.criteriaStateApplied", e, u), u;
}
c(Eh, "applyStateInternal");
async function Au(n, e) {
  var l;
  if (e = e ?? ((l = game.scenes) == null ? void 0 : l.viewed), !e) return null;
  const t = e.id ?? "__viewed__", i = da(), r = Or.get(t) ?? Promise.resolve();
  let a = null;
  const o = r.catch(() => null).then(async () => {
    const u = da() - i;
    return Eh(n, e, u);
  });
  a = o;
  const s = o.finally(() => {
    Or.get(t) === s && Or.delete(t);
  });
  return Or.set(t, s), a;
}
c(Au, "applyState$1");
function Th(n) {
  var e;
  return n = n ?? ((e = game.scenes) == null ? void 0 : e.viewed), n ? hu(n) : null;
}
c(Th, "getVersion");
async function Mu(n, e) {
  var t;
  e = e ?? ((t = game.scenes) == null ? void 0 : t.viewed), e != null && e.setFlag && await e.setFlag(te, du, Number(n));
}
c(Mu, "setVersion");
async function Ch(n) {
  return Mu(fu, n);
}
c(Ch, "markCurrentVersion");
const xi = "Standard", Sh = /* @__PURE__ */ c((...n) => console.log(`${te} | criteria indexer:`, ...n), "log");
function fl(n) {
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
c(fl, "parseFileTags");
function Lh(n, e, t = xi) {
  return n != null && n.length ? n.map((i) => {
    const r = fl(i == null ? void 0 : i.name);
    if (!r) return {};
    const a = {};
    for (const [o, s] of Object.entries(e)) {
      const l = r[Number(o)];
      l != null && l !== t && (a[s] = l);
    }
    return a;
  }) : [];
}
c(Lh, "buildFileIndex");
function Ih(n, e) {
  return n.map((t, i) => {
    const r = [...e[t] ?? /* @__PURE__ */ new Set()].sort(), o = r.includes(xi) ? xi : r[0] ?? xi, s = sl(t);
    return s.key = t, s.label = t.charAt(0).toUpperCase() + t.slice(1), s.values = r.length ? r : [xi], s.default = s.values.includes(o) ? o : s.values[0], s.order = i, s;
  });
}
c(Ih, "buildCriteriaDefinitions");
async function Ar(n, e, t, { dryRun: i = !1 } = {}) {
  const r = n.getFlag("monks-active-tiles", "files");
  if (!(r != null && r.length)) return null;
  const a = Lh(r, e), o = bu(a, { files: r });
  for (const s of r) {
    const l = fl(s == null ? void 0 : s.name);
    if (l)
      for (const [u, d] of Object.entries(e)) {
        const g = l[Number(u)];
        g != null && t[d] && t[d].add(g);
      }
  }
  return i || (await n.setFlag(te, Un, o), typeof n.unsetFlag == "function" && await n.unsetFlag(te, jn)), { files: r.length };
}
c(Ar, "indexTile");
async function Oh(n, e = {}) {
  var E, L, O, M;
  const {
    dryRun: t = !1,
    force: i = !1
  } = e;
  if (n = n ?? ((E = game.scenes) == null ? void 0 : E.viewed), !n) throw new Error("No scene provided to indexScene.");
  if (!globalThis.Tagger) throw new Error("Tagger is required to index scene criteria.");
  if (!i && hu(n) >= fu)
    throw new Error(
      `Scene "${n.name}" is already criteria-indexed. Use force: true to re-index.`
    );
  const r = { sceneId: n.id }, a = Tagger.getByTag("Map", r) ?? [];
  if (!a.length) throw new Error("No Map tile found.");
  if (a.length > 1) throw new Error(`Expected 1 Map tile, found ${a.length}.`);
  const o = a[0], s = o.getFlag("monks-active-tiles", "files");
  if (!(s != null && s.length)) throw new Error("Map tile has no MATT files.");
  const l = fl((L = s[0]) == null ? void 0 : L.name);
  if (!(l != null && l.length))
    throw new Error(`Cannot parse bracket tags from: ${((O = s[0]) == null ? void 0 : O.name) ?? "<unknown>"}`);
  if (l.length < 3)
    throw new Error(`Expected 3+ bracket tags, found ${l.length}.`);
  const u = Tagger.getByTag("Floor", r) ?? [], d = Tagger.getByTag("Roof", r) ?? [], g = Tagger.getByTag("Weather", r) ?? [];
  let m;
  const y = [];
  l.length >= 4 ? (m = { 0: "mood", 1: "stage", 2: "variant", 3: "effect" }, y.push("mood", "stage", "variant", "effect")) : (m = { 0: "mood", 1: "variant", 2: "effect" }, y.push("mood", "variant", "effect"));
  const p = { 1: "effect" }, h = {};
  for (const N of y)
    h[N] = /* @__PURE__ */ new Set();
  const b = {
    map: null,
    floor: [],
    roof: [],
    weather: []
  };
  b.map = await Ar(o, m, h, { dryRun: t });
  for (const N of u) {
    const D = await Ar(N, m, h, { dryRun: t });
    D && b.floor.push(D);
  }
  for (const N of d) {
    const D = await Ar(N, m, h, { dryRun: t });
    D && b.roof.push(D);
  }
  for (const N of g) {
    const D = await Ar(N, p, h, { dryRun: t });
    D && b.weather.push(D);
  }
  const w = Ih(y, h);
  return t || (await ao(n, w), await Ch(n)), Sh(
    t ? "Dry run complete" : "Indexing complete",
    `- ${w.length} criteria,`,
    `${((M = b.map) == null ? void 0 : M.files) ?? 0} map files`
  ), {
    criteria: w,
    state: w.reduce((N, D) => (N[D.key] = D.default, N), {}),
    tiles: b,
    overlayMode: g.length > 0
  };
}
c(Oh, "indexScene");
var Tc, De, nt, it, Rn, Ue, It, Xt, Qa, oe, Nu, ku, $u, Ts, Du, Cs, Fu, Ri, Ss;
const ct = class ct extends bn(yn) {
  constructor(t = {}) {
    var i;
    super(t);
    I(this, oe);
    I(this, De, null);
    I(this, nt, []);
    I(this, it, {});
    I(this, Rn, !1);
    I(this, Ue, null);
    I(this, It, null);
    I(this, Xt, null);
    I(this, Qa, 120);
    this.setScene(t.scene ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null);
  }
  setScene(t) {
    var i;
    S(this, De, t ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null), C(this, oe, Nu).call(this);
  }
  get scene() {
    return f(this, De);
  }
  async _prepareContext() {
    var r;
    const t = !!f(this, De), i = t && f(this, nt).length > 0;
    return {
      hasScene: t,
      hasCriteria: i,
      sceneName: ((r = f(this, De)) == null ? void 0 : r.name) ?? v("EIDOLON.CriteriaSwitcher.NoScene", "No active scene"),
      labels: {
        subtitle: v(
          "EIDOLON.CriteriaSwitcher.Subtitle",
          "Switch criteria live and immediately apply all mapped updates."
        ),
        empty: v(
          "EIDOLON.CriteriaSwitcher.Empty",
          "No criteria found for this scene. Configure criteria first."
        ),
        reset: v("EIDOLON.CriteriaSwitcher.Reset", "Reset Defaults"),
        close: v("EIDOLON.CriteriaSwitcher.Close", "Close"),
        applying: v("EIDOLON.CriteriaSwitcher.Applying", "Applying changes..."),
        ready: v("EIDOLON.CriteriaSwitcher.Ready", "Ready")
      },
      criteria: f(this, nt).map((a) => ({
        key: a.key,
        label: a.label || a.key,
        values: a.values.map((o) => {
          var s;
          return {
            value: o,
            selected: ((s = f(this, it)) == null ? void 0 : s[a.key]) === o
          };
        }),
        defaultValue: a.default
      })),
      stateSummary: C(this, oe, Ss).call(this)
    };
  }
  _onRender(t, i) {
    super._onRender(t, i), C(this, oe, ku).call(this), C(this, oe, $u).call(this);
  }
  async _onClose(t) {
    return f(this, Ue) !== null && (clearTimeout(f(this, Ue)), S(this, Ue, null)), f(this, Xt) !== null && (Hooks.off("eidolon-utilities.criteriaStateApplied", f(this, Xt)), S(this, Xt, null)), super._onClose(t);
  }
};
De = new WeakMap(), nt = new WeakMap(), it = new WeakMap(), Rn = new WeakMap(), Ue = new WeakMap(), It = new WeakMap(), Xt = new WeakMap(), Qa = new WeakMap(), oe = new WeakSet(), Nu = /* @__PURE__ */ c(function() {
  if (!f(this, De)) {
    S(this, nt, []), S(this, it, {});
    return;
  }
  S(this, nt, at(f(this, De)).sort((t, i) => t.order - i.order)), S(this, it, mr(f(this, De), f(this, nt)));
}, "#hydrateFromScene"), ku = /* @__PURE__ */ c(function() {
  var i, r;
  const t = this.element;
  t instanceof HTMLElement && (t.querySelectorAll("[data-criteria-key]").forEach((a) => {
    a.addEventListener("change", (o) => {
      const s = o.currentTarget;
      if (!(s instanceof HTMLSelectElement)) return;
      const l = s.dataset.criteriaKey;
      l && (S(this, it, {
        ...f(this, it),
        [l]: s.value
      }), C(this, oe, Du).call(this, { [l]: s.value }));
    });
  }), (i = t.querySelector("[data-action='reset-defaults']")) == null || i.addEventListener("click", () => {
    C(this, oe, Fu).call(this);
  }), (r = t.querySelector("[data-action='close-switcher']")) == null || r.addEventListener("click", () => {
    this.close();
  }));
}, "#bindEvents"), $u = /* @__PURE__ */ c(function() {
  f(this, Xt) === null && S(this, Xt, Hooks.on("eidolon-utilities.criteriaStateApplied", (t, i) => {
    !f(this, De) || (t == null ? void 0 : t.id) !== f(this, De).id || f(this, Rn) || (S(this, it, { ...i ?? {} }), this.render({ force: !0 }));
  }));
}, "#ensureSyncHook"), Ts = /* @__PURE__ */ c(async function(t) {
  var i, r;
  if (f(this, De)) {
    C(this, oe, Ri).call(this, "applying"), S(this, Rn, !0);
    try {
      const a = await Au(t, f(this, De));
      a && S(this, it, a), C(this, oe, Ri).call(this, "ready"), this.render({ force: !0 });
    } catch (a) {
      console.error(`${te} | Failed to apply criteria state`, a), (r = (i = ui.notifications) == null ? void 0 : i.error) == null || r.call(
        i,
        v(
          "EIDOLON.CriteriaSwitcher.ApplyError",
          "Failed to apply the selected criteria state."
        )
      ), C(this, oe, Ri).call(this, "error", (a == null ? void 0 : a.message) ?? "Unknown error");
    } finally {
      S(this, Rn, !1), f(this, It) && C(this, oe, Cs).call(this);
    }
  }
}, "#applyPartialState"), Du = /* @__PURE__ */ c(function(t) {
  S(this, It, {
    ...f(this, It) ?? {},
    ...t ?? {}
  }), f(this, Ue) !== null && clearTimeout(f(this, Ue)), C(this, oe, Ri).call(this, "applying"), S(this, Ue, setTimeout(() => {
    S(this, Ue, null), C(this, oe, Cs).call(this);
  }, f(this, Qa)));
}, "#queuePartialState"), Cs = /* @__PURE__ */ c(async function() {
  if (f(this, Rn) || !f(this, It)) return;
  const t = f(this, It);
  S(this, It, null), await C(this, oe, Ts).call(this, t);
}, "#flushPendingState"), Fu = /* @__PURE__ */ c(async function() {
  if (!f(this, nt).length) return;
  const t = f(this, nt).reduce((i, r) => (i[r.key] = r.default, i), {});
  S(this, it, t), f(this, Ue) !== null && (clearTimeout(f(this, Ue)), S(this, Ue, null)), S(this, It, null), await C(this, oe, Ts).call(this, t);
}, "#resetToDefaults"), Ri = /* @__PURE__ */ c(function(t, i = "") {
  const r = this.element;
  if (!(r instanceof HTMLElement)) return;
  const a = r.querySelector("[data-role='status']");
  if (a instanceof HTMLElement)
    switch (a.dataset.mode = t, t) {
      case "applying":
        a.textContent = v("EIDOLON.CriteriaSwitcher.Applying", "Applying changes...");
        break;
      case "error":
        a.textContent = `${v("EIDOLON.CriteriaSwitcher.Error", "Error")}: ${i}`;
        break;
      case "ready":
      default:
        a.textContent = `${v("EIDOLON.CriteriaSwitcher.Ready", "Ready")}: ${C(this, oe, Ss).call(this)}`;
        break;
    }
}, "#setStatus"), Ss = /* @__PURE__ */ c(function() {
  return f(this, nt).length ? `[${f(this, nt).map((t) => {
    var i;
    return ((i = f(this, it)) == null ? void 0 : i[t.key]) ?? t.default;
  }).join(" | ")}]` : "-";
}, "#formatStateSummary"), c(ct, "CriteriaSwitcherApplication"), pe(ct, "APP_ID", `${te}-criteria-switcher`), pe(ct, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Ne(ct, ct, "DEFAULT_OPTIONS"),
  {
    id: ct.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Tc = Ne(ct, ct, "DEFAULT_OPTIONS")) == null ? void 0 : Tc.classes) ?? [], "eidolon-criteria-switcher-window", "themed"])
    ),
    tag: "section",
    window: {
      title: v("EIDOLON.CriteriaSwitcher.Title", "Criteria Switcher"),
      icon: "fa-solid fa-sliders",
      resizable: !1
    },
    position: {
      width: 420,
      height: "auto"
    }
  },
  { inplace: !1 }
)), pe(ct, "PARTS", {
  content: {
    template: `modules/${te}/templates/criteria-switcher.html`
  }
});
let Es = ct;
const Ah = io(Es);
let zn = null;
function Mh(n) {
  var e;
  return n ?? ((e = game.scenes) == null ? void 0 : e.viewed) ?? null;
}
c(Mh, "resolveScene");
function Nh(n) {
  var e;
  return !!(n != null && n.rendered && ((e = n == null ? void 0 : n.element) != null && e.isConnected));
}
c(Nh, "isRendered");
function co() {
  return Nh(zn) ? zn : (zn = null, null);
}
c(co, "getCriteriaSwitcher");
function Pu(n) {
  var i, r, a, o, s;
  const e = Mh(n);
  if (!e)
    return (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "No active scene to open the criteria switcher."), null;
  if (!oo(e))
    return (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, "You do not have permission to manage scene criteria."), null;
  const t = co();
  return t ? (t.setScene(e), t.render({ force: !0 }), (s = t.bringToFront) == null || s.call(t), t) : (zn = Ah({ scene: e }), zn.render({ force: !0 }), zn);
}
c(Pu, "openCriteriaSwitcher");
function _u() {
  const n = co();
  n && (n.close(), zn = null);
}
c(_u, "closeCriteriaSwitcher");
function hl(n) {
  return co() ? (_u(), null) : Pu(n);
}
c(hl, "toggleCriteriaSwitcher");
const kh = {
  SCHEMA_VERSION: cl,
  applyState: Au,
  getState: vh,
  getVersion: Th,
  setVersion: Mu,
  getCriteria(n) {
    var e;
    return at(n ?? ((e = game.scenes) == null ? void 0 : e.viewed));
  },
  setCriteria(n, e) {
    var t;
    return ao(e ?? ((t = game.scenes) == null ? void 0 : t.viewed), n);
  },
  updateTiles: wu,
  updatePlaceables: Ou,
  indexScene: Oh,
  openCriteriaSwitcher: Pu,
  closeCriteriaSwitcher: _u,
  toggleCriteriaSwitcher: hl,
  findBestMatch: _f,
  findFileIndex: xf,
  resolveRules: mu
};
function xu(n) {
  var e;
  return ((e = n == null ? void 0 : n.getFlag) == null ? void 0 : e.call(n, "monks-active-tiles", "files")) ?? [];
}
c(xu, "getTileFiles$1");
function $h(n = []) {
  return {
    strategy: "select-one",
    defaultTarget: fn(n, 0) ?? { indexHint: 0 },
    variants: [
      {
        criteria: {},
        target: fn(n, 0) ?? { indexHint: 0 }
      }
    ]
  };
}
c($h, "createDefaultTileCriteria");
function Dh(n, e = {}) {
  var o, s;
  const { allowLegacy: t = !0 } = e, i = xu(n), r = (o = n == null ? void 0 : n.getFlag) == null ? void 0 : o.call(n, te, Un);
  if (r) return Kn(r, { files: i });
  if (!t) return null;
  const a = (s = n == null ? void 0 : n.getFlag) == null ? void 0 : s.call(n, te, jn);
  return a ? Kn(a, { files: i }) : null;
}
c(Dh, "getTileCriteria");
async function Ql(n, e, t = {}) {
  if (!(n != null && n.setFlag)) return null;
  const {
    strictValidation: i = !0
  } = t, r = xu(n), a = Kn(e, { files: r });
  if (!a)
    return typeof n.unsetFlag == "function" ? (await n.unsetFlag(te, Un), await n.unsetFlag(te, jn)) : (await n.setFlag(te, Un, null), await n.setFlag(te, jn, null)), null;
  if (i) {
    const o = yu(a, { files: r });
    if (o.errors.length > 0)
      throw new Error(
        `Tile criteria contains ${o.errors.length} conflicting rule pair(s). Resolve clashes before saving.`
      );
  }
  return await n.setFlag(te, Un, a), typeof n.unsetFlag == "function" && await n.unsetFlag(te, jn), a;
}
c(Ql, "setTileCriteria");
const Ls = "__eidolon_any__", Bt = "eidolon-tile-criteria", Fh = "fa-solid fa-sliders", Ru = Symbol.for("eidolon.tileCriteriaUiState"), uo = ["all", "unmapped", "mapped", "conflicts"];
function Ph(n) {
  const e = n == null ? void 0 : n[Ru];
  return !e || typeof e != "object" ? {
    filterQuery: "",
    filterMode: "all",
    selectedFileIndex: null
  } : {
    filterQuery: typeof e.filterQuery == "string" ? e.filterQuery : "",
    filterMode: uo.includes(e.filterMode) ? e.filterMode : "all",
    selectedFileIndex: Number.isInteger(e.selectedFileIndex) ? e.selectedFileIndex : null
  };
}
c(Ph, "readUiState");
function _h(n, e) {
  if (!n || !e) return;
  typeof e.filterQuery == "string" && (n.filterQuery = e.filterQuery), uo.includes(e.filterMode) && (n.filterMode = e.filterMode), Number.isInteger(e.selectedFileIndex) && n.fileEntries.some((i) => i.index === e.selectedFileIndex) && (n.selectedFileIndex = e.selectedFileIndex);
}
c(_h, "applyUiState");
function xh(n) {
  const e = n == null ? void 0 : n.app, t = n == null ? void 0 : n.state;
  !e || !t || (e[Ru] = {
    filterQuery: typeof t.filterQuery == "string" ? t.filterQuery : "",
    filterMode: uo.includes(t.filterMode) ? t.filterMode : "all",
    selectedFileIndex: Number.isInteger(t.selectedFileIndex) ? t.selectedFileIndex : null
  });
}
c(xh, "persistUiState");
function Rh(n) {
  const e = (n == null ? void 0 : n.object) ?? (n == null ? void 0 : n.document) ?? null;
  return !(e != null && e.isEmbedded) || e.documentName !== "Tile" ? null : e;
}
c(Rh, "getTileDocument");
function Hh(n) {
  var e;
  return ((e = n == null ? void 0 : n.getFlag) == null ? void 0 : e.call(n, "monks-active-tiles", "files")) ?? [];
}
c(Hh, "getTileFiles");
function qh(n, e) {
  var s;
  const t = (n == null ? void 0 : n.parent) ?? ((s = game.scenes) == null ? void 0 : s.viewed) ?? null, r = at(t).sort((l, u) => l.order - u.order).map((l) => ({
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
c(qh, "getCriteriaDefinitions");
function Bh(n) {
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
c(Bh, "buildTree");
function jh(n, e) {
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
c(jh, "collapseFolderBranch");
function Uh(n, e) {
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
c(Uh, "getRuleSummariesForFile");
function Is(n) {
  var y, p;
  const e = Hh(n), t = ul(e), i = Dh(n, { allowLegacy: !0 }) ?? $h(e), r = qh(n, i), a = new Map(r.map((h) => [h.key, h.label])), o = new Map(
    t.map((h) => [
      h.index,
      h.path || h.label
    ])
  ), s = Vi(i.defaultTarget, e), l = ((y = t[0]) == null ? void 0 : y.index) ?? 0, u = s >= 0 ? s : l, d = new Map(t.map((h) => [h.index, []]));
  let g = 1;
  for (const h of i.variants ?? []) {
    const b = Vi(h.target, e);
    b < 0 || (d.has(b) || d.set(b, []), d.get(b).push({
      id: g,
      criteria: { ...h.criteria ?? {} }
    }), g += 1);
  }
  const m = t.some((h) => h.index === u) ? u : ((p = t[0]) == null ? void 0 : p.index) ?? null;
  return {
    files: e,
    fileEntries: t,
    criteriaDefinitions: r,
    criteriaLabels: a,
    relativePaths: o,
    defaultIndex: u,
    selectedFileIndex: m,
    filterQuery: "",
    filterMode: "all",
    nextRuleId: g,
    rulesByFile: d,
    status: {
      mode: "ready",
      message: v("EIDOLON.TileCriteria.Ready", "Ready")
    }
  };
}
c(Is, "buildEditorState");
function Os(n, e) {
  return n.rulesByFile.has(e) || n.rulesByFile.set(e, []), n.rulesByFile.get(e);
}
c(Os, "getRulesForFile");
function Vh(n) {
  return Object.fromEntries(
    Object.entries(n ?? {}).filter(([e, t]) => typeof e == "string" && e && typeof t == "string" && t.trim()).map(([e, t]) => [e, t.trim()])
  );
}
c(Vh, "sanitizeRuleCriteria");
function Hu(n) {
  const e = fn(n.files, n.defaultIndex);
  if (!e) return null;
  const t = [], i = [];
  for (const [a, o] of n.rulesByFile.entries()) {
    const s = fn(n.files, a);
    if (s)
      for (const [l, u] of o.entries()) {
        const d = Vh(u.criteria);
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
    normalized: Kn(
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
c(Hu, "buildTileCriteriaDraft");
function zh(n) {
  var e;
  return ((e = Hu(n)) == null ? void 0 : e.normalized) ?? null;
}
c(zh, "exportTileCriteria");
function Xl(n) {
  const e = Hu(n);
  if (!(e != null && e.normalized))
    return {
      errors: [],
      warnings: [],
      errorFileIndexes: [],
      warningFileIndexes: []
    };
  const t = yu(e.normalized, { files: n.files }), i = /* @__PURE__ */ c((s) => {
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
c(Xl, "analyzeRuleConflicts");
function Mr(n, e = "neutral") {
  const t = document.createElement("span");
  return t.classList.add("eidolon-tile-criteria__badge"), t.dataset.kind = e, t.textContent = n, t;
}
c(Mr, "createBadge");
function Gh(n, e = {}) {
  const t = typeof n == "string" ? n : "", {
    maxLength: i = 42,
    headLength: r = 20,
    tailLength: a = 16
  } = e;
  if (!t || t.length <= i) return t;
  const o = t.slice(0, r).trimEnd(), s = t.slice(-a).trimStart();
  return `${o}...${s}`;
}
c(Gh, "middleEllipsis");
function Wh(n) {
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
      error: (r == null ? void 0 : r.message) ?? v("EIDOLON.TileCriteria.InvalidRegex", "Invalid regex."),
      matches: /* @__PURE__ */ c(() => !0, "matches")
    };
  }
}
c(Wh, "createRegexFilter");
function Jh(n, e) {
  const t = document.createElement("select");
  t.dataset.criteriaKey = n.key;
  const i = document.createElement("option");
  i.value = Ls, i.textContent = "*", t.appendChild(i);
  const r = new Set(n.values ?? []);
  e && !r.has(e) && r.add(e);
  for (const a of r) {
    const o = document.createElement("option");
    o.value = a, o.textContent = a, t.appendChild(o);
  }
  return t.value = e ?? Ls, t;
}
c(Jh, "createCriterionSelect");
function Kh(n, e, t, i) {
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
    const g = Jh(l, (s = n.criteria) == null ? void 0 : s[l.key]);
    g.addEventListener("change", () => {
      g.value === Ls ? delete n.criteria[l.key] : n.criteria[l.key] = g.value, i();
    }), u.appendChild(g), a.appendChild(u);
  }
  r.appendChild(a);
  const o = document.createElement("button");
  return o.type = "button", o.classList.add("control", "ui-control", "eidolon-tile-criteria__rule-remove"), o.textContent = v("EIDOLON.TileCriteria.RemoveRule", "Remove"), o.addEventListener("click", () => {
    const u = Os(e, t).filter((d) => d.id !== n.id);
    e.rulesByFile.set(t, u), i();
  }), r.appendChild(o), r;
}
c(Kh, "renderRuleEditor");
const jr = /* @__PURE__ */ new WeakMap();
function qu(n) {
  return (n == null ? void 0 : n.app) ?? (n == null ? void 0 : n.tile) ?? null;
}
c(qu, "getDialogOwner");
function Yh(n) {
  for (const e of n) {
    const t = jt(e);
    if (t) return t;
    const i = jt(e == null ? void 0 : e.element);
    if (i) return i;
  }
  return null;
}
c(Yh, "findDialogRoot$1");
function Qh(n, e, t) {
  const i = n.state, r = i.fileEntries.find((h) => h.index === e);
  if (!r) return document.createElement("div");
  const a = document.createElement("section");
  a.classList.add("eidolon-tile-criteria__dialog-content");
  const o = document.createElement("header");
  o.classList.add("eidolon-tile-criteria__editor-header");
  const s = document.createElement("h4");
  s.textContent = i.relativePaths.get(r.index) || r.label, o.appendChild(s);
  const l = document.createElement("p");
  l.classList.add("notes"), l.textContent = `#${r.index + 1} · ${r.path || v("EIDOLON.TileCriteria.UnknownPath", "Unknown path")}`, o.appendChild(l), a.appendChild(o);
  const u = document.createElement("div");
  u.classList.add("eidolon-tile-criteria__editor-controls");
  const d = document.createElement("button");
  d.type = "button", d.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action"), i.defaultIndex === r.index ? (d.textContent = v("EIDOLON.TileCriteria.IsDefault", "Default Target"), d.disabled = !0) : (d.textContent = v("EIDOLON.TileCriteria.SetDefault", "Set As Default"), d.addEventListener("click", () => {
    i.defaultIndex = r.index, Re(n), t();
  })), u.appendChild(d);
  const g = document.createElement("button");
  g.type = "button", g.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action", "secondary"), g.textContent = v("EIDOLON.TileCriteria.ClearFileRules", "Clear File Rules"), g.addEventListener("click", () => {
    i.rulesByFile.set(r.index, []), Re(n), t();
  }), u.appendChild(g), a.appendChild(u);
  const m = document.createElement("div");
  m.classList.add("eidolon-tile-criteria__rule-editors");
  const y = Os(i, r.index);
  if (y.length)
    for (const h of y)
      m.appendChild(
        Kh(h, i, r.index, () => {
          Re(n), t();
        })
      );
  else {
    const h = document.createElement("p");
    h.classList.add("notes"), h.textContent = v(
      "EIDOLON.TileCriteria.NoRulesForFile",
      "No rules map to this file yet. Add one to define when this variant should be active."
    ), m.appendChild(h);
  }
  a.appendChild(m);
  const p = document.createElement("button");
  return p.type = "button", p.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action"), p.textContent = v("EIDOLON.TileCriteria.AddRule", "Add Rule"), p.disabled = !i.criteriaDefinitions.length, p.addEventListener("click", () => {
    Os(i, r.index).push({
      id: i.nextRuleId,
      criteria: {}
    }), i.nextRuleId += 1, Re(n), t();
  }), a.appendChild(p), a;
}
c(Qh, "buildRuleEditorContent");
function Xh(n, e) {
  var g, m, y;
  const t = qu(n);
  if (!t) return;
  const i = jr.get(t);
  if (i) {
    i.controller = n, i.fileIndex = e, (g = i.refresh) == null || g.call(i);
    return;
  }
  const r = {
    controller: n,
    fileIndex: e,
    host: null,
    refresh: null
  };
  jr.set(t, r);
  const a = /* @__PURE__ */ c(() => {
    jr.delete(t);
  }, "closeDialog"), o = /* @__PURE__ */ c(() => {
    r.host instanceof HTMLElement && r.host.replaceChildren(
      Qh(r.controller, r.fileIndex, o)
    );
  }, "refreshDialog");
  r.refresh = o;
  const s = v("EIDOLON.TileCriteria.EditorTitle", "Edit Tile Criteria Rules"), l = '<div class="eidolon-tile-criteria-editor-host"></div>', u = v("EIDOLON.TileCriteria.CloseEditor", "Close"), d = (y = (m = foundry == null ? void 0 : foundry.applications) == null ? void 0 : m.api) == null ? void 0 : y.DialogV2;
  if (typeof (d == null ? void 0 : d.wait) == "function") {
    d.wait({
      window: { title: s },
      content: l,
      buttons: [{ action: "close", label: u, default: !0 }],
      render: /* @__PURE__ */ c((...p) => {
        var w;
        const h = Yh(p), b = (w = h == null ? void 0 : h.querySelector) == null ? void 0 : w.call(h, ".eidolon-tile-criteria-editor-host");
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
c(Xh, "openRuleEditorDialog");
function Zl(n) {
  var i;
  const e = qu(n);
  if (!e) return;
  const t = jr.get(e);
  (i = t == null ? void 0 : t.refresh) == null || i.call(t);
}
c(Zl, "refreshOpenRuleEditor");
function As(n, e) {
  return (n.rulesByFile.get(e) ?? []).length > 0;
}
c(As, "hasRulesForFile");
function Bu(n, e) {
  var t, i;
  return ((t = n == null ? void 0 : n.errorFileIndexes) == null ? void 0 : t.includes(e)) || ((i = n == null ? void 0 : n.warningFileIndexes) == null ? void 0 : i.includes(e));
}
c(Bu, "hasConflictForFile");
function Zh(n, e, t) {
  switch (n.filterMode) {
    case "unmapped":
      return !As(n, e.index);
    case "mapped":
      return As(n, e.index);
    case "conflicts":
      return Bu(t, e.index);
    case "all":
    default:
      return !0;
  }
}
c(Zh, "matchesFilterMode");
function eg(n, e) {
  let t = 0, i = 0, r = 0;
  for (const a of n.fileEntries)
    As(n, a.index) ? t += 1 : i += 1, Bu(e, a.index) && (r += 1);
  return {
    all: n.fileEntries.length,
    mapped: t,
    unmapped: i,
    conflicts: r
  };
}
c(eg, "getFilterModeCounts");
function tg(n) {
  switch (n) {
    case "unmapped":
      return v("EIDOLON.TileCriteria.FilterModeUnmapped", "Unmapped");
    case "mapped":
      return v("EIDOLON.TileCriteria.FilterModeMapped", "Mapped");
    case "conflicts":
      return v("EIDOLON.TileCriteria.FilterModeConflicts", "Clashes");
    case "all":
    default:
      return v("EIDOLON.TileCriteria.FilterModeAll", "All");
  }
}
c(tg, "getFilterModeLabel");
function ju(n, e, t, i, r) {
  var u, d;
  const a = [...n.folders.keys()].sort((g, m) => g.localeCompare(m));
  for (const g of a) {
    const m = jh(g, n.folders.get(g)), y = document.createElement("li");
    y.classList.add("eidolon-tile-criteria__tree-branch");
    const p = document.createElement("div");
    p.classList.add("document", "folder", "update", "eidolon-tile-criteria__folder-row");
    const h = document.createElement("i");
    h.classList.add("fa-solid", "fa-folder-open"), p.appendChild(h);
    const b = document.createElement("span");
    b.classList.add("eidolon-tile-criteria__tree-folder-label"), b.textContent = m.label, b.title = m.label, p.appendChild(b), y.appendChild(p);
    const w = document.createElement("ul");
    w.classList.add("eidolon-tile-criteria__tree"), w.dataset.folder = m.label, ju(m.node, e, t, i, w), w.childElementCount > 0 && y.appendChild(w), r.appendChild(y);
  }
  const o = [...n.files].sort((g, m) => g.name.localeCompare(m.name));
  if (!o.length) return;
  const s = document.createElement("li"), l = document.createElement("ul");
  l.classList.add("document-list", "eidolon-tile-criteria__document-list");
  for (const g of o) {
    const m = g.entry, y = m.index === e.selectedFileIndex, p = m.index === e.defaultIndex, h = Uh(e, m.index), b = document.createElement("li");
    b.classList.add("document", "update", "eidolon-tile-criteria__tree-file");
    const w = document.createElement("button");
    w.type = "button", w.classList.add("eidolon-tile-criteria__file-row");
    const E = (u = i == null ? void 0 : i.errorFileIndexes) == null ? void 0 : u.includes(m.index), L = (d = i == null ? void 0 : i.warningFileIndexes) == null ? void 0 : d.includes(m.index);
    E ? w.classList.add("has-conflict") : L && w.classList.add("has-warning");
    const O = e.relativePaths.get(m.index) || m.path || g.name, M = [O];
    E ? M.push(
      v(
        "EIDOLON.TileCriteria.ConflictFileHint",
        "This file participates in one or more conflicting rules."
      )
    ) : L && M.push(
      v(
        "EIDOLON.TileCriteria.WarningFileHint",
        "This file has potentially redundant rules."
      )
    ), h.length || M.push(
      v(
        "EIDOLON.TileCriteria.UnmappedHint",
        "No criteria rules map to this file."
      )
    ), w.title = M.join(`
`), y && w.classList.add("is-selected"), w.addEventListener("click", () => {
      e.selectedFileIndex = m.index, Re(t), Xh(t, m.index);
    });
    const N = document.createElement("span");
    N.classList.add("eidolon-tile-criteria__indicator"), N.dataset.kind = p ? "default" : h.length ? "mapped" : "unmapped", w.appendChild(N);
    const D = document.createElement("span");
    D.classList.add("eidolon-tile-criteria__file-content");
    const ne = document.createElement("span");
    ne.classList.add("eidolon-tile-criteria__file-heading");
    const K = document.createElement("span");
    K.classList.add("eidolon-tile-criteria__file-title"), K.textContent = Gh(g.name || m.label), K.title = O, ne.appendChild(K);
    const x = Mr(`#${m.index + 1}`, "meta");
    x.classList.add("eidolon-tile-criteria__index-badge"), ne.appendChild(x), D.appendChild(ne);
    const V = document.createElement("span");
    V.classList.add("eidolon-tile-criteria__badges"), p && V.appendChild(Mr(v("EIDOLON.TileCriteria.DefaultBadge", "Default"), "default"));
    const $ = h.slice(0, 2);
    for (const q of $)
      V.appendChild(Mr(q, "rule"));
    if (h.length > $.length && V.appendChild(Mr(`+${h.length - $.length}`, "meta")), D.appendChild(V), w.appendChild(D), E || L) {
      const q = document.createElement("span");
      q.classList.add("eidolon-tile-criteria__row-warning"), q.dataset.mode = E ? "error" : "warning", q.innerHTML = '<i class="fa-solid fa-triangle-exclamation" inert=""></i>', w.appendChild(q);
    }
    b.appendChild(w), l.appendChild(b);
  }
  s.appendChild(l), r.appendChild(s);
}
c(ju, "renderTreeNode");
function ng(n, e, t, i = {}) {
  const r = document.createElement("section");
  r.classList.add("eidolon-tile-criteria__tree-panel");
  const a = Wh(n.filterQuery), o = eg(n, t);
  n.filterMode !== "all" && o[n.filterMode] === 0 && (n.filterMode = "all");
  const s = document.createElement("div");
  s.classList.add("eidolon-tile-criteria__toolbar");
  const l = document.createElement("div");
  l.classList.add("eidolon-tile-criteria__mode-bar");
  for (const E of uo) {
    const L = document.createElement("button");
    L.type = "button", L.classList.add("control", "ui-control", "eidolon-tile-criteria__mode-button"), L.dataset.mode = E, L.textContent = tg(E);
    const O = E === "all" || o[E] > 0;
    L.disabled = !O, O || (L.dataset.tooltip = v(
      "EIDOLON.TileCriteria.FilterModeUnavailable",
      "No entries currently match this filter."
    ), L.title = L.dataset.tooltip), n.filterMode === E ? (L.classList.add("is-active"), L.setAttribute("aria-pressed", "true")) : L.setAttribute("aria-pressed", "false"), L.addEventListener("click", () => {
      n.filterMode !== E && (n.filterMode = E, Re(e));
    }), l.appendChild(L);
  }
  s.appendChild(l);
  const u = document.createElement("div");
  u.classList.add("eidolon-tile-criteria__filter-row");
  const d = document.createElement("input");
  d.type = "text", d.classList.add("eidolon-tile-criteria__filter-input"), d.placeholder = v("EIDOLON.TileCriteria.FilterPlaceholder", "Regex filter (path)"), d.value = n.filterQuery, d.autocomplete = "off", d.addEventListener("keydown", (E) => {
    E.stopPropagation(), E.key === "Enter" && E.preventDefault();
  }), d.addEventListener("keyup", (E) => {
    E.stopPropagation();
  }), d.addEventListener("change", (E) => {
    E.stopPropagation();
  }), d.addEventListener("input", (E) => {
    E.stopPropagation();
    const L = d.selectionStart ?? d.value.length, O = d.selectionEnd ?? L;
    n.filterQuery = d.value, Re(e), requestAnimationFrame(() => {
      const M = e.section.querySelector(".eidolon-tile-criteria__filter-input");
      if (M instanceof HTMLInputElement) {
        M.focus();
        try {
          M.setSelectionRange(L, O);
        } catch {
        }
      }
    });
  }), u.appendChild(d);
  const g = document.createElement("div");
  g.classList.add("eidolon-tile-criteria__toolbar-actions");
  const m = document.createElement("button");
  m.type = "button";
  const y = v("EIDOLON.TileCriteria.Save", "Save Rules");
  m.classList.add("control", "ui-control", "eidolon-tile-criteria__toolbar-action", "icon-only"), m.dataset.tooltip = y, m.setAttribute("aria-label", y), m.title = y, m.innerHTML = '<i class="fa-solid fa-floppy-disk" inert=""></i>', m.disabled = t.errors.length > 0, m.addEventListener("click", () => {
    var E;
    (E = i.onSave) == null || E.call(i);
  }), g.appendChild(m);
  const p = document.createElement("button");
  p.type = "button";
  const h = v("EIDOLON.TileCriteria.Clear", "Clear Rules");
  if (p.classList.add("control", "ui-control", "secondary", "eidolon-tile-criteria__toolbar-action", "icon-only"), p.dataset.tooltip = h, p.setAttribute("aria-label", h), p.title = h, p.innerHTML = '<i class="fa-solid fa-trash" inert=""></i>', p.addEventListener("click", () => {
    var E;
    (E = i.onClear) == null || E.call(i);
  }), g.appendChild(p), u.appendChild(g), s.appendChild(u), r.appendChild(s), a.error) {
    const E = document.createElement("p");
    E.classList.add("notes", "eidolon-tile-criteria__filter-error"), E.textContent = `${v("EIDOLON.TileCriteria.InvalidRegex", "Invalid regex")}: ${a.error}`, r.appendChild(E);
  }
  const b = document.createElement("div");
  b.classList.add("eidolon-tile-criteria__library-tree");
  const w = n.fileEntries.filter((E) => {
    const L = n.relativePaths.get(E.index) || E.path || E.label;
    return Zh(n, E, t) && a.matches(L);
  });
  if (n.fileEntries.length)
    if (w.length) {
      const E = document.createElement("ul");
      E.classList.add("eidolon-tile-criteria__tree"), ju(Bh(w), n, e, t, E), b.appendChild(E);
    } else {
      const E = document.createElement("p");
      E.classList.add("notes"), E.textContent = v("EIDOLON.TileCriteria.NoMatches", "No variants match this filter."), b.appendChild(E);
    }
  else {
    const E = document.createElement("p");
    E.classList.add("notes"), E.textContent = v("EIDOLON.TileCriteria.NoVariants", "No MATT variants found"), b.appendChild(E);
  }
  return r.appendChild(b), r;
}
c(ng, "renderTreePanel");
function Re(n) {
  const { section: e, state: t } = n, i = Xl(t);
  xh(n), e.replaceChildren();
  const r = /* @__PURE__ */ c(async () => {
    try {
      const o = Xl(t);
      if (o.errors.length) {
        t.status = {
          mode: "error",
          message: v(
            "EIDOLON.TileCriteria.ConflictSaveBlocked",
            `Resolve ${o.errors.length} conflict(s) before saving tile criteria rules.`
          )
        }, Re(n);
        return;
      }
      const s = zh(t);
      if (!s) {
        t.status = {
          mode: "error",
          message: v("EIDOLON.TileCriteria.Invalid", "Invalid rules. Select valid target variants.")
        }, Re(n);
        return;
      }
      await Ql(n.tile, s);
      const l = t.filterQuery, u = t.filterMode, d = t.selectedFileIndex;
      n.state = Is(n.tile), n.state.filterQuery = l, n.state.filterMode = u, Number.isInteger(d) && (n.state.selectedFileIndex = d), n.state.status = {
        mode: "ready",
        message: v("EIDOLON.TileCriteria.Saved", "Tile criteria rules saved.")
      }, Re(n), Zl(n);
    } catch (o) {
      console.error(`${te} | Failed to save tile criteria`, o), t.status = {
        mode: "error",
        message: (o == null ? void 0 : o.message) ?? "Failed to save tile criteria rules."
      }, Re(n);
    }
  }, "handleSave"), a = /* @__PURE__ */ c(async () => {
    try {
      await Ql(n.tile, null);
      const o = t.filterQuery, s = t.filterMode, l = t.selectedFileIndex;
      n.state = Is(n.tile), n.state.filterQuery = o, n.state.filterMode = s, Number.isInteger(l) && (n.state.selectedFileIndex = l), n.state.status = {
        mode: "ready",
        message: v("EIDOLON.TileCriteria.Cleared", "Tile criteria rules cleared.")
      }, Re(n), Zl(n);
    } catch (o) {
      console.error(`${te} | Failed to clear tile criteria`, o), t.status = {
        mode: "error",
        message: (o == null ? void 0 : o.message) ?? "Failed to clear tile criteria rules."
      }, Re(n);
    }
  }, "handleClear");
  if (e.appendChild(ng(t, n, i, {
    onSave: r,
    onClear: a
  })), i.errors.length || i.warnings.length) {
    const o = document.createElement("section");
    o.classList.add("eidolon-tile-criteria__conflicts");
    const s = document.createElement("p");
    s.classList.add("eidolon-tile-criteria__conflict-summary", "notes"), i.errors.length ? (s.dataset.mode = "error", s.textContent = v(
      "EIDOLON.TileCriteria.ConflictSummary",
      `${i.errors.length} conflict(s) must be resolved before saving${i.warnings.length ? ` (${i.warnings.length} warning(s))` : ""}.`
    )) : (s.dataset.mode = "warning", s.textContent = v(
      "EIDOLON.TileCriteria.WarningSummary",
      `${i.warnings.length} potential issue(s) detected.`
    )), o.appendChild(s);
    const l = document.createElement("p");
    l.classList.add("eidolon-tile-criteria__conflict-hint", "notes"), l.textContent = v(
      "EIDOLON.TileCriteria.ConflictHint",
      "Files involved in clashes are marked in red with a warning icon."
    ), o.appendChild(l), e.appendChild(o);
  }
  if (t.status.mode === "error" || t.status.mode === "warning") {
    const o = document.createElement("p");
    o.classList.add("eidolon-tile-criteria__status", "notes"), o.dataset.mode = t.status.mode, o.textContent = t.status.message, e.appendChild(o);
  }
}
c(Re, "renderController");
function ig(n, e = null) {
  const t = document.createElement("section");
  t.classList.add("eidolon-tile-criteria");
  const i = Is(n);
  _h(i, Ph(e));
  const r = {
    app: e,
    tile: n,
    section: t,
    state: i
  };
  return Re(r), r;
}
c(ig, "createController");
function rg(n) {
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
c(rg, "findFooterElement");
function ag(n) {
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
c(ag, "findTabNav");
function og(n, e) {
  var i, r, a;
  return n instanceof HTMLElement ? [
    (i = n.querySelector(".tab[data-tab]")) == null ? void 0 : i.parentElement,
    n.querySelector(".sheet-body"),
    (a = (r = e == null ? void 0 : e.parentElement) == null ? void 0 : r.querySelector) == null ? void 0 : a.call(r, ":scope > .sheet-body"),
    e == null ? void 0 : e.parentElement
  ].find((o) => o instanceof HTMLElement) ?? null : null;
}
c(og, "findTabBody");
function sg(n, e) {
  var t, i, r, a, o, s, l;
  return ((t = n == null ? void 0 : n.dataset) == null ? void 0 : t.group) ?? ((a = (r = (i = n == null ? void 0 : n.querySelector) == null ? void 0 : i.call(n, "[data-group]")) == null ? void 0 : r.dataset) == null ? void 0 : a.group) ?? ((l = (s = (o = e == null ? void 0 : e.querySelector) == null ? void 0 : o.call(e, ".tab[data-group]")) == null ? void 0 : s.dataset) == null ? void 0 : l.group) ?? "main";
}
c(sg, "getTabGroup");
function lg(n, e) {
  if (!(n instanceof HTMLElement)) return;
  n.textContent = "";
  const t = document.createElement("i");
  t.className = Fh, t.setAttribute("inert", ""), n.append(t, " ");
  const i = document.createElement("span");
  i.textContent = e, n.append(i);
}
c(lg, "setTabButtonContent");
function cg(n, e) {
  const t = n.querySelector("[data-tab]"), i = (t == null ? void 0 : t.tagName) || "A", r = document.createElement(i);
  return t instanceof HTMLElement && (r.className = t.className), r.classList.remove("active"), i === "BUTTON" && (r.type = "button"), r.dataset.action = "tab", r.dataset.tab = Bt, r.dataset.group = e, r.setAttribute("aria-selected", "false"), r.setAttribute("aria-pressed", "false"), r;
}
c(cg, "createTabButton");
function ug(n, e) {
  const t = document.createElement("div");
  t.classList.add("tab"), t.dataset.tab = Bt, t.dataset.group = e, t.dataset.applicationPart = Bt, t.setAttribute("hidden", "true");
  const i = rg(n);
  return n.insertBefore(t, i ?? null), t;
}
c(ug, "createTabPanel");
function $o(n, e, t, i) {
  var o;
  if (!(t instanceof HTMLElement) || !(i instanceof HTMLElement)) return;
  const r = (o = n == null ? void 0 : n.tabGroups) == null ? void 0 : o[e];
  if (typeof r == "string" ? r === Bt : t.classList.contains("active") || i.classList.contains("active")) {
    t.classList.add("active"), t.setAttribute("aria-selected", "true"), t.setAttribute("aria-pressed", "true"), i.classList.add("active"), i.removeAttribute("hidden"), i.removeAttribute("aria-hidden");
    return;
  }
  t.classList.remove("active"), t.setAttribute("aria-selected", "false"), t.setAttribute("aria-pressed", "false"), i.classList.remove("active"), i.setAttribute("hidden", "true");
}
c($o, "syncTabVisibility");
function dg(n, e) {
  const t = ag(e), i = og(e, t);
  if (!(t instanceof HTMLElement) || !(i instanceof HTMLElement)) return null;
  const r = sg(t, i);
  let a = t.querySelector(`[data-tab="${Bt}"]`);
  a instanceof HTMLElement || (a = cg(t, r), t.appendChild(a)), lg(a, v("EIDOLON.TileCriteria.TabLabel", "Criteria"));
  let o = i.querySelector(`.tab[data-tab="${Bt}"]`);
  return o instanceof HTMLElement || (o = ug(i, r)), a.dataset.eidolonTileCriteriaBound || (a.addEventListener("click", () => {
    tu(n, Bt, r), requestAnimationFrame(() => {
      $o(n, r, a, o);
    });
  }), a.dataset.eidolonTileCriteriaBound = "true"), $o(n, r, a, o), requestAnimationFrame(() => {
    $o(n, r, a, o);
  }), o;
}
c(dg, "ensureTileCriteriaTab");
function fg() {
  Hooks.on("renderTileConfig", (n, e) => {
    var l, u, d, g;
    const t = jt(e);
    if (!t) return;
    const i = Rh(n);
    if (!i) return;
    if ((l = t.querySelector(".eidolon-tile-criteria")) == null || l.remove(), !ro()) {
      (u = t.querySelector(`.item[data-tab='${Bt}']`)) == null || u.remove(), (d = t.querySelector(`.tab[data-tab='${Bt}']`)) == null || d.remove();
      return;
    }
    const r = ig(i, n), a = dg(n, t);
    if (a instanceof HTMLElement) {
      a.replaceChildren(r.section), (g = n.setPosition) == null || g.call(n, { height: "auto" });
      return;
    }
    const o = (n == null ? void 0 : n.form) instanceof HTMLFormElement ? n.form : t instanceof HTMLFormElement ? t : t.querySelector("form");
    if (!(o instanceof HTMLFormElement)) return;
    const s = o.querySelector("button[type='submit']");
    s != null && s.parentElement ? s.parentElement.insertAdjacentElement("beforebegin", r.section) : o.appendChild(r.section);
  });
}
c(fg, "registerTileCriteriaConfigControls");
function hg(n) {
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
c(hg, "toList");
function gg(n, e) {
  const t = n == null ? void 0 : n.tools;
  return Array.isArray(t) ? t.some((i) => (i == null ? void 0 : i.name) === e) : t instanceof Map ? t.has(e) : t && typeof t == "object" ? e in t ? !0 : Object.values(t).some((i) => (i == null ? void 0 : i.name) === e) : !1;
}
c(gg, "hasTool");
function mg(n, e) {
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
c(mg, "addTool");
function pg() {
  Hooks.on("getSceneControlButtons", (n) => {
    var i;
    const e = hg(n);
    if (!e.length) return;
    const t = e.find((r) => (r == null ? void 0 : r.name) === "tiles") ?? e.find((r) => (r == null ? void 0 : r.name) === "tokens" || (r == null ? void 0 : r.name) === "token") ?? e[0];
    t && (gg(t, "eidolonCriteriaSwitcher") || mg(t, {
      name: "eidolonCriteriaSwitcher",
      title: "Criteria Switcher",
      icon: "fa-solid fa-sliders",
      button: !0,
      toggle: !1,
      visible: oo(((i = game.scenes) == null ? void 0 : i.viewed) ?? null),
      onClick: /* @__PURE__ */ c(() => hl(), "onClick")
    }));
  });
}
c(pg, "registerSceneControlButton");
function Nr(n, e) {
  if (!n || typeof n != "object") return !1;
  const t = String(e).split(".");
  let i = n;
  for (const r of t) {
    if (!i || typeof i != "object" || !Object.prototype.hasOwnProperty.call(i, r)) return !1;
    i = i[r];
  }
  return !0;
}
c(Nr, "hasOwnPath");
function yg() {
  const n = /* @__PURE__ */ c((i, r = null) => {
    i && ah(i, r);
  }, "invalidateTileScene"), e = /* @__PURE__ */ c((i, r = null) => {
    i && wh(i, r);
  }, "invalidatePlaceableScene");
  Hooks.on("createTile", (i) => {
    n((i == null ? void 0 : i.parent) ?? null, i ?? null);
  }), Hooks.on("deleteTile", (i) => {
    n((i == null ? void 0 : i.parent) ?? null, i ?? null);
  }), Hooks.on("updateTile", (i, r) => {
    (Nr(r, `flags.${te}.tileCriteria`) || Nr(r, `flags.${te}.fileIndex`)) && n((i == null ? void 0 : i.parent) ?? null, i ?? null);
  });
  const t = /* @__PURE__ */ c((i) => {
    Hooks.on(`create${i}`, (r) => {
      e((r == null ? void 0 : r.parent) ?? null, r ?? null);
    }), Hooks.on(`delete${i}`, (r) => {
      e((r == null ? void 0 : r.parent) ?? null, r ?? null);
    }), Hooks.on(`update${i}`, (r, a) => {
      const o = Nr(a, `flags.${te}.presets`), s = i === "AmbientLight" && Nr(a, `flags.${te}.lightCriteria`);
      !o && !s || e((r == null ? void 0 : r.parent) ?? null, r ?? null);
    });
  }, "registerPlaceableHooks");
  t("AmbientLight"), t("Wall"), t("AmbientSound"), Hooks.on("canvasReady", (i) => {
    const r = (i == null ? void 0 : i.scene) ?? null;
    r && (n(r), e(r));
  });
}
c(yg, "registerCriteriaCacheInvalidationHooks");
function bg() {
  pg(), fg(), yg(), Hooks.once("init", () => {
    var n, e;
    (e = (n = game.keybindings) == null ? void 0 : n.register) == null || e.call(n, te, "toggleCriteriaSwitcher", {
      name: "Toggle Criteria Switcher",
      hint: "Open or close the criteria switcher window for live scene state updates.",
      editable: [{ key: "KeyM", modifiers: ["Alt"] }],
      onDown: /* @__PURE__ */ c(() => {
        var t, i, r;
        return oo(((t = game.scenes) == null ? void 0 : t.viewed) ?? null) ? (hl(), !0) : ((r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "You do not have permission to manage scene criteria."), !0);
      }, "onDown"),
      restricted: !0,
      precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
    });
  }), Hooks.on("canvasReady", (n) => {
    var t;
    const e = co();
    e && (e.setScene((n == null ? void 0 : n.scene) ?? ((t = game.scenes) == null ? void 0 : t.viewed) ?? null), e.render({ force: !0 }));
  }), Hooks.once("ready", () => {
    var e, t;
    const n = (t = (e = game.modules) == null ? void 0 : e.get) == null ? void 0 : t.call(e, te);
    n && (n.api || (n.api = {}), n.api.criteria = kh, console.log(`${te} | Criteria engine API registered`));
  });
}
c(bg, "registerCriteriaEngineHooks");
bg();
const Ur = /* @__PURE__ */ new WeakMap(), kr = /* @__PURE__ */ new WeakMap(), me = "__eidolon_default__";
function wg() {
  Hooks.on("renderAmbientLightConfig", vg), A("LightCriteria | AmbientLightConfig controls registered");
}
c(wg, "registerAmbientLightCriteriaControls");
function vg(n, e) {
  var t;
  Ti("LightCriteria | renderAmbientLightConfig", {
    appId: (n == null ? void 0 : n.id) ?? null,
    constructor: ((t = n == null ? void 0 : n.constructor) == null ? void 0 : t.name) ?? null,
    isRendered: (n == null ? void 0 : n.rendered) ?? !1
  });
  try {
    const i = jt(e);
    if (!i) return;
    if (!ro()) {
      i.querySelectorAll(".eidolon-light-criteria, .eidolon-light-criteria-main-switcher").forEach((r) => r.remove());
      return;
    }
    Eg(n, i);
  } catch (i) {
    console.error("eidolon-utilities | Failed to enhance AmbientLightConfig UI", i);
  } finally {
    sn();
  }
}
c(vg, "handleAmbientLightConfigRender");
function Eg(n, e) {
  var Ie, En, Ni, Tr, Il;
  const t = (n == null ? void 0 : n.form) instanceof HTMLFormElement ? n.form : e instanceof HTMLFormElement ? e : (Ie = e == null ? void 0 : e.closest) == null ? void 0 : Ie.call(e, "form");
  if (!(t instanceof HTMLFormElement)) return;
  const i = t.querySelector(".window-content");
  if (!(i instanceof HTMLElement)) return;
  const r = Vu(n);
  if (!r) return;
  const a = Ug(r);
  A("LightCriteria | Resolved ambient light", {
    sheetId: (r == null ? void 0 : r.id) ?? null,
    persistedId: (a == null ? void 0 : a.id) ?? null,
    sameRef: r === a
  });
  const o = (a == null ? void 0 : a.parent) ?? r.parent ?? null, s = o ? If(o) : [], l = s.filter(
    (k) => Array.isArray(k == null ? void 0 : k.values) && k.values.length > 0
  ), u = Dg(s), d = s.map((k) => typeof (k == null ? void 0 : k.id) == "string" ? k.id : null).filter((k) => !!k), g = a ?? r, m = o ? at(o) : [];
  let y = Eu(g);
  const p = uh(y, m);
  JSON.stringify(p) !== JSON.stringify(y) && (y = p, Tu(g, p).catch((k) => {
    console.warn("eidolon-utilities | Failed to persist migrated light criteria keys", k);
  })), A("LightCriteria | Loaded mapping state", {
    hasBase: !!(y != null && y.base),
    mappingCount: Array.isArray(y == null ? void 0 : y.mappings) ? y.mappings.length : 0,
    mappings: Array.isArray(y == null ? void 0 : y.mappings) ? y.mappings.map((k) => {
      var _, G;
      return {
        id: k.id,
        key: k.key,
        hasColor: !!((G = (_ = k.config) == null ? void 0 : _.config) != null && G.color)
      };
    }) : []
  });
  const h = i.querySelector(".eidolon-light-criteria");
  h && h.remove(), i.querySelectorAll(".eidolon-light-criteria-main-switcher").forEach((k) => k.remove());
  const b = document.createElement("fieldset");
  b.classList.add("eidolon-light-criteria");
  const w = document.createElement("legend");
  w.textContent = v("EIDOLON.LightCriteria.Legend", "Scene Criteria Lighting"), b.appendChild(w);
  const E = document.createElement("p");
  E.classList.add("notes"), E.textContent = v(
    "EIDOLON.LightCriteria.Description",
    "Capture a base lighting state, then map criteria values to lighting configurations."
  ), b.appendChild(E);
  const L = document.createElement("div");
  L.classList.add("eidolon-light-criteria__controls");
  const O = document.createElement("button");
  O.type = "button", O.dataset.action = "make-default", O.classList.add("eidolon-light-criteria__button"), O.textContent = v(
    "EIDOLON.LightCriteria.SetBase",
    "Set Base"
  ), L.appendChild(O);
  const M = document.createElement("button");
  M.type = "button", M.dataset.action = "create-mapping", M.classList.add("eidolon-light-criteria__button"), M.textContent = v(
    "EIDOLON.LightCriteria.CreateMapping",
    "Add Criteria Mapping"
  ), M.setAttribute("aria-expanded", "false"), L.appendChild(M), b.appendChild(L);
  const N = document.createElement("p");
  N.classList.add("notes", "eidolon-light-criteria__status"), b.appendChild(N);
  const D = document.createElement("div");
  D.classList.add("eidolon-light-criteria__switcher");
  const ne = document.createElement("label");
  ne.classList.add("eidolon-light-criteria__switcher-label");
  const K = `${(n == null ? void 0 : n.id) ?? (r == null ? void 0 : r.id) ?? "eidolon-light"}-mapping-select`;
  ne.htmlFor = K, ne.textContent = v("EIDOLON.LightCriteria.SelectLabel", "Criteria Mapping"), D.appendChild(ne);
  const x = document.createElement("details");
  x.classList.add("eidolon-light-criteria__filter-details");
  const V = document.createElement("summary");
  V.classList.add("eidolon-light-criteria__filter-summary");
  const $ = document.createElement("span");
  $.classList.add("eidolon-light-criteria__filter-summary-label"), $.textContent = v(
    "EIDOLON.LightCriteria.FilterHeading",
    "Filter mappings"
  ), V.appendChild($);
  const q = document.createElement("span");
  q.classList.add("eidolon-light-criteria__filter-meta"), V.appendChild(q), x.appendChild(V);
  const Y = document.createElement("div");
  Y.classList.add("eidolon-light-criteria__filter-panel");
  const J = document.createElement("div");
  J.classList.add("eidolon-light-criteria__filter-grid");
  for (const k of l) {
    const _ = document.createElement("label");
    _.classList.add("eidolon-light-criteria__filter");
    const G = document.createElement("span");
    G.classList.add("eidolon-light-criteria__filter-name"), G.textContent = (Ni = (En = k.name) == null ? void 0 : En.trim) != null && Ni.call(En) ? k.name.trim() : v("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), _.appendChild(G);
    const X = document.createElement("select");
    X.dataset.filterCategoryId = k.id, X.classList.add("eidolon-light-criteria__filter-select");
    const ee = document.createElement("option");
    ee.value = "", ee.textContent = v("EIDOLON.LightCriteria.FilterAny", "Any"), X.appendChild(ee);
    for (const se of k.values) {
      const le = document.createElement("option");
      le.value = se, le.textContent = se, X.appendChild(le);
    }
    _.appendChild(X), J.appendChild(_);
  }
  Y.appendChild(J);
  const R = document.createElement("div");
  R.classList.add("eidolon-light-criteria__filter-actions");
  const B = document.createElement("button");
  B.type = "button", B.dataset.action = "clear-mapping-filters", B.classList.add("eidolon-light-criteria__button", "secondary", "compact"), B.textContent = v("EIDOLON.LightCriteria.ClearFilters", "Clear Filters"), R.appendChild(B), Y.appendChild(R), x.appendChild(Y), x.hidden = l.length === 0, D.appendChild(x);
  const Q = document.createElement("div");
  Q.classList.add("eidolon-light-criteria__switcher-controls"), D.appendChild(Q);
  const ae = document.createElement("select");
  ae.id = K, ae.classList.add("eidolon-light-criteria__select"), ae.dataset.action = "select-mapping", Q.appendChild(ae);
  const Z = document.createElement("button");
  Z.type = "button", Z.dataset.action = "apply-selected-mapping", Z.classList.add("eidolon-light-criteria__button", "secondary"), Z.textContent = v("EIDOLON.LightCriteria.ApplyButton", "Apply"), Q.appendChild(Z);
  const ie = document.createElement("details");
  ie.classList.add("eidolon-light-criteria__menu"), ie.dataset.action = "mapping-actions-menu";
  const wn = document.createElement("summary");
  wn.classList.add("eidolon-light-criteria__menu-toggle"), wn.innerHTML = '<i class="fa-solid fa-ellipsis-vertical" inert=""></i>', wn.setAttribute(
    "aria-label",
    v("EIDOLON.LightCriteria.MoreActions", "More actions")
  ), wn.dataset.tooltip = v("EIDOLON.LightCriteria.MoreActions", "More actions"), ie.appendChild(wn);
  const ot = document.createElement("div");
  ot.classList.add("eidolon-light-criteria__menu-list"), ie.appendChild(ot);
  const Me = document.createElement("button");
  Me.type = "button", Me.dataset.action = "update-selected-mapping", Me.classList.add("eidolon-light-criteria__menu-item"), Me.textContent = v(
    "EIDOLON.LightCriteria.UpdateSelected",
    "Save current config to selected"
  ), ot.appendChild(Me);
  const Ke = document.createElement("button");
  Ke.type = "button", Ke.dataset.action = "edit-selected-mapping-criteria", Ke.classList.add("eidolon-light-criteria__menu-item"), Ke.textContent = v(
    "EIDOLON.LightCriteria.EditSelectedCriteria",
    "Edit selected mapping criteria"
  ), ot.appendChild(Ke);
  const Ye = document.createElement("button");
  Ye.type = "button", Ye.dataset.action = "remove-selected-mapping", Ye.classList.add("eidolon-light-criteria__menu-item", "danger"), Ye.textContent = v(
    "EIDOLON.LightCriteria.RemoveSelected",
    "Delete selected mapping"
  ), ot.appendChild(Ye), Q.appendChild(ie);
  const Nt = document.createElement("div");
  Nt.classList.add("eidolon-light-criteria-main-switcher"), Nt.appendChild(D);
  const qe = document.createElement("p");
  if (qe.classList.add("notes", "eidolon-light-criteria-main-switcher__empty"), qe.textContent = v(
    "EIDOLON.LightCriteria.ActiveRequiresBase",
    "Set Base Lighting to enable mapping selection and actions."
  ), Nt.appendChild(qe), s.length === 0) {
    const k = document.createElement("p");
    k.classList.add("notification", "warning", "eidolon-light-criteria__warning"), k.textContent = v(
      "EIDOLON.LightCriteria.NoCategoriesWarning",
      "This scene has no criteria configured. Add criteria under Scene -> Criteria to enable criteria-driven lighting."
    ), b.appendChild(k);
  } else if (l.length === 0) {
    const k = document.createElement("p");
    k.classList.add("notification", "warning", "eidolon-light-criteria__warning"), k.textContent = v(
      "EIDOLON.LightCriteria.NoValuesWarning",
      "Criteria exist, but none define selectable values. Add values in Scene -> Criteria."
    ), b.appendChild(k);
  }
  const Te = document.createElement("div");
  Te.classList.add("eidolon-light-criteria__creation"), Te.dataset.section = "creation", Te.hidden = !0;
  const Qn = document.createElement("p");
  Qn.classList.add("notes"), Qn.textContent = v(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ), Te.appendChild(Qn);
  const kt = document.createElement("div");
  kt.classList.add("eidolon-light-criteria__category-list"), Te.appendChild(kt);
  for (const k of l) {
    const _ = document.createElement("label");
    _.classList.add("eidolon-light-criteria__category");
    const G = document.createElement("span");
    G.classList.add("eidolon-light-criteria__category-name"), G.textContent = (Il = (Tr = k.name) == null ? void 0 : Tr.trim) != null && Il.call(Tr) ? k.name.trim() : v("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), _.appendChild(G);
    const X = document.createElement("select");
    X.dataset.categoryId = k.id, X.classList.add("eidolon-light-criteria__category-select");
    const ee = document.createElement("option");
    ee.value = "", ee.textContent = v(
      "EIDOLON.LightCriteria.IgnoreCategory",
      "Ignore"
    ), X.appendChild(ee);
    for (const se of k.values) {
      const le = document.createElement("option");
      le.value = se, le.textContent = se, X.appendChild(le);
    }
    _.appendChild(X), kt.appendChild(_);
  }
  const vn = document.createElement("div");
  vn.classList.add("eidolon-light-criteria__creation-actions");
  const Qe = document.createElement("button");
  Qe.type = "button", Qe.dataset.action = "save-mapping", Qe.classList.add("eidolon-light-criteria__button", "primary"), Qe.textContent = v(
    "EIDOLON.LightCriteria.SaveMapping",
    "Save Mapping"
  ), vn.appendChild(Qe);
  const $t = document.createElement("button");
  $t.type = "button", $t.dataset.action = "cancel-create", $t.classList.add("eidolon-light-criteria__button", "secondary"), $t.textContent = v(
    "EIDOLON.LightCriteria.Cancel",
    "Cancel"
  ), vn.appendChild($t), Te.appendChild(vn), b.appendChild(Te), i.prepend(Nt), i.appendChild(b), b.hidden = !0, Sg(n, {
    fieldset: b,
    homeContainer: i
  }), requestAnimationFrame(() => {
    var k;
    (k = n.setPosition) == null || k.call(n, { height: "auto" });
  });
  let F = y;
  Sn({ switcher: D, emptyState: qe, state: F }), Cn(N, F), Fi(M, {
    state: F,
    hasCategories: l.length > 0
  }), A("LightCriteria | Controls injected", {
    sceneId: (o == null ? void 0 : o.id) ?? null,
    lightId: (r == null ? void 0 : r.id) ?? null,
    hasBase: !!(F != null && F.base),
    mappingCount: Array.isArray(F == null ? void 0 : F.mappings) ? F.mappings.length : 0,
    categories: l.length
  });
  const vr = Hg(F), z = {
    restoreConfig: null,
    app: n,
    selectedMapping: vr,
    editorMode: "create",
    editingMappingId: null,
    mappingFilters: {}
  };
  Ur.set(b, z);
  const st = /* @__PURE__ */ c(() => {
    ie.open = !1;
  }, "closeActionsMenu");
  wn.addEventListener("click", (k) => {
    ie.classList.contains("is-disabled") && (k.preventDefault(), st());
  });
  const Le = /* @__PURE__ */ c((k = z.selectedMapping) => {
    const _ = Fg(J), G = Array.isArray(F == null ? void 0 : F.mappings) ? F.mappings : [], X = _g(G, _), ee = Object.keys(_).length;
    z.mappingFilters = _, B.disabled = ee === 0, xg(q, {
      totalCount: G.length,
      visibleCount: X.length,
      hasFilters: ee > 0,
      activeFilterCount: ee
    }), x.classList.toggle("has-active-filters", ee > 0), Rg(ae, F, u, k, {
      mappings: X,
      categoryOrder: d
    }), z.selectedMapping = ae.value ?? "", Do({
      mappingSelect: ae,
      applyMappingButton: Z,
      updateMappingButton: Me,
      editCriteriaButton: Ke,
      removeMappingButton: Ye,
      actionsMenu: ie,
      state: F
    }), ie.classList.contains("is-disabled") && st();
  }, "refreshMappingSelector");
  J.querySelectorAll("select[data-filter-category-id]").forEach((k) => {
    k.addEventListener("change", () => {
      const _ = z.selectedMapping;
      Le(_), z.selectedMapping !== _ && Fo(
        a ?? r,
        F,
        z.selectedMapping
      ).then((G) => {
        G && (F = G);
      });
    });
  }), B.addEventListener("click", () => {
    Pg(J);
    const k = z.selectedMapping;
    Le(k), x.open = !1, z.selectedMapping !== k && Fo(
      a ?? r,
      F,
      z.selectedMapping
    ).then((_) => {
      _ && (F = _);
    });
  }), ae.addEventListener("change", () => {
    z.selectedMapping = ae.value ?? "", Do({
      mappingSelect: ae,
      applyMappingButton: Z,
      updateMappingButton: Me,
      editCriteriaButton: Ke,
      removeMappingButton: Ye,
      actionsMenu: ie,
      state: F
    }), Fo(
      a ?? r,
      F,
      z.selectedMapping
    ).then((k) => {
      k && (F = k);
    });
  });
  const Mi = /* @__PURE__ */ c(async () => {
    var X, ee, se, le, Xe, Vt, Ze, zt, fe, Gt, Wt, vt, Tn, ki;
    const k = ae.value ?? "";
    if (!k) {
      (ee = (X = ui.notifications) == null ? void 0 : X.warn) == null || ee.call(
        X,
        v(
          "EIDOLON.LightCriteria.SelectMappingWarning",
          "Choose a criteria mapping before applying."
        )
      ), Le(z.selectedMapping);
      return;
    }
    if (k === me) {
      if (!(F != null && F.base)) {
        (le = (se = ui.notifications) == null ? void 0 : se.warn) == null || le.call(
          se,
          v(
            "EIDOLON.LightCriteria.BaseUnavailable",
            "Set a base lighting state before applying it."
          )
        );
        return;
      }
      $r(b, Te, M), zr(n, t, F.base), F = await qi(a ?? r, {
        mappingId: me,
        categories: null,
        updatedAt: Date.now()
      }), z.selectedMapping = me, Le(z.selectedMapping), Cn(N, F), Sn({ switcher: D, emptyState: qe, state: F }), Fi(M, {
        state: F,
        hasCategories: l.length > 0
      }), tc(t, {
        mappingId: me,
        color: ((Vt = (Xe = F.base) == null ? void 0 : Xe.config) == null ? void 0 : Vt.color) ?? null
      }), (zt = (Ze = ui.notifications) == null ? void 0 : Ze.info) == null || zt.call(
        Ze,
        v(
          "EIDOLON.LightCriteria.BaseApplied",
          "Applied the base lighting state to the form."
        )
      ), st();
      return;
    }
    const _ = Array.isArray(F == null ? void 0 : F.mappings) && F.mappings.length ? F.mappings.find((Xn) => (Xn == null ? void 0 : Xn.id) === k) : null;
    if (!_) {
      (Gt = (fe = ui.notifications) == null ? void 0 : fe.warn) == null || Gt.call(
        fe,
        v(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      ), z.selectedMapping = "", Le(z.selectedMapping);
      return;
    }
    $r(b, Te, M), zr(n, t, _.config), F = await qi(a ?? r, {
      mappingId: _.id,
      categories: _.categories,
      updatedAt: Date.now()
    }), z.selectedMapping = _.id, Le(z.selectedMapping), Cn(N, F), Sn({ switcher: D, emptyState: qe, state: F }), Fi(M, {
      state: F,
      hasCategories: l.length > 0
    }), tc(t, {
      mappingId: _.id,
      color: ((vt = (Wt = _.config) == null ? void 0 : Wt.config) == null ? void 0 : vt.color) ?? null
    });
    const G = ci(_, u, d);
    (ki = (Tn = ui.notifications) == null ? void 0 : Tn.info) == null || ki.call(
      Tn,
      v(
        "EIDOLON.LightCriteria.MappingApplied",
        "Applied mapping: {label}"
      ).replace("{label}", G)
    ), st();
  }, "applySelectedMapping");
  Z.addEventListener("click", () => {
    Mi();
  }), ae.addEventListener("keydown", (k) => {
    k.key === "Enter" && (k.preventDefault(), Mi());
  });
  const Er = /* @__PURE__ */ c(async () => {
    var _, G, X, ee, se, le, Xe, Vt, Ze, zt, fe, Gt, Wt, vt, Tn, ki, Xn, Cr, Ol, Sr, Al;
    const k = z.selectedMapping;
    if (!k) {
      (G = (_ = ui.notifications) == null ? void 0 : _.warn) == null || G.call(
        _,
        v(
          "EIDOLON.LightCriteria.SelectMappingWarning",
          "Choose a criteria mapping before applying."
        )
      );
      return;
    }
    Me.disabled = !0;
    try {
      const Be = Vr(n, a);
      if (k === me)
        F = await Gl(a ?? r, Be), A("LightCriteria | Base lighting updated", {
          lightId: ((X = a ?? r) == null ? void 0 : X.id) ?? null,
          configColor: ((ee = Be == null ? void 0 : Be.config) == null ? void 0 : ee.color) ?? null
        }), (le = (se = ui.notifications) == null ? void 0 : se.info) == null || le.call(
          se,
          v(
            "EIDOLON.LightCriteria.BaseUpdated",
            "Updated the base lighting state with the current configuration."
          )
        ), z.selectedMapping = me;
      else {
        const Zn = Bi(F, k);
        if (!Zn) {
          (Vt = (Xe = ui.notifications) == null ? void 0 : Xe.warn) == null || Vt.call(
            Xe,
            v(
              "EIDOLON.LightCriteria.MappingUnavailable",
              "The selected criteria mapping is no longer available."
            )
          ), z.selectedMapping = "", Le(z.selectedMapping);
          return;
        }
        F = await Wl(
          a ?? r,
          Zn.categories,
          Be,
          { label: Zn.label ?? null }
        ), A("LightCriteria | Mapping updated", {
          mappingId: k,
          hasColor: !!((Ze = Be == null ? void 0 : Be.config) != null && Ze.color),
          stored: Array.isArray(F == null ? void 0 : F.mappings) ? ((zt = F.mappings.find((wo) => (wo == null ? void 0 : wo.id) === k)) == null ? void 0 : zt.config) ?? null : null,
          persisted: (Gt = (fe = a ?? r) == null ? void 0 : fe.getFlag) == null ? void 0 : Gt.call(fe, Vn, li)
        });
        const $i = Bi(F, k), xd = ci($i || Zn, u, d);
        A("LightCriteria | Mapping updated", {
          mappingId: k,
          categories: Zn.categories,
          updatedColor: ((Wt = Be == null ? void 0 : Be.config) == null ? void 0 : Wt.color) ?? null,
          storedColor: ((Tn = (vt = $i == null ? void 0 : $i.config) == null ? void 0 : vt.config) == null ? void 0 : Tn.color) ?? ((Xn = (ki = Zn.config) == null ? void 0 : ki.config) == null ? void 0 : Xn.color) ?? null
        }), (Ol = (Cr = ui.notifications) == null ? void 0 : Cr.info) == null || Ol.call(
          Cr,
          v(
            "EIDOLON.LightCriteria.MappingUpdated",
            "Saved changes to mapping: {label}"
          ).replace("{label}", xd)
        ), z.selectedMapping = k;
      }
      Cn(N, F), Sn({ switcher: D, emptyState: qe, state: F }), Fi(M, {
        state: F,
        hasCategories: l.length > 0
      }), Le(z.selectedMapping), st();
    } catch (Be) {
      console.error("eidolon-utilities | Failed to update light criteria mapping", Be), (Al = (Sr = ui.notifications) == null ? void 0 : Sr.error) == null || Al.call(
        Sr,
        v(
          "EIDOLON.LightCriteria.MappingUpdateError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      Me.disabled = !1, Do({
        mappingSelect: ae,
        applyMappingButton: Z,
        updateMappingButton: Me,
        editCriteriaButton: Ke,
        removeMappingButton: Ye,
        actionsMenu: ie,
        state: F
      });
    }
  }, "updateSelectedMapping");
  Me.addEventListener("click", () => {
    Er();
  }), Le(z.selectedMapping), O.addEventListener("click", async () => {
    var k, _, G, X, ee, se;
    O.disabled = !0;
    try {
      const le = Vr(n, a);
      F = await Gl(a ?? r, le), A("LightCriteria | Base lighting stored", {
        lightId: ((k = a ?? r) == null ? void 0 : k.id) ?? null,
        configColor: ((_ = le == null ? void 0 : le.config) == null ? void 0 : _.color) ?? null
      }), (X = (G = ui.notifications) == null ? void 0 : G.info) == null || X.call(
        G,
        v(
          "EIDOLON.LightCriteria.BaseStored",
          "Saved the current configuration as the base lighting state."
        )
      ), Cn(N, F), Sn({ switcher: D, emptyState: qe, state: F }), Fi(M, {
        state: F,
        hasCategories: l.length > 0
      }), z.selectedMapping = me, Le(z.selectedMapping);
    } catch (le) {
      console.error("eidolon-utilities | Failed to store base light criteria state", le), (se = (ee = ui.notifications) == null ? void 0 : ee.error) == null || se.call(
        ee,
        v(
          "EIDOLON.LightCriteria.BaseError",
          "Failed to save the base lighting state. Check the console for details."
        )
      );
    } finally {
      O.disabled = !1;
    }
  }), M.addEventListener("click", () => {
    var _, G, X, ee;
    if (!(F != null && F.base)) {
      (G = (_ = ui.notifications) == null ? void 0 : _.warn) == null || G.call(
        _,
        v(
          "EIDOLON.LightCriteria.RequiresBase",
          "Set a base lighting state before adding criteria mappings."
        )
      );
      return;
    }
    if (l.length === 0) {
      (ee = (X = ui.notifications) == null ? void 0 : X.warn) == null || ee.call(
        X,
        v(
          "EIDOLON.LightCriteria.NoCategoriesAvailable",
          "Add scene criteria with values in the Scene configuration before creating mappings."
        )
      );
      return;
    }
    const k = Ur.get(b);
    ec({
      app: n,
      fieldset: b,
      createButton: M,
      creationSection: Te,
      categoryList: kt,
      form: t,
      persistedLight: a,
      stateEntry: k,
      mode: "create",
      mapping: null,
      preloadConfig: F.base
    });
  }), Ke.addEventListener("click", () => {
    var G, X, ee, se;
    const k = z.selectedMapping;
    if (!k || k === me) {
      (X = (G = ui.notifications) == null ? void 0 : G.warn) == null || X.call(
        G,
        v(
          "EIDOLON.LightCriteria.SelectMappingForCriteriaEdit",
          "Select a mapping before editing criteria."
        )
      );
      return;
    }
    const _ = Bi(F, k);
    if (!_) {
      (se = (ee = ui.notifications) == null ? void 0 : ee.warn) == null || se.call(
        ee,
        v(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      );
      return;
    }
    st(), Uu(n, { fieldset: b, homeContainer: i }), ec({
      app: n,
      fieldset: b,
      createButton: M,
      creationSection: Te,
      categoryList: kt,
      form: t,
      persistedLight: a,
      stateEntry: z,
      mode: "retarget",
      mapping: _,
      preloadConfig: _.config
    });
  }), Qe.addEventListener("click", async () => {
    var _, G, X, ee, se, le, Xe, Vt, Ze, zt;
    const k = jg(kt);
    if (!k) {
      (G = (_ = ui.notifications) == null ? void 0 : _.warn) == null || G.call(
        _,
        v(
          "EIDOLON.LightCriteria.SelectionRequired",
          "Select at least one criteria value to identify the mapping."
        )
      );
      return;
    }
    Qe.disabled = !0;
    try {
      const fe = Vr(n, a);
      if (z.editorMode === "retarget" && z.editingMappingId) {
        const Wt = Ms(F, k);
        let vt = !1;
        if (Wt && Wt !== z.editingMappingId && (vt = await Tg(), !vt)) {
          Qe.disabled = !1;
          return;
        }
        F = await sh(
          a ?? r,
          z.editingMappingId,
          k,
          fe,
          { replaceExisting: vt }
        ), A("LightCriteria | Mapping criteria retargeted", {
          mappingId: z.editingMappingId,
          categories: k,
          replaced: vt,
          configColor: ((X = fe == null ? void 0 : fe.config) == null ? void 0 : X.color) ?? null
        }), (se = (ee = ui.notifications) == null ? void 0 : ee.info) == null || se.call(
          ee,
          v(
            "EIDOLON.LightCriteria.MappingCriteriaUpdated",
            "Updated mapping criteria for the selected mapping."
          )
        );
      } else
        F = await Wl(
          a ?? r,
          k,
          fe,
          {}
        ), A("LightCriteria | Mapping saved from editor", {
          categories: k,
          configColor: ((le = fe == null ? void 0 : fe.config) == null ? void 0 : le.color) ?? null
        }), (Vt = (Xe = ui.notifications) == null ? void 0 : Xe.info) == null || Vt.call(
          Xe,
          v(
            "EIDOLON.LightCriteria.MappingSaved",
            "Updated lighting mapping for the selected scene criteria."
          )
        );
      Cn(N, F), Sn({ switcher: D, emptyState: qe, state: F });
      const Gt = Ms(F, k);
      Gt && (z.selectedMapping = Gt), Le(z.selectedMapping), $r(b, Te, M), st();
    } catch (fe) {
      console.error("eidolon-utilities | Failed to persist light criteria mapping", fe), (zt = (Ze = ui.notifications) == null ? void 0 : Ze.error) == null || zt.call(
        Ze,
        v(
          "EIDOLON.LightCriteria.MappingError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      Qe.disabled = !1;
    }
  }), $t.addEventListener("click", () => {
    const k = Ur.get(b);
    k != null && k.restoreConfig && zr(n, t, k.restoreConfig), $r(b, Te, M);
  }), Ye.addEventListener("click", async () => {
    var G, X;
    const k = z.selectedMapping;
    !k || k === me || !await Cg() || (F = await lh(a ?? r, k), z.selectedMapping = "", Cn(N, F), Sn({ switcher: D, emptyState: qe, state: F }), Le(z.selectedMapping), st(), (X = (G = ui.notifications) == null ? void 0 : G.info) == null || X.call(
      G,
      v("EIDOLON.LightCriteria.MappingRemoved", "Removed selected mapping.")
    ));
  });
}
c(Eg, "enhanceAmbientLightConfig");
function ec({
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
  s && (s.restoreConfig = Vr(n, o), s.editorMode = l, s.editingMappingId = l === "retarget" ? (u == null ? void 0 : u.id) ?? null : null), d && zr(n, a, d), l === "retarget" && (u != null && u.categories) ? Bg(r, u.categories) : qg(r);
  const g = i.querySelector("p.notes");
  g instanceof HTMLElement && (g.textContent = l === "retarget" ? v(
    "EIDOLON.LightCriteria.EditCriteriaDescription",
    "Adjust criteria values for the selected mapping."
  ) : v(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const m = i.querySelector('button[data-action="save-mapping"]');
  m instanceof HTMLButtonElement && (m.textContent = l === "retarget" ? v("EIDOLON.LightCriteria.SaveCriteriaChanges", "Save Criteria Changes") : v("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), i.hidden = !1, t.setAttribute("aria-expanded", "true"), gl(e, i), requestAnimationFrame(() => {
    var y;
    (y = n.setPosition) == null || y.call(n, { height: "auto" });
  });
}
c(ec, "openMappingEditor");
async function Tg() {
  var t, i;
  const n = (i = (t = foundry == null ? void 0 : foundry.applications) == null ? void 0 : t.api) == null ? void 0 : i.DialogV2;
  if (typeof (n == null ? void 0 : n.confirm) == "function")
    return n.confirm({
      window: { title: v("EIDOLON.LightCriteria.ConflictTitle", "Replace Existing Mapping?") },
      content: `<p>${v(
        "EIDOLON.LightCriteria.ConflictBody",
        "A mapping already exists for this criteria combination. Replace it with the edited mapping?"
      )}</p>`,
      rejectClose: !1
    });
  const e = globalThis.Dialog;
  return typeof (e == null ? void 0 : e.confirm) != "function" ? !1 : e.confirm({
    title: v("EIDOLON.LightCriteria.ConflictTitle", "Replace Existing Mapping?"),
    content: `<p>${v(
      "EIDOLON.LightCriteria.ConflictBody",
      "A mapping already exists for this criteria combination. Replace it with the edited mapping?"
    )}</p>`,
    yes: /* @__PURE__ */ c(() => !0, "yes"),
    no: /* @__PURE__ */ c(() => !1, "no"),
    defaultYes: !1
  });
}
c(Tg, "confirmCriteriaConflict");
async function Cg() {
  var t, i;
  const n = (i = (t = foundry == null ? void 0 : foundry.applications) == null ? void 0 : t.api) == null ? void 0 : i.DialogV2;
  if (typeof (n == null ? void 0 : n.confirm) == "function")
    return n.confirm({
      window: { title: v("EIDOLON.LightCriteria.RemoveTitle", "Remove Mapping?") },
      content: `<p>${v(
        "EIDOLON.LightCriteria.RemoveBody",
        "Remove the currently selected mapping? This cannot be undone."
      )}</p>`,
      rejectClose: !1
    });
  const e = globalThis.Dialog;
  return typeof (e == null ? void 0 : e.confirm) != "function" ? !1 : e.confirm({
    title: v("EIDOLON.LightCriteria.RemoveTitle", "Remove Mapping?"),
    content: `<p>${v(
      "EIDOLON.LightCriteria.RemoveBody",
      "Remove the currently selected mapping? This cannot be undone."
    )}</p>`,
    yes: /* @__PURE__ */ c(() => !0, "yes"),
    no: /* @__PURE__ */ c(() => !1, "no"),
    defaultYes: !1
  });
}
c(Cg, "confirmRemoveMapping");
function Sg(n, { fieldset: e, homeContainer: t }) {
  const i = Og(n, t);
  if (!(i instanceof HTMLElement)) return;
  const r = i.querySelector(".window-header");
  if (!(r instanceof HTMLElement)) return;
  let a = r.querySelector('[data-eidolon-action="open-light-criteria-manager"]');
  if (!(a instanceof HTMLButtonElement)) {
    a = document.createElement("button"), a.type = "button", a.classList.add("header-control", "icon"), a.dataset.eidolonAction = "open-light-criteria-manager", a.dataset.tooltip = v("EIDOLON.LightCriteria.OpenManager", "Open Scene Criteria Lighting"), a.setAttribute("aria-label", v("EIDOLON.LightCriteria.OpenManager", "Open Scene Criteria Lighting")), a.innerHTML = '<i class="fa-solid fa-sliders" inert=""></i>';
    const o = r.querySelector(".window-controls") ?? r, s = o.querySelector('[data-action="toggleControls"]');
    if ((s == null ? void 0 : s.parentElement) === o)
      o.insertBefore(a, s);
    else {
      const l = o.querySelector('[data-action="close"]');
      (l == null ? void 0 : l.parentElement) === o ? o.insertBefore(a, l) : o.appendChild(a);
    }
  }
  a.onclick = (o) => {
    o.preventDefault(), Uu(n, { fieldset: e, homeContainer: t });
  };
}
c(Sg, "ensureManagerHeaderButton");
function Uu(n, { fieldset: e, homeContainer: t }) {
  var m, y, p;
  const i = kr.get(n);
  if (i != null && i.rendered) {
    (m = i.bringToTop) == null || m.call(i);
    return;
  }
  const r = /* @__PURE__ */ c((...h) => {
    var E;
    const b = Lg(h), w = (E = b == null ? void 0 : b.querySelector) == null ? void 0 : E.call(b, ".eidolon-light-criteria-manager-host");
    w instanceof HTMLElement && (Ig(e), e.hidden = !1, w.appendChild(e));
  }, "onRender"), a = /* @__PURE__ */ c(() => {
    t instanceof HTMLElement && t.appendChild(e), e.hidden = !0, kr.delete(n), requestAnimationFrame(() => {
      var h;
      (h = n.setPosition) == null || h.call(n, { height: "auto" });
    });
  }, "onClose"), o = v("EIDOLON.LightCriteria.ManagerTitle", "Scene Criteria Lighting"), s = '<div class="eidolon-light-criteria-manager-host"></div>', l = v("EIDOLON.LightCriteria.Close", "Close"), u = (p = (y = foundry == null ? void 0 : foundry.applications) == null ? void 0 : y.api) == null ? void 0 : p.DialogV2;
  if (typeof (u == null ? void 0 : u.wait) == "function")
    try {
      let h = !1;
      const b = /* @__PURE__ */ c(() => {
        h || (h = !0, a());
      }, "closeOnce");
      kr.set(n, {
        rendered: !0,
        bringToTop: /* @__PURE__ */ c(() => {
        }, "bringToTop")
      }), u.wait({
        window: { title: o },
        content: s,
        buttons: [{ action: "close", label: l, default: !0 }],
        render: /* @__PURE__ */ c((...w) => r(...w), "render"),
        close: b,
        rejectClose: !1
      }).catch((w) => {
        console.warn("eidolon-utilities | DialogV2 manager failed, falling back to Dialog", w), b();
      });
      return;
    } catch (h) {
      console.warn("eidolon-utilities | DialogV2 manager failed, falling back to Dialog", h), a();
    }
  const d = globalThis.Dialog;
  if (typeof d != "function") return;
  const g = new d(
    {
      title: o,
      content: s,
      buttons: {
        close: {
          label: l
        }
      },
      render: /* @__PURE__ */ c((...h) => r(...h), "render"),
      close: a
    },
    {
      width: 640,
      resizable: !0
    }
  );
  kr.set(n, g), g.render(!0);
}
c(Uu, "openManagerDialog");
function Lg(n) {
  for (const e of n) {
    const t = jt(e);
    if (t) return t;
    const i = jt(e == null ? void 0 : e.element);
    if (i) return i;
  }
  return null;
}
c(Lg, "findDialogRoot");
function Ig(n) {
  if (!(n instanceof HTMLElement) || n.dataset.managerLayout === "true") return;
  n.dataset.managerLayout = "true", n.classList.add("is-manager");
  const e = n.querySelector("legend"), t = n.querySelector("p.notes:not(.eidolon-light-criteria__status)"), i = n.querySelector(".eidolon-light-criteria__controls"), r = n.querySelector(".eidolon-light-criteria__status"), a = n.querySelector(".eidolon-light-criteria__creation"), o = Array.from(n.querySelectorAll(".eidolon-light-criteria__warning")), s = document.createElement("div");
  s.classList.add("eidolon-light-criteria-manager");
  const l = document.createElement("section");
  l.classList.add("eidolon-light-criteria-manager__section", "is-top"), s.appendChild(l);
  const u = document.createElement("section");
  u.classList.add("eidolon-light-criteria-manager__section", "is-bottom"), s.appendChild(u);
  const d = document.createElement("div");
  if (d.classList.add("eidolon-light-criteria-manager__header"), d.textContent = v("EIDOLON.LightCriteria.ManagerHeader", "Base State"), l.appendChild(d), r && l.appendChild(r), i && l.appendChild(i), o.length) {
    const m = document.createElement("div");
    m.classList.add("eidolon-light-criteria-manager__warnings");
    for (const y of o) m.appendChild(y);
    l.appendChild(m);
  }
  const g = document.createElement("div");
  g.classList.add("eidolon-light-criteria-manager__header"), g.textContent = v("EIDOLON.LightCriteria.ManagerAuthoring", "Create or Update Mapping"), u.appendChild(g), a && u.appendChild(a), n.innerHTML = "", e && n.appendChild(e), t && n.appendChild(t), n.appendChild(s), gl(n, a);
}
c(Ig, "applyManagerLayout");
function Og(n, e) {
  var i;
  const t = jt(n == null ? void 0 : n.element);
  return t || (((i = e == null ? void 0 : e.closest) == null ? void 0 : i.call(e, ".application")) ?? null);
}
c(Og, "resolveApplicationRoot");
function $r(n, e, t) {
  const i = Ur.get(n);
  i && (i.restoreConfig = null, i.editorMode = "create", i.editingMappingId = null), e.hidden = !0, t.setAttribute("aria-expanded", "false");
  const r = e.querySelector("p.notes");
  r instanceof HTMLElement && (r.textContent = v(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const a = e.querySelector('button[data-action="save-mapping"]');
  a instanceof HTMLButtonElement && (a.textContent = v("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), gl(n, e), requestAnimationFrame(() => {
    var o, s;
    (s = (o = i == null ? void 0 : i.app) == null ? void 0 : o.setPosition) == null || s.call(o, { height: "auto" });
  });
}
c($r, "hideCreationSection");
function Cn(n, e) {
  if (!n) return;
  const t = !!(e != null && e.base), i = Array.isArray(e == null ? void 0 : e.mappings) ? e.mappings.length : 0, r = [];
  r.push(
    t ? v(
      "EIDOLON.LightCriteria.StatusBaseSaved",
      "Base lighting saved."
    ) : v(
      "EIDOLON.LightCriteria.StatusBaseMissing",
      "Base lighting not yet saved."
    )
  ), r.push(
    v(
      "EIDOLON.LightCriteria.StatusMappingCount",
      "Mappings: {count}"
    ).replace("{count}", String(i))
  ), n.textContent = r.join(" ");
}
c(Cn, "updateStatusLine");
function Fi(n, { state: e, hasCategories: t }) {
  if (!n) return;
  const i = !!(e != null && e.base), r = i && t;
  n.disabled = !r, n.title = r ? "" : i ? v(
    "EIDOLON.LightCriteria.CreateDisabledNoCategories",
    "Add scene criteria with values before creating mappings."
  ) : v(
    "EIDOLON.LightCriteria.CreateDisabledNoBase",
    "Save a base lighting state before creating criteria mappings."
  );
}
c(Fi, "updateCreateButtonState");
function Vr(n, e) {
  var l, u, d;
  const t = e ?? Vu(n);
  if (!t)
    throw new Error("Ambient light document unavailable.");
  const i = Yn(((l = t.toObject) == null ? void 0 : l.call(t)) ?? {});
  if (!i)
    throw new Error("Unable to duplicate ambient light data.");
  const r = (n == null ? void 0 : n.form) instanceof HTMLFormElement ? n.form : null, a = r ? df(r) : {}, o = foundry.utils.mergeObject(i, a, {
    inplace: !1,
    performDeletions: !0
  });
  r && (r.querySelectorAll("color-picker[name]").forEach((g) => {
    var w, E;
    const m = g.getAttribute("name");
    if (!m) return;
    const y = typeof g.value == "string" ? g.value : "", p = ((w = g.ui) == null ? void 0 : w.input) ?? ((E = g.querySelector) == null ? void 0 : E.call(g, 'input[type="color"]')), h = (p == null ? void 0 : p.value) ?? "", b = y || h;
    typeof b != "string" || !b || (foundry.utils.setProperty(o, m, b), A("LightCriteria | Captured color-picker value", {
      path: m,
      pickerValue: y,
      swatchValue: h,
      chosenValue: b
    }));
  }), r.querySelectorAll("range-picker[name]").forEach((g) => {
    var M, N;
    const m = g.getAttribute("name");
    if (!m) return;
    const y = g.value !== void 0 && g.value !== null ? String(g.value) : "", p = (M = g.querySelector) == null ? void 0 : M.call(g, 'input[type="range"]'), h = (N = g.querySelector) == null ? void 0 : N.call(g, 'input[type="number"]'), b = p instanceof HTMLInputElement ? p.value : "", w = h instanceof HTMLInputElement ? h.value : "", E = y || w || b;
    if (typeof E != "string" || !E.length) return;
    const L = Number(E), O = Number.isFinite(L) ? L : E;
    foundry.utils.setProperty(o, m, O), A("LightCriteria | Captured range-picker value", {
      path: m,
      elementValue: y,
      numberValue: w,
      rangeValue: b,
      chosenValue: O
    });
  }));
  const s = Yn(o);
  return A("LightCriteria | Captured form config", {
    lightId: (t == null ? void 0 : t.id) ?? null,
    hasColor: !!((u = s == null ? void 0 : s.config) != null && u.color),
    color: ((d = s == null ? void 0 : s.config) == null ? void 0 : d.color) ?? null
  }), s;
}
c(Vr, "captureAmbientLightFormConfig");
function zr(n, e, t) {
  if (!t || typeof t != "object") return;
  const i = foundry.utils.flattenObject(t, { safe: !0 });
  for (const [r, a] of Object.entries(i)) {
    const o = e.querySelectorAll(`[name="${r}"]`);
    if (o.length) {
      A("LightCriteria | Applying field", {
        path: r,
        value: a,
        elementCount: o.length
      });
      for (const s of o)
        s instanceof HTMLElement && s.tagName === "COLOR-PICKER" ? Mg(s, a) : s instanceof HTMLElement && s.tagName === "RANGE-PICKER" ? Ng(s, a) : s instanceof HTMLInputElement ? Ag(s, a) : s instanceof HTMLSelectElement ? kg(s, a) : s instanceof HTMLTextAreaElement && $g(s, a);
    }
  }
  requestAnimationFrame(() => {
    var r;
    return (r = n._previewChanges) == null ? void 0 : r.call(n);
  });
}
c(zr, "applyConfigToForm");
function Ag(n, e, t) {
  const i = n.type;
  if (i === "checkbox") {
    const o = !!e;
    n.checked !== o && (n.checked = o, wt(n));
    return;
  }
  if (i === "radio") {
    const o = e == null ? "" : String(e), s = n.value === o;
    n.checked !== s && (n.checked = s, s && wt(n));
    return;
  }
  const r = e == null ? "" : String(e);
  let a = !1;
  n.value !== r && (n.value = r, a = !0), a && wt(n);
}
c(Ag, "applyValueToInput");
function Mg(n, e, t) {
  var s, l, u, d, g, m;
  const i = e == null ? "" : String(e);
  let r = !1;
  n.value !== i && (n.value = i, n.setAttribute("value", i), (s = n.ui) != null && s.setValue && n.ui.setValue(i), r = !0);
  const a = ((l = n.ui) == null ? void 0 : l.input) ?? ((u = n.querySelector) == null ? void 0 : u.call(n, 'input[type="color"]'));
  a instanceof HTMLInputElement && a.value !== i && (a.value = i, wt(a));
  const o = ((d = n.ui) == null ? void 0 : d.text) ?? ((g = n.querySelector) == null ? void 0 : g.call(n, 'input[type="text"]'));
  o instanceof HTMLInputElement && o.value !== i && (o.value = i, wt(o)), (m = n.ui) != null && m.commit ? n.ui.commit() : (n.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), n.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }))), A("LightCriteria | Color picker applied", {
    value: i,
    pickerValue: n.value ?? null,
    swatchValue: (a == null ? void 0 : a.value) ?? null,
    textValue: (o == null ? void 0 : o.value) ?? null
  }), r && wt(n);
}
c(Mg, "applyValueToColorPicker");
function Ng(n, e, t) {
  var u, d;
  const i = e == null ? "" : String(e), r = Number(i), a = Number.isFinite(r) ? r : i;
  let o = !1;
  n.value !== void 0 && n.value !== a && (n.value = a, o = !0), n.getAttribute("value") !== i && (n.setAttribute("value", i), o = !0);
  const s = (u = n.querySelector) == null ? void 0 : u.call(n, 'input[type="range"]');
  s instanceof HTMLInputElement && s.value !== i && (s.value = i, wt(s));
  const l = (d = n.querySelector) == null ? void 0 : d.call(n, 'input[type="number"]');
  if (l instanceof HTMLInputElement && l.value !== i && (l.value = i, wt(l)), typeof n.commit == "function")
    try {
      n.commit();
    } catch (g) {
      console.error("eidolon-utilities | range-picker commit failed", g);
    }
  A("LightCriteria | Range picker applied", {
    value: i,
    resolvedValue: a,
    rangeValue: (s == null ? void 0 : s.value) ?? null,
    numberValue: (l == null ? void 0 : l.value) ?? null
  }), o && wt(n);
}
c(Ng, "applyValueToRangePicker");
function kg(n, e, t) {
  const i = e == null ? "" : String(e);
  n.value !== i && (n.value = i, wt(n));
}
c(kg, "applyValueToSelect");
function $g(n, e, t) {
  const i = e == null ? "" : String(e);
  n.value !== i && (n.value = i, wt(n));
}
c($g, "applyValueToTextarea");
function wt(n) {
  n.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), n.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }));
}
c(wt, "triggerInputChange");
function Do({
  mappingSelect: n,
  applyMappingButton: e,
  updateMappingButton: t,
  editCriteriaButton: i,
  removeMappingButton: r,
  actionsMenu: a,
  state: o
}) {
  const s = (n == null ? void 0 : n.value) ?? "", l = !!(o != null && o.base), u = s && s !== me ? !!Bi(o, s) : !1;
  if (e instanceof HTMLButtonElement && (s ? s === me ? e.disabled = !l : e.disabled = !u : e.disabled = !0), t instanceof HTMLButtonElement && (s ? s === me ? t.disabled = !1 : t.disabled = !u : t.disabled = !0), i instanceof HTMLButtonElement && (i.disabled = !s || s === me || !u), r instanceof HTMLButtonElement && (r.disabled = !s || s === me || !u), a instanceof HTMLElement) {
    const d = t instanceof HTMLButtonElement && !t.disabled || i instanceof HTMLButtonElement && !i.disabled || r instanceof HTMLButtonElement && !r.disabled;
    a.classList.toggle("is-disabled", !d), !d && "open" in a && (a.open = !1);
  }
}
c(Do, "syncMappingSwitcherState");
function Dg(n) {
  const e = /* @__PURE__ */ new Map();
  for (const t of n) {
    if (!t) continue;
    const i = typeof t.id == "string" ? t.id : null;
    if (!i) continue;
    const r = typeof t.name == "string" && t.name.trim() ? t.name.trim() : v("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category");
    e.has(i) || e.set(i, r);
  }
  return e;
}
c(Dg, "buildCategoryNameLookup");
function Fg(n) {
  const e = {};
  return n instanceof HTMLElement && n.querySelectorAll("select[data-filter-category-id]").forEach((t) => {
    var a, o;
    const i = t.dataset.filterCategoryId, r = (o = (a = t.value) == null ? void 0 : a.trim) == null ? void 0 : o.call(a);
    !i || !r || (e[i] = r);
  }), e;
}
c(Fg, "readMappingFilterSelections");
function Pg(n) {
  n instanceof HTMLElement && n.querySelectorAll("select[data-filter-category-id]").forEach((e) => {
    e.value = "";
  });
}
c(Pg, "resetMappingFilterSelections");
function _g(n, e) {
  const t = Array.isArray(n) ? n : [], i = Object.entries(e ?? {}).filter(([, r]) => !!r);
  return i.length ? t.filter((r) => {
    if (!r || typeof r != "object") return !1;
    const a = r.categories ?? {};
    for (const [o, s] of i)
      if ((a == null ? void 0 : a[o]) !== s) return !1;
    return !0;
  }) : t.slice();
}
c(_g, "filterMappingsByCriteria");
function xg(n, { totalCount: e = 0, visibleCount: t = 0, hasFilters: i = !1, activeFilterCount: r = 0 } = {}) {
  if (!(n instanceof HTMLElement)) return;
  if (!i) {
    n.textContent = v(
      "EIDOLON.LightCriteria.FilterSummaryAll",
      "All ({count})"
    ).replace("{count}", String(e));
    return;
  }
  const a = v(
    "EIDOLON.LightCriteria.FilterSummaryActive",
    "{active} filters · {visible}/{total}"
  ).replace("{active}", String(r)).replace("{visible}", String(t)).replace("{total}", String(e));
  n.textContent = a;
}
c(xg, "updateMappingFilterMeta");
function Rg(n, e, t, i, r = {}) {
  if (!(n instanceof HTMLSelectElement)) return;
  const a = typeof i == "string" ? i : "", o = !!(e != null && e.base), s = Array.isArray(r == null ? void 0 : r.categoryOrder) ? r.categoryOrder : [], l = Array.isArray(r == null ? void 0 : r.mappings) ? r.mappings.slice() : Array.isArray(e == null ? void 0 : e.mappings) ? e.mappings.slice() : [], u = n.value;
  n.innerHTML = "";
  const d = document.createElement("option");
  d.value = "", d.textContent = v(
    "EIDOLON.LightCriteria.SelectPlaceholder",
    "Select a mapping"
  ), d.disabled = o, n.appendChild(d);
  const g = document.createElement("option");
  g.value = me, g.textContent = v(
    "EIDOLON.LightCriteria.BaseOption",
    "Base Lighting"
  ), g.disabled = !o, n.appendChild(g), l.slice().sort((h, b) => {
    var L;
    const w = ci(h, t, s), E = ci(b, t, s);
    return w.localeCompare(E, ((L = game.i18n) == null ? void 0 : L.lang) ?? void 0, {
      sensitivity: "base"
    });
  }).forEach((h) => {
    if (!(h != null && h.id)) return;
    const b = document.createElement("option");
    b.value = h.id, b.textContent = ci(h, t, s), n.appendChild(b);
  });
  const m = new Set(
    Array.from(n.options).filter((h) => !h.disabled).map((h) => h.value)
  ), y = o && u === "" ? "" : u, p = a || (m.has(y) ? y : "");
  p && m.has(p) ? n.value = p : o ? n.value = me : n.value = "";
}
c(Rg, "populateMappingSelector");
function ci(n, e, t = []) {
  if (!n || typeof n != "object")
    return v("EIDOLON.LightCriteria.UnnamedMapping", "Unnamed Mapping");
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
    return `${e.get(s) ?? v("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category")}=${u}`;
  }).filter(Boolean);
  return o.length === 0 ? v("EIDOLON.LightCriteria.UnnamedMapping", "Unnamed Mapping") : o.join(" | ");
}
c(ci, "formatMappingOptionLabel");
function Ms(n, e) {
  if (!n || typeof n != "object" || !Array.isArray(n.mappings)) return null;
  const t = Ii(e);
  if (!t) return null;
  const i = n.mappings.find((r) => (r == null ? void 0 : r.key) === t);
  return (i == null ? void 0 : i.id) ?? null;
}
c(Ms, "findMappingIdByCategories");
function Bi(n, e) {
  return !e || !n || typeof n != "object" || !Array.isArray(n.mappings) ? null : n.mappings.find((t) => (t == null ? void 0 : t.id) === e) ?? null;
}
c(Bi, "getMappingById");
function Hg(n) {
  if (!n || typeof n != "object") return "";
  const e = n.current;
  if (e != null && e.mappingId) {
    if (e.mappingId === me)
      return n != null && n.base ? me : "";
    if (Array.isArray(n.mappings) && n.mappings.some((t) => t.id === e.mappingId))
      return e.mappingId;
  }
  if (e != null && e.categories) {
    const t = Ms(n, e.categories);
    if (t) return t;
  }
  return "";
}
c(Hg, "resolveInitialMappingSelection");
function tc(n, e = {}) {
  var o, s, l, u;
  if (!(n instanceof HTMLFormElement)) return;
  const t = n.querySelector('color-picker[name="config.color"]'), i = (t == null ? void 0 : t.value) ?? null, r = ((o = t == null ? void 0 : t.ui) == null ? void 0 : o.text) ?? ((s = t == null ? void 0 : t.querySelector) == null ? void 0 : s.call(t, 'input[type="text"]')), a = ((l = t == null ? void 0 : t.ui) == null ? void 0 : l.input) ?? ((u = t == null ? void 0 : t.querySelector) == null ? void 0 : u.call(t, 'input[type="color"]'));
  A("LightCriteria | Color state after apply", {
    ...e,
    textValue: (r == null ? void 0 : r.value) ?? null,
    pickerValue: i,
    swatchValue: (a == null ? void 0 : a.value) ?? null
  });
}
c(tc, "logAppliedColorState");
function qg(n) {
  n.querySelectorAll("select[data-category-id]").forEach((e) => {
    e.value = "";
  });
}
c(qg, "resetCategorySelections");
function Bg(n, e) {
  const t = e && typeof e == "object" ? e : {};
  n.querySelectorAll("select[data-category-id]").forEach((i) => {
    const r = i.dataset.categoryId;
    if (!r) return;
    const a = t[r];
    i.value = typeof a == "string" ? a : "";
  });
}
c(Bg, "setCategorySelections");
function jg(n) {
  const e = {};
  return n.querySelectorAll("select[data-category-id]").forEach((t) => {
    var a, o;
    const i = t.dataset.categoryId, r = (o = (a = t.value) == null ? void 0 : a.trim) == null ? void 0 : o.call(a);
    !i || !r || (e[i] = r);
  }), Object.keys(e).length > 0 ? e : null;
}
c(jg, "readCategorySelections");
async function Fo(n, e, t) {
  if (!n) return null;
  try {
    if (!t)
      return await qi(n, {});
    if (t === me)
      return await qi(n, {
        mappingId: me,
        categories: null,
        updatedAt: Date.now()
      });
    const i = Bi(e, t);
    return i ? await qi(n, {
      mappingId: i.id,
      categories: i.categories,
      updatedAt: Date.now()
    }) : null;
  } catch (i) {
    return console.warn("eidolon-utilities | Failed to persist mapping selection", i), null;
  }
}
c(Fo, "persistCurrentSelection");
function gl(n, e) {
  if (!(n instanceof HTMLElement)) return;
  const t = n.querySelector(".eidolon-light-criteria-manager__section.is-bottom");
  t instanceof HTMLElement && (t.hidden = !!(e != null && e.hidden));
}
c(gl, "updateManagerSectionVisibility");
function Sn({ switcher: n, emptyState: e, state: t }) {
  const i = !!(t != null && t.base);
  n instanceof HTMLElement && (n.hidden = !i), e instanceof HTMLElement && (e.hidden = i);
}
c(Sn, "updateActiveMappingVisibility");
function Vu(n) {
  const e = (n == null ? void 0 : n.object) ?? (n == null ? void 0 : n.document) ?? null;
  return !(e != null && e.isEmbedded) || e.documentName !== "AmbientLight" ? null : e;
}
c(Vu, "getAmbientLightDocument");
function Ug(n) {
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
c(Ug, "getPersistedAmbientLightDocument");
function Vg() {
  wg();
}
c(Vg, "registerLightCriteriaHooks");
Vg();
const Ns = /* @__PURE__ */ new Map();
let ks = !1;
function ml(n, e) {
  Ns.has(n) && console.warn(`[${T}] Socket handler for type "${n}" already registered, overwriting.`), Ns.set(n, e);
}
c(ml, "registerSocketHandler");
function Gr(n, e) {
  if (!ks) {
    console.error(`[${T}] Socket not initialized. Call initializeSocket() first.`);
    return;
  }
  game.socket.emit(`module.${T}`, { type: n, payload: e });
}
c(Gr, "emitSocket");
function zg() {
  ks || (game.socket.on(`module.${T}`, (n) => {
    const { type: e, payload: t } = n ?? {}, i = Ns.get(e);
    i ? i(t) : console.warn(`[${T}] No socket handler for type "${e}"`);
  }), ks = !0, console.log(`[${T}] Socket initialized on channel module.${T}`));
}
c(zg, "initializeSocket");
const zu = "tween", Gu = "tween-sequence", $s = "tween-sequence-cancel", Ee = Object.freeze({
  ABORT: "abort",
  CONTINUE: "continue"
}), Jt = Object.freeze({
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  FAILED: "failed"
}), lt = Object.freeze({
  BEFORE_ALL: "beforeAll",
  BEFORE_STEP: "before",
  ENTRY: "entry",
  AFTER_STEP: "after",
  RUNTIME: "runtime",
  VALIDATION: "validation",
  AWAIT: "await",
  EMIT: "emit",
  PARALLEL: "parallel"
}), fa = /* @__PURE__ */ new Map();
function Ut({ type: n, execute: e, validate: t }) {
  fa.has(n) && console.warn(`[tween-registry] Type "${n}" already registered, overwriting.`), fa.set(n, { type: n, execute: e, validate: t ?? (() => {
  }) });
}
c(Ut, "registerTweenType");
function br(n) {
  return fa.get(n);
}
c(br, "getTweenType");
function Gg(n, e = {}) {
  const t = br(n);
  if (!t)
    throw new Error(`Unknown tween type: "${n}".`);
  return t.validate(e ?? {}), t;
}
c(Gg, "validateTweenEntry");
function Ds() {
  return [...fa.keys()];
}
c(Ds, "listTweenTypes");
const di = {
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
  easeInBounce: /* @__PURE__ */ c((n) => 1 - di.easeOutBounce(1 - n), "easeInBounce"),
  easeInOutBounce: /* @__PURE__ */ c((n) => n < 0.5 ? (1 - di.easeOutBounce(1 - 2 * n)) / 2 : (1 + di.easeOutBounce(2 * n - 1)) / 2, "easeInOutBounce"),
  easeInElastic: /* @__PURE__ */ c((n) => n === 0 || n === 1 ? n : -Math.pow(2, 10 * (n - 1)) * Math.sin((n - 1.1) * 5 * Math.PI), "easeInElastic"),
  easeOutElastic: /* @__PURE__ */ c((n) => n === 0 || n === 1 ? n : Math.pow(2, -10 * n) * Math.sin((n - 0.1) * 5 * Math.PI) + 1, "easeOutElastic")
};
function wr(n) {
  if (n && di[n])
    return di[n];
  const e = foundry.canvas.animation.CanvasAnimation;
  return {
    linear: e.easeLinear,
    easeInOutCosine: e.easeInOutCosine
  }[n] ?? e.easeInOutCosine;
}
c(wr, "resolveEasing");
function Wg() {
  return ["linear", "easeInOutCosine", ...Object.keys(di)];
}
c(Wg, "listEasingNames");
function ha(n) {
  return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
}
c(ha, "srgbToLinear");
function fi(n) {
  return n <= 31308e-7 ? 12.92 * n : 1.055 * n ** (1 / 2.4) - 0.055;
}
c(fi, "linearToSrgb");
function nc(n, e, t) {
  const i = 0.4122214708 * n + 0.5363325363 * e + 0.0514459929 * t, r = 0.2119034982 * n + 0.6806995451 * e + 0.1073969566 * t, a = 0.0883024619 * n + 0.2817188376 * e + 0.6299787005 * t, o = Math.cbrt(i), s = Math.cbrt(r), l = Math.cbrt(a);
  return [
    0.2104542553 * o + 0.793617785 * s - 0.0040720468 * l,
    1.9779984951 * o - 2.428592205 * s + 0.4505937099 * l,
    0.0259040371 * o + 0.7827717662 * s - 0.808675766 * l
  ];
}
c(nc, "linearRgbToOklab");
function Jg(n, e, t) {
  const i = (n + 0.3963377774 * e + 0.2158037573 * t) ** 3, r = (n - 0.1055613458 * e - 0.0638541728 * t) ** 3, a = (n - 0.0894841775 * e - 1.291485548 * t) ** 3;
  return [
    4.0767416621 * i - 3.3077115913 * r + 0.2309699292 * a,
    -1.2684380046 * i + 2.6097574011 * r - 0.3413193965 * a,
    -0.0041960863 * i - 0.7034186147 * r + 1.707614701 * a
  ];
}
c(Jg, "oklabToLinearRgb");
function ga(n) {
  return [n.r, n.g, n.b];
}
c(ga, "colorToRgb");
function Wu(n, e, t) {
  const i = /* @__PURE__ */ c((a) => Math.max(0, Math.min(1, a)), "clamp"), r = /* @__PURE__ */ c((a) => Math.round(i(a) * 255).toString(16).padStart(2, "0"), "toHex");
  return `#${r(n)}${r(e)}${r(t)}`;
}
c(Wu, "rgbToHex");
function Kg(n, e, t) {
  if (t <= 0) return n.toHTML();
  if (t >= 1) return e.toHTML();
  const i = foundry.utils.Color, [r, a, o] = n.hsl, [s, l, u] = e.hsl, d = (s - r + 0.5) % 1 - 0.5, g = (r + d * t + 1) % 1, m = a + (l - a) * t, y = o + (u - o) * t;
  return i.fromHSL([g, m, y]).toHTML();
}
c(Kg, "interpolateHsl");
function Yg(n, e, t) {
  if (t <= 0) return n.toHTML();
  if (t >= 1) return e.toHTML();
  const [i, r, a] = ga(n).map(ha), [o, s, l] = ga(e).map(ha), u = fi(i + (o - i) * t), d = fi(r + (s - r) * t), g = fi(a + (l - a) * t);
  return Wu(u, d, g);
}
c(Yg, "interpolateRgb");
function Qg(n, e, t) {
  if (t <= 0) return n.toHTML();
  if (t >= 1) return e.toHTML();
  const [i, r, a] = ga(n).map(ha), [o, s, l] = ga(e).map(ha), [u, d, g] = nc(i, r, a), [m, y, p] = nc(o, s, l), h = 0.02, b = Math.sqrt(d * d + g * g), w = Math.sqrt(y * y + p * p);
  let E, L, O;
  if (b < h || w < h)
    E = u + (m - u) * t, L = d + (y - d) * t, O = g + (p - g) * t;
  else {
    const ne = Math.atan2(g, d);
    let x = Math.atan2(p, y) - ne;
    x > Math.PI && (x -= 2 * Math.PI), x < -Math.PI && (x += 2 * Math.PI), E = u + (m - u) * t;
    const V = b + (w - b) * t, $ = ne + x * t;
    L = V * Math.cos($), O = V * Math.sin($);
  }
  const [M, N, D] = Jg(E, L, O);
  return Wu(fi(M), fi(N), fi(D));
}
c(Qg, "interpolateOklch");
const Fs = {
  hsl: Kg,
  rgb: Yg,
  oklch: Qg
};
function Xg(n = "hsl") {
  return Fs[n] ?? Fs.hsl;
}
c(Xg, "getInterpolator");
function ic() {
  return Object.keys(Fs);
}
c(ic, "listInterpolationModes");
function Zg(n) {
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
  if (n.mode && !ic().includes(n.mode))
    throw new Error(
      `light-color tween: unknown mode "${n.mode}". Available: ${ic().join(", ")}`
    );
}
c(Zg, "validate$5");
async function em(n, e = {}) {
  const { CanvasAnimation: t } = foundry.canvas.animation, { Color: i } = foundry.utils, { uuid: r, toColor: a, toAlpha: o, mode: s = "oklch" } = n, l = Array.isArray(r) ? r : [r];
  if (l.length === 0)
    return console.warn("light-color tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: u = 2e3,
    easing: d = "easeInOutCosine",
    commit: g = !0,
    startEpochMS: m = null,
    signal: y = null
  } = e, p = wr(d), h = a != null, b = o != null, w = h ? Xg(s) : null, E = h ? i.fromString(a) : null;
  if (h && !E.valid) throw new Error(`light-color tween: invalid target color "${a}".`);
  async function L(M) {
    var J, R;
    if (y != null && y.aborted) return !1;
    const N = await fromUuid(M);
    if (!N) return !1;
    const D = N.object;
    if (!D) return !1;
    let ne;
    if (h) {
      const B = (J = N.config) == null ? void 0 : J.color;
      B != null && B.valid || console.warn(`light-color tween: source color invalid on ${M}, using white.`), ne = B != null && B.valid ? B : i.fromString("#ffffff");
    }
    const K = b ? ((R = N._source.config) == null ? void 0 : R.alpha) ?? 0.5 : null, x = { t: 0 }, V = `ambient-hue-tween:${M}`;
    t.terminateAnimation(V), y && y.addEventListener("abort", () => {
      t.terminateAnimation(V);
    }, { once: !0 });
    const $ = typeof m == "number" ? Math.max(0, Math.min(u, Date.now() - m)) : 0, q = /* @__PURE__ */ c((B) => {
      const Q = {};
      h && (Q.color = w(ne, E, B)), b && (Q.alpha = K + (o - K) * B), N.updateSource({ config: Q }), D.initializeLightSource();
    }, "applyFrame");
    $ > 0 && (x.t = $ / u, q(x.t));
    const Y = await t.animate(
      [{ parent: x, attribute: "t", to: 1 }],
      {
        name: V,
        duration: u,
        easing: p,
        time: $,
        ontick: /* @__PURE__ */ c(() => q(x.t), "ontick")
      }
    );
    if (Y !== !1) {
      if (y != null && y.aborted) return !1;
      const B = {};
      h && (B.color = E.toHTML()), b && (B.alpha = o), N.updateSource({ config: B }), D.initializeLightSource();
    }
    if (g && Y !== !1 && N.canUserModify(game.user, "update")) {
      if (y != null && y.aborted) return !1;
      const B = {}, Q = {};
      h && (B.color = ne.toHTML(), Q["config.color"] = E.toHTML()), b && (B.alpha = K, Q["config.alpha"] = o), N.updateSource({ config: B }), await N.update(Q);
    }
    return Y !== !1;
  }
  return c(L, "animateOne"), (await Promise.all(l.map(L))).every(Boolean);
}
c(em, "execute$5");
function tm() {
  Ut({ type: "light-color", execute: em, validate: Zg });
}
c(tm, "registerLightColorTween");
const Kt = /* @__PURE__ */ new WeakMap();
function nm(n) {
  if ((Array.isArray(n.uuid) ? n.uuid : [n.uuid]).some((t) => !t || typeof t != "string"))
    throw new Error("light-state tween: 'uuid' is required (string or array of AmbientLight document UUIDs).");
  if (typeof n.enabled != "boolean")
    throw new Error("light-state tween: 'enabled' (boolean) is required.");
}
c(nm, "validate$4");
async function im(n, e = {}) {
  const { CanvasAnimation: t } = foundry.canvas.animation, { uuid: i, enabled: r } = n, a = Array.isArray(i) ? i : [i];
  if (a.length === 0)
    return console.warn("light-state tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: o = 2e3,
    easing: s = "easeInOutCosine",
    commit: l = !0,
    startEpochMS: u = null,
    signal: d = null
  } = e, g = wr(s);
  async function m(p) {
    var N, D, ne, K;
    if (d != null && d.aborted) return !1;
    const h = await fromUuid(p);
    if (!h) return !1;
    const b = h.object;
    if (!b) return !1;
    const w = `ambient-state-tween:${p}`;
    t.terminateAnimation(w), d && d.addEventListener("abort", () => {
      t.terminateAnimation(w);
    }, { once: !0 });
    const E = Kt.get(h) ?? {
      hidden: h._source.hidden,
      alpha: ((N = h._source.config) == null ? void 0 : N.alpha) ?? 0.5
    };
    if (Kt.set(h, E), A(`light-state START ${r ? "ON" : "OFF"} | snap: ${JSON.stringify(E)} | _source.hidden=${h._source.hidden}, _source.config.alpha=${(D = h._source.config) == null ? void 0 : D.alpha}`), r && !E.hidden || !r && E.hidden)
      return Kt.delete(h), !0;
    const L = E.alpha, O = typeof u == "number" ? Math.max(0, Math.min(o, Date.now() - u)) : 0, M = /* @__PURE__ */ c((x) => {
      h.updateSource({ config: { alpha: x } }), b.initializeLightSource();
    }, "applyAlpha");
    if (r) {
      h.updateSource({ hidden: !1, config: { alpha: 0 } }), b.initializeLightSource(), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
      const x = { t: 0 };
      O > 0 && (x.t = O / o, M(L * x.t));
      const V = await t.animate(
        [{ parent: x, attribute: "t", to: 1 }],
        {
          name: w,
          duration: o,
          easing: g,
          time: O,
          ontick: /* @__PURE__ */ c(() => M(L * x.t), "ontick")
        }
      );
      return V !== !1 && !(d != null && d.aborted) && l && h.canUserModify(game.user, "update") ? (h.updateSource({ hidden: !0, config: { alpha: L } }), await h.update({ hidden: !1 }), A(`light-state FADE-IN committed. _source.hidden=${h._source.hidden}, _source.config.alpha=${(ne = h._source.config) == null ? void 0 : ne.alpha}`), Kt.delete(h)) : V === !1 || Kt.delete(h), V !== !1;
    } else {
      h.updateSource({ hidden: !1, config: { alpha: E.alpha } }), b.initializeLightSource();
      const x = { t: 0 };
      O > 0 && (x.t = O / o, M(L * (1 - x.t)));
      const V = await t.animate(
        [{ parent: x, attribute: "t", to: 1 }],
        {
          name: w,
          duration: o,
          easing: g,
          time: O,
          ontick: /* @__PURE__ */ c(() => M(L * (1 - x.t)), "ontick")
        }
      );
      return V !== !1 && !(d != null && d.aborted) && l && h.canUserModify(game.user, "update") ? (await h.update({ hidden: !0 }), h.updateSource({ config: { alpha: L } }), b.initializeLightSource(), A(`light-state FADE-OUT committed+restored. _source.hidden=${h._source.hidden}, _source.config.alpha=${(K = h._source.config) == null ? void 0 : K.alpha}`), Kt.delete(h)) : V === !1 || (h.updateSource({ hidden: !0, config: { alpha: L } }), b.initializeLightSource(), Kt.delete(h)), V !== !1;
    }
  }
  return c(m, "animateOne"), (await Promise.all(a.map(m))).every(Boolean);
}
c(im, "execute$4");
function rm() {
  Ut({ type: "light-state", execute: im, validate: nm });
}
c(rm, "registerLightStateTween");
function fo(n) {
  if ((Array.isArray(n.uuid) ? n.uuid : [n.uuid]).some((t) => !t || typeof t != "string"))
    throw new Error("tile-prop tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (!n.attribute || typeof n.attribute != "string")
    throw new Error("tile-prop tween: 'attribute' (string) is required — dot-path to a numeric property (e.g. 'alpha', 'rotation').");
  if (typeof n.value != "number")
    throw new Error("tile-prop tween: 'value' (number) is required — the target value to animate to.");
}
c(fo, "validate$3");
async function ho(n, e = {}) {
  const { CanvasAnimation: t } = foundry.canvas.animation, { uuid: i, attribute: r, value: a } = n, o = Array.isArray(i) ? i : [i];
  if (o.length === 0)
    return console.warn("tile-prop tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: s = 2e3,
    easing: l = "easeInOutCosine",
    commit: u = !0,
    startEpochMS: d = null,
    signal: g = null
  } = e, m = wr(l);
  async function y(h) {
    if (g != null && g.aborted) return !1;
    const b = await fromUuid(h);
    if (!b) return !1;
    const w = b.object;
    if (!w) return !1;
    const E = foundry.utils.getProperty(b._source, r);
    if (typeof E != "number")
      return console.warn(`tile-prop tween: source value at '${r}' on ${h} is not a number (got ${typeof E}). Skipping.`), !1;
    const L = `tile-prop-tween:${r}:${h}`;
    t.terminateAnimation(L), g && g.addEventListener("abort", () => {
      t.terminateAnimation(L);
    }, { once: !0 });
    const O = typeof d == "number" ? Math.max(0, Math.min(s, Date.now() - d)) : 0, M = /* @__PURE__ */ c((ne) => {
      const K = E + (a - E) * ne;
      b.updateSource(foundry.utils.expandObject({ [r]: K })), w.refresh();
    }, "applyFrame"), N = { t: 0 };
    O > 0 && (N.t = O / s, M(N.t));
    const D = await t.animate(
      [{ parent: N, attribute: "t", to: 1 }],
      {
        name: L,
        duration: s,
        easing: m,
        time: O,
        ontick: /* @__PURE__ */ c(() => M(N.t), "ontick")
      }
    );
    if (D !== !1) {
      if (g != null && g.aborted) return !1;
      b.updateSource(foundry.utils.expandObject({ [r]: a })), w.refresh();
    }
    if (u && D !== !1 && b.canUserModify(game.user, "update")) {
      if (g != null && g.aborted) return !1;
      b.updateSource(foundry.utils.expandObject({ [r]: E })), await b.update({ [r]: a });
    }
    return D !== !1;
  }
  return c(y, "animateOne"), (await Promise.all(o.map(y))).every(Boolean);
}
c(ho, "execute$3");
function am() {
  Ut({ type: "tile-prop", execute: ho, validate: fo });
}
c(am, "registerTilePropTween");
function om(n) {
  if (!n.attribute || typeof n.attribute != "string")
    throw new Error("particles-prop tween: 'attribute' (string) is required — property name on canvas.particleeffects (e.g. 'alpha').");
  if (typeof n.value != "number")
    throw new Error("particles-prop tween: 'value' (number) is required — the target value to animate to.");
}
c(om, "validate$2");
async function sm(n, e = {}) {
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
  const g = wr(o), m = `particles-prop-tween:${i}`;
  t.terminateAnimation(m), l && l.addEventListener("abort", () => {
    t.terminateAnimation(m);
  }, { once: !0 });
  const y = typeof s == "number" ? Math.max(0, Math.min(a, Date.now() - s)) : 0, p = /* @__PURE__ */ c((w) => {
    u[i] = d + (r - d) * w;
  }, "applyFrame"), h = { t: 0 };
  y > 0 && (h.t = y / a, p(h.t));
  const b = await t.animate(
    [{ parent: h, attribute: "t", to: 1 }],
    {
      name: m,
      duration: a,
      easing: g,
      time: y,
      ontick: /* @__PURE__ */ c(() => p(h.t), "ontick")
    }
  );
  if (b !== !1) {
    if (l != null && l.aborted) return !1;
    u[i] = r;
  }
  return b !== !1;
}
c(sm, "execute$2");
function lm() {
  Ut({ type: "particles-prop", execute: sm, validate: om });
}
c(lm, "registerParticlesPropTween");
var Zt, Xi, Zi, er, tr, nr, pi;
const Tl = class Tl {
  /**
   * @param {AbortController} controller
   */
  constructor(e) {
    I(this, Zt);
    I(this, Xi);
    I(this, Zi);
    I(this, er);
    I(this, tr);
    I(this, nr, !1);
    I(this, pi, null);
    S(this, Zt, e), S(this, er, new Promise((t) => {
      S(this, Xi, t);
    })), S(this, tr, new Promise((t) => {
      S(this, Zi, t);
    }));
  }
  /** @returns {Promise<boolean>} Resolves true (completed) or false (cancelled/failed). */
  get finished() {
    return f(this, er);
  }
  /** @returns {Promise<{status: string, [k: string]: unknown}>} */
  get result() {
    return f(this, tr);
  }
  /** @returns {boolean} */
  get cancelled() {
    return f(this, Zt).signal.aborted;
  }
  /** @returns {AbortSignal} */
  get signal() {
    return f(this, Zt).signal;
  }
  /** @returns {string} */
  get status() {
    return f(this, pi) ? f(this, pi).status : this.cancelled ? "cancelled" : "running";
  }
  /** Abort the timeline, triggering onCancel callbacks. */
  cancel(e = "cancelled") {
    f(this, Zt).signal.aborted || f(this, Zt).abort(e);
  }
  /**
   * Called internally by the execution engine when the timeline finishes.
   * @param {boolean} completed - true if all steps ran, false if cancelled
   */
  _resolve(e) {
    if (f(this, nr)) return;
    S(this, nr, !0);
    const t = typeof e == "boolean" ? { status: e ? "completed" : "cancelled" } : e ?? { status: "cancelled" };
    S(this, pi, t), f(this, Xi).call(this, t.status === "completed"), f(this, Zi).call(this, t);
  }
};
Zt = new WeakMap(), Xi = new WeakMap(), Zi = new WeakMap(), er = new WeakMap(), tr = new WeakMap(), nr = new WeakMap(), pi = new WeakMap(), c(Tl, "TimelineHandle");
let Ps = Tl;
var Hn, yi, qn;
const Cl = class Cl {
  constructor() {
    /** @type {Map<string, Set<Function>>} */
    I(this, Hn, /* @__PURE__ */ new Map());
    /** @type {Set<string>} Signals that have been emitted (sticky) */
    I(this, yi, /* @__PURE__ */ new Set());
    I(this, qn, !1);
  }
  /**
   * Subscribe to a named signal.
   * @param {string} signal
   * @param {Function} listener
   * @returns {() => void} Unsubscribe function
   */
  on(e, t) {
    if (f(this, qn)) return () => {
    };
    let i = f(this, Hn).get(e);
    return i || (i = /* @__PURE__ */ new Set(), f(this, Hn).set(e, i)), i.add(t), () => i.delete(t);
  }
  /**
   * Fire a named signal synchronously. All registered listeners are invoked.
   * The signal is recorded so that future waitFor() calls resolve immediately.
   * @param {string} signal
   */
  emit(e) {
    if (f(this, qn)) return;
    f(this, yi).add(e);
    const t = f(this, Hn).get(e);
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
    return f(this, qn) ? Promise.reject(new Error("EventBus destroyed")) : f(this, yi).has(e) ? Promise.resolve() : new Promise((i, r) => {
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
    S(this, qn, !0), f(this, Hn).clear(), f(this, yi).clear();
  }
};
Hn = new WeakMap(), yi = new WeakMap(), qn = new WeakMap(), c(Cl, "EventBus");
let _s = Cl;
const Ju = /* @__PURE__ */ new Map();
function go(n, e) {
  Ju.set(n, e);
}
c(go, "registerAwaitProvider");
function cm(n, e) {
  const t = Ju.get(n.event);
  return t ? t(n, e) : Promise.reject(new Error(`Unknown await event type: "${n.event}"`));
}
c(cm, "createAwaitPromise");
go("signal", (n, e) => n.name ? e.eventBus.waitFor(n.name, e.signal) : Promise.reject(new Error('await signal: "name" is required')));
go("click", (n, e) => new Promise((t, i) => {
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
go("keypress", (n, e) => new Promise((t, i) => {
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
const ri = /* @__PURE__ */ new Map();
function um(n, e) {
  const t = ri.get(n);
  t && !t.cancelled && t.cancel("replaced-by-name"), ri.set(n, e), e.finished.then(() => {
    ri.get(n) === e && ri.delete(n);
  });
}
c(um, "registerTimeline");
function Ku(n) {
  const e = ri.get(n);
  return e && !e.cancelled ? (e.cancel("cancelled-by-name"), !0) : !1;
}
c(Ku, "cancelTimeline");
function dm(n) {
  return ri.get(n);
}
c(dm, "getTimeline");
function rc(n, e) {
  return n <= 0 ? Promise.resolve() : new Promise((t, i) => {
    if (e.aborted) return i(e.reason);
    const r = setTimeout(t, n);
    e.addEventListener("abort", () => {
      clearTimeout(r), i(e.reason);
    }, { once: !0 });
  });
}
c(rc, "cancellableDelay");
var Fe, en, ir, rr;
const Sl = class Sl {
  constructor(e) {
    /** @type {TweenTimeline} */
    I(this, Fe);
    /** @type {Array<{ type: string, params: object, opts?: object, detach: boolean }>} */
    I(this, en, []);
    /** @type {Function|null} */
    I(this, ir, null);
    /** @type {Function|null} */
    I(this, rr, null);
    S(this, Fe, e);
  }
  /**
   * Add a tween entry to this step.
   * @param {string} type  Registered tween type name
   * @param {object} params  Type-specific parameters
   * @param {object} [opts]  Options (durationMS, easing, etc.)
   * @returns {StepBuilder} this
   */
  add(e, t, i) {
    return f(this, en).push({ type: e, params: t, opts: i ?? {}, detach: !1 }), this;
  }
  /**
   * Mark the last entry as fire-and-forget (does not block step progression).
   * @returns {StepBuilder} this
   */
  detach() {
    if (f(this, en).length === 0)
      throw new Error("StepBuilder.detach(): no entry to detach.");
    return f(this, en)[f(this, en).length - 1].detach = !0, this;
  }
  /**
   * Callback invoked before this step's tweens start.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  before(e) {
    return S(this, ir, e), this;
  }
  /**
   * Callback invoked after this step's awaited tweens complete.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  after(e) {
    return S(this, rr, e), this;
  }
  // ── Delegation to parent TweenTimeline for fluent chaining ──
  /** Start a new step (finalizes this one). */
  step() {
    return f(this, Fe).step();
  }
  /** Insert a delay between steps. */
  delay(e) {
    return f(this, Fe).delay(e);
  }
  /** Insert an await segment. */
  await(e) {
    return f(this, Fe).await(e);
  }
  /** Insert an emit segment. */
  emit(e) {
    return f(this, Fe).emit(e);
  }
  /** Insert a parallel segment. */
  parallel(e, t) {
    return f(this, Fe).parallel(e, t);
  }
  /** Register onComplete callback. */
  onComplete(e) {
    return f(this, Fe).onComplete(e);
  }
  /** Register onCancel callback. */
  onCancel(e) {
    return f(this, Fe).onCancel(e);
  }
  /** Register onError callback. */
  onError(e) {
    return f(this, Fe).onError(e);
  }
  /** Execute the timeline. */
  run(e) {
    return f(this, Fe).run(e);
  }
  /** Serialize the timeline. */
  toJSON() {
    return f(this, Fe).toJSON();
  }
  // ── Internal access ──
  /** @returns {{ entries: Array, before: Function|null, after: Function|null }} */
  _finalize() {
    return {
      entries: f(this, en),
      before: f(this, ir),
      after: f(this, rr)
    };
  }
};
Fe = new WeakMap(), en = new WeakMap(), ir = new WeakMap(), rr = new WeakMap(), c(Sl, "StepBuilder");
let xs = Sl;
var Pe, Ce, gt, tn, ar, or, sr, lr, mn, Rs, j, Dt, Hs, Yu, qs, Qu, Xu, Wr, et, Tt;
const xt = class xt {
  constructor() {
    I(this, j);
    /** @type {string|null} */
    I(this, Pe, null);
    /** @type {string} */
    I(this, Ce, Ee.ABORT);
    /** @type {Array<object>} */
    I(this, gt, []);
    /** @type {StepBuilder|null} */
    I(this, tn, null);
    /** @type {Function|null} */
    I(this, ar, null);
    /** @type {Function|null} */
    I(this, or, null);
    /** @type {Function|null} */
    I(this, sr, null);
    /** @type {Function|null} */
    I(this, lr, null);
  }
  /**
   * Register this timeline in the named registry. Starting a new
   * timeline with the same name cancels the previous one.
   * @param {string} name
   * @returns {TweenTimeline} this
   */
  name(e) {
    return S(this, Pe, e), this;
  }
  /**
   * Set the error policy for step execution.
   * @param {"abort"|"continue"} policy
   * @returns {TweenTimeline} this
   */
  errorPolicy(e) {
    if (e !== Ee.ABORT && e !== Ee.CONTINUE)
      throw new Error(`Invalid error policy: "${e}". Use "abort" or "continue".`);
    return S(this, Ce, e), this;
  }
  /**
   * Start a new step. Finalizes the previous step if one is open.
   * @returns {StepBuilder}
   */
  step() {
    return C(this, j, Dt).call(this), S(this, tn, new xs(this)), f(this, tn);
  }
  /**
   * Insert a delay (in ms) between the previous step and the next.
   * @param {number} ms
   * @returns {TweenTimeline} this
   */
  delay(e) {
    return C(this, j, Dt).call(this), f(this, gt).push({ kind: "delay", ms: e }), this;
  }
  /**
   * Pause execution until an event occurs.
   * @param {object} config  e.g. { event: "click" }, { event: "signal", name: "fog-done" }
   * @returns {TweenTimeline} this
   */
  await(e) {
    return C(this, j, Dt).call(this), f(this, gt).push({ kind: "await", config: e }), this;
  }
  /**
   * Fire a named signal (instant, non-blocking).
   * @param {string} signal  Signal name
   * @returns {TweenTimeline} this
   */
  emit(e) {
    return C(this, j, Dt).call(this), f(this, gt).push({ kind: "emit", signal: e }), this;
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
    C(this, j, Dt).call(this);
    const i = t.join ?? "all", r = t.overflow ?? "detach";
    if (i !== "all" && i !== "any" && (typeof i != "number" || i < 1 || i > e.length))
      throw new Error(`parallel: join must be "all", "any", or 1..${e.length}, got ${JSON.stringify(i)}`);
    if (r !== "detach" && r !== "cancel")
      throw new Error(`parallel: overflow must be "detach" or "cancel", got ${JSON.stringify(r)}`);
    const a = e.map((o) => {
      var l;
      const s = new xt();
      return o(s), C(l = s, j, Dt).call(l), f(s, gt);
    });
    return f(this, gt).push({ kind: "parallel", branches: a, join: i, overflow: r }), this;
  }
  /**
   * Callback invoked before the first step runs.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  beforeAll(e) {
    return S(this, ar, e), this;
  }
  /**
   * Callback invoked on successful completion.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onComplete(e) {
    return S(this, or, e), this;
  }
  /**
   * Callback invoked on cancellation (mutually exclusive with onComplete).
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onCancel(e) {
    return S(this, sr, e), this;
  }
  /**
   * Callback invoked on runtime failure (mutually exclusive with onComplete/onCancel).
   * @param {(outcome: object) => void} fn
   * @returns {TweenTimeline} this
   */
  onError(e) {
    return S(this, lr, e), this;
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
    C(this, j, Dt).call(this);
    const t = new AbortController();
    e.signal && (e.signal.aborted ? t.abort(e.signal.reason ?? "parent-aborted") : e.signal.addEventListener("abort", () => {
      t.signal.aborted || t.abort(e.signal.reason ?? "parent-aborted");
    }, { once: !0 }));
    const i = new Ps(t);
    f(this, Pe) && um(f(this, Pe), i);
    const r = e.broadcast ?? game.user.isGM, a = e.commit ?? game.user.isGM, o = e.startEpochMS ?? Date.now();
    r && f(this, Pe) && Gr(Gu, {
      name: f(this, Pe),
      data: this.toJSON(),
      startEpochMS: o
    });
    const s = new _s(), l = {
      signal: i.signal,
      commit: a,
      startEpochMS: o,
      eventBus: s,
      errors: [],
      detachedPromises: []
    };
    return C(this, j, Yu).call(this, i, l).then((u) => {
      var d, g, m;
      s.destroy(), i._resolve(u), u.status === Jt.COMPLETED ? (d = f(this, or)) == null || d.call(this) : u.status === Jt.CANCELLED ? ((g = f(this, sr)) == null || g.call(this), r && f(this, Pe) && Gr($s, {
        name: f(this, Pe),
        reason: u.reason
      })) : ((m = f(this, lr)) == null || m.call(this, u), r && f(this, Pe) && Gr($s, {
        name: f(this, Pe),
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
    C(this, j, Dt).call(this);
    const t = { timeline: C(i = xt, mn, Rs).call(i, f(this, gt)) };
    return f(this, Pe) && (t.name = f(this, Pe)), f(this, Ce) !== Ee.ABORT && (t.errorPolicy = f(this, Ce)), t;
  }
};
Pe = new WeakMap(), Ce = new WeakMap(), gt = new WeakMap(), tn = new WeakMap(), ar = new WeakMap(), or = new WeakMap(), sr = new WeakMap(), lr = new WeakMap(), mn = new WeakSet(), Rs = /* @__PURE__ */ c(function(e) {
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
            return C(a = xt, mn, Rs).call(a, r);
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
}, "#serializeSegments"), j = new WeakSet(), // ── Private ─────────────────────────────────────────────────────────
Dt = /* @__PURE__ */ c(function() {
  f(this, tn) && (f(this, gt).push({ kind: "step", data: f(this, tn)._finalize() }), S(this, tn, null));
}, "#finalizeCurrentStep"), Hs = /* @__PURE__ */ c(function(e) {
  e.length !== 0 && Promise.allSettled(e).catch(() => {
  });
}, "#drainDetached"), Yu = /* @__PURE__ */ c(async function(e, t) {
  var i, r;
  try {
    if (t.signal.aborted) return C(this, j, et).call(this, t.signal.reason);
    const a = await C(this, j, Wr).call(this, f(this, ar), lt.BEFORE_ALL, null);
    if (a) {
      if (f(this, Ce) === Ee.ABORT) return a;
      t.errors.push(a);
    }
    const o = await C(this, j, qs).call(this, f(this, gt), t);
    if (o)
      return C(i = xt, mn, Hs).call(i, t.detachedPromises), o;
    if (!t.signal.aborted) {
      const s = await Promise.allSettled(t.detachedPromises);
      for (const l of s)
        if (l.status === "rejected") {
          const u = C(this, j, Tt).call(this, l.reason, lt.ENTRY);
          if (f(this, Ce) === Ee.ABORT) return u;
          t.errors.push(u);
        }
    }
    return t.signal.aborted ? C(this, j, et).call(this, t.signal.reason) : {
      status: Jt.COMPLETED,
      ...t.errors.length > 0 ? { errors: t.errors } : {}
    };
  } catch (a) {
    return C(r = xt, mn, Hs).call(r, t.detachedPromises), t.signal.aborted ? C(this, j, et).call(this, t.signal.reason) : (console.error("TweenTimeline execution error:", a), C(this, j, Tt).call(this, a, lt.RUNTIME));
  }
}, "#execute"), qs = /* @__PURE__ */ c(async function(e, t) {
  let i = -1, r = 0;
  for (const a of e) {
    if (t.signal.aborted) return C(this, j, et).call(this, t.signal.reason);
    if (a.kind === "delay") {
      try {
        await rc(a.ms, t.signal);
      } catch {
        return C(this, j, et).call(this, t.signal.reason);
      }
      r += a.ms;
      continue;
    }
    if (a.kind === "await") {
      try {
        let p = cm(a.config, {
          signal: t.signal,
          eventBus: t.eventBus
        });
        const h = a.config.timeout;
        typeof h == "number" && h > 0 && (p = Promise.race([
          p,
          rc(h, t.signal)
        ])), await p;
      } catch (p) {
        if (t.signal.aborted) return C(this, j, et).call(this, t.signal.reason);
        const h = C(this, j, Tt).call(this, p, lt.AWAIT);
        if (f(this, Ce) === Ee.ABORT) return h;
        t.errors.push(h);
      }
      continue;
    }
    if (a.kind === "emit") {
      try {
        t.eventBus.emit(a.signal);
      } catch (p) {
        const h = C(this, j, Tt).call(this, p, lt.EMIT);
        if (f(this, Ce) === Ee.ABORT) return h;
        t.errors.push(h);
      }
      continue;
    }
    if (a.kind === "parallel") {
      const p = await C(this, j, Qu).call(this, a, t);
      if (p) return p;
      continue;
    }
    i += 1;
    const { entries: o, before: s, after: l } = a.data, u = await C(this, j, Wr).call(this, s, lt.BEFORE_STEP, i);
    if (u) {
      if (f(this, Ce) === Ee.ABORT) return u;
      t.errors.push(u);
      continue;
    }
    if (t.signal.aborted) return C(this, j, et).call(this, t.signal.reason);
    const d = [];
    let g = 0;
    for (const p of o) {
      const h = br(p.type);
      if (!h) {
        const L = C(this, j, Tt).call(this, new Error(`TweenTimeline: unknown tween type "${p.type}"`), lt.ENTRY, i, p.type);
        if (f(this, Ce) === Ee.ABORT) return L;
        t.errors.push(L), console.warn(L.error.message);
        continue;
      }
      const b = {
        ...p.opts,
        commit: t.commit,
        startEpochMS: t.startEpochMS + r,
        signal: t.signal
      }, w = b.durationMS ?? 2e3, E = Promise.resolve().then(() => h.execute(p.params, b)).then((L) => L === !1 ? {
        ok: !1,
        failure: C(this, j, Tt).call(this, new Error("Tween entry returned false."), lt.ENTRY, i, p.type)
      } : { ok: !0 }).catch((L) => ({
        ok: !1,
        failure: C(this, j, Tt).call(this, L, lt.ENTRY, i, p.type)
      }));
      p.detach ? t.detachedPromises.push(E) : (d.push(E), g = Math.max(g, w));
    }
    const m = await C(this, j, Xu).call(this, d, t.signal);
    if (m === null) return C(this, j, et).call(this, t.signal.reason);
    for (const p of m)
      if (!p.ok) {
        if (f(this, Ce) === Ee.ABORT) return p.failure;
        t.errors.push(p.failure), console.warn("TweenTimeline: entry failed:", p.failure.error);
      }
    const y = await C(this, j, Wr).call(this, l, lt.AFTER_STEP, i);
    if (y) {
      if (f(this, Ce) === Ee.ABORT) return y;
      t.errors.push(y);
    }
    if (t.signal.aborted) return C(this, j, et).call(this, t.signal.reason);
    r += g;
  }
  return null;
}, "#executeSegments"), Qu = /* @__PURE__ */ c(async function(e, t) {
  const { branches: i, join: r, overflow: a } = e, o = i.length, s = r === "all" ? o : r === "any" ? 1 : r, l = i.map(() => {
    const y = new AbortController();
    return t.signal.aborted ? y.abort(t.signal.reason ?? "parent-aborted") : t.signal.addEventListener("abort", () => {
      y.signal.aborted || y.abort(t.signal.reason ?? "parent-aborted");
    }, { once: !0 }), y;
  });
  let u = 0, d = 0;
  const g = new Array(o).fill(null);
  let m;
  return new Promise((y) => {
    let p = !1;
    const h = /* @__PURE__ */ c(() => {
      if (p) return;
      if (u >= s) {
        p = !0, b(), y(null);
        return;
      }
      const w = o - u - d;
      if (u + w < s) {
        p = !0, b();
        const E = g.filter((O) => O && O.status === Jt.FAILED).map((O) => O), L = C(this, j, Tt).call(this, new Error(`parallel: join target ${s} impossible (${u} completed, ${d} failed)`), lt.PARALLEL);
        f(this, Ce) === Ee.ABORT ? y(L) : (t.errors.push(L), t.errors.push(...E), y(null));
      }
    }, "checkJoin"), b = /* @__PURE__ */ c(() => {
      if (a === "cancel")
        for (let w = 0; w < o; w++)
          !g[w] && !l[w].signal.aborted && l[w].abort("overflow-cancel");
      for (let w = 0; w < o; w++)
        g[w] || t.detachedPromises.push(m[w]);
    }, "applyOverflow");
    if (m = i.map((w, E) => {
      const L = {
        signal: l[E].signal,
        commit: t.commit,
        startEpochMS: t.startEpochMS,
        eventBus: t.eventBus,
        // shared
        errors: t.errors,
        // shared
        detachedPromises: t.detachedPromises
        // shared
      };
      return C(this, j, qs).call(this, w, L).then((O) => {
        if (O)
          if (O.status === Jt.CANCELLED) {
            if (l[E].signal.aborted) {
              g[E] = O;
              return;
            }
            g[E] = O, d++;
          } else
            g[E] = O, d++;
        else
          g[E] = { status: Jt.COMPLETED }, u++;
        h();
      });
    }), t.signal.aborted) {
      p = !0, y(C(this, j, et).call(this, t.signal.reason));
      return;
    }
    t.signal.addEventListener("abort", () => {
      p || (p = !0, y(C(this, j, et).call(this, t.signal.reason)));
    }, { once: !0 });
  });
}, "#executeParallel"), /**
 * @param {Array<Promise<{ok: boolean, failure?: object}>>} stepPromises
 * @param {AbortSignal} signal
 * @returns {Promise<Array<{ok: boolean, failure?: object}>|null>}
 */
Xu = /* @__PURE__ */ c(function(e, t) {
  return e.length === 0 ? Promise.resolve([]) : t.aborted ? Promise.resolve(null) : new Promise((i, r) => {
    const a = /* @__PURE__ */ c(() => i(null), "onAbort");
    t.addEventListener("abort", a, { once: !0 }), Promise.all(e).then((o) => {
      t.removeEventListener("abort", a), i(o);
    }).catch((o) => {
      t.removeEventListener("abort", a), r(o);
    });
  });
}, "#waitForStep"), Wr = /* @__PURE__ */ c(async function(e, t, i) {
  if (!e) return null;
  try {
    return await e(), null;
  } catch (r) {
    const a = C(this, j, Tt).call(this, r, t, i ?? void 0);
    return f(this, Ce) === Ee.CONTINUE && console.warn(`TweenTimeline: hook failure in ${t}:`, r), a;
  }
}, "#runHook"), /** @param {unknown} reason */
et = /* @__PURE__ */ c(function(e) {
  let t;
  return typeof e == "string" ? t = e : e instanceof Error && (t = e.message), {
    status: Jt.CANCELLED,
    ...t ? { reason: t } : {}
  };
}, "#cancelledOutcome"), /**
 * @param {unknown} err
 * @param {string} phase
 * @param {number} [stepIndex]
 * @param {string} [entryType]
 */
Tt = /* @__PURE__ */ c(function(e, t, i, r) {
  const a = e instanceof Error ? e : new Error(String(e));
  return {
    status: Jt.FAILED,
    error: a,
    phase: t,
    ...typeof i == "number" ? { stepIndex: i } : {},
    ...r ? { entryType: r } : {}
  };
}, "#failedOutcome"), I(xt, mn), c(xt, "TweenTimeline");
let ma = xt;
function pl(n) {
  if (!n || typeof n != "object")
    throw new Error("Sequence JSON: data must be an object.");
  if (!Array.isArray(n.timeline))
    throw new Error("Sequence JSON: 'timeline' must be an array.");
  if (n.name != null && typeof n.name != "string")
    throw new Error("Sequence JSON: 'name' must be a string.");
  if (n.errorPolicy != null && n.errorPolicy !== Ee.ABORT && n.errorPolicy !== Ee.CONTINUE)
    throw new Error(`Sequence JSON: 'errorPolicy' must be "abort" or "continue".`);
  Zu(n.timeline, "timeline", 0);
}
c(pl, "validateSequenceJSON");
function Zu(n, e, t = 0) {
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
        Zu(d, `${a}.parallel.branches[${u}]`, t + 1);
      }
      continue;
    }
    throw new Error(`Sequence JSON: ${a} is not a recognized segment (step array, delay, await, emit, or parallel).`);
  }
}
c(Zu, "validateSegmentsJSON");
function ed(n) {
  pl(n), td(n.timeline, "timeline");
}
c(ed, "validateSequenceSemantics");
function td(n, e) {
  for (let t = 0; t < n.length; t++) {
    const i = n[t], r = `${e}[${t}]`;
    if (Array.isArray(i))
      for (let a = 0; a < i.length; a++) {
        const o = i[a];
        try {
          Gg(o.type, o.params ?? {});
        } catch (s) {
          throw new Error(`Sequence JSON: ${r}[${a}] failed semantic validation: ${s.message}`);
        }
      }
    else if (i.parallel)
      for (let a = 0; a < i.parallel.branches.length; a++)
        td(i.parallel.branches[a], `${r}.parallel.branches[${a}]`);
  }
}
c(td, "validateSegmentsSemantics");
function yl(n, e = {}) {
  pl(n), e.validateSemantics && ed(n);
  const t = new ma();
  return n.name && t.name(n.name), n.errorPolicy && t.errorPolicy(n.errorPolicy), nd(n.timeline, t), t;
}
c(yl, "compileSequence");
function nd(n, e) {
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
      const i = t.parallel, r = i.branches.map((a) => (o) => nd(a, o));
      e.parallel(r, {
        join: i.join ?? "all",
        overflow: i.overflow ?? "detach"
      });
    }
  }
}
c(nd, "compileSegments");
function fm(n) {
  pl(n), ed(n);
}
c(fm, "validate$1");
async function hm(n, e = {}) {
  return yl(n, { validateSemantics: !0 }).run({
    broadcast: !1,
    commit: e.commit,
    startEpochMS: e.startEpochMS,
    signal: e.signal
  }).finished;
}
c(hm, "execute$1");
function gm() {
  Ut({ type: "sequence", execute: hm, validate: fm });
}
c(gm, "registerSequenceTween");
function mm(n) {
  if (n.x == null && n.y == null && n.scale == null)
    throw new Error("camera-pan tween: at least one of 'x', 'y', or 'scale' is required.");
  if (n.x != null && typeof n.x != "number")
    throw new Error("camera-pan tween: 'x' must be a number.");
  if (n.y != null && typeof n.y != "number")
    throw new Error("camera-pan tween: 'y' must be a number.");
  if (n.scale != null && (typeof n.scale != "number" || n.scale <= 0))
    throw new Error("camera-pan tween: 'scale' must be a positive number.");
}
c(mm, "validate");
async function pm(n, e = {}) {
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
c(pm, "execute");
function ym() {
  Ut({ type: "camera-pan", execute: pm, validate: mm });
}
c(ym, "registerCameraPanTween");
async function bm(n, e, t = {}) {
  if (!game.user.isGM)
    return ui.notifications.warn("Only the GM can dispatch tweens."), !1;
  const i = br(n);
  if (!i)
    throw new Error(`Unknown tween type: "${n}". Registered types: ${Ds().join(", ")}`);
  i.validate(e);
  const { durationMS: r = 2e3, easing: a = "easeInOutCosine", commit: o = !0 } = t, s = Date.now();
  return Gr(zu, {
    type: n,
    params: e,
    durationMS: r,
    easing: a,
    startEpochMS: s,
    commit: !1
  }), i.execute(e, { durationMS: r, easing: a, commit: o, startEpochMS: s });
}
c(bm, "dispatchTween");
function wm(n) {
  const { type: e, params: t, durationMS: i, easing: r, startEpochMS: a, commit: o } = n ?? {}, s = br(e);
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
c(wm, "handleTweenSocketMessage");
tm();
rm();
am();
lm();
gm();
ym();
Ut({ type: "token-prop", execute: ho, validate: fo });
Ut({ type: "drawing-prop", execute: ho, validate: fo });
Ut({ type: "sound-prop", execute: ho, validate: fo });
ml(zu, wm);
ml(Gu, vm);
ml($s, Em);
function vm(n) {
  const { data: e, startEpochMS: t } = n ?? {};
  if (!e) {
    console.warn(`[${T}] Received empty tween-sequence socket message.`);
    return;
  }
  try {
    yl(e, { validateSemantics: !0 }).run({ commit: !1, startEpochMS: t, broadcast: !1 });
  } catch (i) {
    console.error(`[${T}] Failed to run received tween sequence:`, i);
  }
}
c(vm, "handleSequenceSocketMessage");
function Em(n) {
  const { name: e } = n ?? {};
  e && Ku(e);
}
c(Em, "handleSequenceCancelMessage");
function Tm() {
  Hooks.once("ready", () => {
    zg();
    const n = game.modules.get(T);
    n.api || (n.api = {}), n.api.tween = {
      dispatch: bm,
      types: Ds,
      Timeline: ma,
      ErrorPolicy: Ee,
      compileSequence: yl,
      cancelTimeline: Ku,
      getTimeline: dm
    }, console.log(`[${T}] Tween API registered. Types: ${Ds().join(", ")}`);
  });
}
c(Tm, "registerTweenHooks");
Tm();
const Cm = ["tag", "tag-all", "id", "tags-any", "tags-all"], Sm = /* @__PURE__ */ new Set(["tags-any", "tags-all"]);
function bl(n) {
  if (!n || typeof n != "string")
    return { type: "unknown", value: n ?? "" };
  if (n.startsWith("$"))
    return { type: "special", value: n };
  for (const e of Cm)
    if (n.startsWith(`${e}:`)) {
      const t = n.slice(e.length + 1), i = Sm.has(e) ? t.split(",").map((r) => r.trim()) : t;
      return { type: e, value: i };
    }
  return n.includes(".") ? { type: "uuid", value: n } : { type: "unknown", value: n };
}
c(bl, "parseSelector");
function Lm(n) {
  if (!n) return "";
  const { type: e, value: t } = n;
  if (e === "special" || e === "uuid" || e === "unknown")
    return Array.isArray(t) ? t.join(",") : t ?? "";
  const i = Array.isArray(t) ? t.join(",") : t ?? "";
  return `${e}:${i}`;
}
c(Lm, "buildSelector");
function id(n, e = "first") {
  return n != null && n.length ? n.length === 1 ? e === "first-all" || e === "all" ? `tag-all:${n[0]}` : `tag:${n[0]}` : e === "any" ? `tags-any:${n.join(",")}` : e === "all" ? `tags-all:${n.join(",")}` : e === "first-all" ? `tags-all:${n.join(",")}` : `tags-any:${n.join(",")}` : "";
}
c(id, "buildTagSelector");
function mo(n) {
  if (!n) return null;
  if (n.documentName || n._source !== void 0) {
    const e = n.object;
    return e ? { placeable: e, doc: n } : null;
  }
  return n.document ? { placeable: n, doc: n.document } : null;
}
c(mo, "normalizePlaceable");
function rd() {
  var n;
  return window.Tagger ?? ((n = game.modules.get("tagger")) == null ? void 0 : n.api) ?? null;
}
c(rd, "getTaggerAPI");
function po(n, e) {
  if (!n) return null;
  const t = e ?? canvas.scene;
  if (!t) return null;
  const i = bl(n);
  switch (i.type) {
    case "special":
      return Im(i.value);
    case "tag":
      return ac(i.value, t, !1);
    case "tag-all":
      return ac(i.value, t, !0);
    case "id":
      return Om(i.value, t);
    case "tags-any":
      return oc(i.value, t, !0);
    case "tags-all":
      return oc(i.value, t, !1);
    case "uuid":
      return Am(i.value);
    default:
      return null;
  }
}
c(po, "resolveSelector");
function Im(n) {
  var e;
  if (n === "$particles") {
    if (!((e = game.modules.get("fxmaster")) != null && e.active))
      return console.warn(`[${T}] Picker: FXMaster not active, cannot resolve "$particles".`), null;
    const t = canvas.particleeffects;
    return t ? { kind: "particles", documents: [], placeables: [], target: t } : null;
  }
  return null;
}
c(Im, "resolveSpecial");
function ac(n, e, t) {
  const i = rd();
  if (!i)
    return console.warn(`[${T}] Picker: Tagger not available, cannot resolve tag "${n}".`), null;
  const r = i.getByTag(n, { sceneId: e.id });
  if (!(r != null && r.length)) return null;
  const a = t ? r : [r[0]], o = [];
  for (const s of a) {
    const l = mo(s);
    l && o.push(l);
  }
  return o.length === 0 ? null : {
    kind: t ? "multi-placeable" : "placeable",
    documents: o.map((s) => s.doc),
    placeables: o
  };
}
c(ac, "resolveTag");
function Om(n, e) {
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
      const a = mo(r);
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
c(Om, "resolveById");
function oc(n, e, t) {
  const i = rd();
  if (!i)
    return console.warn(`[${T}] Picker: Tagger not available, cannot resolve multi-tag.`), null;
  const r = i.getByTag(n, {
    sceneId: e.id,
    matchAny: t
  });
  if (!(r != null && r.length)) return null;
  const a = [];
  for (const o of r) {
    const s = mo(o);
    s && a.push(s);
  }
  return a.length === 0 ? null : {
    kind: a.length === 1 ? "placeable" : "multi-placeable",
    documents: a.map((o) => o.doc),
    placeables: a
  };
}
c(oc, "resolveMultiTag");
function Am(n) {
  const e = fromUuidSync(n);
  if (!e) return null;
  const t = mo(e);
  return t ? {
    kind: "placeable",
    documents: [t.doc],
    placeables: [t]
  } : null;
}
c(Am, "resolveUUID");
function Mm(n) {
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
c(Mm, "adaptResolved");
function pa(n) {
  const e = /* @__PURE__ */ new Set();
  if (n.setup)
    for (const r of Object.keys(n.setup)) e.add(r);
  if (n.landing)
    for (const r of Object.keys(n.landing)) e.add(r);
  n.timeline && od(n.timeline, e);
  const t = /* @__PURE__ */ new Map(), i = [];
  for (const r of e) {
    const a = po(r), o = Mm(a);
    o ? t.set(r, o) : i.push(r);
  }
  return i.length && console.warn(`[${T}] Cinematic: ${i.length} unresolved target(s): ${i.join(", ")}`), { targets: t, unresolved: i };
}
c(pa, "resolveAllTargets");
function Nm(n, e) {
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
c(Nm, "captureSnapshot");
function km(n) {
  const e = {};
  function t(i) {
    if (i)
      for (const [r, a] of Object.entries(i))
        e[r] || (e[r] = {}), Object.assign(e[r], a);
  }
  return c(t, "mergeMap"), t(n.setup), t(n.landing), n.timeline && ad(n.timeline, e, t), e;
}
c(km, "gatherAllStateMaps");
function ad(n, e, t) {
  var i;
  for (const r of n)
    if (!(r.delay != null || r.await != null || r.emit != null) && !(r.transitionTo != null || r.sound != null || r.stopSound != null)) {
      if ((i = r.parallel) != null && i.branches) {
        for (const a of r.parallel.branches)
          ad(a, e, t);
        continue;
      }
      if (t(r.before), t(r.after), r.tweens)
        for (const a of r.tweens)
          a.target && a.attribute && (e[a.target] || (e[a.target] = {}), e[a.target][a.attribute] = "__snapshot__");
    }
}
c(ad, "gatherFromEntries");
function od(n, e) {
  for (const t of n)
    if (t.delay == null && t.await == null && t.emit == null && t.transitionTo == null && t.sound == null && t.stopSound == null) {
      if (t.parallel) {
        const i = t.parallel;
        if (i.branches)
          for (const r of i.branches)
            od(r, e);
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
c(od, "collectSelectorsFromEntries");
const sc = {
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
}, $m = /* @__PURE__ */ new Set([
  "alpha",
  "visible",
  "x",
  "y",
  "scale",
  "rotation"
]);
function Po(n, e, t) {
  const i = {};
  for (const [r, a] of Object.entries(n))
    e.has(r) ? i[r] = a : console.warn(`[${T}] Cinematic: blocked property "${r}" on ${t}.`);
  return i;
}
c(Po, "filterOverrides");
function Je(n, e) {
  var i, r;
  if (!n) return;
  const t = [];
  for (const [a, o] of Object.entries(n)) {
    const s = e.get(a);
    if (s)
      if (s.kind === "particles") {
        if (s.target.destroyed) continue;
        const l = Po(o, $m, "$particles");
        for (const [u, d] of Object.entries(l))
          s.target[u] = d;
      } else if (s.kind === "multi-placeable")
        for (const { placeable: l, doc: u } of s.placeables) {
          if (!(u != null && u.parent) || !(l != null && l.scene)) continue;
          const d = u.documentName, g = sc[d];
          if (!g) {
            console.warn(`[${T}] Cinematic: no allowlist for document type "${d}" on "${a}", skipping.`);
            continue;
          }
          const m = Po(o, g, `${d} "${a}"`);
          u.updateSource(m), t.push(l);
        }
      else {
        if (!((i = s.doc) != null && i.parent) || !((r = s.placeable) != null && r.scene)) continue;
        const l = s.doc.documentName, u = sc[l];
        if (!u) {
          console.warn(`[${T}] Cinematic: no allowlist for document type "${l}" on "${a}", skipping.`);
          continue;
        }
        const d = Po(o, u, `${l} "${a}"`);
        s.doc.updateSource(d), t.push(s.placeable);
      }
  }
  for (const a of t)
    a.refresh();
}
c(Je, "applyState");
function ai(n, e) {
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
c(ai, "refreshPerceptionIfNeeded");
const Dm = {
  "tile-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "light-color": /* @__PURE__ */ new Set(["uuid", "toColor", "toAlpha", "mode"]),
  "light-state": /* @__PURE__ */ new Set(["uuid", "enabled"]),
  "particles-prop": /* @__PURE__ */ new Set(["attribute", "value"]),
  "camera-pan": /* @__PURE__ */ new Set(["x", "y", "scale"]),
  "token-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "drawing-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "sound-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"])
}, Fm = /* @__PURE__ */ new Set(["duration", "easing", "detach"]), Pm = /* @__PURE__ */ new Set(["type", "target"]);
function sd(n, e) {
  const { type: t, target: i, detach: r = !1, ...a } = n;
  if (!t)
    return console.warn(`[${T}] Cinematic: tween entry missing 'type', skipping.`), null;
  const o = {}, s = {}, l = Dm[t];
  if (i === "$particles")
    o.target = "$particles";
  else if (i) {
    const u = e.get(i);
    if (!u) return null;
    u.kind === "multi-placeable" ? o.uuid = u.placeables.map((d) => d.doc.uuid) : o.uuid = u.doc.uuid;
  }
  for (const [u, d] of Object.entries(a))
    Pm.has(u) || (u === "duration" ? s.durationMS = d : Fm.has(u) ? s[u] = d : (l != null && l.has(u), o[u] = d));
  return { type: t, params: o, opts: s, detach: r };
}
c(sd, "compileTween");
const Gi = /* @__PURE__ */ new Map();
let _m = 0;
async function xm(n) {
  var u, d, g, m, y;
  const { id: e, src: t, volume: i = 0.8, loop: r = !1, fadeIn: a } = n;
  if (!t) {
    console.warn(`[${T}] Cinematic sound: missing 'src', skipping.`);
    return;
  }
  const o = e || `__auto_${++_m}`, s = {
    src: t,
    autoplay: !0,
    loop: r,
    volume: i
  };
  let l = null;
  try {
    typeof ((d = (u = foundry == null ? void 0 : foundry.audio) == null ? void 0 : u.AudioHelper) == null ? void 0 : d.play) == "function" ? l = await foundry.audio.AudioHelper.play(s, !1) : typeof ((m = (g = game == null ? void 0 : game.audio) == null ? void 0 : g.constructor) == null ? void 0 : m.play) == "function" ? l = await game.audio.constructor.play(s, !1) : typeof ((y = game == null ? void 0 : game.audio) == null ? void 0 : y.play) == "function" && (l = await game.audio.play(s, !1));
  } catch (p) {
    console.error(`[${T}] Cinematic sound: failed to play "${t}":`, p);
    return;
  }
  if (!l) {
    console.warn(`[${T}] Cinematic sound: audio helper unavailable for "${t}".`);
    return;
  }
  a && a > 0 && l.fade && l.fade(i, { duration: a, from: 0 }), Gi.set(o, { sound: l, config: n }), console.log(`[${T}] Cinematic sound: playing "${t}" as "${o}" (loop=${r}, vol=${i})`);
}
c(xm, "playLocalSound");
function _o(n) {
  var i, r;
  const e = Gi.get(n);
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
  Gi.delete(n);
}
c(_o, "stopCinematicSound");
function xo() {
  var n, e;
  for (const [t, i] of Gi)
    try {
      (e = (n = i.sound).stop) == null || e.call(n);
    } catch (r) {
      console.warn(`[${T}] Cinematic sound: error stopping "${t}" during cleanup:`, r);
    }
  Gi.clear();
}
c(xo, "stopAllCinematicSounds");
function Rm(n, e, t, i = {}) {
  const { skipToStep: r, onStepComplete: a, timelineName: o } = i, s = new t().name(o ?? `cinematic-${canvas.scene.id}`);
  s.beforeAll(() => {
    var u;
    try {
      Je(n.setup, e), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    } catch (d) {
      throw console.error(`[${T}] Cinematic: error in beforeAll (setup state) on scene ${(u = canvas.scene) == null ? void 0 : u.id}:`, d), d;
    }
  });
  const l = { transitionTo: null };
  return cd(n.timeline, s, e, { skipToStep: r, onStepComplete: a, meta: l }), { tl: s, transitionTo: l.transitionTo };
}
c(Rm, "buildTimeline");
function ld(n, e) {
  var t;
  if (n)
    for (const i of n)
      for (const r of i) {
        if (r.before)
          try {
            Je(r.before, e), ai(r.before, e);
          } catch (a) {
            console.warn(`[${T}] Cinematic: error in skipped parallel before:`, a);
          }
        if (r.after)
          try {
            Je(r.after, e), ai(r.after, e);
          } catch (a) {
            console.warn(`[${T}] Cinematic: error in skipped parallel after:`, a);
          }
        (t = r.parallel) != null && t.branches && ld(r.parallel.branches, e);
      }
}
c(ld, "applyParallelStatesForSkip");
function cd(n, e, t, i = {}) {
  const { skipToStep: r, onStepComplete: a, meta: o } = i;
  let s = -1;
  for (const l of n) {
    if (l.transitionTo != null) {
      if (r != null && s < r) continue;
      o && (o.transitionTo = l.transitionTo), e.step();
      break;
    }
    if (l.sound != null) {
      if (r != null && s < r) continue;
      const g = l.sound, { duration: m, loop: y, fireAndForget: p } = g, h = e.step();
      if (h.before(() => {
        xm(g);
      }), m && m > 0)
        if (p) {
          if (y && g.id) {
            const b = g.id, w = m;
            h.before(() => {
              setTimeout(() => _o(b), w);
            });
          }
        } else
          e.delay(m), y && e.step().before(() => {
            _o(g.id);
          });
      continue;
    }
    if (l.stopSound != null) {
      if (r != null && s < r) continue;
      const g = l.stopSound;
      e.step().before(() => {
        _o(g);
      });
      continue;
    }
    if (l.delay != null) {
      if (r != null && s < r) continue;
      e.delay(l.delay);
      continue;
    }
    if (l.await != null) {
      if (r != null && s < r) continue;
      e.await(l.await);
      continue;
    }
    if (l.emit != null) {
      if (r != null && s < r) continue;
      e.emit(l.emit);
      continue;
    }
    if (l.parallel) {
      if (r != null && s < r) {
        ld(l.parallel.branches, t);
        continue;
      }
      const g = l.parallel, m = g.branches.map((y) => (p) => cd(y, p, t));
      e.parallel(m, {
        join: g.join ?? "all",
        overflow: g.overflow ?? "detach"
      });
      continue;
    }
    if (!l.tweens || !Array.isArray(l.tweens)) {
      console.warn(`[${T}] Cinematic: timeline entry has no tweens array, skipping.`);
      continue;
    }
    if (s++, r != null && s < r) {
      if (l.before)
        try {
          Je(l.before, t), ai(l.before, t);
        } catch (g) {
          console.warn(`[${T}] Cinematic: error applying skipped step.before:`, g);
        }
      if (l.after)
        try {
          Je(l.after, t), ai(l.after, t);
        } catch (g) {
          console.warn(`[${T}] Cinematic: error applying skipped step.after:`, g);
        }
      continue;
    }
    const u = s, d = e.step();
    l.before && d.before(() => {
      var g;
      try {
        Je(l.before, t), ai(l.before, t);
      } catch (m) {
        throw console.error(`[${T}] Cinematic: error in step.before callback on scene ${(g = canvas.scene) == null ? void 0 : g.id}:`, m), m;
      }
    });
    for (const g of l.tweens) {
      const m = sd(g, t);
      m && (d.add(m.type, m.params, m.opts), m.detach && d.detach());
    }
    d.after(() => {
      var g;
      try {
        l.after && (Je(l.after, t), ai(l.after, t)), a == null || a(u);
      } catch (m) {
        throw console.error(`[${T}] Cinematic: error in step.after callback on scene ${(g = canvas.scene) == null ? void 0 : g.id}:`, m), m;
      }
    });
  }
}
c(cd, "compileCinematicEntries");
function ya(n, e, t) {
  if (n != null) {
    if (typeof n != "object" || Array.isArray(n)) {
      t.push({ path: e, level: "error", message: `Expected object, got ${Array.isArray(n) ? "array" : typeof n}` });
      return;
    }
    for (const [i, r] of Object.entries(n))
      (typeof r != "object" || r === null || Array.isArray(r)) && t.push({ path: `${e}["${i}"]`, level: "error", message: `Expected property overrides object, got ${Array.isArray(r) ? "array" : typeof r}` });
  }
}
c(ya, "validateStateMap");
function ud(n, e, t, i) {
  var r;
  for (let a = 0; a < n.length; a++) {
    const o = n[a], s = `${e}[${a}]`;
    if (!(o.delay != null || o.await != null || o.emit != null) && !(o.transitionTo != null || o.sound != null || o.stopSound != null)) {
      if ((r = o.parallel) != null && r.branches) {
        for (let l = 0; l < o.parallel.branches.length; l++)
          ud(o.parallel.branches[l], `${s}.parallel.branches[${l}]`, t, i);
        continue;
      }
      if (ya(o.before, `${s}.before`, i), ya(o.after, `${s}.after`, i), o.tweens)
        for (let l = 0; l < o.tweens.length; l++) {
          const u = o.tweens[l], d = `${s}.tweens[${l}]`;
          if (!u.type) {
            i.push({ path: d, level: "error", message: "Missing 'type' field" });
            continue;
          }
          const g = br(u.type);
          if (!g) {
            i.push({ path: d, level: "error", message: `Unknown tween type: "${u.type}"` });
            continue;
          }
          if (t)
            try {
              const m = sd(u, t);
              m ? g.validate(m.params) : u.target && i.push({ path: d, level: "warn", message: `Target "${u.target}" could not be resolved for compilation` });
            } catch (m) {
              i.push({ path: d, level: "error", message: m.message });
            }
          t && u.target && !t.has(u.target) && i.push({ path: `${d}.target`, level: "warn", message: `Target "${u.target}" is not resolved` });
        }
    }
  }
}
c(ud, "validateEntries");
function Hm(n, e = null) {
  const t = [];
  return !n || typeof n != "object" ? (t.push({ path: "", level: "error", message: "Cinematic data is not an object" }), t) : (ya(n.setup, "setup", t), ya(n.landing, "landing", t), n.timeline && Array.isArray(n.timeline) && ud(n.timeline, "timeline", e, t), t);
}
c(Hm, "validateCinematicDeep");
const Ro = 3;
var he, rt, mt, Xa, dd, H, ue, be, Ct;
const ke = class ke {
  constructor(e = null, { loadedHash: t = null, cinematicName: i = "default" } = {}) {
    I(this, H);
    I(this, he);
    I(this, rt);
    I(this, mt);
    S(this, he, e ?? ke.empty()), S(this, rt, i), S(this, mt, t);
  }
  static empty() {
    return {
      version: Ro,
      cinematics: {
        default: ke.emptyCinematic()
      }
    };
  }
  static emptyCinematic() {
    return { trigger: "canvasReady", tracking: !0, setup: {}, landing: {}, timeline: [] };
  }
  static fromScene(e, t = "default") {
    var o;
    const i = e == null ? void 0 : e.getFlag(T, "cinematic");
    let r = i ? foundry.utils.deepClone(i) : null;
    const a = i ? C(o = ke, Xa, dd).call(o, i) : null;
    if (r && (r.version ?? 1) < 3) {
      const { version: s, ...l } = r;
      r = { version: Ro, cinematics: { default: l } };
    }
    return new ke(r, { loadedHash: a, cinematicName: t });
  }
  /**
   * Check if the scene's cinematic flag has been modified since this state was loaded.
   * @param {object} scene  The Foundry scene document
   * @returns {boolean} true if scene data differs from what was loaded
   */
  isStale(e) {
    if (!f(this, mt)) return !1;
    const t = e == null ? void 0 : e.getFlag(T, "cinematic");
    return t ? !foundry.utils.objectsEqual(t, f(this, mt)) : !1;
  }
  // ── Read ──────────────────────────────────────────────────────────────
  get data() {
    return f(this, he);
  }
  get timeline() {
    return f(this, H, ue).timeline;
  }
  get trigger() {
    return f(this, H, ue).trigger;
  }
  get tracking() {
    return f(this, H, ue).tracking;
  }
  get setup() {
    return f(this, H, ue).setup;
  }
  get landing() {
    return f(this, H, ue).landing;
  }
  get isEmpty() {
    var e;
    return !((e = f(this, H, ue).timeline) != null && e.length);
  }
  get synchronized() {
    return f(this, H, ue).synchronized ?? !1;
  }
  get activeCinematicName() {
    return f(this, rt);
  }
  // ── Multi-cinematic management ────────────────────────────────────────
  listCinematicNames() {
    return Object.keys(f(this, he).cinematics);
  }
  switchCinematic(e) {
    return f(this, he).cinematics[e] ? new ke(foundry.utils.deepClone(f(this, he)), {
      loadedHash: f(this, mt),
      cinematicName: e
    }) : this;
  }
  addCinematic(e) {
    if (!e || f(this, he).cinematics[e]) return this;
    const t = foundry.utils.deepClone(f(this, he));
    return t.cinematics[e] = ke.emptyCinematic(), new ke(t, {
      loadedHash: f(this, mt),
      cinematicName: e
    });
  }
  removeCinematic(e) {
    if (Object.keys(f(this, he).cinematics).length <= 1) return this;
    if (!f(this, he).cinematics[e]) return this;
    const i = foundry.utils.deepClone(f(this, he));
    delete i.cinematics[e];
    const r = f(this, rt) === e ? Object.keys(i.cinematics)[0] : f(this, rt);
    return new ke(i, {
      loadedHash: f(this, mt),
      cinematicName: r
    });
  }
  renameCinematic(e, t) {
    if (!e || !t || e === t) return this;
    if (!f(this, he).cinematics[e]) return this;
    if (f(this, he).cinematics[t]) return this;
    const i = foundry.utils.deepClone(f(this, he)), r = {};
    for (const [o, s] of Object.entries(i.cinematics))
      r[o === e ? t : o] = s;
    i.cinematics = r;
    const a = f(this, rt) === e ? t : f(this, rt);
    return new ke(i, {
      loadedHash: f(this, mt),
      cinematicName: a
    });
  }
  // ── Top-level mutations (scoped to active cinematic) ──────────────────
  setTrigger(e) {
    return C(this, H, be).call(this, { trigger: e });
  }
  setTracking(e) {
    return C(this, H, be).call(this, { tracking: e });
  }
  setSynchronized(e) {
    return C(this, H, be).call(this, { synchronized: e });
  }
  setSetup(e) {
    return C(this, H, be).call(this, { setup: e });
  }
  setLanding(e) {
    return C(this, H, be).call(this, { landing: e });
  }
  // ── Timeline entry mutations ──────────────────────────────────────────
  addStep(e = -1) {
    const t = [...f(this, H, ue).timeline], i = { tweens: [] };
    return e < 0 || e >= t.length ? t.push(i) : t.splice(e, 0, i), C(this, H, be).call(this, { timeline: t });
  }
  addDelay(e = -1, t = 1e3) {
    const i = [...f(this, H, ue).timeline], r = { delay: t };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), C(this, H, be).call(this, { timeline: i });
  }
  addAwait(e = -1, t = null) {
    const i = [...f(this, H, ue).timeline], r = { await: t ?? { event: "click" } };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), C(this, H, be).call(this, { timeline: i });
  }
  addEmit(e = -1, t = "") {
    const i = [...f(this, H, ue).timeline], r = { emit: t };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), C(this, H, be).call(this, { timeline: i });
  }
  addParallel(e = -1) {
    const t = [...f(this, H, ue).timeline], i = { parallel: { branches: [[], []], join: "all", overflow: "detach" } };
    return e < 0 || e >= t.length ? t.push(i) : t.splice(e, 0, i), C(this, H, be).call(this, { timeline: t });
  }
  addTransitionTo(e = -1, t = null) {
    const i = [...f(this, H, ue).timeline], r = { transitionTo: t ?? { cinematic: "", scene: "" } };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), C(this, H, be).call(this, { timeline: i });
  }
  addSound(e = -1, t = null) {
    const i = [...f(this, H, ue).timeline], r = { sound: t ?? { src: "", volume: 0.8, loop: !1, duration: 0, fireAndForget: !1 } };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), C(this, H, be).call(this, { timeline: i });
  }
  addStopSound(e = -1, t = "") {
    const i = [...f(this, H, ue).timeline], r = { stopSound: t };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), C(this, H, be).call(this, { timeline: i });
  }
  moveEntry(e, t) {
    if (e === t) return this;
    const i = [...f(this, H, ue).timeline];
    if (e < 0 || e >= i.length) return this;
    if (t < 0 || t >= i.length) return this;
    const [r] = i.splice(e, 1);
    return i.splice(t, 0, r), C(this, H, be).call(this, { timeline: i });
  }
  removeEntry(e) {
    const t = [...f(this, H, ue).timeline];
    return e < 0 || e >= t.length ? this : (t.splice(e, 1), C(this, H, be).call(this, { timeline: t }));
  }
  updateEntry(e, t) {
    const i = f(this, H, ue).timeline.map((r, a) => a !== e ? r : { ...foundry.utils.deepClone(r), ...t });
    return C(this, H, be).call(this, { timeline: i });
  }
  // ── Tween mutations ──────────────────────────────────────────────────
  addTween(e, t = null) {
    const i = { type: "tile-prop", target: "", attribute: "alpha", value: 1, duration: 1e3 };
    return C(this, H, Ct).call(this, e, (r) => {
      const a = [...r.tweens ?? [], t ?? i];
      return { ...r, tweens: a };
    });
  }
  updateTween(e, t, i) {
    return C(this, H, Ct).call(this, e, (r) => {
      const a = (r.tweens ?? []).map((o, s) => s !== t ? o : { ...o, ...i });
      return { ...r, tweens: a };
    });
  }
  removeTween(e, t) {
    return C(this, H, Ct).call(this, e, (i) => {
      const r = (i.tweens ?? []).filter((a, o) => o !== t);
      return { ...i, tweens: r };
    });
  }
  // ── Parallel branch mutations ────────────────────────────────────────
  addBranch(e) {
    return C(this, H, Ct).call(this, e, (t) => {
      if (!t.parallel) return t;
      const i = [...t.parallel.branches, []];
      return { ...t, parallel: { ...t.parallel, branches: i } };
    });
  }
  removeBranch(e, t) {
    return C(this, H, Ct).call(this, e, (i) => {
      if (!i.parallel) return i;
      const r = i.parallel.branches.filter((a, o) => o !== t);
      return r.length < 1 ? i : { ...i, parallel: { ...i.parallel, branches: r } };
    });
  }
  addBranchEntry(e, t, i = null) {
    const r = { tweens: [] };
    return C(this, H, Ct).call(this, e, (a) => {
      if (!a.parallel) return a;
      const o = a.parallel.branches.map((s, l) => l !== t ? s : [...s, i ?? r]);
      return { ...a, parallel: { ...a.parallel, branches: o } };
    });
  }
  removeBranchEntry(e, t, i) {
    return C(this, H, Ct).call(this, e, (r) => {
      if (!r.parallel) return r;
      const a = r.parallel.branches.map((o, s) => s !== t ? o : o.filter((l, u) => u !== i));
      return { ...r, parallel: { ...r.parallel, branches: a } };
    });
  }
  updateBranchEntry(e, t, i, r) {
    return C(this, H, Ct).call(this, e, (a) => {
      if (!a.parallel) return a;
      const o = a.parallel.branches.map((s, l) => l !== t ? s : s.map((u, d) => d !== i ? u : { ...foundry.utils.deepClone(u), ...r }));
      return { ...a, parallel: { ...a.parallel, branches: o } };
    });
  }
  moveBranchEntry(e, t, i, r) {
    return i === r ? this : C(this, H, Ct).call(this, e, (a) => {
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
    const t = { ...foundry.utils.deepClone(f(this, he)), version: Ro };
    await e.setFlag(T, "cinematic", t);
  }
  /** Returns the active cinematic's data (for validation/export). */
  toJSON() {
    return foundry.utils.deepClone(f(this, H, ue));
  }
  /** Returns the entire v3 flag structure. */
  toFullJSON() {
    return foundry.utils.deepClone(f(this, he));
  }
};
he = new WeakMap(), rt = new WeakMap(), mt = new WeakMap(), Xa = new WeakSet(), dd = /* @__PURE__ */ c(function(e) {
  return foundry.utils.deepClone(e);
}, "#computeHash"), H = new WeakSet(), ue = /* @__PURE__ */ c(function() {
  return f(this, he).cinematics[f(this, rt)];
}, "#active"), // ── Internal ─────────────────────────────────────────────────────────
/** Clone the full state with a patch to the active cinematic. */
be = /* @__PURE__ */ c(function(e) {
  const t = foundry.utils.deepClone(f(this, he));
  return Object.assign(t.cinematics[f(this, rt)], e), new ke(t, {
    loadedHash: f(this, mt),
    cinematicName: f(this, rt)
  });
}, "#cloneActive"), /** Mutate a single timeline entry within the active cinematic. */
Ct = /* @__PURE__ */ c(function(e, t) {
  if (e < 0 || e >= f(this, H, ue).timeline.length) return this;
  const i = f(this, H, ue).timeline.map((r, a) => a !== e ? r : t(foundry.utils.deepClone(r)));
  return C(this, H, be).call(this, { timeline: i });
}, "#mutateEntry"), I(ke, Xa), c(ke, "CinematicState");
let Gn = ke;
const lc = [
  { value: "tile-prop", label: "Tile Prop" },
  { value: "light-color", label: "Light Color" },
  { value: "light-state", label: "Light State" },
  { value: "particles-prop", label: "Particles Prop" },
  { value: "camera-pan", label: "Camera Pan" },
  { value: "token-prop", label: "Token Prop" },
  { value: "drawing-prop", label: "Drawing Prop" },
  { value: "sound-prop", label: "Sound Prop" }
], fd = {
  "tile-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y, width, height" },
  "token-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y" },
  "drawing-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y" },
  "sound-prop": { form: "prop", attribute: "volume", value: 0.5, placeholder: "volume, radius" },
  "particles-prop": { form: "particles", attribute: "alpha", value: 1, placeholder: "alpha, rate, speed, size" },
  "camera-pan": { form: "camera", x: 0, y: 0, scale: 1 },
  "light-color": { form: "lightColor", toColor: "#ffffff", toAlpha: "", mode: "oklch" },
  "light-state": { form: "lightState", enabled: !0 }
}, qm = [
  { value: "canvasReady", label: "Canvas Ready" },
  { value: "manual", label: "Manual Only" }
];
function cc(n) {
  return n && (n.split("/").pop() || "").replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "-") || "";
}
c(cc, "soundIdFromPath");
function uc(n) {
  return n ? new Promise((e) => {
    const t = new Audio(n);
    t.addEventListener("loadedmetadata", () => {
      e(Math.round(t.duration * 1e3));
    }), t.addEventListener("error", () => e(0));
  }) : Promise.resolve(0);
}
c(uc, "loadAudioDurationMs");
const cn = 40, ji = 24, Bs = 50, dc = 50, Ft = 60, Mn = 10, hi = 16, hd = 40, gd = 20;
function yo(n) {
  const e = n.tweens ?? [];
  if (e.length === 0) return { stepDuration: 500, detachOverflow: 0 };
  let t = 0, i = 0;
  for (const o of e) {
    const s = o.duration ?? 0;
    o.detach ? i = Math.max(i, s) : t = Math.max(t, s);
  }
  const r = Math.max(500, t), a = Math.max(0, i - r);
  return { stepDuration: r, detachOverflow: a };
}
c(yo, "computeStepDurations");
function Bm(n) {
  var i;
  const e = ((i = n.parallel) == null ? void 0 : i.branches) ?? [];
  let t = 0;
  for (const r of e) {
    let a = 0;
    for (const o of r)
      o.delay != null ? a += o.delay : o.await != null || o.emit != null || (o.sound != null ? a += o.sound.fireAndForget ? 0 : o.sound.duration ?? 0 : o.stopSound != null || (a += yo(o).stepDuration));
    t = Math.max(t, a);
  }
  return Math.max(500, t);
}
c(Bm, "computeParallelDuration");
function jm(n) {
  return n.reduce((e, t) => t.delay != null ? e + t.delay : t.await != null || t.emit != null || t.transitionTo != null ? e : t.sound != null ? e + (t.sound.fireAndForget ? 0 : t.sound.duration ?? 0) : t.stopSound != null ? e : t.parallel != null ? e + Bm(t) : e + yo(t).stepDuration, 0);
}
c(jm, "computeTotalDuration");
function Um(n, e) {
  if (n <= 0) return 0.1;
  const t = e / n;
  return Math.max(0.03, Math.min(0.5, t));
}
c(Um, "computeScale");
function md(n) {
  const e = n.tweens ?? [];
  if (e.length === 0) return "Empty";
  const t = e[0], i = (t.target ?? "").replace(/^tag:/, "#"), r = t.attribute ?? "";
  return t.type === "camera-pan" ? "Pan" : r === "alpha" ? `Fade ${i}` : r === "x" || r === "y" ? `Move ${i}` : t.type === "light-color" ? `Light ${i}` : t.type === "sound-prop" ? `Sound ${i}` : i ? `${i}` : "Step";
}
c(md, "deriveStepLabel");
function Vm(n, e, t, i, r) {
  var u, d;
  const a = [], o = [], s = [];
  let l = e;
  for (let g = 0; g < n.length; g++) {
    const m = n[g], y = `${i}.${g}`, p = r === y;
    if (m.delay != null) {
      const h = Math.max(gd, m.delay * t);
      a.push({ type: "delay", leftPx: l, widthPx: h, label: `${m.delay}ms`, entryPath: y, selected: p }), l += h;
    } else if (m.await != null) {
      const h = ((u = m.await) == null ? void 0 : u.event) ?? "click", b = h === "tile-click" ? "fa-hand-pointer" : h === "signal" ? "fa-bolt" : "fa-pause";
      a.push({ type: "await", leftPx: l, widthPx: hi, label: h, entryPath: y, selected: p, isGate: !0, gateIcon: b }), ((d = m.await) == null ? void 0 : d.event) === "signal" && s.push({ signal: m.await.signal, centerPx: l + hi / 2 }), l += hi;
    } else if (m.emit != null)
      a.push({ type: "emit", leftPx: l, widthPx: Mn, label: "emit", entryPath: y, selected: p, isMarker: !0 }), o.push({ signal: m.emit, centerPx: l + Mn / 2 });
    else if (m.sound != null) {
      const h = (m.sound.src || "").split("/").pop() || "Sound", b = m.sound.duration ?? 0;
      if (m.sound.fireAndForget ?? !1)
        a.push({ type: "sound", leftPx: l, widthPx: Mn, label: h, entryPath: y, selected: p, isMarker: !0 });
      else {
        const E = b > 0 ? Math.max(Ft, b * t) : Ft, L = (m.sound.loop ?? !1) && b <= 0;
        a.push({ type: "sound", leftPx: l, widthPx: E, label: h, entryPath: y, selected: p, hasTrailingArrow: L }), l += E;
      }
    } else if (m.stopSound != null)
      a.push({ type: "stopSound", leftPx: l, widthPx: Mn, label: "Stop", entryPath: y, selected: p, isMarker: !0 });
    else {
      const { stepDuration: h } = yo(m), b = Math.max(hd, h * t), w = md(m);
      a.push({ type: "step", leftPx: l, widthPx: b, label: w, entryPath: y, selected: p }), l += b;
    }
  }
  return { blocks: a, width: l - e, emits: o, awaits: s };
}
c(Vm, "computeBranchLane");
function fc(n) {
  return ji + n * cn;
}
c(fc, "laneIndexToY");
function zm(n, e) {
  const t = [];
  for (const i of n.emits)
    for (const r of n.awaits) {
      if (i.signal !== r.signal) continue;
      const a = i.centerPx, o = fc(i.laneIndex) + cn / 2, s = r.centerPx, l = fc(r.laneIndex) + cn / 2, u = l - o, d = (a + s) / 2, g = o + Math.sign(u || 1) * Math.min(40, Math.abs(u) * 0.5 + 20), m = l - Math.sign(u || 1) * Math.min(40, Math.abs(u) * 0.5 + 20);
      t.push({
        pathD: `M ${a} ${o} C ${d} ${g}, ${d} ${m}, ${s} ${l}`,
        signal: i.signal
      });
    }
  return t;
}
c(zm, "computeSignalArcs");
function Gm(n, e) {
  const t = [];
  if (n <= 0) return t;
  const i = e * 1e3;
  let r;
  i >= 200 ? r = 500 : i >= 80 ? r = 1e3 : i >= 40 ? r = 2e3 : r = 5e3;
  for (let a = 0; a <= n + r; a += r) {
    const o = a >= 1e3 ? `${(a / 1e3).toFixed(a % 1e3 === 0 ? 0 : 1)}s` : `${a}ms`;
    t.push({ px: Bs + a * e, label: o });
  }
  return t;
}
c(Gm, "computeTimeMarkers");
function Wm(n) {
  const e = [];
  for (let t = 0; t < n.length - 1; t++) {
    const i = n[t], r = n[t + 1], a = i.leftPx + i.widthPx + (r.leftPx - (i.leftPx + i.widthPx)) / 2, o = ji + cn / 2;
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
c(Wm, "computeInsertionPoints");
function Jm(n, { selectedPath: e, windowWidth: t }) {
  const i = jm(n), r = t - 70 - 100, a = Um(i, r), o = [], s = [], l = { emits: [], awaits: [] }, u = [];
  o.push({
    type: "setup",
    leftPx: 0,
    widthPx: Bs,
    label: "Setup",
    entryPath: "setup",
    selected: e === "setup"
  });
  let d = Bs;
  for (let E = 0; E < n.length; E++) {
    const L = n[E], O = `timeline.${E}`, M = e === O;
    if (L.delay != null) {
      const N = Math.max(gd, L.delay * a);
      o.push({
        type: "delay",
        leftPx: d,
        widthPx: N,
        label: `${L.delay}ms`,
        entryPath: O,
        selected: M
      }), d += N;
    } else if (L.await != null) {
      const N = L.await.event ?? "click", D = N === "tile-click" ? "fa-hand-pointer" : N === "signal" ? "fa-bolt" : "fa-pause";
      o.push({
        type: "await",
        leftPx: d,
        widthPx: hi,
        label: N,
        entryPath: O,
        selected: M,
        isGate: !0,
        gateIcon: D
      }), L.await.event === "signal" && l.awaits.push({
        signal: L.await.signal,
        centerPx: d + hi / 2,
        laneIndex: 0
      }), d += hi;
    } else if (L.emit != null)
      o.push({
        type: "emit",
        leftPx: d,
        widthPx: Mn,
        label: "Emit",
        entryPath: O,
        selected: M,
        isMarker: !0
      }), l.emits.push({
        signal: L.emit,
        centerPx: d + Mn / 2,
        laneIndex: 0
      });
    else if (L.transitionTo != null) {
      const N = L.transitionTo.cinematic || "?";
      o.push({
        type: "transitionTo",
        leftPx: d,
        widthPx: Ft,
        label: `→ ${N}`,
        entryPath: O,
        selected: M
      }), d += Ft;
    } else if (L.sound != null) {
      const N = (L.sound.src || "").split("/").pop() || "Sound", D = L.sound.duration ?? 0;
      if (L.sound.fireAndForget ?? !1) {
        const K = D > 0 ? Math.max(Ft, D * a) : Ft, x = (L.sound.loop ?? !1) && D <= 0, V = {
          type: "sound",
          leftPx: d,
          widthPx: K,
          label: N,
          entryPath: O,
          selected: M,
          hasTrailingArrow: x
        };
        let $ = !1;
        for (const q of u)
          if (q.rightEdgePx <= d) {
            q.blocks.push(V), q.rightEdgePx = d + K, $ = !0;
            break;
          }
        $ || u.push({
          label: "♫ F&F",
          blocks: [V],
          rightEdgePx: d + K
        });
      } else {
        const K = D > 0 ? Math.max(Ft, D * a) : Ft, x = (L.sound.loop ?? !1) && D <= 0;
        o.push({
          type: "sound",
          leftPx: d,
          widthPx: K,
          label: N,
          entryPath: O,
          selected: M,
          hasTrailingArrow: x
        }), d += K;
      }
    } else if (L.stopSound != null)
      o.push({
        type: "stopSound",
        leftPx: d,
        widthPx: Mn,
        label: "Stop",
        entryPath: O,
        selected: M,
        isMarker: !0
      });
    else if (L.parallel != null) {
      const N = L.parallel.branches ?? [], D = d, ne = [];
      let K = 0;
      for (let V = 0; V < N.length; V++) {
        const $ = `timeline.${E}.parallel.branches.${V}`, { blocks: q, width: Y, emits: J, awaits: R } = Vm(N[V], D, a, $, e);
        ne.push({ label: `Br ${V + 1}`, blocks: q }), K = Math.max(K, Y);
        const B = s.length * 10 + V + 1;
        for (const Q of J) l.emits.push({ ...Q, laneIndex: B });
        for (const Q of R) l.awaits.push({ ...Q, laneIndex: B });
      }
      const x = Math.max(Ft, K);
      o.push({
        type: "parallel",
        leftPx: D,
        widthPx: x,
        label: `${N.length} br`,
        entryPath: O,
        selected: M
      }), s.push({ parallelEntryIndex: E, startPx: D, lanes: ne }), d += x;
    } else {
      const { stepDuration: N, detachOverflow: D } = yo(L), ne = Math.max(hd, N * a), K = D > 0 ? Math.max(4, D * a) : 0, x = md(L);
      o.push({
        type: "step",
        leftPx: d,
        widthPx: ne,
        detachTailPx: K,
        label: x,
        entryPath: O,
        selected: M
      }), d += ne;
    }
  }
  o.push({
    type: "landing",
    leftPx: d,
    widthPx: dc,
    label: "Landing",
    entryPath: "landing",
    selected: e === "landing"
  }), d += dc;
  const g = s.flatMap((E) => E.lanes), m = g.length;
  for (const E of u)
    g.push({ label: E.label, blocks: E.blocks });
  const y = zm(l, g.length), p = [];
  for (let E = 0; E < u.length; E++) {
    const L = m + E;
    for (const O of u[E].blocks) {
      const M = O.leftPx, N = ji + cn, D = ji + (1 + L) * cn + cn / 2;
      p.push({ x: M, y1: N, y2: D });
    }
  }
  const h = Gm(i, a), b = Wm(o), w = ji + (1 + g.length) * cn;
  return {
    mainBlocks: o,
    subLanes: g,
    signalArcs: y,
    fafConnectors: p,
    timeMarkers: h,
    insertionPoints: b,
    totalWidthPx: Math.max(d, 200),
    swimlaneHeightPx: w,
    totalDurationMs: i
  };
}
c(Jm, "computeLanes");
function gn(n) {
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
c(gn, "parseEntryPath");
function ba(n, e) {
  var i, r, a, o;
  const t = gn(n);
  return t ? t.type === "setup" ? e.setup : t.type === "landing" ? e.landing : t.type === "timeline" ? e.timeline[t.index] : t.type === "branch" ? (o = (a = (r = (i = e.timeline[t.index]) == null ? void 0 : i.parallel) == null ? void 0 : r.branches) == null ? void 0 : a[t.branchIndex]) == null ? void 0 : o[t.branchEntryIndex] : null : null;
}
c(ba, "getEntryAtPath");
function hc(n) {
  const e = gn(n);
  return !e || e.type !== "timeline" ? null : e.index;
}
c(hc, "getTimelineIndexFromPath");
function Km(n) {
  var r, a;
  const e = /* @__PURE__ */ new Set(), i = (r = n.data.cinematics) == null ? void 0 : r[n.activeCinematicName];
  if (!i) return 0;
  if (i.setup) for (const o of Object.keys(i.setup)) e.add(o);
  if (i.landing) for (const o of Object.keys(i.landing)) e.add(o);
  for (const o of i.timeline ?? []) {
    if (o.tweens)
      for (const s of o.tweens)
        s.target && e.add(s.target);
    if (o.before) for (const s of Object.keys(o.before)) e.add(s);
    if (o.after) for (const s of Object.keys(o.after)) e.add(s);
    if ((a = o.parallel) != null && a.branches) {
      for (const s of o.parallel.branches)
        for (const l of s)
          if (l.tweens)
            for (const u of l.tweens)
              u.target && e.add(u.target);
    }
  }
  return e.size;
}
c(Km, "countUniqueTargets");
function Ym(n) {
  var e;
  return (e = n.tweens) != null && e.length ? Math.max(500, ...n.tweens.map((t) => t.duration ?? 0)) : 500;
}
c(Ym, "maxTweenDuration");
function Qm(n, e) {
  var i, r, a;
  const t = gn(n);
  if (!t) return 0;
  if (t.type === "timeline") {
    let o = 0;
    for (let s = 0; s <= t.index; s++) {
      const l = e.timeline[s];
      l && l.delay == null && l.await == null && l.emit == null && l.parallel == null && l.transitionTo == null && l.sound == null && l.stopSound == null && o++;
    }
    return o;
  }
  if (t.type === "branch") {
    const o = ((a = (r = (i = e.timeline[t.index]) == null ? void 0 : i.parallel) == null ? void 0 : r.branches) == null ? void 0 : a[t.branchIndex]) ?? [];
    let s = 0;
    for (let l = 0; l <= t.branchEntryIndex; l++) {
      const u = o[l];
      u && u.delay == null && u.await == null && u.emit == null && u.sound == null && u.stopSound == null && s++;
    }
    return s;
  }
  return 0;
}
c(Qm, "stepNumberForPath");
function Xm(n) {
  return {
    isSetup: !0,
    targetCount: Object.keys(n.setup ?? {}).length
  };
}
c(Xm, "buildSetupDetail");
function Zm(n) {
  return {
    isLanding: !0,
    targetCount: Object.keys(n.landing ?? {}).length
  };
}
c(Zm, "buildLandingDetail");
function ep(n) {
  return { type: "delay", isDelay: !0, delay: n.delay };
}
c(ep, "buildDelayDetail");
function tp(n) {
  var r, a, o, s;
  const e = ((r = n.await) == null ? void 0 : r.event) ?? "click", t = (a = n.await) == null ? void 0 : a.animation, i = /* @__PURE__ */ c((l) => Array.isArray(l) ? l.join(", ") : l ?? "", "toStr");
  return {
    type: "await",
    isAwait: !0,
    event: e,
    signal: ((o = n.await) == null ? void 0 : o.signal) ?? "",
    target: ((s = n.await) == null ? void 0 : s.target) ?? "",
    eventIsClick: e === "click",
    eventIsKeypress: e === "keypress",
    eventIsSignal: e === "signal",
    eventIsTileClick: e === "tile-click",
    animIdle: i(t == null ? void 0 : t.idle),
    animHover: i(t == null ? void 0 : t.hover),
    animDim: i(t == null ? void 0 : t.dim)
  };
}
c(tp, "buildAwaitDetail");
function np(n) {
  return { type: "emit", isEmit: !0, signal: n.emit };
}
c(np, "buildEmitDetail");
function ip(n, e) {
  const t = e.listCinematicNames();
  return {
    type: "transitionTo",
    isTransitionTo: !0,
    transitionCinematic: n.transitionTo.cinematic ?? "",
    transitionScene: n.transitionTo.scene ?? "",
    cinematicOptions: t.map((i) => ({
      value: i,
      label: i,
      selected: i === n.transitionTo.cinematic
    }))
  };
}
c(ip, "buildTransitionToDetail");
function rp(n) {
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
c(rp, "buildSoundDetail");
function ap(n) {
  return {
    type: "stopSound",
    isStopSound: !0,
    stopSoundId: n.stopSound
  };
}
c(ap, "buildStopSoundDetail");
function op(n, e) {
  var o;
  const t = n.parallel, i = t.join ?? "all", r = t.overflow ?? "detach", a = (t.branches ?? []).map((s, l) => ({
    branchIndex: l,
    label: `Branch ${l + 1}`,
    entries: (s ?? []).map((u, d) => {
      var L, O;
      const g = u.delay != null, m = u.await != null, y = u.emit != null, p = u.sound != null, h = u.stopSound != null, b = !g && !m && !y && !p && !h;
      let w, E;
      return g ? (w = `${u.delay}ms`, E = "delay") : m ? (w = "Await", E = ((L = u.await) == null ? void 0 : L.event) ?? "click") : y ? (w = "Emit", E = u.emit || "(unnamed)") : p ? (w = "Sound", E = (u.sound.src || "").split("/").pop() || "(none)") : h ? (w = "Stop Sound", E = u.stopSound || "(no id)") : (w = "Step", E = `${((O = u.tweens) == null ? void 0 : O.length) ?? 0} tweens`), { branchEntryIndex: d, isDelay: g, isAwait: m, isEmit: y, isSound: p, isStopSound: h, isStep: b, label: w, sub: E };
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
c(op, "buildParallelDetail");
function sp(n, e, t, i) {
  const r = Wg(), a = (n.tweens ?? []).map((l, u) => {
    const d = `${e}.tweens.${u}`, g = t.has(d), m = l.type ?? "tile-prop", y = lc.find((w) => w.value === m), p = fd[m], h = (p == null ? void 0 : p.form) ?? "prop", b = l.mode ?? "oklch";
    return {
      tweenIndex: u,
      isExpanded: g,
      type: m,
      typeLabel: (y == null ? void 0 : y.label) ?? l.type ?? "Tile Prop",
      target: l.target ?? "",
      attribute: l.attribute ?? "",
      attributePlaceholder: (p == null ? void 0 : p.placeholder) ?? "",
      value: l.value ?? "",
      duration: l.duration ?? 0,
      easing: l.easing ?? "",
      detach: l.detach ?? !1,
      // Form group flags
      formGroup: h,
      formIsProp: h === "prop",
      formIsParticles: h === "particles",
      formIsCamera: h === "camera",
      formIsLightColor: h === "lightColor",
      formIsLightState: h === "lightState",
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
      typeOptions: lc.map((w) => ({
        ...w,
        selected: w.value === (l.type ?? "tile-prop")
      })),
      easingOptions: [
        { value: "", label: "(default)", selected: !l.easing },
        ...r.map((w) => ({
          value: w,
          label: w,
          selected: l.easing === w
        }))
      ]
    };
  }), o = Object.keys(n.before ?? {}), s = Object.keys(n.after ?? {});
  return {
    type: "step",
    isStep: !0,
    isDelay: !1,
    stepNumber: Qm(e, i),
    maxDuration: Ym(n),
    tweens: a,
    beforeSummary: o.length ? `${o.length} target${o.length !== 1 ? "s" : ""}` : "(none)",
    afterSummary: s.length ? `${s.length} target${s.length !== 1 ? "s" : ""}` : "(none)"
  };
}
c(sp, "buildStepDetail");
function lp(n, { state: e, expandedTweens: t }) {
  const i = gn(n);
  if (!i) return null;
  if (i.type === "setup") return Xm(e);
  if (i.type === "landing") return Zm(e);
  const r = ba(n, e);
  return r ? r.delay != null ? ep(r) : r.await != null ? tp(r) : r.emit != null ? np(r) : r.transitionTo != null ? ip(r, e) : r.sound != null ? rp(r) : r.stopSound != null ? ap(r) : r.parallel != null && i.type === "timeline" ? op(r) : sp(r, n, t, e) : null;
}
c(lp, "buildDetail");
function cp({ state: n, mutate: e }) {
  new Dialog({
    title: "Import Cinematic JSON",
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">Paste cinematic JSON data below. This will replace the current editor state.</p>
			<textarea id="cinematic-import-json" style="width:100%;height:250px;font-family:monospace;font-size:0.8rem" placeholder='{"version":3,"cinematics":{"default":{...}}}'></textarea>
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
              e(() => new Gn(l));
            else if (l.timeline !== void 0) {
              const u = { version: 3, cinematics: { [n.activeCinematicName]: l } };
              e(() => new Gn(u, { cinematicName: n.activeCinematicName }));
            } else
              throw new Error("Expected v3 wrapper or single cinematic with 'timeline'");
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
c(cp, "showImportDialog");
function gc(n, { state: e, mutate: t }) {
  const i = n === "setup" ? e.setup : e.landing, r = JSON.stringify(i ?? {}, null, 2);
  new Dialog({
    title: `Edit ${n.charAt(0).toUpperCase() + n.slice(1)}`,
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON map of target selector → property overrides:</p>
			<textarea id="cinematic-json-edit" style="width:100%;height:200px;font-family:monospace;font-size:0.8rem">${bt(r)}</textarea>
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
c(gc, "showEditJsonDialog");
function mc(n, { selectedPath: e, state: t, mutate: i }) {
  const r = ba(e, t);
  if (!r || r.delay != null) return;
  const a = r[n] ?? {}, o = JSON.stringify(a, null, 2);
  new Dialog({
    title: `Edit Step ${n.charAt(0).toUpperCase() + n.slice(1)}`,
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON map of target selector → property overrides:</p>
			<textarea id="cinematic-json-edit" style="width:100%;height:200px;font-family:monospace;font-size:0.8rem">${bt(o)}</textarea>
		`,
    buttons: {
      save: {
        label: "Apply",
        callback: /* @__PURE__ */ c((s) => {
          var u, d;
          const l = s.find("#cinematic-json-edit").val();
          try {
            const g = JSON.parse(l), m = gn(e);
            (m == null ? void 0 : m.type) === "timeline" ? i((y) => y.updateEntry(m.index, { [n]: g })) : (m == null ? void 0 : m.type) === "branch" && i((y) => y.updateBranchEntry(m.index, m.branchIndex, m.branchEntryIndex, { [n]: g }));
          } catch (g) {
            (d = (u = ui.notifications) == null ? void 0 : u.error) == null || d.call(u, `Invalid JSON: ${g.message}`);
          }
        }, "callback")
      },
      cancel: { label: "Cancel" }
    },
    default: "save"
  }).render(!0);
}
c(mc, "showEditStepStateDialog");
function up({ selectedPath: n, state: e, mutate: t }) {
  const i = gn(n);
  if (!i || i.type !== "timeline") return;
  const r = e.timeline[i.index];
  if (!(r != null && r.parallel)) return;
  const a = JSON.stringify(r.parallel.branches ?? [], null, 2);
  new Dialog({
    title: "Edit Parallel Branches",
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON array of branch timelines:</p>
			<textarea id="cinematic-json-edit" style="width:100%;height:250px;font-family:monospace;font-size:0.8rem">${bt(a)}</textarea>
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
            t((g) => g.updateEntry(i.index, {
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
c(up, "showEditParallelJsonDialog");
var Cc, nn, dn, Jr, pd;
const ut = class ut extends bn(yn) {
  constructor(t = {}) {
    super(t);
    I(this, dn);
    I(this, nn, null);
    S(this, nn, t.scene ?? canvas.scene ?? null);
  }
  async _prepareContext() {
    var r, a, o;
    const t = f(this, dn, Jr), i = ((a = t == null ? void 0 : t.getSeenStatus) == null ? void 0 : a.call(t, (r = f(this, nn)) == null ? void 0 : r.id)) ?? [];
    return {
      sceneName: ((o = f(this, nn)) == null ? void 0 : o.name) ?? "No scene",
      users: i.map((s) => ({
        ...s,
        statusLabel: s.seen ? "Seen" : "Not seen",
        statusClass: s.seen ? "cinematic-tracking__status--seen" : "cinematic-tracking__status--unseen"
      })),
      hasAnyTracked: i.some((s) => s.seen)
    };
  }
  _onRender(t, i) {
    super._onRender(t, i), C(this, dn, pd).call(this);
  }
};
nn = new WeakMap(), dn = new WeakSet(), Jr = /* @__PURE__ */ c(function() {
  var t, i;
  return (i = (t = game.modules.get(T)) == null ? void 0 : t.api) == null ? void 0 : i.cinematic;
}, "#api"), pd = /* @__PURE__ */ c(function() {
  var i, r;
  const t = this.element;
  t instanceof HTMLElement && (t.querySelectorAll("[data-action='reset-user']").forEach((a) => {
    a.addEventListener("click", async () => {
      var l;
      const o = a.dataset.userId;
      if (!o) return;
      const s = f(this, dn, Jr);
      s != null && s.resetForUser && (await s.resetForUser((l = f(this, nn)) == null ? void 0 : l.id, o), this.render({ force: !0 }));
    });
  }), (i = t.querySelector("[data-action='reset-all']")) == null || i.addEventListener("click", async () => {
    var o;
    const a = f(this, dn, Jr);
    a != null && a.resetForAll && (await a.resetForAll((o = f(this, nn)) == null ? void 0 : o.id), this.render({ force: !0 }));
  }), (r = t.querySelector("[data-action='refresh']")) == null || r.addEventListener("click", () => {
    this.render({ force: !0 });
  }));
}, "#bindEvents"), c(ut, "CinematicTrackingApplication"), pe(ut, "APP_ID", `${T}-cinematic-tracking`), pe(ut, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Ne(ut, ut, "DEFAULT_OPTIONS"),
  {
    id: ut.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Cc = Ne(ut, ut, "DEFAULT_OPTIONS")) == null ? void 0 : Cc.classes) ?? [], "eidolon-cinematic-tracking-window", "themed"])
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
)), pe(ut, "PARTS", {
  content: {
    template: `modules/${T}/templates/cinematic-tracking.html`
  }
});
let js = ut;
function dp(n, e) {
  var t, i, r, a, o, s, l, u, d;
  (t = n.querySelector("[data-action='save']")) == null || t.addEventListener("click", () => e.save()), (i = n.querySelector("[data-action='play-preview']")) == null || i.addEventListener("click", () => e.play()), (r = n.querySelector("[data-action='reset-tracking']")) == null || r.addEventListener("click", () => e.resetTracking()), (a = n.querySelector("[data-action='export-json']")) == null || a.addEventListener("click", () => e.exportJSON()), (o = n.querySelector("[data-action='undo']")) == null || o.addEventListener("click", () => e.undo()), (s = n.querySelector("[data-action='redo']")) == null || s.addEventListener("click", () => e.redo()), (l = n.querySelector("[data-action='validate']")) == null || l.addEventListener("click", () => e.validate()), (u = n.querySelector("[data-action='import-json']")) == null || u.addEventListener("click", () => e.importJSON()), (d = n.querySelector("[data-action='open-tracking']")) == null || d.addEventListener("click", () => {
    new js({ scene: e.scene }).render(!0);
  });
}
c(dp, "bindToolbarEvents");
function fp(n, e) {
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
            var l, u, d, g, m, y, p;
            const s = (l = o.find("#cinematic-new-name").val()) == null ? void 0 : l.trim();
            if (!s) {
              (d = (u = ui.notifications) == null ? void 0 : u.warn) == null || d.call(u, "Name cannot be empty.");
              return;
            }
            if (/[.\s]/.test(s)) {
              (m = (g = ui.notifications) == null ? void 0 : g.warn) == null || m.call(g, "Name cannot contain dots or spaces.");
              return;
            }
            if (e.state.listCinematicNames().includes(s)) {
              (p = (y = ui.notifications) == null ? void 0 : y.warn) == null || p.call(y, "Name already exists.");
              return;
            }
            e.mutate((h) => h.addCinematic(s));
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
      content: `<label style="display:flex;align-items:center;gap:0.5rem"><span>Name:</span><input id="cinematic-rename" type="text" style="flex:1" value="${bt(o)}" /></label>`,
      buttons: {
        ok: {
          label: "Rename",
          callback: /* @__PURE__ */ c((s) => {
            var u, d, g, m, y, p, h;
            const l = (u = s.find("#cinematic-rename").val()) == null ? void 0 : u.trim();
            if (!l) {
              (g = (d = ui.notifications) == null ? void 0 : d.warn) == null || g.call(d, "Name cannot be empty.");
              return;
            }
            if (/[.\s]/.test(l)) {
              (y = (m = ui.notifications) == null ? void 0 : m.warn) == null || y.call(m, "Name cannot contain dots or spaces.");
              return;
            }
            if (l !== o) {
              if (e.state.listCinematicNames().includes(l)) {
                (h = (p = ui.notifications) == null ? void 0 : p.warn) == null || h.call(p, "Name already exists.");
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
c(fp, "bindCinematicSelectorEvents");
function hp(n, e) {
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
        const s = hc(t), l = hc(o);
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
        case "await":
          e.mutate((o) => o.addAwait(a));
          break;
        case "emit":
          e.mutate((o) => o.addEmit(a));
          break;
        case "parallel":
          e.mutate((o) => o.addParallel(a));
          break;
        case "transitionTo":
          e.mutate((o) => o.addTransitionTo(a));
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
c(hp, "bindSwimlaneEvents");
function gp(n, e) {
  var t, i, r, a, o, s, l, u, d, g;
  (t = n.querySelector("[data-action='delete-entry']")) == null || t.addEventListener("click", () => {
    const m = e.parseEntryPath(e.selectedPath);
    m && (m.type === "timeline" ? (e.mutate((y) => y.removeEntry(m.index)), e.setSelectedPath(null)) : m.type === "branch" && (e.mutate((y) => y.removeBranchEntry(m.index, m.branchIndex, m.branchEntryIndex)), e.setSelectedPath(null)));
  }), (i = n.querySelector("[data-action='add-tween']")) == null || i.addEventListener("click", () => {
    const m = e.parseEntryPath(e.selectedPath);
    if (m) {
      if (m.type === "timeline")
        e.mutate((y) => y.addTween(m.index));
      else if (m.type === "branch") {
        const y = e.getEntryAtPath(e.selectedPath);
        if (!y) return;
        const p = { type: "tile-prop", target: "", attribute: "alpha", value: 1, duration: 1e3 }, h = [...y.tweens ?? [], p];
        e.mutate((b) => b.updateBranchEntry(m.index, m.branchIndex, m.branchEntryIndex, { tweens: h }));
      }
    }
  }), (r = n.querySelector("[data-action='change-delay']")) == null || r.addEventListener("change", (m) => {
    const y = e.parseEntryPath(e.selectedPath);
    if (!y) return;
    const p = Number(m.target.value) || 0;
    y.type === "timeline" ? e.mutate((h) => h.updateEntry(y.index, { delay: p })) : y.type === "branch" && e.mutate((h) => h.updateBranchEntry(y.index, y.branchIndex, y.branchEntryIndex, { delay: p }));
  }), (a = n.querySelector("[data-action='edit-setup']")) == null || a.addEventListener("click", () => {
    gc("setup", { state: e.state, mutate: e.mutate });
  }), (o = n.querySelector("[data-action='edit-landing']")) == null || o.addEventListener("click", () => {
    gc("landing", { state: e.state, mutate: e.mutate });
  }), (s = n.querySelector("[data-action='edit-before']")) == null || s.addEventListener("click", () => {
    mc("before", { selectedPath: e.selectedPath, state: e.state, mutate: e.mutate });
  }), (l = n.querySelector("[data-action='edit-after']")) == null || l.addEventListener("click", () => {
    mc("after", { selectedPath: e.selectedPath, state: e.state, mutate: e.mutate });
  }), (u = n.querySelector("[data-action='change-trigger']")) == null || u.addEventListener("change", (m) => {
    e.mutate((y) => y.setTrigger(m.target.value));
  }), (d = n.querySelector("[data-action='change-tracking']")) == null || d.addEventListener("change", (m) => {
    e.mutate((y) => y.setTracking(m.target.checked));
  }), (g = n.querySelector("[data-action='change-synchronized']")) == null || g.addEventListener("change", (m) => {
    e.mutate((y) => y.setSynchronized(m.target.checked));
  });
}
c(gp, "bindDetailPanelEvents");
const Ci = /* @__PURE__ */ new WeakMap(), wa = /* @__PURE__ */ new Set(), va = /* @__PURE__ */ new Set(), pc = {
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
function Ea(n, e = {}) {
  var p, h, b;
  if (!n) return !1;
  Si(n);
  const t = e.mode ?? (e.color != null ? "custom" : "hover"), i = pc[t] ?? pc.hover, r = e.color ?? i.borderColor, a = e.alpha ?? i.borderAlpha, o = e.color ?? i.spriteTint, s = i.spriteAlpha, l = e.pulse ?? i.pulse, u = { border: null, sprite: null, pulseData: null, mode: t }, d = ((p = n.document) == null ? void 0 : p.width) ?? n.w ?? 100, g = ((h = n.document) == null ? void 0 : h.height) ?? n.h ?? 100, m = new PIXI.Graphics();
  m.lineStyle(i.borderWidth, r, a), m.drawRect(0, 0, d, g), n.addChild(m), u.border = m;
  const y = mp(n, o, s);
  if (y && (canvas.controls.debug.addChild(y), va.add(y), u.sprite = y), l && ((b = canvas.app) != null && b.ticker)) {
    const w = {
      elapsed: 0,
      fn: /* @__PURE__ */ c((E) => {
        w.elapsed += E;
        const L = (Math.sin(w.elapsed * 0.05) + 1) / 2;
        u.border && (u.border.alpha = a * (0.4 + 0.6 * L)), u.sprite && (u.sprite.alpha = s * (0.5 + 0.5 * L));
      }, "fn")
    };
    canvas.app.ticker.add(w.fn), u.pulseData = w, wa.add(w);
  }
  return Ci.set(n, u), !0;
}
c(Ea, "addHighlight");
function Si(n) {
  var t, i;
  if (!n) return;
  const e = Ci.get(n);
  e && (e.pulseData && ((i = (t = canvas.app) == null ? void 0 : t.ticker) == null || i.remove(e.pulseData.fn), wa.delete(e.pulseData)), e.border && (e.border.parent && e.border.parent.removeChild(e.border), e.border.destroy({ children: !0 })), e.sprite && (e.sprite.parent && e.sprite.parent.removeChild(e.sprite), e.sprite.destroy({ children: !0 }), va.delete(e.sprite)), Ci.delete(n));
}
c(Si, "removeHighlight");
function yd(n) {
  return Ci.has(n);
}
c(yd, "hasHighlight");
function Kr() {
  var e, t, i, r, a, o, s;
  for (const l of wa)
    (t = (e = canvas.app) == null ? void 0 : e.ticker) == null || t.remove(l.fn);
  wa.clear();
  for (const l of va)
    l.parent && l.parent.removeChild(l), l.destroy({ children: !0 });
  va.clear();
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
        const d = Ci.get(u);
        d && (d.border && (d.border.parent && d.border.parent.removeChild(d.border), d.border.destroy({ children: !0 })), Ci.delete(u));
      }
}
c(Kr, "clearAllHighlights");
function mp(n, e, t) {
  var a;
  const i = n.mesh;
  if (!((a = i == null ? void 0 : i.texture) != null && a.baseTexture)) return null;
  const r = PIXI.Sprite.from(i.texture);
  return r.isSprite = !0, r.anchor.set(i.anchor.x, i.anchor.y), r.width = i.width, r.height = i.height, r.scale = i.scale, r.position = n.center, r.angle = i.angle, r.alpha = t, r.tint = e, r.name = "eidolonPickerHighlight", r;
}
c(mp, "createTintSprite");
let In = null;
function bd(n) {
  var p, h, b;
  In && In.cancel();
  const { placeableType: e = "Tile", onPick: t, onCancel: i } = n;
  let r = null;
  const a = `control${e}`, o = `hover${e}`, s = /* @__PURE__ */ c((w, E) => {
    var O;
    if (!E) return;
    const L = w.document ?? w;
    (O = w.release) == null || O.call(w), t(L);
  }, "onControl"), l = /* @__PURE__ */ c((w, E) => {
    E ? (r = w, Ea(w, { mode: "pick" })) : r === w && (Si(w), r = null);
  }, "onHoverIn"), u = /* @__PURE__ */ c((w) => {
    w.key === "Escape" && (w.preventDefault(), w.stopPropagation(), y());
  }, "onKeydown"), d = /* @__PURE__ */ c((w) => {
    w.preventDefault(), y();
  }, "onContextMenu"), g = Hooks.on(a, s), m = Hooks.on(o, l);
  document.addEventListener("keydown", u, { capture: !0 }), (p = canvas.stage) == null || p.addEventListener("rightclick", d), (b = (h = ui.notifications) == null ? void 0 : h.info) == null || b.call(h, `Pick mode active — click a ${e.toLowerCase()} on the canvas, or press ESC to cancel.`, { permanent: !1 });
  function y() {
    var w;
    In && (In = null, Hooks.off(a, g), Hooks.off(o, m), document.removeEventListener("keydown", u, { capture: !0 }), (w = canvas.stage) == null || w.removeEventListener("rightclick", d), r && (Si(r), r = null), i == null || i());
  }
  return c(y, "cancel"), In = { cancel: y }, { cancel: y };
}
c(bd, "enterPickMode");
function Hi() {
  In && In.cancel();
}
c(Hi, "cancelPickMode");
const pp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cancelPickMode: Hi,
  enterPickMode: bd
}, Symbol.toStringTag, { value: "Module" }));
var Sc, Se, _e, cr, rn, ur, dr, Ve, an, ce, wd, Us, vd, Ed, Td, Vs, zs, Cd, Sd;
const tt = class tt extends bn(yn) {
  /**
   * @param {object} options
   * @param {string[]} [options.selections]  Initial selections
   * @param {string} [options.placeableType]  "Tile", "Token", etc.
   * @param {(selectors: string[]) => void} [options.onApply]
   * @param {() => void} [options.onCancel]
   */
  constructor(t = {}) {
    super(t);
    I(this, ce);
    /** @type {string[]} Current selections (selector strings). */
    I(this, Se, []);
    /** @type {boolean} Whether pick mode is active. */
    I(this, _e, !1);
    /** @type {string} Placeable type (Tile, Token, etc.). */
    I(this, cr, "Tile");
    /** @type {string} Current tag match mode. */
    I(this, rn, "any");
    /** @type {((selectors: string[]) => void) | null} */
    I(this, ur, null);
    /** @type {(() => void) | null} */
    I(this, dr, null);
    /** @type {Promise resolve function for the open() API. */
    I(this, Ve, null);
    /** @type {PlaceableObject | null} Currently hovered tile in the browser. */
    I(this, an, null);
    S(this, Se, [...t.selections ?? []]), S(this, cr, t.placeableType ?? "Tile"), S(this, ur, t.onApply ?? null), S(this, dr, t.onCancel ?? null);
  }
  // ── Context ───────────────────────────────────────────────────────────
  async _prepareContext() {
    var r;
    const t = C(this, ce, Vs).call(this), i = (((r = canvas.tiles) == null ? void 0 : r.placeables) ?? []).map((a, o) => {
      var d, g;
      const s = a.document, l = s.id, u = (d = s.texture) != null && d.src ? s.texture.src.split("/").pop().replace(/\.[^.]+$/, "") : `Tile ${o + 1}`;
      return {
        id: l,
        name: u.length > 20 ? u.slice(0, 18) + "..." : u,
        thumbnailSrc: ((g = s.texture) == null ? void 0 : g.src) ?? null,
        selected: t.has(l)
      };
    });
    return {
      selections: f(this, Se),
      selectionCount: f(this, Se).length,
      pickModeActive: f(this, _e),
      tagModeIsAny: f(this, rn) === "any",
      tagModeIsAll: f(this, rn) === "all",
      tagPreviewCount: 0,
      tiles: i,
      tileCount: i.length
    };
  }
  // ── Render & Events ───────────────────────────────────────────────────
  _onRender(t, i) {
    super._onRender(t, i), C(this, ce, wd).call(this), C(this, ce, zs).call(this);
  }
  async _onClose(t) {
    return f(this, _e) && (Hi(), S(this, _e, !1)), Kr(), f(this, Ve) && (f(this, Ve).call(this, null), S(this, Ve, null)), super._onClose(t);
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
      const r = new tt({
        ...t,
        onApply: /* @__PURE__ */ c((a) => i(a), "onApply"),
        onCancel: /* @__PURE__ */ c(() => i(null), "onCancel")
      });
      S(r, Ve, i), r.render(!0);
    });
  }
};
Se = new WeakMap(), _e = new WeakMap(), cr = new WeakMap(), rn = new WeakMap(), ur = new WeakMap(), dr = new WeakMap(), Ve = new WeakMap(), an = new WeakMap(), ce = new WeakSet(), wd = /* @__PURE__ */ c(function() {
  var a, o, s, l;
  const t = this.element;
  if (!(t instanceof HTMLElement)) return;
  const i = t.querySelector("[data-role='tag-input']"), r = t.querySelector("[data-role='tag-mode']");
  r == null || r.addEventListener("change", (u) => {
    S(this, rn, u.target.value);
  }), i == null || i.addEventListener("input", () => {
    C(this, ce, vd).call(this, t);
  }), i == null || i.addEventListener("keydown", (u) => {
    u.key === "Enter" && (u.preventDefault(), C(this, ce, Us).call(this, t));
  }), (a = t.querySelector("[data-action='add-tag-selector']")) == null || a.addEventListener("click", () => {
    C(this, ce, Us).call(this, t);
  }), (o = t.querySelector("[data-action='toggle-pick-mode']")) == null || o.addEventListener("click", () => {
    f(this, _e) ? (Hi(), S(this, _e, !1)) : (S(this, _e, !0), bd({
      placeableType: f(this, cr),
      onPick: /* @__PURE__ */ c((u) => {
        C(this, ce, Ed).call(this, u.id);
      }, "onPick"),
      onCancel: /* @__PURE__ */ c(() => {
        S(this, _e, !1), this.render({ force: !0 });
      }, "onCancel")
    })), this.render({ force: !0 });
  }), t.querySelectorAll("[data-action='toggle-tile']").forEach((u) => {
    u.addEventListener("click", () => {
      const d = u.dataset.docId;
      d && C(this, ce, Td).call(this, d);
    }), u.addEventListener("mouseenter", () => {
      var m, y;
      const d = u.dataset.docId;
      if (!d) return;
      const g = (y = (m = canvas.tiles) == null ? void 0 : m.placeables) == null ? void 0 : y.find((p) => p.document.id === d);
      g && (S(this, an, g), Ea(g, { mode: "hover" }));
    }), u.addEventListener("mouseleave", () => {
      f(this, an) && (Si(f(this, an)), S(this, an, null), C(this, ce, zs).call(this));
    });
  }), t.querySelectorAll("[data-action='remove-selection']").forEach((u) => {
    u.addEventListener("click", () => {
      const d = Number(u.dataset.selectionIndex);
      Number.isNaN(d) || (f(this, Se).splice(d, 1), this.render({ force: !0 }));
    });
  }), (s = t.querySelector("[data-action='apply']")) == null || s.addEventListener("click", () => {
    C(this, ce, Cd).call(this);
  }), (l = t.querySelector("[data-action='cancel']")) == null || l.addEventListener("click", () => {
    C(this, ce, Sd).call(this);
  });
}, "#bindEvents"), // ── Tag helpers ───────────────────────────────────────────────────────
Us = /* @__PURE__ */ c(function(t) {
  var s;
  const i = t.querySelector("[data-role='tag-input']"), r = (s = i == null ? void 0 : i.value) == null ? void 0 : s.trim();
  if (!r) return;
  const a = r.split(",").map((l) => l.trim()).filter(Boolean);
  if (a.length === 0) return;
  const o = id(a, f(this, rn));
  o && !f(this, Se).includes(o) && f(this, Se).push(o), i && (i.value = ""), this.render({ force: !0 });
}, "#addTagSelector"), vd = /* @__PURE__ */ c(function(t) {
  var g, m;
  const i = t.querySelector("[data-role='tag-input']"), r = t.querySelector("[data-role='tag-preview']");
  if (!i || !r) return;
  const a = i.value.trim();
  if (!a) {
    r.textContent = "";
    return;
  }
  const o = a.split(",").map((y) => y.trim()).filter(Boolean);
  if (o.length === 0) {
    r.textContent = "";
    return;
  }
  const s = window.Tagger ?? ((g = game.modules.get("tagger")) == null ? void 0 : g.api);
  if (!s) {
    r.textContent = "Tagger not available";
    return;
  }
  const l = f(this, rn) === "any", u = s.getByTag(o, {
    sceneId: (m = canvas.scene) == null ? void 0 : m.id,
    matchAny: l
  }), d = (u == null ? void 0 : u.length) ?? 0;
  r.textContent = `${d} matching placeable(s)`;
}, "#updateTagPreview"), // ── ID selector helpers ──────────────────────────────────────────────
Ed = /* @__PURE__ */ c(function(t) {
  const i = `id:${t}`;
  f(this, Se).includes(i) || (f(this, Se).push(i), this.render({ force: !0 }));
}, "#addIdSelector"), Td = /* @__PURE__ */ c(function(t) {
  const i = `id:${t}`, r = f(this, Se).indexOf(i);
  r >= 0 ? f(this, Se).splice(r, 1) : f(this, Se).push(i), this.render({ force: !0 });
}, "#toggleIdSelector"), /**
 * Get the set of document IDs that are currently selected across all selector types.
 * Resolves tag/tags-any/tags-all selectors to find matching document IDs.
 * @returns {Set<string>}
 */
Vs = /* @__PURE__ */ c(function() {
  const t = /* @__PURE__ */ new Set();
  for (const i of f(this, Se)) {
    const r = bl(i);
    if (r.type === "id") {
      t.add(r.value);
      continue;
    }
    const a = po(i);
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
zs = /* @__PURE__ */ c(function() {
  var r, a;
  const t = C(this, ce, Vs).call(this), i = ((r = canvas.tiles) == null ? void 0 : r.placeables) ?? [];
  for (const o of i) {
    const s = (a = o.document) == null ? void 0 : a.id;
    if (!s) continue;
    const l = t.has(s), u = o === f(this, an), d = yd(o);
    l && !u && !d ? Ea(o, { mode: "selected" }) : !l && d && !u && Si(o);
  }
}, "#refreshSelectionHighlights"), // ── Apply / Cancel ──────────────────────────────────────────────────
Cd = /* @__PURE__ */ c(function() {
  var i;
  f(this, _e) && (Hi(), S(this, _e, !1)), Kr();
  const t = [...f(this, Se)];
  (i = f(this, ur)) == null || i.call(this, t), f(this, Ve) && (f(this, Ve).call(this, t), S(this, Ve, null)), this.close({ force: !0 });
}, "#doApply"), Sd = /* @__PURE__ */ c(function() {
  var t;
  f(this, _e) && (Hi(), S(this, _e, !1)), Kr(), (t = f(this, dr)) == null || t.call(this), f(this, Ve) && (f(this, Ve).call(this, null), S(this, Ve, null)), this.close({ force: !0 });
}, "#doCancel"), c(tt, "PlaceablePickerApplication"), pe(tt, "APP_ID", `${T}-placeable-picker`), pe(tt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Ne(tt, tt, "DEFAULT_OPTIONS"),
  {
    id: tt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Sc = Ne(tt, tt, "DEFAULT_OPTIONS")) == null ? void 0 : Sc.classes) ?? [], "eidolon-placeable-picker-window", "themed"])
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
)), pe(tt, "PARTS", {
  content: {
    template: `modules/${T}/templates/placeable-picker.html`
  }
});
let Ta = tt;
function yp(n, e) {
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
      const a = e.getEntryAtPath(e.selectedPath), o = ((d = (u = a == null ? void 0 : a.tweens) == null ? void 0 : u[i]) == null ? void 0 : d.target) ?? "", s = o ? [o] : [], l = await Ta.open({ selections: s });
      if (l && l.length > 0) {
        if (r.type === "timeline")
          e.mutate((g) => g.updateTween(r.index, i, { target: l[0] }));
        else if (r.type === "branch") {
          const g = (a.tweens ?? []).map((m, y) => y === i ? { ...m, target: l[0] } : m);
          e.mutate((m) => m.updateBranchEntry(r.index, r.branchIndex, r.branchEntryIndex, { tweens: g }));
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
        if (r.type === "checkbox" ? s = r.checked : a === "duration" || a === "x" || a === "y" || a === "scale" || a === "toAlpha" ? s = r.value.trim() === "" ? "" : Number(r.value) || 0 : a === "value" && !Number.isNaN(Number(r.value)) && r.value.trim() !== "" ? s = Number(r.value) : s = r.value, a === "type") {
          const l = fd[s], u = { type: s };
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
c(yp, "bindTweenFieldEvents");
function bp(n, e) {
  var i, r, a, o, s, l, u, d, g, m;
  function t(y, p, h) {
    y.type === "timeline" ? e.mutate((b) => b.updateEntry(y.index, { sound: h })) : y.type === "branch" && e.mutate((b) => b.updateBranchEntry(y.index, y.branchIndex, y.branchEntryIndex, { sound: h }));
  }
  c(t, "applySoundPatch"), (i = n.querySelector("[data-action='change-sound-src']")) == null || i.addEventListener("change", async (y) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const h = e.getEntryAtPath(e.selectedPath);
    if (!(h != null && h.sound)) return;
    const b = y.target.value, w = { ...h.sound, src: b };
    w.id || (w.id = cc(b));
    const E = await uc(b);
    E > 0 && (w.duration = E), t(p, h, w);
  }), (r = n.querySelector("[data-action='pick-sound-src']")) == null || r.addEventListener("click", () => {
    const y = e.parseEntryPath(e.selectedPath);
    if (!y) return;
    const p = e.getEntryAtPath(e.selectedPath);
    if (!(p != null && p.sound)) return;
    new FilePicker({
      type: "audio",
      current: p.sound.src || "",
      callback: /* @__PURE__ */ c(async (b) => {
        const w = { ...p.sound, src: b };
        w.id || (w.id = cc(b));
        const E = await uc(b);
        E > 0 && (w.duration = E), t(y, p, w);
      }, "callback")
    }).render(!0);
  }), (a = n.querySelector("[data-action='change-sound-id']")) == null || a.addEventListener("change", (y) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const h = e.getEntryAtPath(e.selectedPath);
    h != null && h.sound && t(p, h, { ...h.sound, id: y.target.value || void 0 });
  }), (o = n.querySelector("[data-action='change-sound-volume']")) == null || o.addEventListener("input", (y) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const h = e.getEntryAtPath(e.selectedPath);
    h != null && h.sound && t(p, h, { ...h.sound, volume: Number(y.target.value) || 0.8 });
  }), (s = n.querySelector("[data-action='change-sound-loop']")) == null || s.addEventListener("change", (y) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const h = e.getEntryAtPath(e.selectedPath);
    h != null && h.sound && t(p, h, { ...h.sound, loop: y.target.checked });
  }), (l = n.querySelector("[data-action='change-sound-fadein']")) == null || l.addEventListener("change", (y) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const h = e.getEntryAtPath(e.selectedPath);
    h != null && h.sound && t(p, h, { ...h.sound, fadeIn: Number(y.target.value) || void 0 });
  }), (u = n.querySelector("[data-action='change-sound-fadeout']")) == null || u.addEventListener("change", (y) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const h = e.getEntryAtPath(e.selectedPath);
    h != null && h.sound && t(p, h, { ...h.sound, fadeOut: Number(y.target.value) || void 0 });
  }), (d = n.querySelector("[data-action='change-sound-duration']")) == null || d.addEventListener("change", (y) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const h = e.getEntryAtPath(e.selectedPath);
    h != null && h.sound && t(p, h, { ...h.sound, duration: Number(y.target.value) || 0 });
  }), (g = n.querySelector("[data-action='change-sound-fireandforget']")) == null || g.addEventListener("change", (y) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const h = e.getEntryAtPath(e.selectedPath);
    h != null && h.sound && t(p, h, { ...h.sound, fireAndForget: y.target.checked });
  }), (m = n.querySelector("[data-action='change-stopsound-id']")) == null || m.addEventListener("change", (y) => {
    const p = e.parseEntryPath(e.selectedPath);
    p && (p.type === "timeline" ? e.mutate((h) => h.updateEntry(p.index, { stopSound: y.target.value })) : p.type === "branch" && e.mutate((h) => h.updateBranchEntry(p.index, p.branchIndex, p.branchEntryIndex, { stopSound: y.target.value })));
  });
}
c(bp, "bindSoundFieldEvents");
function wp(n, e) {
  var t, i, r, a, o, s, l, u, d, g, m, y;
  (t = n.querySelector("[data-action='change-await-event']")) == null || t.addEventListener("change", (p) => {
    const h = e.parseEntryPath(e.selectedPath);
    if (!h) return;
    const b = e.getEntryAtPath(e.selectedPath);
    b != null && b.await && h.type === "timeline" && e.mutate((w) => w.updateEntry(h.index, { await: { ...b.await, event: p.target.value } }));
  }), (i = n.querySelector("[data-action='change-await-signal']")) == null || i.addEventListener("change", (p) => {
    const h = e.parseEntryPath(e.selectedPath);
    if (!h) return;
    const b = e.getEntryAtPath(e.selectedPath);
    b != null && b.await && h.type === "timeline" && e.mutate((w) => w.updateEntry(h.index, { await: { ...b.await, signal: p.target.value } }));
  }), (r = n.querySelector("[data-action='change-await-target']")) == null || r.addEventListener("change", (p) => {
    const h = e.parseEntryPath(e.selectedPath);
    if (!h) return;
    const b = e.getEntryAtPath(e.selectedPath);
    b != null && b.await && h.type === "timeline" && e.mutate((w) => w.updateEntry(h.index, { await: { ...b.await, target: p.target.value } }));
  }), (a = n.querySelector("[data-action='pick-await-target']")) == null || a.addEventListener("click", async () => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const h = e.getEntryAtPath(e.selectedPath);
    if (!(h != null && h.await)) return;
    const { enterPickMode: b } = await Promise.resolve().then(() => pp);
    b({
      placeableType: "Tile",
      onPick: /* @__PURE__ */ c((w) => {
        var O, M;
        const E = (M = (O = w.flags) == null ? void 0 : O.tagger) == null ? void 0 : M.tags, L = E != null && E.length ? `tag:${E[0]}` : `id:${w.id}`;
        p.type === "timeline" && e.mutate((N) => N.updateEntry(p.index, { await: { ...h.await, target: L } }));
      }, "onPick")
    });
  });
  for (const [p, h] of [["change-anim-idle", "idle"], ["change-anim-hover", "hover"], ["change-anim-dim", "dim"]])
    (o = n.querySelector(`[data-action='${p}']`)) == null || o.addEventListener("change", (b) => {
      const w = e.parseEntryPath(e.selectedPath);
      if (!w) return;
      const E = e.getEntryAtPath(e.selectedPath);
      if (!(E != null && E.await)) return;
      const L = b.target.value.trim(), O = L ? L.split(",").map((D) => D.trim()).filter(Boolean) : void 0, M = { ...E.await.animation ?? {} };
      O != null && O.length ? M[h] = O.length === 1 ? O[0] : O : delete M[h];
      const N = { ...E.await, animation: Object.keys(M).length ? M : void 0 };
      N.animation || delete N.animation, w.type === "timeline" && e.mutate((D) => D.updateEntry(w.index, { await: N }));
    });
  (s = n.querySelector("[data-action='change-emit-signal']")) == null || s.addEventListener("change", (p) => {
    const h = e.parseEntryPath(e.selectedPath);
    h && h.type === "timeline" && e.mutate((b) => b.updateEntry(h.index, { emit: p.target.value }));
  }), (l = n.querySelector("[data-action='change-transition-cinematic']")) == null || l.addEventListener("change", (p) => {
    const h = e.parseEntryPath(e.selectedPath);
    if (!h) return;
    const b = e.getEntryAtPath(e.selectedPath);
    b != null && b.transitionTo && h.type === "timeline" && e.mutate((w) => w.updateEntry(h.index, { transitionTo: { ...b.transitionTo, cinematic: p.target.value } }));
  }), (u = n.querySelector("[data-action='change-transition-scene']")) == null || u.addEventListener("change", (p) => {
    const h = e.parseEntryPath(e.selectedPath);
    if (!h) return;
    const b = e.getEntryAtPath(e.selectedPath);
    b != null && b.transitionTo && h.type === "timeline" && e.mutate((w) => w.updateEntry(h.index, { transitionTo: { ...b.transitionTo, scene: p.target.value } }));
  }), (d = n.querySelector("[data-action='change-parallel-join']")) == null || d.addEventListener("change", (p) => {
    const h = e.parseEntryPath(e.selectedPath);
    if (!h || h.type !== "timeline") return;
    const b = e.state.timeline[h.index];
    b != null && b.parallel && e.mutate((w) => w.updateEntry(h.index, { parallel: { ...b.parallel, join: p.target.value } }));
  }), (g = n.querySelector("[data-action='change-parallel-overflow']")) == null || g.addEventListener("change", (p) => {
    const h = e.parseEntryPath(e.selectedPath);
    if (!h || h.type !== "timeline") return;
    const b = e.state.timeline[h.index];
    b != null && b.parallel && e.mutate((w) => w.updateEntry(h.index, { parallel: { ...b.parallel, overflow: p.target.value } }));
  }), (m = n.querySelector("[data-action='edit-parallel-json']")) == null || m.addEventListener("click", () => {
    up({ selectedPath: e.selectedPath, state: e.state, mutate: e.mutate });
  }), (y = n.querySelector("[data-action='add-branch']")) == null || y.addEventListener("click", () => {
    const p = e.parseEntryPath(e.selectedPath);
    !p || p.type !== "timeline" || e.mutate((h) => h.addBranch(p.index));
  }), n.querySelectorAll("[data-action='remove-branch']").forEach((p) => {
    p.addEventListener("click", () => {
      const h = Number(p.dataset.branchIndex), b = e.parseEntryPath(e.selectedPath);
      !b || b.type !== "timeline" || Number.isNaN(h) || e.mutate((w) => w.removeBranch(b.index, h));
    });
  }), n.querySelectorAll("[data-action='add-branch-step']").forEach((p) => {
    p.addEventListener("click", () => {
      const h = Number(p.dataset.branchIndex), b = e.parseEntryPath(e.selectedPath);
      !b || b.type !== "timeline" || Number.isNaN(h) || e.mutate((w) => w.addBranchEntry(b.index, h, { tweens: [] }));
    });
  }), n.querySelectorAll("[data-action='add-branch-delay']").forEach((p) => {
    p.addEventListener("click", () => {
      const h = Number(p.dataset.branchIndex), b = e.parseEntryPath(e.selectedPath);
      !b || b.type !== "timeline" || Number.isNaN(h) || e.mutate((w) => w.addBranchEntry(b.index, h, { delay: 1e3 }));
    });
  }), n.querySelectorAll("[data-action='add-branch-sound']").forEach((p) => {
    p.addEventListener("click", () => {
      const h = Number(p.dataset.branchIndex), b = e.parseEntryPath(e.selectedPath);
      !b || b.type !== "timeline" || Number.isNaN(h) || e.mutate((w) => w.addBranchEntry(b.index, h, { sound: { src: "", volume: 0.8, loop: !1, duration: 0, fireAndForget: !1 } }));
    });
  }), n.querySelectorAll("[data-action='add-branch-stopSound']").forEach((p) => {
    p.addEventListener("click", () => {
      const h = Number(p.dataset.branchIndex), b = e.parseEntryPath(e.selectedPath);
      !b || b.type !== "timeline" || Number.isNaN(h) || e.mutate((w) => w.addBranchEntry(b.index, h, { stopSound: "" }));
    });
  }), n.querySelectorAll("[data-action='remove-branch-entry']").forEach((p) => {
    p.addEventListener("click", () => {
      const h = Number(p.dataset.branchIndex), b = Number(p.dataset.branchEntryIndex), w = e.parseEntryPath(e.selectedPath);
      !w || w.type !== "timeline" || Number.isNaN(h) || Number.isNaN(b) || e.mutate((E) => E.removeBranchEntry(w.index, h, b));
    });
  });
}
c(wp, "bindSpecialEntryEvents");
var Lc, xe, W, pt, bi, yt, ze, Ge, Za, Oe, We, eo, qt, wi, U, Ld, Id, Od, Ad, Ws, Js, Ks, Ys, Qs, Md, Ln, Xs, Nd, kd, $d, Dd;
const dt = class dt extends bn(yn) {
  constructor(t = {}) {
    super(t);
    I(this, U);
    I(this, xe, null);
    I(this, W, null);
    I(this, pt, null);
    I(this, bi, /* @__PURE__ */ new Set());
    I(this, yt, !1);
    I(this, ze, null);
    I(this, Ge, null);
    I(this, Za, 120);
    I(this, Oe, []);
    I(this, We, -1);
    I(this, eo, 50);
    I(this, qt, null);
    I(this, wi, null);
    S(this, xe, t.scene ?? canvas.scene ?? null), S(this, W, Gn.fromScene(f(this, xe)));
  }
  // ── Context ───────────────────────────────────────────────────────────
  async _prepareContext() {
    var o, s;
    const t = Jm(f(this, W).timeline, {
      selectedPath: f(this, pt),
      windowWidth: ((o = this.position) == null ? void 0 : o.width) ?? 1100
    }), i = f(this, pt) != null ? lp(f(this, pt), { state: f(this, W), expandedTweens: f(this, bi) }) : null, r = f(this, W).listCinematicNames(), a = f(this, W).activeCinematicName;
    return {
      // Toolbar
      sceneName: ((s = f(this, xe)) == null ? void 0 : s.name) ?? "No scene",
      dirty: f(this, yt),
      canUndo: f(this, U, Js),
      canRedo: f(this, U, Ks),
      // Cinematic selector
      cinematicNames: r,
      activeCinematicName: a,
      cinematicOptions: r.map((l) => ({
        value: l,
        label: l,
        selected: l === a
      })),
      hasMultipleCinematics: r.length > 1,
      // Swimlane
      timeMarkers: t.timeMarkers,
      mainBlocks: t.mainBlocks,
      subLanes: t.subLanes,
      signalArcs: t.signalArcs,
      fafConnectors: t.fafConnectors,
      totalWidthPx: t.totalWidthPx,
      swimlaneHeightPx: t.swimlaneHeightPx,
      insertionPoints: t.insertionPoints,
      // Detail
      detail: i,
      // Footer
      trigger: f(this, W).trigger,
      tracking: f(this, W).tracking,
      synchronized: f(this, W).synchronized,
      triggerOptions: qm.map((l) => ({
        ...l,
        selected: l.value === f(this, W).trigger
      })),
      entryCount: f(this, W).timeline.length,
      totalDuration: t.totalDurationMs,
      targetCount: Km(f(this, W)),
      setupCount: Object.keys(f(this, W).setup ?? {}).length,
      landingCount: Object.keys(f(this, W).landing ?? {}).length
    };
  }
  // ── Render & Events ───────────────────────────────────────────────────
  _onRender(t, i) {
    super._onRender(t, i), C(this, U, Ld).call(this), f(this, qt) || (S(this, qt, (r) => {
      !r.ctrlKey && !r.metaKey || (r.key === "z" && !r.shiftKey ? (r.preventDefault(), C(this, U, Ys).call(this)) : (r.key === "z" && r.shiftKey || r.key === "y") && (r.preventDefault(), C(this, U, Qs).call(this)));
    }), document.addEventListener("keydown", f(this, qt)));
  }
  async close(t = {}) {
    if (f(this, Ge) && C(this, U, Ln).call(this), f(this, yt) && !t.force) {
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
      i === "save" && await C(this, U, Xs).call(this);
    }
    return super.close(t);
  }
  async _onClose(t) {
    return f(this, ze) !== null && (clearTimeout(f(this, ze)), S(this, ze, null)), f(this, qt) && (document.removeEventListener("keydown", f(this, qt)), S(this, qt, null)), super._onClose(t);
  }
};
xe = new WeakMap(), W = new WeakMap(), pt = new WeakMap(), bi = new WeakMap(), yt = new WeakMap(), ze = new WeakMap(), Ge = new WeakMap(), Za = new WeakMap(), Oe = new WeakMap(), We = new WeakMap(), eo = new WeakMap(), qt = new WeakMap(), wi = new WeakMap(), U = new WeakSet(), // ── Event binding ─────────────────────────────────────────────────────
Ld = /* @__PURE__ */ c(function() {
  const t = this.element;
  if (!(t instanceof HTMLElement)) return;
  const i = C(this, U, Id).call(this);
  dp(t, i), fp(t, i), hp(t, i), gp(t, i), yp(t, i), bp(t, i), wp(t, i);
}, "#bindEvents"), Id = /* @__PURE__ */ c(function() {
  const t = this;
  return {
    // State access (read-only getters — closures over `self` for private field access)
    get state() {
      return f(t, W);
    },
    get selectedPath() {
      return f(t, pt);
    },
    get scene() {
      return f(t, xe);
    },
    get expandedTweens() {
      return f(t, bi);
    },
    get insertMenuState() {
      return f(t, wi);
    },
    // Mutations
    mutate: /* @__PURE__ */ c((i) => C(this, U, Ws).call(this, i), "mutate"),
    setSelectedPath: /* @__PURE__ */ c((i) => {
      S(this, pt, i), this.render({ force: !0 });
    }, "setSelectedPath"),
    render: /* @__PURE__ */ c(() => this.render({ force: !0 }), "render"),
    // Cinematic switching (needs full state swap + clear)
    switchCinematic: /* @__PURE__ */ c((i) => {
      f(this, Ge) && C(this, U, Ln).call(this), S(this, W, f(this, W).switchCinematic(i)), S(this, pt, null), f(this, bi).clear(), this.render({ force: !0 });
    }, "switchCinematic"),
    // Tween debouncing
    queueTweenChange: /* @__PURE__ */ c((i, r) => C(this, U, Md).call(this, i, r), "queueTweenChange"),
    flushTweenChanges: /* @__PURE__ */ c(() => {
      f(this, Ge) && C(this, U, Ln).call(this);
    }, "flushTweenChanges"),
    flushTweenChangesImmediate: /* @__PURE__ */ c(() => {
      f(this, ze) !== null && clearTimeout(f(this, ze)), S(this, ze, null), C(this, U, Ln).call(this);
    }, "flushTweenChangesImmediate"),
    // Path utilities
    parseEntryPath: gn,
    getEntryAtPath: /* @__PURE__ */ c((i) => ba(i, f(this, W)), "getEntryAtPath"),
    // Insert menu
    showInsertMenu: /* @__PURE__ */ c((i, r, a) => C(this, U, Od).call(this, i, r, a), "showInsertMenu"),
    hideInsertMenu: /* @__PURE__ */ c(() => C(this, U, Ad).call(this), "hideInsertMenu"),
    // Toolbar actions
    save: /* @__PURE__ */ c(() => C(this, U, Xs).call(this), "save"),
    play: /* @__PURE__ */ c(() => C(this, U, Nd).call(this), "play"),
    resetTracking: /* @__PURE__ */ c(() => C(this, U, kd).call(this), "resetTracking"),
    exportJSON: /* @__PURE__ */ c(() => C(this, U, $d).call(this), "exportJSON"),
    validate: /* @__PURE__ */ c(() => C(this, U, Dd).call(this), "validate"),
    importJSON: /* @__PURE__ */ c(() => cp({ state: f(this, W), mutate: /* @__PURE__ */ c((i) => C(this, U, Ws).call(this, i), "mutate") }), "importJSON"),
    undo: /* @__PURE__ */ c(() => C(this, U, Ys).call(this), "undo"),
    redo: /* @__PURE__ */ c(() => C(this, U, Qs).call(this), "redo")
  };
}, "#createEventContext"), // ── Insert menu ───────────────────────────────────────────────────────
Od = /* @__PURE__ */ c(function(t, i, r) {
  var l;
  const a = (l = this.element) == null ? void 0 : l.querySelector(".cinematic-editor__insert-menu");
  if (!a) return;
  const o = t.getBoundingClientRect();
  document.body.appendChild(a), a.style.display = "", a.style.position = "fixed", a.style.left = `${o.left}px`;
  const s = a.offsetHeight || 200;
  o.bottom + 4 + s > window.innerHeight ? a.style.top = `${o.top - s - 4}px` : a.style.top = `${o.bottom + 4}px`, S(this, wi, { insertIndex: i, lane: r });
}, "#showInsertMenu"), Ad = /* @__PURE__ */ c(function() {
  var i, r;
  const t = document.body.querySelector(".cinematic-editor__insert-menu") ?? ((i = this.element) == null ? void 0 : i.querySelector(".cinematic-editor__insert-menu"));
  if (t) {
    t.style.display = "none";
    const a = (r = this.element) == null ? void 0 : r.querySelector(".cinematic-editor");
    a && t.parentNode !== a && a.appendChild(t);
  }
  S(this, wi, null);
}, "#hideInsertMenu"), // ── State mutation ────────────────────────────────────────────────────
Ws = /* @__PURE__ */ c(function(t) {
  S(this, Oe, f(this, Oe).slice(0, f(this, We) + 1)), f(this, Oe).push(f(this, W)), f(this, Oe).length > f(this, eo) && f(this, Oe).shift(), S(this, We, f(this, Oe).length - 1), S(this, W, t(f(this, W))), S(this, yt, !0), this.render({ force: !0 });
}, "#mutate"), Js = /* @__PURE__ */ c(function() {
  return f(this, We) >= 0;
}, "#canUndo"), Ks = /* @__PURE__ */ c(function() {
  return f(this, We) < f(this, Oe).length - 1;
}, "#canRedo"), Ys = /* @__PURE__ */ c(function() {
  f(this, U, Js) && (f(this, We) === f(this, Oe).length - 1 && f(this, Oe).push(f(this, W)), S(this, W, f(this, Oe)[f(this, We)]), Eo(this, We)._--, S(this, yt, !0), this.render({ force: !0 }));
}, "#undo"), Qs = /* @__PURE__ */ c(function() {
  f(this, U, Ks) && (Eo(this, We)._++, S(this, W, f(this, Oe)[f(this, We) + 1]), S(this, yt, !0), this.render({ force: !0 }));
}, "#redo"), Md = /* @__PURE__ */ c(function(t, i) {
  var r;
  f(this, pt) != null && (S(this, Ge, {
    ...f(this, Ge) ?? {},
    entryPath: f(this, pt),
    tweenIndex: t,
    patch: { ...((r = f(this, Ge)) == null ? void 0 : r.patch) ?? {}, ...i }
  }), f(this, ze) !== null && clearTimeout(f(this, ze)), S(this, ze, setTimeout(() => {
    S(this, ze, null), C(this, U, Ln).call(this);
  }, f(this, Za))));
}, "#queueTweenChange"), Ln = /* @__PURE__ */ c(function() {
  if (!f(this, Ge)) return;
  const { entryPath: t, tweenIndex: i, patch: r } = f(this, Ge);
  S(this, Ge, null);
  const a = gn(t);
  if (a) {
    if (a.type === "timeline")
      S(this, W, f(this, W).updateTween(a.index, i, r));
    else if (a.type === "branch") {
      const o = ba(t, f(this, W));
      if (o) {
        const s = (o.tweens ?? []).map((l, u) => u === i ? { ...l, ...r } : l);
        S(this, W, f(this, W).updateBranchEntry(a.index, a.branchIndex, a.branchEntryIndex, { tweens: s }));
      }
    }
    S(this, yt, !0);
  }
}, "#flushTweenChanges"), Xs = /* @__PURE__ */ c(async function() {
  var t, i, r, a, o, s;
  if (f(this, xe)) {
    if (f(this, Ge) && C(this, U, Ln).call(this), f(this, W).isStale(f(this, xe))) {
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
        S(this, W, Gn.fromScene(f(this, xe), f(this, W).activeCinematicName)), S(this, yt, !1), S(this, Oe, []), S(this, We, -1), this.render({ force: !0 }), (i = (t = ui.notifications) == null ? void 0 : t.info) == null || i.call(t, "Cinematic reloaded from scene.");
        return;
      }
      if (!l) return;
    }
    try {
      await f(this, W).save(f(this, xe)), S(this, W, Gn.fromScene(f(this, xe), f(this, W).activeCinematicName)), S(this, yt, !1), (a = (r = ui.notifications) == null ? void 0 : r.info) == null || a.call(r, "Cinematic saved."), this.render({ force: !0 });
    } catch (l) {
      console.error(`${T} | Cinematic save failed`, l), (s = (o = ui.notifications) == null ? void 0 : o.error) == null || s.call(o, "Failed to save cinematic data.");
    }
  }
}, "#onSave"), Nd = /* @__PURE__ */ c(async function() {
  var i, r, a, o, s;
  const t = (r = (i = game.modules.get(T)) == null ? void 0 : i.api) == null ? void 0 : r.cinematic;
  if (!(t != null && t.play)) {
    (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, "Cinematic API not available.");
    return;
  }
  await t.play((s = f(this, xe)) == null ? void 0 : s.id, f(this, W).activeCinematicName);
}, "#onPlay"), kd = /* @__PURE__ */ c(async function() {
  var i, r, a, o, s;
  const t = (r = (i = game.modules.get(T)) == null ? void 0 : i.api) == null ? void 0 : r.cinematic;
  t != null && t.reset && (await t.reset((a = f(this, xe)) == null ? void 0 : a.id, f(this, W).activeCinematicName), (s = (o = ui.notifications) == null ? void 0 : o.info) == null || s.call(o, "Cinematic tracking reset."));
}, "#onResetTracking"), $d = /* @__PURE__ */ c(async function() {
  var i, r;
  const t = JSON.stringify(f(this, W).toJSON(), null, 2);
  try {
    await navigator.clipboard.writeText(t), (r = (i = ui.notifications) == null ? void 0 : i.info) == null || r.call(i, "Cinematic JSON copied to clipboard.");
  } catch {
    new Dialog({
      title: "Cinematic JSON",
      content: `<textarea style="width:100%;height:300px;font-family:monospace;font-size:0.8rem">${bt(t)}</textarea>`,
      buttons: { ok: { label: "Close" } }
    }).render(!0);
  }
}, "#onExportJSON"), Dd = /* @__PURE__ */ c(function() {
  var l, u;
  const t = f(this, W).toJSON(), { targets: i, unresolved: r } = pa(t), a = Hm(t, i), o = [
    ...r.map((d) => ({ path: "targets", level: "warn", message: `Unresolved target: "${d}"` })),
    ...a
  ];
  if (o.length === 0) {
    (u = (l = ui.notifications) == null ? void 0 : l.info) == null || u.call(l, "Cinematic validation passed — no issues found.");
    return;
  }
  const s = o.map((d) => {
    const g = d.level === "error" ? "fa-circle-xmark" : "fa-triangle-exclamation", m = d.level === "error" ? "#e74c3c" : "#f39c12";
    return `<li style="margin:0.3rem 0"><i class="fa-solid ${g}" style="color:${m};margin-right:0.3rem"></i><strong>${bt(d.path)}</strong>: ${bt(d.message)}</li>`;
  });
  new Dialog({
    title: "Cinematic Validation",
    content: `<p>${o.length} issue(s) found:</p><ul style="list-style:none;padding:0;max-height:300px;overflow:auto">${s.join("")}</ul>`,
    buttons: { ok: { label: "Close" } }
  }).render(!0);
}, "#onValidate"), c(dt, "CinematicEditorApplication"), pe(dt, "APP_ID", `${T}-cinematic-editor`), pe(dt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  Ne(dt, dt, "DEFAULT_OPTIONS"),
  {
    id: dt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Lc = Ne(dt, dt, "DEFAULT_OPTIONS")) == null ? void 0 : Lc.classes) ?? [], "eidolon-cinematic-editor-window", "themed"])
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
)), pe(dt, "PARTS", {
  content: {
    template: `modules/${T}/templates/cinematic-editor.html`
  }
});
let Gs = dt;
const Fd = /* @__PURE__ */ new Map();
function Oi(n, e) {
  Fd.set(n, e);
}
c(Oi, "registerBehaviour");
function Pd(n) {
  return Fd.get(n);
}
c(Pd, "getBehaviour");
Oi("float", (n, e = {}) => {
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
Oi("pulse", (n, e = {}) => {
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
Oi("scale", (n, e = {}) => {
  const t = n.mesh;
  if (!t) return { update() {
  }, detach() {
  } };
  const i = e.factor ?? 1.12, r = e.durationFrames ?? 15, a = wr(e.easing ?? "easeOutCubic"), o = t.scale.x, s = t.scale.y, l = o * i, u = s * i;
  let d = 0;
  return {
    update(g) {
      if (d < r) {
        d += g;
        const m = Math.min(d / r, 1), y = a(m);
        t.scale.x = o + (l - o) * y, t.scale.y = s + (u - s) * y;
      }
    },
    detach() {
      t.scale.x = o, t.scale.y = s;
    }
  };
});
Oi("glow", (n, e = {}) => {
  var m, y;
  const t = n.mesh;
  if (!((m = t == null ? void 0 : t.texture) != null && m.baseTexture)) return { update() {
  }, detach() {
  } };
  const i = e.color ?? 4513279, r = e.alpha ?? 0.5, a = e.blur ?? 8, o = e.pulseSpeed ?? 0.03, s = PIXI.Sprite.from(t.texture);
  s.anchor.set(t.anchor.x, t.anchor.y), s.width = t.width, s.height = t.height, s.position.copyFrom(t.position), s.angle = t.angle, s.alpha = r, s.tint = i;
  const l = PIXI.BlurFilter ?? ((y = PIXI.filters) == null ? void 0 : y.BlurFilter), u = new l(a);
  s.filters = [u];
  const d = n.children.indexOf(t);
  d > 0 ? n.addChildAt(s, d) : n.addChildAt(s, 0);
  let g = 0;
  return {
    update(p) {
      g += p;
      const h = (Math.sin(g * o) + 1) / 2;
      s.alpha = r * (0.5 + 0.5 * h);
    },
    detach() {
      s.parent && s.parent.removeChild(s), s.destroy({ children: !0 });
    }
  };
});
Oi("none", () => ({ update() {
}, detach() {
} }));
const Dr = {
  idle: ["float", "glow"],
  hover: ["scale"],
  dim: ["none"]
};
function vp(n) {
  if (!n) return { ...Dr };
  const e = /* @__PURE__ */ c((t, i) => t === void 0 ? i : typeof t == "string" ? [t] : typeof t == "object" && !Array.isArray(t) && t.name ? [t] : Array.isArray(t) ? t : i, "normalize");
  return {
    idle: e(n.idle, Dr.idle),
    hover: e(n.hover, Dr.hover),
    dim: e(n.dim, Dr.dim)
  };
}
c(vp, "normalizeConfig");
var fr, vi, Ei, Bn, on, pn, Zs, el;
const Ll = class Ll {
  /**
   * @param {PlaceableObject} placeable
   * @param {object|undefined} animationConfig  Raw animation config from the await entry
   */
  constructor(e, t) {
    I(this, pn);
    I(this, fr);
    I(this, vi);
    I(this, Ei, null);
    I(this, Bn, []);
    I(this, on, null);
    S(this, fr, e), S(this, vi, vp(t));
  }
  /** Current animation state name. */
  get state() {
    return f(this, Ei);
  }
  /**
   * Start animating in the given state.
   * @param {string} [state="idle"]
   */
  start(e = "idle") {
    C(this, pn, Zs).call(this, e), S(this, on, (t) => {
      for (const i of f(this, Bn)) i.update(t);
    }), canvas.app.ticker.add(f(this, on));
  }
  /**
   * Transition to a new state. Detaches current behaviours, attaches new ones.
   * No-op if already in the requested state.
   * @param {string} state
   */
  setState(e) {
    e !== f(this, Ei) && (C(this, pn, el).call(this), C(this, pn, Zs).call(this, e));
  }
  /**
   * Full cleanup — detach all behaviours and remove ticker.
   */
  detach() {
    var e, t;
    C(this, pn, el).call(this), f(this, on) && ((t = (e = canvas.app) == null ? void 0 : e.ticker) == null || t.remove(f(this, on)), S(this, on, null));
  }
};
fr = new WeakMap(), vi = new WeakMap(), Ei = new WeakMap(), Bn = new WeakMap(), on = new WeakMap(), pn = new WeakSet(), // ── Private ──────────────────────────────────────────────────────────
Zs = /* @__PURE__ */ c(function(e) {
  S(this, Ei, e);
  const t = f(this, vi)[e] ?? f(this, vi).idle ?? ["none"];
  for (const i of t) {
    const r = typeof i == "string" ? i : i.name, a = typeof i == "string" ? void 0 : i, o = Pd(r);
    if (!o) {
      console.warn(`TileAnimator: unknown behaviour "${r}"`);
      continue;
    }
    f(this, Bn).push(o(f(this, fr), a));
  }
}, "#attachBehaviours"), el = /* @__PURE__ */ c(function() {
  for (const e of f(this, Bn)) e.detach();
  S(this, Bn, []);
}, "#detachBehaviours"), c(Ll, "TileAnimator");
let Ca = Ll;
const Ep = "cinematic", Ho = 3;
let ge = null, Nn = null, kn = null, ei = 0, On = null;
function wl(n, e = "default") {
  return `cinematic-progress-${n}-${e}`;
}
c(wl, "progressFlagKey");
let Yr = 0;
function Tp(n, e, t) {
  Yr++, !(Yr < 3) && (Yr = 0, game.user.setFlag(T, wl(n, e), {
    step: t,
    timestamp: Date.now()
  }).catch(() => {
  }));
}
c(Tp, "saveProgress");
function Qr(n, e = "default") {
  Yr = 0, game.user.unsetFlag(T, wl(n, e)).catch(() => {
  });
}
c(Qr, "clearProgress");
function _d(n, e = "default", t = 3e5) {
  const i = game.user.getFlag(T, wl(n, e));
  return !i || typeof i.step != "number" || typeof i.timestamp != "number" || Date.now() - i.timestamp > t ? null : i;
}
c(_d, "getSavedProgress");
function Ai(n, e = "default") {
  return `cinematic-seen-${n}-${e}`;
}
c(Ai, "seenFlagKey");
function yc(n, e = "default") {
  return !!game.user.getFlag(T, Ai(n, e));
}
c(yc, "hasSeenCinematic");
function Cp(n, e) {
  var t;
  return n == null ? null : typeof n != "object" || Array.isArray(n) ? (console.warn(`[${T}] Cinematic: invalid data for ${e} (expected object). Ignoring.`), null) : n.trigger !== void 0 && typeof n.trigger != "string" ? (console.warn(`[${T}] Cinematic: invalid 'trigger' on ${e} (expected string). Ignoring.`), null) : n.tracking !== void 0 && typeof n.tracking != "boolean" ? (console.warn(`[${T}] Cinematic: invalid 'tracking' on ${e} (expected boolean). Ignoring.`), null) : n.synchronized !== void 0 && typeof n.synchronized != "boolean" ? (console.warn(`[${T}] Cinematic: invalid 'synchronized' on ${e} (expected boolean). Ignoring.`), null) : n.setup !== void 0 && (typeof n.setup != "object" || n.setup === null || Array.isArray(n.setup)) ? (console.warn(`[${T}] Cinematic: invalid 'setup' on ${e} (expected object). Ignoring.`), null) : n.landing !== void 0 && (typeof n.landing != "object" || n.landing === null || Array.isArray(n.landing)) ? (console.warn(`[${T}] Cinematic: invalid 'landing' on ${e} (expected object). Ignoring.`), null) : n.timeline !== void 0 && !Array.isArray(n.timeline) ? (console.warn(`[${T}] Cinematic: invalid 'timeline' on ${e} (expected array). Ignoring.`), null) : ((t = n.timeline) != null && t.length && (n.timeline = n.timeline.filter((i, r) => !i || typeof i != "object" || Array.isArray(i) ? (console.warn(`[${T}] Cinematic: timeline[${r}] on ${e} is not a valid object, removing.`), !1) : !0)), n);
}
c(Cp, "validateSingleCinematic");
function bo(n) {
  const e = n ? game.scenes.get(n) : canvas.scene;
  let t = (e == null ? void 0 : e.getFlag(T, Ep)) ?? null;
  if (t == null) return null;
  if (typeof t != "object" || Array.isArray(t))
    return console.warn(`[${T}] Cinematic: invalid flag data on scene ${e == null ? void 0 : e.id} (expected object). Ignoring.`), null;
  if ((t.version ?? 1) < 3) {
    const { version: i, ...r } = t;
    t = { version: Ho, cinematics: { default: r } };
  }
  if (t.version > Ho)
    return console.warn(`[${T}] Cinematic: scene ${e == null ? void 0 : e.id} has version ${t.version}, runtime supports up to ${Ho}. Skipping.`), null;
  if (!t.cinematics || typeof t.cinematics != "object")
    return console.warn(`[${T}] Cinematic: no 'cinematics' map on scene ${e == null ? void 0 : e.id}. Ignoring.`), null;
  for (const [i, r] of Object.entries(t.cinematics)) {
    const a = Cp(r, `scene ${e == null ? void 0 : e.id} cinematic "${i}"`);
    a ? t.cinematics[i] = a : delete t.cinematics[i];
  }
  return Object.keys(t.cinematics).length === 0 ? null : t;
}
c(bo, "getCinematicData");
function Sa(n, e = "default") {
  var i;
  const t = bo(n);
  return ((i = t == null ? void 0 : t.cinematics) == null ? void 0 : i[e]) ?? null;
}
c(Sa, "getNamedCinematic");
function Sp(n) {
  const e = bo(n);
  return e ? Object.keys(e.cinematics) : [];
}
c(Sp, "listCinematicNames");
function Lp() {
  return game.ready ? Promise.resolve() : new Promise((n) => Hooks.once("ready", n));
}
c(Lp, "waitForReady");
async function Ip(n = 1e4) {
  var t, i;
  const e = (i = (t = game.modules.get(T)) == null ? void 0 : t.api) == null ? void 0 : i.tween;
  return e != null && e.Timeline ? e.Timeline : new Promise((r) => {
    const a = Date.now(), o = setTimeout(() => {
      var l, u;
      (u = (l = ui.notifications) == null ? void 0 : l.info) == null || u.call(l, `[${T}] Cinematic: waiting for tween engine...`);
    }, 2e3), s = setInterval(() => {
      var u, d, g, m;
      const l = (d = (u = game.modules.get(T)) == null ? void 0 : u.api) == null ? void 0 : d.tween;
      l != null && l.Timeline ? (clearInterval(s), clearTimeout(o), r(l.Timeline)) : Date.now() - a > n && (clearInterval(s), clearTimeout(o), console.warn(`[${T}] Cinematic: tween API not available after ${n}ms.`), (m = (g = ui.notifications) == null ? void 0 : g.warn) == null || m.call(g, `[${T}] Cinematic: tween engine unavailable — cinematic cannot play.`), r(null));
    }, 200);
  });
}
c(Ip, "waitForTweenAPI");
async function tl(n = 5e3) {
  var e;
  return window.Tagger ?? ((e = game.modules.get("tagger")) == null ? void 0 : e.api) ? !0 : new Promise((t) => {
    const i = Date.now(), r = setInterval(() => {
      var a;
      window.Tagger ?? ((a = game.modules.get("tagger")) == null ? void 0 : a.api) ? (clearInterval(r), t(!0)) : Date.now() - i > n && (clearInterval(r), console.warn(`[${T}] Cinematic: Tagger API not available after ${n}ms.`), t(!1));
    }, 200);
  });
}
c(tl, "waitForTagger");
async function gi(n, e = "default", t = null) {
  var h, b, w, E, L;
  const i = n ?? ((h = canvas.scene) == null ? void 0 : h.id);
  if (!i) return;
  const r = `${i}:${e}`;
  if (t || (t = /* @__PURE__ */ new Set()), t.has(r)) {
    console.warn(`[${T}] Cinematic: circular transition detected at "${r}". Stopping chain.`), (w = (b = ui.notifications) == null ? void 0 : b.warn) == null || w.call(b, "Cinematic: circular transition detected, stopping.");
    return;
  }
  t.add(r), (ge == null ? void 0 : ge.status) === "running" && ge.cancel("replaced"), ge = null;
  const a = Sa(i, e);
  if (!a) {
    console.warn(`[${T}] Cinematic: no cinematic "${e}" on scene ${i}.`);
    return;
  }
  const o = await Ip();
  if (!o || ((E = canvas.scene) == null ? void 0 : E.id) !== i || (await tl(), ((L = canvas.scene) == null ? void 0 : L.id) !== i)) return;
  const { targets: s, unresolved: l } = pa(a);
  if (console.log(`[${T}] Cinematic "${e}": resolved ${s.size} targets:`, [...s.entries()].map(([O, M]) => {
    var N, D;
    return `${O} → ${((N = M == null ? void 0 : M.document) == null ? void 0 : N.uuid) ?? ((D = M == null ? void 0 : M.constructor) == null ? void 0 : D.name) ?? "?"}`;
  })), l.length && console.warn(`[${T}] Cinematic "${e}": skipping ${l.length} unresolved: ${l.join(", ")}`), s.size === 0) {
    console.warn(`[${T}] Cinematic "${e}": no targets could be resolved on scene ${i}.`);
    return;
  }
  const u = km(a);
  Nn = Nm(u, s), kn = s;
  const d = _d(i, e), g = d ? d.step : void 0;
  g != null && console.log(`[${T}] Cinematic "${e}": resuming from step ${g} (saved ${Date.now() - d.timestamp}ms ago)`);
  const { tl: m, transitionTo: y } = Rm(a, s, o, {
    skipToStep: g,
    onStepComplete: /* @__PURE__ */ c((O) => Tp(i, e, O), "onStepComplete"),
    timelineName: `cinematic-${i}-${e}`
  });
  console.log(`[${T}] Cinematic "${e}": timeline built, JSON:`, JSON.stringify(m.toJSON())), m.onComplete(async () => {
    if (ge = null, Nn = null, kn = null, Qr(i, e), xo(), a.landing)
      try {
        Je(a.landing, s), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
      } catch (O) {
        console.error(`[${T}] Cinematic "${e}": error applying landing state on complete for scene ${i}:`, O);
      }
    if (a.tracking !== !1 && await game.user.setFlag(T, Ai(i, e), !0), console.log(`[${T}] Cinematic "${e}" complete on scene ${i}.`), y) {
      const O = y.cinematic, M = y.scene;
      if (!O)
        console.warn(`[${T}] Cinematic "${e}": transitionTo has no cinematic name, ignoring.`);
      else if (!M || M === i)
        console.log(`[${T}] Cinematic "${e}": transitioning to "${O}" on same scene.`), gi(i, O, t);
      else {
        console.log(`[${T}] Cinematic "${e}": transitioning to "${O}" on scene ${M}.`), On = { sceneId: M, cinematicName: O, visitedChain: t };
        const N = game.scenes.get(M);
        N ? N.view() : (console.warn(`[${T}] Cinematic: cross-scene transition target scene "${M}" not found.`), On = null);
      }
    }
  }), m.onCancel(() => {
    if (ge = null, Nn = null, kn = null, Qr(i, e), xo(), console.log(`[${T}] Cinematic "${e}" cancelled on scene ${i}.`), a.landing)
      try {
        Je(a.landing, s), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
      } catch (O) {
        console.error(`[${T}] Cinematic "${e}": error applying landing state after cancel on scene ${i}:`, O);
      }
  }), m.onError((O) => {
    if (ge = null, Nn = null, kn = null, Qr(i, e), xo(), console.error(`[${T}] Cinematic "${e}" error on scene ${i}:`, O), a.landing)
      try {
        Je(a.landing, s), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
      } catch (M) {
        console.error(`[${T}] Cinematic "${e}": error applying landing state after error on scene ${i}:`, M);
      }
  });
  const p = a.synchronized === !0 && game.user.isGM;
  ge = m.run({
    broadcast: p,
    commit: p
  }), console.log(`[${T}] Cinematic "${e}": timeline started, handle status: ${ge.status}`);
}
c(gi, "playCinematic");
async function Op(n, e = "default") {
  var i;
  const t = n ?? ((i = canvas.scene) == null ? void 0 : i.id);
  t && (await game.user.unsetFlag(T, Ai(t, e)), console.log(`[${T}] Cinematic: cleared seen flag for "${e}" on scene ${t}.`));
}
c(Op, "resetCinematic");
async function Ap(n, e, t = "default") {
  var a;
  if (!game.user.isGM) return;
  const i = n ?? ((a = canvas.scene) == null ? void 0 : a.id);
  if (!i || !e) return;
  const r = game.users.get(e);
  r && (await r.unsetFlag(T, Ai(i, t)), console.log(`[${T}] Cinematic: cleared seen flag for user ${r.name} on "${t}" scene ${i}.`));
}
c(Ap, "resetCinematicForUser");
async function Mp(n, e = "default") {
  var a;
  if (!game.user.isGM) return;
  const t = n ?? ((a = canvas.scene) == null ? void 0 : a.id);
  if (!t) return;
  const i = Ai(t, e), r = game.users.map((o) => o.getFlag(T, i) ? o.unsetFlag(T, i) : Promise.resolve());
  await Promise.all(r), console.log(`[${T}] Cinematic: cleared seen flag for all users on "${e}" scene ${t}.`);
}
c(Mp, "resetCinematicForAll");
function Np(n, e = "default") {
  var r;
  const t = n ?? ((r = canvas.scene) == null ? void 0 : r.id);
  if (!t) return [];
  const i = Ai(t, e);
  return game.users.map((a) => ({
    userId: a.id,
    name: a.name,
    color: a.color ?? "#888888",
    isGM: a.isGM,
    seen: !!a.getFlag(T, i)
  }));
}
c(Np, "getSeenStatus");
function kp(n, e) {
  var i;
  const t = n ?? ((i = canvas.scene) == null ? void 0 : i.id);
  return e ? Sa(t, e) != null : bo(t) != null;
}
c(kp, "hasCinematic");
function $p() {
  if (!Nn || !kn) {
    console.warn(`[${T}] Cinematic: no snapshot available for revert.`);
    return;
  }
  (ge == null ? void 0 : ge.status) === "running" && ge.cancel("reverted"), ge = null;
  try {
    Je(Nn, kn), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 }), console.log(`[${T}] Cinematic: reverted to pre-cinematic state.`);
  } catch (n) {
    console.error(`[${T}] Cinematic: error during revert:`, n);
  }
  Nn = null, kn = null;
}
c($p, "revertCinematic");
async function Dp() {
  const n = ++ei;
  if (console.log(`[${T}] Cinematic: canvasReady fired, gen=${n}, game.ready=${game.ready}`), await Lp(), n !== ei) return;
  console.log(`[${T}] Cinematic: game is ready`);
  const e = canvas.scene;
  if (!e) {
    console.log(`[${T}] Cinematic: no canvas.scene, exiting`);
    return;
  }
  if (On && On.sceneId === e.id) {
    const a = On;
    On = null, console.log(`[${T}] Cinematic: picking up pending transition to "${a.cinematicName}" on scene ${e.id}`);
    try {
      await gi(e.id, a.cinematicName, a.visitedChain);
    } catch (o) {
      console.error(`[${T}] Cinematic: error during pending transition playback on scene ${e.id}:`, o);
    }
    return;
  }
  On = null;
  const t = bo(e.id);
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
    const o = _d(e.id, a);
    if (n !== ei) return;
    if (o) {
      console.log(`[${T}] Cinematic "${a}": found saved progress at step ${o.step}, resuming...`);
      try {
        await gi(e.id, a);
      } catch (s) {
        console.error(`[${T}] Cinematic "${a}": error during resumed playback on scene ${e.id}:`, s);
      }
      return;
    }
  }
  let r = null;
  for (const { name: a, data: o } of i)
    if (!(o.tracking !== !1 && yc(e.id, a))) {
      r = { name: a, data: o };
      break;
    }
  if (!r) {
    if (console.log(`[${T}] Cinematic: all canvasReady cinematics already seen on scene ${e.id}`), Fp(e.id, i), (ge == null ? void 0 : ge.status) === "running" && ge.cancel("already-seen"), ge = null, await tl(), n !== ei) return;
    for (const { name: a, data: o } of i)
      if (o.landing)
        try {
          const { targets: s } = pa(o);
          Je(o.landing, s);
        } catch (s) {
          console.error(`[${T}] Cinematic "${a}": error applying landing state (already seen) on scene ${e.id}:`, s);
        }
    canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    return;
  }
  if (n === ei && (console.log(`[${T}] Cinematic: playing first unseen cinematic "${r.name}"...`), await tl(), n === ei)) {
    for (const { name: a, data: o } of i) {
      if (a === r.name) continue;
      if (o.tracking !== !1 && yc(e.id, a) && o.landing)
        try {
          const { targets: l } = pa(o);
          Je(o.landing, l);
        } catch (l) {
          console.error(`[${T}] Cinematic "${a}": error applying landing state (already seen) on scene ${e.id}:`, l);
        }
    }
    try {
      await gi(e.id, r.name);
    } catch (a) {
      console.error(`[${T}] Cinematic "${r.name}": error during playback on scene ${e.id}:`, a);
    }
  }
}
c(Dp, "onCanvasReady");
function Fp(n, e) {
  for (const { name: t } of e)
    Qr(n, t);
}
c(Fp, "clearAllCanvasReadyProgress");
function Pp(n = 3e5) {
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
c(Pp, "cleanupStaleProgressFlags");
function _p() {
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
        new Gs({ scene: canvas.scene }).render(!0);
      }, "onClick")
    };
    Array.isArray(i) ? i.push(a) : i instanceof Map ? i.set(r, a) : i && typeof i == "object" ? i[r] = a : t.tools = [a];
  });
}
c(_p, "registerEditorButton");
function xp() {
  Hooks.on("canvasReady", Dp), _p(), Hooks.once("ready", () => {
    Pp();
    const n = game.modules.get(T);
    n.api || (n.api = {}), n.api.cinematic = {
      play: gi,
      reset: Op,
      resetForUser: Ap,
      resetForAll: Mp,
      getSeenStatus: Np,
      has: kp,
      get: Sa,
      list: Sp,
      revert: $p,
      TileAnimator: Ca,
      registerBehaviour: Oi,
      getBehaviour: Pd,
      trigger: /* @__PURE__ */ c(async (e, t, i = "default") => {
        var o;
        const r = t ?? ((o = canvas.scene) == null ? void 0 : o.id);
        if (!r) return;
        const a = Sa(r, i);
        a && (a.trigger && a.trigger !== e || await gi(r, i));
      }, "trigger")
    }, console.log(`[${T}] Cinematic API registered (v3).`);
  });
}
c(xp, "registerCinematicHooks");
function bc(n, e) {
  const t = Math.abs(n.width), i = Math.abs(n.height), r = t / 2, a = i / 2;
  let o = e.x - (n.x + r), s = e.y - (n.y + a);
  if (n.rotation !== 0) {
    const l = Math.toRadians(n.rotation), u = Math.cos(l), d = Math.sin(l), g = u * o + d * s, m = u * s - d * o;
    o = g, s = m;
  }
  return o += r, s += a, o >= 0 && o <= t && s >= 0 && s <= i;
}
c(bc, "pointWithinTile");
go("tile-click", (n, e) => n.target ? new Promise((t, i) => {
  var y;
  if (e.signal.aborted) return i(e.signal.reason ?? "aborted");
  const r = po(n.target);
  if (!((y = r == null ? void 0 : r.placeables) != null && y.length))
    return i(new Error(`await tile-click: no placeables found for "${n.target}"`));
  const a = r.placeables, o = [];
  for (const { placeable: p } of a) {
    const h = new Ca(p, n.animation);
    h.start("idle"), o.push({ placeable: p, animator: h });
  }
  const s = document.getElementById("board");
  let l = null;
  const u = /* @__PURE__ */ c((p) => {
    const h = canvas.activeLayer;
    if (!h) return;
    const b = h.toLocal(p);
    if (!b || isNaN(b.x) || isNaN(b.y)) return;
    let w = !1;
    for (const { placeable: E, animator: L } of o)
      bc(E.document, b) ? (w = !0, L.state !== "hover" && L.setState("hover")) : L.state === "hover" && L.setState("idle");
    w ? l === null && (l = document.body.style.cursor, document.body.style.cursor = "pointer") : l !== null && (document.body.style.cursor = l, l = null);
  }, "onPointerMove");
  s == null || s.addEventListener("pointermove", u);
  const d = /* @__PURE__ */ c((p) => {
    if (p.button !== 0) return;
    const h = canvas.activeLayer;
    if (!h) return;
    const b = h.toLocal(p);
    isNaN(b.x) || isNaN(b.y) || !a.filter(({ doc: E }) => bc(E, b)).sort((E, L) => (L.doc.sort ?? 0) - (E.doc.sort ?? 0))[0] || (p.stopPropagation(), p.preventDefault(), m(), t());
  }, "onPointerDown");
  s == null || s.addEventListener("pointerdown", d, { capture: !0 });
  const g = /* @__PURE__ */ c(() => {
    m(), i(e.signal.reason ?? "aborted");
  }, "onAbort");
  e.signal.addEventListener("abort", g, { once: !0 });
  function m() {
    s == null || s.removeEventListener("pointerdown", d, { capture: !0 }), s == null || s.removeEventListener("pointermove", u), e.signal.removeEventListener("abort", g);
    for (const { animator: p } of o)
      p.detach();
    l !== null ? (document.body.style.cursor = l, l = null) : document.body.style.cursor = "";
  }
  c(m, "cleanup");
}) : Promise.reject(new Error('await tile-click: "target" is required')));
xp();
function Rp() {
  Hooks.once("ready", () => {
    const n = game.modules.get(T);
    n.api || (n.api = {}), n.api.picker = {
      /** Open the picker window. Returns Promise<string[] | null>. */
      open: /* @__PURE__ */ c((e) => Ta.open(e), "open"),
      /** Resolve a selector string to documents. */
      resolveSelector: po,
      /** Parse a selector string into { type, value }. */
      parseSelector: bl,
      /** Build a selector string from { type, value }. */
      buildSelector: Lm,
      /** Build a tag selector from tags array + mode. */
      buildTagSelector: id,
      /** Canvas highlight utilities. */
      highlight: {
        add: Ea,
        remove: Si,
        has: yd,
        clearAll: Kr
      }
    }, console.log(`[${T}] Placeable Picker API registered.`);
  });
}
c(Rp, "registerPlaceablePickerHooks");
Rp();
//# sourceMappingURL=eidolon-utilities.js.map
