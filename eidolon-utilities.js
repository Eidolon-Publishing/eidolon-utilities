var Pi = Object.defineProperty;
var eo = Object.getPrototypeOf;
var to = Reflect.get;
var Ri = (e) => {
  throw TypeError(e);
};
var no = (e, t, n) => t in e ? Pi(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var a = (e, t) => Pi(e, "name", { value: t, configurable: !0 });
var ze = (e, t, n) => no(e, typeof t != "symbol" ? t + "" : t, n), Rn = (e, t, n) => t.has(e) || Ri("Cannot " + n);
var p = (e, t, n) => (Rn(e, t, "read from private field"), n ? n.call(e) : t.get(e)), D = (e, t, n) => t.has(e) ? Ri("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), _ = (e, t, n, i) => (Rn(e, t, "write to private field"), i ? i.call(e, n) : t.set(e, n), n), E = (e, t, n) => (Rn(e, t, "access private method"), n);
var lt = (e, t, n) => to(eo(e), n, t);
const v = "eidolon-utilities", Kt = "timeTriggerActive", xn = "timeTriggerHideWindow", jn = "timeTriggerShowPlayerWindow", qn = "timeTriggerAllowRealTime", rr = "timeTriggers", xt = "timeTriggerHistory", Bn = "debug", Gn = "timeFormat", zn = "manageTime", Wn = "secondsPerRound";
const io = [-30, -15, -5, 5, 15, 30], dt = 1440 * 60, jt = "playSound", Ft = 6;
function f(e, t) {
  var n, i;
  return (i = (n = game.i18n) == null ? void 0 : n.has) != null && i.call(n, e) ? game.i18n.localize(e) : t;
}
a(f, "localize");
function Yt(e) {
  return typeof e != "string" ? "" : e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
a(Yt, "escapeHtml");
function nt(e) {
  var t;
  return e == null ? e : (t = foundry == null ? void 0 : foundry.utils) != null && t.duplicate ? foundry.utils.duplicate(e) : JSON.parse(JSON.stringify(e));
}
a(nt, "duplicateData");
function ro() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
a(ro, "generateTriggerId");
function or(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  if (!t) return null;
  const n = t.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (!n) return null;
  const i = Number(n[1]), r = Number(n[2]), o = n[3] !== void 0 ? Number(n[3]) : 0;
  return !Number.isInteger(i) || !Number.isInteger(r) || !Number.isInteger(o) || i < 0 || i > 23 || r < 0 || r > 59 || o < 0 || o > 59 ? null : i * 3600 + r * 60 + o;
}
a(or, "parseTriggerTimeToSeconds");
function wt() {
  var e, t;
  return ((e = game.scenes) == null ? void 0 : e.current) ?? ((t = game.scenes) == null ? void 0 : t.active) ?? null;
}
a(wt, "getActiveScene");
function Me(e) {
  return (e == null ? void 0 : e.object) ?? (e == null ? void 0 : e.document) ?? null;
}
a(Me, "getSceneFromApplication");
function le(e) {
  return e && typeof e.getFlag == "function" && typeof e.setFlag == "function";
}
a(le, "hasSceneDocument");
const Kn = /* @__PURE__ */ new Set(), Yn = /* @__PURE__ */ new Set(), Jn = /* @__PURE__ */ new Set(), Qn = /* @__PURE__ */ new Set();
let it = !1, Mt = !1, Jt = Ft, Qt = "12h", Hi = !1;
function Hn(e) {
  it = !!e;
  for (const t of Kn)
    try {
      t(it);
    } catch (n) {
      console.error(`${v} | Debug change handler failed`, n);
    }
}
a(Hn, "notifyDebugChange");
function $n(e) {
  Mt = !!e;
  for (const t of Yn)
    try {
      t(Mt);
    } catch (n) {
      console.error(`${v} | Manage time change handler failed`, n);
    }
}
a($n, "notifyManageTimeChange");
function sr(e) {
  return e === "24h" ? "24h" : "12h";
}
a(sr, "normalizeTimeFormatValue");
function Li(e) {
  const t = Number(e);
  return !Number.isFinite(t) || t <= 0 ? Ft : t;
}
a(Li, "normalizeSecondsPerRoundValue");
function kn(e) {
  const t = Li(e);
  Jt = t;
  for (const n of Jn)
    try {
      n(t);
    } catch (i) {
      console.error(`${v} | Seconds-per-round change handler failed`, i);
    }
}
a(kn, "notifySecondsPerRoundChange");
function Vn(e) {
  const t = sr(e);
  Qt = t;
  for (const n of Qn)
    try {
      n(t);
    } catch (i) {
      console.error(`${v} | Time format change handler failed`, i);
    }
}
a(Vn, "notifyTimeFormatChange");
function oo() {
  var t;
  if (Hi) return;
  if (Hi = !0, !((t = game == null ? void 0 : game.settings) != null && t.register)) {
    console.warn(
      `${v} | game.settings.register is unavailable. Module settings could not be registered.`
    );
    return;
  }
  const e = typeof game.settings.registerChange == "function";
  game.settings.register(v, Bn, {
    name: f("EIDOLON.TimeTrigger.DebugSettingName", "Enable debug logging"),
    hint: f(
      "EIDOLON.TimeTrigger.DebugSettingHint",
      "Write detailed time-trigger diagnostics to the browser console."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: e ? void 0 : Hn
  }), e && game.settings.registerChange(v, Bn, Hn), it = Si(), Hn(it), game.settings.register(v, zn, {
    name: f("EIDOLON.TimeTrigger.ManageTimeSettingName", "Manage Game Time"),
    hint: f(
      "EIDOLON.TimeTrigger.ManageTimeSettingHint",
      "Allow Eidolon Utilities to advance world time automatically while the game is unpaused. Warning: This may conflict with other time-management modules."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: e ? void 0 : $n
  }), e && game.settings.registerChange(v, zn, $n), Mt = ao(), $n(Mt), game.settings.register(v, Wn, {
    name: f(
      "EIDOLON.TimeTrigger.SecondsPerRoundSettingName",
      "Seconds Per Combat Round"
    ),
    hint: f(
      "EIDOLON.TimeTrigger.SecondsPerRoundSettingHint",
      "Amount of world seconds to add whenever a combat round ends while time management is active."
    ),
    scope: "world",
    config: !0,
    type: Number,
    default: Ft,
    range: { min: 1, max: 3600, step: 1 },
    onChange: e ? void 0 : kn
  }), e && game.settings.registerChange(
    v,
    Wn,
    kn
  ), Jt = Li(lo()), kn(Jt), game.settings.register(v, Gn, {
    name: f("EIDOLON.TimeTrigger.TimeFormatSettingName", "Trigger Time Format"),
    hint: f(
      "EIDOLON.TimeTrigger.TimeFormatSettingHint",
      "Control whether trigger times use a 12-hour or 24-hour clock."
    ),
    scope: "world",
    config: !0,
    type: String,
    choices: {
      "12h": f(
        "EIDOLON.TimeTrigger.TimeFormatSettingChoice12Hour",
        "12-hour (e.g. 2:30 PM)"
      ),
      "24h": f(
        "EIDOLON.TimeTrigger.TimeFormatSettingChoice24Hour",
        "24-hour (e.g. 14:30)"
      )
    },
    default: "12h",
    onChange: e ? void 0 : Vn
  }), e && game.settings.registerChange(v, Gn, Vn), Qt = sr(ar()), Vn(Qt);
}
a(oo, "registerTimeTriggerSettings");
function Si() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get)
      return !!game.settings.get(v, Bn);
  } catch (t) {
    console.error(`${v} | Failed to read debug setting`, t);
  }
  return !1;
}
a(Si, "getDebugSetting");
function so() {
  return it = Si(), it;
}
a(so, "refreshDebugSettingCache");
function ao() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get)
      return !!game.settings.get(v, zn);
  } catch (t) {
    console.error(`${v} | Failed to read manage time setting`, t);
  }
  return !1;
}
a(ao, "getManageTimeSetting");
function ar() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get)
      return game.settings.get(v, Gn) === "24h" ? "24h" : "12h";
  } catch (t) {
    console.error(`${v} | Failed to read time format setting`, t);
  }
  return "12h";
}
a(ar, "getTimeFormatSetting");
function lo() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get) {
      const t = game.settings.get(v, Wn);
      return Li(t);
    }
  } catch (t) {
    console.error(`${v} | Failed to read seconds-per-round setting`, t);
  }
  return Ft;
}
a(lo, "getSecondsPerRoundSetting");
function co(e) {
  if (typeof e != "function")
    return () => {
    };
  Kn.add(e);
  try {
    e(it);
  } catch (t) {
    console.error(`${v} | Debug change handler failed`, t);
  }
  return () => {
    Kn.delete(e);
  };
}
a(co, "onDebugSettingChange");
function lr(e) {
  if (typeof e != "function")
    return () => {
    };
  Yn.add(e);
  try {
    e(Mt);
  } catch (t) {
    console.error(`${v} | Manage time change handler failed`, t);
  }
  return () => {
    Yn.delete(e);
  };
}
a(lr, "onManageTimeSettingChange");
function wi(e) {
  if (typeof e != "function")
    return () => {
    };
  Qn.add(e);
  try {
    e(Qt);
  } catch (t) {
    console.error(`${v} | Time format change handler failed`, t);
  }
  return () => {
    Qn.delete(e);
  };
}
a(wi, "onTimeFormatSettingChange");
function uo(e) {
  if (typeof e != "function")
    return () => {
    };
  Jn.add(e);
  try {
    e(Jt);
  } catch (t) {
    console.error(`${v} | Seconds-per-round change handler failed`, t);
  }
  return () => {
    Jn.delete(e);
  };
}
a(uo, "onSecondsPerRoundSettingChange");
let Nn = !1, Xn = !1;
function Zn(e) {
  Nn = !!e;
}
a(Zn, "updateDebugState");
function cr() {
  Xn || (Xn = !0, Zn(Si()), co((e) => {
    Zn(e), console.info(`${v} | Debug ${Nn ? "enabled" : "disabled"}`);
  }));
}
a(cr, "ensureInitialized");
function Ci() {
  return Xn || cr(), Nn;
}
a(Ci, "shouldLog");
function ur(e) {
  if (!e.length)
    return [`${v} |`];
  const [t, ...n] = e;
  return typeof t == "string" ? [`${v} | ${t}`, ...n] : [`${v} |`, t, ...n];
}
a(ur, "formatArgs");
function fo() {
  cr();
}
a(fo, "initializeDebug");
function go() {
  return Zn(so()), Nn;
}
a(go, "syncDebugState");
function T(...e) {
  Ci() && console.debug(...ur(e));
}
a(T, "debugLog");
function Tt(...e) {
  Ci() && console.group(...ur(e));
}
a(Tt, "debugGroup");
function Ue() {
  Ci() && console.groupEnd();
}
a(Ue, "debugGroupEnd");
function ft(e) {
  var r;
  const t = (r = e == null ? void 0 : e.getFlag) == null ? void 0 : r.call(e, v, rr);
  if (!t) return [];
  const n = nt(t), i = Array.isArray(n) ? n : [];
  return T("Loaded time triggers", {
    sceneId: (e == null ? void 0 : e.id) ?? null,
    count: i.length
  }), i;
}
a(ft, "getTimeTriggers");
async function dr(e, t) {
  e != null && e.setFlag && (T("Persisting time triggers", {
    sceneId: e.id,
    count: Array.isArray(t) ? t.length : 0
  }), await e.setFlag(v, rr, t));
}
a(dr, "setTimeTriggers");
function mo(e) {
  var r;
  const t = (r = e == null ? void 0 : e.getFlag) == null ? void 0 : r.call(e, v, xt);
  if (!t) return {};
  const n = nt(t);
  if (!n || typeof n != "object") return {};
  const i = {};
  for (const [o, s] of Object.entries(n))
    typeof s == "number" && Number.isFinite(s) && (i[o] = s);
  return T("Loaded time trigger history", {
    sceneId: (e == null ? void 0 : e.id) ?? null,
    keys: Object.keys(i)
  }), i;
}
a(mo, "getTimeTriggerHistory");
async function Un(e, t) {
  var c, u, d, m;
  if (!e) return;
  const n = {};
  if (t && typeof t == "object")
    for (const [g, y] of Object.entries(t))
      typeof y == "number" && Number.isFinite(y) && (n[g] = y);
  const i = ((c = e.getFlag) == null ? void 0 : c.call(e, v, xt)) ?? {}, r = {};
  if (i && typeof i == "object")
    for (const [g, y] of Object.entries(i))
      typeof y == "number" && Number.isFinite(y) && (r[g] = y);
  const o = Object.keys(n), s = Object.keys(r);
  if (typeof ((u = foundry == null ? void 0 : foundry.utils) == null ? void 0 : u.deepEqual) == "function" ? foundry.utils.deepEqual(r, n) : JSON.stringify(r) === JSON.stringify(n)) {
    T("Skip history update because state is unchanged", {
      sceneId: (e == null ? void 0 : e.id) ?? null
    });
    return;
  }
  T("Updating time trigger history", {
    sceneId: (e == null ? void 0 : e.id) ?? null,
    keys: o,
    removedKeys: s.filter((g) => !o.includes(g))
  });
  try {
    s.length && typeof e.unsetFlag == "function" && await e.unsetFlag(v, xt), o.length && await e.setFlag(v, xt, n);
  } catch (g) {
    console.error(`${v} | Failed to persist time trigger history`, g), (m = (d = ui.notifications) == null ? void 0 : d.error) == null || m.call(
      d,
      f(
        "EIDOLON.TimeTrigger.HistoryPersistError",
        "Failed to persist the scene's time trigger history."
      )
    );
  }
}
a(Un, "updateTimeTriggerHistory");
const Xt = /* @__PURE__ */ new Map(), $i = /* @__PURE__ */ new Set();
function ho(e) {
  if (!(e != null && e.id))
    throw new Error(`${v} | Action definitions require an id.`);
  if (Xt.has(e.id))
    throw new Error(`${v} | Duplicate time trigger action id: ${e.id}`);
  Xt.set(e.id, {
    ...e
  }), T("Registered time trigger action", { actionId: e.id });
}
a(ho, "registerAction");
function Pt(e) {
  return Xt.get(e) ?? null;
}
a(Pt, "getAction");
function yo(e) {
  const t = Pt(e);
  return t ? typeof t.label == "function" ? t.label() : t.label : e;
}
a(yo, "getActionLabel");
function ki() {
  return Array.from(Xt.values());
}
a(ki, "listActions");
async function fr(e, t) {
  var i, r;
  const n = Pt(t == null ? void 0 : t.action);
  if (!n || typeof n.execute != "function") {
    const o = f(
      "EIDOLON.TimeTrigger.UnknownAction",
      "Encountered an unknown time trigger action and skipped it."
    );
    (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, o), console.warn(`${v} | Unknown time trigger action`, t), T("Encountered unknown time trigger action", {
      triggerId: (t == null ? void 0 : t.id) ?? null,
      actionId: (t == null ? void 0 : t.action) ?? null
    });
    return;
  }
  T("Executing action handler", {
    actionId: n.id,
    triggerId: (t == null ? void 0 : t.id) ?? null,
    sceneId: (e == null ? void 0 : e.id) ?? null
  }), await n.execute({ scene: e, trigger: t });
}
a(fr, "executeTriggerAction");
function To(e) {
  const t = Pt(e == null ? void 0 : e.action);
  return !t || typeof t.buildSummaryParts != "function" ? [] : t.buildSummaryParts({ trigger: e, escapeHtml: Yt, localize: f }) ?? [];
}
a(To, "buildActionSummaryParts");
function bo(e) {
  const t = Pt(e == null ? void 0 : e.action);
  return !t || typeof t.buildFormContent != "function" ? "" : t.buildFormContent({ trigger: e, escapeHtml: Yt, localize: f }) ?? "";
}
a(bo, "buildActionFormSection");
function po(e, t) {
  const n = Pt(e == null ? void 0 : e.action);
  !n || typeof n.prepareFormData != "function" || n.prepareFormData({ trigger: e, formData: t });
}
a(po, "applyActionFormData");
function vo(e, t, n) {
  var o, s;
  const i = `${(e == null ? void 0 : e.id) ?? "unknown"}:${(t == null ? void 0 : t.id) ?? (t == null ? void 0 : t.action) ?? "unknown"}:${n}`;
  if ($i.has(i)) return;
  $i.add(i);
  const r = f(
    "EIDOLON.TimeTrigger.MissingDataWarning",
    "A scene time trigger is missing required data and was skipped."
  );
  (s = (o = ui.notifications) == null ? void 0 : o.warn) == null || s.call(o, r), console.warn(`${v} | Missing trigger data (${n})`, { scene: e == null ? void 0 : e.id, trigger: t });
}
a(vo, "warnMissingTriggerData");
async function Oo({ scene: e, trigger: t }) {
  var o, s, l, c, u;
  const n = (l = (s = (o = t == null ? void 0 : t.data) == null ? void 0 : o.path) == null ? void 0 : s.trim) == null ? void 0 : l.call(s);
  if (!n) {
    vo(e, t, "missing-audio-path");
    return;
  }
  const i = {
    src: n,
    autoplay: !0,
    loop: !1
  }, r = (() => {
    var d, m, g, y, h;
    return typeof ((m = (d = foundry == null ? void 0 : foundry.audio) == null ? void 0 : d.AudioHelper) == null ? void 0 : m.play) == "function" ? foundry.audio.AudioHelper.play(i, !0) : typeof ((y = (g = game == null ? void 0 : game.audio) == null ? void 0 : g.constructor) == null ? void 0 : y.play) == "function" ? game.audio.constructor.play(i, !0) : typeof ((h = game == null ? void 0 : game.audio) == null ? void 0 : h.play) == "function" ? game.audio.play(i, !0) : null;
  })();
  if (!r) {
    console.error(`${v} | Foundry audio helper is unavailable`), (u = (c = ui.notifications) == null ? void 0 : c.error) == null || u.call(
      c,
      f(
        "EIDOLON.TimeTrigger.AudioHelperUnavailable",
        "Unable to play audio for a time trigger because the Foundry audio helper is unavailable."
      )
    );
    return;
  }
  await r;
}
a(Oo, "executePlaySoundAction");
ho({
  id: jt,
  label: /* @__PURE__ */ a(() => f("EIDOLON.TimeTrigger.ActionPlaySound", "Play Sound"), "label"),
  execute: Oo,
  buildSummaryParts: /* @__PURE__ */ a(({ trigger: e, escapeHtml: t, localize: n }) => {
    var r;
    return (r = e == null ? void 0 : e.data) != null && r.path ? [`${t(n("EIDOLON.TimeTrigger.TriggerSound", "Sound File"))}: ${t(e.data.path)}`] : [];
  }, "buildSummaryParts"),
  buildFormContent: /* @__PURE__ */ a(({ trigger: e, escapeHtml: t, localize: n }) => {
    var l;
    const i = t(n("EIDOLON.TimeTrigger.TriggerSound", "Sound File")), r = t(
      n("EIDOLON.TimeTrigger.TriggerChooseFile", "Select File")
    ), o = t(
      n(
        "EIDOLON.TimeTrigger.TriggerSoundNotes",
        "Select or upload the audio file that should play when this trigger fires."
      )
    ), s = t(((l = e == null ? void 0 : e.data) == null ? void 0 : l.path) ?? "");
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
  prepareFormData: /* @__PURE__ */ a(({ trigger: e, formData: t }) => {
    var n, i;
    e.data.path = ((i = (n = t.playSoundPath) == null ? void 0 : n.trim) == null ? void 0 : i.call(n)) ?? "";
  }, "prepareFormData")
});
var tr;
const { ApplicationV2: An, HandlebarsApplicationMixin: Dn } = ((tr = foundry.applications) == null ? void 0 : tr.api) ?? {};
if (!An || !Dn)
  throw new Error(
    `${v} | ApplicationV2 API unavailable. Update Foundry VTT to v13 or newer.`
  );
const je = "AM", rt = "PM";
function xe() {
  return ar();
}
a(xe, "getConfiguredTimeFormat");
function _n(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  if (!t) return null;
  const n = t.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (!n) return null;
  const i = Number(n[1]), r = Number(n[2]), o = n[3] !== void 0 ? Number(n[3]) : null;
  return !Number.isInteger(i) || !Number.isInteger(r) || i < 0 || i > 23 || r < 0 || r > 59 || o !== null && (!Number.isInteger(o) || o < 0 || o > 59) ? null : {
    hours: i,
    minutes: r,
    seconds: o
  };
}
a(_n, "parseCanonicalTimeString");
function Ce({ hours: e, minutes: t, seconds: n }) {
  if (!Number.isInteger(e) || !Number.isInteger(t) || e < 0 || e > 23 || t < 0 || t > 59) return null;
  const i = String(e).padStart(2, "0"), r = String(t).padStart(2, "0");
  if (Number.isInteger(n)) {
    if (n < 0 || n > 59) return null;
    const o = String(n).padStart(2, "0");
    return `${i}:${r}:${o}`;
  }
  return `${i}:${r}`;
}
a(Ce, "formatCanonicalTime");
function Io(e, { format: t } = {}) {
  if (!e || typeof e != "object") return null;
  const n = Number(e.hour), i = Number(e.minute), r = e.second !== void 0 && e.second !== null, o = r ? Number(e.second) : null, s = r && Number.isFinite(o) ? Math.floor(Math.max(0, Math.min(59, o))) : null;
  if (!Number.isFinite(n) || !Number.isFinite(i)) return null;
  const l = t ?? xe();
  return Zt(
    {
      hours: n,
      minutes: i,
      seconds: s
    },
    l
  );
}
a(Io, "formatTimeComponentsForDisplay");
function Eo(e, { format: t } = {}) {
  const n = _n(e);
  if (!n) return "";
  const i = t ?? xe();
  return Zt(n, i);
}
a(Eo, "formatTriggerTimeForDisplay");
function Zt(e, t = "12h") {
  if (!e) return "";
  const { hours: n, minutes: i, seconds: r = null } = e;
  if (!Number.isInteger(n) || !Number.isInteger(i)) return "";
  const o = Number.isInteger(r);
  if (t === "24h") {
    const g = `${String(n).padStart(2, "0")}:${String(i).padStart(2, "0")}`;
    return o ? `${g}:${String(r).padStart(2, "0")}` : g;
  }
  const s = n >= 12 ? rt : je, l = n % 12 === 0 ? 12 : n % 12, c = String(l), u = String(i).padStart(2, "0"), d = `${c}:${u}`, m = s === je ? f("EIDOLON.TimeTrigger.TimePeriodAM", je) : f("EIDOLON.TimeTrigger.TimePeriodPM", rt);
  if (o) {
    const g = String(r).padStart(2, "0");
    return `${d}:${g} ${m}`;
  }
  return `${d} ${m}`;
}
a(Zt, "formatTimeParts");
function Vi(e, t = xe()) {
  const n = _n(e);
  if (t === "24h")
    return {
      format: t,
      canonical: n ? Ce(n) ?? "" : "",
      hour: n ? String(n.hours).padStart(2, "0") : "",
      minute: n ? String(n.minutes).padStart(2, "0") : ""
    };
  if (!n)
    return {
      format: t,
      canonical: "",
      hour: "",
      minute: "",
      period: je
    };
  const i = n.hours >= 12 ? rt : je, r = n.hours % 12 === 0 ? 12 : n.hours % 12;
  return {
    format: t,
    canonical: Ce(n) ?? "",
    hour: String(r),
    minute: String(n.minutes).padStart(2, "0"),
    period: i
  };
}
a(Vi, "getTimeFormValues");
function Lo({ hour: e, minute: t, period: n, time: i }, r = xe()) {
  if (r === "24h") {
    const y = typeof e == "string" ? e.trim() : "", h = typeof t == "string" ? t.trim() : "", O = typeof i == "string" ? i.trim() : "";
    if (!y && !h && O) {
      const N = _n(O);
      return N ? { canonical: Ce(N) ?? "", error: null } : {
        canonical: "",
        error: f(
          "EIDOLON.TimeTrigger.TimeFormatInvalid24",
          "Enter a valid time in HH:MM format."
        )
      };
    }
    if (!y || !h)
      return {
        canonical: "",
        error: f("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.")
      };
    const I = Number(y), b = Number(h);
    return !Number.isInteger(I) || I < 0 || I > 23 ? {
      canonical: "",
      error: f(
        "EIDOLON.TimeTrigger.TimeFormatInvalid24",
        "Enter a valid time in HH:MM format."
      )
    } : !Number.isInteger(b) || b < 0 || b > 59 ? {
      canonical: "",
      error: f(
        "EIDOLON.TimeTrigger.TimeFormatInvalid24",
        "Enter a valid time in HH:MM format."
      )
    } : { canonical: Ce({
      hours: I,
      minutes: b
    }) ?? "", error: null };
  }
  const o = typeof e == "string" ? e.trim() : "", s = typeof t == "string" ? t.trim() : "", l = typeof n == "string" ? n.trim().toUpperCase() : "";
  if (!o || !s || !l)
    return { canonical: "", error: f("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.") };
  if (l !== je && l !== rt)
    return { canonical: "", error: f("EIDOLON.TimeTrigger.TimeFormatInvalidPeriod", "Select AM or PM.") };
  const c = Number(o), u = Number(s);
  if (!Number.isInteger(c) || c < 1 || c > 12)
    return {
      canonical: "",
      error: f("EIDOLON.TimeTrigger.TimeFormatInvalidHour", "Hours must be between 1 and 12.")
    };
  if (!Number.isInteger(u) || u < 0 || u > 59)
    return {
      canonical: "",
      error: f("EIDOLON.TimeTrigger.TimeFormatInvalidMinute", "Minutes must be between 00 and 59.")
    };
  const d = c % 12, g = {
    hours: l === rt ? d + 12 : d,
    minutes: u
  };
  return {
    canonical: Ce(g) ?? "",
    error: null
  };
}
a(Lo, "normalizeFormTimeInput");
function So() {
  return [
    {
      value: je,
      label: f("EIDOLON.TimeTrigger.TimePeriodAM", je)
    },
    {
      value: rt,
      label: f("EIDOLON.TimeTrigger.TimePeriodPM", rt)
    }
  ];
}
a(So, "getPeriodOptions");
var Ke, Ye, H, gr, sn, an, mr, ti, ni, ln, cn, hr, yr, Tr, ii, ri, oi, un, dn, si, fn, br, pr;
const We = class We extends Dn(An) {
  constructor(n = {}) {
    var s;
    const { scene: i, showControls: r, ...o } = n ?? {};
    super(o);
    D(this, H);
    D(this, Ke, null);
    D(this, Ye, null);
    D(this, sn, /* @__PURE__ */ a((n) => {
      var r, o;
      n.preventDefault();
      const i = Number((o = (r = n.currentTarget) == null ? void 0 : r.dataset) == null ? void 0 : o.delta);
      Number.isFinite(i) && (T("Time delta button clicked", { delta: i }), this._advanceTime(i));
    }, "#onDeltaClick"));
    D(this, an, /* @__PURE__ */ a((n) => {
      var i, r;
      n.preventDefault(), !(!this.showControls || !((i = game.user) != null && i.isGM)) && (T("Time value double clicked", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null }), E(this, H, mr).call(this));
    }, "#onTimeDoubleClick"));
    D(this, ln, /* @__PURE__ */ a((n) => {
      if (this.isEditingTime && !this._commitTimeInProgress)
        if (n.key === "Enter") {
          n.preventDefault();
          const i = n.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
          E(this, H, ni).call(this, r);
        } else n.key === "Escape" && (n.preventDefault(), E(this, H, ti).call(this));
    }, "#onTimeInputKeydown"));
    D(this, cn, /* @__PURE__ */ a((n) => {
      if (!this.isEditingTime || this._commitTimeInProgress || this._suppressBlurCommit) return;
      const i = n.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
      E(this, H, ni).call(this, r);
    }, "#onTimeInputBlur"));
    D(this, un, /* @__PURE__ */ a((n) => {
      const i = !!n;
      if (this.manageTimeEnabled === i) return;
      this.manageTimeEnabled = i, (this.rendered ?? this.isRendered ?? !1) && this.render({ force: !0 });
    }, "#handleManageTimeChange"));
    D(this, dn, /* @__PURE__ */ a(async (n) => {
      var o, s, l, c, u, d, m, g, y;
      if (n.preventDefault(), !this.showControls || !((o = game.user) != null && o.isGM)) return;
      if (!this.manageTimeEnabled) {
        (l = (s = ui.notifications) == null ? void 0 : s.error) == null || l.call(
          s,
          f(
            "EIDOLON.TimeTrigger.SceneRealTimeManageDisabled",
            "Enable Manage Time in module settings to allow automatic real-time flow."
          )
        );
        return;
      }
      const i = this.scene;
      if (!i || typeof i.setFlag != "function") {
        (u = (c = ui.notifications) == null ? void 0 : c.error) == null || u.call(
          c,
          f(
            "EIDOLON.TimeTrigger.SceneUnavailable",
            "The active scene is unavailable. Try again after reloading the world."
          )
        );
        return;
      }
      const r = !this.sceneAllowsRealTime;
      try {
        await i.setFlag(v, qn, r), this.sceneAllowsRealTime = r;
        const h = r ? f(
          "EIDOLON.TimeTrigger.SceneRealTimeEnabled",
          "Automatic real-time flow enabled for this scene."
        ) : f(
          "EIDOLON.TimeTrigger.SceneRealTimeDisabled",
          "Automatic real-time flow disabled for this scene."
        );
        (m = (d = ui.notifications) == null ? void 0 : d.info) == null || m.call(d, h);
      } catch (h) {
        console.error(`${v} | Failed to toggle scene real-time flow`, h), (y = (g = ui.notifications) == null ? void 0 : g.error) == null || y.call(
          g,
          f(
            "EIDOLON.TimeTrigger.SceneRealTimeToggleError",
            "Failed to update the scene's real-time flow setting."
          )
        );
      } finally {
        this.render({ force: !0 });
      }
    }, "#onRealTimeToggleClick"));
    D(this, fn, /* @__PURE__ */ a(() => {
      (this.rendered ?? this.isRendered ?? !1) && (this.isEditingTime && (this.editValue = E(this, H, ii).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    this.scene = i ?? null, this.showControls = typeof r == "boolean" ? r : !!((s = game.user) != null && s.isGM), this.isEditingTime = !1, this.editValue = "", this._commitTimeInProgress = !1, this._suppressBlurCommit = !1, this.manageTimeEnabled = !1, this.sceneAllowsRealTime = E(this, H, si).call(this), _(this, Ke, wi(p(this, fn))), _(this, Ye, lr(p(this, un)));
  }
  async _prepareContext() {
    var b, C;
    const n = ((b = game.time) == null ? void 0 : b.components) ?? {}, r = ((n == null ? void 0 : n.second) !== void 0 && (n == null ? void 0 : n.second) !== null ? Io(n) : null) ?? E(this, H, gr).call(this), o = xe(), s = o === "24h", l = s ? f("EIDOLON.TimeTrigger.EditTimePlaceholder24", "HH:MM") : f("EIDOLON.TimeTrigger.EditTimePlaceholder12", "HH:MM AM/PM"), c = this.showControls ? f(
      "EIDOLON.TimeTrigger.EditTimeHint",
      "Double-click to set a specific time."
    ) : "", u = this.showControls ? f(
      "EIDOLON.TimeTrigger.EditTimeLabel",
      "New time (HH:MM or HH:MM AM/PM)"
    ) : "", d = io.map((N) => ({
      minutes: N,
      label: N > 0 ? `+${N}` : `${N}`
    })), m = !!this.manageTimeEnabled, g = E(this, H, si).call(this);
    this.sceneAllowsRealTime = g;
    const y = f(
      "EIDOLON.TimeTrigger.SceneRealTimeEnable",
      "Enable automatic real-time flow for this scene."
    ), h = f(
      "EIDOLON.TimeTrigger.SceneRealTimeDisable",
      "Disable automatic real-time flow for this scene."
    ), O = f(
      "EIDOLON.TimeTrigger.SceneRealTimeManageDisabled",
      "Enable Manage Time in module settings to allow automatic real-time flow."
    );
    return {
      formattedTime: r,
      deltas: d,
      manageTimeEnabled: m,
      sceneAllowsRealTime: g,
      realTimeButtonLabel: m ? g ? h : y : O,
      isGM: ((C = game.user) == null ? void 0 : C.isGM) ?? !1,
      showControls: !!this.showControls,
      editHint: c,
      editLabel: u,
      editPlaceholder: l,
      timeFormat: o,
      is24Hour: s,
      isEditingTime: !!this.isEditingTime,
      editValue: this.isEditingTime ? this.editValue ?? "" : ""
    };
  }
  async close(n = {}) {
    var r, o;
    if (!n.force)
      return (this.rendered ?? this.isRendered ?? !1) || (T("TimeTriggerWindow close request rerendering", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null
      }), this.render({ force: !0 })), this;
    T("Closing time trigger window", { sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null, force: !0 });
    const i = await super.close(n);
    return E(this, H, br).call(this), E(this, H, pr).call(this), i;
  }
  async _advanceTime(n) {
    var r, o, s, l, c, u, d;
    const i = n * 60;
    if (T("Advancing world time", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null, minutes: n, seconds: i }), !((o = game.user) != null && o.isGM)) {
      (l = (s = ui.notifications) == null ? void 0 : s.warn) == null || l.call(s, f("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time."));
      return;
    }
    try {
      await game.time.advance(i);
    } catch (m) {
      console.error(`${v} | Failed to advance time`, m), (u = (c = ui.notifications) == null ? void 0 : c.error) == null || u.call(
        c,
        f("EIDOLON.TimeTrigger.Error", "Failed to update the world time.")
      ), T("Failed to advance time from window", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        minutes: n,
        message: (m == null ? void 0 : m.message) ?? String(m)
      });
    }
  }
  _onRender(n, i) {
    var o;
    super._onRender(n, i);
    const r = this.element;
    if (r) {
      if (this.showControls) {
        T("Binding time trigger interactions", {
          sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
          buttonCount: r.querySelectorAll("[data-delta]").length
        }), r.querySelectorAll("[data-delta]").forEach((u) => {
          u.addEventListener("click", p(this, sn));
        });
        const s = r.querySelector('.time-trigger-window__time-value[data-editable="true"]');
        s && s.addEventListener("dblclick", p(this, an), { once: !1 });
        const l = r.querySelector(".time-trigger-window__time-input");
        l && (l.addEventListener("keydown", p(this, ln)), l.addEventListener("blur", p(this, cn)), typeof l.focus == "function" && (l.focus(), typeof l.select == "function" && l.select()));
        const c = r.querySelector('[data-action="toggle-real-time"]');
        c && c.addEventListener("click", p(this, dn));
      }
      this._suppressBlurCommit = !1;
    }
  }
};
Ke = new WeakMap(), Ye = new WeakMap(), H = new WeakSet(), gr = /* @__PURE__ */ a(function() {
  var c;
  const n = (c = game.time) == null ? void 0 : c.worldTime;
  if (typeof n != "number" || !Number.isFinite(n)) return "";
  const i = 1440 * 60, r = (Math.floor(n) % i + i) % i, o = Math.floor(r / 3600), s = Math.floor(r % 3600 / 60), l = r % 60;
  return Zt({ hours: o, minutes: s, seconds: l }, xe());
}, "#formatFallbackTime"), sn = new WeakMap(), an = new WeakMap(), mr = /* @__PURE__ */ a(function() {
  var n;
  (n = game.user) != null && n.isGM && (this.isEditingTime = !0, this._suppressBlurCommit = !1, this.editValue = E(this, H, ii).call(this), this.render({ force: !0 }));
}, "#enterTimeEditMode"), ti = /* @__PURE__ */ a(function() {
  this.isEditingTime = !1, this.editValue = "", this._suppressBlurCommit = !1, this.render({ force: !0 });
}, "#cancelTimeEdit"), ni = /* @__PURE__ */ a(async function(n) {
  var o, s, l;
  if (!((o = game.user) != null && o.isGM) || !this.isEditingTime || this._commitTimeInProgress) return;
  this._commitTimeInProgress = !0;
  const i = typeof n == "string" ? n.trim() : "";
  if (!i) {
    E(this, H, ti).call(this), this._commitTimeInProgress = !1;
    return;
  }
  const r = E(this, H, Tr).call(this, i);
  if (r.error) {
    (l = (s = ui.notifications) == null ? void 0 : s.error) == null || l.call(s, r.error), this._suppressBlurCommit = !0, this.editValue = i, this.render({ force: !0 }), this._commitTimeInProgress = !1;
    return;
  }
  try {
    await E(this, H, yr).call(this, r.seconds, r.includeSeconds) ? (this.isEditingTime = !1, this.editValue = "", this.render({ force: !0 })) : (this.editValue = i, this.render({ force: !0 }));
  } finally {
    this._commitTimeInProgress = !1;
  }
}, "#commitTimeInput"), ln = new WeakMap(), cn = new WeakMap(), hr = /* @__PURE__ */ a(function() {
  var u, d;
  const n = (u = game.time) == null ? void 0 : u.worldTime;
  if (typeof n != "number" || !Number.isFinite(n))
    return "";
  const i = ((d = game.time) == null ? void 0 : d.components) ?? {}, r = Number(i.hour), o = Number(i.minute), s = i.second !== void 0 ? Number(i.second) : null, l = Number.isInteger(s);
  return (Number.isFinite(r) && Number.isFinite(o) ? Ce({
    hours: Math.max(0, Math.min(23, Number(r))),
    minutes: Math.max(0, Math.min(59, Number(o))),
    seconds: l && Number.isFinite(s) ? Math.max(0, Math.min(59, Number(s))) : void 0
  }) ?? "" : "") ?? "";
}, "#getCurrentCanonicalTime"), yr = /* @__PURE__ */ a(async function(n, i) {
  var g, y, h, O, I, b, C, N, P, R;
  const r = (g = game.time) == null ? void 0 : g.worldTime;
  if (typeof r != "number" || !Number.isFinite(r))
    return (h = (y = ui.notifications) == null ? void 0 : y.error) == null || h.call(
      y,
      f(
        "EIDOLON.TimeTrigger.EditTimeUnavailable",
        "The world time is unavailable, so it can't be updated."
      )
    ), !1;
  if (!Number.isInteger(n) || n < 0 || n >= dt)
    return (I = (O = ui.notifications) == null ? void 0 : O.error) == null || I.call(
      O,
      f(
        "EIDOLON.TimeTrigger.EditTimeInvalidRange",
        "Enter a time within the current day."
      )
    ), !1;
  const l = Math.floor(r / dt) * dt + n - r;
  if (!Number.isFinite(l) || l === 0)
    return !0;
  const c = Math.floor(n / 3600), u = Math.floor(n % 3600 / 60), d = n % 60, m = Ce({
    hours: c,
    minutes: u,
    seconds: i ? d : void 0
  });
  try {
    T("Updating world time directly", {
      sceneId: ((b = this.scene) == null ? void 0 : b.id) ?? null,
      targetCanonical: m ?? null,
      diff: l
    }), await game.time.advance(l);
    const L = Zt(
      {
        hours: c,
        minutes: u,
        seconds: i ? d : null
      },
      xe()
    );
    (N = (C = ui.notifications) == null ? void 0 : C.info) == null || N.call(
      C,
      f(
        "EIDOLON.TimeTrigger.EditTimeSuccess",
        "World time updated."
      ) + (L ? ` ${L}` : "")
    );
  } catch (L) {
    return console.error(`${v} | Failed to set world time`, L), (R = (P = ui.notifications) == null ? void 0 : P.error) == null || R.call(
      P,
      f(
        "EIDOLON.TimeTrigger.EditTimeError",
        "Failed to update the world time."
      )
    ), !1;
  }
  return !0;
}, "#applyTargetSeconds"), Tr = /* @__PURE__ */ a(function(n) {
  var m;
  const i = f(
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
    const g = Number(o[1]), y = Number(o[2]), h = o[3] !== void 0 ? Number(o[3]) : void 0;
    if (Number.isInteger(g) && g >= 0 && g <= 23 && Number.isInteger(y) && y >= 0 && y <= 59 && (h === void 0 || Number.isInteger(h) && h >= 0 && h <= 59)) {
      const O = g * 3600 + y * 60 + (h ?? 0);
      return {
        canonical: Ce({ hours: g, minutes: y, seconds: h }),
        seconds: O,
        includeSeconds: h !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const { amLower: s, pmLower: l, periodPattern: c } = E(this, H, ri).call(this), u = r.match(
    new RegExp(
      `^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?\\s*(${c})$`,
      "i"
    )
  );
  if (u) {
    let g = Number(u[1]);
    const y = Number(u[2]), h = u[3] !== void 0 ? Number(u[3]) : void 0, O = u[4] ?? "", I = typeof O == "string" ? ((m = O.toLocaleLowerCase) == null ? void 0 : m.call(O)) ?? O.toLowerCase() : "";
    if (Number.isInteger(g) && g >= 1 && g <= 12 && Number.isInteger(y) && y >= 0 && y <= 59 && (h === void 0 || Number.isInteger(h) && h >= 0 && h <= 59) && (I === s || I === l || I === "am" || I === "pm")) {
      g = g % 12, (I === l || I === "pm") && (g += 12);
      const C = g * 3600 + y * 60 + (h ?? 0);
      return {
        canonical: Ce({ hours: g, minutes: y, seconds: h }),
        seconds: C,
        includeSeconds: h !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const d = or(r);
  if (d !== null) {
    const g = Math.floor(d / 3600), y = Math.floor(d % 3600 / 60), h = d % 60, O = h !== 0;
    return {
      canonical: Ce({
        hours: g,
        minutes: y,
        seconds: O ? h : void 0
      }),
      seconds: d,
      includeSeconds: O,
      error: null
    };
  }
  return { error: i };
}, "#parseInputTime"), ii = /* @__PURE__ */ a(function() {
  const n = E(this, H, hr).call(this);
  if (!n) return "";
  if (xe() === "24h")
    return n;
  const r = _n(n);
  if (!r) return n;
  const o = Number(r.hours), s = Number(r.minutes), l = r.seconds !== null && r.seconds !== void 0 ? Number(r.seconds) : void 0;
  if (!Number.isFinite(o) || !Number.isFinite(s)) return n;
  const c = Number.isFinite(l), u = o % 12 === 0 ? 12 : o % 12, d = String(s).padStart(2, "0"), m = c ? `:${String(l).padStart(2, "0")}` : "", { amLabel: g, pmLabel: y } = E(this, H, ri).call(this), h = o >= 12 ? y : g;
  return `${u}:${d}${m} ${h}`.trim();
}, "#getInitialEditValue"), ri = /* @__PURE__ */ a(function() {
  var u, d;
  const n = f("EIDOLON.TimeTrigger.TimePeriodAM", "AM"), i = f("EIDOLON.TimeTrigger.TimePeriodPM", "PM"), r = ((u = n.toLocaleLowerCase) == null ? void 0 : u.call(n)) ?? n.toLowerCase(), o = ((d = i.toLocaleLowerCase) == null ? void 0 : d.call(i)) ?? i.toLowerCase(), s = E(this, H, oi).call(this, n), l = E(this, H, oi).call(this, i), c = `${s}|${l}|AM|PM`;
  return {
    amLabel: n,
    pmLabel: i,
    amLower: r,
    pmLower: o,
    periodPattern: c
  };
}, "#getPeriodMatchData"), oi = /* @__PURE__ */ a(function(n) {
  return typeof n != "string" ? "" : n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}, "#escapeForRegex"), un = new WeakMap(), dn = new WeakMap(), si = /* @__PURE__ */ a(function() {
  const n = this.scene;
  if (!n || typeof n.getFlag != "function") return !1;
  try {
    return !!n.getFlag(v, qn);
  } catch (i) {
    T("TimeTriggerWindow | Failed to read scene real-time flag", {
      sceneId: (n == null ? void 0 : n.id) ?? null,
      message: (i == null ? void 0 : i.message) ?? String(i)
    });
  }
  return !1;
}, "#readSceneRealTimeFlag"), fn = new WeakMap(), br = /* @__PURE__ */ a(function() {
  if (typeof p(this, Ke) == "function")
    try {
      p(this, Ke).call(this);
    } catch (n) {
      console.error(`${v} | Failed to dispose time format subscription`, n);
    }
  _(this, Ke, null);
}, "#disposeTimeFormatSubscription"), pr = /* @__PURE__ */ a(function() {
  if (typeof p(this, Ye) == "function")
    try {
      p(this, Ye).call(this);
    } catch (n) {
      console.error(`${v} | Failed to dispose manage time subscription`, n);
    }
  _(this, Ye, null);
}, "#disposeManageTimeSubscription"), a(We, "TimeTriggerWindow"), ze(We, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  lt(We, We, "DEFAULT_OPTIONS"),
  {
    id: `${v}-time-trigger`,
    window: {
      title: f("EIDOLON.TimeTrigger.Title", "Time Trigger"),
      resizable: !1
    },
    position: {
      width: "auto",
      height: "auto"
    }
  },
  { inplace: !1 }
)), ze(We, "PARTS", {
  content: {
    template: `modules/${v}/templates/time-trigger.html`
  }
});
let ei = We;
function Mi(e, t = {}) {
  if (typeof e != "function")
    throw new TypeError("createApplicationFactory requires a constructor function.");
  const n = /* @__PURE__ */ a(function(r = {}) {
    const o = foundry.utils.mergeObject(
      t ?? {},
      r ?? {},
      { inplace: !1 }
    );
    return new e(o);
  }, "applicationFactory");
  return n.__eidolonFactorySignature = "options", n.__eidolonFactoryTarget = e, n;
}
a(Mi, "createApplicationFactory");
const Ui = /* @__PURE__ */ new Set();
var Z, fe, Je, pt, vr, Or;
const _i = class _i {
  constructor({ windowFactory: t } = {}) {
    D(this, pt);
    D(this, Z, null);
    D(this, fe, null);
    D(this, Je);
    const n = Mi(ei);
    typeof t == "function" ? t.__eidolonFactorySignature === "options" ? _(this, Je, (r, o = {}) => t({ scene: r, ...o ?? {} })) : _(this, Je, t) : _(this, Je, /* @__PURE__ */ a((r, o = {}) => n({ scene: r, ...o ?? {} }), "fallbackFactory"));
  }
  onReady() {
    var n;
    const t = typeof ((n = game.time) == null ? void 0 : n.worldTime) == "number" && Number.isFinite(game.time.worldTime) ? game.time.worldTime : null;
    T("TimeTriggerManager#onReady", { worldTime: t }), t !== null && _(this, fe, t);
  }
  onCanvasReady(t) {
    const n = (t == null ? void 0 : t.scene) ?? wt();
    T("TimeTriggerManager#onCanvasReady", { sceneId: (n == null ? void 0 : n.id) ?? null }), this.refreshTimeTriggerWindow(n), this.handleTimeTriggerEvaluation(n);
  }
  onUpdateScene(t) {
    const n = wt();
    T("TimeTriggerManager#onUpdateScene", {
      sceneId: (t == null ? void 0 : t.id) ?? null,
      activeSceneId: (n == null ? void 0 : n.id) ?? null
    }), !(!n || t.id !== n.id) && (this.refreshTimeTriggerWindow(t), this.handleTimeTriggerEvaluation(t));
  }
  onUpdateWorldTime(t, n) {
    T("TimeTriggerManager#onUpdateWorldTime", {
      worldTime: t,
      diff: n,
      hasWindow: !!p(this, Z)
    }), p(this, Z) && p(this, Z).render();
    const i = wt(), r = E(this, pt, vr).call(this, t, n);
    this.handleTimeTriggerEvaluation(i, t, r);
  }
  refreshTimeTriggerWindow(t) {
    var c, u, d;
    if (!t) return;
    const n = !!((c = game.user) != null && c.isGM), i = !!t.getFlag(v, Kt), r = !!t.getFlag(v, xn), o = !!t.getFlag(v, jn);
    if (T("TimeTriggerManager#refreshTimeTriggerWindow", {
      sceneId: t.id,
      isGM: n,
      isActive: i,
      hideWindow: r,
      showPlayerWindow: o
    }), !(i && !r && (n || o))) {
      p(this, Z) && (T("Closing time trigger window", { reason: "not-visible" }), p(this, Z).close({ force: !0 }), _(this, Z, null));
      return;
    }
    const l = !!n;
    if (p(this, Z) && ((u = p(this, Z).scene) == null ? void 0 : u.id) === t.id) {
      T("Refreshing existing time trigger window", { sceneId: t.id }), p(this, Z).showControls = l, p(this, Z).render();
      return;
    }
    p(this, Z) && (T("Closing existing window before creating new instance", {
      previousSceneId: ((d = p(this, Z).scene) == null ? void 0 : d.id) ?? null
    }), p(this, Z).close({ force: !0 })), _(this, Z, p(this, Je).call(this, t, { showControls: l })), T("Rendering new time trigger window", { sceneId: t.id }), p(this, Z).render({ force: !0 });
  }
  async handleTimeTriggerEvaluation(t, n, i) {
    var c;
    const r = t ?? wt();
    if (!r) {
      T("handleTimeTriggerEvaluation skipped", {
        reason: "no-active-scene",
        providedSceneId: (t == null ? void 0 : t.id) ?? null,
        currentWorldTime: n
      }), typeof n == "number" && Number.isFinite(n) && _(this, fe, n);
      return;
    }
    const o = typeof n == "number" && Number.isFinite(n) ? n : typeof ((c = game.time) == null ? void 0 : c.worldTime) == "number" ? game.time.worldTime : null;
    if (o === null) return;
    const s = typeof i == "number" && Number.isFinite(i) ? i : null, l = s !== null ? s : typeof p(this, fe) == "number" && Number.isFinite(p(this, fe)) ? p(this, fe) : o;
    Tt("handleTimeTriggerEvaluation", {
      sceneId: r.id,
      previousWorldTime: l,
      currentWorldTime: o,
      overrideProvided: s !== null
    });
    try {
      await E(this, pt, Or).call(this, r, l, o);
    } catch (u) {
      console.error(`${v} | Unexpected error while evaluating time triggers`, u), T("handleTimeTriggerEvaluation error", { message: (u == null ? void 0 : u.message) ?? String(u) });
    } finally {
      _(this, fe, o), Ue();
    }
  }
};
Z = new WeakMap(), fe = new WeakMap(), Je = new WeakMap(), pt = new WeakSet(), vr = /* @__PURE__ */ a(function(t, n) {
  return typeof p(this, fe) == "number" && Number.isFinite(p(this, fe)) ? (T("Resolved previous world time from cache", {
    previousWorldTime: p(this, fe)
  }), p(this, fe)) : typeof t == "number" && Number.isFinite(t) && typeof n == "number" && Number.isFinite(n) ? (T("Resolved previous world time using diff", {
    worldTime: t,
    diff: n,
    resolved: t - n
  }), t - n) : typeof t == "number" && Number.isFinite(t) ? t : null;
}, "#resolvePreviousWorldTime"), Or = /* @__PURE__ */ a(async function(t, n, i) {
  var h, O, I;
  if (!((h = game.user) != null && h.isGM)) {
    T("Skipping trigger evaluation because user is not a GM");
    return;
  }
  if (!(t != null && t.id)) {
    T("Skipping trigger evaluation because the scene is missing an id");
    return;
  }
  if (!!!t.getFlag(v, Kt)) {
    T("Skipping trigger evaluation because scene is inactive", { sceneId: t.id });
    return;
  }
  if (typeof i != "number" || !Number.isFinite(i)) return;
  (typeof n != "number" || !Number.isFinite(n)) && (n = i);
  const o = ft(t);
  if (!o.length) {
    T("No time triggers configured for scene", { sceneId: t.id });
    return;
  }
  const s = mo(t), l = /* @__PURE__ */ new Set();
  for (const b of o)
    b != null && b.id && l.add(b.id);
  let c = !1;
  for (const b of Object.keys(s))
    l.has(b) || (delete s[b], c = !0);
  if (Tt("Evaluating scene time triggers", {
    sceneId: t.id,
    previousWorldTime: n,
    currentWorldTime: i,
    triggerCount: o.length
  }), i <= n) {
    T("Detected world time rewind", {
      previousWorldTime: n,
      currentWorldTime: i
    });
    for (const b of o) {
      if (!(b != null && b.id) || !b.allowReplayOnRewind) continue;
      const C = s[b.id];
      typeof C == "number" ? i < C ? (T("Clearing trigger history due to rewind", {
        triggerId: b.id,
        lastFired: C,
        currentWorldTime: i
      }), delete s[b.id], c = !0) : T("Preserving trigger history after rewind", {
        triggerId: b.id,
        lastFired: C,
        currentWorldTime: i
      }) : T("No history stored for rewind-enabled trigger", {
        triggerId: b.id
      });
    }
    c && (T("Persisting history cleanup after rewind", {
      sceneId: t.id
    }), await Un(t, s)), Ue();
    return;
  }
  const u = n, d = i, m = [], g = Math.floor(u / dt), y = Math.floor(d / dt);
  for (const b of o) {
    if (!(b != null && b.id)) continue;
    const C = or(b.time);
    if (C === null) {
      wo(t, b), T("Skipping trigger with invalid time", {
        triggerId: b.id,
        time: b.time
      });
      continue;
    }
    for (let N = g; N <= y; N++) {
      const P = N * dt + C;
      if (P < u || P > d) continue;
      const L = s[b.id];
      if (typeof L == "number" && L >= P) {
        T("Skipping trigger because it already fired within window", {
          triggerId: b.id,
          lastFired: L,
          absoluteTime: P
        });
        continue;
      }
      m.push({ trigger: b, absoluteTime: P });
    }
  }
  if (!m.length) {
    c && await Un(t, s), T("No triggers scheduled to fire within evaluation window", {
      sceneId: t.id
    }), Ue();
    return;
  }
  m.sort((b, C) => b.absoluteTime - C.absoluteTime), T("Queued triggers for execution", {
    entries: m.map((b) => ({
      triggerId: b.trigger.id,
      absoluteTime: b.absoluteTime
    }))
  });
  for (const b of m)
    try {
      T("Executing time trigger action", {
        triggerId: b.trigger.id,
        absoluteTime: b.absoluteTime
      }), await fr(t, b.trigger);
    } catch (C) {
      console.error(`${v} | Failed to execute time trigger action`, C), (I = (O = ui.notifications) == null ? void 0 : O.error) == null || I.call(
        O,
        f(
          "EIDOLON.TimeTrigger.TriggerActionError",
          "Failed to execute a scene time trigger action. Check the console for details."
        )
      ), T("Trigger execution failed", {
        triggerId: b.trigger.id,
        message: (C == null ? void 0 : C.message) ?? String(C)
      });
    } finally {
      s[b.trigger.id] = b.absoluteTime, c = !0, T("Recorded trigger execution", {
        triggerId: b.trigger.id,
        absoluteTime: b.absoluteTime
      });
    }
  c && (T("Persisting trigger history updates", { sceneId: t.id }), await Un(t, s)), Ue();
}, "#evaluateSceneTimeTriggers"), a(_i, "TimeTriggerManager");
let ai = _i;
function wo(e, t) {
  var r, o;
  const n = `${(e == null ? void 0 : e.id) ?? "unknown"}:${(t == null ? void 0 : t.id) ?? (t == null ? void 0 : t.time) ?? "unknown"}`;
  if (Ui.has(n)) return;
  Ui.add(n);
  const i = f(
    "EIDOLON.TimeTrigger.InvalidTimeWarning",
    "A scene time trigger has an invalid time value and was skipped."
  );
  (o = (r = ui.notifications) == null ? void 0 : r.warn) == null || o.call(r, i), console.warn(`${v} | Invalid time for trigger`, { scene: e == null ? void 0 : e.id, trigger: t });
}
a(wo, "warnInvalidTriggerTime");
var pe, Nt, ve, ke, Qe, Se, yt, gn, mn, At, Dt, Xe, we, A, ci, ut, qt, di, Bt, fi, Le, Ir, gi, Er, mi, Lr, hn, yn, Tn, bn, pn, vn, hi, Sr, Gt, On, In;
const Fi = class Fi {
  constructor() {
    D(this, A);
    D(this, pe, !1);
    D(this, Nt, Ft);
    D(this, ve, /* @__PURE__ */ new Map());
    D(this, ke, null);
    D(this, Qe, null);
    D(this, Se, 0);
    D(this, yt, null);
    D(this, gn, null);
    D(this, mn, null);
    D(this, At, !1);
    D(this, Dt, !1);
    D(this, Xe, !1);
    D(this, we, !1);
    D(this, hn, /* @__PURE__ */ a((t, n = {}) => {
      T("GameTimeAutomation | Pause state changed", {
        paused: t,
        userId: (n == null ? void 0 : n.userId) ?? null,
        broadcast: (n == null ? void 0 : n.broadcast) ?? null
      }), E(this, A, Le).call(this, { pausedOverride: t });
    }, "#handlePause"));
    D(this, yn, /* @__PURE__ */ a((t) => {
      t != null && t.id && (p(this, ve).set(t.id, Math.max(t.round ?? 0, 1)), T("GameTimeAutomation | Combat started", { combatId: t.id, round: t.round ?? 0 }), E(this, A, Le).call(this));
    }, "#handleCombatStart"));
    D(this, Tn, /* @__PURE__ */ a((t, n) => {
      if (!(t != null && t.id)) return;
      const i = typeof n == "number" && Number.isFinite(n) ? n : typeof t.round == "number" && Number.isFinite(t.round) ? t.round : 0, r = i > 0 ? i : 1, o = p(this, ve).get(t.id), s = o ? Math.max(o, 1) : 1, l = r > 1 ? Math.max(r - s, 0) : 0;
      if (T("GameTimeAutomation | Combat round change detected", {
        combatId: t.id,
        effectiveRound: r,
        completedRounds: l,
        enabled: p(this, pe),
        paused: (game == null ? void 0 : game.paused) ?? null
      }), l > 0 && p(this, pe) && p(this, we) && !(game != null && game.paused) && E(this, A, ut).call(this) && E(this, A, qt).call(this, t)) {
        const c = l * p(this, Nt);
        c > 0 && (T("GameTimeAutomation | Advancing time for completed combat rounds", {
          combatId: t.id,
          completedRounds: l,
          delta: c
        }), E(this, A, mi).call(this, c));
      }
      p(this, ve).set(t.id, Math.max(r, 1));
    }, "#handleCombatRound"));
    D(this, bn, /* @__PURE__ */ a((t) => {
      t != null && t.id && (p(this, ve).delete(t.id), T("GameTimeAutomation | Combat ended", { combatId: t.id }), E(this, A, Le).call(this));
    }, "#handleCombatEnd"));
    D(this, pn, /* @__PURE__ */ a((t) => {
      t != null && t.id && (p(this, ve).delete(t.id), T("GameTimeAutomation | Combat deleted", { combatId: t.id }), E(this, A, Le).call(this));
    }, "#handleCombatDelete"));
    D(this, vn, /* @__PURE__ */ a((t, n) => {
      if (t != null && t.id) {
        if (typeof (n == null ? void 0 : n.round) == "number" && Number.isFinite(n.round)) {
          const i = Math.max(n.round, 1);
          p(this, ve).set(t.id, i), T("GameTimeAutomation | Combat round manually updated", {
            combatId: t.id,
            round: i
          });
        }
        (Object.prototype.hasOwnProperty.call(n ?? {}, "active") || (n == null ? void 0 : n.round) !== void 0) && E(this, A, Le).call(this);
      }
    }, "#handleCombatUpdate"));
    D(this, On, /* @__PURE__ */ a((t) => {
      E(this, A, Gt).call(this, t == null ? void 0 : t.scene), E(this, A, Le).call(this);
    }, "#handleCanvasReady"));
    D(this, In, /* @__PURE__ */ a((t) => {
      if (!le(t)) return;
      const n = E(this, A, hi).call(this);
      if (!n || n.id !== t.id) return;
      E(this, A, Gt).call(this, t) && E(this, A, Le).call(this);
    }, "#handleSceneUpdate"));
  }
  registerHooks() {
    p(this, At) || (_(this, At, !0), Hooks.on("pauseGame", p(this, hn)), Hooks.on("combatStart", p(this, yn)), Hooks.on("combatRound", p(this, Tn)), Hooks.on("combatEnd", p(this, bn)), Hooks.on("deleteCombat", p(this, pn)), Hooks.on("updateCombat", p(this, vn)), Hooks.on("canvasReady", p(this, On)), Hooks.on("updateScene", p(this, In)));
  }
  initialize() {
    p(this, Dt) || (_(this, Dt, !0), _(this, gn, lr((t) => {
      const n = !!t, i = n !== p(this, pe);
      _(this, pe, n), T("GameTimeAutomation | Manage time toggled", { enabled: n }), i && n && E(this, A, fi).call(this), E(this, A, Le).call(this);
    })), _(this, mn, uo((t) => {
      _(this, Nt, t), T("GameTimeAutomation | Seconds per round updated", { value: t });
    })), E(this, A, fi).call(this), E(this, A, Gt).call(this), E(this, A, Le).call(this));
  }
};
pe = new WeakMap(), Nt = new WeakMap(), ve = new WeakMap(), ke = new WeakMap(), Qe = new WeakMap(), Se = new WeakMap(), yt = new WeakMap(), gn = new WeakMap(), mn = new WeakMap(), At = new WeakMap(), Dt = new WeakMap(), Xe = new WeakMap(), we = new WeakMap(), A = new WeakSet(), ci = /* @__PURE__ */ a(function() {
  var t;
  try {
    if (typeof ((t = globalThis.performance) == null ? void 0 : t.now) == "function")
      return globalThis.performance.now();
  } catch (n) {
    T("GameTimeAutomation | Failed to read high-resolution timestamp", {
      message: (n == null ? void 0 : n.message) ?? String(n)
    });
  }
  return Date.now();
}, "#currentTimestamp"), ut = /* @__PURE__ */ a(function() {
  var t;
  return !!((t = game == null ? void 0 : game.user) != null && t.isGM && game.user.active !== !1);
}, "#canControlTime"), qt = /* @__PURE__ */ a(function(t) {
  var i, r;
  if (!t) return !1;
  if (t.active === !0) return !0;
  if (t.active === !1) return !1;
  const n = (i = game == null ? void 0 : game.combats) == null ? void 0 : i.active;
  return (n == null ? void 0 : n.id) === t.id ? !0 : ((r = game == null ? void 0 : game.combat) == null ? void 0 : r.id) === t.id ? game.combat.active ?? !0 : !1;
}, "#isCombatDocumentActive"), di = /* @__PURE__ */ a(function(t) {
  return t ? typeof t.started == "boolean" ? t.started : (t.round ?? 0) > 0 : !1;
}, "#hasCombatStarted"), Bt = /* @__PURE__ */ a(function() {
  var i;
  const t = Array.isArray((i = game == null ? void 0 : game.combats) == null ? void 0 : i.contents) ? game.combats.contents : [];
  for (const r of t)
    if (E(this, A, qt).call(this, r) && E(this, A, di).call(this, r))
      return !0;
  const n = game == null ? void 0 : game.combat;
  return !!(n && E(this, A, qt).call(this, n) && E(this, A, di).call(this, n));
}, "#isCombatRunning"), fi = /* @__PURE__ */ a(function() {
  var n;
  p(this, ve).clear();
  const t = Array.isArray((n = game == null ? void 0 : game.combats) == null ? void 0 : n.contents) ? game.combats.contents : [];
  for (const i of t)
    i != null && i.id && p(this, ve).set(i.id, Math.max(i.round ?? 0, 1));
}, "#hydrateRoundTracking"), Le = /* @__PURE__ */ a(function({ pausedOverride: t } = {}) {
  const n = typeof t == "boolean" ? t : !!(game != null && game.paused), i = p(this, pe), r = p(this, we), o = i && r, s = {
    manageTimeEnabled: i,
    sceneAllowsRealTime: r,
    effectiveEnabled: o,
    paused: n,
    canControl: E(this, A, ut).call(this),
    combatRunning: E(this, A, Bt).call(this),
    overrideApplied: typeof t == "boolean"
  };
  if (T("GameTimeAutomation | Sync running state", s), !o || !E(this, A, ut).call(this)) {
    E(this, A, gi).call(this);
    return;
  }
  E(this, A, Ir).call(this);
}, "#syncRunningState"), Ir = /* @__PURE__ */ a(function() {
  p(this, ke) === null && (_(this, Qe, E(this, A, ci).call(this)), _(this, ke, globalThis.setInterval(() => E(this, A, Er).call(this), 1e3)), T("GameTimeAutomation | Started real-time ticker"));
}, "#startRealTimeTicker"), gi = /* @__PURE__ */ a(function() {
  p(this, ke) !== null && (globalThis.clearInterval(p(this, ke)), _(this, ke, null), T("GameTimeAutomation | Stopped real-time ticker")), _(this, Qe, null), _(this, Se, 0), _(this, Xe, !1);
}, "#stopRealTimeTicker"), Er = /* @__PURE__ */ a(function() {
  if (!p(this, pe) || !p(this, we) || !E(this, A, ut).call(this)) {
    E(this, A, gi).call(this);
    return;
  }
  const t = E(this, A, ci).call(this);
  if (typeof t != "number" || !Number.isFinite(t)) return;
  const n = p(this, Qe) ?? t, i = (t - n) / 1e3;
  if (_(this, Qe, t), !Number.isFinite(i) || i <= 0) return;
  const r = !!(game != null && game.paused), o = E(this, A, Bt).call(this);
  if (r || o) {
    p(this, Xe) || T("GameTimeAutomation | Tick skipped", { paused: r, combatRunning: o }), _(this, Xe, !0), _(this, Se, 0);
    return;
  }
  _(this, Xe, !1), T("GameTimeAutomation | Real-time tick", { deltaSeconds: i }), E(this, A, mi).call(this, i);
}, "#tickRealTime"), mi = /* @__PURE__ */ a(function(t) {
  if (!p(this, pe) || !p(this, we)) return;
  const n = Number(t);
  !Number.isFinite(n) || n <= 0 || (_(this, Se, p(this, Se) + n), !p(this, yt) && _(this, yt, E(this, A, Lr).call(this)));
}, "#queueAdvance"), Lr = /* @__PURE__ */ a(async function() {
  var t, n;
  for (; p(this, Se) > 0; ) {
    if (!p(this, pe) || !p(this, we) || game != null && game.paused || !E(this, A, ut).call(this) || E(this, A, Bt).call(this)) {
      _(this, Se, 0);
      break;
    }
    const i = p(this, Se);
    _(this, Se, 0);
    try {
      if (typeof ((t = game == null ? void 0 : game.time) == null ? void 0 : t.advance) == "function")
        T("GameTimeAutomation | Advancing world time", { delta: i }), await game.time.advance(i), T("GameTimeAutomation | World time advanced", {
          worldTime: ((n = game.time) == null ? void 0 : n.worldTime) ?? null
        });
      else {
        console.warn(`${v} | game.time.advance is unavailable; cannot manage world time.`);
        break;
      }
    } catch (r) {
      console.error(`${v} | Failed to advance world time`, r);
      break;
    }
  }
  _(this, yt, null);
}, "#flushAdvanceQueue"), hn = new WeakMap(), yn = new WeakMap(), Tn = new WeakMap(), bn = new WeakMap(), pn = new WeakMap(), vn = new WeakMap(), hi = /* @__PURE__ */ a(function() {
  const t = wt();
  return le(t) ? t : null;
}, "#getActiveSceneDocument"), Sr = /* @__PURE__ */ a(function(t) {
  if (!le(t)) return !1;
  try {
    return !!t.getFlag(v, qn);
  } catch (n) {
    return T("GameTimeAutomation | Failed to read scene real-time flag", {
      sceneId: (t == null ? void 0 : t.id) ?? null,
      message: (n == null ? void 0 : n.message) ?? String(n)
    }), !1;
  }
}, "#isSceneRealTimeAllowed"), Gt = /* @__PURE__ */ a(function(t) {
  const n = le(t) ? t : E(this, A, hi).call(this), i = E(this, A, Sr).call(this, n), r = p(this, we);
  return _(this, we, i), r !== i ? (T("GameTimeAutomation | Scene real-time allowance changed", {
    sceneId: (n == null ? void 0 : n.id) ?? null,
    allows: i
  }), !0) : !1;
}, "#refreshSceneAutomationState"), On = new WeakMap(), In = new WeakMap(), a(Fi, "GameTimeAutomation");
let li = Fi;
var nr, Ve, ae, Ze, Pe, En, X, wr, Cr, Mr, Nr, Ln, Ti, Sn, Ar, wn, Dr, _r;
const _e = class _e extends Dn(An) {
  constructor(n = {}) {
    const { scene: i, trigger: r, triggerIndex: o, onSave: s, ...l } = n ?? {};
    super(l);
    D(this, X);
    D(this, Ve, null);
    D(this, ae, null);
    D(this, Ze, null);
    D(this, Pe, null);
    D(this, En, /* @__PURE__ */ a(() => {
      (this.rendered ?? this.isRendered ?? !1) && (_(this, Pe, E(this, X, wr).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    D(this, Ln, /* @__PURE__ */ a((n) => {
      var o, s;
      const i = n.currentTarget, r = i == null ? void 0 : i.closest("form");
      r && (T("Trigger action selection changed", {
        sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
        triggerId: ((s = this.trigger) == null ? void 0 : s.id) ?? null,
        actionId: (i == null ? void 0 : i.value) ?? null
      }), E(this, X, Ti).call(this, i.value, r));
    }, "#onActionSelectChange"));
    D(this, Sn, /* @__PURE__ */ a((n) => {
      var u, d, m, g;
      n.preventDefault();
      const i = n.currentTarget, r = i == null ? void 0 : i.closest("form");
      if (!r) return;
      const o = (u = i.dataset) == null ? void 0 : u.target;
      if (!o) return;
      const s = typeof (CSS == null ? void 0 : CSS.escape) == "function" ? CSS.escape : (y) => y, l = r.querySelector(`[name="${s(o)}"]`);
      if (!l) return;
      T("Opening file picker for trigger", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        triggerId: ((m = this.trigger) == null ? void 0 : m.id) ?? null,
        target: o
      }), new FilePicker({
        type: ((g = i.dataset) == null ? void 0 : g.type) || "audio",
        current: l.value,
        callback: /* @__PURE__ */ a((y) => {
          var h, O;
          l.value = y, l.dispatchEvent(new Event("change")), T("Trigger form file selected", {
            sceneId: ((h = this.scene) == null ? void 0 : h.id) ?? null,
            triggerId: ((O = this.trigger) == null ? void 0 : O.id) ?? null,
            target: o,
            path: y
          });
        }, "callback")
      }).render({ force: !0 });
    }, "#onFilePicker"));
    D(this, wn, /* @__PURE__ */ a(async (n) => {
      var r, o;
      n.preventDefault();
      const i = n.currentTarget;
      i instanceof HTMLFormElement && (T("Trigger form submitted", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null,
        triggerId: ((o = this.trigger) == null ? void 0 : o.id) ?? null
      }), await E(this, X, Dr).call(this, i));
    }, "#onSubmit"));
    this.scene = i ?? null, this.trigger = r ?? null, this.triggerIndex = Number.isInteger(o) ? Number(o) : null, this.onSave = typeof s == "function" ? s : null, _(this, Ze, wi(p(this, En)));
  }
  async _prepareContext() {
    var n, i;
    Tt("TriggerFormApplication#_prepareContext", {
      sceneId: ((n = this.scene) == null ? void 0 : n.id) ?? null,
      triggerId: ((i = this.trigger) == null ? void 0 : i.id) ?? null,
      triggerIndex: this.triggerIndex
    });
    try {
      const r = this.trigger ?? { action: jt, data: {} }, o = r.action ?? jt, s = Vi(r.time), l = s.format ?? "12h", c = l === "12h" ? So() : [], u = s.period ?? (c.length > 0 ? c[0].value : null), d = l === "12h" ? c.map((y) => ({
        ...y,
        selected: y.value === u
      })) : [], m = ki().map((y) => ({
        id: y.id,
        label: typeof y.label == "function" ? y.label() : y.label,
        selected: y.id === o
      })), g = ki().map((y) => {
        const h = y.id === r.action ? r : { ...r, action: y.id }, O = bo(h);
        return O ? {
          id: y.id,
          visible: y.id === o,
          content: O
        } : null;
      }).filter(Boolean);
      return {
        timeValue: s.canonical ?? "",
        timeHourValue: s.hour ?? "",
        timeMinuteValue: s.minute ?? "",
        timePeriodValue: u ?? "",
        timeFormat: l,
        is12HourFormat: l === "12h",
        is24HourFormat: l === "24h",
        timePeriodOptions: d,
        actions: m,
        actionSections: g,
        allowReplayOnRewind: !!r.allowReplayOnRewind,
        labels: {
          time: f("EIDOLON.TimeTrigger.TriggerTime", "Trigger Time"),
          hour: f("EIDOLON.TimeTrigger.TriggerTimeHour", "Hour"),
          minute: f("EIDOLON.TimeTrigger.TriggerTimeMinute", "Minute"),
          period: f("EIDOLON.TimeTrigger.TriggerTimePeriod", "AM / PM"),
          action: f("EIDOLON.TimeTrigger.TriggerAction", "Action"),
          allowReplayOnRewind: f(
            "EIDOLON.TimeTrigger.AllowReplayOnRewind",
            "Allow replay after rewinding time"
          ),
          allowReplayOnRewindHint: f(
            "EIDOLON.TimeTrigger.AllowReplayOnRewindHint",
            "When enabled, this trigger can fire again if world time moves backward."
          ),
          save: f("EIDOLON.TimeTrigger.TriggerSave", "Save Trigger")
        }
      };
    } finally {
      Ue();
    }
  }
  _onRender(n, i) {
    var c, u, d;
    super._onRender(n, i);
    const r = this.element;
    if (!r) return;
    T("Trigger form rendered", {
      sceneId: ((c = this.scene) == null ? void 0 : c.id) ?? null,
      triggerId: ((u = this.trigger) == null ? void 0 : u.id) ?? null
    });
    const o = Array.from(((d = document == null ? void 0 : document.body) == null ? void 0 : d.classList) ?? []).find(
      (m) => m.startsWith("theme-")
    );
    o && r.classList.add(o);
    const s = r.querySelector("form");
    if (!s) return;
    E(this, X, Ar).call(this, s), E(this, X, Cr).call(this, s), s.addEventListener("submit", p(this, wn));
    const l = s.querySelector("[data-action-select]");
    l && (l.addEventListener("change", p(this, Ln)), E(this, X, Ti).call(this, l.value, s)), s.querySelectorAll("[data-action-file-picker]").forEach((m) => {
      m.addEventListener("click", p(this, Sn));
    });
  }
  async close(n = {}) {
    var i;
    if ((i = p(this, Ve)) == null || i.call(this), _(this, Ve, null), _(this, ae, null), _(this, Pe, null), typeof p(this, Ze) == "function")
      try {
        p(this, Ze).call(this);
      } catch (r) {
        console.error(`${v} | Failed to dispose trigger form time format subscription`, r);
      }
    return _(this, Ze, null), super.close(n);
  }
};
Ve = new WeakMap(), ae = new WeakMap(), Ze = new WeakMap(), Pe = new WeakMap(), En = new WeakMap(), X = new WeakSet(), wr = /* @__PURE__ */ a(function() {
  var l, c, u, d, m, g, y;
  const n = (c = (l = this.element) == null ? void 0 : l.querySelector) == null ? void 0 : c.call(l, "form");
  if (!(n instanceof HTMLFormElement)) return null;
  const i = Array.from(n.elements ?? []), r = [];
  for (const h of i)
    if ((h instanceof HTMLInputElement || h instanceof HTMLSelectElement || h instanceof HTMLTextAreaElement) && h.name && !(((u = h.dataset) == null ? void 0 : u.timeHidden) !== void 0 || ((d = h.dataset) == null ? void 0 : d.timeHour) !== void 0 || ((m = h.dataset) == null ? void 0 : m.timeMinute) !== void 0 || ((g = h.dataset) == null ? void 0 : g.timePeriod) !== void 0)) {
      if (h instanceof HTMLInputElement) {
        if (h.type === "checkbox" || h.type === "radio") {
          r.push({
            kind: h.type,
            name: h.name,
            value: h.value,
            checked: h.checked
          });
          continue;
        }
        r.push({
          kind: "value",
          name: h.name,
          value: h.value
        });
        continue;
      }
      if (h instanceof HTMLSelectElement) {
        h.multiple ? r.push({
          kind: "select-multiple",
          name: h.name,
          values: Array.from(h.selectedOptions ?? []).map((O) => O.value)
        }) : r.push({
          kind: "value",
          name: h.name,
          value: h.value
        });
        continue;
      }
      r.push({
        kind: "value",
        name: h.name,
        value: h.value
      });
    }
  const o = n.querySelector("[data-time-format]");
  let s = null;
  if (o instanceof HTMLElement) {
    const h = o.querySelector("[data-time-hidden]"), O = o.querySelector("[data-time-hour]"), I = o.querySelector("[data-time-minute]"), b = o.querySelector("[data-time-period]");
    s = {
      format: ((y = o.dataset) == null ? void 0 : y.timeFormat) ?? null,
      canonical: h instanceof HTMLInputElement ? h.value : "",
      hour: O instanceof HTMLInputElement ? O.value : "",
      minute: I instanceof HTMLInputElement ? I.value : "",
      period: b instanceof HTMLSelectElement ? b.value : ""
    };
  }
  return {
    fields: r,
    time: s
  };
}, "#captureFormState"), Cr = /* @__PURE__ */ a(function(n) {
  if (!p(this, Pe)) return;
  if (!(n instanceof HTMLFormElement)) {
    _(this, Pe, null);
    return;
  }
  const { fields: i = [], time: r = null } = p(this, Pe) ?? {};
  _(this, Pe, null), E(this, X, Mr).call(this, n, i), E(this, X, Nr).call(this, n, r);
}, "#restorePendingFormState"), Mr = /* @__PURE__ */ a(function(n, i) {
  if (!Array.isArray(i) || i.length === 0) return;
  const r = typeof (CSS == null ? void 0 : CSS.escape) == "function" ? CSS.escape : (o) => o;
  for (const o of i) {
    if (!o || typeof o.name != "string") continue;
    const s = r(o.name);
    if (o.kind === "checkbox" || o.kind === "radio") {
      const c = `input[type="${o.kind}"][name="${s}"]`, u = n.querySelectorAll(c);
      u.forEach((d) => {
        d instanceof HTMLInputElement && (u.length === 1 || d.value === o.value) && (d.checked = !!o.checked);
      });
      continue;
    }
    if (o.kind === "select-multiple") {
      const c = n.querySelector(`select[name="${s}"]`);
      if (!(c instanceof HTMLSelectElement)) continue;
      const u = new Set(Array.isArray(o.values) ? o.values : []);
      Array.from(c.options ?? []).forEach((d) => {
        d.selected = u.has(d.value);
      });
      continue;
    }
    const l = n.querySelector(`[name="${s}"]`);
    (l instanceof HTMLInputElement || l instanceof HTMLSelectElement || l instanceof HTMLTextAreaElement) && (l.value = o.value ?? "");
  }
}, "#restoreFieldValues"), Nr = /* @__PURE__ */ a(function(n, i) {
  var C, N, P;
  const r = n.querySelector("[data-time-format]");
  if (!(r instanceof HTMLElement)) {
    typeof p(this, ae) == "function" && p(this, ae).call(this);
    return;
  }
  const o = ((C = r.dataset) == null ? void 0 : C.timeFormat) === "24h" ? "24h" : "12h", s = r.querySelector("[data-time-hour]"), l = r.querySelector("[data-time-minute]"), c = r.querySelector("[data-time-period]"), u = r.querySelector("[data-time-hidden]");
  if (!i) {
    if (s instanceof HTMLInputElement && (s.value = ""), l instanceof HTMLInputElement && (l.value = ""), c instanceof HTMLSelectElement) {
      const R = ((P = (N = c.options) == null ? void 0 : N[0]) == null ? void 0 : P.value) ?? "";
      c.value = R;
    }
    u instanceof HTMLInputElement && (u.value = ""), typeof p(this, ae) == "function" && p(this, ae).call(this);
    return;
  }
  const d = typeof i.canonical == "string" ? i.canonical : "", m = typeof i.period == "string" ? i.period : "", g = typeof i.hour == "string" ? i.hour : "", y = typeof i.minute == "string" ? i.minute : "";
  let h = "", O = "", I = m, b = d;
  if (d) {
    const R = Vi(d, o);
    h = R.hour ?? "", O = R.minute ?? "", b = R.canonical ?? d, o === "12h" ? I = R.period ?? m : I = "";
  } else
    h = g, O = y, o !== "12h" && (I = "");
  if (s instanceof HTMLInputElement && (s.value = h ?? ""), l instanceof HTMLInputElement && (l.value = O ?? ""), c instanceof HTMLSelectElement)
    if (o === "12h") {
      const R = Array.from(c.options ?? []);
      R.find((S) => S.value === I) ? c.value = I : R.length > 0 ? c.value = R[0].value : c.value = "";
    } else
      c.value = "";
  u instanceof HTMLInputElement && (u.value = b ?? ""), typeof p(this, ae) == "function" && p(this, ae).call(this);
}, "#restoreTimeInputs"), Ln = new WeakMap(), Ti = /* @__PURE__ */ a(function(n, i) {
  i && i.querySelectorAll("[data-action-config]").forEach((r) => {
    const o = r.dataset.actionConfig === n;
    r.style.display = o ? "" : "none";
  });
}, "#updateActionSections"), Sn = new WeakMap(), Ar = /* @__PURE__ */ a(function(n) {
  var m, g, y, h;
  if ((m = p(this, Ve)) == null || m.call(this), _(this, Ve, null), _(this, ae, null), !(n instanceof HTMLFormElement)) return;
  const i = n.querySelector("[data-time-format]"), r = ((g = i == null ? void 0 : i.dataset) == null ? void 0 : g.timeFormat) ?? null;
  if (r !== "12h" && r !== "24h")
    return;
  const o = i.querySelector("[data-time-hidden]"), s = i.querySelector("[data-time-hour]"), l = i.querySelector("[data-time-minute]"), c = r === "12h" ? i.querySelector("[data-time-period]") : null;
  if (!o || !s || !l || r === "12h" && !c) {
    T("Trigger form time inputs missing elements", {
      format: r,
      hasHidden: !!o,
      hasHour: !!s,
      hasMinute: !!l,
      hasPeriod: !!c
    });
    return;
  }
  const u = [s, l, ...c ? [c] : []], d = /* @__PURE__ */ a(() => {
    const { canonical: O, error: I } = Lo(
      {
        hour: s.value,
        minute: l.value,
        period: (c == null ? void 0 : c.value) ?? null,
        time: o.value
      },
      r
    );
    o.value = O ?? "";
    const b = I ?? "";
    o.setCustomValidity(b), u.forEach((C) => {
      C.setCustomValidity(b);
    });
  }, "update");
  u.forEach((O) => {
    O.addEventListener("input", d), O.addEventListener("change", d);
  }), d(), _(this, Ve, () => {
    u.forEach((O) => {
      O.removeEventListener("input", d), O.removeEventListener("change", d);
    });
  }), _(this, ae, d), T("Trigger form configured for time input", {
    format: r,
    sceneId: ((y = this.scene) == null ? void 0 : y.id) ?? null,
    triggerId: ((h = this.trigger) == null ? void 0 : h.id) ?? null
  });
}, "#setupTimeInput"), wn = new WeakMap(), Dr = /* @__PURE__ */ a(async function(n) {
  var o, s, l, c, u;
  if (typeof p(this, ae) == "function" && p(this, ae).call(this), typeof n.checkValidity == "function" && !n.checkValidity()) {
    typeof n.reportValidity == "function" && n.reportValidity(), T("Trigger form submission blocked by validity check", {
      sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
      triggerId: ((s = this.trigger) == null ? void 0 : s.id) ?? null
    });
    return;
  }
  const i = new FormData(n), r = Object.fromEntries(i.entries());
  delete r.timeHour, delete r.timeMinute, delete r.timePeriod, r.allowReplayOnRewind = ((l = n.querySelector('input[name="allowReplayOnRewind"]')) == null ? void 0 : l.checked) ?? !1, T("Processing trigger form submission", {
    sceneId: ((c = this.scene) == null ? void 0 : c.id) ?? null,
    triggerId: ((u = this.trigger) == null ? void 0 : u.id) ?? null,
    allowReplayOnRewind: r.allowReplayOnRewind
  }), await E(this, X, _r).call(this, r), await this.close();
}, "#handleSubmit"), _r = /* @__PURE__ */ a(async function(n) {
  var o, s, l, c, u, d;
  const i = {
    id: ((o = this.trigger) == null ? void 0 : o.id) ?? ro(),
    time: n.time ?? "",
    action: n.action ?? jt,
    allowReplayOnRewind: !!n.allowReplayOnRewind,
    data: {}
  };
  T("Persisting trigger from form", {
    sceneId: ((s = this.scene) == null ? void 0 : s.id) ?? null,
    triggerId: i.id,
    existingIndex: this.triggerIndex
  }), po(i, n);
  const r = ft(this.scene);
  this.triggerIndex !== null && r[this.triggerIndex] ? r[this.triggerIndex] = i : r.push(i);
  try {
    await dr(this.scene, r), T("Trigger list saved", {
      sceneId: ((l = this.scene) == null ? void 0 : l.id) ?? null,
      triggerCount: r.length
    });
  } catch (m) {
    throw console.error(`${v} | Failed to save time trigger`, m), (u = (c = ui.notifications) == null ? void 0 : c.error) == null || u.call(
      c,
      f(
        "EIDOLON.TimeTrigger.TriggerSaveError",
        "Failed to save the scene's time triggers."
      )
    ), m;
  }
  if (this.onSave)
    try {
      this.onSave(r);
    } catch (m) {
      console.error(`${v} | Trigger onSave callback failed`, m), T("Trigger onSave callback failed", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        message: (m == null ? void 0 : m.message) ?? String(m)
      });
    }
}, "#persistTrigger"), a(_e, "TriggerFormApplication"), ze(_e, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  lt(_e, _e, "DEFAULT_OPTIONS"),
  {
    id: `${v}-trigger-form`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((nr = lt(_e, _e, "DEFAULT_OPTIONS")) == null ? void 0 : nr.classes) ?? [], "standard-form", "themed"])
    ),
    window: {
      title: f("EIDOLON.TimeTrigger.TriggerFormTitle", "Configure Time Trigger"),
      resizable: !1
    },
    position: {
      width: 400,
      height: "auto"
    }
  },
  { inplace: !1 }
)), ze(_e, "PARTS", {
  content: {
    template: `modules/${v}/templates/time-trigger-form.html`
  }
});
let yi = _e;
const xi = Symbol("EIDOLON_SCENE_CONFIG_TAB_GROUP_PATCH");
function Fr(e = {}) {
  const {
    tabId: t,
    tabLabel: n,
    getScene: i,
    isApplicable: r,
    renderContent: o,
    debugNamespace: s = "SceneConfigTab",
    onButtonCreate: l,
    onTabCreate: c,
    onAfterRender: u,
    logger: d = {}
  } = e ?? {};
  if (!t)
    throw new Error("createSceneConfigTabFactory requires a tabId.");
  if (typeof o != "function")
    throw new TypeError("createSceneConfigTabFactory requires a renderContent callback.");
  const m = typeof d.log == "function" ? d.log.bind(d) : (...L) => {
    var S;
    return (S = console.debug) == null ? void 0 : S.call(console, `${s}`, ...L);
  }, g = typeof d.group == "function" ? d.group.bind(d) : (...L) => {
    var S;
    return (S = console.groupCollapsed) == null ? void 0 : S.call(console, `${s}`, ...L);
  }, y = typeof d.groupEnd == "function" ? d.groupEnd.bind(d) : () => {
    var L;
    return (L = console.groupEnd) == null ? void 0 : L.call(console);
  }, h = Symbol(`EIDOLON_SCENE_CONFIG_TAB_CLEANUP_${t}`), O = typeof i == "function" ? i : () => null, I = typeof r == "function" ? r : () => !0, b = typeof n == "function" ? n : () => typeof n == "string" ? n : t;
  function C(L, S) {
    var W, K, be, oe, he, se, J, w, Ot, V, qe, ot, Be, Ge, It, M, F, j, x, q, B, G, ce, ee, ue, Re, ye;
    const $ = O(L);
    if (!I(L, $)) {
      m("Skipped render", {
        tabId: t,
        reason: "inapplicable",
        constructor: ((W = L == null ? void 0 : L.constructor) == null ? void 0 : W.name) ?? null
      });
      return;
    }
    g("render", {
      tabId: t,
      sceneId: ($ == null ? void 0 : $.id) ?? null,
      constructor: ((K = L == null ? void 0 : L.constructor) == null ? void 0 : K.name) ?? null
    });
    try {
      const de = S instanceof HTMLElement ? S : (S == null ? void 0 : S[0]) instanceof HTMLElement ? S[0] : ((be = L.element) == null ? void 0 : be[0]) instanceof HTMLElement ? L.element[0] : null;
      if (!de) {
        m("Missing root element", { tabId: t });
        return;
      }
      const k = [
        "nav.sheet-tabs[data-group]",
        "nav.tabs[data-group]",
        "nav.sheet-tabs",
        "nav.tabs"
      ].map((U) => de.querySelector(U)).find((U) => U instanceof HTMLElement), te = [
        (oe = de.querySelector(".tab[data-tab]")) == null ? void 0 : oe.parentElement,
        de.querySelector(".sheet-body"),
        (se = (he = k == null ? void 0 : k.parentElement) == null ? void 0 : he.querySelector) == null ? void 0 : se.call(he, ":scope > .sheet-body"),
        k == null ? void 0 : k.parentElement
      ].find((U) => U instanceof HTMLElement), ie = ((J = k == null ? void 0 : k.dataset) == null ? void 0 : J.group) ?? ((V = (Ot = (w = k == null ? void 0 : k.querySelector) == null ? void 0 : w.call(k, "a[data-group]")) == null ? void 0 : Ot.dataset) == null ? void 0 : V.group) ?? ((Be = (ot = (qe = k == null ? void 0 : k.querySelector) == null ? void 0 : qe.call(k, "[data-group]")) == null ? void 0 : ot.dataset) == null ? void 0 : Be.group) ?? ((M = (It = (Ge = te == null ? void 0 : te.querySelector) == null ? void 0 : Ge.call(te, ".tab[data-group]")) == null ? void 0 : It.dataset) == null ? void 0 : M.group) ?? ((x = (j = (F = L._tabs) == null ? void 0 : F.find) == null ? void 0 : j.call(F, (U) => U == null ? void 0 : U.group)) == null ? void 0 : x.group) ?? Ao(L) ?? "main";
      if (!k || !te) {
        m("Missing navigation elements", {
          tabId: t,
          hasNav: !!k,
          hasBody: !!te
        });
        return;
      }
      let z = k.querySelector(`[data-tab="${t}"]`);
      if (!z) {
        z = document.createElement("a"), z.dataset.action = "tab", z.dataset.group = ie, z.dataset.tab = t;
        const U = k.querySelector("a[data-tab]");
        (q = U == null ? void 0 : U.classList) != null && q.contains("item") && z.classList.add("item"), k.appendChild(z), typeof l == "function" && l({ app: L, button: z, nav: k, scene: $ }), m("Created tab button", { tabId: t, group: ie });
      }
      z.innerHTML = b({ app: L, scene: $ }) ?? t;
      let Y = te.querySelector(`.tab[data-tab="${t}"]`);
      if (!Y) {
        Y = document.createElement("div"), Y.classList.add("tab"), Y.dataset.tab = t, Y.dataset.group = ie;
        const U = Do(te);
        te.insertBefore(Y, U ?? null), typeof c == "function" && c({ app: L, tab: Y, body: te, scene: $ }), m("Created tab container", { tabId: t, group: ie });
      }
      ((B = z.classList) == null ? void 0 : B.contains("active")) || Y.classList.contains("active") || qi(L, ie) === t ? (z.classList.add("active"), Y.classList.add("active"), Y.removeAttribute("hidden")) : (z.classList.remove("active"), Y.classList.remove("active"), Y.setAttribute("hidden", "true"));
      const Ne = /* @__PURE__ */ a(() => {
        var ne, Lt;
        (qi(L, ie) === t || (ne = z.classList) != null && ne.contains("active") || Y.classList.contains("active")) && ((Lt = z.classList) == null || Lt.add("active"), Y.classList.add("active"), Y.removeAttribute("hidden"), Y.removeAttribute("aria-hidden"), Y.style.display === "none" && (Y.style.display = ""));
      }, "ensureTabVisible"), Q = /* @__PURE__ */ a(() => {
        try {
          Ne();
        } catch (ne) {
          m("Ensure visible failed", {
            reason: "ensure-visible",
            message: (ne == null ? void 0 : ne.message) ?? String(ne)
          });
        }
        const U = /* @__PURE__ */ a(() => {
          try {
            Ne();
          } catch (ne) {
            m("Ensure visible rerun failed", {
              reason: "ensure-visible-rerun",
              message: (ne == null ? void 0 : ne.message) ?? String(ne)
            });
          }
        }, "rerun");
        (typeof queueMicrotask == "function" ? queueMicrotask : (ne) => Promise.resolve().then(ne))(U), setTimeout(U, 0);
      }, "scheduleEnsureTabVisible");
      z.dataset.eidolonEnsureSceneTabVisibility || (z.addEventListener("click", Q), z.dataset.eidolonEnsureSceneTabVisibility = "true");
      const Te = Pr(L, ie), Ie = S instanceof HTMLElement ? S : (S == null ? void 0 : S[0]) instanceof HTMLElement ? S[0] : de, Ae = typeof (S == null ? void 0 : S.find) == "function" ? S : typeof ((G = L == null ? void 0 : L.element) == null ? void 0 : G.find) == "function" ? L.element : typeof (globalThis == null ? void 0 : globalThis.jQuery) == "function" && Ie ? globalThis.jQuery(Ie) : null;
      if ((ce = Te == null ? void 0 : Te.controller) != null && ce.bind) {
        Mo(Te.controller, Ne, m);
        const U = Ie ?? (Ae == null ? void 0 : Ae[0]) ?? de;
        U instanceof HTMLElement && Te.controller.bind(U), Q();
      } else {
        const U = ((ue = (ee = L._tabs) == null ? void 0 : ee.find) == null ? void 0 : ue.call(ee, (Ee) => (Ee == null ? void 0 : Ee.group) === ie)) ?? ((Re = L._tabs) == null ? void 0 : Re[0]);
        if (No(U, Ne, m), U != null && U.bind) {
          const Ee = Ie ?? (Ae == null ? void 0 : Ae[0]) ?? de, ne = Ee && typeof (globalThis == null ? void 0 : globalThis.jQuery) == "function" ? globalThis.jQuery(Ee) : Ae, Lt = /* @__PURE__ */ a((Pn) => {
            if (!Pn) return !1;
            try {
              return U.bind(Pn), !0;
            } catch (Ht) {
              return m("Legacy tab bind failed", {
                reason: "bind-target",
                targetType: Pn instanceof HTMLElement ? "element" : "other",
                message: (Ht == null ? void 0 : Ht.message) ?? String(Ht)
              }), !1;
            }
          }, "tryBind");
          Lt(Ee) || Lt(ne ?? Ee);
        }
        Q();
      }
      ji(L, h, m);
      const at = o({
        app: L,
        scene: $,
        tab: Y,
        tabButton: z,
        ensureTabVisible: Ne,
        scheduleEnsureTabVisible: Q
      });
      typeof at == "function" && Co(L, h, at), typeof u == "function" && u({
        app: L,
        scene: $,
        tab: Y,
        tabButton: z,
        ensureTabVisible: Ne,
        scheduleEnsureTabVisible: Q
      }), (ye = L.setPosition) == null || ye.call(L, { height: "auto" });
    } finally {
      y();
    }
  }
  a(C, "handleRender");
  function N(L) {
    ji(L, h, m);
  }
  a(N, "handleClose");
  function P() {
    return Hooks.on("renderSceneConfig", C), Hooks.on("closeSceneConfig", N), () => R();
  }
  a(P, "register");
  function R() {
    Hooks.off("renderSceneConfig", C), Hooks.off("closeSceneConfig", N);
  }
  return a(R, "unregister"), { register: P, unregister: R };
}
a(Fr, "createSceneConfigTabFactory");
function Co(e, t, n) {
  if (!e || typeof n != "function") return;
  const i = e == null ? void 0 : e[t];
  Array.isArray(i) || (e[t] = []), e[t].push(n);
}
a(Co, "registerCleanup");
function ji(e, t, n) {
  if (!e) return;
  const i = e == null ? void 0 : e[t];
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
a(ji, "invokeCleanup");
function Mo(e, t, n = () => {
}) {
  if (!e || typeof t != "function") return;
  if (typeof e.on == "function") {
    const s = e[xi] ?? {};
    s.ensure = t, s.listener || (s.listener = () => {
      var l;
      try {
        (l = s.ensure) == null || l.call(s);
      } catch (c) {
        n("Tab group activation failed", {
          reason: "tab-group-event",
          message: (c == null ? void 0 : c.message) ?? String(c)
        });
      }
    }, e.on("activate", s.listener)), e[xi] = s;
  }
  const i = e.callbacks ?? (e.callbacks = {}), r = i.activate;
  if (typeof r == "function" && r.__eidolonSceneTabPatch) {
    r.__eidolonEnsureVisible = t;
    return;
  }
  const o = /* @__PURE__ */ a(function(...s) {
    var l;
    try {
      (l = o.__eidolonEnsureVisible) == null || l.call(o);
    } catch (c) {
      n("Tab group ensure visible failed", {
        reason: "tab-group-activate",
        message: (c == null ? void 0 : c.message) ?? String(c)
      });
    }
    if (typeof o.__eidolonOriginal == "function")
      return o.__eidolonOriginal.apply(this, s);
  }, "patchedActivate");
  o.__eidolonSceneTabPatch = !0, o.__eidolonOriginal = typeof r == "function" ? r : null, o.__eidolonEnsureVisible = t, i.activate = o;
}
a(Mo, "patchTabGroupActivate");
function No(e, t, n = () => {
}) {
  if (!e || typeof t != "function") return;
  const i = e.callback;
  if (typeof i == "function" && i.__eidolonSceneTabPatch) {
    i.__eidolonEnsureVisible = t;
    return;
  }
  const r = /* @__PURE__ */ a(function(...o) {
    var s;
    try {
      (s = r.__eidolonEnsureVisible) == null || s.call(r);
    } catch (l) {
      n("Legacy tabs ensure visible failed", {
        reason: "legacy-tabs-activate",
        message: (l == null ? void 0 : l.message) ?? String(l)
      });
    }
    if (typeof r.__eidolonOriginal == "function")
      return r.__eidolonOriginal.apply(this, o);
  }, "patchedCallback");
  r.__eidolonSceneTabPatch = !0, r.__eidolonOriginal = typeof i == "function" ? i : null, r.__eidolonEnsureVisible = t, e.callback = r;
}
a(No, "patchLegacyTabsActivate");
function Pr(e, t) {
  const n = { controller: null, active: null };
  if (!e) return n;
  const i = e.tabGroups;
  if (!i) return n;
  const r = /* @__PURE__ */ a((o) => o ? typeof o == "string" ? { controller: null, active: o } : typeof o == "object" ? { controller: o, active: (o == null ? void 0 : o.active) ?? null } : n : n, "normalize");
  if (typeof i.get == "function") {
    const o = i.get(t);
    if (o !== void 0)
      return r(o);
  }
  return r(i[t]);
}
a(Pr, "resolveTabGroupState");
function qi(e, t) {
  return Pr(e, t).active;
}
a(qi, "getTabGroupActiveId");
function Ao(e) {
  if (!(e != null && e.tabGroups)) return;
  const t = e.tabGroups;
  if (typeof t.keys == "function") {
    const i = t.keys();
    if (i && typeof i.next == "function") {
      const { value: r, done: o } = i.next();
      if (!o) return r;
    }
  }
  const n = Object.keys(t ?? {});
  return n.length > 0 ? n[0] : void 0;
}
a(Ao, "getFirstTabGroupName");
function Do(e) {
  if (!(e instanceof HTMLElement)) return null;
  const t = [
    ":scope > footer.sheet-footer",
    ":scope > footer.form-footer",
    ":scope > .sheet-footer",
    ":scope > .form-footer",
    ":scope > footer"
  ];
  for (const n of t) {
    const i = e.querySelector(n);
    if (i instanceof HTMLElement) return i;
  }
  return null;
}
a(Do, "findFooterElement");
const _o = Mi(yi), Fo = `modules/${v}/templates/time-trigger-scene-tab.html`, Po = Fr({
  tabId: "time-triggers",
  tabLabel: /* @__PURE__ */ a(() => f("EIDOLON.TimeTrigger.Tab", "Time Triggers"), "tabLabel"),
  getScene: Me,
  isApplicable: ko,
  renderContent: /* @__PURE__ */ a(({ app: e, scene: t, tab: n }) => Ho(e, n, t), "renderContent"),
  logger: {
    log: T,
    group: Tt,
    groupEnd: Ue
  }
});
function Ro() {
  return T("Registering SceneConfig render hook"), Po.register();
}
a(Ro, "registerSceneConfigHook");
function Ho(e, t, n) {
  if (!(t instanceof HTMLElement)) return;
  const i = le(n) ? n : Me(e);
  en(e, t, i);
  const r = wi(() => {
    en(e, t, i);
  });
  return () => {
    if (typeof r == "function")
      try {
        r();
      } catch (o) {
        console.error(
          `${v} | Failed to dispose scene config time format subscription`,
          o
        );
      }
  };
}
a(Ho, "renderTimeTriggerTab");
async function en(e, t, n) {
  var r, o;
  const i = n ?? Me(e);
  Tt("renderTimeTriggersTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!le(i)) {
      const J = f(
        "EIDOLON.TimeTrigger.Unavailable",
        "Time triggers are unavailable for this configuration sheet."
      );
      t.innerHTML = `<p class="notes">${J}</p>`, T("Scene lacks document for time triggers", { sceneId: (i == null ? void 0 : i.id) ?? null });
      return;
    }
    const s = `flags.${v}.${Kt}`, l = `flags.${v}.${xn}`, c = `flags.${v}.${jn}`, u = !!i.getFlag(v, Kt), d = !!i.getFlag(v, xn), m = !!i.getFlag(v, jn), g = ft(i);
    T("Rendering time trigger list", {
      sceneId: i.id,
      isActive: u,
      shouldHideWindow: d,
      shouldShowPlayerWindow: m,
      triggerCount: g.length
    });
    const y = f("EIDOLON.TimeTrigger.Activate", "Activate Time Trigger"), h = f(
      "EIDOLON.TimeTrigger.Description",
      "Enable scene time triggers so scheduled actions can run automatically."
    ), O = f(
      "EIDOLON.TimeTrigger.HideWindowLabel",
      "Hide Floating Time Window"
    ), I = f(
      "EIDOLON.TimeTrigger.HideWindowDescription",
      "Keep the floating time control window hidden while leaving time triggers active."
    ), b = f(
      "EIDOLON.TimeTrigger.ShowPlayerWindowLabel",
      "Share Floating Time Window with Players"
    ), C = f(
      "EIDOLON.TimeTrigger.ShowPlayerWindowDescription",
      "Let non-GM players see the floating time window (without time controls)."
    ), N = f(
      "EIDOLON.TimeTrigger.TriggerListLabel",
      "Scene Time Triggers"
    ), P = f(
      "EIDOLON.TimeTrigger.TriggerListEmpty",
      "No time triggers configured for this scene."
    ), R = f("EIDOLON.TimeTrigger.AddTrigger", "Add Trigger"), L = f("EIDOLON.TimeTrigger.EditTrigger", "Edit"), S = f("EIDOLON.TimeTrigger.DeleteTrigger", "Remove"), $ = f("EIDOLON.TimeTrigger.TriggerNow", "Trigger Now"), W = f("EIDOLON.TimeTrigger.AtLabel", "At"), K = f("EIDOLON.TimeTrigger.DoLabel", "Do"), be = f("EIDOLON.TimeTrigger.MissingTime", "(No time set)"), oe = g.map((J, w) => {
      const qe = (J.time ? Eo(J.time) : "") || J.time || "" || be, ot = yo(J.action), Be = [
        `${W} ${qe}`,
        `${K} ${ot}`,
        ...To(J)
      ];
      return {
        index: w,
        summaryParts: Be,
        tooltips: {
          triggerNow: $,
          edit: L,
          delete: S
        }
      };
    }), he = ((o = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : o.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof he != "function") {
      console.error(`${v} | renderTemplate is unavailable; cannot render scene tab.`), t.innerHTML = `<p class="notes">${P}</p>`;
      return;
    }
    let se = "";
    try {
      se = await he(Fo, {
        flags: {
          active: s,
          hideWindow: l,
          showPlayerWindow: c
        },
        states: {
          isActive: u,
          hideWindow: d,
          showPlayerWindow: m
        },
        labels: {
          activate: y,
          hideWindow: O,
          showPlayerWindow: b,
          triggerList: N,
          empty: P,
          add: R
        },
        hints: {
          activate: h,
          hideWindow: I,
          showPlayerWindow: C
        },
        triggers: oe,
        hasTriggers: oe.length > 0
      });
    } catch (J) {
      console.error(`${v} | Failed to render time trigger scene tab template`, J), t.innerHTML = `<p class="notes">${P}</p>`;
      return;
    }
    t.innerHTML = se, $o(e, t, i);
  } finally {
    Ue();
  }
}
a(en, "renderTimeTriggersTabContent");
function $o(e, t, n) {
  const i = n ?? Me(e);
  if (!le(i)) return;
  const r = t.querySelector('[data-action="add-trigger"]');
  r && r.addEventListener("click", () => {
    T("Add trigger button clicked", { sceneId: i.id }), Bi(e, { scene: i });
  }), t.querySelectorAll('[data-action="edit-trigger"]').forEach((o) => {
    o.addEventListener("click", () => {
      const s = Number(o.dataset.index);
      if (!Number.isInteger(s)) return;
      const c = ft(i)[s];
      c && (T("Edit trigger button clicked", { sceneId: i.id, triggerId: c.id, index: s }), Bi(e, { trigger: c, triggerIndex: s, scene: i }));
    });
  }), t.querySelectorAll('[data-action="delete-trigger"]').forEach((o) => {
    o.addEventListener("click", async () => {
      var u, d;
      const s = Number(o.dataset.index);
      if (!Number.isInteger(s)) return;
      const l = ft(i), c = l[s];
      if (c) {
        l.splice(s, 1);
        try {
          T("Deleting trigger", {
            sceneId: i.id,
            index: s,
            triggerId: (c == null ? void 0 : c.id) ?? null
          }), await dr(i, l), await en(e, t, i);
        } catch (m) {
          console.error(`${v} | Failed to delete time trigger`, m), (d = (u = ui.notifications) == null ? void 0 : u.error) == null || d.call(
            u,
            f(
              "EIDOLON.TimeTrigger.TriggerDeleteError",
              "Failed to remove the selected time trigger."
            )
          );
        }
      }
    });
  }), t.querySelectorAll('[data-action="fire-trigger"]').forEach((o) => {
    o.addEventListener("click", async () => {
      var u, d, m, g, y, h, O;
      const s = Number(o.dataset.index);
      if (!Number.isInteger(s)) return;
      const c = ft(i)[s];
      if (c) {
        if (!((u = game.user) != null && u.isGM)) {
          (m = (d = ui.notifications) == null ? void 0 : d.warn) == null || m.call(
            d,
            f("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time.")
          );
          return;
        }
        try {
          T("Manually firing trigger", { sceneId: i.id, triggerId: c.id, index: s }), await fr(i, c), (y = (g = ui.notifications) == null ? void 0 : g.info) == null || y.call(
            g,
            f(
              "EIDOLON.TimeTrigger.TriggerNowSuccess",
              "Triggered the selected time trigger."
            )
          );
        } catch (I) {
          console.error(`${v} | Failed to execute time trigger manually`, I), (O = (h = ui.notifications) == null ? void 0 : h.error) == null || O.call(
            h,
            f(
              "EIDOLON.TimeTrigger.TriggerNowError",
              "Failed to execute the selected time trigger."
            )
          ), T("Manual trigger execution failed", {
            sceneId: i.id,
            triggerId: c.id,
            index: s,
            message: (I == null ? void 0 : I.message) ?? String(I)
          });
        }
      }
    });
  });
}
a($o, "bindTimeTriggerTabEvents");
function Bi(e, t = {}) {
  var s;
  const n = t.scene ?? null, i = n && le(n) ? n : Me(e);
  if (!le(i)) {
    console.warn(`${v} | Unable to open trigger form because no scene document is available.`);
    return;
  }
  T("Opening trigger form", {
    sceneId: i.id,
    triggerId: ((s = t.trigger) == null ? void 0 : s.id) ?? null,
    index: Number.isInteger(t.triggerIndex) ? Number(t.triggerIndex) : null
  }), _o({
    scene: i,
    trigger: t.trigger ?? null,
    triggerIndex: t.triggerIndex ?? null,
    onSave: /* @__PURE__ */ a(() => {
      var c, u;
      const l = (u = (c = e.element) == null ? void 0 : c[0]) == null ? void 0 : u.querySelector('.tab[data-tab="time-triggers"]');
      l && en(e, l, i);
    }, "onSave")
  }).render({ force: !0 });
}
a(Bi, "openTriggerForm");
function ko(e, t) {
  var o, s, l, c, u;
  if (!e) return !1;
  const n = ((s = (o = foundry == null ? void 0 : foundry.applications) == null ? void 0 : o.sheets) == null ? void 0 : s.SceneConfig) ?? (globalThis == null ? void 0 : globalThis.SceneConfig);
  if (n && e instanceof n) return !0;
  const i = (l = e == null ? void 0 : e.constructor) == null ? void 0 : l.name;
  if (typeof i == "string" && i.includes("SceneConfig")) return !0;
  if (t) {
    const d = globalThis == null ? void 0 : globalThis.Scene;
    if (d && t instanceof d || (t == null ? void 0 : t.documentName) === "Scene" || (t == null ? void 0 : t.documentName) === "scenes" || (t == null ? void 0 : t.collection) === "scenes") return !0;
  }
  const r = ((c = e == null ? void 0 : e.options) == null ? void 0 : c.baseApplication) ?? ((u = e == null ? void 0 : e.options) == null ? void 0 : u.id);
  return !!(typeof r == "string" && r.includes("SceneConfig"));
}
a(ko, "isRecognizedSceneConfig");
const $t = new ai(), Gi = new li();
function Vo() {
  T("Registering time trigger hooks"), Hooks.once("init", () => {
    oo(), fo(), T("Time trigger settings registered during init");
  }), Ro(), T("Scene config hook registered"), Gi.registerHooks(), T("Time automation hooks registered"), Hooks.once("ready", () => {
    go(), T("Ready hook fired"), $t.onReady(), Gi.initialize();
  }), Hooks.on("canvasReady", (e) => {
    var t;
    T("canvasReady hook received", { scene: ((t = e == null ? void 0 : e.scene) == null ? void 0 : t.id) ?? null }), $t.onCanvasReady(e);
  }), Hooks.on("updateScene", (e) => {
    T("updateScene hook received", { scene: (e == null ? void 0 : e.id) ?? null }), $t.onUpdateScene(e);
  }), Hooks.on("updateWorldTime", (e, t) => {
    T("updateWorldTime hook received", { worldTime: e, diff: t }), $t.onUpdateWorldTime(e, t);
  });
}
a(Vo, "registerTimeTriggerHooks");
Vo();
const me = v, Rr = "objectVariants";
function Rt(e) {
  var i;
  const t = (i = e == null ? void 0 : e.getFlag) == null ? void 0 : i.call(e, me, Rr);
  if (!t) return [];
  const n = nt(t);
  return Array.isArray(n) ? n.map((r) => tn(r)).filter((r) => r !== null) : [];
}
a(Rt, "getObjectVariantCategories");
async function Hr(e, t) {
  if (!(e != null && e.setFlag)) return;
  const n = Array.isArray(t) ? t.map((i) => tn(i)).filter((i) => i !== null) : [];
  await e.setFlag(me, Rr, n);
}
a(Hr, "setObjectVariantCategories");
function $r(e = "") {
  return {
    id: kr(),
    name: typeof e == "string" ? e : "",
    values: []
  };
}
a($r, "createObjectVariantCategory");
function tn(e) {
  if (!e || typeof e != "object") return null;
  const t = typeof e.id == "string" && e.id.trim() ? e.id.trim() : kr(), n = typeof e.name == "string" ? e.name : "", i = Array.isArray(e.values) ? e.values : [], r = [];
  for (const o of i) {
    if (typeof o != "string") continue;
    const s = o.trim();
    s && (r.includes(s) || r.push(s));
  }
  return { id: t, name: n, values: r };
}
a(tn, "sanitizeCategory");
function kr() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 11);
}
a(kr, "generateVariantId");
function Vr(e) {
  var t, n;
  console.error(`${me} | Failed to persist object variants`, e), (n = (t = ui.notifications) == null ? void 0 : t.error) == null || n.call(
    t,
    f(
      "EIDOLON.ObjectVariants.PersistError",
      "Failed to persist the scene's object variants."
    )
  );
}
a(Vr, "notifyPersistError");
var ir, ge, et, vt, Ur, Cn, Mn, _t, xr;
const Fe = class Fe extends Dn(An) {
  constructor(n = {}) {
    const { scene: i, category: r, isNew: o, onSave: s, ...l } = n ?? {};
    super(l);
    D(this, vt);
    D(this, ge, null);
    D(this, et, !1);
    D(this, Cn, /* @__PURE__ */ a(async (n) => {
      n.preventDefault(), n.stopPropagation();
      const i = n.currentTarget;
      if (!(i instanceof HTMLFormElement)) return;
      const o = (new FormData(i).get("categoryName") ?? "").toString(), s = Array.from(i.querySelectorAll('[name="categoryValues"]')), l = [];
      for (const c of s) {
        if (!(c instanceof HTMLInputElement)) continue;
        const u = c.value.trim();
        u && (l.includes(u) || l.push(u));
      }
      _(this, ge, {
        ...p(this, ge),
        name: o,
        values: l
      }), await E(this, vt, xr).call(this), this.close();
    }, "#onSubmit"));
    D(this, Mn, /* @__PURE__ */ a((n) => {
      var g, y;
      n.preventDefault();
      const i = n.currentTarget, r = (i == null ? void 0 : i.form) ?? ((y = (g = this.element) == null ? void 0 : g.querySelector) == null ? void 0 : y.call(g, "form"));
      if (!r) return;
      const o = r.querySelector(".object-variant-editor__values");
      if (!o) return;
      const s = o.querySelector(".object-variant-editor__empty");
      s && s.remove();
      const l = document.createElement("div");
      l.classList.add("object-variant-editor__value");
      const c = Yt(
        f("EIDOLON.ObjectVariants.ValuePlaceholder", "Variant label")
      ), u = Yt(
        f("EIDOLON.ObjectVariants.RemoveValue", "Remove Value")
      );
      l.innerHTML = `
      <input type="text" name="categoryValues" value="" placeholder="${c}" class="form-control">
      <button type="button" class="icon" data-action="remove-value" aria-label="${u}" title="${u}">
        <i class="fa-solid fa-trash"></i>
      </button>
    `, o.appendChild(l);
      const d = l.querySelector('[data-action="remove-value"]');
      d && d.addEventListener("click", p(this, _t));
      const m = l.querySelector('input[name="categoryValues"]');
      m && m.focus();
    }, "#onAddValue"));
    D(this, _t, /* @__PURE__ */ a((n) => {
      var c, u;
      n.preventDefault();
      const i = n.currentTarget, r = i == null ? void 0 : i.closest(".object-variant-editor__value");
      r && r.remove();
      const o = (i == null ? void 0 : i.form) ?? ((u = (c = this.element) == null ? void 0 : c.querySelector) == null ? void 0 : u.call(c, "form"));
      if (!o) return;
      const s = o.querySelector(".object-variant-editor__values");
      if (!s) return;
      if (!s.querySelector(".object-variant-editor__value")) {
        const d = document.createElement("p");
        d.classList.add("notes", "object-variant-editor__empty"), d.textContent = f(
          "EIDOLON.ObjectVariants.ValueListEmpty",
          "No values have been added to this category."
        ), s.appendChild(d);
      }
    }, "#onRemoveValue"));
    this.scene = i ?? null, this.category = r ?? null, this.onSave = typeof s == "function" ? s : null, _(this, et, !!o), _(this, ge, E(this, vt, Ur).call(this));
  }
  async _prepareContext() {
    var i, r;
    const n = Array.isArray((i = p(this, ge)) == null ? void 0 : i.values) ? p(this, ge).values : [];
    return {
      isNew: p(this, et),
      name: ((r = p(this, ge)) == null ? void 0 : r.name) ?? "",
      values: n.map((o, s) => ({
        index: s,
        value: o
      })),
      hasValues: n.length > 0,
      labels: {
        name: f("EIDOLON.ObjectVariants.CategoryNameLabel", "Category Name"),
        values: f("EIDOLON.ObjectVariants.ValuesLabel", "Values"),
        empty: f(
          "EIDOLON.ObjectVariants.ValueListEmpty",
          "No values have been added to this category."
        ),
        addValue: f("EIDOLON.ObjectVariants.AddValue", "Add Value"),
        removeValue: f("EIDOLON.ObjectVariants.RemoveValue", "Remove Value"),
        valuePlaceholder: f(
          "EIDOLON.ObjectVariants.ValuePlaceholder",
          "Variant label"
        ),
        save: p(this, et) ? f("EIDOLON.ObjectVariants.CreateCategory", "Add Category") : f("EIDOLON.ObjectVariants.SaveCategory", "Save Category"),
        cancel: f("EIDOLON.ObjectVariants.CancelEdit", "Cancel"),
        title: p(this, et) ? f("EIDOLON.ObjectVariants.CreateCategory", "Add Category") : f("EIDOLON.ObjectVariants.EditCategory", "Edit Category")
      }
    };
  }
  _onRender(n, i) {
    var c;
    super._onRender(n, i);
    const r = this.element;
    if (!r) return;
    const o = Array.from(((c = document == null ? void 0 : document.body) == null ? void 0 : c.classList) ?? []).find(
      (u) => u.startsWith("theme-")
    );
    o && r.classList.add(o);
    const s = r.querySelector("form");
    if (!s) return;
    s.addEventListener("submit", p(this, Cn)), s.querySelectorAll('[data-action="add-value"]').forEach((u) => {
      u.addEventListener("click", p(this, Mn));
    }), s.querySelectorAll('[data-action="remove-value"]').forEach((u) => {
      u.addEventListener("click", p(this, _t));
    });
    const l = s.querySelector('[data-action="cancel"]');
    l && l.addEventListener("click", (u) => {
      u.preventDefault(), this.close();
    });
  }
};
ge = new WeakMap(), et = new WeakMap(), vt = new WeakSet(), Ur = /* @__PURE__ */ a(function() {
  const n = tn(this.category) ?? $r(
    f("EIDOLON.ObjectVariants.DefaultCategoryName", "New Category")
  );
  return {
    id: n.id,
    name: n.name ?? "",
    values: Array.isArray(n.values) ? [...n.values] : []
  };
}, "#initializeState"), Cn = new WeakMap(), Mn = new WeakMap(), _t = new WeakMap(), xr = /* @__PURE__ */ a(async function() {
  if (!this.scene) return;
  const n = Rt(this.scene), i = n.findIndex((o) => o.id === p(this, ge).id), r = tn({
    id: p(this, ge).id,
    name: p(this, ge).name,
    values: p(this, ge).values
  });
  i === -1 ? n.push(r) : n.splice(i, 1, r);
  try {
    if (await Hr(this.scene, n), this.onSave)
      try {
        await this.onSave(r);
      } catch (o) {
        console.error(`${me} | Object variant editor onSave handler failed`, o);
      }
  } catch (o) {
    Vr(o);
  }
}, "#persist"), a(Fe, "CategoryEditorApplication"), ze(Fe, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  lt(Fe, Fe, "DEFAULT_OPTIONS"),
  {
    id: `${me}-variant-category-editor`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((ir = lt(Fe, Fe, "DEFAULT_OPTIONS")) == null ? void 0 : ir.classes) ?? [], "standard-form", "themed"])
    ),
    window: {
      title: f("EIDOLON.ObjectVariants.EditCategory", "Edit Category"),
      resizable: !1
    },
    position: {
      width: 440,
      height: "auto"
    }
  },
  { inplace: !1 }
)), ze(Fe, "PARTS", {
  content: {
    template: `modules/${me}/templates/object-variants-category-editor.html`
  }
});
let bi = Fe;
const Uo = `modules/${me}/templates/object-variants-scene-tab.html`, Ct = {
  log: /* @__PURE__ */ a((...e) => {
    var t;
    return (t = console.debug) == null ? void 0 : t.call(console, `${me} | ObjectVariants`, ...e);
  }, "log"),
  group: /* @__PURE__ */ a((...e) => {
    var t;
    return (t = console.groupCollapsed) == null ? void 0 : t.call(console, `${me} | ObjectVariants`, ...e);
  }, "group"),
  groupEnd: /* @__PURE__ */ a(() => {
    var e;
    return (e = console.groupEnd) == null ? void 0 : e.call(console);
  }, "groupEnd")
}, xo = Mi(bi), jo = Fr({
  tabId: "variants",
  tabLabel: /* @__PURE__ */ a(() => f("EIDOLON.ObjectVariants.TabLabel", "Variants"), "tabLabel"),
  getScene: Me,
  renderContent: /* @__PURE__ */ a(({ app: e, tab: t, scene: n }) => Bo(e, t, n), "renderContent"),
  logger: Ct
});
function qo() {
  return jo.register();
}
a(qo, "registerObjectVariantSceneConfigHook");
function Bo(e, t, n) {
  if (!(t instanceof HTMLElement)) return;
  const i = le(n) ? n : Me(e);
  zt(e, t, i);
}
a(Bo, "renderObjectVariantsTab");
async function zt(e, t, n) {
  var r, o;
  const i = n ?? Me(e);
  Ct.group("renderObjectVariantsTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!le(i)) {
      const N = f(
        "EIDOLON.ObjectVariants.Unavailable",
        "Object variants are unavailable for this configuration sheet."
      );
      t.innerHTML = `<p class="notes">${N}</p>`, Ct.log("Scene lacks document for object variants", { sceneId: (i == null ? void 0 : i.id) ?? null });
      return;
    }
    const s = Rt(i);
    Ct.log("Rendering object variant list", {
      sceneId: i.id,
      categoryCount: s.length
    });
    const l = f(
      "EIDOLON.ObjectVariants.Description",
      "Group scene assets into reusable variant categories and assign label values for quick reference."
    ), c = f(
      "EIDOLON.ObjectVariants.CategoryListLabel",
      "Scene Variant Categories"
    ), u = f(
      "EIDOLON.ObjectVariants.CategoryListEmpty",
      "No variant categories configured for this scene."
    ), d = f("EIDOLON.ObjectVariants.AddCategory", "Add Category"), m = f(
      "EIDOLON.ObjectVariants.RemoveCategory",
      "Remove Category"
    ), g = f("EIDOLON.ObjectVariants.EditCategory", "Edit Category"), y = f("EIDOLON.ObjectVariants.ValuesLabel", "Values"), h = f(
      "EIDOLON.ObjectVariants.ValueListEmpty",
      "No values have been added to this category."
    ), O = f(
      "EIDOLON.ObjectVariants.UnnamedCategory",
      "Unnamed Category"
    ), I = /* @__PURE__ */ a((N) => Yo(N), "formatCount"), b = ((o = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : o.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof b != "function") {
      console.error(`${me} | renderTemplate is unavailable; cannot render object variants tab.`), t.innerHTML = `<p class="notes">${u}</p>`;
      return;
    }
    let C = "";
    try {
      C = await b(Uo, {
        description: l,
        labels: {
          categories: c,
          empty: u,
          addCategory: d,
          removeCategory: m,
          editCategory: g,
          values: y,
          emptyValue: h,
          unnamedCategory: O
        },
        categories: s.map((N) => {
          var R, L;
          const P = ((L = (R = N.name) == null ? void 0 : R.trim) == null ? void 0 : L.call(R)) ?? "";
          return {
            id: N.id,
            name: N.name,
            displayName: P || O,
            isUnnamed: !P,
            values: N.values,
            hasValues: N.values.length > 0,
            valuePreview: Wo(N.values),
            valueCount: N.values.length,
            valueCountLabel: I(N.values.length),
            valueChips: Ko(N.values)
          };
        }),
        hasCategories: s.length > 0
      });
    } catch (N) {
      console.error(`${me} | Failed to render object variants scene tab template`, N), t.innerHTML = `<p class="notes">${u}</p>`;
      return;
    }
    t.innerHTML = C, Go(e, t, i);
  } finally {
    Ct.groupEnd();
  }
}
a(zt, "renderObjectVariantsTabContent");
function Go(e, t, n) {
  const i = n ?? Me(e);
  if (!le(i)) return;
  const r = f(
    "EIDOLON.ObjectVariants.DefaultCategoryName",
    "New Category"
  ), o = t.querySelector('[data-variant-action="add-category"]');
  o && o.addEventListener("click", () => {
    zi(e, {
      scene: i,
      category: $r(r),
      isNew: !0,
      onSave: /* @__PURE__ */ a(() => zt(e, t, i), "onSave")
    });
  }), t.querySelectorAll('[data-variant-action="remove-category"]').forEach((s) => {
    const l = s.dataset.categoryId;
    l && s.addEventListener("click", async () => {
      await zo(i, (u) => {
        const d = u.findIndex((m) => m.id === l);
        return d === -1 ? !1 : (u.splice(d, 1), !0);
      }) && await zt(e, t, i);
    });
  }), t.querySelectorAll('[data-variant-action="edit-category"]').forEach((s) => {
    const l = s.dataset.categoryId;
    l && s.addEventListener("click", () => {
      const u = Rt(i).find((d) => d.id === l);
      u && zi(e, {
        scene: i,
        category: u,
        onSave: /* @__PURE__ */ a(() => zt(e, t, i), "onSave")
      });
    });
  });
}
a(Go, "bindObjectVariantTabEvents");
async function zo(e, t) {
  const n = Rt(e);
  if (t(n) === !1) return !1;
  try {
    return await Hr(e, n), !0;
  } catch (r) {
    return Vr(r), !1;
  }
}
a(zo, "mutateVariantCategories");
function zi(e, t = {}) {
  const n = t.scene ?? null, i = n && le(n) ? n : Me(e);
  if (!le(i)) {
    console.warn(
      `${me} | Unable to open object variant editor because no scene document is available.`
    );
    return;
  }
  xo({
    scene: i,
    category: t.category ?? null,
    isNew: !!t.isNew,
    onSave: typeof t.onSave == "function" ? t.onSave : null
  }).render({ force: !0 });
}
a(zi, "openCategoryEditor");
function Wo(e) {
  if (!Array.isArray(e) || e.length === 0) return "";
  const t = e.slice(0, 5), n = t.join(", ");
  return e.length > t.length ? `${n}, …` : n;
}
a(Wo, "buildValuePreview");
function Ko(e) {
  return !Array.isArray(e) || e.length === 0 ? [] : e.map((t) => t);
}
a(Ko, "buildValueChips");
function Yo(e) {
  var t, n;
  if ((n = (t = game.i18n) == null ? void 0 : t.has) != null && n.call(t, "EIDOLON.ObjectVariants.ValueCountLabel"))
    try {
      return game.i18n.format("EIDOLON.ObjectVariants.ValueCountLabel", { count: e });
    } catch (i) {
      console.error(`${me} | Failed to format value count label`, i);
    }
  return e === 0 ? "No values configured" : e === 1 ? "1 value" : `${e} values`;
}
a(Yo, "formatValueCount");
function Jo() {
  qo();
}
a(Jo, "registerObjectVariantHooks");
Jo();
const tt = v, gt = "lightPresets", Ni = Object.freeze({
  default: null,
  presets: [],
  current: null
});
function jr(e) {
  var n;
  const t = ((n = e == null ? void 0 : e.getFlag) == null ? void 0 : n.call(e, tt, gt)) ?? Ni;
  return qr(t);
}
a(jr, "getLightPresetState");
async function Qo(e, t) {
  const n = qr(t);
  if (!(e != null && e.setFlag))
    return n;
  const i = n.default !== null, r = n.presets.length > 0, o = n.current !== null;
  return !i && !r && !o ? (typeof e.unsetFlag == "function" ? await e.unsetFlag(tt, gt) : await e.setFlag(tt, gt, null), Ni) : (await e.setFlag(tt, gt, n), n);
}
a(Qo, "setLightPresetState");
async function Ai(e, t) {
  if (typeof t != "function")
    throw new TypeError("updateLightPresetState requires an updater function.");
  const n = nt(jr(e)), i = await t(n);
  return Qo(e, i);
}
a(Ai, "updateLightPresetState");
async function Wi(e, t) {
  const n = bt(t);
  if (!n)
    throw new Error("Invalid light configuration payload.");
  return Ai(e, (i) => ({
    ...i,
    default: n
  }));
}
a(Wi, "storeDefaultPreset");
async function Ki(e, t, n, { label: i } = {}) {
  const r = Di(t);
  if (!r)
    throw new Error("Cannot create preset without at least one category selection.");
  const o = bt(n);
  if (!o)
    throw new Error("Invalid light configuration payload.");
  return Ai(e, (s) => {
    const l = Fn(r), c = Array.isArray(s == null ? void 0 : s.presets) ? [...s.presets] : [], u = c.findIndex((y) => (y == null ? void 0 : y.key) === l), d = u >= 0 ? c[u] : null, m = typeof (d == null ? void 0 : d.id) == "string" && d.id.trim() ? d.id.trim() : zr(), g = Br({
      id: m,
      categories: r,
      config: o,
      label: typeof i == "string" ? i : (d == null ? void 0 : d.label) ?? null,
      updatedAt: Date.now()
    });
    if (!g)
      throw new Error("Failed to sanitize preset entry.");
    return u >= 0 ? c[u] = g : c.push(g), {
      ...s,
      presets: c
    };
  });
}
a(Ki, "upsertLightPreset");
async function Yi(e, t) {
  const n = Gr(t);
  return Ai(e, (i) => ({
    ...i,
    current: n
  }));
}
a(Yi, "storeCurrentPresetSelection");
function qr(e) {
  var c;
  const t = nt(e);
  if (!t || typeof t != "object")
    return nt(Ni);
  const n = bt(t.default ?? t.defaultPreset), i = Array.isArray(t.presets) ? t.presets : [], r = /* @__PURE__ */ new Map();
  for (const u of i) {
    const d = Br(u);
    d && r.set(d.key, d);
  }
  const o = Array.from(r.values()), s = new Map(o.map((u) => [u.id, u]));
  let l = Gr(t.current);
  if (l) {
    const u = l.categories && Object.keys(l.categories).length > 0;
    if (l.presetId && !s.has(l.presetId)) {
      const d = u ? ((c = o.find((m) => m.key === Fn(l.categories))) == null ? void 0 : c.id) ?? null : null;
      d ? l = {
        ...l,
        presetId: d
      } : u && (l = {
        presetId: null,
        categories: l.categories,
        updatedAt: l.updatedAt
      });
    }
  }
  return {
    default: n ?? null,
    presets: o,
    current: l
  };
}
a(qr, "sanitizeLightPresetState");
function bt(e) {
  const t = nt(e);
  if (!t || typeof t != "object") return null;
  "_id" in t && delete t._id, "id" in t && delete t.id;
  const n = t.flags;
  if (n && typeof n == "object") {
    const i = n[tt];
    i && typeof i == "object" && (delete i[gt], Object.keys(i).length === 0 && delete n[tt]), Object.keys(n).length === 0 && delete t.flags;
  }
  return t;
}
a(bt, "sanitizeLightConfigPayload");
function Br(e) {
  if (!e || typeof e != "object") return null;
  const t = Di(e.categories);
  if (!t) return null;
  const n = bt(e.config);
  if (!n) return null;
  const i = typeof e.id == "string" && e.id.trim() ? e.id.trim() : zr(), r = Fn(t), o = {
    id: i,
    key: r,
    categories: t,
    config: n,
    updatedAt: Number.isFinite(e.updatedAt) ? Number(e.updatedAt) : Date.now()
  };
  return typeof e.label == "string" && e.label.trim() && (o.label = e.label.trim()), o;
}
a(Br, "sanitizePresetEntry");
function Gr(e) {
  if (!e || typeof e != "object") return null;
  const t = typeof e.presetId == "string" && e.presetId.trim() ? e.presetId.trim() : null, n = Di(e.categories);
  return !t && !n ? null : {
    presetId: t,
    categories: n,
    updatedAt: Number.isFinite(e.updatedAt) ? Number(e.updatedAt) : Date.now()
  };
}
a(Gr, "sanitizeCurrentSelection");
function Di(e) {
  const t = {};
  if (Array.isArray(e))
    for (const n of e) {
      const i = Ji((n == null ? void 0 : n.id) ?? (n == null ? void 0 : n.categoryId) ?? (n == null ? void 0 : n.category)), r = Qi((n == null ? void 0 : n.value) ?? (n == null ? void 0 : n.selection) ?? (n == null ? void 0 : n.label));
      !i || !r || (t[i] = r);
    }
  else if (e && typeof e == "object")
    for (const [n, i] of Object.entries(e)) {
      const r = Ji(n), o = Qi(i);
      !r || !o || (t[r] = o);
    }
  return Object.keys(t).length > 0 ? t : null;
}
a(Di, "sanitizePresetCategories");
function Fn(e) {
  if (!e || typeof e != "object") return "";
  const t = Object.entries(e).filter(([, n]) => typeof n == "string" && n).map(([n, i]) => `${n}:${i}`);
  return t.sort((n, i) => n < i ? -1 : n > i ? 1 : 0), t.join("|");
}
a(Fn, "computePresetKey");
function zr() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
a(zr, "generateLightPresetId");
function Ji(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  return t || null;
}
a(Ji, "normalizeCategoryId");
function Qi(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  return t || null;
}
a(Qi, "normalizeCategoryValue");
const Wt = /* @__PURE__ */ new WeakMap(), re = "__eidolon_default__";
function Xo() {
  Hooks.on("renderAmbientLightConfig", Zo), T("LightPresets | AmbientLightConfig controls registered");
}
a(Xo, "registerAmbientLightConfigControls");
function Zo(e, t) {
  var n;
  Tt("LightPresets | renderAmbientLightConfig", {
    appId: (e == null ? void 0 : e.id) ?? null,
    constructor: ((n = e == null ? void 0 : e.constructor) == null ? void 0 : n.name) ?? null,
    isRendered: (e == null ? void 0 : e.rendered) ?? !1
  });
  try {
    const i = t instanceof HTMLElement ? t : (t == null ? void 0 : t[0]) instanceof HTMLElement ? t[0] : null;
    if (!i) return;
    es(e, i);
  } catch (i) {
    console.error("eidolon-utilities | Failed to enhance AmbientLightConfig UI", i);
  } finally {
    Ue();
  }
}
a(Zo, "handleAmbientLightConfigRender");
function es(e, t) {
  var Be, Ge, It;
  const n = (e == null ? void 0 : e.form) instanceof HTMLFormElement ? e.form : t instanceof HTMLFormElement ? t : (Be = t == null ? void 0 : t.closest) == null ? void 0 : Be.call(t, "form");
  if (!(n instanceof HTMLFormElement)) return;
  const i = n.querySelector(".window-content");
  if (!(i instanceof HTMLElement)) return;
  const r = Kr(e);
  if (!r) return;
  const o = us(r);
  T("LightPresets | Resolved ambient light", {
    sheetId: (r == null ? void 0 : r.id) ?? null,
    persistedId: (o == null ? void 0 : o.id) ?? null,
    sameRef: r === o
  });
  const s = (o == null ? void 0 : o.parent) ?? r.parent ?? null, l = s ? Rt(s) : [], c = l.filter(
    (M) => Array.isArray(M == null ? void 0 : M.values) && M.values.length > 0
  ), u = ss(l), d = jr(o ?? r);
  T("LightPresets | Loaded preset state", {
    hasDefault: !!(d != null && d.default),
    presetCount: Array.isArray(d == null ? void 0 : d.presets) ? d.presets.length : 0,
    presets: Array.isArray(d == null ? void 0 : d.presets) ? d.presets.map((M) => {
      var F, j;
      return {
        id: M.id,
        key: M.key,
        hasColor: !!((j = (F = M.config) == null ? void 0 : F.config) != null && j.color)
      };
    }) : []
  });
  const m = i.querySelector(".eidolon-light-presets");
  m && m.remove();
  const g = document.createElement("fieldset");
  g.classList.add("eidolon-light-presets");
  const y = document.createElement("legend");
  y.textContent = f("EIDOLON.LightPresets.Legend", "Light Presets"), g.appendChild(y);
  const h = document.createElement("p");
  h.classList.add("notes"), h.textContent = f(
    "EIDOLON.LightPresets.Description",
    "Capture default lighting and register presets tied to scene variant values."
  ), g.appendChild(h);
  const O = document.createElement("div");
  O.classList.add("eidolon-light-presets__controls");
  const I = document.createElement("button");
  I.type = "button", I.dataset.action = "make-default", I.classList.add("eidolon-light-presets__button"), I.textContent = f(
    "EIDOLON.LightPresets.MakeDefault",
    "Make Default"
  ), O.appendChild(I);
  const b = document.createElement("button");
  b.type = "button", b.dataset.action = "create-preset", b.classList.add("eidolon-light-presets__button"), b.textContent = f(
    "EIDOLON.LightPresets.CreatePreset",
    "Create Preset"
  ), b.setAttribute("aria-expanded", "false"), O.appendChild(b), g.appendChild(O);
  const C = document.createElement("p");
  C.classList.add("notes", "eidolon-light-presets__status"), g.appendChild(C);
  const N = document.createElement("div");
  N.classList.add("eidolon-light-presets__switcher");
  const P = document.createElement("label");
  P.classList.add("eidolon-light-presets__switcher-label");
  const R = `${(e == null ? void 0 : e.id) ?? (r == null ? void 0 : r.id) ?? "eidolon-light"}-preset-select`;
  P.htmlFor = R, P.textContent = f("EIDOLON.LightPresets.SelectLabel", "Preset"), N.appendChild(P);
  const L = document.createElement("div");
  L.classList.add("eidolon-light-presets__switcher-controls"), N.appendChild(L);
  const S = document.createElement("select");
  S.id = R, S.classList.add("eidolon-light-presets__select"), S.dataset.action = "select-preset", L.appendChild(S);
  const $ = document.createElement("button");
  $.type = "button", $.dataset.action = "apply-selected-preset", $.classList.add("eidolon-light-presets__button", "secondary"), $.textContent = f("EIDOLON.LightPresets.ApplyButton", "Apply"), L.appendChild($);
  const W = document.createElement("button");
  if (W.type = "button", W.dataset.action = "update-selected-preset", W.classList.add("eidolon-light-presets__button", "secondary"), W.textContent = f(
    "EIDOLON.LightPresets.UpdateButton",
    "Save Changes"
  ), L.appendChild(W), g.appendChild(N), l.length === 0) {
    const M = document.createElement("p");
    M.classList.add("notification", "warning", "eidolon-light-presets__warning"), M.textContent = f(
      "EIDOLON.LightPresets.NoCategoriesWarning",
      "This scene has no variant categories. Add categories under Scene → Variants to enable lighting presets."
    ), g.appendChild(M);
  } else if (c.length === 0) {
    const M = document.createElement("p");
    M.classList.add("notification", "warning", "eidolon-light-presets__warning"), M.textContent = f(
      "EIDOLON.LightPresets.NoValuesWarning",
      "Variant categories exist, but none define selectable values. Add values in Scene → Variants."
    ), g.appendChild(M);
  }
  const K = document.createElement("div");
  K.classList.add("eidolon-light-presets__creation"), K.dataset.section = "creation", K.hidden = !0;
  const be = document.createElement("p");
  be.classList.add("notes"), be.textContent = f(
    "EIDOLON.LightPresets.CreateDescription",
    "Assign scene variant values to map the current configuration to a preset."
  ), K.appendChild(be);
  const oe = document.createElement("div");
  oe.classList.add("eidolon-light-presets__category-list"), K.appendChild(oe);
  for (const M of c) {
    const F = document.createElement("label");
    F.classList.add("eidolon-light-presets__category");
    const j = document.createElement("span");
    j.classList.add("eidolon-light-presets__category-name"), j.textContent = (It = (Ge = M.name) == null ? void 0 : Ge.trim) != null && It.call(Ge) ? M.name.trim() : f("EIDOLON.LightPresets.UnnamedCategory", "Unnamed Category"), F.appendChild(j);
    const x = document.createElement("select");
    x.dataset.categoryId = M.id, x.classList.add("eidolon-light-presets__category-select");
    const q = document.createElement("option");
    q.value = "", q.textContent = f(
      "EIDOLON.LightPresets.IgnoreCategory",
      "Ignore"
    ), x.appendChild(q);
    for (const B of M.values) {
      const G = document.createElement("option");
      G.value = B, G.textContent = B, x.appendChild(G);
    }
    F.appendChild(x), oe.appendChild(F);
  }
  const he = document.createElement("div");
  he.classList.add("eidolon-light-presets__creation-actions");
  const se = document.createElement("button");
  se.type = "button", se.dataset.action = "save-preset", se.classList.add("eidolon-light-presets__button", "primary"), se.textContent = f(
    "EIDOLON.LightPresets.SavePreset",
    "Save Preset"
  ), he.appendChild(se);
  const J = document.createElement("button");
  J.type = "button", J.dataset.action = "cancel-create", J.classList.add("eidolon-light-presets__button", "secondary"), J.textContent = f(
    "EIDOLON.LightPresets.Cancel",
    "Cancel"
  ), he.appendChild(J), K.appendChild(he), g.appendChild(K), i.appendChild(g), requestAnimationFrame(() => {
    var M;
    (M = e.setPosition) == null || M.call(e, { height: "auto" });
  });
  let w = d;
  ct(C, w), St(b, {
    state: w,
    hasCategories: c.length > 0
  }), T("LightPresets | Controls injected", {
    sceneId: (s == null ? void 0 : s.id) ?? null,
    lightId: (r == null ? void 0 : r.id) ?? null,
    hasDefault: !!(w != null && w.default),
    presetCount: Array.isArray(w == null ? void 0 : w.presets) ? w.presets.length : 0,
    categories: c.length
  });
  const Ot = as(w), V = {
    restoreConfig: null,
    app: e,
    selectedPreset: Ot
  };
  Wt.set(g, V), S.addEventListener("change", () => {
    V.selectedPreset = S.value ?? "", De({
      presetSelect: S,
      applyPresetButton: $,
      updatePresetButton: W,
      state: w
    });
  });
  const qe = /* @__PURE__ */ a(async () => {
    var x, q, B, G, ce, ee, ue, Re, ye, de, st, k, He, te;
    const M = S.value ?? "";
    if (!M) {
      (q = (x = ui.notifications) == null ? void 0 : x.warn) == null || q.call(
        x,
        f(
          "EIDOLON.LightPresets.SelectPresetWarning",
          "Choose a preset before applying."
        )
      ), De({
        presetSelect: S,
        applyPresetButton: $,
        updatePresetButton: W,
        state: w
      });
      return;
    }
    if (M === re) {
      if (!(w != null && w.default)) {
        (G = (B = ui.notifications) == null ? void 0 : B.warn) == null || G.call(
          B,
          f(
            "EIDOLON.LightPresets.DefaultUnavailable",
            "Save a default preset before applying it."
          )
        );
        return;
      }
      kt(g, K, b), Ut(e, n, w.default), w = await Yi(o ?? r, {
        presetId: re,
        categories: null,
        updatedAt: Date.now()
      }), V.selectedPreset = re, $e(S, w, u, V.selectedPreset), V.selectedPreset = S.value ?? re, ct(C, w), St(b, {
        state: w,
        hasCategories: c.length > 0
      }), Xi(n, {
        presetId: re,
        color: ((ee = (ce = w.default) == null ? void 0 : ce.config) == null ? void 0 : ee.color) ?? null
      }), (Re = (ue = ui.notifications) == null ? void 0 : ue.info) == null || Re.call(
        ue,
        f(
          "EIDOLON.LightPresets.DefaultApplied",
          "Applied the default preset to the form."
        )
      ), De({
        presetSelect: S,
        applyPresetButton: $,
        updatePresetButton: W,
        state: w
      });
      return;
    }
    const F = Array.isArray(w == null ? void 0 : w.presets) && w.presets.length ? w.presets.find((ie) => (ie == null ? void 0 : ie.id) === M) : null;
    if (!F) {
      (de = (ye = ui.notifications) == null ? void 0 : ye.warn) == null || de.call(
        ye,
        f(
          "EIDOLON.LightPresets.PresetUnavailable",
          "The selected preset is no longer available."
        )
      ), $e(S, w, u, ""), V.selectedPreset = S.value ?? "", De({
        presetSelect: S,
        applyPresetButton: $,
        updatePresetButton: W,
        state: w
      });
      return;
    }
    kt(g, K, b), Ut(e, n, F.config), w = await Yi(o ?? r, {
      presetId: F.id,
      categories: F.categories,
      updatedAt: Date.now()
    }), V.selectedPreset = F.id, $e(S, w, u, V.selectedPreset), V.selectedPreset = S.value ?? F.id, ct(C, w), St(b, {
      state: w,
      hasCategories: c.length > 0
    }), Xi(n, {
      presetId: F.id,
      color: ((k = (st = F.config) == null ? void 0 : st.config) == null ? void 0 : k.color) ?? null
    });
    const j = mt(F, u);
    (te = (He = ui.notifications) == null ? void 0 : He.info) == null || te.call(
      He,
      f(
        "EIDOLON.LightPresets.PresetApplied",
        "Applied preset: {label}"
      ).replace("{label}", j)
    ), De({
      presetSelect: S,
      applyPresetButton: $,
      updatePresetButton: W,
      state: w
    });
  }, "applySelectedPreset");
  $.addEventListener("click", () => {
    qe();
  }), S.addEventListener("keydown", (M) => {
    M.key === "Enter" && (M.preventDefault(), qe());
  });
  const ot = /* @__PURE__ */ a(async () => {
    var F, j, x, q, B, G, ce, ee, ue, Re, ye, de, st, k, He, te, ie, z, Y, Et, Ne;
    const M = V.selectedPreset;
    if (!M) {
      (j = (F = ui.notifications) == null ? void 0 : F.warn) == null || j.call(
        F,
        f(
          "EIDOLON.LightPresets.SelectPresetWarning",
          "Choose a preset before applying."
        )
      );
      return;
    }
    W.disabled = !0;
    try {
      const Q = Vt(e, o);
      if (M === re)
        w = await Wi(o ?? r, Q), T("LightPresets | Default preset updated", {
          lightId: ((x = o ?? r) == null ? void 0 : x.id) ?? null,
          configColor: ((q = Q == null ? void 0 : Q.config) == null ? void 0 : q.color) ?? null
        }), (G = (B = ui.notifications) == null ? void 0 : B.info) == null || G.call(
          B,
          f(
            "EIDOLON.LightPresets.DefaultUpdated",
            "Updated the default preset with the current configuration."
          )
        ), V.selectedPreset = re;
      else {
        const Te = pi(w, M);
        if (!Te) {
          (ee = (ce = ui.notifications) == null ? void 0 : ce.warn) == null || ee.call(
            ce,
            f(
              "EIDOLON.LightPresets.PresetUnavailable",
              "The selected preset is no longer available."
            )
          ), $e(S, w, u, ""), V.selectedPreset = S.value ?? "";
          return;
        }
        w = await Ki(
          o ?? r,
          Te.categories,
          Q,
          { label: Te.label ?? null }
        ), T("LightPresets | Preset updated", {
          presetId: M,
          hasColor: !!((ue = Q == null ? void 0 : Q.config) != null && ue.color),
          stored: Array.isArray(w == null ? void 0 : w.presets) ? ((Re = w.presets.find((at) => (at == null ? void 0 : at.id) === M)) == null ? void 0 : Re.config) ?? null : null,
          persisted: (de = (ye = o ?? r) == null ? void 0 : ye.getFlag) == null ? void 0 : de.call(ye, tt, gt)
        });
        const Ie = pi(w, M), Ae = mt(Ie || Te, u);
        T("LightPresets | Preset updated", {
          presetId: M,
          categories: Te.categories,
          updatedColor: ((st = Q == null ? void 0 : Q.config) == null ? void 0 : st.color) ?? null,
          storedColor: ((He = (k = Ie == null ? void 0 : Ie.config) == null ? void 0 : k.config) == null ? void 0 : He.color) ?? ((ie = (te = Te.config) == null ? void 0 : te.config) == null ? void 0 : ie.color) ?? null
        }), (Y = (z = ui.notifications) == null ? void 0 : z.info) == null || Y.call(
          z,
          f(
            "EIDOLON.LightPresets.PresetUpdated",
            "Saved changes to preset: {label}"
          ).replace("{label}", Ae)
        ), V.selectedPreset = M;
      }
      ct(C, w), St(b, {
        state: w,
        hasCategories: c.length > 0
      }), $e(S, w, u, V.selectedPreset), V.selectedPreset = S.value ?? "";
    } catch (Q) {
      console.error("eidolon-utilities | Failed to update light preset", Q), (Ne = (Et = ui.notifications) == null ? void 0 : Et.error) == null || Ne.call(
        Et,
        f(
          "EIDOLON.LightPresets.PresetUpdateError",
          "Failed to save the preset. Check the console for details."
        )
      );
    } finally {
      W.disabled = !1, De({
        presetSelect: S,
        applyPresetButton: $,
        updatePresetButton: W,
        state: w
      });
    }
  }, "updateSelectedPreset");
  W.addEventListener("click", () => {
    ot();
  }), $e(S, w, u, V.selectedPreset), V.selectedPreset = S.value ?? V.selectedPreset ?? "", De({
    presetSelect: S,
    applyPresetButton: $,
    updatePresetButton: W,
    state: w
  }), I.addEventListener("click", async () => {
    var M, F, j, x, q, B;
    I.disabled = !0;
    try {
      const G = Vt(e, o);
      w = await Wi(o ?? r, G), T("LightPresets | Default preset stored", {
        lightId: ((M = o ?? r) == null ? void 0 : M.id) ?? null,
        configColor: ((F = G == null ? void 0 : G.config) == null ? void 0 : F.color) ?? null
      }), (x = (j = ui.notifications) == null ? void 0 : j.info) == null || x.call(
        j,
        f(
          "EIDOLON.LightPresets.DefaultStored",
          "Saved the current configuration as the default preset."
        )
      ), ct(C, w), St(b, {
        state: w,
        hasCategories: c.length > 0
      }), V.selectedPreset = re, $e(S, w, u, V.selectedPreset), V.selectedPreset = S.value ?? "", De({
        presetSelect: S,
        applyPresetButton: $,
        updatePresetButton: W,
        state: w
      });
    } catch (G) {
      console.error("eidolon-utilities | Failed to store default light preset", G), (B = (q = ui.notifications) == null ? void 0 : q.error) == null || B.call(
        q,
        f(
          "EIDOLON.LightPresets.DefaultError",
          "Failed to save the default preset. Check the console for details."
        )
      );
    } finally {
      I.disabled = !1;
    }
  }), b.addEventListener("click", () => {
    var F, j, x, q;
    if (!(w != null && w.default)) {
      (j = (F = ui.notifications) == null ? void 0 : F.warn) == null || j.call(
        F,
        f(
          "EIDOLON.LightPresets.RequiresDefault",
          "Create a default preset before adding additional variants."
        )
      );
      return;
    }
    if (c.length === 0) {
      (q = (x = ui.notifications) == null ? void 0 : x.warn) == null || q.call(
        x,
        f(
          "EIDOLON.LightPresets.NoCategoriesAvailable",
          "Add variant categories with values in the Scene configuration before creating presets."
        )
      );
      return;
    }
    const M = Wt.get(g);
    M && (M.restoreConfig = Vt(e, o)), Ut(e, n, w.default), ls(oe), K.hidden = !1, b.setAttribute("aria-expanded", "true"), requestAnimationFrame(() => {
      var B;
      (B = e.setPosition) == null || B.call(e, { height: "auto" });
    });
  }), se.addEventListener("click", async () => {
    var F, j, x, q, B, G, ce;
    const M = cs(oe);
    if (!M) {
      (j = (F = ui.notifications) == null ? void 0 : F.warn) == null || j.call(
        F,
        f(
          "EIDOLON.LightPresets.SelectionRequired",
          "Select at least one category value to identify the preset."
        )
      );
      return;
    }
    se.disabled = !0;
    try {
      const ee = Vt(e, o);
      w = await Ki(
        o ?? r,
        M,
        ee,
        {}
      ), T("LightPresets | Preset saved from editor", {
        categories: M,
        configColor: ((x = ee == null ? void 0 : ee.config) == null ? void 0 : x.color) ?? null
      }), (B = (q = ui.notifications) == null ? void 0 : q.info) == null || B.call(
        q,
        f(
          "EIDOLON.LightPresets.PresetSaved",
          "Updated lighting preset for the selected scene variants."
        )
      ), ct(C, w);
      const ue = Wr(w, M);
      ue && (V.selectedPreset = ue), $e(S, w, u, V.selectedPreset), V.selectedPreset = S.value ?? "", De({
        presetSelect: S,
        applyPresetButton: $,
        updatePresetButton: W,
        state: w
      }), kt(g, K, b);
    } catch (ee) {
      console.error("eidolon-utilities | Failed to persist light preset", ee), (ce = (G = ui.notifications) == null ? void 0 : G.error) == null || ce.call(
        G,
        f(
          "EIDOLON.LightPresets.PresetError",
          "Failed to save the preset. Check the console for details."
        )
      );
    } finally {
      se.disabled = !1;
    }
  }), J.addEventListener("click", () => {
    const M = Wt.get(g);
    M != null && M.restoreConfig && Ut(e, n, M.restoreConfig), kt(g, K, b);
  });
}
a(es, "enhanceAmbientLightConfig");
function kt(e, t, n) {
  const i = Wt.get(e);
  i && (i.restoreConfig = null), t.hidden = !0, n.setAttribute("aria-expanded", "false"), requestAnimationFrame(() => {
    var r, o;
    (o = (r = i == null ? void 0 : i.app) == null ? void 0 : r.setPosition) == null || o.call(r, { height: "auto" });
  });
}
a(kt, "hideCreationSection");
function ct(e, t) {
  if (!e) return;
  const n = !!(t != null && t.default), i = Array.isArray(t == null ? void 0 : t.presets) ? t.presets.length : 0, r = [];
  r.push(
    n ? f(
      "EIDOLON.LightPresets.StatusDefaultSaved",
      "Default preset saved."
    ) : f(
      "EIDOLON.LightPresets.StatusDefaultMissing",
      "Default preset not yet saved."
    )
  ), r.push(
    f(
      "EIDOLON.LightPresets.StatusPresetCount",
      "Preset count: {count}"
    ).replace("{count}", String(i))
  ), e.textContent = r.join(" ");
}
a(ct, "updateStatusLine");
function St(e, { state: t, hasCategories: n }) {
  if (!e) return;
  const i = !!(t != null && t.default), r = i && n;
  e.disabled = !r, e.title = r ? "" : i ? f(
    "EIDOLON.LightPresets.CreateDisabledNoCategories",
    "Add scene variant categories with values before creating presets."
  ) : f(
    "EIDOLON.LightPresets.CreateDisabledNoDefault",
    "Save a default preset before creating additional presets."
  );
}
a(St, "updateCreateButtonState");
function Vt(e, t) {
  var u, d, m;
  const n = t ?? Kr(e);
  if (!n)
    throw new Error("Ambient light document unavailable.");
  const i = bt(((u = n.toObject) == null ? void 0 : u.call(n)) ?? {});
  if (!i)
    throw new Error("Unable to duplicate ambient light data.");
  let r = {};
  typeof e._getSubmitData == "function" ? r = e._getSubmitData() ?? {} : typeof e._getFormData == "function" && (r = e._getFormData() ?? {});
  const o = r && typeof r == "object" ? foundry.utils.expandObject(r) : {}, s = foundry.utils.mergeObject(i, o, {
    inplace: !1,
    performDeletions: !0
  }), l = (e == null ? void 0 : e.form) instanceof HTMLFormElement ? e.form : null;
  l && (l.querySelectorAll("color-picker[name]").forEach((g) => {
    var C, N;
    const y = g.getAttribute("name");
    if (!y) return;
    const h = typeof g.value == "string" ? g.value : "", O = ((C = g.ui) == null ? void 0 : C.input) ?? ((N = g.querySelector) == null ? void 0 : N.call(g, 'input[type="color"]')), I = (O == null ? void 0 : O.value) ?? "", b = h || I;
    typeof b != "string" || !b || (foundry.utils.setProperty(s, y, b), T("LightPresets | Captured color-picker value", {
      path: y,
      pickerValue: h,
      swatchValue: I,
      chosenValue: b
    }));
  }), l.querySelectorAll("range-picker[name]").forEach((g) => {
    var L, S;
    const y = g.getAttribute("name");
    if (!y) return;
    const h = g.value !== void 0 && g.value !== null ? String(g.value) : "", O = (L = g.querySelector) == null ? void 0 : L.call(g, 'input[type="range"]'), I = (S = g.querySelector) == null ? void 0 : S.call(g, 'input[type="number"]'), b = O instanceof HTMLInputElement ? O.value : "", C = I instanceof HTMLInputElement ? I.value : "", N = h || C || b;
    if (typeof N != "string" || !N.length) return;
    const P = Number(N), R = Number.isFinite(P) ? P : N;
    foundry.utils.setProperty(s, y, R), T("LightPresets | Captured range-picker value", {
      path: y,
      elementValue: h,
      numberValue: C,
      rangeValue: b,
      chosenValue: R
    });
  }));
  const c = bt(s);
  return T("LightPresets | Captured form config", {
    lightId: (n == null ? void 0 : n.id) ?? null,
    hasColor: !!((d = c == null ? void 0 : c.config) != null && d.color),
    color: ((m = c == null ? void 0 : c.config) == null ? void 0 : m.color) ?? null
  }), c;
}
a(Vt, "captureAmbientLightFormConfig");
function Ut(e, t, n) {
  if (!n || typeof n != "object") return;
  const i = foundry.utils.flattenObject(n, { safe: !0 });
  for (const [r, o] of Object.entries(i)) {
    const s = t.querySelectorAll(`[name="${r}"]`);
    if (s.length) {
      T("LightPresets | Applying field", {
        path: r,
        value: o,
        elementCount: s.length
      });
      for (const l of s)
        l instanceof HTMLElement && l.tagName === "COLOR-PICKER" ? ns(l, o, e) : l instanceof HTMLElement && l.tagName === "RANGE-PICKER" ? is(l, o, e) : l instanceof HTMLInputElement ? ts(l, o, e) : l instanceof HTMLSelectElement ? rs(l, o, e) : l instanceof HTMLTextAreaElement && os(l, o, e);
    }
  }
}
a(Ut, "applyConfigToForm");
function ts(e, t, n) {
  const i = e.type;
  if (i === "checkbox") {
    const s = !!t;
    e.checked !== s && (e.checked = s, Oe(e, n));
    return;
  }
  if (i === "radio") {
    const s = t == null ? "" : String(t), l = e.value === s;
    e.checked !== l && (e.checked = l, l && Oe(e, n));
    return;
  }
  const r = t == null ? "" : String(t);
  let o = !1;
  e.value !== r && (e.value = r, o = !0), o && Oe(e, n);
}
a(ts, "applyValueToInput");
function ns(e, t, n) {
  var l, c, u, d, m, g;
  const i = t == null ? "" : String(t);
  let r = !1;
  e.value !== i && (e.value = i, e.setAttribute("value", i), (l = e.ui) != null && l.setValue && e.ui.setValue(i), r = !0);
  const o = ((c = e.ui) == null ? void 0 : c.input) ?? ((u = e.querySelector) == null ? void 0 : u.call(e, 'input[type="color"]'));
  o instanceof HTMLInputElement && o.value !== i && (o.value = i, Oe(o, n));
  const s = ((d = e.ui) == null ? void 0 : d.text) ?? ((m = e.querySelector) == null ? void 0 : m.call(e, 'input[type="text"]'));
  if (s instanceof HTMLInputElement && s.value !== i && (s.value = i, Oe(s, n)), (g = e.ui) != null && g.commit)
    e.ui.commit();
  else if (e.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 })), typeof (n == null ? void 0 : n._onChangeInput) == "function")
    try {
      n._onChangeInput(new Event("change", { bubbles: !0, cancelable: !0 }));
    } catch (y) {
      console.error("eidolon-utilities | _onChangeInput handler failed", y);
    }
  T("LightPresets | Color picker applied", {
    value: i,
    pickerValue: e.value ?? null,
    swatchValue: (o == null ? void 0 : o.value) ?? null,
    textValue: (s == null ? void 0 : s.value) ?? null
  }), r && Oe(e, n);
}
a(ns, "applyValueToColorPicker");
function is(e, t, n) {
  var u, d;
  const i = t == null ? "" : String(t), r = Number(i), o = Number.isFinite(r) ? r : i;
  let s = !1;
  e.value !== void 0 && e.value !== o && (e.value = o, s = !0), e.getAttribute("value") !== i && (e.setAttribute("value", i), s = !0);
  const l = (u = e.querySelector) == null ? void 0 : u.call(e, 'input[type="range"]');
  l instanceof HTMLInputElement && l.value !== i && (l.value = i, Oe(l, n));
  const c = (d = e.querySelector) == null ? void 0 : d.call(e, 'input[type="number"]');
  if (c instanceof HTMLInputElement && c.value !== i && (c.value = i, Oe(c, n)), typeof e.commit == "function")
    try {
      e.commit();
    } catch (m) {
      console.error("eidolon-utilities | range-picker commit failed", m);
    }
  T("LightPresets | Range picker applied", {
    value: i,
    resolvedValue: o,
    rangeValue: (l == null ? void 0 : l.value) ?? null,
    numberValue: (c == null ? void 0 : c.value) ?? null
  }), s && Oe(e, n);
}
a(is, "applyValueToRangePicker");
function rs(e, t, n) {
  const i = t == null ? "" : String(t);
  e.value !== i && (e.value = i, Oe(e, n));
}
a(rs, "applyValueToSelect");
function os(e, t, n) {
  const i = t == null ? "" : String(t);
  e.value !== i && (e.value = i, Oe(e, n));
}
a(os, "applyValueToTextarea");
function Oe(e, t) {
  const n = /* @__PURE__ */ a((i) => {
    const r = new Event(i, { bubbles: !0, cancelable: !0 });
    if (e.dispatchEvent(r), typeof (t == null ? void 0 : t._onChangeInput) == "function")
      try {
        t._onChangeInput(r);
      } catch (o) {
        console.error("eidolon-utilities | _onChangeInput handler failed", o);
      }
  }, "dispatch");
  n("input"), n("change");
}
a(Oe, "triggerInputChange");
function De({ presetSelect: e, applyPresetButton: t, updatePresetButton: n, state: i }) {
  const r = (e == null ? void 0 : e.value) ?? "", o = !!(i != null && i.default), s = r && r !== re ? !!pi(i, r) : !1;
  t instanceof HTMLButtonElement && (r ? r === re ? t.disabled = !o : t.disabled = !s : t.disabled = !0), n instanceof HTMLButtonElement && (r ? r === re ? n.disabled = !1 : n.disabled = !s : n.disabled = !0);
}
a(De, "syncPresetSwitcherState");
function ss(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    if (!n) continue;
    const i = typeof n.id == "string" ? n.id : null;
    if (!i) continue;
    const r = typeof n.name == "string" && n.name.trim() ? n.name.trim() : f("EIDOLON.LightPresets.UnnamedCategory", "Unnamed Category");
    t.has(i) || t.set(i, r);
  }
  return t;
}
a(ss, "buildCategoryNameLookup");
function $e(e, t, n, i) {
  if (!(e instanceof HTMLSelectElement)) return;
  const r = typeof i == "string" ? i : "", o = !!(t != null && t.default), s = Array.isArray(t == null ? void 0 : t.presets) ? [...t.presets] : [], l = e.value;
  e.innerHTML = "";
  const c = document.createElement("option");
  c.value = "", c.textContent = f(
    "EIDOLON.LightPresets.SelectPlaceholder",
    "Select a preset"
  ), e.appendChild(c);
  const u = document.createElement("option");
  u.value = re, u.textContent = f(
    "EIDOLON.LightPresets.DefaultOption",
    "Default Preset"
  ), u.disabled = !o, e.appendChild(u), s.slice().sort((g, y) => {
    var I;
    const h = mt(g, n), O = mt(y, n);
    return h.localeCompare(O, ((I = game.i18n) == null ? void 0 : I.lang) ?? void 0, {
      sensitivity: "base"
    });
  }).forEach((g) => {
    if (!(g != null && g.id)) return;
    const y = document.createElement("option");
    y.value = g.id, y.textContent = mt(g, n), e.appendChild(y);
  });
  const d = new Set(
    Array.from(e.options).filter((g) => !g.disabled).map((g) => g.value)
  ), m = r || (d.has(l) ? l : "");
  m && d.has(m) ? e.value = m : o ? e.value = re : e.value = "";
}
a($e, "populatePresetSelector");
function mt(e, t) {
  if (!e || typeof e != "object")
    return f("EIDOLON.LightPresets.UnnamedPreset", "Unnamed Preset");
  if (typeof e.label == "string" && e.label.trim())
    return e.label.trim();
  const n = e.categories ?? {}, i = Object.entries(n).filter(([, r]) => typeof r == "string" && r.trim()).map(([r, o]) => {
    const s = o.trim();
    return `${t.get(r) ?? f("EIDOLON.LightPresets.UnnamedCategory", "Unnamed Category")}: ${s}`;
  });
  return i.length === 0 ? f("EIDOLON.LightPresets.UnnamedPreset", "Unnamed Preset") : i.join(" • ");
}
a(mt, "formatPresetOptionLabel");
function Wr(e, t) {
  if (!e || typeof e != "object" || !Array.isArray(e.presets)) return null;
  const n = Fn(t);
  if (!n) return null;
  const i = e.presets.find((r) => (r == null ? void 0 : r.key) === n);
  return (i == null ? void 0 : i.id) ?? null;
}
a(Wr, "findPresetIdByCategories");
function pi(e, t) {
  return !t || !e || typeof e != "object" || !Array.isArray(e.presets) ? null : e.presets.find((n) => (n == null ? void 0 : n.id) === t) ?? null;
}
a(pi, "getPresetById");
function as(e) {
  if (!e || typeof e != "object") return "";
  const t = e.current;
  if (t != null && t.presetId) {
    if (t.presetId === re)
      return e != null && e.default ? re : "";
    if (Array.isArray(e.presets) && e.presets.some((n) => n.id === t.presetId))
      return t.presetId;
  }
  if (t != null && t.categories) {
    const n = Wr(e, t.categories);
    if (n) return n;
  }
  return "";
}
a(as, "resolveInitialPresetSelection");
function Xi(e, t = {}) {
  var s, l, c, u;
  if (!(e instanceof HTMLFormElement)) return;
  const n = e.querySelector('color-picker[name="config.color"]'), i = (n == null ? void 0 : n.value) ?? null, r = ((s = n == null ? void 0 : n.ui) == null ? void 0 : s.text) ?? ((l = n == null ? void 0 : n.querySelector) == null ? void 0 : l.call(n, 'input[type="text"]')), o = ((c = n == null ? void 0 : n.ui) == null ? void 0 : c.input) ?? ((u = n == null ? void 0 : n.querySelector) == null ? void 0 : u.call(n, 'input[type="color"]'));
  T("LightPresets | Color state after apply", {
    ...t,
    textValue: (r == null ? void 0 : r.value) ?? null,
    pickerValue: i,
    swatchValue: (o == null ? void 0 : o.value) ?? null
  });
}
a(Xi, "logAppliedColorState");
function ls(e) {
  e.querySelectorAll("select[data-category-id]").forEach((t) => {
    t.value = "";
  });
}
a(ls, "resetCategorySelections");
function cs(e) {
  const t = {};
  return e.querySelectorAll("select[data-category-id]").forEach((n) => {
    var o, s;
    const i = n.dataset.categoryId, r = (s = (o = n.value) == null ? void 0 : o.trim) == null ? void 0 : s.call(o);
    !i || !r || (t[i] = r);
  }), Object.keys(t).length > 0 ? t : null;
}
a(cs, "readCategorySelections");
function Kr(e) {
  const t = (e == null ? void 0 : e.object) ?? (e == null ? void 0 : e.document) ?? null;
  return !(t != null && t.isEmbedded) || t.documentName !== "AmbientLight" ? null : t;
}
a(Kr, "getAmbientLightDocument");
function us(e) {
  if (!(e != null && e.isEmbedded)) return null;
  const t = e.parent ?? null;
  if (!t) return e;
  if (typeof t.getEmbeddedDocument == "function") {
    const i = t.getEmbeddedDocument(e.documentName, e.id);
    if (i) return i;
  }
  const n = t.lights;
  if (n != null && n.get) {
    const i = n.get(e.id);
    if (i) return i;
  }
  return e;
}
a(us, "getPersistedAmbientLightDocument");
function ds() {
  Xo();
}
a(ds, "registerLightPresetHooks");
ds();
const vi = /* @__PURE__ */ new Map();
let Oi = !1;
function fs(e, t) {
  vi.has(e) && console.warn(`[${v}] Socket handler for type "${e}" already registered, overwriting.`), vi.set(e, t);
}
a(fs, "registerSocketHandler");
function gs(e, t) {
  if (!Oi) {
    console.error(`[${v}] Socket not initialized. Call initializeSocket() first.`);
    return;
  }
  game.socket.emit(`module.${v}`, { type: e, payload: t });
}
a(gs, "emitSocket");
function ms() {
  Oi || (game.socket.on(`module.${v}`, (e) => {
    const { type: t, payload: n } = e ?? {}, i = vi.get(t);
    i ? i(n) : console.warn(`[${v}] No socket handler for type "${t}"`);
  }), Oi = !0, console.log(`[${v}] Socket initialized on channel module.${v}`));
}
a(ms, "initializeSocket");
const Yr = "tween", nn = /* @__PURE__ */ new Map();
function Jr({ type: e, execute: t, validate: n }) {
  nn.has(e) && console.warn(`[tween-registry] Type "${e}" already registered, overwriting.`), nn.set(e, { type: e, execute: t, validate: n ?? (() => {
  }) });
}
a(Jr, "registerTweenType");
function Qr(e) {
  return nn.get(e);
}
a(Qr, "getTweenType");
function Ii() {
  return [...nn.keys()];
}
a(Ii, "listTweenTypes");
function Xr(e) {
  const t = foundry.canvas.animation.CanvasAnimation;
  return {
    linear: t.easeLinear,
    easeInOutCosine: t.easeInOutCosine
  }[e] ?? t.easeInOutCosine;
}
a(Xr, "resolveEasing");
function rn(e) {
  return e <= 0.04045 ? e / 12.92 : ((e + 0.055) / 1.055) ** 2.4;
}
a(rn, "srgbToLinear");
function ht(e) {
  return e <= 31308e-7 ? 12.92 * e : 1.055 * e ** (1 / 2.4) - 0.055;
}
a(ht, "linearToSrgb");
function Zi(e, t, n) {
  const i = 0.4122214708 * e + 0.5363325363 * t + 0.0514459929 * n, r = 0.2119034982 * e + 0.6806995451 * t + 0.1073969566 * n, o = 0.0883024619 * e + 0.2817188376 * t + 0.6299787005 * n, s = Math.cbrt(i), l = Math.cbrt(r), c = Math.cbrt(o);
  return [
    0.2104542553 * s + 0.793617785 * l - 0.0040720468 * c,
    1.9779984951 * s - 2.428592205 * l + 0.4505937099 * c,
    0.0259040371 * s + 0.7827717662 * l - 0.808675766 * c
  ];
}
a(Zi, "linearRgbToOklab");
function hs(e, t, n) {
  const i = (e + 0.3963377774 * t + 0.2158037573 * n) ** 3, r = (e - 0.1055613458 * t - 0.0638541728 * n) ** 3, o = (e - 0.0894841775 * t - 1.291485548 * n) ** 3;
  return [
    4.0767416621 * i - 3.3077115913 * r + 0.2309699292 * o,
    -1.2684380046 * i + 2.6097574011 * r - 0.3413193965 * o,
    -0.0041960863 * i - 0.7034186147 * r + 1.707614701 * o
  ];
}
a(hs, "oklabToLinearRgb");
function on(e) {
  return [e.r, e.g, e.b];
}
a(on, "colorToRgb");
function Zr(e, t, n) {
  const i = /* @__PURE__ */ a((o) => Math.max(0, Math.min(1, o)), "clamp"), r = /* @__PURE__ */ a((o) => Math.round(i(o) * 255).toString(16).padStart(2, "0"), "toHex");
  return `#${r(e)}${r(t)}${r(n)}`;
}
a(Zr, "rgbToHex");
function ys(e, t, n) {
  if (n <= 0) return e.toHTML();
  if (n >= 1) return t.toHTML();
  const i = foundry.utils.Color, [r, o, s] = e.hsl, [l, c, u] = t.hsl, d = (l - r + 0.5) % 1 - 0.5, m = (r + d * n + 1) % 1, g = o + (c - o) * n, y = s + (u - s) * n;
  return i.fromHSL([m, g, y]).toHTML();
}
a(ys, "interpolateHsl");
function Ts(e, t, n) {
  if (n <= 0) return e.toHTML();
  if (n >= 1) return t.toHTML();
  const [i, r, o] = on(e).map(rn), [s, l, c] = on(t).map(rn), u = ht(i + (s - i) * n), d = ht(r + (l - r) * n), m = ht(o + (c - o) * n);
  return Zr(u, d, m);
}
a(Ts, "interpolateRgb");
function bs(e, t, n) {
  if (n <= 0) return e.toHTML();
  if (n >= 1) return t.toHTML();
  const [i, r, o] = on(e).map(rn), [s, l, c] = on(t).map(rn), [u, d, m] = Zi(i, r, o), [g, y, h] = Zi(s, l, c), O = 0.02, I = Math.sqrt(d * d + m * m), b = Math.sqrt(y * y + h * h);
  let C, N, P;
  if (I < O || b < O)
    C = u + (g - u) * n, N = d + (y - d) * n, P = m + (h - m) * n;
  else {
    const $ = Math.atan2(m, d);
    let K = Math.atan2(h, y) - $;
    K > Math.PI && (K -= 2 * Math.PI), K < -Math.PI && (K += 2 * Math.PI), C = u + (g - u) * n;
    const be = I + (b - I) * n, oe = $ + K * n;
    N = be * Math.cos(oe), P = be * Math.sin(oe);
  }
  const [R, L, S] = hs(C, N, P);
  return Zr(ht(R), ht(L), ht(S));
}
a(bs, "interpolateOklch");
const Ei = {
  hsl: ys,
  rgb: Ts,
  oklch: bs
};
function ps(e = "hsl") {
  return Ei[e] ?? Ei.hsl;
}
a(ps, "getInterpolator");
function er() {
  return Object.keys(Ei);
}
a(er, "listInterpolationModes");
function vs(e) {
  if (!e.uuid || typeof e.uuid != "string")
    throw new Error("light-color tween: 'uuid' is required (AmbientLight document UUID).");
  if (!e.toColor || typeof e.toColor != "string")
    throw new Error("light-color tween: 'toColor' is required (CSS color string).");
  if (!foundry.utils.Color.fromString(e.toColor).valid)
    throw new Error(`light-color tween: invalid target color "${e.toColor}".`);
  if (e.mode && !er().includes(e.mode))
    throw new Error(
      `light-color tween: unknown mode "${e.mode}". Available: ${er().join(", ")}`
    );
}
a(vs, "validate$1");
async function Os(e, t = {}) {
  var S;
  const { CanvasAnimation: n } = foundry.canvas.animation, { Color: i } = foundry.utils, { uuid: r, toColor: o, mode: s = "oklch" } = e, {
    durationMS: l = 2e3,
    easing: c = "easeInOutCosine",
    commit: u = !0,
    startEpochMS: d = null
  } = t, m = await fromUuid(r);
  if (!m)
    return !1;
  const g = m.object;
  if (!g)
    return !1;
  const y = Xr(c), h = ps(s), O = (S = m.config) == null ? void 0 : S.color, I = i.fromString(o);
  if (O != null && O.valid || console.warn(`light-color tween: source color invalid on ${r}, using white.`), !I.valid) throw new Error(`light-color tween: invalid target color "${o}".`);
  const b = O != null && O.valid ? O : i.fromString("#ffffff"), C = { t: 0 }, N = `ambient-hue-tween:${r}`;
  n.terminateAnimation(N);
  const P = typeof d == "number" ? Math.max(0, Math.min(l, Date.now() - d)) : 0, R = /* @__PURE__ */ a(($) => {
    m.updateSource({ config: { color: $ } }), g.initializeLightSource();
  }, "applyLocalColor");
  P > 0 && (C.t = P / l, R(h(b, I, C.t)));
  const L = await n.animate(
    [{ parent: C, attribute: "t", to: 1 }],
    {
      name: N,
      duration: l,
      easing: y,
      time: P,
      ontick: /* @__PURE__ */ a(() => {
        R(h(b, I, C.t));
      }, "ontick")
    }
  );
  return L !== !1 && R(I.toHTML()), u && L !== !1 && m.canUserModify(game.user, "update") && (m.updateSource({ config: { color: b.toHTML() } }), await m.update({ "config.color": I.toHTML() })), L !== !1;
}
a(Os, "execute$1");
function Is() {
  Jr({ type: "light-color", execute: Os, validate: vs });
}
a(Is, "registerLightColorTween");
function Es(e) {
  if (!e.uuid || typeof e.uuid != "string")
    throw new Error("light-state tween: 'uuid' is required (AmbientLight document UUID).");
  if (typeof e.enabled != "boolean")
    throw new Error("light-state tween: 'enabled' (boolean) is required.");
}
a(Es, "validate");
async function Ls(e, t = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, enabled: r } = e, {
    durationMS: o = 2e3,
    easing: s = "easeInOutCosine",
    commit: l = !0,
    startEpochMS: c = null
  } = t, u = await fromUuid(i);
  if (!u) return !1;
  const d = u.object;
  if (!d) return !1;
  if (r && !u.hidden || !r && u.hidden) return !0;
  const m = Xr(s), g = u.config.alpha ?? 0.5, y = `ambient-state-tween:${i}`;
  n.terminateAnimation(y);
  const h = typeof c == "number" ? Math.max(0, Math.min(o, Date.now() - c)) : 0, O = /* @__PURE__ */ a((I, b) => {
    u.updateSource({ hidden: b, config: { alpha: I } }), d.initializeLightSource();
  }, "applyLocal");
  if (r) {
    O(0, !1);
    const I = { t: 0 };
    h > 0 && (I.t = h / o, O(g * I.t, !1));
    const b = await n.animate(
      [{ parent: I, attribute: "t", to: 1 }],
      {
        name: y,
        duration: o,
        easing: m,
        time: h,
        ontick: /* @__PURE__ */ a(() => O(g * I.t, !1), "ontick")
      }
    );
    return l && b !== !1 && u.canUserModify(game.user, "update") && (u.updateSource({ hidden: !0, config: { alpha: g } }), await u.update({ hidden: !1, "config.alpha": g })), b !== !1;
  } else {
    const I = { t: 0 };
    h > 0 && (I.t = h / o, O(g * (1 - I.t), !1));
    const b = await n.animate(
      [{ parent: I, attribute: "t", to: 1 }],
      {
        name: y,
        duration: o,
        easing: m,
        time: h,
        ontick: /* @__PURE__ */ a(() => O(g * (1 - I.t), !1), "ontick")
      }
    );
    return l && b !== !1 && u.canUserModify(game.user, "update") ? (u.updateSource({ hidden: !1, config: { alpha: g } }), await u.update({ hidden: !0, "config.alpha": g })) : O(g, !0), b !== !1;
  }
}
a(Ls, "execute");
function Ss() {
  Jr({ type: "light-state", execute: Ls, validate: Es });
}
a(Ss, "registerLightStateTween");
async function ws(e, t, n = {}) {
  if (!game.user.isGM)
    return ui.notifications.warn("Only the GM can dispatch tweens."), !1;
  const i = Qr(e);
  if (!i)
    throw new Error(`Unknown tween type: "${e}". Registered types: ${Ii().join(", ")}`);
  i.validate(t);
  const { durationMS: r = 2e3, easing: o = "easeInOutCosine", commit: s = !0 } = n, l = Date.now();
  return gs(Yr, {
    type: e,
    params: t,
    durationMS: r,
    easing: o,
    startEpochMS: l,
    commit: !1
  }), i.execute(t, { durationMS: r, easing: o, commit: s, startEpochMS: l });
}
a(ws, "dispatchTween");
function Cs(e) {
  const { type: t, params: n, durationMS: i, easing: r, startEpochMS: o, commit: s } = e ?? {}, l = Qr(t);
  if (!l) {
    console.warn(`[${v}] Received unknown tween type over socket: "${t}"`);
    return;
  }
  l.execute(n, {
    durationMS: i,
    easing: r,
    commit: s ?? !1,
    startEpochMS: o
  });
}
a(Cs, "handleTweenSocketMessage");
Is();
Ss();
fs(Yr, Cs);
function Ms() {
  Hooks.once("ready", () => {
    ms();
    const e = game.modules.get(v);
    e.api || (e.api = {}), e.api.tween = {
      dispatch: ws,
      types: Ii
    }, console.log(`[${v}] Tween API registered. Types: ${Ii().join(", ")}`);
  });
}
a(Ms, "registerTweenHooks");
Ms();
//# sourceMappingURL=eidolon-utilities.js.map
