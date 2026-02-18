var Ri = Object.defineProperty;
var to = Object.getPrototypeOf;
var no = Reflect.get;
var Hi = (e) => {
  throw TypeError(e);
};
var io = (e, t, n) => t in e ? Ri(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var a = (e, t) => Ri(e, "name", { value: t, configurable: !0 });
var We = (e, t, n) => io(e, typeof t != "symbol" ? t + "" : t, n), Hn = (e, t, n) => t.has(e) || Hi("Cannot " + n);
var b = (e, t, n) => (Hn(e, t, "read from private field"), n ? n.call(e) : t.get(e)), _ = (e, t, n) => t.has(e) ? Hi("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), D = (e, t, n, i) => (Hn(e, t, "write to private field"), i ? i.call(e, n) : t.set(e, n), n), L = (e, t, n) => (Hn(e, t, "access private method"), n);
var ct = (e, t, n) => no(to(e), n, t);
const v = "eidolon-utilities", Yt = "timeTriggerActive", jn = "timeTriggerHideWindow", qn = "timeTriggerShowPlayerWindow", Bn = "timeTriggerAllowRealTime", or = "timeTriggers", jt = "timeTriggerHistory", Gn = "debug", zn = "timeFormat", Wn = "manageTime", Kn = "secondsPerRound";
const ro = [-30, -15, -5, 5, 15, 30], ft = 1440 * 60, qt = "playSound", Pt = 6;
function f(e, t) {
  var n, i;
  return (i = (n = game.i18n) == null ? void 0 : n.has) != null && i.call(n, e) ? game.i18n.localize(e) : t;
}
a(f, "localize");
function Jt(e) {
  return typeof e != "string" ? "" : e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
a(Jt, "escapeHtml");
function it(e) {
  var t;
  return e == null ? e : (t = foundry == null ? void 0 : foundry.utils) != null && t.duplicate ? foundry.utils.duplicate(e) : JSON.parse(JSON.stringify(e));
}
a(it, "duplicateData");
function oo() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
a(oo, "generateTriggerId");
function sr(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  if (!t) return null;
  const n = t.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (!n) return null;
  const i = Number(n[1]), r = Number(n[2]), o = n[3] !== void 0 ? Number(n[3]) : 0;
  return !Number.isInteger(i) || !Number.isInteger(r) || !Number.isInteger(o) || i < 0 || i > 23 || r < 0 || r > 59 || o < 0 || o > 59 ? null : i * 3600 + r * 60 + o;
}
a(sr, "parseTriggerTimeToSeconds");
function Ct() {
  var e, t;
  return ((e = game.scenes) == null ? void 0 : e.current) ?? ((t = game.scenes) == null ? void 0 : t.active) ?? null;
}
a(Ct, "getActiveScene");
function Ne(e) {
  return (e == null ? void 0 : e.object) ?? (e == null ? void 0 : e.document) ?? null;
}
a(Ne, "getSceneFromApplication");
function ue(e) {
  return e && typeof e.getFlag == "function" && typeof e.setFlag == "function";
}
a(ue, "hasSceneDocument");
const Yn = /* @__PURE__ */ new Set(), Jn = /* @__PURE__ */ new Set(), Qn = /* @__PURE__ */ new Set(), Xn = /* @__PURE__ */ new Set();
let rt = !1, Mt = !1, Qt = Pt, Xt = "12h", $i = !1;
function $n(e) {
  rt = !!e;
  for (const t of Yn)
    try {
      t(rt);
    } catch (n) {
      console.error(`${v} | Debug change handler failed`, n);
    }
}
a($n, "notifyDebugChange");
function kn(e) {
  Mt = !!e;
  for (const t of Jn)
    try {
      t(Mt);
    } catch (n) {
      console.error(`${v} | Manage time change handler failed`, n);
    }
}
a(kn, "notifyManageTimeChange");
function ar(e) {
  return e === "24h" ? "24h" : "12h";
}
a(ar, "normalizeTimeFormatValue");
function Si(e) {
  const t = Number(e);
  return !Number.isFinite(t) || t <= 0 ? Pt : t;
}
a(Si, "normalizeSecondsPerRoundValue");
function Vn(e) {
  const t = Si(e);
  Qt = t;
  for (const n of Qn)
    try {
      n(t);
    } catch (i) {
      console.error(`${v} | Seconds-per-round change handler failed`, i);
    }
}
a(Vn, "notifySecondsPerRoundChange");
function Un(e) {
  const t = ar(e);
  Xt = t;
  for (const n of Xn)
    try {
      n(t);
    } catch (i) {
      console.error(`${v} | Time format change handler failed`, i);
    }
}
a(Un, "notifyTimeFormatChange");
function so() {
  var t;
  if ($i) return;
  if ($i = !0, !((t = game == null ? void 0 : game.settings) != null && t.register)) {
    console.warn(
      `${v} | game.settings.register is unavailable. Module settings could not be registered.`
    );
    return;
  }
  const e = typeof game.settings.registerChange == "function";
  game.settings.register(v, Gn, {
    name: f("EIDOLON.TimeTrigger.DebugSettingName", "Enable debug logging"),
    hint: f(
      "EIDOLON.TimeTrigger.DebugSettingHint",
      "Write detailed time-trigger diagnostics to the browser console."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: e ? void 0 : $n
  }), e && game.settings.registerChange(v, Gn, $n), rt = wi(), $n(rt), game.settings.register(v, Wn, {
    name: f("EIDOLON.TimeTrigger.ManageTimeSettingName", "Manage Game Time"),
    hint: f(
      "EIDOLON.TimeTrigger.ManageTimeSettingHint",
      "Allow Eidolon Utilities to advance world time automatically while the game is unpaused. Warning: This may conflict with other time-management modules."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: e ? void 0 : kn
  }), e && game.settings.registerChange(v, Wn, kn), Mt = lo(), kn(Mt), game.settings.register(v, Kn, {
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
    default: Pt,
    range: { min: 1, max: 3600, step: 1 },
    onChange: e ? void 0 : Vn
  }), e && game.settings.registerChange(
    v,
    Kn,
    Vn
  ), Qt = Si(co()), Vn(Qt), game.settings.register(v, zn, {
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
    onChange: e ? void 0 : Un
  }), e && game.settings.registerChange(v, zn, Un), Xt = ar(lr()), Un(Xt);
}
a(so, "registerTimeTriggerSettings");
function wi() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get)
      return !!game.settings.get(v, Gn);
  } catch (t) {
    console.error(`${v} | Failed to read debug setting`, t);
  }
  return !1;
}
a(wi, "getDebugSetting");
function ao() {
  return rt = wi(), rt;
}
a(ao, "refreshDebugSettingCache");
function lo() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get)
      return !!game.settings.get(v, Wn);
  } catch (t) {
    console.error(`${v} | Failed to read manage time setting`, t);
  }
  return !1;
}
a(lo, "getManageTimeSetting");
function lr() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get)
      return game.settings.get(v, zn) === "24h" ? "24h" : "12h";
  } catch (t) {
    console.error(`${v} | Failed to read time format setting`, t);
  }
  return "12h";
}
a(lr, "getTimeFormatSetting");
function co() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get) {
      const t = game.settings.get(v, Kn);
      return Si(t);
    }
  } catch (t) {
    console.error(`${v} | Failed to read seconds-per-round setting`, t);
  }
  return Pt;
}
a(co, "getSecondsPerRoundSetting");
function uo(e) {
  if (typeof e != "function")
    return () => {
    };
  Yn.add(e);
  try {
    e(rt);
  } catch (t) {
    console.error(`${v} | Debug change handler failed`, t);
  }
  return () => {
    Yn.delete(e);
  };
}
a(uo, "onDebugSettingChange");
function cr(e) {
  if (typeof e != "function")
    return () => {
    };
  Jn.add(e);
  try {
    e(Mt);
  } catch (t) {
    console.error(`${v} | Manage time change handler failed`, t);
  }
  return () => {
    Jn.delete(e);
  };
}
a(cr, "onManageTimeSettingChange");
function Ci(e) {
  if (typeof e != "function")
    return () => {
    };
  Xn.add(e);
  try {
    e(Xt);
  } catch (t) {
    console.error(`${v} | Time format change handler failed`, t);
  }
  return () => {
    Xn.delete(e);
  };
}
a(Ci, "onTimeFormatSettingChange");
function fo(e) {
  if (typeof e != "function")
    return () => {
    };
  Qn.add(e);
  try {
    e(Qt);
  } catch (t) {
    console.error(`${v} | Seconds-per-round change handler failed`, t);
  }
  return () => {
    Qn.delete(e);
  };
}
a(fo, "onSecondsPerRoundSettingChange");
let An = !1, Zn = !1;
function ei(e) {
  An = !!e;
}
a(ei, "updateDebugState");
function ur() {
  Zn || (Zn = !0, ei(wi()), uo((e) => {
    ei(e), console.info(`${v} | Debug ${An ? "enabled" : "disabled"}`);
  }));
}
a(ur, "ensureInitialized");
function Ni() {
  return Zn || ur(), An;
}
a(Ni, "shouldLog");
function dr(e) {
  if (!e.length)
    return [`${v} |`];
  const [t, ...n] = e;
  return typeof t == "string" ? [`${v} | ${t}`, ...n] : [`${v} |`, t, ...n];
}
a(dr, "formatArgs");
function go() {
  ur();
}
a(go, "initializeDebug");
function mo() {
  return ei(ao()), An;
}
a(mo, "syncDebugState");
function T(...e) {
  Ni() && console.debug(...dr(e));
}
a(T, "debugLog");
function pt(...e) {
  Ni() && console.group(...dr(e));
}
a(pt, "debugGroup");
function xe() {
  Ni() && console.groupEnd();
}
a(xe, "debugGroupEnd");
function gt(e) {
  var r;
  const t = (r = e == null ? void 0 : e.getFlag) == null ? void 0 : r.call(e, v, or);
  if (!t) return [];
  const n = it(t), i = Array.isArray(n) ? n : [];
  return T("Loaded time triggers", {
    sceneId: (e == null ? void 0 : e.id) ?? null,
    count: i.length
  }), i;
}
a(gt, "getTimeTriggers");
async function fr(e, t) {
  e != null && e.setFlag && (T("Persisting time triggers", {
    sceneId: e.id,
    count: Array.isArray(t) ? t.length : 0
  }), await e.setFlag(v, or, t));
}
a(fr, "setTimeTriggers");
function ho(e) {
  var r;
  const t = (r = e == null ? void 0 : e.getFlag) == null ? void 0 : r.call(e, v, jt);
  if (!t) return {};
  const n = it(t);
  if (!n || typeof n != "object") return {};
  const i = {};
  for (const [o, s] of Object.entries(n))
    typeof s == "number" && Number.isFinite(s) && (i[o] = s);
  return T("Loaded time trigger history", {
    sceneId: (e == null ? void 0 : e.id) ?? null,
    keys: Object.keys(i)
  }), i;
}
a(ho, "getTimeTriggerHistory");
async function xn(e, t) {
  var c, u, d, h;
  if (!e) return;
  const n = {};
  if (t && typeof t == "object")
    for (const [m, y] of Object.entries(t))
      typeof y == "number" && Number.isFinite(y) && (n[m] = y);
  const i = ((c = e.getFlag) == null ? void 0 : c.call(e, v, jt)) ?? {}, r = {};
  if (i && typeof i == "object")
    for (const [m, y] of Object.entries(i))
      typeof y == "number" && Number.isFinite(y) && (r[m] = y);
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
    removedKeys: s.filter((m) => !o.includes(m))
  });
  try {
    s.length && typeof e.unsetFlag == "function" && await e.unsetFlag(v, jt), o.length && await e.setFlag(v, jt, n);
  } catch (m) {
    console.error(`${v} | Failed to persist time trigger history`, m), (h = (d = ui.notifications) == null ? void 0 : d.error) == null || h.call(
      d,
      f(
        "EIDOLON.TimeTrigger.HistoryPersistError",
        "Failed to persist the scene's time trigger history."
      )
    );
  }
}
a(xn, "updateTimeTriggerHistory");
const Zt = /* @__PURE__ */ new Map(), ki = /* @__PURE__ */ new Set();
function yo(e) {
  if (!(e != null && e.id))
    throw new Error(`${v} | Action definitions require an id.`);
  if (Zt.has(e.id))
    throw new Error(`${v} | Duplicate time trigger action id: ${e.id}`);
  Zt.set(e.id, {
    ...e
  }), T("Registered time trigger action", { actionId: e.id });
}
a(yo, "registerAction");
function Rt(e) {
  return Zt.get(e) ?? null;
}
a(Rt, "getAction");
function To(e) {
  const t = Rt(e);
  return t ? typeof t.label == "function" ? t.label() : t.label : e;
}
a(To, "getActionLabel");
function Vi() {
  return Array.from(Zt.values());
}
a(Vi, "listActions");
async function gr(e, t) {
  var i, r;
  const n = Rt(t == null ? void 0 : t.action);
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
a(gr, "executeTriggerAction");
function po(e) {
  const t = Rt(e == null ? void 0 : e.action);
  return !t || typeof t.buildSummaryParts != "function" ? [] : t.buildSummaryParts({ trigger: e, escapeHtml: Jt, localize: f }) ?? [];
}
a(po, "buildActionSummaryParts");
function bo(e) {
  const t = Rt(e == null ? void 0 : e.action);
  return !t || typeof t.buildFormContent != "function" ? "" : t.buildFormContent({ trigger: e, escapeHtml: Jt, localize: f }) ?? "";
}
a(bo, "buildActionFormSection");
function vo(e, t) {
  const n = Rt(e == null ? void 0 : e.action);
  !n || typeof n.prepareFormData != "function" || n.prepareFormData({ trigger: e, formData: t });
}
a(vo, "applyActionFormData");
function Oo(e, t, n) {
  var o, s;
  const i = `${(e == null ? void 0 : e.id) ?? "unknown"}:${(t == null ? void 0 : t.id) ?? (t == null ? void 0 : t.action) ?? "unknown"}:${n}`;
  if (ki.has(i)) return;
  ki.add(i);
  const r = f(
    "EIDOLON.TimeTrigger.MissingDataWarning",
    "A scene time trigger is missing required data and was skipped."
  );
  (s = (o = ui.notifications) == null ? void 0 : o.warn) == null || s.call(o, r), console.warn(`${v} | Missing trigger data (${n})`, { scene: e == null ? void 0 : e.id, trigger: t });
}
a(Oo, "warnMissingTriggerData");
async function Eo({ scene: e, trigger: t }) {
  var o, s, l, c, u;
  const n = (l = (s = (o = t == null ? void 0 : t.data) == null ? void 0 : o.path) == null ? void 0 : s.trim) == null ? void 0 : l.call(s);
  if (!n) {
    Oo(e, t, "missing-audio-path");
    return;
  }
  const i = {
    src: n,
    autoplay: !0,
    loop: !1
  }, r = (() => {
    var d, h, m, y, g;
    return typeof ((h = (d = foundry == null ? void 0 : foundry.audio) == null ? void 0 : d.AudioHelper) == null ? void 0 : h.play) == "function" ? foundry.audio.AudioHelper.play(i, !0) : typeof ((y = (m = game == null ? void 0 : game.audio) == null ? void 0 : m.constructor) == null ? void 0 : y.play) == "function" ? game.audio.constructor.play(i, !0) : typeof ((g = game == null ? void 0 : game.audio) == null ? void 0 : g.play) == "function" ? game.audio.play(i, !0) : null;
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
a(Eo, "executePlaySoundAction");
yo({
  id: qt,
  label: /* @__PURE__ */ a(() => f("EIDOLON.TimeTrigger.ActionPlaySound", "Play Sound"), "label"),
  execute: Eo,
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
var nr;
const { ApplicationV2: _n, HandlebarsApplicationMixin: Dn } = ((nr = foundry.applications) == null ? void 0 : nr.api) ?? {};
if (!_n || !Dn)
  throw new Error(
    `${v} | ApplicationV2 API unavailable. Update Foundry VTT to v13 or newer.`
  );
const qe = "AM", ot = "PM";
function je() {
  return lr();
}
a(je, "getConfiguredTimeFormat");
function Fn(e) {
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
a(Fn, "parseCanonicalTimeString");
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
  const l = t ?? je();
  return en(
    {
      hours: n,
      minutes: i,
      seconds: s
    },
    l
  );
}
a(Io, "formatTimeComponentsForDisplay");
function Lo(e, { format: t } = {}) {
  const n = Fn(e);
  if (!n) return "";
  const i = t ?? je();
  return en(n, i);
}
a(Lo, "formatTriggerTimeForDisplay");
function en(e, t = "12h") {
  if (!e) return "";
  const { hours: n, minutes: i, seconds: r = null } = e;
  if (!Number.isInteger(n) || !Number.isInteger(i)) return "";
  const o = Number.isInteger(r);
  if (t === "24h") {
    const m = `${String(n).padStart(2, "0")}:${String(i).padStart(2, "0")}`;
    return o ? `${m}:${String(r).padStart(2, "0")}` : m;
  }
  const s = n >= 12 ? ot : qe, l = n % 12 === 0 ? 12 : n % 12, c = String(l), u = String(i).padStart(2, "0"), d = `${c}:${u}`, h = s === qe ? f("EIDOLON.TimeTrigger.TimePeriodAM", qe) : f("EIDOLON.TimeTrigger.TimePeriodPM", ot);
  if (o) {
    const m = String(r).padStart(2, "0");
    return `${d}:${m} ${h}`;
  }
  return `${d} ${h}`;
}
a(en, "formatTimeParts");
function Ui(e, t = je()) {
  const n = Fn(e);
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
      period: qe
    };
  const i = n.hours >= 12 ? ot : qe, r = n.hours % 12 === 0 ? 12 : n.hours % 12;
  return {
    format: t,
    canonical: Ce(n) ?? "",
    hour: String(r),
    minute: String(n.minutes).padStart(2, "0"),
    period: i
  };
}
a(Ui, "getTimeFormValues");
function So({ hour: e, minute: t, period: n, time: i }, r = je()) {
  if (r === "24h") {
    const y = typeof e == "string" ? e.trim() : "", g = typeof t == "string" ? t.trim() : "", O = typeof i == "string" ? i.trim() : "";
    if (!y && !g && O) {
      const N = Fn(O);
      return N ? { canonical: Ce(N) ?? "", error: null } : {
        canonical: "",
        error: f(
          "EIDOLON.TimeTrigger.TimeFormatInvalid24",
          "Enter a valid time in HH:MM format."
        )
      };
    }
    if (!y || !g)
      return {
        canonical: "",
        error: f("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.")
      };
    const w = Number(y), p = Number(g);
    return !Number.isInteger(w) || w < 0 || w > 23 ? {
      canonical: "",
      error: f(
        "EIDOLON.TimeTrigger.TimeFormatInvalid24",
        "Enter a valid time in HH:MM format."
      )
    } : !Number.isInteger(p) || p < 0 || p > 59 ? {
      canonical: "",
      error: f(
        "EIDOLON.TimeTrigger.TimeFormatInvalid24",
        "Enter a valid time in HH:MM format."
      )
    } : { canonical: Ce({
      hours: w,
      minutes: p
    }) ?? "", error: null };
  }
  const o = typeof e == "string" ? e.trim() : "", s = typeof t == "string" ? t.trim() : "", l = typeof n == "string" ? n.trim().toUpperCase() : "";
  if (!o || !s || !l)
    return { canonical: "", error: f("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.") };
  if (l !== qe && l !== ot)
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
  const d = c % 12, m = {
    hours: l === ot ? d + 12 : d,
    minutes: u
  };
  return {
    canonical: Ce(m) ?? "",
    error: null
  };
}
a(So, "normalizeFormTimeInput");
function wo() {
  return [
    {
      value: qe,
      label: f("EIDOLON.TimeTrigger.TimePeriodAM", qe)
    },
    {
      value: ot,
      label: f("EIDOLON.TimeTrigger.TimePeriodPM", ot)
    }
  ];
}
a(wo, "getPeriodOptions");
var Ye, Je, $, mr, an, ln, hr, ni, ii, cn, un, yr, Tr, pr, ri, oi, si, dn, fn, ai, gn, br, vr;
const Ke = class Ke extends Dn(_n) {
  constructor(n = {}) {
    var s;
    const { scene: i, showControls: r, ...o } = n ?? {};
    super(o);
    _(this, $);
    _(this, Ye, null);
    _(this, Je, null);
    _(this, an, /* @__PURE__ */ a((n) => {
      var r, o;
      n.preventDefault();
      const i = Number((o = (r = n.currentTarget) == null ? void 0 : r.dataset) == null ? void 0 : o.delta);
      Number.isFinite(i) && (T("Time delta button clicked", { delta: i }), this._advanceTime(i));
    }, "#onDeltaClick"));
    _(this, ln, /* @__PURE__ */ a((n) => {
      var i, r;
      n.preventDefault(), !(!this.showControls || !((i = game.user) != null && i.isGM)) && (T("Time value double clicked", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null }), L(this, $, hr).call(this));
    }, "#onTimeDoubleClick"));
    _(this, cn, /* @__PURE__ */ a((n) => {
      if (this.isEditingTime && !this._commitTimeInProgress)
        if (n.key === "Enter") {
          n.preventDefault();
          const i = n.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
          L(this, $, ii).call(this, r);
        } else n.key === "Escape" && (n.preventDefault(), L(this, $, ni).call(this));
    }, "#onTimeInputKeydown"));
    _(this, un, /* @__PURE__ */ a((n) => {
      if (!this.isEditingTime || this._commitTimeInProgress || this._suppressBlurCommit) return;
      const i = n.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
      L(this, $, ii).call(this, r);
    }, "#onTimeInputBlur"));
    _(this, dn, /* @__PURE__ */ a((n) => {
      const i = !!n;
      if (this.manageTimeEnabled === i) return;
      this.manageTimeEnabled = i, (this.rendered ?? this.isRendered ?? !1) && this.render({ force: !0 });
    }, "#handleManageTimeChange"));
    _(this, fn, /* @__PURE__ */ a(async (n) => {
      var o, s, l, c, u, d, h, m, y;
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
        await i.setFlag(v, Bn, r), this.sceneAllowsRealTime = r;
        const g = r ? f(
          "EIDOLON.TimeTrigger.SceneRealTimeEnabled",
          "Automatic real-time flow enabled for this scene."
        ) : f(
          "EIDOLON.TimeTrigger.SceneRealTimeDisabled",
          "Automatic real-time flow disabled for this scene."
        );
        (h = (d = ui.notifications) == null ? void 0 : d.info) == null || h.call(d, g);
      } catch (g) {
        console.error(`${v} | Failed to toggle scene real-time flow`, g), (y = (m = ui.notifications) == null ? void 0 : m.error) == null || y.call(
          m,
          f(
            "EIDOLON.TimeTrigger.SceneRealTimeToggleError",
            "Failed to update the scene's real-time flow setting."
          )
        );
      } finally {
        this.render({ force: !0 });
      }
    }, "#onRealTimeToggleClick"));
    _(this, gn, /* @__PURE__ */ a(() => {
      (this.rendered ?? this.isRendered ?? !1) && (this.isEditingTime && (this.editValue = L(this, $, ri).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    this.scene = i ?? null, this.showControls = typeof r == "boolean" ? r : !!((s = game.user) != null && s.isGM), this.isEditingTime = !1, this.editValue = "", this._commitTimeInProgress = !1, this._suppressBlurCommit = !1, this.manageTimeEnabled = !1, this.sceneAllowsRealTime = L(this, $, ai).call(this), D(this, Ye, Ci(b(this, gn))), D(this, Je, cr(b(this, dn)));
  }
  async _prepareContext() {
    var p, E;
    const n = ((p = game.time) == null ? void 0 : p.components) ?? {}, r = ((n == null ? void 0 : n.second) !== void 0 && (n == null ? void 0 : n.second) !== null ? Io(n) : null) ?? L(this, $, mr).call(this), o = je(), s = o === "24h", l = s ? f("EIDOLON.TimeTrigger.EditTimePlaceholder24", "HH:MM") : f("EIDOLON.TimeTrigger.EditTimePlaceholder12", "HH:MM AM/PM"), c = this.showControls ? f(
      "EIDOLON.TimeTrigger.EditTimeHint",
      "Double-click to set a specific time."
    ) : "", u = this.showControls ? f(
      "EIDOLON.TimeTrigger.EditTimeLabel",
      "New time (HH:MM or HH:MM AM/PM)"
    ) : "", d = ro.map((N) => ({
      minutes: N,
      label: N > 0 ? `+${N}` : `${N}`
    })), h = !!this.manageTimeEnabled, m = L(this, $, ai).call(this);
    this.sceneAllowsRealTime = m;
    const y = f(
      "EIDOLON.TimeTrigger.SceneRealTimeEnable",
      "Enable automatic real-time flow for this scene."
    ), g = f(
      "EIDOLON.TimeTrigger.SceneRealTimeDisable",
      "Disable automatic real-time flow for this scene."
    ), O = f(
      "EIDOLON.TimeTrigger.SceneRealTimeManageDisabled",
      "Enable Manage Time in module settings to allow automatic real-time flow."
    );
    return {
      formattedTime: r,
      deltas: d,
      manageTimeEnabled: h,
      sceneAllowsRealTime: m,
      realTimeButtonLabel: h ? m ? g : y : O,
      isGM: ((E = game.user) == null ? void 0 : E.isGM) ?? !1,
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
    return L(this, $, br).call(this), L(this, $, vr).call(this), i;
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
    } catch (h) {
      console.error(`${v} | Failed to advance time`, h), (u = (c = ui.notifications) == null ? void 0 : c.error) == null || u.call(
        c,
        f("EIDOLON.TimeTrigger.Error", "Failed to update the world time.")
      ), T("Failed to advance time from window", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        minutes: n,
        message: (h == null ? void 0 : h.message) ?? String(h)
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
          u.addEventListener("click", b(this, an));
        });
        const s = r.querySelector('.time-trigger-window__time-value[data-editable="true"]');
        s && s.addEventListener("dblclick", b(this, ln), { once: !1 });
        const l = r.querySelector(".time-trigger-window__time-input");
        l && (l.addEventListener("keydown", b(this, cn)), l.addEventListener("blur", b(this, un)), typeof l.focus == "function" && (l.focus(), typeof l.select == "function" && l.select()));
        const c = r.querySelector('[data-action="toggle-real-time"]');
        c && c.addEventListener("click", b(this, fn));
      }
      this._suppressBlurCommit = !1;
    }
  }
};
Ye = new WeakMap(), Je = new WeakMap(), $ = new WeakSet(), mr = /* @__PURE__ */ a(function() {
  var c;
  const n = (c = game.time) == null ? void 0 : c.worldTime;
  if (typeof n != "number" || !Number.isFinite(n)) return "";
  const i = 1440 * 60, r = (Math.floor(n) % i + i) % i, o = Math.floor(r / 3600), s = Math.floor(r % 3600 / 60), l = r % 60;
  return en({ hours: o, minutes: s, seconds: l }, je());
}, "#formatFallbackTime"), an = new WeakMap(), ln = new WeakMap(), hr = /* @__PURE__ */ a(function() {
  var n;
  (n = game.user) != null && n.isGM && (this.isEditingTime = !0, this._suppressBlurCommit = !1, this.editValue = L(this, $, ri).call(this), this.render({ force: !0 }));
}, "#enterTimeEditMode"), ni = /* @__PURE__ */ a(function() {
  this.isEditingTime = !1, this.editValue = "", this._suppressBlurCommit = !1, this.render({ force: !0 });
}, "#cancelTimeEdit"), ii = /* @__PURE__ */ a(async function(n) {
  var o, s, l;
  if (!((o = game.user) != null && o.isGM) || !this.isEditingTime || this._commitTimeInProgress) return;
  this._commitTimeInProgress = !0;
  const i = typeof n == "string" ? n.trim() : "";
  if (!i) {
    L(this, $, ni).call(this), this._commitTimeInProgress = !1;
    return;
  }
  const r = L(this, $, pr).call(this, i);
  if (r.error) {
    (l = (s = ui.notifications) == null ? void 0 : s.error) == null || l.call(s, r.error), this._suppressBlurCommit = !0, this.editValue = i, this.render({ force: !0 }), this._commitTimeInProgress = !1;
    return;
  }
  try {
    await L(this, $, Tr).call(this, r.seconds, r.includeSeconds) ? (this.isEditingTime = !1, this.editValue = "", this.render({ force: !0 })) : (this.editValue = i, this.render({ force: !0 }));
  } finally {
    this._commitTimeInProgress = !1;
  }
}, "#commitTimeInput"), cn = new WeakMap(), un = new WeakMap(), yr = /* @__PURE__ */ a(function() {
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
}, "#getCurrentCanonicalTime"), Tr = /* @__PURE__ */ a(async function(n, i) {
  var m, y, g, O, w, p, E, N, F, R;
  const r = (m = game.time) == null ? void 0 : m.worldTime;
  if (typeof r != "number" || !Number.isFinite(r))
    return (g = (y = ui.notifications) == null ? void 0 : y.error) == null || g.call(
      y,
      f(
        "EIDOLON.TimeTrigger.EditTimeUnavailable",
        "The world time is unavailable, so it can't be updated."
      )
    ), !1;
  if (!Number.isInteger(n) || n < 0 || n >= ft)
    return (w = (O = ui.notifications) == null ? void 0 : O.error) == null || w.call(
      O,
      f(
        "EIDOLON.TimeTrigger.EditTimeInvalidRange",
        "Enter a time within the current day."
      )
    ), !1;
  const l = Math.floor(r / ft) * ft + n - r;
  if (!Number.isFinite(l) || l === 0)
    return !0;
  const c = Math.floor(n / 3600), u = Math.floor(n % 3600 / 60), d = n % 60, h = Ce({
    hours: c,
    minutes: u,
    seconds: i ? d : void 0
  });
  try {
    T("Updating world time directly", {
      sceneId: ((p = this.scene) == null ? void 0 : p.id) ?? null,
      targetCanonical: h ?? null,
      diff: l
    }), await game.time.advance(l);
    const I = en(
      {
        hours: c,
        minutes: u,
        seconds: i ? d : null
      },
      je()
    );
    (N = (E = ui.notifications) == null ? void 0 : E.info) == null || N.call(
      E,
      f(
        "EIDOLON.TimeTrigger.EditTimeSuccess",
        "World time updated."
      ) + (I ? ` ${I}` : "")
    );
  } catch (I) {
    return console.error(`${v} | Failed to set world time`, I), (R = (F = ui.notifications) == null ? void 0 : F.error) == null || R.call(
      F,
      f(
        "EIDOLON.TimeTrigger.EditTimeError",
        "Failed to update the world time."
      )
    ), !1;
  }
  return !0;
}, "#applyTargetSeconds"), pr = /* @__PURE__ */ a(function(n) {
  var h;
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
    const m = Number(o[1]), y = Number(o[2]), g = o[3] !== void 0 ? Number(o[3]) : void 0;
    if (Number.isInteger(m) && m >= 0 && m <= 23 && Number.isInteger(y) && y >= 0 && y <= 59 && (g === void 0 || Number.isInteger(g) && g >= 0 && g <= 59)) {
      const O = m * 3600 + y * 60 + (g ?? 0);
      return {
        canonical: Ce({ hours: m, minutes: y, seconds: g }),
        seconds: O,
        includeSeconds: g !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const { amLower: s, pmLower: l, periodPattern: c } = L(this, $, oi).call(this), u = r.match(
    new RegExp(
      `^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?\\s*(${c})$`,
      "i"
    )
  );
  if (u) {
    let m = Number(u[1]);
    const y = Number(u[2]), g = u[3] !== void 0 ? Number(u[3]) : void 0, O = u[4] ?? "", w = typeof O == "string" ? ((h = O.toLocaleLowerCase) == null ? void 0 : h.call(O)) ?? O.toLowerCase() : "";
    if (Number.isInteger(m) && m >= 1 && m <= 12 && Number.isInteger(y) && y >= 0 && y <= 59 && (g === void 0 || Number.isInteger(g) && g >= 0 && g <= 59) && (w === s || w === l || w === "am" || w === "pm")) {
      m = m % 12, (w === l || w === "pm") && (m += 12);
      const E = m * 3600 + y * 60 + (g ?? 0);
      return {
        canonical: Ce({ hours: m, minutes: y, seconds: g }),
        seconds: E,
        includeSeconds: g !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const d = sr(r);
  if (d !== null) {
    const m = Math.floor(d / 3600), y = Math.floor(d % 3600 / 60), g = d % 60, O = g !== 0;
    return {
      canonical: Ce({
        hours: m,
        minutes: y,
        seconds: O ? g : void 0
      }),
      seconds: d,
      includeSeconds: O,
      error: null
    };
  }
  return { error: i };
}, "#parseInputTime"), ri = /* @__PURE__ */ a(function() {
  const n = L(this, $, yr).call(this);
  if (!n) return "";
  if (je() === "24h")
    return n;
  const r = Fn(n);
  if (!r) return n;
  const o = Number(r.hours), s = Number(r.minutes), l = r.seconds !== null && r.seconds !== void 0 ? Number(r.seconds) : void 0;
  if (!Number.isFinite(o) || !Number.isFinite(s)) return n;
  const c = Number.isFinite(l), u = o % 12 === 0 ? 12 : o % 12, d = String(s).padStart(2, "0"), h = c ? `:${String(l).padStart(2, "0")}` : "", { amLabel: m, pmLabel: y } = L(this, $, oi).call(this), g = o >= 12 ? y : m;
  return `${u}:${d}${h} ${g}`.trim();
}, "#getInitialEditValue"), oi = /* @__PURE__ */ a(function() {
  var u, d;
  const n = f("EIDOLON.TimeTrigger.TimePeriodAM", "AM"), i = f("EIDOLON.TimeTrigger.TimePeriodPM", "PM"), r = ((u = n.toLocaleLowerCase) == null ? void 0 : u.call(n)) ?? n.toLowerCase(), o = ((d = i.toLocaleLowerCase) == null ? void 0 : d.call(i)) ?? i.toLowerCase(), s = L(this, $, si).call(this, n), l = L(this, $, si).call(this, i), c = `${s}|${l}|AM|PM`;
  return {
    amLabel: n,
    pmLabel: i,
    amLower: r,
    pmLower: o,
    periodPattern: c
  };
}, "#getPeriodMatchData"), si = /* @__PURE__ */ a(function(n) {
  return typeof n != "string" ? "" : n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}, "#escapeForRegex"), dn = new WeakMap(), fn = new WeakMap(), ai = /* @__PURE__ */ a(function() {
  const n = this.scene;
  if (!n || typeof n.getFlag != "function") return !1;
  try {
    return !!n.getFlag(v, Bn);
  } catch (i) {
    T("TimeTriggerWindow | Failed to read scene real-time flag", {
      sceneId: (n == null ? void 0 : n.id) ?? null,
      message: (i == null ? void 0 : i.message) ?? String(i)
    });
  }
  return !1;
}, "#readSceneRealTimeFlag"), gn = new WeakMap(), br = /* @__PURE__ */ a(function() {
  if (typeof b(this, Ye) == "function")
    try {
      b(this, Ye).call(this);
    } catch (n) {
      console.error(`${v} | Failed to dispose time format subscription`, n);
    }
  D(this, Ye, null);
}, "#disposeTimeFormatSubscription"), vr = /* @__PURE__ */ a(function() {
  if (typeof b(this, Je) == "function")
    try {
      b(this, Je).call(this);
    } catch (n) {
      console.error(`${v} | Failed to dispose manage time subscription`, n);
    }
  D(this, Je, null);
}, "#disposeManageTimeSubscription"), a(Ke, "TimeTriggerWindow"), We(Ke, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  ct(Ke, Ke, "DEFAULT_OPTIONS"),
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
)), We(Ke, "PARTS", {
  content: {
    template: `modules/${v}/templates/time-trigger.html`
  }
});
let ti = Ke;
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
const xi = /* @__PURE__ */ new Set();
var ne, me, Qe, vt, Or, Er;
const Fi = class Fi {
  constructor({ windowFactory: t } = {}) {
    _(this, vt);
    _(this, ne, null);
    _(this, me, null);
    _(this, Qe);
    const n = Mi(ti);
    typeof t == "function" ? t.__eidolonFactorySignature === "options" ? D(this, Qe, (r, o = {}) => t({ scene: r, ...o ?? {} })) : D(this, Qe, t) : D(this, Qe, /* @__PURE__ */ a((r, o = {}) => n({ scene: r, ...o ?? {} }), "fallbackFactory"));
  }
  onReady() {
    var n;
    const t = typeof ((n = game.time) == null ? void 0 : n.worldTime) == "number" && Number.isFinite(game.time.worldTime) ? game.time.worldTime : null;
    T("TimeTriggerManager#onReady", { worldTime: t }), t !== null && D(this, me, t);
  }
  onCanvasReady(t) {
    const n = (t == null ? void 0 : t.scene) ?? Ct();
    T("TimeTriggerManager#onCanvasReady", { sceneId: (n == null ? void 0 : n.id) ?? null }), this.refreshTimeTriggerWindow(n), this.handleTimeTriggerEvaluation(n);
  }
  onUpdateScene(t) {
    const n = Ct();
    T("TimeTriggerManager#onUpdateScene", {
      sceneId: (t == null ? void 0 : t.id) ?? null,
      activeSceneId: (n == null ? void 0 : n.id) ?? null
    }), !(!n || t.id !== n.id) && (this.refreshTimeTriggerWindow(t), this.handleTimeTriggerEvaluation(t));
  }
  onUpdateWorldTime(t, n) {
    T("TimeTriggerManager#onUpdateWorldTime", {
      worldTime: t,
      diff: n,
      hasWindow: !!b(this, ne)
    }), b(this, ne) && b(this, ne).render();
    const i = Ct(), r = L(this, vt, Or).call(this, t, n);
    this.handleTimeTriggerEvaluation(i, t, r);
  }
  refreshTimeTriggerWindow(t) {
    var c, u, d;
    if (!t) return;
    const n = !!((c = game.user) != null && c.isGM), i = !!t.getFlag(v, Yt), r = !!t.getFlag(v, jn), o = !!t.getFlag(v, qn);
    if (T("TimeTriggerManager#refreshTimeTriggerWindow", {
      sceneId: t.id,
      isGM: n,
      isActive: i,
      hideWindow: r,
      showPlayerWindow: o
    }), !(i && !r && (n || o))) {
      b(this, ne) && (T("Closing time trigger window", { reason: "not-visible" }), b(this, ne).close({ force: !0 }), D(this, ne, null));
      return;
    }
    const l = !!n;
    if (b(this, ne) && ((u = b(this, ne).scene) == null ? void 0 : u.id) === t.id) {
      T("Refreshing existing time trigger window", { sceneId: t.id }), b(this, ne).showControls = l, b(this, ne).render();
      return;
    }
    b(this, ne) && (T("Closing existing window before creating new instance", {
      previousSceneId: ((d = b(this, ne).scene) == null ? void 0 : d.id) ?? null
    }), b(this, ne).close({ force: !0 })), D(this, ne, b(this, Qe).call(this, t, { showControls: l })), T("Rendering new time trigger window", { sceneId: t.id }), b(this, ne).render({ force: !0 });
  }
  async handleTimeTriggerEvaluation(t, n, i) {
    var c;
    const r = t ?? Ct();
    if (!r) {
      T("handleTimeTriggerEvaluation skipped", {
        reason: "no-active-scene",
        providedSceneId: (t == null ? void 0 : t.id) ?? null,
        currentWorldTime: n
      }), typeof n == "number" && Number.isFinite(n) && D(this, me, n);
      return;
    }
    const o = typeof n == "number" && Number.isFinite(n) ? n : typeof ((c = game.time) == null ? void 0 : c.worldTime) == "number" ? game.time.worldTime : null;
    if (o === null) return;
    const s = typeof i == "number" && Number.isFinite(i) ? i : null, l = s !== null ? s : typeof b(this, me) == "number" && Number.isFinite(b(this, me)) ? b(this, me) : o;
    pt("handleTimeTriggerEvaluation", {
      sceneId: r.id,
      previousWorldTime: l,
      currentWorldTime: o,
      overrideProvided: s !== null
    });
    try {
      await L(this, vt, Er).call(this, r, l, o);
    } catch (u) {
      console.error(`${v} | Unexpected error while evaluating time triggers`, u), T("handleTimeTriggerEvaluation error", { message: (u == null ? void 0 : u.message) ?? String(u) });
    } finally {
      D(this, me, o), xe();
    }
  }
};
ne = new WeakMap(), me = new WeakMap(), Qe = new WeakMap(), vt = new WeakSet(), Or = /* @__PURE__ */ a(function(t, n) {
  return typeof b(this, me) == "number" && Number.isFinite(b(this, me)) ? (T("Resolved previous world time from cache", {
    previousWorldTime: b(this, me)
  }), b(this, me)) : typeof t == "number" && Number.isFinite(t) && typeof n == "number" && Number.isFinite(n) ? (T("Resolved previous world time using diff", {
    worldTime: t,
    diff: n,
    resolved: t - n
  }), t - n) : typeof t == "number" && Number.isFinite(t) ? t : null;
}, "#resolvePreviousWorldTime"), Er = /* @__PURE__ */ a(async function(t, n, i) {
  var g, O, w;
  if (!((g = game.user) != null && g.isGM)) {
    T("Skipping trigger evaluation because user is not a GM");
    return;
  }
  if (!(t != null && t.id)) {
    T("Skipping trigger evaluation because the scene is missing an id");
    return;
  }
  if (!!!t.getFlag(v, Yt)) {
    T("Skipping trigger evaluation because scene is inactive", { sceneId: t.id });
    return;
  }
  if (typeof i != "number" || !Number.isFinite(i)) return;
  (typeof n != "number" || !Number.isFinite(n)) && (n = i);
  const o = gt(t);
  if (!o.length) {
    T("No time triggers configured for scene", { sceneId: t.id });
    return;
  }
  const s = ho(t), l = /* @__PURE__ */ new Set();
  for (const p of o)
    p != null && p.id && l.add(p.id);
  let c = !1;
  for (const p of Object.keys(s))
    l.has(p) || (delete s[p], c = !0);
  if (pt("Evaluating scene time triggers", {
    sceneId: t.id,
    previousWorldTime: n,
    currentWorldTime: i,
    triggerCount: o.length
  }), i <= n) {
    T("Detected world time rewind", {
      previousWorldTime: n,
      currentWorldTime: i
    });
    for (const p of o) {
      if (!(p != null && p.id) || !p.allowReplayOnRewind) continue;
      const E = s[p.id];
      typeof E == "number" ? i < E ? (T("Clearing trigger history due to rewind", {
        triggerId: p.id,
        lastFired: E,
        currentWorldTime: i
      }), delete s[p.id], c = !0) : T("Preserving trigger history after rewind", {
        triggerId: p.id,
        lastFired: E,
        currentWorldTime: i
      }) : T("No history stored for rewind-enabled trigger", {
        triggerId: p.id
      });
    }
    c && (T("Persisting history cleanup after rewind", {
      sceneId: t.id
    }), await xn(t, s)), xe();
    return;
  }
  const u = n, d = i, h = [], m = Math.floor(u / ft), y = Math.floor(d / ft);
  for (const p of o) {
    if (!(p != null && p.id)) continue;
    const E = sr(p.time);
    if (E === null) {
      Co(t, p), T("Skipping trigger with invalid time", {
        triggerId: p.id,
        time: p.time
      });
      continue;
    }
    for (let N = m; N <= y; N++) {
      const F = N * ft + E;
      if (F < u || F > d) continue;
      const I = s[p.id];
      if (typeof I == "number" && I >= F) {
        T("Skipping trigger because it already fired within window", {
          triggerId: p.id,
          lastFired: I,
          absoluteTime: F
        });
        continue;
      }
      h.push({ trigger: p, absoluteTime: F });
    }
  }
  if (!h.length) {
    c && await xn(t, s), T("No triggers scheduled to fire within evaluation window", {
      sceneId: t.id
    }), xe();
    return;
  }
  h.sort((p, E) => p.absoluteTime - E.absoluteTime), T("Queued triggers for execution", {
    entries: h.map((p) => ({
      triggerId: p.trigger.id,
      absoluteTime: p.absoluteTime
    }))
  });
  for (const p of h)
    try {
      T("Executing time trigger action", {
        triggerId: p.trigger.id,
        absoluteTime: p.absoluteTime
      }), await gr(t, p.trigger);
    } catch (E) {
      console.error(`${v} | Failed to execute time trigger action`, E), (w = (O = ui.notifications) == null ? void 0 : O.error) == null || w.call(
        O,
        f(
          "EIDOLON.TimeTrigger.TriggerActionError",
          "Failed to execute a scene time trigger action. Check the console for details."
        )
      ), T("Trigger execution failed", {
        triggerId: p.trigger.id,
        message: (E == null ? void 0 : E.message) ?? String(E)
      });
    } finally {
      s[p.trigger.id] = p.absoluteTime, c = !0, T("Recorded trigger execution", {
        triggerId: p.trigger.id,
        absoluteTime: p.absoluteTime
      });
    }
  c && (T("Persisting trigger history updates", { sceneId: t.id }), await xn(t, s)), xe();
}, "#evaluateSceneTimeTriggers"), a(Fi, "TimeTriggerManager");
let li = Fi;
function Co(e, t) {
  var r, o;
  const n = `${(e == null ? void 0 : e.id) ?? "unknown"}:${(t == null ? void 0 : t.id) ?? (t == null ? void 0 : t.time) ?? "unknown"}`;
  if (xi.has(n)) return;
  xi.add(n);
  const i = f(
    "EIDOLON.TimeTrigger.InvalidTimeWarning",
    "A scene time trigger has an invalid time value and was skipped."
  );
  (o = (r = ui.notifications) == null ? void 0 : r.warn) == null || o.call(r, i), console.warn(`${v} | Invalid time for trigger`, { scene: e == null ? void 0 : e.id, trigger: t });
}
a(Co, "warnInvalidTriggerTime");
var be, At, ve, Ve, Xe, Se, Tt, mn, hn, _t, Dt, Ze, we, A, di, dt, Bt, fi, Gt, gi, Le, Ir, mi, Lr, hi, Sr, yn, Tn, pn, bn, vn, On, yi, wr, zt, En, In;
const Pi = class Pi {
  constructor() {
    _(this, A);
    _(this, be, !1);
    _(this, At, Pt);
    _(this, ve, /* @__PURE__ */ new Map());
    _(this, Ve, null);
    _(this, Xe, null);
    _(this, Se, 0);
    _(this, Tt, null);
    _(this, mn, null);
    _(this, hn, null);
    _(this, _t, !1);
    _(this, Dt, !1);
    _(this, Ze, !1);
    _(this, we, !1);
    _(this, yn, /* @__PURE__ */ a((t, n = {}) => {
      T("GameTimeAutomation | Pause state changed", {
        paused: t,
        userId: (n == null ? void 0 : n.userId) ?? null,
        broadcast: (n == null ? void 0 : n.broadcast) ?? null
      }), L(this, A, Le).call(this, { pausedOverride: t });
    }, "#handlePause"));
    _(this, Tn, /* @__PURE__ */ a((t) => {
      t != null && t.id && (b(this, ve).set(t.id, Math.max(t.round ?? 0, 1)), T("GameTimeAutomation | Combat started", { combatId: t.id, round: t.round ?? 0 }), L(this, A, Le).call(this));
    }, "#handleCombatStart"));
    _(this, pn, /* @__PURE__ */ a((t, n) => {
      if (!(t != null && t.id)) return;
      const i = typeof n == "number" && Number.isFinite(n) ? n : typeof t.round == "number" && Number.isFinite(t.round) ? t.round : 0, r = i > 0 ? i : 1, o = b(this, ve).get(t.id), s = o ? Math.max(o, 1) : 1, l = r > 1 ? Math.max(r - s, 0) : 0;
      if (T("GameTimeAutomation | Combat round change detected", {
        combatId: t.id,
        effectiveRound: r,
        completedRounds: l,
        enabled: b(this, be),
        paused: (game == null ? void 0 : game.paused) ?? null
      }), l > 0 && b(this, be) && b(this, we) && !(game != null && game.paused) && L(this, A, dt).call(this) && L(this, A, Bt).call(this, t)) {
        const c = l * b(this, At);
        c > 0 && (T("GameTimeAutomation | Advancing time for completed combat rounds", {
          combatId: t.id,
          completedRounds: l,
          delta: c
        }), L(this, A, hi).call(this, c));
      }
      b(this, ve).set(t.id, Math.max(r, 1));
    }, "#handleCombatRound"));
    _(this, bn, /* @__PURE__ */ a((t) => {
      t != null && t.id && (b(this, ve).delete(t.id), T("GameTimeAutomation | Combat ended", { combatId: t.id }), L(this, A, Le).call(this));
    }, "#handleCombatEnd"));
    _(this, vn, /* @__PURE__ */ a((t) => {
      t != null && t.id && (b(this, ve).delete(t.id), T("GameTimeAutomation | Combat deleted", { combatId: t.id }), L(this, A, Le).call(this));
    }, "#handleCombatDelete"));
    _(this, On, /* @__PURE__ */ a((t, n) => {
      if (t != null && t.id) {
        if (typeof (n == null ? void 0 : n.round) == "number" && Number.isFinite(n.round)) {
          const i = Math.max(n.round, 1);
          b(this, ve).set(t.id, i), T("GameTimeAutomation | Combat round manually updated", {
            combatId: t.id,
            round: i
          });
        }
        (Object.prototype.hasOwnProperty.call(n ?? {}, "active") || (n == null ? void 0 : n.round) !== void 0) && L(this, A, Le).call(this);
      }
    }, "#handleCombatUpdate"));
    _(this, En, /* @__PURE__ */ a((t) => {
      L(this, A, zt).call(this, t == null ? void 0 : t.scene), L(this, A, Le).call(this);
    }, "#handleCanvasReady"));
    _(this, In, /* @__PURE__ */ a((t) => {
      if (!ue(t)) return;
      const n = L(this, A, yi).call(this);
      if (!n || n.id !== t.id) return;
      L(this, A, zt).call(this, t) && L(this, A, Le).call(this);
    }, "#handleSceneUpdate"));
  }
  registerHooks() {
    b(this, _t) || (D(this, _t, !0), Hooks.on("pauseGame", b(this, yn)), Hooks.on("combatStart", b(this, Tn)), Hooks.on("combatRound", b(this, pn)), Hooks.on("combatEnd", b(this, bn)), Hooks.on("deleteCombat", b(this, vn)), Hooks.on("updateCombat", b(this, On)), Hooks.on("canvasReady", b(this, En)), Hooks.on("updateScene", b(this, In)));
  }
  initialize() {
    b(this, Dt) || (D(this, Dt, !0), D(this, mn, cr((t) => {
      const n = !!t, i = n !== b(this, be);
      D(this, be, n), T("GameTimeAutomation | Manage time toggled", { enabled: n }), i && n && L(this, A, gi).call(this), L(this, A, Le).call(this);
    })), D(this, hn, fo((t) => {
      D(this, At, t), T("GameTimeAutomation | Seconds per round updated", { value: t });
    })), L(this, A, gi).call(this), L(this, A, zt).call(this), L(this, A, Le).call(this));
  }
};
be = new WeakMap(), At = new WeakMap(), ve = new WeakMap(), Ve = new WeakMap(), Xe = new WeakMap(), Se = new WeakMap(), Tt = new WeakMap(), mn = new WeakMap(), hn = new WeakMap(), _t = new WeakMap(), Dt = new WeakMap(), Ze = new WeakMap(), we = new WeakMap(), A = new WeakSet(), di = /* @__PURE__ */ a(function() {
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
}, "#currentTimestamp"), dt = /* @__PURE__ */ a(function() {
  var t;
  return !!((t = game == null ? void 0 : game.user) != null && t.isGM && game.user.active !== !1);
}, "#canControlTime"), Bt = /* @__PURE__ */ a(function(t) {
  var i, r;
  if (!t) return !1;
  if (t.active === !0) return !0;
  if (t.active === !1) return !1;
  const n = (i = game == null ? void 0 : game.combats) == null ? void 0 : i.active;
  return (n == null ? void 0 : n.id) === t.id ? !0 : ((r = game == null ? void 0 : game.combat) == null ? void 0 : r.id) === t.id ? game.combat.active ?? !0 : !1;
}, "#isCombatDocumentActive"), fi = /* @__PURE__ */ a(function(t) {
  return t ? typeof t.started == "boolean" ? t.started : (t.round ?? 0) > 0 : !1;
}, "#hasCombatStarted"), Gt = /* @__PURE__ */ a(function() {
  var i;
  const t = Array.isArray((i = game == null ? void 0 : game.combats) == null ? void 0 : i.contents) ? game.combats.contents : [];
  for (const r of t)
    if (L(this, A, Bt).call(this, r) && L(this, A, fi).call(this, r))
      return !0;
  const n = game == null ? void 0 : game.combat;
  return !!(n && L(this, A, Bt).call(this, n) && L(this, A, fi).call(this, n));
}, "#isCombatRunning"), gi = /* @__PURE__ */ a(function() {
  var n;
  b(this, ve).clear();
  const t = Array.isArray((n = game == null ? void 0 : game.combats) == null ? void 0 : n.contents) ? game.combats.contents : [];
  for (const i of t)
    i != null && i.id && b(this, ve).set(i.id, Math.max(i.round ?? 0, 1));
}, "#hydrateRoundTracking"), Le = /* @__PURE__ */ a(function({ pausedOverride: t } = {}) {
  const n = typeof t == "boolean" ? t : !!(game != null && game.paused), i = b(this, be), r = b(this, we), o = i && r, s = {
    manageTimeEnabled: i,
    sceneAllowsRealTime: r,
    effectiveEnabled: o,
    paused: n,
    canControl: L(this, A, dt).call(this),
    combatRunning: L(this, A, Gt).call(this),
    overrideApplied: typeof t == "boolean"
  };
  if (T("GameTimeAutomation | Sync running state", s), !o || !L(this, A, dt).call(this)) {
    L(this, A, mi).call(this);
    return;
  }
  L(this, A, Ir).call(this);
}, "#syncRunningState"), Ir = /* @__PURE__ */ a(function() {
  b(this, Ve) === null && (D(this, Xe, L(this, A, di).call(this)), D(this, Ve, globalThis.setInterval(() => L(this, A, Lr).call(this), 1e3)), T("GameTimeAutomation | Started real-time ticker"));
}, "#startRealTimeTicker"), mi = /* @__PURE__ */ a(function() {
  b(this, Ve) !== null && (globalThis.clearInterval(b(this, Ve)), D(this, Ve, null), T("GameTimeAutomation | Stopped real-time ticker")), D(this, Xe, null), D(this, Se, 0), D(this, Ze, !1);
}, "#stopRealTimeTicker"), Lr = /* @__PURE__ */ a(function() {
  if (!b(this, be) || !b(this, we) || !L(this, A, dt).call(this)) {
    L(this, A, mi).call(this);
    return;
  }
  const t = L(this, A, di).call(this);
  if (typeof t != "number" || !Number.isFinite(t)) return;
  const n = b(this, Xe) ?? t, i = (t - n) / 1e3;
  if (D(this, Xe, t), !Number.isFinite(i) || i <= 0) return;
  const r = !!(game != null && game.paused), o = L(this, A, Gt).call(this);
  if (r || o) {
    b(this, Ze) || T("GameTimeAutomation | Tick skipped", { paused: r, combatRunning: o }), D(this, Ze, !0), D(this, Se, 0);
    return;
  }
  D(this, Ze, !1), T("GameTimeAutomation | Real-time tick", { deltaSeconds: i }), L(this, A, hi).call(this, i);
}, "#tickRealTime"), hi = /* @__PURE__ */ a(function(t) {
  if (!b(this, be) || !b(this, we)) return;
  const n = Number(t);
  !Number.isFinite(n) || n <= 0 || (D(this, Se, b(this, Se) + n), !b(this, Tt) && D(this, Tt, L(this, A, Sr).call(this)));
}, "#queueAdvance"), Sr = /* @__PURE__ */ a(async function() {
  var t, n;
  for (; b(this, Se) > 0; ) {
    if (!b(this, be) || !b(this, we) || game != null && game.paused || !L(this, A, dt).call(this) || L(this, A, Gt).call(this)) {
      D(this, Se, 0);
      break;
    }
    const i = b(this, Se);
    D(this, Se, 0);
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
  D(this, Tt, null);
}, "#flushAdvanceQueue"), yn = new WeakMap(), Tn = new WeakMap(), pn = new WeakMap(), bn = new WeakMap(), vn = new WeakMap(), On = new WeakMap(), yi = /* @__PURE__ */ a(function() {
  const t = Ct();
  return ue(t) ? t : null;
}, "#getActiveSceneDocument"), wr = /* @__PURE__ */ a(function(t) {
  if (!ue(t)) return !1;
  try {
    return !!t.getFlag(v, Bn);
  } catch (n) {
    return T("GameTimeAutomation | Failed to read scene real-time flag", {
      sceneId: (t == null ? void 0 : t.id) ?? null,
      message: (n == null ? void 0 : n.message) ?? String(n)
    }), !1;
  }
}, "#isSceneRealTimeAllowed"), zt = /* @__PURE__ */ a(function(t) {
  const n = ue(t) ? t : L(this, A, yi).call(this), i = L(this, A, wr).call(this, n), r = b(this, we);
  return D(this, we, i), r !== i ? (T("GameTimeAutomation | Scene real-time allowance changed", {
    sceneId: (n == null ? void 0 : n.id) ?? null,
    allows: i
  }), !0) : !1;
}, "#refreshSceneAutomationState"), En = new WeakMap(), In = new WeakMap(), a(Pi, "GameTimeAutomation");
let ci = Pi;
var ir, Ue, ce, et, Pe, Ln, te, Cr, Nr, Mr, Ar, Sn, pi, wn, _r, Cn, Dr, Fr;
const De = class De extends Dn(_n) {
  constructor(n = {}) {
    const { scene: i, trigger: r, triggerIndex: o, onSave: s, ...l } = n ?? {};
    super(l);
    _(this, te);
    _(this, Ue, null);
    _(this, ce, null);
    _(this, et, null);
    _(this, Pe, null);
    _(this, Ln, /* @__PURE__ */ a(() => {
      (this.rendered ?? this.isRendered ?? !1) && (D(this, Pe, L(this, te, Cr).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    _(this, Sn, /* @__PURE__ */ a((n) => {
      var o, s;
      const i = n.currentTarget, r = i == null ? void 0 : i.closest("form");
      r && (T("Trigger action selection changed", {
        sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
        triggerId: ((s = this.trigger) == null ? void 0 : s.id) ?? null,
        actionId: (i == null ? void 0 : i.value) ?? null
      }), L(this, te, pi).call(this, i.value, r));
    }, "#onActionSelectChange"));
    _(this, wn, /* @__PURE__ */ a((n) => {
      var u, d, h, m;
      n.preventDefault();
      const i = n.currentTarget, r = i == null ? void 0 : i.closest("form");
      if (!r) return;
      const o = (u = i.dataset) == null ? void 0 : u.target;
      if (!o) return;
      const s = typeof (CSS == null ? void 0 : CSS.escape) == "function" ? CSS.escape : (y) => y, l = r.querySelector(`[name="${s(o)}"]`);
      if (!l) return;
      T("Opening file picker for trigger", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        triggerId: ((h = this.trigger) == null ? void 0 : h.id) ?? null,
        target: o
      }), new FilePicker({
        type: ((m = i.dataset) == null ? void 0 : m.type) || "audio",
        current: l.value,
        callback: /* @__PURE__ */ a((y) => {
          var g, O;
          l.value = y, l.dispatchEvent(new Event("change")), T("Trigger form file selected", {
            sceneId: ((g = this.scene) == null ? void 0 : g.id) ?? null,
            triggerId: ((O = this.trigger) == null ? void 0 : O.id) ?? null,
            target: o,
            path: y
          });
        }, "callback")
      }).render({ force: !0 });
    }, "#onFilePicker"));
    _(this, Cn, /* @__PURE__ */ a(async (n) => {
      var r, o;
      n.preventDefault();
      const i = n.currentTarget;
      i instanceof HTMLFormElement && (T("Trigger form submitted", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null,
        triggerId: ((o = this.trigger) == null ? void 0 : o.id) ?? null
      }), await L(this, te, Dr).call(this, i));
    }, "#onSubmit"));
    this.scene = i ?? null, this.trigger = r ?? null, this.triggerIndex = Number.isInteger(o) ? Number(o) : null, this.onSave = typeof s == "function" ? s : null, D(this, et, Ci(b(this, Ln)));
  }
  async _prepareContext() {
    var n, i;
    pt("TriggerFormApplication#_prepareContext", {
      sceneId: ((n = this.scene) == null ? void 0 : n.id) ?? null,
      triggerId: ((i = this.trigger) == null ? void 0 : i.id) ?? null,
      triggerIndex: this.triggerIndex
    });
    try {
      const r = this.trigger ?? { action: qt, data: {} }, o = r.action ?? qt, s = Ui(r.time), l = s.format ?? "12h", c = l === "12h" ? wo() : [], u = s.period ?? (c.length > 0 ? c[0].value : null), d = l === "12h" ? c.map((y) => ({
        ...y,
        selected: y.value === u
      })) : [], h = Vi().map((y) => ({
        id: y.id,
        label: typeof y.label == "function" ? y.label() : y.label,
        selected: y.id === o
      })), m = Vi().map((y) => {
        const g = y.id === r.action ? r : { ...r, action: y.id }, O = bo(g);
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
        actions: h,
        actionSections: m,
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
      xe();
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
      (h) => h.startsWith("theme-")
    );
    o && r.classList.add(o);
    const s = r.querySelector("form");
    if (!s) return;
    L(this, te, _r).call(this, s), L(this, te, Nr).call(this, s), s.addEventListener("submit", b(this, Cn));
    const l = s.querySelector("[data-action-select]");
    l && (l.addEventListener("change", b(this, Sn)), L(this, te, pi).call(this, l.value, s)), s.querySelectorAll("[data-action-file-picker]").forEach((h) => {
      h.addEventListener("click", b(this, wn));
    });
  }
  async close(n = {}) {
    var i;
    if ((i = b(this, Ue)) == null || i.call(this), D(this, Ue, null), D(this, ce, null), D(this, Pe, null), typeof b(this, et) == "function")
      try {
        b(this, et).call(this);
      } catch (r) {
        console.error(`${v} | Failed to dispose trigger form time format subscription`, r);
      }
    return D(this, et, null), super.close(n);
  }
};
Ue = new WeakMap(), ce = new WeakMap(), et = new WeakMap(), Pe = new WeakMap(), Ln = new WeakMap(), te = new WeakSet(), Cr = /* @__PURE__ */ a(function() {
  var l, c, u, d, h, m, y;
  const n = (c = (l = this.element) == null ? void 0 : l.querySelector) == null ? void 0 : c.call(l, "form");
  if (!(n instanceof HTMLFormElement)) return null;
  const i = Array.from(n.elements ?? []), r = [];
  for (const g of i)
    if ((g instanceof HTMLInputElement || g instanceof HTMLSelectElement || g instanceof HTMLTextAreaElement) && g.name && !(((u = g.dataset) == null ? void 0 : u.timeHidden) !== void 0 || ((d = g.dataset) == null ? void 0 : d.timeHour) !== void 0 || ((h = g.dataset) == null ? void 0 : h.timeMinute) !== void 0 || ((m = g.dataset) == null ? void 0 : m.timePeriod) !== void 0)) {
      if (g instanceof HTMLInputElement) {
        if (g.type === "checkbox" || g.type === "radio") {
          r.push({
            kind: g.type,
            name: g.name,
            value: g.value,
            checked: g.checked
          });
          continue;
        }
        r.push({
          kind: "value",
          name: g.name,
          value: g.value
        });
        continue;
      }
      if (g instanceof HTMLSelectElement) {
        g.multiple ? r.push({
          kind: "select-multiple",
          name: g.name,
          values: Array.from(g.selectedOptions ?? []).map((O) => O.value)
        }) : r.push({
          kind: "value",
          name: g.name,
          value: g.value
        });
        continue;
      }
      r.push({
        kind: "value",
        name: g.name,
        value: g.value
      });
    }
  const o = n.querySelector("[data-time-format]");
  let s = null;
  if (o instanceof HTMLElement) {
    const g = o.querySelector("[data-time-hidden]"), O = o.querySelector("[data-time-hour]"), w = o.querySelector("[data-time-minute]"), p = o.querySelector("[data-time-period]");
    s = {
      format: ((y = o.dataset) == null ? void 0 : y.timeFormat) ?? null,
      canonical: g instanceof HTMLInputElement ? g.value : "",
      hour: O instanceof HTMLInputElement ? O.value : "",
      minute: w instanceof HTMLInputElement ? w.value : "",
      period: p instanceof HTMLSelectElement ? p.value : ""
    };
  }
  return {
    fields: r,
    time: s
  };
}, "#captureFormState"), Nr = /* @__PURE__ */ a(function(n) {
  if (!b(this, Pe)) return;
  if (!(n instanceof HTMLFormElement)) {
    D(this, Pe, null);
    return;
  }
  const { fields: i = [], time: r = null } = b(this, Pe) ?? {};
  D(this, Pe, null), L(this, te, Mr).call(this, n, i), L(this, te, Ar).call(this, n, r);
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
}, "#restoreFieldValues"), Ar = /* @__PURE__ */ a(function(n, i) {
  var E, N, F;
  const r = n.querySelector("[data-time-format]");
  if (!(r instanceof HTMLElement)) {
    typeof b(this, ce) == "function" && b(this, ce).call(this);
    return;
  }
  const o = ((E = r.dataset) == null ? void 0 : E.timeFormat) === "24h" ? "24h" : "12h", s = r.querySelector("[data-time-hour]"), l = r.querySelector("[data-time-minute]"), c = r.querySelector("[data-time-period]"), u = r.querySelector("[data-time-hidden]");
  if (!i) {
    if (s instanceof HTMLInputElement && (s.value = ""), l instanceof HTMLInputElement && (l.value = ""), c instanceof HTMLSelectElement) {
      const R = ((F = (N = c.options) == null ? void 0 : N[0]) == null ? void 0 : F.value) ?? "";
      c.value = R;
    }
    u instanceof HTMLInputElement && (u.value = ""), typeof b(this, ce) == "function" && b(this, ce).call(this);
    return;
  }
  const d = typeof i.canonical == "string" ? i.canonical : "", h = typeof i.period == "string" ? i.period : "", m = typeof i.hour == "string" ? i.hour : "", y = typeof i.minute == "string" ? i.minute : "";
  let g = "", O = "", w = h, p = d;
  if (d) {
    const R = Ui(d, o);
    g = R.hour ?? "", O = R.minute ?? "", p = R.canonical ?? d, o === "12h" ? w = R.period ?? h : w = "";
  } else
    g = m, O = y, o !== "12h" && (w = "");
  if (s instanceof HTMLInputElement && (s.value = g ?? ""), l instanceof HTMLInputElement && (l.value = O ?? ""), c instanceof HTMLSelectElement)
    if (o === "12h") {
      const R = Array.from(c.options ?? []);
      R.find((S) => S.value === w) ? c.value = w : R.length > 0 ? c.value = R[0].value : c.value = "";
    } else
      c.value = "";
  u instanceof HTMLInputElement && (u.value = p ?? ""), typeof b(this, ce) == "function" && b(this, ce).call(this);
}, "#restoreTimeInputs"), Sn = new WeakMap(), pi = /* @__PURE__ */ a(function(n, i) {
  i && i.querySelectorAll("[data-action-config]").forEach((r) => {
    const o = r.dataset.actionConfig === n;
    r.style.display = o ? "" : "none";
  });
}, "#updateActionSections"), wn = new WeakMap(), _r = /* @__PURE__ */ a(function(n) {
  var h, m, y, g;
  if ((h = b(this, Ue)) == null || h.call(this), D(this, Ue, null), D(this, ce, null), !(n instanceof HTMLFormElement)) return;
  const i = n.querySelector("[data-time-format]"), r = ((m = i == null ? void 0 : i.dataset) == null ? void 0 : m.timeFormat) ?? null;
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
    const { canonical: O, error: w } = So(
      {
        hour: s.value,
        minute: l.value,
        period: (c == null ? void 0 : c.value) ?? null,
        time: o.value
      },
      r
    );
    o.value = O ?? "";
    const p = w ?? "";
    o.setCustomValidity(p), u.forEach((E) => {
      E.setCustomValidity(p);
    });
  }, "update");
  u.forEach((O) => {
    O.addEventListener("input", d), O.addEventListener("change", d);
  }), d(), D(this, Ue, () => {
    u.forEach((O) => {
      O.removeEventListener("input", d), O.removeEventListener("change", d);
    });
  }), D(this, ce, d), T("Trigger form configured for time input", {
    format: r,
    sceneId: ((y = this.scene) == null ? void 0 : y.id) ?? null,
    triggerId: ((g = this.trigger) == null ? void 0 : g.id) ?? null
  });
}, "#setupTimeInput"), Cn = new WeakMap(), Dr = /* @__PURE__ */ a(async function(n) {
  var o, s, l, c, u;
  if (typeof b(this, ce) == "function" && b(this, ce).call(this), typeof n.checkValidity == "function" && !n.checkValidity()) {
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
  }), await L(this, te, Fr).call(this, r), await this.close();
}, "#handleSubmit"), Fr = /* @__PURE__ */ a(async function(n) {
  var o, s, l, c, u, d;
  const i = {
    id: ((o = this.trigger) == null ? void 0 : o.id) ?? oo(),
    time: n.time ?? "",
    action: n.action ?? qt,
    allowReplayOnRewind: !!n.allowReplayOnRewind,
    data: {}
  };
  T("Persisting trigger from form", {
    sceneId: ((s = this.scene) == null ? void 0 : s.id) ?? null,
    triggerId: i.id,
    existingIndex: this.triggerIndex
  }), vo(i, n);
  const r = gt(this.scene);
  this.triggerIndex !== null && r[this.triggerIndex] ? r[this.triggerIndex] = i : r.push(i);
  try {
    await fr(this.scene, r), T("Trigger list saved", {
      sceneId: ((l = this.scene) == null ? void 0 : l.id) ?? null,
      triggerCount: r.length
    });
  } catch (h) {
    throw console.error(`${v} | Failed to save time trigger`, h), (u = (c = ui.notifications) == null ? void 0 : c.error) == null || u.call(
      c,
      f(
        "EIDOLON.TimeTrigger.TriggerSaveError",
        "Failed to save the scene's time triggers."
      )
    ), h;
  }
  if (this.onSave)
    try {
      this.onSave(r);
    } catch (h) {
      console.error(`${v} | Trigger onSave callback failed`, h), T("Trigger onSave callback failed", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        message: (h == null ? void 0 : h.message) ?? String(h)
      });
    }
}, "#persistTrigger"), a(De, "TriggerFormApplication"), We(De, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  ct(De, De, "DEFAULT_OPTIONS"),
  {
    id: `${v}-trigger-form`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((ir = ct(De, De, "DEFAULT_OPTIONS")) == null ? void 0 : ir.classes) ?? [], "standard-form", "themed"])
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
)), We(De, "PARTS", {
  content: {
    template: `modules/${v}/templates/time-trigger-form.html`
  }
});
let Ti = De;
const ji = Symbol("EIDOLON_SCENE_CONFIG_TAB_GROUP_PATCH");
function Pr(e = {}) {
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
  const h = typeof d.log == "function" ? d.log.bind(d) : (...I) => {
    var S;
    return (S = console.debug) == null ? void 0 : S.call(console, `${s}`, ...I);
  }, m = typeof d.group == "function" ? d.group.bind(d) : (...I) => {
    var S;
    return (S = console.groupCollapsed) == null ? void 0 : S.call(console, `${s}`, ...I);
  }, y = typeof d.groupEnd == "function" ? d.groupEnd.bind(d) : () => {
    var I;
    return (I = console.groupEnd) == null ? void 0 : I.call(console);
  }, g = Symbol(`EIDOLON_SCENE_CONFIG_TAB_CLEANUP_${t}`), O = typeof i == "function" ? i : () => null, w = typeof r == "function" ? r : () => !0, p = typeof n == "function" ? n : () => typeof n == "string" ? n : t;
  function E(I, S) {
    var V, U, ie, Z, G, X, x, C, Et, j, Be, st, Ge, ze, It, M, P, z, B, W, K, Y, de, re, fe, Re, Te;
    const H = O(I);
    if (!w(I, H)) {
      h("Skipped render", {
        tabId: t,
        reason: "inapplicable",
        constructor: ((V = I == null ? void 0 : I.constructor) == null ? void 0 : V.name) ?? null
      });
      return;
    }
    m("render", {
      tabId: t,
      sceneId: (H == null ? void 0 : H.id) ?? null,
      constructor: ((U = I == null ? void 0 : I.constructor) == null ? void 0 : U.name) ?? null
    });
    try {
      const ge = S instanceof HTMLElement ? S : (S == null ? void 0 : S[0]) instanceof HTMLElement ? S[0] : ((ie = I.element) == null ? void 0 : ie[0]) instanceof HTMLElement ? I.element[0] : null;
      if (!ge) {
        h("Missing root element", { tabId: t });
        return;
      }
      const k = [
        "nav.sheet-tabs[data-group]",
        "nav.tabs[data-group]",
        "nav.sheet-tabs",
        "nav.tabs"
      ].map((q) => ge.querySelector(q)).find((q) => q instanceof HTMLElement), oe = [
        (Z = ge.querySelector(".tab[data-tab]")) == null ? void 0 : Z.parentElement,
        ge.querySelector(".sheet-body"),
        (X = (G = k == null ? void 0 : k.parentElement) == null ? void 0 : G.querySelector) == null ? void 0 : X.call(G, ":scope > .sheet-body"),
        k == null ? void 0 : k.parentElement
      ].find((q) => q instanceof HTMLElement), ae = ((x = k == null ? void 0 : k.dataset) == null ? void 0 : x.group) ?? ((j = (Et = (C = k == null ? void 0 : k.querySelector) == null ? void 0 : C.call(k, "a[data-group]")) == null ? void 0 : Et.dataset) == null ? void 0 : j.group) ?? ((Ge = (st = (Be = k == null ? void 0 : k.querySelector) == null ? void 0 : Be.call(k, "[data-group]")) == null ? void 0 : st.dataset) == null ? void 0 : Ge.group) ?? ((M = (It = (ze = oe == null ? void 0 : oe.querySelector) == null ? void 0 : ze.call(oe, ".tab[data-group]")) == null ? void 0 : It.dataset) == null ? void 0 : M.group) ?? ((B = (z = (P = I._tabs) == null ? void 0 : P.find) == null ? void 0 : z.call(P, (q) => q == null ? void 0 : q.group)) == null ? void 0 : B.group) ?? _o(I) ?? "main";
      if (!k || !oe) {
        h("Missing navigation elements", {
          tabId: t,
          hasNav: !!k,
          hasBody: !!oe
        });
        return;
      }
      let J = k.querySelector(`[data-tab="${t}"]`);
      if (!J) {
        J = document.createElement("a"), J.dataset.action = "tab", J.dataset.group = ae, J.dataset.tab = t;
        const q = k.querySelector("a[data-tab]");
        (W = q == null ? void 0 : q.classList) != null && W.contains("item") && J.classList.add("item"), k.appendChild(J), typeof l == "function" && l({ app: I, button: J, nav: k, scene: H }), h("Created tab button", { tabId: t, group: ae });
      }
      J.innerHTML = p({ app: I, scene: H }) ?? t;
      let Q = oe.querySelector(`.tab[data-tab="${t}"]`);
      if (!Q) {
        Q = document.createElement("div"), Q.classList.add("tab"), Q.dataset.tab = t, Q.dataset.group = ae;
        const q = Do(oe);
        oe.insertBefore(Q, q ?? null), typeof c == "function" && c({ app: I, tab: Q, body: oe, scene: H }), h("Created tab container", { tabId: t, group: ae });
      }
      ((K = J.classList) == null ? void 0 : K.contains("active")) || Q.classList.contains("active") || Bi(I, ae) === t ? (J.classList.add("active"), Q.classList.add("active"), Q.removeAttribute("hidden")) : (J.classList.remove("active"), Q.classList.remove("active"), Q.setAttribute("hidden", "true"));
      const Me = /* @__PURE__ */ a(() => {
        var se, St;
        (Bi(I, ae) === t || (se = J.classList) != null && se.contains("active") || Q.classList.contains("active")) && ((St = J.classList) == null || St.add("active"), Q.classList.add("active"), Q.removeAttribute("hidden"), Q.removeAttribute("aria-hidden"), Q.style.display === "none" && (Q.style.display = ""));
      }, "ensureTabVisible"), ee = /* @__PURE__ */ a(() => {
        try {
          Me();
        } catch (se) {
          h("Ensure visible failed", {
            reason: "ensure-visible",
            message: (se == null ? void 0 : se.message) ?? String(se)
          });
        }
        const q = /* @__PURE__ */ a(() => {
          try {
            Me();
          } catch (se) {
            h("Ensure visible rerun failed", {
              reason: "ensure-visible-rerun",
              message: (se == null ? void 0 : se.message) ?? String(se)
            });
          }
        }, "rerun");
        (typeof queueMicrotask == "function" ? queueMicrotask : (se) => Promise.resolve().then(se))(q), setTimeout(q, 0);
      }, "scheduleEnsureTabVisible");
      J.dataset.eidolonEnsureSceneTabVisibility || (J.addEventListener("click", ee), J.dataset.eidolonEnsureSceneTabVisibility = "true");
      const pe = Rr(I, ae), Ee = S instanceof HTMLElement ? S : (S == null ? void 0 : S[0]) instanceof HTMLElement ? S[0] : ge, Ae = typeof (S == null ? void 0 : S.find) == "function" ? S : typeof ((Y = I == null ? void 0 : I.element) == null ? void 0 : Y.find) == "function" ? I.element : typeof (globalThis == null ? void 0 : globalThis.jQuery) == "function" && Ee ? globalThis.jQuery(Ee) : null;
      if ((de = pe == null ? void 0 : pe.controller) != null && de.bind) {
        Mo(pe.controller, Me, h);
        const q = Ee ?? (Ae == null ? void 0 : Ae[0]) ?? ge;
        q instanceof HTMLElement && pe.controller.bind(q), ee();
      } else {
        const q = ((fe = (re = I._tabs) == null ? void 0 : re.find) == null ? void 0 : fe.call(re, (Ie) => (Ie == null ? void 0 : Ie.group) === ae)) ?? ((Re = I._tabs) == null ? void 0 : Re[0]);
        if (Ao(q, Me, h), q != null && q.bind) {
          const Ie = Ee ?? (Ae == null ? void 0 : Ae[0]) ?? ge, se = Ie && typeof (globalThis == null ? void 0 : globalThis.jQuery) == "function" ? globalThis.jQuery(Ie) : Ae, St = /* @__PURE__ */ a((Rn) => {
            if (!Rn) return !1;
            try {
              return q.bind(Rn), !0;
            } catch ($t) {
              return h("Legacy tab bind failed", {
                reason: "bind-target",
                targetType: Rn instanceof HTMLElement ? "element" : "other",
                message: ($t == null ? void 0 : $t.message) ?? String($t)
              }), !1;
            }
          }, "tryBind");
          St(Ie) || St(se ?? Ie);
        }
        ee();
      }
      qi(I, g, h);
      const lt = o({
        app: I,
        scene: H,
        tab: Q,
        tabButton: J,
        ensureTabVisible: Me,
        scheduleEnsureTabVisible: ee
      });
      typeof lt == "function" && No(I, g, lt), typeof u == "function" && u({
        app: I,
        scene: H,
        tab: Q,
        tabButton: J,
        ensureTabVisible: Me,
        scheduleEnsureTabVisible: ee
      }), (Te = I.setPosition) == null || Te.call(I, { height: "auto" });
    } finally {
      y();
    }
  }
  a(E, "handleRender");
  function N(I) {
    qi(I, g, h);
  }
  a(N, "handleClose");
  function F() {
    return Hooks.on("renderSceneConfig", E), Hooks.on("closeSceneConfig", N), () => R();
  }
  a(F, "register");
  function R() {
    Hooks.off("renderSceneConfig", E), Hooks.off("closeSceneConfig", N);
  }
  return a(R, "unregister"), { register: F, unregister: R };
}
a(Pr, "createSceneConfigTabFactory");
function No(e, t, n) {
  if (!e || typeof n != "function") return;
  const i = e == null ? void 0 : e[t];
  Array.isArray(i) || (e[t] = []), e[t].push(n);
}
a(No, "registerCleanup");
function qi(e, t, n) {
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
a(qi, "invokeCleanup");
function Mo(e, t, n = () => {
}) {
  if (!e || typeof t != "function") return;
  if (typeof e.on == "function") {
    const s = e[ji] ?? {};
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
    }, e.on("activate", s.listener)), e[ji] = s;
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
function Ao(e, t, n = () => {
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
a(Ao, "patchLegacyTabsActivate");
function Rr(e, t) {
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
a(Rr, "resolveTabGroupState");
function Bi(e, t) {
  return Rr(e, t).active;
}
a(Bi, "getTabGroupActiveId");
function _o(e) {
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
a(_o, "getFirstTabGroupName");
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
const Fo = Mi(Ti), Po = `modules/${v}/templates/time-trigger-scene-tab.html`, Ro = Pr({
  tabId: "time-triggers",
  tabLabel: /* @__PURE__ */ a(() => f("EIDOLON.TimeTrigger.Tab", "Time Triggers"), "tabLabel"),
  getScene: Ne,
  isApplicable: Vo,
  renderContent: /* @__PURE__ */ a(({ app: e, scene: t, tab: n }) => $o(e, n, t), "renderContent"),
  logger: {
    log: T,
    group: pt,
    groupEnd: xe
  }
});
function Ho() {
  return T("Registering SceneConfig render hook"), Ro.register();
}
a(Ho, "registerSceneConfigHook");
function $o(e, t, n) {
  if (!(t instanceof HTMLElement)) return;
  const i = ue(n) ? n : Ne(e);
  tn(e, t, i);
  const r = Ci(() => {
    tn(e, t, i);
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
a($o, "renderTimeTriggerTab");
async function tn(e, t, n) {
  var r, o;
  const i = n ?? Ne(e);
  pt("renderTimeTriggersTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!ue(i)) {
      const x = f(
        "EIDOLON.TimeTrigger.Unavailable",
        "Time triggers are unavailable for this configuration sheet."
      );
      t.innerHTML = `<p class="notes">${x}</p>`, T("Scene lacks document for time triggers", { sceneId: (i == null ? void 0 : i.id) ?? null });
      return;
    }
    const s = `flags.${v}.${Yt}`, l = `flags.${v}.${jn}`, c = `flags.${v}.${qn}`, u = !!i.getFlag(v, Yt), d = !!i.getFlag(v, jn), h = !!i.getFlag(v, qn), m = gt(i);
    T("Rendering time trigger list", {
      sceneId: i.id,
      isActive: u,
      shouldHideWindow: d,
      shouldShowPlayerWindow: h,
      triggerCount: m.length
    });
    const y = f("EIDOLON.TimeTrigger.Activate", "Activate Time Trigger"), g = f(
      "EIDOLON.TimeTrigger.Description",
      "Enable scene time triggers so scheduled actions can run automatically."
    ), O = f(
      "EIDOLON.TimeTrigger.HideWindowLabel",
      "Hide Floating Time Window"
    ), w = f(
      "EIDOLON.TimeTrigger.HideWindowDescription",
      "Keep the floating time control window hidden while leaving time triggers active."
    ), p = f(
      "EIDOLON.TimeTrigger.ShowPlayerWindowLabel",
      "Share Floating Time Window with Players"
    ), E = f(
      "EIDOLON.TimeTrigger.ShowPlayerWindowDescription",
      "Let non-GM players see the floating time window (without time controls)."
    ), N = f(
      "EIDOLON.TimeTrigger.TriggerListLabel",
      "Scene Time Triggers"
    ), F = f(
      "EIDOLON.TimeTrigger.TriggerListEmpty",
      "No time triggers configured for this scene."
    ), R = f("EIDOLON.TimeTrigger.AddTrigger", "Add Trigger"), I = f("EIDOLON.TimeTrigger.EditTrigger", "Edit"), S = f("EIDOLON.TimeTrigger.DeleteTrigger", "Remove"), H = f("EIDOLON.TimeTrigger.TriggerNow", "Trigger Now"), V = f("EIDOLON.TimeTrigger.AtLabel", "At"), U = f("EIDOLON.TimeTrigger.DoLabel", "Do"), ie = f("EIDOLON.TimeTrigger.MissingTime", "(No time set)"), Z = m.map((x, C) => {
      const Be = (x.time ? Lo(x.time) : "") || x.time || "" || ie, st = To(x.action), Ge = [
        `${V} ${Be}`,
        `${U} ${st}`,
        ...po(x)
      ];
      return {
        index: C,
        summaryParts: Ge,
        tooltips: {
          triggerNow: H,
          edit: I,
          delete: S
        }
      };
    }), G = ((o = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : o.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof G != "function") {
      console.error(`${v} | renderTemplate is unavailable; cannot render scene tab.`), t.innerHTML = `<p class="notes">${F}</p>`;
      return;
    }
    let X = "";
    try {
      X = await G(Po, {
        flags: {
          active: s,
          hideWindow: l,
          showPlayerWindow: c
        },
        states: {
          isActive: u,
          hideWindow: d,
          showPlayerWindow: h
        },
        labels: {
          activate: y,
          hideWindow: O,
          showPlayerWindow: p,
          triggerList: N,
          empty: F,
          add: R
        },
        hints: {
          activate: g,
          hideWindow: w,
          showPlayerWindow: E
        },
        triggers: Z,
        hasTriggers: Z.length > 0
      });
    } catch (x) {
      console.error(`${v} | Failed to render time trigger scene tab template`, x), t.innerHTML = `<p class="notes">${F}</p>`;
      return;
    }
    t.innerHTML = X, ko(e, t, i);
  } finally {
    xe();
  }
}
a(tn, "renderTimeTriggersTabContent");
function ko(e, t, n) {
  const i = n ?? Ne(e);
  if (!ue(i)) return;
  const r = t.querySelector('[data-action="add-trigger"]');
  r && r.addEventListener("click", () => {
    T("Add trigger button clicked", { sceneId: i.id }), Gi(e, { scene: i });
  }), t.querySelectorAll('[data-action="edit-trigger"]').forEach((o) => {
    o.addEventListener("click", () => {
      const s = Number(o.dataset.index);
      if (!Number.isInteger(s)) return;
      const c = gt(i)[s];
      c && (T("Edit trigger button clicked", { sceneId: i.id, triggerId: c.id, index: s }), Gi(e, { trigger: c, triggerIndex: s, scene: i }));
    });
  }), t.querySelectorAll('[data-action="delete-trigger"]').forEach((o) => {
    o.addEventListener("click", async () => {
      var u, d;
      const s = Number(o.dataset.index);
      if (!Number.isInteger(s)) return;
      const l = gt(i), c = l[s];
      if (c) {
        l.splice(s, 1);
        try {
          T("Deleting trigger", {
            sceneId: i.id,
            index: s,
            triggerId: (c == null ? void 0 : c.id) ?? null
          }), await fr(i, l), await tn(e, t, i);
        } catch (h) {
          console.error(`${v} | Failed to delete time trigger`, h), (d = (u = ui.notifications) == null ? void 0 : u.error) == null || d.call(
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
      var u, d, h, m, y, g, O;
      const s = Number(o.dataset.index);
      if (!Number.isInteger(s)) return;
      const c = gt(i)[s];
      if (c) {
        if (!((u = game.user) != null && u.isGM)) {
          (h = (d = ui.notifications) == null ? void 0 : d.warn) == null || h.call(
            d,
            f("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time.")
          );
          return;
        }
        try {
          T("Manually firing trigger", { sceneId: i.id, triggerId: c.id, index: s }), await gr(i, c), (y = (m = ui.notifications) == null ? void 0 : m.info) == null || y.call(
            m,
            f(
              "EIDOLON.TimeTrigger.TriggerNowSuccess",
              "Triggered the selected time trigger."
            )
          );
        } catch (w) {
          console.error(`${v} | Failed to execute time trigger manually`, w), (O = (g = ui.notifications) == null ? void 0 : g.error) == null || O.call(
            g,
            f(
              "EIDOLON.TimeTrigger.TriggerNowError",
              "Failed to execute the selected time trigger."
            )
          ), T("Manual trigger execution failed", {
            sceneId: i.id,
            triggerId: c.id,
            index: s,
            message: (w == null ? void 0 : w.message) ?? String(w)
          });
        }
      }
    });
  });
}
a(ko, "bindTimeTriggerTabEvents");
function Gi(e, t = {}) {
  var s;
  const n = t.scene ?? null, i = n && ue(n) ? n : Ne(e);
  if (!ue(i)) {
    console.warn(`${v} | Unable to open trigger form because no scene document is available.`);
    return;
  }
  T("Opening trigger form", {
    sceneId: i.id,
    triggerId: ((s = t.trigger) == null ? void 0 : s.id) ?? null,
    index: Number.isInteger(t.triggerIndex) ? Number(t.triggerIndex) : null
  }), Fo({
    scene: i,
    trigger: t.trigger ?? null,
    triggerIndex: t.triggerIndex ?? null,
    onSave: /* @__PURE__ */ a(() => {
      var c, u;
      const l = (u = (c = e.element) == null ? void 0 : c[0]) == null ? void 0 : u.querySelector('.tab[data-tab="time-triggers"]');
      l && tn(e, l, i);
    }, "onSave")
  }).render({ force: !0 });
}
a(Gi, "openTriggerForm");
function Vo(e, t) {
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
a(Vo, "isRecognizedSceneConfig");
const kt = new li(), zi = new ci();
function Uo() {
  T("Registering time trigger hooks"), Hooks.once("init", () => {
    so(), go(), T("Time trigger settings registered during init");
  }), Ho(), T("Scene config hook registered"), zi.registerHooks(), T("Time automation hooks registered"), Hooks.once("ready", () => {
    mo(), T("Ready hook fired"), kt.onReady(), zi.initialize();
  }), Hooks.on("canvasReady", (e) => {
    var t;
    T("canvasReady hook received", { scene: ((t = e == null ? void 0 : e.scene) == null ? void 0 : t.id) ?? null }), kt.onCanvasReady(e);
  }), Hooks.on("updateScene", (e) => {
    T("updateScene hook received", { scene: (e == null ? void 0 : e.id) ?? null }), kt.onUpdateScene(e);
  }), Hooks.on("updateWorldTime", (e, t) => {
    T("updateWorldTime hook received", { worldTime: e, diff: t }), kt.onUpdateWorldTime(e, t);
  });
}
a(Uo, "registerTimeTriggerHooks");
Uo();
const ye = v, Hr = "objectVariants";
function Ht(e) {
  var i;
  const t = (i = e == null ? void 0 : e.getFlag) == null ? void 0 : i.call(e, ye, Hr);
  if (!t) return [];
  const n = it(t);
  return Array.isArray(n) ? n.map((r) => nn(r)).filter((r) => r !== null) : [];
}
a(Ht, "getObjectVariantCategories");
async function $r(e, t) {
  if (!(e != null && e.setFlag)) return;
  const n = Array.isArray(t) ? t.map((i) => nn(i)).filter((i) => i !== null) : [];
  await e.setFlag(ye, Hr, n);
}
a($r, "setObjectVariantCategories");
function kr(e = "") {
  return {
    id: Vr(),
    name: typeof e == "string" ? e : "",
    values: []
  };
}
a(kr, "createObjectVariantCategory");
function nn(e) {
  if (!e || typeof e != "object") return null;
  const t = typeof e.id == "string" && e.id.trim() ? e.id.trim() : Vr(), n = typeof e.name == "string" ? e.name : "", i = Array.isArray(e.values) ? e.values : [], r = [];
  for (const o of i) {
    if (typeof o != "string") continue;
    const s = o.trim();
    s && (r.includes(s) || r.push(s));
  }
  return { id: t, name: n, values: r };
}
a(nn, "sanitizeCategory");
function Vr() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 11);
}
a(Vr, "generateVariantId");
function Ur(e) {
  var t, n;
  console.error(`${ye} | Failed to persist object variants`, e), (n = (t = ui.notifications) == null ? void 0 : t.error) == null || n.call(
    t,
    f(
      "EIDOLON.ObjectVariants.PersistError",
      "Failed to persist the scene's object variants."
    )
  );
}
a(Ur, "notifyPersistError");
var rr, he, tt, Ot, xr, Nn, Mn, Ft, jr;
const Fe = class Fe extends Dn(_n) {
  constructor(n = {}) {
    const { scene: i, category: r, isNew: o, onSave: s, ...l } = n ?? {};
    super(l);
    _(this, Ot);
    _(this, he, null);
    _(this, tt, !1);
    _(this, Nn, /* @__PURE__ */ a(async (n) => {
      n.preventDefault(), n.stopPropagation();
      const i = n.currentTarget;
      if (!(i instanceof HTMLFormElement)) return;
      const o = (new FormData(i).get("categoryName") ?? "").toString(), s = Array.from(i.querySelectorAll('[name="categoryValues"]')), l = [];
      for (const c of s) {
        if (!(c instanceof HTMLInputElement)) continue;
        const u = c.value.trim();
        u && (l.includes(u) || l.push(u));
      }
      D(this, he, {
        ...b(this, he),
        name: o,
        values: l
      }), await L(this, Ot, jr).call(this), this.close();
    }, "#onSubmit"));
    _(this, Mn, /* @__PURE__ */ a((n) => {
      var m, y;
      n.preventDefault();
      const i = n.currentTarget, r = (i == null ? void 0 : i.form) ?? ((y = (m = this.element) == null ? void 0 : m.querySelector) == null ? void 0 : y.call(m, "form"));
      if (!r) return;
      const o = r.querySelector(".object-variant-editor__values");
      if (!o) return;
      const s = o.querySelector(".object-variant-editor__empty");
      s && s.remove();
      const l = document.createElement("div");
      l.classList.add("object-variant-editor__value");
      const c = Jt(
        f("EIDOLON.ObjectVariants.ValuePlaceholder", "Variant label")
      ), u = Jt(
        f("EIDOLON.ObjectVariants.RemoveValue", "Remove Value")
      );
      l.innerHTML = `
      <input type="text" name="categoryValues" value="" placeholder="${c}" class="form-control">
      <button type="button" class="icon" data-action="remove-value" aria-label="${u}" title="${u}">
        <i class="fa-solid fa-trash"></i>
      </button>
    `, o.appendChild(l);
      const d = l.querySelector('[data-action="remove-value"]');
      d && d.addEventListener("click", b(this, Ft));
      const h = l.querySelector('input[name="categoryValues"]');
      h && h.focus();
    }, "#onAddValue"));
    _(this, Ft, /* @__PURE__ */ a((n) => {
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
    this.scene = i ?? null, this.category = r ?? null, this.onSave = typeof s == "function" ? s : null, D(this, tt, !!o), D(this, he, L(this, Ot, xr).call(this));
  }
  async _prepareContext() {
    var i, r;
    const n = Array.isArray((i = b(this, he)) == null ? void 0 : i.values) ? b(this, he).values : [];
    return {
      isNew: b(this, tt),
      name: ((r = b(this, he)) == null ? void 0 : r.name) ?? "",
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
        save: b(this, tt) ? f("EIDOLON.ObjectVariants.CreateCategory", "Add Category") : f("EIDOLON.ObjectVariants.SaveCategory", "Save Category"),
        cancel: f("EIDOLON.ObjectVariants.CancelEdit", "Cancel"),
        title: b(this, tt) ? f("EIDOLON.ObjectVariants.CreateCategory", "Add Category") : f("EIDOLON.ObjectVariants.EditCategory", "Edit Category")
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
    s.addEventListener("submit", b(this, Nn)), s.querySelectorAll('[data-action="add-value"]').forEach((u) => {
      u.addEventListener("click", b(this, Mn));
    }), s.querySelectorAll('[data-action="remove-value"]').forEach((u) => {
      u.addEventListener("click", b(this, Ft));
    });
    const l = s.querySelector('[data-action="cancel"]');
    l && l.addEventListener("click", (u) => {
      u.preventDefault(), this.close();
    });
  }
};
he = new WeakMap(), tt = new WeakMap(), Ot = new WeakSet(), xr = /* @__PURE__ */ a(function() {
  const n = nn(this.category) ?? kr(
    f("EIDOLON.ObjectVariants.DefaultCategoryName", "New Category")
  );
  return {
    id: n.id,
    name: n.name ?? "",
    values: Array.isArray(n.values) ? [...n.values] : []
  };
}, "#initializeState"), Nn = new WeakMap(), Mn = new WeakMap(), Ft = new WeakMap(), jr = /* @__PURE__ */ a(async function() {
  if (!this.scene) return;
  const n = Ht(this.scene), i = n.findIndex((o) => o.id === b(this, he).id), r = nn({
    id: b(this, he).id,
    name: b(this, he).name,
    values: b(this, he).values
  });
  i === -1 ? n.push(r) : n.splice(i, 1, r);
  try {
    if (await $r(this.scene, n), this.onSave)
      try {
        await this.onSave(r);
      } catch (o) {
        console.error(`${ye} | Object variant editor onSave handler failed`, o);
      }
  } catch (o) {
    Ur(o);
  }
}, "#persist"), a(Fe, "CategoryEditorApplication"), We(Fe, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  ct(Fe, Fe, "DEFAULT_OPTIONS"),
  {
    id: `${ye}-variant-category-editor`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((rr = ct(Fe, Fe, "DEFAULT_OPTIONS")) == null ? void 0 : rr.classes) ?? [], "standard-form", "themed"])
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
)), We(Fe, "PARTS", {
  content: {
    template: `modules/${ye}/templates/object-variants-category-editor.html`
  }
});
let bi = Fe;
const xo = `modules/${ye}/templates/object-variants-scene-tab.html`, Nt = {
  log: /* @__PURE__ */ a((...e) => {
    var t;
    return (t = console.debug) == null ? void 0 : t.call(console, `${ye} | ObjectVariants`, ...e);
  }, "log"),
  group: /* @__PURE__ */ a((...e) => {
    var t;
    return (t = console.groupCollapsed) == null ? void 0 : t.call(console, `${ye} | ObjectVariants`, ...e);
  }, "group"),
  groupEnd: /* @__PURE__ */ a(() => {
    var e;
    return (e = console.groupEnd) == null ? void 0 : e.call(console);
  }, "groupEnd")
}, jo = Mi(bi), qo = Pr({
  tabId: "variants",
  tabLabel: /* @__PURE__ */ a(() => f("EIDOLON.ObjectVariants.TabLabel", "Variants"), "tabLabel"),
  getScene: Ne,
  renderContent: /* @__PURE__ */ a(({ app: e, tab: t, scene: n }) => Go(e, t, n), "renderContent"),
  logger: Nt
});
function Bo() {
  return qo.register();
}
a(Bo, "registerObjectVariantSceneConfigHook");
function Go(e, t, n) {
  if (!(t instanceof HTMLElement)) return;
  const i = ue(n) ? n : Ne(e);
  Wt(e, t, i);
}
a(Go, "renderObjectVariantsTab");
async function Wt(e, t, n) {
  var r, o;
  const i = n ?? Ne(e);
  Nt.group("renderObjectVariantsTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!ue(i)) {
      const N = f(
        "EIDOLON.ObjectVariants.Unavailable",
        "Object variants are unavailable for this configuration sheet."
      );
      t.innerHTML = `<p class="notes">${N}</p>`, Nt.log("Scene lacks document for object variants", { sceneId: (i == null ? void 0 : i.id) ?? null });
      return;
    }
    const s = Ht(i);
    Nt.log("Rendering object variant list", {
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
    ), d = f("EIDOLON.ObjectVariants.AddCategory", "Add Category"), h = f(
      "EIDOLON.ObjectVariants.RemoveCategory",
      "Remove Category"
    ), m = f("EIDOLON.ObjectVariants.EditCategory", "Edit Category"), y = f("EIDOLON.ObjectVariants.ValuesLabel", "Values"), g = f(
      "EIDOLON.ObjectVariants.ValueListEmpty",
      "No values have been added to this category."
    ), O = f(
      "EIDOLON.ObjectVariants.UnnamedCategory",
      "Unnamed Category"
    ), w = /* @__PURE__ */ a((N) => Jo(N), "formatCount"), p = ((o = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : o.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof p != "function") {
      console.error(`${ye} | renderTemplate is unavailable; cannot render object variants tab.`), t.innerHTML = `<p class="notes">${u}</p>`;
      return;
    }
    let E = "";
    try {
      E = await p(xo, {
        description: l,
        labels: {
          categories: c,
          empty: u,
          addCategory: d,
          removeCategory: h,
          editCategory: m,
          values: y,
          emptyValue: g,
          unnamedCategory: O
        },
        categories: s.map((N) => {
          var R, I;
          const F = ((I = (R = N.name) == null ? void 0 : R.trim) == null ? void 0 : I.call(R)) ?? "";
          return {
            id: N.id,
            name: N.name,
            displayName: F || O,
            isUnnamed: !F,
            values: N.values,
            hasValues: N.values.length > 0,
            valuePreview: Ko(N.values),
            valueCount: N.values.length,
            valueCountLabel: w(N.values.length),
            valueChips: Yo(N.values)
          };
        }),
        hasCategories: s.length > 0
      });
    } catch (N) {
      console.error(`${ye} | Failed to render object variants scene tab template`, N), t.innerHTML = `<p class="notes">${u}</p>`;
      return;
    }
    t.innerHTML = E, zo(e, t, i);
  } finally {
    Nt.groupEnd();
  }
}
a(Wt, "renderObjectVariantsTabContent");
function zo(e, t, n) {
  const i = n ?? Ne(e);
  if (!ue(i)) return;
  const r = f(
    "EIDOLON.ObjectVariants.DefaultCategoryName",
    "New Category"
  ), o = t.querySelector('[data-variant-action="add-category"]');
  o && o.addEventListener("click", () => {
    Wi(e, {
      scene: i,
      category: kr(r),
      isNew: !0,
      onSave: /* @__PURE__ */ a(() => Wt(e, t, i), "onSave")
    });
  }), t.querySelectorAll('[data-variant-action="remove-category"]').forEach((s) => {
    const l = s.dataset.categoryId;
    l && s.addEventListener("click", async () => {
      await Wo(i, (u) => {
        const d = u.findIndex((h) => h.id === l);
        return d === -1 ? !1 : (u.splice(d, 1), !0);
      }) && await Wt(e, t, i);
    });
  }), t.querySelectorAll('[data-variant-action="edit-category"]').forEach((s) => {
    const l = s.dataset.categoryId;
    l && s.addEventListener("click", () => {
      const u = Ht(i).find((d) => d.id === l);
      u && Wi(e, {
        scene: i,
        category: u,
        onSave: /* @__PURE__ */ a(() => Wt(e, t, i), "onSave")
      });
    });
  });
}
a(zo, "bindObjectVariantTabEvents");
async function Wo(e, t) {
  const n = Ht(e);
  if (t(n) === !1) return !1;
  try {
    return await $r(e, n), !0;
  } catch (r) {
    return Ur(r), !1;
  }
}
a(Wo, "mutateVariantCategories");
function Wi(e, t = {}) {
  const n = t.scene ?? null, i = n && ue(n) ? n : Ne(e);
  if (!ue(i)) {
    console.warn(
      `${ye} | Unable to open object variant editor because no scene document is available.`
    );
    return;
  }
  jo({
    scene: i,
    category: t.category ?? null,
    isNew: !!t.isNew,
    onSave: typeof t.onSave == "function" ? t.onSave : null
  }).render({ force: !0 });
}
a(Wi, "openCategoryEditor");
function Ko(e) {
  if (!Array.isArray(e) || e.length === 0) return "";
  const t = e.slice(0, 5), n = t.join(", ");
  return e.length > t.length ? `${n}, …` : n;
}
a(Ko, "buildValuePreview");
function Yo(e) {
  return !Array.isArray(e) || e.length === 0 ? [] : e.map((t) => t);
}
a(Yo, "buildValueChips");
function Jo(e) {
  var t, n;
  if ((n = (t = game.i18n) == null ? void 0 : t.has) != null && n.call(t, "EIDOLON.ObjectVariants.ValueCountLabel"))
    try {
      return game.i18n.format("EIDOLON.ObjectVariants.ValueCountLabel", { count: e });
    } catch (i) {
      console.error(`${ye} | Failed to format value count label`, i);
    }
  return e === 0 ? "No values configured" : e === 1 ? "1 value" : `${e} values`;
}
a(Jo, "formatValueCount");
function Qo() {
  Bo();
}
a(Qo, "registerObjectVariantHooks");
Qo();
const nt = v, mt = "lightPresets", Ai = Object.freeze({
  default: null,
  presets: [],
  current: null
});
function qr(e) {
  var n;
  const t = ((n = e == null ? void 0 : e.getFlag) == null ? void 0 : n.call(e, nt, mt)) ?? Ai;
  return Br(t);
}
a(qr, "getLightPresetState");
async function Xo(e, t) {
  const n = Br(t);
  if (!(e != null && e.setFlag))
    return n;
  const i = n.default !== null, r = n.presets.length > 0, o = n.current !== null;
  return !i && !r && !o ? (typeof e.unsetFlag == "function" ? await e.unsetFlag(nt, mt) : await e.setFlag(nt, mt, null), Ai) : (await e.setFlag(nt, mt, n), n);
}
a(Xo, "setLightPresetState");
async function _i(e, t) {
  if (typeof t != "function")
    throw new TypeError("updateLightPresetState requires an updater function.");
  const n = it(qr(e)), i = await t(n);
  return Xo(e, i);
}
a(_i, "updateLightPresetState");
async function Ki(e, t) {
  const n = bt(t);
  if (!n)
    throw new Error("Invalid light configuration payload.");
  return _i(e, (i) => ({
    ...i,
    default: n
  }));
}
a(Ki, "storeDefaultPreset");
async function Yi(e, t, n, { label: i } = {}) {
  const r = Di(t);
  if (!r)
    throw new Error("Cannot create preset without at least one category selection.");
  const o = bt(n);
  if (!o)
    throw new Error("Invalid light configuration payload.");
  return _i(e, (s) => {
    const l = Pn(r), c = Array.isArray(s == null ? void 0 : s.presets) ? [...s.presets] : [], u = c.findIndex((y) => (y == null ? void 0 : y.key) === l), d = u >= 0 ? c[u] : null, h = typeof (d == null ? void 0 : d.id) == "string" && d.id.trim() ? d.id.trim() : Wr(), m = Gr({
      id: h,
      categories: r,
      config: o,
      label: typeof i == "string" ? i : (d == null ? void 0 : d.label) ?? null,
      updatedAt: Date.now()
    });
    if (!m)
      throw new Error("Failed to sanitize preset entry.");
    return u >= 0 ? c[u] = m : c.push(m), {
      ...s,
      presets: c
    };
  });
}
a(Yi, "upsertLightPreset");
async function Ji(e, t) {
  const n = zr(t);
  return _i(e, (i) => ({
    ...i,
    current: n
  }));
}
a(Ji, "storeCurrentPresetSelection");
function Br(e) {
  var c;
  const t = it(e);
  if (!t || typeof t != "object")
    return it(Ai);
  const n = bt(t.default ?? t.defaultPreset), i = Array.isArray(t.presets) ? t.presets : [], r = /* @__PURE__ */ new Map();
  for (const u of i) {
    const d = Gr(u);
    d && r.set(d.key, d);
  }
  const o = Array.from(r.values()), s = new Map(o.map((u) => [u.id, u]));
  let l = zr(t.current);
  if (l) {
    const u = l.categories && Object.keys(l.categories).length > 0;
    if (l.presetId && !s.has(l.presetId)) {
      const d = u ? ((c = o.find((h) => h.key === Pn(l.categories))) == null ? void 0 : c.id) ?? null : null;
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
a(Br, "sanitizeLightPresetState");
function bt(e) {
  const t = it(e);
  if (!t || typeof t != "object") return null;
  "_id" in t && delete t._id, "id" in t && delete t.id;
  const n = t.flags;
  if (n && typeof n == "object") {
    const i = n[nt];
    i && typeof i == "object" && (delete i[mt], Object.keys(i).length === 0 && delete n[nt]), Object.keys(n).length === 0 && delete t.flags;
  }
  return t;
}
a(bt, "sanitizeLightConfigPayload");
function Gr(e) {
  if (!e || typeof e != "object") return null;
  const t = Di(e.categories);
  if (!t) return null;
  const n = bt(e.config);
  if (!n) return null;
  const i = typeof e.id == "string" && e.id.trim() ? e.id.trim() : Wr(), r = Pn(t), o = {
    id: i,
    key: r,
    categories: t,
    config: n,
    updatedAt: Number.isFinite(e.updatedAt) ? Number(e.updatedAt) : Date.now()
  };
  return typeof e.label == "string" && e.label.trim() && (o.label = e.label.trim()), o;
}
a(Gr, "sanitizePresetEntry");
function zr(e) {
  if (!e || typeof e != "object") return null;
  const t = typeof e.presetId == "string" && e.presetId.trim() ? e.presetId.trim() : null, n = Di(e.categories);
  return !t && !n ? null : {
    presetId: t,
    categories: n,
    updatedAt: Number.isFinite(e.updatedAt) ? Number(e.updatedAt) : Date.now()
  };
}
a(zr, "sanitizeCurrentSelection");
function Di(e) {
  const t = {};
  if (Array.isArray(e))
    for (const n of e) {
      const i = Qi((n == null ? void 0 : n.id) ?? (n == null ? void 0 : n.categoryId) ?? (n == null ? void 0 : n.category)), r = Xi((n == null ? void 0 : n.value) ?? (n == null ? void 0 : n.selection) ?? (n == null ? void 0 : n.label));
      !i || !r || (t[i] = r);
    }
  else if (e && typeof e == "object")
    for (const [n, i] of Object.entries(e)) {
      const r = Qi(n), o = Xi(i);
      !r || !o || (t[r] = o);
    }
  return Object.keys(t).length > 0 ? t : null;
}
a(Di, "sanitizePresetCategories");
function Pn(e) {
  if (!e || typeof e != "object") return "";
  const t = Object.entries(e).filter(([, n]) => typeof n == "string" && n).map(([n, i]) => `${n}:${i}`);
  return t.sort((n, i) => n < i ? -1 : n > i ? 1 : 0), t.join("|");
}
a(Pn, "computePresetKey");
function Wr() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
a(Wr, "generateLightPresetId");
function Qi(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  return t || null;
}
a(Qi, "normalizeCategoryId");
function Xi(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  return t || null;
}
a(Xi, "normalizeCategoryValue");
const Kt = /* @__PURE__ */ new WeakMap(), le = "__eidolon_default__";
function Zo() {
  Hooks.on("renderAmbientLightConfig", es), T("LightPresets | AmbientLightConfig controls registered");
}
a(Zo, "registerAmbientLightConfigControls");
function es(e, t) {
  var n;
  pt("LightPresets | renderAmbientLightConfig", {
    appId: (e == null ? void 0 : e.id) ?? null,
    constructor: ((n = e == null ? void 0 : e.constructor) == null ? void 0 : n.name) ?? null,
    isRendered: (e == null ? void 0 : e.rendered) ?? !1
  });
  try {
    const i = t instanceof HTMLElement ? t : (t == null ? void 0 : t[0]) instanceof HTMLElement ? t[0] : null;
    if (!i) return;
    ts(e, i);
  } catch (i) {
    console.error("eidolon-utilities | Failed to enhance AmbientLightConfig UI", i);
  } finally {
    xe();
  }
}
a(es, "handleAmbientLightConfigRender");
function ts(e, t) {
  var Ge, ze, It;
  const n = (e == null ? void 0 : e.form) instanceof HTMLFormElement ? e.form : t instanceof HTMLFormElement ? t : (Ge = t == null ? void 0 : t.closest) == null ? void 0 : Ge.call(t, "form");
  if (!(n instanceof HTMLFormElement)) return;
  const i = n.querySelector(".window-content");
  if (!(i instanceof HTMLElement)) return;
  const r = Yr(e);
  if (!r) return;
  const o = ds(r);
  T("LightPresets | Resolved ambient light", {
    sheetId: (r == null ? void 0 : r.id) ?? null,
    persistedId: (o == null ? void 0 : o.id) ?? null,
    sameRef: r === o
  });
  const s = (o == null ? void 0 : o.parent) ?? r.parent ?? null, l = s ? Ht(s) : [], c = l.filter(
    (M) => Array.isArray(M == null ? void 0 : M.values) && M.values.length > 0
  ), u = as(l), d = qr(o ?? r);
  T("LightPresets | Loaded preset state", {
    hasDefault: !!(d != null && d.default),
    presetCount: Array.isArray(d == null ? void 0 : d.presets) ? d.presets.length : 0,
    presets: Array.isArray(d == null ? void 0 : d.presets) ? d.presets.map((M) => {
      var P, z;
      return {
        id: M.id,
        key: M.key,
        hasColor: !!((z = (P = M.config) == null ? void 0 : P.config) != null && z.color)
      };
    }) : []
  });
  const h = i.querySelector(".eidolon-light-presets");
  h && h.remove();
  const m = document.createElement("fieldset");
  m.classList.add("eidolon-light-presets");
  const y = document.createElement("legend");
  y.textContent = f("EIDOLON.LightPresets.Legend", "Light Presets"), m.appendChild(y);
  const g = document.createElement("p");
  g.classList.add("notes"), g.textContent = f(
    "EIDOLON.LightPresets.Description",
    "Capture default lighting and register presets tied to scene variant values."
  ), m.appendChild(g);
  const O = document.createElement("div");
  O.classList.add("eidolon-light-presets__controls");
  const w = document.createElement("button");
  w.type = "button", w.dataset.action = "make-default", w.classList.add("eidolon-light-presets__button"), w.textContent = f(
    "EIDOLON.LightPresets.MakeDefault",
    "Make Default"
  ), O.appendChild(w);
  const p = document.createElement("button");
  p.type = "button", p.dataset.action = "create-preset", p.classList.add("eidolon-light-presets__button"), p.textContent = f(
    "EIDOLON.LightPresets.CreatePreset",
    "Create Preset"
  ), p.setAttribute("aria-expanded", "false"), O.appendChild(p), m.appendChild(O);
  const E = document.createElement("p");
  E.classList.add("notes", "eidolon-light-presets__status"), m.appendChild(E);
  const N = document.createElement("div");
  N.classList.add("eidolon-light-presets__switcher");
  const F = document.createElement("label");
  F.classList.add("eidolon-light-presets__switcher-label");
  const R = `${(e == null ? void 0 : e.id) ?? (r == null ? void 0 : r.id) ?? "eidolon-light"}-preset-select`;
  F.htmlFor = R, F.textContent = f("EIDOLON.LightPresets.SelectLabel", "Preset"), N.appendChild(F);
  const I = document.createElement("div");
  I.classList.add("eidolon-light-presets__switcher-controls"), N.appendChild(I);
  const S = document.createElement("select");
  S.id = R, S.classList.add("eidolon-light-presets__select"), S.dataset.action = "select-preset", I.appendChild(S);
  const H = document.createElement("button");
  H.type = "button", H.dataset.action = "apply-selected-preset", H.classList.add("eidolon-light-presets__button", "secondary"), H.textContent = f("EIDOLON.LightPresets.ApplyButton", "Apply"), I.appendChild(H);
  const V = document.createElement("button");
  if (V.type = "button", V.dataset.action = "update-selected-preset", V.classList.add("eidolon-light-presets__button", "secondary"), V.textContent = f(
    "EIDOLON.LightPresets.UpdateButton",
    "Save Changes"
  ), I.appendChild(V), m.appendChild(N), l.length === 0) {
    const M = document.createElement("p");
    M.classList.add("notification", "warning", "eidolon-light-presets__warning"), M.textContent = f(
      "EIDOLON.LightPresets.NoCategoriesWarning",
      "This scene has no variant categories. Add categories under Scene → Variants to enable lighting presets."
    ), m.appendChild(M);
  } else if (c.length === 0) {
    const M = document.createElement("p");
    M.classList.add("notification", "warning", "eidolon-light-presets__warning"), M.textContent = f(
      "EIDOLON.LightPresets.NoValuesWarning",
      "Variant categories exist, but none define selectable values. Add values in Scene → Variants."
    ), m.appendChild(M);
  }
  const U = document.createElement("div");
  U.classList.add("eidolon-light-presets__creation"), U.dataset.section = "creation", U.hidden = !0;
  const ie = document.createElement("p");
  ie.classList.add("notes"), ie.textContent = f(
    "EIDOLON.LightPresets.CreateDescription",
    "Assign scene variant values to map the current configuration to a preset."
  ), U.appendChild(ie);
  const Z = document.createElement("div");
  Z.classList.add("eidolon-light-presets__category-list"), U.appendChild(Z);
  for (const M of c) {
    const P = document.createElement("label");
    P.classList.add("eidolon-light-presets__category");
    const z = document.createElement("span");
    z.classList.add("eidolon-light-presets__category-name"), z.textContent = (It = (ze = M.name) == null ? void 0 : ze.trim) != null && It.call(ze) ? M.name.trim() : f("EIDOLON.LightPresets.UnnamedCategory", "Unnamed Category"), P.appendChild(z);
    const B = document.createElement("select");
    B.dataset.categoryId = M.id, B.classList.add("eidolon-light-presets__category-select");
    const W = document.createElement("option");
    W.value = "", W.textContent = f(
      "EIDOLON.LightPresets.IgnoreCategory",
      "Ignore"
    ), B.appendChild(W);
    for (const K of M.values) {
      const Y = document.createElement("option");
      Y.value = K, Y.textContent = K, B.appendChild(Y);
    }
    P.appendChild(B), Z.appendChild(P);
  }
  const G = document.createElement("div");
  G.classList.add("eidolon-light-presets__creation-actions");
  const X = document.createElement("button");
  X.type = "button", X.dataset.action = "save-preset", X.classList.add("eidolon-light-presets__button", "primary"), X.textContent = f(
    "EIDOLON.LightPresets.SavePreset",
    "Save Preset"
  ), G.appendChild(X);
  const x = document.createElement("button");
  x.type = "button", x.dataset.action = "cancel-create", x.classList.add("eidolon-light-presets__button", "secondary"), x.textContent = f(
    "EIDOLON.LightPresets.Cancel",
    "Cancel"
  ), G.appendChild(x), U.appendChild(G), m.appendChild(U), i.appendChild(m), requestAnimationFrame(() => {
    var M;
    (M = e.setPosition) == null || M.call(e, { height: "auto" });
  });
  let C = d;
  ut(E, C), wt(p, {
    state: C,
    hasCategories: c.length > 0
  }), T("LightPresets | Controls injected", {
    sceneId: (s == null ? void 0 : s.id) ?? null,
    lightId: (r == null ? void 0 : r.id) ?? null,
    hasDefault: !!(C != null && C.default),
    presetCount: Array.isArray(C == null ? void 0 : C.presets) ? C.presets.length : 0,
    categories: c.length
  });
  const Et = ls(C), j = {
    restoreConfig: null,
    app: e,
    selectedPreset: Et
  };
  Kt.set(m, j), S.addEventListener("change", () => {
    j.selectedPreset = S.value ?? "", _e({
      presetSelect: S,
      applyPresetButton: H,
      updatePresetButton: V,
      state: C
    });
  });
  const Be = /* @__PURE__ */ a(async () => {
    var B, W, K, Y, de, re, fe, Re, Te, ge, at, k, He, oe;
    const M = S.value ?? "";
    if (!M) {
      (W = (B = ui.notifications) == null ? void 0 : B.warn) == null || W.call(
        B,
        f(
          "EIDOLON.LightPresets.SelectPresetWarning",
          "Choose a preset before applying."
        )
      ), _e({
        presetSelect: S,
        applyPresetButton: H,
        updatePresetButton: V,
        state: C
      });
      return;
    }
    if (M === le) {
      if (!(C != null && C.default)) {
        (Y = (K = ui.notifications) == null ? void 0 : K.warn) == null || Y.call(
          K,
          f(
            "EIDOLON.LightPresets.DefaultUnavailable",
            "Save a default preset before applying it."
          )
        );
        return;
      }
      Vt(m, U, p), xt(e, n, C.default), C = await Ji(o ?? r, {
        presetId: le,
        categories: null,
        updatedAt: Date.now()
      }), j.selectedPreset = le, $e(S, C, u, j.selectedPreset), j.selectedPreset = S.value ?? le, ut(E, C), wt(p, {
        state: C,
        hasCategories: c.length > 0
      }), Zi(n, {
        presetId: le,
        color: ((re = (de = C.default) == null ? void 0 : de.config) == null ? void 0 : re.color) ?? null
      }), (Re = (fe = ui.notifications) == null ? void 0 : fe.info) == null || Re.call(
        fe,
        f(
          "EIDOLON.LightPresets.DefaultApplied",
          "Applied the default preset to the form."
        )
      ), _e({
        presetSelect: S,
        applyPresetButton: H,
        updatePresetButton: V,
        state: C
      });
      return;
    }
    const P = Array.isArray(C == null ? void 0 : C.presets) && C.presets.length ? C.presets.find((ae) => (ae == null ? void 0 : ae.id) === M) : null;
    if (!P) {
      (ge = (Te = ui.notifications) == null ? void 0 : Te.warn) == null || ge.call(
        Te,
        f(
          "EIDOLON.LightPresets.PresetUnavailable",
          "The selected preset is no longer available."
        )
      ), $e(S, C, u, ""), j.selectedPreset = S.value ?? "", _e({
        presetSelect: S,
        applyPresetButton: H,
        updatePresetButton: V,
        state: C
      });
      return;
    }
    Vt(m, U, p), xt(e, n, P.config), C = await Ji(o ?? r, {
      presetId: P.id,
      categories: P.categories,
      updatedAt: Date.now()
    }), j.selectedPreset = P.id, $e(S, C, u, j.selectedPreset), j.selectedPreset = S.value ?? P.id, ut(E, C), wt(p, {
      state: C,
      hasCategories: c.length > 0
    }), Zi(n, {
      presetId: P.id,
      color: ((k = (at = P.config) == null ? void 0 : at.config) == null ? void 0 : k.color) ?? null
    });
    const z = ht(P, u);
    (oe = (He = ui.notifications) == null ? void 0 : He.info) == null || oe.call(
      He,
      f(
        "EIDOLON.LightPresets.PresetApplied",
        "Applied preset: {label}"
      ).replace("{label}", z)
    ), _e({
      presetSelect: S,
      applyPresetButton: H,
      updatePresetButton: V,
      state: C
    });
  }, "applySelectedPreset");
  H.addEventListener("click", () => {
    Be();
  }), S.addEventListener("keydown", (M) => {
    M.key === "Enter" && (M.preventDefault(), Be());
  });
  const st = /* @__PURE__ */ a(async () => {
    var P, z, B, W, K, Y, de, re, fe, Re, Te, ge, at, k, He, oe, ae, J, Q, Lt, Me;
    const M = j.selectedPreset;
    if (!M) {
      (z = (P = ui.notifications) == null ? void 0 : P.warn) == null || z.call(
        P,
        f(
          "EIDOLON.LightPresets.SelectPresetWarning",
          "Choose a preset before applying."
        )
      );
      return;
    }
    V.disabled = !0;
    try {
      const ee = Ut(e, o);
      if (M === le)
        C = await Ki(o ?? r, ee), T("LightPresets | Default preset updated", {
          lightId: ((B = o ?? r) == null ? void 0 : B.id) ?? null,
          configColor: ((W = ee == null ? void 0 : ee.config) == null ? void 0 : W.color) ?? null
        }), (Y = (K = ui.notifications) == null ? void 0 : K.info) == null || Y.call(
          K,
          f(
            "EIDOLON.LightPresets.DefaultUpdated",
            "Updated the default preset with the current configuration."
          )
        ), j.selectedPreset = le;
      else {
        const pe = vi(C, M);
        if (!pe) {
          (re = (de = ui.notifications) == null ? void 0 : de.warn) == null || re.call(
            de,
            f(
              "EIDOLON.LightPresets.PresetUnavailable",
              "The selected preset is no longer available."
            )
          ), $e(S, C, u, ""), j.selectedPreset = S.value ?? "";
          return;
        }
        C = await Yi(
          o ?? r,
          pe.categories,
          ee,
          { label: pe.label ?? null }
        ), T("LightPresets | Preset updated", {
          presetId: M,
          hasColor: !!((fe = ee == null ? void 0 : ee.config) != null && fe.color),
          stored: Array.isArray(C == null ? void 0 : C.presets) ? ((Re = C.presets.find((lt) => (lt == null ? void 0 : lt.id) === M)) == null ? void 0 : Re.config) ?? null : null,
          persisted: (ge = (Te = o ?? r) == null ? void 0 : Te.getFlag) == null ? void 0 : ge.call(Te, nt, mt)
        });
        const Ee = vi(C, M), Ae = ht(Ee || pe, u);
        T("LightPresets | Preset updated", {
          presetId: M,
          categories: pe.categories,
          updatedColor: ((at = ee == null ? void 0 : ee.config) == null ? void 0 : at.color) ?? null,
          storedColor: ((He = (k = Ee == null ? void 0 : Ee.config) == null ? void 0 : k.config) == null ? void 0 : He.color) ?? ((ae = (oe = pe.config) == null ? void 0 : oe.config) == null ? void 0 : ae.color) ?? null
        }), (Q = (J = ui.notifications) == null ? void 0 : J.info) == null || Q.call(
          J,
          f(
            "EIDOLON.LightPresets.PresetUpdated",
            "Saved changes to preset: {label}"
          ).replace("{label}", Ae)
        ), j.selectedPreset = M;
      }
      ut(E, C), wt(p, {
        state: C,
        hasCategories: c.length > 0
      }), $e(S, C, u, j.selectedPreset), j.selectedPreset = S.value ?? "";
    } catch (ee) {
      console.error("eidolon-utilities | Failed to update light preset", ee), (Me = (Lt = ui.notifications) == null ? void 0 : Lt.error) == null || Me.call(
        Lt,
        f(
          "EIDOLON.LightPresets.PresetUpdateError",
          "Failed to save the preset. Check the console for details."
        )
      );
    } finally {
      V.disabled = !1, _e({
        presetSelect: S,
        applyPresetButton: H,
        updatePresetButton: V,
        state: C
      });
    }
  }, "updateSelectedPreset");
  V.addEventListener("click", () => {
    st();
  }), $e(S, C, u, j.selectedPreset), j.selectedPreset = S.value ?? j.selectedPreset ?? "", _e({
    presetSelect: S,
    applyPresetButton: H,
    updatePresetButton: V,
    state: C
  }), w.addEventListener("click", async () => {
    var M, P, z, B, W, K;
    w.disabled = !0;
    try {
      const Y = Ut(e, o);
      C = await Ki(o ?? r, Y), T("LightPresets | Default preset stored", {
        lightId: ((M = o ?? r) == null ? void 0 : M.id) ?? null,
        configColor: ((P = Y == null ? void 0 : Y.config) == null ? void 0 : P.color) ?? null
      }), (B = (z = ui.notifications) == null ? void 0 : z.info) == null || B.call(
        z,
        f(
          "EIDOLON.LightPresets.DefaultStored",
          "Saved the current configuration as the default preset."
        )
      ), ut(E, C), wt(p, {
        state: C,
        hasCategories: c.length > 0
      }), j.selectedPreset = le, $e(S, C, u, j.selectedPreset), j.selectedPreset = S.value ?? "", _e({
        presetSelect: S,
        applyPresetButton: H,
        updatePresetButton: V,
        state: C
      });
    } catch (Y) {
      console.error("eidolon-utilities | Failed to store default light preset", Y), (K = (W = ui.notifications) == null ? void 0 : W.error) == null || K.call(
        W,
        f(
          "EIDOLON.LightPresets.DefaultError",
          "Failed to save the default preset. Check the console for details."
        )
      );
    } finally {
      w.disabled = !1;
    }
  }), p.addEventListener("click", () => {
    var P, z, B, W;
    if (!(C != null && C.default)) {
      (z = (P = ui.notifications) == null ? void 0 : P.warn) == null || z.call(
        P,
        f(
          "EIDOLON.LightPresets.RequiresDefault",
          "Create a default preset before adding additional variants."
        )
      );
      return;
    }
    if (c.length === 0) {
      (W = (B = ui.notifications) == null ? void 0 : B.warn) == null || W.call(
        B,
        f(
          "EIDOLON.LightPresets.NoCategoriesAvailable",
          "Add variant categories with values in the Scene configuration before creating presets."
        )
      );
      return;
    }
    const M = Kt.get(m);
    M && (M.restoreConfig = Ut(e, o)), xt(e, n, C.default), cs(Z), U.hidden = !1, p.setAttribute("aria-expanded", "true"), requestAnimationFrame(() => {
      var K;
      (K = e.setPosition) == null || K.call(e, { height: "auto" });
    });
  }), X.addEventListener("click", async () => {
    var P, z, B, W, K, Y, de;
    const M = us(Z);
    if (!M) {
      (z = (P = ui.notifications) == null ? void 0 : P.warn) == null || z.call(
        P,
        f(
          "EIDOLON.LightPresets.SelectionRequired",
          "Select at least one category value to identify the preset."
        )
      );
      return;
    }
    X.disabled = !0;
    try {
      const re = Ut(e, o);
      C = await Yi(
        o ?? r,
        M,
        re,
        {}
      ), T("LightPresets | Preset saved from editor", {
        categories: M,
        configColor: ((B = re == null ? void 0 : re.config) == null ? void 0 : B.color) ?? null
      }), (K = (W = ui.notifications) == null ? void 0 : W.info) == null || K.call(
        W,
        f(
          "EIDOLON.LightPresets.PresetSaved",
          "Updated lighting preset for the selected scene variants."
        )
      ), ut(E, C);
      const fe = Kr(C, M);
      fe && (j.selectedPreset = fe), $e(S, C, u, j.selectedPreset), j.selectedPreset = S.value ?? "", _e({
        presetSelect: S,
        applyPresetButton: H,
        updatePresetButton: V,
        state: C
      }), Vt(m, U, p);
    } catch (re) {
      console.error("eidolon-utilities | Failed to persist light preset", re), (de = (Y = ui.notifications) == null ? void 0 : Y.error) == null || de.call(
        Y,
        f(
          "EIDOLON.LightPresets.PresetError",
          "Failed to save the preset. Check the console for details."
        )
      );
    } finally {
      X.disabled = !1;
    }
  }), x.addEventListener("click", () => {
    const M = Kt.get(m);
    M != null && M.restoreConfig && xt(e, n, M.restoreConfig), Vt(m, U, p);
  });
}
a(ts, "enhanceAmbientLightConfig");
function Vt(e, t, n) {
  const i = Kt.get(e);
  i && (i.restoreConfig = null), t.hidden = !0, n.setAttribute("aria-expanded", "false"), requestAnimationFrame(() => {
    var r, o;
    (o = (r = i == null ? void 0 : i.app) == null ? void 0 : r.setPosition) == null || o.call(r, { height: "auto" });
  });
}
a(Vt, "hideCreationSection");
function ut(e, t) {
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
a(ut, "updateStatusLine");
function wt(e, { state: t, hasCategories: n }) {
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
a(wt, "updateCreateButtonState");
function Ut(e, t) {
  var u, d, h;
  const n = t ?? Yr(e);
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
  l && (l.querySelectorAll("color-picker[name]").forEach((m) => {
    var E, N;
    const y = m.getAttribute("name");
    if (!y) return;
    const g = typeof m.value == "string" ? m.value : "", O = ((E = m.ui) == null ? void 0 : E.input) ?? ((N = m.querySelector) == null ? void 0 : N.call(m, 'input[type="color"]')), w = (O == null ? void 0 : O.value) ?? "", p = g || w;
    typeof p != "string" || !p || (foundry.utils.setProperty(s, y, p), T("LightPresets | Captured color-picker value", {
      path: y,
      pickerValue: g,
      swatchValue: w,
      chosenValue: p
    }));
  }), l.querySelectorAll("range-picker[name]").forEach((m) => {
    var I, S;
    const y = m.getAttribute("name");
    if (!y) return;
    const g = m.value !== void 0 && m.value !== null ? String(m.value) : "", O = (I = m.querySelector) == null ? void 0 : I.call(m, 'input[type="range"]'), w = (S = m.querySelector) == null ? void 0 : S.call(m, 'input[type="number"]'), p = O instanceof HTMLInputElement ? O.value : "", E = w instanceof HTMLInputElement ? w.value : "", N = g || E || p;
    if (typeof N != "string" || !N.length) return;
    const F = Number(N), R = Number.isFinite(F) ? F : N;
    foundry.utils.setProperty(s, y, R), T("LightPresets | Captured range-picker value", {
      path: y,
      elementValue: g,
      numberValue: E,
      rangeValue: p,
      chosenValue: R
    });
  }));
  const c = bt(s);
  return T("LightPresets | Captured form config", {
    lightId: (n == null ? void 0 : n.id) ?? null,
    hasColor: !!((d = c == null ? void 0 : c.config) != null && d.color),
    color: ((h = c == null ? void 0 : c.config) == null ? void 0 : h.color) ?? null
  }), c;
}
a(Ut, "captureAmbientLightFormConfig");
function xt(e, t, n) {
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
        l instanceof HTMLElement && l.tagName === "COLOR-PICKER" ? is(l, o, e) : l instanceof HTMLElement && l.tagName === "RANGE-PICKER" ? rs(l, o, e) : l instanceof HTMLInputElement ? ns(l, o, e) : l instanceof HTMLSelectElement ? os(l, o, e) : l instanceof HTMLTextAreaElement && ss(l, o, e);
    }
  }
}
a(xt, "applyConfigToForm");
function ns(e, t, n) {
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
a(ns, "applyValueToInput");
function is(e, t, n) {
  var l, c, u, d, h, m;
  const i = t == null ? "" : String(t);
  let r = !1;
  e.value !== i && (e.value = i, e.setAttribute("value", i), (l = e.ui) != null && l.setValue && e.ui.setValue(i), r = !0);
  const o = ((c = e.ui) == null ? void 0 : c.input) ?? ((u = e.querySelector) == null ? void 0 : u.call(e, 'input[type="color"]'));
  o instanceof HTMLInputElement && o.value !== i && (o.value = i, Oe(o, n));
  const s = ((d = e.ui) == null ? void 0 : d.text) ?? ((h = e.querySelector) == null ? void 0 : h.call(e, 'input[type="text"]'));
  if (s instanceof HTMLInputElement && s.value !== i && (s.value = i, Oe(s, n)), (m = e.ui) != null && m.commit)
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
a(is, "applyValueToColorPicker");
function rs(e, t, n) {
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
    } catch (h) {
      console.error("eidolon-utilities | range-picker commit failed", h);
    }
  T("LightPresets | Range picker applied", {
    value: i,
    resolvedValue: o,
    rangeValue: (l == null ? void 0 : l.value) ?? null,
    numberValue: (c == null ? void 0 : c.value) ?? null
  }), s && Oe(e, n);
}
a(rs, "applyValueToRangePicker");
function os(e, t, n) {
  const i = t == null ? "" : String(t);
  e.value !== i && (e.value = i, Oe(e, n));
}
a(os, "applyValueToSelect");
function ss(e, t, n) {
  const i = t == null ? "" : String(t);
  e.value !== i && (e.value = i, Oe(e, n));
}
a(ss, "applyValueToTextarea");
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
function _e({ presetSelect: e, applyPresetButton: t, updatePresetButton: n, state: i }) {
  const r = (e == null ? void 0 : e.value) ?? "", o = !!(i != null && i.default), s = r && r !== le ? !!vi(i, r) : !1;
  t instanceof HTMLButtonElement && (r ? r === le ? t.disabled = !o : t.disabled = !s : t.disabled = !0), n instanceof HTMLButtonElement && (r ? r === le ? n.disabled = !1 : n.disabled = !s : n.disabled = !0);
}
a(_e, "syncPresetSwitcherState");
function as(e) {
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
a(as, "buildCategoryNameLookup");
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
  u.value = le, u.textContent = f(
    "EIDOLON.LightPresets.DefaultOption",
    "Default Preset"
  ), u.disabled = !o, e.appendChild(u), s.slice().sort((m, y) => {
    var w;
    const g = ht(m, n), O = ht(y, n);
    return g.localeCompare(O, ((w = game.i18n) == null ? void 0 : w.lang) ?? void 0, {
      sensitivity: "base"
    });
  }).forEach((m) => {
    if (!(m != null && m.id)) return;
    const y = document.createElement("option");
    y.value = m.id, y.textContent = ht(m, n), e.appendChild(y);
  });
  const d = new Set(
    Array.from(e.options).filter((m) => !m.disabled).map((m) => m.value)
  ), h = r || (d.has(l) ? l : "");
  h && d.has(h) ? e.value = h : o ? e.value = le : e.value = "";
}
a($e, "populatePresetSelector");
function ht(e, t) {
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
a(ht, "formatPresetOptionLabel");
function Kr(e, t) {
  if (!e || typeof e != "object" || !Array.isArray(e.presets)) return null;
  const n = Pn(t);
  if (!n) return null;
  const i = e.presets.find((r) => (r == null ? void 0 : r.key) === n);
  return (i == null ? void 0 : i.id) ?? null;
}
a(Kr, "findPresetIdByCategories");
function vi(e, t) {
  return !t || !e || typeof e != "object" || !Array.isArray(e.presets) ? null : e.presets.find((n) => (n == null ? void 0 : n.id) === t) ?? null;
}
a(vi, "getPresetById");
function ls(e) {
  if (!e || typeof e != "object") return "";
  const t = e.current;
  if (t != null && t.presetId) {
    if (t.presetId === le)
      return e != null && e.default ? le : "";
    if (Array.isArray(e.presets) && e.presets.some((n) => n.id === t.presetId))
      return t.presetId;
  }
  if (t != null && t.categories) {
    const n = Kr(e, t.categories);
    if (n) return n;
  }
  return "";
}
a(ls, "resolveInitialPresetSelection");
function Zi(e, t = {}) {
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
a(Zi, "logAppliedColorState");
function cs(e) {
  e.querySelectorAll("select[data-category-id]").forEach((t) => {
    t.value = "";
  });
}
a(cs, "resetCategorySelections");
function us(e) {
  const t = {};
  return e.querySelectorAll("select[data-category-id]").forEach((n) => {
    var o, s;
    const i = n.dataset.categoryId, r = (s = (o = n.value) == null ? void 0 : o.trim) == null ? void 0 : s.call(o);
    !i || !r || (t[i] = r);
  }), Object.keys(t).length > 0 ? t : null;
}
a(us, "readCategorySelections");
function Yr(e) {
  const t = (e == null ? void 0 : e.object) ?? (e == null ? void 0 : e.document) ?? null;
  return !(t != null && t.isEmbedded) || t.documentName !== "AmbientLight" ? null : t;
}
a(Yr, "getAmbientLightDocument");
function ds(e) {
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
a(ds, "getPersistedAmbientLightDocument");
function fs() {
  Zo();
}
a(fs, "registerLightPresetHooks");
fs();
const Oi = /* @__PURE__ */ new Map();
let Ei = !1;
function gs(e, t) {
  Oi.has(e) && console.warn(`[${v}] Socket handler for type "${e}" already registered, overwriting.`), Oi.set(e, t);
}
a(gs, "registerSocketHandler");
function ms(e, t) {
  if (!Ei) {
    console.error(`[${v}] Socket not initialized. Call initializeSocket() first.`);
    return;
  }
  game.socket.emit(`module.${v}`, { type: e, payload: t });
}
a(ms, "emitSocket");
function hs() {
  Ei || (game.socket.on(`module.${v}`, (e) => {
    const { type: t, payload: n } = e ?? {}, i = Oi.get(t);
    i ? i(n) : console.warn(`[${v}] No socket handler for type "${t}"`);
  }), Ei = !0, console.log(`[${v}] Socket initialized on channel module.${v}`));
}
a(hs, "initializeSocket");
const Jr = "tween", rn = /* @__PURE__ */ new Map();
function Qr({ type: e, execute: t, validate: n }) {
  rn.has(e) && console.warn(`[tween-registry] Type "${e}" already registered, overwriting.`), rn.set(e, { type: e, execute: t, validate: n ?? (() => {
  }) });
}
a(Qr, "registerTweenType");
function Xr(e) {
  return rn.get(e);
}
a(Xr, "getTweenType");
function Ii() {
  return [...rn.keys()];
}
a(Ii, "listTweenTypes");
function Zr(e) {
  const t = foundry.canvas.animation.CanvasAnimation;
  return {
    linear: t.easeLinear,
    easeInOutCosine: t.easeInOutCosine
  }[e] ?? t.easeInOutCosine;
}
a(Zr, "resolveEasing");
function on(e) {
  return e <= 0.04045 ? e / 12.92 : ((e + 0.055) / 1.055) ** 2.4;
}
a(on, "srgbToLinear");
function yt(e) {
  return e <= 31308e-7 ? 12.92 * e : 1.055 * e ** (1 / 2.4) - 0.055;
}
a(yt, "linearToSrgb");
function er(e, t, n) {
  const i = 0.4122214708 * e + 0.5363325363 * t + 0.0514459929 * n, r = 0.2119034982 * e + 0.6806995451 * t + 0.1073969566 * n, o = 0.0883024619 * e + 0.2817188376 * t + 0.6299787005 * n, s = Math.cbrt(i), l = Math.cbrt(r), c = Math.cbrt(o);
  return [
    0.2104542553 * s + 0.793617785 * l - 0.0040720468 * c,
    1.9779984951 * s - 2.428592205 * l + 0.4505937099 * c,
    0.0259040371 * s + 0.7827717662 * l - 0.808675766 * c
  ];
}
a(er, "linearRgbToOklab");
function ys(e, t, n) {
  const i = (e + 0.3963377774 * t + 0.2158037573 * n) ** 3, r = (e - 0.1055613458 * t - 0.0638541728 * n) ** 3, o = (e - 0.0894841775 * t - 1.291485548 * n) ** 3;
  return [
    4.0767416621 * i - 3.3077115913 * r + 0.2309699292 * o,
    -1.2684380046 * i + 2.6097574011 * r - 0.3413193965 * o,
    -0.0041960863 * i - 0.7034186147 * r + 1.707614701 * o
  ];
}
a(ys, "oklabToLinearRgb");
function sn(e) {
  return [e.r, e.g, e.b];
}
a(sn, "colorToRgb");
function eo(e, t, n) {
  const i = /* @__PURE__ */ a((o) => Math.max(0, Math.min(1, o)), "clamp"), r = /* @__PURE__ */ a((o) => Math.round(i(o) * 255).toString(16).padStart(2, "0"), "toHex");
  return `#${r(e)}${r(t)}${r(n)}`;
}
a(eo, "rgbToHex");
function Ts(e, t, n) {
  if (n <= 0) return e.toHTML();
  if (n >= 1) return t.toHTML();
  const i = foundry.utils.Color, [r, o, s] = e.hsl, [l, c, u] = t.hsl, d = (l - r + 0.5) % 1 - 0.5, h = (r + d * n + 1) % 1, m = o + (c - o) * n, y = s + (u - s) * n;
  return i.fromHSL([h, m, y]).toHTML();
}
a(Ts, "interpolateHsl");
function ps(e, t, n) {
  if (n <= 0) return e.toHTML();
  if (n >= 1) return t.toHTML();
  const [i, r, o] = sn(e).map(on), [s, l, c] = sn(t).map(on), u = yt(i + (s - i) * n), d = yt(r + (l - r) * n), h = yt(o + (c - o) * n);
  return eo(u, d, h);
}
a(ps, "interpolateRgb");
function bs(e, t, n) {
  if (n <= 0) return e.toHTML();
  if (n >= 1) return t.toHTML();
  const [i, r, o] = sn(e).map(on), [s, l, c] = sn(t).map(on), [u, d, h] = er(i, r, o), [m, y, g] = er(s, l, c), O = 0.02, w = Math.sqrt(d * d + h * h), p = Math.sqrt(y * y + g * g);
  let E, N, F;
  if (w < O || p < O)
    E = u + (m - u) * n, N = d + (y - d) * n, F = h + (g - h) * n;
  else {
    const H = Math.atan2(h, d);
    let U = Math.atan2(g, y) - H;
    U > Math.PI && (U -= 2 * Math.PI), U < -Math.PI && (U += 2 * Math.PI), E = u + (m - u) * n;
    const ie = w + (p - w) * n, Z = H + U * n;
    N = ie * Math.cos(Z), F = ie * Math.sin(Z);
  }
  const [R, I, S] = ys(E, N, F);
  return eo(yt(R), yt(I), yt(S));
}
a(bs, "interpolateOklch");
const Li = {
  hsl: Ts,
  rgb: ps,
  oklch: bs
};
function vs(e = "hsl") {
  return Li[e] ?? Li.hsl;
}
a(vs, "getInterpolator");
function tr() {
  return Object.keys(Li);
}
a(tr, "listInterpolationModes");
function Os(e) {
  const t = Array.isArray(e.uuid) ? e.uuid : [e.uuid];
  if (t.length === 0 || t.some((i) => !i || typeof i != "string"))
    throw new Error("light-color tween: 'uuid' is required (string or array of AmbientLight document UUIDs).");
  if (!e.toColor || typeof e.toColor != "string")
    throw new Error("light-color tween: 'toColor' is required (CSS color string).");
  if (!foundry.utils.Color.fromString(e.toColor).valid)
    throw new Error(`light-color tween: invalid target color "${e.toColor}".`);
  if (e.mode && !tr().includes(e.mode))
    throw new Error(
      `light-color tween: unknown mode "${e.mode}". Available: ${tr().join(", ")}`
    );
}
a(Os, "validate$1");
async function Es(e, t = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { Color: i } = foundry.utils, { uuid: r, toColor: o, mode: s = "oklch" } = e, l = Array.isArray(r) ? r : [r], {
    durationMS: c = 2e3,
    easing: u = "easeInOutCosine",
    commit: d = !0,
    startEpochMS: h = null
  } = t, m = Zr(u), y = vs(s), g = i.fromString(o);
  if (!g.valid) throw new Error(`light-color tween: invalid target color "${o}".`);
  async function O(p) {
    var ie;
    const E = await fromUuid(p);
    if (!E) return !1;
    const N = E.object;
    if (!N) return !1;
    const F = (ie = E.config) == null ? void 0 : ie.color;
    F != null && F.valid || console.warn(`light-color tween: source color invalid on ${p}, using white.`);
    const R = F != null && F.valid ? F : i.fromString("#ffffff"), I = { t: 0 }, S = `ambient-hue-tween:${p}`;
    n.terminateAnimation(S);
    const H = typeof h == "number" ? Math.max(0, Math.min(c, Date.now() - h)) : 0, V = /* @__PURE__ */ a((Z) => {
      E.updateSource({ config: { color: Z } }), N.initializeLightSource();
    }, "applyLocalColor");
    H > 0 && (I.t = H / c, V(y(R, g, I.t)));
    const U = await n.animate(
      [{ parent: I, attribute: "t", to: 1 }],
      {
        name: S,
        duration: c,
        easing: m,
        time: H,
        ontick: /* @__PURE__ */ a(() => {
          V(y(R, g, I.t));
        }, "ontick")
      }
    );
    return U !== !1 && V(g.toHTML()), d && U !== !1 && E.canUserModify(game.user, "update") && (E.updateSource({ config: { color: R.toHTML() } }), await E.update({ "config.color": g.toHTML() })), U !== !1;
  }
  return a(O, "animateOne"), (await Promise.all(l.map(O))).every(Boolean);
}
a(Es, "execute$1");
function Is() {
  Qr({ type: "light-color", execute: Es, validate: Os });
}
a(Is, "registerLightColorTween");
const ke = /* @__PURE__ */ new WeakMap();
function Ls(e) {
  const t = Array.isArray(e.uuid) ? e.uuid : [e.uuid];
  if (t.length === 0 || t.some((n) => !n || typeof n != "string"))
    throw new Error("light-state tween: 'uuid' is required (string or array of AmbientLight document UUIDs).");
  if (typeof e.enabled != "boolean")
    throw new Error("light-state tween: 'enabled' (boolean) is required.");
}
a(Ls, "validate");
async function Ss(e, t = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, enabled: r } = e, o = Array.isArray(i) ? i : [i], {
    durationMS: s = 2e3,
    easing: l = "easeInOutCosine",
    commit: c = !0,
    startEpochMS: u = null
  } = t, d = Zr(l);
  async function h(y) {
    var R, I, S, H, V, U, ie, Z;
    const g = await fromUuid(y);
    if (!g) return !1;
    const O = g.object;
    if (!O) return !1;
    const w = `ambient-state-tween:${y}`;
    n.terminateAnimation(w);
    const p = ke.get(g) ?? {
      hidden: g._source.hidden,
      alpha: ((R = g._source.config) == null ? void 0 : R.alpha) ?? 0.5
    };
    if (ke.set(g, p), console.log(
      `[light-state] START ${r ? "ON" : "OFF"} | snap:`,
      JSON.stringify(p),
      `| _source.hidden=${g._source.hidden}, _source.config.alpha=${(I = g._source.config) == null ? void 0 : I.alpha}`,
      `| doc.hidden=${g.hidden}, doc.config?.alpha=${(S = g.config) == null ? void 0 : S.alpha}`
    ), r && !p.hidden || !r && p.hidden)
      return ke.delete(g), !0;
    const E = p.alpha;
    console.log(`[light-state] targetAlpha=${E}`);
    const N = typeof u == "number" ? Math.max(0, Math.min(s, Date.now() - u)) : 0, F = /* @__PURE__ */ a((G) => {
      g.updateSource({ config: { alpha: G } }), O.initializeLightSource();
    }, "applyAlpha");
    if (r) {
      g.updateSource({ hidden: !1, config: { alpha: 0 } }), O.initializeLightSource(), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
      const G = { t: 0 };
      N > 0 && (G.t = N / s, F(E * G.t));
      let X = 0;
      const x = await n.animate(
        [{ parent: G, attribute: "t", to: 1 }],
        {
          name: w,
          duration: s,
          easing: d,
          time: N,
          ontick: /* @__PURE__ */ a(() => {
            X++, F(E * G.t);
          }, "ontick")
        }
      );
      return console.log(`[light-state] FADE-IN anim done. completed=${x}, ticks=${X}, state.t=${G.t}`), x !== !1 && c && g.canUserModify(game.user, "update") ? (console.log(`[light-state] FADE-IN pre-commit: _source.hidden=${g._source.hidden}, _source.config.alpha=${(H = g._source.config) == null ? void 0 : H.alpha}`), g.updateSource({ hidden: !0, config: { alpha: E } }), console.log(`[light-state] FADE-IN post-updateSource: _source.hidden=${g._source.hidden}, _source.config.alpha=${(V = g._source.config) == null ? void 0 : V.alpha}`), await g.update({ hidden: !1 }), console.log(`[light-state] FADE-IN post-commit: _source.hidden=${g._source.hidden}, _source.config.alpha=${(U = g._source.config) == null ? void 0 : U.alpha}`), ke.delete(g)) : x === !1 ? console.log("[light-state] FADE-IN terminated") : ke.delete(g), x !== !1;
    } else {
      g.updateSource({ hidden: !1, config: { alpha: p.alpha } }), O.initializeLightSource();
      const G = { t: 0 };
      N > 0 && (G.t = N / s, F(E * (1 - G.t)));
      let X = 0;
      const x = await n.animate(
        [{ parent: G, attribute: "t", to: 1 }],
        {
          name: w,
          duration: s,
          easing: d,
          time: N,
          ontick: /* @__PURE__ */ a(() => {
            X++, F(E * (1 - G.t));
          }, "ontick")
        }
      );
      return console.log(`[light-state] FADE-OUT anim done. completed=${x}, ticks=${X}`), x !== !1 && c && g.canUserModify(game.user, "update") ? (console.log(`[light-state] FADE-OUT pre-commit: _source.hidden=${g._source.hidden}, _source.config.alpha=${(ie = g._source.config) == null ? void 0 : ie.alpha}`), await g.update({ hidden: !0 }), g.updateSource({ config: { alpha: E } }), O.initializeLightSource(), console.log(`[light-state] FADE-OUT post-commit+restore: _source.hidden=${g._source.hidden}, _source.config.alpha=${(Z = g._source.config) == null ? void 0 : Z.alpha}`), ke.delete(g)) : x === !1 || (g.updateSource({ hidden: !0, config: { alpha: E } }), O.initializeLightSource(), ke.delete(g)), x !== !1;
    }
  }
  return a(h, "animateOne"), (await Promise.all(o.map(h))).every(Boolean);
}
a(Ss, "execute");
function ws() {
  Qr({ type: "light-state", execute: Ss, validate: Ls });
}
a(ws, "registerLightStateTween");
async function Cs(e, t, n = {}) {
  if (!game.user.isGM)
    return ui.notifications.warn("Only the GM can dispatch tweens."), !1;
  const i = Xr(e);
  if (!i)
    throw new Error(`Unknown tween type: "${e}". Registered types: ${Ii().join(", ")}`);
  i.validate(t);
  const { durationMS: r = 2e3, easing: o = "easeInOutCosine", commit: s = !0 } = n, l = Date.now();
  return ms(Jr, {
    type: e,
    params: t,
    durationMS: r,
    easing: o,
    startEpochMS: l,
    commit: !1
  }), i.execute(t, { durationMS: r, easing: o, commit: s, startEpochMS: l });
}
a(Cs, "dispatchTween");
function Ns(e) {
  const { type: t, params: n, durationMS: i, easing: r, startEpochMS: o, commit: s } = e ?? {}, l = Xr(t);
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
a(Ns, "handleTweenSocketMessage");
Is();
ws();
gs(Jr, Ns);
function Ms() {
  Hooks.once("ready", () => {
    hs();
    const e = game.modules.get(v);
    e.api || (e.api = {}), e.api.tween = {
      dispatch: Cs,
      types: Ii
    }, console.log(`[${v}] Tween API registered. Types: ${Ii().join(", ")}`);
  });
}
a(Ms, "registerTweenHooks");
Ms();
//# sourceMappingURL=eidolon-utilities.js.map
