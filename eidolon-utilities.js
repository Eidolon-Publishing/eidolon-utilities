var zl = Object.defineProperty;
var nf = Object.getPrototypeOf;
var rf = Reflect.get;
var Gl = (n) => {
  throw TypeError(n);
};
var af = (n, e, t) => e in n ? zl(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var c = (n, e) => zl(n, "name", { value: e, configurable: !0 });
var pe = (n, e, t) => af(n, typeof e != "symbol" ? e + "" : e, t), Mo = (n, e, t) => e.has(n) || Gl("Cannot " + t);
var f = (n, e, t) => (Mo(n, e, "read from private field"), t ? t.call(n) : e.get(n)), I = (n, e, t) => e.has(n) ? Gl("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(n) : e.set(n, t), C = (n, e, t, i) => (Mo(n, e, "write to private field"), i ? i.call(n, t) : e.set(n, t), t), S = (n, e, t) => (Mo(n, e, "access private method"), t);
var ko = (n, e, t, i) => ({
  set _(r) {
    C(n, e, r, t);
  },
  get _() {
    return f(n, e, i);
  }
}), De = (n, e, t) => rf(nf(n), t, e);
const T = "eidolon-utilities", la = "timeTriggerActive", Yo = "timeTriggerHideWindow", Qo = "timeTriggerShowPlayerWindow", Xo = "timeTriggerAllowRealTime", zc = "timeTriggers", zr = "timeTriggerHistory", Zo = "debug", es = "timeFormat", ts = "manageTime", ns = "secondsPerRound";
const of = [-30, -15, -5, 5, 15, 30], pi = 1440 * 60, Gr = "playSound", Cr = 6;
function v(n, e) {
  var t, i;
  return (i = (t = game.i18n) == null ? void 0 : t.has) != null && i.call(t, n) ? game.i18n.localize(n) : e;
}
c(v, "localize");
function vt(n) {
  return typeof n != "string" ? "" : n.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
c(vt, "escapeHtml");
function Mt(n) {
  var e;
  return n == null ? n : (e = foundry == null ? void 0 : foundry.utils) != null && e.duplicate ? foundry.utils.duplicate(n) : JSON.parse(JSON.stringify(n));
}
c(Mt, "duplicateData");
function sf() {
  var n;
  return (n = foundry == null ? void 0 : foundry.utils) != null && n.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
c(sf, "generateTriggerId");
function Gc(n) {
  if (typeof n != "string") return null;
  const e = n.trim();
  if (!e) return null;
  const t = e.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (!t) return null;
  const i = Number(t[1]), r = Number(t[2]), a = t[3] !== void 0 ? Number(t[3]) : 0;
  return !Number.isInteger(i) || !Number.isInteger(r) || !Number.isInteger(a) || i < 0 || i > 23 || r < 0 || r > 59 || a < 0 || a > 59 ? null : i * 3600 + r * 60 + a;
}
c(Gc, "parseTriggerTimeToSeconds");
function qi() {
  var n, e;
  return ((n = game.scenes) == null ? void 0 : n.current) ?? ((e = game.scenes) == null ? void 0 : e.active) ?? null;
}
c(qi, "getActiveScene");
function kt(n) {
  return (n == null ? void 0 : n.object) ?? (n == null ? void 0 : n.document) ?? null;
}
c(kt, "getSceneFromApplication");
function Ue(n) {
  return n && typeof n.getFlag == "function" && typeof n.setFlag == "function";
}
c(Ue, "hasSceneDocument");
const is = /* @__PURE__ */ new Set(), rs = /* @__PURE__ */ new Set(), as = /* @__PURE__ */ new Set(), os = /* @__PURE__ */ new Set();
let ei = !1, Xi = !1, ca = Cr, ua = "12h", Wl = !1;
function $o(n) {
  ei = !!n;
  for (const e of is)
    try {
      e(ei);
    } catch (t) {
      console.error(`${T} | Debug change handler failed`, t);
    }
}
c($o, "notifyDebugChange");
function Do(n) {
  Xi = !!n;
  for (const e of rs)
    try {
      e(Xi);
    } catch (t) {
      console.error(`${T} | Manage time change handler failed`, t);
    }
}
c(Do, "notifyManageTimeChange");
function Wc(n) {
  return n === "24h" ? "24h" : "12h";
}
c(Wc, "normalizeTimeFormatValue");
function yl(n) {
  const e = Number(n);
  return !Number.isFinite(e) || e <= 0 ? Cr : e;
}
c(yl, "normalizeSecondsPerRoundValue");
function Fo(n) {
  const e = yl(n);
  ca = e;
  for (const t of as)
    try {
      t(e);
    } catch (i) {
      console.error(`${T} | Seconds-per-round change handler failed`, i);
    }
}
c(Fo, "notifySecondsPerRoundChange");
function Po(n) {
  const e = Wc(n);
  ua = e;
  for (const t of os)
    try {
      t(e);
    } catch (i) {
      console.error(`${T} | Time format change handler failed`, i);
    }
}
c(Po, "notifyTimeFormatChange");
function lf() {
  var e;
  if (Wl) return;
  if (Wl = !0, !((e = game == null ? void 0 : game.settings) != null && e.register)) {
    console.warn(
      `${T} | game.settings.register is unavailable. Module settings could not be registered.`
    );
    return;
  }
  const n = typeof game.settings.registerChange == "function";
  game.settings.register(T, Zo, {
    name: v("EIDOLON.TimeTrigger.DebugSettingName", "Enable debug logging"),
    hint: v(
      "EIDOLON.TimeTrigger.DebugSettingHint",
      "Write detailed time-trigger diagnostics to the browser console."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: n ? void 0 : $o
  }), n && game.settings.registerChange(T, Zo, $o), ei = bl(), $o(ei), game.settings.register(T, ts, {
    name: v("EIDOLON.TimeTrigger.ManageTimeSettingName", "Manage Game Time"),
    hint: v(
      "EIDOLON.TimeTrigger.ManageTimeSettingHint",
      "Allow Eidolon Utilities to advance world time automatically while the game is unpaused. Warning: This may conflict with other time-management modules."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: n ? void 0 : Do
  }), n && game.settings.registerChange(T, ts, Do), Xi = uf(), Do(Xi), game.settings.register(T, ns, {
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
    default: Cr,
    range: { min: 1, max: 3600, step: 1 },
    onChange: n ? void 0 : Fo
  }), n && game.settings.registerChange(
    T,
    ns,
    Fo
  ), ca = yl(df()), Fo(ca), game.settings.register(T, es, {
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
    onChange: n ? void 0 : Po
  }), n && game.settings.registerChange(T, es, Po), ua = Wc(Jc()), Po(ua);
}
c(lf, "registerTimeTriggerSettings");
function bl() {
  var n;
  try {
    if ((n = game == null ? void 0 : game.settings) != null && n.get)
      return !!game.settings.get(T, Zo);
  } catch (e) {
    console.error(`${T} | Failed to read debug setting`, e);
  }
  return !1;
}
c(bl, "getDebugSetting");
function cf() {
  return ei = bl(), ei;
}
c(cf, "refreshDebugSettingCache");
function uf() {
  var n;
  try {
    if ((n = game == null ? void 0 : game.settings) != null && n.get)
      return !!game.settings.get(T, ts);
  } catch (e) {
    console.error(`${T} | Failed to read manage time setting`, e);
  }
  return !1;
}
c(uf, "getManageTimeSetting");
function Jc() {
  var n;
  try {
    if ((n = game == null ? void 0 : game.settings) != null && n.get)
      return game.settings.get(T, es) === "24h" ? "24h" : "12h";
  } catch (e) {
    console.error(`${T} | Failed to read time format setting`, e);
  }
  return "12h";
}
c(Jc, "getTimeFormatSetting");
function df() {
  var n;
  try {
    if ((n = game == null ? void 0 : game.settings) != null && n.get) {
      const e = game.settings.get(T, ns);
      return yl(e);
    }
  } catch (e) {
    console.error(`${T} | Failed to read seconds-per-round setting`, e);
  }
  return Cr;
}
c(df, "getSecondsPerRoundSetting");
function ff(n) {
  if (typeof n != "function")
    return () => {
    };
  is.add(n);
  try {
    n(ei);
  } catch (e) {
    console.error(`${T} | Debug change handler failed`, e);
  }
  return () => {
    is.delete(n);
  };
}
c(ff, "onDebugSettingChange");
function Kc(n) {
  if (typeof n != "function")
    return () => {
    };
  rs.add(n);
  try {
    n(Xi);
  } catch (e) {
    console.error(`${T} | Manage time change handler failed`, e);
  }
  return () => {
    rs.delete(n);
  };
}
c(Kc, "onManageTimeSettingChange");
function wl(n) {
  if (typeof n != "function")
    return () => {
    };
  os.add(n);
  try {
    n(ua);
  } catch (e) {
    console.error(`${T} | Time format change handler failed`, e);
  }
  return () => {
    os.delete(n);
  };
}
c(wl, "onTimeFormatSettingChange");
function mf(n) {
  if (typeof n != "function")
    return () => {
    };
  as.add(n);
  try {
    n(ca);
  } catch (e) {
    console.error(`${T} | Seconds-per-round change handler failed`, e);
  }
  return () => {
    as.delete(n);
  };
}
c(mf, "onSecondsPerRoundSettingChange");
let fo = !1, ss = !1;
function ls(n) {
  fo = !!n;
}
c(ls, "updateDebugState");
function Yc() {
  ss || (ss = !0, ls(bl()), ff((n) => {
    ls(n), console.info(`${T} | Debug ${fo ? "enabled" : "disabled"}`);
  }));
}
c(Yc, "ensureInitialized");
function vl() {
  return ss || Yc(), fo;
}
c(vl, "shouldLog");
function Qc(n) {
  if (!n.length)
    return [`${T} |`];
  const [e, ...t] = n;
  return typeof e == "string" ? [`${T} | ${e}`, ...t] : [`${T} |`, e, ...t];
}
c(Qc, "formatArgs");
function gf() {
  Yc();
}
c(gf, "initializeDebug");
function hf() {
  return ls(cf()), fo;
}
c(hf, "syncDebugState");
function O(...n) {
  vl() && console.debug(...Qc(n));
}
c(O, "debugLog");
function Ai(...n) {
  vl() && console.group(...Qc(n));
}
c(Ai, "debugGroup");
function hn() {
  vl() && console.groupEnd();
}
c(hn, "debugGroupEnd");
function yi(n) {
  var r;
  const e = (r = n == null ? void 0 : n.getFlag) == null ? void 0 : r.call(n, T, zc);
  if (!e) return [];
  const t = Mt(e), i = Array.isArray(t) ? t : [];
  return O("Loaded time triggers", {
    sceneId: (n == null ? void 0 : n.id) ?? null,
    count: i.length
  }), i;
}
c(yi, "getTimeTriggers");
async function Xc(n, e) {
  n != null && n.setFlag && (O("Persisting time triggers", {
    sceneId: n.id,
    count: Array.isArray(e) ? e.length : 0
  }), await n.setFlag(T, zc, e));
}
c(Xc, "setTimeTriggers");
function pf(n) {
  var r;
  const e = (r = n == null ? void 0 : n.getFlag) == null ? void 0 : r.call(n, T, zr);
  if (!e) return {};
  const t = Mt(e);
  if (!t || typeof t != "object") return {};
  const i = {};
  for (const [a, o] of Object.entries(t))
    typeof o == "number" && Number.isFinite(o) && (i[a] = o);
  return O("Loaded time trigger history", {
    sceneId: (n == null ? void 0 : n.id) ?? null,
    keys: Object.keys(i)
  }), i;
}
c(pf, "getTimeTriggerHistory");
async function _o(n, e) {
  var l, u, d, m;
  if (!n) return;
  const t = {};
  if (e && typeof e == "object")
    for (const [g, h] of Object.entries(e))
      typeof h == "number" && Number.isFinite(h) && (t[g] = h);
  const i = ((l = n.getFlag) == null ? void 0 : l.call(n, T, zr)) ?? {}, r = {};
  if (i && typeof i == "object")
    for (const [g, h] of Object.entries(i))
      typeof h == "number" && Number.isFinite(h) && (r[g] = h);
  const a = Object.keys(t), o = Object.keys(r);
  if (typeof ((u = foundry == null ? void 0 : foundry.utils) == null ? void 0 : u.deepEqual) == "function" ? foundry.utils.deepEqual(r, t) : JSON.stringify(r) === JSON.stringify(t)) {
    O("Skip history update because state is unchanged", {
      sceneId: (n == null ? void 0 : n.id) ?? null
    });
    return;
  }
  O("Updating time trigger history", {
    sceneId: (n == null ? void 0 : n.id) ?? null,
    keys: a,
    removedKeys: o.filter((g) => !a.includes(g))
  });
  try {
    o.length && typeof n.unsetFlag == "function" && await n.unsetFlag(T, zr), a.length && await n.setFlag(T, zr, t);
  } catch (g) {
    console.error(`${T} | Failed to persist time trigger history`, g), (m = (d = ui.notifications) == null ? void 0 : d.error) == null || m.call(
      d,
      v(
        "EIDOLON.TimeTrigger.HistoryPersistError",
        "Failed to persist the scene's time trigger history."
      )
    );
  }
}
c(_o, "updateTimeTriggerHistory");
const da = /* @__PURE__ */ new Map(), Jl = /* @__PURE__ */ new Set();
function yf(n) {
  if (!(n != null && n.id))
    throw new Error(`${T} | Action definitions require an id.`);
  if (da.has(n.id))
    throw new Error(`${T} | Duplicate time trigger action id: ${n.id}`);
  da.set(n.id, {
    ...n
  }), O("Registered time trigger action", { actionId: n.id });
}
c(yf, "registerAction");
function Lr(n) {
  return da.get(n) ?? null;
}
c(Lr, "getAction");
function bf(n) {
  const e = Lr(n);
  return e ? typeof e.label == "function" ? e.label() : e.label : n;
}
c(bf, "getActionLabel");
function Kl() {
  return Array.from(da.values());
}
c(Kl, "listActions");
async function Zc(n, e) {
  var i, r;
  const t = Lr(e == null ? void 0 : e.action);
  if (!t || typeof t.execute != "function") {
    const a = v(
      "EIDOLON.TimeTrigger.UnknownAction",
      "Encountered an unknown time trigger action and skipped it."
    );
    (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, a), console.warn(`${T} | Unknown time trigger action`, e), O("Encountered unknown time trigger action", {
      triggerId: (e == null ? void 0 : e.id) ?? null,
      actionId: (e == null ? void 0 : e.action) ?? null
    });
    return;
  }
  O("Executing action handler", {
    actionId: t.id,
    triggerId: (e == null ? void 0 : e.id) ?? null,
    sceneId: (n == null ? void 0 : n.id) ?? null
  }), await t.execute({ scene: n, trigger: e });
}
c(Zc, "executeTriggerAction");
function wf(n) {
  const e = Lr(n == null ? void 0 : n.action);
  return !e || typeof e.buildSummaryParts != "function" ? [] : e.buildSummaryParts({ trigger: n, escapeHtml: vt, localize: v }) ?? [];
}
c(wf, "buildActionSummaryParts");
function vf(n) {
  const e = Lr(n == null ? void 0 : n.action);
  return !e || typeof e.buildFormContent != "function" ? "" : e.buildFormContent({ trigger: n, escapeHtml: vt, localize: v }) ?? "";
}
c(vf, "buildActionFormSection");
function Ef(n, e) {
  const t = Lr(n == null ? void 0 : n.action);
  !t || typeof t.prepareFormData != "function" || t.prepareFormData({ trigger: n, formData: e });
}
c(Ef, "applyActionFormData");
function Sf(n, e, t) {
  var a, o;
  const i = `${(n == null ? void 0 : n.id) ?? "unknown"}:${(e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.action) ?? "unknown"}:${t}`;
  if (Jl.has(i)) return;
  Jl.add(i);
  const r = v(
    "EIDOLON.TimeTrigger.MissingDataWarning",
    "A scene time trigger is missing required data and was skipped."
  );
  (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, r), console.warn(`${T} | Missing trigger data (${t})`, { scene: n == null ? void 0 : n.id, trigger: e });
}
c(Sf, "warnMissingTriggerData");
async function Tf({ scene: n, trigger: e }) {
  var a, o, s, l, u;
  const t = (s = (o = (a = e == null ? void 0 : e.data) == null ? void 0 : a.path) == null ? void 0 : o.trim) == null ? void 0 : s.call(o);
  if (!t) {
    Sf(n, e, "missing-audio-path");
    return;
  }
  const i = {
    src: t,
    autoplay: !0,
    loop: !1
  }, r = (() => {
    var d, m, g, h, y;
    return typeof ((m = (d = foundry == null ? void 0 : foundry.audio) == null ? void 0 : d.AudioHelper) == null ? void 0 : m.play) == "function" ? foundry.audio.AudioHelper.play(i, !0) : typeof ((h = (g = game == null ? void 0 : game.audio) == null ? void 0 : g.constructor) == null ? void 0 : h.play) == "function" ? game.audio.constructor.play(i, !0) : typeof ((y = game == null ? void 0 : game.audio) == null ? void 0 : y.play) == "function" ? game.audio.play(i, !0) : null;
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
c(Tf, "executePlaySoundAction");
yf({
  id: Gr,
  label: /* @__PURE__ */ c(() => v("EIDOLON.TimeTrigger.ActionPlaySound", "Play Sound"), "label"),
  execute: Tf,
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
var Rc;
const { ApplicationV2: Ln, HandlebarsApplicationMixin: In } = ((Rc = foundry.applications) == null ? void 0 : Rc.api) ?? {};
if (!Ln || !In)
  throw new Error(
    `${T} | ApplicationV2 API unavailable. Update Foundry VTT to v13 or newer.`
  );
const bn = "AM", ti = "PM";
function pn() {
  return Jc();
}
c(pn, "getConfiguredTimeFormat");
function mo(n) {
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
c(mo, "parseCanonicalTimeString");
function Nt({ hours: n, minutes: e, seconds: t }) {
  if (!Number.isInteger(n) || !Number.isInteger(e) || n < 0 || n > 23 || e < 0 || e > 59) return null;
  const i = String(n).padStart(2, "0"), r = String(e).padStart(2, "0");
  if (Number.isInteger(t)) {
    if (t < 0 || t > 59) return null;
    const a = String(t).padStart(2, "0");
    return `${i}:${r}:${a}`;
  }
  return `${i}:${r}`;
}
c(Nt, "formatCanonicalTime");
function Cf(n, { format: e } = {}) {
  if (!n || typeof n != "object") return null;
  const t = Number(n.hour), i = Number(n.minute), r = n.second !== void 0 && n.second !== null, a = r ? Number(n.second) : null, o = r && Number.isFinite(a) ? Math.floor(Math.max(0, Math.min(59, a))) : null;
  if (!Number.isFinite(t) || !Number.isFinite(i)) return null;
  const s = e ?? pn();
  return fa(
    {
      hours: t,
      minutes: i,
      seconds: o
    },
    s
  );
}
c(Cf, "formatTimeComponentsForDisplay");
function Lf(n, { format: e } = {}) {
  const t = mo(n);
  if (!t) return "";
  const i = e ?? pn();
  return fa(t, i);
}
c(Lf, "formatTriggerTimeForDisplay");
function fa(n, e = "12h") {
  if (!n) return "";
  const { hours: t, minutes: i, seconds: r = null } = n;
  if (!Number.isInteger(t) || !Number.isInteger(i)) return "";
  const a = Number.isInteger(r);
  if (e === "24h") {
    const g = `${String(t).padStart(2, "0")}:${String(i).padStart(2, "0")}`;
    return a ? `${g}:${String(r).padStart(2, "0")}` : g;
  }
  const o = t >= 12 ? ti : bn, s = t % 12 === 0 ? 12 : t % 12, l = String(s), u = String(i).padStart(2, "0"), d = `${l}:${u}`, m = o === bn ? v("EIDOLON.TimeTrigger.TimePeriodAM", bn) : v("EIDOLON.TimeTrigger.TimePeriodPM", ti);
  if (a) {
    const g = String(r).padStart(2, "0");
    return `${d}:${g} ${m}`;
  }
  return `${d} ${m}`;
}
c(fa, "formatTimeParts");
function Yl(n, e = pn()) {
  const t = mo(n);
  if (e === "24h")
    return {
      format: e,
      canonical: t ? Nt(t) ?? "" : "",
      hour: t ? String(t.hours).padStart(2, "0") : "",
      minute: t ? String(t.minutes).padStart(2, "0") : ""
    };
  if (!t)
    return {
      format: e,
      canonical: "",
      hour: "",
      minute: "",
      period: bn
    };
  const i = t.hours >= 12 ? ti : bn, r = t.hours % 12 === 0 ? 12 : t.hours % 12;
  return {
    format: e,
    canonical: Nt(t) ?? "",
    hour: String(r),
    minute: String(t.minutes).padStart(2, "0"),
    period: i
  };
}
c(Yl, "getTimeFormValues");
function If({ hour: n, minute: e, period: t, time: i }, r = pn()) {
  if (r === "24h") {
    const h = typeof n == "string" ? n.trim() : "", y = typeof e == "string" ? e.trim() : "", p = typeof i == "string" ? i.trim() : "";
    if (!h && !y && p) {
      const L = mo(p);
      return L ? { canonical: Nt(L) ?? "", error: null } : {
        canonical: "",
        error: v(
          "EIDOLON.TimeTrigger.TimeFormatInvalid24",
          "Enter a valid time in HH:MM format."
        )
      };
    }
    if (!h || !y)
      return {
        canonical: "",
        error: v("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.")
      };
    const w = Number(h), b = Number(y);
    return !Number.isInteger(w) || w < 0 || w > 23 ? {
      canonical: "",
      error: v(
        "EIDOLON.TimeTrigger.TimeFormatInvalid24",
        "Enter a valid time in HH:MM format."
      )
    } : !Number.isInteger(b) || b < 0 || b > 59 ? {
      canonical: "",
      error: v(
        "EIDOLON.TimeTrigger.TimeFormatInvalid24",
        "Enter a valid time in HH:MM format."
      )
    } : { canonical: Nt({
      hours: w,
      minutes: b
    }) ?? "", error: null };
  }
  const a = typeof n == "string" ? n.trim() : "", o = typeof e == "string" ? e.trim() : "", s = typeof t == "string" ? t.trim().toUpperCase() : "";
  if (!a || !o || !s)
    return { canonical: "", error: v("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.") };
  if (s !== bn && s !== ti)
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
  const d = l % 12, g = {
    hours: s === ti ? d + 12 : d,
    minutes: u
  };
  return {
    canonical: Nt(g) ?? "",
    error: null
  };
}
c(If, "normalizeFormTimeInput");
function Of() {
  return [
    {
      value: bn,
      label: v("EIDOLON.TimeTrigger.TimePeriodAM", bn)
    },
    {
      value: ti,
      label: v("EIDOLON.TimeTrigger.TimePeriodPM", ti)
    }
  ];
}
c(Of, "getPeriodOptions");
var Rn, Hn, re, eu, Pa, _a, tu, us, ds, xa, Ra, nu, iu, ru, fs, ms, gs, Ha, qa, hs, ja, au, ou;
const _n = class _n extends In(Ln) {
  constructor(t = {}) {
    var o;
    const { scene: i, showControls: r, ...a } = t ?? {};
    super(a);
    I(this, re);
    I(this, Rn, null);
    I(this, Hn, null);
    I(this, Pa, /* @__PURE__ */ c((t) => {
      var r, a;
      t.preventDefault();
      const i = Number((a = (r = t.currentTarget) == null ? void 0 : r.dataset) == null ? void 0 : a.delta);
      Number.isFinite(i) && (O("Time delta button clicked", { delta: i }), this._advanceTime(i));
    }, "#onDeltaClick"));
    I(this, _a, /* @__PURE__ */ c((t) => {
      var i, r;
      t.preventDefault(), !(!this.showControls || !((i = game.user) != null && i.isGM)) && (O("Time value double clicked", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null }), S(this, re, tu).call(this));
    }, "#onTimeDoubleClick"));
    I(this, xa, /* @__PURE__ */ c((t) => {
      if (this.isEditingTime && !this._commitTimeInProgress)
        if (t.key === "Enter") {
          t.preventDefault();
          const i = t.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
          S(this, re, ds).call(this, r);
        } else t.key === "Escape" && (t.preventDefault(), S(this, re, us).call(this));
    }, "#onTimeInputKeydown"));
    I(this, Ra, /* @__PURE__ */ c((t) => {
      if (!this.isEditingTime || this._commitTimeInProgress || this._suppressBlurCommit) return;
      const i = t.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
      S(this, re, ds).call(this, r);
    }, "#onTimeInputBlur"));
    I(this, Ha, /* @__PURE__ */ c((t) => {
      const i = !!t;
      if (this.manageTimeEnabled === i) return;
      this.manageTimeEnabled = i, (this.rendered ?? this.isRendered ?? !1) && this.render({ force: !0 });
    }, "#handleManageTimeChange"));
    I(this, qa, /* @__PURE__ */ c(async (t) => {
      var a, o, s, l, u, d, m, g, h;
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
        await i.setFlag(T, Xo, r), this.sceneAllowsRealTime = r;
        const y = r ? v(
          "EIDOLON.TimeTrigger.SceneRealTimeEnabled",
          "Automatic real-time flow enabled for this scene."
        ) : v(
          "EIDOLON.TimeTrigger.SceneRealTimeDisabled",
          "Automatic real-time flow disabled for this scene."
        );
        (m = (d = ui.notifications) == null ? void 0 : d.info) == null || m.call(d, y);
      } catch (y) {
        console.error(`${T} | Failed to toggle scene real-time flow`, y), (h = (g = ui.notifications) == null ? void 0 : g.error) == null || h.call(
          g,
          v(
            "EIDOLON.TimeTrigger.SceneRealTimeToggleError",
            "Failed to update the scene's real-time flow setting."
          )
        );
      } finally {
        this.render({ force: !0 });
      }
    }, "#onRealTimeToggleClick"));
    I(this, ja, /* @__PURE__ */ c(() => {
      (this.rendered ?? this.isRendered ?? !1) && (this.isEditingTime && (this.editValue = S(this, re, fs).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    this.scene = i ?? null, this.showControls = typeof r == "boolean" ? r : !!((o = game.user) != null && o.isGM), this.isEditingTime = !1, this.editValue = "", this._commitTimeInProgress = !1, this._suppressBlurCommit = !1, this.manageTimeEnabled = !1, this.sceneAllowsRealTime = S(this, re, hs).call(this), C(this, Rn, wl(f(this, ja))), C(this, Hn, Kc(f(this, Ha)));
  }
  async _prepareContext() {
    var b, E;
    const t = ((b = game.time) == null ? void 0 : b.components) ?? {}, r = ((t == null ? void 0 : t.second) !== void 0 && (t == null ? void 0 : t.second) !== null ? Cf(t) : null) ?? S(this, re, eu).call(this), a = pn(), o = a === "24h", s = o ? v("EIDOLON.TimeTrigger.EditTimePlaceholder24", "HH:MM") : v("EIDOLON.TimeTrigger.EditTimePlaceholder12", "HH:MM AM/PM"), l = this.showControls ? v(
      "EIDOLON.TimeTrigger.EditTimeHint",
      "Double-click to set a specific time."
    ) : "", u = this.showControls ? v(
      "EIDOLON.TimeTrigger.EditTimeLabel",
      "New time (HH:MM or HH:MM AM/PM)"
    ) : "", d = of.map((L) => ({
      minutes: L,
      label: L > 0 ? `+${L}` : `${L}`
    })), m = !!this.manageTimeEnabled, g = S(this, re, hs).call(this);
    this.sceneAllowsRealTime = g;
    const h = v(
      "EIDOLON.TimeTrigger.SceneRealTimeEnable",
      "Enable automatic real-time flow for this scene."
    ), y = v(
      "EIDOLON.TimeTrigger.SceneRealTimeDisable",
      "Disable automatic real-time flow for this scene."
    ), p = v(
      "EIDOLON.TimeTrigger.SceneRealTimeManageDisabled",
      "Enable Manage Time in module settings to allow automatic real-time flow."
    );
    return {
      formattedTime: r,
      deltas: d,
      manageTimeEnabled: m,
      sceneAllowsRealTime: g,
      realTimeButtonLabel: m ? g ? y : h : p,
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
      return (this.rendered ?? this.isRendered ?? !1) || (O("TimeTriggerWindow close request rerendering", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null
      }), this.render({ force: !0 })), this;
    O("Closing time trigger window", { sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null, force: !0 });
    const i = await super.close(t);
    return S(this, re, au).call(this), S(this, re, ou).call(this), i;
  }
  async _advanceTime(t) {
    var r, a, o, s, l, u, d;
    const i = t * 60;
    if (O("Advancing world time", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null, minutes: t, seconds: i }), !((a = game.user) != null && a.isGM)) {
      (s = (o = ui.notifications) == null ? void 0 : o.warn) == null || s.call(o, v("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time."));
      return;
    }
    try {
      await game.time.advance(i);
    } catch (m) {
      console.error(`${T} | Failed to advance time`, m), (u = (l = ui.notifications) == null ? void 0 : l.error) == null || u.call(
        l,
        v("EIDOLON.TimeTrigger.Error", "Failed to update the world time.")
      ), O("Failed to advance time from window", {
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
        O("Binding time trigger interactions", {
          sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
          buttonCount: r.querySelectorAll("[data-delta]").length
        }), r.querySelectorAll("[data-delta]").forEach((u) => {
          u.addEventListener("click", f(this, Pa));
        });
        const o = r.querySelector('.time-trigger-window__time-value[data-editable="true"]');
        o && o.addEventListener("dblclick", f(this, _a), { once: !1 });
        const s = r.querySelector(".time-trigger-window__time-input");
        s && (s.addEventListener("keydown", f(this, xa)), s.addEventListener("blur", f(this, Ra)), typeof s.focus == "function" && (s.focus(), typeof s.select == "function" && s.select()));
        const l = r.querySelector('[data-action="toggle-real-time"]');
        l && l.addEventListener("click", f(this, qa));
      }
      this._suppressBlurCommit = !1;
    }
  }
};
Rn = new WeakMap(), Hn = new WeakMap(), re = new WeakSet(), eu = /* @__PURE__ */ c(function() {
  var l;
  const t = (l = game.time) == null ? void 0 : l.worldTime;
  if (typeof t != "number" || !Number.isFinite(t)) return "";
  const i = 1440 * 60, r = (Math.floor(t) % i + i) % i, a = Math.floor(r / 3600), o = Math.floor(r % 3600 / 60), s = r % 60;
  return fa({ hours: a, minutes: o, seconds: s }, pn());
}, "#formatFallbackTime"), Pa = new WeakMap(), _a = new WeakMap(), tu = /* @__PURE__ */ c(function() {
  var t;
  (t = game.user) != null && t.isGM && (this.isEditingTime = !0, this._suppressBlurCommit = !1, this.editValue = S(this, re, fs).call(this), this.render({ force: !0 }));
}, "#enterTimeEditMode"), us = /* @__PURE__ */ c(function() {
  this.isEditingTime = !1, this.editValue = "", this._suppressBlurCommit = !1, this.render({ force: !0 });
}, "#cancelTimeEdit"), ds = /* @__PURE__ */ c(async function(t) {
  var a, o, s;
  if (!((a = game.user) != null && a.isGM) || !this.isEditingTime || this._commitTimeInProgress) return;
  this._commitTimeInProgress = !0;
  const i = typeof t == "string" ? t.trim() : "";
  if (!i) {
    S(this, re, us).call(this), this._commitTimeInProgress = !1;
    return;
  }
  const r = S(this, re, ru).call(this, i);
  if (r.error) {
    (s = (o = ui.notifications) == null ? void 0 : o.error) == null || s.call(o, r.error), this._suppressBlurCommit = !0, this.editValue = i, this.render({ force: !0 }), this._commitTimeInProgress = !1;
    return;
  }
  try {
    await S(this, re, iu).call(this, r.seconds, r.includeSeconds) ? (this.isEditingTime = !1, this.editValue = "", this.render({ force: !0 })) : (this.editValue = i, this.render({ force: !0 }));
  } finally {
    this._commitTimeInProgress = !1;
  }
}, "#commitTimeInput"), xa = new WeakMap(), Ra = new WeakMap(), nu = /* @__PURE__ */ c(function() {
  var u, d;
  const t = (u = game.time) == null ? void 0 : u.worldTime;
  if (typeof t != "number" || !Number.isFinite(t))
    return "";
  const i = ((d = game.time) == null ? void 0 : d.components) ?? {}, r = Number(i.hour), a = Number(i.minute), o = i.second !== void 0 ? Number(i.second) : null, s = Number.isInteger(o);
  return (Number.isFinite(r) && Number.isFinite(a) ? Nt({
    hours: Math.max(0, Math.min(23, Number(r))),
    minutes: Math.max(0, Math.min(59, Number(a))),
    seconds: s && Number.isFinite(o) ? Math.max(0, Math.min(59, Number(o))) : void 0
  }) ?? "" : "") ?? "";
}, "#getCurrentCanonicalTime"), iu = /* @__PURE__ */ c(async function(t, i) {
  var g, h, y, p, w, b, E, L, A, $;
  const r = (g = game.time) == null ? void 0 : g.worldTime;
  if (typeof r != "number" || !Number.isFinite(r))
    return (y = (h = ui.notifications) == null ? void 0 : h.error) == null || y.call(
      h,
      v(
        "EIDOLON.TimeTrigger.EditTimeUnavailable",
        "The world time is unavailable, so it can't be updated."
      )
    ), !1;
  if (!Number.isInteger(t) || t < 0 || t >= pi)
    return (w = (p = ui.notifications) == null ? void 0 : p.error) == null || w.call(
      p,
      v(
        "EIDOLON.TimeTrigger.EditTimeInvalidRange",
        "Enter a time within the current day."
      )
    ), !1;
  const s = Math.floor(r / pi) * pi + t - r;
  if (!Number.isFinite(s) || s === 0)
    return !0;
  const l = Math.floor(t / 3600), u = Math.floor(t % 3600 / 60), d = t % 60, m = Nt({
    hours: l,
    minutes: u,
    seconds: i ? d : void 0
  });
  try {
    O("Updating world time directly", {
      sceneId: ((b = this.scene) == null ? void 0 : b.id) ?? null,
      targetCanonical: m ?? null,
      diff: s
    }), await game.time.advance(s);
    const k = fa(
      {
        hours: l,
        minutes: u,
        seconds: i ? d : null
      },
      pn()
    );
    (L = (E = ui.notifications) == null ? void 0 : E.info) == null || L.call(
      E,
      v(
        "EIDOLON.TimeTrigger.EditTimeSuccess",
        "World time updated."
      ) + (k ? ` ${k}` : "")
    );
  } catch (k) {
    return console.error(`${T} | Failed to set world time`, k), ($ = (A = ui.notifications) == null ? void 0 : A.error) == null || $.call(
      A,
      v(
        "EIDOLON.TimeTrigger.EditTimeError",
        "Failed to update the world time."
      )
    ), !1;
  }
  return !0;
}, "#applyTargetSeconds"), ru = /* @__PURE__ */ c(function(t) {
  var m;
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
    const g = Number(a[1]), h = Number(a[2]), y = a[3] !== void 0 ? Number(a[3]) : void 0;
    if (Number.isInteger(g) && g >= 0 && g <= 23 && Number.isInteger(h) && h >= 0 && h <= 59 && (y === void 0 || Number.isInteger(y) && y >= 0 && y <= 59)) {
      const p = g * 3600 + h * 60 + (y ?? 0);
      return {
        canonical: Nt({ hours: g, minutes: h, seconds: y }),
        seconds: p,
        includeSeconds: y !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const { amLower: o, pmLower: s, periodPattern: l } = S(this, re, ms).call(this), u = r.match(
    new RegExp(
      `^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?\\s*(${l})$`,
      "i"
    )
  );
  if (u) {
    let g = Number(u[1]);
    const h = Number(u[2]), y = u[3] !== void 0 ? Number(u[3]) : void 0, p = u[4] ?? "", w = typeof p == "string" ? ((m = p.toLocaleLowerCase) == null ? void 0 : m.call(p)) ?? p.toLowerCase() : "";
    if (Number.isInteger(g) && g >= 1 && g <= 12 && Number.isInteger(h) && h >= 0 && h <= 59 && (y === void 0 || Number.isInteger(y) && y >= 0 && y <= 59) && (w === o || w === s || w === "am" || w === "pm")) {
      g = g % 12, (w === s || w === "pm") && (g += 12);
      const E = g * 3600 + h * 60 + (y ?? 0);
      return {
        canonical: Nt({ hours: g, minutes: h, seconds: y }),
        seconds: E,
        includeSeconds: y !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const d = Gc(r);
  if (d !== null) {
    const g = Math.floor(d / 3600), h = Math.floor(d % 3600 / 60), y = d % 60, p = y !== 0;
    return {
      canonical: Nt({
        hours: g,
        minutes: h,
        seconds: p ? y : void 0
      }),
      seconds: d,
      includeSeconds: p,
      error: null
    };
  }
  return { error: i };
}, "#parseInputTime"), fs = /* @__PURE__ */ c(function() {
  const t = S(this, re, nu).call(this);
  if (!t) return "";
  if (pn() === "24h")
    return t;
  const r = mo(t);
  if (!r) return t;
  const a = Number(r.hours), o = Number(r.minutes), s = r.seconds !== null && r.seconds !== void 0 ? Number(r.seconds) : void 0;
  if (!Number.isFinite(a) || !Number.isFinite(o)) return t;
  const l = Number.isFinite(s), u = a % 12 === 0 ? 12 : a % 12, d = String(o).padStart(2, "0"), m = l ? `:${String(s).padStart(2, "0")}` : "", { amLabel: g, pmLabel: h } = S(this, re, ms).call(this), y = a >= 12 ? h : g;
  return `${u}:${d}${m} ${y}`.trim();
}, "#getInitialEditValue"), ms = /* @__PURE__ */ c(function() {
  var u, d;
  const t = v("EIDOLON.TimeTrigger.TimePeriodAM", "AM"), i = v("EIDOLON.TimeTrigger.TimePeriodPM", "PM"), r = ((u = t.toLocaleLowerCase) == null ? void 0 : u.call(t)) ?? t.toLowerCase(), a = ((d = i.toLocaleLowerCase) == null ? void 0 : d.call(i)) ?? i.toLowerCase(), o = S(this, re, gs).call(this, t), s = S(this, re, gs).call(this, i), l = `${o}|${s}|AM|PM`;
  return {
    amLabel: t,
    pmLabel: i,
    amLower: r,
    pmLower: a,
    periodPattern: l
  };
}, "#getPeriodMatchData"), gs = /* @__PURE__ */ c(function(t) {
  return typeof t != "string" ? "" : t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}, "#escapeForRegex"), Ha = new WeakMap(), qa = new WeakMap(), hs = /* @__PURE__ */ c(function() {
  const t = this.scene;
  if (!t || typeof t.getFlag != "function") return !1;
  try {
    return !!t.getFlag(T, Xo);
  } catch (i) {
    O("TimeTriggerWindow | Failed to read scene real-time flag", {
      sceneId: (t == null ? void 0 : t.id) ?? null,
      message: (i == null ? void 0 : i.message) ?? String(i)
    });
  }
  return !1;
}, "#readSceneRealTimeFlag"), ja = new WeakMap(), au = /* @__PURE__ */ c(function() {
  if (typeof f(this, Rn) == "function")
    try {
      f(this, Rn).call(this);
    } catch (t) {
      console.error(`${T} | Failed to dispose time format subscription`, t);
    }
  C(this, Rn, null);
}, "#disposeTimeFormatSubscription"), ou = /* @__PURE__ */ c(function() {
  if (typeof f(this, Hn) == "function")
    try {
      f(this, Hn).call(this);
    } catch (t) {
      console.error(`${T} | Failed to dispose manage time subscription`, t);
    }
  C(this, Hn, null);
}, "#disposeManageTimeSubscription"), c(_n, "TimeTriggerWindow"), pe(_n, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  De(_n, _n, "DEFAULT_OPTIONS"),
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
)), pe(_n, "PARTS", {
  content: {
    template: `modules/${T}/templates/time-trigger.html`
  }
});
let cs = _n;
function go(n, e = {}) {
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
c(go, "createApplicationFactory");
const Ql = /* @__PURE__ */ new Set();
var be, We, qn, ki, su, lu;
const _l = class _l {
  constructor({ windowFactory: e } = {}) {
    I(this, ki);
    I(this, be, null);
    I(this, We, null);
    I(this, qn);
    const t = go(cs);
    typeof e == "function" ? e.__eidolonFactorySignature === "options" ? C(this, qn, (r, a = {}) => e({ scene: r, ...a ?? {} })) : C(this, qn, e) : C(this, qn, /* @__PURE__ */ c((r, a = {}) => t({ scene: r, ...a ?? {} }), "fallbackFactory"));
  }
  onReady() {
    var t;
    const e = typeof ((t = game.time) == null ? void 0 : t.worldTime) == "number" && Number.isFinite(game.time.worldTime) ? game.time.worldTime : null;
    O("TimeTriggerManager#onReady", { worldTime: e }), e !== null && C(this, We, e);
  }
  onCanvasReady(e) {
    const t = (e == null ? void 0 : e.scene) ?? qi();
    O("TimeTriggerManager#onCanvasReady", { sceneId: (t == null ? void 0 : t.id) ?? null }), this.refreshTimeTriggerWindow(t), this.handleTimeTriggerEvaluation(t);
  }
  onUpdateScene(e) {
    const t = qi();
    O("TimeTriggerManager#onUpdateScene", {
      sceneId: (e == null ? void 0 : e.id) ?? null,
      activeSceneId: (t == null ? void 0 : t.id) ?? null
    }), !(!t || e.id !== t.id) && (this.refreshTimeTriggerWindow(e), this.handleTimeTriggerEvaluation(e));
  }
  onUpdateWorldTime(e, t) {
    O("TimeTriggerManager#onUpdateWorldTime", {
      worldTime: e,
      diff: t,
      hasWindow: !!f(this, be)
    }), f(this, be) && f(this, be).render();
    const i = qi(), r = S(this, ki, su).call(this, e, t);
    this.handleTimeTriggerEvaluation(i, e, r);
  }
  refreshTimeTriggerWindow(e) {
    var l, u, d;
    if (!e) return;
    const t = !!((l = game.user) != null && l.isGM), i = !!e.getFlag(T, la), r = !!e.getFlag(T, Yo), a = !!e.getFlag(T, Qo);
    if (O("TimeTriggerManager#refreshTimeTriggerWindow", {
      sceneId: e.id,
      isGM: t,
      isActive: i,
      hideWindow: r,
      showPlayerWindow: a
    }), !(i && !r && (t || a))) {
      f(this, be) && (O("Closing time trigger window", { reason: "not-visible" }), f(this, be).close({ force: !0 }), C(this, be, null));
      return;
    }
    const s = !!t;
    if (f(this, be) && ((u = f(this, be).scene) == null ? void 0 : u.id) === e.id) {
      O("Refreshing existing time trigger window", { sceneId: e.id }), f(this, be).showControls = s, f(this, be).render();
      return;
    }
    f(this, be) && (O("Closing existing window before creating new instance", {
      previousSceneId: ((d = f(this, be).scene) == null ? void 0 : d.id) ?? null
    }), f(this, be).close({ force: !0 })), C(this, be, f(this, qn).call(this, e, { showControls: s })), O("Rendering new time trigger window", { sceneId: e.id }), f(this, be).render({ force: !0 });
  }
  async handleTimeTriggerEvaluation(e, t, i) {
    var l;
    const r = e ?? qi();
    if (!r) {
      O("handleTimeTriggerEvaluation skipped", {
        reason: "no-active-scene",
        providedSceneId: (e == null ? void 0 : e.id) ?? null,
        currentWorldTime: t
      }), typeof t == "number" && Number.isFinite(t) && C(this, We, t);
      return;
    }
    const a = typeof t == "number" && Number.isFinite(t) ? t : typeof ((l = game.time) == null ? void 0 : l.worldTime) == "number" ? game.time.worldTime : null;
    if (a === null) return;
    const o = typeof i == "number" && Number.isFinite(i) ? i : null, s = o !== null ? o : typeof f(this, We) == "number" && Number.isFinite(f(this, We)) ? f(this, We) : a;
    Ai("handleTimeTriggerEvaluation", {
      sceneId: r.id,
      previousWorldTime: s,
      currentWorldTime: a,
      overrideProvided: o !== null
    });
    try {
      await S(this, ki, lu).call(this, r, s, a);
    } catch (u) {
      console.error(`${T} | Unexpected error while evaluating time triggers`, u), O("handleTimeTriggerEvaluation error", { message: (u == null ? void 0 : u.message) ?? String(u) });
    } finally {
      C(this, We, a), hn();
    }
  }
};
be = new WeakMap(), We = new WeakMap(), qn = new WeakMap(), ki = new WeakSet(), su = /* @__PURE__ */ c(function(e, t) {
  return typeof f(this, We) == "number" && Number.isFinite(f(this, We)) ? (O("Resolved previous world time from cache", {
    previousWorldTime: f(this, We)
  }), f(this, We)) : typeof e == "number" && Number.isFinite(e) && typeof t == "number" && Number.isFinite(t) ? (O("Resolved previous world time using diff", {
    worldTime: e,
    diff: t,
    resolved: e - t
  }), e - t) : typeof e == "number" && Number.isFinite(e) ? e : null;
}, "#resolvePreviousWorldTime"), lu = /* @__PURE__ */ c(async function(e, t, i) {
  var y, p, w;
  if (!((y = game.user) != null && y.isGM)) {
    O("Skipping trigger evaluation because user is not a GM");
    return;
  }
  if (!(e != null && e.id)) {
    O("Skipping trigger evaluation because the scene is missing an id");
    return;
  }
  if (!!!e.getFlag(T, la)) {
    O("Skipping trigger evaluation because scene is inactive", { sceneId: e.id });
    return;
  }
  if (typeof i != "number" || !Number.isFinite(i)) return;
  (typeof t != "number" || !Number.isFinite(t)) && (t = i);
  const a = yi(e);
  if (!a.length) {
    O("No time triggers configured for scene", { sceneId: e.id });
    return;
  }
  const o = pf(e), s = /* @__PURE__ */ new Set();
  for (const b of a)
    b != null && b.id && s.add(b.id);
  let l = !1;
  for (const b of Object.keys(o))
    s.has(b) || (delete o[b], l = !0);
  if (Ai("Evaluating scene time triggers", {
    sceneId: e.id,
    previousWorldTime: t,
    currentWorldTime: i,
    triggerCount: a.length
  }), i <= t) {
    O("Detected world time rewind", {
      previousWorldTime: t,
      currentWorldTime: i
    });
    for (const b of a) {
      if (!(b != null && b.id) || !b.allowReplayOnRewind) continue;
      const E = o[b.id];
      typeof E == "number" ? i < E ? (O("Clearing trigger history due to rewind", {
        triggerId: b.id,
        lastFired: E,
        currentWorldTime: i
      }), delete o[b.id], l = !0) : O("Preserving trigger history after rewind", {
        triggerId: b.id,
        lastFired: E,
        currentWorldTime: i
      }) : O("No history stored for rewind-enabled trigger", {
        triggerId: b.id
      });
    }
    l && (O("Persisting history cleanup after rewind", {
      sceneId: e.id
    }), await _o(e, o)), hn();
    return;
  }
  const u = t, d = i, m = [], g = Math.floor(u / pi), h = Math.floor(d / pi);
  for (const b of a) {
    if (!(b != null && b.id)) continue;
    const E = Gc(b.time);
    if (E === null) {
      Af(e, b), O("Skipping trigger with invalid time", {
        triggerId: b.id,
        time: b.time
      });
      continue;
    }
    for (let L = g; L <= h; L++) {
      const A = L * pi + E;
      if (A < u || A > d) continue;
      const k = o[b.id];
      if (typeof k == "number" && k >= A) {
        O("Skipping trigger because it already fired within window", {
          triggerId: b.id,
          lastFired: k,
          absoluteTime: A
        });
        continue;
      }
      m.push({ trigger: b, absoluteTime: A });
    }
  }
  if (!m.length) {
    l && await _o(e, o), O("No triggers scheduled to fire within evaluation window", {
      sceneId: e.id
    }), hn();
    return;
  }
  m.sort((b, E) => b.absoluteTime - E.absoluteTime), O("Queued triggers for execution", {
    entries: m.map((b) => ({
      triggerId: b.trigger.id,
      absoluteTime: b.absoluteTime
    }))
  });
  for (const b of m)
    try {
      O("Executing time trigger action", {
        triggerId: b.trigger.id,
        absoluteTime: b.absoluteTime
      }), await Zc(e, b.trigger);
    } catch (E) {
      console.error(`${T} | Failed to execute time trigger action`, E), (w = (p = ui.notifications) == null ? void 0 : p.error) == null || w.call(
        p,
        v(
          "EIDOLON.TimeTrigger.TriggerActionError",
          "Failed to execute a scene time trigger action. Check the console for details."
        )
      ), O("Trigger execution failed", {
        triggerId: b.trigger.id,
        message: (E == null ? void 0 : E.message) ?? String(E)
      });
    } finally {
      o[b.trigger.id] = b.absoluteTime, l = !0, O("Recorded trigger execution", {
        triggerId: b.trigger.id,
        absoluteTime: b.absoluteTime
      });
    }
  l && (O("Persisting trigger history updates", { sceneId: e.id }), await _o(e, o)), hn();
}, "#evaluateSceneTimeTriggers"), c(_l, "TimeTriggerManager");
let ps = _l;
function Af(n, e) {
  var r, a;
  const t = `${(n == null ? void 0 : n.id) ?? "unknown"}:${(e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.time) ?? "unknown"}`;
  if (Ql.has(t)) return;
  Ql.add(t);
  const i = v(
    "EIDOLON.TimeTrigger.InvalidTimeWarning",
    "A scene time trigger has an invalid time value and was skipped."
  );
  (a = (r = ui.notifications) == null ? void 0 : r.warn) == null || a.call(r, i), console.warn(`${T} | Invalid time for trigger`, { scene: n == null ? void 0 : n.id, trigger: e });
}
c(Af, "warnInvalidTriggerTime");
var pt, rr, yt, nn, jn, It, Si, Ba, Ua, ar, or, Bn, Ot, q, bs, ci, Wr, ws, Jr, vs, Tt, cu, Es, uu, Ss, du, Va, za, Ga, Wa, Ja, Ka, Ts, fu, Kr, Ya, Qa;
const xl = class xl {
  constructor() {
    I(this, q);
    I(this, pt, !1);
    I(this, rr, Cr);
    I(this, yt, /* @__PURE__ */ new Map());
    I(this, nn, null);
    I(this, jn, null);
    I(this, It, 0);
    I(this, Si, null);
    I(this, Ba, null);
    I(this, Ua, null);
    I(this, ar, !1);
    I(this, or, !1);
    I(this, Bn, !1);
    I(this, Ot, !1);
    I(this, Va, /* @__PURE__ */ c((e, t = {}) => {
      O("GameTimeAutomation | Pause state changed", {
        paused: e,
        userId: (t == null ? void 0 : t.userId) ?? null,
        broadcast: (t == null ? void 0 : t.broadcast) ?? null
      }), S(this, q, Tt).call(this, { pausedOverride: e });
    }, "#handlePause"));
    I(this, za, /* @__PURE__ */ c((e) => {
      e != null && e.id && (f(this, yt).set(e.id, Math.max(e.round ?? 0, 1)), O("GameTimeAutomation | Combat started", { combatId: e.id, round: e.round ?? 0 }), S(this, q, Tt).call(this));
    }, "#handleCombatStart"));
    I(this, Ga, /* @__PURE__ */ c((e, t) => {
      if (!(e != null && e.id)) return;
      const i = typeof t == "number" && Number.isFinite(t) ? t : typeof e.round == "number" && Number.isFinite(e.round) ? e.round : 0, r = i > 0 ? i : 1, a = f(this, yt).get(e.id), o = a ? Math.max(a, 1) : 1, s = r > 1 ? Math.max(r - o, 0) : 0;
      if (O("GameTimeAutomation | Combat round change detected", {
        combatId: e.id,
        effectiveRound: r,
        completedRounds: s,
        enabled: f(this, pt),
        paused: (game == null ? void 0 : game.paused) ?? null
      }), s > 0 && f(this, pt) && f(this, Ot) && !(game != null && game.paused) && S(this, q, ci).call(this) && S(this, q, Wr).call(this, e)) {
        const l = s * f(this, rr);
        l > 0 && (O("GameTimeAutomation | Advancing time for completed combat rounds", {
          combatId: e.id,
          completedRounds: s,
          delta: l
        }), S(this, q, Ss).call(this, l));
      }
      f(this, yt).set(e.id, Math.max(r, 1));
    }, "#handleCombatRound"));
    I(this, Wa, /* @__PURE__ */ c((e) => {
      e != null && e.id && (f(this, yt).delete(e.id), O("GameTimeAutomation | Combat ended", { combatId: e.id }), S(this, q, Tt).call(this));
    }, "#handleCombatEnd"));
    I(this, Ja, /* @__PURE__ */ c((e) => {
      e != null && e.id && (f(this, yt).delete(e.id), O("GameTimeAutomation | Combat deleted", { combatId: e.id }), S(this, q, Tt).call(this));
    }, "#handleCombatDelete"));
    I(this, Ka, /* @__PURE__ */ c((e, t) => {
      if (e != null && e.id) {
        if (typeof (t == null ? void 0 : t.round) == "number" && Number.isFinite(t.round)) {
          const i = Math.max(t.round, 1);
          f(this, yt).set(e.id, i), O("GameTimeAutomation | Combat round manually updated", {
            combatId: e.id,
            round: i
          });
        }
        (Object.prototype.hasOwnProperty.call(t ?? {}, "active") || (t == null ? void 0 : t.round) !== void 0) && S(this, q, Tt).call(this);
      }
    }, "#handleCombatUpdate"));
    I(this, Ya, /* @__PURE__ */ c((e) => {
      S(this, q, Kr).call(this, e == null ? void 0 : e.scene), S(this, q, Tt).call(this);
    }, "#handleCanvasReady"));
    I(this, Qa, /* @__PURE__ */ c((e) => {
      if (!Ue(e)) return;
      const t = S(this, q, Ts).call(this);
      if (!t || t.id !== e.id) return;
      S(this, q, Kr).call(this, e) && S(this, q, Tt).call(this);
    }, "#handleSceneUpdate"));
  }
  registerHooks() {
    f(this, ar) || (C(this, ar, !0), Hooks.on("pauseGame", f(this, Va)), Hooks.on("combatStart", f(this, za)), Hooks.on("combatRound", f(this, Ga)), Hooks.on("combatEnd", f(this, Wa)), Hooks.on("deleteCombat", f(this, Ja)), Hooks.on("updateCombat", f(this, Ka)), Hooks.on("canvasReady", f(this, Ya)), Hooks.on("updateScene", f(this, Qa)));
  }
  initialize() {
    f(this, or) || (C(this, or, !0), C(this, Ba, Kc((e) => {
      const t = !!e, i = t !== f(this, pt);
      C(this, pt, t), O("GameTimeAutomation | Manage time toggled", { enabled: t }), i && t && S(this, q, vs).call(this), S(this, q, Tt).call(this);
    })), C(this, Ua, mf((e) => {
      C(this, rr, e), O("GameTimeAutomation | Seconds per round updated", { value: e });
    })), S(this, q, vs).call(this), S(this, q, Kr).call(this), S(this, q, Tt).call(this));
  }
};
pt = new WeakMap(), rr = new WeakMap(), yt = new WeakMap(), nn = new WeakMap(), jn = new WeakMap(), It = new WeakMap(), Si = new WeakMap(), Ba = new WeakMap(), Ua = new WeakMap(), ar = new WeakMap(), or = new WeakMap(), Bn = new WeakMap(), Ot = new WeakMap(), q = new WeakSet(), bs = /* @__PURE__ */ c(function() {
  var e;
  try {
    if (typeof ((e = globalThis.performance) == null ? void 0 : e.now) == "function")
      return globalThis.performance.now();
  } catch (t) {
    O("GameTimeAutomation | Failed to read high-resolution timestamp", {
      message: (t == null ? void 0 : t.message) ?? String(t)
    });
  }
  return Date.now();
}, "#currentTimestamp"), ci = /* @__PURE__ */ c(function() {
  var e;
  return !!((e = game == null ? void 0 : game.user) != null && e.isGM && game.user.active !== !1);
}, "#canControlTime"), Wr = /* @__PURE__ */ c(function(e) {
  var i, r;
  if (!e) return !1;
  if (e.active === !0) return !0;
  if (e.active === !1) return !1;
  const t = (i = game == null ? void 0 : game.combats) == null ? void 0 : i.active;
  return (t == null ? void 0 : t.id) === e.id ? !0 : ((r = game == null ? void 0 : game.combat) == null ? void 0 : r.id) === e.id ? game.combat.active ?? !0 : !1;
}, "#isCombatDocumentActive"), ws = /* @__PURE__ */ c(function(e) {
  return e ? typeof e.started == "boolean" ? e.started : (e.round ?? 0) > 0 : !1;
}, "#hasCombatStarted"), Jr = /* @__PURE__ */ c(function() {
  var i;
  const e = Array.isArray((i = game == null ? void 0 : game.combats) == null ? void 0 : i.contents) ? game.combats.contents : [];
  for (const r of e)
    if (S(this, q, Wr).call(this, r) && S(this, q, ws).call(this, r))
      return !0;
  const t = game == null ? void 0 : game.combat;
  return !!(t && S(this, q, Wr).call(this, t) && S(this, q, ws).call(this, t));
}, "#isCombatRunning"), vs = /* @__PURE__ */ c(function() {
  var t;
  f(this, yt).clear();
  const e = Array.isArray((t = game == null ? void 0 : game.combats) == null ? void 0 : t.contents) ? game.combats.contents : [];
  for (const i of e)
    i != null && i.id && f(this, yt).set(i.id, Math.max(i.round ?? 0, 1));
}, "#hydrateRoundTracking"), Tt = /* @__PURE__ */ c(function({ pausedOverride: e } = {}) {
  const t = typeof e == "boolean" ? e : !!(game != null && game.paused), i = f(this, pt), r = f(this, Ot), a = i && r, o = {
    manageTimeEnabled: i,
    sceneAllowsRealTime: r,
    effectiveEnabled: a,
    paused: t,
    canControl: S(this, q, ci).call(this),
    combatRunning: S(this, q, Jr).call(this),
    overrideApplied: typeof e == "boolean"
  };
  if (O("GameTimeAutomation | Sync running state", o), !a || !S(this, q, ci).call(this)) {
    S(this, q, Es).call(this);
    return;
  }
  S(this, q, cu).call(this);
}, "#syncRunningState"), cu = /* @__PURE__ */ c(function() {
  f(this, nn) === null && (C(this, jn, S(this, q, bs).call(this)), C(this, nn, globalThis.setInterval(() => S(this, q, uu).call(this), 1e3)), O("GameTimeAutomation | Started real-time ticker"));
}, "#startRealTimeTicker"), Es = /* @__PURE__ */ c(function() {
  f(this, nn) !== null && (globalThis.clearInterval(f(this, nn)), C(this, nn, null), O("GameTimeAutomation | Stopped real-time ticker")), C(this, jn, null), C(this, It, 0), C(this, Bn, !1);
}, "#stopRealTimeTicker"), uu = /* @__PURE__ */ c(function() {
  if (!f(this, pt) || !f(this, Ot) || !S(this, q, ci).call(this)) {
    S(this, q, Es).call(this);
    return;
  }
  const e = S(this, q, bs).call(this);
  if (typeof e != "number" || !Number.isFinite(e)) return;
  const t = f(this, jn) ?? e, i = (e - t) / 1e3;
  if (C(this, jn, e), !Number.isFinite(i) || i <= 0) return;
  const r = !!(game != null && game.paused), a = S(this, q, Jr).call(this);
  if (r || a) {
    f(this, Bn) || O("GameTimeAutomation | Tick skipped", { paused: r, combatRunning: a }), C(this, Bn, !0), C(this, It, 0);
    return;
  }
  C(this, Bn, !1), O("GameTimeAutomation | Real-time tick", { deltaSeconds: i }), S(this, q, Ss).call(this, i);
}, "#tickRealTime"), Ss = /* @__PURE__ */ c(function(e) {
  if (!f(this, pt) || !f(this, Ot)) return;
  const t = Number(e);
  !Number.isFinite(t) || t <= 0 || (C(this, It, f(this, It) + t), !f(this, Si) && C(this, Si, S(this, q, du).call(this)));
}, "#queueAdvance"), du = /* @__PURE__ */ c(async function() {
  var e, t;
  for (; f(this, It) > 0; ) {
    if (!f(this, pt) || !f(this, Ot) || game != null && game.paused || !S(this, q, ci).call(this) || S(this, q, Jr).call(this)) {
      C(this, It, 0);
      break;
    }
    const i = f(this, It);
    C(this, It, 0);
    try {
      if (typeof ((e = game == null ? void 0 : game.time) == null ? void 0 : e.advance) == "function")
        O("GameTimeAutomation | Advancing world time", { delta: i }), await game.time.advance(i), O("GameTimeAutomation | World time advanced", {
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
  C(this, Si, null);
}, "#flushAdvanceQueue"), Va = new WeakMap(), za = new WeakMap(), Ga = new WeakMap(), Wa = new WeakMap(), Ja = new WeakMap(), Ka = new WeakMap(), Ts = /* @__PURE__ */ c(function() {
  const e = qi();
  return Ue(e) ? e : null;
}, "#getActiveSceneDocument"), fu = /* @__PURE__ */ c(function(e) {
  if (!Ue(e)) return !1;
  try {
    return !!e.getFlag(T, Xo);
  } catch (t) {
    return O("GameTimeAutomation | Failed to read scene real-time flag", {
      sceneId: (e == null ? void 0 : e.id) ?? null,
      message: (t == null ? void 0 : t.message) ?? String(t)
    }), !1;
  }
}, "#isSceneRealTimeAllowed"), Kr = /* @__PURE__ */ c(function(e) {
  const t = Ue(e) ? e : S(this, q, Ts).call(this), i = S(this, q, fu).call(this, t), r = f(this, Ot);
  return C(this, Ot, i), r !== i ? (O("GameTimeAutomation | Scene real-time allowance changed", {
    sceneId: (t == null ? void 0 : t.id) ?? null,
    allows: i
  }), !0) : !1;
}, "#refreshSceneAutomationState"), Ya = new WeakMap(), Qa = new WeakMap(), c(xl, "GameTimeAutomation");
let ys = xl;
var Hc, rn, Fe, Un, jt, Xa, ye, mu, gu, hu, pu, Za, Ls, eo, yu, to, bu, wu;
const xt = class xt extends In(Ln) {
  constructor(t = {}) {
    const { scene: i, trigger: r, triggerIndex: a, onSave: o, ...s } = t ?? {};
    super(s);
    I(this, ye);
    I(this, rn, null);
    I(this, Fe, null);
    I(this, Un, null);
    I(this, jt, null);
    I(this, Xa, /* @__PURE__ */ c(() => {
      (this.rendered ?? this.isRendered ?? !1) && (C(this, jt, S(this, ye, mu).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    I(this, Za, /* @__PURE__ */ c((t) => {
      var a, o;
      const i = t.currentTarget, r = i == null ? void 0 : i.closest("form");
      r && (O("Trigger action selection changed", {
        sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
        triggerId: ((o = this.trigger) == null ? void 0 : o.id) ?? null,
        actionId: (i == null ? void 0 : i.value) ?? null
      }), S(this, ye, Ls).call(this, i.value, r));
    }, "#onActionSelectChange"));
    I(this, eo, /* @__PURE__ */ c((t) => {
      var u, d, m, g;
      t.preventDefault();
      const i = t.currentTarget, r = i == null ? void 0 : i.closest("form");
      if (!r) return;
      const a = (u = i.dataset) == null ? void 0 : u.target;
      if (!a) return;
      const o = typeof (CSS == null ? void 0 : CSS.escape) == "function" ? CSS.escape : (h) => h, s = r.querySelector(`[name="${o(a)}"]`);
      if (!s) return;
      O("Opening file picker for trigger", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        triggerId: ((m = this.trigger) == null ? void 0 : m.id) ?? null,
        target: a
      }), new FilePicker({
        type: ((g = i.dataset) == null ? void 0 : g.type) || "audio",
        current: s.value,
        callback: /* @__PURE__ */ c((h) => {
          var y, p;
          s.value = h, s.dispatchEvent(new Event("change")), O("Trigger form file selected", {
            sceneId: ((y = this.scene) == null ? void 0 : y.id) ?? null,
            triggerId: ((p = this.trigger) == null ? void 0 : p.id) ?? null,
            target: a,
            path: h
          });
        }, "callback")
      }).render({ force: !0 });
    }, "#onFilePicker"));
    I(this, to, /* @__PURE__ */ c(async (t) => {
      var r, a;
      t.preventDefault();
      const i = t.currentTarget;
      i instanceof HTMLFormElement && (O("Trigger form submitted", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null,
        triggerId: ((a = this.trigger) == null ? void 0 : a.id) ?? null
      }), await S(this, ye, bu).call(this, i));
    }, "#onSubmit"));
    this.scene = i ?? null, this.trigger = r ?? null, this.triggerIndex = Number.isInteger(a) ? Number(a) : null, this.onSave = typeof o == "function" ? o : null, C(this, Un, wl(f(this, Xa)));
  }
  async _prepareContext() {
    var t, i;
    Ai("TriggerFormApplication#_prepareContext", {
      sceneId: ((t = this.scene) == null ? void 0 : t.id) ?? null,
      triggerId: ((i = this.trigger) == null ? void 0 : i.id) ?? null,
      triggerIndex: this.triggerIndex
    });
    try {
      const r = this.trigger ?? { action: Gr, data: {} }, a = r.action ?? Gr, o = Yl(r.time), s = o.format ?? "12h", l = s === "12h" ? Of() : [], u = o.period ?? (l.length > 0 ? l[0].value : null), d = s === "12h" ? l.map((h) => ({
        ...h,
        selected: h.value === u
      })) : [], m = Kl().map((h) => ({
        id: h.id,
        label: typeof h.label == "function" ? h.label() : h.label,
        selected: h.id === a
      })), g = Kl().map((h) => {
        const y = h.id === r.action ? r : { ...r, action: h.id }, p = vf(y);
        return p ? {
          id: h.id,
          visible: h.id === a,
          content: p
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
        actionSections: g,
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
      hn();
    }
  }
  _onRender(t, i) {
    var l, u, d;
    super._onRender(t, i);
    const r = this.element;
    if (!r) return;
    O("Trigger form rendered", {
      sceneId: ((l = this.scene) == null ? void 0 : l.id) ?? null,
      triggerId: ((u = this.trigger) == null ? void 0 : u.id) ?? null
    });
    const a = Array.from(((d = document == null ? void 0 : document.body) == null ? void 0 : d.classList) ?? []).find(
      (m) => m.startsWith("theme-")
    );
    a && r.classList.add(a);
    const o = r.querySelector("form");
    if (!o) return;
    S(this, ye, yu).call(this, o), S(this, ye, gu).call(this, o), o.addEventListener("submit", f(this, to));
    const s = o.querySelector("[data-action-select]");
    s && (s.addEventListener("change", f(this, Za)), S(this, ye, Ls).call(this, s.value, o)), o.querySelectorAll("[data-action-file-picker]").forEach((m) => {
      m.addEventListener("click", f(this, eo));
    });
  }
  async close(t = {}) {
    var i;
    if ((i = f(this, rn)) == null || i.call(this), C(this, rn, null), C(this, Fe, null), C(this, jt, null), typeof f(this, Un) == "function")
      try {
        f(this, Un).call(this);
      } catch (r) {
        console.error(`${T} | Failed to dispose trigger form time format subscription`, r);
      }
    return C(this, Un, null), super.close(t);
  }
};
rn = new WeakMap(), Fe = new WeakMap(), Un = new WeakMap(), jt = new WeakMap(), Xa = new WeakMap(), ye = new WeakSet(), mu = /* @__PURE__ */ c(function() {
  var s, l, u, d, m, g, h;
  const t = (l = (s = this.element) == null ? void 0 : s.querySelector) == null ? void 0 : l.call(s, "form");
  if (!(t instanceof HTMLFormElement)) return null;
  const i = Array.from(t.elements ?? []), r = [];
  for (const y of i)
    if ((y instanceof HTMLInputElement || y instanceof HTMLSelectElement || y instanceof HTMLTextAreaElement) && y.name && !(((u = y.dataset) == null ? void 0 : u.timeHidden) !== void 0 || ((d = y.dataset) == null ? void 0 : d.timeHour) !== void 0 || ((m = y.dataset) == null ? void 0 : m.timeMinute) !== void 0 || ((g = y.dataset) == null ? void 0 : g.timePeriod) !== void 0)) {
      if (y instanceof HTMLInputElement) {
        if (y.type === "checkbox" || y.type === "radio") {
          r.push({
            kind: y.type,
            name: y.name,
            value: y.value,
            checked: y.checked
          });
          continue;
        }
        r.push({
          kind: "value",
          name: y.name,
          value: y.value
        });
        continue;
      }
      if (y instanceof HTMLSelectElement) {
        y.multiple ? r.push({
          kind: "select-multiple",
          name: y.name,
          values: Array.from(y.selectedOptions ?? []).map((p) => p.value)
        }) : r.push({
          kind: "value",
          name: y.name,
          value: y.value
        });
        continue;
      }
      r.push({
        kind: "value",
        name: y.name,
        value: y.value
      });
    }
  const a = t.querySelector("[data-time-format]");
  let o = null;
  if (a instanceof HTMLElement) {
    const y = a.querySelector("[data-time-hidden]"), p = a.querySelector("[data-time-hour]"), w = a.querySelector("[data-time-minute]"), b = a.querySelector("[data-time-period]");
    o = {
      format: ((h = a.dataset) == null ? void 0 : h.timeFormat) ?? null,
      canonical: y instanceof HTMLInputElement ? y.value : "",
      hour: p instanceof HTMLInputElement ? p.value : "",
      minute: w instanceof HTMLInputElement ? w.value : "",
      period: b instanceof HTMLSelectElement ? b.value : ""
    };
  }
  return {
    fields: r,
    time: o
  };
}, "#captureFormState"), gu = /* @__PURE__ */ c(function(t) {
  if (!f(this, jt)) return;
  if (!(t instanceof HTMLFormElement)) {
    C(this, jt, null);
    return;
  }
  const { fields: i = [], time: r = null } = f(this, jt) ?? {};
  C(this, jt, null), S(this, ye, hu).call(this, t, i), S(this, ye, pu).call(this, t, r);
}, "#restorePendingFormState"), hu = /* @__PURE__ */ c(function(t, i) {
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
}, "#restoreFieldValues"), pu = /* @__PURE__ */ c(function(t, i) {
  var E, L, A;
  const r = t.querySelector("[data-time-format]");
  if (!(r instanceof HTMLElement)) {
    typeof f(this, Fe) == "function" && f(this, Fe).call(this);
    return;
  }
  const a = ((E = r.dataset) == null ? void 0 : E.timeFormat) === "24h" ? "24h" : "12h", o = r.querySelector("[data-time-hour]"), s = r.querySelector("[data-time-minute]"), l = r.querySelector("[data-time-period]"), u = r.querySelector("[data-time-hidden]");
  if (!i) {
    if (o instanceof HTMLInputElement && (o.value = ""), s instanceof HTMLInputElement && (s.value = ""), l instanceof HTMLSelectElement) {
      const $ = ((A = (L = l.options) == null ? void 0 : L[0]) == null ? void 0 : A.value) ?? "";
      l.value = $;
    }
    u instanceof HTMLInputElement && (u.value = ""), typeof f(this, Fe) == "function" && f(this, Fe).call(this);
    return;
  }
  const d = typeof i.canonical == "string" ? i.canonical : "", m = typeof i.period == "string" ? i.period : "", g = typeof i.hour == "string" ? i.hour : "", h = typeof i.minute == "string" ? i.minute : "";
  let y = "", p = "", w = m, b = d;
  if (d) {
    const $ = Yl(d, a);
    y = $.hour ?? "", p = $.minute ?? "", b = $.canonical ?? d, a === "12h" ? w = $.period ?? m : w = "";
  } else
    y = g, p = h, a !== "12h" && (w = "");
  if (o instanceof HTMLInputElement && (o.value = y ?? ""), s instanceof HTMLInputElement && (s.value = p ?? ""), l instanceof HTMLSelectElement)
    if (a === "12h") {
      const $ = Array.from(l.options ?? []);
      $.find((D) => D.value === w) ? l.value = w : $.length > 0 ? l.value = $[0].value : l.value = "";
    } else
      l.value = "";
  u instanceof HTMLInputElement && (u.value = b ?? ""), typeof f(this, Fe) == "function" && f(this, Fe).call(this);
}, "#restoreTimeInputs"), Za = new WeakMap(), Ls = /* @__PURE__ */ c(function(t, i) {
  i && i.querySelectorAll("[data-action-config]").forEach((r) => {
    const a = r.dataset.actionConfig === t;
    r.style.display = a ? "" : "none";
  });
}, "#updateActionSections"), eo = new WeakMap(), yu = /* @__PURE__ */ c(function(t) {
  var m, g, h, y;
  if ((m = f(this, rn)) == null || m.call(this), C(this, rn, null), C(this, Fe, null), !(t instanceof HTMLFormElement)) return;
  const i = t.querySelector("[data-time-format]"), r = ((g = i == null ? void 0 : i.dataset) == null ? void 0 : g.timeFormat) ?? null;
  if (r !== "12h" && r !== "24h")
    return;
  const a = i.querySelector("[data-time-hidden]"), o = i.querySelector("[data-time-hour]"), s = i.querySelector("[data-time-minute]"), l = r === "12h" ? i.querySelector("[data-time-period]") : null;
  if (!a || !o || !s || r === "12h" && !l) {
    O("Trigger form time inputs missing elements", {
      format: r,
      hasHidden: !!a,
      hasHour: !!o,
      hasMinute: !!s,
      hasPeriod: !!l
    });
    return;
  }
  const u = [o, s, ...l ? [l] : []], d = /* @__PURE__ */ c(() => {
    const { canonical: p, error: w } = If(
      {
        hour: o.value,
        minute: s.value,
        period: (l == null ? void 0 : l.value) ?? null,
        time: a.value
      },
      r
    );
    a.value = p ?? "";
    const b = w ?? "";
    a.setCustomValidity(b), u.forEach((E) => {
      E.setCustomValidity(b);
    });
  }, "update");
  u.forEach((p) => {
    p.addEventListener("input", d), p.addEventListener("change", d);
  }), d(), C(this, rn, () => {
    u.forEach((p) => {
      p.removeEventListener("input", d), p.removeEventListener("change", d);
    });
  }), C(this, Fe, d), O("Trigger form configured for time input", {
    format: r,
    sceneId: ((h = this.scene) == null ? void 0 : h.id) ?? null,
    triggerId: ((y = this.trigger) == null ? void 0 : y.id) ?? null
  });
}, "#setupTimeInput"), to = new WeakMap(), bu = /* @__PURE__ */ c(async function(t) {
  var a, o, s, l, u;
  if (typeof f(this, Fe) == "function" && f(this, Fe).call(this), typeof t.checkValidity == "function" && !t.checkValidity()) {
    typeof t.reportValidity == "function" && t.reportValidity(), O("Trigger form submission blocked by validity check", {
      sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
      triggerId: ((o = this.trigger) == null ? void 0 : o.id) ?? null
    });
    return;
  }
  const i = new FormData(t), r = Object.fromEntries(i.entries());
  delete r.timeHour, delete r.timeMinute, delete r.timePeriod, r.allowReplayOnRewind = ((s = t.querySelector('input[name="allowReplayOnRewind"]')) == null ? void 0 : s.checked) ?? !1, O("Processing trigger form submission", {
    sceneId: ((l = this.scene) == null ? void 0 : l.id) ?? null,
    triggerId: ((u = this.trigger) == null ? void 0 : u.id) ?? null,
    allowReplayOnRewind: r.allowReplayOnRewind
  }), await S(this, ye, wu).call(this, r), await this.close();
}, "#handleSubmit"), wu = /* @__PURE__ */ c(async function(t) {
  var a, o, s, l, u, d;
  const i = {
    id: ((a = this.trigger) == null ? void 0 : a.id) ?? sf(),
    time: t.time ?? "",
    action: t.action ?? Gr,
    allowReplayOnRewind: !!t.allowReplayOnRewind,
    data: {}
  };
  O("Persisting trigger from form", {
    sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
    triggerId: i.id,
    existingIndex: this.triggerIndex
  }), Ef(i, t);
  const r = yi(this.scene);
  this.triggerIndex !== null && r[this.triggerIndex] ? r[this.triggerIndex] = i : r.push(i);
  try {
    await Xc(this.scene, r), O("Trigger list saved", {
      sceneId: ((s = this.scene) == null ? void 0 : s.id) ?? null,
      triggerCount: r.length
    });
  } catch (m) {
    throw console.error(`${T} | Failed to save time trigger`, m), (u = (l = ui.notifications) == null ? void 0 : l.error) == null || u.call(
      l,
      v(
        "EIDOLON.TimeTrigger.TriggerSaveError",
        "Failed to save the scene's time triggers."
      )
    ), m;
  }
  if (this.onSave)
    try {
      this.onSave(r);
    } catch (m) {
      console.error(`${T} | Trigger onSave callback failed`, m), O("Trigger onSave callback failed", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        message: (m == null ? void 0 : m.message) ?? String(m)
      });
    }
}, "#persistTrigger"), c(xt, "TriggerFormApplication"), pe(xt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  De(xt, xt, "DEFAULT_OPTIONS"),
  {
    id: `${T}-trigger-form`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Hc = De(xt, xt, "DEFAULT_OPTIONS")) == null ? void 0 : Hc.classes) ?? [], "standard-form", "themed"])
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
)), pe(xt, "PARTS", {
  content: {
    template: `modules/${T}/templates/time-trigger-form.html`
  }
});
let Cs = xt;
function Gt(n) {
  return n instanceof HTMLElement ? n : (n == null ? void 0 : n[0]) instanceof HTMLElement ? n[0] : null;
}
c(Gt, "asHTMLElement");
function Yr(n) {
  return typeof (n == null ? void 0 : n.changeTab) == "function";
}
c(Yr, "isAppV2");
function vu(n, e, t, i = {}) {
  if (Yr(n)) {
    n.changeTab(e, t, i);
    return;
  }
  if (typeof (n == null ? void 0 : n.activateTab) == "function") {
    const r = { ...i };
    t != null && (r.group = t), r.triggerCallback == null && (r.triggerCallback = !0), n.activateTab(e, r);
  }
}
c(vu, "setActiveTab");
function Nf(n) {
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
c(Nf, "readFormData");
const Xl = Symbol.for("eidolon.sceneConfig.v13PatchedTabs");
function Eu(n = {}) {
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
    tabIcon: g = "fa-solid fa-puzzle-piece"
  } = n ?? {};
  if (!e)
    throw new Error("createSceneConfigTabFactory requires a tabId.");
  if (typeof a != "function")
    throw new TypeError("createSceneConfigTabFactory requires a renderContent callback.");
  const h = typeof d.log == "function" ? d.log.bind(d) : (...N) => {
    var R;
    return (R = console.debug) == null ? void 0 : R.call(console, `${o}`, ...N);
  }, y = typeof d.group == "function" ? d.group.bind(d) : (...N) => {
    var R;
    return (R = console.groupCollapsed) == null ? void 0 : R.call(console, `${o}`, ...N);
  }, p = typeof d.groupEnd == "function" ? d.groupEnd.bind(d) : () => {
    var N;
    return (N = console.groupEnd) == null ? void 0 : N.call(console);
  }, w = Symbol(`EIDOLON_SCENE_CONFIG_TAB_CLEANUP_${e}`), b = typeof i == "function" ? i : () => null, E = typeof r == "function" ? r : () => !0, L = typeof t == "function" ? t : () => typeof t == "string" ? t : e;
  function A() {
    var z, H, U, Y, ae;
    const N = ((H = (z = foundry == null ? void 0 : foundry.applications) == null ? void 0 : z.sheets) == null ? void 0 : H.SceneConfig) ?? ((U = CONFIG == null ? void 0 : CONFIG.Scene) == null ? void 0 : U.sheetClass);
    if (!N || !Yr({ changeTab: (Y = N.prototype) == null ? void 0 : Y.changeTab })) return;
    const R = N[Xl] ?? /* @__PURE__ */ new Set();
    if (R.has(e)) return;
    R.add(e), N[Xl] = R;
    const V = (ae = N.TABS) == null ? void 0 : ae.sheet;
    if (V && Array.isArray(V.tabs) && !V.tabs.some((Z) => Z.id === e)) {
      const Z = L({ app: null, scene: null }) ?? e;
      V.tabs.push({
        id: e,
        icon: g,
        label: Z
      });
    }
    N.PARTS && !N.PARTS[e] && (N.PARTS[e] = {
      template: `modules/${m}/templates/scene-config-tab-mount.hbs`,
      scrollable: [`.tab[data-tab="${e}"]`]
    }), h("Patched v13 SceneConfig TABS/PARTS", { tabId: e });
  }
  c(A, "patchV13SceneConfig");
  function $(N, R) {
    var z, H;
    const V = b(N);
    if (!E(N, V)) {
      h("Skipped render", {
        tabId: e,
        reason: "inapplicable",
        constructor: ((z = N == null ? void 0 : N.constructor) == null ? void 0 : z.name) ?? null
      });
      return;
    }
    y("render", {
      tabId: e,
      sceneId: (V == null ? void 0 : V.id) ?? null,
      constructor: ((H = N == null ? void 0 : N.constructor) == null ? void 0 : H.name) ?? null
    });
    try {
      const U = Gt(R) ?? Gt(N.element);
      if (!U) {
        h("Missing root element", { tabId: e });
        return;
      }
      Yr(N) ? J(N, U, V) : D(N, U, V);
    } finally {
      p();
    }
  }
  c($, "handleRender");
  function k(N, R, V) {
    var U;
    if (!g) {
      N.textContent = R;
      return;
    }
    const z = (U = N.querySelector("i")) == null ? void 0 : U.cloneNode(!0);
    N.textContent = "";
    const H = z ?? document.createElement("i");
    if (z || (H.className = g, V && (H.inert = !0)), N.append(H, " "), V) {
      const Y = document.createElement("span");
      Y.textContent = R, N.append(Y);
    } else
      N.append(document.createTextNode(R));
  }
  c(k, "setButtonContent");
  function D(N, R, V) {
    var et, $t, ze, Te, ai, Dt, An, tt, Ft, F, kr, Q, dt, Oe, Fi, $r;
    const H = [
      "nav.sheet-tabs[data-group]",
      "nav.tabs[data-group]",
      "nav.sheet-tabs",
      "nav.tabs"
    ].map((Ae) => R.querySelector(Ae)).find((Ae) => Ae instanceof HTMLElement), Y = [
      (et = R.querySelector(".tab[data-tab]")) == null ? void 0 : et.parentElement,
      R.querySelector(".sheet-body"),
      (ze = ($t = H == null ? void 0 : H.parentElement) == null ? void 0 : $t.querySelector) == null ? void 0 : ze.call($t, ":scope > .sheet-body"),
      H == null ? void 0 : H.parentElement
    ].find((Ae) => Ae instanceof HTMLElement), ae = ((Te = H == null ? void 0 : H.dataset) == null ? void 0 : Te.group) ?? ((An = (Dt = (ai = H == null ? void 0 : H.querySelector) == null ? void 0 : ai.call(H, "a[data-group]")) == null ? void 0 : Dt.dataset) == null ? void 0 : An.group) ?? ((F = (Ft = (tt = H == null ? void 0 : H.querySelector) == null ? void 0 : tt.call(H, "[data-group]")) == null ? void 0 : Ft.dataset) == null ? void 0 : F.group) ?? ((dt = (Q = (kr = Y == null ? void 0 : Y.querySelector) == null ? void 0 : kr.call(Y, ".tab[data-group]")) == null ? void 0 : Q.dataset) == null ? void 0 : dt.group) ?? "main";
    if (!H || !Y) {
      h("Missing navigation elements", {
        tabId: e,
        hasNav: !!H,
        hasBody: !!Y
      });
      return;
    }
    let Z = H.querySelector(`[data-tab="${e}"]`);
    if (!Z) {
      Z = document.createElement("a"), Z.dataset.action = "tab", Z.dataset.group = ae, Z.dataset.tab = e;
      const Ae = H.querySelector("a[data-tab]");
      (Oe = Ae == null ? void 0 : Ae.classList) != null && Oe.contains("item") && Z.classList.add("item"), H.appendChild(Z), typeof s == "function" && s({ app: N, button: Z, nav: H, scene: V }), h("Created tab button", { tabId: e, group: ae });
    }
    k(Z, L({ app: N, scene: V }) ?? e, Yr(N));
    let ie = Y.querySelector(`.tab[data-tab="${e}"]`);
    if (!ie) {
      ie = document.createElement("div"), ie.classList.add("tab"), ie.dataset.tab = e, ie.dataset.group = ae;
      const Ae = Mf(Y);
      Y.insertBefore(ie, Ae ?? null), typeof l == "function" && l({ app: N, tab: ie, body: Y, scene: V }), h("Created tab container", { tabId: e, group: ae });
    }
    ((Fi = Z.classList) == null ? void 0 : Fi.contains("active")) || ie.classList.contains("active") ? (Z.classList.add("active"), ie.classList.add("active"), ie.removeAttribute("hidden")) : (Z.classList.remove("active"), ie.classList.remove("active"), ie.setAttribute("hidden", "true"));
    const ut = /* @__PURE__ */ c(() => {
      var Nn, Pi;
      ((Nn = Z.classList) != null && Nn.contains("active") || ie.classList.contains("active")) && ((Pi = Z.classList) == null || Pi.add("active"), ie.classList.add("active"), ie.removeAttribute("hidden"), ie.removeAttribute("aria-hidden"), ie.style.display === "none" && (ie.style.display = ""));
    }, "ensureTabVisible"), $e = /* @__PURE__ */ c(() => {
      ut(), requestAnimationFrame(ut);
    }, "scheduleEnsureTabVisible");
    Z.dataset.eidolonEnsureSceneTabVisibility || (Z.addEventListener("click", () => {
      vu(N, e, ae), requestAnimationFrame(ut);
    }), Z.dataset.eidolonEnsureSceneTabVisibility = "true"), xo(N, w, h);
    const Ze = a({
      app: N,
      scene: V,
      tab: ie,
      tabButton: Z,
      ensureTabVisible: ut,
      scheduleEnsureTabVisible: $e
    });
    typeof Ze == "function" && Zl(N, w, Ze), typeof u == "function" && u({
      app: N,
      scene: V,
      tab: ie,
      tabButton: Z,
      ensureTabVisible: ut,
      scheduleEnsureTabVisible: $e
    }), ($r = N.setPosition) == null || $r.call(N, { height: "auto" });
  }
  c(D, "handleRenderV1");
  function J(N, R, V) {
    const z = R.querySelector(`.tab[data-tab="${e}"]`), H = R.querySelector(`nav [data-tab="${e}"]`);
    if (!z || !H) {
      h("v2 mount not found, falling back to v1 injection", { tabId: e }), D(N, R, V);
      return;
    }
    k(H, L({ app: N, scene: V }) ?? e, !0);
    const U = /* @__PURE__ */ c(() => {
      var Z;
      !((Z = H.classList) != null && Z.contains("active")) && !z.classList.contains("active") || (z.classList.add("active"), z.removeAttribute("hidden"), z.removeAttribute("aria-hidden"), z.style.display === "none" && (z.style.display = ""));
    }, "ensureTabVisible"), Y = /* @__PURE__ */ c(() => {
      U(), requestAnimationFrame(U);
    }, "scheduleEnsureTabVisible");
    xo(N, w, h);
    const ae = a({
      app: N,
      scene: V,
      tab: z,
      tabButton: H,
      ensureTabVisible: U,
      scheduleEnsureTabVisible: Y
    });
    typeof ae == "function" && Zl(N, w, ae), typeof u == "function" && u({
      app: N,
      scene: V,
      tab: z,
      tabButton: H,
      ensureTabVisible: U,
      scheduleEnsureTabVisible: Y
    });
  }
  c(J, "handleRenderV2");
  function K(N) {
    xo(N, w, h);
  }
  c(K, "handleClose");
  function _() {
    return Hooks.once("init", () => {
      A();
    }), Hooks.on("renderSceneConfig", $), Hooks.on("closeSceneConfig", K), () => P();
  }
  c(_, "register");
  function P() {
    Hooks.off("renderSceneConfig", $), Hooks.off("closeSceneConfig", K);
  }
  return c(P, "unregister"), { register: _, unregister: P };
}
c(Eu, "createSceneConfigTabFactory");
function Zl(n, e, t) {
  if (!n || typeof t != "function") return;
  const i = n == null ? void 0 : n[e];
  Array.isArray(i) || (n[e] = []), n[e].push(t);
}
c(Zl, "registerCleanup");
function xo(n, e, t) {
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
c(xo, "invokeCleanup");
function Mf(n) {
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
c(Mf, "findFooterElement$1");
const kf = go(Cs), $f = `modules/${T}/templates/time-trigger-scene-tab.html`, Df = Eu({
  tabId: "time-triggers",
  tabLabel: /* @__PURE__ */ c(() => v("EIDOLON.TimeTrigger.Tab", "Time Triggers"), "tabLabel"),
  getScene: kt,
  isApplicable: xf,
  renderContent: /* @__PURE__ */ c(({ app: n, scene: e, tab: t }) => Pf(n, t, e), "renderContent"),
  logger: {
    log: O,
    group: Ai,
    groupEnd: hn
  }
});
function Ff() {
  return O("Registering SceneConfig render hook"), Df.register();
}
c(Ff, "registerSceneConfigHook");
function Pf(n, e, t) {
  if (!(e instanceof HTMLElement)) return;
  const i = Ue(t) ? t : kt(n);
  ma(n, e, i);
  const r = wl(() => {
    ma(n, e, i);
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
c(Pf, "renderTimeTriggerTab");
async function ma(n, e, t) {
  var r, a;
  const i = t ?? kt(n);
  Ai("renderTimeTriggersTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!Ue(i)) {
      const z = v(
        "EIDOLON.TimeTrigger.Unavailable",
        "Time triggers are unavailable for this configuration sheet."
      );
      e.innerHTML = `<p class="notes">${z}</p>`, O("Scene lacks document for time triggers", { sceneId: (i == null ? void 0 : i.id) ?? null });
      return;
    }
    const o = `flags.${T}.${la}`, s = `flags.${T}.${Yo}`, l = `flags.${T}.${Qo}`, u = !!i.getFlag(T, la), d = !!i.getFlag(T, Yo), m = !!i.getFlag(T, Qo), g = yi(i);
    O("Rendering time trigger list", {
      sceneId: i.id,
      isActive: u,
      shouldHideWindow: d,
      shouldShowPlayerWindow: m,
      triggerCount: g.length
    });
    const h = v("EIDOLON.TimeTrigger.Activate", "Activate Time Trigger"), y = v(
      "EIDOLON.TimeTrigger.Description",
      "Enable scene time triggers so scheduled actions can run automatically."
    ), p = v(
      "EIDOLON.TimeTrigger.HideWindowLabel",
      "Hide Floating Time Window"
    ), w = v(
      "EIDOLON.TimeTrigger.HideWindowDescription",
      "Keep the floating time control window hidden while leaving time triggers active."
    ), b = v(
      "EIDOLON.TimeTrigger.ShowPlayerWindowLabel",
      "Share Floating Time Window with Players"
    ), E = v(
      "EIDOLON.TimeTrigger.ShowPlayerWindowDescription",
      "Let non-GM players see the floating time window (without time controls)."
    ), L = v(
      "EIDOLON.TimeTrigger.TriggerListLabel",
      "Scene Time Triggers"
    ), A = v(
      "EIDOLON.TimeTrigger.TriggerListEmpty",
      "No time triggers configured for this scene."
    ), $ = v("EIDOLON.TimeTrigger.AddTrigger", "Add Trigger"), k = v("EIDOLON.TimeTrigger.EditTrigger", "Edit"), D = v("EIDOLON.TimeTrigger.DeleteTrigger", "Remove"), J = v("EIDOLON.TimeTrigger.TriggerNow", "Trigger Now"), K = v("EIDOLON.TimeTrigger.AtLabel", "At"), _ = v("EIDOLON.TimeTrigger.DoLabel", "Do"), P = v("EIDOLON.TimeTrigger.MissingTime", "(No time set)"), N = g.map((z, H) => {
      const ae = (z.time ? Lf(z.time) : "") || z.time || "" || P, Z = bf(z.action), ie = [
        `${K} ${ae}`,
        `${_} ${Z}`,
        ...wf(z)
      ];
      return {
        index: H,
        summaryParts: ie,
        tooltips: {
          triggerNow: J,
          edit: k,
          delete: D
        }
      };
    }), R = ((a = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : a.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof R != "function") {
      console.error(`${T} | renderTemplate is unavailable; cannot render scene tab.`), e.innerHTML = `<p class="notes">${A}</p>`;
      return;
    }
    let V = "";
    try {
      V = await R($f, {
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
          hideWindow: p,
          showPlayerWindow: b,
          triggerList: L,
          empty: A,
          add: $
        },
        hints: {
          activate: y,
          hideWindow: w,
          showPlayerWindow: E
        },
        triggers: N,
        hasTriggers: N.length > 0
      });
    } catch (z) {
      console.error(`${T} | Failed to render time trigger scene tab template`, z), e.innerHTML = `<p class="notes">${A}</p>`;
      return;
    }
    e.innerHTML = V, _f(n, e, i);
  } finally {
    hn();
  }
}
c(ma, "renderTimeTriggersTabContent");
function _f(n, e, t) {
  const i = t ?? kt(n);
  if (!Ue(i)) return;
  const r = e.querySelector('[data-action="add-trigger"]');
  r && r.addEventListener("click", () => {
    O("Add trigger button clicked", { sceneId: i.id }), ec(n, { scene: i });
  }), e.querySelectorAll('[data-action="edit-trigger"]').forEach((a) => {
    a.addEventListener("click", () => {
      const o = Number(a.dataset.index);
      if (!Number.isInteger(o)) return;
      const l = yi(i)[o];
      l && (O("Edit trigger button clicked", { sceneId: i.id, triggerId: l.id, index: o }), ec(n, { trigger: l, triggerIndex: o, scene: i }));
    });
  }), e.querySelectorAll('[data-action="delete-trigger"]').forEach((a) => {
    a.addEventListener("click", async () => {
      var u, d;
      const o = Number(a.dataset.index);
      if (!Number.isInteger(o)) return;
      const s = yi(i), l = s[o];
      if (l) {
        s.splice(o, 1);
        try {
          O("Deleting trigger", {
            sceneId: i.id,
            index: o,
            triggerId: (l == null ? void 0 : l.id) ?? null
          }), await Xc(i, s), await ma(n, e, i);
        } catch (m) {
          console.error(`${T} | Failed to delete time trigger`, m), (d = (u = ui.notifications) == null ? void 0 : u.error) == null || d.call(
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
      var u, d, m, g, h, y, p;
      const o = Number(a.dataset.index);
      if (!Number.isInteger(o)) return;
      const l = yi(i)[o];
      if (l) {
        if (!((u = game.user) != null && u.isGM)) {
          (m = (d = ui.notifications) == null ? void 0 : d.warn) == null || m.call(
            d,
            v("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time.")
          );
          return;
        }
        try {
          O("Manually firing trigger", { sceneId: i.id, triggerId: l.id, index: o }), await Zc(i, l), (h = (g = ui.notifications) == null ? void 0 : g.info) == null || h.call(
            g,
            v(
              "EIDOLON.TimeTrigger.TriggerNowSuccess",
              "Triggered the selected time trigger."
            )
          );
        } catch (w) {
          console.error(`${T} | Failed to execute time trigger manually`, w), (p = (y = ui.notifications) == null ? void 0 : y.error) == null || p.call(
            y,
            v(
              "EIDOLON.TimeTrigger.TriggerNowError",
              "Failed to execute the selected time trigger."
            )
          ), O("Manual trigger execution failed", {
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
c(_f, "bindTimeTriggerTabEvents");
function ec(n, e = {}) {
  var o;
  const t = e.scene ?? null, i = t && Ue(t) ? t : kt(n);
  if (!Ue(i)) {
    console.warn(`${T} | Unable to open trigger form because no scene document is available.`);
    return;
  }
  O("Opening trigger form", {
    sceneId: i.id,
    triggerId: ((o = e.trigger) == null ? void 0 : o.id) ?? null,
    index: Number.isInteger(e.triggerIndex) ? Number(e.triggerIndex) : null
  }), kf({
    scene: i,
    trigger: e.trigger ?? null,
    triggerIndex: e.triggerIndex ?? null,
    onSave: /* @__PURE__ */ c(() => {
      var l, u;
      const s = (u = (l = n.element) == null ? void 0 : l[0]) == null ? void 0 : u.querySelector('.tab[data-tab="time-triggers"]');
      s && ma(n, s, i);
    }, "onSave")
  }).render({ force: !0 });
}
c(ec, "openTriggerForm");
function xf(n, e) {
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
c(xf, "isRecognizedSceneConfig");
const _r = new ps(), tc = new ys();
function Rf() {
  O("Registering time trigger hooks"), Hooks.once("init", () => {
    lf(), gf(), O("Time trigger settings registered during init");
  }), Ff(), O("Scene config hook registered"), tc.registerHooks(), O("Time automation hooks registered"), Hooks.once("ready", () => {
    hf(), O("Ready hook fired"), _r.onReady(), tc.initialize();
  }), Hooks.on("canvasReady", (n) => {
    var e;
    O("canvasReady hook received", { scene: ((e = n == null ? void 0 : n.scene) == null ? void 0 : e.id) ?? null }), _r.onCanvasReady(n);
  }), Hooks.on("updateScene", (n) => {
    O("updateScene hook received", { scene: (n == null ? void 0 : n.id) ?? null }), _r.onUpdateScene(n);
  }), Hooks.on("updateWorldTime", (n, e) => {
    O("updateWorldTime hook received", { worldTime: n, diff: e }), _r.onUpdateWorldTime(n, e);
  });
}
c(Rf, "registerTimeTriggerHooks");
Rf();
const ve = T, Su = "criteria", El = "state", Hf = "criteriaVersion", qf = 1, Tu = "enableCriteriaSurfaces";
let nc = !1;
function jf() {
  var n;
  if (!nc) {
    if (nc = !0, !((n = game == null ? void 0 : game.settings) != null && n.register)) {
      console.warn(`${ve} | game.settings.register unavailable; scene criteria setting skipped.`);
      return;
    }
    game.settings.register(ve, Tu, {
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
        Bf();
      }, "onChange")
    });
  }
}
c(jf, "registerSceneCriteriaSettings");
function ho() {
  var n;
  try {
    if ((n = game == null ? void 0 : game.settings) != null && n.get)
      return !!game.settings.get(ve, Tu);
  } catch (e) {
    console.error(`${ve} | Failed to read criteria surfaces setting`, e);
  }
  return !0;
}
c(ho, "getCriteriaSurfacesEnabled");
function Bf() {
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
c(Bf, "promptReloadForCriteriaSurfaces");
const ga = "Standard";
function ct(n) {
  var t;
  const e = (t = n == null ? void 0 : n.getFlag) == null ? void 0 : t.call(n, ve, Su);
  return e ? Cu(e) : [];
}
c(ct, "getSceneCriteria");
async function po(n, e) {
  if (!(n != null && n.setFlag)) return;
  const t = Cu(e);
  await n.setFlag(ve, Su, t), await n.setFlag(ve, Hf, qf);
  const i = Ir(n, t);
  await n.setFlag(ve, El, i);
}
c(po, "setSceneCriteria");
function Ir(n, e = null) {
  var r;
  const t = Array.isArray(e) ? e : ct(n), i = Mt(((r = n == null ? void 0 : n.getFlag) == null ? void 0 : r.call(n, ve, El)) ?? {});
  return Tl(i, t);
}
c(Ir, "getSceneCriteriaState");
async function Uf(n, e, t = null) {
  if (!(n != null && n.setFlag)) return;
  const i = Array.isArray(t) ? t : ct(n), r = Tl(e, i);
  await n.setFlag(ve, El, r);
}
c(Uf, "setSceneCriteriaState");
function Sl(n = "") {
  const e = typeof n == "string" ? n.trim() : "", t = Lu(Os(e || "criterion"), /* @__PURE__ */ new Set());
  return {
    id: Iu(),
    key: t,
    label: e,
    values: [ga],
    default: ga,
    order: 0
  };
}
c(Sl, "createSceneCriterion");
function Cu(n) {
  const e = Array.isArray(n) ? Mt(n) : [], t = [], i = /* @__PURE__ */ new Set();
  return e.forEach((r, a) => {
    const o = Is(r, a, i);
    o && (t.push(o), i.add(o.key));
  }), t;
}
c(Cu, "sanitizeCriteria$1");
function Is(n, e = 0, t = /* @__PURE__ */ new Set()) {
  if (!n || typeof n != "object") return null;
  const i = typeof n.id == "string" && n.id.trim() ? n.id.trim() : Iu(), a = (typeof n.label == "string" ? n.label : typeof n.name == "string" ? n.name : "").trim(), o = typeof n.key == "string" && n.key.trim() ? Os(n.key) : Os(a || `criterion-${Number(e) + 1}`), s = Lu(o, t), l = zf(n.values);
  let u = typeof n.default == "string" ? n.default.trim() : "";
  u || (u = l[0] ?? ga), l.includes(u) || l.unshift(u);
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
c(Is, "sanitizeCriterion");
function Tl(n, e = []) {
  const t = n && typeof n == "object" ? Mt(n) : {}, i = {};
  for (const r of e) {
    const a = t == null ? void 0 : t[r.key], o = typeof a == "string" ? a.trim() : "";
    o && r.values.includes(o) ? i[r.key] = o : i[r.key] = r.default;
  }
  return i;
}
c(Tl, "sanitizeSceneCriteriaState");
function Vf(n) {
  return ct(n).map((t) => ({
    id: t.key,
    key: t.key,
    name: t.label,
    values: [...t.values]
  }));
}
c(Vf, "getSceneCriteriaCategories");
function zf(n) {
  const e = Array.isArray(n) ? n : [], t = [];
  for (const i of e) {
    if (typeof i != "string") continue;
    const r = i.trim();
    !r || t.includes(r) || t.push(r);
  }
  return t.length || t.push(ga), t;
}
c(zf, "sanitizeCriterionValues");
function Os(n) {
  return String(n ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
c(Os, "slugifyCriterionKey");
function Lu(n, e) {
  if (!e.has(n)) return n;
  let t = 2;
  for (; e.has(`${n}-${t}`); )
    t += 1;
  return `${n}-${t}`;
}
c(Lu, "ensureUniqueCriterionKey");
function Iu() {
  var n;
  return (n = foundry == null ? void 0 : foundry.utils) != null && n.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 11);
}
c(Iu, "generateCriterionId");
function Ou(n) {
  var e, t;
  console.error(`${ve} | Failed to persist scene criteria`, n), (t = (e = ui.notifications) == null ? void 0 : e.error) == null || t.call(
    e,
    v(
      "EIDOLON.SceneCriteria.PersistError",
      "Failed to persist the scene criteria."
    )
  );
}
c(Ou, "notifyPersistError");
var qc, me, Bt, ke, Au, no, io, ro, ao, Qr, oo, sr, lr, ji, Nu;
const Rt = class Rt extends In(Ln) {
  constructor(t = {}) {
    const { scene: i, criterion: r, isNew: a, onSave: o, ...s } = t ?? {};
    super(s);
    I(this, ke);
    I(this, me, null);
    I(this, Bt, !1);
    I(this, no, /* @__PURE__ */ c(async (t) => {
      t.preventDefault();
      const i = t.currentTarget;
      if (!(i instanceof HTMLFormElement)) return;
      const r = new FormData(i), a = String(r.get("criterionLabel") ?? "").trim(), o = String(r.get("criterionKey") ?? "").trim(), s = Array.from(i.querySelectorAll('[name="criterionValues"]')).map((m) => m instanceof HTMLInputElement ? m.value.trim() : "").filter((m, g, h) => m && h.indexOf(m) === g), u = String(r.get("criterionDefault") ?? "").trim() || s[0] || "Standard", d = Is(
        {
          id: f(this, me).id,
          key: o,
          label: a,
          values: s,
          default: u,
          order: Number(f(this, me).order ?? 0)
        },
        0,
        /* @__PURE__ */ new Set()
      );
      d && (C(this, me, d), await S(this, ke, Nu).call(this), this.close());
    }, "#onSubmit"));
    I(this, io, /* @__PURE__ */ c((t) => {
      var o;
      if (f(this, Bt)) return;
      const i = t.currentTarget, r = (i == null ? void 0 : i.form) ?? ((o = this.element) == null ? void 0 : o.querySelector("form"));
      if (!(r instanceof HTMLFormElement)) return;
      const a = r.querySelector('input[name="criterionKey"]');
      a instanceof HTMLInputElement && (a.value = Ri(i.value));
    }, "#onLabelInput"));
    I(this, ro, /* @__PURE__ */ c((t) => {
      var l;
      const i = t.currentTarget, r = (i == null ? void 0 : i.form) ?? ((l = this.element) == null ? void 0 : l.querySelector("form"));
      if (!(r instanceof HTMLFormElement) || !(i instanceof HTMLInputElement)) return;
      const a = r.querySelector('input[name="criterionLabel"]'), o = Ri(a instanceof HTMLInputElement ? a.value : ""), s = Ri(i.value);
      C(this, Bt, s !== o), i.value = s, S(this, ke, Qr).call(this, r);
    }, "#onKeyInput"));
    I(this, ao, /* @__PURE__ */ c((t) => {
      var o, s;
      t.preventDefault();
      const i = ((o = t.currentTarget) == null ? void 0 : o.form) ?? ((s = this.element) == null ? void 0 : s.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector('input[name="criterionLabel"]'), a = i.querySelector('input[name="criterionKey"]');
      a instanceof HTMLInputElement && (a.value = Ri(r instanceof HTMLInputElement ? r.value : ""), C(this, Bt, !1), S(this, ke, Qr).call(this, i));
    }, "#onResetAutoKey"));
    I(this, oo, /* @__PURE__ */ c((t) => {
      var l, u, d, m, g, h;
      t.preventDefault();
      const i = ((l = t.currentTarget) == null ? void 0 : l.form) ?? ((u = this.element) == null ? void 0 : u.querySelector("form"));
      if (!(i instanceof HTMLFormElement)) return;
      const r = i.querySelector(".scene-criterion-editor__values");
      if (!(r instanceof HTMLElement)) return;
      (d = r.querySelector(".scene-criterion-editor__empty")) == null || d.remove();
      const a = document.createElement("div");
      a.classList.add("scene-criterion-editor__value");
      const o = vt(v("EIDOLON.SceneCriteria.ValuePlaceholder", "Allowed value")), s = vt(v("EIDOLON.SceneCriteria.RemoveValue", "Remove Value"));
      a.innerHTML = `
      <input type="text" name="criterionValues" value="" placeholder="${o}" class="form-control">
      <button type="button" class="icon" data-action="remove-value" aria-label="${s}" title="${s}">
        <i class="fa-solid fa-trash"></i>
      </button>
    `, r.appendChild(a), (m = a.querySelector('[data-action="remove-value"]')) == null || m.addEventListener("click", f(this, sr)), (g = a.querySelector('input[name="criterionValues"]')) == null || g.addEventListener("input", f(this, lr)), S(this, ke, ji).call(this, i), (h = a.querySelector('input[name="criterionValues"]')) == null || h.focus();
    }, "#onAddValue"));
    I(this, sr, /* @__PURE__ */ c((t) => {
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
        S(this, ke, ji).call(this, i);
      }
    }, "#onRemoveValue"));
    I(this, lr, /* @__PURE__ */ c((t) => {
      var r, a;
      const i = ((r = t.currentTarget) == null ? void 0 : r.form) ?? ((a = this.element) == null ? void 0 : a.querySelector("form"));
      i instanceof HTMLFormElement && S(this, ke, ji).call(this, i);
    }, "#onValuesChanged"));
    this.scene = i ?? null, this.criterion = r ?? null, this.onSave = typeof o == "function" ? o : null, this.isNew = !!a, C(this, me, S(this, ke, Au).call(this)), C(this, Bt, f(this, me).key !== Ri(f(this, me).label));
  }
  async _prepareContext() {
    var i, r, a, o;
    const t = Array.isArray((i = f(this, me)) == null ? void 0 : i.values) ? f(this, me).values : [];
    return {
      isNew: this.isNew,
      key: ((r = f(this, me)) == null ? void 0 : r.key) ?? "",
      label: ((a = f(this, me)) == null ? void 0 : a.label) ?? "",
      defaultValue: ((o = f(this, me)) == null ? void 0 : o.default) ?? "",
      values: t.map((s, l) => {
        var u;
        return {
          index: l,
          value: s,
          selected: s === ((u = f(this, me)) == null ? void 0 : u.default)
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
      keyIsCustom: f(this, Bt)
    };
  }
  _onRender(t, i) {
    var a, o, s, l, u, d;
    super._onRender(t, i);
    const r = (a = this.element) == null ? void 0 : a.querySelector("form");
    r && (r.addEventListener("submit", f(this, no)), (o = r.querySelector('[data-action="add-value"]')) == null || o.addEventListener("click", f(this, oo)), (s = r.querySelector('input[name="criterionLabel"]')) == null || s.addEventListener("input", f(this, io)), (l = r.querySelector('input[name="criterionKey"]')) == null || l.addEventListener("input", f(this, ro)), (u = r.querySelector('[data-action="reset-auto-key"]')) == null || u.addEventListener("click", f(this, ao)), r.querySelectorAll('[data-action="remove-value"]').forEach((m) => {
      m.addEventListener("click", f(this, sr));
    }), r.querySelectorAll('input[name="criterionValues"]').forEach((m) => {
      m.addEventListener("input", f(this, lr));
    }), (d = r.querySelector('[data-action="cancel"]')) == null || d.addEventListener("click", (m) => {
      m.preventDefault(), this.close();
    }), S(this, ke, Qr).call(this, r), S(this, ke, ji).call(this, r));
  }
};
me = new WeakMap(), Bt = new WeakMap(), ke = new WeakSet(), Au = /* @__PURE__ */ c(function() {
  const t = Is(this.criterion, 0, /* @__PURE__ */ new Set()) ?? Sl(v("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion"));
  return {
    id: t.id,
    key: t.key,
    label: t.label ?? "",
    values: Array.isArray(t.values) ? [...t.values] : [],
    default: t.default
  };
}, "#initializeState"), no = new WeakMap(), io = new WeakMap(), ro = new WeakMap(), ao = new WeakMap(), Qr = /* @__PURE__ */ c(function(t) {
  const i = t.querySelector('[data-action="reset-auto-key"]');
  i instanceof HTMLButtonElement && (i.disabled = !f(this, Bt));
}, "#syncAutoKeyButton"), oo = new WeakMap(), sr = new WeakMap(), lr = new WeakMap(), ji = /* @__PURE__ */ c(function(t) {
  var l, u;
  const i = t.querySelector('select[name="criterionDefault"]');
  if (!(i instanceof HTMLSelectElement)) return;
  const r = ((u = (l = i.value) == null ? void 0 : l.trim) == null ? void 0 : u.call(l)) ?? "", a = Array.from(t.querySelectorAll('input[name="criterionValues"]')).map((d) => d instanceof HTMLInputElement ? d.value.trim() : "").filter((d, m, g) => d && g.indexOf(d) === m), o = i.dataset.emptyLabel || v("EIDOLON.SceneCriteria.ValueListEmpty", "No values have been added to this criterion.");
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
}, "#syncDefaultOptions"), Nu = /* @__PURE__ */ c(async function() {
  if (!this.scene) return;
  const t = ct(this.scene).sort((r, a) => r.order - a.order), i = t.findIndex((r) => r.id === f(this, me).id);
  i < 0 ? (f(this, me).order = t.length, t.push(f(this, me))) : (f(this, me).order = t[i].order, t.splice(i, 1, f(this, me)));
  try {
    await po(this.scene, t), this.onSave && await this.onSave(f(this, me));
  } catch (r) {
    Ou(r);
  }
}, "#persist"), c(Rt, "CategoryEditorApplication"), pe(Rt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  De(Rt, Rt, "DEFAULT_OPTIONS"),
  {
    id: `${ve}-criterion-editor`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((qc = De(Rt, Rt, "DEFAULT_OPTIONS")) == null ? void 0 : qc.classes) ?? [], "standard-form", "themed"])
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
)), pe(Rt, "PARTS", {
  content: {
    template: `modules/${ve}/templates/scene-criteria-editor.html`
  }
});
let As = Rt;
function Ri(n) {
  return String(n ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "criterion";
}
c(Ri, "slugifyKey");
const Gf = `modules/${ve}/templates/scene-criteria-tab.html`, Ns = {
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
}, Wf = go(As), Jf = Eu({
  tabId: "criteria",
  tabLabel: /* @__PURE__ */ c(() => v("EIDOLON.SceneCriteria.TabLabel", "Criteria"), "tabLabel"),
  getScene: kt,
  isApplicable: /* @__PURE__ */ c(() => ho(), "isApplicable"),
  renderContent: /* @__PURE__ */ c(({ app: n, tab: e, scene: t }) => Yf(n, e, t), "renderContent"),
  logger: Ns
});
function Kf() {
  return Jf.register();
}
c(Kf, "registerSceneCriteriaConfigHook");
function Yf(n, e, t) {
  if (!(e instanceof HTMLElement)) return;
  const i = Ue(t) ? t : kt(n);
  di(n, e, i);
}
c(Yf, "renderCriteriaTab");
async function di(n, e, t) {
  var r, a;
  const i = t ?? kt(n);
  Ns.group("renderCriteriaTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!Ue(i)) {
      const d = v(
        "EIDOLON.SceneCriteria.Unavailable",
        "Scene criteria are unavailable for this configuration sheet."
      );
      e.innerHTML = `<p class="notes">${d}</p>`;
      return;
    }
    const o = ct(i).sort((d, m) => d.order - m.order), s = Ir(i, o), l = ((a = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : a.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof l != "function") {
      e.innerHTML = `<p class="notes">${v("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
      return;
    }
    const u = await l(Gf, {
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
        valueCount: o.reduce((d, m) => d + m.values.length, 0)
      },
      criteria: o.map((d, m) => {
        var g, h;
        return {
          id: d.id,
          label: d.label,
          displayName: ((h = (g = d.label) == null ? void 0 : g.trim) == null ? void 0 : h.call(g)) || v("EIDOLON.SceneCriteria.UnnamedCategory", "Unnamed Criterion"),
          hasValues: d.values.length > 0,
          values: d.values.map((y) => ({
            value: y,
            isCurrent: (s[d.key] ?? d.default) === y
          })),
          valueCountLabel: Xf(d.values.length),
          canMoveUp: m > 0,
          canMoveDown: m < o.length - 1
        };
      }),
      hasCriteria: o.length > 0
    });
    e.innerHTML = u, Qf(n, e, i);
  } catch (o) {
    console.error(`${ve} | Failed to render criteria tab`, o), e.innerHTML = `<p class="notes">${v("EIDOLON.SceneCriteria.CategoryListEmpty", "No criteria configured for this scene.")}</p>`;
  } finally {
    Ns.groupEnd();
  }
}
c(di, "renderCriteriaTabContent");
function Qf(n, e, t) {
  const i = t ?? kt(n);
  if (!Ue(i)) return;
  const r = e.querySelector('[data-criteria-action="add"]');
  r && r.addEventListener("click", () => {
    ic(n, {
      scene: i,
      criterion: Sl(
        v("EIDOLON.SceneCriteria.DefaultCategoryName", "New Criterion")
      ),
      isNew: !0,
      onSave: /* @__PURE__ */ c(() => di(n, e, i), "onSave")
    });
  }), e.querySelectorAll('[data-criteria-action="edit"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", () => {
      const s = ct(i).find((l) => l.id === o);
      s && ic(n, {
        scene: i,
        criterion: s,
        onSave: /* @__PURE__ */ c(() => di(n, e, i), "onSave")
      });
    });
  }), e.querySelectorAll('[data-criteria-action="remove"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await Ro(i, (l) => {
        const u = l.findIndex((d) => d.id === o);
        return u < 0 ? !1 : (l.splice(u, 1), Ho(l), !0);
      }) && await di(n, e, i);
    });
  }), e.querySelectorAll('[data-criteria-action="move-up"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await Ro(i, (l) => {
        const u = l.findIndex((m) => m.id === o);
        if (u <= 0) return !1;
        const [d] = l.splice(u, 1);
        return l.splice(u - 1, 0, d), Ho(l), !0;
      }) && await di(n, e, i);
    });
  }), e.querySelectorAll('[data-criteria-action="move-down"]').forEach((a) => {
    const o = a.dataset.criterionId;
    o && a.addEventListener("click", async () => {
      await Ro(i, (l) => {
        const u = l.findIndex((m) => m.id === o);
        if (u < 0 || u >= l.length - 1) return !1;
        const [d] = l.splice(u, 1);
        return l.splice(u + 1, 0, d), Ho(l), !0;
      }) && await di(n, e, i);
    });
  });
}
c(Qf, "bindCriteriaTabEvents");
async function Ro(n, e) {
  const t = ct(n).sort((r, a) => r.order - a.order);
  if (e(t) === !1) return !1;
  try {
    return await po(n, t), !0;
  } catch (r) {
    return Ou(r), !1;
  }
}
c(Ro, "mutateCriteria");
function ic(n, e = {}) {
  const t = e.scene ?? null, i = t && Ue(t) ? t : kt(n);
  if (!Ue(i))
    return;
  Wf({
    scene: i,
    criterion: e.criterion ?? null,
    isNew: !!e.isNew,
    onSave: typeof e.onSave == "function" ? e.onSave : null
  }).render({ force: !0 });
}
c(ic, "openCriterionEditor");
function Ho(n) {
  n.forEach((e, t) => {
    e.order = t;
  });
}
c(Ho, "reindexCriteriaOrder");
function Xf(n) {
  var e, t;
  if ((t = (e = game.i18n) == null ? void 0 : e.has) != null && t.call(e, "EIDOLON.SceneCriteria.ValueCountLabel"))
    try {
      return game.i18n.format("EIDOLON.SceneCriteria.ValueCountLabel", { count: n });
    } catch (i) {
      console.error(`${ve} | Failed to format value count label`, i);
    }
  return n === 0 ? "No values configured" : n === 1 ? "1 value" : `${n} values`;
}
c(Xf, "formatValueCount");
let rc = !1;
function Zf() {
  Hooks.once("init", () => {
    jf();
  }), Hooks.once("ready", () => {
    ho() && (rc || (Kf(), rc = !0));
  });
}
c(Zf, "registerSceneCriteriaHooks");
Zf();
const ne = T, Mu = "criteriaEngineVersion", Yn = "fileIndex", Qn = "tileCriteria", Cl = {
  LEGACY: 1,
  CRITERIA: 2
}, ku = Cl.CRITERIA;
function $u(n) {
  var e;
  return ((e = n == null ? void 0 : n.getFlag) == null ? void 0 : e.call(n, ne, Mu)) ?? Cl.LEGACY;
}
c($u, "getSceneEngineVersion");
function em(n, e, t, i, r) {
  if (!(n != null && n.length) || !(t != null && t.length)) return -1;
  const a = {};
  for (const s of t)
    a[s] = e[s];
  const o = ac(n, a, t);
  if (o >= 0) return o;
  if (i != null && i.length && r) {
    const s = { ...a };
    for (const l of i) {
      if (!(l in s)) continue;
      s[l] = r[l] ?? "Standard";
      const u = ac(n, s, t);
      if (u >= 0) return u;
    }
  }
  return -1;
}
c(em, "findBestMatch");
function ac(n, e, t) {
  return n.findIndex((i) => {
    for (const r of t)
      if (i[r] !== e[r]) return !1;
    return !0;
  });
}
c(ac, "findExactMatch");
function tm(n, e) {
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
c(tm, "findFileIndex");
function Xr(n) {
  return n && typeof n == "object" && !Array.isArray(n);
}
c(Xr, "isPlainObject$2");
function oc(n) {
  return n == null ? n : typeof structuredClone == "function" ? structuredClone(n) : JSON.parse(JSON.stringify(n));
}
c(oc, "deepClone");
function nm(n, e) {
  if (!e) return;
  const t = e.split(".").filter(Boolean);
  if (!t.length) return;
  let i = n;
  for (let r = 0; r < t.length - 1; r += 1) {
    if (!Xr(i == null ? void 0 : i[t[r]])) return;
    i = i[t[r]];
  }
  delete i[t.at(-1)];
}
c(nm, "deletePath");
function Du(n, e) {
  const t = oc(n ?? {});
  if (!Xr(e)) return t;
  for (const [i, r] of Object.entries(e)) {
    if (i.startsWith("-=") && r === !0) {
      nm(t, i.slice(2));
      continue;
    }
    Xr(r) && Xr(t[i]) ? t[i] = Du(t[i], r) : t[i] = oc(r);
  }
  return t;
}
c(Du, "fallbackMerge");
function im(n, e) {
  var t, i;
  return (t = foundry == null ? void 0 : foundry.utils) != null && t.mergeObject && ((i = foundry == null ? void 0 : foundry.utils) != null && i.deepClone) ? foundry.utils.mergeObject(n, foundry.utils.deepClone(e), {
    inplace: !1
  }) : Du(n, e);
}
c(im, "defaultMerge");
function rm(n, e) {
  if (!n) return !0;
  for (const t of Object.keys(n))
    if (n[t] !== e[t]) return !1;
  return !0;
}
c(rm, "criteriaMatch");
function Fu(n, e, t, i) {
  const r = i ?? im;
  let a = r({}, n ?? {});
  if (!(e != null && e.length)) return a;
  const o = [];
  for (let s = 0; s < e.length; s += 1) {
    const l = e[s];
    if (rm(l == null ? void 0 : l.criteria, t)) {
      const u = l != null && l.criteria ? Object.keys(l.criteria).length : 0;
      o.push({ specificity: u, index: s, delta: l == null ? void 0 : l.delta });
    }
  }
  o.sort((s, l) => s.specificity - l.specificity || s.index - l.index);
  for (const s of o)
    s.delta && (a = r(a, s.delta));
  return a;
}
c(Fu, "resolveRules");
function yo(n = null) {
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
c(yo, "canManageCriteria");
function am(n = null) {
  if (!yo(n))
    throw new Error(`${ne} | You do not have permission to manage scene criteria.`);
}
c(am, "requireCriteriaAccess");
const om = /* @__PURE__ */ c((...n) => console.log(`${ne} | criteria tiles:`, ...n), "log$1");
let ha = /* @__PURE__ */ new WeakMap(), pa = /* @__PURE__ */ new WeakMap();
const sc = 200;
function sm(n) {
  return n ? Number.isInteger(n.size) ? n.size : Array.isArray(n) || typeof n.length == "number" ? n.length : Array.from(n).length : 0;
}
c(sm, "getCollectionSize$1");
function xr() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
c(xr, "nowMs$2");
function lm(n) {
  if (!Array.isArray(n)) return [];
  const e = /* @__PURE__ */ new Set();
  for (const t of n) {
    if (typeof t != "string") continue;
    const i = t.trim();
    i && e.add(i);
  }
  return Array.from(e);
}
c(lm, "uniqueStringKeys$1");
function cm(n, e = sc) {
  if (!Array.isArray(n) || n.length === 0) return [];
  const t = Number.isInteger(e) && e > 0 ? e : sc, i = [];
  for (let r = 0; r < n.length; r += t)
    i.push(n.slice(r, r + t));
  return i;
}
c(cm, "chunkArray$1");
async function um(n, e, t) {
  const i = cm(e, t);
  for (const r of i)
    await n.updateEmbeddedDocuments("Tile", r), i.length > 1 && await Promise.resolve();
  return i.length;
}
c(um, "updateTilesInChunks");
function dm(n) {
  var i;
  const e = ni(n, { files: null });
  if (!((i = e == null ? void 0 : e.variants) != null && i.length)) return [];
  const t = /* @__PURE__ */ new Set();
  for (const r of e.variants)
    for (const a of Object.keys(r.criteria ?? {}))
      a && t.add(a);
  return Array.from(t);
}
c(dm, "getTileCriteriaDependencyKeys");
function fm(n, e) {
  const t = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
  for (const r of e) {
    const a = r.getFlag(ne, Qn) ?? r.getFlag(ne, Yn);
    if (a) {
      i.add(r.id);
      for (const o of dm(a))
        t.has(o) || t.set(o, /* @__PURE__ */ new Set()), t.get(o).add(r.id);
    }
  }
  return {
    collection: e,
    keyToTileIds: t,
    allTileIds: i
  };
}
c(fm, "buildTileDependencyIndex");
function mm(n, e) {
  const t = pa.get(n);
  if ((t == null ? void 0 : t.collection) === e) return t;
  const i = fm(n, e);
  return pa.set(n, i), i;
}
c(mm, "getTileDependencyIndex");
function gm(n, e, t) {
  const i = lm(t);
  if (!i.length)
    return Array.from(e ?? []);
  const r = mm(n, e), a = /* @__PURE__ */ new Set();
  for (const o of i) {
    const s = r.keyToTileIds.get(o);
    if (s)
      for (const l of s)
        a.add(l);
  }
  return a.size ? typeof (e == null ? void 0 : e.get) == "function" ? Array.from(a).map((o) => e.get(o)).filter(Boolean) : Array.from(e ?? []).filter((o) => a.has(o.id)) : [];
}
c(gm, "getTilesForChangedKeys");
function Pu(n) {
  return typeof (n == null ? void 0 : n.name) == "string" ? n.name : typeof (n == null ? void 0 : n.src) == "string" ? n.src : "";
}
c(Pu, "getFilePath");
function ya(n) {
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
c(ya, "normalizeFilePath");
function Ll(n) {
  if (!Array.isArray(n)) return [];
  const e = /* @__PURE__ */ new Map();
  return n.map((t, i) => {
    const r = ya(Pu(t)), a = r || `__index:${i}`, o = e.get(a) ?? 0;
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
c(Ll, "buildTileFileEntries");
function vn(n, e) {
  if (!Number.isInteger(e) || e < 0) return null;
  const i = Ll(n).find((r) => r.index === e);
  return i ? { ...i.target } : { indexHint: e };
}
c(vn, "createTileTargetFromIndex");
function bo(n) {
  if (!n || typeof n != "object") return null;
  const e = ya(n.path), t = Number(n.indexHint ?? n.fileIndex), i = Number(n.occurrence), r = {};
  return e && (r.path = e, r.occurrence = Number.isInteger(i) && i >= 0 ? i : 0), Number.isInteger(t) && t >= 0 && (r.indexHint = t), !r.path && !Number.isInteger(r.indexHint) ? null : r;
}
c(bo, "normalizeTileTarget");
function Zi(n, e) {
  const t = bo(n);
  if (!t) return -1;
  const i = Ll(e);
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
c(Zi, "resolveTileTargetIndex");
function En(n) {
  if (!n || typeof n != "object" || Array.isArray(n)) return {};
  const e = {};
  for (const [t, i] of Object.entries(n))
    typeof t != "string" || !t || typeof i != "string" || !i.trim() || (e[t] = i.trim());
  return e;
}
c(En, "sanitizeCriteria");
function hm(n) {
  return Object.entries(En(n)).sort(([t], [i]) => t.localeCompare(i)).map(([t, i]) => `${t}=${i}`).join("");
}
c(hm, "serializeCriteria");
function pm(n) {
  return Object.keys(En(n)).length;
}
c(pm, "getCriteriaSpecificity");
function ym(n, e) {
  const t = En(n), i = En(e);
  for (const [r, a] of Object.entries(t))
    if (r in i && i[r] !== a)
      return !1;
  return !0;
}
c(ym, "areCriteriaCompatible");
function bm(n, e) {
  const t = Zi(n, e);
  if (Number.isInteger(t) && t >= 0)
    return `index:${t}`;
  const i = bo(n);
  if (!i) return "";
  if (i.path) {
    const r = Number.isInteger(i.occurrence) ? i.occurrence : 0;
    return `path:${i.path}#${r}`;
  }
  return Number.isInteger(i.indexHint) ? `hint:${i.indexHint}` : "";
}
c(bm, "getTargetIdentity");
function _u(n, e = {}) {
  var s;
  const t = Array.isArray(e.files) ? e.files : [], i = ni(n, { files: t });
  if (!((s = i == null ? void 0 : i.variants) != null && s.length))
    return {
      errors: [],
      warnings: []
    };
  const r = i.variants.map((l, u) => ({
    index: u,
    criteria: En(l.criteria),
    specificity: pm(l.criteria),
    criteriaSignature: hm(l.criteria),
    targetIdentity: bm(l.target, t)
  })), a = [], o = [];
  for (let l = 0; l < r.length; l += 1) {
    const u = r[l];
    for (let d = l + 1; d < r.length; d += 1) {
      const m = r[d];
      if (u.specificity !== m.specificity || !ym(u.criteria, m.criteria)) continue;
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
c(_u, "detectTileCriteriaConflicts");
function wm(n, e) {
  if (!n || typeof n != "object") return null;
  let t = bo(n.target);
  if (!t) {
    const i = Number(n.fileIndex);
    Number.isInteger(i) && i >= 0 && (t = vn(e, i));
  }
  return t ? {
    criteria: En(n.criteria),
    target: t
  } : null;
}
c(wm, "normalizeTileVariant");
function xu(n, e = {}) {
  if (!Array.isArray(n) || n.length === 0) return null;
  const t = Array.isArray(e.files) ? e.files : null, i = n.map((l, u) => ({
    criteria: En(l),
    target: vn(t, u)
  })).filter((l) => l.target);
  if (!i.length) return null;
  const r = i.find((l) => Object.keys(l.criteria).length === 0), a = (r == null ? void 0 : r.target) ?? i[0].target;
  let o = null;
  const s = Number(e.defaultFileIndex);
  return Number.isInteger(s) && s >= 0 && (o = vn(t, s)), o || (o = a), {
    strategy: "select-one",
    variants: i,
    defaultTarget: o
  };
}
c(xu, "buildTileCriteriaFromFileIndex");
function ni(n, e = {}) {
  const t = Array.isArray(e.files) ? e.files : null;
  if (Array.isArray(n))
    return xu(n, { files: t });
  if (!n || typeof n != "object") return null;
  const i = Array.isArray(n.variants) ? n.variants.map((a) => wm(a, t)).filter(Boolean) : [];
  if (!i.length) return null;
  let r = bo(n.defaultTarget);
  if (!r) {
    const a = Number(n.defaultFileIndex);
    Number.isInteger(a) && a >= 0 && (r = vn(t, a));
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
c(ni, "normalizeTileCriteria");
function vm(n, e) {
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
c(vm, "selectTileFileIndexFromCompiled");
function Em(n, e) {
  const t = ni(n, { files: e });
  if (!t) return null;
  const i = t.variants.map((a) => {
    const o = En(a.criteria), s = Zi(a.target, e);
    return !Number.isInteger(s) || s < 0 ? null : {
      criteria: o,
      keys: Object.keys(o),
      targetIndex: s
    };
  }).filter(Boolean), r = Zi(t.defaultTarget, e);
  return !i.length && (!Number.isInteger(r) || r < 0) ? null : {
    variants: i,
    defaultIndex: r
  };
}
c(Em, "compileTileMatcher");
function Sm(n, e, t) {
  const i = ha.get(n);
  if (i && i.tileCriteria === e && i.files === t)
    return i.compiled;
  const r = Em(e, t);
  return ha.set(n, {
    tileCriteria: e,
    files: t,
    compiled: r
  }), r;
}
c(Sm, "getCompiledTileMatcher");
function Tm(n = null, e = null) {
  n ? pa.delete(n) : pa = /* @__PURE__ */ new WeakMap(), e ? ha.delete(e) : n || (ha = /* @__PURE__ */ new WeakMap());
}
c(Tm, "invalidateTileCriteriaCaches");
async function Ru(n, e, t = {}) {
  var l, u, d, m;
  const i = xr(), r = {
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
    return r.durationMs = xr() - i, r;
  const a = e.getEmbeddedCollection("Tile") ?? [];
  r.total = sm(a);
  const o = gm(e, a, t.changedKeys);
  if (r.scanned = o.length, !o.length)
    return r.skipped.unaffected = r.total, r.durationMs = xr() - i, r;
  const s = [];
  for (const g of o) {
    const h = g.getFlag(ne, Qn) ?? g.getFlag(ne, Yn);
    if (!h) {
      r.skipped.noCriteria += 1;
      continue;
    }
    const y = g.getFlag("monks-active-tiles", "files");
    if (!(y != null && y.length)) {
      r.skipped.noFiles += 1;
      continue;
    }
    const p = Sm(g, h, y), w = vm(p, n);
    if (!Number.isInteger(w) || w < 0 || w >= y.length) {
      console.warn(`${ne} | Tile ${g.id} has no valid file match for state`, n), r.skipped.noMatch += 1;
      continue;
    }
    const b = w + 1, L = Number(g.getFlag("monks-active-tiles", "fileindex")) !== b, A = y.some((_, P) => !!(_ != null && _.selected) != (P === w)), $ = ya(((u = g.texture) == null ? void 0 : u.src) ?? ((m = (d = g._source) == null ? void 0 : d.texture) == null ? void 0 : m.src) ?? ""), k = Pu(y[w]), D = ya(k), J = !!D && D !== $;
    if (!A && !L && !J) {
      r.skipped.unchanged += 1;
      continue;
    }
    const K = {
      _id: g._id
    };
    A && (K["flags.monks-active-tiles.files"] = y.map((_, P) => ({
      ..._,
      selected: P === w
    }))), L && (K["flags.monks-active-tiles.fileindex"] = b), J && (K.texture = { src: k }), s.push(K), om(`Tile ${g.id} -> ${k}`);
  }
  return s.length > 0 && (r.chunks = await um(e, s, t.chunkSize), r.updated = s.length), r.durationMs = xr() - i, r;
}
c(Ru, "updateTiles");
function Cm() {
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
c(Cm, "buildLightControlsMap");
const Xn = T, bi = "lightCriteria", Il = Object.freeze({
  base: null,
  mappings: [],
  current: null
});
function qo(n) {
  return n && typeof n == "object" && !Array.isArray(n);
}
c(qo, "isPlainObject$1");
function Hu(n, e) {
  if (!qo(e)) return {};
  const t = {};
  for (const [i, r] of Object.entries(e)) {
    const a = n == null ? void 0 : n[i];
    if (qo(r) && qo(a)) {
      const o = Hu(a, r);
      Object.keys(o).length > 0 && (t[i] = o);
    } else r !== a && (t[i] = Mt(r));
  }
  return t;
}
c(Hu, "computeDelta");
function qu(n) {
  var t;
  const e = ((t = n == null ? void 0 : n.getFlag) == null ? void 0 : t.call(n, Xn, bi)) ?? Il;
  return er(e);
}
c(qu, "getLightCriteriaState");
async function ju(n, e) {
  const t = er(e);
  if (!(n != null && n.setFlag))
    return t;
  const i = t.base !== null, r = t.mappings.length > 0, a = t.current !== null;
  return !i && !r && !a ? (typeof n.unsetFlag == "function" ? await n.unsetFlag(Xn, bi) : await n.setFlag(Xn, bi, null), Il) : (await n.setFlag(Xn, bi, t), t);
}
c(ju, "setLightCriteriaState");
async function Or(n, e) {
  if (typeof e != "function")
    throw new TypeError("updateLightCriteriaState requires an updater function.");
  const t = Mt(qu(n)), i = await e(t);
  return ju(n, i);
}
c(Or, "updateLightCriteriaState");
async function lc(n, e) {
  const t = ii(e);
  if (!t)
    throw new Error("Invalid light configuration payload.");
  return Or(n, (i) => ({
    ...i,
    base: t
  }));
}
c(lc, "storeBaseLighting");
async function cc(n, e, t, { label: i } = {}) {
  const r = Ar(e);
  if (!r)
    throw new Error("Cannot create a mapping without at least one category selection.");
  const a = ii(t);
  if (!a)
    throw new Error("Invalid light configuration payload.");
  return Or(n, (o) => {
    const s = $i(r), l = Array.isArray(o == null ? void 0 : o.mappings) ? [...o.mappings] : [], u = l.findIndex((h) => (h == null ? void 0 : h.key) === s), d = u >= 0 ? l[u] : null, m = typeof (d == null ? void 0 : d.id) == "string" && d.id.trim() ? d.id.trim() : Uu(), g = wo({
      id: m,
      categories: r,
      config: a,
      label: typeof i == "string" ? i : (d == null ? void 0 : d.label) ?? null,
      updatedAt: Date.now()
    });
    if (!g)
      throw new Error("Failed to sanitize criteria mapping entry.");
    return u >= 0 ? l[u] = g : l.push(g), {
      ...o,
      mappings: l
    };
  });
}
c(cc, "upsertLightCriteriaMapping");
async function Lm(n, e, t, i, { replaceExisting: r = !1 } = {}) {
  const a = typeof e == "string" ? e.trim() : "";
  if (!a)
    throw new Error("A mapping id is required to retarget criteria.");
  const o = Ar(t);
  if (!o)
    throw new Error("Cannot retarget mapping without at least one category selection.");
  const s = ii(i);
  if (!s)
    throw new Error("Invalid light configuration payload.");
  return Or(n, (l) => {
    const u = Array.isArray(l == null ? void 0 : l.mappings) ? [...l.mappings] : [], d = u.findIndex((b) => (b == null ? void 0 : b.id) === a);
    if (d < 0)
      throw new Error("The selected mapping no longer exists.");
    const m = $i(o), g = u.findIndex(
      (b, E) => E !== d && (b == null ? void 0 : b.key) === m
    );
    if (g >= 0 && !r)
      throw new Error("A mapping already exists for the selected criteria.");
    const h = u[d], y = wo({
      ...h,
      id: a,
      categories: o,
      config: s,
      updatedAt: Date.now()
    });
    if (!y)
      throw new Error("Failed to sanitize updated mapping.");
    u[d] = y;
    let p = null;
    if (g >= 0) {
      const [b] = u.splice(g, 1);
      p = (b == null ? void 0 : b.id) ?? null;
    }
    let w = (l == null ? void 0 : l.current) ?? null;
    return w && typeof w == "object" && (w.mappingId === a ? w = {
      ...w,
      mappingId: a,
      categories: o,
      updatedAt: Date.now()
    } : p && w.mappingId === p && (w = {
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
c(Lm, "retargetLightCriteriaMapping");
async function Im(n, e) {
  const t = typeof e == "string" ? e.trim() : "";
  if (!t)
    throw new Error("A mapping id is required to remove a mapping.");
  return Or(n, (i) => {
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
c(Im, "removeLightCriteriaMapping");
async function Gi(n, e) {
  const t = Bu(e);
  return Or(n, (i) => ({
    ...i,
    current: t
  }));
}
c(Gi, "storeCurrentCriteriaSelection");
function Om(n) {
  const e = er(n), t = e.base ?? {}, i = [];
  for (const r of e.mappings) {
    const a = Ar(r == null ? void 0 : r.categories);
    if (!a) continue;
    const o = Hu(t, (r == null ? void 0 : r.config) ?? {});
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
c(Om, "convertLightCriteriaStateToPresets");
function Am(n, e = []) {
  const t = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
  for (const l of e)
    typeof (l == null ? void 0 : l.key) == "string" && l.key.trim() && i.add(l.key.trim()), typeof (l == null ? void 0 : l.id) == "string" && l.id.trim() && typeof (l == null ? void 0 : l.key) == "string" && t.set(l.id.trim(), l.key.trim());
  const r = er(n), a = /* @__PURE__ */ c((l) => {
    const u = {};
    for (const [d, m] of Object.entries(l ?? {})) {
      const g = String(d ?? "").trim(), h = typeof m == "string" ? m.trim() : "";
      if (!g || !h) continue;
      if (i.has(g)) {
        u[g] = h;
        continue;
      }
      const y = t.get(g);
      y && (u[y] = h);
    }
    return Object.keys(u).length ? u : null;
  }, "remapCategories"), o = r.mappings.map((l) => {
    const u = a(l.categories);
    return u ? wo({
      ...l,
      categories: u,
      key: $i(u)
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
  return er({
    ...r,
    mappings: o,
    current: s
  });
}
c(Am, "migrateLightCriteriaCategoriesToKeys");
function er(n) {
  var l;
  const e = Mt(n);
  if (!e || typeof e != "object")
    return Mt(Il);
  const t = ii(e.base), i = Array.isArray(e.mappings) ? e.mappings : [], r = /* @__PURE__ */ new Map();
  for (const u of i) {
    const d = wo(u);
    d && r.set(d.key, d);
  }
  const a = Array.from(r.values()), o = new Map(a.map((u) => [u.id, u]));
  let s = Bu(e.current);
  if (s) {
    const u = s.categories && Object.keys(s.categories).length > 0;
    if (s.mappingId && !o.has(s.mappingId)) {
      const d = u ? ((l = a.find((m) => m.key === $i(s.categories))) == null ? void 0 : l.id) ?? null : null;
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
c(er, "sanitizeLightCriteriaState");
function ii(n) {
  const e = Mt(n);
  if (!e || typeof e != "object") return null;
  "_id" in e && delete e._id, "id" in e && delete e.id;
  const t = e.flags;
  if (t && typeof t == "object") {
    const i = t[Xn];
    i && typeof i == "object" && (delete i[bi], Object.keys(i).length === 0 && delete t[Xn]), Object.keys(t).length === 0 && delete e.flags;
  }
  return e;
}
c(ii, "sanitizeLightConfigPayload");
function wo(n) {
  if (!n || typeof n != "object") return null;
  const e = Ar(n.categories);
  if (!e) return null;
  const t = ii(n.config);
  if (!t) return null;
  const i = typeof n.id == "string" && n.id.trim() ? n.id.trim() : Uu(), r = $i(e), a = {
    id: i,
    key: r,
    categories: e,
    config: t,
    updatedAt: Number.isFinite(n.updatedAt) ? Number(n.updatedAt) : Date.now()
  };
  return typeof n.label == "string" && n.label.trim() && (a.label = n.label.trim()), a;
}
c(wo, "sanitizeCriteriaMappingEntry");
function Bu(n) {
  if (!n || typeof n != "object") return null;
  const e = typeof n.mappingId == "string" && n.mappingId.trim() ? n.mappingId.trim() : null, t = Ar(n.categories);
  return !e && !t ? null : {
    mappingId: e,
    categories: t,
    updatedAt: Number.isFinite(n.updatedAt) ? Number(n.updatedAt) : Date.now()
  };
}
c(Bu, "sanitizeCurrentSelection");
function Ar(n) {
  const e = {};
  if (Array.isArray(n))
    for (const t of n) {
      const i = uc((t == null ? void 0 : t.id) ?? (t == null ? void 0 : t.categoryId) ?? (t == null ? void 0 : t.category)), r = dc((t == null ? void 0 : t.value) ?? (t == null ? void 0 : t.selection) ?? (t == null ? void 0 : t.label));
      !i || !r || (e[i] = r);
    }
  else if (n && typeof n == "object")
    for (const [t, i] of Object.entries(n)) {
      const r = uc(t), a = dc(i);
      !r || !a || (e[r] = a);
    }
  return Object.keys(e).length > 0 ? e : null;
}
c(Ar, "sanitizeCriteriaCategories");
function $i(n) {
  if (!n || typeof n != "object") return "";
  const e = Object.entries(n).filter(([, t]) => typeof t == "string" && t).map(([t, i]) => `${t}:${i}`);
  return e.sort((t, i) => t < i ? -1 : t > i ? 1 : 0), e.join("|");
}
c($i, "computeCriteriaMappingKey");
function Uu() {
  var n;
  return (n = foundry == null ? void 0 : foundry.utils) != null && n.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
c(Uu, "generateLightMappingId");
function uc(n) {
  if (typeof n != "string") return null;
  const e = n.trim();
  return e || null;
}
c(uc, "normalizeCategoryId");
function dc(n) {
  if (typeof n != "string") return null;
  const e = n.trim();
  return e || null;
}
c(dc, "normalizeCategoryValue");
const ba = ["AmbientLight", "Wall", "AmbientSound"];
let wa = /* @__PURE__ */ new WeakMap(), va = /* @__PURE__ */ new WeakMap();
const fc = 200;
function Nm(n) {
  return n ? Number.isInteger(n.size) ? n.size : Array.isArray(n) || typeof n.length == "number" ? n.length : Array.from(n).length : 0;
}
c(Nm, "getCollectionSize");
function jo() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
c(jo, "nowMs$1");
function Mm(n) {
  if (!Array.isArray(n)) return [];
  const e = /* @__PURE__ */ new Set();
  for (const t of n) {
    if (typeof t != "string") continue;
    const i = t.trim();
    i && e.add(i);
  }
  return Array.from(e);
}
c(Mm, "uniqueStringKeys");
function km(n, e = fc) {
  if (!Array.isArray(n) || n.length === 0) return [];
  const t = Number.isInteger(e) && e > 0 ? e : fc, i = [];
  for (let r = 0; r < n.length; r += t)
    i.push(n.slice(r, r + t));
  return i;
}
c(km, "chunkArray");
async function $m(n, e, t, i) {
  const r = km(t, i);
  for (const a of r)
    await n.updateEmbeddedDocuments(e, a), r.length > 1 && await Promise.resolve();
  return r.length;
}
c($m, "updatePlaceablesInChunks");
function Dm(n) {
  const e = /* @__PURE__ */ new Set();
  for (const t of (n == null ? void 0 : n.rules) ?? [])
    for (const i of Object.keys((t == null ? void 0 : t.criteria) ?? {}))
      i && e.add(i);
  return Array.from(e);
}
c(Dm, "getPresetDependencyKeys");
function Fm(n, e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of ba) {
    const r = e.get(i) ?? [], a = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Map();
    for (const s of r) {
      const l = zu(s, i);
      if (l != null && l.base) {
        a.add(s.id);
        for (const u of Dm(l))
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
c(Fm, "buildPlaceableDependencyIndex");
function Pm(n, e) {
  const t = va.get(n);
  if (t && ba.every((r) => t.collectionsByType.get(r) === e.get(r)))
    return t;
  const i = Fm(n, e);
  return va.set(n, i), i;
}
c(Pm, "getPlaceableDependencyIndex");
function _m(n, e, t) {
  if (!e || !n) return [];
  const i = Mm(t);
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
c(_m, "getDocsForChangedKeys");
function fi(n) {
  return !!n && typeof n == "object" && !Array.isArray(n);
}
c(fi, "isPlainObject");
function Ms(n, e) {
  if (Object.is(n, e)) return !0;
  if (Array.isArray(n) || Array.isArray(e)) {
    if (!Array.isArray(n) || !Array.isArray(e) || n.length !== e.length) return !1;
    for (let t = 0; t < n.length; t += 1)
      if (!Ms(n[t], e[t])) return !1;
    return !0;
  }
  if (fi(n) || fi(e)) {
    if (!fi(n) || !fi(e)) return !1;
    const t = Object.keys(e);
    for (const i of t)
      if (!Ms(n[i], e[i])) return !1;
    return !0;
  }
  return !1;
}
c(Ms, "areValuesEqual");
function Vu(n, e) {
  const t = { _id: e._id };
  for (const [r, a] of Object.entries(e)) {
    if (r === "_id") continue;
    const o = n == null ? void 0 : n[r];
    if (fi(a) && fi(o)) {
      const s = Vu(o, { _id: e._id, ...a });
      if (!s) continue;
      const l = Object.keys(s).filter((u) => u !== "_id");
      if (l.length > 0) {
        t[r] = {};
        for (const u of l)
          t[r][u] = s[u];
      }
      continue;
    }
    Ms(o, a) || (t[r] = a);
  }
  return Object.keys(t).filter((r) => r !== "_id").length > 0 ? t : null;
}
c(Vu, "buildChangedPayload");
function zu(n, e) {
  var s;
  const t = ((s = n == null ? void 0 : n.flags) == null ? void 0 : s[ne]) ?? {}, i = (t == null ? void 0 : t.presets) ?? null, r = e === "AmbientLight" ? (t == null ? void 0 : t.lightCriteria) ?? null : null, a = wa.get(n);
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
    const l = Om(t.lightCriteria);
    (l.base && Object.keys(l.base).length > 0 || l.rules.length > 0) && (o = {
      base: l.base,
      rules: l.rules
    });
  }
  return wa.set(n, {
    type: e,
    rawPresets: i,
    rawLightCriteria: r,
    presets: o
  }), o;
}
c(zu, "getPresetsForDocument");
function xm(n = null, e = null) {
  n ? va.delete(n) : va = /* @__PURE__ */ new WeakMap(), e ? wa.delete(e) : n || (wa = /* @__PURE__ */ new WeakMap());
}
c(xm, "invalidatePlaceableCriteriaCaches");
async function Gu(n, e, t = {}) {
  var l, u;
  const i = jo(), r = {
    total: 0,
    scanned: 0,
    updated: 0,
    chunks: 0,
    byType: {},
    durationMs: 0
  };
  if (e = e ?? ((l = game.scenes) == null ? void 0 : l.viewed), !e)
    return r.durationMs = jo() - i, r;
  const a = new Set(Cm()), o = new Map(
    ba.map((d) => [d, e.getEmbeddedCollection(d) ?? []])
  ), s = Pm(e, o);
  for (const d of ba) {
    const m = o.get(d) ?? [], g = {
      total: Nm(m),
      scanned: 0,
      updated: 0,
      chunks: 0
    }, h = s.byType.get(d) ?? null, y = _m(m, h, t.changedKeys);
    if (g.scanned = y.length, r.total += g.total, r.scanned += g.scanned, r.byType[d] = g, !y.length) continue;
    const p = [];
    for (const w of y) {
      const b = zu(w, d);
      if (!(b != null && b.base)) continue;
      const E = Fu(b.base, b.rules ?? [], n);
      E._id = w._id, d === "AmbientLight" && a.has(w._id) && (E.hidden = !0);
      const L = (w == null ? void 0 : w._source) ?? ((u = w == null ? void 0 : w.toObject) == null ? void 0 : u.call(w)) ?? {}, A = Vu(L, E);
      A && p.push(A);
    }
    p.length > 0 && (g.chunks = await $m(e, d, p, t.chunkSize), g.updated = p.length, r.updated += p.length, r.chunks += g.chunks, console.log(`${ne} | Updated ${p.length} ${d}(s)`));
  }
  return r.durationMs = jo() - i, r;
}
c(Gu, "updatePlaceables");
function Ea() {
  return typeof (performance == null ? void 0 : performance.now) == "function" ? performance.now() : Date.now();
}
c(Ea, "nowMs");
const Rr = /* @__PURE__ */ new Map();
function Rm(n) {
  var e;
  return n = n ?? ((e = game.scenes) == null ? void 0 : e.viewed), n ? Ir(n) : null;
}
c(Rm, "getState");
async function Hm(n, e, t = 0) {
  var h;
  const i = Ea();
  if (e = e ?? ((h = game.scenes) == null ? void 0 : h.viewed), !e) return null;
  am(e);
  const r = ct(e);
  if (!r.length)
    return console.warn(`${ne} | applyState skipped: scene has no criteria.`), null;
  const a = Ir(e, r), o = Tl({ ...a, ...n ?? {} }, r), s = r.filter((y) => (a == null ? void 0 : a[y.key]) !== (o == null ? void 0 : o[y.key])).map((y) => y.key), l = s.length > 0;
  l && await Uf(e, o, r);
  const u = l ? o : a, [d, m] = await Promise.all([
    Ru(u, e, { changedKeys: s }),
    Gu(u, e, { changedKeys: s })
  ]), g = Ea() - i;
  return O("Criteria apply telemetry", {
    sceneId: e.id,
    changedKeys: s,
    didChange: l,
    queuedMs: t,
    durationMs: g,
    tiles: d,
    placeables: m
  }), Hooks.callAll("eidolon-utilities.criteriaStateApplied", e, u), u;
}
c(Hm, "applyStateInternal");
async function Wu(n, e) {
  var l;
  if (e = e ?? ((l = game.scenes) == null ? void 0 : l.viewed), !e) return null;
  const t = e.id ?? "__viewed__", i = Ea(), r = Rr.get(t) ?? Promise.resolve();
  let a = null;
  const o = r.catch(() => null).then(async () => {
    const u = Ea() - i;
    return Hm(n, e, u);
  });
  a = o;
  const s = o.finally(() => {
    Rr.get(t) === s && Rr.delete(t);
  });
  return Rr.set(t, s), a;
}
c(Wu, "applyState$1");
function qm(n) {
  var e;
  return n = n ?? ((e = game.scenes) == null ? void 0 : e.viewed), n ? $u(n) : null;
}
c(qm, "getVersion");
async function Ju(n, e) {
  var t;
  e = e ?? ((t = game.scenes) == null ? void 0 : t.viewed), e != null && e.setFlag && await e.setFlag(ne, Mu, Number(n));
}
c(Ju, "setVersion");
async function jm(n) {
  return Ju(ku, n);
}
c(jm, "markCurrentVersion");
const Bi = "Standard", Bm = /* @__PURE__ */ c((...n) => console.log(`${ne} | criteria indexer:`, ...n), "log");
function Ol(n) {
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
c(Ol, "parseFileTags");
function Um(n, e, t = Bi) {
  return n != null && n.length ? n.map((i) => {
    const r = Ol(i == null ? void 0 : i.name);
    if (!r) return {};
    const a = {};
    for (const [o, s] of Object.entries(e)) {
      const l = r[Number(o)];
      l != null && l !== t && (a[s] = l);
    }
    return a;
  }) : [];
}
c(Um, "buildFileIndex");
function Vm(n, e) {
  return n.map((t, i) => {
    const r = [...e[t] ?? /* @__PURE__ */ new Set()].sort(), o = r.includes(Bi) ? Bi : r[0] ?? Bi, s = Sl(t);
    return s.key = t, s.label = t.charAt(0).toUpperCase() + t.slice(1), s.values = r.length ? r : [Bi], s.default = s.values.includes(o) ? o : s.values[0], s.order = i, s;
  });
}
c(Vm, "buildCriteriaDefinitions");
async function Hr(n, e, t, { dryRun: i = !1 } = {}) {
  const r = n.getFlag("monks-active-tiles", "files");
  if (!(r != null && r.length)) return null;
  const a = Um(r, e), o = xu(a, { files: r });
  for (const s of r) {
    const l = Ol(s == null ? void 0 : s.name);
    if (l)
      for (const [u, d] of Object.entries(e)) {
        const m = l[Number(u)];
        m != null && t[d] && t[d].add(m);
      }
  }
  return i || (await n.setFlag(ne, Qn, o), typeof n.unsetFlag == "function" && await n.unsetFlag(ne, Yn)), { files: r.length };
}
c(Hr, "indexTile");
async function zm(n, e = {}) {
  var E, L, A, $;
  const {
    dryRun: t = !1,
    force: i = !1
  } = e;
  if (n = n ?? ((E = game.scenes) == null ? void 0 : E.viewed), !n) throw new Error("No scene provided to indexScene.");
  if (!globalThis.Tagger) throw new Error("Tagger is required to index scene criteria.");
  if (!i && $u(n) >= ku)
    throw new Error(
      `Scene "${n.name}" is already criteria-indexed. Use force: true to re-index.`
    );
  const r = { sceneId: n.id }, a = Tagger.getByTag("Map", r) ?? [];
  if (!a.length) throw new Error("No Map tile found.");
  if (a.length > 1) throw new Error(`Expected 1 Map tile, found ${a.length}.`);
  const o = a[0], s = o.getFlag("monks-active-tiles", "files");
  if (!(s != null && s.length)) throw new Error("Map tile has no MATT files.");
  const l = Ol((L = s[0]) == null ? void 0 : L.name);
  if (!(l != null && l.length))
    throw new Error(`Cannot parse bracket tags from: ${((A = s[0]) == null ? void 0 : A.name) ?? "<unknown>"}`);
  if (l.length < 3)
    throw new Error(`Expected 3+ bracket tags, found ${l.length}.`);
  const u = Tagger.getByTag("Floor", r) ?? [], d = Tagger.getByTag("Roof", r) ?? [], m = Tagger.getByTag("Weather", r) ?? [];
  let g;
  const h = [];
  l.length >= 4 ? (g = { 0: "mood", 1: "stage", 2: "variant", 3: "effect" }, h.push("mood", "stage", "variant", "effect")) : (g = { 0: "mood", 1: "variant", 2: "effect" }, h.push("mood", "variant", "effect"));
  const y = { 1: "effect" }, p = {};
  for (const k of h)
    p[k] = /* @__PURE__ */ new Set();
  const w = {
    map: null,
    floor: [],
    roof: [],
    weather: []
  };
  w.map = await Hr(o, g, p, { dryRun: t });
  for (const k of u) {
    const D = await Hr(k, g, p, { dryRun: t });
    D && w.floor.push(D);
  }
  for (const k of d) {
    const D = await Hr(k, g, p, { dryRun: t });
    D && w.roof.push(D);
  }
  for (const k of m) {
    const D = await Hr(k, y, p, { dryRun: t });
    D && w.weather.push(D);
  }
  const b = Vm(h, p);
  return t || (await po(n, b), await jm(n)), Bm(
    t ? "Dry run complete" : "Indexing complete",
    `- ${b.length} criteria,`,
    `${(($ = w.map) == null ? void 0 : $.files) ?? 0} map files`
  ), {
    criteria: b,
    state: b.reduce((k, D) => (k[D.key] = D.default, k), {}),
    tiles: w,
    overlayMode: m.length > 0
  };
}
c(zm, "indexScene");
var jc, Pe, ot, st, Vn, Je, At, an, so, se, Ku, Yu, Qu, $s, Xu, Ds, Zu, Ui, Fs;
const mt = class mt extends In(Ln) {
  constructor(t = {}) {
    var i;
    super(t);
    I(this, se);
    I(this, Pe, null);
    I(this, ot, []);
    I(this, st, {});
    I(this, Vn, !1);
    I(this, Je, null);
    I(this, At, null);
    I(this, an, null);
    I(this, so, 120);
    this.setScene(t.scene ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null);
  }
  setScene(t) {
    var i;
    C(this, Pe, t ?? ((i = game.scenes) == null ? void 0 : i.viewed) ?? null), S(this, se, Ku).call(this);
  }
  get scene() {
    return f(this, Pe);
  }
  async _prepareContext() {
    var r;
    const t = !!f(this, Pe), i = t && f(this, ot).length > 0;
    return {
      hasScene: t,
      hasCriteria: i,
      sceneName: ((r = f(this, Pe)) == null ? void 0 : r.name) ?? v("EIDOLON.CriteriaSwitcher.NoScene", "No active scene"),
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
      criteria: f(this, ot).map((a) => ({
        key: a.key,
        label: a.label || a.key,
        values: a.values.map((o) => {
          var s;
          return {
            value: o,
            selected: ((s = f(this, st)) == null ? void 0 : s[a.key]) === o
          };
        }),
        defaultValue: a.default
      })),
      stateSummary: S(this, se, Fs).call(this)
    };
  }
  _onRender(t, i) {
    super._onRender(t, i), S(this, se, Yu).call(this), S(this, se, Qu).call(this);
  }
  async _onClose(t) {
    return f(this, Je) !== null && (clearTimeout(f(this, Je)), C(this, Je, null)), f(this, an) !== null && (Hooks.off("eidolon-utilities.criteriaStateApplied", f(this, an)), C(this, an, null)), super._onClose(t);
  }
};
Pe = new WeakMap(), ot = new WeakMap(), st = new WeakMap(), Vn = new WeakMap(), Je = new WeakMap(), At = new WeakMap(), an = new WeakMap(), so = new WeakMap(), se = new WeakSet(), Ku = /* @__PURE__ */ c(function() {
  if (!f(this, Pe)) {
    C(this, ot, []), C(this, st, {});
    return;
  }
  C(this, ot, ct(f(this, Pe)).sort((t, i) => t.order - i.order)), C(this, st, Ir(f(this, Pe), f(this, ot)));
}, "#hydrateFromScene"), Yu = /* @__PURE__ */ c(function() {
  var i, r;
  const t = this.element;
  t instanceof HTMLElement && (t.querySelectorAll("[data-criteria-key]").forEach((a) => {
    a.addEventListener("change", (o) => {
      const s = o.currentTarget;
      if (!(s instanceof HTMLSelectElement)) return;
      const l = s.dataset.criteriaKey;
      l && (C(this, st, {
        ...f(this, st),
        [l]: s.value
      }), S(this, se, Xu).call(this, { [l]: s.value }));
    });
  }), (i = t.querySelector("[data-action='reset-defaults']")) == null || i.addEventListener("click", () => {
    S(this, se, Zu).call(this);
  }), (r = t.querySelector("[data-action='close-switcher']")) == null || r.addEventListener("click", () => {
    this.close();
  }));
}, "#bindEvents"), Qu = /* @__PURE__ */ c(function() {
  f(this, an) === null && C(this, an, Hooks.on("eidolon-utilities.criteriaStateApplied", (t, i) => {
    !f(this, Pe) || (t == null ? void 0 : t.id) !== f(this, Pe).id || f(this, Vn) || (C(this, st, { ...i ?? {} }), this.render({ force: !0 }));
  }));
}, "#ensureSyncHook"), $s = /* @__PURE__ */ c(async function(t) {
  var i, r;
  if (f(this, Pe)) {
    S(this, se, Ui).call(this, "applying"), C(this, Vn, !0);
    try {
      const a = await Wu(t, f(this, Pe));
      a && C(this, st, a), S(this, se, Ui).call(this, "ready"), this.render({ force: !0 });
    } catch (a) {
      console.error(`${ne} | Failed to apply criteria state`, a), (r = (i = ui.notifications) == null ? void 0 : i.error) == null || r.call(
        i,
        v(
          "EIDOLON.CriteriaSwitcher.ApplyError",
          "Failed to apply the selected criteria state."
        )
      ), S(this, se, Ui).call(this, "error", (a == null ? void 0 : a.message) ?? "Unknown error");
    } finally {
      C(this, Vn, !1), f(this, At) && S(this, se, Ds).call(this);
    }
  }
}, "#applyPartialState"), Xu = /* @__PURE__ */ c(function(t) {
  C(this, At, {
    ...f(this, At) ?? {},
    ...t ?? {}
  }), f(this, Je) !== null && clearTimeout(f(this, Je)), S(this, se, Ui).call(this, "applying"), C(this, Je, setTimeout(() => {
    C(this, Je, null), S(this, se, Ds).call(this);
  }, f(this, so)));
}, "#queuePartialState"), Ds = /* @__PURE__ */ c(async function() {
  if (f(this, Vn) || !f(this, At)) return;
  const t = f(this, At);
  C(this, At, null), await S(this, se, $s).call(this, t);
}, "#flushPendingState"), Zu = /* @__PURE__ */ c(async function() {
  if (!f(this, ot).length) return;
  const t = f(this, ot).reduce((i, r) => (i[r.key] = r.default, i), {});
  C(this, st, t), f(this, Je) !== null && (clearTimeout(f(this, Je)), C(this, Je, null)), C(this, At, null), await S(this, se, $s).call(this, t);
}, "#resetToDefaults"), Ui = /* @__PURE__ */ c(function(t, i = "") {
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
        a.textContent = `${v("EIDOLON.CriteriaSwitcher.Ready", "Ready")}: ${S(this, se, Fs).call(this)}`;
        break;
    }
}, "#setStatus"), Fs = /* @__PURE__ */ c(function() {
  return f(this, ot).length ? `[${f(this, ot).map((t) => {
    var i;
    return ((i = f(this, st)) == null ? void 0 : i[t.key]) ?? t.default;
  }).join(" | ")}]` : "-";
}, "#formatStateSummary"), c(mt, "CriteriaSwitcherApplication"), pe(mt, "APP_ID", `${ne}-criteria-switcher`), pe(mt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  De(mt, mt, "DEFAULT_OPTIONS"),
  {
    id: mt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((jc = De(mt, mt, "DEFAULT_OPTIONS")) == null ? void 0 : jc.classes) ?? [], "eidolon-criteria-switcher-window", "themed"])
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
)), pe(mt, "PARTS", {
  content: {
    template: `modules/${ne}/templates/criteria-switcher.html`
  }
});
let ks = mt;
const Gm = go(ks);
let Zn = null;
function Wm(n) {
  var e;
  return n ?? ((e = game.scenes) == null ? void 0 : e.viewed) ?? null;
}
c(Wm, "resolveScene");
function Jm(n) {
  var e;
  return !!(n != null && n.rendered && ((e = n == null ? void 0 : n.element) != null && e.isConnected));
}
c(Jm, "isRendered");
function vo() {
  return Jm(Zn) ? Zn : (Zn = null, null);
}
c(vo, "getCriteriaSwitcher");
function ed(n) {
  var i, r, a, o, s;
  const e = Wm(n);
  if (!e)
    return (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "No active scene to open the criteria switcher."), null;
  if (!yo(e))
    return (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, "You do not have permission to manage scene criteria."), null;
  const t = vo();
  return t ? (t.setScene(e), t.render({ force: !0 }), (s = t.bringToFront) == null || s.call(t), t) : (Zn = Gm({ scene: e }), Zn.render({ force: !0 }), Zn);
}
c(ed, "openCriteriaSwitcher");
function td() {
  const n = vo();
  n && (n.close(), Zn = null);
}
c(td, "closeCriteriaSwitcher");
function Al(n) {
  return vo() ? (td(), null) : ed(n);
}
c(Al, "toggleCriteriaSwitcher");
const Km = {
  SCHEMA_VERSION: Cl,
  applyState: Wu,
  getState: Rm,
  getVersion: qm,
  setVersion: Ju,
  getCriteria(n) {
    var e;
    return ct(n ?? ((e = game.scenes) == null ? void 0 : e.viewed));
  },
  setCriteria(n, e) {
    var t;
    return po(e ?? ((t = game.scenes) == null ? void 0 : t.viewed), n);
  },
  updateTiles: Ru,
  updatePlaceables: Gu,
  indexScene: zm,
  openCriteriaSwitcher: ed,
  closeCriteriaSwitcher: td,
  toggleCriteriaSwitcher: Al,
  findBestMatch: em,
  findFileIndex: tm,
  resolveRules: Fu
};
function nd(n) {
  var e;
  return ((e = n == null ? void 0 : n.getFlag) == null ? void 0 : e.call(n, "monks-active-tiles", "files")) ?? [];
}
c(nd, "getTileFiles$1");
function Ym(n = []) {
  return {
    strategy: "select-one",
    defaultTarget: vn(n, 0) ?? { indexHint: 0 },
    variants: [
      {
        criteria: {},
        target: vn(n, 0) ?? { indexHint: 0 }
      }
    ]
  };
}
c(Ym, "createDefaultTileCriteria");
function Qm(n, e = {}) {
  var o, s;
  const { allowLegacy: t = !0 } = e, i = nd(n), r = (o = n == null ? void 0 : n.getFlag) == null ? void 0 : o.call(n, ne, Qn);
  if (r) return ni(r, { files: i });
  if (!t) return null;
  const a = (s = n == null ? void 0 : n.getFlag) == null ? void 0 : s.call(n, ne, Yn);
  return a ? ni(a, { files: i }) : null;
}
c(Qm, "getTileCriteria");
async function mc(n, e, t = {}) {
  if (!(n != null && n.setFlag)) return null;
  const {
    strictValidation: i = !0
  } = t, r = nd(n), a = ni(e, { files: r });
  if (!a)
    return typeof n.unsetFlag == "function" ? (await n.unsetFlag(ne, Qn), await n.unsetFlag(ne, Yn)) : (await n.setFlag(ne, Qn, null), await n.setFlag(ne, Yn, null)), null;
  if (i) {
    const o = _u(a, { files: r });
    if (o.errors.length > 0)
      throw new Error(
        `Tile criteria contains ${o.errors.length} conflicting rule pair(s). Resolve clashes before saving.`
      );
  }
  return await n.setFlag(ne, Qn, a), typeof n.unsetFlag == "function" && await n.unsetFlag(ne, Yn), a;
}
c(mc, "setTileCriteria");
const Ps = "__eidolon_any__", Vt = "eidolon-tile-criteria", Xm = "fa-solid fa-sliders", id = Symbol.for("eidolon.tileCriteriaUiState"), Eo = ["all", "unmapped", "mapped", "conflicts"];
function Zm(n) {
  const e = n == null ? void 0 : n[id];
  return !e || typeof e != "object" ? {
    filterQuery: "",
    filterMode: "all",
    selectedFileIndex: null
  } : {
    filterQuery: typeof e.filterQuery == "string" ? e.filterQuery : "",
    filterMode: Eo.includes(e.filterMode) ? e.filterMode : "all",
    selectedFileIndex: Number.isInteger(e.selectedFileIndex) ? e.selectedFileIndex : null
  };
}
c(Zm, "readUiState");
function eg(n, e) {
  if (!n || !e) return;
  typeof e.filterQuery == "string" && (n.filterQuery = e.filterQuery), Eo.includes(e.filterMode) && (n.filterMode = e.filterMode), Number.isInteger(e.selectedFileIndex) && n.fileEntries.some((i) => i.index === e.selectedFileIndex) && (n.selectedFileIndex = e.selectedFileIndex);
}
c(eg, "applyUiState");
function tg(n) {
  const e = n == null ? void 0 : n.app, t = n == null ? void 0 : n.state;
  !e || !t || (e[id] = {
    filterQuery: typeof t.filterQuery == "string" ? t.filterQuery : "",
    filterMode: Eo.includes(t.filterMode) ? t.filterMode : "all",
    selectedFileIndex: Number.isInteger(t.selectedFileIndex) ? t.selectedFileIndex : null
  });
}
c(tg, "persistUiState");
function ng(n) {
  const e = (n == null ? void 0 : n.object) ?? (n == null ? void 0 : n.document) ?? null;
  return !(e != null && e.isEmbedded) || e.documentName !== "Tile" ? null : e;
}
c(ng, "getTileDocument");
function ig(n) {
  var e;
  return ((e = n == null ? void 0 : n.getFlag) == null ? void 0 : e.call(n, "monks-active-tiles", "files")) ?? [];
}
c(ig, "getTileFiles");
function rg(n, e) {
  var s;
  const t = (n == null ? void 0 : n.parent) ?? ((s = game.scenes) == null ? void 0 : s.viewed) ?? null, r = ct(t).sort((l, u) => l.order - u.order).map((l) => ({
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
c(rg, "getCriteriaDefinitions");
function ag(n) {
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
c(ag, "buildTree");
function og(n, e) {
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
c(og, "collapseFolderBranch");
function sg(n, e) {
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
c(sg, "getRuleSummariesForFile");
function _s(n) {
  var h, y;
  const e = ig(n), t = Ll(e), i = Qm(n, { allowLegacy: !0 }) ?? Ym(e), r = rg(n, i), a = new Map(r.map((p) => [p.key, p.label])), o = new Map(
    t.map((p) => [
      p.index,
      p.path || p.label
    ])
  ), s = Zi(i.defaultTarget, e), l = ((h = t[0]) == null ? void 0 : h.index) ?? 0, u = s >= 0 ? s : l, d = new Map(t.map((p) => [p.index, []]));
  let m = 1;
  for (const p of i.variants ?? []) {
    const w = Zi(p.target, e);
    w < 0 || (d.has(w) || d.set(w, []), d.get(w).push({
      id: m,
      criteria: { ...p.criteria ?? {} }
    }), m += 1);
  }
  const g = t.some((p) => p.index === u) ? u : ((y = t[0]) == null ? void 0 : y.index) ?? null;
  return {
    files: e,
    fileEntries: t,
    criteriaDefinitions: r,
    criteriaLabels: a,
    relativePaths: o,
    defaultIndex: u,
    selectedFileIndex: g,
    filterQuery: "",
    filterMode: "all",
    nextRuleId: m,
    rulesByFile: d,
    status: {
      mode: "ready",
      message: v("EIDOLON.TileCriteria.Ready", "Ready")
    }
  };
}
c(_s, "buildEditorState");
function xs(n, e) {
  return n.rulesByFile.has(e) || n.rulesByFile.set(e, []), n.rulesByFile.get(e);
}
c(xs, "getRulesForFile");
function lg(n) {
  return Object.fromEntries(
    Object.entries(n ?? {}).filter(([e, t]) => typeof e == "string" && e && typeof t == "string" && t.trim()).map(([e, t]) => [e, t.trim()])
  );
}
c(lg, "sanitizeRuleCriteria");
function rd(n) {
  const e = vn(n.files, n.defaultIndex);
  if (!e) return null;
  const t = [], i = [];
  for (const [a, o] of n.rulesByFile.entries()) {
    const s = vn(n.files, a);
    if (s)
      for (const [l, u] of o.entries()) {
        const d = lg(u.criteria);
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
    normalized: ni(
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
c(rd, "buildTileCriteriaDraft");
function cg(n) {
  var e;
  return ((e = rd(n)) == null ? void 0 : e.normalized) ?? null;
}
c(cg, "exportTileCriteria");
function gc(n) {
  const e = rd(n);
  if (!(e != null && e.normalized))
    return {
      errors: [],
      warnings: [],
      errorFileIndexes: [],
      warningFileIndexes: []
    };
  const t = _u(e.normalized, { files: n.files }), i = /* @__PURE__ */ c((s) => {
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
c(gc, "analyzeRuleConflicts");
function qr(n, e = "neutral") {
  const t = document.createElement("span");
  return t.classList.add("eidolon-tile-criteria__badge"), t.dataset.kind = e, t.textContent = n, t;
}
c(qr, "createBadge");
function ug(n, e = {}) {
  const t = typeof n == "string" ? n : "", {
    maxLength: i = 42,
    headLength: r = 20,
    tailLength: a = 16
  } = e;
  if (!t || t.length <= i) return t;
  const o = t.slice(0, r).trimEnd(), s = t.slice(-a).trimStart();
  return `${o}...${s}`;
}
c(ug, "middleEllipsis");
function dg(n) {
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
c(dg, "createRegexFilter");
function fg(n, e) {
  const t = document.createElement("select");
  t.dataset.criteriaKey = n.key;
  const i = document.createElement("option");
  i.value = Ps, i.textContent = "*", t.appendChild(i);
  const r = new Set(n.values ?? []);
  e && !r.has(e) && r.add(e);
  for (const a of r) {
    const o = document.createElement("option");
    o.value = a, o.textContent = a, t.appendChild(o);
  }
  return t.value = e ?? Ps, t;
}
c(fg, "createCriterionSelect");
function mg(n, e, t, i) {
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
    const m = fg(l, (s = n.criteria) == null ? void 0 : s[l.key]);
    m.addEventListener("change", () => {
      m.value === Ps ? delete n.criteria[l.key] : n.criteria[l.key] = m.value, i();
    }), u.appendChild(m), a.appendChild(u);
  }
  r.appendChild(a);
  const o = document.createElement("button");
  return o.type = "button", o.classList.add("control", "ui-control", "eidolon-tile-criteria__rule-remove"), o.textContent = v("EIDOLON.TileCriteria.RemoveRule", "Remove"), o.addEventListener("click", () => {
    const u = xs(e, t).filter((d) => d.id !== n.id);
    e.rulesByFile.set(t, u), i();
  }), r.appendChild(o), r;
}
c(mg, "renderRuleEditor");
const Zr = /* @__PURE__ */ new WeakMap();
function ad(n) {
  return (n == null ? void 0 : n.app) ?? (n == null ? void 0 : n.tile) ?? null;
}
c(ad, "getDialogOwner");
function gg(n) {
  for (const e of n) {
    const t = Gt(e);
    if (t) return t;
    const i = Gt(e == null ? void 0 : e.element);
    if (i) return i;
  }
  return null;
}
c(gg, "findDialogRoot$1");
function hg(n, e, t) {
  const i = n.state, r = i.fileEntries.find((p) => p.index === e);
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
    i.defaultIndex = r.index, Be(n), t();
  })), u.appendChild(d);
  const m = document.createElement("button");
  m.type = "button", m.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action", "secondary"), m.textContent = v("EIDOLON.TileCriteria.ClearFileRules", "Clear File Rules"), m.addEventListener("click", () => {
    i.rulesByFile.set(r.index, []), Be(n), t();
  }), u.appendChild(m), a.appendChild(u);
  const g = document.createElement("div");
  g.classList.add("eidolon-tile-criteria__rule-editors");
  const h = xs(i, r.index);
  if (h.length)
    for (const p of h)
      g.appendChild(
        mg(p, i, r.index, () => {
          Be(n), t();
        })
      );
  else {
    const p = document.createElement("p");
    p.classList.add("notes"), p.textContent = v(
      "EIDOLON.TileCriteria.NoRulesForFile",
      "No rules map to this file yet. Add one to define when this variant should be active."
    ), g.appendChild(p);
  }
  a.appendChild(g);
  const y = document.createElement("button");
  return y.type = "button", y.classList.add("control", "ui-control", "eidolon-tile-criteria__editor-action"), y.textContent = v("EIDOLON.TileCriteria.AddRule", "Add Rule"), y.disabled = !i.criteriaDefinitions.length, y.addEventListener("click", () => {
    xs(i, r.index).push({
      id: i.nextRuleId,
      criteria: {}
    }), i.nextRuleId += 1, Be(n), t();
  }), a.appendChild(y), a;
}
c(hg, "buildRuleEditorContent");
function pg(n, e) {
  var m, g, h;
  const t = ad(n);
  if (!t) return;
  const i = Zr.get(t);
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
  Zr.set(t, r);
  const a = /* @__PURE__ */ c(() => {
    Zr.delete(t);
  }, "closeDialog"), o = /* @__PURE__ */ c(() => {
    r.host instanceof HTMLElement && r.host.replaceChildren(
      hg(r.controller, r.fileIndex, o)
    );
  }, "refreshDialog");
  r.refresh = o;
  const s = v("EIDOLON.TileCriteria.EditorTitle", "Edit Tile Criteria Rules"), l = '<div class="eidolon-tile-criteria-editor-host"></div>', u = v("EIDOLON.TileCriteria.CloseEditor", "Close"), d = (h = (g = foundry == null ? void 0 : foundry.applications) == null ? void 0 : g.api) == null ? void 0 : h.DialogV2;
  if (typeof (d == null ? void 0 : d.wait) == "function") {
    d.wait({
      window: { title: s },
      content: l,
      buttons: [{ action: "close", label: u, default: !0 }],
      render: /* @__PURE__ */ c((...y) => {
        var b;
        const p = gg(y), w = (b = p == null ? void 0 : p.querySelector) == null ? void 0 : b.call(p, ".eidolon-tile-criteria-editor-host");
        w instanceof HTMLElement && (r.host = w, o());
      }, "render"),
      close: a,
      rejectClose: !1
    }).catch((y) => {
      console.warn(`${ne} | Rule editor dialog failed`, y), a();
    });
    return;
  }
  a();
}
c(pg, "openRuleEditorDialog");
function hc(n) {
  var i;
  const e = ad(n);
  if (!e) return;
  const t = Zr.get(e);
  (i = t == null ? void 0 : t.refresh) == null || i.call(t);
}
c(hc, "refreshOpenRuleEditor");
function Rs(n, e) {
  return (n.rulesByFile.get(e) ?? []).length > 0;
}
c(Rs, "hasRulesForFile");
function od(n, e) {
  var t, i;
  return ((t = n == null ? void 0 : n.errorFileIndexes) == null ? void 0 : t.includes(e)) || ((i = n == null ? void 0 : n.warningFileIndexes) == null ? void 0 : i.includes(e));
}
c(od, "hasConflictForFile");
function yg(n, e, t) {
  switch (n.filterMode) {
    case "unmapped":
      return !Rs(n, e.index);
    case "mapped":
      return Rs(n, e.index);
    case "conflicts":
      return od(t, e.index);
    case "all":
    default:
      return !0;
  }
}
c(yg, "matchesFilterMode");
function bg(n, e) {
  let t = 0, i = 0, r = 0;
  for (const a of n.fileEntries)
    Rs(n, a.index) ? t += 1 : i += 1, od(e, a.index) && (r += 1);
  return {
    all: n.fileEntries.length,
    mapped: t,
    unmapped: i,
    conflicts: r
  };
}
c(bg, "getFilterModeCounts");
function wg(n) {
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
c(wg, "getFilterModeLabel");
function sd(n, e, t, i, r) {
  var u, d;
  const a = [...n.folders.keys()].sort((m, g) => m.localeCompare(g));
  for (const m of a) {
    const g = og(m, n.folders.get(m)), h = document.createElement("li");
    h.classList.add("eidolon-tile-criteria__tree-branch");
    const y = document.createElement("div");
    y.classList.add("document", "folder", "update", "eidolon-tile-criteria__folder-row");
    const p = document.createElement("i");
    p.classList.add("fa-solid", "fa-folder-open"), y.appendChild(p);
    const w = document.createElement("span");
    w.classList.add("eidolon-tile-criteria__tree-folder-label"), w.textContent = g.label, w.title = g.label, y.appendChild(w), h.appendChild(y);
    const b = document.createElement("ul");
    b.classList.add("eidolon-tile-criteria__tree"), b.dataset.folder = g.label, sd(g.node, e, t, i, b), b.childElementCount > 0 && h.appendChild(b), r.appendChild(h);
  }
  const o = [...n.files].sort((m, g) => m.name.localeCompare(g.name));
  if (!o.length) return;
  const s = document.createElement("li"), l = document.createElement("ul");
  l.classList.add("document-list", "eidolon-tile-criteria__document-list");
  for (const m of o) {
    const g = m.entry, h = g.index === e.selectedFileIndex, y = g.index === e.defaultIndex, p = sg(e, g.index), w = document.createElement("li");
    w.classList.add("document", "update", "eidolon-tile-criteria__tree-file");
    const b = document.createElement("button");
    b.type = "button", b.classList.add("eidolon-tile-criteria__file-row");
    const E = (u = i == null ? void 0 : i.errorFileIndexes) == null ? void 0 : u.includes(g.index), L = (d = i == null ? void 0 : i.warningFileIndexes) == null ? void 0 : d.includes(g.index);
    E ? b.classList.add("has-conflict") : L && b.classList.add("has-warning");
    const A = e.relativePaths.get(g.index) || g.path || m.name, $ = [A];
    E ? $.push(
      v(
        "EIDOLON.TileCriteria.ConflictFileHint",
        "This file participates in one or more conflicting rules."
      )
    ) : L && $.push(
      v(
        "EIDOLON.TileCriteria.WarningFileHint",
        "This file has potentially redundant rules."
      )
    ), p.length || $.push(
      v(
        "EIDOLON.TileCriteria.UnmappedHint",
        "No criteria rules map to this file."
      )
    ), b.title = $.join(`
`), h && b.classList.add("is-selected"), b.addEventListener("click", () => {
      e.selectedFileIndex = g.index, Be(t), pg(t, g.index);
    });
    const k = document.createElement("span");
    k.classList.add("eidolon-tile-criteria__indicator"), k.dataset.kind = y ? "default" : p.length ? "mapped" : "unmapped", b.appendChild(k);
    const D = document.createElement("span");
    D.classList.add("eidolon-tile-criteria__file-content");
    const J = document.createElement("span");
    J.classList.add("eidolon-tile-criteria__file-heading");
    const K = document.createElement("span");
    K.classList.add("eidolon-tile-criteria__file-title"), K.textContent = ug(m.name || g.label), K.title = A, J.appendChild(K);
    const _ = qr(`#${g.index + 1}`, "meta");
    _.classList.add("eidolon-tile-criteria__index-badge"), J.appendChild(_), D.appendChild(J);
    const P = document.createElement("span");
    P.classList.add("eidolon-tile-criteria__badges"), y && P.appendChild(qr(v("EIDOLON.TileCriteria.DefaultBadge", "Default"), "default"));
    const N = p.slice(0, 2);
    for (const R of N)
      P.appendChild(qr(R, "rule"));
    if (p.length > N.length && P.appendChild(qr(`+${p.length - N.length}`, "meta")), D.appendChild(P), b.appendChild(D), E || L) {
      const R = document.createElement("span");
      R.classList.add("eidolon-tile-criteria__row-warning"), R.dataset.mode = E ? "error" : "warning", R.innerHTML = '<i class="fa-solid fa-triangle-exclamation" inert=""></i>', b.appendChild(R);
    }
    w.appendChild(b), l.appendChild(w);
  }
  s.appendChild(l), r.appendChild(s);
}
c(sd, "renderTreeNode");
function vg(n, e, t, i = {}) {
  const r = document.createElement("section");
  r.classList.add("eidolon-tile-criteria__tree-panel");
  const a = dg(n.filterQuery), o = bg(n, t);
  n.filterMode !== "all" && o[n.filterMode] === 0 && (n.filterMode = "all");
  const s = document.createElement("div");
  s.classList.add("eidolon-tile-criteria__toolbar");
  const l = document.createElement("div");
  l.classList.add("eidolon-tile-criteria__mode-bar");
  for (const E of Eo) {
    const L = document.createElement("button");
    L.type = "button", L.classList.add("control", "ui-control", "eidolon-tile-criteria__mode-button"), L.dataset.mode = E, L.textContent = wg(E);
    const A = E === "all" || o[E] > 0;
    L.disabled = !A, A || (L.dataset.tooltip = v(
      "EIDOLON.TileCriteria.FilterModeUnavailable",
      "No entries currently match this filter."
    ), L.title = L.dataset.tooltip), n.filterMode === E ? (L.classList.add("is-active"), L.setAttribute("aria-pressed", "true")) : L.setAttribute("aria-pressed", "false"), L.addEventListener("click", () => {
      n.filterMode !== E && (n.filterMode = E, Be(e));
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
    const L = d.selectionStart ?? d.value.length, A = d.selectionEnd ?? L;
    n.filterQuery = d.value, Be(e), requestAnimationFrame(() => {
      const $ = e.section.querySelector(".eidolon-tile-criteria__filter-input");
      if ($ instanceof HTMLInputElement) {
        $.focus();
        try {
          $.setSelectionRange(L, A);
        } catch {
        }
      }
    });
  }), u.appendChild(d);
  const m = document.createElement("div");
  m.classList.add("eidolon-tile-criteria__toolbar-actions");
  const g = document.createElement("button");
  g.type = "button";
  const h = v("EIDOLON.TileCriteria.Save", "Save Rules");
  g.classList.add("control", "ui-control", "eidolon-tile-criteria__toolbar-action", "icon-only"), g.dataset.tooltip = h, g.setAttribute("aria-label", h), g.title = h, g.innerHTML = '<i class="fa-solid fa-floppy-disk" inert=""></i>', g.disabled = t.errors.length > 0, g.addEventListener("click", () => {
    var E;
    (E = i.onSave) == null || E.call(i);
  }), m.appendChild(g);
  const y = document.createElement("button");
  y.type = "button";
  const p = v("EIDOLON.TileCriteria.Clear", "Clear Rules");
  if (y.classList.add("control", "ui-control", "secondary", "eidolon-tile-criteria__toolbar-action", "icon-only"), y.dataset.tooltip = p, y.setAttribute("aria-label", p), y.title = p, y.innerHTML = '<i class="fa-solid fa-trash" inert=""></i>', y.addEventListener("click", () => {
    var E;
    (E = i.onClear) == null || E.call(i);
  }), m.appendChild(y), u.appendChild(m), s.appendChild(u), r.appendChild(s), a.error) {
    const E = document.createElement("p");
    E.classList.add("notes", "eidolon-tile-criteria__filter-error"), E.textContent = `${v("EIDOLON.TileCriteria.InvalidRegex", "Invalid regex")}: ${a.error}`, r.appendChild(E);
  }
  const w = document.createElement("div");
  w.classList.add("eidolon-tile-criteria__library-tree");
  const b = n.fileEntries.filter((E) => {
    const L = n.relativePaths.get(E.index) || E.path || E.label;
    return yg(n, E, t) && a.matches(L);
  });
  if (n.fileEntries.length)
    if (b.length) {
      const E = document.createElement("ul");
      E.classList.add("eidolon-tile-criteria__tree"), sd(ag(b), n, e, t, E), w.appendChild(E);
    } else {
      const E = document.createElement("p");
      E.classList.add("notes"), E.textContent = v("EIDOLON.TileCriteria.NoMatches", "No variants match this filter."), w.appendChild(E);
    }
  else {
    const E = document.createElement("p");
    E.classList.add("notes"), E.textContent = v("EIDOLON.TileCriteria.NoVariants", "No MATT variants found"), w.appendChild(E);
  }
  return r.appendChild(w), r;
}
c(vg, "renderTreePanel");
function Be(n) {
  const { section: e, state: t } = n, i = gc(t);
  tg(n), e.replaceChildren();
  const r = /* @__PURE__ */ c(async () => {
    try {
      const o = gc(t);
      if (o.errors.length) {
        t.status = {
          mode: "error",
          message: v(
            "EIDOLON.TileCriteria.ConflictSaveBlocked",
            `Resolve ${o.errors.length} conflict(s) before saving tile criteria rules.`
          )
        }, Be(n);
        return;
      }
      const s = cg(t);
      if (!s) {
        t.status = {
          mode: "error",
          message: v("EIDOLON.TileCriteria.Invalid", "Invalid rules. Select valid target variants.")
        }, Be(n);
        return;
      }
      await mc(n.tile, s);
      const l = t.filterQuery, u = t.filterMode, d = t.selectedFileIndex;
      n.state = _s(n.tile), n.state.filterQuery = l, n.state.filterMode = u, Number.isInteger(d) && (n.state.selectedFileIndex = d), n.state.status = {
        mode: "ready",
        message: v("EIDOLON.TileCriteria.Saved", "Tile criteria rules saved.")
      }, Be(n), hc(n);
    } catch (o) {
      console.error(`${ne} | Failed to save tile criteria`, o), t.status = {
        mode: "error",
        message: (o == null ? void 0 : o.message) ?? "Failed to save tile criteria rules."
      }, Be(n);
    }
  }, "handleSave"), a = /* @__PURE__ */ c(async () => {
    try {
      await mc(n.tile, null);
      const o = t.filterQuery, s = t.filterMode, l = t.selectedFileIndex;
      n.state = _s(n.tile), n.state.filterQuery = o, n.state.filterMode = s, Number.isInteger(l) && (n.state.selectedFileIndex = l), n.state.status = {
        mode: "ready",
        message: v("EIDOLON.TileCriteria.Cleared", "Tile criteria rules cleared.")
      }, Be(n), hc(n);
    } catch (o) {
      console.error(`${ne} | Failed to clear tile criteria`, o), t.status = {
        mode: "error",
        message: (o == null ? void 0 : o.message) ?? "Failed to clear tile criteria rules."
      }, Be(n);
    }
  }, "handleClear");
  if (e.appendChild(vg(t, n, i, {
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
c(Be, "renderController");
function Eg(n, e = null) {
  const t = document.createElement("section");
  t.classList.add("eidolon-tile-criteria");
  const i = _s(n);
  eg(i, Zm(e));
  const r = {
    app: e,
    tile: n,
    section: t,
    state: i
  };
  return Be(r), r;
}
c(Eg, "createController");
function Sg(n) {
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
c(Sg, "findFooterElement");
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
function Cg(n, e) {
  var i, r, a;
  return n instanceof HTMLElement ? [
    (i = n.querySelector(".tab[data-tab]")) == null ? void 0 : i.parentElement,
    n.querySelector(".sheet-body"),
    (a = (r = e == null ? void 0 : e.parentElement) == null ? void 0 : r.querySelector) == null ? void 0 : a.call(r, ":scope > .sheet-body"),
    e == null ? void 0 : e.parentElement
  ].find((o) => o instanceof HTMLElement) ?? null : null;
}
c(Cg, "findTabBody");
function Lg(n, e) {
  var t, i, r, a, o, s, l;
  return ((t = n == null ? void 0 : n.dataset) == null ? void 0 : t.group) ?? ((a = (r = (i = n == null ? void 0 : n.querySelector) == null ? void 0 : i.call(n, "[data-group]")) == null ? void 0 : r.dataset) == null ? void 0 : a.group) ?? ((l = (s = (o = e == null ? void 0 : e.querySelector) == null ? void 0 : o.call(e, ".tab[data-group]")) == null ? void 0 : s.dataset) == null ? void 0 : l.group) ?? "main";
}
c(Lg, "getTabGroup");
function Ig(n, e) {
  if (!(n instanceof HTMLElement)) return;
  n.textContent = "";
  const t = document.createElement("i");
  t.className = Xm, t.setAttribute("inert", ""), n.append(t, " ");
  const i = document.createElement("span");
  i.textContent = e, n.append(i);
}
c(Ig, "setTabButtonContent");
function Og(n, e) {
  const t = n.querySelector("[data-tab]"), i = (t == null ? void 0 : t.tagName) || "A", r = document.createElement(i);
  return t instanceof HTMLElement && (r.className = t.className), r.classList.remove("active"), i === "BUTTON" && (r.type = "button"), r.dataset.action = "tab", r.dataset.tab = Vt, r.dataset.group = e, r.setAttribute("aria-selected", "false"), r.setAttribute("aria-pressed", "false"), r;
}
c(Og, "createTabButton");
function Ag(n, e) {
  const t = document.createElement("div");
  t.classList.add("tab"), t.dataset.tab = Vt, t.dataset.group = e, t.dataset.applicationPart = Vt, t.setAttribute("hidden", "true");
  const i = Sg(n);
  return n.insertBefore(t, i ?? null), t;
}
c(Ag, "createTabPanel");
function Bo(n, e, t, i) {
  var o;
  if (!(t instanceof HTMLElement) || !(i instanceof HTMLElement)) return;
  const r = (o = n == null ? void 0 : n.tabGroups) == null ? void 0 : o[e];
  if (typeof r == "string" ? r === Vt : t.classList.contains("active") || i.classList.contains("active")) {
    t.classList.add("active"), t.setAttribute("aria-selected", "true"), t.setAttribute("aria-pressed", "true"), i.classList.add("active"), i.removeAttribute("hidden"), i.removeAttribute("aria-hidden");
    return;
  }
  t.classList.remove("active"), t.setAttribute("aria-selected", "false"), t.setAttribute("aria-pressed", "false"), i.classList.remove("active"), i.setAttribute("hidden", "true");
}
c(Bo, "syncTabVisibility");
function Ng(n, e) {
  const t = Tg(e), i = Cg(e, t);
  if (!(t instanceof HTMLElement) || !(i instanceof HTMLElement)) return null;
  const r = Lg(t, i);
  let a = t.querySelector(`[data-tab="${Vt}"]`);
  a instanceof HTMLElement || (a = Og(t, r), t.appendChild(a)), Ig(a, v("EIDOLON.TileCriteria.TabLabel", "Criteria"));
  let o = i.querySelector(`.tab[data-tab="${Vt}"]`);
  return o instanceof HTMLElement || (o = Ag(i, r)), a.dataset.eidolonTileCriteriaBound || (a.addEventListener("click", () => {
    vu(n, Vt, r), requestAnimationFrame(() => {
      Bo(n, r, a, o);
    });
  }), a.dataset.eidolonTileCriteriaBound = "true"), Bo(n, r, a, o), requestAnimationFrame(() => {
    Bo(n, r, a, o);
  }), o;
}
c(Ng, "ensureTileCriteriaTab");
function Mg() {
  Hooks.on("renderTileConfig", (n, e) => {
    var l, u, d, m;
    const t = Gt(e);
    if (!t) return;
    const i = ng(n);
    if (!i) return;
    if ((l = t.querySelector(".eidolon-tile-criteria")) == null || l.remove(), !ho()) {
      (u = t.querySelector(`.item[data-tab='${Vt}']`)) == null || u.remove(), (d = t.querySelector(`.tab[data-tab='${Vt}']`)) == null || d.remove();
      return;
    }
    const r = Eg(i, n), a = Ng(n, t);
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
c(Mg, "registerTileCriteriaConfigControls");
function kg(n) {
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
c(kg, "toList");
function $g(n, e) {
  const t = n == null ? void 0 : n.tools;
  return Array.isArray(t) ? t.some((i) => (i == null ? void 0 : i.name) === e) : t instanceof Map ? t.has(e) : t && typeof t == "object" ? e in t ? !0 : Object.values(t).some((i) => (i == null ? void 0 : i.name) === e) : !1;
}
c($g, "hasTool");
function Dg(n, e) {
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
c(Dg, "addTool");
function Fg() {
  Hooks.on("getSceneControlButtons", (n) => {
    var i;
    const e = kg(n);
    if (!e.length) return;
    const t = e.find((r) => (r == null ? void 0 : r.name) === "tiles") ?? e.find((r) => (r == null ? void 0 : r.name) === "tokens" || (r == null ? void 0 : r.name) === "token") ?? e[0];
    t && ($g(t, "eidolonCriteriaSwitcher") || Dg(t, {
      name: "eidolonCriteriaSwitcher",
      title: "Criteria Switcher",
      icon: "fa-solid fa-sliders",
      button: !0,
      toggle: !1,
      visible: yo(((i = game.scenes) == null ? void 0 : i.viewed) ?? null),
      onClick: /* @__PURE__ */ c(() => Al(), "onClick")
    }));
  });
}
c(Fg, "registerSceneControlButton");
function jr(n, e) {
  if (!n || typeof n != "object") return !1;
  const t = String(e).split(".");
  let i = n;
  for (const r of t) {
    if (!i || typeof i != "object" || !Object.prototype.hasOwnProperty.call(i, r)) return !1;
    i = i[r];
  }
  return !0;
}
c(jr, "hasOwnPath");
function Pg() {
  const n = /* @__PURE__ */ c((i, r = null) => {
    i && Tm(i, r);
  }, "invalidateTileScene"), e = /* @__PURE__ */ c((i, r = null) => {
    i && xm(i, r);
  }, "invalidatePlaceableScene");
  Hooks.on("createTile", (i) => {
    n((i == null ? void 0 : i.parent) ?? null, i ?? null);
  }), Hooks.on("deleteTile", (i) => {
    n((i == null ? void 0 : i.parent) ?? null, i ?? null);
  }), Hooks.on("updateTile", (i, r) => {
    (jr(r, `flags.${ne}.tileCriteria`) || jr(r, `flags.${ne}.fileIndex`)) && n((i == null ? void 0 : i.parent) ?? null, i ?? null);
  });
  const t = /* @__PURE__ */ c((i) => {
    Hooks.on(`create${i}`, (r) => {
      e((r == null ? void 0 : r.parent) ?? null, r ?? null);
    }), Hooks.on(`delete${i}`, (r) => {
      e((r == null ? void 0 : r.parent) ?? null, r ?? null);
    }), Hooks.on(`update${i}`, (r, a) => {
      const o = jr(a, `flags.${ne}.presets`), s = i === "AmbientLight" && jr(a, `flags.${ne}.lightCriteria`);
      !o && !s || e((r == null ? void 0 : r.parent) ?? null, r ?? null);
    });
  }, "registerPlaceableHooks");
  t("AmbientLight"), t("Wall"), t("AmbientSound"), Hooks.on("canvasReady", (i) => {
    const r = (i == null ? void 0 : i.scene) ?? null;
    r && (n(r), e(r));
  });
}
c(Pg, "registerCriteriaCacheInvalidationHooks");
function _g() {
  Fg(), Mg(), Pg(), Hooks.once("init", () => {
    var n, e;
    (e = (n = game.keybindings) == null ? void 0 : n.register) == null || e.call(n, ne, "toggleCriteriaSwitcher", {
      name: "Toggle Criteria Switcher",
      hint: "Open or close the criteria switcher window for live scene state updates.",
      editable: [{ key: "KeyM", modifiers: ["Alt"] }],
      onDown: /* @__PURE__ */ c(() => {
        var t, i, r;
        return yo(((t = game.scenes) == null ? void 0 : t.viewed) ?? null) ? (Al(), !0) : ((r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, "You do not have permission to manage scene criteria."), !0);
      }, "onDown"),
      restricted: !0,
      precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
    });
  }), Hooks.on("canvasReady", (n) => {
    var t;
    const e = vo();
    e && (e.setScene((n == null ? void 0 : n.scene) ?? ((t = game.scenes) == null ? void 0 : t.viewed) ?? null), e.render({ force: !0 }));
  }), Hooks.once("ready", () => {
    var e, t;
    const n = (t = (e = game.modules) == null ? void 0 : e.get) == null ? void 0 : t.call(e, ne);
    n && (n.api || (n.api = {}), n.api.criteria = Km, console.log(`${ne} | Criteria engine API registered`));
  });
}
c(_g, "registerCriteriaEngineHooks");
_g();
const ea = /* @__PURE__ */ new WeakMap(), Br = /* @__PURE__ */ new WeakMap(), he = "__eidolon_default__";
function xg() {
  Hooks.on("renderAmbientLightConfig", Rg), O("LightCriteria | AmbientLightConfig controls registered");
}
c(xg, "registerAmbientLightCriteriaControls");
function Rg(n, e) {
  var t;
  Ai("LightCriteria | renderAmbientLightConfig", {
    appId: (n == null ? void 0 : n.id) ?? null,
    constructor: ((t = n == null ? void 0 : n.constructor) == null ? void 0 : t.name) ?? null,
    isRendered: (n == null ? void 0 : n.rendered) ?? !1
  });
  try {
    const i = Gt(e);
    if (!i) return;
    if (!ho()) {
      i.querySelectorAll(".eidolon-light-criteria, .eidolon-light-criteria-main-switcher").forEach((r) => r.remove());
      return;
    }
    Hg(n, i);
  } catch (i) {
    console.error("eidolon-utilities | Failed to enhance AmbientLightConfig UI", i);
  } finally {
    hn();
  }
}
c(Rg, "handleAmbientLightConfigRender");
function Hg(n, e) {
  var Ae, Nn, Pi, Dr, Bl;
  const t = (n == null ? void 0 : n.form) instanceof HTMLFormElement ? n.form : e instanceof HTMLFormElement ? e : (Ae = e == null ? void 0 : e.closest) == null ? void 0 : Ae.call(e, "form");
  if (!(t instanceof HTMLFormElement)) return;
  const i = t.querySelector(".window-content");
  if (!(i instanceof HTMLElement)) return;
  const r = cd(n);
  if (!r) return;
  const a = sh(r);
  O("LightCriteria | Resolved ambient light", {
    sheetId: (r == null ? void 0 : r.id) ?? null,
    persistedId: (a == null ? void 0 : a.id) ?? null,
    sameRef: r === a
  });
  const o = (a == null ? void 0 : a.parent) ?? r.parent ?? null, s = o ? Vf(o) : [], l = s.filter(
    (M) => Array.isArray(M == null ? void 0 : M.values) && M.values.length > 0
  ), u = Qg(s), d = s.map((M) => typeof (M == null ? void 0 : M.id) == "string" ? M.id : null).filter((M) => !!M), m = a ?? r, g = o ? ct(o) : [];
  let h = qu(m);
  const y = Am(h, g);
  JSON.stringify(y) !== JSON.stringify(h) && (h = y, ju(m, y).catch((M) => {
    console.warn("eidolon-utilities | Failed to persist migrated light criteria keys", M);
  })), O("LightCriteria | Loaded mapping state", {
    hasBase: !!(h != null && h.base),
    mappingCount: Array.isArray(h == null ? void 0 : h.mappings) ? h.mappings.length : 0,
    mappings: Array.isArray(h == null ? void 0 : h.mappings) ? h.mappings.map((M) => {
      var j, X;
      return {
        id: M.id,
        key: M.key,
        hasColor: !!((X = (j = M.config) == null ? void 0 : j.config) != null && X.color)
      };
    }) : []
  });
  const p = i.querySelector(".eidolon-light-criteria");
  p && p.remove(), i.querySelectorAll(".eidolon-light-criteria-main-switcher").forEach((M) => M.remove());
  const w = document.createElement("fieldset");
  w.classList.add("eidolon-light-criteria");
  const b = document.createElement("legend");
  b.textContent = v("EIDOLON.LightCriteria.Legend", "Scene Criteria Lighting"), w.appendChild(b);
  const E = document.createElement("p");
  E.classList.add("notes"), E.textContent = v(
    "EIDOLON.LightCriteria.Description",
    "Capture a base lighting state, then map criteria values to lighting configurations."
  ), w.appendChild(E);
  const L = document.createElement("div");
  L.classList.add("eidolon-light-criteria__controls");
  const A = document.createElement("button");
  A.type = "button", A.dataset.action = "make-default", A.classList.add("eidolon-light-criteria__button"), A.textContent = v(
    "EIDOLON.LightCriteria.SetBase",
    "Set Base"
  ), L.appendChild(A);
  const $ = document.createElement("button");
  $.type = "button", $.dataset.action = "create-mapping", $.classList.add("eidolon-light-criteria__button"), $.textContent = v(
    "EIDOLON.LightCriteria.CreateMapping",
    "Add Criteria Mapping"
  ), $.setAttribute("aria-expanded", "false"), L.appendChild($), w.appendChild(L);
  const k = document.createElement("p");
  k.classList.add("notes", "eidolon-light-criteria__status"), w.appendChild(k);
  const D = document.createElement("div");
  D.classList.add("eidolon-light-criteria__switcher");
  const J = document.createElement("label");
  J.classList.add("eidolon-light-criteria__switcher-label");
  const K = `${(n == null ? void 0 : n.id) ?? (r == null ? void 0 : r.id) ?? "eidolon-light"}-mapping-select`;
  J.htmlFor = K, J.textContent = v("EIDOLON.LightCriteria.SelectLabel", "Criteria Mapping"), D.appendChild(J);
  const _ = document.createElement("details");
  _.classList.add("eidolon-light-criteria__filter-details");
  const P = document.createElement("summary");
  P.classList.add("eidolon-light-criteria__filter-summary");
  const N = document.createElement("span");
  N.classList.add("eidolon-light-criteria__filter-summary-label"), N.textContent = v(
    "EIDOLON.LightCriteria.FilterHeading",
    "Filter mappings"
  ), P.appendChild(N);
  const R = document.createElement("span");
  R.classList.add("eidolon-light-criteria__filter-meta"), P.appendChild(R), _.appendChild(P);
  const V = document.createElement("div");
  V.classList.add("eidolon-light-criteria__filter-panel");
  const z = document.createElement("div");
  z.classList.add("eidolon-light-criteria__filter-grid");
  for (const M of l) {
    const j = document.createElement("label");
    j.classList.add("eidolon-light-criteria__filter");
    const X = document.createElement("span");
    X.classList.add("eidolon-light-criteria__filter-name"), X.textContent = (Pi = (Nn = M.name) == null ? void 0 : Nn.trim) != null && Pi.call(Nn) ? M.name.trim() : v("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), j.appendChild(X);
    const ee = document.createElement("select");
    ee.dataset.filterCategoryId = M.id, ee.classList.add("eidolon-light-criteria__filter-select");
    const te = document.createElement("option");
    te.value = "", te.textContent = v("EIDOLON.LightCriteria.FilterAny", "Any"), ee.appendChild(te);
    for (const le of M.values) {
      const ce = document.createElement("option");
      ce.value = le, ce.textContent = le, ee.appendChild(ce);
    }
    j.appendChild(ee), z.appendChild(j);
  }
  V.appendChild(z);
  const H = document.createElement("div");
  H.classList.add("eidolon-light-criteria__filter-actions");
  const U = document.createElement("button");
  U.type = "button", U.dataset.action = "clear-mapping-filters", U.classList.add("eidolon-light-criteria__button", "secondary", "compact"), U.textContent = v("EIDOLON.LightCriteria.ClearFilters", "Clear Filters"), H.appendChild(U), V.appendChild(H), _.appendChild(V), _.hidden = l.length === 0, D.appendChild(_);
  const Y = document.createElement("div");
  Y.classList.add("eidolon-light-criteria__switcher-controls"), D.appendChild(Y);
  const ae = document.createElement("select");
  ae.id = K, ae.classList.add("eidolon-light-criteria__select"), ae.dataset.action = "select-mapping", Y.appendChild(ae);
  const Z = document.createElement("button");
  Z.type = "button", Z.dataset.action = "apply-selected-mapping", Z.classList.add("eidolon-light-criteria__button", "secondary"), Z.textContent = v("EIDOLON.LightCriteria.ApplyButton", "Apply"), Y.appendChild(Z);
  const ie = document.createElement("details");
  ie.classList.add("eidolon-light-criteria__menu"), ie.dataset.action = "mapping-actions-menu";
  const On = document.createElement("summary");
  On.classList.add("eidolon-light-criteria__menu-toggle"), On.innerHTML = '<i class="fa-solid fa-ellipsis-vertical" inert=""></i>', On.setAttribute(
    "aria-label",
    v("EIDOLON.LightCriteria.MoreActions", "More actions")
  ), On.dataset.tooltip = v("EIDOLON.LightCriteria.MoreActions", "More actions"), ie.appendChild(On);
  const ut = document.createElement("div");
  ut.classList.add("eidolon-light-criteria__menu-list"), ie.appendChild(ut);
  const $e = document.createElement("button");
  $e.type = "button", $e.dataset.action = "update-selected-mapping", $e.classList.add("eidolon-light-criteria__menu-item"), $e.textContent = v(
    "EIDOLON.LightCriteria.UpdateSelected",
    "Save current config to selected"
  ), ut.appendChild($e);
  const Ze = document.createElement("button");
  Ze.type = "button", Ze.dataset.action = "edit-selected-mapping-criteria", Ze.classList.add("eidolon-light-criteria__menu-item"), Ze.textContent = v(
    "EIDOLON.LightCriteria.EditSelectedCriteria",
    "Edit selected mapping criteria"
  ), ut.appendChild(Ze);
  const et = document.createElement("button");
  et.type = "button", et.dataset.action = "remove-selected-mapping", et.classList.add("eidolon-light-criteria__menu-item", "danger"), et.textContent = v(
    "EIDOLON.LightCriteria.RemoveSelected",
    "Delete selected mapping"
  ), ut.appendChild(et), Y.appendChild(ie);
  const $t = document.createElement("div");
  $t.classList.add("eidolon-light-criteria-main-switcher"), $t.appendChild(D);
  const ze = document.createElement("p");
  if (ze.classList.add("notes", "eidolon-light-criteria-main-switcher__empty"), ze.textContent = v(
    "EIDOLON.LightCriteria.ActiveRequiresBase",
    "Set Base Lighting to enable mapping selection and actions."
  ), $t.appendChild(ze), s.length === 0) {
    const M = document.createElement("p");
    M.classList.add("notification", "warning", "eidolon-light-criteria__warning"), M.textContent = v(
      "EIDOLON.LightCriteria.NoCategoriesWarning",
      "This scene has no criteria configured. Add criteria under Scene -> Criteria to enable criteria-driven lighting."
    ), w.appendChild(M);
  } else if (l.length === 0) {
    const M = document.createElement("p");
    M.classList.add("notification", "warning", "eidolon-light-criteria__warning"), M.textContent = v(
      "EIDOLON.LightCriteria.NoValuesWarning",
      "Criteria exist, but none define selectable values. Add values in Scene -> Criteria."
    ), w.appendChild(M);
  }
  const Te = document.createElement("div");
  Te.classList.add("eidolon-light-criteria__creation"), Te.dataset.section = "creation", Te.hidden = !0;
  const ai = document.createElement("p");
  ai.classList.add("notes"), ai.textContent = v(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ), Te.appendChild(ai);
  const Dt = document.createElement("div");
  Dt.classList.add("eidolon-light-criteria__category-list"), Te.appendChild(Dt);
  for (const M of l) {
    const j = document.createElement("label");
    j.classList.add("eidolon-light-criteria__category");
    const X = document.createElement("span");
    X.classList.add("eidolon-light-criteria__category-name"), X.textContent = (Bl = (Dr = M.name) == null ? void 0 : Dr.trim) != null && Bl.call(Dr) ? M.name.trim() : v("EIDOLON.LightCriteria.UnnamedCategory", "Unnamed Category"), j.appendChild(X);
    const ee = document.createElement("select");
    ee.dataset.categoryId = M.id, ee.classList.add("eidolon-light-criteria__category-select");
    const te = document.createElement("option");
    te.value = "", te.textContent = v(
      "EIDOLON.LightCriteria.IgnoreCategory",
      "Ignore"
    ), ee.appendChild(te);
    for (const le of M.values) {
      const ce = document.createElement("option");
      ce.value = le, ce.textContent = le, ee.appendChild(ce);
    }
    j.appendChild(ee), Dt.appendChild(j);
  }
  const An = document.createElement("div");
  An.classList.add("eidolon-light-criteria__creation-actions");
  const tt = document.createElement("button");
  tt.type = "button", tt.dataset.action = "save-mapping", tt.classList.add("eidolon-light-criteria__button", "primary"), tt.textContent = v(
    "EIDOLON.LightCriteria.SaveMapping",
    "Save Mapping"
  ), An.appendChild(tt);
  const Ft = document.createElement("button");
  Ft.type = "button", Ft.dataset.action = "cancel-create", Ft.classList.add("eidolon-light-criteria__button", "secondary"), Ft.textContent = v(
    "EIDOLON.LightCriteria.Cancel",
    "Cancel"
  ), An.appendChild(Ft), Te.appendChild(An), w.appendChild(Te), i.prepend($t), i.appendChild(w), w.hidden = !0, Bg(n, {
    fieldset: w,
    homeContainer: i
  }), requestAnimationFrame(() => {
    var M;
    (M = n.setPosition) == null || M.call(n, { height: "auto" });
  });
  let F = h;
  $n({ switcher: D, emptyState: ze, state: F }), kn(k, F), Hi($, {
    state: F,
    hasCategories: l.length > 0
  }), O("LightCriteria | Controls injected", {
    sceneId: (o == null ? void 0 : o.id) ?? null,
    lightId: (r == null ? void 0 : r.id) ?? null,
    hasBase: !!(F != null && F.base),
    mappingCount: Array.isArray(F == null ? void 0 : F.mappings) ? F.mappings.length : 0,
    categories: l.length
  });
  const kr = ih(F), Q = {
    restoreConfig: null,
    app: n,
    selectedMapping: kr,
    editorMode: "create",
    editingMappingId: null,
    mappingFilters: {}
  };
  ea.set(w, Q);
  const dt = /* @__PURE__ */ c(() => {
    ie.open = !1;
  }, "closeActionsMenu");
  On.addEventListener("click", (M) => {
    ie.classList.contains("is-disabled") && (M.preventDefault(), dt());
  });
  const Oe = /* @__PURE__ */ c((M = Q.selectedMapping) => {
    const j = Xg(z), X = Array.isArray(F == null ? void 0 : F.mappings) ? F.mappings : [], ee = eh(X, j), te = Object.keys(j).length;
    Q.mappingFilters = j, U.disabled = te === 0, th(R, {
      totalCount: X.length,
      visibleCount: ee.length,
      hasFilters: te > 0,
      activeFilterCount: te
    }), _.classList.toggle("has-active-filters", te > 0), nh(ae, F, u, M, {
      mappings: ee,
      categoryOrder: d
    }), Q.selectedMapping = ae.value ?? "", Uo({
      mappingSelect: ae,
      applyMappingButton: Z,
      updateMappingButton: $e,
      editCriteriaButton: Ze,
      removeMappingButton: et,
      actionsMenu: ie,
      state: F
    }), ie.classList.contains("is-disabled") && dt();
  }, "refreshMappingSelector");
  z.querySelectorAll("select[data-filter-category-id]").forEach((M) => {
    M.addEventListener("change", () => {
      const j = Q.selectedMapping;
      Oe(j), Q.selectedMapping !== j && Vo(
        a ?? r,
        F,
        Q.selectedMapping
      ).then((X) => {
        X && (F = X);
      });
    });
  }), U.addEventListener("click", () => {
    Zg(z);
    const M = Q.selectedMapping;
    Oe(M), _.open = !1, Q.selectedMapping !== M && Vo(
      a ?? r,
      F,
      Q.selectedMapping
    ).then((j) => {
      j && (F = j);
    });
  }), ae.addEventListener("change", () => {
    Q.selectedMapping = ae.value ?? "", Uo({
      mappingSelect: ae,
      applyMappingButton: Z,
      updateMappingButton: $e,
      editCriteriaButton: Ze,
      removeMappingButton: et,
      actionsMenu: ie,
      state: F
    }), Vo(
      a ?? r,
      F,
      Q.selectedMapping
    ).then((M) => {
      M && (F = M);
    });
  });
  const Fi = /* @__PURE__ */ c(async () => {
    var ee, te, le, ce, nt, Jt, it, Kt, ge, Yt, Qt, St, Mn, _i;
    const M = ae.value ?? "";
    if (!M) {
      (te = (ee = ui.notifications) == null ? void 0 : ee.warn) == null || te.call(
        ee,
        v(
          "EIDOLON.LightCriteria.SelectMappingWarning",
          "Choose a criteria mapping before applying."
        )
      ), Oe(Q.selectedMapping);
      return;
    }
    if (M === he) {
      if (!(F != null && F.base)) {
        (ce = (le = ui.notifications) == null ? void 0 : le.warn) == null || ce.call(
          le,
          v(
            "EIDOLON.LightCriteria.BaseUnavailable",
            "Set a base lighting state before applying it."
          )
        );
        return;
      }
      Ur(w, Te, $), na(n, t, F.base), F = await Gi(a ?? r, {
        mappingId: he,
        categories: null,
        updatedAt: Date.now()
      }), Q.selectedMapping = he, Oe(Q.selectedMapping), kn(k, F), $n({ switcher: D, emptyState: ze, state: F }), Hi($, {
        state: F,
        hasCategories: l.length > 0
      }), yc(t, {
        mappingId: he,
        color: ((Jt = (nt = F.base) == null ? void 0 : nt.config) == null ? void 0 : Jt.color) ?? null
      }), (Kt = (it = ui.notifications) == null ? void 0 : it.info) == null || Kt.call(
        it,
        v(
          "EIDOLON.LightCriteria.BaseApplied",
          "Applied the base lighting state to the form."
        )
      ), dt();
      return;
    }
    const j = Array.isArray(F == null ? void 0 : F.mappings) && F.mappings.length ? F.mappings.find((oi) => (oi == null ? void 0 : oi.id) === M) : null;
    if (!j) {
      (Yt = (ge = ui.notifications) == null ? void 0 : ge.warn) == null || Yt.call(
        ge,
        v(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      ), Q.selectedMapping = "", Oe(Q.selectedMapping);
      return;
    }
    Ur(w, Te, $), na(n, t, j.config), F = await Gi(a ?? r, {
      mappingId: j.id,
      categories: j.categories,
      updatedAt: Date.now()
    }), Q.selectedMapping = j.id, Oe(Q.selectedMapping), kn(k, F), $n({ switcher: D, emptyState: ze, state: F }), Hi($, {
      state: F,
      hasCategories: l.length > 0
    }), yc(t, {
      mappingId: j.id,
      color: ((St = (Qt = j.config) == null ? void 0 : Qt.config) == null ? void 0 : St.color) ?? null
    });
    const X = wi(j, u, d);
    (_i = (Mn = ui.notifications) == null ? void 0 : Mn.info) == null || _i.call(
      Mn,
      v(
        "EIDOLON.LightCriteria.MappingApplied",
        "Applied mapping: {label}"
      ).replace("{label}", X)
    ), dt();
  }, "applySelectedMapping");
  Z.addEventListener("click", () => {
    Fi();
  }), ae.addEventListener("keydown", (M) => {
    M.key === "Enter" && (M.preventDefault(), Fi());
  });
  const $r = /* @__PURE__ */ c(async () => {
    var j, X, ee, te, le, ce, nt, Jt, it, Kt, ge, Yt, Qt, St, Mn, _i, oi, Fr, Ul, Pr, Vl;
    const M = Q.selectedMapping;
    if (!M) {
      (X = (j = ui.notifications) == null ? void 0 : j.warn) == null || X.call(
        j,
        v(
          "EIDOLON.LightCriteria.SelectMappingWarning",
          "Choose a criteria mapping before applying."
        )
      );
      return;
    }
    $e.disabled = !0;
    try {
      const Ge = ta(n, a);
      if (M === he)
        F = await lc(a ?? r, Ge), O("LightCriteria | Base lighting updated", {
          lightId: ((ee = a ?? r) == null ? void 0 : ee.id) ?? null,
          configColor: ((te = Ge == null ? void 0 : Ge.config) == null ? void 0 : te.color) ?? null
        }), (ce = (le = ui.notifications) == null ? void 0 : le.info) == null || ce.call(
          le,
          v(
            "EIDOLON.LightCriteria.BaseUpdated",
            "Updated the base lighting state with the current configuration."
          )
        ), Q.selectedMapping = he;
      else {
        const si = Wi(F, M);
        if (!si) {
          (Jt = (nt = ui.notifications) == null ? void 0 : nt.warn) == null || Jt.call(
            nt,
            v(
              "EIDOLON.LightCriteria.MappingUnavailable",
              "The selected criteria mapping is no longer available."
            )
          ), Q.selectedMapping = "", Oe(Q.selectedMapping);
          return;
        }
        F = await cc(
          a ?? r,
          si.categories,
          Ge,
          { label: si.label ?? null }
        ), O("LightCriteria | Mapping updated", {
          mappingId: M,
          hasColor: !!((it = Ge == null ? void 0 : Ge.config) != null && it.color),
          stored: Array.isArray(F == null ? void 0 : F.mappings) ? ((Kt = F.mappings.find((No) => (No == null ? void 0 : No.id) === M)) == null ? void 0 : Kt.config) ?? null : null,
          persisted: (Yt = (ge = a ?? r) == null ? void 0 : ge.getFlag) == null ? void 0 : Yt.call(ge, Xn, bi)
        });
        const xi = Wi(F, M), tf = wi(xi || si, u, d);
        O("LightCriteria | Mapping updated", {
          mappingId: M,
          categories: si.categories,
          updatedColor: ((Qt = Ge == null ? void 0 : Ge.config) == null ? void 0 : Qt.color) ?? null,
          storedColor: ((Mn = (St = xi == null ? void 0 : xi.config) == null ? void 0 : St.config) == null ? void 0 : Mn.color) ?? ((oi = (_i = si.config) == null ? void 0 : _i.config) == null ? void 0 : oi.color) ?? null
        }), (Ul = (Fr = ui.notifications) == null ? void 0 : Fr.info) == null || Ul.call(
          Fr,
          v(
            "EIDOLON.LightCriteria.MappingUpdated",
            "Saved changes to mapping: {label}"
          ).replace("{label}", tf)
        ), Q.selectedMapping = M;
      }
      kn(k, F), $n({ switcher: D, emptyState: ze, state: F }), Hi($, {
        state: F,
        hasCategories: l.length > 0
      }), Oe(Q.selectedMapping), dt();
    } catch (Ge) {
      console.error("eidolon-utilities | Failed to update light criteria mapping", Ge), (Vl = (Pr = ui.notifications) == null ? void 0 : Pr.error) == null || Vl.call(
        Pr,
        v(
          "EIDOLON.LightCriteria.MappingUpdateError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      $e.disabled = !1, Uo({
        mappingSelect: ae,
        applyMappingButton: Z,
        updateMappingButton: $e,
        editCriteriaButton: Ze,
        removeMappingButton: et,
        actionsMenu: ie,
        state: F
      });
    }
  }, "updateSelectedMapping");
  $e.addEventListener("click", () => {
    $r();
  }), Oe(Q.selectedMapping), A.addEventListener("click", async () => {
    var M, j, X, ee, te, le;
    A.disabled = !0;
    try {
      const ce = ta(n, a);
      F = await lc(a ?? r, ce), O("LightCriteria | Base lighting stored", {
        lightId: ((M = a ?? r) == null ? void 0 : M.id) ?? null,
        configColor: ((j = ce == null ? void 0 : ce.config) == null ? void 0 : j.color) ?? null
      }), (ee = (X = ui.notifications) == null ? void 0 : X.info) == null || ee.call(
        X,
        v(
          "EIDOLON.LightCriteria.BaseStored",
          "Saved the current configuration as the base lighting state."
        )
      ), kn(k, F), $n({ switcher: D, emptyState: ze, state: F }), Hi($, {
        state: F,
        hasCategories: l.length > 0
      }), Q.selectedMapping = he, Oe(Q.selectedMapping);
    } catch (ce) {
      console.error("eidolon-utilities | Failed to store base light criteria state", ce), (le = (te = ui.notifications) == null ? void 0 : te.error) == null || le.call(
        te,
        v(
          "EIDOLON.LightCriteria.BaseError",
          "Failed to save the base lighting state. Check the console for details."
        )
      );
    } finally {
      A.disabled = !1;
    }
  }), $.addEventListener("click", () => {
    var j, X, ee, te;
    if (!(F != null && F.base)) {
      (X = (j = ui.notifications) == null ? void 0 : j.warn) == null || X.call(
        j,
        v(
          "EIDOLON.LightCriteria.RequiresBase",
          "Set a base lighting state before adding criteria mappings."
        )
      );
      return;
    }
    if (l.length === 0) {
      (te = (ee = ui.notifications) == null ? void 0 : ee.warn) == null || te.call(
        ee,
        v(
          "EIDOLON.LightCriteria.NoCategoriesAvailable",
          "Add scene criteria with values in the Scene configuration before creating mappings."
        )
      );
      return;
    }
    const M = ea.get(w);
    pc({
      app: n,
      fieldset: w,
      createButton: $,
      creationSection: Te,
      categoryList: Dt,
      form: t,
      persistedLight: a,
      stateEntry: M,
      mode: "create",
      mapping: null,
      preloadConfig: F.base
    });
  }), Ze.addEventListener("click", () => {
    var X, ee, te, le;
    const M = Q.selectedMapping;
    if (!M || M === he) {
      (ee = (X = ui.notifications) == null ? void 0 : X.warn) == null || ee.call(
        X,
        v(
          "EIDOLON.LightCriteria.SelectMappingForCriteriaEdit",
          "Select a mapping before editing criteria."
        )
      );
      return;
    }
    const j = Wi(F, M);
    if (!j) {
      (le = (te = ui.notifications) == null ? void 0 : te.warn) == null || le.call(
        te,
        v(
          "EIDOLON.LightCriteria.MappingUnavailable",
          "The selected criteria mapping is no longer available."
        )
      );
      return;
    }
    dt(), ld(n, { fieldset: w, homeContainer: i }), pc({
      app: n,
      fieldset: w,
      createButton: $,
      creationSection: Te,
      categoryList: Dt,
      form: t,
      persistedLight: a,
      stateEntry: Q,
      mode: "retarget",
      mapping: j,
      preloadConfig: j.config
    });
  }), tt.addEventListener("click", async () => {
    var j, X, ee, te, le, ce, nt, Jt, it, Kt;
    const M = oh(Dt);
    if (!M) {
      (X = (j = ui.notifications) == null ? void 0 : j.warn) == null || X.call(
        j,
        v(
          "EIDOLON.LightCriteria.SelectionRequired",
          "Select at least one criteria value to identify the mapping."
        )
      );
      return;
    }
    tt.disabled = !0;
    try {
      const ge = ta(n, a);
      if (Q.editorMode === "retarget" && Q.editingMappingId) {
        const Qt = Hs(F, M);
        let St = !1;
        if (Qt && Qt !== Q.editingMappingId && (St = await qg(), !St)) {
          tt.disabled = !1;
          return;
        }
        F = await Lm(
          a ?? r,
          Q.editingMappingId,
          M,
          ge,
          { replaceExisting: St }
        ), O("LightCriteria | Mapping criteria retargeted", {
          mappingId: Q.editingMappingId,
          categories: M,
          replaced: St,
          configColor: ((ee = ge == null ? void 0 : ge.config) == null ? void 0 : ee.color) ?? null
        }), (le = (te = ui.notifications) == null ? void 0 : te.info) == null || le.call(
          te,
          v(
            "EIDOLON.LightCriteria.MappingCriteriaUpdated",
            "Updated mapping criteria for the selected mapping."
          )
        );
      } else
        F = await cc(
          a ?? r,
          M,
          ge,
          {}
        ), O("LightCriteria | Mapping saved from editor", {
          categories: M,
          configColor: ((ce = ge == null ? void 0 : ge.config) == null ? void 0 : ce.color) ?? null
        }), (Jt = (nt = ui.notifications) == null ? void 0 : nt.info) == null || Jt.call(
          nt,
          v(
            "EIDOLON.LightCriteria.MappingSaved",
            "Updated lighting mapping for the selected scene criteria."
          )
        );
      kn(k, F), $n({ switcher: D, emptyState: ze, state: F });
      const Yt = Hs(F, M);
      Yt && (Q.selectedMapping = Yt), Oe(Q.selectedMapping), Ur(w, Te, $), dt();
    } catch (ge) {
      console.error("eidolon-utilities | Failed to persist light criteria mapping", ge), (Kt = (it = ui.notifications) == null ? void 0 : it.error) == null || Kt.call(
        it,
        v(
          "EIDOLON.LightCriteria.MappingError",
          "Failed to save the mapping. Check the console for details."
        )
      );
    } finally {
      tt.disabled = !1;
    }
  }), Ft.addEventListener("click", () => {
    const M = ea.get(w);
    M != null && M.restoreConfig && na(n, t, M.restoreConfig), Ur(w, Te, $);
  }), et.addEventListener("click", async () => {
    var X, ee;
    const M = Q.selectedMapping;
    !M || M === he || !await jg() || (F = await Im(a ?? r, M), Q.selectedMapping = "", kn(k, F), $n({ switcher: D, emptyState: ze, state: F }), Oe(Q.selectedMapping), dt(), (ee = (X = ui.notifications) == null ? void 0 : X.info) == null || ee.call(
      X,
      v("EIDOLON.LightCriteria.MappingRemoved", "Removed selected mapping.")
    ));
  });
}
c(Hg, "enhanceAmbientLightConfig");
function pc({
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
  s && (s.restoreConfig = ta(n, o), s.editorMode = l, s.editingMappingId = l === "retarget" ? (u == null ? void 0 : u.id) ?? null : null), d && na(n, a, d), l === "retarget" && (u != null && u.categories) ? ah(r, u.categories) : rh(r);
  const m = i.querySelector("p.notes");
  m instanceof HTMLElement && (m.textContent = l === "retarget" ? v(
    "EIDOLON.LightCriteria.EditCriteriaDescription",
    "Adjust criteria values for the selected mapping."
  ) : v(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const g = i.querySelector('button[data-action="save-mapping"]');
  g instanceof HTMLButtonElement && (g.textContent = l === "retarget" ? v("EIDOLON.LightCriteria.SaveCriteriaChanges", "Save Criteria Changes") : v("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), i.hidden = !1, t.setAttribute("aria-expanded", "true"), Nl(e, i), requestAnimationFrame(() => {
    var h;
    (h = n.setPosition) == null || h.call(n, { height: "auto" });
  });
}
c(pc, "openMappingEditor");
async function qg() {
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
c(qg, "confirmCriteriaConflict");
async function jg() {
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
c(jg, "confirmRemoveMapping");
function Bg(n, { fieldset: e, homeContainer: t }) {
  const i = zg(n, t);
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
    o.preventDefault(), ld(n, { fieldset: e, homeContainer: t });
  };
}
c(Bg, "ensureManagerHeaderButton");
function ld(n, { fieldset: e, homeContainer: t }) {
  var g, h, y;
  const i = Br.get(n);
  if (i != null && i.rendered) {
    (g = i.bringToTop) == null || g.call(i);
    return;
  }
  const r = /* @__PURE__ */ c((...p) => {
    var E;
    const w = Ug(p), b = (E = w == null ? void 0 : w.querySelector) == null ? void 0 : E.call(w, ".eidolon-light-criteria-manager-host");
    b instanceof HTMLElement && (Vg(e), e.hidden = !1, b.appendChild(e));
  }, "onRender"), a = /* @__PURE__ */ c(() => {
    t instanceof HTMLElement && t.appendChild(e), e.hidden = !0, Br.delete(n), requestAnimationFrame(() => {
      var p;
      (p = n.setPosition) == null || p.call(n, { height: "auto" });
    });
  }, "onClose"), o = v("EIDOLON.LightCriteria.ManagerTitle", "Scene Criteria Lighting"), s = '<div class="eidolon-light-criteria-manager-host"></div>', l = v("EIDOLON.LightCriteria.Close", "Close"), u = (y = (h = foundry == null ? void 0 : foundry.applications) == null ? void 0 : h.api) == null ? void 0 : y.DialogV2;
  if (typeof (u == null ? void 0 : u.wait) == "function")
    try {
      let p = !1;
      const w = /* @__PURE__ */ c(() => {
        p || (p = !0, a());
      }, "closeOnce");
      Br.set(n, {
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
    } catch (p) {
      console.warn("eidolon-utilities | DialogV2 manager failed, falling back to Dialog", p), a();
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
      render: /* @__PURE__ */ c((...p) => r(...p), "render"),
      close: a
    },
    {
      width: 640,
      resizable: !0
    }
  );
  Br.set(n, m), m.render(!0);
}
c(ld, "openManagerDialog");
function Ug(n) {
  for (const e of n) {
    const t = Gt(e);
    if (t) return t;
    const i = Gt(e == null ? void 0 : e.element);
    if (i) return i;
  }
  return null;
}
c(Ug, "findDialogRoot");
function Vg(n) {
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
    const g = document.createElement("div");
    g.classList.add("eidolon-light-criteria-manager__warnings");
    for (const h of o) g.appendChild(h);
    l.appendChild(g);
  }
  const m = document.createElement("div");
  m.classList.add("eidolon-light-criteria-manager__header"), m.textContent = v("EIDOLON.LightCriteria.ManagerAuthoring", "Create or Update Mapping"), u.appendChild(m), a && u.appendChild(a), n.innerHTML = "", e && n.appendChild(e), t && n.appendChild(t), n.appendChild(s), Nl(n, a);
}
c(Vg, "applyManagerLayout");
function zg(n, e) {
  var i;
  const t = Gt(n == null ? void 0 : n.element);
  return t || (((i = e == null ? void 0 : e.closest) == null ? void 0 : i.call(e, ".application")) ?? null);
}
c(zg, "resolveApplicationRoot");
function Ur(n, e, t) {
  const i = ea.get(n);
  i && (i.restoreConfig = null, i.editorMode = "create", i.editingMappingId = null), e.hidden = !0, t.setAttribute("aria-expanded", "false");
  const r = e.querySelector("p.notes");
  r instanceof HTMLElement && (r.textContent = v(
    "EIDOLON.LightCriteria.CreateDescription",
    "Assign scene criteria values to map the current configuration."
  ));
  const a = e.querySelector('button[data-action="save-mapping"]');
  a instanceof HTMLButtonElement && (a.textContent = v("EIDOLON.LightCriteria.SaveMapping", "Save Mapping")), Nl(n, e), requestAnimationFrame(() => {
    var o, s;
    (s = (o = i == null ? void 0 : i.app) == null ? void 0 : o.setPosition) == null || s.call(o, { height: "auto" });
  });
}
c(Ur, "hideCreationSection");
function kn(n, e) {
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
c(kn, "updateStatusLine");
function Hi(n, { state: e, hasCategories: t }) {
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
c(Hi, "updateCreateButtonState");
function ta(n, e) {
  var l, u, d;
  const t = e ?? cd(n);
  if (!t)
    throw new Error("Ambient light document unavailable.");
  const i = ii(((l = t.toObject) == null ? void 0 : l.call(t)) ?? {});
  if (!i)
    throw new Error("Unable to duplicate ambient light data.");
  const r = (n == null ? void 0 : n.form) instanceof HTMLFormElement ? n.form : null, a = r ? Nf(r) : {}, o = foundry.utils.mergeObject(i, a, {
    inplace: !1,
    performDeletions: !0
  });
  r && (r.querySelectorAll("color-picker[name]").forEach((m) => {
    var b, E;
    const g = m.getAttribute("name");
    if (!g) return;
    const h = typeof m.value == "string" ? m.value : "", y = ((b = m.ui) == null ? void 0 : b.input) ?? ((E = m.querySelector) == null ? void 0 : E.call(m, 'input[type="color"]')), p = (y == null ? void 0 : y.value) ?? "", w = h || p;
    typeof w != "string" || !w || (foundry.utils.setProperty(o, g, w), O("LightCriteria | Captured color-picker value", {
      path: g,
      pickerValue: h,
      swatchValue: p,
      chosenValue: w
    }));
  }), r.querySelectorAll("range-picker[name]").forEach((m) => {
    var $, k;
    const g = m.getAttribute("name");
    if (!g) return;
    const h = m.value !== void 0 && m.value !== null ? String(m.value) : "", y = ($ = m.querySelector) == null ? void 0 : $.call(m, 'input[type="range"]'), p = (k = m.querySelector) == null ? void 0 : k.call(m, 'input[type="number"]'), w = y instanceof HTMLInputElement ? y.value : "", b = p instanceof HTMLInputElement ? p.value : "", E = h || b || w;
    if (typeof E != "string" || !E.length) return;
    const L = Number(E), A = Number.isFinite(L) ? L : E;
    foundry.utils.setProperty(o, g, A), O("LightCriteria | Captured range-picker value", {
      path: g,
      elementValue: h,
      numberValue: b,
      rangeValue: w,
      chosenValue: A
    });
  }));
  const s = ii(o);
  return O("LightCriteria | Captured form config", {
    lightId: (t == null ? void 0 : t.id) ?? null,
    hasColor: !!((u = s == null ? void 0 : s.config) != null && u.color),
    color: ((d = s == null ? void 0 : s.config) == null ? void 0 : d.color) ?? null
  }), s;
}
c(ta, "captureAmbientLightFormConfig");
function na(n, e, t) {
  if (!t || typeof t != "object") return;
  const i = foundry.utils.flattenObject(t, { safe: !0 });
  for (const [r, a] of Object.entries(i)) {
    const o = e.querySelectorAll(`[name="${r}"]`);
    if (o.length) {
      O("LightCriteria | Applying field", {
        path: r,
        value: a,
        elementCount: o.length
      });
      for (const s of o)
        s instanceof HTMLElement && s.tagName === "COLOR-PICKER" ? Wg(s, a) : s instanceof HTMLElement && s.tagName === "RANGE-PICKER" ? Jg(s, a) : s instanceof HTMLInputElement ? Gg(s, a) : s instanceof HTMLSelectElement ? Kg(s, a) : s instanceof HTMLTextAreaElement && Yg(s, a);
    }
  }
  requestAnimationFrame(() => {
    var r;
    return (r = n._previewChanges) == null ? void 0 : r.call(n);
  });
}
c(na, "applyConfigToForm");
function Gg(n, e, t) {
  const i = n.type;
  if (i === "checkbox") {
    const o = !!e;
    n.checked !== o && (n.checked = o, Et(n));
    return;
  }
  if (i === "radio") {
    const o = e == null ? "" : String(e), s = n.value === o;
    n.checked !== s && (n.checked = s, s && Et(n));
    return;
  }
  const r = e == null ? "" : String(e);
  let a = !1;
  n.value !== r && (n.value = r, a = !0), a && Et(n);
}
c(Gg, "applyValueToInput");
function Wg(n, e, t) {
  var s, l, u, d, m, g;
  const i = e == null ? "" : String(e);
  let r = !1;
  n.value !== i && (n.value = i, n.setAttribute("value", i), (s = n.ui) != null && s.setValue && n.ui.setValue(i), r = !0);
  const a = ((l = n.ui) == null ? void 0 : l.input) ?? ((u = n.querySelector) == null ? void 0 : u.call(n, 'input[type="color"]'));
  a instanceof HTMLInputElement && a.value !== i && (a.value = i, Et(a));
  const o = ((d = n.ui) == null ? void 0 : d.text) ?? ((m = n.querySelector) == null ? void 0 : m.call(n, 'input[type="text"]'));
  o instanceof HTMLInputElement && o.value !== i && (o.value = i, Et(o)), (g = n.ui) != null && g.commit ? n.ui.commit() : (n.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), n.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }))), O("LightCriteria | Color picker applied", {
    value: i,
    pickerValue: n.value ?? null,
    swatchValue: (a == null ? void 0 : a.value) ?? null,
    textValue: (o == null ? void 0 : o.value) ?? null
  }), r && Et(n);
}
c(Wg, "applyValueToColorPicker");
function Jg(n, e, t) {
  var u, d;
  const i = e == null ? "" : String(e), r = Number(i), a = Number.isFinite(r) ? r : i;
  let o = !1;
  n.value !== void 0 && n.value !== a && (n.value = a, o = !0), n.getAttribute("value") !== i && (n.setAttribute("value", i), o = !0);
  const s = (u = n.querySelector) == null ? void 0 : u.call(n, 'input[type="range"]');
  s instanceof HTMLInputElement && s.value !== i && (s.value = i, Et(s));
  const l = (d = n.querySelector) == null ? void 0 : d.call(n, 'input[type="number"]');
  if (l instanceof HTMLInputElement && l.value !== i && (l.value = i, Et(l)), typeof n.commit == "function")
    try {
      n.commit();
    } catch (m) {
      console.error("eidolon-utilities | range-picker commit failed", m);
    }
  O("LightCriteria | Range picker applied", {
    value: i,
    resolvedValue: a,
    rangeValue: (s == null ? void 0 : s.value) ?? null,
    numberValue: (l == null ? void 0 : l.value) ?? null
  }), o && Et(n);
}
c(Jg, "applyValueToRangePicker");
function Kg(n, e, t) {
  const i = e == null ? "" : String(e);
  n.value !== i && (n.value = i, Et(n));
}
c(Kg, "applyValueToSelect");
function Yg(n, e, t) {
  const i = e == null ? "" : String(e);
  n.value !== i && (n.value = i, Et(n));
}
c(Yg, "applyValueToTextarea");
function Et(n) {
  n.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), n.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }));
}
c(Et, "triggerInputChange");
function Uo({
  mappingSelect: n,
  applyMappingButton: e,
  updateMappingButton: t,
  editCriteriaButton: i,
  removeMappingButton: r,
  actionsMenu: a,
  state: o
}) {
  const s = (n == null ? void 0 : n.value) ?? "", l = !!(o != null && o.base), u = s && s !== he ? !!Wi(o, s) : !1;
  if (e instanceof HTMLButtonElement && (s ? s === he ? e.disabled = !l : e.disabled = !u : e.disabled = !0), t instanceof HTMLButtonElement && (s ? s === he ? t.disabled = !1 : t.disabled = !u : t.disabled = !0), i instanceof HTMLButtonElement && (i.disabled = !s || s === he || !u), r instanceof HTMLButtonElement && (r.disabled = !s || s === he || !u), a instanceof HTMLElement) {
    const d = t instanceof HTMLButtonElement && !t.disabled || i instanceof HTMLButtonElement && !i.disabled || r instanceof HTMLButtonElement && !r.disabled;
    a.classList.toggle("is-disabled", !d), !d && "open" in a && (a.open = !1);
  }
}
c(Uo, "syncMappingSwitcherState");
function Qg(n) {
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
c(Qg, "buildCategoryNameLookup");
function Xg(n) {
  const e = {};
  return n instanceof HTMLElement && n.querySelectorAll("select[data-filter-category-id]").forEach((t) => {
    var a, o;
    const i = t.dataset.filterCategoryId, r = (o = (a = t.value) == null ? void 0 : a.trim) == null ? void 0 : o.call(a);
    !i || !r || (e[i] = r);
  }), e;
}
c(Xg, "readMappingFilterSelections");
function Zg(n) {
  n instanceof HTMLElement && n.querySelectorAll("select[data-filter-category-id]").forEach((e) => {
    e.value = "";
  });
}
c(Zg, "resetMappingFilterSelections");
function eh(n, e) {
  const t = Array.isArray(n) ? n : [], i = Object.entries(e ?? {}).filter(([, r]) => !!r);
  return i.length ? t.filter((r) => {
    if (!r || typeof r != "object") return !1;
    const a = r.categories ?? {};
    for (const [o, s] of i)
      if ((a == null ? void 0 : a[o]) !== s) return !1;
    return !0;
  }) : t.slice();
}
c(eh, "filterMappingsByCriteria");
function th(n, { totalCount: e = 0, visibleCount: t = 0, hasFilters: i = !1, activeFilterCount: r = 0 } = {}) {
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
c(th, "updateMappingFilterMeta");
function nh(n, e, t, i, r = {}) {
  if (!(n instanceof HTMLSelectElement)) return;
  const a = typeof i == "string" ? i : "", o = !!(e != null && e.base), s = Array.isArray(r == null ? void 0 : r.categoryOrder) ? r.categoryOrder : [], l = Array.isArray(r == null ? void 0 : r.mappings) ? r.mappings.slice() : Array.isArray(e == null ? void 0 : e.mappings) ? e.mappings.slice() : [], u = n.value;
  n.innerHTML = "";
  const d = document.createElement("option");
  d.value = "", d.textContent = v(
    "EIDOLON.LightCriteria.SelectPlaceholder",
    "Select a mapping"
  ), d.disabled = o, n.appendChild(d);
  const m = document.createElement("option");
  m.value = he, m.textContent = v(
    "EIDOLON.LightCriteria.BaseOption",
    "Base Lighting"
  ), m.disabled = !o, n.appendChild(m), l.slice().sort((p, w) => {
    var L;
    const b = wi(p, t, s), E = wi(w, t, s);
    return b.localeCompare(E, ((L = game.i18n) == null ? void 0 : L.lang) ?? void 0, {
      sensitivity: "base"
    });
  }).forEach((p) => {
    if (!(p != null && p.id)) return;
    const w = document.createElement("option");
    w.value = p.id, w.textContent = wi(p, t, s), n.appendChild(w);
  });
  const g = new Set(
    Array.from(n.options).filter((p) => !p.disabled).map((p) => p.value)
  ), h = o && u === "" ? "" : u, y = a || (g.has(h) ? h : "");
  y && g.has(y) ? n.value = y : o ? n.value = he : n.value = "";
}
c(nh, "populateMappingSelector");
function wi(n, e, t = []) {
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
c(wi, "formatMappingOptionLabel");
function Hs(n, e) {
  if (!n || typeof n != "object" || !Array.isArray(n.mappings)) return null;
  const t = $i(e);
  if (!t) return null;
  const i = n.mappings.find((r) => (r == null ? void 0 : r.key) === t);
  return (i == null ? void 0 : i.id) ?? null;
}
c(Hs, "findMappingIdByCategories");
function Wi(n, e) {
  return !e || !n || typeof n != "object" || !Array.isArray(n.mappings) ? null : n.mappings.find((t) => (t == null ? void 0 : t.id) === e) ?? null;
}
c(Wi, "getMappingById");
function ih(n) {
  if (!n || typeof n != "object") return "";
  const e = n.current;
  if (e != null && e.mappingId) {
    if (e.mappingId === he)
      return n != null && n.base ? he : "";
    if (Array.isArray(n.mappings) && n.mappings.some((t) => t.id === e.mappingId))
      return e.mappingId;
  }
  if (e != null && e.categories) {
    const t = Hs(n, e.categories);
    if (t) return t;
  }
  return "";
}
c(ih, "resolveInitialMappingSelection");
function yc(n, e = {}) {
  var o, s, l, u;
  if (!(n instanceof HTMLFormElement)) return;
  const t = n.querySelector('color-picker[name="config.color"]'), i = (t == null ? void 0 : t.value) ?? null, r = ((o = t == null ? void 0 : t.ui) == null ? void 0 : o.text) ?? ((s = t == null ? void 0 : t.querySelector) == null ? void 0 : s.call(t, 'input[type="text"]')), a = ((l = t == null ? void 0 : t.ui) == null ? void 0 : l.input) ?? ((u = t == null ? void 0 : t.querySelector) == null ? void 0 : u.call(t, 'input[type="color"]'));
  O("LightCriteria | Color state after apply", {
    ...e,
    textValue: (r == null ? void 0 : r.value) ?? null,
    pickerValue: i,
    swatchValue: (a == null ? void 0 : a.value) ?? null
  });
}
c(yc, "logAppliedColorState");
function rh(n) {
  n.querySelectorAll("select[data-category-id]").forEach((e) => {
    e.value = "";
  });
}
c(rh, "resetCategorySelections");
function ah(n, e) {
  const t = e && typeof e == "object" ? e : {};
  n.querySelectorAll("select[data-category-id]").forEach((i) => {
    const r = i.dataset.categoryId;
    if (!r) return;
    const a = t[r];
    i.value = typeof a == "string" ? a : "";
  });
}
c(ah, "setCategorySelections");
function oh(n) {
  const e = {};
  return n.querySelectorAll("select[data-category-id]").forEach((t) => {
    var a, o;
    const i = t.dataset.categoryId, r = (o = (a = t.value) == null ? void 0 : a.trim) == null ? void 0 : o.call(a);
    !i || !r || (e[i] = r);
  }), Object.keys(e).length > 0 ? e : null;
}
c(oh, "readCategorySelections");
async function Vo(n, e, t) {
  if (!n) return null;
  try {
    if (!t)
      return await Gi(n, {});
    if (t === he)
      return await Gi(n, {
        mappingId: he,
        categories: null,
        updatedAt: Date.now()
      });
    const i = Wi(e, t);
    return i ? await Gi(n, {
      mappingId: i.id,
      categories: i.categories,
      updatedAt: Date.now()
    }) : null;
  } catch (i) {
    return console.warn("eidolon-utilities | Failed to persist mapping selection", i), null;
  }
}
c(Vo, "persistCurrentSelection");
function Nl(n, e) {
  if (!(n instanceof HTMLElement)) return;
  const t = n.querySelector(".eidolon-light-criteria-manager__section.is-bottom");
  t instanceof HTMLElement && (t.hidden = !!(e != null && e.hidden));
}
c(Nl, "updateManagerSectionVisibility");
function $n({ switcher: n, emptyState: e, state: t }) {
  const i = !!(t != null && t.base);
  n instanceof HTMLElement && (n.hidden = !i), e instanceof HTMLElement && (e.hidden = i);
}
c($n, "updateActiveMappingVisibility");
function cd(n) {
  const e = (n == null ? void 0 : n.object) ?? (n == null ? void 0 : n.document) ?? null;
  return !(e != null && e.isEmbedded) || e.documentName !== "AmbientLight" ? null : e;
}
c(cd, "getAmbientLightDocument");
function sh(n) {
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
c(sh, "getPersistedAmbientLightDocument");
function lh() {
  xg();
}
c(lh, "registerLightCriteriaHooks");
lh();
const qs = /* @__PURE__ */ new Map();
let js = !1;
function Ml(n, e) {
  qs.has(n) && console.warn(`[${T}] Socket handler for type "${n}" already registered, overwriting.`), qs.set(n, e);
}
c(Ml, "registerSocketHandler");
function ia(n, e) {
  if (!js) {
    console.error(`[${T}] Socket not initialized. Call initializeSocket() first.`);
    return;
  }
  game.socket.emit(`module.${T}`, { type: n, payload: e });
}
c(ia, "emitSocket");
function ch() {
  js || (game.socket.on(`module.${T}`, (n) => {
    const { type: e, payload: t } = n ?? {}, i = qs.get(e);
    i ? i(t) : console.warn(`[${T}] No socket handler for type "${e}"`);
  }), js = !0, console.log(`[${T}] Socket initialized on channel module.${T}`));
}
c(ch, "initializeSocket");
const ud = "tween", dd = "tween-sequence", Bs = "tween-sequence-cancel", Se = Object.freeze({
  ABORT: "abort",
  CONTINUE: "continue"
}), Xt = Object.freeze({
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  FAILED: "failed"
}), ft = Object.freeze({
  BEFORE_ALL: "beforeAll",
  BEFORE_STEP: "before",
  ENTRY: "entry",
  AFTER_STEP: "after",
  RUNTIME: "runtime",
  VALIDATION: "validation",
  AWAIT: "await",
  EMIT: "emit",
  PARALLEL: "parallel"
}), Sa = /* @__PURE__ */ new Map();
function Wt({ type: n, execute: e, validate: t }) {
  Sa.has(n) && console.warn(`[tween-registry] Type "${n}" already registered, overwriting.`), Sa.set(n, { type: n, execute: e, validate: t ?? (() => {
  }) });
}
c(Wt, "registerTweenType");
function Nr(n) {
  return Sa.get(n);
}
c(Nr, "getTweenType");
function uh(n, e = {}) {
  const t = Nr(n);
  if (!t)
    throw new Error(`Unknown tween type: "${n}".`);
  return t.validate(e ?? {}), t;
}
c(uh, "validateTweenEntry");
function Us() {
  return [...Sa.keys()];
}
c(Us, "listTweenTypes");
const vi = {
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
  easeInBounce: /* @__PURE__ */ c((n) => 1 - vi.easeOutBounce(1 - n), "easeInBounce"),
  easeInOutBounce: /* @__PURE__ */ c((n) => n < 0.5 ? (1 - vi.easeOutBounce(1 - 2 * n)) / 2 : (1 + vi.easeOutBounce(2 * n - 1)) / 2, "easeInOutBounce"),
  easeInElastic: /* @__PURE__ */ c((n) => n === 0 || n === 1 ? n : -Math.pow(2, 10 * (n - 1)) * Math.sin((n - 1.1) * 5 * Math.PI), "easeInElastic"),
  easeOutElastic: /* @__PURE__ */ c((n) => n === 0 || n === 1 ? n : Math.pow(2, -10 * n) * Math.sin((n - 0.1) * 5 * Math.PI) + 1, "easeOutElastic")
};
function Mr(n) {
  if (n && vi[n])
    return vi[n];
  const e = foundry.canvas.animation.CanvasAnimation;
  return {
    linear: e.easeLinear,
    easeInOutCosine: e.easeInOutCosine
  }[n] ?? e.easeInOutCosine;
}
c(Mr, "resolveEasing");
function dh() {
  return ["linear", "easeInOutCosine", ...Object.keys(vi)];
}
c(dh, "listEasingNames");
function Ta(n) {
  return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
}
c(Ta, "srgbToLinear");
function Ei(n) {
  return n <= 31308e-7 ? 12.92 * n : 1.055 * n ** (1 / 2.4) - 0.055;
}
c(Ei, "linearToSrgb");
function bc(n, e, t) {
  const i = 0.4122214708 * n + 0.5363325363 * e + 0.0514459929 * t, r = 0.2119034982 * n + 0.6806995451 * e + 0.1073969566 * t, a = 0.0883024619 * n + 0.2817188376 * e + 0.6299787005 * t, o = Math.cbrt(i), s = Math.cbrt(r), l = Math.cbrt(a);
  return [
    0.2104542553 * o + 0.793617785 * s - 0.0040720468 * l,
    1.9779984951 * o - 2.428592205 * s + 0.4505937099 * l,
    0.0259040371 * o + 0.7827717662 * s - 0.808675766 * l
  ];
}
c(bc, "linearRgbToOklab");
function fh(n, e, t) {
  const i = (n + 0.3963377774 * e + 0.2158037573 * t) ** 3, r = (n - 0.1055613458 * e - 0.0638541728 * t) ** 3, a = (n - 0.0894841775 * e - 1.291485548 * t) ** 3;
  return [
    4.0767416621 * i - 3.3077115913 * r + 0.2309699292 * a,
    -1.2684380046 * i + 2.6097574011 * r - 0.3413193965 * a,
    -0.0041960863 * i - 0.7034186147 * r + 1.707614701 * a
  ];
}
c(fh, "oklabToLinearRgb");
function Ca(n) {
  return [n.r, n.g, n.b];
}
c(Ca, "colorToRgb");
function fd(n, e, t) {
  const i = /* @__PURE__ */ c((a) => Math.max(0, Math.min(1, a)), "clamp"), r = /* @__PURE__ */ c((a) => Math.round(i(a) * 255).toString(16).padStart(2, "0"), "toHex");
  return `#${r(n)}${r(e)}${r(t)}`;
}
c(fd, "rgbToHex");
function mh(n, e, t) {
  if (t <= 0) return n.toHTML();
  if (t >= 1) return e.toHTML();
  const i = foundry.utils.Color, [r, a, o] = n.hsl, [s, l, u] = e.hsl, d = (s - r + 0.5) % 1 - 0.5, m = (r + d * t + 1) % 1, g = a + (l - a) * t, h = o + (u - o) * t;
  return i.fromHSL([m, g, h]).toHTML();
}
c(mh, "interpolateHsl");
function gh(n, e, t) {
  if (t <= 0) return n.toHTML();
  if (t >= 1) return e.toHTML();
  const [i, r, a] = Ca(n).map(Ta), [o, s, l] = Ca(e).map(Ta), u = Ei(i + (o - i) * t), d = Ei(r + (s - r) * t), m = Ei(a + (l - a) * t);
  return fd(u, d, m);
}
c(gh, "interpolateRgb");
function hh(n, e, t) {
  if (t <= 0) return n.toHTML();
  if (t >= 1) return e.toHTML();
  const [i, r, a] = Ca(n).map(Ta), [o, s, l] = Ca(e).map(Ta), [u, d, m] = bc(i, r, a), [g, h, y] = bc(o, s, l), p = 0.02, w = Math.sqrt(d * d + m * m), b = Math.sqrt(h * h + y * y);
  let E, L, A;
  if (w < p || b < p)
    E = u + (g - u) * t, L = d + (h - d) * t, A = m + (y - m) * t;
  else {
    const J = Math.atan2(m, d);
    let _ = Math.atan2(y, h) - J;
    _ > Math.PI && (_ -= 2 * Math.PI), _ < -Math.PI && (_ += 2 * Math.PI), E = u + (g - u) * t;
    const P = w + (b - w) * t, N = J + _ * t;
    L = P * Math.cos(N), A = P * Math.sin(N);
  }
  const [$, k, D] = fh(E, L, A);
  return fd(Ei($), Ei(k), Ei(D));
}
c(hh, "interpolateOklch");
const Vs = {
  hsl: mh,
  rgb: gh,
  oklch: hh
};
function ph(n = "hsl") {
  return Vs[n] ?? Vs.hsl;
}
c(ph, "getInterpolator");
function wc() {
  return Object.keys(Vs);
}
c(wc, "listInterpolationModes");
function yh(n) {
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
  if (n.mode && !wc().includes(n.mode))
    throw new Error(
      `light-color tween: unknown mode "${n.mode}". Available: ${wc().join(", ")}`
    );
}
c(yh, "validate$5");
async function bh(n, e = {}) {
  const { CanvasAnimation: t } = foundry.canvas.animation, { Color: i } = foundry.utils, { uuid: r, toColor: a, toAlpha: o, mode: s = "oklch" } = n, l = Array.isArray(r) ? r : [r];
  if (l.length === 0)
    return console.warn("light-color tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: u = 2e3,
    easing: d = "easeInOutCosine",
    commit: m = !0,
    startEpochMS: g = null,
    signal: h = null
  } = e, y = Mr(d), p = a != null, w = o != null, b = p ? ph(s) : null, E = p ? i.fromString(a) : null;
  if (p && !E.valid) throw new Error(`light-color tween: invalid target color "${a}".`);
  async function L($) {
    var z, H;
    if (h != null && h.aborted) return !1;
    const k = await fromUuid($);
    if (!k) return !1;
    const D = k.object;
    if (!D) return !1;
    let J;
    if (p) {
      const U = (z = k.config) == null ? void 0 : z.color;
      U != null && U.valid || console.warn(`light-color tween: source color invalid on ${$}, using white.`), J = U != null && U.valid ? U : i.fromString("#ffffff");
    }
    const K = w ? ((H = k._source.config) == null ? void 0 : H.alpha) ?? 0.5 : null, _ = { t: 0 }, P = `ambient-hue-tween:${$}`;
    t.terminateAnimation(P), h && h.addEventListener("abort", () => {
      t.terminateAnimation(P);
    }, { once: !0 });
    const N = typeof g == "number" ? Math.max(0, Math.min(u, Date.now() - g)) : 0, R = /* @__PURE__ */ c((U) => {
      const Y = {};
      p && (Y.color = b(J, E, U)), w && (Y.alpha = K + (o - K) * U), k.updateSource({ config: Y }), D.initializeLightSource();
    }, "applyFrame");
    N > 0 && (_.t = N / u, R(_.t));
    const V = await t.animate(
      [{ parent: _, attribute: "t", to: 1 }],
      {
        name: P,
        duration: u,
        easing: y,
        time: N,
        ontick: /* @__PURE__ */ c(() => R(_.t), "ontick")
      }
    );
    if (V !== !1) {
      if (h != null && h.aborted) return !1;
      const U = {};
      p && (U.color = E.toHTML()), w && (U.alpha = o), k.updateSource({ config: U }), D.initializeLightSource();
    }
    if (m && V !== !1 && k.canUserModify(game.user, "update")) {
      if (h != null && h.aborted) return !1;
      const U = {}, Y = {};
      p && (U.color = J.toHTML(), Y["config.color"] = E.toHTML()), w && (U.alpha = K, Y["config.alpha"] = o), k.updateSource({ config: U }), await k.update(Y);
    }
    return V !== !1;
  }
  return c(L, "animateOne"), (await Promise.all(l.map(L))).every(Boolean);
}
c(bh, "execute$5");
function wh() {
  Wt({ type: "light-color", execute: bh, validate: yh });
}
c(wh, "registerLightColorTween");
const Zt = /* @__PURE__ */ new WeakMap();
function vh(n) {
  if ((Array.isArray(n.uuid) ? n.uuid : [n.uuid]).some((t) => !t || typeof t != "string"))
    throw new Error("light-state tween: 'uuid' is required (string or array of AmbientLight document UUIDs).");
  if (typeof n.enabled != "boolean")
    throw new Error("light-state tween: 'enabled' (boolean) is required.");
}
c(vh, "validate$4");
async function Eh(n, e = {}) {
  const { CanvasAnimation: t } = foundry.canvas.animation, { uuid: i, enabled: r } = n, a = Array.isArray(i) ? i : [i];
  if (a.length === 0)
    return console.warn("light-state tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: o = 2e3,
    easing: s = "easeInOutCosine",
    commit: l = !0,
    startEpochMS: u = null,
    signal: d = null
  } = e, m = Mr(s);
  async function g(y) {
    var k, D, J, K;
    if (d != null && d.aborted) return !1;
    const p = await fromUuid(y);
    if (!p) return !1;
    const w = p.object;
    if (!w) return !1;
    const b = `ambient-state-tween:${y}`;
    t.terminateAnimation(b), d && d.addEventListener("abort", () => {
      t.terminateAnimation(b);
    }, { once: !0 });
    const E = Zt.get(p) ?? {
      hidden: p._source.hidden,
      alpha: ((k = p._source.config) == null ? void 0 : k.alpha) ?? 0.5
    };
    if (Zt.set(p, E), O(`light-state START ${r ? "ON" : "OFF"} | snap: ${JSON.stringify(E)} | _source.hidden=${p._source.hidden}, _source.config.alpha=${(D = p._source.config) == null ? void 0 : D.alpha}`), r && !E.hidden || !r && E.hidden)
      return Zt.delete(p), !0;
    const L = E.alpha, A = typeof u == "number" ? Math.max(0, Math.min(o, Date.now() - u)) : 0, $ = /* @__PURE__ */ c((_) => {
      p.updateSource({ config: { alpha: _ } }), w.initializeLightSource();
    }, "applyAlpha");
    if (r) {
      p.updateSource({ hidden: !1, config: { alpha: 0 } }), w.initializeLightSource(), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
      const _ = { t: 0 };
      A > 0 && (_.t = A / o, $(L * _.t));
      const P = await t.animate(
        [{ parent: _, attribute: "t", to: 1 }],
        {
          name: b,
          duration: o,
          easing: m,
          time: A,
          ontick: /* @__PURE__ */ c(() => $(L * _.t), "ontick")
        }
      );
      return P !== !1 && !(d != null && d.aborted) && l && p.canUserModify(game.user, "update") ? (p.updateSource({ hidden: !0, config: { alpha: L } }), await p.update({ hidden: !1 }), O(`light-state FADE-IN committed. _source.hidden=${p._source.hidden}, _source.config.alpha=${(J = p._source.config) == null ? void 0 : J.alpha}`), Zt.delete(p)) : P === !1 || Zt.delete(p), P !== !1;
    } else {
      p.updateSource({ hidden: !1, config: { alpha: E.alpha } }), w.initializeLightSource();
      const _ = { t: 0 };
      A > 0 && (_.t = A / o, $(L * (1 - _.t)));
      const P = await t.animate(
        [{ parent: _, attribute: "t", to: 1 }],
        {
          name: b,
          duration: o,
          easing: m,
          time: A,
          ontick: /* @__PURE__ */ c(() => $(L * (1 - _.t)), "ontick")
        }
      );
      return P !== !1 && !(d != null && d.aborted) && l && p.canUserModify(game.user, "update") ? (await p.update({ hidden: !0 }), p.updateSource({ config: { alpha: L } }), w.initializeLightSource(), O(`light-state FADE-OUT committed+restored. _source.hidden=${p._source.hidden}, _source.config.alpha=${(K = p._source.config) == null ? void 0 : K.alpha}`), Zt.delete(p)) : P === !1 || (p.updateSource({ hidden: !0, config: { alpha: L } }), w.initializeLightSource(), Zt.delete(p)), P !== !1;
    }
  }
  return c(g, "animateOne"), (await Promise.all(a.map(g))).every(Boolean);
}
c(Eh, "execute$4");
function Sh() {
  Wt({ type: "light-state", execute: Eh, validate: vh });
}
c(Sh, "registerLightStateTween");
function So(n) {
  if ((Array.isArray(n.uuid) ? n.uuid : [n.uuid]).some((t) => !t || typeof t != "string"))
    throw new Error("tile-prop tween: 'uuid' is required (string or array of Tile document UUIDs).");
  if (!n.attribute || typeof n.attribute != "string")
    throw new Error("tile-prop tween: 'attribute' (string) is required — dot-path to a numeric property (e.g. 'alpha', 'rotation').");
  if (typeof n.value != "number")
    throw new Error("tile-prop tween: 'value' (number) is required — the target value to animate to.");
}
c(So, "validate$3");
async function To(n, e = {}) {
  const { CanvasAnimation: t } = foundry.canvas.animation, { uuid: i, attribute: r, value: a } = n, o = Array.isArray(i) ? i : [i];
  if (o.length === 0)
    return console.warn("tile-prop tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: s = 2e3,
    easing: l = "easeInOutCosine",
    commit: u = !0,
    startEpochMS: d = null,
    signal: m = null
  } = e, g = Mr(l);
  async function h(p) {
    if (m != null && m.aborted) return !1;
    const w = await fromUuid(p);
    if (!w) return !1;
    const b = w.object;
    if (!b) return !1;
    const E = foundry.utils.getProperty(w._source, r);
    if (typeof E != "number")
      return console.warn(`tile-prop tween: source value at '${r}' on ${p} is not a number (got ${typeof E}). Skipping.`), !1;
    const L = `tile-prop-tween:${r}:${p}`;
    t.terminateAnimation(L), m && m.addEventListener("abort", () => {
      t.terminateAnimation(L);
    }, { once: !0 });
    const A = typeof d == "number" ? Math.max(0, Math.min(s, Date.now() - d)) : 0, $ = /* @__PURE__ */ c((J) => {
      const K = E + (a - E) * J;
      w.updateSource(foundry.utils.expandObject({ [r]: K })), b.refresh();
    }, "applyFrame"), k = { t: 0 };
    A > 0 && (k.t = A / s, $(k.t));
    const D = await t.animate(
      [{ parent: k, attribute: "t", to: 1 }],
      {
        name: L,
        duration: s,
        easing: g,
        time: A,
        ontick: /* @__PURE__ */ c(() => $(k.t), "ontick")
      }
    );
    if (D !== !1) {
      if (m != null && m.aborted) return !1;
      w.updateSource(foundry.utils.expandObject({ [r]: a })), b.refresh();
    }
    if (u && D !== !1 && w.canUserModify(game.user, "update")) {
      if (m != null && m.aborted) return !1;
      w.updateSource(foundry.utils.expandObject({ [r]: E })), await w.update({ [r]: a });
    }
    return D !== !1;
  }
  return c(h, "animateOne"), (await Promise.all(o.map(h))).every(Boolean);
}
c(To, "execute$3");
function Th() {
  Wt({ type: "tile-prop", execute: To, validate: So });
}
c(Th, "registerTilePropTween");
function Ch(n) {
  if (!n.attribute || typeof n.attribute != "string")
    throw new Error("particles-prop tween: 'attribute' (string) is required — property name on canvas.particleeffects (e.g. 'alpha').");
  if (typeof n.value != "number")
    throw new Error("particles-prop tween: 'value' (number) is required — the target value to animate to.");
}
c(Ch, "validate$2");
async function Lh(n, e = {}) {
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
  const m = Mr(o), g = `particles-prop-tween:${i}`;
  t.terminateAnimation(g), l && l.addEventListener("abort", () => {
    t.terminateAnimation(g);
  }, { once: !0 });
  const h = typeof s == "number" ? Math.max(0, Math.min(a, Date.now() - s)) : 0, y = /* @__PURE__ */ c((b) => {
    u[i] = d + (r - d) * b;
  }, "applyFrame"), p = { t: 0 };
  h > 0 && (p.t = h / a, y(p.t));
  const w = await t.animate(
    [{ parent: p, attribute: "t", to: 1 }],
    {
      name: g,
      duration: a,
      easing: m,
      time: h,
      ontick: /* @__PURE__ */ c(() => y(p.t), "ontick")
    }
  );
  if (w !== !1) {
    if (l != null && l.aborted) return !1;
    u[i] = r;
  }
  return w !== !1;
}
c(Lh, "execute$2");
function Ih() {
  Wt({ type: "particles-prop", execute: Lh, validate: Ch });
}
c(Ih, "registerParticlesPropTween");
var on, cr, ur, dr, fr, mr, Ti;
const Rl = class Rl {
  /**
   * @param {AbortController} controller
   */
  constructor(e) {
    I(this, on);
    I(this, cr);
    I(this, ur);
    I(this, dr);
    I(this, fr);
    I(this, mr, !1);
    I(this, Ti, null);
    C(this, on, e), C(this, dr, new Promise((t) => {
      C(this, cr, t);
    })), C(this, fr, new Promise((t) => {
      C(this, ur, t);
    }));
  }
  /** @returns {Promise<boolean>} Resolves true (completed) or false (cancelled/failed). */
  get finished() {
    return f(this, dr);
  }
  /** @returns {Promise<{status: string, [k: string]: unknown}>} */
  get result() {
    return f(this, fr);
  }
  /** @returns {boolean} */
  get cancelled() {
    return f(this, on).signal.aborted;
  }
  /** @returns {AbortSignal} */
  get signal() {
    return f(this, on).signal;
  }
  /** @returns {string} */
  get status() {
    return f(this, Ti) ? f(this, Ti).status : this.cancelled ? "cancelled" : "running";
  }
  /** Abort the timeline, triggering onCancel callbacks. */
  cancel(e = "cancelled") {
    f(this, on).signal.aborted || f(this, on).abort(e);
  }
  /**
   * Called internally by the execution engine when the timeline finishes.
   * @param {boolean} completed - true if all steps ran, false if cancelled
   */
  _resolve(e) {
    if (f(this, mr)) return;
    C(this, mr, !0);
    const t = typeof e == "boolean" ? { status: e ? "completed" : "cancelled" } : e ?? { status: "cancelled" };
    C(this, Ti, t), f(this, cr).call(this, t.status === "completed"), f(this, ur).call(this, t);
  }
};
on = new WeakMap(), cr = new WeakMap(), ur = new WeakMap(), dr = new WeakMap(), fr = new WeakMap(), mr = new WeakMap(), Ti = new WeakMap(), c(Rl, "TimelineHandle");
let zs = Rl;
var zn, Ci, Gn;
const Hl = class Hl {
  constructor() {
    /** @type {Map<string, Set<Function>>} */
    I(this, zn, /* @__PURE__ */ new Map());
    /** @type {Set<string>} Signals that have been emitted (sticky) */
    I(this, Ci, /* @__PURE__ */ new Set());
    I(this, Gn, !1);
  }
  /**
   * Subscribe to a named signal.
   * @param {string} signal
   * @param {Function} listener
   * @returns {() => void} Unsubscribe function
   */
  on(e, t) {
    if (f(this, Gn)) return () => {
    };
    let i = f(this, zn).get(e);
    return i || (i = /* @__PURE__ */ new Set(), f(this, zn).set(e, i)), i.add(t), () => i.delete(t);
  }
  /**
   * Fire a named signal synchronously. All registered listeners are invoked.
   * The signal is recorded so that future waitFor() calls resolve immediately.
   * @param {string} signal
   */
  emit(e) {
    if (f(this, Gn)) return;
    f(this, Ci).add(e);
    const t = f(this, zn).get(e);
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
    return f(this, Gn) ? Promise.reject(new Error("EventBus destroyed")) : f(this, Ci).has(e) ? Promise.resolve() : new Promise((i, r) => {
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
    C(this, Gn, !0), f(this, zn).clear(), f(this, Ci).clear();
  }
};
zn = new WeakMap(), Ci = new WeakMap(), Gn = new WeakMap(), c(Hl, "EventBus");
let Gs = Hl;
const md = /* @__PURE__ */ new Map();
function Co(n, e) {
  md.set(n, e);
}
c(Co, "registerAwaitProvider");
function Ws(n, e) {
  const t = md.get(n.event);
  return t ? t(n, e) : Promise.reject(new Error(`Unknown await event type: "${n.event}"`));
}
c(Ws, "createAwaitPromise");
Co("signal", (n, e) => n.name ? e.eventBus.waitFor(n.name, e.signal) : Promise.reject(new Error('await signal: "name" is required')));
Co("click", (n, e) => new Promise((t, i) => {
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
Co("keypress", (n, e) => new Promise((t, i) => {
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
const mi = /* @__PURE__ */ new Map();
function Oh(n, e) {
  const t = mi.get(n);
  t && !t.cancelled && t.cancel("replaced-by-name"), mi.set(n, e), e.finished.then(() => {
    mi.get(n) === e && mi.delete(n);
  });
}
c(Oh, "registerTimeline");
function gd(n) {
  const e = mi.get(n);
  return e && !e.cancelled ? (e.cancel("cancelled-by-name"), !0) : !1;
}
c(gd, "cancelTimeline");
function Ah(n) {
  return mi.get(n);
}
c(Ah, "getTimeline");
function vc(n, e) {
  return n <= 0 ? Promise.resolve() : new Promise((t, i) => {
    if (e.aborted) return i(e.reason);
    const r = setTimeout(t, n);
    e.addEventListener("abort", () => {
      clearTimeout(r), i(e.reason);
    }, { once: !0 });
  });
}
c(vc, "cancellableDelay");
var _e, sn, gr, hr;
const ql = class ql {
  constructor(e) {
    /** @type {TweenTimeline} */
    I(this, _e);
    /** @type {Array<{ type: string, params: object, opts?: object, detach: boolean }>} */
    I(this, sn, []);
    /** @type {Function|null} */
    I(this, gr, null);
    /** @type {Function|null} */
    I(this, hr, null);
    C(this, _e, e);
  }
  /**
   * Add a tween entry to this step.
   * @param {string} type  Registered tween type name
   * @param {object} params  Type-specific parameters
   * @param {object} [opts]  Options (durationMS, easing, etc.)
   * @returns {StepBuilder} this
   */
  add(e, t, i) {
    return f(this, sn).push({ type: e, params: t, opts: i ?? {}, detach: !1 }), this;
  }
  /**
   * Mark the last entry as fire-and-forget (does not block step progression).
   * @returns {StepBuilder} this
   */
  detach() {
    if (f(this, sn).length === 0)
      throw new Error("StepBuilder.detach(): no entry to detach.");
    return f(this, sn)[f(this, sn).length - 1].detach = !0, this;
  }
  /**
   * Callback invoked before this step's tweens start.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  before(e) {
    return C(this, gr, e), this;
  }
  /**
   * Callback invoked after this step's awaited tweens complete.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  after(e) {
    return C(this, hr, e), this;
  }
  // ── Delegation to parent TweenTimeline for fluent chaining ──
  /** Start a new step (finalizes this one). */
  step() {
    return f(this, _e).step();
  }
  /** Insert a delay between steps. */
  delay(e) {
    return f(this, _e).delay(e);
  }
  /** Insert an await segment. */
  await(e) {
    return f(this, _e).await(e);
  }
  /** Insert an emit segment. */
  emit(e) {
    return f(this, _e).emit(e);
  }
  /** Insert a parallel segment. */
  parallel(e, t) {
    return f(this, _e).parallel(e, t);
  }
  /** Register onComplete callback. */
  onComplete(e) {
    return f(this, _e).onComplete(e);
  }
  /** Register onCancel callback. */
  onCancel(e) {
    return f(this, _e).onCancel(e);
  }
  /** Register onError callback. */
  onError(e) {
    return f(this, _e).onError(e);
  }
  /** Execute the timeline. */
  run(e) {
    return f(this, _e).run(e);
  }
  /** Serialize the timeline. */
  toJSON() {
    return f(this, _e).toJSON();
  }
  // ── Internal access ──
  /** @returns {{ entries: Array, before: Function|null, after: Function|null }} */
  _finalize() {
    return {
      entries: f(this, sn),
      before: f(this, gr),
      after: f(this, hr)
    };
  }
};
_e = new WeakMap(), sn = new WeakMap(), gr = new WeakMap(), hr = new WeakMap(), c(ql, "StepBuilder");
let Js = ql;
var xe, Ce, bt, ln, pr, yr, br, wr, Tn, Ks, W, _t, Ys, hd, Qs, pd, yd, ra, rt, Ct;
const Ht = class Ht {
  constructor() {
    I(this, W);
    /** @type {string|null} */
    I(this, xe, null);
    /** @type {string} */
    I(this, Ce, Se.ABORT);
    /** @type {Array<object>} */
    I(this, bt, []);
    /** @type {StepBuilder|null} */
    I(this, ln, null);
    /** @type {Function|null} */
    I(this, pr, null);
    /** @type {Function|null} */
    I(this, yr, null);
    /** @type {Function|null} */
    I(this, br, null);
    /** @type {Function|null} */
    I(this, wr, null);
  }
  /**
   * Register this timeline in the named registry. Starting a new
   * timeline with the same name cancels the previous one.
   * @param {string} name
   * @returns {TweenTimeline} this
   */
  name(e) {
    return C(this, xe, e), this;
  }
  /**
   * Set the error policy for step execution.
   * @param {"abort"|"continue"} policy
   * @returns {TweenTimeline} this
   */
  errorPolicy(e) {
    if (e !== Se.ABORT && e !== Se.CONTINUE)
      throw new Error(`Invalid error policy: "${e}". Use "abort" or "continue".`);
    return C(this, Ce, e), this;
  }
  /**
   * Start a new step. Finalizes the previous step if one is open.
   * @returns {StepBuilder}
   */
  step() {
    return S(this, W, _t).call(this), C(this, ln, new Js(this)), f(this, ln);
  }
  /**
   * Insert a delay (in ms) between the previous step and the next.
   * @param {number} ms
   * @returns {TweenTimeline} this
   */
  delay(e) {
    return S(this, W, _t).call(this), f(this, bt).push({ kind: "delay", ms: e }), this;
  }
  /**
   * Pause execution until an event occurs.
   * @param {object} config  e.g. { event: "click" }, { event: "signal", name: "fog-done" }
   * @returns {TweenTimeline} this
   */
  await(e) {
    return S(this, W, _t).call(this), f(this, bt).push({ kind: "await", config: e }), this;
  }
  /**
   * Fire a named signal (instant, non-blocking).
   * @param {string} signal  Signal name
   * @returns {TweenTimeline} this
   */
  emit(e) {
    return S(this, W, _t).call(this), f(this, bt).push({ kind: "emit", signal: e }), this;
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
    S(this, W, _t).call(this);
    const i = t.join ?? "all", r = t.overflow ?? "detach";
    if (i !== "all" && i !== "any" && (typeof i != "number" || i < 1 || i > e.length))
      throw new Error(`parallel: join must be "all", "any", or 1..${e.length}, got ${JSON.stringify(i)}`);
    if (r !== "detach" && r !== "cancel")
      throw new Error(`parallel: overflow must be "detach" or "cancel", got ${JSON.stringify(r)}`);
    const a = e.map((o) => {
      var l;
      const s = new Ht();
      return o(s), S(l = s, W, _t).call(l), f(s, bt);
    });
    return f(this, bt).push({ kind: "parallel", branches: a, join: i, overflow: r }), this;
  }
  /**
   * Callback invoked before the first step runs.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  beforeAll(e) {
    return C(this, pr, e), this;
  }
  /**
   * Callback invoked on successful completion.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onComplete(e) {
    return C(this, yr, e), this;
  }
  /**
   * Callback invoked on cancellation (mutually exclusive with onComplete).
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onCancel(e) {
    return C(this, br, e), this;
  }
  /**
   * Callback invoked on runtime failure (mutually exclusive with onComplete/onCancel).
   * @param {(outcome: object) => void} fn
   * @returns {TweenTimeline} this
   */
  onError(e) {
    return C(this, wr, e), this;
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
    S(this, W, _t).call(this);
    const t = new AbortController();
    e.signal && (e.signal.aborted ? t.abort(e.signal.reason ?? "parent-aborted") : e.signal.addEventListener("abort", () => {
      t.signal.aborted || t.abort(e.signal.reason ?? "parent-aborted");
    }, { once: !0 }));
    const i = new zs(t);
    f(this, xe) && Oh(f(this, xe), i);
    const r = e.broadcast ?? game.user.isGM, a = e.commit ?? game.user.isGM, o = e.startEpochMS ?? Date.now();
    r && f(this, xe) && ia(dd, {
      name: f(this, xe),
      data: this.toJSON(),
      startEpochMS: o
    });
    const s = new Gs(), l = {
      signal: i.signal,
      commit: a,
      startEpochMS: o,
      eventBus: s,
      errors: [],
      detachedPromises: []
    };
    return S(this, W, hd).call(this, i, l).then((u) => {
      var d, m, g;
      s.destroy(), i._resolve(u), u.status === Xt.COMPLETED ? (d = f(this, yr)) == null || d.call(this) : u.status === Xt.CANCELLED ? ((m = f(this, br)) == null || m.call(this), r && f(this, xe) && ia(Bs, {
        name: f(this, xe),
        reason: u.reason
      })) : ((g = f(this, wr)) == null || g.call(this, u), r && f(this, xe) && ia(Bs, {
        name: f(this, xe),
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
    S(this, W, _t).call(this);
    const t = { timeline: S(i = Ht, Tn, Ks).call(i, f(this, bt)) };
    return f(this, xe) && (t.name = f(this, xe)), f(this, Ce) !== Se.ABORT && (t.errorPolicy = f(this, Ce)), t;
  }
};
xe = new WeakMap(), Ce = new WeakMap(), bt = new WeakMap(), ln = new WeakMap(), pr = new WeakMap(), yr = new WeakMap(), br = new WeakMap(), wr = new WeakMap(), Tn = new WeakSet(), Ks = /* @__PURE__ */ c(function(e) {
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
            return S(a = Ht, Tn, Ks).call(a, r);
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
}, "#serializeSegments"), W = new WeakSet(), // ── Private ─────────────────────────────────────────────────────────
_t = /* @__PURE__ */ c(function() {
  f(this, ln) && (f(this, bt).push({ kind: "step", data: f(this, ln)._finalize() }), C(this, ln, null));
}, "#finalizeCurrentStep"), Ys = /* @__PURE__ */ c(function(e) {
  e.length !== 0 && Promise.allSettled(e).catch(() => {
  });
}, "#drainDetached"), hd = /* @__PURE__ */ c(async function(e, t) {
  var i, r;
  try {
    if (t.signal.aborted) return S(this, W, rt).call(this, t.signal.reason);
    const a = await S(this, W, ra).call(this, f(this, pr), ft.BEFORE_ALL, null);
    if (a) {
      if (f(this, Ce) === Se.ABORT) return a;
      t.errors.push(a);
    }
    const o = await S(this, W, Qs).call(this, f(this, bt), t);
    if (o)
      return S(i = Ht, Tn, Ys).call(i, t.detachedPromises), o;
    if (!t.signal.aborted) {
      const s = await Promise.allSettled(t.detachedPromises);
      for (const l of s)
        if (l.status === "rejected") {
          const u = S(this, W, Ct).call(this, l.reason, ft.ENTRY);
          if (f(this, Ce) === Se.ABORT) return u;
          t.errors.push(u);
        }
    }
    return t.signal.aborted ? S(this, W, rt).call(this, t.signal.reason) : {
      status: Xt.COMPLETED,
      ...t.errors.length > 0 ? { errors: t.errors } : {}
    };
  } catch (a) {
    return S(r = Ht, Tn, Ys).call(r, t.detachedPromises), t.signal.aborted ? S(this, W, rt).call(this, t.signal.reason) : (console.error("TweenTimeline execution error:", a), S(this, W, Ct).call(this, a, ft.RUNTIME));
  }
}, "#execute"), Qs = /* @__PURE__ */ c(async function(e, t) {
  let i = -1, r = 0;
  for (const a of e) {
    if (t.signal.aborted) return S(this, W, rt).call(this, t.signal.reason);
    if (a.kind === "delay") {
      try {
        await vc(a.ms, t.signal);
      } catch {
        return S(this, W, rt).call(this, t.signal.reason);
      }
      r += a.ms;
      continue;
    }
    if (a.kind === "await") {
      try {
        let y = Ws(a.config, {
          signal: t.signal,
          eventBus: t.eventBus
        });
        const p = a.config.timeout;
        typeof p == "number" && p > 0 && (y = Promise.race([
          y,
          vc(p, t.signal)
        ])), await y;
      } catch (y) {
        if (t.signal.aborted) return S(this, W, rt).call(this, t.signal.reason);
        const p = S(this, W, Ct).call(this, y, ft.AWAIT);
        if (f(this, Ce) === Se.ABORT) return p;
        t.errors.push(p);
      }
      continue;
    }
    if (a.kind === "emit") {
      try {
        t.eventBus.emit(a.signal);
      } catch (y) {
        const p = S(this, W, Ct).call(this, y, ft.EMIT);
        if (f(this, Ce) === Se.ABORT) return p;
        t.errors.push(p);
      }
      continue;
    }
    if (a.kind === "parallel") {
      const y = await S(this, W, pd).call(this, a, t);
      if (y) return y;
      continue;
    }
    i += 1;
    const { entries: o, before: s, after: l } = a.data, u = await S(this, W, ra).call(this, s, ft.BEFORE_STEP, i);
    if (u) {
      if (f(this, Ce) === Se.ABORT) return u;
      t.errors.push(u);
      continue;
    }
    if (t.signal.aborted) return S(this, W, rt).call(this, t.signal.reason);
    const d = [];
    let m = 0;
    for (const y of o) {
      const p = Nr(y.type);
      if (!p) {
        const L = S(this, W, Ct).call(this, new Error(`TweenTimeline: unknown tween type "${y.type}"`), ft.ENTRY, i, y.type);
        if (f(this, Ce) === Se.ABORT) return L;
        t.errors.push(L), console.warn(L.error.message);
        continue;
      }
      const w = {
        ...y.opts,
        commit: t.commit,
        startEpochMS: t.startEpochMS + r,
        signal: t.signal
      }, b = w.durationMS ?? 2e3, E = Promise.resolve().then(() => p.execute(y.params, w)).then((L) => L === !1 ? {
        ok: !1,
        failure: S(this, W, Ct).call(this, new Error("Tween entry returned false."), ft.ENTRY, i, y.type)
      } : { ok: !0 }).catch((L) => ({
        ok: !1,
        failure: S(this, W, Ct).call(this, L, ft.ENTRY, i, y.type)
      }));
      y.detach ? t.detachedPromises.push(E) : (d.push(E), m = Math.max(m, b));
    }
    const g = await S(this, W, yd).call(this, d, t.signal);
    if (g === null) return S(this, W, rt).call(this, t.signal.reason);
    for (const y of g)
      if (!y.ok) {
        if (f(this, Ce) === Se.ABORT) return y.failure;
        t.errors.push(y.failure), console.warn("TweenTimeline: entry failed:", y.failure.error);
      }
    const h = await S(this, W, ra).call(this, l, ft.AFTER_STEP, i);
    if (h) {
      if (f(this, Ce) === Se.ABORT) return h;
      t.errors.push(h);
    }
    if (t.signal.aborted) return S(this, W, rt).call(this, t.signal.reason);
    r += m;
  }
  return null;
}, "#executeSegments"), pd = /* @__PURE__ */ c(async function(e, t) {
  const { branches: i, join: r, overflow: a } = e, o = i.length, s = r === "all" ? o : r === "any" ? 1 : r, l = i.map(() => {
    const h = new AbortController();
    return t.signal.aborted ? h.abort(t.signal.reason ?? "parent-aborted") : t.signal.addEventListener("abort", () => {
      h.signal.aborted || h.abort(t.signal.reason ?? "parent-aborted");
    }, { once: !0 }), h;
  });
  let u = 0, d = 0;
  const m = new Array(o).fill(null);
  let g;
  return new Promise((h) => {
    let y = !1;
    const p = /* @__PURE__ */ c(() => {
      if (y) return;
      if (u >= s) {
        y = !0, w(), h(null);
        return;
      }
      const b = o - u - d;
      if (u + b < s) {
        y = !0, w();
        const E = m.filter((A) => A && A.status === Xt.FAILED).map((A) => A), L = S(this, W, Ct).call(this, new Error(`parallel: join target ${s} impossible (${u} completed, ${d} failed)`), ft.PARALLEL);
        f(this, Ce) === Se.ABORT ? h(L) : (t.errors.push(L), t.errors.push(...E), h(null));
      }
    }, "checkJoin"), w = /* @__PURE__ */ c(() => {
      if (a === "cancel")
        for (let b = 0; b < o; b++)
          !m[b] && !l[b].signal.aborted && l[b].abort("overflow-cancel");
      for (let b = 0; b < o; b++)
        m[b] || t.detachedPromises.push(g[b]);
    }, "applyOverflow");
    if (g = i.map((b, E) => {
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
      return S(this, W, Qs).call(this, b, L).then((A) => {
        if (A)
          if (A.status === Xt.CANCELLED) {
            if (l[E].signal.aborted) {
              m[E] = A;
              return;
            }
            m[E] = A, d++;
          } else
            m[E] = A, d++;
        else
          m[E] = { status: Xt.COMPLETED }, u++;
        p();
      });
    }), t.signal.aborted) {
      y = !0, h(S(this, W, rt).call(this, t.signal.reason));
      return;
    }
    t.signal.addEventListener("abort", () => {
      y || (y = !0, h(S(this, W, rt).call(this, t.signal.reason)));
    }, { once: !0 });
  });
}, "#executeParallel"), /**
 * @param {Array<Promise<{ok: boolean, failure?: object}>>} stepPromises
 * @param {AbortSignal} signal
 * @returns {Promise<Array<{ok: boolean, failure?: object}>|null>}
 */
yd = /* @__PURE__ */ c(function(e, t) {
  return e.length === 0 ? Promise.resolve([]) : t.aborted ? Promise.resolve(null) : new Promise((i, r) => {
    const a = /* @__PURE__ */ c(() => i(null), "onAbort");
    t.addEventListener("abort", a, { once: !0 }), Promise.all(e).then((o) => {
      t.removeEventListener("abort", a), i(o);
    }).catch((o) => {
      t.removeEventListener("abort", a), r(o);
    });
  });
}, "#waitForStep"), ra = /* @__PURE__ */ c(async function(e, t, i) {
  if (!e) return null;
  try {
    return await e(), null;
  } catch (r) {
    const a = S(this, W, Ct).call(this, r, t, i ?? void 0);
    return f(this, Ce) === Se.CONTINUE && console.warn(`TweenTimeline: hook failure in ${t}:`, r), a;
  }
}, "#runHook"), /** @param {unknown} reason */
rt = /* @__PURE__ */ c(function(e) {
  let t;
  return typeof e == "string" ? t = e : e instanceof Error && (t = e.message), {
    status: Xt.CANCELLED,
    ...t ? { reason: t } : {}
  };
}, "#cancelledOutcome"), /**
 * @param {unknown} err
 * @param {string} phase
 * @param {number} [stepIndex]
 * @param {string} [entryType]
 */
Ct = /* @__PURE__ */ c(function(e, t, i, r) {
  const a = e instanceof Error ? e : new Error(String(e));
  return {
    status: Xt.FAILED,
    error: a,
    phase: t,
    ...typeof i == "number" ? { stepIndex: i } : {},
    ...r ? { entryType: r } : {}
  };
}, "#failedOutcome"), I(Ht, Tn), c(Ht, "TweenTimeline");
let La = Ht;
function kl(n) {
  if (!n || typeof n != "object")
    throw new Error("Sequence JSON: data must be an object.");
  if (!Array.isArray(n.timeline))
    throw new Error("Sequence JSON: 'timeline' must be an array.");
  if (n.name != null && typeof n.name != "string")
    throw new Error("Sequence JSON: 'name' must be a string.");
  if (n.errorPolicy != null && n.errorPolicy !== Se.ABORT && n.errorPolicy !== Se.CONTINUE)
    throw new Error(`Sequence JSON: 'errorPolicy' must be "abort" or "continue".`);
  bd(n.timeline, "timeline", 0);
}
c(kl, "validateSequenceJSON");
function bd(n, e, t = 0) {
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
        bd(d, `${a}.parallel.branches[${u}]`, t + 1);
      }
      continue;
    }
    throw new Error(`Sequence JSON: ${a} is not a recognized segment (step array, delay, await, emit, or parallel).`);
  }
}
c(bd, "validateSegmentsJSON");
function wd(n) {
  kl(n), vd(n.timeline, "timeline");
}
c(wd, "validateSequenceSemantics");
function vd(n, e) {
  for (let t = 0; t < n.length; t++) {
    const i = n[t], r = `${e}[${t}]`;
    if (Array.isArray(i))
      for (let a = 0; a < i.length; a++) {
        const o = i[a];
        try {
          uh(o.type, o.params ?? {});
        } catch (s) {
          throw new Error(`Sequence JSON: ${r}[${a}] failed semantic validation: ${s.message}`);
        }
      }
    else if (i.parallel)
      for (let a = 0; a < i.parallel.branches.length; a++)
        vd(i.parallel.branches[a], `${r}.parallel.branches[${a}]`);
  }
}
c(vd, "validateSegmentsSemantics");
function $l(n, e = {}) {
  kl(n), e.validateSemantics && wd(n);
  const t = new La();
  return n.name && t.name(n.name), n.errorPolicy && t.errorPolicy(n.errorPolicy), Ed(n.timeline, t), t;
}
c($l, "compileSequence");
function Ed(n, e) {
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
      const i = t.parallel, r = i.branches.map((a) => (o) => Ed(a, o));
      e.parallel(r, {
        join: i.join ?? "all",
        overflow: i.overflow ?? "detach"
      });
    }
  }
}
c(Ed, "compileSegments");
function Nh(n) {
  kl(n), wd(n);
}
c(Nh, "validate$1");
async function Mh(n, e = {}) {
  return $l(n, { validateSemantics: !0 }).run({
    broadcast: !1,
    commit: e.commit,
    startEpochMS: e.startEpochMS,
    signal: e.signal
  }).finished;
}
c(Mh, "execute$1");
function kh() {
  Wt({ type: "sequence", execute: Mh, validate: Nh });
}
c(kh, "registerSequenceTween");
function $h(n) {
  if (n.x == null && n.y == null && n.scale == null)
    throw new Error("camera-pan tween: at least one of 'x', 'y', or 'scale' is required.");
  if (n.x != null && typeof n.x != "number")
    throw new Error("camera-pan tween: 'x' must be a number.");
  if (n.y != null && typeof n.y != "number")
    throw new Error("camera-pan tween: 'y' must be a number.");
  if (n.scale != null && (typeof n.scale != "number" || n.scale <= 0))
    throw new Error("camera-pan tween: 'scale' must be a positive number.");
}
c($h, "validate");
async function Dh(n, e = {}) {
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
c(Dh, "execute");
function Fh() {
  Wt({ type: "camera-pan", execute: Dh, validate: $h });
}
c(Fh, "registerCameraPanTween");
async function Ph(n, e, t = {}) {
  if (!game.user.isGM)
    return ui.notifications.warn("Only the GM can dispatch tweens."), !1;
  const i = Nr(n);
  if (!i)
    throw new Error(`Unknown tween type: "${n}". Registered types: ${Us().join(", ")}`);
  i.validate(e);
  const { durationMS: r = 2e3, easing: a = "easeInOutCosine", commit: o = !0 } = t, s = Date.now();
  return ia(ud, {
    type: n,
    params: e,
    durationMS: r,
    easing: a,
    startEpochMS: s,
    commit: !1
  }), i.execute(e, { durationMS: r, easing: a, commit: o, startEpochMS: s });
}
c(Ph, "dispatchTween");
function _h(n) {
  const { type: e, params: t, durationMS: i, easing: r, startEpochMS: a, commit: o } = n ?? {}, s = Nr(e);
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
c(_h, "handleTweenSocketMessage");
wh();
Sh();
Th();
Ih();
kh();
Fh();
Wt({ type: "token-prop", execute: To, validate: So });
Wt({ type: "drawing-prop", execute: To, validate: So });
Wt({ type: "sound-prop", execute: To, validate: So });
Ml(ud, _h);
Ml(dd, xh);
Ml(Bs, Rh);
function xh(n) {
  const { data: e, startEpochMS: t } = n ?? {};
  if (!e) {
    console.warn(`[${T}] Received empty tween-sequence socket message.`);
    return;
  }
  try {
    $l(e, { validateSemantics: !0 }).run({ commit: !1, startEpochMS: t, broadcast: !1 });
  } catch (i) {
    console.error(`[${T}] Failed to run received tween sequence:`, i);
  }
}
c(xh, "handleSequenceSocketMessage");
function Rh(n) {
  const { name: e } = n ?? {};
  e && gd(e);
}
c(Rh, "handleSequenceCancelMessage");
function Hh() {
  Hooks.once("ready", () => {
    ch();
    const n = game.modules.get(T);
    n.api || (n.api = {}), n.api.tween = {
      dispatch: Ph,
      types: Us,
      Timeline: La,
      ErrorPolicy: Se,
      compileSequence: $l,
      cancelTimeline: gd,
      getTimeline: Ah
    }, console.log(`[${T}] Tween API registered. Types: ${Us().join(", ")}`);
  });
}
c(Hh, "registerTweenHooks");
Hh();
const qh = ["tag", "tag-all", "id", "tags-any", "tags-all"], jh = /* @__PURE__ */ new Set(["tags-any", "tags-all"]);
function Dl(n) {
  if (!n || typeof n != "string")
    return { type: "unknown", value: n ?? "" };
  if (n.startsWith("$"))
    return { type: "special", value: n };
  for (const e of qh)
    if (n.startsWith(`${e}:`)) {
      const t = n.slice(e.length + 1), i = jh.has(e) ? t.split(",").map((r) => r.trim()) : t;
      return { type: e, value: i };
    }
  return n.includes(".") ? { type: "uuid", value: n } : { type: "unknown", value: n };
}
c(Dl, "parseSelector");
function Bh(n) {
  if (!n) return "";
  const { type: e, value: t } = n;
  if (e === "special" || e === "uuid" || e === "unknown")
    return Array.isArray(t) ? t.join(",") : t ?? "";
  const i = Array.isArray(t) ? t.join(",") : t ?? "";
  return `${e}:${i}`;
}
c(Bh, "buildSelector");
function Sd(n, e = "first") {
  return n != null && n.length ? n.length === 1 ? e === "first-all" || e === "all" ? `tag-all:${n[0]}` : `tag:${n[0]}` : e === "any" ? `tags-any:${n.join(",")}` : e === "all" ? `tags-all:${n.join(",")}` : e === "first-all" ? `tags-all:${n.join(",")}` : `tags-any:${n.join(",")}` : "";
}
c(Sd, "buildTagSelector");
function Lo(n) {
  if (!n) return null;
  if (n.documentName || n._source !== void 0) {
    const e = n.object;
    return e ? { placeable: e, doc: n } : null;
  }
  return n.document ? { placeable: n, doc: n.document } : null;
}
c(Lo, "normalizePlaceable");
function Td() {
  var n;
  return window.Tagger ?? ((n = game.modules.get("tagger")) == null ? void 0 : n.api) ?? null;
}
c(Td, "getTaggerAPI");
function Io(n, e) {
  if (!n) return null;
  const t = e ?? canvas.scene;
  if (!t) return null;
  const i = Dl(n);
  switch (i.type) {
    case "special":
      return Uh(i.value);
    case "tag":
      return Ec(i.value, t, !1);
    case "tag-all":
      return Ec(i.value, t, !0);
    case "id":
      return Vh(i.value, t);
    case "tags-any":
      return Sc(i.value, t, !0);
    case "tags-all":
      return Sc(i.value, t, !1);
    case "uuid":
      return zh(i.value);
    default:
      return null;
  }
}
c(Io, "resolveSelector");
function Uh(n) {
  var e;
  if (n === "$particles") {
    if (!((e = game.modules.get("fxmaster")) != null && e.active))
      return console.warn(`[${T}] Picker: FXMaster not active, cannot resolve "$particles".`), null;
    const t = canvas.particleeffects;
    return t ? { kind: "particles", documents: [], placeables: [], target: t } : null;
  }
  return null;
}
c(Uh, "resolveSpecial");
function Ec(n, e, t) {
  const i = Td();
  if (!i)
    return console.warn(`[${T}] Picker: Tagger not available, cannot resolve tag "${n}".`), null;
  const r = i.getByTag(n, { sceneId: e.id });
  if (!(r != null && r.length)) return null;
  const a = t ? r : [r[0]], o = [];
  for (const s of a) {
    const l = Lo(s);
    l && o.push(l);
  }
  return o.length === 0 ? null : {
    kind: t ? "multi-placeable" : "placeable",
    documents: o.map((s) => s.doc),
    placeables: o
  };
}
c(Ec, "resolveTag");
function Vh(n, e) {
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
      const a = Lo(r);
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
c(Vh, "resolveById");
function Sc(n, e, t) {
  const i = Td();
  if (!i)
    return console.warn(`[${T}] Picker: Tagger not available, cannot resolve multi-tag.`), null;
  const r = i.getByTag(n, {
    sceneId: e.id,
    matchAny: t
  });
  if (!(r != null && r.length)) return null;
  const a = [];
  for (const o of r) {
    const s = Lo(o);
    s && a.push(s);
  }
  return a.length === 0 ? null : {
    kind: a.length === 1 ? "placeable" : "multi-placeable",
    documents: a.map((o) => o.doc),
    placeables: a
  };
}
c(Sc, "resolveMultiTag");
function zh(n) {
  const e = fromUuidSync(n);
  if (!e) return null;
  const t = Lo(e);
  return t ? {
    kind: "placeable",
    documents: [t.doc],
    placeables: [t]
  } : null;
}
c(zh, "resolveUUID");
function Gh(n) {
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
c(Gh, "adaptResolved");
function Ia(n) {
  var r;
  const e = /* @__PURE__ */ new Set();
  if (n.segments)
    for (const a of Object.values(n.segments)) {
      if (a.setup) for (const o of Object.keys(a.setup)) e.add(o);
      if (a.landing) for (const o of Object.keys(a.landing)) e.add(o);
      a.timeline && Zs(a.timeline, e), (r = a.gate) != null && r.target && e.add(a.gate.target);
    }
  else {
    if (n.setup) for (const a of Object.keys(n.setup)) e.add(a);
    if (n.landing) for (const a of Object.keys(n.landing)) e.add(a);
    n.timeline && Zs(n.timeline, e);
  }
  const t = /* @__PURE__ */ new Map(), i = [];
  for (const a of e) {
    const o = Io(a), s = Gh(o);
    s ? t.set(a, s) : i.push(a);
  }
  return i.length && console.warn(`[${T}] Cinematic: ${i.length} unresolved target(s): ${i.join(", ")}`), { targets: t, unresolved: i };
}
c(Ia, "resolveAllTargets");
function Wh(n, e) {
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
c(Wh, "captureSnapshot");
function Jh(n) {
  const e = {};
  function t(i) {
    if (i)
      for (const [r, a] of Object.entries(i))
        e[r] || (e[r] = {}), Object.assign(e[r], a);
  }
  if (c(t, "mergeMap"), n.segments)
    for (const i of Object.values(n.segments))
      t(i.setup), t(i.landing), i.timeline && Xs(i.timeline, e, t);
  else
    t(n.setup), t(n.landing), n.timeline && Xs(n.timeline, e, t);
  return e;
}
c(Jh, "gatherAllStateMaps");
function Xs(n, e, t) {
  var i;
  for (const r of n)
    if (!(r.delay != null || r.await != null || r.emit != null) && !(r.transitionTo != null || r.sound != null || r.stopSound != null)) {
      if ((i = r.parallel) != null && i.branches) {
        for (const a of r.parallel.branches)
          Xs(a, e, t);
        continue;
      }
      if (t(r.before), t(r.after), r.tweens)
        for (const a of r.tweens)
          a.target && a.attribute && (e[a.target] || (e[a.target] = {}), e[a.target][a.attribute] = "__snapshot__");
    }
}
c(Xs, "gatherFromEntries");
function Zs(n, e) {
  for (const t of n)
    if (t.delay == null && t.await == null && t.emit == null && t.transitionTo == null && t.sound == null && t.stopSound == null) {
      if (t.parallel) {
        const i = t.parallel;
        if (i.branches)
          for (const r of i.branches)
            Zs(r, e);
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
c(Zs, "collectSelectorsFromEntries");
const Tc = {
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
}, Kh = /* @__PURE__ */ new Set([
  "alpha",
  "visible",
  "x",
  "y",
  "scale",
  "rotation"
]);
function zo(n, e, t) {
  const i = {};
  for (const [r, a] of Object.entries(n))
    e.has(r) ? i[r] = a : console.warn(`[${T}] Cinematic: blocked property "${r}" on ${t}.`);
  return i;
}
c(zo, "filterOverrides");
function Ve(n, e) {
  var i, r;
  if (!n) return;
  const t = [];
  for (const [a, o] of Object.entries(n)) {
    const s = e.get(a);
    if (s)
      if (s.kind === "particles") {
        if (s.target.destroyed) continue;
        const l = zo(o, Kh, "$particles");
        for (const [u, d] of Object.entries(l))
          s.target[u] = d;
      } else if (s.kind === "multi-placeable")
        for (const { placeable: l, doc: u } of s.placeables) {
          if (!(u != null && u.parent) || !(l != null && l.scene)) continue;
          const d = u.documentName, m = Tc[d];
          if (!m) {
            console.warn(`[${T}] Cinematic: no allowlist for document type "${d}" on "${a}", skipping.`);
            continue;
          }
          const g = zo(o, m, `${d} "${a}"`);
          u.updateSource(g), t.push(l);
        }
      else {
        if (!((i = s.doc) != null && i.parent) || !((r = s.placeable) != null && r.scene)) continue;
        const l = s.doc.documentName, u = Tc[l];
        if (!u) {
          console.warn(`[${T}] Cinematic: no allowlist for document type "${l}" on "${a}", skipping.`);
          continue;
        }
        const d = zo(o, u, `${l} "${a}"`);
        s.doc.updateSource(d), t.push(s.placeable);
      }
  }
  for (const a of t)
    a.refresh();
}
c(Ve, "applyState");
function gi(n, e) {
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
c(gi, "refreshPerceptionIfNeeded");
const Yh = {
  "tile-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "light-color": /* @__PURE__ */ new Set(["uuid", "toColor", "toAlpha", "mode"]),
  "light-state": /* @__PURE__ */ new Set(["uuid", "enabled"]),
  "particles-prop": /* @__PURE__ */ new Set(["attribute", "value"]),
  "camera-pan": /* @__PURE__ */ new Set(["x", "y", "scale"]),
  "token-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "drawing-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"]),
  "sound-prop": /* @__PURE__ */ new Set(["uuid", "attribute", "value"])
}, Qh = /* @__PURE__ */ new Set(["duration", "easing", "detach"]), Xh = /* @__PURE__ */ new Set(["type", "target"]);
function Cd(n, e) {
  const { type: t, target: i, detach: r = !1, ...a } = n;
  if (!t)
    return console.warn(`[${T}] Cinematic: tween entry missing 'type', skipping.`), null;
  const o = {}, s = {}, l = Yh[t];
  if (i === "$particles")
    o.target = "$particles";
  else if (i) {
    const u = e.get(i);
    if (!u) return null;
    u.kind === "multi-placeable" ? o.uuid = u.placeables.map((d) => d.doc.uuid) : o.uuid = u.doc.uuid;
  }
  for (const [u, d] of Object.entries(a))
    Xh.has(u) || (u === "duration" ? s.durationMS = d : Qh.has(u) ? s[u] = d : (l != null && l.has(u), o[u] = d));
  return { type: t, params: o, opts: s, detach: r };
}
c(Cd, "compileTween");
const tr = /* @__PURE__ */ new Map();
let Zh = 0;
async function ep(n) {
  var u, d, m, g, h;
  const { id: e, src: t, volume: i = 0.8, loop: r = !1, fadeIn: a } = n;
  if (!t) {
    console.warn(`[${T}] Cinematic sound: missing 'src', skipping.`);
    return;
  }
  const o = e || `__auto_${++Zh}`, s = {
    src: t,
    autoplay: !0,
    loop: r,
    volume: i
  };
  let l = null;
  try {
    typeof ((d = (u = foundry == null ? void 0 : foundry.audio) == null ? void 0 : u.AudioHelper) == null ? void 0 : d.play) == "function" ? l = await foundry.audio.AudioHelper.play(s, !1) : typeof ((g = (m = game == null ? void 0 : game.audio) == null ? void 0 : m.constructor) == null ? void 0 : g.play) == "function" ? l = await game.audio.constructor.play(s, !1) : typeof ((h = game == null ? void 0 : game.audio) == null ? void 0 : h.play) == "function" && (l = await game.audio.play(s, !1));
  } catch (y) {
    console.error(`[${T}] Cinematic sound: failed to play "${t}":`, y);
    return;
  }
  if (!l) {
    console.warn(`[${T}] Cinematic sound: audio helper unavailable for "${t}".`);
    return;
  }
  a && a > 0 && l.fade && l.fade(i, { duration: a, from: 0 }), tr.set(o, { sound: l, config: n }), console.log(`[${T}] Cinematic sound: playing "${t}" as "${o}" (loop=${r}, vol=${i})`);
}
c(ep, "playLocalSound");
function Go(n) {
  var i, r;
  const e = tr.get(n);
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
  tr.delete(n);
}
c(Go, "stopCinematicSound");
function Cc() {
  var n, e;
  for (const [t, i] of tr)
    try {
      (e = (n = i.sound).stop) == null || e.call(n);
    } catch (r) {
      console.warn(`[${T}] Cinematic sound: error stopping "${t}" during cleanup:`, r);
    }
  tr.clear();
}
c(Cc, "stopAllCinematicSounds");
function tp(n, e, t, i = {}) {
  const { skipToStep: r, onStepComplete: a, timelineName: o } = i, s = new t().name(o ?? `cinematic-${canvas.scene.id}`);
  return s.beforeAll(() => {
    var l;
    try {
      Ve(n.setup, e), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    } catch (u) {
      throw console.error(`[${T}] Cinematic: error in beforeAll (setup state) on scene ${(l = canvas.scene) == null ? void 0 : l.id}:`, u), u;
    }
  }), Id(n.timeline, s, e, { skipToStep: r, onStepComplete: a }), { tl: s };
}
c(tp, "buildTimeline");
function Ld(n, e) {
  var t;
  if (n)
    for (const i of n)
      for (const r of i) {
        if (r.before)
          try {
            Ve(r.before, e), gi(r.before, e);
          } catch (a) {
            console.warn(`[${T}] Cinematic: error in skipped parallel before:`, a);
          }
        if (r.after)
          try {
            Ve(r.after, e), gi(r.after, e);
          } catch (a) {
            console.warn(`[${T}] Cinematic: error in skipped parallel after:`, a);
          }
        (t = r.parallel) != null && t.branches && Ld(r.parallel.branches, e);
      }
}
c(Ld, "applyParallelStatesForSkip");
function Id(n, e, t, i = {}) {
  const { skipToStep: r, onStepComplete: a } = i;
  let o = -1;
  for (const s of n) {
    if (s.sound != null) {
      if (r != null && o < r) continue;
      const d = s.sound, { duration: m, loop: g, fireAndForget: h } = d, y = e.step();
      if (y.before(() => {
        ep(d);
      }), m && m > 0)
        if (h) {
          if (g && d.id) {
            const p = d.id, w = m;
            y.before(() => {
              setTimeout(() => Go(p), w);
            });
          }
        } else
          e.delay(m), g && e.step().before(() => {
            Go(d.id);
          });
      continue;
    }
    if (s.stopSound != null) {
      if (r != null && o < r) continue;
      const d = s.stopSound;
      e.step().before(() => {
        Go(d);
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
        Ld(s.parallel.branches, t);
        continue;
      }
      const d = s.parallel, m = d.branches.map((g) => (h) => Id(g, h, t));
      e.parallel(m, {
        join: d.join ?? "all",
        overflow: d.overflow ?? "detach"
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
          Ve(s.before, t), gi(s.before, t);
        } catch (d) {
          console.warn(`[${T}] Cinematic: error applying skipped step.before:`, d);
        }
      if (s.after)
        try {
          Ve(s.after, t), gi(s.after, t);
        } catch (d) {
          console.warn(`[${T}] Cinematic: error applying skipped step.after:`, d);
        }
      continue;
    }
    const l = o, u = e.step();
    s.before && u.before(() => {
      var d;
      try {
        Ve(s.before, t), gi(s.before, t);
      } catch (m) {
        throw console.error(`[${T}] Cinematic: error in step.before callback on scene ${(d = canvas.scene) == null ? void 0 : d.id}:`, m), m;
      }
    });
    for (const d of s.tweens) {
      const m = Cd(d, t);
      m && (u.add(m.type, m.params, m.opts), m.detach && u.detach());
    }
    u.after(() => {
      var d;
      try {
        s.after && (Ve(s.after, t), gi(s.after, t)), a == null || a(l);
      } catch (m) {
        throw console.error(`[${T}] Cinematic: error in step.after callback on scene ${(d = canvas.scene) == null ? void 0 : d.id}:`, m), m;
      }
    });
  }
}
c(Id, "compileCinematicEntries");
function hi(n, e, t) {
  if (n != null) {
    if (typeof n != "object" || Array.isArray(n)) {
      t.push({ path: e, level: "error", message: `Expected object, got ${Array.isArray(n) ? "array" : typeof n}` });
      return;
    }
    for (const [i, r] of Object.entries(n))
      (typeof r != "object" || r === null || Array.isArray(r)) && t.push({ path: `${e}["${i}"]`, level: "error", message: `Expected property overrides object, got ${Array.isArray(r) ? "array" : typeof r}` });
  }
}
c(hi, "validateStateMap");
function el(n, e, t, i) {
  var r;
  for (let a = 0; a < n.length; a++) {
    const o = n[a], s = `${e}[${a}]`;
    if (!(o.delay != null || o.await != null || o.emit != null) && !(o.transitionTo != null || o.sound != null || o.stopSound != null)) {
      if ((r = o.parallel) != null && r.branches) {
        for (let l = 0; l < o.parallel.branches.length; l++)
          el(o.parallel.branches[l], `${s}.parallel.branches[${l}]`, t, i);
        continue;
      }
      if (hi(o.before, `${s}.before`, i), hi(o.after, `${s}.after`, i), o.tweens)
        for (let l = 0; l < o.tweens.length; l++) {
          const u = o.tweens[l], d = `${s}.tweens[${l}]`;
          if (!u.type) {
            i.push({ path: d, level: "error", message: "Missing 'type' field" });
            continue;
          }
          const m = Nr(u.type);
          if (!m) {
            i.push({ path: d, level: "error", message: `Unknown tween type: "${u.type}"` });
            continue;
          }
          if (t)
            try {
              const g = Cd(u, t);
              g ? m.validate(g.params) : u.target && i.push({ path: d, level: "warn", message: `Target "${u.target}" could not be resolved for compilation` });
            } catch (g) {
              i.push({ path: d, level: "error", message: g.message });
            }
          t && u.target && !t.has(u.target) && i.push({ path: `${d}.target`, level: "warn", message: `Target "${u.target}" is not resolved` });
        }
    }
  }
}
c(el, "validateEntries");
function np(n, e = null) {
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
      hi(s.setup, `${l}.setup`, t), hi(s.landing, `${l}.landing`, t), s.timeline && Array.isArray(s.timeline) && el(s.timeline, `${l}.timeline`, e, t), s.next && typeof s.next == "string" && !n.segments[s.next] && t.push({ path: `${l}.next`, level: "error", message: `Next segment "${s.next}" not found` });
    }
  } else
    hi(n.setup, "setup", t), hi(n.landing, "landing", t), n.timeline && Array.isArray(n.timeline) && el(n.timeline, "timeline", e, t);
  return t;
}
c(np, "validateCinematicDeep");
const Wo = 4, Lc = /* @__PURE__ */ new Set(["click", "tile-click", "keypress"]);
var oe, fe, Re, Le, lo, Od, G, Ne, aa, Ee, Lt;
const de = class de {
  constructor(e = null, { loadedHash: t = null, cinematicName: i = "default", segmentName: r = null } = {}) {
    I(this, G);
    I(this, oe);
    I(this, fe);
    I(this, Re);
    I(this, Le);
    var o;
    C(this, oe, e ?? de.empty()), C(this, fe, i), C(this, Le, t);
    const a = (o = f(this, oe).cinematics) == null ? void 0 : o[f(this, fe)];
    C(this, Re, r ?? (a == null ? void 0 : a.entry) ?? "main");
  }
  static empty() {
    return {
      version: Wo,
      cinematics: {
        default: de.emptyCinematic()
      }
    };
  }
  static emptyCinematic() {
    return {
      trigger: "canvasReady",
      tracking: !0,
      entry: "main",
      segments: {
        main: de.emptySegment()
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
        var E;
        return b.await != null && Lc.has(((E = b.await) == null ? void 0 : E.event) ?? "click");
      }
    )) {
      const b = s.filter((A) => A.transitionTo == null), E = s.find((A) => A.transitionTo != null), L = { timeline: b };
      if (a && Object.keys(a).length && (L.setup = a), o && Object.keys(o).length && (L.landing = o), E) {
        const A = E.transitionTo;
        A.scene && A.cinematic ? L.next = { segment: A.cinematic, scene: A.scene } : A.cinematic;
      }
      return {
        trigger: t,
        tracking: i,
        ...r ? { synchronized: r } : {},
        entry: "main",
        segments: { main: L }
      };
    }
    const u = {};
    let d = [], m = 1, g = null;
    const h = [];
    function y() {
      const b = `segment-${m++}`, E = { timeline: [...d] };
      return g && (E.gate = g), u[b] = E, h.push(b), d = [], g = null, b;
    }
    c(y, "flushSegment");
    for (const b of s)
      if (b.transitionTo == null) {
        if (b.await != null && Lc.has(((w = b.await) == null ? void 0 : w.event) ?? "click")) {
          y(), g = { ...b.await }, delete g.event, g = { event: b.await.event ?? "click", ...g };
          continue;
        }
        d.push(b);
      }
    (d.length > 0 || g) && y();
    for (let b = 0; b < h.length - 1; b++)
      u[h[b]].next = h[b + 1];
    h.length > 0 && (a && Object.keys(a).length && (u[h[0]].setup = a), o && Object.keys(o).length && (u[h[h.length - 1]].landing = o));
    const p = s.find((b) => b.transitionTo != null);
    if (p && h.length > 0) {
      const b = p.transitionTo, E = u[h[h.length - 1]];
      b.scene && b.cinematic && (E.next = { segment: b.cinematic, scene: b.scene });
    }
    return {
      trigger: t,
      tracking: i,
      ...r ? { synchronized: r } : {},
      entry: h[0] ?? "main",
      segments: u
    };
  }
  static fromScene(e, t = "default") {
    var o;
    const i = e == null ? void 0 : e.getFlag(T, "cinematic");
    let r = i ? foundry.utils.deepClone(i) : null;
    const a = i ? S(o = de, lo, Od).call(o, i) : null;
    if (r && (r.version ?? 1) < 3) {
      const { version: s, ...l } = r;
      r = { version: 3, cinematics: { default: l } };
    }
    if (r && r.version === 3) {
      for (const [s, l] of Object.entries(r.cinematics ?? {}))
        r.cinematics[s] = de.migrateV3toV4(l);
      r.version = Wo;
    }
    return new de(r, { loadedHash: a, cinematicName: t });
  }
  /**
   * Check if the scene's cinematic flag has been modified since this state was loaded.
   * @param {object} scene  The Foundry scene document
   * @returns {boolean} true if scene data differs from what was loaded
   */
  isStale(e) {
    if (!f(this, Le)) return !1;
    const t = e == null ? void 0 : e.getFlag(T, "cinematic");
    return t ? !foundry.utils.objectsEqual(t, f(this, Le)) : !1;
  }
  // ── Read ──────────────────────────────────────────────────────────────
  get data() {
    return f(this, oe);
  }
  get trigger() {
    return f(this, G, Ne).trigger;
  }
  get tracking() {
    return f(this, G, Ne).tracking;
  }
  get synchronized() {
    return f(this, G, Ne).synchronized ?? !1;
  }
  get activeCinematicName() {
    return f(this, fe);
  }
  // ── Segment accessors ────────────────────────────────────────────────
  get segments() {
    return f(this, G, Ne).segments;
  }
  get entry() {
    return f(this, G, Ne).entry;
  }
  get activeSegmentName() {
    return f(this, Re);
  }
  get activeSegment() {
    var e;
    return ((e = f(this, G, Ne).segments) == null ? void 0 : e[f(this, Re)]) ?? null;
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
    return Object.keys(f(this, oe).cinematics);
  }
  switchCinematic(e) {
    if (!f(this, oe).cinematics[e]) return this;
    const t = f(this, oe).cinematics[e];
    return new de(foundry.utils.deepClone(f(this, oe)), {
      loadedHash: f(this, Le),
      cinematicName: e,
      segmentName: t.entry ?? "main"
    });
  }
  addCinematic(e) {
    if (!e || f(this, oe).cinematics[e]) return this;
    const t = foundry.utils.deepClone(f(this, oe));
    return t.cinematics[e] = de.emptyCinematic(), new de(t, {
      loadedHash: f(this, Le),
      cinematicName: e,
      segmentName: "main"
    });
  }
  removeCinematic(e) {
    if (Object.keys(f(this, oe).cinematics).length <= 1) return this;
    if (!f(this, oe).cinematics[e]) return this;
    const i = foundry.utils.deepClone(f(this, oe));
    delete i.cinematics[e];
    const r = f(this, fe) === e ? Object.keys(i.cinematics)[0] : f(this, fe), a = i.cinematics[r];
    return new de(i, {
      loadedHash: f(this, Le),
      cinematicName: r,
      segmentName: (a == null ? void 0 : a.entry) ?? "main"
    });
  }
  renameCinematic(e, t) {
    if (!e || !t || e === t) return this;
    if (!f(this, oe).cinematics[e]) return this;
    if (f(this, oe).cinematics[t]) return this;
    const i = foundry.utils.deepClone(f(this, oe)), r = {};
    for (const [o, s] of Object.entries(i.cinematics))
      r[o === e ? t : o] = s;
    i.cinematics = r;
    const a = f(this, fe) === e ? t : f(this, fe);
    return new de(i, {
      loadedHash: f(this, Le),
      cinematicName: a,
      segmentName: f(this, Re)
    });
  }
  // ── Cinematic-level mutations ─────────────────────────────────────────
  setTrigger(e) {
    return S(this, G, aa).call(this, { trigger: e });
  }
  setTracking(e) {
    return S(this, G, aa).call(this, { tracking: e });
  }
  setSynchronized(e) {
    return S(this, G, aa).call(this, { synchronized: e });
  }
  // ── Segment-level mutations (setup/landing now live on segments) ──────
  setSetup(e) {
    return S(this, G, Ee).call(this, { setup: e });
  }
  setLanding(e) {
    return S(this, G, Ee).call(this, { landing: e });
  }
  // ── Segment management methods ────────────────────────────────────────
  switchSegment(e) {
    var t;
    return (t = f(this, G, Ne).segments) != null && t[e] ? new de(foundry.utils.deepClone(f(this, oe)), {
      loadedHash: f(this, Le),
      cinematicName: f(this, fe),
      segmentName: e
    }) : this;
  }
  addSegment(e, t = null) {
    var a;
    if (!e || (a = f(this, G, Ne).segments) != null && a[e]) return this;
    const i = foundry.utils.deepClone(f(this, oe)), r = i.cinematics[f(this, fe)];
    if (r.segments[e] = de.emptySegment(), t && r.segments[t]) {
      const o = r.segments[t].next;
      r.segments[t].next = e, o && (r.segments[e].next = o);
    }
    return new de(i, {
      loadedHash: f(this, Le),
      cinematicName: f(this, fe),
      segmentName: e
    });
  }
  removeSegment(e) {
    var s, l;
    if (Object.keys(f(this, G, Ne).segments ?? {}).length <= 1) return this;
    if (!((s = f(this, G, Ne).segments) != null && s[e])) return this;
    const i = foundry.utils.deepClone(f(this, oe)), r = i.cinematics[f(this, fe)], a = r.segments[e].next;
    for (const [, u] of Object.entries(r.segments))
      (u.next === e || typeof u.next == "object" && ((l = u.next) == null ? void 0 : l.segment) === e) && (u.next = a ?? void 0, u.next || delete u.next);
    delete r.segments[e], r.entry === e && (r.entry = Object.keys(r.segments)[0]);
    const o = f(this, Re) === e ? r.entry : f(this, Re);
    return new de(i, {
      loadedHash: f(this, Le),
      cinematicName: f(this, fe),
      segmentName: o
    });
  }
  renameSegment(e, t) {
    var s, l, u;
    if (!e || !t || e === t) return this;
    if (!((s = f(this, G, Ne).segments) != null && s[e])) return this;
    if ((l = f(this, G, Ne).segments) != null && l[t]) return this;
    const i = foundry.utils.deepClone(f(this, oe)), r = i.cinematics[f(this, fe)], a = {};
    for (const [d, m] of Object.entries(r.segments))
      a[d === e ? t : d] = m;
    r.segments = a;
    for (const [, d] of Object.entries(r.segments))
      d.next === e ? d.next = t : typeof d.next == "object" && ((u = d.next) == null ? void 0 : u.segment) === e && (d.next.segment = t);
    r.entry === e && (r.entry = t);
    const o = f(this, Re) === e ? t : f(this, Re);
    return new de(i, {
      loadedHash: f(this, Le),
      cinematicName: f(this, fe),
      segmentName: o
    });
  }
  setSegmentGate(e) {
    return S(this, G, Ee).call(this, { gate: e ?? void 0 });
  }
  setSegmentNext(e) {
    return S(this, G, Ee).call(this, { next: e ?? void 0 });
  }
  setSegmentSetup(e) {
    return S(this, G, Ee).call(this, { setup: e });
  }
  setSegmentLanding(e) {
    return S(this, G, Ee).call(this, { landing: e });
  }
  listSegmentNames() {
    return Object.keys(f(this, G, Ne).segments ?? {});
  }
  // ── Timeline entry mutations (scoped to active segment) ──────────────
  addStep(e = -1) {
    const t = [...this.activeSegment.timeline], i = { tweens: [] };
    return e < 0 || e >= t.length ? t.push(i) : t.splice(e, 0, i), S(this, G, Ee).call(this, { timeline: t });
  }
  addDelay(e = -1, t = 1e3) {
    const i = [...this.activeSegment.timeline], r = { delay: t };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), S(this, G, Ee).call(this, { timeline: i });
  }
  addAwait(e = -1, t = null) {
    return console.warn(`[${T}] CinematicState.addAwait() is deprecated in v4. Use segment gates instead.`), this;
  }
  addEmit(e = -1, t = "") {
    const i = [...this.activeSegment.timeline], r = { emit: t };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), S(this, G, Ee).call(this, { timeline: i });
  }
  addParallel(e = -1) {
    const t = [...this.activeSegment.timeline], i = { parallel: { branches: [[], []], join: "all", overflow: "detach" } };
    return e < 0 || e >= t.length ? t.push(i) : t.splice(e, 0, i), S(this, G, Ee).call(this, { timeline: t });
  }
  addTransitionTo(e = -1, t = null) {
    return console.warn(`[${T}] CinematicState.addTransitionTo() is deprecated in v4. Use segment next edges instead.`), this;
  }
  addSound(e = -1, t = null) {
    const i = [...this.activeSegment.timeline], r = { sound: t ?? { src: "", volume: 0.8, loop: !1, duration: 0, fireAndForget: !1 } };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), S(this, G, Ee).call(this, { timeline: i });
  }
  addStopSound(e = -1, t = "") {
    const i = [...this.activeSegment.timeline], r = { stopSound: t };
    return e < 0 || e >= i.length ? i.push(r) : i.splice(e, 0, r), S(this, G, Ee).call(this, { timeline: i });
  }
  moveEntry(e, t) {
    if (e === t) return this;
    const i = [...this.activeSegment.timeline];
    if (e < 0 || e >= i.length) return this;
    if (t < 0 || t >= i.length) return this;
    const [r] = i.splice(e, 1);
    return i.splice(t, 0, r), S(this, G, Ee).call(this, { timeline: i });
  }
  removeEntry(e) {
    const t = [...this.activeSegment.timeline];
    return e < 0 || e >= t.length ? this : (t.splice(e, 1), S(this, G, Ee).call(this, { timeline: t }));
  }
  updateEntry(e, t) {
    const i = this.activeSegment.timeline.map((r, a) => a !== e ? r : { ...foundry.utils.deepClone(r), ...t });
    return S(this, G, Ee).call(this, { timeline: i });
  }
  // ── Tween mutations ──────────────────────────────────────────────────
  addTween(e, t = null) {
    const i = { type: "tile-prop", target: "", attribute: "alpha", value: 1, duration: 1e3 };
    return S(this, G, Lt).call(this, e, (r) => {
      const a = [...r.tweens ?? [], t ?? i];
      return { ...r, tweens: a };
    });
  }
  updateTween(e, t, i) {
    return S(this, G, Lt).call(this, e, (r) => {
      const a = (r.tweens ?? []).map((o, s) => s !== t ? o : { ...o, ...i });
      return { ...r, tweens: a };
    });
  }
  removeTween(e, t) {
    return S(this, G, Lt).call(this, e, (i) => {
      const r = (i.tweens ?? []).filter((a, o) => o !== t);
      return { ...i, tweens: r };
    });
  }
  // ── Parallel branch mutations ────────────────────────────────────────
  addBranch(e) {
    return S(this, G, Lt).call(this, e, (t) => {
      if (!t.parallel) return t;
      const i = [...t.parallel.branches, []];
      return { ...t, parallel: { ...t.parallel, branches: i } };
    });
  }
  removeBranch(e, t) {
    return S(this, G, Lt).call(this, e, (i) => {
      if (!i.parallel) return i;
      const r = i.parallel.branches.filter((a, o) => o !== t);
      return r.length < 1 ? i : { ...i, parallel: { ...i.parallel, branches: r } };
    });
  }
  addBranchEntry(e, t, i = null) {
    const r = { tweens: [] };
    return S(this, G, Lt).call(this, e, (a) => {
      if (!a.parallel) return a;
      const o = a.parallel.branches.map((s, l) => l !== t ? s : [...s, i ?? r]);
      return { ...a, parallel: { ...a.parallel, branches: o } };
    });
  }
  removeBranchEntry(e, t, i) {
    return S(this, G, Lt).call(this, e, (r) => {
      if (!r.parallel) return r;
      const a = r.parallel.branches.map((o, s) => s !== t ? o : o.filter((l, u) => u !== i));
      return { ...r, parallel: { ...r.parallel, branches: a } };
    });
  }
  updateBranchEntry(e, t, i, r) {
    return S(this, G, Lt).call(this, e, (a) => {
      if (!a.parallel) return a;
      const o = a.parallel.branches.map((s, l) => l !== t ? s : s.map((u, d) => d !== i ? u : { ...foundry.utils.deepClone(u), ...r }));
      return { ...a, parallel: { ...a.parallel, branches: o } };
    });
  }
  moveBranchEntry(e, t, i, r) {
    return i === r ? this : S(this, G, Lt).call(this, e, (a) => {
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
    const t = { ...foundry.utils.deepClone(f(this, oe)), version: Wo };
    await e.setFlag(T, "cinematic", t);
  }
  /** Returns the active cinematic's data (for validation/export). */
  toJSON() {
    return foundry.utils.deepClone(f(this, G, Ne));
  }
  /** Returns the entire v4 flag structure. */
  toFullJSON() {
    return foundry.utils.deepClone(f(this, oe));
  }
};
oe = new WeakMap(), fe = new WeakMap(), Re = new WeakMap(), Le = new WeakMap(), lo = new WeakSet(), Od = /* @__PURE__ */ c(function(e) {
  return foundry.utils.deepClone(e);
}, "#computeHash"), G = new WeakSet(), Ne = /* @__PURE__ */ c(function() {
  return f(this, oe).cinematics[f(this, fe)];
}, "#active"), // ── Internal ─────────────────────────────────────────────────────────
/** Clone the full state with a patch to the active cinematic (cinematic-level props). */
aa = /* @__PURE__ */ c(function(e) {
  const t = foundry.utils.deepClone(f(this, oe));
  return Object.assign(t.cinematics[f(this, fe)], e), new de(t, {
    loadedHash: f(this, Le),
    cinematicName: f(this, fe),
    segmentName: f(this, Re)
  });
}, "#cloneActive"), /** Clone the full state with a patch to the active segment within the active cinematic. */
Ee = /* @__PURE__ */ c(function(e) {
  const t = foundry.utils.deepClone(f(this, oe)), i = t.cinematics[f(this, fe)].segments[f(this, Re)];
  if (!i) return this;
  Object.assign(i, e);
  for (const [r, a] of Object.entries(i))
    a === void 0 && delete i[r];
  return new de(t, {
    loadedHash: f(this, Le),
    cinematicName: f(this, fe),
    segmentName: f(this, Re)
  });
}, "#cloneActiveSegment"), /** Mutate a single timeline entry within the active segment. */
Lt = /* @__PURE__ */ c(function(e, t) {
  const i = this.activeSegment;
  if (!i || e < 0 || e >= i.timeline.length) return this;
  const r = i.timeline.map((a, o) => o !== e ? a : t(foundry.utils.deepClone(a)));
  return S(this, G, Ee).call(this, { timeline: r });
}, "#mutateEntry"), I(de, lo), c(de, "CinematicState");
let zt = de;
const Ic = [
  { value: "tile-prop", label: "Tile Prop" },
  { value: "light-color", label: "Light Color" },
  { value: "light-state", label: "Light State" },
  { value: "particles-prop", label: "Particles Prop" },
  { value: "camera-pan", label: "Camera Pan" },
  { value: "token-prop", label: "Token Prop" },
  { value: "drawing-prop", label: "Drawing Prop" },
  { value: "sound-prop", label: "Sound Prop" }
], Ad = {
  "tile-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y, width, height" },
  "token-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y" },
  "drawing-prop": { form: "prop", attribute: "alpha", value: 1, placeholder: "alpha, rotation, x, y" },
  "sound-prop": { form: "prop", attribute: "volume", value: 0.5, placeholder: "volume, radius" },
  "particles-prop": { form: "particles", attribute: "alpha", value: 1, placeholder: "alpha, rate, speed, size" },
  "camera-pan": { form: "camera", x: 0, y: 0, scale: 1 },
  "light-color": { form: "lightColor", toColor: "#ffffff", toAlpha: "", mode: "oklch" },
  "light-state": { form: "lightState", enabled: !0 }
}, ip = [
  { value: "canvasReady", label: "Canvas Ready" },
  { value: "manual", label: "Manual Only" }
];
function Oc(n) {
  return n && (n.split("/").pop() || "").replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "-") || "";
}
c(Oc, "soundIdFromPath");
function Ac(n) {
  return n ? new Promise((e) => {
    const t = new Audio(n);
    t.addEventListener("loadedmetadata", () => {
      e(Math.round(t.duration * 1e3));
    }), t.addEventListener("error", () => e(0));
  }) : Promise.resolve(0);
}
c(Ac, "loadAudioDurationMs");
const yn = 40, Ji = 24, nr = 50, Nc = 50, Dn = 60, xn = 10, Jo = 16, Nd = 40, Md = 20, rp = 90, Mc = 70, kc = 8;
function Oo(n) {
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
c(Oo, "computeStepDurations");
function ap(n) {
  var i;
  const e = ((i = n.parallel) == null ? void 0 : i.branches) ?? [];
  let t = 0;
  for (const r of e) {
    let a = 0;
    for (const o of r)
      o.delay != null ? a += o.delay : o.await != null || o.emit != null || (o.sound != null ? a += o.sound.fireAndForget ? 0 : o.sound.duration ?? 0 : o.stopSound != null || (a += Oo(o).stepDuration));
    t = Math.max(t, a);
  }
  return Math.max(500, t);
}
c(ap, "computeParallelDuration");
function Fl(n) {
  return n.reduce((e, t) => t.delay != null ? e + t.delay : t.await != null || t.emit != null || t.transitionTo != null ? e : t.sound != null ? e + (t.sound.fireAndForget ? 0 : t.sound.duration ?? 0) : t.stopSound != null ? e : t.parallel != null ? e + ap(t) : e + Oo(t).stepDuration, 0);
}
c(Fl, "computeTotalDuration");
function op(n, e) {
  if (n <= 0) return 0.1;
  const t = e / n;
  return Math.max(0.03, Math.min(0.5, t));
}
c(op, "computeScale");
function kd(n) {
  const e = n.tweens ?? [];
  if (e.length === 0) return "Empty";
  const t = e[0], i = (t.target ?? "").replace(/^tag:/, "#"), r = t.attribute ?? "";
  return t.type === "camera-pan" ? "Pan" : r === "alpha" ? `Fade ${i}` : r === "x" || r === "y" ? `Move ${i}` : t.type === "light-color" ? `Light ${i}` : t.type === "sound-prop" ? `Sound ${i}` : i ? `${i}` : "Step";
}
c(kd, "deriveStepLabel");
function sp(n, e, t, i, r) {
  var u, d;
  const a = [], o = [], s = [];
  let l = e;
  for (let m = 0; m < n.length; m++) {
    const g = n[m], h = `${i}.${m}`, y = r === h;
    if (g.delay != null) {
      const p = Math.max(Md, g.delay * t);
      a.push({ type: "delay", leftPx: l, widthPx: p, label: `${g.delay}ms`, entryPath: h, selected: y }), l += p;
    } else if (g.await != null) {
      const p = ((u = g.await) == null ? void 0 : u.event) ?? "click", w = p === "tile-click" ? "fa-hand-pointer" : p === "signal" ? "fa-bolt" : "fa-pause";
      a.push({ type: "await", leftPx: l, widthPx: Jo, label: p, entryPath: h, selected: y, isGate: !0, gateIcon: w }), ((d = g.await) == null ? void 0 : d.event) === "signal" && s.push({ signal: g.await.signal, centerPx: l + Jo / 2 }), l += Jo;
    } else if (g.emit != null)
      a.push({ type: "emit", leftPx: l, widthPx: xn, label: "emit", entryPath: h, selected: y, isMarker: !0 }), o.push({ signal: g.emit, centerPx: l + xn / 2 });
    else if (g.sound != null) {
      const p = (g.sound.src || "").split("/").pop() || "Sound", w = g.sound.duration ?? 0;
      if (g.sound.fireAndForget ?? !1)
        a.push({ type: "sound", leftPx: l, widthPx: xn, label: p, entryPath: h, selected: y, isMarker: !0 });
      else {
        const E = w > 0 ? Math.max(Dn, w * t) : Dn, L = (g.sound.loop ?? !1) && w <= 0;
        a.push({ type: "sound", leftPx: l, widthPx: E, label: p, entryPath: h, selected: y, hasTrailingArrow: L }), l += E;
      }
    } else if (g.stopSound != null)
      a.push({ type: "stopSound", leftPx: l, widthPx: xn, label: "Stop", entryPath: h, selected: y, isMarker: !0 });
    else {
      const { stepDuration: p } = Oo(g), w = Math.max(Nd, p * t), b = kd(g);
      a.push({ type: "step", leftPx: l, widthPx: w, label: b, entryPath: h, selected: y }), l += w;
    }
  }
  return { blocks: a, width: l - e, emits: o, awaits: s };
}
c(sp, "computeBranchLane");
function $c(n) {
  return Ji + n * yn;
}
c($c, "laneIndexToY");
function lp(n, e) {
  const t = [];
  for (const i of n.emits)
    for (const r of n.awaits) {
      if (i.signal !== r.signal) continue;
      const a = i.centerPx, o = $c(i.laneIndex) + yn / 2, s = r.centerPx, l = $c(r.laneIndex) + yn / 2, u = l - o, d = (a + s) / 2, m = o + Math.sign(u || 1) * Math.min(40, Math.abs(u) * 0.5 + 20), g = l - Math.sign(u || 1) * Math.min(40, Math.abs(u) * 0.5 + 20);
      t.push({
        pathD: `M ${a} ${o} C ${d} ${m}, ${d} ${g}, ${s} ${l}`,
        signal: i.signal
      });
    }
  return t;
}
c(lp, "computeSignalArcs");
function cp(n, e) {
  const t = [];
  if (n <= 0) return t;
  const i = e * 1e3;
  let r;
  i >= 200 ? r = 500 : i >= 80 ? r = 1e3 : i >= 40 ? r = 2e3 : r = 5e3;
  for (let a = 0; a <= n + r; a += r) {
    const o = a >= 1e3 ? `${(a / 1e3).toFixed(a % 1e3 === 0 ? 0 : 1)}s` : `${a}ms`;
    t.push({ px: nr + a * e, label: o });
  }
  return t;
}
c(cp, "computeTimeMarkers");
function up(n) {
  const e = [];
  for (let t = 0; t < n.length - 1; t++) {
    const i = n[t], r = n[t + 1], a = i.leftPx + i.widthPx + (r.leftPx - (i.leftPx + i.widthPx)) / 2, o = Ji + yn / 2;
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
c(up, "computeInsertionPoints");
function dp(n, { selectedPath: e, windowWidth: t }) {
  const i = Fl(n), r = t - 70 - 100, a = op(i, r), o = [], s = [], l = { emits: [], awaits: [] }, u = [];
  o.push({
    type: "setup",
    leftPx: 0,
    widthPx: nr,
    label: "Setup",
    entryPath: "setup",
    selected: e === "setup"
  });
  let d = nr;
  for (let E = 0; E < n.length; E++) {
    const L = n[E], A = `timeline.${E}`, $ = e === A;
    if (L.delay != null) {
      const k = Math.max(Md, L.delay * a);
      o.push({
        type: "delay",
        leftPx: d,
        widthPx: k,
        label: `${L.delay}ms`,
        entryPath: A,
        selected: $
      }), d += k;
    } else if (L.emit != null)
      o.push({
        type: "emit",
        leftPx: d,
        widthPx: xn,
        label: "Emit",
        entryPath: A,
        selected: $,
        isMarker: !0
      }), l.emits.push({
        signal: L.emit,
        centerPx: d + xn / 2,
        laneIndex: 0
      });
    else if (L.sound != null) {
      const k = (L.sound.src || "").split("/").pop() || "Sound", D = L.sound.duration ?? 0;
      if (L.sound.fireAndForget ?? !1) {
        const K = D > 0 ? Math.max(Dn, D * a) : Dn, _ = (L.sound.loop ?? !1) && D <= 0, P = {
          type: "sound",
          leftPx: d,
          widthPx: K,
          label: k,
          entryPath: A,
          selected: $,
          hasTrailingArrow: _
        };
        let N = !1;
        for (const R of u)
          if (R.rightEdgePx <= d) {
            R.blocks.push(P), R.rightEdgePx = d + K, N = !0;
            break;
          }
        N || u.push({
          label: "♫ F&F",
          blocks: [P],
          rightEdgePx: d + K
        });
      } else {
        const K = D > 0 ? Math.max(Dn, D * a) : Dn, _ = (L.sound.loop ?? !1) && D <= 0;
        o.push({
          type: "sound",
          leftPx: d,
          widthPx: K,
          label: k,
          entryPath: A,
          selected: $,
          hasTrailingArrow: _
        }), d += K;
      }
    } else if (L.stopSound != null)
      o.push({
        type: "stopSound",
        leftPx: d,
        widthPx: xn,
        label: "Stop",
        entryPath: A,
        selected: $,
        isMarker: !0
      });
    else if (L.parallel != null) {
      const k = L.parallel.branches ?? [], D = d, J = [];
      let K = 0;
      for (let P = 0; P < k.length; P++) {
        const N = `timeline.${E}.parallel.branches.${P}`, { blocks: R, width: V, emits: z, awaits: H } = sp(k[P], D, a, N, e);
        J.push({ label: `Br ${P + 1}`, blocks: R }), K = Math.max(K, V);
        const U = s.length * 10 + P + 1;
        for (const Y of z) l.emits.push({ ...Y, laneIndex: U });
        for (const Y of H) l.awaits.push({ ...Y, laneIndex: U });
      }
      const _ = Math.max(Dn, K);
      o.push({
        type: "parallel",
        leftPx: D,
        widthPx: _,
        label: `${k.length} br`,
        entryPath: A,
        selected: $
      }), s.push({ parallelEntryIndex: E, startPx: D, lanes: J }), d += _;
    } else {
      const { stepDuration: k, detachOverflow: D } = Oo(L), J = Math.max(Nd, k * a), K = D > 0 ? Math.max(4, D * a) : 0, _ = kd(L);
      o.push({
        type: "step",
        leftPx: d,
        widthPx: J,
        detachTailPx: K,
        label: _,
        entryPath: A,
        selected: $
      }), d += J;
    }
  }
  o.push({
    type: "landing",
    leftPx: d,
    widthPx: Nc,
    label: "Landing",
    entryPath: "landing",
    selected: e === "landing"
  }), d += Nc;
  const m = s.flatMap((E) => E.lanes), g = m.length;
  for (const E of u)
    m.push({ label: E.label, blocks: E.blocks });
  const h = lp(l, m.length), y = [];
  for (let E = 0; E < u.length; E++) {
    const L = g + E;
    for (const A of u[E].blocks) {
      const $ = A.leftPx, k = Ji + yn, D = Ji + (1 + L) * yn + yn / 2;
      y.push({ x: $, y1: k, y2: D });
    }
  }
  const p = cp(i, a), w = up(o), b = Ji + (1 + m.length) * yn;
  return {
    mainBlocks: o,
    subLanes: m,
    signalArcs: h,
    fafConnectors: y,
    timeMarkers: p,
    insertionPoints: w,
    totalWidthPx: Math.max(d, 200),
    swimlaneHeightPx: b,
    totalDurationMs: i
  };
}
c(dp, "computeLanes");
function fp(n) {
  if (n <= 0) return "0s";
  if (n < 1e3) return `${n}ms`;
  const e = n / 1e3;
  return e % 1 === 0 ? `${e}s` : `${e.toFixed(1)}s`;
}
c(fp, "formatDuration");
function mp(n, e) {
  var h, y, p, w;
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
  let u = kc;
  for (const b of o) {
    const E = t[b], L = Fl(E.timeline ?? []), A = fp(L), $ = b === i, k = b === e, D = !a.has(b), J = rp;
    l.push({
      name: b,
      durationMs: L,
      durationLabel: A,
      isEntry: $,
      isActive: k,
      isOrphan: D,
      leftPx: u,
      widthPx: J,
      hasGate: !!E.gate,
      gateEvent: ((h = E.gate) == null ? void 0 : h.event) ?? null
    }), u += J + Mc;
  }
  const d = [], m = new Map(l.map((b) => [b.name, b]));
  for (const b of o) {
    const E = t[b];
    if (!E.next) continue;
    const L = typeof E.next == "string" ? E.next : (y = E.next) == null ? void 0 : y.segment;
    if (!L) continue;
    const A = m.get(b), $ = m.get(L);
    if (!A || !$) continue;
    const k = t[L], D = ((p = k == null ? void 0 : k.gate) == null ? void 0 : p.event) ?? null, J = typeof E.next == "object" && ((w = E.next) == null ? void 0 : w.scene);
    d.push({
      fromName: b,
      toName: L,
      gateLabel: D,
      isCrossScene: J,
      fromRightPx: A.leftPx + A.widthPx,
      toLeftPx: $.leftPx
    });
  }
  const g = u - Mc + kc;
  return { nodes: l, edges: d, totalWidthPx: g };
}
c(mp, "computeSegmentGraph");
function Sn(n) {
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
c(Sn, "parseEntryPath");
function Oa(n, e) {
  var i, r, a, o;
  const t = Sn(n);
  return t ? t.type === "setup" ? e.setup : t.type === "landing" ? e.landing : t.type === "timeline" ? e.timeline[t.index] : t.type === "branch" ? (o = (a = (r = (i = e.timeline[t.index]) == null ? void 0 : i.parallel) == null ? void 0 : r.branches) == null ? void 0 : a[t.branchIndex]) == null ? void 0 : o[t.branchEntryIndex] : null : null;
}
c(Oa, "getEntryAtPath");
function Dc(n) {
  const e = Sn(n);
  return !e || e.type !== "timeline" ? null : e.index;
}
c(Dc, "getTimelineIndexFromPath");
function gp(n) {
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
c(gp, "countUniqueTargets");
function hp(n) {
  var e;
  return (e = n.tweens) != null && e.length ? Math.max(500, ...n.tweens.map((t) => t.duration ?? 0)) : 500;
}
c(hp, "maxTweenDuration");
function pp(n, e) {
  var i, r, a;
  const t = Sn(n);
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
c(pp, "stepNumberForPath");
function yp(n) {
  return {
    isSetup: !0,
    targetCount: Object.keys(n.setup ?? {}).length
  };
}
c(yp, "buildSetupDetail");
function bp(n) {
  return {
    isLanding: !0,
    targetCount: Object.keys(n.landing ?? {}).length
  };
}
c(bp, "buildLandingDetail");
function wp(n) {
  return { type: "delay", isDelay: !0, delay: n.delay };
}
c(wp, "buildDelayDetail");
function vp(n) {
  return { type: "emit", isEmit: !0, signal: n.emit };
}
c(vp, "buildEmitDetail");
function Ep(n) {
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
c(Ep, "buildSoundDetail");
function Sp(n) {
  return {
    type: "stopSound",
    isStopSound: !0,
    stopSoundId: n.stopSound
  };
}
c(Sp, "buildStopSoundDetail");
function Tp(n, e) {
  var o;
  const t = n.parallel, i = t.join ?? "all", r = t.overflow ?? "detach", a = (t.branches ?? []).map((s, l) => ({
    branchIndex: l,
    label: `Branch ${l + 1}`,
    entries: (s ?? []).map((u, d) => {
      var L, A;
      const m = u.delay != null, g = u.await != null, h = u.emit != null, y = u.sound != null, p = u.stopSound != null, w = !m && !g && !h && !y && !p;
      let b, E;
      return m ? (b = `${u.delay}ms`, E = "delay") : g ? (b = "Await", E = ((L = u.await) == null ? void 0 : L.event) ?? "click") : h ? (b = "Emit", E = u.emit || "(unnamed)") : y ? (b = "Sound", E = (u.sound.src || "").split("/").pop() || "(none)") : p ? (b = "Stop Sound", E = u.stopSound || "(no id)") : (b = "Step", E = `${((A = u.tweens) == null ? void 0 : A.length) ?? 0} tweens`), { branchEntryIndex: d, isDelay: m, isAwait: g, isEmit: h, isSound: y, isStopSound: p, isStep: w, label: b, sub: E };
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
c(Tp, "buildParallelDetail");
function Cp(n, e, t, i) {
  const r = dh(), a = (n.tweens ?? []).map((l, u) => {
    const d = `${e}.tweens.${u}`, m = t.has(d), g = l.type ?? "tile-prop", h = Ic.find((b) => b.value === g), y = Ad[g], p = (y == null ? void 0 : y.form) ?? "prop", w = l.mode ?? "oklch";
    return {
      tweenIndex: u,
      isExpanded: m,
      type: g,
      typeLabel: (h == null ? void 0 : h.label) ?? l.type ?? "Tile Prop",
      target: l.target ?? "",
      attribute: l.attribute ?? "",
      attributePlaceholder: (y == null ? void 0 : y.placeholder) ?? "",
      value: l.value ?? "",
      duration: l.duration ?? 0,
      easing: l.easing ?? "",
      detach: l.detach ?? !1,
      // Form group flags
      formGroup: p,
      formIsProp: p === "prop",
      formIsParticles: p === "particles",
      formIsCamera: p === "camera",
      formIsLightColor: p === "lightColor",
      formIsLightState: p === "lightState",
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
      typeOptions: Ic.map((b) => ({
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
    stepNumber: pp(e, i),
    maxDuration: hp(n),
    tweens: a,
    beforeSummary: o.length ? `${o.length} target${o.length !== 1 ? "s" : ""}` : "(none)",
    afterSummary: s.length ? `${s.length} target${s.length !== 1 ? "s" : ""}` : "(none)"
  };
}
c(Cp, "buildStepDetail");
function Lp(n, { state: e, expandedTweens: t }) {
  const i = Sn(n);
  if (!i) return null;
  if (i.type === "setup") return yp(e);
  if (i.type === "landing") return bp(e);
  const r = Oa(n, e);
  return r ? r.delay != null ? wp(r) : r.emit != null ? vp(r) : r.sound != null ? Ep(r) : r.stopSound != null ? Sp(r) : r.parallel != null && i.type === "timeline" ? Tp(r) : Cp(r, n, t, e) : null;
}
c(Lp, "buildDetail");
function Ip({ state: n, mutate: e }) {
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
              e(() => new zt(l));
            else if (l.segments !== void 0) {
              const u = { version: 4, cinematics: { [n.activeCinematicName]: l } };
              e(() => new zt(u, { cinematicName: n.activeCinematicName }));
            } else if (l.timeline !== void 0) {
              const u = { version: 3, cinematics: { [n.activeCinematicName]: l } };
              e(() => new zt(u, { cinematicName: n.activeCinematicName }));
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
c(Ip, "showImportDialog");
function Aa(n, { state: e, mutate: t }) {
  const i = n === "setup" ? e.setup : e.landing, r = JSON.stringify(i ?? {}, null, 2);
  new Dialog({
    title: `Edit ${n.charAt(0).toUpperCase() + n.slice(1)}`,
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON map of target selector → property overrides:</p>
			<textarea id="cinematic-json-edit" style="width:100%;height:200px;font-family:monospace;font-size:0.8rem">${vt(r)}</textarea>
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
c(Aa, "showEditJsonDialog");
function Fc(n, { selectedPath: e, state: t, mutate: i }) {
  const r = Oa(e, t);
  if (!r || r.delay != null) return;
  const a = r[n] ?? {}, o = JSON.stringify(a, null, 2);
  new Dialog({
    title: `Edit Step ${n.charAt(0).toUpperCase() + n.slice(1)}`,
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON map of target selector → property overrides:</p>
			<textarea id="cinematic-json-edit" style="width:100%;height:200px;font-family:monospace;font-size:0.8rem">${vt(o)}</textarea>
		`,
    buttons: {
      save: {
        label: "Apply",
        callback: /* @__PURE__ */ c((s) => {
          var u, d;
          const l = s.find("#cinematic-json-edit").val();
          try {
            const m = JSON.parse(l), g = Sn(e);
            (g == null ? void 0 : g.type) === "timeline" ? i((h) => h.updateEntry(g.index, { [n]: m })) : (g == null ? void 0 : g.type) === "branch" && i((h) => h.updateBranchEntry(g.index, g.branchIndex, g.branchEntryIndex, { [n]: m }));
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
c(Fc, "showEditStepStateDialog");
function Op({ selectedPath: n, state: e, mutate: t }) {
  const i = Sn(n);
  if (!i || i.type !== "timeline") return;
  const r = e.timeline[i.index];
  if (!(r != null && r.parallel)) return;
  const a = JSON.stringify(r.parallel.branches ?? [], null, 2);
  new Dialog({
    title: "Edit Parallel Branches",
    content: `
			<p style="font-size:0.82rem;margin-bottom:0.4rem">JSON array of branch timelines:</p>
			<textarea id="cinematic-json-edit" style="width:100%;height:250px;font-family:monospace;font-size:0.8rem">${vt(a)}</textarea>
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
c(Op, "showEditParallelJsonDialog");
var Bc, cn, wn, oa, $d;
const gt = class gt extends In(Ln) {
  constructor(t = {}) {
    super(t);
    I(this, wn);
    I(this, cn, null);
    C(this, cn, t.scene ?? canvas.scene ?? null);
  }
  async _prepareContext() {
    var r, a, o;
    const t = f(this, wn, oa), i = ((a = t == null ? void 0 : t.getSeenStatus) == null ? void 0 : a.call(t, (r = f(this, cn)) == null ? void 0 : r.id)) ?? [];
    return {
      sceneName: ((o = f(this, cn)) == null ? void 0 : o.name) ?? "No scene",
      users: i.map((s) => ({
        ...s,
        statusLabel: s.seen ? "Seen" : "Not seen",
        statusClass: s.seen ? "cinematic-tracking__status--seen" : "cinematic-tracking__status--unseen"
      })),
      hasAnyTracked: i.some((s) => s.seen)
    };
  }
  _onRender(t, i) {
    super._onRender(t, i), S(this, wn, $d).call(this);
  }
};
cn = new WeakMap(), wn = new WeakSet(), oa = /* @__PURE__ */ c(function() {
  var t, i;
  return (i = (t = game.modules.get(T)) == null ? void 0 : t.api) == null ? void 0 : i.cinematic;
}, "#api"), $d = /* @__PURE__ */ c(function() {
  var i, r;
  const t = this.element;
  t instanceof HTMLElement && (t.querySelectorAll("[data-action='reset-user']").forEach((a) => {
    a.addEventListener("click", async () => {
      var l;
      const o = a.dataset.userId;
      if (!o) return;
      const s = f(this, wn, oa);
      s != null && s.resetForUser && (await s.resetForUser((l = f(this, cn)) == null ? void 0 : l.id, o), this.render({ force: !0 }));
    });
  }), (i = t.querySelector("[data-action='reset-all']")) == null || i.addEventListener("click", async () => {
    var o;
    const a = f(this, wn, oa);
    a != null && a.resetForAll && (await a.resetForAll((o = f(this, cn)) == null ? void 0 : o.id), this.render({ force: !0 }));
  }), (r = t.querySelector("[data-action='refresh']")) == null || r.addEventListener("click", () => {
    this.render({ force: !0 });
  }));
}, "#bindEvents"), c(gt, "CinematicTrackingApplication"), pe(gt, "APP_ID", `${T}-cinematic-tracking`), pe(gt, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  De(gt, gt, "DEFAULT_OPTIONS"),
  {
    id: gt.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Bc = De(gt, gt, "DEFAULT_OPTIONS")) == null ? void 0 : Bc.classes) ?? [], "eidolon-cinematic-tracking-window", "themed"])
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
)), pe(gt, "PARTS", {
  content: {
    template: `modules/${T}/templates/cinematic-tracking.html`
  }
});
let tl = gt;
function Ap(n, e) {
  var t, i, r, a, o, s, l, u, d;
  (t = n.querySelector("[data-action='save']")) == null || t.addEventListener("click", () => e.save()), (i = n.querySelector("[data-action='play-preview']")) == null || i.addEventListener("click", () => e.play()), (r = n.querySelector("[data-action='reset-tracking']")) == null || r.addEventListener("click", () => e.resetTracking()), (a = n.querySelector("[data-action='export-json']")) == null || a.addEventListener("click", () => e.exportJSON()), (o = n.querySelector("[data-action='undo']")) == null || o.addEventListener("click", () => e.undo()), (s = n.querySelector("[data-action='redo']")) == null || s.addEventListener("click", () => e.redo()), (l = n.querySelector("[data-action='validate']")) == null || l.addEventListener("click", () => e.validate()), (u = n.querySelector("[data-action='import-json']")) == null || u.addEventListener("click", () => e.importJSON()), (d = n.querySelector("[data-action='open-tracking']")) == null || d.addEventListener("click", () => {
    new tl({ scene: e.scene }).render(!0);
  });
}
c(Ap, "bindToolbarEvents");
function Np(n, e) {
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
            var l, u, d, m, g, h, y;
            const s = (l = o.find("#cinematic-new-name").val()) == null ? void 0 : l.trim();
            if (!s) {
              (d = (u = ui.notifications) == null ? void 0 : u.warn) == null || d.call(u, "Name cannot be empty.");
              return;
            }
            if (/[.\s]/.test(s)) {
              (g = (m = ui.notifications) == null ? void 0 : m.warn) == null || g.call(m, "Name cannot contain dots or spaces.");
              return;
            }
            if (e.state.listCinematicNames().includes(s)) {
              (y = (h = ui.notifications) == null ? void 0 : h.warn) == null || y.call(h, "Name already exists.");
              return;
            }
            e.mutate((p) => p.addCinematic(s));
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
      content: `<label style="display:flex;align-items:center;gap:0.5rem"><span>Name:</span><input id="cinematic-rename" type="text" style="flex:1" value="${vt(o)}" /></label>`,
      buttons: {
        ok: {
          label: "Rename",
          callback: /* @__PURE__ */ c((s) => {
            var u, d, m, g, h, y, p;
            const l = (u = s.find("#cinematic-rename").val()) == null ? void 0 : u.trim();
            if (!l) {
              (m = (d = ui.notifications) == null ? void 0 : d.warn) == null || m.call(d, "Name cannot be empty.");
              return;
            }
            if (/[.\s]/.test(l)) {
              (h = (g = ui.notifications) == null ? void 0 : g.warn) == null || h.call(g, "Name cannot contain dots or spaces.");
              return;
            }
            if (l !== o) {
              if (e.state.listCinematicNames().includes(l)) {
                (p = (y = ui.notifications) == null ? void 0 : y.warn) == null || p.call(y, "Name already exists.");
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
c(Np, "bindCinematicSelectorEvents");
function Mp(n, e) {
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
        const s = Dc(t), l = Dc(o);
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
c(Mp, "bindSwimlaneEvents");
function kp(n, e) {
  var t, i, r, a, o, s, l, u, d, m;
  (t = n.querySelector("[data-action='delete-entry']")) == null || t.addEventListener("click", () => {
    const g = e.parseEntryPath(e.selectedPath);
    g && (g.type === "timeline" ? (e.mutate((h) => h.removeEntry(g.index)), e.setSelectedPath(null)) : g.type === "branch" && (e.mutate((h) => h.removeBranchEntry(g.index, g.branchIndex, g.branchEntryIndex)), e.setSelectedPath(null)));
  }), (i = n.querySelector("[data-action='add-tween']")) == null || i.addEventListener("click", () => {
    const g = e.parseEntryPath(e.selectedPath);
    if (g) {
      if (g.type === "timeline")
        e.mutate((h) => h.addTween(g.index));
      else if (g.type === "branch") {
        const h = e.getEntryAtPath(e.selectedPath);
        if (!h) return;
        const y = { type: "tile-prop", target: "", attribute: "alpha", value: 1, duration: 1e3 }, p = [...h.tweens ?? [], y];
        e.mutate((w) => w.updateBranchEntry(g.index, g.branchIndex, g.branchEntryIndex, { tweens: p }));
      }
    }
  }), (r = n.querySelector("[data-action='change-delay']")) == null || r.addEventListener("change", (g) => {
    const h = e.parseEntryPath(e.selectedPath);
    if (!h) return;
    const y = Number(g.target.value) || 0;
    h.type === "timeline" ? e.mutate((p) => p.updateEntry(h.index, { delay: y })) : h.type === "branch" && e.mutate((p) => p.updateBranchEntry(h.index, h.branchIndex, h.branchEntryIndex, { delay: y }));
  }), (a = n.querySelector("[data-action='edit-setup']")) == null || a.addEventListener("click", () => {
    Aa("setup", { state: e.state, mutate: e.mutate });
  }), (o = n.querySelector("[data-action='edit-landing']")) == null || o.addEventListener("click", () => {
    Aa("landing", { state: e.state, mutate: e.mutate });
  }), (s = n.querySelector("[data-action='edit-before']")) == null || s.addEventListener("click", () => {
    Fc("before", { selectedPath: e.selectedPath, state: e.state, mutate: e.mutate });
  }), (l = n.querySelector("[data-action='edit-after']")) == null || l.addEventListener("click", () => {
    Fc("after", { selectedPath: e.selectedPath, state: e.state, mutate: e.mutate });
  }), (u = n.querySelector("[data-action='change-trigger']")) == null || u.addEventListener("change", (g) => {
    e.mutate((h) => h.setTrigger(g.target.value));
  }), (d = n.querySelector("[data-action='change-tracking']")) == null || d.addEventListener("change", (g) => {
    e.mutate((h) => h.setTracking(g.target.checked));
  }), (m = n.querySelector("[data-action='change-synchronized']")) == null || m.addEventListener("change", (g) => {
    e.mutate((h) => h.setSynchronized(g.target.checked));
  });
}
c(kp, "bindDetailPanelEvents");
const Ni = /* @__PURE__ */ new WeakMap(), Na = /* @__PURE__ */ new Set(), Ma = /* @__PURE__ */ new Set(), Pc = {
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
function ka(n, e = {}) {
  var y, p, w;
  if (!n) return !1;
  Mi(n);
  const t = e.mode ?? (e.color != null ? "custom" : "hover"), i = Pc[t] ?? Pc.hover, r = e.color ?? i.borderColor, a = e.alpha ?? i.borderAlpha, o = e.color ?? i.spriteTint, s = i.spriteAlpha, l = e.pulse ?? i.pulse, u = { border: null, sprite: null, pulseData: null, mode: t }, d = ((y = n.document) == null ? void 0 : y.width) ?? n.w ?? 100, m = ((p = n.document) == null ? void 0 : p.height) ?? n.h ?? 100, g = new PIXI.Graphics();
  g.lineStyle(i.borderWidth, r, a), g.drawRect(0, 0, d, m), n.addChild(g), u.border = g;
  const h = $p(n, o, s);
  if (h && (canvas.controls.debug.addChild(h), Ma.add(h), u.sprite = h), l && ((w = canvas.app) != null && w.ticker)) {
    const b = {
      elapsed: 0,
      fn: /* @__PURE__ */ c((E) => {
        b.elapsed += E;
        const L = (Math.sin(b.elapsed * 0.05) + 1) / 2;
        u.border && (u.border.alpha = a * (0.4 + 0.6 * L)), u.sprite && (u.sprite.alpha = s * (0.5 + 0.5 * L));
      }, "fn")
    };
    canvas.app.ticker.add(b.fn), u.pulseData = b, Na.add(b);
  }
  return Ni.set(n, u), !0;
}
c(ka, "addHighlight");
function Mi(n) {
  var t, i;
  if (!n) return;
  const e = Ni.get(n);
  e && (e.pulseData && ((i = (t = canvas.app) == null ? void 0 : t.ticker) == null || i.remove(e.pulseData.fn), Na.delete(e.pulseData)), e.border && (e.border.parent && e.border.parent.removeChild(e.border), e.border.destroy({ children: !0 })), e.sprite && (e.sprite.parent && e.sprite.parent.removeChild(e.sprite), e.sprite.destroy({ children: !0 }), Ma.delete(e.sprite)), Ni.delete(n));
}
c(Mi, "removeHighlight");
function Dd(n) {
  return Ni.has(n);
}
c(Dd, "hasHighlight");
function sa() {
  var e, t, i, r, a, o, s;
  for (const l of Na)
    (t = (e = canvas.app) == null ? void 0 : e.ticker) == null || t.remove(l.fn);
  Na.clear();
  for (const l of Ma)
    l.parent && l.parent.removeChild(l), l.destroy({ children: !0 });
  Ma.clear();
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
        const d = Ni.get(u);
        d && (d.border && (d.border.parent && d.border.parent.removeChild(d.border), d.border.destroy({ children: !0 })), Ni.delete(u));
      }
}
c(sa, "clearAllHighlights");
function $p(n, e, t) {
  var a;
  const i = n.mesh;
  if (!((a = i == null ? void 0 : i.texture) != null && a.baseTexture)) return null;
  const r = PIXI.Sprite.from(i.texture);
  return r.isSprite = !0, r.anchor.set(i.anchor.x, i.anchor.y), r.width = i.width, r.height = i.height, r.scale = i.scale, r.position = n.center, r.angle = i.angle, r.alpha = t, r.tint = e, r.name = "eidolonPickerHighlight", r;
}
c($p, "createTintSprite");
let Fn = null;
function Fd(n) {
  var y, p, w;
  Fn && Fn.cancel();
  const { placeableType: e = "Tile", onPick: t, onCancel: i } = n;
  let r = null;
  const a = `control${e}`, o = `hover${e}`, s = /* @__PURE__ */ c((b, E) => {
    var A;
    if (!E) return;
    const L = b.document ?? b;
    (A = b.release) == null || A.call(b), t(L);
  }, "onControl"), l = /* @__PURE__ */ c((b, E) => {
    E ? (r = b, ka(b, { mode: "pick" })) : r === b && (Mi(b), r = null);
  }, "onHoverIn"), u = /* @__PURE__ */ c((b) => {
    b.key === "Escape" && (b.preventDefault(), b.stopPropagation(), h());
  }, "onKeydown"), d = /* @__PURE__ */ c((b) => {
    b.preventDefault(), h();
  }, "onContextMenu"), m = Hooks.on(a, s), g = Hooks.on(o, l);
  document.addEventListener("keydown", u, { capture: !0 }), (y = canvas.stage) == null || y.addEventListener("rightclick", d), (w = (p = ui.notifications) == null ? void 0 : p.info) == null || w.call(p, `Pick mode active — click a ${e.toLowerCase()} on the canvas, or press ESC to cancel.`, { permanent: !1 });
  function h() {
    var b;
    Fn && (Fn = null, Hooks.off(a, m), Hooks.off(o, g), document.removeEventListener("keydown", u, { capture: !0 }), (b = canvas.stage) == null || b.removeEventListener("rightclick", d), r && (Mi(r), r = null), i == null || i());
  }
  return c(h, "cancel"), Fn = { cancel: h }, { cancel: h };
}
c(Fd, "enterPickMode");
function Vi() {
  Fn && Fn.cancel();
}
c(Vi, "cancelPickMode");
const Dp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cancelPickMode: Vi,
  enterPickMode: Fd
}, Symbol.toStringTag, { value: "Module" }));
var Uc, Ie, He, vr, un, Er, Sr, Ke, dn, ue, Pd, nl, _d, xd, Rd, il, rl, Hd, qd;
const at = class at extends In(Ln) {
  /**
   * @param {object} options
   * @param {string[]} [options.selections]  Initial selections
   * @param {string} [options.placeableType]  "Tile", "Token", etc.
   * @param {(selectors: string[]) => void} [options.onApply]
   * @param {() => void} [options.onCancel]
   */
  constructor(t = {}) {
    super(t);
    I(this, ue);
    /** @type {string[]} Current selections (selector strings). */
    I(this, Ie, []);
    /** @type {boolean} Whether pick mode is active. */
    I(this, He, !1);
    /** @type {string} Placeable type (Tile, Token, etc.). */
    I(this, vr, "Tile");
    /** @type {string} Current tag match mode. */
    I(this, un, "any");
    /** @type {((selectors: string[]) => void) | null} */
    I(this, Er, null);
    /** @type {(() => void) | null} */
    I(this, Sr, null);
    /** @type {Promise resolve function for the open() API. */
    I(this, Ke, null);
    /** @type {PlaceableObject | null} Currently hovered tile in the browser. */
    I(this, dn, null);
    C(this, Ie, [...t.selections ?? []]), C(this, vr, t.placeableType ?? "Tile"), C(this, Er, t.onApply ?? null), C(this, Sr, t.onCancel ?? null);
  }
  // ── Context ───────────────────────────────────────────────────────────
  async _prepareContext() {
    var r;
    const t = S(this, ue, il).call(this), i = (((r = canvas.tiles) == null ? void 0 : r.placeables) ?? []).map((a, o) => {
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
      selections: f(this, Ie),
      selectionCount: f(this, Ie).length,
      pickModeActive: f(this, He),
      tagModeIsAny: f(this, un) === "any",
      tagModeIsAll: f(this, un) === "all",
      tagPreviewCount: 0,
      tiles: i,
      tileCount: i.length
    };
  }
  // ── Render & Events ───────────────────────────────────────────────────
  _onRender(t, i) {
    super._onRender(t, i), S(this, ue, Pd).call(this), S(this, ue, rl).call(this);
  }
  async _onClose(t) {
    return f(this, He) && (Vi(), C(this, He, !1)), sa(), f(this, Ke) && (f(this, Ke).call(this, null), C(this, Ke, null)), super._onClose(t);
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
      const r = new at({
        ...t,
        onApply: /* @__PURE__ */ c((a) => i(a), "onApply"),
        onCancel: /* @__PURE__ */ c(() => i(null), "onCancel")
      });
      C(r, Ke, i), r.render(!0);
    });
  }
};
Ie = new WeakMap(), He = new WeakMap(), vr = new WeakMap(), un = new WeakMap(), Er = new WeakMap(), Sr = new WeakMap(), Ke = new WeakMap(), dn = new WeakMap(), ue = new WeakSet(), Pd = /* @__PURE__ */ c(function() {
  var a, o, s, l;
  const t = this.element;
  if (!(t instanceof HTMLElement)) return;
  const i = t.querySelector("[data-role='tag-input']"), r = t.querySelector("[data-role='tag-mode']");
  r == null || r.addEventListener("change", (u) => {
    C(this, un, u.target.value);
  }), i == null || i.addEventListener("input", () => {
    S(this, ue, _d).call(this, t);
  }), i == null || i.addEventListener("keydown", (u) => {
    u.key === "Enter" && (u.preventDefault(), S(this, ue, nl).call(this, t));
  }), (a = t.querySelector("[data-action='add-tag-selector']")) == null || a.addEventListener("click", () => {
    S(this, ue, nl).call(this, t);
  }), (o = t.querySelector("[data-action='toggle-pick-mode']")) == null || o.addEventListener("click", () => {
    f(this, He) ? (Vi(), C(this, He, !1)) : (C(this, He, !0), Fd({
      placeableType: f(this, vr),
      onPick: /* @__PURE__ */ c((u) => {
        S(this, ue, xd).call(this, u.id);
      }, "onPick"),
      onCancel: /* @__PURE__ */ c(() => {
        C(this, He, !1), this.render({ force: !0 });
      }, "onCancel")
    })), this.render({ force: !0 });
  }), t.querySelectorAll("[data-action='toggle-tile']").forEach((u) => {
    u.addEventListener("click", () => {
      const d = u.dataset.docId;
      d && S(this, ue, Rd).call(this, d);
    }), u.addEventListener("mouseenter", () => {
      var g, h;
      const d = u.dataset.docId;
      if (!d) return;
      const m = (h = (g = canvas.tiles) == null ? void 0 : g.placeables) == null ? void 0 : h.find((y) => y.document.id === d);
      m && (C(this, dn, m), ka(m, { mode: "hover" }));
    }), u.addEventListener("mouseleave", () => {
      f(this, dn) && (Mi(f(this, dn)), C(this, dn, null), S(this, ue, rl).call(this));
    });
  }), t.querySelectorAll("[data-action='remove-selection']").forEach((u) => {
    u.addEventListener("click", () => {
      const d = Number(u.dataset.selectionIndex);
      Number.isNaN(d) || (f(this, Ie).splice(d, 1), this.render({ force: !0 }));
    });
  }), (s = t.querySelector("[data-action='apply']")) == null || s.addEventListener("click", () => {
    S(this, ue, Hd).call(this);
  }), (l = t.querySelector("[data-action='cancel']")) == null || l.addEventListener("click", () => {
    S(this, ue, qd).call(this);
  });
}, "#bindEvents"), // ── Tag helpers ───────────────────────────────────────────────────────
nl = /* @__PURE__ */ c(function(t) {
  var s;
  const i = t.querySelector("[data-role='tag-input']"), r = (s = i == null ? void 0 : i.value) == null ? void 0 : s.trim();
  if (!r) return;
  const a = r.split(",").map((l) => l.trim()).filter(Boolean);
  if (a.length === 0) return;
  const o = Sd(a, f(this, un));
  o && !f(this, Ie).includes(o) && f(this, Ie).push(o), i && (i.value = ""), this.render({ force: !0 });
}, "#addTagSelector"), _d = /* @__PURE__ */ c(function(t) {
  var m, g;
  const i = t.querySelector("[data-role='tag-input']"), r = t.querySelector("[data-role='tag-preview']");
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
  const l = f(this, un) === "any", u = s.getByTag(o, {
    sceneId: (g = canvas.scene) == null ? void 0 : g.id,
    matchAny: l
  }), d = (u == null ? void 0 : u.length) ?? 0;
  r.textContent = `${d} matching placeable(s)`;
}, "#updateTagPreview"), // ── ID selector helpers ──────────────────────────────────────────────
xd = /* @__PURE__ */ c(function(t) {
  const i = `id:${t}`;
  f(this, Ie).includes(i) || (f(this, Ie).push(i), this.render({ force: !0 }));
}, "#addIdSelector"), Rd = /* @__PURE__ */ c(function(t) {
  const i = `id:${t}`, r = f(this, Ie).indexOf(i);
  r >= 0 ? f(this, Ie).splice(r, 1) : f(this, Ie).push(i), this.render({ force: !0 });
}, "#toggleIdSelector"), /**
 * Get the set of document IDs that are currently selected across all selector types.
 * Resolves tag/tags-any/tags-all selectors to find matching document IDs.
 * @returns {Set<string>}
 */
il = /* @__PURE__ */ c(function() {
  const t = /* @__PURE__ */ new Set();
  for (const i of f(this, Ie)) {
    const r = Dl(i);
    if (r.type === "id") {
      t.add(r.value);
      continue;
    }
    const a = Io(i);
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
rl = /* @__PURE__ */ c(function() {
  var r, a;
  const t = S(this, ue, il).call(this), i = ((r = canvas.tiles) == null ? void 0 : r.placeables) ?? [];
  for (const o of i) {
    const s = (a = o.document) == null ? void 0 : a.id;
    if (!s) continue;
    const l = t.has(s), u = o === f(this, dn), d = Dd(o);
    l && !u && !d ? ka(o, { mode: "selected" }) : !l && d && !u && Mi(o);
  }
}, "#refreshSelectionHighlights"), // ── Apply / Cancel ──────────────────────────────────────────────────
Hd = /* @__PURE__ */ c(function() {
  var i;
  f(this, He) && (Vi(), C(this, He, !1)), sa();
  const t = [...f(this, Ie)];
  (i = f(this, Er)) == null || i.call(this, t), f(this, Ke) && (f(this, Ke).call(this, t), C(this, Ke, null)), this.close({ force: !0 });
}, "#doApply"), qd = /* @__PURE__ */ c(function() {
  var t;
  f(this, He) && (Vi(), C(this, He, !1)), sa(), (t = f(this, Sr)) == null || t.call(this), f(this, Ke) && (f(this, Ke).call(this, null), C(this, Ke, null)), this.close({ force: !0 });
}, "#doCancel"), c(at, "PlaceablePickerApplication"), pe(at, "APP_ID", `${T}-placeable-picker`), pe(at, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  De(at, at, "DEFAULT_OPTIONS"),
  {
    id: at.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Uc = De(at, at, "DEFAULT_OPTIONS")) == null ? void 0 : Uc.classes) ?? [], "eidolon-placeable-picker-window", "themed"])
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
)), pe(at, "PARTS", {
  content: {
    template: `modules/${T}/templates/placeable-picker.html`
  }
});
let $a = at;
function Fp(n, e) {
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
      const a = e.getEntryAtPath(e.selectedPath), o = ((d = (u = a == null ? void 0 : a.tweens) == null ? void 0 : u[i]) == null ? void 0 : d.target) ?? "", s = o ? [o] : [], l = await $a.open({ selections: s });
      if (l && l.length > 0) {
        if (r.type === "timeline")
          e.mutate((m) => m.updateTween(r.index, i, { target: l[0] }));
        else if (r.type === "branch") {
          const m = (a.tweens ?? []).map((g, h) => h === i ? { ...g, target: l[0] } : g);
          e.mutate((g) => g.updateBranchEntry(r.index, r.branchIndex, r.branchEntryIndex, { tweens: m }));
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
          const l = Ad[s], u = { type: s };
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
c(Fp, "bindTweenFieldEvents");
function Pp(n, e) {
  var i, r, a, o, s, l, u, d, m, g;
  function t(h, y, p) {
    h.type === "timeline" ? e.mutate((w) => w.updateEntry(h.index, { sound: p })) : h.type === "branch" && e.mutate((w) => w.updateBranchEntry(h.index, h.branchIndex, h.branchEntryIndex, { sound: p }));
  }
  c(t, "applySoundPatch"), (i = n.querySelector("[data-action='change-sound-src']")) == null || i.addEventListener("change", async (h) => {
    const y = e.parseEntryPath(e.selectedPath);
    if (!y) return;
    const p = e.getEntryAtPath(e.selectedPath);
    if (!(p != null && p.sound)) return;
    const w = h.target.value, b = { ...p.sound, src: w };
    b.id || (b.id = Oc(w));
    const E = await Ac(w);
    E > 0 && (b.duration = E), t(y, p, b);
  }), (r = n.querySelector("[data-action='pick-sound-src']")) == null || r.addEventListener("click", () => {
    const h = e.parseEntryPath(e.selectedPath);
    if (!h) return;
    const y = e.getEntryAtPath(e.selectedPath);
    if (!(y != null && y.sound)) return;
    new FilePicker({
      type: "audio",
      current: y.sound.src || "",
      callback: /* @__PURE__ */ c(async (w) => {
        const b = { ...y.sound, src: w };
        b.id || (b.id = Oc(w));
        const E = await Ac(w);
        E > 0 && (b.duration = E), t(h, y, b);
      }, "callback")
    }).render(!0);
  }), (a = n.querySelector("[data-action='change-sound-id']")) == null || a.addEventListener("change", (h) => {
    const y = e.parseEntryPath(e.selectedPath);
    if (!y) return;
    const p = e.getEntryAtPath(e.selectedPath);
    p != null && p.sound && t(y, p, { ...p.sound, id: h.target.value || void 0 });
  }), (o = n.querySelector("[data-action='change-sound-volume']")) == null || o.addEventListener("input", (h) => {
    const y = e.parseEntryPath(e.selectedPath);
    if (!y) return;
    const p = e.getEntryAtPath(e.selectedPath);
    p != null && p.sound && t(y, p, { ...p.sound, volume: Number(h.target.value) || 0.8 });
  }), (s = n.querySelector("[data-action='change-sound-loop']")) == null || s.addEventListener("change", (h) => {
    const y = e.parseEntryPath(e.selectedPath);
    if (!y) return;
    const p = e.getEntryAtPath(e.selectedPath);
    p != null && p.sound && t(y, p, { ...p.sound, loop: h.target.checked });
  }), (l = n.querySelector("[data-action='change-sound-fadein']")) == null || l.addEventListener("change", (h) => {
    const y = e.parseEntryPath(e.selectedPath);
    if (!y) return;
    const p = e.getEntryAtPath(e.selectedPath);
    p != null && p.sound && t(y, p, { ...p.sound, fadeIn: Number(h.target.value) || void 0 });
  }), (u = n.querySelector("[data-action='change-sound-fadeout']")) == null || u.addEventListener("change", (h) => {
    const y = e.parseEntryPath(e.selectedPath);
    if (!y) return;
    const p = e.getEntryAtPath(e.selectedPath);
    p != null && p.sound && t(y, p, { ...p.sound, fadeOut: Number(h.target.value) || void 0 });
  }), (d = n.querySelector("[data-action='change-sound-duration']")) == null || d.addEventListener("change", (h) => {
    const y = e.parseEntryPath(e.selectedPath);
    if (!y) return;
    const p = e.getEntryAtPath(e.selectedPath);
    p != null && p.sound && t(y, p, { ...p.sound, duration: Number(h.target.value) || 0 });
  }), (m = n.querySelector("[data-action='change-sound-fireandforget']")) == null || m.addEventListener("change", (h) => {
    const y = e.parseEntryPath(e.selectedPath);
    if (!y) return;
    const p = e.getEntryAtPath(e.selectedPath);
    p != null && p.sound && t(y, p, { ...p.sound, fireAndForget: h.target.checked });
  }), (g = n.querySelector("[data-action='change-stopsound-id']")) == null || g.addEventListener("change", (h) => {
    const y = e.parseEntryPath(e.selectedPath);
    y && (y.type === "timeline" ? e.mutate((p) => p.updateEntry(y.index, { stopSound: h.target.value })) : y.type === "branch" && e.mutate((p) => p.updateBranchEntry(y.index, y.branchIndex, y.branchEntryIndex, { stopSound: h.target.value })));
  });
}
c(Pp, "bindSoundFieldEvents");
function _p(n, e) {
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
    Op({ selectedPath: e.selectedPath, state: e.state, mutate: e.mutate });
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
c(_p, "bindSpecialEntryEvents");
function xp(n, e) {
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
c(xp, "bindSegmentGraphEvents");
function Rp(n, e) {
  var t, i, r, a, o, s, l;
  (t = n.querySelector("[data-action='change-gate-event']")) == null || t.addEventListener("change", (u) => {
    var m;
    const d = u.target.value;
    if (!d)
      e.setSegmentGate(null);
    else {
      const g = ((m = e.state.activeSegment) == null ? void 0 : m.gate) ?? {};
      e.setSegmentGate({ ...g, event: d });
    }
  }), (i = n.querySelector("[data-action='change-gate-target']")) == null || i.addEventListener("change", (u) => {
    var m;
    const d = (m = e.state.activeSegment) == null ? void 0 : m.gate;
    d && e.setSegmentGate({ ...d, target: u.target.value || void 0 });
  }), (r = n.querySelector("[data-action='pick-gate-target']")) == null || r.addEventListener("click", async () => {
    var m;
    const u = (m = e.state.activeSegment) == null ? void 0 : m.gate;
    if (!u) return;
    const { enterPickMode: d } = await Promise.resolve().then(() => Dp);
    d({
      placeableType: "Tile",
      onPick: /* @__PURE__ */ c((g) => {
        var p, w;
        const h = (w = (p = g.flags) == null ? void 0 : p.tagger) == null ? void 0 : w.tags, y = h != null && h.length ? `tag:${h[0]}` : `id:${g.id}`;
        e.setSegmentGate({ ...u, target: y });
      }, "onPick")
    });
  });
  for (const [u, d] of [["change-gate-anim-idle", "idle"], ["change-gate-anim-hover", "hover"], ["change-gate-anim-dim", "dim"]])
    (a = n.querySelector(`[data-action='${u}']`)) == null || a.addEventListener("change", (m) => {
      var b;
      const g = (b = e.state.activeSegment) == null ? void 0 : b.gate;
      if (!g) return;
      const h = m.target.value.trim(), y = h ? h.split(",").map((E) => E.trim()).filter(Boolean) : void 0, p = { ...g.animation ?? {} };
      y != null && y.length ? p[d] = y.length === 1 ? y[0] : y : delete p[d];
      const w = { ...g, animation: Object.keys(p).length ? p : void 0 };
      w.animation || delete w.animation, e.setSegmentGate(w);
    });
  (o = n.querySelector("[data-action='change-segment-next']")) == null || o.addEventListener("change", (u) => {
    const d = u.target.value;
    e.setSegmentNext(d || null);
  }), (s = n.querySelector("[data-action='edit-segment-setup']")) == null || s.addEventListener("click", () => {
    Aa("setup", { state: e.state, mutate: e.mutate });
  }), (l = n.querySelector("[data-action='edit-segment-landing']")) == null || l.addEventListener("click", () => {
    Aa("landing", { state: e.state, mutate: e.mutate });
  });
}
c(Rp, "bindSegmentDetailEvents");
var Vc, qe, B, Ye, fn, wt, Qe, je, co, Me, Xe, uo, Ut, Li, lt, Wn, mn, Jn, x, jd, Bd, Ud, Vd, en, ol, sl, ll, cl, zd, tn, ul, Gd, Wd, Jd, Kd, Yd, dl, zi;
const ht = class ht extends In(Ln) {
  constructor(t = {}) {
    super(t);
    I(this, x);
    I(this, qe, null);
    I(this, B, null);
    I(this, Ye, null);
    I(this, fn, /* @__PURE__ */ new Set());
    I(this, wt, !1);
    I(this, Qe, null);
    I(this, je, null);
    I(this, co, 120);
    I(this, Me, []);
    I(this, Xe, -1);
    I(this, uo, 50);
    I(this, Ut, null);
    I(this, Li, null);
    I(this, lt, null);
    I(this, Wn, null);
    I(this, mn, null);
    I(this, Jn, null);
    C(this, qe, t.scene ?? canvas.scene ?? null), C(this, B, zt.fromScene(f(this, qe)));
  }
  // ── Context ───────────────────────────────────────────────────────────
  async _prepareContext() {
    var h, y;
    const t = mp(f(this, B), f(this, B).activeSegmentName), i = dp(f(this, B).timeline, {
      selectedPath: f(this, Ye),
      windowWidth: ((h = this.position) == null ? void 0 : h.width) ?? 1100
    }), r = f(this, Ye) != null ? Lp(f(this, Ye), { state: f(this, B), expandedTweens: f(this, fn) }) : null, a = f(this, B).listCinematicNames(), o = f(this, B).activeCinematicName, l = f(this, B).listSegmentNames().length > 1, u = f(this, B).activeSegment, d = (u == null ? void 0 : u.gate) ?? null, m = (u == null ? void 0 : u.next) ?? null, g = typeof m == "string" ? m : (m == null ? void 0 : m.segment) ?? null;
    return {
      // Toolbar
      sceneName: ((y = f(this, qe)) == null ? void 0 : y.name) ?? "No scene",
      dirty: f(this, wt),
      canUndo: f(this, x, ol),
      canRedo: f(this, x, sl),
      // Cinematic selector
      cinematicNames: a,
      activeCinematicName: o,
      cinematicOptions: a.map((p) => ({
        value: p,
        label: p,
        selected: p === o
      })),
      hasMultipleCinematics: a.length > 1,
      // Segment graph
      segmentGraph: t,
      activeSegmentName: f(this, B).activeSegmentName,
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
      activeSegmentNext: g,
      activeSegmentSetupCount: Object.keys((u == null ? void 0 : u.setup) ?? {}).length,
      activeSegmentLandingCount: Object.keys((u == null ? void 0 : u.landing) ?? {}).length,
      // Footer
      trigger: f(this, B).trigger,
      tracking: f(this, B).tracking,
      synchronized: f(this, B).synchronized,
      triggerOptions: ip.map((p) => ({
        ...p,
        selected: p.value === f(this, B).trigger
      })),
      entryCount: f(this, B).timeline.length,
      totalDuration: i.totalDurationMs,
      targetCount: gp(f(this, B)),
      setupCount: Object.keys(f(this, B).setup ?? {}).length,
      landingCount: Object.keys(f(this, B).landing ?? {}).length
    };
  }
  // ── Render & Events ───────────────────────────────────────────────────
  _onRender(t, i) {
    var r, a, o;
    if (super._onRender(t, i), S(this, x, jd).call(this), !f(this, Wn)) {
      const s = (a = (r = game.modules.get(T)) == null ? void 0 : r.api) == null ? void 0 : a.cinematic;
      s != null && s.onPlaybackProgress ? (C(this, Wn, s.onPlaybackProgress((l) => S(this, x, Yd).call(this, l))), console.log("[cinematic-editor] Subscribed to playback progress events")) : console.warn("[cinematic-editor] onPlaybackProgress not available on API", s);
    }
    if (f(this, Jn) && ((o = this.element) == null || o.querySelectorAll(".cinematic-editor__segment-node").forEach((s) => {
      s.classList.toggle("cinematic-editor__segment-node--playing", s.dataset.segmentName === f(this, Jn));
    }), f(this, lt) && f(this, lt).segmentName === f(this, B).activeSegmentName)) {
      const s = performance.now() - f(this, lt).startTime;
      f(this, lt).durationMs - s > 0 && S(this, x, dl).call(this, f(this, lt).durationMs, f(this, lt).startTime);
    }
    f(this, Ut) || (C(this, Ut, (s) => {
      !s.ctrlKey && !s.metaKey || (s.key === "z" && !s.shiftKey ? (s.preventDefault(), S(this, x, ll).call(this)) : (s.key === "z" && s.shiftKey || s.key === "y") && (s.preventDefault(), S(this, x, cl).call(this)));
    }), document.addEventListener("keydown", f(this, Ut)));
  }
  async close(t = {}) {
    if (f(this, je) && S(this, x, tn).call(this), f(this, wt) && !t.force) {
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
      i === "save" && await S(this, x, ul).call(this);
    }
    return super.close(t);
  }
  async _onClose(t) {
    var i;
    return f(this, Qe) !== null && (clearTimeout(f(this, Qe)), C(this, Qe, null)), f(this, Ut) && (document.removeEventListener("keydown", f(this, Ut)), C(this, Ut, null)), (i = f(this, Wn)) == null || i.call(this), C(this, Wn, null), S(this, x, zi).call(this), super._onClose(t);
  }
};
qe = new WeakMap(), B = new WeakMap(), Ye = new WeakMap(), fn = new WeakMap(), wt = new WeakMap(), Qe = new WeakMap(), je = new WeakMap(), co = new WeakMap(), Me = new WeakMap(), Xe = new WeakMap(), uo = new WeakMap(), Ut = new WeakMap(), Li = new WeakMap(), lt = new WeakMap(), Wn = new WeakMap(), mn = new WeakMap(), Jn = new WeakMap(), x = new WeakSet(), // ── Event binding ─────────────────────────────────────────────────────
jd = /* @__PURE__ */ c(function() {
  const t = this.element;
  if (!(t instanceof HTMLElement)) return;
  const i = S(this, x, Bd).call(this);
  Ap(t, i), Np(t, i), xp(t, i), Mp(t, i), kp(t, i), Fp(t, i), Pp(t, i), _p(t, i), Rp(t, i);
}, "#bindEvents"), Bd = /* @__PURE__ */ c(function() {
  const t = this;
  return {
    // State access (read-only getters — closures over `self` for private field access)
    get state() {
      return f(t, B);
    },
    get selectedPath() {
      return f(t, Ye);
    },
    get scene() {
      return f(t, qe);
    },
    get expandedTweens() {
      return f(t, fn);
    },
    get insertMenuState() {
      return f(t, Li);
    },
    // Mutations
    mutate: /* @__PURE__ */ c((i) => S(this, x, en).call(this, i), "mutate"),
    setSelectedPath: /* @__PURE__ */ c((i) => {
      C(this, Ye, i), this.render({ force: !0 });
    }, "setSelectedPath"),
    render: /* @__PURE__ */ c(() => this.render({ force: !0 }), "render"),
    // Cinematic switching (needs full state swap + clear)
    switchCinematic: /* @__PURE__ */ c((i) => {
      f(this, je) && S(this, x, tn).call(this), C(this, B, f(this, B).switchCinematic(i)), C(this, Ye, null), f(this, fn).clear(), this.render({ force: !0 });
    }, "switchCinematic"),
    // Segment management
    selectSegment: /* @__PURE__ */ c((i) => {
      f(this, je) && S(this, x, tn).call(this), C(this, B, f(this, B).switchSegment(i)), C(this, Ye, null), f(this, fn).clear(), this.render({ force: !0 });
    }, "selectSegment"),
    addSegment: /* @__PURE__ */ c((i) => {
      S(this, x, en).call(this, (r) => r.addSegment(i, r.activeSegmentName));
    }, "addSegment"),
    removeSegment: /* @__PURE__ */ c((i) => {
      S(this, x, en).call(this, (r) => r.removeSegment(i));
    }, "removeSegment"),
    renameSegment: /* @__PURE__ */ c((i, r) => {
      S(this, x, en).call(this, (a) => a.renameSegment(i, r));
    }, "renameSegment"),
    setSegmentGate: /* @__PURE__ */ c((i) => {
      S(this, x, en).call(this, (r) => r.setSegmentGate(i));
    }, "setSegmentGate"),
    setSegmentNext: /* @__PURE__ */ c((i) => {
      S(this, x, en).call(this, (r) => r.setSegmentNext(i));
    }, "setSegmentNext"),
    // Tween debouncing
    queueTweenChange: /* @__PURE__ */ c((i, r) => S(this, x, zd).call(this, i, r), "queueTweenChange"),
    flushTweenChanges: /* @__PURE__ */ c(() => {
      f(this, je) && S(this, x, tn).call(this);
    }, "flushTweenChanges"),
    flushTweenChangesImmediate: /* @__PURE__ */ c(() => {
      f(this, Qe) !== null && clearTimeout(f(this, Qe)), C(this, Qe, null), S(this, x, tn).call(this);
    }, "flushTweenChangesImmediate"),
    // Path utilities
    parseEntryPath: Sn,
    getEntryAtPath: /* @__PURE__ */ c((i) => Oa(i, f(this, B)), "getEntryAtPath"),
    // Insert menu
    showInsertMenu: /* @__PURE__ */ c((i, r, a) => S(this, x, Ud).call(this, i, r, a), "showInsertMenu"),
    hideInsertMenu: /* @__PURE__ */ c(() => S(this, x, Vd).call(this), "hideInsertMenu"),
    // Toolbar actions
    save: /* @__PURE__ */ c(() => S(this, x, ul).call(this), "save"),
    play: /* @__PURE__ */ c(() => S(this, x, Gd).call(this), "play"),
    resetTracking: /* @__PURE__ */ c(() => S(this, x, Wd).call(this), "resetTracking"),
    exportJSON: /* @__PURE__ */ c(() => S(this, x, Jd).call(this), "exportJSON"),
    validate: /* @__PURE__ */ c(() => S(this, x, Kd).call(this), "validate"),
    importJSON: /* @__PURE__ */ c(() => Ip({ state: f(this, B), mutate: /* @__PURE__ */ c((i) => S(this, x, en).call(this, i), "mutate") }), "importJSON"),
    undo: /* @__PURE__ */ c(() => S(this, x, ll).call(this), "undo"),
    redo: /* @__PURE__ */ c(() => S(this, x, cl).call(this), "redo")
  };
}, "#createEventContext"), // ── Insert menu ───────────────────────────────────────────────────────
Ud = /* @__PURE__ */ c(function(t, i, r) {
  var l;
  const a = (l = this.element) == null ? void 0 : l.querySelector(".cinematic-editor__insert-menu");
  if (!a) return;
  const o = t.getBoundingClientRect();
  document.body.appendChild(a), a.style.display = "", a.style.position = "fixed", a.style.left = `${o.left}px`;
  const s = a.offsetHeight || 200;
  o.bottom + 4 + s > window.innerHeight ? a.style.top = `${o.top - s - 4}px` : a.style.top = `${o.bottom + 4}px`, C(this, Li, { insertIndex: i, lane: r });
}, "#showInsertMenu"), Vd = /* @__PURE__ */ c(function() {
  var i, r;
  const t = document.body.querySelector(".cinematic-editor__insert-menu") ?? ((i = this.element) == null ? void 0 : i.querySelector(".cinematic-editor__insert-menu"));
  if (t) {
    t.style.display = "none";
    const a = (r = this.element) == null ? void 0 : r.querySelector(".cinematic-editor");
    a && t.parentNode !== a && a.appendChild(t);
  }
  C(this, Li, null);
}, "#hideInsertMenu"), // ── State mutation ────────────────────────────────────────────────────
en = /* @__PURE__ */ c(function(t) {
  C(this, Me, f(this, Me).slice(0, f(this, Xe) + 1)), f(this, Me).push(f(this, B)), f(this, Me).length > f(this, uo) && f(this, Me).shift(), C(this, Xe, f(this, Me).length - 1), C(this, B, t(f(this, B))), C(this, wt, !0), this.render({ force: !0 });
}, "#mutate"), ol = /* @__PURE__ */ c(function() {
  return f(this, Xe) >= 0;
}, "#canUndo"), sl = /* @__PURE__ */ c(function() {
  return f(this, Xe) < f(this, Me).length - 1;
}, "#canRedo"), ll = /* @__PURE__ */ c(function() {
  f(this, x, ol) && (f(this, Xe) === f(this, Me).length - 1 && f(this, Me).push(f(this, B)), C(this, B, f(this, Me)[f(this, Xe)]), ko(this, Xe)._--, C(this, wt, !0), this.render({ force: !0 }));
}, "#undo"), cl = /* @__PURE__ */ c(function() {
  f(this, x, sl) && (ko(this, Xe)._++, C(this, B, f(this, Me)[f(this, Xe) + 1]), C(this, wt, !0), this.render({ force: !0 }));
}, "#redo"), zd = /* @__PURE__ */ c(function(t, i) {
  var r;
  f(this, Ye) != null && (C(this, je, {
    ...f(this, je) ?? {},
    entryPath: f(this, Ye),
    tweenIndex: t,
    patch: { ...((r = f(this, je)) == null ? void 0 : r.patch) ?? {}, ...i }
  }), f(this, Qe) !== null && clearTimeout(f(this, Qe)), C(this, Qe, setTimeout(() => {
    C(this, Qe, null), S(this, x, tn).call(this);
  }, f(this, co))));
}, "#queueTweenChange"), tn = /* @__PURE__ */ c(function() {
  if (!f(this, je)) return;
  const { entryPath: t, tweenIndex: i, patch: r } = f(this, je);
  C(this, je, null);
  const a = Sn(t);
  if (a) {
    if (a.type === "timeline")
      C(this, B, f(this, B).updateTween(a.index, i, r));
    else if (a.type === "branch") {
      const o = Oa(t, f(this, B));
      if (o) {
        const s = (o.tweens ?? []).map((l, u) => u === i ? { ...l, ...r } : l);
        C(this, B, f(this, B).updateBranchEntry(a.index, a.branchIndex, a.branchEntryIndex, { tweens: s }));
      }
    }
    C(this, wt, !0);
  }
}, "#flushTweenChanges"), ul = /* @__PURE__ */ c(async function() {
  var t, i, r, a, o, s;
  if (f(this, qe)) {
    if (f(this, je) && S(this, x, tn).call(this), f(this, B).isStale(f(this, qe))) {
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
        C(this, B, zt.fromScene(f(this, qe), f(this, B).activeCinematicName)), C(this, wt, !1), C(this, Me, []), C(this, Xe, -1), this.render({ force: !0 }), (i = (t = ui.notifications) == null ? void 0 : t.info) == null || i.call(t, "Cinematic reloaded from scene.");
        return;
      }
      if (!l) return;
    }
    try {
      await f(this, B).save(f(this, qe)), C(this, B, zt.fromScene(f(this, qe), f(this, B).activeCinematicName)), C(this, wt, !1), (a = (r = ui.notifications) == null ? void 0 : r.info) == null || a.call(r, "Cinematic saved."), this.render({ force: !0 });
    } catch (l) {
      console.error(`${T} | Cinematic save failed`, l), (s = (o = ui.notifications) == null ? void 0 : o.error) == null || s.call(o, "Failed to save cinematic data.");
    }
  }
}, "#onSave"), Gd = /* @__PURE__ */ c(async function() {
  var i, r, a, o, s;
  const t = (r = (i = game.modules.get(T)) == null ? void 0 : i.api) == null ? void 0 : r.cinematic;
  if (!(t != null && t.play)) {
    (o = (a = ui.notifications) == null ? void 0 : a.warn) == null || o.call(a, "Cinematic API not available.");
    return;
  }
  await t.play((s = f(this, qe)) == null ? void 0 : s.id, f(this, B).activeCinematicName);
}, "#onPlay"), Wd = /* @__PURE__ */ c(async function() {
  var i, r, a, o, s;
  const t = (r = (i = game.modules.get(T)) == null ? void 0 : i.api) == null ? void 0 : r.cinematic;
  t != null && t.reset && (await t.reset((a = f(this, qe)) == null ? void 0 : a.id, f(this, B).activeCinematicName), (s = (o = ui.notifications) == null ? void 0 : o.info) == null || s.call(o, "Cinematic tracking reset."));
}, "#onResetTracking"), Jd = /* @__PURE__ */ c(async function() {
  var i, r;
  const t = JSON.stringify(f(this, B).toJSON(), null, 2);
  try {
    await navigator.clipboard.writeText(t), (r = (i = ui.notifications) == null ? void 0 : i.info) == null || r.call(i, "Cinematic JSON copied to clipboard.");
  } catch {
    new Dialog({
      title: "Cinematic JSON",
      content: `<textarea style="width:100%;height:300px;font-family:monospace;font-size:0.8rem">${vt(t)}</textarea>`,
      buttons: { ok: { label: "Close" } }
    }).render(!0);
  }
}, "#onExportJSON"), Kd = /* @__PURE__ */ c(function() {
  var l, u;
  const t = f(this, B).toJSON(), { targets: i, unresolved: r } = Ia(t), a = np(t, i), o = [
    ...r.map((d) => ({ path: "targets", level: "warn", message: `Unresolved target: "${d}"` })),
    ...a
  ];
  if (o.length === 0) {
    (u = (l = ui.notifications) == null ? void 0 : l.info) == null || u.call(l, "Cinematic validation passed — no issues found.");
    return;
  }
  const s = o.map((d) => {
    const m = d.level === "error" ? "fa-circle-xmark" : "fa-triangle-exclamation", g = d.level === "error" ? "#e74c3c" : "#f39c12";
    return `<li style="margin:0.3rem 0"><i class="fa-solid ${m}" style="color:${g};margin-right:0.3rem"></i><strong>${vt(d.path)}</strong>: ${vt(d.message)}</li>`;
  });
  new Dialog({
    title: "Cinematic Validation",
    content: `<p>${o.length} issue(s) found:</p><ul style="list-style:none;padding:0;max-height:300px;overflow:auto">${s.join("")}</ul>`,
    buttons: { ok: { label: "Close" } }
  }).render(!0);
}, "#onValidate"), // ── Playback progress ────────────────────────────────────────────────
Yd = /* @__PURE__ */ c(function(t) {
  var i, r, a, o, s, l;
  switch (console.log(`[cinematic-editor] playback event: ${t.type}`, t), t.type) {
    case "segment-start":
      C(this, Jn, t.segmentName), t.segmentName !== f(this, B).activeSegmentName ? (C(this, B, f(this, B).switchSegment(t.segmentName)), C(this, Ye, null), f(this, fn).clear(), this.render({ force: !0 })) : (i = this.element) == null || i.querySelectorAll(".cinematic-editor__segment-node").forEach((u) => {
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
      C(this, lt, { segmentName: t.segmentName, startTime: performance.now(), durationMs: t.durationMs }), t.segmentName === f(this, B).activeSegmentName && S(this, x, dl).call(this, t.durationMs);
      break;
    case "timeline-end":
      S(this, x, zi).call(this), C(this, lt, null);
      break;
    case "playback-end":
      S(this, x, zi).call(this), C(this, lt, null), C(this, Jn, null), (l = this.element) == null || l.querySelectorAll(".cinematic-editor__segment-node--playing, .cinematic-editor__segment-node--gate-waiting").forEach((u) => {
        u.classList.remove("cinematic-editor__segment-node--playing", "cinematic-editor__segment-node--gate-waiting");
      });
      break;
  }
}, "#onPlaybackEvent"), dl = /* @__PURE__ */ c(function(t, i = null) {
  var u, d;
  S(this, x, zi).call(this);
  const r = (u = this.element) == null ? void 0 : u.querySelector(".cinematic-editor__playback-cursor"), a = (d = this.element) == null ? void 0 : d.querySelector(".cinematic-editor__swimlane");
  if (console.log(`[cinematic-editor] startCursor: duration=${t}, cursor=${!!r}, swimlane=${!!a}, width=${a == null ? void 0 : a.scrollWidth}`), !r || !a || t <= 0) return;
  r.style.display = "block";
  const o = i ?? performance.now(), s = a.scrollWidth, l = /* @__PURE__ */ c(() => {
    const m = performance.now() - o, g = Math.min(m / t, 1), h = nr + g * (s - nr);
    r.style.left = `${h}px`, g < 1 && C(this, mn, requestAnimationFrame(l));
  }, "tick");
  C(this, mn, requestAnimationFrame(l));
}, "#startCursorAnimation"), zi = /* @__PURE__ */ c(function() {
  var i;
  f(this, mn) && (cancelAnimationFrame(f(this, mn)), C(this, mn, null));
  const t = (i = this.element) == null ? void 0 : i.querySelector(".cinematic-editor__playback-cursor");
  t && (t.style.display = "none");
}, "#stopCursorAnimation"), c(ht, "CinematicEditorApplication"), pe(ht, "APP_ID", `${T}-cinematic-editor`), pe(ht, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  De(ht, ht, "DEFAULT_OPTIONS"),
  {
    id: ht.APP_ID,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Vc = De(ht, ht, "DEFAULT_OPTIONS")) == null ? void 0 : Vc.classes) ?? [], "eidolon-cinematic-editor-window", "themed"])
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
)), pe(ht, "PARTS", {
  content: {
    template: `modules/${T}/templates/cinematic-editor.html`
  }
});
let al = ht;
const Qd = /* @__PURE__ */ new Map();
function Di(n, e) {
  Qd.set(n, e);
}
c(Di, "registerBehaviour");
function Xd(n) {
  return Qd.get(n);
}
c(Xd, "getBehaviour");
Di("float", (n, e = {}) => {
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
Di("pulse", (n, e = {}) => {
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
Di("scale", (n, e = {}) => {
  const t = n.mesh;
  if (!t) return { update() {
  }, detach() {
  } };
  const i = e.factor ?? 1.12, r = e.durationFrames ?? 15, a = Mr(e.easing ?? "easeOutCubic"), o = t.scale.x, s = t.scale.y, l = o * i, u = s * i;
  let d = 0;
  return {
    update(m) {
      if (d < r) {
        d += m;
        const g = Math.min(d / r, 1), h = a(g);
        t.scale.x = o + (l - o) * h, t.scale.y = s + (u - s) * h;
      }
    },
    detach() {
      t.scale.x = o, t.scale.y = s;
    }
  };
});
Di("glow", (n, e = {}) => {
  var g, h;
  const t = n.mesh;
  if (!((g = t == null ? void 0 : t.texture) != null && g.baseTexture)) return { update() {
  }, detach() {
  } };
  const i = e.color ?? 4513279, r = e.alpha ?? 0.5, a = e.blur ?? 8, o = e.pulseSpeed ?? 0.03, s = PIXI.Sprite.from(t.texture);
  s.anchor.set(t.anchor.x, t.anchor.y), s.width = t.width, s.height = t.height, s.position.copyFrom(t.position), s.angle = t.angle, s.alpha = r, s.tint = i;
  const l = PIXI.BlurFilter ?? ((h = PIXI.filters) == null ? void 0 : h.BlurFilter), u = new l(a);
  s.filters = [u];
  const d = n.children.indexOf(t);
  d > 0 ? n.addChildAt(s, d) : n.addChildAt(s, 0);
  let m = 0;
  return {
    update(y) {
      m += y;
      const p = (Math.sin(m * o) + 1) / 2;
      s.alpha = r * (0.5 + 0.5 * p);
    },
    detach() {
      s.parent && s.parent.removeChild(s), s.destroy({ children: !0 });
    }
  };
});
Di("none", () => ({ update() {
}, detach() {
} }));
const Vr = {
  idle: ["float", "glow"],
  hover: ["scale"],
  dim: ["none"]
};
function Hp(n) {
  if (!n) return { ...Vr };
  const e = /* @__PURE__ */ c((t, i) => t === void 0 ? i : typeof t == "string" ? [t] : typeof t == "object" && !Array.isArray(t) && t.name ? [t] : Array.isArray(t) ? t : i, "normalize");
  return {
    idle: e(n.idle, Vr.idle),
    hover: e(n.hover, Vr.hover),
    dim: e(n.dim, Vr.dim)
  };
}
c(Hp, "normalizeConfig");
var Tr, Ii, Oi, Kn, gn, Cn, fl, ml;
const jl = class jl {
  /**
   * @param {PlaceableObject} placeable
   * @param {object|undefined} animationConfig  Raw animation config from the await entry
   */
  constructor(e, t) {
    I(this, Cn);
    I(this, Tr);
    I(this, Ii);
    I(this, Oi, null);
    I(this, Kn, []);
    I(this, gn, null);
    C(this, Tr, e), C(this, Ii, Hp(t));
  }
  /** Current animation state name. */
  get state() {
    return f(this, Oi);
  }
  /**
   * Start animating in the given state.
   * @param {string} [state="idle"]
   */
  start(e = "idle") {
    S(this, Cn, fl).call(this, e), C(this, gn, (t) => {
      for (const i of f(this, Kn)) i.update(t);
    }), canvas.app.ticker.add(f(this, gn));
  }
  /**
   * Transition to a new state. Detaches current behaviours, attaches new ones.
   * No-op if already in the requested state.
   * @param {string} state
   */
  setState(e) {
    e !== f(this, Oi) && (S(this, Cn, ml).call(this), S(this, Cn, fl).call(this, e));
  }
  /**
   * Full cleanup — detach all behaviours and remove ticker.
   */
  detach() {
    var e, t;
    S(this, Cn, ml).call(this), f(this, gn) && ((t = (e = canvas.app) == null ? void 0 : e.ticker) == null || t.remove(f(this, gn)), C(this, gn, null));
  }
};
Tr = new WeakMap(), Ii = new WeakMap(), Oi = new WeakMap(), Kn = new WeakMap(), gn = new WeakMap(), Cn = new WeakSet(), // ── Private ──────────────────────────────────────────────────────────
fl = /* @__PURE__ */ c(function(e) {
  C(this, Oi, e);
  const t = f(this, Ii)[e] ?? f(this, Ii).idle ?? ["none"];
  for (const i of t) {
    const r = typeof i == "string" ? i : i.name, a = typeof i == "string" ? void 0 : i, o = Xd(r);
    if (!o) {
      console.warn(`TileAnimator: unknown behaviour "${r}"`);
      continue;
    }
    f(this, Kn).push(o(f(this, Tr), a));
  }
}, "#attachBehaviours"), ml = /* @__PURE__ */ c(function() {
  for (const e of f(this, Kn)) e.detach();
  C(this, Kn, []);
}, "#detachBehaviours"), c(jl, "TileAnimator");
let ir = jl;
const qp = "cinematic", Ko = 4, gl = /* @__PURE__ */ new Set();
function Pt(n) {
  for (const e of gl)
    try {
      e(n);
    } catch (t) {
      console.error("[cinematic] playback listener error:", t);
    }
}
c(Pt, "emitPlaybackEvent");
function jp(n) {
  return gl.add(n), () => gl.delete(n);
}
c(jp, "onPlaybackProgress");
let we = null, qt = null, Ki = null, Yi = null, li = 0, Pn = null;
function Pl(n, e = "default") {
  return `cinematic-progress-${n}-${e}`;
}
c(Pl, "progressFlagKey");
function Bp(n, e, t, i) {
  game.user.setFlag(T, Pl(n, e), {
    currentSegment: t,
    completedSegments: [...i],
    timestamp: Date.now()
  }).catch(() => {
  });
}
c(Bp, "saveSegmentProgress");
function hl(n, e = "default") {
  game.user.unsetFlag(T, Pl(n, e)).catch(() => {
  });
}
c(hl, "clearProgress");
function Zd(n, e = "default", t = 3e5) {
  const i = game.user.getFlag(T, Pl(n, e));
  return !i || typeof i.timestamp != "number" || Date.now() - i.timestamp > t ? null : i.currentSegment ? i : null;
}
c(Zd, "getSavedProgress");
function ri(n, e = "default") {
  return `cinematic-seen-${n}-${e}`;
}
c(ri, "seenFlagKey");
function _c(n, e = "default") {
  return !!game.user.getFlag(T, ri(n, e));
}
c(_c, "hasSeenCinematic");
function Up(n, e) {
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
c(Up, "validateSingleCinematic");
function Ao(n) {
  const e = n ? game.scenes.get(n) : canvas.scene;
  let t = (e == null ? void 0 : e.getFlag(T, qp)) ?? null;
  if (t == null) return null;
  if (typeof t != "object" || Array.isArray(t))
    return console.warn(`[${T}] Cinematic: invalid flag data on scene ${e == null ? void 0 : e.id} (expected object). Ignoring.`), null;
  if ((t.version ?? 1) < 3) {
    const { version: i, ...r } = t;
    t = { version: 3, cinematics: { default: r } };
  }
  if (t.version === 3) {
    for (const [i, r] of Object.entries(t.cinematics ?? {}))
      t.cinematics[i] = zt.migrateV3toV4(r);
    t.version = Ko;
  }
  if (t.version > Ko)
    return console.warn(`[${T}] Cinematic: scene ${e == null ? void 0 : e.id} has version ${t.version}, runtime supports up to ${Ko}. Skipping.`), null;
  if (!t.cinematics || typeof t.cinematics != "object")
    return console.warn(`[${T}] Cinematic: no 'cinematics' map on scene ${e == null ? void 0 : e.id}. Ignoring.`), null;
  for (const [i, r] of Object.entries(t.cinematics)) {
    const a = Up(r, `scene ${e == null ? void 0 : e.id} cinematic "${i}"`);
    a ? t.cinematics[i] = a : delete t.cinematics[i];
  }
  return Object.keys(t.cinematics).length === 0 ? null : t;
}
c(Ao, "getCinematicData");
function Da(n, e = "default") {
  var i;
  const t = Ao(n);
  return ((i = t == null ? void 0 : t.cinematics) == null ? void 0 : i[e]) ?? null;
}
c(Da, "getNamedCinematic");
function Vp(n) {
  const e = Ao(n);
  return e ? Object.keys(e.cinematics) : [];
}
c(Vp, "listCinematicNames");
function zp() {
  return game.ready ? Promise.resolve() : new Promise((n) => Hooks.once("ready", n));
}
c(zp, "waitForReady");
async function Gp(n = 1e4) {
  var t, i;
  const e = (i = (t = game.modules.get(T)) == null ? void 0 : t.api) == null ? void 0 : i.tween;
  return e != null && e.Timeline ? e.Timeline : new Promise((r) => {
    const a = Date.now(), o = setTimeout(() => {
      var l, u;
      (u = (l = ui.notifications) == null ? void 0 : l.info) == null || u.call(l, `[${T}] Cinematic: waiting for tween engine...`);
    }, 2e3), s = setInterval(() => {
      var u, d, m, g;
      const l = (d = (u = game.modules.get(T)) == null ? void 0 : u.api) == null ? void 0 : d.tween;
      l != null && l.Timeline ? (clearInterval(s), clearTimeout(o), r(l.Timeline)) : Date.now() - a > n && (clearInterval(s), clearTimeout(o), console.warn(`[${T}] Cinematic: tween API not available after ${n}ms.`), (g = (m = ui.notifications) == null ? void 0 : m.warn) == null || g.call(m, `[${T}] Cinematic: tween engine unavailable — cinematic cannot play.`), r(null));
    }, 200);
  });
}
c(Gp, "waitForTweenAPI");
async function pl(n = 5e3) {
  var e;
  return window.Tagger ?? ((e = game.modules.get("tagger")) == null ? void 0 : e.api) ? !0 : new Promise((t) => {
    const i = Date.now(), r = setInterval(() => {
      var a;
      window.Tagger ?? ((a = game.modules.get("tagger")) == null ? void 0 : a.api) ? (clearInterval(r), t(!0)) : Date.now() - i > n && (clearInterval(r), console.warn(`[${T}] Cinematic: Tagger API not available after ${n}ms.`), t(!1));
    }, 200);
  });
}
c(pl, "waitForTagger");
async function Wp(n, e, t) {
  if (!n || !n.event) return;
  const i = { ...n };
  console.log(`[${T}] Cinematic: waiting for gate: ${n.event}`);
  let r = null;
  if (n.event === "tile-click" && n.target && n.animation) {
    const a = e.get(n.target);
    (a == null ? void 0 : a.kind) === "placeable" && a.placeable && (r = new ir(a.placeable, n.animation), r.start());
  }
  try {
    if (n.timeout && n.timeout > 0) {
      const a = new Promise((s) => setTimeout(s, n.timeout)), o = Ws(i, { signal: t.signal, eventBus: null });
      await Promise.race([o, a]);
    } else
      await Ws(i, { signal: t.signal, eventBus: null });
  } finally {
    r && r.detach();
  }
}
c(Wp, "processGate");
function ef(n) {
  if (!n.segments) return [];
  const e = [], t = /* @__PURE__ */ new Set();
  let i = n.entry;
  for (; i && typeof i == "string" && n.segments[i] && !t.has(i); )
    t.add(i), e.push(i), i = n.segments[i].next;
  return e;
}
c(ef, "getSegmentOrder");
function Fa(n, e) {
  const t = ef(n);
  for (const i of t) {
    const r = n.segments[i];
    if (r.setup)
      try {
        Ve(r.setup, e);
      } catch (a) {
        console.warn(`[${T}] Cinematic: error applying setup for segment "${i}":`, a);
      }
    if (r.landing)
      try {
        Ve(r.landing, e);
      } catch (a) {
        console.warn(`[${T}] Cinematic: error applying landing for segment "${i}":`, a);
      }
  }
  canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
}
c(Fa, "applyAllSegmentLandingStates");
async function Qi(n, e = "default", t = null) {
  var E, L, A, $, k, D, J, K;
  const i = n ?? ((E = canvas.scene) == null ? void 0 : E.id);
  if (!i) return;
  const r = `${i}:${e}`;
  if (t || (t = /* @__PURE__ */ new Set()), t.has(r)) {
    console.warn(`[${T}] Cinematic: circular transition detected at "${r}". Stopping chain.`), (A = (L = ui.notifications) == null ? void 0 : L.warn) == null || A.call(L, "Cinematic: circular transition detected, stopping.");
    return;
  }
  t.add(r), (we == null ? void 0 : we.status) === "running" && we.cancel("replaced"), we = null, qt && (qt.abort("replaced"), qt = null);
  const a = Da(i, e);
  if (!a) {
    console.warn(`[${T}] Cinematic: no cinematic "${e}" on scene ${i}.`);
    return;
  }
  const o = await Gp();
  if (!o || (($ = canvas.scene) == null ? void 0 : $.id) !== i || (await pl(), ((k = canvas.scene) == null ? void 0 : k.id) !== i)) return;
  const { targets: s, unresolved: l } = Ia(a);
  if (console.log(`[${T}] Cinematic "${e}": resolved ${s.size} targets`), l.length && console.warn(`[${T}] Cinematic "${e}": skipping ${l.length} unresolved: ${l.join(", ")}`), s.size === 0) {
    console.warn(`[${T}] Cinematic "${e}": no targets could be resolved on scene ${i}.`);
    return;
  }
  const u = Jh(a);
  Ki = Wh(u, s), Yi = s;
  const d = Zd(i, e), m = new AbortController();
  qt = m;
  const g = a.synchronized === !0 && game.user.isGM, h = ef(a);
  if (h.length === 0) {
    console.warn(`[${T}] Cinematic "${e}": no segments to execute.`);
    return;
  }
  let y = 0;
  const p = /* @__PURE__ */ new Set();
  if (d) {
    const _ = d.completedSegments ?? [];
    for (const N of _) p.add(N);
    const P = h.indexOf(d.currentSegment);
    P >= 0 && (y = P, console.log(`[${T}] Cinematic "${e}": resuming from segment "${d.currentSegment}" (${_.length} completed)`));
  }
  for (let _ = 0; _ < y; _++) {
    const P = h[_], N = a.segments[P];
    if (N.setup)
      try {
        Ve(N.setup, s);
      } catch (R) {
        console.warn(`[${T}] Cinematic: error applying setup for completed segment "${P}":`, R);
      }
    if (N.landing)
      try {
        Ve(N.landing, s);
      } catch (R) {
        console.warn(`[${T}] Cinematic: error applying landing for completed segment "${P}":`, R);
      }
  }
  let w = !1, b = !1;
  Pt({ type: "playback-start", sceneName: ((D = canvas.scene) == null ? void 0 : D.name) ?? i });
  try {
    for (let _ = y; _ < h.length; _++) {
      if (m.signal.aborted) {
        w = !0;
        break;
      }
      if (((J = canvas.scene) == null ? void 0 : J.id) !== i) {
        w = !0;
        break;
      }
      const P = h[_], N = a.segments[P];
      if (console.log(`[${T}] Cinematic "${e}": entering segment "${P}"`), Pt({ type: "segment-start", segmentName: P }), Bp(i, e, P, [...p]), N.gate) {
        Pt({ type: "gate-wait", segmentName: P, gate: N.gate });
        try {
          await Wp(N.gate, s, m);
        } catch (V) {
          if (m.signal.aborted) {
            w = !0;
            break;
          }
          throw V;
        }
        Pt({ type: "gate-resolved", segmentName: P });
      }
      if (m.signal.aborted) {
        w = !0;
        break;
      }
      if (N.setup)
        try {
          Ve(N.setup, s), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
        } catch (V) {
          console.error(`[${T}] Cinematic "${e}": error applying setup for segment "${P}":`, V);
        }
      if ((K = N.timeline) != null && K.length) {
        const V = Fl(N.timeline);
        Pt({ type: "timeline-start", segmentName: P, durationMs: V });
        const { tl: z } = tp(
          { setup: {}, timeline: N.timeline },
          s,
          o,
          {
            timelineName: `cinematic-${i}-${e}-${P}`,
            onStepComplete: /* @__PURE__ */ c((U) => {
              Pt({ type: "step-complete", segmentName: P, stepIndex: U });
            }, "onStepComplete")
          }
        );
        we = z.run({
          broadcast: g,
          commit: g
        });
        try {
          await new Promise((U, Y) => {
            z.onComplete(() => U()), z.onCancel(() => Y(new Error("cancelled"))), z.onError((Z) => Y(new Error(`timeline error: ${Z}`)));
            const ae = /* @__PURE__ */ c(() => Y(new Error("cancelled")), "onAbort");
            m.signal.addEventListener("abort", ae, { once: !0 });
          });
        } catch (U) {
          if (U.message === "cancelled" || m.signal.aborted) {
            w = !0;
            break;
          }
          throw U;
        }
        Pt({ type: "timeline-end", segmentName: P });
      }
      if (m.signal.aborted) {
        w = !0;
        break;
      }
      if (N.landing)
        try {
          Ve(N.landing, s), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
        } catch (V) {
          console.error(`[${T}] Cinematic "${e}": error applying landing for segment "${P}":`, V);
        }
      Pt({ type: "segment-complete", segmentName: P }), p.add(P);
      const R = N.next;
      if (R && typeof R == "object" && R.scene) {
        const V = R.scene, z = R.segment ?? a.entry;
        console.log(`[${T}] Cinematic "${e}": cross-scene transition to scene ${V}, segment "${z}"`), we = null, qt = null, hl(i, e), Cc(), a.tracking !== !1 && await game.user.setFlag(T, ri(i, e), !0), Pn = { sceneId: V, cinematicName: e, visitedChain: t };
        const H = game.scenes.get(V);
        H ? H.view() : (console.warn(`[${T}] Cinematic: cross-scene transition target scene "${V}" not found.`), Pn = null);
        return;
      }
    }
  } catch (_) {
    b = !0, console.error(`[${T}] Cinematic "${e}" error on scene ${i}:`, _);
  }
  if (we = null, qt = null, hl(i, e), Cc(), Ki = null, Yi = null, Pt({ type: "playback-end", cancelled: !!w }), w) {
    console.log(`[${T}] Cinematic "${e}" cancelled on scene ${i}.`), Fa(a, s);
    return;
  }
  if (b) {
    Fa(a, s);
    return;
  }
  a.tracking !== !1 && await game.user.setFlag(T, ri(i, e), !0), console.log(`[${T}] Cinematic "${e}" complete on scene ${i}.`);
}
c(Qi, "playCinematic");
async function Jp(n, e = "default") {
  var i;
  const t = n ?? ((i = canvas.scene) == null ? void 0 : i.id);
  t && (await game.user.unsetFlag(T, ri(t, e)), console.log(`[${T}] Cinematic: cleared seen flag for "${e}" on scene ${t}.`));
}
c(Jp, "resetCinematic");
async function Kp(n, e, t = "default") {
  var a;
  if (!game.user.isGM) return;
  const i = n ?? ((a = canvas.scene) == null ? void 0 : a.id);
  if (!i || !e) return;
  const r = game.users.get(e);
  r && (await r.unsetFlag(T, ri(i, t)), console.log(`[${T}] Cinematic: cleared seen flag for user ${r.name} on "${t}" scene ${i}.`));
}
c(Kp, "resetCinematicForUser");
async function Yp(n, e = "default") {
  var a;
  if (!game.user.isGM) return;
  const t = n ?? ((a = canvas.scene) == null ? void 0 : a.id);
  if (!t) return;
  const i = ri(t, e), r = game.users.map((o) => o.getFlag(T, i) ? o.unsetFlag(T, i) : Promise.resolve());
  await Promise.all(r), console.log(`[${T}] Cinematic: cleared seen flag for all users on "${e}" scene ${t}.`);
}
c(Yp, "resetCinematicForAll");
function Qp(n, e = "default") {
  var r;
  const t = n ?? ((r = canvas.scene) == null ? void 0 : r.id);
  if (!t) return [];
  const i = ri(t, e);
  return game.users.map((a) => ({
    userId: a.id,
    name: a.name,
    color: a.color ?? "#888888",
    isGM: a.isGM,
    seen: !!a.getFlag(T, i)
  }));
}
c(Qp, "getSeenStatus");
function Xp(n, e) {
  var i;
  const t = n ?? ((i = canvas.scene) == null ? void 0 : i.id);
  return e ? Da(t, e) != null : Ao(t) != null;
}
c(Xp, "hasCinematic");
function Zp() {
  if (!Ki || !Yi) {
    console.warn(`[${T}] Cinematic: no snapshot available for revert.`);
    return;
  }
  (we == null ? void 0 : we.status) === "running" && we.cancel("reverted"), we = null, qt && (qt.abort("reverted"), qt = null);
  try {
    Ve(Ki, Yi), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 }), console.log(`[${T}] Cinematic: reverted to pre-cinematic state.`);
  } catch (n) {
    console.error(`[${T}] Cinematic: error during revert:`, n);
  }
  Ki = null, Yi = null;
}
c(Zp, "revertCinematic");
async function ey() {
  const n = ++li;
  if (console.log(`[${T}] Cinematic: canvasReady fired, gen=${n}, game.ready=${game.ready}`), await zp(), n !== li) return;
  console.log(`[${T}] Cinematic: game is ready`);
  const e = canvas.scene;
  if (!e) {
    console.log(`[${T}] Cinematic: no canvas.scene, exiting`);
    return;
  }
  if (Pn && Pn.sceneId === e.id) {
    const a = Pn;
    Pn = null, console.log(`[${T}] Cinematic: picking up pending transition to "${a.cinematicName}" on scene ${e.id}`);
    try {
      await Qi(e.id, a.cinematicName, a.visitedChain);
    } catch (o) {
      console.error(`[${T}] Cinematic: error during pending transition playback on scene ${e.id}:`, o);
    }
    return;
  }
  Pn = null;
  const t = Ao(e.id);
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
    const o = Zd(e.id, a);
    if (n !== li) return;
    if (o) {
      console.log(`[${T}] Cinematic "${a}": found saved progress at segment "${o.currentSegment}", resuming...`);
      try {
        await Qi(e.id, a);
      } catch (s) {
        console.error(`[${T}] Cinematic "${a}": error during resumed playback on scene ${e.id}:`, s);
      }
      return;
    }
  }
  let r = null;
  for (const { name: a, data: o } of i)
    if (!(o.tracking !== !1 && _c(e.id, a))) {
      r = { name: a, data: o };
      break;
    }
  if (!r) {
    if (console.log(`[${T}] Cinematic: all canvasReady cinematics already seen on scene ${e.id}`), ty(e.id, i), (we == null ? void 0 : we.status) === "running" && we.cancel("already-seen"), we = null, await pl(), n !== li) return;
    for (const { name: a, data: o } of i)
      try {
        const { targets: s } = Ia(o);
        Fa(o, s);
      } catch (s) {
        console.error(`[${T}] Cinematic "${a}": error applying landing states (already seen) on scene ${e.id}:`, s);
      }
    canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
    return;
  }
  if (n === li && (console.log(`[${T}] Cinematic: playing first unseen cinematic "${r.name}"...`), await pl(), n === li)) {
    for (const { name: a, data: o } of i) {
      if (a === r.name) continue;
      if (o.tracking !== !1 && _c(e.id, a))
        try {
          const { targets: l } = Ia(o);
          Fa(o, l);
        } catch (l) {
          console.error(`[${T}] Cinematic "${a}": error applying landing states (already seen) on scene ${e.id}:`, l);
        }
    }
    try {
      await Qi(e.id, r.name);
    } catch (a) {
      console.error(`[${T}] Cinematic "${r.name}": error during playback on scene ${e.id}:`, a);
    }
  }
}
c(ey, "onCanvasReady");
function ty(n, e) {
  for (const { name: t } of e)
    hl(n, t);
}
c(ty, "clearAllCanvasReadyProgress");
function ny(n = 3e5) {
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
c(ny, "cleanupStaleProgressFlags");
function iy() {
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
        new al({ scene: canvas.scene }).render(!0);
      }, "onClick")
    };
    Array.isArray(i) ? i.push(a) : i instanceof Map ? i.set(r, a) : i && typeof i == "object" ? i[r] = a : t.tools = [a];
  });
}
c(iy, "registerEditorButton");
function ry() {
  Hooks.on("canvasReady", ey), iy(), Hooks.once("ready", () => {
    ny();
    const n = game.modules.get(T);
    n.api || (n.api = {}), n.api.cinematic = {
      play: Qi,
      reset: Jp,
      resetForUser: Kp,
      resetForAll: Yp,
      getSeenStatus: Qp,
      has: Xp,
      get: Da,
      list: Vp,
      revert: Zp,
      onPlaybackProgress: jp,
      TileAnimator: ir,
      registerBehaviour: Di,
      getBehaviour: Xd,
      trigger: /* @__PURE__ */ c(async (e, t, i = "default") => {
        var o;
        const r = t ?? ((o = canvas.scene) == null ? void 0 : o.id);
        if (!r) return;
        const a = Da(r, i);
        a && (a.trigger && a.trigger !== e || await Qi(r, i));
      }, "trigger")
    }, console.log(`[${T}] Cinematic API registered (v4).`);
  });
}
c(ry, "registerCinematicHooks");
function xc(n, e) {
  const t = Math.abs(n.width), i = Math.abs(n.height), r = t / 2, a = i / 2;
  let o = e.x - (n.x + r), s = e.y - (n.y + a);
  if (n.rotation !== 0) {
    const l = Math.toRadians(n.rotation), u = Math.cos(l), d = Math.sin(l), m = u * o + d * s, g = u * s - d * o;
    o = m, s = g;
  }
  return o += r, s += a, o >= 0 && o <= t && s >= 0 && s <= i;
}
c(xc, "pointWithinTile");
Co("tile-click", (n, e) => n.target ? new Promise((t, i) => {
  var h;
  if (e.signal.aborted) return i(e.signal.reason ?? "aborted");
  const r = Io(n.target);
  if (!((h = r == null ? void 0 : r.placeables) != null && h.length))
    return i(new Error(`await tile-click: no placeables found for "${n.target}"`));
  const a = r.placeables, o = [];
  for (const { placeable: y } of a) {
    const p = new ir(y, n.animation);
    p.start("idle"), o.push({ placeable: y, animator: p });
  }
  const s = document.getElementById("board");
  let l = null;
  const u = /* @__PURE__ */ c((y) => {
    const p = canvas.activeLayer;
    if (!p) return;
    const w = p.toLocal(y);
    if (!w || isNaN(w.x) || isNaN(w.y)) return;
    let b = !1;
    for (const { placeable: E, animator: L } of o)
      xc(E.document, w) ? (b = !0, L.state !== "hover" && L.setState("hover")) : L.state === "hover" && L.setState("idle");
    b ? l === null && (l = document.body.style.cursor, document.body.style.cursor = "pointer") : l !== null && (document.body.style.cursor = l, l = null);
  }, "onPointerMove");
  s == null || s.addEventListener("pointermove", u);
  const d = /* @__PURE__ */ c((y) => {
    if (y.button !== 0) return;
    const p = canvas.activeLayer;
    if (!p) return;
    const w = p.toLocal(y);
    isNaN(w.x) || isNaN(w.y) || !a.filter(({ doc: E }) => xc(E, w)).sort((E, L) => (L.doc.sort ?? 0) - (E.doc.sort ?? 0))[0] || (y.stopPropagation(), y.preventDefault(), g(), t());
  }, "onPointerDown");
  s == null || s.addEventListener("pointerdown", d, { capture: !0 });
  const m = /* @__PURE__ */ c(() => {
    g(), i(e.signal.reason ?? "aborted");
  }, "onAbort");
  e.signal.addEventListener("abort", m, { once: !0 });
  function g() {
    s == null || s.removeEventListener("pointerdown", d, { capture: !0 }), s == null || s.removeEventListener("pointermove", u), e.signal.removeEventListener("abort", m);
    for (const { animator: y } of o)
      y.detach();
    l !== null ? (document.body.style.cursor = l, l = null) : document.body.style.cursor = "";
  }
  c(g, "cleanup");
}) : Promise.reject(new Error('await tile-click: "target" is required')));
ry();
function ay() {
  Hooks.once("ready", () => {
    const n = game.modules.get(T);
    n.api || (n.api = {}), n.api.picker = {
      /** Open the picker window. Returns Promise<string[] | null>. */
      open: /* @__PURE__ */ c((e) => $a.open(e), "open"),
      /** Resolve a selector string to documents. */
      resolveSelector: Io,
      /** Parse a selector string into { type, value }. */
      parseSelector: Dl,
      /** Build a selector string from { type, value }. */
      buildSelector: Bh,
      /** Build a tag selector from tags array + mode. */
      buildTagSelector: Sd,
      /** Canvas highlight utilities. */
      highlight: {
        add: ka,
        remove: Mi,
        has: Dd,
        clearAll: sa
      }
    }, console.log(`[${T}] Placeable Picker API registered.`);
  });
}
c(ay, "registerPlaceablePickerHooks");
ay();
//# sourceMappingURL=eidolon-utilities.js.map
