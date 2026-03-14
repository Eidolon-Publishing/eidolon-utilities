var Ed = Object.defineProperty;
var lp = Object.getPrototypeOf;
var cp = Reflect.get;
var Sd = (t) => {
  throw TypeError(t);
};
var up = (t, e, n) => e in t ? Ed(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var c = (t, e) => Ed(t, "name", { value: e, configurable: !0 });
var se = (t, e, n) => up(t, typeof e != "symbol" ? e + "" : e, n), yl = (t, e, n) => e.has(t) || Sd("Cannot " + n);
var g = (t, e, n) => (yl(t, e, "read from private field"), n ? n.call(t) : e.get(t)), _ = (t, e, n) => e.has(t) ? Sd("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, n), O = (t, e, n, i) => (yl(t, e, "write to private field"), i ? i.call(t, n) : e.set(t, n), n), I = (t, e, n) => (yl(t, e, "access private method"), n);
var bl = (t, e, n, i) => ({
  set _(r) {
    O(t, e, r, n);
  },
  get _() {
    return g(t, e, i);
  }
}), ye = (t, e, n) => cp(lp(t), n, e);
const k = "eidolon-utilities", Fs = "timeTriggerActive", Xl = "timeTriggerHideWindow", Jl = "timeTriggerShowPlayerWindow", Ql = "timeTriggerAllowRealTime", Kf = "timeTriggers", gs = "timeTriggerHistory", Zl = "debug", ec = "timeFormat", tc = "manageTime", nc = "secondsPerRound";
const dp = [-30, -15, -5, 5, 15, 30], gr = 1440 * 60, ps = "playSound", Yo = 6;
function C(t, e) {
  var n, i;
  return (i = (n = game.i18n) == null ? void 0 : n.has) != null && i.call(n, t) ? game.i18n.localize(t) : e;
}
c(C, "localize");
function Xt(t) {
  return typeof t != "string" ? "" : t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
c(Xt, "escapeHtml");
function Zt(t) {
  var e;
  return t == null ? t : (e = foundry == null ? void 0 : foundry.utils) != null && e.duplicate ? foundry.utils.duplicate(t) : JSON.parse(JSON.stringify(t));
}
c(Zt, "duplicateData");
function fp() {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
c(fp, "generateTriggerId");
function Xf(t) {
  if (typeof t != "string") return null;
  const e = t.trim();
  if (!e) return null;
  const n = e.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (!n) return null;
  const i = Number(n[1]), r = Number(n[2]), o = n[3] !== void 0 ? Number(n[3]) : 0;
  return !Number.isInteger(i) || !Number.isInteger(r) || !Number.isInteger(o) || i < 0 || i > 23 || r < 0 || r > 59 || o < 0 || o > 59 ? null : i * 3600 + r * 60 + o;
}
c(Xf, "parseTriggerTimeToSeconds");
function Kr() {
  var t, e;
  return ((t = game.scenes) == null ? void 0 : t.current) ?? ((e = game.scenes) == null ? void 0 : e.active) ?? null;
}
c(Kr, "getActiveScene");
function at(t) {
  return (t == null ? void 0 : t.object) ?? (t == null ? void 0 : t.document) ?? null;
}
c(at, "getSceneFromApplication");
function Re(t) {
  return t && typeof t.getFlag == "function" && typeof t.setFlag == "function";
}
c(Re, "hasSceneDocument");
const ic = /* @__PURE__ */ new Set(), rc = /* @__PURE__ */ new Set(), oc = /* @__PURE__ */ new Set(), sc = /* @__PURE__ */ new Set();
let Wi = !1, po = !1, Ds = Yo, Ps = "12h", Cd = !1;
function vl(t) {
  Wi = !!t;
  for (const e of ic)
    try {
      e(Wi);
    } catch (n) {
      console.error(`${k} | Debug change handler failed`, n);
    }
}
c(vl, "notifyDebugChange");
function wl(t) {
  po = !!t;
  for (const e of rc)
    try {
      e(po);
    } catch (n) {
      console.error(`${k} | Manage time change handler failed`, n);
    }
}
c(wl, "notifyManageTimeChange");
function Jf(t) {
  return t === "24h" ? "24h" : "12h";
}
c(Jf, "normalizeTimeFormatValue");
function _u(t) {
  const e = Number(t);
  return !Number.isFinite(e) || e <= 0 ? Yo : e;
}
c(_u, "normalizeSecondsPerRoundValue");
function El(t) {
  const e = _u(t);
  Ds = e;
  for (const n of oc)
    try {
      n(e);
    } catch (i) {
      console.error(`${k} | Seconds-per-round change handler failed`, i);
    }
}
c(El, "notifySecondsPerRoundChange");
function Sl(t) {
  const e = Jf(t);
  Ps = e;
  for (const n of sc)
    try {
      n(e);
    } catch (i) {
      console.error(`${k} | Time format change handler failed`, i);
    }
}
c(Sl, "notifyTimeFormatChange");
function hp() {
  var e;
  if (Cd) return;
  if (Cd = !0, !((e = game == null ? void 0 : game.settings) != null && e.register)) {
    console.warn(
      `${k} | game.settings.register is unavailable. Module settings could not be registered.`
    );
    return;
  }
  const t = typeof game.settings.registerChange == "function";
  game.settings.register(k, Zl, {
    name: C("EIDOLON.TimeTrigger.DebugSettingName", "Enable debug logging"),
    hint: C(
      "EIDOLON.TimeTrigger.DebugSettingHint",
      "Write detailed time-trigger diagnostics to the browser console."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: t ? void 0 : vl
  }), t && game.settings.registerChange(k, Zl, vl), Wi = Nu(), vl(Wi), game.settings.register(k, tc, {
    name: C("EIDOLON.TimeTrigger.ManageTimeSettingName", "Manage Game Time"),
    hint: C(
      "EIDOLON.TimeTrigger.ManageTimeSettingHint",
      "Allow Eidolon Utilities to advance world time automatically while the game is unpaused. Warning: This may conflict with other time-management modules."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: t ? void 0 : wl
  }), t && game.settings.registerChange(k, tc, wl), po = gp(), wl(po), game.settings.register(k, nc, {
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
    default: Yo,
    range: { min: 1, max: 3600, step: 1 },
    onChange: t ? void 0 : El
  }), t && game.settings.registerChange(
    k,
    nc,
    El
  ), Ds = _u(pp()), El(Ds), game.settings.register(k, ec, {
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
    onChange: t ? void 0 : Sl
  }), t && game.settings.registerChange(k, ec, Sl), Ps = Jf(Qf()), Sl(Ps);
}
c(hp, "registerTimeTriggerSettings");
function Nu() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return !!game.settings.get(k, Zl);
  } catch (e) {
    console.error(`${k} | Failed to read debug setting`, e);
  }
  return !1;
}
c(Nu, "getDebugSetting");
function mp() {
  return Wi = Nu(), Wi;
}
c(mp, "refreshDebugSettingCache");
function gp() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return !!game.settings.get(k, tc);
  } catch (e) {
    console.error(`${k} | Failed to read manage time setting`, e);
  }
  return !1;
}
c(gp, "getManageTimeSetting");
function Qf() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return game.settings.get(k, ec) === "24h" ? "24h" : "12h";
  } catch (e) {
    console.error(`${k} | Failed to read time format setting`, e);
  }
  return "12h";
}
c(Qf, "getTimeFormatSetting");
function pp() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get) {
      const e = game.settings.get(k, nc);
      return _u(e);
    }
  } catch (e) {
    console.error(`${k} | Failed to read seconds-per-round setting`, e);
  }
  return Yo;
}
c(pp, "getSecondsPerRoundSetting");
function yp(t) {
  if (typeof t != "function")
    return () => {
    };
  ic.add(t);
  try {
    t(Wi);
  } catch (e) {
    console.error(`${k} | Debug change handler failed`, e);
  }
  return () => {
    ic.delete(t);
  };
}
c(yp, "onDebugSettingChange");
function Zf(t) {
  if (typeof t != "function")
    return () => {
    };
  rc.add(t);
  try {
    t(po);
  } catch (e) {
    console.error(`${k} | Manage time change handler failed`, e);
  }
  return () => {
    rc.delete(t);
  };
}
c(Zf, "onManageTimeSettingChange");
function $u(t) {
  if (typeof t != "function")
    return () => {
    };
  sc.add(t);
  try {
    t(Ps);
  } catch (e) {
    console.error(`${k} | Time format change handler failed`, e);
  }
  return () => {
    sc.delete(t);
  };
}
c($u, "onTimeFormatSettingChange");
function bp(t) {
  if (typeof t != "function")
    return () => {
    };
  oc.add(t);
  try {
    t(Ds);
  } catch (e) {
    console.error(`${k} | Seconds-per-round change handler failed`, e);
  }
  return () => {
    oc.delete(t);
  };
}
c(bp, "onSecondsPerRoundSettingChange");
let Ya = !1, ac = !1;
function lc(t) {
  Ya = !!t;
}
c(lc, "updateDebugState");
function eh() {
  ac || (ac = !0, lc(Nu()), yp((t) => {
    lc(t), console.info(`${k} | Debug ${Ya ? "enabled" : "disabled"}`);
  }));
}
c(eh, "ensureInitialized");
function Fu() {
  return ac || eh(), Ya;
}
c(Fu, "shouldLog");
function th(t) {
  if (!t.length)
    return [`${k} |`];
  const [e, ...n] = t;
  return typeof e == "string" ? [`${k} | ${e}`, ...n] : [`${k} |`, e, ...n];
}
c(th, "formatArgs");
function vp() {
  eh();
}
c(vp, "initializeDebug");
function wp() {
  return lc(mp()), Ya;
}
c(wp, "syncDebugState");
function D(...t) {
  Fu() && console.debug(...th(t));
}
c(D, "debugLog");
function Ar(...t) {
  Fu() && console.group(...th(t));
}
c(Ar, "debugGroup");
function ii() {
  Fu() && console.groupEnd();
}
c(ii, "debugGroupEnd");
function pr(t) {
  var r;
  const e = (r = t == null ? void 0 : t.getFlag) == null ? void 0 : r.call(t, k, Kf);
  if (!e) return [];
  const n = Zt(e), i = Array.isArray(n) ? n : [];
  return D("Loaded time triggers", {
    sceneId: (t == null ? void 0 : t.id) ?? null,
    count: i.length
  }), i;
}
c(pr, "getTimeTriggers");
async function nh(t, e) {
  t != null && t.setFlag && (D("Persisting time triggers", {
    sceneId: t.id,
    count: Array.isArray(e) ? e.length : 0
  }), await t.setFlag(k, Kf, e));
}
c(nh, "setTimeTriggers");
function Ep(t) {
  var r;
  const e = (r = t == null ? void 0 : t.getFlag) == null ? void 0 : r.call(t, k, gs);
  if (!e) return {};
  const n = Zt(e);
  if (!n || typeof n != "object") return {};
  const i = {};
  for (const [o, s] of Object.entries(n))
    typeof s == "number" && Number.isFinite(s) && (i[o] = s);
  return D("Loaded time trigger history", {
    sceneId: (t == null ? void 0 : t.id) ?? null,
    keys: Object.keys(i)
  }), i;
}
c(Ep, "getTimeTriggerHistory");
async function Cl(t, e) {
  var l, u, d, f;
  if (!t) return;
  const n = {};
  if (e && typeof e == "object")
    for (const [h, m] of Object.entries(e))
      typeof m == "number" && Number.isFinite(m) && (n[h] = m);
  const i = ((l = t.getFlag) == null ? void 0 : l.call(t, k, gs)) ?? {}, r = {};
  if (i && typeof i == "object")
    for (const [h, m] of Object.entries(i))
      typeof m == "number" && Number.isFinite(m) && (r[h] = m);
  const o = Object.keys(n), s = Object.keys(r);
  if (typeof ((u = foundry == null ? void 0 : foundry.utils) == null ? void 0 : u.deepEqual) == "function" ? foundry.utils.deepEqual(r, n) : JSON.stringify(r) === JSON.stringify(n)) {
    D("Skip history update because state is unchanged", {
      sceneId: (t == null ? void 0 : t.id) ?? null
    });
    return;
  }
  D("Updating time trigger history", {
    sceneId: (t == null ? void 0 : t.id) ?? null,
    keys: o,
    removedKeys: s.filter((h) => !o.includes(h))
  });
  try {
    s.length && typeof t.unsetFlag == "function" && await t.unsetFlag(k, gs), o.length && await t.setFlag(k, gs, n);
  } catch (h) {
    console.error(`${k} | Failed to persist time trigger history`, h), (f = (d = ui.notifications) == null ? void 0 : d.error) == null || f.call(
      d,
      C(
        "EIDOLON.TimeTrigger.HistoryPersistError",
        "Failed to persist the scene's time trigger history."
      )
    );
  }
}
c(Cl, "updateTimeTriggerHistory");
const Rs = /* @__PURE__ */ new Map(), Td = /* @__PURE__ */ new Set();
function Sp(t) {
  if (!(t != null && t.id))
    throw new Error(`${k} | Action definitions require an id.`);
  if (Rs.has(t.id))
    throw new Error(`${k} | Duplicate time trigger action id: ${t.id}`);
  Rs.set(t.id, {
    ...t
  }), D("Registered time trigger action", { actionId: t.id });
}
c(Sp, "registerAction");
function Ko(t) {
  return Rs.get(t) ?? null;
}
c(Ko, "getAction");
function Cp(t) {
  const e = Ko(t);
  return e ? typeof e.label == "function" ? e.label() : e.label : t;
}
c(Cp, "getActionLabel");
function Ld() {
  return Array.from(Rs.values());
}
c(Ld, "listActions");
async function ih(t, e) {
  var i, r;
  const n = Ko(e == null ? void 0 : e.action);
  if (!n || typeof n.execute != "function") {
    const o = C(
      "EIDOLON.TimeTrigger.UnknownAction",
      "Encountered an unknown time trigger action and skipped it."
    );
    (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, o), console.warn(`${k} | Unknown time trigger action`, e), D("Encountered unknown time trigger action", {
      triggerId: (e == null ? void 0 : e.id) ?? null,
      actionId: (e == null ? void 0 : e.action) ?? null
    });
    return;
  }
  D("Executing action handler", {
    actionId: n.id,
    triggerId: (e == null ? void 0 : e.id) ?? null,
    sceneId: (t == null ? void 0 : t.id) ?? null
  }), await n.execute({ scene: t, trigger: e });
}
c(ih, "executeTriggerAction");
function Tp(t) {
  const e = Ko(t == null ? void 0 : t.action);
  return !e || typeof e.buildSummaryParts != "function" ? [] : e.buildSummaryParts({ trigger: t, escapeHtml: Xt, localize: C }) ?? [];
}
c(Tp, "buildActionSummaryParts");
function Lp(t) {
  const e = Ko(t == null ? void 0 : t.action);
  return !e || typeof e.buildFormContent != "function" ? "" : e.buildFormContent({ trigger: t, escapeHtml: Xt, localize: C }) ?? "";
}
c(Lp, "buildActionFormSection");
function Ip(t, e) {
  const n = Ko(t == null ? void 0 : t.action);
  !n || typeof n.prepareFormData != "function" || n.prepareFormData({ trigger: t, formData: e });
}
c(Ip, "applyActionFormData");
function kp(t, e, n) {
  var o, s;
  const i = `${(t == null ? void 0 : t.id) ?? "unknown"}:${(e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.action) ?? "unknown"}:${n}`;
  if (Td.has(i)) return;
  Td.add(i);
  const r = C(
    "EIDOLON.TimeTrigger.MissingDataWarning",
    "A scene time trigger is missing required data and was skipped."
  );
  (s = (o = ui.notifications) == null ? void 0 : o.warn) == null || s.call(o, r), console.warn(`${k} | Missing trigger data (${n})`, { scene: t == null ? void 0 : t.id, trigger: e });
}
c(kp, "warnMissingTriggerData");
async function Op({ scene: t, trigger: e }) {
  var o, s, a, l, u;
  const n = (a = (s = (o = e == null ? void 0 : e.data) == null ? void 0 : o.path) == null ? void 0 : s.trim) == null ? void 0 : a.call(s);
  if (!n) {
    kp(t, e, "missing-audio-path");
    return;
  }
  const i = {
    src: n,
    autoplay: !0,
    loop: !1
  }, r = (() => {
    var d, f, h, m, p;
    return typeof ((f = (d = foundry == null ? void 0 : foundry.audio) == null ? void 0 : d.AudioHelper) == null ? void 0 : f.play) == "function" ? foundry.audio.AudioHelper.play(i, !0) : typeof ((m = (h = game == null ? void 0 : game.audio) == null ? void 0 : h.constructor) == null ? void 0 : m.play) == "function" ? game.audio.constructor.play(i, !0) : typeof ((p = game == null ? void 0 : game.audio) == null ? void 0 : p.play) == "function" ? game.audio.play(i, !0) : null;
  })();
  if (!r) {
    console.error(`${k} | Foundry audio helper is unavailable`), (u = (l = ui.notifications) == null ? void 0 : l.error) == null || u.call(
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
c(Op, "executePlaySoundAction");
Sp({
  id: ps,
  label: /* @__PURE__ */ c(() => C("EIDOLON.TimeTrigger.ActionPlaySound", "Play Sound"), "label"),
  execute: Op,
  buildSummaryParts: /* @__PURE__ */ c(({ trigger: t, escapeHtml: e, localize: n }) => {
    var r;
    return (r = t == null ? void 0 : t.data) != null && r.path ? [`${e(n("EIDOLON.TimeTrigger.TriggerSound", "Sound File"))}: ${e(t.data.path)}`] : [];
  }, "buildSummaryParts"),
  buildFormContent: /* @__PURE__ */ c(({ trigger: t, escapeHtml: e, localize: n }) => {
    var a;
    const i = e(n("EIDOLON.TimeTrigger.TriggerSound", "Sound File")), r = e(
      n("EIDOLON.TimeTrigger.TriggerChooseFile", "Select File")
    ), o = e(
      n(
        "EIDOLON.TimeTrigger.TriggerSoundNotes",
        "Select or upload the audio file that should play when this trigger fires."
      )
    ), s = e(((a = t == null ? void 0 : t.data) == null ? void 0 : a.path) ?? "");
    return `
      <label>${i}</label>
      <div class="form-fields">
        <input type="text" name="playSoundPath" value="${s}" data-dtype="String">
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
      <p class="hint">${o}</p>
    `;
  }, "buildFormContent"),
  prepareFormData: /* @__PURE__ */ c(({ trigger: t, formData: e }) => {
    var n, i;
    t.data.path = ((i = (n = e.playSoundPath) == null ? void 0 : n.trim) == null ? void 0 : i.call(n)) ?? "";
  }, "prepareFormData")
});
var Pf;
const { ApplicationV2: pt, HandlebarsApplicationMixin: yt } = ((Pf = foundry.applications) == null ? void 0 : Pf.api) ?? {};
if (!pt || !yt)
  throw new Error(
    `${k} | ApplicationV2 API unavailable. Update Foundry VTT to v13 or newer.`
  );
const ai = "AM", zi = "PM";
function ri() {
  return Qf();
}
c(ri, "getConfiguredTimeFormat");
function Ka(t) {
  if (typeof t != "string") return null;
  const e = t.trim();
  if (!e) return null;
  const n = e.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (!n) return null;
  const i = Number(n[1]), r = Number(n[2]), o = n[3] !== void 0 ? Number(n[3]) : null;
  return !Number.isInteger(i) || !Number.isInteger(r) || i < 0 || i > 23 || r < 0 || r > 59 || o !== null && (!Number.isInteger(o) || o < 0 || o > 59) ? null : {
    hours: i,
    minutes: r,
    seconds: o
  };
}
c(Ka, "parseCanonicalTimeString");
function un({ hours: t, minutes: e, seconds: n }) {
  if (!Number.isInteger(t) || !Number.isInteger(e) || t < 0 || t > 23 || e < 0 || e > 59) return null;
  const i = String(t).padStart(2, "0"), r = String(e).padStart(2, "0");
  if (Number.isInteger(n)) {
    if (n < 0 || n > 59) return null;
    const o = String(n).padStart(2, "0");
    return `${i}:${r}:${o}`;
  }
  return `${i}:${r}`;
}
c(un, "formatCanonicalTime");
function Ap(t, { format: e } = {}) {
  if (!t || typeof t != "object") return null;
  const n = Number(t.hour), i = Number(t.minute), r = t.second !== void 0 && t.second !== null, o = r ? Number(t.second) : null, s = r && Number.isFinite(o) ? Math.floor(Math.max(0, Math.min(59, o))) : null;
  if (!Number.isFinite(n) || !Number.isFinite(i)) return null;
  const a = e ?? ri();
  return Hs(
    {
      hours: n,
      minutes: i,
      seconds: s
    },
    a
  );
}
c(Ap, "formatTimeComponentsForDisplay");
function Mp(t, { format: e } = {}) {
  const n = Ka(t);
  if (!n) return "";
  const i = e ?? ri();
  return Hs(n, i);
}
c(Mp, "formatTriggerTimeForDisplay");
function Hs(t, e = "12h") {
  if (!t) return "";
  const { hours: n, minutes: i, seconds: r = null } = t;
  if (!Number.isInteger(n) || !Number.isInteger(i)) return "";
  const o = Number.isInteger(r);
  if (e === "24h") {
    const h = `${String(n).padStart(2, "0")}:${String(i).padStart(2, "0")}`;
    return o ? `${h}:${String(r).padStart(2, "0")}` : h;
  }
  const s = n >= 12 ? zi : ai, a = n % 12 === 0 ? 12 : n % 12, l = String(a), u = String(i).padStart(2, "0"), d = `${l}:${u}`, f = s === ai ? C("EIDOLON.TimeTrigger.TimePeriodAM", ai) : C("EIDOLON.TimeTrigger.TimePeriodPM", zi);
  if (o) {
    const h = String(r).padStart(2, "0");
    return `${d}:${h} ${f}`;
  }
  return `${d} ${f}`;
}
c(Hs, "formatTimeParts");
function Id(t, e = ri()) {
  const n = Ka(t);
  if (e === "24h")
    return {
      format: e,
      canonical: n ? un(n) ?? "" : "",
      hour: n ? String(n.hours).padStart(2, "0") : "",
      minute: n ? String(n.minutes).padStart(2, "0") : ""
    };
  if (!n)
    return {
      format: e,
      canonical: "",
      hour: "",
      minute: "",
      period: ai
    };
  const i = n.hours >= 12 ? zi : ai, r = n.hours % 12 === 0 ? 12 : n.hours % 12;
  return {
    format: e,
    canonical: un(n) ?? "",
    hour: String(r),
    minute: String(n.minutes).padStart(2, "0"),
    period: i
  };
}
c(Id, "getTimeFormValues");
function xp({ hour: t, minute: e, period: n, time: i }, r = ri()) {
  if (r === "24h") {
    const m = typeof t == "string" ? t.trim() : "", p = typeof e == "string" ? e.trim() : "", y = typeof i == "string" ? i.trim() : "";
    if (!m && !p && y) {
      const w = Ka(y);
      return w ? { canonical: un(w) ?? "", error: null } : {
        canonical: "",
        error: C(
          "EIDOLON.TimeTrigger.TimeFormatInvalid24",
          "Enter a valid time in HH:MM format."
        )
      };
    }
    if (!m || !p)
      return {
        canonical: "",
        error: C("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.")
      };
    const E = Number(m), v = Number(p);
    return !Number.isInteger(E) || E < 0 || E > 23 ? {
      canonical: "",
      error: C(
        "EIDOLON.TimeTrigger.TimeFormatInvalid24",
        "Enter a valid time in HH:MM format."
      )
    } : !Number.isInteger(v) || v < 0 || v > 59 ? {
      canonical: "",
      error: C(
        "EIDOLON.TimeTrigger.TimeFormatInvalid24",
        "Enter a valid time in HH:MM format."
      )
    } : { canonical: un({
      hours: E,
      minutes: v
    }) ?? "", error: null };
  }
  const o = typeof t == "string" ? t.trim() : "", s = typeof e == "string" ? e.trim() : "", a = typeof n == "string" ? n.trim().toUpperCase() : "";
  if (!o || !s || !a)
    return { canonical: "", error: C("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.") };
  if (a !== ai && a !== zi)
    return { canonical: "", error: C("EIDOLON.TimeTrigger.TimeFormatInvalidPeriod", "Select AM or PM.") };
  const l = Number(o), u = Number(s);
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
  const d = l % 12, h = {
    hours: a === zi ? d + 12 : d,
    minutes: u
  };
  return {
    canonical: un(h) ?? "",
    error: null
  };
}
c(xp, "normalizeFormTimeInput");
function _p() {
  return [
    {
      value: ai,
      label: C("EIDOLON.TimeTrigger.TimePeriodAM", ai)
    },
    {
      value: zi,
      label: C("EIDOLON.TimeTrigger.TimePeriodPM", zi)
    }
  ];
}
c(_p, "getPeriodOptions");
var Mi, xi, ae, rh, ga, pa, oh, uc, dc, ya, ba, sh, ah, lh, fc, hc, mc, va, wa, gc, Ea, ch, uh;
const ki = class ki extends yt(pt) {
  constructor(n = {}) {
    var s;
    const { scene: i, showControls: r, ...o } = n ?? {};
    super(o);
    _(this, ae);
    _(this, Mi, null);
    _(this, xi, null);
    _(this, ga, /* @__PURE__ */ c((n) => {
      var r, o;
      n.preventDefault();
      const i = Number((o = (r = n.currentTarget) == null ? void 0 : r.dataset) == null ? void 0 : o.delta);
      Number.isFinite(i) && (D("Time delta button clicked", { delta: i }), this._advanceTime(i));
    }, "#onDeltaClick"));
    _(this, pa, /* @__PURE__ */ c((n) => {
      var i, r;
      n.preventDefault(), !(!this.showControls || !((i = game.user) != null && i.isGM)) && (D("Time value double clicked", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null }), I(this, ae, oh).call(this));
    }, "#onTimeDoubleClick"));
    _(this, ya, /* @__PURE__ */ c((n) => {
      if (this.isEditingTime && !this._commitTimeInProgress)
        if (n.key === "Enter") {
          n.preventDefault();
          const i = n.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
          I(this, ae, dc).call(this, r);
        } else n.key === "Escape" && (n.preventDefault(), I(this, ae, uc).call(this));
    }, "#onTimeInputKeydown"));
    _(this, ba, /* @__PURE__ */ c((n) => {
      if (!this.isEditingTime || this._commitTimeInProgress || this._suppressBlurCommit) return;
      const i = n.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
      I(this, ae, dc).call(this, r);
    }, "#onTimeInputBlur"));
    _(this, va, /* @__PURE__ */ c((n) => {
      const i = !!n;
      if (this.manageTimeEnabled === i) return;
      this.manageTimeEnabled = i, (this.rendered ?? this.isRendered ?? !1) && this.render({ force: !0 });
    }, "#handleManageTimeChange"));
    _(this, wa, /* @__PURE__ */ c(async (n) => {
      var o, s, a, l, u, d, f, h, m;
      if (n.preventDefault(), !this.showControls || !((o = game.user) != null && o.isGM)) return;
      if (!this.manageTimeEnabled) {
        (a = (s = ui.notifications) == null ? void 0 : s.error) == null || a.call(
          s,
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
        await i.setFlag(k, Ql, r), this.sceneAllowsRealTime = r;
        const p = r ? C(
          "EIDOLON.TimeTrigger.SceneRealTimeEnabled",
          "Automatic real-time flow enabled for this scene."
        ) : C(
          "EIDOLON.TimeTrigger.SceneRealTimeDisabled",
          "Automatic real-time flow disabled for this scene."
        );
        (f = (d = ui.notifications) == null ? void 0 : d.info) == null || f.call(d, p);
      } catch (p) {
        console.error(`${k} | Failed to toggle scene real-time flow`, p), (m = (h = ui.notifications) == null ? void 0 : h.error) == null || m.call(
          h,
          C(
            "EIDOLON.TimeTrigger.SceneRealTimeToggleError",
            "Failed to update the scene's real-time flow setting."
          )
        );
      } finally {
        this.render({ force: !0 });
      }
    }, "#onRealTimeToggleClick"));
    _(this, Ea, /* @__PURE__ */ c(() => {
      (this.rendered ?? this.isRendered ?? !1) && (this.isEditingTime && (this.editValue = I(this, ae, fc).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    this.scene = i ?? null, this.showControls = typeof r == "boolean" ? r : !!((s = game.user) != null && s.isGM), this.isEditingTime = !1, this.editValue = "", this._commitTimeInProgress = !1, this._suppressBlurCommit = !1, this.manageTimeEnabled = !1, this.sceneAllowsRealTime = I(this, ae, gc).call(this), O(this, Mi, $u(g(this, Ea))), O(this, xi, Zf(g(this, va)));
  }
  async _prepareContext() {
    var v, b;
    const n = ((v = game.time) == null ? void 0 : v.components) ?? {}, r = ((n == null ? void 0 : n.second) !== void 0 && (n == null ? void 0 : n.second) !== null ? Ap(n) : null) ?? I(this, ae, rh).call(this), o = ri(), s = o === "24h", a = s ? C("EIDOLON.TimeTrigger.EditTimePlaceholder24", "HH:MM") : C("EIDOLON.TimeTrigger.EditTimePlaceholder12", "HH:MM AM/PM"), l = this.showControls ? C(
      "EIDOLON.TimeTrigger.EditTimeHint",
      "Double-click to set a specific time."
    ) : "", u = this.showControls ? C(
      "EIDOLON.TimeTrigger.EditTimeLabel",
      "New time (HH:MM or HH:MM AM/PM)"
    ) : "", d = dp.map((w) => ({
      minutes: w,
      label: w > 0 ? `+${w}` : `${w}`
    })), f = !!this.manageTimeEnabled, h = I(this, ae, gc).call(this);
    this.sceneAllowsRealTime = h;
    const m = C(
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
      manageTimeEnabled: f,
      sceneAllowsRealTime: h,
      realTimeButtonLabel: f ? h ? p : m : y,
      isGM: ((b = game.user) == null ? void 0 : b.isGM) ?? !1,
      showControls: !!this.showControls,
      editHint: l,
      editLabel: u,
      editPlaceholder: a,
      timeFormat: o,
      is24Hour: s,
      isEditingTime: !!this.isEditingTime,
      editValue: this.isEditingTime ? this.editValue ?? "" : ""
    };
  }
  async close(n = {}) {
    var r, o;
    if (!n.force)
      return (this.rendered ?? this.isRendered ?? !1) || (D("TimeTriggerWindow close request rerendering", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null
      }), this.render({ force: !0 })), this;
    D("Closing time trigger window", { sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null, force: !0 });
    const i = await super.close(n);
    return I(this, ae, ch).call(this), I(this, ae, uh).call(this), i;
  }
  async _advanceTime(n) {
    var r, o, s, a, l, u, d;
    const i = n * 60;
    if (D("Advancing world time", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null, minutes: n, seconds: i }), !((o = game.user) != null && o.isGM)) {
      (a = (s = ui.notifications) == null ? void 0 : s.warn) == null || a.call(s, C("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time."));
      return;
    }
    try {
      await game.time.advance(i);
    } catch (f) {
      console.error(`${k} | Failed to advance time`, f), (u = (l = ui.notifications) == null ? void 0 : l.error) == null || u.call(
        l,
        C("EIDOLON.TimeTrigger.Error", "Failed to update the world time.")
      ), D("Failed to advance time from window", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        minutes: n,
        message: (f == null ? void 0 : f.message) ?? String(f)
      });
    }
  }
  _onRender(n, i) {
    var o;
    super._onRender(n, i);
    const r = this.element;
    if (r) {
      if (this.showControls) {
        D("Binding time trigger interactions", {
          sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
          buttonCount: r.querySelectorAll("[data-delta]").length
        }), r.querySelectorAll("[data-delta]").forEach((u) => {
          u.addEventListener("click", g(this, ga));
        });
        const s = r.querySelector('.time-trigger-window__time-value[data-editable="true"]');
        s && s.addEventListener("dblclick", g(this, pa), { once: !1 });
        const a = r.querySelector(".time-trigger-window__time-input");
        a && (a.addEventListener("keydown", g(this, ya)), a.addEventListener("blur", g(this, ba)), typeof a.focus == "function" && (a.focus(), typeof a.select == "function" && a.select()));
        const l = r.querySelector('[data-action="toggle-real-time"]');
        l && l.addEventListener("click", g(this, wa));
      }
      this._suppressBlurCommit = !1;
    }
  }
};
Mi = new WeakMap(), xi = new WeakMap(), ae = new WeakSet(), rh = /* @__PURE__ */ c(function() {
  var l;
  const n = (l = game.time) == null ? void 0 : l.worldTime;
  if (typeof n != "number" || !Number.isFinite(n)) return "";
  const i = 1440 * 60, r = (Math.floor(n) % i + i) % i, o = Math.floor(r / 3600), s = Math.floor(r % 3600 / 60), a = r % 60;
  return Hs({ hours: o, minutes: s, seconds: a }, ri());
}, "#formatFallbackTime"), ga = new WeakMap(), pa = new WeakMap(), oh = /* @__PURE__ */ c(function() {
  var n;
  (n = game.user) != null && n.isGM && (this.isEditingTime = !0, this._suppressBlurCommit = !1, this.editValue = I(this, ae, fc).call(this), this.render({ force: !0 }));
}, "#enterTimeEditMode"), uc = /* @__PURE__ */ c(function() {
  this.isEditingTime = !1, this.editValue = "", this._suppressBlurCommit = !1, this.render({ force: !0 });
}, "#cancelTimeEdit"), dc = /* @__PURE__ */ c(async function(n) {
  var o, s, a;
  if (!((o = game.user) != null && o.isGM) || !this.isEditingTime || this._commitTimeInProgress) return;
  this._commitTimeInProgress = !0;
  const i = typeof n == "string" ? n.trim() : "";
  if (!i) {
    I(this, ae, uc).call(this), this._commitTimeInProgress = !1;
    return;
  }
  const r = I(this, ae, lh).call(this, i);
  if (r.error) {
    (a = (s = ui.notifications) == null ? void 0 : s.error) == null || a.call(s, r.error), this._suppressBlurCommit = !0, this.editValue = i, this.render({ force: !0 }), this._commitTimeInProgress = !1;
    return;
  }
  try {
    await I(this, ae, ah).call(this, r.seconds, r.includeSeconds) ? (this.isEditingTime = !1, this.editValue = "", this.render({ force: !0 })) : (this.editValue = i, this.render({ force: !0 }));
  } finally {
    this._commitTimeInProgress = !1;
  }
}, "#commitTimeInput"), ya = new WeakMap(), ba = new WeakMap(), sh = /* @__PURE__ */ c(function() {
  var u, d;
  const n = (u = game.time) == null ? void 0 : u.worldTime;
  if (typeof n != "number" || !Number.isFinite(n))
    return "";
  const i = ((d = game.time) == null ? void 0 : d.components) ?? {}, r = Number(i.hour), o = Number(i.minute), s = i.second !== void 0 ? Number(i.second) : null, a = Number.isInteger(s);
  return (Number.isFinite(r) && Number.isFinite(o) ? un({
    hours: Math.max(0, Math.min(23, Number(r))),
    minutes: Math.max(0, Math.min(59, Number(o))),
    seconds: a && Number.isFinite(s) ? Math.max(0, Math.min(59, Number(s))) : void 0
  }) ?? "" : "") ?? "";
}, "#getCurrentCanonicalTime"), ah = /* @__PURE__ */ c(async function(n, i) {
  var h, m, p, y, E, v, b, w, S, T;
  const r = (h = game.time) == null ? void 0 : h.worldTime;
  if (typeof r != "number" || !Number.isFinite(r))
    return (p = (m = ui.notifications) == null ? void 0 : m.error) == null || p.call(
      m,
      C(
        "EIDOLON.TimeTrigger.EditTimeUnavailable",
        "The world time is unavailable, so it can't be updated."
      )
    ), !1;
  if (!Number.isInteger(n) || n < 0 || n >= gr)
    return (E = (y = ui.notifications) == null ? void 0 : y.error) == null || E.call(
      y,
      C(
        "EIDOLON.TimeTrigger.EditTimeInvalidRange",
        "Enter a time within the current day."
      )
    ), !1;
  const a = Math.floor(r / gr) * gr + n - r;
  if (!Number.isFinite(a) || a === 0)
    return !0;
  const l = Math.floor(n / 3600), u = Math.floor(n % 3600 / 60), d = n % 60, f = un({
    hours: l,
    minutes: u,
    seconds: i ? d : void 0
  });
  try {
    D("Updating world time directly", {
      sceneId: ((v = this.scene) == null ? void 0 : v.id) ?? null,
      targetCanonical: f ?? null,
      diff: a
    }), await game.time.advance(a);
    const L = Hs(
      {
        hours: l,
        minutes: u,
        seconds: i ? d : null
      },
      ri()
    );
    (w = (b = ui.notifications) == null ? void 0 : b.info) == null || w.call(
      b,
      C(
        "EIDOLON.TimeTrigger.EditTimeSuccess",
        "World time updated."
      ) + (L ? ` ${L}` : "")
    );
  } catch (L) {
    return console.error(`${k} | Failed to set world time`, L), (T = (S = ui.notifications) == null ? void 0 : S.error) == null || T.call(
      S,
      C(
        "EIDOLON.TimeTrigger.EditTimeError",
        "Failed to update the world time."
      )
    ), !1;
  }
  return !0;
}, "#applyTargetSeconds"), lh = /* @__PURE__ */ c(function(n) {
  var f;
  const i = C(
    "EIDOLON.TimeTrigger.EditTimeInvalid",
    "Enter a valid time like 14:30 or 2:30 PM."
  );
  if (typeof n != "string")
    return { error: i };
  const r = n.trim();
  if (!r)
    return { error: i };
  const o = r.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (o) {
    const h = Number(o[1]), m = Number(o[2]), p = o[3] !== void 0 ? Number(o[3]) : void 0;
    if (Number.isInteger(h) && h >= 0 && h <= 23 && Number.isInteger(m) && m >= 0 && m <= 59 && (p === void 0 || Number.isInteger(p) && p >= 0 && p <= 59)) {
      const y = h * 3600 + m * 60 + (p ?? 0);
      return {
        canonical: un({ hours: h, minutes: m, seconds: p }),
        seconds: y,
        includeSeconds: p !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const { amLower: s, pmLower: a, periodPattern: l } = I(this, ae, hc).call(this), u = r.match(
    new RegExp(
      `^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?\\s*(${l})$`,
      "i"
    )
  );
  if (u) {
    let h = Number(u[1]);
    const m = Number(u[2]), p = u[3] !== void 0 ? Number(u[3]) : void 0, y = u[4] ?? "", E = typeof y == "string" ? ((f = y.toLocaleLowerCase) == null ? void 0 : f.call(y)) ?? y.toLowerCase() : "";
    if (Number.isInteger(h) && h >= 1 && h <= 12 && Number.isInteger(m) && m >= 0 && m <= 59 && (p === void 0 || Number.isInteger(p) && p >= 0 && p <= 59) && (E === s || E === a || E === "am" || E === "pm")) {
      h = h % 12, (E === a || E === "pm") && (h += 12);
      const b = h * 3600 + m * 60 + (p ?? 0);
      return {
        canonical: un({ hours: h, minutes: m, seconds: p }),
        seconds: b,
        includeSeconds: p !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const d = Xf(r);
  if (d !== null) {
    const h = Math.floor(d / 3600), m = Math.floor(d % 3600 / 60), p = d % 60, y = p !== 0;
    return {
      canonical: un({
        hours: h,
        minutes: m,
        seconds: y ? p : void 0
      }),
      seconds: d,
      includeSeconds: y,
      error: null
    };
  }
  return { error: i };
}, "#parseInputTime"), fc = /* @__PURE__ */ c(function() {
  const n = I(this, ae, sh).call(this);
  if (!n) return "";
  if (ri() === "24h")
    return n;
  const r = Ka(n);
  if (!r) return n;
  const o = Number(r.hours), s = Number(r.minutes), a = r.seconds !== null && r.seconds !== void 0 ? Number(r.seconds) : void 0;
  if (!Number.isFinite(o) || !Number.isFinite(s)) return n;
  const l = Number.isFinite(a), u = o % 12 === 0 ? 12 : o % 12, d = String(s).padStart(2, "0"), f = l ? `:${String(a).padStart(2, "0")}` : "", { amLabel: h, pmLabel: m } = I(this, ae, hc).call(this), p = o >= 12 ? m : h;
  return `${u}:${d}${f} ${p}`.trim();
}, "#getInitialEditValue"), hc = /* @__PURE__ */ c(function() {
  var u, d;
  const n = C("EIDOLON.TimeTrigger.TimePeriodAM", "AM"), i = C("EIDOLON.TimeTrigger.TimePeriodPM", "PM"), r = ((u = n.toLocaleLowerCase) == null ? void 0 : u.call(n)) ?? n.toLowerCase(), o = ((d = i.toLocaleLowerCase) == null ? void 0 : d.call(i)) ?? i.toLowerCase(), s = I(this, ae, mc).call(this, n), a = I(this, ae, mc).call(this, i), l = `${s}|${a}|AM|PM`;
  return {
    amLabel: n,
    pmLabel: i,
    amLower: r,
    pmLower: o,
    periodPattern: l
  };
}, "#getPeriodMatchData"), mc = /* @__PURE__ */ c(function(n) {
  return typeof n != "string" ? "" : n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}, "#escapeForRegex"), va = new WeakMap(), wa = new WeakMap(), gc = /* @__PURE__ */ c(function() {
  const n = this.scene;
  if (!n || typeof n.getFlag != "function") return !1;
  try {
    return !!n.getFlag(k, Ql);
  } catch (i) {
    D("TimeTriggerWindow | Failed to read scene real-time flag", {
      sceneId: (n == null ? void 0 : n.id) ?? null,
      message: (i == null ? void 0 : i.message) ?? String(i)
    });
  }
  return !1;
}, "#readSceneRealTimeFlag"), Ea = new WeakMap(), ch = /* @__PURE__ */ c(function() {
  if (typeof g(this, Mi) == "function")
    try {
      g(this, Mi).call(this);
    } catch (n) {
      console.error(`${k} | Failed to dispose time format subscription`, n);
    }
  O(this, Mi, null);
}, "#disposeTimeFormatSubscription"), uh = /* @__PURE__ */ c(function() {
  if (typeof g(this, xi) == "function")
    try {
      g(this, xi).call(this);
    } catch (n) {
      console.error(`${k} | Failed to dispose manage time subscription`, n);
    }
  O(this, xi, null);
}, "#disposeManageTimeSubscription"), c(ki, "TimeTriggerWindow"), se(ki, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  ye(ki, ki, "DEFAULT_OPTIONS"),
  {
    id: `${k}-time-trigger`,
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
)), se(ki, "PARTS", {
  content: {
    template: `modules/${k}/templates/time-trigger.html`
  }
});
let cc = ki;
function Zi(t, e = {}) {
  if (typeof t != "function")
    throw new TypeError("createApplicationFactory requires a constructor function.");
  const n = /* @__PURE__ */ c(function(r = {}) {
    const o = foundry.utils.mergeObject(
      e ?? {},
      r ?? {},
      { inplace: !1 }
    );
    return new t(o);
  }, "applicationFactory");
  return n.__eidolonFactorySignature = "options", n.__eidolonFactoryTarget = t, n;
}
c(Zi, "createApplicationFactory");
const kd = /* @__PURE__ */ new Set();
var xe, ct, _i, Dr, dh, fh;
const hd = class hd {
  constructor({ windowFactory: e } = {}) {
    _(this, Dr);
    _(this, xe, null);
    _(this, ct, null);
    _(this, _i);
    const n = Zi(cc);
    typeof e == "function" ? e.__eidolonFactorySignature === "options" ? O(this, _i, (r, o = {}) => e({ scene: r, ...o ?? {} })) : O(this, _i, e) : O(this, _i, /* @__PURE__ */ c((r, o = {}) => n({ scene: r, ...o ?? {} }), "fallbackFactory"));
  }
  onReady() {
    var n;
    const e = typeof ((n = game.time) == null ? void 0 : n.worldTime) == "number" && Number.isFinite(game.time.worldTime) ? game.time.worldTime : null;
    D("TimeTriggerManager#onReady", { worldTime: e }), e !== null && O(this, ct, e);
  }
  onCanvasReady(e) {
    const n = (e == null ? void 0 : e.scene) ?? Kr();
    D("TimeTriggerManager#onCanvasReady", { sceneId: (n == null ? void 0 : n.id) ?? null }), this.refreshTimeTriggerWindow(n), this.handleTimeTriggerEvaluation(n);
  }
  onUpdateScene(e) {
    const n = Kr();
    D("TimeTriggerManager#onUpdateScene", {
      sceneId: (e == null ? void 0 : e.id) ?? null,
      activeSceneId: (n == null ? void 0 : n.id) ?? null
    }), !(!n || e.id !== n.id) && (this.refreshTimeTriggerWindow(e), this.handleTimeTriggerEvaluation(e));
  }
  onUpdateWorldTime(e, n) {
    D("TimeTriggerManager#onUpdateWorldTime", {
      worldTime: e,
      diff: n,
      hasWindow: !!g(this, xe)
    }), g(this, xe) && g(this, xe).render();
    const i = Kr(), r = I(this, Dr, dh).call(this, e, n);
    this.handleTimeTriggerEvaluation(i, e, r);
  }
  refreshTimeTriggerWindow(e) {
    var l, u, d;
    if (!e) return;
    const n = !!((l = game.user) != null && l.isGM), i = !!e.getFlag(k, Fs), r = !!e.getFlag(k, Xl), o = !!e.getFlag(k, Jl);
    if (D("TimeTriggerManager#refreshTimeTriggerWindow", {
      sceneId: e.id,
      isGM: n,
      isActive: i,
      hideWindow: r,
      showPlayerWindow: o
    }), !(i && !r && (n || o))) {
      g(this, xe) && (D("Closing time trigger window", { reason: "not-visible" }), g(this, xe).close({ force: !0 }), O(this, xe, null));
      return;
    }
    const a = !!n;
    if (g(this, xe) && ((u = g(this, xe).scene) == null ? void 0 : u.id) === e.id) {
      D("Refreshing existing time trigger window", { sceneId: e.id }), g(this, xe).showControls = a, g(this, xe).render();
      return;
    }
    g(this, xe) && (D("Closing existing window before creating new instance", {
      previousSceneId: ((d = g(this, xe).scene) == null ? void 0 : d.id) ?? null
    }), g(this, xe).close({ force: !0 })), O(this, xe, g(this, _i).call(this, e, { showControls: a })), D("Rendering new time trigger window", { sceneId: e.id }), g(this, xe).render({ force: !0 });
  }
  async handleTimeTriggerEvaluation(e, n, i) {
    var l;
    const r = e ?? Kr();
    if (!r) {
      D("handleTimeTriggerEvaluation skipped", {
        reason: "no-active-scene",
        providedSceneId: (e == null ? void 0 : e.id) ?? null,
        currentWorldTime: n
      }), typeof n == "number" && Number.isFinite(n) && O(this, ct, n);
      return;
    }
    const o = typeof n == "number" && Number.isFinite(n) ? n : typeof ((l = game.time) == null ? void 0 : l.worldTime) == "number" ? game.time.worldTime : null;
    if (o === null) return;
    const s = typeof i == "number" && Number.isFinite(i) ? i : null, a = s !== null ? s : typeof g(this, ct) == "number" && Number.isFinite(g(this, ct)) ? g(this, ct) : o;
    Ar("handleTimeTriggerEvaluation", {
      sceneId: r.id,
      previousWorldTime: a,
      currentWorldTime: o,
      overrideProvided: s !== null
    });
    try {
      await I(this, Dr, fh).call(this, r, a, o);
    } catch (u) {
      console.error(`${k} | Unexpected error while evaluating time triggers`, u), D("handleTimeTriggerEvaluation error", { message: (u == null ? void 0 : u.message) ?? String(u) });
    } finally {
      O(this, ct, o), ii();
    }
  }
};
xe = new WeakMap(), ct = new WeakMap(), _i = new WeakMap(), Dr = new WeakSet(), dh = /* @__PURE__ */ c(function(e, n) {
  return typeof g(this, ct) == "number" && Number.isFinite(g(this, ct)) ? (D("Resolved previous world time from cache", {
    previousWorldTime: g(this, ct)
  }), g(this, ct)) : typeof e == "number" && Number.isFinite(e) && typeof n == "number" && Number.isFinite(n) ? (D("Resolved previous world time using diff", {
    worldTime: e,
    diff: n,
    resolved: e - n
  }), e - n) : typeof e == "number" && Number.isFinite(e) ? e : null;
}, "#resolvePreviousWorldTime"), fh = /* @__PURE__ */ c(async function(e, n, i) {
  var p, y, E;
  if (!((p = game.user) != null && p.isGM)) {
    D("Skipping trigger evaluation because user is not a GM");
    return;
  }
  if (!(e != null && e.id)) {
    D("Skipping trigger evaluation because the scene is missing an id");
    return;
  }
  if (!!!e.getFlag(k, Fs)) {
    D("Skipping trigger evaluation because scene is inactive", { sceneId: e.id });
    return;
  }
  if (typeof i != "number" || !Number.isFinite(i)) return;
  (typeof n != "number" || !Number.isFinite(n)) && (n = i);
  const o = pr(e);
  if (!o.length) {
    D("No time triggers configured for scene", { sceneId: e.id });
    return;
  }
  const s = Ep(e), a = /* @__PURE__ */ new Set();
  for (const v of o)
    v != null && v.id && a.add(v.id);
  let l = !1;
  for (const v of Object.keys(s))
    a.has(v) || (delete s[v], l = !0);
  if (Ar("Evaluating scene time triggers", {
    sceneId: e.id,
    previousWorldTime: n,
    currentWorldTime: i,
    triggerCount: o.length
  }), i <= n) {
    D("Detected world time rewind", {
      previousWorldTime: n,
      currentWorldTime: i
    });
    for (const v of o) {
      if (!(v != null && v.id) || !v.allowReplayOnRewind) continue;
      const b = s[v.id];
      typeof b == "number" ? i < b ? (D("Clearing trigger history due to rewind", {
        triggerId: v.id,
        lastFired: b,
        currentWorldTime: i
      }), delete s[v.id], l = !0) : D("Preserving trigger history after rewind", {
        triggerId: v.id,
        lastFired: b,
        currentWorldTime: i
      }) : D("No history stored for rewind-enabled trigger", {
        triggerId: v.id
      });
    }
    l && (D("Persisting history cleanup after rewind", {
      sceneId: e.id
    }), await Cl(e, s)), ii();
    return;
  }
  const u = n, d = i, f = [], h = Math.floor(u / gr), m = Math.floor(d / gr);
  for (const v of o) {
    if (!(v != null && v.id)) continue;
    const b = Xf(v.time);
    if (b === null) {
      Np(e, v), D("Skipping trigger with invalid time", {
        triggerId: v.id,
        time: v.time
      });
      continue;
    }
    for (let w = h; w <= m; w++) {
      const S = w * gr + b;
      if (S < u || S > d) continue;
      const L = s[v.id];
      if (typeof L == "number" && L >= S) {
        D("Skipping trigger because it already fired within window", {
          triggerId: v.id,
          lastFired: L,
          absoluteTime: S
        });
        continue;
      }
      f.push({ trigger: v, absoluteTime: S });
    }
  }
  if (!f.length) {
    l && await Cl(e, s), D("No triggers scheduled to fire within evaluation window", {
      sceneId: e.id
    }), ii();
    return;
  }
  f.sort((v, b) => v.absoluteTime - b.absoluteTime), D("Queued triggers for execution", {
    entries: f.map((v) => ({
      triggerId: v.trigger.id,
      absoluteTime: v.absoluteTime
    }))
  });
  for (const v of f)
    try {
      D("Executing time trigger action", {
        triggerId: v.trigger.id,
        absoluteTime: v.absoluteTime
      }), await ih(e, v.trigger);
    } catch (b) {
      console.error(`${k} | Failed to execute time trigger action`, b), (E = (y = ui.notifications) == null ? void 0 : y.error) == null || E.call(
        y,
        C(
          "EIDOLON.TimeTrigger.TriggerActionError",
          "Failed to execute a scene time trigger action. Check the console for details."
        )
      ), D("Trigger execution failed", {
        triggerId: v.trigger.id,
        message: (b == null ? void 0 : b.message) ?? String(b)
      });
    } finally {
      s[v.trigger.id] = v.absoluteTime, l = !0, D("Recorded trigger execution", {
        triggerId: v.trigger.id,
        absoluteTime: v.absoluteTime
      });
    }
  l && (D("Persisting trigger history updates", { sceneId: e.id }), await Cl(e, s)), ii();
}, "#evaluateSceneTimeTriggers"), c(hd, "TimeTriggerManager");
let pc = hd;
function Np(t, e) {
  var r, o;
  const n = `${(t == null ? void 0 : t.id) ?? "unknown"}:${(e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.time) ?? "unknown"}`;
  if (kd.has(n)) return;
  kd.add(n);
  const i = C(
    "EIDOLON.TimeTrigger.InvalidTimeWarning",
    "A scene time trigger has an invalid time value and was skipped."
  );
  (o = (r = ui.notifications) == null ? void 0 : r.warn) == null || o.call(r, i), console.warn(`${k} | Invalid time for trigger`, { scene: t == null ? void 0 : t.id, trigger: e });
}
c(Np, "warnInvalidTriggerTime");
var Ht, ko, qt, jn, Ni, on, Er, Sa, Ca, Oo, Ao, $i, sn, K, bc, rr, ys, vc, bs, wc, nn, hh, Ec, mh, Sc, gh, Ta, La, Ia, ka, Oa, Aa, Cc, ph, vs, Ma, xa;
const md = class md {
  constructor() {
    _(this, K);
    _(this, Ht, !1);
    _(this, ko, Yo);
    _(this, qt, /* @__PURE__ */ new Map());
    _(this, jn, null);
    _(this, Ni, null);
    _(this, on, 0);
    _(this, Er, null);
    _(this, Sa, null);
    _(this, Ca, null);
    _(this, Oo, !1);
    _(this, Ao, !1);
    _(this, $i, !1);
    _(this, sn, !1);
    _(this, Ta, /* @__PURE__ */ c((e, n = {}) => {
      D("GameTimeAutomation | Pause state changed", {
        paused: e,
        userId: (n == null ? void 0 : n.userId) ?? null,
        broadcast: (n == null ? void 0 : n.broadcast) ?? null
      }), I(this, K, nn).call(this, { pausedOverride: e });
    }, "#handlePause"));
    _(this, La, /* @__PURE__ */ c((e) => {
      e != null && e.id && (g(this, qt).set(e.id, Math.max(e.round ?? 0, 1)), D("GameTimeAutomation | Combat started", { combatId: e.id, round: e.round ?? 0 }), I(this, K, nn).call(this));
    }, "#handleCombatStart"));
    _(this, Ia, /* @__PURE__ */ c((e, n) => {
      if (!(e != null && e.id)) return;
      const i = typeof n == "number" && Number.isFinite(n) ? n : typeof e.round == "number" && Number.isFinite(e.round) ? e.round : 0, r = i > 0 ? i : 1, o = g(this, qt).get(e.id), s = o ? Math.max(o, 1) : 1, a = r > 1 ? Math.max(r - s, 0) : 0;
      if (D("GameTimeAutomation | Combat round change detected", {
        combatId: e.id,
        effectiveRound: r,
        completedRounds: a,
        enabled: g(this, Ht),
        paused: (game == null ? void 0 : game.paused) ?? null
      }), a > 0 && g(this, Ht) && g(this, sn) && !(game != null && game.paused) && I(this, K, rr).call(this) && I(this, K, ys).call(this, e)) {
        const l = a * g(this, ko);
        l > 0 && (D("GameTimeAutomation | Advancing time for completed combat rounds", {
          combatId: e.id,
          completedRounds: a,
          delta: l
        }), I(this, K, Sc).call(this, l));
      }
      g(this, qt).set(e.id, Math.max(r, 1));
    }, "#handleCombatRound"));
    _(this, ka, /* @__PURE__ */ c((e) => {
      e != null && e.id && (g(this, qt).delete(e.id), D("GameTimeAutomation | Combat ended", { combatId: e.id }), I(this, K, nn).call(this));
    }, "#handleCombatEnd"));
    _(this, Oa, /* @__PURE__ */ c((e) => {
      e != null && e.id && (g(this, qt).delete(e.id), D("GameTimeAutomation | Combat deleted", { combatId: e.id }), I(this, K, nn).call(this));
    }, "#handleCombatDelete"));
    _(this, Aa, /* @__PURE__ */ c((e, n) => {
      if (e != null && e.id) {
        if (typeof (n == null ? void 0 : n.round) == "number" && Number.isFinite(n.round)) {
          const i = Math.max(n.round, 1);
          g(this, qt).set(e.id, i), D("GameTimeAutomation | Combat round manually updated", {
            combatId: e.id,
            round: i
          });
        }
        (Object.prototype.hasOwnProperty.call(n ?? {}, "active") || (n == null ? void 0 : n.round) !== void 0) && I(this, K, nn).call(this);
      }
    }, "#handleCombatUpdate"));
    _(this, Ma, /* @__PURE__ */ c((e) => {
      I(this, K, vs).call(this, e == null ? void 0 : e.scene), I(this, K, nn).call(this);
    }, "#handleCanvasReady"));
    _(this, xa, /* @__PURE__ */ c((e) => {
      if (!Re(e)) return;
      const n = I(this, K, Cc).call(this);
      if (!n || n.id !== e.id) return;
      I(this, K, vs).call(this, e) && I(this, K, nn).call(this);
    }, "#handleSceneUpdate"));
  }
  registerHooks() {
    g(this, Oo) || (O(this, Oo, !0), Hooks.on("pauseGame", g(this, Ta)), Hooks.on("combatStart", g(this, La)), Hooks.on("combatRound", g(this, Ia)), Hooks.on("combatEnd", g(this, ka)), Hooks.on("deleteCombat", g(this, Oa)), Hooks.on("updateCombat", g(this, Aa)), Hooks.on("canvasReady", g(this, Ma)), Hooks.on("updateScene", g(this, xa)));
  }
  initialize() {
    g(this, Ao) || (O(this, Ao, !0), O(this, Sa, Zf((e) => {
      const n = !!e, i = n !== g(this, Ht);
      O(this, Ht, n), D("GameTimeAutomation | Manage time toggled", { enabled: n }), i && n && I(this, K, wc).call(this), I(this, K, nn).call(this);
    })), O(this, Ca, bp((e) => {
      O(this, ko, e), D("GameTimeAutomation | Seconds per round updated", { value: e });
    })), I(this, K, wc).call(this), I(this, K, vs).call(this), I(this, K, nn).call(this));
  }
};
Ht = new WeakMap(), ko = new WeakMap(), qt = new WeakMap(), jn = new WeakMap(), Ni = new WeakMap(), on = new WeakMap(), Er = new WeakMap(), Sa = new WeakMap(), Ca = new WeakMap(), Oo = new WeakMap(), Ao = new WeakMap(), $i = new WeakMap(), sn = new WeakMap(), K = new WeakSet(), bc = /* @__PURE__ */ c(function() {
  var e;
  try {
    if (typeof ((e = globalThis.performance) == null ? void 0 : e.now) == "function")
      return globalThis.performance.now();
  } catch (n) {
    D("GameTimeAutomation | Failed to read high-resolution timestamp", {
      message: (n == null ? void 0 : n.message) ?? String(n)
    });
  }
  return Date.now();
}, "#currentTimestamp"), rr = /* @__PURE__ */ c(function() {
  var e;
  return !!((e = game == null ? void 0 : game.user) != null && e.isGM && game.user.active !== !1);
}, "#canControlTime"), ys = /* @__PURE__ */ c(function(e) {
  var i, r;
  if (!e) return !1;
  if (e.active === !0) return !0;
  if (e.active === !1) return !1;
  const n = (i = game == null ? void 0 : game.combats) == null ? void 0 : i.active;
  return (n == null ? void 0 : n.id) === e.id ? !0 : ((r = game == null ? void 0 : game.combat) == null ? void 0 : r.id) === e.id ? game.combat.active ?? !0 : !1;
}, "#isCombatDocumentActive"), vc = /* @__PURE__ */ c(function(e) {
  return e ? typeof e.started == "boolean" ? e.started : (e.round ?? 0) > 0 : !1;
}, "#hasCombatStarted"), bs = /* @__PURE__ */ c(function() {
  var i;
  const e = Array.isArray((i = game == null ? void 0 : game.combats) == null ? void 0 : i.contents) ? game.combats.contents : [];
  for (const r of e)
    if (I(this, K, ys).call(this, r) && I(this, K, vc).call(this, r))
      return !0;
  const n = game == null ? void 0 : game.combat;
  return !!(n && I(this, K, ys).call(this, n) && I(this, K, vc).call(this, n));
}, "#isCombatRunning"), wc = /* @__PURE__ */ c(function() {
  var n;
  g(this, qt).clear();
  const e = Array.isArray((n = game == null ? void 0 : game.combats) == null ? void 0 : n.contents) ? game.combats.contents : [];
  for (const i of e)
    i != null && i.id && g(this, qt).set(i.id, Math.max(i.round ?? 0, 1));
}, "#hydrateRoundTracking"), nn = /* @__PURE__ */ c(function({ pausedOverride: e } = {}) {
  const n = typeof e == "boolean" ? e : !!(game != null && game.paused), i = g(this, Ht), r = g(this, sn), o = i && r, s = {
    manageTimeEnabled: i,
    sceneAllowsRealTime: r,
    effectiveEnabled: o,
    paused: n,
    canControl: I(this, K, rr).call(this),
    combatRunning: I(this, K, bs).call(this),
    overrideApplied: typeof e == "boolean"
  };
  if (D("GameTimeAutomation | Sync running state", s), !o || !I(this, K, rr).call(this)) {
    I(this, K, Ec).call(this);
    return;
  }
  I(this, K, hh).call(this);
}, "#syncRunningState"), hh = /* @__PURE__ */ c(function() {
  g(this, jn) === null && (O(this, Ni, I(this, K, bc).call(this)), O(this, jn, globalThis.setInterval(() => I(this, K, mh).call(this), 1e3)), D("GameTimeAutomation | Started real-time ticker"));
}, "#startRealTimeTicker"), Ec = /* @__PURE__ */ c(function() {
  g(this, jn) !== null && (globalThis.clearInterval(g(this, jn)), O(this, jn, null), D("GameTimeAutomation | Stopped real-time ticker")), O(this, Ni, null), O(this, on, 0), O(this, $i, !1);
}, "#stopRealTimeTicker"), mh = /* @__PURE__ */ c(function() {
  if (!g(this, Ht) || !g(this, sn) || !I(this, K, rr).call(this)) {
    I(this, K, Ec).call(this);
    return;
  }
  const e = I(this, K, bc).call(this);
  if (typeof e != "number" || !Number.isFinite(e)) return;
  const n = g(this, Ni) ?? e, i = (e - n) / 1e3;
  if (O(this, Ni, e), !Number.isFinite(i) || i <= 0) return;
  const r = !!(game != null && game.paused), o = I(this, K, bs).call(this);
  if (r || o) {
    g(this, $i) || D("GameTimeAutomation | Tick skipped", { paused: r, combatRunning: o }), O(this, $i, !0), O(this, on, 0);
    return;
  }
  O(this, $i, !1), D("GameTimeAutomation | Real-time tick", { deltaSeconds: i }), I(this, K, Sc).call(this, i);
}, "#tickRealTime"), Sc = /* @__PURE__ */ c(function(e) {
  if (!g(this, Ht) || !g(this, sn)) return;
  const n = Number(e);
  !Number.isFinite(n) || n <= 0 || (O(this, on, g(this, on) + n), !g(this, Er) && O(this, Er, I(this, K, gh).call(this)));
}, "#queueAdvance"), gh = /* @__PURE__ */ c(async function() {
  var e, n;
  for (; g(this, on) > 0; ) {
    if (!g(this, Ht) || !g(this, sn) || game != null && game.paused || !I(this, K, rr).call(this) || I(this, K, bs).call(this)) {
      O(this, on, 0);
      break;
    }
    const i = g(this, on);
    O(this, on, 0);
    try {
      if (typeof ((e = game == null ? void 0 : game.time) == null ? void 0 : e.advance) == "function")
        D("GameTimeAutomation | Advancing world time", { delta: i }), await game.time.advance(i), D("GameTimeAutomation | World time advanced", {
          worldTime: ((n = game.time) == null ? void 0 : n.worldTime) ?? null
        });
      else {
        console.warn(`${k} | game.time.advance is unavailable; cannot manage world time.`);
        break;
      }
    } catch (r) {
      console.error(`${k} | Failed to advance world time`, r);
      break;
    }
  }
  O(this, Er, null);
}, "#flushAdvanceQueue"), Ta = new WeakMap(), La = new WeakMap(), Ia = new WeakMap(), ka = new WeakMap(), Oa = new WeakMap(), Aa = new WeakMap(), Cc = /* @__PURE__ */ c(function() {
  const e = Kr();
  return Re(e) ? e : null;
}, "#getActiveSceneDocument"), ph = /* @__PURE__ */ c(function(e) {
  if (!Re(e)) return !1;
  try {
    return !!e.getFlag(k, Ql);
  } catch (n) {
    return D("GameTimeAutomation | Failed to read scene real-time flag", {
      sceneId: (e == null ? void 0 : e.id) ?? null,
      message: (n == null ? void 0 : n.message) ?? String(n)
    }), !1;
  }
}, "#isSceneRealTimeAllowed"), vs = /* @__PURE__ */ c(function(e) {
  const n = Re(e) ? e : I(this, K, Cc).call(this), i = I(this, K, ph).call(this, n), r = g(this, sn);
  return O(this, sn, i), r !== i ? (D("GameTimeAutomation | Scene real-time allowance changed", {
    sceneId: (n == null ? void 0 : n.id) ?? null,
    allows: i
  }), !0) : !1;
}, "#refreshSceneAutomationState"), Ma = new WeakMap(), xa = new WeakMap(), c(md, "GameTimeAutomation");
let yc = md;
var Rf, Bn, Je, Fi, Ln, _a, Ae, yh, bh, vh, wh, Na, Lc, $a, Eh, Fa, Sh, Ch;
const bn = class bn extends yt(pt) {
  constructor(n = {}) {
    const { scene: i, trigger: r, triggerIndex: o, onSave: s, ...a } = n ?? {};
    super(a);
    _(this, Ae);
    _(this, Bn, null);
    _(this, Je, null);
    _(this, Fi, null);
    _(this, Ln, null);
    _(this, _a, /* @__PURE__ */ c(() => {
      (this.rendered ?? this.isRendered ?? !1) && (O(this, Ln, I(this, Ae, yh).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    _(this, Na, /* @__PURE__ */ c((n) => {
      var o, s;
      const i = n.currentTarget, r = i == null ? void 0 : i.closest("form");
      r && (D("Trigger action selection changed", {
        sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
        triggerId: ((s = this.trigger) == null ? void 0 : s.id) ?? null,
        actionId: (i == null ? void 0 : i.value) ?? null
      }), I(this, Ae, Lc).call(this, i.value, r));
    }, "#onActionSelectChange"));
    _(this, $a, /* @__PURE__ */ c((n) => {
      var u, d, f, h;
      n.preventDefault();
      const i = n.currentTarget, r = i == null ? void 0 : i.closest("form");
      if (!r) return;
      const o = (u = i.dataset) == null ? void 0 : u.target;
      if (!o) return;
      const s = typeof (CSS == null ? void 0 : CSS.escape) == "function" ? CSS.escape : (m) => m, a = r.querySelector(`[name="${s(o)}"]`);
      if (!a) return;
      D("Opening file picker for trigger", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        triggerId: ((f = this.trigger) == null ? void 0 : f.id) ?? null,
        target: o
      }), new FilePicker({
        type: ((h = i.dataset) == null ? void 0 : h.type) || "audio",
        current: a.value,
        callback: /* @__PURE__ */ c((m) => {
          var p, y;
          a.value = m, a.dispatchEvent(new Event("change")), D("Trigger form file selected", {
            sceneId: ((p = this.scene) == null ? void 0 : p.id) ?? null,
            triggerId: ((y = this.trigger) == null ? void 0 : y.id) ?? null,
            target: o,
            path: m
          });
        }, "callback")
      }).render({ force: !0 });
    }, "#onFilePicker"));
    _(this, Fa, /* @__PURE__ */ c(async (n) => {
      var r, o;
      n.preventDefault();
      const i = n.currentTarget;
      i instanceof HTMLFormElement && (D("Trigger form submitted", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null,
        triggerId: ((o = this.trigger) == null ? void 0 : o.id) ?? null
      }), await I(this, Ae, Sh).call(this, i));
    }, "#onSubmit"));
    this.scene = i ?? null, this.trigger = r ?? null, this.triggerIndex = Number.isInteger(o) ? Number(o) : null, this.onSave = typeof s == "function" ? s : null, O(this, Fi, $u(g(this, _a)));
  }
  async _prepareContext() {
    var n, i;
    Ar("TriggerFormApplication#_prepareContext", {
      sceneId: ((n = this.scene) == null ? void 0 : n.id) ?? null,
      triggerId: ((i = this.trigger) == null ? void 0 : i.id) ?? null,
      triggerIndex: this.triggerIndex
    });
    try {
      const r = this.trigger ?? { action: ps, data: {} }, o = r.action ?? ps, s = Id(r.time), a = s.format ?? "12h", l = a === "12h" ? _p() : [], u = s.period ?? (l.length > 0 ? l[0].value : null), d = a === "12h" ? l.map((m) => ({
        ...m,
        selected: m.value === u
      })) : [], f = Ld().map((m) => ({
        id: m.id,
        label: typeof m.label == "function" ? m.label() : m.label,
        selected: m.id === o
      })), h = Ld().map((m) => {
        const p = m.id === r.action ? r : { ...r, action: m.id }, y = Lp(p);
        return y ? {
          id: m.id,
          visible: m.id === o,
          content: y
        } : null;
      }).filter(Boolean);
      return {
        timeValue: s.canonical ?? "",
        timeHourValue: s.hour ?? "",
        timeMinuteValue: s.minute ?? "",
        timePeriodValue: u ?? "",
        timeFormat: a,
        is12HourFormat: a === "12h",
        is24HourFormat: a === "24h",
        timePeriodOptions: d,
        actions: f,
        actionSections: h,
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
      ii();
    }
  }
  _onRender(n, i) {
    var l, u, d;
    super._onRender(n, i);
    const r = this.element;
    if (!r) return;
    D("Trigger form rendered", {
      sceneId: ((l = this.scene) == null ? void 0 : l.id) ?? null,
      triggerId: ((u = this.trigger) == null ? void 0 : u.id) ?? null
    });
    const o = Array.from(((d = document == null ? void 0 : document.body) == null ? void 0 : d.classList) ?? []).find(
      (f) => f.startsWith("theme-")
    );
    o && r.classList.add(o);
    const s = r.querySelector("form");
    if (!s) return;
    I(this, Ae, Eh).call(this, s), I(this, Ae, bh).call(this, s), s.addEventListener("submit", g(this, Fa));
    const a = s.querySelector("[data-action-select]");
    a && (a.addEventListener("change", g(this, Na)), I(this, Ae, Lc).call(this, a.value, s)), s.querySelectorAll("[data-action-file-picker]").forEach((f) => {
      f.addEventListener("click", g(this, $a));
    });
  }
  async close(n = {}) {
    var i;
    if ((i = g(this, Bn)) == null || i.call(this), O(this, Bn, null), O(this, Je, null), O(this, Ln, null), typeof g(this, Fi) == "function")
      try {
        g(this, Fi).call(this);
      } catch (r) {
        console.error(`${k} | Failed to dispose trigger form time format subscription`, r);
      }
    return O(this, Fi, null), super.close(n);
  }
};
Bn = new WeakMap(), Je = new WeakMap(), Fi = new WeakMap(), Ln = new WeakMap(), _a = new WeakMap(), Ae = new WeakSet(), yh = /* @__PURE__ */ c(function() {
  var a, l, u, d, f, h, m;
  const n = (l = (a = this.element) == null ? void 0 : a.querySelector) == null ? void 0 : l.call(a, "form");
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
  const o = n.querySelector("[data-time-format]");
  let s = null;
  if (o instanceof HTMLElement) {
    const p = o.querySelector("[data-time-hidden]"), y = o.querySelector("[data-time-hour]"), E = o.querySelector("[data-time-minute]"), v = o.querySelector("[data-time-period]");
    s = {
      format: ((m = o.dataset) == null ? void 0 : m.timeFormat) ?? null,
      canonical: p instanceof HTMLInputElement ? p.value : "",
      hour: y instanceof HTMLInputElement ? y.value : "",
      minute: E instanceof HTMLInputElement ? E.value : "",
      period: v instanceof HTMLSelectElement ? v.value : ""
    };
  }
  return {
    fields: r,
    time: s
  };
}, "#captureFormState"), bh = /* @__PURE__ */ c(function(n) {
  if (!g(this, Ln)) return;
  if (!(n instanceof HTMLFormElement)) {
    O(this, Ln, null);
    return;
  }
  const { fields: i = [], time: r = null } = g(this, Ln) ?? {};
  O(this, Ln, null), I(this, Ae, vh).call(this, n, i), I(this, Ae, wh).call(this, n, r);
}, "#restorePendingFormState"), vh = /* @__PURE__ */ c(function(n, i) {
  if (!Array.isArray(i) || i.length === 0) return;
  const r = typeof (CSS == null ? void 0 : CSS.escape) == "function" ? CSS.escape : (o) => o;
  for (const o of i) {
    if (!o || typeof o.name != "string") continue;
    const s = r(o.name);
    if (o.kind === "checkbox" || o.kind === "radio") {
      const l = `input[type="${o.kind}"][name="${s}"]`, u = n.querySelectorAll(l);
      u.forEach((d) => {
        d instanceof HTMLInputElement && (u.length === 1 || d.value === o.value) && (d.checked = !!o.checked);
      });
      continue;
    }
    if (o.kind === "select-multiple") {
      const l = n.querySelector(`select[name="${s}"]`);
      if (!(l instanceof HTMLSelectElement)) continue;
      const u = new Set(Array.isArray(o.values) ? o.values : []);
      Array.from(l.options ?? []).forEach((d) => {
        d.selected = u.has(d.value);
      });
      continue;
    }
    const a = n.querySelector(`[name="${s}"]`);
    (a instanceof HTMLInputElement || a instanceof HTMLSelectElement || a instanceof HTMLTextAreaElement) && (a.value = o.value ?? "");
  }
}, "#restoreFieldValues"), wh = /* @__PURE__ */ c(function(n, i) {
  var b, w, S;
  const r = n.querySelector("[data-time-format]");
  if (!(r instanceof HTMLElement)) {
    typeof g(this, Je) == "function" && g(this, Je).call(this);
    return;
  }
  const o = ((b = r.dataset) == null ? void 0 : b.timeFormat) === "24h" ? "24h" : "12h", s = r.querySelector("[data-time-hour]"), a = r.querySelector("[data-time-minute]"), l = r.querySelector("[data-time-period]"), u = r.querySelector("[data-time-hidden]");
  if (!i) {
    if (s instanceof HTMLInputElement && (s.value = ""), a instanceof HTMLInputElement && (a.value = ""), l instanceof HTMLSelectElement) {
      const T = ((S = (w = l.options) == null ? void 0 : w[0]) == null ? void 0 : S.value) ?? "";
      l.value = T;
    }
    u instanceof HTMLInputElement && (u.value = ""), typeof g(this, Je) == "function" && g(this, Je).call(this);
    return;
  }
  const d = typeof i.canonical == "string" ? i.canonical : "", f = typeof i.period == "string" ? i.period : "", h = typeof i.hour == "string" ? i.hour : "", m = typeof i.minute == "string" ? i.minute : "";
  let p = "", y = "", E = f, v = d;
  if (d) {
    const T = Id(d, o);
    p = T.hour ?? "", y = T.minute ?? "", v = T.canonical ?? d, o === "12h" ? E = T.period ?? f : E = "";
  } else
    p = h, y = m, o !== "12h" && (E = "");
  if (s instanceof HTMLInputElement && (s.value = p ?? ""), a instanceof HTMLInputElement && (a.value = y ?? ""), l instanceof HTMLSelectElement)
    if (o === "12h") {
      const T = Array.from(l.options ?? []);
      T.find((A) => A.value === E) ? l.value = E : T.length > 0 ? l.value = T[0].value : l.value = "";
    } else
      l.value = "";
  u instanceof HTMLInputElement && (u.value = v ?? ""), typeof g(this, Je) == "function" && g(this, Je).call(this);
}, "#restoreTimeInputs"), Na = new WeakMap(), Lc = /* @__PURE__ */ c(function(n, i) {
  i && i.querySelectorAll("[data-action-config]").forEach((r) => {
    const o = r.dataset.actionConfig === n;
    r.style.display = o ? "" : "none";
  });
}, "#updateActionSections"), $a = new WeakMap(), Eh = /* @__PURE__ */ c(function(n) {
  var f, h, m, p;
  if ((f = g(this, Bn)) == null || f.call(this), O(this, Bn, null), O(this, Je, null), !(n instanceof HTMLFormElement)) return;
  const i = n.querySelector("[data-time-format]"), r = ((h = i == null ? void 0 : i.dataset) == null ? void 0 : h.timeFormat) ?? null;
  if (r !== "12h" && r !== "24h")
    return;
  const o = i.querySelector("[data-time-hidden]"), s = i.querySelector("[data-time-hour]"), a = i.querySelector("[data-time-minute]"), l = r === "12h" ? i.querySelector("[data-time-period]") : null;
  if (!o || !s || !a || r === "12h" && !l) {
    D("Trigger form time inputs missing elements", {
      format: r,
      hasHidden: !!o,
      hasHour: !!s,
      hasMinute: !!a,
      hasPeriod: !!l
    });
    return;
  }
  const u = [s, a, ...l ? [l] : []], d = /* @__PURE__ */ c(() => {
    const { canonical: y, error: E } = xp(
      {
        hour: s.value,
        minute: a.value,
        period: (l == null ? void 0 : l.value) ?? null,
        time: o.value
      },
      r
    );
    o.value = y ?? "";
    const v = E ?? "";
    o.setCustomValidity(v), u.forEach((b) => {
      b.setCustomValidity(v);
    });
  }, "update");
  u.forEach((y) => {
    y.addEventListener("input", d), y.addEventListener("change", d);
  }), d(), O(this, Bn, () => {
    u.forEach((y) => {
      y.removeEventListener("input", d), y.removeEventListener("change", d);
    });
  }), O(this, Je, d), D("Trigger form configured for time input", {
    format: r,
    sceneId: ((m = this.scene) == null ? void 0 : m.id) ?? null,
    triggerId: ((p = this.trigger) == null ? void 0 : p.id) ?? null
  });
}, "#setupTimeInput"), Fa = new WeakMap(), Sh = /* @__PURE__ */ c(async function(n) {
  var o, s, a, l, u;
  if (typeof g(this, Je) == "function" && g(this, Je).call(this), typeof n.checkValidity == "function" && !n.checkValidity()) {
    typeof n.reportValidity == "function" && n.reportValidity(), D("Trigger form submission blocked by validity check", {
      sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
      triggerId: ((s = this.trigger) == null ? void 0 : s.id) ?? null
    });
    return;
  }
  const i = new FormData(n), r = Object.fromEntries(i.entries());
  delete r.timeHour, delete r.timeMinute, delete r.timePeriod, r.allowReplayOnRewind = ((a = n.querySelector('input[name="allowReplayOnRewind"]')) == null ? void 0 : a.checked) ?? !1, D("Processing trigger form submission", {
    sceneId: ((l = this.scene) == null ? void 0 : l.id) ?? null,
    triggerId: ((u = this.trigger) == null ? void 0 : u.id) ?? null,
    allowReplayOnRewind: r.allowReplayOnRewind
  }), await I(this, Ae, Ch).call(this, r), await this.close();
}, "#handleSubmit"), Ch = /* @__PURE__ */ c(async function(n) {
  var o, s, a, l, u, d;
  const i = {
    id: ((o = this.trigger) == null ? void 0 : o.id) ?? fp(),
    time: n.time ?? "",
    action: n.action ?? ps,
    allowReplayOnRewind: !!n.allowReplayOnRewind,
    data: {}
  };
  D("Persisting trigger from form", {
    sceneId: ((s = this.scene) == null ? void 0 : s.id) ?? null,
    triggerId: i.id,
    existingIndex: this.triggerIndex
  }), Ip(i, n);
  const r = pr(this.scene);
  this.triggerIndex !== null && r[this.triggerIndex] ? r[this.triggerIndex] = i : r.push(i);
  try {
    await nh(this.scene, r), D("Trigger list saved", {
      sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
      triggerCount: r.length
    });
  } catch (f) {
    throw console.error(`${k} | Failed to save time trigger`, f), (u = (l = ui.notifications) == null ? void 0 : l.error) == null || u.call(
      l,
      C(
        "EIDOLON.TimeTrigger.TriggerSaveError",
        "Failed to save the scene's time triggers."
      )
    ), f;
  }
  if (this.onSave)
    try {
      this.onSave(r);
    } catch (f) {
      console.error(`${k} | Trigger onSave callback failed`, f), D("Trigger onSave callback failed", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        message: (f == null ? void 0 : f.message) ?? String(f)
      });
    }
}, "#persistTrigger"), c(bn, "TriggerFormApplication"), se(bn, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  ye(bn, bn, "DEFAULT_OPTIONS"),
  {
    id: `${k}-trigger-form`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Rf = ye(bn, bn, "DEFAULT_OPTIONS")) == null ? void 0 : Rf.classes) ?? [], "standard-form", "themed"])
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
)), se(bn, "PARTS", {
  content: {
    template: `modules/${k}/templates/time-trigger-form.html`
  }
});
let Tc = bn;
function Ye(t) {
  return t instanceof HTMLElement ? t : (t == null ? void 0 : t[0]) instanceof HTMLElement ? t[0] : null;
}
c(Ye, "asHTMLElement");
function ws(t) {
  return typeof (t == null ? void 0 : t.changeTab) == "function";
}
c(ws, "isAppV2");
function Du(t, e, n, i = {}) {
  if (ws(t)) {
    t.changeTab(e, n, i);
    return;
  }
  if (typeof (t == null ? void 0 : t.activateTab) == "function") {
    const r = { ...i };
    n != null && Array.isArray(t._tabs) && t._tabs.some((s) => s._group === n) && (r.group = n), r.triggerCallback == null && (r.triggerCallback = !0);
    try {
      t.activateTab(e, r);
    } catch {
      $p(t, e);
    }
  }
}
c(Du, "setActiveTab");
function $p(t, e) {
  var s;
  const n = ((s = t.element) == null ? void 0 : s[0]) ?? t.element;
  if (!(n instanceof HTMLElement)) return;
  const i = n.querySelector("nav.sheet-tabs") ?? n.querySelector("nav.tabs");
  i && i.querySelectorAll("[data-tab]").forEach((a) => a.classList.remove("active")), n.querySelectorAll(".tab[data-tab]").forEach((a) => {
    a.classList.remove("active"), a.setAttribute("hidden", "true");
  });
  const r = i == null ? void 0 : i.querySelector(`[data-tab="${e}"]`), o = n.querySelector(`.tab[data-tab="${e}"]`);
  r == null || r.classList.add("active"), o && (o.classList.add("active"), o.removeAttribute("hidden"));
}
c($p, "_manualTabActivation");
function nr(t) {
  var e, n;
  return typeof t != "string" ? "" : typeof ((e = foundry == null ? void 0 : foundry.utils) == null ? void 0 : e.escapeHTML) == "function" ? foundry.utils.escapeHTML(t) : typeof ((n = Handlebars == null ? void 0 : Handlebars.Utils) == null ? void 0 : n.escapeExpression) == "function" ? Handlebars.Utils.escapeExpression(t) : t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
}
c(nr, "escapeHTML");
function qs(t, e) {
  if (!t || !e) return 0;
  const n = t.split(" / "), i = e.split(" / ");
  let r = 0;
  for (let o = 0; o < Math.min(n.length, i.length) && n[o] === i[o]; o++)
    r++;
  return r;
}
c(qs, "sharedPathDepth");
function Fp(t) {
  var n, i;
  if (!(t instanceof HTMLFormElement)) return {};
  const e = ((i = (n = foundry == null ? void 0 : foundry.applications) == null ? void 0 : n.ux) == null ? void 0 : i.FormDataExtended) ?? globalThis.FormDataExtended ?? null;
  if (!e) return {};
  try {
    const r = new e(t), o = typeof r.object == "object" ? r.object : {};
    return foundry.utils.expandObject(o);
  } catch {
    return {};
  }
}
c(Fp, "readFormData");
const Od = Symbol.for("eidolon.sceneConfig.v13PatchedTabs");
function Pu(t = {}) {
  const {
    tabId: e,
    tabLabel: n,
    getScene: i,
    isApplicable: r,
    renderContent: o,
    debugNamespace: s = "SceneConfigTab",
    onButtonCreate: a,
    onTabCreate: l,
    onAfterRender: u,
    logger: d = {},
    moduleId: f = "eidolon-utilities",
    tabIcon: h = "fa-solid fa-puzzle-piece"
  } = t ?? {};
  if (!e)
    throw new Error("createSceneConfigTabFactory requires a tabId.");
  if (typeof o != "function")
    throw new TypeError("createSceneConfigTabFactory requires a renderContent callback.");
  const m = typeof d.log == "function" ? d.log.bind(d) : (...x) => {
    var R;
    return (R = console.debug) == null ? void 0 : R.call(console, `${s}`, ...x);
  }, p = typeof d.group == "function" ? d.group.bind(d) : (...x) => {
    var R;
    return (R = console.groupCollapsed) == null ? void 0 : R.call(console, `${s}`, ...x);
  }, y = typeof d.groupEnd == "function" ? d.groupEnd.bind(d) : () => {
    var x;
    return (x = console.groupEnd) == null ? void 0 : x.call(console);
  }, E = Symbol(`EIDOLON_SCENE_CONFIG_TAB_CLEANUP_${e}`), v = typeof i == "function" ? i : () => null, b = typeof r == "function" ? r : () => !0, w = typeof n == "function" ? n : () => typeof n == "string" ? n : e;
  function S() {
    var j, q, B, z, Z;
    const x = ((q = (j = foundry == null ? void 0 : foundry.applications) == null ? void 0 : j.sheets) == null ? void 0 : q.SceneConfig) ?? ((B = CONFIG == null ? void 0 : CONFIG.Scene) == null ? void 0 : B.sheetClass);
    if (!x || !ws({ changeTab: (z = x.prototype) == null ? void 0 : z.changeTab })) return;
    const R = x[Od] ?? /* @__PURE__ */ new Set();
    if (R.has(e)) return;
    R.add(e), x[Od] = R;
    const P = (Z = x.TABS) == null ? void 0 : Z.sheet;
    if (P && Array.isArray(P.tabs) && !P.tabs.some((U) => U.id === e)) {
      const U = w({ app: null, scene: null }) ?? e;
      P.tabs.push({
        id: e,
        icon: h,
        label: U
      });
    }
    x.PARTS && !x.PARTS[e] && (x.PARTS[e] = {
      template: `modules/${f}/templates/scene-config-tab-mount.hbs`,
      scrollable: [`.tab[data-tab="${e}"]`]
    }), m("Patched v13 SceneConfig TABS/PARTS", { tabId: e });
  }
  c(S, "patchV13SceneConfig");
  function T(x, R) {
    var j, q;
    const P = v(x);
    if (!b(x, P)) {
      m("Skipped render", {
        tabId: e,
        reason: "inapplicable",
        constructor: ((j = x == null ? void 0 : x.constructor) == null ? void 0 : j.name) ?? null
      });
      return;
    }
    p("render", {
      tabId: e,
      sceneId: (P == null ? void 0 : P.id) ?? null,
      constructor: ((q = x == null ? void 0 : x.constructor) == null ? void 0 : q.name) ?? null
    });
    try {
      const B = Ye(R) ?? Ye(x.element);
      if (!B) {
        m("Missing root element", { tabId: e });
        return;
      }
      ws(x) ? M(x, B, P) : A(x, B, P);
    } finally {
      y();
    }
  }
  c(T, "handleRender");
  function L(x, R, P) {
    var B;
    if (!h) {
      x.textContent = R;
      return;
    }
    const j = (B = x.querySelector("i")) == null ? void 0 : B.cloneNode(!0);
    x.textContent = "";
    const q = j ?? document.createElement("i");
    if (j || (q.className = h, P && (q.inert = !0)), x.append(q, " "), P) {
      const z = document.createElement("span");
      z.textContent = R, x.append(z);
    } else
      x.append(document.createTextNode(R));
  }
  c(L, "setButtonContent");
  function A(x, R, P) {
    var $e, oe, Me, Xe, wt, Ue, Et, V, es, ee, Nt, Ve, qr, ts, jr, pi, Br, yi;
    const q = [
      "nav.sheet-tabs[data-group]",
      "nav.tabs[data-group]",
      "nav.sheet-tabs",
      "nav.tabs"
    ].map((ge) => R.querySelector(ge)).find((ge) => ge instanceof HTMLElement), z = [
      ($e = R.querySelector(".tab[data-tab]")) == null ? void 0 : $e.parentElement,
      R.querySelector(".sheet-body"),
      (Me = (oe = q == null ? void 0 : q.parentElement) == null ? void 0 : oe.querySelector) == null ? void 0 : Me.call(oe, ":scope > .sheet-body"),
      q == null ? void 0 : q.parentElement
    ].find((ge) => ge instanceof HTMLElement), Z = ((Xe = q == null ? void 0 : q.dataset) == null ? void 0 : Xe.group) ?? ((Et = (Ue = (wt = q == null ? void 0 : q.querySelector) == null ? void 0 : wt.call(q, "a[data-group]")) == null ? void 0 : Ue.dataset) == null ? void 0 : Et.group) ?? ((ee = (es = (V = q == null ? void 0 : q.querySelector) == null ? void 0 : V.call(q, "[data-group]")) == null ? void 0 : es.dataset) == null ? void 0 : ee.group) ?? ((qr = (Ve = (Nt = z == null ? void 0 : z.querySelector) == null ? void 0 : Nt.call(z, ".tab[data-group]")) == null ? void 0 : Ve.dataset) == null ? void 0 : qr.group) ?? ((jr = (ts = x._tabs) == null ? void 0 : ts[0]) == null ? void 0 : jr._group) ?? null;
    if (!q || !z) {
      m("Missing navigation elements", {
        tabId: e,
        hasNav: !!q,
        hasBody: !!z
      });
      return;
    }
    let U = q.querySelector(`[data-tab="${e}"]`);
    if (!U) {
      U = document.createElement("a"), U.dataset.action = "tab", Z && (U.dataset.group = Z), U.dataset.tab = e;
      const ge = q.querySelector("a[data-tab]");
      (pi = ge == null ? void 0 : ge.classList) != null && pi.contains("item") && U.classList.add("item"), q.appendChild(U), typeof a == "function" && a({ app: x, button: U, nav: q, scene: P }), m("Created tab button", { tabId: e, group: Z });
    }
    L(U, w({ app: x, scene: P }) ?? e, ws(x));
    let G = z.querySelector(`.tab[data-tab="${e}"]`), me = !1;
    if (!G) {
      me = !0, G = document.createElement("div"), G.classList.add("tab"), G.dataset.tab = e, Z && (G.dataset.group = Z);
      const ge = Th(z);
      z.insertBefore(G, ge ?? null), typeof l == "function" && l({ app: x, tab: G, body: z, scene: P }), m("Created tab container", { tabId: e, group: Z });
    }
    x._eidolonActiveTab === e || ((Br = U.classList) == null ? void 0 : Br.contains("active")) || G.classList.contains("active") ? (q.querySelectorAll("[data-tab].active").forEach((ge) => {
      ge !== U && ge.classList.remove("active");
    }), z.querySelectorAll(".tab[data-tab].active").forEach((ge) => {
      ge !== G && (ge.classList.remove("active"), ge.setAttribute("hidden", "true"));
    }), U.classList.add("active"), G.classList.add("active"), G.removeAttribute("hidden")) : (U.classList.remove("active"), G.classList.remove("active"), G.setAttribute("hidden", "true"));
    const ce = /* @__PURE__ */ c(() => {
      var H, Y;
      ((H = U.classList) != null && H.contains("active") || G.classList.contains("active")) && ((Y = U.classList) == null || Y.add("active"), G.classList.add("active"), G.removeAttribute("hidden"), G.removeAttribute("aria-hidden"), G.style.display === "none" && (G.style.display = ""));
    }, "ensureTabVisible"), Se = /* @__PURE__ */ c(() => {
      ce(), requestAnimationFrame(ce);
    }, "scheduleEnsureTabVisible");
    U.dataset.eidolonEnsureSceneTabVisibility || (U.addEventListener("click", () => {
      x._eidolonActiveTab = e, Du(x, e, Z), requestAnimationFrame(ce);
    }), U.dataset.eidolonEnsureSceneTabVisibility = "true");
    const He = `data-eidolon-nav-watched-${e}`;
    q.hasAttribute(He) || (q.addEventListener("click", (ge) => {
      const H = ge.target.closest("[data-tab]");
      H && H.dataset.tab !== e && delete x._eidolonActiveTab;
    }), q.setAttribute(He, "true")), Tl(x, E, m);
    const gn = o({
      app: x,
      scene: P,
      tab: G,
      tabButton: U,
      ensureTabVisible: ce,
      scheduleEnsureTabVisible: Se
    });
    typeof gn == "function" && Ad(x, E, gn), typeof u == "function" && u({
      app: x,
      scene: P,
      tab: G,
      tabButton: U,
      ensureTabVisible: ce,
      scheduleEnsureTabVisible: Se
    }), me && ((yi = x.setPosition) == null || yi.call(x, { height: "auto" }));
  }
  c(A, "handleRenderV1");
  function M(x, R, P) {
    const j = R.querySelector(`.tab[data-tab="${e}"]`), q = R.querySelector(`nav [data-tab="${e}"]`);
    if (!j || !q) {
      m("v2 mount not found, falling back to v1 injection", { tabId: e }), A(x, R, P);
      return;
    }
    L(q, w({ app: x, scene: P }) ?? e, !0);
    const B = /* @__PURE__ */ c(() => {
      var U;
      !((U = q.classList) != null && U.contains("active")) && !j.classList.contains("active") || (j.classList.add("active"), j.removeAttribute("hidden"), j.removeAttribute("aria-hidden"), j.style.display === "none" && (j.style.display = ""));
    }, "ensureTabVisible"), z = /* @__PURE__ */ c(() => {
      B(), requestAnimationFrame(B);
    }, "scheduleEnsureTabVisible");
    Tl(x, E, m);
    const Z = o({
      app: x,
      scene: P,
      tab: j,
      tabButton: q,
      ensureTabVisible: B,
      scheduleEnsureTabVisible: z
    });
    typeof Z == "function" && Ad(x, E, Z), typeof u == "function" && u({
      app: x,
      scene: P,
      tab: j,
      tabButton: q,
      ensureTabVisible: B,
      scheduleEnsureTabVisible: z
    });
  }
  c(M, "handleRenderV2");
  function F(x) {
    Tl(x, E, m);
  }
  c(F, "handleClose");
  function N() {
    return Hooks.once("init", () => {
      S();
    }), Hooks.on("renderSceneConfig", T), Hooks.on("closeSceneConfig", F), () => $();
  }
  c(N, "register");
  function $() {
    Hooks.off("renderSceneConfig", T), Hooks.off("closeSceneConfig", F);
  }
  return c($, "unregister"), { register: N, unregister: $ };
}
c(Pu, "createSceneConfigTabFactory");
function Ad(t, e, n) {
  if (!t || typeof n != "function") return;
  const i = t == null ? void 0 : t[e];
  Array.isArray(i) || (t[e] = []), t[e].push(n);
}
c(Ad, "registerCleanup");
function Tl(t, e, n) {
  if (!t) return;
  const i = t == null ? void 0 : t[e];
  if (Array.isArray(i))
    for (; i.length > 0; ) {
      const r = i.pop();
      if (typeof r == "function")
        try {
          r();
        } catch (o) {
          n("Cleanup failed", { message: (o == null ? void 0 : o.message) ?? String(o) });
        }
    }
}
c(Tl, "invokeCleanup");
function Th(t) {
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
c(Th, "findFooterElement");
const Dp = Zi(Tc), Pp = `modules/${k}/templates/time-trigger-scene-tab.html`, Rp = Pu({
  tabId: "time-triggers",
  tabLabel: /* @__PURE__ */ c(() => C("EIDOLON.TimeTrigger.Tab", "Time Triggers"), "tabLabel"),
  getScene: at,
  isApplicable: Bp,
  renderContent: /* @__PURE__ */ c(({ app: t, scene: e, tab: n }) => qp(t, n, e), "renderContent"),
  logger: {
    log: D,
    group: Ar,
    groupEnd: ii
  }
});
function Hp() {
  return D("Registering SceneConfig render hook"), Rp.register();
}
c(Hp, "registerSceneConfigHook");
function qp(t, e, n) {
  if (!(e instanceof HTMLElement)) return;
  const i = Re(n) ? n : at(t);
  js(t, e, i);
  const r = $u(() => {
    js(t, e, i);
  });
  return () => {
    if (typeof r == "function")
      try {
        r();
      } catch (o) {
        console.error(
          `${k} | Failed to dispose scene config time format subscription`,
          o
        );
      }
  };
}
c(qp, "renderTimeTriggerTab");
async function js(t, e, n) {
  var r, o;
  const i = n ?? at(t);
  Ar("renderTimeTriggersTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!Re(i)) {
      const j = C(
        "EIDOLON.TimeTrigger.Unavailable",
        "Time triggers are unavailable for this configuration sheet."
      );
      e.innerHTML = `<p class="notes">${j}</p>`, D("Scene lacks document for time triggers", { sceneId: (i == null ? void 0 : i.id) ?? null });
      return;
    }
    const s = `flags.${k}.${Fs}`, a = `flags.${k}.${Xl}`, l = `flags.${k}.${Jl}`, u = !!i.getFlag(k, Fs), d = !!i.getFlag(k, Xl), f = !!i.getFlag(k, Jl), h = pr(i);
    D("Rendering time trigger list", {
      sceneId: i.id,
      isActive: u,
      shouldHideWindow: d,
      shouldShowPlayerWindow: f,
      triggerCount: h.length
    });
    const m = C("EIDOLON.TimeTrigger.Activate", "Activate Time Trigger"), p = C(
      "EIDOLON.TimeTrigger.Description",
      "Enable scene time triggers so scheduled actions can run automatically."
    ), y = C(
      "EIDOLON.TimeTrigger.HideWindowLabel",
      "Hide Floating Time Window"
    ), E = C(
      "EIDOLON.TimeTrigger.HideWindowDescription",
      "Keep the floating time control window hidden while leaving time triggers active."
    ), v = C(
      "EIDOLON.TimeTrigger.ShowPlayerWindowLabel",
      "Share Floating Time Window with Players"
    ), b = C(
      "EIDOLON.TimeTrigger.ShowPlayerWindowDescription",
      "Let non-GM players see the floating time window (without time controls)."
    ), w = C(
      "EIDOLON.TimeTrigger.TriggerListLabel",
      "Scene Time Triggers"
    ), S = C(
      "EIDOLON.TimeTrigger.TriggerListEmpty",
      "No time triggers configured for this scene."
    ), T = C("EIDOLON.TimeTrigger.AddTrigger", "Add Trigger"), L = C("EIDOLON.TimeTrigger.EditTrigger", "Edit"), A = C("EIDOLON.TimeTrigger.DeleteTrigger", "Remove"), M = C("EIDOLON.TimeTrigger.TriggerNow", "Trigger Now"), F = C("EIDOLON.TimeTrigger.AtLabel", "At"), N = C("EIDOLON.TimeTrigger.DoLabel", "Do"), $ = C("EIDOLON.TimeTrigger.MissingTime", "(No time set)"), x = h.map((j, q) => {
      const Z = (j.time ? Mp(j.time) : "") || j.time || "" || $, U = Cp(j.action), G = [
        `${F} ${Z}`,
        `${N} ${U}`,
        ...Tp(j)
      ];
      return {
        index: q,
        summaryParts: G,
        tooltips: {
          triggerNow: M,
          edit: L,
          delete: A
        }
      };
    }), R = ((o = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : o.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof R != "function") {
      console.error(`${k} | renderTemplate is unavailable; cannot render scene tab.`), e.innerHTML = `<p class="notes">${S}</p>`;
      return;
    }
    let P = "";
    try {
      P = await R(Pp, {
        flags: {
          active: s,
          hideWindow: a,
          showPlayerWindow: l
        },
        states: {
          isActive: u,
          hideWindow: d,
          showPlayerWindow: f
        },
        labels: {
          activate: m,
          hideWindow: y,
          showPlayerWindow: v,
          triggerList: w,
          empty: S,
          add: T
        },
        hints: {
          activate: p,
          hideWindow: E,
          showPlayerWindow: b
        },
        triggers: x,
        hasTriggers: x.length > 0
      });
    } catch (j) {
      console.error(`${k} | Failed to render time trigger scene tab template`, j), e.innerHTML = `<p class="notes">${S}</p>`;
      return;
    }
    e.innerHTML = P, jp(t, e, i);
  } finally {
    ii();
  }
}
c(js, "renderTimeTriggersTabContent");
function jp(t, e, n) {
  const i = n ?? at(t);
  if (!Re(i)) return;
  const r = e.querySelector('[data-action="add-trigger"]');
  r && r.addEventListener("click", () => {
    D("Add trigger button clicked", { sceneId: i.id }), Md(t, { scene: i });
  }), e.querySelectorAll('[data-action="edit-trigger"]').forEach((o) => {
    o.addEventListener("click", () => {
      const s = Number(o.dataset.index);
      if (!Number.isInteger(s)) return;
      const l = pr(i)[s];
      l && (D("Edit trigger button clicked", { sceneId: i.id, triggerId: l.id, index: s }), Md(t, { trigger: l, triggerIndex: s, scene: i }));
    });
  }), e.querySelectorAll('[data-action="delete-trigger"]').forEach((o) => {
    o.addEventListener("click", async () => {
      var u, d;
      const s = Number(o.dataset.index);
      if (!Number.isInteger(s)) return;
      const a = pr(i), l = a[s];
      if (l) {
        a.splice(s, 1);
        try {
          D("Deleting trigger", {
            sceneId: i.id,
            index: s,
            triggerId: (l == null ? void 0 : l.id) ?? null
          }), await nh(i, a), await js(t, e, i);
        } catch (f) {
          console.error(`${k} | Failed to delete time trigger`, f), (d = (u = ui.notifications) == null ? void 0 : u.error) == null || d.call(
            u,
            C(
              "EIDOLON.TimeTrigger.TriggerDeleteError",
              "Failed to remove the selected time trigger."
            )
          );
        }
      }
    });
  }), e.querySelectorAll('[data-action="fire-trigger"]').forEach((o) => {
    o.addEventListener("click", async () => {
      var u, d, f, h, m, p, y;
      const s = Number(o.dataset.index);
      if (!Number.isInteger(s)) return;
      const l = pr(i)[s];
      if (l) {
        if (!((u = game.user) != null && u.isGM)) {
          (f = (d = ui.notifications) == null ? void 0 : d.warn) == null || f.call(
            d,
            C("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time.")
          );
          return;
        }
        try {
          D("Manually firing trigger", { sceneId: i.id, triggerId: l.id, index: s }), await ih(i, l), (m = (h = ui.notifications) == null ? void 0 : h.info) == null || m.call(
            h,
            C(
              "EIDOLON.TimeTrigger.TriggerNowSuccess",
              "Triggered the selected time trigger."
            )
          );
        } catch (E) {
          console.error(`${k} | Failed to execute time trigger manually`, E), (y = (p = ui.notifications) == null ? void 0 : p.error) == null || y.call(
            p,
            C(
              "EIDOLON.TimeTrigger.TriggerNowError",
              "Failed to execute the selected time trigger."
            )
          ), D("Manual trigger execution failed", {
            sceneId: i.id,
            triggerId: l.id,
            index: s,
            message: (E == null ? void 0 : E.message) ?? String(E)
          });
        }
      }
    });
  });
}
c(jp, "bindTimeTriggerTabEvents");
function Md(t, e = {}) {
  var s;
  const n = e.scene ?? null, i = n && Re(n) ? n : at(t);
  if (!Re(i)) {
    console.warn(`${k} | Unable to open trigger form because no scene document is available.`);
    return;
  }
  D("Opening trigger form", {
    sceneId: i.id,
    triggerId: ((s = e.trigger) == null ? void 0 : s.id) ?? null,
    index: Number.isInteger(e.triggerIndex) ? Number(e.triggerIndex) : null
  }), Dp({
    scene: i,
    trigger: e.trigger ?? null,
    triggerIndex: e.triggerIndex ?? null,
    onSave: /* @__PURE__ */ c(() => {
      var l, u;
      const a = (u = (l = t.element) == null ? void 0 : l[0]) == null ? void 0 : u.querySelector('.tab[data-tab="time-triggers"]');
      a && js(t, a, i);
    }, "onSave")
  }).render({ force: !0 });
}
c(Md, "openTriggerForm");
function Bp(t, e) {
  var o, s, a, l, u;
  if (!t) return !1;
  const n = ((s = (o = foundry == null ? void 0 : foundry.applications) == null ? void 0 : o.sheets) == null ? void 0 : s.SceneConfig) ?? (globalThis == null ? void 0 : globalThis.SceneConfig);
  if (n && t instanceof n) return !0;
  const i = (a = t == null ? void 0 : t.constructor) == null ? void 0 : a.name;
  if (typeof i == "string" && i.includes("SceneConfig")) return !0;
  if (e) {
    const d = globalThis == null ? void 0 : globalThis.Scene;
    if (d && e instanceof d || (e == null ? void 0 : e.documentName) === "Scene" || (e == null ? void 0 : e.documentName) === "scenes" || (e == null ? void 0 : e.collection) === "scenes") return !0;
  }
  const r = ((l = t == null ? void 0 : t.options) == null ? void 0 : l.baseApplication) ?? ((u = t == null ? void 0 : t.options) == null ? void 0 : u.id);
  return !!(typeof r == "string" && r.includes("SceneConfig"));
}
c(Bp, "isRecognizedSceneConfig");
const rs = new pc(), xd = new yc();
function Up() {
  D("Registering time trigger hooks"), Hooks.once("init", () => {
    hp(), vp(), D("Time trigger settings registered during init");
  }), Hp(), D("Scene config hook registered"), xd.registerHooks(), D("Time automation hooks registered"), Hooks.once("ready", () => {
    wp(), D("Ready hook fired"), rs.onReady(), xd.initialize();
  }), Hooks.on("canvasReady", (t) => {
    var e;
    D("canvasReady hook received", { scene: ((e = t == null ? void 0 : t.scene) == null ? void 0 : e.id) ?? null }), rs.onCanvasReady(t);
  }), Hooks.on("updateScene", (t) => {
    D("updateScene hook received", { scene: (t == null ? void 0 : t.id) ?? null }), rs.onUpdateScene(t);
  }), Hooks.on("updateWorldTime", (t, e) => {
    D("updateWorldTime hook received", { worldTime: t, diff: e }), rs.onUpdateWorldTime(t, e);
  });
}
c(Up, "registerTimeTriggerHooks");
Up();
const Oe = k, Lh = "criteria", Bs = "state", Vp = "criteriaVersion", Gp = 1, Ih = "enableCriteriaSurfaces";
let _d = !1;
function Wp() {
  var t;
  if (!_d) {
    if (_d = !0, !((t = game == null ? void 0 : game.settings) != null && t.register)) {
      console.warn(`${Oe} | game.settings.register unavailable; scene criteria setting skipped.`);
      return;
    }
    game.settings.register(Oe, Ih, {
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
        zp();
      }, "onChange")
    });
  }
}
c(Wp, "registerSceneCriteriaSettings");
function Xa() {
  var t;
  try {
    if ((t = game == null ? void 0 : game.settings) != null && t.get)
      return !!game.settings.get(Oe, Ih);
  } catch (e) {
    console.error(`${Oe} | Failed to read criteria surfaces setting`, e);
  }
  return !0;
}
c(Xa, "getCriteriaSurfacesEnabled");
function zp() {
  var o, s, a, l, u;
  const t = C("EIDOLON.SceneCriteria.ReloadPromptTitle", "Reload Required"), e = `<p>${C(
    "EIDOLON.SceneCriteria.ReloadPromptBody",
    "Changes to criteria editor surfaces require a reload. Reload now?"
  )}</p>`, n = typeof ((o = foundry == null ? void 0 : foundry.utils) == null ? void 0 : o.debouncedReload) == "function", i = /* @__PURE__ */ c(() => {
    n ? foundry.utils.debouncedReload() : window.location.reload();
  }, "reload"), r = (a = (s = foundry == null ? void 0 : foundry.applications) == null ? void 0 : s.api) == null ? void 0 : a.DialogV2;
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
c(zp, "promptReloadForCriteriaSurfaces");
const Us = "Standard";
function bt(t) {
  var n;
  const e = (n = t == null ? void 0 : t.getFlag) == null ? void 0 : n.call(t, Oe, Lh);
  return e ? kh(e) : [];
}
c(bt, "getSceneCriteria");
async function Ja(t, e, n = {}) {
  var o;
  if (!(t != null && t.update)) return;
  const i = kh(e), r = Qa(
    Zt(((o = t == null ? void 0 : t.getFlag) == null ? void 0 : o.call(t, Oe, Bs)) ?? {}),
    i
  );
  await t.update({
    [`flags.${Oe}.${Lh}`]: i,
    [`flags.${Oe}.${Vp}`]: Gp,
    [`flags.${Oe}.${Bs}`]: r
  }, n);
}
c(Ja, "setSceneCriteria");
function Xo(t, e = null) {
  var r;
  const n = Array.isArray(e) ? e : bt(t), i = Zt(((r = t == null ? void 0 : t.getFlag) == null ? void 0 : r.call(t, Oe, Bs)) ?? {});
  return Qa(i, n);
}
c(Xo, "getSceneCriteriaState");
async function Yp(t, e, n = null) {
  if (!(t != null && t.setFlag)) return;
  const i = Array.isArray(n) ? n : bt(t), r = Qa(e, i);
  await t.setFlag(Oe, Bs, r);
}
c(Yp, "setSceneCriteriaState");
function Ru(t = "") {
  const e = typeof t == "string" ? t.trim() : "", n = Oh(kc(e || "criterion"), /* @__PURE__ */ new Set());
  return {
    id: Ah(),
    key: n,
    label: e,
    values: [Us],
    default: Us,
    order: 0
  };
}
c(Ru, "createSceneCriterion");
function kh(t) {
  const e = Array.isArray(t) ? Zt(t) : [], n = [], i = /* @__PURE__ */ new Set();
  return e.forEach((r, o) => {
    const s = Ic(r, o, i);
    s && (n.push(s), i.add(s.key));
  }), n;
}
c(kh, "sanitizeCriteria$1");
function Ic(t, e = 0, n = /* @__PURE__ */ new Set()) {
  if (!t || typeof t != "object") return null;
  const i = typeof t.id == "string" && t.id.trim() ? t.id.trim() : Ah(), o = (typeof t.label == "string" ? t.label : typeof t.name == "string" ? t.name : "").trim(), s = typeof t.key == "string" && t.key.trim() ? kc(t.key) : kc(o || `criterion-${Number(e) + 1}`), a = Oh(s, n), l = Xp(t.values);
  let u = typeof t.default == "string" ? t.default.trim() : "";
  u || (u = l[0] ?? Us), l.includes(u) || l.unshift(u);
  const d = Number.isFinite(t.order) ? Number(t.order) : Number(e);
  return {
    id: i,
    key: a,
    label: o,
    values: l,
    default: u,
    order: d
  };
}
c(Ic, "sanitizeCriterion");
function Qa(t, e = []) {
  const n = t && typeof t == "object" ? Zt(t) : {}, i = {};
  for (const r of e) {
    const o = n == null ? void 0 : n[r.key], s = typeof o == "string" ? o.trim() : "";
    s && r.values.includes(s) ? i[r.key] = s : i[r.key] = r.default;
  }
  return i;
}
c(Qa, "sanitizeSceneCriteriaState");
function Kp(t) {
  return bt(t).map((n) => ({
    id: n.key,
    key: n.key,
    name: n.label,
    values: [...n.values]
  }));
}
c(Kp, "getSceneCriteriaCategories");
function Xp(t) {
  const e = Array.isArray(t) ? t : [], n = [];
  for (const i of e) {
    if (typeof i != "string") continue;
    const r = i.trim();
    !r || n.includes(r) || n.push(r);
  }
  return n.length || n.push(Us), n;
}
c(Xp, "sanitizeCriterionValues");
function kc(t) {
  return String(t ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
c(kc, "slugifyCriterionKey");
function Oh(t, e) {
  if (!e.has(t)) return t;
  let n = 2;
  for (; e.has(`${t}-${n}`); )
    n += 1;
  return `${t}-${n}`;
}
c(Oh, "ensureUniqueCriterionKey");
function Ah() {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 11);
}
c(Ah, "generateCriterionId");
function Mh(t) {
  var e, n;
  console.error(`${Oe} | Failed to persist scene criteria`, t), (n = (e = ui.notifications) == null ? void 0 : e.error) == null || n.call(
    e,
    C(
      "EIDOLON.SceneCriteria.PersistError",
      "Failed to persist the scene criteria."
    )
  );
}
c(Mh, "notifyPersistError");
var Hf, Ce, In, ze, xh, Da, Pa, Ra, Ha, Es, qa, Mo, xo, Xr, _h;
const vn = class vn extends yt(pt) {
  constructor(n = {}) {
    const { scene: i, criterion: r, isNew: o, onSave: s, ...a } = n ?? {};
    super(a);
    _(this, ze);
    _(this, Ce, null);
    _(this, In, !1);
    _(this, Da, /* @__PURE__ */ c(async (n) => {
      n.preventDefault();
      const i = n.currentTarget;
      if (!(i instanceof HTMLFormElement)) return;
      const r = new FormData(i), o = String(r.get("criterionLabel") ?? "").trim(), s = String(r.get("criterionKey") ?? "").trim(), a = Array.from(i.querySelectorAll('[name="criterionValues"]')).map((f) => f instanceof HTMLInputElement ? f.value.trim() : "").filter((f, h, m) => f && m.indexOf(f) === h), u = String(r.get("criterionDefault") ?? "").trim() || a[0] || "Standard", d = Ic(
        {
          id: g(this, Ce).id,
          key: s,
          label: o,
          values: a,
          default: u,
          order: Number(g(this, Ce).order ?? 0)
        },
        0,
        /* @__PURE__ */ new Set()
      );
      d && (O(this, Ce, d), await I(this, ze, _h).call(this), this.close());
    }, "#onSubmit"));
    _(this, Pa, /* @__PURE__ */ c((n) => {
      var s;
      if (g(this, In)) return;
      const i = n.currentTarget, r = (i == null ? void 0 : i.form) ?? ((s = this.element) == null ? void 0 : s.querySelector("form"));
      if (!(r instanceof HTMLFormElement)) return;
      const o = r.querySelector('input[name="criterionKey"]');
      o instanceof HTMLInputElement && (o.value = Gr(i.value));
    }, "#onLabelInput"));
    _(this, Ra, /* @__PURE__ */ c((n) => {
      var l;
      const i = n.currentTarget, r = (i == null ? void 0 : i.form) ?? ((l = this.element) == null ? void 0 : l.querySelector("form"));
      if (!(r instanceof HTMLFormElement) || !(i instanceof HTMLInputElement)) return;
      const o = r.querySelector('input[name="criterionLabel"]'), s = Gr(o instanceof HTMLInputElement ? o.value : ""), a = Gr(i.value);
      O(this, In, a !== s), i.value = a, I(this, ze, Es).call(this, r);
    }, "#onKeyInput"));
    _(this, Ha, /* @__PURE__ */ c((n) => {
      var s, a;
      n.preventDefault();
      const i = ((s = n.currentTarget) == null ? void 0 : s.form) ?? ((a = this.element) == null ? void 0 : a.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector('input[name="criterionLabel"]'), o = i.querySelector('input[name="criterionKey"]');
      o instanceof HTMLInputElement && (o.value = Gr(r instanceof HTMLInputElement ? r.value : ""), O(this, In, !1), I(this, ze, Es).call(this, i));
    }, "#onResetAutoKey"));
    _(this, qa, /* @__PURE__ */ c((n) => {
      var l, u, d, f, h, m;
      n.preventDefault();
      const i = ((l = n.currentTarget) == null ? void 0 : l.form) ?? ((u = this.element) == null ? void 0 : u.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector(".scene-criterion-editor__values");
      if (!(r instanceof HTMLElement)) return;
      (d = r.querySelector(".scene-criterion-editor__empty")) == null || d.remove();
      const o = document.createElement("div");
      o.classList.add("scene-criterion-editor__value");
      const s = Xt(C("EIDOLON.SceneCriteria.ValuePlaceholder", "Allowed value")), a = Xt(C("EIDOLON.SceneCriteria.RemoveValue", "Remove Value"));
      o.innerHTML = `
      <input type="text" name="criterionValues" value="" placeholder="${s}" class="form-control">
      <button type="button" class="icon" data-action="remove-value" aria-label="${a}" title="${a}">
        <i class="fa-solid fa-trash"></i>
      </button>
    `, r.appendChild(o), (f = o.querySelector('[data-action="remove-value"]')) == null || f.addEventListener("click", g(this, Mo)), (h = o.querySelector('input[name="criterionValues"]')) == null || h.addEventListener("input", g(this, xo)), I(this, ze, Xr).call(this, i), (m = o.querySelector('input[name="criterionValues"]')) == null || m.focus();
    }, "#onAddValue"));
    _(this, Mo, /* @__PURE__ */ c((n) => {
      var o, s, a, l;
      n.preventDefault(), (s = (o = n.currentTarget) == null ? void 0 : o.closest(".scene-criterion-editor__value")) == null || s.remove();
      const i = ((a = n.currentTarget) == null ? void 0 : a.form) ?? ((l = this.element) == null ? void 0 : l.querySelector("form"));
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
        I(this, ze, Xr).call(this, i);
      }
    }, "#onRemoveValue"));
    _(this, xo, /* @__PURE__ */ c((n) => {
      var r, o;
      const i = ((r = n.currentTarget) == null ? void 0 : r.form) ?? ((o = this.element) == null ? void 0 : o.querySelector("form"));
      i instanceof HTMLFormElement && I(this, ze, Xr).call(this, i);
    }, "#onValuesChanged"));
    this.scene = i ?? null, this.criterion = r ?? null, this.onSave = typeof s == "function" ? s : null, this.isNew = !!o, O(this, Ce, I(this, ze, xh).call(this)), O(this, In, g(this, Ce).key !== Gr(g(this, Ce).label));
  }
  async _prepareContext() {
    var i, r, o, s;
    const n = Array.isArray((i = g(this, Ce)) == null ? void 0 : i.values) ? g(this, Ce).values : [];
    return {
      isNew: this.isNew,
      key: ((r = g(this, Ce)) == null ? void 0 : r.key) ?? "",
      label: ((o = g(this, Ce)) == null ? void 0 : o.label) ?? "",
      defaultValue: ((s = g(this, Ce)) == null ? void 0 : s.default) ?? "",
      values: n.map((a, l) => {
        var u;
        return {
          index: l,
          value: a,
          selected: a === ((u = g(this, Ce)) == null ? void 0 : u.default)
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
      keyIsCustom: g(this, In)
    };
  }
  _onRender(n, i) {
    var o, s, a, l, u, d;
    super._onRender(n, i);
    const r = (o = this.element) == null ? void 0 : o.querySelector("form");
    r && (r.addEventListener("submit", g(this, Da)), (s = r.querySelector('[data-action="add-value"]')) == null || s.addEventListener("click", g(this, qa)), (a = r.querySelector('input[name="criterionLabel"]')) == null || a.addEventListener("input", g(this, Pa)), (l = r.querySelector('input[name="criterionKey"]')) == null || l.addEventListener("input", g(this, Ra)), (u = r.querySelector('[data-action="reset-auto-key"]')) == null || u.addEventListener("click", g(this, Ha)), r.querySelectorAll('[data-action="remove-value"]').forEach((f) => {
      f.addEventListener("click", g(this, Mo));
    }), r.querySelectorAll('input[name="criterionValues"]').forEach((f) => {
      f.addEventListener("input", g(this, xo));
    }), (d = r.querySelector('[data-action="cancel"]')) == null || d.addEventListener("click", (f) => {
      f.preventDefault(), this.close();
    }), I(this, ze, Es).call(this, r), I(this, ze, Xr).call(this, r));
  }
};
Ce = new WeakMap(), In = new WeakMap(), ze = new WeakSet(), xh = /* @__PURE__ */ c(function() {
  const n = Ic(this.criterion, 0, /* @__PURE__ */ new Set()) ?? Ru(C("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion"));
  return {
    id: n.id,
    key: n.key,
    label: n.label ?? "",
    values: Array.isArray(n.values) ? [...n.values] : [],
    default: n.default
  };
}, "#initializeState"), Da = new WeakMap(), Pa = new WeakMap(), Ra = new WeakMap(), Ha = new WeakMap(), Es = /* @__PURE__ */ c(function(n) {
  const i = n.querySelector('[data-action="reset-auto-key"]');
  i instanceof HTMLButtonElement && (i.disabled = !g(this, In));
}, "#syncAutoKeyButton"), qa = new WeakMap(), Mo = new WeakMap(), xo = new WeakMap(), Xr = /* @__PURE__ */ c(function(n) {
  var l, u;
  const i = n.querySelector('select[name="criterionDefault"]');
  if (!(i instanceof HTMLSelectElement)) return;
  const r = ((u = (l = i.value) == null ? void 0 : l.trim) == null ? void 0 : u.call(l)) ?? "", o = Array.from(n.querySelectorAll('input[name="criterionValues"]')).map((d) => d instanceof HTMLInputElement ? d.value.trim() : "").filter((d, f, h) => d && h.indexOf(d) === f), s = i.dataset.emptyLabel || C("EIDOLON.SceneCriteria.ValueListEmpty", "No values have been added to this criterion.");
  if (i.innerHTML = "", !o.length) {
    const d = document.createElement("option");
    d.value = "", d.textContent = s, d.selected = !0, i.appendChild(d);
    return;
  }
  const a = o.includes(r) ? r : o[0];
  for (const d of o) {
    const f = document.createElement("option");
    f.value = d, f.textContent = d, f.selected = d === a, i.appendChild(f);
  }
}, "#syncDefaultOptions"), _h = /* @__PURE__ */ c(async function() {
  if (!this.scene) return;
  const n = bt(this.scene).sort((r, o) => r.order - o.order), i = n.findIndex((r) => r.id === g(this, Ce).id);
  i < 0 ? (g(this, Ce).order = n.length, n.push(g(this, Ce))) : (g(this, Ce).order = n[i].order, n.splice(i, 1, g(this, Ce)));
  try {
    await Ja(this.scene, n), this.onSave && await this.onSave(g(this, Ce));
  } catch (r) {
    Mh(r);
  }
}, "#persist"), c(vn, "CategoryEditorApplication"), se(vn, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  ye(vn, vn, "DEFAULT_OPTIONS"),
  {
    id: `${Oe}-criterion-editor`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Hf = ye(vn, vn, "DEFAULT_OPTIONS")) == null ? void 0 : Hf.classes) ?? [], "standard-form", "themed"])
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
)), se(vn, "PARTS", {
  content: {
    template: `modules/${Oe}/templates/scene-criteria-editor.html`
  }
});
let Oc = vn;
function Gr(t) {
  return String(t ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
c(Gr, "slugifyKey");
const Jp = `modules/${Oe}/templates/scene-criteria-tab.html`, Ac = {
  log: /* @__PURE__ */ c((...t) => {
    var e;
    return (e = console.debug) == null ? void 0 : e.call(console, `${Oe} | Criteria`, ...t);
  }, "log"),
  group: /* @__PURE__ */ c((...t) => {
    var e;
    return (e = console.groupCollapsed) == null ? void 0 : e.call(console, `${Oe} | Criteria`, ...t);
  }, "group"),
  groupEnd: /* @__PURE__ */ c(() => {
    var t;
    return (t = console.groupEnd) == null ? void 0 : t.call(console);
  }, "groupEnd")
}, Qp = Zi(Oc), Zp = Pu({
  tabId: "criteria",
  tabLabel: /* @__PURE__ */ c(() => C("EIDOLON.SceneCriteria.TabLabel", "Criteria"), "tabLabel"),
  getScene: at,
  isApplicable: /* @__PURE__ */ c(() => Xa(), "isApplicable"),
  renderContent: /* @__PURE__ */ c(({ app: t, tab: e, scene: n }) => ty(t, e, n), "renderContent"),
  logger: Ac
});
function ey() {
  return Zp.register();
}
c(ey, "registerSceneCriteriaConfigHook");
function ty(t, e, n) {
  if (!(e instanceof HTMLElement)) return;
  const i = Re(n) ? n : at(t);
  or(t, e, i);
}
c(ty, "renderCriteriaTab");
async function or(t, e, n) {
  var r, o;
  const i = n ?? at(t);
  Ac.group("renderCriteriaTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!Re(i)) {
      const d = C(
        "EIDOLON.SceneCriteria.Unavailable",
        "Scene criteria are unavailable for this configuration sheet."
      );
      e.innerHTML = `<p class="notes">${d}</p>`;
      return;
    }
    const s = bt(i).sort((d, f) => d.order - f.order), a = Xo(i, s), l = ((o = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : o.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof l != "function") {
      e.innerHTML = `<p class="notes">${C("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
      return;
    }
    const u = await l(Jp, {
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
        criteriaCount: s.length,
        valueCount: s.reduce((d, f) => d + f.values.length, 0)
      },
      criteria: s.map((d, f) => {
        var h, m;
        return {
          id: d.id,
          label: d.label,
          displayName: ((m = (h = d.label) == null ? void 0 : h.trim) == null ? void 0 : m.call(h)) || C("EIDOLON.SceneCriteria.UnnamedCategory", "Unnamed Criterion"),
          hasValues: d.values.length > 0,
          values: d.values.map((p) => ({
            value: p,
            isCurrent: (a[d.key] ?? d.default) === p
          })),
          valueCountLabel: iy(d.values.length),
          canMoveUp: f > 0,
          canMoveDown: f < s.length - 1
        };
      }),
      hasCriteria: s.length > 0
    });
    e.innerHTML = u, ny(t, e, i);
  } catch (s) {
    console.error(`${Oe} | Failed to render criteria tab`, s), e.innerHTML = `<p class="notes">${C("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
  } finally {
    Ac.groupEnd();
  }
}
c(or, "renderCriteriaTabContent");
function ny(t, e, n) {
  const i = n ?? at(t);
  if (!Re(i)) return;
  const r = e.querySelector('[data-criteria-action="add"]');
  r && r.addEventListener("click", () => {
    Nd(t, {
      scene: i,
      criterion: Ru(
        C("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion")
      ),
      isNew: !0,
      onSave: /* @__PURE__ */ c(() => or(t, e, i), "onSave")
    });
  }), e.querySelectorAll('[data-criteria-action="edit"]').forEach((o) => {
    const s = o.dataset.criterionId;
    s && o.addEventListener("click", () => {
      const a = bt(i).find((l) => l.id === s);
      a && Nd(t, {
        scene: i,
        criterion: a,
        onSave: /* @__PURE__ */ c(() => or(t, e, i), "onSave")
      });
    });
  }), e.querySelectorAll('[data-criteria-action="remove"]').forEach((o) => {
    const s = o.dataset.criterionId;
    s && o.addEventListener("click", async () => {
      await Ll(i, (l) => {
        const u = l.findIndex((d) => d.id === s);
        return u < 0 ? !1 : (l.splice(u, 1), Il(l), !0);
      }) && await or(t, e, i);
    });
  }), e.querySelectorAll('[data-criteria-action="move-up"]').forEach((o) => {
    const s = o.dataset.criterionId;
    s && o.addEventListener("click", async () => {
      await Ll(i, (l) => {
        const u = l.findIndex((f) => f.id === s);
        if (u <= 0) return !1;
        const [d] = l.splice(u, 1);
        return l.splice(u - 1, 0, d), Il(l), !0;
      }) && await or(t, e, i);
    });
  }), e.querySelectorAll('[data-criteria-action="move-down"]').forEach((o) => {
    const s = o.dataset.criterionId;
    s && o.addEventListener("click", async () => {
      await Ll(i, (l) => {
        const u = l.findIndex((f) => f.id === s);
        if (u < 0 || u >= l.length - 1) return !1;
        const [d] = l.splice(u, 1);
        return l.splice(u + 1, 0, d), Il(l), !0;
      }) && await or(t, e, i);
    });
  });
}
c(ny, "bindCriteriaTabEvents");
async function Ll(t, e) {
  const n = bt(t).sort((r, o) => r.order - o.order);
  if (e(n) === !1) return !1;
  try {
    return await Ja(t, n, { render: !1 }), !0;
  } catch (r) {
    return Mh(r), !1;
  }
}
c(Ll, "mutateCriteria");
function Nd(t, e = {}) {
  const n = e.scene ?? null, i = n && Re(n) ? n : at(t);
  if (!Re(i))
    return;
  Qp({
    scene: i,
    criterion: e.criterion ?? null,
    isNew: !!e.isNew,
    onSave: typeof e.onSave == "function" ? e.onSave : null
  }).render({ force: !0 });
}
c(Nd, "openCriterionEditor");
function Il(t) {
  t.forEach((e, n) => {
    e.order = n;
  });
}
c(Il, "reindexCriteriaOrder");
function iy(t) {
  var e, n;
  if ((n = (e = game.i18n) == null ? void 0 : e.has) != null && n.call(e, "EIDOLON.SceneCriteria.ValueCountLabel"))
    try {
      return game.i18n.format("EIDOLON.SceneCriteria.ValueCountLabel", { count: t });
    } catch (i) {
      console.error(`${Oe} | Failed to format value count label`, i);
    }
  return t === 0 ? "No values configured" : t === 1 ? "1 value" : `${t} values`;
}
c(iy, "formatValueCount");
let $d = !1;
function ry() {
  Hooks.once("init", () => {
    Wp();
  }), Hooks.once("ready", () => {
    Xa() && ($d || (ey(), $d = !0));
  });
}
c(ry, "registerSceneCriteriaHooks");
ry();
const ie = k, Nh = "criteriaEngineVersion", Ui = "fileIndex", Vi = "tileCriteria", Hu = {
  LEGACY: 1,
  CRITERIA: 2
}, $h = Hu.CRITERIA;
function Fh(t) {
  var e;
  return ((e = t == null ? void 0 : t.getFlag) == null ? void 0 : e.call(t, ie, Nh)) ?? Hu.LEGACY;
}
c(Fh, "getSceneEngineVersion");
function oy(t, e, n, i, r) {
  if (!(t != null && t.length) || !(n != null && n.length)) return -1;
  const o = {};
  for (const a of n)
    o[a] = e[a];
  const s = Fd(t, o, n);
  if (s >= 0) return s;
  if (i != null && i.length && r) {
    const a = { ...o };
    for (const l of i) {
      if (!(l in a)) continue;
      a[l] = r[l] ?? "Standard";
      const u = Fd(t, a, n);
      if (u >= 0) return u;
    }
  }
  return -1;
}
c(oy, "findBestMatch");
function Fd(t, e, n) {
  return t.findIndex((i) => {
    for (const r of n)
      if (i[r] !== e[r]) return !1;
    return !0;
  });
}
c(Fd, "findExactMatch");
function sy(t, e) {
  if (!(t != null && t.length)) return -1;
  let n = -1, i = -1;
  for (let r = 0; r < t.length; r += 1) {
    const o = t[r] ?? {}, s = Object.keys(o);
    if (s.length === 0) {
      i < 0 && (n = r, i = 0);
      continue;
    }
    let a = !0;
    for (const l of s)
      if (o[l] !== e[l]) {
        a = !1;
        break;
      }
    a && s.length > i && (n = r, i = s.length);
  }
  return n;
}
c(sy, "findFileIndex");
function Ss(t) {
  return t && typeof t == "object" && !Array.isArray(t);
}
c(Ss, "isPlainObject$2");
function Dd(t) {
  return t == null ? t : typeof structuredClone == "function" ? structuredClone(t) : JSON.parse(JSON.stringify(t));
}
c(Dd, "deepClone");
function ay(t, e) {
  if (!e) return;
  const n = e.split(".").filter(Boolean);
  if (!n.length) return;
  let i = t;
  for (let r = 0; r < n.length - 1; r += 1) {
    if (!Ss(i == null ? void 0 : i[n[r]])) return;
    i = i[n[r]];
  }
  delete i[n.at(-1)];
}
c(ay, "deletePath");
function Dh(t, e) {
  const n = Dd(t ?? {});
  if (!Ss(e)) return n;
  for (const [i, r] of Object.entries(e)) {
    if (i.startsWith("-=") && r === !0) {
      ay(n, i.slice(2));
      continue;
    }
    Ss(r) && Ss(n[i]) ? n[i] = Dh(n[i], r) : n[i] = Dd(r);
  }
  return n;
}
c(Dh, "fallbackMerge");
function ly(t, e) {
  var n, i;
  return (n = foundry == null ? void 0 : foundry.utils) != null && n.mergeObject && ((i = foundry == null ? void 0 : foundry.utils) != null && i.deepClone) ? foundry.utils.mergeObject(t, foundry.utils.deepClone(e), {
    inplace: !1
  }) : Dh(t, e);
}
c(ly, "defaultMerge");
function cy(t, e) {
  if (!t) return !0;
  for (const n of Object.keys(t))
    if (t[n] !== e[n]) return !1;
  return !0;
}
c(cy, "criteriaMatch");
function Ph(t, e, n, i) {
  const r = i ?? ly;
  let o = r({}, t ?? {});
  if (!(e != null && e.length)) return o;
  const s = [];
  for (let a = 0; a < e.length; a += 1) {
    const l = e[a];
    if (cy(l == null ? void 0 : l.criteria, n)) {
      const u = l != null && l.criteria ? Object.keys(l.criteria).length : 0;
      s.push({ specificity: u, index: a, delta: l == null ? void 0 : l.delta });
    }
  }
  s.sort((a, l) => a.specificity - l.specificity || a.index - l.index);
  for (const a of s)
    a.delta && (o = r(o, a.delta));
  return o;
}
c(Ph, "resolveRules");
function Za(t = null) {
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
c(Za, "canManageCriteria");
function uy(t = null) {
  if (!Za(t))
    throw new Error(`${ie} | You do not have permission to manage scene criteria.`);
}
c(uy, "requireCriteriaAccess");
const Pd = 200;
function Rh(t) {
  return t ? Number.isInteger(t.size) ? t.size : Array.isArray(t) || typeof t.length == "number" ? t.length : Array.from(t).length : 0;
}
c(Rh, "getCollectionSize");
function zt() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
c(zt, "nowMs");
function Hh(t) {
  if (!Array.isArray(t)) return [];
  const e = /* @__PURE__ */ new Set();
  for (const n of t) {
    if (typeof n != "string") continue;
    const i = n.trim();
    i && e.add(i);
  }
  return Array.from(e);
}
c(Hh, "uniqueStringKeys");
function dy(t, e = Pd) {
  if (!Array.isArray(t) || t.length === 0) return [];
  const n = Number.isInteger(e) && e > 0 ? e : Pd, i = [];
  for (let r = 0; r < t.length; r += n)
    i.push(t.slice(r, r + n));
  return i;
}
c(dy, "chunkArray");
function cr(t) {
  return !!t && typeof t == "object" && !Array.isArray(t);
}
c(cr, "isPlainObject$1");
function Mc(t, e) {
  if (Object.is(t, e)) return !0;
  if (Array.isArray(t) || Array.isArray(e)) {
    if (!Array.isArray(t) || !Array.isArray(e) || t.length !== e.length) return !1;
    for (let n = 0; n < t.length; n += 1)
      if (!Mc(t[n], e[n])) return !1;
    return !0;
  }
  if (cr(t) || cr(e)) {
    if (!cr(t) || !cr(e)) return !1;
    const n = Object.keys(e);
    for (const i of n)
      if (!Mc(t[i], e[i])) return !1;
    return !0;
  }
  return !1;
}
c(Mc, "areValuesEqual");
function yr(t) {
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
c(yr, "normalizeFilePath");
function qh(t) {
  return typeof (t == null ? void 0 : t.name) == "string" ? t.name : typeof (t == null ? void 0 : t.src) == "string" ? t.src : "";
}
c(qh, "getFilePath");
function qu(t) {
  if (!Array.isArray(t)) return [];
  const e = /* @__PURE__ */ new Map();
  return t.map((n, i) => {
    const r = yr(qh(n)), o = r || `__index:${i}`, s = e.get(o) ?? 0;
    e.set(o, s + 1);
    const a = {
      indexHint: i
    };
    return r && (a.path = r, a.occurrence = s), {
      index: i,
      path: r,
      occurrence: s,
      target: a,
      label: r.split("/").pop() || `File ${i + 1}`
    };
  });
}
c(qu, "buildTileFileEntries");
function ci(t, e) {
  if (!Number.isInteger(e) || e < 0) return null;
  const i = qu(t).find((r) => r.index === e);
  return i ? { ...i.target } : { indexHint: e };
}
c(ci, "createTileTargetFromIndex");
function el(t) {
  if (!t || typeof t != "object") return null;
  const e = yr(t.path), n = Number(t.indexHint ?? t.fileIndex), i = Number(t.occurrence), r = {};
  return e && (r.path = e, r.occurrence = Number.isInteger(i) && i >= 0 ? i : 0), Number.isInteger(n) && n >= 0 && (r.indexHint = n), !r.path && !Number.isInteger(r.indexHint) ? null : r;
}
c(el, "normalizeTileTarget");
function yo(t, e) {
  const n = el(t);
  if (!n) return -1;
  const i = qu(e);
  if (!i.length) return -1;
  if (n.path) {
    const r = i.filter((o) => o.path === n.path);
    if (r.length > 0) {
      const o = Number.isInteger(n.occurrence) ? n.occurrence : 0;
      if (r[o]) return r[o].index;
      if (Number.isInteger(n.indexHint)) {
        const s = r.find((a) => a.index === n.indexHint);
        if (s) return s.index;
      }
      return r[0].index;
    }
  }
  return Number.isInteger(n.indexHint) && n.indexHint < i.length ? n.indexHint : -1;
}
c(yo, "resolveTileTargetIndex");
function di(t) {
  if (!t || typeof t != "object" || Array.isArray(t)) return {};
  const e = {};
  for (const [n, i] of Object.entries(t))
    typeof n != "string" || !n || typeof i != "string" || !i.trim() || (e[n] = i.trim());
  return e;
}
c(di, "sanitizeCriteria");
function fy(t) {
  return Object.entries(di(t)).sort(([n], [i]) => n.localeCompare(i)).map(([n, i]) => `${n}=${i}`).join("");
}
c(fy, "serializeCriteria");
function hy(t) {
  return Object.keys(di(t)).length;
}
c(hy, "getCriteriaSpecificity");
function my(t, e) {
  const n = di(t), i = di(e);
  for (const [r, o] of Object.entries(n))
    if (r in i && i[r] !== o)
      return !1;
  return !0;
}
c(my, "areCriteriaCompatible");
function gy(t, e) {
  const n = yo(t, e);
  if (Number.isInteger(n) && n >= 0)
    return `index:${n}`;
  const i = el(t);
  if (!i) return "";
  if (i.path) {
    const r = Number.isInteger(i.occurrence) ? i.occurrence : 0;
    return `path:${i.path}#${r}`;
  }
  return Number.isInteger(i.indexHint) ? `hint:${i.indexHint}` : "";
}
c(gy, "getTargetIdentity");
function jh(t, e = {}) {
  var a;
  const n = Array.isArray(e.files) ? e.files : [], i = Yi(t, { files: n });
  if (!((a = i == null ? void 0 : i.variants) != null && a.length))
    return {
      errors: [],
      warnings: []
    };
  const r = i.variants.map((l, u) => ({
    index: u,
    criteria: di(l.criteria),
    specificity: hy(l.criteria),
    criteriaSignature: fy(l.criteria),
    targetIdentity: gy(l.target, n)
  })), o = [], s = [];
  for (let l = 0; l < r.length; l += 1) {
    const u = r[l];
    for (let d = l + 1; d < r.length; d += 1) {
      const f = r[d];
      if (u.specificity !== f.specificity || !my(u.criteria, f.criteria)) continue;
      if (!(!!u.targetIdentity && u.targetIdentity === f.targetIdentity)) {
        o.push({
          leftIndex: u.index,
          rightIndex: f.index,
          type: u.criteriaSignature === f.criteriaSignature ? "equivalent" : "overlap",
          specificity: u.specificity
        });
        continue;
      }
      u.criteriaSignature === f.criteriaSignature && s.push({
        leftIndex: u.index,
        rightIndex: f.index,
        type: "duplicate"
      });
    }
  }
  return {
    errors: o,
    warnings: s
  };
}
c(jh, "detectTileCriteriaConflicts");
function py(t, e) {
  if (!t || typeof t != "object") return null;
  let n = el(t.target);
  if (!n) {
    const i = Number(t.fileIndex);
    Number.isInteger(i) && i >= 0 && (n = ci(e, i));
  }
  return n ? {
    criteria: di(t.criteria),
    target: n
  } : null;
}
c(py, "normalizeTileVariant");
function Bh(t, e = {}) {
  if (!Array.isArray(t) || t.length === 0) return null;
  const n = Array.isArray(e.files) ? e.files : null, i = t.map((l, u) => ({
    criteria: di(l),
    target: ci(n, u)
  })).filter((l) => l.target);
  if (!i.length) return null;
  const r = i.find((l) => Object.keys(l.criteria).length === 0), o = (r == null ? void 0 : r.target) ?? i[0].target;
  let s = null;
  const a = Number(e.defaultFileIndex);
  return Number.isInteger(a) && a >= 0 && (s = ci(n, a)), s || (s = o), {
    strategy: "select-one",
    variants: i,
    defaultTarget: s
  };
}
c(Bh, "buildTileCriteriaFromFileIndex");
function Yi(t, e = {}) {
  const n = Array.isArray(e.files) ? e.files : null;
  if (Array.isArray(t))
    return Bh(t, { files: n });
  if (!t || typeof t != "object") return null;
  const i = Array.isArray(t.variants) ? t.variants.map((o) => py(o, n)).filter(Boolean) : [];
  if (!i.length) return null;
  let r = el(t.defaultTarget);
  if (!r) {
    const o = Number(t.defaultFileIndex);
    Number.isInteger(o) && o >= 0 && (r = ci(n, o));
  }
  if (!r) {
    const o = i.find((s) => Object.keys(s.criteria).length === 0);
    r = (o == null ? void 0 : o.target) ?? i[0].target;
  }
  return {
    strategy: "select-one",
    variants: i,
    defaultTarget: r
  };
}
c(Yi, "normalizeTileCriteria");
let Vs = /* @__PURE__ */ new WeakMap();
function yy(t, e) {
  const n = Yi(t, { files: e });
  if (!n) return null;
  const i = n.variants.map((o) => {
    const s = di(o.criteria), a = yo(o.target, e);
    return !Number.isInteger(a) || a < 0 ? null : {
      criteria: s,
      keys: Object.keys(s),
      targetIndex: a
    };
  }).filter(Boolean), r = yo(n.defaultTarget, e);
  return !i.length && (!Number.isInteger(r) || r < 0) ? null : {
    variants: i,
    defaultIndex: r
  };
}
c(yy, "compileTileMatcher");
function by(t, e, n) {
  const i = Vs.get(t);
  if (i && i.tileCriteria === e && i.files === n)
    return i.compiled;
  const r = yy(e, n);
  return Vs.set(t, {
    tileCriteria: e,
    files: n,
    compiled: r
  }), r;
}
c(by, "getCompiledTileMatcher");
function vy(t, e) {
  if (!t) return -1;
  let n = -1, i = -1;
  for (const r of t.variants) {
    const o = r.keys;
    let s = !0;
    for (const a of o)
      if (r.criteria[a] !== (e == null ? void 0 : e[a])) {
        s = !1;
        break;
      }
    s && o.length > i && (i = o.length, n = r.targetIndex);
  }
  return n >= 0 ? n : t.defaultIndex;
}
c(vy, "selectTileFileIndexFromCompiled");
function Rd(t = null) {
  t ? Vs.delete(t) : Vs = /* @__PURE__ */ new WeakMap();
}
c(Rd, "invalidateTileMatcherCache");
function wy({ extractKeys: t, label: e = "doc" }) {
  let n = /* @__PURE__ */ new WeakMap();
  function i(a, l) {
    const u = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Set();
    for (const f of l) {
      const h = t(f);
      if (h) {
        d.add(f.id);
        for (const m of h)
          u.has(m) || u.set(m, /* @__PURE__ */ new Set()), u.get(m).add(f.id);
      }
    }
    return { collection: l, keyToDocIds: u, allDocIds: d };
  }
  c(i, "build");
  function r(a, l) {
    const u = n.get(a);
    if ((u == null ? void 0 : u.collection) === l) return u;
    const d = i(a, l);
    return n.set(a, d), d;
  }
  c(r, "get");
  function o(a, l, u) {
    const d = Hh(u), f = r(a, l);
    if (!d.length)
      return typeof (l == null ? void 0 : l.get) == "function" ? Array.from(f.allDocIds).map((m) => l.get(m)).filter(Boolean) : Array.from(l ?? []).filter((m) => f.allDocIds.has(m.id));
    const h = /* @__PURE__ */ new Set();
    for (const m of d) {
      const p = f.keyToDocIds.get(m);
      if (p)
        for (const y of p) h.add(y);
    }
    return h.size ? typeof (l == null ? void 0 : l.get) == "function" ? Array.from(h).map((m) => l.get(m)).filter(Boolean) : Array.from(l ?? []).filter((m) => h.has(m.id)) : [];
  }
  c(o, "getAffectedDocs");
  function s(a = null) {
    a ? n.delete(a) : n = /* @__PURE__ */ new WeakMap();
  }
  return c(s, "invalidate"), { getAffectedDocs: o, invalidate: s };
}
c(wy, "createDependencyIndexManager");
async function Uh(t, e, n, i) {
  const r = dy(n, i);
  for (const o of r)
    await t.updateEmbeddedDocuments(e, o), r.length > 1 && await Promise.resolve();
  return r.length;
}
c(Uh, "updateDocumentsInChunks");
const xc = /* @__PURE__ */ c((...t) => console.log(`${ie} | criteria tiles:`, ...t), "log$1"), Vh = wy({
  label: "tile",
  extractKeys(t) {
    var r;
    const e = t.getFlag(ie, Vi) ?? t.getFlag(ie, Ui);
    if (!e) return null;
    const n = Yi(e, { files: null });
    if (!((r = n == null ? void 0 : n.variants) != null && r.length)) return [];
    const i = [];
    for (const o of n.variants)
      for (const s of Object.keys(o.criteria ?? {}))
        s && i.push(s);
    return i;
  }
});
function Ey(t = null, e = null) {
  Vh.invalidate(t ?? void 0), e ? Rd(e) : t || Rd(null);
}
c(Ey, "invalidateTileCriteriaCaches");
async function Gh(t, e, n = {}) {
  var l, u, d, f, h, m, p, y;
  const i = zt(), r = {
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
    return r.durationMs = zt() - i, r;
  const o = e.getEmbeddedCollection("Tile") ?? [];
  r.total = Rh(o);
  const s = Vh.getAffectedDocs(e, o, n.changedKeys);
  if (r.scanned = s.length, !s.length)
    return r.skipped.unaffected = r.total, r.durationMs = zt() - i, r;
  const a = [];
  for (const E of s) {
    const v = E.getFlag(ie, Vi) ?? E.getFlag(ie, Ui);
    if (!v) {
      r.skipped.noCriteria += 1;
      continue;
    }
    const b = E.getFlag("monks-active-tiles", "files");
    if (!(b != null && b.length)) {
      r.skipped.noFiles += 1;
      continue;
    }
    const w = by(E, v, b), S = vy(w, t);
    if (!Number.isInteger(S) || S < 0 || S >= b.length) {
      console.warn(`${ie} | Tile ${E.id} has no valid file match for state`, t), r.skipped.noMatch += 1;
      continue;
    }
    const T = S, A = Number(E.getFlag("monks-active-tiles", "fileindex")) !== T, M = b.some((P, j) => !!(P != null && P.selected) != (j === S)), F = yr(((u = E.texture) == null ? void 0 : u.src) ?? ((f = (d = E._source) == null ? void 0 : d.texture) == null ? void 0 : f.src) ?? ""), N = qh(b[S]), $ = yr(N), x = !!$ && $ !== F;
    if (!M && !A && !x) {
      r.skipped.unchanged += 1;
      continue;
    }
    const R = {
      _id: E._id
    };
    M && (R["flags.monks-active-tiles.files"] = b.map((P, j) => ({
      ...P,
      selected: j === S
    }))), A && (R["flags.monks-active-tiles.fileindex"] = T), x && (R.texture = { src: N }), a.push(R), xc(`Tile ${E.id} -> ${N}`);
  }
  if (a.length > 0) {
    const E = /* @__PURE__ */ new Map(), v = [];
    for (const b of a)
      if ((h = b.texture) != null && h.src) {
        v.push(b.texture.src);
        const w = e.tiles.get(b._id), S = ((m = w == null ? void 0 : w.texture) == null ? void 0 : m.src) ?? ((y = (p = w == null ? void 0 : w._source) == null ? void 0 : p.texture) == null ? void 0 : y.src);
        S && E.set(yr(S), S);
      }
    if (v.length > 1) {
      const b = await Cy(v);
      b > 0 && xc(`Pre-loaded ${b}/${v.length} texture(s)`);
    }
    r.chunks = await Uh(e, "Tile", a, n.chunkSize), r.updated = a.length, E.size > 0 && Ly(e, E);
  }
  return r.durationMs = zt() - i, r;
}
c(Gh, "updateTiles");
const Sy = 2;
async function Cy(t) {
  var s;
  const e = [...t];
  let n = 0;
  const i = (s = canvas == null ? void 0 : canvas.app) == null ? void 0 : s.renderer;
  async function r() {
    var a;
    for (; e.length > 0; ) {
      const l = e.shift();
      try {
        const u = await loadTexture(l);
        i && ((a = u == null ? void 0 : u.baseTexture) != null && a.valid) && i.texture.bind(u.baseTexture), n++, await new Promise((d) => requestAnimationFrame(d));
      } catch {
      }
    }
  }
  c(r, "worker");
  const o = Math.min(Sy, e.length);
  return await Promise.all(Array.from({ length: o }, r)), n;
}
c(Cy, "preloadTexturesThrottled");
const Ty = 3e3;
function Ly(t, e) {
  const n = t.id;
  setTimeout(async () => {
    var a, l, u, d;
    const i = (a = game.scenes) == null ? void 0 : a.get(n);
    if (!i) return;
    const r = /* @__PURE__ */ new Set(), o = i.getEmbeddedCollection("Tile") ?? [];
    for (const f of o) {
      const h = ((l = f.texture) == null ? void 0 : l.src) ?? ((d = (u = f._source) == null ? void 0 : u.texture) == null ? void 0 : d.src);
      h && r.add(yr(h));
    }
    let s = 0;
    for (const [f, h] of e)
      if (!r.has(f))
        try {
          await PIXI.Assets.unload(h), s++;
        } catch {
        }
    s > 0 && xc(`Released ${s} unused texture(s) from GPU/CPU memory`);
  }, Ty);
}
c(Ly, "scheduleTextureCleanup");
const io = k, ro = "lightCriteria", ju = Object.freeze({
  base: null,
  mappings: [],
  current: null
});
function kl(t) {
  return t && typeof t == "object" && !Array.isArray(t);
}
c(kl, "isPlainObject");
function Wh(t, e) {
  if (!kl(e)) return {};
  const n = {};
  for (const [i, r] of Object.entries(e)) {
    const o = t == null ? void 0 : t[i];
    if (kl(r) && kl(o)) {
      const s = Wh(o, r);
      Object.keys(s).length > 0 && (n[i] = s);
    } else r !== o && (n[i] = Zt(r));
  }
  return n;
}
c(Wh, "computeDelta");
function zh(t) {
  var n;
  const e = ((n = t == null ? void 0 : t.getFlag) == null ? void 0 : n.call(t, io, ro)) ?? ju;
  return bo(e);
}
c(zh, "getLightCriteriaState");
async function Yh(t, e) {
  const n = bo(e);
  if (!(t != null && t.setFlag))
    return n;
  const i = n.base !== null, r = n.mappings.length > 0, o = n.current !== null;
  return !i && !r && !o ? (typeof t.unsetFlag == "function" ? await t.unsetFlag(io, ro) : await t.setFlag(io, ro, null), ju) : (await t.setFlag(io, ro, n), n);
}
c(Yh, "setLightCriteriaState");
async function Jo(t, e) {
  if (typeof e != "function")
    throw new TypeError("updateLightCriteriaState requires an updater function.");
  const n = Zt(zh(t)), i = await e(n);
  return Yh(t, i);
}
c(Jo, "updateLightCriteriaState");
async function Hd(t, e) {
  const n = Ki(e);
  if (!n)
    throw new Error("Invalid light configuration payload.");
  return Jo(t, (i) => ({
    ...i,
    base: n
  }));
}
c(Hd, "storeBaseLighting");
async function qd(t, e, n, { label: i } = {}) {
  const r = Qo(e);
  if (!r)
    throw new Error("Cannot create a mapping without at least one category selection.");
  const o = Ki(n);
  if (!o)
    throw new Error("Invalid light configuration payload.");
  return Jo(t, (s) => {
    const a = Rr(r), l = Array.isArray(s == null ? void 0 : s.mappings) ? [...s.mappings] : [], u = l.findIndex((m) => (m == null ? void 0 : m.key) === a), d = u >= 0 ? l[u] : null, f = typeof (d == null ? void 0 : d.id) == "string" && d.id.trim() ? d.id.trim() : Xh(), h = tl({
      id: f,
      categories: r,
      config: o,
      label: typeof i == "string" ? i : (d == null ? void 0 : d.label) ?? null,
      updatedAt: Date.now()
    });
    if (!h)
      throw new Error("Failed to sanitize criteria mapping entry.");
    return u >= 0 ? l[u] = h : l.push(h), {
      ...s,
      mappings: l
    };
  });
}
c(qd, "upsertLightCriteriaMapping");
async function Iy(t, e, n, i, { replaceExisting: r = !1 } = {}) {
  const o = typeof e == "string" ? e.trim() : "";
  if (!o)
    throw new Error("A mapping id is required to retarget criteria.");
  const s = Qo(n);
  if (!s)
    throw new Error("Cannot retarget mapping without at least one category selection.");
  const a = Ki(i);
  if (!a)
    throw new Error("Invalid light configuration payload.");
  return Jo(t, (l) => {
    const u = Array.isArray(l == null ? void 0 : l.mappings) ? [...l.mappings] : [], d = u.findIndex((v) => (v == null ? void 0 : v.id) === o);
    if (d < 0)
      throw new Error("The selected mapping no longer exists.");
    const f = Rr(s), h = u.findIndex(
      (v, b) => b !== d && (v == null ? void 0 : v.key) === f
    );
    if (h >= 0 && !r)
      throw new Error("A mapping already exists for the selected criteria.");
    const m = u[d], p = tl({
      ...m,
      id: o,
      categories: s,
      config: a,
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
    let E = (l == null ? void 0 : l.current) ?? null;
    return E && typeof E == "object" && (E.mappingId === o ? E = {
      ...E,
      mappingId: o,
      categories: s,
      updatedAt: Date.now()
    } : y && E.mappingId === y && (E = {
      ...E,
      mappingId: o,
      categories: s,
      updatedAt: Date.now()
    })), {
      ...l,
      mappings: u,
      current: E
    };
  });
}
c(Iy, "retargetLightCriteriaMapping");
async function ky(t, e) {
  const n = typeof e == "string" ? e.trim() : "";
  if (!n)
    throw new Error("A mapping id is required to remove a mapping.");
  return Jo(t, (i) => {
    const r = Array.isArray(i == null ? void 0 : i.mappings) ? [...i.mappings] : [], o = r.findIndex((a) => (a == null ? void 0 : a.id) === n);
    if (o < 0) return i;
    r.splice(o, 1);
    let s = (i == null ? void 0 : i.current) ?? null;
    return (s == null ? void 0 : s.mappingId) === n && (s = null), {
      ...i,
      mappings: r,
      current: s
    };
  });
}
c(ky, "removeLightCriteriaMapping");
async function oo(t, e) {
  const n = Kh(e);
  return Jo(t, (i) => ({
    ...i,
    current: n
  }));
}
c(oo, "storeCurrentCriteriaSelection");
function Oy(t) {
  const e = bo(t), n = e.base ?? {}, i = [];
  for (const r of e.mappings) {
    const o = Qo(r == null ? void 0 : r.categories);
    if (!o) continue;
    const s = Wh(n, (r == null ? void 0 : r.config) ?? {});
    Object.keys(s).length !== 0 && i.push({
      criteria: o,
      delta: s
    });
  }
  return {
    base: n,
    rules: i
  };
}
c(Oy, "convertLightCriteriaStateToPresets");
function Ay(t, e = []) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
  for (const l of e)
    typeof (l == null ? void 0 : l.key) == "string" && l.key.trim() && i.add(l.key.trim()), typeof (l == null ? void 0 : l.id) == "string" && l.id.trim() && typeof (l == null ? void 0 : l.key) == "string" && n.set(l.id.trim(), l.key.trim());
  const r = bo(t), o = /* @__PURE__ */ c((l) => {
    const u = {};
    for (const [d, f] of Object.entries(l ?? {})) {
      const h = String(d ?? "").trim(), m = typeof f == "string" ? f.trim() : "";
      if (!h || !m) continue;
      if (i.has(h)) {
        u[h] = m;
        continue;
      }
      const p = n.get(h);
      p && (u[p] = m);
    }
    return Object.keys(u).length ? u : null;
  }, "remapCategories"), s = r.mappings.map((l) => {
    const u = o(l.categories);
    return u ? tl({
      ...l,
      categories: u,
      key: Rr(u)
    }) : null;
  }).filter(Boolean);
  let a = r.current;
  if (a != null && a.categories) {
    const l = o(a.categories);
    a = l ? {
      ...a,
      categories: l
    } : null;
  }
  return bo({
    ...r,
    mappings: s,
    current: a
  });
}
c(Ay, "migrateLightCriteriaCategoriesToKeys");
function bo(t) {
  var l;
  const e = Zt(t);
  if (!e || typeof e != "object")
    return Zt(ju);
  const n = Ki(e.base), i = Array.isArray(e.mappings) ? e.mappings : [], r = /* @__PURE__ */ new Map();
  for (const u of i) {
    const d = tl(u);
    d && r.set(d.key, d);
  }
  const o = Array.from(r.values()), s = new Map(o.map((u) => [u.id, u]));
  let a = Kh(e.current);
  if (a) {
    const u = a.categories && Object.keys(a.categories).length > 0;
    if (a.mappingId && !s.has(a.mappingId)) {
      const d = u ? ((l = o.find((f) => f.key === Rr(a.categories))) == null ? void 0 : l.id) ?? null : null;
      d ? a = {
        ...a,
        mappingId: d
      } : u && (a = {
        mappingId: null,
        categories: a.categories,
        updatedAt: a.updatedAt
      });
    }
  }
  return {
    base: n ?? null,
    mappings: o,
    current: a
  };
}
c(bo, "sanitizeLightCriteriaState");
function Ki(t) {
  const e = Zt(t);
  if (!e || typeof e != "object") return null;
  const n = /* @__PURE__ */ new Set(["config", "hidden", "vision"]);
  for (const i of Object.keys(e))
    n.has(i) || delete e[i];
  return e;
}
c(Ki, "sanitizeLightConfigPayload");
function tl(t) {
  if (!t || typeof t != "object") return null;
  const e = Qo(t.categories);
  if (!e) return null;
  const n = Ki(t.config);
  if (!n) return null;
  const i = typeof t.id == "string" && t.id.trim() ? t.id.trim() : Xh(), r = Rr(e), o = {
    id: i,
    key: r,
    categories: e,
    config: n,
    updatedAt: Number.isFinite(t.updatedAt) ? Number(t.updatedAt) : Date.now()
  };
  return typeof t.label == "string" && t.label.trim() && (o.label = t.label.trim()), o;
}
c(tl, "sanitizeCriteriaMappingEntry");
function Kh(t) {
  if (!t || typeof t != "object") return null;
  const e = typeof t.mappingId == "string" && t.mappingId.trim() ? t.mappingId.trim() : null, n = Qo(t.categories);
  return !e && !n ? null : {
    mappingId: e,
    categories: n,
    updatedAt: Number.isFinite(t.updatedAt) ? Number(t.updatedAt) : Date.now()
  };
}
c(Kh, "sanitizeCurrentSelection");
function Qo(t) {
  const e = {};
  if (Array.isArray(t))
    for (const n of t) {
      const i = jd((n == null ? void 0 : n.id) ?? (n == null ? void 0 : n.categoryId) ?? (n == null ? void 0 : n.category)), r = Bd((n == null ? void 0 : n.value) ?? (n == null ? void 0 : n.selection) ?? (n == null ? void 0 : n.label));
      !i || !r || (e[i] = r);
    }
  else if (t && typeof t == "object")
    for (const [n, i] of Object.entries(t)) {
      const r = jd(n), o = Bd(i);
      !r || !o || (e[r] = o);
    }
  return Object.keys(e).length > 0 ? e : null;
}
c(Qo, "sanitizeCriteriaCategories");
function Rr(t) {
  if (!t || typeof t != "object") return "";
  const e = Object.entries(t).filter(([, n]) => typeof n == "string" && n).map(([n, i]) => `${n}:${i}`);
  return e.sort((n, i) => n < i ? -1 : n > i ? 1 : 0), e.join("|");
}
c(Rr, "computeCriteriaMappingKey");
function Xh() {
  var t;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
c(Xh, "generateLightMappingId");
function jd(t) {
  if (typeof t != "string") return null;
  const e = t.trim();
  return e || null;
}
c(jd, "normalizeCategoryId");
function Bd(t) {
  if (typeof t != "string") return null;
  const e = t.trim();
  return e || null;
}
c(Bd, "normalizeCategoryValue");
const vo = [];
function Jh(t) {
  typeof t == "function" && (vo.includes(t) || vo.push(t));
}
c(Jh, "registerHiddenLightProvider");
function My(t) {
  const e = vo.indexOf(t);
  e >= 0 && vo.splice(e, 1);
}
c(My, "unregisterHiddenLightProvider");
function xy() {
  const t = /* @__PURE__ */ new Set();
  for (const e of vo)
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
c(xy, "getHiddenLightIds");
const Bu = /* @__PURE__ */ new Map(), wo = [];
function Jr(t) {
  t != null && t.tag && Bu.set(t.tag, { ...t });
}
c(Jr, "registerTileConvention");
function _y(t) {
  Bu.delete(t);
}
c(_y, "unregisterTileConvention");
function Qh() {
  return Bu;
}
c(Qh, "getTileConventions");
function Ny(t) {
  typeof t == "function" && (wo.includes(t) || wo.push(t));
}
c(Ny, "registerIndexingHook");
function $y(t) {
  const e = wo.indexOf(t);
  e >= 0 && wo.splice(e, 1);
}
c($y, "unregisterIndexingHook");
function Fy() {
  return wo;
}
c(Fy, "getIndexingHooks");
const Gs = ["AmbientLight", "Wall", "AmbientSound"];
let Ws = /* @__PURE__ */ new WeakMap(), zs = /* @__PURE__ */ new WeakMap();
function Dy(t) {
  const e = /* @__PURE__ */ new Set();
  for (const n of (t == null ? void 0 : t.rules) ?? [])
    for (const i of Object.keys((n == null ? void 0 : n.criteria) ?? {}))
      i && e.add(i);
  return Array.from(e);
}
c(Dy, "getPresetDependencyKeys");
function Py(t, e) {
  const n = /* @__PURE__ */ new Map();
  for (const i of Gs) {
    const r = e.get(i) ?? [], o = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map();
    for (const a of r) {
      const l = em(a, i);
      if (l != null && l.base) {
        o.add(a.id);
        for (const u of Dy(l))
          s.has(u) || s.set(u, /* @__PURE__ */ new Set()), s.get(u).add(a.id);
      }
    }
    n.set(i, {
      allDocIds: o,
      keyToDocIds: s
    });
  }
  return {
    collectionsByType: e,
    byType: n
  };
}
c(Py, "buildPlaceableDependencyIndex");
function Ry(t, e) {
  const n = zs.get(t);
  if (n && Gs.every((r) => n.collectionsByType.get(r) === e.get(r)))
    return n;
  const i = Py(t, e);
  return zs.set(t, i), i;
}
c(Ry, "getPlaceableDependencyIndex");
function Hy(t, e, n) {
  if (!e || !t) return [];
  const i = Hh(n);
  if (!i.length)
    return typeof t.get == "function" ? Array.from(e.allDocIds).map((o) => t.get(o)).filter(Boolean) : Array.from(t).filter((o) => e.allDocIds.has(o.id));
  const r = /* @__PURE__ */ new Set();
  for (const o of i) {
    const s = e.keyToDocIds.get(o);
    if (s)
      for (const a of s) r.add(a);
  }
  return r.size ? typeof t.get == "function" ? Array.from(r).map((o) => t.get(o)).filter(Boolean) : Array.from(t).filter((o) => r.has(o.id)) : [];
}
c(Hy, "getDocsForChangedKeys");
function Zh(t, e) {
  const n = { _id: e._id };
  for (const [r, o] of Object.entries(e)) {
    if (r === "_id") continue;
    const s = t == null ? void 0 : t[r];
    if (cr(o) && cr(s)) {
      const a = Zh(s, { _id: e._id, ...o });
      if (!a) continue;
      const l = Object.keys(a).filter((u) => u !== "_id");
      if (l.length > 0) {
        n[r] = {};
        for (const u of l)
          n[r][u] = a[u];
      }
      continue;
    }
    Mc(s, o) || (n[r] = o);
  }
  return Object.keys(n).filter((r) => r !== "_id").length > 0 ? n : null;
}
c(Zh, "buildChangedPayload");
function em(t, e) {
  var a;
  const n = ((a = t == null ? void 0 : t.flags) == null ? void 0 : a[ie]) ?? {}, i = (n == null ? void 0 : n.presets) ?? null, r = e === "AmbientLight" ? (n == null ? void 0 : n.lightCriteria) ?? null : null, o = Ws.get(t);
  if (o && o.type === e && o.rawPresets === i && o.rawLightCriteria === r)
    return o.presets;
  let s = null;
  if (n != null && n.presets) {
    const l = n.presets.base ?? null, u = Array.isArray(n.presets.rules) ? n.presets.rules : [];
    (l && Object.keys(l).length > 0 || u.length > 0) && (s = {
      base: l ?? {},
      rules: u
    });
  }
  if (!s && e === "AmbientLight" && (n != null && n.lightCriteria)) {
    const l = Oy(n.lightCriteria);
    (l.base && Object.keys(l.base).length > 0 || l.rules.length > 0) && (s = {
      base: l.base,
      rules: l.rules
    });
  }
  return Ws.set(t, {
    type: e,
    rawPresets: i,
    rawLightCriteria: r,
    presets: s
  }), s;
}
c(em, "getPresetsForDocument");
function qy(t = null, e = null) {
  t ? zs.delete(t) : zs = /* @__PURE__ */ new WeakMap(), e ? Ws.delete(e) : t || (Ws = /* @__PURE__ */ new WeakMap());
}
c(qy, "invalidatePlaceableCriteriaCaches");
async function tm(t, e, n = {}) {
  var u, d;
  const i = zt(), r = {
    total: 0,
    scanned: 0,
    updated: 0,
    chunks: 0,
    byType: {},
    durationMs: 0
  };
  if (e = e ?? ((u = game.scenes) == null ? void 0 : u.viewed), !e)
    return r.durationMs = zt() - i, r;
  const o = xy(), s = new Map(
    Gs.map((f) => [f, e.getEmbeddedCollection(f) ?? []])
  ), a = Ry(e, s), l = [];
  for (const f of Gs) {
    const h = s.get(f) ?? [], m = {
      total: Rh(h),
      scanned: 0,
      updated: 0,
      chunks: 0
    }, p = a.byType.get(f) ?? null, y = Hy(h, p, n.changedKeys);
    if (m.scanned = y.length, r.total += m.total, r.scanned += m.scanned, r.byType[f] = m, !y.length) continue;
    const E = [];
    for (const v of y) {
      const b = em(v, f);
      if (!(b != null && b.base)) continue;
      const w = Ph(b.base, b.rules ?? [], t);
      w._id = v._id, f === "AmbientLight" && o.has(v._id) && (w.hidden = !0);
      const S = (v == null ? void 0 : v._source) ?? ((d = v == null ? void 0 : v.toObject) == null ? void 0 : d.call(v)) ?? {}, T = Zh(S, w);
      T && E.push(T);
    }
    E.length > 0 && l.push({ type: f, updates: E, typeMetrics: m });
  }
  return l.length > 0 && await Promise.all(l.map(async ({ type: f, updates: h, typeMetrics: m }) => {
    m.chunks = await Uh(e, f, h, n.chunkSize), m.updated = h.length, r.updated += h.length, r.chunks += m.chunks, console.log(`${ie} | Updated ${h.length} ${f}(s)`);
  })), r.durationMs = zt() - i, r;
}
c(tm, "updatePlaceables");
const os = /* @__PURE__ */ new Map();
function jy(t) {
  var e;
  return t = t ?? ((e = game.scenes) == null ? void 0 : e.viewed), t ? Xo(t) : null;
}
c(jy, "getState");
async function By(t, e, n = 0) {
  var m;
  const i = zt();
  if (e = e ?? ((m = game.scenes) == null ? void 0 : m.viewed), !e) return null;
  uy(e);
  const r = bt(e);
  if (!r.length)
    return console.warn(`${ie} | applyState skipped: scene has no criteria.`), null;
  const o = Xo(e, r), s = Qa({ ...o, ...t ?? {} }, r), a = r.filter((p) => (o == null ? void 0 : o[p.key]) !== (s == null ? void 0 : s[p.key])).map((p) => p.key), l = a.length > 0;
  l && await Yp(e, s, r);
  const u = l ? s : o, [d, f] = await Promise.all([
    Gh(u, e, { changedKeys: a }),
    tm(u, e, { changedKeys: a })
  ]), h = zt() - i;
  return D("Criteria apply telemetry", {
    sceneId: e.id,
    changedKeys: a,
    didChange: l,
    queuedMs: n,
    durationMs: h,
    tiles: d,
    placeables: f
  }), Hooks.callAll("eidolon-utilities.criteriaStateApplied", e, u), u;
}
c(By, "applyStateInternal");
async function Uu(t, e) {
  var l;
  if (e = e ?? ((l = game.scenes) == null ? void 0 : l.viewed), !e) return null;
  const n = e.id ?? "__viewed__", i = zt(), r = os.get(n) ?? Promise.resolve();
  let o = null;
  const s = r.catch(() => null).then(async () => {
    const u = zt() - i;
    return By(t, e, u);
  });
  o = s;
  const a = s.finally(() => {
    os.get(n) === a && os.delete(n);
  });
  return os.set(n, a), o;
}
c(Uu, "applyState$1");
function Uy(t) {
  var e;
  return t = t ?? ((e = game.scenes) == null ? void 0 : e.viewed), t ? Fh(t) : null;
}
c(Uy, "getVersion");
async function nm(t, e) {
  var n;
  e = e ?? ((n = game.scenes) == null ? void 0 : n.viewed), e != null && e.setFlag && await e.setFlag(ie, Nh, Number(t));
}
c(nm, "setVersion");
async function Vy(t) {
  return nm($h, t);
}
c(Vy, "markCurrentVersion");
const Oi = "Standard", Gy = {
  nolights: "No Lights"
}, Wy = /* @__PURE__ */ c((...t) => console.log(`${ie} | criteria indexer:`, ...t), "log");
function zy() {
  Jr({
    tag: "Map",
    positionMap: { 0: "mood", 1: "variant", 2: "effect" },
    positionMap4: { 0: "mood", 1: "stage", 2: "variant", 3: "effect" },
    required: !0,
    maxCount: 1
  }), Jr({ tag: "Floor", positionMap: "inherit" }), Jr({ tag: "Roof", positionMap: "inherit" }), Jr({
    tag: "Weather",
    positionMap: { 1: "effect" }
  });
}
c(zy, "registerDefaultConventions");
function Ys(t) {
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
c(Ys, "parseFileTags");
function Yy(t, e, n = Oi, i = null) {
  return t != null && t.length ? t.map((r) => {
    var a;
    const o = Ys(r == null ? void 0 : r.name);
    if (!o) return {};
    const s = {};
    for (const [l, u] of Object.entries(e)) {
      const d = o[Number(l)];
      if (d == null) continue;
      const f = (a = i == null ? void 0 : i[l]) == null ? void 0 : a[d], h = f ?? u;
      (d !== n || f) && (s[h] = d);
    }
    return s;
  }) : [];
}
c(Yy, "buildFileIndex");
function Ky(t, e) {
  return t.map((n, i) => {
    const r = [...e[n] ?? /* @__PURE__ */ new Set()].sort(), s = r.includes(Oi) ? Oi : r[0] ?? Oi, a = Ru(n);
    return a.key = n, a.label = Gy[n] ?? n.charAt(0).toUpperCase() + n.slice(1), a.values = r.length ? r : [Oi], a.default = a.values.includes(s) ? s : a.values[0], a.order = i, a;
  });
}
c(Ky, "buildCriteriaDefinitions");
async function Ud(t, e, n, { dryRun: i = !1, valueOverrides: r = null } = {}) {
  var l;
  const o = t.getFlag("monks-active-tiles", "files");
  if (!(o != null && o.length)) return null;
  const s = Yy(o, e, Oi, r), a = Bh(s, { files: o });
  for (const u of o) {
    const d = Ys(u == null ? void 0 : u.name);
    if (d)
      for (const [f, h] of Object.entries(e)) {
        const m = d[Number(f)];
        if (m == null) continue;
        const y = ((l = r == null ? void 0 : r[f]) == null ? void 0 : l[m]) ?? h;
        n[y] && n[y].add(m);
      }
  }
  return i || (await t.setFlag(ie, Vi, a), typeof t.unsetFlag == "function" && await t.unsetFlag(ie, Ui)), { files: o.length };
}
c(Ud, "indexTile");
function Vd(t, e, n) {
  return t.positionMap === "inherit" ? n : e >= 4 && t.positionMap4 ? t.positionMap4 : t.positionMap;
}
c(Vd, "resolvePositionMap");
function Xy(t, e) {
  return e >= 4 && t.positionMap4 ? t.positionMap4 : t.positionMap;
}
c(Xy, "resolvePrimaryPositionMap");
function Jy(t) {
  if (!Array.isArray(t)) return Qh();
  const e = /* @__PURE__ */ new Map();
  for (const n of t)
    n != null && n.tag && e.set(n.tag, { ...n });
  return e;
}
c(Jy, "resolveConventions");
async function Qy(t, e = {}) {
  var w, S, T, L, A, M, F;
  t != null && typeof t == "object" && !t.id && !t.tiles && (e = { ...t, ...e }, t = null);
  const {
    dryRun: n = !1,
    force: i = !1
  } = e;
  if (t = t ?? ((w = game.scenes) == null ? void 0 : w.viewed), !t) throw new Error("No scene provided to indexScene.");
  if (!globalThis.Tagger) throw new Error("Tagger is required to index scene criteria.");
  if (!i && Fh(t) >= $h)
    throw new Error(
      `Scene "${t.name}" is already criteria-indexed. Use force: true to re-index.`
    );
  const r = !!e.conventions, o = Jy(e.conventions), s = { sceneId: t.id };
  let a = null, l = null, u = 3;
  for (const [N, $] of o) {
    if (!$.required) continue;
    const x = Tagger.getByTag(N, s) ?? [];
    if (!x.length) throw new Error(`No ${N} tile found.`);
    if ($.maxCount && x.length > $.maxCount)
      throw new Error(`Expected ${$.maxCount} ${N} tile(s), found ${x.length}.`);
    a = $, l = x[0];
    const R = l.getFlag("monks-active-tiles", "files");
    if (!(R != null && R.length)) throw new Error(`${N} tile has no MATT files.`);
    const P = Ys((S = R[0]) == null ? void 0 : S.name);
    if (!(P != null && P.length))
      throw new Error(`Cannot parse bracket tags from: ${((T = R[0]) == null ? void 0 : T.name) ?? "<unknown>"}`);
    if (P.length < 3)
      throw new Error(`Expected 3+ bracket tags, found ${P.length}.`);
    u = P.length, !r && u === 3 && ((L = a.positionMap) == null ? void 0 : L[2]) === "effect" && R.some((q) => {
      const B = Ys(q == null ? void 0 : q.name);
      return (B == null ? void 0 : B[2]) === "No Lights";
    }) && (a = {
      ...a,
      positionMap: { ...a.positionMap, 2: "nolights" }
    }, o.set(N, a));
    break;
  }
  if (!a)
    throw new Error("No required tile convention registered. Register conventions before indexing.");
  const d = Xy(a, u), f = [], h = Object.keys(d).map(Number).sort((N, $) => N - $);
  for (const N of h) {
    const $ = d[N];
    f.includes($) || f.push($);
  }
  for (const [, N] of o)
    if (N.valueOverrides)
      for (const $ of Object.values(N.valueOverrides))
        for (const x of Object.values($))
          f.includes(x) || f.push(x);
  const m = {};
  for (const N of f)
    m[N] = /* @__PURE__ */ new Set();
  for (const [, N] of o)
    if (N.valueOverrides)
      for (const $ of Object.values(N.valueOverrides))
        for (const x of Object.values($))
          m[x] && m[x].add(Oi);
  for (const [, N] of o) {
    if (N.positionMap === "inherit") continue;
    const $ = Vd(N, u, d);
    for (const x of Object.values($))
      m[x] || (m[x] = /* @__PURE__ */ new Set(), f.includes(x) || f.push(x));
  }
  const p = {}, y = Fy();
  for (const [N, $] of o) {
    const x = Tagger.getByTag(N, s) ?? [], R = Vd($, u, d), P = N.toLowerCase(), j = [];
    for (const q of x) {
      const B = await Ud(q, R, m, { dryRun: n, valueOverrides: $.valueOverrides });
      B && j.push(B);
    }
    p[P] = $.maxCount === 1 ? j[0] ?? null : j;
  }
  if (y.length > 0) {
    const N = t.getEmbeddedCollection("Tile") ?? [], $ = new Set(o.keys());
    for (const x of N) {
      if ((((M = (A = globalThis.Tagger) == null ? void 0 : A.getTags) == null ? void 0 : M.call(A, x)) ?? []).some((q) => $.has(q))) continue;
      const j = x.getFlag("monks-active-tiles", "files");
      if (j != null && j.length)
        for (const q of y)
          try {
            const B = q(t, x, j);
            if (B != null && B.positionMap) {
              await Ud(x, B.positionMap, m, { dryRun: n });
              break;
            }
          } catch (B) {
            console.warn(`${ie} | Indexing hook error:`, B);
          }
    }
  }
  const E = Ky(f, m);
  n || (await Ja(t, E), await Vy(t));
  const v = a.tag.toLowerCase();
  Wy(
    n ? "Dry run complete" : "Indexing complete",
    `- ${E.length} criteria,`,
    `${((F = p[v]) == null ? void 0 : F.files) ?? 0} ${a.tag.toLowerCase()} files`
  );
  const b = Array.from(o.keys()).filter((N) => N !== a.tag).some((N) => {
    const $ = p[N.toLowerCase()];
    return Array.isArray($) ? $.length > 0 : !!$;
  });
  return {
    criteria: E,
    state: E.reduce((N, $) => (N[$.key] = $.default, N), {}),
    tiles: p,
    overlayMode: b
  };
}
c(Qy, "indexScene");
var qf, Qe, Ot, At, Di, ut, an, Un, ja, he, im, rm, om, Nc, sm, $c, am, Qr, Fc;
const Dt = class Dt extends yt(pt) {
  constructor(n = {}) {
    var i;
    super(n);
    _(this, he);
    _(this, Qe, null);
    _(this, Ot, []);
    _(this, At, {});
    _(this, Di, !1);
    _(this, ut, null);
    _(this, an, null);
    _(this, Un, null);
    _(this, ja, 120);
    this.setScene(n.scene ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null);
  }
  setScene(n) {
    var i;
    O(this, Qe, n ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null), I(this, he, im).call(this);
  }
  get scene() {
    return g(this, Qe);
  }
  async _prepareContext() {
    var r;
    const n = !!g(this, Qe), i = n && g(this, Ot).length > 0;
    return {
      hasScene: n,
      hasCriteria: i,
      sceneName: ((r = g(this, Qe)) == null ? void 0 : r.name) ?? C("EIDOLON.CriteriaSwitcher.NoScene", "No active scene"),
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
      criteria: g(this, Ot).map((o) => ({
        key: o.key,
        label: o.label || o.key,
        values: o.values.map((s) => {
          var a;
          return {
            value: s,
            selected: ((a = g(this, At)) == null ? void 0 : a[o.key]) === s
          };
        }),
        defaultValue: o.default
      })),
      stateSummary: I(this, he, Fc).call(this)
    };
  }
  _onRender(n, i) {
    super._onRender(n, i), I(this, he, rm).call(this), I(this, he, om).call(this);
  }
  async _onClose(n) {
    return g(this, ut) !== null && (clearTimeout(g(this, ut)), O(this, ut, null)), g(this, Un) !== null && (Hooks.off("eidolon-utilities.criteriaStateApplied", g(this, Un)), O(this, Un, null)), super._onClose(n);
  }
};
Qe = new WeakMap(), Ot = new WeakMap(), At = new WeakMap(), Di = new WeakMap(), ut = new WeakMap(), an = new WeakMap(), Un = new WeakMap(), ja = new WeakMap(), he = new WeakSet(), im = /* @__PURE__ */ c(function() {
  if (!g(this, Qe)) {
    O(this, Ot, []), O(this, At, {});
    return;
  }
  O(this, Ot, bt(g(this, Qe)).sort((n, i) => n.order - i.order)), O(this, At, Xo(g(this, Qe), g(this, Ot)));
}, "#hydrateFromScene"), rm = /* @__PURE__ */ c(function() {
  var i, r;
  const n = this.element;
  n instanceof HTMLElement && (n.querySelectorAll("[data-criteria-key]").forEach((o) => {
    o.addEventListener("change", (s) => {
      const a = s.currentTarget;
      if (!(a instanceof HTMLSelectElement)) return;
      const l = a.dataset.criteriaKey;
      l && (O(this, At, {
        ...g(this, At),
        [l]: a.value
      }), I(this, he, sm).call(this, { [l]: a.value }));
    });
  }), (i = n.querySelector("[data-action='reset-defaults']")) == null || i.addEventListener("click", () => {
    I(this, he, am).call(this);
  }), (r = n.querySelector("[data-action='close-switcher']")) == null || r.addEventListener("click", () => {
    this.close();
  }));
}, "#bindEvents"), om = /* @__PURE__ */ c(function() {
  g(this, Un) === null && O(this, Un, Hooks.on("eidolon-utilities.criteriaStateApplied", (n, i) => {
    !g(this, Qe) || (n == null ? void 0 : n.id) !== g(this, Qe).id || g(this, Di) || (O(this, At, { ...i ?? {} }), this.render({ force: !0 }));
  }));
}, "#ensureSyncHook"), Nc = /* @__PURE__ */ c(async function(n) {
  var i, r;
  if (g(this, Qe)) {
    I(this, he, Qr).call(this, "applying"), O(this, Di, !0);
    try {
      const o = await Uu(n, g(this, Qe));
      o && O(this, At, o), I(this, he, Qr).call(this, "ready"), this.render({ force: !0 });
    } catch (o) {
      console.error(`${ie} | Failed to apply criteria state`, o), (r = (i = ui.notifications) == null ? void 0 : i.error) == null || r.call(
        i,
        C(
          "EIDOLON.CriteriaSwitcher.ApplyError",
          "Failed to apply the selected criteria state."
        )
      ), I(this, he, Qr).call(this, "error", (o == null ? void 0 : o.message) ?? "Unknown error");
    } finally {
      O(this, Di, !1), g(this, an) && I(this, he, $c).call(this);
    }
  }
}, "#applyPartialState"), sm = /* @__PURE__ */ c(function(n) {
  O(this, an, {
    ...g(this, an) ?? {},
    ...n ?? {}
  }), g(this, ut) !== null && clearTimeout(g(this, ut)), I(this, he, Qr).call(this, "applying"), O(this, ut, setTimeout(() => {
    O(this, ut, null), I(this, he, $c).call(this);
  }, g(this, ja)));
}, "#queuePartialState"), $c = /* @__PURE__ */ c(async function() {
  if (g(this, Di) || !g(this, an)) return;
  const n = g(this, an);
  O(this, an, null), await I(this, he, Nc).call(this, n);
}, "#flushPendingState"), am = /* @__PURE__ */ c(async function() {
  if (!g(this, Ot).length) return;
  const n = g(this, Ot).reduce((i, r) => (i[r.key] = r.default, i), {});
  O(this, At, n), g(this, ut) !== null && (clearTimeout(g(this, ut)), O(this, ut, null)), O(this, an, null), await I(this, he, Nc).call(this, n);
}, "#resetToDefaults"), Qr = /* @__PURE__ */ c(function(n, i = "") {
  const r = this.element;
  if (!(r instanceof HTMLElement)) return;
  const o = r.querySelector("[data-role='status']");
  if (o instanceof HTMLElement)
    switch (o.dataset.mode = n, n) {
      case "applying":
        o.textContent = C("EIDOLON.CriteriaSwitcher.Applying", "Applying changes...");
        break;
      case "error":
        o.textContent = `${C("EIDOLON.CriteriaSwitcher.Error", "Error")}: ${i}`;
        break;
      case "ready":
      default:
        o.textContent = `${C("EIDOLON.CriteriaSwitcher.Ready", "Ready")}: ${I(this, he, Fc).call(this)}`;
        break;
    }
}, "#setStatus"), Fc = /* @__PURE__ */ c(function() {
  return g(this, Ot).length ? `[${g(this, Ot).map((n) => {
    var i;
    return ((i = g(this, At)) == null ? void 0 : i[n.key]) ?? n.default;
  }).join(" | ")}]` : "-";
}, "#formatStateSummary"), c(Dt, "CriteriaSwitcherApplication"), se(Dt, "APP_ID", `${ie}-criteria-switcher`), se(Dt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  ye(Dt, Dt, "DEFAULT_OPTIONS"),
  {
    id: Dt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((qf = ye(Dt, Dt, "DEFAULT_OPTIONS")) == null ? void 0 : qf.classes) ?? [], "eidolon-criteria-switcher-window", "themed"])
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
)), se(Dt, "PARTS", {
  content: {
    template: `modules/${ie}/templates/criteria-switcher.html`
  }
});
let _c = Dt;
const Zy = Zi(_c);
let Gi = null;
function eb(t) {
  var e;
  return t ?? ((e = game.scenes) == null ? void 0 : e.viewed) ?? null;
}
c(eb, "resolveScene$1");
function tb(t) {
  var e;
  return !!(t != null && t.rendered && ((e = t == null ? void 0 : t.element) != null && e.isConnected));
}
c(tb, "isRendered");
function nl() {
  return tb(Gi) ? Gi : (Gi = null, null);
}
c(nl, "getCriteriaSwitcher");
function lm(t) {
  var i, r, o, s, a;
  const e = eb(t);
  if (!e)
    return (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "No active scene to open the criteria switcher."), null;
  if (!Za(e))
    return (s = (o = ui.notifications) == null ? void 0 : o.warn) == null || s.call(o, "You do not have permission to manage scene criteria."), null;
  const n = nl();
  return n ? (n.setScene(e), n.render({ force: !0 }), (a = n.bringToFront) == null || a.call(n), n) : (Gi = Zy({ scene: e }), Gi.render({ force: !0 }), Gi);
}
c(lm, "openCriteriaSwitcher");
function cm() {
  const t = nl();
  t && (t.close(), Gi = null);
}
c(cm, "closeCriteriaSwitcher");
function Vu(t) {
  return nl() ? (cm(), null) : lm(t);
}
c(Vu, "toggleCriteriaSwitcher");
const nb = {
  SCHEMA_VERSION: Hu,
  applyState: Uu,
  getState: jy,
  getVersion: Uy,
  setVersion: nm,
  getCriteria(t) {
    var e;
    return bt(t ?? ((e = game.scenes) == null ? void 0 : e.viewed));
  },
  setCriteria(t, e) {
    var n;
    return Ja(e ?? ((n = game.scenes) == null ? void 0 : n.viewed), t);
  },
  updateTiles: Gh,
  updatePlaceables: tm,
  indexScene: Qy,
  openCriteriaSwitcher: lm,
  closeCriteriaSwitcher: cm,
  toggleCriteriaSwitcher: Vu,
  findBestMatch: oy,
  findFileIndex: sy,
  resolveRules: Ph,
  // Convention registration API
  registerTileConvention: Jr,
  unregisterTileConvention: _y,
  getTileConventions: Qh,
  // Hidden light provider API
  registerHiddenLightProvider: Jh,
  unregisterHiddenLightProvider: My,
  // Indexing hook API
  registerIndexingHook: Ny,
  unregisterIndexingHook: $y
};
function ib(t) {
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
c(ib, "findTabNav");
function rb(t, e) {
  var i, r, o;
  return t instanceof HTMLElement ? [
    (i = t.querySelector(".tab[data-tab]")) == null ? void 0 : i.parentElement,
    t.querySelector(".sheet-body"),
    (o = (r = e == null ? void 0 : e.parentElement) == null ? void 0 : r.querySelector) == null ? void 0 : o.call(r, ":scope > .sheet-body"),
    e == null ? void 0 : e.parentElement
  ].find((s) => s instanceof HTMLElement) ?? null : null;
}
c(rb, "findTabBody");
function ob(t, e) {
  var n, i, r, o, s, a, l;
  return ((n = t == null ? void 0 : t.dataset) == null ? void 0 : n.group) ?? ((o = (r = (i = t == null ? void 0 : t.querySelector) == null ? void 0 : i.call(t, "[data-group]")) == null ? void 0 : r.dataset) == null ? void 0 : o.group) ?? ((l = (a = (s = e == null ? void 0 : e.querySelector) == null ? void 0 : s.call(e, ".tab[data-group]")) == null ? void 0 : a.dataset) == null ? void 0 : l.group) ?? null;
}
c(ob, "getTabGroup");
function sb(t, e, n) {
  if (!(t instanceof HTMLElement)) return;
  t.textContent = "";
  const i = document.createElement("i");
  i.className = n, i.setAttribute("inert", ""), t.append(i, " ");
  const r = document.createElement("span");
  r.textContent = e, t.append(r);
}
c(sb, "setTabButtonContent");
function ab(t, e, n) {
  const i = t.querySelector("[data-tab]"), r = (i == null ? void 0 : i.tagName) || "A", o = document.createElement(r);
  return i instanceof HTMLElement && (o.className = i.className), o.classList.remove("active"), r === "BUTTON" && (o.type = "button"), o.dataset.action = "tab", o.dataset.tab = n, e && (o.dataset.group = e), o.setAttribute("aria-selected", "false"), o.setAttribute("aria-pressed", "false"), o;
}
c(ab, "createTabButton");
function lb(t, e, n) {
  const i = document.createElement("div");
  i.classList.add("tab"), i.dataset.tab = n, e && (i.dataset.group = e), i.dataset.applicationPart = n, i.setAttribute("hidden", "true");
  const r = Th(t);
  return t.insertBefore(i, r ?? null), i;
}
c(lb, "createTabPanel");
function Ol(t, e, n, i, r) {
  var a;
  if (!(i instanceof HTMLElement) || !(r instanceof HTMLElement)) return;
  const o = (a = t == null ? void 0 : t.tabGroups) == null ? void 0 : a[e];
  if (typeof o == "string" ? o === n : i.classList.contains("active") || r.classList.contains("active")) {
    i.classList.add("active"), i.setAttribute("aria-selected", "true"), i.setAttribute("aria-pressed", "true"), r.classList.add("active"), r.removeAttribute("hidden"), r.removeAttribute("aria-hidden");
    return;
  }
  i.classList.remove("active"), i.setAttribute("aria-selected", "false"), i.setAttribute("aria-pressed", "false"), r.classList.remove("active"), r.setAttribute("hidden", "true");
}
c(Ol, "syncTabVisibility");
function Gu(t, e, n, i, r) {
  const o = ib(e), s = rb(e, o);
  if (!(o instanceof HTMLElement) || !(s instanceof HTMLElement)) return null;
  const a = ob(o, s);
  let l = o.querySelector(`[data-tab="${n}"]`);
  l instanceof HTMLElement || (l = ab(o, a, n), o.appendChild(l)), sb(l, i, r);
  let u = s.querySelector(`.tab[data-tab="${n}"]`);
  u instanceof HTMLElement || (u = lb(s, a, n));
  const d = `data-eidolon-bound-${n}`;
  return l.hasAttribute(d) || (l.addEventListener("click", () => {
    Du(t, n, a), requestAnimationFrame(() => {
      Ol(t, a, n, l, u);
    });
  }), l.setAttribute(d, "true")), Ol(t, a, n, l, u), requestAnimationFrame(() => {
    Ol(t, a, n, l, u);
  }), cb(t, o), u;
}
c(Gu, "ensureTileConfigTab");
function cb(t, e) {
  !(t != null && t.setPosition) || !(e instanceof HTMLElement) || requestAnimationFrame(() => {
    var o;
    if (e.scrollWidth <= e.clientWidth) return;
    const n = e.scrollWidth - e.clientWidth, i = t.element instanceof HTMLElement ? t.element : (o = t.element) == null ? void 0 : o[0];
    if (!i) return;
    const r = i.offsetWidth || 480;
    t.setPosition({ width: r + n + 16 });
  });
}
c(cb, "fitNavWidth");
function um(t) {
  var e;
  return ((e = t == null ? void 0 : t.getFlag) == null ? void 0 : e.call(t, "monks-active-tiles", "files")) ?? [];
}
c(um, "getTileFiles$1");
function ub(t = []) {
  return {
    strategy: "select-one",
    defaultTarget: ci(t, 0) ?? { indexHint: 0 },
    variants: [
      {
        criteria: {},
        target: ci(t, 0) ?? { indexHint: 0 }
      }
    ]
  };
}
c(ub, "createDefaultTileCriteria");
function db(t, e = {}) {
  var s, a;
  const { allowLegacy: n = !0 } = e, i = um(t), r = (s = t == null ? void 0 : t.getFlag) == null ? void 0 : s.call(t, ie, Vi);
  if (r) return Yi(r, { files: i });
  if (!n) return null;
  const o = (a = t == null ? void 0 : t.getFlag) == null ? void 0 : a.call(t, ie, Ui);
  return o ? Yi(o, { files: i }) : null;
}
c(db, "getTileCriteria");
async function Gd(t, e, n = {}) {
  if (!(t != null && t.setFlag)) return null;
  const {
    strictValidation: i = !0
  } = n, r = um(t), o = Yi(e, { files: r });
  if (!o)
    return typeof t.unsetFlag == "function" ? (await t.unsetFlag(ie, Vi), await t.unsetFlag(ie, Ui)) : (await t.setFlag(ie, Vi, null), await t.setFlag(ie, Ui, null)), null;
  if (i) {
    const s = jh(o, { files: r });
    if (s.errors.length > 0)
      throw new Error(
        `Tile criteria contains ${s.errors.length} conflicting rule pair(s). Resolve clashes before saving.`
      );
  }
  return await t.setFlag(ie, Vi, o), typeof t.unsetFlag == "function" && await t.unsetFlag(ie, Ui), o;
}
c(Gd, "setTileCriteria");
const Dc = "__eidolon_any__", Pc = "eidolon-tile-criteria", fb = "fa-solid fa-sliders", dm = Symbol.for("eidolon.tileCriteriaUiState"), il = ["all", "unmapped", "mapped", "conflicts"];
function hb(t) {
  const e = t == null ? void 0 : t[dm];
  return !e || typeof e != "object" ? {
    filterQuery: "",
    filterMode: "all",
    selectedFileIndex: null
  } : {
    filterQuery: typeof e.filterQuery == "string" ? e.filterQuery : "",
    filterMode: il.includes(e.filterMode) ? e.filterMode : "all",
    selectedFileIndex: Number.isInteger(e.selectedFileIndex) ? e.selectedFileIndex : null
  };
}
c(hb, "readUiState");
function mb(t, e) {
  if (!t || !e) return;
  typeof e.filterQuery == "string" && (t.filterQuery = e.filterQuery), il.includes(e.filterMode) && (t.filterMode = e.filterMode), Number.isInteger(e.selectedFileIndex) && t.fileEntries.some((i) => i.index === e.selectedFileIndex) && (t.selectedFileIndex = e.selectedFileIndex);
}
c(mb, "applyUiState");
function gb(t) {
  const e = t == null ? void 0 : t.app, n = t == null ? void 0 : t.state;
  !e || !n || (e[dm] = {
    filterQuery: typeof n.filterQuery == "string" ? n.filterQuery : "",
    filterMode: il.includes(n.filterMode) ? n.filterMode : "all",
    selectedFileIndex: Number.isInteger(n.selectedFileIndex) ? n.selectedFileIndex : null
  });
}
c(gb, "persistUiState");
function pb(t) {
  const e = (t == null ? void 0 : t.object) ?? (t == null ? void 0 : t.document) ?? null;
  return !(e != null && e.isEmbedded) || e.documentName !== "Tile" ? null : e;
}
c(pb, "getTileDocument");
function yb(t) {
  var e;
  return ((e = t == null ? void 0 : t.getFlag) == null ? void 0 : e.call(t, "monks-active-tiles", "files")) ?? [];
}
c(yb, "getTileFiles");
function bb(t, e) {
  var a;
  const n = (t == null ? void 0 : t.parent) ?? ((a = game.scenes) == null ? void 0 : a.viewed) ?? null, r = bt(n).sort((l, u) => l.order - u.order).map((l) => ({
    key: l.key,
    label: l.label || l.key,
    values: [...l.values ?? []]
  })), o = new Set(r.map((l) => l.key)), s = /* @__PURE__ */ new Map();
  for (const l of (e == null ? void 0 : e.variants) ?? [])
    for (const [u, d] of Object.entries((l == null ? void 0 : l.criteria) ?? {}))
      o.has(u) || (s.has(u) || s.set(u, /* @__PURE__ */ new Set()), typeof d == "string" && d.trim() && s.get(u).add(d.trim()));
  for (const [l, u] of s.entries())
    r.push({
      key: l,
      label: l,
      values: [...u]
    });
  return r;
}
c(bb, "getCriteriaDefinitions");
function vb(t) {
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
    const o = r.pop();
    let s = e;
    for (const a of r)
      s.folders.has(a) || s.folders.set(a, {
        folders: /* @__PURE__ */ new Map(),
        files: []
      }), s = s.folders.get(a);
    s.files.push({ entry: n, name: o || n.label });
  }
  return e;
}
c(vb, "buildTree");
function wb(t, e) {
  const n = [t];
  let i = e;
  for (; i.files.length === 0 && i.folders.size === 1; ) {
    const [r, o] = i.folders.entries().next().value;
    n.push(r), i = o;
  }
  return {
    label: n.join("/"),
    node: i
  };
}
c(wb, "collapseFolderBranch");
function Eb(t, e) {
  const n = t.rulesByFile.get(e) ?? [], i = [];
  for (const r of n) {
    const o = Object.entries(r.criteria ?? {}).filter(([, a]) => typeof a == "string" && a.trim());
    if (!o.length) {
      i.push("*");
      continue;
    }
    const s = o.map(([a, l]) => `${t.criteriaLabels.get(a) ?? a}: ${l}`).join(" · ");
    i.push(s);
  }
  return i;
}
c(Eb, "getRuleSummariesForFile");
function Rc(t) {
  var m, p;
  const e = yb(t), n = qu(e), i = db(t, { allowLegacy: !0 }) ?? ub(e), r = bb(t, i), o = new Map(r.map((y) => [y.key, y.label])), s = new Map(
    n.map((y) => [
      y.index,
      y.path || y.label
    ])
  ), a = yo(i.defaultTarget, e), l = ((m = n[0]) == null ? void 0 : m.index) ?? 0, u = a >= 0 ? a : l, d = new Map(n.map((y) => [y.index, []]));
  let f = 1;
  for (const y of i.variants ?? []) {
    const E = yo(y.target, e);
    E < 0 || (d.has(E) || d.set(E, []), d.get(E).push({
      id: f,
      criteria: { ...y.criteria ?? {} }
    }), f += 1);
  }
  const h = n.some((y) => y.index === u) ? u : ((p = n[0]) == null ? void 0 : p.index) ?? null;
  return {
    files: e,
    fileEntries: n,
    criteriaDefinitions: r,
    criteriaLabels: o,
    relativePaths: s,
    defaultIndex: u,
    selectedFileIndex: h,
    filterQuery: "",
    filterMode: "all",
    nextRuleId: f,
    rulesByFile: d,
    status: {
      mode: "ready",
      message: C("EIDOLON.TileCriteria.Ready", "Ready")
    }
  };
}
c(Rc, "buildEditorState");
function Hc(t, e) {
  return t.rulesByFile.has(e) || t.rulesByFile.set(e, []), t.rulesByFile.get(e);
}
c(Hc, "getRulesForFile");
function Sb(t) {
  return Object.fromEntries(
    Object.entries(t ?? {}).filter(([e, n]) => typeof e == "string" && e && typeof n == "string" && n.trim()).map(([e, n]) => [e, n.trim()])
  );
}
c(Sb, "sanitizeRuleCriteria");
function fm(t) {
  const e = ci(t.files, t.defaultIndex);
  if (!e) return null;
  const n = [], i = [];
  for (const [o, s] of t.rulesByFile.entries()) {
    const a = ci(t.files, o);
    if (a)
      for (const [l, u] of s.entries()) {
        const d = Sb(u.criteria);
        n.push({
          criteria: d,
          target: { ...a }
        }), i.push({
          fileIndex: o,
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
    normalized: Yi(
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
c(fm, "buildTileCriteriaDraft");
function Cb(t) {
  var e;
  return ((e = fm(t)) == null ? void 0 : e.normalized) ?? null;
}
c(Cb, "exportTileCriteria");
function Wd(t) {
  const e = fm(t);
  if (!(e != null && e.normalized))
    return {
      errors: [],
      warnings: [],
      errorFileIndexes: [],
      warningFileIndexes: []
    };
  const n = jh(e.normalized, { files: t.files }), i = /* @__PURE__ */ c((a) => {
    const l = e.sources[a.leftIndex] ?? null, u = e.sources[a.rightIndex] ?? null;
    return {
      ...a,
      leftFileIndex: l == null ? void 0 : l.fileIndex,
      rightFileIndex: u == null ? void 0 : u.fileIndex
    };
  }, "mapConflict"), r = n.errors.map((a) => i(a)), o = n.warnings.map((a) => i(a)), s = /* @__PURE__ */ c((a) => {
    const l = /* @__PURE__ */ new Set();
    for (const u of a)
      Number.isInteger(u.leftFileIndex) && l.add(u.leftFileIndex), Number.isInteger(u.rightFileIndex) && l.add(u.rightFileIndex);
    return [...l];
  }, "toFileIndexes");
  return {
    errors: r,
    warnings: o,
    errorFileIndexes: s(r),
    warningFileIndexes: s(o)
  };
}
c(Wd, "analyzeRuleConflicts");
function ss(t, e = "neutral") {
  const n = document.createElement("span");
  return n.classList.add("eidolon-tile-criteria__badge"), n.dataset.kind = e, n.textContent = t, n;
}
c(ss, "createBadge");
function Tb(t, e = {}) {
  const n = typeof t == "string" ? t : "", {
    maxLength: i = 42,
    headLength: r = 20,
    tailLength: o = 16
  } = e;
  if (!n || n.length <= i) return n;
  const s = n.slice(0, r).trimEnd(), a = n.slice(-o).trimStart();
  return `${s}...${a}`;
}
c(Tb, "middleEllipsis");
function Lb(t) {
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
      matches: /* @__PURE__ */ c((o) => r.test(String(o ?? "")), "matches")
    };
  } catch (r) {
    return {
      error: (r == null ? void 0 : r.message) ?? C("EIDOLON.TileCriteria.InvalidRegex", "Invalid regex."),
      matches: /* @__PURE__ */ c(() => !0, "matches")
    };
  }
}
c(Lb, "createRegexFilter");
function Ib(t, e) {
  const n = document.createElement("select");
  n.dataset.criteriaKey = t.key;
  const i = document.createElement("option");
  i.value = Dc, i.textContent = "*", n.appendChild(i);
  const r = new Set(t.values ?? []);
  e && !r.has(e) && r.add(e);
  for (const o of r) {
    const s = document.createElement("option");
    s.value = o, s.textContent = o, n.appendChild(s);
  }
  return n.value = e ?? Dc, n;
}
c(Ib, "createCriterionSelect");
function kb(t, e, n, i) {
  var a;
  const r = document.createElement("div");
  r.classList.add("eidolon-tile-criteria__rule-editor");
  const o = document.createElement("div");
  o.classList.add("eidolon-tile-criteria__rule-grid");
  for (const l of e.criteriaDefinitions) {
    const u = document.createElement("label");
    u.classList.add("eidolon-tile-criteria__rule-field");
    const d = document.createElement("span");
    d.classList.add("eidolon-tile-criteria__criterion-label"), d.textContent = l.label, u.appendChild(d);
    const f = Ib(l, (a = t.criteria) == null ? void 0 : a[l.key]);
    f.addEventListener("change", () => {
      f.value === Dc ? delete t.criteria[l.key] : t.criteria[l.key] = f.value, i();
    }), u.appendChild(f), o.appendChild(u);
  }
  r.appendChild(o);
  const s = document.createElement("button");
  return s.type = "button", s.classList.add("control", "ui-control", "eidolon-tile-criteria__rule-remove"), s.textContent = C("EIDOLON.TileCriteria.RemoveRule", "Remove"), s.addEventListener("click", () => {
    const u = Hc(e, n).filter((d) => d.id !== t.id);
    e.rulesByFile.set(n, u), i();
  }), r.appendChild(s), r;
}
c(kb, "renderRuleEditor");
const Cs = /* @__PURE__ */ new WeakMap();
function hm(t) {
  return (t == null ? void 0 : t.app) ?? (t == null ? void 0 : t.tile) ?? null;
}
c(hm, "getDialogOwner");
function Ob(t) {
  for (const e of t) {
    const n = Ye(e);
    if (n) return n;
    const i = Ye(e == null ? void 0 : e.element);
    if (i) return i;
  }
  return null;
}
c(Ob, "findDialogRoot$1");
function Ab(t, e, n) {
  const i = t.state, r = i.fileEntries.find((y) => y.index === e);
  if (!r) return document.createElement("div");
  const o = document.createElement("section");
  o.classList.add("eidolon-tile-criteria__dialog-content");
  const s = document.createElement("header");
  s.classList.add("eidolon-tile-criteria__editor-header");
  const a = document.createElement("h4");
  a.textContent = i.relativePaths.get(r.index) || r.label, s.appendChild(a);
  const l = document.createElement("p");
  l.classList.add("notes"), l.textContent = `#${r.index + 1} · ${r.path || C("EIDOLON.TileCriteria.UnknownPath", "Unknown path")}`, s.appendChild(l), o.appendChild(s);
  const u = document.createElement("div");
  u.classList.add("eidolon-tile-criteria__editor-controls");
  const d = document.createElement("button");
  d.type = "button", d.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action"), i.defaultIndex === r.index ? (d.textContent = C("EIDOLON.TileCriteria.IsDefault", "Default Target"), d.disabled = !0) : (d.textContent = C("EIDOLON.TileCriteria.SetDefault", "Set As Default"), d.addEventListener("click", () => {
    i.defaultIndex = r.index, ot(t), n();
  })), u.appendChild(d);
  const f = document.createElement("button");
  f.type = "button", f.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action", "secondary"), f.textContent = C("EIDOLON.TileCriteria.ClearFileRules", "Clear File Rules"), f.addEventListener("click", () => {
    i.rulesByFile.set(r.index, []), ot(t), n();
  }), u.appendChild(f), o.appendChild(u);
  const h = document.createElement("div");
  h.classList.add("eidolon-tile-criteria__rule-editors");
  const m = Hc(i, r.index);
  if (m.length)
    for (const y of m)
      h.appendChild(
        kb(y, i, r.index, () => {
          ot(t), n();
        })
      );
  else {
    const y = document.createElement("p");
    y.classList.add("notes"), y.textContent = C(
      "EIDOLON.TileCriteria.NoRulesForFile",
      "No rules map to this file yet. Add one to define when this variant should be active."
    ), h.appendChild(y);
  }
  o.appendChild(h);
  const p = document.createElement("button");
  return p.type = "button", p.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action"), p.textContent = C("EIDOLON.TileCriteria.AddRule", "Add Rule"), p.disabled = !i.criteriaDefinitions.length, p.addEventListener("click", () => {
    Hc(i, r.index).push({
      id: i.nextRuleId,
      criteria: {}
    }), i.nextRuleId += 1, ot(t), n();
  }), o.appendChild(p), o;
}
c(Ab, "buildRuleEditorContent");
function Mb(t, e) {
  var f, h, m;
  const n = hm(t);
  if (!n) return;
  const i = Cs.get(n);
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
  Cs.set(n, r);
  const o = /* @__PURE__ */ c(() => {
    Cs.delete(n);
  }, "closeDialog"), s = /* @__PURE__ */ c(() => {
    r.host instanceof HTMLElement && r.host.replaceChildren(
      Ab(r.controller, r.fileIndex, s)
    );
  }, "refreshDialog");
  r.refresh = s;
  const a = C("EIDOLON.TileCriteria.EditorTitle", "Edit Tile Criteria Rules"), l = '<div class="eidolon-tile-criteria-editor-host"></div>', u = C("EIDOLON.TileCriteria.CloseEditor", "Close"), d = (m = (h = foundry == null ? void 0 : foundry.applications) == null ? void 0 : h.api) == null ? void 0 : m.DialogV2;
  if (typeof (d == null ? void 0 : d.wait) == "function") {
    d.wait({
      window: { title: a },
      content: l,
      buttons: [{ action: "close", label: u, default: !0 }],
      render: /* @__PURE__ */ c((...p) => {
        var v;
        const y = Ob(p), E = (v = y == null ? void 0 : y.querySelector) == null ? void 0 : v.call(y, ".eidolon-tile-criteria-editor-host");
        E instanceof HTMLElement && (r.host = E, s());
      }, "render"),
      close: o,
      rejectClose: !1
    }).catch((p) => {
      console.warn(`${ie} | Rule editor dialog failed`, p), o();
    });
    return;
  }
  o();
}
c(Mb, "openRuleEditorDialog");
function zd(t) {
  var i;
  const e = hm(t);
  if (!e) return;
  const n = Cs.get(e);
  (i = n == null ? void 0 : n.refresh) == null || i.call(n);
}
c(zd, "refreshOpenRuleEditor");
function qc(t, e) {
  return (t.rulesByFile.get(e) ?? []).length > 0;
}
c(qc, "hasRulesForFile");
function mm(t, e) {
  var n, i;
  return ((n = t == null ? void 0 : t.errorFileIndexes) == null ? void 0 : n.includes(e)) || ((i = t == null ? void 0 : t.warningFileIndexes) == null ? void 0 : i.includes(e));
}
c(mm, "hasConflictForFile");
function xb(t, e, n) {
  switch (t.filterMode) {
    case "unmapped":
      return !qc(t, e.index);
    case "mapped":
      return qc(t, e.index);
    case "conflicts":
      return mm(n, e.index);
    case "all":
    default:
      return !0;
  }
}
c(xb, "matchesFilterMode");
function _b(t, e) {
  let n = 0, i = 0, r = 0;
  for (const o of t.fileEntries)
    qc(t, o.index) ? n += 1 : i += 1, mm(e, o.index) && (r += 1);
  return {
    all: t.fileEntries.length,
    mapped: n,
    unmapped: i,
    conflicts: r
  };
}
c(_b, "getFilterModeCounts");
function Nb(t) {
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
c(Nb, "getFilterModeLabel");
function gm(t, e, n, i, r) {
  var u, d;
  const o = [...t.folders.keys()].sort((f, h) => f.localeCompare(h));
  for (const f of o) {
    const h = wb(f, t.folders.get(f)), m = document.createElement("li");
    m.classList.add("eidolon-tile-criteria__tree-branch");
    const p = document.createElement("div");
    p.classList.add("document", "folder", "update", "eidolon-tile-criteria__folder-row");
    const y = document.createElement("i");
    y.classList.add("fa-solid", "fa-folder-open"), p.appendChild(y);
    const E = document.createElement("span");
    E.classList.add("eidolon-tile-criteria__tree-folder-label"), E.textContent = h.label, E.title = h.label, p.appendChild(E), m.appendChild(p);
    const v = document.createElement("ul");
    v.classList.add("eidolon-tile-criteria__tree"), v.dataset.folder = h.label, gm(h.node, e, n, i, v), v.childElementCount > 0 && m.appendChild(v), r.appendChild(m);
  }
  const s = [...t.files].sort((f, h) => f.name.localeCompare(h.name));
  if (!s.length) return;
  const a = document.createElement("li"), l = document.createElement("ul");
  l.classList.add("document-list", "eidolon-tile-criteria__document-list");
  for (const f of s) {
    const h = f.entry, m = h.index === e.selectedFileIndex, p = h.index === e.defaultIndex, y = Eb(e, h.index), E = document.createElement("li");
    E.classList.add("document", "update", "eidolon-tile-criteria__tree-file");
    const v = document.createElement("button");
    v.type = "button", v.classList.add("eidolon-tile-criteria__file-row");
    const b = (u = i == null ? void 0 : i.errorFileIndexes) == null ? void 0 : u.includes(h.index), w = (d = i == null ? void 0 : i.warningFileIndexes) == null ? void 0 : d.includes(h.index);
    b ? v.classList.add("has-conflict") : w && v.classList.add("has-warning");
    const S = e.relativePaths.get(h.index) || h.path || f.name, T = [S];
    b ? T.push(
      C(
        "EIDOLON.TileCriteria.ConflictFileHint",
        "This file participates in one or more conflicting rules."
      )
    ) : w && T.push(
      C(
        "EIDOLON.TileCriteria.WarningFileHint",
        "This file has potentially redundant rules."
      )
    ), y.length || T.push(
      C(
        "EIDOLON.TileCriteria.UnmappedHint",
        "No criteria rules map to this file."
      )
    ), v.title = T.join(`
`), m && v.classList.add("is-selected"), v.addEventListener("click", () => {
      e.selectedFileIndex = h.index, ot(n), Mb(n, h.index);
    });
    const L = document.createElement("span");
    L.classList.add("eidolon-tile-criteria__indicator"), L.dataset.kind = p ? "default" : y.length ? "mapped" : "unmapped", v.appendChild(L);
    const A = document.createElement("span");
    A.classList.add("eidolon-tile-criteria__file-content");
    const M = document.createElement("span");
    M.classList.add("eidolon-tile-criteria__file-heading");
    const F = document.createElement("span");
    F.classList.add("eidolon-tile-criteria__file-title"), F.textContent = Tb(f.name || h.label), F.title = S, M.appendChild(F);
    const N = ss(`#${h.index + 1}`, "meta");
    N.classList.add("eidolon-tile-criteria__index-badge"), M.appendChild(N), A.appendChild(M);
    const $ = document.createElement("span");
    $.classList.add("eidolon-tile-criteria__badges"), p && $.appendChild(ss(C("EIDOLON.TileCriteria.DefaultBadge", "Default"), "default"));
    const x = y.slice(0, 2);
    for (const R of x)
      $.appendChild(ss(R, "rule"));
    if (y.length > x.length && $.appendChild(ss(`+${y.length - x.length}`, "meta")), A.appendChild($), v.appendChild(A), b || w) {
      const R = document.createElement("span");
      R.classList.add("eidolon-tile-criteria__row-warning"), R.dataset.mode = b ? "error" : "warning", R.innerHTML = '<i class="fa-solid fa-triangle-exclamation" inert=""></i>', v.appendChild(R);
    }
    E.appendChild(v), l.appendChild(E);
  }
  a.appendChild(l), r.appendChild(a);
}
c(gm, "renderTreeNode");
function $b(t, e, n, i = {}) {
  const r = document.createElement("section");
  r.classList.add("eidolon-tile-criteria__tree-panel");
  const o = Lb(t.filterQuery), s = _b(t, n);
  t.filterMode !== "all" && s[t.filterMode] === 0 && (t.filterMode = "all");
  const a = document.createElement("div");
  a.classList.add("eidolon-tile-criteria__toolbar");
  const l = document.createElement("div");
  l.classList.add("eidolon-tile-criteria__mode-bar");
  for (const b of il) {
    const w = document.createElement("button");
    w.type = "button", w.classList.add("control", "ui-control", "eidolon-tile-criteria__mode-button"), w.dataset.mode = b, w.textContent = Nb(b);
    const S = b === "all" || s[b] > 0;
    w.disabled = !S, S || (w.dataset.tooltip = C(
      "EIDOLON.TileCriteria.FilterModeUnavailable",
      "No entries currently match this filter."
    ), w.title = w.dataset.tooltip), t.filterMode === b ? (w.classList.add("is-active"), w.setAttribute("aria-pressed", "true")) : w.setAttribute("aria-pressed", "false"), w.addEventListener("click", () => {
      t.filterMode !== b && (t.filterMode = b, ot(e));
    }), l.appendChild(w);
  }
  a.appendChild(l);
  const u = document.createElement("div");
  u.classList.add("eidolon-tile-criteria__filter-row");
  const d = document.createElement("input");
  d.type = "text", d.classList.add("eidolon-tile-criteria__filter-input"), d.placeholder = C("EIDOLON.TileCriteria.FilterPlaceholder", "Regex filter (path)"), d.value = t.filterQuery, d.autocomplete = "off", d.addEventListener("keydown", (b) => {
    b.stopPropagation(), b.key === "Enter" && b.preventDefault();
  }), d.addEventListener("keyup", (b) => {
    b.stopPropagation();
  }), d.addEventListener("change", (b) => {
    b.stopPropagation();
  }), d.addEventListener("input", (b) => {
    b.stopPropagation();
    const w = d.selectionStart ?? d.value.length, S = d.selectionEnd ?? w;
    t.filterQuery = d.value, ot(e), requestAnimationFrame(() => {
      const T = e.section.querySelector(".eidolon-tile-criteria__filter-input");
      if (T instanceof HTMLInputElement) {
        T.focus();
        try {
          T.setSelectionRange(w, S);
        } catch {
        }
      }
    });
  }), u.appendChild(d);
  const f = document.createElement("div");
  f.classList.add("eidolon-tile-criteria__toolbar-actions");
  const h = document.createElement("button");
  h.type = "button";
  const m = C("EIDOLON.TileCriteria.Save", "Save Rules");
  h.classList.add("control", "ui-control", "eidolon-tile-criteria__toolbar-action", "icon-only"), h.dataset.tooltip = m, h.setAttribute("aria-label", m), h.title = m, h.innerHTML = '<i class="fa-solid fa-floppy-disk" inert=""></i>', h.disabled = n.errors.length > 0, h.addEventListener("click", () => {
    var b;
    (b = i.onSave) == null || b.call(i);
  }), f.appendChild(h);
  const p = document.createElement("button");
  p.type = "button";
  const y = C("EIDOLON.TileCriteria.Clear", "Clear Rules");
  if (p.classList.add("control", "ui-control", "secondary", "eidolon-tile-criteria__toolbar-action", "icon-only"), p.dataset.tooltip = y, p.setAttribute("aria-label", y), p.title = y, p.innerHTML = '<i class="fa-solid fa-trash" inert=""></i>', p.addEventListener("click", () => {
    var b;
    (b = i.onClear) == null || b.call(i);
  }), f.appendChild(p), u.appendChild(f), a.appendChild(u), r.appendChild(a), o.error) {
    const b = document.createElement("p");
    b.classList.add("notes", "eidolon-tile-criteria__filter-error"), b.textContent = `${C("EIDOLON.TileCriteria.InvalidRegex", "Invalid regex")}: ${o.error}`, r.appendChild(b);
  }
  const E = document.createElement("div");
  E.classList.add("eidolon-tile-criteria__library-tree");
  const v = t.fileEntries.filter((b) => {
    const w = t.relativePaths.get(b.index) || b.path || b.label;
    return xb(t, b, n) && o.matches(w);
  });
  if (t.fileEntries.length)
    if (v.length) {
      const b = document.createElement("ul");
      b.classList.add("eidolon-tile-criteria__tree"), gm(vb(v), t, e, n, b), E.appendChild(b);
    } else {
      const b = document.createElement("p");
      b.classList.add("notes"), b.textContent = C("EIDOLON.TileCriteria.NoMatches", "No variants match this filter."), E.appendChild(b);
    }
  else {
    const b = document.createElement("p");
    b.classList.add("notes"), b.textContent = C("EIDOLON.TileCriteria.NoVariants", "No MATT variants found"), E.appendChild(b);
  }
  return r.appendChild(E), r;
}
c($b, "renderTreePanel");
function ot(t) {
  const { section: e, state: n } = t, i = Wd(n);
  gb(t), e.replaceChildren();
  const r = /* @__PURE__ */ c(async () => {
    try {
      const s = Wd(n);
      if (s.errors.length) {
        n.status = {
          mode: "error",
          message: C(
            "EIDOLON.TileCriteria.ConflictSaveBlocked",
            `Resolve ${s.errors.length} conflict(s) before saving tile criteria rules.`
          )
        }, ot(t);
        return;
      }
      const a = Cb(n);
      if (!a) {
        n.status = {
          mode: "error",
          message: C("EIDOLON.TileCriteria.Invalid", "Invalid rules. Select valid target variants.")
        }, ot(t);
        return;
      }
      await Gd(t.tile, a);
      const l = n.filterQuery, u = n.filterMode, d = n.selectedFileIndex;
      t.state = Rc(t.tile), t.state.filterQuery = l, t.state.filterMode = u, Number.isInteger(d) && (t.state.selectedFileIndex = d), t.state.status = {
        mode: "ready",
        message: C("EIDOLON.TileCriteria.Saved", "Tile criteria rules saved.")
      }, ot(t), zd(t);
    } catch (s) {
      console.error(`${ie} | Failed to save tile criteria`, s), n.status = {
        mode: "error",
        message: (s == null ? void 0 : s.message) ?? "Failed to save tile criteria rules."
      }, ot(t);
    }
  }, "handleSave"), o = /* @__PURE__ */ c(async () => {
    try {
      await Gd(t.tile, null);
      const s = n.filterQuery, a = n.filterMode, l = n.selectedFileIndex;
      t.state = Rc(t.tile), t.state.filterQuery = s, t.state.filterMode = a, Number.isInteger(l) && (t.state.selectedFileIndex = l), t.state.status = {
        mode: "ready",
        message: C("EIDOLON.TileCriteria.Cleared", "Tile criteria rules cleared.")
      }, ot(t), zd(t);
    } catch (s) {
      console.error(`${ie} | Failed to clear tile criteria`, s), n.status = {
        mode: "error",
        message: (s == null ? void 0 : s.message) ?? "Failed to clear tile criteria rules."
      }, ot(t);
    }
  }, "handleClear");
  if (e.appendChild($b(n, t, i, {
    onSave: r,
    onClear: o
  })), i.errors.length || i.warnings.length) {
    const s = document.createElement("section");
    s.classList.add("eidolon-tile-criteria__conflicts");
    const a = document.createElement("p");
    a.classList.add("eidolon-tile-criteria__conflict-summary", "notes"), i.errors.length ? (a.dataset.mode = "error", a.textContent = C(
      "EIDOLON.TileCriteria.ConflictSummary",
      `${i.errors.length} conflict(s) must be resolved before saving${i.warnings.length ? ` (${i.warnings.length} warning(s))` : ""}.`
    )) : (a.dataset.mode = "warning", a.textContent = C(
      "EIDOLON.TileCriteria.WarningSummary",
      `${i.warnings.length} potential issue(s) detected.`
    )), s.appendChild(a);
    const l = document.createElement("p");
    l.classList.add("eidolon-tile-criteria__conflict-hint", "notes"), l.textContent = C(
      "EIDOLON.TileCriteria.ConflictHint",
      "Files involved in clashes are marked in red with a warning icon."
    ), s.appendChild(l), e.appendChild(s);
  }
  if (n.status.mode === "error" || n.status.mode === "warning") {
    const s = document.createElement("p");
    s.classList.add("eidolon-tile-criteria__status", "notes"), s.dataset.mode = n.status.mode, s.textContent = n.status.message, e.appendChild(s);
  }
}
c(ot, "renderController");
function Fb(t, e = null) {
  const n = document.createElement("section");
  n.classList.add("eidolon-tile-criteria");
  const i = Rc(t);
  mb(i, hb(e));
  const r = {
    app: e,
    tile: t,
    section: n,
    state: i
  };
  return ot(r), r;
}
c(Fb, "createController");
function Db(t, e) {
  return Gu(
    t,
    e,
    Pc,
    C("EIDOLON.TileCriteria.TabLabel", "Criteria"),
    fb
  );
}
c(Db, "ensureTileCriteriaTab");
function Pb() {
  Hooks.on("renderTileConfig", (t, e) => {
    var l, u, d, f;
    const n = Ye(e);
    if (!n) return;
    const i = pb(t);
    if (!i) return;
    if ((l = n.querySelector(".eidolon-tile-criteria")) == null || l.remove(), !Xa()) {
      (u = n.querySelector(`.item[data-tab='${Pc}']`)) == null || u.remove(), (d = n.querySelector(`.tab[data-tab='${Pc}']`)) == null || d.remove();
      return;
    }
    const r = Fb(i, t), o = Db(t, n);
    if (o instanceof HTMLElement) {
      o.replaceChildren(r.section), (f = t.setPosition) == null || f.call(t, { height: "auto" });
      return;
    }
    const s = (t == null ? void 0 : t.form) instanceof HTMLFormElement ? t.form : n instanceof HTMLFormElement ? n : n.querySelector("form");
    if (!(s instanceof HTMLFormElement)) return;
    const a = s.querySelector("button[type='submit']");
    a != null && a.parentElement ? a.parentElement.insertAdjacentElement("beforebegin", r.section) : s.appendChild(r.section);
  });
}
c(Pb, "registerTileCriteriaConfigControls");
const Rb = ["Checkbox", "Tile", "Settings", "Toggleable Lights"], Hb = [
  "Checkbox",
  "Tile",
  "Settings",
  "Toggleable Lights",
  "Checked",
  "Unchecked",
  "Individual"
];
function qb() {
  if (!globalThis.Tagger) return [];
  const t = Tagger.getByTag(Rb) ?? [], e = [];
  for (const n of t) {
    if (n.getFlag("monks-active-tiles", "variables.state") !== "unchecked") continue;
    const i = (Tagger.getTags(n) ?? []).filter((s) => !Hb.includes(s)), r = (Tagger.getByTag("Disable Automation") ?? []).concat(Tagger.getByTag("Settings") ?? []), o = Tagger.getByTag(i, { ignore: r }) ?? [];
    for (const s of o)
      s != null && s._id && e.push(s._id);
  }
  return e;
}
c(qb, "buildLightControlsMap");
function jb() {
  Jh(qb);
}
c(jb, "registerCheckboxLightProvider");
function Bb(t) {
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
c(Bb, "toList");
function Ub(t, e) {
  const n = t == null ? void 0 : t.tools;
  return Array.isArray(n) ? n.some((i) => (i == null ? void 0 : i.name) === e) : n instanceof Map ? n.has(e) : n && typeof n == "object" ? e in n ? !0 : Object.values(n).some((i) => (i == null ? void 0 : i.name) === e) : !1;
}
c(Ub, "hasTool");
function Vb(t, e) {
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
c(Vb, "addTool");
function Gb() {
  Hooks.on("getSceneControlButtons", (t) => {
    var i;
    const e = Bb(t);
    if (!e.length) return;
    const n = e.find((r) => (r == null ? void 0 : r.name) === "tiles") ?? e.find((r) => (r == null ? void 0 : r.name) === "tokens" || (r == null ? void 0 : r.name) === "token") ?? e[0];
    n && (Ub(n, "eidolonCriteriaSwitcher") || Vb(n, {
      name: "eidolonCriteriaSwitcher",
      title: "Criteria Switcher",
      icon: "fa-solid fa-sliders",
      button: !0,
      toggle: !1,
      visible: Za(((i = game.scenes) == null ? void 0 : i.viewed) ?? null),
      onClick: /* @__PURE__ */ c(() => Vu(), "onClick")
    }));
  });
}
c(Gb, "registerSceneControlButton");
function as(t, e) {
  if (!t || typeof t != "object") return !1;
  const n = String(e).split(".");
  let i = t;
  for (const r of n) {
    if (!i || typeof i != "object" || !Object.prototype.hasOwnProperty.call(i, r)) return !1;
    i = i[r];
  }
  return !0;
}
c(as, "hasOwnPath");
function Wb() {
  const t = /* @__PURE__ */ c((i, r = null) => {
    i && Ey(i, r);
  }, "invalidateTileScene"), e = /* @__PURE__ */ c((i, r = null) => {
    i && qy(i, r);
  }, "invalidatePlaceableScene");
  Hooks.on("createTile", (i) => {
    t((i == null ? void 0 : i.parent) ?? null, i ?? null);
  }), Hooks.on("deleteTile", (i) => {
    t((i == null ? void 0 : i.parent) ?? null, i ?? null);
  }), Hooks.on("updateTile", (i, r) => {
    (as(r, `flags.${ie}.tileCriteria`) || as(r, `flags.${ie}.fileIndex`)) && t((i == null ? void 0 : i.parent) ?? null, i ?? null);
  });
  const n = /* @__PURE__ */ c((i) => {
    Hooks.on(`create${i}`, (r) => {
      e((r == null ? void 0 : r.parent) ?? null, r ?? null);
    }), Hooks.on(`delete${i}`, (r) => {
      e((r == null ? void 0 : r.parent) ?? null, r ?? null);
    }), Hooks.on(`update${i}`, (r, o) => {
      const s = as(o, `flags.${ie}.presets`), a = i === "AmbientLight" && as(o, `flags.${ie}.lightCriteria`);
      !s && !a || e((r == null ? void 0 : r.parent) ?? null, r ?? null);
    });
  }, "registerPlaceableHooks");
  n("AmbientLight"), n("Wall"), n("AmbientSound"), Hooks.on("canvasReady", (i) => {
    const r = (i == null ? void 0 : i.scene) ?? null;
    r && (t(r), e(r));
  });
}
c(Wb, "registerCriteriaCacheInvalidationHooks");
function zb() {
  zy(), jb(), Gb(), Pb(), Wb(), Hooks.once("init", () => {
    var t, e;
    (e = (t = game.keybindings) == null ? void 0 : t.register) == null || e.call(t, ie, "toggleCriteriaSwitcher", {
      name: "Toggle Criteria Switcher",
      hint: "Open or close the criteria switcher window for live scene state updates.",
      editable: [{ key: "KeyM", modifiers: ["Alt"] }],
      onDown: /* @__PURE__ */ c(() => {
        var n, i, r;
        return Za(((n = game.scenes) == null ? void 0 : n.viewed) ?? null) ? (Vu(), !0) : ((r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "You do not have permission to manage scene criteria."), !0);
      }, "onDown"),
      restricted: !0,
      precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
    });
  }), Hooks.on("canvasReady", (t) => {
    var n;
    const e = nl();
    e && (e.setScene((t == null ? void 0 : t.scene) ?? ((n = game.scenes) == null ? void 0 : n.viewed) ?? null), e.render({ force: !0 }));
  }), Hooks.once("ready", () => {
    var e, n;
    const t = (n = (e = game.modules) == null ? void 0 : e.get) == null ? void 0 : n.call(e, ie);
    t && (t.api || (t.api = {}), t.api.criteria = nb, console.log(`${ie} | Criteria engine API registered`));
  });
}
c(zb, "registerCriteriaEngineHooks");
zb();
const Ts = /* @__PURE__ */ new WeakMap(), ls = /* @__PURE__ */ new WeakMap(), Le = "__eidolon_default__";
function Yb() {
  Hooks.on("renderAmbientLightConfig", Kb), D("LightCriteria | AmbientLightConfig controls registered");
}
c(Yb, "registerAmbientLightCriteriaControls");
function Kb(t, e) {
  var n;
  Ar("LightCriteria | renderAmbientLightConfig", {
    appId: (t == null ? void 0 : t.id) ?? null,
    constructor: ((n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) ?? null,
    isRendered: (t == null ? void 0 : t.rendered) ?? !1
  });
  try {
    const i = Ye(e);
    if (!i) return;
    if (!Xa()) {
      i.querySelectorAll(".eidolon-light-criteria, .eidolon-light-criteria-main-switcher").forEach((r) => r.remove());
      return;
    }
    Xb(t, i);
  } catch (i) {
    console.error("eidolon-utilities | Failed to enhance AmbientLightConfig UI", i);
  } finally {
    ii();
  }
}
c(Kb, "handleAmbientLightConfigRender");
function Xb(t, e) {
  var jr, pi, Br, yi, ge;
  const n = (t == null ? void 0 : t.form) instanceof HTMLFormElement ? t.form : e instanceof HTMLFormElement ? e : (jr = e == null ? void 0 : e.closest) == null ? void 0 : jr.call(e, "form");
  if (!(n instanceof HTMLFormElement)) return;
  const i = n.querySelector(".window-content");
  if (!(i instanceof HTMLElement)) return;
  const r = ym(t);
  if (!r) return;
  const o = bv(r);
  D("LightCriteria | Resolved ambient light", {
    sheetId: (r == null ? void 0 : r.id) ?? null,
    persistedId: (o == null ? void 0 : o.id) ?? null,
    sameRef: r === o
  });
  const s = (o == null ? void 0 : o.parent) ?? r.parent ?? null, a = s ? Kp(s) : [], l = a.filter(
    (H) => Array.isArray(H == null ? void 0 : H.values) && H.values.length > 0
  ), u = lv(a), d = a.map((H) => typeof (H == null ? void 0 : H.id) == "string" ? H.id : null).filter((H) => !!H), f = o ?? r, h = s ? bt(s) : [];
  let m = zh(f);
  const p = Ay(m, h);
  JSON.stringify(p) !== JSON.stringify(m) && (m = p, Yh(f, p).catch((H) => {
    console.warn("eidolon-utilities | Failed to persist migrated light criteria keys", H);
  })), D("LightCriteria | Loaded mapping state", {
    hasBase: !!(m != null && m.base),
    mappingCount: Array.isArray(m == null ? void 0 : m.mappings) ? m.mappings.length : 0,
    mappings: Array.isArray(m == null ? void 0 : m.mappings) ? m.mappings.map((H) => {
      var Y, te;
      return {
        id: H.id,
        key: H.key,
        hasColor: !!((te = (Y = H.config) == null ? void 0 : Y.config) != null && te.color)
      };
    }) : []
  });
  const y = i.querySelector(".eidolon-light-criteria");
  y && y.remove(), i.querySelectorAll(".eidolon-light-criteria-main-switcher").forEach((H) => H.remove());
  const E = document.createElement("fieldset");
  E.classList.add("eidolon-light-criteria");
  const v = document.createElement("legend");
  v.textContent = C("EIDOLON.LightCriteria.Legend", "Scene Criteria Lighting"), E.appendChild(v);
  const b = document.createElement("p");
  b.classList.add("notes"), b.textContent = C(
    "EIDOLON.LightCriteria.Description",
    "Capture a base lighting state, then map criteria values to lighting configurations."
  ), E.appendChild(b);
  const w = document.createElement("div");
  w.classList.add("eidolon-light-criteria__controls");
  const S = document.createElement("button");
  S.type = "button", S.dataset.action = "make-default", S.classList.add("eidolon-light-criteria__button"), S.textContent = C(
    "EIDOLON.LightCriteria.SetBase",
    "Set Base"
  ), w.appendChild(S);
  const T = document.createElement("button");
  T.type = "button", T.dataset.action = "create-mapping", T.classList.add("eidolon-light-criteria__button"), T.textContent = C(
    "EIDOLON.LightCriteria.CreateMapping",
    "Add Criteria Mapping"
  ), T.setAttribute("aria-expanded", "false"), w.appendChild(T), E.appendChild(w);
  const L = document.createElement("p");
  L.classList.add("notes", "eidolon-light-criteria__status"), E.appendChild(L);
  const A = document.createElement("div");
  A.classList.add("eidolon-light-criteria__switcher");
  const M = document.createElement("label");
  M.classList.add("eidolon-light-criteria__switcher-label");
  const F = `${(t == null ? void 0 : t.id) ?? (r == null ? void 0 : r.id) ?? "eidolon-light"}-mapping-select`;
  M.htmlFor = F, M.textContent = C("EIDOLON.LightCriteria.SelectLabel", "Criteria Mapping"), A.appendChild(M);
  const N = document.createElement("details");
  N.classList.add("eidolon-light-criteria__filter-details");
  const $ = document.createElement("summary");
  $.classList.add("eidolon-light-criteria__filter-summary");
  const x = document.createElement("span");
  x.classList.add("eidolon-light-criteria__filter-summary-label"), x.textContent = C(
    "EIDOLON.LightCriteria.FilterHeading",
    "Filter mappings"
  ), $.appendChild(x);
  const R = document.createElement("span");
  R.classList.add("eidolon-light-criteria__filter-meta"), $.appendChild(R), N.appendChild($);
  const P = document.createElement("div");
  P.classList.add("eidolon-light-criteria__filter-panel");
  const j = document.createElement("div");
  j.classList.add("eidolon-light-criteria__filter-grid");
  for (const H of l) {
    const Y = document.createElement("label");
    Y.classList.add("eidolon-light-criteria__filter");
    const te = document.createElement("span");
    te.classList.add("eidolon-light-criteria__filter-name"), te.textContent = (Br = (pi = H.name) == null ? void 0 : pi.trim) != null && Br.call(pi) ? H.name.trim() : C("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), Y.appendChild(te);
    const ne = document.createElement("select");
    ne.dataset.filterCategoryId = H.id, ne.classList.add("eidolon-light-criteria__filter-select");
    const re = document.createElement("option");
    re.value = "", re.textContent = C("EIDOLON.LightCriteria.FilterAny", "Any"), ne.appendChild(re);
    for (const pe of H.values) {
      const be = document.createElement("option");
      be.value = pe, be.textContent = pe, ne.appendChild(be);
    }
    Y.appendChild(ne), j.appendChild(Y);
  }
  P.appendChild(j);
  const q = document.createElement("div");
  q.classList.add("eidolon-light-criteria__filter-actions");
  const B = document.createElement("button");
  B.type = "button", B.dataset.action = "clear-mapping-filters", B.classList.add("eidolon-light-criteria__button", "secondary", "compact"), B.textContent = C("EIDOLON.LightCriteria.ClearFilters", "Clear Filters"), q.appendChild(B), P.appendChild(q), N.appendChild(P), N.hidden = l.length === 0, A.appendChild(N);
  const z = document.createElement("div");
  z.classList.add("eidolon-light-criteria__switcher-controls"), A.appendChild(z);
  const Z = document.createElement("select");
  Z.id = F, Z.classList.add("eidolon-light-criteria__select"), Z.dataset.action = "select-mapping", z.appendChild(Z);
  const U = document.createElement("button");
  U.type = "button", U.dataset.action = "apply-selected-mapping", U.classList.add("eidolon-light-criteria__button", "secondary"), U.textContent = C("EIDOLON.LightCriteria.ApplyButton", "Apply"), z.appendChild(U);
  const G = document.createElement("details");
  G.classList.add("eidolon-light-criteria__menu"), G.dataset.action = "mapping-actions-menu";
  const me = document.createElement("summary");
  me.classList.add("eidolon-light-criteria__menu-toggle"), me.innerHTML = '<i class="fa-solid fa-ellipsis-vertical" inert=""></i>', me.setAttribute(
    "aria-label",
    C("EIDOLON.LightCriteria.MoreActions", "More actions")
  ), me.dataset.tooltip = C("EIDOLON.LightCriteria.MoreActions", "More actions"), G.appendChild(me);
  const Ke = document.createElement("div");
  Ke.classList.add("eidolon-light-criteria__menu-list"), G.appendChild(Ke);
  const ce = document.createElement("button");
  ce.type = "button", ce.dataset.action = "update-selected-mapping", ce.classList.add("eidolon-light-criteria__menu-item"), ce.textContent = C(
    "EIDOLON.LightCriteria.UpdateSelected",
    "Save current config to selected"
  ), Ke.appendChild(ce);
  const Se = document.createElement("button");
  Se.type = "button", Se.dataset.action = "edit-selected-mapping-criteria", Se.classList.add("eidolon-light-criteria__menu-item"), Se.textContent = C(
    "EIDOLON.LightCriteria.EditSelectedCriteria",
    "Edit selected mapping criteria"
  ), Ke.appendChild(Se);
  const He = document.createElement("button");
  He.type = "button", He.dataset.action = "remove-selected-mapping", He.classList.add("eidolon-light-criteria__menu-item", "danger"), He.textContent = C(
    "EIDOLON.LightCriteria.RemoveSelected",
    "Delete selected mapping"
  ), Ke.appendChild(He), z.appendChild(G);
  const gn = document.createElement("div");
  gn.classList.add("eidolon-light-criteria-main-switcher"), gn.appendChild(A);
  const $e = document.createElement("p");
  if ($e.classList.add("notes", "eidolon-light-criteria-main-switcher__empty"), $e.textContent = C(
    "EIDOLON.LightCriteria.ActiveRequiresBase",
    "Set Base Lighting to enable mapping selection and actions."
  ), gn.appendChild($e), a.length === 0) {
    const H = document.createElement("p");
    H.classList.add("notification", "warning", "eidolon-light-criteria__warning"), H.textContent = C(
      "EIDOLON.LightCriteria.NoCategoriesWarning",
      "This scene has no criteria configured. Add criteria under Scene -> Criteria to enable criteria-driven lighting."
    ), E.appendChild(H);
  } else if (l.length === 0) {
    const H = document.createElement("p");
    H.classList.add("notification", "warning", "eidolon-light-criteria__warning"), H.textContent = C(
      "EIDOLON.LightCriteria.NoValuesWarning",
      "Criteria exist, but none define selectable values. Add values in Scene -> Criteria."
    ), E.appendChild(H);
  }
  const oe = document.createElement("div");
  oe.classList.add("eidolon-light-criteria__creation"), oe.dataset.section = "creation", oe.hidden = !0;
  const Me = document.createElement("p");
  Me.classList.add("notes"), Me.textContent = C(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ), oe.appendChild(Me);
  const Xe = document.createElement("div");
  Xe.classList.add("eidolon-light-criteria__category-list"), oe.appendChild(Xe);
  for (const H of l) {
    const Y = document.createElement("label");
    Y.classList.add("eidolon-light-criteria__category");
    const te = document.createElement("span");
    te.classList.add("eidolon-light-criteria__category-name"), te.textContent = (ge = (yi = H.name) == null ? void 0 : yi.trim) != null && ge.call(yi) ? H.name.trim() : C("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), Y.appendChild(te);
    const ne = document.createElement("select");
    ne.dataset.categoryId = H.id, ne.classList.add("eidolon-light-criteria__category-select");
    const re = document.createElement("option");
    re.value = "", re.textContent = C(
      "EIDOLON.LightCriteria.IgnoreCategory",
      "Ignore"
    ), ne.appendChild(re);
    for (const pe of H.values) {
      const be = document.createElement("option");
      be.value = pe, be.textContent = pe, ne.appendChild(be);
    }
    Y.appendChild(ne), Xe.appendChild(Y);
  }
  const wt = document.createElement("div");
  wt.classList.add("eidolon-light-criteria__creation-actions");
  const Ue = document.createElement("button");
  Ue.type = "button", Ue.dataset.action = "save-mapping", Ue.classList.add("eidolon-light-criteria__button", "primary"), Ue.textContent = C(
    "EIDOLON.LightCriteria.SaveMapping",
    "Save Mapping"
  ), wt.appendChild(Ue);
  const Et = document.createElement("button");
  Et.type = "button", Et.dataset.action = "cancel-create", Et.classList.add("eidolon-light-criteria__button", "secondary"), Et.textContent = C(
    "EIDOLON.LightCriteria.Cancel",
    "Cancel"
  ), wt.appendChild(Et), oe.appendChild(wt), E.appendChild(oe), i.prepend(gn), E.hidden = !0, Zb(t, {
    fieldset: E,
    homeContainer: i
  }), requestAnimationFrame(() => {
    var H;
    (H = t.setPosition) == null || H.call(t, { height: "auto" });
  });
  let V = m;
  wi({ switcher: A, emptyState: $e, state: V }), vi(L, V), Wr(T, {
    state: V,
    hasCategories: l.length > 0
  }), D("LightCriteria | Controls injected", {
    sceneId: (s == null ? void 0 : s.id) ?? null,
    lightId: (r == null ? void 0 : r.id) ?? null,
    hasBase: !!(V != null && V.base),
    mappingCount: Array.isArray(V == null ? void 0 : V.mappings) ? V.mappings.length : 0,
    categories: l.length
  });
  const es = mv(V), ee = {
    restoreConfig: null,
    app: t,
    selectedMapping: es,
    editorMode: "create",
    editingMappingId: null,
    mappingFilters: {}
  };
  Ts.set(E, ee);
  const Nt = /* @__PURE__ */ c(() => {
    G.open = !1;
  }, "closeActionsMenu");
  me.addEventListener("click", (H) => {
    G.classList.contains("is-disabled") && (H.preventDefault(), Nt());
  });
  const Ve = /* @__PURE__ */ c((H = ee.selectedMapping) => {
    const Y = cv(j), te = Array.isArray(V == null ? void 0 : V.mappings) ? V.mappings : [], ne = dv(te, Y), re = Object.keys(Y).length;
    ee.mappingFilters = Y, B.disabled = re === 0, fv(R, {
      totalCount: te.length,
      visibleCount: ne.length,
      hasFilters: re > 0,
      activeFilterCount: re
    }), N.classList.toggle("has-active-filters", re > 0), hv(Z, V, u, H, {
      mappings: ne,
      categoryOrder: d
    }), ee.selectedMapping = Z.value ?? "", Al({
      mappingSelect: Z,
      applyMappingButton: U,
      updateMappingButton: ce,
      editCriteriaButton: Se,
      removeMappingButton: He,
      actionsMenu: G,
      state: V
    }), G.classList.contains("is-disabled") && Nt();
  }, "refreshMappingSelector");
  j.querySelectorAll("select[data-filter-category-id]").forEach((H) => {
    H.addEventListener("change", () => {
      const Y = ee.selectedMapping;
      Ve(Y), ee.selectedMapping !== Y && Ml(
        o ?? r,
        V,
        ee.selectedMapping
      ).then((te) => {
        te && (V = te);
      });
    });
  }), B.addEventListener("click", () => {
    uv(j);
    const H = ee.selectedMapping;
    Ve(H), N.open = !1, ee.selectedMapping !== H && Ml(
      o ?? r,
      V,
      ee.selectedMapping
    ).then((Y) => {
      Y && (V = Y);
    });
  }), Z.addEventListener("change", () => {
    ee.selectedMapping = Z.value ?? "", Al({
      mappingSelect: Z,
      applyMappingButton: U,
      updateMappingButton: ce,
      editCriteriaButton: Se,
      removeMappingButton: He,
      actionsMenu: G,
      state: V
    }), Ml(
      o ?? r,
      V,
      ee.selectedMapping
    ).then((H) => {
      H && (V = H);
    });
  });
  const qr = /* @__PURE__ */ c(async () => {
    var ne, re, pe, be, St, _n, Ct, Nn, Te, $n, Fn, tn, bi, Ur;
    const H = Z.value ?? "";
    if (!H) {
      (re = (ne = ui.notifications) == null ? void 0 : ne.warn) == null || re.call(
        ne,
        C(
          "EIDOLON.LightCriteria.SelectMappingWarning",
          "Choose a criteria mapping before applying."
        )
      ), Ve(ee.selectedMapping);
      return;
    }
    if (H === Le) {
      if (!(V != null && V.base)) {
        (be = (pe = ui.notifications) == null ? void 0 : pe.warn) == null || be.call(
          pe,
          C(
            "EIDOLON.LightCriteria.BaseUnavailable",
            "Set a base lighting state before applying it."
          )
        );
        return;
      }
      cs(E, oe, T), Is(t, n, V.base), V = await oo(o ?? r, {
        mappingId: Le,
        categories: null,
        updatedAt: Date.now()
      }), ee.selectedMapping = Le, Ve(ee.selectedMapping), vi(L, V), wi({ switcher: A, emptyState: $e, state: V }), Wr(T, {
        state: V,
        hasCategories: l.length > 0
      }), Kd(n, {
        mappingId: Le,
        color: ((_n = (St = V.base) == null ? void 0 : St.config) == null ? void 0 : _n.color) ?? null
      }), (Nn = (Ct = ui.notifications) == null ? void 0 : Ct.info) == null || Nn.call(
        Ct,
        C(
          "EIDOLON.LightCriteria.BaseApplied",
          "Applied the base lighting state to the form."
        )
      ), Nt();
      return;
    }
    const Y = Array.isArray(V == null ? void 0 : V.mappings) && V.mappings.length ? V.mappings.find((er) => (er == null ? void 0 : er.id) === H) : null;
    if (!Y) {
      ($n = (Te = ui.notifications) == null ? void 0 : Te.warn) == null || $n.call(
        Te,
        C(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      ), ee.selectedMapping = "", Ve(ee.selectedMapping);
      return;
    }
    cs(E, oe, T), Is(t, n, Y.config), V = await oo(o ?? r, {
      mappingId: Y.id,
      categories: Y.categories,
      updatedAt: Date.now()
    }), ee.selectedMapping = Y.id, Ve(ee.selectedMapping), vi(L, V), wi({ switcher: A, emptyState: $e, state: V }), Wr(T, {
      state: V,
      hasCategories: l.length > 0
    }), Kd(n, {
      mappingId: Y.id,
      color: ((tn = (Fn = Y.config) == null ? void 0 : Fn.config) == null ? void 0 : tn.color) ?? null
    });
    const te = br(Y, u, d);
    (Ur = (bi = ui.notifications) == null ? void 0 : bi.info) == null || Ur.call(
      bi,
      C(
        "EIDOLON.LightCriteria.MappingApplied",
        "Applied mapping: {label}"
      ).replace("{label}", te)
    ), Nt();
  }, "applySelectedMapping");
  U.addEventListener("click", () => {
    qr();
  }), Z.addEventListener("keydown", (H) => {
    H.key === "Enter" && (H.preventDefault(), qr());
  });
  const ts = /* @__PURE__ */ c(async () => {
    var Y, te, ne, re, pe, be, St, _n, Ct, Nn, Te, $n, Fn, tn, bi, Ur, er, ns, vd, is, wd;
    const H = ee.selectedMapping;
    if (!H) {
      (te = (Y = ui.notifications) == null ? void 0 : Y.warn) == null || te.call(
        Y,
        C(
          "EIDOLON.LightCriteria.SelectMappingWarning",
          "Choose a criteria mapping before applying."
        )
      );
      return;
    }
    ce.disabled = !0;
    try {
      const lt = Ls(t, o);
      if (H === Le)
        V = await Hd(o ?? r, lt), D("LightCriteria | Base lighting updated", {
          lightId: ((ne = o ?? r) == null ? void 0 : ne.id) ?? null,
          configColor: ((re = lt == null ? void 0 : lt.config) == null ? void 0 : re.color) ?? null
        }), (be = (pe = ui.notifications) == null ? void 0 : pe.info) == null || be.call(
          pe,
          C(
            "EIDOLON.LightCriteria.BaseUpdated",
            "Updated the base lighting state with the current configuration."
          )
        ), ee.selectedMapping = Le;
      else {
        const tr = so(V, H);
        if (!tr) {
          (_n = (St = ui.notifications) == null ? void 0 : St.warn) == null || _n.call(
            St,
            C(
              "EIDOLON.LightCriteria.MappingUnavailable",
              "The selected criteria mapping is no longer available."
            )
          ), ee.selectedMapping = "", Ve(ee.selectedMapping);
          return;
        }
        V = await qd(
          o ?? r,
          tr.categories,
          lt,
          { label: tr.label ?? null }
        ), D("LightCriteria | Mapping updated", {
          mappingId: H,
          hasColor: !!((Ct = lt == null ? void 0 : lt.config) != null && Ct.color),
          stored: Array.isArray(V == null ? void 0 : V.mappings) ? ((Nn = V.mappings.find((pl) => (pl == null ? void 0 : pl.id) === H)) == null ? void 0 : Nn.config) ?? null : null,
          persisted: ($n = (Te = o ?? r) == null ? void 0 : Te.getFlag) == null ? void 0 : $n.call(Te, io, ro)
        });
        const Vr = so(V, H), ap = br(Vr || tr, u, d);
        D("LightCriteria | Mapping updated", {
          mappingId: H,
          categories: tr.categories,
          updatedColor: ((Fn = lt == null ? void 0 : lt.config) == null ? void 0 : Fn.color) ?? null,
          storedColor: ((bi = (tn = Vr == null ? void 0 : Vr.config) == null ? void 0 : tn.config) == null ? void 0 : bi.color) ?? ((er = (Ur = tr.config) == null ? void 0 : Ur.config) == null ? void 0 : er.color) ?? null
        }), (vd = (ns = ui.notifications) == null ? void 0 : ns.info) == null || vd.call(
          ns,
          C(
            "EIDOLON.LightCriteria.MappingUpdated",
            "Saved changes to mapping: {label}"
          ).replace("{label}", ap)
        ), ee.selectedMapping = H;
      }
      vi(L, V), wi({ switcher: A, emptyState: $e, state: V }), Wr(T, {
        state: V,
        hasCategories: l.length > 0
      }), Ve(ee.selectedMapping), Nt();
    } catch (lt) {
      console.error("eidolon-utilities | Failed to update light criteria mapping", lt), (wd = (is = ui.notifications) == null ? void 0 : is.error) == null || wd.call(
        is,
        C(
          "EIDOLON.LightCriteria.MappingUpdateError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      ce.disabled = !1, Al({
        mappingSelect: Z,
        applyMappingButton: U,
        updateMappingButton: ce,
        editCriteriaButton: Se,
        removeMappingButton: He,
        actionsMenu: G,
        state: V
      });
    }
  }, "updateSelectedMapping");
  ce.addEventListener("click", () => {
    ts();
  }), Ve(ee.selectedMapping), S.addEventListener("click", async () => {
    var H, Y, te, ne, re, pe;
    S.disabled = !0;
    try {
      const be = Ls(t, o);
      V = await Hd(o ?? r, be), D("LightCriteria | Base lighting stored", {
        lightId: ((H = o ?? r) == null ? void 0 : H.id) ?? null,
        configColor: ((Y = be == null ? void 0 : be.config) == null ? void 0 : Y.color) ?? null
      }), (ne = (te = ui.notifications) == null ? void 0 : te.info) == null || ne.call(
        te,
        C(
          "EIDOLON.LightCriteria.BaseStored",
          "Saved the current configuration as the base lighting state."
        )
      ), vi(L, V), wi({ switcher: A, emptyState: $e, state: V }), Wr(T, {
        state: V,
        hasCategories: l.length > 0
      }), ee.selectedMapping = Le, Ve(ee.selectedMapping);
    } catch (be) {
      console.error("eidolon-utilities | Failed to store base light criteria state", be), (pe = (re = ui.notifications) == null ? void 0 : re.error) == null || pe.call(
        re,
        C(
          "EIDOLON.LightCriteria.BaseError",
          "Failed to save the base lighting state. Check the console for details."
        )
      );
    } finally {
      S.disabled = !1;
    }
  }), T.addEventListener("click", () => {
    var Y, te, ne, re;
    if (!(V != null && V.base)) {
      (te = (Y = ui.notifications) == null ? void 0 : Y.warn) == null || te.call(
        Y,
        C(
          "EIDOLON.LightCriteria.RequiresBase",
          "Set a base lighting state before adding criteria mappings."
        )
      );
      return;
    }
    if (l.length === 0) {
      (re = (ne = ui.notifications) == null ? void 0 : ne.warn) == null || re.call(
        ne,
        C(
          "EIDOLON.LightCriteria.NoCategoriesAvailable",
          "Add scene criteria with values in the Scene configuration before creating mappings."
        )
      );
      return;
    }
    const H = Ts.get(E);
    Yd({
      app: t,
      fieldset: E,
      createButton: T,
      creationSection: oe,
      categoryList: Xe,
      form: n,
      persistedLight: o,
      stateEntry: H,
      mode: "create",
      mapping: null,
      preloadConfig: V.base
    });
  }), Se.addEventListener("click", () => {
    var te, ne, re, pe;
    const H = ee.selectedMapping;
    if (!H || H === Le) {
      (ne = (te = ui.notifications) == null ? void 0 : te.warn) == null || ne.call(
        te,
        C(
          "EIDOLON.LightCriteria.SelectMappingForCriteriaEdit",
          "Select a mapping before editing criteria."
        )
      );
      return;
    }
    const Y = so(V, H);
    if (!Y) {
      (pe = (re = ui.notifications) == null ? void 0 : re.warn) == null || pe.call(
        re,
        C(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      );
      return;
    }
    Nt(), pm(t, { fieldset: E, homeContainer: i }), Yd({
      app: t,
      fieldset: E,
      createButton: T,
      creationSection: oe,
      categoryList: Xe,
      form: n,
      persistedLight: o,
      stateEntry: ee,
      mode: "retarget",
      mapping: Y,
      preloadConfig: Y.config
    });
  }), Ue.addEventListener("click", async () => {
    var Y, te, ne, re, pe, be, St, _n, Ct, Nn;
    const H = yv(Xe);
    if (!H) {
      (te = (Y = ui.notifications) == null ? void 0 : Y.warn) == null || te.call(
        Y,
        C(
          "EIDOLON.LightCriteria.SelectionRequired",
          "Select at least one criteria value to identify the mapping."
        )
      );
      return;
    }
    Ue.disabled = !0;
    try {
      const Te = Ls(t, o);
      if (ee.editorMode === "retarget" && ee.editingMappingId) {
        const Fn = jc(V, H);
        let tn = !1;
        if (Fn && Fn !== ee.editingMappingId && (tn = await Jb(), !tn)) {
          Ue.disabled = !1;
          return;
        }
        V = await Iy(
          o ?? r,
          ee.editingMappingId,
          H,
          Te,
          { replaceExisting: tn }
        ), D("LightCriteria | Mapping criteria retargeted", {
          mappingId: ee.editingMappingId,
          categories: H,
          replaced: tn,
          configColor: ((ne = Te == null ? void 0 : Te.config) == null ? void 0 : ne.color) ?? null
        }), (pe = (re = ui.notifications) == null ? void 0 : re.info) == null || pe.call(
          re,
          C(
            "EIDOLON.LightCriteria.MappingCriteriaUpdated",
            "Updated mapping criteria for the selected mapping."
          )
        );
      } else
        V = await qd(
          o ?? r,
          H,
          Te,
          {}
        ), D("LightCriteria | Mapping saved from editor", {
          categories: H,
          configColor: ((be = Te == null ? void 0 : Te.config) == null ? void 0 : be.color) ?? null
        }), (_n = (St = ui.notifications) == null ? void 0 : St.info) == null || _n.call(
          St,
          C(
            "EIDOLON.LightCriteria.MappingSaved",
            "Updated lighting mapping for the selected scene criteria."
          )
        );
      vi(L, V), wi({ switcher: A, emptyState: $e, state: V });
      const $n = jc(V, H);
      $n && (ee.selectedMapping = $n), Ve(ee.selectedMapping), cs(E, oe, T), Nt();
    } catch (Te) {
      console.error("eidolon-utilities | Failed to persist light criteria mapping", Te), (Nn = (Ct = ui.notifications) == null ? void 0 : Ct.error) == null || Nn.call(
        Ct,
        C(
          "EIDOLON.LightCriteria.MappingError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      Ue.disabled = !1;
    }
  }), Et.addEventListener("click", () => {
    const H = Ts.get(E);
    H != null && H.restoreConfig && Is(t, n, H.restoreConfig), cs(E, oe, T);
  }), He.addEventListener("click", async () => {
    var te, ne;
    const H = ee.selectedMapping;
    !H || H === Le || !await Qb() || (V = await ky(o ?? r, H), ee.selectedMapping = "", vi(L, V), wi({ switcher: A, emptyState: $e, state: V }), Ve(ee.selectedMapping), Nt(), (ne = (te = ui.notifications) == null ? void 0 : te.info) == null || ne.call(
      te,
      C("EIDOLON.LightCriteria.MappingRemoved", "Removed selected mapping.")
    ));
  });
}
c(Xb, "enhanceAmbientLightConfig");
function Yd({
  app: t,
  fieldset: e,
  createButton: n,
  creationSection: i,
  categoryList: r,
  form: o,
  persistedLight: s,
  stateEntry: a,
  mode: l,
  mapping: u,
  preloadConfig: d
}) {
  a && (a.restoreConfig = Ls(t, s), a.editorMode = l, a.editingMappingId = l === "retarget" ? (u == null ? void 0 : u.id) ?? null : null), d && Is(t, o, d), l === "retarget" && (u != null && u.categories) ? pv(r, u.categories) : gv(r);
  const f = i.querySelector("p.notes");
  f instanceof HTMLElement && (f.textContent = l === "retarget" ? C(
    "EIDOLON.LightCriteria.EditCriteriaDescription",
    "Adjust criteria values for the selected mapping."
  ) : C(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const h = i.querySelector('button[data-action="save-mapping"]');
  h instanceof HTMLButtonElement && (h.textContent = l === "retarget" ? C("EIDOLON.LightCriteria.SaveCriteriaChanges", "Save Criteria Changes") : C("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), i.hidden = !1, n.setAttribute("aria-expanded", "true"), Wu(e, i), requestAnimationFrame(() => {
    var m;
    (m = t.setPosition) == null || m.call(t, { height: "auto" });
  });
}
c(Yd, "openMappingEditor");
async function Jb() {
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
c(Jb, "confirmCriteriaConflict");
async function Qb() {
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
c(Qb, "confirmRemoveMapping");
function Zb(t, { fieldset: e, homeContainer: n }) {
  const i = nv(t, n);
  if (!(i instanceof HTMLElement)) return;
  const r = i.querySelector(".window-header");
  if (!(r instanceof HTMLElement)) return;
  let o = r.querySelector('[data-eidolon-action="open-light-criteria-manager"]');
  if (!(o instanceof HTMLButtonElement)) {
    o = document.createElement("button"), o.type = "button", o.classList.add("header-control", "icon"), o.dataset.eidolonAction = "open-light-criteria-manager", o.dataset.tooltip = C("EIDOLON.LightCriteria.OpenManager", "Open Scene Criteria Lighting"), o.setAttribute("aria-label", C("EIDOLON.LightCriteria.OpenManager", "Open Scene Criteria Lighting")), o.innerHTML = '<i class="fa-solid fa-sliders" inert=""></i>';
    const s = r.querySelector(".window-controls") ?? r, a = s.querySelector('[data-action="toggleControls"]');
    if ((a == null ? void 0 : a.parentElement) === s)
      s.insertBefore(o, a);
    else {
      const l = s.querySelector('[data-action="close"]');
      (l == null ? void 0 : l.parentElement) === s ? s.insertBefore(o, l) : s.appendChild(o);
    }
  }
  o.onclick = (s) => {
    s.preventDefault(), pm(t, { fieldset: e, homeContainer: n });
  };
}
c(Zb, "ensureManagerHeaderButton");
function pm(t, { fieldset: e, homeContainer: n }) {
  var h, m, p;
  const i = ls.get(t);
  if (i != null && i.rendered) {
    (h = i.bringToTop) == null || h.call(i);
    return;
  }
  const r = /* @__PURE__ */ c((...y) => {
    var b;
    const E = ev(y), v = (b = E == null ? void 0 : E.querySelector) == null ? void 0 : b.call(E, ".eidolon-light-criteria-manager-host");
    v instanceof HTMLElement && (tv(e), e.hidden = !1, v.appendChild(e));
  }, "onRender"), o = /* @__PURE__ */ c(() => {
    e.remove(), e.hidden = !0, ls.delete(t), requestAnimationFrame(() => {
      var y;
      (y = t.setPosition) == null || y.call(t, { height: "auto" });
    });
  }, "onClose"), s = C("EIDOLON.LightCriteria.ManagerTitle", "Scene Criteria Lighting"), a = '<div class="eidolon-light-criteria-manager-host"></div>', l = C("EIDOLON.LightCriteria.Close", "Close"), u = (p = (m = foundry == null ? void 0 : foundry.applications) == null ? void 0 : m.api) == null ? void 0 : p.DialogV2;
  if (typeof (u == null ? void 0 : u.wait) == "function")
    try {
      let y = !1;
      const E = /* @__PURE__ */ c(() => {
        y || (y = !0, o());
      }, "closeOnce");
      ls.set(t, {
        rendered: !0,
        bringToTop: /* @__PURE__ */ c(() => {
        }, "bringToTop")
      }), u.wait({
        window: { title: s },
        content: a,
        buttons: [{ action: "close", label: l, default: !0 }],
        render: /* @__PURE__ */ c((...v) => r(...v), "render"),
        close: E,
        rejectClose: !1
      }).catch((v) => {
        console.warn("eidolon-utilities | DialogV2 manager failed, falling back to Dialog", v), E();
      });
      return;
    } catch (y) {
      console.warn("eidolon-utilities | DialogV2 manager failed, falling back to Dialog", y), o();
    }
  const d = globalThis.Dialog;
  if (typeof d != "function") return;
  const f = new d(
    {
      title: s,
      content: a,
      buttons: {
        close: {
          label: l
        }
      },
      render: /* @__PURE__ */ c((...y) => r(...y), "render"),
      close: o
    },
    {
      width: 640,
      resizable: !0
    }
  );
  ls.set(t, f), f.render(!0);
}
c(pm, "openManagerDialog");
function ev(t) {
  for (const e of t) {
    const n = Ye(e);
    if (n) return n;
    const i = Ye(e == null ? void 0 : e.element);
    if (i) return i;
  }
  return null;
}
c(ev, "findDialogRoot");
function tv(t) {
  if (!(t instanceof HTMLElement) || t.dataset.managerLayout === "true") return;
  t.dataset.managerLayout = "true", t.classList.add("is-manager");
  const e = t.querySelector("legend"), n = t.querySelector("p.notes:not(.eidolon-light-criteria__status)"), i = t.querySelector(".eidolon-light-criteria__controls"), r = t.querySelector(".eidolon-light-criteria__status"), o = t.querySelector(".eidolon-light-criteria__creation"), s = Array.from(t.querySelectorAll(".eidolon-light-criteria__warning")), a = document.createElement("div");
  a.classList.add("eidolon-light-criteria-manager");
  const l = document.createElement("section");
  l.classList.add("eidolon-light-criteria-manager__section", "is-top"), a.appendChild(l);
  const u = document.createElement("section");
  u.classList.add("eidolon-light-criteria-manager__section", "is-bottom"), a.appendChild(u);
  const d = document.createElement("div");
  if (d.classList.add("eidolon-light-criteria-manager__header"), d.textContent = C("EIDOLON.LightCriteria.ManagerHeader", "Base State"), l.appendChild(d), r && l.appendChild(r), i && l.appendChild(i), s.length) {
    const h = document.createElement("div");
    h.classList.add("eidolon-light-criteria-manager__warnings");
    for (const m of s) h.appendChild(m);
    l.appendChild(h);
  }
  const f = document.createElement("div");
  f.classList.add("eidolon-light-criteria-manager__header"), f.textContent = C("EIDOLON.LightCriteria.ManagerAuthoring", "Create or Update Mapping"), u.appendChild(f), o && u.appendChild(o), t.innerHTML = "", e && t.appendChild(e), n && t.appendChild(n), t.appendChild(a), Wu(t, o);
}
c(tv, "applyManagerLayout");
function nv(t, e) {
  var i;
  const n = Ye(t == null ? void 0 : t.element);
  return n || (((i = e == null ? void 0 : e.closest) == null ? void 0 : i.call(e, ".application")) ?? null);
}
c(nv, "resolveApplicationRoot");
function cs(t, e, n) {
  const i = Ts.get(t);
  i && (i.restoreConfig = null, i.editorMode = "create", i.editingMappingId = null), e.hidden = !0, n.setAttribute("aria-expanded", "false");
  const r = e.querySelector("p.notes");
  r instanceof HTMLElement && (r.textContent = C(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const o = e.querySelector('button[data-action="save-mapping"]');
  o instanceof HTMLButtonElement && (o.textContent = C("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), Wu(t, e), requestAnimationFrame(() => {
    var s, a;
    (a = (s = i == null ? void 0 : i.app) == null ? void 0 : s.setPosition) == null || a.call(s, { height: "auto" });
  });
}
c(cs, "hideCreationSection");
function vi(t, e) {
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
c(vi, "updateStatusLine");
function Wr(t, { state: e, hasCategories: n }) {
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
c(Wr, "updateCreateButtonState");
function Ls(t, e) {
  var l, u, d;
  const n = e ?? ym(t);
  if (!n)
    throw new Error("Ambient light document unavailable.");
  const i = Ki(((l = n.toObject) == null ? void 0 : l.call(n)) ?? {});
  if (!i)
    throw new Error("Unable to duplicate ambient light data.");
  const r = (t == null ? void 0 : t.form) instanceof HTMLFormElement ? t.form : null, o = r ? Fp(r) : {}, s = foundry.utils.mergeObject(i, o, {
    inplace: !1,
    performDeletions: !0
  });
  r && (r.querySelectorAll("color-picker[name]").forEach((f) => {
    var v, b;
    const h = f.getAttribute("name");
    if (!h) return;
    const m = typeof f.value == "string" ? f.value : "", p = ((v = f.ui) == null ? void 0 : v.input) ?? ((b = f.querySelector) == null ? void 0 : b.call(f, 'input[type="color"]')), y = (p == null ? void 0 : p.value) ?? "", E = m || y;
    typeof E != "string" || !E || (foundry.utils.setProperty(s, h, E), D("LightCriteria | Captured color-picker value", {
      path: h,
      pickerValue: m,
      swatchValue: y,
      chosenValue: E
    }));
  }), r.querySelectorAll("range-picker[name]").forEach((f) => {
    var T, L;
    const h = f.getAttribute("name");
    if (!h) return;
    const m = f.value !== void 0 && f.value !== null ? String(f.value) : "", p = (T = f.querySelector) == null ? void 0 : T.call(f, 'input[type="range"]'), y = (L = f.querySelector) == null ? void 0 : L.call(f, 'input[type="number"]'), E = p instanceof HTMLInputElement ? p.value : "", v = y instanceof HTMLInputElement ? y.value : "", b = m || v || E;
    if (typeof b != "string" || !b.length) return;
    const w = Number(b), S = Number.isFinite(w) ? w : b;
    foundry.utils.setProperty(s, h, S), D("LightCriteria | Captured range-picker value", {
      path: h,
      elementValue: m,
      numberValue: v,
      rangeValue: E,
      chosenValue: S
    });
  }));
  const a = Ki(s);
  return D("LightCriteria | Captured form config", {
    lightId: (n == null ? void 0 : n.id) ?? null,
    hasColor: !!((u = a == null ? void 0 : a.config) != null && u.color),
    color: ((d = a == null ? void 0 : a.config) == null ? void 0 : d.color) ?? null
  }), a;
}
c(Ls, "captureAmbientLightFormConfig");
function Is(t, e, n) {
  if (!n || typeof n != "object") return;
  const i = foundry.utils.flattenObject(n, { safe: !0 });
  for (const [r, o] of Object.entries(i)) {
    const s = e.querySelectorAll(`[name="${r}"]`);
    if (s.length) {
      D("LightCriteria | Applying field", {
        path: r,
        value: o,
        elementCount: s.length
      });
      for (const a of s)
        a instanceof HTMLElement && a.tagName === "COLOR-PICKER" ? rv(a, o) : a instanceof HTMLElement && a.tagName === "RANGE-PICKER" ? ov(a, o) : a instanceof HTMLInputElement ? iv(a, o) : a instanceof HTMLSelectElement ? sv(a, o) : a instanceof HTMLTextAreaElement && av(a, o);
    }
  }
  requestAnimationFrame(() => {
    var r;
    return (r = t._previewChanges) == null ? void 0 : r.call(t);
  });
}
c(Is, "applyConfigToForm");
function iv(t, e, n) {
  const i = t.type;
  if (i === "checkbox") {
    const s = !!e;
    t.checked !== s && (t.checked = s, Jt(t));
    return;
  }
  if (i === "radio") {
    const s = e == null ? "" : String(e), a = t.value === s;
    t.checked !== a && (t.checked = a, a && Jt(t));
    return;
  }
  const r = e == null ? "" : String(e);
  let o = !1;
  t.value !== r && (t.value = r, o = !0), o && Jt(t);
}
c(iv, "applyValueToInput");
function rv(t, e, n) {
  var a, l, u, d, f, h;
  const i = e == null ? "" : String(e);
  let r = !1;
  t.value !== i && (t.value = i, t.setAttribute("value", i), (a = t.ui) != null && a.setValue && t.ui.setValue(i), r = !0);
  const o = ((l = t.ui) == null ? void 0 : l.input) ?? ((u = t.querySelector) == null ? void 0 : u.call(t, 'input[type="color"]'));
  o instanceof HTMLInputElement && o.value !== i && (o.value = i, Jt(o));
  const s = ((d = t.ui) == null ? void 0 : d.text) ?? ((f = t.querySelector) == null ? void 0 : f.call(t, 'input[type="text"]'));
  s instanceof HTMLInputElement && s.value !== i && (s.value = i, Jt(s)), (h = t.ui) != null && h.commit ? t.ui.commit() : (t.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), t.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }))), D("LightCriteria | Color picker applied", {
    value: i,
    pickerValue: t.value ?? null,
    swatchValue: (o == null ? void 0 : o.value) ?? null,
    textValue: (s == null ? void 0 : s.value) ?? null
  }), r && Jt(t);
}
c(rv, "applyValueToColorPicker");
function ov(t, e, n) {
  var u, d;
  const i = e == null ? "" : String(e), r = Number(i), o = Number.isFinite(r) ? r : i;
  let s = !1;
  t.value !== void 0 && t.value !== o && (t.value = o, s = !0), t.getAttribute("value") !== i && (t.setAttribute("value", i), s = !0);
  const a = (u = t.querySelector) == null ? void 0 : u.call(t, 'input[type="range"]');
  a instanceof HTMLInputElement && a.value !== i && (a.value = i, Jt(a));
  const l = (d = t.querySelector) == null ? void 0 : d.call(t, 'input[type="number"]');
  if (l instanceof HTMLInputElement && l.value !== i && (l.value = i, Jt(l)), typeof t.commit == "function")
    try {
      t.commit();
    } catch (f) {
      console.error("eidolon-utilities | range-picker commit failed", f);
    }
  D("LightCriteria | Range picker applied", {
    value: i,
    resolvedValue: o,
    rangeValue: (a == null ? void 0 : a.value) ?? null,
    numberValue: (l == null ? void 0 : l.value) ?? null
  }), s && Jt(t);
}
c(ov, "applyValueToRangePicker");
function sv(t, e, n) {
  const i = e == null ? "" : String(e);
  t.value !== i && (t.value = i, Jt(t));
}
c(sv, "applyValueToSelect");
function av(t, e, n) {
  const i = e == null ? "" : String(e);
  t.value !== i && (t.value = i, Jt(t));
}
c(av, "applyValueToTextarea");
function Jt(t) {
  t.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), t.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }));
}
c(Jt, "triggerInputChange");
function Al({
  mappingSelect: t,
  applyMappingButton: e,
  updateMappingButton: n,
  editCriteriaButton: i,
  removeMappingButton: r,
  actionsMenu: o,
  state: s
}) {
  const a = (t == null ? void 0 : t.value) ?? "", l = !!(s != null && s.base), u = a && a !== Le ? !!so(s, a) : !1;
  if (e instanceof HTMLButtonElement && (a ? a === Le ? e.disabled = !l : e.disabled = !u : e.disabled = !0), n instanceof HTMLButtonElement && (a ? a === Le ? n.disabled = !1 : n.disabled = !u : n.disabled = !0), i instanceof HTMLButtonElement && (i.disabled = !a || a === Le || !u), r instanceof HTMLButtonElement && (r.disabled = !a || a === Le || !u), o instanceof HTMLElement) {
    const d = n instanceof HTMLButtonElement && !n.disabled || i instanceof HTMLButtonElement && !i.disabled || r instanceof HTMLButtonElement && !r.disabled;
    o.classList.toggle("is-disabled", !d), !d && "open" in o && (o.open = !1);
  }
}
c(Al, "syncMappingSwitcherState");
function lv(t) {
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
c(lv, "buildCategoryNameLookup");
function cv(t) {
  const e = {};
  return t instanceof HTMLElement && t.querySelectorAll("select[data-filter-category-id]").forEach((n) => {
    var o, s;
    const i = n.dataset.filterCategoryId, r = (s = (o = n.value) == null ? void 0 : o.trim) == null ? void 0 : s.call(o);
    !i || !r || (e[i] = r);
  }), e;
}
c(cv, "readMappingFilterSelections");
function uv(t) {
  t instanceof HTMLElement && t.querySelectorAll("select[data-filter-category-id]").forEach((e) => {
    e.value = "";
  });
}
c(uv, "resetMappingFilterSelections");
function dv(t, e) {
  const n = Array.isArray(t) ? t : [], i = Object.entries(e ?? {}).filter(([, r]) => !!r);
  return i.length ? n.filter((r) => {
    if (!r || typeof r != "object") return !1;
    const o = r.categories ?? {};
    for (const [s, a] of i)
      if ((o == null ? void 0 : o[s]) !== a) return !1;
    return !0;
  }) : n.slice();
}
c(dv, "filterMappingsByCriteria");
function fv(t, { totalCount: e = 0, visibleCount: n = 0, hasFilters: i = !1, activeFilterCount: r = 0 } = {}) {
  if (!(t instanceof HTMLElement)) return;
  if (!i) {
    t.textContent = C(
      "EIDOLON.LightCriteria.FilterSummaryAll",
      "All ({count})"
    ).replace("{count}", String(e));
    return;
  }
  const o = C(
    "EIDOLON.LightCriteria.FilterSummaryActive",
    "{active} filters · {visible}/{total}"
  ).replace("{active}", String(r)).replace("{visible}", String(n)).replace("{total}", String(e));
  t.textContent = o;
}
c(fv, "updateMappingFilterMeta");
function hv(t, e, n, i, r = {}) {
  if (!(t instanceof HTMLSelectElement)) return;
  const o = typeof i == "string" ? i : "", s = !!(e != null && e.base), a = Array.isArray(r == null ? void 0 : r.categoryOrder) ? r.categoryOrder : [], l = Array.isArray(r == null ? void 0 : r.mappings) ? r.mappings.slice() : Array.isArray(e == null ? void 0 : e.mappings) ? e.mappings.slice() : [], u = t.value;
  t.innerHTML = "";
  const d = document.createElement("option");
  d.value = "", d.textContent = C(
    "EIDOLON.LightCriteria.SelectPlaceholder",
    "Select a mapping"
  ), d.disabled = s, t.appendChild(d);
  const f = document.createElement("option");
  f.value = Le, f.textContent = C(
    "EIDOLON.LightCriteria.BaseOption",
    "Base Lighting"
  ), f.disabled = !s, t.appendChild(f), l.slice().sort((y, E) => {
    var w;
    const v = br(y, n, a), b = br(E, n, a);
    return v.localeCompare(b, ((w = game.i18n) == null ? void 0 : w.lang) ?? void 0, {
      sensitivity: "base"
    });
  }).forEach((y) => {
    if (!(y != null && y.id)) return;
    const E = document.createElement("option");
    E.value = y.id, E.textContent = br(y, n, a), t.appendChild(E);
  });
  const h = new Set(
    Array.from(t.options).filter((y) => !y.disabled).map((y) => y.value)
  ), m = s && u === "" ? "" : u, p = o || (h.has(m) ? m : "");
  p && h.has(p) ? t.value = p : s ? t.value = Le : t.value = "";
}
c(hv, "populateMappingSelector");
function br(t, e, n = []) {
  if (!t || typeof t != "object")
    return C("EIDOLON.LightCriteria.UnnamedMapping", "Unnamed Mapping");
  if (typeof t.label == "string" && t.label.trim())
    return t.label.trim();
  const i = t.categories ?? {}, r = [], o = /* @__PURE__ */ new Set();
  for (const a of n)
    !a || o.has(a) || (r.push(a), o.add(a));
  for (const a of Object.keys(i).sort((l, u) => l.localeCompare(u)))
    o.has(a) || (r.push(a), o.add(a));
  const s = r.map((a) => {
    const l = i == null ? void 0 : i[a];
    if (typeof l != "string" || !l.trim()) return null;
    const u = l.trim();
    return `${e.get(a) ?? C("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category")}=${u}`;
  }).filter(Boolean);
  return s.length === 0 ? C("EIDOLON.LightCriteria.UnnamedMapping", "Unnamed Mapping") : s.join(" | ");
}
c(br, "formatMappingOptionLabel");
function jc(t, e) {
  if (!t || typeof t != "object" || !Array.isArray(t.mappings)) return null;
  const n = Rr(e);
  if (!n) return null;
  const i = t.mappings.find((r) => (r == null ? void 0 : r.key) === n);
  return (i == null ? void 0 : i.id) ?? null;
}
c(jc, "findMappingIdByCategories");
function so(t, e) {
  return !e || !t || typeof t != "object" || !Array.isArray(t.mappings) ? null : t.mappings.find((n) => (n == null ? void 0 : n.id) === e) ?? null;
}
c(so, "getMappingById");
function mv(t) {
  if (!t || typeof t != "object") return "";
  const e = t.current;
  if (e != null && e.mappingId) {
    if (e.mappingId === Le)
      return t != null && t.base ? Le : "";
    if (Array.isArray(t.mappings) && t.mappings.some((n) => n.id === e.mappingId))
      return e.mappingId;
  }
  if (e != null && e.categories) {
    const n = jc(t, e.categories);
    if (n) return n;
  }
  return "";
}
c(mv, "resolveInitialMappingSelection");
function Kd(t, e = {}) {
  var s, a, l, u;
  if (!(t instanceof HTMLFormElement)) return;
  const n = t.querySelector('color-picker[name="config.color"]'), i = (n == null ? void 0 : n.value) ?? null, r = ((s = n == null ? void 0 : n.ui) == null ? void 0 : s.text) ?? ((a = n == null ? void 0 : n.querySelector) == null ? void 0 : a.call(n, 'input[type="text"]')), o = ((l = n == null ? void 0 : n.ui) == null ? void 0 : l.input) ?? ((u = n == null ? void 0 : n.querySelector) == null ? void 0 : u.call(n, 'input[type="color"]'));
  D("LightCriteria | Color state after apply", {
    ...e,
    textValue: (r == null ? void 0 : r.value) ?? null,
    pickerValue: i,
    swatchValue: (o == null ? void 0 : o.value) ?? null
  });
}
c(Kd, "logAppliedColorState");
function gv(t) {
  t.querySelectorAll("select[data-category-id]").forEach((e) => {
    e.value = "";
  });
}
c(gv, "resetCategorySelections");
function pv(t, e) {
  const n = e && typeof e == "object" ? e : {};
  t.querySelectorAll("select[data-category-id]").forEach((i) => {
    const r = i.dataset.categoryId;
    if (!r) return;
    const o = n[r];
    i.value = typeof o == "string" ? o : "";
  });
}
c(pv, "setCategorySelections");
function yv(t) {
  const e = {};
  return t.querySelectorAll("select[data-category-id]").forEach((n) => {
    var o, s;
    const i = n.dataset.categoryId, r = (s = (o = n.value) == null ? void 0 : o.trim) == null ? void 0 : s.call(o);
    !i || !r || (e[i] = r);
  }), Object.keys(e).length > 0 ? e : null;
}
c(yv, "readCategorySelections");
async function Ml(t, e, n) {
  if (!t) return null;
  try {
    if (!n)
      return await oo(t, {});
    if (n === Le)
      return await oo(t, {
        mappingId: Le,
        categories: null,
        updatedAt: Date.now()
      });
    const i = so(e, n);
    return i ? await oo(t, {
      mappingId: i.id,
      categories: i.categories,
      updatedAt: Date.now()
    }) : null;
  } catch (i) {
    return console.warn("eidolon-utilities | Failed to persist mapping selection", i), null;
  }
}
c(Ml, "persistCurrentSelection");
function Wu(t, e) {
  if (!(t instanceof HTMLElement)) return;
  const n = t.querySelector(".eidolon-light-criteria-manager__section.is-bottom");
  n instanceof HTMLElement && (n.hidden = !!(e != null && e.hidden));
}
c(Wu, "updateManagerSectionVisibility");
function wi({ switcher: t, emptyState: e, state: n }) {
  const i = !!(n != null && n.base);
  t instanceof HTMLElement && (t.hidden = !i), e instanceof HTMLElement && (e.hidden = i);
}
c(wi, "updateActiveMappingVisibility");
function ym(t) {
  const e = (t == null ? void 0 : t.object) ?? (t == null ? void 0 : t.document) ?? null;
  return !(e != null && e.isEmbedded) || e.documentName !== "AmbientLight" ? null : e;
}
c(ym, "getAmbientLightDocument");
function bv(t) {
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
c(bv, "getPersistedAmbientLightDocument");
function vv() {
  Yb();
}
c(vv, "registerLightCriteriaHooks");
vv();
const Bc = /* @__PURE__ */ new Map();
let Uc = !1;
function zu(t, e) {
  Bc.has(t) && console.warn(`[${k}] Socket handler for type "${t}" already registered, overwriting.`), Bc.set(t, e);
}
c(zu, "registerSocketHandler");
function ks(t, e) {
  if (!Uc) {
    console.error(`[${k}] Socket not initialized. Call initializeSocket() first.`);
    return;
  }
  game.socket.emit(`module.${k}`, { type: t, payload: e });
}
c(ks, "emitSocket");
function wv() {
  Uc || (game.socket.on(`module.${k}`, (t) => {
    const { type: e, payload: n } = t ?? {}, i = Bc.get(e);
    i ? i(n) : console.warn(`[${k}] No socket handler for type "${e}"`);
  }), Uc = !0, console.log(`[${k}] Socket initialized on channel module.${k}`));
}
c(wv, "initializeSocket");
const bm = "tween", vm = "tween-sequence", Vc = "tween-sequence-cancel", De = Object.freeze({
  ABORT: "abort",
  CONTINUE: "continue"
}), Dn = Object.freeze({
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  FAILED: "failed"
}), $t = Object.freeze({
  BEFORE_ALL: "beforeAll",
  BEFORE_STEP: "before",
  ENTRY: "entry",
  AFTER_STEP: "after",
  RUNTIME: "runtime",
  VALIDATION: "validation",
  AWAIT: "await",
  EMIT: "emit",
  PARALLEL: "parallel"
}), Ks = /* @__PURE__ */ new Map();
function en({ type: t, execute: e, validate: n }) {
  Ks.has(t) && console.warn(`[tween-registry] Type "${t}" already registered, overwriting.`), Ks.set(t, { type: t, execute: e, validate: n ?? (() => {
  }) });
}
c(en, "registerTweenType");
function Hr(t) {
  return Ks.get(t);
}
c(Hr, "getTweenType");
function Ev(t, e = {}) {
  const n = Hr(t);
  if (!n)
    throw new Error(`Unknown tween type: "${t}".`);
  return n.validate(e ?? {}), n;
}
c(Ev, "validateTweenEntry");
function Gc() {
  return [...Ks.keys()];
}
c(Gc, "listTweenTypes");
const vr = {
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
  easeInBounce: /* @__PURE__ */ c((t) => 1 - vr.easeOutBounce(1 - t), "easeInBounce"),
  easeInOutBounce: /* @__PURE__ */ c((t) => t < 0.5 ? (1 - vr.easeOutBounce(1 - 2 * t)) / 2 : (1 + vr.easeOutBounce(2 * t - 1)) / 2, "easeInOutBounce"),
  easeInElastic: /* @__PURE__ */ c((t) => t === 0 || t === 1 ? t : -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI), "easeInElastic"),
  easeOutElastic: /* @__PURE__ */ c((t) => t === 0 || t === 1 ? t : Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1, "easeOutElastic")
};
function vt(t) {
  if (t && vr[t])
    return vr[t];
  const e = foundry.canvas.animation.CanvasAnimation;
  return {
    linear: e.easeLinear,
    easeInOutCosine: e.easeInOutCosine
  }[t] ?? e.easeInOutCosine;
}
c(vt, "resolveEasing");
function Yu() {
  return ["linear", "easeInOutCosine", ...Object.keys(vr)];
}
c(Yu, "listEasingNames");
function Xs(t) {
  return t <= 0.04045 ? t / 12.92 : ((t + 0.055) / 1.055) ** 2.4;
}
c(Xs, "srgbToLinear");
function wr(t) {
  return t <= 31308e-7 ? 12.92 * t : 1.055 * t ** (1 / 2.4) - 0.055;
}
c(wr, "linearToSrgb");
function Xd(t, e, n) {
  const i = 0.4122214708 * t + 0.5363325363 * e + 0.0514459929 * n, r = 0.2119034982 * t + 0.6806995451 * e + 0.1073969566 * n, o = 0.0883024619 * t + 0.2817188376 * e + 0.6299787005 * n, s = Math.cbrt(i), a = Math.cbrt(r), l = Math.cbrt(o);
  return [
    0.2104542553 * s + 0.793617785 * a - 0.0040720468 * l,
    1.9779984951 * s - 2.428592205 * a + 0.4505937099 * l,
    0.0259040371 * s + 0.7827717662 * a - 0.808675766 * l
  ];
}
c(Xd, "linearRgbToOklab");
function Sv(t, e, n) {
  const i = (t + 0.3963377774 * e + 0.2158037573 * n) ** 3, r = (t - 0.1055613458 * e - 0.0638541728 * n) ** 3, o = (t - 0.0894841775 * e - 1.291485548 * n) ** 3;
  return [
    4.0767416621 * i - 3.3077115913 * r + 0.2309699292 * o,
    -1.2684380046 * i + 2.6097574011 * r - 0.3413193965 * o,
    -0.0041960863 * i - 0.7034186147 * r + 1.707614701 * o
  ];
}
c(Sv, "oklabToLinearRgb");
function Js(t) {
  return [t.r, t.g, t.b];
}
c(Js, "colorToRgb");
function wm(t, e, n) {
  const i = /* @__PURE__ */ c((o) => Math.max(0, Math.min(1, o)), "clamp"), r = /* @__PURE__ */ c((o) => Math.round(i(o) * 255).toString(16).padStart(2, "0"), "toHex");
  return `#${r(t)}${r(e)}${r(n)}`;
}
c(wm, "rgbToHex");
function Cv(t, e, n) {
  if (n <= 0) return t.toHTML();
  if (n >= 1) return e.toHTML();
  const i = foundry.utils.Color, [r, o, s] = t.hsl, [a, l, u] = e.hsl, d = (a - r + 0.5) % 1 - 0.5, f = (r + d * n + 1) % 1, h = o + (l - o) * n, m = s + (u - s) * n;
  return i.fromHSL([f, h, m]).toHTML();
}
c(Cv, "interpolateHsl");
function Tv(t, e, n) {
  if (n <= 0) return t.toHTML();
  if (n >= 1) return e.toHTML();
  const [i, r, o] = Js(t).map(Xs), [s, a, l] = Js(e).map(Xs), u = wr(i + (s - i) * n), d = wr(r + (a - r) * n), f = wr(o + (l - o) * n);
  return wm(u, d, f);
}
c(Tv, "interpolateRgb");
function Lv(t, e, n) {
  if (n <= 0) return t.toHTML();
  if (n >= 1) return e.toHTML();
  const [i, r, o] = Js(t).map(Xs), [s, a, l] = Js(e).map(Xs), [u, d, f] = Xd(i, r, o), [h, m, p] = Xd(s, a, l), y = 0.02, E = Math.sqrt(d * d + f * f), v = Math.sqrt(m * m + p * p);
  let b, w, S;
  if (E < y || v < y)
    b = u + (h - u) * n, w = d + (m - d) * n, S = f + (p - f) * n;
  else {
    const M = Math.atan2(f, d);
    let N = Math.atan2(p, m) - M;
    N > Math.PI && (N -= 2 * Math.PI), N < -Math.PI && (N += 2 * Math.PI), b = u + (h - u) * n;
    const $ = E + (v - E) * n, x = M + N * n;
    w = $ * Math.cos(x), S = $ * Math.sin(x);
  }
  const [T, L, A] = Sv(b, w, S);
  return wm(wr(T), wr(L), wr(A));
}
c(Lv, "interpolateOklch");
const Wc = {
  hsl: Cv,
  rgb: Tv,
  oklch: Lv
};
function Ku(t = "hsl") {
  return Wc[t] ?? Wc.hsl;
}
c(Ku, "getInterpolator");
function Mr() {
  return Object.keys(Wc);
}
c(Mr, "listInterpolationModes");
function Iv(t) {
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
  if (t.mode && !Mr().includes(t.mode))
    throw new Error(
      `light-color tween: unknown mode "${t.mode}". Available: ${Mr().join(", ")}`
    );
}
c(Iv, "validate$7");
async function kv(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { Color: i } = foundry.utils, { uuid: r, toColor: o, toAlpha: s, mode: a = "oklch" } = t, l = Array.isArray(r) ? r : [r];
  if (l.length === 0)
    return console.warn("light-color tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: u = 2e3,
    easing: d = "easeInOutCosine",
    commit: f = !0,
    startEpochMS: h = null,
    signal: m = null
  } = e, p = vt(d), y = o != null, E = s != null, v = y ? Ku(a) : null, b = y ? i.fromString(o) : null;
  if (y && !b.valid) throw new Error(`light-color tween: invalid target color "${o}".`);
  async function w(T) {
    var j, q;
    if (m != null && m.aborted) return !1;
    const L = await fromUuid(T);
    if (!L) return !1;
    const A = L.object;
    if (!A) return !1;
    let M;
    if (y) {
      const B = (j = L.config) == null ? void 0 : j.color;
      B != null && B.valid || console.warn(`light-color tween: source color invalid on ${T}, using white.`), M = B != null && B.valid ? B : i.fromString("#ffffff");
    }
    const F = E ? ((q = L._source.config) == null ? void 0 : q.alpha) ?? 0.5 : null, N = { t: 0 }, $ = `ambient-hue-tween:${T}`;
    n.terminateAnimation($), m && m.addEventListener("abort", () => {
      n.terminateAnimation($);
    }, { once: !0 });
    const x = typeof h == "number" ? Math.max(0, Math.min(u, Date.now() - h)) : 0, R = /* @__PURE__ */ c((B) => {
      const z = {};
      y && (z.color = v(M, b, B)), E && (z.alpha = F + (s - F) * B), L.updateSource({ config: z }), A.initializeLightSource();
    }, "applyFrame");
    x > 0 && (N.t = x / u, R(N.t));
    const P = await n.animate(
      [{ parent: N, attribute: "t", to: 1 }],
      {
        name: $,
        duration: u,
        easing: p,
        time: x,
        ontick: /* @__PURE__ */ c(() => R(N.t), "ontick")
      }
    );
    if (P !== !1) {
      if (m != null && m.aborted) return !1;
      const B = {};
      y && (B.color = b.toHTML()), E && (B.alpha = s), L.updateSource({ config: B }), A.initializeLightSource();
    }
    if (f && P !== !1 && L.canUserModify(game.user, "update")) {
      if (m != null && m.aborted) return !1;
      const B = {}, z = {};
      y && (B.color = M.toHTML(), z["config.color"] = b.toHTML()), E && (B.alpha = F, z["config.alpha"] = s), L.updateSource({ config: B }), await L.update(z);
    }
    return P !== !1;
  }
  return c(w, "animateOne"), (await Promise.all(l.map(w))).every(Boolean);
}
c(kv, "execute$7");
function Ov() {
  en({ type: "light-color", execute: kv, validate: Iv });
}
c(Ov, "registerLightColorTween");
const Pn = /* @__PURE__ */ new WeakMap();
function Av(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("light-state tween: 'uuid' is required (string or array of AmbientLight document UUIDs).");
  if (typeof t.enabled != "boolean")
    throw new Error("light-state tween: 'enabled' (boolean) is required.");
}
c(Av, "validate$6");
async function Mv(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, enabled: r } = t, o = Array.isArray(i) ? i : [i];
  if (o.length === 0)
    return console.warn("light-state tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: s = 2e3,
    easing: a = "easeInOutCosine",
    commit: l = !0,
    startEpochMS: u = null,
    signal: d = null
  } = e, f = vt(a);
  async function h(p) {
    var L, A, M, F;
    if (d != null && d.aborted) return !1;
    const y = await fromUuid(p);
    if (!y) return !1;
    const E = y.object;
    if (!E) return !1;
    const v = `ambient-state-tween:${p}`;
    n.terminateAnimation(v), d && d.addEventListener("abort", () => {
      n.terminateAnimation(v);
    }, { once: !0 });
    const b = Pn.get(y) ?? {
      hidden: y._source.hidden,
      alpha: ((L = y._source.config) == null ? void 0 : L.alpha) ?? 0.5
    };
    if (Pn.set(y, b), D(`light-state START ${r ? "ON" : "OFF"} | snap: ${JSON.stringify(b)} | _source.hidden=${y._source.hidden}, _source.config.alpha=${(A = y._source.config) == null ? void 0 : A.alpha}`), r && !b.hidden || !r && b.hidden)
      return Pn.delete(y), !0;
    const w = b.alpha, S = typeof u == "number" ? Math.max(0, Math.min(s, Date.now() - u)) : 0, T = /* @__PURE__ */ c((N) => {
      y.updateSource({ config: { alpha: N } }), E.initializeLightSource();
    }, "applyAlpha");
    if (r) {
      y.updateSource({ hidden: !1, config: { alpha: 0 } }), E.initializeLightSource(), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
      const N = { t: 0 };
      S > 0 && (N.t = S / s, T(w * N.t));
      const $ = await n.animate(
        [{ parent: N, attribute: "t", to: 1 }],
        {
          name: v,
          duration: s,
          easing: f,
          time: S,
          ontick: /* @__PURE__ */ c(() => T(w * N.t), "ontick")
        }
      );
      return $ !== !1 && !(d != null && d.aborted) && l && y.canUserModify(game.user, "update") ? (y.updateSource({ hidden: !0, config: { alpha: w } }), await y.update({ hidden: !1 }), D(`light-state FADE-IN committed. _source.hidden=${y._source.hidden}, _source.config.alpha=${(M = y._source.config) == null ? void 0 : M.alpha}`), Pn.delete(y)) : $ === !1 || Pn.delete(y), $ !== !1;
    } else {
      y.updateSource({ hidden: !1, config: { alpha: b.alpha } }), E.initializeLightSource();
      const N = { t: 0 };
      S > 0 && (N.t = S / s, T(w * (1 - N.t)));
      const $ = await n.animate(
        [{ parent: N, attribute: "t", to: 1 }],
        {
          name: v,
          duration: s,
          easing: f,
          time: S,
          ontick: /* @__PURE__ */ c(() => T(w * (1 - N.t)), "ontick")
        }
      );
      return $ !== !1 && !(d != null && d.aborted) && l && y.canUserModify(game.user, "update") ? (await y.update({ hidden: !0 }), y.updateSource({ config: { alpha: w } }), E.initializeLightSource(), D(`light-state FADE-OUT committed+restored. _source.hidden=${y._source.hidden}, _source.config.alpha=${(F = y._source.config) == null ? void 0 : F.alpha}`), Pn.delete(y)) : $ === !1 || (y.updateSource({ hidden: !0, config: { alpha: w } }), E.initializeLightSource(), Pn.delete(y)), $ !== !1;
    }
  }
  return c(h, "animateOne"), (await Promise.all(o.map(h))).every(Boolean);
}
c(Mv, "execute$6");
function xv() {
  en({ type: "light-state", execute: Mv, validate: Av });
}
c(xv, "registerLightStateTween");
function rl(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("tile-prop tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (!t.attribute || typeof t.attribute != "string")
    throw new Error("tile-prop tween: 'attribute' (string) is required — dot-path to a numeric property (e.g. 'alpha', 'rotation').");
  if (typeof t.value != "number")
    throw new Error("tile-prop tween: 'value' (number) is required — the target value to animate to.");
}
c(rl, "validate$5");
async function ol(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, attribute: r, value: o } = t, s = Array.isArray(i) ? i : [i];
  if (s.length === 0)
    return console.warn("tile-prop tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: a = 2e3,
    easing: l = "easeInOutCosine",
    commit: u = !0,
    startEpochMS: d = null,
    signal: f = null
  } = e, h = vt(l);
  async function m(y) {
    if (f != null && f.aborted) return !1;
    const E = await fromUuid(y);
    if (!E) return !1;
    const v = E.object;
    if (!v) return !1;
    const b = foundry.utils.getProperty(E._source, r);
    if (typeof b != "number")
      return console.warn(`tile-prop tween: source value at '${r}' on ${y} is not a number (got ${typeof b}). Skipping.`), !1;
    const w = `tile-prop-tween:${r}:${y}`;
    n.terminateAnimation(w), f && f.addEventListener("abort", () => {
      n.terminateAnimation(w);
    }, { once: !0 });
    const S = typeof d == "number" ? Math.max(0, Math.min(a, Date.now() - d)) : 0, T = /* @__PURE__ */ c((M) => {
      const F = b + (o - b) * M;
      E.updateSource(foundry.utils.expandObject({ [r]: F })), v.refresh();
    }, "applyFrame"), L = { t: 0 };
    S > 0 && (L.t = S / a, T(L.t));
    const A = await n.animate(
      [{ parent: L, attribute: "t", to: 1 }],
      {
        name: w,
        duration: a,
        easing: h,
        time: S,
        ontick: /* @__PURE__ */ c(() => T(L.t), "ontick")
      }
    );
    if (A !== !1) {
      if (f != null && f.aborted) return !1;
      E.updateSource(foundry.utils.expandObject({ [r]: o })), v.refresh();
    }
    if (u && A !== !1 && E.canUserModify(game.user, "update")) {
      if (f != null && f.aborted) return !1;
      E.updateSource(foundry.utils.expandObject({ [r]: b })), await E.update({ [r]: o });
    }
    return A !== !1;
  }
  return c(m, "animateOne"), (await Promise.all(s.map(m))).every(Boolean);
}
c(ol, "execute$5");
function _v() {
  en({ type: "tile-prop", execute: ol, validate: rl });
}
c(_v, "registerTilePropTween");
function Nv(t) {
  if (!t.attribute || typeof t.attribute != "string")
    throw new Error("particles-prop tween: 'attribute' (string) is required — property name on canvas.particleeffects (e.g. 'alpha').");
  if (typeof t.value != "number")
    throw new Error("particles-prop tween: 'value' (number) is required — the target value to animate to.");
}
c(Nv, "validate$4");
async function $v(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { attribute: i, value: r } = t, {
    durationMS: o = 2e3,
    easing: s = "easeInOutCosine",
    startEpochMS: a = null,
    signal: l = null
  } = e, u = canvas.particleeffects;
  if (!u)
    return console.warn("particles-prop tween: canvas.particleeffects not available."), !1;
  const d = u[i];
  if (typeof d != "number")
    return console.warn(`particles-prop tween: current value of '${i}' is not a number (got ${typeof d}). Skipping.`), !1;
  const f = vt(s), h = `particles-prop-tween:${i}`;
  n.terminateAnimation(h), l && l.addEventListener("abort", () => {
    n.terminateAnimation(h);
  }, { once: !0 });
  const m = typeof a == "number" ? Math.max(0, Math.min(o, Date.now() - a)) : 0, p = /* @__PURE__ */ c((v) => {
    u[i] = d + (r - d) * v;
  }, "applyFrame"), y = { t: 0 };
  m > 0 && (y.t = m / o, p(y.t));
  const E = await n.animate(
    [{ parent: y, attribute: "t", to: 1 }],
    {
      name: h,
      duration: o,
      easing: f,
      time: m,
      ontick: /* @__PURE__ */ c(() => p(y.t), "ontick")
    }
  );
  if (E !== !1) {
    if (l != null && l.aborted) return !1;
    u[i] = r;
  }
  return E !== !1;
}
c($v, "execute$4");
function Fv() {
  en({ type: "particles-prop", execute: $v, validate: Nv });
}
c(Fv, "registerParticlesPropTween");
var Vn, _o, No, $o, Fo, Do, Sr;
const gd = class gd {
  /**
   * @param {AbortController} controller
   */
  constructor(e) {
    _(this, Vn);
    _(this, _o);
    _(this, No);
    _(this, $o);
    _(this, Fo);
    _(this, Do, !1);
    _(this, Sr, null);
    O(this, Vn, e), O(this, $o, new Promise((n) => {
      O(this, _o, n);
    })), O(this, Fo, new Promise((n) => {
      O(this, No, n);
    }));
  }
  /** @returns {Promise<boolean>} Resolves true (completed) or false (cancelled/failed). */
  get finished() {
    return g(this, $o);
  }
  /** @returns {Promise<{status: string, [k: string]: unknown}>} */
  get result() {
    return g(this, Fo);
  }
  /** @returns {boolean} */
  get cancelled() {
    return g(this, Vn).signal.aborted;
  }
  /** @returns {AbortSignal} */
  get signal() {
    return g(this, Vn).signal;
  }
  /** @returns {string} */
  get status() {
    return g(this, Sr) ? g(this, Sr).status : this.cancelled ? "cancelled" : "running";
  }
  /** Abort the timeline, triggering onCancel callbacks. */
  cancel(e = "cancelled") {
    g(this, Vn).signal.aborted || g(this, Vn).abort(e);
  }
  /**
   * Called internally by the execution engine when the timeline finishes.
   * @param {boolean} completed - true if all steps ran, false if cancelled
   */
  _resolve(e) {
    if (g(this, Do)) return;
    O(this, Do, !0);
    const n = typeof e == "boolean" ? { status: e ? "completed" : "cancelled" } : e ?? { status: "cancelled" };
    O(this, Sr, n), g(this, _o).call(this, n.status === "completed"), g(this, No).call(this, n);
  }
};
Vn = new WeakMap(), _o = new WeakMap(), No = new WeakMap(), $o = new WeakMap(), Fo = new WeakMap(), Do = new WeakMap(), Sr = new WeakMap(), c(gd, "TimelineHandle");
let zc = gd;
var Pi, Cr, Ri;
const pd = class pd {
  constructor() {
    /** @type {Map<string, Set<Function>>} */
    _(this, Pi, /* @__PURE__ */ new Map());
    /** @type {Set<string>} Signals that have been emitted (sticky) */
    _(this, Cr, /* @__PURE__ */ new Set());
    _(this, Ri, !1);
  }
  /**
   * Subscribe to a named signal.
   * @param {string} signal
   * @param {Function} listener
   * @returns {() => void} Unsubscribe function
   */
  on(e, n) {
    if (g(this, Ri)) return () => {
    };
    let i = g(this, Pi).get(e);
    return i || (i = /* @__PURE__ */ new Set(), g(this, Pi).set(e, i)), i.add(n), () => i.delete(n);
  }
  /**
   * Fire a named signal synchronously. All registered listeners are invoked.
   * The signal is recorded so that future waitFor() calls resolve immediately.
   * @param {string} signal
   */
  emit(e) {
    if (g(this, Ri)) return;
    g(this, Cr).add(e);
    const n = g(this, Pi).get(e);
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
    return g(this, Ri) ? Promise.reject(new Error("EventBus destroyed")) : g(this, Cr).has(e) ? Promise.resolve() : new Promise((i, r) => {
      if (n != null && n.aborted)
        return r(n.reason ?? "aborted");
      const o = this.on(e, () => {
        o(), s && (n == null || n.removeEventListener("abort", s)), i();
      });
      let s;
      n && (s = /* @__PURE__ */ c(() => {
        o(), r(n.reason ?? "aborted");
      }, "onAbort"), n.addEventListener("abort", s, { once: !0 }));
    });
  }
  /**
   * Tear down the bus, clearing all listeners.
   */
  destroy() {
    O(this, Ri, !0), g(this, Pi).clear(), g(this, Cr).clear();
  }
};
Pi = new WeakMap(), Cr = new WeakMap(), Ri = new WeakMap(), c(pd, "EventBus");
let Yc = pd;
const Em = /* @__PURE__ */ new Map();
function sl(t, e) {
  Em.set(t, e);
}
c(sl, "registerAwaitProvider");
function Kc(t, e) {
  const n = Em.get(t.event);
  return n ? n(t, e) : Promise.reject(new Error(`Unknown await event type: "${t.event}"`));
}
c(Kc, "createAwaitPromise");
sl("signal", (t, e) => t.name ? e.eventBus.waitFor(t.name, e.signal) : Promise.reject(new Error('await signal: "name" is required')));
sl("click", (t, e) => new Promise((n, i) => {
  if (e.signal.aborted) return i(e.signal.reason ?? "aborted");
  const r = /* @__PURE__ */ c(() => {
    s(), n();
  }, "onClick"), o = /* @__PURE__ */ c(() => {
    s(), i(e.signal.reason ?? "aborted");
  }, "onAbort"), s = /* @__PURE__ */ c(() => {
    document.removeEventListener("click", r), e.signal.removeEventListener("abort", o);
  }, "cleanup");
  document.addEventListener("click", r, { once: !0 }), e.signal.addEventListener("abort", o, { once: !0 });
}));
sl("keypress", (t, e) => new Promise((n, i) => {
  if (e.signal.aborted) return i(e.signal.reason ?? "aborted");
  const r = /* @__PURE__ */ c((a) => {
    t.key && a.key !== t.key || (s(), n());
  }, "onKey"), o = /* @__PURE__ */ c(() => {
    s(), i(e.signal.reason ?? "aborted");
  }, "onAbort"), s = /* @__PURE__ */ c(() => {
    document.removeEventListener("keydown", r), e.signal.removeEventListener("abort", o);
  }, "cleanup");
  document.addEventListener("keydown", r), e.signal.addEventListener("abort", o, { once: !0 });
}));
const ur = /* @__PURE__ */ new Map();
function Dv(t, e) {
  const n = ur.get(t);
  n && !n.cancelled && n.cancel("replaced-by-name"), ur.set(t, e), e.finished.then(() => {
    ur.get(t) === e && ur.delete(t);
  });
}
c(Dv, "registerTimeline");
function Sm(t) {
  const e = ur.get(t);
  return e && !e.cancelled ? (e.cancel("cancelled-by-name"), !0) : !1;
}
c(Sm, "cancelTimeline");
function Pv(t) {
  return ur.get(t);
}
c(Pv, "getTimeline");
function Jd(t, e) {
  return t <= 0 ? Promise.resolve() : new Promise((n, i) => {
    if (e.aborted) return i(e.reason);
    const r = setTimeout(n, t);
    e.addEventListener("abort", () => {
      clearTimeout(r), i(e.reason);
    }, { once: !0 });
  });
}
c(Jd, "cancellableDelay");
var Ze, Gn, Po, Ro;
const yd = class yd {
  constructor(e) {
    /** @type {TweenTimeline} */
    _(this, Ze);
    /** @type {Array<{ type: string, params: object, opts?: object, detach: boolean }>} */
    _(this, Gn, []);
    /** @type {Function|null} */
    _(this, Po, null);
    /** @type {Function|null} */
    _(this, Ro, null);
    O(this, Ze, e);
  }
  /**
   * Add a tween entry to this step.
   * @param {string} type  Registered tween type name
   * @param {object} params  Type-specific parameters
   * @param {object} [opts]  Options (durationMS, easing, etc.)
   * @returns {StepBuilder} this
   */
  add(e, n, i) {
    return g(this, Gn).push({ type: e, params: n, opts: i ?? {}, detach: !1 }), this;
  }
  /**
   * Mark the last entry as fire-and-forget (does not block step progression).
   * @returns {StepBuilder} this
   */
  detach() {
    if (g(this, Gn).length === 0)
      throw new Error("StepBuilder.detach(): no entry to detach.");
    return g(this, Gn)[g(this, Gn).length - 1].detach = !0, this;
  }
  /**
   * Callback invoked before this step's tweens start.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  before(e) {
    return O(this, Po, e), this;
  }
  /**
   * Callback invoked after this step's awaited tweens complete.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  after(e) {
    return O(this, Ro, e), this;
  }
  // ── Delegation to parent TweenTimeline for fluent chaining ──
  /** Start a new step (finalizes this one). */
  step() {
    return g(this, Ze).step();
  }
  /** Insert a delay between steps. */
  delay(e) {
    return g(this, Ze).delay(e);
  }
  /** Insert an await segment. */
  await(e) {
    return g(this, Ze).await(e);
  }
  /** Insert an emit segment. */
  emit(e) {
    return g(this, Ze).emit(e);
  }
  /** Insert a parallel segment. */
  parallel(e, n) {
    return g(this, Ze).parallel(e, n);
  }
  /** Register onComplete callback. */
  onComplete(e) {
    return g(this, Ze).onComplete(e);
  }
  /** Register onCancel callback. */
  onCancel(e) {
    return g(this, Ze).onCancel(e);
  }
  /** Register onError callback. */
  onError(e) {
    return g(this, Ze).onError(e);
  }
  /** Execute the timeline. */
  run(e) {
    return g(this, Ze).run(e);
  }
  /** Serialize the timeline. */
  toJSON() {
    return g(this, Ze).toJSON();
  }
  // ── Internal access ──
  /** @returns {{ entries: Array, before: Function|null, after: Function|null }} */
  _finalize() {
    return {
      entries: g(this, Gn),
      before: g(this, Po),
      after: g(this, Ro)
    };
  }
};
Ze = new WeakMap(), Gn = new WeakMap(), Po = new WeakMap(), Ro = new WeakMap(), c(yd, "StepBuilder");
let Xc = yd;
var et, qe, jt, Wn, Ho, qo, jo, Bo, mi, Jc, Q, yn, Qc, Cm, Zc, Tm, Lm, Os, Tt, rn;
const wn = class wn {
  constructor() {
    _(this, Q);
    /** @type {string|null} */
    _(this, et, null);
    /** @type {string} */
    _(this, qe, De.ABORT);
    /** @type {Array<object>} */
    _(this, jt, []);
    /** @type {StepBuilder|null} */
    _(this, Wn, null);
    /** @type {Function|null} */
    _(this, Ho, null);
    /** @type {Function|null} */
    _(this, qo, null);
    /** @type {Function|null} */
    _(this, jo, null);
    /** @type {Function|null} */
    _(this, Bo, null);
  }
  /**
   * Register this timeline in the named registry. Starting a new
   * timeline with the same name cancels the previous one.
   * @param {string} name
   * @returns {TweenTimeline} this
   */
  name(e) {
    return O(this, et, e), this;
  }
  /**
   * Set the error policy for step execution.
   * @param {"abort"|"continue"} policy
   * @returns {TweenTimeline} this
   */
  errorPolicy(e) {
    if (e !== De.ABORT && e !== De.CONTINUE)
      throw new Error(`Invalid error policy: "${e}". Use "abort" or "continue".`);
    return O(this, qe, e), this;
  }
  /**
   * Start a new step. Finalizes the previous step if one is open.
   * @returns {StepBuilder}
   */
  step() {
    return I(this, Q, yn).call(this), O(this, Wn, new Xc(this)), g(this, Wn);
  }
  /**
   * Insert a delay (in ms) between the previous step and the next.
   * @param {number} ms
   * @returns {TweenTimeline} this
   */
  delay(e) {
    return I(this, Q, yn).call(this), g(this, jt).push({ kind: "delay", ms: e }), this;
  }
  /**
   * Pause execution until an event occurs.
   * @param {object} config  e.g. { event: "click" }, { event: "signal", name: "fog-done" }
   * @returns {TweenTimeline} this
   */
  await(e) {
    return I(this, Q, yn).call(this), g(this, jt).push({ kind: "await", config: e }), this;
  }
  /**
   * Fire a named signal (instant, non-blocking).
   * @param {string} signal  Signal name
   * @returns {TweenTimeline} this
   */
  emit(e) {
    return I(this, Q, yn).call(this), g(this, jt).push({ kind: "emit", signal: e }), this;
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
    I(this, Q, yn).call(this);
    const i = n.join ?? "all", r = n.overflow ?? "detach";
    if (i !== "all" && i !== "any" && (typeof i != "number" || i < 1 || i > e.length))
      throw new Error(`parallel: join must be "all", "any", or 1..${e.length}, got ${JSON.stringify(i)}`);
    if (r !== "detach" && r !== "cancel")
      throw new Error(`parallel: overflow must be "detach" or "cancel", got ${JSON.stringify(r)}`);
    const o = e.map((s) => {
      var l;
      const a = new wn();
      return s(a), I(l = a, Q, yn).call(l), g(a, jt);
    });
    return g(this, jt).push({ kind: "parallel", branches: o, join: i, overflow: r }), this;
  }
  /**
   * Callback invoked before the first step runs.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  beforeAll(e) {
    return O(this, Ho, e), this;
  }
  /**
   * Callback invoked on successful completion.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onComplete(e) {
    return O(this, qo, e), this;
  }
  /**
   * Callback invoked on cancellation (mutually exclusive with onComplete).
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onCancel(e) {
    return O(this, jo, e), this;
  }
  /**
   * Callback invoked on runtime failure (mutually exclusive with onComplete/onCancel).
   * @param {(outcome: object) => void} fn
   * @returns {TweenTimeline} this
   */
  onError(e) {
    return O(this, Bo, e), this;
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
    I(this, Q, yn).call(this);
    const n = new AbortController();
    e.signal && (e.signal.aborted ? n.abort(e.signal.reason ?? "parent-aborted") : e.signal.addEventListener("abort", () => {
      n.signal.aborted || n.abort(e.signal.reason ?? "parent-aborted");
    }, { once: !0 }));
    const i = new zc(n);
    g(this, et) && Dv(g(this, et), i);
    const r = e.broadcast ?? game.user.isGM, o = e.commit ?? game.user.isGM, s = e.startEpochMS ?? Date.now();
    r && g(this, et) && ks(vm, {
      name: g(this, et),
      data: this.toJSON(),
      startEpochMS: s
    });
    const a = new Yc(), l = {
      signal: i.signal,
      commit: o,
      startEpochMS: s,
      eventBus: a,
      errors: [],
      detachedPromises: []
    };
    return I(this, Q, Cm).call(this, i, l).then((u) => {
      var d, f, h;
      a.destroy(), i._resolve(u), u.status === Dn.COMPLETED ? (d = g(this, qo)) == null || d.call(this) : u.status === Dn.CANCELLED ? ((f = g(this, jo)) == null || f.call(this), r && g(this, et) && ks(Vc, {
        name: g(this, et),
        reason: u.reason
      })) : ((h = g(this, Bo)) == null || h.call(this, u), r && g(this, et) && ks(Vc, {
        name: g(this, et),
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
    I(this, Q, yn).call(this);
    const n = { timeline: I(i = wn, mi, Jc).call(i, g(this, jt)) };
    return g(this, et) && (n.name = g(this, et)), g(this, qe) !== De.ABORT && (n.errorPolicy = g(this, qe)), n;
  }
};
et = new WeakMap(), qe = new WeakMap(), jt = new WeakMap(), Wn = new WeakMap(), Ho = new WeakMap(), qo = new WeakMap(), jo = new WeakMap(), Bo = new WeakMap(), mi = new WeakSet(), Jc = /* @__PURE__ */ c(function(e) {
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
            var o;
            return I(o = wn, mi, Jc).call(o, r);
          }),
          join: i.join,
          overflow: i.overflow
        }
      });
    else {
      const r = i.data.entries.map((o) => {
        const s = { type: o.type, params: o.params };
        return Object.keys(o.opts).length > 0 && (s.opts = o.opts), o.detach && (s.detach = !0), s;
      });
      n.push(r);
    }
  return n;
}, "#serializeSegments"), Q = new WeakSet(), // ── Private ─────────────────────────────────────────────────────────
yn = /* @__PURE__ */ c(function() {
  g(this, Wn) && (g(this, jt).push({ kind: "step", data: g(this, Wn)._finalize() }), O(this, Wn, null));
}, "#finalizeCurrentStep"), Qc = /* @__PURE__ */ c(function(e) {
  e.length !== 0 && Promise.allSettled(e).catch(() => {
  });
}, "#drainDetached"), Cm = /* @__PURE__ */ c(async function(e, n) {
  var i, r;
  try {
    if (n.signal.aborted) return I(this, Q, Tt).call(this, n.signal.reason);
    const o = await I(this, Q, Os).call(this, g(this, Ho), $t.BEFORE_ALL, null);
    if (o) {
      if (g(this, qe) === De.ABORT) return o;
      n.errors.push(o);
    }
    const s = await I(this, Q, Zc).call(this, g(this, jt), n);
    if (s)
      return I(i = wn, mi, Qc).call(i, n.detachedPromises), s;
    if (!n.signal.aborted) {
      const a = await Promise.allSettled(n.detachedPromises);
      for (const l of a)
        if (l.status === "rejected") {
          const u = I(this, Q, rn).call(this, l.reason, $t.ENTRY);
          if (g(this, qe) === De.ABORT) return u;
          n.errors.push(u);
        }
    }
    return n.signal.aborted ? I(this, Q, Tt).call(this, n.signal.reason) : {
      status: Dn.COMPLETED,
      ...n.errors.length > 0 ? { errors: n.errors } : {}
    };
  } catch (o) {
    return I(r = wn, mi, Qc).call(r, n.detachedPromises), n.signal.aborted ? I(this, Q, Tt).call(this, n.signal.reason) : (console.error("TweenTimeline execution error:", o), I(this, Q, rn).call(this, o, $t.RUNTIME));
  }
}, "#execute"), Zc = /* @__PURE__ */ c(async function(e, n) {
  let i = -1, r = 0;
  for (const o of e) {
    if (n.signal.aborted) return I(this, Q, Tt).call(this, n.signal.reason);
    if (o.kind === "delay") {
      try {
        await Jd(o.ms, n.signal);
      } catch {
        return I(this, Q, Tt).call(this, n.signal.reason);
      }
      r += o.ms;
      continue;
    }
    if (o.kind === "await") {
      try {
        let p = Kc(o.config, {
          signal: n.signal,
          eventBus: n.eventBus
        });
        const y = o.config.timeout;
        typeof y == "number" && y > 0 && (p = Promise.race([
          p,
          Jd(y, n.signal)
        ])), await p;
      } catch (p) {
        if (n.signal.aborted) return I(this, Q, Tt).call(this, n.signal.reason);
        const y = I(this, Q, rn).call(this, p, $t.AWAIT);
        if (g(this, qe) === De.ABORT) return y;
        n.errors.push(y);
      }
      continue;
    }
    if (o.kind === "emit") {
      try {
        n.eventBus.emit(o.signal);
      } catch (p) {
        const y = I(this, Q, rn).call(this, p, $t.EMIT);
        if (g(this, qe) === De.ABORT) return y;
        n.errors.push(y);
      }
      continue;
    }
    if (o.kind === "parallel") {
      const p = await I(this, Q, Tm).call(this, o, n, r);
      if (p) return p;
      continue;
    }
    i += 1;
    const { entries: s, before: a, after: l } = o.data, u = await I(this, Q, Os).call(this, a, $t.BEFORE_STEP, i);
    if (u) {
      if (g(this, qe) === De.ABORT) return u;
      n.errors.push(u);
      continue;
    }
    if (n.signal.aborted) return I(this, Q, Tt).call(this, n.signal.reason);
    const d = [];
    let f = 0;
    for (const p of s) {
      const y = Hr(p.type);
      if (!y) {
        const w = I(this, Q, rn).call(this, new Error(`TweenTimeline: unknown tween type "${p.type}"`), $t.ENTRY, i, p.type);
        if (g(this, qe) === De.ABORT) return w;
        n.errors.push(w), console.warn(w.error.message);
        continue;
      }
      const E = {
        ...p.opts,
        commit: n.commit,
        startEpochMS: n.startEpochMS + r,
        signal: n.signal
      }, v = E.durationMS ?? 2e3, b = Promise.resolve().then(() => y.execute(p.params, E)).then((w) => w === !1 ? {
        ok: !1,
        failure: I(this, Q, rn).call(this, new Error("Tween entry returned false."), $t.ENTRY, i, p.type)
      } : { ok: !0 }).catch((w) => ({
        ok: !1,
        failure: I(this, Q, rn).call(this, w, $t.ENTRY, i, p.type)
      }));
      p.detach ? n.detachedPromises.push(b) : (d.push(b), f = Math.max(f, v));
    }
    const h = await I(this, Q, Lm).call(this, d, n.signal);
    if (h === null) return I(this, Q, Tt).call(this, n.signal.reason);
    for (const p of h)
      if (!p.ok) {
        if (g(this, qe) === De.ABORT) return p.failure;
        n.errors.push(p.failure), console.warn("TweenTimeline: entry failed:", p.failure.error);
      }
    const m = await I(this, Q, Os).call(this, l, $t.AFTER_STEP, i);
    if (m) {
      if (g(this, qe) === De.ABORT) return m;
      n.errors.push(m);
    }
    if (n.signal.aborted) return I(this, Q, Tt).call(this, n.signal.reason);
    r += f;
  }
  return null;
}, "#executeSegments"), Tm = /* @__PURE__ */ c(async function(e, n, i = 0) {
  const { branches: r, join: o, overflow: s } = e, a = r.length, l = o === "all" ? a : o === "any" ? 1 : o, u = r.map(() => {
    const p = new AbortController();
    return n.signal.aborted ? p.abort(n.signal.reason ?? "parent-aborted") : n.signal.addEventListener("abort", () => {
      p.signal.aborted || p.abort(n.signal.reason ?? "parent-aborted");
    }, { once: !0 }), p;
  });
  let d = 0, f = 0;
  const h = new Array(a).fill(null);
  let m;
  return new Promise((p) => {
    let y = !1;
    const E = /* @__PURE__ */ c(() => {
      if (y) return;
      if (d >= l) {
        y = !0, v(), p(null);
        return;
      }
      const b = a - d - f;
      if (d + b < l) {
        y = !0, v();
        const w = h.filter((T) => T && T.status === Dn.FAILED).map((T) => T), S = I(this, Q, rn).call(this, new Error(`parallel: join target ${l} impossible (${d} completed, ${f} failed)`), $t.PARALLEL);
        g(this, qe) === De.ABORT ? p(S) : (n.errors.push(S), n.errors.push(...w), p(null));
      }
    }, "checkJoin"), v = /* @__PURE__ */ c(() => {
      if (s === "cancel")
        for (let b = 0; b < a; b++)
          !h[b] && !u[b].signal.aborted && u[b].abort("overflow-cancel");
      for (let b = 0; b < a; b++)
        h[b] || n.detachedPromises.push(m[b]);
    }, "applyOverflow");
    if (m = r.map((b, w) => {
      const S = {
        signal: u[w].signal,
        commit: n.commit,
        startEpochMS: n.startEpochMS + i,
        eventBus: n.eventBus,
        // shared
        errors: n.errors,
        // shared
        detachedPromises: n.detachedPromises
        // shared
      };
      return I(this, Q, Zc).call(this, b, S).then((T) => {
        if (T)
          if (T.status === Dn.CANCELLED) {
            if (u[w].signal.aborted) {
              h[w] = T;
              return;
            }
            h[w] = T, f++;
          } else
            h[w] = T, f++;
        else
          h[w] = { status: Dn.COMPLETED }, d++;
        E();
      });
    }), n.signal.aborted) {
      y = !0, p(I(this, Q, Tt).call(this, n.signal.reason));
      return;
    }
    n.signal.addEventListener("abort", () => {
      y || (y = !0, p(I(this, Q, Tt).call(this, n.signal.reason)));
    }, { once: !0 });
  });
}, "#executeParallel"), /**
 * @param {Array<Promise<{ok: boolean, failure?: object}>>} stepPromises
 * @param {AbortSignal} signal
 * @returns {Promise<Array<{ok: boolean, failure?: object}>|null>}
 */
Lm = /* @__PURE__ */ c(function(e, n) {
  return e.length === 0 ? Promise.resolve([]) : n.aborted ? Promise.resolve(null) : new Promise((i, r) => {
    const o = /* @__PURE__ */ c(() => i(null), "onAbort");
    n.addEventListener("abort", o, { once: !0 }), Promise.all(e).then((s) => {
      n.removeEventListener("abort", o), i(s);
    }).catch((s) => {
      n.removeEventListener("abort", o), r(s);
    });
  });
}, "#waitForStep"), Os = /* @__PURE__ */ c(async function(e, n, i) {
  if (!e) return null;
  try {
    return await e(), null;
  } catch (r) {
    const o = I(this, Q, rn).call(this, r, n, i ?? void 0);
    return g(this, qe) === De.CONTINUE && console.warn(`TweenTimeline: hook failure in ${n}:`, r), o;
  }
}, "#runHook"), /** @param {unknown} reason */
Tt = /* @__PURE__ */ c(function(e) {
  let n;
  return typeof e == "string" ? n = e : e instanceof Error && (n = e.message), {
    status: Dn.CANCELLED,
    ...n ? { reason: n } : {}
  };
}, "#cancelledOutcome"), /**
 * @param {unknown} err
 * @param {string} phase
 * @param {number} [stepIndex]
 * @param {string} [entryType]
 */
rn = /* @__PURE__ */ c(function(e, n, i, r) {
  const o = e instanceof Error ? e : new Error(String(e));
  return {
    status: Dn.FAILED,
    error: o,
    phase: n,
    ...typeof i == "number" ? { stepIndex: i } : {},
    ...r ? { entryType: r } : {}
  };
}, "#failedOutcome"), _(wn, mi), c(wn, "TweenTimeline");
let Qs = wn;
function Xu(t) {
  if (!t || typeof t != "object")
    throw new Error("Sequence JSON: data must be an object.");
  if (!Array.isArray(t.timeline))
    throw new Error("Sequence JSON: 'timeline' must be an array.");
  if (t.name != null && typeof t.name != "string")
    throw new Error("Sequence JSON: 'name' must be a string.");
  if (t.errorPolicy != null && t.errorPolicy !== De.ABORT && t.errorPolicy !== De.CONTINUE)
    throw new Error(`Sequence JSON: 'errorPolicy' must be "abort" or "continue".`);
  Im(t.timeline, "timeline", 0);
}
c(Xu, "validateSequenceJSON");
function Im(t, e, n = 0) {
  for (let i = 0; i < t.length; i++) {
    const r = t[i], o = `${e}[${i}]`;
    if (Array.isArray(r)) {
      if (r.length === 0)
        throw new Error(`Sequence JSON: ${o} is an empty step.`);
      for (let s = 0; s < r.length; s++) {
        const a = r[s];
        if (!a || typeof a != "object")
          throw new Error(`Sequence JSON: ${o}[${s}] must be an object.`);
        if (typeof a.type != "string" || !a.type)
          throw new Error(`Sequence JSON: ${o}[${s}].type must be a non-empty string.`);
        if (a.params != null && typeof a.params != "object")
          throw new Error(`Sequence JSON: ${o}[${s}].params must be an object.`);
        if (a.opts != null && typeof a.opts != "object")
          throw new Error(`Sequence JSON: ${o}[${s}].opts must be an object.`);
        if (a.detach != null && typeof a.detach != "boolean")
          throw new Error(`Sequence JSON: ${o}[${s}].detach must be a boolean.`);
      }
      continue;
    }
    if (typeof r != "object")
      throw new Error(`Sequence JSON: ${o} must be a step array or an object.`);
    if (r.delay !== void 0) {
      if (typeof r.delay != "number" || r.delay < 0)
        throw new Error(`Sequence JSON: ${o}.delay must be a non-negative number.`);
      continue;
    }
    if (r.await !== void 0) {
      const s = r.await;
      if (!s || typeof s != "object")
        throw new Error(`Sequence JSON: ${o}.await must be an object.`);
      if (typeof s.event != "string" || !s.event)
        throw new Error(`Sequence JSON: ${o}.await.event must be a non-empty string.`);
      if (s.event === "signal" && (typeof s.name != "string" || !s.name))
        throw new Error(`Sequence JSON: ${o}.await signal requires a non-empty "name".`);
      if (s.event === "keypress" && s.key != null && typeof s.key != "string")
        throw new Error(`Sequence JSON: ${o}.await keypress "key" must be a string.`);
      if (s.timeout != null && (typeof s.timeout != "number" || s.timeout <= 0))
        throw new Error(`Sequence JSON: ${o}.await.timeout must be a positive number.`);
      continue;
    }
    if (r.emit !== void 0) {
      if (typeof r.emit != "string" || !r.emit)
        throw new Error(`Sequence JSON: ${o}.emit must be a non-empty string.`);
      continue;
    }
    if (r.parallel !== void 0) {
      if (n >= 8)
        throw new Error(`Sequence JSON: ${o} exceeds maximum parallel nesting depth of 8.`);
      const s = r.parallel;
      if (!s || typeof s != "object")
        throw new Error(`Sequence JSON: ${o}.parallel must be an object.`);
      if (!Array.isArray(s.branches) || s.branches.length === 0)
        throw new Error(`Sequence JSON: ${o}.parallel.branches must be a non-empty array.`);
      const a = s.join ?? "all";
      if (a !== "all" && a !== "any" && (typeof a != "number" || !Number.isInteger(a) || a < 1 || a > s.branches.length))
        throw new Error(`Sequence JSON: ${o}.parallel.join must be "all", "any", or 1..${s.branches.length}.`);
      const l = s.overflow ?? "detach";
      if (l !== "detach" && l !== "cancel")
        throw new Error(`Sequence JSON: ${o}.parallel.overflow must be "detach" or "cancel".`);
      for (let u = 0; u < s.branches.length; u++) {
        const d = s.branches[u];
        if (!Array.isArray(d))
          throw new Error(`Sequence JSON: ${o}.parallel.branches[${u}] must be an array.`);
        Im(d, `${o}.parallel.branches[${u}]`, n + 1);
      }
      continue;
    }
    throw new Error(`Sequence JSON: ${o} is not a recognized segment (step array, delay, await, emit, or parallel).`);
  }
}
c(Im, "validateSegmentsJSON");
function km(t) {
  Xu(t), Om(t.timeline, "timeline");
}
c(km, "validateSequenceSemantics");
function Om(t, e) {
  for (let n = 0; n < t.length; n++) {
    const i = t[n], r = `${e}[${n}]`;
    if (Array.isArray(i))
      for (let o = 0; o < i.length; o++) {
        const s = i[o];
        try {
          Ev(s.type, s.params ?? {});
        } catch (a) {
          throw new Error(`Sequence JSON: ${r}[${o}] failed semantic validation: ${a.message}`);
        }
      }
    else if (i.parallel)
      for (let o = 0; o < i.parallel.branches.length; o++)
        Om(i.parallel.branches[o], `${r}.parallel.branches[${o}]`);
  }
}
c(Om, "validateSegmentsSemantics");
function Ju(t, e = {}) {
  Xu(t), e.validateSemantics && km(t);
  const n = new Qs();
  return t.name && n.name(t.name), t.errorPolicy && n.errorPolicy(t.errorPolicy), Am(t.timeline, n), n;
}
c(Ju, "compileSequence");
function Am(t, e) {
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
      const i = n.parallel, r = i.branches.map((o) => (s) => Am(o, s));
      e.parallel(r, {
        join: i.join ?? "all",
        overflow: i.overflow ?? "detach"
      });
    }
  }
}
c(Am, "compileSegments");
function Rv(t) {
  Xu(t), km(t);
}
c(Rv, "validate$3");
async function Hv(t, e = {}) {
  return Ju(t, { validateSemantics: !0 }).run({
    broadcast: !1,
    commit: e.commit,
    startEpochMS: e.startEpochMS,
    signal: e.signal
  }).finished;
}
c(Hv, "execute$3");
function qv() {
  en({ type: "sequence", execute: Hv, validate: Rv });
}
c(qv, "registerSequenceTween");
function jv(t) {
  if (t.x == null && t.y == null && t.scale == null)
    throw new Error("camera-pan tween: at least one of 'x', 'y', or 'scale' is required.");
  if (t.x != null && typeof t.x != "number")
    throw new Error("camera-pan tween: 'x' must be a number.");
  if (t.y != null && typeof t.y != "number")
    throw new Error("camera-pan tween: 'y' must be a number.");
  if (t.scale != null && (typeof t.scale != "number" || t.scale <= 0))
    throw new Error("camera-pan tween: 'scale' must be a positive number.");
}
c(jv, "validate$2");
async function Bv(t, e = {}) {
  const {
    durationMS: n = 2e3,
    startEpochMS: i = null,
    signal: r = null
  } = e;
  if (r != null && r.aborted) return !1;
  const o = typeof i == "number" ? Math.max(0, Math.min(n, Date.now() - i)) : 0, s = Math.max(0, n - o), a = { duration: s };
  if (t.x != null && (a.x = t.x), t.y != null && (a.y = t.y), t.scale != null && (a.scale = t.scale), s <= 0)
    return await canvas.animatePan({ ...a, duration: 0 }), !0;
  const l = canvas.animatePan(a);
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
c(Bv, "execute$2");
function Uv() {
  en({ type: "camera-pan", execute: Bv, validate: jv });
}
c(Uv, "registerCameraPanTween");
function Vv(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((i) => !i || typeof i != "string"))
    throw new Error("tile-tint tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (t.toColor == null || typeof t.toColor != "string")
    throw new Error("tile-tint tween: 'toColor' (CSS color string) is required.");
  if (!foundry.utils.Color.fromString(t.toColor).valid)
    throw new Error(`tile-tint tween: invalid target color "${t.toColor}".`);
  if (t.mode && !Mr().includes(t.mode))
    throw new Error(
      `tile-tint tween: unknown mode "${t.mode}". Available: ${Mr().join(", ")}`
    );
}
c(Vv, "validate$1");
async function Gv(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { Color: i } = foundry.utils, { uuid: r, toColor: o, mode: s = "oklch" } = t, a = Array.isArray(r) ? r : [r];
  if (a.length === 0)
    return console.warn("tile-tint tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: l = 2e3,
    easing: u = "easeInOutCosine",
    commit: d = !0,
    startEpochMS: f = null,
    signal: h = null
  } = e, m = vt(u), p = Ku(s), y = i.fromString(o);
  if (!y.valid) throw new Error(`tile-tint tween: invalid target color "${o}".`);
  async function E(b) {
    var R, P;
    if (h != null && h.aborted) return !1;
    const w = await fromUuid(b);
    if (!w) return !1;
    const S = w.object;
    if (!S) return !1;
    const T = ((P = (R = w._source) == null ? void 0 : R.texture) == null ? void 0 : P.tint) ?? "#ffffff", L = i.fromString(T);
    L.valid || console.warn(`tile-tint tween: source tint invalid on ${b}, using white.`);
    const A = L.valid ? L : i.fromString("#ffffff"), M = { t: 0 }, F = `tile-tint-tween:${b}`;
    n.terminateAnimation(F), h && h.addEventListener("abort", () => {
      n.terminateAnimation(F);
    }, { once: !0 });
    const N = typeof f == "number" ? Math.max(0, Math.min(l, Date.now() - f)) : 0, $ = /* @__PURE__ */ c((j) => {
      const q = p(A, y, j);
      w.updateSource({ texture: { tint: q } }), S.refresh();
    }, "applyFrame");
    N > 0 && (M.t = N / l, $(M.t));
    const x = await n.animate(
      [{ parent: M, attribute: "t", to: 1 }],
      {
        name: F,
        duration: l,
        easing: m,
        time: N,
        ontick: /* @__PURE__ */ c(() => $(M.t), "ontick")
      }
    );
    if (x !== !1) {
      if (h != null && h.aborted) return !1;
      w.updateSource({ texture: { tint: y.toHTML() } }), S.refresh();
    }
    if (d && x !== !1 && w.canUserModify(game.user, "update")) {
      if (h != null && h.aborted) return !1;
      w.updateSource({ texture: { tint: A.toHTML() } }), await w.update({ "texture.tint": y.toHTML() });
    }
    return x !== !1;
  }
  return c(E, "animateOne"), (await Promise.all(a.map(E))).every(Boolean);
}
c(Gv, "execute$1");
function Wv() {
  en({ type: "tile-tint", execute: Gv, validate: Vv });
}
c(Wv, "registerTileTintTween");
function zv(t) {
  if ((Array.isArray(t.uuid) ? t.uuid : [t.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("tile-scale tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (typeof t.toScale != "number" || t.toScale <= 0)
    throw new Error("tile-scale tween: 'toScale' must be a positive number.");
  for (const n of ["baseWidth", "baseHeight", "centerX", "centerY"])
    if (typeof t[n] != "number")
      throw new Error(`tile-scale tween: '${n}' (number) is required.`);
}
c(zv, "validate");
async function Yv(t, e = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, toScale: r, baseWidth: o, baseHeight: s, centerX: a, centerY: l } = t, u = Array.isArray(i) ? i : [i];
  if (u.length === 0) return !0;
  const {
    durationMS: d = 2e3,
    easing: f = "easeInOutCosine",
    commit: h = !0,
    startEpochMS: m = null,
    signal: p = null
  } = e, y = vt(f), E = o * r, v = s * r, b = a - E / 2, w = l - v / 2;
  async function S(L) {
    if (p != null && p.aborted) return !1;
    const A = await fromUuid(L);
    if (!A) return !1;
    const M = A.object;
    if (!M) return !1;
    const F = A._source.width, N = A._source.height, $ = A._source.x, x = A._source.y, R = `tile-scale-tween:${L}`;
    n.terminateAnimation(R), p && p.addEventListener("abort", () => {
      n.terminateAnimation(R);
    }, { once: !0 });
    const P = typeof m == "number" ? Math.max(0, Math.min(d, Date.now() - m)) : 0, j = /* @__PURE__ */ c((z) => {
      const Z = F + (E - F) * z, U = N + (v - N) * z, G = $ + (b - $) * z, me = x + (w - x) * z;
      A.updateSource({ width: Z, height: U, x: G, y: me }), M.refresh();
    }, "applyFrame"), q = { t: 0 };
    P > 0 && (q.t = P / d, j(q.t));
    const B = await n.animate(
      [{ parent: q, attribute: "t", to: 1 }],
      {
        name: R,
        duration: d,
        easing: y,
        time: P,
        ontick: /* @__PURE__ */ c(() => j(q.t), "ontick")
      }
    );
    if (B !== !1) {
      if (p != null && p.aborted) return !1;
      A.updateSource({ width: E, height: v, x: b, y: w }), M.refresh();
    }
    if (h && B !== !1 && A.canUserModify(game.user, "update")) {
      if (p != null && p.aborted) return !1;
      A.updateSource({ width: F, height: N, x: $, y: x }), await A.update({ width: E, height: v, x: b, y: w });
    }
    return B !== !1;
  }
  return c(S, "animateOne"), (await Promise.all(u.map(S))).every(Boolean);
}
c(Yv, "execute");
function Kv() {
  en({ type: "tile-scale", execute: Yv, validate: zv });
}
c(Kv, "registerTileScaleTween");
async function Xv(t, e, n = {}) {
  if (!game.user.isGM)
    return ui.notifications.warn("Only the GM can dispatch tweens."), !1;
  const i = Hr(t);
  if (!i)
    throw new Error(`Unknown tween type: "${t}". Registered types: ${Gc().join(", ")}`);
  i.validate(e);
  const { durationMS: r = 2e3, easing: o = "easeInOutCosine", commit: s = !0 } = n, a = Date.now();
  return ks(bm, {
    type: t,
    params: e,
    durationMS: r,
    easing: o,
    startEpochMS: a,
    commit: !1
  }), i.execute(e, { durationMS: r, easing: o, commit: s, startEpochMS: a });
}
c(Xv, "dispatchTween");
function Jv(t) {
  const { type: e, params: n, durationMS: i, easing: r, startEpochMS: o, commit: s } = t ?? {}, a = Hr(e);
  if (!a) {
    console.warn(`[${k}] Received unknown tween type over socket: "${e}"`);
    return;
  }
  a.execute(n, {
    durationMS: i,
    easing: r,
    commit: s ?? !1,
    startEpochMS: o
  });
}
c(Jv, "handleTweenSocketMessage");
Ov();
xv();
_v();
Fv();
qv();
Uv();
Wv();
Kv();
en({ type: "token-prop", execute: ol, validate: rl });
en({ type: "drawing-prop", execute: ol, validate: rl });
en({ type: "sound-prop", execute: ol, validate: rl });
zu(bm, Jv);
zu(vm, Qv);
zu(Vc, Zv);
function Qv(t) {
  const { data: e, startEpochMS: n } = t ?? {};
  if (!e) {
    console.warn(`[${k}] Received empty tween-sequence socket message.`);
    return;
  }
  try {
    Ju(e, { validateSemantics: !0 }).run({ commit: !1, startEpochMS: n, broadcast: !1 });
  } catch (i) {
    console.error(`[${k}] Failed to run received tween sequence:`, i);
  }
}
c(Qv, "handleSequenceSocketMessage");
function Zv(t) {
  const { name: e } = t ?? {};
  e && Sm(e);
}
c(Zv, "handleSequenceCancelMessage");
function ew() {
  Hooks.once("ready", () => {
    wv();
    const t = game.modules.get(k);
    t.api || (t.api = {}), t.api.tween = {
      dispatch: Xv,
      types: Gc,
      Timeline: Qs,
      ErrorPolicy: De,
      compileSequence: Ju,
      cancelTimeline: Sm,
      getTimeline: Pv
    }, console.log(`[${k}] Tween API registered. Types: ${Gc().join(", ")}`);
  });
}
c(ew, "registerTweenHooks");
ew();
const tw = ["tag", "tag-all", "id", "tags-any", "tags-all"], nw = /* @__PURE__ */ new Set(["tags-any", "tags-all"]);
function Qu(t) {
  if (!t || typeof t != "string")
    return { type: "unknown", value: t ?? "" };
  if (t.startsWith("$"))
    return { type: "special", value: t };
  for (const e of tw)
    if (t.startsWith(`${e}:`)) {
      const n = t.slice(e.length + 1), i = nw.has(e) ? n.split(",").map((r) => r.trim()) : n;
      return { type: e, value: i };
    }
  return t.includes(".") ? { type: "uuid", value: t } : { type: "unknown", value: t };
}
c(Qu, "parseSelector");
function iw(t) {
  if (!t) return "";
  const { type: e, value: n } = t;
  if (e === "special" || e === "uuid" || e === "unknown")
    return Array.isArray(n) ? n.join(",") : n ?? "";
  const i = Array.isArray(n) ? n.join(",") : n ?? "";
  return `${e}:${i}`;
}
c(iw, "buildSelector");
function Mm(t, e = "first") {
  return t != null && t.length ? t.length === 1 ? e === "first-all" || e === "all" ? `tag-all:${t[0]}` : `tag:${t[0]}` : e === "any" ? `tags-any:${t.join(",")}` : e === "all" ? `tags-all:${t.join(",")}` : e === "first-all" ? `tags-all:${t.join(",")}` : `tags-any:${t.join(",")}` : "";
}
c(Mm, "buildTagSelector");
function al(t) {
  if (!t) return null;
  if (t.documentName || t._source !== void 0) {
    const e = t.object;
    return e ? { placeable: e, doc: t } : null;
  }
  return t.document ? { placeable: t, doc: t.document } : null;
}
c(al, "normalizePlaceable");
function xm() {
  var t;
  return window.Tagger ?? ((t = game.modules.get("tagger")) == null ? void 0 : t.api) ?? null;
}
c(xm, "getTaggerAPI");
function ll(t, e) {
  if (!t) return null;
  const n = e ?? canvas.scene;
  if (!n) return null;
  const i = Qu(t);
  switch (i.type) {
    case "special":
      return rw(i.value);
    case "tag":
      return Qd(i.value, n);
    case "tag-all":
      return Qd(i.value, n);
    case "id":
      return ow(i.value, n);
    case "tags-any":
      return Zd(i.value, n, !0);
    case "tags-all":
      return Zd(i.value, n, !1);
    case "uuid":
      return sw(i.value);
    default:
      return null;
  }
}
c(ll, "resolveSelector");
function rw(t) {
  var e;
  if (t === "$particles") {
    if (!((e = game.modules.get("fxmaster")) != null && e.active))
      return console.warn(`[${k}] Picker: FXMaster not active, cannot resolve "$particles".`), null;
    const n = canvas.particleeffects;
    return n ? { kind: "particles", documents: [], placeables: [], target: n } : null;
  }
  return null;
}
c(rw, "resolveSpecial");
function Qd(t, e, n) {
  const i = xm();
  if (!i)
    return console.warn(`[${k}] Picker: Tagger not available, cannot resolve tag "${t}".`), null;
  const r = i.getByTag(t, { sceneId: e.id });
  if (!(r != null && r.length)) return null;
  const o = [];
  for (const s of r) {
    const a = al(s);
    a && o.push(a);
  }
  return o.length === 0 ? null : {
    kind: o.length === 1 ? "placeable" : "multi-placeable",
    documents: o.map((s) => s.doc),
    placeables: o
  };
}
c(Qd, "resolveTag");
function ow(t, e) {
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
      const o = al(r);
      if (o)
        return {
          kind: "placeable",
          documents: [o.doc],
          placeables: [o]
        };
    }
  }
  return null;
}
c(ow, "resolveById");
function Zd(t, e, n) {
  const i = xm();
  if (!i)
    return console.warn(`[${k}] Picker: Tagger not available, cannot resolve multi-tag.`), null;
  const r = i.getByTag(t, {
    sceneId: e.id,
    matchAny: n
  });
  if (!(r != null && r.length)) return null;
  const o = [];
  for (const s of r) {
    const a = al(s);
    a && o.push(a);
  }
  return o.length === 0 ? null : {
    kind: o.length === 1 ? "placeable" : "multi-placeable",
    documents: o.map((s) => s.doc),
    placeables: o
  };
}
c(Zd, "resolveMultiTag");
function sw(t) {
  const e = fromUuidSync(t);
  if (!e) return null;
  const n = al(e);
  return n ? {
    kind: "placeable",
    documents: [n.doc],
    placeables: [n]
  } : null;
}
c(sw, "resolveUUID");
function aw(t) {
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
c(aw, "adaptResolved");
function Zs(t) {
  var r;
  const e = /* @__PURE__ */ new Set();
  if (t.segments) {
    if (t.setup) for (const o of Object.keys(t.setup)) e.add(o);
    if (t.landing) for (const o of Object.keys(t.landing)) e.add(o);
    for (const o of Object.values(t.segments)) {
      if (o.setup) for (const s of Object.keys(o.setup)) e.add(s);
      if (o.landing) for (const s of Object.keys(o.landing)) e.add(s);
      o.timeline && tu(o.timeline, e), (r = o.gate) != null && r.target && e.add(o.gate.target);
    }
  } else {
    if (t.setup) for (const o of Object.keys(t.setup)) e.add(o);
    if (t.landing) for (const o of Object.keys(t.landing)) e.add(o);
    t.timeline && tu(t.timeline, e);
  }
  const n = /* @__PURE__ */ new Map(), i = [];
  for (const o of e) {
    const s = ll(o), a = aw(s);
    a ? n.set(o, a) : i.push(o);
  }
  return i.length && console.warn(`[${k}] Cinematic: ${i.length} unresolved target(s): ${i.join(", ")}`), { targets: n, unresolved: i };
}
c(Zs, "resolveAllTargets");
function lw(t, e) {
  if (!t) return {};
  const n = {};
  for (const [i, r] of Object.entries(t)) {
    const o = e.get(i);
    if (o)
      if (o.kind === "particles") {
        if (o.target.destroyed) continue;
        const s = {};
        for (const a of Object.keys(r))
          s[a] = o.target[a];
        n[i] = s;
      } else if (o.kind === "multi-placeable") {
        const s = o.placeables[0];
        if (!(s != null && s.doc)) continue;
        const a = {};
        for (const l of Object.keys(r))
          a[l] = foundry.utils.getProperty(s.doc._source, l);
        n[i] = a;
      } else {
        if (!o.doc) continue;
        const s = {};
        for (const a of Object.keys(r))
          s[a] = foundry.utils.getProperty(o.doc._source, a);
        n[i] = s;
      }
  }
  return n;
}
c(lw, "captureSnapshot");
function cw(t) {
  const e = {};
  function n(i) {
    if (i)
      for (const [r, o] of Object.entries(i))
        e[r] || (e[r] = {}), Object.assign(e[r], o);
  }
  if (c(n, "mergeMap"), t.segments) {
    n(t.setup), n(t.landing);
    for (const i of Object.values(t.segments))
      n(i.setup), n(i.landing), i.timeline && eu(i.timeline, e, n);
  } else
    n(t.setup), n(t.landing), t.timeline && eu(t.timeline, e, n);
  return e;
}
c(cw, "gatherAllStateMaps");
function eu(t, e, n) {
  var i;
  for (const r of t)
    if (!(r.delay != null || r.await != null || r.emit != null) && !(r.transitionTo != null || r.sound != null || r.stopSound != null)) {
      if ((i = r.parallel) != null && i.branches) {
        for (const o of r.parallel.branches)
          eu(o, e, n);
        continue;
      }
      if (n(r.before), n(r.after), r.tweens)
        for (const o of r.tweens)
          o.target && o.attribute && (e[o.target] || (e[o.target] = {}), e[o.target][o.attribute] = "__snapshot__");
    }
}
c(eu, "gatherFromEntries");
function tu(t, e) {
  for (const n of t)
    if (n.delay == null && n.await == null && n.emit == null && n.transitionTo == null && n.sound == null && n.stopSound == null) {
      if (n.parallel) {
        const i = n.parallel;
        if (i.branches)
          for (const r of i.branches)
            tu(r, e);
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
c(tu, "collectSelectorsFromEntries");
const ef = {
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
}, uw = /* @__PURE__ */ new Set([
  "alpha",
  "visible",
  "x",
  "y",
  "scale",
  "rotation"
]);
function xl(t, e, n) {
  const i = {};
  for (const [r, o] of Object.entries(t))
    e.has(r) ? i[r] = o : console.warn(`[${k}] Cinematic: blocked property "${r}" on ${n}.`);
  return i;
}
c(xl, "filterOverrides");
function Pe(t, e) {
  var i, r;
  if (!t) return;
  const n = [];
  for (const [o, s] of Object.entries(t)) {
    const a = e.get(o);
    if (a)
      if (a.kind === "particles") {
        if (a.target.destroyed) continue;
        const l = xl(s, uw, "$particles");
        for (const [u, d] of Object.entries(l))
          a.target[u] = d;
      } else if (a.kind === "multi-placeable")
        for (const { placeable: l, doc: u } of a.placeables) {
          if (!(u != null && u.parent) || !(l != null && l.scene)) continue;
          const d = u.documentName, f = ef[d];
          if (!f) {
            console.warn(`[${k}] Cinematic: no allowlist for document type "${d}" on "${o}", skipping.`);
            continue;
          }
          const h = xl(s, f, `${d} "${o}"`);
          u.updateSource(h), n.push(l);
        }
      else {
        if (!((i = a.doc) != null && i.parent) || !((r = a.placeable) != null && r.scene)) continue;
        const l = a.doc.documentName, u = ef[l];
        if (!u) {
          console.warn(`[${k}] Cinematic: no allowlist for document type "${l}" on "${o}", skipping.`);
          continue;
        }
        const d = xl(s, u, `${l} "${o}"`);
        a.doc.updateSource(d), n.push(a.placeable);
      }
  }
  for (const o of n)
    o.refresh();
}
c(Pe, "applyState");
function dr(t, e) {
  var n;
  if (t)
    for (const i of Object.keys(t)) {
      const r = e.get(i);
      if ((r == null ? void 0 : r.kind) === "placeable" && ((n = r.doc) == null ? void 0 : n.documentName) === "AmbientLight") {
        canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
        return;
      }
      if ((r == null ? void 0 : r.kind) === "multi-placeable") {
        for (const { doc: o } of r.placeables)
          if ((o == null ? void 0 : o.documentName) === "AmbientLight") {
            canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
            return;
          }
      }
    }
}
c(dr, "refreshPerceptionIfNeeded");
const dw = {
  "tile-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "light-color": /* @__PURE__ */ new Set(["uuid", "toColor", "toAlpha", "mode"]),
  "light-state": /* @__PURE__ */ new Set(["uuid", "enabled"]),
  "particles-prop": /* @__PURE__ */ new Set(["attribute", "value"]),
  "camera-pan": /* @__PURE__ */ new Set(["x", "y", "scale"]),
  "token-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "drawing-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "sound-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"])
}, fw = /* @__PURE__ */ new Set(["easing"]), hw = /* @__PURE__ */ new Set(["type", "target"]);
function _m(t, e) {
  const { type: n, target: i, ...r } = t;
  if (!n)
    return console.warn(`[${k}] Cinematic: tween entry missing 'type', skipping.`), null;
  const o = {}, s = {}, a = dw[n];
  if (i === "$particles")
    o.target = "$particles";
  else if (i) {
    const l = e.get(i);
    if (!l) return null;
    l.kind === "multi-placeable" ? o.uuid = l.placeables.map((u) => u.doc.uuid) : o.uuid = l.doc.uuid;
  }
  for (const [l, u] of Object.entries(r))
    hw.has(l) || (fw.has(l) ? s[l] = u : (a != null && a.has(l), o[l] = u));
  return { type: n, params: o, opts: s };
}
c(_m, "compileTween");
const Eo = /* @__PURE__ */ new Map();
let mw = 0;
async function gw(t) {
  var u, d, f, h, m;
  const { id: e, src: n, volume: i = 0.8, loop: r = !1, fadeIn: o } = t;
  if (!n) {
    console.warn(`[${k}] Cinematic sound: missing 'src', skipping.`);
    return;
  }
  const s = e || `__auto_${++mw}`, a = {
    src: n,
    autoplay: !0,
    loop: r,
    volume: i
  };
  let l = null;
  try {
    typeof ((d = (u = foundry == null ? void 0 : foundry.audio) == null ? void 0 : u.AudioHelper) == null ? void 0 : d.play) == "function" ? l = await foundry.audio.AudioHelper.play(a, !1) : typeof ((h = (f = game == null ? void 0 : game.audio) == null ? void 0 : f.constructor) == null ? void 0 : h.play) == "function" ? l = await game.audio.constructor.play(a, !1) : typeof ((m = game == null ? void 0 : game.audio) == null ? void 0 : m.play) == "function" && (l = await game.audio.play(a, !1));
  } catch (p) {
    console.error(`[${k}] Cinematic sound: failed to play "${n}":`, p);
    return;
  }
  if (!l) {
    console.warn(`[${k}] Cinematic sound: audio helper unavailable for "${n}".`);
    return;
  }
  o && o > 0 && l.fade && l.fade(i, { duration: o, from: 0 }), Eo.set(s, { sound: l, config: t }), console.log(`[${k}] Cinematic sound: playing "${n}" as "${s}" (loop=${r}, vol=${i})`);
}
c(gw, "playLocalSound");
function _l(t) {
  var i, r;
  const e = Eo.get(t);
  if (!e) {
    console.warn(`[${k}] Cinematic sound: no active sound with id "${t}".`);
    return;
  }
  const n = e.config.fadeOut;
  try {
    n && n > 0 && e.sound.fade ? e.sound.fade(0, { duration: n }).then(() => {
      var o, s;
      return (s = (o = e.sound).stop) == null ? void 0 : s.call(o);
    }) : (r = (i = e.sound).stop) == null || r.call(i);
  } catch (o) {
    console.warn(`[${k}] Cinematic sound: error stopping "${t}":`, o);
  }
  Eo.delete(t);
}
c(_l, "stopCinematicSound");
function tf() {
  var t, e;
  for (const [n, i] of Eo)
    try {
      (e = (t = i.sound).stop) == null || e.call(t);
    } catch (r) {
      console.warn(`[${k}] Cinematic sound: error stopping "${n}" during cleanup:`, r);
    }
  Eo.clear();
}
c(tf, "stopAllCinematicSounds");
function pw(t, e, n, i = {}) {
  const { skipToStep: r, onStepComplete: o, timelineName: s } = i, a = new n().name(s ?? `cinematic-${canvas.scene.id}`);
  return a.beforeAll(() => {
    var l;
    try {
      Pe(t.setup, e), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    } catch (u) {
      throw console.error(`[${k}] Cinematic: error in beforeAll (setup state) on scene ${(l = canvas.scene) == null ? void 0 : l.id}:`, u), u;
    }
  }), $m(t.timeline, a, e, { skipToStep: r, onStepComplete: o }), { tl: a };
}
c(pw, "buildTimeline");
function Nm(t, e) {
  var n;
  if (t)
    for (const i of t)
      for (const r of i) {
        if (r.before)
          try {
            Pe(r.before, e), dr(r.before, e);
          } catch (o) {
            console.warn(`[${k}] Cinematic: error in skipped parallel before:`, o);
          }
        if (r.after)
          try {
            Pe(r.after, e), dr(r.after, e);
          } catch (o) {
            console.warn(`[${k}] Cinematic: error in skipped parallel after:`, o);
          }
        (n = r.parallel) != null && n.branches && Nm(r.parallel.branches, e);
      }
}
c(Nm, "applyParallelStatesForSkip");
function $m(t, e, n, i = {}) {
  const { skipToStep: r, onStepComplete: o } = i;
  let s = -1;
  for (const a of t) {
    if (a.sound != null) {
      if (r != null && s < r) continue;
      const f = a.sound, { duration: h, loop: m, fireAndForget: p } = f, y = e.step();
      if (y.before(() => {
        gw(f);
      }), h && h > 0)
        if (p) {
          if (m && f.id) {
            const E = f.id, v = h;
            y.before(() => {
              setTimeout(() => _l(E), v);
            });
          }
        } else
          e.delay(h), m && e.step().before(() => {
            _l(f.id);
          });
      continue;
    }
    if (a.stopSound != null) {
      if (r != null && s < r) continue;
      const f = a.stopSound;
      e.step().before(() => {
        _l(f);
      });
      continue;
    }
    if (a.delay != null) {
      if (r != null && s < r) continue;
      e.delay(a.delay);
      continue;
    }
    if (a.await != null) {
      if (r != null && s < r) continue;
      e.await(a.await);
      continue;
    }
    if (a.emit != null) {
      if (r != null && s < r) continue;
      e.emit(a.emit);
      continue;
    }
    if (a.parallel) {
      if (r != null && s < r) {
        Nm(a.parallel.branches, n);
        continue;
      }
      const f = a.parallel, h = f.branches.map((m) => (p) => $m(m, p, n));
      e.parallel(h, {
        join: f.join ?? "all",
        overflow: f.overflow ?? "detach"
      });
      continue;
    }
    if (!a.tweens || !Array.isArray(a.tweens)) {
      console.warn(`[${k}] Cinematic: timeline entry has no tweens array, skipping.`);
      continue;
    }
    if (s++, r != null && s < r) {
      if (a.before)
        try {
          Pe(a.before, n), dr(a.before, n);
        } catch (f) {
          console.warn(`[${k}] Cinematic: error applying skipped step.before:`, f);
        }
      if (a.after)
        try {
          Pe(a.after, n), dr(a.after, n);
        } catch (f) {
          console.warn(`[${k}] Cinematic: error applying skipped step.after:`, f);
        }
      continue;
    }
    const l = s, u = e.step();
    a.before && u.before(() => {
      var f;
      try {
        Pe(a.before, n), dr(a.before, n);
      } catch (h) {
        throw console.error(`[${k}] Cinematic: error in step.before callback on scene ${(f = canvas.scene) == null ? void 0 : f.id}:`, h), h;
      }
    });
    const d = a.duration ?? 500;
    for (const f of a.tweens) {
      const h = _m(f, n);
      h && u.add(h.type, h.params, { ...h.opts, durationMS: d });
    }
    u.after(() => {
      var f;
      try {
        a.after && (Pe(a.after, n), dr(a.after, n)), o == null || o(l);
      } catch (h) {
        throw console.error(`[${k}] Cinematic: error in step.after callback on scene ${(f = canvas.scene) == null ? void 0 : f.id}:`, h), h;
      }
    });
  }
}
c($m, "compileCinematicEntries");
function fr(t, e, n) {
  if (t != null) {
    if (typeof t != "object" || Array.isArray(t)) {
      n.push({ path: e, level: "error", message: `Expected object, got ${Array.isArray(t) ? "array" : typeof t}` });
      return;
    }
    for (const [i, r] of Object.entries(t))
      (typeof r != "object" || r === null || Array.isArray(r)) && n.push({ path: `${e}["${i}"]`, level: "error", message: `Expected property overrides object, got ${Array.isArray(r) ? "array" : typeof r}` });
  }
}
c(fr, "validateStateMap");
function nu(t, e, n, i) {
  var r;
  for (let o = 0; o < t.length; o++) {
    const s = t[o], a = `${e}[${o}]`;
    if (!(s.delay != null || s.await != null || s.emit != null) && !(s.transitionTo != null || s.sound != null || s.stopSound != null)) {
      if ((r = s.parallel) != null && r.branches) {
        for (let l = 0; l < s.parallel.branches.length; l++)
          nu(s.parallel.branches[l], `${a}.parallel.branches[${l}]`, n, i);
        continue;
      }
      if (fr(s.before, `${a}.before`, i), fr(s.after, `${a}.after`, i), s.tweens)
        for (let l = 0; l < s.tweens.length; l++) {
          const u = s.tweens[l], d = `${a}.tweens[${l}]`;
          if (!u.type) {
            i.push({ path: d, level: "error", message: "Missing 'type' field" });
            continue;
          }
          const f = Hr(u.type);
          if (!f) {
            i.push({ path: d, level: "error", message: `Unknown tween type: "${u.type}"` });
            continue;
          }
          if (n)
            try {
              const h = _m(u, n);
              h ? f.validate(h.params) : u.target && i.push({ path: d, level: "warn", message: `Target "${u.target}" could not be resolved for compilation` });
            } catch (h) {
              i.push({ path: d, level: "error", message: h.message });
            }
          n && u.target && !n.has(u.target) && i.push({ path: `${d}.target`, level: "warn", message: `Target "${u.target}" is not resolved` });
        }
    }
  }
}
c(nu, "validateEntries");
function yw(t, e = null) {
  var i;
  const n = [];
  if (!t || typeof t != "object")
    return n.push({ path: "", level: "error", message: "Cinematic data is not an object" }), n;
  if (t.segments) {
    t.entry ? t.segments[t.entry] || n.push({ path: "entry", level: "error", message: `Entry segment "${t.entry}" not found in segments` }) : n.push({ path: "entry", level: "error", message: "Missing 'entry' field" });
    const r = /* @__PURE__ */ new Set();
    let o = t.entry;
    for (; o && typeof o == "string"; ) {
      if (r.has(o)) {
        n.push({ path: `segments.${o}.next`, level: "error", message: `Cycle detected in segment graph at "${o}"` });
        break;
      }
      r.add(o), o = (i = t.segments[o]) == null ? void 0 : i.next;
    }
    for (const [s, a] of Object.entries(t.segments)) {
      const l = `segments.${s}`;
      fr(a.setup, `${l}.setup`, n), fr(a.landing, `${l}.landing`, n), a.timeline && Array.isArray(a.timeline) && nu(a.timeline, `${l}.timeline`, e, n), a.next && typeof a.next == "string" && !t.segments[a.next] && n.push({ path: `${l}.next`, level: "error", message: `Next segment "${a.next}" not found` });
    }
  } else
    fr(t.setup, "setup", n), fr(t.landing, "landing", n), t.timeline && Array.isArray(t.timeline) && nu(t.timeline, "timeline", e, n);
  return n;
}
c(yw, "validateCinematicDeep");
const Nl = 5, nf = /* @__PURE__ */ new Set(["click", "tile-click", "keypress"]);
var de, Ee, tt, je, _t, Zr, iu, Fm, J, Ge, As, Fe, Ft;
const ue = class ue {
  constructor(e = null, { loadedHash: n = null, cinematicName: i = "default", segmentName: r = null } = {}) {
    _(this, J);
    _(this, de);
    _(this, Ee);
    _(this, tt);
    _(this, je);
    var s;
    O(this, de, e ?? ue.empty()), O(this, Ee, i), O(this, je, n);
    const o = (s = g(this, de).cinematics) == null ? void 0 : s[g(this, Ee)];
    O(this, tt, r ?? (o == null ? void 0 : o.entry) ?? "main");
  }
  static empty() {
    return {
      version: Nl,
      cinematics: {
        default: ue.emptyCinematic()
      }
    };
  }
  static emptyCinematic() {
    return {
      trigger: "canvasReady",
      tracking: !0,
      entry: "main",
      segments: {
        main: ue.emptySegment()
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
    var E;
    const { trigger: n, tracking: i, synchronized: r, setup: o, landing: s, timeline: a = [] } = e;
    if (!a.some(
      (v) => {
        var b;
        return v.await != null && nf.has(((b = v.await) == null ? void 0 : b.event) ?? "click");
      }
    )) {
      const v = a.filter((S) => S.transitionTo == null), b = a.find((S) => S.transitionTo != null), w = { timeline: v };
      if (o && Object.keys(o).length && (w.setup = o), s && Object.keys(s).length && (w.landing = s), b) {
        const S = b.transitionTo;
        S.scene && S.cinematic ? w.next = { segment: S.cinematic, scene: S.scene } : S.cinematic;
      }
      return {
        trigger: n,
        tracking: i,
        ...r ? { synchronized: r } : {},
        entry: "main",
        segments: { main: w }
      };
    }
    const u = {};
    let d = [], f = 1, h = null;
    const m = [];
    function p() {
      const v = `segment-${f++}`, b = { timeline: [...d] };
      return h && (b.gate = h), u[v] = b, m.push(v), d = [], h = null, v;
    }
    c(p, "flushSegment");
    for (const v of a)
      if (v.transitionTo == null) {
        if (v.await != null && nf.has(((E = v.await) == null ? void 0 : E.event) ?? "click")) {
          p(), h = { ...v.await }, delete h.event, h = { event: v.await.event ?? "click", ...h };
          continue;
        }
        d.push(v);
      }
    (d.length > 0 || h) && p();
    for (let v = 0; v < m.length - 1; v++)
      u[m[v]].next = m[v + 1];
    m.length > 0 && (o && Object.keys(o).length && (u[m[0]].setup = o), s && Object.keys(s).length && (u[m[m.length - 1]].landing = s));
    const y = a.find((v) => v.transitionTo != null);
    if (y && m.length > 0) {
      const v = y.transitionTo, b = u[m[m.length - 1]];
      v.scene && v.cinematic && (b.next = { segment: v.cinematic, scene: v.scene });
    }
    return {
      trigger: n,
      tracking: i,
      ...r ? { synchronized: r } : {},
      entry: m[0] ?? "main",
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
    for (const o of Object.values(n.segments))
      (i = o.timeline) != null && i.length && (o.timeline = I(r = ue, _t, iu).call(r, o.timeline));
    return n;
  }
  static fromScene(e, n = "default") {
    var s;
    const i = e == null ? void 0 : e.getFlag(k, "cinematic");
    let r = i ? foundry.utils.deepClone(i) : null;
    const o = i ? I(s = ue, _t, Fm).call(s, i) : null;
    if (r && (r.version ?? 1) < 3) {
      const { version: a, ...l } = r;
      r = { version: 3, cinematics: { default: l } };
    }
    if (r && r.version === 3) {
      for (const [a, l] of Object.entries(r.cinematics ?? {}))
        r.cinematics[a] = ue.migrateV3toV4(l);
      r.version = 4;
    }
    if (r && r.version === 4) {
      for (const [a, l] of Object.entries(r.cinematics ?? {}))
        r.cinematics[a] = ue.migrateV4toV5(l);
      r.version = Nl;
    }
    return new ue(r, { loadedHash: o, cinematicName: n });
  }
  /**
   * Check if the scene's cinematic flag has been modified since this state was loaded.
   * @param {object} scene  The Foundry scene document
   * @returns {boolean} true if scene data differs from what was loaded
   */
  isStale(e) {
    if (!g(this, je)) return !1;
    const n = e == null ? void 0 : e.getFlag(k, "cinematic");
    return n ? !foundry.utils.objectsEqual(n, g(this, je)) : !1;
  }
  // ── Read ──────────────────────────────────────────────────────────────
  get data() {
    return g(this, de);
  }
  get trigger() {
    return g(this, J, Ge).trigger;
  }
  get tracking() {
    return g(this, J, Ge).tracking;
  }
  get synchronized() {
    return g(this, J, Ge).synchronized ?? !1;
  }
  get activeCinematicName() {
    return g(this, Ee);
  }
  // ── Segment accessors ────────────────────────────────────────────────
  get segments() {
    return g(this, J, Ge).segments;
  }
  get entry() {
    return g(this, J, Ge).entry;
  }
  get activeSegmentName() {
    return g(this, tt);
  }
  get activeSegment() {
    var e;
    return ((e = g(this, J, Ge).segments) == null ? void 0 : e[g(this, tt)]) ?? null;
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
    return Object.keys(g(this, de).cinematics);
  }
  switchCinematic(e) {
    if (!g(this, de).cinematics[e]) return this;
    const n = g(this, de).cinematics[e];
    return new ue(foundry.utils.deepClone(g(this, de)), {
      loadedHash: g(this, je),
      cinematicName: e,
      segmentName: n.entry ?? "main"
    });
  }
  addCinematic(e) {
    if (!e || g(this, de).cinematics[e]) return this;
    const n = foundry.utils.deepClone(g(this, de));
    return n.cinematics[e] = ue.emptyCinematic(), new ue(n, {
      loadedHash: g(this, je),
      cinematicName: e,
      segmentName: "main"
    });
  }
  removeCinematic(e) {
    if (Object.keys(g(this, de).cinematics).length <= 1) return this;
    if (!g(this, de).cinematics[e]) return this;
    const i = foundry.utils.deepClone(g(this, de));
    delete i.cinematics[e];
    const r = g(this, Ee) === e ? Object.keys(i.cinematics)[0] : g(this, Ee), o = i.cinematics[r];
    return new ue(i, {
      loadedHash: g(this, je),
      cinematicName: r,
      segmentName: (o == null ? void 0 : o.entry) ?? "main"
    });
  }
  renameCinematic(e, n) {
    if (!e || !n || e === n) return this;
    if (!g(this, de).cinematics[e]) return this;
    if (g(this, de).cinematics[n]) return this;
    const i = foundry.utils.deepClone(g(this, de)), r = {};
    for (const [s, a] of Object.entries(i.cinematics))
      r[s === e ? n : s] = a;
    i.cinematics = r;
    const o = g(this, Ee) === e ? n : g(this, Ee);
    return new ue(i, {
      loadedHash: g(this, je),
      cinematicName: o,
      segmentName: g(this, tt)
    });
  }
  // ── Cinematic-level mutations ─────────────────────────────────────────
  setTrigger(e) {
    return I(this, J, As).call(this, { trigger: e });
  }
  setTracking(e) {
    return I(this, J, As).call(this, { tracking: e });
  }
  setSynchronized(e) {
    return I(this, J, As).call(this, { synchronized: e });
  }
  // ── Segment-level mutations (setup/landing now live on segments) ──────
  setSetup(e) {
    return I(this, J, Fe).call(this, { setup: e });
  }
  setLanding(e) {
    return I(this, J, Fe).call(this, { landing: e });
  }
  // ── Segment management methods ────────────────────────────────────────
  switchSegment(e) {
    var n;
    return (n = g(this, J, Ge).segments) != null && n[e] ? new ue(foundry.utils.deepClone(g(this, de)), {
      loadedHash: g(this, je),
      cinematicName: g(this, Ee),
      segmentName: e
    }) : this;
  }
  addSegment(e, n = null) {
    var o;
    if (!e || (o = g(this, J, Ge).segments) != null && o[e]) return this;
    const i = foundry.utils.deepClone(g(this, de)), r = i.cinematics[g(this, Ee)];
    if (r.segments[e] = ue.emptySegment(), n && r.segments[n]) {
      const s = r.segments[n].next;
      r.segments[n].next = e, s && (r.segments[e].next = s);
    }
    return new ue(i, {
      loadedHash: g(this, je),
      cinematicName: g(this, Ee),
      segmentName: e
    });
  }
  removeSegment(e) {
    var a, l;
    if (Object.keys(g(this, J, Ge).segments ?? {}).length <= 1) return this;
    if (!((a = g(this, J, Ge).segments) != null && a[e])) return this;
    const i = foundry.utils.deepClone(g(this, de)), r = i.cinematics[g(this, Ee)], o = r.segments[e].next;
    for (const [, u] of Object.entries(r.segments))
      (u.next === e || typeof u.next == "object" && ((l = u.next) == null ? void 0 : l.segment) === e) && (u.next = o ?? void 0, u.next || delete u.next);
    delete r.segments[e], r.entry === e && (r.entry = Object.keys(r.segments)[0]);
    const s = g(this, tt) === e ? r.entry : g(this, tt);
    return new ue(i, {
      loadedHash: g(this, je),
      cinematicName: g(this, Ee),
      segmentName: s
    });
  }
  renameSegment(e, n) {
    var a, l, u;
    if (!e || !n || e === n) return this;
    if (!((a = g(this, J, Ge).segments) != null && a[e])) return this;
    if ((l = g(this, J, Ge).segments) != null && l[n]) return this;
    const i = foundry.utils.deepClone(g(this, de)), r = i.cinematics[g(this, Ee)], o = {};
    for (const [d, f] of Object.entries(r.segments))
      o[d === e ? n : d] = f;
    r.segments = o;
    for (const [, d] of Object.entries(r.segments))
      d.next === e ? d.next = n : typeof d.next == "object" && ((u = d.next) == null ? void 0 : u.segment) === e && (d.next.segment = n);
    r.entry === e && (r.entry = n);
    const s = g(this, tt) === e ? n : g(this, tt);
    return new ue(i, {
      loadedHash: g(this, je),
      cinematicName: g(this, Ee),
      segmentName: s
    });
  }
  setSegmentGate(e) {
    return I(this, J, Fe).call(this, { gate: e ?? void 0 });
  }
  setSegmentNext(e) {
    return I(this, J, Fe).call(this, { next: e ?? void 0 });
  }
  setSegmentSetup(e) {
    return I(this, J, Fe).call(this, { setup: e });
  }
  setSegmentLanding(e) {
    return I(this, J, Fe).call(this, { landing: e });
  }
  listSegmentNames() {
    return Object.keys(g(this, J, Ge).segments ?? {});
  }
  // ── Timeline entry mutations (scoped to active segment) ──────────────
  addStep(e = -1) {
    const n = [...this.activeSegment.timeline], i = { duration: 1e3, tweens: [] };
    return e < 0 || e >= n.length ? n.push(i) : n.splice(e, 0, i), I(this, J, Fe).call(this, { timeline: n });
  }
  addDelay(e = -1, n = 1e3) {
    const i = [...this.activeSegment.timeline], r = { delay: n };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), I(this, J, Fe).call(this, { timeline: i });
  }
  addAwait(e = -1, n = null) {
    return console.warn(`[${k}] CinematicState.addAwait() is deprecated in v4. Use segment gates instead.`), this;
  }
  addEmit(e = -1, n = "") {
    const i = [...this.activeSegment.timeline], r = { emit: n };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), I(this, J, Fe).call(this, { timeline: i });
  }
  addParallel(e = -1) {
    const n = [...this.activeSegment.timeline], i = { parallel: { branches: [[], []], join: "all", overflow: "detach" } };
    return e < 0 || e >= n.length ? n.push(i) : n.splice(e, 0, i), I(this, J, Fe).call(this, { timeline: n });
  }
  addTransitionTo(e = -1, n = null) {
    return console.warn(`[${k}] CinematicState.addTransitionTo() is deprecated in v4. Use segment next edges instead.`), this;
  }
  addSound(e = -1, n = null) {
    const i = [...this.activeSegment.timeline], r = { sound: n ?? { src: "", volume: 0.8, loop: !1, duration: 0, fireAndForget: !1 } };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), I(this, J, Fe).call(this, { timeline: i });
  }
  addStopSound(e = -1, n = "") {
    const i = [...this.activeSegment.timeline], r = { stopSound: n };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), I(this, J, Fe).call(this, { timeline: i });
  }
  moveEntry(e, n) {
    if (e === n) return this;
    const i = [...this.activeSegment.timeline];
    if (e < 0 || e >= i.length) return this;
    if (n < 0 || n >= i.length) return this;
    const [r] = i.splice(e, 1);
    return i.splice(n, 0, r), I(this, J, Fe).call(this, { timeline: i });
  }
  removeEntry(e) {
    const n = [...this.activeSegment.timeline];
    return e < 0 || e >= n.length ? this : (n.splice(e, 1), I(this, J, Fe).call(this, { timeline: n }));
  }
  updateEntry(e, n) {
    const i = this.activeSegment.timeline.map((r, o) => o !== e ? r : { ...foundry.utils.deepClone(r), ...n });
    return I(this, J, Fe).call(this, { timeline: i });
  }
  // ── Tween mutations ──────────────────────────────────────────────────
  addTween(e, n = null) {
    const i = { type: "tile-prop", target: "", attribute: "alpha", value: 1 };
    return I(this, J, Ft).call(this, e, (r) => {
      const o = [...r.tweens ?? [], n ?? i];
      return { ...r, tweens: o };
    });
  }
  updateTween(e, n, i) {
    return I(this, J, Ft).call(this, e, (r) => {
      const o = (r.tweens ?? []).map((s, a) => a !== n ? s : { ...s, ...i });
      return { ...r, tweens: o };
    });
  }
  removeTween(e, n) {
    return I(this, J, Ft).call(this, e, (i) => {
      const r = (i.tweens ?? []).filter((o, s) => s !== n);
      return { ...i, tweens: r };
    });
  }
  updateStepDuration(e, n) {
    return I(this, J, Ft).call(this, e, (i) => ({ ...i, duration: Math.max(0, n) }));
  }
  // ── Parallel branch mutations ────────────────────────────────────────
  addBranch(e) {
    return I(this, J, Ft).call(this, e, (n) => {
      if (!n.parallel) return n;
      const i = [...n.parallel.branches, []];
      return { ...n, parallel: { ...n.parallel, branches: i } };
    });
  }
  removeBranch(e, n) {
    return I(this, J, Ft).call(this, e, (i) => {
      if (!i.parallel) return i;
      const r = i.parallel.branches.filter((o, s) => s !== n);
      return r.length < 1 ? i : { ...i, parallel: { ...i.parallel, branches: r } };
    });
  }
  addBranchEntry(e, n, i = null) {
    const r = { duration: 1e3, tweens: [] };
    return I(this, J, Ft).call(this, e, (o) => {
      if (!o.parallel) return o;
      const s = o.parallel.branches.map((a, l) => l !== n ? a : [...a, i ?? r]);
      return { ...o, parallel: { ...o.parallel, branches: s } };
    });
  }
  removeBranchEntry(e, n, i) {
    return I(this, J, Ft).call(this, e, (r) => {
      if (!r.parallel) return r;
      const o = r.parallel.branches.map((s, a) => a !== n ? s : s.filter((l, u) => u !== i));
      return { ...r, parallel: { ...r.parallel, branches: o } };
    });
  }
  updateBranchEntry(e, n, i, r) {
    return I(this, J, Ft).call(this, e, (o) => {
      if (!o.parallel) return o;
      const s = o.parallel.branches.map((a, l) => l !== n ? a : a.map((u, d) => d !== i ? u : { ...foundry.utils.deepClone(u), ...r }));
      return { ...o, parallel: { ...o.parallel, branches: s } };
    });
  }
  moveBranchEntry(e, n, i, r) {
    return i === r ? this : I(this, J, Ft).call(this, e, (o) => {
      if (!o.parallel) return o;
      const s = o.parallel.branches.map((a, l) => {
        if (l !== n) return a;
        const u = [...a];
        if (i < 0 || i >= u.length || r < 0 || r >= u.length) return a;
        const [d] = u.splice(i, 1);
        return u.splice(r, 0, d), u;
      });
      return { ...o, parallel: { ...o.parallel, branches: s } };
    });
  }
  // ── Persistence ──────────────────────────────────────────────────────
  async save(e) {
    const n = { ...foundry.utils.deepClone(g(this, de)), version: Nl };
    await e.setFlag(k, "cinematic", n);
  }
  /** Returns the active cinematic's data (for validation/export). */
  toJSON() {
    return foundry.utils.deepClone(g(this, J, Ge));
  }
  /** Returns the entire v4 flag structure. */
  toFullJSON() {
    return foundry.utils.deepClone(g(this, de));
  }
};
de = new WeakMap(), Ee = new WeakMap(), tt = new WeakMap(), je = new WeakMap(), _t = new WeakSet(), Zr = /* @__PURE__ */ c(function(e) {
  const { duration: n, detach: i, ...r } = e;
  return r;
}, "#stripTween"), iu = /* @__PURE__ */ c(function(e) {
  var i, r;
  const n = [];
  for (const o of e) {
    if (o.delay != null || o.await != null || o.emit != null || o.transitionTo != null || o.sound != null || o.stopSound != null) {
      n.push(o);
      continue;
    }
    if ((i = o.parallel) != null && i.branches) {
      const l = o.parallel.branches.map(
        (u) => {
          var d;
          return I(d = ue, _t, iu).call(d, u);
        }
      );
      n.push({ ...o, parallel: { ...o.parallel, branches: l } });
      continue;
    }
    if (!((r = o.tweens) != null && r.length)) {
      n.push({ duration: 500, ...o });
      continue;
    }
    const s = [], a = [];
    for (const l of o.tweens)
      l.detach ? a.push(l) : s.push(l);
    if (a.length === 0) {
      const l = Math.max(500, ...o.tweens.map((f) => f.duration ?? 0)), { tweens: u, ...d } = o;
      n.push({
        ...d,
        duration: l,
        tweens: u.map(I(ue, _t, Zr))
      });
    } else if (s.length === 0) {
      const l = Math.max(500, ...a.map((f) => f.duration ?? 0)), { tweens: u, ...d } = o;
      n.push({
        ...d,
        duration: l,
        tweens: a.map(I(ue, _t, Zr))
      });
    } else {
      const l = Math.max(500, ...s.map((h) => h.duration ?? 0)), u = Math.max(500, ...a.map((h) => h.duration ?? 0)), { tweens: d, ...f } = o;
      n.push({
        parallel: {
          branches: [
            [{ ...f, duration: l, tweens: s.map(I(ue, _t, Zr)) }],
            [{ duration: u, tweens: a.map(I(ue, _t, Zr)) }]
          ],
          join: "all",
          overflow: "detach"
        }
      });
    }
  }
  return n;
}, "#migrateTimelineV5"), Fm = /* @__PURE__ */ c(function(e) {
  return foundry.utils.deepClone(e);
}, "#computeHash"), J = new WeakSet(), Ge = /* @__PURE__ */ c(function() {
  return g(this, de).cinematics[g(this, Ee)];
}, "#active"), // ── Internal ─────────────────────────────────────────────────────────
/** Clone the full state with a patch to the active cinematic (cinematic-level props). */
As = /* @__PURE__ */ c(function(e) {
  const n = foundry.utils.deepClone(g(this, de));
  return Object.assign(n.cinematics[g(this, Ee)], e), new ue(n, {
    loadedHash: g(this, je),
    cinematicName: g(this, Ee),
    segmentName: g(this, tt)
  });
}, "#cloneActive"), /** Clone the full state with a patch to the active segment within the active cinematic. */
Fe = /* @__PURE__ */ c(function(e) {
  const n = foundry.utils.deepClone(g(this, de)), i = n.cinematics[g(this, Ee)].segments[g(this, tt)];
  if (!i) return this;
  Object.assign(i, e);
  for (const [r, o] of Object.entries(i))
    o === void 0 && delete i[r];
  return new ue(n, {
    loadedHash: g(this, je),
    cinematicName: g(this, Ee),
    segmentName: g(this, tt)
  });
}, "#cloneActiveSegment"), /** Mutate a single timeline entry within the active segment. */
Ft = /* @__PURE__ */ c(function(e, n) {
  const i = this.activeSegment;
  if (!i || e < 0 || e >= i.timeline.length) return this;
  const r = i.timeline.map((o, s) => s !== e ? o : n(foundry.utils.deepClone(o)));
  return I(this, J, Fe).call(this, { timeline: r });
}, "#mutateEntry"), _(ue, _t), c(ue, "CinematicState");
let hn = ue;
const rf = [
  { value: "tile-prop", label: "Tile Prop" },
  { value: "light-color", label: "Light Color" },
  { value: "light-state", label: "Light State" },
  { value: "particles-prop", label: "Particles Prop" },
  { value: "camera-pan", label: "Camera Pan" },
  { value: "token-prop", label: "Token Prop" },
  { value: "drawing-prop", label: "Drawing Prop" },
  { value: "sound-prop", label: "Sound Prop" }
], Dm = {
  "tile-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y, width, height" },
  "token-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y" },
  "drawing-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y" },
  "sound-prop": { form: "prop", attribute: "volume", value: 0.5, placeholder: "volume, radius" },
  "particles-prop": { form: "particles", attribute: "alpha", value: 1, placeholder: "alpha, rate, speed, size" },
  "camera-pan": { form: "camera", x: 0, y: 0, scale: 1 },
  "light-color": { form: "lightColor", toColor: "#ffffff", toAlpha: "", mode: "oklch" },
  "light-state": { form: "lightState", enabled: !0 }
}, bw = [
  { value: "canvasReady", label: "Canvas Ready" },
  { value: "manual", label: "Manual Only" }
];
function of(t) {
  return t && (t.split("/").pop() || "").replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "-") || "";
}
c(of, "soundIdFromPath");
function sf(t) {
  return t ? new Promise((e) => {
    const n = new Audio(t);
    n.addEventListener("loadedmetadata", () => {
      e(Math.round(n.duration * 1e3));
    }), n.addEventListener("error", () => e(0));
  }) : Promise.resolve(0);
}
c(sf, "loadAudioDurationMs");
const oi = 40, ao = 24, So = 50, af = 50, Ci = 60, Ai = 10, $l = 16, Pm = 40, Rm = 20, vw = 90, lf = 70, cf = 8;
function cl(t) {
  return { stepDuration: Math.max(500, t.duration ?? 500), detachOverflow: 0 };
}
c(cl, "computeStepDurations");
function ww(t) {
  var i;
  const e = ((i = t.parallel) == null ? void 0 : i.branches) ?? [];
  let n = 0;
  for (const r of e) {
    let o = 0;
    for (const s of r)
      s.delay != null ? o += s.delay : s.await != null || s.emit != null || (s.sound != null ? o += s.sound.fireAndForget ? 0 : s.sound.duration ?? 0 : s.stopSound != null || (o += cl(s).stepDuration));
    n = Math.max(n, o);
  }
  return Math.max(500, n);
}
c(ww, "computeParallelDuration");
function Zu(t) {
  return t.reduce((e, n) => n.delay != null ? e + n.delay : n.await != null || n.emit != null || n.transitionTo != null ? e : n.sound != null ? e + (n.sound.fireAndForget ? 0 : n.sound.duration ?? 0) : n.stopSound != null ? e : n.parallel != null ? e + ww(n) : e + cl(n).stepDuration, 0);
}
c(Zu, "computeTotalDuration");
function Ew(t, e) {
  if (t <= 0) return 0.1;
  const n = e / t;
  return Math.max(0.03, Math.min(0.5, n));
}
c(Ew, "computeScale");
function Hm(t) {
  const e = t.tweens ?? [];
  if (e.length === 0) return "Empty";
  const n = e[0], i = (n.target ?? "").replace(/^tag:/, "#"), r = n.attribute ?? "";
  return n.type === "camera-pan" ? "Pan" : r === "alpha" ? `Fade ${i}` : r === "x" || r === "y" ? `Move ${i}` : n.type === "light-color" ? `Light ${i}` : n.type === "sound-prop" ? `Sound ${i}` : i ? `${i}` : "Step";
}
c(Hm, "deriveStepLabel");
function Sw(t, e, n, i, r) {
  var u, d;
  const o = [], s = [], a = [];
  let l = e;
  for (let f = 0; f < t.length; f++) {
    const h = t[f], m = `${i}.${f}`, p = r === m;
    if (h.delay != null) {
      const y = Math.max(Rm, h.delay * n);
      o.push({ type: "delay", leftPx: l, widthPx: y, label: `${h.delay}ms`, entryPath: m, selected: p }), l += y;
    } else if (h.await != null) {
      const y = ((u = h.await) == null ? void 0 : u.event) ?? "click", E = y === "tile-click" ? "fa-hand-pointer" : y === "signal" ? "fa-bolt" : "fa-pause";
      o.push({ type: "await", leftPx: l, widthPx: $l, label: y, entryPath: m, selected: p, isGate: !0, gateIcon: E }), ((d = h.await) == null ? void 0 : d.event) === "signal" && a.push({ signal: h.await.signal, centerPx: l + $l / 2 }), l += $l;
    } else if (h.emit != null)
      o.push({ type: "emit", leftPx: l, widthPx: Ai, label: "emit", entryPath: m, selected: p, isMarker: !0 }), s.push({ signal: h.emit, centerPx: l + Ai / 2 });
    else if (h.sound != null) {
      const y = (h.sound.src || "").split("/").pop() || "Sound", E = h.sound.duration ?? 0;
      if (h.sound.fireAndForget ?? !1)
        o.push({ type: "sound", leftPx: l, widthPx: Ai, label: y, entryPath: m, selected: p, isMarker: !0 });
      else {
        const b = E > 0 ? Math.max(Ci, E * n) : Ci, w = (h.sound.loop ?? !1) && E <= 0;
        o.push({ type: "sound", leftPx: l, widthPx: b, label: y, entryPath: m, selected: p, hasTrailingArrow: w }), l += b;
      }
    } else if (h.stopSound != null)
      o.push({ type: "stopSound", leftPx: l, widthPx: Ai, label: "Stop", entryPath: m, selected: p, isMarker: !0 });
    else {
      const { stepDuration: y } = cl(h), E = Math.max(Pm, y * n), v = Hm(h);
      o.push({ type: "step", leftPx: l, widthPx: E, label: v, entryPath: m, selected: p }), l += E;
    }
  }
  return { blocks: o, width: l - e, emits: s, awaits: a };
}
c(Sw, "computeBranchLane");
function uf(t) {
  return ao + t * oi;
}
c(uf, "laneIndexToY");
function Cw(t, e) {
  const n = [];
  for (const i of t.emits)
    for (const r of t.awaits) {
      if (i.signal !== r.signal) continue;
      const o = i.centerPx, s = uf(i.laneIndex) + oi / 2, a = r.centerPx, l = uf(r.laneIndex) + oi / 2, u = l - s, d = (o + a) / 2, f = s + Math.sign(u || 1) * Math.min(40, Math.abs(u) * 0.5 + 20), h = l - Math.sign(u || 1) * Math.min(40, Math.abs(u) * 0.5 + 20);
      n.push({
        pathD: `M ${o} ${s} C ${d} ${f}, ${d} ${h}, ${a} ${l}`,
        signal: i.signal
      });
    }
  return n;
}
c(Cw, "computeSignalArcs");
function Tw(t, e) {
  const n = [];
  if (t <= 0) return n;
  const i = e * 1e3;
  let r;
  i >= 200 ? r = 500 : i >= 80 ? r = 1e3 : i >= 40 ? r = 2e3 : r = 5e3;
  for (let o = 0; o <= t + r; o += r) {
    const s = o >= 1e3 ? `${(o / 1e3).toFixed(o % 1e3 === 0 ? 0 : 1)}s` : `${o}ms`;
    n.push({ px: So + o * e, label: s });
  }
  return n;
}
c(Tw, "computeTimeMarkers");
function Lw(t) {
  const e = [];
  for (let n = 0; n < t.length - 1; n++) {
    const i = t[n], r = t[n + 1], o = i.leftPx + i.widthPx + (r.leftPx - (i.leftPx + i.widthPx)) / 2, s = ao + oi / 2;
    let a;
    if (i.entryPath === "setup")
      a = 0;
    else {
      if (i.entryPath === "landing")
        continue;
      if (i.entryPath.startsWith("timeline.")) {
        const u = i.entryPath.split(".");
        a = Number(u[1]) + 1;
      } else
        continue;
    }
    const l = r.entryPath === "landing";
    e.push({ leftPx: o, topPx: s, insertIndex: a, lane: "main", isEnd: l });
  }
  return e;
}
c(Lw, "computeInsertionPoints");
function Iw(t, { selectedPath: e, windowWidth: n }) {
  const i = Zu(t), r = n - 70 - 100, o = Ew(i, r), s = [], a = [], l = { emits: [], awaits: [] }, u = [];
  s.push({
    type: "setup",
    leftPx: 0,
    widthPx: So,
    label: "Setup",
    entryPath: "setup",
    selected: e === "setup"
  });
  let d = So;
  for (let b = 0; b < t.length; b++) {
    const w = t[b], S = `timeline.${b}`, T = e === S;
    if (w.delay != null) {
      const L = Math.max(Rm, w.delay * o);
      s.push({
        type: "delay",
        leftPx: d,
        widthPx: L,
        label: `${w.delay}ms`,
        entryPath: S,
        selected: T
      }), d += L;
    } else if (w.emit != null)
      s.push({
        type: "emit",
        leftPx: d,
        widthPx: Ai,
        label: "Emit",
        entryPath: S,
        selected: T,
        isMarker: !0
      }), l.emits.push({
        signal: w.emit,
        centerPx: d + Ai / 2,
        laneIndex: 0
      });
    else if (w.sound != null) {
      const L = (w.sound.src || "").split("/").pop() || "Sound", A = w.sound.duration ?? 0;
      if (w.sound.fireAndForget ?? !1) {
        const F = A > 0 ? Math.max(Ci, A * o) : Ci, N = (w.sound.loop ?? !1) && A <= 0, $ = {
          type: "sound",
          leftPx: d,
          widthPx: F,
          label: L,
          entryPath: S,
          selected: T,
          hasTrailingArrow: N
        };
        let x = !1;
        for (const R of u)
          if (R.rightEdgePx <= d) {
            R.blocks.push($), R.rightEdgePx = d + F, x = !0;
            break;
          }
        x || u.push({
          label: "♫ F&F",
          blocks: [$],
          rightEdgePx: d + F
        });
      } else {
        const F = A > 0 ? Math.max(Ci, A * o) : Ci, N = (w.sound.loop ?? !1) && A <= 0;
        s.push({
          type: "sound",
          leftPx: d,
          widthPx: F,
          label: L,
          entryPath: S,
          selected: T,
          hasTrailingArrow: N
        }), d += F;
      }
    } else if (w.stopSound != null)
      s.push({
        type: "stopSound",
        leftPx: d,
        widthPx: Ai,
        label: "Stop",
        entryPath: S,
        selected: T,
        isMarker: !0
      });
    else if (w.parallel != null) {
      const L = w.parallel.branches ?? [], A = d, M = [];
      let F = 0;
      for (let $ = 0; $ < L.length; $++) {
        const x = `timeline.${b}.parallel.branches.${$}`, { blocks: R, width: P, emits: j, awaits: q } = Sw(L[$], A, o, x, e);
        M.push({ label: `Br ${$ + 1}`, blocks: R }), F = Math.max(F, P);
        const B = a.length * 10 + $ + 1;
        for (const z of j) l.emits.push({ ...z, laneIndex: B });
        for (const z of q) l.awaits.push({ ...z, laneIndex: B });
      }
      const N = Math.max(Ci, F);
      s.push({
        type: "parallel",
        leftPx: A,
        widthPx: N,
        label: `${L.length} br`,
        entryPath: S,
        selected: T
      }), a.push({ parallelEntryIndex: b, startPx: A, lanes: M }), d += N;
    } else {
      const { stepDuration: L } = cl(w), A = Math.max(Pm, L * o), M = Hm(w);
      s.push({
        type: "step",
        leftPx: d,
        widthPx: A,
        label: M,
        entryPath: S,
        selected: T
      }), d += A;
    }
  }
  s.push({
    type: "landing",
    leftPx: d,
    widthPx: af,
    label: "Landing",
    entryPath: "landing",
    selected: e === "landing"
  }), d += af;
  const f = a.flatMap((b) => b.lanes), h = f.length;
  for (const b of u)
    f.push({ label: b.label, blocks: b.blocks });
  const m = Cw(l, f.length), p = [];
  for (let b = 0; b < u.length; b++) {
    const w = h + b;
    for (const S of u[b].blocks) {
      const T = S.leftPx, L = ao + oi, A = ao + (1 + w) * oi + oi / 2;
      p.push({ x: T, y1: L, y2: A });
    }
  }
  const y = Tw(i, o), E = Lw(s), v = ao + (1 + f.length) * oi;
  return {
    mainBlocks: s,
    subLanes: f,
    signalArcs: m,
    fafConnectors: p,
    timeMarkers: y,
    insertionPoints: E,
    totalWidthPx: Math.max(d, 200),
    swimlaneHeightPx: v,
    totalDurationMs: i
  };
}
c(Iw, "computeLanes");
function kw(t) {
  if (t <= 0) return "0s";
  if (t < 1e3) return `${t}ms`;
  const e = t / 1e3;
  return e % 1 === 0 ? `${e}s` : `${e.toFixed(1)}s`;
}
c(kw, "formatDuration");
function Ow(t, e) {
  var m, p, y, E;
  const n = t.segments ?? {}, i = t.entry ?? "main", r = Object.keys(n);
  if (r.length === 0)
    return { nodes: [], edges: [], totalWidthPx: 0 };
  const o = /* @__PURE__ */ new Set(), s = [];
  let a = i;
  for (; a && typeof a == "string" && n[a] && !o.has(a); )
    o.add(a), s.push(a), a = n[a].next;
  for (const v of r)
    o.has(v) || s.push(v);
  const l = [];
  let u = cf;
  for (const v of s) {
    const b = n[v], w = Zu(b.timeline ?? []), S = kw(w), T = v === i, L = v === e, A = !o.has(v), M = vw;
    l.push({
      name: v,
      durationMs: w,
      durationLabel: S,
      isEntry: T,
      isActive: L,
      isOrphan: A,
      leftPx: u,
      widthPx: M,
      hasGate: !!b.gate,
      gateEvent: ((m = b.gate) == null ? void 0 : m.event) ?? null
    }), u += M + lf;
  }
  const d = [], f = new Map(l.map((v) => [v.name, v]));
  for (const v of s) {
    const b = n[v];
    if (!b.next) continue;
    const w = typeof b.next == "string" ? b.next : (p = b.next) == null ? void 0 : p.segment;
    if (!w) continue;
    const S = f.get(v), T = f.get(w);
    if (!S || !T) continue;
    const L = n[w], A = ((y = L == null ? void 0 : L.gate) == null ? void 0 : y.event) ?? null, M = typeof b.next == "object" && ((E = b.next) == null ? void 0 : E.scene);
    d.push({
      fromName: v,
      toName: w,
      gateLabel: A,
      isCrossScene: M,
      fromRightPx: S.leftPx + S.widthPx,
      toLeftPx: T.leftPx
    });
  }
  const h = u - lf + cf;
  return { nodes: l, edges: d, totalWidthPx: h };
}
c(Ow, "computeSegmentGraph");
function fi(t) {
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
c(fi, "parseEntryPath");
function ea(t, e) {
  var i, r, o, s;
  const n = fi(t);
  return n ? n.type === "setup" ? e.setup : n.type === "landing" ? e.landing : n.type === "timeline" ? e.timeline[n.index] : n.type === "branch" ? (s = (o = (r = (i = e.timeline[n.index]) == null ? void 0 : i.parallel) == null ? void 0 : r.branches) == null ? void 0 : o[n.branchIndex]) == null ? void 0 : s[n.branchEntryIndex] : null : null;
}
c(ea, "getEntryAtPath");
function df(t) {
  const e = fi(t);
  return !e || e.type !== "timeline" ? null : e.index;
}
c(df, "getTimelineIndexFromPath");
function Aw(t) {
  var o, s;
  const e = /* @__PURE__ */ new Set(), i = (o = t.data.cinematics) == null ? void 0 : o[t.activeCinematicName];
  if (!i) return 0;
  function r(a) {
    var l;
    for (const u of a ?? []) {
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
    for (const a of Object.values(i.segments)) {
      if (a.setup) for (const l of Object.keys(a.setup)) e.add(l);
      if (a.landing) for (const l of Object.keys(a.landing)) e.add(l);
      (s = a.gate) != null && s.target && e.add(a.gate.target), r(a.timeline);
    }
  else {
    if (i.setup) for (const a of Object.keys(i.setup)) e.add(a);
    if (i.landing) for (const a of Object.keys(i.landing)) e.add(a);
    r(i.timeline);
  }
  return e.size;
}
c(Aw, "countUniqueTargets");
function Mw(t, e) {
  var i, r, o;
  const n = fi(t);
  if (!n) return 0;
  if (n.type === "timeline") {
    let s = 0;
    for (let a = 0; a <= n.index; a++) {
      const l = e.timeline[a];
      l && l.delay == null && l.emit == null && l.parallel == null && l.sound == null && l.stopSound == null && s++;
    }
    return s;
  }
  if (n.type === "branch") {
    const s = ((o = (r = (i = e.timeline[n.index]) == null ? void 0 : i.parallel) == null ? void 0 : r.branches) == null ? void 0 : o[n.branchIndex]) ?? [];
    let a = 0;
    for (let l = 0; l <= n.branchEntryIndex; l++) {
      const u = s[l];
      u && u.delay == null && u.emit == null && u.sound == null && u.stopSound == null && a++;
    }
    return a;
  }
  return 0;
}
c(Mw, "stepNumberForPath");
function xw(t) {
  return {
    isSetup: !0,
    targetCount: Object.keys(t.setup ?? {}).length
  };
}
c(xw, "buildSetupDetail");
function _w(t) {
  return {
    isLanding: !0,
    targetCount: Object.keys(t.landing ?? {}).length
  };
}
c(_w, "buildLandingDetail");
function Nw(t) {
  return { type: "delay", isDelay: !0, delay: t.delay };
}
c(Nw, "buildDelayDetail");
function $w(t) {
  return { type: "emit", isEmit: !0, signal: t.emit };
}
c($w, "buildEmitDetail");
function Fw(t) {
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
c(Fw, "buildSoundDetail");
function Dw(t) {
  return {
    type: "stopSound",
    isStopSound: !0,
    stopSoundId: t.stopSound
  };
}
c(Dw, "buildStopSoundDetail");
function Pw(t, e) {
  var s;
  const n = t.parallel, i = n.join ?? "all", r = n.overflow ?? "detach", o = (n.branches ?? []).map((a, l) => ({
    branchIndex: l,
    label: `Branch ${l + 1}`,
    entries: (a ?? []).map((u, d) => {
      var w, S;
      const f = u.delay != null, h = u.await != null, m = u.emit != null, p = u.sound != null, y = u.stopSound != null, E = !f && !h && !m && !p && !y;
      let v, b;
      return f ? (v = `${u.delay}ms`, b = "delay") : h ? (v = "Await", b = ((w = u.await) == null ? void 0 : w.event) ?? "click") : m ? (v = "Emit", b = u.emit || "(unnamed)") : p ? (v = "Sound", b = (u.sound.src || "").split("/").pop() || "(none)") : y ? (v = "Stop Sound", b = u.stopSound || "(no id)") : (v = "Step", b = `${((S = u.tweens) == null ? void 0 : S.length) ?? 0} tweens`), { branchEntryIndex: d, isDelay: f, isAwait: h, isEmit: m, isSound: p, isStopSound: y, isStep: E, label: v, sub: b };
    })
  }));
  return {
    type: "parallel",
    isParallel: !0,
    branchCount: ((s = n.branches) == null ? void 0 : s.length) ?? 0,
    join: i,
    overflow: r,
    joinIsAll: i === "all",
    joinIsAny: i === "any",
    overflowIsDetach: r === "detach",
    overflowIsCancel: r === "cancel",
    branches: o
  };
}
c(Pw, "buildParallelDetail");
function Rw(t, e, n, i) {
  const r = Yu(), o = (t.tweens ?? []).map((l, u) => {
    const d = `${e}.tweens.${u}`, f = n.has(d), h = l.type ?? "tile-prop", m = rf.find((v) => v.value === h), p = Dm[h], y = (p == null ? void 0 : p.form) ?? "prop", E = l.mode ?? "oklch";
    return {
      tweenIndex: u,
      isExpanded: f,
      type: h,
      typeLabel: (m == null ? void 0 : m.label) ?? l.type ?? "Tile Prop",
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
      colorMode: E,
      colorModeIsOklch: E === "oklch",
      colorModeIsHsl: E === "hsl",
      colorModeIsRgb: E === "rgb",
      // Light-state fields
      enabled: l.enabled ?? !0,
      typeOptions: rf.map((v) => ({
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
  }), s = Object.keys(t.before ?? {}), a = Object.keys(t.after ?? {});
  return {
    type: "step",
    isStep: !0,
    isDelay: !1,
    stepNumber: Mw(e, i),
    stepDuration: t.duration ?? 1e3,
    tweens: o,
    beforeSummary: s.length ? `${s.length} target${s.length !== 1 ? "s" : ""}` : "(none)",
    afterSummary: a.length ? `${a.length} target${a.length !== 1 ? "s" : ""}` : "(none)"
  };
}
c(Rw, "buildStepDetail");
function Hw(t, { state: e, expandedTweens: n }) {
  const i = fi(t);
  if (!i) return null;
  if (i.type === "setup") return xw(e);
  if (i.type === "landing") return _w(e);
  const r = ea(t, e);
  return r ? r.delay != null ? Nw(r) : r.emit != null ? $w(r) : r.sound != null ? Fw(r) : r.stopSound != null ? Dw(r) : r.parallel != null && i.type === "timeline" ? Pw(r) : Rw(r, t, n, e) : null;
}
c(Hw, "buildDetail");
function qw({ state: t, mutate: e }) {
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
          var r, o, s, a;
          const i = n.find("#cinematic-import-json").val();
          try {
            const l = JSON.parse(i);
            if (typeof l != "object" || l === null || Array.isArray(l))
              throw new Error("Expected a JSON object");
            if (l.cinematics)
              e(() => new hn(l));
            else if (l.segments !== void 0) {
              const u = { version: 4, cinematics: { [t.activeCinematicName]: l } };
              e(() => new hn(u, { cinematicName: t.activeCinematicName }));
            } else if (l.timeline !== void 0) {
              const u = { version: 3, cinematics: { [t.activeCinematicName]: l } };
              e(() => new hn(u, { cinematicName: t.activeCinematicName }));
            } else
              throw new Error("Expected v3/v4 wrapper or single cinematic with 'segments' or 'timeline'");
            (o = (r = ui.notifications) == null ? void 0 : r.info) == null || o.call(r, "Cinematic JSON imported.");
          } catch (l) {
            (a = (s = ui.notifications) == null ? void 0 : s.error) == null || a.call(s, `Import failed: ${l.message}`);
          }
        }, "callback")
      },
      cancel: { label: "Cancel" }
    },
    default: "import"
  }).render(!0);
}
c(qw, "showImportDialog");
function ta(t, { state: e, mutate: n }) {
  const i = t === "setup" ? e.setup : e.landing, r = JSON.stringify(i ?? {}, null, 2);
  new Dialog({
    title: `Edit ${t.charAt(0).toUpperCase() + t.slice(1)}`,
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON map of target selector → property overrides:</p>
			<textarea id="cinematic-json-edit" style="width:100%;height:200px;font-family:monospace;font-size:0.8rem">${Xt(r)}</textarea>
		`,
    buttons: {
      save: {
        label: "Apply",
        callback: /* @__PURE__ */ c((o) => {
          var a, l;
          const s = o.find("#cinematic-json-edit").val();
          try {
            const u = JSON.parse(s);
            n(t === "setup" ? (d) => d.setSetup(u) : (d) => d.setLanding(u));
          } catch (u) {
            (l = (a = ui.notifications) == null ? void 0 : a.error) == null || l.call(a, `Invalid JSON: ${u.message}`);
          }
        }, "callback")
      },
      cancel: { label: "Cancel" }
    },
    default: "save"
  }).render(!0);
}
c(ta, "showEditJsonDialog");
function ff(t, { selectedPath: e, state: n, mutate: i }) {
  const r = ea(e, n);
  if (!r || r.delay != null) return;
  const o = r[t] ?? {}, s = JSON.stringify(o, null, 2);
  new Dialog({
    title: `Edit Step ${t.charAt(0).toUpperCase() + t.slice(1)}`,
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON map of target selector → property overrides:</p>
			<textarea id="cinematic-json-edit" style="width:100%;height:200px;font-family:monospace;font-size:0.8rem">${Xt(s)}</textarea>
		`,
    buttons: {
      save: {
        label: "Apply",
        callback: /* @__PURE__ */ c((a) => {
          var u, d;
          const l = a.find("#cinematic-json-edit").val();
          try {
            const f = JSON.parse(l), h = fi(e);
            (h == null ? void 0 : h.type) === "timeline" ? i((m) => m.updateEntry(h.index, { [t]: f })) : (h == null ? void 0 : h.type) === "branch" && i((m) => m.updateBranchEntry(h.index, h.branchIndex, h.branchEntryIndex, { [t]: f }));
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
c(ff, "showEditStepStateDialog");
function jw({ selectedPath: t, state: e, mutate: n }) {
  const i = fi(t);
  if (!i || i.type !== "timeline") return;
  const r = e.timeline[i.index];
  if (!(r != null && r.parallel)) return;
  const o = JSON.stringify(r.parallel.branches ?? [], null, 2);
  new Dialog({
    title: "Edit Parallel Branches",
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON array of branch timelines:</p>
			<textarea id="cinematic-json-edit" style="width:100%;height:250px;font-family:monospace;font-size:0.8rem">${Xt(o)}</textarea>
		`,
    buttons: {
      save: {
        label: "Apply",
        callback: /* @__PURE__ */ c((s) => {
          var l, u;
          const a = s.find("#cinematic-json-edit").val();
          try {
            const d = JSON.parse(a);
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
c(jw, "showEditParallelJsonDialog");
var jf, zn, li, Ms, qm;
const Pt = class Pt extends yt(pt) {
  constructor(n = {}) {
    super(n);
    _(this, li);
    _(this, zn, null);
    O(this, zn, n.scene ?? canvas.scene ?? null);
  }
  async _prepareContext() {
    var r, o, s;
    const n = g(this, li, Ms), i = ((o = n == null ? void 0 : n.getSeenStatus) == null ? void 0 : o.call(n, (r = g(this, zn)) == null ? void 0 : r.id)) ?? [];
    return {
      sceneName: ((s = g(this, zn)) == null ? void 0 : s.name) ?? "No scene",
      users: i.map((a) => ({
        ...a,
        statusLabel: a.seen ? "Seen" : "Not seen",
        statusClass: a.seen ? "cinematic-tracking__status--seen" : "cinematic-tracking__status--unseen"
      })),
      hasAnyTracked: i.some((a) => a.seen)
    };
  }
  _onRender(n, i) {
    super._onRender(n, i), I(this, li, qm).call(this);
  }
};
zn = new WeakMap(), li = new WeakSet(), Ms = /* @__PURE__ */ c(function() {
  var n, i;
  return (i = (n = game.modules.get(k)) == null ? void 0 : n.api) == null ? void 0 : i.cinematic;
}, "#api"), qm = /* @__PURE__ */ c(function() {
  var i, r;
  const n = this.element;
  n instanceof HTMLElement && (n.querySelectorAll("[data-action='reset-user']").forEach((o) => {
    o.addEventListener("click", async () => {
      var l;
      const s = o.dataset.userId;
      if (!s) return;
      const a = g(this, li, Ms);
      a != null && a.resetForUser && (await a.resetForUser((l = g(this, zn)) == null ? void 0 : l.id, s), this.render({ force: !0 }));
    });
  }), (i = n.querySelector("[data-action='reset-all']")) == null || i.addEventListener("click", async () => {
    var s;
    const o = g(this, li, Ms);
    o != null && o.resetForAll && (await o.resetForAll((s = g(this, zn)) == null ? void 0 : s.id), this.render({ force: !0 }));
  }), (r = n.querySelector("[data-action='refresh']")) == null || r.addEventListener("click", () => {
    this.render({ force: !0 });
  }));
}, "#bindEvents"), c(Pt, "CinematicTrackingApplication"), se(Pt, "APP_ID", `${k}-cinematic-tracking`), se(Pt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  ye(Pt, Pt, "DEFAULT_OPTIONS"),
  {
    id: Pt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((jf = ye(Pt, Pt, "DEFAULT_OPTIONS")) == null ? void 0 : jf.classes) ?? [], "eidolon-cinematic-tracking-window", "themed"])
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
)), se(Pt, "PARTS", {
  content: {
    template: `modules/${k}/templates/cinematic-tracking.html`
  }
});
let ru = Pt;
function Bw(t, e) {
  var n, i, r, o, s, a, l, u, d;
  (n = t.querySelector("[data-action='save']")) == null || n.addEventListener("click", () => e.save()), (i = t.querySelector("[data-action='play-preview']")) == null || i.addEventListener("click", () => e.play()), (r = t.querySelector("[data-action='reset-tracking']")) == null || r.addEventListener("click", () => e.resetTracking()), (o = t.querySelector("[data-action='export-json']")) == null || o.addEventListener("click", () => e.exportJSON()), (s = t.querySelector("[data-action='undo']")) == null || s.addEventListener("click", () => e.undo()), (a = t.querySelector("[data-action='redo']")) == null || a.addEventListener("click", () => e.redo()), (l = t.querySelector("[data-action='validate']")) == null || l.addEventListener("click", () => e.validate()), (u = t.querySelector("[data-action='import-json']")) == null || u.addEventListener("click", () => e.importJSON()), (d = t.querySelector("[data-action='open-tracking']")) == null || d.addEventListener("click", () => {
    new ru({ scene: e.scene }).render(!0);
  });
}
c(Bw, "bindToolbarEvents");
function Uw(t, e) {
  var n, i, r, o;
  (n = t.querySelector("[data-action='change-cinematic']")) == null || n.addEventListener("change", (s) => {
    e.flushTweenChanges(), e.switchCinematic(s.target.value);
  }), (i = t.querySelector("[data-action='add-cinematic']")) == null || i.addEventListener("click", () => {
    new Dialog({
      title: "New Cinematic",
      content: '<label style="display:flex;align-items:center;gap:0.5rem"><span>Name:</span><input id="cinematic-new-name" type="text" style="flex:1" placeholder="intro" /></label>',
      buttons: {
        ok: {
          label: "Create",
          callback: /* @__PURE__ */ c((s) => {
            var l, u, d, f, h, m, p;
            const a = (l = s.find("#cinematic-new-name").val()) == null ? void 0 : l.trim();
            if (!a) {
              (d = (u = ui.notifications) == null ? void 0 : u.warn) == null || d.call(u, "Name cannot be empty.");
              return;
            }
            if (/[.\s]/.test(a)) {
              (h = (f = ui.notifications) == null ? void 0 : f.warn) == null || h.call(f, "Name cannot contain dots or spaces.");
              return;
            }
            if (e.state.listCinematicNames().includes(a)) {
              (p = (m = ui.notifications) == null ? void 0 : m.warn) == null || p.call(m, "Name already exists.");
              return;
            }
            e.mutate((y) => y.addCinematic(a));
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
    const a = e.state.activeCinematicName;
    new Dialog({
      title: "Remove Cinematic",
      content: `<p>Remove cinematic "${a}"? This cannot be undone after saving.</p>`,
      buttons: {
        ok: {
          label: "Remove",
          callback: /* @__PURE__ */ c(() => {
            e.setSelectedPath(null), e.mutate((d) => d.removeCinematic(a));
          }, "callback")
        },
        cancel: { label: "Cancel" }
      },
      default: "cancel"
    }).render(!0);
  }), (o = t.querySelector("[data-action='rename-cinematic']")) == null || o.addEventListener("click", () => {
    const s = e.state.activeCinematicName;
    new Dialog({
      title: "Rename Cinematic",
      content: `<label style="display:flex;align-items:center;gap:0.5rem"><span>Name:</span><input id="cinematic-rename" type="text" style="flex:1" value="${Xt(s)}" /></label>`,
      buttons: {
        ok: {
          label: "Rename",
          callback: /* @__PURE__ */ c((a) => {
            var u, d, f, h, m, p, y;
            const l = (u = a.find("#cinematic-rename").val()) == null ? void 0 : u.trim();
            if (!l) {
              (f = (d = ui.notifications) == null ? void 0 : d.warn) == null || f.call(d, "Name cannot be empty.");
              return;
            }
            if (/[.\s]/.test(l)) {
              (m = (h = ui.notifications) == null ? void 0 : h.warn) == null || m.call(h, "Name cannot contain dots or spaces.");
              return;
            }
            if (l !== s) {
              if (e.state.listCinematicNames().includes(l)) {
                (y = (p = ui.notifications) == null ? void 0 : p.warn) == null || y.call(p, "Name already exists.");
                return;
              }
              e.mutate((E) => E.renameCinematic(s, l));
            }
          }, "callback")
        },
        cancel: { label: "Cancel" }
      },
      default: "ok"
    }).render(!0);
  });
}
c(Uw, "bindCinematicSelectorEvents");
function Vw(t, e) {
  t.querySelectorAll("[data-action='select-block']").forEach((i) => {
    i.addEventListener("click", (r) => {
      if (r.target.closest("button")) return;
      const o = i.dataset.entryPath;
      e.setSelectedPath(e.selectedPath === o ? null : o);
    });
  });
  let n = null;
  t.querySelectorAll(".cinematic-editor__lane--main [data-action='select-block']").forEach((i) => {
    const r = i.dataset.entryPath;
    r === "setup" || r === "landing" || (i.addEventListener("dragstart", (o) => {
      n = r, i.classList.add("dragging"), o.dataTransfer.effectAllowed = "move";
    }), i.addEventListener("dragover", (o) => {
      o.preventDefault(), o.dataTransfer.dropEffect = "move";
    }), i.addEventListener("dragenter", (o) => {
      o.preventDefault(), i.classList.add("cinematic-editor__block--drag-over");
    }), i.addEventListener("dragleave", () => {
      i.classList.remove("cinematic-editor__block--drag-over");
    }), i.addEventListener("drop", (o) => {
      o.preventDefault(), i.classList.remove("cinematic-editor__block--drag-over");
      const s = i.dataset.entryPath;
      if (n && n !== s) {
        const a = df(n), l = df(s);
        a != null && l != null && (e.selectedPath === n && e.setSelectedPath(s), e.mutate((u) => u.moveEntry(a, l)));
      }
      n = null;
    }), i.addEventListener("dragend", () => {
      i.classList.remove("dragging"), n = null;
    }));
  }), t.querySelectorAll("[data-action='show-insert-menu']").forEach((i) => {
    i.addEventListener("click", (r) => {
      r.stopPropagation();
      const o = Number(i.dataset.insertIndex), s = i.dataset.lane;
      e.showInsertMenu(i, o, s);
    });
  }), t.querySelectorAll("[data-action='insert-entry']").forEach((i) => {
    i.addEventListener("click", () => {
      if (!e.insertMenuState) return;
      const r = i.dataset.insertType, { insertIndex: o } = e.insertMenuState;
      switch (r) {
        case "step":
          e.mutate((s) => s.addStep(o));
          break;
        case "delay":
          e.mutate((s) => s.addDelay(o));
          break;
        case "emit":
          e.mutate((s) => s.addEmit(o));
          break;
        case "parallel":
          e.mutate((s) => s.addParallel(o));
          break;
        case "sound":
          e.mutate((s) => s.addSound(o));
          break;
        case "stopSound":
          e.mutate((s) => s.addStopSound(o));
          break;
      }
      e.hideInsertMenu();
    });
  }), document.addEventListener("click", (i) => {
    e.insertMenuState && !i.target.closest(".cinematic-editor__insert-menu") && !i.target.closest("[data-action='show-insert-menu']") && e.hideInsertMenu();
  });
}
c(Vw, "bindSwimlaneEvents");
function Gw(t, e) {
  var n, i, r, o, s, a, l, u, d, f, h;
  (n = t.querySelector("[data-action='delete-entry']")) == null || n.addEventListener("click", () => {
    const m = e.parseEntryPath(e.selectedPath);
    m && (m.type === "timeline" ? (e.mutate((p) => p.removeEntry(m.index)), e.setSelectedPath(null)) : m.type === "branch" && (e.mutate((p) => p.removeBranchEntry(m.index, m.branchIndex, m.branchEntryIndex)), e.setSelectedPath(null)));
  }), (i = t.querySelector("[data-action='step-duration']")) == null || i.addEventListener("input", (m) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = Number(m.target.value) || 0;
    p.type === "timeline" ? e.mutate((E) => E.updateStepDuration(p.index, y)) : p.type === "branch" && e.mutate((E) => E.updateBranchEntry(p.index, p.branchIndex, p.branchEntryIndex, { duration: Math.max(0, y) }));
  }), (r = t.querySelector("[data-action='add-tween']")) == null || r.addEventListener("click", () => {
    const m = e.parseEntryPath(e.selectedPath);
    if (m) {
      if (m.type === "timeline")
        e.mutate((p) => p.addTween(m.index));
      else if (m.type === "branch") {
        const p = e.getEntryAtPath(e.selectedPath);
        if (!p) return;
        const y = { type: "tile-prop", target: "", attribute: "alpha", value: 1 }, E = [...p.tweens ?? [], y];
        e.mutate((v) => v.updateBranchEntry(m.index, m.branchIndex, m.branchEntryIndex, { tweens: E }));
      }
    }
  }), (o = t.querySelector("[data-action='change-delay']")) == null || o.addEventListener("change", (m) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = Number(m.target.value) || 0;
    p.type === "timeline" ? e.mutate((E) => E.updateEntry(p.index, { delay: y })) : p.type === "branch" && e.mutate((E) => E.updateBranchEntry(p.index, p.branchIndex, p.branchEntryIndex, { delay: y }));
  }), (s = t.querySelector("[data-action='edit-setup']")) == null || s.addEventListener("click", () => {
    ta("setup", { state: e.state, mutate: e.mutate });
  }), (a = t.querySelector("[data-action='edit-landing']")) == null || a.addEventListener("click", () => {
    ta("landing", { state: e.state, mutate: e.mutate });
  }), (l = t.querySelector("[data-action='edit-before']")) == null || l.addEventListener("click", () => {
    ff("before", { selectedPath: e.selectedPath, state: e.state, mutate: e.mutate });
  }), (u = t.querySelector("[data-action='edit-after']")) == null || u.addEventListener("click", () => {
    ff("after", { selectedPath: e.selectedPath, state: e.state, mutate: e.mutate });
  }), (d = t.querySelector("[data-action='change-trigger']")) == null || d.addEventListener("change", (m) => {
    e.mutate((p) => p.setTrigger(m.target.value));
  }), (f = t.querySelector("[data-action='change-tracking']")) == null || f.addEventListener("change", (m) => {
    e.mutate((p) => p.setTracking(m.target.checked));
  }), (h = t.querySelector("[data-action='change-synchronized']")) == null || h.addEventListener("change", (m) => {
    e.mutate((p) => p.setSynchronized(m.target.checked));
  });
}
c(Gw, "bindDetailPanelEvents");
const xr = /* @__PURE__ */ new WeakMap(), na = /* @__PURE__ */ new Set(), ia = /* @__PURE__ */ new Set(), hf = {
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
function ra(t, e = {}) {
  var p, y, E;
  if (!t) return !1;
  _r(t);
  const n = e.mode ?? (e.color != null ? "custom" : "hover"), i = hf[n] ?? hf.hover, r = e.color ?? i.borderColor, o = e.alpha ?? i.borderAlpha, s = e.color ?? i.spriteTint, a = i.spriteAlpha, l = e.pulse ?? i.pulse, u = { border: null, sprite: null, pulseData: null, mode: n }, d = ((p = t.document) == null ? void 0 : p.width) ?? t.w ?? 100, f = ((y = t.document) == null ? void 0 : y.height) ?? t.h ?? 100, h = new PIXI.Graphics();
  h.lineStyle(i.borderWidth, r, o), h.drawRect(0, 0, d, f), t.addChild(h), u.border = h;
  const m = Ww(t, s, a);
  if (m && (canvas.controls.debug.addChild(m), ia.add(m), u.sprite = m), l && ((E = canvas.app) != null && E.ticker)) {
    const v = {
      elapsed: 0,
      fn: /* @__PURE__ */ c((b) => {
        v.elapsed += b;
        const w = (Math.sin(v.elapsed * 0.05) + 1) / 2;
        u.border && (u.border.alpha = o * (0.4 + 0.6 * w)), u.sprite && (u.sprite.alpha = a * (0.5 + 0.5 * w));
      }, "fn")
    };
    canvas.app.ticker.add(v.fn), u.pulseData = v, na.add(v);
  }
  return xr.set(t, u), !0;
}
c(ra, "addHighlight");
function _r(t) {
  var n, i;
  if (!t) return;
  const e = xr.get(t);
  e && (e.pulseData && ((i = (n = canvas.app) == null ? void 0 : n.ticker) == null || i.remove(e.pulseData.fn), na.delete(e.pulseData)), e.border && (e.border.parent && e.border.parent.removeChild(e.border), e.border.destroy({ children: !0 })), e.sprite && (e.sprite.parent && e.sprite.parent.removeChild(e.sprite), e.sprite.destroy({ children: !0 }), ia.delete(e.sprite)), xr.delete(t));
}
c(_r, "removeHighlight");
function jm(t) {
  return xr.has(t);
}
c(jm, "hasHighlight");
function xs() {
  var e, n, i, r, o, s, a;
  for (const l of na)
    (n = (e = canvas.app) == null ? void 0 : e.ticker) == null || n.remove(l.fn);
  na.clear();
  for (const l of ia)
    l.parent && l.parent.removeChild(l), l.destroy({ children: !0 });
  ia.clear();
  const t = [
    (i = canvas.tiles) == null ? void 0 : i.placeables,
    (r = canvas.tokens) == null ? void 0 : r.placeables,
    (o = canvas.lighting) == null ? void 0 : o.placeables,
    (s = canvas.drawings) == null ? void 0 : s.placeables,
    (a = canvas.sounds) == null ? void 0 : a.placeables
  ];
  for (const l of t)
    if (l)
      for (const u of l) {
        const d = xr.get(u);
        d && (d.border && (d.border.parent && d.border.parent.removeChild(d.border), d.border.destroy({ children: !0 })), xr.delete(u));
      }
}
c(xs, "clearAllHighlights");
function Ww(t, e, n) {
  var o;
  const i = t.mesh;
  if (!((o = i == null ? void 0 : i.texture) != null && o.baseTexture)) return null;
  const r = PIXI.Sprite.from(i.texture);
  return r.isSprite = !0, r.anchor.set(i.anchor.x, i.anchor.y), r.width = i.width, r.height = i.height, r.scale = i.scale, r.position = t.center, r.angle = i.angle, r.alpha = n, r.tint = e, r.name = "eidolonPickerHighlight", r;
}
c(Ww, "createTintSprite");
let Ti = null;
function Bm(t) {
  var p, y, E;
  Ti && Ti.cancel();
  const { placeableType: e = "Tile", onPick: n, onCancel: i } = t;
  let r = null;
  const o = `control${e}`, s = `hover${e}`, a = /* @__PURE__ */ c((v, b) => {
    var S;
    if (!b) return;
    const w = v.document ?? v;
    (S = v.release) == null || S.call(v), n(w);
  }, "onControl"), l = /* @__PURE__ */ c((v, b) => {
    b ? (r = v, ra(v, { mode: "pick" })) : r === v && (_r(v), r = null);
  }, "onHoverIn"), u = /* @__PURE__ */ c((v) => {
    v.key === "Escape" && (v.preventDefault(), v.stopPropagation(), m());
  }, "onKeydown"), d = /* @__PURE__ */ c((v) => {
    v.preventDefault(), m();
  }, "onContextMenu"), f = Hooks.on(o, a), h = Hooks.on(s, l);
  document.addEventListener("keydown", u, { capture: !0 }), (p = canvas.stage) == null || p.addEventListener("rightclick", d), (E = (y = ui.notifications) == null ? void 0 : y.info) == null || E.call(y, `Pick mode active — click a ${e.toLowerCase()} on the canvas, or press ESC to cancel.`, { permanent: !1 });
  function m() {
    var v;
    Ti && (Ti = null, Hooks.off(o, f), Hooks.off(s, h), document.removeEventListener("keydown", u, { capture: !0 }), (v = canvas.stage) == null || v.removeEventListener("rightclick", d), r && (_r(r), r = null), i == null || i());
  }
  return c(m, "cancel"), Ti = { cancel: m }, { cancel: m };
}
c(Bm, "enterPickMode");
function eo() {
  Ti && Ti.cancel();
}
c(eo, "cancelPickMode");
const zw = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cancelPickMode: eo,
  enterPickMode: Bm
}, Symbol.toStringTag, { value: "Module" }));
var Bf, Be, nt, Uo, Yn, Vo, Go, dt, Kn, ve, Um, ou, Vm, Gm, Wm, su, au, zm, Ym;
const Lt = class Lt extends yt(pt) {
  /**
   * @param {object} options
   * @param {string[]} [options.selections]  Initial selections
   * @param {string} [options.placeableType]  "Tile", "Token", etc.
   * @param {(selectors: string[]) => void} [options.onApply]
   * @param {() => void} [options.onCancel]
   */
  constructor(n = {}) {
    super(n);
    _(this, ve);
    /** @type {string[]} Current selections (selector strings). */
    _(this, Be, []);
    /** @type {boolean} Whether pick mode is active. */
    _(this, nt, !1);
    /** @type {string} Placeable type (Tile, Token, etc.). */
    _(this, Uo, "Tile");
    /** @type {string} Current tag match mode. */
    _(this, Yn, "any");
    /** @type {((selectors: string[]) => void) | null} */
    _(this, Vo, null);
    /** @type {(() => void) | null} */
    _(this, Go, null);
    /** @type {Promise resolve function for the open() API. */
    _(this, dt, null);
    /** @type {PlaceableObject | null} Currently hovered tile in the browser. */
    _(this, Kn, null);
    O(this, Be, [...n.selections ?? []]), O(this, Uo, n.placeableType ?? "Tile"), O(this, Vo, n.onApply ?? null), O(this, Go, n.onCancel ?? null);
  }
  // ── Context ───────────────────────────────────────────────────────────
  async _prepareContext() {
    var r;
    const n = I(this, ve, su).call(this), i = (((r = canvas.tiles) == null ? void 0 : r.placeables) ?? []).map((o, s) => {
      var d, f;
      const a = o.document, l = a.id, u = (d = a.texture) != null && d.src ? a.texture.src.split("/").pop().replace(/\.[^.]+$/, "") : `Tile ${s + 1}`;
      return {
        id: l,
        name: u.length > 20 ? u.slice(0, 18) + "..." : u,
        thumbnailSrc: ((f = a.texture) == null ? void 0 : f.src) ?? null,
        selected: n.has(l)
      };
    });
    return {
      selections: g(this, Be),
      selectionCount: g(this, Be).length,
      pickModeActive: g(this, nt),
      tagModeIsAny: g(this, Yn) === "any",
      tagModeIsAll: g(this, Yn) === "all",
      tagPreviewCount: 0,
      tiles: i,
      tileCount: i.length
    };
  }
  // ── Render & Events ───────────────────────────────────────────────────
  _onRender(n, i) {
    super._onRender(n, i), I(this, ve, Um).call(this), I(this, ve, au).call(this);
  }
  async _onClose(n) {
    return g(this, nt) && (eo(), O(this, nt, !1)), xs(), g(this, dt) && (g(this, dt).call(this, null), O(this, dt, null)), super._onClose(n);
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
      const r = new Lt({
        ...n,
        onApply: /* @__PURE__ */ c((o) => i(o), "onApply"),
        onCancel: /* @__PURE__ */ c(() => i(null), "onCancel")
      });
      O(r, dt, i), r.render(!0);
    });
  }
};
Be = new WeakMap(), nt = new WeakMap(), Uo = new WeakMap(), Yn = new WeakMap(), Vo = new WeakMap(), Go = new WeakMap(), dt = new WeakMap(), Kn = new WeakMap(), ve = new WeakSet(), Um = /* @__PURE__ */ c(function() {
  var o, s, a, l;
  const n = this.element;
  if (!(n instanceof HTMLElement)) return;
  const i = n.querySelector("[data-role='tag-input']"), r = n.querySelector("[data-role='tag-mode']");
  r == null || r.addEventListener("change", (u) => {
    O(this, Yn, u.target.value);
  }), i == null || i.addEventListener("input", () => {
    I(this, ve, Vm).call(this, n);
  }), i == null || i.addEventListener("keydown", (u) => {
    u.key === "Enter" && (u.preventDefault(), I(this, ve, ou).call(this, n));
  }), (o = n.querySelector("[data-action='add-tag-selector']")) == null || o.addEventListener("click", () => {
    I(this, ve, ou).call(this, n);
  }), (s = n.querySelector("[data-action='toggle-pick-mode']")) == null || s.addEventListener("click", () => {
    g(this, nt) ? (eo(), O(this, nt, !1)) : (O(this, nt, !0), Bm({
      placeableType: g(this, Uo),
      onPick: /* @__PURE__ */ c((u) => {
        I(this, ve, Gm).call(this, u.id);
      }, "onPick"),
      onCancel: /* @__PURE__ */ c(() => {
        O(this, nt, !1), this.render({ force: !0 });
      }, "onCancel")
    })), this.render({ force: !0 });
  }), n.querySelectorAll("[data-action='toggle-tile']").forEach((u) => {
    u.addEventListener("click", () => {
      const d = u.dataset.docId;
      d && I(this, ve, Wm).call(this, d);
    }), u.addEventListener("mouseenter", () => {
      var h, m;
      const d = u.dataset.docId;
      if (!d) return;
      const f = (m = (h = canvas.tiles) == null ? void 0 : h.placeables) == null ? void 0 : m.find((p) => p.document.id === d);
      f && (O(this, Kn, f), ra(f, { mode: "hover" }));
    }), u.addEventListener("mouseleave", () => {
      g(this, Kn) && (_r(g(this, Kn)), O(this, Kn, null), I(this, ve, au).call(this));
    });
  }), n.querySelectorAll("[data-action='remove-selection']").forEach((u) => {
    u.addEventListener("click", () => {
      const d = Number(u.dataset.selectionIndex);
      Number.isNaN(d) || (g(this, Be).splice(d, 1), this.render({ force: !0 }));
    });
  }), (a = n.querySelector("[data-action='apply']")) == null || a.addEventListener("click", () => {
    I(this, ve, zm).call(this);
  }), (l = n.querySelector("[data-action='cancel']")) == null || l.addEventListener("click", () => {
    I(this, ve, Ym).call(this);
  });
}, "#bindEvents"), // ── Tag helpers ───────────────────────────────────────────────────────
ou = /* @__PURE__ */ c(function(n) {
  var a;
  const i = n.querySelector("[data-role='tag-input']"), r = (a = i == null ? void 0 : i.value) == null ? void 0 : a.trim();
  if (!r) return;
  const o = r.split(",").map((l) => l.trim()).filter(Boolean);
  if (o.length === 0) return;
  const s = Mm(o, g(this, Yn));
  s && !g(this, Be).includes(s) && g(this, Be).push(s), i && (i.value = ""), this.render({ force: !0 });
}, "#addTagSelector"), Vm = /* @__PURE__ */ c(function(n) {
  var f, h;
  const i = n.querySelector("[data-role='tag-input']"), r = n.querySelector("[data-role='tag-preview']");
  if (!i || !r) return;
  const o = i.value.trim();
  if (!o) {
    r.textContent = "";
    return;
  }
  const s = o.split(",").map((m) => m.trim()).filter(Boolean);
  if (s.length === 0) {
    r.textContent = "";
    return;
  }
  const a = window.Tagger ?? ((f = game.modules.get("tagger")) == null ? void 0 : f.api);
  if (!a) {
    r.textContent = "Tagger not available";
    return;
  }
  const l = g(this, Yn) === "any", u = a.getByTag(s, {
    sceneId: (h = canvas.scene) == null ? void 0 : h.id,
    matchAny: l
  }), d = (u == null ? void 0 : u.length) ?? 0;
  r.textContent = `${d} matching placeable(s)`;
}, "#updateTagPreview"), // ── ID selector helpers ──────────────────────────────────────────────
Gm = /* @__PURE__ */ c(function(n) {
  const i = `id:${n}`;
  g(this, Be).includes(i) || (g(this, Be).push(i), this.render({ force: !0 }));
}, "#addIdSelector"), Wm = /* @__PURE__ */ c(function(n) {
  const i = `id:${n}`, r = g(this, Be).indexOf(i);
  r >= 0 ? g(this, Be).splice(r, 1) : g(this, Be).push(i), this.render({ force: !0 });
}, "#toggleIdSelector"), /**
 * Get the set of document IDs that are currently selected across all selector types.
 * Resolves tag/tags-any/tags-all selectors to find matching document IDs.
 * @returns {Set<string>}
 */
su = /* @__PURE__ */ c(function() {
  const n = /* @__PURE__ */ new Set();
  for (const i of g(this, Be)) {
    const r = Qu(i);
    if (r.type === "id") {
      n.add(r.value);
      continue;
    }
    const o = ll(i);
    if (o != null && o.placeables)
      for (const { doc: s } of o.placeables)
        s != null && s.id && n.add(s.id);
  }
  return n;
}, "#getSelectedIds"), // ── Canvas selection highlights ──────────────────────────────────────
/**
 * Maintain "selected" highlights on canvas tiles that are in the selection list.
 * Clears stale highlights and adds missing ones (skipping the hovered tile).
 */
au = /* @__PURE__ */ c(function() {
  var r, o;
  const n = I(this, ve, su).call(this), i = ((r = canvas.tiles) == null ? void 0 : r.placeables) ?? [];
  for (const s of i) {
    const a = (o = s.document) == null ? void 0 : o.id;
    if (!a) continue;
    const l = n.has(a), u = s === g(this, Kn), d = jm(s);
    l && !u && !d ? ra(s, { mode: "selected" }) : !l && d && !u && _r(s);
  }
}, "#refreshSelectionHighlights"), // ── Apply / Cancel ──────────────────────────────────────────────────
zm = /* @__PURE__ */ c(function() {
  var i;
  g(this, nt) && (eo(), O(this, nt, !1)), xs();
  const n = [...g(this, Be)];
  (i = g(this, Vo)) == null || i.call(this, n), g(this, dt) && (g(this, dt).call(this, n), O(this, dt, null)), this.close({ force: !0 });
}, "#doApply"), Ym = /* @__PURE__ */ c(function() {
  var n;
  g(this, nt) && (eo(), O(this, nt, !1)), xs(), (n = g(this, Go)) == null || n.call(this), g(this, dt) && (g(this, dt).call(this, null), O(this, dt, null)), this.close({ force: !0 });
}, "#doCancel"), c(Lt, "PlaceablePickerApplication"), se(Lt, "APP_ID", `${k}-placeable-picker`), se(Lt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  ye(Lt, Lt, "DEFAULT_OPTIONS"),
  {
    id: Lt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Bf = ye(Lt, Lt, "DEFAULT_OPTIONS")) == null ? void 0 : Bf.classes) ?? [], "eidolon-placeable-picker-window", "themed"])
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
)), se(Lt, "PARTS", {
  content: {
    template: `modules/${k}/templates/placeable-picker.html`
  }
});
let oa = Lt;
function Yw(t, e) {
  t.querySelectorAll("[data-action='toggle-tween-card']").forEach((n) => {
    n.addEventListener("click", (i) => {
      if (i.target.closest("[data-action='delete-tween']")) return;
      const r = Number(n.dataset.tweenIndex), o = `${e.selectedPath}.tweens.${r}`;
      e.expandedTweens.has(o) ? e.expandedTweens.delete(o) : e.expandedTweens.add(o), e.render();
    });
  }), t.querySelectorAll("[data-action='pick-target']").forEach((n) => {
    n.addEventListener("click", async () => {
      var u, d;
      const i = Number(n.dataset.tweenIndex), r = e.parseEntryPath(e.selectedPath);
      if (!r || Number.isNaN(i)) return;
      const o = e.getEntryAtPath(e.selectedPath), s = ((d = (u = o == null ? void 0 : o.tweens) == null ? void 0 : u[i]) == null ? void 0 : d.target) ?? "", a = s ? [s] : [], l = await oa.open({ selections: a });
      if (l && l.length > 0) {
        if (r.type === "timeline")
          e.mutate((f) => f.updateTween(r.index, i, { target: l[0] }));
        else if (r.type === "branch") {
          const f = (o.tweens ?? []).map((h, m) => m === i ? { ...h, target: l[0] } : h);
          e.mutate((h) => h.updateBranchEntry(r.index, r.branchIndex, r.branchEntryIndex, { tweens: f }));
        }
      }
    });
  }), t.querySelectorAll("[data-action='delete-tween']").forEach((n) => {
    n.addEventListener("click", () => {
      const i = Number(n.dataset.tweenIndex), r = e.parseEntryPath(e.selectedPath);
      if (!(!r || Number.isNaN(i))) {
        if (r.type === "timeline")
          e.mutate((o) => o.removeTween(r.index, i));
        else if (r.type === "branch") {
          const o = e.getEntryAtPath(e.selectedPath);
          if (!o) return;
          const s = (o.tweens ?? []).filter((a, l) => l !== i);
          e.mutate((a) => a.updateBranchEntry(r.index, r.branchIndex, r.branchEntryIndex, { tweens: s }));
        }
      }
    });
  }), t.querySelectorAll(".cinematic-editor__tween-card-body").forEach((n) => {
    const i = Number(n.dataset.tweenIndex);
    n.querySelectorAll("[data-field]").forEach((r) => {
      const o = r.dataset.field, s = r.tagName === "SELECT" || r.type === "checkbox" ? "change" : "input";
      r.addEventListener(s, () => {
        let a;
        if (r.type === "checkbox" ? a = r.checked : o === "x" || o === "y" || o === "scale" || o === "toAlpha" ? a = r.value.trim() === "" ? "" : Number(r.value) || 0 : o === "value" && !Number.isNaN(Number(r.value)) && r.value.trim() !== "" ? a = Number(r.value) : a = r.value, o === "type") {
          const l = Dm[a], u = { type: a };
          if (l) {
            const d = l.form ?? "prop";
            d === "prop" || d === "particles" ? Object.assign(u, { attribute: l.attribute, value: l.value }) : d === "camera" ? Object.assign(u, { x: l.x, y: l.y, scale: l.scale }) : d === "lightColor" ? Object.assign(u, { toColor: l.toColor, toAlpha: l.toAlpha, mode: l.mode }) : d === "lightState" && Object.assign(u, { enabled: l.enabled });
          }
          e.queueTweenChange(i, u), e.flushTweenChangesImmediate(), e.render();
        } else
          e.queueTweenChange(i, { [o]: a });
      });
    });
  });
}
c(Yw, "bindTweenFieldEvents");
function Kw(t, e) {
  var i, r, o, s, a, l, u, d, f, h;
  function n(m, p, y) {
    m.type === "timeline" ? e.mutate((E) => E.updateEntry(m.index, { sound: y })) : m.type === "branch" && e.mutate((E) => E.updateBranchEntry(m.index, m.branchIndex, m.branchEntryIndex, { sound: y }));
  }
  c(n, "applySoundPatch"), (i = t.querySelector("[data-action='change-sound-src']")) == null || i.addEventListener("change", async (m) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = e.getEntryAtPath(e.selectedPath);
    if (!(y != null && y.sound)) return;
    const E = m.target.value, v = { ...y.sound, src: E };
    v.id || (v.id = of(E));
    const b = await sf(E);
    b > 0 && (v.duration = b), n(p, y, v);
  }), (r = t.querySelector("[data-action='pick-sound-src']")) == null || r.addEventListener("click", () => {
    const m = e.parseEntryPath(e.selectedPath);
    if (!m) return;
    const p = e.getEntryAtPath(e.selectedPath);
    if (!(p != null && p.sound)) return;
    new FilePicker({
      type: "audio",
      current: p.sound.src || "",
      callback: /* @__PURE__ */ c(async (E) => {
        const v = { ...p.sound, src: E };
        v.id || (v.id = of(E));
        const b = await sf(E);
        b > 0 && (v.duration = b), n(m, p, v);
      }, "callback")
    }).render(!0);
  }), (o = t.querySelector("[data-action='change-sound-id']")) == null || o.addEventListener("change", (m) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = e.getEntryAtPath(e.selectedPath);
    y != null && y.sound && n(p, y, { ...y.sound, id: m.target.value || void 0 });
  }), (s = t.querySelector("[data-action='change-sound-volume']")) == null || s.addEventListener("input", (m) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = e.getEntryAtPath(e.selectedPath);
    y != null && y.sound && n(p, y, { ...y.sound, volume: Number(m.target.value) || 0.8 });
  }), (a = t.querySelector("[data-action='change-sound-loop']")) == null || a.addEventListener("change", (m) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = e.getEntryAtPath(e.selectedPath);
    y != null && y.sound && n(p, y, { ...y.sound, loop: m.target.checked });
  }), (l = t.querySelector("[data-action='change-sound-fadein']")) == null || l.addEventListener("change", (m) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = e.getEntryAtPath(e.selectedPath);
    y != null && y.sound && n(p, y, { ...y.sound, fadeIn: Number(m.target.value) || void 0 });
  }), (u = t.querySelector("[data-action='change-sound-fadeout']")) == null || u.addEventListener("change", (m) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = e.getEntryAtPath(e.selectedPath);
    y != null && y.sound && n(p, y, { ...y.sound, fadeOut: Number(m.target.value) || void 0 });
  }), (d = t.querySelector("[data-action='change-sound-duration']")) == null || d.addEventListener("change", (m) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = e.getEntryAtPath(e.selectedPath);
    y != null && y.sound && n(p, y, { ...y.sound, duration: Number(m.target.value) || 0 });
  }), (f = t.querySelector("[data-action='change-sound-fireandforget']")) == null || f.addEventListener("change", (m) => {
    const p = e.parseEntryPath(e.selectedPath);
    if (!p) return;
    const y = e.getEntryAtPath(e.selectedPath);
    y != null && y.sound && n(p, y, { ...y.sound, fireAndForget: m.target.checked });
  }), (h = t.querySelector("[data-action='change-stopsound-id']")) == null || h.addEventListener("change", (m) => {
    const p = e.parseEntryPath(e.selectedPath);
    p && (p.type === "timeline" ? e.mutate((y) => y.updateEntry(p.index, { stopSound: m.target.value })) : p.type === "branch" && e.mutate((y) => y.updateBranchEntry(p.index, p.branchIndex, p.branchEntryIndex, { stopSound: m.target.value })));
  });
}
c(Kw, "bindSoundFieldEvents");
function Xw(t, e) {
  var n, i, r, o, s;
  (n = t.querySelector("[data-action='change-emit-signal']")) == null || n.addEventListener("change", (a) => {
    const l = e.parseEntryPath(e.selectedPath);
    l && l.type === "timeline" && e.mutate((u) => u.updateEntry(l.index, { emit: a.target.value }));
  }), (i = t.querySelector("[data-action='change-parallel-join']")) == null || i.addEventListener("change", (a) => {
    const l = e.parseEntryPath(e.selectedPath);
    if (!l || l.type !== "timeline") return;
    const u = e.state.timeline[l.index];
    u != null && u.parallel && e.mutate((d) => d.updateEntry(l.index, { parallel: { ...u.parallel, join: a.target.value } }));
  }), (r = t.querySelector("[data-action='change-parallel-overflow']")) == null || r.addEventListener("change", (a) => {
    const l = e.parseEntryPath(e.selectedPath);
    if (!l || l.type !== "timeline") return;
    const u = e.state.timeline[l.index];
    u != null && u.parallel && e.mutate((d) => d.updateEntry(l.index, { parallel: { ...u.parallel, overflow: a.target.value } }));
  }), (o = t.querySelector("[data-action='edit-parallel-json']")) == null || o.addEventListener("click", () => {
    jw({ selectedPath: e.selectedPath, state: e.state, mutate: e.mutate });
  }), (s = t.querySelector("[data-action='add-branch']")) == null || s.addEventListener("click", () => {
    const a = e.parseEntryPath(e.selectedPath);
    !a || a.type !== "timeline" || e.mutate((l) => l.addBranch(a.index));
  }), t.querySelectorAll("[data-action='remove-branch']").forEach((a) => {
    a.addEventListener("click", () => {
      const l = Number(a.dataset.branchIndex), u = e.parseEntryPath(e.selectedPath);
      !u || u.type !== "timeline" || Number.isNaN(l) || e.mutate((d) => d.removeBranch(u.index, l));
    });
  }), t.querySelectorAll("[data-action='add-branch-step']").forEach((a) => {
    a.addEventListener("click", () => {
      const l = Number(a.dataset.branchIndex), u = e.parseEntryPath(e.selectedPath);
      !u || u.type !== "timeline" || Number.isNaN(l) || e.mutate((d) => d.addBranchEntry(u.index, l, { tweens: [] }));
    });
  }), t.querySelectorAll("[data-action='add-branch-delay']").forEach((a) => {
    a.addEventListener("click", () => {
      const l = Number(a.dataset.branchIndex), u = e.parseEntryPath(e.selectedPath);
      !u || u.type !== "timeline" || Number.isNaN(l) || e.mutate((d) => d.addBranchEntry(u.index, l, { delay: 1e3 }));
    });
  }), t.querySelectorAll("[data-action='add-branch-sound']").forEach((a) => {
    a.addEventListener("click", () => {
      const l = Number(a.dataset.branchIndex), u = e.parseEntryPath(e.selectedPath);
      !u || u.type !== "timeline" || Number.isNaN(l) || e.mutate((d) => d.addBranchEntry(u.index, l, { sound: { src: "", volume: 0.8, loop: !1, duration: 0, fireAndForget: !1 } }));
    });
  }), t.querySelectorAll("[data-action='add-branch-stopSound']").forEach((a) => {
    a.addEventListener("click", () => {
      const l = Number(a.dataset.branchIndex), u = e.parseEntryPath(e.selectedPath);
      !u || u.type !== "timeline" || Number.isNaN(l) || e.mutate((d) => d.addBranchEntry(u.index, l, { stopSound: "" }));
    });
  }), t.querySelectorAll("[data-action='remove-branch-entry']").forEach((a) => {
    a.addEventListener("click", () => {
      const l = Number(a.dataset.branchIndex), u = Number(a.dataset.branchEntryIndex), d = e.parseEntryPath(e.selectedPath);
      !d || d.type !== "timeline" || Number.isNaN(l) || Number.isNaN(u) || e.mutate((f) => f.removeBranchEntry(d.index, l, u));
    });
  });
}
c(Xw, "bindSpecialEntryEvents");
function Jw(t, e) {
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
            callback: /* @__PURE__ */ c((o) => {
              var s;
              return r((s = o.find("#seg-name").val()) == null ? void 0 : s.trim());
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
      const o = await new Promise((s) => {
        new Dialog({
          title: "Rename Segment",
          content: `<label style="font-size:0.82rem">New name:<input type="text" id="seg-name" value="${r}" style="width:100%;margin-top:0.3rem" /></label>`,
          buttons: {
            ok: {
              label: "Rename",
              callback: /* @__PURE__ */ c((a) => {
                var l;
                return s((l = a.find("#seg-name").val()) == null ? void 0 : l.trim());
              }, "callback")
            },
            cancel: { label: "Cancel", callback: /* @__PURE__ */ c(() => s(null), "callback") }
          },
          default: "ok",
          close: /* @__PURE__ */ c(() => s(null), "close")
        }).render(!0);
      });
      o && o !== r && e.renameSegment(r, o);
    });
  });
}
c(Jw, "bindSegmentGraphEvents");
function Qw(t, e) {
  var n, i, r, o, s, a, l;
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
    const { enterPickMode: d } = await Promise.resolve().then(() => zw);
    d({
      placeableType: "Tile",
      onPick: /* @__PURE__ */ c((h) => {
        var y, E;
        const m = (E = (y = h.flags) == null ? void 0 : y.tagger) == null ? void 0 : E.tags, p = m != null && m.length ? `tag:${m[0]}` : `id:${h.id}`;
        e.setSegmentGate({ ...u, target: p });
      }, "onPick")
    });
  });
  for (const [u, d] of [["change-gate-anim-idle", "idle"], ["change-gate-anim-hover", "hover"], ["change-gate-anim-dim", "dim"]])
    (o = t.querySelector(`[data-action='${u}']`)) == null || o.addEventListener("change", (f) => {
      var v;
      const h = (v = e.state.activeSegment) == null ? void 0 : v.gate;
      if (!h) return;
      const m = f.target.value.trim(), p = m ? m.split(",").map((b) => b.trim()).filter(Boolean) : void 0, y = { ...h.animation ?? {} };
      p != null && p.length ? y[d] = p.length === 1 ? p[0] : p : delete y[d];
      const E = { ...h, animation: Object.keys(y).length ? y : void 0 };
      E.animation || delete E.animation, e.setSegmentGate(E);
    });
  (s = t.querySelector("[data-action='change-segment-next']")) == null || s.addEventListener("change", (u) => {
    const d = u.target.value;
    e.setSegmentNext(d || null);
  }), (a = t.querySelector("[data-action='edit-segment-setup']")) == null || a.addEventListener("click", () => {
    ta("setup", { state: e.state, mutate: e.mutate });
  }), (l = t.querySelector("[data-action='edit-segment-landing']")) == null || l.addEventListener("click", () => {
    ta("landing", { state: e.state, mutate: e.mutate });
  });
}
c(Qw, "bindSegmentDetailEvents");
var Uf, it, X, ft, Xn, Bt, ht, rt, Ba, We, mt, Ua, kn, Tr, Mt, Hi, Jn, qi, W, Km, Xm, Jm, Qm, Hn, cu, uu, du, fu, Zm, qn, hu, eg, tg, ng, ig, rg, mu, to;
const Rt = class Rt extends yt(pt) {
  constructor(n = {}) {
    super(n);
    _(this, W);
    _(this, it, null);
    _(this, X, null);
    _(this, ft, null);
    _(this, Xn, /* @__PURE__ */ new Set());
    _(this, Bt, !1);
    _(this, ht, null);
    _(this, rt, null);
    _(this, Ba, 120);
    _(this, We, []);
    _(this, mt, -1);
    _(this, Ua, 50);
    _(this, kn, null);
    _(this, Tr, null);
    _(this, Mt, null);
    _(this, Hi, null);
    _(this, Jn, null);
    _(this, qi, null);
    O(this, it, n.scene ?? canvas.scene ?? null), O(this, X, hn.fromScene(g(this, it)));
  }
  // ── Context ───────────────────────────────────────────────────────────
  async _prepareContext() {
    var m, p;
    const n = Ow(g(this, X), g(this, X).activeSegmentName), i = Iw(g(this, X).timeline, {
      selectedPath: g(this, ft),
      windowWidth: ((m = this.position) == null ? void 0 : m.width) ?? 1100
    }), r = g(this, ft) != null ? Hw(g(this, ft), { state: g(this, X), expandedTweens: g(this, Xn) }) : null, o = g(this, X).listCinematicNames(), s = g(this, X).activeCinematicName, l = g(this, X).listSegmentNames().length > 1, u = g(this, X).activeSegment, d = (u == null ? void 0 : u.gate) ?? null, f = (u == null ? void 0 : u.next) ?? null, h = typeof f == "string" ? f : (f == null ? void 0 : f.segment) ?? null;
    return {
      // Toolbar
      sceneName: ((p = g(this, it)) == null ? void 0 : p.name) ?? "No scene",
      dirty: g(this, Bt),
      canUndo: g(this, W, cu),
      canRedo: g(this, W, uu),
      // Cinematic selector
      cinematicNames: o,
      activeCinematicName: s,
      cinematicOptions: o.map((y) => ({
        value: y,
        label: y,
        selected: y === s
      })),
      hasMultipleCinematics: o.length > 1,
      // Segment graph
      segmentGraph: n,
      activeSegmentName: g(this, X).activeSegmentName,
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
      trigger: g(this, X).trigger,
      tracking: g(this, X).tracking,
      synchronized: g(this, X).synchronized,
      triggerOptions: bw.map((y) => ({
        ...y,
        selected: y.value === g(this, X).trigger
      })),
      entryCount: g(this, X).timeline.length,
      totalDuration: i.totalDurationMs,
      targetCount: Aw(g(this, X)),
      setupCount: Object.keys(g(this, X).setup ?? {}).length,
      landingCount: Object.keys(g(this, X).landing ?? {}).length
    };
  }
  // ── Render & Events ───────────────────────────────────────────────────
  _onRender(n, i) {
    var r, o, s;
    if (super._onRender(n, i), I(this, W, Km).call(this), !g(this, Hi)) {
      const a = (o = (r = game.modules.get(k)) == null ? void 0 : r.api) == null ? void 0 : o.cinematic;
      a != null && a.onPlaybackProgress ? (O(this, Hi, a.onPlaybackProgress((l) => I(this, W, rg).call(this, l))), console.log("[cinematic-editor] Subscribed to playback progress events")) : console.warn("[cinematic-editor] onPlaybackProgress not available on API", a);
    }
    if (g(this, qi) && ((s = this.element) == null || s.querySelectorAll(".cinematic-editor__segment-node").forEach((a) => {
      a.classList.toggle("cinematic-editor__segment-node--playing", a.dataset.segmentName === g(this, qi));
    }), g(this, Mt) && g(this, Mt).segmentName === g(this, X).activeSegmentName)) {
      const a = performance.now() - g(this, Mt).startTime;
      g(this, Mt).durationMs - a > 0 && I(this, W, mu).call(this, g(this, Mt).durationMs, g(this, Mt).startTime);
    }
    g(this, kn) || (O(this, kn, (a) => {
      !a.ctrlKey && !a.metaKey || (a.key === "z" && !a.shiftKey ? (a.preventDefault(), I(this, W, du).call(this)) : (a.key === "z" && a.shiftKey || a.key === "y") && (a.preventDefault(), I(this, W, fu).call(this)));
    }), document.addEventListener("keydown", g(this, kn)));
  }
  async close(n = {}) {
    if (g(this, rt) && I(this, W, qn).call(this), g(this, Bt) && !n.force) {
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
      i === "save" && await I(this, W, hu).call(this);
    }
    return super.close(n);
  }
  async _onClose(n) {
    var i;
    return g(this, ht) !== null && (clearTimeout(g(this, ht)), O(this, ht, null)), g(this, kn) && (document.removeEventListener("keydown", g(this, kn)), O(this, kn, null)), (i = g(this, Hi)) == null || i.call(this), O(this, Hi, null), I(this, W, to).call(this), super._onClose(n);
  }
};
it = new WeakMap(), X = new WeakMap(), ft = new WeakMap(), Xn = new WeakMap(), Bt = new WeakMap(), ht = new WeakMap(), rt = new WeakMap(), Ba = new WeakMap(), We = new WeakMap(), mt = new WeakMap(), Ua = new WeakMap(), kn = new WeakMap(), Tr = new WeakMap(), Mt = new WeakMap(), Hi = new WeakMap(), Jn = new WeakMap(), qi = new WeakMap(), W = new WeakSet(), // ── Event binding ─────────────────────────────────────────────────────
Km = /* @__PURE__ */ c(function() {
  const n = this.element;
  if (!(n instanceof HTMLElement)) return;
  const i = I(this, W, Xm).call(this);
  Bw(n, i), Uw(n, i), Jw(n, i), Vw(n, i), Gw(n, i), Yw(n, i), Kw(n, i), Xw(n, i), Qw(n, i);
}, "#bindEvents"), Xm = /* @__PURE__ */ c(function() {
  const n = this;
  return {
    // State access (read-only getters — closures over `self` for private field access)
    get state() {
      return g(n, X);
    },
    get selectedPath() {
      return g(n, ft);
    },
    get scene() {
      return g(n, it);
    },
    get expandedTweens() {
      return g(n, Xn);
    },
    get insertMenuState() {
      return g(n, Tr);
    },
    // Mutations
    mutate: /* @__PURE__ */ c((i) => I(this, W, Hn).call(this, i), "mutate"),
    setSelectedPath: /* @__PURE__ */ c((i) => {
      O(this, ft, i), this.render({ force: !0 });
    }, "setSelectedPath"),
    render: /* @__PURE__ */ c(() => this.render({ force: !0 }), "render"),
    // Cinematic switching (needs full state swap + clear)
    switchCinematic: /* @__PURE__ */ c((i) => {
      g(this, rt) && I(this, W, qn).call(this), O(this, X, g(this, X).switchCinematic(i)), O(this, ft, null), g(this, Xn).clear(), this.render({ force: !0 });
    }, "switchCinematic"),
    // Segment management
    selectSegment: /* @__PURE__ */ c((i) => {
      g(this, rt) && I(this, W, qn).call(this), O(this, X, g(this, X).switchSegment(i)), O(this, ft, null), g(this, Xn).clear(), this.render({ force: !0 });
    }, "selectSegment"),
    addSegment: /* @__PURE__ */ c((i) => {
      I(this, W, Hn).call(this, (r) => r.addSegment(i, r.activeSegmentName));
    }, "addSegment"),
    removeSegment: /* @__PURE__ */ c((i) => {
      I(this, W, Hn).call(this, (r) => r.removeSegment(i));
    }, "removeSegment"),
    renameSegment: /* @__PURE__ */ c((i, r) => {
      I(this, W, Hn).call(this, (o) => o.renameSegment(i, r));
    }, "renameSegment"),
    setSegmentGate: /* @__PURE__ */ c((i) => {
      I(this, W, Hn).call(this, (r) => r.setSegmentGate(i));
    }, "setSegmentGate"),
    setSegmentNext: /* @__PURE__ */ c((i) => {
      I(this, W, Hn).call(this, (r) => r.setSegmentNext(i));
    }, "setSegmentNext"),
    // Tween debouncing
    queueTweenChange: /* @__PURE__ */ c((i, r) => I(this, W, Zm).call(this, i, r), "queueTweenChange"),
    flushTweenChanges: /* @__PURE__ */ c(() => {
      g(this, rt) && I(this, W, qn).call(this);
    }, "flushTweenChanges"),
    flushTweenChangesImmediate: /* @__PURE__ */ c(() => {
      g(this, ht) !== null && clearTimeout(g(this, ht)), O(this, ht, null), I(this, W, qn).call(this);
    }, "flushTweenChangesImmediate"),
    // Path utilities
    parseEntryPath: fi,
    getEntryAtPath: /* @__PURE__ */ c((i) => ea(i, g(this, X)), "getEntryAtPath"),
    // Insert menu
    showInsertMenu: /* @__PURE__ */ c((i, r, o) => I(this, W, Jm).call(this, i, r, o), "showInsertMenu"),
    hideInsertMenu: /* @__PURE__ */ c(() => I(this, W, Qm).call(this), "hideInsertMenu"),
    // Toolbar actions
    save: /* @__PURE__ */ c(() => I(this, W, hu).call(this), "save"),
    play: /* @__PURE__ */ c(() => I(this, W, eg).call(this), "play"),
    resetTracking: /* @__PURE__ */ c(() => I(this, W, tg).call(this), "resetTracking"),
    exportJSON: /* @__PURE__ */ c(() => I(this, W, ng).call(this), "exportJSON"),
    validate: /* @__PURE__ */ c(() => I(this, W, ig).call(this), "validate"),
    importJSON: /* @__PURE__ */ c(() => qw({ state: g(this, X), mutate: /* @__PURE__ */ c((i) => I(this, W, Hn).call(this, i), "mutate") }), "importJSON"),
    undo: /* @__PURE__ */ c(() => I(this, W, du).call(this), "undo"),
    redo: /* @__PURE__ */ c(() => I(this, W, fu).call(this), "redo")
  };
}, "#createEventContext"), // ── Insert menu ───────────────────────────────────────────────────────
Jm = /* @__PURE__ */ c(function(n, i, r) {
  var l;
  const o = (l = this.element) == null ? void 0 : l.querySelector(".cinematic-editor__insert-menu");
  if (!o) return;
  const s = n.getBoundingClientRect();
  document.body.appendChild(o), o.style.display = "", o.style.position = "fixed", o.style.left = `${s.left}px`;
  const a = o.offsetHeight || 200;
  s.bottom + 4 + a > window.innerHeight ? o.style.top = `${s.top - a - 4}px` : o.style.top = `${s.bottom + 4}px`, O(this, Tr, { insertIndex: i, lane: r });
}, "#showInsertMenu"), Qm = /* @__PURE__ */ c(function() {
  var i, r;
  const n = document.body.querySelector(".cinematic-editor__insert-menu") ?? ((i = this.element) == null ? void 0 : i.querySelector(".cinematic-editor__insert-menu"));
  if (n) {
    n.style.display = "none";
    const o = (r = this.element) == null ? void 0 : r.querySelector(".cinematic-editor");
    o && n.parentNode !== o && o.appendChild(n);
  }
  O(this, Tr, null);
}, "#hideInsertMenu"), // ── State mutation ────────────────────────────────────────────────────
Hn = /* @__PURE__ */ c(function(n) {
  O(this, We, g(this, We).slice(0, g(this, mt) + 1)), g(this, We).push(g(this, X)), g(this, We).length > g(this, Ua) && g(this, We).shift(), O(this, mt, g(this, We).length - 1), O(this, X, n(g(this, X))), O(this, Bt, !0), this.render({ force: !0 });
}, "#mutate"), cu = /* @__PURE__ */ c(function() {
  return g(this, mt) >= 0;
}, "#canUndo"), uu = /* @__PURE__ */ c(function() {
  return g(this, mt) < g(this, We).length - 1;
}, "#canRedo"), du = /* @__PURE__ */ c(function() {
  g(this, W, cu) && (g(this, mt) === g(this, We).length - 1 && g(this, We).push(g(this, X)), O(this, X, g(this, We)[g(this, mt)]), bl(this, mt)._--, O(this, Bt, !0), this.render({ force: !0 }));
}, "#undo"), fu = /* @__PURE__ */ c(function() {
  g(this, W, uu) && (bl(this, mt)._++, O(this, X, g(this, We)[g(this, mt) + 1]), O(this, Bt, !0), this.render({ force: !0 }));
}, "#redo"), Zm = /* @__PURE__ */ c(function(n, i) {
  var r;
  g(this, ft) != null && (O(this, rt, {
    ...g(this, rt) ?? {},
    entryPath: g(this, ft),
    tweenIndex: n,
    patch: { ...((r = g(this, rt)) == null ? void 0 : r.patch) ?? {}, ...i }
  }), g(this, ht) !== null && clearTimeout(g(this, ht)), O(this, ht, setTimeout(() => {
    O(this, ht, null), I(this, W, qn).call(this);
  }, g(this, Ba))));
}, "#queueTweenChange"), qn = /* @__PURE__ */ c(function() {
  if (!g(this, rt)) return;
  const { entryPath: n, tweenIndex: i, patch: r } = g(this, rt);
  O(this, rt, null);
  const o = fi(n);
  if (o) {
    if (o.type === "timeline")
      O(this, X, g(this, X).updateTween(o.index, i, r));
    else if (o.type === "branch") {
      const s = ea(n, g(this, X));
      if (s) {
        const a = (s.tweens ?? []).map((l, u) => u === i ? { ...l, ...r } : l);
        O(this, X, g(this, X).updateBranchEntry(o.index, o.branchIndex, o.branchEntryIndex, { tweens: a }));
      }
    }
    O(this, Bt, !0);
  }
}, "#flushTweenChanges"), hu = /* @__PURE__ */ c(async function() {
  var n, i, r, o, s, a;
  if (g(this, it)) {
    if (g(this, rt) && I(this, W, qn).call(this), g(this, X).isStale(g(this, it))) {
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
        O(this, X, hn.fromScene(g(this, it), g(this, X).activeCinematicName)), O(this, Bt, !1), O(this, We, []), O(this, mt, -1), this.render({ force: !0 }), (i = (n = ui.notifications) == null ? void 0 : n.info) == null || i.call(n, "Cinematic reloaded from scene.");
        return;
      }
      if (!l) return;
    }
    try {
      await g(this, X).save(g(this, it)), O(this, X, hn.fromScene(g(this, it), g(this, X).activeCinematicName)), O(this, Bt, !1), (o = (r = ui.notifications) == null ? void 0 : r.info) == null || o.call(r, "Cinematic saved."), this.render({ force: !0 });
    } catch (l) {
      console.error(`${k} | Cinematic save failed`, l), (a = (s = ui.notifications) == null ? void 0 : s.error) == null || a.call(s, "Failed to save cinematic data.");
    }
  }
}, "#onSave"), eg = /* @__PURE__ */ c(async function() {
  var i, r, o, s, a;
  const n = (r = (i = game.modules.get(k)) == null ? void 0 : i.api) == null ? void 0 : r.cinematic;
  if (!(n != null && n.play)) {
    (s = (o = ui.notifications) == null ? void 0 : o.warn) == null || s.call(o, "Cinematic API not available.");
    return;
  }
  await n.play((a = g(this, it)) == null ? void 0 : a.id, g(this, X).activeCinematicName);
}, "#onPlay"), tg = /* @__PURE__ */ c(async function() {
  var i, r, o, s, a;
  const n = (r = (i = game.modules.get(k)) == null ? void 0 : i.api) == null ? void 0 : r.cinematic;
  n != null && n.reset && (await n.reset((o = g(this, it)) == null ? void 0 : o.id, g(this, X).activeCinematicName), (a = (s = ui.notifications) == null ? void 0 : s.info) == null || a.call(s, "Cinematic tracking reset."));
}, "#onResetTracking"), ng = /* @__PURE__ */ c(async function() {
  var i, r;
  const n = JSON.stringify(g(this, X).toJSON(), null, 2);
  try {
    await navigator.clipboard.writeText(n), (r = (i = ui.notifications) == null ? void 0 : i.info) == null || r.call(i, "Cinematic JSON copied to clipboard.");
  } catch {
    new Dialog({
      title: "Cinematic JSON",
      content: `<textarea style="width:100%;height:300px;font-family:monospace;font-size:0.8rem">${Xt(n)}</textarea>`,
      buttons: { ok: { label: "Close" } }
    }).render(!0);
  }
}, "#onExportJSON"), ig = /* @__PURE__ */ c(function() {
  var l, u;
  const n = g(this, X).toJSON(), { targets: i, unresolved: r } = Zs(n), o = yw(n, i), s = [
    ...r.map((d) => ({ path: "targets", level: "warn", message: `Unresolved target: "${d}"` })),
    ...o
  ];
  if (s.length === 0) {
    (u = (l = ui.notifications) == null ? void 0 : l.info) == null || u.call(l, "Cinematic validation passed — no issues found.");
    return;
  }
  const a = s.map((d) => {
    const f = d.level === "error" ? "fa-circle-xmark" : "fa-triangle-exclamation", h = d.level === "error" ? "#e74c3c" : "#f39c12";
    return `<li style="margin:0.3rem 0"><i class="fa-solid ${f}" style="color:${h};margin-right:0.3rem"></i><strong>${Xt(d.path)}</strong>: ${Xt(d.message)}</li>`;
  });
  new Dialog({
    title: "Cinematic Validation",
    content: `<p>${s.length} issue(s) found:</p><ul style="list-style:none;padding:0;max-height:300px;overflow:auto">${a.join("")}</ul>`,
    buttons: { ok: { label: "Close" } }
  }).render(!0);
}, "#onValidate"), // ── Playback progress ────────────────────────────────────────────────
rg = /* @__PURE__ */ c(function(n) {
  var i, r, o, s, a, l;
  switch (console.log(`[cinematic-editor] playback event: ${n.type}`, n), n.type) {
    case "segment-start":
      O(this, qi, n.segmentName), n.segmentName !== g(this, X).activeSegmentName ? (O(this, X, g(this, X).switchSegment(n.segmentName)), O(this, ft, null), g(this, Xn).clear(), this.render({ force: !0 })) : (i = this.element) == null || i.querySelectorAll(".cinematic-editor__segment-node").forEach((u) => {
        u.classList.toggle("cinematic-editor__segment-node--playing", u.dataset.segmentName === n.segmentName);
      });
      break;
    case "gate-wait":
      (o = (r = this.element) == null ? void 0 : r.querySelector(`.cinematic-editor__segment-node[data-segment-name="${CSS.escape(n.segmentName)}"]`)) == null || o.classList.add("cinematic-editor__segment-node--gate-waiting");
      break;
    case "gate-resolved":
      (a = (s = this.element) == null ? void 0 : s.querySelector(`.cinematic-editor__segment-node[data-segment-name="${CSS.escape(n.segmentName)}"]`)) == null || a.classList.remove("cinematic-editor__segment-node--gate-waiting");
      break;
    case "timeline-start":
      O(this, Mt, { segmentName: n.segmentName, startTime: performance.now(), durationMs: n.durationMs }), n.segmentName === g(this, X).activeSegmentName && I(this, W, mu).call(this, n.durationMs);
      break;
    case "timeline-end":
      I(this, W, to).call(this), O(this, Mt, null);
      break;
    case "playback-end":
      I(this, W, to).call(this), O(this, Mt, null), O(this, qi, null), (l = this.element) == null || l.querySelectorAll(".cinematic-editor__segment-node--playing, .cinematic-editor__segment-node--gate-waiting").forEach((u) => {
        u.classList.remove("cinematic-editor__segment-node--playing", "cinematic-editor__segment-node--gate-waiting");
      });
      break;
  }
}, "#onPlaybackEvent"), mu = /* @__PURE__ */ c(function(n, i = null) {
  var u, d;
  I(this, W, to).call(this);
  const r = (u = this.element) == null ? void 0 : u.querySelector(".cinematic-editor__playback-cursor"), o = (d = this.element) == null ? void 0 : d.querySelector(".cinematic-editor__swimlane");
  if (console.log(`[cinematic-editor] startCursor: duration=${n}, cursor=${!!r}, swimlane=${!!o}, width=${o == null ? void 0 : o.scrollWidth}`), !r || !o || n <= 0) return;
  r.style.display = "block";
  const s = i ?? performance.now(), a = o.scrollWidth, l = /* @__PURE__ */ c(() => {
    const f = performance.now() - s, h = Math.min(f / n, 1), m = So + h * (a - So);
    r.style.left = `${m}px`, h < 1 && O(this, Jn, requestAnimationFrame(l));
  }, "tick");
  O(this, Jn, requestAnimationFrame(l));
}, "#startCursorAnimation"), to = /* @__PURE__ */ c(function() {
  var i;
  g(this, Jn) && (cancelAnimationFrame(g(this, Jn)), O(this, Jn, null));
  const n = (i = this.element) == null ? void 0 : i.querySelector(".cinematic-editor__playback-cursor");
  n && (n.style.display = "none");
}, "#stopCursorAnimation"), c(Rt, "CinematicEditorApplication"), se(Rt, "APP_ID", `${k}-cinematic-editor`), se(Rt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  ye(Rt, Rt, "DEFAULT_OPTIONS"),
  {
    id: Rt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Uf = ye(Rt, Rt, "DEFAULT_OPTIONS")) == null ? void 0 : Uf.classes) ?? [], "eidolon-cinematic-editor-window", "themed"])
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
)), se(Rt, "PARTS", {
  content: {
    template: `modules/${k}/templates/cinematic-editor.html`
  }
});
let lu = Rt;
const og = /* @__PURE__ */ new Map();
function we(t, e) {
  og.set(t, e);
}
c(we, "registerBehaviour");
function _s(t) {
  return og.get(t);
}
c(_s, "getBehaviour");
function fe(t) {
  var e;
  return ((e = t.document) == null ? void 0 : e.documentName) === "Drawing" ? t.shape ?? null : t.mesh ? t.mesh : t.destroyed || !t.transform ? null : t;
}
c(fe, "getAnimationTarget");
function Zw(t, e, n) {
  let i, r, o;
  if (e === 0)
    i = r = o = n;
  else {
    const s = /* @__PURE__ */ c((u, d, f) => (f < 0 && (f += 1), f > 1 && (f -= 1), f < 0.16666666666666666 ? u + (d - u) * 6 * f : f < 0.5 ? d : f < 0.6666666666666666 ? u + (d - u) * (0.6666666666666666 - f) * 6 : u), "hue2rgb"), a = n < 0.5 ? n * (1 + e) : n + e - n * e, l = 2 * n - a;
    i = s(l, a, t + 1 / 3), r = s(l, a, t), o = s(l, a, t - 1 / 3);
  }
  return Math.round(i * 255) << 16 | Math.round(r * 255) << 8 | Math.round(o * 255);
}
c(Zw, "hslToInt");
we("float", (t, e = {}) => {
  const n = fe(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.speed ?? 0.04, r = e.amplitude ?? 3, o = n.position.y;
  let s = 0;
  return {
    update(a) {
      s += a, n.position.y = o + Math.sin(s * i) * r;
    },
    detach() {
      n.position.y = o;
    }
  };
});
we("pulse", (t, e = {}) => {
  const n = fe(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.minAlpha ?? 0.6, r = e.maxAlpha ?? 1, o = e.speed ?? 0.05, s = n.alpha;
  let a = Math.PI / 2;
  return {
    update(l) {
      a += l * o;
      const u = (Math.sin(a) + 1) / 2;
      n.alpha = i + (r - i) * u;
    },
    detach() {
      n.alpha = s;
    }
  };
});
we("scale", (t, e = {}, n) => {
  var b, w, S, T, L, A;
  const i = fe(t);
  if (!i) return { update() {
  }, detach() {
  } };
  const r = e.factor ?? 1.12, o = e.durationFrames ?? 15, s = vt(e.easing ?? "easeOutCubic"), a = i.scale.x, l = i.scale.y, u = a * r, d = l * r, h = !(!!t.mesh || ((b = i.pivot) == null ? void 0 : b.x) || ((w = i.pivot) == null ? void 0 : w.y)), m = h ? (((T = (S = t.document) == null ? void 0 : S.shape) == null ? void 0 : T.width) ?? 0) / 2 : 0, p = h ? (((A = (L = t.document) == null ? void 0 : L.shape) == null ? void 0 : A.height) ?? 0) / 2 : 0, y = (n == null ? void 0 : n.x) ?? i.position.x, E = (n == null ? void 0 : n.y) ?? i.position.y;
  let v = 0;
  return {
    update(M) {
      if (v < o) {
        v += M;
        const F = Math.min(v / o, 1), N = s(F), $ = a + (u - a) * N, x = l + (d - l) * N;
        i.scale.x = $, i.scale.y = x, h && (i.position.x = y - m * ($ - a), i.position.y = E - p * (x - l));
      }
    },
    detach() {
      i.scale.x = a, i.scale.y = l, h && (i.position.x = y, i.position.y = E);
    }
  };
});
we("glow", (t, e = {}) => {
  var y, E;
  const n = fe(t);
  if (!((y = n == null ? void 0 : n.texture) != null && y.baseTexture)) return { update() {
  }, detach() {
  } };
  const i = t.document, r = e.color ?? 4513279, o = e.alpha ?? 0.5, s = e.blur ?? 8, a = e.pulseSpeed ?? 0.03, l = Math.abs(i.width), u = Math.abs(i.height), d = PIXI.Sprite.from(n.texture);
  d.anchor.set(0.5, 0.5), d.scale.set(n.scale.x, n.scale.y), d.position.set(l / 2, u / 2), d.angle = i.rotation ?? 0, d.alpha = o, d.tint = r;
  const f = PIXI.BlurFilter ?? ((E = PIXI.filters) == null ? void 0 : E.BlurFilter), h = new f(s);
  d.filters = [h], t.addChildAt(d, 0);
  const m = n.angle;
  let p = 0;
  return {
    update(v) {
      p += v;
      const b = (Math.sin(p * a) + 1) / 2;
      d.visible = n.visible !== !1, d.alpha = o * (0.5 + 0.5 * b) * (n.alpha ?? 1), d.scale.set(n.scale.x, n.scale.y), d.angle = (i.rotation ?? 0) + (n.angle - m);
    },
    detach() {
      d.parent && d.parent.removeChild(d), d.destroy({ children: !0 });
    }
  };
});
we("wobble", (t, e = {}) => {
  const n = fe(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.speed ?? 0.15, r = e.angle ?? 2.5, o = n.angle;
  let s = 0;
  return {
    update(a) {
      s += a, n.angle = o + Math.sin(s * i) * r;
    },
    detach() {
      n.angle = o;
    }
  };
});
we("colorCycle", (t, e = {}) => {
  const n = fe(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.speed ?? 5e-3, r = e.saturation ?? 0.6, o = e.lightness ?? 0.6, s = n.tint;
  let a = 0;
  return {
    update(l) {
      a = (a + l * i) % 1, n.tint = Zw(a, r, o);
    },
    detach() {
      n.tint = s;
    }
  };
});
we("spin", (t, e = {}) => {
  const n = fe(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.speed ?? 0.5, r = n.angle;
  let o = 0;
  return {
    update(s) {
      o += s, n.angle = r + o * i;
    },
    detach() {
      n.angle = r;
    }
  };
});
we("bounce", (t, e = {}) => {
  const n = fe(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.speed ?? 0.02, r = e.amplitude ?? 6, o = vt("easeOutBounce"), s = n.position.y;
  let a = 0;
  return {
    update(l) {
      a += l;
      const u = Math.abs(a * i % 2 - 1);
      n.position.y = s + o(u) * r;
    },
    detach() {
      n.position.y = s;
    }
  };
});
we("borderTrace", (t, e = {}) => {
  const n = fe(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), o = Math.abs(i.height), s = 2 * (r + o), a = e.speed ?? 1.5, l = e.length ?? 60, u = e.color ?? 4513279, d = e.alpha ?? 0.8, f = e.lineWidth ?? 2, h = new PIXI.Graphics();
  h.alpha = d, h.pivot.set(r / 2, o / 2), h.position.set(r / 2, o / 2), t.addChildAt(h, 0);
  const m = n.scale.x, p = n.scale.y, y = n.angle;
  let E = 0;
  function v(b) {
    return b = (b % s + s) % s, b < r ? { x: b, y: 0 } : (b -= r, b < o ? { x: r, y: b } : (b -= o, b < r ? { x: r - b, y: o } : (b -= r, { x: 0, y: o - b })));
  }
  return c(v, "perimeterPoint"), {
    update(b) {
      E = (E + b * a) % s, h.visible = n.visible !== !1, h.alpha = d * (n.alpha ?? 1), h.scale.set(n.scale.x / m, n.scale.y / p), h.angle = n.angle - y, h.clear(), h.lineStyle(f, u, 1);
      const w = 16, S = l / w, T = v(E);
      h.moveTo(T.x, T.y);
      for (let L = 1; L <= w; L++) {
        const A = v(E + L * S);
        h.lineTo(A.x, A.y);
      }
    },
    detach() {
      h.parent && h.parent.removeChild(h), h.destroy({ children: !0 });
    }
  };
});
we("shimmer", (t, e = {}) => {
  const n = fe(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), o = Math.abs(i.height), s = e.speed ?? 1, a = e.bandWidth ?? 40, l = e.alpha ?? 0.15, u = e.pause ?? 120, d = r + o + a, f = d + u * s, h = new PIXI.Container();
  h.pivot.set(r / 2, o / 2), h.position.set(r / 2, o / 2);
  const m = new PIXI.Graphics();
  m.alpha = l;
  const p = new PIXI.Graphics();
  p.beginFill(16777215), p.drawRect(0, 0, r, o), p.endFill(), h.addChild(p), m.mask = p, h.addChild(m), t.addChild(h);
  const y = n.scale.x, E = n.scale.y, v = n.angle;
  let b = 0;
  return {
    update(w) {
      if (b = (b + w * s) % f, h.visible = n.visible !== !1, h.scale.set(n.scale.x / y, n.scale.y / E), h.angle = n.angle - v, m.alpha = l * (n.alpha ?? 1), m.clear(), b < d) {
        const S = b - a;
        m.beginFill(16777215, 1), m.moveTo(S, 0), m.lineTo(S + a, 0), m.lineTo(S + a - o, o), m.lineTo(S - o, o), m.closePath(), m.endFill();
      }
    },
    detach() {
      m.mask = null, h.parent && h.parent.removeChild(h), h.destroy({ children: !0 });
    }
  };
});
we("breathe", (t, e = {}) => {
  const n = fe(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.factor ?? 1.03, r = e.speed ?? 0.02, o = n.scale.x, s = n.scale.y;
  let a = 0;
  return {
    update(l) {
      a += l;
      const u = Math.sin(a * r);
      n.scale.x = o * (1 + (i - 1) * u), n.scale.y = s * (1 + (i - 1) * u);
    },
    detach() {
      n.scale.x = o, n.scale.y = s;
    }
  };
});
we("tiltFollow", (t, e = {}) => {
  const n = fe(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.maxAngle ?? 3, r = e.smoothing ?? 0.15, o = t.document, s = n.angle;
  let a = 0;
  return {
    update() {
      const l = canvas.mousePosition;
      if (!l) return;
      const u = Math.abs(o.width), d = o.x + u / 2, f = l.x - d, h = Math.max(-i, Math.min(i, f / (u / 2) * i));
      a += (h - a) * r, n.angle = s + a;
    },
    detach() {
      n.angle = s;
    }
  };
});
we("slideReveal", (t, e = {}, n) => {
  const i = fe(t);
  if (!i) return { update() {
  }, detach() {
  } };
  if (n) return { update() {
  }, detach() {
  } };
  const r = e.offsetX ?? 0, o = e.offsetY ?? 20, s = e.durationFrames ?? 20, a = vt(e.easing ?? "easeOutCubic"), l = e.delay ?? 0, u = i.position.x, d = i.position.y, f = i.alpha;
  i.position.x = u + r, i.position.y = d + o, i.alpha = 0;
  let h = -l;
  return {
    update(m) {
      if (h += m, h < 0) return;
      if (h >= s) {
        i.position.x = u, i.position.y = d, i.alpha = f;
        return;
      }
      const p = Math.min(h / s, 1), y = a(p);
      i.position.x = u + r * (1 - y), i.position.y = d + o * (1 - y), i.alpha = f * y;
    },
    detach() {
      i.position.x = u, i.position.y = d, i.alpha = f;
    }
  };
});
we("embers", (t, e = {}) => {
  const n = fe(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), o = Math.abs(i.height), s = e.count ?? 12, a = e.speed ?? 0.5, l = e.color ?? 16737792, u = e.alpha ?? 0.6, d = e.size ?? 2, f = new PIXI.Container();
  f.pivot.set(r / 2, o / 2), f.position.set(r / 2, o / 2);
  const h = new PIXI.Graphics();
  f.addChild(h), t.addChild(f);
  const m = n.scale.x, p = n.scale.y, y = n.angle, E = [];
  function v() {
    const b = Math.random();
    let w, S;
    return b < 0.7 ? (w = Math.random() * r, S = o) : b < 0.85 ? (w = 0, S = o * 0.5 + Math.random() * o * 0.5) : (w = r, S = o * 0.5 + Math.random() * o * 0.5), {
      x: w,
      y: S,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -a * (0.5 + Math.random() * 0.5),
      life: 0,
      maxLife: 40 + Math.random() * 60,
      size: d * (0.5 + Math.random() * 0.5)
    };
  }
  return c(v, "spawnParticle"), {
    update(b) {
      f.visible = n.visible !== !1, f.scale.set(n.scale.x / m, n.scale.y / p), f.angle = n.angle - y, E.length < s && E.push(v());
      for (let w = E.length - 1; w >= 0; w--) {
        const S = E[w];
        if (S.life += b, S.life >= S.maxLife) {
          E.splice(w, 1);
          continue;
        }
        S.x += S.vx * b, S.y += S.vy * b, S.vx += (Math.random() - 0.5) * 0.05 * b;
      }
      h.clear();
      for (const w of E) {
        const S = 1 - w.life / w.maxLife;
        h.beginFill(l, u * S * (n.alpha ?? 1)), h.drawCircle(w.x, w.y, w.size), h.endFill();
      }
    },
    detach() {
      f.parent && f.parent.removeChild(f), f.destroy({ children: !0 });
    }
  };
});
we("runeGlow", (t, e = {}) => {
  const n = fe(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), o = Math.abs(i.height), s = 2 * (r + o), a = e.dots ?? 3, l = e.speed ?? 1.2, u = e.color ?? 4513279, d = e.color2 ?? 8930559, f = e.radius ?? 3, h = e.alpha ?? 0.7, m = new PIXI.Graphics();
  m.pivot.set(r / 2, o / 2), m.position.set(r / 2, o / 2), t.addChildAt(m, 0);
  const p = n.scale.x, y = n.scale.y, E = n.angle, v = [];
  for (let S = 0; S < a; S++)
    v.push({
      phase: S / a * s,
      speedMul: 0.7 + Math.random() * 0.6,
      color: S % 2 === 0 ? u : d
    });
  function b(S) {
    return S = (S % s + s) % s, S < r ? { x: S, y: 0 } : (S -= r, S < o ? { x: r, y: S } : (S -= o, S < r ? { x: r - S, y: o } : (S -= r, { x: 0, y: o - S })));
  }
  c(b, "perimeterPoint");
  let w = 0;
  return {
    update(S) {
      w += S, m.visible = n.visible !== !1, m.alpha = h * (n.alpha ?? 1), m.scale.set(n.scale.x / p, n.scale.y / y), m.angle = n.angle - E, m.clear();
      for (const T of v) {
        const L = b(T.phase + w * l * T.speedMul);
        m.beginFill(T.color, 1), m.drawCircle(L.x, L.y, f), m.endFill();
      }
    },
    detach() {
      m.parent && m.parent.removeChild(m), m.destroy({ children: !0 });
    }
  };
});
we("ripple", (t, e = {}) => {
  const n = fe(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), o = Math.abs(i.height), s = e.maxRadius ?? Math.sqrt(r * r + o * o) / 2, a = e.rings ?? 3, l = e.interval ?? 30, u = e.speed ?? 1.5, d = e.color ?? 4513279, f = e.alpha ?? 0.4, h = e.lineWidth ?? 1.5, m = new PIXI.Container();
  m.pivot.set(r / 2, o / 2), m.position.set(r / 2, o / 2);
  const p = new PIXI.Graphics();
  m.addChild(p), t.addChild(m);
  const y = n.scale.x, E = n.scale.y, v = n.angle, b = [];
  let w = 0, S = 0;
  return {
    update(T) {
      w += T, m.visible = n.visible !== !1, m.scale.set(n.scale.x / y, n.scale.y / E), m.angle = n.angle - v, w >= S && b.length < a && (b.push({ radius: 0, alpha: f }), S = w + l);
      for (let M = b.length - 1; M >= 0; M--) {
        const F = b[M];
        F.radius += u * T, F.alpha = f * (1 - F.radius / s), F.radius >= s && b.splice(M, 1);
      }
      p.clear();
      const L = r / 2, A = o / 2;
      for (const M of b)
        p.lineStyle(h, d, M.alpha * (n.alpha ?? 1)), p.drawCircle(L, A, M.radius);
    },
    detach() {
      m.parent && m.parent.removeChild(m), m.destroy({ children: !0 });
    }
  };
});
we("frostEdge", (t, e = {}) => {
  const n = fe(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = t.document, r = Math.abs(i.width), o = Math.abs(i.height), s = e.segments ?? 20, a = e.maxLength ?? 15, l = e.color ?? 11197951, u = e.alpha ?? 0.5, d = e.growSpeed ?? 0.02, f = new PIXI.Container();
  f.pivot.set(r / 2, o / 2), f.position.set(r / 2, o / 2);
  const h = new PIXI.Graphics(), m = new PIXI.Graphics();
  m.beginFill(16777215), m.drawRect(0, 0, r, o), m.endFill(), f.addChild(m), h.mask = m, f.addChild(h), t.addChild(f);
  const p = n.scale.x, y = n.scale.y, E = n.angle, v = [];
  for (let S = 0; S < s; S++) {
    const T = Math.floor(Math.random() * 4);
    let L, A, M;
    switch (T) {
      case 0:
        L = Math.random() * r, A = 0, M = Math.PI / 2 + (Math.random() - 0.5) * 0.6;
        break;
      case 1:
        L = r, A = Math.random() * o, M = Math.PI + (Math.random() - 0.5) * 0.6;
        break;
      case 2:
        L = Math.random() * r, A = o, M = -Math.PI / 2 + (Math.random() - 0.5) * 0.6;
        break;
      default:
        L = 0, A = Math.random() * o, M = (Math.random() - 0.5) * 0.6;
        break;
    }
    v.push({ sx: L, sy: A, angle: M, targetLength: a * (0.4 + Math.random() * 0.6), currentLength: 0, grown: !1 });
  }
  let b = !1, w = 0;
  return {
    update(S) {
      if (f.visible = n.visible !== !1, f.scale.set(n.scale.x / p, n.scale.y / y), f.angle = n.angle - E, b)
        w += S * 0.03;
      else {
        b = !0;
        for (const L of v)
          L.grown || (L.currentLength += (L.targetLength - L.currentLength) * d * S, L.currentLength >= L.targetLength * 0.99 ? (L.currentLength = L.targetLength, L.grown = !0) : b = !1);
      }
      const T = b ? u * (0.7 + 0.3 * Math.sin(w)) : u;
      h.clear(), h.lineStyle(1.5, l, T * (n.alpha ?? 1));
      for (const L of v)
        L.currentLength <= 0 || (h.moveTo(L.sx, L.sy), h.lineTo(L.sx + Math.cos(L.angle) * L.currentLength, L.sy + Math.sin(L.angle) * L.currentLength));
    },
    detach() {
      h.mask = null, f.parent && f.parent.removeChild(f), f.destroy({ children: !0 });
    }
  };
});
we("shadowLift", (t, e = {}) => {
  var m, p, y;
  const n = fe(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = PIXI.DropShadowFilter ?? ((m = PIXI.filters) == null ? void 0 : m.DropShadowFilter) ?? ((y = (p = globalThis.PIXI) == null ? void 0 : p.filters) == null ? void 0 : y.DropShadowFilter);
  if (!i)
    return console.warn("shadowLift: DropShadowFilter not available in this PIXI build"), { update() {
    }, detach() {
    } };
  const r = e.offsetY ?? 6, o = e.blur ?? 6, s = e.alpha ?? 0.35, a = e.color ?? 0, l = e.durationFrames ?? 12, u = vt(e.easing ?? "easeOutCubic"), d = new i();
  d.blur = o, d.alpha = 0, d.color = a, d.quality = 3, d.distance = 0, d.rotation = 90;
  const f = n.filters ? [...n.filters] : [];
  n.filters = [...f, d];
  let h = 0;
  return {
    update(E) {
      if (h < l) {
        h += E;
        const v = Math.min(h / l, 1), b = u(v);
        d.distance = r * b, d.alpha = s * b;
      }
    },
    detach() {
      n.filters && (n.filters = n.filters.filter((E) => E !== d), n.filters.length === 0 && (n.filters = null)), d.destroy();
    }
  };
});
we("none", () => ({ update() {
}, detach() {
} }));
we("tween-prop", (t, e = {}) => {
  const n = fe(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.attribute ?? "alpha", r = e.from ?? 0.85, o = e.to ?? 1, s = e.period ?? 1500, a = vt(e.easing ?? "easeInOutCosine"), u = { alpha: "alpha", rotation: "angle" }[i] ?? i, d = n[u];
  let f = 0;
  return {
    update(h) {
      f += h;
      const m = s / 16.667, p = Math.abs(f / m % 2 - 1), y = a(p);
      n[u] = r + (o - r) * y;
    },
    detach() {
      n[u] = d;
    }
  };
});
we("tween-tint", (t, e = {}) => {
  const n = fe(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.fromColor ?? "#ffffff", r = e.toColor ?? "#ffcc88", o = e.mode ?? "oklch", s = e.period ?? 3e3, a = vt(e.easing ?? "easeInOutCosine"), l = Ku(o), u = foundry.utils.Color, d = u.from(i), f = u.from(r), h = n.tint;
  let m = 0;
  return {
    update(p) {
      m += p;
      const y = s / 16.667, E = Math.abs(m / y % 2 - 1), v = a(E), b = l(d, f, v);
      n.tint = u.from(b).valueOf();
    },
    detach() {
      n.tint = h;
    }
  };
});
we("tween-scale", (t, e = {}) => {
  const n = fe(t);
  if (!n) return { update() {
  }, detach() {
  } };
  const i = e.fromScale ?? 0.95, r = e.toScale ?? 1.05, o = e.period ?? 2e3, s = vt(e.easing ?? "easeInOutCosine"), a = n.scale.x, l = n.scale.y;
  let u = 0;
  return {
    update(d) {
      u += d;
      const f = o / 16.667, h = Math.abs(u / f % 2 - 1), m = s(h), p = i + (r - i) * m;
      n.scale.set(a * p, l * p);
    },
    detach() {
      n.scale.set(a, l);
    }
  };
});
const zr = {
  always: [],
  idle: ["float", "glow"],
  hover: ["scale"],
  dim: ["none"]
};
function eE(t) {
  if (!t) return { ...zr };
  const e = /* @__PURE__ */ c((n, i) => n === void 0 ? i : typeof n == "string" ? [n] : typeof n == "object" && !Array.isArray(n) && n.name ? [n] : Array.isArray(n) ? n : i, "normalize");
  return {
    always: e(t.always, zr.always),
    idle: e(t.idle, zr.idle),
    hover: e(t.hover, zr.hover),
    dim: e(t.dim, zr.dim)
  };
}
c(eE, "normalizeConfig");
var ke, Ut, gt, Vt, Qn, Zn, xt, Gt, On, Ie, sg, Ns, ag, lg, cg, ug, dg, fg;
const go = class go {
  /**
   * @param {PlaceableObject} placeable
   * @param {object|undefined} animationConfig  Raw animation config from the await entry
   */
  constructor(e, n) {
    _(this, Ie);
    _(this, ke);
    _(this, Ut);
    _(this, gt, null);
    _(this, Vt, []);
    _(this, Qn, []);
    _(this, Zn, null);
    _(this, xt, null);
    _(this, Gt, null);
    _(this, On, 0);
    O(this, ke, e), O(this, Ut, eE(n));
  }
  /** Current animation state name. */
  get state() {
    return g(this, gt);
  }
  /**
   * Start animating in the given state.
   * @param {string} [state="idle"]
   */
  start(e = "idle") {
    O(this, gt, e), O(this, Zn, (n) => {
      if (g(this, ke).destroyed || !g(this, ke).transform) {
        this.detach();
        return;
      }
      if (!g(this, xt)) {
        if (I(this, Ie, sg).call(this), !g(this, xt)) return;
        I(this, Ie, dg).call(this), I(this, Ie, cg).call(this, g(this, gt));
        return;
      }
      g(this, Gt) && I(this, Ie, Ns).call(this);
      for (const i of g(this, Qn)) i.update(n);
      for (const i of g(this, Vt)) i.update(n);
      I(this, Ie, lg).call(this, n);
    }), canvas.app.ticker.add(g(this, Zn));
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
    var f;
    if (e === g(this, gt)) return;
    if (!g(this, xt)) {
      O(this, gt, e);
      return;
    }
    const n = ((f = g(this, ke).document) == null ? void 0 : f.id) ?? "?", i = fe(g(this, ke)), r = g(this, Ut)[g(this, gt)] ?? g(this, Ut).idle ?? ["none"], o = g(this, Ut)[e] ?? g(this, Ut).idle ?? ["none"], s = r.map((h) => typeof h == "string" ? h : h == null ? void 0 : h.name), a = o.map((h) => typeof h == "string" ? h : h == null ? void 0 : h.name);
    if (console.log(`%c[TileAnimator ${n}] setState: ${g(this, gt)} → ${e}`, "color: #44DDFF; font-weight: bold"), console.log(`  old behaviours: [${s.join(", ")}]  →  new: [${a.join(", ")}]`), i && console.log(`  mesh BEFORE detach: pos=(${i.position.x.toFixed(2)}, ${i.position.y.toFixed(2)}) scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)} angle=${i.angle.toFixed(2)}`), g(this, xt)) {
      const h = g(this, xt);
      console.log(`  canonical: pos=(${h.x.toFixed(2)}, ${h.y.toFixed(2)}) scale=(${h.scaleX.toFixed(4)}, ${h.scaleY.toFixed(4)}) alpha=${h.alpha.toFixed(4)} angle=${h.angle.toFixed(2)}`);
    }
    const l = /* @__PURE__ */ new Map();
    for (let h = 0; h < g(this, Vt).length; h++) {
      const m = r[h], p = typeof m == "string" ? m : m == null ? void 0 : m.name;
      p && l.set(p, g(this, Vt)[h]);
    }
    const u = [], d = /* @__PURE__ */ new Set();
    for (const h of o) {
      const m = typeof h == "string" ? h : h.name;
      l.has(m) && !d.has(m) && d.add(m);
    }
    console.log(`  reused: [${[...d].join(", ")}]  detaching: [${[...l.keys()].filter((h) => !d.has(h)).join(", ")}]`), I(this, Ie, ag).call(this);
    for (const [h, m] of l)
      d.has(h) || (m.detach(), i && console.log(`  mesh AFTER detach("${h}"): scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)}`));
    I(this, Ie, Ns).call(this), i && console.log(`  mesh AFTER canonical restore: scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)}`);
    for (const h of o) {
      const m = typeof h == "string" ? h : h.name;
      if (l.has(m) && d.has(m))
        u.push(l.get(m)), d.delete(m), console.log(`  → reuse "${m}"`);
      else {
        const p = typeof h == "string" ? void 0 : h, y = _s(m);
        if (!y) {
          console.warn(`TileAnimator: unknown behaviour "${m}"`);
          continue;
        }
        u.push(y(g(this, ke), p, g(this, xt))), i && console.log(`  → create "${m}" — mesh after factory: scale=(${i.scale.x.toFixed(4)}, ${i.scale.y.toFixed(4)}) alpha=${i.alpha.toFixed(4)} pos=(${i.position.x.toFixed(2)}, ${i.position.y.toFixed(2)})`);
      }
    }
    if (g(this, Gt)) {
      const h = g(this, Gt);
      console.log(`  blend FROM: pos=(${h.x.toFixed(2)}, ${h.y.toFixed(2)}) scale=(${h.scaleX.toFixed(4)}, ${h.scaleY.toFixed(4)}) alpha=${h.alpha.toFixed(4)}`);
    }
    O(this, gt, e), O(this, Vt, u);
  }
  /**
   * Full cleanup — detach all behaviours, restore canonical, and remove ticker.
   */
  detach() {
    var n, i;
    g(this, ke).destroyed || !g(this, ke).transform ? (O(this, Vt, []), O(this, Qn, [])) : (I(this, Ie, ug).call(this), I(this, Ie, fg).call(this), I(this, Ie, Ns).call(this)), O(this, Gt, null), O(this, gt, null), g(this, Zn) && ((i = (n = canvas.app) == null ? void 0 : n.ticker) == null || i.remove(g(this, Zn)), O(this, Zn, null));
  }
};
ke = new WeakMap(), Ut = new WeakMap(), gt = new WeakMap(), Vt = new WeakMap(), Qn = new WeakMap(), Zn = new WeakMap(), xt = new WeakMap(), Gt = new WeakMap(), On = new WeakMap(), Ie = new WeakSet(), // ── Private ──────────────────────────────────────────────────────────
sg = /* @__PURE__ */ c(function() {
  const e = fe(g(this, ke));
  e && O(this, xt, {
    x: e.position.x,
    y: e.position.y,
    scaleX: e.scale.x,
    scaleY: e.scale.y,
    angle: e.angle,
    alpha: e.alpha,
    tint: e.tint
  });
}, "#captureCanonical"), Ns = /* @__PURE__ */ c(function() {
  const e = fe(g(this, ke));
  if (!e || !g(this, xt)) return;
  const n = g(this, xt);
  e.position.x = n.x, e.position.y = n.y, e.scale.x = n.scaleX, e.scale.y = n.scaleY, e.angle = n.angle, e.alpha = n.alpha, e.tint = n.tint;
}, "#restoreCanonical"), /**
 * Snapshot the current (animated) mesh values so the transition blend
 * can lerp FROM here toward the new state's computed values.
 */
ag = /* @__PURE__ */ c(function() {
  const e = fe(g(this, ke));
  e && (O(this, Gt, {
    x: e.position.x,
    y: e.position.y,
    scaleX: e.scale.x,
    scaleY: e.scale.y,
    angle: e.angle,
    alpha: e.alpha
  }), O(this, On, 0));
}, "#captureBlendStart"), /**
 * After behaviours compute the new state's mesh values, blend from the
 * pre-transition snapshot toward those values over BLEND_FRAMES using
 * easeOutCubic. This hides the canonical-restore snap entirely.
 */
lg = /* @__PURE__ */ c(function(e) {
  var s, a;
  if (!g(this, Gt)) return;
  O(this, On, g(this, On) + e);
  const n = Math.min(g(this, On) / go.BLEND_FRAMES, 1);
  if (n >= 1) {
    const l = ((s = g(this, ke).document) == null ? void 0 : s.id) ?? "?";
    console.log(`%c[TileAnimator ${l}] blend complete`, "color: #88FF88"), O(this, Gt, null);
    return;
  }
  const i = 1 - (1 - n) ** 3, r = fe(g(this, ke));
  if (!r) return;
  const o = g(this, Gt);
  if (g(this, On) <= e * 3) {
    const l = ((a = g(this, ke).document) == null ? void 0 : a.id) ?? "?", u = Math.round(g(this, On) / e);
    console.log(`  [blend ${l} f${u}] t=${n.toFixed(3)} eased=${i.toFixed(3)} | behaviour→scale=(${r.scale.x.toFixed(4)},${r.scale.y.toFixed(4)}) alpha=${r.alpha.toFixed(4)} | blendFrom→scale=(${o.scaleX.toFixed(4)},${o.scaleY.toFixed(4)}) alpha=${o.alpha.toFixed(4)}`);
  }
  r.position.x = o.x + (r.position.x - o.x) * i, r.position.y = o.y + (r.position.y - o.y) * i, r.scale.x = o.scaleX + (r.scale.x - o.scaleX) * i, r.scale.y = o.scaleY + (r.scale.y - o.scaleY) * i, r.angle = o.angle + (r.angle - o.angle) * i, r.alpha = o.alpha + (r.alpha - o.alpha) * i, g(this, On) <= e * 3 && console.log(`  [blend result] scale=(${r.scale.x.toFixed(4)},${r.scale.y.toFixed(4)}) alpha=${r.alpha.toFixed(4)} pos=(${r.position.x.toFixed(2)},${r.position.y.toFixed(2)})`);
}, "#applyBlend"), cg = /* @__PURE__ */ c(function(e) {
  O(this, gt, e);
  const n = g(this, Ut)[e] ?? g(this, Ut).idle ?? ["none"];
  for (const i of n) {
    const r = typeof i == "string" ? i : i.name, o = typeof i == "string" ? void 0 : i, s = _s(r);
    if (!s) {
      console.warn(`TileAnimator: unknown behaviour "${r}"`);
      continue;
    }
    g(this, Vt).push(s(g(this, ke), o));
  }
}, "#attachBehaviours"), ug = /* @__PURE__ */ c(function() {
  for (const e of g(this, Vt)) e.detach();
  O(this, Vt, []);
}, "#detachBehaviours"), dg = /* @__PURE__ */ c(function() {
  const e = g(this, Ut).always ?? [];
  for (const n of e) {
    const i = typeof n == "string" ? n : n.name, r = typeof n == "string" ? void 0 : n, o = _s(i);
    if (!o) {
      console.warn(`TileAnimator: unknown always behaviour "${i}"`);
      continue;
    }
    g(this, Qn).push(o(g(this, ke), r));
  }
}, "#attachAlwaysBehaviours"), fg = /* @__PURE__ */ c(function() {
  for (const e of g(this, Qn)) e.detach();
  O(this, Qn, []);
}, "#detachAlwaysBehaviours"), c(go, "TileAnimator"), /** Frames over which state transitions are blended (easeOutCubic). */
se(go, "BLEND_FRAMES", 8);
let Xi = go;
const tE = "cinematic", Fl = 5, gu = /* @__PURE__ */ new Set();
function pn(t) {
  for (const e of gu)
    try {
      e(t);
    } catch (n) {
      console.error("[cinematic] playback listener error:", n);
    }
}
c(pn, "emitPlaybackEvent");
function nE(t) {
  return gu.add(t), () => gu.delete(t);
}
c(nE, "onPlaybackProgress");
let _e = null, Tn = null, lo = null, co = null, ir = 0, Li = null;
function ed(t, e = "default") {
  return `cinematic-progress-${t}-${e}`;
}
c(ed, "progressFlagKey");
function iE(t, e, n, i) {
  game.user.setFlag(k, ed(t, e), {
    currentSegment: n,
    completedSegments: [...i],
    timestamp: Date.now()
  }).catch(() => {
  });
}
c(iE, "saveSegmentProgress");
function pu(t, e = "default") {
  game.user.unsetFlag(k, ed(t, e)).catch(() => {
  });
}
c(pu, "clearProgress");
function hg(t, e = "default", n = 3e5) {
  const i = game.user.getFlag(k, ed(t, e));
  return !i || typeof i.timestamp != "number" || Date.now() - i.timestamp > n ? null : i.currentSegment ? i : null;
}
c(hg, "getSavedProgress");
function Ji(t, e = "default") {
  return `cinematic-seen-${t}-${e}`;
}
c(Ji, "seenFlagKey");
function mf(t, e = "default") {
  return !!game.user.getFlag(k, Ji(t, e));
}
c(mf, "hasSeenCinematic");
function rE(t, e) {
  var n;
  if (t == null) return null;
  if (typeof t != "object" || Array.isArray(t))
    return console.warn(`[${k}] Cinematic: invalid data for ${e} (expected object). Ignoring.`), null;
  if (t.trigger !== void 0 && typeof t.trigger != "string")
    return console.warn(`[${k}] Cinematic: invalid 'trigger' on ${e} (expected string). Ignoring.`), null;
  if (t.tracking !== void 0 && typeof t.tracking != "boolean")
    return console.warn(`[${k}] Cinematic: invalid 'tracking' on ${e} (expected boolean). Ignoring.`), null;
  if (t.synchronized !== void 0 && typeof t.synchronized != "boolean")
    return console.warn(`[${k}] Cinematic: invalid 'synchronized' on ${e} (expected boolean). Ignoring.`), null;
  if (t.segments) {
    if (typeof t.segments != "object" || Array.isArray(t.segments))
      return console.warn(`[${k}] Cinematic: invalid 'segments' on ${e} (expected object). Ignoring.`), null;
    for (const [i, r] of Object.entries(t.segments)) {
      if (!r || typeof r != "object" || Array.isArray(r)) {
        console.warn(`[${k}] Cinematic: invalid segment "${i}" on ${e}. Removing.`), delete t.segments[i];
        continue;
      }
      if (r.timeline !== void 0 && !Array.isArray(r.timeline)) {
        console.warn(`[${k}] Cinematic: invalid timeline on segment "${i}" of ${e}. Removing.`), delete t.segments[i];
        continue;
      }
      (n = r.timeline) != null && n.length && (r.timeline = r.timeline.filter((o, s) => !o || typeof o != "object" || Array.isArray(o) ? (console.warn(`[${k}] Cinematic: segment "${i}" timeline[${s}] on ${e} is not a valid object, removing.`), !1) : !0));
    }
    if (Object.keys(t.segments).length === 0)
      return console.warn(`[${k}] Cinematic: no valid segments on ${e}. Ignoring.`), null;
  }
  return t.timeline !== void 0 && !Array.isArray(t.timeline) ? (console.warn(`[${k}] Cinematic: invalid 'timeline' on ${e} (expected array). Ignoring.`), null) : t;
}
c(rE, "validateSingleCinematic");
function ul(t) {
  const e = t ? game.scenes.get(t) : canvas.scene;
  let n = (e == null ? void 0 : e.getFlag(k, tE)) ?? null;
  if (n == null) return null;
  if (typeof n != "object" || Array.isArray(n))
    return console.warn(`[${k}] Cinematic: invalid flag data on scene ${e == null ? void 0 : e.id} (expected object). Ignoring.`), null;
  if ((n.version ?? 1) < 3) {
    const { version: i, ...r } = n;
    n = { version: 3, cinematics: { default: r } };
  }
  if (n.version === 3) {
    for (const [i, r] of Object.entries(n.cinematics ?? {}))
      n.cinematics[i] = hn.migrateV3toV4(r);
    n.version = 4;
  }
  if (n.version === 4) {
    for (const [i, r] of Object.entries(n.cinematics ?? {}))
      n.cinematics[i] = hn.migrateV4toV5(r);
    n.version = Fl;
  }
  if (n.version > Fl)
    return console.warn(`[${k}] Cinematic: scene ${e == null ? void 0 : e.id} has version ${n.version}, runtime supports up to ${Fl}. Skipping.`), null;
  if (!n.cinematics || typeof n.cinematics != "object")
    return console.warn(`[${k}] Cinematic: no 'cinematics' map on scene ${e == null ? void 0 : e.id}. Ignoring.`), null;
  for (const [i, r] of Object.entries(n.cinematics)) {
    const o = rE(r, `scene ${e == null ? void 0 : e.id} cinematic "${i}"`);
    o ? n.cinematics[i] = o : delete n.cinematics[i];
  }
  return Object.keys(n.cinematics).length === 0 ? null : n;
}
c(ul, "getCinematicData");
function sa(t, e = "default") {
  var i;
  const n = ul(t);
  return ((i = n == null ? void 0 : n.cinematics) == null ? void 0 : i[e]) ?? null;
}
c(sa, "getNamedCinematic");
function oE(t) {
  const e = ul(t);
  return e ? Object.keys(e.cinematics) : [];
}
c(oE, "listCinematicNames");
function sE() {
  return game.ready ? Promise.resolve() : new Promise((t) => Hooks.once("ready", t));
}
c(sE, "waitForReady");
async function aE(t = 1e4) {
  var n, i;
  const e = (i = (n = game.modules.get(k)) == null ? void 0 : n.api) == null ? void 0 : i.tween;
  return e != null && e.Timeline ? e.Timeline : new Promise((r) => {
    const o = Date.now(), s = setTimeout(() => {
      var l, u;
      (u = (l = ui.notifications) == null ? void 0 : l.info) == null || u.call(l, `[${k}] Cinematic: waiting for tween engine...`);
    }, 2e3), a = setInterval(() => {
      var u, d, f, h;
      const l = (d = (u = game.modules.get(k)) == null ? void 0 : u.api) == null ? void 0 : d.tween;
      l != null && l.Timeline ? (clearInterval(a), clearTimeout(s), r(l.Timeline)) : Date.now() - o > t && (clearInterval(a), clearTimeout(s), console.warn(`[${k}] Cinematic: tween API not available after ${t}ms.`), (h = (f = ui.notifications) == null ? void 0 : f.warn) == null || h.call(f, `[${k}] Cinematic: tween engine unavailable — cinematic cannot play.`), r(null));
    }, 200);
  });
}
c(aE, "waitForTweenAPI");
async function yu(t = 5e3) {
  var e;
  return window.Tagger ?? ((e = game.modules.get("tagger")) == null ? void 0 : e.api) ? !0 : new Promise((n) => {
    const i = Date.now(), r = setInterval(() => {
      var o;
      window.Tagger ?? ((o = game.modules.get("tagger")) == null ? void 0 : o.api) ? (clearInterval(r), n(!0)) : Date.now() - i > t && (clearInterval(r), console.warn(`[${k}] Cinematic: Tagger API not available after ${t}ms.`), n(!1));
    }, 200);
  });
}
c(yu, "waitForTagger");
async function lE(t, e, n) {
  if (!t || !t.event) return;
  const i = { ...t };
  console.log(`[${k}] Cinematic: waiting for gate: ${t.event}`);
  let r = null;
  if (t.event === "tile-click" && t.target && t.animation) {
    const o = e.get(t.target);
    (o == null ? void 0 : o.kind) === "placeable" && o.placeable && (r = new Xi(o.placeable, t.animation), r.start());
  }
  try {
    if (t.timeout && t.timeout > 0) {
      const o = new Promise((a) => setTimeout(a, t.timeout)), s = Kc(i, { signal: n.signal, eventBus: null });
      await Promise.race([s, o]);
    } else
      await Kc(i, { signal: n.signal, eventBus: null });
  } finally {
    r && r.detach();
  }
}
c(lE, "processGate");
function mg(t) {
  if (!t.segments) return [];
  const e = [], n = /* @__PURE__ */ new Set();
  let i = t.entry;
  for (; i && typeof i == "string" && t.segments[i] && !n.has(i); )
    n.add(i), e.push(i), i = t.segments[i].next;
  return e;
}
c(mg, "getSegmentOrder");
function aa(t, e) {
  if (t.setup)
    try {
      Pe(t.setup, e);
    } catch (i) {
      console.warn(`[${k}] Cinematic: error applying cinematic-level setup:`, i);
    }
  const n = mg(t);
  for (const i of n) {
    const r = t.segments[i];
    if (r.setup)
      try {
        Pe(r.setup, e);
      } catch (o) {
        console.warn(`[${k}] Cinematic: error applying setup for segment "${i}":`, o);
      }
    if (r.landing)
      try {
        Pe(r.landing, e);
      } catch (o) {
        console.warn(`[${k}] Cinematic: error applying landing for segment "${i}":`, o);
      }
  }
  if (t.landing)
    try {
      Pe(t.landing, e);
    } catch (i) {
      console.warn(`[${k}] Cinematic: error applying cinematic-level landing:`, i);
    }
  canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
}
c(aa, "applyAllSegmentLandingStates");
async function uo(t, e = "default", n = null) {
  var b, w, S, T, L, A, M, F;
  const i = t ?? ((b = canvas.scene) == null ? void 0 : b.id);
  if (!i) return;
  const r = `${i}:${e}`;
  if (n || (n = /* @__PURE__ */ new Set()), n.has(r)) {
    console.warn(`[${k}] Cinematic: circular transition detected at "${r}". Stopping chain.`), (S = (w = ui.notifications) == null ? void 0 : w.warn) == null || S.call(w, "Cinematic: circular transition detected, stopping.");
    return;
  }
  n.add(r), (_e == null ? void 0 : _e.status) === "running" && _e.cancel("replaced"), _e = null, Tn && (Tn.abort("replaced"), Tn = null);
  const o = sa(i, e);
  if (!o) {
    console.warn(`[${k}] Cinematic: no cinematic "${e}" on scene ${i}.`);
    return;
  }
  const s = await aE();
  if (!s || ((T = canvas.scene) == null ? void 0 : T.id) !== i || (await yu(), ((L = canvas.scene) == null ? void 0 : L.id) !== i)) return;
  const { targets: a, unresolved: l } = Zs(o);
  if (console.log(`[${k}] Cinematic "${e}": resolved ${a.size} targets`), l.length && console.warn(`[${k}] Cinematic "${e}": skipping ${l.length} unresolved: ${l.join(", ")}`), a.size === 0) {
    console.warn(`[${k}] Cinematic "${e}": no targets could be resolved on scene ${i}.`);
    return;
  }
  const u = cw(o);
  lo = lw(u, a), co = a;
  const d = hg(i, e), f = new AbortController();
  Tn = f;
  const h = o.synchronized === !0 && game.user.isGM, m = mg(o);
  if (m.length === 0) {
    console.warn(`[${k}] Cinematic "${e}": no segments to execute.`);
    return;
  }
  let p = 0;
  const y = /* @__PURE__ */ new Set();
  if (d) {
    const N = d.completedSegments ?? [];
    for (const x of N) y.add(x);
    const $ = m.indexOf(d.currentSegment);
    $ >= 0 && (p = $, console.log(`[${k}] Cinematic "${e}": resuming from segment "${d.currentSegment}" (${N.length} completed)`));
  }
  if (o.setup)
    try {
      Pe(o.setup, a), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    } catch (N) {
      console.error(`[${k}] Cinematic "${e}": error applying cinematic-level setup:`, N);
    }
  for (let N = 0; N < p; N++) {
    const $ = m[N], x = o.segments[$];
    if (x.setup)
      try {
        Pe(x.setup, a);
      } catch (R) {
        console.warn(`[${k}] Cinematic: error applying setup for completed segment "${$}":`, R);
      }
    if (x.landing)
      try {
        Pe(x.landing, a);
      } catch (R) {
        console.warn(`[${k}] Cinematic: error applying landing for completed segment "${$}":`, R);
      }
  }
  let E = !1, v = !1;
  pn({ type: "playback-start", sceneName: ((A = canvas.scene) == null ? void 0 : A.name) ?? i });
  try {
    for (let N = p; N < m.length; N++) {
      if (f.signal.aborted) {
        E = !0;
        break;
      }
      if (((M = canvas.scene) == null ? void 0 : M.id) !== i) {
        E = !0;
        break;
      }
      const $ = m[N], x = o.segments[$];
      if (console.log(`[${k}] Cinematic "${e}": entering segment "${$}"`), pn({ type: "segment-start", segmentName: $ }), iE(i, e, $, [...y]), x.gate) {
        pn({ type: "gate-wait", segmentName: $, gate: x.gate });
        try {
          await lE(x.gate, a, f);
        } catch (P) {
          if (f.signal.aborted) {
            E = !0;
            break;
          }
          throw P;
        }
        pn({ type: "gate-resolved", segmentName: $ });
      }
      if (f.signal.aborted) {
        E = !0;
        break;
      }
      if (x.setup)
        try {
          Pe(x.setup, a), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
        } catch (P) {
          console.error(`[${k}] Cinematic "${e}": error applying setup for segment "${$}":`, P);
        }
      if ((F = x.timeline) != null && F.length) {
        const P = Zu(x.timeline);
        pn({ type: "timeline-start", segmentName: $, durationMs: P });
        const { tl: j } = pw(
          { setup: {}, timeline: x.timeline },
          a,
          s,
          {
            timelineName: `cinematic-${i}-${e}-${$}`,
            onStepComplete: /* @__PURE__ */ c((B) => {
              pn({ type: "step-complete", segmentName: $, stepIndex: B });
            }, "onStepComplete")
          }
        );
        _e = j.run({
          broadcast: h,
          commit: h
        });
        try {
          await new Promise((B, z) => {
            j.onComplete(() => B()), j.onCancel(() => z(new Error("cancelled"))), j.onError((U) => z(new Error(`timeline error: ${U}`)));
            const Z = /* @__PURE__ */ c(() => z(new Error("cancelled")), "onAbort");
            f.signal.addEventListener("abort", Z, { once: !0 });
          });
        } catch (B) {
          if (B.message === "cancelled" || f.signal.aborted) {
            E = !0;
            break;
          }
          throw B;
        }
        pn({ type: "timeline-end", segmentName: $ });
      }
      if (f.signal.aborted) {
        E = !0;
        break;
      }
      if (x.landing)
        try {
          Pe(x.landing, a), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
        } catch (P) {
          console.error(`[${k}] Cinematic "${e}": error applying landing for segment "${$}":`, P);
        }
      pn({ type: "segment-complete", segmentName: $ }), y.add($);
      const R = x.next;
      if (R && typeof R == "object" && R.scene) {
        const P = R.scene, j = R.segment ?? o.entry;
        console.log(`[${k}] Cinematic "${e}": cross-scene transition to scene ${P}, segment "${j}"`), _e = null, Tn = null, pu(i, e), tf(), o.tracking !== !1 && await game.user.setFlag(k, Ji(i, e), !0), Li = { sceneId: P, cinematicName: e, visitedChain: n };
        const q = game.scenes.get(P);
        q ? q.view() : (console.warn(`[${k}] Cinematic: cross-scene transition target scene "${P}" not found.`), Li = null);
        return;
      }
    }
  } catch (N) {
    v = !0, console.error(`[${k}] Cinematic "${e}" error on scene ${i}:`, N);
  }
  if (_e = null, Tn = null, pu(i, e), tf(), lo = null, co = null, pn({ type: "playback-end", cancelled: !!E }), E) {
    console.log(`[${k}] Cinematic "${e}" cancelled on scene ${i}.`), aa(o, a);
    return;
  }
  if (v) {
    aa(o, a);
    return;
  }
  o.tracking !== !1 && await game.user.setFlag(k, Ji(i, e), !0), console.log(`[${k}] Cinematic "${e}" complete on scene ${i}.`);
}
c(uo, "playCinematic");
async function cE(t, e = "default") {
  var i;
  const n = t ?? ((i = canvas.scene) == null ? void 0 : i.id);
  n && (await game.user.unsetFlag(k, Ji(n, e)), console.log(`[${k}] Cinematic: cleared seen flag for "${e}" on scene ${n}.`));
}
c(cE, "resetCinematic");
async function uE(t, e, n = "default") {
  var o;
  if (!game.user.isGM) return;
  const i = t ?? ((o = canvas.scene) == null ? void 0 : o.id);
  if (!i || !e) return;
  const r = game.users.get(e);
  r && (await r.unsetFlag(k, Ji(i, n)), console.log(`[${k}] Cinematic: cleared seen flag for user ${r.name} on "${n}" scene ${i}.`));
}
c(uE, "resetCinematicForUser");
async function dE(t, e = "default") {
  var o;
  if (!game.user.isGM) return;
  const n = t ?? ((o = canvas.scene) == null ? void 0 : o.id);
  if (!n) return;
  const i = Ji(n, e), r = game.users.map((s) => s.getFlag(k, i) ? s.unsetFlag(k, i) : Promise.resolve());
  await Promise.all(r), console.log(`[${k}] Cinematic: cleared seen flag for all users on "${e}" scene ${n}.`);
}
c(dE, "resetCinematicForAll");
function fE(t, e = "default") {
  var r;
  const n = t ?? ((r = canvas.scene) == null ? void 0 : r.id);
  if (!n) return [];
  const i = Ji(n, e);
  return game.users.map((o) => ({
    userId: o.id,
    name: o.name,
    color: o.color ?? "#888888",
    isGM: o.isGM,
    seen: !!o.getFlag(k, i)
  }));
}
c(fE, "getSeenStatus");
function hE(t, e) {
  var i;
  const n = t ?? ((i = canvas.scene) == null ? void 0 : i.id);
  return e ? sa(n, e) != null : ul(n) != null;
}
c(hE, "hasCinematic");
function mE() {
  if (!lo || !co) {
    console.warn(`[${k}] Cinematic: no snapshot available for revert.`);
    return;
  }
  (_e == null ? void 0 : _e.status) === "running" && _e.cancel("reverted"), _e = null, Tn && (Tn.abort("reverted"), Tn = null);
  try {
    Pe(lo, co), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 }), console.log(`[${k}] Cinematic: reverted to pre-cinematic state.`);
  } catch (t) {
    console.error(`[${k}] Cinematic: error during revert:`, t);
  }
  lo = null, co = null;
}
c(mE, "revertCinematic");
async function gE() {
  const t = ++ir;
  if (console.log(`[${k}] Cinematic: canvasReady fired, gen=${t}, game.ready=${game.ready}`), await sE(), t !== ir) return;
  console.log(`[${k}] Cinematic: game is ready`);
  const e = canvas.scene;
  if (!e) {
    console.log(`[${k}] Cinematic: no canvas.scene, exiting`);
    return;
  }
  if (Li && Li.sceneId === e.id) {
    const o = Li;
    Li = null, console.log(`[${k}] Cinematic: picking up pending transition to "${o.cinematicName}" on scene ${e.id}`);
    try {
      await uo(e.id, o.cinematicName, o.visitedChain);
    } catch (s) {
      console.error(`[${k}] Cinematic: error during pending transition playback on scene ${e.id}:`, s);
    }
    return;
  }
  Li = null;
  const n = ul(e.id);
  if (!n) {
    console.log(`[${k}] Cinematic: no cinematic flag on scene ${e.id}, exiting`);
    return;
  }
  console.log(`[${k}] Cinematic: found ${Object.keys(n.cinematics).length} cinematic(s) on scene ${e.id}`);
  const i = [];
  for (const [o, s] of Object.entries(n.cinematics))
    (!s.trigger || s.trigger === "canvasReady") && i.push({ name: o, data: s });
  if (i.length === 0) {
    console.log(`[${k}] Cinematic: no canvasReady cinematics on scene ${e.id}, exiting`);
    return;
  }
  for (const { name: o } of i) {
    const s = hg(e.id, o);
    if (t !== ir) return;
    if (s) {
      console.log(`[${k}] Cinematic "${o}": found saved progress at segment "${s.currentSegment}", resuming...`);
      try {
        await uo(e.id, o);
      } catch (a) {
        console.error(`[${k}] Cinematic "${o}": error during resumed playback on scene ${e.id}:`, a);
      }
      return;
    }
  }
  let r = null;
  for (const { name: o, data: s } of i)
    if (!(s.tracking !== !1 && mf(e.id, o))) {
      r = { name: o, data: s };
      break;
    }
  if (!r) {
    if (console.log(`[${k}] Cinematic: all canvasReady cinematics already seen on scene ${e.id}`), pE(e.id, i), (_e == null ? void 0 : _e.status) === "running" && _e.cancel("already-seen"), _e = null, await yu(), t !== ir) return;
    for (const { name: o, data: s } of i)
      try {
        const { targets: a } = Zs(s);
        aa(s, a);
      } catch (a) {
        console.error(`[${k}] Cinematic "${o}": error applying landing states (already seen) on scene ${e.id}:`, a);
      }
    canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    return;
  }
  if (t === ir && (console.log(`[${k}] Cinematic: playing first unseen cinematic "${r.name}"...`), await yu(), t === ir)) {
    for (const { name: o, data: s } of i) {
      if (o === r.name) continue;
      if (s.tracking !== !1 && mf(e.id, o))
        try {
          const { targets: l } = Zs(s);
          aa(s, l);
        } catch (l) {
          console.error(`[${k}] Cinematic "${o}": error applying landing states (already seen) on scene ${e.id}:`, l);
        }
    }
    try {
      await uo(e.id, r.name);
    } catch (o) {
      console.error(`[${k}] Cinematic "${r.name}": error during playback on scene ${e.id}:`, o);
    }
  }
}
c(gE, "onCanvasReady$2");
function pE(t, e) {
  for (const { name: n } of e)
    pu(t, n);
}
c(pE, "clearAllCanvasReadyProgress");
function yE(t = 3e5) {
  var i;
  const e = (i = game.user.flags) == null ? void 0 : i[k];
  if (!e) return;
  const n = Date.now();
  for (const r of Object.keys(e)) {
    if (!r.startsWith("cinematic-progress-")) continue;
    const o = e[r];
    if (!o || typeof o.timestamp != "number") {
      game.user.unsetFlag(k, r).catch(() => {
      });
      continue;
    }
    n - o.timestamp > t && (console.log(`[${k}] Cinematic: cleaning up stale progress flag "${r}" (age: ${n - o.timestamp}ms)`), game.user.unsetFlag(k, r).catch(() => {
    }));
  }
}
c(yE, "cleanupStaleProgressFlags");
function bE() {
  Hooks.on("getSceneControlButtons", (t) => {
    if (!game.user.isGM) return;
    const e = Array.isArray(t) ? t : t instanceof Map ? Array.from(t.values()) : Object.values(t);
    if (!e.length) return;
    const n = e.find((s) => (s == null ? void 0 : s.name) === "tiles") ?? e.find((s) => (s == null ? void 0 : s.name) === "tokens" || (s == null ? void 0 : s.name) === "token") ?? e[0];
    if (!n) return;
    const i = n.tools, r = "eidolonCinematicEditor";
    if (Array.isArray(i) && i.some((s) => (s == null ? void 0 : s.name) === r) || i instanceof Map && i.has(r)) return;
    const o = {
      name: r,
      title: "Cinematic Editor",
      icon: "fa-solid fa-film",
      button: !0,
      toggle: !1,
      visible: !0,
      onClick: /* @__PURE__ */ c(() => {
        new lu({ scene: canvas.scene }).render(!0);
      }, "onClick")
    };
    Array.isArray(i) ? i.push(o) : i instanceof Map ? i.set(r, o) : i && typeof i == "object" ? i[r] = o : n.tools = [o];
  });
}
c(bE, "registerEditorButton");
function vE() {
  Hooks.on("canvasReady", gE), bE(), Hooks.once("ready", () => {
    yE();
    const t = game.modules.get(k);
    t.api || (t.api = {}), t.api.cinematic = {
      play: uo,
      reset: cE,
      resetForUser: uE,
      resetForAll: dE,
      getSeenStatus: fE,
      has: hE,
      get: sa,
      list: oE,
      revert: mE,
      onPlaybackProgress: nE,
      TileAnimator: Xi,
      registerBehaviour: we,
      getBehaviour: _s,
      trigger: /* @__PURE__ */ c(async (e, n, i = "default") => {
        var s;
        const r = n ?? ((s = canvas.scene) == null ? void 0 : s.id);
        if (!r) return;
        const o = sa(r, i);
        o && (o.trigger && o.trigger !== e || await uo(r, i));
      }, "trigger")
    }, console.log(`[${k}] Cinematic API registered (v5).`);
  });
}
c(vE, "registerCinematicHooks");
function bu(t, e) {
  const n = Math.abs(t.width), i = Math.abs(t.height), r = n / 2, o = i / 2;
  let s = e.x - (t.x + r), a = e.y - (t.y + o);
  if (t.rotation !== 0) {
    const l = Math.toRadians(t.rotation), u = Math.cos(l), d = Math.sin(l), f = u * s + d * a, h = u * a - d * s;
    s = f, a = h;
  }
  return s += r, a += o, s >= 0 && s <= n && a >= 0 && a <= i;
}
c(bu, "pointWithinTile");
sl("tile-click", (t, e) => t.target ? new Promise((n, i) => {
  var m;
  if (e.signal.aborted) return i(e.signal.reason ?? "aborted");
  const r = ll(t.target);
  if (!((m = r == null ? void 0 : r.placeables) != null && m.length))
    return i(new Error(`await tile-click: no placeables found for "${t.target}"`));
  const o = r.placeables, s = [];
  for (const { placeable: p } of o) {
    const y = new Xi(p, t.animation);
    y.start("idle"), s.push({ placeable: p, animator: y });
  }
  const a = document.getElementById("board");
  let l = null;
  const u = /* @__PURE__ */ c((p) => {
    const y = canvas.activeLayer;
    if (!y) return;
    const E = y.toLocal(p);
    if (!E || isNaN(E.x) || isNaN(E.y)) return;
    let v = !1;
    for (const { placeable: b, animator: w } of s)
      bu(b.document, E) ? (v = !0, w.state !== "hover" && w.setState("hover")) : w.state === "hover" && w.setState("idle");
    v ? l === null && (l = document.body.style.cursor, document.body.style.cursor = "pointer") : l !== null && (document.body.style.cursor = l, l = null);
  }, "onPointerMove");
  a == null || a.addEventListener("pointermove", u);
  const d = /* @__PURE__ */ c((p) => {
    if (p.button !== 0) return;
    const y = canvas.activeLayer;
    if (!y) return;
    const E = y.toLocal(p);
    isNaN(E.x) || isNaN(E.y) || !o.filter(({ doc: b }) => bu(b, E)).sort((b, w) => (w.doc.sort ?? 0) - (b.doc.sort ?? 0))[0] || (p.stopPropagation(), p.preventDefault(), h(), n());
  }, "onPointerDown");
  a == null || a.addEventListener("pointerdown", d, { capture: !0 });
  const f = /* @__PURE__ */ c(() => {
    h(), i(e.signal.reason ?? "aborted");
  }, "onAbort");
  e.signal.addEventListener("abort", f, { once: !0 });
  function h() {
    a == null || a.removeEventListener("pointerdown", d, { capture: !0 }), a == null || a.removeEventListener("pointermove", u), e.signal.removeEventListener("abort", f);
    for (const { animator: p } of s)
      p.detach();
    l !== null ? (document.body.style.cursor = l, l = null) : document.body.style.cursor = "";
  }
  c(h, "cleanup");
}) : Promise.reject(new Error('await tile-click: "target" is required')));
vE();
function wE() {
  Hooks.once("ready", () => {
    const t = game.modules.get(k);
    t.api || (t.api = {}), t.api.picker = {
      /** Open the picker window. Returns Promise<string[] | null>. */
      open: /* @__PURE__ */ c((e) => oa.open(e), "open"),
      /** Resolve a selector string to documents. */
      resolveSelector: ll,
      /** Parse a selector string into { type, value }. */
      parseSelector: Qu,
      /** Build a selector string from { type, value }. */
      buildSelector: iw,
      /** Build a tag selector from tags array + mode. */
      buildTagSelector: Mm,
      /** Canvas highlight utilities. */
      highlight: {
        add: ra,
        remove: _r,
        has: jm,
        clearAll: xs
      }
    }, console.log(`[${k}] Placeable Picker API registered.`);
  });
}
c(wE, "registerPlaceablePickerHooks");
wE();
const Yr = "canvas-popup", EE = 100;
function SE(t) {
  const e = canvas.stage.worldTransform, n = document.getElementById("board"), i = n == null ? void 0 : n.getBoundingClientRect(), r = (i == null ? void 0 : i.left) ?? 0, o = (i == null ? void 0 : i.top) ?? 0;
  return {
    x: e.a * t.x + e.c * t.y + e.tx + r,
    y: e.b * t.x + e.d * t.y + e.ty + o
  };
}
c(SE, "canvasToScreen");
function CE() {
  var t, e;
  return ((e = (t = canvas.stage) == null ? void 0 : t.scale) == null ? void 0 : e.x) ?? 1;
}
c(CE, "getZoom");
function Dl(t, e) {
  var n;
  return e === "grid" ? t * (((n = canvas.grid) == null ? void 0 : n.size) ?? 100) : t;
}
c(Dl, "resolveUnit");
function TE(t, e) {
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
c(TE, "attachClickOutside");
function LE(t, e) {
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
c(LE, "attachRightClickOutside");
function IE(t, e) {
  function n(i) {
    i.key === "Escape" && (i.preventDefault(), i.stopPropagation(), e());
  }
  return c(n, "handler"), document.addEventListener("keydown", n, !0), () => {
    document.removeEventListener("keydown", n, !0);
  };
}
c(IE, "attachEscape");
const Pl = /* @__PURE__ */ new Set(), us = 8, gf = 0.5, bd = class bd {
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
    var n, i, r, o, s;
    this._anchor = this._resolveAnchor(e.anchor), this._offset = { x: ((n = e.offset) == null ? void 0 : n.x) ?? 0, y: ((i = e.offset) == null ? void 0 : i.y) ?? 0 }, this._anchorX = e.anchorX ?? "left", this._anchorY = e.anchorY ?? "top", this._sizeUnit = e.sizeUnit ?? "grid", this._dismiss = {
      clickOutside: ((r = e.dismiss) == null ? void 0 : r.clickOutside) ?? !0,
      rightClickOutside: ((o = e.dismiss) == null ? void 0 : o.rightClickOutside) ?? !1,
      escape: ((s = e.dismiss) == null ? void 0 : s.escape) ?? !0
    }, this._cssClass = e.cssClass ?? "", this._animate = e.animate ?? !0, this._width = e.width ?? null, this._clampToViewport = e.clampToViewport ?? !0, this._initialContent = e.content ?? null, this.element = null, this.isOpen = !1, this._cleanups = [], this._listeners = /* @__PURE__ */ new Map(), this._hookId = null, this._tickerFn = null, this._lastScreenPos = { x: -99999, y: -99999 };
  }
  // ── Public API ────────────────────────────────────────────────────────
  /**
   * Append popup to the DOM and start tracking.
   * @returns {this}
   */
  mount() {
    var o;
    if (this.isOpen) return this;
    const e = document.createElement("div");
    e.className = Yr, this._cssClass && e.classList.add(...this._cssClass.split(/\s+/)), e.style.position = "fixed", e.style.zIndex = EE;
    const n = document.createElement("div");
    n.className = `${Yr}__content`, e.appendChild(n), this.element = e, this._contentWrap = n;
    const i = this._resolveWidth();
    i != null && (n.style.width = `${i}px`, n.style.minWidth = "0", n.style.boxSizing = "border-box"), this._initialContent && this.setContent(this._initialContent), document.body.appendChild(e), this.reposition(), this._animate ? requestAnimationFrame(() => {
      this.element && this.element.classList.add(`${Yr}--visible`);
    }) : e.classList.add(`${Yr}--visible`), this._hookId = Hooks.on("canvasPan", () => this.reposition()), this._anchor.placeable && ((o = canvas.app) != null && o.ticker) && (this._tickerFn = () => this.reposition(), canvas.app.ticker.add(this._tickerFn));
    const r = /* @__PURE__ */ c((s) => {
      this._emit("dismiss", s), this.destroy();
    }, "dismissFn");
    return this._dismiss.clickOutside && this._cleanups.push(TE(e, () => r("clickOutside"))), this._dismiss.rightClickOutside && this._cleanups.push(LE(e, () => r("rightClickOutside"))), this._dismiss.escape && this._cleanups.push(IE(e, () => r("escape"))), this.isOpen = !0, Pl.add(this), this._emit("open"), this;
  }
  /**
   * Remove from DOM and clean up everything. Idempotent.
   */
  destroy() {
    var n;
    if (!this.isOpen) return;
    this.isOpen = !1, Pl.delete(this);
    for (const i of this._cleanups) i();
    this._cleanups.length = 0, this._hookId != null && (Hooks.off("canvasPan", this._hookId), this._hookId = null), this._tickerFn && ((n = canvas.app) != null && n.ticker) && (canvas.app.ticker.remove(this._tickerFn), this._tickerFn = null);
    const e = this.element;
    if (e) {
      if (this._animate) {
        e.classList.remove(`${Yr}--visible`);
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
    var r, o;
    const n = !!this._anchor.placeable;
    this._anchor = this._resolveAnchor(e);
    const i = !!this._anchor.placeable;
    n && !i && this._tickerFn && ((r = canvas.app) != null && r.ticker) ? (canvas.app.ticker.remove(this._tickerFn), this._tickerFn = null) : !n && i && this.isOpen && ((o = canvas.app) != null && o.ticker) && !this._tickerFn && (this._tickerFn = () => this.reposition(), canvas.app.ticker.add(this._tickerFn)), this._lastScreenPos = { x: -99999, y: -99999 }, this.reposition();
  }
  /**
   * Force recalculate position. Auto-called on canvasPan and ticker.
   */
  reposition() {
    if (!this.element) return;
    const e = this._getAnchorCanvasPoint();
    if (!e) return;
    const n = CE(), i = this._sizeUnit !== "screen", r = Dl(this._offset.x, this._sizeUnit), o = Dl(this._offset.y, this._sizeUnit), s = {
      x: e.x + r,
      y: e.y + o
    }, a = SE(s);
    if (Math.abs(a.x - this._lastScreenPos.x) < gf && Math.abs(a.y - this._lastScreenPos.y) < gf)
      return;
    this._lastScreenPos = { x: a.x, y: a.y };
    const l = this.element, u = i ? n : 1;
    i ? (l.style.transformOrigin = `${this._anchorX} ${this._anchorY}`, l.style.transform = `scale(${u})`) : (l.style.transform = "", l.style.transformOrigin = "");
    let d = 0, f = 0;
    const h = l.getBoundingClientRect();
    this._anchorX === "center" ? d = -h.width / 2 : this._anchorX === "right" && (d = -h.width), this._anchorY === "center" ? f = -h.height / 2 : this._anchorY === "bottom" && (f = -h.height);
    let m = a.x + d, p = a.y + f;
    if (this._clampToViewport) {
      const y = window.innerWidth - h.width - us, E = window.innerHeight - h.height - us;
      m = Math.max(us, Math.min(m, y)), p = Math.max(us, Math.min(p, E));
    }
    l.style.left = `${m}px`, l.style.top = `${p}px`, this._emit("reposition", { x: m, y: p });
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
    for (const e of [...Pl])
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
    return this._width == null ? null : this._width === "anchor" ? this._getAnchorSize().width : Dl(this._width, this._sizeUnit);
  }
  /**
   * Get the anchor placeable's canvas-pixel size.
   * Works across tiles, drawings, tokens, etc.
   * @returns {{ width: number, height: number }}
   */
  _getAnchorSize() {
    var i, r, o;
    const e = this._anchor.placeable;
    if (!e) return { width: 0, height: 0 };
    const n = e.document;
    return ((i = n == null ? void 0 : n.shape) == null ? void 0 : i.width) != null ? { width: n.shape.width, height: n.shape.height } : (n == null ? void 0 : n.width) != null ? { width: n.width, height: n.height } : (n == null ? void 0 : n.width) != null ? { width: n.width * (((r = canvas.grid) == null ? void 0 : r.size) ?? 100), height: n.height * (((o = canvas.grid) == null ? void 0 : o.size) ?? 100) } : { width: 0, height: 0 };
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
        } catch (o) {
          console.error(`[CanvasPopup] Error in '${e}' listener:`, o);
        }
  }
};
c(bd, "CanvasPopup");
let la = bd;
const Ei = "canvas-popup-options";
function kE({ sections: t = [] } = {}) {
  const e = /* @__PURE__ */ new Map(), n = document.createElement("div");
  n.className = Ei;
  for (const a of t) {
    const l = document.createElement("div");
    l.className = `${Ei}__section`;
    const u = document.createElement("div");
    u.className = `${Ei}__header`, u.textContent = a.label, l.appendChild(u);
    for (const d of a.items) {
      const f = document.createElement("div");
      f.className = `${Ei}__item`, d.active && f.classList.add(`${Ei}__item--active`), f.dataset.key = a.key, f.dataset.value = d.value;
      const h = document.createElement("span");
      h.className = `${Ei}__dot`, f.appendChild(h);
      const m = document.createElement("span");
      m.className = `${Ei}__label`, m.textContent = d.label, f.appendChild(m), f.addEventListener("click", (p) => {
        i("select", a.key, d.value, d, p);
      }), f.addEventListener("mouseenter", () => {
        i("hover", a.key, d.value, d);
      }), f.addEventListener("mouseleave", () => {
        i("hoverEnd", a.key, d.value, d);
      }), l.appendChild(f);
    }
    n.appendChild(l);
  }
  function i(a, ...l) {
    const u = e.get(a);
    if (u)
      for (const d of u)
        try {
          d(...l);
        } catch (f) {
          console.error(`[OptionList] Error in '${a}' listener:`, f);
        }
  }
  c(i, "emit");
  function r(a, l) {
    e.has(a) || e.set(a, /* @__PURE__ */ new Set()), e.get(a).add(l);
  }
  c(r, "on");
  function o(a, l) {
    var u;
    (u = e.get(a)) == null || u.delete(l);
  }
  c(o, "off");
  function s() {
    e.clear(), n.remove();
  }
  return c(s, "destroy"), { element: n, on: r, off: o, destroy: s };
}
c(kE, "createOptionList");
function OE() {
  Hooks.once("ready", () => {
    const t = game.modules.get(k);
    t.api || (t.api = {}), t.api.canvasPopup = {
      CanvasPopup: la,
      content: { createOptionList: kE }
    }, console.log(`[${k}] Canvas Popup API registered.`);
  }), Hooks.on("canvasTearDown", () => la.destroyAll());
}
c(OE, "registerCanvasPopupHooks");
OE();
function AE(t, e) {
  const n = t.shape;
  if (!n) return !1;
  const i = t.x ?? 0, r = t.y ?? 0, o = n.width ?? 0, s = n.height ?? 0, a = t.rotation ?? 0, l = i + o / 2, u = r + s / 2;
  let d = e.x - l, f = e.y - u;
  if (a !== 0) {
    const h = Math.toRadians(a), m = Math.cos(h), p = Math.sin(h), y = m * d + p * f, E = m * f - p * d;
    d = y, f = E;
  }
  switch (d += o / 2, f += s / 2, n.type) {
    case "r":
      return d >= 0 && d <= o && f >= 0 && f <= s;
    case "e": {
      const h = o / 2, m = s / 2;
      if (h <= 0 || m <= 0) return !1;
      const p = (d - h) / h, y = (f - m) / m;
      return p * p + y * y <= 1;
    }
    case "p": {
      const h = n.points;
      return !Array.isArray(h) || h.length < 6 ? !1 : ME(d, f, h);
    }
    case "f":
      return d >= 0 && d <= o && f >= 0 && f <= s;
    default:
      return !1;
  }
}
c(AE, "pointWithinDrawing");
function ME(t, e, n) {
  let i = !1;
  const r = n.length;
  for (let o = 0, s = r - 2; o < r; s = o, o += 2) {
    const a = n[o], l = n[o + 1], u = n[s], d = n[s + 1];
    l > e != d > e && t < (u - a) * (e - l) / (d - l) + a && (i = !i);
  }
  return i;
}
c(ME, "pointInPolygon");
const fo = "eidolon-utilities", xE = "tile-interactions", _E = "tile-animations", NE = "idle-animation";
function $E(t) {
  const e = t.type ?? "tile-prop";
  return e === "tile-tint" ? { name: "tween-tint", fromColor: t.fromColor, toColor: t.toColor, mode: t.mode, period: t.period, easing: t.easing } : e === "tile-scale" ? { name: "tween-scale", fromScale: t.fromScale, toScale: t.toScale, period: t.period, easing: t.easing } : { name: "tween-prop", attribute: t.attribute, from: t.from, to: t.to, period: t.period, easing: t.easing };
}
c($E, "migrateIdleTweenToAlways");
function td(t) {
  var u, d, f;
  const e = (u = t == null ? void 0 : t.getFlag) == null ? void 0 : u.call(t, fo, _E);
  if (e) return e;
  const n = (d = t == null ? void 0 : t.getFlag) == null ? void 0 : d.call(t, fo, NE), i = (f = t == null ? void 0 : t.getFlag) == null ? void 0 : f.call(t, fo, xE);
  let r = [], o = [], s = [], a = [];
  if (n) {
    let h;
    Array.isArray(n) ? h = n : typeof n == "object" && "0" in n ? h = Object.values(n) : typeof n == "object" && (n.type || n.attribute) ? h = [n] : h = [], r = h.filter((m) => m && typeof m == "object").map($E);
  }
  return i && (i.hover && (Array.isArray(i.hover) ? s = i.hover : typeof i.hover == "object" && (o = Array.isArray(i.hover.idle) ? i.hover.idle : [], s = Array.isArray(i.hover.enter) ? i.hover.enter : [])), Array.isArray(i.click) && i.click.length && (a = i.click)), r.length > 0 || o.length > 0 || s.length > 0 || a.length > 0 ? { always: r, idle: o, hover: s, click: a } : null;
}
c(td, "readUnifiedConfig");
const xn = /* @__PURE__ */ new Map(), hi = /* @__PURE__ */ new Map(), pf = /* @__PURE__ */ new WeakMap(), ho = /* @__PURE__ */ new Set();
let Yt = null, st = null, Wt = null, dn = null, fn = null;
function gg(t) {
  const e = canvas.activeLayer;
  if (!e) return null;
  const n = e.toLocal(t);
  return !n || Number.isNaN(n.x) || Number.isNaN(n.y) ? null : n;
}
c(gg, "canvasToLocal");
function pg(t) {
  let e = null, n = -1 / 0;
  for (const [i, r] of xn) {
    if (!(r.placeableType === "drawing" ? AE(r.doc, t) : bu(r.doc, t))) continue;
    const s = (r.doc.sort ?? 0) + (r.placeableType === "drawing" ? 1e9 : 0);
    s > n && (e = r, n = s);
  }
  return e;
}
c(pg, "hitTest");
function FE(t) {
  var e, n;
  return {
    always: t.always ?? [],
    idle: (e = t.idle) != null && e.length ? t.idle : ["none"],
    hover: (n = t.hover) != null && n.length ? t.hover : ["none"]
  };
}
c(FE, "buildAnimatorConfig");
function nd(t, e, n) {
  Zo(t);
  const i = FE(n), r = new Xi(e, i);
  r.start("idle"), hi.set(t, r);
}
c(nd, "startHoverAnimator");
function Zo(t) {
  const e = hi.get(t);
  e && (e.detach(), hi.delete(t));
}
c(Zo, "stopHoverAnimator");
function Rl(t, e, n, i) {
  return e.type === "tile-tint" ? { uuid: t, toColor: n ? e.toColor : e.fromColor, mode: e.mode } : e.type === "tile-scale" ? {
    uuid: t,
    toScale: n ? e.toScale : e.fromScale,
    ...i
  } : { uuid: t, attribute: e.attribute, value: n ? e.to : e.from };
}
c(Rl, "buildClickParams");
function DE(t) {
  const e = t._source.width, n = t._source.height, i = t._source.x, r = t._source.y;
  return {
    baseWidth: e,
    baseHeight: n,
    centerX: i + e / 2,
    centerY: r + n / 2
  };
}
c(DE, "captureRefGeometry");
async function PE(t, e) {
  const n = t.uuid, i = e.type ?? "tile-prop", r = Hr(i);
  if (!r) {
    console.warn(`[${fo}] tile-interactions: unknown tween type "${i}"`);
    return;
  }
  const o = e.period ?? 300, s = e.easing ?? "easeOutCubic", a = e.mode ?? "bounce", l = i === "tile-scale" ? DE(t) : null;
  if (a === "toggle") {
    const d = !(pf.get(t) ?? !1);
    await r.execute(
      Rl(n, e, d, l),
      { durationMS: o, easing: s, commit: !0 }
    ), pf.set(t, d);
  } else {
    const u = o / 2;
    await r.execute(
      Rl(n, e, !0, l),
      { durationMS: u, easing: s, commit: !1 }
    ), await r.execute(
      Rl(n, e, !1, l),
      { durationMS: u, easing: s, commit: !1 }
    );
  }
}
c(PE, "playClickAnimation");
async function RE(t) {
  var n, i, r, o, s;
  const e = t.doc.id;
  if (!ho.has(e)) {
    ho.add(e);
    try {
      if (Zo(e), (n = t.clickConfig) != null && n.length) {
        const a = t.clickConfig.map((l) => PE(t.doc, l));
        await Promise.all(a);
      }
      if (t.macroUuid) {
        const a = await fromUuid(t.macroUuid);
        a ? a.execute({ placeable: t.placeable }) : console.warn(`[${fo}] tile-interactions: macro not found: ${t.macroUuid}`);
      }
    } finally {
      ho.delete(e), t.animConfig && (((i = t.animConfig.always) == null ? void 0 : i.length) > 0 || ((r = t.animConfig.idle) == null ? void 0 : r.length) > 0 || ((o = t.animConfig.hover) == null ? void 0 : o.length) > 0) && (nd(e, t.placeable, t.animConfig), Yt === e && ((s = hi.get(e)) == null || s.setState("hover")));
    }
  }
}
c(RE, "handleClick");
function yg(t) {
  var l, u, d;
  const e = gg(t);
  if (!e) return;
  const n = pg(e), i = (n == null ? void 0 : n.doc.id) ?? null;
  if (i === Yt) return;
  if (Yt) {
    const f = hi.get(Yt);
    f && f.setState("idle");
  }
  if (i) {
    const f = hi.get(i);
    f && f.setState("hover");
  }
  Yt = i;
  const r = (l = canvas.tokens) == null ? void 0 : l.active, o = (u = n == null ? void 0 : n.animConfig) == null ? void 0 : u.cursor, s = r && i && (o === !0 || o !== !1 && (((d = n.clickConfig) == null ? void 0 : d.length) || n.macroUuid)), a = document.getElementById("board");
  s ? (st === null && (st = (a == null ? void 0 : a.style.cursor) ?? ""), a && (a.style.cursor = "pointer")) : st !== null && (a && (a.style.cursor = st), st = null);
}
c(yg, "onPointerMove");
function bg(t) {
  var i, r;
  if (t.button !== 0 || !((i = canvas.tokens) != null && i.active)) return;
  const e = gg(t);
  if (!e) return;
  const n = pg(e);
  n && (!((r = n.clickConfig) != null && r.length) && !n.macroUuid || RE(n));
}
c(bg, "onPointerDown");
function vg() {
  if (Yt) {
    const t = hi.get(Yt);
    t && t.setState("idle"), Yt = null;
  }
  if (st !== null) {
    const t = document.getElementById("board");
    t && (t.style.cursor = st), st = null;
  }
}
c(vg, "onPointerLeave");
function yf(t, e, n) {
  var a, l, u;
  const i = td(t);
  if (!i) return;
  const r = ((a = i.always) == null ? void 0 : a.length) > 0 || ((l = i.idle) == null ? void 0 : l.length) > 0 || ((u = i.hover) == null ? void 0 : u.length) > 0, o = Array.isArray(i.click) && i.click.length ? i.click : null, s = i.macro || null;
  !r && !o && !s || (xn.set(t.id, { doc: t, placeable: e, animConfig: i, clickConfig: o, macroUuid: s, placeableType: n }), r && nd(t.id, e, i));
}
c(yf, "registerPlaceable");
function wg() {
  var i, r;
  for (const o of hi.keys())
    Zo(o);
  if (xn.clear(), ho.clear(), Yt = null, st !== null) {
    const o = document.getElementById("board");
    o && (o.style.cursor = st), st = null;
  }
  const t = document.getElementById("board");
  Wt && (t == null || t.removeEventListener("pointermove", Wt), Wt = null), dn && (t == null || t.removeEventListener("pointerdown", dn), dn = null), fn && (t == null || t.removeEventListener("pointerleave", fn), fn = null);
  const e = (i = canvas.tiles) == null ? void 0 : i.placeables;
  if (Array.isArray(e))
    for (const o of e)
      yf(o.document, o, "tile");
  const n = (r = canvas.drawings) == null ? void 0 : r.placeables;
  if (Array.isArray(n))
    for (const o of n)
      yf(o.document, o, "drawing");
  xn.size !== 0 && (Wt = yg, dn = bg, fn = vg, t == null || t.addEventListener("pointermove", Wt), t == null || t.addEventListener("pointerdown", dn), t == null || t.addEventListener("pointerleave", fn));
}
c(wg, "rebuild");
function HE(t) {
  Eg(t, "tile");
}
c(HE, "updateTile");
function qE(t) {
  id(t);
}
c(qE, "removeTile");
function jE(t) {
  Eg(t, "drawing");
}
c(jE, "updateDrawing");
function BE(t) {
  id(t);
}
c(BE, "removeDrawing");
function Eg(t, e) {
  var l, u, d;
  const n = t.id, i = td(t), r = i && (((l = i.always) == null ? void 0 : l.length) > 0 || ((u = i.idle) == null ? void 0 : u.length) > 0 || ((d = i.hover) == null ? void 0 : d.length) > 0), o = i && Array.isArray(i.click) && i.click.length ? i.click : null, s = (i == null ? void 0 : i.macro) || null;
  if (!r && !o && !s) {
    id(t);
    return;
  }
  Zo(n);
  const a = t.object;
  if (!a) {
    xn.delete(n);
    return;
  }
  xn.set(n, { doc: t, placeable: a, animConfig: i, clickConfig: o, macroUuid: s, placeableType: e }), r && nd(n, a, i), UE();
}
c(Eg, "updatePlaceable");
function id(t) {
  const e = t.id;
  if (Zo(e), xn.delete(e), ho.delete(e), Yt === e && (Yt = null, st !== null)) {
    const n = document.getElementById("board");
    n && (n.style.cursor = st), st = null;
  }
  if (xn.size === 0) {
    const n = document.getElementById("board");
    Wt && (n == null || n.removeEventListener("pointermove", Wt), Wt = null), dn && (n == null || n.removeEventListener("pointerdown", dn), dn = null), fn && (n == null || n.removeEventListener("pointerleave", fn), fn = null);
  }
}
c(id, "removePlaceable");
function UE() {
  if (xn.size === 0 || Wt) return;
  const t = document.getElementById("board");
  t && (Wt = yg, dn = bg, fn = vg, t.addEventListener("pointermove", Wt), t.addEventListener("pointerdown", dn), t.addEventListener("pointerleave", fn));
}
c(UE, "ensureListeners");
function sr(t, e, n) {
  const i = document.createElement("div");
  i.classList.add("form-group");
  const r = document.createElement("label");
  r.textContent = t;
  const o = document.createElement("select");
  o.classList.add(e);
  for (const s of n) {
    const a = document.createElement("option");
    a.value = s.value, a.textContent = s.label, s.selected && (a.selected = !0), o.appendChild(a);
  }
  return i.append(r, o), i;
}
c(sr, "buildSelectGroup");
function ar(t, e, n, i = {}) {
  const r = document.createElement("div");
  r.classList.add("form-group");
  const o = document.createElement("label");
  o.textContent = t;
  const s = document.createElement("input");
  s.type = "number", s.classList.add(e), s.value = String(n);
  for (const [a, l] of Object.entries(i)) s.setAttribute(a, l);
  return r.append(o, s), r;
}
c(ar, "buildNumberGroup");
function vu(t, e, n) {
  const i = document.createElement("div");
  i.classList.add("form-group");
  const r = document.createElement("label");
  r.textContent = t;
  const o = document.createElement("div");
  o.classList.add("idle-anim__color-wrapper");
  const s = document.createElement("input");
  s.type = "color", s.classList.add(e), s.value = n;
  const a = document.createElement("input");
  return a.type = "text", a.classList.add(`${e}-text`), a.value = n, a.maxLength = 7, s.addEventListener("input", () => {
    a.value = s.value;
  }), a.addEventListener("change", () => {
    /^#[0-9a-f]{6}$/i.test(a.value) && (s.value = a.value);
  }), o.append(s, a), i.append(r, o), i;
}
c(vu, "buildColorGroup");
let le = null;
function Hl() {
  for (const t of document.querySelectorAll(".idle-anim__slot--insert-before, .idle-anim__slot--insert-after"))
    t.classList.remove("idle-anim__slot--insert-before", "idle-anim__slot--insert-after");
}
c(Hl, "clearInsertIndicators");
function bf(t) {
  for (const e of document.querySelectorAll(".idle-anim__slots"))
    e.classList.toggle("idle-anim__slots--drag-active", t);
}
c(bf, "setDragActive");
function ca(t, e) {
  t.dispatchEvent(new CustomEvent("slot-reorder", { detail: { card: e } }));
}
c(ca, "notifyReorder");
function Sg(t, { dropGroup: e, handleSelector: n = ".idle-anim__slot-header" }) {
  t.setAttribute("draggable", "true");
  let i = !1;
  t.addEventListener("pointerdown", (r) => {
    i = !!r.target.closest(n);
  }), t.addEventListener("dragstart", (r) => {
    if (!i) {
      r.preventDefault();
      return;
    }
    le = { card: t, sourceContainer: t.parentElement, group: e, insertMode: null, insertTarget: null }, t.classList.add("is-dragging"), bf(!0), r.dataTransfer.effectAllowed = "move", r.dataTransfer.setData("text/plain", "");
  }), t.addEventListener("dragover", (r) => {
    if (!le || le.group !== e || le.card === t) return;
    r.preventDefault(), r.dataTransfer.dropEffect = "move";
    const o = t.getBoundingClientRect(), s = o.top + o.height / 2, a = r.clientY < s ? "before" : "after";
    (le.insertTarget !== t || le.insertMode !== a) && (Hl(), t.classList.add(a === "before" ? "idle-anim__slot--insert-before" : "idle-anim__slot--insert-after"), le.insertTarget = t, le.insertMode = a);
  }), t.addEventListener("dragleave", () => {
    t.classList.remove("idle-anim__slot--insert-before", "idle-anim__slot--insert-after"), (le == null ? void 0 : le.insertTarget) === t && (le.insertTarget = null, le.insertMode = null);
  }), t.addEventListener("drop", (r) => {
    if (r.preventDefault(), r.stopPropagation(), Hl(), !le || le.group !== e || le.card === t) return;
    const o = le.card, s = le.sourceContainer, a = t.parentElement;
    le.insertMode === "after" ? a.insertBefore(o, t.nextSibling) : a.insertBefore(o, t), ca(a, o), s !== a && ca(s, o), le = null;
  }), t.addEventListener("dragend", () => {
    t.classList.remove("is-dragging"), Hl(), bf(!1);
    for (const r of document.querySelectorAll(".idle-anim__slots--drag-over"))
      r.classList.remove("idle-anim__slots--drag-over");
    le = null;
  });
}
c(Sg, "makeDraggable");
function Cg(t, { dropGroup: e, onDrop: n }) {
  t.addEventListener("dragover", (i) => {
    !le || le.group !== e || (i.preventDefault(), i.dataTransfer.dropEffect = "move");
  }), t.addEventListener("dragenter", (i) => {
    !le || le.group !== e || (i.preventDefault(), t.classList.add("idle-anim__slots--drag-over"));
  }), t.addEventListener("dragleave", (i) => {
    i.relatedTarget && t.contains(i.relatedTarget) || t.classList.remove("idle-anim__slots--drag-over");
  }), t.addEventListener("drop", (i) => {
    if (i.preventDefault(), t.classList.remove("idle-anim__slots--drag-over"), !le || le.group !== e) return;
    const r = le.card, o = le.sourceContainer;
    t.appendChild(r), ca(t, r), o !== t && ca(o, r), le = null;
  }), t.addEventListener("slot-reorder", (i) => {
    n == null || n(i.detail.card, t);
  });
}
c(Cg, "makeDropContainer");
const ds = "eidolon-utilities", vf = "tile-animations", VE = "tile-interactions", GE = "idle-animation", WE = "eidolon-idle-animation", zE = "fa-solid fa-wave-pulse", Tg = [
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
], YE = [
  { value: "tween-prop", label: "Numeric" },
  { value: "tween-tint", label: "Tint" },
  { value: "tween-scale", label: "Scale" }
], Lg = {
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
}, lr = {
  attribute: "alpha",
  from: 1,
  to: 0.5,
  period: 300,
  mode: "bounce"
}, hr = {
  fromColor: "#ffffff",
  toColor: "#ffaa00",
  period: 500,
  mode: "bounce"
}, $s = {
  type: "tile-scale",
  fromScale: 1,
  toScale: 1.2,
  period: 300,
  easing: "easeOutCubic",
  mode: "bounce"
}, Ig = [
  { value: "alpha", label: "Alpha (Opacity)" },
  { value: "rotation", label: "Rotation" },
  { value: "texture.rotation", label: "Texture Rotation" }
];
let Rn = null;
function KE(t) {
  var e;
  return (t == null ? void 0 : t.document) ?? ((e = t == null ? void 0 : t.object) == null ? void 0 : e.document) ?? (t == null ? void 0 : t.object) ?? null;
}
c(KE, "getPlaceableDocument");
function XE(t, e) {
  const n = document.createElement("div");
  n.classList.add("form-group");
  const i = document.createElement("label");
  i.textContent = "Type", n.appendChild(i);
  const r = document.createElement("select");
  r.classList.add(e);
  const o = document.createElement("optgroup");
  o.label = "Effects";
  for (const a of Tg) {
    const l = document.createElement("option");
    l.value = a.value, l.textContent = a.label, a.value === t && (l.selected = !0), o.appendChild(l);
  }
  r.appendChild(o);
  const s = document.createElement("optgroup");
  s.label = "Tweens";
  for (const a of YE) {
    const l = document.createElement("option");
    l.value = a.value, l.textContent = a.label, a.value === t && (l.selected = !0), s.appendChild(l);
  }
  return r.appendChild(s), n.appendChild(r), n;
}
c(XE, "buildEffectTypeSelect");
function wf(t) {
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
  const n = Tg.find((i) => i.value === e);
  return (n == null ? void 0 : n.label) ?? e;
}
c(wf, "summarizeEffectConfig");
function Ef(t, e, n, i) {
  const r = t.name ?? "float", o = Yu(), s = Mr(), a = document.createElement("div");
  a.classList.add("idle-anim__slot", "is-collapsed", n), a.dataset.index = String(e);
  const l = document.createElement("div");
  l.classList.add("idle-anim__slot-header");
  const u = document.createElement("i");
  u.classList.add("fa-solid", "fa-chevron-right", "idle-anim__slot-chevron");
  const d = document.createElement("span");
  d.classList.add("idle-anim__slot-title"), d.textContent = `${i} ${e + 1}`;
  const f = document.createElement("span");
  f.classList.add("idle-anim__slot-summary"), f.textContent = wf(t);
  const h = document.createElement("button");
  h.type = "button", h.classList.add("idle-anim__slot-remove"), h.innerHTML = '<i class="fa-solid fa-xmark"></i>', h.title = "Remove effect", l.append(u, d, f, h), a.appendChild(l);
  const m = document.createElement("div");
  m.classList.add("idle-anim__slot-body");
  const p = XE(r, "ti-effect__type");
  m.appendChild(p);
  const y = document.createElement("div");
  y.classList.add("idle-anim__type-fields"), m.appendChild(y);
  function E(b, w) {
    y.innerHTML = "";
    const S = Lg[b];
    if (S)
      for (const T of S) {
        const L = w[T.key] ?? T.default;
        if (T.type === "color")
          y.appendChild(vu(T.label, `ti-effect__${T.key}`, L));
        else if (T.type === "select") {
          let A;
          T.options === "interpolation" ? A = s.map((M) => ({ value: M, label: M, selected: M === L })) : Array.isArray(T.options) ? A = T.options.map((M) => ({ value: M.value, label: M.label, selected: M.value === L })) : A = o.map((M) => ({ value: M, label: M, selected: M === L })), y.appendChild(sr(T.label, `ti-effect__${T.key}`, A));
        } else
          y.appendChild(ar(T.label, `ti-effect__${T.key}`, L, T.attrs ?? {}));
      }
  }
  c(E, "renderParams"), E(r, t), a.appendChild(m);
  const v = a.querySelector(".ti-effect__type");
  return v == null || v.addEventListener("change", () => {
    E(v.value, {});
  }), l.addEventListener("click", (b) => {
    if (!b.target.closest(".idle-anim__slot-remove") && (a.classList.toggle("is-collapsed"), a.classList.contains("is-collapsed"))) {
      const w = kg(a);
      w && (f.textContent = wf(w));
    }
  }), h.addEventListener("click", (b) => {
    b.stopPropagation();
    const w = a.parentElement;
    a.remove(), w && dl(w, n, i);
  }), Sg(a, { dropGroup: "effect" }), a;
}
c(Ef, "buildEffectSlot");
function kg(t) {
  var r;
  const e = ((r = t.querySelector(".ti-effect__type")) == null ? void 0 : r.value) ?? "float", n = Lg[e], i = { name: e };
  if (n)
    for (const o of n) {
      const s = t.querySelector(`.ti-effect__${o.key}`);
      if (s)
        if (o.type === "color")
          i[o.key] = s.value;
        else if (o.type === "select")
          i[o.key] = s.value;
        else {
          const a = Number.parseFloat(s.value);
          Number.isNaN(a) || (i[o.key] = a);
        }
    }
  return i;
}
c(kg, "readEffectSlot");
function Sf(t) {
  if (!t) return "";
  const e = t.type ?? "tile-prop", n = t.mode ?? "bounce", i = n.charAt(0).toUpperCase() + n.slice(1);
  if (e === "tile-tint")
    return `${i} Tint ${t.fromColor ?? "?"} → ${t.toColor ?? "?"} (${t.period ?? "?"}ms)`;
  if (e === "tile-scale") {
    const s = t.fromScale != null ? `${Math.round(t.fromScale * 100)}%` : "?", a = t.toScale != null ? `${Math.round(t.toScale * 100)}%` : "?";
    return `${i} Scale ${s} → ${a} (${t.period ?? "?"}ms)`;
  }
  const r = Ig.find((s) => s.value === t.attribute), o = (r == null ? void 0 : r.label) ?? t.attribute ?? "?";
  return `${i} ${o} ${t.from ?? "?"} → ${t.to ?? "?"} (${t.period ?? "?"}ms)`;
}
c(Sf, "summarizeClickConfig");
function Cf(t, e) {
  const n = t.type ?? "tile-prop", i = t.mode ?? "bounce", r = Yu(), o = document.createElement("div");
  o.classList.add("idle-anim__slot", "is-collapsed", "ti-click-slot"), o.dataset.index = String(e);
  const s = document.createElement("div");
  s.classList.add("idle-anim__slot-header");
  const a = document.createElement("i");
  a.classList.add("fa-solid", "fa-chevron-right", "idle-anim__slot-chevron");
  const l = document.createElement("span");
  l.classList.add("idle-anim__slot-title"), l.textContent = `Animation ${e + 1}`;
  const u = document.createElement("span");
  u.classList.add("idle-anim__slot-summary"), u.textContent = Sf(t);
  const d = document.createElement("button");
  d.type = "button", d.classList.add("idle-anim__slot-remove"), d.innerHTML = '<i class="fa-solid fa-xmark"></i>', d.title = "Remove animation", s.append(a, l, u, d), o.appendChild(s);
  const f = document.createElement("div");
  f.classList.add("idle-anim__slot-body");
  const h = document.createElement("div");
  h.classList.add("idle-anim__range-row"), h.appendChild(sr("Mode", "ti-click__mode", [
    { value: "bounce", label: "Bounce", selected: i === "bounce" },
    { value: "toggle", label: "Toggle", selected: i === "toggle" }
  ])), h.appendChild(sr("Type", "ti-click__type", [
    { value: "tile-prop", label: "Numeric", selected: n === "tile-prop" },
    { value: "tile-tint", label: "Tint", selected: n === "tile-tint" },
    { value: "tile-scale", label: "Scale", selected: n === "tile-scale" }
  ])), f.appendChild(h);
  const m = document.createElement("div");
  m.classList.add("idle-anim__type-fields"), f.appendChild(m);
  function p(b, w) {
    if (m.innerHTML = "", b === "tile-tint") {
      const S = Mr(), T = w.fromColor ?? hr.fromColor, L = w.toColor ?? hr.toColor, A = w.mode ?? "oklch", M = document.createElement("div");
      M.classList.add("idle-anim__range-row"), M.appendChild(vu("From", "ti-click__from-color", T)), M.appendChild(vu("To", "ti-click__to-color", L)), m.appendChild(M), m.appendChild(sr(
        "Interpolation",
        "ti-click__color-mode",
        S.map((F) => ({ value: F, label: F, selected: F === A }))
      ));
    } else if (b === "tile-scale") {
      const S = w.fromScale ?? $s.fromScale, T = w.toScale ?? $s.toScale, L = document.createElement("div");
      L.classList.add("idle-anim__range-row"), L.appendChild(ar("From", "ti-click__from-scale", S, { step: "0.01", min: "0.01" })), L.appendChild(ar("To", "ti-click__to-scale", T, { step: "0.01", min: "0.01" })), m.appendChild(L);
      const A = document.createElement("p");
      A.classList.add("idle-anim__hint"), A.textContent = "1.0 = original size. Scales from center.", m.appendChild(A);
    } else {
      const S = w.attribute ?? lr.attribute, T = w.from ?? lr.from, L = w.to ?? lr.to;
      m.appendChild(sr(
        "Attribute",
        "ti-click__attribute",
        Ig.map((M) => ({ value: M.value, label: M.label, selected: M.value === S }))
      ));
      const A = document.createElement("div");
      A.classList.add("idle-anim__range-row"), A.appendChild(ar("From", "ti-click__from", T, { step: "0.01" })), A.appendChild(ar("To", "ti-click__to", L, { step: "0.01" })), m.appendChild(A);
    }
  }
  c(p, "renderTypeFields"), p(n, t);
  const y = t.period ?? (n === "tile-tint" ? hr.period : lr.period), E = t.easing ?? "easeOutCubic";
  f.appendChild(ar("Period (ms)", "ti-click__period", y, { min: "50", step: "50" })), f.appendChild(sr(
    "Easing",
    "ti-click__easing",
    r.map((b) => ({ value: b, label: b, selected: b === E }))
  )), o.appendChild(f);
  const v = o.querySelector(".ti-click__type");
  return v == null || v.addEventListener("change", () => {
    const b = v.value;
    p(b, b === "tile-tint" ? hr : b === "tile-scale" ? $s : lr);
  }), s.addEventListener("click", (b) => {
    if (!b.target.closest(".idle-anim__slot-remove") && (o.classList.toggle("is-collapsed"), o.classList.contains("is-collapsed"))) {
      const w = Og(o);
      w && (u.textContent = Sf(w));
    }
  }), d.addEventListener("click", (b) => {
    b.stopPropagation();
    const w = o.parentElement;
    o.remove(), w && dl(w, "ti-click-slot", "Animation");
  }), Sg(o, { dropGroup: "click" }), o;
}
c(Cf, "buildClickSlot");
function Og(t) {
  var u, d, f, h, m, p, y, E, v, b, w, S, T, L;
  const e = ((u = t.querySelector(".ti-click__type")) == null ? void 0 : u.value) ?? "tile-prop", n = ((d = t.querySelector(".ti-click__mode")) == null ? void 0 : d.value) ?? "bounce", i = Number.parseInt((f = t.querySelector(".ti-click__period")) == null ? void 0 : f.value, 10), r = ((h = t.querySelector(".ti-click__easing")) == null ? void 0 : h.value) ?? "easeOutCubic";
  if (!i || i <= 0) return null;
  const o = { mode: n, period: i, easing: r };
  if (e === "tile-tint") {
    const A = ((m = t.querySelector(".ti-click__from-color")) == null ? void 0 : m.value) ?? ((p = t.querySelector(".ti-click__from-color-text")) == null ? void 0 : p.value) ?? hr.fromColor, M = ((y = t.querySelector(".ti-click__to-color")) == null ? void 0 : y.value) ?? ((E = t.querySelector(".ti-click__to-color-text")) == null ? void 0 : E.value) ?? hr.toColor, F = ((v = t.querySelector(".ti-click__color-mode")) == null ? void 0 : v.value) ?? "oklch";
    return { type: "tile-tint", fromColor: A, toColor: M, mode: F, ...o };
  }
  if (e === "tile-scale") {
    const A = Number.parseFloat((b = t.querySelector(".ti-click__from-scale")) == null ? void 0 : b.value), M = Number.parseFloat((w = t.querySelector(".ti-click__to-scale")) == null ? void 0 : w.value);
    return Number.isNaN(A) || Number.isNaN(M) || A <= 0 || M <= 0 ? null : { type: "tile-scale", fromScale: A, toScale: M, ...o };
  }
  const s = ((S = t.querySelector(".ti-click__attribute")) == null ? void 0 : S.value) ?? lr.attribute, a = Number.parseFloat((T = t.querySelector(".ti-click__from")) == null ? void 0 : T.value), l = Number.parseFloat((L = t.querySelector(".ti-click__to")) == null ? void 0 : L.value);
  return Number.isNaN(a) || Number.isNaN(l) ? null : { type: "tile-prop", attribute: s, from: a, to: l, ...o };
}
c(Og, "readClickSlot");
function dl(t, e, n) {
  t.querySelectorAll(`.${e}`).forEach((r, o) => {
    r.dataset.index = String(o);
    const s = r.querySelector(".idle-anim__slot-title");
    s && (s.textContent = `${n} ${o + 1}`);
  });
}
c(dl, "renumberSlots");
function ql(t, { heading: e, hint: n, configs: i, slotClass: r, titlePrefix: o, dropGroup: s, defaultEffect: a }) {
  const l = document.createElement("div");
  l.classList.add("ti-section-heading");
  const u = document.createElement("h3");
  u.textContent = e, l.appendChild(u);
  const d = document.createElement("div");
  d.classList.add("idle-anim__slots", `${r}s`);
  const f = document.createElement("button");
  f.type = "button", f.classList.add("ti-section-heading__add"), f.innerHTML = '<i class="fa-solid fa-plus"></i>', f.title = `Add ${e.toLowerCase()} effect`, f.addEventListener("click", () => {
    const p = d.querySelectorAll(`.${r}`).length, y = Ef(a, p, r, o);
    y.classList.remove("is-collapsed"), d.appendChild(y);
  }), l.appendChild(f), t.appendChild(l);
  const h = document.createElement("p");
  h.classList.add("idle-anim__hint"), h.textContent = n, t.appendChild(h);
  for (let p = 0; p < i.length; p++)
    d.appendChild(Ef(i[p], p, r, o));
  t.appendChild(d);
  const m = ["ti-always-slot", "ti-idle-slot", "ti-hover-slot"];
  return Cg(d, {
    dropGroup: s,
    onDrop(p) {
      if (p.parentElement === d)
        for (const y of m)
          y !== r && p.classList.contains(y) && p.classList.replace(y, r);
      dl(d, r, o);
    }
  }), d;
}
c(ql, "buildEffectCategory");
function JE(t) {
  const e = td(t) ?? { always: [], idle: [], hover: [], click: [] }, n = document.createElement("section");
  n.classList.add("eidolon-tile-interactions"), ql(n, {
    heading: "Always",
    hint: "Runs continuously, ignores pointer state.",
    configs: e.always ?? [],
    slotClass: "ti-always-slot",
    titlePrefix: "Effect",
    dropGroup: "effect",
    defaultEffect: { name: "embers" }
  }), ql(n, {
    heading: "Idle",
    hint: "Plays by default. Stops when pointer enters the tile.",
    configs: e.idle ?? [],
    slotClass: "ti-idle-slot",
    titlePrefix: "Effect",
    dropGroup: "effect",
    defaultEffect: { name: "float" }
  }), ql(n, {
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
  const o = e.click ?? [], s = document.createElement("div");
  s.classList.add("idle-anim__slots", "ti-click-slots");
  const a = document.createElement("button");
  a.type = "button", a.classList.add("ti-section-heading__add"), a.innerHTML = '<i class="fa-solid fa-plus"></i>', a.title = "Add click animation", a.addEventListener("click", () => {
    const T = s.querySelectorAll(".ti-click-slot").length, L = Cf($s, T);
    L.classList.remove("is-collapsed"), s.appendChild(L);
  }), i.appendChild(a), n.appendChild(i);
  const l = document.createElement("p");
  l.classList.add("idle-anim__hint"), l.textContent = "One-shot animation on click.", n.appendChild(l);
  for (let T = 0; T < o.length; T++)
    s.appendChild(Cf(o[T], T));
  n.appendChild(s), Cg(s, {
    dropGroup: "click",
    onDrop() {
      dl(s, "ti-click-slot", "Animation");
    }
  });
  const u = document.createElement("div");
  u.classList.add("ti-section-heading");
  const d = document.createElement("h3");
  d.textContent = "Options", u.appendChild(d), n.appendChild(u);
  const f = document.createElement("div");
  f.classList.add("form-group");
  const h = document.createElement("label");
  h.textContent = "Pointer cursor on hover";
  const m = document.createElement("input");
  m.type = "checkbox", m.classList.add("ti-cursor-check"), m.checked = e.cursor ?? !1, f.append(h, m), n.appendChild(f);
  const p = document.createElement("p");
  p.classList.add("idle-anim__hint"), p.textContent = "Execute a macro when clicked. Drag a macro here or paste its UUID.", n.appendChild(p);
  const y = document.createElement("div");
  y.classList.add("form-group", "ti-macro");
  const E = document.createElement("label");
  E.textContent = "Macro", y.appendChild(E);
  const v = document.createElement("input");
  v.type = "text", v.classList.add("ti-macro__uuid"), v.placeholder = "Drag a macro here or paste UUID", v.value = e.macro ?? "", y.appendChild(v);
  const b = document.createElement("button");
  b.type = "button", b.classList.add("ti-macro__clear"), b.innerHTML = '<i class="fa-solid fa-xmark"></i>', b.title = "Clear macro", b.addEventListener("click", () => {
    v.value = "";
  }), y.appendChild(b), y.addEventListener("dragover", (T) => {
    T.preventDefault(), T.dataTransfer.dropEffect = "link";
  }), y.addEventListener("drop", (T) => {
    T.preventDefault();
    try {
      const L = T.dataTransfer.getData("text/plain"), A = JSON.parse(L);
      A.type === "Macro" && A.uuid && (v.value = A.uuid);
    } catch {
    }
  }), n.appendChild(y);
  const w = document.createElement("div");
  w.classList.add("idle-anim__actions");
  const S = document.createElement("button");
  return S.type = "button", S.classList.add("idle-anim__preview"), S.innerHTML = '<i class="fa-solid fa-play"></i> Preview', w.append(S), n.appendChild(w), n;
}
c(JE, "buildSectionContent");
function jl(t, e) {
  const n = [];
  for (const i of t.querySelectorAll(`.${e}`)) {
    const r = kg(i);
    r && n.push(r);
  }
  return n;
}
c(jl, "readAllEffectSlots");
function QE(t) {
  const e = [];
  for (const n of t.querySelectorAll(".ti-click-slot")) {
    const i = Og(n);
    i && e.push(i);
  }
  return e;
}
c(QE, "readAllClickConfigs");
function Tf(t) {
  var r, o, s;
  const e = ((o = (r = t.querySelector(".ti-macro__uuid")) == null ? void 0 : r.value) == null ? void 0 : o.trim()) || null, n = ((s = t.querySelector(".ti-cursor-check")) == null ? void 0 : s.checked) ?? !1, i = {
    always: jl(t, "ti-always-slot"),
    idle: jl(t, "ti-idle-slot"),
    hover: jl(t, "ti-hover-slot"),
    click: QE(t)
  };
  return e && (i.macro = e), n && (i.cursor = !0), i;
}
c(Tf, "readFormConfig");
function Ag(t, e) {
  var l;
  const n = Ye(e);
  if (!n) return;
  const i = KE(t);
  if (!i) return;
  const r = Gu(t, n, WE, "Animations", zE);
  if (!r || r.querySelector(".eidolon-tile-interactions")) return;
  const o = r.closest("form");
  o && (o.noValidate = !0);
  const s = JE(i);
  r.appendChild(s), (l = t.setPosition) == null || l.call(t, { height: "auto" });
  const a = r.querySelector(".idle-anim__preview");
  a == null || a.addEventListener("click", () => {
    const u = i.object;
    if (!u) return;
    if (Rn) {
      Rn.detach(), Rn = null, a.classList.remove("is-active"), a.innerHTML = '<i class="fa-solid fa-play"></i> Preview';
      return;
    }
    const d = Tf(s);
    (d.always.length > 0 || d.idle.length > 0 || d.hover.length > 0) && (Rn = new Xi(u, d), Rn.start("idle"), a.classList.add("is-active"), a.innerHTML = '<i class="fa-solid fa-stop"></i> Stop');
  }), o && o.addEventListener("submit", () => {
    Rn && (Rn.detach(), Rn = null);
    const u = Tf(s), d = u.always.length > 0 || u.idle.length > 0 || u.hover.length > 0 || u.click.length > 0 || !!u.macro || !!u.cursor, f = {
      [`flags.${ds}.-=${vf}`]: null,
      [`flags.${ds}.-=${VE}`]: null,
      [`flags.${ds}.-=${GE}`]: null
    };
    i.update(f).then(() => {
      if (d)
        return i.update({ [`flags.${ds}.${vf}`]: u });
    });
  });
}
c(Ag, "renderAnimationSection");
const ua = /* @__PURE__ */ new Map();
function Mg(t) {
  const e = ua.get(t);
  e && (e.controller.abort(), ua.delete(t), e.restore());
}
c(Mg, "stopLoopByKey");
function xg(t) {
  const e = `${t}::`;
  for (const n of [...ua.keys()])
    n.startsWith(e) && Mg(n);
}
c(xg, "stopLoopsForTile");
function _g() {
  for (const t of [...ua.keys()])
    Mg(t);
}
c(_g, "stopAllLoops");
const Ng = "eidolon-utilities", $g = ["tile-animations", "tile-interactions", "idle-animation"];
function ZE() {
  _g(), wg();
}
c(ZE, "onCanvasTearDown");
function eS() {
  _g(), wg();
}
c(eS, "onCanvasReady$1");
function tS(t, e) {
  var r;
  const n = (r = e == null ? void 0 : e.flags) == null ? void 0 : r[Ng];
  !n || !$g.some((o) => o in n || `-=${o}` in n) || (xg(t.id), HE(t));
}
c(tS, "onUpdateTile");
function nS(t) {
  xg(t.id), qE(t);
}
c(nS, "onDeleteTile");
function iS(t, e) {
  Ag(t, e);
}
c(iS, "onRenderTileConfig");
function rS(t, e) {
  var r;
  const n = (r = e == null ? void 0 : e.flags) == null ? void 0 : r[Ng];
  !n || !$g.some((o) => o in n || `-=${o}` in n) || jE(t);
}
c(rS, "onUpdateDrawing");
function oS(t) {
  BE(t);
}
c(oS, "onDeleteDrawing");
function sS(t, e) {
  Ag(t, e);
}
c(sS, "onRenderDrawingConfig");
function aS() {
  Hooks.on("canvasTearDown", ZE), Hooks.on("canvasReady", eS), Hooks.on("updateTile", tS), Hooks.on("deleteTile", nS), Hooks.on("renderTileConfig", iS), Hooks.on("updateDrawing", rS), Hooks.on("deleteDrawing", oS), Hooks.on("renderDrawingConfig", sS);
}
c(aS, "registerTileInteractionHooks");
aS();
const da = /* @__PURE__ */ new Map();
function rd(t, e) {
  da.has(t) && console.warn(`[eidolon-utilities] Door-link behavior "${t}" is already registered. Overwriting.`), da.set(t, e);
}
c(rd, "registerBehavior");
function Fg(t) {
  return da.get(t);
}
c(Fg, "getBehavior");
function fl() {
  return da;
}
c(fl, "getAllBehaviors");
const lS = {
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
}, cS = {
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
}, Co = "eidolon-utilities", wu = "door-links", Dg = "door-link-default";
function Mn(t) {
  var e, n;
  return ((n = (e = t == null ? void 0 : t.flags) == null ? void 0 : e[Co]) == null ? void 0 : n[wu]) ?? {};
}
c(Mn, "getDoorLinks");
function To(t, e) {
  const n = { [`flags.${Co}.${wu}`]: e }, i = Mn(t);
  for (const r of Object.keys(i))
    r in e || (n[`flags.${Co}.${wu}.-=${r}`] = null);
  return t.update(n, { render: !1 });
}
c(To, "setDoorLinks");
function uS(t, e) {
  const n = Mn(t);
  let i = !1;
  const r = {};
  for (const [o, s] of Object.entries(n)) {
    const a = s.filter((l) => l !== e);
    a.length !== s.length && (i = !0), a.length > 0 && (r[o] = a);
  }
  return i ? To(t, r) : null;
}
c(uS, "removeWallFromAllLinks");
function od(t) {
  var e, n;
  return ((n = (e = t == null ? void 0 : t.flags) == null ? void 0 : e[Co]) == null ? void 0 : n[Dg]) ?? null;
}
c(od, "getDefaultState");
function Pg(t) {
  const e = {
    light: t.light ?? 20,
    move: t.move ?? 20,
    sight: t.sight ?? 20,
    sound: t.sound ?? 20
  };
  return t.update({ [`flags.${Co}.${Dg}`]: e }, { render: !1 });
}
c(Pg, "captureDefaultState");
function Lf(t) {
  return od(t) ? Promise.resolve() : Pg(t);
}
c(Lf, "ensureDefaultState");
async function Rg(t, e) {
  const n = t.parent;
  if (!n) return;
  const i = Mn(t), r = Object.keys(i);
  if (r.length === 0) return;
  const o = e === 1, s = [];
  let a = null;
  for (const l of r) {
    const u = Fg(l);
    if (!u) {
      console.warn(`[eidolon-utilities] Unknown door-link behavior: "${l}"`);
      continue;
    }
    const d = i[l];
    if (d != null && d.length)
      for (const f of d) {
        const h = n.walls.get(f);
        if (!h) continue;
        const m = od(h);
        if (m)
          if (o) {
            const p = u.apply(h, m);
            s.push({ _id: f, ...p });
          } else {
            a || (a = dS(n, t.id));
            const p = a.get(f);
            if ((p == null ? void 0 : p.length) > 0)
              continue;
            const y = u.revert(h, m);
            s.push({ _id: f, ...y });
          }
      }
  }
  s.length > 0 && await n.updateEmbeddedDocuments("Wall", s);
}
c(Rg, "onDoorStateChange");
function dS(t, e) {
  const n = /* @__PURE__ */ new Map();
  for (const i of t.walls) {
    if (i.id === e || i.door === 0 || i.ds !== 1) continue;
    const r = Mn(i);
    for (const o of Object.values(r))
      for (const s of o)
        n.has(s) || n.set(s, []), n.get(s).push(i);
  }
  return n;
}
c(dS, "buildReverseIndex");
const Lo = /* @__PURE__ */ new WeakMap(), fa = /* @__PURE__ */ new Set();
function sd(t, e = {}) {
  var v;
  if (!(t != null && t.document)) return !1;
  Eu(t);
  const n = e.color ?? 16739115, i = e.alpha ?? 0.85, r = e.width ?? 3, o = e.pulse ?? !0, [s, a, l, u] = t.document.c, d = s - t.x, f = a - t.y, h = l - t.x, m = u - t.y, p = new PIXI.Graphics(), y = [
    { w: r + 24, a: i * 0.08 },
    { w: r + 18, a: i * 0.14 },
    { w: r + 12, a: i * 0.25 },
    { w: r + 6, a: i * 0.4 }
  ];
  for (const b of y)
    p.lineStyle(b.w, n, b.a), p.moveTo(d, f), p.lineTo(h, m);
  p.lineStyle(r, n, i), p.moveTo(d, f), p.lineTo(h, m), p.name = "eidolonDoorLinkHighlight", t.addChild(p);
  const E = { gfx: p, pulseData: null };
  if (o && ((v = canvas.app) != null && v.ticker)) {
    const b = {
      elapsed: 0,
      fn: /* @__PURE__ */ c((w) => {
        b.elapsed += w;
        const S = (Math.sin(b.elapsed * 0.05) + 1) / 2;
        p.alpha = i * (0.4 + 0.6 * S);
      }, "fn")
    };
    canvas.app.ticker.add(b.fn), E.pulseData = b, fa.add(b);
  }
  return Lo.set(t, E), !0;
}
c(sd, "highlightWall");
function Eu(t) {
  var n, i;
  if (!t) return;
  const e = Lo.get(t);
  e && (e.pulseData && ((i = (n = canvas.app) == null ? void 0 : n.ticker) == null || i.remove(e.pulseData.fn), fa.delete(e.pulseData)), e.gfx && (e.gfx.parent && e.gfx.parent.removeChild(e.gfx), e.gfx.destroy({ children: !0 })), Lo.delete(t));
}
c(Eu, "removeWallHighlight");
function Hg() {
  var e, n, i;
  for (const r of fa)
    (n = (e = canvas.app) == null ? void 0 : e.ticker) == null || n.remove(r.fn);
  fa.clear();
  const t = (i = canvas.walls) == null ? void 0 : i.placeables;
  if (t)
    for (const r of t) {
      const o = Lo.get(r);
      o && (o.gfx && (o.gfx.parent && o.gfx.parent.removeChild(o.gfx), o.gfx.destroy({ children: !0 })), Lo.delete(r));
    }
}
c(Hg, "clearWallHighlights");
let Ii = null;
function fS(t) {
  var y, E, v, b, w;
  Ii && Ii.cancel();
  const { onPick: e, onUnpick: n, onCancel: i, excludeIds: r, getExcludeIds: o, sourceDoorId: s } = t;
  let a = null;
  (y = canvas.walls) == null || y.activate();
  for (const S of ((E = canvas.walls) == null ? void 0 : E.controlled) ?? [])
    (v = S.release) == null || v.call(S);
  const l = /* @__PURE__ */ c((S, T) => {
    var M, F, N;
    if (!T) return;
    const L = S.document ?? S;
    if (s && L.id === s) {
      (M = ui.notifications) == null || M.warn("Cannot link a door to itself.");
      return;
    }
    if ((o ? o() : r ?? /* @__PURE__ */ new Set()).has(L.id)) {
      (F = S.release) == null || F.call(S), n == null || n(L);
      return;
    }
    (N = S.release) == null || N.call(S), e(L);
  }, "onControl"), u = /* @__PURE__ */ c((S, T) => {
    T ? (a = S, sd(S, { color: 65416, alpha: 0.7, width: 4, pulse: !1 })) : a === S && (Eu(S), a = null);
  }, "onHover"), d = /* @__PURE__ */ c((S) => {
    S.key === "Escape" && (S.preventDefault(), S.stopPropagation(), p());
  }, "onKeydown"), f = /* @__PURE__ */ c((S) => {
    S.preventDefault(), p();
  }, "onContextMenu"), h = Hooks.on("controlWall", l), m = Hooks.on("hoverWall", u);
  document.addEventListener("keydown", d, { capture: !0 }), (b = canvas.stage) == null || b.addEventListener("rightclick", f), (w = ui.notifications) == null || w.info("Pick mode active — click a wall segment on the canvas, or press ESC to cancel.", { permanent: !1 });
  function p() {
    var S;
    Ii && (Ii = null, Hooks.off("controlWall", h), Hooks.off("hoverWall", m), document.removeEventListener("keydown", d, { capture: !0 }), (S = canvas.stage) == null || S.removeEventListener("rightclick", f), a && (Eu(a), a = null), i == null || i());
  }
  return c(p, "cancel"), Ii = { cancel: p }, { cancel: p };
}
c(fS, "enterWallPickMode");
function hS() {
  Ii && Ii.cancel();
}
c(hS, "cancelWallPickMode");
const fs = "eidolon-door-links", mS = "Links", gS = "fa-solid fa-link", Qt = "eidolon-door-links";
function pS(t) {
  const [e, n, i, r] = t.c ?? [0, 0, 0, 0];
  return `(${e},${n}) → (${i},${r})`;
}
c(pS, "formatWallCoords");
function yS(t) {
  return t.length > 8 ? t.slice(0, 8) + "…" : t;
}
c(yS, "shortId");
function If(t) {
  const e = /* @__PURE__ */ new Set();
  for (const n of Object.values(t))
    for (const i of n) e.add(i);
  return e;
}
c(If, "allLinkedIds");
function bS(t) {
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
c(bS, "classifyWall");
function Bl(t, e, n, i) {
  const r = document.createElement("div");
  r.classList.add("dl-wall-entry"), r.dataset.wallId = t.id, r.style.cursor = "pointer", r.title = "Click to select on canvas", r.addEventListener("click", () => {
    var p, y;
    const m = t.object;
    m && ((p = canvas.walls) == null || p.activate(), m.controlled ? m.release() : m.control({ releaseOthers: !((y = globalThis.keyboard) != null && y.isModifierActive(KeyboardManager.MODIFIER_KEYS.SHIFT)) }));
  });
  const { label: o, cssClass: s } = bS(t);
  r.classList.add(s), r.title = o;
  const a = document.createElement("div");
  a.classList.add("dl-wall-entry__info");
  const l = document.createElement("span");
  l.classList.add("dl-wall-entry__coords"), l.textContent = `#${yS(t.id)}  ${pS(t)}`, a.appendChild(l);
  const u = od(t);
  if (u) {
    const m = document.createElement("span");
    m.classList.add("dl-wall-entry__defaults"), m.textContent = `L:${u.light} M:${u.move} S:${u.sight} Snd:${u.sound}`, a.appendChild(m);
  }
  const d = document.createElement("span");
  d.classList.add("dl-wall-entry__actions");
  const f = document.createElement("button");
  f.type = "button", f.classList.add("dl-wall-entry__btn"), f.innerHTML = '<i class="fa-solid fa-eye"></i>', f.title = "Highlight on canvas", f.addEventListener("click", (m) => {
    var y;
    m.stopPropagation();
    const p = t.object;
    p && sd(p, { color: ((y = fl().get(e)) == null ? void 0 : y.highlightColor) ?? 16739115 });
  });
  const h = document.createElement("button");
  return h.type = "button", h.classList.add("dl-wall-entry__btn", "dl-wall-entry__btn--remove"), h.innerHTML = '<i class="fa-solid fa-xmark"></i>', h.title = "Remove link", h.addEventListener("click", (m) => {
    m.stopPropagation(), r.remove(), i(t.id, e);
  }), d.append(f, h), r.append(a, d), r;
}
c(Bl, "buildWallEntry");
function vS(t, e, n, i, r, o) {
  const s = document.createElement("div");
  s.classList.add("dl-behavior-section"), s.dataset.behavior = t;
  const a = document.createElement("div");
  a.classList.add("dl-behavior-section__header");
  const l = document.createElement("i");
  l.className = e.icon;
  const u = document.createElement("span");
  u.classList.add("dl-behavior-section__title"), u.textContent = e.label;
  const d = document.createElement("span");
  d.classList.add("dl-behavior-section__count"), d.textContent = `(${n.length})`;
  const f = document.createElement("span");
  f.classList.add("dl-behavior-section__header-actions");
  const h = document.createElement("button");
  h.type = "button", h.classList.add("dl-header-btn"), h.innerHTML = '<i class="fa-solid fa-crosshairs"></i>', h.title = "Pick from canvas";
  const m = document.createElement("button");
  m.type = "button", m.classList.add("dl-header-btn"), m.innerHTML = '<i class="fa-solid fa-object-group"></i>', m.title = "Add selected walls";
  const p = document.createElement("button");
  p.type = "button", p.classList.add("dl-header-btn"), p.innerHTML = '<i class="fa-solid fa-arrows-to-dot"></i>', p.title = "Select all linked walls on canvas", f.append(p, m, h), a.append(l, u, d, f), s.appendChild(a);
  const y = document.createElement("p");
  y.classList.add("dl-behavior-section__desc"), y.textContent = e.description, s.appendChild(y);
  const E = document.createElement("div");
  E.classList.add("dl-behavior-section__walls");
  function v() {
    const w = E.querySelectorAll(".dl-wall-entry");
    d.textContent = `(${w.length})`;
  }
  c(v, "updateCount");
  function b(w, S) {
    v(), o();
  }
  c(b, "handleRemove");
  for (const w of n) {
    const S = r.walls.get(w);
    S && E.appendChild(Bl(S, t, i, b));
  }
  return s.appendChild(E), h.addEventListener("click", (w) => {
    w.stopPropagation(), fS({
      sourceDoorId: i.id,
      getExcludeIds: /* @__PURE__ */ c(() => If(ha(s.closest(`.${Qt}`))), "getExcludeIds"),
      onPick: /* @__PURE__ */ c(async (S) => {
        await Lf(S), E.appendChild(Bl(S, t, i, b)), v(), o();
      }, "onPick"),
      onUnpick: /* @__PURE__ */ c((S) => {
        const T = s.closest(`.${Qt}`), L = T == null ? void 0 : T.querySelector(`.dl-wall-entry[data-wall-id="${S.id}"]`);
        if (L) {
          L.remove();
          for (const A of T.querySelectorAll(".dl-behavior-section")) {
            const M = A.querySelectorAll(".dl-wall-entry");
            A.querySelector(".dl-behavior-section__count").textContent = `(${M.length})`;
          }
          o();
        }
      }, "onUnpick")
    });
  }), m.addEventListener("click", async (w) => {
    var M, F, N, $;
    w.stopPropagation();
    const S = ((M = canvas.walls) == null ? void 0 : M.controlled) ?? [];
    if (S.length === 0) {
      (F = ui.notifications) == null || F.warn("No walls selected. Select walls on the canvas first.");
      return;
    }
    const T = ha(s.closest(`.${Qt}`)), L = If(T);
    let A = 0;
    for (const x of S) {
      const R = x.document;
      !R || R.id === i.id || L.has(R.id) || (await Lf(R), E.appendChild(Bl(R, t, i, b)), L.add(R.id), A++);
    }
    A > 0 ? (v(), o(), (N = ui.notifications) == null || N.info(`Added ${A} wall(s) to ${e.label}.`)) : ($ = ui.notifications) == null || $.warn("No eligible walls in selection (doors and already-linked walls are excluded).");
  }), p.addEventListener("click", (w) => {
    var M, F, N, $;
    w.stopPropagation();
    const S = [...E.querySelectorAll(".dl-wall-entry")].map((x) => x.dataset.wallId);
    if (S.length === 0) {
      (M = ui.notifications) == null || M.info("No walls to select.");
      return;
    }
    (F = canvas.walls) == null || F.activate();
    const T = S.map((x) => {
      var R;
      return (R = r.walls.get(x)) == null ? void 0 : R.object;
    }).filter(Boolean);
    if (T.length > 0 && T.every((x) => x.controlled)) {
      for (const x of T) x.release();
      return;
    }
    (N = canvas.walls) == null || N.releaseAll();
    let A = 0;
    for (const x of T)
      x.control({ releaseOthers: !1 }), A++;
    ($ = ui.notifications) == null || $.info(`Selected ${A} wall(s).`);
  }), s;
}
c(vS, "buildBehaviorSection");
function ha(t) {
  if (!t) return {};
  const e = {};
  for (const n of t.querySelectorAll(".dl-behavior-section")) {
    const i = n.dataset.behavior, r = [];
    for (const o of n.querySelectorAll(".dl-wall-entry"))
      o.dataset.wallId && r.push(o.dataset.wallId);
    r.length > 0 && (e[i] = r);
  }
  return e;
}
c(ha, "readLinksFromDOM");
function Nr(t, e, n) {
  var h;
  const i = document.createElement("div");
  i.classList.add(Qt);
  const r = Mn(t);
  let o = !1;
  const s = {};
  for (const [m, p] of Object.entries(r)) {
    const y = p.filter((E) => e.walls.has(E));
    y.length !== p.length && (o = !0), y.length > 0 && (s[m] = y);
  }
  o && To(t, s);
  const a = fl(), l = /* @__PURE__ */ c(() => {
    const m = ha(i);
    To(t, m);
  }, "onLinksChanged");
  for (const [m, p] of a) {
    const y = s[m] ?? [];
    i.appendChild(vS(m, p, y, t, e, l));
  }
  const u = document.createElement("button");
  u.type = "button", u.classList.add("dl-btn", "dl-btn--recapture"), u.innerHTML = '<i class="fa-solid fa-camera-rotate"></i> Re-capture defaults', u.title = "Snapshot current wall properties as the closed-door default for all linked walls", u.addEventListener("click", async (m) => {
    var E;
    m.stopPropagation();
    const p = ha(i);
    let y = 0;
    for (const v of Object.values(p))
      for (const b of v) {
        const w = e.walls.get(b);
        w && (await Pg(w), y++);
      }
    (E = ui.notifications) == null || E.info(`Re-captured defaults for ${y} linked wall(s).`), n();
  }), i.appendChild(u), TS(s, e);
  const d = /* @__PURE__ */ c((m, p) => {
    var v;
    const y = ((v = m.document) == null ? void 0 : v.id) ?? m.id, E = i.querySelector(`.dl-wall-entry[data-wall-id="${y}"]`);
    E && E.classList.toggle("dl-wall-entry--selected", p);
  }, "syncSelection"), f = Hooks.on("controlWall", d);
  i._dlSelectionHookId = f;
  for (const m of i.querySelectorAll(".dl-wall-entry")) {
    const p = e.walls.get(m.dataset.wallId);
    (h = p == null ? void 0 : p.object) != null && h.controlled && m.classList.add("dl-wall-entry--selected");
  }
  return i;
}
c(Nr, "buildDoorLinksContent");
function wS(t) {
  return t.querySelector(".standard-form [data-application-part='body']") ?? t.querySelector(".standard-form.scrollable") ?? null;
}
c(wS, "findV2Body");
function ES(t, e, n, i) {
  const r = wS(e);
  if (!r) return !1;
  if (r.querySelector(`.${Qt}`)) return !0;
  const o = document.createElement("fieldset");
  o.classList.add("dl-fieldset");
  const s = document.createElement("legend");
  s.textContent = "Door Links", o.appendChild(s);
  const a = /* @__PURE__ */ c(() => {
    var l;
    (l = o.querySelector(`.${Qt}`)) == null || l.remove(), o.appendChild(Nr(n, i, a));
  }, "refresh");
  return o.appendChild(Nr(n, i, a)), r.appendChild(o), !0;
}
c(ES, "injectAsFieldset");
function SS(t, e, n, i) {
  var a;
  const r = Gu(t, e, fs, mS, gS);
  if (!r) return !1;
  if (t._eidolonActiveTab === fs && Du(t, fs), r.querySelector(`.${Qt}`)) return !0;
  const o = r.closest("form");
  o && (o.noValidate = !0);
  const s = /* @__PURE__ */ c(() => {
    var l;
    t._eidolonActiveTab = fs, (l = r.querySelector(`.${Qt}`)) == null || l.remove(), r.appendChild(Nr(n, i, s));
  }, "refresh");
  return r.appendChild(Nr(n, i, s)), (a = t.setPosition) == null || a.call(t, { height: "auto" }), !0;
}
c(SS, "injectAsTab");
function CS(t, e, n, i) {
  var u;
  const r = e.querySelector("form");
  if (!r) return !1;
  if (r.querySelector(`.${Qt}`)) return !0;
  const o = document.createElement("fieldset");
  o.classList.add("dl-fieldset");
  const s = document.createElement("legend");
  s.textContent = "Door Links", o.appendChild(s);
  const a = /* @__PURE__ */ c(() => {
    var d;
    (d = o.querySelector(`.${Qt}`)) == null || d.remove(), o.appendChild(Nr(n, i, a));
  }, "refresh");
  o.appendChild(Nr(n, i, a));
  const l = r.querySelector(":scope > footer") ?? r.querySelector(".form-footer");
  return r.insertBefore(o, l ?? null), r.noValidate = !0, (u = t.setPosition) == null || u.call(t, { height: "auto" }), !0;
}
c(CS, "injectAsFormSection");
function Ul(t, e) {
  var l;
  const n = Ye(e);
  if (!n) return;
  const i = t.document ?? ((l = t.object) == null ? void 0 : l.document) ?? t.object;
  if (!i || i.door === 0) return;
  const r = i.parent;
  if (!r || !(ES(t, n, i, r) || SS(t, n, i, r) || CS(t, n, i, r))) return;
  const s = `close${t.constructor.name}`, a = Hooks.on(s, (u) => {
    if (u === t) {
      Hg(), hS();
      const d = n.querySelector(`.${Qt}`);
      (d == null ? void 0 : d._dlSelectionHookId) != null && Hooks.off("controlWall", d._dlSelectionHookId), Hooks.off(s, a);
    }
  });
}
c(Ul, "renderDoorLinksTab");
function TS(t, e) {
  var i;
  const n = fl();
  for (const [r, o] of Object.entries(t)) {
    const s = ((i = n.get(r)) == null ? void 0 : i.highlightColor) ?? 16739115;
    for (const a of o) {
      const l = e.walls.get(a), u = l == null ? void 0 : l.object;
      u && sd(u, { color: s });
    }
  }
}
c(TS, "highlightLinkedWalls");
const kf = "eidolon-utilities";
function LS(t, e) {
  e.ds !== void 0 && t.door !== 0 && Rg(t, e.ds);
}
c(LS, "onUpdateWall");
function IS(t) {
  const e = t.parent;
  if (!e) return;
  const n = t.id;
  for (const i of e.walls)
    i.door !== 0 && uS(i, n);
}
c(IS, "onDeleteWall");
function kS(t, e) {
  var o;
  const n = e instanceof HTMLElement ? e : e == null ? void 0 : e[0];
  if (!n) return;
  if (!((o = game.modules.get("monks-active-tiles")) != null && o.active)) {
    Ul(t, e);
    return;
  }
  if (n.querySelector("nav.sheet-tabs, nav.tabs")) {
    Ul(t, e);
    return;
  }
  const i = new MutationObserver(() => {
    n.querySelector("nav.sheet-tabs, nav.tabs") && (i.disconnect(), Ul(t, e));
  });
  i.observe(n, { childList: !0, subtree: !0 });
  const r = `close${t.constructor.name}`;
  Hooks.once(r, (s) => {
    s === t && i.disconnect();
  });
}
c(kS, "onRenderWallConfig");
async function OS(t) {
  const e = t.walls.filter((u) => {
    if (u.door === 0) return !1;
    const d = Mn(u);
    return Object.values(d).some((f) => f.length > 0);
  });
  if (e.length === 0) return;
  const n = new Set(t.walls.map((u) => u.id)), i = /* @__PURE__ */ new Set();
  for (const u of e)
    for (const d of Object.values(Mn(u)))
      for (const f of d)
        n.has(f) || i.add(f);
  if (i.size === 0) return;
  const r = [...i][0];
  let o = null;
  for (const u of game.scenes)
    if (u.id !== t.id && u.walls.get(r)) {
      o = u;
      break;
    }
  if (!o) return;
  const s = /* @__PURE__ */ c((u) => u.join(","), "coordKey"), a = /* @__PURE__ */ new Map();
  for (const u of t.walls)
    a.set(s(u.c), u.id);
  const l = /* @__PURE__ */ new Map();
  for (const u of i) {
    const d = o.walls.get(u);
    if (!d) continue;
    const f = a.get(s(d.c));
    f && l.set(u, f);
  }
  for (const u of e) {
    const d = Mn(u), f = {};
    let h = !1;
    for (const [m, p] of Object.entries(d))
      f[m] = p.map((y) => {
        const E = l.get(y);
        return E ? (h = !0, E) : y;
      });
    h && await To(u, f);
  }
}
c(OS, "onCreateScene");
function AS() {
  Hg();
}
c(AS, "onCanvasReady");
function MS() {
  Hooks.on("updateWall", LS), Hooks.on("deleteWall", IS), Hooks.on("renderWallConfig", kS), Hooks.on("createScene", OS), Hooks.on("canvasReady", AS), Hooks.once("ready", () => {
    const t = game.modules.get(kf);
    t.api || (t.api = {}), t.api.doorLinks = {
      registerBehavior: rd,
      getBehavior: Fg,
      getAllBehaviors: fl,
      getDoorLinks: Mn,
      setDoorLinks: To,
      triggerDoor: Rg
    }, console.log(`[${kf}] Door Links API registered.`);
  });
}
c(MS, "registerDoorLinksHooks");
rd("reflect", lS);
rd("passthru", cS);
MS();
const hl = "eidolon-utilities", qg = "sceneLinks";
function mn(t) {
  var e, n;
  return ((n = (e = t == null ? void 0 : t.flags) == null ? void 0 : e[hl]) == null ? void 0 : n[qg]) ?? [];
}
c(mn, "getSceneLinks");
function ml(t, e, n = {}) {
  return t.update({ [`flags.${hl}.${qg}`]: e }, n);
}
c(ml, "setSceneLinks");
function ma(t, { label: e, target: n }, i = {}) {
  const r = mn(t);
  return r.some((o) => o.target === n) ? Promise.resolve() : ml(t, [...r, { label: e, target: n }], i);
}
c(ma, "addSceneLink");
function Io(t, e, n = {}) {
  const i = mn(t), r = i.filter((o) => o.target !== e);
  return r.length === i.length ? Promise.resolve() : ml(t, r, n);
}
c(Io, "removeSceneLink");
function xS(t, e) {
  const n = e.toLowerCase();
  return mn(t).find((i) => i.label.toLowerCase() === n) ?? null;
}
c(xS, "findLinkByLabel");
function _S(t, e, n, i = {}) {
  const o = mn(t).map((s) => s.target === e ? { ...s, label: n } : s);
  return ml(t, o, i);
}
c(_S, "updateLinkLabel");
const jg = "syncLinkedCriteria";
function ad(t) {
  var e, n;
  return ((n = (e = t == null ? void 0 : t.flags) == null ? void 0 : e[hl]) == null ? void 0 : n[jg]) === !0;
}
c(ad, "getSyncLinkedCriteria");
function Bg(t, e, n = {}) {
  return t.update({ [`flags.${hl}.${jg}`]: !!e }, n);
}
c(Bg, "setSyncLinkedCriteria");
function $r(t) {
  if (!t || typeof t != "string") return null;
  const e = t.startsWith("Scene.") ? t.slice(6) : t;
  return game.scenes.get(e) ?? null;
}
c($r, "resolveScene");
async function Ug(t) {
  const e = $r(t);
  if (!e) {
    ui.notifications.warn(`Scene not found: ${t}`);
    return;
  }
  return e.view();
}
c(Ug, "navigateToLink");
let Qi = !1;
function NS() {
  return Qi;
}
c(NS, "isSyncing");
async function $S(t, e, n, i) {
  Qi = !0;
  try {
    await ma(t, { label: n, target: e.id }), await ma(e, { label: i, target: t.id });
  } finally {
    Qi = !1;
  }
}
c($S, "addBidirectionalLink");
async function FS(t, e) {
  Qi = !0;
  try {
    await Io(t, e.id), await Io(e, t.id);
  } finally {
    Qi = !1;
  }
}
c(FS, "removeBidirectionalLink");
async function DS(t) {
  Qi = !0;
  try {
    for (const e of game.scenes)
      mn(e).some((i) => i.target === t) && await Io(e, t);
  } finally {
    Qi = !1;
  }
}
c(DS, "cleanupDanglingLinks");
let Vl = !1;
async function PS(t, e) {
  if (Vl || !ad(t)) return;
  const n = mn(t);
  if (!n.length) return;
  Vl = !0;
  const i = [];
  try {
    for (const r of n) {
      const o = game.scenes.get(r.target);
      if (!o) continue;
      const s = bt(o);
      if (!s.length) continue;
      const a = {}, l = Xo(o, s);
      for (const [u, d] of Object.entries(e)) {
        const f = s.find((h) => h.key === u);
        f && (f.values.includes(d) ? l[u] !== d && (a[u] = d) : i.push({
          scene: o.name,
          label: r.label,
          key: f.label || u,
          value: d
        }));
      }
      Object.keys(a).length > 0 && await Uu(a, o);
    }
  } finally {
    Vl = !1;
  }
  if (i.length > 0) {
    const r = i.map((s) => `${s.label}: "${s.value}" not available for ${s.key}`), o = [...new Set(r)];
    ui.notifications.warn(`Criteria sync skipped:
${o.join(`
`)}`, { permanent: !1 });
  }
}
c(PS, "onCriteriaStateApplied");
const Of = "eidolon-utilities";
var Vf, ln, Lr, Wo, ji, Va, Ir, Ne, Vg, Gg, no, Wg, Ga, zg, Cu;
const En = class En extends yt(pt) {
  constructor(n = {}) {
    const { scene: i, onComplete: r, ...o } = n ?? {};
    super(o);
    _(this, Ne);
    _(this, ln, null);
    _(this, Lr, null);
    _(this, Wo, "browse");
    _(this, ji, null);
    _(this, Va, null);
    _(this, Ir, null);
    // ── Submit ────────────────────────────────────────────────────────────
    _(this, Ga, /* @__PURE__ */ c(async (n) => {
      var d;
      n.preventDefault();
      const i = n.currentTarget;
      if (!(i instanceof HTMLFormElement)) return;
      const r = new FormData(i), o = String(r.get("target") ?? "").trim(), s = String(r.get("label") ?? "").trim(), a = ((d = i.querySelector('input[name="reverse"]')) == null ? void 0 : d.checked) ?? !1, l = String(r.get("reverseLabel") ?? "").trim();
      if (!o || !s) {
        ui.notifications.warn("Target and label are required.");
        return;
      }
      const u = $r(o);
      if (!u) {
        ui.notifications.warn(`Scene not found: ${o}`);
        return;
      }
      a && l ? await $S(g(this, ln), u, s, l) : await ma(g(this, ln), { label: s, target: u.id }), g(this, Lr) && g(this, Lr).call(this), this.close();
    }, "#onSubmit"));
    O(this, ln, i ?? null), O(this, Lr, typeof r == "function" ? r : null);
  }
  async _prepareContext() {
    const n = g(this, ln), i = I(this, Ne, zg).call(this);
    return {
      groups: i,
      hasScenes: i.some((r) => r.scenes.length > 0),
      sceneName: (n == null ? void 0 : n.name) ?? "",
      labels: {
        target: C("EIDOLON.SceneLinks.Target", "Target Scene"),
        label: C("EIDOLON.SceneLinks.Label", "Label"),
        reverseLink: C("EIDOLON.SceneLinks.AddDialog.ReverseLink", "Also add reverse link on target scene"),
        reverseLabel: C("EIDOLON.SceneLinks.AddDialog.ReverseLabel", "Reverse label"),
        add: C("EIDOLON.SceneLinks.AddLink", "Add Link"),
        cancel: C("EIDOLON.SceneLinks.Cancel", "Cancel"),
        browseTitle: C("EIDOLON.SceneLinks.Picker.Browse", "Browse scenes by folder"),
        uuidTitle: C("EIDOLON.SceneLinks.Picker.UUID", "Enter scene ID or UUID"),
        sidebarTitle: C("EIDOLON.SceneLinks.Picker.Sidebar", "Click a scene in the sidebar"),
        sidebarWaiting: C("EIDOLON.SceneLinks.Picker.SidebarWaiting", "Click a scene in the Scenes sidebar…")
      }
    };
  }
  _onRender(n, i) {
    var d;
    super._onRender(n, i);
    const r = this.element;
    if (!r) return;
    r.querySelectorAll("[data-picker-mode]").forEach((f) => {
      f.addEventListener("click", (h) => {
        h.preventDefault(), I(this, Ne, Vg).call(this, f.dataset.pickerMode);
      });
    });
    const o = r.querySelector('input[name="target"]');
    I(this, Ne, Wg).call(this, r, o);
    const s = r.querySelector('input[name="targetUuid"]');
    s && s.addEventListener("input", () => {
      if (g(this, Wo) !== "uuid") return;
      const f = s.value.trim();
      o.value = f.startsWith("Scene.") ? f.slice(6) : f;
    });
    const a = r.querySelector('input[name="reverse"]'), l = r.querySelector("[data-reverse-label-group]");
    a && l && a.addEventListener("change", () => {
      l.style.display = a.checked ? "" : "none";
    });
    const u = r.querySelector("form");
    u && u.addEventListener("submit", g(this, Ga)), (d = r.querySelector('[data-action="cancel"]')) == null || d.addEventListener("click", (f) => {
      f.preventDefault(), this.close();
    });
  }
  _onClose(n) {
    var i;
    I(this, Ne, no).call(this), (i = super._onClose) == null || i.call(this, n);
  }
};
ln = new WeakMap(), Lr = new WeakMap(), Wo = new WeakMap(), ji = new WeakMap(), Va = new WeakMap(), Ir = new WeakMap(), Ne = new WeakSet(), // ── Mode switching ───────────────────────────────────────────────────
Vg = /* @__PURE__ */ c(function(n) {
  O(this, Wo, n);
  const i = this.element;
  if (!i) return;
  i.querySelectorAll("[data-picker-mode]").forEach((o) => o.classList.toggle("active", o.dataset.pickerMode === n)), i.querySelectorAll("[data-panel]").forEach((o) => o.style.display = o.dataset.panel === n ? "" : "none");
  const r = i.querySelector('input[name="target"]');
  if (n === "browse")
    r && g(this, Ir) && (r.value = g(this, Ir)), I(this, Ne, no).call(this);
  else if (n === "uuid") {
    const o = i.querySelector('input[name="targetUuid"]');
    if (o && r) {
      const s = o.value.trim();
      r.value = s.startsWith("Scene.") ? s.slice(6) : s;
    }
    I(this, Ne, no).call(this);
  } else n === "sidebar" && I(this, Ne, Gg).call(this);
}, "#switchMode"), // ── Sidebar picker ───────────────────────────────────────────────────
Gg = /* @__PURE__ */ c(function() {
  var d;
  I(this, Ne, no).call(this);
  const n = document.querySelector('#sidebar-tabs [data-tab="scenes"]');
  n && n.click();
  const i = document.querySelector("#scenes");
  if (!i) return;
  const r = (d = g(this, ln)) == null ? void 0 : d.id, o = this.element, s = o == null ? void 0 : o.querySelector('input[name="target"]'), a = o == null ? void 0 : o.querySelector(".scene-links-picker__sidebar-waiting"), l = o == null ? void 0 : o.querySelector(".scene-links-picker__sidebar-selected"), u = /* @__PURE__ */ c((f) => {
    const h = f.target.closest(".directory-item.document");
    if (!h) return;
    const m = h.dataset.documentId ?? h.dataset.entryId;
    if (!m || m === r) return;
    const p = game.scenes.get(m);
    p && (f.preventDefault(), f.stopPropagation(), O(this, Va, m), s && (s.value = m), a && (a.style.display = "none"), l && (l.textContent = p.name, l.style.display = ""));
  }, "clickHandler");
  i.addEventListener("click", u, !0), O(this, ji, () => i.removeEventListener("click", u, !0));
}, "#activateSidebarPicker"), no = /* @__PURE__ */ c(function() {
  g(this, ji) && (g(this, ji).call(this), O(this, ji, null));
}, "#cleanupSidebar"), // ── Scene picker (searchable browse) ─────────────────────────────────
Wg = /* @__PURE__ */ c(function(n, i) {
  const r = n.querySelector(".eidutil-scene-picker");
  if (!r) return;
  const o = r.querySelector(".eidutil-scene-search"), s = r.querySelector(".eidutil-scene-clear"), a = n.querySelector(".eidutil-scene-dropdown-data");
  if (!o || !a) return;
  const l = document.createElement("div");
  l.classList.add("eidutil-scene-dropdown"), l.style.display = "none", l.innerHTML = a.innerHTML, document.body.appendChild(l), [...l.querySelectorAll(".eidutil-scene-option")];
  const u = [...l.querySelectorAll(".eidutil-scene-group-label")];
  let d = "";
  const f = I(this, Ne, Cu).call(this, g(this, ln)), h = /* @__PURE__ */ c(() => {
    const w = o.getBoundingClientRect();
    l.style.top = `${w.bottom + 2}px`, l.style.left = `${w.left}px`, l.style.width = `${w.width}px`;
  }, "positionDropdown"), m = [];
  for (const w of u) {
    const S = w.dataset.folder || "", T = [];
    let L = w.nextElementSibling;
    for (; L && !L.classList.contains("eidutil-scene-group-label"); )
      L.classList.contains("eidutil-scene-option") && T.push(L), L = L.nextElementSibling;
    m.push({ groupEl: w, folderPath: S, options: T });
  }
  const p = /* @__PURE__ */ c((w) => {
    const S = (w || "").toLowerCase().trim();
    if (!S) {
      m.sort((L, A) => L.folderPath.localeCompare(A.folderPath));
      for (const L of m) {
        L.groupEl.style.display = "", l.appendChild(L.groupEl);
        for (const A of L.options)
          A.style.display = "", l.appendChild(A);
      }
      return;
    }
    for (const L of m) {
      const A = L.folderPath.toLowerCase();
      let M = !1;
      for (const F of L.options) {
        const $ = F.textContent.toLowerCase().includes(S) || A.includes(S);
        F.style.display = $ ? "" : "none", $ && (M = !0);
      }
      L.groupEl.style.display = M ? "" : "none", L._hasVisible = M;
    }
    const T = [...m].sort((L, A) => {
      if (L._hasVisible !== A._hasVisible) return L._hasVisible ? -1 : 1;
      const M = qs(f, L.folderPath), F = qs(f, A.folderPath);
      return M !== F ? F - M : L.folderPath.localeCompare(A.folderPath);
    });
    for (const L of T) {
      l.appendChild(L.groupEl);
      for (const A of L.options)
        l.appendChild(A);
    }
  }, "filter"), y = /* @__PURE__ */ c(() => {
    requestAnimationFrame(() => {
      const w = f ? l.querySelector(`.eidutil-scene-group-label[data-folder="${CSS.escape(f)}"]:not([style*="display: none"])`) : l.querySelector('.eidutil-scene-group-label:not([style*="display: none"])');
      w && w.scrollIntoView({ block: "start" });
    });
  }, "scrollToCurrentFolder"), E = /* @__PURE__ */ c(() => {
    p(o.value === d ? "" : o.value), h(), l.style.display = "block", y(), setTimeout(() => {
      const w = /* @__PURE__ */ c((S) => {
        r.contains(S.target) || l.contains(S.target) || (v(), document.removeEventListener("pointerdown", w, !0));
      }, "closeHandler");
      document.addEventListener("pointerdown", w, !0);
    }, 0);
  }, "openDropdown"), v = /* @__PURE__ */ c(() => {
    l.style.display = "none", o.value = d;
  }, "closeDropdown"), b = /* @__PURE__ */ c((w, S) => {
    O(this, Ir, w), i && (i.value = w), d = S, o.value = S, s && (s.style.display = w ? "" : "none"), l.style.display = "none";
  }, "select");
  o.addEventListener("focus", () => {
    o.select(), E();
  }), o.addEventListener("input", () => {
    p(o.value), h(), l.style.display = "block", o.value.trim() || y();
  }), l.addEventListener("pointerdown", (w) => {
    const S = w.target.closest(".eidutil-scene-option");
    S && (w.preventDefault(), w.stopPropagation(), b(S.dataset.id, S.textContent.trim()));
  }), s && s.addEventListener("click", (w) => {
    w.preventDefault(), b("", ""), o.focus();
  }), o.addEventListener("keydown", (w) => {
    if (w.key === "Escape")
      v(), o.blur();
    else if (w.key === "Enter") {
      w.preventDefault();
      const S = l.querySelector('.eidutil-scene-option:not([style*="display: none"])');
      S && S.dispatchEvent(new PointerEvent("pointerdown", { bubbles: !0 }));
    }
  }), this.addEventListener("close", () => l.remove(), { once: !0 });
}, "#activateScenePicker"), Ga = new WeakMap(), // ── Helpers ───────────────────────────────────────────────────────────
/** Build folder-grouped scene list, excluding the current scene. */
zg = /* @__PURE__ */ c(function() {
  var r;
  const n = /* @__PURE__ */ new Map(), i = (r = g(this, ln)) == null ? void 0 : r.id;
  for (const o of game.scenes) {
    if (o.id === i) continue;
    const s = I(this, Ne, Cu).call(this, o) || "— No Folder —";
    n.has(s) || n.set(s, []), n.get(s).push({ id: o.id, name: o.name });
  }
  return [...n.keys()].sort((o, s) => o.localeCompare(s)).map((o) => ({
    path: o,
    scenes: n.get(o).sort((s, a) => s.name.localeCompare(a.name))
  }));
}, "#buildSceneGroups"), Cu = /* @__PURE__ */ c(function(n) {
  const i = [];
  let r = n.folder;
  for (; r; )
    i.unshift(r.name), r = r.folder;
  return i.join(" / ");
}, "#getFolderPath"), c(En, "AddLinkApplication"), se(En, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  ye(En, En, "DEFAULT_OPTIONS"),
  {
    id: `${Of}-add-scene-link`,
    classes: Array.from(/* @__PURE__ */ new Set([...((Vf = ye(En, En, "DEFAULT_OPTIONS")) == null ? void 0 : Vf.classes) ?? [], "standard-form", "themed"])),
    window: {
      title: C("EIDOLON.SceneLinks.AddDialog.Title", "Add Scene Link"),
      resizable: !1
    },
    position: {
      width: 420,
      height: "auto"
    }
  },
  { inplace: !1 }
)), se(En, "PARTS", {
  content: {
    template: `modules/${Of}/templates/scene-links-add.html`
  }
});
let Su = En;
const Af = "eidolon-utilities";
var Gf, zo, ei, kr, Wa;
const Sn = class Sn extends yt(pt) {
  constructor(n = {}) {
    const { scene: i, link: r, onComplete: o, ...s } = n ?? {};
    super(s);
    _(this, zo, null);
    _(this, ei, null);
    _(this, kr, null);
    _(this, Wa, /* @__PURE__ */ c(async (n) => {
      var o;
      n.preventDefault();
      const i = n.currentTarget;
      if (!(i instanceof HTMLFormElement)) return;
      const r = (o = new FormData(i).get("label")) == null ? void 0 : o.toString().trim();
      r && (await _S(g(this, zo), g(this, ei).target, r), g(this, kr) && g(this, kr).call(this), this.close());
    }, "#onSubmit"));
    O(this, zo, i ?? null), O(this, ei, r ?? null), O(this, kr, typeof o == "function" ? o : null);
  }
  async _prepareContext() {
    var i, r, o;
    const n = $r((i = g(this, ei)) == null ? void 0 : i.target);
    return {
      label: ((r = g(this, ei)) == null ? void 0 : r.label) ?? "",
      targetName: (n == null ? void 0 : n.name) ?? ((o = g(this, ei)) == null ? void 0 : o.target) ?? "",
      labels: {
        label: C("EIDOLON.SceneLinks.Label", "Label"),
        save: C("EIDOLON.SceneLinks.Save", "Save"),
        cancel: C("EIDOLON.SceneLinks.Cancel", "Cancel")
      }
    };
  }
  _onRender(n, i) {
    var s;
    super._onRender(n, i);
    const r = this.element;
    if (!r) return;
    const o = r.querySelector("form");
    o && o.addEventListener("submit", g(this, Wa)), (s = r.querySelector('[data-action="cancel"]')) == null || s.addEventListener("click", (a) => {
      a.preventDefault(), this.close();
    });
  }
};
zo = new WeakMap(), ei = new WeakMap(), kr = new WeakMap(), Wa = new WeakMap(), c(Sn, "EditLinkApplication"), se(Sn, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  ye(Sn, Sn, "DEFAULT_OPTIONS"),
  {
    id: `${Af}-edit-scene-link`,
    classes: Array.from(/* @__PURE__ */ new Set([...((Gf = ye(Sn, Sn, "DEFAULT_OPTIONS")) == null ? void 0 : Gf.classes) ?? [], "standard-form", "themed"])),
    window: {
      title: C("EIDOLON.SceneLinks.EditDialog.Title", "Edit Link Label"),
      resizable: !1
    },
    position: {
      width: 380,
      height: "auto"
    }
  },
  { inplace: !1 }
)), se(Sn, "PARTS", {
  content: {
    template: `modules/${Af}/templates/scene-links-edit.html`
  }
});
let Tu = Sn;
const Mf = "eidolon-utilities";
var Wf, Bi, ti, Or, za;
const Cn = class Cn extends yt(pt) {
  constructor(n = {}) {
    const { scene: i, target: r, onComplete: o, ...s } = n ?? {};
    super(s);
    _(this, Bi, null);
    _(this, ti, null);
    _(this, Or, null);
    _(this, za, /* @__PURE__ */ c(async (n) => {
      var s;
      n.preventDefault();
      const i = n.currentTarget;
      if (!(i instanceof HTMLFormElement)) return;
      const r = ((s = i.querySelector('input[name="removeReverse"]')) == null ? void 0 : s.checked) ?? !1, o = $r(g(this, ti));
      r && o ? await FS(g(this, Bi), o) : await Io(g(this, Bi), g(this, ti)), g(this, Or) && g(this, Or).call(this), this.close();
    }, "#onSubmit"));
    O(this, Bi, i ?? null), O(this, ti, r ?? null), O(this, Or, typeof o == "function" ? o : null);
  }
  async _prepareContext() {
    const n = $r(g(this, ti)), i = n ? mn(n).some((r) => {
      var o;
      return r.target === ((o = g(this, Bi)) == null ? void 0 : o.id);
    }) : !1;
    return {
      targetName: (n == null ? void 0 : n.name) ?? g(this, ti) ?? "",
      hasReverseLink: i,
      labels: {
        alsoRemoveReverse: C(
          "EIDOLON.SceneLinks.RemoveDialog.AlsoRemoveReverse",
          "Also remove the reverse link on the target scene?"
        ),
        remove: C("EIDOLON.SceneLinks.Remove", "Remove"),
        cancel: C("EIDOLON.SceneLinks.Cancel", "Cancel")
      }
    };
  }
  _onRender(n, i) {
    var s;
    super._onRender(n, i);
    const r = this.element;
    if (!r) return;
    const o = r.querySelector("form");
    o && o.addEventListener("submit", g(this, za)), (s = r.querySelector('[data-action="cancel"]')) == null || s.addEventListener("click", (a) => {
      a.preventDefault(), this.close();
    });
  }
};
Bi = new WeakMap(), ti = new WeakMap(), Or = new WeakMap(), za = new WeakMap(), c(Cn, "RemoveLinkApplication"), se(Cn, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  ye(Cn, Cn, "DEFAULT_OPTIONS"),
  {
    id: `${Mf}-remove-scene-link`,
    classes: Array.from(/* @__PURE__ */ new Set([...((Wf = ye(Cn, Cn, "DEFAULT_OPTIONS")) == null ? void 0 : Wf.classes) ?? [], "standard-form", "themed"])),
    window: {
      title: C("EIDOLON.SceneLinks.RemoveDialog.Title", "Remove Scene Link"),
      resizable: !1
    },
    position: {
      width: 380,
      height: "auto"
    }
  },
  { inplace: !1 }
)), se(Cn, "PARTS", {
  content: {
    template: `modules/${Mf}/templates/scene-links-remove.html`
  }
});
let Lu = Cn;
const Iu = "eidolon-utilities", RS = `modules/${Iu}/templates/scene-links-tab.html`, HS = {
  log: /* @__PURE__ */ c((...t) => {
    var e;
    return (e = console.debug) == null ? void 0 : e.call(console, `${Iu} | SceneLinks`, ...t);
  }, "log"),
  group: /* @__PURE__ */ c((...t) => {
    var e;
    return (e = console.groupCollapsed) == null ? void 0 : e.call(console, `${Iu} | SceneLinks`, ...t);
  }, "group"),
  groupEnd: /* @__PURE__ */ c(() => {
    var t;
    return (t = console.groupEnd) == null ? void 0 : t.call(console);
  }, "groupEnd")
}, qS = Zi(Su), jS = Zi(Tu), BS = Zi(Lu), US = Pu({
  tabId: "scene-links",
  tabLabel: /* @__PURE__ */ c(() => C("EIDOLON.SceneLinks.TabLabel", "Scene Links"), "tabLabel"),
  tabIcon: "fa-solid fa-link",
  getScene: at,
  isApplicable: /* @__PURE__ */ c(() => !0, "isApplicable"),
  renderContent: /* @__PURE__ */ c(({ app: t, tab: e, scene: n }) => GS(t, e, n), "renderContent"),
  logger: HS
});
function VS() {
  return US.register();
}
c(VS, "registerSceneLinksConfigTab");
function GS(t, e, n) {
  if (!(e instanceof HTMLElement)) return;
  const i = Re(n) ? n : at(t);
  gl(t, e, i);
}
c(GS, "renderLinksTab");
async function gl(t, e, n) {
  var l, u, d;
  const i = n ?? at(t);
  if (!Re(i)) {
    e.innerHTML = `<p class="notes">${C("EIDOLON.SceneLinks.NoLinks", "No linked scenes.")}</p>`;
    return;
  }
  const o = mn(i).map((f) => {
    const h = $r(f.target);
    return {
      label: f.label,
      target: f.target,
      sceneName: (h == null ? void 0 : h.name) ?? `[Missing: ${f.target}]`,
      isMissing: !h
    };
  }), s = ((u = (l = foundry == null ? void 0 : foundry.applications) == null ? void 0 : l.handlebars) == null ? void 0 : u.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
  if (typeof s != "function") {
    e.innerHTML = `<p class="notes">${C("EIDOLON.SceneLinks.NoLinks", "No linked scenes.")}</p>`;
    return;
  }
  const a = await s(RS, {
    description: C("EIDOLON.SceneLinks.Description", "Link this scene to related scenes for quick navigation."),
    links: o,
    hasLinks: o.length > 0,
    syncCriteria: ad(i),
    labels: {
      noLinks: C("EIDOLON.SceneLinks.NoLinks", "No linked scenes."),
      addLink: C("EIDOLON.SceneLinks.AddLink", "Add Link"),
      navigate: C("EIDOLON.SceneLinks.Navigate", "Navigate"),
      edit: C("EIDOLON.SceneLinks.Edit", "Edit"),
      remove: C("EIDOLON.SceneLinks.Remove", "Remove"),
      syncCriteria: C("EIDOLON.SceneLinks.SyncCriteria", "Sync live criteria to linked scenes"),
      syncCriteriaHint: C("EIDOLON.SceneLinks.SyncCriteriaHint", "When criteria change on this scene, apply matching values to all linked scenes.")
    }
  });
  e.innerHTML = a, WS(t, e, i), (d = t.setPosition) == null || d.call(t, { height: "auto" });
}
c(gl, "renderLinksTabContent");
function WS(t, e, n) {
  const i = n ?? at(t);
  if (!Re(i)) return;
  e.querySelectorAll('[data-action="navigate"]').forEach((s) => {
    s.addEventListener("click", (a) => {
      a.preventDefault();
      const l = s.dataset.target;
      l && Ug(l);
    });
  }), e.querySelectorAll('[data-action="edit"]').forEach((s) => {
    s.addEventListener("click", async (a) => {
      a.preventDefault();
      const l = s.dataset.target;
      if (!l) return;
      const u = mn(i).find((d) => d.target === l);
      u && await KS(t, e, i, u);
    });
  }), e.querySelectorAll('[data-action="remove"]').forEach((s) => {
    s.addEventListener("click", async (a) => {
      a.preventDefault();
      const l = s.dataset.target;
      l && await YS(t, e, i, l);
    });
  });
  const r = e.querySelector('[data-action="add"]');
  r && r.addEventListener("click", async (s) => {
    s.preventDefault(), await zS(t, e, i);
  });
  const o = e.querySelector('[data-action="toggle-sync-criteria"]');
  o && o.addEventListener("change", () => {
    t._eidolonActiveTab = "scene-links", Bg(i, o.checked);
  });
}
c(WS, "bindTabEvents");
function zS(t, e, n) {
  t._eidolonActiveTab = "scene-links", qS({
    scene: n,
    onComplete: /* @__PURE__ */ c(() => {
      t._eidolonActiveTab = "scene-links", gl(t, e, n);
    }, "onComplete")
  }).render({ force: !0 });
}
c(zS, "openAddDialog");
function YS(t, e, n, i) {
  t._eidolonActiveTab = "scene-links", BS({
    scene: n,
    target: i,
    onComplete: /* @__PURE__ */ c(() => {
      t._eidolonActiveTab = "scene-links", gl(t, e, n);
    }, "onComplete")
  }).render({ force: !0 });
}
c(YS, "openRemoveDialog");
function KS(t, e, n, i) {
  t._eidolonActiveTab = "scene-links", jS({
    scene: n,
    link: i,
    onComplete: /* @__PURE__ */ c(() => {
      t._eidolonActiveTab = "scene-links", gl(t, e, n);
    }, "onComplete")
  }).render({ force: !0 });
}
c(KS, "openEditDialog");
const xf = "eidolon-utilities";
function XS(t) {
  NS() || DS(t.id);
}
c(XS, "onDeleteScene");
function JS() {
  VS(), Hooks.on("deleteScene", XS), Hooks.on("eidolon-utilities.criteriaStateApplied", PS), Hooks.once("ready", () => {
    const t = game.modules.get(xf);
    t.api || (t.api = {}), t.api.sceneLinks = {
      getSceneLinks: mn,
      setSceneLinks: ml,
      addSceneLink: ma,
      removeSceneLink: Io,
      findLinkByLabel: xS,
      navigateToLink: Ug,
      getSyncLinkedCriteria: ad,
      setSyncLinkedCriteria: Bg
    }, console.log(`[${xf}] Scene Links API registered.`);
  });
}
c(JS, "registerSceneLinksHooks");
JS();
const Si = "application/x-foundry-region-shape", ld = /* @__PURE__ */ new Map();
function ku() {
  for (const t of document.querySelectorAll(
    ".rs-shape--insert-before, .rs-shape--insert-after"
  ))
    t.classList.remove("rs-shape--insert-before", "rs-shape--insert-after");
}
c(ku, "clearAllIndicators");
function Yg(t) {
  var e;
  for (const n of ld.values())
    (e = n.container) == null || e.classList.toggle("rs-drag-active", t);
}
c(Yg, "setAllDragActive");
function QS() {
  ku(), Yg(!1);
  for (const t of document.querySelectorAll(
    ".is-dragging, .rs-drop-over"
  ))
    t.classList.remove("is-dragging", "rs-drop-over");
}
c(QS, "globalCleanup");
async function _f(t, e, n) {
  const i = t.dataTransfer.getData(Si);
  if (!i) return;
  let r;
  try {
    r = JSON.parse(i);
  } catch {
    return;
  }
  const { shape: o, sourceRegionUuid: s, sourceIndex: a } = r;
  if (!o || s == null) return;
  const l = t.ctrlKey || t.metaKey, u = s === e.uuid;
  if (u && !l) {
    const f = n === -1 ? e.shapes.length : n;
    if (f === a || f === a + 1)
      return;
  }
  const d = foundry.utils.deepClone(o);
  if (u) {
    const f = foundry.utils.deepClone(e.shapes);
    f.splice(a, 1);
    const h = n === -1 ? f.length : n, m = a < h ? h - 1 : h;
    f.splice(m, 0, d), await e.update({ shapes: f });
  } else {
    const f = foundry.utils.deepClone(e.shapes), h = n === -1 ? f.length : n;
    if (f.splice(h, 0, d), await e.update({ shapes: f }), l) {
      const m = await fromUuid(s);
      if (m) {
        const p = foundry.utils.deepClone(m.shapes);
        p.splice(a, 1), await m.update({ shapes: p });
      }
    }
  }
}
c(_f, "handleShapeDrop");
function ZS(t, e) {
  const n = Ye(e);
  if (!n) return;
  const i = t.document;
  if (!i) return;
  const r = n.querySelector('section.tab[data-tab="shapes"]');
  if (!r) return;
  const o = r, s = o.querySelectorAll("fieldset[data-shape-index]");
  for (const a of s) {
    const l = Number(a.dataset.shapeIndex);
    if (!a.querySelector(".rs-drag-handle")) {
      const d = document.createElement("i");
      d.className = "fa-solid fa-grip-vertical rs-drag-handle", d.title = "Drag to reorder or copy to another region", a.prepend(d);
    }
    a.setAttribute("draggable", "true"), a.classList.add("rs-shape-fieldset");
    let u = !1;
    a.addEventListener("pointerdown", (d) => {
      u = !!d.target.closest(".rs-drag-handle");
    }), a.addEventListener("dragstart", (d) => {
      if (!u) {
        d.preventDefault();
        return;
      }
      const f = foundry.utils.deepClone(i.shapes[l]), h = JSON.stringify({
        shape: f,
        sourceRegionUuid: i.uuid,
        sourceIndex: l
      });
      d.dataTransfer.setData(Si, h), d.dataTransfer.effectAllowed = "copyMove", a.classList.add("is-dragging"), Yg(!0);
    }), a.addEventListener("dragover", (d) => {
      if (!d.dataTransfer.types.includes(Si)) return;
      d.preventDefault(), d.dataTransfer.dropEffect = d.ctrlKey || d.metaKey ? "move" : "copy";
      const f = a.getBoundingClientRect(), h = f.top + f.height / 2, m = d.clientY < h ? "before" : "after";
      ku(), a.classList.add(
        m === "before" ? "rs-shape--insert-before" : "rs-shape--insert-after"
      );
    }), a.addEventListener("dragleave", () => {
      a.classList.remove(
        "rs-shape--insert-before",
        "rs-shape--insert-after"
      );
    }), a.addEventListener("drop", (d) => {
      if (d.preventDefault(), d.stopPropagation(), ku(), !d.dataTransfer.types.includes(Si)) return;
      const h = (() => {
        const m = a.getBoundingClientRect(), p = m.top + m.height / 2;
        return d.clientY < p ? "before" : "after";
      })() === "before" ? l : l + 1;
      _f(d, i, h);
    }), a.addEventListener("dragend", () => {
      QS();
    });
  }
  o.classList.add("rs-drop-container"), o.addEventListener("dragover", (a) => {
    a.dataTransfer.types.includes(Si) && (a.preventDefault(), a.dataTransfer.dropEffect = a.ctrlKey || a.metaKey ? "move" : "copy");
  }), o.addEventListener("dragenter", (a) => {
    a.dataTransfer.types.includes(Si) && (a.preventDefault(), o.classList.add("rs-drop-over"));
  }), o.addEventListener("dragleave", (a) => {
    a.relatedTarget && o.contains(a.relatedTarget) || o.classList.remove("rs-drop-over");
  }), o.addEventListener("drop", (a) => {
    a.preventDefault(), o.classList.remove("rs-drop-over"), a.dataTransfer.types.includes(Si) && _f(a, i, -1);
  }), ld.set(i.uuid, { app: t, container: o });
}
c(ZS, "injectShapeDragHandles");
function eC(t) {
  const e = t.document;
  e && ld.delete(e.uuid);
}
c(eC, "cleanupShapeDrag");
const tC = 100, Kg = 32;
function nC(t, e, n) {
  const i = [];
  for (let r = 0; r < t.length; r += 2)
    i.push(new n.IntPoint(Math.round(t[r] * e), Math.round(t[r + 1] * e)));
  return n.Clipper.Orientation(i) || i.reverse(), i;
}
c(nC, "polygonToPath");
function iC(t, e, n) {
  const { x: i, y: r, width: o, height: s, rotation: a } = t;
  let l = i * e, u = r * e, d = (i + o) * e, f = (r + s) * e;
  if (!a)
    return l = Math.round(l), u = Math.round(u), d = Math.round(d), f = Math.round(f), [new n.IntPoint(l, u), new n.IntPoint(d, u), new n.IntPoint(d, f), new n.IntPoint(l, f)];
  const h = (l + d) / 2, m = (u + f) / 2;
  l -= h, u -= m, d -= h, f -= m;
  const p = a * Math.PI / 180, y = Math.cos(p), E = Math.sin(p);
  return [
    new n.IntPoint(Math.round(y * l - E * u + h), Math.round(E * l + y * u + m)),
    new n.IntPoint(Math.round(y * d - E * u + h), Math.round(E * d + y * u + m)),
    new n.IntPoint(Math.round(y * d - E * f + h), Math.round(E * d + y * f + m)),
    new n.IntPoint(Math.round(y * l - E * f + h), Math.round(E * l + y * f + m))
  ];
}
c(iC, "rectangleToPath");
function rC(t, e, n, i) {
  const { x: r, y: o, radius: s } = t, a = r * e, l = o * e, u = s * e, d = [];
  for (let f = 0; f < i; f++) {
    const h = 2 * Math.PI * f / i;
    d.push(new n.IntPoint(Math.round(a + Math.cos(h) * u), Math.round(l + Math.sin(h) * u)));
  }
  return d;
}
c(rC, "circleToPath");
function oC(t, e, n, i) {
  const { x: r, y: o, radiusX: s, radiusY: a, rotation: l } = t, u = r * e, d = o * e, f = s * e, h = a * e, m = (l || 0) * Math.PI / 180, p = Math.cos(m), y = Math.sin(m), E = [];
  for (let v = 0; v < i; v++) {
    const b = 2 * Math.PI * v / i, w = Math.cos(b) * f, S = Math.sin(b) * h;
    E.push(new n.IntPoint(Math.round(u + p * w - y * S), Math.round(d + y * w + p * S)));
  }
  return E;
}
c(oC, "ellipseToPath");
function Ou(t, e, n, i = {}) {
  const r = i.vertexCount ?? Kg;
  switch (t.type) {
    case "polygon":
      return nC(t.points, e, n);
    case "rectangle":
      return iC(t, e, n);
    case "circle":
      return rC(t, e, n, r);
    case "ellipse":
      return oC(t, e, n, r);
    default:
      throw new Error(`Unknown shape type: ${t.type}`);
  }
}
c(Ou, "shapeToClipperPath");
function Xg(t, e, n) {
  const i = [];
  for (const r of t)
    i.push(r.X / e, r.Y / e);
  return { type: "polygon", points: i, hole: n };
}
c(Xg, "clipperPathToPolygonShape");
function Nf(t) {
  const e = [], n = [], i = t.Childs();
  for (let r = i.length - 1; r >= 0; r--)
    n.push(i[r]);
  for (; n.length > 0; ) {
    const r = n.pop();
    e.push({ path: r.Contour(), hole: r.IsHole() });
    const o = r.Childs();
    for (let s = o.length - 1; s >= 0; s--)
      n.push(o[s]);
  }
  return e;
}
c(Nf, "walkPolyTree");
function Jg(t, e, n = {}) {
  const i = n.scalingFactor ?? tC, r = n.vertexCount ?? Kg, o = [], s = [];
  for (const h of t)
    h.hole ? s.push(h) : o.push(h);
  if (o.length <= 1 && s.length === 0 || o.length === 0) return null;
  const a = [];
  for (const h of o)
    a.push(Ou(h, i, e, { vertexCount: r }));
  const l = new e.Clipper();
  l.AddPaths(a, e.PolyType.ptSubject, !0);
  const u = new e.PolyTree();
  l.Execute(e.ClipType.ctUnion, u, e.PolyFillType.pftNonZero, e.PolyFillType.pftNonZero);
  let d = u;
  if (s.length > 0) {
    const h = [];
    for (const { path: b, hole: w } of Nf(u))
      w || h.push(b);
    const m = [];
    for (const b of s) {
      const w = Ou(b, i, e, { vertexCount: r });
      e.Clipper.Orientation(w) || w.reverse(), m.push(w);
    }
    const p = new e.Clipper();
    p.AddPaths(m, e.PolyType.ptSubject, !0);
    const y = new e.Paths();
    p.Execute(e.ClipType.ctUnion, y, e.PolyFillType.pftNonZero, e.PolyFillType.pftNonZero);
    const E = [];
    for (const b of y)
      e.Clipper.Orientation(b) && b.reverse(), E.push(b);
    const v = new e.Clipper();
    v.AddPaths(h, e.PolyType.ptSubject, !0), v.AddPaths(E, e.PolyType.ptClip, !0), d = new e.PolyTree(), v.Execute(e.ClipType.ctDifference, d, e.PolyFillType.pftNonZero, e.PolyFillType.pftNonZero);
  }
  const f = [];
  for (const { path: h, hole: m } of Nf(d))
    f.push(Xg(h, i, m));
  return f;
}
c(Jg, "mergeShapes");
function sC(t, e) {
  const n = Ye(e);
  if (!n) return;
  const i = t.document;
  if (!i) return;
  const r = n.querySelector("header.region-element.region-shape .region-element-controls");
  if (!r || r.querySelector('[data-action="shapeMergeOverlapping"]')) return;
  const o = document.createElement("a");
  o.className = "control", o.dataset.action = "shapeMergeOverlapping", o.dataset.tooltip = "Merge shapes & apply holes", o.setAttribute("aria-label", "Merge shapes and apply holes"), o.innerHTML = '<i class="fa-solid fa-object-union fa-fw"></i>';
  const s = i.shapes.filter((l) => !l.hole).length, a = i.shapes.filter((l) => l.hole).length;
  s < 2 && (s === 0 || a === 0) && (o.classList.add("disabled"), o.dataset.tooltip = "Need 2+ shapes to merge, or shapes with holes to subtract"), o.addEventListener("click", async (l) => {
    if (l.preventDefault(), o.classList.contains("disabled")) return;
    const u = i.shapes.map((f) => foundry.utils.deepClone(f)), d = Jg(u, ClipperLib);
    if (!d) {
      ui.notifications.info("Nothing to merge — need 2+ shapes, or shapes with holes.");
      return;
    }
    await i.update({ shapes: d }), ui.notifications.info(`Merged ${u.length} shapes into ${d.length}.`);
  }), r.prepend(o);
}
c(sC, "injectMergeButton");
var zf, Pr, Qg, Zg;
const It = class It extends yt(pt) {
  constructor() {
    super(...arguments);
    _(this, Pr);
  }
  // ── Context ───────────────────────────────────────────────────────────
  async _prepareContext() {
    var a, l, u;
    const n = CONST.REGION_VISIBILITY, i = ((l = (a = canvas.scene) == null ? void 0 : a.regions) == null ? void 0 : l.contents) ?? [], r = {};
    for (const d of i) {
      const f = d.visibility ?? n.LAYER;
      r[f] = (r[f] ?? 0) + 1;
    }
    const o = (u = Object.entries(r).sort((d, f) => f[1] - d[1])[0]) == null ? void 0 : u[0], s = o != null ? Number(o) : n.GAMEMASTER;
    return {
      options: Object.entries(n).map(([d, f]) => ({
        value: f,
        label: game.i18n.localize(`REGION.VISIBILITY.${d}.label`),
        selected: f === s
      }))
    };
  }
  // ── Render & Events ───────────────────────────────────────────────────
  _onRender(n, i) {
    super._onRender(n, i), I(this, Pr, Qg).call(this);
  }
  // ── Static opener ────────────────────────────────────────────────────
  static open() {
    var r, o;
    if ((((o = (r = canvas.scene) == null ? void 0 : r.regions) == null ? void 0 : o.contents) ?? []).length === 0) {
      ui.notifications.info("No regions on this scene.");
      return;
    }
    new It().render(!0);
  }
};
Pr = new WeakSet(), Qg = /* @__PURE__ */ c(function() {
  var i, r;
  const n = this.element;
  n instanceof HTMLElement && ((i = n.querySelector("[data-action='apply']")) == null || i.addEventListener("click", () => I(this, Pr, Zg).call(this)), (r = n.querySelector("[data-action='cancel']")) == null || r.addEventListener("click", () => this.close()));
}, "#bindEvents"), Zg = /* @__PURE__ */ c(async function() {
  var u, d, f;
  const i = this.element.querySelector("[data-role='visibility-select']"), r = Number(i.value), o = ((d = (u = canvas.scene) == null ? void 0 : u.regions) == null ? void 0 : d.contents) ?? [];
  if (o.length === 0) {
    ui.notifications.info("No regions on this scene."), this.close();
    return;
  }
  const s = o.filter((h) => h.visibility !== r).map((h) => ({ _id: h.id, visibility: r }));
  if (s.length === 0) {
    ui.notifications.info("All regions already have the selected visibility."), this.close();
    return;
  }
  await canvas.scene.updateEmbeddedDocuments("Region", s);
  const a = CONST.REGION_VISIBILITY, l = game.i18n.localize(
    `REGION.VISIBILITY.${(f = Object.entries(a).find(([, h]) => h === r)) == null ? void 0 : f[0]}.label`
  );
  ui.notifications.info(`Set visibility to "${l}" on ${s.length} region(s).`), this.close();
}, "#doApply"), c(It, "GlobalVisibilityApplication"), se(It, "APP_ID", `${k}-global-visibility`), se(It, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  ye(It, It, "DEFAULT_OPTIONS"),
  {
    id: It.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((zf = ye(It, It, "DEFAULT_OPTIONS")) == null ? void 0 : zf.classes) ?? [], "eidolon-global-visibility-window", "themed"])
    ),
    tag: "section",
    window: {
      title: "Global Region Visibility",
      icon: "fa-solid fa-eye",
      resizable: !1
    },
    position: {
      width: 320,
      height: "auto"
    }
  },
  { inplace: !1 }
)), se(It, "PARTS", {
  content: {
    template: `modules/${k}/templates/global-visibility.html`
  }
});
let Au = It;
const ep = 100, tp = 32;
function aC(t) {
  let e = 1 / 0, n = 1 / 0, i = -1 / 0, r = -1 / 0, o = !1;
  for (const s of t)
    if (!s.hole)
      switch (s.type) {
        case "polygon":
          for (let a = 0; a < s.points.length; a += 2) {
            const l = s.points[a], u = s.points[a + 1];
            l < e && (e = l), u < n && (n = u), l > i && (i = l), u > r && (r = u), o = !0;
          }
          break;
        case "rectangle": {
          const a = [
            [s.x, s.y],
            [s.x + s.width, s.y],
            [s.x + s.width, s.y + s.height],
            [s.x, s.y + s.height]
          ];
          if (s.rotation) {
            const l = s.x + s.width / 2, u = s.y + s.height / 2, d = s.rotation * Math.PI / 180, f = Math.cos(d), h = Math.sin(d);
            for (const [m, p] of a) {
              const y = m - l, E = p - u, v = f * y - h * E + l, b = h * y + f * E + u;
              v < e && (e = v), b < n && (n = b), v > i && (i = v), b > r && (r = b), o = !0;
            }
          } else
            for (const [l, u] of a)
              l < e && (e = l), u < n && (n = u), l > i && (i = l), u > r && (r = u), o = !0;
          break;
        }
        case "circle": {
          const a = s.radius;
          s.x - a < e && (e = s.x - a), s.y - a < n && (n = s.y - a), s.x + a > i && (i = s.x + a), s.y + a > r && (r = s.y + a), o = !0;
          break;
        }
        case "ellipse": {
          const a = s.radiusX, l = s.radiusY;
          s.x - a < e && (e = s.x - a), s.y - l < n && (n = s.y - l), s.x + a > i && (i = s.x + a), s.y + l > r && (r = s.y + l), o = !0;
          break;
        }
      }
  return o ? { minX: e, minY: n, maxX: i, maxY: r } : null;
}
c(aC, "regionBBox");
function lC(t, e) {
  return t.maxX > e.minX && t.minX < e.maxX && t.maxY > e.minY && t.minY < e.maxY;
}
c(lC, "bboxOverlaps");
function np(t, e, n, i) {
  const r = [];
  for (const o of t)
    o.hole || r.push(Ou(o, e, n, { vertexCount: i }));
  return r;
}
c(np, "nonHolePaths");
function $f(t, e) {
  if (t.length === 0) return [];
  if (t.length === 1) return [t[0]];
  const n = new e.Clipper();
  n.AddPaths(t, e.PolyType.ptSubject, !0);
  const i = new e.Paths();
  return n.Execute(e.ClipType.ctUnion, i, e.PolyFillType.pftNonZero, e.PolyFillType.pftNonZero), i;
}
c($f, "unionPaths");
function cC(t, e, n, i) {
  const r = new n.Clipper();
  r.AddPaths(t, n.PolyType.ptSubject, !0), r.AddPaths(e, n.PolyType.ptClip, !0);
  const o = new n.Paths();
  r.Execute(n.ClipType.ctIntersection, o, n.PolyFillType.pftNonZero, n.PolyFillType.pftNonZero);
  const s = 4 * i * i;
  return o.some((a) => Math.abs(n.Clipper.Area(a)) > s);
}
c(cC, "pathsIntersect");
function uC(t, e, n = {}) {
  const i = n.scalingFactor ?? ep, r = n.vertexCount ?? tp, o = [];
  for (const a of t) {
    const l = a.shapes ?? [], u = aC(l);
    if (!u) continue;
    const d = np(l, i, e, r);
    d.length !== 0 && o.push({ region: a, bbox: u, paths: d });
  }
  const s = /* @__PURE__ */ new Set();
  for (let a = 0; a < o.length; a++)
    for (let l = a + 1; l < o.length; l++)
      lC(o[a].bbox, o[l].bbox) && cC(o[a].paths, o[l].paths, e, i) && (s.add(o[a].region), s.add(o[l].region));
  return [...s];
}
c(uC, "findOverlappingRegions");
function dC(t, e, n = {}) {
  const i = n.scalingFactor ?? ep, r = n.vertexCount ?? tp;
  let o = [];
  const s = [];
  for (let a = 0; a < t.length; a++) {
    const l = t[a], u = l.shapes ?? [], d = np(u, i, e, r);
    if (a === 0) {
      o = $f(d, e);
      continue;
    }
    if (d.length === 0) continue;
    const f = new e.Clipper();
    f.AddPaths(d, e.PolyType.ptSubject, !0), f.AddPaths(o, e.PolyType.ptClip, !0);
    const h = new e.PolyTree();
    f.Execute(e.ClipType.ctDifference, h, e.PolyFillType.pftNonZero, e.PolyFillType.pftNonZero);
    const m = [], p = [], y = h.Childs();
    for (let v = y.length - 1; v >= 0; v--) p.push(y[v]);
    for (; p.length > 0; ) {
      const v = p.pop();
      m.push(Xg(v.Contour(), i, v.IsHole()));
      const b = v.Childs();
      for (let w = b.length - 1; w >= 0; w--) p.push(b[w]);
    }
    for (const v of u)
      v.hole && m.push(foundry.utils.deepClone(v));
    s.push({ region: l, newShapes: m });
    const E = [...o, ...d];
    o = $f(E, e);
  }
  return s;
}
c(dC, "resolveOverlaps");
var Yf, An, ni, cn, gi, ip, rp, op;
const kt = class kt extends yt(pt) {
  /**
   * @param {object} options
   * @param {object[]} [options.regions]  Pre-filtered overlapping regions
   */
  constructor(n = {}) {
    super(n);
    _(this, gi);
    /** @type {object[]} Ordered region documents. */
    _(this, An, []);
    /** @type {Set<string>} IDs of regions excluded from resolution. */
    _(this, ni, /* @__PURE__ */ new Set());
    /** @type {number|null} Index of the item currently being dragged. */
    _(this, cn, null);
    O(this, An, [...n.regions ?? []]);
  }
  // ── Context ───────────────────────────────────────────────────────────
  async _prepareContext() {
    return {
      regions: g(this, An).map((n) => ({
        id: n.id,
        name: n.name,
        color: n.color ?? "#999999",
        shapeCount: (n.shapes ?? []).length,
        isSingle: (n.shapes ?? []).length === 1,
        excluded: g(this, ni).has(n.id)
      }))
    };
  }
  // ── Render & Events ───────────────────────────────────────────────────
  _onRender(n, i) {
    super._onRender(n, i), I(this, gi, ip).call(this);
  }
  // ── Static opener ────────────────────────────────────────────────────
  /**
   * Open the resolver. Detects overlapping regions first; if none overlap,
   * shows a notification and does not open.
   */
  static open() {
    var o, s;
    const n = ((s = (o = canvas.scene) == null ? void 0 : o.regions) == null ? void 0 : s.contents) ?? [];
    if (n.length < 2) {
      ui.notifications.info("Need at least 2 regions to check for overlaps.");
      return;
    }
    const i = uC(n, ClipperLib);
    if (i.length === 0) {
      ui.notifications.info("No overlapping regions found on this scene.");
      return;
    }
    new kt({ regions: i }).render(!0);
  }
};
An = new WeakMap(), ni = new WeakMap(), cn = new WeakMap(), gi = new WeakSet(), ip = /* @__PURE__ */ c(function() {
  var r, o;
  const n = this.element;
  if (!(n instanceof HTMLElement)) return;
  const i = n.querySelector("[data-role='region-list']");
  i && I(this, gi, rp).call(this, i);
  for (const s of n.querySelectorAll("[data-action='toggle-exclude']"))
    s.addEventListener("click", (a) => {
      a.stopPropagation();
      const l = Number(s.dataset.index), u = g(this, An)[l];
      u && (g(this, ni).has(u.id) ? g(this, ni).delete(u.id) : g(this, ni).add(u.id), this.render({ force: !0 }));
    });
  (r = n.querySelector("[data-action='resolve']")) == null || r.addEventListener("click", () => I(this, gi, op).call(this)), (o = n.querySelector("[data-action='cancel']")) == null || o.addEventListener("click", () => this.close());
}, "#bindEvents"), // ── Drag reorder ─────────────────────────────────────────────────────
rp = /* @__PURE__ */ c(function(n) {
  const i = n.querySelectorAll(".overlap-resolver__item");
  for (const r of i)
    r.addEventListener("dragstart", (o) => {
      O(this, cn, Number(r.dataset.index)), o.dataTransfer.effectAllowed = "move", o.dataTransfer.setData("text/plain", String(g(this, cn))), requestAnimationFrame(() => r.classList.add("is-dragging"));
    }), r.addEventListener("dragover", (o) => {
      o.preventDefault(), o.dataTransfer.dropEffect = "move";
      const s = r.getBoundingClientRect(), a = s.top + s.height / 2, l = o.clientY < a;
      for (const u of n.querySelectorAll(".overlap-resolver__item"))
        u.classList.remove("or--insert-before", "or--insert-after");
      r.classList.add(l ? "or--insert-before" : "or--insert-after");
    }), r.addEventListener("dragleave", () => {
      r.classList.remove("or--insert-before", "or--insert-after");
    }), r.addEventListener("drop", (o) => {
      o.preventDefault();
      for (const h of n.querySelectorAll(".overlap-resolver__item"))
        h.classList.remove("or--insert-before", "or--insert-after", "is-dragging");
      if (g(this, cn) == null) return;
      const s = Number(r.dataset.index), a = r.getBoundingClientRect(), l = a.top + a.height / 2;
      let u = o.clientY < l ? s : s + 1;
      const d = g(this, cn);
      if (d === u || d + 1 === u) {
        O(this, cn, null);
        return;
      }
      const [f] = g(this, An).splice(d, 1);
      d < u && u--, g(this, An).splice(u, 0, f), O(this, cn, null), this.render({ force: !0 });
    }), r.addEventListener("dragend", () => {
      O(this, cn, null);
      for (const o of n.querySelectorAll(".overlap-resolver__item"))
        o.classList.remove("or--insert-before", "or--insert-after", "is-dragging");
    });
}, "#bindDragReorder"), op = /* @__PURE__ */ c(async function() {
  const n = g(this, An).filter((s) => !g(this, ni).has(s.id)), i = dC(n, ClipperLib);
  if (i.length === 0) {
    ui.notifications.info("No overlaps found after applying priority order."), this.close();
    return;
  }
  const r = i.map(({ region: s, newShapes: a }) => ({
    _id: s.id,
    shapes: a
  }));
  await canvas.scene.updateEmbeddedDocuments("Region", r);
  const o = i.map(({ region: s }) => s.name).join(", ");
  ui.notifications.info(`Resolved overlaps: updated ${i.length} region(s) (${o}).`), this.close();
}, "#doResolve"), c(kt, "OverlapResolverApplication"), se(kt, "APP_ID", `${k}-overlap-resolver`), se(kt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  ye(kt, kt, "DEFAULT_OPTIONS"),
  {
    id: kt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Yf = ye(kt, kt, "DEFAULT_OPTIONS")) == null ? void 0 : Yf.classes) ?? [], "eidolon-overlap-resolver-window", "themed"])
    ),
    tag: "section",
    window: {
      title: "Overlap Resolver",
      icon: "fa-solid fa-scissors",
      resizable: !1
    },
    position: {
      width: 360,
      height: "auto"
    }
  },
  { inplace: !1 }
)), se(kt, "PARTS", {
  content: {
    template: `modules/${k}/templates/overlap-resolver.html`
  }
});
let Mu = kt;
function fC(t, e) {
  var u;
  const n = Ye(e);
  if (!n) return;
  const i = n.querySelector("header.window-header") ?? ((u = n.closest("section")) == null ? void 0 : u.querySelector("header.window-header"));
  if (!i || i.querySelector('[data-action="openGlobalVisibility"]')) return;
  const r = i.querySelector("button.close") ?? i.querySelector('[data-action="close"]'), o = /* @__PURE__ */ c((d) => r ? r.before(d) : i.append(d), "insertBefore"), s = document.createElement("button");
  s.type = "button", s.className = "header-control fa-solid fa-object-union", s.dataset.action = "mergeAllRegionShapes", s.dataset.tooltip = "Merge shapes in all regions", s.setAttribute("aria-label", "Merge shapes in all regions"), s.addEventListener("click", async (d) => {
    var p, y;
    d.preventDefault(), d.stopPropagation();
    const f = ((y = (p = canvas.scene) == null ? void 0 : p.regions) == null ? void 0 : y.contents) ?? [];
    if (f.length === 0) {
      ui.notifications.info("No regions on this scene.");
      return;
    }
    const h = [];
    for (const E of f) {
      const v = (E.shapes ?? []).map((w) => foundry.utils.deepClone(w)), b = Jg(v, ClipperLib);
      b && (b.length >= v.length || h.push({ _id: E.id, shapes: b }));
    }
    if (h.length === 0) {
      ui.notifications.info("Nothing to merge — all regions already have simple shapes.");
      return;
    }
    await canvas.scene.updateEmbeddedDocuments("Region", h);
    const m = h.reduce((E, v) => E + v.shapes.length, 0);
    ui.notifications.info(`Merged shapes in ${h.length} region(s) (${m} shapes total).`);
  }), o(s);
  const a = document.createElement("button");
  a.type = "button", a.className = "header-control fa-solid fa-eye", a.dataset.action = "openGlobalVisibility", a.dataset.tooltip = "Global Region Visibility", a.setAttribute("aria-label", "Set visibility for all regions"), a.addEventListener("click", (d) => {
    d.preventDefault(), d.stopPropagation(), Au.open();
  }), o(a);
  const l = document.createElement("button");
  l.type = "button", l.className = "header-control fa-solid fa-scissors", l.dataset.action = "openOverlapResolver", l.dataset.tooltip = "Overlap Resolver", l.setAttribute("aria-label", "Open overlap resolver"), l.addEventListener("click", (d) => {
    d.preventDefault(), d.stopPropagation(), Mu.open();
  }), o(l);
}
c(fC, "injectRegionLegendButtons");
function hC() {
  Hooks.on("renderRegionConfig", (t, e) => {
    ZS(t, e), sC(t, e);
  }), Hooks.on("closeRegionConfig", (t) => {
    eC(t);
  }), Hooks.on("renderRegionLegend", (t, e) => {
    fC(t, e);
  });
}
c(hC, "registerRegionShapeHooks");
hC();
const si = k, cd = "softVisionAttenuation", ud = "softVisionBrightness", dd = "softVisionContrast", fd = "softVisionSaturation", mo = "softFade", mr = Object.freeze({
  attenuation: 0.9,
  brightness: -0.1,
  contrast: -0.2,
  saturation: -0.1
});
function hs(t) {
  try {
    const e = Number(game.settings.get(si, t));
    return Number.isFinite(e) ? e : mr[Ff(t)];
  } catch {
    return mr[Ff(t)] ?? 0;
  }
}
c(hs, "getNumberSetting");
function Ff(t) {
  return {
    [cd]: "attenuation",
    [ud]: "brightness",
    [dd]: "contrast",
    [fd]: "saturation"
  }[t];
}
c(Ff, "settingToDefaultKey");
function mC(t) {
  game.settings.register(si, cd, {
    name: "Soft Fade: Attenuation",
    hint: "How strongly the vision darkens toward the perimeter (0 = uniform, 1 = full falloff).",
    scope: "client",
    config: !0,
    type: Number,
    default: mr.attenuation,
    range: { min: 0, max: 1, step: 0.05 },
    onChange: t
  }), game.settings.register(si, ud, {
    name: "Soft Fade: Brightness",
    hint: "Negative values darken the outer ring of vision.",
    scope: "client",
    config: !0,
    type: Number,
    default: mr.brightness,
    range: { min: -1, max: 1, step: 0.05 },
    onChange: t
  }), game.settings.register(si, dd, {
    name: "Soft Fade: Contrast",
    hint: "Negative values soften the scene near the vision edge.",
    scope: "client",
    config: !0,
    type: Number,
    default: mr.contrast,
    range: { min: -1, max: 1, step: 0.05 },
    onChange: t
  }), game.settings.register(si, fd, {
    name: "Soft Fade: Saturation",
    hint: "Negative values desaturate toward the vision edge.",
    scope: "client",
    config: !0,
    type: Number,
    default: mr.saturation,
    range: { min: -1, max: 1, step: 0.05 },
    onChange: t
  });
}
c(mC, "registerSettings");
function gC() {
  var t, e, n;
  return ((e = (t = foundry == null ? void 0 : foundry.canvas) == null ? void 0 : t.perception) == null ? void 0 : e.VisionMode) ?? ((n = CONFIG.Canvas.visionModes.basic) == null ? void 0 : n.constructor);
}
c(gC, "getVisionModeClass");
function pC() {
  var t, e, n, i;
  return ((e = (t = foundry == null ? void 0 : foundry.canvas) == null ? void 0 : t.rendering) == null ? void 0 : e.ColorAdjustmentsSamplerShader) ?? ((i = (n = CONFIG.Canvas.visionModes.darkvision) == null ? void 0 : n.canvas) == null ? void 0 : i.shader);
}
c(pC, "getColorAdjustmentsShader");
function yC() {
  const t = gC(), e = pC();
  return !t || !e ? null : new t({
    id: mo,
    label: "Soft Fade",
    tokenConfig: !0,
    canvas: {
      shader: e,
      uniforms: { contrast: 0, saturation: 0, brightness: 0 }
    },
    vision: {
      defaults: {
        attenuation: hs(cd),
        brightness: hs(ud),
        contrast: hs(dd),
        saturation: hs(fd)
      }
    }
  });
}
c(yC, "buildSoftVisionMode");
function Gl() {
  var e;
  const t = yC();
  return t ? (CONFIG.Canvas.visionModes[mo] = t, canvas != null && canvas.ready && ((e = canvas.perception) == null || e.update({ refreshVision: !0, refreshLighting: !0 })), !0) : (console.warn(`[${si}] Soft Vision: required classes not available yet, deferring.`), !1);
}
c(Gl, "refreshVisionMode");
function bC() {
  Hooks.once("init", () => {
    mC(Gl);
  }), Hooks.once("setup", () => {
    Gl();
  }), Hooks.once("ready", () => {
    CONFIG.Canvas.visionModes[mo] || Gl();
    const t = game.modules.get(si);
    t.api || (t.api = {}), t.api.softVision = {
      VISION_MODE_ID: mo,
      /** Apply the Soft Fade vision mode to all currently controlled tokens. */
      async applyToControlled() {
        const e = canvas.tokens.controlled;
        if (!e.length) {
          ui.notifications.warn("Select at least one token.");
          return;
        }
        for (const n of e)
          await n.document.updateVisionMode(mo, !0);
      }
    }, console.log(`[${si}] Soft Vision API registered.`);
  });
}
c(bC, "registerSoftVisionHooks");
bC();
const Fr = k, xu = "softLightFade", Kt = Object.freeze({
  enabled: !1,
  threshold: 0.3,
  saturation: -0.8,
  brightness: -0.15
}), vC = `
  uniform bool softFadeEnabled;
  uniform float softFadeThreshold;
  uniform float softFadeSaturation;
  uniform float softFadeBrightness;`, wC = `
    // Soft Light Fade — per-light radial desaturation/darkening
    if ( softFadeEnabled ) {
      float sfFade = smoothstep(softFadeThreshold, 1.0, dist);
      if ( sfFade > 0.0 ) {
        vec3 sfGrey = vec3(perceivedBrightness(finalColor));
        finalColor = mix(finalColor, sfGrey, sfFade * (-softFadeSaturation));
        finalColor *= 1.0 + (sfFade * softFadeBrightness);
      }
    }
`, Wl = "uniform float saturation;", EC = "if ( attenuation != 0.0 ) depth *= smoothstep(";
function SC() {
  const t = /* @__PURE__ */ new Set();
  for (const e of Object.values(CONFIG.Canvas.lightAnimations))
    e.illuminationShader && t.add(e.illuminationShader);
  if (t.size > 0) {
    const e = t.values().next().value;
    let n = Object.getPrototypeOf(e);
    for (; n && n !== Function.prototype; ) {
      if (n.hasOwnProperty("SHADER_HEADER") && typeof n.fragmentShader == "string") {
        t.add(n);
        break;
      }
      n = Object.getPrototypeOf(n);
    }
  }
  return t;
}
c(SC, "collectIlluminationShaders");
function CC(t) {
  const e = t.fragmentShader;
  if (typeof e != "string" || e.includes("softFadeEnabled")) return !1;
  const n = e.indexOf(Wl);
  if (n === -1)
    return console.warn("[eidolon-utilities] Soft Light: could not find uniform anchor in", t.name), !1;
  const i = e.slice(0, n + Wl.length) + vC + e.slice(n + Wl.length), r = i.indexOf(EC);
  if (r === -1)
    return console.warn("[eidolon-utilities] Soft Light: could not find FALLOFF anchor in", t.name), !1;
  const o = i.slice(0, r) + wC + i.slice(r);
  return t.fragmentShader = o, t.defaultUniforms.hasOwnProperty("softFadeEnabled") || (t.defaultUniforms = {
    ...t.defaultUniforms,
    softFadeEnabled: Kt.enabled,
    softFadeThreshold: Kt.threshold,
    softFadeSaturation: Kt.saturation,
    softFadeBrightness: Kt.brightness
  }), !0;
}
c(CC, "patchShaderClass");
function TC() {
  const t = SC();
  let e = 0;
  for (const n of t)
    CC(n) && e++;
  return e;
}
c(TC, "patchIlluminationShaders");
function LC() {
  var n, i;
  const t = (i = (n = foundry == null ? void 0 : foundry.canvas) == null ? void 0 : n.sources) == null ? void 0 : i.PointLightSource;
  if (!t) return null;
  let e = t.prototype;
  for (; e; ) {
    if (e.hasOwnProperty("_updateCommonUniforms")) return e;
    e = Object.getPrototypeOf(e);
  }
  return null;
}
c(LC, "getBaseLightSourceProto");
function IC() {
  const t = LC();
  if (!t)
    return console.warn(`[${Fr}] Soft Light: could not find _updateCommonUniforms on BaseLightSource`), !1;
  const e = t._updateCommonUniforms;
  return t._updateCommonUniforms = /* @__PURE__ */ c(function(i) {
    var a, l;
    e.call(this, i);
    const r = i == null ? void 0 : i.uniforms;
    if (!r || !("softFadeEnabled" in r)) return;
    const o = (a = this.object) == null ? void 0 : a.document;
    if (!o) {
      r.softFadeEnabled = !1;
      return;
    }
    const s = (l = o.getFlag) == null ? void 0 : l.call(o, Fr, xu);
    if (!(s != null && s.enabled)) {
      r.softFadeEnabled = !1;
      return;
    }
    r.softFadeEnabled = !0, r.softFadeThreshold = s.threshold ?? Kt.threshold, r.softFadeSaturation = s.saturation ?? Kt.saturation, r.softFadeBrightness = s.brightness ?? Kt.brightness;
  }, "patchedUpdateCommonUniforms"), !0;
}
c(IC, "patchUniformUpdater");
function kC() {
  Hooks.on("renderAmbientLightConfig", OC);
}
c(kC, "registerLightConfigUI");
function OC(t, e) {
  var v, b, w, S;
  const n = Ye(e);
  if (!n || n.querySelector(".eidolon-soft-light-fade")) return;
  const i = n.querySelector('.tab[data-tab="animation"]');
  if (!i) return;
  const r = t.document ?? ((v = t.object) == null ? void 0 : v.document) ?? t.object;
  if (!r) return;
  const o = ((b = r.getFlag) == null ? void 0 : b.call(r, Fr, xu)) ?? {}, s = o.enabled ?? Kt.enabled, a = o.threshold ?? Kt.threshold, l = o.saturation ?? Kt.saturation, u = o.brightness ?? Kt.brightness, d = `flags.${Fr}.${xu}`, f = document.createElement("fieldset");
  f.className = "eidolon-soft-light-fade", f.innerHTML = `
		<legend>Soft Fade</legend>
		<div class="form-group">
			<label>Enable Soft Fade</label>
			<input type="checkbox" name="${d}.enabled" ${s ? "checked" : ""}>
		</div>
		<div class="form-group eidolon-soft-light-threshold-group" ${s ? "" : 'style="opacity: 0.5"'}>
			<label>Fade Threshold</label>
			<div class="form-fields">
				<input type="range" name="${d}.threshold"
					min="0" max="0.95" step="0.05"
					value="${a}">
				<span class="range-value">${a}</span>
			</div>
			<p class="hint">How far from center the fade begins (0 = edge only, 0.95 = almost center).</p>
		</div>
		<div class="form-group eidolon-soft-light-saturation-group" ${s ? "" : 'style="opacity: 0.5"'}>
			<label>Edge Saturation</label>
			<div class="form-fields">
				<input type="range" name="${d}.saturation"
					min="-1" max="0" step="0.05"
					value="${l}">
				<span class="range-value">${l}</span>
			</div>
			<p class="hint">Desaturation strength at the edge (-1 = full greyscale, 0 = no change).</p>
		</div>
		<div class="form-group eidolon-soft-light-brightness-group" ${s ? "" : 'style="opacity: 0.5"'}>
			<label>Edge Brightness</label>
			<div class="form-fields">
				<input type="range" name="${d}.brightness"
					min="-0.5" max="0" step="0.05"
					value="${u}">
				<span class="range-value">${u}</span>
			</div>
			<p class="hint">Darkening at the edge (-0.5 = strong, 0 = no change).</p>
		</div>
	`, i.appendChild(f);
  const h = f.querySelector('input[type="checkbox"]'), m = f.querySelector(".eidolon-soft-light-threshold-group"), p = f.querySelector(".eidolon-soft-light-saturation-group"), y = f.querySelector(".eidolon-soft-light-brightness-group"), E = [m, p, y];
  h == null || h.addEventListener("change", () => {
    const T = h.checked;
    for (const L of E)
      L && (L.style.opacity = T ? "" : "0.5");
  });
  for (const T of f.querySelectorAll('input[type="range"]')) {
    const L = (w = T.parentElement) == null ? void 0 : w.querySelector(".range-value");
    L && T.addEventListener("input", () => {
      L.textContent = T.value;
    });
  }
  (S = t.setPosition) == null || S.call(t, { height: "auto" });
}
c(OC, "handleRender");
function AC() {
  Hooks.once("init", () => {
    const t = TC();
    console.log(`[${Fr}] Soft Light: patched ${t} illumination shaders`);
  }), Hooks.once("setup", () => {
    IC() && console.log(`[${Fr}] Soft Light: uniform updater installed`);
  }), kC();
}
c(AC, "registerSoftLightHooks");
AC();
const sp = "eidolon-utilities", MC = "directionalTeleport", zl = `${sp}.${MC}`, Df = `[${sp}] Directional Teleport:`, ms = ["left", "right", "up", "down"], Yl = { left: "Left", right: "Right", up: "Up", down: "Down" }, Kl = { left: "fa-arrow-left", right: "fa-arrow-right", up: "fa-arrow-up", down: "fa-arrow-down" }, xC = { left: "fa-arrow-right", right: "fa-arrow-left", up: "fa-arrow-down", down: "fa-arrow-up" };
Hooks.once("init", () => {
  const { RegionBehaviorType: t } = foundry.data.regionBehaviors, { BooleanField: e, DocumentUUIDField: n, StringField: i } = foundry.data.fields, p = class p extends i {
    /** @override */
    _toInput(b) {
      const w = b.value || "";
      let S = "";
      if (w)
        try {
          const L = fromUuidSync(w);
          if (L) {
            const A = L.parent;
            S = `${L.name} — ${(A == null ? void 0 : A.name) || "?"}`;
          } else
            S = w;
        } catch {
          S = w;
        }
      const T = document.createElement("div");
      return T.classList.add("eidutil-region-picker"), T.dataset.uuid = w, T.innerHTML = `<input type="hidden" name="${b.name}" value="${nr(w)}"><input type="text" class="eidutil-region-search" placeholder="Search regions…" autocomplete="off" value="${nr(S)}"><input type="text" class="eidutil-region-uuid" placeholder="Paste UUID… (Scene.x.Region.y)" autocomplete="off" value="${nr(w)}" style="display:none"><a class="eidutil-region-mode" title="Switch to UUID paste"><i class="fa-solid fa-keyboard"></i></a><a class="eidutil-region-clear" ${w ? "" : 'style="display:none"'}><i class="fa-solid fa-xmark"></i></a><div class="eidutil-region-dropdown" style="display:none"></div>`, T;
    }
  };
  c(p, "RegionPickerField");
  let r = p;
  const y = class y extends i {
    /** @override — returns static HTML, no event listeners */
    _toInput(b) {
      const w = b.value || "", S = w ? w.split(",").filter((N) => ms.includes(N)) : [], T = S.map(
        (N) => `<span class="eidutil-pill" data-value="${N}"><i class="fa-solid ${Kl[N]}"></i> <span>${Yl[N]}</span><a class="eidutil-pill-remove"><i class="fa-solid fa-xmark"></i></a></span>`
      ).join(""), L = S.length > 0 ? ' style="display:none"' : "", A = S.length >= ms.length ? ' style="display:none"' : "", M = ms.map(
        (N) => `<a class="eidutil-pill-option" data-value="${N}"` + (S.includes(N) ? ' style="display:none"' : "") + `><i class="fa-solid ${Kl[N]}"></i> ${Yl[N]}</a>`
      ).join(""), F = document.createElement("div");
      return F.classList.add("eidutil-direction-pills"), F.innerHTML = `<input type="hidden" name="${b.name}" value="${w}"><div class="eidutil-pill-box"><span class="eidutil-pill-empty-hint"${L}>Any direction</span>` + T + `</div><div class="eidutil-pill-add-wrapper"${A}><a class="eidutil-pill-add"><i class="fa-solid fa-plus"></i></a><div class="eidutil-pill-dropdown" style="display:none">${M}</div></div>`, F;
    }
  };
  c(y, "DirectionPillField");
  let o = y;
  Hooks.on("renderRegionBehaviorConfig", (v, b) => {
    var M, F;
    const w = b.querySelectorAll(".eidutil-direction-pills");
    if (w.length) {
      const N = b.querySelector('select[name="system.event"]');
      for (const $ of w) l($, N);
    }
    const S = (F = (M = v.document) == null ? void 0 : M.parent) == null ? void 0 : F.parent, T = S == null ? void 0 : S.id, L = d(S == null ? void 0 : S.folder), A = b.querySelectorAll(".eidutil-region-picker");
    for (const N of A) h(N, T, L);
  });
  function s(v) {
    return (v == null ? void 0 : v.value) === "enter" ? xC : Kl;
  }
  c(s, "_iconMap");
  function a(v, b) {
    const w = s(b);
    for (const S of v.querySelectorAll(".eidutil-pill")) {
      const T = S.dataset.value, L = S.querySelector("i:first-child");
      L && w[T] && (L.className = `fa-solid ${w[T]}`);
    }
    for (const S of v.querySelectorAll(".eidutil-pill-option")) {
      const T = S.dataset.value, L = S.querySelector("i");
      L && w[T] && (L.className = `fa-solid ${w[T]}`);
    }
  }
  c(a, "_refreshIcons");
  function l(v, b) {
    const w = v.querySelector('input[type="hidden"]'), S = v.querySelector(".eidutil-pill-box"), T = v.querySelector(".eidutil-pill-empty-hint"), L = v.querySelector(".eidutil-pill-add-wrapper"), A = v.querySelector(".eidutil-pill-add"), M = v.querySelector(".eidutil-pill-dropdown");
    if (!w || !S || !A || !M) return;
    a(v, b), b && b.addEventListener("change", () => a(v, b));
    const F = /* @__PURE__ */ c(() => {
      const P = [...S.querySelectorAll(".eidutil-pill")].map((j) => j.dataset.value);
      w.value = P.join(",");
    }, "syncHidden"), N = /* @__PURE__ */ c(() => {
      T && (T.style.display = S.querySelectorAll(".eidutil-pill").length > 0 ? "none" : "");
    }, "updateHint"), $ = /* @__PURE__ */ c(() => {
      const P = S.querySelectorAll(".eidutil-pill").length;
      L && (L.style.display = P >= ms.length ? "none" : "");
    }, "updateAddButton"), x = /* @__PURE__ */ c(() => {
      const P = new Set(w.value ? w.value.split(",") : []);
      for (const j of M.querySelectorAll(".eidutil-pill-option"))
        j.style.display = P.has(j.dataset.value) ? "none" : "";
    }, "updateDropdownOptions"), R = /* @__PURE__ */ c((P) => {
      const j = s(b), q = document.createElement("span");
      q.classList.add("eidutil-pill"), q.dataset.value = P, q.innerHTML = `<i class="fa-solid ${j[P]}"></i> <span>${Yl[P]}</span><a class="eidutil-pill-remove"><i class="fa-solid fa-xmark"></i></a>`, S.appendChild(q);
    }, "addPill");
    S.addEventListener("click", (P) => {
      const j = P.target.closest(".eidutil-pill-remove");
      j && (P.preventDefault(), j.closest(".eidutil-pill").remove(), F(), N(), $(), x());
    }), A.addEventListener("pointerdown", (P) => {
      P.preventDefault(), P.stopPropagation(), x();
      const j = M.style.display === "none";
      M.style.display = j ? "block" : "none", j && setTimeout(() => {
        const q = /* @__PURE__ */ c((B) => {
          M.contains(B.target) || (M.style.display = "none", document.removeEventListener("pointerdown", q, !0));
        }, "closeHandler");
        document.addEventListener("pointerdown", q, !0);
      }, 0);
    }), M.addEventListener("pointerdown", (P) => {
      const j = P.target.closest(".eidutil-pill-option");
      j && (P.preventDefault(), P.stopPropagation(), R(j.dataset.value), F(), M.style.display = "none", N(), $());
    });
  }
  c(l, "_activateDirectionPills");
  function u() {
    const v = [];
    for (const b of game.scenes) {
      const w = d(b.folder);
      for (const S of b.regions) {
        const T = S.uuid, L = S.name || "Unnamed Region", A = b.name || "Unnamed Scene", M = `${w} ${A} ${L}`.toLowerCase();
        v.push({ uuid: T, sceneId: b.id, regionName: L, sceneName: A, folderPath: w, searchText: M });
      }
    }
    return v;
  }
  c(u, "_buildRegionIndex");
  function d(v) {
    if (!v) return "";
    const b = [];
    let w = v;
    for (; w; )
      b.unshift(w.name), w = w.folder;
    return b.join(" / ");
  }
  c(d, "_folderPath");
  function f(v) {
    var T, L;
    const b = v.match(/^Scene\.([^.]+)\.Region\.([^.]+)$/);
    if (!b) return null;
    const w = (T = game.scenes) == null ? void 0 : T.get(b[1]);
    return w ? ((L = w.regions) == null ? void 0 : L.get(b[2])) ?? null : null;
  }
  c(f, "_resolveRegionUuid");
  function h(v, b, w) {
    const S = v.querySelector('input[type="hidden"]'), T = v.querySelector(".eidutil-region-search"), L = v.querySelector(".eidutil-region-uuid"), A = v.querySelector(".eidutil-region-mode"), M = v.querySelector(".eidutil-region-clear"), F = v.querySelector(".eidutil-region-dropdown");
    if (!S || !T || !L || !A || !F) return;
    let N = null, $ = T.value || "", x = !1;
    const R = /* @__PURE__ */ c(() => (N || (N = u()), N), "ensureIndex"), P = /* @__PURE__ */ c((U) => {
      const G = R(), me = (U || "").toLowerCase().trim(), Ke = me ? G.filter((oe) => oe.searchText.includes(me)) : G;
      if (Ke.length === 0) {
        F.innerHTML = '<div class="eidutil-region-no-match">No regions found</div>';
        return;
      }
      const ce = /* @__PURE__ */ new Map(), Se = /* @__PURE__ */ new Map(), He = /* @__PURE__ */ new Map();
      for (const oe of Ke) {
        const Me = oe.sceneName + (oe.folderPath ? ` (${oe.folderPath})` : "");
        ce.has(Me) || (ce.set(Me, []), Se.set(Me, oe.sceneId), He.set(Me, oe.folderPath)), ce.get(Me).push(oe);
      }
      const gn = [...ce.keys()].sort((oe, Me) => {
        const Xe = Se.get(oe) === b, wt = Se.get(Me) === b;
        if (Xe !== wt) return Xe ? -1 : 1;
        const Ue = qs(w, He.get(oe)), Et = qs(w, He.get(Me));
        return Ue !== Et ? Et - Ue : oe.localeCompare(Me);
      });
      let $e = "";
      for (const oe of gn) {
        const Me = ce.get(oe), Xe = Se.get(oe) === b;
        $e += `<div class="eidutil-region-group-label"${Xe ? ' data-current-scene="true"' : ""}>${nr(oe)}</div>`;
        for (const wt of Me)
          $e += `<a class="eidutil-region-option" data-uuid="${nr(wt.uuid)}"><i class="fa-solid fa-draw-polygon"></i> ${nr(wt.regionName)}</a>`;
      }
      F.innerHTML = $e;
    }, "renderOptions"), j = /* @__PURE__ */ c(() => {
      P(T.value === $ ? "" : T.value), F.style.display = "block", requestAnimationFrame(() => {
        const U = F.querySelector('.eidutil-region-group-label[data-current-scene="true"]');
        U && U.scrollIntoView({ block: "start" });
      }), setTimeout(() => {
        const U = /* @__PURE__ */ c((G) => {
          v.contains(G.target) || (q(), document.removeEventListener("pointerdown", U, !0));
        }, "closeHandler");
        document.addEventListener("pointerdown", U, !0);
      }, 0);
    }, "openDropdown"), q = /* @__PURE__ */ c(() => {
      F.style.display = "none", T.value = $;
    }, "closeDropdown"), B = /* @__PURE__ */ c((U, G) => {
      S.value = U, $ = G, T.value = G, M && (M.style.display = U ? "" : "none"), F.style.display = "none";
    }, "select");
    T.addEventListener("focus", () => {
      T.select(), j();
    }), T.addEventListener("input", () => {
      P(T.value), F.style.display = "block";
    }), F.addEventListener("pointerdown", (U) => {
      const G = U.target.closest(".eidutil-region-option");
      if (!G) return;
      U.preventDefault(), U.stopPropagation();
      const me = G.dataset.uuid, Ke = G.textContent.trim(), ce = R().find((Se) => Se.uuid === me);
      B(me, ce ? `${ce.regionName} — ${ce.sceneName}` : Ke);
    }), M && M.addEventListener("click", (U) => {
      U.preventDefault(), B("", ""), L.value = "", T.focus();
    });
    const z = /* @__PURE__ */ c((U) => {
      x = U, T.style.display = U ? "none" : "", L.style.display = U ? "" : "none", F.style.display = "none", A.querySelector("i").className = U ? "fa-solid fa-search" : "fa-solid fa-keyboard", A.title = U ? "Switch to search" : "Switch to UUID paste", U ? (L.value = S.value, L.focus(), L.select()) : (T.value = $, T.focus(), T.select());
    }, "setMode");
    A.addEventListener("click", (U) => {
      U.preventDefault(), z(!x);
    });
    const Z = /* @__PURE__ */ c(() => {
      const U = L.value.trim();
      if (!U) {
        B("", "");
        return;
      }
      const G = f(U);
      if (G) {
        const me = G.parent;
        B(U, `${G.name} — ${(me == null ? void 0 : me.name) || "?"}`), L.value = U;
      } else
        L.classList.add("eidutil-region-uuid-error"), setTimeout(() => L.classList.remove("eidutil-region-uuid-error"), 1500);
    }, "commitUuid");
    L.addEventListener("keydown", (U) => {
      U.key === "Enter" ? (U.preventDefault(), Z()) : U.key === "Escape" && L.blur();
    }), L.addEventListener("blur", Z), T.addEventListener("keydown", (U) => {
      if (U.key === "Escape")
        q(), T.blur();
      else if (U.key === "Enter") {
        U.preventDefault();
        const G = F.querySelector(".eidutil-region-option");
        G && G.dispatchEvent(new PointerEvent("pointerdown", { bubbles: !0 }));
      }
    });
  }
  c(h, "_activateRegionPicker");
  const E = class E extends t {
    static defineSchema() {
      return {
        destination: new r({
          required: !1,
          initial: "",
          nullable: !1
        }),
        choice: new e(),
        directions: new o({
          required: !0,
          initial: "",
          nullable: !1
        }),
        event: new i({
          required: !0,
          initial: "enter",
          choices: {
            enter: "On Enter (from)",
            exit: "On Exit (toward)"
          }
        })
      };
    }
    /* -------------------------------------------------- */
    /*  Direction detection                                */
    /* -------------------------------------------------- */
    /**
     * Determine the primary direction of a movement vector.
     * Returns "left", "right", "up", or "down".
     */
    static _detectDirection(b, w) {
      const S = w.x - b.x, T = w.y - b.y;
      return Math.abs(S) >= Math.abs(T) ? S >= 0 ? "right" : "left" : T >= 0 ? "down" : "up";
    }
    /** Find the first ENTER segment. */
    static _findEnterSegment(b) {
      for (const w of b)
        if (w.type === Region.MOVEMENT_SEGMENT_TYPES.ENTER) return w;
      return null;
    }
    /** Find the last EXIT segment. */
    static _findExitSegment(b) {
      for (let w = b.length - 1; w >= 0; w--)
        if (b[w].type === Region.MOVEMENT_SEGMENT_TYPES.EXIT) return b[w];
      return null;
    }
    /**
     * Check if the token's movement direction matches the configured directions.
     * Empty directions set = match any direction.
     */
    static _matchesDirection(b, w, S) {
      const T = w ? new Set(w.split(",")) : /* @__PURE__ */ new Set();
      if (T.size === 0) return !0;
      const L = S === "enter" ? E._findEnterSegment(b) : E._findExitSegment(b);
      if (!L) return !1;
      const A = E._detectDirection(
        L.from,
        L.to
      );
      if (S === "enter") {
        const M = { left: "right", right: "left", up: "down", down: "up" }[A];
        return T.has(M);
      }
      return T.has(A);
    }
    /** Enter trigger: teleport the token if direction matches. */
    static async _onTokenMoveIn(b) {
      this.event !== "enter" || !this.destination || b.data.forced || E._matchesDirection(
        b.data.segments,
        this.directions,
        "enter"
      ) && await E._handleTeleport.call(this, b);
    }
    /** Exit trigger: teleport the token if direction matches. */
    static async _onTokenMoveOut(b) {
      this.event !== "exit" || !this.destination || b.data.forced || E._matchesDirection(
        b.data.segments,
        this.directions,
        "exit"
      ) && await E._handleTeleport.call(this, b);
    }
    /** Pre-move: stop the token at the entry point (enter mode only, if direction matches). */
    static async _onTokenPreMove(b) {
      if (!(this.event !== "enter" || !this.destination) && E._matchesDirection(
        b.data.segments,
        this.directions,
        "enter"
      )) {
        for (const w of b.data.segments)
          if (w.type === Region.MOVEMENT_SEGMENT_TYPES.ENTER) {
            b.data.destination = w.to;
            break;
          }
      }
    }
    /* -------------------------------------------------- */
    /*  Core teleport logic                                */
    /* -------------------------------------------------- */
    /** Shared handler for both enter and exit events. */
    static async _handleTeleport(b) {
      const w = fromUuidSync(this.destination);
      if (!(w instanceof RegionDocument)) {
        console.error(`${Df} ${this.destination} does not exist`);
        return;
      }
      const S = b.data.token, T = b.user;
      if (E._shouldTeleport(S, w, T)) {
        if (S.object) {
          const L = CanvasAnimation.getAnimation(S.object.animationName);
          L && await L.promise;
        }
        this.choice && T.isSelf && !await E._confirmDialog(S, w) || await E._teleportToken(S, w, T);
      }
    }
    /**
     * Determine which user should execute the teleport.
     * Mirrors core logic: owner teleports if they can, otherwise the highest-role active GM.
     */
    static _shouldTeleport(b, w, S) {
      if (b.parent === w.parent || S.can("TOKEN_CREATE") && S.can("TOKEN_DELETE")) return S.isSelf;
      const L = game.users.filter(
        (A) => A.active && A.isGM && A.can("TOKEN_CREATE") && A.can("TOKEN_DELETE")
      );
      return L.length === 0 ? !1 : (L.sort((A, M) => M.role - A.role || A.id.compare(M.id)), L[0].isSelf);
    }
    /** Confirmation dialog using i18n strings. */
    static async _confirmDialog(b, w) {
      var A, M;
      const S = ((M = (A = foundry.applications) == null ? void 0 : A.api) == null ? void 0 : M.DialogV2) ?? Dialog, T = game.user.isGM ? "EIDUTIL.TYPES.directionalTeleport.ConfirmGM" : "EIDUTIL.TYPES.directionalTeleport.Confirm", L = game.i18n.format(T, {
        token: b.name,
        region: w.name,
        scene: w.parent.name
      });
      return S.confirm({
        window: { title: game.i18n.localize("EIDUTIL.directionalTeleport.typeLabel") },
        content: `<p>${L}</p>`,
        rejectClose: !1
      });
    }
    /* -------------------------------------------------- */
    /*  Random destination (same as core)                  */
    /* -------------------------------------------------- */
    /**
     * Find a random valid position within the destination region.
     * Mirrors core teleportToken #getDestination logic.
     */
    static _getRandomDestination(b, w) {
      const S = b.document.parent, T = S.grid;
      if (b.polygons.length === 0) throw new Error(`${b.document.uuid} is empty`);
      const L = Math.clamp(w.document.elevation, b.bottom, b.top), A = w.getCenterPoint({ x: 0, y: 0 });
      let M;
      if (!T.isGridless) {
        const R = [], [P, j, q, B] = T.getOffsetRange(
          new PIXI.Rectangle(0, 0, S.dimensions.width, S.dimensions.height).fit(b.bounds).pad(1)
        );
        for (let z = P; z < q; z++)
          for (let Z = j; Z < B; Z++) {
            const U = T.getCenterPoint({ i: z, j: Z });
            if (!b.polygonTree.testPoint(U)) continue;
            const G = w.getSnappedPosition({ x: U.x - A.x, y: U.y - A.y });
            G.x = Math.round(G.x), G.y = Math.round(G.y), G.elevation = L, b.polygonTree.testPoint(w.getCenterPoint(G)) && w.testInsideRegion(b, G) && R.push(G);
          }
        R.length !== 0 && (M = R[Math.floor(Math.random() * R.length)]);
      }
      if (M) return M;
      const { vertices: F, indices: N } = b.triangulation, $ = [];
      let x = 0;
      for (let R = 0; R < N.length; R += 3) {
        const P = N[R] * 2, j = N[R + 1] * 2, q = N[R + 2] * 2, B = Math.abs(
          (F[j] - F[P]) * (F[q + 1] - F[P + 1]) - (F[q] - F[P]) * (F[j + 1] - F[P + 1])
        ) / 2;
        x += B, $.push(B);
      }
      for (let R = 0; R < 10; R++) {
        M = void 0;
        let P, j = x * Math.random();
        for (P = 0; P < $.length - 1 && (j -= $[P], !(j < 0)); P++)
          ;
        const q = 3 * P, B = N[q] * 2, z = N[q + 1] * 2, Z = N[q + 2] * 2, U = Math.sqrt(Math.random()), G = Math.random(), me = U * (1 - G), Ke = U * G, ce = Math.round(
          F[B] + (F[z] - F[B]) * me + (F[Z] - F[B]) * Ke - A.x
        ), Se = Math.round(
          F[B + 1] + (F[z + 1] - F[B + 1]) * me + (F[Z + 1] - F[B + 1]) * Ke - A.y
        );
        M = { x: ce, y: Se, elevation: L }, b.polygonTree.testPoint(w.getCenterPoint(M)) && w.testInsideRegion(b, M);
      }
      if (!M) throw new Error(`${b.document.uuid} cannot accommodate ${w.document.uuid}`);
      return M;
    }
    /* -------------------------------------------------- */
    /*  Token teleportation                                */
    /* -------------------------------------------------- */
    /** Perform the actual teleportation, handling same-scene and cross-scene cases. */
    static async _teleportToken(b, w, S) {
      const T = w.parent, L = b.parent, A = w.object ?? new CONFIG.Region.objectClass(w);
      let M;
      if (L === T)
        M = b;
      else {
        const x = b.toObject();
        delete x._id, M = TokenDocument.implementation.fromSource(x, { parent: T });
      }
      const F = M.object ?? new CONFIG.Token.objectClass(M);
      F.animationContexts.size !== 0 && M.reset();
      let N;
      try {
        N = E._getRandomDestination(
          A,
          F
        );
      } finally {
        w.object || A.destroy({ children: !0 }), (!M.id || !M.object) && F.destroy({ children: !0 });
      }
      if (b === M) {
        await b.update(N, { teleport: !0, forced: !0 });
        return;
      }
      M.updateSource(N);
      const $ = M.toObject();
      T.tokens.has(b.id) ? delete $._id : $._id = b.id, M = await TokenDocument.implementation.create(M, {
        parent: T,
        keepId: !0
      });
      for (const x of game.combats) {
        const R = [];
        for (const P of x.combatants)
          P.sceneId === L.id && P.tokenId === b.id && R.push({
            _id: P.id,
            sceneId: T.id,
            tokenId: M.id
          });
        R.length && await x.updateEmbeddedDocuments("Combatant", R);
      }
      await b.delete(), S.isSelf ? L.isView && await T.view() : L.id === S.viewedScene && await game.socket.emit("pullToScene", T.id, S.id);
    }
  };
  c(E, "DirectionalTeleportRegionBehaviorType"), se(E, "LOCALIZATION_PREFIXES", ["EIDUTIL.TYPES.directionalTeleport"]), /* -------------------------------------------------- */
  /*  Event handlers                                     */
  /* -------------------------------------------------- */
  se(E, "events", {
    [CONST.REGION_EVENTS.TOKEN_MOVE_IN]: E._onTokenMoveIn,
    [CONST.REGION_EVENTS.TOKEN_PRE_MOVE]: E._onTokenPreMove,
    [CONST.REGION_EVENTS.TOKEN_MOVE_OUT]: E._onTokenMoveOut
  });
  let m = E;
  Object.assign(CONFIG.RegionBehavior.dataModels, {
    [zl]: m
  }), CONFIG.RegionBehavior.typeLabels[zl] = "EIDUTIL.directionalTeleport.typeLabel", CONFIG.RegionBehavior.typeIcons[zl] = "fa-solid fa-compass", console.log(`${Df} Behavior registered.`);
});
Hooks.on("init", () => {
  const t = game.modules.get("betterroofs");
  t != null && t.active && libWrapper.register(
    "eidolon-utilities",
    "CanvasOcclusionMask.prototype._identifyOccludedObjects",
    /* @__PURE__ */ c(function(n, ...i) {
      var s, a, l, u, d, f, h, m, p, y, E, v, b;
      const r = n(...i), o = [];
      for (const w of canvas.tiles.placeables) {
        const S = (a = (s = w.document.flags) == null ? void 0 : s.betterroofs) == null ? void 0 : a.occlusionLinkId;
        if (!S || !S.includes(",") || r.has(w.mesh) || (l = globalThis._betterRoofs) != null && l.isLevels && ((d = (u = CONFIG.Levels.currentToken) == null ? void 0 : u.document) == null ? void 0 : d.elevation) >= w.document.elevation)
          continue;
        const T = S.split(",").map((A) => A.trim());
        let L = !1;
        for (const A of canvas.tiles.placeables) {
          if ((f = globalThis._betterRoofs) != null && f.isLevels && ((m = (h = CONFIG.Levels.currentToken) == null ? void 0 : h.document) == null ? void 0 : m.elevation) >= A.document.elevation || !r.has(A.mesh) || A.id === w.id) continue;
          const M = (y = (p = A.document.flags) == null ? void 0 : p.betterroofs) == null ? void 0 : y.occlusionLinkSource, F = (v = (E = A.document.flags) == null ? void 0 : E.betterroofs) == null ? void 0 : v.occlusionLinkId;
          if (M && T.includes(F)) {
            L = !0;
            break;
          }
        }
        L && (r.add(w.mesh), o.push(w));
      }
      for (const w of o)
        (b = globalThis._betterRoofsHelpers) == null || b.hideTileThroughFog(w);
      return r;
    }, "multiLinkOcclusion"),
    "WRAPPER"
  );
});
//# sourceMappingURL=eidolon-utilities.js.map
