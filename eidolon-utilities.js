var sr = Object.defineProperty;
var Ao = Object.getPrototypeOf;
var Mo = Reflect.get;
var ar = (e) => {
  throw TypeError(e);
};
var Do = (e, t, n) => t in e ? sr(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var s = (e, t) => sr(e, "name", { value: t, configurable: !0 });
var Qe = (e, t, n) => Do(e, typeof t != "symbol" ? t + "" : t, n), Jn = (e, t, n) => t.has(e) || ar("Cannot " + n);
var g = (e, t, n) => (Jn(e, t, "read from private field"), n ? n.call(e) : t.get(e)), C = (e, t, n) => t.has(e) ? ar("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), N = (e, t, n, i) => (Jn(e, t, "write to private field"), i ? i.call(e, n) : t.set(e, n), n), S = (e, t, n) => (Jn(e, t, "access private method"), n);
var ft = (e, t, n) => Mo(Ao(e), n, t);
const E = "eidolon-utilities", an = "timeTriggerActive", ti = "timeTriggerHideWindow", ni = "timeTriggerShowPlayerWindow", ii = "timeTriggerAllowRealTime", Ar = "timeTriggers", Xt = "timeTriggerHistory", ri = "debug", oi = "timeFormat", si = "manageTime", ai = "secondsPerRound";
const Po = [-30, -15, -5, 5, 15, 30], yt = 1440 * 60, Zt = "playSound", Gt = 6;
function f(e, t) {
  var n, i;
  return (i = (n = game.i18n) == null ? void 0 : n.has) != null && i.call(n, e) ? game.i18n.localize(e) : t;
}
s(f, "localize");
function ln(e) {
  return typeof e != "string" ? "" : e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
s(ln, "escapeHtml");
function lt(e) {
  var t;
  return e == null ? e : (t = foundry == null ? void 0 : foundry.utils) != null && t.duplicate ? foundry.utils.duplicate(e) : JSON.parse(JSON.stringify(e));
}
s(lt, "duplicateData");
function Fo() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
s(Fo, "generateTriggerId");
function Mr(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  if (!t) return null;
  const n = t.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (!n) return null;
  const i = Number(n[1]), r = Number(n[2]), o = n[3] !== void 0 ? Number(n[3]) : 0;
  return !Number.isInteger(i) || !Number.isInteger(r) || !Number.isInteger(o) || i < 0 || i > 23 || r < 0 || r > 59 || o < 0 || o > 59 ? null : i * 3600 + r * 60 + o;
}
s(Mr, "parseTriggerTimeToSeconds");
function Mt() {
  var e, t;
  return ((e = game.scenes) == null ? void 0 : e.current) ?? ((t = game.scenes) == null ? void 0 : t.active) ?? null;
}
s(Mt, "getActiveScene");
function Le(e) {
  return (e == null ? void 0 : e.object) ?? (e == null ? void 0 : e.document) ?? null;
}
s(Le, "getSceneFromApplication");
function ae(e) {
  return e && typeof e.getFlag == "function" && typeof e.setFlag == "function";
}
s(ae, "hasSceneDocument");
const li = /* @__PURE__ */ new Set(), ci = /* @__PURE__ */ new Set(), di = /* @__PURE__ */ new Set(), fi = /* @__PURE__ */ new Set();
let ct = !1, Ft = !1, cn = Gt, un = "12h", lr = !1;
function Kn(e) {
  ct = !!e;
  for (const t of li)
    try {
      t(ct);
    } catch (n) {
      console.error(`${E} | Debug change handler failed`, n);
    }
}
s(Kn, "notifyDebugChange");
function Yn(e) {
  Ft = !!e;
  for (const t of ci)
    try {
      t(Ft);
    } catch (n) {
      console.error(`${E} | Manage time change handler failed`, n);
    }
}
s(Yn, "notifyManageTimeChange");
function Dr(e) {
  return e === "24h" ? "24h" : "12h";
}
s(Dr, "normalizeTimeFormatValue");
function Ui(e) {
  const t = Number(e);
  return !Number.isFinite(t) || t <= 0 ? Gt : t;
}
s(Ui, "normalizeSecondsPerRoundValue");
function Qn(e) {
  const t = Ui(e);
  cn = t;
  for (const n of di)
    try {
      n(t);
    } catch (i) {
      console.error(`${E} | Seconds-per-round change handler failed`, i);
    }
}
s(Qn, "notifySecondsPerRoundChange");
function Xn(e) {
  const t = Dr(e);
  un = t;
  for (const n of fi)
    try {
      n(t);
    } catch (i) {
      console.error(`${E} | Time format change handler failed`, i);
    }
}
s(Xn, "notifyTimeFormatChange");
function _o() {
  var t;
  if (lr) return;
  if (lr = !0, !((t = game == null ? void 0 : game.settings) != null && t.register)) {
    console.warn(
      `${E} | game.settings.register is unavailable. Module settings could not be registered.`
    );
    return;
  }
  const e = typeof game.settings.registerChange == "function";
  game.settings.register(E, ri, {
    name: f("EIDOLON.TimeTrigger.DebugSettingName", "Enable debug logging"),
    hint: f(
      "EIDOLON.TimeTrigger.DebugSettingHint",
      "Write detailed time-trigger diagnostics to the browser console."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: e ? void 0 : Kn
  }), e && game.settings.registerChange(E, ri, Kn), ct = qi(), Kn(ct), game.settings.register(E, si, {
    name: f("EIDOLON.TimeTrigger.ManageTimeSettingName", "Manage Game Time"),
    hint: f(
      "EIDOLON.TimeTrigger.ManageTimeSettingHint",
      "Allow Eidolon Utilities to advance world time automatically while the game is unpaused. Warning: This may conflict with other time-management modules."
    ),
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1,
    onChange: e ? void 0 : Yn
  }), e && game.settings.registerChange(E, si, Yn), Ft = Ho(), Yn(Ft), game.settings.register(E, ai, {
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
    default: Gt,
    range: { min: 1, max: 3600, step: 1 },
    onChange: e ? void 0 : Qn
  }), e && game.settings.registerChange(
    E,
    ai,
    Qn
  ), cn = Ui($o()), Qn(cn), game.settings.register(E, oi, {
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
    onChange: e ? void 0 : Xn
  }), e && game.settings.registerChange(E, oi, Xn), un = Dr(Pr()), Xn(un);
}
s(_o, "registerTimeTriggerSettings");
function qi() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get)
      return !!game.settings.get(E, ri);
  } catch (t) {
    console.error(`${E} | Failed to read debug setting`, t);
  }
  return !1;
}
s(qi, "getDebugSetting");
function Ro() {
  return ct = qi(), ct;
}
s(Ro, "refreshDebugSettingCache");
function Ho() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get)
      return !!game.settings.get(E, si);
  } catch (t) {
    console.error(`${E} | Failed to read manage time setting`, t);
  }
  return !1;
}
s(Ho, "getManageTimeSetting");
function Pr() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get)
      return game.settings.get(E, oi) === "24h" ? "24h" : "12h";
  } catch (t) {
    console.error(`${E} | Failed to read time format setting`, t);
  }
  return "12h";
}
s(Pr, "getTimeFormatSetting");
function $o() {
  var e;
  try {
    if ((e = game == null ? void 0 : game.settings) != null && e.get) {
      const t = game.settings.get(E, ai);
      return Ui(t);
    }
  } catch (t) {
    console.error(`${E} | Failed to read seconds-per-round setting`, t);
  }
  return Gt;
}
s($o, "getSecondsPerRoundSetting");
function Vo(e) {
  if (typeof e != "function")
    return () => {
    };
  li.add(e);
  try {
    e(ct);
  } catch (t) {
    console.error(`${E} | Debug change handler failed`, t);
  }
  return () => {
    li.delete(e);
  };
}
s(Vo, "onDebugSettingChange");
function Fr(e) {
  if (typeof e != "function")
    return () => {
    };
  ci.add(e);
  try {
    e(Ft);
  } catch (t) {
    console.error(`${E} | Manage time change handler failed`, t);
  }
  return () => {
    ci.delete(e);
  };
}
s(Fr, "onManageTimeSettingChange");
function Bi(e) {
  if (typeof e != "function")
    return () => {
    };
  fi.add(e);
  try {
    e(un);
  } catch (t) {
    console.error(`${E} | Time format change handler failed`, t);
  }
  return () => {
    fi.delete(e);
  };
}
s(Bi, "onTimeFormatSettingChange");
function ko(e) {
  if (typeof e != "function")
    return () => {
    };
  di.add(e);
  try {
    e(cn);
  } catch (t) {
    console.error(`${E} | Seconds-per-round change handler failed`, t);
  }
  return () => {
    di.delete(e);
  };
}
s(ko, "onSecondsPerRoundSettingChange");
let Un = !1, gi = !1;
function mi(e) {
  Un = !!e;
}
s(mi, "updateDebugState");
function _r() {
  gi || (gi = !0, mi(qi()), Vo((e) => {
    mi(e), console.info(`${E} | Debug ${Un ? "enabled" : "disabled"}`);
  }));
}
s(_r, "ensureInitialized");
function Gi() {
  return gi || _r(), Un;
}
s(Gi, "shouldLog");
function Rr(e) {
  if (!e.length)
    return [`${E} |`];
  const [t, ...n] = e;
  return typeof t == "string" ? [`${E} | ${t}`, ...n] : [`${E} |`, t, ...n];
}
s(Rr, "formatArgs");
function xo() {
  _r();
}
s(xo, "initializeDebug");
function jo() {
  return mi(Ro()), Un;
}
s(jo, "syncDebugState");
function b(...e) {
  Gi() && console.debug(...Rr(e));
}
s(b, "debugLog");
function Et(...e) {
  Gi() && console.group(...Rr(e));
}
s(Et, "debugGroup");
function We() {
  Gi() && console.groupEnd();
}
s(We, "debugGroupEnd");
function pt(e) {
  var r;
  const t = (r = e == null ? void 0 : e.getFlag) == null ? void 0 : r.call(e, E, Ar);
  if (!t) return [];
  const n = lt(t), i = Array.isArray(n) ? n : [];
  return b("Loaded time triggers", {
    sceneId: (e == null ? void 0 : e.id) ?? null,
    count: i.length
  }), i;
}
s(pt, "getTimeTriggers");
async function Hr(e, t) {
  e != null && e.setFlag && (b("Persisting time triggers", {
    sceneId: e.id,
    count: Array.isArray(t) ? t.length : 0
  }), await e.setFlag(E, Ar, t));
}
s(Hr, "setTimeTriggers");
function Uo(e) {
  var r;
  const t = (r = e == null ? void 0 : e.getFlag) == null ? void 0 : r.call(e, E, Xt);
  if (!t) return {};
  const n = lt(t);
  if (!n || typeof n != "object") return {};
  const i = {};
  for (const [o, a] of Object.entries(n))
    typeof a == "number" && Number.isFinite(a) && (i[o] = a);
  return b("Loaded time trigger history", {
    sceneId: (e == null ? void 0 : e.id) ?? null,
    keys: Object.keys(i)
  }), i;
}
s(Uo, "getTimeTriggerHistory");
async function Zn(e, t) {
  var c, u, d, y;
  if (!e) return;
  const n = {};
  if (t && typeof t == "object")
    for (const [h, T] of Object.entries(t))
      typeof T == "number" && Number.isFinite(T) && (n[h] = T);
  const i = ((c = e.getFlag) == null ? void 0 : c.call(e, E, Xt)) ?? {}, r = {};
  if (i && typeof i == "object")
    for (const [h, T] of Object.entries(i))
      typeof T == "number" && Number.isFinite(T) && (r[h] = T);
  const o = Object.keys(n), a = Object.keys(r);
  if (typeof ((u = foundry == null ? void 0 : foundry.utils) == null ? void 0 : u.deepEqual) == "function" ? foundry.utils.deepEqual(r, n) : JSON.stringify(r) === JSON.stringify(n)) {
    b("Skip history update because state is unchanged", {
      sceneId: (e == null ? void 0 : e.id) ?? null
    });
    return;
  }
  b("Updating time trigger history", {
    sceneId: (e == null ? void 0 : e.id) ?? null,
    keys: o,
    removedKeys: a.filter((h) => !o.includes(h))
  });
  try {
    a.length && typeof e.unsetFlag == "function" && await e.unsetFlag(E, Xt), o.length && await e.setFlag(E, Xt, n);
  } catch (h) {
    console.error(`${E} | Failed to persist time trigger history`, h), (y = (d = ui.notifications) == null ? void 0 : d.error) == null || y.call(
      d,
      f(
        "EIDOLON.TimeTrigger.HistoryPersistError",
        "Failed to persist the scene's time trigger history."
      )
    );
  }
}
s(Zn, "updateTimeTriggerHistory");
const dn = /* @__PURE__ */ new Map(), cr = /* @__PURE__ */ new Set();
function qo(e) {
  if (!(e != null && e.id))
    throw new Error(`${E} | Action definitions require an id.`);
  if (dn.has(e.id))
    throw new Error(`${E} | Duplicate time trigger action id: ${e.id}`);
  dn.set(e.id, {
    ...e
  }), b("Registered time trigger action", { actionId: e.id });
}
s(qo, "registerAction");
function zt(e) {
  return dn.get(e) ?? null;
}
s(zt, "getAction");
function Bo(e) {
  const t = zt(e);
  return t ? typeof t.label == "function" ? t.label() : t.label : e;
}
s(Bo, "getActionLabel");
function ur() {
  return Array.from(dn.values());
}
s(ur, "listActions");
async function $r(e, t) {
  var i, r;
  const n = zt(t == null ? void 0 : t.action);
  if (!n || typeof n.execute != "function") {
    const o = f(
      "EIDOLON.TimeTrigger.UnknownAction",
      "Encountered an unknown time trigger action and skipped it."
    );
    (r = (i = ui.notifications) == null ? void 0 : i.warn) == null || r.call(i, o), console.warn(`${E} | Unknown time trigger action`, t), b("Encountered unknown time trigger action", {
      triggerId: (t == null ? void 0 : t.id) ?? null,
      actionId: (t == null ? void 0 : t.action) ?? null
    });
    return;
  }
  b("Executing action handler", {
    actionId: n.id,
    triggerId: (t == null ? void 0 : t.id) ?? null,
    sceneId: (e == null ? void 0 : e.id) ?? null
  }), await n.execute({ scene: e, trigger: t });
}
s($r, "executeTriggerAction");
function Go(e) {
  const t = zt(e == null ? void 0 : e.action);
  return !t || typeof t.buildSummaryParts != "function" ? [] : t.buildSummaryParts({ trigger: e, escapeHtml: ln, localize: f }) ?? [];
}
s(Go, "buildActionSummaryParts");
function zo(e) {
  const t = zt(e == null ? void 0 : e.action);
  return !t || typeof t.buildFormContent != "function" ? "" : t.buildFormContent({ trigger: e, escapeHtml: ln, localize: f }) ?? "";
}
s(zo, "buildActionFormSection");
function Wo(e, t) {
  const n = zt(e == null ? void 0 : e.action);
  !n || typeof n.prepareFormData != "function" || n.prepareFormData({ trigger: e, formData: t });
}
s(Wo, "applyActionFormData");
function Jo(e, t, n) {
  var o, a;
  const i = `${(e == null ? void 0 : e.id) ?? "unknown"}:${(t == null ? void 0 : t.id) ?? (t == null ? void 0 : t.action) ?? "unknown"}:${n}`;
  if (cr.has(i)) return;
  cr.add(i);
  const r = f(
    "EIDOLON.TimeTrigger.MissingDataWarning",
    "A scene time trigger is missing required data and was skipped."
  );
  (a = (o = ui.notifications) == null ? void 0 : o.warn) == null || a.call(o, r), console.warn(`${E} | Missing trigger data (${n})`, { scene: e == null ? void 0 : e.id, trigger: t });
}
s(Jo, "warnMissingTriggerData");
async function Ko({ scene: e, trigger: t }) {
  var o, a, l, c, u;
  const n = (l = (a = (o = t == null ? void 0 : t.data) == null ? void 0 : o.path) == null ? void 0 : a.trim) == null ? void 0 : l.call(a);
  if (!n) {
    Jo(e, t, "missing-audio-path");
    return;
  }
  const i = {
    src: n,
    autoplay: !0,
    loop: !1
  }, r = (() => {
    var d, y, h, T, m;
    return typeof ((y = (d = foundry == null ? void 0 : foundry.audio) == null ? void 0 : d.AudioHelper) == null ? void 0 : y.play) == "function" ? foundry.audio.AudioHelper.play(i, !0) : typeof ((T = (h = game == null ? void 0 : game.audio) == null ? void 0 : h.constructor) == null ? void 0 : T.play) == "function" ? game.audio.constructor.play(i, !0) : typeof ((m = game == null ? void 0 : game.audio) == null ? void 0 : m.play) == "function" ? game.audio.play(i, !0) : null;
  })();
  if (!r) {
    console.error(`${E} | Foundry audio helper is unavailable`), (u = (c = ui.notifications) == null ? void 0 : c.error) == null || u.call(
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
s(Ko, "executePlaySoundAction");
qo({
  id: Zt,
  label: /* @__PURE__ */ s(() => f("EIDOLON.TimeTrigger.ActionPlaySound", "Play Sound"), "label"),
  execute: Ko,
  buildSummaryParts: /* @__PURE__ */ s(({ trigger: e, escapeHtml: t, localize: n }) => {
    var r;
    return (r = e == null ? void 0 : e.data) != null && r.path ? [`${t(n("EIDOLON.TimeTrigger.TriggerSound", "Sound File"))}: ${t(e.data.path)}`] : [];
  }, "buildSummaryParts"),
  buildFormContent: /* @__PURE__ */ s(({ trigger: e, escapeHtml: t, localize: n }) => {
    var l;
    const i = t(n("EIDOLON.TimeTrigger.TriggerSound", "Sound File")), r = t(
      n("EIDOLON.TimeTrigger.TriggerChooseFile", "Select File")
    ), o = t(
      n(
        "EIDOLON.TimeTrigger.TriggerSoundNotes",
        "Select or upload the audio file that should play when this trigger fires."
      )
    ), a = t(((l = e == null ? void 0 : e.data) == null ? void 0 : l.path) ?? "");
    return `
      <label>${i}</label>
      <div class="form-fields">
        <input type="text" name="playSoundPath" value="${a}" data-dtype="String">
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
  prepareFormData: /* @__PURE__ */ s(({ trigger: e, formData: t }) => {
    var n, i;
    e.data.path = ((i = (n = t.playSoundPath) == null ? void 0 : n.trim) == null ? void 0 : i.call(n)) ?? "";
  }, "prepareFormData")
});
var Lr;
const { ApplicationV2: qn, HandlebarsApplicationMixin: Bn } = ((Lr = foundry.applications) == null ? void 0 : Lr.api) ?? {};
if (!qn || !Bn)
  throw new Error(
    `${E} | ApplicationV2 API unavailable. Update Foundry VTT to v13 or newer.`
  );
const Ke = "AM", ut = "PM";
function Je() {
  return Pr();
}
s(Je, "getConfiguredTimeFormat");
function Gn(e) {
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
s(Gn, "parseCanonicalTimeString");
function Ie({ hours: e, minutes: t, seconds: n }) {
  if (!Number.isInteger(e) || !Number.isInteger(t) || e < 0 || e > 23 || t < 0 || t > 59) return null;
  const i = String(e).padStart(2, "0"), r = String(t).padStart(2, "0");
  if (Number.isInteger(n)) {
    if (n < 0 || n > 59) return null;
    const o = String(n).padStart(2, "0");
    return `${i}:${r}:${o}`;
  }
  return `${i}:${r}`;
}
s(Ie, "formatCanonicalTime");
function Yo(e, { format: t } = {}) {
  if (!e || typeof e != "object") return null;
  const n = Number(e.hour), i = Number(e.minute), r = e.second !== void 0 && e.second !== null, o = r ? Number(e.second) : null, a = r && Number.isFinite(o) ? Math.floor(Math.max(0, Math.min(59, o))) : null;
  if (!Number.isFinite(n) || !Number.isFinite(i)) return null;
  const l = t ?? Je();
  return fn(
    {
      hours: n,
      minutes: i,
      seconds: a
    },
    l
  );
}
s(Yo, "formatTimeComponentsForDisplay");
function Qo(e, { format: t } = {}) {
  const n = Gn(e);
  if (!n) return "";
  const i = t ?? Je();
  return fn(n, i);
}
s(Qo, "formatTriggerTimeForDisplay");
function fn(e, t = "12h") {
  if (!e) return "";
  const { hours: n, minutes: i, seconds: r = null } = e;
  if (!Number.isInteger(n) || !Number.isInteger(i)) return "";
  const o = Number.isInteger(r);
  if (t === "24h") {
    const h = `${String(n).padStart(2, "0")}:${String(i).padStart(2, "0")}`;
    return o ? `${h}:${String(r).padStart(2, "0")}` : h;
  }
  const a = n >= 12 ? ut : Ke, l = n % 12 === 0 ? 12 : n % 12, c = String(l), u = String(i).padStart(2, "0"), d = `${c}:${u}`, y = a === Ke ? f("EIDOLON.TimeTrigger.TimePeriodAM", Ke) : f("EIDOLON.TimeTrigger.TimePeriodPM", ut);
  if (o) {
    const h = String(r).padStart(2, "0");
    return `${d}:${h} ${y}`;
  }
  return `${d} ${y}`;
}
s(fn, "formatTimeParts");
function dr(e, t = Je()) {
  const n = Gn(e);
  if (t === "24h")
    return {
      format: t,
      canonical: n ? Ie(n) ?? "" : "",
      hour: n ? String(n.hours).padStart(2, "0") : "",
      minute: n ? String(n.minutes).padStart(2, "0") : ""
    };
  if (!n)
    return {
      format: t,
      canonical: "",
      hour: "",
      minute: "",
      period: Ke
    };
  const i = n.hours >= 12 ? ut : Ke, r = n.hours % 12 === 0 ? 12 : n.hours % 12;
  return {
    format: t,
    canonical: Ie(n) ?? "",
    hour: String(r),
    minute: String(n.minutes).padStart(2, "0"),
    period: i
  };
}
s(dr, "getTimeFormValues");
function Xo({ hour: e, minute: t, period: n, time: i }, r = Je()) {
  if (r === "24h") {
    const T = typeof e == "string" ? e.trim() : "", m = typeof t == "string" ? t.trim() : "", v = typeof i == "string" ? i.trim() : "";
    if (!T && !m && v) {
      const A = Gn(v);
      return A ? { canonical: Ie(A) ?? "", error: null } : {
        canonical: "",
        error: f(
          "EIDOLON.TimeTrigger.TimeFormatInvalid24",
          "Enter a valid time in HH:MM format."
        )
      };
    }
    if (!T || !m)
      return {
        canonical: "",
        error: f("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.")
      };
    const w = Number(T), O = Number(m);
    return !Number.isInteger(w) || w < 0 || w > 23 ? {
      canonical: "",
      error: f(
        "EIDOLON.TimeTrigger.TimeFormatInvalid24",
        "Enter a valid time in HH:MM format."
      )
    } : !Number.isInteger(O) || O < 0 || O > 59 ? {
      canonical: "",
      error: f(
        "EIDOLON.TimeTrigger.TimeFormatInvalid24",
        "Enter a valid time in HH:MM format."
      )
    } : { canonical: Ie({
      hours: w,
      minutes: O
    }) ?? "", error: null };
  }
  const o = typeof e == "string" ? e.trim() : "", a = typeof t == "string" ? t.trim() : "", l = typeof n == "string" ? n.trim().toUpperCase() : "";
  if (!o || !a || !l)
    return { canonical: "", error: f("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.") };
  if (l !== Ke && l !== ut)
    return { canonical: "", error: f("EIDOLON.TimeTrigger.TimeFormatInvalidPeriod", "Select AM or PM.") };
  const c = Number(o), u = Number(a);
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
  const d = c % 12, h = {
    hours: l === ut ? d + 12 : d,
    minutes: u
  };
  return {
    canonical: Ie(h) ?? "",
    error: null
  };
}
s(Xo, "normalizeFormTimeInput");
function Zo() {
  return [
    {
      value: Ke,
      label: f("EIDOLON.TimeTrigger.TimePeriodAM", Ke)
    },
    {
      value: ut,
      label: f("EIDOLON.TimeTrigger.TimePeriodPM", ut)
    }
  ];
}
s(Zo, "getPeriodOptions");
var Ze, et, U, Vr, bn, On, kr, yi, pi, vn, En, xr, jr, Ur, Ti, bi, Oi, wn, Sn, vi, In, qr, Br;
const Xe = class Xe extends Bn(qn) {
  constructor(n = {}) {
    var a;
    const { scene: i, showControls: r, ...o } = n ?? {};
    super(o);
    C(this, U);
    C(this, Ze, null);
    C(this, et, null);
    C(this, bn, /* @__PURE__ */ s((n) => {
      var r, o;
      n.preventDefault();
      const i = Number((o = (r = n.currentTarget) == null ? void 0 : r.dataset) == null ? void 0 : o.delta);
      Number.isFinite(i) && (b("Time delta button clicked", { delta: i }), this._advanceTime(i));
    }, "#onDeltaClick"));
    C(this, On, /* @__PURE__ */ s((n) => {
      var i, r;
      n.preventDefault(), !(!this.showControls || !((i = game.user) != null && i.isGM)) && (b("Time value double clicked", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null }), S(this, U, kr).call(this));
    }, "#onTimeDoubleClick"));
    C(this, vn, /* @__PURE__ */ s((n) => {
      if (this.isEditingTime && !this._commitTimeInProgress)
        if (n.key === "Enter") {
          n.preventDefault();
          const i = n.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
          S(this, U, pi).call(this, r);
        } else n.key === "Escape" && (n.preventDefault(), S(this, U, yi).call(this));
    }, "#onTimeInputKeydown"));
    C(this, En, /* @__PURE__ */ s((n) => {
      if (!this.isEditingTime || this._commitTimeInProgress || this._suppressBlurCommit) return;
      const i = n.currentTarget, r = typeof (i == null ? void 0 : i.value) == "string" ? i.value : "";
      S(this, U, pi).call(this, r);
    }, "#onTimeInputBlur"));
    C(this, wn, /* @__PURE__ */ s((n) => {
      const i = !!n;
      if (this.manageTimeEnabled === i) return;
      this.manageTimeEnabled = i, (this.rendered ?? this.isRendered ?? !1) && this.render({ force: !0 });
    }, "#handleManageTimeChange"));
    C(this, Sn, /* @__PURE__ */ s(async (n) => {
      var o, a, l, c, u, d, y, h, T;
      if (n.preventDefault(), !this.showControls || !((o = game.user) != null && o.isGM)) return;
      if (!this.manageTimeEnabled) {
        (l = (a = ui.notifications) == null ? void 0 : a.error) == null || l.call(
          a,
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
        await i.setFlag(E, ii, r), this.sceneAllowsRealTime = r;
        const m = r ? f(
          "EIDOLON.TimeTrigger.SceneRealTimeEnabled",
          "Automatic real-time flow enabled for this scene."
        ) : f(
          "EIDOLON.TimeTrigger.SceneRealTimeDisabled",
          "Automatic real-time flow disabled for this scene."
        );
        (y = (d = ui.notifications) == null ? void 0 : d.info) == null || y.call(d, m);
      } catch (m) {
        console.error(`${E} | Failed to toggle scene real-time flow`, m), (T = (h = ui.notifications) == null ? void 0 : h.error) == null || T.call(
          h,
          f(
            "EIDOLON.TimeTrigger.SceneRealTimeToggleError",
            "Failed to update the scene's real-time flow setting."
          )
        );
      } finally {
        this.render({ force: !0 });
      }
    }, "#onRealTimeToggleClick"));
    C(this, In, /* @__PURE__ */ s(() => {
      (this.rendered ?? this.isRendered ?? !1) && (this.isEditingTime && (this.editValue = S(this, U, Ti).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    this.scene = i ?? null, this.showControls = typeof r == "boolean" ? r : !!((a = game.user) != null && a.isGM), this.isEditingTime = !1, this.editValue = "", this._commitTimeInProgress = !1, this._suppressBlurCommit = !1, this.manageTimeEnabled = !1, this.sceneAllowsRealTime = S(this, U, vi).call(this), N(this, Ze, Bi(g(this, In))), N(this, et, Fr(g(this, wn)));
  }
  async _prepareContext() {
    var O, L;
    const n = ((O = game.time) == null ? void 0 : O.components) ?? {}, r = ((n == null ? void 0 : n.second) !== void 0 && (n == null ? void 0 : n.second) !== null ? Yo(n) : null) ?? S(this, U, Vr).call(this), o = Je(), a = o === "24h", l = a ? f("EIDOLON.TimeTrigger.EditTimePlaceholder24", "HH:MM") : f("EIDOLON.TimeTrigger.EditTimePlaceholder12", "HH:MM AM/PM"), c = this.showControls ? f(
      "EIDOLON.TimeTrigger.EditTimeHint",
      "Double-click to set a specific time."
    ) : "", u = this.showControls ? f(
      "EIDOLON.TimeTrigger.EditTimeLabel",
      "New time (HH:MM or HH:MM AM/PM)"
    ) : "", d = Po.map((A) => ({
      minutes: A,
      label: A > 0 ? `+${A}` : `${A}`
    })), y = !!this.manageTimeEnabled, h = S(this, U, vi).call(this);
    this.sceneAllowsRealTime = h;
    const T = f(
      "EIDOLON.TimeTrigger.SceneRealTimeEnable",
      "Enable automatic real-time flow for this scene."
    ), m = f(
      "EIDOLON.TimeTrigger.SceneRealTimeDisable",
      "Disable automatic real-time flow for this scene."
    ), v = f(
      "EIDOLON.TimeTrigger.SceneRealTimeManageDisabled",
      "Enable Manage Time in module settings to allow automatic real-time flow."
    );
    return {
      formattedTime: r,
      deltas: d,
      manageTimeEnabled: y,
      sceneAllowsRealTime: h,
      realTimeButtonLabel: y ? h ? m : T : v,
      isGM: ((L = game.user) == null ? void 0 : L.isGM) ?? !1,
      showControls: !!this.showControls,
      editHint: c,
      editLabel: u,
      editPlaceholder: l,
      timeFormat: o,
      is24Hour: a,
      isEditingTime: !!this.isEditingTime,
      editValue: this.isEditingTime ? this.editValue ?? "" : ""
    };
  }
  async close(n = {}) {
    var r, o;
    if (!n.force)
      return (this.rendered ?? this.isRendered ?? !1) || (b("TimeTriggerWindow close request rerendering", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null
      }), this.render({ force: !0 })), this;
    b("Closing time trigger window", { sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null, force: !0 });
    const i = await super.close(n);
    return S(this, U, qr).call(this), S(this, U, Br).call(this), i;
  }
  async _advanceTime(n) {
    var r, o, a, l, c, u, d;
    const i = n * 60;
    if (b("Advancing world time", { sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null, minutes: n, seconds: i }), !((o = game.user) != null && o.isGM)) {
      (l = (a = ui.notifications) == null ? void 0 : a.warn) == null || l.call(a, f("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time."));
      return;
    }
    try {
      await game.time.advance(i);
    } catch (y) {
      console.error(`${E} | Failed to advance time`, y), (u = (c = ui.notifications) == null ? void 0 : c.error) == null || u.call(
        c,
        f("EIDOLON.TimeTrigger.Error", "Failed to update the world time.")
      ), b("Failed to advance time from window", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        minutes: n,
        message: (y == null ? void 0 : y.message) ?? String(y)
      });
    }
  }
  _onRender(n, i) {
    var o;
    super._onRender(n, i);
    const r = this.element;
    if (r) {
      if (this.showControls) {
        b("Binding time trigger interactions", {
          sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
          buttonCount: r.querySelectorAll("[data-delta]").length
        }), r.querySelectorAll("[data-delta]").forEach((u) => {
          u.addEventListener("click", g(this, bn));
        });
        const a = r.querySelector('.time-trigger-window__time-value[data-editable="true"]');
        a && a.addEventListener("dblclick", g(this, On), { once: !1 });
        const l = r.querySelector(".time-trigger-window__time-input");
        l && (l.addEventListener("keydown", g(this, vn)), l.addEventListener("blur", g(this, En)), typeof l.focus == "function" && (l.focus(), typeof l.select == "function" && l.select()));
        const c = r.querySelector('[data-action="toggle-real-time"]');
        c && c.addEventListener("click", g(this, Sn));
      }
      this._suppressBlurCommit = !1;
    }
  }
};
Ze = new WeakMap(), et = new WeakMap(), U = new WeakSet(), Vr = /* @__PURE__ */ s(function() {
  var c;
  const n = (c = game.time) == null ? void 0 : c.worldTime;
  if (typeof n != "number" || !Number.isFinite(n)) return "";
  const i = 1440 * 60, r = (Math.floor(n) % i + i) % i, o = Math.floor(r / 3600), a = Math.floor(r % 3600 / 60), l = r % 60;
  return fn({ hours: o, minutes: a, seconds: l }, Je());
}, "#formatFallbackTime"), bn = new WeakMap(), On = new WeakMap(), kr = /* @__PURE__ */ s(function() {
  var n;
  (n = game.user) != null && n.isGM && (this.isEditingTime = !0, this._suppressBlurCommit = !1, this.editValue = S(this, U, Ti).call(this), this.render({ force: !0 }));
}, "#enterTimeEditMode"), yi = /* @__PURE__ */ s(function() {
  this.isEditingTime = !1, this.editValue = "", this._suppressBlurCommit = !1, this.render({ force: !0 });
}, "#cancelTimeEdit"), pi = /* @__PURE__ */ s(async function(n) {
  var o, a, l;
  if (!((o = game.user) != null && o.isGM) || !this.isEditingTime || this._commitTimeInProgress) return;
  this._commitTimeInProgress = !0;
  const i = typeof n == "string" ? n.trim() : "";
  if (!i) {
    S(this, U, yi).call(this), this._commitTimeInProgress = !1;
    return;
  }
  const r = S(this, U, Ur).call(this, i);
  if (r.error) {
    (l = (a = ui.notifications) == null ? void 0 : a.error) == null || l.call(a, r.error), this._suppressBlurCommit = !0, this.editValue = i, this.render({ force: !0 }), this._commitTimeInProgress = !1;
    return;
  }
  try {
    await S(this, U, jr).call(this, r.seconds, r.includeSeconds) ? (this.isEditingTime = !1, this.editValue = "", this.render({ force: !0 })) : (this.editValue = i, this.render({ force: !0 }));
  } finally {
    this._commitTimeInProgress = !1;
  }
}, "#commitTimeInput"), vn = new WeakMap(), En = new WeakMap(), xr = /* @__PURE__ */ s(function() {
  var u, d;
  const n = (u = game.time) == null ? void 0 : u.worldTime;
  if (typeof n != "number" || !Number.isFinite(n))
    return "";
  const i = ((d = game.time) == null ? void 0 : d.components) ?? {}, r = Number(i.hour), o = Number(i.minute), a = i.second !== void 0 ? Number(i.second) : null, l = Number.isInteger(a);
  return (Number.isFinite(r) && Number.isFinite(o) ? Ie({
    hours: Math.max(0, Math.min(23, Number(r))),
    minutes: Math.max(0, Math.min(59, Number(o))),
    seconds: l && Number.isFinite(a) ? Math.max(0, Math.min(59, Number(a))) : void 0
  }) ?? "" : "") ?? "";
}, "#getCurrentCanonicalTime"), jr = /* @__PURE__ */ s(async function(n, i) {
  var h, T, m, v, w, O, L, A, P, R;
  const r = (h = game.time) == null ? void 0 : h.worldTime;
  if (typeof r != "number" || !Number.isFinite(r))
    return (m = (T = ui.notifications) == null ? void 0 : T.error) == null || m.call(
      T,
      f(
        "EIDOLON.TimeTrigger.EditTimeUnavailable",
        "The world time is unavailable, so it can't be updated."
      )
    ), !1;
  if (!Number.isInteger(n) || n < 0 || n >= yt)
    return (w = (v = ui.notifications) == null ? void 0 : v.error) == null || w.call(
      v,
      f(
        "EIDOLON.TimeTrigger.EditTimeInvalidRange",
        "Enter a time within the current day."
      )
    ), !1;
  const l = Math.floor(r / yt) * yt + n - r;
  if (!Number.isFinite(l) || l === 0)
    return !0;
  const c = Math.floor(n / 3600), u = Math.floor(n % 3600 / 60), d = n % 60, y = Ie({
    hours: c,
    minutes: u,
    seconds: i ? d : void 0
  });
  try {
    b("Updating world time directly", {
      sceneId: ((O = this.scene) == null ? void 0 : O.id) ?? null,
      targetCanonical: y ?? null,
      diff: l
    }), await game.time.advance(l);
    const x = fn(
      {
        hours: c,
        minutes: u,
        seconds: i ? d : null
      },
      Je()
    );
    (A = (L = ui.notifications) == null ? void 0 : L.info) == null || A.call(
      L,
      f(
        "EIDOLON.TimeTrigger.EditTimeSuccess",
        "World time updated."
      ) + (x ? ` ${x}` : "")
    );
  } catch (x) {
    return console.error(`${E} | Failed to set world time`, x), (R = (P = ui.notifications) == null ? void 0 : P.error) == null || R.call(
      P,
      f(
        "EIDOLON.TimeTrigger.EditTimeError",
        "Failed to update the world time."
      )
    ), !1;
  }
  return !0;
}, "#applyTargetSeconds"), Ur = /* @__PURE__ */ s(function(n) {
  var y;
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
    const h = Number(o[1]), T = Number(o[2]), m = o[3] !== void 0 ? Number(o[3]) : void 0;
    if (Number.isInteger(h) && h >= 0 && h <= 23 && Number.isInteger(T) && T >= 0 && T <= 59 && (m === void 0 || Number.isInteger(m) && m >= 0 && m <= 59)) {
      const v = h * 3600 + T * 60 + (m ?? 0);
      return {
        canonical: Ie({ hours: h, minutes: T, seconds: m }),
        seconds: v,
        includeSeconds: m !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const { amLower: a, pmLower: l, periodPattern: c } = S(this, U, bi).call(this), u = r.match(
    new RegExp(
      `^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?\\s*(${c})$`,
      "i"
    )
  );
  if (u) {
    let h = Number(u[1]);
    const T = Number(u[2]), m = u[3] !== void 0 ? Number(u[3]) : void 0, v = u[4] ?? "", w = typeof v == "string" ? ((y = v.toLocaleLowerCase) == null ? void 0 : y.call(v)) ?? v.toLowerCase() : "";
    if (Number.isInteger(h) && h >= 1 && h <= 12 && Number.isInteger(T) && T >= 0 && T <= 59 && (m === void 0 || Number.isInteger(m) && m >= 0 && m <= 59) && (w === a || w === l || w === "am" || w === "pm")) {
      h = h % 12, (w === l || w === "pm") && (h += 12);
      const L = h * 3600 + T * 60 + (m ?? 0);
      return {
        canonical: Ie({ hours: h, minutes: T, seconds: m }),
        seconds: L,
        includeSeconds: m !== void 0,
        error: null
      };
    }
    return { error: i };
  }
  const d = Mr(r);
  if (d !== null) {
    const h = Math.floor(d / 3600), T = Math.floor(d % 3600 / 60), m = d % 60, v = m !== 0;
    return {
      canonical: Ie({
        hours: h,
        minutes: T,
        seconds: v ? m : void 0
      }),
      seconds: d,
      includeSeconds: v,
      error: null
    };
  }
  return { error: i };
}, "#parseInputTime"), Ti = /* @__PURE__ */ s(function() {
  const n = S(this, U, xr).call(this);
  if (!n) return "";
  if (Je() === "24h")
    return n;
  const r = Gn(n);
  if (!r) return n;
  const o = Number(r.hours), a = Number(r.minutes), l = r.seconds !== null && r.seconds !== void 0 ? Number(r.seconds) : void 0;
  if (!Number.isFinite(o) || !Number.isFinite(a)) return n;
  const c = Number.isFinite(l), u = o % 12 === 0 ? 12 : o % 12, d = String(a).padStart(2, "0"), y = c ? `:${String(l).padStart(2, "0")}` : "", { amLabel: h, pmLabel: T } = S(this, U, bi).call(this), m = o >= 12 ? T : h;
  return `${u}:${d}${y} ${m}`.trim();
}, "#getInitialEditValue"), bi = /* @__PURE__ */ s(function() {
  var u, d;
  const n = f("EIDOLON.TimeTrigger.TimePeriodAM", "AM"), i = f("EIDOLON.TimeTrigger.TimePeriodPM", "PM"), r = ((u = n.toLocaleLowerCase) == null ? void 0 : u.call(n)) ?? n.toLowerCase(), o = ((d = i.toLocaleLowerCase) == null ? void 0 : d.call(i)) ?? i.toLowerCase(), a = S(this, U, Oi).call(this, n), l = S(this, U, Oi).call(this, i), c = `${a}|${l}|AM|PM`;
  return {
    amLabel: n,
    pmLabel: i,
    amLower: r,
    pmLower: o,
    periodPattern: c
  };
}, "#getPeriodMatchData"), Oi = /* @__PURE__ */ s(function(n) {
  return typeof n != "string" ? "" : n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}, "#escapeForRegex"), wn = new WeakMap(), Sn = new WeakMap(), vi = /* @__PURE__ */ s(function() {
  const n = this.scene;
  if (!n || typeof n.getFlag != "function") return !1;
  try {
    return !!n.getFlag(E, ii);
  } catch (i) {
    b("TimeTriggerWindow | Failed to read scene real-time flag", {
      sceneId: (n == null ? void 0 : n.id) ?? null,
      message: (i == null ? void 0 : i.message) ?? String(i)
    });
  }
  return !1;
}, "#readSceneRealTimeFlag"), In = new WeakMap(), qr = /* @__PURE__ */ s(function() {
  if (typeof g(this, Ze) == "function")
    try {
      g(this, Ze).call(this);
    } catch (n) {
      console.error(`${E} | Failed to dispose time format subscription`, n);
    }
  N(this, Ze, null);
}, "#disposeTimeFormatSubscription"), Br = /* @__PURE__ */ s(function() {
  if (typeof g(this, et) == "function")
    try {
      g(this, et).call(this);
    } catch (n) {
      console.error(`${E} | Failed to dispose manage time subscription`, n);
    }
  N(this, et, null);
}, "#disposeManageTimeSubscription"), s(Xe, "TimeTriggerWindow"), Qe(Xe, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  ft(Xe, Xe, "DEFAULT_OPTIONS"),
  {
    id: `${E}-time-trigger`,
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
)), Qe(Xe, "PARTS", {
  content: {
    template: `modules/${E}/templates/time-trigger.html`
  }
});
let hi = Xe;
function zi(e, t = {}) {
  if (typeof e != "function")
    throw new TypeError("createApplicationFactory requires a constructor function.");
  const n = /* @__PURE__ */ s(function(r = {}) {
    const o = foundry.utils.mergeObject(
      t ?? {},
      r ?? {},
      { inplace: !1 }
    );
    return new e(o);
  }, "applicationFactory");
  return n.__eidolonFactorySignature = "options", n.__eidolonFactoryTarget = e, n;
}
s(zi, "createApplicationFactory");
const fr = /* @__PURE__ */ new Set();
var ee, de, tt, St, Gr, zr;
const er = class er {
  constructor({ windowFactory: t } = {}) {
    C(this, St);
    C(this, ee, null);
    C(this, de, null);
    C(this, tt);
    const n = zi(hi);
    typeof t == "function" ? t.__eidolonFactorySignature === "options" ? N(this, tt, (r, o = {}) => t({ scene: r, ...o ?? {} })) : N(this, tt, t) : N(this, tt, /* @__PURE__ */ s((r, o = {}) => n({ scene: r, ...o ?? {} }), "fallbackFactory"));
  }
  onReady() {
    var n;
    const t = typeof ((n = game.time) == null ? void 0 : n.worldTime) == "number" && Number.isFinite(game.time.worldTime) ? game.time.worldTime : null;
    b("TimeTriggerManager#onReady", { worldTime: t }), t !== null && N(this, de, t);
  }
  onCanvasReady(t) {
    const n = (t == null ? void 0 : t.scene) ?? Mt();
    b("TimeTriggerManager#onCanvasReady", { sceneId: (n == null ? void 0 : n.id) ?? null }), this.refreshTimeTriggerWindow(n), this.handleTimeTriggerEvaluation(n);
  }
  onUpdateScene(t) {
    const n = Mt();
    b("TimeTriggerManager#onUpdateScene", {
      sceneId: (t == null ? void 0 : t.id) ?? null,
      activeSceneId: (n == null ? void 0 : n.id) ?? null
    }), !(!n || t.id !== n.id) && (this.refreshTimeTriggerWindow(t), this.handleTimeTriggerEvaluation(t));
  }
  onUpdateWorldTime(t, n) {
    b("TimeTriggerManager#onUpdateWorldTime", {
      worldTime: t,
      diff: n,
      hasWindow: !!g(this, ee)
    }), g(this, ee) && g(this, ee).render();
    const i = Mt(), r = S(this, St, Gr).call(this, t, n);
    this.handleTimeTriggerEvaluation(i, t, r);
  }
  refreshTimeTriggerWindow(t) {
    var c, u, d;
    if (!t) return;
    const n = !!((c = game.user) != null && c.isGM), i = !!t.getFlag(E, an), r = !!t.getFlag(E, ti), o = !!t.getFlag(E, ni);
    if (b("TimeTriggerManager#refreshTimeTriggerWindow", {
      sceneId: t.id,
      isGM: n,
      isActive: i,
      hideWindow: r,
      showPlayerWindow: o
    }), !(i && !r && (n || o))) {
      g(this, ee) && (b("Closing time trigger window", { reason: "not-visible" }), g(this, ee).close({ force: !0 }), N(this, ee, null));
      return;
    }
    const l = !!n;
    if (g(this, ee) && ((u = g(this, ee).scene) == null ? void 0 : u.id) === t.id) {
      b("Refreshing existing time trigger window", { sceneId: t.id }), g(this, ee).showControls = l, g(this, ee).render();
      return;
    }
    g(this, ee) && (b("Closing existing window before creating new instance", {
      previousSceneId: ((d = g(this, ee).scene) == null ? void 0 : d.id) ?? null
    }), g(this, ee).close({ force: !0 })), N(this, ee, g(this, tt).call(this, t, { showControls: l })), b("Rendering new time trigger window", { sceneId: t.id }), g(this, ee).render({ force: !0 });
  }
  async handleTimeTriggerEvaluation(t, n, i) {
    var c;
    const r = t ?? Mt();
    if (!r) {
      b("handleTimeTriggerEvaluation skipped", {
        reason: "no-active-scene",
        providedSceneId: (t == null ? void 0 : t.id) ?? null,
        currentWorldTime: n
      }), typeof n == "number" && Number.isFinite(n) && N(this, de, n);
      return;
    }
    const o = typeof n == "number" && Number.isFinite(n) ? n : typeof ((c = game.time) == null ? void 0 : c.worldTime) == "number" ? game.time.worldTime : null;
    if (o === null) return;
    const a = typeof i == "number" && Number.isFinite(i) ? i : null, l = a !== null ? a : typeof g(this, de) == "number" && Number.isFinite(g(this, de)) ? g(this, de) : o;
    Et("handleTimeTriggerEvaluation", {
      sceneId: r.id,
      previousWorldTime: l,
      currentWorldTime: o,
      overrideProvided: a !== null
    });
    try {
      await S(this, St, zr).call(this, r, l, o);
    } catch (u) {
      console.error(`${E} | Unexpected error while evaluating time triggers`, u), b("handleTimeTriggerEvaluation error", { message: (u == null ? void 0 : u.message) ?? String(u) });
    } finally {
      N(this, de, o), We();
    }
  }
};
ee = new WeakMap(), de = new WeakMap(), tt = new WeakMap(), St = new WeakSet(), Gr = /* @__PURE__ */ s(function(t, n) {
  return typeof g(this, de) == "number" && Number.isFinite(g(this, de)) ? (b("Resolved previous world time from cache", {
    previousWorldTime: g(this, de)
  }), g(this, de)) : typeof t == "number" && Number.isFinite(t) && typeof n == "number" && Number.isFinite(n) ? (b("Resolved previous world time using diff", {
    worldTime: t,
    diff: n,
    resolved: t - n
  }), t - n) : typeof t == "number" && Number.isFinite(t) ? t : null;
}, "#resolvePreviousWorldTime"), zr = /* @__PURE__ */ s(async function(t, n, i) {
  var m, v, w;
  if (!((m = game.user) != null && m.isGM)) {
    b("Skipping trigger evaluation because user is not a GM");
    return;
  }
  if (!(t != null && t.id)) {
    b("Skipping trigger evaluation because the scene is missing an id");
    return;
  }
  if (!!!t.getFlag(E, an)) {
    b("Skipping trigger evaluation because scene is inactive", { sceneId: t.id });
    return;
  }
  if (typeof i != "number" || !Number.isFinite(i)) return;
  (typeof n != "number" || !Number.isFinite(n)) && (n = i);
  const o = pt(t);
  if (!o.length) {
    b("No time triggers configured for scene", { sceneId: t.id });
    return;
  }
  const a = Uo(t), l = /* @__PURE__ */ new Set();
  for (const O of o)
    O != null && O.id && l.add(O.id);
  let c = !1;
  for (const O of Object.keys(a))
    l.has(O) || (delete a[O], c = !0);
  if (Et("Evaluating scene time triggers", {
    sceneId: t.id,
    previousWorldTime: n,
    currentWorldTime: i,
    triggerCount: o.length
  }), i <= n) {
    b("Detected world time rewind", {
      previousWorldTime: n,
      currentWorldTime: i
    });
    for (const O of o) {
      if (!(O != null && O.id) || !O.allowReplayOnRewind) continue;
      const L = a[O.id];
      typeof L == "number" ? i < L ? (b("Clearing trigger history due to rewind", {
        triggerId: O.id,
        lastFired: L,
        currentWorldTime: i
      }), delete a[O.id], c = !0) : b("Preserving trigger history after rewind", {
        triggerId: O.id,
        lastFired: L,
        currentWorldTime: i
      }) : b("No history stored for rewind-enabled trigger", {
        triggerId: O.id
      });
    }
    c && (b("Persisting history cleanup after rewind", {
      sceneId: t.id
    }), await Zn(t, a)), We();
    return;
  }
  const u = n, d = i, y = [], h = Math.floor(u / yt), T = Math.floor(d / yt);
  for (const O of o) {
    if (!(O != null && O.id)) continue;
    const L = Mr(O.time);
    if (L === null) {
      es(t, O), b("Skipping trigger with invalid time", {
        triggerId: O.id,
        time: O.time
      });
      continue;
    }
    for (let A = h; A <= T; A++) {
      const P = A * yt + L;
      if (P < u || P > d) continue;
      const x = a[O.id];
      if (typeof x == "number" && x >= P) {
        b("Skipping trigger because it already fired within window", {
          triggerId: O.id,
          lastFired: x,
          absoluteTime: P
        });
        continue;
      }
      y.push({ trigger: O, absoluteTime: P });
    }
  }
  if (!y.length) {
    c && await Zn(t, a), b("No triggers scheduled to fire within evaluation window", {
      sceneId: t.id
    }), We();
    return;
  }
  y.sort((O, L) => O.absoluteTime - L.absoluteTime), b("Queued triggers for execution", {
    entries: y.map((O) => ({
      triggerId: O.trigger.id,
      absoluteTime: O.absoluteTime
    }))
  });
  for (const O of y)
    try {
      b("Executing time trigger action", {
        triggerId: O.trigger.id,
        absoluteTime: O.absoluteTime
      }), await $r(t, O.trigger);
    } catch (L) {
      console.error(`${E} | Failed to execute time trigger action`, L), (w = (v = ui.notifications) == null ? void 0 : v.error) == null || w.call(
        v,
        f(
          "EIDOLON.TimeTrigger.TriggerActionError",
          "Failed to execute a scene time trigger action. Check the console for details."
        )
      ), b("Trigger execution failed", {
        triggerId: O.trigger.id,
        message: (L == null ? void 0 : L.message) ?? String(L)
      });
    } finally {
      a[O.trigger.id] = O.absoluteTime, c = !0, b("Recorded trigger execution", {
        triggerId: O.trigger.id,
        absoluteTime: O.absoluteTime
      });
    }
  c && (b("Persisting trigger history updates", { sceneId: t.id }), await Zn(t, a)), We();
}, "#evaluateSceneTimeTriggers"), s(er, "TimeTriggerManager");
let Ei = er;
function es(e, t) {
  var r, o;
  const n = `${(e == null ? void 0 : e.id) ?? "unknown"}:${(t == null ? void 0 : t.id) ?? (t == null ? void 0 : t.time) ?? "unknown"}`;
  if (fr.has(n)) return;
  fr.add(n);
  const i = f(
    "EIDOLON.TimeTrigger.InvalidTimeWarning",
    "A scene time trigger has an invalid time value and was skipped."
  );
  (o = (r = ui.notifications) == null ? void 0 : r.warn) == null || o.call(r, i), console.warn(`${E} | Invalid time for trigger`, { scene: e == null ? void 0 : e.id, trigger: t });
}
s(es, "warnInvalidTriggerTime");
var ye, _t, pe, Ue, nt, Ee, vt, Ln, Cn, Rt, Ht, it, we, D, Si, mt, en, Ii, tn, Li, Oe, Wr, Ci, Jr, Ni, Kr, Nn, An, Mn, Dn, Pn, Fn, Ai, Yr, nn, _n, Rn;
const tr = class tr {
  constructor() {
    C(this, D);
    C(this, ye, !1);
    C(this, _t, Gt);
    C(this, pe, /* @__PURE__ */ new Map());
    C(this, Ue, null);
    C(this, nt, null);
    C(this, Ee, 0);
    C(this, vt, null);
    C(this, Ln, null);
    C(this, Cn, null);
    C(this, Rt, !1);
    C(this, Ht, !1);
    C(this, it, !1);
    C(this, we, !1);
    C(this, Nn, /* @__PURE__ */ s((t, n = {}) => {
      b("GameTimeAutomation | Pause state changed", {
        paused: t,
        userId: (n == null ? void 0 : n.userId) ?? null,
        broadcast: (n == null ? void 0 : n.broadcast) ?? null
      }), S(this, D, Oe).call(this, { pausedOverride: t });
    }, "#handlePause"));
    C(this, An, /* @__PURE__ */ s((t) => {
      t != null && t.id && (g(this, pe).set(t.id, Math.max(t.round ?? 0, 1)), b("GameTimeAutomation | Combat started", { combatId: t.id, round: t.round ?? 0 }), S(this, D, Oe).call(this));
    }, "#handleCombatStart"));
    C(this, Mn, /* @__PURE__ */ s((t, n) => {
      if (!(t != null && t.id)) return;
      const i = typeof n == "number" && Number.isFinite(n) ? n : typeof t.round == "number" && Number.isFinite(t.round) ? t.round : 0, r = i > 0 ? i : 1, o = g(this, pe).get(t.id), a = o ? Math.max(o, 1) : 1, l = r > 1 ? Math.max(r - a, 0) : 0;
      if (b("GameTimeAutomation | Combat round change detected", {
        combatId: t.id,
        effectiveRound: r,
        completedRounds: l,
        enabled: g(this, ye),
        paused: (game == null ? void 0 : game.paused) ?? null
      }), l > 0 && g(this, ye) && g(this, we) && !(game != null && game.paused) && S(this, D, mt).call(this) && S(this, D, en).call(this, t)) {
        const c = l * g(this, _t);
        c > 0 && (b("GameTimeAutomation | Advancing time for completed combat rounds", {
          combatId: t.id,
          completedRounds: l,
          delta: c
        }), S(this, D, Ni).call(this, c));
      }
      g(this, pe).set(t.id, Math.max(r, 1));
    }, "#handleCombatRound"));
    C(this, Dn, /* @__PURE__ */ s((t) => {
      t != null && t.id && (g(this, pe).delete(t.id), b("GameTimeAutomation | Combat ended", { combatId: t.id }), S(this, D, Oe).call(this));
    }, "#handleCombatEnd"));
    C(this, Pn, /* @__PURE__ */ s((t) => {
      t != null && t.id && (g(this, pe).delete(t.id), b("GameTimeAutomation | Combat deleted", { combatId: t.id }), S(this, D, Oe).call(this));
    }, "#handleCombatDelete"));
    C(this, Fn, /* @__PURE__ */ s((t, n) => {
      if (t != null && t.id) {
        if (typeof (n == null ? void 0 : n.round) == "number" && Number.isFinite(n.round)) {
          const i = Math.max(n.round, 1);
          g(this, pe).set(t.id, i), b("GameTimeAutomation | Combat round manually updated", {
            combatId: t.id,
            round: i
          });
        }
        (Object.prototype.hasOwnProperty.call(n ?? {}, "active") || (n == null ? void 0 : n.round) !== void 0) && S(this, D, Oe).call(this);
      }
    }, "#handleCombatUpdate"));
    C(this, _n, /* @__PURE__ */ s((t) => {
      S(this, D, nn).call(this, t == null ? void 0 : t.scene), S(this, D, Oe).call(this);
    }, "#handleCanvasReady"));
    C(this, Rn, /* @__PURE__ */ s((t) => {
      if (!ae(t)) return;
      const n = S(this, D, Ai).call(this);
      if (!n || n.id !== t.id) return;
      S(this, D, nn).call(this, t) && S(this, D, Oe).call(this);
    }, "#handleSceneUpdate"));
  }
  registerHooks() {
    g(this, Rt) || (N(this, Rt, !0), Hooks.on("pauseGame", g(this, Nn)), Hooks.on("combatStart", g(this, An)), Hooks.on("combatRound", g(this, Mn)), Hooks.on("combatEnd", g(this, Dn)), Hooks.on("deleteCombat", g(this, Pn)), Hooks.on("updateCombat", g(this, Fn)), Hooks.on("canvasReady", g(this, _n)), Hooks.on("updateScene", g(this, Rn)));
  }
  initialize() {
    g(this, Ht) || (N(this, Ht, !0), N(this, Ln, Fr((t) => {
      const n = !!t, i = n !== g(this, ye);
      N(this, ye, n), b("GameTimeAutomation | Manage time toggled", { enabled: n }), i && n && S(this, D, Li).call(this), S(this, D, Oe).call(this);
    })), N(this, Cn, ko((t) => {
      N(this, _t, t), b("GameTimeAutomation | Seconds per round updated", { value: t });
    })), S(this, D, Li).call(this), S(this, D, nn).call(this), S(this, D, Oe).call(this));
  }
};
ye = new WeakMap(), _t = new WeakMap(), pe = new WeakMap(), Ue = new WeakMap(), nt = new WeakMap(), Ee = new WeakMap(), vt = new WeakMap(), Ln = new WeakMap(), Cn = new WeakMap(), Rt = new WeakMap(), Ht = new WeakMap(), it = new WeakMap(), we = new WeakMap(), D = new WeakSet(), Si = /* @__PURE__ */ s(function() {
  var t;
  try {
    if (typeof ((t = globalThis.performance) == null ? void 0 : t.now) == "function")
      return globalThis.performance.now();
  } catch (n) {
    b("GameTimeAutomation | Failed to read high-resolution timestamp", {
      message: (n == null ? void 0 : n.message) ?? String(n)
    });
  }
  return Date.now();
}, "#currentTimestamp"), mt = /* @__PURE__ */ s(function() {
  var t;
  return !!((t = game == null ? void 0 : game.user) != null && t.isGM && game.user.active !== !1);
}, "#canControlTime"), en = /* @__PURE__ */ s(function(t) {
  var i, r;
  if (!t) return !1;
  if (t.active === !0) return !0;
  if (t.active === !1) return !1;
  const n = (i = game == null ? void 0 : game.combats) == null ? void 0 : i.active;
  return (n == null ? void 0 : n.id) === t.id ? !0 : ((r = game == null ? void 0 : game.combat) == null ? void 0 : r.id) === t.id ? game.combat.active ?? !0 : !1;
}, "#isCombatDocumentActive"), Ii = /* @__PURE__ */ s(function(t) {
  return t ? typeof t.started == "boolean" ? t.started : (t.round ?? 0) > 0 : !1;
}, "#hasCombatStarted"), tn = /* @__PURE__ */ s(function() {
  var i;
  const t = Array.isArray((i = game == null ? void 0 : game.combats) == null ? void 0 : i.contents) ? game.combats.contents : [];
  for (const r of t)
    if (S(this, D, en).call(this, r) && S(this, D, Ii).call(this, r))
      return !0;
  const n = game == null ? void 0 : game.combat;
  return !!(n && S(this, D, en).call(this, n) && S(this, D, Ii).call(this, n));
}, "#isCombatRunning"), Li = /* @__PURE__ */ s(function() {
  var n;
  g(this, pe).clear();
  const t = Array.isArray((n = game == null ? void 0 : game.combats) == null ? void 0 : n.contents) ? game.combats.contents : [];
  for (const i of t)
    i != null && i.id && g(this, pe).set(i.id, Math.max(i.round ?? 0, 1));
}, "#hydrateRoundTracking"), Oe = /* @__PURE__ */ s(function({ pausedOverride: t } = {}) {
  const n = typeof t == "boolean" ? t : !!(game != null && game.paused), i = g(this, ye), r = g(this, we), o = i && r, a = {
    manageTimeEnabled: i,
    sceneAllowsRealTime: r,
    effectiveEnabled: o,
    paused: n,
    canControl: S(this, D, mt).call(this),
    combatRunning: S(this, D, tn).call(this),
    overrideApplied: typeof t == "boolean"
  };
  if (b("GameTimeAutomation | Sync running state", a), !o || !S(this, D, mt).call(this)) {
    S(this, D, Ci).call(this);
    return;
  }
  S(this, D, Wr).call(this);
}, "#syncRunningState"), Wr = /* @__PURE__ */ s(function() {
  g(this, Ue) === null && (N(this, nt, S(this, D, Si).call(this)), N(this, Ue, globalThis.setInterval(() => S(this, D, Jr).call(this), 1e3)), b("GameTimeAutomation | Started real-time ticker"));
}, "#startRealTimeTicker"), Ci = /* @__PURE__ */ s(function() {
  g(this, Ue) !== null && (globalThis.clearInterval(g(this, Ue)), N(this, Ue, null), b("GameTimeAutomation | Stopped real-time ticker")), N(this, nt, null), N(this, Ee, 0), N(this, it, !1);
}, "#stopRealTimeTicker"), Jr = /* @__PURE__ */ s(function() {
  if (!g(this, ye) || !g(this, we) || !S(this, D, mt).call(this)) {
    S(this, D, Ci).call(this);
    return;
  }
  const t = S(this, D, Si).call(this);
  if (typeof t != "number" || !Number.isFinite(t)) return;
  const n = g(this, nt) ?? t, i = (t - n) / 1e3;
  if (N(this, nt, t), !Number.isFinite(i) || i <= 0) return;
  const r = !!(game != null && game.paused), o = S(this, D, tn).call(this);
  if (r || o) {
    g(this, it) || b("GameTimeAutomation | Tick skipped", { paused: r, combatRunning: o }), N(this, it, !0), N(this, Ee, 0);
    return;
  }
  N(this, it, !1), b("GameTimeAutomation | Real-time tick", { deltaSeconds: i }), S(this, D, Ni).call(this, i);
}, "#tickRealTime"), Ni = /* @__PURE__ */ s(function(t) {
  if (!g(this, ye) || !g(this, we)) return;
  const n = Number(t);
  !Number.isFinite(n) || n <= 0 || (N(this, Ee, g(this, Ee) + n), !g(this, vt) && N(this, vt, S(this, D, Kr).call(this)));
}, "#queueAdvance"), Kr = /* @__PURE__ */ s(async function() {
  var t, n;
  for (; g(this, Ee) > 0; ) {
    if (!g(this, ye) || !g(this, we) || game != null && game.paused || !S(this, D, mt).call(this) || S(this, D, tn).call(this)) {
      N(this, Ee, 0);
      break;
    }
    const i = g(this, Ee);
    N(this, Ee, 0);
    try {
      if (typeof ((t = game == null ? void 0 : game.time) == null ? void 0 : t.advance) == "function")
        b("GameTimeAutomation | Advancing world time", { delta: i }), await game.time.advance(i), b("GameTimeAutomation | World time advanced", {
          worldTime: ((n = game.time) == null ? void 0 : n.worldTime) ?? null
        });
      else {
        console.warn(`${E} | game.time.advance is unavailable; cannot manage world time.`);
        break;
      }
    } catch (r) {
      console.error(`${E} | Failed to advance world time`, r);
      break;
    }
  }
  N(this, vt, null);
}, "#flushAdvanceQueue"), Nn = new WeakMap(), An = new WeakMap(), Mn = new WeakMap(), Dn = new WeakMap(), Pn = new WeakMap(), Fn = new WeakMap(), Ai = /* @__PURE__ */ s(function() {
  const t = Mt();
  return ae(t) ? t : null;
}, "#getActiveSceneDocument"), Yr = /* @__PURE__ */ s(function(t) {
  if (!ae(t)) return !1;
  try {
    return !!t.getFlag(E, ii);
  } catch (n) {
    return b("GameTimeAutomation | Failed to read scene real-time flag", {
      sceneId: (t == null ? void 0 : t.id) ?? null,
      message: (n == null ? void 0 : n.message) ?? String(n)
    }), !1;
  }
}, "#isSceneRealTimeAllowed"), nn = /* @__PURE__ */ s(function(t) {
  const n = ae(t) ? t : S(this, D, Ai).call(this), i = S(this, D, Yr).call(this, n), r = g(this, we);
  return N(this, we, i), r !== i ? (b("GameTimeAutomation | Scene real-time allowance changed", {
    sceneId: (n == null ? void 0 : n.id) ?? null,
    allows: i
  }), !0) : !1;
}, "#refreshSceneAutomationState"), _n = new WeakMap(), Rn = new WeakMap(), s(tr, "GameTimeAutomation");
let wi = tr;
var Cr, qe, se, rt, De, Hn, Z, Qr, Xr, Zr, eo, $n, Di, Vn, to, kn, no, io;
const Ae = class Ae extends Bn(qn) {
  constructor(n = {}) {
    const { scene: i, trigger: r, triggerIndex: o, onSave: a, ...l } = n ?? {};
    super(l);
    C(this, Z);
    C(this, qe, null);
    C(this, se, null);
    C(this, rt, null);
    C(this, De, null);
    C(this, Hn, /* @__PURE__ */ s(() => {
      (this.rendered ?? this.isRendered ?? !1) && (N(this, De, S(this, Z, Qr).call(this)), this.render({ force: !0 }));
    }, "#handleTimeFormatChange"));
    C(this, $n, /* @__PURE__ */ s((n) => {
      var o, a;
      const i = n.currentTarget, r = i == null ? void 0 : i.closest("form");
      r && (b("Trigger action selection changed", {
        sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
        triggerId: ((a = this.trigger) == null ? void 0 : a.id) ?? null,
        actionId: (i == null ? void 0 : i.value) ?? null
      }), S(this, Z, Di).call(this, i.value, r));
    }, "#onActionSelectChange"));
    C(this, Vn, /* @__PURE__ */ s((n) => {
      var u, d, y, h;
      n.preventDefault();
      const i = n.currentTarget, r = i == null ? void 0 : i.closest("form");
      if (!r) return;
      const o = (u = i.dataset) == null ? void 0 : u.target;
      if (!o) return;
      const a = typeof (CSS == null ? void 0 : CSS.escape) == "function" ? CSS.escape : (T) => T, l = r.querySelector(`[name="${a(o)}"]`);
      if (!l) return;
      b("Opening file picker for trigger", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        triggerId: ((y = this.trigger) == null ? void 0 : y.id) ?? null,
        target: o
      }), new FilePicker({
        type: ((h = i.dataset) == null ? void 0 : h.type) || "audio",
        current: l.value,
        callback: /* @__PURE__ */ s((T) => {
          var m, v;
          l.value = T, l.dispatchEvent(new Event("change")), b("Trigger form file selected", {
            sceneId: ((m = this.scene) == null ? void 0 : m.id) ?? null,
            triggerId: ((v = this.trigger) == null ? void 0 : v.id) ?? null,
            target: o,
            path: T
          });
        }, "callback")
      }).render({ force: !0 });
    }, "#onFilePicker"));
    C(this, kn, /* @__PURE__ */ s(async (n) => {
      var r, o;
      n.preventDefault();
      const i = n.currentTarget;
      i instanceof HTMLFormElement && (b("Trigger form submitted", {
        sceneId: ((r = this.scene) == null ? void 0 : r.id) ?? null,
        triggerId: ((o = this.trigger) == null ? void 0 : o.id) ?? null
      }), await S(this, Z, no).call(this, i));
    }, "#onSubmit"));
    this.scene = i ?? null, this.trigger = r ?? null, this.triggerIndex = Number.isInteger(o) ? Number(o) : null, this.onSave = typeof a == "function" ? a : null, N(this, rt, Bi(g(this, Hn)));
  }
  async _prepareContext() {
    var n, i;
    Et("TriggerFormApplication#_prepareContext", {
      sceneId: ((n = this.scene) == null ? void 0 : n.id) ?? null,
      triggerId: ((i = this.trigger) == null ? void 0 : i.id) ?? null,
      triggerIndex: this.triggerIndex
    });
    try {
      const r = this.trigger ?? { action: Zt, data: {} }, o = r.action ?? Zt, a = dr(r.time), l = a.format ?? "12h", c = l === "12h" ? Zo() : [], u = a.period ?? (c.length > 0 ? c[0].value : null), d = l === "12h" ? c.map((T) => ({
        ...T,
        selected: T.value === u
      })) : [], y = ur().map((T) => ({
        id: T.id,
        label: typeof T.label == "function" ? T.label() : T.label,
        selected: T.id === o
      })), h = ur().map((T) => {
        const m = T.id === r.action ? r : { ...r, action: T.id }, v = zo(m);
        return v ? {
          id: T.id,
          visible: T.id === o,
          content: v
        } : null;
      }).filter(Boolean);
      return {
        timeValue: a.canonical ?? "",
        timeHourValue: a.hour ?? "",
        timeMinuteValue: a.minute ?? "",
        timePeriodValue: u ?? "",
        timeFormat: l,
        is12HourFormat: l === "12h",
        is24HourFormat: l === "24h",
        timePeriodOptions: d,
        actions: y,
        actionSections: h,
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
      We();
    }
  }
  _onRender(n, i) {
    var c, u, d;
    super._onRender(n, i);
    const r = this.element;
    if (!r) return;
    b("Trigger form rendered", {
      sceneId: ((c = this.scene) == null ? void 0 : c.id) ?? null,
      triggerId: ((u = this.trigger) == null ? void 0 : u.id) ?? null
    });
    const o = Array.from(((d = document == null ? void 0 : document.body) == null ? void 0 : d.classList) ?? []).find(
      (y) => y.startsWith("theme-")
    );
    o && r.classList.add(o);
    const a = r.querySelector("form");
    if (!a) return;
    S(this, Z, to).call(this, a), S(this, Z, Xr).call(this, a), a.addEventListener("submit", g(this, kn));
    const l = a.querySelector("[data-action-select]");
    l && (l.addEventListener("change", g(this, $n)), S(this, Z, Di).call(this, l.value, a)), a.querySelectorAll("[data-action-file-picker]").forEach((y) => {
      y.addEventListener("click", g(this, Vn));
    });
  }
  async close(n = {}) {
    var i;
    if ((i = g(this, qe)) == null || i.call(this), N(this, qe, null), N(this, se, null), N(this, De, null), typeof g(this, rt) == "function")
      try {
        g(this, rt).call(this);
      } catch (r) {
        console.error(`${E} | Failed to dispose trigger form time format subscription`, r);
      }
    return N(this, rt, null), super.close(n);
  }
};
qe = new WeakMap(), se = new WeakMap(), rt = new WeakMap(), De = new WeakMap(), Hn = new WeakMap(), Z = new WeakSet(), Qr = /* @__PURE__ */ s(function() {
  var l, c, u, d, y, h, T;
  const n = (c = (l = this.element) == null ? void 0 : l.querySelector) == null ? void 0 : c.call(l, "form");
  if (!(n instanceof HTMLFormElement)) return null;
  const i = Array.from(n.elements ?? []), r = [];
  for (const m of i)
    if ((m instanceof HTMLInputElement || m instanceof HTMLSelectElement || m instanceof HTMLTextAreaElement) && m.name && !(((u = m.dataset) == null ? void 0 : u.timeHidden) !== void 0 || ((d = m.dataset) == null ? void 0 : d.timeHour) !== void 0 || ((y = m.dataset) == null ? void 0 : y.timeMinute) !== void 0 || ((h = m.dataset) == null ? void 0 : h.timePeriod) !== void 0)) {
      if (m instanceof HTMLInputElement) {
        if (m.type === "checkbox" || m.type === "radio") {
          r.push({
            kind: m.type,
            name: m.name,
            value: m.value,
            checked: m.checked
          });
          continue;
        }
        r.push({
          kind: "value",
          name: m.name,
          value: m.value
        });
        continue;
      }
      if (m instanceof HTMLSelectElement) {
        m.multiple ? r.push({
          kind: "select-multiple",
          name: m.name,
          values: Array.from(m.selectedOptions ?? []).map((v) => v.value)
        }) : r.push({
          kind: "value",
          name: m.name,
          value: m.value
        });
        continue;
      }
      r.push({
        kind: "value",
        name: m.name,
        value: m.value
      });
    }
  const o = n.querySelector("[data-time-format]");
  let a = null;
  if (o instanceof HTMLElement) {
    const m = o.querySelector("[data-time-hidden]"), v = o.querySelector("[data-time-hour]"), w = o.querySelector("[data-time-minute]"), O = o.querySelector("[data-time-period]");
    a = {
      format: ((T = o.dataset) == null ? void 0 : T.timeFormat) ?? null,
      canonical: m instanceof HTMLInputElement ? m.value : "",
      hour: v instanceof HTMLInputElement ? v.value : "",
      minute: w instanceof HTMLInputElement ? w.value : "",
      period: O instanceof HTMLSelectElement ? O.value : ""
    };
  }
  return {
    fields: r,
    time: a
  };
}, "#captureFormState"), Xr = /* @__PURE__ */ s(function(n) {
  if (!g(this, De)) return;
  if (!(n instanceof HTMLFormElement)) {
    N(this, De, null);
    return;
  }
  const { fields: i = [], time: r = null } = g(this, De) ?? {};
  N(this, De, null), S(this, Z, Zr).call(this, n, i), S(this, Z, eo).call(this, n, r);
}, "#restorePendingFormState"), Zr = /* @__PURE__ */ s(function(n, i) {
  if (!Array.isArray(i) || i.length === 0) return;
  const r = typeof (CSS == null ? void 0 : CSS.escape) == "function" ? CSS.escape : (o) => o;
  for (const o of i) {
    if (!o || typeof o.name != "string") continue;
    const a = r(o.name);
    if (o.kind === "checkbox" || o.kind === "radio") {
      const c = `input[type="${o.kind}"][name="${a}"]`, u = n.querySelectorAll(c);
      u.forEach((d) => {
        d instanceof HTMLInputElement && (u.length === 1 || d.value === o.value) && (d.checked = !!o.checked);
      });
      continue;
    }
    if (o.kind === "select-multiple") {
      const c = n.querySelector(`select[name="${a}"]`);
      if (!(c instanceof HTMLSelectElement)) continue;
      const u = new Set(Array.isArray(o.values) ? o.values : []);
      Array.from(c.options ?? []).forEach((d) => {
        d.selected = u.has(d.value);
      });
      continue;
    }
    const l = n.querySelector(`[name="${a}"]`);
    (l instanceof HTMLInputElement || l instanceof HTMLSelectElement || l instanceof HTMLTextAreaElement) && (l.value = o.value ?? "");
  }
}, "#restoreFieldValues"), eo = /* @__PURE__ */ s(function(n, i) {
  var L, A, P;
  const r = n.querySelector("[data-time-format]");
  if (!(r instanceof HTMLElement)) {
    typeof g(this, se) == "function" && g(this, se).call(this);
    return;
  }
  const o = ((L = r.dataset) == null ? void 0 : L.timeFormat) === "24h" ? "24h" : "12h", a = r.querySelector("[data-time-hour]"), l = r.querySelector("[data-time-minute]"), c = r.querySelector("[data-time-period]"), u = r.querySelector("[data-time-hidden]");
  if (!i) {
    if (a instanceof HTMLInputElement && (a.value = ""), l instanceof HTMLInputElement && (l.value = ""), c instanceof HTMLSelectElement) {
      const R = ((P = (A = c.options) == null ? void 0 : A[0]) == null ? void 0 : P.value) ?? "";
      c.value = R;
    }
    u instanceof HTMLInputElement && (u.value = ""), typeof g(this, se) == "function" && g(this, se).call(this);
    return;
  }
  const d = typeof i.canonical == "string" ? i.canonical : "", y = typeof i.period == "string" ? i.period : "", h = typeof i.hour == "string" ? i.hour : "", T = typeof i.minute == "string" ? i.minute : "";
  let m = "", v = "", w = y, O = d;
  if (d) {
    const R = dr(d, o);
    m = R.hour ?? "", v = R.minute ?? "", O = R.canonical ?? d, o === "12h" ? w = R.period ?? y : w = "";
  } else
    m = h, v = T, o !== "12h" && (w = "");
  if (a instanceof HTMLInputElement && (a.value = m ?? ""), l instanceof HTMLInputElement && (l.value = v ?? ""), c instanceof HTMLSelectElement)
    if (o === "12h") {
      const R = Array.from(c.options ?? []);
      R.find((F) => F.value === w) ? c.value = w : R.length > 0 ? c.value = R[0].value : c.value = "";
    } else
      c.value = "";
  u instanceof HTMLInputElement && (u.value = O ?? ""), typeof g(this, se) == "function" && g(this, se).call(this);
}, "#restoreTimeInputs"), $n = new WeakMap(), Di = /* @__PURE__ */ s(function(n, i) {
  i && i.querySelectorAll("[data-action-config]").forEach((r) => {
    const o = r.dataset.actionConfig === n;
    r.style.display = o ? "" : "none";
  });
}, "#updateActionSections"), Vn = new WeakMap(), to = /* @__PURE__ */ s(function(n) {
  var y, h, T, m;
  if ((y = g(this, qe)) == null || y.call(this), N(this, qe, null), N(this, se, null), !(n instanceof HTMLFormElement)) return;
  const i = n.querySelector("[data-time-format]"), r = ((h = i == null ? void 0 : i.dataset) == null ? void 0 : h.timeFormat) ?? null;
  if (r !== "12h" && r !== "24h")
    return;
  const o = i.querySelector("[data-time-hidden]"), a = i.querySelector("[data-time-hour]"), l = i.querySelector("[data-time-minute]"), c = r === "12h" ? i.querySelector("[data-time-period]") : null;
  if (!o || !a || !l || r === "12h" && !c) {
    b("Trigger form time inputs missing elements", {
      format: r,
      hasHidden: !!o,
      hasHour: !!a,
      hasMinute: !!l,
      hasPeriod: !!c
    });
    return;
  }
  const u = [a, l, ...c ? [c] : []], d = /* @__PURE__ */ s(() => {
    const { canonical: v, error: w } = Xo(
      {
        hour: a.value,
        minute: l.value,
        period: (c == null ? void 0 : c.value) ?? null,
        time: o.value
      },
      r
    );
    o.value = v ?? "";
    const O = w ?? "";
    o.setCustomValidity(O), u.forEach((L) => {
      L.setCustomValidity(O);
    });
  }, "update");
  u.forEach((v) => {
    v.addEventListener("input", d), v.addEventListener("change", d);
  }), d(), N(this, qe, () => {
    u.forEach((v) => {
      v.removeEventListener("input", d), v.removeEventListener("change", d);
    });
  }), N(this, se, d), b("Trigger form configured for time input", {
    format: r,
    sceneId: ((T = this.scene) == null ? void 0 : T.id) ?? null,
    triggerId: ((m = this.trigger) == null ? void 0 : m.id) ?? null
  });
}, "#setupTimeInput"), kn = new WeakMap(), no = /* @__PURE__ */ s(async function(n) {
  var o, a, l, c, u;
  if (typeof g(this, se) == "function" && g(this, se).call(this), typeof n.checkValidity == "function" && !n.checkValidity()) {
    typeof n.reportValidity == "function" && n.reportValidity(), b("Trigger form submission blocked by validity check", {
      sceneId: ((o = this.scene) == null ? void 0 : o.id) ?? null,
      triggerId: ((a = this.trigger) == null ? void 0 : a.id) ?? null
    });
    return;
  }
  const i = new FormData(n), r = Object.fromEntries(i.entries());
  delete r.timeHour, delete r.timeMinute, delete r.timePeriod, r.allowReplayOnRewind = ((l = n.querySelector('input[name="allowReplayOnRewind"]')) == null ? void 0 : l.checked) ?? !1, b("Processing trigger form submission", {
    sceneId: ((c = this.scene) == null ? void 0 : c.id) ?? null,
    triggerId: ((u = this.trigger) == null ? void 0 : u.id) ?? null,
    allowReplayOnRewind: r.allowReplayOnRewind
  }), await S(this, Z, io).call(this, r), await this.close();
}, "#handleSubmit"), io = /* @__PURE__ */ s(async function(n) {
  var o, a, l, c, u, d;
  const i = {
    id: ((o = this.trigger) == null ? void 0 : o.id) ?? Fo(),
    time: n.time ?? "",
    action: n.action ?? Zt,
    allowReplayOnRewind: !!n.allowReplayOnRewind,
    data: {}
  };
  b("Persisting trigger from form", {
    sceneId: ((a = this.scene) == null ? void 0 : a.id) ?? null,
    triggerId: i.id,
    existingIndex: this.triggerIndex
  }), Wo(i, n);
  const r = pt(this.scene);
  this.triggerIndex !== null && r[this.triggerIndex] ? r[this.triggerIndex] = i : r.push(i);
  try {
    await Hr(this.scene, r), b("Trigger list saved", {
      sceneId: ((l = this.scene) == null ? void 0 : l.id) ?? null,
      triggerCount: r.length
    });
  } catch (y) {
    throw console.error(`${E} | Failed to save time trigger`, y), (u = (c = ui.notifications) == null ? void 0 : c.error) == null || u.call(
      c,
      f(
        "EIDOLON.TimeTrigger.TriggerSaveError",
        "Failed to save the scene's time triggers."
      )
    ), y;
  }
  if (this.onSave)
    try {
      this.onSave(r);
    } catch (y) {
      console.error(`${E} | Trigger onSave callback failed`, y), b("Trigger onSave callback failed", {
        sceneId: ((d = this.scene) == null ? void 0 : d.id) ?? null,
        message: (y == null ? void 0 : y.message) ?? String(y)
      });
    }
}, "#persistTrigger"), s(Ae, "TriggerFormApplication"), Qe(Ae, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  ft(Ae, Ae, "DEFAULT_OPTIONS"),
  {
    id: `${E}-trigger-form`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Cr = ft(Ae, Ae, "DEFAULT_OPTIONS")) == null ? void 0 : Cr.classes) ?? [], "standard-form", "themed"])
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
)), Qe(Ae, "PARTS", {
  content: {
    template: `modules/${E}/templates/time-trigger-form.html`
  }
});
let Mi = Ae;
function Pi(e) {
  return e instanceof HTMLElement ? e : (e == null ? void 0 : e[0]) instanceof HTMLElement ? e[0] : null;
}
s(Pi, "asHTMLElement");
function rn(e) {
  return typeof (e == null ? void 0 : e.changeTab) == "function";
}
s(rn, "isAppV2");
function ts(e, t, n, i = {}) {
  if (rn(e)) {
    e.changeTab(t, n, i);
    return;
  }
  if (typeof (e == null ? void 0 : e.activateTab) == "function") {
    const r = { ...i };
    n != null && (r.group = n), r.triggerCallback == null && (r.triggerCallback = !0), e.activateTab(t, r);
  }
}
s(ts, "setActiveTab");
function ns(e) {
  var n, i;
  if (!(e instanceof HTMLFormElement)) return {};
  const t = ((i = (n = foundry == null ? void 0 : foundry.applications) == null ? void 0 : n.ux) == null ? void 0 : i.FormDataExtended) ?? globalThis.FormDataExtended ?? null;
  if (!t) return {};
  try {
    const r = new t(e), o = typeof r.object == "object" ? r.object : {};
    return foundry.utils.expandObject(o);
  } catch {
    return {};
  }
}
s(ns, "readFormData");
const gr = Symbol.for("eidolon.sceneConfig.v13PatchedTabs");
function ro(e = {}) {
  const {
    tabId: t,
    tabLabel: n,
    getScene: i,
    isApplicable: r,
    renderContent: o,
    debugNamespace: a = "SceneConfigTab",
    onButtonCreate: l,
    onTabCreate: c,
    onAfterRender: u,
    logger: d = {},
    moduleId: y = "eidolon-utilities",
    tabIcon: h = "fa-solid fa-puzzle-piece"
  } = e ?? {};
  if (!t)
    throw new Error("createSceneConfigTabFactory requires a tabId.");
  if (typeof o != "function")
    throw new TypeError("createSceneConfigTabFactory requires a renderContent callback.");
  const T = typeof d.log == "function" ? d.log.bind(d) : (...I) => {
    var j;
    return (j = console.debug) == null ? void 0 : j.call(console, `${a}`, ...I);
  }, m = typeof d.group == "function" ? d.group.bind(d) : (...I) => {
    var j;
    return (j = console.groupCollapsed) == null ? void 0 : j.call(console, `${a}`, ...I);
  }, v = typeof d.groupEnd == "function" ? d.groupEnd.bind(d) : () => {
    var I;
    return (I = console.groupEnd) == null ? void 0 : I.call(console);
  }, w = Symbol(`EIDOLON_SCENE_CONFIG_TAB_CLEANUP_${t}`), O = typeof i == "function" ? i : () => null, L = typeof r == "function" ? r : () => !0, A = typeof n == "function" ? n : () => typeof n == "string" ? n : t;
  function P() {
    var V, p, W, _, ne;
    const I = ((p = (V = foundry == null ? void 0 : foundry.applications) == null ? void 0 : V.sheets) == null ? void 0 : p.SceneConfig) ?? ((W = CONFIG == null ? void 0 : CONFIG.Scene) == null ? void 0 : W.sheetClass);
    if (!I || !rn({ changeTab: (_ = I.prototype) == null ? void 0 : _.changeTab })) return;
    const j = I[gr] ?? /* @__PURE__ */ new Set();
    if (j.has(t)) return;
    j.add(t), I[gr] = j;
    const $ = (ne = I.TABS) == null ? void 0 : ne.sheet;
    $ && Array.isArray($.tabs) && ($.tabs.some((z) => z.id === t) || $.tabs.push({
      id: t,
      icon: h
    })), I.PARTS && !I.PARTS[t] && (I.PARTS[t] = {
      template: `modules/${y}/templates/scene-config-tab-mount.hbs`,
      scrollable: [`.tab[data-tab="${t}"]`]
    }), T("Patched v13 SceneConfig TABS/PARTS", { tabId: t });
  }
  s(P, "patchV13SceneConfig");
  function R(I, j) {
    var V, p;
    const $ = O(I);
    if (!L(I, $)) {
      T("Skipped render", {
        tabId: t,
        reason: "inapplicable",
        constructor: ((V = I == null ? void 0 : I.constructor) == null ? void 0 : V.name) ?? null
      });
      return;
    }
    m("render", {
      tabId: t,
      sceneId: ($ == null ? void 0 : $.id) ?? null,
      constructor: ((p = I == null ? void 0 : I.constructor) == null ? void 0 : p.name) ?? null
    });
    try {
      const W = Pi(j) ?? Pi(I.element);
      if (!W) {
        T("Missing root element", { tabId: t });
        return;
      }
      rn(I) ? B(I, W, $) : F(I, W, $);
    } finally {
      v();
    }
  }
  s(R, "handleRender");
  function x(I, j, $) {
    var W;
    if (!h) {
      I.textContent = j;
      return;
    }
    const V = (W = I.querySelector("i")) == null ? void 0 : W.cloneNode(!0);
    I.textContent = "";
    const p = V ?? document.createElement("i");
    if (V || (p.className = h, $ && (p.inert = !0)), I.append(p, " "), $) {
      const _ = document.createElement("span");
      _.textContent = j, I.append(_);
    } else
      I.append(document.createTextNode(j));
  }
  s(x, "setButtonContent");
  function F(I, j, $) {
    var K, G, Y, Q, X, le, re, ce, Re, me, He, $e, Ve, be, ke, Ce;
    const p = [
      "nav.sheet-tabs[data-group]",
      "nav.tabs[data-group]",
      "nav.sheet-tabs",
      "nav.tabs"
    ].map((te) => j.querySelector(te)).find((te) => te instanceof HTMLElement), _ = [
      (K = j.querySelector(".tab[data-tab]")) == null ? void 0 : K.parentElement,
      j.querySelector(".sheet-body"),
      (Y = (G = p == null ? void 0 : p.parentElement) == null ? void 0 : G.querySelector) == null ? void 0 : Y.call(G, ":scope > .sheet-body"),
      p == null ? void 0 : p.parentElement
    ].find((te) => te instanceof HTMLElement), ne = ((Q = p == null ? void 0 : p.dataset) == null ? void 0 : Q.group) ?? ((re = (le = (X = p == null ? void 0 : p.querySelector) == null ? void 0 : X.call(p, "a[data-group]")) == null ? void 0 : le.dataset) == null ? void 0 : re.group) ?? ((me = (Re = (ce = p == null ? void 0 : p.querySelector) == null ? void 0 : ce.call(p, "[data-group]")) == null ? void 0 : Re.dataset) == null ? void 0 : me.group) ?? ((Ve = ($e = (He = _ == null ? void 0 : _.querySelector) == null ? void 0 : He.call(_, ".tab[data-group]")) == null ? void 0 : $e.dataset) == null ? void 0 : Ve.group) ?? "main";
    if (!p || !_) {
      T("Missing navigation elements", {
        tabId: t,
        hasNav: !!p,
        hasBody: !!_
      });
      return;
    }
    let z = p.querySelector(`[data-tab="${t}"]`);
    if (!z) {
      z = document.createElement("a"), z.dataset.action = "tab", z.dataset.group = ne, z.dataset.tab = t;
      const te = p.querySelector("a[data-tab]");
      (be = te == null ? void 0 : te.classList) != null && be.contains("item") && z.classList.add("item"), p.appendChild(z), typeof l == "function" && l({ app: I, button: z, nav: p, scene: $ }), T("Created tab button", { tabId: t, group: ne });
    }
    x(z, A({ app: I, scene: $ }) ?? t, rn(I));
    let J = _.querySelector(`.tab[data-tab="${t}"]`);
    if (!J) {
      J = document.createElement("div"), J.classList.add("tab"), J.dataset.tab = t, J.dataset.group = ne;
      const te = is(_);
      _.insertBefore(J, te ?? null), typeof c == "function" && c({ app: I, tab: J, body: _, scene: $ }), T("Created tab container", { tabId: t, group: ne });
    }
    ((ke = z.classList) == null ? void 0 : ke.contains("active")) || J.classList.contains("active") ? (z.classList.add("active"), J.classList.add("active"), J.removeAttribute("hidden")) : (z.classList.remove("active"), J.classList.remove("active"), J.setAttribute("hidden", "true"));
    const _e = /* @__PURE__ */ s(() => {
      var Ct, Ye;
      ((Ct = z.classList) != null && Ct.contains("active") || J.classList.contains("active")) && ((Ye = z.classList) == null || Ye.add("active"), J.classList.add("active"), J.removeAttribute("hidden"), J.removeAttribute("aria-hidden"), J.style.display === "none" && (J.style.display = ""));
    }, "ensureTabVisible"), M = /* @__PURE__ */ s(() => {
      _e(), requestAnimationFrame(_e);
    }, "scheduleEnsureTabVisible");
    z.dataset.eidolonEnsureSceneTabVisibility || (z.addEventListener("click", () => {
      ts(I, t, ne), requestAnimationFrame(_e);
    }), z.dataset.eidolonEnsureSceneTabVisibility = "true"), ei(I, w, T);
    const k = o({
      app: I,
      scene: $,
      tab: J,
      tabButton: z,
      ensureTabVisible: _e,
      scheduleEnsureTabVisible: M
    });
    typeof k == "function" && mr(I, w, k), typeof u == "function" && u({
      app: I,
      scene: $,
      tab: J,
      tabButton: z,
      ensureTabVisible: _e,
      scheduleEnsureTabVisible: M
    }), (Ce = I.setPosition) == null || Ce.call(I, { height: "auto" });
  }
  s(F, "handleRenderV1");
  function B(I, j, $) {
    const V = j.querySelector(`.tab[data-tab="${t}"]`), p = j.querySelector(`nav [data-tab="${t}"]`);
    if (!V || !p) {
      T("v2 mount not found, falling back to v1 injection", { tabId: t }), F(I, j, $);
      return;
    }
    x(p, A({ app: I, scene: $ }) ?? t, !0);
    const W = /* @__PURE__ */ s(() => {
      var z;
      !((z = p.classList) != null && z.contains("active")) && !V.classList.contains("active") || (V.classList.add("active"), V.removeAttribute("hidden"), V.removeAttribute("aria-hidden"), V.style.display === "none" && (V.style.display = ""));
    }, "ensureTabVisible"), _ = /* @__PURE__ */ s(() => {
      W(), requestAnimationFrame(W);
    }, "scheduleEnsureTabVisible");
    ei(I, w, T);
    const ne = o({
      app: I,
      scene: $,
      tab: V,
      tabButton: p,
      ensureTabVisible: W,
      scheduleEnsureTabVisible: _
    });
    typeof ne == "function" && mr(I, w, ne), typeof u == "function" && u({
      app: I,
      scene: $,
      tab: V,
      tabButton: p,
      ensureTabVisible: W,
      scheduleEnsureTabVisible: _
    });
  }
  s(B, "handleRenderV2");
  function H(I) {
    ei(I, w, T);
  }
  s(H, "handleClose");
  function q() {
    return Hooks.once("init", () => {
      P();
    }), Hooks.on("renderSceneConfig", R), Hooks.on("closeSceneConfig", H), () => ie();
  }
  s(q, "register");
  function ie() {
    Hooks.off("renderSceneConfig", R), Hooks.off("closeSceneConfig", H);
  }
  return s(ie, "unregister"), { register: q, unregister: ie };
}
s(ro, "createSceneConfigTabFactory");
function mr(e, t, n) {
  if (!e || typeof n != "function") return;
  const i = e == null ? void 0 : e[t];
  Array.isArray(i) || (e[t] = []), e[t].push(n);
}
s(mr, "registerCleanup");
function ei(e, t, n) {
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
s(ei, "invokeCleanup");
function is(e) {
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
s(is, "findFooterElement");
const rs = zi(Mi), os = `modules/${E}/templates/time-trigger-scene-tab.html`, ss = ro({
  tabId: "time-triggers",
  tabLabel: /* @__PURE__ */ s(() => f("EIDOLON.TimeTrigger.Tab", "Time Triggers"), "tabLabel"),
  getScene: Le,
  isApplicable: us,
  renderContent: /* @__PURE__ */ s(({ app: e, scene: t, tab: n }) => ls(e, n, t), "renderContent"),
  logger: {
    log: b,
    group: Et,
    groupEnd: We
  }
});
function as() {
  return b("Registering SceneConfig render hook"), ss.register();
}
s(as, "registerSceneConfigHook");
function ls(e, t, n) {
  if (!(t instanceof HTMLElement)) return;
  const i = ae(n) ? n : Le(e);
  gn(e, t, i);
  const r = Bi(() => {
    gn(e, t, i);
  });
  return () => {
    if (typeof r == "function")
      try {
        r();
      } catch (o) {
        console.error(
          `${E} | Failed to dispose scene config time format subscription`,
          o
        );
      }
  };
}
s(ls, "renderTimeTriggerTab");
async function gn(e, t, n) {
  var r, o;
  const i = n ?? Le(e);
  Et("renderTimeTriggersTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!ae(i)) {
      const V = f(
        "EIDOLON.TimeTrigger.Unavailable",
        "Time triggers are unavailable for this configuration sheet."
      );
      t.innerHTML = `<p class="notes">${V}</p>`, b("Scene lacks document for time triggers", { sceneId: (i == null ? void 0 : i.id) ?? null });
      return;
    }
    const a = `flags.${E}.${an}`, l = `flags.${E}.${ti}`, c = `flags.${E}.${ni}`, u = !!i.getFlag(E, an), d = !!i.getFlag(E, ti), y = !!i.getFlag(E, ni), h = pt(i);
    b("Rendering time trigger list", {
      sceneId: i.id,
      isActive: u,
      shouldHideWindow: d,
      shouldShowPlayerWindow: y,
      triggerCount: h.length
    });
    const T = f("EIDOLON.TimeTrigger.Activate", "Activate Time Trigger"), m = f(
      "EIDOLON.TimeTrigger.Description",
      "Enable scene time triggers so scheduled actions can run automatically."
    ), v = f(
      "EIDOLON.TimeTrigger.HideWindowLabel",
      "Hide Floating Time Window"
    ), w = f(
      "EIDOLON.TimeTrigger.HideWindowDescription",
      "Keep the floating time control window hidden while leaving time triggers active."
    ), O = f(
      "EIDOLON.TimeTrigger.ShowPlayerWindowLabel",
      "Share Floating Time Window with Players"
    ), L = f(
      "EIDOLON.TimeTrigger.ShowPlayerWindowDescription",
      "Let non-GM players see the floating time window (without time controls)."
    ), A = f(
      "EIDOLON.TimeTrigger.TriggerListLabel",
      "Scene Time Triggers"
    ), P = f(
      "EIDOLON.TimeTrigger.TriggerListEmpty",
      "No time triggers configured for this scene."
    ), R = f("EIDOLON.TimeTrigger.AddTrigger", "Add Trigger"), x = f("EIDOLON.TimeTrigger.EditTrigger", "Edit"), F = f("EIDOLON.TimeTrigger.DeleteTrigger", "Remove"), B = f("EIDOLON.TimeTrigger.TriggerNow", "Trigger Now"), H = f("EIDOLON.TimeTrigger.AtLabel", "At"), q = f("EIDOLON.TimeTrigger.DoLabel", "Do"), ie = f("EIDOLON.TimeTrigger.MissingTime", "(No time set)"), I = h.map((V, p) => {
      const ne = (V.time ? Qo(V.time) : "") || V.time || "" || ie, z = Bo(V.action), J = [
        `${H} ${ne}`,
        `${q} ${z}`,
        ...Go(V)
      ];
      return {
        index: p,
        summaryParts: J,
        tooltips: {
          triggerNow: B,
          edit: x,
          delete: F
        }
      };
    }), j = ((o = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : o.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof j != "function") {
      console.error(`${E} | renderTemplate is unavailable; cannot render scene tab.`), t.innerHTML = `<p class="notes">${P}</p>`;
      return;
    }
    let $ = "";
    try {
      $ = await j(os, {
        flags: {
          active: a,
          hideWindow: l,
          showPlayerWindow: c
        },
        states: {
          isActive: u,
          hideWindow: d,
          showPlayerWindow: y
        },
        labels: {
          activate: T,
          hideWindow: v,
          showPlayerWindow: O,
          triggerList: A,
          empty: P,
          add: R
        },
        hints: {
          activate: m,
          hideWindow: w,
          showPlayerWindow: L
        },
        triggers: I,
        hasTriggers: I.length > 0
      });
    } catch (V) {
      console.error(`${E} | Failed to render time trigger scene tab template`, V), t.innerHTML = `<p class="notes">${P}</p>`;
      return;
    }
    t.innerHTML = $, cs(e, t, i);
  } finally {
    We();
  }
}
s(gn, "renderTimeTriggersTabContent");
function cs(e, t, n) {
  const i = n ?? Le(e);
  if (!ae(i)) return;
  const r = t.querySelector('[data-action="add-trigger"]');
  r && r.addEventListener("click", () => {
    b("Add trigger button clicked", { sceneId: i.id }), hr(e, { scene: i });
  }), t.querySelectorAll('[data-action="edit-trigger"]').forEach((o) => {
    o.addEventListener("click", () => {
      const a = Number(o.dataset.index);
      if (!Number.isInteger(a)) return;
      const c = pt(i)[a];
      c && (b("Edit trigger button clicked", { sceneId: i.id, triggerId: c.id, index: a }), hr(e, { trigger: c, triggerIndex: a, scene: i }));
    });
  }), t.querySelectorAll('[data-action="delete-trigger"]').forEach((o) => {
    o.addEventListener("click", async () => {
      var u, d;
      const a = Number(o.dataset.index);
      if (!Number.isInteger(a)) return;
      const l = pt(i), c = l[a];
      if (c) {
        l.splice(a, 1);
        try {
          b("Deleting trigger", {
            sceneId: i.id,
            index: a,
            triggerId: (c == null ? void 0 : c.id) ?? null
          }), await Hr(i, l), await gn(e, t, i);
        } catch (y) {
          console.error(`${E} | Failed to delete time trigger`, y), (d = (u = ui.notifications) == null ? void 0 : u.error) == null || d.call(
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
      var u, d, y, h, T, m, v;
      const a = Number(o.dataset.index);
      if (!Number.isInteger(a)) return;
      const c = pt(i)[a];
      if (c) {
        if (!((u = game.user) != null && u.isGM)) {
          (y = (d = ui.notifications) == null ? void 0 : d.warn) == null || y.call(
            d,
            f("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time.")
          );
          return;
        }
        try {
          b("Manually firing trigger", { sceneId: i.id, triggerId: c.id, index: a }), await $r(i, c), (T = (h = ui.notifications) == null ? void 0 : h.info) == null || T.call(
            h,
            f(
              "EIDOLON.TimeTrigger.TriggerNowSuccess",
              "Triggered the selected time trigger."
            )
          );
        } catch (w) {
          console.error(`${E} | Failed to execute time trigger manually`, w), (v = (m = ui.notifications) == null ? void 0 : m.error) == null || v.call(
            m,
            f(
              "EIDOLON.TimeTrigger.TriggerNowError",
              "Failed to execute the selected time trigger."
            )
          ), b("Manual trigger execution failed", {
            sceneId: i.id,
            triggerId: c.id,
            index: a,
            message: (w == null ? void 0 : w.message) ?? String(w)
          });
        }
      }
    });
  });
}
s(cs, "bindTimeTriggerTabEvents");
function hr(e, t = {}) {
  var a;
  const n = t.scene ?? null, i = n && ae(n) ? n : Le(e);
  if (!ae(i)) {
    console.warn(`${E} | Unable to open trigger form because no scene document is available.`);
    return;
  }
  b("Opening trigger form", {
    sceneId: i.id,
    triggerId: ((a = t.trigger) == null ? void 0 : a.id) ?? null,
    index: Number.isInteger(t.triggerIndex) ? Number(t.triggerIndex) : null
  }), rs({
    scene: i,
    trigger: t.trigger ?? null,
    triggerIndex: t.triggerIndex ?? null,
    onSave: /* @__PURE__ */ s(() => {
      var c, u;
      const l = (u = (c = e.element) == null ? void 0 : c[0]) == null ? void 0 : u.querySelector('.tab[data-tab="time-triggers"]');
      l && gn(e, l, i);
    }, "onSave")
  }).render({ force: !0 });
}
s(hr, "openTriggerForm");
function us(e, t) {
  var o, a, l, c, u;
  if (!e) return !1;
  const n = ((a = (o = foundry == null ? void 0 : foundry.applications) == null ? void 0 : o.sheets) == null ? void 0 : a.SceneConfig) ?? (globalThis == null ? void 0 : globalThis.SceneConfig);
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
s(us, "isRecognizedSceneConfig");
const Jt = new Ei(), yr = new wi();
function ds() {
  b("Registering time trigger hooks"), Hooks.once("init", () => {
    _o(), xo(), b("Time trigger settings registered during init");
  }), as(), b("Scene config hook registered"), yr.registerHooks(), b("Time automation hooks registered"), Hooks.once("ready", () => {
    jo(), b("Ready hook fired"), Jt.onReady(), yr.initialize();
  }), Hooks.on("canvasReady", (e) => {
    var t;
    b("canvasReady hook received", { scene: ((t = e == null ? void 0 : e.scene) == null ? void 0 : t.id) ?? null }), Jt.onCanvasReady(e);
  }), Hooks.on("updateScene", (e) => {
    b("updateScene hook received", { scene: (e == null ? void 0 : e.id) ?? null }), Jt.onUpdateScene(e);
  }), Hooks.on("updateWorldTime", (e, t) => {
    b("updateWorldTime hook received", { worldTime: e, diff: t }), Jt.onUpdateWorldTime(e, t);
  });
}
s(ds, "registerTimeTriggerHooks");
ds();
const ge = E, oo = "objectVariants";
function Wt(e) {
  var i;
  const t = (i = e == null ? void 0 : e.getFlag) == null ? void 0 : i.call(e, ge, oo);
  if (!t) return [];
  const n = lt(t);
  return Array.isArray(n) ? n.map((r) => mn(r)).filter((r) => r !== null) : [];
}
s(Wt, "getObjectVariantCategories");
async function so(e, t) {
  if (!(e != null && e.setFlag)) return;
  const n = Array.isArray(t) ? t.map((i) => mn(i)).filter((i) => i !== null) : [];
  await e.setFlag(ge, oo, n);
}
s(so, "setObjectVariantCategories");
function ao(e = "") {
  return {
    id: lo(),
    name: typeof e == "string" ? e : "",
    values: []
  };
}
s(ao, "createObjectVariantCategory");
function mn(e) {
  if (!e || typeof e != "object") return null;
  const t = typeof e.id == "string" && e.id.trim() ? e.id.trim() : lo(), n = typeof e.name == "string" ? e.name : "", i = Array.isArray(e.values) ? e.values : [], r = [];
  for (const o of i) {
    if (typeof o != "string") continue;
    const a = o.trim();
    a && (r.includes(a) || r.push(a));
  }
  return { id: t, name: n, values: r };
}
s(mn, "sanitizeCategory");
function lo() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 11);
}
s(lo, "generateVariantId");
function co(e) {
  var t, n;
  console.error(`${ge} | Failed to persist object variants`, e), (n = (t = ui.notifications) == null ? void 0 : t.error) == null || n.call(
    t,
    f(
      "EIDOLON.ObjectVariants.PersistError",
      "Failed to persist the scene's object variants."
    )
  );
}
s(co, "notifyPersistError");
var Nr, fe, ot, It, uo, xn, jn, $t, fo;
const Me = class Me extends Bn(qn) {
  constructor(n = {}) {
    const { scene: i, category: r, isNew: o, onSave: a, ...l } = n ?? {};
    super(l);
    C(this, It);
    C(this, fe, null);
    C(this, ot, !1);
    C(this, xn, /* @__PURE__ */ s(async (n) => {
      n.preventDefault(), n.stopPropagation();
      const i = n.currentTarget;
      if (!(i instanceof HTMLFormElement)) return;
      const o = (new FormData(i).get("categoryName") ?? "").toString(), a = Array.from(i.querySelectorAll('[name="categoryValues"]')), l = [];
      for (const c of a) {
        if (!(c instanceof HTMLInputElement)) continue;
        const u = c.value.trim();
        u && (l.includes(u) || l.push(u));
      }
      N(this, fe, {
        ...g(this, fe),
        name: o,
        values: l
      }), await S(this, It, fo).call(this), this.close();
    }, "#onSubmit"));
    C(this, jn, /* @__PURE__ */ s((n) => {
      var h, T;
      n.preventDefault();
      const i = n.currentTarget, r = (i == null ? void 0 : i.form) ?? ((T = (h = this.element) == null ? void 0 : h.querySelector) == null ? void 0 : T.call(h, "form"));
      if (!r) return;
      const o = r.querySelector(".object-variant-editor__values");
      if (!o) return;
      const a = o.querySelector(".object-variant-editor__empty");
      a && a.remove();
      const l = document.createElement("div");
      l.classList.add("object-variant-editor__value");
      const c = ln(
        f("EIDOLON.ObjectVariants.ValuePlaceholder", "Variant label")
      ), u = ln(
        f("EIDOLON.ObjectVariants.RemoveValue", "Remove Value")
      );
      l.innerHTML = `
      <input type="text" name="categoryValues" value="" placeholder="${c}" class="form-control">
      <button type="button" class="icon" data-action="remove-value" aria-label="${u}" title="${u}">
        <i class="fa-solid fa-trash"></i>
      </button>
    `, o.appendChild(l);
      const d = l.querySelector('[data-action="remove-value"]');
      d && d.addEventListener("click", g(this, $t));
      const y = l.querySelector('input[name="categoryValues"]');
      y && y.focus();
    }, "#onAddValue"));
    C(this, $t, /* @__PURE__ */ s((n) => {
      var c, u;
      n.preventDefault();
      const i = n.currentTarget, r = i == null ? void 0 : i.closest(".object-variant-editor__value");
      r && r.remove();
      const o = (i == null ? void 0 : i.form) ?? ((u = (c = this.element) == null ? void 0 : c.querySelector) == null ? void 0 : u.call(c, "form"));
      if (!o) return;
      const a = o.querySelector(".object-variant-editor__values");
      if (!a) return;
      if (!a.querySelector(".object-variant-editor__value")) {
        const d = document.createElement("p");
        d.classList.add("notes", "object-variant-editor__empty"), d.textContent = f(
          "EIDOLON.ObjectVariants.ValueListEmpty",
          "No values have been added to this category."
        ), a.appendChild(d);
      }
    }, "#onRemoveValue"));
    this.scene = i ?? null, this.category = r ?? null, this.onSave = typeof a == "function" ? a : null, N(this, ot, !!o), N(this, fe, S(this, It, uo).call(this));
  }
  async _prepareContext() {
    var i, r;
    const n = Array.isArray((i = g(this, fe)) == null ? void 0 : i.values) ? g(this, fe).values : [];
    return {
      isNew: g(this, ot),
      name: ((r = g(this, fe)) == null ? void 0 : r.name) ?? "",
      values: n.map((o, a) => ({
        index: a,
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
        save: g(this, ot) ? f("EIDOLON.ObjectVariants.CreateCategory", "Add Category") : f("EIDOLON.ObjectVariants.SaveCategory", "Save Category"),
        cancel: f("EIDOLON.ObjectVariants.CancelEdit", "Cancel"),
        title: g(this, ot) ? f("EIDOLON.ObjectVariants.CreateCategory", "Add Category") : f("EIDOLON.ObjectVariants.EditCategory", "Edit Category")
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
    const a = r.querySelector("form");
    if (!a) return;
    a.addEventListener("submit", g(this, xn)), a.querySelectorAll('[data-action="add-value"]').forEach((u) => {
      u.addEventListener("click", g(this, jn));
    }), a.querySelectorAll('[data-action="remove-value"]').forEach((u) => {
      u.addEventListener("click", g(this, $t));
    });
    const l = a.querySelector('[data-action="cancel"]');
    l && l.addEventListener("click", (u) => {
      u.preventDefault(), this.close();
    });
  }
};
fe = new WeakMap(), ot = new WeakMap(), It = new WeakSet(), uo = /* @__PURE__ */ s(function() {
  const n = mn(this.category) ?? ao(
    f("EIDOLON.ObjectVariants.DefaultCategoryName", "New Category")
  );
  return {
    id: n.id,
    name: n.name ?? "",
    values: Array.isArray(n.values) ? [...n.values] : []
  };
}, "#initializeState"), xn = new WeakMap(), jn = new WeakMap(), $t = new WeakMap(), fo = /* @__PURE__ */ s(async function() {
  if (!this.scene) return;
  const n = Wt(this.scene), i = n.findIndex((o) => o.id === g(this, fe).id), r = mn({
    id: g(this, fe).id,
    name: g(this, fe).name,
    values: g(this, fe).values
  });
  i === -1 ? n.push(r) : n.splice(i, 1, r);
  try {
    if (await so(this.scene, n), this.onSave)
      try {
        await this.onSave(r);
      } catch (o) {
        console.error(`${ge} | Object variant editor onSave handler failed`, o);
      }
  } catch (o) {
    co(o);
  }
}, "#persist"), s(Me, "CategoryEditorApplication"), Qe(Me, "DEFAULT_OPTIONS", foundry.utils.mergeObject(
  ft(Me, Me, "DEFAULT_OPTIONS"),
  {
    id: `${ge}-variant-category-editor`,
    classes: Array.from(
      /* @__PURE__ */ new Set([...((Nr = ft(Me, Me, "DEFAULT_OPTIONS")) == null ? void 0 : Nr.classes) ?? [], "standard-form", "themed"])
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
)), Qe(Me, "PARTS", {
  content: {
    template: `modules/${ge}/templates/object-variants-category-editor.html`
  }
});
let Fi = Me;
const fs = `modules/${ge}/templates/object-variants-scene-tab.html`, Dt = {
  log: /* @__PURE__ */ s((...e) => {
    var t;
    return (t = console.debug) == null ? void 0 : t.call(console, `${ge} | ObjectVariants`, ...e);
  }, "log"),
  group: /* @__PURE__ */ s((...e) => {
    var t;
    return (t = console.groupCollapsed) == null ? void 0 : t.call(console, `${ge} | ObjectVariants`, ...e);
  }, "group"),
  groupEnd: /* @__PURE__ */ s(() => {
    var e;
    return (e = console.groupEnd) == null ? void 0 : e.call(console);
  }, "groupEnd")
}, gs = zi(Fi), ms = ro({
  tabId: "variants",
  tabLabel: /* @__PURE__ */ s(() => f("EIDOLON.ObjectVariants.TabLabel", "Variants"), "tabLabel"),
  getScene: Le,
  renderContent: /* @__PURE__ */ s(({ app: e, tab: t, scene: n }) => ys(e, t, n), "renderContent"),
  logger: Dt
});
function hs() {
  return ms.register();
}
s(hs, "registerObjectVariantSceneConfigHook");
function ys(e, t, n) {
  if (!(t instanceof HTMLElement)) return;
  const i = ae(n) ? n : Le(e);
  on(e, t, i);
}
s(ys, "renderObjectVariantsTab");
async function on(e, t, n) {
  var r, o;
  const i = n ?? Le(e);
  Dt.group("renderObjectVariantsTabContent", { sceneId: (i == null ? void 0 : i.id) ?? null });
  try {
    if (!ae(i)) {
      const A = f(
        "EIDOLON.ObjectVariants.Unavailable",
        "Object variants are unavailable for this configuration sheet."
      );
      t.innerHTML = `<p class="notes">${A}</p>`, Dt.log("Scene lacks document for object variants", { sceneId: (i == null ? void 0 : i.id) ?? null });
      return;
    }
    const a = Wt(i);
    Dt.log("Rendering object variant list", {
      sceneId: i.id,
      categoryCount: a.length
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
    ), d = f("EIDOLON.ObjectVariants.AddCategory", "Add Category"), y = f(
      "EIDOLON.ObjectVariants.RemoveCategory",
      "Remove Category"
    ), h = f("EIDOLON.ObjectVariants.EditCategory", "Edit Category"), T = f("EIDOLON.ObjectVariants.ValuesLabel", "Values"), m = f(
      "EIDOLON.ObjectVariants.ValueListEmpty",
      "No values have been added to this category."
    ), v = f(
      "EIDOLON.ObjectVariants.UnnamedCategory",
      "Unnamed Category"
    ), w = /* @__PURE__ */ s((A) => vs(A), "formatCount"), O = ((o = (r = foundry == null ? void 0 : foundry.applications) == null ? void 0 : r.handlebars) == null ? void 0 : o.renderTemplate) ?? (typeof renderTemplate == "function" ? renderTemplate : globalThis == null ? void 0 : globalThis.renderTemplate);
    if (typeof O != "function") {
      console.error(`${ge} | renderTemplate is unavailable; cannot render object variants tab.`), t.innerHTML = `<p class="notes">${u}</p>`;
      return;
    }
    let L = "";
    try {
      L = await O(fs, {
        description: l,
        labels: {
          categories: c,
          empty: u,
          addCategory: d,
          removeCategory: y,
          editCategory: h,
          values: T,
          emptyValue: m,
          unnamedCategory: v
        },
        categories: a.map((A) => {
          var R, x;
          const P = ((x = (R = A.name) == null ? void 0 : R.trim) == null ? void 0 : x.call(R)) ?? "";
          return {
            id: A.id,
            name: A.name,
            displayName: P || v,
            isUnnamed: !P,
            values: A.values,
            hasValues: A.values.length > 0,
            valuePreview: bs(A.values),
            valueCount: A.values.length,
            valueCountLabel: w(A.values.length),
            valueChips: Os(A.values)
          };
        }),
        hasCategories: a.length > 0
      });
    } catch (A) {
      console.error(`${ge} | Failed to render object variants scene tab template`, A), t.innerHTML = `<p class="notes">${u}</p>`;
      return;
    }
    t.innerHTML = L, ps(e, t, i);
  } finally {
    Dt.groupEnd();
  }
}
s(on, "renderObjectVariantsTabContent");
function ps(e, t, n) {
  const i = n ?? Le(e);
  if (!ae(i)) return;
  const r = f(
    "EIDOLON.ObjectVariants.DefaultCategoryName",
    "New Category"
  ), o = t.querySelector('[data-variant-action="add-category"]');
  o && o.addEventListener("click", () => {
    pr(e, {
      scene: i,
      category: ao(r),
      isNew: !0,
      onSave: /* @__PURE__ */ s(() => on(e, t, i), "onSave")
    });
  }), t.querySelectorAll('[data-variant-action="remove-category"]').forEach((a) => {
    const l = a.dataset.categoryId;
    l && a.addEventListener("click", async () => {
      await Ts(i, (u) => {
        const d = u.findIndex((y) => y.id === l);
        return d === -1 ? !1 : (u.splice(d, 1), !0);
      }) && await on(e, t, i);
    });
  }), t.querySelectorAll('[data-variant-action="edit-category"]').forEach((a) => {
    const l = a.dataset.categoryId;
    l && a.addEventListener("click", () => {
      const u = Wt(i).find((d) => d.id === l);
      u && pr(e, {
        scene: i,
        category: u,
        onSave: /* @__PURE__ */ s(() => on(e, t, i), "onSave")
      });
    });
  });
}
s(ps, "bindObjectVariantTabEvents");
async function Ts(e, t) {
  const n = Wt(e);
  if (t(n) === !1) return !1;
  try {
    return await so(e, n), !0;
  } catch (r) {
    return co(r), !1;
  }
}
s(Ts, "mutateVariantCategories");
function pr(e, t = {}) {
  const n = t.scene ?? null, i = n && ae(n) ? n : Le(e);
  if (!ae(i)) {
    console.warn(
      `${ge} | Unable to open object variant editor because no scene document is available.`
    );
    return;
  }
  gs({
    scene: i,
    category: t.category ?? null,
    isNew: !!t.isNew,
    onSave: typeof t.onSave == "function" ? t.onSave : null
  }).render({ force: !0 });
}
s(pr, "openCategoryEditor");
function bs(e) {
  if (!Array.isArray(e) || e.length === 0) return "";
  const t = e.slice(0, 5), n = t.join(", ");
  return e.length > t.length ? `${n}, …` : n;
}
s(bs, "buildValuePreview");
function Os(e) {
  return !Array.isArray(e) || e.length === 0 ? [] : e.map((t) => t);
}
s(Os, "buildValueChips");
function vs(e) {
  var t, n;
  if ((n = (t = game.i18n) == null ? void 0 : t.has) != null && n.call(t, "EIDOLON.ObjectVariants.ValueCountLabel"))
    try {
      return game.i18n.format("EIDOLON.ObjectVariants.ValueCountLabel", { count: e });
    } catch (i) {
      console.error(`${ge} | Failed to format value count label`, i);
    }
  return e === 0 ? "No values configured" : e === 1 ? "1 value" : `${e} values`;
}
s(vs, "formatValueCount");
function Es() {
  hs();
}
s(Es, "registerObjectVariantHooks");
Es();
const at = E, Tt = "lightPresets", Wi = Object.freeze({
  default: null,
  presets: [],
  current: null
});
function go(e) {
  var n;
  const t = ((n = e == null ? void 0 : e.getFlag) == null ? void 0 : n.call(e, at, Tt)) ?? Wi;
  return mo(t);
}
s(go, "getLightPresetState");
async function ws(e, t) {
  const n = mo(t);
  if (!(e != null && e.setFlag))
    return n;
  const i = n.default !== null, r = n.presets.length > 0, o = n.current !== null;
  return !i && !r && !o ? (typeof e.unsetFlag == "function" ? await e.unsetFlag(at, Tt) : await e.setFlag(at, Tt, null), Wi) : (await e.setFlag(at, Tt, n), n);
}
s(ws, "setLightPresetState");
async function Ji(e, t) {
  if (typeof t != "function")
    throw new TypeError("updateLightPresetState requires an updater function.");
  const n = lt(go(e)), i = await t(n);
  return ws(e, i);
}
s(Ji, "updateLightPresetState");
async function Tr(e, t) {
  const n = wt(t);
  if (!n)
    throw new Error("Invalid light configuration payload.");
  return Ji(e, (i) => ({
    ...i,
    default: n
  }));
}
s(Tr, "storeDefaultPreset");
async function br(e, t, n, { label: i } = {}) {
  const r = Ki(t);
  if (!r)
    throw new Error("Cannot create preset without at least one category selection.");
  const o = wt(n);
  if (!o)
    throw new Error("Invalid light configuration payload.");
  return Ji(e, (a) => {
    const l = zn(r), c = Array.isArray(a == null ? void 0 : a.presets) ? [...a.presets] : [], u = c.findIndex((T) => (T == null ? void 0 : T.key) === l), d = u >= 0 ? c[u] : null, y = typeof (d == null ? void 0 : d.id) == "string" && d.id.trim() ? d.id.trim() : po(), h = ho({
      id: y,
      categories: r,
      config: o,
      label: typeof i == "string" ? i : (d == null ? void 0 : d.label) ?? null,
      updatedAt: Date.now()
    });
    if (!h)
      throw new Error("Failed to sanitize preset entry.");
    return u >= 0 ? c[u] = h : c.push(h), {
      ...a,
      presets: c
    };
  });
}
s(br, "upsertLightPreset");
async function Or(e, t) {
  const n = yo(t);
  return Ji(e, (i) => ({
    ...i,
    current: n
  }));
}
s(Or, "storeCurrentPresetSelection");
function mo(e) {
  var c;
  const t = lt(e);
  if (!t || typeof t != "object")
    return lt(Wi);
  const n = wt(t.default ?? t.defaultPreset), i = Array.isArray(t.presets) ? t.presets : [], r = /* @__PURE__ */ new Map();
  for (const u of i) {
    const d = ho(u);
    d && r.set(d.key, d);
  }
  const o = Array.from(r.values()), a = new Map(o.map((u) => [u.id, u]));
  let l = yo(t.current);
  if (l) {
    const u = l.categories && Object.keys(l.categories).length > 0;
    if (l.presetId && !a.has(l.presetId)) {
      const d = u ? ((c = o.find((y) => y.key === zn(l.categories))) == null ? void 0 : c.id) ?? null : null;
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
s(mo, "sanitizeLightPresetState");
function wt(e) {
  const t = lt(e);
  if (!t || typeof t != "object") return null;
  "_id" in t && delete t._id, "id" in t && delete t.id;
  const n = t.flags;
  if (n && typeof n == "object") {
    const i = n[at];
    i && typeof i == "object" && (delete i[Tt], Object.keys(i).length === 0 && delete n[at]), Object.keys(n).length === 0 && delete t.flags;
  }
  return t;
}
s(wt, "sanitizeLightConfigPayload");
function ho(e) {
  if (!e || typeof e != "object") return null;
  const t = Ki(e.categories);
  if (!t) return null;
  const n = wt(e.config);
  if (!n) return null;
  const i = typeof e.id == "string" && e.id.trim() ? e.id.trim() : po(), r = zn(t), o = {
    id: i,
    key: r,
    categories: t,
    config: n,
    updatedAt: Number.isFinite(e.updatedAt) ? Number(e.updatedAt) : Date.now()
  };
  return typeof e.label == "string" && e.label.trim() && (o.label = e.label.trim()), o;
}
s(ho, "sanitizePresetEntry");
function yo(e) {
  if (!e || typeof e != "object") return null;
  const t = typeof e.presetId == "string" && e.presetId.trim() ? e.presetId.trim() : null, n = Ki(e.categories);
  return !t && !n ? null : {
    presetId: t,
    categories: n,
    updatedAt: Number.isFinite(e.updatedAt) ? Number(e.updatedAt) : Date.now()
  };
}
s(yo, "sanitizeCurrentSelection");
function Ki(e) {
  const t = {};
  if (Array.isArray(e))
    for (const n of e) {
      const i = vr((n == null ? void 0 : n.id) ?? (n == null ? void 0 : n.categoryId) ?? (n == null ? void 0 : n.category)), r = Er((n == null ? void 0 : n.value) ?? (n == null ? void 0 : n.selection) ?? (n == null ? void 0 : n.label));
      !i || !r || (t[i] = r);
    }
  else if (e && typeof e == "object")
    for (const [n, i] of Object.entries(e)) {
      const r = vr(n), o = Er(i);
      !r || !o || (t[r] = o);
    }
  return Object.keys(t).length > 0 ? t : null;
}
s(Ki, "sanitizePresetCategories");
function zn(e) {
  if (!e || typeof e != "object") return "";
  const t = Object.entries(e).filter(([, n]) => typeof n == "string" && n).map(([n, i]) => `${n}:${i}`);
  return t.sort((n, i) => n < i ? -1 : n > i ? 1 : 0), t.join("|");
}
s(zn, "computePresetKey");
function po() {
  var e;
  return (e = foundry == null ? void 0 : foundry.utils) != null && e.randomID ? foundry.utils.randomID() : typeof (crypto == null ? void 0 : crypto.randomUUID) == "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}
s(po, "generateLightPresetId");
function vr(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  return t || null;
}
s(vr, "normalizeCategoryId");
function Er(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  return t || null;
}
s(Er, "normalizeCategoryValue");
const sn = /* @__PURE__ */ new WeakMap(), oe = "__eidolon_default__";
function Ss() {
  Hooks.on("renderAmbientLightConfig", Is), b("LightPresets | AmbientLightConfig controls registered");
}
s(Ss, "registerAmbientLightConfigControls");
function Is(e, t) {
  var n;
  Et("LightPresets | renderAmbientLightConfig", {
    appId: (e == null ? void 0 : e.id) ?? null,
    constructor: ((n = e == null ? void 0 : e.constructor) == null ? void 0 : n.name) ?? null,
    isRendered: (e == null ? void 0 : e.rendered) ?? !1
  });
  try {
    const i = Pi(t);
    if (!i) return;
    Ls(e, i);
  } catch (i) {
    console.error("eidolon-utilities | Failed to enhance AmbientLightConfig UI", i);
  } finally {
    We();
  }
}
s(Is, "handleAmbientLightConfigRender");
function Ls(e, t) {
  var J, Lt, _e;
  const n = (e == null ? void 0 : e.form) instanceof HTMLFormElement ? e.form : t instanceof HTMLFormElement ? t : (J = t == null ? void 0 : t.closest) == null ? void 0 : J.call(t, "form");
  if (!(n instanceof HTMLFormElement)) return;
  const i = n.querySelector(".window-content");
  if (!(i instanceof HTMLElement)) return;
  const r = bo(e);
  if (!r) return;
  const o = Hs(r);
  b("LightPresets | Resolved ambient light", {
    sheetId: (r == null ? void 0 : r.id) ?? null,
    persistedId: (o == null ? void 0 : o.id) ?? null,
    sameRef: r === o
  });
  const a = (o == null ? void 0 : o.parent) ?? r.parent ?? null, l = a ? Wt(a) : [], c = l.filter(
    (M) => Array.isArray(M == null ? void 0 : M.values) && M.values.length > 0
  ), u = Ps(l), d = go(o ?? r);
  b("LightPresets | Loaded preset state", {
    hasDefault: !!(d != null && d.default),
    presetCount: Array.isArray(d == null ? void 0 : d.presets) ? d.presets.length : 0,
    presets: Array.isArray(d == null ? void 0 : d.presets) ? d.presets.map((M) => {
      var k, K;
      return {
        id: M.id,
        key: M.key,
        hasColor: !!((K = (k = M.config) == null ? void 0 : k.config) != null && K.color)
      };
    }) : []
  });
  const y = i.querySelector(".eidolon-light-presets");
  y && y.remove();
  const h = document.createElement("fieldset");
  h.classList.add("eidolon-light-presets");
  const T = document.createElement("legend");
  T.textContent = f("EIDOLON.LightPresets.Legend", "Light Presets"), h.appendChild(T);
  const m = document.createElement("p");
  m.classList.add("notes"), m.textContent = f(
    "EIDOLON.LightPresets.Description",
    "Capture default lighting and register presets tied to scene variant values."
  ), h.appendChild(m);
  const v = document.createElement("div");
  v.classList.add("eidolon-light-presets__controls");
  const w = document.createElement("button");
  w.type = "button", w.dataset.action = "make-default", w.classList.add("eidolon-light-presets__button"), w.textContent = f(
    "EIDOLON.LightPresets.MakeDefault",
    "Make Default"
  ), v.appendChild(w);
  const O = document.createElement("button");
  O.type = "button", O.dataset.action = "create-preset", O.classList.add("eidolon-light-presets__button"), O.textContent = f(
    "EIDOLON.LightPresets.CreatePreset",
    "Create Preset"
  ), O.setAttribute("aria-expanded", "false"), v.appendChild(O), h.appendChild(v);
  const L = document.createElement("p");
  L.classList.add("notes", "eidolon-light-presets__status"), h.appendChild(L);
  const A = document.createElement("div");
  A.classList.add("eidolon-light-presets__switcher");
  const P = document.createElement("label");
  P.classList.add("eidolon-light-presets__switcher-label");
  const R = `${(e == null ? void 0 : e.id) ?? (r == null ? void 0 : r.id) ?? "eidolon-light"}-preset-select`;
  P.htmlFor = R, P.textContent = f("EIDOLON.LightPresets.SelectLabel", "Preset"), A.appendChild(P);
  const x = document.createElement("div");
  x.classList.add("eidolon-light-presets__switcher-controls"), A.appendChild(x);
  const F = document.createElement("select");
  F.id = R, F.classList.add("eidolon-light-presets__select"), F.dataset.action = "select-preset", x.appendChild(F);
  const B = document.createElement("button");
  B.type = "button", B.dataset.action = "apply-selected-preset", B.classList.add("eidolon-light-presets__button", "secondary"), B.textContent = f("EIDOLON.LightPresets.ApplyButton", "Apply"), x.appendChild(B);
  const H = document.createElement("button");
  if (H.type = "button", H.dataset.action = "update-selected-preset", H.classList.add("eidolon-light-presets__button", "secondary"), H.textContent = f(
    "EIDOLON.LightPresets.UpdateButton",
    "Save Changes"
  ), x.appendChild(H), h.appendChild(A), l.length === 0) {
    const M = document.createElement("p");
    M.classList.add("notification", "warning", "eidolon-light-presets__warning"), M.textContent = f(
      "EIDOLON.LightPresets.NoCategoriesWarning",
      "This scene has no variant categories. Add categories under Scene → Variants to enable lighting presets."
    ), h.appendChild(M);
  } else if (c.length === 0) {
    const M = document.createElement("p");
    M.classList.add("notification", "warning", "eidolon-light-presets__warning"), M.textContent = f(
      "EIDOLON.LightPresets.NoValuesWarning",
      "Variant categories exist, but none define selectable values. Add values in Scene → Variants."
    ), h.appendChild(M);
  }
  const q = document.createElement("div");
  q.classList.add("eidolon-light-presets__creation"), q.dataset.section = "creation", q.hidden = !0;
  const ie = document.createElement("p");
  ie.classList.add("notes"), ie.textContent = f(
    "EIDOLON.LightPresets.CreateDescription",
    "Assign scene variant values to map the current configuration to a preset."
  ), q.appendChild(ie);
  const I = document.createElement("div");
  I.classList.add("eidolon-light-presets__category-list"), q.appendChild(I);
  for (const M of c) {
    const k = document.createElement("label");
    k.classList.add("eidolon-light-presets__category");
    const K = document.createElement("span");
    K.classList.add("eidolon-light-presets__category-name"), K.textContent = (_e = (Lt = M.name) == null ? void 0 : Lt.trim) != null && _e.call(Lt) ? M.name.trim() : f("EIDOLON.LightPresets.UnnamedCategory", "Unnamed Category"), k.appendChild(K);
    const G = document.createElement("select");
    G.dataset.categoryId = M.id, G.classList.add("eidolon-light-presets__category-select");
    const Y = document.createElement("option");
    Y.value = "", Y.textContent = f(
      "EIDOLON.LightPresets.IgnoreCategory",
      "Ignore"
    ), G.appendChild(Y);
    for (const Q of M.values) {
      const X = document.createElement("option");
      X.value = Q, X.textContent = Q, G.appendChild(X);
    }
    k.appendChild(G), I.appendChild(k);
  }
  const j = document.createElement("div");
  j.classList.add("eidolon-light-presets__creation-actions");
  const $ = document.createElement("button");
  $.type = "button", $.dataset.action = "save-preset", $.classList.add("eidolon-light-presets__button", "primary"), $.textContent = f(
    "EIDOLON.LightPresets.SavePreset",
    "Save Preset"
  ), j.appendChild($);
  const V = document.createElement("button");
  V.type = "button", V.dataset.action = "cancel-create", V.classList.add("eidolon-light-presets__button", "secondary"), V.textContent = f(
    "EIDOLON.LightPresets.Cancel",
    "Cancel"
  ), j.appendChild(V), q.appendChild(j), h.appendChild(q), i.appendChild(h), requestAnimationFrame(() => {
    var M;
    (M = e.setPosition) == null || M.call(e, { height: "auto" });
  });
  let p = d;
  gt(L, p), At(O, {
    state: p,
    hasCategories: c.length > 0
  }), b("LightPresets | Controls injected", {
    sceneId: (a == null ? void 0 : a.id) ?? null,
    lightId: (r == null ? void 0 : r.id) ?? null,
    hasDefault: !!(p != null && p.default),
    presetCount: Array.isArray(p == null ? void 0 : p.presets) ? p.presets.length : 0,
    categories: c.length
  });
  const W = Fs(p), _ = {
    restoreConfig: null,
    app: e,
    selectedPreset: W
  };
  sn.set(h, _), F.addEventListener("change", () => {
    _.selectedPreset = F.value ?? "", Ne({
      presetSelect: F,
      applyPresetButton: B,
      updatePresetButton: H,
      state: p
    });
  });
  const ne = /* @__PURE__ */ s(async () => {
    var G, Y, Q, X, le, re, ce, Re, me, He, $e, Ve, be, ke;
    const M = F.value ?? "";
    if (!M) {
      (Y = (G = ui.notifications) == null ? void 0 : G.warn) == null || Y.call(
        G,
        f(
          "EIDOLON.LightPresets.SelectPresetWarning",
          "Choose a preset before applying."
        )
      ), Ne({
        presetSelect: F,
        applyPresetButton: B,
        updatePresetButton: H,
        state: p
      });
      return;
    }
    if (M === oe) {
      if (!(p != null && p.default)) {
        (X = (Q = ui.notifications) == null ? void 0 : Q.warn) == null || X.call(
          Q,
          f(
            "EIDOLON.LightPresets.DefaultUnavailable",
            "Save a default preset before applying it."
          )
        );
        return;
      }
      Kt(h, q, O), Qt(e, n, p.default), p = await Or(o ?? r, {
        presetId: oe,
        categories: null,
        updatedAt: Date.now()
      }), _.selectedPreset = oe, xe(F, p, u, _.selectedPreset), _.selectedPreset = F.value ?? oe, gt(L, p), At(O, {
        state: p,
        hasCategories: c.length > 0
      }), wr(n, {
        presetId: oe,
        color: ((re = (le = p.default) == null ? void 0 : le.config) == null ? void 0 : re.color) ?? null
      }), (Re = (ce = ui.notifications) == null ? void 0 : ce.info) == null || Re.call(
        ce,
        f(
          "EIDOLON.LightPresets.DefaultApplied",
          "Applied the default preset to the form."
        )
      ), Ne({
        presetSelect: F,
        applyPresetButton: B,
        updatePresetButton: H,
        state: p
      });
      return;
    }
    const k = Array.isArray(p == null ? void 0 : p.presets) && p.presets.length ? p.presets.find((Ce) => (Ce == null ? void 0 : Ce.id) === M) : null;
    if (!k) {
      (He = (me = ui.notifications) == null ? void 0 : me.warn) == null || He.call(
        me,
        f(
          "EIDOLON.LightPresets.PresetUnavailable",
          "The selected preset is no longer available."
        )
      ), xe(F, p, u, ""), _.selectedPreset = F.value ?? "", Ne({
        presetSelect: F,
        applyPresetButton: B,
        updatePresetButton: H,
        state: p
      });
      return;
    }
    Kt(h, q, O), Qt(e, n, k.config), p = await Or(o ?? r, {
      presetId: k.id,
      categories: k.categories,
      updatedAt: Date.now()
    }), _.selectedPreset = k.id, xe(F, p, u, _.selectedPreset), _.selectedPreset = F.value ?? k.id, gt(L, p), At(O, {
      state: p,
      hasCategories: c.length > 0
    }), wr(n, {
      presetId: k.id,
      color: ((Ve = ($e = k.config) == null ? void 0 : $e.config) == null ? void 0 : Ve.color) ?? null
    });
    const K = bt(k, u);
    (ke = (be = ui.notifications) == null ? void 0 : be.info) == null || ke.call(
      be,
      f(
        "EIDOLON.LightPresets.PresetApplied",
        "Applied preset: {label}"
      ).replace("{label}", K)
    ), Ne({
      presetSelect: F,
      applyPresetButton: B,
      updatePresetButton: H,
      state: p
    });
  }, "applySelectedPreset");
  B.addEventListener("click", () => {
    ne();
  }), F.addEventListener("keydown", (M) => {
    M.key === "Enter" && (M.preventDefault(), ne());
  });
  const z = /* @__PURE__ */ s(async () => {
    var k, K, G, Y, Q, X, le, re, ce, Re, me, He, $e, Ve, be, ke, Ce, te, Ct, Ye, or;
    const M = _.selectedPreset;
    if (!M) {
      (K = (k = ui.notifications) == null ? void 0 : k.warn) == null || K.call(
        k,
        f(
          "EIDOLON.LightPresets.SelectPresetWarning",
          "Choose a preset before applying."
        )
      );
      return;
    }
    H.disabled = !0;
    try {
      const ue = Yt(e, o);
      if (M === oe)
        p = await Tr(o ?? r, ue), b("LightPresets | Default preset updated", {
          lightId: ((G = o ?? r) == null ? void 0 : G.id) ?? null,
          configColor: ((Y = ue == null ? void 0 : ue.config) == null ? void 0 : Y.color) ?? null
        }), (X = (Q = ui.notifications) == null ? void 0 : Q.info) == null || X.call(
          Q,
          f(
            "EIDOLON.LightPresets.DefaultUpdated",
            "Updated the default preset with the current configuration."
          )
        ), _.selectedPreset = oe;
      else {
        const dt = _i(p, M);
        if (!dt) {
          (re = (le = ui.notifications) == null ? void 0 : le.warn) == null || re.call(
            le,
            f(
              "EIDOLON.LightPresets.PresetUnavailable",
              "The selected preset is no longer available."
            )
          ), xe(F, p, u, ""), _.selectedPreset = F.value ?? "";
          return;
        }
        p = await br(
          o ?? r,
          dt.categories,
          ue,
          { label: dt.label ?? null }
        ), b("LightPresets | Preset updated", {
          presetId: M,
          hasColor: !!((ce = ue == null ? void 0 : ue.config) != null && ce.color),
          stored: Array.isArray(p == null ? void 0 : p.presets) ? ((Re = p.presets.find((Wn) => (Wn == null ? void 0 : Wn.id) === M)) == null ? void 0 : Re.config) ?? null : null,
          persisted: (He = (me = o ?? r) == null ? void 0 : me.getFlag) == null ? void 0 : He.call(me, at, Tt)
        });
        const Nt = _i(p, M), No = bt(Nt || dt, u);
        b("LightPresets | Preset updated", {
          presetId: M,
          categories: dt.categories,
          updatedColor: (($e = ue == null ? void 0 : ue.config) == null ? void 0 : $e.color) ?? null,
          storedColor: ((be = (Ve = Nt == null ? void 0 : Nt.config) == null ? void 0 : Ve.config) == null ? void 0 : be.color) ?? ((Ce = (ke = dt.config) == null ? void 0 : ke.config) == null ? void 0 : Ce.color) ?? null
        }), (Ct = (te = ui.notifications) == null ? void 0 : te.info) == null || Ct.call(
          te,
          f(
            "EIDOLON.LightPresets.PresetUpdated",
            "Saved changes to preset: {label}"
          ).replace("{label}", No)
        ), _.selectedPreset = M;
      }
      gt(L, p), At(O, {
        state: p,
        hasCategories: c.length > 0
      }), xe(F, p, u, _.selectedPreset), _.selectedPreset = F.value ?? "";
    } catch (ue) {
      console.error("eidolon-utilities | Failed to update light preset", ue), (or = (Ye = ui.notifications) == null ? void 0 : Ye.error) == null || or.call(
        Ye,
        f(
          "EIDOLON.LightPresets.PresetUpdateError",
          "Failed to save the preset. Check the console for details."
        )
      );
    } finally {
      H.disabled = !1, Ne({
        presetSelect: F,
        applyPresetButton: B,
        updatePresetButton: H,
        state: p
      });
    }
  }, "updateSelectedPreset");
  H.addEventListener("click", () => {
    z();
  }), xe(F, p, u, _.selectedPreset), _.selectedPreset = F.value ?? _.selectedPreset ?? "", Ne({
    presetSelect: F,
    applyPresetButton: B,
    updatePresetButton: H,
    state: p
  }), w.addEventListener("click", async () => {
    var M, k, K, G, Y, Q;
    w.disabled = !0;
    try {
      const X = Yt(e, o);
      p = await Tr(o ?? r, X), b("LightPresets | Default preset stored", {
        lightId: ((M = o ?? r) == null ? void 0 : M.id) ?? null,
        configColor: ((k = X == null ? void 0 : X.config) == null ? void 0 : k.color) ?? null
      }), (G = (K = ui.notifications) == null ? void 0 : K.info) == null || G.call(
        K,
        f(
          "EIDOLON.LightPresets.DefaultStored",
          "Saved the current configuration as the default preset."
        )
      ), gt(L, p), At(O, {
        state: p,
        hasCategories: c.length > 0
      }), _.selectedPreset = oe, xe(F, p, u, _.selectedPreset), _.selectedPreset = F.value ?? "", Ne({
        presetSelect: F,
        applyPresetButton: B,
        updatePresetButton: H,
        state: p
      });
    } catch (X) {
      console.error("eidolon-utilities | Failed to store default light preset", X), (Q = (Y = ui.notifications) == null ? void 0 : Y.error) == null || Q.call(
        Y,
        f(
          "EIDOLON.LightPresets.DefaultError",
          "Failed to save the default preset. Check the console for details."
        )
      );
    } finally {
      w.disabled = !1;
    }
  }), O.addEventListener("click", () => {
    var k, K, G, Y;
    if (!(p != null && p.default)) {
      (K = (k = ui.notifications) == null ? void 0 : k.warn) == null || K.call(
        k,
        f(
          "EIDOLON.LightPresets.RequiresDefault",
          "Create a default preset before adding additional variants."
        )
      );
      return;
    }
    if (c.length === 0) {
      (Y = (G = ui.notifications) == null ? void 0 : G.warn) == null || Y.call(
        G,
        f(
          "EIDOLON.LightPresets.NoCategoriesAvailable",
          "Add variant categories with values in the Scene configuration before creating presets."
        )
      );
      return;
    }
    const M = sn.get(h);
    M && (M.restoreConfig = Yt(e, o)), Qt(e, n, p.default), _s(I), q.hidden = !1, O.setAttribute("aria-expanded", "true"), requestAnimationFrame(() => {
      var Q;
      (Q = e.setPosition) == null || Q.call(e, { height: "auto" });
    });
  }), $.addEventListener("click", async () => {
    var k, K, G, Y, Q, X, le;
    const M = Rs(I);
    if (!M) {
      (K = (k = ui.notifications) == null ? void 0 : k.warn) == null || K.call(
        k,
        f(
          "EIDOLON.LightPresets.SelectionRequired",
          "Select at least one category value to identify the preset."
        )
      );
      return;
    }
    $.disabled = !0;
    try {
      const re = Yt(e, o);
      p = await br(
        o ?? r,
        M,
        re,
        {}
      ), b("LightPresets | Preset saved from editor", {
        categories: M,
        configColor: ((G = re == null ? void 0 : re.config) == null ? void 0 : G.color) ?? null
      }), (Q = (Y = ui.notifications) == null ? void 0 : Y.info) == null || Q.call(
        Y,
        f(
          "EIDOLON.LightPresets.PresetSaved",
          "Updated lighting preset for the selected scene variants."
        )
      ), gt(L, p);
      const ce = To(p, M);
      ce && (_.selectedPreset = ce), xe(F, p, u, _.selectedPreset), _.selectedPreset = F.value ?? "", Ne({
        presetSelect: F,
        applyPresetButton: B,
        updatePresetButton: H,
        state: p
      }), Kt(h, q, O);
    } catch (re) {
      console.error("eidolon-utilities | Failed to persist light preset", re), (le = (X = ui.notifications) == null ? void 0 : X.error) == null || le.call(
        X,
        f(
          "EIDOLON.LightPresets.PresetError",
          "Failed to save the preset. Check the console for details."
        )
      );
    } finally {
      $.disabled = !1;
    }
  }), V.addEventListener("click", () => {
    const M = sn.get(h);
    M != null && M.restoreConfig && Qt(e, n, M.restoreConfig), Kt(h, q, O);
  });
}
s(Ls, "enhanceAmbientLightConfig");
function Kt(e, t, n) {
  const i = sn.get(e);
  i && (i.restoreConfig = null), t.hidden = !0, n.setAttribute("aria-expanded", "false"), requestAnimationFrame(() => {
    var r, o;
    (o = (r = i == null ? void 0 : i.app) == null ? void 0 : r.setPosition) == null || o.call(r, { height: "auto" });
  });
}
s(Kt, "hideCreationSection");
function gt(e, t) {
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
s(gt, "updateStatusLine");
function At(e, { state: t, hasCategories: n }) {
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
s(At, "updateCreateButtonState");
function Yt(e, t) {
  var c, u, d;
  const n = t ?? bo(e);
  if (!n)
    throw new Error("Ambient light document unavailable.");
  const i = wt(((c = n.toObject) == null ? void 0 : c.call(n)) ?? {});
  if (!i)
    throw new Error("Unable to duplicate ambient light data.");
  const r = (e == null ? void 0 : e.form) instanceof HTMLFormElement ? e.form : null, o = r ? ns(r) : {}, a = foundry.utils.mergeObject(i, o, {
    inplace: !1,
    performDeletions: !0
  });
  r && (r.querySelectorAll("color-picker[name]").forEach((y) => {
    var O, L;
    const h = y.getAttribute("name");
    if (!h) return;
    const T = typeof y.value == "string" ? y.value : "", m = ((O = y.ui) == null ? void 0 : O.input) ?? ((L = y.querySelector) == null ? void 0 : L.call(y, 'input[type="color"]')), v = (m == null ? void 0 : m.value) ?? "", w = T || v;
    typeof w != "string" || !w || (foundry.utils.setProperty(a, h, w), b("LightPresets | Captured color-picker value", {
      path: h,
      pickerValue: T,
      swatchValue: v,
      chosenValue: w
    }));
  }), r.querySelectorAll("range-picker[name]").forEach((y) => {
    var R, x;
    const h = y.getAttribute("name");
    if (!h) return;
    const T = y.value !== void 0 && y.value !== null ? String(y.value) : "", m = (R = y.querySelector) == null ? void 0 : R.call(y, 'input[type="range"]'), v = (x = y.querySelector) == null ? void 0 : x.call(y, 'input[type="number"]'), w = m instanceof HTMLInputElement ? m.value : "", O = v instanceof HTMLInputElement ? v.value : "", L = T || O || w;
    if (typeof L != "string" || !L.length) return;
    const A = Number(L), P = Number.isFinite(A) ? A : L;
    foundry.utils.setProperty(a, h, P), b("LightPresets | Captured range-picker value", {
      path: h,
      elementValue: T,
      numberValue: O,
      rangeValue: w,
      chosenValue: P
    });
  }));
  const l = wt(a);
  return b("LightPresets | Captured form config", {
    lightId: (n == null ? void 0 : n.id) ?? null,
    hasColor: !!((u = l == null ? void 0 : l.config) != null && u.color),
    color: ((d = l == null ? void 0 : l.config) == null ? void 0 : d.color) ?? null
  }), l;
}
s(Yt, "captureAmbientLightFormConfig");
function Qt(e, t, n) {
  if (!n || typeof n != "object") return;
  const i = foundry.utils.flattenObject(n, { safe: !0 });
  for (const [r, o] of Object.entries(i)) {
    const a = t.querySelectorAll(`[name="${r}"]`);
    if (a.length) {
      b("LightPresets | Applying field", {
        path: r,
        value: o,
        elementCount: a.length
      });
      for (const l of a)
        l instanceof HTMLElement && l.tagName === "COLOR-PICKER" ? Ns(l, o) : l instanceof HTMLElement && l.tagName === "RANGE-PICKER" ? As(l, o) : l instanceof HTMLInputElement ? Cs(l, o) : l instanceof HTMLSelectElement ? Ms(l, o) : l instanceof HTMLTextAreaElement && Ds(l, o);
    }
  }
  requestAnimationFrame(() => {
    var r;
    return (r = e._previewChanges) == null ? void 0 : r.call(e);
  });
}
s(Qt, "applyConfigToForm");
function Cs(e, t, n) {
  const i = e.type;
  if (i === "checkbox") {
    const a = !!t;
    e.checked !== a && (e.checked = a, Te(e));
    return;
  }
  if (i === "radio") {
    const a = t == null ? "" : String(t), l = e.value === a;
    e.checked !== l && (e.checked = l, l && Te(e));
    return;
  }
  const r = t == null ? "" : String(t);
  let o = !1;
  e.value !== r && (e.value = r, o = !0), o && Te(e);
}
s(Cs, "applyValueToInput");
function Ns(e, t, n) {
  var l, c, u, d, y, h;
  const i = t == null ? "" : String(t);
  let r = !1;
  e.value !== i && (e.value = i, e.setAttribute("value", i), (l = e.ui) != null && l.setValue && e.ui.setValue(i), r = !0);
  const o = ((c = e.ui) == null ? void 0 : c.input) ?? ((u = e.querySelector) == null ? void 0 : u.call(e, 'input[type="color"]'));
  o instanceof HTMLInputElement && o.value !== i && (o.value = i, Te(o));
  const a = ((d = e.ui) == null ? void 0 : d.text) ?? ((y = e.querySelector) == null ? void 0 : y.call(e, 'input[type="text"]'));
  a instanceof HTMLInputElement && a.value !== i && (a.value = i, Te(a)), (h = e.ui) != null && h.commit ? e.ui.commit() : (e.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }))), b("LightPresets | Color picker applied", {
    value: i,
    pickerValue: e.value ?? null,
    swatchValue: (o == null ? void 0 : o.value) ?? null,
    textValue: (a == null ? void 0 : a.value) ?? null
  }), r && Te(e);
}
s(Ns, "applyValueToColorPicker");
function As(e, t, n) {
  var u, d;
  const i = t == null ? "" : String(t), r = Number(i), o = Number.isFinite(r) ? r : i;
  let a = !1;
  e.value !== void 0 && e.value !== o && (e.value = o, a = !0), e.getAttribute("value") !== i && (e.setAttribute("value", i), a = !0);
  const l = (u = e.querySelector) == null ? void 0 : u.call(e, 'input[type="range"]');
  l instanceof HTMLInputElement && l.value !== i && (l.value = i, Te(l));
  const c = (d = e.querySelector) == null ? void 0 : d.call(e, 'input[type="number"]');
  if (c instanceof HTMLInputElement && c.value !== i && (c.value = i, Te(c)), typeof e.commit == "function")
    try {
      e.commit();
    } catch (y) {
      console.error("eidolon-utilities | range-picker commit failed", y);
    }
  b("LightPresets | Range picker applied", {
    value: i,
    resolvedValue: o,
    rangeValue: (l == null ? void 0 : l.value) ?? null,
    numberValue: (c == null ? void 0 : c.value) ?? null
  }), a && Te(e);
}
s(As, "applyValueToRangePicker");
function Ms(e, t, n) {
  const i = t == null ? "" : String(t);
  e.value !== i && (e.value = i, Te(e));
}
s(Ms, "applyValueToSelect");
function Ds(e, t, n) {
  const i = t == null ? "" : String(t);
  e.value !== i && (e.value = i, Te(e));
}
s(Ds, "applyValueToTextarea");
function Te(e) {
  e.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }));
}
s(Te, "triggerInputChange");
function Ne({ presetSelect: e, applyPresetButton: t, updatePresetButton: n, state: i }) {
  const r = (e == null ? void 0 : e.value) ?? "", o = !!(i != null && i.default), a = r && r !== oe ? !!_i(i, r) : !1;
  t instanceof HTMLButtonElement && (r ? r === oe ? t.disabled = !o : t.disabled = !a : t.disabled = !0), n instanceof HTMLButtonElement && (r ? r === oe ? n.disabled = !1 : n.disabled = !a : n.disabled = !0);
}
s(Ne, "syncPresetSwitcherState");
function Ps(e) {
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
s(Ps, "buildCategoryNameLookup");
function xe(e, t, n, i) {
  if (!(e instanceof HTMLSelectElement)) return;
  const r = typeof i == "string" ? i : "", o = !!(t != null && t.default), a = Array.isArray(t == null ? void 0 : t.presets) ? [...t.presets] : [], l = e.value;
  e.innerHTML = "";
  const c = document.createElement("option");
  c.value = "", c.textContent = f(
    "EIDOLON.LightPresets.SelectPlaceholder",
    "Select a preset"
  ), e.appendChild(c);
  const u = document.createElement("option");
  u.value = oe, u.textContent = f(
    "EIDOLON.LightPresets.DefaultOption",
    "Default Preset"
  ), u.disabled = !o, e.appendChild(u), a.slice().sort((h, T) => {
    var w;
    const m = bt(h, n), v = bt(T, n);
    return m.localeCompare(v, ((w = game.i18n) == null ? void 0 : w.lang) ?? void 0, {
      sensitivity: "base"
    });
  }).forEach((h) => {
    if (!(h != null && h.id)) return;
    const T = document.createElement("option");
    T.value = h.id, T.textContent = bt(h, n), e.appendChild(T);
  });
  const d = new Set(
    Array.from(e.options).filter((h) => !h.disabled).map((h) => h.value)
  ), y = r || (d.has(l) ? l : "");
  y && d.has(y) ? e.value = y : o ? e.value = oe : e.value = "";
}
s(xe, "populatePresetSelector");
function bt(e, t) {
  if (!e || typeof e != "object")
    return f("EIDOLON.LightPresets.UnnamedPreset", "Unnamed Preset");
  if (typeof e.label == "string" && e.label.trim())
    return e.label.trim();
  const n = e.categories ?? {}, i = Object.entries(n).filter(([, r]) => typeof r == "string" && r.trim()).map(([r, o]) => {
    const a = o.trim();
    return `${t.get(r) ?? f("EIDOLON.LightPresets.UnnamedCategory", "Unnamed Category")}: ${a}`;
  });
  return i.length === 0 ? f("EIDOLON.LightPresets.UnnamedPreset", "Unnamed Preset") : i.join(" • ");
}
s(bt, "formatPresetOptionLabel");
function To(e, t) {
  if (!e || typeof e != "object" || !Array.isArray(e.presets)) return null;
  const n = zn(t);
  if (!n) return null;
  const i = e.presets.find((r) => (r == null ? void 0 : r.key) === n);
  return (i == null ? void 0 : i.id) ?? null;
}
s(To, "findPresetIdByCategories");
function _i(e, t) {
  return !t || !e || typeof e != "object" || !Array.isArray(e.presets) ? null : e.presets.find((n) => (n == null ? void 0 : n.id) === t) ?? null;
}
s(_i, "getPresetById");
function Fs(e) {
  if (!e || typeof e != "object") return "";
  const t = e.current;
  if (t != null && t.presetId) {
    if (t.presetId === oe)
      return e != null && e.default ? oe : "";
    if (Array.isArray(e.presets) && e.presets.some((n) => n.id === t.presetId))
      return t.presetId;
  }
  if (t != null && t.categories) {
    const n = To(e, t.categories);
    if (n) return n;
  }
  return "";
}
s(Fs, "resolveInitialPresetSelection");
function wr(e, t = {}) {
  var a, l, c, u;
  if (!(e instanceof HTMLFormElement)) return;
  const n = e.querySelector('color-picker[name="config.color"]'), i = (n == null ? void 0 : n.value) ?? null, r = ((a = n == null ? void 0 : n.ui) == null ? void 0 : a.text) ?? ((l = n == null ? void 0 : n.querySelector) == null ? void 0 : l.call(n, 'input[type="text"]')), o = ((c = n == null ? void 0 : n.ui) == null ? void 0 : c.input) ?? ((u = n == null ? void 0 : n.querySelector) == null ? void 0 : u.call(n, 'input[type="color"]'));
  b("LightPresets | Color state after apply", {
    ...t,
    textValue: (r == null ? void 0 : r.value) ?? null,
    pickerValue: i,
    swatchValue: (o == null ? void 0 : o.value) ?? null
  });
}
s(wr, "logAppliedColorState");
function _s(e) {
  e.querySelectorAll("select[data-category-id]").forEach((t) => {
    t.value = "";
  });
}
s(_s, "resetCategorySelections");
function Rs(e) {
  const t = {};
  return e.querySelectorAll("select[data-category-id]").forEach((n) => {
    var o, a;
    const i = n.dataset.categoryId, r = (a = (o = n.value) == null ? void 0 : o.trim) == null ? void 0 : a.call(o);
    !i || !r || (t[i] = r);
  }), Object.keys(t).length > 0 ? t : null;
}
s(Rs, "readCategorySelections");
function bo(e) {
  const t = (e == null ? void 0 : e.object) ?? (e == null ? void 0 : e.document) ?? null;
  return !(t != null && t.isEmbedded) || t.documentName !== "AmbientLight" ? null : t;
}
s(bo, "getAmbientLightDocument");
function Hs(e) {
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
s(Hs, "getPersistedAmbientLightDocument");
function $s() {
  Ss();
}
s($s, "registerLightPresetHooks");
$s();
const Ri = /* @__PURE__ */ new Map();
let Hi = !1;
function Yi(e, t) {
  Ri.has(e) && console.warn(`[${E}] Socket handler for type "${e}" already registered, overwriting.`), Ri.set(e, t);
}
s(Yi, "registerSocketHandler");
function $i(e, t) {
  if (!Hi) {
    console.error(`[${E}] Socket not initialized. Call initializeSocket() first.`);
    return;
  }
  game.socket.emit(`module.${E}`, { type: e, payload: t });
}
s($i, "emitSocket");
function Vs() {
  Hi || (game.socket.on(`module.${E}`, (e) => {
    const { type: t, payload: n } = e ?? {}, i = Ri.get(t);
    i ? i(n) : console.warn(`[${E}] No socket handler for type "${t}"`);
  }), Hi = !0, console.log(`[${E}] Socket initialized on channel module.${E}`));
}
s(Vs, "initializeSocket");
const Oo = "tween", vo = "tween-sequence", Eo = "tween-sequence-cancel", ve = Object.freeze({
  ABORT: "abort",
  CONTINUE: "continue"
}), hn = /* @__PURE__ */ new Map();
function Qi({ type: e, execute: t, validate: n }) {
  hn.has(e) && console.warn(`[tween-registry] Type "${e}" already registered, overwriting.`), hn.set(e, { type: e, execute: t, validate: n ?? (() => {
  }) });
}
s(Qi, "registerTweenType");
function Xi(e) {
  return hn.get(e);
}
s(Xi, "getTweenType");
function Vi() {
  return [...hn.keys()];
}
s(Vi, "listTweenTypes");
function wo(e) {
  const t = foundry.canvas.animation.CanvasAnimation;
  return {
    linear: t.easeLinear,
    easeInOutCosine: t.easeInOutCosine
  }[e] ?? t.easeInOutCosine;
}
s(wo, "resolveEasing");
function yn(e) {
  return e <= 0.04045 ? e / 12.92 : ((e + 0.055) / 1.055) ** 2.4;
}
s(yn, "srgbToLinear");
function Ot(e) {
  return e <= 31308e-7 ? 12.92 * e : 1.055 * e ** (1 / 2.4) - 0.055;
}
s(Ot, "linearToSrgb");
function Sr(e, t, n) {
  const i = 0.4122214708 * e + 0.5363325363 * t + 0.0514459929 * n, r = 0.2119034982 * e + 0.6806995451 * t + 0.1073969566 * n, o = 0.0883024619 * e + 0.2817188376 * t + 0.6299787005 * n, a = Math.cbrt(i), l = Math.cbrt(r), c = Math.cbrt(o);
  return [
    0.2104542553 * a + 0.793617785 * l - 0.0040720468 * c,
    1.9779984951 * a - 2.428592205 * l + 0.4505937099 * c,
    0.0259040371 * a + 0.7827717662 * l - 0.808675766 * c
  ];
}
s(Sr, "linearRgbToOklab");
function ks(e, t, n) {
  const i = (e + 0.3963377774 * t + 0.2158037573 * n) ** 3, r = (e - 0.1055613458 * t - 0.0638541728 * n) ** 3, o = (e - 0.0894841775 * t - 1.291485548 * n) ** 3;
  return [
    4.0767416621 * i - 3.3077115913 * r + 0.2309699292 * o,
    -1.2684380046 * i + 2.6097574011 * r - 0.3413193965 * o,
    -0.0041960863 * i - 0.7034186147 * r + 1.707614701 * o
  ];
}
s(ks, "oklabToLinearRgb");
function pn(e) {
  return [e.r, e.g, e.b];
}
s(pn, "colorToRgb");
function So(e, t, n) {
  const i = /* @__PURE__ */ s((o) => Math.max(0, Math.min(1, o)), "clamp"), r = /* @__PURE__ */ s((o) => Math.round(i(o) * 255).toString(16).padStart(2, "0"), "toHex");
  return `#${r(e)}${r(t)}${r(n)}`;
}
s(So, "rgbToHex");
function xs(e, t, n) {
  if (n <= 0) return e.toHTML();
  if (n >= 1) return t.toHTML();
  const i = foundry.utils.Color, [r, o, a] = e.hsl, [l, c, u] = t.hsl, d = (l - r + 0.5) % 1 - 0.5, y = (r + d * n + 1) % 1, h = o + (c - o) * n, T = a + (u - a) * n;
  return i.fromHSL([y, h, T]).toHTML();
}
s(xs, "interpolateHsl");
function js(e, t, n) {
  if (n <= 0) return e.toHTML();
  if (n >= 1) return t.toHTML();
  const [i, r, o] = pn(e).map(yn), [a, l, c] = pn(t).map(yn), u = Ot(i + (a - i) * n), d = Ot(r + (l - r) * n), y = Ot(o + (c - o) * n);
  return So(u, d, y);
}
s(js, "interpolateRgb");
function Us(e, t, n) {
  if (n <= 0) return e.toHTML();
  if (n >= 1) return t.toHTML();
  const [i, r, o] = pn(e).map(yn), [a, l, c] = pn(t).map(yn), [u, d, y] = Sr(i, r, o), [h, T, m] = Sr(a, l, c), v = 0.02, w = Math.sqrt(d * d + y * y), O = Math.sqrt(T * T + m * m);
  let L, A, P;
  if (w < v || O < v)
    L = u + (h - u) * n, A = d + (T - d) * n, P = y + (m - y) * n;
  else {
    const B = Math.atan2(y, d);
    let q = Math.atan2(m, T) - B;
    q > Math.PI && (q -= 2 * Math.PI), q < -Math.PI && (q += 2 * Math.PI), L = u + (h - u) * n;
    const ie = w + (O - w) * n, I = B + q * n;
    A = ie * Math.cos(I), P = ie * Math.sin(I);
  }
  const [R, x, F] = ks(L, A, P);
  return So(Ot(R), Ot(x), Ot(F));
}
s(Us, "interpolateOklch");
const ki = {
  hsl: xs,
  rgb: js,
  oklch: Us
};
function qs(e = "hsl") {
  return ki[e] ?? ki.hsl;
}
s(qs, "getInterpolator");
function Ir() {
  return Object.keys(ki);
}
s(Ir, "listInterpolationModes");
function Bs(e) {
  if ((Array.isArray(e.uuid) ? e.uuid : [e.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("light-color tween: 'uuid' is required (string or array of AmbientLight document UUIDs).");
  if (e.toColor == null && e.toAlpha == null)
    throw new Error("light-color tween: at least one of 'toColor' or 'toAlpha' is required.");
  if (e.toColor != null) {
    if (typeof e.toColor != "string")
      throw new Error("light-color tween: 'toColor' must be a CSS color string.");
    if (!foundry.utils.Color.fromString(e.toColor).valid)
      throw new Error(`light-color tween: invalid target color "${e.toColor}".`);
  }
  if (e.toAlpha != null && (typeof e.toAlpha != "number" || e.toAlpha < 0 || e.toAlpha > 1))
    throw new Error("light-color tween: 'toAlpha' must be a number between 0 and 1.");
  if (e.mode && !Ir().includes(e.mode))
    throw new Error(
      `light-color tween: unknown mode "${e.mode}". Available: ${Ir().join(", ")}`
    );
}
s(Bs, "validate$2");
async function Gs(e, t = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { Color: i } = foundry.utils, { uuid: r, toColor: o, toAlpha: a, mode: l = "oklch" } = e, c = Array.isArray(r) ? r : [r];
  if (c.length === 0)
    return console.warn("light-color tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: u = 2e3,
    easing: d = "easeInOutCosine",
    commit: y = !0,
    startEpochMS: h = null
  } = t, T = wo(d), m = o != null, v = a != null, w = m ? qs(l) : null, O = m ? i.fromString(o) : null;
  if (m && !O.valid) throw new Error(`light-color tween: invalid target color "${o}".`);
  async function L(P) {
    var $, V;
    const R = await fromUuid(P);
    if (!R) return !1;
    const x = R.object;
    if (!x) return !1;
    let F;
    if (m) {
      const p = ($ = R.config) == null ? void 0 : $.color;
      p != null && p.valid || console.warn(`light-color tween: source color invalid on ${P}, using white.`), F = p != null && p.valid ? p : i.fromString("#ffffff");
    }
    const B = v ? ((V = R._source.config) == null ? void 0 : V.alpha) ?? 0.5 : null, H = { t: 0 }, q = `ambient-hue-tween:${P}`;
    n.terminateAnimation(q);
    const ie = typeof h == "number" ? Math.max(0, Math.min(u, Date.now() - h)) : 0, I = /* @__PURE__ */ s((p) => {
      const W = {};
      m && (W.color = w(F, O, p)), v && (W.alpha = B + (a - B) * p), R.updateSource({ config: W }), x.initializeLightSource();
    }, "applyFrame");
    ie > 0 && (H.t = ie / u, I(H.t));
    const j = await n.animate(
      [{ parent: H, attribute: "t", to: 1 }],
      {
        name: q,
        duration: u,
        easing: T,
        time: ie,
        ontick: /* @__PURE__ */ s(() => I(H.t), "ontick")
      }
    );
    if (j !== !1) {
      const p = {};
      m && (p.color = O.toHTML()), v && (p.alpha = a), R.updateSource({ config: p }), x.initializeLightSource();
    }
    if (y && j !== !1 && R.canUserModify(game.user, "update")) {
      const p = {}, W = {};
      m && (p.color = F.toHTML(), W["config.color"] = O.toHTML()), v && (p.alpha = B, W["config.alpha"] = a), R.updateSource({ config: p }), await R.update(W);
    }
    return j !== !1;
  }
  return s(L, "animateOne"), (await Promise.all(c.map(L))).every(Boolean);
}
s(Gs, "execute$2");
function zs() {
  Qi({ type: "light-color", execute: Gs, validate: Bs });
}
s(zs, "registerLightColorTween");
const je = /* @__PURE__ */ new WeakMap();
function Ws(e) {
  if ((Array.isArray(e.uuid) ? e.uuid : [e.uuid]).some((n) => !n || typeof n != "string"))
    throw new Error("light-state tween: 'uuid' is required (string or array of AmbientLight document UUIDs).");
  if (typeof e.enabled != "boolean")
    throw new Error("light-state tween: 'enabled' (boolean) is required.");
}
s(Ws, "validate$1");
async function Js(e, t = {}) {
  const { CanvasAnimation: n } = foundry.canvas.animation, { uuid: i, enabled: r } = e, o = Array.isArray(i) ? i : [i];
  if (o.length === 0)
    return console.warn("light-state tween: empty uuid array, nothing to animate."), !0;
  const {
    durationMS: a = 2e3,
    easing: l = "easeInOutCosine",
    commit: c = !0,
    startEpochMS: u = null
  } = t, d = wo(l);
  async function y(T) {
    var R, x, F, B;
    const m = await fromUuid(T);
    if (!m) return !1;
    const v = m.object;
    if (!v) return !1;
    const w = `ambient-state-tween:${T}`;
    n.terminateAnimation(w);
    const O = je.get(m) ?? {
      hidden: m._source.hidden,
      alpha: ((R = m._source.config) == null ? void 0 : R.alpha) ?? 0.5
    };
    if (je.set(m, O), b(`light-state START ${r ? "ON" : "OFF"} | snap: ${JSON.stringify(O)} | _source.hidden=${m._source.hidden}, _source.config.alpha=${(x = m._source.config) == null ? void 0 : x.alpha}`), r && !O.hidden || !r && O.hidden)
      return je.delete(m), !0;
    const L = O.alpha, A = typeof u == "number" ? Math.max(0, Math.min(a, Date.now() - u)) : 0, P = /* @__PURE__ */ s((H) => {
      m.updateSource({ config: { alpha: H } }), v.initializeLightSource();
    }, "applyAlpha");
    if (r) {
      m.updateSource({ hidden: !1, config: { alpha: 0 } }), v.initializeLightSource(), canvas.perception.update({ refreshLighting: !0, refreshVision: !0 });
      const H = { t: 0 };
      A > 0 && (H.t = A / a, P(L * H.t));
      const q = await n.animate(
        [{ parent: H, attribute: "t", to: 1 }],
        {
          name: w,
          duration: a,
          easing: d,
          time: A,
          ontick: /* @__PURE__ */ s(() => P(L * H.t), "ontick")
        }
      );
      return q !== !1 && c && m.canUserModify(game.user, "update") ? (m.updateSource({ hidden: !0, config: { alpha: L } }), await m.update({ hidden: !1 }), b(`light-state FADE-IN committed. _source.hidden=${m._source.hidden}, _source.config.alpha=${(F = m._source.config) == null ? void 0 : F.alpha}`), je.delete(m)) : q === !1 || je.delete(m), q !== !1;
    } else {
      m.updateSource({ hidden: !1, config: { alpha: O.alpha } }), v.initializeLightSource();
      const H = { t: 0 };
      A > 0 && (H.t = A / a, P(L * (1 - H.t)));
      const q = await n.animate(
        [{ parent: H, attribute: "t", to: 1 }],
        {
          name: w,
          duration: a,
          easing: d,
          time: A,
          ontick: /* @__PURE__ */ s(() => P(L * (1 - H.t)), "ontick")
        }
      );
      return q !== !1 && c && m.canUserModify(game.user, "update") ? (await m.update({ hidden: !0 }), m.updateSource({ config: { alpha: L } }), v.initializeLightSource(), b(`light-state FADE-OUT committed+restored. _source.hidden=${m._source.hidden}, _source.config.alpha=${(B = m._source.config) == null ? void 0 : B.alpha}`), je.delete(m)) : q === !1 || (m.updateSource({ hidden: !0, config: { alpha: L } }), v.initializeLightSource(), je.delete(m)), q !== !1;
    }
  }
  return s(y, "animateOne"), (await Promise.all(o.map(y))).every(Boolean);
}
s(Js, "execute$1");
function Ks() {
  Qi({ type: "light-state", execute: Js, validate: Ws });
}
s(Ks, "registerLightStateTween");
var Be, Vt, kt;
const nr = class nr {
  /**
   * @param {AbortController} controller
   */
  constructor(t) {
    C(this, Be);
    C(this, Vt);
    C(this, kt);
    N(this, Be, t), N(this, kt, new Promise((n) => {
      N(this, Vt, n);
    }));
  }
  /** @returns {Promise<boolean>} Resolves true (completed) or false (cancelled). */
  get finished() {
    return g(this, kt);
  }
  /** @returns {boolean} */
  get cancelled() {
    return g(this, Be).signal.aborted;
  }
  /** @returns {AbortSignal} */
  get signal() {
    return g(this, Be).signal;
  }
  /** Abort the timeline, triggering onCancel callbacks. */
  cancel() {
    g(this, Be).signal.aborted || g(this, Be).abort();
  }
  /**
   * Called internally by the execution engine when the timeline finishes.
   * @param {boolean} completed - true if all steps ran, false if cancelled
   */
  _resolve(t) {
    g(this, Vt).call(this, t);
  }
};
Be = new WeakMap(), Vt = new WeakMap(), kt = new WeakMap(), s(nr, "TimelineHandle");
let xi = nr;
const ht = /* @__PURE__ */ new Map();
function Ys(e, t) {
  const n = ht.get(e);
  n && !n.cancelled && n.cancel(), ht.set(e, t), t.finished.then(() => {
    ht.get(e) === t && ht.delete(e);
  });
}
s(Ys, "registerTimeline");
function Io(e) {
  const t = ht.get(e);
  return t && !t.cancelled ? (t.cancel(), !0) : !1;
}
s(Io, "cancelTimeline");
function Qs(e) {
  return ht.get(e);
}
s(Qs, "getTimeline");
function Xs(e, t) {
  return e <= 0 ? Promise.resolve() : new Promise((n, i) => {
    if (t.aborted) return i(t.reason);
    const r = setTimeout(n, e);
    t.addEventListener("abort", () => {
      clearTimeout(r), i(t.reason);
    }, { once: !0 });
  });
}
s(Xs, "cancellableDelay");
var Se, Ge, xt, jt;
const ir = class ir {
  constructor(t) {
    /** @type {TweenTimeline} */
    C(this, Se);
    /** @type {Array<{ type: string, params: object, opts?: object, detach: boolean }>} */
    C(this, Ge, []);
    /** @type {Function|null} */
    C(this, xt, null);
    /** @type {Function|null} */
    C(this, jt, null);
    N(this, Se, t);
  }
  /**
   * Add a tween entry to this step.
   * @param {string} type  Registered tween type name
   * @param {object} params  Type-specific parameters
   * @param {object} [opts]  Options (durationMS, easing, etc.)
   * @returns {StepBuilder} this
   */
  add(t, n, i) {
    return g(this, Ge).push({ type: t, params: n, opts: i ?? {}, detach: !1 }), this;
  }
  /**
   * Mark the last entry as fire-and-forget (does not block step progression).
   * @returns {StepBuilder} this
   */
  detach() {
    if (g(this, Ge).length === 0)
      throw new Error("StepBuilder.detach(): no entry to detach.");
    return g(this, Ge)[g(this, Ge).length - 1].detach = !0, this;
  }
  /**
   * Callback invoked before this step's tweens start.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  before(t) {
    return N(this, xt, t), this;
  }
  /**
   * Callback invoked after this step's awaited tweens complete.
   * @param {Function} fn
   * @returns {StepBuilder} this
   */
  after(t) {
    return N(this, jt, t), this;
  }
  // ── Delegation to parent TweenTimeline for fluent chaining ──
  /** Start a new step (finalizes this one). */
  step() {
    return g(this, Se).step();
  }
  /** Insert a delay between steps. */
  delay(t) {
    return g(this, Se).delay(t);
  }
  /** Register onComplete callback. */
  onComplete(t) {
    return g(this, Se).onComplete(t);
  }
  /** Register onCancel callback. */
  onCancel(t) {
    return g(this, Se).onCancel(t);
  }
  /** Execute the timeline. */
  run(t) {
    return g(this, Se).run(t);
  }
  /** Serialize the timeline. */
  toJSON() {
    return g(this, Se).toJSON();
  }
  // ── Internal access ──
  /** @returns {{ entries: Array, before: Function|null, after: Function|null }} */
  _finalize() {
    return {
      entries: g(this, Ge),
      before: g(this, xt),
      after: g(this, jt)
    };
  }
};
Se = new WeakMap(), Ge = new WeakMap(), xt = new WeakMap(), jt = new WeakMap(), s(ir, "StepBuilder");
let ji = ir;
var he, Pe, st, ze, Ut, qt, Bt, Fe, Pt, Lo;
const rr = class rr {
  constructor() {
    C(this, Fe);
    /** @type {string|null} */
    C(this, he, null);
    /** @type {string} */
    C(this, Pe, ve.ABORT);
    /** @type {Array<{ kind: "step", data: object } | { kind: "delay", ms: number }>} */
    C(this, st, []);
    /** @type {StepBuilder|null} */
    C(this, ze, null);
    /** @type {Function|null} */
    C(this, Ut, null);
    /** @type {Function|null} */
    C(this, qt, null);
    /** @type {Function|null} */
    C(this, Bt, null);
  }
  /**
   * Register this timeline in the named registry. Starting a new
   * timeline with the same name cancels the previous one.
   * @param {string} name
   * @returns {TweenTimeline} this
   */
  name(t) {
    return N(this, he, t), this;
  }
  /**
   * Set the error policy for step execution.
   * @param {"abort"|"continue"} policy
   * @returns {TweenTimeline} this
   */
  errorPolicy(t) {
    if (t !== ve.ABORT && t !== ve.CONTINUE)
      throw new Error(`Invalid error policy: "${t}". Use "abort" or "continue".`);
    return N(this, Pe, t), this;
  }
  /**
   * Start a new step. Finalizes the previous step if one is open.
   * @returns {StepBuilder}
   */
  step() {
    return S(this, Fe, Pt).call(this), N(this, ze, new ji(this)), g(this, ze);
  }
  /**
   * Insert a delay (in ms) between the previous step and the next.
   * @param {number} ms
   * @returns {TweenTimeline} this
   */
  delay(t) {
    return S(this, Fe, Pt).call(this), g(this, st).push({ kind: "delay", ms: t }), this;
  }
  /**
   * Callback invoked before the first step runs.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  beforeAll(t) {
    return N(this, Ut, t), this;
  }
  /**
   * Callback invoked on successful completion.
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onComplete(t) {
    return N(this, qt, t), this;
  }
  /**
   * Callback invoked on cancellation (mutually exclusive with onComplete).
   * @param {Function} fn
   * @returns {TweenTimeline} this
   */
  onCancel(t) {
    return N(this, Bt, t), this;
  }
  /**
   * Execute the timeline.
   * @param {object} [opts]
   * @param {boolean} [opts.commit]     Default true for GM, false for socket receivers
   * @param {number}  [opts.startEpochMS]  For socket sync
   * @param {boolean} [opts.broadcast]  Default game.user.isGM, gates socket emission
   * @returns {TimelineHandle}
   */
  run(t = {}) {
    S(this, Fe, Pt).call(this);
    const n = new AbortController(), i = new xi(n);
    g(this, he) && Ys(g(this, he), i);
    const r = t.broadcast ?? game.user.isGM, o = t.commit ?? game.user.isGM, a = t.startEpochMS ?? Date.now();
    return r && g(this, he) && $i(vo, {
      name: g(this, he),
      data: this.toJSON(),
      startEpochMS: a
    }), S(this, Fe, Lo).call(this, i, { commit: o, startEpochMS: a }).then((l) => {
      var c, u;
      i._resolve(l), l ? (c = g(this, qt)) == null || c.call(this) : ((u = g(this, Bt)) == null || u.call(this), r && g(this, he) && $i(Eo, { name: g(this, he) }));
    }), i;
  }
  /**
   * Serialize the timeline to a JSON-safe object (steps/delays only, no hooks).
   * @returns {object}
   */
  toJSON() {
    S(this, Fe, Pt).call(this);
    const t = [];
    for (const i of g(this, st))
      if (i.kind === "delay")
        t.push({ delay: i.ms });
      else {
        const r = i.data.entries.map((o) => {
          const a = { type: o.type, params: o.params };
          return Object.keys(o.opts).length > 0 && (a.opts = o.opts), o.detach && (a.detach = !0), a;
        });
        t.push(r);
      }
    const n = { timeline: t };
    return g(this, he) && (n.name = g(this, he)), g(this, Pe) !== ve.ABORT && (n.errorPolicy = g(this, Pe)), n;
  }
};
he = new WeakMap(), Pe = new WeakMap(), st = new WeakMap(), ze = new WeakMap(), Ut = new WeakMap(), qt = new WeakMap(), Bt = new WeakMap(), Fe = new WeakSet(), // ── Private ─────────────────────────────────────────────────────────
Pt = /* @__PURE__ */ s(function() {
  g(this, ze) && (g(this, st).push({ kind: "step", data: g(this, ze)._finalize() }), N(this, ze, null));
}, "#finalizeCurrentStep"), Lo = /* @__PURE__ */ s(async function(t, { commit: n, startEpochMS: i }) {
  var o;
  const r = t.signal;
  try {
    if (r.aborted) return !1;
    await ((o = g(this, Ut)) == null ? void 0 : o.call(this));
    let a = 0;
    const l = [];
    for (const c of g(this, st)) {
      if (r.aborted) return !1;
      if (c.kind === "delay") {
        await Xs(c.ms, r), a += c.ms;
        continue;
      }
      const { entries: u, before: d, after: y } = c.data;
      if (await (d == null ? void 0 : d()), r.aborted) return !1;
      const h = [];
      let T = 0;
      for (const v of u) {
        const w = Xi(v.type);
        if (!w) {
          const P = `TweenTimeline: unknown tween type "${v.type}"`;
          if (g(this, Pe) === ve.ABORT) throw new Error(P);
          console.warn(P);
          continue;
        }
        const O = {
          ...v.opts,
          commit: n,
          startEpochMS: i + a
        }, L = O.durationMS ?? 2e3, A = w.execute(v.params, O).catch((P) => {
          if (g(this, Pe) === ve.ABORT) throw P;
          return console.warn(`TweenTimeline: entry "${v.type}" failed:`, P), !1;
        });
        v.detach ? l.push(A) : (h.push(A), T = Math.max(T, L));
      }
      const m = await Promise.all(h);
      if (g(this, Pe) === ve.ABORT && m.some((v) => v === !1))
        throw new Error("TweenTimeline: a step entry returned false (abort policy).");
      if (await (y == null ? void 0 : y()), r.aborted) return !1;
      a += T;
    }
    return await Promise.allSettled(l), !r.aborted;
  } catch (a) {
    return r.aborted || console.error("TweenTimeline execution error:", a), !1;
  }
}, "#execute"), s(rr, "TweenTimeline");
let Tn = rr;
function Co(e) {
  if (!e || typeof e != "object")
    throw new Error("Sequence JSON: data must be an object.");
  if (!Array.isArray(e.timeline))
    throw new Error("Sequence JSON: 'timeline' must be an array.");
  if (e.name != null && typeof e.name != "string")
    throw new Error("Sequence JSON: 'name' must be a string.");
  if (e.errorPolicy != null && e.errorPolicy !== ve.ABORT && e.errorPolicy !== ve.CONTINUE)
    throw new Error(`Sequence JSON: 'errorPolicy' must be "abort" or "continue".`);
  for (let t = 0; t < e.timeline.length; t++) {
    const n = e.timeline[t];
    if (!Array.isArray(n)) {
      if (typeof n != "object" || typeof n.delay != "number" || n.delay < 0)
        throw new Error(`Sequence JSON: timeline[${t}] must be a step array or { delay: <ms> }.`);
      continue;
    }
    if (n.length === 0)
      throw new Error(`Sequence JSON: timeline[${t}] is an empty step.`);
    for (let i = 0; i < n.length; i++) {
      const r = n[i];
      if (!r || typeof r != "object")
        throw new Error(`Sequence JSON: timeline[${t}][${i}] must be an object.`);
      if (typeof r.type != "string" || !r.type)
        throw new Error(`Sequence JSON: timeline[${t}][${i}].type must be a non-empty string.`);
      if (r.params != null && typeof r.params != "object")
        throw new Error(`Sequence JSON: timeline[${t}][${i}].params must be an object.`);
      if (r.opts != null && typeof r.opts != "object")
        throw new Error(`Sequence JSON: timeline[${t}][${i}].opts must be an object.`);
      if (r.detach != null && typeof r.detach != "boolean")
        throw new Error(`Sequence JSON: timeline[${t}][${i}].detach must be a boolean.`);
    }
  }
}
s(Co, "validateSequenceJSON");
function Zi(e) {
  Co(e);
  const t = new Tn();
  e.name && t.name(e.name), e.errorPolicy && t.errorPolicy(e.errorPolicy);
  for (const n of e.timeline) {
    if (!Array.isArray(n)) {
      t.delay(n.delay);
      continue;
    }
    const i = t.step();
    for (const r of n)
      i.add(r.type, r.params ?? {}, r.opts), r.detach && i.detach();
  }
  return t;
}
s(Zi, "compileSequence");
function Zs(e) {
  Co(e);
}
s(Zs, "validate");
async function ea(e, t = {}) {
  return Zi(e).run({
    broadcast: !1,
    commit: t.commit,
    startEpochMS: t.startEpochMS
  }).finished;
}
s(ea, "execute");
function ta() {
  Qi({ type: "sequence", execute: ea, validate: Zs });
}
s(ta, "registerSequenceTween");
async function na(e, t, n = {}) {
  if (!game.user.isGM)
    return ui.notifications.warn("Only the GM can dispatch tweens."), !1;
  const i = Xi(e);
  if (!i)
    throw new Error(`Unknown tween type: "${e}". Registered types: ${Vi().join(", ")}`);
  i.validate(t);
  const { durationMS: r = 2e3, easing: o = "easeInOutCosine", commit: a = !0 } = n, l = Date.now();
  return $i(Oo, {
    type: e,
    params: t,
    durationMS: r,
    easing: o,
    startEpochMS: l,
    commit: !1
  }), i.execute(t, { durationMS: r, easing: o, commit: a, startEpochMS: l });
}
s(na, "dispatchTween");
function ia(e) {
  const { type: t, params: n, durationMS: i, easing: r, startEpochMS: o, commit: a } = e ?? {}, l = Xi(t);
  if (!l) {
    console.warn(`[${E}] Received unknown tween type over socket: "${t}"`);
    return;
  }
  l.execute(n, {
    durationMS: i,
    easing: r,
    commit: a ?? !1,
    startEpochMS: o
  });
}
s(ia, "handleTweenSocketMessage");
zs();
Ks();
ta();
Yi(Oo, ia);
Yi(vo, ra);
Yi(Eo, oa);
function ra(e) {
  const { data: t, startEpochMS: n } = e ?? {};
  if (!t) {
    console.warn(`[${E}] Received empty tween-sequence socket message.`);
    return;
  }
  try {
    Zi(t).run({ commit: !1, startEpochMS: n, broadcast: !1 });
  } catch (i) {
    console.error(`[${E}] Failed to run received tween sequence:`, i);
  }
}
s(ra, "handleSequenceSocketMessage");
function oa(e) {
  const { name: t } = e ?? {};
  t && Io(t);
}
s(oa, "handleSequenceCancelMessage");
function sa() {
  Hooks.once("ready", () => {
    Vs();
    const e = game.modules.get(E);
    e.api || (e.api = {}), e.api.tween = {
      dispatch: na,
      types: Vi,
      Timeline: Tn,
      ErrorPolicy: ve,
      compileSequence: Zi,
      cancelTimeline: Io,
      getTimeline: Qs
    }, console.log(`[${E}] Tween API registered. Types: ${Vi().join(", ")}`);
  });
}
s(sa, "registerTweenHooks");
sa();
//# sourceMappingURL=eidolon-utilities.js.map
